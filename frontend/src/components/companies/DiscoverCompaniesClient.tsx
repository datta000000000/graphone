'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Company } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import { formatCurrency, formatNumber } from '../../lib/utils';

interface DiscoverCompaniesClientProps {
  initialTrending: Company[];
  initialCompanies: Company[];
  initialTotal: number;
  initialCursor: string | null;
  stats: {
    companiesCount: number;
    investorsCount: number;
    fundingTotal: number;
    productsCount: number;
    unicornsCount: number;
  };
}

export function DiscoverCompaniesClient({
  initialTrending,
  initialCompanies,
  initialTotal,
  initialCursor,
  stats,
}: DiscoverCompaniesClientProps) {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ companies: Company[]; investors: any[]; products: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Filters & sorting state
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

  // Handle live search
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        try {
          const res = await fetch(`http://localhost:3001/api/v1/search?q=${encodeURIComponent(searchQuery.trim())}`);
          if (res.ok) {
            const json = await res.json();
            setSearchResults(json.data);
          }
        } catch (err) {
          console.error('Search failed:', err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults(null);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Handle active filter changes
  useEffect(() => {
    // Skip first load
    if (category === '' && stage === '' && sort === 'trending' && companies === initialCompanies) return;

    async function fetchFiltered() {
      setIsLoadingList(true);
      try {
        let url = `http://localhost:3001/api/v1/companies?limit=12&sort=${sort}`;
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

  // Load more pagination
  const handleLoadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);

    try {
      let url = `http://localhost:3001/api/v1/companies?limit=12&sort=${sort}&cursor=${nextCursor}`;
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* ── HERO & SEARCH SECTION ── */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <Badge variant="brand" className="uppercase px-3 py-1 font-semibold text-xs tracking-wider">
          AI Companies Intelligence
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
          Discover the world's most innovative <span className="text-brand">AI companies</span>
        </h1>
        <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
          Explore funding rounds, key stats, leadership teams, and ecosystem mapping across leading models and agent applications.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mt-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search companies, investors, or products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-28 py-3.5 border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 text-gray-900 placeholder-gray-400 rounded-full font-medium transition-all shadow-sm"
          />
          <div className="absolute right-2 top-2">
            <button className="bg-brand text-white px-5 py-1.5 rounded-full text-sm font-semibold hover:bg-brand-dark transition-all flex items-center gap-1.5 shadow-sm shadow-brand/15">
              Search
            </button>
          </div>
        </div>

        {/* Category Quick Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              category === ''
                ? 'bg-gray-900 border-gray-900 text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                category === cat
                  ? 'bg-gray-900 border-gray-900 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Stats Strip */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-gray-50 border border-gray-200/80 rounded-2xl p-6 shadow-sm">
        <div className="text-center p-2 border-r border-gray-200/60 last:border-none md:border-r">
          <p className="text-2xl font-black text-gray-900">{formatNumber(stats.companiesCount)}</p>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Companies</p>
        </div>
        <div className="text-center p-2 border-r border-gray-200/60 last:border-none md:border-r">
          <p className="text-2xl font-black text-gray-900">{formatCurrency(stats.fundingTotal)}</p>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Total Funding</p>
        </div>
        <div className="text-center p-2 border-r border-gray-200/60 last:border-none md:border-r">
          <p className="text-2xl font-black text-gray-900">{formatNumber(stats.investorsCount)}</p>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Investors</p>
        </div>
        <div className="text-center p-2 border-r border-gray-200/60 last:border-none md:border-r">
          <p className="text-2xl font-black text-gray-900">{formatNumber(stats.productsCount)}</p>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Products</p>
        </div>
        <div className="text-center p-2 last:border-none">
          <p className="text-2xl font-black text-brand">{stats.unicornsCount}</p>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Unicorns</p>
        </div>
      </section>

      {/* ── SEARCH LIVE RESULTS OVERLAY ── */}
      {searchResults && (
        <section className="bg-white border border-brand/20 rounded-2xl p-6 shadow-md space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-lg font-bold text-gray-900">
              Search Results for <span className="text-brand">"{searchQuery}"</span>
            </h2>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-gray-500 hover:text-gray-900"
            >
              Clear Results
            </button>
          </div>

          {isSearching ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Companies results */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Companies ({searchResults.companies.length})</h3>
                {searchResults.companies.length > 0 ? (
                  <div className="space-y-3">
                    {searchResults.companies.map((c) => (
                      <Link href={`/companies/${c.slug}`} key={c.id} className="block group">
                        <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                          <img src={c.logo_url} alt={c.name} className="h-10 w-10 rounded-lg object-contain bg-white border" />
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-brand transition-colors text-sm">{c.name}</p>
                            <p className="text-xs text-gray-500">{c.category} • {c.hq_city}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No companies found.</p>
                )}
              </div>

              {/* Investors results */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Investors ({searchResults.investors.length})</h3>
                {searchResults.investors.length > 0 ? (
                  <div className="space-y-3">
                    {searchResults.investors.map((i) => (
                      <Link href={`/investors/${i.slug}`} key={i.id} className="block group">
                        <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                          <img src={i.logo_url} alt={i.name} className="h-10 w-10 rounded-lg object-contain bg-white border" />
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-brand transition-colors text-sm">{i.name}</p>
                            <p className="text-xs text-gray-500">{i.type} • {i.location}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No investors found.</p>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── TRENDING COMPANIES ── */}
      {!searchResults && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-brand">🔥</span> Trending AI Startups
            </h2>
            <span className="text-xs text-gray-400 font-medium">Recomputed dynamically</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {initialTrending.slice(0, 3).map((company, index) => (
              <Link href={`/companies/${company.slug}`} key={company.id} className="block group">
                <Card hoverEffect className="p-5 flex flex-col justify-between h-full border-l-4 border-l-brand relative">
                  <div className="absolute top-4 right-4 text-3xl font-black text-gray-100 select-none group-hover:text-brand/10 transition-colors">
                    #0{index + 1}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={company.logo_url}
                        alt={company.name}
                        className="h-12 w-12 rounded-xl object-contain bg-white border border-gray-100 p-1"
                      />
                      <div>
                        <h3 className="font-extrabold text-gray-900 group-hover:text-brand transition-colors">
                          {company.name}
                        </h3>
                        <p className="text-xs text-gray-500">{company.hq_city}, {company.hq_country}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium line-clamp-2">
                      {company.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 text-xs">
                    <Badge variant="indigo">{company.category}</Badge>
                    <span className="text-gray-500 font-semibold">{formatNumber(company.view_count)} views</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── MAIN COMPANIES EXPLORER DIRECTORY ── */}
      {!searchResults && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/60 pb-3">
            <h2 className="text-xl font-bold text-gray-900">
              Explore All Startups ({total})
            </h2>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Stage Filter */}
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg text-xs font-semibold px-3 py-2 text-gray-700 focus:border-brand focus:ring-1 focus:ring-brand/10"
              >
                <option value="">All Stages</option>
                {stages.map((stg) => (
                  <option key={stg} value={stg}>{stg}</option>
                ))}
              </select>

              {/* Sort Order */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="bg-white border border-gray-200 rounded-lg text-xs font-semibold px-3 py-2 text-gray-700 focus:border-brand focus:ring-1 focus:ring-brand/10"
              >
                <option value="trending">Sort: Trending</option>
                <option value="funded">Sort: Most Funded</option>
                <option value="new">Sort: Newly Added</option>
              </select>
            </div>
          </div>

          {/* Grid list of companies */}
          {isLoadingList ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, idx) => (
                <Skeleton key={idx} className="h-44 rounded-xl" />
              ))}
            </div>
          ) : companies.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {companies.map((company) => (
                  <Link href={`/companies/${company.slug}`} key={company.id} className="block group">
                    <Card hoverEffect className="p-4 flex flex-col justify-between h-full">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={company.logo_url}
                            alt={company.name}
                            className="h-10 w-10 rounded-lg object-contain bg-white border border-gray-100 p-1"
                          />
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-brand transition-colors text-sm line-clamp-1">
                              {company.name}
                            </h3>
                            <p className="text-[11px] text-gray-500 font-medium">{company.stage} • {company.hq_city}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 font-medium line-clamp-2">
                          {company.description}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 mt-4 pt-3 border-t border-gray-100 text-[11px]">
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-500">Funding:</span>
                          <span className="text-gray-900">{formatCurrency(company.funding_total)}</span>
                        </div>
                        {company.valuation && (
                          <div className="flex justify-between font-semibold">
                            <span className="text-gray-500">Valuation:</span>
                            <span className="text-gray-900">{formatCurrency(company.valuation)}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="gray" className="text-[10px]">{company.category}</Badge>
                          <span className="text-brand font-bold">Growth: {company.growth_score}%</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Load More Trigger */}
              {nextCursor && (
                <div className="text-center pt-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="bg-white border border-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-full hover:border-brand hover:text-brand transition-all text-xs shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingMore ? 'Loading More...' : 'Load More Startups'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
              <p className="text-gray-500 font-medium">No startups matched your filter conditions.</p>
            </div>
          )}
        </section>
      )}

    </div>
  );
}
