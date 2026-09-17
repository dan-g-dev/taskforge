import React, { useState } from 'react';
import { Globe, Search, ChevronDown, Check, X } from 'lucide-react';

interface TopBarProps {
  onSignInClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onSignInClick }) => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const taskforgeApps = [
    { name: 'Sprints', highlight: false },
    { name: 'BugTracker', highlight: false },
    { name: 'CRM', highlight: false },
    { name: 'Analytics', highlight: false },
    { name: 'Flow', highlight: false },
    { name: 'Automations', highlight: false },
  ];

  const allProductsList = [
    { cat: 'Sales & Marketing', apps: ['CRM', 'Campaigns', 'Forms', 'SalesIQ', 'Social', 'Pagesense'] },
    { cat: 'Finance & Operations', apps: ['Books', 'Invoice', 'Expense', 'Inventory', 'Billing'] },
    { cat: 'Collaboration & HR', apps: ['Projects', 'Sprints', 'Cliq', 'WorkDrive', 'People', 'Recruit'] },
    { cat: 'IT & Developer', apps: ['Creator', 'QEngine', 'Analytics', 'Catalyst', 'Flow'] },
  ];

  const languages = ['English', 'Español', 'Français', 'Deutsch', 'Português', '日本語'];

  return (
    <div className="w-full text-xs select-none">
      {/* Celebration Ribbon */}
      {isBannerVisible && (
        <div className="bg-[#a31515] text-white px-4 py-1.5 flex items-center justify-center relative font-medium text-xs tracking-wide">
          <div className="flex items-center gap-1.5 text-center">
            <span role="img" aria-label="trophy">🏆</span>
            <span>10 years strong: Thank you for building with TaskForge!</span>
            <span className="text-red-300">❤️</span>
          </div>
          <button
            onClick={() => setIsBannerVisible(false)}
            aria-label="Close notification"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TaskForge Ecosystem Strip */}
      <div className="hidden lg:flex items-center justify-between px-6 py-2 border-b border-slate-100 bg-white text-slate-600 text-xs">
        <div className="flex items-center gap-5">
          {/* TaskForge Mini Logo */}
          <a href="#" className="flex items-center gap-1.5 group mr-2" aria-label="TaskForge Home">
            <div className="w-4 h-4 rounded-[2px] bg-gradient-to-br from-[#E42525] to-[#B91C1C] text-white font-extrabold flex items-center justify-center text-[9px] leading-none shadow-xs">
              TF
            </div>
            <span className="font-bold text-slate-900 text-xs tracking-tight">TaskForge</span>
          </a>

          {/* App links */}
          <nav className="flex items-center gap-4 text-slate-700 font-medium">
            {taskforgeApps.map((app) => (
              <a
                key={app.name}
                href={`#${app.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="hover:text-red-600 transition-colors cursor-pointer"
              >
                {app.name}
              </a>
            ))}

            {/* All Products Dropdown Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAllProducts(!showAllProducts)}
                className="flex items-center gap-1 hover:text-red-600 transition-colors font-medium text-slate-700 cursor-pointer"
              >
                <span>All Products</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showAllProducts ? 'rotate-180' : ''}`} />
              </button>

              {/* All Products Mega Dropdown */}
              {showAllProducts && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowAllProducts(false)} />
                  <div className="absolute left-0 top-full mt-2 w-[520px] bg-white rounded-lg shadow-xl border border-slate-200 p-4 grid grid-cols-2 gap-4 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {allProductsList.map((category) => (
                      <div key={category.cat} className="space-y-1.5">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{category.cat}</h4>
                        <div className="grid grid-cols-2 gap-1 text-slate-700">
                          {category.apps.map((app) => (
                            <span
                              key={app}
                              onClick={() => setShowAllProducts(false)}
                              className="py-1 px-1.5 hover:bg-slate-50 hover:text-red-600 rounded cursor-pointer transition-colors"
                            >
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>

        {/* Right utility items */}
        <div className="flex items-center gap-5 text-slate-700">
          <button 
            type="button" 
            aria-label="Search TaskForge"
            className="hover:text-red-600 transition-colors p-1"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Language selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 hover:text-red-600 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentLang}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setCurrentLang(lang);
                        setShowLangMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-slate-50 hover:text-red-600 text-xs"
                    >
                      <span>{lang}</span>
                      {currentLang === lang && <Check className="w-3 h-3 text-red-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={onSignInClick}
            className="text-red-600 font-semibold hover:text-red-700 transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
