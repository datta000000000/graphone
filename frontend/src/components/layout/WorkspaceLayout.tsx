import React from 'react';

interface WorkspaceLayoutProps {
  sidebar: React.ReactNode;
  headerTitle: React.ReactNode;
  headerSubtitle?: React.ReactNode;
  headerActions?: React.ReactNode;
  searchSection?: React.ReactNode;
  filterToolbar?: React.ReactNode;
  content: React.ReactNode;
  pagination?: React.ReactNode;
}

export function WorkspaceLayout({
  sidebar,
  headerTitle,
  headerSubtitle,
  headerActions,
  searchSection,
  filterToolbar,
  content,
  pagination,
}: WorkspaceLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#F7F3EC]/50 relative">

      {/* Fixed Left Sidebar */}
      <aside className="hidden md:block w-64 border-r border-[#C9A227]/15 bg-[#FFFDF9] p-6 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        {sidebar}
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-grow p-8 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Workspace Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#C9A227]/15 pb-5">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              {headerTitle}
            </h1>
            {headerSubtitle && (
              <p className="text-xs text-slate-400 font-semibold mt-2">
                {headerSubtitle}
              </p>
            )}
          </div>
          
          {headerActions && (
            <div className="flex items-center gap-3">
              {headerActions}
            </div>
          )}
        </div>

        {/* Search & Toolbars */}
        {(searchSection || filterToolbar) && (
          <div className="space-y-4">
            {searchSection && <div className="w-full max-w-xl">{searchSection}</div>}
            {filterToolbar && <div className="w-full">{filterToolbar}</div>}
          </div>
        )}

        {/* Main Content */}
        <div className="w-full">
          {content}
        </div>

        {/* Pagination Footer */}
        {pagination && (
          <div className="text-center pt-4">
            {pagination}
          </div>
        )}

      </main>

    </div>
  );
}
