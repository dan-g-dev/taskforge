import React from 'react';
import { ArrowRight, Handshake, Store, Layers, Sparkles } from 'lucide-react';

export const ResourceCards: React.FC = () => {
  const cards = [
    {
      title: 'Become a Partner',
      desc: 'Join us to begin a mutually rewarding partnership program.',
      badge: 'Partner Program',
      icon: Handshake,
      linkText: 'Learn More',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: 'Explore Marketplace for TaskForge',
      desc: 'Install extensions that add new features to TaskForge.',
      badge: 'Marketplace',
      icon: Store,
      linkText: 'Explore Extensions',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'TaskForge Sprints',
      desc: 'A comprehensive planning and tracking tool for Scrum teams.',
      badge: 'Agile Product',
      icon: Layers,
      linkText: 'Explore Sprints',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 hover:shadow-xl hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${card.color} mb-5 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0066D6] transition-colors leading-snug">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-sm font-bold text-[#0066D6] group-hover:text-blue-800 transition-colors">
                  <span>{card.linkText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
