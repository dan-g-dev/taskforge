import React from 'react';
import { Network, Bot, Cpu, Search, TrendingUp, Sparkles, CheckCircle } from 'lucide-react';

export const ConnectedIntelligence: React.FC = () => {
  const capabilities = [
    {
      title: 'Contextual Search',
      desc: 'Query project documentation, historical tasks, and git commits with natural language.'
    },
    {
      title: 'Predictive Monitoring',
      desc: 'Identify schedule variances and budget anomalies before they cause sprint delays.'
    },
    {
      title: 'Autonomous Execution',
      desc: 'Let AI agents auto-assign tickets, draft client progress notes, and close completed sprints.'
    }
  ];

  return (
    <div className="bg-[#080e1e] border-t border-b border-white/10 py-16 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* Left: Zia AI Connected Network Graphic */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600/30 via-indigo-600/40 to-cyan-500/30 p-[1.5px] flex items-center justify-center shadow-xl">
              <div className="w-full h-full bg-[#0d1730] rounded-3xl flex items-center justify-center relative">
                <Network className="w-12 h-12 text-cyan-400 animate-pulse" />
                {/* Orbiting dots */}
                <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
                <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-blue-400 ring-4 ring-blue-400/20" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Hub
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Connected Intelligence
              </h3>
            </div>
          </div>

          {/* Center / Right: Copy */}
          <div className="max-w-2xl">
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Make Projects and other apps agent-ready by connecting them to your favorite AI providers. Search, monitor, forecast, and execute work across apps.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> Zia AI Engine
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> ChatGPT
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> Azure OpenAI
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> Google Gemini
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
