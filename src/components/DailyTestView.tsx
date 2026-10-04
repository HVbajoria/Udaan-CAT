import React, { useState } from 'react';
import {
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Bot,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { explainWithLocalCoach } from '../services/localCoachService';
import { DAILY_QUESTION_POOL } from '../data/dailyQuestionBank';
import { DIAGNOSTIC_QUESTIONS } from '../data/diagnosticQuestions';
import { Question, CATSection, MasteryLevel } from '../types';

export const DailyTestView: React.FC = () => {
  const {
    user,
    roadmap,
    syllabus,
    submitDailyTest,
    dailySubmissions,
    setCurrentTab,
    selectedDay,
    setSelectedDay,
  } = useApp();

  const currentDayData = roadmap.find((d) => d.dayNumber === (selectedDay || user?.currentDay || 1)) || roadmap[0];

  const [testState, setTestState] = useState<'SELECT' | 'RUNNING' | 'COMPLETED'>('SELECT');
  const [selectedSection, setSelectedSection] = useState<CATSection | 'ALL'>('ALL');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [lastSubmissionResult, setLastSubmissionResult] = useState<{
    score: number;
    maxScore: number;
    accuracy: number;
    deltas: Record<string, { before: number; after: number; level: MasteryLevel }>;
  } | null>(null);
  const [coachResponses, setCoachResponses] = useState<Record<string, string>>({});
  const [coachLoading, setCoachLoading] = useState<string | null>(null);
  const [coachError, setCoachError] = useState<{ questionId: string; message: string } | null>(null);

  const handleStartTest = (mode: 'DAY_SCHEDULED' | 'SECTION_PRACTICE') => {
    let pool = [...DAILY_QUESTION_POOL, ...DIAGNOSTIC_QUESTIONS];

    if (mode === 'SECTION_PRACTICE' && selectedSection !== 'ALL') {
      pool = pool.filter((q) => q.section === selectedSection);
    } else if (mode === 'DAY_SCHEDULED') {
      const matching = pool.filter((q) => currentDayData.primaryTopics.includes(q.topicId));
      if (matching.length >= 3) {
        pool = matching;
      }
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
    setActiveQuestions(shuffled);
    setCurrentIdx(0);
    setUserAnswers({});
    setTimeSpentSeconds(0);
    setCoachResponses({});
    setCoachError(null);
    setTestState('RUNNING');
  };

  const handleAskLocalCoach = async (question: Question) => {
    const selectedAnswer = userAnswers[question.id];
    setCoachLoading(question.id);
    setCoachError(null);

    try {
      const explanation = await explainWithLocalCoach({
        question: question.text,
        passage: question.passage,
        options: question.options,
        selectedAnswer: selectedAnswer === undefined ? 'Not answered' : question.options[selectedAnswer],
        correctAnswer: question.options[question.correctAnswerIndex],
        officialExplanation: question.explanation,
        topicName: question.topicName,
      });
      setCoachResponses((previous) => ({ ...previous, [question.id]: explanation }));
    } catch (error) {
      setCoachError({
        questionId: question.id,
        message: error instanceof Error ? error.message : 'The local coach is unavailable.',
      });
    } finally {
      setCoachLoading(null);
    }
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optIdx,
    }));
  };

  const handleFinishTest = () => {
    const res = submitDailyTest(activeQuestions, userAnswers, timeSpentSeconds || 300);
    setLastSubmissionResult(res as any);
    setTestState('COMPLETED');
  };

  const currentQ = activeQuestions[currentIdx];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* =======================================================
          STATE 1: TEST SELECTION & OVERVIEW
         ======================================================= */}
      {testState === 'SELECT' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  Dynamic Skill Updater
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Daily CAT Skill Booster
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                  Take daily 6-question micro-tests to continuously recalibrate your topic mastery scores, accuracy rates, and error notebook in real time.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-medium">Tests Done</span>
                  <p className="text-xl font-black text-slate-900">{dailySubmissions.length}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Zap className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Launch Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option A: Today's Scheduled Roadmap Test */}
            <div className="bg-white border border-indigo-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-indigo-600 text-white uppercase">
                    Day {currentDayData.dayNumber} Scheduled Drill
                  </span>
                  <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Recommended</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {currentDayData.testScheduled ? currentDayData.testScheduled.name : currentDayData.title}
                </h3>

                <p className="text-xs text-slate-600">
                  Tailored to Day {currentDayData.dayNumber}'s syllabus goals: {currentDayData.practiceTarget}
                </p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div><strong>Focus:</strong> {currentDayData.focusSection}</div>
                  <div><strong>Topics:</strong> {currentDayData.primaryTopics.slice(0, 2).join(', ')}</div>
                </div>
              </div>

              <button
                onClick={() => handleStartTest('DAY_SCHEDULED')}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Launch Day {currentDayData.dayNumber} Test (6 Questions)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Option B: Section-Specific Custom Drill */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Custom Topic Sprint
                  </span>
                  <span className="text-xs text-slate-500">Adaptive Practice</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  Target Specific Section Gap
                </h3>

                <p className="text-xs text-slate-600">
                  Choose an isolated section where you recently made errors to build rapid accuracy.
                </p>

                <div className="flex items-center gap-2 pt-2">
                  {(['ALL', 'QA', 'DILR', 'VARC'] as const).map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setSelectedSection(sec)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
                        selectedSection === sec
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleStartTest('SECTION_PRACTICE')}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <span>Start {selectedSection} Rapid Drill</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Recent Daily Test History */}
          {dailySubmissions.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Recent Daily Test History & Skill Deltas
              </h3>

              <div className="space-y-2.5">
                {dailySubmissions.slice(0, 3).map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">Day {sub.dayNumber} Test</span>
                        <span className="text-[11px] text-slate-400">{sub.date.split('T')[0]}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-slate-600">
                        <span>Score: <strong className="text-slate-900">{sub.score} / {sub.maxScore}</strong></span>
                        <span>•</span>
                        <span>Accuracy: <strong className="text-emerald-700">{sub.accuracy}%</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {Object.keys(sub.skillDelta).map((tId) => {
                        const d = sub.skillDelta[tId];
                        const diff = d.after - d.before;
                        return (
                          <span
                            key={tId}
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                              diff >= 0
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {diff >= 0 ? `+${diff}%` : `${diff}%`} skill
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =======================================================
          STATE 2: RUNNING TEST ENGINE
         ======================================================= */}
      {testState === 'RUNNING' && currentQ && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[500px]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                {currentQ.section}
              </span>
              <span className="text-xs text-slate-600 truncate max-w-xs">{currentQ.topicName}</span>
            </div>

            <div className="text-xs font-mono text-slate-600">
              Question <strong className="text-slate-900">{currentIdx + 1}</strong> of{' '}
              <strong className="text-slate-900">{activeQuestions.length}</strong>
            </div>

            <button
              onClick={handleFinishTest}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs transition"
            >
              Finish & Update Skills
            </button>
          </div>

          {/* Question Body */}
          <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
            {currentQ.passage && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-serif text-slate-700 max-h-48 overflow-y-auto whitespace-pre-line leading-relaxed">
                {currentQ.passage}
              </div>
            )}

            <div className="space-y-4">
              <span className="text-xs font-bold text-indigo-700 font-mono">
                Q{currentIdx + 1}. ({currentQ.difficulty})
              </span>
              <h3 className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                {currentQ.text}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = userAnswers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(currentQ.id, idx)}
                    className={`w-full text-left p-4 rounded-xl border text-sm transition flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 text-slate-900 font-medium'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {activeQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center border transition ${
                    userAnswers[q.id] !== undefined
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-white text-slate-600 border-slate-300'
                  } ${idx === currentIdx ? 'ring-2 ring-indigo-400' : ''}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-700 text-xs font-medium"
              >
                Previous
              </button>
              {currentIdx < activeQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx((i) => Math.min(activeQuestions.length - 1, i + 1))}
                  className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleFinishTest}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          STATE 3: COMPLETED RESULTS & DYNAMIC SKILL UPDATE REPORT
         ======================================================= */}
      {testState === 'COMPLETED' && lastSubmissionResult && (
        <div className="space-y-6">
          {/* Result Banner */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Skill Recalibration Complete
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Daily Test Results & Skill Set Evolution
                </h2>
                <p className="text-xs text-slate-500">
                  Your syllabus mastery matrix and 45-day roadmap priorities have been updated.
                </p>
              </div>

              <button
                onClick={() => setTestState('SELECT')}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition"
              >
                Back to Tests
              </button>
            </div>

            {/* Score Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-xs text-slate-500">Test Score</span>
                <div className="text-2xl font-black text-slate-900 mt-0.5">
                  {lastSubmissionResult.score}
                  <span className="text-xs text-slate-400 font-normal"> / {lastSubmissionResult.maxScore}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-xs text-slate-500">Accuracy</span>
                <div className="text-2xl font-black text-emerald-700 mt-0.5">
                  {lastSubmissionResult.accuracy}%
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 col-span-2 sm:col-span-1">
                <span className="text-xs text-slate-500">Roadmap Progress</span>
                <div className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Day Marked Complete
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC SKILL DELTA VISUALIZER */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Dynamic Skill Upgrades Recorded
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(lastSubmissionResult.deltas).map((topicId) => {
                const delta = lastSubmissionResult.deltas[topicId];
                const topic = syllabus.find((t) => t.id === topicId);
                const diff = delta.after - delta.before;

                return (
                  <div
                    key={topicId}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{topic?.name || topicId}</h4>
                      <span
                        className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                          diff >= 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {diff >= 0 ? `+${diff}%` : `${diff}%`}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Before: {delta.before}%</span>
                        <span className="text-slate-900 font-bold">Now: {delta.after}% ({delta.level})</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${delta.after}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verified Question Explanations */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Step-by-Step Solutions & Error Diagnosis
            </h3>

            <div className="space-y-4">
              {activeQuestions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctAnswerIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border text-xs space-y-3 ${
                      isCorrect
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-600">
                        Question {idx + 1} • {q.topicName}
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded-md ${
                          isCorrect ? 'text-emerald-800 bg-emerald-100' : 'text-rose-800 bg-rose-100'
                        }`}
                      >
                        {isCorrect ? '✓ Correct (+3)' : '✗ Incorrect (-1 / Logged in Notebook)'}
                      </span>
                    </div>

                    <p className="font-semibold text-slate-900 text-sm">{q.text}</p>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 text-slate-700">
                      <div>
                        <strong className="text-slate-900">Correct Answer: </strong>
                        {q.options[q.correctAnswerIndex]}
                      </div>
                      <div className="text-slate-600 pt-1 leading-relaxed">
                        <strong className="text-slate-900">Verified Explanation: </strong>
                        {q.explanation}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleAskLocalCoach(q)}
                        disabled={coachLoading === q.id}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 disabled:opacity-60 text-indigo-800 border border-indigo-200 text-xs font-bold transition"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        {coachLoading === q.id ? 'Asking local model…' : 'Ask local coach'}
                      </button>
                      <span className="text-[11px] text-slate-500">Optional supplemental explanation; runs on your machine.</span>
                    </div>

                    {coachError?.questionId === q.id && (
                      <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                        {coachError.message}
                      </p>
                    )}

                    {coachResponses[q.id] && (
                      <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-1 text-slate-700">
                        <div className="flex items-center gap-2 text-indigo-900 font-bold">
                          <Bot className="w-3.5 h-3.5" /> Local coach note
                        </div>
                        <p className="leading-relaxed whitespace-pre-line">{coachResponses[q.id]}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
