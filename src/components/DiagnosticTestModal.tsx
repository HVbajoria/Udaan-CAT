import React, { useState, useEffect } from 'react';
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  Calculator,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DIAGNOSTIC_QUESTIONS } from '../data/diagnosticQuestions';

export const DiagnosticTestModal: React.FC = () => {
  const {
    isDiagnosticOpen,
    setIsDiagnosticOpen,
    submitDiagnostic,
    diagnosticResult,
    setIsCalculatorOpen,
    setCurrentTab,
  } = useApp();

  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(35 * 60);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (!testStarted || showReport || !isDiagnosticOpen) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, showReport, isDiagnosticOpen]);

  useEffect(() => {
    if (diagnosticResult && !testStarted) {
      setShowReport(true);
    }
  }, [diagnosticResult]);

  if (!isDiagnosticOpen) return null;

  const currentQuestion = DIAGNOSTIC_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: index,
    }));
  };

  const handleSubmit = () => {
    const timeSpent = 35 * 60 - timeRemainingSeconds;
    submitDiagnostic(userAnswers, timeSpent);
    setShowReport(true);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl shadow-xl w-full max-w-3xl overflow-hidden">
        
        {/* State 1: Intro */}
        {!testStarted && !showReport && (
          <div className="p-8 text-center space-y-5 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Target className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-slate-900">
                Initial Level Assessment
              </h2>
              <p className="text-xs text-slate-500">
                18 sample questions (Maths, Reasoning, English) to understand your current level and build your 45-day roadmap.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-1">
              <div>• <strong>Questions:</strong> 18 Questions (6 per section)</div>
              <div>• <strong>Time:</strong> 35 Minutes</div>
              <div>• <strong>Marking:</strong> +3 Correct, -1 Wrong (Skip if unsure)</div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => setTestStarted(true)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs"
              >
                Start Assessment Now
              </button>
              <button
                onClick={() => setIsDiagnosticOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium"
              >
                Take Later
              </button>
            </div>
          </div>
        )}

        {/* State 2: Active Test */}
        {testStarted && !showReport && (
          <div className="flex flex-col min-h-[460px]">
            {/* Top Bar */}
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
              <span className="font-semibold text-indigo-700">
                {currentQuestion.section} • {currentQuestion.topicName}
              </span>
              <div className="flex items-center gap-2 font-mono text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{formatTime(timeRemainingSeconds)}</span>
              </div>
              <button
                onClick={() => setIsCalculatorOpen(true)}
                className="p-1 px-2 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-[11px]"
              >
                Calculator
              </button>
            </div>

            {/* Question Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="font-bold text-slate-400 text-xs">
                Question {currentQuestionIndex + 1} of {DIAGNOSTIC_QUESTIONS.length}
              </div>

              {currentQuestion.passage && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif text-slate-700 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-line">
                  {currentQuestion.passage}
                </div>
              )}

              <p className="font-semibold text-slate-900 leading-relaxed">
                {currentQuestion.text}
              </p>

              <div className="space-y-2 pt-2">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = userAnswers[currentQuestion.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-500 text-slate-900 font-medium'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-medium"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {currentQuestionIndex < DIAGNOSTIC_QUESTIONS.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((i) => Math.min(DIAGNOSTIC_QUESTIONS.length - 1, i + 1))}
                    className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Submit Test
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* State 3: Report */}
        {showReport && diagnosticResult && (
          <div className="p-6 sm:p-8 space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">
                Assessment Complete!
              </h2>
              <p className="text-xs text-slate-500">
                We've evaluated your skills across Quant, Reasoning, and English.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto flex items-center justify-around">
              <div>
                <span className="text-[11px] text-slate-500">Your Score</span>
                <p className="text-xl font-black text-slate-900">{diagnosticResult.totalScore}/{diagnosticResult.maxScore}</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <span className="text-[11px] text-slate-500">Estimated CAT</span>
                <p className="text-xl font-black text-indigo-600 font-mono">{diagnosticResult.estimatedPercentile}%ile</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <span className="text-[11px] text-slate-500">Accuracy</span>
                <p className="text-xl font-black text-emerald-600">{diagnosticResult.overallAccuracy}%</p>
              </div>
            </div>

            <div className="text-left text-xs max-w-md mx-auto space-y-2 pt-2">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
                <strong>Focus Topics (Scheduled in Phase 1):</strong>{' '}
                {diagnosticResult.weakTopics.slice(0, 3).map(id => id.replace('qa-', '').replace('dilr-', '').replace('varc-', '')).join(', ')}
              </div>
            </div>

            <button
              onClick={() => {
                setIsDiagnosticOpen(false);
                setCurrentTab('roadmap');
              }}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs"
            >
              See My 45-Day Study Plan →
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
