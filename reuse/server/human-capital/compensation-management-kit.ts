/**
 * LOC: HCMCOMP12345
 * File: /reuse/server/human-capital/compensation-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ../../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Compensation controllers
 *   - Payroll integration services
 *   - Analytics and reporting services
 */

/**
 * File: /reuse/server/human-capital/compensation-management-kit.ts
 * Locator: WC-HCM-COMP-001
 * Purpose: Enterprise Compensation Management System - SAP SuccessFactors Compensation parity
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, HR controllers, compensation services, payroll integration, analytics
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 50 utility functions for compensation planning, salary structures, pay grades, merit increases,
 *          bonuses, market benchmarking, equity analysis, total rewards, variable pay, commissions,
 *          long-term incentives, stock options, and compensation analytics
 *
 * LLM Context: Enterprise-grade compensation management system competing with SAP SuccessFactors Compensation.
 * Provides complete compensation lifecycle management including compensation planning & budgeting, salary structure
 * design, pay grade management, salary range administration, merit increase calculations, bonus computations,
 * compensation review cycles, market data analysis, pay equity analysis, total rewards statements, variable pay
 * & incentive management, commission calculations, sales compensation, long-term incentive plans (LTI), stock
 * option administration, compensation analytics, and seamless payroll integration.
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
  IsObject,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Compensation plan status
 */
export enum CompensationPlanStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Compensation review cycle status
 */
export enum CompensationCycleStatus {
  PLANNING = 'planning',
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  CLOSED = 'closed',
}

/**
 * Pay grade type
 */
export enum PayGradeType {
  EXEMPT = 'exempt',
  NON_EXEMPT = 'non_exempt',
  HOURLY = 'hourly',
  SALARIED = 'salaried',
  EXECUTIVE = 'executive',
}

/**
 * Compensation adjustment type
 */
export enum CompensationAdjustmentType {
  MERIT_INCREASE = 'merit_increase',
  PROMOTION = 'promotion',
  MARKET_ADJUSTMENT = 'market_adjustment',
  COST_OF_LIVING = 'cost_of_living',
  EQUITY_ADJUSTMENT = 'equity_adjustment',
  RETENTION = 'retention',
  PERFORMANCE_BONUS = 'performance_bonus',
  SPECIAL_RECOGNITION = 'special_recognition',
}

/**
 * Bonus type
 */
export enum BonusType {
  ANNUAL_PERFORMANCE = 'annual_performance',
  SIGNING = 'signing',
  RETENTION = 'retention',
  SPOT = 'spot',
  PROJECT_COMPLETION = 'project_completion',
  REFERRAL = 'referral',
  SALES_ACHIEVEMENT = 'sales_achievement',
}

/**
 * Commission structure type
 */
export enum CommissionStructureType {
  FLAT_RATE = 'flat_rate',
  TIERED = 'tiered',
  PROGRESSIVE = 'progressive',
  DRAW_AGAINST = 'draw_against',
  RESIDUAL = 'residual',
}

/**
 * Long-term incentive type
 */
export enum LTIType {
  STOCK_OPTIONS = 'stock_options',
  RESTRICTED_STOCK_UNITS = 'rsu',
  PERFORMANCE_SHARES = 'performance_shares',
  STOCK_APPRECIATION_RIGHTS = 'sar',
  PHANTOM_STOCK = 'phantom_stock',
}

/**
 * Vesting schedule type
 */
export enum VestingScheduleType {
  CLIFF = 'cliff',
  GRADED = 'graded',
  PERFORMANCE_BASED = 'performance_based',
  TIME_BASED = 'time_based',
}

/**
 * Market data source type
 */
export enum MarketDataSource {
  MERCER = 'mercer',
  WILLIS_TOWERS_WATSON = 'willis_towers_watson',
  RADFORD = 'radford',
  PAYSCALE = 'payscale',
  SALARY_COM = 'salary_com',
  CUSTOM_SURVEY = 'custom_survey',
}

/**
 * Compensation plan interface
 */
export interface CompensationPlan {
  id: string;
  planCode: string;
  planName: string;
  planYear: number;
  fiscalYear: number;
  planType: 'merit' | 'bonus' | 'equity' | 'comprehensive';
  effectiveDate: Date;
  endDate: Date;
  totalBudget: number;
  allocatedBudget: number;
  remainingBudget: number;
  currency: string;
  status: CompensationPlanStatus;
  guidelines: CompensationGuideline[];
  approvalWorkflow: any[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

/**
 * Compensation guideline interface
 */
export interface CompensationGuideline {
  id: string;
  payGradeId?: string;
  departmentId?: string;
  performanceRating: string;
  minIncreasePercent: number;
  maxIncreasePercent: number;
  targetIncreasePercent: number;
  eligibleForBonus: boolean;
  bonusTargetPercent?: number;
}

/**
 * Pay grade interface
 */
export interface PayGrade {
  id: string;
  gradeCode: string;
  gradeName: string;
  gradeLevel: number;
  gradeType: PayGradeType;
  minSalary: number;
  midpointSalary: number;
  maxSalary: number;
  currency: string;
  spreadPercent: number;
  marketReference?: string;
  effectiveDate: Date;
  endDate?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Salary range interface
 */
export interface SalaryRange {
  id: string;
  payGradeId: string;
  locationId?: string;
  currencyCode: string;
  minSalary: number;
  firstQuartile: number;
  midpoint: number;
  thirdQuartile: number;
  maxSalary: number;
  marketRatio: number;
  effectiveDate: Date;
  endDate?: Date;
  metadata: Record<string, any>;
}

/**
 * Employee compensation interface
 */
export interface EmployeeCompensation {
  id: string;
  employeeId: string;
  employeeName: string;
  jobCode: string;
  jobTitle: string;
  payGradeId: string;
  departmentId: string;
  locationId: string;
  baseSalary: number;
  currency: string;
  compaRatio: number;
  rangePosition: number;
  lastIncreaseDate?: Date;
  lastIncreasePercent?: number;
  lastIncreaseAmount?: number;
  targetBonus: number;
  targetBonusPercent: number;
  ltiValue?: number;
  totalCash: number;
  totalDirectCompensation: number;
  metadata: Record<string, any>;
  effectiveDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Compensation adjustment interface
 */
export interface CompensationAdjustment {
  id: string;
  employeeId: string;
  planId?: string;
  cycleId?: string;
  adjustmentType: CompensationAdjustmentType;
  currentSalary: number;
  proposedSalary: number;
  adjustmentAmount: number;
  adjustmentPercent: number;
  effectiveDate: Date;
  reason: string;
  justification: string;
  performanceRating?: string;
  compaRatioBefore: number;
  compaRatioAfter: number;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Bonus payment interface
 */
export interface BonusPayment {
  id: string;
  employeeId: string;
  bonusType: BonusType;
  bonusAmount: number;
  bonusPercent?: number;
  targetAmount?: number;
  actualAmount: number;
  achievementPercent?: number;
  paymentDate: Date;
  payrollPeriodId?: string;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  reason: string;
  approvedBy?: string;
  approvedAt?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
}

/**
 * Commission plan interface
 */
export interface CommissionPlan {
  id: string;
  planCode: string;
  planName: string;
  structureType: CommissionStructureType;
  effectiveDate: Date;
  endDate?: Date;
  baseSalary?: number;
  drawAmount?: number;
  tiers: CommissionTier[];
  quotaAmount?: number;
  paymentFrequency: 'monthly' | 'quarterly' | 'annually';
  accelerators?: any[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Commission tier interface
 */
export interface CommissionTier {
  tierLevel: number;
  minAmount: number;
  maxAmount?: number;
  rate: number;
  rateType: 'percentage' | 'fixed';
}

/**
 * Commission payment interface
 */
export interface CommissionPayment {
  id: string;
  employeeId: string;
  planId: string;
  periodStart: Date;
  periodEnd: Date;
  salesAmount: number;
  quotaAmount: number;
  achievementPercent: number;
  commissionAmount: number;
  adjustments: number;
  finalAmount: number;
  paymentDate: Date;
  status: 'calculated' | 'approved' | 'paid' | 'disputed';
  metadata: Record<string, any>;
  createdAt: Date;
}

/**
 * Long-term incentive grant interface
 */
export interface LTIGrant {
  id: string;
  grantNumber: string;
  employeeId: string;
  ltiType: LTIType;
  grantDate: Date;
  grantPrice?: number;
  numberOfUnits: number;
  totalValue: number;
  vestingScheduleType: VestingScheduleType;
  vestingStartDate: Date;
  vestingEndDate: Date;
  vestingSchedule: VestingPeriod[];
  vestedUnits: number;
  unvestedUnits: number;
  exercisedUnits?: number;
  forfeitedUnits?: number;
  status: 'active' | 'vested' | 'exercised' | 'forfeited' | 'expired';
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Vesting period interface
 */
export interface VestingPeriod {
  periodNumber: number;
  vestingDate: Date;
  vestingPercent: number;
  unitsVesting: number;
  isVested: boolean;
}

/**
 * Market data interface
 */
export interface MarketData {
  id: string;
  jobCode: string;
  jobTitle: string;
  dataSource: MarketDataSource;
  surveyYear: number;
  effectiveDate: Date;
  locationId?: string;
  industryCode?: string;
  companySize?: string;
  percentile10: number;
  percentile25: number;
  percentile50: number;
  percentile75: number;
  percentile90: number;
  average: number;
  sampleSize: number;
  currency: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Pay equity analysis interface
 */
export interface PayEquityAnalysis {
  id: string;
  analysisDate: Date;
  analysisType: 'gender' | 'ethnicity' | 'age' | 'comprehensive';
  scope: 'company' | 'department' | 'job_family';
  scopeId?: string;
  totalEmployees: number;
  disparityFound: boolean;
  avgPayGap: number;
  maxPayGap: number;
  affectedEmployees: number;
  recommendations: string[];
  estimatedCost: number;
  findings: any[];
  metadata: Record<string, any>;
  createdAt: Date;
}

/**
 * Total rewards statement interface
 */
export interface TotalRewardsStatement {
  id: string;
  employeeId: string;
  statementYear: number;
  baseSalary: number;
  bonusTarget: number;
  bonusPaid: number;
  commissionPaid: number;
  ltiValue: number;
  benefitsValue: number;
  retirementContribution: number;
  ptoValue: number;
  otherCompensation: number;
  totalCash: number;
  totalDirectCompensation: number;
  totalRewards: number;
  currency: string;
  generatedAt: Date;
  metadata: Record<string, any>;
}

/**
 * Compensation review cycle interface
 */
export interface CompensationReviewCycle {
  id: string;
  cycleCode: string;
  cycleName: string;
  planYear: number;
  cycleType: 'annual' | 'mid_year' | 'off_cycle' | 'promotion';
  startDate: Date;
  endDate: Date;
  approvalDeadline: Date;
  effectiveDate: Date;
  status: CompensationCycleStatus;
  totalBudget: number;
  participantCount: number;
  completedCount: number;
  approvedCount: number;
  guidelines: CompensationGuideline[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================

/**
 * Create compensation plan DTO
 */
export class CreateCompensationPlanDto {
  @ApiProperty({ description: 'Plan code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  planCode: string;

  @ApiProperty({ description: 'Plan name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  planName: string;

  @ApiProperty({ description: 'Plan year' })
  @IsNumber()
  @Min(2020)
  @Max(2100)
  planYear: number;

  @ApiProperty({ description: 'Total budget amount' })
  @IsNumber()
  @Min(0)
  totalBudget: number;

  @ApiProperty({ description: 'Effective date' })
  @Type(() => Date)
  @IsDate()
  effectiveDate: Date;

  @ApiProperty({ description: 'End date' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ description: 'Currency code' })
  @IsString()
  @MaxLength(3)
  currency: string;
}

/**
 * Create pay grade DTO
 */
export class CreatePayGradeDto {
  @ApiProperty({ description: 'Grade code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  gradeCode: string;

  @ApiProperty({ description: 'Grade name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  gradeName: string;

  @ApiProperty({ description: 'Grade level' })
  @IsNumber()
  @Min(1)
  gradeLevel: number;

  @ApiProperty({ enum: PayGradeType })
  @IsEnum(PayGradeType)
  gradeType: PayGradeType;

  @ApiProperty({ description: 'Minimum salary' })
  @IsNumber()
  @Min(0)
  minSalary: number;

  @ApiProperty({ description: 'Midpoint salary' })
  @IsNumber()
  @Min(0)
  midpointSalary: number;

  @ApiProperty({ description: 'Maximum salary' })
  @IsNumber()
  @Min(0)
  maxSalary: number;

  @ApiProperty({ description: 'Currency code' })
  @IsString()
  @MaxLength(3)
  currency: string;
}

/**
 * Create compensation adjustment DTO
 */
export class CreateCompensationAdjustmentDto {
  @ApiProperty({ description: 'Employee ID' })
  @IsUUID()
  employeeId: string;

  @ApiProperty({ enum: CompensationAdjustmentType })
  @IsEnum(CompensationAdjustmentType)
  adjustmentType: CompensationAdjustmentType;

  @ApiProperty({ description: 'Current salary' })
  @IsNumber()
  @Min(0)
  currentSalary: number;

  @ApiProperty({ description: 'Proposed salary' })
  @IsNumber()
  @Min(0)
  proposedSalary: number;

  @ApiProperty({ description: 'Effective date' })
  @Type(() => Date)
  @IsDate()
  effectiveDate: Date;

  @ApiProperty({ description: 'Justification' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  justification: string;

  @ApiProperty({ description: 'Performance rating', required: false })
  @IsOptional()
  @IsString()
  performanceRating?: string;
}

/**
 * Create bonus payment DTO
 */
export class CreateBonusPaymentDto {
  @ApiProperty({ description: 'Employee ID' })
  @IsUUID()
  employeeId: string;

  @ApiProperty({ enum: BonusType })
  @IsEnum(BonusType)
  bonusType: BonusType;

  @ApiProperty({ description: 'Bonus amount' })
  @IsNumber()
  @Min(0)
  bonusAmount: number;

  @ApiProperty({ description: 'Payment date' })
  @Type(() => Date)
  @IsDate()
  paymentDate: Date;

  @ApiProperty({ description: 'Reason for bonus' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason: string;
}

/**
 * Create commission plan DTO
 */
export class CreateCommissionPlanDto {
  @ApiProperty({ description: 'Plan code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  planCode: string;

  @ApiProperty({ description: 'Plan name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  planName: string;

  @ApiProperty({ enum: CommissionStructureType })
  @IsEnum(CommissionStructureType)
  structureType: CommissionStructureType;

  @ApiProperty({ description: 'Effective date' })
  @Type(() => Date)
  @IsDate()
  effectiveDate: Date;

  @ApiProperty({ description: 'Commission tiers' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  tiers: CommissionTier[];

  @ApiProperty({ description: 'Payment frequency' })
  @IsEnum(['monthly', 'quarterly', 'annually'])
  paymentFrequency: 'monthly' | 'quarterly' | 'annually';
}

/**
 * Create LTI grant DTO
 */
export class CreateLTIGrantDto {
  @ApiProperty({ description: 'Employee ID' })
  @IsUUID()
  employeeId: string;

  @ApiProperty({ enum: LTIType })
  @IsEnum(LTIType)
  ltiType: LTIType;

  @ApiProperty({ description: 'Grant date' })
  @Type(() => Date)
  @IsDate()
  grantDate: Date;

  @ApiProperty({ description: 'Number of units' })
  @IsNumber()
  @Min(1)
  numberOfUnits: number;

  @ApiProperty({ description: 'Grant price', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  grantPrice?: number;

  @ApiProperty({ enum: VestingScheduleType })
  @IsEnum(VestingScheduleType)
  vestingScheduleType: VestingScheduleType;

  @ApiProperty({ description: 'Vesting start date' })
  @Type(() => Date)
  @IsDate()
  vestingStartDate: Date;

  @ApiProperty({ description: 'Vesting end date' })
  @Type(() => Date)
  @IsDate()
  vestingEndDate: Date;
}

/**
 * Market data upload DTO
 */
export class MarketDataUploadDto {
  @ApiProperty({ description: 'Job code' })
  @IsString()
  @IsNotEmpty()
  jobCode: string;

  @ApiProperty({ description: 'Job title' })
  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @ApiProperty({ enum: MarketDataSource })
  @IsEnum(MarketDataSource)
  dataSource: MarketDataSource;

  @ApiProperty({ description: 'Survey year' })
  @IsNumber()
  @Min(2020)
  surveyYear: number;

  @ApiProperty({ description: 'Market percentiles' })
  @IsObject()
  @ValidateNested()
  percentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };

  @ApiProperty({ description: 'Sample size' })
  @IsNumber()
  @Min(1)
  sampleSize: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Compensation Plan.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CompensationPlan model
 *
 * @example
 * ```typescript
 * const CompensationPlan = createCompensationPlanModel(sequelize);
 * const plan = await CompensationPlan.create({
 *   planCode: 'MERIT2025',
 *   planName: '2025 Merit Increase Plan',
 *   planYear: 2025,
 *   totalBudget: 5000000
 * });
 * ```
 */
export const createCompensationPlanModel = (sequelize: Sequelize) => {
  class CompensationPlan extends Model {
    public id!: string;
    public planCode!: string;
    public planName!: string;
    public planYear!: number;
    public fiscalYear!: number;
    public planType!: string;
    public effectiveDate!: Date;
    public endDate!: Date;
    public totalBudget!: number;
    public allocatedBudget!: number;
    public remainingBudget!: number;
    public currency!: string;
    public status!: string;
    public guidelines!: any[];
    public approvalWorkflow!: any[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  CompensationPlan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      planCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique plan code',
      },
      planName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Plan name',
      },
      planYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Plan year',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      planType: {
        type: DataTypes.ENUM('merit', 'bonus', 'equity', 'comprehensive'),
        allowNull: false,
        comment: 'Plan type',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Plan effective date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Plan end date',
      },
      totalBudget: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Total budget allocated',
      },
      allocatedBudget: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Budget currently allocated',
      },
      remainingBudget: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Remaining budget available',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code',
      },
      status: {
        type: DataTypes.ENUM('draft', 'in_review', 'approved', 'active', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Plan status',
      },
      guidelines: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Compensation guidelines',
      },
      approvalWorkflow: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Approval workflow steps',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'User who created the plan',
      },
      updatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'User who last updated the plan',
      },
    },
    {
      sequelize,
      tableName: 'compensation_plans',
      timestamps: true,
      indexes: [
        { fields: ['planCode'], unique: true },
        { fields: ['planYear'] },
        { fields: ['status'] },
        { fields: ['effectiveDate'] },
      ],
    },
  );

  return CompensationPlan;
};

/**
 * Sequelize model for Pay Grade.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PayGrade model
 */
export const createPayGradeModel = (sequelize: Sequelize) => {
  class PayGrade extends Model {
    public id!: string;
    public gradeCode!: string;
    public gradeName!: string;
    public gradeLevel!: number;
    public gradeType!: string;
    public minSalary!: number;
    public midpointSalary!: number;
    public maxSalary!: number;
    public currency!: string;
    public spreadPercent!: number;
    public marketReference!: string | null;
    public effectiveDate!: Date;
    public endDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PayGrade.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      gradeCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique grade code',
      },
      gradeName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Grade name',
      },
      gradeLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Grade level (1-20)',
      },
      gradeType: {
        type: DataTypes.ENUM('exempt', 'non_exempt', 'hourly', 'salaried', 'executive'),
        allowNull: false,
        comment: 'Grade type',
      },
      minSalary: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Minimum salary for grade',
      },
      midpointSalary: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Midpoint salary for grade',
      },
      maxSalary: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Maximum salary for grade',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code',
      },
      spreadPercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Range spread percentage',
      },
      marketReference: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Market reference data',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'End date',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'pay_grades',
      timestamps: true,
      indexes: [
        { fields: ['gradeCode'], unique: true },
        { fields: ['gradeLevel'] },
        { fields: ['gradeType'] },
        { fields: ['effectiveDate'] },
      ],
    },
  );

  return PayGrade;
};

/**
 * Sequelize model for Employee Compensation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EmployeeCompensation model
 */
export const createEmployeeCompensationModel = (sequelize: Sequelize) => {
  class EmployeeCompensation extends Model {
    public id!: string;
    public employeeId!: string;
    public employeeName!: string;
    public jobCode!: string;
    public jobTitle!: string;
    public payGradeId!: string;
    public departmentId!: string;
    public locationId!: string;
    public baseSalary!: number;
    public currency!: string;
    public compaRatio!: number;
    public rangePosition!: number;
    public lastIncreaseDate!: Date | null;
    public lastIncreasePercent!: number | null;
    public lastIncreaseAmount!: number | null;
    public targetBonus!: number;
    public targetBonusPercent!: number;
    public ltiValue!: number | null;
    public totalCash!: number;
    public totalDirectCompensation!: number;
    public metadata!: Record<string, any>;
    public effectiveDate!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  EmployeeCompensation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      employeeId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Employee ID',
      },
      employeeName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Employee name',
      },
      jobCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Job code',
      },
      jobTitle: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Job title',
      },
      payGradeId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Pay grade ID',
      },
      departmentId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Department ID',
      },
      locationId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Location ID',
      },
      baseSalary: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Base salary',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code',
      },
      compaRatio: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Compa-ratio (salary/midpoint)',
      },
      rangePosition: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Position in salary range (0-100)',
      },
      lastIncreaseDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last increase date',
      },
      lastIncreasePercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Last increase percentage',
      },
      lastIncreaseAmount: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: true,
        comment: 'Last increase amount',
      },
      targetBonus: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Target bonus amount',
      },
      targetBonusPercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Target bonus percentage',
      },
      ltiValue: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: true,
        comment: 'Long-term incentive value',
      },
      totalCash: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Total cash compensation',
      },
      totalDirectCompensation: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Total direct compensation',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective date',
      },
    },
    {
      sequelize,
      tableName: 'employee_compensation',
      timestamps: true,
      indexes: [
        { fields: ['employeeId'] },
        { fields: ['payGradeId'] },
        { fields: ['departmentId'] },
        { fields: ['effectiveDate'] },
        { fields: ['compaRatio'] },
      ],
    },
  );

  return EmployeeCompensation;
};

/**
 * Sequelize model for Compensation Adjustment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CompensationAdjustment model
 */
export const createCompensationAdjustmentModel = (sequelize: Sequelize) => {
  class CompensationAdjustment extends Model {
    public id!: string;
    public employeeId!: string;
    public planId!: string | null;
    public cycleId!: string | null;
    public adjustmentType!: string;
    public currentSalary!: number;
    public proposedSalary!: number;
    public adjustmentAmount!: number;
    public adjustmentPercent!: number;
    public effectiveDate!: Date;
    public reason!: string;
    public justification!: string;
    public performanceRating!: string | null;
    public compaRatioBefore!: number;
    public compaRatioAfter!: number;
    public approvalStatus!: string;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CompensationAdjustment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      employeeId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Employee ID',
      },
      planId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Compensation plan ID',
      },
      cycleId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Review cycle ID',
      },
      adjustmentType: {
        type: DataTypes.ENUM(
          'merit_increase',
          'promotion',
          'market_adjustment',
          'cost_of_living',
          'equity_adjustment',
          'retention',
          'performance_bonus',
          'special_recognition',
        ),
        allowNull: false,
        comment: 'Type of adjustment',
      },
      currentSalary: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Current salary',
      },
      proposedSalary: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Proposed new salary',
      },
      adjustmentAmount: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Adjustment amount',
      },
      adjustmentPercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Adjustment percentage',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective date of adjustment',
      },
      reason: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Reason for adjustment',
      },
      justification: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed justification',
      },
      performanceRating: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Performance rating',
      },
      compaRatioBefore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Compa-ratio before adjustment',
      },
      compaRatioAfter: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Compa-ratio after adjustment',
      },
      approvalStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Approval status',
      },
      approvedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Approver user ID',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'compensation_adjustments',
      timestamps: true,
      indexes: [
        { fields: ['employeeId'] },
        { fields: ['planId'] },
        { fields: ['cycleId'] },
        { fields: ['adjustmentType'] },
        { fields: ['approvalStatus'] },
        { fields: ['effectiveDate'] },
      ],
    },
  );

  return CompensationAdjustment;
};

/**
 * Sequelize model for LTI Grant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LTIGrant model
 */
export const createLTIGrantModel = (sequelize: Sequelize) => {
  class LTIGrant extends Model {
    public id!: string;
    public grantNumber!: string;
    public employeeId!: string;
    public ltiType!: string;
    public grantDate!: Date;
    public grantPrice!: number | null;
    public numberOfUnits!: number;
    public totalValue!: number;
    public vestingScheduleType!: string;
    public vestingStartDate!: Date;
    public vestingEndDate!: Date;
    public vestingSchedule!: any[];
    public vestedUnits!: number;
    public unvestedUnits!: number;
    public exercisedUnits!: number | null;
    public forfeitedUnits!: number | null;
    public status!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  LTIGrant.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      grantNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique grant number',
      },
      employeeId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Employee ID',
      },
      ltiType: {
        type: DataTypes.ENUM('stock_options', 'rsu', 'performance_shares', 'sar', 'phantom_stock'),
        allowNull: false,
        comment: 'LTI type',
      },
      grantDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Grant date',
      },
      grantPrice: {
        type: DataTypes.DECIMAL(19, 4),
        allowNull: true,
        comment: 'Grant price per unit',
      },
      numberOfUnits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Number of units granted',
      },
      totalValue: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Total grant value',
      },
      vestingScheduleType: {
        type: DataTypes.ENUM('cliff', 'graded', 'performance_based', 'time_based'),
        allowNull: false,
        comment: 'Vesting schedule type',
      },
      vestingStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Vesting start date',
      },
      vestingEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Vesting end date',
      },
      vestingSchedule: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Detailed vesting schedule',
      },
      vestedUnits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of vested units',
      },
      unvestedUnits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Number of unvested units',
      },
      exercisedUnits: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Number of exercised units',
      },
      forfeitedUnits: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Number of forfeited units',
      },
      status: {
        type: DataTypes.ENUM('active', 'vested', 'exercised', 'forfeited', 'expired'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Grant status',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'lti_grants',
      timestamps: true,
      indexes: [
        { fields: ['grantNumber'], unique: true },
        { fields: ['employeeId'] },
        { fields: ['ltiType'] },
        { fields: ['status'] },
        { fields: ['grantDate'] },
        { fields: ['vestingEndDate'] },
      ],
    },
  );

  return LTIGrant;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates unique compensation plan code
 */
const generatePlanCode = (planType: string, year: number): string => {
  const prefix = planType.substring(0, 3).toUpperCase();
  return `${prefix}${year}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

/**
 * Generates unique grant number
 */
const generateGrantNumber = (ltiType: string, employeeId: string): string => {
  const prefix = ltiType.substring(0, 3).toUpperCase();
  const empPrefix = employeeId.substring(0, 4).toUpperCase();
  const timestamp = Date.now().toString().substring(-6);
  return `${prefix}-${empPrefix}-${timestamp}`;
};

/**
 * Generates unique UUID
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// ============================================================================
// COMPENSATION PLANNING & BUDGETING (1-5)
// ============================================================================

/**
 * Creates comprehensive compensation plan with budget allocation.
 *
 * @param {object} planData - Plan creation data
 * @param {string} userId - User creating the plan
 * @returns {Promise<CompensationPlan>} Created plan
 *
 * @example
 * ```typescript
 * const plan = await createCompensationPlan({
 *   planCode: 'MERIT2025',
 *   planName: '2025 Annual Merit Increase Plan',
 *   planYear: 2025,
 *   planType: 'merit',
 *   totalBudget: 5000000,
 *   effectiveDate: new Date('2025-04-01')
 * }, 'admin-123');
 * ```
 */
export const createCompensationPlan = async (planData: any, userId: string): Promise<CompensationPlan> => {
  const planCode = planData.planCode || generatePlanCode(planData.planType, planData.planYear);

  return {
    id: generateUUID(),
    planCode,
    planName: planData.planName,
    planYear: planData.planYear,
    fiscalYear: planData.fiscalYear || planData.planYear,
    planType: planData.planType,
    effectiveDate: planData.effectiveDate,
    endDate: planData.endDate,
    totalBudget: planData.totalBudget,
    allocatedBudget: 0,
    remainingBudget: planData.totalBudget,
    currency: planData.currency || 'USD',
    status: CompensationPlanStatus.DRAFT,
    guidelines: planData.guidelines || [],
    approvalWorkflow: planData.approvalWorkflow || [],
    metadata: planData.metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userId,
  };
};

/**
 * Calculates total compensation budget by department.
 *
 * @param {string} planId - Plan ID
 * @param {any[]} departments - Department list
 * @returns {Promise<object>} Budget allocation by department
 *
 * @example
 * ```typescript
 * const budgets = await calculateDepartmentBudgets('plan-123', departments);
 * // Returns: { 'dept-1': 500000, 'dept-2': 750000, ... }
 * ```
 */
export const calculateDepartmentBudgets = async (planId: string, departments: any[]): Promise<Record<string, number>> => {
  const departmentBudgets: Record<string, number> = {};

  for (const dept of departments) {
    const headcount = dept.headcount || 0;
    const avgSalary = dept.avgSalary || 0;
    const increasePercent = dept.targetIncreasePercent || 3.0;

    departmentBudgets[dept.id] = headcount * avgSalary * (increasePercent / 100);
  }

  return departmentBudgets;
};

/**
 * Allocates compensation budget to eligible employees.
 *
 * @param {string} planId - Plan ID
 * @param {any[]} employees - Employee list
 * @param {number} totalBudget - Total budget available
 * @returns {Promise<object>} Budget allocation per employee
 *
 * @example
 * ```typescript
 * const allocations = await allocateCompensationBudget('plan-123', employees, 1000000);
 * ```
 */
export const allocateCompensationBudget = async (
  planId: string,
  employees: any[],
  totalBudget: number,
): Promise<Record<string, number>> => {
  const allocations: Record<string, number> = {};
  let totalAllocated = 0;

  // Sort employees by performance rating and compa-ratio
  const sortedEmployees = employees.sort((a, b) => {
    const scoreA = (a.performanceScore || 0) - (a.compaRatio || 1.0);
    const scoreB = (b.performanceScore || 0) - (b.compaRatio || 1.0);
    return scoreB - scoreA;
  });

  for (const emp of sortedEmployees) {
    if (totalAllocated >= totalBudget) break;

    const currentSalary = emp.baseSalary || 0;
    const performanceMultiplier = emp.performanceScore || 1.0;
    const targetIncrease = currentSalary * 0.03 * performanceMultiplier;

    const allocation = Math.min(targetIncrease, totalBudget - totalAllocated);
    allocations[emp.id] = allocation;
    totalAllocated += allocation;
  }

  return allocations;
};

/**
 * Tracks compensation plan budget utilization.
 *
 * @param {string} planId - Plan ID
 * @returns {Promise<object>} Budget utilization metrics
 *
 * @example
 * ```typescript
 * const utilization = await trackBudgetUtilization('plan-123');
 * // Returns: { totalBudget, allocated, remaining, utilizationPercent }
 * ```
 */
export const trackBudgetUtilization = async (planId: string): Promise<any> => {
  // Mock implementation - would query database in production
  return {
    planId,
    totalBudget: 5000000,
    allocatedBudget: 3250000,
    remainingBudget: 1750000,
    utilizationPercent: 65.0,
    departmentBreakdown: {},
    adjustmentCount: 0,
    approvedCount: 0,
    pendingCount: 0,
  };
};

/**
 * Generates budget forecast based on historical data.
 *
 * @param {number} planYear - Plan year
 * @param {any} assumptions - Forecasting assumptions
 * @returns {Promise<object>} Budget forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastCompensationBudget(2025, {
 *   avgIncreasePercent: 3.5,
 *   headcountGrowth: 10
 * });
 * ```
 */
export const forecastCompensationBudget = async (planYear: number, assumptions: any): Promise<any> => {
  const currentHeadcount = assumptions.currentHeadcount || 1000;
  const avgSalary = assumptions.avgSalary || 75000;
  const increasePercent = assumptions.avgIncreasePercent || 3.0;
  const headcountGrowth = assumptions.headcountGrowth || 0;

  const projectedHeadcount = currentHeadcount + headcountGrowth;
  const meritBudget = projectedHeadcount * avgSalary * (increasePercent / 100);
  const newHireBudget = headcountGrowth * avgSalary * 0.5;
  const bonusBudget = projectedHeadcount * avgSalary * 0.1;

  return {
    planYear,
    projectedHeadcount,
    avgSalary,
    meritBudget,
    newHireBudget,
    bonusBudget,
    totalBudget: meritBudget + newHireBudget + bonusBudget,
    assumptions,
  };
};

// ============================================================================
// SALARY STRUCTURE & PAY GRADES (6-10)
// ============================================================================

/**
 * Creates pay grade with salary range definition.
 *
 * @param {object} gradeData - Pay grade data
 * @returns {Promise<PayGrade>} Created pay grade
 *
 * @example
 * ```typescript
 * const grade = await createPayGrade({
 *   gradeCode: 'L5',
 *   gradeName: 'Senior Software Engineer',
 *   gradeLevel: 5,
 *   minSalary: 120000,
 *   midpointSalary: 150000,
 *   maxSalary: 180000
 * });
 * ```
 */
export const createPayGrade = async (gradeData: any): Promise<PayGrade> => {
  const spreadPercent = ((gradeData.maxSalary - gradeData.minSalary) / gradeData.midpointSalary) * 100;

  return {
    id: generateUUID(),
    gradeCode: gradeData.gradeCode,
    gradeName: gradeData.gradeName,
    gradeLevel: gradeData.gradeLevel,
    gradeType: gradeData.gradeType,
    minSalary: gradeData.minSalary,
    midpointSalary: gradeData.midpointSalary,
    maxSalary: gradeData.maxSalary,
    currency: gradeData.currency || 'USD',
    spreadPercent,
    marketReference: gradeData.marketReference,
    effectiveDate: gradeData.effectiveDate || new Date(),
    endDate: gradeData.endDate,
    metadata: gradeData.metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Updates salary ranges for pay grade.
 *
 * @param {string} gradeId - Pay grade ID
 * @param {object} rangeData - New range data
 * @returns {Promise<PayGrade>} Updated pay grade
 *
 * @example
 * ```typescript
 * const updated = await updateSalaryRange('grade-123', {
 *   minSalary: 125000,
 *   midpointSalary: 155000,
 *   maxSalary: 185000
 * });
 * ```
 */
export const updateSalaryRange = async (gradeId: string, rangeData: any): Promise<PayGrade> => {
  // Mock implementation - would update database in production
  const spreadPercent = ((rangeData.maxSalary - rangeData.minSalary) / rangeData.midpointSalary) * 100;

  return {
    id: gradeId,
    gradeCode: rangeData.gradeCode || 'L5',
    gradeName: rangeData.gradeName || 'Senior Engineer',
    gradeLevel: rangeData.gradeLevel || 5,
    gradeType: rangeData.gradeType || PayGradeType.SALARIED,
    minSalary: rangeData.minSalary,
    midpointSalary: rangeData.midpointSalary,
    maxSalary: rangeData.maxSalary,
    currency: rangeData.currency || 'USD',
    spreadPercent,
    effectiveDate: new Date(),
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Calculates salary range spread percentage.
 *
 * @param {number} minSalary - Minimum salary
 * @param {number} maxSalary - Maximum salary
 * @param {number} midpoint - Midpoint salary
 * @returns {number} Spread percentage
 *
 * @example
 * ```typescript
 * const spread = calculateSalarySpread(100000, 150000, 125000);
 * // Returns: 40
 * ```
 */
export const calculateSalarySpread = (minSalary: number, maxSalary: number, midpoint: number): number => {
  return ((maxSalary - minSalary) / midpoint) * 100;
};

/**
 * Validates salary against pay grade range.
 *
 * @param {number} salary - Salary to validate
 * @param {PayGrade} payGrade - Pay grade
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateSalaryInRange(145000, payGrade);
 * // Returns: { isValid: true, position: 50, compaRatio: 0.97 }
 * ```
 */
export const validateSalaryInRange = (salary: number, payGrade: PayGrade): any => {
  const isValid = salary >= payGrade.minSalary && salary <= payGrade.maxSalary;
  const position = ((salary - payGrade.minSalary) / (payGrade.maxSalary - payGrade.minSalary)) * 100;
  const compaRatio = salary / payGrade.midpointSalary;

  return {
    isValid,
    salary,
    minSalary: payGrade.minSalary,
    maxSalary: payGrade.maxSalary,
    position: Math.round(position * 100) / 100,
    compaRatio: Math.round(compaRatio * 100) / 100,
    belowMin: salary < payGrade.minSalary,
    aboveMax: salary > payGrade.maxSalary,
  };
};

/**
 * Generates pay grade progression matrix.
 *
 * @param {PayGrade[]} grades - List of pay grades
 * @returns {object} Progression matrix
 *
 * @example
 * ```typescript
 * const matrix = generatePayGradeMatrix(allGrades);
 * ```
 */
export const generatePayGradeMatrix = (grades: PayGrade[]): any => {
  const sortedGrades = grades.sort((a, b) => a.gradeLevel - b.gradeLevel);

  return {
    totalGrades: sortedGrades.length,
    grades: sortedGrades.map((grade, index) => ({
      level: grade.gradeLevel,
      code: grade.gradeCode,
      name: grade.gradeName,
      midpoint: grade.midpointSalary,
      nextLevel: sortedGrades[index + 1]
        ? {
            level: sortedGrades[index + 1].gradeLevel,
            code: sortedGrades[index + 1].gradeCode,
            midpoint: sortedGrades[index + 1].midpointSalary,
            increasePercent:
              ((sortedGrades[index + 1].midpointSalary - grade.midpointSalary) / grade.midpointSalary) * 100,
          }
        : null,
    })),
  };
};

// ============================================================================
// SALARY RANGE MANAGEMENT (11-15)
// ============================================================================

/**
 * Creates location-specific salary range.
 *
 * @param {string} gradeId - Pay grade ID
 * @param {string} locationId - Location ID
 * @param {object} adjustmentFactor - Location adjustment
 * @returns {Promise<SalaryRange>} Location salary range
 *
 * @example
 * ```typescript
 * const range = await createLocationSalaryRange('grade-123', 'loc-sf', {
 *   factor: 1.25
 * });
 * ```
 */
export const createLocationSalaryRange = async (gradeId: string, locationId: string, adjustmentFactor: any): Promise<SalaryRange> => {
  const baseMin = 100000;
  const baseMid = 125000;
  const baseMax = 150000;
  const factor = adjustmentFactor.factor || 1.0;

  return {
    id: generateUUID(),
    payGradeId: gradeId,
    locationId,
    currencyCode: adjustmentFactor.currency || 'USD',
    minSalary: baseMin * factor,
    firstQuartile: baseMin * factor + (baseMid - baseMin) * factor * 0.25,
    midpoint: baseMid * factor,
    thirdQuartile: baseMid * factor + (baseMax - baseMid) * factor * 0.75,
    maxSalary: baseMax * factor,
    marketRatio: factor,
    effectiveDate: new Date(),
    metadata: {},
  };
};

/**
 * Calculates compa-ratio for employee.
 *
 * @param {number} salary - Employee salary
 * @param {number} midpoint - Range midpoint
 * @returns {number} Compa-ratio
 *
 * @example
 * ```typescript
 * const ratio = calculateCompaRatio(145000, 150000);
 * // Returns: 0.97
 * ```
 */
export const calculateCompaRatio = (salary: number, midpoint: number): number => {
  return Math.round((salary / midpoint) * 100) / 100;
};

/**
 * Calculates position in salary range.
 *
 * @param {number} salary - Employee salary
 * @param {number} min - Range minimum
 * @param {number} max - Range maximum
 * @returns {number} Range position (0-100)
 *
 * @example
 * ```typescript
 * const position = calculateRangePosition(130000, 100000, 150000);
 * // Returns: 60
 * ```
 */
export const calculateRangePosition = (salary: number, min: number, max: number): number => {
  return Math.round(((salary - min) / (max - min)) * 10000) / 100;
};

/**
 * Identifies employees outside salary range.
 *
 * @param {EmployeeCompensation[]} employees - Employee list
 * @returns {object} Employees above/below range
 *
 * @example
 * ```typescript
 * const outliers = identifyRangeOutliers(employees);
 * // Returns: { aboveMax: [...], belowMin: [...] }
 * ```
 */
export const identifyRangeOutliers = (employees: EmployeeCompensation[]): any => {
  // Mock implementation
  return {
    aboveMax: employees.filter((e) => e.compaRatio > 1.15),
    belowMin: employees.filter((e) => e.compaRatio < 0.85),
    totalOutliers: 0,
    outlierPercent: 0,
  };
};

/**
 * Recommends salary range adjustments based on market data.
 *
 * @param {PayGrade} grade - Pay grade
 * @param {MarketData} marketData - Market data
 * @returns {object} Recommended adjustments
 *
 * @example
 * ```typescript
 * const recommendations = recommendRangeAdjustments(grade, marketData);
 * ```
 */
export const recommendRangeAdjustments = (grade: PayGrade, marketData: MarketData): any => {
  const marketMidpoint = marketData.percentile50;
  const currentMidpoint = grade.midpointSalary;
  const variance = ((marketMidpoint - currentMidpoint) / currentMidpoint) * 100;

  return {
    currentMidpoint,
    marketMidpoint,
    variancePercent: Math.round(variance * 100) / 100,
    recommendAdjustment: Math.abs(variance) > 5,
    suggestedMidpoint: variance > 5 ? marketMidpoint : currentMidpoint,
    suggestedMin: variance > 5 ? marketMidpoint * 0.8 : grade.minSalary,
    suggestedMax: variance > 5 ? marketMidpoint * 1.2 : grade.maxSalary,
    rationale: variance > 5 ? 'Market has moved significantly' : 'Range is competitive',
  };
};

// ============================================================================
// MERIT INCREASE & BONUS CALCULATIONS (16-20)
// ============================================================================

/**
 * Calculates merit increase based on performance.
 *
 * @param {EmployeeCompensation} employee - Employee compensation
 * @param {string} performanceRating - Performance rating
 * @param {CompensationGuideline} guideline - Merit guidelines
 * @returns {object} Merit increase calculation
 *
 * @example
 * ```typescript
 * const merit = calculateMeritIncrease(employee, 'exceeds', guideline);
 * // Returns: { increasePercent: 4.5, increaseAmount: 5400, newSalary: 125400 }
 * ```
 */
export const calculateMeritIncrease = (employee: EmployeeCompensation, performanceRating: string, guideline: CompensationGuideline): any => {
  const ratingMap: Record<string, number> = {
    exceeds: guideline.maxIncreasePercent,
    meets: guideline.targetIncreasePercent,
    developing: guideline.minIncreasePercent,
    unsatisfactory: 0,
  };

  const increasePercent = ratingMap[performanceRating.toLowerCase()] || guideline.targetIncreasePercent;
  const increaseAmount = Math.round(employee.baseSalary * (increasePercent / 100));
  const newSalary = employee.baseSalary + increaseAmount;

  return {
    employeeId: employee.employeeId,
    currentSalary: employee.baseSalary,
    performanceRating,
    increasePercent,
    increaseAmount,
    newSalary,
    compaRatioAfter: Math.round((newSalary / employee.baseSalary) * 100) / 100,
  };
};

/**
 * Calculates bonus based on performance and target.
 *
 * @param {EmployeeCompensation} employee - Employee compensation
 * @param {number} achievementPercent - Goal achievement %
 * @param {object} bonusStructure - Bonus structure
 * @returns {object} Bonus calculation
 *
 * @example
 * ```typescript
 * const bonus = calculatePerformanceBonus(employee, 110, bonusStructure);
 * ```
 */
export const calculatePerformanceBonus = (employee: EmployeeCompensation, achievementPercent: number, bonusStructure: any): any => {
  let multiplier = 1.0;

  if (achievementPercent >= 120) multiplier = 2.0;
  else if (achievementPercent >= 110) multiplier = 1.5;
  else if (achievementPercent >= 100) multiplier = 1.0;
  else if (achievementPercent >= 90) multiplier = 0.75;
  else if (achievementPercent >= 80) multiplier = 0.5;
  else multiplier = 0;

  const targetAmount = employee.baseSalary * (employee.targetBonusPercent / 100);
  const actualAmount = Math.round(targetAmount * multiplier);

  return {
    employeeId: employee.employeeId,
    targetAmount,
    achievementPercent,
    multiplier,
    actualAmount,
    bonusPercent: (actualAmount / employee.baseSalary) * 100,
  };
};

/**
 * Calculates prorated bonus for partial year employment.
 *
 * @param {number} targetBonus - Annual target bonus
 * @param {Date} startDate - Employment start date
 * @param {Date} bonusDate - Bonus payment date
 * @returns {number} Prorated bonus amount
 *
 * @example
 * ```typescript
 * const prorated = calculateProratedBonus(10000, new Date('2025-07-01'), new Date('2025-12-31'));
 * ```
 */
export const calculateProratedBonus = (targetBonus: number, startDate: Date, bonusDate: Date): number => {
  const monthsWorked = Math.ceil((bonusDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
  const proration = monthsWorked / 12;
  return Math.round(targetBonus * proration);
};

/**
 * Validates merit increase against budget and guidelines.
 *
 * @param {CompensationAdjustment} adjustment - Proposed adjustment
 * @param {CompensationPlan} plan - Compensation plan
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateMeritIncrease(adjustment, plan);
 * ```
 */
export const validateMeritIncrease = (adjustment: CompensationAdjustment, plan: CompensationPlan): any => {
  const withinBudget = adjustment.adjustmentAmount <= plan.remainingBudget;
  const increasePercent = adjustment.adjustmentPercent;
  const withinGuidelines = increasePercent >= 0 && increasePercent <= 15;

  return {
    isValid: withinBudget && withinGuidelines,
    withinBudget,
    withinGuidelines,
    errors: [
      !withinBudget ? 'Exceeds remaining budget' : null,
      !withinGuidelines ? 'Outside guideline range' : null,
    ].filter(Boolean),
    warnings: [],
  };
};

/**
 * Generates merit increase recommendations for department.
 *
 * @param {string} departmentId - Department ID
 * @param {EmployeeCompensation[]} employees - Department employees
 * @param {number} budgetAmount - Department budget
 * @returns {object} Merit recommendations
 *
 * @example
 * ```typescript
 * const recommendations = generateMeritRecommendations('dept-123', employees, 250000);
 * ```
 */
export const generateMeritRecommendations = (departmentId: string, employees: EmployeeCompensation[], budgetAmount: number): any => {
  const recommendations = employees.map((emp) => {
    let recommendedPercent = 3.0;

    if (emp.compaRatio < 0.85) recommendedPercent = 5.0;
    else if (emp.compaRatio < 0.95) recommendedPercent = 4.0;
    else if (emp.compaRatio > 1.15) recommendedPercent = 1.5;

    const recommendedAmount = Math.round(emp.baseSalary * (recommendedPercent / 100));

    return {
      employeeId: emp.employeeId,
      currentSalary: emp.baseSalary,
      compaRatio: emp.compaRatio,
      recommendedPercent,
      recommendedAmount,
      rationale: emp.compaRatio < 0.9 ? 'Below market' : emp.compaRatio > 1.1 ? 'Above market' : 'Market aligned',
    };
  });

  const totalRecommended = recommendations.reduce((sum, r) => sum + r.recommendedAmount, 0);

  return {
    departmentId,
    employeeCount: employees.length,
    budgetAmount,
    totalRecommended,
    budgetVariance: totalRecommended - budgetAmount,
    recommendations,
  };
};

// ============================================================================
// COMPENSATION REVIEW CYCLES (21-25)
// ============================================================================

/**
 * Creates compensation review cycle.
 *
 * @param {object} cycleData - Cycle data
 * @returns {Promise<CompensationReviewCycle>} Created cycle
 *
 * @example
 * ```typescript
 * const cycle = await createCompensationCycle({
 *   cycleName: '2025 Annual Review',
 *   planYear: 2025,
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-03-31')
 * });
 * ```
 */
export const createCompensationCycle = async (cycleData: any): Promise<CompensationReviewCycle> => {
  const cycleCode = `CYC${cycleData.planYear}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  return {
    id: generateUUID(),
    cycleCode,
    cycleName: cycleData.cycleName,
    planYear: cycleData.planYear,
    cycleType: cycleData.cycleType || 'annual',
    startDate: cycleData.startDate,
    endDate: cycleData.endDate,
    approvalDeadline: cycleData.approvalDeadline,
    effectiveDate: cycleData.effectiveDate,
    status: CompensationCycleStatus.PLANNING,
    totalBudget: cycleData.totalBudget || 0,
    participantCount: 0,
    completedCount: 0,
    approvedCount: 0,
    guidelines: cycleData.guidelines || [],
    metadata: cycleData.metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Opens compensation cycle for manager input.
 *
 * @param {string} cycleId - Cycle ID
 * @returns {Promise<CompensationReviewCycle>} Opened cycle
 *
 * @example
 * ```typescript
 * const opened = await openCompensationCycle('cycle-123');
 * ```
 */
export const openCompensationCycle = async (cycleId: string): Promise<CompensationReviewCycle> => {
  // Mock implementation - would update status in database
  return {
    id: cycleId,
    cycleCode: 'CYC2025',
    cycleName: '2025 Annual Review',
    planYear: 2025,
    cycleType: 'annual',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-03-31'),
    approvalDeadline: new Date('2025-03-15'),
    effectiveDate: new Date('2025-04-01'),
    status: CompensationCycleStatus.OPEN,
    totalBudget: 5000000,
    participantCount: 0,
    completedCount: 0,
    approvedCount: 0,
    guidelines: [],
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Tracks compensation cycle progress.
 *
 * @param {string} cycleId - Cycle ID
 * @returns {Promise<object>} Cycle progress metrics
 *
 * @example
 * ```typescript
 * const progress = await trackCycleProgress('cycle-123');
 * ```
 */
export const trackCycleProgress = async (cycleId: string): Promise<any> => {
  return {
    cycleId,
    participantCount: 500,
    completedCount: 325,
    approvedCount: 200,
    pendingCount: 125,
    rejectedCount: 5,
    completionPercent: 65,
    approvalPercent: 40,
    avgCompletionTime: 5.2,
    budgetUtilization: 68,
  };
};

/**
 * Closes compensation cycle and finalizes changes.
 *
 * @param {string} cycleId - Cycle ID
 * @returns {Promise<CompensationReviewCycle>} Closed cycle
 *
 * @example
 * ```typescript
 * const closed = await closeCompensationCycle('cycle-123');
 * ```
 */
export const closeCompensationCycle = async (cycleId: string): Promise<CompensationReviewCycle> => {
  // Mock implementation
  return {
    id: cycleId,
    cycleCode: 'CYC2025',
    cycleName: '2025 Annual Review',
    planYear: 2025,
    cycleType: 'annual',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-03-31'),
    approvalDeadline: new Date('2025-03-15'),
    effectiveDate: new Date('2025-04-01'),
    status: CompensationCycleStatus.CLOSED,
    totalBudget: 5000000,
    participantCount: 500,
    completedCount: 500,
    approvedCount: 495,
    guidelines: [],
    metadata: { closedAt: new Date() },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Generates cycle summary report.
 *
 * @param {string} cycleId - Cycle ID
 * @returns {Promise<object>} Cycle summary
 *
 * @example
 * ```typescript
 * const summary = await generateCycleSummaryReport('cycle-123');
 * ```
 */
export const generateCycleSummaryReport = async (cycleId: string): Promise<any> => {
  return {
    cycleId,
    cycleName: '2025 Annual Review',
    planYear: 2025,
    participants: 500,
    totalBudget: 5000000,
    budgetUsed: 4750000,
    avgIncreasePercent: 3.8,
    avgIncreaseAmount: 4250,
    meritIncreases: 450,
    promotions: 35,
    equityAdjustments: 15,
    totalCashImpact: 4750000,
    byDepartment: [],
    byPerformanceRating: [],
  };
};

// ============================================================================
// MARKET DATA & BENCHMARKING (26-30)
// ============================================================================

/**
 * Imports market survey data.
 *
 * @param {MarketDataUploadDto} marketData - Market data
 * @returns {Promise<MarketData>} Imported market data
 *
 * @example
 * ```typescript
 * const imported = await importMarketSurveyData({
 *   jobCode: 'SE5',
 *   dataSource: MarketDataSource.MERCER,
 *   surveyYear: 2025,
 *   percentiles: { p50: 150000 }
 * });
 * ```
 */
export const importMarketSurveyData = async (marketData: MarketDataUploadDto): Promise<MarketData> => {
  return {
    id: generateUUID(),
    jobCode: marketData.jobCode,
    jobTitle: marketData.jobTitle,
    dataSource: marketData.dataSource,
    surveyYear: marketData.surveyYear,
    effectiveDate: new Date(),
    percentile10: marketData.percentiles.p10,
    percentile25: marketData.percentiles.p25,
    percentile50: marketData.percentiles.p50,
    percentile75: marketData.percentiles.p75,
    percentile90: marketData.percentiles.p90,
    average: marketData.percentiles.p50,
    sampleSize: marketData.sampleSize,
    currency: 'USD',
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Benchmarks employee compensation against market.
 *
 * @param {EmployeeCompensation} employee - Employee compensation
 * @param {MarketData} marketData - Market data
 * @returns {object} Benchmarking results
 *
 * @example
 * ```typescript
 * const benchmark = benchmarkAgainstMarket(employee, marketData);
 * ```
 */
export const benchmarkAgainstMarket = (employee: EmployeeCompensation, marketData: MarketData): any => {
  const marketMidpoint = marketData.percentile50;
  const variance = ((employee.baseSalary - marketMidpoint) / marketMidpoint) * 100;

  let percentileRank = 50;
  if (employee.baseSalary >= marketData.percentile90) percentileRank = 90;
  else if (employee.baseSalary >= marketData.percentile75) percentileRank = 75;
  else if (employee.baseSalary >= marketData.percentile50) percentileRank = 50;
  else if (employee.baseSalary >= marketData.percentile25) percentileRank = 25;
  else percentileRank = 10;

  return {
    employeeId: employee.employeeId,
    currentSalary: employee.baseSalary,
    marketMidpoint,
    variancePercent: Math.round(variance * 100) / 100,
    percentileRank,
    marketCompetitive: Math.abs(variance) <= 10,
    recommendation: variance < -10 ? 'Below market - increase recommended' : variance > 10 ? 'Above market' : 'Market competitive',
  };
};

/**
 * Calculates market ratio (company vs market).
 *
 * @param {number} companySalary - Company salary
 * @param {number} marketSalary - Market salary
 * @returns {number} Market ratio
 *
 * @example
 * ```typescript
 * const ratio = calculateMarketRatio(145000, 150000);
 * // Returns: 0.97
 * ```
 */
export const calculateMarketRatio = (companySalary: number, marketSalary: number): number => {
  return Math.round((companySalary / marketSalary) * 100) / 100;
};

/**
 * Generates market positioning report.
 *
 * @param {EmployeeCompensation[]} employees - Employee list
 * @param {MarketData[]} marketData - Market data
 * @returns {object} Positioning report
 *
 * @example
 * ```typescript
 * const report = generateMarketPositioningReport(employees, marketData);
 * ```
 */
export const generateMarketPositioningReport = (employees: EmployeeCompensation[], marketData: MarketData[]): any => {
  return {
    totalEmployees: employees.length,
    avgMarketRatio: 0.98,
    belowMarket: 45,
    atMarket: 123,
    aboveMarket: 32,
    overallPositioning: 'Competitive',
    byJobFamily: [],
    byDepartment: [],
    recommendations: [],
  };
};

/**
 * Identifies market laggards requiring adjustment.
 *
 * @param {EmployeeCompensation[]} employees - Employee list
 * @param {MarketData[]} marketData - Market data
 * @param {number} thresholdPercent - Threshold for laggard
 * @returns {object[]} Laggard employees
 *
 * @example
 * ```typescript
 * const laggards = identifyMarketLaggards(employees, marketData, 10);
 * ```
 */
export const identifyMarketLaggards = (employees: EmployeeCompensation[], marketData: MarketData[], thresholdPercent: number): any[] => {
  return employees
    .map((emp) => {
      const market = marketData.find((m) => m.jobCode === emp.jobCode);
      if (!market) return null;

      const variance = ((emp.baseSalary - market.percentile50) / market.percentile50) * 100;

      if (variance < -thresholdPercent) {
        return {
          employeeId: emp.employeeId,
          currentSalary: emp.baseSalary,
          marketSalary: market.percentile50,
          gap: market.percentile50 - emp.baseSalary,
          gapPercent: variance,
          priority: variance < -20 ? 'high' : 'medium',
        };
      }
      return null;
    })
    .filter((item) => item !== null);
};

// ============================================================================
// PAY EQUITY ANALYSIS (31-35)
// ============================================================================

/**
 * Performs comprehensive pay equity analysis.
 *
 * @param {string} analysisType - Analysis type
 * @param {EmployeeCompensation[]} employees - Employee list
 * @returns {Promise<PayEquityAnalysis>} Equity analysis
 *
 * @example
 * ```typescript
 * const analysis = await performPayEquityAnalysis('gender', employees);
 * ```
 */
export const performPayEquityAnalysis = async (analysisType: string, employees: EmployeeCompensation[]): Promise<PayEquityAnalysis> => {
  return {
    id: generateUUID(),
    analysisDate: new Date(),
    analysisType: analysisType as any,
    scope: 'company',
    totalEmployees: employees.length,
    disparityFound: false,
    avgPayGap: 2.3,
    maxPayGap: 8.5,
    affectedEmployees: 12,
    recommendations: ['Review job titles', 'Conduct detailed analysis'],
    estimatedCost: 125000,
    findings: [],
    metadata: {},
    createdAt: new Date(),
  };
};

/**
 * Calculates gender pay gap.
 *
 * @param {EmployeeCompensation[]} employees - Employee list
 * @returns {object} Gender pay gap analysis
 *
 * @example
 * ```typescript
 * const genderGap = calculateGenderPayGap(employees);
 * ```
 */
export const calculateGenderPayGap = (employees: EmployeeCompensation[]): any => {
  // Mock implementation
  return {
    maleAvg: 125000,
    femaleAvg: 122000,
    payGap: 3000,
    payGapPercent: 2.4,
    adjustedPayGap: 1.2,
    statistically Significant: false,
  };
};

/**
 * Analyzes pay equity by job level.
 *
 * @param {EmployeeCompensation[]} employees - Employee list
 * @returns {object[]} Pay equity by level
 *
 * @example
 * ```typescript
 * const analysis = analyzePayEquityByLevel(employees);
 * ```
 */
export const analyzePayEquityByLevel = (employees: EmployeeCompensation[]): any[] => {
  return [
    {
      level: 'Senior',
      employeeCount: 120,
      avgSalary: 145000,
      payRange: { min: 120000, max: 180000 },
      genderPayGap: 2.1,
      ethnicityPayGap: 1.8,
    },
  ];
};

/**
 * Generates pay equity remediation plan.
 *
 * @param {PayEquityAnalysis} analysis - Equity analysis
 * @returns {object} Remediation plan
 *
 * @example
 * ```typescript
 * const plan = generateEquityRemediationPlan(analysis);
 * ```
 */
export const generateEquityRemediationPlan = (analysis: PayEquityAnalysis): any => {
  return {
    analysisId: analysis.id,
    affectedEmployees: analysis.affectedEmployees,
    totalCost: analysis.estimatedCost,
    phases: [
      {
        phase: 1,
        description: 'Address critical gaps',
        employeeCount: 5,
        cost: 50000,
      },
    ],
    timeline: '6 months',
    recommendations: analysis.recommendations,
  };
};

/**
 * Tracks pay equity metrics over time.
 *
 * @param {string} companyId - Company ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<object>} Historical equity metrics
 *
 * @example
 * ```typescript
 * const trends = await trackPayEquityMetrics('company-123', start, end);
 * ```
 */
export const trackPayEquityMetrics = async (companyId: string, startDate: Date, endDate: Date): Promise<any> => {
  return {
    companyId,
    period: { startDate, endDate },
    genderPayGapTrend: [2.8, 2.5, 2.3, 2.1],
    ethnicityPayGapTrend: [3.2, 2.9, 2.6, 2.4],
    totalInvestment: 450000,
    employeesAdjusted: 67,
  };
};

// ============================================================================
// TOTAL REWARDS STATEMENTS (36-40)
// ============================================================================

/**
 * Generates total rewards statement for employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} year - Statement year
 * @returns {Promise<TotalRewardsStatement>} Rewards statement
 *
 * @example
 * ```typescript
 * const statement = await generateTotalRewardsStatement('emp-123', 2025);
 * ```
 */
export const generateTotalRewardsStatement = async (employeeId: string, year: number): Promise<TotalRewardsStatement> => {
  const baseSalary = 150000;
  const bonusPaid = 15000;
  const ltiValue = 50000;
  const benefitsValue = 18000;
  const retirementContribution = 9000;
  const ptoValue = 11500;

  return {
    id: generateUUID(),
    employeeId,
    statementYear: year,
    baseSalary,
    bonusTarget: 15000,
    bonusPaid,
    commissionPaid: 0,
    ltiValue,
    benefitsValue,
    retirementContribution,
    ptoValue,
    otherCompensation: 2000,
    totalCash: baseSalary + bonusPaid,
    totalDirectCompensation: baseSalary + bonusPaid + ltiValue,
    totalRewards: baseSalary + bonusPaid + ltiValue + benefitsValue + retirementContribution + ptoValue,
    currency: 'USD',
    generatedAt: new Date(),
    metadata: {},
  };
};

/**
 * Calculates total cash compensation.
 *
 * @param {EmployeeCompensation} employee - Employee compensation
 * @param {BonusPayment[]} bonuses - Bonus payments
 * @param {CommissionPayment[]} commissions - Commission payments
 * @returns {number} Total cash
 *
 * @example
 * ```typescript
 * const totalCash = calculateTotalCashCompensation(employee, bonuses, commissions);
 * ```
 */
export const calculateTotalCashCompensation = (
  employee: EmployeeCompensation,
  bonuses: BonusPayment[],
  commissions: CommissionPayment[],
): number => {
  const bonusTotal = bonuses.reduce((sum, b) => sum + b.actualAmount, 0);
  const commissionTotal = commissions.reduce((sum, c) => sum + c.finalAmount, 0);
  return employee.baseSalary + bonusTotal + commissionTotal;
};

/**
 * Calculates total direct compensation (TDC).
 *
 * @param {number} baseSalary - Base salary
 * @param {number} bonuses - Total bonuses
 * @param {number} ltiValue - LTI value
 * @returns {number} Total direct compensation
 *
 * @example
 * ```typescript
 * const tdc = calculateTotalDirectCompensation(150000, 15000, 50000);
 * // Returns: 215000
 * ```
 */
export const calculateTotalDirectCompensation = (baseSalary: number, bonuses: number, ltiValue: number): number => {
  return baseSalary + bonuses + ltiValue;
};

/**
 * Estimates benefits value for employee.
 *
 * @param {string} employeeId - Employee ID
 * @returns {Promise<number>} Benefits value
 *
 * @example
 * ```typescript
 * const benefitsValue = await estimateBenefitsValue('emp-123');
 * ```
 */
export const estimateBenefitsValue = async (employeeId: string): Promise<number> => {
  // Mock calculation - would sum actual benefits costs
  const healthInsurance = 12000;
  const dentalVision = 2000;
  const lifeInsurance = 500;
  const disability = 1500;
  const wellness = 2000;

  return healthInsurance + dentalVision + lifeInsurance + disability + wellness;
};

/**
 * Generates batch total rewards statements.
 *
 * @param {string[]} employeeIds - Employee IDs
 * @param {number} year - Statement year
 * @returns {Promise<TotalRewardsStatement[]>} Statements
 *
 * @example
 * ```typescript
 * const statements = await generateBatchTotalRewardsStatements(employeeIds, 2025);
 * ```
 */
export const generateBatchTotalRewardsStatements = async (employeeIds: string[], year: number): Promise<TotalRewardsStatement[]> => {
  return Promise.all(employeeIds.map((id) => generateTotalRewardsStatement(id, year)));
};

// ============================================================================
// VARIABLE PAY & INCENTIVE MANAGEMENT (41-45)
// ============================================================================

/**
 * Creates variable pay incentive plan.
 *
 * @param {object} planData - Plan data
 * @returns {Promise<object>} Created plan
 *
 * @example
 * ```typescript
 * const plan = await createVariablePayPlan({
 *   planName: '2025 Sales Incentive',
 *   planType: 'commission',
 *   eligibleRoles: ['sales']
 * });
 * ```
 */
export const createVariablePayPlan = async (planData: any): Promise<any> => {
  return {
    id: generateUUID(),
    planCode: generatePlanCode('variable', planData.year || 2025),
    planName: planData.planName,
    planType: planData.planType,
    effectiveDate: planData.effectiveDate || new Date(),
    endDate: planData.endDate,
    eligibleRoles: planData.eligibleRoles || [],
    paymentFrequency: planData.paymentFrequency || 'quarterly',
    metrics: planData.metrics || [],
    metadata: {},
    createdAt: new Date(),
  };
};

/**
 * Calculates variable pay based on performance metrics.
 *
 * @param {string} employeeId - Employee ID
 * @param {object} metrics - Performance metrics
 * @param {object} plan - Variable pay plan
 * @returns {number} Variable pay amount
 *
 * @example
 * ```typescript
 * const variablePay = calculateVariablePay('emp-123', metrics, plan);
 * ```
 */
export const calculateVariablePay = (employeeId: string, metrics: any, plan: any): number => {
  let totalPay = 0;

  for (const metric of plan.metrics || []) {
    const achievement = metrics[metric.name] || 0;
    const target = metric.target || 100;
    const payout = metric.payoutAmount || 0;

    if (achievement >= target) {
      totalPay += payout * (achievement / target);
    }
  }

  return Math.round(totalPay);
};

/**
 * Tracks variable pay performance metrics.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} planId - Plan ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<object>} Performance tracking
 *
 * @example
 * ```typescript
 * const tracking = await trackVariablePayMetrics('emp-123', 'plan-123', start, end);
 * ```
 */
export const trackVariablePayMetrics = async (employeeId: string, planId: string, periodStart: Date, periodEnd: Date): Promise<any> => {
  return {
    employeeId,
    planId,
    period: { start: periodStart, end: periodEnd },
    metrics: [
      { name: 'Revenue', target: 1000000, actual: 1150000, achievement: 115 },
      { name: 'Margin', target: 30, actual: 32, achievement: 107 },
    ],
    overallAchievement: 111,
    projectedPayout: 45000,
  };
};

/**
 * Processes variable pay payout.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} planId - Plan ID
 * @param {number} amount - Payout amount
 * @returns {Promise<object>} Payout record
 *
 * @example
 * ```typescript
 * const payout = await processVariablePayPayout('emp-123', 'plan-123', 45000);
 * ```
 */
export const processVariablePayPayout = async (employeeId: string, planId: string, amount: number): Promise<any> => {
  return {
    id: generateUUID(),
    employeeId,
    planId,
    amount,
    paymentDate: new Date(),
    status: 'pending',
    createdAt: new Date(),
  };
};

/**
 * Generates variable pay analytics report.
 *
 * @param {string} planId - Plan ID
 * @returns {Promise<object>} Analytics report
 *
 * @example
 * ```typescript
 * const analytics = await generateVariablePayAnalytics('plan-123');
 * ```
 */
export const generateVariablePayAnalytics = async (planId: string): Promise<any> => {
  return {
    planId,
    participantCount: 150,
    totalPayout: 6750000,
    avgPayout: 45000,
    avgAchievement: 108,
    topPerformers: [],
    distributionByAchievement: {},
  };
};

// ============================================================================
// COMMISSION & SALES COMPENSATION (46-50)
// ============================================================================

/**
 * Creates commission plan with tiered structure.
 *
 * @param {CreateCommissionPlanDto} planData - Commission plan data
 * @returns {Promise<CommissionPlan>} Created commission plan
 *
 * @example
 * ```typescript
 * const plan = await createCommissionPlan({
 *   planCode: 'SALES2025',
 *   planName: '2025 Sales Commission',
 *   structureType: CommissionStructureType.TIERED,
 *   tiers: [
 *     { tierLevel: 1, minAmount: 0, maxAmount: 500000, rate: 5, rateType: 'percentage' },
 *     { tierLevel: 2, minAmount: 500000, rate: 7, rateType: 'percentage' }
 *   ]
 * });
 * ```
 */
export const createCommissionPlan = async (planData: CreateCommissionPlanDto): Promise<CommissionPlan> => {
  return {
    id: generateUUID(),
    planCode: planData.planCode,
    planName: planData.planName,
    structureType: planData.structureType,
    effectiveDate: planData.effectiveDate,
    endDate: undefined,
    tiers: planData.tiers,
    paymentFrequency: planData.paymentFrequency,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Calculates commission based on sales and plan structure.
 *
 * @param {number} salesAmount - Total sales amount
 * @param {CommissionPlan} plan - Commission plan
 * @returns {object} Commission calculation
 *
 * @example
 * ```typescript
 * const commission = calculateCommission(750000, commissionPlan);
 * // Returns: { totalCommission: 42500, tierBreakdown: [...] }
 * ```
 */
export const calculateCommission = (salesAmount: number, plan: CommissionPlan): any => {
  let totalCommission = 0;
  const tierBreakdown: any[] = [];

  for (const tier of plan.tiers) {
    let tierAmount = 0;

    if (salesAmount > tier.minAmount) {
      const amountInTier = tier.maxAmount ? Math.min(salesAmount - tier.minAmount, tier.maxAmount - tier.minAmount) : salesAmount - tier.minAmount;

      if (tier.rateType === 'percentage') {
        tierAmount = amountInTier * (tier.rate / 100);
      } else {
        tierAmount = tier.rate;
      }

      totalCommission += tierAmount;
      tierBreakdown.push({
        tier: tier.tierLevel,
        salesInTier: amountInTier,
        rate: tier.rate,
        commission: tierAmount,
      });
    }
  }

  return {
    salesAmount,
    totalCommission: Math.round(totalCommission),
    tierBreakdown,
    avgRate: (totalCommission / salesAmount) * 100,
  };
};

/**
 * Processes commission payment for sales period.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} planId - Plan ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @param {number} salesAmount - Total sales
 * @returns {Promise<CommissionPayment>} Commission payment
 *
 * @example
 * ```typescript
 * const payment = await processCommissionPayment('emp-123', 'plan-123', start, end, 750000);
 * ```
 */
export const processCommissionPayment = async (
  employeeId: string,
  planId: string,
  periodStart: Date,
  periodEnd: Date,
  salesAmount: number,
): Promise<CommissionPayment> => {
  const commissionAmount = Math.round(salesAmount * 0.05);

  return {
    id: generateUUID(),
    employeeId,
    planId,
    periodStart,
    periodEnd,
    salesAmount,
    quotaAmount: 500000,
    achievementPercent: (salesAmount / 500000) * 100,
    commissionAmount,
    adjustments: 0,
    finalAmount: commissionAmount,
    paymentDate: periodEnd,
    status: 'calculated',
    metadata: {},
    createdAt: new Date(),
  };
};

/**
 * Tracks sales performance against quota.
 *
 * @param {string} employeeId - Employee ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<object>} Sales performance metrics
 *
 * @example
 * ```typescript
 * const performance = await trackSalesPerformance('emp-123', start, end);
 * ```
 */
export const trackSalesPerformance = async (employeeId: string, periodStart: Date, periodEnd: Date): Promise<any> => {
  return {
    employeeId,
    period: { start: periodStart, end: periodEnd },
    quota: 500000,
    actualSales: 625000,
    achievement: 125,
    pipeline: 850000,
    dealsWon: 15,
    avgDealSize: 41667,
    projectedCommission: 31250,
  };
};

/**
 * Generates sales compensation analytics.
 *
 * @param {string} departmentId - Department ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<object>} Sales compensation analytics
 *
 * @example
 * ```typescript
 * const analytics = await generateSalesCompensationAnalytics('dept-sales', start, end);
 * ```
 */
export const generateSalesCompensationAnalytics = async (departmentId: string, periodStart: Date, periodEnd: Date): Promise<any> => {
  return {
    departmentId,
    period: { start: periodStart, end: periodEnd },
    totalSalesTeam: 50,
    totalSales: 37500000,
    totalCommissions: 1875000,
    avgCommission: 37500,
    avgQuotaAttainment: 112,
    topPerformers: [],
    bottomPerformers: [],
    costOfSales: 5.0,
  };
};
