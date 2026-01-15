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
  { id: 'seeking', name: 'What You\'re Looking For', questions: [23] }
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
  ]}
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

const crisisResources = {
  nz: { name: "New Zealand", resources: [
    { name: "Need to Talk?", phone: "1737", description: "Free call or text, 24/7" },
    { name: "Lifeline", phone: "0800 543 354", description: "24/7 crisis support" }
  ]},
  au: { name: "Australia", resources: [
    { name: "Lifeline", phone: "13 11 14", description: "24/7 crisis support" },
    { name: "Beyond Blue", phone: "1300 22 4636", description: "Anxiety and depression support" }
  ]},
  uk: { name: "United Kingdom", resources: [
    { name: "Samaritans", phone: "116 123", description: "Free, 24/7" },
    { name: "Mind Infoline", phone: "0300 123 3393", description: "Mental health support" }
  ]},
  us: { name: "United States", resources: [
    { name: "988 Suicide & Crisis Lifeline", phone: "988", description: "Call or text, 24/7" },
    { name: "SAMHSA Helpline", phone: "1-800-662-4357", description: "Mental health referrals" }
  ]}
};

// Generate unique job ID
function generateJobId() {
  return 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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
  if (context === 'results') {
    return (
      <div className="context-nav">
        <div className="context-nav-container">
          <div className="context-breadcrumb">
            <span className="context-label">Your Results</span>
            <span className="context-separator">→</span>
            <span className="context-current">{data.categoryName}</span>
          </div>
          <div className="context-actions">
            <button 
              className={`context-tab ${data.view === 'results' ? 'active' : ''}`}
              onClick={() => data.setView('results')}
            >
              Summary
            </button>
            <button 
              className={`context-tab ${data.view === 'search' ? 'active' : ''}`}
              onClick={() => data.setView('search')}
            >
              Find Resources
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (context === 'search') {
    return (
      <div className="context-nav">
        <div className="context-nav-container">
          <div className="context-breadcrumb">
            <span className="context-label">Find Resources</span>
            <span className="context-separator">→</span>
            <span className="context-current">{data.location || 'Enter location'}</span>
          </div>
          <button onClick={data.onBack} className="context-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Results
          </button>
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
              <p>22 questions about your symptoms, experience, and what you're looking for. Takes about 8 minutes.</p>
            </div>
            <div className="process-card">
              <div className="process-icon">🔍</div>
              <h4>Get Matched</h4>
              <p>We search for menopause-trained GPs, specialists, and support services in your area.</p>
            </div>
            <div className="process-card">
              <div className="process-icon">📋</div>
              <h4>Save Your Report</h4>
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
                <p>Answer 22 questions about your symptoms, medical history, and what you're looking for. Takes about 8 minutes.</p>
              </div>
            </div>
            <div className="hiw-step-arrow">→</div>
            <div className="hiw-step-simple">
              <div className="hiw-step-icon">🔍</div>
              <div className="hiw-step-content">
                <h4>Find Resources</h4>
                <p>We build a personalized report of menopause-trained doctors, specialists, and support services in your area.</p>
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
                <li>An endorsement of any provider</li>
                <li>A guarantee of provider availability</li>
              </ul>
            </div>
            <div className="limitation-card is">
              <h3>This IS</h3>
              <ul>
                <li>A navigation tool to help you explore options</li>
                <li>A starting point for finding support</li>
                <li>Validation that your symptoms are real</li>
                <li>A personalized report from real-time sources</li>
                <li>Free, private, and anonymous</li>
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
        <h1>Foundations for Menopause Wellness</h1>
        <p className="page-intro">While our search engine helps you find professional support, there are foundational lifestyle factors that can significantly impact how you feel during menopause.</p>
        
        <section className="foundation-section">
          <h2>🏋️ Resistance Training</h2>
          <p>Strength training is one of the most impactful things you can do during menopause. It helps:</p>
          <ul>
            <li>Maintain muscle mass that naturally declines with age</li>
            <li>Support bone density and reduce osteoporosis risk</li>
            <li>Improve metabolic health and body composition</li>
            <li>Boost mood and reduce anxiety</li>
            <li>Improve sleep quality</li>
          </ul>
          <p><strong>Start simple:</strong> Even 2-3 sessions per week of basic strength exercises can make a significant difference.</p>
        </section>

        <section className="foundation-section">
          <h2>🥗 Nutrition Focus</h2>
          <p>What you eat affects how you feel. During menopause, consider:</p>
          <ul>
            <li><strong>Protein:</strong> Aim for adequate protein at each meal to support muscle maintenance</li>
            <li><strong>Reduce processed carbs:</strong> Cutting back on refined carbohydrates can help with energy levels and weight management</li>
            <li><strong>Calcium and Vitamin D:</strong> Important for bone health</li>
            <li><strong>Phytoestrogens:</strong> Foods like soy, flaxseed, and legumes may help some women</li>
          </ul>
        </section>

        <section className="foundation-section">
          <h2>😴 Sleep Hygiene</h2>
          <p>Sleep disruption is one of the most common menopause symptoms. Foundations that help:</p>
          <ul>
            <li>Keep your bedroom cool (night sweats are real)</li>
            <li>Consistent sleep and wake times</li>
            <li>Limit alcohol, especially in the evening</li>
            <li>Consider moisture-wicking sleepwear and bedding</li>
          </ul>
        </section>

        <section className="foundation-section">
          <h2>🧘 Stress Management</h2>
          <p>Chronic stress can worsen menopause symptoms. Consider:</p>
          <ul>
            <li>Regular physical activity (natural stress relief)</li>
            <li>Mindfulness or meditation practices</li>
            <li>Setting boundaries and saying no</li>
            <li>Connection with others going through similar experiences</li>
          </ul>
        </section>

        <div className="foundation-note">
          <p><strong>Important:</strong> These foundations can help, but they're not a substitute for medical care if you need it. If your symptoms are significantly affecting your quality of life, professional support — including HRT for many women — can be transformative.</p>
        </div>
      </div>
    </div>
  );
}

function ResourcesPage() {
  return (
    <div className="content-page">
      <div className="page-content">
        <h1>Helpful Resources</h1>
        
        <section className="resource-section">
          <h2>Educational Resources</h2>
          <div className="resource-list">
            <a href="https://www.menopause.org.au" target="_blank" rel="noopener noreferrer" className="resource-link-card">
              <h4>Australasian Menopause Society</h4>
              <p>Evidence-based information and practitioner directory</p>
            </a>
            <a href="https://www.themenopausecharity.org" target="_blank" rel="noopener noreferrer" className="resource-link-card">
              <h4>The Menopause Charity (UK)</h4>
              <p>Comprehensive resources and support</p>
            </a>
            <a href="https://www.menopause.org" target="_blank" rel="noopener noreferrer" className="resource-link-card">
              <h4>North American Menopause Society</h4>
              <p>Research and education resources</p>
            </a>
          </div>
        </section>

        <section className="resource-section">
          <h2>If You're Struggling</h2>
          <p>Menopause can significantly impact mental health. If you're experiencing severe anxiety, depression, or thoughts of self-harm, please reach out:</p>
          <div className="crisis-resources-compact">
            {Object.entries(crisisResources).map(([key, region]) => (
              <div key={key} className="crisis-region-compact">
                <h4>{region.name}</h4>
                {region.resources.map((r, idx) => (
                  <div key={idx} className="crisis-item">
                    <span className="crisis-name">{r.name}</span>
                    {r.phone && <a href={`tel:${r.phone.replace(/\s/g, '')}`} className="crisis-phone">{r.phone}</a>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="content-page">
      <div className="page-content narrow">
        <h1>Contact Us</h1>
        <p>Have feedback or questions about Menopause Navigator? We'd love to hear from you.</p>
        <form className="contact-form" name="contact" method="POST" data-netlify="true">
          <input type="hidden" name="form-name" value="contact" />
          <div className="form-group">
            <label htmlFor="name">Your name (optional)</label>
            <input type="text" id="name" name="name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your email (optional)</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className="form-group">
            <label htmlFor="message">Your message</label>
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
    const lines = text.split('\n');
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
            <h2>{resource.name}</h2>
            {resource.type && <span className="modal-resource-type">{resource.type}</span>}
          </div>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <div className="modal-body">
          <div className="detail-summary">
            <div className="detail-existing">
              {resource.description && (
                <div className="detail-section">
                  <h3>Overview</h3>
                  <p>{resource.description}</p>
                </div>
              )}
              {resource.notes && (
                <div className="detail-section">
                  <h3>Notes</h3>
                  <p>{resource.notes}</p>
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
  const [resultsView, setResultsView] = useState('results');
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
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
    setShowResults(false); 
    setResultsView('results'); 
    window.scrollTo(0, 0); 
  };
  
  const startAssessment = () => {
    setShowResults(false); 
    setSearchResults(null);
    setCategory(null); 
    setSearchJobId(null); 
    setSearchStatus(null); 
    setAnswers({});
    setInAssessment(true); 
    setResultsView('results'); 
    window.scrollTo(0, 0);
  };

  const exitAssessment = () => { 
    setInAssessment(false); 
    setCurrentPage('home'); 
    setShowResults(false); 
    setAnswers({}); 
    setHighlightCategory(null); 
    setResultsView('results'); 
  };

  const handleAnswer = (questionId, value) => {
    const q = questions.find(q => q.id === questionId);
    
    if (q.type === 'multi') {
      const current = answers[questionId] || [];
      const option = q.options.find(o => o.value === value);
      
      if (option?.exclusive) {
        // Exclusive option clears others
        setAnswers({ ...answers, [questionId]: [value] });
      } else {
        // Toggle the value, remove exclusive options
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
    } else {
      setAnswers({ ...answers, [questionId]: value });
    }
  };

  const handleSubmitAssessment = () => {
    const cat = determineCategory(answers);
    setCategory(cat);
    setHighlightCategory(cat);
    setShowResults(true);
    window.scrollTo(0, 0);
  };

  const performSearch = async () => {
    if (!location.trim()) return;
    
    const cat = category || determineCategory(answers);
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
          location: location.trim(),
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
  const requiredQuestions = questions.filter(q => q.type !== 'multi' || q.id === 20 || q.id === 23);
  const answeredCount = Object.keys(answers).filter(k => {
    const val = answers[k];
    if (Array.isArray(val)) return val.length > 0;
    return val !== undefined && val !== null;
  }).length;
  const totalQuestions = questions.length;
  const allAnswered = answeredCount >= totalQuestions - 2; // Allow some optional multi-selects

  const getContext = () => {
    if (showResults && resultsView === 'results') { 
      const cat = category || determineCategory(answers);
      return { type: 'results', data: { categoryName: categoryContent[cat].name, view: resultsView, setView: setResultsView } }; 
    }
    if (showResults && resultsView === 'search') {
      return { type: 'search', data: { location, onBack: () => setResultsView('results') } };
    }
    if (!inAssessment && currentPage !== 'home') { 
      const titles = { 'categories': 'Understanding the Categories', 'how-it-works': 'How This Works', 'foundations': 'Foundations', 'resources': 'Resources', 'contact': 'Contact Us' }; 
      return { type: 'page', data: { title: titles[currentPage] || '' } }; 
    }
    return null;
  };
  const context = getContext();

  // Non-assessment pages
  if (!inAssessment) {
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

  // Search view
  if (showResults && resultsView === 'search') {
    const cat = category || determineCategory(answers);

    // Show loading while searching
    if (searchStatus === 'pending' || searchStatus === 'searching') {
      return (
        <div className="app-wrapper">
          <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={inAssessment} />
          <ContextNav context="search" data={{ location, onBack: () => { setResultsView('results'); setSearchJobId(null); setSearchStatus(null); } }} />
          <main className="main-content">
            <div className="search-page">
              <SearchLoading elapsedTime={elapsedTime} />
            </div>
          </main>
        </div>
      );
    }

    // Show results
    if (searchResults) {
      return (
        <div className="app-wrapper">
          <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={inAssessment} />
          <ContextNav context="search" data={{ location, onBack: () => setResultsView('results') }} />
          <main className="main-content">
            <div className="search-results-page" id="results-export">
              <div className="results-header-bar">
                <div className="results-header-content">
                  <h1>Resources for You</h1>
                  <p className="results-subtitle">Based on {categoryContent[cat].name} in {location}</p>
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
                  <p>{searchResults.introduction}</p>
                </div>
              )}
              
              {searchResults.categories?.map((cat, idx) => (
                <div key={idx} className="results-category">
                  <h2>{cat.name}</h2>
                  <div className="resources-grid">
                    {cat.resources?.map((resource, ridx) => {
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
                        <div key={ridx} className="resource-card">
                          <div className="resource-card-header">
                            <h3>{resource.name}</h3>
                            {resource.type && <span className="resource-type-badge">{resource.type}</span>}
                          </div>
                          <p className="resource-description">{resource.description}</p>
                          {resource.notes && <p className="resource-notes">{resource.notes}</p>}
                          <div className="resource-actions">
                            <button onClick={() => openDetailModal(resource, cat.name)} className="resource-detail-btn">More Detail</button>
                            {resource.url && <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">Visit Website →</a>}
                            {isValidPhone(resource.phone) && <a href={`tel:${resource.phone.replace(/\s/g, '')}`} className="resource-phone">{resource.phone}</a>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              {searchResults.additionalNotes && (
                <div className="results-notes">
                  <p>{searchResults.additionalNotes}</p>
                </div>
              )}
              
              <div className="results-disclaimer">
                <p>These are options to explore, not recommendations. Please verify before contacting any provider.</p>
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

    // Search input form
    return (
      <div className="app-wrapper">
        <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={inAssessment} />
        <ContextNav context="results" data={{ categoryName: categoryContent[cat].name, view: resultsView, setView: setResultsView }} />
        <main className="main-content">
          <div className="search-page">
            <div className="search-form-container">
              <h1>Find Resources</h1>
              <p>We'll search for menopause-trained doctors, specialists, and support services in your area.</p>
              
              <div className="search-form">
                <div className="form-group">
                  <label>Your location:</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Auckland, NZ or Sydney, Australia" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="location-input"
                  />
                </div>
                <div className="form-group">
                  <label>Type of support:</label>
                  <div className="preference-options">
                    {['both', 'local', 'remote'].map(pref => (
                      <button 
                        key={pref} 
                        className={`preference-option ${searchPreference === pref ? 'selected' : ''}`} 
                        onClick={() => setSearchPreference(pref)}
                      >
                        <span className="preference-icon">{pref === 'both' ? '🌐' : pref === 'local' ? '📍' : '💻'}</span>
                        <span>{pref === 'both' ? 'Both' : pref === 'local' ? 'In-person' : 'Remote'}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {searchError && <div className="search-error"><p>{searchError}</p></div>}
                <button className="primary-button large full-width" onClick={performSearch} disabled={!location.trim()}>
                  Search for Resources
                </button>
                <div className="search-note">
                  <p>This comprehensive search can take 2-3 minutes. Please be patient.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Results summary
  if (showResults && resultsView === 'results') {
    const cat = category || determineCategory(answers);
    const content = categoryContent[cat];
    const symptoms = getSymptomProfile(answers);
    
    return (
      <div className="app-wrapper">
        <TopNav currentPage={currentPage} onNavigate={navigate} onStartAssessment={startAssessment} inAssessment={inAssessment} />
        <ContextNav context="results" data={{ categoryName: content.name, view: resultsView, setView: setResultsView }} />
        <main className="main-content">
          <div className="results-page">
            <div className="results-top">
              <div className="results-main">
                <div className="results-header">
                  <span className="results-label">Your Results</span>
                  <h1>{content.name}</h1>
                </div>
                <div className="results-positioning"><p>{content.positioning}</p></div>
                {content.urgent && <div className="urgent-notice"><p>We recommend seeking specialist guidance for your specific situation.</p></div>}
                
                {symptoms.length > 0 && (
                  <div className="symptom-summary">
                    <h3>Your Primary Concerns</h3>
                    <ul>
                      {symptoms.map((s, idx) => (
                        <li key={idx}>{s.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="results-cta-box">
                <h3>Find Resources</h3>
                <p>We'll build a personalized report of menopause support in your area.</p>
                <button className="primary-button large full-width" onClick={() => setResultsView('search')}>
                  Build My Report →
                </button>
              </div>
            </div>
            
            <div className="results-details">
              <div className="results-section">
                <h2>What often helps</h2>
                <ul>{content.helps.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
              </div>
              <div className="results-section">
                <h2>What to watch for</h2>
                <ul>{content.monitor.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
              </div>
            </div>
            
            <div className="results-footer">
              <button className="text-button" onClick={() => navigate('categories')}>View all categories →</button>
              <p className="disclaimer">This is not a diagnosis. Please consult a healthcare provider for clinical assessment.</p>
            </div>
          </div>
        </main>
      </div>
    );
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
                    <div key={q.id} className={`question-row ${answers[q.id] !== undefined ? 'answered' : ''}`}>
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
              {allAnswered ? 'See My Results →' : `Answer more questions (${answeredCount}/${totalQuestions})`}
            </button>
            <p className="assessment-note">Your answers are private and never stored.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
