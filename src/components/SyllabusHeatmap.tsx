import React, { useState } from 'react';
import {
  LayoutGrid,
  Zap,
  TrendingUp,
  TrendingDown,
  Info,
  BookOpen,
  ArrowRight,
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SyllabusSubtopic, CATSection, MasteryLevel } from '../types';

export const SyllabusHeatmap: React.FC = () => {
  const { syllabus, dailySubmissions, setCurrentTab, setIsFormulaSheetOpen } = useApp();

  const [selectedSection, setSelectedSection] = useState<CATSection | 'ALL'>('ALL');
  const [selectedTopic, setSelectedTopic] = useState<SyllabusSubtopic | null>(null);

  // Helper to normalize mastery level
  const getNormalizedLevel = (topic: SyllabusSubtopic): 'Weak' | 'Developing' | 'Strong' => {
    if (topic.masteryScore >= 70 || topic.masteryLevel === 'Strong') return 'Strong';
    if (topic.masteryScore >= 45 || topic.masteryLevel === 'Moderate' || topic.masteryLevel === 'Developing') {
      return 'Developing';
    }
    return 'Weak';
  };

  // Find recent daily test results for each topic
  const getTopicRecentTestInfo = (topicId: string) => {
    // Check submissions in reverse chronological order
    for (const sub of dailySubmissions) {
      if (sub.topicIds.includes(topicId) || (sub.skillDelta && sub.skillDelta[topicId])) {
        const delta = sub.skillDelta ? sub.skillDelta[topicId] : null;
        return {
          dayNumber: sub.dayNumber,
          date: sub.date,
          accuracy: sub.accuracy,
          deltaBefore: delta?.before,
          deltaAfter: delta?.after,
          change: delta ? delta.after - delta.before : null,
        };
      }
    }
    return null;
  };

  // Filter topics
  const filteredTopics = syllabus.filter((t) => {
    if (selectedSection !== 'ALL' && t.section !== selectedSection) return false;
    return true;
  });

  // Calculate overall counts
  const strongCount = syllabus.filter((t) => getNormalizedLevel(t) === 'Strong').length;
  const developingCount = syllabus.filter((t) => getNormalizedLevel(t) === 'Developing').length;
  const weakCount = syllabus.filter((t) => getNormalizedLevel(t) === 'Weak').length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
              Syllabus Mastery Heatmap
            </h3>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
              {syllabus.length} Topics
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Color-coded topic proficiency dynamically updated by your recent daily test scores.
          </p>
        </div>

        {/* Section Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-center overflow-x-auto">
          {(['ALL', 'QA', 'DILR', 'VARC'] as const).map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setSelectedSection(sec)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedSection === sec
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sec === 'ALL'
                ? 'All Topics'
                : sec === 'QA'
                ? 'Quant (QA)'
                : sec === 'DILR'
                ? 'Reasoning (DILR)'
                : 'English (VARC)'}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Legend & Live Metric Ribbon */}
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Legend */}
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-slate-500 font-medium">Mastery Status:</span>
          
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
            <span className="text-slate-700 font-semibold">Weak</span>
            <span className="text-slate-400 font-mono text-[11px]">(&lt;45%)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
            <span className="text-slate-700 font-semibold">Developing</span>
            <span className="text-slate-400 font-mono text-[11px]">(45-69%)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            <span className="text-slate-700 font-semibold">Strong</span>
            <span className="text-slate-400 font-mono text-[11px]">(70%+)</span>
          </div>
        </div>

        {/* Live Counts */}
        <div className="flex items-center gap-2 text-[11px] font-mono font-semibold">
          <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
            {weakCount} Weak
          </span>
          <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
            {developingCount} Developing
          </span>
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            {strongCount} Strong
          </span>
        </div>
      </div>

      {/* Visual Heatmap Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
        {filteredTopics.map((topic) => {
          const level = getNormalizedLevel(topic);
          const recentTest = getTopicRecentTestInfo(topic.id);

          let tileClass = '';
          let badgeClass = '';
          let dotColor = '';

          if (level === 'Strong') {
            tileClass = 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100/70 text-emerald-950';
            badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
            dotColor = 'bg-emerald-500';
          } else if (level === 'Developing') {
            tileClass = 'bg-amber-50/70 border-amber-200 hover:border-amber-400 hover:bg-amber-100/70 text-amber-950';
            badgeClass = 'bg-amber-100 text-amber-800 border-amber-200';
            dotColor = 'bg-amber-500';
          } else {
            tileClass = 'bg-rose-50/70 border-rose-200 hover:border-rose-400 hover:bg-rose-100/70 text-rose-950';
            badgeClass = 'bg-rose-100 text-rose-800 border-rose-200';
            dotColor = 'bg-rose-500';
          }

          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => setSelectedTopic(topic)}
              className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between space-y-2 cursor-pointer relative group ${tileClass} shadow-2xs hover:shadow-xs`}
            >
              {/* Top Row: Section & Score */}
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  {topic.section}
                </span>

                <div className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                  <span className="font-mono font-bold text-xs">
                    {topic.masteryScore}%
                  </span>
                </div>
              </div>

              {/* Middle: Topic Title */}
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold leading-tight line-clamp-2">
                  {topic.name}
                </h4>
                <p className="text-[10px] text-slate-500 line-clamp-1">
                  {topic.category}
                </p>
              </div>

              {/* Bottom: Level Badge & Recent Test Indicator */}
              <div className="pt-1 border-t border-slate-200/50 flex items-center justify-between w-full text-[10px]">
                <span className={`px-1.5 py-0.2 rounded-md font-semibold border text-[10px] ${badgeClass}`}>
                  {level}
                </span>

                {recentTest ? (
                  <span
                    className="font-mono font-semibold flex items-center text-indigo-700"
                    title={`Tested on Day ${recentTest.dayNumber}: ${recentTest.accuracy}% accuracy`}
                  >
                    <Zap className="w-2.5 h-2.5 mr-0.5 text-indigo-600" />
                    {recentTest.change !== null && recentTest.change > 0 ? `+${recentTest.change}%` : 'Tested'}
                  </span>
                ) : (
                  <span className="text-slate-400 font-mono text-[9px]">
                    {topic.weightage}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Heatmap Footer Tip */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Click any topic tile to inspect concept notes, accuracy stats, or start a targeted drill.</span>
        </span>

        <button
          type="button"
          onClick={() => setCurrentTab('syllabus')}
          className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 shrink-0 ml-2"
        >
          <span>Full Syllabus List</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Interactive Topic Inspector Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-xl space-y-4 animate-in fade-in duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  {selectedTopic.section} • {selectedTopic.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedTopic.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTopic(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mastery Bar */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Mastery Level:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                    getNormalizedLevel(selectedTopic) === 'Strong'
                      ? 'bg-emerald-100 text-emerald-800'
                      : getNormalizedLevel(selectedTopic) === 'Developing'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {getNormalizedLevel(selectedTopic)} ({selectedTopic.masteryScore}%)
                </span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    getNormalizedLevel(selectedTopic) === 'Strong'
                      ? 'bg-emerald-500'
                      : getNormalizedLevel(selectedTopic) === 'Developing'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${selectedTopic.masteryScore}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 pt-0.5">
                {getNormalizedLevel(selectedTopic) === 'Strong'
                  ? 'High confidence. Maintain accuracy with regular timed revision.'
                  : getNormalizedLevel(selectedTopic) === 'Developing'
                  ? 'Grasping concepts well. Focus on eliminating unforced calculation traps.'
                  : 'Needs dedicated focus. Prioritize foundational concept review and formula mastery.'}
              </p>
            </div>

            {/* CAT Weightage & Practice Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">CAT Weightage</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{selectedTopic.weightage} Weight</span>
                <span className="text-[10px] text-slate-500">{selectedTopic.typicalQuestions}</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Practice History</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {selectedTopic.totalQuestionsPracticed} Questions
                </span>
                <span className="text-[10px] text-slate-500">{selectedTopic.accuracy}% Accuracy</span>
              </div>
            </div>

            {/* Key Concepts */}
            {selectedTopic.keyConcepts && selectedTopic.keyConcepts.length > 0 && (
              <div className="space-y-1.5 text-xs">
                <span className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider block">
                  Key Concepts in CAT:
                </span>
                <ul className="space-y-1 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedTopic.keyConcepts.slice(0, 4).map((concept, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedTopic(null);
                  setCurrentTab('daily-test');
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Practice in Daily Test</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedTopic(null);
                  setIsFormulaSheetOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>Formulas</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
