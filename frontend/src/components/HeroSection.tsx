import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

interface HeroSectionProps {
  onSignUpClick: () => void;
  onRequestDemoClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSignUpClick,
  onRequestDemoClick
}) => {
  const dynamicWords = [
    'increased productivity',
    'improved collaboration',
    'dynamic teams'
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % dynamicWords.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [dynamicWords.length]);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 bg-gradient-to-b from-white via-[#fcfdff] to-[#f8faff]">
      {/* Decorative background grid and soft glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-blue-50/50 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-50/40 rounded-full blur-2xl" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-red-50/30 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Dynamic Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15] min-h-[140px] sm:min-h-[160px] flex flex-col justify-center items-center">
            <span>Project management</span>
            <span>software built for</span>
            <span className="relative inline-block mt-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={dynamicWords[currentWordIndex]}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="inline-block text-[#0066D6] font-extrabold"
                >
                  {dynamicWords[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          {/* Three key value propositions with green checkmark circles */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-slate-800 font-medium text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
              <span>Plan your projects</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
              <span>Track work efficiently</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
              <span>Collaborate with global teams</span>
            </div>
          </div>

          {/* CTA Action Buttons */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onSignUpClick}
              id="hero-signup-btn"
              className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-[#E42525] hover:bg-[#cf1e1e] text-white text-base font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Sign Up Now
            </button>
            <button
              onClick={onRequestDemoClick}
              id="hero-demo-btn"
              className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-white border border-slate-300 hover:border-slate-500 text-slate-900 text-base font-bold uppercase tracking-wider shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              Request Demo
            </button>
          </div>

          {/* Forbes Quote with Laurel Wreaths */}
          <div className="mt-14 max-w-xl mx-auto flex items-center justify-center gap-4 text-slate-700">
            {/* Left Laurel */}
            <svg className="w-8 h-12 text-slate-400 shrink-0 opacity-70" viewBox="0 0 32 48" fill="none" stroke="currentColor">
              <path d="M16 4C14 10 10 18 4 22M16 12C12 18 8 26 4 32M16 22C13 28 9 36 6 42M16 44C16 38 18 20 20 12" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            <div className="text-center">
              <div className="font-serif font-black text-2xl tracking-wider text-slate-900 uppercase">
                Forbes
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 italic leading-relaxed">
                &ldquo;TaskForge is one of the easiest-to-use project management platforms with rich built-in features.&rdquo;
              </p>
            </div>

            {/* Right Laurel */}
            <svg className="w-8 h-12 text-slate-400 shrink-0 opacity-70 scale-x-[-1]" viewBox="0 0 32 48" fill="none" stroke="currentColor">
              <path d="M16 4C14 10 10 18 4 22M16 12C12 18 8 26 4 32M16 22C13 28 9 36 6 42M16 44C16 38 18 20 20 12" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Floating Interactive Widget Cards positioned at sides (as seen in video) */}
        {/* Left Floating Card: Project Manager & Status Report */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hidden xl:block absolute left-4 2xl:left-10 top-16 w-64 bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-xl p-4 text-xs select-none hover:shadow-2xl transition-all"
        >
          {/* User pill */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-emerald-100">
              PM
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs">Project Manager</div>
              <div className="text-[10px] text-slate-400">Team Lead</div>
            </div>
          </div>

          <div className="font-semibold text-slate-800 text-[11px] mb-2.5">
            Team project status report
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active
                </span>
                <span className="font-semibold text-slate-700">14</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[70%] h-full bg-emerald-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Completed
                </span>
                <span className="font-semibold text-slate-700">8</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[40%] h-full bg-amber-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" /> In Progress
                </span>
                <span className="font-semibold text-slate-700">19</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-cyan-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> On Hold
                </span>
                <span className="font-semibold text-slate-700">3</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[15%] h-full bg-rose-400 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" /> Open
                </span>
                <span className="font-semibold text-slate-700">5</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[25%] h-full bg-slate-400 rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Floating Card: Design & Task Progress */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="hidden xl:block absolute right-4 2xl:right-10 top-20 w-64 bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-xl p-4 text-xs select-none hover:shadow-2xl transition-all"
        >
          {/* Tag and Role */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-indigo-100">
              DE
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs">Design</div>
              <div className="text-[10px] text-slate-400">UI / UX Sprint</div>
            </div>
          </div>

          <div className="font-semibold text-slate-800 text-[11px] mb-1">
            Task progress
          </div>
          <div className="text-slate-900 font-bold text-xs">Martin Young</div>
          <div className="text-[10px] text-slate-500 mb-3 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>02/01/2024 to 14/01/2024</span>
          </div>

          {/* Donut progress ring + percentage */}
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-orange-500"
                  strokeDasharray="21, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-extrabold text-xs text-slate-800">21%</span>
            </div>

            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium text-[10px] border border-red-100">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span>02 days behind schedule</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
