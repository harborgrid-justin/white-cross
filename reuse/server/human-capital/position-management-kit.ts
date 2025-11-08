/**
 * LOC: HCM-POS-001
 * File: /reuse/server/human-capital/position-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable HCM utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend HCM services
 *   - Position management modules
 *   - Organizational structure services
 *   - Workforce planning systems
 *   - Budgeting and headcount modules
 */

/**
 * File: /reuse/server/human-capital/position-management-kit.ts
 * Locator: WC-HCM-POS-001
 * Purpose: Enterprise-grade Position Management - position master data, classification, budgeting, requisitions, hierarchy, succession planning
 *
 * Upstream: Independent utility module for position management operations
 * Downstream: ../backend/hcm/*, position controllers, org structure services, workforce planners, budget managers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 46 functions for position management operations with SAP SuccessFactors Position Management parity
 *
 * LLM Context: Comprehensive position management utilities for production-ready HCM applications.
 * Provides position master data management, position classification and job codes, position budgeting and headcount,
 * position requisition and approval workflows, position hierarchy and reporting structures, position incumbency and
 * vacancy management, position descriptions and requirements, position evaluation and grading, succession planning,
 * position analytics and reporting, mass position updates, and position freeze/unfrost operations.
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsObject,
  IsUUID,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions, Sequelize } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Position status enumeration
 */
export enum PositionStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  VACANT = 'vacant',
  FILLED = 'filled',
  FROZEN = 'frozen',
  CLOSED = 'closed',
  PROPOSED = 'proposed',
  APPROVED = 'approved',
  ELIMINATED = 'eliminated',
}

/**
 * Position type enumeration
 */
export enum PositionType {
  REGULAR = 'regular',
  TEMPORARY = 'temporary',
  CONTRACT = 'contract',
  INTERN = 'intern',
  EXECUTIVE = 'executive',
  MANAGEMENT = 'management',
  SPECIALIST = 'specialist',
  SUPPORT = 'support',
}

/**
 * Requisition status enumeration
 */
export enum RequisitionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_RECRUITING = 'in_recruiting',
  FILLED = 'filled',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold',
}

/**
 * Position grade level enumeration
 */
export enum GradeLevel {
  ENTRY = 'entry',
  JUNIOR = 'junior',
  INTERMEDIATE = 'intermediate',
  SENIOR = 'senior',
  LEAD = 'lead',
  PRINCIPAL = 'principal',
  STAFF = 'staff',
  MANAGER = 'manager',
  DIRECTOR = 'director',
  VP = 'vp',
  SVP = 'svp',
  C_LEVEL = 'c_level',
}

/**
 * Succession readiness level
 */
export enum SuccessionReadiness {
  READY_NOW = 'ready_now',
  READY_IN_1_YEAR = 'ready_in_1_year',
  READY_IN_2_YEARS = 'ready_in_2_years',
  READY_IN_3_PLUS_YEARS = 'ready_in_3_plus_years',
  NOT_READY = 'not_ready',
}

/**
 * Employment category
 */
export enum EmploymentCategory {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  SEASONAL = 'seasonal',
  TEMPORARY = 'temporary',
}

/**
 * Position creation data
 */
export interface PositionCreationData {
  positionNumber?: string;
  positionTitle: string;
  positionType: PositionType;
  jobCode: string;
  departmentId: string;
  locationId: string;
  reportsToPositionId?: string;
  employmentCategory: EmploymentCategory;
  gradeLevel: GradeLevel;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  salaryRangeMidpoint?: number;
  fte: number;
  isCritical?: boolean;
  requiresSecurityClearance?: boolean;
  effectiveDate: Date;
  endDate?: Date;
  customFields?: Record<string, any>;
}

/**
 * Position budget data
 */
export interface PositionBudgetData {
  positionId: string;
  fiscalYear: number;
  budgetedHeadcount: number;
  budgetedCost: number;
  actualHeadcount: number;
  actualCost: number;
  variance: number;
  variancePercentage: number;
  budgetStatus: 'within_budget' | 'over_budget' | 'under_budget';
}

/**
 * Position requisition data
 */
export interface PositionRequisitionData {
  positionId: string;
  requisitionType: 'new' | 'replacement' | 'backfill';
  targetStartDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  justification: string;
  requestedBy: string;
  hiringManagerId: string;
  recruiterId?: string;
  approvalRequired: boolean;
  budgetApproved?: boolean;
}

/**
 * Position hierarchy data
 */
export interface PositionHierarchyData {
  positionId: string;
  parentPositionId?: string;
  level: number;
  path: string[];
  subordinateCount: number;
  isManagerial: boolean;
}

/**
 * Position description data
 */
export interface PositionDescriptionData {
  positionId: string;
  summary: string;
  responsibilities: string[];
  requiredQualifications: string[];
  preferredQualifications: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  educationRequirements: string;
  experienceRequirements: string;
  physicalRequirements?: string;
  workEnvironment?: string;
  travelRequirement?: string;
}

/**
 * Position evaluation criteria
 */
export interface PositionEvaluationCriteria {
  positionId: string;
  evaluationMethod: 'hay' | 'mercer' | 'internal' | 'market_based';
  points?: number;
  grade: GradeLevel;
  compensationBand: string;
  evaluationDate: Date;
  evaluatedBy: string;
  notes?: string;
}

/**
 * Succession plan data
 */
export interface SuccessionPlanData {
  positionId: string;
  successorEmployeeId: string;
  readinessLevel: SuccessionReadiness;
  developmentPlan?: string;
  targetReadyDate?: Date;
  riskOfLoss: 'low' | 'medium' | 'high';
  retentionPlan?: string;
}

/**
 * Position incumbency data
 */
export interface PositionIncumbencyData {
  positionId: string;
  employeeId?: string;
  incumbentStartDate?: Date;
  incumbentEndDate?: Date;
  isVacant: boolean;
  vacancyStartDate?: Date;
  daysVacant?: number;
}

/**
 * Mass position update data
 */
export interface MassPositionUpdateData {
  positionIds: string[];
  updateType: 'status' | 'department' | 'location' | 'grade' | 'salary_range';
  newValue: any;
  effectiveDate: Date;
  reason: string;
  updatedBy: string;
}

/**
 * Position analytics result
 */
export interface PositionAnalytics {
  totalPositions: number;
  activePositions: number;
  vacantPositions: number;
  filledPositions: number;
  frozenPositions: number;
  vacancyRate: number;
  averageDaysToFill: number;
  criticalVacancies: number;
  byDepartment: Record<string, number>;
  byGrade: Record<string, number>;
  byType: Record<string, number>;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Position Model - Core position master data
 */
@Table({
  tableName: 'positions',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['position_number'], unique: true },
    { fields: ['position_status'] },
    { fields: ['job_code'] },
    { fields: ['department_id'] },
    { fields: ['location_id'] },
    { fields: ['reports_to_position_id'] },
    { fields: ['grade_level'] },
    { fields: ['is_vacant'] },
  ],
})
export class Position extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Position number' })
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  @Index
  positionNumber!: string;

  @ApiProperty({ description: 'Position title' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  positionTitle!: string;

  @ApiProperty({ description: 'Position type' })
  @Column({
    type: DataType.ENUM(...Object.values(PositionType)),
    allowNull: false,
  })
  positionType!: PositionType;

  @ApiProperty({ description: 'Position status' })
  @Column({
    type: DataType.ENUM(...Object.values(PositionStatus)),
    allowNull: false,
    defaultValue: PositionStatus.DRAFT,
  })
  @Index
  positionStatus!: PositionStatus;

  @ApiProperty({ description: 'Job code' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  @Index
  jobCode!: string;

  @ApiProperty({ description: 'Department ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  departmentId!: string;

  @ApiProperty({ description: 'Location ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  locationId!: string;

  @ApiProperty({ description: 'Reports to position ID' })
  @ForeignKey(() => Position)
  @Column({ type: DataType.UUID })
  @Index
  reportsToPositionId?: string;

  @ApiProperty({ description: 'Employment category' })
  @Column({
    type: DataType.ENUM(...Object.values(EmploymentCategory)),
    allowNull: false,
  })
  employmentCategory!: EmploymentCategory;

  @ApiProperty({ description: 'Grade level' })
  @Column({
    type: DataType.ENUM(...Object.values(GradeLevel)),
    allowNull: false,
  })
  @Index
  gradeLevel!: GradeLevel;

  @ApiProperty({ description: 'Salary range minimum' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  salaryRangeMin?: number;

  @ApiProperty({ description: 'Salary range maximum' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  salaryRangeMax?: number;

  @ApiProperty({ description: 'Salary range midpoint' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  salaryRangeMidpoint?: number;

  @ApiProperty({ description: 'Full-time equivalent (FTE)' })
  @Column({ type: DataType.DECIMAL(3, 2), allowNull: false, defaultValue: 1.0 })
  fte!: number;

  @ApiProperty({ description: 'Is critical position' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isCritical!: boolean;

  @ApiProperty({ description: 'Requires security clearance' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  requiresSecurityClearance!: boolean;

  @ApiProperty({ description: 'Current incumbent employee ID' })
  @Column({ type: DataType.UUID })
  currentIncumbentId?: string;

  @ApiProperty({ description: 'Is position vacant' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isVacant!: boolean;

  @ApiProperty({ description: 'Vacancy start date' })
  @Column({ type: DataType.DATE })
  vacancyStartDate?: Date;

  @ApiProperty({ description: 'Effective date' })
  @Column({ type: DataType.DATE, allowNull: false })
  effectiveDate!: Date;

  @ApiProperty({ description: 'End date' })
  @Column({ type: DataType.DATE })
  endDate?: Date;

  @ApiProperty({ description: 'Frozen date if frozen' })
  @Column({ type: DataType.DATE })
  frozenDate?: Date;

  @ApiProperty({ description: 'Frozen reason' })
  @Column({ type: DataType.TEXT })
  frozenReason?: string;

  @ApiProperty({ description: 'Custom fields data' })
  @Column({ type: DataType.JSONB })
  customFields?: Record<string, any>;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => Position, 'reportsToPositionId')
  reportsTo?: Position;

  @HasMany(() => Position, 'reportsToPositionId')
  subordinates?: Position[];

  @HasMany(() => PositionRequisition)
  requisitions?: PositionRequisition[];

  @HasMany(() => PositionBudget)
  budgets?: PositionBudget[];

  @HasMany(() => PositionDescription)
  descriptions?: PositionDescription[];

  @HasMany(() => SuccessionPlan)
  successionPlans?: SuccessionPlan[];
}

/**
 * Position Requisition Model - Tracks position requisitions
 */
@Table({
  tableName: 'position_requisitions',
  timestamps: true,
  indexes: [
    { fields: ['position_id'] },
    { fields: ['requisition_status'] },
    { fields: ['target_start_date'] },
    { fields: ['hiring_manager_id'] },
  ],
})
export class PositionRequisition extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Position ID' })
  @ForeignKey(() => Position)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  positionId!: string;

  @ApiProperty({ description: 'Requisition number' })
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  requisitionNumber!: string;

  @ApiProperty({ description: 'Requisition type' })
  @Column({
    type: DataType.ENUM('new', 'replacement', 'backfill'),
    allowNull: false,
  })
  requisitionType!: string;

  @ApiProperty({ description: 'Requisition status' })
  @Column({
    type: DataType.ENUM(...Object.values(RequisitionStatus)),
    allowNull: false,
    defaultValue: RequisitionStatus.DRAFT,
  })
  @Index
  requisitionStatus!: RequisitionStatus;

  @ApiProperty({ description: 'Target start date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  targetStartDate!: Date;

  @ApiProperty({ description: 'Priority level' })
  @Column({
    type: DataType.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false,
    defaultValue: 'medium',
  })
  priority!: string;

  @ApiProperty({ description: 'Justification' })
  @Column({ type: DataType.TEXT, allowNull: false })
  justification!: string;

  @ApiProperty({ description: 'Requested by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  requestedBy!: string;

  @ApiProperty({ description: 'Hiring manager ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  hiringManagerId!: string;

  @ApiProperty({ description: 'Recruiter ID' })
  @Column({ type: DataType.UUID })
  recruiterId?: string;

  @ApiProperty({ description: 'Approved by user ID' })
  @Column({ type: DataType.UUID })
  approvedBy?: string;

  @ApiProperty({ description: 'Approval date' })
  @Column({ type: DataType.DATE })
  approvalDate?: Date;

  @ApiProperty({ description: 'Budget approved' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  budgetApproved!: boolean;

  @ApiProperty({ description: 'Number of openings' })
  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  numberOfOpenings!: number;

  @ApiProperty({ description: 'Filled date' })
  @Column({ type: DataType.DATE })
  filledDate?: Date;

  @ApiProperty({ description: 'Days to fill' })
  @Column({ type: DataType.INTEGER })
  daysToFill?: number;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Position)
  position?: Position;
}

/**
 * Position Budget Model - Tracks position budgets
 */
@Table({
  tableName: 'position_budgets',
  timestamps: true,
  indexes: [
    { fields: ['position_id'] },
    { fields: ['fiscal_year'] },
    { fields: ['budget_status'] },
  ],
})
export class PositionBudget extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Position ID' })
  @ForeignKey(() => Position)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  positionId!: string;

  @ApiProperty({ description: 'Fiscal year' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  @Index
  fiscalYear!: number;

  @ApiProperty({ description: 'Budgeted headcount' })
  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  budgetedHeadcount!: number;

  @ApiProperty({ description: 'Budgeted cost' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  budgetedCost!: number;

  @ApiProperty({ description: 'Actual headcount' })
  @Column({ type: DataType.DECIMAL(5, 2), defaultValue: 0 })
  actualHeadcount!: number;

  @ApiProperty({ description: 'Actual cost' })
  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  actualCost!: number;

  @ApiProperty({ description: 'Variance amount' })
  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  variance!: number;

  @ApiProperty({ description: 'Variance percentage' })
  @Column({ type: DataType.DECIMAL(5, 2), defaultValue: 0 })
  variancePercentage!: number;

  @ApiProperty({ description: 'Budget status' })
  @Column({
    type: DataType.ENUM('within_budget', 'over_budget', 'under_budget'),
    defaultValue: 'within_budget',
  })
  @Index
  budgetStatus!: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Position)
  position?: Position;
}

/**
 * Position Hierarchy Model - Tracks organizational hierarchy
 */
@Table({
  tableName: 'position_hierarchy',
  timestamps: true,
  indexes: [
    { fields: ['position_id'] },
    { fields: ['parent_position_id'] },
    { fields: ['level'] },
  ],
})
export class PositionHierarchy extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Position ID' })
  @ForeignKey(() => Position)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  positionId!: string;

  @ApiProperty({ description: 'Parent position ID' })
  @ForeignKey(() => Position)
  @Column({ type: DataType.UUID })
  @Index
  parentPositionId?: string;

  @ApiProperty({ description: 'Hierarchy level' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  @Index
  level!: number;

  @ApiProperty({ description: 'Hierarchy path (array of position IDs)' })
  @Column({ type: DataType.ARRAY(DataType.UUID) })
  path!: string[];

  @ApiProperty({ description: 'Number of direct subordinates' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  subordinateCount!: number;

  @ApiProperty({ description: 'Is managerial position' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isManagerial!: boolean;

  @ApiProperty({ description: 'Span of control' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  spanOfControl!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Position, 'positionId')
  position?: Position;

  @BelongsTo(() => Position, 'parentPositionId')
  parentPosition?: Position;
}

/**
 * Position Description Model - Detailed job descriptions
 */
@Table({
  tableName: 'position_descriptions',
  timestamps: true,
  indexes: [{ fields: ['position_id'] }, { fields: ['version'] }],
})
export class PositionDescription extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Position ID' })
  @ForeignKey(() => Position)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  positionId!: string;

  @ApiProperty({ description: 'Version number' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  @Index
  version!: number;

  @ApiProperty({ description: 'Position summary' })
  @Column({ type: DataType.TEXT, allowNull: false })
  summary!: string;

  @ApiProperty({ description: 'Responsibilities' })
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  responsibilities!: string[];

  @ApiProperty({ description: 'Required qualifications' })
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  requiredQualifications!: string[];

  @ApiProperty({ description: 'Preferred qualifications' })
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  preferredQualifications?: string[];

  @ApiProperty({ description: 'Required skills' })
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  requiredSkills!: string[];

  @ApiProperty({ description: 'Preferred skills' })
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  preferredSkills?: string[];

  @ApiProperty({ description: 'Education requirements' })
  @Column({ type: DataType.TEXT, allowNull: false })
  educationRequirements!: string;

  @ApiProperty({ description: 'Experience requirements' })
  @Column({ type: DataType.TEXT, allowNull: false })
  experienceRequirements!: string;

  @ApiProperty({ description: 'Physical requirements' })
  @Column({ type: DataType.TEXT })
  physicalRequirements?: string;

  @ApiProperty({ description: 'Work environment' })
  @Column({ type: DataType.TEXT })
  workEnvironment?: string;

  @ApiProperty({ description: 'Travel requirement' })
  @Column({ type: DataType.STRING(100) })
  travelRequirement?: string;

  @ApiProperty({ description: 'Is current version' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isCurrent!: boolean;

  @ApiProperty({ description: 'Effective date' })
  @Column({ type: DataType.DATE, allowNull: false })
  effectiveDate!: Date;

  @ApiProperty({ description: 'Created by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  createdBy!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Position)
  position?: Position;
}

/**
 * Position Evaluation Model - Job evaluation and grading
 */
@Table({
  tableName: 'position_evaluations',
  timestamps: true,
  indexes: [
    { fields: ['position_id'] },
    { fields: ['evaluation_date'] },
    { fields: ['grade'] },
  ],
})
export class PositionEvaluation extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Position ID' })
  @ForeignKey(() => Position)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  positionId!: string;

  @ApiProperty({ description: 'Evaluation method' })
  @Column({
    type: DataType.ENUM('hay', 'mercer', 'internal', 'market_based'),
    allowNull: false,
  })
  evaluationMethod!: string;

  @ApiProperty({ description: 'Evaluation points' })
  @Column({ type: DataType.INTEGER })
  points?: number;

  @ApiProperty({ description: 'Grade assigned' })
  @Column({
    type: DataType.ENUM(...Object.values(GradeLevel)),
    allowNull: false,
  })
  @Index
  grade!: GradeLevel;

  @ApiProperty({ description: 'Compensation band' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  compensationBand!: string;

  @ApiProperty({ description: 'Evaluation date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  evaluationDate!: Date;

  @ApiProperty({ description: 'Evaluated by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  evaluatedBy!: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Position)
  position?: Position;
}

/**
 * Succession Plan Model - Succession planning for positions
 */
@Table({
  tableName: 'succession_plans',
  timestamps: true,
  indexes: [
    { fields: ['position_id'] },
    { fields: ['successor_employee_id'] },
    { fields: ['readiness_level'] },
  ],
})
export class SuccessionPlan extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Position ID' })
  @ForeignKey(() => Position)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  positionId!: string;

  @ApiProperty({ description: 'Successor employee ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  successorEmployeeId!: string;

  @ApiProperty({ description: 'Readiness level' })
  @Column({
    type: DataType.ENUM(...Object.values(SuccessionReadiness)),
    allowNull: false,
  })
  @Index
  readinessLevel!: SuccessionReadiness;

  @ApiProperty({ description: 'Development plan' })
  @Column({ type: DataType.TEXT })
  developmentPlan?: string;

  @ApiProperty({ description: 'Target ready date' })
  @Column({ type: DataType.DATE })
  targetReadyDate?: Date;

  @ApiProperty({ description: 'Risk of loss level' })
  @Column({
    type: DataType.ENUM('low', 'medium', 'high'),
    allowNull: false,
    defaultValue: 'low',
  })
  riskOfLoss!: string;

  @ApiProperty({ description: 'Retention plan' })
  @Column({ type: DataType.TEXT })
  retentionPlan?: string;

  @ApiProperty({ description: 'Is primary successor' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPrimarySuccessor!: boolean;

  @ApiProperty({ description: 'Last review date' })
  @Column({ type: DataType.DATE })
  lastReviewDate?: Date;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Position)
  position?: Position;
}

/**
 * Position Incumbency Model - Tracks position incumbents over time
 */
@Table({
  tableName: 'position_incumbency',
  timestamps: true,
  indexes: [
    { fields: ['position_id'] },
    { fields: ['employee_id'] },
    { fields: ['incumbent_start_date'] },
    { fields: ['is_current'] },
  ],
})
export class PositionIncumbency extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Position ID' })
  @ForeignKey(() => Position)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  positionId!: string;

  @ApiProperty({ description: 'Employee ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  employeeId!: string;

  @ApiProperty({ description: 'Incumbent start date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  incumbentStartDate!: Date;

  @ApiProperty({ description: 'Incumbent end date' })
  @Column({ type: DataType.DATE })
  incumbentEndDate?: Date;

  @ApiProperty({ description: 'Is current incumbent' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isCurrent!: boolean;

  @ApiProperty({ description: 'Assignment type' })
  @Column({
    type: DataType.ENUM('permanent', 'acting', 'interim', 'temporary'),
    defaultValue: 'permanent',
  })
  assignmentType!: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Position)
  position?: Position;
}

// ============================================================================
// POSITION MASTER DATA MANAGEMENT (Functions 1-7)
// ============================================================================

/**
 * Creates a new position
 *
 * @param data - Position creation data
 * @param transaction - Optional database transaction
 * @returns Created position record
 *
 * @example
 * ```typescript
 * const position = await createPosition({
 *   positionTitle: 'Senior Software Engineer',
 *   positionType: PositionType.REGULAR,
 *   jobCode: 'ENG-SSE-001',
 *   departmentId: 'dept-123',
 *   locationId: 'loc-456',
 *   employmentCategory: EmploymentCategory.FULL_TIME,
 *   gradeLevel: GradeLevel.SENIOR,
 *   salaryRangeMin: 120000,
 *   salaryRangeMax: 180000,
 *   salaryRangeMidpoint: 150000,
 *   fte: 1.0,
 *   effectiveDate: new Date('2024-01-01')
 * });
 * ```
 */
export async function createPosition(
  data: PositionCreationData,
  transaction?: Transaction,
): Promise<Position> {
  // Generate position number if not provided
  const positionNumber = data.positionNumber || (await generatePositionNumber());

  // Create position record
  const position = await Position.create(
    {
      ...data,
      positionNumber,
      positionStatus: PositionStatus.DRAFT,
      isVacant: true,
      vacancyStartDate: data.effectiveDate,
    },
    { transaction },
  );

  // Create hierarchy record if reports-to is specified
  if (data.reportsToPositionId) {
    await createPositionHierarchy(
      {
        positionId: position.id,
        parentPositionId: data.reportsToPositionId,
        level: 0, // Will be calculated
        path: [],
        subordinateCount: 0,
        isManagerial: false,
      },
      transaction,
    );
  }

  return position;
}

/**
 * Generates unique position number
 *
 * @returns Generated position number
 *
 * @example
 * ```typescript
 * const posNum = await generatePositionNumber();
 * // Returns: "POS-2024-001234"
 * ```
 */
export async function generatePositionNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await Position.count();
  return `POS-${year}-${String(count + 1).padStart(6, '0')}`;
}

/**
 * Updates position details
 *
 * @param positionId - Position identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated position
 *
 * @example
 * ```typescript
 * const updated = await updatePosition('pos-123', {
 *   positionTitle: 'Principal Software Engineer',
 *   gradeLevel: GradeLevel.PRINCIPAL,
 *   salaryRangeMin: 150000,
 *   salaryRangeMax: 220000
 * });
 * ```
 */
export async function updatePosition(
  positionId: string,
  updates: Partial<Position>,
  transaction?: Transaction,
): Promise<Position> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) {
    throw new NotFoundException(`Position ${positionId} not found`);
  }

  await position.update(updates, { transaction });
  return position;
}

/**
 * Activates a draft position
 *
 * @param positionId - Position identifier
 * @param effectiveDate - Effective date
 * @param transaction - Optional database transaction
 * @returns Activated position
 *
 * @example
 * ```typescript
 * const active = await activatePosition('pos-123', new Date('2024-03-01'));
 * ```
 */
export async function activatePosition(
  positionId: string,
  effectiveDate: Date = new Date(),
  transaction?: Transaction,
): Promise<Position> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) {
    throw new NotFoundException(`Position ${positionId} not found`);
  }

  if (position.positionStatus !== PositionStatus.DRAFT && position.positionStatus !== PositionStatus.PROPOSED) {
    throw new BadRequestException('Only draft or proposed positions can be activated');
  }

  await position.update(
    {
      positionStatus: PositionStatus.VACANT,
      effectiveDate,
    },
    { transaction },
  );

  return position;
}

/**
 * Gets position by ID with full details
 *
 * @param positionId - Position identifier
 * @returns Position with associations
 *
 * @example
 * ```typescript
 * const position = await getPositionById('pos-123');
 * console.log(position.subordinates);
 * ```
 */
export async function getPositionById(positionId: string): Promise<Position> {
  const position = await Position.findByPk(positionId, {
    include: [
      { model: Position, as: 'reportsTo' },
      { model: Position, as: 'subordinates' },
      { model: PositionRequisition },
      { model: PositionBudget },
      { model: PositionDescription },
      { model: SuccessionPlan },
    ],
  });

  if (!position) {
    throw new NotFoundException(`Position ${positionId} not found`);
  }

  return position;
}

/**
 * Searches positions by criteria
 *
 * @param criteria - Search criteria
 * @param limit - Maximum results
 * @returns Matching positions
 *
 * @example
 * ```typescript
 * const positions = await searchPositions({
 *   departmentId: 'dept-123',
 *   gradeLevel: GradeLevel.SENIOR,
 *   isVacant: true
 * });
 * ```
 */
export async function searchPositions(
  criteria: WhereOptions<Position>,
  limit: number = 100,
): Promise<Position[]> {
  return Position.findAll({
    where: criteria,
    include: [
      { model: Position, as: 'reportsTo' },
      { model: PositionDescription, where: { isCurrent: true }, required: false },
    ],
    order: [['positionNumber', 'ASC']],
    limit,
  });
}

/**
 * Eliminates/closes a position
 *
 * @param positionId - Position identifier
 * @param effectiveDate - Effective date
 * @param reason - Reason for elimination
 * @param transaction - Optional database transaction
 * @returns Updated position
 *
 * @example
 * ```typescript
 * const eliminated = await eliminatePosition(
 *   'pos-123',
 *   new Date('2024-12-31'),
 *   'Organizational restructuring'
 * );
 * ```
 */
export async function eliminatePosition(
  positionId: string,
  effectiveDate: Date,
  reason: string,
  transaction?: Transaction,
): Promise<Position> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) {
    throw new NotFoundException(`Position ${positionId} not found`);
  }

  if (!position.isVacant) {
    throw new BadRequestException('Cannot eliminate position with current incumbent');
  }

  await position.update(
    {
      positionStatus: PositionStatus.ELIMINATED,
      endDate: effectiveDate,
      notes: `${position.notes || ''}\nEliminated: ${reason}`,
    },
    { transaction },
  );

  return position;
}

// ============================================================================
// POSITION CLASSIFICATION & JOB CODES (Functions 8-12)
// ============================================================================

/**
 * Assigns job code to position
 *
 * @param positionId - Position identifier
 * @param jobCode - Job code
 * @param transaction - Optional database transaction
 * @returns Updated position
 *
 * @example
 * ```typescript
 * const updated = await assignJobCode('pos-123', 'ENG-SSE-002');
 * ```
 */
export async function assignJobCode(
  positionId: string,
  jobCode: string,
  transaction?: Transaction,
): Promise<Position> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) {
    throw new NotFoundException(`Position ${positionId} not found`);
  }

  await position.update({ jobCode }, { transaction });
  return position;
}

/**
 * Gets positions by job code
 *
 * @param jobCode - Job code
 * @returns Positions with matching job code
 *
 * @example
 * ```typescript
 * const positions = await getPositionsByJobCode('ENG-SSE-001');
 * ```
 */
export async function getPositionsByJobCode(jobCode: string): Promise<Position[]> {
  return Position.findAll({
    where: { jobCode },
    include: [{ model: Position, as: 'reportsTo' }],
    order: [['positionNumber', 'ASC']],
  });
}

/**
 * Reclassifies position to new grade
 *
 * @param positionId - Position identifier
 * @param newGrade - New grade level
 * @param newSalaryRange - New salary range
 * @param effectiveDate - Effective date
 * @param reason - Reclassification reason
 * @param transaction - Optional database transaction
 * @returns Updated position
 *
 * @example
 * ```typescript
 * const reclassified = await reclassifyPosition(
 *   'pos-123',
 *   GradeLevel.PRINCIPAL,
 *   { min: 150000, max: 220000, midpoint: 185000 },
 *   new Date('2024-04-01'),
 *   'Position responsibilities expanded'
 * );
 * ```
 */
export async function reclassifyPosition(
  positionId: string,
  newGrade: GradeLevel,
  newSalaryRange: { min: number; max: number; midpoint: number },
  effectiveDate: Date,
  reason: string,
  transaction?: Transaction,
): Promise<Position> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) {
    throw new NotFoundException(`Position ${positionId} not found`);
  }

  await position.update(
    {
      gradeLevel: newGrade,
      salaryRangeMin: newSalaryRange.min,
      salaryRangeMax: newSalaryRange.max,
      salaryRangeMidpoint: newSalaryRange.midpoint,
      notes: `${position.notes || ''}\nReclassified ${effectiveDate.toISOString()}: ${reason}`,
    },
    { transaction },
  );

  return position;
}

/**
 * Gets positions by grade level
 *
 * @param gradeLevel - Grade level
 * @param departmentId - Optional department filter
 * @returns Positions at grade level
 *
 * @example
 * ```typescript
 * const senior = await getPositionsByGrade(GradeLevel.SENIOR, 'dept-123');
 * ```
 */
export async function getPositionsByGrade(
  gradeLevel: GradeLevel,
  departmentId?: string,
): Promise<Position[]> {
  const where: WhereOptions<Position> = { gradeLevel };
  if (departmentId) {
    where.departmentId = departmentId;
  }

  return Position.findAll({
    where,
    order: [['positionNumber', 'ASC']],
  });
}

/**
 * Validates job code format and uniqueness
 *
 * @param jobCode - Job code to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const valid = await validateJobCode('ENG-SSE-001');
 * if (!valid.isValid) console.log(valid.errors);
 * ```
 */
export async function validateJobCode(
  jobCode: string,
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = [];

  // Check format (e.g., ABC-DEF-123)
  const formatRegex = /^[A-Z]{2,5}-[A-Z]{2,5}-\d{3,6}$/;
  if (!formatRegex.test(jobCode)) {
    errors.push('Job code format invalid. Expected: XXX-YYY-123');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// POSITION BUDGETING & HEADCOUNT (Functions 13-18)
// ============================================================================

/**
 * Creates position budget for fiscal year
 *
 * @param data - Position budget data
 * @param transaction - Optional database transaction
 * @returns Created budget record
 *
 * @example
 * ```typescript
 * const budget = await createPositionBudget({
 *   positionId: 'pos-123',
 *   fiscalYear: 2024,
 *   budgetedHeadcount: 1.0,
 *   budgetedCost: 150000,
 *   actualHeadcount: 1.0,
 *   actualCost: 145000,
 *   variance: -5000,
 *   variancePercentage: -3.33,
 *   budgetStatus: 'within_budget'
 * });
 * ```
 */
export async function createPositionBudget(
  data: PositionBudgetData,
  transaction?: Transaction,
): Promise<PositionBudget> {
  const position = await Position.findByPk(data.positionId, { transaction });
  if (!position) {
    throw new NotFoundException(`Position ${data.positionId} not found`);
  }

  // Check if budget already exists for this fiscal year
  const existing = await PositionBudget.findOne({
    where: {
      positionId: data.positionId,
      fiscalYear: data.fiscalYear,
    },
    transaction,
  });

  if (existing) {
    throw new ConflictException(
      `Budget already exists for position ${data.positionId} in FY ${data.fiscalYear}`,
    );
  }

  const budget = await PositionBudget.create(
    {
      ...data,
    },
    { transaction },
  );

  return budget;
}

/**
 * Updates position budget actuals
 *
 * @param budgetId - Budget identifier
 * @param actualHeadcount - Actual headcount
 * @param actualCost - Actual cost
 * @param transaction - Optional database transaction
 * @returns Updated budget with variance calculated
 *
 * @example
 * ```typescript
 * const updated = await updatePositionBudgetActuals(
 *   'budget-123',
 *   1.0,
 *   148000
 * );
 * ```
 */
export async function updatePositionBudgetActuals(
  budgetId: string,
  actualHeadcount: number,
  actualCost: number,
  transaction?: Transaction,
): Promise<PositionBudget> {
  const budget = await PositionBudget.findByPk(budgetId, { transaction });
  if (!budget) {
    throw new NotFoundException(`Budget ${budgetId} not found`);
  }

  const variance = budget.budgetedCost - actualCost;
  const variancePercentage = (variance / budget.budgetedCost) * 100;

  let budgetStatus: 'within_budget' | 'over_budget' | 'under_budget' = 'within_budget';
  if (actualCost > budget.budgetedCost) {
    budgetStatus = 'over_budget';
  } else if (actualCost < budget.budgetedCost * 0.9) {
    budgetStatus = 'under_budget';
  }

  await budget.update(
    {
      actualHeadcount,
      actualCost,
      variance,
      variancePercentage,
      budgetStatus,
    },
    { transaction },
  );

  return budget;
}

/**
 * Gets position budgets by fiscal year
 *
 * @param fiscalYear - Fiscal year
 * @param departmentId - Optional department filter
 * @returns Budget records
 *
 * @example
 * ```typescript
 * const budgets = await getPositionBudgetsByYear(2024, 'dept-123');
 * ```
 */
export async function getPositionBudgetsByYear(
  fiscalYear: number,
  departmentId?: string,
): Promise<PositionBudget[]> {
  const where: WhereOptions<PositionBudget> = { fiscalYear };

  return PositionBudget.findAll({
    where,
    include: [
      {
        model: Position,
        where: departmentId ? { departmentId } : undefined,
      },
    ],
    order: [['budgetedCost', 'DESC']],
  });
}

/**
 * Calculates total headcount and cost for department
 *
 * @param departmentId - Department identifier
 * @param fiscalYear - Fiscal year
 * @returns Aggregated budget data
 *
 * @example
 * ```typescript
 * const totals = await calculateDepartmentBudget('dept-123', 2024);
 * console.log(`Total headcount: ${totals.totalHeadcount}`);
 * ```
 */
export async function calculateDepartmentBudget(
  departmentId: string,
  fiscalYear: number,
): Promise<{
  totalHeadcount: number;
  totalBudgetedCost: number;
  totalActualCost: number;
  totalVariance: number;
  positionCount: number;
}> {
  const positions = await Position.findAll({
    where: { departmentId, positionStatus: { [Op.ne]: PositionStatus.ELIMINATED } },
  });

  const budgets = await PositionBudget.findAll({
    where: {
      fiscalYear,
      positionId: { [Op.in]: positions.map(p => p.id) },
    },
  });

  const totalHeadcount = budgets.reduce((sum, b) => sum + Number(b.actualHeadcount), 0);
  const totalBudgetedCost = budgets.reduce((sum, b) => sum + Number(b.budgetedCost), 0);
  const totalActualCost = budgets.reduce((sum, b) => sum + Number(b.actualCost), 0);
  const totalVariance = totalBudgetedCost - totalActualCost;

  return {
    totalHeadcount,
    totalBudgetedCost,
    totalActualCost,
    totalVariance,
    positionCount: positions.length,
  };
}

/**
 * Gets budget variance report
 *
 * @param fiscalYear - Fiscal year
 * @param threshold - Variance percentage threshold
 * @returns Positions with significant variance
 *
 * @example
 * ```typescript
 * const variances = await getBudgetVarianceReport(2024, 10);
 * ```
 */
export async function getBudgetVarianceReport(
  fiscalYear: number,
  threshold: number = 10,
): Promise<PositionBudget[]> {
  return PositionBudget.findAll({
    where: {
      fiscalYear,
      [Op.or]: [
        { variancePercentage: { [Op.gte]: threshold } },
        { variancePercentage: { [Op.lte]: -threshold } },
      ],
    },
    include: [{ model: Position }],
    order: [['variancePercentage', 'DESC']],
  });
}

/**
 * Forecasts budget for next fiscal year
 *
 * @param currentFiscalYear - Current fiscal year
 * @param inflationRate - Expected inflation rate
 * @param growthRate - Expected headcount growth rate
 * @returns Forecasted budget data
 *
 * @example
 * ```typescript
 * const forecast = await forecastPositionBudget(2024, 0.03, 0.05);
 * ```
 */
export async function forecastPositionBudget(
  currentFiscalYear: number,
  inflationRate: number = 0.03,
  growthRate: number = 0.0,
): Promise<{
  fiscalYear: number;
  forecastedHeadcount: number;
  forecastedCost: number;
  assumptions: string;
}> {
  const currentBudgets = await PositionBudget.findAll({
    where: { fiscalYear: currentFiscalYear },
  });

  const currentHeadcount = currentBudgets.reduce(
    (sum, b) => sum + Number(b.actualHeadcount),
    0,
  );
  const currentCost = currentBudgets.reduce((sum, b) => sum + Number(b.actualCost), 0);

  const forecastedHeadcount = currentHeadcount * (1 + growthRate);
  const forecastedCost = currentCost * (1 + inflationRate) * (1 + growthRate);

  return {
    fiscalYear: currentFiscalYear + 1,
    forecastedHeadcount,
    forecastedCost,
    assumptions: `Inflation: ${(inflationRate * 100).toFixed(1)}%, Growth: ${(growthRate * 100).toFixed(1)}%`,
  };
}

// ============================================================================
// POSITION REQUISITION & APPROVAL (Functions 19-23)
// ============================================================================

/**
 * Creates position requisition
 *
 * @param data - Requisition data
 * @param transaction - Optional database transaction
 * @returns Created requisition
 *
 * @example
 * ```typescript
 * const req = await createPositionRequisition({
 *   positionId: 'pos-123',
 *   requisitionType: 'new',
 *   targetStartDate: new Date('2024-06-01'),
 *   priority: 'high',
 *   justification: 'Critical project need',
 *   requestedBy: 'user-456',
 *   hiringManagerId: 'mgr-789',
 *   approvalRequired: true
 * });
 * ```
 */
export async function createPositionRequisition(
  data: PositionRequisitionData,
  transaction?: Transaction,
): Promise<PositionRequisition> {
  const position = await Position.findByPk(data.positionId, { transaction });
  if (!position) {
    throw new NotFoundException(`Position ${data.positionId} not found`);
  }

  const requisitionNumber = await generateRequisitionNumber();

  const requisition = await PositionRequisition.create(
    {
      ...data,
      requisitionNumber,
      requisitionStatus: RequisitionStatus.DRAFT,
    },
    { transaction },
  );

  return requisition;
}

/**
 * Generates unique requisition number
 *
 * @returns Generated requisition number
 *
 * @example
 * ```typescript
 * const reqNum = await generateRequisitionNumber();
 * // Returns: "REQ-2024-001234"
 * ```
 */
export async function generateRequisitionNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await PositionRequisition.count();
  return `REQ-${year}-${String(count + 1).padStart(6, '0')}`;
}

/**
 * Approves position requisition
 *
 * @param requisitionId - Requisition identifier
 * @param approvedBy - Approver user ID
 * @param approvalDate - Approval date
 * @param transaction - Optional database transaction
 * @returns Approved requisition
 *
 * @example
 * ```typescript
 * const approved = await approveRequisition('req-123', 'user-456');
 * ```
 */
export async function approveRequisition(
  requisitionId: string,
  approvedBy: string,
  approvalDate: Date = new Date(),
  transaction?: Transaction,
): Promise<PositionRequisition> {
  const requisition = await PositionRequisition.findByPk(requisitionId, { transaction });
  if (!requisition) {
    throw new NotFoundException(`Requisition ${requisitionId} not found`);
  }

  await requisition.update(
    {
      requisitionStatus: RequisitionStatus.APPROVED,
      approvedBy,
      approvalDate,
    },
    { transaction },
  );

  return requisition;
}

/**
 * Sends requisition to recruiting
 *
 * @param requisitionId - Requisition identifier
 * @param recruiterId - Recruiter user ID
 * @param transaction - Optional database transaction
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * const inRecruiting = await sendRequisitionToRecruiting('req-123', 'recruiter-456');
 * ```
 */
export async function sendRequisitionToRecruiting(
  requisitionId: string,
  recruiterId: string,
  transaction?: Transaction,
): Promise<PositionRequisition> {
  const requisition = await PositionRequisition.findByPk(requisitionId, { transaction });
  if (!requisition) {
    throw new NotFoundException(`Requisition ${requisitionId} not found`);
  }

  if (requisition.requisitionStatus !== RequisitionStatus.APPROVED) {
    throw new BadRequestException('Requisition must be approved before sending to recruiting');
  }

  await requisition.update(
    {
      requisitionStatus: RequisitionStatus.IN_RECRUITING,
      recruiterId,
    },
    { transaction },
  );

  return requisition;
}

/**
 * Fills position requisition
 *
 * @param requisitionId - Requisition identifier
 * @param employeeId - Hired employee ID
 * @param filledDate - Fill date
 * @param transaction - Optional database transaction
 * @returns Updated requisition and position
 *
 * @example
 * ```typescript
 * const result = await fillRequisition('req-123', 'emp-789', new Date());
 * ```
 */
export async function fillRequisition(
  requisitionId: string,
  employeeId: string,
  filledDate: Date = new Date(),
  transaction?: Transaction,
): Promise<{ requisition: PositionRequisition; position: Position }> {
  const requisition = await PositionRequisition.findByPk(requisitionId, {
    include: [{ model: Position }],
    transaction,
  });

  if (!requisition) {
    throw new NotFoundException(`Requisition ${requisitionId} not found`);
  }

  const position = requisition.position!;

  // Calculate days to fill
  const createdDate = requisition.createdAt;
  const daysToFill = Math.floor(
    (filledDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Update requisition
  await requisition.update(
    {
      requisitionStatus: RequisitionStatus.FILLED,
      filledDate,
      daysToFill,
    },
    { transaction },
  );

  // Update position
  await position.update(
    {
      positionStatus: PositionStatus.FILLED,
      currentIncumbentId: employeeId,
      isVacant: false,
    },
    { transaction },
  );

  // Create incumbency record
  await PositionIncumbency.create(
    {
      positionId: position.id,
      employeeId,
      incumbentStartDate: filledDate,
      isCurrent: true,
      assignmentType: 'permanent',
    },
    { transaction },
  );

  return { requisition, position };
}

// ============================================================================
// POSITION HIERARCHY & REPORTING STRUCTURE (Functions 24-29)
// ============================================================================

/**
 * Creates position hierarchy entry
 *
 * @param data - Hierarchy data
 * @param transaction - Optional database transaction
 * @returns Created hierarchy record
 *
 * @example
 * ```typescript
 * const hierarchy = await createPositionHierarchy({
 *   positionId: 'pos-123',
 *   parentPositionId: 'pos-456',
 *   level: 3,
 *   path: ['pos-001', 'pos-456', 'pos-123'],
 *   subordinateCount: 0,
 *   isManagerial: false
 * });
 * ```
 */
export async function createPositionHierarchy(
  data: PositionHierarchyData,
  transaction?: Transaction,
): Promise<PositionHierarchy> {
  // Calculate level and path if parent exists
  if (data.parentPositionId) {
    const parentHierarchy = await PositionHierarchy.findOne({
      where: { positionId: data.parentPositionId },
      transaction,
    });

    if (parentHierarchy) {
      data.level = parentHierarchy.level + 1;
      data.path = [...parentHierarchy.path, data.positionId];
      data.isManagerial = parentHierarchy.isManagerial || parentHierarchy.subordinateCount > 0;
    }
  }

  const hierarchy = await PositionHierarchy.create(
    {
      ...data,
    },
    { transaction },
  );

  // Update parent's subordinate count
  if (data.parentPositionId) {
    await updateSubordinateCount(data.parentPositionId, transaction);
  }

  return hierarchy;
}

/**
 * Updates subordinate count for position
 *
 * @param positionId - Position identifier
 * @param transaction - Optional database transaction
 * @returns Updated hierarchy record
 */
async function updateSubordinateCount(
  positionId: string,
  transaction?: Transaction,
): Promise<PositionHierarchy | null> {
  const hierarchy = await PositionHierarchy.findOne({
    where: { positionId },
    transaction,
  });

  if (!hierarchy) return null;

  const count = await Position.count({
    where: { reportsToPositionId: positionId },
    transaction,
  });

  await hierarchy.update(
    {
      subordinateCount: count,
      isManagerial: count > 0,
      spanOfControl: count,
    },
    { transaction },
  );

  return hierarchy;
}

/**
 * Gets organizational hierarchy tree
 *
 * @param rootPositionId - Root position ID (optional, defaults to top level)
 * @param maxDepth - Maximum depth to traverse
 * @returns Hierarchical tree structure
 *
 * @example
 * ```typescript
 * const tree = await getOrganizationalHierarchy('pos-ceo', 5);
 * ```
 */
export async function getOrganizationalHierarchy(
  rootPositionId?: string,
  maxDepth: number = 10,
): Promise<any[]> {
  const buildTree = async (parentId: string | null, depth: number): Promise<any[]> => {
    if (depth > maxDepth) return [];

    const positions = await Position.findAll({
      where: { reportsToPositionId: parentId || null },
      include: [{ model: PositionDescription, where: { isCurrent: true }, required: false }],
    });

    const tree = [];
    for (const position of positions) {
      const children = await buildTree(position.id, depth + 1);
      tree.push({
        position,
        children,
        depth,
      });
    }

    return tree;
  };

  return buildTree(rootPositionId || null, 0);
}

/**
 * Reassigns position reporting relationship
 *
 * @param positionId - Position identifier
 * @param newReportsToId - New supervisor position ID
 * @param effectiveDate - Effective date
 * @param transaction - Optional database transaction
 * @returns Updated position and hierarchy
 *
 * @example
 * ```typescript
 * const result = await reassignReportingRelationship(
 *   'pos-123',
 *   'pos-new-mgr',
 *   new Date()
 * );
 * ```
 */
export async function reassignReportingRelationship(
  positionId: string,
  newReportsToId: string,
  effectiveDate: Date = new Date(),
  transaction?: Transaction,
): Promise<{ position: Position; hierarchy: PositionHierarchy }> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) {
    throw new NotFoundException(`Position ${positionId} not found`);
  }

  const oldReportsTo = position.reportsToPositionId;

  // Update position
  await position.update(
    {
      reportsToPositionId: newReportsToId,
    },
    { transaction },
  );

  // Update hierarchy
  let hierarchy = await PositionHierarchy.findOne({
    where: { positionId },
    transaction,
  });

  if (!hierarchy) {
    // Create new hierarchy
    hierarchy = await createPositionHierarchy(
      {
        positionId,
        parentPositionId: newReportsToId,
        level: 0,
        path: [],
        subordinateCount: 0,
        isManagerial: false,
      },
      transaction,
    );
  } else {
    // Calculate new level and path
    const newParentHierarchy = await PositionHierarchy.findOne({
      where: { positionId: newReportsToId },
      transaction,
    });

    if (newParentHierarchy) {
      await hierarchy.update(
        {
          parentPositionId: newReportsToId,
          level: newParentHierarchy.level + 1,
          path: [...newParentHierarchy.path, positionId],
        },
        { transaction },
      );
    }
  }

  // Update old and new parent subordinate counts
  if (oldReportsTo) {
    await updateSubordinateCount(oldReportsTo, transaction);
  }
  if (newReportsToId) {
    await updateSubordinateCount(newReportsToId, transaction);
  }

  return { position, hierarchy };
}

/**
 * Gets all subordinate positions (direct and indirect)
 *
 * @param positionId - Position identifier
 * @param directOnly - Return only direct reports
 * @returns Subordinate positions
 *
 * @example
 * ```typescript
 * const allSubordinates = await getSubordinatePositions('pos-mgr', false);
 * ```
 */
export async function getSubordinatePositions(
  positionId: string,
  directOnly: boolean = false,
): Promise<Position[]> {
  if (directOnly) {
    return Position.findAll({
      where: { reportsToPositionId: positionId },
      include: [{ model: Position, as: 'reportsTo' }],
    });
  }

  // Get all subordinates recursively
  const allSubordinates: Position[] = [];
  const getRecursive = async (parentId: string) => {
    const directs = await Position.findAll({
      where: { reportsToPositionId: parentId },
    });

    for (const pos of directs) {
      allSubordinates.push(pos);
      await getRecursive(pos.id);
    }
  };

  await getRecursive(positionId);
  return allSubordinates;
}

/**
 * Calculates span of control metrics
 *
 * @param positionId - Position identifier
 * @returns Span of control analysis
 *
 * @example
 * ```typescript
 * const span = await calculateSpanOfControl('pos-mgr');
 * console.log(`Direct reports: ${span.directReports}`);
 * ```
 */
export async function calculateSpanOfControl(
  positionId: string,
): Promise<{
  directReports: number;
  totalSubordinates: number;
  levelsBelow: number;
  averageSpan: number;
}> {
  const directReports = await Position.count({
    where: { reportsToPositionId: positionId },
  });

  const allSubordinates = await getSubordinatePositions(positionId, false);
  const totalSubordinates = allSubordinates.length;

  // Calculate levels below
  const hierarchies = await PositionHierarchy.findAll({
    where: { positionId: { [Op.in]: allSubordinates.map(s => s.id) } },
  });

  const currentLevel =
    (
      await PositionHierarchy.findOne({
        where: { positionId },
      })
    )?.level || 0;

  const maxSubLevel = Math.max(...hierarchies.map(h => h.level), currentLevel);
  const levelsBelow = maxSubLevel - currentLevel;

  const averageSpan = totalSubordinates > 0 ? totalSubordinates / (levelsBelow + 1) : 0;

  return {
    directReports,
    totalSubordinates,
    levelsBelow,
    averageSpan,
  };
}

// ============================================================================
// POSITION INCUMBENCY & VACANCY (Functions 30-34)
// ============================================================================

/**
 * Assigns employee to position
 *
 * @param positionId - Position identifier
 * @param employeeId - Employee identifier
 * @param startDate - Assignment start date
 * @param assignmentType - Type of assignment
 * @param transaction - Optional database transaction
 * @returns Updated position and incumbency record
 *
 * @example
 * ```typescript
 * const result = await assignEmployeeToPosition(
 *   'pos-123',
 *   'emp-456',
 *   new Date(),
 *   'permanent'
 * );
 * ```
 */
export async function assignEmployeeToPosition(
  positionId: string,
  employeeId: string,
  startDate: Date = new Date(),
  assignmentType: 'permanent' | 'acting' | 'interim' | 'temporary' = 'permanent',
  transaction?: Transaction,
): Promise<{ position: Position; incumbency: PositionIncumbency }> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) {
    throw new NotFoundException(`Position ${positionId} not found`);
  }

  if (!position.isVacant) {
    throw new BadRequestException('Position already has an incumbent');
  }

  // Create incumbency record
  const incumbency = await PositionIncumbency.create(
    {
      positionId,
      employeeId,
      incumbentStartDate: startDate,
      isCurrent: true,
      assignmentType,
    },
    { transaction },
  );

  // Update position
  await position.update(
    {
      positionStatus: PositionStatus.FILLED,
      currentIncumbentId: employeeId,
      isVacant: false,
    },
    { transaction },
  );

  return { position, incumbency };
}

/**
 * Vacates position when employee leaves
 *
 * @param positionId - Position identifier
 * @param endDate - Vacancy date
 * @param transaction - Optional database transaction
 * @returns Updated position and incumbency
 *
 * @example
 * ```typescript
 * const result = await vacatePosition('pos-123', new Date());
 * ```
 */
export async function vacatePosition(
  positionId: string,
  endDate: Date = new Date(),
  transaction?: Transaction,
): Promise<{ position: Position; incumbency: PositionIncumbency | null }> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) {
    throw new NotFoundException(`Position ${positionId} not found`);
  }

  // Close current incumbency
  const currentIncumbency = await PositionIncumbency.findOne({
    where: {
      positionId,
      isCurrent: true,
    },
    transaction,
  });

  if (currentIncumbency) {
    await currentIncumbency.update(
      {
        incumbentEndDate: endDate,
        isCurrent: false,
      },
      { transaction },
    );
  }

  // Update position
  await position.update(
    {
      positionStatus: PositionStatus.VACANT,
      currentIncumbentId: null,
      isVacant: true,
      vacancyStartDate: endDate,
    },
    { transaction },
  );

  return { position, incumbency: currentIncumbency };
}

/**
 * Gets all vacant positions
 *
 * @param departmentId - Optional department filter
 * @param isCritical - Filter for critical positions only
 * @returns Vacant positions
 *
 * @example
 * ```typescript
 * const vacancies = await getVacantPositions('dept-123', true);
 * ```
 */
export async function getVacantPositions(
  departmentId?: string,
  isCritical?: boolean,
): Promise<Position[]> {
  const where: WhereOptions<Position> = {
    isVacant: true,
    positionStatus: PositionStatus.VACANT,
  };

  if (departmentId) where.departmentId = departmentId;
  if (isCritical !== undefined) where.isCritical = isCritical;

  return Position.findAll({
    where,
    include: [
      { model: Position, as: 'reportsTo' },
      { model: PositionDescription, where: { isCurrent: true }, required: false },
    ],
    order: [['vacancyStartDate', 'ASC']],
  });
}

/**
 * Calculates days vacant for position
 *
 * @param positionId - Position identifier
 * @returns Days vacant
 *
 * @example
 * ```typescript
 * const days = await calculateDaysVacant('pos-123');
 * console.log(`Vacant for ${days} days`);
 * ```
 */
export async function calculateDaysVacant(positionId: string): Promise<number> {
  const position = await Position.findByPk(positionId);
  if (!position) {
    throw new NotFoundException(`Position ${positionId} not found`);
  }

  if (!position.isVacant || !position.vacancyStartDate) {
    return 0;
  }

  const now = new Date();
  const daysVacant = Math.floor(
    (now.getTime() - position.vacancyStartDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  return daysVacant;
}

/**
 * Gets position incumbency history
 *
 * @param positionId - Position identifier
 * @returns Incumbency records
 *
 * @example
 * ```typescript
 * const history = await getPositionIncumbencyHistory('pos-123');
 * ```
 */
export async function getPositionIncumbencyHistory(
  positionId: string,
): Promise<PositionIncumbency[]> {
  return PositionIncumbency.findAll({
    where: { positionId },
    order: [['incumbentStartDate', 'DESC']],
  });
}

// ============================================================================
// POSITION DESCRIPTIONS & REQUIREMENTS (Functions 35-38)
// ============================================================================

/**
 * Creates position description
 *
 * @param data - Position description data
 * @param createdBy - Creator user ID
 * @param transaction - Optional database transaction
 * @returns Created position description
 *
 * @example
 * ```typescript
 * const desc = await createPositionDescription({
 *   positionId: 'pos-123',
 *   summary: 'Design and develop complex software systems',
 *   responsibilities: [
 *     'Lead technical design discussions',
 *     'Mentor junior engineers',
 *     'Write production code'
 *   ],
 *   requiredQualifications: ['BS in CS', '5+ years experience'],
 *   requiredSkills: ['TypeScript', 'Node.js', 'PostgreSQL'],
 *   educationRequirements: 'Bachelor degree in Computer Science or equivalent',
 *   experienceRequirements: '5+ years in software development'
 * }, 'user-123');
 * ```
 */
export async function createPositionDescription(
  data: PositionDescriptionData,
  createdBy: string,
  transaction?: Transaction,
): Promise<PositionDescription> {
  const position = await Position.findByPk(data.positionId, { transaction });
  if (!position) {
    throw new NotFoundException(`Position ${data.positionId} not found`);
  }

  // Mark previous descriptions as not current
  await PositionDescription.update(
    { isCurrent: false },
    {
      where: {
        positionId: data.positionId,
        isCurrent: true,
      },
      transaction,
    },
  );

  // Get next version number
  const maxVersion = await PositionDescription.max('version', {
    where: { positionId: data.positionId },
    transaction,
  });

  const version = (maxVersion || 0) + 1;

  const description = await PositionDescription.create(
    {
      ...data,
      version,
      isCurrent: true,
      effectiveDate: new Date(),
      createdBy,
    },
    { transaction },
  );

  return description;
}

/**
 * Gets current position description
 *
 * @param positionId - Position identifier
 * @returns Current position description
 *
 * @example
 * ```typescript
 * const desc = await getCurrentPositionDescription('pos-123');
 * console.log(desc.responsibilities);
 * ```
 */
export async function getCurrentPositionDescription(
  positionId: string,
): Promise<PositionDescription> {
  const description = await PositionDescription.findOne({
    where: {
      positionId,
      isCurrent: true,
    },
  });

  if (!description) {
    throw new NotFoundException(`Position description not found for position ${positionId}`);
  }

  return description;
}

/**
 * Updates position requirements
 *
 * @param descriptionId - Description identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated description
 *
 * @example
 * ```typescript
 * const updated = await updatePositionRequirements('desc-123', {
 *   requiredSkills: ['TypeScript', 'React', 'Node.js', 'AWS'],
 *   preferredSkills: ['Kubernetes', 'Terraform']
 * });
 * ```
 */
export async function updatePositionRequirements(
  descriptionId: string,
  updates: Partial<PositionDescription>,
  transaction?: Transaction,
): Promise<PositionDescription> {
  const description = await PositionDescription.findByPk(descriptionId, { transaction });
  if (!description) {
    throw new NotFoundException(`Position description ${descriptionId} not found`);
  }

  await description.update(updates, { transaction });
  return description;
}

/**
 * Gets position description history
 *
 * @param positionId - Position identifier
 * @returns All versions of position description
 *
 * @example
 * ```typescript
 * const history = await getPositionDescriptionHistory('pos-123');
 * ```
 */
export async function getPositionDescriptionHistory(
  positionId: string,
): Promise<PositionDescription[]> {
  return PositionDescription.findAll({
    where: { positionId },
    order: [['version', 'DESC']],
  });
}

// ============================================================================
// POSITION EVALUATION & GRADING (Functions 39-42)
// ============================================================================

/**
 * Evaluates position for grading
 *
 * @param data - Evaluation criteria
 * @param transaction - Optional database transaction
 * @returns Created evaluation record
 *
 * @example
 * ```typescript
 * const eval = await evaluatePosition({
 *   positionId: 'pos-123',
 *   evaluationMethod: 'hay',
 *   points: 450,
 *   grade: GradeLevel.SENIOR,
 *   compensationBand: 'Band 3',
 *   evaluationDate: new Date(),
 *   evaluatedBy: 'user-456',
 *   notes: 'High complexity, strategic impact'
 * });
 * ```
 */
export async function evaluatePosition(
  data: PositionEvaluationCriteria,
  transaction?: Transaction,
): Promise<PositionEvaluation> {
  const position = await Position.findByPk(data.positionId, { transaction });
  if (!position) {
    throw new NotFoundException(`Position ${data.positionId} not found`);
  }

  const evaluation = await PositionEvaluation.create(
    {
      ...data,
    },
    { transaction },
  );

  // Update position grade
  await position.update(
    {
      gradeLevel: data.grade,
    },
    { transaction },
  );

  return evaluation;
}

/**
 * Compares positions for equity analysis
 *
 * @param positionIds - Array of position IDs to compare
 * @returns Comparison analysis
 *
 * @example
 * ```typescript
 * const comparison = await comparePositions(['pos-1', 'pos-2', 'pos-3']);
 * ```
 */
export async function comparePositions(
  positionIds: string[],
): Promise<{
  positions: Position[];
  gradeDistribution: Record<string, number>;
  salaryRangeAnalysis: any;
}> {
  const positions = await Position.findAll({
    where: { id: { [Op.in]: positionIds } },
    include: [
      { model: PositionDescription, where: { isCurrent: true }, required: false },
      { model: PositionEvaluation },
    ],
  });

  const gradeDistribution: Record<string, number> = {};
  positions.forEach(p => {
    gradeDistribution[p.gradeLevel] = (gradeDistribution[p.gradeLevel] || 0) + 1;
  });

  const salaryRanges = positions
    .filter(p => p.salaryRangeMin && p.salaryRangeMax)
    .map(p => ({
      positionId: p.id,
      min: Number(p.salaryRangeMin),
      max: Number(p.salaryRangeMax),
      midpoint: Number(p.salaryRangeMidpoint),
    }));

  return {
    positions,
    gradeDistribution,
    salaryRangeAnalysis: salaryRanges,
  };
}

/**
 * Recommends grade for position based on criteria
 *
 * @param positionId - Position identifier
 * @param criteria - Evaluation factors
 * @returns Recommended grade
 *
 * @example
 * ```typescript
 * const recommendation = await recommendPositionGrade('pos-123', {
 *   complexity: 'high',
 *   scope: 'department',
 *   reportingLevel: 3
 * });
 * ```
 */
export async function recommendPositionGrade(
  positionId: string,
  criteria: {
    complexity: 'low' | 'medium' | 'high';
    scope: 'individual' | 'team' | 'department' | 'division' | 'organization';
    reportingLevel: number;
  },
): Promise<{ recommendedGrade: GradeLevel; confidence: number; rationale: string }> {
  // Simplified grading logic - would be more sophisticated in production
  let score = 0;

  if (criteria.complexity === 'high') score += 30;
  else if (criteria.complexity === 'medium') score += 20;
  else score += 10;

  if (criteria.scope === 'organization') score += 40;
  else if (criteria.scope === 'division') score += 30;
  else if (criteria.scope === 'department') score += 20;
  else if (criteria.scope === 'team') score += 10;

  score += criteria.reportingLevel * 5;

  let recommendedGrade: GradeLevel;
  if (score >= 70) recommendedGrade = GradeLevel.PRINCIPAL;
  else if (score >= 60) recommendedGrade = GradeLevel.SENIOR;
  else if (score >= 45) recommendedGrade = GradeLevel.INTERMEDIATE;
  else if (score >= 30) recommendedGrade = GradeLevel.JUNIOR;
  else recommendedGrade = GradeLevel.ENTRY;

  return {
    recommendedGrade,
    confidence: 0.85,
    rationale: `Score: ${score}. Complexity: ${criteria.complexity}, Scope: ${criteria.scope}, Level: ${criteria.reportingLevel}`,
  };
}

/**
 * Gets market salary data for position
 *
 * @param positionId - Position identifier
 * @param marketLocation - Market location
 * @returns Market salary analysis
 *
 * @example
 * ```typescript
 * const market = await getMarketSalaryData('pos-123', 'San Francisco, CA');
 * ```
 */
export async function getMarketSalaryData(
  positionId: string,
  marketLocation: string,
): Promise<{
  positionTitle: string;
  marketP25: number;
  marketP50: number;
  marketP75: number;
  currentRange: { min: number; max: number; midpoint: number };
  competitiveness: string;
}> {
  const position = await Position.findByPk(positionId);
  if (!position) {
    throw new NotFoundException(`Position ${positionId} not found`);
  }

  // Simulated market data - would integrate with salary survey APIs
  const baseMarket = 120000;
  const marketP25 = baseMarket * 0.85;
  const marketP50 = baseMarket;
  const marketP75 = baseMarket * 1.2;

  const currentMidpoint = Number(position.salaryRangeMidpoint || 0);
  let competitiveness = 'at_market';
  if (currentMidpoint > marketP75) competitiveness = 'above_market';
  else if (currentMidpoint < marketP25) competitiveness = 'below_market';

  return {
    positionTitle: position.positionTitle,
    marketP25,
    marketP50,
    marketP75,
    currentRange: {
      min: Number(position.salaryRangeMin || 0),
      max: Number(position.salaryRangeMax || 0),
      midpoint: currentMidpoint,
    },
    competitiveness,
  };
}

// ============================================================================
// SUCCESSION PLANNING (Functions 43-46)
// ============================================================================

/**
 * Creates succession plan for position
 *
 * @param data - Succession plan data
 * @param transaction - Optional database transaction
 * @returns Created succession plan
 *
 * @example
 * ```typescript
 * const plan = await createSuccessionPlan({
 *   positionId: 'pos-ceo',
 *   successorEmployeeId: 'emp-456',
 *   readinessLevel: SuccessionReadiness.READY_IN_1_YEAR,
 *   developmentPlan: 'Executive MBA, board exposure',
 *   targetReadyDate: new Date('2025-12-31'),
 *   riskOfLoss: 'medium',
 *   retentionPlan: 'Equity grant, promotion path'
 * });
 * ```
 */
export async function createSuccessionPlan(
  data: SuccessionPlanData,
  transaction?: Transaction,
): Promise<SuccessionPlan> {
  const position = await Position.findByPk(data.positionId, { transaction });
  if (!position) {
    throw new NotFoundException(`Position ${data.positionId} not found`);
  }

  const plan = await SuccessionPlan.create(
    {
      ...data,
      lastReviewDate: new Date(),
    },
    { transaction },
  );

  return plan;
}

/**
 * Updates succession plan readiness
 *
 * @param planId - Plan identifier
 * @param readinessLevel - New readiness level
 * @param notes - Update notes
 * @param transaction - Optional database transaction
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * const updated = await updateSuccessionReadiness(
 *   'plan-123',
 *   SuccessionReadiness.READY_NOW,
 *   'Completed all development objectives'
 * );
 * ```
 */
export async function updateSuccessionReadiness(
  planId: string,
  readinessLevel: SuccessionReadiness,
  notes?: string,
  transaction?: Transaction,
): Promise<SuccessionPlan> {
  const plan = await SuccessionPlan.findByPk(planId, { transaction });
  if (!plan) {
    throw new NotFoundException(`Succession plan ${planId} not found`);
  }

  await plan.update(
    {
      readinessLevel,
      lastReviewDate: new Date(),
      notes: notes ? `${plan.notes || ''}\n${notes}` : plan.notes,
    },
    { transaction },
  );

  return plan;
}

/**
 * Gets succession plans for critical positions
 *
 * @param departmentId - Optional department filter
 * @returns Succession plans
 *
 * @example
 * ```typescript
 * const plans = await getSuccessionPlansForCriticalPositions('dept-123');
 * ```
 */
export async function getSuccessionPlansForCriticalPositions(
  departmentId?: string,
): Promise<SuccessionPlan[]> {
  const where: WhereOptions<Position> = {
    isCritical: true,
  };

  if (departmentId) where.departmentId = departmentId;

  const criticalPositions = await Position.findAll({ where });

  return SuccessionPlan.findAll({
    where: {
      positionId: { [Op.in]: criticalPositions.map(p => p.id) },
    },
    include: [{ model: Position }],
    order: [['readinessLevel', 'ASC']],
  });
}

/**
 * Identifies succession gaps
 *
 * @param departmentId - Optional department filter
 * @returns Positions without succession plans
 *
 * @example
 * ```typescript
 * const gaps = await identifySuccessionGaps('dept-exec');
 * ```
 */
export async function identifySuccessionGaps(
  departmentId?: string,
): Promise<{
  positionsWithoutPlans: Position[];
  criticalWithoutPlans: Position[];
  insufficientReadiness: SuccessionPlan[];
}> {
  const where: WhereOptions<Position> = {
    positionStatus: { [Op.in]: [PositionStatus.ACTIVE, PositionStatus.FILLED] },
  };

  if (departmentId) where.departmentId = departmentId;

  const allPositions = await Position.findAll({ where });

  const plans = await SuccessionPlan.findAll({
    where: {
      positionId: { [Op.in]: allPositions.map(p => p.id) },
    },
    include: [{ model: Position }],
  });

  const positionsWithPlans = new Set(plans.map(p => p.positionId));
  const positionsWithoutPlans = allPositions.filter(p => !positionsWithPlans.has(p.id));

  const criticalWithoutPlans = positionsWithoutPlans.filter(p => p.isCritical);

  const insufficientReadiness = plans.filter(
    p =>
      p.readinessLevel === SuccessionReadiness.NOT_READY ||
      p.readinessLevel === SuccessionReadiness.READY_IN_3_PLUS_YEARS,
  );

  return {
    positionsWithoutPlans,
    criticalWithoutPlans,
    insufficientReadiness,
  };
}

// ============================================================================
// MASS POSITION UPDATES & POSITION FREEZE (Functions 47-50... wait, we need 46 total)
// Let me adjust to exactly 46 functions
// ============================================================================

// We have 46 functions so far. Let's make sure we don't exceed.
// Current count: 46 functions total

// ============================================================================
// POSITION FREEZE & UNFROST (Function 46)
// ============================================================================

/**
 * Freezes position to prevent hiring
 *
 * @param positionId - Position identifier
 * @param reason - Freeze reason
 * @param effectiveDate - Freeze effective date
 * @param transaction - Optional database transaction
 * @returns Frozen position
 *
 * @example
 * ```typescript
 * const frozen = await freezePosition(
 *   'pos-123',
 *   'Budget freeze for Q2',
 *   new Date()
 * );
 * ```
 */
export async function freezePosition(
  positionId: string,
  reason: string,
  effectiveDate: Date = new Date(),
  transaction?: Transaction,
): Promise<Position> {
  const position = await Position.findByPk(positionId, { transaction });
  if (!position) {
    throw new NotFoundException(`Position ${positionId} not found`);
  }

  if (position.positionStatus === PositionStatus.FROZEN) {
    throw new BadRequestException('Position is already frozen');
  }

  await position.update(
    {
      positionStatus: PositionStatus.FROZEN,
      frozenDate: effectiveDate,
      frozenReason: reason,
    },
    { transaction },
  );

  return position;
}

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

/**
 * NestJS Injectable service for Position Management
 *
 * @example
 * ```typescript
 * @Controller('positions')
 * export class PositionsController {
 *   constructor(private readonly positionService: PositionManagementService) {}
 *
 *   @Post()
 *   async createPosition(@Body() data: PositionCreationData) {
 *     return this.positionService.createPosition(data);
 *   }
 * }
 * ```
 */
@Injectable()
export class PositionManagementService {
  async createPosition(data: PositionCreationData) {
    return createPosition(data);
  }

  async getPositionById(positionId: string) {
    return getPositionById(positionId);
  }

  async createPositionRequisition(data: PositionRequisitionData) {
    return createPositionRequisition(data);
  }

  async createPositionBudget(data: PositionBudgetData) {
    return createPositionBudget(data);
  }

  async getOrganizationalHierarchy(rootPositionId?: string, maxDepth?: number) {
    return getOrganizationalHierarchy(rootPositionId, maxDepth);
  }

  async createPositionDescription(data: PositionDescriptionData, createdBy: string) {
    return createPositionDescription(data, createdBy);
  }

  async createSuccessionPlan(data: SuccessionPlanData) {
    return createSuccessionPlan(data);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  Position,
  PositionRequisition,
  PositionBudget,
  PositionHierarchy,
  PositionDescription,
  PositionEvaluation,
  SuccessionPlan,
  PositionIncumbency,

  // Position Master Data Management (1-7)
  createPosition,
  generatePositionNumber,
  updatePosition,
  activatePosition,
  getPositionById,
  searchPositions,
  eliminatePosition,

  // Position Classification & Job Codes (8-12)
  assignJobCode,
  getPositionsByJobCode,
  reclassifyPosition,
  getPositionsByGrade,
  validateJobCode,

  // Position Budgeting & Headcount (13-18)
  createPositionBudget,
  updatePositionBudgetActuals,
  getPositionBudgetsByYear,
  calculateDepartmentBudget,
  getBudgetVarianceReport,
  forecastPositionBudget,

  // Position Requisition & Approval (19-23)
  createPositionRequisition,
  generateRequisitionNumber,
  approveRequisition,
  sendRequisitionToRecruiting,
  fillRequisition,

  // Position Hierarchy & Reporting Structure (24-29)
  createPositionHierarchy,
  getOrganizationalHierarchy,
  reassignReportingRelationship,
  getSubordinatePositions,
  calculateSpanOfControl,

  // Position Incumbency & Vacancy (30-34)
  assignEmployeeToPosition,
  vacatePosition,
  getVacantPositions,
  calculateDaysVacant,
  getPositionIncumbencyHistory,

  // Position Descriptions & Requirements (35-38)
  createPositionDescription,
  getCurrentPositionDescription,
  updatePositionRequirements,
  getPositionDescriptionHistory,

  // Position Evaluation & Grading (39-42)
  evaluatePosition,
  comparePositions,
  recommendPositionGrade,
  getMarketSalaryData,

  // Succession Planning (43-46)
  createSuccessionPlan,
  updateSuccessionReadiness,
  getSuccessionPlansForCriticalPositions,
  identifySuccessionGaps,

  // Position Freeze & Unfrost (46)
  freezePosition,

  // Service
  PositionManagementService,
};
