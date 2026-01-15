import { useState, useEffect } from 'react';
import './App.css';

// ============================================
// DATA & CONFIGURATION
// ============================================

const sections = [
  { id: 'stage', name: 'Your Menopause Stage', questions: [1, 2, 3] },
  { id: 'symptoms', name: 'Your Symptoms', questions: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] },
  { id: 'impact', name: 'Overall Impact', questions: [19] },
  { id: 'medical', name: 'Medical Context', questions: [20] },
  { id: 'journey', name: 'Your Journey So Far', questions: [21, 22] }
];

const scaleOptions = [
  { value: 0, label: "Not experiencing this" },
  { value: 1, label: "Mild — occasionally noticeable" },
  { value: 2, label: "Moderate — regularly affecting me" },
  { value: 3, label: "Severe — significantly impacting my life" }
];

const questions = [
  // Section 1: Menopause Stage
  { id: 1, section: 'stage', text: "Where are you in your menopause journey?", subtext: "This helps us understand what stage of transition you may be in.", type: 'single', options: [
    { value: 'early', label: "I'm noticing changes but still having mostly regular periods" },
    { value: 'irregular', label: "My periods have become irregular, unpredictable, or changed in flow" },
    { value: 'recent-stop', label: "My periods have stopped in the last 1-2 years" },
    { value: 'post', label: "I haven't had a period in over 2 years" },
    { value: 'hysterectomy', label: "I've had a hysterectomy so I can't track by periods" },
    { value: 'unsure', label: "I'm not sure where I am" }
  ]},
  { id: 2, section: 'stage', text: "How long have you been experiencing symptoms?", subtext: "This gives us context about your journey so far.", type: 'single', options: [
    { value: 'weeks', label: "Just started noticing changes in the last few weeks" },
    { value: 'months', label: "A few months" },
    { value: '6-12', label: "6-12 months" },
    { value: '1-2years', label: "1-2 years" },
    { value: '2+years', label: "More than 2 years" }
  ]},
  { id: 3, section: 'stage', text: "How old are you?", subtext: "Age can affect menopause experience and treatment options.", type: 'single', options: [
    { value: 'under40', label: "Under 40", flag: 'early-menopause' },
    { value: '40-44', label: "40-44" },
    { value: '45-50', label: "45-50" },
    { value: '51-55', label: "51-55" },
    { value: '56-60', label: "56-60" },
    { value: 'over60', label: "Over 60" }
  ]},
  
  // Section 2: Symptoms (scale questions)
  { id: 4, section: 'symptoms', text: "Hot flashes (daytime)", subtext: "Sudden feelings of warmth, often in the upper body.", type: 'scale' },
  { id: 5, section: 'symptoms', text: "Night sweats", subtext: "Waking up damp or drenched during the night.", type: 'scale' },
  { id: 6, section: 'symptoms', text: "Falling asleep", subtext: "Difficulty getting to sleep at bedtime.", type: 'scale' },
  { id: 7, section: 'symptoms', text: "Staying asleep", subtext: "Waking during the night and struggling to get back to sleep.", type: 'scale' },
  { id: 8, section: 'symptoms', text: "Anxiety", subtext: "Feelings of worry, nervousness, or unease.", type: 'scale', flag: 'mental-health' },
  { id: 9, section: 'symptoms', text: "Low mood or depression", subtext: "Feelings of sadness, hopelessness, or loss of interest.", type: 'scale', flag: 'mental-health' },
  { id: 10, section: 'symptoms', text: "Irritability and emotional regulation", subtext: "Difficulty managing emotions, feeling easily frustrated.", type: 'scale' },
  { id: 11, section: 'symptoms', text: "Brain fog", subtext: "Difficulty thinking clearly, concentrating, or focusing.", type: 'scale' },
  { id: 12, section: 'symptoms', text: "Memory", subtext: "Forgetting words, names, or losing track of thoughts.", type: 'scale' },
  { id: 13, section: 'symptoms', text: "Vaginal dryness", subtext: "Dryness causing discomfort or affecting intimacy.", type: 'scale' },
  { id: 14, section: 'symptoms', text: "Urinary changes", subtext: "Urgency, leakage, or increased frequency.", type: 'scale' },
  { id: 15, section: 'symptoms', text: "Joint and muscle pain", subtext: "New or increased aches, stiffness, or pain.", type: 'scale' },
  { id: 16, section: 'symptoms', text: "Fatigue", subtext: "Persistent tiredness not relieved by rest.", type: 'scale' },
  { id: 17, section: 'symptoms', text: "Weight and body composition changes", subtext: "Changes despite same diet and exercise habits.", type: 'scale' },
  { id: 18, section: 'symptoms', text: "Libido", subtext: "Changes in sexual desire or interest.", type: 'scale' },
  
  // Section 3: Overall Impact
  { id: 19, section: 'impact', text: "How much are menopause symptoms affecting your overall quality of life?", subtext: "Consider impact on work, relationships, and daily activities.", type: 'single', options: [
    { value: 'minimal', label: "Minimal impact — mostly manageable" },
    { value: 'moderate', label: "Moderate impact — noticeable but coping" },
    { value: 'significant', label: "Significant impact — affecting work, relationships, or wellbeing" },
    { value: 'severe', label: "Severe impact — struggling with day-to-day life" }
  ]},
  
  // Section 4: Medical Context
  { id: 20, section: 'medical', text: "Do any of these apply to you?", subtext: "These factors may affect treatment options. Select all that apply.", type: 'multi', options: [
    { value: 'breast-cancer', label: "Personal history of breast cancer", flag: 'medical' },
    { value: 'blood-clots', label: "Personal history of blood clots, DVT, or pulmonary embolism", flag: 'medical' },
    { value: 'stroke-heart', label: "Personal history of stroke or heart disease", flag: 'medical' },
    { value: 'migraines-aura', label: "Migraines with aura", flag: 'medical' },
    { value: 'liver', label: "Liver disease", flag: 'medical' },
    { value: 'bleeding', label: "Undiagnosed vaginal bleeding", flag: 'medical' },
    { value: 'none', label: "None of these apply to me" }
  ]},
  
  // Section 5: Your Journey So Far
  { id: 21, section: 'journey', text: "What's your experience been with doctors regarding menopause?", subtext: "This helps us understand what kind of support would be most helpful.", type: 'single', options: [
    { value: 'no-doctor', label: "I haven't spoken to a doctor about menopause yet" },
    { value: 'dismissed', label: "I've tried but felt dismissed or not taken seriously" },
    { value: 'some-help', label: "I've had some help but still don't feel well" },
    { value: 'treatment-not-working', label: "I'm on treatment but it's not working optimally" },
    { value: 'good-care', label: "I have good care and want complementary support" }
  ]},
  { id: 22, section: 'journey', text: "What have you tried so far?", subtext: "Select all that apply.", type: 'multi', options: [
    { value: 'nothing', label: "Nothing yet, just starting to explore options" },
    { value: 'lifestyle', label: "Lifestyle changes (exercise, diet, stress management)" },
    { value: 'supplements', label: "Supplements or natural remedies" },
    { value: 'hrt', label: "HRT (hormone replacement therapy)" },
    { value: 'antidepressants', label: "Antidepressants or anti-anxiety medication" },
    { value: 'other-rx', label: "Other prescription treatments" },
    { value: 'alternative', label: "Alternative therapies (acupuncture, naturopathy, etc.)" }
  ]}
];

// Resource suggestions for confirmation screen
const resourceSuggestions = [
  { id: 'gp', label: 'Menopause-trained GP', description: 'A GP who understands menopause and treatment options' },
  { id: 'specialist', label: 'Menopause specialist', description: 'A gynecologist or endocrinologist with menopause expertise' },
  { id: 'mental-health', label: 'Mental health support', description: 'Psychologist or counselor who understands hormonal impacts' },
  { id: 'pelvic-floor', label: 'Pelvic floor physiotherapy', description: 'Physio specializing in women\'s health' },
  { id: 'dietitian', label: 'Dietitian', description: 'Nutrition support for bone health, weight, energy' },
  { id: 'support-group', label: 'Support groups', description: 'Connect with others going through similar experiences' },
  { id: 'telehealth', label: 'Telehealth services', description: 'Online menopause consultations' }
];

// ============================================
// MAIN APP COMPONENT
// ============================================

function App() {
  // Navigation state
  const [currentView, setCurrentView] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Assessment state
  const [answers, setAnswers] = useState({});
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  
  // Confirmation screen state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedResources, setSelectedResources] = useState([]);
  const [inferredResources, setInferredResources] = useState([]);
  
  // Results state
  const [location, setLocation] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState('');
  const [searchTime, setSearchTime] = useState(0);
  const [jobId, setJobId] = useState(null);
  const [category, setCategory] = useState('');
  
  // Crisis banner state
  const [showCrisisBanner, setShowCrisisBanner] = useState(false);

  // Calculate assessment progress
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions;
  const progress = (answeredCount / totalQuestions) * 100;

  // Handle answer selection
  const handleAnswer = (questionId, value) => {
    const question = questions.find(q => q.id === questionId);
    
    if (question.type === 'multi') {
      const currentAnswers = answers[questionId] || [];
      if (value === 'none') {
        setAnswers({ ...answers, [questionId]: ['none'] });
      } else {
        let newAnswers;
        if (currentAnswers.includes(value)) {
          newAnswers = currentAnswers.filter(v => v !== value);
        } else {
          newAnswers = [...currentAnswers.filter(v => v !== 'none'), value];
        }
        setAnswers({ ...answers, [questionId]: newAnswers.length ? newAnswers : [] });
      }
    } else {
      setAnswers({ ...answers, [questionId]: value });
    }
  };

  // Infer resources based on answers
  const inferResources = () => {
    const inferred = [];
    const reasons = {};
    
    // Check doctor experience (Q21)
    const doctorExp = answers[21];
    if (doctorExp === 'no-doctor' || doctorExp === 'dismissed') {
      inferred.push('gp');
      reasons['gp'] = doctorExp === 'dismissed' ? 'You deserve to be heard' : 'A good starting point';
    }
    
    // Check for medical flags or early menopause (Q20, Q3)
    const medicalFlags = answers[20] || [];
    const age = answers[3];
    if ((medicalFlags.length > 0 && !medicalFlags.includes('none')) || age === 'under40') {
      inferred.push('specialist');
      reasons['specialist'] = age === 'under40' ? 'Early menopause needs specialist guidance' : 'Your medical history warrants specialist input';
    }
    
    // Check mental health symptoms (Q8, Q9)
    const anxiety = answers[8] || 0;
    const depression = answers[9] || 0;
    if (anxiety >= 2 || depression >= 2) {
      inferred.push('mental-health');
      reasons['mental-health'] = 'Your mood symptoms are significant';
      if (anxiety === 3 || depression === 3) {
        setShowCrisisBanner(true);
      }
    }
    
    // Check pelvic symptoms (Q13, Q14)
    const vaginal = answers[13] || 0;
    const urinary = answers[14] || 0;
    if (vaginal >= 2 || urinary >= 2) {
      inferred.push('pelvic-floor');
      reasons['pelvic-floor'] = 'Pelvic symptoms often respond well to physio';
    }
    
    // Check if treatment not working (Q21) and tried HRT (Q22)
    const triedHRT = (answers[22] || []).includes('hrt');
    if (doctorExp === 'treatment-not-working' && triedHRT) {
      if (!inferred.includes('specialist')) {
        inferred.push('specialist');
        reasons['specialist'] = 'May need HRT adjustment or specialist review';
      }
    }
    
    // Check impact level (Q19)
    const impact = answers[19];
    if ((impact === 'significant' || impact === 'severe') && doctorExp !== 'good-care') {
      if (!inferred.includes('support-group')) {
        inferred.push('support-group');
        reasons['support-group'] = 'Connect with others who understand';
      }
    }
    
    // Suggest telehealth for everyone as easy access option
    if (doctorExp === 'no-doctor' || doctorExp === 'dismissed') {
      inferred.push('telehealth');
      reasons['telehealth'] = 'Quick, convenient first step';
    }
    
    // Always suggest dietitian if fatigue or weight issues
    const fatigue = answers[16] || 0;
    const weight = answers[17] || 0;
    if (fatigue >= 2 || weight >= 2) {
      inferred.push('dietitian');
      reasons['dietitian'] = 'Nutrition can help with energy and body changes';
    }
    
    setInferredResources(inferred.map(id => ({ id, reason: reasons[id] || '' })));
    setSelectedResources(inferred);
  };

  // Determine category based on answers
  const determineCategory = () => {
    const doctorExp = answers[21];
    const impact = answers[19];
    const medicalFlags = answers[20] || [];
    const age = answers[3];
    const triedThings = answers[22] || [];
    
    // Specialist Pathway
    if ((medicalFlags.length > 0 && !medicalFlags.includes('none')) || age === 'under40') {
      return 'Specialist Pathway';
    }
    
    // Treatment Navigator
    if (doctorExp === 'treatment-not-working' || doctorExp === 'some-help') {
      return 'Treatment Navigator';
    }
    
    // Optimization Mode
    if (doctorExp === 'good-care') {
      return 'Optimization Mode';
    }
    
    // Active Seeker
    if ((impact === 'significant' || impact === 'severe') || doctorExp === 'dismissed') {
      return 'Active Seeker';
    }
    
    // Early Explorer (default)
    return 'Early Explorer';
  };

  // Get top symptoms for search
  const getTopSymptoms = () => {
    const symptomQuestions = questions.filter(q => q.section === 'symptoms');
    const symptomScores = symptomQuestions.map(q => ({
      id: q.id,
      text: q.text,
      score: answers[q.id] || 0
    }));
    
    return symptomScores
      .filter(s => s.score >= 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => s.text);
  };

  // Handle assessment submission
  const handleSubmitAssessment = () => {
    if (!allAnswered) return;
    inferResources();
    setCategory(determineCategory());
    setShowConfirmation(true);
  };

  // Toggle resource selection
  const toggleResource = (resourceId) => {
    if (selectedResources.includes(resourceId)) {
      setSelectedResources(selectedResources.filter(r => r !== resourceId));
    } else {
      setSelectedResources([...selectedResources, resourceId]);
    }
  };

  // Proceed to results
  const proceedToResults = () => {
    setShowConfirmation(false);
    setCurrentView('results');
  };

  // Start search
  const startSearch = async () => {
    if (!location.trim()) return;
    
    setIsSearching(true);
    setSearchStatus('Starting search...');
    setSearchTime(0);
    setSearchResults(null);
    
    const topSymptoms = getTopSymptoms();
    const seekingResources = selectedResources.map(id => 
      resourceSuggestions.find(r => r.id === id)?.label
    ).filter(Boolean);
    
    const searchContext = {
      location: location.trim(),
      category,
      stage: answers[1],
      topSymptoms,
      seeking: seekingResources,
      doctorExperience: answers[21],
      medicalFlags: answers[20] || [],
      triedTreatments: answers[22] || []
    };
    
    try {
      const response = await fetch('/.netlify/functions/search-resources-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchContext)
      });
      
      const data = await response.json();
      
      if (data.jobId) {
        setJobId(data.jobId);
        pollForResults(data.jobId);
      } else if (data.results) {
        setSearchResults(data.results);
        setIsSearching(false);
      } else {
        throw new Error('No job ID or results returned');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchStatus('Search failed. Please try again.');
      setIsSearching(false);
    }
  };

  // Poll for search results
  const pollForResults = async (id) => {
    const startTime = Date.now();
    
    const poll = async () => {
      try {
        const response = await fetch(`/.netlify/functions/search-status?jobId=${id}`);
        const data = await response.json();
        
        setSearchTime(Math.floor((Date.now() - startTime) / 1000));
        
        if (data.status === 'complete') {
          setSearchResults(data.results);
          setIsSearching(false);
          setSearchStatus('');
        } else if (data.status === 'error') {
          setSearchStatus('Search encountered an error. Please try again.');
          setIsSearching(false);
        } else {
          setSearchStatus(data.message || 'Compiling results...');
          setTimeout(poll, 2000);
        }
      } catch (error) {
        console.error('Polling error:', error);
        setTimeout(poll, 3000);
      }
    };
    
    poll();
  };

  // Start assessment
  const startAssessment = () => {
    setAnswers({});
    setAssessmentStarted(true);
    setShowConfirmation(false);
    setShowCrisisBanner(false);
    setSelectedResources([]);
    setInferredResources([]);
    setSearchResults(null);
    setCurrentView('assessment');
  };

  // Reset and go home
  const goHome = () => {
    setCurrentView('home');
    setAssessmentStarted(false);
    setShowConfirmation(false);
  };

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  // Top Navigation
  const TopNav = () => (
    <nav className="top-nav">
      <div className="top-nav-container">
        <div className="nav-logo" onClick={goHome}>
          <span className="logo-icon">🌸</span>
          <span className="logo-text">Menopause Navigator</span>
        </div>
        <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <button onClick={goHome} className={currentView === 'home' ? 'active' : ''}>Home</button>
          <button onClick={() => setCurrentView('about')} className={currentView === 'about' ? 'active' : ''}>About</button>
          <button onClick={() => setCurrentView('foundations')} className={currentView === 'foundations' ? 'active' : ''}>Foundations</button>
          <button onClick={startAssessment} className="nav-cta">Find Support</button>
        </div>
        <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );

  // Crisis Banner
  const CrisisBanner = () => (
    <div className="crisis-banner">
      <div className="crisis-content">
        <strong>Support is available.</strong>
        <p>Your responses suggest you may be going through a really difficult time. You don't have to face this alone.</p>
        <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="crisis-button">
          Find Crisis Support
        </a>
      </div>
    </div>
  );

  // Home Page
  const HomePage = () => (
    <div className="page home-page">
      <div className="hero">
        <h1>Find the right support for your menopause journey</h1>
        <p>A free, private tool to connect you with menopause-trained doctors, specialists, and support services in your area.</p>
        <button onClick={startAssessment} className="primary-button large">
          Start Assessment
        </button>
        <p className="hero-note">Takes about 5 minutes. Your answers are never stored.</p>
      </div>
      
      <div className="features">
        <div className="feature">
          <span className="feature-icon">🎯</span>
          <h3>Personalized</h3>
          <p>Our assessment understands your unique symptoms and situation</p>
        </div>
        <div className="feature">
          <span className="feature-icon">🔒</span>
          <h3>Private</h3>
          <p>Your answers stay on your device — nothing is stored or shared</p>
        </div>
        <div className="feature">
          <span className="feature-icon">🌍</span>
          <h3>Local</h3>
          <p>Find real practitioners and services in your area</p>
        </div>
      </div>
    </div>
  );

  // About Page
  const AboutPage = () => (
    <div className="page about-page">
      <h1>About Menopause Navigator</h1>
      <p>Menopause affects every woman differently. Finding the right support shouldn't be so hard.</p>
      <p>We built this tool because too many women spend years being dismissed, misdiagnosed, or simply not knowing where to turn. A 22-question assessment helps us understand your unique situation — your symptoms, your experience with healthcare so far, and what kind of support you're looking for.</p>
      <p>Then we search for real resources in your area: menopause-trained GPs, specialists, telehealth services, mental health support, and peer communities.</p>
      <h2>This is not medical advice</h2>
      <p>We're a navigation tool, not a healthcare provider. We help you find the right people to talk to — the decisions are always yours.</p>
      <button onClick={startAssessment} className="primary-button">Start Assessment</button>
    </div>
  );

  // Foundations Page
  const FoundationsPage = () => (
    <div className="page foundations-page">
      <h1>Menopause Foundations</h1>
      <p>Before diving into specialists and treatments, these fundamentals make a real difference for many women.</p>
      
      <div className="foundation-card">
        <h2>💪 Resistance Training</h2>
        <p>Strength training is possibly the single most impactful thing you can do. It helps with:</p>
        <ul>
          <li>Maintaining muscle mass (which naturally declines)</li>
          <li>Supporting bone density</li>
          <li>Improving metabolism and body composition</li>
          <li>Reducing joint pain and stiffness</li>
          <li>Boosting mood and energy</li>
        </ul>
        <p><strong>Start simple:</strong> 2-3 sessions per week. Bodyweight exercises count. A personal trainer can help if you're new to weights.</p>
      </div>
      
      <div className="foundation-card">
        <h2>🥗 Nutrition Basics</h2>
        <p>You don't need a complicated diet. Focus on:</p>
        <ul>
          <li><strong>Protein:</strong> Aim for protein at every meal — helps maintain muscle</li>
          <li><strong>Reduce processed carbs:</strong> Blood sugar swings can worsen symptoms</li>
          <li><strong>Calcium & Vitamin D:</strong> Critical for bone health</li>
          <li><strong>Stay hydrated:</strong> Dehydration worsens hot flashes</li>
        </ul>
      </div>
      
      <div className="foundation-card">
        <h2>😴 Sleep Hygiene</h2>
        <p>When night sweats and insomnia hit, good sleep habits become essential:</p>
        <ul>
          <li>Keep your bedroom cool (cooler than you think)</li>
          <li>Consistent sleep/wake times</li>
          <li>Limit alcohol (it disrupts sleep and triggers hot flashes)</li>
          <li>Consider moisture-wicking sleepwear and bedding</li>
        </ul>
      </div>
      
      <p className="foundations-cta">These foundations help, but they're not a substitute for proper medical care when you need it.</p>
      <button onClick={startAssessment} className="primary-button">Find Professional Support</button>
    </div>
  );

  // Assessment Page
  const AssessmentPage = () => (
    <div className="page assessment-page">
      <div className="assessment-header">
        <h1>Your Menopause Assessment</h1>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="progress-text">{answeredCount} of {totalQuestions} questions answered</p>
      </div>
      
      <div className="assessment-content">
        {sections.map(section => (
          <div key={section.id} className="assessment-section">
            <h2 className="section-title">{section.name}</h2>
            <div className="questions-list">
              {section.questions.map(qId => {
                const q = questions.find(question => question.id === qId);
                const answer = answers[q.id];
                const isAnswered = answer !== undefined && (Array.isArray(answer) ? answer.length > 0 : true);
                
                return (
                  <div key={q.id} className={`question-card ${isAnswered ? 'answered' : ''}`}>
                    <div className="question-header">
                      <span className="question-number">Q{q.id}</span>
                      <div className="question-text">
                        <h3>{q.text}</h3>
                        {q.subtext && <p className="subtext">{q.subtext}</p>}
                      </div>
                    </div>
                    <div className="question-options">
                      {q.type === 'scale' ? (
                        <div className="scale-options">
                          {scaleOptions.map(option => (
                            <button
                              key={option.value}
                              className={`scale-option ${answer === option.value ? 'selected' : ''}`}
                              onClick={() => handleAnswer(q.id, option.value)}
                            >
                              <span className="scale-value">{option.value}</span>
                              <span className="scale-label">{option.label}</span>
                            </button>
                          ))}
                        </div>
                      ) : q.type === 'multi' ? (
                        <div className="multi-options">
                          {q.options.map(option => {
                            const selected = (answer || []).includes(option.value);
                            return (
                              <button
                                key={option.value}
                                className={`multi-option ${selected ? 'selected' : ''}`}
                                onClick={() => handleAnswer(q.id, option.value)}
                              >
                                <span className="checkbox">{selected ? '✓' : ''}</span>
                                {option.label}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="single-options">
                          {q.options.map(option => (
                            <button
                              key={option.value}
                              className={`single-option ${answer === option.value ? 'selected' : ''}`}
                              onClick={() => handleAnswer(q.id, option.value)}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="assessment-submit">
          <button 
            className={`primary-button large ${!allAnswered ? 'disabled' : ''}`}
            onClick={handleSubmitAssessment}
            disabled={!allAnswered}
          >
            {allAnswered ? 'Continue →' : `Answer all questions (${answeredCount}/${totalQuestions})`}
          </button>
          <p className="assessment-note">Your answers are private and never stored.</p>
        </div>
      </div>
    </div>
  );

  // Confirmation Screen
  const ConfirmationScreen = () => (
    <div className="page confirmation-page">
      {showCrisisBanner && <CrisisBanner />}
      
      <div className="confirmation-content">
        <h1>Based on what you shared...</h1>
        <p className="confirmation-intro">We think these resources would help. Toggle any to add or remove before we search.</p>
        
        <div className="category-badge">
          Your navigation category: <strong>{category}</strong>
        </div>
        
        <div className="top-symptoms">
          <h3>Your top concerns:</h3>
          <div className="symptom-tags">
            {getTopSymptoms().map((symptom, i) => (
              <span key={i} className="symptom-tag">{symptom}</span>
            ))}
          </div>
        </div>
        
        <div className="resource-suggestions">
          <h3>Suggested resources:</h3>
          {resourceSuggestions.map(resource => {
            const isSelected = selectedResources.includes(resource.id);
            const inferred = inferredResources.find(r => r.id === resource.id);
            
            return (
              <div 
                key={resource.id} 
                className={`resource-toggle ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleResource(resource.id)}
              >
                <div className="toggle-checkbox">
                  {isSelected ? '✓' : ''}
                </div>
                <div className="toggle-content">
                  <strong>{resource.label}</strong>
                  <p>{resource.description}</p>
                  {inferred && <span className="inferred-reason">{inferred.reason}</span>}
                </div>
              </div>
            );
          })}
        </div>
        
        <button 
          className="primary-button large"
          onClick={proceedToResults}
          disabled={selectedResources.length === 0}
        >
          Continue with {selectedResources.length} resource type{selectedResources.length !== 1 ? 's' : ''} →
        </button>
      </div>
    </div>
  );

  // Results Page
  const ResultsPage = () => (
    <div className="page results-page">
      {showCrisisBanner && <CrisisBanner />}
      
      <div className="results-header">
        <h1>Find Support Near You</h1>
        <div className="category-badge">
          {category}
        </div>
      </div>
      
      <div className="search-section">
        <label htmlFor="location">Your location:</label>
        <div className="search-input-group">
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, region, or country"
            onKeyDown={(e) => e.key === 'Enter' && startSearch()}
          />
          <button 
            className="primary-button"
            onClick={startSearch}
            disabled={isSearching || !location.trim()}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
        <p className="search-note">We'll search for: {selectedResources.map(id => 
          resourceSuggestions.find(r => r.id === id)?.label
        ).filter(Boolean).join(', ')}</p>
      </div>
      
      {isSearching && (
        <div className="search-loading">
          <div className="loading-spinner"></div>
          <h2>Building your resource report...</h2>
          <p className="search-status">{searchStatus}</p>
          <p className="search-time">{searchTime} seconds</p>
          <p className="search-patience">This comprehensive search can take 2-3 minutes. We're searching for real, verified resources in your area.</p>
        </div>
      )}
      
      {searchResults && (
        <div className="search-results">
          <h2>Resources Found</h2>
          {searchResults.categories?.map((cat, index) => (
            <div key={index} className="result-category">
              <h3>{cat.name}</h3>
              <div className="result-items">
                {cat.resources?.map((resource, rIndex) => (
                  <div key={rIndex} className="result-card">
                    <h4>{resource.name}</h4>
                    {resource.description && <p>{resource.description}</p>}
                    {resource.location && <p className="resource-location">📍 {resource.location}</p>}
                    {resource.phone && <p className="resource-phone">📞 {resource.phone}</p>}
                    {resource.website && (
                      <a href={resource.website} target="_blank" rel="noopener noreferrer" className="resource-link">
                        Visit Website →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {(!searchResults.categories || searchResults.categories.length === 0) && (
            <div className="no-results">
              <p>We couldn't find specific resources for your area. Try:</p>
              <ul>
                <li>Broadening your location (e.g., state/region instead of city)</li>
                <li>Searching for telehealth options (available anywhere)</li>
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="results-actions">
        <button onClick={startAssessment} className="secondary-button">Start Over</button>
        <button onClick={() => setShowConfirmation(true)} className="secondary-button">Change Resource Types</button>
      </div>
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="app-wrapper">
      <TopNav />
      <main className="main-content">
        {showConfirmation ? (
          <ConfirmationScreen />
        ) : currentView === 'home' ? (
          <HomePage />
        ) : currentView === 'about' ? (
          <AboutPage />
        ) : currentView === 'foundations' ? (
          <FoundationsPage />
        ) : currentView === 'assessment' ? (
          <AssessmentPage />
        ) : currentView === 'results' ? (
          <ResultsPage />
        ) : (
          <HomePage />
        )}
      </main>
      <footer className="footer">
        <p>Menopause Navigator is a free resource finder, not a medical service. Always consult qualified healthcare providers.</p>
      </footer>
    </div>
  );
}

export default App;
