import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Bot, Zap, MessageSquare, Check, RefreshCw, Layers } from 'lucide-react';

export const AiSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assistant' | 'productivity' | 'communication'>('assistant');
  const [selectedProvider, setSelectedProvider] = useState<'Zia' | 'Gemini' | 'ChatGPT'>('Zia');
  const [selectedTopic, setSelectedTopic] = useState('Website Redesign & Cloud Migration');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<string[]>([
    'Conduct stakeholder user-journey interviews and UX audit',
    'Benchmark responsive load speeds across mobile devices',
    'Set up automated CI/CD pipeline in Google Cloud Run'
  ]);

  const tabs = [
    {
      id: 'assistant' as const,
      title: 'Intelligent Assistant',
      desc: 'Get more done with AI that can fully understand the context of your business.',
      icon: Bot
    },
    {
      id: 'productivity' as const,
      title: 'Maximize Productivity',
      desc: 'Auto-generate granular task checklists, predict completion schedules, and detect project bottlenecks.',
      icon: Zap
    },
    {
      id: 'communication' as const,
      title: 'Communicate Effectively',
      desc: 'Draft executive summary digests, synthesize comment discussions, and broadcast project updates in any language.',
      icon: MessageSquare
    },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      if (selectedTopic.includes('Website')) {
        setGeneratedTasks([
          'Create high-fidelity Tailwind components for hero & pricing',
          'Optimize image assets with next-gen WebP & CDN caching',
          'Conduct WCAG 2.1 AA accessibility audit & keyboard testing',
          'Configure Google Analytics 4 & conversion funnels'
        ]);
      } else {
        setGeneratedTasks([
          `Prepare initial technical blueprint for ${selectedTopic}`,
          `Define scope deliverables & assign milestone owners`,
          `Establish team budget and billable hour limits`,
          `Set up recurring weekly standup sync in TaskForge`
        ]);
      }
      setIsGenerating(false);
    }, 600);
  };

  return (
    <section id="ai-section" className="py-20 lg:py-28 bg-[#0b1329] text-white overflow-hidden relative">
      {/* Background radial starfield effects */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Central Glowing Zia Star / Emblem */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-600 to-cyan-400 p-[2px] shadow-lg shadow-purple-500/25">
              <div className="w-full h-full bg-[#0b1329] rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
            </div>
            {/* Soft pulse ring */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-500 to-cyan-500 opacity-20 blur-md -z-10" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-2xl">
            AI that works hand-in-hand with your team
          </h2>
        </div>

        {/* 2-Column interactive showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: 3 Pillar Tabs */}
          <div className="lg:col-span-5 space-y-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/10 border-blue-400/50 shadow-lg backdrop-blur-md'
                      : 'bg-white/5 border-white/10 hover:bg-white/[0.07] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-[#0066D6] text-white' : 'bg-white/10 text-slate-300'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className={`text-lg sm:text-xl font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {tab.title}
                    </h3>
                  </div>

                  {isActive && (
                    <p className="mt-3 text-sm text-slate-300 leading-relaxed animate-in fade-in duration-200">
                      {tab.desc}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Interactive AI Prompt & Task Generator Studio */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/20 bg-[#131c38]/90 backdrop-blur-xl p-5 sm:p-7 shadow-2xl space-y-5">
              
              {/* Header Navigation */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                <div className="flex items-center gap-3 text-slate-300">
                  <span className="cursor-pointer hover:text-white">Add Task</span>
                  <span>|</span>
                  <span className="cursor-pointer hover:text-white">Add Task List</span>
                  <span>|</span>
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Suggestion for Task
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                  Zia Engine v4.2
                </span>
              </div>

              {/* Suggestion Card (Authentic to video 00:17) */}
              <div className="bg-[#0b1329]/80 rounded-xl border border-white/10 p-4 space-y-3">
                <div className="text-xs text-slate-400">
                  Type <span className="text-cyan-400 font-mono font-bold">$</span> or use the options below to insert context variables:
                </div>

                {/* Prompt generator input */}
                <div className="bg-white/5 border border-white/15 rounded-lg p-3">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Generate task based on:
                  </div>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full bg-[#131c38] text-white border border-white/20 rounded px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  >
                    <option value="Website Redesign & Cloud Migration">Project: Website Redesign & Cloud Migration</option>
                    <option value="Mobile App Launch Sprint 12">Project: Mobile App Launch Sprint 12</option>
                    <option value="Q3 Enterprise Security Audit">Project: Q3 Enterprise Security Audit</option>
                    <option value="Customer Onboarding Automation">Project: Customer Onboarding Automation</option>
                  </select>
                </div>

                {/* AI Model provider switch */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 text-[11px]">Provider:</span>
                    {(['Zia', 'Gemini', 'ChatGPT'] as const).map((prov) => (
                      <button
                        key={prov}
                        onClick={() => setSelectedProvider(prov)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                          selectedProvider === prov
                            ? 'bg-[#0066D6] text-white shadow-xs'
                            : 'bg-white/10 text-slate-300 hover:bg-white/15'
                        }`}
                      >
                        {prov}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Generate Content</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Generated Output Preview List */}
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Suggested Actionable Tasks ({generatedTasks.length})</span>
                  <span className="text-emerald-400 font-medium">Ready to import</span>
                </div>

                <div className="space-y-1.5">
                  {generatedTasks.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/[0.08] transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                        <span className="text-slate-200">{t}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">Priority: High</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
