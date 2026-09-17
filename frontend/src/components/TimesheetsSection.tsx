import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Pause, RotateCcw, Clock, CheckCircle, Plus } from 'lucide-react';

export const TimesheetsSection: React.FC = () => {
  // Live interactive timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(12845); // 03:34:05

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="timesheets" className="py-20 lg:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Copy + Testimonial */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.18]">
              Log every minute with timesheets
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Log billable and non-billable hours with the TaskForge timesheet module. Record every minute of your hard work, either manually or with timers, and our built-in integration with TaskForge Invoice will automatically generate invoices from your timesheets.
            </p>

            <div>
              <a
                href="#timesheets"
                className="inline-flex items-center gap-1.5 text-[#0066D6] hover:text-[#004e9c] font-bold text-base group transition-colors cursor-pointer"
              >
                <span>Learn more about time tracking</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Testimonial Card (Vedantu - Harisharan Luthra) */}
            <div className="pt-6">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-6 relative hover:shadow-xl transition-all">
                <p className="text-slate-800 font-medium italic text-base leading-relaxed">
                  &ldquo;Working remotely was challenging until we found TaskForge.&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-200 overflow-hidden ring-2 ring-orange-200 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                      alt="Harisharan Luthra"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Harisharan Luthra</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-orange-600 font-bold text-xs tracking-tight">Vedantu</span>
                      <span className="text-[11px] text-slate-400">• EdTech Operations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Timesheet Calendar / Grid Visual */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-6 shadow-xl overflow-hidden">
              
              {/* Floating Live Global Timer Bar */}
              <div className="mb-4 bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full ${isTimerRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                  <div>
                    <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Active Timesheet Timer</div>
                    <div className="text-xs font-semibold text-slate-800">Sprint 14: Client Portal Revamp</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg sm:text-xl font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                    {formatTimer(timerSeconds)}
                  </span>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`p-2 rounded-lg text-white font-semibold transition-all cursor-pointer ${
                      isTimerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                    title={isTimerRunning ? 'Pause Timer' : 'Start Timer'}
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setTimerSeconds(0)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Timesheet Calendar Visual Grid (Exact layout from video 00:13) */}
              <div className="relative bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 select-none">
                
                {/* Header Month / Week Info */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#0066D6]" />
                    <span className="font-bold text-sm text-slate-800">Timesheets Summary</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    JUN 24
                  </span>
                </div>

                {/* The 4x4 or 5-col Date Grid */}
                <div className="relative grid grid-cols-4 gap-2 sm:gap-3 text-center min-h-[340px]">
                  {/* Background Grid Cells */}
                  {[
                    { day: '10', block: null },
                    { day: '11', block: null },
                    { day: '12', block: null },
                    { day: '13', block: { time: '5:45', color: 'bg-purple-600', label: 'Backend API' } },
                    { day: '17', block: { time: '8:00', color: 'bg-rose-500', label: 'Feature Dev' } },
                    { day: '18', block: null },
                    { day: '19', block: { time: '8:00', color: 'bg-emerald-600', label: 'Bug Fixes' } },
                    { day: '20', block: null },
                    { day: '24', block: null },
                    { day: '25', block: { time: '3:30', color: 'bg-[#0066D6]', label: 'Client Sync' } },
                    { day: '26', block: null },
                    { day: '27', block: null },
                  ].map((cell, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-100 rounded-lg p-2 min-h-[90px] flex flex-col justify-between bg-slate-50/40 relative hover:border-blue-200 transition-colors"
                    >
                      <span className="text-xs font-semibold text-slate-400 text-left">{cell.day}</span>
                      
                      {cell.block && (
                        <div className={`w-full py-2 px-1.5 rounded-md ${cell.block.color} text-white font-bold text-xs sm:text-sm shadow-xs`}>
                          <div className="tracking-tight">{cell.block.time}</div>
                          <div className="text-[9px] opacity-90 truncate font-normal">{cell.block.label}</div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Overlaid Team Member Cutout Graphic as seen in the video frame 00:13 */}
                  <div className="absolute top-8 left-8 sm:left-14 w-44 sm:w-52 h-64 rounded-xl overflow-hidden shadow-2xl border-2 border-white pointer-events-none transform -rotate-1 hidden sm:block">
                    <img
                      src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&auto=format&fit=crop&q=80"
                      alt="Productive team member"
                      className="w-full h-full object-cover filter contrast-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white text-[10px] text-left font-medium">
                      Automated invoicing via TaskForge Invoice
                    </div>
                  </div>
                </div>

                {/* Bottom summary tally */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-4">
                    <span>Total Logged: <strong className="text-slate-900">25 hrs 15 mins</strong></span>
                    <span>Billable: <strong className="text-emerald-700 font-bold">21 hrs 45 mins</strong></span>
                  </div>
                  <button className="text-[#0066D6] hover:underline font-semibold flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Hours</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
