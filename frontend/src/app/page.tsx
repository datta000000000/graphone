export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-gray-900 via-slate-800 to-black text-white">
      <div className="max-w-md w-full text-center bg-gray-800/50 backdrop-blur-md p-8 rounded-card border border-gray-700/50 shadow-xl">
        <h1 className="text-3xl font-extrabold tracking-tight mb-4">
          Graph<span className="text-brand">One</span>
        </h1>
        <p className="text-gray-300 text-sm mb-6">
          Phase 1 (Foundation) is active. The Next.js 14 App Router, TypeScript (strict), Tailwind CSS, and utility libraries are configured successfully.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
          Ready for Phase 2
        </div>
      </div>
    </main>
  );
}
