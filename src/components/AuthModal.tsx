import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Cloud,
  CheckCircle2,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UdaanMark } from './UdaanLogo';

export const AuthModal: React.FC = () => {
  const {
    user,
    registerUser,
    login,
    loadDemoProfile,
    signInWithGoogle,
    isAuthLoading,
    authError,
    isAuthModalOpen,
    setIsAuthModalOpen,
  } = useApp();

  const [mode, setMode] = useState<'google' | 'custom' | 'signin'>('google');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetPercentile, setTargetPercentile] = useState<number>(99.0);

  // If user is logged in and modal isn't explicitly open, hide it
  if (user && !isAuthModalOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    registerUser({
      name: name.trim(),
      email: email.trim(),
      targetPercentile,
      dailyHours: 4,
      targetIIMs: ['IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta'],
    });
    setIsAuthModalOpen(false);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(email.trim());
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button if user is already exploring */}
        {user && (
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-2">
          <UdaanMark className="w-14 h-14 mx-auto shadow-md shadow-indigo-200 rounded-2xl" />
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {user ? 'Cloud Account & Auth' : 'Udaan CAT'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {user
                ? 'Connect your Google Account to persist tests & pomodoro logs in Firebase'
                : 'Your focused CAT preparation flight plan'}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-semibold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Firebase Firestore & Auth Enabled</span>
          </div>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* Auth Mode Picker */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('google')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              mode === 'google' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Google Sign-In
          </button>
          <button
            type="button"
            onClick={() => setMode('custom')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              mode === 'custom' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Manual Profile
          </button>
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              mode === 'signin' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quick Sign In
          </button>
        </div>

        {/* Mode 1: Real Firebase Google Auth */}
        {mode === 'google' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-700 space-y-2">
              <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-indigo-600" />
                <span>Zero-Loss Cloud Persistence</span>
              </div>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Syllabus mastery heatmaps & test scores stored in Firestore</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Pomodoro topic study session logs synced in real-time</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Cross-device access to your 45-day roadmap</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              disabled={isAuthLoading}
              onClick={signInWithGoogle}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold text-sm transition shadow-sm flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
            >
              {isAuthLoading ? (
                <>
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                  <span>Connecting with Google...</span>
                </>
              ) : (
                <>
                  {/* Google SVG G-Icon */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.18 3.665-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12c0 2.02.45 3.84 1.24 5.42l4.04-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Mode 2: Manual Profile */}
        {mode === 'custom' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Target Percentile</span>
                <span className="text-indigo-600 font-bold">{targetPercentile}%ile</span>
              </div>
              <input
                type="range"
                min={85}
                max={99.9}
                step={0.5}
                value={targetPercentile}
                onChange={(e) => setTargetPercentile(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Create Local Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Mode 3: Quick Sign In */}
        {mode === 'signin' && (
          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Email
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Demo Aspirants Footer */}
        <div className="pt-3 border-t border-slate-100 text-center space-y-2">
          <p className="text-[11px] text-slate-400 font-medium">Or explore instantly with simulated data:</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                loadDemoProfile('engineer');
                setIsAuthModalOpen(false);
              }}
              className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs text-slate-700 font-medium transition cursor-pointer"
            >
              Aarav (Engineer • QA Strong)
            </button>
            <button
              type="button"
              onClick={() => {
                loadDemoProfile('non-engineer');
                setIsAuthModalOpen(false);
              }}
              className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs text-slate-700 font-medium transition cursor-pointer"
            >
              Priya (Arts • VARC Strong)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
