/**
 * LOC: HCM_PERF_MGT_001
 * File: /reuse/server/human-capital/performance-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - i18next
 *
 * DOWNSTREAM (imported by):
 *   - Performance review services
 *   - 360 feedback implementations
 *   - Talent management systems
 *   - HR analytics & reporting
 *   - Compensation planning services
 *   - Development planning modules
 */

/**
 * File: /reuse/server/human-capital/performance-management-kit.ts
 * Locator: WC-HCM-PERF-MGT-001
 * Purpose: Performance Management Kit - Comprehensive performance review and appraisal system
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, i18next
 * Downstream: ../backend/hr/performance/*, ../services/talent/*, Analytics & Reporting
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 48+ utility functions for performance management including performance reviews, 360 feedback,
 *          appraisal forms, rating scales, performance improvement plans (PIP), KPI management,
 *          continuous feedback, calibration sessions, performance analytics, development plans,
 *          competency assessments, goal linkage, review cycles, and reporting
 *
 * LLM Context: Enterprise-grade performance management for White Cross healthcare system with
 * SAP SuccessFactors Performance & Goal Management parity. Provides comprehensive performance review
 * cycles (annual, mid-year, quarterly), 360-degree feedback collection and analysis, competency-based
 * assessments, behavior-based rating scales, performance improvement plans (PIP), KPI tracking and
 * measurement, continuous feedback mechanisms, calibration session management, performance analytics,
 * compensation linkage, succession planning integration, development plan creation, multi-rater feedback,
 * self-assessment workflows, manager assessment tools, peer reviews, skip-level reviews, custom rating
 * scales, performance distribution analysis, forced ranking support, performance-based rewards integration,
 * HIPAA compliance for healthcare employee performance data, audit trails, and advanced reporting.
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BelongsTo,
  HasMany,
  ForeignKey,
  Default,
  AllowNull,
  IsUUID,
  Length,
  Min,
  Max,
} from 'sequelize-typescript';
import { z } from 'zod';
import { Op, Transaction, FindOptions, WhereOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Performance review cycle type
 */
export enum ReviewCycleType {
  ANNUAL = 'annual',
  MID_YEAR = 'mid_year',
  QUARTERLY = 'quarterly',
  PROBATION = 'probation',
  PROJECT_END = 'project_end',
  AD_HOC = 'ad_hoc',
}

/**
 * Review status enumeration
 */
export enum ReviewStatus {
  NOT_STARTED = 'not_started',
  SELF_ASSESSMENT = 'self_assessment',
  MANAGER_REVIEW = 'manager_review',
  CALIBRATION = 'calibration',
  PEER_REVIEW = 'peer_review',
  SKIP_LEVEL = 'skip_level',
  HR_REVIEW = 'hr_review',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Rating scale type
 */
export enum RatingScaleType {
  NUMERIC_5_POINT = 'numeric_5_point',
  NUMERIC_7_POINT = 'numeric_7_point',
  NUMERIC_10_POINT = 'numeric_10_point',
  BEHAVIORAL = 'behavioral',
  COMPETENCY = 'competency',
  CUSTOM = 'custom',
}

/**
 * Performance rating enumeration
 */
export enum PerformanceRating {
  OUTSTANDING = 'outstanding',
  EXCEEDS_EXPECTATIONS = 'exceeds_expectations',
  MEETS_EXPECTATIONS = 'meets_expectations',
  NEEDS_IMPROVEMENT = 'needs_improvement',
  UNSATISFACTORY = 'unsatisfactory',
}

/**
 * Feedback type enumeration
 */
export enum FeedbackType {
  PRAISE = 'praise',
  CONSTRUCTIVE = 'constructive',
  DEVELOPMENTAL = 'developmental',
  COACHING = 'coaching',
  RECOGNITION = 'recognition',
}

/**
 * Feedback visibility
 */
export enum FeedbackVisibility {
  PRIVATE = 'private',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  PUBLIC = 'public',
}

/**
 * PIP status enumeration
 */
export enum PIPStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  IN_PROGRESS = 'in_progress',
  SUCCESSFUL = 'successful',
  UNSUCCESSFUL = 'unsuccessful',
  CANCELLED = 'cancelled',
}

/**
 * Competency category
 */
export enum CompetencyCategory {
  LEADERSHIP = 'leadership',
  TECHNICAL = 'technical',
  BEHAVIORAL = 'behavioral',
  FUNCTIONAL = 'functional',
  CORE = 'core',
}

/**
 * Calibration session status
 */
export enum CalibrationStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * 360 feedback status
 */
export enum Feedback360Status {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DECLINED = 'declined',
}

/**
 * Performance review interface
 */
export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  cycleId: string;
  reviewType: ReviewCycleType;
  reviewPeriodStart: Date;
  reviewPeriodEnd: Date;
  status: ReviewStatus;
  overallRating?: PerformanceRating;
  overallScore?: number;
  selfAssessmentCompleted: boolean;
  managerAssessmentCompleted: boolean;
  calibrationCompleted: boolean;
  finalizedAt?: Date;
  finalizedBy?: string;
  metadata?: Record<string, any>;
}

/**
 * Review section interface
 */
export interface ReviewSection {
  id: string;
  reviewId: string;
  sectionName: string;
  sectionOrder: number;
  weight: number;
  rating?: PerformanceRating;
  score?: number;
  comments?: string;
  competencies?: string[];
  evidence?: string[];
}

/**
 * 360 Feedback request interface
 */
export interface Feedback360Request {
  id: string;
  employeeId: string;
  reviewId: string;
  requesterId: string;
  respondentId: string;
  respondentType: 'peer' | 'manager' | 'direct_report' | 'skip_level' | 'external';
  status: Feedback360Status;
  requestedAt: Date;
  completedAt?: Date;
  dueDate: Date;
  anonymousResponse: boolean;
}

/**
 * Continuous feedback interface
 */
export interface ContinuousFeedback {
  id: string;
  employeeId: string;
  giverId: string;
  feedbackType: FeedbackType;
  visibility: FeedbackVisibility;
  content: string;
  relatedGoalId?: string;
  relatedProjectId?: string;
  acknowledgedAt?: Date;
  isAnonymous: boolean;
  tags?: string[];
}

/**
 * Performance Improvement Plan interface
 */
export interface PerformanceImprovementPlan {
  id: string;
  employeeId: string;
  managerId: string;
  status: PIPStatus;
  startDate: Date;
  endDate: Date;
  reviewDate: Date;
  performanceIssues: string[];
  expectedImprovements: string[];
  supportProvided: string[];
  successCriteria: string[];
  outcome?: string;
  hrApprovalBy?: string;
  hrApprovalAt?: Date;
}

/**
 * Competency assessment interface
 */
export interface CompetencyAssessment {
  id: string;
  reviewId: string;
  competencyId: string;
  competencyName: string;
  category: CompetencyCategory;
  expectedLevel: number;
  currentLevel: number;
  rating?: PerformanceRating;
  assessorComments?: string;
  employeeComments?: string;
  developmentActions?: string[];
}

/**
 * Calibration session interface
 */
export interface CalibrationSession {
  id: string;
  name: string;
  cycleId: string;
  facilitatorId: string;
  status: CalibrationStatus;
  scheduledDate: Date;
  completedDate?: Date;
  participants: string[];
  reviewsDiscussed: string[];
  ratingAdjustments: Array<{
    reviewId: string;
    oldRating: PerformanceRating;
    newRating: PerformanceRating;
    reason: string;
  }>;
  notes?: string;
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * Performance review validation schema
 */
export const PerformanceReviewSchema = z.object({
  employeeId: z.string().uuid(),
  reviewerId: z.string().uuid(),
  cycleId: z.string().uuid(),
  reviewType: z.nativeEnum(ReviewCycleType),
  reviewPeriodStart: z.coerce.date(),
  reviewPeriodEnd: z.coerce.date(),
  status: z.nativeEnum(ReviewStatus).default(ReviewStatus.NOT_STARTED),
  overallRating: z.nativeEnum(PerformanceRating).optional(),
  overallScore: z.number().min(0).max(100).optional(),
  selfAssessmentCompleted: z.boolean().default(false),
  managerAssessmentCompleted: z.boolean().default(false),
  calibrationCompleted: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
}).refine(
  (data) => data.reviewPeriodEnd > data.reviewPeriodStart,
  { message: 'Review period end must be after start date' }
);

/**
 * Review section validation schema
 */
export const ReviewSectionSchema = z.object({
  reviewId: z.string().uuid(),
  sectionName: z.string().min(1).max(200),
  sectionOrder: z.number().int().min(0),
  weight: z.number().min(0).max(100),
  rating: z.nativeEnum(PerformanceRating).optional(),
  score: z.number().min(0).max(100).optional(),
  comments: z.string().max(5000).optional(),
  competencies: z.array(z.string()).optional(),
  evidence: z.array(z.string()).optional(),
});

/**
 * 360 Feedback request validation schema
 */
export const Feedback360RequestSchema = z.object({
  employeeId: z.string().uuid(),
  reviewId: z.string().uuid(),
  requesterId: z.string().uuid(),
  respondentId: z.string().uuid(),
  respondentType: z.enum(['peer', 'manager', 'direct_report', 'skip_level', 'external']),
  dueDate: z.coerce.date(),
  anonymousResponse: z.boolean().default(false),
});

/**
 * Continuous feedback validation schema
 */
export const ContinuousFeedbackSchema = z.object({
  employeeId: z.string().uuid(),
  giverId: z.string().uuid(),
  feedbackType: z.nativeEnum(FeedbackType),
  visibility: z.nativeEnum(FeedbackVisibility),
  content: z.string().min(10).max(5000),
  relatedGoalId: z.string().uuid().optional(),
  relatedProjectId: z.string().uuid().optional(),
  isAnonymous: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

/**
 * Performance Improvement Plan validation schema
 */
export const PIPSchema = z.object({
  employeeId: z.string().uuid(),
  managerId: z.string().uuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  reviewDate: z.coerce.date(),
  performanceIssues: z.array(z.string()).min(1),
  expectedImprovements: z.array(z.string()).min(1),
  supportProvided: z.array(z.string()),
  successCriteria: z.array(z.string()).min(1),
}).refine(
  (data) => data.endDate > data.startDate,
  { message: 'End date must be after start date' }
);

/**
 * Competency assessment validation schema
 */
export const CompetencyAssessmentSchema = z.object({
  reviewId: z.string().uuid(),
  competencyId: z.string().uuid(),
  competencyName: z.string().min(1).max(200),
  category: z.nativeEnum(CompetencyCategory),
  expectedLevel: z.number().int().min(1).max(5),
  currentLevel: z.number().int().min(1).max(5),
  rating: z.nativeEnum(PerformanceRating).optional(),
  assessorComments: z.string().max(2000).optional(),
  employeeComments: z.string().max(2000).optional(),
  developmentActions: z.array(z.string()).optional(),
});

/**
 * Calibration session validation schema
 */
export const CalibrationSessionSchema = z.object({
  name: z.string().min(1).max(200),
  cycleId: z.string().uuid(),
  facilitatorId: z.string().uuid(),
  scheduledDate: z.coerce.date(),
  participants: z.array(z.string().uuid()).min(2),
  reviewsDiscussed: z.array(z.string().uuid()).min(1),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Performance Review Cycle Model
 */
@Table({
  tableName: 'performance_review_cycles',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['cycle_year'] },
    { fields: ['cycle_type'] },
    { fields: ['status'] },
    { fields: ['start_date', 'end_date'] },
  ],
})
export class PerformanceReviewCycleModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Length({ min: 1, max: 200 })
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    comment: 'Cycle name (e.g., "2024 Annual Review")',
  })
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(ReviewCycleType)),
    allowNull: false,
    field: 'cycle_type',
  })
  cycleType: ReviewCycleType;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'cycle_year',
  })
  cycleYear: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'start_date',
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'end_date',
  })
  endDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'self_assessment_deadline',
  })
  selfAssessmentDeadline: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'manager_review_deadline',
  })
  managerReviewDeadline: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'calibration_deadline',
  })
  calibrationDeadline: Date;

  @Column({
    type: DataType.ENUM('planning', 'active', 'calibration', 'completed', 'closed'),
    allowNull: false,
    defaultValue: 'planning',
  })
  status: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Cycle configuration and settings',
  })
  configuration: Record<string, any>;

  @HasMany(() => PerformanceReviewModel)
  reviews: PerformanceReviewModel[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Performance Review Model
 */
@Table({
  tableName: 'performance_reviews',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['reviewer_id'] },
    { fields: ['cycle_id'] },
    { fields: ['status'] },
    { fields: ['review_period_start', 'review_period_end'] },
    { fields: ['overall_rating'] },
  ],
})
export class PerformanceReviewModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => PerformanceReviewCycleModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'cycle_id',
  })
  cycleId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'employee_id',
    comment: 'Employee being reviewed',
  })
  employeeId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'reviewer_id',
    comment: 'Primary reviewer (usually manager)',
  })
  reviewerId: string;

  @Column({
    type: DataType.ENUM(...Object.values(ReviewCycleType)),
    allowNull: false,
    field: 'review_type',
  })
  reviewType: ReviewCycleType;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'review_period_start',
  })
  reviewPeriodStart: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'review_period_end',
  })
  reviewPeriodEnd: Date;

  @Column({
    type: DataType.ENUM(...Object.values(ReviewStatus)),
    allowNull: false,
    defaultValue: ReviewStatus.NOT_STARTED,
  })
  status: ReviewStatus;

  @Column({
    type: DataType.ENUM(...Object.values(PerformanceRating)),
    allowNull: true,
    field: 'overall_rating',
  })
  overallRating: PerformanceRating;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    field: 'overall_score',
    comment: 'Overall performance score (0-100)',
  })
  overallScore: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'self_assessment_completed',
  })
  selfAssessmentCompleted: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'manager_assessment_completed',
  })
  managerAssessmentCompleted: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'calibration_completed',
  })
  calibrationCompleted: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'manager_comments',
  })
  managerComments: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'employee_comments',
  })
  employeeComments: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'hr_comments',
  })
  hrComments: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'finalized_at',
  })
  finalizedAt: Date;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'finalized_by',
  })
  finalizedBy: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @BelongsTo(() => PerformanceReviewCycleModel)
  cycle: PerformanceReviewCycleModel;

  @HasMany(() => ReviewSectionModel)
  sections: ReviewSectionModel[];

  @HasMany(() => Feedback360RequestModel)
  feedback360Requests: Feedback360RequestModel[];

  @HasMany(() => CompetencyAssessmentModel)
  competencyAssessments: CompetencyAssessmentModel[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Review Section Model
 */
@Table({
  tableName: 'review_sections',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['review_id'] },
    { fields: ['section_order'] },
  ],
})
export class ReviewSectionModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => PerformanceReviewModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'review_id',
  })
  reviewId: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    field: 'section_name',
  })
  sectionName: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'section_order',
  })
  sectionOrder: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Section weight in overall review (0-100)',
  })
  weight: number;

  @Column({
    type: DataType.ENUM(...Object.values(PerformanceRating)),
    allowNull: true,
  })
  rating: PerformanceRating;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Section score (0-100)',
  })
  score: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  comments: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Competencies assessed in this section',
  })
  competencies: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Evidence or examples',
  })
  evidence: string[];

  @BelongsTo(() => PerformanceReviewModel)
  review: PerformanceReviewModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * 360 Feedback Request Model
 */
@Table({
  tableName: 'feedback_360_requests',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['review_id'] },
    { fields: ['respondent_id'] },
    { fields: ['status'] },
    { fields: ['due_date'] },
  ],
})
export class Feedback360RequestModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'employee_id',
  })
  employeeId: string;

  @ForeignKey(() => PerformanceReviewModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'review_id',
  })
  reviewId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'requester_id',
  })
  requesterId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'respondent_id',
  })
  respondentId: string;

  @Column({
    type: DataType.ENUM('peer', 'manager', 'direct_report', 'skip_level', 'external'),
    allowNull: false,
    field: 'respondent_type',
  })
  respondentType: string;

  @Column({
    type: DataType.ENUM(...Object.values(Feedback360Status)),
    allowNull: false,
    defaultValue: Feedback360Status.PENDING,
  })
  status: Feedback360Status;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'requested_at',
  })
  requestedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'completed_at',
  })
  completedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'due_date',
  })
  dueDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'anonymous_response',
  })
  anonymousResponse: boolean;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Feedback responses',
  })
  responses: Record<string, any>;

  @BelongsTo(() => PerformanceReviewModel)
  review: PerformanceReviewModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Continuous Feedback Model
 */
@Table({
  tableName: 'continuous_feedback',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['giver_id'] },
    { fields: ['feedback_type'] },
    { fields: ['visibility'] },
    { fields: ['created_at'] },
  ],
})
export class ContinuousFeedbackModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'employee_id',
  })
  employeeId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'giver_id',
  })
  giverId: string;

  @Column({
    type: DataType.ENUM(...Object.values(FeedbackType)),
    allowNull: false,
    field: 'feedback_type',
  })
  feedbackType: FeedbackType;

  @Column({
    type: DataType.ENUM(...Object.values(FeedbackVisibility)),
    allowNull: false,
  })
  visibility: FeedbackVisibility;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'related_goal_id',
  })
  relatedGoalId: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'related_project_id',
  })
  relatedProjectId: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'acknowledged_at',
  })
  acknowledgedAt: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_anonymous',
  })
  isAnonymous: boolean;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  tags: string[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Performance Improvement Plan Model
 */
@Table({
  tableName: 'performance_improvement_plans',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['manager_id'] },
    { fields: ['status'] },
    { fields: ['start_date', 'end_date'] },
  ],
})
export class PerformanceImprovementPlanModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'employee_id',
  })
  employeeId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'manager_id',
  })
  managerId: string;

  @Column({
    type: DataType.ENUM(...Object.values(PIPStatus)),
    allowNull: false,
    defaultValue: PIPStatus.DRAFT,
  })
  status: PIPStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'start_date',
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'end_date',
  })
  endDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'review_date',
  })
  reviewDate: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'performance_issues',
  })
  performanceIssues: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'expected_improvements',
  })
  expectedImprovements: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'support_provided',
  })
  supportProvided: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'success_criteria',
  })
  successCriteria: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  outcome: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'hr_approval_by',
  })
  hrApprovalBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'hr_approval_at',
  })
  hrApprovalAt: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Competency Model
 */
@Table({
  tableName: 'competencies',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['code'], unique: true },
    { fields: ['category'] },
    { fields: ['is_active'] },
  ],
})
export class CompetencyModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  code: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.ENUM(...Object.values(CompetencyCategory)),
    allowNull: false,
  })
  category: CompetencyCategory;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Level definitions (1-5)',
  })
  levelDefinitions: Record<string, any>;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  isActive: boolean;

  @HasMany(() => CompetencyAssessmentModel)
  assessments: CompetencyAssessmentModel[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Competency Assessment Model
 */
@Table({
  tableName: 'competency_assessments',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['review_id'] },
    { fields: ['competency_id'] },
  ],
})
export class CompetencyAssessmentModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => PerformanceReviewModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'review_id',
  })
  reviewId: string;

  @ForeignKey(() => CompetencyModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'competency_id',
  })
  competencyId: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    field: 'competency_name',
  })
  competencyName: string;

  @Column({
    type: DataType.ENUM(...Object.values(CompetencyCategory)),
    allowNull: false,
  })
  category: CompetencyCategory;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'expected_level',
  })
  expectedLevel: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'current_level',
  })
  currentLevel: number;

  @Column({
    type: DataType.ENUM(...Object.values(PerformanceRating)),
    allowNull: true,
  })
  rating: PerformanceRating;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'assessor_comments',
  })
  assessorComments: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'employee_comments',
  })
  employeeComments: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'development_actions',
  })
  developmentActions: string[];

  @BelongsTo(() => PerformanceReviewModel)
  review: PerformanceReviewModel;

  @BelongsTo(() => CompetencyModel)
  competency: CompetencyModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Calibration Session Model
 */
@Table({
  tableName: 'calibration_sessions',
  timestamps: true,
  indexes: [
    { fields: ['cycle_id'] },
    { fields: ['status'] },
    { fields: ['scheduled_date'] },
  ],
})
export class CalibrationSessionModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => PerformanceReviewCycleModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'cycle_id',
  })
  cycleId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'facilitator_id',
  })
  facilitatorId: string;

  @Column({
    type: DataType.ENUM(...Object.values(CalibrationStatus)),
    allowNull: false,
    defaultValue: CalibrationStatus.SCHEDULED,
  })
  status: CalibrationStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'scheduled_date',
  })
  scheduledDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'completed_date',
  })
  completedDate: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  participants: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'reviews_discussed',
  })
  reviewsDiscussed: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'rating_adjustments',
  })
  ratingAdjustments: Array<{
    reviewId: string;
    oldRating: PerformanceRating;
    newRating: PerformanceRating;
    reason: string;
  }>;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @BelongsTo(() => PerformanceReviewCycleModel)
  cycle: PerformanceReviewCycleModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

// ============================================================================
// CORE PERFORMANCE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Create performance review cycle
 *
 * @param cycleData - Review cycle data
 * @param transaction - Optional transaction
 * @returns Created review cycle
 *
 * @example
 * ```typescript
 * const cycle = await createReviewCycle({
 *   name: '2024 Annual Review',
 *   cycleType: ReviewCycleType.ANNUAL,
 *   cycleYear: 2024,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 * });
 * ```
 */
export async function createReviewCycle(
  cycleData: {
    name: string;
    cycleType: ReviewCycleType;
    cycleYear: number;
    startDate: Date;
    endDate: Date;
    selfAssessmentDeadline?: Date;
    managerReviewDeadline?: Date;
    calibrationDeadline?: Date;
    description?: string;
    configuration?: Record<string, any>;
  },
  transaction?: Transaction,
): Promise<PerformanceReviewCycleModel> {
  if (cycleData.endDate <= cycleData.startDate) {
    throw new BadRequestException('End date must be after start date');
  }

  const cycle = await PerformanceReviewCycleModel.create(cycleData as any, { transaction });
  return cycle;
}

/**
 * Create performance review
 *
 * @param reviewData - Performance review data
 * @param transaction - Optional transaction
 * @returns Created performance review
 *
 * @example
 * ```typescript
 * const review = await createPerformanceReview({
 *   employeeId: 'emp-uuid',
 *   reviewerId: 'manager-uuid',
 *   cycleId: 'cycle-uuid',
 *   reviewType: ReviewCycleType.ANNUAL,
 *   reviewPeriodStart: new Date('2024-01-01'),
 *   reviewPeriodEnd: new Date('2024-12-31'),
 * });
 * ```
 */
export async function createPerformanceReview(
  reviewData: Partial<PerformanceReview>,
  transaction?: Transaction,
): Promise<PerformanceReviewModel> {
  const validated = PerformanceReviewSchema.parse(reviewData);

  // Check if review already exists for this employee and cycle
  const existing = await PerformanceReviewModel.findOne({
    where: {
      employeeId: validated.employeeId,
      cycleId: validated.cycleId,
    },
    transaction,
  });

  if (existing) {
    throw new ConflictException('Performance review already exists for this employee and cycle');
  }

  const review = await PerformanceReviewModel.create(validated as any, { transaction });
  return review;
}

/**
 * Update performance review
 *
 * @param reviewId - Review ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await updatePerformanceReview('review-uuid', {
 *   status: ReviewStatus.MANAGER_REVIEW,
 *   managerAssessmentCompleted: true,
 * });
 * ```
 */
export async function updatePerformanceReview(
  reviewId: string,
  updates: Partial<PerformanceReview>,
  transaction?: Transaction,
): Promise<PerformanceReviewModel> {
  const review = await PerformanceReviewModel.findByPk(reviewId, { transaction });

  if (!review) {
    throw new NotFoundException(`Performance review ${reviewId} not found`);
  }

  await review.update(updates, { transaction });
  return review;
}

/**
 * Get performance review by ID
 *
 * @param reviewId - Review ID
 * @param includeRelations - Include related data
 * @returns Performance review or null
 *
 * @example
 * ```typescript
 * const review = await getPerformanceReviewById('review-uuid', true);
 * ```
 */
export async function getPerformanceReviewById(
  reviewId: string,
  includeRelations: boolean = false,
): Promise<PerformanceReviewModel | null> {
  const options: FindOptions = {
    where: { id: reviewId },
  };

  if (includeRelations) {
    options.include = [
      { model: PerformanceReviewCycleModel, as: 'cycle' },
      { model: ReviewSectionModel, as: 'sections' },
      { model: Feedback360RequestModel, as: 'feedback360Requests' },
      { model: CompetencyAssessmentModel, as: 'competencyAssessments' },
    ];
  }

  return PerformanceReviewModel.findOne(options);
}

/**
 * Get employee performance reviews
 *
 * @param employeeId - Employee ID
 * @param filters - Optional filters
 * @returns Array of performance reviews
 *
 * @example
 * ```typescript
 * const reviews = await getEmployeePerformanceReviews('emp-uuid', {
 *   status: ReviewStatus.COMPLETED,
 *   limit: 10,
 * });
 * ```
 */
export async function getEmployeePerformanceReviews(
  employeeId: string,
  filters?: {
    cycleId?: string;
    status?: ReviewStatus;
    reviewType?: ReviewCycleType;
    limit?: number;
    offset?: number;
  },
): Promise<PerformanceReviewModel[]> {
  const where: WhereOptions = { employeeId };

  if (filters?.cycleId) where.cycleId = filters.cycleId;
  if (filters?.status) where.status = filters.status;
  if (filters?.reviewType) where.reviewType = filters.reviewType;

  return PerformanceReviewModel.findAll({
    where,
    limit: filters?.limit || 100,
    offset: filters?.offset || 0,
    order: [['reviewPeriodEnd', 'DESC']],
    include: [
      { model: PerformanceReviewCycleModel, as: 'cycle' },
    ],
  });
}

/**
 * Finalize performance review
 *
 * @param reviewId - Review ID
 * @param finalizedBy - User finalizing review
 * @param overallRating - Overall performance rating
 * @param overallScore - Overall performance score
 * @param transaction - Optional transaction
 * @returns Finalized review
 *
 * @example
 * ```typescript
 * await finalizePerformanceReview('review-uuid', 'hr-uuid',
 *   PerformanceRating.EXCEEDS_EXPECTATIONS, 85);
 * ```
 */
export async function finalizePerformanceReview(
  reviewId: string,
  finalizedBy: string,
  overallRating: PerformanceRating,
  overallScore: number,
  transaction?: Transaction,
): Promise<PerformanceReviewModel> {
  const review = await PerformanceReviewModel.findByPk(reviewId, { transaction });

  if (!review) {
    throw new NotFoundException(`Performance review ${reviewId} not found`);
  }

  if (review.status === ReviewStatus.COMPLETED) {
    throw new BadRequestException('Performance review is already finalized');
  }

  await review.update({
    status: ReviewStatus.COMPLETED,
    overallRating,
    overallScore,
    finalizedAt: new Date(),
    finalizedBy,
  }, { transaction });

  return review;
}

/**
 * Add review section
 *
 * @param sectionData - Review section data
 * @param transaction - Optional transaction
 * @returns Created review section
 *
 * @example
 * ```typescript
 * const section = await addReviewSection({
 *   reviewId: 'review-uuid',
 *   sectionName: 'Job Knowledge',
 *   sectionOrder: 1,
 *   weight: 25,
 * });
 * ```
 */
export async function addReviewSection(
  sectionData: Partial<ReviewSection>,
  transaction?: Transaction,
): Promise<ReviewSectionModel> {
  const validated = ReviewSectionSchema.parse(sectionData);
  const section = await ReviewSectionModel.create(validated as any, { transaction });
  return section;
}

/**
 * Update review section
 *
 * @param sectionId - Section ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated section
 *
 * @example
 * ```typescript
 * await updateReviewSection('section-uuid', {
 *   rating: PerformanceRating.EXCEEDS_EXPECTATIONS,
 *   score: 90,
 *   comments: 'Excellent performance in this area',
 * });
 * ```
 */
export async function updateReviewSection(
  sectionId: string,
  updates: Partial<ReviewSection>,
  transaction?: Transaction,
): Promise<ReviewSectionModel> {
  const section = await ReviewSectionModel.findByPk(sectionId, { transaction });

  if (!section) {
    throw new NotFoundException(`Review section ${sectionId} not found`);
  }

  await section.update(updates, { transaction });
  return section;
}

/**
 * Get review sections
 *
 * @param reviewId - Review ID
 * @returns Array of review sections
 *
 * @example
 * ```typescript
 * const sections = await getReviewSections('review-uuid');
 * ```
 */
export async function getReviewSections(
  reviewId: string,
): Promise<ReviewSectionModel[]> {
  return ReviewSectionModel.findAll({
    where: { reviewId },
    order: [['sectionOrder', 'ASC']],
  });
}

/**
 * Calculate overall review score
 *
 * @param reviewId - Review ID
 * @returns Calculated overall score
 *
 * @example
 * ```typescript
 * const score = await calculateOverallScore('review-uuid');
 * ```
 */
export async function calculateOverallScore(
  reviewId: string,
): Promise<number> {
  const sections = await ReviewSectionModel.findAll({
    where: { reviewId },
  });

  if (sections.length === 0) {
    return 0;
  }

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const section of sections) {
    if (section.score !== null && section.weight > 0) {
      totalWeightedScore += section.score * section.weight;
      totalWeight += section.weight;
    }
  }

  return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
}

// ============================================================================
// 360 FEEDBACK FUNCTIONS
// ============================================================================

/**
 * Create 360 feedback request
 *
 * @param requestData - Feedback request data
 * @param transaction - Optional transaction
 * @returns Created feedback request
 *
 * @example
 * ```typescript
 * const request = await create360FeedbackRequest({
 *   employeeId: 'emp-uuid',
 *   reviewId: 'review-uuid',
 *   requesterId: 'manager-uuid',
 *   respondentId: 'peer-uuid',
 *   respondentType: 'peer',
 *   dueDate: new Date('2024-03-31'),
 * });
 * ```
 */
export async function create360FeedbackRequest(
  requestData: Partial<Feedback360Request>,
  transaction?: Transaction,
): Promise<Feedback360RequestModel> {
  const validated = Feedback360RequestSchema.parse(requestData);
  const request = await Feedback360RequestModel.create(validated as any, { transaction });
  return request;
}

/**
 * Submit 360 feedback response
 *
 * @param requestId - Request ID
 * @param responses - Feedback responses
 * @param transaction - Optional transaction
 * @returns Updated feedback request
 *
 * @example
 * ```typescript
 * await submit360FeedbackResponse('request-uuid', {
 *   competencyRatings: { leadership: 4, communication: 5 },
 *   strengths: 'Great communicator...',
 *   areasForImprovement: 'Could improve...',
 * });
 * ```
 */
export async function submit360FeedbackResponse(
  requestId: string,
  responses: Record<string, any>,
  transaction?: Transaction,
): Promise<Feedback360RequestModel> {
  const request = await Feedback360RequestModel.findByPk(requestId, { transaction });

  if (!request) {
    throw new NotFoundException(`360 feedback request ${requestId} not found`);
  }

  if (request.status === Feedback360Status.COMPLETED) {
    throw new BadRequestException('Feedback request already completed');
  }

  await request.update({
    responses,
    status: Feedback360Status.COMPLETED,
    completedAt: new Date(),
  }, { transaction });

  return request;
}

/**
 * Get 360 feedback requests for employee
 *
 * @param employeeId - Employee ID
 * @param filters - Optional filters
 * @returns Array of feedback requests
 *
 * @example
 * ```typescript
 * const requests = await get360FeedbackRequests('emp-uuid', {
 *   status: Feedback360Status.PENDING,
 * });
 * ```
 */
export async function get360FeedbackRequests(
  employeeId: string,
  filters?: {
    reviewId?: string;
    status?: Feedback360Status;
    respondentType?: string;
  },
): Promise<Feedback360RequestModel[]> {
  const where: WhereOptions = { employeeId };

  if (filters?.reviewId) where.reviewId = filters.reviewId;
  if (filters?.status) where.status = filters.status;
  if (filters?.respondentType) where.respondentType = filters.respondentType;

  return Feedback360RequestModel.findAll({
    where,
    order: [['requestedAt', 'DESC']],
  });
}

/**
 * Get 360 feedback requests for respondent
 *
 * @param respondentId - Respondent ID
 * @param filters - Optional filters
 * @returns Array of feedback requests
 *
 * @example
 * ```typescript
 * const requests = await get360FeedbackRequestsForRespondent('user-uuid', {
 *   status: Feedback360Status.PENDING,
 * });
 * ```
 */
export async function get360FeedbackRequestsForRespondent(
  respondentId: string,
  filters?: {
    status?: Feedback360Status;
  },
): Promise<Feedback360RequestModel[]> {
  const where: WhereOptions = { respondentId };

  if (filters?.status) where.status = filters.status;

  return Feedback360RequestModel.findAll({
    where,
    order: [['dueDate', 'ASC']],
  });
}

/**
 * Aggregate 360 feedback for review
 *
 * @param reviewId - Review ID
 * @returns Aggregated feedback data
 *
 * @example
 * ```typescript
 * const aggregated = await aggregate360Feedback('review-uuid');
 * ```
 */
export async function aggregate360Feedback(
  reviewId: string,
): Promise<Record<string, any>> {
  const requests = await Feedback360RequestModel.findAll({
    where: {
      reviewId,
      status: Feedback360Status.COMPLETED,
    },
  });

  const aggregated: Record<string, any> = {
    totalResponses: requests.length,
    byRespondentType: {} as Record<string, number>,
    averageRatings: {} as Record<string, number>,
    themes: {
      strengths: [] as string[],
      areasForImprovement: [] as string[],
    },
  };

  // Count by respondent type
  requests.forEach((request) => {
    aggregated.byRespondentType[request.respondentType] =
      (aggregated.byRespondentType[request.respondentType] || 0) + 1;
  });

  // Aggregate ratings
  const ratingCounts: Record<string, { sum: number; count: number }> = {};

  requests.forEach((request) => {
    if (request.responses?.competencyRatings) {
      Object.entries(request.responses.competencyRatings).forEach(([competency, rating]) => {
        if (!ratingCounts[competency]) {
          ratingCounts[competency] = { sum: 0, count: 0 };
        }
        ratingCounts[competency].sum += rating as number;
        ratingCounts[competency].count += 1;
      });
    }

    // Collect themes
    if (request.responses?.strengths) {
      aggregated.themes.strengths.push(request.responses.strengths);
    }
    if (request.responses?.areasForImprovement) {
      aggregated.themes.areasForImprovement.push(request.responses.areasForImprovement);
    }
  });

  // Calculate averages
  Object.entries(ratingCounts).forEach(([competency, data]) => {
    aggregated.averageRatings[competency] = data.sum / data.count;
  });

  return aggregated;
}

// ============================================================================
// CONTINUOUS FEEDBACK FUNCTIONS
// ============================================================================

/**
 * Create continuous feedback
 *
 * @param feedbackData - Feedback data
 * @param transaction - Optional transaction
 * @returns Created feedback
 *
 * @example
 * ```typescript
 * const feedback = await createContinuousFeedback({
 *   employeeId: 'emp-uuid',
 *   giverId: 'manager-uuid',
 *   feedbackType: FeedbackType.PRAISE,
 *   visibility: FeedbackVisibility.EMPLOYEE,
 *   content: 'Great work on the project!',
 * });
 * ```
 */
export async function createContinuousFeedback(
  feedbackData: Partial<ContinuousFeedback>,
  transaction?: Transaction,
): Promise<ContinuousFeedbackModel> {
  const validated = ContinuousFeedbackSchema.parse(feedbackData);
  const feedback = await ContinuousFeedbackModel.create(validated as any, { transaction });
  return feedback;
}

/**
 * Get employee continuous feedback
 *
 * @param employeeId - Employee ID
 * @param filters - Optional filters
 * @returns Array of feedback items
 *
 * @example
 * ```typescript
 * const feedback = await getEmployeeContinuousFeedback('emp-uuid', {
 *   feedbackType: FeedbackType.PRAISE,
 *   limit: 20,
 * });
 * ```
 */
export async function getEmployeeContinuousFeedback(
  employeeId: string,
  filters?: {
    feedbackType?: FeedbackType;
    giverId?: string;
    visibility?: FeedbackVisibility;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  },
): Promise<ContinuousFeedbackModel[]> {
  const where: WhereOptions = { employeeId };

  if (filters?.feedbackType) where.feedbackType = filters.feedbackType;
  if (filters?.giverId) where.giverId = filters.giverId;
  if (filters?.visibility) where.visibility = filters.visibility;

  if (filters?.startDate || filters?.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      (where.createdAt as any)[Op.gte] = filters.startDate;
    }
    if (filters.endDate) {
      (where.createdAt as any)[Op.lte] = filters.endDate;
    }
  }

  return ContinuousFeedbackModel.findAll({
    where,
    limit: filters?.limit || 100,
    offset: filters?.offset || 0,
    order: [['createdAt', 'DESC']],
  });
}

/**
 * Acknowledge feedback
 *
 * @param feedbackId - Feedback ID
 * @param transaction - Optional transaction
 * @returns Updated feedback
 *
 * @example
 * ```typescript
 * await acknowledgeFeedback('feedback-uuid');
 * ```
 */
export async function acknowledgeFeedback(
  feedbackId: string,
  transaction?: Transaction,
): Promise<ContinuousFeedbackModel> {
  const feedback = await ContinuousFeedbackModel.findByPk(feedbackId, { transaction });

  if (!feedback) {
    throw new NotFoundException(`Feedback ${feedbackId} not found`);
  }

  await feedback.update({
    acknowledgedAt: new Date(),
  }, { transaction });

  return feedback;
}

/**
 * Get feedback statistics
 *
 * @param employeeId - Employee ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Feedback statistics
 *
 * @example
 * ```typescript
 * const stats = await getFeedbackStatistics('emp-uuid',
 *   new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export async function getFeedbackStatistics(
  employeeId: string,
  startDate: Date,
  endDate: Date,
): Promise<{
  totalFeedback: number;
  byType: Record<FeedbackType, number>;
  byVisibility: Record<FeedbackVisibility, number>;
  acknowledgedCount: number;
}> {
  const feedback = await ContinuousFeedbackModel.findAll({
    where: {
      employeeId,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  const stats = {
    totalFeedback: feedback.length,
    byType: {} as Record<FeedbackType, number>,
    byVisibility: {} as Record<FeedbackVisibility, number>,
    acknowledgedCount: 0,
  };

  feedback.forEach((item) => {
    stats.byType[item.feedbackType] = (stats.byType[item.feedbackType] || 0) + 1;
    stats.byVisibility[item.visibility] = (stats.byVisibility[item.visibility] || 0) + 1;
    if (item.acknowledgedAt) {
      stats.acknowledgedCount += 1;
    }
  });

  return stats;
}

// ============================================================================
// PERFORMANCE IMPROVEMENT PLAN (PIP) FUNCTIONS
// ============================================================================

/**
 * Create Performance Improvement Plan
 *
 * @param pipData - PIP data
 * @param transaction - Optional transaction
 * @returns Created PIP
 *
 * @example
 * ```typescript
 * const pip = await createPerformanceImprovementPlan({
 *   employeeId: 'emp-uuid',
 *   managerId: 'manager-uuid',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-03-31'),
 *   reviewDate: new Date('2024-02-15'),
 *   performanceIssues: ['Issue 1', 'Issue 2'],
 *   expectedImprovements: ['Improvement 1', 'Improvement 2'],
 *   supportProvided: ['Training', 'Mentoring'],
 *   successCriteria: ['Criteria 1', 'Criteria 2'],
 * });
 * ```
 */
export async function createPerformanceImprovementPlan(
  pipData: Partial<PerformanceImprovementPlan>,
  transaction?: Transaction,
): Promise<PerformanceImprovementPlanModel> {
  const validated = PIPSchema.parse(pipData);

  // Check if active PIP already exists for employee
  const existing = await PerformanceImprovementPlanModel.findOne({
    where: {
      employeeId: validated.employeeId,
      status: {
        [Op.in]: [PIPStatus.ACTIVE, PIPStatus.IN_PROGRESS],
      },
    },
    transaction,
  });

  if (existing) {
    throw new ConflictException('Active PIP already exists for this employee');
  }

  const pip = await PerformanceImprovementPlanModel.create(validated as any, { transaction });
  return pip;
}

/**
 * Update PIP status
 *
 * @param pipId - PIP ID
 * @param status - New status
 * @param outcome - Outcome description (if completed)
 * @param transaction - Optional transaction
 * @returns Updated PIP
 *
 * @example
 * ```typescript
 * await updatePIPStatus('pip-uuid', PIPStatus.SUCCESSFUL,
 *   'Employee met all success criteria');
 * ```
 */
export async function updatePIPStatus(
  pipId: string,
  status: PIPStatus,
  outcome?: string,
  transaction?: Transaction,
): Promise<PerformanceImprovementPlanModel> {
  const pip = await PerformanceImprovementPlanModel.findByPk(pipId, { transaction });

  if (!pip) {
    throw new NotFoundException(`PIP ${pipId} not found`);
  }

  const updates: any = { status };
  if (outcome) {
    updates.outcome = outcome;
  }

  await pip.update(updates, { transaction });
  return pip;
}

/**
 * Approve PIP (HR approval)
 *
 * @param pipId - PIP ID
 * @param hrUserId - HR user approving
 * @param transaction - Optional transaction
 * @returns Updated PIP
 *
 * @example
 * ```typescript
 * await approvePIP('pip-uuid', 'hr-uuid');
 * ```
 */
export async function approvePIP(
  pipId: string,
  hrUserId: string,
  transaction?: Transaction,
): Promise<PerformanceImprovementPlanModel> {
  const pip = await PerformanceImprovementPlanModel.findByPk(pipId, { transaction });

  if (!pip) {
    throw new NotFoundException(`PIP ${pipId} not found`);
  }

  await pip.update({
    status: PIPStatus.ACTIVE,
    hrApprovalBy: hrUserId,
    hrApprovalAt: new Date(),
  }, { transaction });

  return pip;
}

/**
 * Get employee PIPs
 *
 * @param employeeId - Employee ID
 * @param includeCompleted - Include completed PIPs
 * @returns Array of PIPs
 *
 * @example
 * ```typescript
 * const pips = await getEmployeePIPs('emp-uuid', true);
 * ```
 */
export async function getEmployeePIPs(
  employeeId: string,
  includeCompleted: boolean = false,
): Promise<PerformanceImprovementPlanModel[]> {
  const where: WhereOptions = { employeeId };

  if (!includeCompleted) {
    where.status = {
      [Op.notIn]: [PIPStatus.SUCCESSFUL, PIPStatus.UNSUCCESSFUL, PIPStatus.CANCELLED],
    };
  }

  return PerformanceImprovementPlanModel.findAll({
    where,
    order: [['startDate', 'DESC']],
  });
}

/**
 * Get active PIPs for manager
 *
 * @param managerId - Manager ID
 * @returns Array of active PIPs
 *
 * @example
 * ```typescript
 * const pips = await getActivePIPsForManager('manager-uuid');
 * ```
 */
export async function getActivePIPsForManager(
  managerId: string,
): Promise<PerformanceImprovementPlanModel[]> {
  return PerformanceImprovementPlanModel.findAll({
    where: {
      managerId,
      status: {
        [Op.in]: [PIPStatus.ACTIVE, PIPStatus.IN_PROGRESS],
      },
    },
    order: [['reviewDate', 'ASC']],
  });
}

// ============================================================================
// COMPETENCY ASSESSMENT FUNCTIONS
// ============================================================================

/**
 * Create competency
 *
 * @param competencyData - Competency data
 * @param transaction - Optional transaction
 * @returns Created competency
 *
 * @example
 * ```typescript
 * const competency = await createCompetency({
 *   code: 'LEAD-001',
 *   name: 'Strategic Leadership',
 *   category: CompetencyCategory.LEADERSHIP,
 *   description: 'Ability to set and communicate vision...',
 * });
 * ```
 */
export async function createCompetency(
  competencyData: {
    code: string;
    name: string;
    description?: string;
    category: CompetencyCategory;
    levelDefinitions?: Record<string, any>;
  },
  transaction?: Transaction,
): Promise<CompetencyModel> {
  const existing = await CompetencyModel.findOne({
    where: { code: competencyData.code },
    transaction,
  });

  if (existing) {
    throw new ConflictException(`Competency with code ${competencyData.code} already exists`);
  }

  const competency = await CompetencyModel.create(competencyData as any, { transaction });
  return competency;
}

/**
 * Add competency assessment to review
 *
 * @param assessmentData - Assessment data
 * @param transaction - Optional transaction
 * @returns Created assessment
 *
 * @example
 * ```typescript
 * const assessment = await addCompetencyAssessment({
 *   reviewId: 'review-uuid',
 *   competencyId: 'comp-uuid',
 *   competencyName: 'Strategic Leadership',
 *   category: CompetencyCategory.LEADERSHIP,
 *   expectedLevel: 4,
 *   currentLevel: 3,
 * });
 * ```
 */
export async function addCompetencyAssessment(
  assessmentData: Partial<CompetencyAssessment>,
  transaction?: Transaction,
): Promise<CompetencyAssessmentModel> {
  const validated = CompetencyAssessmentSchema.parse(assessmentData);
  const assessment = await CompetencyAssessmentModel.create(validated as any, { transaction });
  return assessment;
}

/**
 * Update competency assessment
 *
 * @param assessmentId - Assessment ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated assessment
 *
 * @example
 * ```typescript
 * await updateCompetencyAssessment('assessment-uuid', {
 *   currentLevel: 4,
 *   rating: PerformanceRating.EXCEEDS_EXPECTATIONS,
 *   assessorComments: 'Showing strong improvement',
 * });
 * ```
 */
export async function updateCompetencyAssessment(
  assessmentId: string,
  updates: Partial<CompetencyAssessment>,
  transaction?: Transaction,
): Promise<CompetencyAssessmentModel> {
  const assessment = await CompetencyAssessmentModel.findByPk(assessmentId, { transaction });

  if (!assessment) {
    throw new NotFoundException(`Competency assessment ${assessmentId} not found`);
  }

  await assessment.update(updates, { transaction });
  return assessment;
}

/**
 * Get competency assessments for review
 *
 * @param reviewId - Review ID
 * @returns Array of competency assessments
 *
 * @example
 * ```typescript
 * const assessments = await getCompetencyAssessments('review-uuid');
 * ```
 */
export async function getCompetencyAssessments(
  reviewId: string,
): Promise<CompetencyAssessmentModel[]> {
  return CompetencyAssessmentModel.findAll({
    where: { reviewId },
    include: [{ model: CompetencyModel, as: 'competency' }],
    order: [['category', 'ASC'], ['competencyName', 'ASC']],
  });
}

/**
 * Get competency gap analysis
 *
 * @param reviewId - Review ID
 * @returns Competency gap analysis
 *
 * @example
 * ```typescript
 * const gaps = await getCompetencyGapAnalysis('review-uuid');
 * ```
 */
export async function getCompetencyGapAnalysis(
  reviewId: string,
): Promise<Array<{
  competencyId: string;
  competencyName: string;
  category: CompetencyCategory;
  expectedLevel: number;
  currentLevel: number;
  gap: number;
  developmentPriority: 'high' | 'medium' | 'low';
}>> {
  const assessments = await CompetencyAssessmentModel.findAll({
    where: { reviewId },
  });

  const gaps = assessments.map((assessment) => {
    const gap = assessment.expectedLevel - assessment.currentLevel;
    let developmentPriority: 'high' | 'medium' | 'low' = 'low';

    if (gap >= 2) {
      developmentPriority = 'high';
    } else if (gap === 1) {
      developmentPriority = 'medium';
    }

    return {
      competencyId: assessment.competencyId,
      competencyName: assessment.competencyName,
      category: assessment.category,
      expectedLevel: assessment.expectedLevel,
      currentLevel: assessment.currentLevel,
      gap,
      developmentPriority,
    };
  });

  return gaps.sort((a, b) => b.gap - a.gap);
}

// ============================================================================
// CALIBRATION SESSION FUNCTIONS
// ============================================================================

/**
 * Create calibration session
 *
 * @param sessionData - Session data
 * @param transaction - Optional transaction
 * @returns Created session
 *
 * @example
 * ```typescript
 * const session = await createCalibrationSession({
 *   name: 'Engineering Team Calibration',
 *   cycleId: 'cycle-uuid',
 *   facilitatorId: 'hr-uuid',
 *   scheduledDate: new Date('2024-03-15'),
 *   participants: ['manager1-uuid', 'manager2-uuid'],
 *   reviewsDiscussed: ['review1-uuid', 'review2-uuid'],
 * });
 * ```
 */
export async function createCalibrationSession(
  sessionData: Partial<CalibrationSession>,
  transaction?: Transaction,
): Promise<CalibrationSessionModel> {
  const validated = CalibrationSessionSchema.parse(sessionData);
  const session = await CalibrationSessionModel.create(validated as any, { transaction });
  return session;
}

/**
 * Update calibration session
 *
 * @param sessionId - Session ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated session
 *
 * @example
 * ```typescript
 * await updateCalibrationSession('session-uuid', {
 *   status: CalibrationStatus.COMPLETED,
 *   completedDate: new Date(),
 * });
 * ```
 */
export async function updateCalibrationSession(
  sessionId: string,
  updates: Partial<CalibrationSession>,
  transaction?: Transaction,
): Promise<CalibrationSessionModel> {
  const session = await CalibrationSessionModel.findByPk(sessionId, { transaction });

  if (!session) {
    throw new NotFoundException(`Calibration session ${sessionId} not found`);
  }

  await session.update(updates, { transaction });
  return session;
}

/**
 * Add rating adjustment in calibration
 *
 * @param sessionId - Session ID
 * @param reviewId - Review ID
 * @param oldRating - Old rating
 * @param newRating - New rating
 * @param reason - Reason for adjustment
 * @param transaction - Optional transaction
 * @returns Updated session
 *
 * @example
 * ```typescript
 * await addRatingAdjustment('session-uuid', 'review-uuid',
 *   PerformanceRating.MEETS_EXPECTATIONS,
 *   PerformanceRating.EXCEEDS_EXPECTATIONS,
 *   'Performance was underrated compared to peers');
 * ```
 */
export async function addRatingAdjustment(
  sessionId: string,
  reviewId: string,
  oldRating: PerformanceRating,
  newRating: PerformanceRating,
  reason: string,
  transaction?: Transaction,
): Promise<CalibrationSessionModel> {
  const session = await CalibrationSessionModel.findByPk(sessionId, { transaction });

  if (!session) {
    throw new NotFoundException(`Calibration session ${sessionId} not found`);
  }

  const adjustments = session.ratingAdjustments || [];
  adjustments.push({
    reviewId,
    oldRating,
    newRating,
    reason,
  });

  await session.update({ ratingAdjustments: adjustments }, { transaction });

  // Update the review with new rating
  await updatePerformanceReview(reviewId, {
    overallRating: newRating,
    calibrationCompleted: true,
  } as any, transaction);

  return session;
}

/**
 * Get calibration sessions for cycle
 *
 * @param cycleId - Cycle ID
 * @returns Array of calibration sessions
 *
 * @example
 * ```typescript
 * const sessions = await getCalibrationSessions('cycle-uuid');
 * ```
 */
export async function getCalibrationSessions(
  cycleId: string,
): Promise<CalibrationSessionModel[]> {
  return CalibrationSessionModel.findAll({
    where: { cycleId },
    order: [['scheduledDate', 'ASC']],
    include: [{ model: PerformanceReviewCycleModel, as: 'cycle' }],
  });
}

/**
 * Complete calibration session
 *
 * @param sessionId - Session ID
 * @param notes - Session notes
 * @param transaction - Optional transaction
 * @returns Completed session
 *
 * @example
 * ```typescript
 * await completeCalibrationSession('session-uuid',
 *   'All ratings reviewed and adjusted as needed');
 * ```
 */
export async function completeCalibrationSession(
  sessionId: string,
  notes?: string,
  transaction?: Transaction,
): Promise<CalibrationSessionModel> {
  const session = await CalibrationSessionModel.findByPk(sessionId, { transaction });

  if (!session) {
    throw new NotFoundException(`Calibration session ${sessionId} not found`);
  }

  await session.update({
    status: CalibrationStatus.COMPLETED,
    completedDate: new Date(),
    notes,
  }, { transaction });

  return session;
}

// ============================================================================
// ANALYTICS AND REPORTING FUNCTIONS
// ============================================================================

/**
 * Get performance distribution for cycle
 *
 * @param cycleId - Cycle ID
 * @returns Performance rating distribution
 *
 * @example
 * ```typescript
 * const distribution = await getPerformanceDistribution('cycle-uuid');
 * ```
 */
export async function getPerformanceDistribution(
  cycleId: string,
): Promise<Record<PerformanceRating, { count: number; percentage: number }>> {
  const reviews = await PerformanceReviewModel.findAll({
    where: {
      cycleId,
      status: ReviewStatus.COMPLETED,
      overallRating: { [Op.ne]: null },
    },
  });

  const total = reviews.length;
  const distribution: Record<string, { count: number; percentage: number }> = {};

  Object.values(PerformanceRating).forEach((rating) => {
    distribution[rating] = { count: 0, percentage: 0 };
  });

  reviews.forEach((review) => {
    if (review.overallRating) {
      distribution[review.overallRating].count += 1;
    }
  });

  Object.keys(distribution).forEach((rating) => {
    distribution[rating].percentage =
      total > 0 ? (distribution[rating].count / total) * 100 : 0;
  });

  return distribution as Record<PerformanceRating, { count: number; percentage: number }>;
}

/**
 * Get review completion statistics
 *
 * @param cycleId - Cycle ID
 * @returns Completion statistics
 *
 * @example
 * ```typescript
 * const stats = await getReviewCompletionStats('cycle-uuid');
 * ```
 */
export async function getReviewCompletionStats(
  cycleId: string,
): Promise<{
  total: number;
  notStarted: number;
  inProgress: number;
  completed: number;
  completionRate: number;
  selfAssessmentCompleted: number;
  managerAssessmentCompleted: number;
  calibrationCompleted: number;
}> {
  const reviews = await PerformanceReviewModel.findAll({
    where: { cycleId },
  });

  const stats = {
    total: reviews.length,
    notStarted: 0,
    inProgress: 0,
    completed: 0,
    completionRate: 0,
    selfAssessmentCompleted: 0,
    managerAssessmentCompleted: 0,
    calibrationCompleted: 0,
  };

  reviews.forEach((review) => {
    if (review.status === ReviewStatus.NOT_STARTED) {
      stats.notStarted += 1;
    } else if (review.status === ReviewStatus.COMPLETED) {
      stats.completed += 1;
    } else {
      stats.inProgress += 1;
    }

    if (review.selfAssessmentCompleted) stats.selfAssessmentCompleted += 1;
    if (review.managerAssessmentCompleted) stats.managerAssessmentCompleted += 1;
    if (review.calibrationCompleted) stats.calibrationCompleted += 1;
  });

  stats.completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return stats;
}

/**
 * Get manager performance summary
 *
 * @param managerId - Manager ID
 * @param cycleId - Cycle ID
 * @returns Performance summary for manager's team
 *
 * @example
 * ```typescript
 * const summary = await getManagerPerformanceSummary('manager-uuid', 'cycle-uuid');
 * ```
 */
export async function getManagerPerformanceSummary(
  managerId: string,
  cycleId: string,
): Promise<{
  totalReviews: number;
  completedReviews: number;
  averageScore: number;
  ratingDistribution: Record<PerformanceRating, number>;
  topPerformers: Array<{ employeeId: string; rating: PerformanceRating; score: number }>;
  needsImprovement: Array<{ employeeId: string; rating: PerformanceRating; score: number }>;
}> {
  const reviews = await PerformanceReviewModel.findAll({
    where: {
      reviewerId: managerId,
      cycleId,
    },
  });

  const summary = {
    totalReviews: reviews.length,
    completedReviews: 0,
    averageScore: 0,
    ratingDistribution: {} as Record<PerformanceRating, number>,
    topPerformers: [] as Array<{ employeeId: string; rating: PerformanceRating; score: number }>,
    needsImprovement: [] as Array<{ employeeId: string; rating: PerformanceRating; score: number }>,
  };

  let totalScore = 0;
  let scoreCount = 0;

  // Initialize rating distribution
  Object.values(PerformanceRating).forEach((rating) => {
    summary.ratingDistribution[rating] = 0;
  });

  reviews.forEach((review) => {
    if (review.status === ReviewStatus.COMPLETED) {
      summary.completedReviews += 1;

      if (review.overallScore) {
        totalScore += review.overallScore;
        scoreCount += 1;
      }

      if (review.overallRating) {
        summary.ratingDistribution[review.overallRating] += 1;

        // Identify top performers and needs improvement
        if (review.overallRating === PerformanceRating.OUTSTANDING ||
            review.overallRating === PerformanceRating.EXCEEDS_EXPECTATIONS) {
          summary.topPerformers.push({
            employeeId: review.employeeId,
            rating: review.overallRating,
            score: review.overallScore || 0,
          });
        } else if (review.overallRating === PerformanceRating.NEEDS_IMPROVEMENT ||
                   review.overallRating === PerformanceRating.UNSATISFACTORY) {
          summary.needsImprovement.push({
            employeeId: review.employeeId,
            rating: review.overallRating,
            score: review.overallScore || 0,
          });
        }
      }
    }
  });

  summary.averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;

  // Sort top performers and needs improvement by score
  summary.topPerformers.sort((a, b) => b.score - a.score);
  summary.needsImprovement.sort((a, b) => a.score - b.score);

  return summary;
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

@Injectable()
export class PerformanceManagementService {
  // Review cycle methods
  async createReviewCycle(data: any, transaction?: Transaction) {
    return createReviewCycle(data, transaction);
  }

  // Performance review methods
  async createPerformanceReview(data: any, transaction?: Transaction) {
    return createPerformanceReview(data, transaction);
  }

  async updatePerformanceReview(id: string, data: any, transaction?: Transaction) {
    return updatePerformanceReview(id, data, transaction);
  }

  async getPerformanceReviewById(id: string, includeRelations: boolean = false) {
    return getPerformanceReviewById(id, includeRelations);
  }

  async getEmployeePerformanceReviews(employeeId: string, filters?: any) {
    return getEmployeePerformanceReviews(employeeId, filters);
  }

  async finalizePerformanceReview(
    id: string,
    finalizedBy: string,
    rating: PerformanceRating,
    score: number,
    transaction?: Transaction,
  ) {
    return finalizePerformanceReview(id, finalizedBy, rating, score, transaction);
  }

  // Review section methods
  async addReviewSection(data: any, transaction?: Transaction) {
    return addReviewSection(data, transaction);
  }

  async updateReviewSection(id: string, data: any, transaction?: Transaction) {
    return updateReviewSection(id, data, transaction);
  }

  async getReviewSections(reviewId: string) {
    return getReviewSections(reviewId);
  }

  async calculateOverallScore(reviewId: string) {
    return calculateOverallScore(reviewId);
  }

  // 360 feedback methods
  async create360FeedbackRequest(data: any, transaction?: Transaction) {
    return create360FeedbackRequest(data, transaction);
  }

  async submit360FeedbackResponse(id: string, responses: any, transaction?: Transaction) {
    return submit360FeedbackResponse(id, responses, transaction);
  }

  async get360FeedbackRequests(employeeId: string, filters?: any) {
    return get360FeedbackRequests(employeeId, filters);
  }

  async get360FeedbackRequestsForRespondent(respondentId: string, filters?: any) {
    return get360FeedbackRequestsForRespondent(respondentId, filters);
  }

  async aggregate360Feedback(reviewId: string) {
    return aggregate360Feedback(reviewId);
  }

  // Continuous feedback methods
  async createContinuousFeedback(data: any, transaction?: Transaction) {
    return createContinuousFeedback(data, transaction);
  }

  async getEmployeeContinuousFeedback(employeeId: string, filters?: any) {
    return getEmployeeContinuousFeedback(employeeId, filters);
  }

  async acknowledgeFeedback(id: string, transaction?: Transaction) {
    return acknowledgeFeedback(id, transaction);
  }

  async getFeedbackStatistics(employeeId: string, startDate: Date, endDate: Date) {
    return getFeedbackStatistics(employeeId, startDate, endDate);
  }

  // PIP methods
  async createPerformanceImprovementPlan(data: any, transaction?: Transaction) {
    return createPerformanceImprovementPlan(data, transaction);
  }

  async updatePIPStatus(id: string, status: PIPStatus, outcome?: string, transaction?: Transaction) {
    return updatePIPStatus(id, status, outcome, transaction);
  }

  async approvePIP(id: string, hrUserId: string, transaction?: Transaction) {
    return approvePIP(id, hrUserId, transaction);
  }

  async getEmployeePIPs(employeeId: string, includeCompleted: boolean = false) {
    return getEmployeePIPs(employeeId, includeCompleted);
  }

  async getActivePIPsForManager(managerId: string) {
    return getActivePIPsForManager(managerId);
  }

  // Competency methods
  async createCompetency(data: any, transaction?: Transaction) {
    return createCompetency(data, transaction);
  }

  async addCompetencyAssessment(data: any, transaction?: Transaction) {
    return addCompetencyAssessment(data, transaction);
  }

  async updateCompetencyAssessment(id: string, data: any, transaction?: Transaction) {
    return updateCompetencyAssessment(id, data, transaction);
  }

  async getCompetencyAssessments(reviewId: string) {
    return getCompetencyAssessments(reviewId);
  }

  async getCompetencyGapAnalysis(reviewId: string) {
    return getCompetencyGapAnalysis(reviewId);
  }

  // Calibration methods
  async createCalibrationSession(data: any, transaction?: Transaction) {
    return createCalibrationSession(data, transaction);
  }

  async updateCalibrationSession(id: string, data: any, transaction?: Transaction) {
    return updateCalibrationSession(id, data, transaction);
  }

  async addRatingAdjustment(
    sessionId: string,
    reviewId: string,
    oldRating: PerformanceRating,
    newRating: PerformanceRating,
    reason: string,
    transaction?: Transaction,
  ) {
    return addRatingAdjustment(sessionId, reviewId, oldRating, newRating, reason, transaction);
  }

  async getCalibrationSessions(cycleId: string) {
    return getCalibrationSessions(cycleId);
  }

  async completeCalibrationSession(id: string, notes?: string, transaction?: Transaction) {
    return completeCalibrationSession(id, notes, transaction);
  }

  // Analytics methods
  async getPerformanceDistribution(cycleId: string) {
    return getPerformanceDistribution(cycleId);
  }

  async getReviewCompletionStats(cycleId: string) {
    return getReviewCompletionStats(cycleId);
  }

  async getManagerPerformanceSummary(managerId: string, cycleId: string) {
    return getManagerPerformanceSummary(managerId, cycleId);
  }
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@ApiTags('Performance Management')
@ApiBearerAuth()
@Controller('performance-management')
export class PerformanceManagementController {
  constructor(private readonly service: PerformanceManagementService) {}

  @Post('review-cycles')
  @ApiOperation({ summary: 'Create performance review cycle' })
  @ApiResponse({ status: 201, description: 'Review cycle created successfully' })
  async createReviewCycle(@Body() data: any) {
    return this.service.createReviewCycle(data);
  }

  @Post('reviews')
  @ApiOperation({ summary: 'Create performance review' })
  @ApiResponse({ status: 201, description: 'Performance review created successfully' })
  async createReview(@Body() data: any) {
    return this.service.createPerformanceReview(data);
  }

  @Get('reviews/:id')
  @ApiOperation({ summary: 'Get performance review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiQuery({ name: 'includeRelations', required: false, type: Boolean })
  async getReview(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeRelations') includeRelations?: boolean,
  ) {
    return this.service.getPerformanceReviewById(id, includeRelations);
  }

  @Put('reviews/:id')
  @ApiOperation({ summary: 'Update performance review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  async updateReview(@Param('id', ParseUUIDPipe) id: string, @Body() data: any) {
    return this.service.updatePerformanceReview(id, data);
  }

  @Post('reviews/:id/finalize')
  @ApiOperation({ summary: 'Finalize performance review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  async finalizeReview(@Param('id', ParseUUIDPipe) id: string, @Body() data: any) {
    return this.service.finalizePerformanceReview(
      id,
      data.finalizedBy,
      data.overallRating,
      data.overallScore,
    );
  }

  @Get('employees/:employeeId/reviews')
  @ApiOperation({ summary: 'Get employee performance reviews' })
  @ApiParam({ name: 'employeeId', description: 'Employee ID' })
  async getEmployeeReviews(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Query() filters: any,
  ) {
    return this.service.getEmployeePerformanceReviews(employeeId, filters);
  }

  @Post('360-feedback/requests')
  @ApiOperation({ summary: 'Create 360 feedback request' })
  @ApiResponse({ status: 201, description: '360 feedback request created successfully' })
  async create360Request(@Body() data: any) {
    return this.service.create360FeedbackRequest(data);
  }

  @Post('360-feedback/requests/:id/submit')
  @ApiOperation({ summary: 'Submit 360 feedback response' })
  @ApiParam({ name: 'id', description: 'Request ID' })
  async submit360Response(@Param('id', ParseUUIDPipe) id: string, @Body() responses: any) {
    return this.service.submit360FeedbackResponse(id, responses);
  }

  @Get('reviews/:reviewId/360-feedback/aggregate')
  @ApiOperation({ summary: 'Get aggregated 360 feedback for review' })
  @ApiParam({ name: 'reviewId', description: 'Review ID' })
  async aggregate360(@Param('reviewId', ParseUUIDPipe) reviewId: string) {
    return this.service.aggregate360Feedback(reviewId);
  }

  @Post('continuous-feedback')
  @ApiOperation({ summary: 'Create continuous feedback' })
  @ApiResponse({ status: 201, description: 'Feedback created successfully' })
  async createFeedback(@Body() data: any) {
    return this.service.createContinuousFeedback(data);
  }

  @Get('employees/:employeeId/continuous-feedback')
  @ApiOperation({ summary: 'Get employee continuous feedback' })
  @ApiParam({ name: 'employeeId', description: 'Employee ID' })
  async getEmployeeFeedback(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Query() filters: any,
  ) {
    return this.service.getEmployeeContinuousFeedback(employeeId, filters);
  }

  @Post('pips')
  @ApiOperation({ summary: 'Create Performance Improvement Plan' })
  @ApiResponse({ status: 201, description: 'PIP created successfully' })
  async createPIP(@Body() data: any) {
    return this.service.createPerformanceImprovementPlan(data);
  }

  @Patch('pips/:id/status')
  @ApiOperation({ summary: 'Update PIP status' })
  @ApiParam({ name: 'id', description: 'PIP ID' })
  async updatePIPStatus(@Param('id', ParseUUIDPipe) id: string, @Body() data: any) {
    return this.service.updatePIPStatus(id, data.status, data.outcome);
  }

  @Post('pips/:id/approve')
  @ApiOperation({ summary: 'Approve PIP (HR approval)' })
  @ApiParam({ name: 'id', description: 'PIP ID' })
  async approvePIP(@Param('id', ParseUUIDPipe) id: string, @Body() data: any) {
    return this.service.approvePIP(id, data.hrUserId);
  }

  @Post('competencies')
  @ApiOperation({ summary: 'Create competency' })
  @ApiResponse({ status: 201, description: 'Competency created successfully' })
  async createCompetency(@Body() data: any) {
    return this.service.createCompetency(data);
  }

  @Post('competency-assessments')
  @ApiOperation({ summary: 'Add competency assessment to review' })
  @ApiResponse({ status: 201, description: 'Assessment created successfully' })
  async addCompetencyAssessment(@Body() data: any) {
    return this.service.addCompetencyAssessment(data);
  }

  @Get('reviews/:reviewId/competency-assessments')
  @ApiOperation({ summary: 'Get competency assessments for review' })
  @ApiParam({ name: 'reviewId', description: 'Review ID' })
  async getCompetencyAssessments(@Param('reviewId', ParseUUIDPipe) reviewId: string) {
    return this.service.getCompetencyAssessments(reviewId);
  }

  @Get('reviews/:reviewId/competency-gap-analysis')
  @ApiOperation({ summary: 'Get competency gap analysis' })
  @ApiParam({ name: 'reviewId', description: 'Review ID' })
  async getGapAnalysis(@Param('reviewId', ParseUUIDPipe) reviewId: string) {
    return this.service.getCompetencyGapAnalysis(reviewId);
  }

  @Post('calibration-sessions')
  @ApiOperation({ summary: 'Create calibration session' })
  @ApiResponse({ status: 201, description: 'Calibration session created successfully' })
  async createCalibrationSession(@Body() data: any) {
    return this.service.createCalibrationSession(data);
  }

  @Post('calibration-sessions/:id/rating-adjustments')
  @ApiOperation({ summary: 'Add rating adjustment in calibration' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  async addRatingAdjustment(@Param('id', ParseUUIDPipe) id: string, @Body() data: any) {
    return this.service.addRatingAdjustment(
      id,
      data.reviewId,
      data.oldRating,
      data.newRating,
      data.reason,
    );
  }

  @Post('calibration-sessions/:id/complete')
  @ApiOperation({ summary: 'Complete calibration session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  async completeCalibrationSession(@Param('id', ParseUUIDPipe) id: string, @Body() data: any) {
    return this.service.completeCalibrationSession(id, data.notes);
  }

  @Get('cycles/:cycleId/performance-distribution')
  @ApiOperation({ summary: 'Get performance rating distribution for cycle' })
  @ApiParam({ name: 'cycleId', description: 'Cycle ID' })
  async getPerformanceDistribution(@Param('cycleId', ParseUUIDPipe) cycleId: string) {
    return this.service.getPerformanceDistribution(cycleId);
  }

  @Get('cycles/:cycleId/completion-stats')
  @ApiOperation({ summary: 'Get review completion statistics' })
  @ApiParam({ name: 'cycleId', description: 'Cycle ID' })
  async getCompletionStats(@Param('cycleId', ParseUUIDPipe) cycleId: string) {
    return this.service.getReviewCompletionStats(cycleId);
  }

  @Get('managers/:managerId/performance-summary')
  @ApiOperation({ summary: "Get manager's team performance summary" })
  @ApiParam({ name: 'managerId', description: 'Manager ID' })
  @ApiQuery({ name: 'cycleId', description: 'Cycle ID' })
  async getManagerSummary(
    @Param('managerId', ParseUUIDPipe) managerId: string,
    @Query('cycleId', ParseUUIDPipe) cycleId: string,
  ) {
    return this.service.getManagerPerformanceSummary(managerId, cycleId);
  }
}
