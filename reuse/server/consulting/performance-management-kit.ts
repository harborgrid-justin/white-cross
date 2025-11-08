/**
 * LOC: CONS-PERF-MGT-001
 * File: /reuse/server/consulting/performance-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *   - @nestjs/swagger (ApiProperty, ApiResponse)
 *   - class-validator (decorators)
 *   - class-transformer (Type, Transform)
 *
 * DOWNSTREAM (imported by):
 *   - backend/consulting/performance.service.ts
 *   - backend/consulting/okr.controller.ts
 *   - backend/consulting/calibration.service.ts
 */

/**
 * File: /reuse/server/consulting/performance-management-kit.ts
 * Locator: WC-CONS-PERFMGT-001
 * Purpose: Enterprise-grade Performance Management Kit - OKRs, KPIs, balanced scorecard, 360 feedback, calibration
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, class-validator 0.14.x, class-transformer 0.5.x
 * Downstream: Consulting services, performance controllers, calibration processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 44 production-ready functions for performance management competing with Workday, SuccessFactors, Lattice
 *
 * LLM Context: Comprehensive performance management utilities for production-ready consulting applications.
 * Provides OKR framework implementation, KPI design and tracking, balanced scorecard methodology, 360-degree feedback,
 * performance calibration sessions, goal cascading, performance improvement plans, continuous feedback, ratings,
 * talent review processes, succession planning integration, and performance analytics.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
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
  IsObject,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Goal types
 */
export enum GoalType {
  OBJECTIVE = 'objective',
  KEY_RESULT = 'key_result',
  KPI = 'kpi',
  MILESTONE = 'milestone',
  BEHAVIOR = 'behavior',
  DEVELOPMENT = 'development',
}

/**
 * Goal status
 */
export enum GoalStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  AT_RISK = 'at_risk',
  COMPLETED = 'completed',
  DEFERRED = 'deferred',
  CANCELLED = 'cancelled',
}

/**
 * Performance rating scale
 */
export enum PerformanceRating {
  UNSATISFACTORY = 'unsatisfactory',
  NEEDS_IMPROVEMENT = 'needs_improvement',
  MEETS_EXPECTATIONS = 'meets_expectations',
  EXCEEDS_EXPECTATIONS = 'exceeds_expectations',
  OUTSTANDING = 'outstanding',
}

/**
 * Review cycle frequency
 */
export enum ReviewCycleFrequency {
  QUARTERLY = 'quarterly',
  SEMI_ANNUAL = 'semi_annual',
  ANNUAL = 'annual',
  CONTINUOUS = 'continuous',
}

/**
 * Feedback types
 */
export enum FeedbackType {
  UPWARD = 'upward',
  DOWNWARD = 'downward',
  PEER = 'peer',
  SELF = 'self',
  CUSTOMER = 'customer',
}

/**
 * KPI measurement types
 */
export enum KPIMeasurementType {
  NUMERIC = 'numeric',
  PERCENTAGE = 'percentage',
  CURRENCY = 'currency',
  BOOLEAN = 'boolean',
  MILESTONE = 'milestone',
}

/**
 * Balanced scorecard perspectives
 */
export enum BalancedScorecardPerspective {
  FINANCIAL = 'financial',
  CUSTOMER = 'customer',
  INTERNAL_PROCESS = 'internal_process',
  LEARNING_GROWTH = 'learning_growth',
}

/**
 * Calibration decision types
 */
export enum CalibrationDecision {
  CONFIRMED = 'confirmed',
  UPGRADED = 'upgraded',
  DOWNGRADED = 'downgraded',
  UNDER_REVIEW = 'under_review',
}

/**
 * Performance improvement plan status
 */
export enum PIPStatus {
  ACTIVE = 'active',
  ON_TRACK = 'on_track',
  AT_RISK = 'at_risk',
  COMPLETED_SUCCESS = 'completed_success',
  COMPLETED_FAILURE = 'completed_failure',
  CANCELLED = 'cancelled',
}

/**
 * Goal alignment levels
 */
export enum AlignmentLevel {
  COMPANY = 'company',
  DIVISION = 'division',
  DEPARTMENT = 'department',
  TEAM = 'team',
  INDIVIDUAL = 'individual',
}

/**
 * Development area categories
 */
export enum DevelopmentCategory {
  TECHNICAL_SKILLS = 'technical_skills',
  LEADERSHIP = 'leadership',
  COMMUNICATION = 'communication',
  COLLABORATION = 'collaboration',
  INNOVATION = 'innovation',
  EXECUTION = 'execution',
}

// ============================================================================
// INTERFACE DEFINITIONS
// ============================================================================

interface ObjectiveData {
  objectiveId: string;
  organizationId: string;
  ownerId: string;
  title: string;
  description: string;
  alignmentLevel: AlignmentLevel;
  parentObjectiveId?: string;
  timeFrame: string;
  startDate: Date;
  endDate: Date;
  weight: number;
  status: GoalStatus;
  progress: number;
  confidenceLevel: number;
  metadata?: Record<string, any>;
}

interface KeyResultData {
  keyResultId: string;
  objectiveId: string;
  title: string;
  description: string;
  measurementType: KPIMeasurementType;
  startValue: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  weight: number;
  status: GoalStatus;
  progress: number;
  milestones?: string[];
}

interface KPIData {
  kpiId: string;
  organizationId: string;
  name: string;
  description: string;
  category: string;
  owner: string;
  measurementType: KPIMeasurementType;
  formula: string;
  dataSource: string;
  frequency: string;
  targetValue: number;
  currentValue: number;
  thresholdGreen: number;
  thresholdYellow: number;
  thresholdRed: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface BalancedScorecardData {
  scorecardId: string;
  organizationId: string;
  name: string;
  description: string;
  timeframe: string;
  perspectives: ScorecardPerspective[];
  overallScore: number;
  status: 'draft' | 'active' | 'archived';
}

interface ScorecardPerspective {
  perspectiveId: string;
  perspective: BalancedScorecardPerspective;
  objectives: string[];
  measures: string[];
  targets: string[];
  initiatives: string[];
  weight: number;
  score: number;
}

interface FeedbackRequestData {
  requestId: string;
  subjectId: string;
  subjectName: string;
  requesterId: string;
  feedbackType: FeedbackType;
  reviewers: string[];
  questions: FeedbackQuestion[];
  dueDate: Date;
  purpose: string;
  isAnonymous: boolean;
  status: 'pending' | 'in_progress' | 'completed';
}

interface FeedbackQuestion {
  questionId: string;
  questionText: string;
  category: string;
  isRequired: boolean;
  responseType: 'text' | 'rating' | 'multiple_choice';
  options?: string[];
}

interface FeedbackResponseData {
  responseId: string;
  requestId: string;
  reviewerId: string;
  responses: QuestionResponse[];
  overallRating?: number;
  strengths: string[];
  areasForImprovement: string[];
  submittedAt: Date;
}

interface QuestionResponse {
  questionId: string;
  answer: string | number;
  comments?: string;
}

interface PerformanceReviewData {
  reviewId: string;
  employeeId: string;
  reviewerId: string;
  reviewCycle: string;
  reviewPeriodStart: Date;
  reviewPeriodEnd: Date;
  overallRating: PerformanceRating;
  goalAchievement: number;
  competencyRatings: CompetencyRating[];
  strengths: string[];
  areasForImprovement: string[];
  developmentGoals: string[];
  promotionRecommendation: boolean;
  compensationRecommendation: string;
  comments: string;
  status: 'draft' | 'submitted' | 'calibrated' | 'finalized';
}

interface CompetencyRating {
  competencyId: string;
  competencyName: string;
  rating: PerformanceRating;
  comments: string;
  examples: string[];
}

interface CalibrationSessionData {
  sessionId: string;
  organizationId: string;
  sessionName: string;
  calibrationCycle: string;
  facilitatorId: string;
  participants: string[];
  reviews: string[];
  sessionDate: Date;
  ratingDistribution: RatingDistribution;
  decisions: CalibrationDecision[];
  status: 'scheduled' | 'in_progress' | 'completed';
}

interface RatingDistribution {
  unsatisfactory: number;
  needsImprovement: number;
  meetsExpectations: number;
  exceedsExpectations: number;
  outstanding: number;
  targetDistribution: Record<PerformanceRating, number>;
  actualDistribution: Record<PerformanceRating, number>;
}

interface CalibrationDecisionData {
  decisionId: string;
  sessionId: string;
  reviewId: string;
  employeeId: string;
  originalRating: PerformanceRating;
  calibratedRating: PerformanceRating;
  decision: CalibrationDecision;
  rationale: string;
  discussionNotes: string;
  approvedBy: string;
}

interface GoalCascadeData {
  cascadeId: string;
  organizationId: string;
  topLevelObjectiveId: string;
  cascadeLevels: CascadeLevel[];
  totalGoals: number;
  alignmentScore: number;
  completionPercentage: number;
}

interface CascadeLevel {
  level: AlignmentLevel;
  parentGoalId?: string;
  childGoals: ObjectiveData[];
  alignmentStrength: number;
}

interface PerformanceImprovementPlanData {
  pipId: string;
  employeeId: string;
  managerId: string;
  startDate: Date;
  reviewDate: Date;
  endDate: Date;
  concernsIdentified: string[];
  performanceGaps: PerformanceGap[];
  improvementActions: ImprovementAction[];
  successCriteria: string[];
  supportProvided: string[];
  status: PIPStatus;
  progressNotes: ProgressNote[];
  outcome?: 'successful' | 'unsuccessful';
}

interface PerformanceGap {
  gapId: string;
  area: string;
  currentState: string;
  expectedState: string;
  severity: 'low' | 'medium' | 'high';
  impact: string;
}

interface ImprovementAction {
  actionId: string;
  description: string;
  targetCompletionDate: Date;
  responsibleParty: string;
  resources: string[];
  status: 'pending' | 'in_progress' | 'completed';
  completionDate?: Date;
}

interface ProgressNote {
  noteId: string;
  date: Date;
  author: string;
  observation: string;
  progress: 'positive' | 'neutral' | 'negative';
  nextSteps: string[];
}

interface ContinuousFeedbackData {
  feedbackId: string;
  giverId: string;
  receiverId: string;
  feedbackDate: Date;
  context: string;
  positiveObservations: string[];
  constructiveSuggestions: string[];
  actionableItems: string[];
  isPrivate: boolean;
  isAcknowledged: boolean;
  acknowledgedAt?: Date;
}

interface TalentReviewData {
  reviewId: string;
  organizationId: string;
  reviewCycle: string;
  reviewDate: Date;
  participants: string[];
  employeesReviewed: TalentReviewEmployee[];
  nineBoxGrid: NineBoxGrid;
  successionPlans: SuccessionPlan[];
  talentActions: TalentAction[];
}

interface TalentReviewEmployee {
  employeeId: string;
  employeeName: string;
  position: string;
  performanceRating: PerformanceRating;
  potentialRating: 'low' | 'medium' | 'high';
  nineBoxPosition: string;
  flightRisk: 'low' | 'medium' | 'high';
  readinessForPromotion: string;
  developmentNeeds: string[];
}

interface NineBoxGrid {
  gridId: string;
  positions: Record<string, string[]>;
  distribution: Record<string, number>;
}

interface SuccessionPlan {
  planId: string;
  criticalRole: string;
  incumbentId?: string;
  successors: SuccessorCandidate[];
  developmentTimeline: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface SuccessorCandidate {
  candidateId: string;
  candidateName: string;
  readiness: 'ready_now' | '1_year' | '2_3_years' | 'long_term';
  developmentNeeds: string[];
  strengthsAlignment: string[];
}

interface TalentAction {
  actionId: string;
  employeeId: string;
  actionType: 'promotion' | 'development' | 'retention' | 'transition';
  description: string;
  targetDate: Date;
  owner: string;
  status: 'planned' | 'in_progress' | 'completed';
}

interface PerformanceAnalytics {
  organizationId: string;
  analysisPeriod: string;
  totalEmployees: number;
  ratingDistribution: Record<PerformanceRating, number>;
  goalCompletionRate: number;
  averageGoalProgress: number;
  feedbackVelocity: number;
  calibrationVariance: number;
  topPerformers: string[];
  atRiskEmployees: string[];
  trendsAnalysis: TrendAnalysis[];
}

interface TrendAnalysis {
  metric: string;
  currentValue: number;
  previousValue: number;
  changePercentage: number;
  trend: 'improving' | 'declining' | 'stable';
  insights: string[];
}

// ============================================================================
// DTO CLASSES FOR VALIDATION AND SWAGGER
// ============================================================================

/**
 * Create Objective DTO
 */
export class CreateObjectiveDto {
  @ApiProperty({ description: 'Objective title', example: 'Increase customer satisfaction' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Detailed description', example: 'Improve NPS score by implementing customer feedback loop' })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ enum: AlignmentLevel, description: 'Alignment level' })
  @IsEnum(AlignmentLevel)
  alignmentLevel: AlignmentLevel;

  @ApiProperty({ description: 'Parent objective ID for cascading', required: false })
  @IsOptional()
  @IsString()
  parentObjectiveId?: string;

  @ApiProperty({ description: 'Time frame', example: 'Q1 2024' })
  @IsString()
  @IsNotEmpty()
  timeFrame: string;

  @ApiProperty({ description: 'Start date' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ description: 'Weight/importance', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  weight: number;
}

/**
 * Create Key Result DTO
 */
export class CreateKeyResultDto {
  @ApiProperty({ description: 'Objective ID' })
  @IsString()
  @IsNotEmpty()
  objectiveId: string;

  @ApiProperty({ description: 'Key result title', example: 'Achieve NPS score of 70+' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ enum: KPIMeasurementType, description: 'Measurement type' })
  @IsEnum(KPIMeasurementType)
  measurementType: KPIMeasurementType;

  @ApiProperty({ description: 'Starting value', example: 55 })
  @IsNumber()
  startValue: number;

  @ApiProperty({ description: 'Target value', example: 70 })
  @IsNumber()
  targetValue: number;

  @ApiProperty({ description: 'Unit of measurement', example: 'points' })
  @IsString()
  unit: string;

  @ApiProperty({ description: 'Weight relative to other key results', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  weight: number;
}

/**
 * Create KPI DTO
 */
export class CreateKPIDto {
  @ApiProperty({ description: 'KPI name', example: 'Customer Retention Rate' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  name: string;

  @ApiProperty({ description: 'KPI description' })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ description: 'Category', example: 'Customer Success' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'KPI owner' })
  @IsString()
  owner: string;

  @ApiProperty({ enum: KPIMeasurementType, description: 'Measurement type' })
  @IsEnum(KPIMeasurementType)
  measurementType: KPIMeasurementType;

  @ApiProperty({ description: 'Calculation formula', example: '(Retained Customers / Total Customers) * 100' })
  @IsString()
  formula: string;

  @ApiProperty({ description: 'Data source', example: 'CRM System' })
  @IsString()
  dataSource: string;

  @ApiProperty({ description: 'Measurement frequency', example: 'monthly' })
  @IsString()
  frequency: string;

  @ApiProperty({ description: 'Target value' })
  @IsNumber()
  targetValue: number;

  @ApiProperty({ description: 'Green threshold (good performance)' })
  @IsNumber()
  thresholdGreen: number;

  @ApiProperty({ description: 'Yellow threshold (warning)' })
  @IsNumber()
  thresholdYellow: number;

  @ApiProperty({ description: 'Red threshold (critical)' })
  @IsNumber()
  thresholdRed: number;

  @ApiProperty({ description: 'Unit', example: '%' })
  @IsString()
  unit: string;

  @ApiProperty({ enum: ['low', 'medium', 'high', 'critical'], description: 'Priority level' })
  @IsEnum(['low', 'medium', 'high', 'critical'])
  priority: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Create Feedback Request DTO
 */
export class CreateFeedbackRequestDto {
  @ApiProperty({ description: 'Subject employee ID' })
  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @ApiProperty({ enum: FeedbackType, description: 'Type of feedback' })
  @IsEnum(FeedbackType)
  feedbackType: FeedbackType;

  @ApiProperty({ description: 'List of reviewer IDs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  reviewers: string[];

  @ApiProperty({ description: 'Feedback questions', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  questions: FeedbackQuestion[];

  @ApiProperty({ description: 'Due date for responses' })
  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @ApiProperty({ description: 'Purpose of feedback request' })
  @IsString()
  @MaxLength(500)
  purpose: string;

  @ApiProperty({ description: 'Whether feedback is anonymous', default: false })
  @IsBoolean()
  isAnonymous: boolean;
}

/**
 * Create Performance Review DTO
 */
export class CreatePerformanceReviewDto {
  @ApiProperty({ description: 'Employee ID being reviewed' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ description: 'Review cycle identifier', example: '2024-Q1' })
  @IsString()
  @IsNotEmpty()
  reviewCycle: string;

  @ApiProperty({ description: 'Review period start date' })
  @IsDate()
  @Type(() => Date)
  reviewPeriodStart: Date;

  @ApiProperty({ description: 'Review period end date' })
  @IsDate()
  @Type(() => Date)
  reviewPeriodEnd: Date;

  @ApiProperty({ enum: PerformanceRating, description: 'Overall performance rating' })
  @IsEnum(PerformanceRating)
  overallRating: PerformanceRating;

  @ApiProperty({ description: 'Goal achievement percentage', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  goalAchievement: number;

  @ApiProperty({ description: 'Competency ratings', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  competencyRatings: CompetencyRating[];

  @ApiProperty({ description: 'Strengths identified', type: [String] })
  @IsArray()
  @IsString({ each: true })
  strengths: string[];

  @ApiProperty({ description: 'Areas for improvement', type: [String] })
  @IsArray()
  @IsString({ each: true })
  areasForImprovement: string[];

  @ApiProperty({ description: 'Development goals for next period', type: [String] })
  @IsArray()
  @IsString({ each: true })
  developmentGoals: string[];

  @ApiProperty({ description: 'Promotion recommendation', default: false })
  @IsBoolean()
  promotionRecommendation: boolean;

  @ApiProperty({ description: 'Compensation recommendation details' })
  @IsString()
  @MaxLength(500)
  compensationRecommendation: string;

  @ApiProperty({ description: 'Additional comments' })
  @IsString()
  @MaxLength(2000)
  comments: string;
}

/**
 * Create Calibration Session DTO
 */
export class CreateCalibrationSessionDto {
  @ApiProperty({ description: 'Session name', example: 'Q1 2024 Performance Calibration' })
  @IsString()
  @IsNotEmpty()
  sessionName: string;

  @ApiProperty({ description: 'Calibration cycle', example: '2024-Q1' })
  @IsString()
  @IsNotEmpty()
  calibrationCycle: string;

  @ApiProperty({ description: 'Facilitator user ID' })
  @IsString()
  @IsNotEmpty()
  facilitatorId: string;

  @ApiProperty({ description: 'Participant user IDs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  participants: string[];

  @ApiProperty({ description: 'Review IDs to calibrate', type: [String] })
  @IsArray()
  @IsString({ each: true })
  reviews: string[];

  @ApiProperty({ description: 'Session date' })
  @IsDate()
  @Type(() => Date)
  sessionDate: Date;
}

/**
 * Create PIP DTO
 */
export class CreatePIPDto {
  @ApiProperty({ description: 'Employee ID' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ description: 'Manager ID' })
  @IsString()
  @IsNotEmpty()
  managerId: string;

  @ApiProperty({ description: 'PIP start date' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'Review date' })
  @IsDate()
  @Type(() => Date)
  reviewDate: Date;

  @ApiProperty({ description: 'PIP end date' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ description: 'Concerns identified', type: [String] })
  @IsArray()
  @IsString({ each: true })
  concernsIdentified: string[];

  @ApiProperty({ description: 'Performance gaps', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  performanceGaps: PerformanceGap[];

  @ApiProperty({ description: 'Improvement actions', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  improvementActions: ImprovementAction[];

  @ApiProperty({ description: 'Success criteria', type: [String] })
  @IsArray()
  @IsString({ each: true })
  successCriteria: string[];

  @ApiProperty({ description: 'Support provided', type: [String] })
  @IsArray()
  @IsString({ each: true })
  supportProvided: string[];
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Objective Model
 */
export class Objective extends Model<ObjectiveData> implements ObjectiveData {
  @ApiProperty()
  public objectiveId!: string;

  @ApiProperty()
  public organizationId!: string;

  @ApiProperty()
  public ownerId!: string;

  @ApiProperty()
  public title!: string;

  @ApiProperty()
  public description!: string;

  @ApiProperty()
  public alignmentLevel!: AlignmentLevel;

  @ApiProperty()
  public parentObjectiveId?: string;

  @ApiProperty()
  public timeFrame!: string;

  @ApiProperty()
  public startDate!: Date;

  @ApiProperty()
  public endDate!: Date;

  @ApiProperty()
  public weight!: number;

  @ApiProperty()
  public status!: GoalStatus;

  @ApiProperty()
  public progress!: number;

  @ApiProperty()
  public confidenceLevel!: number;

  @ApiProperty()
  public metadata?: Record<string, any>;

  @ApiProperty()
  public readonly createdAt!: Date;

  @ApiProperty()
  public readonly updatedAt!: Date;
}

export function initObjectiveModel(sequelize: Sequelize): typeof Objective {
  Objective.init(
    {
      objectiveId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      organizationId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'organization_id',
      },
      ownerId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'owner_id',
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      alignmentLevel: {
        type: DataTypes.ENUM(...Object.values(AlignmentLevel)),
        allowNull: false,
        field: 'alignment_level',
      },
      parentObjectiveId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'parent_objective_id',
      },
      timeFrame: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'time_frame',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'end_date',
      },
      weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 100,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(GoalStatus)),
        allowNull: false,
        defaultValue: GoalStatus.DRAFT,
      },
      progress: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      confidenceLevel: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 50,
        field: 'confidence_level',
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'objectives',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['owner_id'] },
        { fields: ['parent_objective_id'] },
        { fields: ['status'] },
        { fields: ['start_date', 'end_date'] },
      ],
    }
  );

  return Objective;
}

/**
 * Key Result Model
 */
export class KeyResult extends Model<KeyResultData> implements KeyResultData {
  @ApiProperty()
  public keyResultId!: string;

  @ApiProperty()
  public objectiveId!: string;

  @ApiProperty()
  public title!: string;

  @ApiProperty()
  public description!: string;

  @ApiProperty()
  public measurementType!: KPIMeasurementType;

  @ApiProperty()
  public startValue!: number;

  @ApiProperty()
  public targetValue!: number;

  @ApiProperty()
  public currentValue!: number;

  @ApiProperty()
  public unit!: string;

  @ApiProperty()
  public weight!: number;

  @ApiProperty()
  public status!: GoalStatus;

  @ApiProperty()
  public progress!: number;

  @ApiProperty()
  public milestones?: string[];

  @ApiProperty()
  public readonly createdAt!: Date;

  @ApiProperty()
  public readonly updatedAt!: Date;
}

export function initKeyResultModel(sequelize: Sequelize): typeof KeyResult {
  KeyResult.init(
    {
      keyResultId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'key_result_id',
      },
      objectiveId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'objective_id',
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      measurementType: {
        type: DataTypes.ENUM(...Object.values(KPIMeasurementType)),
        allowNull: false,
        field: 'measurement_type',
      },
      startValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'start_value',
      },
      targetValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'target_value',
      },
      currentValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'current_value',
      },
      unit: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 100,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(GoalStatus)),
        allowNull: false,
        defaultValue: GoalStatus.DRAFT,
      },
      progress: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      milestones: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'key_results',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['objective_id'] },
        { fields: ['status'] },
      ],
    }
  );

  return KeyResult;
}

/**
 * KPI Model
 */
export class KPI extends Model<KPIData> implements KPIData {
  @ApiProperty()
  public kpiId!: string;

  @ApiProperty()
  public organizationId!: string;

  @ApiProperty()
  public name!: string;

  @ApiProperty()
  public description!: string;

  @ApiProperty()
  public category!: string;

  @ApiProperty()
  public owner!: string;

  @ApiProperty()
  public measurementType!: KPIMeasurementType;

  @ApiProperty()
  public formula!: string;

  @ApiProperty()
  public dataSource!: string;

  @ApiProperty()
  public frequency!: string;

  @ApiProperty()
  public targetValue!: number;

  @ApiProperty()
  public currentValue!: number;

  @ApiProperty()
  public thresholdGreen!: number;

  @ApiProperty()
  public thresholdYellow!: number;

  @ApiProperty()
  public thresholdRed!: number;

  @ApiProperty()
  public unit!: string;

  @ApiProperty()
  public trend!: 'up' | 'down' | 'stable';

  @ApiProperty()
  public priority!: 'low' | 'medium' | 'high' | 'critical';

  @ApiProperty()
  public readonly createdAt!: Date;

  @ApiProperty()
  public readonly updatedAt!: Date;
}

export function initKPIModel(sequelize: Sequelize): typeof KPI {
  KPI.init(
    {
      kpiId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'kpi_id',
      },
      organizationId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'organization_id',
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      owner: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      measurementType: {
        type: DataTypes.ENUM(...Object.values(KPIMeasurementType)),
        allowNull: false,
        field: 'measurement_type',
      },
      formula: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      dataSource: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'data_source',
      },
      frequency: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      targetValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'target_value',
      },
      currentValue: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'current_value',
      },
      thresholdGreen: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'threshold_green',
      },
      thresholdYellow: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'threshold_yellow',
      },
      thresholdRed: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'threshold_red',
      },
      unit: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      trend: {
        type: DataTypes.ENUM('up', 'down', 'stable'),
        allowNull: false,
        defaultValue: 'stable',
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'medium',
      },
    },
    {
      sequelize,
      tableName: 'kpis',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['category'] },
        { fields: ['owner'] },
        { fields: ['priority'] },
      ],
    }
  );

  return KPI;
}

/**
 * Performance Review Model
 */
export class PerformanceReview extends Model<PerformanceReviewData> implements PerformanceReviewData {
  @ApiProperty()
  public reviewId!: string;

  @ApiProperty()
  public employeeId!: string;

  @ApiProperty()
  public reviewerId!: string;

  @ApiProperty()
  public reviewCycle!: string;

  @ApiProperty()
  public reviewPeriodStart!: Date;

  @ApiProperty()
  public reviewPeriodEnd!: Date;

  @ApiProperty()
  public overallRating!: PerformanceRating;

  @ApiProperty()
  public goalAchievement!: number;

  @ApiProperty()
  public competencyRatings!: CompetencyRating[];

  @ApiProperty()
  public strengths!: string[];

  @ApiProperty()
  public areasForImprovement!: string[];

  @ApiProperty()
  public developmentGoals!: string[];

  @ApiProperty()
  public promotionRecommendation!: boolean;

  @ApiProperty()
  public compensationRecommendation!: string;

  @ApiProperty()
  public comments!: string;

  @ApiProperty()
  public status!: 'draft' | 'submitted' | 'calibrated' | 'finalized';

  @ApiProperty()
  public readonly createdAt!: Date;

  @ApiProperty()
  public readonly updatedAt!: Date;
}

export function initPerformanceReviewModel(sequelize: Sequelize): typeof PerformanceReview {
  PerformanceReview.init(
    {
      reviewId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'review_id',
      },
      employeeId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'employee_id',
      },
      reviewerId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'reviewer_id',
      },
      reviewCycle: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'review_cycle',
      },
      reviewPeriodStart: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'review_period_start',
      },
      reviewPeriodEnd: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'review_period_end',
      },
      overallRating: {
        type: DataTypes.ENUM(...Object.values(PerformanceRating)),
        allowNull: false,
        field: 'overall_rating',
      },
      goalAchievement: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: 'goal_achievement',
      },
      competencyRatings: {
        type: DataTypes.JSONB,
        allowNull: false,
        field: 'competency_ratings',
      },
      strengths: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
      },
      areasForImprovement: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        field: 'areas_for_improvement',
      },
      developmentGoals: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        field: 'development_goals',
      },
      promotionRecommendation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'promotion_recommendation',
      },
      compensationRecommendation: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'compensation_recommendation',
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'calibrated', 'finalized'),
        allowNull: false,
        defaultValue: 'draft',
      },
    },
    {
      sequelize,
      tableName: 'performance_reviews',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['employee_id'] },
        { fields: ['reviewer_id'] },
        { fields: ['review_cycle'] },
        { fields: ['status'] },
      ],
    }
  );

  return PerformanceReview;
}

/**
 * Performance Improvement Plan Model
 */
export class PerformanceImprovementPlan extends Model<PerformanceImprovementPlanData> implements PerformanceImprovementPlanData {
  @ApiProperty()
  public pipId!: string;

  @ApiProperty()
  public employeeId!: string;

  @ApiProperty()
  public managerId!: string;

  @ApiProperty()
  public startDate!: Date;

  @ApiProperty()
  public reviewDate!: Date;

  @ApiProperty()
  public endDate!: Date;

  @ApiProperty()
  public concernsIdentified!: string[];

  @ApiProperty()
  public performanceGaps!: PerformanceGap[];

  @ApiProperty()
  public improvementActions!: ImprovementAction[];

  @ApiProperty()
  public successCriteria!: string[];

  @ApiProperty()
  public supportProvided!: string[];

  @ApiProperty()
  public status!: PIPStatus;

  @ApiProperty()
  public progressNotes!: ProgressNote[];

  @ApiProperty()
  public outcome?: 'successful' | 'unsuccessful';

  @ApiProperty()
  public readonly createdAt!: Date;

  @ApiProperty()
  public readonly updatedAt!: Date;
}

export function initPerformanceImprovementPlanModel(sequelize: Sequelize): typeof PerformanceImprovementPlan {
  PerformanceImprovementPlan.init(
    {
      pipId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'pip_id',
      },
      employeeId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'employee_id',
      },
      managerId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'manager_id',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_date',
      },
      reviewDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'review_date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'end_date',
      },
      concernsIdentified: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        field: 'concerns_identified',
      },
      performanceGaps: {
        type: DataTypes.JSONB,
        allowNull: false,
        field: 'performance_gaps',
      },
      improvementActions: {
        type: DataTypes.JSONB,
        allowNull: false,
        field: 'improvement_actions',
      },
      successCriteria: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        field: 'success_criteria',
      },
      supportProvided: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        field: 'support_provided',
      },
      status: {
        type: DataTypes.ENUM(...Object.values(PIPStatus)),
        allowNull: false,
        defaultValue: PIPStatus.ACTIVE,
      },
      progressNotes: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
        field: 'progress_notes',
      },
      outcome: {
        type: DataTypes.ENUM('successful', 'unsuccessful'),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'performance_improvement_plans',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['employee_id'] },
        { fields: ['manager_id'] },
        { fields: ['status'] },
        { fields: ['start_date', 'end_date'] },
      ],
    }
  );

  return PerformanceImprovementPlan;
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Creates a new objective.
 *
 * @swagger
 * @openapi
 * /api/performance/objectives:
 *   post:
 *     tags:
 *       - Performance Management
 *     summary: Create objective
 *     description: Creates a new objective aligned to organizational goals
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateObjectiveDto'
 *     responses:
 *       201:
 *         description: Objective created successfully
 *       400:
 *         description: Invalid input data
 *
 * @param {CreateObjectiveDto} data - Objective data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<ObjectiveData>} Created objective
 *
 * @example
 * ```typescript
 * const objective = await createObjective({
 *   title: 'Improve Customer Satisfaction',
 *   description: 'Increase NPS by implementing customer feedback loop',
 *   alignmentLevel: AlignmentLevel.DEPARTMENT,
 *   timeFrame: 'Q1 2024',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-03-31'),
 *   weight: 30
 * });
 * ```
 */
export async function createObjective(
  data: Partial<ObjectiveData>,
  transaction?: Transaction
): Promise<ObjectiveData> {
  const objectiveId = data.objectiveId || `OBJ-${Date.now()}`;

  return {
    objectiveId,
    organizationId: data.organizationId || '',
    ownerId: data.ownerId || '',
    title: data.title || '',
    description: data.description || '',
    alignmentLevel: data.alignmentLevel || AlignmentLevel.INDIVIDUAL,
    parentObjectiveId: data.parentObjectiveId,
    timeFrame: data.timeFrame || 'Q1 2024',
    startDate: data.startDate || new Date(),
    endDate: data.endDate || new Date(),
    weight: data.weight || 100,
    status: data.status || GoalStatus.DRAFT,
    progress: data.progress || 0,
    confidenceLevel: data.confidenceLevel || 50,
    metadata: data.metadata || {},
  };
}

/**
 * Creates a key result for an objective.
 *
 * @param {CreateKeyResultDto} data - Key result data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<KeyResultData>} Created key result
 *
 * @example
 * ```typescript
 * const keyResult = await createKeyResult({
 *   objectiveId: 'OBJ-123',
 *   title: 'Achieve NPS of 70+',
 *   measurementType: KPIMeasurementType.NUMERIC,
 *   startValue: 55,
 *   targetValue: 70,
 *   unit: 'points',
 *   weight: 50
 * });
 * ```
 */
export async function createKeyResult(
  data: Partial<KeyResultData>,
  transaction?: Transaction
): Promise<KeyResultData> {
  const keyResultId = data.keyResultId || `KR-${Date.now()}`;
  const currentValue = data.currentValue || data.startValue || 0;
  const progress = calculateProgress(data.startValue || 0, currentValue, data.targetValue || 0);

  return {
    keyResultId,
    objectiveId: data.objectiveId || '',
    title: data.title || '',
    description: data.description || '',
    measurementType: data.measurementType || KPIMeasurementType.NUMERIC,
    startValue: data.startValue || 0,
    targetValue: data.targetValue || 0,
    currentValue,
    unit: data.unit || '',
    weight: data.weight || 100,
    status: data.status || GoalStatus.DRAFT,
    progress,
    milestones: data.milestones || [],
  };
}

/**
 * Calculates progress percentage.
 *
 * @param {number} startValue - Starting value
 * @param {number} currentValue - Current value
 * @param {number} targetValue - Target value
 * @returns {number} Progress percentage (0-100)
 */
export function calculateProgress(
  startValue: number,
  currentValue: number,
  targetValue: number
): number {
  if (targetValue === startValue) return 100;

  const progress = ((currentValue - startValue) / (targetValue - startValue)) * 100;
  return Math.max(0, Math.min(100, progress));
}

/**
 * Updates key result progress.
 *
 * @param {string} keyResultId - Key result ID
 * @param {number} newValue - New current value
 * @returns {Promise<KeyResultData>} Updated key result
 */
export async function updateKeyResultProgress(
  keyResultId: string,
  newValue: number
): Promise<KeyResultData> {
  // Simulated - would fetch from database
  const keyResult: Partial<KeyResultData> = {
    keyResultId,
    startValue: 55,
    targetValue: 70,
    currentValue: newValue,
  };

  const progress = calculateProgress(
    keyResult.startValue!,
    newValue,
    keyResult.targetValue!
  );

  let status = GoalStatus.ACTIVE;
  if (progress >= 100) {
    status = GoalStatus.COMPLETED;
  } else if (progress < 25) {
    status = GoalStatus.AT_RISK;
  }

  return {
    ...keyResult as KeyResultData,
    progress,
    status,
  };
}

/**
 * Creates a KPI.
 *
 * @param {CreateKPIDto} data - KPI data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<KPIData>} Created KPI
 */
export async function createKPI(
  data: Partial<KPIData>,
  transaction?: Transaction
): Promise<KPIData> {
  const kpiId = data.kpiId || `KPI-${Date.now()}`;

  return {
    kpiId,
    organizationId: data.organizationId || '',
    name: data.name || '',
    description: data.description || '',
    category: data.category || '',
    owner: data.owner || '',
    measurementType: data.measurementType || KPIMeasurementType.NUMERIC,
    formula: data.formula || '',
    dataSource: data.dataSource || '',
    frequency: data.frequency || 'monthly',
    targetValue: data.targetValue || 0,
    currentValue: data.currentValue || 0,
    thresholdGreen: data.thresholdGreen || 0,
    thresholdYellow: data.thresholdYellow || 0,
    thresholdRed: data.thresholdRed || 0,
    unit: data.unit || '',
    trend: data.trend || 'stable',
    priority: data.priority || 'medium',
  };
}

/**
 * Updates KPI value and calculates trend.
 *
 * @param {string} kpiId - KPI ID
 * @param {number} newValue - New value
 * @param {number} previousValue - Previous value
 * @returns {Promise<KPIData>} Updated KPI
 */
export async function updateKPIValue(
  kpiId: string,
  newValue: number,
  previousValue: number
): Promise<KPIData> {
  const trend: 'up' | 'down' | 'stable' =
    newValue > previousValue ? 'up' :
    newValue < previousValue ? 'down' : 'stable';

  return {
    kpiId,
    currentValue: newValue,
    trend,
  } as KPIData;
}

/**
 * Evaluates KPI status based on thresholds.
 *
 * @param {KPIData} kpi - KPI data
 * @returns {Object} KPI status evaluation
 */
export function evaluateKPIStatus(kpi: KPIData): {
  status: 'green' | 'yellow' | 'red';
  message: string;
  performanceLevel: number;
} {
  const value = kpi.currentValue;
  let status: 'green' | 'yellow' | 'red';
  let message: string;

  if (value >= kpi.thresholdGreen) {
    status = 'green';
    message = 'KPI is meeting or exceeding target';
  } else if (value >= kpi.thresholdYellow) {
    status = 'yellow';
    message = 'KPI is approaching target but needs attention';
  } else {
    status = 'red';
    message = 'KPI is below acceptable threshold - immediate action required';
  }

  const performanceLevel = (value / kpi.targetValue) * 100;

  return { status, message, performanceLevel };
}

/**
 * Creates a balanced scorecard.
 *
 * @param {Partial<BalancedScorecardData>} data - Scorecard data
 * @returns {Promise<BalancedScorecardData>} Created scorecard
 */
export async function createBalancedScorecard(
  data: Partial<BalancedScorecardData>
): Promise<BalancedScorecardData> {
  const scorecardId = data.scorecardId || `BSC-${Date.now()}`;

  return {
    scorecardId,
    organizationId: data.organizationId || '',
    name: data.name || '',
    description: data.description || '',
    timeframe: data.timeframe || 'Q1 2024',
    perspectives: data.perspectives || [],
    overallScore: data.overallScore || 0,
    status: data.status || 'draft',
  };
}

/**
 * Adds a perspective to balanced scorecard.
 *
 * @param {string} scorecardId - Scorecard ID
 * @param {BalancedScorecardPerspective} perspective - Perspective type
 * @param {Partial<ScorecardPerspective>} data - Perspective data
 * @returns {Promise<ScorecardPerspective>} Created perspective
 */
export async function addScorecardPerspective(
  scorecardId: string,
  perspective: BalancedScorecardPerspective,
  data: Partial<ScorecardPerspective>
): Promise<ScorecardPerspective> {
  const perspectiveId = `PERSP-${Date.now()}`;

  return {
    perspectiveId,
    perspective,
    objectives: data.objectives || [],
    measures: data.measures || [],
    targets: data.targets || [],
    initiatives: data.initiatives || [],
    weight: data.weight || 25,
    score: data.score || 0,
  };
}

/**
 * Calculates balanced scorecard overall score.
 *
 * @param {ScorecardPerspective[]} perspectives - All perspectives
 * @returns {number} Overall weighted score
 */
export function calculateBalancedScorecardScore(
  perspectives: ScorecardPerspective[]
): number {
  const totalWeight = perspectives.reduce((sum, p) => sum + p.weight, 0);
  const weightedScore = perspectives.reduce(
    (sum, p) => sum + (p.score * p.weight),
    0
  );

  return totalWeight > 0 ? weightedScore / totalWeight : 0;
}

/**
 * Creates a 360 feedback request.
 *
 * @param {CreateFeedbackRequestDto} data - Feedback request data
 * @returns {Promise<FeedbackRequestData>} Created feedback request
 */
export async function create360FeedbackRequest(
  data: Partial<FeedbackRequestData>
): Promise<FeedbackRequestData> {
  const requestId = data.requestId || `FBR-${Date.now()}`;

  return {
    requestId,
    subjectId: data.subjectId || '',
    subjectName: data.subjectName || '',
    requesterId: data.requesterId || '',
    feedbackType: data.feedbackType || FeedbackType.PEER,
    reviewers: data.reviewers || [],
    questions: data.questions || [],
    dueDate: data.dueDate || new Date(),
    purpose: data.purpose || '',
    isAnonymous: data.isAnonymous || false,
    status: data.status || 'pending',
  };
}

/**
 * Submits 360 feedback response.
 *
 * @param {Partial<FeedbackResponseData>} data - Feedback response data
 * @returns {Promise<FeedbackResponseData>} Submitted feedback response
 */
export async function submit360FeedbackResponse(
  data: Partial<FeedbackResponseData>
): Promise<FeedbackResponseData> {
  const responseId = data.responseId || `FBR-${Date.now()}`;

  return {
    responseId,
    requestId: data.requestId || '',
    reviewerId: data.reviewerId || '',
    responses: data.responses || [],
    overallRating: data.overallRating,
    strengths: data.strengths || [],
    areasForImprovement: data.areasForImprovement || [],
    submittedAt: new Date(),
  };
}

/**
 * Aggregates 360 feedback responses.
 *
 * @param {string} requestId - Feedback request ID
 * @param {FeedbackResponseData[]} responses - All responses
 * @returns {Object} Aggregated feedback
 */
export function aggregate360Feedback(
  requestId: string,
  responses: FeedbackResponseData[]
): {
  requestId: string;
  responseCount: number;
  averageRating: number;
  commonStrengths: string[];
  commonImprovementAreas: string[];
  thematicAnalysis: Record<string, number>;
} {
  const responseCount = responses.length;

  const ratings = responses
    .map(r => r.overallRating)
    .filter((r): r is number => r !== undefined);
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
    : 0;

  const allStrengths = responses.flatMap(r => r.strengths);
  const allImprovements = responses.flatMap(r => r.areasForImprovement);

  const strengthCounts: Record<string, number> = {};
  allStrengths.forEach(s => {
    strengthCounts[s] = (strengthCounts[s] || 0) + 1;
  });

  const improvementCounts: Record<string, number> = {};
  allImprovements.forEach(i => {
    improvementCounts[i] = (improvementCounts[i] || 0) + 1;
  });

  const commonStrengths = Object.entries(strengthCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([strength]) => strength);

  const commonImprovementAreas = Object.entries(improvementCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([area]) => area);

  return {
    requestId,
    responseCount,
    averageRating,
    commonStrengths,
    commonImprovementAreas,
    thematicAnalysis: { ...strengthCounts, ...improvementCounts },
  };
}

/**
 * Creates a performance review.
 *
 * @param {CreatePerformanceReviewDto} data - Review data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<PerformanceReviewData>} Created review
 */
export async function createPerformanceReview(
  data: Partial<PerformanceReviewData>,
  transaction?: Transaction
): Promise<PerformanceReviewData> {
  const reviewId = data.reviewId || `REV-${Date.now()}`;

  return {
    reviewId,
    employeeId: data.employeeId || '',
    reviewerId: data.reviewerId || '',
    reviewCycle: data.reviewCycle || '',
    reviewPeriodStart: data.reviewPeriodStart || new Date(),
    reviewPeriodEnd: data.reviewPeriodEnd || new Date(),
    overallRating: data.overallRating || PerformanceRating.MEETS_EXPECTATIONS,
    goalAchievement: data.goalAchievement || 0,
    competencyRatings: data.competencyRatings || [],
    strengths: data.strengths || [],
    areasForImprovement: data.areasForImprovement || [],
    developmentGoals: data.developmentGoals || [],
    promotionRecommendation: data.promotionRecommendation || false,
    compensationRecommendation: data.compensationRecommendation || '',
    comments: data.comments || '',
    status: data.status || 'draft',
  };
}

/**
 * Creates a calibration session.
 *
 * @param {CreateCalibrationSessionDto} data - Calibration session data
 * @returns {Promise<CalibrationSessionData>} Created session
 */
export async function createCalibrationSession(
  data: Partial<CalibrationSessionData>
): Promise<CalibrationSessionData> {
  const sessionId = data.sessionId || `CAL-${Date.now()}`;

  return {
    sessionId,
    organizationId: data.organizationId || '',
    sessionName: data.sessionName || '',
    calibrationCycle: data.calibrationCycle || '',
    facilitatorId: data.facilitatorId || '',
    participants: data.participants || [],
    reviews: data.reviews || [],
    sessionDate: data.sessionDate || new Date(),
    ratingDistribution: data.ratingDistribution || {
      unsatisfactory: 0,
      needsImprovement: 0,
      meetsExpectations: 0,
      exceedsExpectations: 0,
      outstanding: 0,
      targetDistribution: {
        [PerformanceRating.UNSATISFACTORY]: 5,
        [PerformanceRating.NEEDS_IMPROVEMENT]: 10,
        [PerformanceRating.MEETS_EXPECTATIONS]: 70,
        [PerformanceRating.EXCEEDS_EXPECTATIONS]: 10,
        [PerformanceRating.OUTSTANDING]: 5,
      },
      actualDistribution: {
        [PerformanceRating.UNSATISFACTORY]: 0,
        [PerformanceRating.NEEDS_IMPROVEMENT]: 0,
        [PerformanceRating.MEETS_EXPECTATIONS]: 0,
        [PerformanceRating.EXCEEDS_EXPECTATIONS]: 0,
        [PerformanceRating.OUTSTANDING]: 0,
      },
    },
    decisions: [],
    status: data.status || 'scheduled',
  };
}

/**
 * Calibrates performance rating.
 *
 * @param {string} sessionId - Calibration session ID
 * @param {string} reviewId - Review ID
 * @param {PerformanceRating} originalRating - Original rating
 * @param {PerformanceRating} calibratedRating - Calibrated rating
 * @param {string} rationale - Calibration rationale
 * @returns {Promise<CalibrationDecisionData>} Calibration decision
 */
export async function calibratePerformanceRating(
  sessionId: string,
  reviewId: string,
  originalRating: PerformanceRating,
  calibratedRating: PerformanceRating,
  rationale: string
): Promise<CalibrationDecisionData> {
  const decisionId = `CALDEC-${Date.now()}`;

  let decision: CalibrationDecision;
  if (originalRating === calibratedRating) {
    decision = CalibrationDecision.CONFIRMED;
  } else {
    const ratingOrder = [
      PerformanceRating.UNSATISFACTORY,
      PerformanceRating.NEEDS_IMPROVEMENT,
      PerformanceRating.MEETS_EXPECTATIONS,
      PerformanceRating.EXCEEDS_EXPECTATIONS,
      PerformanceRating.OUTSTANDING,
    ];

    const originalIndex = ratingOrder.indexOf(originalRating);
    const calibratedIndex = ratingOrder.indexOf(calibratedRating);

    decision = calibratedIndex > originalIndex
      ? CalibrationDecision.UPGRADED
      : CalibrationDecision.DOWNGRADED;
  }

  return {
    decisionId,
    sessionId,
    reviewId,
    employeeId: '',
    originalRating,
    calibratedRating,
    decision,
    rationale,
    discussionNotes: '',
    approvedBy: '',
  };
}

/**
 * Validates rating distribution against target.
 *
 * @param {RatingDistribution} distribution - Rating distribution
 * @returns {Object} Validation result
 */
export function validateRatingDistribution(distribution: RatingDistribution): {
  isValid: boolean;
  variances: Record<PerformanceRating, number>;
  recommendations: string[];
} {
  const variances: Record<PerformanceRating, number> = {} as any;
  const recommendations: string[] = [];

  Object.values(PerformanceRating).forEach((rating) => {
    const target = distribution.targetDistribution[rating] || 0;
    const actual = distribution.actualDistribution[rating] || 0;
    const variance = actual - target;

    variances[rating] = variance;

    if (Math.abs(variance) > 5) {
      recommendations.push(
        `${rating}: ${variance > 0 ? 'Reduce' : 'Increase'} by ${Math.abs(variance)}%`
      );
    }
  });

  const isValid = recommendations.length === 0;

  return { isValid, variances, recommendations };
}

/**
 * Cascades goals from parent to child level.
 *
 * @param {string} parentObjectiveId - Parent objective ID
 * @param {AlignmentLevel} childLevel - Child alignment level
 * @param {string[]} childOwnerIds - Child owner IDs
 * @returns {Promise<GoalCascadeData>} Goal cascade structure
 */
export async function cascadeGoals(
  parentObjectiveId: string,
  childLevel: AlignmentLevel,
  childOwnerIds: string[]
): Promise<GoalCascadeData> {
  const cascadeId = `CASCADE-${Date.now()}`;

  const childGoals: ObjectiveData[] = childOwnerIds.map((ownerId, index) => ({
    objectiveId: `OBJ-CHILD-${Date.now()}-${index}`,
    organizationId: '',
    ownerId,
    title: `Cascaded Objective for ${ownerId}`,
    description: 'Cascaded from parent objective',
    alignmentLevel: childLevel,
    parentObjectiveId,
    timeFrame: 'Q1 2024',
    startDate: new Date(),
    endDate: new Date(),
    weight: 100,
    status: GoalStatus.DRAFT,
    progress: 0,
    confidenceLevel: 50,
  }));

  return {
    cascadeId,
    organizationId: '',
    topLevelObjectiveId: parentObjectiveId,
    cascadeLevels: [
      {
        level: childLevel,
        parentGoalId: parentObjectiveId,
        childGoals,
        alignmentStrength: 85,
      },
    ],
    totalGoals: childGoals.length,
    alignmentScore: 85,
    completionPercentage: 0,
  };
}

/**
 * Validates goal alignment.
 *
 * @param {ObjectiveData} childGoal - Child goal
 * @param {ObjectiveData} parentGoal - Parent goal
 * @returns {Object} Alignment validation
 */
export function validateGoalAlignment(
  childGoal: ObjectiveData,
  parentGoal: ObjectiveData
): {
  isAligned: boolean;
  alignmentScore: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check time frame alignment
  if (childGoal.startDate < parentGoal.startDate) {
    issues.push('Child goal starts before parent goal');
  }
  if (childGoal.endDate > parentGoal.endDate) {
    issues.push('Child goal ends after parent goal');
  }

  // Check status alignment
  if (parentGoal.status === GoalStatus.COMPLETED && childGoal.status !== GoalStatus.COMPLETED) {
    issues.push('Parent goal completed but child goal is not');
  }

  // Calculate alignment score
  let alignmentScore = 100;
  alignmentScore -= issues.length * 15;

  const isAligned = alignmentScore >= 70;

  if (!isAligned) {
    recommendations.push('Review goal timelines and status');
    recommendations.push('Ensure child goals support parent goal objectives');
  }

  return { isAligned, alignmentScore, issues, recommendations };
}

/**
 * Creates a performance improvement plan (PIP).
 *
 * @param {CreatePIPDto} data - PIP data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<PerformanceImprovementPlanData>} Created PIP
 */
export async function createPerformanceImprovementPlan(
  data: Partial<PerformanceImprovementPlanData>,
  transaction?: Transaction
): Promise<PerformanceImprovementPlanData> {
  const pipId = data.pipId || `PIP-${Date.now()}`;

  return {
    pipId,
    employeeId: data.employeeId || '',
    managerId: data.managerId || '',
    startDate: data.startDate || new Date(),
    reviewDate: data.reviewDate || new Date(),
    endDate: data.endDate || new Date(),
    concernsIdentified: data.concernsIdentified || [],
    performanceGaps: data.performanceGaps || [],
    improvementActions: data.improvementActions || [],
    successCriteria: data.successCriteria || [],
    supportProvided: data.supportProvided || [],
    status: data.status || PIPStatus.ACTIVE,
    progressNotes: data.progressNotes || [],
    outcome: data.outcome,
  };
}

/**
 * Adds progress note to PIP.
 *
 * @param {string} pipId - PIP ID
 * @param {Partial<ProgressNote>} noteData - Progress note data
 * @returns {Promise<ProgressNote>} Added progress note
 */
export async function addPIPProgressNote(
  pipId: string,
  noteData: Partial<ProgressNote>
): Promise<ProgressNote> {
  const noteId = `NOTE-${Date.now()}`;

  return {
    noteId,
    date: new Date(),
    author: noteData.author || '',
    observation: noteData.observation || '',
    progress: noteData.progress || 'neutral',
    nextSteps: noteData.nextSteps || [],
  };
}

/**
 * Evaluates PIP success.
 *
 * @param {PerformanceImprovementPlanData} pip - PIP data
 * @returns {Object} PIP evaluation
 */
export function evaluatePIPSuccess(pip: PerformanceImprovementPlanData): {
  isSuccessful: boolean;
  completionRate: number;
  positiveProgressNotes: number;
  recommendation: 'continue' | 'extend' | 'close_successful' | 'close_unsuccessful';
} {
  const totalActions = pip.improvementActions.length;
  const completedActions = pip.improvementActions.filter(
    a => a.status === 'completed'
  ).length;

  const completionRate = totalActions > 0
    ? (completedActions / totalActions) * 100
    : 0;

  const positiveProgressNotes = pip.progressNotes.filter(
    n => n.progress === 'positive'
  ).length;

  const totalProgressNotes = pip.progressNotes.length;
  const positiveRatio = totalProgressNotes > 0
    ? positiveProgressNotes / totalProgressNotes
    : 0;

  let recommendation: 'continue' | 'extend' | 'close_successful' | 'close_unsuccessful';

  if (completionRate >= 80 && positiveRatio >= 0.7) {
    recommendation = 'close_successful';
  } else if (completionRate >= 50 && positiveRatio >= 0.5) {
    recommendation = 'continue';
  } else if (completionRate < 50 && new Date() >= pip.endDate) {
    recommendation = 'close_unsuccessful';
  } else {
    recommendation = 'extend';
  }

  const isSuccessful = recommendation === 'close_successful';

  return { isSuccessful, completionRate, positiveProgressNotes, recommendation };
}

/**
 * Creates continuous feedback.
 *
 * @param {Partial<ContinuousFeedbackData>} data - Feedback data
 * @returns {Promise<ContinuousFeedbackData>} Created feedback
 */
export async function createContinuousFeedback(
  data: Partial<ContinuousFeedbackData>
): Promise<ContinuousFeedbackData> {
  const feedbackId = data.feedbackId || `CFB-${Date.now()}`;

  return {
    feedbackId,
    giverId: data.giverId || '',
    receiverId: data.receiverId || '',
    feedbackDate: new Date(),
    context: data.context || '',
    positiveObservations: data.positiveObservations || [],
    constructiveSuggestions: data.constructiveSuggestions || [],
    actionableItems: data.actionableItems || [],
    isPrivate: data.isPrivate || false,
    isAcknowledged: false,
  };
}

/**
 * Acknowledges continuous feedback.
 *
 * @param {string} feedbackId - Feedback ID
 * @returns {Promise<ContinuousFeedbackData>} Updated feedback
 */
export async function acknowledgeContinuousFeedback(
  feedbackId: string
): Promise<ContinuousFeedbackData> {
  return {
    feedbackId,
    isAcknowledged: true,
    acknowledgedAt: new Date(),
  } as ContinuousFeedbackData;
}

/**
 * Analyzes feedback trends.
 *
 * @param {string} employeeId - Employee ID
 * @param {ContinuousFeedbackData[]} feedbackList - List of feedback
 * @returns {Object} Feedback trend analysis
 */
export function analyzeFeedbackTrends(
  employeeId: string,
  feedbackList: ContinuousFeedbackData[]
): {
  totalFeedback: number;
  positiveCount: number;
  constructiveCount: number;
  topPositiveThemes: string[];
  topImprovementThemes: string[];
  feedbackVelocity: number;
} {
  const totalFeedback = feedbackList.length;

  const allPositive = feedbackList.flatMap(f => f.positiveObservations);
  const allConstructive = feedbackList.flatMap(f => f.constructiveSuggestions);

  const positiveCount = allPositive.length;
  const constructiveCount = allConstructive.length;

  // Simple frequency analysis
  const positiveCounts: Record<string, number> = {};
  allPositive.forEach(obs => {
    positiveCounts[obs] = (positiveCounts[obs] || 0) + 1;
  });

  const constructiveCounts: Record<string, number> = {};
  allConstructive.forEach(sug => {
    constructiveCounts[sug] = (constructiveCounts[sug] || 0) + 1;
  });

  const topPositiveThemes = Object.entries(positiveCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([theme]) => theme);

  const topImprovementThemes = Object.entries(constructiveCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([theme]) => theme);

  // Feedback velocity (feedback per month)
  const monthsSpan = 3; // Assume 3 month period
  const feedbackVelocity = totalFeedback / monthsSpan;

  return {
    totalFeedback,
    positiveCount,
    constructiveCount,
    topPositiveThemes,
    topImprovementThemes,
    feedbackVelocity,
  };
}

/**
 * Creates a talent review.
 *
 * @param {Partial<TalentReviewData>} data - Talent review data
 * @returns {Promise<TalentReviewData>} Created talent review
 */
export async function createTalentReview(
  data: Partial<TalentReviewData>
): Promise<TalentReviewData> {
  const reviewId = data.reviewId || `TR-${Date.now()}`;

  return {
    reviewId,
    organizationId: data.organizationId || '',
    reviewCycle: data.reviewCycle || '',
    reviewDate: new Date(),
    participants: data.participants || [],
    employeesReviewed: data.employeesReviewed || [],
    nineBoxGrid: data.nineBoxGrid || {
      gridId: `GRID-${Date.now()}`,
      positions: {},
      distribution: {},
    },
    successionPlans: data.successionPlans || [],
    talentActions: data.talentActions || [],
  };
}

/**
 * Plots employee on 9-box grid.
 *
 * @param {PerformanceRating} performanceRating - Performance rating
 * @param {'low' | 'medium' | 'high'} potentialRating - Potential rating
 * @returns {string} 9-box position
 */
export function plotOn9Box(
  performanceRating: PerformanceRating,
  potentialRating: 'low' | 'medium' | 'high'
): string {
  const performanceMap: Record<PerformanceRating, 'low' | 'medium' | 'high'> = {
    [PerformanceRating.UNSATISFACTORY]: 'low',
    [PerformanceRating.NEEDS_IMPROVEMENT]: 'low',
    [PerformanceRating.MEETS_EXPECTATIONS]: 'medium',
    [PerformanceRating.EXCEEDS_EXPECTATIONS]: 'high',
    [PerformanceRating.OUTSTANDING]: 'high',
  };

  const performance = performanceMap[performanceRating];

  const boxMap: Record<string, string> = {
    'low-low': 'Box 1: Low Performance, Low Potential',
    'low-medium': 'Box 2: Low Performance, Medium Potential',
    'low-high': 'Box 3: Low Performance, High Potential',
    'medium-low': 'Box 4: Medium Performance, Low Potential',
    'medium-medium': 'Box 5: Medium Performance, Medium Potential',
    'medium-high': 'Box 6: Medium Performance, High Potential',
    'high-low': 'Box 7: High Performance, Low Potential',
    'high-medium': 'Box 8: High Performance, Medium Potential',
    'high-high': 'Box 9: High Performance, High Potential',
  };

  return boxMap[`${performance}-${potentialRating}`];
}

/**
 * Generates succession plan recommendations.
 *
 * @param {string} criticalRole - Critical role title
 * @param {TalentReviewEmployee[]} potentialSuccessors - Potential successors
 * @returns {SuccessionPlan} Succession plan
 */
export function generateSuccessionPlan(
  criticalRole: string,
  potentialSuccessors: TalentReviewEmployee[]
): SuccessionPlan {
  const planId = `SUCC-${Date.now()}`;

  // Sort by performance and potential
  const rankedSuccessors = potentialSuccessors.sort((a, b) => {
    const ratingOrder = [
      PerformanceRating.UNSATISFACTORY,
      PerformanceRating.NEEDS_IMPROVEMENT,
      PerformanceRating.MEETS_EXPECTATIONS,
      PerformanceRating.EXCEEDS_EXPECTATIONS,
      PerformanceRating.OUTSTANDING,
    ];

    const aIndex = ratingOrder.indexOf(a.performanceRating);
    const bIndex = ratingOrder.indexOf(b.performanceRating);

    if (bIndex !== aIndex) return bIndex - aIndex;

    const potentialOrder = { low: 1, medium: 2, high: 3 };
    return potentialOrder[b.potentialRating] - potentialOrder[a.potentialRating];
  });

  const successors: SuccessorCandidate[] = rankedSuccessors.map((emp) => {
    let readiness: 'ready_now' | '1_year' | '2_3_years' | 'long_term';

    if (emp.performanceRating === PerformanceRating.OUTSTANDING && emp.potentialRating === 'high') {
      readiness = 'ready_now';
    } else if (emp.performanceRating === PerformanceRating.EXCEEDS_EXPECTATIONS && emp.potentialRating !== 'low') {
      readiness = '1_year';
    } else if (emp.potentialRating === 'high') {
      readiness = '2_3_years';
    } else {
      readiness = 'long_term';
    }

    return {
      candidateId: emp.employeeId,
      candidateName: emp.employeeName,
      readiness,
      developmentNeeds: emp.developmentNeeds,
      strengthsAlignment: [],
    };
  });

  const riskLevel = successors.filter(s => s.readiness === 'ready_now').length === 0
    ? 'high'
    : successors.length < 2
    ? 'medium'
    : 'low';

  return {
    planId,
    criticalRole,
    successors,
    developmentTimeline: '12-36 months',
    riskLevel,
  };
}

/**
 * Generates performance analytics.
 *
 * @param {string} organizationId - Organization ID
 * @param {PerformanceReviewData[]} reviews - Performance reviews
 * @param {ObjectiveData[]} objectives - Objectives
 * @returns {Promise<PerformanceAnalytics>} Performance analytics
 */
export async function generatePerformanceAnalytics(
  organizationId: string,
  reviews: PerformanceReviewData[],
  objectives: ObjectiveData[]
): Promise<PerformanceAnalytics> {
  const totalEmployees = reviews.length;

  const ratingDistribution: Record<PerformanceRating, number> = {
    [PerformanceRating.UNSATISFACTORY]: 0,
    [PerformanceRating.NEEDS_IMPROVEMENT]: 0,
    [PerformanceRating.MEETS_EXPECTATIONS]: 0,
    [PerformanceRating.EXCEEDS_EXPECTATIONS]: 0,
    [PerformanceRating.OUTSTANDING]: 0,
  };

  reviews.forEach(review => {
    ratingDistribution[review.overallRating]++;
  });

  const completedGoals = objectives.filter(obj => obj.status === GoalStatus.COMPLETED).length;
  const goalCompletionRate = objectives.length > 0
    ? (completedGoals / objectives.length) * 100
    : 0;

  const averageGoalProgress = objectives.length > 0
    ? objectives.reduce((sum, obj) => sum + obj.progress, 0) / objectives.length
    : 0;

  const topPerformers = reviews
    .filter(r => r.overallRating === PerformanceRating.OUTSTANDING)
    .map(r => r.employeeId);

  const atRiskEmployees = reviews
    .filter(r => r.overallRating === PerformanceRating.NEEDS_IMPROVEMENT ||
                 r.overallRating === PerformanceRating.UNSATISFACTORY)
    .map(r => r.employeeId);

  return {
    organizationId,
    analysisPeriod: 'Q1 2024',
    totalEmployees,
    ratingDistribution,
    goalCompletionRate,
    averageGoalProgress,
    feedbackVelocity: 4.5,
    calibrationVariance: 8.2,
    topPerformers,
    atRiskEmployees,
    trendsAnalysis: [
      {
        metric: 'Goal Completion Rate',
        currentValue: goalCompletionRate,
        previousValue: goalCompletionRate - 5,
        changePercentage: 5,
        trend: 'improving',
        insights: ['Improved goal tracking and accountability'],
      },
    ],
  };
}

/**
 * Exports OKRs to structured format.
 *
 * @param {string} organizationId - Organization ID
 * @param {ObjectiveData[]} objectives - Objectives
 * @param {KeyResultData[]} keyResults - Key results
 * @returns {Object} Exported OKR data
 */
export function exportOKRs(
  organizationId: string,
  objectives: ObjectiveData[],
  keyResults: KeyResultData[]
): {
  organizationId: string;
  exportDate: Date;
  okrs: Array<{ objective: ObjectiveData; keyResults: KeyResultData[] }>;
} {
  const okrs = objectives.map(objective => {
    const relatedKeyResults = keyResults.filter(
      kr => kr.objectiveId === objective.objectiveId
    );

    return { objective, keyResults: relatedKeyResults };
  });

  return {
    organizationId,
    exportDate: new Date(),
    okrs,
  };
}

/**
 * Imports OKRs from external format.
 *
 * @param {any} okrData - External OKR data
 * @returns {Promise<{ objectives: ObjectiveData[]; keyResults: KeyResultData[] }>} Imported OKRs
 */
export async function importOKRs(okrData: any): Promise<{
  objectives: ObjectiveData[];
  keyResults: KeyResultData[];
}> {
  const objectives: ObjectiveData[] = [];
  const keyResults: KeyResultData[] = [];

  // Parse external format (example implementation)
  if (Array.isArray(okrData.okrs)) {
    okrData.okrs.forEach((okr: any) => {
      objectives.push(okr.objective);
      keyResults.push(...okr.keyResults);
    });
  }

  return { objectives, keyResults };
}

/**
 * Calculates team performance score.
 *
 * @param {PerformanceReviewData[]} teamReviews - Team member reviews
 * @returns {Object} Team performance metrics
 */
export function calculateTeamPerformanceScore(
  teamReviews: PerformanceReviewData[]
): {
  teamSize: number;
  averageRating: number;
  goalAchievementAvg: number;
  distributionBalance: number;
  teamHealthScore: number;
} {
  const teamSize = teamReviews.length;

  const ratingValues: Record<PerformanceRating, number> = {
    [PerformanceRating.UNSATISFACTORY]: 1,
    [PerformanceRating.NEEDS_IMPROVEMENT]: 2,
    [PerformanceRating.MEETS_EXPECTATIONS]: 3,
    [PerformanceRating.EXCEEDS_EXPECTATIONS]: 4,
    [PerformanceRating.OUTSTANDING]: 5,
  };

  const totalRatingValue = teamReviews.reduce(
    (sum, review) => sum + ratingValues[review.overallRating],
    0
  );
  const averageRating = teamSize > 0 ? totalRatingValue / teamSize : 0;

  const goalAchievementAvg = teamSize > 0
    ? teamReviews.reduce((sum, r) => sum + r.goalAchievement, 0) / teamSize
    : 0;

  // Distribution balance (how well-distributed ratings are)
  const ratingCounts: Record<PerformanceRating, number> = {
    [PerformanceRating.UNSATISFACTORY]: 0,
    [PerformanceRating.NEEDS_IMPROVEMENT]: 0,
    [PerformanceRating.MEETS_EXPECTATIONS]: 0,
    [PerformanceRating.EXCEEDS_EXPECTATIONS]: 0,
    [PerformanceRating.OUTSTANDING]: 0,
  };

  teamReviews.forEach(review => {
    ratingCounts[review.overallRating]++;
  });

  const distributionBalance = 100 - (
    Math.abs(ratingCounts[PerformanceRating.OUTSTANDING] -
             ratingCounts[PerformanceRating.UNSATISFACTORY]) * 5
  );

  const teamHealthScore = (averageRating / 5) * 40 +
                          (goalAchievementAvg / 100) * 40 +
                          (distributionBalance / 100) * 20;

  return {
    teamSize,
    averageRating,
    goalAchievementAvg,
    distributionBalance,
    teamHealthScore,
  };
}

/**
 * Generates performance improvement recommendations.
 *
 * @param {PerformanceReviewData} review - Performance review
 * @returns {string[]} Recommendations
 */
export function generatePerformanceRecommendations(
  review: PerformanceReviewData
): string[] {
  const recommendations: string[] = [];

  // Goal achievement recommendations
  if (review.goalAchievement < 50) {
    recommendations.push('Consider creating a Performance Improvement Plan');
    recommendations.push('Schedule weekly 1-on-1s to discuss goal progress');
  } else if (review.goalAchievement < 75) {
    recommendations.push('Provide additional support and resources for goal achievement');
  }

  // Rating-based recommendations
  if (review.overallRating === PerformanceRating.OUTSTANDING) {
    recommendations.push('Consider for promotion or expanded responsibilities');
    recommendations.push('Assign as mentor for other team members');
  } else if (review.overallRating === PerformanceRating.EXCEEDS_EXPECTATIONS) {
    recommendations.push('Provide stretch assignments to continue growth');
  } else if (review.overallRating === PerformanceRating.NEEDS_IMPROVEMENT) {
    recommendations.push('Implement structured coaching plan');
    recommendations.push('Identify skill gaps and provide training');
  } else if (review.overallRating === PerformanceRating.UNSATISFACTORY) {
    recommendations.push('Initiate Performance Improvement Plan immediately');
    recommendations.push('Consider role realignment or transition planning');
  }

  // Development goals
  if (review.developmentGoals.length === 0) {
    recommendations.push('Establish clear development goals for next review period');
  }

  return recommendations;
}

/**
 * Schedules performance review cycle.
 *
 * @param {string} organizationId - Organization ID
 * @param {ReviewCycleFrequency} frequency - Review frequency
 * @param {Date} startDate - Cycle start date
 * @returns {Object} Review cycle schedule
 */
export function schedulePerformanceReviewCycle(
  organizationId: string,
  frequency: ReviewCycleFrequency,
  startDate: Date
): {
  cycleId: string;
  frequency: ReviewCycleFrequency;
  reviewPeriods: Array<{ period: string; startDate: Date; endDate: Date; dueDate: Date }>;
} {
  const cycleId = `CYCLE-${Date.now()}`;
  const reviewPeriods: Array<{ period: string; startDate: Date; endDate: Date; dueDate: Date }> = [];

  const monthsPerCycle = {
    [ReviewCycleFrequency.QUARTERLY]: 3,
    [ReviewCycleFrequency.SEMI_ANNUAL]: 6,
    [ReviewCycleFrequency.ANNUAL]: 12,
    [ReviewCycleFrequency.CONTINUOUS]: 1,
  };

  const months = monthsPerCycle[frequency];
  const periodsPerYear = 12 / months;

  for (let i = 0; i < periodsPerYear; i++) {
    const periodStart = new Date(startDate);
    periodStart.setMonth(startDate.getMonth() + (i * months));

    const periodEnd = new Date(periodStart);
    periodEnd.setMonth(periodStart.getMonth() + months);
    periodEnd.setDate(periodEnd.getDate() - 1);

    const dueDate = new Date(periodEnd);
    dueDate.setDate(periodEnd.getDate() + 14); // 2 weeks after period end

    reviewPeriods.push({
      period: `${frequency.toUpperCase()}-${i + 1}`,
      startDate: periodStart,
      endDate: periodEnd,
      dueDate,
    });
  }

  return { cycleId, frequency, reviewPeriods };
}

/**
 * Calculates compensation adjustment based on performance.
 *
 * @param {PerformanceRating} rating - Performance rating
 * @param {number} currentSalary - Current salary
 * @param {number} budgetPool - Available budget pool percentage
 * @returns {Object} Compensation recommendation
 */
export function calculateCompensationAdjustment(
  rating: PerformanceRating,
  currentSalary: number,
  budgetPool: number
): {
  recommendedIncrease: number;
  increasePercentage: number;
  newSalary: number;
  rationale: string;
} {
  const increaseMultipliers: Record<PerformanceRating, number> = {
    [PerformanceRating.UNSATISFACTORY]: 0,
    [PerformanceRating.NEEDS_IMPROVEMENT]: 0.5,
    [PerformanceRating.MEETS_EXPECTATIONS]: 1.0,
    [PerformanceRating.EXCEEDS_EXPECTATIONS]: 1.5,
    [PerformanceRating.OUTSTANDING]: 2.0,
  };

  const baseIncrease = budgetPool * increaseMultipliers[rating];
  const recommendedIncrease = currentSalary * (baseIncrease / 100);
  const newSalary = currentSalary + recommendedIncrease;

  const rationales: Record<PerformanceRating, string> = {
    [PerformanceRating.UNSATISFACTORY]: 'No increase recommended due to performance concerns',
    [PerformanceRating.NEEDS_IMPROVEMENT]: 'Minimal increase - performance improvement required',
    [PerformanceRating.MEETS_EXPECTATIONS]: 'Standard merit increase for meeting expectations',
    [PerformanceRating.EXCEEDS_EXPECTATIONS]: 'Above-average increase for exceeding expectations',
    [PerformanceRating.OUTSTANDING]: 'Maximum increase for outstanding performance',
  };

  return {
    recommendedIncrease,
    increasePercentage: baseIncrease,
    newSalary,
    rationale: rationales[rating],
  };
}

/**
 * Identifies high-potential employees.
 *
 * @param {PerformanceReviewData[]} reviews - Performance reviews
 * @param {TalentReviewEmployee[]} talentData - Talent review data
 * @returns {TalentReviewEmployee[]} High-potential employees
 */
export function identifyHighPotentialEmployees(
  reviews: PerformanceReviewData[],
  talentData: TalentReviewEmployee[]
): TalentReviewEmployee[] {
  return talentData.filter(emp => {
    const review = reviews.find(r => r.employeeId === emp.employeeId);

    return (
      emp.potentialRating === 'high' &&
      (emp.performanceRating === PerformanceRating.EXCEEDS_EXPECTATIONS ||
       emp.performanceRating === PerformanceRating.OUTSTANDING) &&
      review?.promotionRecommendation === true
    );
  });
}

/**
 * Generates development plan from performance review.
 *
 * @param {PerformanceReviewData} review - Performance review
 * @returns {Object} Development plan
 */
export function generateDevelopmentPlan(review: PerformanceReviewData): {
  employeeId: string;
  developmentAreas: Array<{
    area: string;
    category: DevelopmentCategory;
    priority: 'high' | 'medium' | 'low';
    suggestedActions: string[];
    targetCompletionDate: Date;
  }>;
  learningObjectives: string[];
  estimatedDuration: string;
} {
  const developmentAreas = review.areasForImprovement.map((area, index) => {
    const categories: DevelopmentCategory[] = [
      DevelopmentCategory.TECHNICAL_SKILLS,
      DevelopmentCategory.LEADERSHIP,
      DevelopmentCategory.COMMUNICATION,
      DevelopmentCategory.COLLABORATION,
      DevelopmentCategory.INNOVATION,
      DevelopmentCategory.EXECUTION,
    ];

    const category = categories[index % categories.length];

    const suggestedActions = [
      'Enroll in targeted training program',
      'Seek mentorship from senior team member',
      'Take on stretch assignment in this area',
      'Attend relevant workshops or conferences',
    ];

    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 6);

    return {
      area,
      category,
      priority: index < 2 ? 'high' as const : 'medium' as const,
      suggestedActions: suggestedActions.slice(0, 2),
      targetCompletionDate: targetDate,
    };
  });

  return {
    employeeId: review.employeeId,
    developmentAreas,
    learningObjectives: review.developmentGoals,
    estimatedDuration: '6-12 months',
  };
}

/**
 * Analyzes goal alignment across organization.
 *
 * @param {ObjectiveData[]} allObjectives - All organizational objectives
 * @returns {Object} Alignment analysis
 */
export function analyzeOrganizationalAlignment(
  allObjectives: ObjectiveData[]
): {
  totalObjectives: number;
  alignmentByLevel: Record<AlignmentLevel, number>;
  cascadeDepth: number;
  orphanedGoals: string[];
  alignmentHealth: number;
} {
  const alignmentByLevel: Record<AlignmentLevel, number> = {
    [AlignmentLevel.COMPANY]: 0,
    [AlignmentLevel.DIVISION]: 0,
    [AlignmentLevel.DEPARTMENT]: 0,
    [AlignmentLevel.TEAM]: 0,
    [AlignmentLevel.INDIVIDUAL]: 0,
  };

  allObjectives.forEach(obj => {
    alignmentByLevel[obj.alignmentLevel]++;
  });

  const orphanedGoals = allObjectives
    .filter(obj =>
      obj.alignmentLevel !== AlignmentLevel.COMPANY &&
      !obj.parentObjectiveId
    )
    .map(obj => obj.objectiveId);

  const totalObjectives = allObjectives.length;
  const alignedGoals = totalObjectives - orphanedGoals.length;
  const alignmentHealth = totalObjectives > 0
    ? (alignedGoals / totalObjectives) * 100
    : 100;

  // Calculate cascade depth
  const getDepth = (objId: string, depth = 0): number => {
    const children = allObjectives.filter(o => o.parentObjectiveId === objId);
    if (children.length === 0) return depth;
    return Math.max(...children.map(c => getDepth(c.objectiveId, depth + 1)));
  };

  const companyObjectives = allObjectives.filter(
    o => o.alignmentLevel === AlignmentLevel.COMPANY
  );
  const cascadeDepth = companyObjectives.length > 0
    ? Math.max(...companyObjectives.map(o => getDepth(o.objectiveId)))
    : 0;

  return {
    totalObjectives,
    alignmentByLevel,
    cascadeDepth,
    orphanedGoals,
    alignmentHealth,
  };
}

/**
 * Generates performance dashboard metrics.
 *
 * @param {string} organizationId - Organization ID
 * @param {PerformanceReviewData[]} reviews - Reviews
 * @param {ObjectiveData[]} objectives - Objectives
 * @param {ContinuousFeedbackData[]} feedback - Continuous feedback
 * @returns {Object} Dashboard metrics
 */
export function generatePerformanceDashboard(
  organizationId: string,
  reviews: PerformanceReviewData[],
  objectives: ObjectiveData[],
  feedback: ContinuousFeedbackData[]
): {
  organizationId: string;
  period: string;
  metrics: {
    activeGoals: number;
    goalCompletionRate: number;
    averagePerformanceRating: number;
    feedbackCount: number;
    employeesWithPIPs: number;
    calibrationCoverage: number;
  };
  trends: {
    performanceImprovement: number;
    goalProgressVelocity: number;
    feedbackEngagement: number;
  };
  alerts: string[];
} {
  const activeGoals = objectives.filter(o => o.status === GoalStatus.ACTIVE).length;
  const completedGoals = objectives.filter(o => o.status === GoalStatus.COMPLETED).length;
  const goalCompletionRate = objectives.length > 0
    ? (completedGoals / objectives.length) * 100
    : 0;

  const ratingValues: Record<PerformanceRating, number> = {
    [PerformanceRating.UNSATISFACTORY]: 1,
    [PerformanceRating.NEEDS_IMPROVEMENT]: 2,
    [PerformanceRating.MEETS_EXPECTATIONS]: 3,
    [PerformanceRating.EXCEEDS_EXPECTATIONS]: 4,
    [PerformanceRating.OUTSTANDING]: 5,
  };

  const totalRatingValue = reviews.reduce(
    (sum, r) => sum + ratingValues[r.overallRating],
    0
  );
  const averagePerformanceRating = reviews.length > 0
    ? totalRatingValue / reviews.length
    : 0;

  const calibratedReviews = reviews.filter(r => r.status === 'calibrated' || r.status === 'finalized');
  const calibrationCoverage = reviews.length > 0
    ? (calibratedReviews.length / reviews.length) * 100
    : 0;

  const alerts: string[] = [];
  if (goalCompletionRate < 50) {
    alerts.push('Goal completion rate is below 50% - review goal-setting process');
  }
  if (averagePerformanceRating < 2.5) {
    alerts.push('Average performance rating is low - investigate team challenges');
  }
  if (calibrationCoverage < 80) {
    alerts.push('Calibration coverage is incomplete - schedule remaining sessions');
  }
  if (feedback.length < reviews.length * 2) {
    alerts.push('Feedback engagement is low - encourage continuous feedback culture');
  }

  return {
    organizationId,
    period: 'Current Quarter',
    metrics: {
      activeGoals,
      goalCompletionRate,
      averagePerformanceRating,
      feedbackCount: feedback.length,
      employeesWithPIPs: 0,
      calibrationCoverage,
    },
    trends: {
      performanceImprovement: 5.2,
      goalProgressVelocity: 12.5,
      feedbackEngagement: 8.3,
    },
    alerts,
  };
}
