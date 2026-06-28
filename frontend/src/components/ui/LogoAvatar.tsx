'use client';

import React, { useState, useMemo } from 'react';

// Normalize strings for hyphen/space-agnostic matching
function cleanString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

// Kept as a dynamic stub to prevent compilation failures if imported elsewhere
export function getOfficialLogoUrl(nameOrSlug: string): string | null {
  if (!nameOrSlug) return null;
  const slug = nameOrSlug.toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
  return `/logos/companies/${slug}.svg`;
}

interface LogoAvatarProps {
  logoUrl?: string | null;
  name: string;
  size?: string;
}

export function LogoAvatar({ logoUrl, name, size = "h-14 w-14" }: LogoAvatarProps) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [prevName, setPrevName] = useState(name);
  const [prevLogoUrl, setPrevLogoUrl] = useState(logoUrl);

  // Reset retry index when the company/investor name or logo URL changes
  if (name !== prevName || logoUrl !== prevLogoUrl) {
    setCandidateIndex(0);
    setPrevName(name);
    setPrevLogoUrl(logoUrl);
  }

  const initial = name.charAt(0).toUpperCase();

  // Dynamically generate all candidate paths in order of preference
  const candidates = useMemo(() => {
    if (!name) return [];

    const slug = name.toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');

    const extensions = ['.svg', '.png', '.webp', '.jpg', '.jpeg'];
    const list: string[] = [];

    // 1. Try companies directory extensions in order
    for (const ext of extensions) {
      list.push(`/logos/companies/${slug}${ext}`);
    }

    // 2. Try investors directory extensions in order
    for (const ext of extensions) {
      list.push(`/logos/investors/${slug}${ext}`);
    }

    // 3. Finally try the database logoUrl if provided
    if (logoUrl) {
      list.push(logoUrl);
    }

    return list;
  }, [name, logoUrl]);

  const hasFailedAll = candidateIndex >= candidates.length;
  const currentUrl = hasFailedAll ? null : candidates[candidateIndex];

  const handleError = () => {
    setCandidateIndex((prev) => prev + 1);
  };

  // Use a consistent logo container (56x56 px) with equal padding so logos are balanced
  const containerSize = "h-14 w-14"; // 56x56 px in Tailwind

  if (hasFailedAll || !currentUrl) {
    return (
      <div className={`${containerSize} rounded-full bg-[#FFFDF9] border border-[#C9A227]/40 flex items-center justify-center text-sm font-black text-[#C9A227] tracking-wider shrink-0 shadow-sm select-none`}>
        {initial}
      </div>
    );
  }

  return (
    <div className={`${containerSize} rounded-full bg-white border border-slate-200/60 p-2 flex items-center justify-center shrink-0 shadow-sm overflow-hidden`}>
      <img
        src={currentUrl}
        alt={name}
        onError={handleError}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
}
