const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const API_BASE = 'http://localhost:3001/api/v1';

// Reusable HTTP JSON Fetcher
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Reusable client for getting page HTML or downloading files with browser User-Agent and timeouts
function fetchUrlContent(urlStr, isBinary = false, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(urlStr);
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': isBinary ? 'image/*, */*' : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        timeout: timeoutMs
      };

      const client = urlStr.startsWith('https') ? https : http;
      const req = client.get(options, (res) => {
        // Follow redirects (HTTP 3xx)
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = res.headers.location.startsWith('http') 
            ? res.headers.location 
            : `${parsedUrl.protocol}//${parsedUrl.host}${res.headers.location}`;
          fetchUrlContent(redirectUrl, isBinary, timeoutMs).then(resolve).catch(reject);
          return;
        }

        if (res.statusCode !== 200) {
          reject(new Error(`HTTP status code ${res.statusCode}`));
          return;
        }

        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(isBinary ? buffer : buffer.toString('utf8'));
        });
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.on('error', reject);
    } catch (e) {
      reject(e);
    }
  });
}

// Extracts candidate logo URLs from website HTML
function findLogoUrls(html, baseUrl) {
  const urls = [];

  // Try to locate header, nav, or top banner sections where logos live
  let headerHtml = '';
  const headerMatch = html.match(/<header[^>]*>([\s\S]*?)<\/header>/i) || 
                      html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/i) ||
                      html.match(/<div[^>]*(?:id|class)=["'][^"']*(?:header|nav|top-bar|branding)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  if (headerMatch) {
    headerHtml = headerMatch[1];
  } else {
    // If no clear header found, use the first 40% of the body content
    headerHtml = html.slice(0, Math.floor(html.length * 0.4));
  }

  // Heuristic 1: Look for <img> tags containing logo/brand keywords
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(headerHtml)) !== null) {
    const src = match[1];
    const fullImgTag = match[0];
    if (/logo|brand|header|logo-dark|logo-light|logo-svg|logo-png/i.test(src) || /logo|brand/i.test(fullImgTag)) {
      try {
        urls.push(new URL(src, baseUrl).href);
      } catch (e) {}
    }
  }

  // Heuristic 2: Look for inline <svg> blocks representing logos/brands
  const svgRegex = /<svg[^>]*>([\s\S]*?)<\/svg>/gi;
  while ((match = svgRegex.exec(headerHtml)) !== null) {
    const fullSvg = match[0];
    if (/logo|brand/i.test(fullSvg)) {
      urls.push({ type: 'inline-svg', content: fullSvg });
    }
  }

  // Heuristic 3: Check standard og:image tags
  const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                       html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (ogImageMatch) {
    try {
      urls.push(new URL(ogImageMatch[1], baseUrl).href);
    } catch (e) {}
  }

  // Heuristic 4: Check standard icon links
  const iconLinkMatch = html.match(/<link[^>]+rel=["'](?:apple-touch-icon|icon)["'][^>]+href=["']([^"']+)["']/i) ||
                        html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:apple-touch-icon|icon)["']/i);
  if (iconLinkMatch) {
    try {
      urls.push(new URL(iconLinkMatch[1], baseUrl).href);
    } catch (e) {}
  }

  // Filter duplicates
  const uniqueUrls = [];
  const seen = new Set();
  for (const u of urls) {
    const key = typeof u === 'string' ? u : u.content;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueUrls.push(u);
    }
  }

  return uniqueUrls;
}

// Verifies downloaded buffer contains a valid image (not HTML error pages)
function verifyImageContent(buffer, filepath) {
  if (!buffer || buffer.length < 4) return false;

  const ext = path.extname(filepath).toLowerCase();
  
  if (ext === '.svg') {
    const str = buffer.toString('utf8').trim();
    // Must contain svg tag or namespace, and must not be HTML wrapper
    return (str.includes('<svg') || str.includes('xmlns=')) && 
           !str.includes('<!DOCTYPE html') && 
           !str.includes('<html');
  }
  
  if (ext === '.png') {
    // PNG Magic signature: 89 50 4E 47
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  }
  
  if (ext === '.jpg' || ext === '.jpeg') {
    // JPEG Magic signature: FF D8 FF
    return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  }
  
  if (ext === '.webp') {
    const riff = buffer.toString('ascii', 0, 4);
    const webp = buffer.toString('ascii', 8, 12);
    return riff === 'RIFF' && webp === 'WEBP';
  }

  return false;
}

// Helper to determine target extension based on URL
function getExtFromUrl(urlStr, defaultExt = '.png') {
  try {
    const parsed = new URL(urlStr);
    const pathname = parsed.pathname;
    if (pathname.endsWith('.svg')) return '.svg';
    if (pathname.endsWith('.png')) return '.png';
    if (pathname.endsWith('.webp')) return '.webp';
    if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) return '.jpg';
  } catch (e) {}
  return defaultExt;
}

async function scrapeBrandLogo(name, slug, website, destDir) {
  if (!website) {
    throw new Error('No website URL provided');
  }

  console.log(`\nScraping [${name}] from ${website}...`);
  const html = await fetchUrlContent(website, false);
  const candidates = findLogoUrls(html, website);
  
  if (candidates.length === 0) {
    throw new Error('No candidate logo URLs found in page structure');
  }

  // Iterate over candidates trying to download the highest quality one
  for (const cand of candidates) {
    try {
      if (typeof cand === 'object' && cand.type === 'inline-svg') {
        const destPath = path.join(destDir, `${slug}.svg`);
        const buffer = Buffer.from(cand.content, 'utf8');
        if (verifyImageContent(buffer, destPath)) {
          fs.writeFileSync(destPath, buffer);
          return { file: `${slug}.svg`, status: 'Extracted Inline SVG' };
        }
      } else {
        const ext = getExtFromUrl(cand);
        const destPath = path.join(destDir, `${slug}${ext}`);
        const buffer = await fetchUrlContent(cand, true);
        if (verifyImageContent(buffer, destPath)) {
          fs.writeFileSync(destPath, buffer);
          return { file: `${slug}${ext}`, status: `Downloaded ${ext.toUpperCase()} from website` };
        }
      }
    } catch (e) {
      // Try next candidate
    }
  }

  throw new Error('Failed to download any valid image candidate');
}

async function main() {
  const rootDir = __dirname;
  const COMPANIES_DIR = path.join(rootDir, 'frontend', 'public', 'logos', 'companies');
  const INVESTORS_DIR = path.join(rootDir, 'frontend', 'public', 'logos', 'investors');
  const REPORT_PATH = path.join(rootDir, 'logo_scrape_report.md');

  fs.mkdirSync(COMPANIES_DIR, { recursive: true });
  fs.mkdirSync(INVESTORS_DIR, { recursive: true });

  const scraped = [];
  const failed = [];

  let companies = [];
  let investors = [];

  try {
    const compRes = await fetchJson(`${API_BASE}/companies?limit=100`);
    companies = compRes.data || [];
  } catch (e) {
    console.error('Failed to fetch companies from database API:', e.message);
  }

  try {
    const invRes = await fetchJson(`${API_BASE}/investors?limit=100`);
    investors = invRes.data || [];
  } catch (e) {
    console.error('Failed to fetch investors from database API:', e.message);
  }

  // Process Companies
  for (const c of companies) {
    try {
      const res = await scrapeBrandLogo(c.name, c.slug, c.website, COMPANIES_DIR);
      scraped.push({ name: c.name, slug: c.slug, type: 'Company', ...res });
    } catch (err) {
      console.log(`❌ Failed to scrape logo for [${c.name}]: ${err.message}`);
      failed.push({ name: c.name, slug: c.slug, type: 'Company', reason: err.message });
    }
  }

  // Process Investors
  for (const i of investors) {
    try {
      const res = await scrapeBrandLogo(i.name, i.slug, i.website, INVESTORS_DIR);
      scraped.push({ name: i.name, slug: i.slug, type: 'Investor', ...res });
    } catch (err) {
      console.log(`❌ Failed to scrape logo for [${i.name}]: ${err.message}`);
      failed.push({ name: i.name, slug: i.slug, type: 'Investor', reason: err.message });
    }
  }

  // Generate Scraper Report
  const report = `# Brand Logo Scraping Report

This report summarizes the execution details of \`download_official_logos.js\`.

## 1. Successfully Scraped & Verified Logos
Total: ${scraped.length}

| Brand Name | Slug | Type | Saved File | Scrape Source / Status |
| --- | --- | --- | --- | --- |
${scraped.map(s => `| ${s.name} | ${s.slug} | ${s.type} | ${s.file} | ${s.status} |`).join('\n')}

## 2. Skipped / Failed Logos
Total: ${failed.length}

| Brand Name | Slug | Type | Reason for Failure |
| --- | --- | --- | --- |
${failed.map(f => `| ${f.name} | ${f.slug} | ${f.type} | ${f.reason} |`).join('\n')}
`;

  fs.writeFileSync(REPORT_PATH, report);
  console.log(`\n=== Scraping Completed. Report written to ${REPORT_PATH} ===`);
}

main().catch(err => {
  console.error('Fatal Scraper Error:', err);
});
