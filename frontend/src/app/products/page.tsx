import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { ProductsWorkspaceClient } from '../../components/products/ProductsWorkspaceClient';
import { ApiResponse } from '../../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function getProducts(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/products?sort=popular`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch products list');
  const json: ApiResponse<any[]> = await res.json();
  return json.data || [];
}

export default async function ProductsPage() {
  try {
    const productsData = await getProducts();

    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <ProductsWorkspaceClient initialProducts={productsData} />
        </div>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Products Workspace Server Fetch Error:', error);
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
              Could not retrieve products registry. Please ensure the backend server is running and database seed is completed.
            </p>
            <a 
              href="/products" 
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
