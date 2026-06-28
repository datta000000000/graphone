import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { LogoAvatar } from '../../../components/ui/LogoAvatar';
import { formatCurrency, formatNumber, timeAgo } from '../../../lib/utils';
import { CompanyDetail } from '../../../types';
import { apiFetch } from '../../../lib/api';

// Load charts dynamically to disable SSR and avoid layout/SVG measuring issues
const DonutChart = dynamic(() => import('../../../components/charts/DonutChart'), { ssr: false });
const EcosystemGraph = dynamic(() => import('../../../components/companies/EcosystemGraph'), { ssr: false });

async function getCompanyDetail(slug: string): Promise<CompanyDetail> {
  return apiFetch<CompanyDetail>(`/companies/${slug}`, { cache: 'no-store' });
}

async function getCompanyGraph(slug: string): Promise<{ nodes: any[]; edges: any[] }> {
  return apiFetch<{ nodes: any[]; edges: any[] }>(`/companies/${slug}/graph`, { cache: 'no-store' });
}

export default async function CompanyDetailPage({ params }: { params: { slug: string } }) {
  try {
    const [company, graph] = await Promise.all([
      getCompanyDetail(params.slug),
      getCompanyGraph(params.slug),
    ]);

    // Map ownership breakdown to recharts format
    const ownershipData = (company.ownership_breakdown || []).map((o) => ({
      name: o.owner_name,
      value: Number(o.percentage),
      color: o.color,
    }));

    // Extract unique investors from funding rounds
    const uniqueInvestors = Array.from(
      new Map(
        (company.funding_rounds || [])
          .map((r) => {
            const name = r.lead_investor_name;
            const id = r.lead_investor_id;
            if (!name || !id) {
              return null;
            }
            const investorSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
            const pair: [string, { id: string; name: string; slug: string; logoUrl: string }] = [
              id,
              {
                id,
                name,
                slug: investorSlug,
                logoUrl: `/logos/investors/${investorSlug}.svg`
              }
            ];
            return pair;
          })
          .filter((pair): pair is [string, { id: string; name: string; slug: string; logoUrl: string }] => pair !== null)
      ).values()
    );

    // Dynamic taglines and specifications based on the AI category
    const tagline = `Pioneering next-generation breakthroughs in ${company.category || 'Artificial Intelligence'}.`;
    const specialization = `Research and engineering of core computational primitives, advanced neural network layers, and scalable alignment systems optimized for ${company.category || 'AI applications'}.`;
    const targetIndustries = company.tags && company.tags.length > 0 
      ? company.tags.join(', ') + ', and Enterprise Solutions'
      : 'Developer Platforms, Enterprise Systems, and Automated Logistics';

    // Fallback list of competitors if empty
    const competitorList = company.competitors && company.competitors.length > 0
      ? company.competitors
      : company.similar_companies || [];

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
                      logoUrl={company.logo_url}
                      name={company.name}
                      size="h-20 w-20"
                    />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h1 className="text-3xl font-black text-[#1F1F1F] tracking-tight leading-none">
                          {company.name}
                        </h1>
                        {company.is_unicorn && (
                          <Badge variant="brand" className="bg-[#C9A227] text-white uppercase text-[9px] font-extrabold px-2.5 py-0.5 border-none shadow-sm">
                            🦄 Unicorn
                          </Badge>
                        )}
                        <Badge className="bg-[#C9A227]/10 text-[#C9A227] text-[9px] font-extrabold px-2.5 py-0.5 border-none">
                          {company.stage}
                        </Badge>
                      </div>
                      <p className="text-xs font-bold text-[#6B6B6B] uppercase tracking-widest">{company.category}</p>
                      
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-semibold text-[#6B6B6B] pt-1">
                        <span className="flex items-center gap-1">
                          📍 {company.hq_city}, {company.hq_country}
                        </span>
                        <span>•</span>
                        <span>Founded {company.founded_year}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#C9A227]/10 pt-5 space-y-2">
                    <p className="text-sm font-extrabold text-[#C9A227] italic">
                      "{tagline}"
                    </p>
                    <p className="text-xs text-[#6B6B6B] font-semibold leading-relaxed">
                      {company.description}
                    </p>
                  </div>
                </Card>

                {/* 2. Key Metrics Grid */}
                <section className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <Card className="p-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury text-center rounded-[24px] hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Total Funding</span>
                    <p className="text-xl font-black text-[#C9A227] tracking-tight mt-1">{formatCurrency(company.funding_total)}</p>
                  </Card>

                  <Card className="p-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury text-center rounded-[24px] hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Valuation</span>
                    <p className="text-xl font-black text-slate-800 tracking-tight mt-1">
                      {company.valuation ? formatCurrency(company.valuation) : 'Undisclosed'}
                    </p>
                  </Card>

                  <Card className="p-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury text-center rounded-[24px] hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Growth Score</span>
                    <p className="text-xl font-black text-[#C9A227] tracking-tight mt-1">{company.growth_score}%</p>
                  </Card>

                  <Card className="p-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury text-center rounded-[24px] hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Employees</span>
                    <p className="text-xl font-black text-slate-800 tracking-tight mt-1">
                      {company.employee_count ? formatNumber(company.employee_count) : 'N/A'}
                    </p>
                  </Card>
                </section>

                {/* 3. Company Overview & Ecosystem Graph */}
                <section className="space-y-6">
                  <Card className="p-8 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury rounded-[32px] space-y-6">
                    <h2 className="text-base font-black text-[#1F1F1F] uppercase tracking-wider border-b border-[#C9A227]/10 pb-3">
                      Company Overview
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                      <div className="space-y-1">
                        <span className="font-extrabold text-[#C9A227] uppercase tracking-wider">AI Specialization</span>
                        <p className="text-[#6B6B6B] font-semibold">{specialization}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-extrabold text-[#C9A227] uppercase tracking-wider">Target Industries</span>
                        <p className="text-[#6B6B6B] font-semibold">{targetIndustries}</p>
                      </div>
                    </div>

                    <div className="border-t border-[#C9A227]/10 pt-6">
                      <h3 className="font-extrabold text-xs text-[#1F1F1F] mb-4 uppercase tracking-wide">Ecosystem Graph</h3>
                      <EcosystemGraph nodes={graph.nodes} edges={graph.edges} />
                    </div>
                  </Card>
                </section>

                {/* 4. Funding Timeline */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {company.timeline_events && company.timeline_events.length > 0 && (
                    <Card className="p-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury rounded-[24px]">
                      <h2 className="text-xs font-black text-[#1F1F1F] uppercase tracking-wider border-b border-[#C9A227]/10 pb-3 mb-5">
                        Milestone Timeline
                      </h2>
                      <div className="relative border-l border-[#C9A227]/30 ml-3 pl-6 space-y-6">
                        {company.timeline_events.map((evt, idx) => (
                          <div key={idx} className="relative group">
                            <div className="absolute -left-[30px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#FFFDF9] border-2 border-[#C9A227] group-hover:bg-[#C9A227] transition-colors" />
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-extrabold text-[#C9A227]">{evt.year}</span>
                              <h3 className="font-extrabold text-xs text-[#1F1F1F]">{evt.label}</h3>
                              <p className="text-[10px] text-[#6B6B6B] font-semibold leading-relaxed">{evt.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {company.funding_rounds && company.funding_rounds.length > 0 && (
                    <Card className="p-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury rounded-[24px] flex flex-col justify-between">
                      <div>
                        <h2 className="text-xs font-black text-[#1F1F1F] uppercase tracking-wider border-b border-[#C9A227]/10 pb-3 mb-4">
                          Funding Rounds
                        </h2>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-left text-[11px]">
                            <thead>
                              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                                <th className="py-2">Round</th>
                                <th className="py-2">Amount</th>
                                <th className="py-2">Date</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-[#1F1F1F] font-semibold">
                              {company.funding_rounds.map((round) => (
                                <tr key={round.id}>
                                  <td className="py-2 font-bold text-[#C9A227]">{round.round_type}</td>
                                  <td className="py-2">{round.amount ? formatCurrency(round.amount) : 'Undisclosed'}</td>
                                  <td className="py-2 text-[#6B6B6B]">{new Date(round.date).toLocaleDateString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </Card>
                  )}
                </section>

                {/* 5. Investors Section */}
                {uniqueInvestors.length > 0 && (
                  <section className="space-y-4">
                    <h2 className="text-xs font-black text-[#1F1F1F] uppercase tracking-wider border-b border-[#C9A227]/10 pb-2">
                      Platform Investors
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      {uniqueInvestors.map((inv: any) => (
                        <Link href={`/investors/${inv.slug}`} key={inv.id} className="block group">
                          <Card className="p-4 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 rounded-[20px] flex flex-col items-center text-center space-y-2">
                            <LogoAvatar logoUrl={inv.logoUrl} name={inv.name} size="h-10 w-10" />
                            <p className="font-extrabold text-[10px] text-slate-800 group-hover:text-[#C9A227] transition-colors line-clamp-1">{inv.name}</p>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* 6. Products Section */}
                {company.products && company.products.length > 0 && (
                  <section className="space-y-4">
                    <h2 className="text-xs font-black text-[#1F1F1F] uppercase tracking-wider border-b border-[#C9A227]/10 pb-2">
                      AI Products ({company.products.length})
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {company.products.map((prod) => (
                        <Card key={prod.id} className="p-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 rounded-[24px] flex flex-col justify-between h-full">
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <h3 className="font-extrabold text-xs text-[#1F1F1F]">{prod.name}</h3>
                              <Badge className="bg-[#C9A227]/10 text-[#C9A227] text-[8px] font-extrabold border-none">{prod.category}</Badge>
                            </div>
                            <p className="text-[11px] text-[#6B6B6B] font-semibold leading-relaxed line-clamp-2">{prod.description}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-6 pt-3 border-t border-[#C9A227]/10">
                            <a 
                              href={prod.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="bg-[#C9A227] hover:bg-[#A67C00] text-white px-3 py-1 rounded-full text-[9px] font-bold transition-all shadow-sm"
                            >
                              Launch Website →
                            </a>
                            <span className="text-[9px] font-extrabold text-[#6B6B6B]">👍 {formatNumber(prod.upvotes)} Upvotes</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                {/* 7. Latest News */}
                {company.news && company.news.length > 0 && (
                  <section className="space-y-4">
                    <h2 className="text-xs font-black text-[#1F1F1F] uppercase tracking-wider border-b border-[#C9A227]/10 pb-2">
                      Ecosystem News Logs
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                      {company.news.map((art) => (
                        <a href={art.url} target="_blank" rel="noopener noreferrer" key={art.id} className="block group">
                          <Card className="p-5 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-luxury-hover transition-all rounded-[24px] space-y-2">
                            <div className="flex items-center justify-between text-[9px] font-extrabold text-slate-400">
                              <span>{art.source}</span>
                              <span>{timeAgo(art.published_at)}</span>
                            </div>
                            <h3 className="font-bold text-xs text-[#1F1F1F] group-hover:text-[#C9A227] transition-colors leading-snug">
                              {art.title}
                            </h3>
                            <p className="text-[11px] text-[#6B6B6B] font-semibold leading-relaxed line-clamp-2">{art.summary}</p>
                          </Card>
                        </a>
                      ))}
                    </div>
                  </section>
                )}

                {/* 9. Competitors Side-by-side Cards */}
                {competitorList && competitorList.length > 0 && (
                  <section className="space-y-4">
                    <h2 className="text-xs font-black text-[#1F1F1F] uppercase tracking-wider border-b border-[#C9A227]/10 pb-2">
                      Direct Competitor Comparison
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {competitorList.slice(0, 2).map((comp) => (
                        <Link href={`/companies/${comp.slug}`} key={comp.id} className="block group">
                          <Card className="p-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 rounded-[24px] space-y-4">
                            <div className="flex items-center gap-3">
                              <LogoAvatar logoUrl={comp.logo_url} name={comp.name} size="h-10 w-10" />
                              <div>
                                <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-[#C9A227] transition-colors leading-none">{comp.name}</h4>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">{comp.category}</span>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                              Positioned as a direct competitive entity in the global AI ecosystem focusing on {comp.category.toLowerCase()} primitives.
                            </p>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* 8. Similar Companies */}
                {company.similar_companies && company.similar_companies.length > 0 && (
                  <section className="space-y-4">
                    <h2 className="text-xs font-black text-[#1F1F1F] uppercase tracking-wider border-b border-[#C9A227]/10 pb-2">
                      Similar AI Startups
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      {company.similar_companies.map((sim) => (
                        <Link href={`/companies/${sim.slug}`} key={sim.id} className="block group">
                          <Card className="p-4 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 rounded-[20px] flex flex-col items-center text-center space-y-2">
                            <LogoAvatar logoUrl={sim.logo_url} name={sim.name} size="h-8 w-8" />
                            <div>
                              <p className="font-extrabold text-[10px] text-slate-800 group-hover:text-[#C9A227] transition-colors line-clamp-1">{sim.name}</p>
                              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide truncate mt-0.5">{sim.category}</p>
                            </div>
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
                  
                  {/* 10. Sticky Sidebar Card (Social Links, Ownership Chart & Executive Team) */}
                  <Card className="p-6 border border-[#C9A227]/20 bg-[#FFFDF9] shadow-luxury rounded-[28px] space-y-6">
                    <div>
                      <h3 className="text-[10px] font-black text-[#1F1F1F] uppercase tracking-wider border-b border-[#C9A227]/10 pb-2.5 mb-4">
                        Quick Connections
                      </h3>
                      <div className="flex flex-col gap-2">
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center justify-between text-xs font-bold text-slate-850 hover:text-[#C9A227] transition-colors p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-[#C9A227]/10"
                        >
                          <span>🌐 Official Website</span>
                          <span className="text-[10px] text-slate-400">Visit ↗</span>
                        </a>

                        <a 
                          href={`https://linkedin.com/company/${company.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center justify-between text-xs font-bold text-slate-850 hover:text-[#C9A227] transition-colors p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-[#C9A227]/10"
                        >
                          <span>💼 LinkedIn Profile</span>
                          <span className="text-[10px] text-slate-400">View ↗</span>
                        </a>

                        <a 
                          href={`https://x.com/${company.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center justify-between text-xs font-bold text-slate-850 hover:text-[#C9A227] transition-colors p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-[#C9A227]/10"
                        >
                          <span>🐦 X / Twitter Feed</span>
                          <span className="text-[10px] text-slate-400">Follow ↗</span>
                        </a>

                        <a 
                          href={`https://github.com/${company.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center justify-between text-xs font-bold text-slate-850 hover:text-[#C9A227] transition-colors p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-[#C9A227]/10"
                        >
                          <span>💻 GitHub Repository</span>
                          <span className="text-[10px] text-slate-400">Source ↗</span>
                        </a>

                        <a 
                          href={`https://crunchbase.com/organization/${company.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center justify-between text-xs font-bold text-slate-850 hover:text-[#C9A227] transition-colors p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-[#C9A227]/10"
                        >
                          <span>📊 Crunchbase Ledger</span>
                          <span className="text-[10px] text-slate-400">Details ↗</span>
                        </a>
                      </div>
                    </div>

                    {/* Donut Chart (Ownership Breakdown) */}
                    {ownershipData.length > 0 && (
                      <div className="border-t border-[#C9A227]/10 pt-5">
                        <h3 className="text-[10px] font-black text-[#1F1F1F] uppercase tracking-wider mb-4">
                          Ownership Structure
                        </h3>
                        <DonutChart data={ownershipData} />
                      </div>
                    )}

                    {/* Founders / Executive Team */}
                    {company.founders && company.founders.length > 0 && (
                      <div className="border-t border-[#C9A227]/10 pt-5 space-y-4">
                        <h3 className="text-[10px] font-black text-[#1F1F1F] uppercase tracking-wider mb-2">
                          Executive Leadership
                        </h3>
                        <div className="space-y-3">
                          {company.founders.map((f) => (
                            <div key={f.id} className="flex items-center gap-3 p-2 border border-[#C9A227]/10 rounded-2xl bg-white shadow-sm">
                              <img src={f.photo_url} alt={f.name} className="h-9 w-9 rounded-full object-cover shrink-0 border border-slate-200" />
                              <div className="min-w-0">
                                <p className="font-extrabold text-[11px] text-slate-800 leading-tight">{f.name}</p>
                                <p className="text-[9px] text-[#C9A227] font-bold uppercase tracking-wider mt-0.5">{f.title}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Last Updated */}
                    <div className="border-t border-[#C9A227]/10 pt-4 text-center">
                      <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block">Last Synchronized</span>
                      <span className="text-[10px] font-bold text-slate-700 mt-1 block">
                        {new Date(company.updated_at || company.created_at || new Date().toISOString()).toLocaleDateString()} at {new Date(company.updated_at || company.created_at || new Date().toISOString()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

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
    console.error('Error fetching company details:', error);
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
            <h2 className="text-xl font-black text-slate-900 mb-2">Company Not Found</h2>
            <p className="text-xs text-slate-500 mb-6 font-semibold leading-relaxed">
              The company profile slug does not match any registered entities in our database index.
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
