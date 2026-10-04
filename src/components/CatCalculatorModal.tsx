import React, { useState } from 'react';
import { X, Delete, Calculator } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CatCalculatorModal: React.FC = () => {
  const { isCalculatorOpen, setIsCalculatorOpen } = useApp();
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewInput, setWaitingForNewInput] = useState(false);
  const [memory, setMemory] = useState<number>(0);

  if (!isCalculatorOpen) return null;

  const handleDigit = (digit: string) => {
    if (display === '0' || waitingForNewInput) {
      setDisplay(digit);
      setWaitingForNewInput(false);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleDecimal = () => {
    if (waitingForNewInput) {
      setDisplay('0.');
      setWaitingForNewInput(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForNewInput(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    if (prevValue !== null && operation && !waitingForNewInput) {
      const result = calculate(prevValue, current, operation);
      setDisplay(String(result));
      setPrevValue(result);
    } else {
      setPrevValue(current);
    }
    setOperation(op);
    setWaitingForNewInput(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? 0 : a / b;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (prevValue === null || !operation) return;
    const current = parseFloat(display);
    const result = calculate(prevValue, current, operation);
    setDisplay(String(result));
    setPrevValue(null);
    setOperation(null);
    setWaitingForNewInput(true);
  };

  const handleSqrt = () => {
    const val = parseFloat(display);
    if (val >= 0) {
      setDisplay(String(Math.sqrt(val)));
      setWaitingForNewInput(true);
    }
  };

  const handleNegate = () => {
    const val = parseFloat(display);
    setDisplay(String(-val));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-xs tracking-wide text-slate-800">
              CAT Virtual Calculator (TCS iON Standard)
            </span>
          </div>
          <button
            onClick={() => setIsCalculatorOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Display */}
        <div className="p-4 bg-slate-100/70 border-b border-slate-200">
          <div className="text-right text-xs text-slate-400 h-4">
            {prevValue !== null && operation ? `${prevValue} ${operation}` : ''}
          </div>
          <div className="text-right font-mono text-3xl font-bold text-slate-900 tracking-wider truncate py-1 select-all">
            {display}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Memory: {memory !== 0 ? memory : '0'}</span>
            <span className="text-slate-400">Non-Scientific Layout</span>
          </div>
        </div>

        {/* Keys grid */}
        <div className="p-3 bg-white grid grid-cols-4 gap-2 text-sm">
          {/* Memory Row */}
          <button
            onClick={() => setMemory(0)}
            className="py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium active:scale-95 transition"
          >
            MC
          </button>
          <button
            onClick={() => setDisplay(String(memory))}
            className="py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium active:scale-95 transition"
          >
            MR
          </button>
          <button
            onClick={() => setMemory((m) => m + parseFloat(display))}
            className="py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium active:scale-95 transition"
          >
            M+
          </button>
          <button
            onClick={() => setMemory((m) => m - parseFloat(display))}
            className="py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium active:scale-95 transition"
          >
            M-
          </button>

          {/* Functions Row */}
          <button
            onClick={handleClear}
            className="py-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold border border-rose-200 active:scale-95 transition"
          >
            C
          </button>
          <button
            onClick={handleBackspace}
            className="py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center active:scale-95 transition"
          >
            <Delete className="w-4 h-4" />
          </button>
          <button
            onClick={handleSqrt}
            className="py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono active:scale-95 transition"
          >
            √x
          </button>
          <button
            onClick={() => handleOperation('/')}
            className={`py-2.5 rounded-lg font-bold transition active:scale-95 ${
              operation === '/' ? 'bg-indigo-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            ÷
          </button>

          {/* Row 7 8 9 * */}
          <button onClick={() => handleDigit('7')} className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium active:scale-95">7</button>
          <button onClick={() => handleDigit('8')} className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium active:scale-95">8</button>
          <button onClick={() => handleDigit('9')} className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium active:scale-95">9</button>
          <button
            onClick={() => handleOperation('*')}
            className={`py-2.5 rounded-lg font-bold transition active:scale-95 ${
              operation === '*' ? 'bg-indigo-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            ×
          </button>

          {/* Row 4 5 6 - */}
          <button onClick={() => handleDigit('4')} className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium active:scale-95">4</button>
          <button onClick={() => handleDigit('5')} className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium active:scale-95">5</button>
          <button onClick={() => handleDigit('6')} className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium active:scale-95">6</button>
          <button
            onClick={() => handleOperation('-')}
            className={`py-2.5 rounded-lg font-bold transition active:scale-95 ${
              operation === '-' ? 'bg-indigo-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            −
          </button>

          {/* Row 1 2 3 + */}
          <button onClick={() => handleDigit('1')} className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium active:scale-95">1</button>
          <button onClick={() => handleDigit('2')} className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium active:scale-95">2</button>
          <button onClick={() => handleDigit('3')} className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium active:scale-95">3</button>
          <button
            onClick={() => handleOperation('+')}
            className={`py-2.5 rounded-lg font-bold transition active:scale-95 ${
              operation === '+' ? 'bg-indigo-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            +
          </button>

          {/* Row +/- 0 . = */}
          <button onClick={handleNegate} className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium active:scale-95">±</button>
          <button onClick={() => handleDigit('0')} className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium active:scale-95">0</button>
          <button onClick={handleDecimal} className="py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium active:scale-95">.</button>
          <button
            onClick={handleEquals}
            className="py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition active:scale-95 shadow-xs"
          >
            =
          </button>
        </div>

        {/* Footer tip */}
        <div className="px-4 py-2 bg-slate-50 text-[11px] text-slate-500 text-center border-t border-slate-200">
          Tip: In CAT, only mouse-clicks work on the on-screen calculator.
        </div>
      </div>
    </div>
  );
};
