/**
 * Training-related types for compliance domain.
 *
 * @module hooks/domains/compliance/types-training
 */

export interface ComplianceTraining {
  id: string;
  title: string;
  description: string;
  category: 'HIPAA' | 'SECURITY' | 'SAFETY' | 'CLINICAL' | 'GENERAL';
  type: 'ONLINE' | 'IN_PERSON' | 'HYBRID';
  duration: number; // in minutes
  isRequired: boolean;
  frequency?: 'ANNUAL' | 'BIANNUAL' | 'QUARTERLY' | 'MONTHLY';
  content: TrainingContent;
  completionCriteria: CompletionCriteria;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingContent {
  modules: TrainingModule[];
  resources: TrainingResource[];
  assessment?: TrainingAssessment;
}

export interface TrainingModule {
  id: string;
  title: string;
  content: string;
  order: number;
  estimatedTime: number;
}

export interface TrainingResource {
  id: string;
  title: string;
  type: 'DOCUMENT' | 'VIDEO' | 'LINK' | 'PRESENTATION';
  url?: string;
  fileName?: string;
}

export interface TrainingAssessment {
  id: string;
  questions: AssessmentQuestion[];
  passingScore: number;
  maxAttempts: number;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

export interface CompletionCriteria {
  requiresAssessment: boolean;
  minimumScore?: number;
  requiresAttendance?: boolean;
  attendanceThreshold?: number;
}

export interface UserTrainingRecord {
  id: string;
  userId: string;
  trainingId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED' | 'FAILED';
  startedAt?: string;
  completedAt?: string;
  expiresAt?: string;
  score?: number;
  attempts: TrainingAttempt[];
  certificateUrl?: string;
}

export interface TrainingAttempt {
  id: string;
  attemptNumber: number;
  startedAt: string;
  completedAt?: string;
  score?: number;
  responses: AssessmentResponse[];
}

export interface AssessmentResponse {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  points: number;
}
