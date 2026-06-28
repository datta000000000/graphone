import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { NewsWorkspaceClient } from '../../components/news/NewsWorkspaceClient';
import { ApiResponse } from '../../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function getNews(): Promise<{ items: any[]; total: number; cursor: string | null }> {
  const res = await fetch(`${API_BASE}/news?limit=12`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch news list');
  const json: ApiResponse<any[]> = await res.json();
  
  // The API returns the list directly or inside an items property depending on router structure
  const data = json.data as any;
  const items = Array.isArray(data) ? data : (data.items || []);
  const total = json.meta?.total || items.length;
  const cursor = json.meta?.cursor || null;

  return { items, total, cursor };
}

async function getTrendingNews(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/news/trending`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch trending news');
  const json: ApiResponse<any[]> = await res.json();
  return json.data || [];
}

export default async function NewsPage() {
  try {
    const [newsData, trending] = await Promise.all([
      getNews(),
      getTrendingNews(),
    ]);

    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <NewsWorkspaceClient
            initialNews={newsData.items}
            initialTotal={newsData.total}
            initialCursor={newsData.cursor}
            trendingNews={trending}
          />
        </div>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('News Workspace Server Fetch Error:', error);
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
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Connecting to Workspace</h2>
            <p className="text-sm text-gray-500 mb-6">
              Could not retrieve news directory. Please ensure the backend server is running and database seed is completed.
            </p>
            <a 
              href="/news" 
              className="inline-block bg-brand hover:bg-brand-dark text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all"
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
