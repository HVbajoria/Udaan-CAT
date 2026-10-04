import React from 'react';
import {
  Clock,
  Zap,
  ArrowRight,
  Calendar,
  BookOpen,
  LineChart,
  PlusCircle,
  CheckCircle2,
  Bell,
  Sparkles,
  Cloud,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConsistencyCalendar } from './ConsistencyCalendar';
import { DailyStudyPlan } from './DailyStudyPlan';
import { SyllabusHeatmap } from './SyllabusHeatmap';
import { generateDailyBriefing } from '../utils/catScoring';

export const DashboardView: React.FC = () => {
  const {
    user,
    syllabus,
    diagnosticResult,
    roadmap,
    mockScores,
    errorLog,
    setCurrentTab,
    setSelectedDay,
    setIsAddMockOpen,
    setIsSettingsOpen,
    setIsAuthModalOpen,
  } = useApp();

  const currentDayNum = user?.currentDay || 1;
  const currentDayData = roadmap.find((d) => d.dayNumber === currentDayNum) || roadmap[0];

  const completedDaysCount = roadmap.filter((d) => d.isCompleted).length;

  // Average Section Masteries
  const qaTopics = syllabus.filter((t) => t.section === 'QA');
  const dilrTopics = syllabus.filter((t) => t.section === 'DILR');
  const varcTopics = syllabus.filter((t) => t.section === 'VARC');

  const qaAvg = Math.round(qaTopics.reduce((acc, t) => acc + t.masteryScore, 0) / Math.max(1, qaTopics.length));
  const dilrAvg = Math.round(dilrTopics.reduce((acc, t) => acc + t.masteryScore, 0) / Math.max(1, dilrTopics.length));
  const varcAvg = Math.round(varcTopics.reduce((acc, t) => acc + t.masteryScore, 0) / Math.max(1, varcTopics.length));

  const latestMock = mockScores[0];
  const projectedPercentile = latestMock
    ? latestMock.percentile
    : diagnosticResult
    ? diagnosticResult.estimatedPercentile
    : 85.0;

  // Next 3 scheduled tests
  const upcomingTests = roadmap
    .filter((d) => d.testScheduled && d.dayNumber >= currentDayNum)
    .slice(0, 3);

  const isReminderEnabled = user?.dailyRemindersEnabled !== false;
  const weakTopics = syllabus.filter((t) => t.masteryLevel === 'Weak').map((t) => t.name);
  const briefing = generateDailyBriefing(
    user?.name || 'Aspirant',
    currentDayNum,
    roadmap,
    weakTopics
  );

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-10">
      
      {/* 1. Simple Hero Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Welcome, {user?.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Day {currentDayNum} of 45 • Target: {user?.targetPercentile || 99}%ile
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl shrink-0">
            <div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Est. Score</span>
              <div className="text-xl font-bold text-indigo-600 font-mono">
                {projectedPercentile}%ile
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Target</span>
              <div className="text-xl font-bold text-slate-900 font-mono">
                {user?.targetPercentile}%ile
              </div>
            </div>
          </div>
        </div>

        {/* 45-Day Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
            <span>Progress: {completedDaysCount} of 45 Days Done</span>
            <span>{Math.round((completedDaysCount / 45) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.max(4, (completedDaysCount / 45) * 100)}%` }}
            />
          </div>
        </div>

        {/* Firebase Cloud Sync Status Card */}
        {user?.isFirebaseAuth ? (
          <div className="mt-3 flex items-center justify-between px-3 py-1.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">Firebase Cloud Sync Active</span>
              <span className="text-[11px] text-emerald-600 hidden sm:inline">• Daily tests, Pomodoro durations & heatmaps saved to Firestore</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
        ) : (
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 px-3.5 bg-indigo-50/80 border border-indigo-200/80 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-indigo-900">
              <Cloud className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-semibold">Local Preview Mode:</span>
              <span className="text-slate-600 text-[11px]">Sign in with Google to save your syllabus mastery and study timers to Firebase</span>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="self-start sm:self-auto px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-[11px] transition shadow-2xs shrink-0 cursor-pointer"
            >
              Sign In with Google
            </button>
          </div>
        )}
      </div>

      {/* Daily Reminder Motivational Briefing Card */}
      {isReminderEnabled && (
        <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Bell className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  Daily Study Briefing • {user?.reminderTime || '08:00 AM'}
                </span>
                <span className="text-[11px] text-indigo-700 font-semibold">
                  {briefing.daysRemaining} days remaining in 45-day roadmap
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2.5 py-1 rounded-lg bg-white border border-indigo-200"
            >
              Reminder Settings
            </button>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            {briefing.focusSummary}
            {briefing.keyWarning && (
              <span className="font-semibold text-amber-900 block mt-1">
                ⚠️ {briefing.keyWarning}
              </span>
            )}
          </p>

          <div className="pt-2 border-t border-indigo-100 flex items-center justify-between text-[11px] text-slate-500 italic">
            <span>💡 "{briefing.quote}"</span>
          </div>
        </div>
      )}

      {/* 2. Main 2-Column Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Today's Plan */}
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Today • Day {currentDayData.dayNumber}
              </span>
              <span className="text-xs font-semibold text-slate-500">{currentDayData.focusSection}</span>
            </div>

            <h2 className="text-base font-bold text-slate-900">
              {currentDayData.title}
            </h2>

            <p className="text-xs text-slate-600">
              Goal: <strong className="text-slate-900">{currentDayData.practiceTarget}</strong>
            </p>

            {/* Test for today if any */}
            {currentDayData.testScheduled && (
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-700">Scheduled Test:</span>
                  <p className="font-bold text-slate-900">{currentDayData.testScheduled.name}</p>
                </div>
                <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                  {currentDayData.testScheduled.durationMinutes} min
                </span>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => setCurrentTab('daily-test')}
              className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Take Today's Test</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                setSelectedDay(currentDayData.dayNumber);
                setCurrentTab('roadmap');
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
            >
              View Plan
            </button>
          </div>
        </div>

        {/* When to Give What Test (Upcoming Tests) */}
        <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Upcoming Tests
              </h3>
              <button
                onClick={() => setCurrentTab('roadmap')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                See all →
              </button>
            </div>

            <div className="space-y-2">
              {upcomingTests.map((t) => (
                <div
                  key={t.dayNumber}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-indigo-700 font-mono text-[11px] block">
                      Day {t.dayNumber}
                    </span>
                    <span className="font-medium text-slate-800 line-clamp-1">{t.testScheduled?.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono font-medium shrink-0 ml-2">
                    {t.testScheduled?.durationMinutes}m
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 text-center pt-1 border-t border-slate-100">
            Total planned: 15 Full Mocks & 15 Section Tests
          </div>
        </div>
      </div>

      {/* Bite-Sized Daily Study Plan (30-Minute Actionable Segments) */}
      <DailyStudyPlan />

      {/* Visual Syllabus Mastery Heatmap (Weak, Developing, Strong derived from recent daily tests) */}
      <SyllabusHeatmap />

      {/* Consistency Calendar (Streaks & Activity) */}
      <ConsistencyCalendar />

      {/* 3. Simple Section Scores (Quant, Reasoning, English) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Your Subject Proficiency
          </h3>
          <button
            onClick={() => setCurrentTab('syllabus')}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            All Topics ({syllabus.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* QA */}
          <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">Quant (Maths)</span>
              <span className="font-bold text-blue-700 font-mono">{qaAvg}%</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${qaAvg}%` }} />
            </div>
            <span className="text-[11px] text-slate-500 block">
              {qaAvg >= 70 ? 'Strong' : qaAvg >= 45 ? 'Moderate' : 'Needs Practice'}
            </span>
          </div>

          {/* DILR */}
          <div className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">Reasoning (DILR)</span>
              <span className="font-bold text-amber-700 font-mono">{dilrAvg}%</span>
            </div>
            <div className="w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${dilrAvg}%` }} />
            </div>
            <span className="text-[11px] text-slate-500 block">
              {dilrAvg >= 70 ? 'Strong' : dilrAvg >= 45 ? 'Moderate' : 'Needs Practice'}
            </span>
          </div>

          {/* VARC */}
          <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">English (VARC)</span>
              <span className="font-bold text-emerald-700 font-mono">{varcAvg}%</span>
            </div>
            <div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${varcAvg}%` }} />
            </div>
            <span className="text-[11px] text-slate-500 block">
              {varcAvg >= 70 ? 'Strong' : varcAvg >= 45 ? 'Moderate' : 'Needs Practice'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Mock Scores Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <LineChart className="w-3.5 h-3.5 text-indigo-600" />
            Recent Mock Test Scores
          </h3>
          <button
            onClick={() => setIsAddMockOpen(true)}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Mock Score</span>
          </button>
        </div>

        {mockScores.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 text-center">No mocks logged yet.</p>
        ) : (
          <div className="space-y-2">
            {mockScores.slice(0, 2).map((m) => (
              <div
                key={m.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900">{m.name}</span>
                  <span className="text-slate-500 text-[11px] block">{m.type} • {m.date}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-indigo-600 font-mono text-sm block">
                    {m.totalScore} / {m.maxScore} marks
                  </span>
                  <span className="text-emerald-700 font-semibold text-[11px]">
                    {m.percentile}%ile ({m.accuracy}% accuracy)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
