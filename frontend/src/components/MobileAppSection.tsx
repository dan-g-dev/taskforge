import React from 'react';
import { ArrowRight, QrCode, Smartphone, Apple, Play, CheckCircle, Clock, AlertTriangle, ChevronRight } from 'lucide-react';

export const MobileAppSection: React.FC = () => {
  return (
    <section id="mobile-app" className="py-20 lg:py-28 bg-[#004CD8] text-white overflow-hidden relative">
      {/* Soft gradient background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-20 top-1/4 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute left-10 bottom-10 w-80 h-80 bg-blue-400/20 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: QR Code + Copy + Store Badges */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* QR Code Card */}
            <div className="inline-flex items-center gap-4 bg-white text-slate-900 p-3.5 rounded-2xl shadow-xl">
              {/* Generated QR visual */}
              <div className="w-16 h-16 bg-white p-1 rounded-xl border border-slate-200 flex items-center justify-center shrink-0">
                <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                  {/* Outer corner top-left */}
                  <rect x="0" y="0" width="28" height="28" rx="4" />
                  <rect x="5" y="5" width="18" height="18" fill="white" rx="2" />
                  <rect x="9" y="9" width="10" height="10" />
                  {/* Outer corner top-right */}
                  <rect x="72" y="0" width="28" height="28" rx="4" />
                  <rect x="77" y="5" width="18" height="18" fill="white" rx="2" />
                  <rect x="81" y="9" width="10" height="10" />
                  {/* Outer corner bottom-left */}
                  <rect x="0" y="72" width="28" height="28" rx="4" />
                  <rect x="5" y="77" width="18" height="18" fill="white" rx="2" />
                  <rect x="9" y="81" width="10" height="10" />
                  {/* Data dots */}
                  <rect x="36" y="8" width="8" height="8" />
                  <rect x="48" y="14" width="12" height="6" />
                  <rect x="36" y="36" width="12" height="12" />
                  <rect x="56" y="44" width="8" height="16" />
                  <rect x="72" y="38" width="12" height="8" />
                  <rect x="40" y="72" width="14" height="8" />
                  <rect x="62" y="72" width="8" height="18" />
                  <rect x="78" y="60" width="12" height="10" />
                </svg>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-700">Scan & Download</div>
                <div className="text-xs text-slate-600 mt-0.5">Instant mobile access for iOS & Android</div>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Mobile projects for mobile teams
            </h2>

            <p className="text-base sm:text-lg text-blue-100 max-w-xl leading-relaxed">
              Stay aligned and respond in real-time from anywhere. Check milestones, log timesheet entries with one tap, and collaborate with your team while on the go.
            </p>

            {/* App Store / Play Store Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#mobile-app"
                className="flex items-center gap-3 bg-black hover:bg-slate-950 text-white px-5 py-2.5 rounded-xl border border-white/20 shadow-md transition-all cursor-pointer"
              >
                <Apple className="w-6 h-6 shrink-0" />
                <div className="text-left">
                  <div className="text-[10px] uppercase font-semibold text-slate-300 leading-none">Download on the</div>
                  <div className="text-sm font-bold tracking-tight leading-tight">App Store</div>
                </div>
              </a>

              <a
                href="#mobile-app"
                className="flex items-center gap-3 bg-black hover:bg-slate-950 text-white px-5 py-2.5 rounded-xl border border-white/20 shadow-md transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current shrink-0" />
                <div className="text-left">
                  <div className="text-[10px] uppercase font-semibold text-slate-300 leading-none">Get it on</div>
                  <div className="text-sm font-bold tracking-tight leading-tight">Google Play</div>
                </div>
              </a>

              <a
                href="#mobile-app"
                className="inline-flex items-center gap-1.5 text-white hover:text-blue-200 font-bold text-sm ml-2 group transition-colors cursor-pointer"
              >
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

          </div>

          {/* Right Column: Smartphone UI Mockup (Authentic to video 00:41) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-[300px] sm:w-[330px] rounded-[36px] bg-slate-950 p-3 shadow-2xl border-4 border-slate-800 relative">
              {/* Speaker notch */}
              <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-2" />

              {/* Mobile Screen */}
              <div className="bg-white rounded-[26px] overflow-hidden text-slate-900 shadow-inner">
                
                {/* Mobile App Header */}
                <div className="bg-[#004CD8] text-white p-4 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs tracking-wider">TaskForge</span>
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                      JD
                    </div>
                  </div>
                  <div className="mt-2 text-sm font-bold">Zylker Redesign</div>
                </div>

                {/* 3 Mobile Metric Badges */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-200 bg-slate-50 text-center py-2.5 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Tasks</div>
                    <div className="font-bold text-slate-900 text-sm">16</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Timesheet</div>
                    <div className="font-bold text-slate-900 text-sm">2</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium">Global Timer</div>
                    <div className="font-bold text-emerald-600 text-sm">Running</div>
                  </div>
                </div>

                {/* Task Categories List (Exact items from video!) */}
                <div className="p-4 space-y-2 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    All Items
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-slate-800">All Tasks</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-slate-800">My Tasks</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold text-slate-800">My Tasks Due Today</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* Overdue Tasks with 99+ Badge */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/60 border border-red-100">
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="font-semibold text-red-950">Overdue Tasks</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[10px]">
                      99+
                    </span>
                  </div>
                </div>

                {/* Bottom navigation pill bar */}
                <div className="p-3 bg-slate-100 flex items-center justify-around border-t border-slate-200 text-slate-500 text-[10px]">
                  <span className="font-bold text-[#004CD8]">Feed</span>
                  <span>Tasks</span>
                  <span>Timesheets</span>
                  <span>More</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
