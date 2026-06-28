import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { DiscoverCompaniesClient } from '../components/companies/DiscoverCompaniesClient';
import { Company, ApiResponse } from '../types';
import { apiFetch } from '../lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function getStats() {
  return apiFetch<any>('/stats', { next: { revalidate: 60 } });
}

async function getTrendingCompanies(): Promise<Company[]> {
  return apiFetch<Company[]>('/companies/trending', { next: { revalidate: 60 } });
}

async function getCompanies(): Promise<{ items: Company[]; total: number; cursor: string | null }> {
  const res = await fetch(`${API_BASE}/companies?limit=12&sort=trending`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch companies list');
  const json: ApiResponse<Company[]> = await res.json();
  return {
    items: json.data,
    total: json.meta?.total || 0,
    cursor: json.meta?.cursor || null,
  };
}

async function getInvestors(): Promise<any[]> {
  return apiFetch<any[]>('/investors?limit=4');
}

async function getLatestNews(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/news?limit=3`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const json = await res.json();
  const data = json.data as any;
  return Array.isArray(data) ? data : (data.items || []);
}

async function getLatestFunding(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/companies?limit=3&sort=funded`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export default async function Home() {
  try {
    // Run initial data queries in parallel
    const [stats, trending, companiesData, investors, latestNews, latestFunding] = await Promise.all([
      getStats(),
      getTrendingCompanies(),
      getCompanies(),
      getInvestors(),
      getLatestNews(),
      getLatestFunding(),
    ]);

    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-[#F7F3EC]">
          <DiscoverCompaniesClient
            initialTrending={trending}
            initialCompanies={companiesData.items}
            initialTotal={companiesData.total}
            initialCursor={companiesData.cursor}
            stats={stats}
            featuredInvestors={investors}
            latestNews={latestNews}
            latestFunding={latestFunding}
          />
        </main>
        <Footer />
      </div>
    );
  } catch (error: any) {
    console.error('Home Page Server Fetch Error:', error);
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
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Connecting to API</h2>
            <p className="text-sm text-gray-500 mb-6">
              Could not retrieve ecosystem data. Please ensure the backend server is running and database seed is completed.
            </p>
            <a 
              href="/" 
              className="inline-block bg-brand hover:bg-brand-dark text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all shadow-sm shadow-brand/10 hover:shadow-brand/20"
            >
              Retry Connection
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
