import React from 'react';
import { ArrowRight, ShieldCheck, FolderGit2, Puzzle } from 'lucide-react';

export const StatsSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-24 bg-[#fcfdff] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <p className="text-xs sm:text-sm font-bold tracking-widest text-slate-400 uppercase mb-8">
          Trust TaskForge
        </p>

        {/* 3 Metric Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 max-w-4xl mx-auto">
          {/* Stat 1 */}
          <div className="space-y-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="text-5xl sm:text-6xl font-black text-[#0066D6] tracking-tight">
              4.5M+
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-800">
              Projects on TaskForge
            </div>
            <p className="text-xs text-slate-500">
              Delivered across 160+ countries worldwide
            </p>
          </div>

          {/* Stat 2 */}
          <div className="space-y-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="text-5xl sm:text-6xl font-black text-emerald-600 tracking-tight">
              50+
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-800">
              Integrations via marketplace
            </div>
            <p className="text-xs text-slate-500">
              Seamless connections with modern toolchains
            </p>
          </div>

          {/* Stat 3 */}
          <div className="space-y-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
            <div className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
              ISO
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-800">
              27001 enterprise-grade security
            </div>
            <p className="text-xs text-slate-500">
              SOC 2 Type II certified data protection
            </p>
          </div>
        </div>

        {/* Link below stats */}
        <div className="mt-10">
          <a
            href="#testimonials"
            className="inline-flex items-center gap-1.5 text-[#0066D6] hover:text-[#004e9c] font-bold text-base group transition-colors cursor-pointer"
          >
            <span>View customer stories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
};
