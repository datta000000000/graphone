import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { label: 'AI Companies', value: '1,250+', desc: 'Startups and labs' },
    { label: 'Investors', value: '420+', desc: 'VC funds and partners' },
    { label: 'AI Products', value: '600+', desc: 'Ecosystem deployments' },
    { label: 'Funding Rounds', value: '$84.2B+', desc: 'Capital flow tracked' },
    { label: 'News Articles', value: '480+', desc: 'Verified updates' },
  ];

  const offerings = [
    { title: 'AI Companies', desc: 'Profiles, valuations, key telemetry, and operational details.', icon: '🏢' },
    { title: 'Investors', desc: 'Capital allocators, round histories, and portfolio mappings.', icon: '💼' },
    { title: 'Products', desc: 'State-of-the-art coding tools, model weights, and AI apps.', icon: '⚙️' },
    { title: 'Funding', desc: 'Ledger of equity financing, dates, and cap table leads.', icon: '💰' },
    { title: 'Jobs', desc: 'Real-time AI and machine learning careers with filters.', icon: '🤝' },
    { title: 'News', desc: 'Curated ecosystem announcements and market indicators.', icon: '📰' },
  ];

  const features = [
    { title: 'Reliable Data', desc: 'Rigorous scanning of press assets, SEC filings, and official developer logs.', icon: '✅' },
    { title: 'AI Ecosystem Insights', desc: 'Map multi-dimensional node relationships between tools, labs, and investors.', icon: '🕸️' },
    { title: 'Investor Intelligence', desc: 'Track deal flow velocity, average check allocations, and cap table alignments.', icon: '📈' },
    { title: 'Product Discovery', desc: 'Uncover model releases, voice synthesizers, and developer utilities in real-time.', icon: '🔍' },
  ];

  const techStack = [
    { name: 'Next.js', desc: 'Server components framework', color: 'bg-black text-white' },
    { name: 'TypeScript', desc: 'Static type compiler safety', color: 'bg-blue-600 text-white' },
    { name: 'Tailwind CSS', desc: 'Premium style utilities', color: 'bg-teal-500 text-white' },
    { name: 'PostgreSQL', desc: 'Relational data store engine', color: 'bg-blue-900 text-white' },
    { name: 'Node.js', desc: 'High-performance runtime', color: 'bg-green-700 text-white' },
  ];

  const roadmap = [
    { title: 'AI Comparison Engine', desc: 'Side-by-side benchmark telemetry, API pricing indices, and latency charts.', badge: 'Q3 2026' },
    { title: 'Portfolio Net Asset Tracking', desc: 'Automated valuation adjustments and portfolio alerts for venture allocators.', badge: 'Q4 2026' },
    { title: 'Developer API Access', desc: 'High-speed REST and GraphQL feeds to power external dashboards and data pipelines.', badge: 'Q1 2027' },
    { title: 'Personalized Workspace Dashboards', desc: 'Custom watchlist telemetry, company triggers, and developer API alerts.', badge: 'Q2 2027' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F3EC] text-[#1F1F1F]">
      <Navbar />
      
      <main className="flex-grow space-y-24 py-16 sm:py-24">
        
        {/* Section 1: Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="brand" className="bg-[#C9A227] text-white uppercase px-3 py-1 text-[10px] font-extrabold tracking-wider border-none">
                Ecosystem Intelligence
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1F1F1F] tracking-tight leading-none">
                About <span className="text-[#C9A227]">GraphOne</span>
              </h1>
              <p className="text-base sm:text-lg text-[#6B6B6B] font-semibold leading-relaxed max-w-xl">
                GraphOne is the premium AI Intelligence Platform mapping the relationship dynamics, capital flows, and core technology stack of the global artificial intelligence economy in real-time.
              </p>
              <div className="flex gap-4">
                <Link 
                  href="/companies"
                  className="bg-[#C9A227] hover:bg-[#A67C00] text-white font-extrabold text-xs px-6 py-3 rounded-full shadow-luxury hover:shadow-luxury-hover transition-all duration-300"
                >
                  Explore Companies
                </Link>
                <Link 
                  href="/products"
                  className="bg-transparent border border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227]/5 font-extrabold text-xs px-6 py-3 rounded-full transition-all duration-300"
                >
                  Browse Products
                </Link>
              </div>
            </div>

            {/* Premium Animated AI Network Illustration (SVG Only) */}
            <div className="relative flex justify-center">
              <svg className="w-full max-w-md h-80" viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Orbit Circles */}
                <circle cx="200" cy="160" r="140" stroke="#C9A227" strokeWidth="1" strokeDasharray="4 6" className="opacity-20" />
                <circle cx="200" cy="160" r="80" stroke="#C9A227" strokeWidth="1" strokeDasharray="3 4" className="opacity-30" />
                
                {/* Network Connections */}
                <line x1="200" y1="40" x2="300" y2="100" stroke="#C9A227" strokeWidth="1.5" className="opacity-40" />
                <line x1="300" y1="100" x2="320" y2="220" stroke="#C9A227" strokeWidth="1.5" className="opacity-40" />
                <line x1="320" y1="220" x2="200" y2="280" stroke="#C9A227" strokeWidth="1.5" className="opacity-40" />
                <line x1="200" y1="280" x2="80" y2="220" stroke="#C9A227" strokeWidth="1.5" className="opacity-40" />
                <line x1="80" y1="220" x2="100" y2="100" stroke="#C9A227" strokeWidth="1.5" className="opacity-40" />
                <line x1="100" y1="100" x2="200" y2="40" stroke="#C9A227" strokeWidth="1.5" className="opacity-40" />

                <line x1="200" y1="160" x2="200" y2="40" stroke="#C9A227" strokeWidth="1" className="opacity-50" />
                <line x1="200" y1="160" x2="300" y2="100" stroke="#C9A227" strokeWidth="1" className="opacity-50" />
                <line x1="200" y1="160" x2="320" y2="220" stroke="#C9A227" strokeWidth="1" className="opacity-50" />
                <line x1="200" y1="160" x2="200" y2="280" stroke="#C9A227" strokeWidth="1" className="opacity-50" />
                <line x1="200" y1="160" x2="80" y2="220" stroke="#C9A227" strokeWidth="1" className="opacity-50" />
                <line x1="200" y1="160" x2="100" y2="100" stroke="#C9A227" strokeWidth="1" className="opacity-50" />

                {/* Nodes */}
                <circle cx="200" cy="160" r="12" fill="#C9A227" className="animate-pulse shadow-sm" />
                <circle cx="200" cy="40" r="6" fill="#1F1F1F" stroke="#C9A227" strokeWidth="2" />
                <circle cx="300" cy="100" r="6" fill="#1F1F1F" stroke="#C9A227" strokeWidth="2" />
                <circle cx="320" cy="220" r="6" fill="#1F1F1F" stroke="#C9A227" strokeWidth="2" />
                <circle cx="200" cy="280" r="6" fill="#1F1F1F" stroke="#C9A227" strokeWidth="2" />
                <circle cx="80" cy="220" r="6" fill="#1F1F1F" stroke="#C9A227" strokeWidth="2" />
                <circle cx="100" cy="100" r="6" fill="#1F1F1F" stroke="#C9A227" strokeWidth="2" />

                <circle cx="200" cy="160" r="6" fill="#FFFDF9" />
              </svg>
            </div>
          </div>
        </section>

        {/* Section 2: Our Mission */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 sm:p-12 border border-[#C9A227]/20 bg-[#FFFDF9] shadow-luxury rounded-[32px] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#C9A227]/5 rounded-bl-full pointer-events-none" />
            <h2 className="text-xl sm:text-2xl font-black text-[#1F1F1F] tracking-tight uppercase">
              Our Mission
            </h2>
            <p className="text-sm sm:text-base text-[#6B6B6B] font-semibold leading-relaxed">
              Our mission is to bring ultimate transparency and data-driven intelligence to the rapidly expanding AI landscape. By quantifying the connections between pioneering companies, venture allocators, state-of-the-art products, and capital transactions, we enable founders, developers, and investors to navigate the frontier of artificial intelligence with unmatched clarity.
            </p>
          </Card>
        </section>

        {/* Section 3: What GraphOne Offers */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-black text-[#1F1F1F] uppercase tracking-wider">What GraphOne Offers</h2>
            <p className="text-xs text-[#6B6B6B] font-semibold">The complete map of artificial intelligence market metrics and developments.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {offerings.map((off) => (
              <Card key={off.title} className="p-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 rounded-[24px] space-y-3">
                <div className="text-2xl">{off.icon}</div>
                <h3 className="font-extrabold text-sm text-[#1F1F1F]">{off.title}</h3>
                <p className="text-xs text-[#6B6B6B] font-semibold leading-relaxed">{off.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 4: Platform Statistics */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-black text-[#1F1F1F] uppercase tracking-wider">Platform Statistics</h2>
            <p className="text-xs text-[#6B6B6B] font-semibold">Quantified database indices tracking the global AI industry scale.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {stats.map((s) => (
              <Card key={s.label} className="p-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury text-center rounded-[24px] space-y-1">
                <p className="text-2xl sm:text-3xl font-black text-[#C9A227] tracking-tight">{s.value}</p>
                <p className="font-extrabold text-[#1F1F1F] text-[10px] uppercase tracking-wider">{s.label}</p>
                <p className="text-[9px] text-[#6B6B6B] font-medium">{s.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 5: Why Choose GraphOne */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-black text-[#1F1F1F] uppercase tracking-wider">Why Choose GraphOne</h2>
            <p className="text-xs text-[#6B6B6B] font-semibold">Engineered to deliver high-fidelity signals and structured mappings.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4 p-6 border border-[#C9A227]/10 bg-[#FFFDF9]/60 rounded-[24px] shadow-sm">
                <div className="text-xl shrink-0 mt-0.5">{f.icon}</div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-[#1F1F1F]">{f.title}</h3>
                  <p className="text-xs text-[#6B6B6B] font-semibold leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Technology Stack */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-black text-[#1F1F1F] uppercase tracking-wider">Technology Stack</h2>
            <p className="text-xs text-[#6B6B6B] font-semibold">Engineered with cutting-edge tools to secure performance, safety, and scale.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {techStack.map((tech) => (
              <Card key={tech.name} className="p-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury text-center rounded-[24px] flex flex-col justify-between items-center space-y-3">
                <Badge className={`px-3 py-1 font-bold text-xs rounded-lg ${tech.color}`}>
                  {tech.name}
                </Badge>
                <p className="text-[10px] text-[#6B6B6B] font-semibold leading-relaxed">{tech.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 7: Future Roadmap */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-black text-[#1F1F1F] uppercase tracking-wider">Future Roadmap</h2>
            <p className="text-xs text-[#6B6B6B] font-semibold">Upcoming integrations and enterprise features planned for GraphOne.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {roadmap.map((step) => (
              <Card key={step.title} className="p-6 border border-[#C9A227]/15 bg-[#FFFDF9] shadow-luxury rounded-[24px] flex flex-col justify-between space-y-4 relative">
                <div className="space-y-2">
                  <Badge variant="brand" className="bg-[#C9A227]/10 text-[#C9A227] px-2 py-0.5 text-[9px] font-extrabold uppercase border-none">
                    {step.badge}
                  </Badge>
                  <h3 className="font-extrabold text-sm text-[#1F1F1F] leading-tight">{step.title}</h3>
                </div>
                <p className="text-xs text-[#6B6B6B] font-semibold leading-relaxed">{step.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 8: Professional Footer CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 text-center border border-[#C9A227]/30 bg-[#FFFDF9] shadow-luxury rounded-[32px] space-y-6 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C9A227]/5 rounded-tr-full pointer-events-none" />
            <h2 className="text-2xl sm:text-3xl font-black text-[#1F1F1F] tracking-tight uppercase">
              Explore the Future of AI with GraphOne
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] font-semibold max-w-md mx-auto">
              Get comprehensive access to startups, vc funding ledgers, release updates, and career matching indexes.
            </p>
            <div>
              <Link 
                href="/" 
                className="inline-block bg-[#C9A227] hover:bg-[#A67C00] text-white font-extrabold text-xs px-8 py-3.5 rounded-full transition-all duration-300 shadow-luxury hover:shadow-luxury-hover"
              >
                Return to Dashboard
              </Link>
            </div>
          </Card>
        </section>

      </main>

      <Footer />
    </div>
  );
}
