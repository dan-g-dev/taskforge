import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FaqSection: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const faqs = [
    {
      id: 1,
      question: '1. What is project management software?',
      answer: 'Project management software is a digital tool designed to plan, track, and execute projects from start to finish, making it easier for individuals and businesses to organize tasks, manage budgets, and complete projects on time efficiently.'
    },
    {
      id: 2,
      question: '2. Why do businesses need project management software?',
      answer: 'Businesses need project management software to run their projects effectively. From planning tasks and monitoring progress, to managing resources and collaborating with teams, project management software gives you total visibility into your work, tailoring to unique business needs and helping them grow at scale.'
    },
    {
      id: 3,
      question: '3. What are the key features of project management software?',
      isDetailed: true,
      intro: 'The key features of project management software like TaskForge are namely:',
      points: [
        { title: 'Task Management', desc: 'Gantt charts, Task Lists, or Kanban boards can help prioritize tasks, organize work, and manage projects effectively.' },
        { title: 'Time tracking', desc: 'Submit time logs and monitor productivity with global stopwatch timers and automated timesheets.' },
        { title: 'Collaboration tools', desc: 'Bring comments, feeds, team forums, and interactive chat into a single unified space.' },
        { title: 'Resource Management', desc: 'Distribute workloads evenly across team members to prevent burnout and spot capacity gaps.' },
        { title: 'Automated Blueprints', desc: 'Enforce standardized approval stages and transition rules across project lifecycles.' }
      ]
    },
    {
      id: 4,
      question: '4. Can TaskForge be customized for different industries?',
      answer: 'Yes. TaskForge provides full end-to-end personalization. You can create custom fields, tailored status columns, industry-specific project templates, and automated workflows whether you are in construction, software development, creative marketing, or healthcare.'
    },
    {
      id: 5,
      question: '5. Is TaskForge suitable for small businesses as well as large enterprises?',
      answer: 'Absolutely. TaskForge is designed to scale dynamically. Small teams can get started immediately with intuitive task lists and milestone tracking, while enterprise organizations leverage advanced features like enterprise single sign-on (SSO), custom domain mapping, audit trails, and strict role-based access control.'
    },
  ];

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#fcfdff] border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Project Management Software FAQs
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden transition-all duration-200 shadow-2xs hover:shadow-xs"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-slate-900 cursor-pointer hover:text-[#0066D6] transition-colors"
                >
                  <span>{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isExpanded ? 'bg-blue-50 text-[#0066D6]' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-slate-100"
                    >
                      <div className="px-6 py-5 text-slate-600 text-sm sm:text-base leading-relaxed bg-slate-50/40">
                        {faq.isDetailed ? (
                          <div className="space-y-3">
                            <p className="font-medium text-slate-700">{faq.intro}</p>
                            <ul className="space-y-2.5 pl-2">
                              {faq.points?.map((pt) => (
                                <li key={pt.title} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#0066D6] mt-2 shrink-0" />
                                  <div>
                                    <strong className="text-slate-900">{pt.title}:</strong> {pt.desc}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p>{faq.answer}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
