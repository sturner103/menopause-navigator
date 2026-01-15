const Anthropic = require("@anthropic-ai/sdk").default;

const client = new Anthropic();

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { url, resourceName, resourceType, categoryName, location } = JSON.parse(event.body);

    if (!resourceName) {
      return { statusCode: 400, body: JSON.stringify({ error: "Resource name is required" }) };
    }

    // Build the search/summary prompt
    let searchQuery = resourceName;
    if (location) {
      searchQuery += ` ${location}`;
    }
    if (resourceType) {
      searchQuery += ` ${resourceType}`;
    }

    const systemPrompt = `You are a helpful assistant for women navigating menopause care. Your task is to provide a brief, informative summary about a healthcare provider or resource.

Focus on practical information that would help someone decide if this resource is right for them:
- What services they offer related to menopause, women's health, or the specific area (${categoryName || 'healthcare'})
- Their approach or specializations
- Practical details (location, how to access, cost if known)
- Who might be a good fit for their services

Be concise and factual. If you can't find specific information, say so briefly rather than making assumptions.
Use plain language. Format with short sections using **bold headers** and bullet points where helpful.`;

    const userPrompt = url
      ? `Please search for information about "${resourceName}" (${resourceType || 'healthcare provider'}) and provide a brief summary. Their website may be: ${url}. Focus on their menopause or women's health services if applicable.`
      : `Please search for information about "${resourceName}" ${location ? `in or near ${location}` : ''} (${resourceType || 'healthcare provider'}) and provide a brief summary. Focus on their menopause or women's health services if applicable.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
          max_uses: 3,
        },
      ],
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    // Extract text from response
    let summary = "";
    for (const block of response.content) {
      if (block.type === "text") {
        summary += block.text;
      }
    }

    if (!summary.trim()) {
      summary = `We couldn't find detailed information about ${resourceName} at this time. We recommend visiting their website directly or contacting them for more information about their services.`;
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary }),
    };
  } catch (error) {
    console.error("Error fetching resource details:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not fetch additional details",
        summary: "We couldn't load additional details at this time. Please try visiting the provider's website directly.",
      }),
    };
  }
};
