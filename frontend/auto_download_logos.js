const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const API_BASE = 'http://localhost:3001/api/v1';
const COMPANIES_DIR = path.join(__dirname, 'public', 'logos', 'companies');
const INVESTORS_DIR = path.join(__dirname, 'public', 'logos', 'investors');
const LOGO_AVATAR_PATH = path.join(__dirname, 'src', 'components', 'ui', 'LogoAvatar.tsx');
const REPORT_PATH = path.join(__dirname, '..', 'logo_download_report.md');

// Ensure directories exist
fs.mkdirSync(COMPANIES_DIR, { recursive: true });
fs.mkdirSync(INVESTORS_DIR, { recursive: true });

// Simple Icons Mapping helper for custom normalized keys
const SIMPLE_ICONS_KEYS = {
  'openai': 'openai',
  'anthropic': 'anthropic',
  'perplexity': 'perplexity',
  'huggingface': 'huggingface',
  'cohere': 'cohere',
  'databricks': 'databricks',
  'ycombinator': 'ycombinator',
  'stability': 'stabilityai',
  'xai': 'x'
};

const downloaded = [];
const notFound = [];
const fallbackList = [];

// Helper: HTTP GET request as JSON
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

// Helper: Follow redirects and download file
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Status: ${res.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

// Extract domain from URL
function getDomain(webUrl) {
  if (!webUrl) return null;
  try {
    let clean = webUrl.replace(/^(https?:\/\/)?(www\.)?/, '');
    return clean.split('/')[0];
  } catch (e) {
    return null;
  }
}

async function processItem(item, isCompany) {
  const name = item.name;
  const slug = item.slug;
  const dir = isCompany ? COMPANIES_DIR : INVESTORS_DIR;
  const webDomain = getDomain(item.website);

  // Check if logo exists (either .svg or .png)
  const svgExists = fs.existsSync(path.join(dir, `${slug}.svg`));
  const pngExists = fs.existsSync(path.join(dir, `${slug}.png`));

  if (svgExists || pngExists) {
    console.log(`- Logo already exists for ${name} (${slug})`);
    downloaded.push({ name, slug, status: 'Existing Local Asset', type: isCompany ? 'Company' : 'Investor' });
    return;
  }

  // Try Simple Icons first if mapped
  const siKey = SIMPLE_ICONS_KEYS[slug] || slug.replace(/[^a-zA-Z0-9]/g, '');
  const simpleIconsUrl = `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${siKey}.svg`;
  const destSvg = path.join(dir, `${slug}.svg`);

  try {
    await downloadFile(simpleIconsUrl, destSvg);
    console.log(`- Downloaded Simple Icons SVG for ${name}`);
    downloaded.push({ name, slug, status: 'Downloaded SVG (Simple Icons)', type: isCompany ? 'Company' : 'Investor' });
    return;
  } catch (err) {
    // 404 is fine, we try website clearbit next
  }

  // Try Clearbit Logo API via website domain
  if (webDomain) {
    const clearbitUrl = `https://logo.clearbit.com/${webDomain}`;
    const destPng = path.join(dir, `${slug}.png`);

    try {
      await downloadFile(clearbitUrl, destPng);
      console.log(`- Downloaded Clearbit PNG for ${name} (${webDomain})`);
      downloaded.push({ name, slug, status: 'Downloaded PNG (Clearbit)', type: isCompany ? 'Company' : 'Investor' });
      return;
    } catch (err) {
      // Failed Clearbit
    }
  }

  console.log(`- No brand logo found for ${name} (${slug})`);
  notFound.push({ name, slug, type: isCompany ? 'Company' : 'Investor' });
  fallbackList.push({ name, slug, type: isCompany ? 'Company' : 'Investor' });
}

async function run() {
  console.log('Fetching database companies & investors...');
  
  let companies = [];
  let investors = [];
  
  try {
    const compRes = await fetchJson(`${API_BASE}/companies?limit=100`);
    companies = compRes.data || [];
  } catch (e) {
    console.error('Failed to query companies API:', e.message);
  }

  try {
    const invRes = await fetchJson(`${API_BASE}/investors?limit=100`);
    investors = invRes.data || [];
  } catch (e) {
    console.error('Failed to query investors API:', e.message);
  }

  console.log(`Processing ${companies.length} companies...`);
  for (const c of companies) {
    await processItem(c, true);
  }

  console.log(`Processing ${investors.length} investors...`);
  for (const i of investors) {
    await processItem(i, false);
  }

  // Generate dynamic mappings inside LogoAvatar.tsx
  console.log('Generating dynamic LogoAvatar mappings...');
  const compFiles = fs.readdirSync(COMPANIES_DIR);
  const invFiles = fs.readdirSync(INVESTORS_DIR);

  const mappings = {};
  compFiles.forEach(f => {
    const base = path.basename(f, path.extname(f));
    mappings[base] = `/logos/companies/${f}`;
  });
  invFiles.forEach(f => {
    const base = path.basename(f, path.extname(f));
    mappings[base] = `/logos/investors/${f}`;
  });

  // Write new LogoAvatar.tsx content dynamically
  const mappingString = Object.entries(mappings)
    .map(([key, val]) => `  '${key}': '${val}',`)
    .join('\n');

  const avatarContent = `'use client';

import React, { useState } from 'react';

const OFFICIAL_LOGOS: Record<string, string> = {
${mappingString}
};

export function getOfficialLogoUrl(nameOrSlug: string): string | null {
  const norm = nameOrSlug.toLowerCase().trim();
  for (const [key, url] of Object.entries(OFFICIAL_LOGOS)) {
    if (norm.includes(key)) {
      return url;
    }
  }
  return null;
}

interface LogoAvatarProps {
  logoUrl?: string | null;
  name: string;
  size?: string;
}

export function LogoAvatar({ logoUrl, name, size = "h-14 w-14" }: LogoAvatarProps) {
  const [error, setError] = useState(false);
  const initial = name.charAt(0).toUpperCase();

  // Try to resolve the official logo URL from our pre-defined local overrides under subfolders
  const resolvedLogoUrl = getOfficialLogoUrl(name) || logoUrl;

  // Use a consistent logo container (56x56 px) with equal padding so logos are balanced
  const containerSize = "h-14 w-14"; // 56x56 px in Tailwind

  if (!resolvedLogoUrl || error) {
    return (
      <div className={\`\${containerSize} rounded-full bg-[#FFFDF9] border border-[#C9A227]/40 flex items-center justify-center text-sm font-black text-[#C9A227] tracking-wider shrink-0 shadow-sm select-none\`}>
        {initial}
      </div>
    );
  }

  return (
    <div className={\`\${containerSize} rounded-full bg-white border border-slate-200/60 p-2 flex items-center justify-center shrink-0 shadow-sm overflow-hidden\`}>
      <img
        src={resolvedLogoUrl}
        alt={name}
        onError={() => setError(true)}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
}
`;

  fs.writeFileSync(LOGO_AVATAR_PATH, avatarContent);
  console.log('✅ Updated LogoAvatar.tsx with dynamic mappings.');

  // Create report
  console.log('Writing logo download execution report...');
  let report = `# Logo Downloader Report

This report summarizes the logo downloading execution for GraphOne.

## 1. Successfully Downloaded Logos / Existing Assets
Total: ${downloaded.length}

| Name | Slug | Type | Source / Status |
| --- | --- | --- | --- |
${downloaded.map(d => `| ${d.name} | ${d.slug} | ${d.type} | ${d.status} |`).join('\n')}

## 2. Logos Not Found
Total: ${notFound.length}

| Name | Slug | Type |
| --- | --- | --- |
${notFound.map(n => `| ${n.name} | ${n.slug} | ${n.type} |`).join('\n')}

## 3. Logos Using Fallback Letter Avatars
Total: ${fallbackList.length}

| Name | Slug | Type |
| --- | --- | --- |
${fallbackList.map(f => `| ${f.name} | ${f.slug} | ${f.type} |`).join('\n')}
`;

  fs.writeFileSync(REPORT_PATH, report);
  console.log('✅ Generated logo_download_report.md');
}

run();
