import {
  db,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import {
  UserProfile,
  DailyTestSubmission,
  MockScore,
  StudySessionLog,
  ErrorLogItem,
  DiagnosticResult,
  SyllabusSubtopic,
} from '../types';

export interface UserStudyStateDoc {
  userId: string;
  completedSegmentIds: string[];
  completedDays: number[];
  diagnosticResult: DiagnosticResult | null;
  topicMastery?: Record<string, { masteryScore: number; masteryLevel: string; accuracy: number; totalQuestionsPracticed: number }>;
  updatedAt: string;
}

export const FirebaseService = {
  // --- User Profile ---
  async saveUserProfile(profile: UserProfile): Promise<void> {
    const path = `users/${profile.id}`;
    try {
      await setDoc(doc(db, 'users', profile.id), {
        id: profile.id,
        name: profile.name.slice(0, 100),
        email: profile.email.slice(0, 150),
        targetPercentile: profile.targetPercentile,
        dailyHours: profile.dailyHours,
        targetIIMs: profile.targetIIMs || [],
        registeredAt: profile.registeredAt || new Date().toISOString(),
        baselineCompleted: !!profile.baselineCompleted,
        currentDay: profile.currentDay || 1,
        streak: profile.streak || 1,
        lastActiveDate: profile.lastActiveDate || new Date().toISOString().split('T')[0],
        dailyRemindersEnabled: !!profile.dailyRemindersEnabled,
        reminderTime: profile.reminderTime || '08:00 AM',
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const path = `users/${userId}`;
    try {
      const snap = await getDoc(doc(db, 'users', userId));
      if (!snap.exists()) return null;
      return snap.data() as UserProfile;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  // --- Central Study State ---
  async saveStudyState(
    userId: string,
    state: {
      completedSegmentIds: string[];
      completedDays: number[];
      diagnosticResult: DiagnosticResult | null;
      syllabus?: SyllabusSubtopic[];
    }
  ): Promise<void> {
    const path = `users/${userId}/studyState/current`;
    try {
      const topicMastery: Record<string, any> = {};
      if (state.syllabus) {
        state.syllabus.forEach((t) => {
          topicMastery[t.id] = {
            masteryScore: t.masteryScore,
            masteryLevel: t.masteryLevel,
            accuracy: t.accuracy,
            totalQuestionsPracticed: t.totalQuestionsPracticed,
          };
        });
      }

      await setDoc(doc(db, 'users', userId, 'studyState', 'current'), {
        userId,
        completedSegmentIds: state.completedSegmentIds.slice(0, 500),
        completedDays: state.completedDays.slice(0, 60),
        diagnosticResult: state.diagnosticResult || null,
        topicMastery,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getStudyState(userId: string): Promise<UserStudyStateDoc | null> {
    const path = `users/${userId}/studyState/current`;
    try {
      const snap = await getDoc(doc(db, 'users', userId, 'studyState', 'current'));
      if (!snap.exists()) return null;
      return snap.data() as UserStudyStateDoc;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  // --- Daily Submissions ---
  async saveDailySubmission(userId: string, submission: DailyTestSubmission): Promise<void> {
    const path = `users/${userId}/dailySubmissions/${submission.id}`;
    try {
      await setDoc(doc(db, 'users', userId, 'dailySubmissions', submission.id), {
        id: submission.id,
        userId,
        date: submission.date,
        dayNumber: submission.dayNumber,
        topicIds: submission.topicIds || [],
        score: submission.score,
        maxScore: submission.maxScore,
        accuracy: submission.accuracy,
        timeSpentSeconds: submission.timeSpentSeconds || 0,
        skillDelta: submission.skillDelta || {},
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getDailySubmissions(userId: string): Promise<DailyTestSubmission[]> {
    const path = `users/${userId}/dailySubmissions`;
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'dailySubmissions'));
      const items: DailyTestSubmission[] = [];
      snap.forEach((d) => items.push(d.data() as DailyTestSubmission));
      return items;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  // --- Mock Scores ---
  async saveMockScore(userId: string, mock: MockScore): Promise<void> {
    const path = `users/${userId}/mockScores/${mock.id}`;
    try {
      await setDoc(doc(db, 'users', userId, 'mockScores', mock.id), {
        id: mock.id,
        userId,
        name: mock.name.slice(0, 100),
        date: mock.date,
        type: mock.type,
        varcScore: mock.varcScore,
        dilrScore: mock.dilrScore,
        qaScore: mock.qaScore,
        totalScore: mock.totalScore,
        maxScore: mock.maxScore,
        percentile: mock.percentile,
        accuracy: mock.accuracy,
        timeTakenMinutes: mock.timeTakenMinutes,
        analysisNotes: (mock.analysisNotes || '').slice(0, 1000),
        mistakesSummary: mock.mistakesSummary || {},
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteMockScore(userId: string, mockId: string): Promise<void> {
    const path = `users/${userId}/mockScores/${mockId}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'mockScores', mockId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async getMockScores(userId: string): Promise<MockScore[]> {
    const path = `users/${userId}/mockScores`;
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'mockScores'));
      const items: MockScore[] = [];
      snap.forEach((d) => items.push(d.data() as MockScore));
      return items;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  // --- Pomodoro Session Logs ---
  async saveSessionLog(userId: string, session: StudySessionLog): Promise<void> {
    const path = `users/${userId}/sessionLogs/${session.id}`;
    try {
      await setDoc(doc(db, 'users', userId, 'sessionLogs', session.id), {
        id: session.id,
        userId,
        timestamp: session.timestamp,
        date: session.date,
        topicId: session.topicId.slice(0, 100),
        topicName: session.topicName.slice(0, 100),
        section: session.section.slice(0, 10),
        segmentId: session.segmentId || '',
        durationMinutes: session.durationMinutes,
        completedPomodoros: session.completedPomodoros,
        sessionType: session.sessionType,
        notes: (session.notes || '').slice(0, 500),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getSessionLogs(userId: string): Promise<StudySessionLog[]> {
    const path = `users/${userId}/sessionLogs`;
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'sessionLogs'));
      const items: StudySessionLog[] = [];
      snap.forEach((d) => items.push(d.data() as StudySessionLog));
      return items;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  // --- Error Logs ---
  async saveErrorLog(userId: string, errorItem: ErrorLogItem): Promise<void> {
    const path = `users/${userId}/errorLogs/${errorItem.id}`;
    try {
      await setDoc(doc(db, 'users', userId, 'errorLogs', errorItem.id), {
        id: errorItem.id,
        userId,
        date: errorItem.date,
        questionText: errorItem.questionText.slice(0, 2000),
        topicName: errorItem.topicName.slice(0, 100),
        section: errorItem.section,
        errorReason: errorItem.errorReason,
        correctApproach: errorItem.correctApproach.slice(0, 1000),
        reviewed: !!errorItem.reviewed,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getErrorLogs(userId: string): Promise<ErrorLogItem[]> {
    const path = `users/${userId}/errorLogs`;
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'errorLogs'));
      const items: ErrorLogItem[] = [];
      snap.forEach((d) => items.push(d.data() as ErrorLogItem));
      return items;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },
};
