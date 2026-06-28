const fs = require('fs');
const path = require('path');
const https = require('https');

const COMPANIES_DIR = path.join(__dirname, 'public', 'logos', 'companies');
const INVESTORS_DIR = path.join(__dirname, 'public', 'logos', 'investors');

// Ensure directories exist
fs.mkdirSync(COMPANIES_DIR, { recursive: true });
fs.mkdirSync(INVESTORS_DIR, { recursive: true });

const COMPANIES = {
  openai: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg',
  anthropic: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/anthropic.svg',
  cursor: 'https://logo.clearbit.com/cursor.sh',
  perplexity: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/perplexity.svg',
  midjourney: 'https://logo.clearbit.com/midjourney.com',
  runway: 'https://logo.clearbit.com/runwayml.com',
  elevenlabs: 'https://logo.clearbit.com/elevenlabs.io',
  huggingface: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/huggingface.svg',
  mistral: 'https://logo.clearbit.com/mistral.ai',
  xai: 'https://logo.clearbit.com/x.ai',
  cohere: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/cohere.svg',
  databricks: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/databricks.svg',
  scale: 'https://logo.clearbit.com/scale.com',
  stability: 'https://logo.clearbit.com/stability.ai'
};

const INVESTORS = {
  sequoia: 'https://logo.clearbit.com/sequoiacap.com',
  a16z: 'https://logo.clearbit.com/a16z.com',
  ycombinator: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/ycombinator.svg',
  accel: 'https://logo.clearbit.com/accel.com',
  benchmark: 'https://logo.clearbit.com/benchmark.com',
  lightspeed: 'https://logo.clearbit.com/lsvp.com',
  greylock: 'https://logo.clearbit.com/greylock.com',
  generalcatalyst: 'https://logo.clearbit.com/generalcatalyst.com',
  khoslaventures: 'https://logo.clearbit.com/khoslaventures.com',
  foundersfund: 'https://logo.clearbit.com/foundersfund.com',
  indexventures: 'https://logo.clearbit.com/indexventures.com',
  nea: 'https://logo.clearbit.com/nea.com'
};

// Recursive downloader that handles 301/302 redirects
function download(url, dest, callback) {
  https.get(url, (response) => {
    // Handle redirects
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
      download(response.headers.location, dest, callback);
      return;
    }

    if (response.statusCode !== 200) {
      callback(new Error(`Failed to download ${url}: status code ${response.statusCode}`));
      return;
    }

    const file = fs.createWriteStream(dest);
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      callback(null);
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => {}); // Delete temp file
    callback(err);
  });
}

function startDownload(list, dir, prefix) {
  let entries = Object.entries(list);
  let count = 0;

  function next() {
    if (count >= entries.length) {
      console.log(`🎉 Finished downloading all ${prefix} logos.`);
      return;
    }
    const [name, url] = entries[count];
    const isSvg = url.endsWith('.svg');
    const ext = isSvg ? 'svg' : 'png';
    const destPath = path.join(dir, `${name}.${ext}`);

    console.log(`Downloading ${name} logo from ${url}...`);
    download(url, destPath, (err) => {
      if (err) {
        console.error(`❌ Error downloading ${name}:`, err.message);
      } else {
        console.log(`✅ Saved: ${name}.${ext}`);
      }
      count++;
      next();
    });
  }
  next();
}

console.log('🚀 Starting official brand logo downloads...');
startDownload(COMPANIES, COMPANIES_DIR, 'company');
startDownload(INVESTORS, INVESTORS_DIR, 'investor');
