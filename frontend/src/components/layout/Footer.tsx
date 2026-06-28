'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#FFFDF9] text-[#1F1F1F] border-t border-[#C9A227]/30 py-16 sm:py-20 relative overflow-hidden">
      {/* Decorative Gold Radial Mesh */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#C9A227]/5 rounded-tl-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* MULTI-COLUMN RESPONSIVE LAYOUT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Column 1: GraphOne */}
          <div className="lg:col-span-3 space-y-5 text-left">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[#C9A227] flex items-center justify-center rounded-lg shadow-md">
                <svg className="h-4.5 w-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-black text-lg text-[#1F1F1F] tracking-tight">
                Graph<span className="text-[#C9A227]">One</span>
              </span>
            </div>
            <p className="text-xs text-[#6B6B6B] font-semibold leading-relaxed">
              GraphOne is the global intelligence layer for the artificial intelligence economy mapping fundings, products, and private companies.
            </p>
          </div>

          {/* Column 2: Platform */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <h4 className="text-[10px] font-black text-[#C9A227] uppercase tracking-widest border-b border-[#C9A227]/10 pb-1">
              Platform
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-[#6B6B6B]">
              <li>
                <Link href="/companies" className="hover:text-[#C9A227] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Companies
                </Link>
              </li>
              <li>
                <Link href="/investors" className="hover:text-[#C9A227] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Investors
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#C9A227] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/funding" className="hover:text-[#C9A227] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Funding
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-[#C9A227] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#C9A227] hover:translate-x-0.5 inline-block transition-all duration-200">
                  News
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <h4 className="text-[10px] font-black text-[#C9A227] uppercase tracking-widest border-b border-[#C9A227]/10 pb-1">
              Company
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-[#6B6B6B]">
              <li>
                <Link href="/about" className="hover:text-[#C9A227] hover:translate-x-0.5 inline-block transition-all duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <a href="mailto:contact@graphone.ai" className="hover:text-[#C9A227] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Contact Support
                </a>
              </li>
              <li>
                <Link href="#" className="hover:text-[#C9A227] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#C9A227] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Developer */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <h4 className="text-[10px] font-black text-[#C9A227] uppercase tracking-widest border-b border-[#C9A227]/10 pb-1">
              Developer
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-[#6B6B6B]">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A227] hover:translate-x-0.5 inline-block transition-all duration-200">
                  GitHub Repos
                </a>
              </li>
              <li>
                <Link href="#" className="hover:text-[#C9A227] hover:translate-x-0.5 inline-block transition-all duration-200">
                  REST API Feeds
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#C9A227] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Documentation
                </Link>
              </li>
              <li>
                <a href="mailto:bugs@graphone.ai" className="hover:text-[#C9A227] hover:translate-x-0.5 inline-block transition-all duration-200">
                  Report Issue
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div className="lg:col-span-3 space-y-4 text-left">
            <h4 className="text-[10px] font-black text-[#C9A227] uppercase tracking-widest border-b border-[#C9A227]/10 pb-1">
              Newsletter
            </h4>
            <p className="text-xs text-[#6B6B6B] font-semibold leading-relaxed">
              Subscribe to get curated venture capital fundings and model updates directly.
            </p>
            <form className="mt-2 flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter email address"
                className="px-4 py-2.5 text-xs font-semibold rounded-full border border-[#C9A227]/30 bg-white text-[#1F1F1F] placeholder-slate-400 focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/30 w-full"
                required
              />
              <button
                type="submit"
                className="bg-[#C9A227] hover:bg-[#A67C00] text-white px-5 py-2.5 rounded-full text-xs font-black transition-all shadow-sm shadow-[#C9A227]/10 w-full uppercase tracking-wider"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="border-t border-[#C9A227]/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-bold text-[#6B6B6B]">
          
          <p>© {new Date().getFullYear()} GraphOne Inc. All rights reserved.</p>
          
          {/* Social Icons */}
          <div className="flex gap-5 items-center justify-center">
            {/* X / Twitter */}
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-[#6B6B6B] hover:text-[#C9A227] transition-colors" aria-label="Twitter">
              <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            
            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#6B6B6B] hover:text-[#C9A227] transition-colors" aria-label="LinkedIn">
              <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* GitHub */}
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#6B6B6B] hover:text-[#C9A227] transition-colors" aria-label="GitHub">
              <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
          </div>

          <p className="flex items-center gap-1">
            <span>Built with Next.js + TypeScript</span>
          </p>
          
        </div>

      </div>
    </footer>
  );
}
