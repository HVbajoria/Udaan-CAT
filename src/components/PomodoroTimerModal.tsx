import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  Coffee,
  BookOpen,
  ArrowRight,
  Flame,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATSection, SyllabusSubtopic } from '../types';

export const PomodoroTimerModal: React.FC = () => {
  const {
    isPomodoroOpen,
    setIsPomodoroOpen,
    activePomodoroSegment,
    syllabus,
    studySessionLogs,
    logStudySession,
  } = useApp();

  // Tab: 'timer' or 'analytics'
  const [activeTab, setActiveTab] = useState<'timer' | 'analytics'>('timer');

  // Mode: focus, shortBreak, longBreak
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [focusDurationSetting, setFocusDurationSetting] = useState<25 | 30>(30); // 30 min matches study plan segments
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedCycles, setCompletedCycles] = useState<number>(0);

  // Selected topic
  const [selectedTopicId, setSelectedTopicId] = useState<string>('qa-percentages');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Update selected topic whenever activePomodoroSegment changes
  useEffect(() => {
    if (activePomodoroSegment) {
      if (activePomodoroSegment.topicId) {
        setSelectedTopicId(activePomodoroSegment.topicId);
      }
      // If segment is 30 mins, default to 30 min timer
      const dur = (activePomodoroSegment.durationMinutes === 25 ? 25 : 30) as 25 | 30;
      setFocusDurationSetting(dur);
      if (!isRunning) {
        setTimeLeft(dur * 60);
        setMode('focus');
      }
    }
  }, [activePomodoroSegment]);

  // Handle mode / duration changes
  const setTimerMode = (newMode: 'focus' | 'shortBreak' | 'longBreak', focusDur = focusDurationSetting) => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === 'focus') {
      setTimeLeft(focusDur * 60);
    } else if (newMode === 'shortBreak') {
      setTimeLeft(5 * 60);
    } else {
      setTimeLeft(15 * 60);
    }
  };

  // Timer interval countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Completed session!
      handleSessionComplete();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft]);

  // Audio tone generation for web preview
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // AudioContext might be blocked until user gesture, safe to ignore
    }
  };

  const handleSessionComplete = () => {
    setIsRunning(false);
    playChime();

    const topicObj = syllabus.find((t) => t.id === selectedTopicId) || syllabus[0];

    if (mode === 'focus') {
      // Log session duration
      const durationMins = focusDurationSetting;
      logStudySession({
        topicId: topicObj.id,
        topicName: topicObj.name,
        section: topicObj.section,
        segmentId: activePomodoroSegment?.id,
        durationMinutes: durationMins,
        completedPomodoros: 1,
        sessionType: 'focus',
      });

      const nextCycles = completedCycles + 1;
      setCompletedCycles(nextCycles);

      // Transition to break
      if (nextCycles % 4 === 0) {
        setTimerMode('longBreak');
      } else {
        setTimerMode('shortBreak');
      }
    } else {
      // Break finished, return to focus
      setTimerMode('focus');
    }
  };

  const handleLogEarly = () => {
    const totalDurationSeconds =
      mode === 'focus'
        ? focusDurationSetting * 60
        : mode === 'shortBreak'
        ? 5 * 60
        : 15 * 60;
    const elapsedSeconds = totalDurationSeconds - timeLeft;
    const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

    if (mode === 'focus') {
      const topicObj = syllabus.find((t) => t.id === selectedTopicId) || syllabus[0];
      logStudySession({
        topicId: topicObj.id,
        topicName: topicObj.name,
        section: topicObj.section,
        segmentId: activePomodoroSegment?.id,
        durationMinutes: elapsedMinutes,
        completedPomodoros: 1,
        sessionType: 'focus',
        notes: `Logged early (${elapsedMinutes} mins)`,
      });
    }

    setTimerMode('focus');
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentTopic = syllabus.find((t) => t.id === selectedTopicId) || syllabus[0];

  const totalDurationSeconds =
    mode === 'focus'
      ? focusDurationSetting * 60
      : mode === 'shortBreak'
      ? 5 * 60
      : 15 * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalDurationSeconds - timeLeft) / totalDurationSeconds) * 100));

  // Analytics Computations
  const totalMinutesAll = studySessionLogs.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalHoursAll = (totalMinutesAll / 60).toFixed(1);
  const totalPomodorosAll = studySessionLogs.reduce((acc, s) => acc + s.completedPomodoros, 0);

  // Today's logs
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = studySessionLogs.filter((s) => s.date === todayStr);
  const todayMinutes = todayLogs.reduce((acc, s) => acc + s.durationMinutes, 0);

  // Topic Breakdown
  const topicTimeMap: Record<string, { name: string; section: CATSection; minutes: number; count: number }> = {};
  studySessionLogs.forEach((log) => {
    if (!topicTimeMap[log.topicId]) {
      topicTimeMap[log.topicId] = {
        name: log.topicName,
        section: log.section,
        minutes: 0,
        count: 0,
      };
    }
    topicTimeMap[log.topicId].minutes += log.durationMinutes;
    topicTimeMap[log.topicId].count += log.completedPomodoros;
  });

  const topicTimeList = Object.values(topicTimeMap).sort((a, b) => b.minutes - a.minutes);

  // Section Breakdown
  const qaMinutes = studySessionLogs.filter((s) => s.section === 'QA').reduce((acc, s) => acc + s.durationMinutes, 0);
  const dilrMinutes = studySessionLogs.filter((s) => s.section === 'DILR').reduce((acc, s) => acc + s.durationMinutes, 0);
  const varcMinutes = studySessionLogs.filter((s) => s.section === 'VARC').reduce((acc, s) => acc + s.durationMinutes, 0);

  if (!isPomodoroOpen) {
    // If closed but running in background, show a compact floating pill
    if (isRunning) {
      return (
        <div
          onClick={() => setIsPomodoroOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-slate-900 text-white border border-slate-700 px-4 py-2.5 rounded-full shadow-xl flex items-center gap-3 cursor-pointer hover:scale-105 transition-all animate-pulse"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-mono font-bold tracking-wider">
            🍅 {formatTime(timeLeft)}
          </span>
          <span className="text-xs text-slate-300 max-w-[130px] truncate font-medium">
            {currentTopic.name}
          </span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in duration-150 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/60">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Topic Focus Timer
                </h2>
                <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                  Pomodoro
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Integrated with 30-min daily study segments & analytics engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
            <button
              type="button"
              onClick={() => setIsPomodoroOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              title="Minimize or close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex border-b border-slate-100 px-5 pt-2 gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('timer')}
            className={`pb-2.5 transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'timer'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Active Timer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`pb-2.5 transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'analytics'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Time Analytics ({totalHoursAll}h)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {activeTab === 'timer' ? (
            <div className="space-y-4 text-center">
              
              {/* Linked Segment Context if available */}
              {activePomodoroSegment && (
                <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-left flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-700 block">
                      Linked Study Segment:
                    </span>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      Slot {activePomodoroSegment.slotNumber}: {activePomodoroSegment.title}
                    </span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">
                      {activePomodoroSegment.task}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-white text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded shrink-0">
                    {activePomodoroSegment.durationMinutes}m Slot
                  </span>
                </div>
              )}

              {/* Topic Selector */}
              <div className="text-left space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Target Syllabus Topic to Track:
                </label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {syllabus.map((t) => (
                    <option key={t.id} value={t.id}>
                      [{t.section}] {t.name} ({t.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode Buttons */}
              <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTimerMode('focus')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                    mode === 'focus'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Focus ({focusDurationSetting}m)
                </button>

                <button
                  type="button"
                  onClick={() => setTimerMode('shortBreak')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                    mode === 'shortBreak'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Short Break (5m)
                </button>

                <button
                  type="button"
                  onClick={() => setTimerMode('longBreak')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                    mode === 'longBreak'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Long Break (15m)
                </button>
              </div>

              {/* Focus Duration Setting (25 vs 30 mins) */}
              {mode === 'focus' && (
                <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
                  <span>Session Length:</span>
                  <div className="flex items-center gap-1 font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        setFocusDurationSetting(30);
                        if (!isRunning) setTimeLeft(30 * 60);
                      }}
                      className={`px-2.5 py-0.5 rounded-md border text-xs font-bold ${
                        focusDurationSetting === 30
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      30 min (Plan Standard)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFocusDurationSetting(25);
                        if (!isRunning) setTimeLeft(25 * 60);
                      }}
                      className={`px-2.5 py-0.5 rounded-md border text-xs font-bold ${
                        focusDurationSetting === 25
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      25 min (Classic)
                    </button>
                  </div>
                </div>
              )}

              {/* Timer Display Circle / Box */}
              <div className="py-6 px-4 bg-slate-50 border border-slate-200 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center">
                {/* Background progress fill */}
                <div
                  className={`absolute inset-0 opacity-15 transition-all duration-500 ${
                    mode === 'focus' ? 'bg-indigo-600' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />

                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 z-10">
                  {mode === 'focus' ? 'Deep Work Session' : mode === 'shortBreak' ? 'Short Recharge' : 'Long Rest'}
                </span>

                <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-900 my-2 z-10">
                  {formatTime(timeLeft)}
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 z-10">
                  <span>Cycle {completedCycles + 1}</span>
                  <span>•</span>
                  <span>{currentTopic.section}: {currentTopic.name}</span>
                </div>
              </div>

              {/* Primary Controls */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-sm transition flex items-center gap-2 ${
                    isRunning
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>Pause Session</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>{timeLeft < totalDurationSeconds ? 'Resume' : 'Start Focus Timer'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setTimerMode(mode)}
                  className="p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {timeLeft < totalDurationSeconds && (
                  <button
                    type="button"
                    onClick={handleLogEarly}
                    className="px-3.5 py-3 rounded-2xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition flex items-center gap-1.5"
                    title="Log whatever time has elapsed to analytics and finish"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Log & Done</span>
                  </button>
                )}
              </div>

              {/* Quick Tip */}
              <p className="text-[11px] text-slate-400">
                💡 Closing this window will keep the timer running in the background.
              </p>
            </div>
          ) : (
            /* Tab 2: Analytics Engine View */
            <div className="space-y-4">
              
              {/* Summary KPIs */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl">
                  <span className="text-[10px] text-indigo-700 font-bold uppercase block">Total Studied</span>
                  <span className="text-xl font-bold font-mono text-slate-900 mt-0.5 block">{totalHoursAll} hrs</span>
                  <span className="text-[10px] text-slate-500 font-mono">{totalMinutesAll} mins</span>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase block">Today's Focus</span>
                  <span className="text-xl font-bold font-mono text-emerald-800 mt-0.5 block">
                    {Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m
                  </span>
                  <span className="text-[10px] text-slate-500">{todayLogs.length} sessions</span>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl">
                  <span className="text-[10px] text-amber-700 font-bold uppercase block">Pomodoros</span>
                  <span className="text-xl font-bold font-mono text-amber-800 mt-0.5 block">
                    🍅 {totalPomodorosAll}
                  </span>
                  <span className="text-[10px] text-slate-500">Cycles logged</span>
                </div>
              </div>

              {/* Section-Wise Time Split */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                  Time by CAT Section
                </span>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-blue-50/70 border border-blue-200/80 rounded-xl">
                    <span className="text-[10px] font-bold text-blue-700 block">Quant (QA)</span>
                    <span className="font-mono font-bold text-slate-900 mt-0.5 block">
                      {(qaMinutes / 60).toFixed(1)} hrs
                    </span>
                  </div>

                  <div className="p-2 bg-amber-50/70 border border-amber-200/80 rounded-xl">
                    <span className="text-[10px] font-bold text-amber-700 block">Reasoning (DILR)</span>
                    <span className="font-mono font-bold text-slate-900 mt-0.5 block">
                      {(dilrMinutes / 60).toFixed(1)} hrs
                    </span>
                  </div>

                  <div className="p-2 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-700 block">English (VARC)</span>
                    <span className="font-mono font-bold text-slate-900 mt-0.5 block">
                      {(varcMinutes / 60).toFixed(1)} hrs
                    </span>
                  </div>
                </div>
              </div>

              {/* Topic-Wise Time Leaderboard */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                  Time Spent by Syllabus Topic:
                </span>

                {topicTimeList.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    No topic focus sessions logged yet. Start a timer to track study time!
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {topicTimeList.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="font-mono text-[9px] font-bold text-slate-500 uppercase block">
                            {item.section}
                          </span>
                          <span className="font-bold text-slate-900 block truncate">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-indigo-700 block">
                            {item.minutes} mins
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {item.count} 🍅 session{item.count !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Logs List */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">
                  Recent Logged Sessions:
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto text-[11px]">
                  {studySessionLogs.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-slate-800">{log.topicName}</span>
                        <span className="text-slate-400 text-[10px] block">
                          {log.date} • {log.section}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        +{log.durationMinutes} mins
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
