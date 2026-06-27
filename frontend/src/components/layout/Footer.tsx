import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-800 pb-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-brand flex items-center justify-center rounded-[6px] transform rotate-3">
              <svg className="h-4.5 w-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">
              Graph<span className="text-brand">One</span>
            </span>
          </div>
          <p className="text-sm text-gray-500">
            The global intelligence layer for the AI economy.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} GraphOne Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Contact Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
