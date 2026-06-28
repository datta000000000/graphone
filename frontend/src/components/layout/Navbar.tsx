'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Companies', href: '/companies' },
    { name: 'Investors', href: '/investors' },
    { name: 'Products', href: '/products' },
    { name: 'Funding', href: '/funding' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'News', href: '/news' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#C9A227]/15 bg-[#FFFDF9]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 bg-[#C9A227] flex items-center justify-center rounded-[10px] transform rotate-3 transition-transform group-hover:rotate-12 shadow-md shadow-[#C9A227]/20">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900">
            Graph<span className="text-[#C9A227]">One</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider transition-colors py-1.5 border-b-2",
                  isActive
                    ? "text-[#C9A227] border-[#C9A227]"
                    : "text-slate-500 border-transparent hover:text-slate-900 hover:border-[#C9A227]/50"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

      </div>
    </header>
  );
}
