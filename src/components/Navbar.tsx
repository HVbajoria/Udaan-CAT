import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Zap,
  BookOpen,
  LineChart,
  Calculator,
  Flame,
  ChevronDown,
  LogOut,
  RotateCcw,
  Bell,
  Settings,
  Clock,
  Cloud,
  ShieldCheck,
  LogIn,
} from 'lucide-react';
import { useApp, NavigationTab } from '../context/AppContext';
import { UdaanMark } from './UdaanLogo';

export const Navbar: React.FC = () => {
  const {
    user,
    currentTab,
    setCurrentTab,
    setIsCalculatorOpen,
    setIsFormulaSheetOpen,
    setIsDiagnosticOpen,
    setIsSettingsOpen,
    setIsPomodoroOpen,
    setIsAuthModalOpen,
    isCloudSynced,
    logout,
    resetAllData,
    loadDemoProfile,
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems: { tab: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-4 h-4" /> },
    { tab: 'roadmap', label: '45-Day Plan', icon: <Calendar className="w-4 h-4" /> },
    { tab: 'daily-test', label: 'Daily Test', icon: <Zap className="w-4 h-4" /> },
    { tab: 'syllabus', label: 'Syllabus', icon: <BookOpen className="w-4 h-4" /> },
    { tab: 'mocks', label: 'Mock Scores', icon: <LineChart className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo */}
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-2 text-left"
          >
            <UdaanMark className="w-9 h-9" />
            <div>
              <div className="font-bold text-sm text-slate-900 tracking-tight leading-tight">
                Udaan CAT
              </div>
              <div className="text-[10px] text-slate-500">Focus • Practice • Rise</div>
            </div>
          </button>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => setCurrentTab(item.tab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="p-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5"
              title="Calculator"
            >
              <Calculator className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Calc</span>
            </button>

            <button
              onClick={() => setIsFormulaSheetOpen(true)}
              className="p-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5"
              title="Formula Sheet"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Formulas</span>
            </button>

            <button
              onClick={() => setIsPomodoroOpen(true)}
              className="p-1.5 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5"
              title="Pomodoro Focus Timer & Topic Analytics"
            >
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Timer</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5"
              title="Daily Reminder & Motivation Settings"
            >
              <Bell className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">Reminder</span>
            </button>

            {user && (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{user.streak}d streak</span>
              </div>
            )}

            {/* Cloud Sync Status Indicator */}
            {user?.isFirebaseAuth ? (
              <div
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200"
                title="Your study progress, test scores, and pomodoro logs are synced to Firebase Firestore"
              >
                <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cloud Synced</span>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition"
                title="Sign in with Google to enable Firebase cloud persistence"
              >
                <Cloud className="w-3.5 h-3.5 text-indigo-600" />
                <span>Sync with Google</span>
              </button>
            )}

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-slate-100 text-xs text-slate-800 border border-slate-200 transition"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="w-5 h-5 rounded-full object-cover border border-slate-300"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-semibold">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-2 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900 truncate">{user.name}</p>
                        {user.isFirebaseAuth ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                            Firebase
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            Local Demo
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <p className="text-[11px] text-indigo-600 font-medium mt-0.5">
                        Target: {user.targetPercentile}%ile
                      </p>
                    </div>

                    {!user.isFirebaseAuth && (
                      <div className="p-1.5">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            setIsAuthModalOpen(true);
                          }}
                          className="w-full text-left p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-semibold flex items-center gap-2 transition"
                        >
                          <Cloud className="w-4 h-4 text-indigo-600 shrink-0" />
                          <div>
                            <div className="text-xs">Sign in with Google</div>
                            <div className="text-[10px] text-indigo-600 font-normal">
                              Persist progress to Firebase
                            </div>
                          </div>
                        </button>
                      </div>
                    )}

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setIsSettingsOpen(true);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 font-medium"
                      >
                        <Bell className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Daily Reminder & Motivation</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setIsDiagnosticOpen(true);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700"
                      >
                        Retake Assessment
                      </button>

                      <div className="px-2 py-1 text-[10px] text-slate-400 font-semibold uppercase">
                        Switch Demo Profile
                      </div>
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          loadDemoProfile('engineer');
                        }}
                        className="w-full text-left px-2 py-1 rounded hover:bg-slate-100 text-slate-600"
                      >
                        Aarav (Engineer • Quant Strong)
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          loadDemoProfile('non-engineer');
                        }}
                        className="w-full text-left px-2 py-1 rounded hover:bg-slate-100 text-slate-600"
                      >
                        Priya (Arts • English Strong)
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          loadDemoProfile('fresh');
                        }}
                        className="w-full text-left px-2 py-1 rounded hover:bg-slate-100 text-slate-600"
                      >
                        Fresh Start
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          resetAllData();
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset All</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center gap-1.5"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="p-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setCurrentTab(item.tab)}
                className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition ${
                  isActive ? 'text-indigo-600 font-bold' : 'text-slate-500'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
