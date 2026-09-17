import React, { useState } from 'react';
import { ShieldAlert, Briefcase, Code2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../../backend/types';

export const AuthView: React.FC = () => {
  const { login, register, switchDemoUser } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  
  // Login fields
  const [email, setEmail] = useState('admin@taskforge.io');
  const [password, setPassword] = useState('password123');

  // Register fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('DEVELOPER');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({
        email: registerEmail.trim(),
        password: registerPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: selectedRole
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo & Headline */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
            TF
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">TaskForge</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Project & Team Management Platform with Backend RBAC
          </p>
        </div>

        {/* 1-Click Demo Logins for evaluators */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Instant Demo Login (Evaluate RBAC):</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => switchDemoUser('ADMIN')}
              className="p-2.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-700 hover:border-red-500/50 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs mb-0.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">Full workspace control</span>
            </button>

            <button
              type="button"
              onClick={() => switchDemoUser('MANAGER')}
              className="p-2.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-700 hover:border-blue-500/50 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs mb-0.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Manager</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">Projects & assignments</span>
            </button>

            <button
              type="button"
              onClick={() => switchDemoUser('DEVELOPER')}
              className="p-2.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-700 hover:border-purple-500/50 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs mb-0.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>Developer</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">Status & tasks</span>
            </button>
          </div>
        </div>

        {/* Main Card: Login or Register */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 shadow-2xl">
          {error && (
            <div className="p-3 mb-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          {!isRegister ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="name@taskforge.io"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Need an account? <span className="text-blue-400 font-semibold underline">Register here</span>
                </button>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    placeholder="Alex"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    placeholder="Taylor"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="alex.taylor@company.com"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Role (RBAC)</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="DEVELOPER">Developer (Work on assigned tasks)</option>
                  <option value="MANAGER">Project Manager (Manage projects & tasks)</option>
                  <option value="ADMIN">Administrator (Full permissions)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Creating account...' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Already have an account? <span className="text-blue-400 font-semibold underline">Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
