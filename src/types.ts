export type CATSection = 'VARC' | 'DILR' | 'QA';

export type MasteryLevel = 'Weak' | 'Developing' | 'Strong' | 'Moderate';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  isFirebaseAuth?: boolean;
  targetPercentile: number;
  dailyHours: number;
  targetIIMs: string[];
  registeredAt: string;
  baselineCompleted: boolean;
  currentDay: number;
  streak: number;
  lastActiveDate: string;
  dailyRemindersEnabled?: boolean;
  reminderTime?: string;
}

export interface StudySegment {
  id: string;
  slotNumber: number;
  title: string;
  task: string;
  durationMinutes: number; // 30 mins
  category: 'Concept Review' | 'Practice Drill' | 'Timed Test' | 'Error Analysis' | 'Full Mock';
  isCompleted: boolean;
  topicId?: string;
  topicName?: string;
  section?: CATSection;
}

export interface StudySessionLog {
  id: string;
  timestamp: string; // ISO string
  date: string; // YYYY-MM-DD
  topicId: string;
  topicName: string;
  section: CATSection;
  segmentId?: string;
  durationMinutes: number;
  completedPomodoros: number;
  sessionType: 'focus' | 'break';
  notes?: string;
}

export interface SyllabusSubtopic {
  id: string;
  name: string;
  section: CATSection;
  category: string;
  weightage: 'High' | 'Medium' | 'Low'; // in actual CAT
  typicalQuestions: string; // e.g. "4-6 Questions"
  keyConcepts: string[];
  masteryScore: number; // 0 to 100
  masteryLevel: MasteryLevel;
  totalQuestionsPracticed: number;
  accuracy: number; // 0 to 100
  notes?: string;
  isCompleted?: boolean;
}

export interface Question {
  id: string;
  section: CATSection;
  topicId: string;
  topicName: string;
  passage?: string; // For RC or DILR set
  contextHtml?: string;
  text: string;
  options: string[];
  correctAnswerIndex: number; // 0-based
  explanation: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  type: 'MCQ' | 'TITA';
  titaAnswer?: string;
}

export interface TestAnswer {
  questionId: string;
  selectedOptionIndex?: number;
  titaValue?: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  markedForReview: boolean;
}

export interface TopicEvaluation {
  topicId: string;
  topicName: string;
  section: CATSection;
  totalQuestions: number;
  correct: number;
  accuracy: number;
  masteryLevel: MasteryLevel;
  recommendation: string;
}

export interface DiagnosticResult {
  id: string;
  date: string;
  totalScore: number;
  maxScore: number;
  overallAccuracy: number;
  estimatedPercentile: number;
  sectionScores: Record<CATSection, { score: number; maxScore: number; accuracy: number }>;
  topicEvaluations: TopicEvaluation[];
  weakTopics: string[];
  strongTopics: string[];
  moderateTopics: string[];
}

export interface RoadmapDay {
  dayNumber: number;
  phase: 1 | 2 | 3;
  phaseTitle: string;
  title: string;
  focusSection: CATSection | 'ALL';
  primaryTopics: string[];
  goals: string[];
  practiceTarget: string; // e.g., "30 QA questions + 2 RC passages"
  testScheduled?: {
    type: 'DAILY_DRILL' | 'SECTIONAL_MOCK' | 'FULL_MOCK' | 'REVISION_DRILL';
    name: string;
    durationMinutes: number;
    recommendedTime: string;
  };
  keyTips: string[];
  isCompleted: boolean;
  isToday?: boolean;
}

export interface MockScore {
  id: string;
  name: string;
  date: string;
  type: 'Full Mock' | 'VARC Sectional' | 'DILR Sectional' | 'QA Sectional';
  varcScore: number;
  dilrScore: number;
  qaScore: number;
  totalScore: number;
  maxScore: number;
  percentile: number;
  accuracy: number;
  timeTakenMinutes: number;
  analysisNotes: string;
  mistakesSummary?: {
    conceptual: number;
    sillyMistake: number;
    timeManagement: number;
    unforcedGuess: number;
  };
}

export interface DailyTestSubmission {
  id: string;
  date: string;
  dayNumber: number;
  topicIds: string[];
  score: number;
  maxScore: number;
  accuracy: number;
  skillDelta: Record<string, { before: number; after: number; level: MasteryLevel }>;
  timeSpentSeconds: number;
}

export interface ErrorLogItem {
  id: string;
  date: string;
  questionText: string;
  topicName: string;
  section: CATSection;
  errorReason: 'Conceptual Gap' | 'Calculation Mistake' | 'Misread Question' | 'Time Pressure';
  correctApproach: string;
  reviewed: boolean;
}
