import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATSection } from '../types';

export const RoadmapView: React.FC = () => {
  const {
    roadmap,
    toggleDayCompletion,
    user,
    setCurrentTab,
    setSelectedDay,
  } = useApp();

  const [filterMode, setFilterMode] = useState<'ALL' | 'TESTS_ONLY'>('ALL');
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const completedCount = roadmap.filter((d) => d.isCompleted).length;

  const filteredDays = roadmap.filter((day) => {
    if (filterMode === 'TESTS_ONLY' && !day.testScheduled) return false;
    return true;
  });

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12">
      {/* Simple Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            45-Day Study Plan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Follow this day by day to finish your syllabus and mocks on time.
          </p>
        </div>

        {/* Simple Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterMode === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All 45 Days ({completedCount}/45)
          </button>
          <button
            onClick={() => setFilterMode('TESTS_ONLY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterMode === 'TESTS_ONLY'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mocks & Tests Only
          </button>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-2.5">
        {filteredDays.map((day) => {
          const isToday = user?.currentDay === day.dayNumber;
          const isExpanded = expandedDay === day.dayNumber;

          return (
            <div
              key={day.dayNumber}
              className={`bg-white border rounded-xl p-4 transition shadow-2xs ${
                day.isCompleted
                  ? 'border-slate-200 bg-slate-50/70 opacity-80'
                  : isToday
                  ? 'border-indigo-500 ring-2 ring-indigo-50'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Done / Check button */}
                  <button
                    onClick={() => toggleDayCompletion(day.dayNumber)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition shrink-0 ${
                      day.isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 text-slate-300 hover:border-slate-400'
                    }`}
                    title={day.isCompleted ? 'Mark incomplete' : 'Mark done'}
                  >
                    {day.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                        Day {day.dayNumber}
                      </span>
                      {isToday && (
                        <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          Today
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-medium">
                        {day.focusSection}
                      </span>
                    </div>

                    <h3 className={`text-sm font-semibold mt-0.5 ${
                      day.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}>
                      {day.title}
                    </h3>
                  </div>
                </div>

                {/* Test Scheduled Pill if any */}
                <div className="flex items-center gap-2">
                  {day.testScheduled && (
                    <span className="hidden sm:inline text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {day.testScheduled.name} ({day.testScheduled.durationMinutes}m)
                    </span>
                  )}

                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Details (Simple & Clean) */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-2">
                  <p className="text-slate-600">
                    <strong>Daily Target: </strong>{day.practiceTarget}
                  </p>
                  <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1">
                    {day.goals.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>

                  {day.testScheduled && (
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-indigo-700 font-medium">
                        Test: {day.testScheduled.name}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedDay(day.dayNumber);
                          setCurrentTab('daily-test');
                        }}
                        className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold"
                      >
                        Start Test
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
