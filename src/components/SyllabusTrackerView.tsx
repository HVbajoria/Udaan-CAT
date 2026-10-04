import React, { useState } from 'react';
import { Search, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATSection } from '../types';

export const SyllabusTrackerView: React.FC = () => {
  const { syllabus, setCurrentTab } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState<CATSection | 'ALL'>('ALL');

  const filteredTopics = syllabus.filter((t) => {
    if (sectionFilter !== 'ALL' && t.section !== sectionFilter) return false;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      return t.name.toLowerCase().includes(lower) || t.category.toLowerCase().includes(lower);
    }
    return true;
  });

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
        <h1 className="text-xl font-bold text-slate-900">
          CAT Syllabus Topics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track your preparation across all {syllabus.length} core topics.
        </p>

        {/* Search and Simple Tabs */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search topic name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            {(['ALL', 'QA', 'DILR', 'VARC'] as const).map((sec) => (
              <button
                key={sec}
                onClick={() => setSectionFilter(sec)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  sectionFilter === sec ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {sec === 'ALL' ? 'All' : sec === 'QA' ? 'Quant' : sec === 'DILR' ? 'Reasoning' : 'English'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Topics List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                  {topic.section} • {topic.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                  topic.masteryLevel === 'Strong'
                    ? 'bg-emerald-50 text-emerald-700'
                    : topic.masteryLevel === 'Moderate' || topic.masteryLevel === 'Developing'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-rose-50 text-rose-700'
                }`}>
                  {topic.masteryLevel === 'Moderate' ? 'Developing' : topic.masteryLevel}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-slate-900 mt-1">
                {topic.name}
              </h3>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Mastery: {topic.masteryScore}%</span>
                <span>{topic.weightage} Weight</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    topic.masteryLevel === 'Strong'
                      ? 'bg-emerald-500'
                      : topic.masteryLevel === 'Moderate' || topic.masteryLevel === 'Developing'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${topic.masteryScore}%` }}
                />
              </div>

              <button
                onClick={() => setCurrentTab('daily-test')}
                className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Zap className="w-3 h-3" />
                <span>Practice this topic</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
