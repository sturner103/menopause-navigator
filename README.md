# Menopause Navigator

A free, private navigation tool to help women find menopause-trained doctors, specialists, and support services.

## Overview

Menopause Navigator uses a comprehensive 22-question assessment to understand:
- Your stage in the menopause transition
- Your symptoms and their severity
- Your experience with healthcare so far
- What kind of support you're looking for

Based on your responses, we search for real resources in your area including:
- Menopause-trained GPs
- Menopause specialists and clinics
- Telehealth menopause services
- Dietitians with women's health focus
- Pelvic floor physiotherapists
- Mental health support
- Peer support groups

## Categories

The assessment places users into one of five navigation categories:

1. **Early Explorer** - New to symptoms, seeking information and validation
2. **Active Seeker** - Ready for real support, may have been dismissed before
3. **Treatment Navigator** - Tried treatments, need optimization or specialist input
4. **Specialist Pathway** - Complex factors requiring specialist guidance
5. **Optimization Mode** - Good care in place, seeking complementary support

## Tech Stack

- React + Vite
- Netlify Functions (background functions for search)
- Upstash Redis (job status storage)
- Anthropic Claude API with web search

## Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - `ANTHROPIC_API_KEY` - Your Anthropic API key
   - `UPSTASH_REDIS_REST_URL` - Upstash Redis URL
   - `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token
4. Run locally: `npm run dev`
5. Deploy to Netlify

## Environment Variables (Netlify)

```
ANTHROPIC_API_KEY=sk-ant-...
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

## Project Structure

```
menopause-navigator/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Styles
│   └── main.jsx         # Entry point
├── netlify/
│   └── functions/
│       ├── search-resources-background.js  # AI search function
│       └── search-status.js                # Job status polling
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.js
└── netlify.toml
```

## License

MIT

## Disclaimer

This is a navigation tool, not a medical service. It does not provide diagnoses or medical advice. Always consult qualified healthcare providers for medical decisions.
