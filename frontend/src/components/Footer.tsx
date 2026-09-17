import React, { useState } from 'react';
import { Mail, Search, Apple, Play, Shield, Award, CheckCircle2, Lock, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('support@taskforge.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const featureLinks = [
    'Task Management',
    'Task Automation',
    'Time Tracking',
    'Team Collaboration',
    'Charts and Reports',
    'Issue Tracking',
    'Gantt charts',
    'Project Blueprints',
    'Custom Fields & Layouts'
  ];

  const resourceLinks = [
    'Analyst Speak',
    'Quick Start Guide',
    'Knowledge Base (FAQ)',
    'The Productivity Compass',
    "What's New",
    'Blogs',
    'Webinars & Podcasts',
    'Release Notes'
  ];

  const exploreLinks = [
    'Project Tracker',
    'What is project management?',
    'Free Project Management',
    'Project management tools',
    'Enterprise project management',
    'What is task management?',
    'How to create a Gantt chart in Excel',
    'Project collaboration guide'
  ];

  const compareLinks = [
    'Jira',
    'Monday.com',
    'Microsoft Project',
    'Wrike',
    'Asana',
    'Smartsheet',
    'ClickUp',
    'All competitors'
  ];

  const customerLinks = [
    'Customer Stories',
    'Case Studies',
    'Tweets & Social Feed',
    'Customer Buzz',
    'Community Forum'
  ];

  const legalLinks = [
    'Contact Us',
    'Security',
    'Compliance',
    'IPR Complaints',
    'Anti-spam Policy',
    'Terms of Service',
    'Privacy Policy',
    'Refund Policy',
    'Trademark Policy',
    'Cookie Policy',
    'GDPR Compliance',
    'Abuse Policy'
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 5-Column Link Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Col 1: Features */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Features</h4>
            <ul className="space-y-2">
              {featureLinks.map((item) => (
                <li key={item}>
                  <a href="#gantt" className="hover:text-red-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Resources */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((item) => (
                <li key={item}>
                  <a href="#faq" className="hover:text-red-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Explore */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2">
              {exploreLinks.map((item) => (
                <li key={item}>
                  <a href="#faq" className="hover:text-red-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Compare with */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Compare with</h4>
            <ul className="space-y-2">
              {compareLinks.map((item) => (
                <li key={item}>
                  <a href="#customers" className="hover:text-red-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: From our customers */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">From our customers</h4>
            <ul className="space-y-2">
              {customerLinks.map((item) => (
                <li key={item}>
                  <a href="#testimonials" className="hover:text-red-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Global Offices & Physical Addresses */}
        <div className="py-8 border-b border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <span>Global Headquarters</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              TaskForge Inc.<br />
              500 Howard Street, Suite 400<br />
              San Francisco, CA 94105, USA
            </p>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>+1 (800) 555-3674</span>
            </div>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <span>European Operations</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              TaskForge EMEA Ltd.<br />
              100 Bishopsgate, Level 18<br />
              London EC2N 4AG, United Kingdom
            </p>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>+44 20 7946 0912</span>
            </div>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Engineering Center</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              TaskForge Tech Hub<br />
              111 Congress Ave, Suite 500<br />
              Austin, TX 78701, USA
            </p>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-slate-400" />
              <span>sales@taskforge.com</span>
            </div>
          </div>
        </div>

        {/* Support, App Download & Social Bar (Authentic to video 00:29) */}
        <div className="py-8 border-b border-slate-800 flex flex-wrap items-center justify-between gap-6">
          
          {/* Email Support with Copy */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-lg border border-slate-700">
              <Mail className="w-4 h-4 text-red-500" />
              <button
                onClick={handleCopyEmail}
                className="text-white hover:text-red-400 font-semibold text-sm transition-colors cursor-pointer"
                title="Click to copy email address"
              >
                support@taskforge.com
              </button>
              {copiedEmail && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                  Copied!
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-lg border border-slate-700 text-slate-300">
              <Mail className="w-4 h-4 text-blue-400" />
              <span className="text-white font-semibold text-sm">sales@taskforge.com</span>
            </div>
          </div>

          {/* Mobile Download Badges */}
          <div className="flex items-center gap-3">
            <a
              href="#mobile-app"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
            >
              <Apple className="w-4 h-4" />
              <div className="text-[10px] leading-tight">
                <span className="text-slate-400 block text-[8px]">Download on</span>
                <span className="font-bold">App Store</span>
              </div>
            </a>
            <a
              href="#mobile-app"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              <div className="text-[10px] leading-tight">
                <span className="text-slate-400 block text-[8px]">GET IT ON</span>
                <span className="font-bold">Google Play</span>
              </div>
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" className="hover:text-white font-bold text-sm">𝕏</a>
            <a href="#" className="hover:text-white font-bold text-xs">LinkedIn</a>
            <a href="#" className="hover:text-white font-bold text-xs">YouTube</a>
          </div>

        </div>

        {/* Security & Compliance Badges Strip (Authentic to video 00:30) */}
        <div className="py-8 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 border border-slate-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Choose Privacy. Choose TaskForge.</div>
              <div className="text-slate-400 text-xs mt-0.5">We do not serve ads or sell your project data. Ever.</div>
            </div>
          </div>

          {/* Trust Certifications */}
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-300">
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">ISO 27001</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">ISO 27701</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">SOC 2 TYPE II</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">AICPA SOC</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">HIPAA READY</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">GDPR COMPLIANT</span>
          </div>

        </div>

        {/* Footer Search Bar (Exact to video frame 00:59) */}
        <div className="py-6 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for product overviews, FAQs, and more..."
              className="w-full bg-slate-800 border border-slate-700 rounded-full px-4 py-2.5 pl-10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Legal Links Strip */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-slate-500 text-center">
          {legalLinks.map((item, idx) => (
            <React.Fragment key={item}>
              <a href="#" className="hover:text-slate-300 transition-colors">
                {item}
              </a>
              {idx < legalLinks.length - 1 && <span className="text-slate-700">•</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-[11px] text-slate-500">
          © 2026 TaskForge Inc. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};
