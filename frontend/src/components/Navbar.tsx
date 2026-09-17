import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Sparkles, PhoneCall, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onSignUpClick: () => void;
  onRequestDemoClick: () => void;
  onAskZiaClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSignUpClick,
  onRequestDemoClick,
  onAskZiaClick
}) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5'
          : 'bg-white border-b border-slate-100 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Product Name */}
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group"
            >
              {/* TaskForge Logo Badge */}
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#E42525] to-[#B91C1C] text-white font-black flex items-center justify-center text-xs shadow-xs tracking-tighter">
                TF
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-[#E42525] transition-colors">
                Task<span className="text-[#E42525]">Forge</span>
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-700">
              <div className="relative group">
                <button
                  onClick={() => scrollToSection('gantt')}
                  className="px-3 py-2 rounded-md hover:text-[#E42525] hover:bg-slate-50 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Features</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#E42525] transition-transform group-hover:rotate-180" />
                </button>
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 w-64 p-2 bg-white rounded-xl shadow-xl border border-slate-200 hidden group-hover:block transition-all animate-in fade-in duration-150">
                  <button
                    onClick={() => scrollToSection('gantt')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-800 flex items-center justify-between"
                  >
                    <span>Interactive Gantt Charts</span>
                    <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold">Popular</span>
                  </button>
                  <button
                    onClick={() => scrollToSection('timesheets')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-800"
                  >
                    Timesheets & Billing
                  </button>
                  <button
                    onClick={() => scrollToSection('customization')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-800"
                  >
                    Blueprints & Custom Fields
                  </button>
                  <button
                    onClick={() => scrollToSection('ai')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-800 flex items-center justify-between"
                  >
                    <span>Zia AI Intelligence</span>
                    <Sparkles className="w-3 h-3 text-purple-600" />
                  </button>
                  <button
                    onClick={() => scrollToSection('integrations')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-800"
                  >
                    Integrations Ecosystem
                  </button>
                </div>
              </div>

              <button
                onClick={() => scrollToSection('customization')}
                className="px-3 py-2 rounded-md hover:text-[#E42525] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Solutions
              </button>

              <button
                onClick={() => scrollToSection('ratings')}
                className="px-3 py-2 rounded-md hover:text-[#E42525] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Customers
              </button>

              <button
                onClick={onRequestDemoClick}
                className="px-3 py-2 rounded-md hover:text-[#E42525] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Pricing
              </button>

              <button
                onClick={() => scrollToSection('faq')}
                className="px-3 py-2 rounded-md hover:text-[#E42525] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Resources
              </button>
            </nav>
          </div>

          {/* Right Action CTA Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Ask Zia AI Assistant */}
            <button
              onClick={onAskZiaClick}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition-colors cursor-pointer"
              title="Ask Zia AI about TaskForge"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Ask Zia</span>
            </button>

            {/* Request Demo */}
            <button
              onClick={onRequestDemoClick}
              className="hidden md:flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#004CD8] transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
              <span>Request a Demo</span>
            </button>

            {/* Sign In */}
            <button
              onClick={() => navigate('/app')}
              className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#E42525] transition-colors cursor-pointer"
            >
              Sign In
            </button>

            {/* Primary Sign Up CTA */}
            <button
              onClick={onSignUpClick}
              id="nav-signup-button"
              className="px-5 py-2 rounded-md bg-[#E42525] hover:bg-[#cf1e1e] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Sign Up Now
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 space-y-1 text-sm font-semibold pb-4 animate-in slide-in-from-top-2 duration-150">
            <button
              onClick={() => scrollToSection('gantt')}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800"
            >
              Interactive Gantt Charts
            </button>
            <button
              onClick={() => scrollToSection('timesheets')}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800"
            >
              Timesheets & Tracking
            </button>
            <button
              onClick={() => scrollToSection('customization')}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800"
            >
              Customization & Blueprints
            </button>
            <button
              onClick={() => scrollToSection('ai')}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800 flex items-center justify-between"
            >
              <span>Zia AI Intelligence</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </button>
            <button
              onClick={() => scrollToSection('integrations')}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800"
            >
              Integrations
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-800"
            >
              FAQ & Resources
            </button>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onAskZiaClick();
                }}
                className="w-full py-2 rounded-lg bg-purple-50 text-purple-700 font-bold text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Ask Zia AI</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onRequestDemoClick();
                }}
                className="w-full py-2 rounded-lg border border-slate-300 text-slate-800 font-bold text-center"
              >
                Request a Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
