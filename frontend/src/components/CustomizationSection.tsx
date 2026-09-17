import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Layers, 
  Workflow, 
  CheckSquare, 
  ListOrdered, 
  Hash, 
  Mail, 
  Link, 
  DollarSign, 
  Percent, 
  Users, 
  Check,
  Plus
} from 'lucide-react';

export const CustomizationSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customize' | 'automate'>('customize');
  const [selectedField, setSelectedField] = useState<string>('Pick List');
  const [activeStatus, setActiveStatus] = useState<'Open' | 'In Review' | 'Approved' | 'Closed'>('Open');

  const customFields = [
    { name: 'Pick List', icon: ListOrdered },
    { name: 'Currency', icon: DollarSign },
    { name: 'User List', icon: Users },
    { name: 'Decimal', icon: Hash },
    { name: 'Checkbox', icon: CheckSquare },
    { name: 'URL', icon: Link },
    { name: 'Multi-select', icon: Layers },
    { name: 'Percentage', icon: Percent },
    { name: 'Mail', icon: Mail },
  ];

  return (
    <section id="customization" className="py-20 lg:py-28 bg-[#f9fafc] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toggle Pills at the Top */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
            <button
              onClick={() => setActiveTab('customize')}
              className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'customize'
                  ? 'bg-[#0066D6] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Customize projects
            </button>
            <button
              onClick={() => setActiveTab('automate')}
              className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'automate'
                  ? 'bg-[#0066D6] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Automate workflows
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'customize' ? (
            <motion.div
              key="customize-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
            >
              {/* Left Column: Heading + Copy + Testimonial */}
              <div className="lg:col-span-5 space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.18]">
                  Customize your experience
                </h2>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  Build your projects from end-to-end to capture unique requirements. Create personalized fields, modules, statuses, and workflows to manage and track industry-specific work metrics.
                </p>

                <div>
                  <a
                    href="#customization"
                    className="inline-flex items-center gap-1.5 text-[#0066D6] hover:text-[#004e9c] font-bold text-base group transition-colors cursor-pointer"
                  >
                    <span>Learn more about project customization</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Hassan Al-aidy Testimonial */}
                <div className="pt-6">
                  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-6 relative hover:shadow-xl transition-all">
                    <p className="text-slate-800 font-medium italic text-base leading-relaxed">
                      &ldquo;TaskForge helped us to achieve about 300% growth rate for our business.&rdquo;
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-slate-200 overflow-hidden ring-2 ring-blue-200 shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                          alt="Hassan Al-aidy"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Hassan Al-aidy</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-blue-700 font-bold text-xs tracking-tight">DeepSeek Ops</span>
                          <span className="text-[11px] text-slate-400">• Operations Director</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Custom Field Builder Visual */}
              <div className="lg:col-span-7">
                <div className="relative rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-2xl overflow-hidden">
                  
                  {/* Photo cutout underlay */}
                  <div className="absolute top-0 right-0 w-80 h-full opacity-20 pointer-events-none hidden md:block">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80"
                      alt="Project Customizer"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Layout simulating custom field palette on top of a task form */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 relative z-10">
                    
                    {/* Simulated Task Card Form */}
                    <div className="sm:col-span-7 bg-slate-50/90 rounded-xl border border-slate-200 p-4 space-y-3.5 shadow-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Task Details Form</span>
                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">Custom Layout</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600">Owner</label>
                        <div className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">JD</div>
                          <span>John Doe (Tech Lead)</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-600">Status</label>
                          <select 
                            value={activeStatus} 
                            onChange={(e: any) => setActiveStatus(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 font-medium"
                          >
                            <option value="Open">Open</option>
                            <option value="In Review">In Review</option>
                            <option value="Approved">Approved</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-600">Due Date</label>
                          <div className="bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-700">
                            15 Oct 2026
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-600">Rate Per Hour ($)</label>
                          <div className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 font-semibold flex items-center justify-between">
                            <span>40.00</span>
                            <DollarSign className="w-3 h-3 text-slate-400" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-600">Billing Type</label>
                          <div className="bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-700">
                            Billable
                          </div>
                        </div>
                      </div>

                      {/* Drop target highlight */}
                      <div className="border-2 border-dashed border-blue-400 rounded-lg p-2.5 bg-blue-50/50 text-center">
                        <span className="text-xs text-blue-700 font-medium flex items-center justify-center gap-1">
                          <Plus className="w-3.5 h-3.5" /> Drag & Drop Field Here
                        </span>
                      </div>
                    </div>

                    {/* Custom Field Palette (Authentic to video 00:15) */}
                    <div className="sm:col-span-5 bg-white rounded-xl border border-slate-200 shadow-md p-3.5 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-bold text-slate-900">Field Palette</span>
                        <span className="text-[10px] text-slate-400 font-medium">9 Types</span>
                      </div>

                      <div className="grid grid-cols-1 gap-1.5">
                        {customFields.map((field) => {
                          const Icon = field.icon;
                          const isSelected = selectedField === field.name;
                          return (
                            <button
                              key={field.name}
                              onClick={() => setSelectedField(field.name)}
                              className={`flex items-center justify-between p-1.5 px-2 rounded-md text-xs font-medium transition-all text-left cursor-pointer ${
                                isSelected
                                  ? 'bg-[#0066D6] text-white shadow-xs font-semibold'
                                  : 'hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                                <span>{field.name}</span>
                              </div>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="automate-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
            >
              {/* Workflow Blueprint View */}
              <div className="lg:col-span-5 space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.18]">
                  Automate workflows with Blueprint
                </h2>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  Design sequential process blueprints that enforce compliance at every turn. Guide team members through required fields, automatic SLA escalations, and multi-tier approval chains.
                </p>

                <div>
                  <a
                    href="#customization"
                    className="inline-flex items-center gap-1.5 text-[#0066D6] hover:text-[#004e9c] font-bold text-base group transition-colors cursor-pointer"
                  >
                    <span>Explore Blueprint Automation</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Interactive Blueprint Flowchart */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xl space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-bold text-sm text-slate-900">Sprint Task Lifecycle Blueprint</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Automated</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                    {/* Node 1 */}
                    <div className="w-full sm:w-auto p-4 rounded-xl border-2 border-blue-600 bg-blue-50/60 text-center shadow-xs">
                      <div className="text-[10px] font-bold uppercase text-blue-600">Stage 1</div>
                      <div className="text-sm font-bold text-slate-900 mt-1">Submitted</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Check mandatory specs</div>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-400 rotate-90 sm:rotate-0" />

                    {/* Node 2 */}
                    <div className="w-full sm:w-auto p-4 rounded-xl border border-slate-200 bg-white text-center shadow-xs">
                      <div className="text-[10px] font-bold uppercase text-slate-400">Stage 2</div>
                      <div className="text-sm font-bold text-slate-900 mt-1">Under Review</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">PM Approval</div>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-400 rotate-90 sm:rotate-0" />

                    {/* Node 3 */}
                    <div className="w-full sm:w-auto p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 text-center shadow-xs">
                      <div className="text-[10px] font-bold uppercase text-emerald-600">Stage 3</div>
                      <div className="text-sm font-bold text-slate-900 mt-1">Production Ready</div>
                      <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Auto-deploy trigger</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Enforces role-based permissions so only authorized QA leads can transition to Production Ready.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
