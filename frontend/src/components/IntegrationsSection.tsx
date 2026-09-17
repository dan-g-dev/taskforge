import React, { useState } from 'react';
import { ArrowRight, Check, ExternalLink, Search } from 'lucide-react';

export const IntegrationsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'taskforge' | 'dev' | 'storage' | 'productivity'>('all');
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  const apps = [
    {
      name: 'TaskForge CRM',
      category: 'taskforge',
      symbol: 'CRM',
      color: 'bg-red-50 text-red-600 border-red-200',
      description: 'Sync client deals with project milestones'
    },
    {
      name: 'Gitea',
      category: 'dev',
      symbol: 'GIT',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Link code commits and PRs directly to issues'
    },
    {
      name: 'ServiceNow',
      category: 'productivity',
      symbol: 'NOW',
      color: 'bg-sky-50 text-sky-700 border-sky-200',
      description: 'Synchronize enterprise IT tickets seamlessly'
    },
    {
      name: 'TaskForge Flow',
      category: 'taskforge',
      symbol: 'FLOW',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      description: 'Build no-code custom event automations'
    },
    {
      name: 'Chrome',
      category: 'productivity',
      symbol: 'CR',
      color: 'bg-yellow-50 text-amber-600 border-amber-200',
      description: 'Add tasks and log time directly from browser'
    },
    {
      name: 'Slack',
      category: 'productivity',
      symbol: '#',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'Receive real-time task alerts and reply in chat'
    },
    {
      name: 'Zapier',
      category: 'productivity',
      symbol: 'ZAP',
      color: 'bg-orange-50 text-orange-600 border-orange-200',
      description: 'Connect with 5,000+ web apps and triggers'
    },
    {
      name: 'Dropbox',
      category: 'storage',
      symbol: 'DBX',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      description: 'Attach cloud files and folders to tasks'
    },
    {
      name: 'GitHub',
      category: 'dev',
      symbol: 'GH',
      color: 'bg-slate-100 text-slate-800 border-slate-300',
      description: 'Associate commits and branch updates to tasks'
    },
    {
      name: 'Box',
      category: 'storage',
      symbol: 'BOX',
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      description: 'Secure enterprise cloud storage integration'
    },
    {
      name: 'Office 365',
      category: 'productivity',
      symbol: 'O365',
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      description: 'Sync Outlook calendar events and Excel reports'
    },
    {
      name: 'GitLab',
      category: 'dev',
      symbol: 'GL',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'Continuous deployment tracking inside tickets'
    },
  ];

  const filteredApps = activeCategory === 'all' 
    ? apps 
    : apps.filter(app => app.category === activeCategory);

  return (
    <section id="integrations" className="py-20 lg:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading + Copy + Filters */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.18]">
              Integrate with your favorite apps
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              TaskForge gives you the added advantage of several other TaskForge apps and third party apps through seamless integrations.
            </p>

            <div>
              <a
                href="#integrations"
                className="inline-flex items-center gap-1.5 text-[#0066D6] hover:text-[#004e9c] font-bold text-base group transition-colors cursor-pointer"
              >
                <span>More Integrations</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Category Filter Pills */}
            <div className="pt-4 flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Apps' },
                { id: 'taskforge', label: 'TaskForge Suite' },
                { id: 'dev', label: 'Developer & Git' },
                { id: 'storage', label: 'Cloud Storage' },
                { id: 'productivity', label: 'Productivity' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive App Tiles Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-inner">
              {filteredApps.map((app) => {
                const isHovered = hoveredApp === app.name;
                return (
                  <div
                    key={app.name}
                    onMouseEnter={() => setHoveredApp(app.name)}
                    onMouseLeave={() => setHoveredApp(null)}
                    className="relative bg-white rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center text-center h-28 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                  >
                    {/* App Symbol / Icon badge */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border ${app.color} mb-2 shadow-2xs group-hover:scale-105 transition-transform`}>
                      {app.symbol}
                    </div>

                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#0066D6] transition-colors">
                      {app.name}
                    </span>

                    {/* Popover description on hover */}
                    {isHovered && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-900 text-white text-[11px] rounded-lg p-2 shadow-xl pointer-events-none z-20 animate-in fade-in zoom-in-95">
                        <p>{app.description}</p>
                        <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
