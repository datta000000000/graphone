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
const getProductIcon = (name: string) => {
  switch (name) {
    case 'AI Chat':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case 'AI Coding':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    case 'AI Image':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      );
    case 'Productivity':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case 'Developer Tools':
      return (
        <svg className="h-4.5 w-4.5 text-[#C9A227] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  companyName: string;
  companySlug: string;
  websiteUrl: string;
  logoUrl: string;
  popularityScore: number;
  featured: boolean;
}

const mapApiProductToProduct = (item: any): Product => {
  if (item.companySlug && item.companyName && item.websiteUrl) {
    return item;
  }
  const companyName = item.companies?.name || item.companyName || 'Unknown Company';
  const companySlug = item.companies?.slug || item.companySlug || companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    category: item.category,
    shortDescription: item.description || item.shortDescription || '',
    companyName: companyName,
    companySlug: companySlug,
    websiteUrl: item.website_url || item.websiteUrl || '',
    logoUrl: item.logo_url || item.logoUrl || item.companies?.logo_url || '',
    popularityScore: item.upvotes || item.popularityScore || 0,
    featured: (item.upvotes || item.popularityScore) > 20000
  };
};

interface ProductsWorkspaceClientProps {
  initialProducts: Product[];
  initialTotal?: number;
  initialCursor?: string | null;
  featuredProducts?: Product[];
}

export function ProductsWorkspaceClient({
  initialProducts,
  initialTotal = initialProducts.length,
  initialCursor = null,
  featuredProducts = (initialProducts || []).map(mapApiProductToProduct).filter(p => p.featured),
}: ProductsWorkspaceClientProps) {
  const mappedInitial = (initialProducts || []).map(mapApiProductToProduct);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ companies: any[]; investors: any[]; products: Product[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Filter & sort state
  const [products, setProducts] = useState<Product[]>(mappedInitial);
  const [total, setTotal] = useState(initialTotal);
  const [nextCursor, setNextCursor] = useState<string | null>(initialCursor);
  const [category, setCategory] = useState<string>(''); // Class filter
  const [sort, setSort] = useState<'popular' | 'newest'>('popular');
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const categories = [
    { name: 'All Products', value: '' },
    { name: 'AI Chat', value: 'AI Chat' },
    { name: 'AI Coding', value: 'AI Coding' },
    { name: 'AI Image', value: 'AI Image' },
    { name: 'AI Video', value: 'AI Video' },
    { name: 'AI Voice', value: 'AI Voice' },
    { name: 'Productivity', value: 'Productivity' },
    { name: 'Developer Tools', value: 'Developer Tools' },
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
        setSearchResults({
          companies: data.companies || [],
          investors: data.investors || [],
          products: (data.products || []).map(mapApiProductToProduct)
        });
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
    if (category === '' && sort === 'popular' && products === mappedInitial) return;

    async function fetchFiltered() {
      setIsLoadingList(true);
      try {
        let url = `${BASE_URL}/products?limit=12&sort=${sort}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;

        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          setProducts((json.data || []).map(mapApiProductToProduct));
          setTotal(json.meta?.total || 0);
          setNextCursor(json.meta?.cursor || null);
        }
      } catch (err) {
        console.error('Failed to fetch filtered products:', err);
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
      let url = `${BASE_URL}/products?limit=12&cursor=${nextCursor}&sort=${sort}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;

      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setProducts((prev) => [...prev, ...(json.data || []).map(mapApiProductToProduct)]);
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
          Product Classes
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
                <span className="shrink-0">{getProductIcon(cat.name)}</span>
                <span className="truncate">{cat.name}</span>
              </span>
            </button>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-200/60 pt-4 text-[9px] text-slate-405 font-semibold leading-relaxed">
        Select a product class to filter ecosystem deployments in real-time.
      </div>
    </div>
  );

  const headerActionsContent = (
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value as any)}
      className="bg-[#FFFDF9] border border-[#C9A227]/20 rounded-lg text-xs font-semibold px-3 py-2 text-slate-600 focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/10 shadow-sm outline-none"
    >
      <option value="popular">Sort: Popular</option>
      <option value="newest">Sort: Newest</option>
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
        placeholder="Type product name, release info, or keywords..."
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
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Products ({searchResults.products.length})</h3>
                {searchResults.products.length > 0 ? (
                  <div className="space-y-2.5">
                    {searchResults.products.map((p) => (
                      <div key={p.id} className="block group">
                        <div className="flex items-center gap-3 p-3 border border-[#C9A227]/10 rounded-2xl hover:bg-slate-50 transition-colors bg-[#FFFDF9] shadow-sm">
                          <Link href={`/companies/${p.companySlug}`} className="hover:opacity-85 transition-opacity">
                            <LogoAvatar logoUrl={p.logoUrl} name={p.companyName} />
                          </Link>
                          <div className="flex-grow">
                            <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-900 group-hover:text-[#C9A227] transition-colors text-xs hover:underline">
                              {p.name}
                            </a>
                            <p className="text-[10px] text-slate-400 font-semibold mt-1">
                              {p.category} •{' '}
                              <Link href={`/companies/${p.companySlug}`} className="hover:text-[#C9A227] transition-colors hover:underline font-bold">
                                {p.companyName}
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-405">No products matched.</p>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Featured Products Banner */}
      {!searchResults && featuredProducts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/60 pb-2 flex items-center gap-1.5">
            <span>👑</span> Featured Deployments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((prod) => (
              <Card className="p-6 flex flex-col justify-between h-full border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 rounded-[24px] border-l-4 border-l-[#C9A227]" key={prod.id}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Link href={`/companies/${prod.companySlug}`} className="hover:opacity-85 transition-opacity">
                        <LogoAvatar logoUrl={prod.logoUrl} name={prod.companyName} />
                      </Link>
                      <div>
                        <h3 className="font-extrabold text-[#1F1F1F] text-xs line-clamp-1 leading-none">{prod.name}</h3>
                        <Link href={`/companies/${prod.companySlug}`} className="hover:text-[#C9A227] transition-colors">
                          <p className="text-[9px] text-[#6B6B6B] font-bold uppercase tracking-wider mt-1 hover:text-[#C9A227] transition-colors">{prod.companyName}</p>
                        </Link>
                      </div>
                    </div>
                    <Badge variant="indigo" className="text-[8px] py-0 border-[#C9A227]/30 bg-[#FFFDF9] text-[#C9A227]">Featured</Badge>
                  </div>
                  <p className="text-[11px] text-[#6B6B6B] font-semibold line-clamp-2 leading-relaxed">{prod.shortDescription}</p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#C9A227]/10 text-[10px] font-bold">
                  <span className="text-[#6B6B6B]">{prod.category}</span>
                  <a href={prod.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-[#C9A227] hover:underline">
                    Website →
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Directory listing */}
      {!searchResults && (
        <div className="space-y-4">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/60 pb-2">
            Product Directory ({total})
          </h2>

          {isLoadingList ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, idx) => (
                <Skeleton key={idx} className="h-48 rounded-[20px]" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((prod) => (
                <Card className="p-6 flex flex-col justify-between h-full border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 rounded-[24px]" key={prod.id}>
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-3">
                      <Link href={`/companies/${prod.companySlug}`} className="hover:opacity-85 transition-opacity">
                        <LogoAvatar logoUrl={prod.logoUrl} name={prod.companyName} />
                      </Link>
                      <div>
                        <h3 className="font-bold text-slate-900 text-xs line-clamp-1 leading-none">
                          {prod.name}
                        </h3>
                        <Link href={`/companies/${prod.companySlug}`} className="hover:text-[#C9A227] transition-colors">
                          <p className="text-[9px] text-slate-405 font-bold uppercase tracking-wider mt-1 hover:text-[#C9A227] transition-colors">{prod.companyName}</p>
                        </Link>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold line-clamp-2 leading-relaxed">
                      {prod.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#C9A227]/10 text-[10px] font-bold">
                    <Badge variant="gray" className="text-[9px] py-0 border-[#C9A227]/30 bg-[#FFFDF9] text-[#C9A227]">{prod.category}</Badge>
                    <a
                      href={prod.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#C9A227] hover:bg-[#A67C00] text-white px-4.5 py-1.5 rounded-full text-[10px] font-bold transition-all shadow-sm"
                    >
                      Website
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#FFFDF9] border border-[#C9A227]/15 rounded-[24px] shadow-sm">
              <p className="text-xs text-slate-400 font-semibold">No products matched your filters.</p>
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
      {isLoadingMore ? 'Loading More...' : 'Load More Products'}
    </button>
  );

  return (
    <WorkspaceLayout
      sidebar={sidebarContent}
      headerTitle="Products Workspace"
      headerSubtitle="Explore production AI tooling releases, coding automation, answer engines, and developer setups."
      headerActions={headerActionsContent}
      searchSection={searchSectionContent}
      content={contentBody}
      pagination={paginationContent || undefined}
    />
  );
}
