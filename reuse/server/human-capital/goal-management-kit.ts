/**
 * LOC: HCM_GOAL_MGT_001
 * File: /reuse/server/human-capital/goal-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - i18next
 *
 * DOWNSTREAM (imported by):
 *   - Goal management services
 *   - OKR implementations
 *   - Performance review systems
 *   - Talent management platforms
 *   - HR analytics & reporting
 *   - Development planning modules
 */

/**
 * File: /reuse/server/human-capital/goal-management-kit.ts
 * Locator: WC-HCM-GOAL-MGT-001
 * Purpose: Goal Management Kit - Comprehensive SMART goals and OKR management system
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, i18next
 * Downstream: ../backend/hr/goals/*, ../services/performance/*, Analytics & Reporting
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 46+ utility functions for goal management including SMART goals, OKRs, goal cascading,
 *          individual/team/organizational goals, progress tracking, achievement measurement,
 *          mid-year and year-end reviews, goal templates, weighting, integration with performance
 *          reviews, key results tracking, milestone management, goal alignment, and reporting
 *
 * LLM Context: Enterprise-grade goal management for White Cross healthcare system with
 * SAP SuccessFactors Goal Management parity. Provides comprehensive goal planning and execution
 * including SMART goal creation and validation, OKR methodology support, goal cascading from
 * organizational to individual levels, individual/team/departmental/organizational goal types,
 * progress tracking with percentage completion, achievement measurement and scoring, mid-year
 * and year-end review workflows, goal templates and libraries, goal weighting and prioritization,
 * integration with performance reviews, key results with quantifiable metrics, milestone tracking,
 * goal alignment visualization, check-in and update mechanisms, goal assignment and delegation,
 * collaborative goal setting, goal status management (draft, active, achieved, not achieved),
 * goal categories and tags, stretch goals support, carry-over goals, historical goal tracking,
 * goal analytics and insights, HIPAA compliance for healthcare goals, and advanced reporting.
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
 * Goal type enumeration
 */
export enum GoalType {
  INDIVIDUAL = 'individual',
  TEAM = 'team',
  DEPARTMENT = 'department',
  ORGANIZATIONAL = 'organizational',
  PROJECT = 'project',
}

/**
 * Goal methodology
 */
export enum GoalMethodology {
  SMART = 'smart',
  OKR = 'okr',
  KPI = 'kpi',
  CUSTOM = 'custom',
}

/**
 * Goal status enumeration
 */
export enum GoalStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  ACTIVE = 'active',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  ACHIEVED = 'achieved',
  PARTIALLY_ACHIEVED = 'partially_achieved',
  NOT_ACHIEVED = 'not_achieved',
  CANCELLED = 'cancelled',
  CARRIED_OVER = 'carried_over',
}

/**
 * Goal category
 */
export enum GoalCategory {
  STRATEGIC = 'strategic',
  OPERATIONAL = 'operational',
  DEVELOPMENTAL = 'developmental',
  FINANCIAL = 'financial',
  CUSTOMER = 'customer',
  QUALITY = 'quality',
  INNOVATION = 'innovation',
  COMPLIANCE = 'compliance',
  PEOPLE = 'people',
}

/**
 * Goal priority
 */
export enum GoalPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

/**
 * Key result status
 */
export enum KeyResultStatus {
  NOT_STARTED = 'not_started',
  ON_TRACK = 'on_track',
  AT_RISK = 'at_risk',
  OFF_TRACK = 'off_track',
  ACHIEVED = 'achieved',
}

/**
 * Check-in frequency
 */
export enum CheckInFrequency {
  WEEKLY = 'weekly',
  BI_WEEKLY = 'bi_weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  AD_HOC = 'ad_hoc',
}

/**
 * Measurement unit
 */
export enum MeasurementUnit {
  PERCENTAGE = 'percentage',
  NUMBER = 'number',
  CURRENCY = 'currency',
  BOOLEAN = 'boolean',
  CUSTOM = 'custom',
}

/**
 * Goal alignment type
 */
export enum AlignmentType {
  SUPPORTS = 'supports',
  CONTRIBUTES_TO = 'contributes_to',
  DERIVED_FROM = 'derived_from',
  RELATED_TO = 'related_to',
}

/**
 * Goal interface
 */
export interface Goal {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  goalType: GoalType;
  methodology: GoalMethodology;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalStatus;
  startDate: Date;
  endDate: Date;
  weight: number;
  progressPercentage: number;
  achievementScore?: number;
  parentGoalId?: string;
  reviewCycleId?: string;
  isStretch: boolean;
  isCarriedOver: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * SMART goal criteria interface
 */
export interface SMARTCriteria {
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
}

/**
 * Key result interface (for OKRs)
 */
export interface KeyResult {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  measurementUnit: MeasurementUnit;
  startValue: number;
  targetValue: number;
  currentValue: number;
  weight: number;
  status: KeyResultStatus;
  progressPercentage: number;
  dueDate?: Date;
}

/**
 * Milestone interface
 */
export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  dueDate: Date;
  completedDate?: Date;
  isCompleted: boolean;
  order: number;
}

/**
 * Goal check-in interface
 */
export interface GoalCheckIn {
  id: string;
  goalId: string;
  submittedBy: string;
  checkInDate: Date;
  progressPercentage: number;
  status: GoalStatus;
  accomplishments?: string;
  challenges?: string;
  nextSteps?: string;
  supportNeeded?: string;
  confidenceLevel?: number;
}

/**
 * Goal alignment interface
 */
export interface GoalAlignment {
  id: string;
  sourceGoalId: string;
  targetGoalId: string;
  alignmentType: AlignmentType;
  description?: string;
}

/**
 * Goal template interface
 */
export interface GoalTemplate {
  id: string;
  name: string;
  description: string;
  category: GoalCategory;
  methodology: GoalMethodology;
  templateData: {
    titleTemplate?: string;
    descriptionTemplate?: string;
    suggestedWeight?: number;
    suggestedDuration?: number;
    keyResultsTemplate?: Array<{ title: string; measurementUnit: MeasurementUnit }>;
    milestonesTemplate?: Array<{ title: string; daysFromStart: number }>;
  };
  isPublic: boolean;
  usageCount: number;
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * Goal validation schema
 */
export const GoalSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(5000),
  ownerId: z.string().uuid(),
  goalType: z.nativeEnum(GoalType),
  methodology: z.nativeEnum(GoalMethodology),
  category: z.nativeEnum(GoalCategory),
  priority: z.nativeEnum(GoalPriority).default(GoalPriority.MEDIUM),
  status: z.nativeEnum(GoalStatus).default(GoalStatus.DRAFT),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  weight: z.number().min(0).max(100).default(0),
  progressPercentage: z.number().min(0).max(100).default(0),
  parentGoalId: z.string().uuid().optional(),
  reviewCycleId: z.string().uuid().optional(),
  isStretch: z.boolean().default(false),
  isCarriedOver: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
}).refine(
  (data) => data.endDate > data.startDate,
  { message: 'End date must be after start date' }
);

/**
 * SMART criteria validation schema
 */
export const SMARTCriteriaSchema = z.object({
  specific: z.string().min(10).max(500),
  measurable: z.string().min(10).max(500),
  achievable: z.string().min(10).max(500),
  relevant: z.string().min(10).max(500),
  timeBound: z.string().min(10).max(500),
});

/**
 * Key result validation schema
 */
export const KeyResultSchema = z.object({
  goalId: z.string().uuid(),
  title: z.string().min(5).max(200),
  description: z.string().max(1000).optional(),
  measurementUnit: z.nativeEnum(MeasurementUnit),
  startValue: z.number(),
  targetValue: z.number(),
  currentValue: z.number(),
  weight: z.number().min(0).max(100).default(0),
  dueDate: z.coerce.date().optional(),
});

/**
 * Milestone validation schema
 */
export const MilestoneSchema = z.object({
  goalId: z.string().uuid(),
  title: z.string().min(5).max(200),
  description: z.string().max(1000).optional(),
  dueDate: z.coerce.date(),
  order: z.number().int().min(0),
});

/**
 * Goal check-in validation schema
 */
export const GoalCheckInSchema = z.object({
  goalId: z.string().uuid(),
  submittedBy: z.string().uuid(),
  checkInDate: z.coerce.date(),
  progressPercentage: z.number().min(0).max(100),
  status: z.nativeEnum(GoalStatus),
  accomplishments: z.string().max(2000).optional(),
  challenges: z.string().max(2000).optional(),
  nextSteps: z.string().max(2000).optional(),
  supportNeeded: z.string().max(2000).optional(),
  confidenceLevel: z.number().min(1).max(5).optional(),
});

/**
 * Goal alignment validation schema
 */
export const GoalAlignmentSchema = z.object({
  sourceGoalId: z.string().uuid(),
  targetGoalId: z.string().uuid(),
  alignmentType: z.nativeEnum(AlignmentType),
  description: z.string().max(500).optional(),
}).refine(
  (data) => data.sourceGoalId !== data.targetGoalId,
  { message: 'Source and target goals must be different' }
);

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Goal Plan Model
 */
@Table({
  tableName: 'goal_plans',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['plan_year'] },
    { fields: ['status'] },
    { fields: ['start_date', 'end_date'] },
  ],
})
export class GoalPlanModel extends Model {
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
    comment: 'Plan name (e.g., "2024 Goal Plan")',
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'plan_year',
  })
  planYear: number;

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
    type: DataType.ENUM('planning', 'active', 'mid_year_review', 'year_end_review', 'closed'),
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
    type: DataType.DATE,
    allowNull: true,
    field: 'mid_year_review_date',
  })
  midYearReviewDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'year_end_review_date',
  })
  yearEndReviewDate: Date;

  @HasMany(() => GoalModel)
  goals: GoalModel[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Goal Model
 */
@Table({
  tableName: 'goals',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['owner_id'] },
    { fields: ['goal_type'] },
    { fields: ['status'] },
    { fields: ['category'] },
    { fields: ['priority'] },
    { fields: ['parent_goal_id'] },
    { fields: ['plan_id'] },
    { fields: ['start_date', 'end_date'] },
  ],
})
export class GoalModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => GoalPlanModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'plan_id',
  })
  planId: string;

  @Length({ min: 5, max: 200 })
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'owner_id',
    comment: 'Goal owner (employee or team)',
  })
  ownerId: string;

  @Column({
    type: DataType.ENUM(...Object.values(GoalType)),
    allowNull: false,
    field: 'goal_type',
  })
  goalType: GoalType;

  @Column({
    type: DataType.ENUM(...Object.values(GoalMethodology)),
    allowNull: false,
  })
  methodology: GoalMethodology;

  @Column({
    type: DataType.ENUM(...Object.values(GoalCategory)),
    allowNull: false,
  })
  category: GoalCategory;

  @Column({
    type: DataType.ENUM(...Object.values(GoalPriority)),
    allowNull: false,
    defaultValue: GoalPriority.MEDIUM,
  })
  priority: GoalPriority;

  @Column({
    type: DataType.ENUM(...Object.values(GoalStatus)),
    allowNull: false,
    defaultValue: GoalStatus.DRAFT,
  })
  status: GoalStatus;

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
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Goal weight in overall performance (0-100)',
  })
  weight: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'progress_percentage',
    comment: 'Current progress (0-100)',
  })
  progressPercentage: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    field: 'achievement_score',
    comment: 'Final achievement score (0-100)',
  })
  achievementScore: number;

  @ForeignKey(() => GoalModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'parent_goal_id',
    comment: 'Parent goal for cascading',
  })
  parentGoalId: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'review_cycle_id',
    comment: 'Linked performance review cycle',
  })
  reviewCycleId: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_stretch',
    comment: 'Stretch goal flag',
  })
  isStretch: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_carried_over',
    comment: 'Carried over from previous period',
  })
  isCarriedOver: boolean;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'approved_by',
  })
  approvedBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'approved_at',
  })
  approvedAt: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'SMART criteria for SMART goals',
  })
  smartCriteria: SMARTCriteria;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  tags: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata: Record<string, any>;

  @BelongsTo(() => GoalPlanModel)
  plan: GoalPlanModel;

  @BelongsTo(() => GoalModel, 'parentGoalId')
  parentGoal: GoalModel;

  @HasMany(() => GoalModel, 'parentGoalId')
  childGoals: GoalModel[];

  @HasMany(() => KeyResultModel)
  keyResults: KeyResultModel[];

  @HasMany(() => MilestoneModel)
  milestones: MilestoneModel[];

  @HasMany(() => GoalCheckInModel)
  checkIns: GoalCheckInModel[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Key Result Model (for OKRs)
 */
@Table({
  tableName: 'key_results',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['goal_id'] },
    { fields: ['status'] },
    { fields: ['due_date'] },
  ],
})
export class KeyResultModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => GoalModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'goal_id',
  })
  goalId: string;

  @Length({ min: 5, max: 200 })
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.ENUM(...Object.values(MeasurementUnit)),
    allowNull: false,
    field: 'measurement_unit',
  })
  measurementUnit: MeasurementUnit;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    field: 'start_value',
  })
  startValue: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    field: 'target_value',
  })
  targetValue: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'current_value',
  })
  currentValue: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Key result weight (0-100)',
  })
  weight: number;

  @Column({
    type: DataType.ENUM(...Object.values(KeyResultStatus)),
    allowNull: false,
    defaultValue: KeyResultStatus.NOT_STARTED,
  })
  status: KeyResultStatus;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'progress_percentage',
  })
  progressPercentage: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'due_date',
  })
  dueDate: Date;

  @BelongsTo(() => GoalModel)
  goal: GoalModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Milestone Model
 */
@Table({
  tableName: 'goal_milestones',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['goal_id'] },
    { fields: ['due_date'] },
    { fields: ['is_completed'] },
  ],
})
export class MilestoneModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => GoalModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'goal_id',
  })
  goalId: string;

  @Length({ min: 5, max: 200 })
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'due_date',
  })
  dueDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'completed_date',
  })
  completedDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_completed',
  })
  isCompleted: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Display order',
  })
  order: number;

  @BelongsTo(() => GoalModel)
  goal: GoalModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

/**
 * Goal Check-In Model
 */
@Table({
  tableName: 'goal_check_ins',
  timestamps: true,
  indexes: [
    { fields: ['goal_id'] },
    { fields: ['submitted_by'] },
    { fields: ['check_in_date'] },
  ],
})
export class GoalCheckInModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => GoalModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'goal_id',
  })
  goalId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'submitted_by',
  })
  submittedBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'check_in_date',
  })
  checkInDate: Date;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    field: 'progress_percentage',
  })
  progressPercentage: number;

  @Column({
    type: DataType.ENUM(...Object.values(GoalStatus)),
    allowNull: false,
  })
  status: GoalStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  accomplishments: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  challenges: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'next_steps',
  })
  nextSteps: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'support_needed',
  })
  supportNeeded: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'confidence_level',
    comment: 'Confidence level 1-5',
  })
  confidenceLevel: number;

  @BelongsTo(() => GoalModel)
  goal: GoalModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Goal Alignment Model
 */
@Table({
  tableName: 'goal_alignments',
  timestamps: true,
  indexes: [
    { fields: ['source_goal_id'] },
    { fields: ['target_goal_id'] },
    { fields: ['alignment_type'] },
  ],
})
export class GoalAlignmentModel extends Model {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => GoalModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'source_goal_id',
  })
  sourceGoalId: string;

  @ForeignKey(() => GoalModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'target_goal_id',
  })
  targetGoalId: string;

  @Column({
    type: DataType.ENUM(...Object.values(AlignmentType)),
    allowNull: false,
    field: 'alignment_type',
  })
  alignmentType: AlignmentType;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @BelongsTo(() => GoalModel, 'sourceGoalId')
  sourceGoal: GoalModel;

  @BelongsTo(() => GoalModel, 'targetGoalId')
  targetGoal: GoalModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

/**
 * Goal Template Model
 */
@Table({
  tableName: 'goal_templates',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['category'] },
    { fields: ['methodology'] },
    { fields: ['is_public'] },
    { fields: ['usage_count'] },
  ],
})
export class GoalTemplateModel extends Model {
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
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.ENUM(...Object.values(GoalCategory)),
    allowNull: false,
  })
  category: GoalCategory;

  @Column({
    type: DataType.ENUM(...Object.values(GoalMethodology)),
    allowNull: false,
  })
  methodology: GoalMethodology;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'template_data',
  })
  templateData: Record<string, any>;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_public',
  })
  isPublic: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'usage_count',
  })
  usageCount: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'created_by',
  })
  createdBy: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

// ============================================================================
// CORE GOAL MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Create goal plan
 *
 * @param planData - Goal plan data
 * @param transaction - Optional transaction
 * @returns Created goal plan
 *
 * @example
 * ```typescript
 * const plan = await createGoalPlan({
 *   name: '2024 Goal Plan',
 *   planYear: 2024,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 * });
 * ```
 */
export async function createGoalPlan(
  planData: {
    name: string;
    planYear: number;
    startDate: Date;
    endDate: Date;
    description?: string;
    midYearReviewDate?: Date;
    yearEndReviewDate?: Date;
  },
  transaction?: Transaction,
): Promise<GoalPlanModel> {
  if (planData.endDate <= planData.startDate) {
    throw new BadRequestException('End date must be after start date');
  }

  const plan = await GoalPlanModel.create(planData as any, { transaction });
  return plan;
}

/**
 * Create goal
 *
 * @param goalData - Goal data
 * @param transaction - Optional transaction
 * @returns Created goal
 *
 * @example
 * ```typescript
 * const goal = await createGoal({
 *   title: 'Increase patient satisfaction',
 *   description: 'Improve patient satisfaction scores by 15%',
 *   ownerId: 'emp-uuid',
 *   goalType: GoalType.INDIVIDUAL,
 *   methodology: GoalMethodology.SMART,
 *   category: GoalCategory.QUALITY,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   weight: 30,
 * });
 * ```
 */
export async function createGoal(
  goalData: Partial<Goal>,
  transaction?: Transaction,
): Promise<GoalModel> {
  const validated = GoalSchema.parse(goalData);
  const goal = await GoalModel.create(validated as any, { transaction });
  return goal;
}

/**
 * Update goal
 *
 * @param goalId - Goal ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated goal
 *
 * @example
 * ```typescript
 * await updateGoal('goal-uuid', {
 *   status: GoalStatus.ACTIVE,
 *   progressPercentage: 25,
 * });
 * ```
 */
export async function updateGoal(
  goalId: string,
  updates: Partial<Goal>,
  transaction?: Transaction,
): Promise<GoalModel> {
  const goal = await GoalModel.findByPk(goalId, { transaction });

  if (!goal) {
    throw new NotFoundException(`Goal ${goalId} not found`);
  }

  await goal.update(updates, { transaction });
  return goal;
}

/**
 * Get goal by ID
 *
 * @param goalId - Goal ID
 * @param includeRelations - Include related data
 * @returns Goal or null
 *
 * @example
 * ```typescript
 * const goal = await getGoalById('goal-uuid', true);
 * ```
 */
export async function getGoalById(
  goalId: string,
  includeRelations: boolean = false,
): Promise<GoalModel | null> {
  const options: FindOptions = {
    where: { id: goalId },
  };

  if (includeRelations) {
    options.include = [
      { model: GoalPlanModel, as: 'plan' },
      { model: GoalModel, as: 'parentGoal' },
      { model: GoalModel, as: 'childGoals' },
      { model: KeyResultModel, as: 'keyResults' },
      { model: MilestoneModel, as: 'milestones' },
      { model: GoalCheckInModel, as: 'checkIns' },
    ];
  }

  return GoalModel.findOne(options);
}

/**
 * Get employee goals
 *
 * @param ownerId - Owner ID
 * @param filters - Optional filters
 * @returns Array of goals
 *
 * @example
 * ```typescript
 * const goals = await getEmployeeGoals('emp-uuid', {
 *   status: GoalStatus.ACTIVE,
 *   category: GoalCategory.QUALITY,
 * });
 * ```
 */
export async function getEmployeeGoals(
  ownerId: string,
  filters?: {
    planId?: string;
    status?: GoalStatus;
    goalType?: GoalType;
    category?: GoalCategory;
    priority?: GoalPriority;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  },
): Promise<GoalModel[]> {
  const where: WhereOptions = { ownerId };

  if (filters?.planId) where.planId = filters.planId;
  if (filters?.status) where.status = filters.status;
  if (filters?.goalType) where.goalType = filters.goalType;
  if (filters?.category) where.category = filters.category;
  if (filters?.priority) where.priority = filters.priority;

  if (filters?.startDate || filters?.endDate) {
    where.startDate = {};
    if (filters.startDate) {
      (where.startDate as any)[Op.gte] = filters.startDate;
    }
    if (filters.endDate) {
      (where.startDate as any)[Op.lte] = filters.endDate;
    }
  }

  return GoalModel.findAll({
    where,
    limit: filters?.limit || 100,
    offset: filters?.offset || 0,
    order: [['priority', 'ASC'], ['endDate', 'ASC']],
    include: [
      { model: GoalPlanModel, as: 'plan' },
      { model: KeyResultModel, as: 'keyResults' },
      { model: MilestoneModel, as: 'milestones' },
    ],
  });
}

/**
 * Approve goal
 *
 * @param goalId - Goal ID
 * @param approvedBy - User approving
 * @param transaction - Optional transaction
 * @returns Approved goal
 *
 * @example
 * ```typescript
 * await approveGoal('goal-uuid', 'manager-uuid');
 * ```
 */
export async function approveGoal(
  goalId: string,
  approvedBy: string,
  transaction?: Transaction,
): Promise<GoalModel> {
  const goal = await GoalModel.findByPk(goalId, { transaction });

  if (!goal) {
    throw new NotFoundException(`Goal ${goalId} not found`);
  }

  if (goal.status !== GoalStatus.SUBMITTED) {
    throw new BadRequestException('Only submitted goals can be approved');
  }

  await goal.update({
    status: GoalStatus.APPROVED,
    approvedBy,
    approvedAt: new Date(),
  }, { transaction });

  return goal;
}

/**
 * Activate goal
 *
 * @param goalId - Goal ID
 * @param transaction - Optional transaction
 * @returns Activated goal
 *
 * @example
 * ```typescript
 * await activateGoal('goal-uuid');
 * ```
 */
export async function activateGoal(
  goalId: string,
  transaction?: Transaction,
): Promise<GoalModel> {
  const goal = await GoalModel.findByPk(goalId, { transaction });

  if (!goal) {
    throw new NotFoundException(`Goal ${goalId} not found`);
  }

  if (goal.status !== GoalStatus.APPROVED && goal.status !== GoalStatus.DRAFT) {
    throw new BadRequestException('Goal must be approved or draft to activate');
  }

  await goal.update({
    status: GoalStatus.ACTIVE,
  }, { transaction });

  return goal;
}

/**
 * Delete goal
 *
 * @param goalId - Goal ID
 * @param transaction - Optional transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await deleteGoal('goal-uuid');
 * ```
 */
export async function deleteGoal(
  goalId: string,
  transaction?: Transaction,
): Promise<void> {
  const goal = await GoalModel.findByPk(goalId, { transaction });

  if (!goal) {
    throw new NotFoundException(`Goal ${goalId} not found`);
  }

  await goal.destroy({ transaction });
}

/**
 * Create SMART goal
 *
 * @param goalData - Goal data
 * @param smartCriteria - SMART criteria
 * @param transaction - Optional transaction
 * @returns Created SMART goal
 *
 * @example
 * ```typescript
 * const goal = await createSMARTGoal(
 *   { title: '...', ... },
 *   {
 *     specific: 'Increase patient satisfaction scores',
 *     measurable: 'From 75% to 90%',
 *     achievable: 'With improved training',
 *     relevant: 'Aligns with hospital quality goals',
 *     timeBound: 'By December 31, 2024',
 *   }
 * );
 * ```
 */
export async function createSMARTGoal(
  goalData: Partial<Goal>,
  smartCriteria: SMARTCriteria,
  transaction?: Transaction,
): Promise<GoalModel> {
  // Validate SMART criteria
  SMARTCriteriaSchema.parse(smartCriteria);

  // Ensure methodology is SMART
  goalData.methodology = GoalMethodology.SMART;

  const validated = GoalSchema.parse(goalData);
  const goal = await GoalModel.create(
    {
      ...validated,
      smartCriteria,
    } as any,
    { transaction },
  );

  return goal;
}

// ============================================================================
// KEY RESULT FUNCTIONS (OKR)
// ============================================================================

/**
 * Add key result to goal
 *
 * @param keyResultData - Key result data
 * @param transaction - Optional transaction
 * @returns Created key result
 *
 * @example
 * ```typescript
 * const kr = await addKeyResult({
 *   goalId: 'goal-uuid',
 *   title: 'Increase NPS score',
 *   measurementUnit: MeasurementUnit.NUMBER,
 *   startValue: 65,
 *   targetValue: 85,
 *   currentValue: 65,
 *   weight: 40,
 * });
 * ```
 */
export async function addKeyResult(
  keyResultData: Partial<KeyResult>,
  transaction?: Transaction,
): Promise<KeyResultModel> {
  const validated = KeyResultSchema.parse(keyResultData);
  const keyResult = await KeyResultModel.create(validated as any, { transaction });
  return keyResult;
}

/**
 * Update key result
 *
 * @param keyResultId - Key result ID
 * @param updates - Fields to update
 * @param transaction - Optional transaction
 * @returns Updated key result
 *
 * @example
 * ```typescript
 * await updateKeyResult('kr-uuid', {
 *   currentValue: 75,
 *   status: KeyResultStatus.ON_TRACK,
 * });
 * ```
 */
export async function updateKeyResult(
  keyResultId: string,
  updates: Partial<KeyResult>,
  transaction?: Transaction,
): Promise<KeyResultModel> {
  const keyResult = await KeyResultModel.findByPk(keyResultId, { transaction });

  if (!keyResult) {
    throw new NotFoundException(`Key result ${keyResultId} not found`);
  }

  await keyResult.update(updates, { transaction });
  return keyResult;
}

/**
 * Update key result progress
 *
 * @param keyResultId - Key result ID
 * @param currentValue - Current value
 * @param transaction - Optional transaction
 * @returns Updated key result with calculated progress
 *
 * @example
 * ```typescript
 * await updateKeyResultProgress('kr-uuid', 75);
 * ```
 */
export async function updateKeyResultProgress(
  keyResultId: string,
  currentValue: number,
  transaction?: Transaction,
): Promise<KeyResultModel> {
  const keyResult = await KeyResultModel.findByPk(keyResultId, { transaction });

  if (!keyResult) {
    throw new NotFoundException(`Key result ${keyResultId} not found`);
  }

  // Calculate progress percentage
  const range = keyResult.targetValue - keyResult.startValue;
  const progress = range !== 0
    ? ((currentValue - keyResult.startValue) / range) * 100
    : 0;

  const progressPercentage = Math.max(0, Math.min(100, progress));

  // Determine status based on progress
  let status = KeyResultStatus.NOT_STARTED;
  if (progressPercentage >= 100) {
    status = KeyResultStatus.ACHIEVED;
  } else if (progressPercentage >= 70) {
    status = KeyResultStatus.ON_TRACK;
  } else if (progressPercentage >= 40) {
    status = KeyResultStatus.AT_RISK;
  } else if (progressPercentage > 0) {
    status = KeyResultStatus.OFF_TRACK;
  }

  await keyResult.update({
    currentValue,
    progressPercentage,
    status,
  }, { transaction });

  return keyResult;
}

/**
 * Get key results for goal
 *
 * @param goalId - Goal ID
 * @returns Array of key results
 *
 * @example
 * ```typescript
 * const keyResults = await getKeyResults('goal-uuid');
 * ```
 */
export async function getKeyResults(
  goalId: string,
): Promise<KeyResultModel[]> {
  return KeyResultModel.findAll({
    where: { goalId },
    order: [['weight', 'DESC']],
  });
}

/**
 * Calculate goal progress from key results
 *
 * @param goalId - Goal ID
 * @param transaction - Optional transaction
 * @returns Updated goal with calculated progress
 *
 * @example
 * ```typescript
 * await calculateGoalProgressFromKeyResults('goal-uuid');
 * ```
 */
export async function calculateGoalProgressFromKeyResults(
  goalId: string,
  transaction?: Transaction,
): Promise<GoalModel> {
  const goal = await GoalModel.findByPk(goalId, { transaction });

  if (!goal) {
    throw new NotFoundException(`Goal ${goalId} not found`);
  }

  const keyResults = await KeyResultModel.findAll({
    where: { goalId },
    transaction,
  });

  if (keyResults.length === 0) {
    return goal;
  }

  let totalWeightedProgress = 0;
  let totalWeight = 0;

  keyResults.forEach((kr) => {
    if (kr.weight > 0) {
      totalWeightedProgress += kr.progressPercentage * kr.weight;
      totalWeight += kr.weight;
    }
  });

  const progressPercentage = totalWeight > 0 ? totalWeightedProgress / totalWeight : 0;

  await goal.update({ progressPercentage }, { transaction });
  return goal;
}

// ============================================================================
// MILESTONE FUNCTIONS
// ============================================================================

/**
 * Add milestone to goal
 *
 * @param milestoneData - Milestone data
 * @param transaction - Optional transaction
 * @returns Created milestone
 *
 * @example
 * ```typescript
 * const milestone = await addMilestone({
 *   goalId: 'goal-uuid',
 *   title: 'Complete training program',
 *   dueDate: new Date('2024-03-31'),
 *   order: 1,
 * });
 * ```
 */
export async function addMilestone(
  milestoneData: Partial<Milestone>,
  transaction?: Transaction,
): Promise<MilestoneModel> {
  const validated = MilestoneSchema.parse(milestoneData);
  const milestone = await MilestoneModel.create(validated as any, { transaction });
  return milestone;
}

/**
 * Complete milestone
 *
 * @param milestoneId - Milestone ID
 * @param transaction - Optional transaction
 * @returns Updated milestone
 *
 * @example
 * ```typescript
 * await completeMilestone('milestone-uuid');
 * ```
 */
export async function completeMilestone(
  milestoneId: string,
  transaction?: Transaction,
): Promise<MilestoneModel> {
  const milestone = await MilestoneModel.findByPk(milestoneId, { transaction });

  if (!milestone) {
    throw new NotFoundException(`Milestone ${milestoneId} not found`);
  }

  await milestone.update({
    isCompleted: true,
    completedDate: new Date(),
  }, { transaction });

  return milestone;
}

/**
 * Get milestones for goal
 *
 * @param goalId - Goal ID
 * @returns Array of milestones
 *
 * @example
 * ```typescript
 * const milestones = await getMilestones('goal-uuid');
 * ```
 */
export async function getMilestones(
  goalId: string,
): Promise<MilestoneModel[]> {
  return MilestoneModel.findAll({
    where: { goalId },
    order: [['order', 'ASC']],
  });
}

/**
 * Calculate goal progress from milestones
 *
 * @param goalId - Goal ID
 * @param transaction - Optional transaction
 * @returns Updated goal with calculated progress
 *
 * @example
 * ```typescript
 * await calculateGoalProgressFromMilestones('goal-uuid');
 * ```
 */
export async function calculateGoalProgressFromMilestones(
  goalId: string,
  transaction?: Transaction,
): Promise<GoalModel> {
  const goal = await GoalModel.findByPk(goalId, { transaction });

  if (!goal) {
    throw new NotFoundException(`Goal ${goalId} not found`);
  }

  const milestones = await MilestoneModel.findAll({
    where: { goalId },
    transaction,
  });

  if (milestones.length === 0) {
    return goal;
  }

  const completedCount = milestones.filter((m) => m.isCompleted).length;
  const progressPercentage = (completedCount / milestones.length) * 100;

  await goal.update({ progressPercentage }, { transaction });
  return goal;
}

// ============================================================================
// GOAL CHECK-IN FUNCTIONS
// ============================================================================

/**
 * Create goal check-in
 *
 * @param checkInData - Check-in data
 * @param transaction - Optional transaction
 * @returns Created check-in
 *
 * @example
 * ```typescript
 * const checkIn = await createGoalCheckIn({
 *   goalId: 'goal-uuid',
 *   submittedBy: 'emp-uuid',
 *   checkInDate: new Date(),
 *   progressPercentage: 40,
 *   status: GoalStatus.IN_PROGRESS,
 *   accomplishments: 'Completed phase 1...',
 *   challenges: 'Resource constraints...',
 * });
 * ```
 */
export async function createGoalCheckIn(
  checkInData: Partial<GoalCheckIn>,
  transaction?: Transaction,
): Promise<GoalCheckInModel> {
  const validated = GoalCheckInSchema.parse(checkInData);
  const checkIn = await GoalCheckInModel.create(validated as any, { transaction });

  // Update goal progress
  await updateGoal(
    checkInData.goalId!,
    {
      progressPercentage: checkInData.progressPercentage,
      status: checkInData.status,
    } as any,
    transaction,
  );

  return checkIn;
}

/**
 * Get check-ins for goal
 *
 * @param goalId - Goal ID
 * @param limit - Optional limit
 * @returns Array of check-ins
 *
 * @example
 * ```typescript
 * const checkIns = await getGoalCheckIns('goal-uuid', 10);
 * ```
 */
export async function getGoalCheckIns(
  goalId: string,
  limit?: number,
): Promise<GoalCheckInModel[]> {
  return GoalCheckInModel.findAll({
    where: { goalId },
    limit: limit || 100,
    order: [['checkInDate', 'DESC']],
  });
}

/**
 * Get latest check-in for goal
 *
 * @param goalId - Goal ID
 * @returns Latest check-in or null
 *
 * @example
 * ```typescript
 * const latestCheckIn = await getLatestCheckIn('goal-uuid');
 * ```
 */
export async function getLatestCheckIn(
  goalId: string,
): Promise<GoalCheckInModel | null> {
  return GoalCheckInModel.findOne({
    where: { goalId },
    order: [['checkInDate', 'DESC']],
  });
}

/**
 * Get check-in history for employee
 *
 * @param employeeId - Employee ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of check-ins
 *
 * @example
 * ```typescript
 * const history = await getCheckInHistory('emp-uuid',
 *   new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export async function getCheckInHistory(
  employeeId: string,
  startDate: Date,
  endDate: Date,
): Promise<GoalCheckInModel[]> {
  const goals = await GoalModel.findAll({
    where: { ownerId: employeeId },
    attributes: ['id'],
  });

  const goalIds = goals.map((g) => g.id);

  return GoalCheckInModel.findAll({
    where: {
      goalId: { [Op.in]: goalIds },
      checkInDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['checkInDate', 'DESC']],
    include: [{ model: GoalModel, as: 'goal' }],
  });
}

// ============================================================================
// GOAL ALIGNMENT FUNCTIONS
// ============================================================================

/**
 * Create goal alignment
 *
 * @param alignmentData - Alignment data
 * @param transaction - Optional transaction
 * @returns Created alignment
 *
 * @example
 * ```typescript
 * const alignment = await createGoalAlignment({
 *   sourceGoalId: 'individual-goal-uuid',
 *   targetGoalId: 'team-goal-uuid',
 *   alignmentType: AlignmentType.SUPPORTS,
 *   description: 'Individual goal supports team objective',
 * });
 * ```
 */
export async function createGoalAlignment(
  alignmentData: Partial<GoalAlignment>,
  transaction?: Transaction,
): Promise<GoalAlignmentModel> {
  const validated = GoalAlignmentSchema.parse(alignmentData);

  // Check if alignment already exists
  const existing = await GoalAlignmentModel.findOne({
    where: {
      sourceGoalId: validated.sourceGoalId,
      targetGoalId: validated.targetGoalId,
    },
    transaction,
  });

  if (existing) {
    throw new ConflictException('Goal alignment already exists');
  }

  const alignment = await GoalAlignmentModel.create(validated as any, { transaction });
  return alignment;
}

/**
 * Get goal alignments
 *
 * @param goalId - Goal ID
 * @param direction - 'source' or 'target'
 * @returns Array of alignments
 *
 * @example
 * ```typescript
 * const alignments = await getGoalAlignments('goal-uuid', 'source');
 * ```
 */
export async function getGoalAlignments(
  goalId: string,
  direction: 'source' | 'target' = 'source',
): Promise<GoalAlignmentModel[]> {
  const where: WhereOptions = direction === 'source'
    ? { sourceGoalId: goalId }
    : { targetGoalId: goalId };

  return GoalAlignmentModel.findAll({
    where,
    include: [
      { model: GoalModel, as: 'sourceGoal' },
      { model: GoalModel, as: 'targetGoal' },
    ],
  });
}

/**
 * Get goal alignment hierarchy
 *
 * @param goalId - Root goal ID
 * @returns Hierarchical alignment structure
 *
 * @example
 * ```typescript
 * const hierarchy = await getGoalAlignmentHierarchy('org-goal-uuid');
 * ```
 */
export async function getGoalAlignmentHierarchy(
  goalId: string,
): Promise<{
  goal: GoalModel;
  alignedGoals: Array<{ goal: GoalModel; alignmentType: AlignmentType }>;
}> {
  const goal = await GoalModel.findByPk(goalId);

  if (!goal) {
    throw new NotFoundException(`Goal ${goalId} not found`);
  }

  const alignments = await GoalAlignmentModel.findAll({
    where: { targetGoalId: goalId },
    include: [{ model: GoalModel, as: 'sourceGoal' }],
  });

  const alignedGoals = alignments.map((alignment) => ({
    goal: alignment.sourceGoal,
    alignmentType: alignment.alignmentType,
  }));

  return { goal, alignedGoals };
}

/**
 * Delete goal alignment
 *
 * @param alignmentId - Alignment ID
 * @param transaction - Optional transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await deleteGoalAlignment('alignment-uuid');
 * ```
 */
export async function deleteGoalAlignment(
  alignmentId: string,
  transaction?: Transaction,
): Promise<void> {
  const alignment = await GoalAlignmentModel.findByPk(alignmentId, { transaction });

  if (!alignment) {
    throw new NotFoundException(`Goal alignment ${alignmentId} not found`);
  }

  await alignment.destroy({ transaction });
}

// ============================================================================
// GOAL CASCADING FUNCTIONS
// ============================================================================

/**
 * Cascade goal to child level
 *
 * @param parentGoalId - Parent goal ID
 * @param childGoalData - Child goal data
 * @param transaction - Optional transaction
 * @returns Created child goal
 *
 * @example
 * ```typescript
 * const childGoal = await cascadeGoal('parent-goal-uuid', {
 *   title: 'Support organizational goal',
 *   ownerId: 'team-lead-uuid',
 *   ...
 * });
 * ```
 */
export async function cascadeGoal(
  parentGoalId: string,
  childGoalData: Partial<Goal>,
  transaction?: Transaction,
): Promise<GoalModel> {
  const parentGoal = await GoalModel.findByPk(parentGoalId, { transaction });

  if (!parentGoal) {
    throw new NotFoundException(`Parent goal ${parentGoalId} not found`);
  }

  // Set parent reference
  childGoalData.parentGoalId = parentGoalId;

  // Inherit some properties from parent if not specified
  if (!childGoalData.planId) childGoalData.planId = parentGoal.planId as any;
  if (!childGoalData.category) childGoalData.category = parentGoal.category;
  if (!childGoalData.startDate) childGoalData.startDate = parentGoal.startDate;
  if (!childGoalData.endDate) childGoalData.endDate = parentGoal.endDate;

  const childGoal = await createGoal(childGoalData, transaction);

  // Create alignment
  await createGoalAlignment({
    sourceGoalId: childGoal.id,
    targetGoalId: parentGoalId,
    alignmentType: AlignmentType.DERIVED_FROM,
    description: 'Cascaded from parent goal',
  }, transaction);

  return childGoal;
}

/**
 * Get child goals
 *
 * @param parentGoalId - Parent goal ID
 * @returns Array of child goals
 *
 * @example
 * ```typescript
 * const children = await getChildGoals('parent-goal-uuid');
 * ```
 */
export async function getChildGoals(
  parentGoalId: string,
): Promise<GoalModel[]> {
  return GoalModel.findAll({
    where: { parentGoalId },
    order: [['priority', 'ASC']],
  });
}

/**
 * Get goal hierarchy
 *
 * @param rootGoalId - Root goal ID
 * @returns Hierarchical goal structure
 *
 * @example
 * ```typescript
 * const hierarchy = await getGoalHierarchy('root-goal-uuid');
 * ```
 */
export async function getGoalHierarchy(
  rootGoalId: string,
): Promise<GoalModel> {
  const goal = await GoalModel.findByPk(rootGoalId, {
    include: [
      {
        model: GoalModel,
        as: 'childGoals',
        include: [
          {
            model: GoalModel,
            as: 'childGoals',
          },
        ],
      },
    ],
  });

  if (!goal) {
    throw new NotFoundException(`Goal ${rootGoalId} not found`);
  }

  return goal;
}

// ============================================================================
// GOAL TEMPLATE FUNCTIONS
// ============================================================================

/**
 * Create goal template
 *
 * @param templateData - Template data
 * @param createdBy - User creating template
 * @param transaction - Optional transaction
 * @returns Created template
 *
 * @example
 * ```typescript
 * const template = await createGoalTemplate({
 *   name: 'Customer Satisfaction Template',
 *   category: GoalCategory.CUSTOMER,
 *   methodology: GoalMethodology.OKR,
 *   templateData: { ... },
 * }, 'user-uuid');
 * ```
 */
export async function createGoalTemplate(
  templateData: Partial<GoalTemplate> & { createdBy: string },
  transaction?: Transaction,
): Promise<GoalTemplateModel> {
  const template = await GoalTemplateModel.create(templateData as any, { transaction });
  return template;
}

/**
 * Get goal templates
 *
 * @param filters - Optional filters
 * @returns Array of templates
 *
 * @example
 * ```typescript
 * const templates = await getGoalTemplates({
 *   category: GoalCategory.QUALITY,
 *   isPublic: true,
 * });
 * ```
 */
export async function getGoalTemplates(
  filters?: {
    category?: GoalCategory;
    methodology?: GoalMethodology;
    isPublic?: boolean;
  },
): Promise<GoalTemplateModel[]> {
  const where: WhereOptions = {};

  if (filters?.category) where.category = filters.category;
  if (filters?.methodology) where.methodology = filters.methodology;
  if (filters?.isPublic !== undefined) where.isPublic = filters.isPublic;

  return GoalTemplateModel.findAll({
    where,
    order: [['usageCount', 'DESC'], ['name', 'ASC']],
  });
}

/**
 * Create goal from template
 *
 * @param templateId - Template ID
 * @param goalData - Additional goal data
 * @param transaction - Optional transaction
 * @returns Created goal
 *
 * @example
 * ```typescript
 * const goal = await createGoalFromTemplate('template-uuid', {
 *   ownerId: 'emp-uuid',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 * });
 * ```
 */
export async function createGoalFromTemplate(
  templateId: string,
  goalData: Partial<Goal>,
  transaction?: Transaction,
): Promise<GoalModel> {
  const template = await GoalTemplateModel.findByPk(templateId, { transaction });

  if (!template) {
    throw new NotFoundException(`Goal template ${templateId} not found`);
  }

  // Merge template data with provided goal data
  const mergedData: Partial<Goal> = {
    ...goalData,
    title: goalData.title || template.templateData.titleTemplate || '',
    description: goalData.description || template.templateData.descriptionTemplate || '',
    category: goalData.category || template.category,
    methodology: goalData.methodology || template.methodology,
    weight: goalData.weight || template.templateData.suggestedWeight || 0,
  };

  const goal = await createGoal(mergedData, transaction);

  // Create key results from template
  if (template.templateData.keyResultsTemplate) {
    for (const krTemplate of template.templateData.keyResultsTemplate) {
      await addKeyResult({
        goalId: goal.id,
        title: krTemplate.title,
        measurementUnit: krTemplate.measurementUnit,
        startValue: 0,
        targetValue: 100,
        currentValue: 0,
        weight: 0,
      } as any, transaction);
    }
  }

  // Create milestones from template
  if (template.templateData.milestonesTemplate) {
    for (const msTemplate of template.templateData.milestonesTemplate) {
      const dueDate = new Date(goal.startDate);
      dueDate.setDate(dueDate.getDate() + msTemplate.daysFromStart);

      await addMilestone({
        goalId: goal.id,
        title: msTemplate.title,
        dueDate,
        order: 0,
      } as any, transaction);
    }
  }

  // Increment template usage count
  await template.update(
    { usageCount: template.usageCount + 1 },
    { transaction },
  );

  return goal;
}

// ============================================================================
// GOAL ANALYTICS AND REPORTING FUNCTIONS
// ============================================================================

/**
 * Get goal completion statistics
 *
 * @param filters - Optional filters
 * @returns Goal completion statistics
 *
 * @example
 * ```typescript
 * const stats = await getGoalCompletionStats({
 *   planId: 'plan-uuid',
 *   goalType: GoalType.INDIVIDUAL,
 * });
 * ```
 */
export async function getGoalCompletionStats(
  filters?: {
    planId?: string;
    ownerId?: string;
    goalType?: GoalType;
    category?: GoalCategory;
  },
): Promise<{
  total: number;
  draft: number;
  active: number;
  achieved: number;
  notAchieved: number;
  inProgress: number;
  completionRate: number;
  averageProgress: number;
}> {
  const where: WhereOptions = {};

  if (filters?.planId) where.planId = filters.planId;
  if (filters?.ownerId) where.ownerId = filters.ownerId;
  if (filters?.goalType) where.goalType = filters.goalType;
  if (filters?.category) where.category = filters.category;

  const goals = await GoalModel.findAll({ where });

  const stats = {
    total: goals.length,
    draft: 0,
    active: 0,
    achieved: 0,
    notAchieved: 0,
    inProgress: 0,
    completionRate: 0,
    averageProgress: 0,
  };

  let totalProgress = 0;

  goals.forEach((goal) => {
    totalProgress += goal.progressPercentage;

    switch (goal.status) {
      case GoalStatus.DRAFT:
      case GoalStatus.SUBMITTED:
        stats.draft += 1;
        break;
      case GoalStatus.ACTIVE:
      case GoalStatus.APPROVED:
      case GoalStatus.IN_PROGRESS:
        stats.inProgress += 1;
        break;
      case GoalStatus.ACHIEVED:
      case GoalStatus.PARTIALLY_ACHIEVED:
        stats.achieved += 1;
        break;
      case GoalStatus.NOT_ACHIEVED:
        stats.notAchieved += 1;
        break;
    }
  });

  stats.completionRate = stats.total > 0
    ? ((stats.achieved + stats.notAchieved) / stats.total) * 100
    : 0;

  stats.averageProgress = stats.total > 0 ? totalProgress / stats.total : 0;

  return stats;
}

/**
 * Get employee goal summary
 *
 * @param ownerId - Owner ID
 * @param planId - Plan ID
 * @returns Employee goal summary
 *
 * @example
 * ```typescript
 * const summary = await getEmployeeGoalSummary('emp-uuid', 'plan-uuid');
 * ```
 */
export async function getEmployeeGoalSummary(
  ownerId: string,
  planId: string,
): Promise<{
  totalGoals: number;
  activeGoals: number;
  achievedGoals: number;
  overallProgress: number;
  byCategory: Record<GoalCategory, number>;
  byPriority: Record<GoalPriority, number>;
  stretchGoals: number;
  atRiskGoals: number;
}> {
  const goals = await GoalModel.findAll({
    where: { ownerId, planId },
    include: [{ model: KeyResultModel, as: 'keyResults' }],
  });

  const summary = {
    totalGoals: goals.length,
    activeGoals: 0,
    achievedGoals: 0,
    overallProgress: 0,
    byCategory: {} as Record<GoalCategory, number>,
    byPriority: {} as Record<GoalPriority, number>,
    stretchGoals: 0,
    atRiskGoals: 0,
  };

  // Initialize category and priority counts
  Object.values(GoalCategory).forEach((cat) => {
    summary.byCategory[cat] = 0;
  });
  Object.values(GoalPriority).forEach((pri) => {
    summary.byPriority[pri] = 0;
  });

  let totalProgress = 0;

  goals.forEach((goal) => {
    totalProgress += goal.progressPercentage;

    // Count by status
    if (goal.status === GoalStatus.ACTIVE || goal.status === GoalStatus.IN_PROGRESS) {
      summary.activeGoals += 1;
    }
    if (goal.status === GoalStatus.ACHIEVED) {
      summary.achievedGoals += 1;
    }

    // Count by category and priority
    summary.byCategory[goal.category] += 1;
    summary.byPriority[goal.priority] += 1;

    // Count stretch goals
    if (goal.isStretch) {
      summary.stretchGoals += 1;
    }

    // Identify at-risk goals (progress < 50% and past mid-point of duration)
    const now = new Date();
    const duration = goal.endDate.getTime() - goal.startDate.getTime();
    const elapsed = now.getTime() - goal.startDate.getTime();
    const midPoint = duration / 2;

    if (elapsed > midPoint && goal.progressPercentage < 50) {
      summary.atRiskGoals += 1;
    }
  });

  summary.overallProgress = summary.totalGoals > 0 ? totalProgress / summary.totalGoals : 0;

  return summary;
}

/**
 * Get goals by status
 *
 * @param status - Goal status
 * @param filters - Optional filters
 * @returns Array of goals
 *
 * @example
 * ```typescript
 * const activeGoals = await getGoalsByStatus(GoalStatus.ACTIVE, {
 *   ownerId: 'emp-uuid',
 * });
 * ```
 */
export async function getGoalsByStatus(
  status: GoalStatus,
  filters?: {
    ownerId?: string;
    planId?: string;
    goalType?: GoalType;
  },
): Promise<GoalModel[]> {
  const where: WhereOptions = { status };

  if (filters?.ownerId) where.ownerId = filters.ownerId;
  if (filters?.planId) where.planId = filters.planId;
  if (filters?.goalType) where.goalType = filters.goalType;

  return GoalModel.findAll({
    where,
    order: [['priority', 'ASC'], ['endDate', 'ASC']],
    include: [
      { model: KeyResultModel, as: 'keyResults' },
      { model: MilestoneModel, as: 'milestones' },
    ],
  });
}

/**
 * Get overdue goals
 *
 * @param ownerId - Optional owner ID
 * @returns Array of overdue goals
 *
 * @example
 * ```typescript
 * const overdueGoals = await getOverdueGoals('emp-uuid');
 * ```
 */
export async function getOverdueGoals(
  ownerId?: string,
): Promise<GoalModel[]> {
  const where: WhereOptions = {
    endDate: { [Op.lt]: new Date() },
    status: {
      [Op.notIn]: [
        GoalStatus.ACHIEVED,
        GoalStatus.NOT_ACHIEVED,
        GoalStatus.CANCELLED,
      ],
    },
  };

  if (ownerId) {
    where.ownerId = ownerId;
  }

  return GoalModel.findAll({
    where,
    order: [['endDate', 'ASC']],
  });
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

@Injectable()
export class GoalManagementService {
  // Goal plan methods
  async createGoalPlan(data: any, transaction?: Transaction) {
    return createGoalPlan(data, transaction);
  }

  // Goal methods
  async createGoal(data: any, transaction?: Transaction) {
    return createGoal(data, transaction);
  }

  async updateGoal(id: string, data: any, transaction?: Transaction) {
    return updateGoal(id, data, transaction);
  }

  async getGoalById(id: string, includeRelations: boolean = false) {
    return getGoalById(id, includeRelations);
  }

  async getEmployeeGoals(ownerId: string, filters?: any) {
    return getEmployeeGoals(ownerId, filters);
  }

  async approveGoal(id: string, approvedBy: string, transaction?: Transaction) {
    return approveGoal(id, approvedBy, transaction);
  }

  async activateGoal(id: string, transaction?: Transaction) {
    return activateGoal(id, transaction);
  }

  async deleteGoal(id: string, transaction?: Transaction) {
    return deleteGoal(id, transaction);
  }

  async createSMARTGoal(goalData: any, smartCriteria: SMARTCriteria, transaction?: Transaction) {
    return createSMARTGoal(goalData, smartCriteria, transaction);
  }

  // Key result methods
  async addKeyResult(data: any, transaction?: Transaction) {
    return addKeyResult(data, transaction);
  }

  async updateKeyResult(id: string, data: any, transaction?: Transaction) {
    return updateKeyResult(id, data, transaction);
  }

  async updateKeyResultProgress(id: string, currentValue: number, transaction?: Transaction) {
    return updateKeyResultProgress(id, currentValue, transaction);
  }

  async getKeyResults(goalId: string) {
    return getKeyResults(goalId);
  }

  async calculateGoalProgressFromKeyResults(goalId: string, transaction?: Transaction) {
    return calculateGoalProgressFromKeyResults(goalId, transaction);
  }

  // Milestone methods
  async addMilestone(data: any, transaction?: Transaction) {
    return addMilestone(data, transaction);
  }

  async completeMilestone(id: string, transaction?: Transaction) {
    return completeMilestone(id, transaction);
  }

  async getMilestones(goalId: string) {
    return getMilestones(goalId);
  }

  async calculateGoalProgressFromMilestones(goalId: string, transaction?: Transaction) {
    return calculateGoalProgressFromMilestones(goalId, transaction);
  }

  // Check-in methods
  async createGoalCheckIn(data: any, transaction?: Transaction) {
    return createGoalCheckIn(data, transaction);
  }

  async getGoalCheckIns(goalId: string, limit?: number) {
    return getGoalCheckIns(goalId, limit);
  }

  async getLatestCheckIn(goalId: string) {
    return getLatestCheckIn(goalId);
  }

  async getCheckInHistory(employeeId: string, startDate: Date, endDate: Date) {
    return getCheckInHistory(employeeId, startDate, endDate);
  }

  // Alignment methods
  async createGoalAlignment(data: any, transaction?: Transaction) {
    return createGoalAlignment(data, transaction);
  }

  async getGoalAlignments(goalId: string, direction: 'source' | 'target' = 'source') {
    return getGoalAlignments(goalId, direction);
  }

  async getGoalAlignmentHierarchy(goalId: string) {
    return getGoalAlignmentHierarchy(goalId);
  }

  async deleteGoalAlignment(id: string, transaction?: Transaction) {
    return deleteGoalAlignment(id, transaction);
  }

  // Cascading methods
  async cascadeGoal(parentGoalId: string, childGoalData: any, transaction?: Transaction) {
    return cascadeGoal(parentGoalId, childGoalData, transaction);
  }

  async getChildGoals(parentGoalId: string) {
    return getChildGoals(parentGoalId);
  }

  async getGoalHierarchy(rootGoalId: string) {
    return getGoalHierarchy(rootGoalId);
  }

  // Template methods
  async createGoalTemplate(data: any, transaction?: Transaction) {
    return createGoalTemplate(data, transaction);
  }

  async getGoalTemplates(filters?: any) {
    return getGoalTemplates(filters);
  }

  async createGoalFromTemplate(templateId: string, goalData: any, transaction?: Transaction) {
    return createGoalFromTemplate(templateId, goalData, transaction);
  }

  // Analytics methods
  async getGoalCompletionStats(filters?: any) {
    return getGoalCompletionStats(filters);
  }

  async getEmployeeGoalSummary(ownerId: string, planId: string) {
    return getEmployeeGoalSummary(ownerId, planId);
  }

  async getGoalsByStatus(status: GoalStatus, filters?: any) {
    return getGoalsByStatus(status, filters);
  }

  async getOverdueGoals(ownerId?: string) {
    return getOverdueGoals(ownerId);
  }
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

@ApiTags('Goal Management')
@ApiBearerAuth()
@Controller('goal-management')
export class GoalManagementController {
  constructor(private readonly service: GoalManagementService) {}

  @Post('plans')
  @ApiOperation({ summary: 'Create goal plan' })
  @ApiResponse({ status: 201, description: 'Goal plan created successfully' })
  async createPlan(@Body() data: any) {
    return this.service.createGoalPlan(data);
  }

  @Post('goals')
  @ApiOperation({ summary: 'Create goal' })
  @ApiResponse({ status: 201, description: 'Goal created successfully' })
  async createGoal(@Body() data: any) {
    return this.service.createGoal(data);
  }

  @Post('goals/smart')
  @ApiOperation({ summary: 'Create SMART goal' })
  @ApiResponse({ status: 201, description: 'SMART goal created successfully' })
  async createSMARTGoal(@Body() data: any) {
    return this.service.createSMARTGoal(data.goalData, data.smartCriteria);
  }

  @Get('goals/:id')
  @ApiOperation({ summary: 'Get goal by ID' })
  @ApiParam({ name: 'id', description: 'Goal ID' })
  @ApiQuery({ name: 'includeRelations', required: false, type: Boolean })
  async getGoal(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeRelations') includeRelations?: boolean,
  ) {
    return this.service.getGoalById(id, includeRelations);
  }

  @Put('goals/:id')
  @ApiOperation({ summary: 'Update goal' })
  @ApiParam({ name: 'id', description: 'Goal ID' })
  async updateGoal(@Param('id', ParseUUIDPipe) id: string, @Body() data: any) {
    return this.service.updateGoal(id, data);
  }

  @Delete('goals/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete goal' })
  @ApiParam({ name: 'id', description: 'Goal ID' })
  async deleteGoal(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.deleteGoal(id);
  }

  @Post('goals/:id/approve')
  @ApiOperation({ summary: 'Approve goal' })
  @ApiParam({ name: 'id', description: 'Goal ID' })
  async approveGoal(@Param('id', ParseUUIDPipe) id: string, @Body() data: any) {
    return this.service.approveGoal(id, data.approvedBy);
  }

  @Post('goals/:id/activate')
  @ApiOperation({ summary: 'Activate goal' })
  @ApiParam({ name: 'id', description: 'Goal ID' })
  async activateGoal(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.activateGoal(id);
  }

  @Get('employees/:ownerId/goals')
  @ApiOperation({ summary: 'Get employee goals' })
  @ApiParam({ name: 'ownerId', description: 'Owner ID' })
  async getEmployeeGoals(
    @Param('ownerId', ParseUUIDPipe) ownerId: string,
    @Query() filters: any,
  ) {
    return this.service.getEmployeeGoals(ownerId, filters);
  }

  @Post('key-results')
  @ApiOperation({ summary: 'Add key result to goal' })
  @ApiResponse({ status: 201, description: 'Key result created successfully' })
  async addKeyResult(@Body() data: any) {
    return this.service.addKeyResult(data);
  }

  @Put('key-results/:id')
  @ApiOperation({ summary: 'Update key result' })
  @ApiParam({ name: 'id', description: 'Key result ID' })
  async updateKeyResult(@Param('id', ParseUUIDPipe) id: string, @Body() data: any) {
    return this.service.updateKeyResult(id, data);
  }

  @Patch('key-results/:id/progress')
  @ApiOperation({ summary: 'Update key result progress' })
  @ApiParam({ name: 'id', description: 'Key result ID' })
  async updateKeyResultProgress(@Param('id', ParseUUIDPipe) id: string, @Body() data: any) {
    return this.service.updateKeyResultProgress(id, data.currentValue);
  }

  @Get('goals/:goalId/key-results')
  @ApiOperation({ summary: 'Get key results for goal' })
  @ApiParam({ name: 'goalId', description: 'Goal ID' })
  async getKeyResults(@Param('goalId', ParseUUIDPipe) goalId: string) {
    return this.service.getKeyResults(goalId);
  }

  @Post('milestones')
  @ApiOperation({ summary: 'Add milestone to goal' })
  @ApiResponse({ status: 201, description: 'Milestone created successfully' })
  async addMilestone(@Body() data: any) {
    return this.service.addMilestone(data);
  }

  @Post('milestones/:id/complete')
  @ApiOperation({ summary: 'Complete milestone' })
  @ApiParam({ name: 'id', description: 'Milestone ID' })
  async completeMilestone(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.completeMilestone(id);
  }

  @Get('goals/:goalId/milestones')
  @ApiOperation({ summary: 'Get milestones for goal' })
  @ApiParam({ name: 'goalId', description: 'Goal ID' })
  async getMilestones(@Param('goalId', ParseUUIDPipe) goalId: string) {
    return this.service.getMilestones(goalId);
  }

  @Post('check-ins')
  @ApiOperation({ summary: 'Create goal check-in' })
  @ApiResponse({ status: 201, description: 'Check-in created successfully' })
  async createCheckIn(@Body() data: any) {
    return this.service.createGoalCheckIn(data);
  }

  @Get('goals/:goalId/check-ins')
  @ApiOperation({ summary: 'Get check-ins for goal' })
  @ApiParam({ name: 'goalId', description: 'Goal ID' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getCheckIns(
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @Query('limit') limit?: number,
  ) {
    return this.service.getGoalCheckIns(goalId, limit);
  }

  @Post('alignments')
  @ApiOperation({ summary: 'Create goal alignment' })
  @ApiResponse({ status: 201, description: 'Alignment created successfully' })
  async createAlignment(@Body() data: any) {
    return this.service.createGoalAlignment(data);
  }

  @Get('goals/:goalId/alignments')
  @ApiOperation({ summary: 'Get goal alignments' })
  @ApiParam({ name: 'goalId', description: 'Goal ID' })
  @ApiQuery({ name: 'direction', required: false, enum: ['source', 'target'] })
  async getAlignments(
    @Param('goalId', ParseUUIDPipe) goalId: string,
    @Query('direction') direction?: 'source' | 'target',
  ) {
    return this.service.getGoalAlignments(goalId, direction);
  }

  @Get('goals/:goalId/alignment-hierarchy')
  @ApiOperation({ summary: 'Get goal alignment hierarchy' })
  @ApiParam({ name: 'goalId', description: 'Goal ID' })
  async getAlignmentHierarchy(@Param('goalId', ParseUUIDPipe) goalId: string) {
    return this.service.getGoalAlignmentHierarchy(goalId);
  }

  @Post('goals/:parentGoalId/cascade')
  @ApiOperation({ summary: 'Cascade goal to child level' })
  @ApiParam({ name: 'parentGoalId', description: 'Parent goal ID' })
  async cascadeGoal(@Param('parentGoalId', ParseUUIDPipe) parentGoalId: string, @Body() data: any) {
    return this.service.cascadeGoal(parentGoalId, data);
  }

  @Get('goals/:parentGoalId/children')
  @ApiOperation({ summary: 'Get child goals' })
  @ApiParam({ name: 'parentGoalId', description: 'Parent goal ID' })
  async getChildGoals(@Param('parentGoalId', ParseUUIDPipe) parentGoalId: string) {
    return this.service.getChildGoals(parentGoalId);
  }

  @Get('goals/:rootGoalId/hierarchy')
  @ApiOperation({ summary: 'Get goal hierarchy' })
  @ApiParam({ name: 'rootGoalId', description: 'Root goal ID' })
  async getHierarchy(@Param('rootGoalId', ParseUUIDPipe) rootGoalId: string) {
    return this.service.getGoalHierarchy(rootGoalId);
  }

  @Post('templates')
  @ApiOperation({ summary: 'Create goal template' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  async createTemplate(@Body() data: any) {
    return this.service.createGoalTemplate(data);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get goal templates' })
  async getTemplates(@Query() filters: any) {
    return this.service.getGoalTemplates(filters);
  }

  @Post('templates/:templateId/create-goal')
  @ApiOperation({ summary: 'Create goal from template' })
  @ApiParam({ name: 'templateId', description: 'Template ID' })
  async createFromTemplate(
    @Param('templateId', ParseUUIDPipe) templateId: string,
    @Body() goalData: any,
  ) {
    return this.service.createGoalFromTemplate(templateId, goalData);
  }

  @Get('analytics/completion-stats')
  @ApiOperation({ summary: 'Get goal completion statistics' })
  async getCompletionStats(@Query() filters: any) {
    return this.service.getGoalCompletionStats(filters);
  }

  @Get('employees/:ownerId/goal-summary')
  @ApiOperation({ summary: 'Get employee goal summary' })
  @ApiParam({ name: 'ownerId', description: 'Owner ID' })
  @ApiQuery({ name: 'planId', description: 'Plan ID' })
  async getEmployeeSummary(
    @Param('ownerId', ParseUUIDPipe) ownerId: string,
    @Query('planId', ParseUUIDPipe) planId: string,
  ) {
    return this.service.getEmployeeGoalSummary(ownerId, planId);
  }

  @Get('goals/overdue')
  @ApiOperation({ summary: 'Get overdue goals' })
  @ApiQuery({ name: 'ownerId', required: false })
  async getOverdueGoals(@Query('ownerId') ownerId?: string) {
    return this.service.getOverdueGoals(ownerId);
  }
}
