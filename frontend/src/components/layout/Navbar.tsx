'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Companies', href: '/' },
    { name: 'Investors', href: '/investors/sequoia-capital' }, // Default detail link for demonstration
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 bg-brand flex items-center justify-center rounded-[8px] transform rotate-3 transition-transform group-hover:rotate-12 shadow-sm shadow-brand/35">
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
          <span className="font-extrabold text-xl tracking-tight text-gray-900">
            Graph<span className="text-brand">One</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors py-1.5 border-b-2",
                  isActive
                    ? "text-brand border-brand"
                    : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
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
