'use client';

import React, { useState, useEffect } from 'react';

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Brief top loader bar mount on route changes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <div className="loading-indicator" />}
      <div className="animate-page-fade-in-up">
        <style>{`
          @keyframes pageFadeInUp {
            0% {
              opacity: 0;
              transform: translateY(6px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-page-fade-in-up {
            animation: pageFadeInUp 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
        {children}
      </div>
    </>
  );
}
