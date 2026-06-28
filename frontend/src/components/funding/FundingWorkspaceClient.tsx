'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import { formatCurrency } from '../../lib/utils';
import { apiFetch } from '../../lib/api';
import { WorkspaceLayout } from '../layout/WorkspaceLayout';

import { LogoAvatar } from '../ui/LogoAvatar';

// Reusable category SVG icons
const getFundingIcon = (name: string) => {
  switch (name) {
    case 'Pre-Seed':
    case 'Seed':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'Series A':
    case 'Series B':
    case 'Series C':
    case 'Growth':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    case 'IPO':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      );
    default:
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

interface CompanyFunding {
  id: string;
  name: string;
  slug: string;
  stage: string;
  category: string;
  funding_total: number;
  logo_url: string;
  founded_year: number;
}

interface FundingWorkspaceClientProps {
  initialCompanies: CompanyFunding[];
  initialTotal: number;
  initialCursor: string | null;
}

export function FundingWorkspaceClient({
  initialCompanies,
  initialTotal,
  initialCursor,
}: FundingWorkspaceClientProps) {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ companies: any[]; investors: any[]; products: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Filter & sort state
  const [companies, setCompanies] = useState<CompanyFunding[]>(initialCompanies);
  const [visibleCount, setVisibleCount] = useState(9);
  const [category, setCategory] = useState<string>(''); // Stage filter
  const [sort, setSort] = useState<'funded' | 'new'>('funded');
  const [isLoadingList, setIsLoadingList] = useState(false);

  const categories = [
    { name: 'All Funding', value: '' },
    { name: 'Pre-Seed', value: 'Pre-Seed' },
    { name: 'Seed', value: 'Seed' },
    { name: 'Series A', value: 'Series A' },
    { name: 'Series B', value: 'Series B' },
    { name: 'Series C', value: 'Series C' },
    { name: 'Growth', value: 'Growth' },
    { name: 'IPO', value: 'IPO' },
  ];

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  // Perform search
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

  // Debounced search trigger
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Handle active filter changes
  useEffect(() => {
    setIsLoadingList(true);
    const timer = setTimeout(() => {
      let filtered = [...initialCompanies];
      
      if (category) {
        filtered = filtered.filter((c) => c.stage === category);
      }

      if (sort === 'new') {
        filtered.sort((a, b) => b.founded_year - a.founded_year);
      } else {
        filtered.sort((a, b) => b.funding_total - a.funding_total);
      }

      setCompanies(filtered);
      setVisibleCount(9);
      setIsLoadingList(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [category, sort, initialCompanies]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  const visibleCompanies = companies.slice(0, visibleCount);
  const showLoadMore = companies.length > visibleCount;

  // Mock investor maps
  const getLeadInvestorName = (slug: string) => {
    if (slug === 'openai') return 'Thrive Capital';
    if (slug === 'anthropic') return 'Google Ventures';
    if (slug === 'cursor') return 'Andreessen Horowitz';
    if (slug === 'runway') return 'General Catalyst';
    return 'GraphOne Partners';
  };

  const getRoundDate = (year: number, slug: string) => {
    if (slug === 'openai') return 'Feb 2025';
    if (slug === 'cursor') return 'Mar 2024';
    return `Jun ${year + 1}`;
  };

  // Render variables for WorkspaceLayout
  const sidebarContent = (
    <div className="space-y-6">
      <div>
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          Funding Stages
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
                <span className="shrink-0">{getFundingIcon(cat.name)}</span>
                <span className="truncate">{cat.name}</span>
              </span>
            </button>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-200/60 pt-4 text-[9px] text-slate-400 font-semibold leading-relaxed">
        Filter transactions by seed, series progression, or growth rounds.
      </div>
    </div>
  );

  const headerActionsContent = (
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value as any)}
      className="bg-[#FFFDF9] border border-[#C9A227]/20 rounded-lg text-xs font-semibold px-3 py-2 text-slate-600 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/10 shadow-sm outline-none"
    >
      <option value="funded">Sort: Largest</option>
      <option value="new">Sort: Newest</option>
    </select>
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
        placeholder="Type company name or keywords..."
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
    <div className="space-y-8 animate-reveal">
      
      {searchResults && (
        <section className="bg-[#FFFDF9] border border-[#C9A227]/30 rounded-2xl p-6 shadow-luxury space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Workspace Search Results for <span className="text-[#C9A227]">"{searchQuery}"</span>
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

      {/* Cards list */}
      {!searchResults && (
        <div className="space-y-4">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/60 pb-2">
            Funding Transactions ({companies.length})
          </h2>

          {isLoadingList ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, idx) => (
                <Skeleton key={idx} className="h-48 rounded-[20px]" />
              ))}
            </div>
          ) : visibleCompanies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleCompanies.map((c) => (
                <Card className="p-6 flex flex-col justify-between h-full border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 rounded-[20px]" key={c.id}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <LogoAvatar logoUrl={c.logo_url} name={c.name} />
                      <div>
                        <h3 className="font-bold text-slate-900 text-xs line-clamp-1 leading-none">
                          {c.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">{c.stage} Round</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1 pt-1.5">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Amount Raised</p>
                      <p className="text-xl font-black text-[#C9A227] tracking-tight">{formatCurrency(c.funding_total)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-4 pt-3 border-t border-[#C9A227]/10 text-[10px] font-bold">
                    <div className="flex justify-between">
                      <span className="text-[#6B6B6B]">Lead Investor:</span>
                      <span className="text-slate-900 truncate max-w-[140px]">{getLeadInvestorName(c.slug)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B6B6B]">Date:</span>
                      <span className="text-slate-900">{getRoundDate(c.founded_year, c.slug)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/40">
                      <Badge variant="indigo" className="text-[9px] py-0 border-[#C9A227]/30 bg-[#FFFDF9] text-[#C9A227]">{c.category}</Badge>
                      <Link
                        href={`/companies/${c.slug}`}
                        className="text-[#C9A227] hover:text-[#A67C00] font-black"
                      >
                        View Company →
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#FFFDF9] border border-[#C9A227]/15 rounded-[20px] shadow-sm">
              <p className="text-xs text-slate-400 font-semibold">No transactions matched your filters.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );

  const paginationContent = showLoadMore && (
    <button
      onClick={handleLoadMore}
      className="bg-[#FFFDF9] border border-[#C9A227]/30 text-slate-700 font-bold px-5 py-2.5 rounded-full hover:border-[#C9A227] hover:text-[#C9A227] transition-all text-xs shadow-sm hover:shadow active:scale-[0.98]"
    >
      Load More Rounds
    </button>
  );

  return (
    <WorkspaceLayout
      sidebar={sidebarContent}
      headerTitle="Funding Rounds"
      headerSubtitle="Inspect venture rounds, capital aggregates, lead backers, and dates."
      headerActions={headerActionsContent}
      searchSection={searchSectionContent}
      content={contentBody}
      pagination={paginationContent || undefined}
    />
  );
}
