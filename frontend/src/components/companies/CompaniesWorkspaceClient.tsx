'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Company } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import { formatCurrency } from '../../lib/utils';
import { apiFetch } from '../../lib/api';
import { WorkspaceLayout } from '../layout/WorkspaceLayout';

import { LogoAvatar } from '../ui/LogoAvatar';

// Reusable category SVG icons
const getCategorySvg = (name: string) => {
  switch (name) {
    case 'AI Agents':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      );
    case 'AI Coding':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    case 'AI Search':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    case 'AI Video':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    case 'AI Voice':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      );
    case 'AI Infrastructure':
    case 'Foundation Models':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    case 'Healthcare AI':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    default:
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
        </svg>
      );
  }
};

interface CompaniesWorkspaceClientProps {
  initialCompanies: Company[];
  initialTotal: number;
  initialCursor: string | null;
}

export function CompaniesWorkspaceClient({
  initialCompanies,
  initialTotal,
  initialCursor,
}: CompaniesWorkspaceClientProps) {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ companies: Company[]; investors: any[]; products: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Filter & sort state
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [total, setTotal] = useState(initialTotal);
  const [nextCursor, setNextCursor] = useState<string | null>(initialCursor);
  const [category, setCategory] = useState<string>('');
  const [stage, setStage] = useState<string>('');
  const [sort, setSort] = useState<'trending' | 'funded' | 'new'>('trending');
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const categories = [
    'AI Agents', 'AI Coding', 'AI Search', 'AI Video',
    'AI Voice', 'AI Infrastructure', 'Healthcare AI', 'Foundation Models'
  ];

  const stages = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth', 'IPO'];

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  // Perform search
  const performSearch = async (query: string) => {
    const trimmed = query.trim();
    if (trimmed.length > 0) {
      setIsSearching(true);
      try {
        const data = await apiFetch<{ companies: Company[]; investors: any[]; products: any[] }>(
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

  // Debounced search trigger
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Handle active filter changes
  useEffect(() => {
    if (category === '' && stage === '' && sort === 'trending' && companies === initialCompanies) return;

    async function fetchFiltered() {
      setIsLoadingList(true);
      try {
        let url = `${BASE_URL}/companies?limit=12&sort=${sort}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (stage) url += `&stage=${encodeURIComponent(stage)}`;

        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          setCompanies(json.data);
          setTotal(json.meta?.total || 0);
          setNextCursor(json.meta?.cursor || null);
        }
      } catch (err) {
        console.error('Failed to fetch filtered companies:', err);
      } finally {
        setIsLoadingList(false);
      }
    }

    fetchFiltered();
  }, [category, stage, sort]);

  // Load more trigger
  const handleLoadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);

    try {
      let url = `${BASE_URL}/companies?limit=12&sort=${sort}&cursor=${nextCursor}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      if (stage) url += `&stage=${encodeURIComponent(stage)}`;

      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setCompanies((prev) => [...prev, ...json.data]);
        setNextCursor(json.meta?.cursor || null);
      }
    } catch (err) {
      console.error('Load more failed:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Render variables for WorkspaceLayout
  const sidebarContent = (
    <div className="space-y-6">
      <div>
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          Industry Sectors
        </h2>
        <nav className="space-y-1">
          <button
            onClick={() => setCategory('')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between border-l-2 ${
              category === ''
                ? 'bg-[#C9A227]/10 border-[#C9A227] text-[#C9A227] font-extrabold shadow-sm'
                : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-xs">🏢</span>
              <span>All Industries</span>
            </span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between border-l-2 ${
                category === cat
                  ? 'bg-[#C9A227]/10 border-[#C9A227] text-[#C9A227] font-extrabold shadow-sm'
                  : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <span className="shrink-0">{getCategorySvg(cat)}</span>
                <span className="truncate">{cat}</span>
              </span>
            </button>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-200/60 pt-4 text-[9px] text-slate-405 font-semibold leading-relaxed">
        Select an industry sector to filter startup connection nodes.
      </div>
    </div>
  );

  const headerActionsContent = (
    <>
      <select
        value={stage}
        onChange={(e) => setStage(e.target.value)}
        className="bg-[#FFFDF9] border border-[#C9A227]/20 rounded-lg text-xs font-semibold px-3 py-2 text-slate-600 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/10 shadow-sm outline-none"
      >
        <option value="">All Stages</option>
        {stages.map((stg) => (
          <option key={stg} value={stg}>{stg}</option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as any)}
        className="bg-[#FFFDF9] border border-[#C9A227]/20 rounded-lg text-xs font-semibold px-3 py-2 text-slate-600 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/10 shadow-sm outline-none"
      >
        <option value="trending">Sort: Trending</option>
        <option value="funded">Sort: Most Funded</option>
        <option value="new">Sort: Newly Added</option>
      </select>
    </>
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
        placeholder="Type startup name, slug, or keywords..."
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
    <>
      {searchResults && (
        <section className="bg-[#FFFDF9] border border-[#C9A227]/30 rounded-2xl p-6 shadow-luxury space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-28 rounded-2xl" />
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
                  <p className="text-xs text-slate-405">No companies matched.</p>
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
          {isLoadingList ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, idx) => (
                <Skeleton key={idx} className="h-48 rounded-[20px]" />
              ))}
            </div>
          ) : companies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-reveal">
              {companies.map((company) => (
                <Link href={`/companies/${company.slug}`} key={company.id} className="block group">
                  <Card className="p-7 flex flex-col justify-between h-full border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-luxury-hover hover:border-[#C9A227]/40 hover:-translate-y-1.5 transition-all duration-300 rounded-[28px] group-hover:border-[#C9A227]/30">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3.5">
                        <LogoAvatar logoUrl={company.logo_url} name={company.name} size="h-11 w-11" />
                        <div>
                          <h3 className="font-black text-slate-900 group-hover:text-[#C9A227] transition-colors text-sm line-clamp-1 leading-tight">
                            {company.name}
                          </h3>
                          <p className="text-[9px] text-[#6B6B6B] font-bold uppercase tracking-widest mt-1.5">{company.stage} • {company.hq_city}</p>
                        </div>
                      </div>
                      <p className="text-xs text-[#6B6B6B] font-medium line-clamp-2 leading-relaxed mt-2.5">
                        {company.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 mt-6 pt-4 border-t border-[#C9A227]/10 text-xs font-bold">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">Total Funding</span>
                        <span className="text-slate-900 font-black">{formatCurrency(company.funding_total)}</span>
                      </div>
                      {company.valuation && (
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold">Valuation</span>
                          <span className="text-slate-900 font-black">{formatCurrency(company.valuation)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#C9A227]/5">
                        <Badge variant="gray" className="text-[9px] py-0.5 border-[#C9A227]/30 bg-[#FFFDF9] text-[#C9A227] font-black">{company.category}</Badge>
                        <span className="text-[#C9A227] font-black tracking-wider uppercase text-[10px]">Growth: {company.growth_score}%</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#FFFDF9] border border-[#C9A227]/15 rounded-[24px] shadow-sm">
              <p className="text-xs text-slate-400 font-semibold">No startups matched your filters.</p>
            </div>
          )}
        </>
      )}
    </>
  );

  const paginationContent = !searchResults && nextCursor && (
    <button
      onClick={handleLoadMore}
      disabled={isLoadingMore}
      className="bg-[#FFFDF9] border border-[#C9A227]/30 text-slate-700 font-bold px-5 py-2.5 rounded-full hover:border-[#C9A227] hover:text-[#C9A227] transition-all text-xs shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-50"
    >
      {isLoadingMore ? 'Loading More...' : 'Load More Startups'}
    </button>
  );

  return (
    <WorkspaceLayout
      sidebar={sidebarContent}
      headerTitle="Companies Workspace"
      headerSubtitle="Analyze startup listings, growth indicators, and financial round history."
      headerActions={headerActionsContent}
      searchSection={searchSectionContent}
      content={contentBody}
      pagination={paginationContent || undefined}
    />
  );
}
