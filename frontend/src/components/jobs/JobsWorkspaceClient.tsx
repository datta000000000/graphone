'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import { apiFetch } from '../../lib/api';
import { WorkspaceLayout } from '../layout/WorkspaceLayout';

import { LogoAvatar } from '../ui/LogoAvatar';

// Reusable category SVG icons
const getJobIcon = (name: string) => {
  switch (name) {
    case 'AI Engineer':
    case 'ML Engineer':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      );
    case 'Research Scientist':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    case 'Backend Developer':
    case 'Frontend Developer':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    case 'Product Management':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      );
    case 'Remote Roles':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    default:
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
  }
};

interface Job {
  id: string;
  title: string;
  companyName: string;
  companySlug: string;
  location: string;
  type: string;
  salary: string | null;
  postedDate: string;
  category: string;
  logoUrl: string;
  featured: boolean;
}

const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior AI Engineer',
    companyName: 'OpenAI',
    companySlug: 'openai',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    salary: '$220k - $310k',
    postedDate: '2 days ago',
    category: 'AI Engineer',
    logoUrl: 'https://logo.clearbit.com/openai.com',
    featured: true,
  },
  {
    id: 'j2',
    title: 'Research Scientist - Foundation Models',
    companyName: 'Anthropic',
    companySlug: 'anthropic',
    location: 'San Francisco, CA (On-site)',
    type: 'Full-time',
    salary: '$250k - $380k',
    postedDate: '3 days ago',
    category: 'Research Scientist',
    logoUrl: 'https://logo.clearbit.com/anthropic.com',
    featured: true,
  },
  {
    id: 'j3',
    title: 'ML Engineer - Code Intelligence',
    companyName: 'Cursor',
    companySlug: 'cursor',
    location: 'Remote (US/Canada)',
    type: 'Full-time',
    salary: '$180k - $240k',
    postedDate: '1 week ago',
    category: 'ML Engineer',
    logoUrl: 'https://logo.clearbit.com/cursor.sh',
    featured: false,
  },
  {
    id: 'j4',
    title: 'Senior Backend Developer',
    companyName: 'Runway',
    companySlug: 'runway',
    location: 'New York, NY (Hybrid)',
    type: 'Full-time',
    salary: '$160k - $210k',
    postedDate: '5 days ago',
    category: 'Backend',
    logoUrl: 'https://logo.clearbit.com/runwayml.com',
    featured: false,
  },
  {
    id: 'j5',
    title: 'AI Product Lead',
    companyName: 'OpenAI',
    companySlug: 'openai',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    salary: '$240k - $330k',
    postedDate: '2 weeks ago',
    category: 'Product',
    logoUrl: 'https://logo.clearbit.com/openai.com',
    featured: false,
  },
  {
    id: 'j6',
    title: 'Frontend Engineer - Interactive AI',
    companyName: 'Runway',
    companySlug: 'runway',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$140k - $190k',
    postedDate: '6 days ago',
    category: 'Frontend',
    logoUrl: 'https://logo.clearbit.com/runwayml.com',
    featured: false,
  },
];

export function JobsWorkspaceClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ companies: any[]; investors: any[]; products: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [category, setCategory] = useState<string>(''); // Sidebar filter
  const [jobType, setJobType] = useState<string>(''); // Full-time, etc.
  const [sort, setSort] = useState<'newest' | 'featured'>('newest');
  
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const categories = [
    { name: 'All Jobs', value: '' },
    { name: 'AI Engineer', value: 'AI Engineer' },
    { name: 'ML Engineer', value: 'ML Engineer' },
    { name: 'Research Scientist', value: 'Research Scientist' },
    { name: 'Backend Developer', value: 'Backend' },
    { name: 'Frontend Developer', value: 'Frontend' },
    { name: 'Product Management', value: 'Product' },
    { name: 'Remote Roles', value: 'Remote' },
  ];

  const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract'];

  // Handle local state filters
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filtered = [...MOCK_JOBS];

      // Search Query filter
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (j) =>
            j.title.toLowerCase().includes(query) ||
            j.companyName.toLowerCase().includes(query) ||
            j.location.toLowerCase().includes(query)
        );
      }

      // Sidebar Category filter
      if (category) {
        if (category === 'Remote') {
          filtered = filtered.filter((j) => j.location.toLowerCase().includes('remote'));
        } else {
          filtered = filtered.filter((j) => j.category === category);
        }
      }

      // Job Type filter
      if (jobType) {
        filtered = filtered.filter((j) => j.type === jobType);
      }

      // Sorting
      if (sort === 'featured') {
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      } else {
        filtered.sort((a, b) => b.id.localeCompare(a.id));
      }

      setJobs(filtered);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, category, jobType, sort]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  // Perform search mock
  const performSearch = async (query: string) => {
    const trimmed = query.trim();
    if (trimmed.length > 0) {
      setIsSearching(true);
      try {
        const data = await apiFetch<{ companies: any[]; investors: any[]; products: any[] }>(
          `/search?q=${encodeURIComponent(trimmed)}`
        );
        setSearchResults(data);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults(null);
    }
  };

  const visibleJobs = jobs.slice(0, visibleCount);
  const showLoadMore = jobs.length > visibleCount;

  // Render variables for WorkspaceLayout
  const sidebarContent = (
    <div className="space-y-6">
      <div>
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          Job Categories
        </h2>
        <nav className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setCategory(cat.value)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between border-l-2 ${
                category === cat.value
                  ? 'bg-[#C9A227]/10 border-[#C9A227] text-[#C9A227] font-extrabold shadow-sm'
                  : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <span className="shrink-0">{getJobIcon(cat.name)}</span>
                <span className="truncate">{cat.name}</span>
              </span>
            </button>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-100 pt-4 text-[9px] text-slate-400 font-semibold leading-relaxed">
        Select a career class to filter recruitment nodes in real-time.
      </div>
    </div>
  );

  const headerActionsContent = (
    <div className="flex items-center gap-3">
      <select
        value={jobType}
        onChange={(e) => setJobType(e.target.value)}
        className="bg-[#FFFDF9] border border-[#C9A227]/20 rounded-lg text-xs font-semibold px-3 py-2 text-slate-655 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/10 shadow-sm outline-none"
      >
        <option value="">All Job Types</option>
        {jobTypes.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as any)}
        className="bg-[#FFFDF9] border border-[#C9A227]/20 rounded-lg text-xs font-semibold px-3 py-2 text-slate-655 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/10 shadow-sm outline-none"
      >
        <option value="newest">Sort: Newest</option>
        <option value="featured">Sort: Featured</option>
      </select>
    </div>
  );

  const searchSectionContent = (
    <div className="relative w-full max-w-xl">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C9A227]">
        <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.25">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Type job title, skills, or company name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') performSearch(searchQuery);
        }}
        className="block w-full pl-10 pr-24 py-2.5 border border-[#C9A227]/20 bg-[#FFFDF9] focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/5 text-slate-900 placeholder-slate-400 rounded-full text-xs font-semibold shadow-sm transition-all"
      />
      <div className="absolute right-1.5 top-1.5">
        <button
          onClick={() => performSearch(searchQuery)}
          className="bg-[#C9A227] text-white px-4 py-1 rounded-full text-xs font-bold hover:bg-[#A67C00] active:scale-[0.98] transition-all shadow-sm"
        >
          Search
        </button>
      </div>
    </div>
  );

  const contentBody = (
    <div className="space-y-6">
      {searchResults && (
        <section className="bg-[#FFFDF9] border border-[#C9A227]/30 rounded-2xl p-6 shadow-luxury space-y-6 animate-reveal">
          <div className="flex items-center justify-between border-b border-[#C9A227]/10 pb-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Search Results for <span className="text-[#C9A227]">"{searchQuery}"</span>
            </h2>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-slate-400 hover:text-slate-900"
            >
              Clear
            </button>
          </div>

          {isSearching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Companies ({searchResults.companies.length})</h3>
                {searchResults.companies.length > 0 ? (
                  <div className="space-y-2.5">
                    {searchResults.companies.map((c) => (
                      <Link href={`/companies/${c.slug}`} key={c.id} className="block group">
                        <div className="flex items-center gap-3 p-3 border border-[#C9A227]/10 rounded-2xl hover:bg-slate-50 transition-colors bg-[#FFFDF9] shadow-sm">
                          <LogoAvatar logoUrl={c.logo_url} name={c.name} />
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-[#C9A227] transition-colors text-xs">{c.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{c.category} • {c.hq_city}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No companies matched.</p>
                )}
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Investors ({searchResults.investors.length})</h3>
                {searchResults.investors.length > 0 ? (
                  <div className="space-y-2.5">
                    {searchResults.investors.map((i) => (
                      <Link href={`/investors/${i.slug}`} key={i.id} className="block group">
                        <div className="flex items-center gap-3 p-3 border border-[#C9A227]/10 rounded-2xl hover:bg-slate-50 transition-colors bg-[#FFFDF9] shadow-sm">
                          <LogoAvatar logoUrl={i.logo_url} name={i.name} />
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-[#C9A227] transition-colors text-xs">{i.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{i.type} • {i.location}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-405">No investors matched.</p>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {!searchResults && (
        <>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, idx) => (
                <Skeleton key={idx} className="h-48 rounded-[20px]" />
              ))}
            </div>
          ) : visibleJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-reveal">
              {visibleJobs.map((j) => (
                <Card className={`p-6 flex flex-col justify-between h-full border rounded-[20px] bg-[#FFFDF9] shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 ${
                  j.featured ? 'border-[#C9A227]/30 bg-[#FFFDF9]' : 'border-[#C9A227]/15'
                }`} key={j.id}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <LogoAvatar logoUrl={j.logoUrl} name={j.companyName} />
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-xs leading-tight line-clamp-1">{j.title}</h3>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{j.companyName}</p>
                        </div>
                      </div>
                      {j.featured && (
                        <Badge variant="indigo" className="text-[8px] py-0 border-[#C9A227]/30 bg-[#FFFDF9] text-[#C9A227]">
                          Featured
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-[10px] text-slate-400 font-bold">
                      <span>📍 {j.location}</span>
                      <span>•</span>
                      <span>💼 {j.type}</span>
                      {j.salary && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600">💵 {j.salary}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-[#C9A227]/10 text-[10px] font-bold">
                    <span className="text-slate-400">Posted {j.postedDate}</span>
                    <button
                      onClick={() => alert(`Redirecting application pipeline for ${j.title} at ${j.companyName}!`)}
                      className="bg-[#C9A227] hover:bg-[#A67C00] text-white px-5 py-1.5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all text-[10px] font-bold shadow-sm"
                    >
                      Apply Now
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#FFFDF9] border border-[#C9A227]/15 rounded-[20px] shadow-sm">
              <p className="text-xs text-slate-405 font-semibold">No career vacancies matched your search criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );

  const paginationContent = !searchResults && showLoadMore && (
    <button
      onClick={handleLoadMore}
      className="bg-[#FFFDF9] border border-[#C9A227]/30 text-slate-700 font-bold px-5 py-2.5 rounded-full hover:border-[#C9A227] hover:text-[#C9A227] transition-all text-xs shadow-sm hover:shadow active:scale-[0.98]"
    >
      Load More Jobs
    </button>
  );

  return (
    <WorkspaceLayout
      sidebar={sidebarContent}
      headerTitle="Careers Hub"
      headerSubtitle="Discover engineering, research, design, and management vacancies in leading AI groups."
      headerActions={headerActionsContent}
      searchSection={searchSectionContent}
      content={contentBody}
      pagination={paginationContent || undefined}
    />
  );
}
