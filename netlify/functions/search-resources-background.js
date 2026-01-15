// search-resources-background.js
// Background function for menopause resource search

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisSet(key, value, exSeconds = 600) {
  const response = await fetch(`${UPSTASH_URL}/set/${key}?EX=${exSeconds}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    body: JSON.stringify(value)
  });
  return response.json();
}

export const handler = async (event, context) => {
  console.log('Menopause search background function triggered');
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { 
    jobId, 
    category, 
    categoryName, 
    categoryHelps, 
    location, 
    preference,
    symptoms,
    seeking,
    menopauseStage,
    doctorExperience,
    medicalFlags
  } = JSON.parse(event.body);
  
  console.log('Job ID:', jobId, 'Location:', location, 'Category:', categoryName);

  try {
    // Update status to "searching" immediately
    console.log('Writing pending status to Redis...');
    await redisSet(jobId, {
      status: 'searching',
      createdAt: Date.now()
    });
    console.log('Redis write complete, starting search...');

    // Build preference text
    let preferenceText = "";
    if (preference === "local") {
      preferenceText = "Focus on IN-PERSON services only - clinics, doctors with physical offices, local support groups that meet face-to-face.";
    } else if (preference === "remote") {
      preferenceText = "Focus on REMOTE/TELEHEALTH services only - online consultations, virtual support groups, telehealth providers who serve this region.";
    } else {
      preferenceText = "Include BOTH in-person local services AND remote/telehealth options that serve this area.";
    }

    // Build symptom context
    const symptomText = symptoms && symptoms.length > 0 
      ? `Primary symptoms to address: ${symptoms.join(', ')}.` 
      : '';

    // Build seeking context
    const seekingMap = {
      'understand': 'educational resources and general information',
      'gp': 'menopause-trained GPs or nurse practitioners',
      'specialist': 'menopause specialists or dedicated clinics',
      'hrt': 'providers experienced with hormone therapy',
      'non-hormonal': 'providers offering non-hormonal treatments',
      'mental-health': 'mental health support with understanding of hormonal impacts',
      'pelvic': 'pelvic floor physiotherapists',
      'nutrition': 'dietitians with menopause expertise',
      'support-group': 'peer support groups and community',
      'specific-symptom': 'specialists for specific symptom management'
    };
    
    const seekingText = seeking && seeking.length > 0
      ? `Specifically looking for: ${seeking.map(s => seekingMap[s] || s).join(', ')}.`
      : '';

    // Build medical context
    const hasFlags = medicalFlags && medicalFlags.length > 0 && !medicalFlags.includes('none');
    const medicalText = hasFlags
      ? `Note: This person has medical history factors (like breast cancer history, blood clots, etc.) that may require specialist guidance for treatment decisions. Emphasize providers experienced with complex cases.`
      : '';

    // Build the comprehensive search prompt
    const systemPrompt = `You are a compassionate menopause support navigator. Your job is to search for and compile REAL, SPECIFIC resources for someone seeking menopause support.

CRITICAL INSTRUCTIONS:
1. Search for ACTUAL providers, clinics, and services in or serving the specified location
2. Prioritize finding NAMED INDIVIDUALS where possible - specific doctors, specialists, dietitians by name
3. Look for menopause-TRAINED or menopause-SPECIALIZED providers, not just general practitioners
4. Include a MIX of:
   - GPs known for menopause expertise (by name if possible)
   - Menopause specialists or dedicated menopause clinics
   - Women's health doctors with HRT experience
   - Dietitians with menopause/women's health focus
   - Pelvic floor physiotherapists
   - Mental health providers who understand hormonal impacts
   - Support groups (including free peer support options)
   - Telehealth menopause services (these are growing rapidly)
5. For each resource, provide: name, type, description, website URL (if available), phone (if available)
6. Verify that resources actually exist and serve the specified location
7. Group resources into logical categories
8. Note which providers offer free consultations or discovery calls

${preferenceText}

The person is at "${categoryName}" stage. Resources that typically help at this stage include:
${categoryHelps.map(h => `- ${h}`).join('\n')}

${symptomText}
${seekingText}
${medicalText}

IMPORTANT SEARCH GUIDANCE:
- Search for "menopause specialist [location]", "menopause clinic [location]", "menopause trained GP [location]"
- Search for telehealth menopause services that serve this region/country
- Look for Australasian Menopause Society members if in Australia/NZ
- Look for British Menopause Society practitioners if in UK
- Search for HAES or non-diet dietitians with women's health focus
- Search for women's health physiotherapy or pelvic floor physio
- Look for menopause support groups, both local and online

Take your time to find quality, relevant resources. This information could meaningfully help someone navigate a challenging life transition.`;

    const userPrompt = `Please search for menopause support resources in or serving: ${location}

Find real, specific resources including:
1. GPs or doctors known for menopause expertise (names if possible)
2. Menopause specialists or dedicated menopause clinics
3. Telehealth menopause services that serve this area
4. Dietitians with women's health or menopause focus
5. Pelvic floor physiotherapists
6. Mental health providers who understand hormonal impacts
7. Support groups (professional and peer-led)
8. Any sliding scale or accessible options

Return your findings as JSON in this exact format:
{
  "introduction": "Brief supportive intro about what you found for this location, acknowledging both local options and telehealth possibilities",
  "categories": [
    {
      "name": "Category Name",
      "resources": [
        {
          "name": "Provider or Service Name",
          "type": "GP|Specialist|Clinic|Dietitian|Physio|Mental Health|Support Group|Telehealth",
          "description": "What they offer, specialties, approach",
          "url": "https://...",
          "phone": "phone number if available",
          "notes": "Free consult available, telehealth offered, HRT expertise, etc."
        }
      ]
    }
  ],
  "additionalNotes": "Any helpful context about menopause support in this region"
}

Search thoroughly and return ONLY the JSON, no other text.`;

    // Make the API call with web search
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system: systemPrompt,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: userPrompt }]
    });

    // Extract text response
    let textContent = "";
    for (const block of response.content) {
      if (block.type === "text") {
        textContent += block.text;
      }
    }

    // Parse the JSON response
    let results;
    try {
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        results = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      results = {
        introduction: "We found some resources for you, though we had trouble formatting them perfectly.",
        categories: [{
          name: "Search Results",
          resources: [{
            name: "Raw Results",
            type: "Information",
            description: textContent.substring(0, 1000),
            url: null,
            phone: null
          }]
        }],
        additionalNotes: "Please try searching again for better formatted results."
      };
    }

    // Store successful results in Redis
    console.log('Search complete, storing results...');
    await redisSet(jobId, {
      status: 'complete',
      completedAt: Date.now(),
      results: results
    });
    console.log('Results stored successfully');

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'complete' })
    };

  } catch (error) {
    console.error('Background search error:', error);
    
    // Store error status in Redis
    await redisSet(jobId, {
      status: 'error',
      error: error.message || 'Search failed',
      completedAt: Date.now()
    });

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
