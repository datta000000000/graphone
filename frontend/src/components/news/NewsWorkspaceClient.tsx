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
const getNewsIcon = (name: string) => {
  switch (name) {
    case 'AI Research':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'Funding News':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'Product Launches':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      );
    case 'Open Source':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      );
    case 'Government & Policy':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'Events':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 3V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

interface NewsArticle {
  id: string;
  title: string;
  url: string;
  summary: string;
  source: string;
  published_at: string;
  tag: string;
  is_featured: boolean;
}

interface NewsWorkspaceClientProps {
  initialNews: NewsArticle[];
  initialTotal: number;
  initialCursor: string | null;
  trendingNews: NewsArticle[];
}

export function NewsWorkspaceClient({
  initialNews,
  initialTotal,
  initialCursor,
  trendingNews,
}: NewsWorkspaceClientProps) {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ companies: any[]; investors: any[]; news: NewsArticle[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const initialFeatured = initialNews.find(a => a.is_featured) || trendingNews[0] || initialNews[0] || null;

  // Filter & sort state
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(initialFeatured);
  const [listArticles, setListArticles] = useState<NewsArticle[]>(initialNews);
  const [total, setTotal] = useState(initialTotal);
  const [nextCursor, setNextCursor] = useState<string | null>(initialCursor);
  const [category, setCategory] = useState<string>(''); // Tag filter
  const [sort, setSort] = useState<'latest' | 'trending'>('latest');
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const categories = [
    { name: 'All News', value: '' },
    { name: 'AI Research', value: 'AI Research' },
    { name: 'Funding News', value: 'Funding News' },
    { name: 'Product Launches', value: 'Product Launches' },
    { name: 'Open Source', value: 'Open Source' },
    { name: 'Government & Policy', value: 'Government & Policy' },
    { name: 'Events', value: 'Events' },
  ];

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  // Perform search
  const performSearch = async (query: string) => {
    const trimmed = query.trim();
    if (trimmed.length > 0) {
      setIsSearching(true);
      try {
        const data = await apiFetch<{ companies: any[]; investors: any[]; news: NewsArticle[] }>(
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
    if (category === '' && sort === 'latest' && listArticles === initialNews) return;

    async function fetchFiltered() {
      setIsLoadingList(true);
      try {
        let url = `${BASE_URL}/news?limit=9&sort=${sort}`;
        if (category) url += `&tag=${encodeURIComponent(category)}`;

        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          // Filtered updates
          setListArticles(json.data || []);
          setTotal(json.meta?.total || 0);
          setNextCursor(json.meta?.cursor || null);
          
          // Clear featured banner if category filter is active
          if (category) {
            setFeaturedArticle(null);
          } else {
            setFeaturedArticle(initialFeatured);
          }
        }
      } catch (err) {
        console.error('Failed to fetch filtered news:', err);
      } finally {
        setIsLoadingList(false);
      }
    }

    fetchFiltered();
  }, [category, sort]);

  // Load more trigger
  const handleLoadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);

    try {
      let url = `${BASE_URL}/news?limit=9&cursor=${nextCursor}&sort=${sort}`;
      if (category) url += `&tag=${encodeURIComponent(category)}`;

      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setListArticles((prev) => [...prev, ...json.data]);
        setNextCursor(json.meta?.cursor || null);
      }
    } catch (err) {
      console.error('Load more failed:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const getThumbnailGradient = (tag: string) => {
    switch (tag) {
      case 'AI Research': return 'from-[#C9A227]/10 to-[#C9A227]/5';
      case 'Funding News': return 'from-amber-100/50 to-amber-50/20';
      case 'Product Launches': return 'from-[#C9A227]/15 to-[#C9A227]/5';
      case 'Open Source': return 'from-stone-200/50 to-stone-100/20';
      case 'Government & Policy': return 'from-yellow-100/60 to-yellow-50/20';
      default: return 'from-[#C9A227]/10 to-transparent';
    }
  };

  // Render variables for WorkspaceLayout
  const sidebarContent = (
    <div className="space-y-6">
      <div>
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          News Categories
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
                <span className="shrink-0">{getNewsIcon(cat.name)}</span>
                <span className="truncate">{cat.name}</span>
              </span>
            </button>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-200/60 pt-4 text-[9px] text-slate-405 font-semibold leading-relaxed">
        Select a coverage class to filter market logs in real-time.
      </div>
    </div>
  );

  const headerActionsContent = (
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value as any)}
      className="bg-[#FFFDF9] border border-[#C9A227]/20 rounded-lg text-xs font-semibold px-3 py-2 text-slate-600 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/10 shadow-sm outline-none"
    >
      <option value="latest">Sort: Latest</option>
      <option value="trending">Sort: Trending</option>
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
        placeholder="Type headlines, source name, or topic keywords..."
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

      {/* Featured banner layout */}
      {!searchResults && featuredArticle && (
        <div className="space-y-4">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/60 pb-2 flex items-center gap-1.5">
            <span>📰</span> Featured Coverage
          </h2>
          <a href={featuredArticle.url} target="_blank" rel="noopener noreferrer" className="block group">
            <Card className="overflow-hidden border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-luxury-hover hover:-translate-y-0.5 transition-all duration-300 rounded-[24px] p-0 flex flex-col lg:flex-row h-full">
              {/* Abstract Gradient block as Thumbnail */}
              <div className={`w-full lg:w-[40%] h-56 lg:h-auto min-h-[200px] bg-gradient-to-br ${getThumbnailGradient(featuredArticle.tag)} relative flex items-center justify-center p-6 shrink-0 border-r border-[#C9A227]/10`}>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A22706_1px,transparent_1px),linear-gradient(to_bottom,#C9A22706_1px,transparent_1px)] bg-[size:12px_12px] opacity-40" />
                <span className="text-5xl drop-shadow-md select-none">✨</span>
                <span className="absolute top-4 left-4 bg-[#FFFDF9]/90 backdrop-blur-sm border border-[#C9A227]/30 text-[9px] font-black text-slate-900 uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  {featuredArticle.tag}
                </span>
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-450">
                    <span>{featuredArticle.source}</span>
                    <span>•</span>
                    <span>{new Date(featuredArticle.published_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-[#C9A227] transition-colors tracking-tight leading-snug">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                    {featuredArticle.summary}
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-xs font-bold text-[#C9A227] hover:underline inline-flex items-center gap-1">
                    Read Full Coverage <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </Card>
          </a>
        </div>
      )}

      {/* Grid listing */}
      {!searchResults && (
        <div className="space-y-4">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/60 pb-2">
            Ecosystem News Logs ({total})
          </h2>

          {isLoadingList ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, idx) => (
                <Skeleton key={idx} className="h-56 rounded-[20px]" />
              ))}
            </div>
          ) : listArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {listArticles.map((art) => (
                <a href={art.url} target="_blank" rel="noopener noreferrer" className="block group h-full" key={art.id}>
                  <Card className="overflow-hidden border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 rounded-[20px] p-0 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Gradient Thumbnail */}
                      <div className={`h-36 w-full bg-gradient-to-br ${getThumbnailGradient(art.tag)} relative flex items-center justify-center`}>
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A22706_1px,transparent_1px),linear-gradient(to_bottom,#C9A22706_1px,transparent_1px)] bg-[size:10px_10px] opacity-30" />
                        <span className="text-3xl drop-shadow select-none">✨</span>
                        <span className="absolute top-3 left-3 bg-[#FFFDF9]/95 text-[8px] font-black text-slate-900 uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm border border-[#C9A227]/30">
                          {art.tag}
                        </span>
                      </div>

                      {/* Info Area */}
                      <div className="px-5 space-y-2">
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-405">
                          <span>{art.source}</span>
                          <span>•</span>
                          <span>{new Date(art.published_at).toLocaleDateString()}</span>
                        </div>
                        <h3 className="font-extrabold text-slate-900 group-hover:text-[#C9A227] transition-colors text-xs line-clamp-2 leading-snug">
                          {art.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-3 leading-relaxed">
                          {art.summary}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-4 mt-4 border-t border-slate-200/40 flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-400">Published Date</span>
                      <span className="text-[#C9A227] group-hover:underline">Read More →</span>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#FFFDF9] border border-[#C9A227]/15 rounded-[20px] shadow-sm">
              <p className="text-xs text-slate-400 font-semibold">No articles matched your filters.</p>
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
      {isLoadingMore ? 'Loading More...' : 'Load More News'}
    </button>
  );

  return (
    <WorkspaceLayout
      sidebar={sidebarContent}
      headerTitle="AI News Logs"
      headerSubtitle="Inspect tech launches, M&A investment logs, open-source model updates, and policies."
      headerActions={headerActionsContent}
      searchSection={searchSectionContent}
      content={contentBody}
      pagination={paginationContent || undefined}
    />
  );
}
