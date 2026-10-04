import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  Calendar,
  Award,
  Zap,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ConsistencyCalendar: React.FC = () => {
  const { user, roadmap, toggleDayCompletion, dailySubmissions, mockScores, setSelectedDay, setCurrentTab } = useApp();

  const currentDayNum = user?.currentDay || 1;
  const [selectedDayNum, setSelectedDayNum] = useState<number>(currentDayNum);

  // Compute consistency metrics
  const completedDays = roadmap.filter((d) => d.isCompleted);
  const completedCount = completedDays.length;

  // Streak calculations
  const currentStreak = user?.streak || (completedDays.length > 0 ? completedDays.length : 1);
  const longestStreak = Math.max(currentStreak, 9);
  const consistencyRate = Math.min(100, Math.round((completedCount / Math.max(1, currentDayNum)) * 100));

  const selectedDayData = roadmap.find((d) => d.dayNumber === selectedDayNum) || roadmap[0];
  const isSelectedCompleted = selectedDayData.isCompleted;

  // Check if a test was taken on this day
  const testOnSelectedDay = dailySubmissions.find((s) => s.dayNumber === selectedDayNum);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
      {/* Header & Streak Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              Consistency Calendar
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {consistencyRate}% On Track
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Your daily study streak across the 45-day sprint. Consistency beats cramming!
          </p>
        </div>

        {/* Streak summary pill */}
        <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200 px-3.5 py-1.5 rounded-xl shrink-0 self-start sm:self-center">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <div>
              <span className="text-xs font-bold text-amber-900 font-mono">
                {currentStreak} Day Streak
              </span>
              <span className="text-[10px] text-amber-700 block -mt-0.5">
                Best: {longestStreak} days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 45-Day Activity Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>Click any day to see tasks & status:</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" /> Completed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600" /> Today
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-100 border border-slate-200" /> Upcoming
            </span>
          </div>
        </div>

        {/* Visual Grid: 45 Days (9 rows of 5 or 5 rows of 9) */}
        <div className="grid grid-cols-9 sm:grid-cols-15 gap-1.5 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
          {roadmap.map((day) => {
            const isCompleted = day.isCompleted;
            const isToday = day.dayNumber === currentDayNum;
            const isSelected = day.dayNumber === selectedDayNum;
            const isFuture = day.dayNumber > currentDayNum;
            const hasMock = day.testScheduled?.type === 'FULL_MOCK';

            let cellClass = 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100';

            if (isCompleted) {
              cellClass = 'bg-emerald-500 border-emerald-600 text-white font-bold shadow-2xs';
            } else if (isToday) {
              cellClass = 'bg-indigo-600 border-indigo-700 text-white font-bold ring-2 ring-indigo-200 animate-pulse';
            } else if (isFuture) {
              cellClass = 'bg-slate-100/80 border-slate-200 text-slate-400';
            } else {
              // Missed past day
              cellClass = 'bg-amber-50 border-amber-200 text-amber-800';
            }

            return (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => setSelectedDayNum(day.dayNumber)}
                className={`h-8 sm:h-9 rounded-lg border text-xs font-mono transition flex flex-col items-center justify-center relative ${cellClass} ${
                  isSelected ? 'ring-2 ring-slate-900 scale-105 z-10' : ''
                }`}
                title={`Day ${day.dayNumber}: ${day.title} (${isCompleted ? 'Completed' : isToday ? 'Today' : 'Upcoming'})`}
              >
                <span>{day.dayNumber}</span>
                {hasMock && (
                  <span className="w-1 h-1 rounded-full bg-rose-400 absolute bottom-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Quick Inspector (Simple & Non-tech friendly) */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">
              Day {selectedDayData.dayNumber}: {selectedDayData.title}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
              isSelectedCompleted
                ? 'bg-emerald-100 text-emerald-800'
                : selectedDayData.dayNumber === currentDayNum
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-slate-200 text-slate-600'
            }`}>
              {isSelectedCompleted ? '✓ Completed' : selectedDayData.dayNumber === currentDayNum ? 'Today’s Goal' : 'Planned'}
            </span>
          </div>

          <p className="text-slate-600">
            Target: <strong className="text-slate-800">{selectedDayData.practiceTarget}</strong>
            {selectedDayData.testScheduled && (
              <span className="text-indigo-700 ml-2 font-semibold">
                • {selectedDayData.testScheduled.name} ({selectedDayData.testScheduled.durationMinutes}m)
              </span>
            )}
          </p>
        </div>

        {/* Actions for this day */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => toggleDayCompletion(selectedDayData.dayNumber)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              isSelectedCompleted
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isSelectedCompleted ? 'Mark Incomplete' : 'Mark as Done ✓'}
          </button>

          <button
            onClick={() => {
              setSelectedDay(selectedDayData.dayNumber);
              setCurrentTab('roadmap');
            }}
            className="p-1.5 px-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium"
          >
            View in Plan →
          </button>
        </div>
      </div>
    </div>
  );
};
