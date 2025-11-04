/**
 * Compliance Domain Training Type Definitions
 *
 * TypeScript interfaces for training and educational compliance requirements.
 * Supports HIPAA training, safety training, clinical education, and completion
 * tracking for the White Cross Healthcare Platform.
 *
 * @module hooks/domains/compliance/complianceTrainingTypes
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

/**
 * Compliance training module with content, assessments, and completion tracking.
 *
 * @interface ComplianceTraining
 *
 * @property {string} id - Unique training identifier
 * @property {string} title - Training title
 * @property {string} description - Training description
 * @property {'HIPAA' | 'SECURITY' | 'SAFETY' | 'CLINICAL' | 'GENERAL'} category - Training category
 * @property {'ONLINE' | 'IN_PERSON' | 'HYBRID'} type - Training delivery method
 * @property {number} duration - Training duration in minutes
 * @property {boolean} isRequired - Whether training is mandatory
 * @property {'ANNUAL' | 'BIANNUAL' | 'QUARTERLY' | 'MONTHLY'} [frequency] - Required completion frequency
 * @property {TrainingContent} content - Training content and resources
 * @property {CompletionCriteria} completionCriteria - Criteria for completing training
 * @property {string} createdAt - Record creation timestamp (ISO 8601)
 * @property {string} updatedAt - Last update timestamp (ISO 8601)
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

/**
 * Training content structure including modules, resources, and assessments.
 *
 * @interface TrainingContent
 *
 * @property {TrainingModule[]} modules - List of training modules
 * @property {TrainingResource[]} resources - Supporting resources and materials
 * @property {TrainingAssessment} [assessment] - Optional assessment/quiz
 */
export interface TrainingContent {
  modules: TrainingModule[];
  resources: TrainingResource[];
  assessment?: TrainingAssessment;
}

/**
 * Individual training module within a training program.
 *
 * @interface TrainingModule
 *
 * @property {string} id - Unique module identifier
 * @property {string} title - Module title
 * @property {string} content - Module content (markdown or HTML)
 * @property {number} order - Module display order
 * @property {number} estimatedTime - Estimated completion time in minutes
 */
export interface TrainingModule {
  id: string;
  title: string;
  content: string;
  order: number;
  estimatedTime: number;
}

/**
 * Training resource or supporting material.
 *
 * @interface TrainingResource
 *
 * @property {string} id - Unique resource identifier
 * @property {string} title - Resource title
 * @property {'DOCUMENT' | 'VIDEO' | 'LINK' | 'PRESENTATION'} type - Resource type
 * @property {string} [url] - Resource URL (for links and videos)
 * @property {string} [fileName] - File name (for documents and presentations)
 */
export interface TrainingResource {
  id: string;
  title: string;
  type: 'DOCUMENT' | 'VIDEO' | 'LINK' | 'PRESENTATION';
  url?: string;
  fileName?: string;
}

/**
 * Training assessment or quiz.
 *
 * @interface TrainingAssessment
 *
 * @property {string} id - Unique assessment identifier
 * @property {AssessmentQuestion[]} questions - List of assessment questions
 * @property {number} passingScore - Minimum score required to pass (percentage)
 * @property {number} maxAttempts - Maximum number of attempts allowed
 */
export interface TrainingAssessment {
  id: string;
  questions: AssessmentQuestion[];
  passingScore: number;
  maxAttempts: number;
}

/**
 * Individual assessment question.
 *
 * @interface AssessmentQuestion
 *
 * @property {string} id - Unique question identifier
 * @property {string} question - Question text
 * @property {'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER'} type - Question type
 * @property {string[]} [options] - Answer options (for multiple choice)
 * @property {string | string[]} correctAnswer - Correct answer(s)
 * @property {number} points - Points awarded for correct answer
 */
export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

/**
 * Criteria for completing a training.
 *
 * @interface CompletionCriteria
 *
 * @property {boolean} requiresAssessment - Whether assessment completion is required
 * @property {number} [minimumScore] - Minimum assessment score required (percentage)
 * @property {boolean} [requiresAttendance] - Whether attendance tracking is required
 * @property {number} [attendanceThreshold] - Minimum attendance percentage required
 */
export interface CompletionCriteria {
  requiresAssessment: boolean;
  minimumScore?: number;
  requiresAttendance?: boolean;
  attendanceThreshold?: number;
}

/**
 * User training record tracking individual progress and completion.
 *
 * @interface UserTrainingRecord
 *
 * @property {string} id - Unique record identifier
 * @property {string} userId - User identifier
 * @property {string} trainingId - Training identifier
 * @property {'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED' | 'FAILED'} status - Training status
 * @property {string} [startedAt] - When user started training (ISO 8601)
 * @property {string} [completedAt] - When user completed training (ISO 8601)
 * @property {string} [expiresAt] - When training certification expires (ISO 8601)
 * @property {number} [score] - Final assessment score (percentage)
 * @property {TrainingAttempt[]} attempts - List of assessment attempts
 * @property {string} [certificateUrl] - URL to completion certificate
 */
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

/**
 * Individual training attempt or assessment submission.
 *
 * @interface TrainingAttempt
 *
 * @property {string} id - Unique attempt identifier
 * @property {number} attemptNumber - Attempt number (1-indexed)
 * @property {string} startedAt - When attempt started (ISO 8601)
 * @property {string} [completedAt] - When attempt was completed (ISO 8601)
 * @property {number} [score] - Score achieved (percentage)
 * @property {AssessmentResponse[]} responses - List of question responses
 */
export interface TrainingAttempt {
  id: string;
  attemptNumber: number;
  startedAt: string;
  completedAt?: string;
  score?: number;
  responses: AssessmentResponse[];
}

/**
 * Response to an assessment question.
 *
 * @interface AssessmentResponse
 *
 * @property {string} questionId - Question identifier
 * @property {string | string[]} answer - User's answer(s)
 * @property {boolean} isCorrect - Whether answer is correct
 * @property {number} points - Points awarded
 */
export interface AssessmentResponse {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  points: number;
}
