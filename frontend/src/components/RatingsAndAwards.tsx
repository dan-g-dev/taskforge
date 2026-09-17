import React from 'react';
import { Star, ArrowRight, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const RatingsAndAwards: React.FC = () => {
  const reviews = [
    {
      platform: 'Capterra',
      rating: '4.4 / 5',
      reviewsCount: '3,800+ reviews',
      color: 'text-amber-500'
    },
    {
      platform: 'GetApp',
      rating: '4.4 / 5',
      reviewsCount: '2,400+ reviews',
      color: 'text-amber-500'
    },
    {
      platform: 'App Store',
      rating: '4.7 / 5',
      reviewsCount: '15,000+ ratings',
      color: 'text-amber-500'
    }
  ];

  const badges = [
    { name: 'Best Performer', org: 'SourceForge', year: '2024', color: 'bg-emerald-600' },
    { name: 'FrontRunners', org: 'Software Advice', year: '2024', color: 'bg-indigo-600' },
    { name: 'Best Software', org: 'G2 Crowd', year: '2024', color: 'bg-rose-600' },
    { name: 'Leader', org: 'G2 Grid Spring', year: '2024', color: 'bg-blue-600' },
    { name: 'Top Rated', org: 'TrustRadius', year: '2024', color: 'bg-purple-600' },
    { name: 'Shortlist', org: 'Capterra', year: '2024', color: 'bg-amber-600' },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Featured Customer Story (TurningWest - Dr. Steven Goodwin) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-gradient-to-br from-[#0c4033] to-[#06241c] text-white p-8 sm:p-10 shadow-2xl overflow-hidden">
              
              {/* Decorative Laurel Ribbon Badge */}
              <div className="absolute top-6 right-6 w-20 h-20 rounded-full border border-emerald-400/30 flex flex-col items-center justify-center text-center p-1 rotate-12 opacity-80 pointer-events-none">
                <span className="text-[8px] font-bold text-emerald-300 uppercase tracking-widest">G2 Best</span>
                <span className="text-xs font-black text-white">SOFTWARE</span>
                <span className="text-[8px] font-bold text-emerald-300">2024</span>
              </div>

              <div className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-4">
                Featured Customer Story
              </div>

              <blockquote className="text-xl sm:text-2xl font-semibold leading-snug text-slate-100">
                &ldquo;Our presence is now completely virtual. We save a ton of money using TaskForge and appreciate that TaskForge continues to evolve and improve.&rdquo;
              </blockquote>

              <div className="mt-8 pt-6 border-t border-emerald-500/20 flex items-center justify-between">
                <div>
                  <div className="font-bold text-base text-white">Dr. Steven Goodwin</div>
                  <div className="text-sm text-emerald-300 font-medium">CEO, TurningWest</div>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="#testimonials"
                  className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-white font-bold text-sm group transition-colors cursor-pointer"
                >
                  <span>Read full story</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Rated by the finest + Award Badges */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Rated by the finest.
              </h2>
              <p className="mt-2 text-base text-slate-600">
                Leading project management solution among customers and critics.
              </p>
            </div>

            {/* Top Review Platforms */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {reviews.map((rev) => (
                <div
                  key={rev.platform}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all text-center sm:text-left"
                >
                  <div className="text-xs font-bold text-slate-700">{rev.platform}</div>
                  <div className="mt-1 flex items-center justify-center sm:justify-start gap-1.5 font-bold text-base text-slate-900">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{rev.rating}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{rev.reviewsCount}</div>
                </div>
              ))}
            </div>

            {/* Award Badges Grid (6 Authentic Industry Badges) */}
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Recognized by Industry Leaders
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {badges.map((b) => (
                  <div
                    key={b.name}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col items-center text-center group cursor-pointer"
                  >
                    <div className={`w-8 h-8 rounded-lg ${b.color} text-white flex items-center justify-center font-bold text-xs mb-2 shadow-2xs group-hover:scale-105 transition-transform`}>
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-slate-900 leading-tight">{b.name}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">{b.org} • {b.year}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
