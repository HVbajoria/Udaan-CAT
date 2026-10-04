import React, { useState } from 'react';
import {
  X,
  Bell,
  Sparkles,
  Clock,
  Check,
  Copy,
  Flame,
  Target,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateDailyBriefing } from '../utils/catScoring';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    user,
    roadmap,
    syllabus,
    toggleDailyReminder,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [selectedTime, setSelectedTime] = useState(user?.reminderTime || '08:00 AM');
  const [refreshKey, setRefreshKey] = useState(0);

  if (!isSettingsOpen) return null;

  const isEnabled = user?.dailyRemindersEnabled !== false; // Default true or user's preference

  const weakTopics = syllabus
    .filter((t) => t.masteryLevel === 'Weak')
    .map((t) => t.name);

  const briefing = generateDailyBriefing(
    user?.name || 'Aspirant',
    user?.currentDay || 1,
    roadmap,
    weakTopics
  );

  const handleToggle = () => {
    toggleDailyReminder(!isEnabled, selectedTime);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    toggleDailyReminder(isEnabled, time);
  };

  const handleCopy = () => {
    const textToCopy = `📌 CAT Day ${briefing.dayNumber} Reminder (${briefing.daysRemaining} days left):\n${briefing.focusSummary}\n\nGoals:\n${briefing.actionItems.map(i => `• ${i}`).join('\n')}\n${briefing.keyWarning ? `\n⚠️ ${briefing.keyWarning}` : ''}\n\n"${briefing.quote}"`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in duration-150">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Reminders & Settings
              </h2>
              <p className="text-[11px] text-slate-500">
                Configure your daily motivation and study notifications
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
          
          {/* Daily Reminder Toggle Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-sm block">
                  Daily Study Reminder
                </span>
                <span className="text-slate-500 text-xs">
                  Generates a daily personalized motivational summary
                </span>
              </div>

              {/* iOS-style toggle switch */}
              <button
                type="button"
                onClick={handleToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  isEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
                title={isEnabled ? 'Disable daily reminder' : 'Enable daily reminder'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Time picker row if enabled */}
            {isEnabled && (
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Reminder Time:
                </span>
                <select
                  value={selectedTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="06:00 AM">06:00 AM (Early Riser)</option>
                  <option value="08:00 AM">08:00 AM (Morning Slot)</option>
                  <option value="10:00 AM">10:00 AM (Standard Slot)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon Slot)</option>
                  <option value="06:00 PM">06:00 PM (Evening Prep)</option>
                  <option value="08:00 PM">08:00 PM (Night Drill)</option>
                </select>
              </div>
            )}
          </div>

          {/* Generated Personalized Motivational Summary Card */}
          {isEnabled ? (
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-xs uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Today's Personalized Study Briefing</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1 text-slate-500 hover:text-indigo-600 flex items-center gap-1 text-[11px]"
                    title="Copy briefing to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Briefing text content */}
              <div className="p-3.5 bg-white border border-indigo-100 rounded-xl space-y-2 text-slate-700 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900">{briefing.greeting}</strong>
                  <span className="font-mono text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                    {briefing.daysRemaining} days remaining
                  </span>
                </div>

                <p className="leading-relaxed text-slate-800">
                  {briefing.focusSummary}
                </p>

                <div className="space-y-1 pt-1">
                  <span className="font-semibold text-slate-600 text-[11px] block">Today's Focus Tasks:</span>
                  {briefing.actionItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {briefing.keyWarning && (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                    <strong>Priority Check:</strong> {briefing.keyWarning}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic">
                  💡 "{briefing.quote}"
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
              <p className="font-medium text-slate-600">Daily reminders are currently turned off.</p>
              <p className="text-[11px]">Turn on the toggle above to receive your daily roadmap briefing.</p>
            </div>
          )}

          {/* Quick Info */}
          <div className="text-[11px] text-slate-400 text-center">
            The briefing updates dynamically each morning based on your remaining days and weak topics.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
