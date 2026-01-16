import { useState, useEffect } from 'react';

// ============================================
// DATA & CONFIGURATION
// ============================================

const sections = [
  { id: 'stage', name: 'Your Menopause Stage', questions: [1, 2, 3] },
  { id: 'symptoms', name: 'Your Symptoms', questions: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] },
  { id: 'impact', name: 'Overall Impact', questions: [19] },
  { id: 'medical', name: 'Medical Context', questions: [20] },
  { id: 'journey', name: 'Your Journey So Far', questions: [21, 22] },
  { id: 'seeking', name: 'What You\'re Looking For', questions: [23] },
  { id: 'location', name: 'Where to Search', questions: [24] }
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
  { id: 19, section: 'impact', text: "How much are menopause symptoms affecting your overall quality of life?", subtext: "Consider your work, relationships, and daily activities.", type: 'single', options: [
    { value: 'minimal', label: "Minimal impact, mostly manageable" },
    { value: 'moderate', label: "Moderate impact, noticeable but coping" },
    { value: 'significant', label: "Significant impact on work, relationships, or wellbeing" },
    { value: 'severe', label: "Severe impact, struggling with day-to-day life" }
  ]},
  
  // Section 4: Medical Context
  { id: 20, section: 'medical', text: "Do any of these apply to you?", subtext: "This helps us understand if you may need specialist guidance. Select all that apply.", type: 'multi', options: [
    { value: 'breast-cancer', label: "Personal history of breast cancer", flag: 'specialist' },
    { value: 'blood-clots', label: "Personal history of blood clots, DVT, or pulmonary embolism", flag: 'specialist' },
    { value: 'stroke-heart', label: "Personal history of stroke or heart disease", flag: 'specialist' },
    { value: 'migraine-aura', label: "Migraines with aura", flag: 'specialist' },
    { value: 'liver', label: "Liver disease", flag: 'specialist' },
    { value: 'bleeding', label: "Undiagnosed vaginal bleeding", flag: 'specialist' },
    { value: 'none', label: "None of these apply to me", exclusive: true }
  ]},
  
  // Section 5: Journey So Far
  { id: 21, section: 'journey', text: "What's your experience been with doctors regarding menopause?", subtext: "This helps us understand where you are in seeking support.", type: 'single', options: [
    { value: 'none', label: "I haven't spoken to a doctor about menopause yet" },
    { value: 'dismissed', label: "I've tried but felt dismissed or not taken seriously" },
    { value: 'some-help', label: "I've had some help but still don't feel well" },
    { value: 'not-optimal', label: "I'm on treatment but it's not working optimally" },
    { value: 'good-care', label: "I have good care and want complementary support" }
  ]},
  { id: 22, section: 'journey', text: "What have you tried so far?", subtext: "Select all that apply.", type: 'multi', options: [
    { value: 'nothing', label: "Nothing yet, just starting to explore options", exclusive: true },
    { value: 'lifestyle', label: "Lifestyle changes (exercise, diet, stress management)" },
    { value: 'supplements', label: "Supplements or natural remedies" },
    { value: 'hrt', label: "HRT (hormone replacement therapy)" },
    { value: 'antidepressants', label: "Antidepressants or anti-anxiety medication" },
    { value: 'other-rx', label: "Other prescription treatments" },
    { value: 'alternative', label: "Alternative therapies (acupuncture, naturopathy, etc.)" }
  ]},
  
  // Section 6: What You're Looking For
  { id: 23, section: 'seeking', text: "What kind of support are you most interested in?", subtext: "Select all that apply. This helps us prioritize your search results.", type: 'multi', options: [
    { value: 'understand', label: "Understanding my options before deciding anything" },
    { value: 'gp', label: "Finding a GP who actually understands menopause" },
    { value: 'specialist', label: "Getting a referral to a menopause specialist" },
    { value: 'hrt', label: "Exploring hormone therapy (HRT)" },
    { value: 'non-hormonal', label: "Non-hormonal medical treatments" },
    { value: 'mental-health', label: "Mental health support" },
    { value: 'pelvic', label: "Pelvic floor or physical therapy" },
    { value: 'nutrition', label: "Nutritional guidance" },
    { value: 'support-group', label: "Support groups or community" },
    { value: 'specific-symptom', label: "Help with a specific symptom that's really bothering me" }
  ]},
  
  // Section 7: Location
  { id: 24, section: 'location', text: "Where would you like to find support?", subtext: "Enter a city, region, or country. This can be for yourself or someone you're helping.", type: 'text', placeholder: "e.g., Auckland, NZ or Sydney, Australia" }
];

const scaleOptions = [
  { value: 0, label: "Not experiencing this" },
  { value: 1, label: "Mild, occasionally annoying" },
  { value: 2, label: "Moderate, frequently affecting me" },
  { value: 3, label: "Severe, significantly impacting my life" }
];

const categoryContent = {
  'early-explorer': {
    name: "Early Explorer",
    description: "New to symptoms, seeking information and validation.",
    positioning: "You're in the early stages of noticing changes and exploring what's happening. This is a great time to build understanding and find support that can grow with you.",
    helps: [
      "Education about perimenopause and what to expect",
      "Validation that your symptoms are real and common",
      "A menopause-informed GP for baseline assessment",
      "Online communities and peer support"
    ],
    monitor: [
      "Symptoms increasing in frequency or severity",
      "Impact on work, sleep, or relationships",
      "Mood changes that feel concerning"
    ],
    color: "#c9a0dc"
  },
  'active-seeker': {
    name: "Active Seeker",
    description: "Ready for real support, may have been dismissed before.",
    positioning: "Your symptoms are affecting your life and you're ready to find proper support. Many women at this stage have felt dismissed — you deserve care that takes you seriously.",
    helps: [
      "Menopause-trained GP or nurse practitioner",
      "Discussion of treatment options including HRT",
      "Support groups with others at similar stages",
      "Telehealth menopause services for easier access"
    ],
    monitor: [
      "Worsening symptoms despite lifestyle changes",
      "Mental health concerns like anxiety or depression",
      "Physical symptoms affecting daily function"
    ],
    color: "#a77dc2"
  },
  'treatment-navigator': {
    name: "Treatment Navigator",
    description: "Tried treatments, need optimization or specialist input.",
    positioning: "You've tried approaches that haven't fully worked. This is common — menopause treatment often needs adjustment. A specialist or second opinion can help optimize your care.",
    helps: [
      "Menopause specialist consultation",
      "HRT optimization or alternative formulations",
      "Complementary support (dietitian, physio)",
      "Addressing specific resistant symptoms"
    ],
    monitor: [
      "Any new or concerning symptoms",
      "Side effects from current treatments",
      "Mental health changes"
    ],
    color: "#8b5fa0"
  },
  'specialist-pathway': {
    name: "Specialist Pathway",
    description: "Complex factors requiring specialist guidance.",
    positioning: "Your situation involves factors that benefit from specialist expertise. This isn't about severity — it's about getting the right guidance for your specific circumstances.",
    helps: [
      "Menopause specialist with expertise in complex cases",
      "Individualized treatment planning",
      "Coordination with other healthcare providers",
      "Specialized support for your specific concerns"
    ],
    monitor: [
      "Follow specialist recommendations closely",
      "Report any new symptoms promptly",
      "Keep track of what's working and what isn't"
    ],
    urgent: true,
    color: "#6b4080"
  },
  'optimization': {
    name: "Optimization Mode",
    description: "Good care in place, seeking complementary support.",
    positioning: "You have a solid foundation of care and are looking to enhance your wellbeing with additional support. This proactive approach can help you thrive through this transition.",
    helps: [
      "Complementary therapies aligned with your goals",
      "Nutrition and exercise optimization",
      "Stress management and mindfulness",
      "Community and peer connection"
    ],
    monitor: [
      "Changes in how current treatment is working",
      "New symptoms that emerge",
      "Overall wellbeing and quality of life"
    ],
    color: "#9b7bb0"
  }
};

// Generate unique job ID
function generateJobId() {
  return 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Strip citation tags from AI responses
function stripCitations(text) {
  if (!text) return text;
  return text
    .replace(/<cite[^>]*>/gi, '')
    .replace(/<\/cite>/gi, '')
    .replace(/]*>/gi, '')
    .replace(/<\/antml:cite>/gi, '');
}

// ============================================
// CATEGORY DETERMINATION LOGIC
// ============================================
function determineCategory(answers) {
  const flags = [];
  
  // Check for specialist pathway flags
  const q20 = answers[20] || [];
  if (Array.isArray(q20) && q20.some(v => v !== 'none')) {
    flags.push('specialist');
  }
  
  // Check for early menopause
  if (answers[3] === 'under40') {
    flags.push('early-menopause');
  }
  
  // Check for severe mental health
  if (answers[8] === 3 || answers[9] === 3) {
    flags.push('mental-health-severe');
  }
  
  // Specialist pathway takes priority
  if (flags.includes('specialist') || flags.includes('early-menopause')) {
    return 'specialist-pathway';
  }
  
  // Check doctor experience
  const doctorExp = answers[21];
  
  // Good care = optimization
  if (doctorExp === 'good-care') {
    return 'optimization';
  }
  
  // Treatment not working = treatment navigator
  if (doctorExp === 'not-optimal' || doctorExp === 'some-help') {
    return 'treatment-navigator';
  }
  
  // Impact level
  const impact = answers[19];
  
  // Low impact + early stage = early explorer
  if (impact === 'minimal' && (answers[1] === 'early' || answers[1] === 'irregular')) {
    return 'early-explorer';
  }
  
  // Dismissed or moderate+ impact = active seeker
  if (doctorExp === 'dismissed' || impact === 'moderate' || impact === 'significant' || impact === 'severe') {
    return 'active-seeker';
  }
  
  // Default
  return 'early-explorer';
}

function getSymptomProfile(answers) {
  const symptoms = [];
  
  // Vasomotor
  const vasomotor = Math.max(answers[4] || 0, answers[5] || 0);
  if (vasomotor >= 2) symptoms.push({ name: 'Vasomotor (hot flashes/night sweats)', severity: vasomotor });
  
  // Sleep
  const sleep = Math.max(answers[6] || 0, answers[7] || 0);
  if (sleep >= 2) symptoms.push({ name: 'Sleep disruption', severity: sleep });
  
  // Mood
  const mood = Math.max(answers[8] || 0, answers[9] || 0, answers[10] || 0);
  if (mood >= 2) symptoms.push({ name: 'Mood changes', severity: mood });
  
  // Cognitive
  const cognitive = Math.max(answers[11] || 0, answers[12] || 0);
  if (cognitive >= 2) symptoms.push({ name: 'Cognitive (brain fog/memory)', severity: cognitive });
  
  // Genitourinary
  const gu = Math.max(answers[13] || 0, answers[14] || 0);
  if (gu >= 2) symptoms.push({ name: 'Genitourinary symptoms', severity: gu });
  
  // Musculoskeletal
  if ((answers[15] || 0) >= 2) symptoms.push({ name: 'Joint and muscle pain', severity: answers[15] });
  
  // Fatigue
  if ((answers[16] || 0) >= 2) symptoms.push({ name: 'Fatigue', severity: answers[16] });
  
  // Sort by severity
  symptoms.sort((a, b) => b.severity - a.severity);
  
  return symptoms.slice(0, 3); // Top 3
}

// ============================================
// COMPONENTS
// ============================================

function TopNav({ currentPage, onNavigate, onStartAssessment, inAssessment }) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'categories', label: 'The Categories' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'foundations', label: 'Foundations' },
    { id: 'resources', label: 'Resources' },
  ];

  return (
    <nav className="top-nav">
      <div className="top-nav-container">
        <button className="nav-logo" onClick={() => onNavigate('home')}>
          <div className="nav-logo-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" fill="url(#logoGradientMeno)"/>
              <path d="M16 6 L18 14 L16 16 L14 14 Z" fill="white"/>
              <path d="M16 26 L14 18 L16 16 L18 18 Z" fill="rgba(255,255,255,0.5)"/>
              <path d="M6 16 L14 14 L16 16 L14 18 Z" fill="rgba(255,255,255,0.5)"/>
              <path d="M26 16 L18 18 L16 16 L18 14 Z" fill="white"/>
              <circle cx="16" cy="16" r="2" fill="white"/>
              <defs>
                <linearGradient id="logoGradientMeno" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c9a0dc"/>
                  <stop offset="100%" stopColor="#8b5fa0"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span>Menopause Navigator</span>
        </button>
        
        <button className="nav-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M6 18L18 6M6 6l12 12"/> : <path d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
        
        <div className={`top-nav-links ${menuOpen ? 'open' : ''}`}>
          {navItems.map(item => (
            <button 
              key={item.id} 
              className={`top-nav-link ${currentPage === item.id && !inAssessment ? 'active' : ''}`}
              onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
            >
              {item.label}
            </button>
          ))}
          <button className="nav-cta" onClick={() => { onStartAssessment(); setMenuOpen(false); }}>
            {inAssessment ? 'Restart' : 'Start Assessment'}
          </button>
        </div>
      </div>
    </nav>
  );
}

function ContextNav({ context, data }) {
  if (context === 'search') {
    return (
      <div className="context-nav">
        <div className="context-nav-container">
          <div className="context-breadcrumb">
            <span className="context-label">Your Resources</span>
            <span className="context-separator">→</span>
            <span className="context-current">{data.location || 'Searching...'}</span>
          </div>
          {data.onBack && (
            <button onClick={data.onBack} className="context-back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Start Over
            </button>
          )}
        </div>
      </div>
    );
  }

  if (context === 'page') {
    return (
      <div className="context-nav">
        <div className="context-nav-container">
          <div className="context-breadcrumb">
            <span className="context-current">{data.title}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function SearchLoading({ elapsedTime }) {
  const stages = [
    { name: "Starting search", minTime: 0 },
    { name: "Searching for menopause specialists", minTime: 5 },
    { name: "Finding GPs and clinics", minTime: 15 },
    { name: "Looking for dietitians", minTime: 25 },
    { name: "Searching support groups", minTime: 35 },
    { name: "Compiling results", minTime: 45 }
  ];

  const currentStageIndex = stages.reduce((acc, stage, idx) => 
    elapsedTime >= stage.minTime ? idx : acc, 0);

  return (
    <div className="search-loading-container">
      <div className="search-loading-spinner">
        <svg viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="#f3e8f7" strokeWidth="4"/>
          <circle cx="25" cy="25" r="20" fill="none" stroke="#a77dc2" strokeWidth="4" 
                  strokeDasharray="125.6" strokeDashoffset="100" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
      <h2>Building your resource report...</h2>
      <p className="search-stage">{stages[currentStageIndex].name}...</p>
      <p className="search-time">{Math.floor(elapsedTime)} seconds</p>
      <p className="search-note">This comprehensive search can take 2-3 minutes. We're searching for real, verified resources in your area.</p>
    </div>
  );
}

function LandingPage({ onStartAssessment, onNavigate }) {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">Navigation for Menopause Support</span>
          <h1>Find the right support for your menopause journey</h1>
          <p className="hero-subtitle">
            A free, private assessment that helps you understand your symptoms and connects you with menopause-trained doctors, specialists, and support in your area.
          </p>
          <div className="hero-actions">
            <button className="primary-button large" onClick={onStartAssessment}>
              Start the Assessment
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button className="secondary-button large" onClick={() => onNavigate('how-it-works')}>
              How It Works
            </button>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-content">
          <h2>You're not imagining it</h2>
          <p>Hot flashes, brain fog, anxiety, sleepless nights — these symptoms are real, and they're affecting millions of women. Yet too many are told it's "just stress" or "part of getting older."</p>
          <p style={{marginTop: '1rem'}}>Our assessment helps you understand what you're experiencing and find healthcare providers who actually get it.</p>
        </div>
      </section>

      <section className="landing-section alt-bg">
        <div className="section-content">
          <h2>Who this is for</h2>
          <div className="audience-grid">
            <div className="audience-card">
              <div className="audience-icon">🌱</div>
              <h4>Just starting to notice changes</h4>
              <p>Wondering if what you're feeling could be perimenopause</p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">🔍</div>
              <h4>Seeking real answers</h4>
              <p>Tired of being dismissed by doctors who don't understand</p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">💪</div>
              <h4>Looking for better care</h4>
              <p>Current treatment isn't working, need specialist guidance</p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">🧭</div>
              <h4>Wanting to optimize</h4>
              <p>Have good care, looking for complementary support</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-content">
          <h2>How it works</h2>
          <div className="process-cards">
            <div className="process-card">
              <div className="process-icon">📝</div>
              <h4>Complete the Assessment</h4>
              <p>24 questions about your symptoms, experience, and location. Takes about 8 minutes.</p>
            </div>
            <div className="process-card">
              <div className="process-icon">🔍</div>
              <h4>Get Your Report</h4>
              <p>We immediately search for menopause-trained GPs, specialists, and support services in your area.</p>
            </div>
            <div className="process-card">
              <div className="process-icon">📋</div>
              <h4>Save Your Results</h4>
              <p>Download a personalized report with resources to explore at your own pace.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section cta-section">
        <div className="section-content centered">
          <h2>Ready to find real support?</h2>
          <p>No sign-up, no email, completely private.</p>
          <button className="primary-button large" onClick={onStartAssessment}>
            Begin the Assessment
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <p><strong>Menopause Navigator</strong> — A free navigation tool for menopause support.</p>
          <p>This is not a medical service. If you're in crisis, please contact a <button onClick={() => onNavigate('resources')} className="footer-link">crisis helpline</button>.</p>
          <p><button onClick={() => onNavigate('contact')} className="footer-link">Contact</button></p>
        </div>
      </footer>
    </div>
  );
}

function CategoriesPage({ onStartAssessment, highlightCategory = null }) {
  return (
    <div className="content-page">
      <div className="page-content wide">
        <section className="content-section">
          <h2 className="stages-title">Understanding the Categories</h2>
          <div className="stages-explainer">
            <p>These aren't diagnoses — they're navigation categories that help us find the right resources for where you are in your journey.</p>
            <p>Based on your symptoms, experience with healthcare, and what you're looking for, we'll match you with appropriate support options.</p>
          </div>
        </section>
        <div className="stages-grid-2x2">
          {Object.entries(categoryContent).map(([key, content]) => (
            <div key={key} className={`stage-card ${highlightCategory === key ? 'highlighted' : ''}`}>
              <div className="stage-card-header" style={{ borderLeftColor: content.color }}>
                <span className="stage-dot" style={{ background: content.color }}></span>
                <div><h3>{content.name}</h3><p className="stage-description">{content.description}</p></div>
                {highlightCategory === key && <span className="your-result-badge">Your result</span>}
              </div>
              <div className="stage-card-body">
                <p>{content.positioning}</p>
                <div className="stage-helps"><h4>What typically helps:</h4><ul>{content.helps.map((help, idx) => <li key={idx}>{help}</li>)}</ul></div>
              </div>
            </div>
          ))}
        </div>
        <div className="page-cta">
          <button className="primary-button large" onClick={onStartAssessment}>
            Take the Assessment
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function HowItWorksPage({ onStartAssessment }) {
  return (
    <div className="content-page how-it-works-page">
      <div className="page-content wide">
        <div className="hiw-hero">
          <h1>How Menopause Navigator Works</h1>
          <p>A comprehensive, private way to understand your symptoms and find support that fits.</p>
        </div>

        <div className="hiw-process">
          <h2>The Process</h2>
          <div className="hiw-steps-simple">
            <div className="hiw-step-simple">
              <div className="hiw-step-icon">📝</div>
              <div className="hiw-step-content">
                <h4>Take the Assessment</h4>
                <p>Answer 24 questions about your symptoms, medical history, and where you'd like to find support. Takes about 8 minutes.</p>
              </div>
            </div>
            <div className="hiw-step-arrow">→</div>
            <div className="hiw-step-simple">
              <div className="hiw-step-icon">🔍</div>
              <div className="hiw-step-content">
                <h4>Get Your Report</h4>
                <p>We immediately build a personalized report of menopause-trained doctors, specialists, and support services in your area.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hiw-philosophy">
          <div className="philosophy-item">
            <div className="philosophy-icon">🧭</div>
            <div className="philosophy-text">
              <h3>Our Philosophy</h3>
              <p>Finding menopause support shouldn't require you to already be an expert. We help navigate the options so you can focus on feeling better.</p>
            </div>
          </div>
          
          <div className="philosophy-item">
            <div className="philosophy-icon">💬</div>
            <div className="philosophy-text">
              <h3>Validation, Not Diagnosis</h3>
              <p>Your symptoms are real. Our tool helps identify patterns and connects you with providers who understand menopause.</p>
            </div>
          </div>
        </div>

        <div className="hiw-cta">
          <button className="primary-button large" onClick={onStartAssessment}>
            Start the Assessment
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <p>Free · Private · No sign-up required</p>
        </div>

        <div id="limitations" className="limitations-embedded">
          <div className="limitations-header">
            <h2>Our Limitations</h2>
            <p className="limitations-subtitle">What this tool is—and what it isn't</p>
          </div>

          <div className="limitations-grid">
            <div className="limitation-card not">
              <h3>This is NOT</h3>
              <ul>
                <li>A medical diagnosis or clinical assessment</li>
                <li>A substitute for professional evaluation</li>
                <li>Medical advice about HRT or treatments</li>
                <li>A guarantee of resource availability</li>
              </ul>
            </div>
            <div className="limitation-card is">
              <h3>This IS</h3>
              <ul>
                <li>A navigation tool to help you find resources</li>
                <li>A way to identify your primary concerns</li>
                <li>Information to start conversations with providers</li>
                <li>A starting point, not a final answer</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FoundationsPage() {
  return (
    <div className="content-page">
      <div className="page-content">
        <h1>Menopause Foundations</h1>
        <p className="page-intro">Before diving into finding specialists, there are some foundational approaches that help many women manage menopause symptoms. These aren't a replacement for medical care — they're a complement to it.</p>
        
        <section className="foundation-section">
          <h2>💪 Strength Training</h2>
          <p>Resistance training becomes increasingly important during menopause. It helps maintain muscle mass, supports bone density, improves metabolism, and can reduce many symptoms including fatigue and mood changes.</p>
          <p><strong>Start with:</strong> 2-3 sessions per week focusing on major muscle groups. Even bodyweight exercises count.</p>
        </section>
        
        <section className="foundation-section">
          <h2>🍎 Nutrition Basics</h2>
          <p>Blood sugar stability matters more during menopause. Reducing processed carbs and increasing protein can help with energy, weight management, and mood stability.</p>
          <p><strong>Start with:</strong> Protein at every meal, more vegetables, fewer ultra-processed foods.</p>
        </section>
        
        <section className="foundation-section">
          <h2>😴 Sleep Hygiene</h2>
          <p>Quality sleep becomes harder but more important. Good sleep habits can reduce many other symptoms.</p>
          <p><strong>Start with:</strong> Consistent sleep/wake times, cool bedroom, limiting screens before bed.</p>
        </section>
        
        <section className="foundation-section">
          <h2>🧘 Stress Management</h2>
          <p>Cortisol and hormones interact significantly. Managing stress can reduce symptom severity.</p>
          <p><strong>Start with:</strong> Even 10 minutes of breathing exercises, walking, or whatever helps you decompress.</p>
        </section>
        
        <div className="foundation-note">
          <p>These foundations won't fix everything — many women still need medical support. But they provide a strong base that makes other treatments more effective.</p>
        </div>
      </div>
    </div>
  );
}

function ResourcesPage() {
  return (
    <div className="content-page">
      <div className="page-content">
        <h1>Resources</h1>
        <p className="page-intro">Helpful links and organizations for menopause support.</p>
        
        <section className="resource-section">
          <h2>Crisis Support</h2>
          <p>If you're experiencing a mental health crisis or need immediate support:</p>
          <div className="resource-buttons">
            <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="resource-button crisis">
              Find a Helpline
              <span>Free, confidential crisis support by country</span>
            </a>
          </div>
        </section>
        
        <section className="resource-section">
          <h2>Menopause Organizations</h2>
          <div className="resource-list">
            <div className="resource-item">
              <h4>Australasian Menopause Society</h4>
              <p>Professional body with provider directory for Australia/NZ</p>
              <a href="https://www.menopause.org.au" target="_blank" rel="noopener noreferrer">menopause.org.au</a>
            </div>
            <div className="resource-item">
              <h4>British Menopause Society</h4>
              <p>UK-based professional organization with resources</p>
              <a href="https://thebms.org.uk" target="_blank" rel="noopener noreferrer">thebms.org.uk</a>
            </div>
            <div className="resource-item">
              <h4>The Menopause Society (US)</h4>
              <p>North American menopause organization</p>
              <a href="https://menopause.org" target="_blank" rel="noopener noreferrer">menopause.org</a>
            </div>
          </div>
        </section>
        
        <section className="resource-section">
          <h2>Information Resources</h2>
          <div className="resource-list">
            <div className="resource-item">
              <h4>Jean Hailes</h4>
              <p>Comprehensive women's health information (Australia)</p>
              <a href="https://jeanhailes.org.au" target="_blank" rel="noopener noreferrer">jeanhailes.org.au</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="content-page">
      <div className="page-content">
        <h1>Contact Us</h1>
        <p className="page-intro">Have feedback or questions about Menopause Navigator?</p>
        
        <form className="contact-form" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="contact" />
          <p style={{display: 'none'}}><input name="bot-field" /></p>
          
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          
          <button type="submit" className="primary-button">Send Message</button>
        </form>
      </div>
    </div>
  );
}

// ============================================
// RESOURCE DETAIL MODAL
// ============================================
function ResourceDetailModal({ isOpen, onClose, resource, categoryName, location }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && resource && !summary) {
      fetchDetails();
    }
  }, [isOpen, resource]);

  useEffect(() => {
    if (!isOpen) {
      setSummary(null);
      setError(null);
    }
  }, [isOpen]);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/.netlify/functions/resource-detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: resource.url || null,
          resourceName: resource.name,
          resourceType: resource.type,
          categoryName: categoryName,
          location: location
        })
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSummary(data.summary);
      }
    } catch (err) {
      setError('Could not load additional details.');
    } finally {
      setLoading(false);
    }
  };

  const renderSummary = (text) => {
    if (!text) return null;
    const cleanText = stripCitations(text);
    const lines = cleanText.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return <h3 key={idx}>{trimmed.replace(/\*\*/g, '')}</h3>;
      }
      if (trimmed.startsWith('- ')) {
        return <li key={idx}>{trimmed.substring(2)}</li>;
      }
      return <p key={idx}>{trimmed}</p>;
    });
  };

  const isValidPhone = (phone) => {
    if (!phone || phone.trim() === '') return false;
    const lower = phone.toLowerCase();
    if (lower.includes('not specified') || lower.includes('n/a') || 
        lower.includes('contact') || lower.includes('website') ||
        lower.includes('see ') || lower.includes('visit') || 
        lower.includes('available')) return false;
    if (!phone.match(/\d/)) return false;
    return true;
  };

  if (!isOpen || !resource) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="resource-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-area">
            <h2>{stripCitations(resource.name)}</h2>
            {resource.type && <span className="modal-resource-type">{stripCitations(resource.type)}</span>}
          </div>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <div className="modal-body">
          <div className="detail-summary">
            <div className="detail-existing">
              {resource.description && (
                <div className="detail-section">
                  <h3>Overview</h3>
                  <p>{stripCitations(resource.description)}</p>
                </div>
              )}
              {resource.notes && (
                <div className="detail-section">
                  <h3>Notes</h3>
                  <p>{stripCitations(resource.notes)}</p>
                </div>
              )}
            </div>

            <div className="detail-ai-section">
              {loading && (
                <div className="detail-loading-inline">
                  <div className="detail-spinner-small"></div>
                  <span>Getting more details...</span>
                </div>
              )}
              {error && !summary && (
                <div className="detail-error-inline">
                  <span>{error}</span>
                  <button onClick={fetchDetails} className="text-button">Try again</button>
                </div>
              )}
              {summary && (
                <div className="detail-content">
                  <div className="ai-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    AI-Enhanced Details
                  </div>
                  {renderSummary(summary)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {resource.url && (
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="primary-button">
              Visit Website
            </a>
          )}
          {isValidPhone(resource.phone) && (
            <a href={`tel:${resource.phone.replace(/\s/g, '')}`} className="secondary-button">
              {resource.phone}
            </a>
          )}
          <button onClick={onClose} className="text-button">Close</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [inAssessment, setInAssessment] = useState(false);
  const [answers, setAnswers] = useState({});
  const [showSearching, setShowSearching] = useState(false);
  const [location, setLocation] = useState('');
  const [searchPreference, setSearchPreference] = useState('both');
  const [category, setCategory] = useState(null);
  
  // Background search state
  const [searchJobId, setSearchJobId] = useState(null);
  const [searchStatus, setSearchStatus] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [searchStartTime, setSearchStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const [highlightCategory, setHighlightCategory] = useState(null);

  // Resource detail modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailResource, setDetailResource] = useState(null);
  const [detailCategoryName, setDetailCategoryName] = useState('');

  const openDetailModal = (resource, categoryName) => {
    setDetailResource(resource);
    setDetailCategoryName(categoryName);
    setDetailModalOpen(true);
  };

  // Poll for search results
  useEffect(() => {
    let pollInterval;
    let timeInterval;

    if (searchJobId && (searchStatus === 'pending' || searchStatus === 'searching')) {
      timeInterval = setInterval(() => {
        if (searchStartTime) {
          setElapsedTime((Date.now() - searchStartTime) / 1000);
        }
      }, 500);

      pollInterval = setInterval(async () => {
        try {
          const response = await fetch(`/.netlify/functions/search-status?jobId=${searchJobId}`);
          const data = await response.json();
          
          if (data.status === 'complete') {
            setSearchStatus('complete');
            setSearchResults(data.results);
            clearInterval(pollInterval);
            clearInterval(timeInterval);
          } else if (data.status === 'error') {
            setSearchStatus('error');
            setSearchError(data.error || 'Search failed');
            clearInterval(pollInterval);
            clearInterval(timeInterval);
          } else {
            setSearchStatus(data.status);
          }
        } catch (err) {
          console.error('Poll error:', err);
        }
      }, 3000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (timeInterval) clearInterval(timeInterval);
    };
  }, [searchJobId, searchStatus, searchStartTime]);

  const navigate = (page) => { 
    setCurrentPage(page); 
    setInAssessment(false); 
    setShowSearching(false);
    setSearchResults(null);
    window.scrollTo(0, 0); 
  };
  
  const startAssessment = () => {
    setShowSearching(false); 
    setSearchResults(null);
    setCategory(null); 
    setSearchJobId(null); 
    setSearchStatus(null); 
    setAnswers({});
    setInAssessment(true); 
    window.scrollTo(0, 0);
  };

  const exitAssessment = () => { 
    setInAssessment(false); 
    setCurrentPage('home'); 
    setShowSearching(false); 
    setAnswers({}); 
    setHighlightCategory(null); 
  };

  const handleAnswer = (questionId, value) => {
    const q = questions.find(q => q.id === questionId);
    
    if (q.type === 'multi') {
      const current = answers[questionId] || [];
      const option = q.options.find(o => o.value === value);
      
      if (option?.exclusive) {
        setAnswers({ ...answers, [questionId]: [value] });
      } else {
        const filtered = current.filter(v => {
          const opt = q.options.find(o => o.value === v);
          return !opt?.exclusive;
        });
        
        if (filtered.includes(value)) {
          setAnswers({ ...answers, [questionId]: filtered.filter(v => v !== value) });
        } else {
          setAnswers({ ...answers, [questionId]: [...filtered, value] });
        }
      }
    } else if (q.type === 'text') {
      setAnswers({ ...answers, [questionId]: value });
    } else {
      setAnswers({ ...answers, [questionId]: value });
    }
  };

  const handleSubmitAssessment = () => {
    const cat = determineCategory(answers);
    setCategory(cat);
    setHighlightCategory(cat);
    
    // Get location from Q24
    const userLocation = answers[24] || '';
    setLocation(userLocation);
    
    // Immediately start search
    setShowSearching(true);
    setInAssessment(false);
    window.scrollTo(0, 0);
    
    // Trigger the search
    performSearchWithData(cat, userLocation);
  };

  const performSearchWithData = async (cat, userLocation) => {
    if (!userLocation.trim()) return;
    
    const catInfo = categoryContent[cat];
    const symptoms = getSymptomProfile(answers);
    const seeking = answers[23] || [];
    const jobId = generateJobId();
    
    setSearchJobId(jobId);
    setSearchStatus('pending');
    setSearchError(null);
    setSearchResults(null);
    setSearchStartTime(Date.now());
    setElapsedTime(0);

    try {
      const response = await fetch('/.netlify/functions/search-resources-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          category: cat,
          categoryName: catInfo.name,
          categoryHelps: catInfo.helps,
          location: userLocation.trim(),
          preference: searchPreference,
          symptoms: symptoms.map(s => s.name),
          seeking,
          menopauseStage: answers[1],
          doctorExperience: answers[21],
          medicalFlags: answers[20] || []
        })
      });

      if (response.status !== 202 && !response.ok) {
        throw new Error('Failed to start search');
      }
    } catch (err) {
      setSearchStatus('error');
      setSearchError(err.message || 'Failed to start search');
    }
  };

  // Check if assessment is complete
  const answeredCount = Object.keys(answers).filter(k => {
    const val = answers[k];
    if (Array.isArray(val)) return val.length > 0;
    return val !== undefined && val !== null && val !== '';
  }).length;
  const totalQuestions = questions.length;
  
  // Location (Q24) must be filled
  const locationFilled = answers[24] && answers[24].trim().length > 0;
  const allAnswered = answeredCount >= totalQuestions - 2 && locationFilled;

  const getContext = () => {
    if (showSearching) {
      return { type: 'search', data: { location, onBack: startAssessment } };
    }
    if (!inAssessment && currentPage !== 'home') { 
      const titles = { 'categories': 'Understanding the Categories', 'how-it-works': 'How This Works', 'foundations': 'Foundations', 'resources': 'Resources', 'contact': 'Contact Us' }; 
      return { type: 'page', data: { title: titles[currentPage] || '' } }; 
    }
    return null;
  };
  const context = getContext();

  // Non-assessment, non-search pages
  if (!inAssessment && !showSearching) {
    return (
      <div className="app-wrapper">
        <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={inAssessment} />
        {context && <ContextNav context={context.type} data={context.data} />}
        <main className="main-content">
          {currentPage === 'home' && <LandingPage onStartAssessment={startAssessment} onNavigate={navigate} />}
          {currentPage === 'categories' && <CategoriesPage onStartAssessment={startAssessment} highlightCategory={highlightCategory} />}
          {currentPage === 'how-it-works' && <HowItWorksPage onStartAssessment={startAssessment} />}
          {currentPage === 'foundations' && <FoundationsPage />}
          {currentPage === 'resources' && <ResourcesPage />}
          {currentPage === 'contact' && <ContactPage />}
        </main>
      </div>
    );
  }

  // Search/Results view
  if (showSearching) {
    const cat = category || determineCategory(answers);
    const content = categoryContent[cat];
    const symptoms = getSymptomProfile(answers);

    // Show loading while searching
    if (searchStatus === 'pending' || searchStatus === 'searching') {
      return (
        <div className="app-wrapper">
          <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={false} />
          <ContextNav context="search" data={{ location, onBack: startAssessment }} />
          <main className="main-content">
            <div className="search-page">
              <SearchLoading elapsedTime={elapsedTime} />
            </div>
          </main>
        </div>
      );
    }

    // Show error
    if (searchStatus === 'error') {
      return (
        <div className="app-wrapper">
          <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={false} />
          <ContextNav context="search" data={{ location, onBack: startAssessment }} />
          <main className="main-content">
            <div className="search-page">
              <div className="search-error-container">
                <h2>Something went wrong</h2>
                <p>{searchError || 'We couldn\'t complete your search. Please try again.'}</p>
                <button className="primary-button" onClick={() => performSearchWithData(cat, location)}>
                  Try Again
                </button>
                <button className="text-button" onClick={startAssessment}>
                  Start Over
                </button>
              </div>
            </div>
          </main>
        </div>
      );
    }

    // Show results
    if (searchResults) {
      const isValidPhone = (phone) => {
        if (!phone || phone.trim() === '') return false;
        const lower = phone.toLowerCase();
        if (lower.includes('not specified') || lower.includes('n/a') || 
            lower.includes('contact') || lower.includes('website') ||
            lower.includes('see ') || lower.includes('visit') || 
            lower.includes('available')) return false;
        if (!phone.match(/\d/)) return false;
        return true;
      };

      return (
        <div className="app-wrapper">
          <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={false} />
          <ContextNav context="search" data={{ location, onBack: startAssessment }} />
          <main className="main-content">
            <div className="search-results-page" id="results-export">
              <div className="results-header-bar">
                <div className="results-header-content">
                  <h1>Your Menopause Support Resources</h1>
                  <p className="results-subtitle">Personalized results for {location}</p>
                </div>
                <div className="results-actions">
                  <button className="secondary-button" onClick={() => window.print()}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Save as PDF
                  </button>
                </div>
              </div>
              
              {searchResults.introduction && (
                <div className="results-intro-card">
                  <h2>What We Found</h2>
                  <p>{stripCitations(searchResults.introduction)}</p>
                </div>
              )}
              
              {searchResults.categories?.map((resCat, idx) => (
                <div key={idx} className="results-category">
                  <h2>{stripCitations(resCat.name)}</h2>
                  <div className="resources-grid">
                    {resCat.resources?.map((resource, ridx) => (
                      <div key={ridx} className="resource-card">
                        <div className="resource-card-header">
                          <h3>{stripCitations(resource.name)}</h3>
                          {resource.type && <span className="resource-type-badge">{stripCitations(resource.type)}</span>}
                        </div>
                        <p className="resource-description">{stripCitations(resource.description)}</p>
                        {resource.notes && <p className="resource-notes">{stripCitations(resource.notes)}</p>}
                        <div className="resource-actions">
                          <button onClick={() => openDetailModal(resource, resCat.name)} className="resource-detail-btn">More Detail</button>
                          {resource.url && <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">Visit Website →</a>}
                          {isValidPhone(resource.phone) && <a href={`tel:${resource.phone.replace(/\s/g, '')}`} className="resource-phone">{stripCitations(resource.phone)}</a>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {searchResults.additionalNotes && (
                <div className="results-notes">
                  <p>{stripCitations(searchResults.additionalNotes)}</p>
                </div>
              )}
              
              <div className="results-disclaimer">
                <p>These are options to explore, not recommendations. Please verify before contacting any provider.</p>
              </div>

              {/* Category Summary Section - At Bottom */}
              <div className="results-understanding-section">
                <h2>Understanding Your Results</h2>
                <div className="category-summary-card" style={{ borderLeftColor: content.color }}>
                  <div className="category-summary-header">
                    <span className="category-dot" style={{ background: content.color }}></span>
                    <div>
                      <h3>{content.name}</h3>
                      <p className="category-description">{content.description}</p>
                    </div>
                  </div>
                  <p className="category-positioning">{content.positioning}</p>
                  
                  {content.urgent && (
                    <div className="urgent-notice">
                      <p>We recommend seeking specialist guidance for your specific situation.</p>
                    </div>
                  )}
                  
                  {symptoms.length > 0 && (
                    <div className="symptom-summary">
                      <h4>Your Primary Concerns</h4>
                      <ul>
                        {symptoms.map((s, idx) => (
                          <li key={idx}>{s.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="category-details-grid">
                    <div className="category-detail-box">
                      <h4>What often helps</h4>
                      <ul>{content.helps.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
                    </div>
                    <div className="category-detail-box">
                      <h4>What to watch for</h4>
                      <ul>{content.monitor.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
                    </div>
                  </div>
                </div>
                
                <div className="understanding-footer">
                  <p>Want to explore different types of support? <button className="text-button" onClick={startAssessment}>Take the assessment again</button></p>
                  <button className="text-button" onClick={() => navigate('categories')}>Learn about all categories →</button>
                </div>
              </div>
            </div>
          </main>
          <ResourceDetailModal
            isOpen={detailModalOpen}
            onClose={() => setDetailModalOpen(false)}
            resource={detailResource}
            categoryName={detailCategoryName}
            location={location}
          />
        </div>
      );
    }

    // Fallback - shouldn't reach here
    return null;
  }

  // Assessment - All questions on one page, grouped by section
  return (
    <div className="app-wrapper">
      <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={inAssessment} />
      <div className="assessment-header-bar">
        <div className="assessment-header-content">
          <span className="assessment-progress-text">{answeredCount} of {totalQuestions} answered</span>
          <button onClick={exitAssessment} className="context-exit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Exit
          </button>
        </div>
      </div>
      <main className="main-content">
        <div className="assessment-single-page">
          <div className="assessment-intro">
            <h1>Menopause Assessment</h1>
            <p>Answer each question based on your current experience. This helps us understand your situation and find the right resources for you.</p>
          </div>
          
          {sections.map((section) => (
            <div key={section.id} className="assessment-section">
              <h2 className="section-title">{section.name}</h2>
              <div className="questions-list">
                {section.questions.map((qId) => {
                  const q = questions.find(qu => qu.id === qId);
                  const idx = questions.findIndex(qu => qu.id === qId);
                  
                  return (
                    <div key={q.id} className={`question-row ${answers[q.id] !== undefined && answers[q.id] !== '' ? 'answered' : ''}`}>
                      <div className="question-number">{idx + 1}</div>
                      <div className="question-content">
                        <p className="question-text-inline">{q.text}</p>
                        {q.subtext && <p className="question-subtext-inline">{q.subtext}</p>}
                        
                        {q.type === 'scale' && (
                          <div className="answer-options-text">
                            {scaleOptions.map((option) => (
                              <button 
                                key={option.value} 
                                className={`answer-option-text ${answers[q.id] === option.value ? 'selected' : ''}`}
                                onClick={() => handleAnswer(q.id, option.value)}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {q.type === 'single' && (
                          <div className="answer-options-vertical">
                            {q.options.map((option) => (
                              <button 
                                key={option.value} 
                                className={`answer-option-vertical ${answers[q.id] === option.value ? 'selected' : ''}`}
                                onClick={() => handleAnswer(q.id, option.value)}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {q.type === 'multi' && (
                          <div className="answer-options-vertical">
                            {q.options.map((option) => {
                              const selected = (answers[q.id] || []).includes(option.value);
                              return (
                                <button 
                                  key={option.value} 
                                  className={`answer-option-vertical multi ${selected ? 'selected' : ''}`}
                                  onClick={() => handleAnswer(q.id, option.value)}
                                >
                                  <span className="checkbox">{selected ? '✓' : ''}</span>
                                  {option.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        
                        {q.type === 'text' && (
                          <div className="answer-text-input">
                            <input 
                              type="text"
                              placeholder={q.placeholder || ''}
                              value={answers[q.id] || ''}
                              onChange={(e) => handleAnswer(q.id, e.target.value)}
                              className="location-input"
                            />
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
              {allAnswered ? 'Find My Resources →' : `Complete all questions (${answeredCount}/${totalQuestions})`}
            </button>
            <p className="assessment-note">Your answers are private and never stored.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
