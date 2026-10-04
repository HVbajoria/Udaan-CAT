import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { DiagnosticTestModal } from './components/DiagnosticTestModal';
import { DashboardView } from './components/DashboardView';
import { RoadmapView } from './components/RoadmapView';
import { DailyTestView } from './components/DailyTestView';
import { SyllabusTrackerView } from './components/SyllabusTrackerView';
import { MockTrackerView } from './components/MockTrackerView';
import { CatCalculatorModal } from './components/CatCalculatorModal';
import { FormulaSheetModal } from './components/FormulaSheetModal';
import { SettingsModal } from './components/SettingsModal';
import { PomodoroTimerModal } from './components/PomodoroTimerModal';
import { UdaanMark } from './components/UdaanLogo';
import {
  Compass,
  ShieldCheck,
  Zap,
  Target,
  Clock,
  BookOpen,
  Calculator,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentTab, user, setIsCalculatorOpen, setIsFormulaSheetOpen, setIsDiagnosticOpen } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {currentTab === 'dashboard' && <DashboardView />}
        {currentTab === 'roadmap' && <RoadmapView />}
        {currentTab === 'daily-test' && <DailyTestView />}
        {currentTab === 'syllabus' && <SyllabusTrackerView />}
        {currentTab === 'mocks' && <MockTrackerView />}
      </main>

      {/* Modals & Dialogs */}
      <AuthModal />
      <DiagnosticTestModal />
      <CatCalculatorModal />
      <FormulaSheetModal />
      <SettingsModal />
      <PomodoroTimerModal />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <UdaanMark className="w-7 h-7" />
            <span className="font-medium text-slate-700">
              Udaan CAT • Focused CAT Preparation
            </span>
          </div>

          <div className="flex items-center gap-5 text-slate-600 font-medium">
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="hover:text-indigo-600 transition flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5 text-slate-400" />
              <span>Virtual Calc</span>
            </button>
            <button
              onClick={() => setIsFormulaSheetOpen(true)}
              className="hover:text-indigo-600 transition flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Formula Vault</span>
            </button>
            <button
              onClick={() => setIsDiagnosticOpen(true)}
              className="hover:text-indigo-600 transition flex items-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5 text-slate-400" />
              <span>Diagnostic Test</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
