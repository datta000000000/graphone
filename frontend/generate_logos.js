const fs = require('fs');
const path = require('path');

const LOGO_DIR = path.join(__dirname, 'public', 'logos');

// Ensure public/logos directory exists
if (!fs.existsSync(LOGO_DIR)) {
  fs.mkdirSync(LOGO_DIR, { recursive: true });
}

// Define premium minimalist SVGs for each brand matching our Luxury Gold theme
const LOGOS = {
  'openai': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M50 20v60M35 25l30 50M25 35l50 30M20 50h60M25 65l50-30M35 75l30-50" stroke="#C9A227" stroke-width="4" stroke-linecap="round"/>
  </svg>`,

  'anthropic': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M30 70V30l20 25 20-25v40" stroke="#C9A227" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  'cursor': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M35 25l35 25-15 5 15 20h-10L45 55l-10 5V25z" fill="#C9A227"/>
  </svg>`,

  'perplexity': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M50 25a25 25 0 100 50 25 25 0 000-50zm0 15v20" stroke="#C9A227" stroke-width="5" stroke-linecap="round"/>
  </svg>`,

  'mistral': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M30 35l20 15 20-15v30H30V35z" stroke="#C9A227" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  'xai': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M30 30l40 40M70 30L30 70" stroke="#C9A227" stroke-width="6" stroke-linecap="round"/>
  </svg>`,

  'cohere': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M50 25C35 25 25 35 25 50s10 25 25 25 25-10 25-25" stroke="#C9A227" stroke-width="5" stroke-linecap="round"/>
  </svg>`,

  'elevenlabs': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M30 40c10-15 30-15 40 0M25 50c15-20 35-20 50 0M20 60c20-25 40-25 60 0" stroke="#C9A227" stroke-width="4.5" stroke-linecap="round"/>
  </svg>`,

  'huggingface': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M35 45c0-10 30-10 30 0M35 55c0 10 30 10 30 0" stroke="#C9A227" stroke-width="4.5" stroke-linecap="round"/>
    <circle cx="42" cy="45" r="4" fill="#C9A227"/>
    <circle cx="58" cy="45" r="4" fill="#C9A227"/>
  </svg>`,

  'runway': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M30 35h40v10H30V35zm0 20h40v10H30V55z" fill="#C9A227"/>
  </svg>`,

  'scale': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M30 30h40M30 50h40M30 70h40" stroke="#C9A227" stroke-width="6" stroke-linecap="round"/>
  </svg>`,

  'databricks': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M50 25L25 38v25l25 12 25-12V38L50 25zm0 10l15 8-15 8-15-8 15-8z" fill="#C9A227"/>
  </svg>`,

  'sequoia': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M50 25L30 65h40L50 25z" fill="#C9A227"/>
    <path d="M47 65v10h6V65h-6z" fill="#C9A227"/>
  </svg>`,

  'a16z': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M30 65L50 25l20 40H30zm8-10h24" stroke="#C9A227" stroke-width="5" stroke-linecap="round"/>
  </svg>`,

  'ycombinator': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M35 30l15 20 15-20M50 50v20" stroke="#C9A227" stroke-width="6" stroke-linecap="round"/>
  </svg>`,

  'accel': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M30 65l20-35 20 35H30z" fill="#C9A227"/>
  </svg>`,

  'lightspeed': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M50 20L30 45h15v35l20-25H50V20z" fill="#C9A227"/>
  </svg>`,

  'generalcatalyst': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <circle cx="50" cy="50" r="20" stroke="#C9A227" stroke-width="5"/>
    <circle cx="50" cy="50" r="8" fill="#C9A227"/>
  </svg>`,

  'benchmark': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M35 35h30v30H35V35zm5 5h20v20H40V40z" fill="#C9A227"/>
  </svg>`,

  'greylock': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M30 35c10-10 30-10 40 0v30c-10 10-30 10-40 0V35z" stroke="#C9A227" stroke-width="4.5"/>
  </svg>`,

  'nea': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M30 65V35l40 30V35" stroke="#C9A227" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  'khosla': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M30 30h40M50 30v40" stroke="#C9A227" stroke-width="6.5" stroke-linecap="round"/>
  </svg>`,

  'foundersfund': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M30 35c10 0 15 15 20 15s10-15 20-15v30c-10 0-15-15-20-15s-10 15-20 15V35z" fill="#C9A227"/>
  </svg>`,

  'indexventures': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" fill="#FFFDF9" stroke="#C9A227" stroke-width="2"/>
    <path d="M30 35L50 65l20-30" stroke="#C9A227" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
};

// Write each logo SVG to public/logos/
for (const [name, svg] of Object.entries(LOGOS)) {
  fs.writeFileSync(path.join(LOGO_DIR, `${name}.svg`), svg);
  console.log(`Generated logo asset: ${name}.svg`);
}

console.log('🎉 Logo asset generation complete.');
