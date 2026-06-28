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
const getInvestorIcon = (name: string) => {
  switch (name) {
    case 'Venture Capital':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case 'Angel Investors':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'Corporate VC':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9" />
        </svg>
      );
    case 'Accelerators':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case 'Government Funds':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      );
    default:
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z" />
        </svg>
      );
  }
};

interface Investor {
  id: string;
  name: string;
  slug: string;
  type: string;
  bio: string;
  aum: number | null;
  portfolio_count: number;
  stage_focus: string[];
  sector_focus: string[];
  location: string;
  logo_url: string;
  avg_check_size: number | null;
  investment_thesis: string;
}

interface InvestorsWorkspaceClientProps {
  initialInvestors: Investor[];
  initialTotal: number;
  initialCursor: string | null;
  featuredInvestors: Investor[];
}

export function InvestorsWorkspaceClient({
  initialInvestors,
  initialTotal,
  initialCursor,
  featuredInvestors,
}: InvestorsWorkspaceClientProps) {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ companies: any[]; investors: Investor[]; products: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Filter & sort state
  const [investors, setInvestors] = useState<Investor[]>(initialInvestors);
  const [total, setTotal] = useState(initialTotal);
  const [nextCursor, setNextCursor] = useState<string | null>(initialCursor);
  const [category, setCategory] = useState<string>(''); // Type filter
  const [stageFocus, setStageFocus] = useState<string>('');
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const categories = [
    { name: 'All Investors', value: '' },
    { name: 'Venture Capital', value: 'VC' },
    { name: 'Angel Investors', value: 'Angel' },
    { name: 'Corporate VC', value: 'Corporate' },
    { name: 'Accelerators', value: 'Accelerator' },
    { name: 'Government Funds', value: 'Government' },
  ];

  const stages = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth', 'IPO'];

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  // Perform search
  const performSearch = async (query: string) => {
    const trimmed = query.trim();
    if (trimmed.length > 0) {
      setIsSearching(true);
      try {
        const data = await apiFetch<{ companies: any[]; investors: Investor[]; products: any[] }>(
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
    if (category === '' && stageFocus === '' && investors === initialInvestors) return;

    async function fetchFiltered() {
      setIsLoadingList(true);
      try {
        let url = `${BASE_URL}/investors?limit=12`;
        if (category) url += `&type=${encodeURIComponent(category)}`;
        if (stageFocus) url += `&stage=${encodeURIComponent(stageFocus)}`;

        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          setInvestors(json.data || []);
          setTotal(json.meta?.total || 0);
          setNextCursor(json.meta?.cursor || null);
        }
      } catch (err) {
        console.error('Failed to fetch filtered investors:', err);
      } finally {
        setIsLoadingList(false);
      }
    }

    fetchFiltered();
  }, [category, stageFocus]);

  // Load more trigger
  const handleLoadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);

    try {
      let url = `${BASE_URL}/investors?limit=12&cursor=${nextCursor}`;
      if (category) url += `&type=${encodeURIComponent(category)}`;
      if (stageFocus) url += `&stage=${encodeURIComponent(stageFocus)}`;

      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setInvestors((prev) => [...prev, ...json.data]);
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
          Investor Segments
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
                <span className="shrink-0">{getInvestorIcon(cat.name)}</span>
                <span className="truncate">{cat.name}</span>
              </span>
            </button>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-200/60 pt-4 text-[9px] text-slate-400 font-semibold leading-relaxed">
        Select an allocator type to filter capital networks.
      </div>
    </div>
  );

  const headerActionsContent = (
    <select
      value={stageFocus}
      onChange={(e) => setStageFocus(e.target.value)}
      className="bg-[#FFFDF9] border border-[#C9A227]/20 rounded-lg text-xs font-semibold px-3 py-2 text-slate-650 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/10 shadow-sm outline-none"
    >
      <option value="">All Stage Focus</option>
      {stages.map((stg) => (
        <option key={stg} value={stg}>{stg} Focus</option>
      ))}
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
        placeholder="Type allocator name, bio, or keywords..."
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

      {/* Featured Investors Section */}
      {!searchResults && featuredInvestors.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/60 pb-2 flex items-center gap-1.5">
            <span>👑</span> Most Active Allocators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredInvestors.map((inv) => (
              <Link href={`/investors/${inv.slug}`} key={inv.id} className="block group">
                <Card className="p-6 flex flex-col justify-between h-full border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 rounded-[24px] border-l-4 border-l-[#C9A227]">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <LogoAvatar logoUrl={inv.logo_url} name={inv.name} />
                      <div>
                        <h3 className="font-extrabold text-[#1F1F1F] group-hover:text-[#C9A227] transition-colors text-xs line-clamp-1 leading-none">{inv.name}</h3>
                        <p className="text-[9px] text-[#6B6B6B] font-bold uppercase tracking-wider mt-1">{inv.type}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#6B6B6B] font-semibold line-clamp-2 leading-relaxed">{inv.bio}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#C9A227]/10 text-[10px] font-bold text-[#6B6B6B]">
                    <span>{inv.location}</span>
                    <span className="text-[#C9A227]">Profile →</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Allocators Grid */}
      {!searchResults && (
        <div className="space-y-4">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/60 pb-2">
            All Capital Networks ({total})
          </h2>

          {isLoadingList ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, idx) => (
                <Skeleton key={idx} className="h-48 rounded-[20px]" />
              ))}
            </div>
          ) : investors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {investors.map((inv) => (
                <Link href={`/investors/${inv.slug}`} key={inv.id} className="block group">
                  <Card className="p-7 flex flex-col justify-between h-full border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-luxury-hover hover:border-[#C9A227]/40 hover:-translate-y-1.5 transition-all duration-300 rounded-[28px] group-hover:border-[#C9A227]/30">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3.5">
                        <LogoAvatar logoUrl={inv.logo_url} name={inv.name} size="h-11 w-11" />
                        <div>
                          <h3 className="font-black text-slate-900 group-hover:text-[#C9A227] transition-colors text-sm line-clamp-1 leading-tight">
                            {inv.name}
                          </h3>
                          <p className="text-[10px] text-[#6B6B6B] font-bold mt-1.5">{inv.type} • {inv.location}</p>
                        </div>
                      </div>
                      <p className="text-xs text-[#6B6B6B] font-medium line-clamp-2 leading-relaxed mt-2.5">
                        {inv.bio}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 mt-6 pt-4 border-t border-[#C9A227]/10 text-xs font-bold">
                      {inv.aum && (
                        <div className="flex justify-between">
                          <span className="text-[#6B6B6B] font-semibold">AUM</span>
                          <span className="text-[#1F1F1F] font-black">{formatCurrency(inv.aum)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-[#6B6B6B] font-semibold">Portfolio Size</span>
                        <span className="text-[#1F1F1F] font-black">{inv.portfolio_count} Companies</span>
                      </div>
                      {inv.avg_check_size && (
                        <div className="flex justify-between pt-0.5">
                          <span className="text-[#6B6B6B] font-semibold">Avg Check Size</span>
                          <span className="text-[#1F1F1F] font-black">{formatCurrency(inv.avg_check_size)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#C9A227]/5">
                        <Badge variant="gray" className="text-[9px] py-0.5 border-[#C9A227]/30 bg-[#FFFDF9] text-[#C9A227] font-black">{inv.type}</Badge>
                        <span className="text-[#C9A227] font-black tracking-wider uppercase text-[10px]">Details →</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#FFFDF9] border border-[#C9A227]/15 rounded-[24px] shadow-sm">
              <p className="text-xs text-slate-400 font-semibold">No allocators matched your filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const paginationContent = !searchResults && nextCursor && (
    <button
      onClick={handleLoadMore}
      disabled={isLoadingMore}
      className="bg-[#FFFDF9] border border-[#C9A227]/30 text-slate-700 font-bold px-5 py-2.5 rounded-full hover:border-[#C9A227] hover:text-[#C9A227] transition-all text-xs shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-50"
    >
      {isLoadingMore ? 'Loading More...' : 'Load More Investors'}
    </button>
  );

  return (
    <WorkspaceLayout
      sidebar={sidebarContent}
      headerTitle="Investors Workspace"
      headerSubtitle="Inspect venture capital, angels, and corporate funds backing modern artificial intelligence projects."
      headerActions={headerActionsContent}
      searchSection={searchSectionContent}
      content={contentBody}
      pagination={paginationContent || undefined}
    />
  );
}
