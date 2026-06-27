import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { formatCurrency, formatNumber, timeAgo } from '../../../lib/utils';
import { CompanyDetail, ApiResponse } from '../../../types';

// Load charts dynamically to disable SSR and avoid layout/SVG measuring issues
const DonutChart = dynamic(() => import('../../../components/charts/DonutChart'), { ssr: false });
const EcosystemGraph = dynamic(() => import('../../../components/companies/EcosystemGraph'), { ssr: false });

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function getCompanyDetail(slug: string): Promise<CompanyDetail> {
  const res = await fetch(`${API_BASE}/companies/${slug}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Company not found');
  const json: ApiResponse<CompanyDetail> = await res.json();
  return json.data;
}

async function getCompanyGraph(slug: string): Promise<{ nodes: any[]; edges: any[] }> {
  const res = await fetch(`${API_BASE}/companies/${slug}/graph`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Graph data not found');
  const json: ApiResponse<{ nodes: any[]; edges: any[] }> = await res.json();
  return json.data;
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

    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-slate-50/20 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            
            {/* ── BACK NAVIGATION LINK ── */}
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Startups
            </Link>

            {/* ── HEADER CARD ── */}
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-white via-white to-gray-50/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Logo & Basic Meta */}
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-contain bg-white border border-gray-200 p-2 shadow-sm"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        {company.name}
                      </h1>
                      {company.is_unicorn && (
                        <Badge variant="brand" className="text-[10px] uppercase font-bold py-0.5">
                          🦄 Unicorn
                        </Badge>
                      )}
                      <Badge variant="indigo" className="text-[10px] font-bold py-0.5">
                        {company.stage}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-gray-500">{company.category}</p>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-medium text-gray-500 pt-1">
                      <span className="flex items-center gap-1">
                        📍 {company.hq_city}, {company.hq_country}
                      </span>
                      <span>•</span>
                      <span>Founded: {company.founded_year}</span>
                      <span>•</span>
                      <span>Employees: {company.employee_count}</span>
                    </div>
                  </div>
                </div>

                {/* Growth and Links */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Growth Score</span>
                    <p className="text-2xl font-black text-brand tracking-tight mt-0.5">{company.growth_score}%</p>
                  </div>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-950 text-white text-xs font-bold px-4.5 py-2.5 rounded-full hover:bg-brand hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Visit Website ↗
                  </a>
                </div>

              </div>

              {/* Description */}
              <div className="border-t border-gray-100 mt-6 pt-5">
                <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed max-w-4xl">
                  {company.description}
                </p>
                {company.tags && company.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {company.tags.map((tag) => (
                      <Badge key={tag} variant="gray" className="text-[10px] py-0.5">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* ── STICKY TAB SECTION NAVIGATION ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LEFT & CENTER PANEL (Ecosystem and Financials) */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Ecosystem Graph SVG */}
                <Card className="p-6">
                  <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 mb-4">
                    Ecosystem Graph
                  </h2>
                  <EcosystemGraph nodes={graph.nodes} edges={graph.edges} />
                </Card>

                {/* Timeline */}
                {company.timeline_events && company.timeline_events.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 mb-5">
                      Milestone Timeline
                    </h2>
                    <div className="relative border-l border-gray-200/80 ml-3 pl-6 space-y-6">
                      {company.timeline_events.map((evt, idx) => (
                        <div key={idx} className="relative group">
                          {/* Dot marker */}
                          <div className="absolute -left-[30px] top-1.5 h-3 w-3 rounded-full bg-white border-2 border-brand group-hover:bg-brand transition-colors" />
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-brand">{evt.year}</span>
                            <h3 className="font-extrabold text-sm text-gray-900">{evt.label}</h3>
                            <p className="text-xs text-gray-600 font-medium leading-relaxed">{evt.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Products */}
                {company.products && company.products.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 mb-5">
                      AI Products ({company.products.length})
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {company.products.map((prod) => (
                        <div key={prod.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/30 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-sm text-gray-900">{prod.name}</h3>
                              <Badge variant="indigo" className="text-[9px]">{prod.category}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">{prod.description}</p>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100/50">
                            <a href={prod.website_url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-brand hover:underline">
                              Launch ↗
                            </a>
                            <span className="text-[10px] font-bold text-gray-500">👍 {formatNumber(prod.upvotes)} upvotes</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* News Articles */}
                {company.news && company.news.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 mb-5">
                      Ecosystem News
                    </h2>
                    <div className="space-y-4">
                      {company.news.map((art) => (
                        <a href={art.url} target="_blank" rel="noopener noreferrer" key={art.id} className="block group">
                          <div className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition-colors">
                            <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400 mb-1">
                              <span>{art.source}</span>
                              <span>{timeAgo(art.published_at)}</span>
                            </div>
                            <h3 className="font-bold text-sm text-gray-900 group-hover:text-brand transition-colors mb-1 leading-snug">
                              {art.title}
                            </h3>
                            <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">{art.summary}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </Card>
                )}

              </div>

              {/* RIGHT PANEL (Financials & Stakeholders) */}
              <div className="space-y-8">
                
                {/* Valuation & Funding Total */}
                <Card className="p-6 bg-gradient-to-br from-gray-900 to-slate-950 text-white border-none shadow-md">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Financial Stats</h3>
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Total Funding</span>
                      <p className="text-3xl font-black text-brand tracking-tight mt-0.5">
                        {formatCurrency(company.funding_total)}
                      </p>
                    </div>
                    {company.valuation && (
                      <div className="border-t border-gray-800 pt-4">
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Latest Valuation</span>
                        <p className="text-3xl font-black text-white tracking-tight mt-0.5">
                          {formatCurrency(company.valuation)}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Donut Chart (Ownership Breakdown) */}
                {ownershipData.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 mb-4">
                      Ownership Structure
                    </h2>
                    <DonutChart data={ownershipData} />
                  </Card>
                )}

                {/* Funding Rounds Table */}
                {company.funding_rounds && company.funding_rounds.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 mb-4">
                      Funding Rounds
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                            <th className="py-2.5">Round</th>
                            <th className="py-2.5">Amount</th>
                            <th className="py-2.5">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                          {company.funding_rounds.map((round) => (
                            <tr key={round.id}>
                              <td className="py-2.5 font-bold">{round.round_type}</td>
                              <td className="py-2.5">{round.amount ? formatCurrency(round.amount) : 'Undisclosed'}</td>
                              <td className="py-2.5 text-gray-500">{new Date(round.date).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}

                {/* Competitors List */}
                {company.competitors && company.competitors.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 mb-4">
                      Direct Competitors
                    </h2>
                    <div className="space-y-3">
                      {company.competitors.map((comp) => (
                        <Link href={`/companies/${comp.slug}`} key={comp.id} className="block group">
                          <div className="flex items-center gap-3 p-2.5 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition-colors">
                            <img src={comp.logo_url} alt={comp.name} className="h-8 w-8 rounded-lg object-contain bg-white border border-gray-100 p-0.5" />
                            <div>
                              <p className="font-bold text-xs text-gray-900 group-hover:text-brand transition-colors line-clamp-1">{comp.name}</p>
                              <p className="text-[10px] text-gray-500 font-semibold">{comp.category}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Similar Companies List */}
                {company.similar_companies && company.similar_companies.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 mb-4">
                      Similar Startups
                    </h2>
                    <div className="space-y-3">
                      {company.similar_companies.map((sim) => (
                        <Link href={`/companies/${sim.slug}`} key={sim.id} className="block group">
                          <div className="flex items-center gap-3 p-2.5 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition-colors">
                            <img src={sim.logo_url} alt={sim.name} className="h-8 w-8 rounded-lg object-contain bg-white border border-gray-100 p-0.5" />
                            <div>
                              <p className="font-bold text-xs text-gray-900 group-hover:text-brand transition-colors line-clamp-1">{sim.name}</p>
                              <p className="text-[10px] text-gray-500 font-semibold">{sim.category}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </Card>
                )}

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
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-8 bg-slate-50/50">
          <div className="max-w-md w-full text-center bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
            <div className="h-12 w-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Company Not Found</h2>
            <p className="text-sm text-gray-500 mb-6">
              The company slug does not match any records in the GraphOne database registry.
            </p>
            <Link 
              href="/" 
              className="inline-block bg-brand hover:bg-brand-dark text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all shadow-sm shadow-brand/10 hover:shadow-brand/20"
            >
              Back to Startups
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
