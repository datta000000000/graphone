import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { formatCurrency, formatNumber } from '../../../lib/utils';
import { InvestorDetail, ApiResponse } from '../../../types';

const DonutChart = dynamic(() => import('../../../components/charts/DonutChart'), { ssr: false });

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function getInvestorDetail(slug: string): Promise<InvestorDetail> {
  const res = await fetch(`${API_BASE}/investors/${slug}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Investor not found');
  const json: ApiResponse<InvestorDetail> = await res.json();
  return json.data;
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

    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-slate-50/20 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            
            {/* Back Navigation Link */}
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Startups
            </Link>

            {/* HEADER PROFILE CARD */}
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-white via-white to-gray-50/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Logo & Basic Info */}
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={investor.logo_url}
                    alt={investor.name}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-contain bg-white border border-gray-200 p-2 shadow-sm"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        {investor.name}
                      </h1>
                      <Badge variant="brand" className="text-[10px] uppercase font-bold py-0.5">
                        {investor.type} Investor
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-gray-500">{investor.location}</p>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-medium text-gray-500 pt-1">
                      <span>Portfolio Size: {investor.portfolio_count} companies</span>
                      {investor.aum && (
                        <>
                          <span>•</span>
                          <span>AUM: {formatCurrency(investor.aum)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Website Link */}
                <div className="flex pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 items-center justify-end">
                  <a
                    href={investor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-950 text-white text-xs font-bold px-4.5 py-2.5 rounded-full hover:bg-brand hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Visit Investor Site ↗
                  </a>
                </div>

              </div>

              {/* Bio */}
              <div className="border-t border-gray-100 mt-6 pt-5">
                <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed max-w-4xl">
                  {investor.bio}
                </p>
              </div>
            </Card>

            {/* GRID SECTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LEFT & CENTER PANEL (Thesis, Concentration and Portfolio) */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Investment Thesis */}
                {investor.investment_thesis && (
                  <Card className="p-6">
                    <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 mb-4">
                      Investment Thesis
                    </h2>
                    <blockquote className="border-l-4 border-brand pl-4 text-sm text-gray-600 italic font-medium leading-relaxed py-1">
                      "{investor.investment_thesis}"
                    </blockquote>
                  </Card>
                )}

                {/* Portfolio Companies Directory */}
                <Card className="p-6">
                  <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 mb-5">
                    Portfolio Directory ({investor.portfolio.length} active investments)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {investor.portfolio.map((item, idx) => (
                      <Link href={`/companies/${item.company.slug}`} key={idx} className="block group">
                        <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/30 flex flex-col justify-between h-full hover:border-gray-200 hover:bg-gray-50/50 transition-all">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.company.logo_url}
                                alt={item.company.name}
                                className="h-9 w-9 rounded-lg object-contain bg-white border border-gray-100 p-0.5"
                              />
                              <div>
                                <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-brand transition-colors line-clamp-1">
                                  {item.company.name}
                                </h3>
                                <p className="text-[10px] text-gray-500 font-semibold">{item.company.category}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <Badge variant="indigo" className="text-[9px] py-0">{item.company.stage}</Badge>
                              <Badge variant={item.is_lead ? "brand" : "gray"} className="text-[9px] py-0">
                                {item.is_lead ? "Lead Investor" : "Participant"}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 mt-4 pt-2 border-t border-gray-100/50">
                            <span>Invested in: {item.round_type}</span>
                            <span>{new Date(item.invested_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>

                {/* Co-investors */}
                {investor.co_investors && investor.co_investors.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 mb-4">
                      Frequent Co-investors
                    </h2>
                    <div className="flex flex-wrap gap-4">
                      {investor.co_investors.map((co) => (
                        <Link href={`/investors/${co.slug}`} key={co.id} className="block group">
                          <div className="flex items-center gap-2.5 px-3 py-2 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition-colors">
                            <img src={co.logo_url} alt={co.name} className="h-6 w-6 rounded object-contain bg-white border p-0.5" />
                            <span className="text-xs font-bold text-gray-800 group-hover:text-brand transition-colors">{co.name}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </Card>
                )}

              </div>

              {/* RIGHT PANEL (Sector Focus & Deal flow counts) */}
              <div className="space-y-8">
                
                {/* Sector / Stage Focus Slices */}
                <Card className="p-6 bg-gradient-to-br from-gray-900 to-slate-950 text-white border-none shadow-md">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Investment Focus</h3>
                  <div className="space-y-4 text-xs font-semibold">
                    <div>
                      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Sectors Focus</span>
                      <div className="flex flex-wrap gap-1.5">
                        {investor.sector_focus.map((sec) => (
                          <span key={sec} className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded border border-gray-700">{sec}</span>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-gray-800 pt-4">
                      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Stages Focus</span>
                      <div className="flex flex-wrap gap-1.5">
                        {investor.stage_focus.map((stg) => (
                          <span key={stg} className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded border border-gray-700">{stg}</span>
                        ))}
                      </div>
                    </div>
                    {investor.avg_check_size && (
                      <div className="border-t border-gray-800 pt-4">
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Avg Check Size</span>
                        <p className="text-2xl font-black text-brand tracking-tight mt-0.5">
                          {formatCurrency(investor.avg_check_size)}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Donut Chart (Sector Concentration) */}
                {concentrationData.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 mb-4">
                      Sector Allocation
                    </h2>
                    <DonutChart data={concentrationData} />
                  </Card>
                )}

                {/* Recent Investments List */}
                {investor.recent_investments && investor.recent_investments.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 mb-4">
                      Recent Deals
                    </h2>
                    <div className="space-y-4">
                      {investor.recent_investments.map((deal, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-3 text-xs border-b border-gray-100 pb-3 last:border-none last:pb-0">
                          <div className="flex items-center gap-2">
                            <img src={deal.company_logo} alt={deal.company_name} className="h-7 w-7 rounded object-contain bg-white border border-gray-100 p-0.5" />
                            <div>
                              <p className="font-bold text-gray-900">{deal.company_name}</p>
                              <p className="text-[10px] text-gray-500 font-semibold">{deal.round_type} • {new Date(deal.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-1">
                            <span className="font-bold text-gray-900">{deal.amount > 0 ? formatCurrency(deal.amount) : 'Undisclosed'}</span>
                            {deal.is_lead && (
                              <Badge variant="brand" className="text-[8px] py-0 leading-none">
                                Lead
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Yearly Deal Counts */}
                {investor.deal_counts_by_year && investor.deal_counts_by_year.length > 0 && (
                  <Card className="p-6">
                    <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 mb-4">
                      Deals By Year
                    </h2>
                    <div className="space-y-2">
                      {investor.deal_counts_by_year.map((item) => (
                        <div key={item.year} className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-gray-600">{item.year}</span>
                          <div className="flex items-center gap-2 flex-grow mx-4">
                            <div className="bg-gray-100 rounded-full h-2 w-full overflow-hidden">
                              <div 
                                className="bg-brand h-full rounded-full transition-all duration-300"
                                style={{ width: `${Math.min((item.count / 8) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-gray-900 font-bold w-4 text-right">{item.count}</span>
                        </div>
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
    console.error('Error fetching investor details:', error);
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
            <h2 className="text-xl font-bold text-gray-900 mb-2">Investor Not Found</h2>
            <p className="text-sm text-gray-500 mb-6">
              The investor slug does not match any records in the GraphOne database registry.
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
