import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { LogoAvatar } from '../../../components/ui/LogoAvatar';
import { formatCurrency, formatNumber } from '../../../lib/utils';
import { InvestorDetail } from '../../../types';
import { apiFetch } from '../../../lib/api';

const DonutChart = dynamic(() => import('../../../components/charts/DonutChart'), { ssr: false });

async function getInvestorDetail(slug: string): Promise<InvestorDetail> {
  return apiFetch<InvestorDetail>(`/investors/${slug}`, { cache: 'no-store' });
}

export default async function InvestorDetailPage({ params }: { params: { slug: string } }) {
  try {
    const investor = await getInvestorDetail(params.slug);

    // Map portfolio concentration categories to recharts data
    const concentrationData = (investor.portfolio_concentration || []).map((c) => ({
      name: c.category,
      value: Number(c.percentage),
      color: c.color,
    }));

    // Dynamic tagline/thesis helper
    const tagline = `Accelerating capital allocations across deep-tech primitives and AI applications.`;

    return (
      <div className="flex flex-col min-h-screen bg-[#F7F3EC] text-[#1F1F1F]">
        <Navbar />
        
        <main className="flex-grow py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            
            {/* ── BACK NAVIGATION LINK ── */}
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#C9A227] hover:text-[#A67C00] transition-colors">
              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Startups
            </Link>

            {/* TWO-COLUMN GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LEFT & CENTER MAIN PANEL (70%) */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* 1. Hero Section Card */}
                <Card className="p-8 border border-[#C9A227]/20 bg-[#FFFDF9] shadow-luxury rounded-[32px] space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-[#C9A227]/5 rounded-bl-full pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <LogoAvatar
                      logoUrl={investor.logo_url}
                      name={investor.name}
                      size="h-20 w-20"
                    />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h1 className="text-3xl font-black text-[#1F1F1F] tracking-tight leading-none">
                          {investor.name}
                        </h1>
                        <Badge className="bg-[#C9A227]/10 text-[#C9A227] text-[9px] font-extrabold px-2.5 py-0.5 border-none shadow-sm uppercase">
                          {investor.type} Investor
                        </Badge>
                      </div>
                      <p className="text-xs font-bold text-[#6B6B6B] uppercase tracking-widest">{investor.location}</p>
                      
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-semibold text-[#6B6B6B] pt-1">
                        <span className="flex items-center gap-1">
                          📍 Global Operations
                        </span>
                        <span>•</span>
                        <span>Portfolio Size: {investor.portfolio_count} Companies</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#C9A227]/10 pt-5 space-y-2">
                    <p className="text-sm font-extrabold text-[#C9A227] italic">
                      "{tagline}"
                    </p>
                    <p className="text-xs text-[#6B6B6B] font-semibold leading-relaxed">
                      {investor.bio}
                    </p>
                  </div>
                </Card>

                {/* 2. Key Metrics Grid */}
                <section className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <Card className="p-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury text-center rounded-[24px] hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">AUM</span>
                    <p className="text-xl font-black text-[#C9A227] tracking-tight mt-1">
                      {investor.aum ? formatCurrency(investor.aum) : 'Undisclosed'}
                    </p>
                  </Card>

                  <Card className="p-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury text-center rounded-[24px] hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Avg Check Size</span>
                    <p className="text-xl font-black text-slate-800 tracking-tight mt-1">
                      {investor.avg_check_size ? formatCurrency(investor.avg_check_size) : 'Undisclosed'}
                    </p>
                  </Card>

                  <Card className="p-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury text-center rounded-[24px] hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Portfolio Mapped</span>
                    <p className="text-xl font-black text-[#C9A227] tracking-tight mt-1">{investor.portfolio_count} Sites</p>
                  </Card>

                  <Card className="p-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury text-center rounded-[24px] hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Focus Stages</span>
                    <p className="text-sm font-black text-slate-800 tracking-tight mt-1.5 truncate">
                      {investor.stage_focus && investor.stage_focus.length > 0 
                        ? investor.stage_focus.slice(0, 2).join(', ')
                        : 'Growth & Seed'}
                    </p>
                  </Card>
                </section>

                {/* 3. Thesis & Focus Sections */}
                <section className="space-y-6">
                  <Card className="p-8 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury rounded-[32px] space-y-6">
                    <h2 className="text-base font-black text-[#1F1F1F] uppercase tracking-wider border-b border-[#C9A227]/10 pb-3">
                      Investment Focus & Thesis
                    </h2>
                    
                    {investor.investment_thesis && (
                      <div className="space-y-2">
                        <span className="font-extrabold text-xs text-[#C9A227] uppercase tracking-wider">Investment Thesis</span>
                        <blockquote className="border-l-4 border-[#C9A227] pl-4 text-xs text-[#6B6B6B] italic font-semibold leading-relaxed py-1 bg-slate-50/40 rounded-r-xl pr-4">
                          "{investor.investment_thesis}"
                        </blockquote>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed border-t border-[#C9A227]/10 pt-6">
                      <div className="space-y-2">
                        <span className="font-extrabold text-[#C9A227] uppercase tracking-wider block">Sectors Focus</span>
                        <div className="flex flex-wrap gap-2">
                          {investor.sector_focus.map((sec) => (
                            <Badge key={sec} className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[9px] font-bold px-2 py-0.5 border-none">
                              {sec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="font-extrabold text-[#C9A227] uppercase tracking-wider block">Stages Focus</span>
                        <div className="flex flex-wrap gap-2">
                          {investor.stage_focus.map((stg) => (
                            <Badge key={stg} className="bg-[#C9A227]/10 text-[#C9A227] text-[9px] font-bold px-2 py-0.5 border-none">
                              {stg}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </section>

                {/* 4. Recent Deals Timeline */}
                {investor.recent_investments && investor.recent_investments.length > 0 && (
                  <section className="space-y-4">
                    <Card className="p-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury rounded-[24px]">
                      <h2 className="text-xs font-black text-[#1F1F1F] uppercase tracking-wider border-b border-[#C9A227]/10 pb-3 mb-5">
                        Recent Transactions History
                      </h2>
                      <div className="relative border-l border-[#C9A227]/30 ml-3 pl-6 space-y-6">
                        {investor.recent_investments.map((deal, idx) => (
                          <div key={idx} className="relative group flex items-start justify-between gap-6">
                            <div className="absolute -left-[30px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#FFFDF9] border-2 border-[#C9A227] group-hover:bg-[#C9A227] transition-colors" />
                            <div className="space-y-0.5 flex-grow">
                              <span className="text-[10px] font-extrabold text-[#C9A227]">{new Date(deal.date).toLocaleDateString()}</span>
                              <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-xs text-[#1F1F1F]">{deal.company_name}</h3>
                                <Badge className="bg-[#C9A227]/10 text-[#C9A227] text-[8px] font-bold py-0">{deal.round_type}</Badge>
                              </div>
                              <p className="text-[10px] text-[#6B6B6B] font-semibold leading-relaxed">
                                Allocated check in {deal.round_type} equity round financing led by {investor.name}.
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-extrabold text-xs text-slate-800">{deal.amount > 0 ? formatCurrency(deal.amount) : 'Undisclosed'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </section>
                )}

                {/* 5. Portfolio Directory Grid */}
                {investor.portfolio && investor.portfolio.length > 0 && (
                  <section className="space-y-4">
                    <h2 className="text-xs font-black text-[#1F1F1F] uppercase tracking-wider border-b border-[#C9A227]/10 pb-2">
                      Portfolio Companies ({investor.portfolio.length})
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {investor.portfolio.map((item, idx) => (
                        <Link href={`/companies/${item.company.slug}`} key={idx} className="block group">
                          <Card className="p-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 rounded-[24px] flex flex-col justify-between h-full">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <LogoAvatar logoUrl={item.company.logo_url} name={item.company.name} size="h-10 w-10" />
                                <div>
                                  <h3 className="font-extrabold text-xs text-[#1F1F1F] group-hover:text-[#C9A227] transition-colors leading-none">{item.company.name}</h3>
                                  <span className="text-[9px] text-[#6B6B6B] font-bold block mt-1">{item.company.category}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <Badge className="bg-[#C9A227]/10 text-[#C9A227] text-[8px] font-extrabold border-none py-0">{item.company.stage}</Badge>
                                <Badge className={`text-[8px] font-extrabold border-none py-0 ${item.is_lead ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                                  {item.is_lead ? "Lead Allocator" : "Participant"}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-6 pt-3 border-t border-[#C9A227]/10 text-[10px] font-bold text-slate-400">
                              <span>Round: {item.round_type}</span>
                              <span>{new Date(item.invested_at).toLocaleDateString()}</span>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* 6. Co-investors Section */}
                {investor.co_investors && investor.co_investors.length > 0 && (
                  <section className="space-y-4">
                    <h2 className="text-xs font-black text-[#1F1F1F] uppercase tracking-wider border-b border-[#C9A227]/10 pb-2">
                      Frequent Co-investors
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      {investor.co_investors.map((co) => (
                        <Link href={`/investors/${co.slug}`} key={co.id} className="block group">
                          <Card className="p-4 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 rounded-[20px] flex flex-col items-center text-center space-y-2">
                            <LogoAvatar logoUrl={co.logo_url} name={co.name} size="h-10 w-10" />
                            <p className="font-extrabold text-[10px] text-slate-800 group-hover:text-[#C9A227] transition-colors line-clamp-1">{co.name}</p>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

              </div>

              {/* RIGHT PANEL: STICKY SIDEBAR (30%) */}
              <div className="space-y-8">
                <div className="sticky top-24 space-y-8">
                  
                  {/* Sticky Sidebar Card (Social Links, Sector Allocation Donut & Deal counts by year) */}
                  <Card className="p-6 border border-[#C9A227]/20 bg-[#FFFDF9] shadow-luxury rounded-[28px] space-y-6">
                    <div>
                      <h3 className="text-[10px] font-black text-[#1F1F1F] uppercase tracking-wider border-b border-[#C9A227]/10 pb-2.5 mb-4">
                        Quick Connections
                      </h3>
                      <div className="flex flex-col gap-2">
                        <a 
                          href={investor.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center justify-between text-xs font-bold text-slate-850 hover:text-[#C9A227] transition-colors p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-[#C9A227]/10"
                        >
                          <span>🌐 Official Website</span>
                          <span className="text-[10px] text-slate-400">Visit ↗</span>
                        </a>

                        <a 
                          href={`https://linkedin.com/company/${investor.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center justify-between text-xs font-bold text-slate-850 hover:text-[#C9A227] transition-colors p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-[#C9A227]/10"
                        >
                          <span>💼 LinkedIn Profile</span>
                          <span className="text-[10px] text-slate-400">View ↗</span>
                        </a>

                        <a 
                          href={`https://x.com/${investor.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center justify-between text-xs font-bold text-slate-850 hover:text-[#C9A227] transition-colors p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-[#C9A227]/10"
                        >
                          <span>🐦 X / Twitter Feed</span>
                          <span className="text-[10px] text-slate-400">Follow ↗</span>
                        </a>

                        <a 
                          href={`https://crunchbase.com/organization/${investor.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center justify-between text-xs font-bold text-slate-850 hover:text-[#C9A227] transition-colors p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-[#C9A227]/10"
                        >
                          <span>📊 Crunchbase Ledger</span>
                          <span className="text-[10px] text-slate-400">Details ↗</span>
                        </a>
                      </div>
                    </div>

                    {/* Donut Chart (Sector Allocation) */}
                    {concentrationData.length > 0 && (
                      <div className="border-t border-[#C9A227]/10 pt-5">
                        <h3 className="text-[10px] font-black text-[#1F1F1F] uppercase tracking-wider mb-4">
                          Sector Concentration
                        </h3>
                        <DonutChart data={concentrationData} />
                      </div>
                    )}

                    {/* Deals by Year bar chart */}
                    {investor.deal_counts_by_year && investor.deal_counts_by_year.length > 0 && (
                      <div className="border-t border-[#C9A227]/10 pt-5 space-y-3">
                        <h3 className="text-[10px] font-black text-[#1F1F1F] uppercase tracking-wider">
                          Deals Velocity By Year
                        </h3>
                        <div className="space-y-2">
                          {investor.deal_counts_by_year.map((item) => (
                            <div key={item.year} className="flex items-center justify-between text-[11px] font-semibold">
                              <span className="text-slate-500 shrink-0 w-8">{item.year}</span>
                              <div className="flex items-center gap-2 flex-grow mx-3">
                                <div className="bg-slate-100 rounded-full h-1.5 w-full overflow-hidden">
                                  <div 
                                    className="bg-[#C9A227] h-full rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((item.count / 8) * 100, 100)}%` }}
                                  />
                                </div>
                              </div>
                              <span className="text-slate-800 font-extrabold w-4 text-right">{item.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </Card>
                </div>
              </div>

            </div>

          </div>
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error fetching investor details:', error);
    return (
      <div className="flex flex-col min-h-screen bg-[#F7F3EC] text-[#1F1F1F]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-8">
          <Card className="max-w-md w-full text-center bg-[#FFFDF9] border border-[#C9A227]/30 p-8 rounded-[28px] shadow-luxury">
            <div className="h-12 w-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Investor Not Found</h2>
            <p className="text-xs text-slate-500 mb-6 font-semibold leading-relaxed">
              The investor profile slug does not match any registered entities in our database registry.
            </p>
            <Link 
              href="/" 
              className="inline-block bg-[#C9A227] hover:bg-[#A67C00] text-white font-extrabold text-xs px-6 py-3 rounded-full transition-all shadow-sm"
            >
              Back to Startups
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
}
