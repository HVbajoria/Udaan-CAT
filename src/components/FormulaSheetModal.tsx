import React, { useState } from 'react';
import { X, Search, BookOpen, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CAT_FORMULA_SHEET } from '../data/formulaCheatsheet';

export const FormulaSheetModal: React.FC = () => {
  const { isFormulaSheetOpen, setIsFormulaSheetOpen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<'ALL' | 'QA' | 'DILR' | 'VARC'>('ALL');

  if (!isFormulaSheetOpen) return null;

  const filteredCategories = CAT_FORMULA_SHEET.filter((category) => {
    if (activeSection !== 'ALL' && category.section !== activeSection) return false;
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    const matchCategory = category.title.toLowerCase().includes(lower);
    const matchItems = category.items.some(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.formula.toLowerCase().includes(lower) ||
        item.catTip.toLowerCase().includes(lower)
    );
    return matchCategory || matchItems;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-white sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                CAT Formula & Strategy Vault
                <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800 font-medium">
                  24 Core Rules
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Key formulas, shortcuts, and trap-elimination rules tested frequently in CAT
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFormulaSheetOpen(false)}
            className="self-end sm:self-center p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search formula (e.g. Apollonius, CI, Escalator, Venn, Vieta)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'QA', 'DILR', 'VARC'] as const).map((sec) => (
              <button
                key={sec}
                onClick={() => setActiveSection(sec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeSection === sec
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sec === 'ALL' ? 'All Sections' : sec}
              </button>
            ))}
          </div>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 bg-white">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Search className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm">No formulas matched your search keyword.</p>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.title} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        category.section === 'QA'
                          ? 'bg-blue-600'
                          : category.section === 'DILR'
                          ? 'bg-amber-600'
                          : 'bg-emerald-600'
                      }`}
                    />
                    {category.title}
                  </h3>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {category.section}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {category.items
                    .filter((item) => {
                      if (!searchTerm) return true;
                      const lower = searchTerm.toLowerCase();
                      return (
                        item.name.toLowerCase().includes(lower) ||
                        item.formula.toLowerCase().includes(lower) ||
                        item.catTip.toLowerCase().includes(lower)
                      );
                    })
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition shadow-2xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                          <span className="text-[10px] text-indigo-700 font-mono bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                            Verified
                          </span>
                        </div>

                        {/* Formula code box */}
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-xs text-indigo-900 select-all overflow-x-auto">
                          {item.formula}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          <span className="text-slate-500 font-medium">When to use: </span>
                          {item.application}
                        </p>

                        <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 text-xs text-emerald-800">
                          <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                          <span>
                            <strong className="text-emerald-900">Pro Hack: </strong>
                            {item.catTip}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          Memorize these during Phase 1 so you don't stall during the 40-minute sectional speed crunch.
        </div>
      </div>
    </div>
  );
};
