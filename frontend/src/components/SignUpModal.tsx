import React, { useState } from 'react';
import { X, Check, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const [firstName, ...rest] = fullName.trim().split(' ');
      const lastName = rest.join(' ') || firstName;
      await api.register({
        email,
        password,
        firstName,
        lastName,
        organizationName: company || undefined
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Header banner */}
        <div className="bg-[#a31515] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-[3px] bg-white text-[#a31515] font-black flex items-center justify-center text-[10px] shadow-xs">
              TF
            </div>
            <span className="font-bold text-sm">TaskForge Free Trial</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Welcome to TaskForge!</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We've dispatched your account setup link to <strong className="text-slate-900">{email || 'your email'}</strong>. You can now begin organizing tasks, Gantt schedules, and timesheets immediately.
            </p>
            <button
              onClick={() => navigate('/app')}
              className="mt-4 w-full py-2.5 rounded-lg bg-[#E42525] text-white font-bold text-sm uppercase shadow-sm hover:bg-[#cf1e1e]"
            >
              Go to Project Workspace
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="text-center pb-2">
              <h3 className="text-xl font-extrabold text-slate-900">Get Started with TaskForge</h3>
              <p className="text-slate-500 text-xs mt-1">15-day free trial. No credit card required.</p>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Martin Young"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="martin@company.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Company Name</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Zylker Global Inc."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-[11px] text-slate-600 leading-tight cursor-pointer">
                I agree to the <a href="#" className="text-red-600 hover:underline">Terms of Service</a> and <a href="#" className="text-red-600 hover:underline">Privacy Policy</a>.
              </label>
            </div>

            {error && (
              <p className="text-[11px] text-red-600 font-semibold -mt-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={!agreed || isSubmitting}
              className="w-full py-3 rounded-lg bg-[#E42525] hover:bg-[#cf1e1e] text-white font-bold text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Creating account...' : 'Sign Up For Free'}
            </button>

            <div className="pt-2 text-center flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit SSL encryption. Enterprise ISO certified.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
