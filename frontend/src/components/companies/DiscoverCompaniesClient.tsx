'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import { formatCurrency, formatNumber, timeAgo } from '../../lib/utils';
import { apiFetch } from '../../lib/api';
import { LogoAvatar } from '../ui/LogoAvatar';
import { Company } from '../../types';

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
  featuredInvestors?: any[];
  latestNews?: any[];
  latestFunding?: any[];
}

export function DiscoverCompaniesClient({
  initialTrending,
  initialCompanies,
  initialTotal,
  initialCursor,
  stats,
  featuredInvestors = [],
  latestNews = [],
  latestFunding = [],
}: DiscoverCompaniesClientProps) {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ companies: Company[]; investors: any[]; products: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  // Perform search query
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

  const handleChipClick = (term: string) => {
    setSearchQuery(term);
    performSearch(term);
  };

  const getThumbnailGradient = (tag: string) => {
    switch (tag) {
      case 'AI Research': return 'from-[#C9A227]/20 to-[#C9A227]/5';
      case 'Funding News': return 'from-amber-100/60 to-amber-50/20';
      case 'Product Launches': return 'from-[#C9A227]/25 to-[#C9A227]/5';
      case 'Open Source': return 'from-stone-200/60 to-stone-100/20';
      case 'Government & Policy': return 'from-yellow-100/70 to-yellow-50/20';
      default: return 'from-[#C9A227]/15 to-transparent';
    }
  };

  return (
    <div className="space-y-44 pb-36">
      
      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.005); }
        }
        @keyframes reveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-reveal {
          animation: reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .text-luxury-gradient {
          background: linear-gradient(135deg, #1F1F1F 30%, #C9A227 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .gold-glow-focus:focus-within {
          border-color: #C9A227;
          box-shadow: 0 0 20px rgba(201, 162, 39, 0.25);
        }
      `}</style>

      {/* SEARCH RESULTS VIEW OVERLAY */}
      {searchResults && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12 animate-reveal">
          <div className="flex items-center justify-between border-b border-[#C9A227]/20 pb-4">
            <h2 className="text-sm font-black text-[#1F1F1F] uppercase tracking-widest">
              Search Results for <span className="text-[#C9A227]">"{searchQuery}"</span>
            </h2>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSearchResults(null);
              }}
              className="text-xs font-black text-[#C9A227] hover:text-[#A67C00] transition-colors"
            >
              Clear Results
            </button>
          </div>

          {isSearching ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Companies Search Results */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-[#C9A227] uppercase tracking-widest border-b border-[#C9A227]/10 pb-2">Companies ({searchResults.companies.length})</h3>
                {searchResults.companies.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.companies.map((c) => (
                      <Link href={`/companies/${c.slug}`} key={c.id} className="block group">
                        <Card className="p-5 border border-[#C9A227]/10 hover:border-[#C9A227]/30 rounded-2xl hover:shadow-luxury hover:-translate-y-0.5 transition-all duration-300 bg-[#FFFDF9]">
                          <div className="flex items-center gap-3">
                            <LogoAvatar logoUrl={c.logo_url} name={c.name} size="h-12 w-12" />
                            <div>
                              <p className="font-black text-[#1F1F1F] group-hover:text-[#C9A227] transition-colors text-xs leading-none">{c.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">{c.category} • {c.hq_city}</p>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-medium">No matching companies.</p>
                )}
              </div>

              {/* Investors Search Results */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-[#C9A227] uppercase tracking-widest border-b border-[#C9A227]/10 pb-2">Investors ({searchResults.investors.length})</h3>
                {searchResults.investors.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.investors.map((i) => (
                      <Link href={`/investors/${i.slug}`} key={i.id} className="block group">
                        <Card className="p-5 border border-[#C9A227]/10 hover:border-[#C9A227]/30 rounded-2xl hover:shadow-luxury hover:-translate-y-0.5 transition-all duration-300 bg-[#FFFDF9]">
                          <div className="flex items-center gap-3">
                            <LogoAvatar logoUrl={i.logo_url} name={i.name} size="h-12 w-12" />
                            <div>
                              <p className="font-black text-[#1F1F1F] group-hover:text-[#C9A227] transition-colors text-xs leading-none">{i.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">{i.type} • {i.location}</p>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-medium">No matching investors.</p>
                )}
              </div>

              {/* Products Search Results */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-[#C9A227] uppercase tracking-widest border-b border-[#C9A227]/10 pb-2">Products ({searchResults.products.length})</h3>
                {searchResults.products.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.products.map((p) => (
                      <a href={p.website_url} target="_blank" rel="noopener noreferrer" key={p.id} className="block group">
                        <Card className="p-5 border border-[#C9A227]/10 hover:border-[#C9A227]/30 rounded-2xl hover:shadow-luxury hover:-translate-y-0.5 transition-all duration-300 bg-[#FFFDF9]">
                          <div className="flex items-center gap-3">
                            <LogoAvatar logoUrl={p.logo_url} name={p.name} size="h-12 w-12" />
                            <div>
                              <p className="font-black text-[#1F1F1F] group-hover:text-[#C9A227] transition-colors text-xs leading-none">{p.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">{p.category} • 👍 {formatNumber(p.upvotes)}</p>
                            </div>
                          </div>
                        </Card>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-medium">No matching products.</p>
                )}
              </div>

            </div>
          )}
        </div>
      )}

      {/* STORYTELLING PAGE CONTENT */}
      {!searchResults && (
        <>
          {/* 1. PREMIUM HERO SECTION */}
          <section className="relative overflow-hidden pt-24 sm:pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-10 text-left">
                <div className="flex animate-reveal">
                  <span className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#FFFDF9] border-2 border-[#C9A227]/40 text-[#C9A227] shadow-luxury">
                    <span className="h-2 w-2 rounded-full bg-[#C9A227] animate-pulse" />
                    AI Intelligence Platform
                  </span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#1F1F1F] tracking-tight leading-[0.95] animate-reveal">
                  Deciphering <br className="hidden sm:inline" />
                  the <span className="text-luxury-gradient">AI Economy</span>
                </h1>
                
                <p className="text-sm sm:text-base text-[#6B6B6B] font-semibold leading-relaxed max-w-2xl animate-reveal">
                  GraphOne maps the entire global artificial intelligence landscape in premium detail. Analyze private market valuations, monitor capital aggregation, identify leading models, and inspect dynamic connection networks between developers, founders, and venture backers.
                </p>

                {/* Redesigned Search Bar Container */}
                <div className="space-y-6 pt-3 max-w-3xl animate-reveal">
                  <div className="relative w-full gold-glow-focus rounded-full border-2 border-[#C9A227]/40 bg-[#FFFDF9] transition-all p-2.5 flex items-center shadow-[0_16px_48px_rgba(201,162,39,0.08)] hover:shadow-[0_24px_64px_rgba(201,162,39,0.16)] duration-300">
                    
                    {/* Search Icon */}
                    <div className="pl-4 flex items-center pointer-events-none text-[#C9A227] shrink-0">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    
                    {/* Input Field */}
                    <input
                      type="text"
                      placeholder="Search AI companies, investors, products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') performSearch(searchQuery);
                      }}
                      className="block w-full pl-4 pr-6 py-4 bg-transparent text-[#1F1F1F] placeholder-[#6B6B6B]/60 focus:outline-none text-xs font-semibold"
                    />
                    
                    {/* Explore button */}
                    <button
                      onClick={() => performSearch(searchQuery)}
                      className="bg-[#C9A227] hover:bg-[#A67C00] text-white px-10 py-4 rounded-full text-xs font-black transition-all shrink-0 active:scale-[0.98] shadow-md shadow-[#C9A227]/20 tracking-wider uppercase"
                    >
                      Explore
                    </button>
                  </div>

                  {/* Popular search chips */}
                  <div className="flex flex-wrap items-center gap-3 pl-3">
                    <span className="text-[10px] font-black text-[#6B6B6B] uppercase tracking-wider mr-1">Trending:</span>
                    {['OpenAI', 'Anthropic', 'Cursor', 'Perplexity', 'ElevenLabs'].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleChipClick(chip)}
                        className="px-4.5 py-2 rounded-full text-[10px] font-extrabold border border-[#C9A227]/30 text-[#6B6B6B] bg-[#FFFDF9] hover:bg-[#C9A227]/5 hover:text-[#C9A227] hover:border-[#C9A227] hover:-translate-y-0.5 transition-all shadow-sm duration-300"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (Animated Illustration) */}
              <div className="lg:col-span-5 w-full flex items-center justify-center pt-8 lg:pt-0">
                <div className="relative w-full h-[420px] sm:h-[480px] flex items-center justify-center bg-gradient-to-tr from-[#C9A227]/5 via-[#C9A227]/1 to-transparent rounded-[40px] border border-[#C9A227]/20 bg-[#FFFDF9] shadow-luxury overflow-hidden animate-float">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A22706_1px,transparent_1px),linear-gradient(to_bottom,#C9A22706_1px,transparent_1px)] bg-[size:20px_30px] opacity-35 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                  
                  <svg className="absolute w-full h-full p-8" viewBox="0 0 400 400" fill="none">
                    <circle cx="200" cy="200" r="140" stroke="#C9A227" strokeWidth="1" strokeOpacity="0.12" strokeDasharray="4 4" />
                    <circle cx="200" cy="200" r="90" stroke="#C9A227" strokeWidth="1.5" strokeOpacity="0.2" />
                    <line x1="200" y1="200" x2="80" y2="120" stroke="#C9A227" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="3 3" />
                    <line x1="200" y1="200" x2="320" y2="150" stroke="#C9A227" strokeWidth="1.5" strokeOpacity="0.3" />
                    <line x1="200" y1="200" x2="150" y2="290" stroke="#C9A227" strokeWidth="1.8" strokeOpacity="0.35" />
                    <line x1="200" y1="200" x2="270" y2="300" stroke="#C9A227" strokeWidth="1.5" strokeOpacity="0.25" strokeDasharray="2 2" />
                    
                    <g className="animate-pulse">
                      <circle cx="200" cy="200" r="32" fill="#FFFDF9" stroke="#C9A227" strokeWidth="1" strokeOpacity="0.35" />
                      <circle cx="200" cy="200" r="16" fill="#C9A227" stroke="#FFFDF9" strokeWidth="2.5" />
                      <circle cx="200" cy="200" r="4" fill="#FFFDF9" />
                    </g>
                    <g className="animate-bounce" style={{ animationDuration: '4s' }}>
                      <circle cx="80" cy="120" r="14" fill="#FFFDF9" stroke="#C9A227" strokeWidth="1.5" />
                      <circle cx="80" cy="120" r="5" fill="#C9A227" />
                    </g>
                    <g className="animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
                      <circle cx="320" cy="150" r="16" fill="#FFFDF9" stroke="#C9A227" strokeWidth="1.5" />
                      <circle cx="320" cy="150" r="6" fill="#1F1F1F" />
                    </g>
                    <g className="animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}>
                      <circle cx="150" cy="290" r="18" fill="#FFFDF9" stroke="#C9A227" strokeWidth="1.5" />
                      <circle cx="150" cy="290" r="7" fill="#C9A227" />
                    </g>
                    <g className="animate-bounce" style={{ animationDuration: '6s', animationDelay: '2s' }}>
                      <circle cx="270" cy="300" r="12" fill="#FFFDF9" stroke="#C9A227" strokeWidth="1.5" />
                      <circle cx="270" cy="300" r="4" fill="#1F1F1F" />
                    </g>
                  </svg>

                  <div className="absolute top-12 left-8 bg-[#FFFDF9] border border-[#C9A227]/30 text-[9px] font-black text-[#1F1F1F] px-4 py-2 rounded-full shadow-luxury">
                    ✨ GPT Architecture
                  </div>
                  <div className="absolute top-28 right-8 bg-[#FFFDF9] border border-[#C9A227]/30 text-[9px] font-black text-[#1F1F1F] px-4 py-2 rounded-full shadow-luxury">
                    💼 Venture Node
                  </div>
                  <div className="absolute bottom-16 left-12 bg-[#FFFDF9] border border-[#C9A227]/30 text-[9px] font-black text-[#1F1F1F] px-4 py-2 rounded-full shadow-luxury">
                    🔍 Answer Engine
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. TRUSTED AI COMPANIES STRIP */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border border-[#C9A227]/15 py-12 bg-[#FFFDF9] backdrop-blur-sm rounded-[40px] shadow-luxury">
            <div className="text-center space-y-2 mb-10">
              <p className="text-[10px] font-black text-[#C9A227] uppercase tracking-widest">Ecosystem Coverage</p>
              <h3 className="text-xs font-black text-slate-800 tracking-wider">Trusted Data Coverage Across Global Tech Brands</h3>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
              {['openai', 'anthropic', 'cursor', 'perplexity', 'mistral', 'xai', 'databricks', 'scale'].map((c) => (
                <LogoAvatar key={c} name={c} size="h-11 w-11" />
              ))}
            </div>
          </section>

          {/* 3. EXPLORE GRAPHONE NAVIGATION CARDS */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center space-y-3">
              <span className="text-[10px] font-black text-[#C9A227] uppercase tracking-widest bg-[#FFFDF9] border border-[#C9A227]/30 px-4 py-2 rounded-full shadow-sm">
                Explore Directory
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1F1F1F] tracking-tight">
                GraphOne Workspaces
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6B6B] font-semibold max-w-lg mx-auto">
                Navigate custom telemetry portals mapping categories, products, jobs, and capital.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Companies Workspace', desc: 'Directory of global AI startups, foundation model players, and agent platforms.', link: '/companies', icon: '🏢' },
                { title: 'Investors Workspace', desc: 'Trace capital allocation networks, venture funds, and dynamic check sizes.', link: '/investors', icon: '💼' },
                { title: 'Products Workspace', desc: 'Compare AI chatbots, developer tools, voice synthesizers, and video builders.', link: '/products', icon: '⚡' },
                { title: 'Funding Workspace', desc: 'Track seed, growth, pre-IPO deals, and lead investors in real-time.', link: '/funding', icon: '💵' },
                { title: 'Jobs Workspace', desc: 'Explore career openings for AI engineers, ML researchers, and builders.', link: '/jobs', icon: '🧠' },
                { title: 'News Workspace', desc: 'Monitor M&A activity, model breakthroughs, launches, and policy shifts.', link: '/news', icon: '📰' }
              ].map((card) => (
                <Link href={card.link} key={card.title} className="block group">
                  <Card className="p-8 space-y-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-[0_24px_56px_rgba(201,162,39,0.12)] hover:border-[#C9A227]/40 hover:-translate-y-2 transition-all duration-300 rounded-[32px]">
                    <div className="text-3xl">{card.icon}</div>
                    <h3 className="font-black text-[#1F1F1F] text-sm tracking-wide group-hover:text-[#C9A227] transition-colors">{card.title}</h3>
                    <p className="text-xs text-[#6B6B6B] font-semibold leading-relaxed">{card.desc}</p>
                    <div className="pt-2 flex items-center justify-between text-[11px] font-black text-[#C9A227]">
                      <span>Open Workspace</span>
                      <span className="transform group-hover:translate-x-1.5 transition-transform">→</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* 4. TRENDING AI COMPANIES */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C9A227]/25 pb-4">
              <div>
                <span className="text-[10px] font-black text-[#C9A227] uppercase tracking-widest">Market Interest</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1F1F1F] tracking-tight mt-1">Trending Startups</h2>
              </div>
              <Link href="/companies" className="text-xs font-black text-[#C9A227] hover:underline flex items-center gap-1">
                View All Companies <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {initialTrending.slice(0, 3).map((company) => (
                <Link href={`/companies/${company.slug}`} key={company.id} className="block group">
                  <Card className="p-8 flex flex-col justify-between h-full border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-[0_24px_56px_rgba(201,162,39,0.12)] hover:border-[#C9A227]/40 hover:-translate-y-2 transition-all duration-300 rounded-[32px]">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <LogoAvatar logoUrl={company.logo_url} name={company.name} size="h-12 w-12" />
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

                    <div className="flex flex-col gap-2.5 mt-8 pt-5 border-t border-[#C9A227]/10 text-xs font-bold">
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
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#C9A227]/5">
                        <Badge className="text-[9px] py-0.5 border-none bg-[#C9A227]/10 text-[#C9A227] font-black">{company.category}</Badge>
                        <span className="text-[#C9A227] font-black tracking-wider uppercase text-[10px]">Growth: {company.growth_score}%</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* 5. FEATURED INVESTORS */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C9A227]/25 pb-4">
              <div>
                <span className="text-[10px] font-black text-[#C9A227] uppercase tracking-widest">Capital Allocators</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1F1F1F] tracking-tight mt-1">Featured Investors</h2>
              </div>
              <Link href="/investors" className="text-xs font-black text-[#C9A227] hover:underline flex items-center gap-1">
                View All Allocators <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {featuredInvestors.slice(0, 4).map((inv) => (
                <Link href={`/investors/${inv.slug}`} key={inv.id} className="block group">
                  <Card className="p-7 flex flex-col justify-between h-full border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-[0_24px_56px_rgba(201,162,39,0.12)] hover:border-[#C9A227]/40 hover:-translate-y-2 transition-all duration-300 rounded-[32px]">
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
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#C9A227]/5">
                        <Badge className="text-[9px] py-0.5 border-none bg-slate-100 text-slate-800 font-black">{inv.type}</Badge>
                        <span className="text-[#C9A227] font-black tracking-wider uppercase text-[10px]">Details →</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* 6. LATEST FUNDING */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C9A227]/25 pb-4">
              <div>
                <span className="text-[10px] font-black text-[#C9A227] uppercase tracking-widest">Market Aggregation</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1F1F1F] tracking-tight mt-1">Latest Capital Funding</h2>
              </div>
              <Link href="/funding" className="text-xs font-black text-[#C9A227] hover:underline flex items-center gap-1">
                View All Deals <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestFunding.slice(0, 3).map((company) => {
                const round = company.funding_rounds?.[0] || {};
                return (
                  <Card key={company.id} className="p-8 flex flex-col justify-between h-full border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-[0_24px_56px_rgba(201,162,39,0.12)] hover:border-[#C9A227]/40 hover:-translate-y-2 transition-all duration-300 rounded-[32px]">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3.5">
                        <LogoAvatar logoUrl={company.logo_url} name={company.name} size="h-11 w-11" />
                        <div>
                          <h3 className="font-black text-slate-900 text-sm line-clamp-1 leading-tight">
                            {company.name}
                          </h3>
                          <p className="text-[10px] text-[#6B6B6B] font-bold mt-1.5">{company.stage} • {company.category}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2.5 mt-5 pt-4 border-t border-[#C9A227]/10 text-xs font-bold">
                        <div className="flex justify-between">
                          <span className="text-[#6B6B6B] font-semibold">Latest Round</span>
                          <span className="text-slate-900 font-black">{round.round_type || 'Seed'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B6B6B] font-semibold">Amount Raised</span>
                          <span className="text-[#C9A227] font-black">{round.amount ? formatCurrency(round.amount) : 'Undisclosed'}</span>
                        </div>
                        {round.lead_investor_name && (
                          <div className="flex justify-between">
                            <span className="text-[#6B6B6B] font-semibold">Lead Investor</span>
                            <span className="text-slate-900 font-extrabold line-clamp-1">{round.lead_investor_name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold">{round.date ? new Date(round.date).toLocaleDateString() : 'Recent'}</span>
                      <Link href={`/companies/${company.slug}`} className="text-xs font-black text-[#C9A227] hover:underline">
                        View Company →
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* 7. LATEST AI NEWS */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C9A227]/25 pb-4">
              <div>
                <span className="text-[10px] font-black text-[#C9A227] uppercase tracking-widest">Media Coverage</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1F1F1F] tracking-tight mt-1">Ecosystem Intelligence</h2>
              </div>
              <Link href="/news" className="text-xs font-black text-[#C9A227] hover:underline flex items-center gap-1">
                View All News <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.slice(0, 3).map((art) => (
                <a href={art.url} target="_blank" rel="noopener noreferrer" className="block group h-full" key={art.id}>
                  <Card className="overflow-hidden border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-[0_24px_56px_rgba(201,162,39,0.12)] hover:border-[#C9A227]/40 hover:-translate-y-2 transition-all duration-300 rounded-[32px] p-0 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Gradient Thumbnail */}
                      <div className={`h-44 w-full bg-gradient-to-br ${getThumbnailGradient(art.tag)} relative flex items-center justify-center`}>
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A22706_1px,transparent_1px),linear-gradient(to_bottom,#C9A22706_1px,transparent_1px)] bg-[size:10px_10px] opacity-30" />
                        <span className="text-3xl drop-shadow select-none">✨</span>
                        <span className="absolute top-3 left-3 bg-[#FFFDF9]/95 text-[8px] font-black text-slate-900 uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm border border-[#C9A227]/30">
                          {art.tag}
                        </span>
                      </div>

                      {/* Info Area */}
                      <div className="px-6 space-y-2">
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
                          <span>{art.source}</span>
                          <span>•</span>
                          <span>{new Date(art.published_at).toLocaleDateString()}</span>
                        </div>
                        <h3 className="font-black text-slate-900 group-hover:text-[#C9A227] transition-colors text-xs line-clamp-2 leading-snug">
                          {art.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-3 leading-relaxed">
                          {art.summary}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-4 mt-4 border-t border-slate-200/40 flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-400">Published Logs</span>
                      <span className="text-[#C9A227] group-hover:underline">Read More →</span>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </section>

          {/* 8. PLATFORM STATISTICS */}
          <section className="bg-[#FFFDF9] border-y border-[#C9A227]/15 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
              <div className="text-center space-y-3">
                <span className="text-[10px] font-black text-[#C9A227] uppercase tracking-widest bg-[#F7F3EC] border border-[#C9A227]/30 px-3.5 py-1.5 rounded-full shadow-sm">
                  Global Metrics
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#1F1F1F] tracking-tight">
                  Ecosystem Dashboard Registry
                </h2>
                <p className="text-xs sm:text-sm text-[#6B6B6B] font-semibold max-w-lg mx-auto">
                  Aggregated telemetry from across foundation models, private fundings, and public indexes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  { label: 'Companies Mapped', val: stats.companiesCount, suffix: '' },
                  { label: 'Capital Flow Mapped', val: stats.fundingTotal, prefix: '$', format: true },
                  { label: 'Developer Products', val: stats.productsCount, suffix: '+' },
                  { label: 'Unicorn Indexes', val: stats.unicornsCount, suffix: '🦄' },
                  { label: 'Allocators Mapped', val: stats.investorsCount, suffix: '' }
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#FFFDF9] border border-[#C9A227]/15 p-8 rounded-[24px] text-center shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">{s.label}</p>
                    <p className="text-2xl font-black text-[#C9A227] tracking-tight">
                      {s.prefix || ''}
                      {s.format ? (s.val / 1e9).toFixed(1) + 'B' : s.val.toLocaleString()}
                      {s.suffix || ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 9. DEVELOPER API CALL-TO-ACTION */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-zinc-900 border-none p-10 sm:p-14 rounded-[32px] text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A22704_1px,transparent_1px),linear-gradient(to_bottom,#C9A22704_1px,transparent_1px)] bg-[size:20px_20px] opacity-25" />
              
              <div className="space-y-6 max-w-xl text-left z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-zinc-800 border border-zinc-700 text-[#C9A227]">
                  🔌 REST API
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                  Integrate GraphOne API into Your AI Applications
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed">
                  Programmatic workspace datasets for companies, funds, seed stages, and product statistics. Access real-time intelligence feeds directly via JSON.
                </p>
                <div className="pt-2">
                  <button className="bg-[#C9A227] hover:bg-[#A67C00] text-white text-xs font-black px-7 py-3.5 rounded-full uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#C9A227]/20">
                    Request API Token
                  </button>
                </div>
              </div>

              {/* Mock code block display */}
              <div className="w-full lg:max-w-md bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 font-mono text-[10px] text-zinc-300 shadow-inner z-10 leading-relaxed text-left">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                  <span className="text-zinc-500 font-bold text-[9px] tracking-wider uppercase">Telemetry Query</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[#C9A227]">curl <span className="text-zinc-400">"https://api.graphone.ai/v1/companies?stage=Seed"</span> \</p>
                <p className="pl-4">-H <span className="text-emerald-500">"Authorization: Bearer go_token_..."</span></p>
                <p className="mt-4 text-zinc-500">// Response 200 OK</p>
                <p className="text-indigo-400">{"{"}</p>
                <p className="pl-4 text-indigo-400">"data": <span className="text-zinc-300">[</span></p>
                <p className="pl-8 text-indigo-400">{"{ "}<span className="text-emerald-500">"name"</span>: <span className="text-amber-200">"Cursor"</span>, <span className="text-emerald-500">"valuation"</span>: <span className="text-amber-200">"Growth"</span>{" }"}</p>
                <p className="pl-4 text-indigo-400">]</p>
                <p className="text-indigo-400">{"}"}</p>
              </div>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
