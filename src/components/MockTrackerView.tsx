import React, { useState } from 'react';
import {
  PlusCircle,
  Trash2,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { estimatePercentile } from '../utils/catScoring';

export const MockTrackerView: React.FC = () => {
  const {
    mockScores,
    addMockScore,
    deleteMockScore,
    isAddMockOpen,
    setIsAddMockOpen,
    errorLog,
    toggleErrorReviewed,
  } = useApp();

  const [mockName, setMockName] = useState('');
  const [mockType, setMockType] = useState<'Full Mock' | 'VARC Sectional' | 'DILR Sectional' | 'QA Sectional'>('Full Mock');
  const [varcScore, setVarcScore] = useState<number>(30);
  const [dilrScore, setDilrScore] = useState<number>(24);
  const [qaScore, setQaScore] = useState<number>(27);
  const [accuracy, setAccuracy] = useState<number>(85);

  const currentTotal = mockType === 'Full Mock'
    ? varcScore + dilrScore + qaScore
    : mockType === 'VARC Sectional'
    ? varcScore
    : mockType === 'DILR Sectional'
    ? dilrScore
    : qaScore;

  const currentMax = mockType === 'Full Mock' ? 198 : mockType === 'VARC Sectional' ? 72 : mockType === 'DILR Sectional' ? 60 : 66;
  const normalizedForPercentile = mockType === 'Full Mock' ? currentTotal : Math.round((currentTotal / currentMax) * 198);
  const calculatedPercentile = estimatePercentile(normalizedForPercentile);

  const handleSaveMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockName.trim()) return;

    addMockScore({
      name: mockName.trim(),
      date: new Date().toISOString().split('T')[0],
      type: mockType,
      varcScore,
      dilrScore,
      qaScore,
      totalScore: currentTotal,
      maxScore: currentMax,
      percentile: calculatedPercentile,
      accuracy,
      timeTakenMinutes: 120,
      analysisNotes: 'Recorded test score.',
    });

    setMockName('');
    setIsAddMockOpen(false);
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Mock Test Scores
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log your mock exam results and track your progress over time.
          </p>
        </div>

        <button
          onClick={() => setIsAddMockOpen(true)}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Score</span>
        </button>
      </div>

      {/* Mock List */}
      <div className="space-y-3">
        {mockScores.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-xs">
            No mock test scores logged yet. Click "Add Score" after giving a mock.
          </div>
        ) : (
          mockScores.map((m) => (
            <div
              key={m.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{m.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                    {m.type}
                  </span>
                  <span className="text-xs text-slate-400">• {m.date}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                  <span>English: <strong>{m.varcScore}</strong></span>
                  <span>Reasoning: <strong>{m.dilrScore}</strong></span>
                  <span>Quant: <strong>{m.qaScore}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-base font-bold text-indigo-600 font-mono">
                    {m.totalScore} <span className="text-xs text-slate-400 font-normal">/ {m.maxScore}</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700">
                    {m.percentile}%ile ({m.accuracy}% acc)
                  </span>
                </div>

                <button
                  onClick={() => deleteMockScore(m.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mistakes Notebook */}
      {errorLog.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900">
            Mistakes to Remember ({errorLog.length})
          </h2>

          <div className="space-y-2">
            {errorLog.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-semibold text-slate-800">{item.topicName} ({item.section})</span>
                  <button
                    onClick={() => toggleErrorReviewed(item.id)}
                    className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{item.reviewed ? 'Done' : 'Mark Reviewed'}</span>
                  </button>
                </div>
                <p className="text-slate-700">{item.questionText}</p>
                <p className="text-indigo-900 font-medium text-[11px]">Fix: {item.correctApproach}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Mock Modal */}
      {isAddMockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Add Test Score</h3>
              <button onClick={() => setIsAddMockOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMock} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Test Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SimCAT 1 or Mock 1"
                  value={mockName}
                  onChange={(e) => setMockName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Format</label>
                <select
                  value={mockType}
                  onChange={(e) => setMockType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                >
                  <option value="Full Mock">Full Mock (2 Hours)</option>
                  <option value="VARC Sectional">English Test (40 mins)</option>
                  <option value="DILR Sectional">Reasoning Test (40 mins)</option>
                  <option value="QA Sectional">Quant Test (40 mins)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">English</label>
                  <input
                    type="number"
                    value={varcScore}
                    onChange={(e) => setVarcScore(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Reasoning</label>
                  <input
                    type="number"
                    value={dilrScore}
                    onChange={(e) => setDilrScore(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Quant</label>
                  <input
                    type="number"
                    value={qaScore}
                    onChange={(e) => setQaScore(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span>Total: <strong>{currentTotal} marks</strong></span>
                <span className="text-indigo-600 font-bold">{calculatedPercentile}%ile</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMockOpen(false)}
                  className="px-3 py-1.5 text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold"
                >
                  Save Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
