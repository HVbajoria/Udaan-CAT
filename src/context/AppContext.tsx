import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  SyllabusSubtopic,
  DiagnosticResult,
  RoadmapDay,
  MockScore,
  DailyTestSubmission,
  ErrorLogItem,
  TopicEvaluation,
  CATSection,
  Question,
  MasteryLevel,
  StudySessionLog,
  StudySegment,
} from '../types';
import { INITIAL_CAT_SYLLABUS } from '../data/catSyllabus';
import { DIAGNOSTIC_QUESTIONS } from '../data/diagnosticQuestions';
import {
  estimatePercentile,
  getMasteryLevel,
  generateAdaptiveRoadmap,
  SAMPLE_MOCKS,
} from '../utils/catScoring';

import {
  auth,
  googleProvider,
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  testFirestoreConnection,
} from '../lib/firebase';
import { FirebaseService } from '../services/firebaseService';

export type NavigationTab = 'dashboard' | 'roadmap' | 'daily-test' | 'syllabus' | 'mocks' | 'formulas';

interface AppContextType {
  user: UserProfile | null;
  syllabus: SyllabusSubtopic[];
  diagnosticResult: DiagnosticResult | null;
  roadmap: RoadmapDay[];
  mockScores: MockScore[];
  dailySubmissions: DailyTestSubmission[];
  errorLog: ErrorLogItem[];
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;

  // Firebase Auth & Cloud Sync
  isAuthLoading: boolean;
  authError: string | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  isCloudSynced: boolean;

  // Modals
  isDiagnosticOpen: boolean;
  setIsDiagnosticOpen: (open: boolean) => void;
  isCalculatorOpen: boolean;
  setIsCalculatorOpen: (open: boolean) => void;
  isFormulaSheetOpen: boolean;
  setIsFormulaSheetOpen: (open: boolean) => void;
  isAddMockOpen: boolean;
  setIsAddMockOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isPomodoroOpen: boolean;
  setIsPomodoroOpen: (open: boolean) => void;
  activePomodoroSegment: StudySegment | null;
  setActivePomodoroSegment: (segment: StudySegment | null) => void;
  startPomodoroForSegment: (segment: StudySegment) => void;
  completedSegmentIds: string[];
  toggleStudySegment: (segmentId: string) => void;
  studySessionLogs: StudySessionLog[];
  logStudySession: (log: Omit<StudySessionLog, 'id' | 'timestamp' | 'date'> & { date?: string }) => void;

  // Actions
  login: (email: string) => boolean;
  registerUser: (profile: {
    name: string;
    email: string;
    targetPercentile: number;
    dailyHours: number;
    targetIIMs: string[];
  }) => void;
  logout: () => void;
  toggleDailyReminder: (enabled: boolean, reminderTime?: string) => void;
  loadDemoProfile: (type: 'engineer' | 'non-engineer' | 'fresh') => void;
  submitDiagnostic: (answers: Record<string, number>, timeSpentSeconds: number) => DiagnosticResult;
  submitDailyTest: (
    testedQuestions: Question[],
    userAnswers: Record<string, number>,
    timeSpentSeconds: number
  ) => { score: number; maxScore: number; accuracy: number; deltas: Record<string, { before: number; after: number; level: MasteryLevel }> };
  toggleDayCompletion: (dayNumber: number) => void;
  addMockScore: (mock: Omit<MockScore, 'id'>) => void;
  deleteMockScore: (id: string) => void;
  addErrorLogItem: (item: Omit<ErrorLogItem, 'id' | 'date'>) => void;
  toggleErrorReviewed: (id: string) => void;
  updateSubtopicNotes: (id: string, notes: string) => void;
  resetAllData: () => void;
}

const STORAGE_KEY = 'cat_prep_45day_state_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.user || null;
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
    return null;
  });

  const [syllabus, setSyllabus] = useState<SyllabusSubtopic[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.syllabus && parsed.syllabus.length > 0) return parsed.syllabus;
      } catch (e) {
        console.error('Error parsing stored syllabus', e);
      }
    }
    return INITIAL_CAT_SYLLABUS;
  });

  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.diagnosticResult || null;
      } catch (e) {
        console.error('Error parsing stored diagnostic', e);
      }
    }
    return null;
  });

  const [roadmap, setRoadmap] = useState<RoadmapDay[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.roadmap && parsed.roadmap.length > 0) return parsed.roadmap;
      } catch (e) {
        console.error('Error parsing stored roadmap', e);
      }
    }
    return generateAdaptiveRoadmap();
  });

  const [mockScores, setMockScores] = useState<MockScore[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.mockScores) return parsed.mockScores;
      } catch (e) {
        console.error('Error parsing stored mocks', e);
      }
    }
    return SAMPLE_MOCKS.map((m, idx) => ({ ...m, id: `mock-seed-${idx}` }));
  });

  const [dailySubmissions, setDailySubmissions] = useState<DailyTestSubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.dailySubmissions) return parsed.dailySubmissions;
      } catch (e) {
        console.error('Error parsing stored daily tests', e);
      }
    }
    return [];
  });

  const [errorLog, setErrorLog] = useState<ErrorLogItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.errorLog) return parsed.errorLog;
      } catch (e) {
        console.error('Error parsing stored error log', e);
      }
    }
    return [
      {
        id: 'err-seed-1',
        date: '2026-09-12',
        questionText: 'Circular track meeting point with speeds 12 m/s and 8 m/s',
        topicName: 'Time, Speed & Distance (TSD)',
        section: 'QA',
        errorReason: 'Calculation Mistake',
        correctApproach: 'LCM of individual lap times (100/3 and 50) = 100 sec, not relative speed subtraction.',
        reviewed: true,
      },
      {
        id: 'err-seed-2',
        date: '2026-09-15',
        questionText: 'Knockout tournament seeded upsets bracket in Sweet 16',
        topicName: 'Games & Tournaments (Round Robin, Knockout)',
        section: 'DILR',
        errorReason: 'Conceptual Gap',
        correctApproach: 'Seed k plays Seed (2^m + 1 - k). In 64 draw round 2, Seed 1 plays Seed 32.',
        reviewed: false,
      }
    ];
  });

  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [selectedDay, setSelectedDay] = useState<number>(user?.currentDay || 1);

  // Firebase Auth & Cloud Sync
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // Modals
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isFormulaSheetOpen, setIsFormulaSheetOpen] = useState(false);
  const [isAddMockOpen, setIsAddMockOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [activePomodoroSegment, setActivePomodoroSegment] = useState<StudySegment | null>(null);

  const [studySessionLogs, setStudySessionLogs] = useState<StudySessionLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.studySessionLogs) return parsed.studySessionLogs;
      } catch (e) {
        console.error('Error parsing stored studySessionLogs', e);
      }
    }
    return [
      {
        id: 'sess-seed-1',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        topicId: 'qa-percentages',
        topicName: 'Percentages, Profit & Loss, SI/CI',
        section: 'QA',
        segmentId: 'day-7-seg-1',
        durationMinutes: 30,
        completedPomodoros: 1,
        sessionType: 'focus',
      },
      {
        id: 'sess-seed-2',
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        topicId: 'dilr-arrangements',
        topicName: 'Linear & Circular Arrangements',
        section: 'DILR',
        segmentId: 'day-8-seg-1',
        durationMinutes: 30,
        completedPomodoros: 1,
        sessionType: 'focus',
      },
    ];
  });

  const startPomodoroForSegment = (segment: StudySegment) => {
    setActivePomodoroSegment(segment);
    setIsPomodoroOpen(true);
  };

  const logStudySession = (log: Omit<StudySessionLog, 'id' | 'timestamp' | 'date'> & { date?: string }) => {
    const newLog: StudySessionLog = {
      ...log,
      id: `sess-${Date.now()}`,
      date: log.date || new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
    };

    setStudySessionLogs((prev) => [newLog, ...prev]);

    if (log.segmentId) {
      setCompletedSegmentIds((prev) =>
        prev.includes(log.segmentId!) ? prev : [...prev, log.segmentId!]
      );
    }

    if (user?.isFirebaseAuth) {
      FirebaseService.saveSessionLog(user.id, newLog).catch((err) =>
        console.error('Failed to save session log to Firebase', err)
      );
    }

    confetti({ particleCount: 35, spread: 55, origin: { y: 0.7 } });
  };

  const [completedSegmentIds, setCompletedSegmentIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.completedSegmentIds) return parsed.completedSegmentIds;
      } catch (e) {
        console.error('Error parsing stored completedSegmentIds', e);
      }
    }
    return ['day-8-seg-1', 'day-8-seg-2'];
  });

  const toggleStudySegment = (segmentId: string) => {
    setCompletedSegmentIds((prev) => {
      const isDone = prev.includes(segmentId);
      const next = isDone ? prev.filter((id) => id !== segmentId) : [...prev, segmentId];
      if (!isDone) {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.75 } });
      }
      return next;
    });
  };

  const toggleDailyReminder = (enabled: boolean, reminderTime?: string) => {
    if (user) {
      setUser({
        ...user,
        dailyRemindersEnabled: enabled,
        reminderTime: reminderTime || user.reminderTime || '08:00 AM',
      });
    }
  };

  // Firebase Auth Observer & Data Hydration from Firestore
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setIsAuthLoading(true);
      if (fbUser) {
        try {
          let profile = await FirebaseService.getUserProfile(fbUser.uid);
          if (!profile) {
            profile = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'CAT Aspirant',
              email: fbUser.email || '',
              photoURL: fbUser.photoURL || undefined,
              isFirebaseAuth: true,
              targetPercentile: 99.0,
              dailyHours: 4,
              targetIIMs: ['IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta'],
              registeredAt: new Date().toISOString(),
              baselineCompleted: false,
              currentDay: 1,
              streak: 1,
              lastActiveDate: new Date().toISOString().split('T')[0],
              dailyRemindersEnabled: false,
              reminderTime: '08:00 AM',
            };
            await FirebaseService.saveUserProfile(profile);
          } else {
            profile = {
              ...profile,
              photoURL: fbUser.photoURL || profile.photoURL,
              isFirebaseAuth: true,
            };
          }

          setUser(profile);
          setIsCloudSynced(true);

          // Hydrate user progress from Firestore
          const [studyState, submissions, mocks, sessions, errors] = await Promise.all([
            FirebaseService.getStudyState(fbUser.uid),
            FirebaseService.getDailySubmissions(fbUser.uid),
            FirebaseService.getMockScores(fbUser.uid),
            FirebaseService.getSessionLogs(fbUser.uid),
            FirebaseService.getErrorLogs(fbUser.uid),
          ]);

          if (studyState) {
            if (studyState.completedSegmentIds && studyState.completedSegmentIds.length > 0) {
              setCompletedSegmentIds(studyState.completedSegmentIds);
            }
            if (studyState.diagnosticResult) {
              setDiagnosticResult(studyState.diagnosticResult);
            }
            if (studyState.completedDays && studyState.completedDays.length > 0) {
              setRoadmap((prev) =>
                prev.map((d) => ({
                  ...d,
                  isCompleted: studyState.completedDays.includes(d.dayNumber),
                }))
              );
            }
            if (studyState.topicMastery) {
              setSyllabus((prev) =>
                prev.map((subtopic) => {
                  const override = studyState.topicMastery?.[subtopic.id];
                  if (override) {
                    return {
                      ...subtopic,
                      masteryScore: override.masteryScore,
                      masteryLevel: override.masteryLevel as any,
                      accuracy: override.accuracy,
                      totalQuestionsPracticed: override.totalQuestionsPracticed,
                    };
                  }
                  return subtopic;
                })
              );
            }
          }

          if (submissions && submissions.length > 0) {
            setDailySubmissions(submissions);
          }
          if (mocks && mocks.length > 0) {
            setMockScores(mocks);
          }
          if (sessions && sessions.length > 0) {
            setStudySessionLogs(sessions);
          }
          if (errors && errors.length > 0) {
            setErrorLog(errors);
          }
        } catch (err) {
          console.error('Error fetching Firestore user data:', err);
        } finally {
          setIsAuthLoading(false);
        }
      } else {
        setIsAuthLoading(false);
        setIsCloudSynced(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Auto-sync study state to Firestore whenever study progress changes
  useEffect(() => {
    if (user?.isFirebaseAuth) {
      const completedDays = roadmap.filter((r) => r.isCompleted).map((r) => r.dayNumber);
      FirebaseService.saveStudyState(user.id, {
        completedSegmentIds,
        completedDays,
        diagnosticResult,
        syllabus,
      }).catch((e) => console.error('Error auto-syncing study state', e));
    }
  }, [user?.id, user?.isFirebaseAuth, completedSegmentIds, roadmap, diagnosticResult, syllabus]);

  // Auto-sync user profile to Firestore
  useEffect(() => {
    if (user?.isFirebaseAuth) {
      FirebaseService.saveUserProfile(user).catch((e) =>
        console.error('Error auto-syncing user profile', e)
      );
    }
  }, [user]);

  // Save to localStorage whenever core state updates (for offline resilience)
  useEffect(() => {
    const dataToSave = {
      user,
      syllabus,
      diagnosticResult,
      roadmap,
      mockScores,
      dailySubmissions,
      errorLog,
      completedSegmentIds,
      studySessionLogs,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [user, syllabus, diagnosticResult, roadmap, mockScores, dailySubmissions, errorLog, completedSegmentIds, studySessionLogs]);

  // If user registers and hasn't completed diagnostic, auto trigger diagnostic modal
  useEffect(() => {
    if (user && !user.baselineCompleted) {
      setIsDiagnosticOpen(true);
    }
  }, [user]);

  const login = (email: string): boolean => {
    // If we have an existing user matching or if email provided
    if (user && user.email.toLowerCase() === email.toLowerCase()) {
      return true;
    }
    // Create quick session if existing not found
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      targetPercentile: 99.0,
      dailyHours: 4,
      targetIIMs: ['IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta'],
      registeredAt: new Date().toISOString(),
      baselineCompleted: false,
      currentDay: 1,
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    return true;
  };

  const registerUser = (profile: {
    name: string;
    email: string;
    targetPercentile: number;
    dailyHours: number;
    targetIIMs: string[];
  }) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: profile.name,
      email: profile.email,
      targetPercentile: profile.targetPercentile || 99.0,
      dailyHours: profile.dailyHours || 4,
      targetIIMs: profile.targetIIMs.length > 0 ? profile.targetIIMs : ['IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta'],
      registeredAt: new Date().toISOString(),
      baselineCompleted: false,
      currentDay: 1,
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    // Reset syllabus to initial baseline for fresh assessment
    setSyllabus(INITIAL_CAT_SYLLABUS);
    setDiagnosticResult(null);
    setDailySubmissions([]);
    setIsDiagnosticOpen(true);
  };

  const signInWithGoogle = async () => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setIsAuthModalOpen(false);
      confetti({ particleCount: 50, spread: 60 });
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'Failed to sign in with Google. Please try again.');
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    setIsCloudSynced(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const loadDemoProfile = (type: 'engineer' | 'non-engineer' | 'fresh') => {
    if (type === 'engineer') {
      const demoUser: UserProfile = {
        id: 'demo-engineer',
        name: 'Aarav Sharma (Engineer Profile)',
        email: 'aarav.iit@example.com',
        targetPercentile: 99.6,
        dailyHours: 4.5,
        targetIIMs: ['IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta', 'IIM Lucknow'],
        registeredAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        baselineCompleted: true,
        currentDay: 8,
        streak: 7,
        lastActiveDate: new Date().toISOString().split('T')[0],
      };
      // Engineer: QA strong (80-90%), VARC weak/moderate (40-55%), DILR moderate (60%)
      const demoSyllabus = INITIAL_CAT_SYLLABUS.map((t) => {
        if (t.section === 'QA') {
          return { ...t, masteryScore: 82, masteryLevel: 'Strong' as const, totalQuestionsPracticed: 45, accuracy: 88 };
        }
        if (t.section === 'VARC') {
          return { ...t, masteryScore: 42, masteryLevel: 'Weak' as const, totalQuestionsPracticed: 22, accuracy: 52 };
        }
        return { ...t, masteryScore: 64, masteryLevel: 'Moderate' as const, totalQuestionsPracticed: 28, accuracy: 68 };
      });
      setUser(demoUser);
      setSyllabus(demoSyllabus);
      const weakTopics = demoSyllabus.filter((t) => t.masteryLevel === 'Weak').map((t) => t.id);
      const strongTopics = demoSyllabus.filter((t) => t.masteryLevel === 'Strong').map((t) => t.id);
      setRoadmap(generateAdaptiveRoadmap(weakTopics, strongTopics));
      setSelectedDay(8);
      setCurrentTab('dashboard');
    } else if (type === 'non-engineer') {
      const demoUser: UserProfile = {
        id: 'demo-non-engineer',
        name: 'Priya Verma (Non-Engineer/Arts)',
        email: 'priya.srcc@example.com',
        targetPercentile: 99.2,
        dailyHours: 5,
        targetIIMs: ['IIM Ahmedabad', 'IIM Bangalore', 'IIM Kozhikode', 'FMS Delhi'],
        registeredAt: new Date(Date.now() - 12 * 86400000).toISOString(),
        baselineCompleted: true,
        currentDay: 12,
        streak: 11,
        lastActiveDate: new Date().toISOString().split('T')[0],
      };
      // Non-engineer: VARC strong (85%), QA weak (38%), DILR moderate (58%)
      const demoSyllabus = INITIAL_CAT_SYLLABUS.map((t) => {
        if (t.section === 'VARC') {
          return { ...t, masteryScore: 86, masteryLevel: 'Strong' as const, totalQuestionsPracticed: 55, accuracy: 89 };
        }
        if (t.section === 'QA') {
          return { ...t, masteryScore: 38, masteryLevel: 'Weak' as const, totalQuestionsPracticed: 35, accuracy: 48 };
        }
        return { ...t, masteryScore: 58, masteryLevel: 'Moderate' as const, totalQuestionsPracticed: 30, accuracy: 64 };
      });
      setUser(demoUser);
      setSyllabus(demoSyllabus);
      const weakTopics = demoSyllabus.filter((t) => t.masteryLevel === 'Weak').map((t) => t.id);
      const strongTopics = demoSyllabus.filter((t) => t.masteryLevel === 'Strong').map((t) => t.id);
      setRoadmap(generateAdaptiveRoadmap(weakTopics, strongTopics));
      setSelectedDay(12);
      setCurrentTab('dashboard');
    } else {
      // Fresh new aspirant
      const demoUser: UserProfile = {
        id: 'demo-fresh',
        name: 'Vikram Aditya',
        email: 'vikram.cat26@example.com',
        targetPercentile: 98.5,
        dailyHours: 3.5,
        targetIIMs: ['IIM Calcutta', 'IIM Indore', 'XLRI', 'SPJIMR'],
        registeredAt: new Date().toISOString(),
        baselineCompleted: false,
        currentDay: 1,
        streak: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
      };
      setUser(demoUser);
      setSyllabus(INITIAL_CAT_SYLLABUS);
      setRoadmap(generateAdaptiveRoadmap());
      setDiagnosticResult(null);
      setSelectedDay(1);
      setIsDiagnosticOpen(true);
      setCurrentTab('dashboard');
    }
  };

  /**
   * Evaluates the baseline diagnostic test.
   * Auto-scores +3 / -1 for MCQs, calculates topic evaluations,
   * updates the syllabus mastery levels, and generates the tailored 45-day roadmap!
   */
  const submitDiagnostic = (answers: Record<string, number>, timeSpentSeconds: number): DiagnosticResult => {
    let totalScore = 0;
    const maxScore = DIAGNOSTIC_QUESTIONS.length * 3;
    let correctCount = 0;

    const sectionCounts: Record<CATSection, { total: number; correct: number; score: number }> = {
      VARC: { total: 0, correct: 0, score: 0 },
      DILR: { total: 0, correct: 0, score: 0 },
      QA: { total: 0, correct: 0, score: 0 },
    };

    const topicStats: Record<string, { total: number; correct: number; topicName: string; section: CATSection }> = {};

    DIAGNOSTIC_QUESTIONS.forEach((q) => {
      const selected = answers[q.id];
      const isAttempted = selected !== undefined && selected !== -1;
      const isCorrect = isAttempted && selected === q.correctAnswerIndex;

      sectionCounts[q.section].total += 1;

      if (!topicStats[q.topicId]) {
        topicStats[q.topicId] = { total: 0, correct: 0, topicName: q.topicName, section: q.section };
      }
      topicStats[q.topicId].total += 1;

      if (isCorrect) {
        totalScore += 3;
        correctCount += 1;
        sectionCounts[q.section].correct += 1;
        sectionCounts[q.section].score += 3;
        topicStats[q.topicId].correct += 1;
      } else if (isAttempted) {
        totalScore -= 1;
        sectionCounts[q.section].score -= 1;
      }
    });

    const overallAccuracy = Math.round((correctCount / Math.max(1, Object.keys(answers).filter(k => answers[k] !== -1).length)) * 100);
    // Estimated percentile in CAT based on baseline test ratio (scaled to 198)
    const normalizedScore = Math.max(0, Math.round((totalScore / maxScore) * 198));
    const estimatedPercentile = estimatePercentile(normalizedScore);

    const topicEvaluations: TopicEvaluation[] = Object.keys(topicStats).map((topicId) => {
      const stat = topicStats[topicId];
      const accuracy = Math.round((stat.correct / stat.total) * 100);
      let masteryLevel: 'Weak' | 'Moderate' | 'Strong' = 'Moderate';
      let recommendation = 'Review basic concepts and solve 15 medium problems';

      if (accuracy >= 80) {
        masteryLevel = 'Strong';
        recommendation = 'Maintain speed with mixed timed tests; advance to CAT 99th percentile level sets.';
      } else if (accuracy <= 40) {
        masteryLevel = 'Weak';
        recommendation = 'High Priority Deficit: Go through theory fundamentals and build conceptual clarity before timed tests.';
      } else {
        masteryLevel = 'Moderate';
        recommendation = 'Solid base; focus on question selection discipline and avoiding tricky trap choices.';
      }

      return {
        topicId,
        topicName: stat.topicName,
        section: stat.section,
        totalQuestions: stat.total,
        correct: stat.correct,
        accuracy,
        masteryLevel,
        recommendation,
      };
    });

    const weakTopics = topicEvaluations.filter((t) => t.masteryLevel === 'Weak').map((t) => t.topicId);
    const strongTopics = topicEvaluations.filter((t) => t.masteryLevel === 'Strong').map((t) => t.topicId);
    const moderateTopics = topicEvaluations.filter((t) => t.masteryLevel === 'Moderate').map((t) => t.topicId);

    const result: DiagnosticResult = {
      id: `diag-${Date.now()}`,
      date: new Date().toISOString(),
      totalScore: Math.max(0, totalScore),
      maxScore,
      overallAccuracy,
      estimatedPercentile,
      sectionScores: {
        VARC: {
          score: Math.max(0, sectionCounts.VARC.score),
          maxScore: sectionCounts.VARC.total * 3,
          accuracy: Math.round((sectionCounts.VARC.correct / Math.max(1, sectionCounts.VARC.total)) * 100),
        },
        DILR: {
          score: Math.max(0, sectionCounts.DILR.score),
          maxScore: sectionCounts.DILR.total * 3,
          accuracy: Math.round((sectionCounts.DILR.correct / Math.max(1, sectionCounts.DILR.total)) * 100),
        },
        QA: {
          score: Math.max(0, sectionCounts.QA.score),
          maxScore: sectionCounts.QA.total * 3,
          accuracy: Math.round((sectionCounts.QA.correct / Math.max(1, sectionCounts.QA.total)) * 100),
        },
      },
      topicEvaluations,
      weakTopics,
      strongTopics,
      moderateTopics,
    };

    setDiagnosticResult(result);

    // Update syllabus items based on diagnostic
    setSyllabus((prev) =>
      prev.map((subtopic) => {
        const evalItem = topicEvaluations.find((e) => e.topicId === subtopic.id);
        if (evalItem) {
          const score = evalItem.accuracy >= 80 ? 80 : evalItem.accuracy <= 40 ? 30 : 55;
          return {
            ...subtopic,
            masteryScore: score,
            masteryLevel: evalItem.masteryLevel,
            totalQuestionsPracticed: subtopic.totalQuestionsPracticed + evalItem.totalQuestions,
            accuracy: evalItem.accuracy,
          };
        }
        return subtopic;
      })
    );

    // Generate tailored 45-day roadmap prioritizing weak areas
    const adaptiveRoadmap = generateAdaptiveRoadmap(weakTopics, strongTopics);
    setRoadmap(adaptiveRoadmap);

    // Update user profile status
    if (user) {
      setUser({
        ...user,
        baselineCompleted: true,
      });
    }

    // Trigger confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    return result;
  };

  /**
   * Submits a daily test, calculates accuracy, and dynamically updates
   * the mastery levels and syllabus scores of the specific topics tested!
   */
  const submitDailyTest = (
    testedQuestions: Question[],
    userAnswers: Record<string, number>,
    timeSpentSeconds: number
  ) => {
    let score = 0;
    const maxScore = testedQuestions.length * 3;
    let correctCount = 0;

    const topicStats: Record<string, { total: number; correct: number }> = {};
    const mistakes: Question[] = [];

    testedQuestions.forEach((q) => {
      const ans = userAnswers[q.id];
      const isAttempted = ans !== undefined && ans !== -1;
      const isCorrect = isAttempted && ans === q.correctAnswerIndex;

      if (!topicStats[q.topicId]) {
        topicStats[q.topicId] = { total: 0, correct: 0 };
      }
      topicStats[q.topicId].total += 1;

      if (isCorrect) {
        score += 3;
        correctCount += 1;
        topicStats[q.topicId].correct += 1;
      } else {
        if (isAttempted) {
          score -= 1;
          mistakes.push(q);
        }
      }
    });

    const accuracy = Math.round((correctCount / Math.max(1, testedQuestions.length)) * 100);
    const deltas: Record<string, { before: number; after: number; level: MasteryLevel }> = {};

    // Dynamically update syllabus subtopic mastery scores
    setSyllabus((prev) =>
      prev.map((topic) => {
        if (topicStats[topic.id]) {
          const stat = topicStats[topic.id];
          const testTopicAccuracy = (stat.correct / stat.total) * 100;
          // Exponential moving average update for topic mastery
          const oldScore = topic.masteryScore;
          const delta = (testTopicAccuracy - oldScore) * 0.35; // 35% weight on recent test
          const newScore = Math.min(100, Math.max(10, Math.round(oldScore + delta)));
          const newLevel = getMasteryLevel(newScore);

          deltas[topic.id] = {
            before: oldScore,
            after: newScore,
            level: newLevel,
          };

          const newTotalPracticed = topic.totalQuestionsPracticed + stat.total;
          const newAccuracy = Math.round(
            (topic.accuracy * topic.totalQuestionsPracticed + testTopicAccuracy * stat.total) /
              Math.max(1, newTotalPracticed)
          );

          return {
            ...topic,
            masteryScore: newScore,
            masteryLevel: newLevel,
            totalQuestionsPracticed: newTotalPracticed,
            accuracy: newAccuracy,
          };
        }
        return topic;
      })
    );

    // Record daily test submission
    const submission: DailyTestSubmission = {
      id: `daily-sub-${Date.now()}`,
      date: new Date().toISOString(),
      dayNumber: user?.currentDay || 1,
      topicIds: Object.keys(topicStats),
      score: Math.max(0, score),
      maxScore,
      accuracy,
      skillDelta: deltas,
      timeSpentSeconds,
    };
    setDailySubmissions((prev) => [submission, ...prev]);

    if (user?.isFirebaseAuth) {
      FirebaseService.saveDailySubmission(user.id, submission).catch((err) =>
        console.error('Failed to sync submission to Firebase', err)
      );
    }

    // Automatically log mistakes to Error Log if not already present
    mistakes.forEach((m) => {
      const newErr: ErrorLogItem = {
        id: `err-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        date: new Date().toISOString().split('T')[0],
        questionText: m.text.slice(0, 100) + '...',
        topicName: m.topicName,
        section: m.section,
        errorReason: 'Conceptual Gap',
        correctApproach: m.explanation.slice(0, 150) + '...',
        reviewed: false,
      };
      setErrorLog((prev) => [newErr, ...prev]);
      if (user?.isFirebaseAuth) {
        FirebaseService.saveErrorLog(user.id, newErr).catch(console.error);
      }
    });

    // Mark current day completed in roadmap
    if (user) {
      setRoadmap((prev) =>
        prev.map((d) => (d.dayNumber === user.currentDay ? { ...d, isCompleted: true } : d))
      );
    }

    if (accuracy >= 75) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }

    return { score, maxScore, accuracy, deltas };
  };

  const toggleDayCompletion = (dayNumber: number) => {
    setRoadmap((prev) =>
      prev.map((day) => (day.dayNumber === dayNumber ? { ...day, isCompleted: !day.isCompleted } : day))
    );
  };

  const addMockScore = (mock: Omit<MockScore, 'id'>) => {
    const newMock: MockScore = {
      ...mock,
      id: `mock-${Date.now()}`,
    };
    setMockScores((prev) => [newMock, ...prev]);
    if (user?.isFirebaseAuth) {
      FirebaseService.saveMockScore(user.id, newMock).catch(console.error);
    }
    setIsAddMockOpen(false);
    confetti({ particleCount: 60, spread: 60 });
  };

  const deleteMockScore = (id: string) => {
    setMockScores((prev) => prev.filter((m) => m.id !== id));
    if (user?.isFirebaseAuth) {
      FirebaseService.deleteMockScore(user.id, id).catch(console.error);
    }
  };

  const addErrorLogItem = (item: Omit<ErrorLogItem, 'id' | 'date'>) => {
    const newItem: ErrorLogItem = {
      ...item,
      id: `err-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setErrorLog((prev) => [newItem, ...prev]);
    if (user?.isFirebaseAuth) {
      FirebaseService.saveErrorLog(user.id, newItem).catch(console.error);
    }
  };

  const toggleErrorReviewed = (id: string) => {
    setErrorLog((prev) =>
      prev.map((item) => (item.id === id ? { ...item, reviewed: !item.reviewed } : item))
    );
  };

  const updateSubtopicNotes = (id: string, notes: string) => {
    setSyllabus((prev) => prev.map((t) => (t.id === id ? { ...t, notes } : t)));
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setSyllabus(INITIAL_CAT_SYLLABUS);
    setDiagnosticResult(null);
    setRoadmap(generateAdaptiveRoadmap());
    setMockScores(SAMPLE_MOCKS.map((m, idx) => ({ ...m, id: `mock-seed-${idx}` })));
    setDailySubmissions([]);
    setErrorLog([]);
    setCompletedSegmentIds([]);
    setStudySessionLogs([]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        syllabus,
        diagnosticResult,
        roadmap,
        mockScores,
        dailySubmissions,
        errorLog,
        currentTab,
        setCurrentTab,
        selectedDay,
        setSelectedDay,
        isAuthLoading,
        authError,
        isAuthModalOpen,
        setIsAuthModalOpen,
        signInWithGoogle,
        isCloudSynced,
        isDiagnosticOpen,
        setIsDiagnosticOpen,
        isCalculatorOpen,
        setIsCalculatorOpen,
        isFormulaSheetOpen,
        setIsFormulaSheetOpen,
        isAddMockOpen,
        setIsAddMockOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isPomodoroOpen,
        setIsPomodoroOpen,
        activePomodoroSegment,
        setActivePomodoroSegment,
        startPomodoroForSegment,
        completedSegmentIds,
        toggleStudySegment,
        studySessionLogs,
        logStudySession,
        toggleDailyReminder,
        login,
        registerUser,
        logout,
        loadDemoProfile,
        submitDiagnostic,
        submitDailyTest,
        toggleDayCompletion,
        addMockScore,
        deleteMockScore,
        addErrorLogItem,
        toggleErrorReviewed,
        updateSubtopicNotes,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
