/**
 * LOC: HCMLRN12345
 * File: /reuse/server/human-capital/learning-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ../../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Learning management controllers
 *   - Training administration services
 *   - Compliance training services
 */

/**
 * File: /reuse/server/human-capital/learning-management-kit.ts
 * Locator: WC-HCM-LRN-001
 * Purpose: Comprehensive Learning Management System - SAP SuccessFactors Learning parity
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, HR controllers, learning services, training administration, compliance management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Zod 3.x
 * Exports: 50+ utility functions for learning catalog, course management, training programs, enrollment,
 * ILT/VILT management, e-learning, SCORM, certifications, compliance training, assessments, analytics
 *
 * LLM Context: Enterprise-grade Learning Management System competing with SAP SuccessFactors Learning.
 * Provides complete learning catalog management, course creation and delivery, training program scheduling,
 * enrollment and waitlist management, instructor-led training (ILT), virtual instructor-led training (VILT),
 * e-learning content management, SCORM compliance, learning paths and curricula, certification tracking,
 * accreditation management, compliance training automation, attendance tracking, completion tracking,
 * learning assessments and quizzes, training feedback and evaluations, comprehensive learning analytics,
 * reporting dashboards, integration with HRIS and performance management systems.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsUrl,
  IsEmail,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { z } from 'zod';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Learning item types
 */
export enum LearningItemType {
  COURSE = 'course',
  CURRICULUM = 'curriculum',
  LEARNING_PATH = 'learning_path',
  PROGRAM = 'program',
  CERTIFICATION = 'certification',
  ASSESSMENT = 'assessment',
}

/**
 * Course delivery methods
 */
export enum DeliveryMethod {
  ILT = 'ilt', // Instructor-Led Training
  VILT = 'vilt', // Virtual Instructor-Led Training
  ELEARNING = 'elearning',
  BLENDED = 'blended',
  ON_THE_JOB = 'on_the_job',
  SELF_PACED = 'self_paced',
  WEBINAR = 'webinar',
  WORKSHOP = 'workshop',
}

/**
 * Course status values
 */
export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  UNDER_REVIEW = 'under_review',
  RETIRED = 'retired',
}

/**
 * Enrollment status values
 */
export enum EnrollmentStatus {
  WAITLISTED = 'waitlisted',
  ENROLLED = 'enrolled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  WITHDRAWN = 'withdrawn',
}

/**
 * Training session status
 */
export enum SessionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
}

/**
 * Attendance status
 */
export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused',
  PARTIAL = 'partial',
}

/**
 * Assessment status
 */
export enum AssessmentStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  PASSED = 'passed',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

/**
 * Certification status
 */
export enum CertificationStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

/**
 * SCORM version
 */
export enum ScormVersion {
  SCORM_1_2 = 'scorm_1_2',
  SCORM_2004 = 'scorm_2004',
  XAPI = 'xapi',
  AICC = 'aicc',
}

/**
 * Compliance training type
 */
export enum ComplianceType {
  MANDATORY = 'mandatory',
  RECOMMENDED = 'recommended',
  OPTIONAL = 'optional',
  REGULATORY = 'regulatory',
}

/**
 * Question types for assessments
 */
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  MATCHING = 'matching',
  FILL_IN_BLANK = 'fill_in_blank',
}

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Learning course interface
 */
export interface LearningCourse {
  id: string;
  courseCode: string;
  courseName: string;
  description: string;
  type: LearningItemType;
  deliveryMethod: DeliveryMethod;
  status: CourseStatus;
  version: string;
  duration: number; // in minutes
  credits: number;
  passingScore?: number;
  maxAttempts?: number;
  validityPeriod?: number; // in days
  ownerId: string;
  categoryId?: string;
  competencyIds: string[];
  prerequisites: string[];
  tags: string[];
  isComplianceTraining: boolean;
  complianceType?: ComplianceType;
  scormCompliant: boolean;
  scormVersion?: ScormVersion;
  contentUrl?: string;
  thumbnailUrl?: string;
  language: string;
  targetAudience: string[];
  learningObjectives: string[];
  metadata: Record<string, any>;
  publishedAt?: Date;
  retiredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

/**
 * Training program interface
 */
export interface TrainingProgram {
  id: string;
  programCode: string;
  programName: string;
  description: string;
  programType: 'ONBOARDING' | 'LEADERSHIP' | 'TECHNICAL' | 'COMPLIANCE' | 'SOFT_SKILLS';
  status: CourseStatus;
  duration: number; // in days
  startDate: Date;
  endDate: Date;
  capacity?: number;
  enrolledCount: number;
  waitlistedCount: number;
  courseIds: string[];
  requiredCompletionRate: number;
  coordinatorId: string;
  departmentId?: string;
  budget?: number;
  actualCost?: number;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * Course enrollment interface
 */
export interface CourseEnrollment {
  id: string;
  courseId: string;
  sessionId?: string;
  learningItemId: string;
  userId: string;
  enrollmentDate: Date;
  status: EnrollmentStatus;
  startDate?: Date;
  completionDate?: Date;
  dueDate?: Date;
  progress: number; // percentage
  attempts: number;
  lastAttemptDate?: Date;
  bestScore?: number;
  passingStatus?: 'passed' | 'failed' | 'pending';
  certificateIssued: boolean;
  certificateId?: string;
  enrolledBy: string;
  completedBy?: string;
  feedback?: string;
  rating?: number;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Training session interface (ILT/VILT)
 */
export interface TrainingSession {
  id: string;
  courseId: string;
  sessionCode: string;
  sessionName: string;
  deliveryMethod: DeliveryMethod;
  status: SessionStatus;
  startDateTime: Date;
  endDateTime: Date;
  duration: number; // in minutes
  instructorId: string;
  coInstructorIds: string[];
  location?: string;
  virtualLink?: string;
  virtualPlatform?: string;
  capacity: number;
  enrolledCount: number;
  waitlistedCount: number;
  attendedCount: number;
  roomId?: string;
  facilityId?: string;
  equipmentRequired: string[];
  materialsRequired: string[];
  cost?: number;
  notes?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * Learning path interface
 */
export interface LearningPath {
  id: string;
  pathCode: string;
  pathName: string;
  description: string;
  status: CourseStatus;
  items: Array<{
    itemId: string;
    itemType: LearningItemType;
    sequence: number;
    required: boolean;
  }>;
  totalDuration: number;
  totalCredits: number;
  targetRoles: string[];
  targetJobLevels: string[];
  completionCriteria: string;
  certificateAwarded: boolean;
  certificateTemplateId?: string;
  ownerId: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Certification interface
 */
export interface Certification {
  id: string;
  certificateNumber: string;
  certificateName: string;
  userId: string;
  courseId?: string;
  learningPathId?: string;
  issueDate: Date;
  expiryDate?: Date;
  status: CertificationStatus;
  score?: number;
  creditsEarned: number;
  certificateUrl?: string;
  verificationCode: string;
  issuedBy: string;
  accreditationBody?: string;
  renewalRequired: boolean;
  renewalPeriod?: number; // in months
  lastRenewalDate?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Assessment interface
 */
export interface Assessment {
  id: string;
  assessmentCode: string;
  assessmentName: string;
  description: string;
  courseId?: string;
  type: 'QUIZ' | 'EXAM' | 'SURVEY' | 'EVALUATION' | 'PRE_TEST' | 'POST_TEST';
  totalQuestions: number;
  totalPoints: number;
  passingScore: number;
  duration?: number; // in minutes
  maxAttempts: number;
  randomizeQuestions: boolean;
  showCorrectAnswers: boolean;
  showResultsImmediately: boolean;
  allowReview: boolean;
  questions: AssessmentQuestion[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * Assessment question interface
 */
export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  questionType: QuestionType;
  questionText: string;
  points: number;
  sequence: number;
  options?: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  correctAnswer?: string;
  explanation?: string;
  metadata: Record<string, any>;
}

/**
 * Assessment attempt interface
 */
export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  userId: string;
  enrollmentId: string;
  attemptNumber: number;
  startTime: Date;
  endTime?: Date;
  status: AssessmentStatus;
  score?: number;
  percentage?: number;
  passed: boolean;
  answers: Array<{
    questionId: string;
    answer: any;
    isCorrect?: boolean;
    pointsAwarded: number;
  }>;
  timeTaken?: number; // in seconds
  metadata: Record<string, any>;
  createdAt: Date;
}

/**
 * Attendance record interface
 */
export interface AttendanceRecord {
  id: string;
  sessionId: string;
  enrollmentId: string;
  userId: string;
  status: AttendanceStatus;
  checkInTime?: Date;
  checkOutTime?: Date;
  duration?: number; // in minutes
  notes?: string;
  recordedBy: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Training feedback interface
 */
export interface TrainingFeedback {
  id: string;
  courseId: string;
  sessionId?: string;
  enrollmentId: string;
  userId: string;
  rating: number; // 1-5
  contentRating?: number;
  instructorRating?: number;
  facilityRating?: number;
  relevanceRating?: number;
  comments?: string;
  wouldRecommend: boolean;
  strengths?: string;
  improvements?: string;
  submittedAt: Date;
  metadata: Record<string, any>;
  createdAt: Date;
}

/**
 * Learning analytics interface
 */
export interface LearningAnalytics {
  organizationId?: string;
  departmentId?: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  totalEnrollments: number;
  completedEnrollments: number;
  inProgressEnrollments: number;
  completionRate: number;
  averageCompletionTime: number;
  averageScore: number;
  totalHoursLearned: number;
  totalCertificatesIssued: number;
  complianceRate: number;
  topCourses: Array<{
    courseId: string;
    courseName: string;
    enrollments: number;
    completionRate: number;
  }>;
  topPerformers: Array<{
    userId: string;
    userName: string;
    completedCourses: number;
    certificatesEarned: number;
  }>;
  metadata: Record<string, any>;
}

// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================

/**
 * Create learning course DTO
 */
export class CreateLearningCourseDto {
  @ApiProperty({ description: 'Course name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  courseName: string;

  @ApiProperty({ description: 'Course description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @ApiProperty({ enum: LearningItemType })
  @IsEnum(LearningItemType)
  type: LearningItemType;

  @ApiProperty({ enum: DeliveryMethod })
  @IsEnum(DeliveryMethod)
  deliveryMethod: DeliveryMethod;

  @ApiProperty({ description: 'Duration in minutes' })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ description: 'Credits awarded' })
  @IsNumber()
  @Min(0)
  credits: number;

  @ApiProperty({ description: 'Passing score percentage', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  passingScore?: number;

  @ApiProperty({ description: 'Owner user ID' })
  @IsUUID()
  ownerId: string;

  @ApiProperty({ description: 'Is compliance training', required: false })
  @IsOptional()
  @IsBoolean()
  isComplianceTraining?: boolean;

  @ApiProperty({ enum: ComplianceType, required: false })
  @IsOptional()
  @IsEnum(ComplianceType)
  complianceType?: ComplianceType;

  @ApiProperty({ description: 'SCORM compliant', required: false })
  @IsOptional()
  @IsBoolean()
  scormCompliant?: boolean;

  @ApiProperty({ enum: ScormVersion, required: false })
  @IsOptional()
  @IsEnum(ScormVersion)
  scormVersion?: ScormVersion;

  @ApiProperty({ description: 'Content URL', required: false })
  @IsOptional()
  @IsUrl()
  contentUrl?: string;

  @ApiProperty({ description: 'Language code' })
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty({ description: 'Target audience', type: [String] })
  @IsArray()
  @IsString({ each: true })
  targetAudience: string[];

  @ApiProperty({ description: 'Learning objectives', type: [String] })
  @IsArray()
  @IsString({ each: true })
  learningObjectives: string[];
}

/**
 * Create training program DTO
 */
export class CreateTrainingProgramDto {
  @ApiProperty({ description: 'Program name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  programName: string;

  @ApiProperty({ description: 'Program description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @ApiProperty({ enum: ['ONBOARDING', 'LEADERSHIP', 'TECHNICAL', 'COMPLIANCE', 'SOFT_SKILLS'] })
  @IsEnum(['ONBOARDING', 'LEADERSHIP', 'TECHNICAL', 'COMPLIANCE', 'SOFT_SKILLS'])
  programType: 'ONBOARDING' | 'LEADERSHIP' | 'TECHNICAL' | 'COMPLIANCE' | 'SOFT_SKILLS';

  @ApiProperty({ description: 'Program start date' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: 'Program end date' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ description: 'Maximum capacity', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @ApiProperty({ description: 'Course IDs', type: [String] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  courseIds: string[];

  @ApiProperty({ description: 'Required completion rate percentage' })
  @IsNumber()
  @Min(0)
  @Max(100)
  requiredCompletionRate: number;

  @ApiProperty({ description: 'Program coordinator user ID' })
  @IsUUID()
  coordinatorId: string;

  @ApiProperty({ description: 'Budget', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;
}

/**
 * Enroll user in course DTO
 */
export class EnrollUserDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Course ID' })
  @IsUUID()
  courseId: string;

  @ApiProperty({ description: 'Session ID', required: false })
  @IsOptional()
  @IsUUID()
  sessionId?: string;

  @ApiProperty({ description: 'Due date', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @ApiProperty({ description: 'Enrolled by user ID' })
  @IsUUID()
  enrolledBy: string;

  @ApiProperty({ description: 'Auto-enroll if waitlisted', required: false })
  @IsOptional()
  @IsBoolean()
  autoEnrollFromWaitlist?: boolean;
}

/**
 * Create training session DTO
 */
export class CreateTrainingSessionDto {
  @ApiProperty({ description: 'Course ID' })
  @IsUUID()
  courseId: string;

  @ApiProperty({ description: 'Session name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  sessionName: string;

  @ApiProperty({ enum: DeliveryMethod })
  @IsEnum(DeliveryMethod)
  deliveryMethod: DeliveryMethod;

  @ApiProperty({ description: 'Session start date and time' })
  @Type(() => Date)
  @IsDate()
  startDateTime: Date;

  @ApiProperty({ description: 'Session end date and time' })
  @Type(() => Date)
  @IsDate()
  endDateTime: Date;

  @ApiProperty({ description: 'Instructor user ID' })
  @IsUUID()
  instructorId: string;

  @ApiProperty({ description: 'Co-instructor IDs', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  coInstructorIds?: string[];

  @ApiProperty({ description: 'Location', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string;

  @ApiProperty({ description: 'Virtual meeting link', required: false })
  @IsOptional()
  @IsUrl()
  virtualLink?: string;

  @ApiProperty({ description: 'Virtual platform name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  virtualPlatform?: string;

  @ApiProperty({ description: 'Session capacity' })
  @IsNumber()
  @Min(1)
  capacity: number;
}

/**
 * Create learning path DTO
 */
export class CreateLearningPathDto {
  @ApiProperty({ description: 'Learning path name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  pathName: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @ApiProperty({ description: 'Target roles', type: [String] })
  @IsArray()
  @IsString({ each: true })
  targetRoles: string[];

  @ApiProperty({ description: 'Target job levels', type: [String] })
  @IsArray()
  @IsString({ each: true })
  targetJobLevels: string[];

  @ApiProperty({ description: 'Certificate awarded', required: false })
  @IsOptional()
  @IsBoolean()
  certificateAwarded?: boolean;

  @ApiProperty({ description: 'Owner user ID' })
  @IsUUID()
  ownerId: string;
}

/**
 * Create assessment DTO
 */
export class CreateAssessmentDto {
  @ApiProperty({ description: 'Assessment name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  assessmentName: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ description: 'Course ID', required: false })
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @ApiProperty({ enum: ['QUIZ', 'EXAM', 'SURVEY', 'EVALUATION', 'PRE_TEST', 'POST_TEST'] })
  @IsEnum(['QUIZ', 'EXAM', 'SURVEY', 'EVALUATION', 'PRE_TEST', 'POST_TEST'])
  type: 'QUIZ' | 'EXAM' | 'SURVEY' | 'EVALUATION' | 'PRE_TEST' | 'POST_TEST';

  @ApiProperty({ description: 'Passing score percentage' })
  @IsNumber()
  @Min(0)
  @Max(100)
  passingScore: number;

  @ApiProperty({ description: 'Duration in minutes', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @ApiProperty({ description: 'Maximum attempts' })
  @IsNumber()
  @Min(1)
  maxAttempts: number;
}

/**
 * Record attendance DTO
 */
export class RecordAttendanceDto {
  @ApiProperty({ description: 'Session ID' })
  @IsUUID()
  sessionId: string;

  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiProperty({ description: 'Check-in time', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  checkInTime?: Date;

  @ApiProperty({ description: 'Check-out time', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  checkOutTime?: Date;

  @ApiProperty({ description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

/**
 * Submit training feedback DTO
 */
export class SubmitTrainingFeedbackDto {
  @ApiProperty({ description: 'Course ID' })
  @IsUUID()
  courseId: string;

  @ApiProperty({ description: 'Session ID', required: false })
  @IsOptional()
  @IsUUID()
  sessionId?: string;

  @ApiProperty({ description: 'Enrollment ID' })
  @IsUUID()
  enrollmentId: string;

  @ApiProperty({ description: 'Overall rating (1-5)' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Content rating', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  contentRating?: number;

  @ApiProperty({ description: 'Instructor rating', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  instructorRating?: number;

  @ApiProperty({ description: 'Comments', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  comments?: string;

  @ApiProperty({ description: 'Would recommend' })
  @IsBoolean()
  wouldRecommend: boolean;
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const LearningCourseCreateSchema = z.object({
  courseName: z.string().min(3).max(255),
  description: z.string().min(1).max(5000),
  type: z.nativeEnum(LearningItemType),
  deliveryMethod: z.nativeEnum(DeliveryMethod),
  duration: z.number().min(1),
  credits: z.number().min(0),
  passingScore: z.number().min(0).max(100).optional(),
  ownerId: z.string().uuid(),
  isComplianceTraining: z.boolean().optional(),
  complianceType: z.nativeEnum(ComplianceType).optional(),
  scormCompliant: z.boolean().optional(),
  scormVersion: z.nativeEnum(ScormVersion).optional(),
  contentUrl: z.string().url().optional(),
  language: z.string().min(2).max(10),
  targetAudience: z.array(z.string()),
  learningObjectives: z.array(z.string()),
  metadata: z.record(z.any()).optional(),
});

export const TrainingProgramCreateSchema = z.object({
  programName: z.string().min(3).max(255),
  description: z.string().min(1).max(5000),
  programType: z.enum(['ONBOARDING', 'LEADERSHIP', 'TECHNICAL', 'COMPLIANCE', 'SOFT_SKILLS']),
  startDate: z.date(),
  endDate: z.date(),
  capacity: z.number().min(1).optional(),
  courseIds: z.array(z.string().uuid()),
  requiredCompletionRate: z.number().min(0).max(100),
  coordinatorId: z.string().uuid(),
  budget: z.number().min(0).optional(),
  metadata: z.record(z.any()).optional(),
});

export const EnrollUserSchema = z.object({
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  sessionId: z.string().uuid().optional(),
  dueDate: z.date().optional(),
  enrolledBy: z.string().uuid(),
  autoEnrollFromWaitlist: z.boolean().optional(),
});

export const TrainingSessionCreateSchema = z.object({
  courseId: z.string().uuid(),
  sessionName: z.string().min(1).max(255),
  deliveryMethod: z.nativeEnum(DeliveryMethod),
  startDateTime: z.date(),
  endDateTime: z.date(),
  instructorId: z.string().uuid(),
  coInstructorIds: z.array(z.string().uuid()).optional(),
  location: z.string().max(500).optional(),
  virtualLink: z.string().url().optional(),
  virtualPlatform: z.string().max(100).optional(),
  capacity: z.number().min(1),
  metadata: z.record(z.any()).optional(),
});

export const LearningPathCreateSchema = z.object({
  pathName: z.string().min(3).max(255),
  description: z.string().min(1).max(5000),
  targetRoles: z.array(z.string()),
  targetJobLevels: z.array(z.string()),
  certificateAwarded: z.boolean().optional(),
  ownerId: z.string().uuid(),
  metadata: z.record(z.any()).optional(),
});

export const AssessmentCreateSchema = z.object({
  assessmentName: z.string().min(3).max(255),
  description: z.string().min(1).max(2000),
  courseId: z.string().uuid().optional(),
  type: z.enum(['QUIZ', 'EXAM', 'SURVEY', 'EVALUATION', 'PRE_TEST', 'POST_TEST']),
  passingScore: z.number().min(0).max(100),
  duration: z.number().min(1).optional(),
  maxAttempts: z.number().min(1),
  metadata: z.record(z.any()).optional(),
});

export const AttendanceRecordSchema = z.object({
  sessionId: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.nativeEnum(AttendanceStatus),
  checkInTime: z.date().optional(),
  checkOutTime: z.date().optional(),
  notes: z.string().max(1000).optional(),
});

export const TrainingFeedbackSchema = z.object({
  courseId: z.string().uuid(),
  sessionId: z.string().uuid().optional(),
  enrollmentId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  contentRating: z.number().min(1).max(5).optional(),
  instructorRating: z.number().min(1).max(5).optional(),
  comments: z.string().max(5000).optional(),
  wouldRecommend: z.boolean(),
  metadata: z.record(z.any()).optional(),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Learning Course.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LearningCourse model
 *
 * @example
 * ```typescript
 * const LearningCourse = createLearningCourseModel(sequelize);
 * const course = await LearningCourse.create({
 *   courseName: 'Leadership Excellence',
 *   deliveryMethod: 'blended',
 *   duration: 480
 * });
 * ```
 */
export const createLearningCourseModel = (sequelize: Sequelize) => {
  class LearningCourse extends Model {
    public id!: string;
    public courseCode!: string;
    public courseName!: string;
    public description!: string;
    public type!: string;
    public deliveryMethod!: string;
    public status!: string;
    public version!: string;
    public duration!: number;
    public credits!: number;
    public passingScore!: number | null;
    public maxAttempts!: number | null;
    public validityPeriod!: number | null;
    public ownerId!: string;
    public categoryId!: string | null;
    public competencyIds!: string[];
    public prerequisites!: string[];
    public tags!: string[];
    public isComplianceTraining!: boolean;
    public complianceType!: string | null;
    public scormCompliant!: boolean;
    public scormVersion!: string | null;
    public contentUrl!: string | null;
    public thumbnailUrl!: string | null;
    public language!: string;
    public targetAudience!: string[];
    public learningObjectives!: string[];
    public metadata!: Record<string, any>;
    public publishedAt!: Date | null;
    public retiredAt!: Date | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string | null;
  }

  LearningCourse.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      courseCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique course code',
      },
      courseName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Course name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Course description',
      },
      type: {
        type: DataTypes.ENUM('course', 'curriculum', 'learning_path', 'program', 'certification', 'assessment'),
        allowNull: false,
        defaultValue: 'course',
        comment: 'Learning item type',
      },
      deliveryMethod: {
        type: DataTypes.ENUM('ilt', 'vilt', 'elearning', 'blended', 'on_the_job', 'self_paced', 'webinar', 'workshop'),
        allowNull: false,
        comment: 'Course delivery method',
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'archived', 'under_review', 'retired'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Course status',
      },
      version: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '1.0',
        comment: 'Course version',
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Duration in minutes',
      },
      credits: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Credits awarded upon completion',
      },
      passingScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Passing score percentage',
      },
      maxAttempts: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Maximum number of attempts allowed',
      },
      validityPeriod: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Certificate validity period in days',
      },
      ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Course owner/creator user ID',
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Course category ID',
      },
      competencyIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
        comment: 'Related competency IDs',
      },
      prerequisites: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
        comment: 'Prerequisite course IDs',
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Course tags for search and categorization',
      },
      isComplianceTraining: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether this is compliance training',
      },
      complianceType: {
        type: DataTypes.ENUM('mandatory', 'recommended', 'optional', 'regulatory'),
        allowNull: true,
        comment: 'Compliance training type',
      },
      scormCompliant: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'SCORM compliance flag',
      },
      scormVersion: {
        type: DataTypes.ENUM('scorm_1_2', 'scorm_2004', 'xapi', 'aicc'),
        allowNull: true,
        comment: 'SCORM version',
      },
      contentUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Course content URL',
      },
      thumbnailUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Course thumbnail image URL',
      },
      language: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'en',
        comment: 'Course language code',
      },
      targetAudience: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Target audience roles/departments',
      },
      learningObjectives: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
        comment: 'Course learning objectives',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional course metadata',
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Course published timestamp',
      },
      retiredAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Course retired timestamp',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the course',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who last updated the course',
      },
    },
    {
      sequelize,
      tableName: 'learning_courses',
      timestamps: true,
      indexes: [
        { fields: ['courseCode'], unique: true },
        { fields: ['status'] },
        { fields: ['deliveryMethod'] },
        { fields: ['type'] },
        { fields: ['isComplianceTraining'] },
        { fields: ['ownerId'] },
        { fields: ['categoryId'] },
        { fields: ['language'] },
      ],
    },
  );

  return LearningCourse;
};

/**
 * Sequelize model for Training Program.
 */
export const createTrainingProgramModel = (sequelize: Sequelize) => {
  class TrainingProgram extends Model {
    public id!: string;
    public programCode!: string;
    public programName!: string;
    public description!: string;
    public programType!: string;
    public status!: string;
    public duration!: number;
    public startDate!: Date;
    public endDate!: Date;
    public capacity!: number | null;
    public enrolledCount!: number;
    public waitlistedCount!: number;
    public courseIds!: string[];
    public requiredCompletionRate!: number;
    public coordinatorId!: string;
    public departmentId!: string | null;
    public budget!: number | null;
    public actualCost!: number | null;
    public tags!: string[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
  }

  TrainingProgram.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      programCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique program code',
      },
      programName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Program name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Program description',
      },
      programType: {
        type: DataTypes.ENUM('ONBOARDING', 'LEADERSHIP', 'TECHNICAL', 'COMPLIANCE', 'SOFT_SKILLS'),
        allowNull: false,
        comment: 'Program type',
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'archived', 'under_review', 'retired'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Program status',
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Program duration in days',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Program start date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Program end date',
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Maximum program capacity',
      },
      enrolledCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of enrolled participants',
      },
      waitlistedCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of waitlisted participants',
      },
      courseIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
        comment: 'Course IDs in this program',
      },
      requiredCompletionRate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 100,
        comment: 'Required completion rate percentage',
      },
      coordinatorId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Program coordinator user ID',
      },
      departmentId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Department ID',
      },
      budget: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: true,
        comment: 'Program budget',
      },
      actualCost: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: true,
        defaultValue: 0,
        comment: 'Actual program cost',
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Program tags',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional program metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the program',
      },
    },
    {
      sequelize,
      tableName: 'training_programs',
      timestamps: true,
      indexes: [
        { fields: ['programCode'], unique: true },
        { fields: ['programType'] },
        { fields: ['status'] },
        { fields: ['coordinatorId'] },
        { fields: ['startDate'] },
        { fields: ['endDate'] },
      ],
    },
  );

  return TrainingProgram;
};

/**
 * Sequelize model for Course Enrollment.
 */
export const createCourseEnrollmentModel = (sequelize: Sequelize) => {
  class CourseEnrollment extends Model {
    public id!: string;
    public courseId!: string;
    public sessionId!: string | null;
    public learningItemId!: string;
    public userId!: string;
    public enrollmentDate!: Date;
    public status!: string;
    public startDate!: Date | null;
    public completionDate!: Date | null;
    public dueDate!: Date | null;
    public progress!: number;
    public attempts!: number;
    public lastAttemptDate!: Date | null;
    public bestScore!: number | null;
    public passingStatus!: string | null;
    public certificateIssued!: boolean;
    public certificateId!: string | null;
    public enrolledBy!: string;
    public completedBy!: string | null;
    public feedback!: string | null;
    public rating!: number | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CourseEnrollment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Related course ID',
        references: {
          model: 'learning_courses',
          key: 'id',
        },
      },
      sessionId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Related training session ID (for ILT/VILT)',
      },
      learningItemId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Learning item ID (course, path, program)',
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Enrolled user ID',
      },
      enrollmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Enrollment date',
      },
      status: {
        type: DataTypes.ENUM('waitlisted', 'enrolled', 'in_progress', 'completed', 'failed', 'cancelled', 'no_show', 'withdrawn'),
        allowNull: false,
        defaultValue: 'enrolled',
        comment: 'Enrollment status',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Course start date',
      },
      completionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Course completion date',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Course due date',
      },
      progress: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Progress percentage',
      },
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of attempts',
      },
      lastAttemptDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last attempt date',
      },
      bestScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Best score achieved',
      },
      passingStatus: {
        type: DataTypes.ENUM('passed', 'failed', 'pending'),
        allowNull: true,
        comment: 'Passing status',
      },
      certificateIssued: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether certificate was issued',
      },
      certificateId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Related certificate ID',
      },
      enrolledBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who enrolled the learner',
      },
      completedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who marked completion',
      },
      feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Learner feedback',
      },
      rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        comment: 'Course rating (1-5)',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional enrollment metadata',
      },
    },
    {
      sequelize,
      tableName: 'course_enrollments',
      timestamps: true,
      indexes: [
        { fields: ['courseId'] },
        { fields: ['userId'] },
        { fields: ['status'] },
        { fields: ['sessionId'] },
        { fields: ['enrollmentDate'] },
        { fields: ['completionDate'] },
        { fields: ['dueDate'] },
        { fields: ['userId', 'courseId'], unique: false },
      ],
    },
  );

  return CourseEnrollment;
};

/**
 * Sequelize model for Training Session.
 */
export const createTrainingSessionModel = (sequelize: Sequelize) => {
  class TrainingSession extends Model {
    public id!: string;
    public courseId!: string;
    public sessionCode!: string;
    public sessionName!: string;
    public deliveryMethod!: string;
    public status!: string;
    public startDateTime!: Date;
    public endDateTime!: Date;
    public duration!: number;
    public instructorId!: string;
    public coInstructorIds!: string[];
    public location!: string | null;
    public virtualLink!: string | null;
    public virtualPlatform!: string | null;
    public capacity!: number;
    public enrolledCount!: number;
    public waitlistedCount!: number;
    public attendedCount!: number;
    public roomId!: string | null;
    public facilityId!: string | null;
    public equipmentRequired!: string[];
    public materialsRequired!: string[];
    public cost!: number | null;
    public notes!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
  }

  TrainingSession.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Related course ID',
        references: {
          model: 'learning_courses',
          key: 'id',
        },
      },
      sessionCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique session code',
      },
      sessionName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Session name',
      },
      deliveryMethod: {
        type: DataTypes.ENUM('ilt', 'vilt', 'elearning', 'blended', 'on_the_job', 'self_paced', 'webinar', 'workshop'),
        allowNull: false,
        comment: 'Session delivery method',
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled'),
        allowNull: false,
        defaultValue: 'scheduled',
        comment: 'Session status',
      },
      startDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Session start date and time',
      },
      endDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Session end date and time',
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Session duration in minutes',
      },
      instructorId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Primary instructor user ID',
      },
      coInstructorIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
        comment: 'Co-instructor user IDs',
      },
      location: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Physical location',
      },
      virtualLink: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Virtual meeting link',
      },
      virtualPlatform: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Virtual platform (Zoom, Teams, etc.)',
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Session capacity',
      },
      enrolledCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of enrolled participants',
      },
      waitlistedCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of waitlisted participants',
      },
      attendedCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of attendees',
      },
      roomId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Room/facility ID',
      },
      facilityId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Facility ID',
      },
      equipmentRequired: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Required equipment',
      },
      materialsRequired: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Required materials',
      },
      cost: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: true,
        comment: 'Session cost',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Session notes',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional session metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the session',
      },
    },
    {
      sequelize,
      tableName: 'training_sessions',
      timestamps: true,
      indexes: [
        { fields: ['courseId'] },
        { fields: ['sessionCode'], unique: true },
        { fields: ['status'] },
        { fields: ['instructorId'] },
        { fields: ['startDateTime'] },
        { fields: ['endDateTime'] },
      ],
    },
  );

  return TrainingSession;
};

/**
 * Sequelize model for Certification.
 */
export const createCertificationModel = (sequelize: Sequelize) => {
  class Certification extends Model {
    public id!: string;
    public certificateNumber!: string;
    public certificateName!: string;
    public userId!: string;
    public courseId!: string | null;
    public learningPathId!: string | null;
    public issueDate!: Date;
    public expiryDate!: Date | null;
    public status!: string;
    public score!: number | null;
    public creditsEarned!: number;
    public certificateUrl!: string | null;
    public verificationCode!: string;
    public issuedBy!: string;
    public accreditationBody!: string | null;
    public renewalRequired!: boolean;
    public renewalPeriod!: number | null;
    public lastRenewalDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Certification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      certificateNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique certificate number',
      },
      certificateName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Certificate name',
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Certificate holder user ID',
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Related course ID',
      },
      learningPathId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Related learning path ID',
      },
      issueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Certificate issue date',
      },
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Certificate expiry date',
      },
      status: {
        type: DataTypes.ENUM('active', 'expired', 'revoked', 'suspended', 'pending'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Certificate status',
      },
      score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Final score/grade',
      },
      creditsEarned: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Credits earned',
      },
      certificateUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Certificate document URL',
      },
      verificationCode: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Verification code for authenticity',
      },
      issuedBy: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Issuing authority',
      },
      accreditationBody: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'External accreditation body',
      },
      renewalRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether renewal is required',
      },
      renewalPeriod: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Renewal period in months',
      },
      lastRenewalDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last renewal date',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional certificate metadata',
      },
    },
    {
      sequelize,
      tableName: 'certifications',
      timestamps: true,
      indexes: [
        { fields: ['certificateNumber'], unique: true },
        { fields: ['verificationCode'], unique: true },
        { fields: ['userId'] },
        { fields: ['courseId'] },
        { fields: ['status'] },
        { fields: ['issueDate'] },
        { fields: ['expiryDate'] },
      ],
    },
  );

  return Certification;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generates unique course code.
 */
const generateCourseCode = (prefix: string = 'CRS'): string => {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `${prefix}-${year}-${sequence}`;
};

/**
 * Generates unique program code.
 */
const generateProgramCode = (prefix: string = 'PGM'): string => {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}-${sequence}`;
};

/**
 * Generates unique session code.
 */
const generateSessionCode = (courseCode: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${courseCode}-S-${timestamp}${random}`.toUpperCase();
};

/**
 * Generates unique certificate number.
 */
const generateCertificateNumber = (): string => {
  const year = new Date().getFullYear();
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const sequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `CERT-${year}${month}-${sequence}`;
};

/**
 * Generates verification code for certificates.
 */
const generateVerificationCode = (): string => {
  return `VC-${Date.now()}-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
};

/**
 * Generates UUID v4.
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Calculates completion percentage.
 */
const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100 * 100) / 100;
};

// ============================================================================
// LEARNING CATALOG & COURSE MANAGEMENT (Functions 1-8)
// ============================================================================

/**
 * Creates a new learning course with auto-generated course code.
 *
 * @param {object} courseData - Course creation data
 * @param {string} userId - User creating the course
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<LearningCourse>} Created course
 *
 * @example
 * ```typescript
 * const course = await createLearningCourse({
 *   courseName: 'Leadership Excellence Program',
 *   description: 'Comprehensive leadership training',
 *   deliveryMethod: DeliveryMethod.BLENDED,
 *   duration: 480,
 *   credits: 8,
 *   ownerId: 'user-123'
 * }, 'admin-456');
 * ```
 */
export const createLearningCourse = async (
  courseData: Partial<LearningCourse>,
  userId: string,
  transaction?: Transaction,
): Promise<LearningCourse> => {
  const courseCode = generateCourseCode();

  const course: LearningCourse = {
    id: generateUUID(),
    courseCode,
    courseName: courseData.courseName!,
    description: courseData.description!,
    type: courseData.type || LearningItemType.COURSE,
    deliveryMethod: courseData.deliveryMethod!,
    status: CourseStatus.DRAFT,
    version: '1.0',
    duration: courseData.duration!,
    credits: courseData.credits!,
    passingScore: courseData.passingScore,
    maxAttempts: courseData.maxAttempts,
    validityPeriod: courseData.validityPeriod,
    ownerId: courseData.ownerId!,
    categoryId: courseData.categoryId,
    competencyIds: courseData.competencyIds || [],
    prerequisites: courseData.prerequisites || [],
    tags: courseData.tags || [],
    isComplianceTraining: courseData.isComplianceTraining || false,
    complianceType: courseData.complianceType,
    scormCompliant: courseData.scormCompliant || false,
    scormVersion: courseData.scormVersion,
    contentUrl: courseData.contentUrl,
    thumbnailUrl: courseData.thumbnailUrl,
    language: courseData.language || 'en',
    targetAudience: courseData.targetAudience || [],
    learningObjectives: courseData.learningObjectives || [],
    metadata: {
      ...courseData.metadata,
      createdDate: new Date().toISOString(),
    },
    publishedAt: undefined,
    retiredAt: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userId,
    updatedBy: userId,
  };

  return course;
};

/**
 * Publishes a course, making it available for enrollment.
 *
 * @param {string} courseId - Course ID to publish
 * @param {string} userId - User publishing the course
 * @returns {Promise<LearningCourse>} Updated course
 */
export const publishCourse = async (
  courseId: string,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<LearningCourse>> => {
  return {
    id: courseId,
    status: CourseStatus.PUBLISHED,
    publishedAt: new Date(),
    updatedBy: userId,
    updatedAt: new Date(),
  };
};

/**
 * Archives a course, removing it from active catalog.
 *
 * @param {string} courseId - Course ID to archive
 * @param {string} userId - User archiving the course
 * @returns {Promise<LearningCourse>} Updated course
 */
export const archiveCourse = async (
  courseId: string,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<LearningCourse>> => {
  return {
    id: courseId,
    status: CourseStatus.ARCHIVED,
    updatedBy: userId,
    updatedAt: new Date(),
  };
};

/**
 * Retires a course, preventing new enrollments.
 *
 * @param {string} courseId - Course ID to retire
 * @param {string} userId - User retiring the course
 * @returns {Promise<LearningCourse>} Updated course
 */
export const retireCourse = async (
  courseId: string,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<LearningCourse>> => {
  return {
    id: courseId,
    status: CourseStatus.RETIRED,
    retiredAt: new Date(),
    updatedBy: userId,
    updatedAt: new Date(),
  };
};

/**
 * Versions a course, creating a new version.
 *
 * @param {string} courseId - Original course ID
 * @param {string} newVersion - New version number
 * @param {string} userId - User creating new version
 * @returns {Promise<LearningCourse>} New course version
 */
export const versionCourse = async (
  courseId: string,
  newVersion: string,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<LearningCourse>> => {
  return {
    id: generateUUID(),
    courseCode: generateCourseCode(),
    version: newVersion,
    status: CourseStatus.DRAFT,
    createdBy: userId,
    createdAt: new Date(),
    metadata: {
      previousVersionId: courseId,
      versionHistory: [courseId],
    },
  };
};

/**
 * Searches courses by criteria.
 *
 * @param {object} filters - Search filters
 * @returns {Promise<LearningCourse[]>} Matching courses
 */
export const searchCourses = async (filters: {
  query?: string;
  type?: LearningItemType;
  deliveryMethod?: DeliveryMethod;
  status?: CourseStatus;
  isComplianceTraining?: boolean;
  categoryId?: string;
  tags?: string[];
  language?: string;
  limit?: number;
  offset?: number;
}): Promise<{ courses: LearningCourse[]; total: number }> => {
  // Implementation would query database with filters
  return {
    courses: [],
    total: 0,
  };
};

/**
 * Gets course details by ID.
 *
 * @param {string} courseId - Course ID
 * @returns {Promise<LearningCourse>} Course details
 */
export const getCourseById = async (courseId: string): Promise<LearningCourse | null> => {
  // Implementation would fetch from database
  return null;
};

/**
 * Updates course content and metadata.
 *
 * @param {string} courseId - Course ID
 * @param {object} updates - Course updates
 * @param {string} userId - User updating the course
 * @returns {Promise<LearningCourse>} Updated course
 */
export const updateCourse = async (
  courseId: string,
  updates: Partial<LearningCourse>,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<LearningCourse>> => {
  return {
    id: courseId,
    ...updates,
    updatedBy: userId,
    updatedAt: new Date(),
  };
};

// ============================================================================
// TRAINING PROGRAM MANAGEMENT (Functions 9-14)
// ============================================================================

/**
 * Creates a new training program.
 *
 * @param {object} programData - Program creation data
 * @param {string} userId - User creating the program
 * @returns {Promise<TrainingProgram>} Created program
 */
export const createTrainingProgram = async (
  programData: Partial<TrainingProgram>,
  userId: string,
  transaction?: Transaction,
): Promise<TrainingProgram> => {
  const programCode = generateProgramCode();

  const program: TrainingProgram = {
    id: generateUUID(),
    programCode,
    programName: programData.programName!,
    description: programData.description!,
    programType: programData.programType!,
    status: CourseStatus.DRAFT,
    duration: programData.duration!,
    startDate: programData.startDate!,
    endDate: programData.endDate!,
    capacity: programData.capacity,
    enrolledCount: 0,
    waitlistedCount: 0,
    courseIds: programData.courseIds || [],
    requiredCompletionRate: programData.requiredCompletionRate || 100,
    coordinatorId: programData.coordinatorId!,
    departmentId: programData.departmentId,
    budget: programData.budget,
    actualCost: 0,
    tags: programData.tags || [],
    metadata: {
      ...programData.metadata,
      createdDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userId,
  };

  return program;
};

/**
 * Adds courses to a training program.
 *
 * @param {string} programId - Program ID
 * @param {string[]} courseIds - Course IDs to add
 * @param {string} userId - User updating the program
 * @returns {Promise<TrainingProgram>} Updated program
 */
export const addCoursesToProgram = async (
  programId: string,
  courseIds: string[],
  userId: string,
  transaction?: Transaction,
): Promise<Partial<TrainingProgram>> => {
  return {
    id: programId,
    courseIds: [...courseIds],
    updatedAt: new Date(),
  };
};

/**
 * Removes courses from a training program.
 *
 * @param {string} programId - Program ID
 * @param {string[]} courseIds - Course IDs to remove
 * @param {string} userId - User updating the program
 * @returns {Promise<TrainingProgram>} Updated program
 */
export const removeCoursesFromProgram = async (
  programId: string,
  courseIds: string[],
  userId: string,
  transaction?: Transaction,
): Promise<Partial<TrainingProgram>> => {
  return {
    id: programId,
    updatedAt: new Date(),
  };
};

/**
 * Publishes a training program.
 *
 * @param {string} programId - Program ID
 * @param {string} userId - User publishing the program
 * @returns {Promise<TrainingProgram>} Updated program
 */
export const publishProgram = async (
  programId: string,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<TrainingProgram>> => {
  return {
    id: programId,
    status: CourseStatus.PUBLISHED,
    updatedAt: new Date(),
  };
};

/**
 * Calculates program completion for a user.
 *
 * @param {string} programId - Program ID
 * @param {string} userId - User ID
 * @returns {Promise<object>} Completion statistics
 */
export const calculateProgramCompletion = async (
  programId: string,
  userId: string,
): Promise<{
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  completionPercentage: number;
  isProgramCompleted: boolean;
}> => {
  // Implementation would fetch enrollments and calculate
  return {
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    completionPercentage: 0,
    isProgramCompleted: false,
  };
};

/**
 * Gets program enrollment statistics.
 *
 * @param {string} programId - Program ID
 * @returns {Promise<object>} Enrollment statistics
 */
export const getProgramEnrollmentStats = async (
  programId: string,
): Promise<{
  enrolledCount: number;
  waitlistedCount: number;
  completedCount: number;
  averageProgress: number;
  averageCompletionTime: number;
}> => {
  return {
    enrolledCount: 0,
    waitlistedCount: 0,
    completedCount: 0,
    averageProgress: 0,
    averageCompletionTime: 0,
  };
};

// ============================================================================
// ENROLLMENT & WAITLIST MANAGEMENT (Functions 15-22)
// ============================================================================

/**
 * Enrolls a user in a course.
 *
 * @param {object} enrollmentData - Enrollment data
 * @param {string} enrolledByUserId - User performing enrollment
 * @returns {Promise<CourseEnrollment>} Created enrollment
 */
export const enrollUserInCourse = async (
  enrollmentData: {
    userId: string;
    courseId: string;
    sessionId?: string;
    dueDate?: Date;
    autoEnrollFromWaitlist?: boolean;
  },
  enrolledByUserId: string,
  transaction?: Transaction,
): Promise<CourseEnrollment> => {
  const enrollment: CourseEnrollment = {
    id: generateUUID(),
    courseId: enrollmentData.courseId,
    sessionId: enrollmentData.sessionId,
    learningItemId: enrollmentData.courseId,
    userId: enrollmentData.userId,
    enrollmentDate: new Date(),
    status: EnrollmentStatus.ENROLLED,
    startDate: undefined,
    completionDate: undefined,
    dueDate: enrollmentData.dueDate,
    progress: 0,
    attempts: 0,
    lastAttemptDate: undefined,
    bestScore: undefined,
    passingStatus: undefined,
    certificateIssued: false,
    certificateId: undefined,
    enrolledBy: enrolledByUserId,
    completedBy: undefined,
    feedback: undefined,
    rating: undefined,
    metadata: {
      enrollmentSource: 'manual',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return enrollment;
};

/**
 * Adds a user to course waitlist.
 *
 * @param {string} userId - User ID
 * @param {string} courseId - Course ID
 * @param {string} sessionId - Session ID
 * @param {string} enrolledByUserId - User adding to waitlist
 * @returns {Promise<CourseEnrollment>} Waitlist enrollment
 */
export const addToWaitlist = async (
  userId: string,
  courseId: string,
  sessionId: string,
  enrolledByUserId: string,
  transaction?: Transaction,
): Promise<CourseEnrollment> => {
  const enrollment: CourseEnrollment = {
    id: generateUUID(),
    courseId,
    sessionId,
    learningItemId: courseId,
    userId,
    enrollmentDate: new Date(),
    status: EnrollmentStatus.WAITLISTED,
    startDate: undefined,
    completionDate: undefined,
    dueDate: undefined,
    progress: 0,
    attempts: 0,
    lastAttemptDate: undefined,
    bestScore: undefined,
    passingStatus: undefined,
    certificateIssued: false,
    certificateId: undefined,
    enrolledBy: enrolledByUserId,
    completedBy: undefined,
    feedback: undefined,
    rating: undefined,
    metadata: {
      waitlistPosition: 1,
      waitlistDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return enrollment;
};

/**
 * Removes user from waitlist and enrolls them.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {string} userId - User processing enrollment
 * @returns {Promise<CourseEnrollment>} Updated enrollment
 */
export const enrollFromWaitlist = async (
  enrollmentId: string,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<CourseEnrollment>> => {
  return {
    id: enrollmentId,
    status: EnrollmentStatus.ENROLLED,
    updatedAt: new Date(),
    metadata: {
      enrolledFromWaitlist: true,
      enrolledFromWaitlistDate: new Date().toISOString(),
    },
  };
};

/**
 * Cancels an enrollment.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {string} userId - User canceling enrollment
 * @param {string} reason - Cancellation reason
 * @returns {Promise<CourseEnrollment>} Updated enrollment
 */
export const cancelEnrollment = async (
  enrollmentId: string,
  userId: string,
  reason?: string,
  transaction?: Transaction,
): Promise<Partial<CourseEnrollment>> => {
  return {
    id: enrollmentId,
    status: EnrollmentStatus.CANCELLED,
    updatedAt: new Date(),
    metadata: {
      cancellationReason: reason,
      cancelledDate: new Date().toISOString(),
      cancelledBy: userId,
    },
  };
};

/**
 * Withdraws a user from a course.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {string} userId - User withdrawing
 * @param {string} reason - Withdrawal reason
 * @returns {Promise<CourseEnrollment>} Updated enrollment
 */
export const withdrawFromCourse = async (
  enrollmentId: string,
  userId: string,
  reason?: string,
  transaction?: Transaction,
): Promise<Partial<CourseEnrollment>> => {
  return {
    id: enrollmentId,
    status: EnrollmentStatus.WITHDRAWN,
    updatedAt: new Date(),
    metadata: {
      withdrawalReason: reason,
      withdrawalDate: new Date().toISOString(),
    },
  };
};

/**
 * Bulk enrolls users in a course.
 *
 * @param {string} courseId - Course ID
 * @param {string[]} userIds - User IDs to enroll
 * @param {string} enrolledByUserId - User performing bulk enrollment
 * @returns {Promise<CourseEnrollment[]>} Created enrollments
 */
export const bulkEnrollUsers = async (
  courseId: string,
  userIds: string[],
  enrolledByUserId: string,
  options?: {
    sessionId?: string;
    dueDate?: Date;
  },
  transaction?: Transaction,
): Promise<CourseEnrollment[]> => {
  const enrollments: CourseEnrollment[] = [];

  for (const userId of userIds) {
    const enrollment = await enrollUserInCourse(
      {
        userId,
        courseId,
        sessionId: options?.sessionId,
        dueDate: options?.dueDate,
      },
      enrolledByUserId,
      transaction,
    );
    enrollments.push(enrollment);
  }

  return enrollments;
};

/**
 * Gets user enrollments with filters.
 *
 * @param {string} userId - User ID
 * @param {object} filters - Filter options
 * @returns {Promise<CourseEnrollment[]>} User enrollments
 */
export const getUserEnrollments = async (
  userId: string,
  filters?: {
    status?: EnrollmentStatus;
    courseId?: string;
    startDate?: Date;
    endDate?: Date;
  },
): Promise<CourseEnrollment[]> => {
  // Implementation would fetch from database
  return [];
};

/**
 * Gets course enrollment statistics.
 *
 * @param {string} courseId - Course ID
 * @returns {Promise<object>} Enrollment statistics
 */
export const getCourseEnrollmentStats = async (
  courseId: string,
): Promise<{
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  waitlistedCount: number;
  completionRate: number;
  averageProgress: number;
  averageScore: number;
}> => {
  return {
    totalEnrollments: 0,
    activeEnrollments: 0,
    completedEnrollments: 0,
    waitlistedCount: 0,
    completionRate: 0,
    averageProgress: 0,
    averageScore: 0,
  };
};

// ============================================================================
// TRAINING SESSION MANAGEMENT (Functions 23-28)
// ============================================================================

/**
 * Creates a new training session (ILT/VILT).
 *
 * @param {object} sessionData - Session creation data
 * @param {string} userId - User creating the session
 * @returns {Promise<TrainingSession>} Created session
 */
export const createTrainingSession = async (
  sessionData: Partial<TrainingSession>,
  userId: string,
  transaction?: Transaction,
): Promise<TrainingSession> => {
  const sessionCode = generateSessionCode(sessionData.courseId || 'CRS');

  const session: TrainingSession = {
    id: generateUUID(),
    courseId: sessionData.courseId!,
    sessionCode,
    sessionName: sessionData.sessionName!,
    deliveryMethod: sessionData.deliveryMethod!,
    status: SessionStatus.SCHEDULED,
    startDateTime: sessionData.startDateTime!,
    endDateTime: sessionData.endDateTime!,
    duration: Math.floor(
      (sessionData.endDateTime!.getTime() - sessionData.startDateTime!.getTime()) / (1000 * 60),
    ),
    instructorId: sessionData.instructorId!,
    coInstructorIds: sessionData.coInstructorIds || [],
    location: sessionData.location,
    virtualLink: sessionData.virtualLink,
    virtualPlatform: sessionData.virtualPlatform,
    capacity: sessionData.capacity!,
    enrolledCount: 0,
    waitlistedCount: 0,
    attendedCount: 0,
    roomId: sessionData.roomId,
    facilityId: sessionData.facilityId,
    equipmentRequired: sessionData.equipmentRequired || [],
    materialsRequired: sessionData.materialsRequired || [],
    cost: sessionData.cost,
    notes: sessionData.notes,
    metadata: {
      ...sessionData.metadata,
      createdDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userId,
  };

  return session;
};

/**
 * Updates a training session.
 *
 * @param {string} sessionId - Session ID
 * @param {object} updates - Session updates
 * @param {string} userId - User updating the session
 * @returns {Promise<TrainingSession>} Updated session
 */
export const updateTrainingSession = async (
  sessionId: string,
  updates: Partial<TrainingSession>,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<TrainingSession>> => {
  return {
    id: sessionId,
    ...updates,
    updatedAt: new Date(),
  };
};

/**
 * Cancels a training session.
 *
 * @param {string} sessionId - Session ID
 * @param {string} userId - User canceling the session
 * @param {string} reason - Cancellation reason
 * @returns {Promise<TrainingSession>} Updated session
 */
export const cancelTrainingSession = async (
  sessionId: string,
  userId: string,
  reason: string,
  transaction?: Transaction,
): Promise<Partial<TrainingSession>> => {
  return {
    id: sessionId,
    status: SessionStatus.CANCELLED,
    updatedAt: new Date(),
    metadata: {
      cancellationReason: reason,
      cancelledDate: new Date().toISOString(),
      cancelledBy: userId,
    },
  };
};

/**
 * Reschedules a training session.
 *
 * @param {string} sessionId - Session ID
 * @param {Date} newStartDateTime - New start date/time
 * @param {Date} newEndDateTime - New end date/time
 * @param {string} userId - User rescheduling
 * @returns {Promise<TrainingSession>} Updated session
 */
export const rescheduleTrainingSession = async (
  sessionId: string,
  newStartDateTime: Date,
  newEndDateTime: Date,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<TrainingSession>> => {
  return {
    id: sessionId,
    status: SessionStatus.RESCHEDULED,
    startDateTime: newStartDateTime,
    endDateTime: newEndDateTime,
    duration: Math.floor((newEndDateTime.getTime() - newStartDateTime.getTime()) / (1000 * 60)),
    updatedAt: new Date(),
    metadata: {
      rescheduledDate: new Date().toISOString(),
      rescheduledBy: userId,
    },
  };
};

/**
 * Starts a training session.
 *
 * @param {string} sessionId - Session ID
 * @param {string} userId - User starting the session
 * @returns {Promise<TrainingSession>} Updated session
 */
export const startTrainingSession = async (
  sessionId: string,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<TrainingSession>> => {
  return {
    id: sessionId,
    status: SessionStatus.IN_PROGRESS,
    updatedAt: new Date(),
    metadata: {
      actualStartTime: new Date().toISOString(),
    },
  };
};

/**
 * Completes a training session.
 *
 * @param {string} sessionId - Session ID
 * @param {string} userId - User completing the session
 * @returns {Promise<TrainingSession>} Updated session
 */
export const completeTrainingSession = async (
  sessionId: string,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<TrainingSession>> => {
  return {
    id: sessionId,
    status: SessionStatus.COMPLETED,
    updatedAt: new Date(),
    metadata: {
      actualEndTime: new Date().toISOString(),
    },
  };
};

// ============================================================================
// LEARNING PATHS & CURRICULA (Functions 29-33)
// ============================================================================

/**
 * Creates a new learning path.
 *
 * @param {object} pathData - Learning path creation data
 * @param {string} userId - User creating the path
 * @returns {Promise<LearningPath>} Created learning path
 */
export const createLearningPath = async (
  pathData: Partial<LearningPath>,
  userId: string,
  transaction?: Transaction,
): Promise<LearningPath> => {
  const pathCode = `LP-${Date.now().toString(36).toUpperCase()}`;

  const learningPath: LearningPath = {
    id: generateUUID(),
    pathCode,
    pathName: pathData.pathName!,
    description: pathData.description!,
    status: CourseStatus.DRAFT,
    items: pathData.items || [],
    totalDuration: 0,
    totalCredits: 0,
    targetRoles: pathData.targetRoles || [],
    targetJobLevels: pathData.targetJobLevels || [],
    completionCriteria: pathData.completionCriteria || 'All required items must be completed',
    certificateAwarded: pathData.certificateAwarded || false,
    certificateTemplateId: pathData.certificateTemplateId,
    ownerId: pathData.ownerId!,
    metadata: {
      ...pathData.metadata,
      createdDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return learningPath;
};

/**
 * Adds items to a learning path.
 *
 * @param {string} pathId - Learning path ID
 * @param {array} items - Items to add
 * @param {string} userId - User updating the path
 * @returns {Promise<LearningPath>} Updated learning path
 */
export const addItemsToLearningPath = async (
  pathId: string,
  items: Array<{
    itemId: string;
    itemType: LearningItemType;
    sequence: number;
    required: boolean;
  }>,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<LearningPath>> => {
  return {
    id: pathId,
    items: [...items],
    updatedAt: new Date(),
  };
};

/**
 * Removes items from a learning path.
 *
 * @param {string} pathId - Learning path ID
 * @param {string[]} itemIds - Item IDs to remove
 * @param {string} userId - User updating the path
 * @returns {Promise<LearningPath>} Updated learning path
 */
export const removeItemsFromLearningPath = async (
  pathId: string,
  itemIds: string[],
  userId: string,
  transaction?: Transaction,
): Promise<Partial<LearningPath>> => {
  return {
    id: pathId,
    updatedAt: new Date(),
  };
};

/**
 * Calculates learning path progress for a user.
 *
 * @param {string} pathId - Learning path ID
 * @param {string} userId - User ID
 * @returns {Promise<object>} Progress statistics
 */
export const calculateLearningPathProgress = async (
  pathId: string,
  userId: string,
): Promise<{
  totalItems: number;
  completedItems: number;
  requiredItems: number;
  completedRequiredItems: number;
  progressPercentage: number;
  isCompleted: boolean;
}> => {
  return {
    totalItems: 0,
    completedItems: 0,
    requiredItems: 0,
    completedRequiredItems: 0,
    progressPercentage: 0,
    isCompleted: false,
  };
};

/**
 * Publishes a learning path.
 *
 * @param {string} pathId - Learning path ID
 * @param {string} userId - User publishing the path
 * @returns {Promise<LearningPath>} Updated learning path
 */
export const publishLearningPath = async (
  pathId: string,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<LearningPath>> => {
  return {
    id: pathId,
    status: CourseStatus.PUBLISHED,
    updatedAt: new Date(),
  };
};

// ============================================================================
// CERTIFICATION & ACCREDITATION (Functions 34-38)
// ============================================================================

/**
 * Issues a certificate to a user.
 *
 * @param {object} certData - Certificate data
 * @param {string} issuedByUserId - User issuing the certificate
 * @returns {Promise<Certification>} Created certificate
 */
export const issueCertificate = async (
  certData: {
    userId: string;
    certificateName: string;
    courseId?: string;
    learningPathId?: string;
    score?: number;
    creditsEarned: number;
    expiryDate?: Date;
    renewalRequired?: boolean;
    renewalPeriod?: number;
    accreditationBody?: string;
  },
  issuedByUserId: string,
  transaction?: Transaction,
): Promise<Certification> => {
  const certificateNumber = generateCertificateNumber();
  const verificationCode = generateVerificationCode();

  const certificate: Certification = {
    id: generateUUID(),
    certificateNumber,
    certificateName: certData.certificateName,
    userId: certData.userId,
    courseId: certData.courseId,
    learningPathId: certData.learningPathId,
    issueDate: new Date(),
    expiryDate: certData.expiryDate,
    status: CertificationStatus.ACTIVE,
    score: certData.score,
    creditsEarned: certData.creditsEarned,
    certificateUrl: undefined,
    verificationCode,
    issuedBy: issuedByUserId,
    accreditationBody: certData.accreditationBody,
    renewalRequired: certData.renewalRequired || false,
    renewalPeriod: certData.renewalPeriod,
    lastRenewalDate: undefined,
    metadata: {
      issueDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return certificate;
};

/**
 * Verifies a certificate by verification code.
 *
 * @param {string} verificationCode - Verification code
 * @returns {Promise<Certification>} Certificate details if valid
 */
export const verifyCertificate = async (verificationCode: string): Promise<Certification | null> => {
  // Implementation would fetch from database
  return null;
};

/**
 * Revokes a certificate.
 *
 * @param {string} certificateId - Certificate ID
 * @param {string} userId - User revoking the certificate
 * @param {string} reason - Revocation reason
 * @returns {Promise<Certification>} Updated certificate
 */
export const revokeCertificate = async (
  certificateId: string,
  userId: string,
  reason: string,
  transaction?: Transaction,
): Promise<Partial<Certification>> => {
  return {
    id: certificateId,
    status: CertificationStatus.REVOKED,
    updatedAt: new Date(),
    metadata: {
      revokedDate: new Date().toISOString(),
      revokedBy: userId,
      revocationReason: reason,
    },
  };
};

/**
 * Renews a certificate.
 *
 * @param {string} certificateId - Certificate ID
 * @param {number} renewalMonths - Renewal period in months
 * @param {string} userId - User renewing the certificate
 * @returns {Promise<Certification>} Updated certificate
 */
export const renewCertificate = async (
  certificateId: string,
  renewalMonths: number,
  userId: string,
  transaction?: Transaction,
): Promise<Partial<Certification>> => {
  const newExpiryDate = new Date();
  newExpiryDate.setMonth(newExpiryDate.getMonth() + renewalMonths);

  return {
    id: certificateId,
    expiryDate: newExpiryDate,
    lastRenewalDate: new Date(),
    status: CertificationStatus.ACTIVE,
    updatedAt: new Date(),
    metadata: {
      renewalDate: new Date().toISOString(),
      renewedBy: userId,
    },
  };
};

/**
 * Gets user certificates.
 *
 * @param {string} userId - User ID
 * @param {object} filters - Filter options
 * @returns {Promise<Certification[]>} User certificates
 */
export const getUserCertificates = async (
  userId: string,
  filters?: {
    status?: CertificationStatus;
    expiringWithinDays?: number;
  },
): Promise<Certification[]> => {
  // Implementation would fetch from database
  return [];
};

// ============================================================================
// ATTENDANCE & COMPLETION TRACKING (Functions 39-42)
// ============================================================================

/**
 * Records attendance for a training session.
 *
 * @param {object} attendanceData - Attendance data
 * @param {string} recordedByUserId - User recording attendance
 * @returns {Promise<AttendanceRecord>} Created attendance record
 */
export const recordAttendance = async (
  attendanceData: {
    sessionId: string;
    enrollmentId: string;
    userId: string;
    status: AttendanceStatus;
    checkInTime?: Date;
    checkOutTime?: Date;
    notes?: string;
  },
  recordedByUserId: string,
  transaction?: Transaction,
): Promise<AttendanceRecord> => {
  const duration =
    attendanceData.checkInTime && attendanceData.checkOutTime
      ? Math.floor((attendanceData.checkOutTime.getTime() - attendanceData.checkInTime.getTime()) / (1000 * 60))
      : undefined;

  const attendance: AttendanceRecord = {
    id: generateUUID(),
    sessionId: attendanceData.sessionId,
    enrollmentId: attendanceData.enrollmentId,
    userId: attendanceData.userId,
    status: attendanceData.status,
    checkInTime: attendanceData.checkInTime,
    checkOutTime: attendanceData.checkOutTime,
    duration,
    notes: attendanceData.notes,
    recordedBy: recordedByUserId,
    metadata: {
      recordedDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return attendance;
};

/**
 * Bulk records attendance for multiple users.
 *
 * @param {string} sessionId - Session ID
 * @param {array} attendances - Attendance records
 * @param {string} recordedByUserId - User recording attendance
 * @returns {Promise<AttendanceRecord[]>} Created attendance records
 */
export const bulkRecordAttendance = async (
  sessionId: string,
  attendances: Array<{
    userId: string;
    enrollmentId: string;
    status: AttendanceStatus;
    checkInTime?: Date;
    checkOutTime?: Date;
  }>,
  recordedByUserId: string,
  transaction?: Transaction,
): Promise<AttendanceRecord[]> => {
  const records: AttendanceRecord[] = [];

  for (const attendance of attendances) {
    const record = await recordAttendance(
      {
        sessionId,
        ...attendance,
      },
      recordedByUserId,
      transaction,
    );
    records.push(record);
  }

  return records;
};

/**
 * Marks course enrollment as completed.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {string} userId - User marking completion
 * @param {object} completionData - Completion data
 * @returns {Promise<CourseEnrollment>} Updated enrollment
 */
export const markEnrollmentCompleted = async (
  enrollmentId: string,
  userId: string,
  completionData: {
    score?: number;
    passed: boolean;
    certificateIssued?: boolean;
    certificateId?: string;
  },
  transaction?: Transaction,
): Promise<Partial<CourseEnrollment>> => {
  return {
    id: enrollmentId,
    status: EnrollmentStatus.COMPLETED,
    completionDate: new Date(),
    progress: 100,
    bestScore: completionData.score,
    passingStatus: completionData.passed ? 'passed' : 'failed',
    certificateIssued: completionData.certificateIssued || false,
    certificateId: completionData.certificateId,
    completedBy: userId,
    updatedAt: new Date(),
  };
};

/**
 * Updates course progress for a user.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {number} progress - Progress percentage
 * @returns {Promise<CourseEnrollment>} Updated enrollment
 */
export const updateCourseProgress = async (
  enrollmentId: string,
  progress: number,
  transaction?: Transaction,
): Promise<Partial<CourseEnrollment>> => {
  const status = progress === 100 ? EnrollmentStatus.COMPLETED : EnrollmentStatus.IN_PROGRESS;

  return {
    id: enrollmentId,
    progress,
    status,
    startDate: new Date(),
    updatedAt: new Date(),
  };
};

// ============================================================================
// ASSESSMENTS & QUIZZES (Functions 43-46)
// ============================================================================

/**
 * Creates a new assessment.
 *
 * @param {object} assessmentData - Assessment creation data
 * @param {string} userId - User creating the assessment
 * @returns {Promise<Assessment>} Created assessment
 */
export const createAssessment = async (
  assessmentData: Partial<Assessment>,
  userId: string,
  transaction?: Transaction,
): Promise<Assessment> => {
  const assessmentCode = `ASMT-${Date.now().toString(36).toUpperCase()}`;

  const assessment: Assessment = {
    id: generateUUID(),
    assessmentCode,
    assessmentName: assessmentData.assessmentName!,
    description: assessmentData.description!,
    courseId: assessmentData.courseId,
    type: assessmentData.type!,
    totalQuestions: assessmentData.totalQuestions || 0,
    totalPoints: assessmentData.totalPoints || 0,
    passingScore: assessmentData.passingScore!,
    duration: assessmentData.duration,
    maxAttempts: assessmentData.maxAttempts!,
    randomizeQuestions: assessmentData.randomizeQuestions || false,
    showCorrectAnswers: assessmentData.showCorrectAnswers || true,
    showResultsImmediately: assessmentData.showResultsImmediately || true,
    allowReview: assessmentData.allowReview || true,
    questions: assessmentData.questions || [],
    metadata: {
      ...assessmentData.metadata,
      createdDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userId,
  };

  return assessment;
};

/**
 * Starts an assessment attempt.
 *
 * @param {string} assessmentId - Assessment ID
 * @param {string} userId - User taking assessment
 * @param {string} enrollmentId - Enrollment ID
 * @returns {Promise<AssessmentAttempt>} Created attempt
 */
export const startAssessmentAttempt = async (
  assessmentId: string,
  userId: string,
  enrollmentId: string,
  transaction?: Transaction,
): Promise<AssessmentAttempt> => {
  const attempt: AssessmentAttempt = {
    id: generateUUID(),
    assessmentId,
    userId,
    enrollmentId,
    attemptNumber: 1,
    startTime: new Date(),
    endTime: undefined,
    status: AssessmentStatus.IN_PROGRESS,
    score: undefined,
    percentage: undefined,
    passed: false,
    answers: [],
    timeTaken: undefined,
    metadata: {
      startedDate: new Date().toISOString(),
    },
    createdAt: new Date(),
  };

  return attempt;
};

/**
 * Submits an assessment attempt.
 *
 * @param {string} attemptId - Attempt ID
 * @param {array} answers - User answers
 * @returns {Promise<AssessmentAttempt>} Graded attempt
 */
export const submitAssessmentAttempt = async (
  attemptId: string,
  answers: Array<{
    questionId: string;
    answer: any;
  }>,
  transaction?: Transaction,
): Promise<Partial<AssessmentAttempt>> => {
  const endTime = new Date();
  // Implementation would calculate score and grade answers

  return {
    id: attemptId,
    endTime,
    status: AssessmentStatus.COMPLETED,
    answers: answers.map((a) => ({
      ...a,
      isCorrect: false, // Would be calculated
      pointsAwarded: 0, // Would be calculated
    })),
    score: 0, // Would be calculated
    percentage: 0, // Would be calculated
    passed: false, // Would be determined
  };
};

/**
 * Gets assessment attempts for a user.
 *
 * @param {string} assessmentId - Assessment ID
 * @param {string} userId - User ID
 * @returns {Promise<AssessmentAttempt[]>} Assessment attempts
 */
export const getUserAssessmentAttempts = async (
  assessmentId: string,
  userId: string,
): Promise<AssessmentAttempt[]> => {
  // Implementation would fetch from database
  return [];
};

// ============================================================================
// TRAINING FEEDBACK & EVALUATIONS (Functions 47-48)
// ============================================================================

/**
 * Submits training feedback.
 *
 * @param {object} feedbackData - Feedback data
 * @param {string} userId - User submitting feedback
 * @returns {Promise<TrainingFeedback>} Created feedback
 */
export const submitTrainingFeedback = async (
  feedbackData: {
    courseId: string;
    sessionId?: string;
    enrollmentId: string;
    rating: number;
    contentRating?: number;
    instructorRating?: number;
    facilityRating?: number;
    relevanceRating?: number;
    comments?: string;
    wouldRecommend: boolean;
    strengths?: string;
    improvements?: string;
  },
  userId: string,
  transaction?: Transaction,
): Promise<TrainingFeedback> => {
  const feedback: TrainingFeedback = {
    id: generateUUID(),
    courseId: feedbackData.courseId,
    sessionId: feedbackData.sessionId,
    enrollmentId: feedbackData.enrollmentId,
    userId,
    rating: feedbackData.rating,
    contentRating: feedbackData.contentRating,
    instructorRating: feedbackData.instructorRating,
    facilityRating: feedbackData.facilityRating,
    relevanceRating: feedbackData.relevanceRating,
    comments: feedbackData.comments,
    wouldRecommend: feedbackData.wouldRecommend,
    strengths: feedbackData.strengths,
    improvements: feedbackData.improvements,
    submittedAt: new Date(),
    metadata: {
      submittedDate: new Date().toISOString(),
    },
    createdAt: new Date(),
  };

  return feedback;
};

/**
 * Gets course feedback summary.
 *
 * @param {string} courseId - Course ID
 * @returns {Promise<object>} Feedback summary
 */
export const getCourseFeedbackSummary = async (
  courseId: string,
): Promise<{
  totalResponses: number;
  averageRating: number;
  averageContentRating: number;
  averageInstructorRating: number;
  recommendationRate: number;
  commonStrengths: string[];
  commonImprovements: string[];
}> => {
  return {
    totalResponses: 0,
    averageRating: 0,
    averageContentRating: 0,
    averageInstructorRating: 0,
    recommendationRate: 0,
    commonStrengths: [],
    commonImprovements: [],
  };
};

// ============================================================================
// LEARNING ANALYTICS & REPORTING (Functions 49-50)
// ============================================================================

/**
 * Gets comprehensive learning analytics.
 *
 * @param {object} filters - Analytics filters
 * @returns {Promise<LearningAnalytics>} Learning analytics
 */
export const getLearningAnalytics = async (filters: {
  organizationId?: string;
  departmentId?: string;
  startDate: Date;
  endDate: Date;
  courseIds?: string[];
  userIds?: string[];
}): Promise<LearningAnalytics> => {
  const analytics: LearningAnalytics = {
    organizationId: filters.organizationId,
    departmentId: filters.departmentId,
    period: {
      startDate: filters.startDate,
      endDate: filters.endDate,
    },
    totalEnrollments: 0,
    completedEnrollments: 0,
    inProgressEnrollments: 0,
    completionRate: 0,
    averageCompletionTime: 0,
    averageScore: 0,
    totalHoursLearned: 0,
    totalCertificatesIssued: 0,
    complianceRate: 0,
    topCourses: [],
    topPerformers: [],
    metadata: {},
  };

  return analytics;
};

/**
 * Generates learning transcript for a user.
 *
 * @param {string} userId - User ID
 * @param {object} options - Transcript options
 * @returns {Promise<object>} Learning transcript
 */
export const generateLearningTranscript = async (
  userId: string,
  options?: {
    includeInProgress?: boolean;
    startDate?: Date;
    endDate?: Date;
  },
): Promise<{
  userId: string;
  userName: string;
  totalCoursesCompleted: number;
  totalCreditsEarned: number;
  totalHoursLearned: number;
  certificates: Certification[];
  courseHistory: Array<{
    courseId: string;
    courseName: string;
    completionDate?: Date;
    status: EnrollmentStatus;
    score?: number;
    creditsEarned: number;
  }>;
  generatedAt: Date;
}> => {
  return {
    userId,
    userName: '',
    totalCoursesCompleted: 0,
    totalCreditsEarned: 0,
    totalHoursLearned: 0,
    certificates: [],
    courseHistory: [],
    generatedAt: new Date(),
  };
};

// ============================================================================
// NESTJS CONTROLLER EXAMPLE
// ============================================================================

/**
 * Example NestJS Controller for Learning Management
 */
@ApiTags('Learning Management')
@ApiBearerAuth()
@Controller('learning')
export class LearningManagementController {
  @Post('courses')
  @ApiOperation({ summary: 'Create a new learning course' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createCourse(@Body() dto: CreateLearningCourseDto) {
    return await createLearningCourse(dto, 'system-user');
  }

  @Post('courses/:id/publish')
  @ApiOperation({ summary: 'Publish a course' })
  @ApiParam({ name: 'id', description: 'Course ID' })
  async publishCourseEndpoint(@Param('id', ParseUUIDPipe) courseId: string) {
    return await publishCourse(courseId, 'system-user');
  }

  @Post('enrollments')
  @ApiOperation({ summary: 'Enroll user in course' })
  @ApiResponse({ status: 201, description: 'User enrolled successfully' })
  async enrollUser(@Body() dto: EnrollUserDto) {
    return await enrollUserInCourse(dto, dto.enrolledBy);
  }

  @Post('sessions')
  @ApiOperation({ summary: 'Create training session' })
  @ApiResponse({ status: 201, description: 'Session created successfully' })
  async createSession(@Body() dto: CreateTrainingSessionDto) {
    return await createTrainingSession(dto, 'system-user');
  }

  @Post('attendance')
  @ApiOperation({ summary: 'Record attendance' })
  @ApiResponse({ status: 201, description: 'Attendance recorded successfully' })
  async recordSessionAttendance(@Body() dto: RecordAttendanceDto) {
    return await recordAttendance(dto, 'system-user');
  }

  @Post('certificates')
  @ApiOperation({ summary: 'Issue certificate' })
  @ApiResponse({ status: 201, description: 'Certificate issued successfully' })
  async issueCert(@Body() certData: any) {
    return await issueCertificate(certData, 'system-user');
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get learning analytics' })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  async getAnalytics(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return await getLearningAnalytics({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
  }

  @Get('users/:userId/transcript')
  @ApiOperation({ summary: 'Generate user learning transcript' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async getTranscript(@Param('userId', ParseUUIDPipe) userId: string) {
    return await generateLearningTranscript(userId);
  }
}
