import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Circle,
  Zap,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { parseDayIntoSegments } from '../utils/catScoring';
import { StudySegment } from '../types';

export const DailyStudyPlan: React.FC = () => {
  const {
    user,
    roadmap,
    completedSegmentIds,
    toggleStudySegment,
    toggleDayCompletion,
    setCurrentTab,
    setIsFormulaSheetOpen,
    setIsAddMockOpen,
    setSelectedDay,
    startPomodoroForSegment,
    setIsPomodoroOpen,
    studySessionLogs,
  } = useApp();

  const currentDayNum = user?.currentDay || 1;
  const [activeDayNum, setActiveDayNum] = useState<number>(currentDayNum);

  // Find the roadmap day to parse
  const dayData = roadmap.find((d) => d.dayNumber === activeDayNum) || roadmap[0];

  // Parse roadmap day into 30-minute actionable segments
  const segments: StudySegment[] = parseDayIntoSegments(
    dayData,
    completedSegmentIds,
    user?.dailyHours || 3
  );

  const completedCount = segments.filter((s) => s.isCompleted).length;
  const totalCount = segments.length;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;
  const minutesStudied = completedCount * 30;
  const totalMinutes = totalCount * 30;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMinutes = studySessionLogs
    .filter((s) => s.date === todayStr)
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  const handlePrevDay = () => {
    if (activeDayNum > 1) {
      setActiveDayNum(activeDayNum - 1);
    }
  };

  const handleNextDay = () => {
    if (activeDayNum < 45) {
      setActiveDayNum(activeDayNum + 1);
    }
  };

  const getCategoryBadge = (category: StudySegment['category']) => {
    switch (category) {
      case 'Concept Review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Practice Drill':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Timed Test':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Full Mock':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Error Analysis':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
      {/* Header with Day Navigator & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Bite-Sized Daily Study Plan
            </h3>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
              30-Min Segments
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Breaking down Day {dayData.dayNumber}'s target into manageable 30-minute actionable steps.
          </p>
        </div>

        {/* Day Switcher & Pomodoro Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={() => setIsPomodoroOpen(true)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition flex items-center gap-1.5"
            title="Open Pomodoro Timer & Time Analytics"
          >
            <Clock className="w-3.5 h-3.5 text-rose-600" />
            <span>Focus Timer {todayMinutes > 0 ? `(${todayMinutes}m)` : ''}</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevDay}
              disabled={activeDayNum <= 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveDayNum(currentDayNum)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono border transition ${
                activeDayNum === currentDayNum
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Day {activeDayNum} {activeDayNum === currentDayNum ? '(Today)' : ''}
            </button>

            <button
              type="button"
              onClick={handleNextDay}
              disabled={activeDayNum >= 45}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar & Summary */}
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-900">
              {completedCount} of {totalCount} segments completed
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 font-mono">
              {Math.floor(minutesStudied / 60)}h {minutesStudied % 60}m / {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
            </span>
          </div>

          <span className="font-bold text-indigo-700 font-mono text-xs">
            {Math.round((completedCount / Math.max(1, totalCount)) * 100)}%
          </span>
        </div>

        {/* Progress track */}
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isAllCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
            }`}
            style={{ width: `${Math.max(4, (completedCount / Math.max(1, totalCount)) * 100)}%` }}
          />
        </div>

        {isAllCompleted && (
          <div className="flex items-center justify-between pt-1 text-xs text-emerald-800 font-medium">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              All 30-minute slots completed for Day {activeDayNum}! Excellent consistency.
            </span>
            {!dayData.isCompleted && (
              <button
                type="button"
                onClick={() => toggleDayCompletion(activeDayNum)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline"
              >
                Mark Day {activeDayNum} Complete in Roadmap ✓
              </button>
            )}
          </div>
        )}
      </div>

      {/* 30-Minute Segments Checklist */}
      <div className="space-y-2.5">
        {segments.map((segment) => {
          const isDone = segment.isCompleted;

          return (
            <div
              key={segment.id}
              className={`p-3 sm:p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDone
                  ? 'bg-slate-50/80 border-slate-200 text-slate-500'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {/* Checkbox & Task Information */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleStudySegment(segment.id)}
                  className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                    isDone
                      ? 'bg-emerald-500 border-emerald-600 text-white shadow-2xs'
                      : 'border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 text-transparent'
                  }`}
                  title={isDone ? 'Mark as incomplete' : 'Mark 30-min slot as complete'}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 font-mono">
                      Slot {segment.slotNumber}
                    </span>

                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-mono">
                      30 min
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadge(
                        segment.category
                      )}`}
                    >
                      {segment.category}
                    </span>
                  </div>

                  <h4
                    className={`text-xs font-bold leading-snug ${
                      isDone ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {segment.title}
                  </h4>

                  <p
                    className={`text-[11px] leading-relaxed ${
                      isDone ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {segment.task}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => startPomodoroForSegment(segment)}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1 transition"
                  title={`Start Pomodoro focus timer for ${segment.title}`}
                >
                  <Clock className="w-3 h-3 text-rose-600" />
                  <span>Timer</span>
                </button>

                {segment.category === 'Timed Test' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDay(activeDayNum);
                      setCurrentTab('daily-test');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Take Test</span>
                  </button>
                )}

                {segment.category === 'Concept Review' && (
                  <button
                    type="button"
                    onClick={() => setIsFormulaSheetOpen(true)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 transition"
                  >
                    <BookOpen className="w-3 h-3 text-slate-500" />
                    <span>Formulas</span>
                  </button>
                )}

                {segment.category === 'Full Mock' && (
                  <button
                    type="button"
                    onClick={() => setIsAddMockOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Log Score</span>
                  </button>
                )}

                {segment.category === 'Error Analysis' && (
                  <button
                    type="button"
                    onClick={() => setCurrentTab('mocks')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 transition"
                  >
                    <span>Error Log</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
        <span>
          Topic for Day {dayData.dayNumber}: <strong className="text-slate-800">{dayData.title}</strong>
        </span>

        <button
          type="button"
          onClick={() => {
            setSelectedDay(activeDayNum);
            setCurrentTab('roadmap');
          }}
          className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 self-start sm:self-center"
        >
          <span>View 45-day syllabus roadmap</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
