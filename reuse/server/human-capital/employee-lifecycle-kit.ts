/**
 * LOC: HCM-ELC-001
 * File: /reuse/server/human-capital/employee-lifecycle-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable HCM utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend HCM services
 *   - Employee management modules
 *   - Onboarding/offboarding services
 *   - Leave management systems
 *   - HR analytics and reporting
 */

/**
 * File: /reuse/server/human-capital/employee-lifecycle-kit.ts
 * Locator: WC-HCM-ELC-001
 * Purpose: Enterprise-grade Employee Lifecycle Management - hire-to-retire workflows, onboarding, transfers, leave management, exits
 *
 * Upstream: Independent utility module for employee lifecycle operations
 * Downstream: ../backend/hcm/*, employee controllers, onboarding services, leave processors, exit workflows
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 47 functions for employee lifecycle operations with SAP SuccessFactors Employee Central parity
 *
 * LLM Context: Comprehensive employee lifecycle utilities for production-ready HCM applications.
 * Provides employee registration, new hire onboarding workflows, probation period management, internal transfers,
 * promotions, relocations, leave of absence management (FMLA, parental, medical), return to work processes,
 * resignation/exit workflows, retirement processing, rehire/boomerang employee management, lifecycle milestones,
 * automated notifications, and audit trail compliance.
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
  IsEmail,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Employee lifecycle states
 */
export enum EmployeeLifecycleState {
  PRE_HIRE = 'pre_hire',
  ONBOARDING = 'onboarding',
  PROBATION = 'probation',
  ACTIVE = 'active',
  ON_LEAVE = 'on_leave',
  SUSPENDED = 'suspended',
  NOTICE_PERIOD = 'notice_period',
  EXITING = 'exiting',
  TERMINATED = 'terminated',
  RETIRED = 'retired',
  REHIRABLE = 'rehirable',
  NON_REHIRABLE = 'non_rehirable',
}

/**
 * Onboarding status stages
 */
export enum OnboardingStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  PAPERWORK_PENDING = 'paperwork_pending',
  SYSTEM_ACCESS_PENDING = 'system_access_pending',
  TRAINING_PENDING = 'training_pending',
  COMPLETED = 'completed',
  DELAYED = 'delayed',
}

/**
 * Probation period status
 */
export enum ProbationStatus {
  ACTIVE = 'active',
  EXTENDED = 'extended',
  PASSED = 'passed',
  FAILED = 'failed',
  WAIVED = 'waived',
}

/**
 * Transfer types
 */
export enum TransferType {
  PROMOTION = 'promotion',
  LATERAL_MOVE = 'lateral_move',
  DEMOTION = 'demotion',
  DEPARTMENT_TRANSFER = 'department_transfer',
  LOCATION_TRANSFER = 'location_transfer',
  TEMPORARY_ASSIGNMENT = 'temporary_assignment',
  PERMANENT_TRANSFER = 'permanent_transfer',
}

/**
 * Leave types
 */
export enum LeaveType {
  FMLA = 'fmla',
  PARENTAL = 'parental',
  MEDICAL = 'medical',
  PERSONAL = 'personal',
  MILITARY = 'military',
  BEREAVEMENT = 'bereavement',
  SABBATICAL = 'sabbatical',
  UNPAID = 'unpaid',
  DISABILITY_SHORT_TERM = 'disability_short_term',
  DISABILITY_LONG_TERM = 'disability_long_term',
}

/**
 * Leave status
 */
export enum LeaveStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  DENIED = 'denied',
  ACTIVE = 'active',
  EXTENDED = 'extended',
  RETURNED = 'returned',
  CANCELLED = 'cancelled',
}

/**
 * Exit types
 */
export enum ExitType {
  VOLUNTARY_RESIGNATION = 'voluntary_resignation',
  INVOLUNTARY_TERMINATION = 'involuntary_termination',
  RETIREMENT = 'retirement',
  END_OF_CONTRACT = 'end_of_contract',
  MUTUAL_SEPARATION = 'mutual_separation',
  LAYOFF = 'layoff',
  DEATH = 'death',
}

/**
 * Rehire eligibility
 */
export enum RehireEligibility {
  ELIGIBLE = 'eligible',
  NOT_ELIGIBLE = 'not_eligible',
  CONDITIONAL = 'conditional',
  UNDER_REVIEW = 'under_review',
}

/**
 * Relocation status
 */
export enum RelocationStatus {
  APPROVED = 'approved',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Employee registration data
 */
export interface EmployeeRegistrationData {
  employeeNumber?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth: Date;
  hireDate: Date;
  positionId: string;
  departmentId: string;
  locationId: string;
  managerId?: string;
  employmentType: 'full_time' | 'part_time' | 'contract' | 'intern';
  jobTitle: string;
  salaryGrade?: string;
  compensation?: number;
  customFields?: Record<string, any>;
}

/**
 * Onboarding checklist item
 */
export interface OnboardingChecklistItem {
  id: string;
  category: 'paperwork' | 'systems' | 'training' | 'equipment' | 'orientation';
  taskName: string;
  description?: string;
  dueDate?: Date;
  completedDate?: Date;
  assignedTo?: string;
  isRequired: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  dependencies?: string[];
}

/**
 * Onboarding plan data
 */
export interface OnboardingPlanData {
  employeeId: string;
  plannedStartDate: Date;
  actualStartDate?: Date;
  buddy?: string;
  mentor?: string;
  checklistItems: OnboardingChecklistItem[];
  notes?: string;
}

/**
 * Probation period data
 */
export interface ProbationPeriodData {
  employeeId: string;
  startDate: Date;
  endDate: Date;
  reviewSchedule: Date[];
  managerId: string;
  criteria?: string[];
  notes?: string;
}

/**
 * Transfer request data
 */
export interface TransferRequestData {
  employeeId: string;
  transferType: TransferType;
  currentPositionId: string;
  newPositionId: string;
  currentDepartmentId: string;
  newDepartmentId: string;
  currentLocationId?: string;
  newLocationId?: string;
  effectiveDate: Date;
  reason: string;
  requestedBy: string;
  isPromotionEligible?: boolean;
  compensationChange?: number;
  approvalRequired: boolean;
}

/**
 * Relocation request data
 */
export interface RelocationRequestData {
  employeeId: string;
  fromLocationId: string;
  toLocationId: string;
  effectiveDate: Date;
  relocationPackage?: string;
  estimatedCost?: number;
  movingExpensesAllowed?: boolean;
  temporaryHousingDays?: number;
  reason: string;
  requestedBy: string;
}

/**
 * Leave of absence request data
 */
export interface LeaveOfAbsenceData {
  employeeId: string;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  expectedReturnDate: Date;
  isPaid: boolean;
  reason?: string;
  medicalCertificationRequired?: boolean;
  intermittentLeave?: boolean;
  reducedSchedule?: boolean;
  approvedBy?: string;
  documents?: string[];
}

/**
 * Return to work data
 */
export interface ReturnToWorkData {
  employeeId: string;
  leaveId: string;
  actualReturnDate: Date;
  workRestrictions?: string[];
  modifiedDuties?: string;
  medicalClearance?: boolean;
  reintegrationPlan?: string;
  followUpDate?: Date;
}

/**
 * Exit interview data
 */
export interface ExitInterviewData {
  employeeId: string;
  exitId: string;
  interviewDate: Date;
  conductedBy: string;
  reasonForLeaving: string;
  feedbackOnManagement?: string;
  feedbackOnWorkEnvironment?: string;
  wouldRecommendCompany?: boolean;
  wouldRehire?: boolean;
  improvementSuggestions?: string;
  exitSurveyResponses?: Record<string, any>;
}

/**
 * Exit process data
 */
export interface EmployeeExitData {
  employeeId: string;
  exitType: ExitType;
  lastWorkingDate: Date;
  noticeDate?: Date;
  noticePeriodDays?: number;
  exitReason: string;
  initiatedBy: string;
  rehireEligibility: RehireEligibility;
  finalSettlementAmount?: number;
  equipmentReturnStatus?: 'pending' | 'partial' | 'complete';
  exitInterviewScheduled?: boolean;
  referenceCheckAllowed?: boolean;
}

/**
 * Retirement data
 */
export interface RetirementData {
  employeeId: string;
  retirementDate: Date;
  noticeDate: Date;
  retirementType: 'normal' | 'early' | 'deferred';
  pensionEligible: boolean;
  benefitsTransitionPlan?: string;
  knowledgeTransferPlan?: string;
  farewellEventDate?: Date;
  emeritusStatus?: boolean;
}

/**
 * Rehire eligibility check result
 */
export interface RehireEligibilityCheck {
  employeeId: string;
  formerEmployeeNumber: string;
  previousExitType: ExitType;
  previousExitDate: Date;
  eligibilityStatus: RehireEligibility;
  reasonsForIneligibility?: string[];
  conditionalRequirements?: string[];
  performanceHistory?: string;
  disciplinaryHistory?: string;
  rehireRecommendation: boolean;
}

/**
 * Lifecycle milestone
 */
export interface LifecycleMilestone {
  employeeId: string;
  milestoneType: 'anniversary' | 'promotion' | 'award' | 'completion' | 'achievement';
  milestoneDate: Date;
  description: string;
  recognitionRequired: boolean;
  notificationSent?: boolean;
}

/**
 * Employee lifecycle event
 */
export interface LifecycleEvent {
  employeeId: string;
  eventType: string;
  eventDate: Date;
  fromState?: EmployeeLifecycleState;
  toState?: EmployeeLifecycleState;
  triggeredBy: string;
  metadata?: Record<string, any>;
  notes?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Employee Model - Core employee master data
 */
@Table({
  tableName: 'employees',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['employee_number'], unique: true },
    { fields: ['email'], unique: true },
    { fields: ['lifecycle_state'] },
    { fields: ['position_id'] },
    { fields: ['department_id'] },
    { fields: ['location_id'] },
    { fields: ['manager_id'] },
    { fields: ['hire_date'] },
  ],
})
export class Employee extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Employee number' })
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  @Index
  employeeNumber!: string;

  @ApiProperty({ description: 'First name' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  firstName!: string;

  @ApiProperty({ description: 'Last name' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  lastName!: string;

  @ApiProperty({ description: 'Middle name' })
  @Column({ type: DataType.STRING(100) })
  middleName?: string;

  @ApiProperty({ description: 'Email address' })
  @Column({ type: DataType.STRING(255), allowNull: false, unique: true })
  @Index
  email!: string;

  @ApiProperty({ description: 'Phone number' })
  @Column({ type: DataType.STRING(20) })
  phoneNumber?: string;

  @ApiProperty({ description: 'Date of birth' })
  @Column({ type: DataType.DATE, allowNull: false })
  dateOfBirth!: Date;

  @ApiProperty({ description: 'Hire date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  hireDate!: Date;

  @ApiProperty({ description: 'Current lifecycle state' })
  @Column({
    type: DataType.ENUM(...Object.values(EmployeeLifecycleState)),
    allowNull: false,
    defaultValue: EmployeeLifecycleState.PRE_HIRE,
  })
  @Index
  lifecycleState!: EmployeeLifecycleState;

  @ApiProperty({ description: 'Position ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  positionId!: string;

  @ApiProperty({ description: 'Department ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  departmentId!: string;

  @ApiProperty({ description: 'Location ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  locationId!: string;

  @ApiProperty({ description: 'Manager ID' })
  @Column({ type: DataType.UUID })
  @Index
  managerId?: string;

  @ApiProperty({ description: 'Employment type' })
  @Column({
    type: DataType.ENUM('full_time', 'part_time', 'contract', 'intern'),
    allowNull: false,
  })
  employmentType!: string;

  @ApiProperty({ description: 'Job title' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  jobTitle!: string;

  @ApiProperty({ description: 'Salary grade' })
  @Column({ type: DataType.STRING(50) })
  salaryGrade?: string;

  @ApiProperty({ description: 'Compensation amount' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  compensation?: number;

  @ApiProperty({ description: 'Last working date if exited' })
  @Column({ type: DataType.DATE })
  lastWorkingDate?: Date;

  @ApiProperty({ description: 'Termination date' })
  @Column({ type: DataType.DATE })
  terminationDate?: Date;

  @ApiProperty({ description: 'Rehire eligibility' })
  @Column({ type: DataType.ENUM(...Object.values(RehireEligibility)) })
  rehireEligibility?: RehireEligibility;

  @ApiProperty({ description: 'Is currently active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive!: boolean;

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

  @HasMany(() => EmployeeLifecycleEvent)
  lifecycleEvents?: EmployeeLifecycleEvent[];

  @HasMany(() => Onboarding)
  onboardingRecords?: Onboarding[];

  @HasMany(() => ProbationPeriod)
  probationPeriods?: ProbationPeriod[];

  @HasMany(() => InternalTransfer)
  transfers?: InternalTransfer[];

  @HasMany(() => LeaveOfAbsence)
  leaves?: LeaveOfAbsence[];

  @HasMany(() => EmployeeExit)
  exitRecords?: EmployeeExit[];
}

/**
 * Employee Lifecycle Event Model - Tracks all lifecycle state changes
 */
@Table({
  tableName: 'employee_lifecycle_events',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['event_type'] },
    { fields: ['event_date'] },
  ],
})
export class EmployeeLifecycleEvent extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Employee ID' })
  @ForeignKey(() => Employee)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  employeeId!: string;

  @ApiProperty({ description: 'Event type' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  @Index
  eventType!: string;

  @ApiProperty({ description: 'Event date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  eventDate!: Date;

  @ApiProperty({ description: 'Previous lifecycle state' })
  @Column({ type: DataType.ENUM(...Object.values(EmployeeLifecycleState)) })
  fromState?: EmployeeLifecycleState;

  @ApiProperty({ description: 'New lifecycle state' })
  @Column({ type: DataType.ENUM(...Object.values(EmployeeLifecycleState)) })
  toState?: EmployeeLifecycleState;

  @ApiProperty({ description: 'User who triggered event' })
  @Column({ type: DataType.UUID, allowNull: false })
  triggeredBy!: string;

  @ApiProperty({ description: 'Event metadata' })
  @Column({ type: DataType.JSONB })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Employee)
  employee?: Employee;
}

/**
 * Onboarding Model - Tracks new hire onboarding process
 */
@Table({
  tableName: 'onboardings',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['onboarding_status'] },
    { fields: ['planned_start_date'] },
  ],
})
export class Onboarding extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Employee ID' })
  @ForeignKey(() => Employee)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  employeeId!: string;

  @ApiProperty({ description: 'Onboarding status' })
  @Column({
    type: DataType.ENUM(...Object.values(OnboardingStatus)),
    allowNull: false,
    defaultValue: OnboardingStatus.NOT_STARTED,
  })
  @Index
  onboardingStatus!: OnboardingStatus;

  @ApiProperty({ description: 'Planned start date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  plannedStartDate!: Date;

  @ApiProperty({ description: 'Actual start date' })
  @Column({ type: DataType.DATE })
  actualStartDate?: Date;

  @ApiProperty({ description: 'Buddy employee ID' })
  @Column({ type: DataType.UUID })
  buddyId?: string;

  @ApiProperty({ description: 'Mentor employee ID' })
  @Column({ type: DataType.UUID })
  mentorId?: string;

  @ApiProperty({ description: 'Onboarding checklist' })
  @Column({ type: DataType.JSONB })
  checklistItems?: OnboardingChecklistItem[];

  @ApiProperty({ description: 'Completion date' })
  @Column({ type: DataType.DATE })
  completionDate?: Date;

  @ApiProperty({ description: 'Completion percentage' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  completionPercentage!: number;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Employee)
  employee?: Employee;
}

/**
 * Probation Period Model - Tracks employee probation periods
 */
@Table({
  tableName: 'probation_periods',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['probation_status'] },
    { fields: ['end_date'] },
  ],
})
export class ProbationPeriod extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Employee ID' })
  @ForeignKey(() => Employee)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  employeeId!: string;

  @ApiProperty({ description: 'Probation status' })
  @Column({
    type: DataType.ENUM(...Object.values(ProbationStatus)),
    allowNull: false,
    defaultValue: ProbationStatus.ACTIVE,
  })
  @Index
  probationStatus!: ProbationStatus;

  @ApiProperty({ description: 'Start date' })
  @Column({ type: DataType.DATE, allowNull: false })
  startDate!: Date;

  @ApiProperty({ description: 'End date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  endDate!: Date;

  @ApiProperty({ description: 'Review schedule dates' })
  @Column({ type: DataType.ARRAY(DataType.DATE) })
  reviewSchedule?: Date[];

  @ApiProperty({ description: 'Manager ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  managerId!: string;

  @ApiProperty({ description: 'Evaluation criteria' })
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  criteria?: string[];

  @ApiProperty({ description: 'Final evaluation date' })
  @Column({ type: DataType.DATE })
  finalEvaluationDate?: Date;

  @ApiProperty({ description: 'Pass/fail decision' })
  @Column({ type: DataType.BOOLEAN })
  passed?: boolean;

  @ApiProperty({ description: 'Extension reason if extended' })
  @Column({ type: DataType.TEXT })
  extensionReason?: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Employee)
  employee?: Employee;
}

/**
 * Internal Transfer Model - Tracks employee transfers and promotions
 */
@Table({
  tableName: 'internal_transfers',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['transfer_type'] },
    { fields: ['effective_date'] },
    { fields: ['approval_status'] },
  ],
})
export class InternalTransfer extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Employee ID' })
  @ForeignKey(() => Employee)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  employeeId!: string;

  @ApiProperty({ description: 'Transfer type' })
  @Column({
    type: DataType.ENUM(...Object.values(TransferType)),
    allowNull: false,
  })
  @Index
  transferType!: TransferType;

  @ApiProperty({ description: 'Current position ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  currentPositionId!: string;

  @ApiProperty({ description: 'New position ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  newPositionId!: string;

  @ApiProperty({ description: 'Current department ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  currentDepartmentId!: string;

  @ApiProperty({ description: 'New department ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  newDepartmentId!: string;

  @ApiProperty({ description: 'Current location ID' })
  @Column({ type: DataType.UUID })
  currentLocationId?: string;

  @ApiProperty({ description: 'New location ID' })
  @Column({ type: DataType.UUID })
  newLocationId?: string;

  @ApiProperty({ description: 'Effective date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  effectiveDate!: Date;

  @ApiProperty({ description: 'Transfer reason' })
  @Column({ type: DataType.TEXT, allowNull: false })
  reason!: string;

  @ApiProperty({ description: 'Requested by' })
  @Column({ type: DataType.UUID, allowNull: false })
  requestedBy!: string;

  @ApiProperty({ description: 'Approval status' })
  @Column({
    type: DataType.ENUM('pending', 'approved', 'rejected', 'cancelled'),
    defaultValue: 'pending',
  })
  @Index
  approvalStatus!: string;

  @ApiProperty({ description: 'Approved by' })
  @Column({ type: DataType.UUID })
  approvedBy?: string;

  @ApiProperty({ description: 'Approval date' })
  @Column({ type: DataType.DATE })
  approvalDate?: Date;

  @ApiProperty({ description: 'Compensation change amount' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  compensationChange?: number;

  @ApiProperty({ description: 'Is promotion eligible' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPromotionEligible!: boolean;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Employee)
  employee?: Employee;
}

/**
 * Employee Relocation Model - Tracks employee relocations
 */
@Table({
  tableName: 'employee_relocations',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['relocation_status'] },
    { fields: ['effective_date'] },
  ],
})
export class EmployeeRelocation extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Employee ID' })
  @ForeignKey(() => Employee)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  employeeId!: string;

  @ApiProperty({ description: 'From location ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  fromLocationId!: string;

  @ApiProperty({ description: 'To location ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  toLocationId!: string;

  @ApiProperty({ description: 'Effective date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  effectiveDate!: Date;

  @ApiProperty({ description: 'Relocation status' })
  @Column({
    type: DataType.ENUM(...Object.values(RelocationStatus)),
    defaultValue: RelocationStatus.APPROVED,
  })
  @Index
  relocationStatus!: RelocationStatus;

  @ApiProperty({ description: 'Relocation package identifier' })
  @Column({ type: DataType.STRING(100) })
  relocationPackage?: string;

  @ApiProperty({ description: 'Estimated cost' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  estimatedCost?: number;

  @ApiProperty({ description: 'Moving expenses allowed' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  movingExpensesAllowed!: boolean;

  @ApiProperty({ description: 'Temporary housing days' })
  @Column({ type: DataType.INTEGER })
  temporaryHousingDays?: number;

  @ApiProperty({ description: 'Relocation reason' })
  @Column({ type: DataType.TEXT, allowNull: false })
  reason!: string;

  @ApiProperty({ description: 'Requested by' })
  @Column({ type: DataType.UUID, allowNull: false })
  requestedBy!: string;

  @ApiProperty({ description: 'Completion date' })
  @Column({ type: DataType.DATE })
  completionDate?: Date;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Employee)
  employee?: Employee;
}

/**
 * Leave of Absence Model - Tracks employee leaves
 */
@Table({
  tableName: 'leaves_of_absence',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['leave_type'] },
    { fields: ['leave_status'] },
    { fields: ['start_date'] },
    { fields: ['end_date'] },
  ],
})
export class LeaveOfAbsence extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Employee ID' })
  @ForeignKey(() => Employee)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  employeeId!: string;

  @ApiProperty({ description: 'Leave type' })
  @Column({
    type: DataType.ENUM(...Object.values(LeaveType)),
    allowNull: false,
  })
  @Index
  leaveType!: LeaveType;

  @ApiProperty({ description: 'Leave status' })
  @Column({
    type: DataType.ENUM(...Object.values(LeaveStatus)),
    allowNull: false,
    defaultValue: LeaveStatus.REQUESTED,
  })
  @Index
  leaveStatus!: LeaveStatus;

  @ApiProperty({ description: 'Start date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  startDate!: Date;

  @ApiProperty({ description: 'End date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  endDate!: Date;

  @ApiProperty({ description: 'Expected return date' })
  @Column({ type: DataType.DATE, allowNull: false })
  expectedReturnDate!: Date;

  @ApiProperty({ description: 'Actual return date' })
  @Column({ type: DataType.DATE })
  actualReturnDate?: Date;

  @ApiProperty({ description: 'Is paid leave' })
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isPaid!: boolean;

  @ApiProperty({ description: 'Leave reason' })
  @Column({ type: DataType.TEXT })
  reason?: string;

  @ApiProperty({ description: 'Medical certification required' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  medicalCertificationRequired!: boolean;

  @ApiProperty({ description: 'Is intermittent leave' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  intermittentLeave!: boolean;

  @ApiProperty({ description: 'Has reduced schedule' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  reducedSchedule!: boolean;

  @ApiProperty({ description: 'Approved by' })
  @Column({ type: DataType.UUID })
  approvedBy?: string;

  @ApiProperty({ description: 'Approval date' })
  @Column({ type: DataType.DATE })
  approvalDate?: Date;

  @ApiProperty({ description: 'Document URLs' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  documents?: string[];

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Employee)
  employee?: Employee;
}

/**
 * Return to Work Model - Tracks return from leave
 */
@Table({
  tableName: 'return_to_work',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['leave_id'] },
    { fields: ['actual_return_date'] },
  ],
})
export class ReturnToWork extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Employee ID' })
  @ForeignKey(() => Employee)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  employeeId!: string;

  @ApiProperty({ description: 'Leave of absence ID' })
  @ForeignKey(() => LeaveOfAbsence)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  leaveId!: string;

  @ApiProperty({ description: 'Actual return date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  actualReturnDate!: Date;

  @ApiProperty({ description: 'Work restrictions' })
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  workRestrictions?: string[];

  @ApiProperty({ description: 'Modified duties description' })
  @Column({ type: DataType.TEXT })
  modifiedDuties?: string;

  @ApiProperty({ description: 'Medical clearance received' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  medicalClearance!: boolean;

  @ApiProperty({ description: 'Reintegration plan' })
  @Column({ type: DataType.TEXT })
  reintegrationPlan?: string;

  @ApiProperty({ description: 'Follow-up date' })
  @Column({ type: DataType.DATE })
  followUpDate?: Date;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Employee)
  employee?: Employee;

  @BelongsTo(() => LeaveOfAbsence)
  leave?: LeaveOfAbsence;
}

/**
 * Employee Exit Model - Tracks employee exits
 */
@Table({
  tableName: 'employee_exits',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['exit_type'] },
    { fields: ['last_working_date'] },
    { fields: ['rehire_eligibility'] },
  ],
})
export class EmployeeExit extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Employee ID' })
  @ForeignKey(() => Employee)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  employeeId!: string;

  @ApiProperty({ description: 'Exit type' })
  @Column({
    type: DataType.ENUM(...Object.values(ExitType)),
    allowNull: false,
  })
  @Index
  exitType!: ExitType;

  @ApiProperty({ description: 'Last working date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  lastWorkingDate!: Date;

  @ApiProperty({ description: 'Notice date' })
  @Column({ type: DataType.DATE })
  noticeDate?: Date;

  @ApiProperty({ description: 'Notice period days' })
  @Column({ type: DataType.INTEGER })
  noticePeriodDays?: number;

  @ApiProperty({ description: 'Exit reason' })
  @Column({ type: DataType.TEXT, allowNull: false })
  exitReason!: string;

  @ApiProperty({ description: 'Initiated by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  initiatedBy!: string;

  @ApiProperty({ description: 'Rehire eligibility' })
  @Column({
    type: DataType.ENUM(...Object.values(RehireEligibility)),
    allowNull: false,
  })
  @Index
  rehireEligibility!: RehireEligibility;

  @ApiProperty({ description: 'Final settlement amount' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  finalSettlementAmount?: number;

  @ApiProperty({ description: 'Equipment return status' })
  @Column({
    type: DataType.ENUM('pending', 'partial', 'complete'),
    defaultValue: 'pending',
  })
  equipmentReturnStatus!: string;

  @ApiProperty({ description: 'Exit interview scheduled' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  exitInterviewScheduled!: boolean;

  @ApiProperty({ description: 'Exit interview completed' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  exitInterviewCompleted!: boolean;

  @ApiProperty({ description: 'Reference check allowed' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  referenceCheckAllowed!: boolean;

  @ApiProperty({ description: 'Exit clearance completed' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  exitClearanceCompleted!: boolean;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Employee)
  employee?: Employee;
}

/**
 * Exit Interview Model - Tracks exit interview data
 */
@Table({
  tableName: 'exit_interviews',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['exit_id'] },
    { fields: ['interview_date'] },
  ],
})
export class ExitInterview extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Employee ID' })
  @ForeignKey(() => Employee)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  employeeId!: string;

  @ApiProperty({ description: 'Exit ID' })
  @ForeignKey(() => EmployeeExit)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  exitId!: string;

  @ApiProperty({ description: 'Interview date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  interviewDate!: Date;

  @ApiProperty({ description: 'Conducted by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  conductedBy!: string;

  @ApiProperty({ description: 'Primary reason for leaving' })
  @Column({ type: DataType.TEXT, allowNull: false })
  reasonForLeaving!: string;

  @ApiProperty({ description: 'Feedback on management' })
  @Column({ type: DataType.TEXT })
  feedbackOnManagement?: string;

  @ApiProperty({ description: 'Feedback on work environment' })
  @Column({ type: DataType.TEXT })
  feedbackOnWorkEnvironment?: string;

  @ApiProperty({ description: 'Would recommend company' })
  @Column({ type: DataType.BOOLEAN })
  wouldRecommendCompany?: boolean;

  @ApiProperty({ description: 'Would rehire employee' })
  @Column({ type: DataType.BOOLEAN })
  wouldRehire?: boolean;

  @ApiProperty({ description: 'Improvement suggestions' })
  @Column({ type: DataType.TEXT })
  improvementSuggestions?: string;

  @ApiProperty({ description: 'Exit survey responses' })
  @Column({ type: DataType.JSONB })
  exitSurveyResponses?: Record<string, any>;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Employee)
  employee?: Employee;

  @BelongsTo(() => EmployeeExit)
  exit?: EmployeeExit;
}

/**
 * Rehire Record Model - Tracks rehire eligibility and records
 */
@Table({
  tableName: 'rehire_records',
  timestamps: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['former_employee_number'] },
    { fields: ['eligibility_status'] },
  ],
})
export class RehireRecord extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Current employee ID (if rehired)' })
  @ForeignKey(() => Employee)
  @Column({ type: DataType.UUID })
  @Index
  employeeId?: string;

  @ApiProperty({ description: 'Former employee number' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  @Index
  formerEmployeeNumber!: string;

  @ApiProperty({ description: 'Previous exit type' })
  @Column({ type: DataType.ENUM(...Object.values(ExitType)), allowNull: false })
  previousExitType!: ExitType;

  @ApiProperty({ description: 'Previous exit date' })
  @Column({ type: DataType.DATE, allowNull: false })
  previousExitDate!: Date;

  @ApiProperty({ description: 'Eligibility status' })
  @Column({
    type: DataType.ENUM(...Object.values(RehireEligibility)),
    allowNull: false,
  })
  @Index
  eligibilityStatus!: RehireEligibility;

  @ApiProperty({ description: 'Reasons for ineligibility' })
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  reasonsForIneligibility?: string[];

  @ApiProperty({ description: 'Conditional requirements' })
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  conditionalRequirements?: string[];

  @ApiProperty({ description: 'Performance history summary' })
  @Column({ type: DataType.TEXT })
  performanceHistory?: string;

  @ApiProperty({ description: 'Disciplinary history summary' })
  @Column({ type: DataType.TEXT })
  disciplinaryHistory?: string;

  @ApiProperty({ description: 'Rehire recommendation' })
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  rehireRecommendation!: boolean;

  @ApiProperty({ description: 'Rehire date (if rehired)' })
  @Column({ type: DataType.DATE })
  rehireDate?: Date;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Employee)
  employee?: Employee;
}

// ============================================================================
// EMPLOYEE REGISTRATION AND ONBOARDING (Functions 1-8)
// ============================================================================

/**
 * Registers a new employee in the system
 *
 * @param data - Employee registration data
 * @param transaction - Optional database transaction
 * @returns Created employee record
 *
 * @example
 * ```typescript
 * const employee = await registerEmployee({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@company.com',
 *   dateOfBirth: new Date('1990-01-15'),
 *   hireDate: new Date('2024-03-01'),
 *   positionId: 'pos-123',
 *   departmentId: 'dept-456',
 *   locationId: 'loc-789',
 *   employmentType: 'full_time',
 *   jobTitle: 'Software Engineer'
 * });
 * ```
 */
export async function registerEmployee(
  data: EmployeeRegistrationData,
  transaction?: Transaction,
): Promise<Employee> {
  // Generate employee number if not provided
  const employeeNumber = data.employeeNumber || await generateEmployeeNumber();

  // Create employee record
  const employee = await Employee.create(
    {
      ...data,
      employeeNumber,
      lifecycleState: EmployeeLifecycleState.PRE_HIRE,
      isActive: true,
    },
    { transaction },
  );

  // Create lifecycle event
  await EmployeeLifecycleEvent.create(
    {
      employeeId: employee.id,
      eventType: 'employee_registered',
      eventDate: new Date(),
      toState: EmployeeLifecycleState.PRE_HIRE,
      triggeredBy: 'system',
      metadata: { registrationData: data },
    },
    { transaction },
  );

  return employee;
}

/**
 * Generates a unique employee number
 *
 * @returns Generated employee number
 *
 * @example
 * ```typescript
 * const empNumber = await generateEmployeeNumber();
 * // Returns: "EMP-2024-001234"
 * ```
 */
export async function generateEmployeeNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await Employee.count();
  return `EMP-${year}-${String(count + 1).padStart(6, '0')}`;
}

/**
 * Creates onboarding plan for new hire
 *
 * @param data - Onboarding plan data
 * @param transaction - Optional database transaction
 * @returns Created onboarding record
 *
 * @example
 * ```typescript
 * const onboarding = await createOnboardingPlan({
 *   employeeId: 'emp-123',
 *   plannedStartDate: new Date('2024-03-01'),
 *   buddy: 'emp-456',
 *   mentor: 'emp-789',
 *   checklistItems: [
 *     {
 *       id: '1',
 *       category: 'paperwork',
 *       taskName: 'Complete W-4 form',
 *       isRequired: true,
 *       status: 'pending'
 *     }
 *   ]
 * });
 * ```
 */
export async function createOnboardingPlan(
  data: OnboardingPlanData,
  transaction?: Transaction,
): Promise<Onboarding> {
  const employee = await Employee.findByPk(data.employeeId, { transaction });
  if (!employee) {
    throw new NotFoundException(`Employee ${data.employeeId} not found`);
  }

  const onboarding = await Onboarding.create(
    {
      employeeId: data.employeeId,
      onboardingStatus: OnboardingStatus.NOT_STARTED,
      plannedStartDate: data.plannedStartDate,
      actualStartDate: data.actualStartDate,
      buddyId: data.buddy,
      mentorId: data.mentor,
      checklistItems: data.checklistItems,
      completionPercentage: 0,
      notes: data.notes,
    },
    { transaction },
  );

  return onboarding;
}

/**
 * Updates onboarding checklist item status
 *
 * @param onboardingId - Onboarding identifier
 * @param itemId - Checklist item ID
 * @param status - New status
 * @param completedDate - Completion date if completed
 * @param transaction - Optional database transaction
 * @returns Updated onboarding record
 *
 * @example
 * ```typescript
 * await updateOnboardingChecklistItem(
 *   'onb-123',
 *   'item-1',
 *   'completed',
 *   new Date()
 * );
 * ```
 */
export async function updateOnboardingChecklistItem(
  onboardingId: string,
  itemId: string,
  status: 'pending' | 'in_progress' | 'completed' | 'blocked',
  completedDate?: Date,
  transaction?: Transaction,
): Promise<Onboarding> {
  const onboarding = await Onboarding.findByPk(onboardingId, { transaction });
  if (!onboarding) {
    throw new NotFoundException(`Onboarding ${onboardingId} not found`);
  }

  const checklistItems = onboarding.checklistItems || [];
  const item = checklistItems.find(i => i.id === itemId);
  if (!item) {
    throw new NotFoundException(`Checklist item ${itemId} not found`);
  }

  item.status = status;
  if (status === 'completed' && completedDate) {
    item.completedDate = completedDate;
  }

  // Calculate completion percentage
  const completedCount = checklistItems.filter(i => i.status === 'completed').length;
  const completionPercentage = Math.round((completedCount / checklistItems.length) * 100);

  await onboarding.update(
    {
      checklistItems,
      completionPercentage,
      onboardingStatus:
        completionPercentage === 100
          ? OnboardingStatus.COMPLETED
          : OnboardingStatus.IN_PROGRESS,
    },
    { transaction },
  );

  return onboarding;
}

/**
 * Starts employee onboarding process
 *
 * @param employeeId - Employee identifier
 * @param actualStartDate - Actual start date
 * @param transaction - Optional database transaction
 * @returns Updated employee and onboarding records
 *
 * @example
 * ```typescript
 * const { employee, onboarding } = await startOnboarding(
 *   'emp-123',
 *   new Date('2024-03-01')
 * );
 * ```
 */
export async function startOnboarding(
  employeeId: string,
  actualStartDate: Date,
  transaction?: Transaction,
): Promise<{ employee: Employee; onboarding: Onboarding }> {
  const employee = await Employee.findByPk(employeeId, { transaction });
  if (!employee) {
    throw new NotFoundException(`Employee ${employeeId} not found`);
  }

  // Update employee lifecycle state
  await employee.update(
    { lifecycleState: EmployeeLifecycleState.ONBOARDING },
    { transaction },
  );

  // Update onboarding record
  const onboarding = await Onboarding.findOne({
    where: { employeeId },
    transaction,
  });

  if (!onboarding) {
    throw new NotFoundException(`Onboarding plan not found for employee ${employeeId}`);
  }

  await onboarding.update(
    {
      actualStartDate,
      onboardingStatus: OnboardingStatus.IN_PROGRESS,
    },
    { transaction },
  );

  // Create lifecycle event
  await EmployeeLifecycleEvent.create(
    {
      employeeId,
      eventType: 'onboarding_started',
      eventDate: actualStartDate,
      fromState: EmployeeLifecycleState.PRE_HIRE,
      toState: EmployeeLifecycleState.ONBOARDING,
      triggeredBy: 'system',
    },
    { transaction },
  );

  return { employee, onboarding };
}

/**
 * Completes employee onboarding process
 *
 * @param employeeId - Employee identifier
 * @param completionDate - Onboarding completion date
 * @param transaction - Optional database transaction
 * @returns Updated employee record
 *
 * @example
 * ```typescript
 * const employee = await completeOnboarding('emp-123', new Date());
 * ```
 */
export async function completeOnboarding(
  employeeId: string,
  completionDate: Date,
  transaction?: Transaction,
): Promise<Employee> {
  const employee = await Employee.findByPk(employeeId, { transaction });
  if (!employee) {
    throw new NotFoundException(`Employee ${employeeId} not found`);
  }

  // Update onboarding record
  const onboarding = await Onboarding.findOne({
    where: { employeeId },
    transaction,
  });

  if (onboarding) {
    await onboarding.update(
      {
        completionDate,
        onboardingStatus: OnboardingStatus.COMPLETED,
        completionPercentage: 100,
      },
      { transaction },
    );
  }

  // Update employee lifecycle state
  await employee.update(
    { lifecycleState: EmployeeLifecycleState.PROBATION },
    { transaction },
  );

  // Create lifecycle event
  await EmployeeLifecycleEvent.create(
    {
      employeeId,
      eventType: 'onboarding_completed',
      eventDate: completionDate,
      fromState: EmployeeLifecycleState.ONBOARDING,
      toState: EmployeeLifecycleState.PROBATION,
      triggeredBy: 'system',
    },
    { transaction },
  );

  return employee;
}

/**
 * Gets onboarding status for employee
 *
 * @param employeeId - Employee identifier
 * @returns Onboarding record with details
 *
 * @example
 * ```typescript
 * const status = await getOnboardingStatus('emp-123');
 * console.log(status.completionPercentage);
 * ```
 */
export async function getOnboardingStatus(employeeId: string): Promise<Onboarding> {
  const onboarding = await Onboarding.findOne({
    where: { employeeId },
    include: [{ model: Employee }],
  });

  if (!onboarding) {
    throw new NotFoundException(`Onboarding plan not found for employee ${employeeId}`);
  }

  return onboarding;
}

/**
 * Gets all onboarding records with specific status
 *
 * @param status - Onboarding status to filter
 * @param limit - Maximum number of records
 * @returns Array of onboarding records
 *
 * @example
 * ```typescript
 * const inProgress = await getOnboardingsByStatus(
 *   OnboardingStatus.IN_PROGRESS,
 *   50
 * );
 * ```
 */
export async function getOnboardingsByStatus(
  status: OnboardingStatus,
  limit: number = 100,
): Promise<Onboarding[]> {
  return Onboarding.findAll({
    where: { onboardingStatus: status },
    include: [{ model: Employee }],
    order: [['plannedStartDate', 'ASC']],
    limit,
  });
}

// ============================================================================
// PROBATION PERIOD MANAGEMENT (Functions 9-13)
// ============================================================================

/**
 * Creates probation period for employee
 *
 * @param data - Probation period data
 * @param transaction - Optional database transaction
 * @returns Created probation period record
 *
 * @example
 * ```typescript
 * const probation = await createProbationPeriod({
 *   employeeId: 'emp-123',
 *   startDate: new Date('2024-03-01'),
 *   endDate: new Date('2024-06-01'),
 *   reviewSchedule: [new Date('2024-04-15'), new Date('2024-05-15')],
 *   managerId: 'mgr-456'
 * });
 * ```
 */
export async function createProbationPeriod(
  data: ProbationPeriodData,
  transaction?: Transaction,
): Promise<ProbationPeriod> {
  const employee = await Employee.findByPk(data.employeeId, { transaction });
  if (!employee) {
    throw new NotFoundException(`Employee ${data.employeeId} not found`);
  }

  const probation = await ProbationPeriod.create(
    {
      employeeId: data.employeeId,
      probationStatus: ProbationStatus.ACTIVE,
      startDate: data.startDate,
      endDate: data.endDate,
      reviewSchedule: data.reviewSchedule,
      managerId: data.managerId,
      criteria: data.criteria,
      notes: data.notes,
    },
    { transaction },
  );

  return probation;
}

/**
 * Extends probation period
 *
 * @param probationId - Probation period identifier
 * @param newEndDate - New end date
 * @param reason - Extension reason
 * @param transaction - Optional database transaction
 * @returns Updated probation period
 *
 * @example
 * ```typescript
 * const extended = await extendProbationPeriod(
 *   'prob-123',
 *   new Date('2024-09-01'),
 *   'Additional time needed for performance improvement'
 * );
 * ```
 */
export async function extendProbationPeriod(
  probationId: string,
  newEndDate: Date,
  reason: string,
  transaction?: Transaction,
): Promise<ProbationPeriod> {
  const probation = await ProbationPeriod.findByPk(probationId, { transaction });
  if (!probation) {
    throw new NotFoundException(`Probation period ${probationId} not found`);
  }

  await probation.update(
    {
      endDate: newEndDate,
      probationStatus: ProbationStatus.EXTENDED,
      extensionReason: reason,
    },
    { transaction },
  );

  // Create lifecycle event
  await EmployeeLifecycleEvent.create(
    {
      employeeId: probation.employeeId,
      eventType: 'probation_extended',
      eventDate: new Date(),
      triggeredBy: 'system',
      metadata: { newEndDate, reason },
    },
    { transaction },
  );

  return probation;
}

/**
 * Completes probation period evaluation
 *
 * @param probationId - Probation period identifier
 * @param passed - Whether employee passed probation
 * @param evaluationDate - Evaluation date
 * @param notes - Evaluation notes
 * @param transaction - Optional database transaction
 * @returns Updated probation period and employee
 *
 * @example
 * ```typescript
 * const result = await completeProbationEvaluation(
 *   'prob-123',
 *   true,
 *   new Date(),
 *   'Excellent performance, confirmed in position'
 * );
 * ```
 */
export async function completeProbationEvaluation(
  probationId: string,
  passed: boolean,
  evaluationDate: Date,
  notes?: string,
  transaction?: Transaction,
): Promise<{ probation: ProbationPeriod; employee: Employee }> {
  const probation = await ProbationPeriod.findByPk(probationId, {
    include: [{ model: Employee }],
    transaction,
  });

  if (!probation) {
    throw new NotFoundException(`Probation period ${probationId} not found`);
  }

  // Update probation record
  await probation.update(
    {
      probationStatus: passed ? ProbationStatus.PASSED : ProbationStatus.FAILED,
      finalEvaluationDate: evaluationDate,
      passed,
      notes: notes ? `${probation.notes || ''}\n${notes}` : probation.notes,
    },
    { transaction },
  );

  // Update employee lifecycle state
  const employee = probation.employee!;
  if (passed) {
    await employee.update(
      { lifecycleState: EmployeeLifecycleState.ACTIVE },
      { transaction },
    );

    // Create lifecycle event
    await EmployeeLifecycleEvent.create(
      {
        employeeId: employee.id,
        eventType: 'probation_passed',
        eventDate: evaluationDate,
        fromState: EmployeeLifecycleState.PROBATION,
        toState: EmployeeLifecycleState.ACTIVE,
        triggeredBy: probation.managerId,
      },
      { transaction },
    );
  } else {
    // Failed probation typically leads to termination
    await employee.update(
      { lifecycleState: EmployeeLifecycleState.TERMINATED },
      { transaction },
    );

    // Create lifecycle event
    await EmployeeLifecycleEvent.create(
      {
        employeeId: employee.id,
        eventType: 'probation_failed',
        eventDate: evaluationDate,
        fromState: EmployeeLifecycleState.PROBATION,
        toState: EmployeeLifecycleState.TERMINATED,
        triggeredBy: probation.managerId,
        metadata: { reason: 'Failed probation period' },
      },
      { transaction },
    );
  }

  return { probation, employee };
}

/**
 * Gets probation periods ending soon
 *
 * @param daysUntilEnd - Number of days threshold
 * @returns Probation periods ending within threshold
 *
 * @example
 * ```typescript
 * const ending = await getProbationPeriodsEndingSoon(30);
 * ```
 */
export async function getProbationPeriodsEndingSoon(
  daysUntilEnd: number = 30,
): Promise<ProbationPeriod[]> {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysUntilEnd);

  return ProbationPeriod.findAll({
    where: {
      probationStatus: { [Op.in]: [ProbationStatus.ACTIVE, ProbationStatus.EXTENDED] },
      endDate: { [Op.lte]: thresholdDate },
    },
    include: [{ model: Employee }],
    order: [['endDate', 'ASC']],
  });
}

/**
 * Gets probation status for employee
 *
 * @param employeeId - Employee identifier
 * @returns Active probation period or null
 *
 * @example
 * ```typescript
 * const probation = await getProbationStatus('emp-123');
 * ```
 */
export async function getProbationStatus(
  employeeId: string,
): Promise<ProbationPeriod | null> {
  return ProbationPeriod.findOne({
    where: {
      employeeId,
      probationStatus: { [Op.in]: [ProbationStatus.ACTIVE, ProbationStatus.EXTENDED] },
    },
    include: [{ model: Employee }],
  });
}

// ============================================================================
// INTERNAL TRANSFERS & PROMOTIONS (Functions 14-19)
// ============================================================================

/**
 * Creates internal transfer request
 *
 * @param data - Transfer request data
 * @param transaction - Optional database transaction
 * @returns Created transfer request
 *
 * @example
 * ```typescript
 * const transfer = await createTransferRequest({
 *   employeeId: 'emp-123',
 *   transferType: TransferType.PROMOTION,
 *   currentPositionId: 'pos-123',
 *   newPositionId: 'pos-456',
 *   currentDepartmentId: 'dept-123',
 *   newDepartmentId: 'dept-456',
 *   effectiveDate: new Date('2024-04-01'),
 *   reason: 'Promotion to senior role',
 *   requestedBy: 'mgr-789',
 *   approvalRequired: true
 * });
 * ```
 */
export async function createTransferRequest(
  data: TransferRequestData,
  transaction?: Transaction,
): Promise<InternalTransfer> {
  const employee = await Employee.findByPk(data.employeeId, { transaction });
  if (!employee) {
    throw new NotFoundException(`Employee ${data.employeeId} not found`);
  }

  const transfer = await InternalTransfer.create(
    {
      ...data,
      approvalStatus: data.approvalRequired ? 'pending' : 'approved',
    },
    { transaction },
  );

  return transfer;
}

/**
 * Approves transfer request
 *
 * @param transferId - Transfer identifier
 * @param approvedBy - Approver user ID
 * @param approvalDate - Approval date
 * @param transaction - Optional database transaction
 * @returns Updated transfer request
 *
 * @example
 * ```typescript
 * const approved = await approveTransferRequest(
 *   'trans-123',
 *   'mgr-456',
 *   new Date()
 * );
 * ```
 */
export async function approveTransferRequest(
  transferId: string,
  approvedBy: string,
  approvalDate: Date = new Date(),
  transaction?: Transaction,
): Promise<InternalTransfer> {
  const transfer = await InternalTransfer.findByPk(transferId, { transaction });
  if (!transfer) {
    throw new NotFoundException(`Transfer ${transferId} not found`);
  }

  await transfer.update(
    {
      approvalStatus: 'approved',
      approvedBy,
      approvalDate,
    },
    { transaction },
  );

  return transfer;
}

/**
 * Executes approved transfer
 *
 * @param transferId - Transfer identifier
 * @param effectiveDate - Effective date of transfer
 * @param transaction - Optional database transaction
 * @returns Updated employee and transfer records
 *
 * @example
 * ```typescript
 * const result = await executeTransfer('trans-123', new Date());
 * ```
 */
export async function executeTransfer(
  transferId: string,
  effectiveDate: Date = new Date(),
  transaction?: Transaction,
): Promise<{ employee: Employee; transfer: InternalTransfer }> {
  const transfer = await InternalTransfer.findByPk(transferId, {
    include: [{ model: Employee }],
    transaction,
  });

  if (!transfer) {
    throw new NotFoundException(`Transfer ${transferId} not found`);
  }

  if (transfer.approvalStatus !== 'approved') {
    throw new BadRequestException('Transfer must be approved before execution');
  }

  const employee = transfer.employee!;

  // Update employee details
  await employee.update(
    {
      positionId: transfer.newPositionId,
      departmentId: transfer.newDepartmentId,
      locationId: transfer.newLocationId || employee.locationId,
      compensation: transfer.compensationChange
        ? (employee.compensation || 0) + transfer.compensationChange
        : employee.compensation,
    },
    { transaction },
  );

  // Create lifecycle event
  await EmployeeLifecycleEvent.create(
    {
      employeeId: employee.id,
      eventType: 'transfer_executed',
      eventDate: effectiveDate,
      triggeredBy: transfer.approvedBy || 'system',
      metadata: {
        transferType: transfer.transferType,
        fromPosition: transfer.currentPositionId,
        toPosition: transfer.newPositionId,
      },
    },
    { transaction },
  );

  return { employee, transfer };
}

/**
 * Gets pending transfer requests
 *
 * @param limit - Maximum number of records
 * @returns Pending transfer requests
 *
 * @example
 * ```typescript
 * const pending = await getPendingTransfers(100);
 * ```
 */
export async function getPendingTransfers(limit: number = 100): Promise<InternalTransfer[]> {
  return InternalTransfer.findAll({
    where: { approvalStatus: 'pending' },
    include: [{ model: Employee }],
    order: [['createdAt', 'ASC']],
    limit,
  });
}

/**
 * Gets transfer history for employee
 *
 * @param employeeId - Employee identifier
 * @param limit - Maximum number of records
 * @returns Transfer history
 *
 * @example
 * ```typescript
 * const history = await getTransferHistory('emp-123', 10);
 * ```
 */
export async function getTransferHistory(
  employeeId: string,
  limit: number = 10,
): Promise<InternalTransfer[]> {
  return InternalTransfer.findAll({
    where: { employeeId },
    order: [['effectiveDate', 'DESC']],
    limit,
  });
}

/**
 * Cancels pending transfer request
 *
 * @param transferId - Transfer identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated transfer request
 *
 * @example
 * ```typescript
 * const cancelled = await cancelTransferRequest(
 *   'trans-123',
 *   'Employee declined promotion'
 * );
 * ```
 */
export async function cancelTransferRequest(
  transferId: string,
  reason: string,
  transaction?: Transaction,
): Promise<InternalTransfer> {
  const transfer = await InternalTransfer.findByPk(transferId, { transaction });
  if (!transfer) {
    throw new NotFoundException(`Transfer ${transferId} not found`);
  }

  await transfer.update(
    {
      approvalStatus: 'cancelled',
      notes: `${transfer.notes || ''}\nCancelled: ${reason}`,
    },
    { transaction },
  );

  return transfer;
}

// ============================================================================
// RELOCATION MANAGEMENT (Functions 20-23)
// ============================================================================

/**
 * Creates employee relocation request
 *
 * @param data - Relocation request data
 * @param transaction - Optional database transaction
 * @returns Created relocation record
 *
 * @example
 * ```typescript
 * const relocation = await createRelocationRequest({
 *   employeeId: 'emp-123',
 *   fromLocationId: 'loc-123',
 *   toLocationId: 'loc-456',
 *   effectiveDate: new Date('2024-05-01'),
 *   relocationPackage: 'standard',
 *   estimatedCost: 15000,
 *   movingExpensesAllowed: true,
 *   temporaryHousingDays: 30,
 *   reason: 'Business need - new office opening',
 *   requestedBy: 'mgr-789'
 * });
 * ```
 */
export async function createRelocationRequest(
  data: RelocationRequestData,
  transaction?: Transaction,
): Promise<EmployeeRelocation> {
  const employee = await Employee.findByPk(data.employeeId, { transaction });
  if (!employee) {
    throw new NotFoundException(`Employee ${data.employeeId} not found`);
  }

  const relocation = await EmployeeRelocation.create(
    {
      ...data,
      relocationStatus: RelocationStatus.APPROVED,
    },
    { transaction },
  );

  return relocation;
}

/**
 * Starts relocation process
 *
 * @param relocationId - Relocation identifier
 * @param transaction - Optional database transaction
 * @returns Updated relocation record
 *
 * @example
 * ```typescript
 * const started = await startRelocation('rel-123');
 * ```
 */
export async function startRelocation(
  relocationId: string,
  transaction?: Transaction,
): Promise<EmployeeRelocation> {
  const relocation = await EmployeeRelocation.findByPk(relocationId, { transaction });
  if (!relocation) {
    throw new NotFoundException(`Relocation ${relocationId} not found`);
  }

  await relocation.update(
    { relocationStatus: RelocationStatus.IN_PROGRESS },
    { transaction },
  );

  return relocation;
}

/**
 * Completes relocation process
 *
 * @param relocationId - Relocation identifier
 * @param completionDate - Completion date
 * @param transaction - Optional database transaction
 * @returns Updated employee and relocation records
 *
 * @example
 * ```typescript
 * const result = await completeRelocation('rel-123', new Date());
 * ```
 */
export async function completeRelocation(
  relocationId: string,
  completionDate: Date = new Date(),
  transaction?: Transaction,
): Promise<{ employee: Employee; relocation: EmployeeRelocation }> {
  const relocation = await EmployeeRelocation.findByPk(relocationId, {
    include: [{ model: Employee }],
    transaction,
  });

  if (!relocation) {
    throw new NotFoundException(`Relocation ${relocationId} not found`);
  }

  // Update relocation status
  await relocation.update(
    {
      relocationStatus: RelocationStatus.COMPLETED,
      completionDate,
    },
    { transaction },
  );

  // Update employee location
  const employee = relocation.employee!;
  await employee.update(
    { locationId: relocation.toLocationId },
    { transaction },
  );

  // Create lifecycle event
  await EmployeeLifecycleEvent.create(
    {
      employeeId: employee.id,
      eventType: 'relocation_completed',
      eventDate: completionDate,
      triggeredBy: 'system',
      metadata: {
        fromLocation: relocation.fromLocationId,
        toLocation: relocation.toLocationId,
      },
    },
    { transaction },
  );

  return { employee, relocation };
}

/**
 * Gets active relocations
 *
 * @param limit - Maximum number of records
 * @returns Active relocation records
 *
 * @example
 * ```typescript
 * const active = await getActiveRelocations(50);
 * ```
 */
export async function getActiveRelocations(limit: number = 100): Promise<EmployeeRelocation[]> {
  return EmployeeRelocation.findAll({
    where: {
      relocationStatus: {
        [Op.in]: [RelocationStatus.APPROVED, RelocationStatus.IN_PROGRESS],
      },
    },
    include: [{ model: Employee }],
    order: [['effectiveDate', 'ASC']],
    limit,
  });
}

// ============================================================================
// LEAVE OF ABSENCE MANAGEMENT (Functions 24-31)
// ============================================================================

/**
 * Creates leave of absence request
 *
 * @param data - Leave of absence data
 * @param transaction - Optional database transaction
 * @returns Created leave record
 *
 * @example
 * ```typescript
 * const leave = await createLeaveOfAbsence({
 *   employeeId: 'emp-123',
 *   leaveType: LeaveType.FMLA,
 *   startDate: new Date('2024-04-01'),
 *   endDate: new Date('2024-06-01'),
 *   expectedReturnDate: new Date('2024-06-03'),
 *   isPaid: false,
 *   reason: 'Medical condition requiring treatment',
 *   medicalCertificationRequired: true
 * });
 * ```
 */
export async function createLeaveOfAbsence(
  data: LeaveOfAbsenceData,
  transaction?: Transaction,
): Promise<LeaveOfAbsence> {
  const employee = await Employee.findByPk(data.employeeId, { transaction });
  if (!employee) {
    throw new NotFoundException(`Employee ${data.employeeId} not found`);
  }

  const leave = await LeaveOfAbsence.create(
    {
      ...data,
      leaveStatus: LeaveStatus.REQUESTED,
    },
    { transaction },
  );

  return leave;
}

/**
 * Approves leave of absence request
 *
 * @param leaveId - Leave identifier
 * @param approvedBy - Approver user ID
 * @param approvalDate - Approval date
 * @param transaction - Optional database transaction
 * @returns Updated leave record
 *
 * @example
 * ```typescript
 * const approved = await approveLeaveRequest('leave-123', 'mgr-456');
 * ```
 */
export async function approveLeaveRequest(
  leaveId: string,
  approvedBy: string,
  approvalDate: Date = new Date(),
  transaction?: Transaction,
): Promise<LeaveOfAbsence> {
  const leave = await LeaveOfAbsence.findByPk(leaveId, { transaction });
  if (!leave) {
    throw new NotFoundException(`Leave ${leaveId} not found`);
  }

  await leave.update(
    {
      leaveStatus: LeaveStatus.APPROVED,
      approvedBy,
      approvalDate,
    },
    { transaction },
  );

  return leave;
}

/**
 * Starts leave of absence
 *
 * @param leaveId - Leave identifier
 * @param startDate - Actual start date
 * @param transaction - Optional database transaction
 * @returns Updated employee and leave records
 *
 * @example
 * ```typescript
 * const result = await startLeave('leave-123', new Date());
 * ```
 */
export async function startLeave(
  leaveId: string,
  startDate: Date = new Date(),
  transaction?: Transaction,
): Promise<{ employee: Employee; leave: LeaveOfAbsence }> {
  const leave = await LeaveOfAbsence.findByPk(leaveId, {
    include: [{ model: Employee }],
    transaction,
  });

  if (!leave) {
    throw new NotFoundException(`Leave ${leaveId} not found`);
  }

  if (leave.leaveStatus !== LeaveStatus.APPROVED) {
    throw new BadRequestException('Leave must be approved before starting');
  }

  // Update leave status
  await leave.update(
    { leaveStatus: LeaveStatus.ACTIVE },
    { transaction },
  );

  // Update employee lifecycle state
  const employee = leave.employee!;
  await employee.update(
    { lifecycleState: EmployeeLifecycleState.ON_LEAVE },
    { transaction },
  );

  // Create lifecycle event
  await EmployeeLifecycleEvent.create(
    {
      employeeId: employee.id,
      eventType: 'leave_started',
      eventDate: startDate,
      fromState: EmployeeLifecycleState.ACTIVE,
      toState: EmployeeLifecycleState.ON_LEAVE,
      triggeredBy: leave.approvedBy || 'system',
      metadata: { leaveType: leave.leaveType, leaveId: leave.id },
    },
    { transaction },
  );

  return { employee, leave };
}

/**
 * Extends leave of absence
 *
 * @param leaveId - Leave identifier
 * @param newEndDate - New end date
 * @param newExpectedReturnDate - New expected return date
 * @param reason - Extension reason
 * @param transaction - Optional database transaction
 * @returns Updated leave record
 *
 * @example
 * ```typescript
 * const extended = await extendLeave(
 *   'leave-123',
 *   new Date('2024-07-01'),
 *   new Date('2024-07-03'),
 *   'Medical condition requires additional recovery time'
 * );
 * ```
 */
export async function extendLeave(
  leaveId: string,
  newEndDate: Date,
  newExpectedReturnDate: Date,
  reason: string,
  transaction?: Transaction,
): Promise<LeaveOfAbsence> {
  const leave = await LeaveOfAbsence.findByPk(leaveId, { transaction });
  if (!leave) {
    throw new NotFoundException(`Leave ${leaveId} not found`);
  }

  await leave.update(
    {
      endDate: newEndDate,
      expectedReturnDate: newExpectedReturnDate,
      leaveStatus: LeaveStatus.EXTENDED,
      notes: `${leave.notes || ''}\nExtended: ${reason}`,
    },
    { transaction },
  );

  // Create lifecycle event
  await EmployeeLifecycleEvent.create(
    {
      employeeId: leave.employeeId,
      eventType: 'leave_extended',
      eventDate: new Date(),
      triggeredBy: 'system',
      metadata: { newEndDate, reason },
    },
    { transaction },
  );

  return leave;
}

/**
 * Denies leave of absence request
 *
 * @param leaveId - Leave identifier
 * @param reason - Denial reason
 * @param transaction - Optional database transaction
 * @returns Updated leave record
 *
 * @example
 * ```typescript
 * const denied = await denyLeaveRequest(
 *   'leave-123',
 *   'Insufficient leave balance'
 * );
 * ```
 */
export async function denyLeaveRequest(
  leaveId: string,
  reason: string,
  transaction?: Transaction,
): Promise<LeaveOfAbsence> {
  const leave = await LeaveOfAbsence.findByPk(leaveId, { transaction });
  if (!leave) {
    throw new NotFoundException(`Leave ${leaveId} not found`);
  }

  await leave.update(
    {
      leaveStatus: LeaveStatus.DENIED,
      notes: `${leave.notes || ''}\nDenied: ${reason}`,
    },
    { transaction },
  );

  return leave;
}

/**
 * Cancels approved leave request
 *
 * @param leaveId - Leave identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated leave record
 *
 * @example
 * ```typescript
 * const cancelled = await cancelLeaveRequest(
 *   'leave-123',
 *   'Employee no longer requires leave'
 * );
 * ```
 */
export async function cancelLeaveRequest(
  leaveId: string,
  reason: string,
  transaction?: Transaction,
): Promise<LeaveOfAbsence> {
  const leave = await LeaveOfAbsence.findByPk(leaveId, { transaction });
  if (!leave) {
    throw new NotFoundException(`Leave ${leaveId} not found`);
  }

  await leave.update(
    {
      leaveStatus: LeaveStatus.CANCELLED,
      notes: `${leave.notes || ''}\nCancelled: ${reason}`,
    },
    { transaction },
  );

  return leave;
}

/**
 * Gets active leaves for employee
 *
 * @param employeeId - Employee identifier
 * @returns Active leave records
 *
 * @example
 * ```typescript
 * const leaves = await getActiveLeaves('emp-123');
 * ```
 */
export async function getActiveLeaves(employeeId: string): Promise<LeaveOfAbsence[]> {
  return LeaveOfAbsence.findAll({
    where: {
      employeeId,
      leaveStatus: { [Op.in]: [LeaveStatus.ACTIVE, LeaveStatus.EXTENDED] },
    },
    order: [['startDate', 'DESC']],
  });
}

/**
 * Gets leaves ending soon
 *
 * @param daysUntilEnd - Days threshold
 * @returns Leaves ending within threshold
 *
 * @example
 * ```typescript
 * const ending = await getLeavesEndingSoon(7);
 * ```
 */
export async function getLeavesEndingSoon(
  daysUntilEnd: number = 7,
): Promise<LeaveOfAbsence[]> {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysUntilEnd);

  return LeaveOfAbsence.findAll({
    where: {
      leaveStatus: { [Op.in]: [LeaveStatus.ACTIVE, LeaveStatus.EXTENDED] },
      expectedReturnDate: { [Op.lte]: thresholdDate },
    },
    include: [{ model: Employee }],
    order: [['expectedReturnDate', 'ASC']],
  });
}

// ============================================================================
// RETURN TO WORK PROCESSES (Functions 32-34)
// ============================================================================

/**
 * Processes return to work from leave
 *
 * @param data - Return to work data
 * @param transaction - Optional database transaction
 * @returns Return to work record and updated employee
 *
 * @example
 * ```typescript
 * const result = await processReturnToWork({
 *   employeeId: 'emp-123',
 *   leaveId: 'leave-456',
 *   actualReturnDate: new Date(),
 *   medicalClearance: true,
 *   workRestrictions: ['No lifting over 20 lbs'],
 *   reintegrationPlan: 'Gradual return to full duties over 2 weeks'
 * });
 * ```
 */
export async function processReturnToWork(
  data: ReturnToWorkData,
  transaction?: Transaction,
): Promise<{ returnToWork: ReturnToWork; employee: Employee; leave: LeaveOfAbsence }> {
  const leave = await LeaveOfAbsence.findByPk(data.leaveId, {
    include: [{ model: Employee }],
    transaction,
  });

  if (!leave) {
    throw new NotFoundException(`Leave ${data.leaveId} not found`);
  }

  // Create return to work record
  const returnToWork = await ReturnToWork.create(
    {
      ...data,
    },
    { transaction },
  );

  // Update leave status
  await leave.update(
    {
      leaveStatus: LeaveStatus.RETURNED,
      actualReturnDate: data.actualReturnDate,
    },
    { transaction },
  );

  // Update employee lifecycle state
  const employee = leave.employee!;
  await employee.update(
    { lifecycleState: EmployeeLifecycleState.ACTIVE },
    { transaction },
  );

  // Create lifecycle event
  await EmployeeLifecycleEvent.create(
    {
      employeeId: employee.id,
      eventType: 'returned_to_work',
      eventDate: data.actualReturnDate,
      fromState: EmployeeLifecycleState.ON_LEAVE,
      toState: EmployeeLifecycleState.ACTIVE,
      triggeredBy: 'system',
      metadata: { leaveId: data.leaveId },
    },
    { transaction },
  );

  return { returnToWork, employee, leave };
}

/**
 * Updates return to work plan
 *
 * @param returnToWorkId - Return to work identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated return to work record
 *
 * @example
 * ```typescript
 * const updated = await updateReturnToWorkPlan('rtw-123', {
 *   modifiedDuties: 'Light duty assignments for first week',
 *   followUpDate: new Date('2024-05-15')
 * });
 * ```
 */
export async function updateReturnToWorkPlan(
  returnToWorkId: string,
  updates: Partial<ReturnToWork>,
  transaction?: Transaction,
): Promise<ReturnToWork> {
  const returnToWork = await ReturnToWork.findByPk(returnToWorkId, { transaction });
  if (!returnToWork) {
    throw new NotFoundException(`Return to work ${returnToWorkId} not found`);
  }

  await returnToWork.update(updates, { transaction });
  return returnToWork;
}

/**
 * Gets return to work records requiring follow-up
 *
 * @param daysUntilFollowUp - Days threshold
 * @returns Return to work records needing follow-up
 *
 * @example
 * ```typescript
 * const followUps = await getReturnToWorkFollowUps(7);
 * ```
 */
export async function getReturnToWorkFollowUps(
  daysUntilFollowUp: number = 7,
): Promise<ReturnToWork[]> {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysUntilFollowUp);

  return ReturnToWork.findAll({
    where: {
      followUpDate: { [Op.lte]: thresholdDate, [Op.ne]: null },
    },
    include: [{ model: Employee }],
    order: [['followUpDate', 'ASC']],
  });
}

// ============================================================================
// RESIGNATION & EXIT WORKFLOWS (Functions 35-40)
// ============================================================================

/**
 * Initiates employee exit process
 *
 * @param data - Employee exit data
 * @param transaction - Optional database transaction
 * @returns Created exit record
 *
 * @example
 * ```typescript
 * const exit = await initiateEmployeeExit({
 *   employeeId: 'emp-123',
 *   exitType: ExitType.VOLUNTARY_RESIGNATION,
 *   lastWorkingDate: new Date('2024-05-31'),
 *   noticeDate: new Date('2024-05-01'),
 *   noticePeriodDays: 30,
 *   exitReason: 'Career advancement opportunity',
 *   initiatedBy: 'emp-123',
 *   rehireEligibility: RehireEligibility.ELIGIBLE,
 *   referenceCheckAllowed: true
 * });
 * ```
 */
export async function initiateEmployeeExit(
  data: EmployeeExitData,
  transaction?: Transaction,
): Promise<EmployeeExit> {
  const employee = await Employee.findByPk(data.employeeId, { transaction });
  if (!employee) {
    throw new NotFoundException(`Employee ${data.employeeId} not found`);
  }

  // Create exit record
  const exit = await EmployeeExit.create(
    {
      ...data,
      exitInterviewCompleted: false,
      exitClearanceCompleted: false,
    },
    { transaction },
  );

  // Update employee lifecycle state
  await employee.update(
    {
      lifecycleState: EmployeeLifecycleState.NOTICE_PERIOD,
      lastWorkingDate: data.lastWorkingDate,
      rehireEligibility: data.rehireEligibility,
    },
    { transaction },
  );

  // Create lifecycle event
  await EmployeeLifecycleEvent.create(
    {
      employeeId: employee.id,
      eventType: 'exit_initiated',
      eventDate: data.noticeDate || new Date(),
      fromState: employee.lifecycleState,
      toState: EmployeeLifecycleState.NOTICE_PERIOD,
      triggeredBy: data.initiatedBy,
      metadata: { exitType: data.exitType, lastWorkingDate: data.lastWorkingDate },
    },
    { transaction },
  );

  return exit;
}

/**
 * Conducts exit interview
 *
 * @param data - Exit interview data
 * @param transaction - Optional database transaction
 * @returns Created exit interview record
 *
 * @example
 * ```typescript
 * const interview = await conductExitInterview({
 *   employeeId: 'emp-123',
 *   exitId: 'exit-456',
 *   interviewDate: new Date(),
 *   conductedBy: 'hr-789',
 *   reasonForLeaving: 'Better career opportunity',
 *   feedbackOnManagement: 'Good support, clear communication',
 *   wouldRecommendCompany: true,
 *   wouldRehire: true
 * });
 * ```
 */
export async function conductExitInterview(
  data: ExitInterviewData,
  transaction?: Transaction,
): Promise<ExitInterview> {
  const exit = await EmployeeExit.findByPk(data.exitId, { transaction });
  if (!exit) {
    throw new NotFoundException(`Exit ${data.exitId} not found`);
  }

  // Create exit interview record
  const interview = await ExitInterview.create(
    {
      ...data,
    },
    { transaction },
  );

  // Update exit record
  await exit.update(
    { exitInterviewCompleted: true },
    { transaction },
  );

  return interview;
}

/**
 * Completes exit clearance
 *
 * @param exitId - Exit identifier
 * @param equipmentReturned - Whether equipment was returned
 * @param finalSettlement - Final settlement amount
 * @param transaction - Optional database transaction
 * @returns Updated exit record
 *
 * @example
 * ```typescript
 * const completed = await completeExitClearance(
 *   'exit-456',
 *   true,
 *   5000
 * );
 * ```
 */
export async function completeExitClearance(
  exitId: string,
  equipmentReturned: boolean,
  finalSettlement?: number,
  transaction?: Transaction,
): Promise<EmployeeExit> {
  const exit = await EmployeeExit.findByPk(exitId, { transaction });
  if (!exit) {
    throw new NotFoundException(`Exit ${exitId} not found`);
  }

  await exit.update(
    {
      equipmentReturnStatus: equipmentReturned ? 'complete' : 'partial',
      finalSettlementAmount: finalSettlement,
      exitClearanceCompleted: true,
    },
    { transaction },
  );

  return exit;
}

/**
 * Finalizes employee exit
 *
 * @param exitId - Exit identifier
 * @param transaction - Optional database transaction
 * @returns Updated employee and exit records
 *
 * @example
 * ```typescript
 * const result = await finalizeEmployeeExit('exit-456');
 * ```
 */
export async function finalizeEmployeeExit(
  exitId: string,
  transaction?: Transaction,
): Promise<{ employee: Employee; exit: EmployeeExit }> {
  const exit = await EmployeeExit.findByPk(exitId, {
    include: [{ model: Employee }],
    transaction,
  });

  if (!exit) {
    throw new NotFoundException(`Exit ${exitId} not found`);
  }

  if (!exit.exitClearanceCompleted) {
    throw new BadRequestException('Exit clearance must be completed before finalizing');
  }

  const employee = exit.employee!;

  // Update employee lifecycle state
  await employee.update(
    {
      lifecycleState:
        exit.exitType === ExitType.RETIREMENT
          ? EmployeeLifecycleState.RETIRED
          : EmployeeLifecycleState.TERMINATED,
      isActive: false,
      terminationDate: exit.lastWorkingDate,
    },
    { transaction },
  );

  // Create lifecycle event
  await EmployeeLifecycleEvent.create(
    {
      employeeId: employee.id,
      eventType: 'exit_finalized',
      eventDate: exit.lastWorkingDate,
      fromState: EmployeeLifecycleState.NOTICE_PERIOD,
      toState: employee.lifecycleState,
      triggeredBy: 'system',
      metadata: { exitType: exit.exitType },
    },
    { transaction },
  );

  return { employee, exit };
}

/**
 * Gets employees in notice period
 *
 * @param limit - Maximum number of records
 * @returns Employees in notice period
 *
 * @example
 * ```typescript
 * const inNotice = await getEmployeesInNoticePeriod(50);
 * ```
 */
export async function getEmployeesInNoticePeriod(limit: number = 100): Promise<Employee[]> {
  return Employee.findAll({
    where: { lifecycleState: EmployeeLifecycleState.NOTICE_PERIOD },
    include: [{ model: EmployeeExit }],
    order: [['lastWorkingDate', 'ASC']],
    limit,
  });
}

/**
 * Gets exit records by type
 *
 * @param exitType - Exit type
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Exit records
 *
 * @example
 * ```typescript
 * const resignations = await getExitsByType(
 *   ExitType.VOLUNTARY_RESIGNATION,
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export async function getExitsByType(
  exitType: ExitType,
  startDate: Date,
  endDate: Date,
): Promise<EmployeeExit[]> {
  return EmployeeExit.findAll({
    where: {
      exitType,
      lastWorkingDate: { [Op.between]: [startDate, endDate] },
    },
    include: [{ model: Employee }],
    order: [['lastWorkingDate', 'DESC']],
  });
}

// ============================================================================
// RETIREMENT PROCESSING (Functions 41-44)
// ============================================================================

/**
 * Processes employee retirement
 *
 * @param data - Retirement data
 * @param transaction - Optional database transaction
 * @returns Created retirement exit record
 *
 * @example
 * ```typescript
 * const retirement = await processRetirement({
 *   employeeId: 'emp-123',
 *   retirementDate: new Date('2024-12-31'),
 *   noticeDate: new Date('2024-06-01'),
 *   retirementType: 'normal',
 *   pensionEligible: true,
 *   knowledgeTransferPlan: 'Train successor over 6 months',
 *   emeritusStatus: true
 * });
 * ```
 */
export async function processRetirement(
  data: RetirementData,
  transaction?: Transaction,
): Promise<EmployeeExit> {
  const employee = await Employee.findByPk(data.employeeId, { transaction });
  if (!employee) {
    throw new NotFoundException(`Employee ${data.employeeId} not found`);
  }

  // Create exit record for retirement
  const exit = await EmployeeExit.create(
    {
      employeeId: data.employeeId,
      exitType: ExitType.RETIREMENT,
      lastWorkingDate: data.retirementDate,
      noticeDate: data.noticeDate,
      noticePeriodDays: Math.floor(
        (data.retirementDate.getTime() - data.noticeDate.getTime()) / (1000 * 60 * 60 * 24),
      ),
      exitReason: `Retirement - ${data.retirementType}`,
      initiatedBy: data.employeeId,
      rehireEligibility: RehireEligibility.NOT_ELIGIBLE,
      notes: `Pension Eligible: ${data.pensionEligible}\n${data.knowledgeTransferPlan || ''}`,
    },
    { transaction },
  );

  // Update employee lifecycle state
  await employee.update(
    {
      lifecycleState: EmployeeLifecycleState.NOTICE_PERIOD,
      lastWorkingDate: data.retirementDate,
    },
    { transaction },
  );

  return exit;
}

/**
 * Gets employees eligible for retirement
 *
 * @param minAge - Minimum age for retirement
 * @param minYearsOfService - Minimum years of service
 * @returns Eligible employees
 *
 * @example
 * ```typescript
 * const eligible = await getRetirementEligibleEmployees(65, 10);
 * ```
 */
export async function getRetirementEligibleEmployees(
  minAge: number = 65,
  minYearsOfService: number = 10,
): Promise<Employee[]> {
  const cutoffBirthDate = new Date();
  cutoffBirthDate.setFullYear(cutoffBirthDate.getFullYear() - minAge);

  const cutoffHireDate = new Date();
  cutoffHireDate.setFullYear(cutoffHireDate.getFullYear() - minYearsOfService);

  return Employee.findAll({
    where: {
      lifecycleState: EmployeeLifecycleState.ACTIVE,
      dateOfBirth: { [Op.lte]: cutoffBirthDate },
      hireDate: { [Op.lte]: cutoffHireDate },
      isActive: true,
    },
    order: [['dateOfBirth', 'ASC']],
  });
}

/**
 * Calculates retirement benefits
 *
 * @param employeeId - Employee identifier
 * @param retirementDate - Planned retirement date
 * @returns Retirement benefit calculation
 *
 * @example
 * ```typescript
 * const benefits = await calculateRetirementBenefits(
 *   'emp-123',
 *   new Date('2024-12-31')
 * );
 * ```
 */
export async function calculateRetirementBenefits(
  employeeId: string,
  retirementDate: Date,
): Promise<{
  yearsOfService: number;
  pensionEligible: boolean;
  estimatedPension: number;
  healthBenefitsContinuation: boolean;
}> {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) {
    throw new NotFoundException(`Employee ${employeeId} not found`);
  }

  const yearsOfService =
    (retirementDate.getTime() - employee.hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

  const pensionEligible = yearsOfService >= 10;

  // Simplified pension calculation - would be more complex in reality
  const estimatedPension = pensionEligible
    ? (employee.compensation || 0) * 0.02 * yearsOfService
    : 0;

  const healthBenefitsContinuation = yearsOfService >= 20;

  return {
    yearsOfService: Math.floor(yearsOfService),
    pensionEligible,
    estimatedPension,
    healthBenefitsContinuation,
  };
}

/**
 * Gets upcoming retirements
 *
 * @param monthsAhead - Number of months to look ahead
 * @returns Upcoming retirement exit records
 *
 * @example
 * ```typescript
 * const upcoming = await getUpcomingRetirements(6);
 * ```
 */
export async function getUpcomingRetirements(
  monthsAhead: number = 6,
): Promise<EmployeeExit[]> {
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + monthsAhead);

  return EmployeeExit.findAll({
    where: {
      exitType: ExitType.RETIREMENT,
      lastWorkingDate: {
        [Op.between]: [new Date(), futureDate],
      },
    },
    include: [{ model: Employee }],
    order: [['lastWorkingDate', 'ASC']],
  });
}

// ============================================================================
// REHIRE & BOOMERANG EMPLOYEES (Functions 45-47)
// ============================================================================

/**
 * Checks rehire eligibility for former employee
 *
 * @param formerEmployeeNumber - Former employee number
 * @returns Rehire eligibility check result
 *
 * @example
 * ```typescript
 * const eligibility = await checkRehireEligibility('EMP-2020-001234');
 * if (eligibility.rehireRecommendation) {
 *   // Proceed with rehire process
 * }
 * ```
 */
export async function checkRehireEligibility(
  formerEmployeeNumber: string,
): Promise<RehireEligibilityCheck> {
  // Find former employee
  const formerEmployee = await Employee.findOne({
    where: { employeeNumber: formerEmployeeNumber },
    include: [{ model: EmployeeExit }],
  });

  if (!formerEmployee) {
    throw new NotFoundException(`Former employee ${formerEmployeeNumber} not found`);
  }

  const exit = formerEmployee.exitRecords?.[0];
  if (!exit) {
    throw new NotFoundException(`Exit record not found for ${formerEmployeeNumber}`);
  }

  const reasonsForIneligibility: string[] = [];
  const conditionalRequirements: string[] = [];

  // Check exit type
  if (
    exit.exitType === ExitType.INVOLUNTARY_TERMINATION ||
    exit.exitType === ExitType.DEATH
  ) {
    reasonsForIneligibility.push(`Exit type: ${exit.exitType}`);
  }

  // Check rehire eligibility from exit record
  if (exit.rehireEligibility === RehireEligibility.NOT_ELIGIBLE) {
    reasonsForIneligibility.push('Marked as not eligible for rehire');
  }

  if (exit.rehireEligibility === RehireEligibility.CONDITIONAL) {
    conditionalRequirements.push('Manager approval required');
  }

  const eligibilityStatus =
    reasonsForIneligibility.length > 0
      ? RehireEligibility.NOT_ELIGIBLE
      : conditionalRequirements.length > 0
        ? RehireEligibility.CONDITIONAL
        : RehireEligibility.ELIGIBLE;

  const rehireRecommendation =
    eligibilityStatus === RehireEligibility.ELIGIBLE ||
    eligibilityStatus === RehireEligibility.CONDITIONAL;

  return {
    employeeId: formerEmployee.id,
    formerEmployeeNumber,
    previousExitType: exit.exitType,
    previousExitDate: exit.lastWorkingDate,
    eligibilityStatus,
    reasonsForIneligibility:
      reasonsForIneligibility.length > 0 ? reasonsForIneligibility : undefined,
    conditionalRequirements:
      conditionalRequirements.length > 0 ? conditionalRequirements : undefined,
    performanceHistory: 'Good standing', // Would be fetched from performance records
    disciplinaryHistory: 'None', // Would be fetched from disciplinary records
    rehireRecommendation,
  };
}

/**
 * Processes boomerang employee rehire
 *
 * @param formerEmployeeNumber - Former employee number
 * @param registrationData - New employee registration data
 * @param transaction - Optional database transaction
 * @returns New employee record and rehire record
 *
 * @example
 * ```typescript
 * const result = await processBoomerangRehire(
 *   'EMP-2020-001234',
 *   {
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     email: 'john.doe@company.com',
 *     dateOfBirth: new Date('1990-01-15'),
 *     hireDate: new Date('2024-06-01'),
 *     positionId: 'pos-456',
 *     departmentId: 'dept-789',
 *     locationId: 'loc-123',
 *     employmentType: 'full_time',
 *     jobTitle: 'Senior Engineer'
 *   }
 * );
 * ```
 */
export async function processBoomerangRehire(
  formerEmployeeNumber: string,
  registrationData: EmployeeRegistrationData,
  transaction?: Transaction,
): Promise<{ employee: Employee; rehireRecord: RehireRecord }> {
  // Check eligibility
  const eligibility = await checkRehireEligibility(formerEmployeeNumber);

  if (!eligibility.rehireRecommendation) {
    throw new BadRequestException(
      `Employee not eligible for rehire: ${eligibility.reasonsForIneligibility?.join(', ')}`,
    );
  }

  // Register new employee
  const employee = await registerEmployee(registrationData, transaction);

  // Create rehire record
  const rehireRecord = await RehireRecord.create(
    {
      employeeId: employee.id,
      formerEmployeeNumber,
      previousExitType: eligibility.previousExitType,
      previousExitDate: eligibility.previousExitDate,
      eligibilityStatus: eligibility.eligibilityStatus,
      reasonsForIneligibility: eligibility.reasonsForIneligibility,
      conditionalRequirements: eligibility.conditionalRequirements,
      performanceHistory: eligibility.performanceHistory,
      disciplinaryHistory: eligibility.disciplinaryHistory,
      rehireRecommendation: true,
      rehireDate: registrationData.hireDate,
    },
    { transaction },
  );

  // Create lifecycle event
  await EmployeeLifecycleEvent.create(
    {
      employeeId: employee.id,
      eventType: 'boomerang_rehired',
      eventDate: registrationData.hireDate,
      triggeredBy: 'system',
      metadata: {
        formerEmployeeNumber,
        previousExitDate: eligibility.previousExitDate,
      },
    },
    { transaction },
  );

  return { employee, rehireRecord };
}

/**
 * Gets boomerang employee statistics
 *
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Boomerang employee statistics
 *
 * @example
 * ```typescript
 * const stats = await getBoomerangEmployeeStats(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * console.log(`Rehire rate: ${stats.rehireRate}%`);
 * ```
 */
export async function getBoomerangEmployeeStats(
  startDate: Date,
  endDate: Date,
): Promise<{
  totalRehires: number;
  byExitType: Record<string, number>;
  averageTimeToRehire: number;
  rehireRate: number;
}> {
  const rehires = await RehireRecord.findAll({
    where: {
      rehireDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalRehires = rehires.length;

  const byExitType: Record<string, number> = {};
  let totalDaysToRehire = 0;

  rehires.forEach((rehire) => {
    byExitType[rehire.previousExitType] = (byExitType[rehire.previousExitType] || 0) + 1;

    if (rehire.rehireDate) {
      const daysToRehire =
        (rehire.rehireDate.getTime() - rehire.previousExitDate.getTime()) /
        (1000 * 60 * 60 * 24);
      totalDaysToRehire += daysToRehire;
    }
  });

  const averageTimeToRehire =
    totalRehires > 0 ? Math.floor(totalDaysToRehire / totalRehires) : 0;

  // Calculate rehire rate (rehires / total exits in period)
  const totalExits = await EmployeeExit.count({
    where: {
      lastWorkingDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const rehireRate = totalExits > 0 ? (totalRehires / totalExits) * 100 : 0;

  return {
    totalRehires,
    byExitType,
    averageTimeToRehire,
    rehireRate,
  };
}

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

/**
 * NestJS Injectable service for Employee Lifecycle Management
 *
 * @example
 * ```typescript
 * @Controller('employees')
 * export class EmployeesController {
 *   constructor(private readonly lifecycleService: EmployeeLifecycleService) {}
 *
 *   @Post('register')
 *   async registerEmployee(@Body() data: EmployeeRegistrationData) {
 *     return this.lifecycleService.registerEmployee(data);
 *   }
 * }
 * ```
 */
@Injectable()
export class EmployeeLifecycleService {
  async registerEmployee(data: EmployeeRegistrationData) {
    return registerEmployee(data);
  }

  async createOnboardingPlan(data: OnboardingPlanData) {
    return createOnboardingPlan(data);
  }

  async startOnboarding(employeeId: string, actualStartDate: Date) {
    return startOnboarding(employeeId, actualStartDate);
  }

  async createProbationPeriod(data: ProbationPeriodData) {
    return createProbationPeriod(data);
  }

  async createTransferRequest(data: TransferRequestData) {
    return createTransferRequest(data);
  }

  async createLeaveOfAbsence(data: LeaveOfAbsenceData) {
    return createLeaveOfAbsence(data);
  }

  async initiateEmployeeExit(data: EmployeeExitData) {
    return initiateEmployeeExit(data);
  }

  async checkRehireEligibility(formerEmployeeNumber: string) {
    return checkRehireEligibility(formerEmployeeNumber);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  Employee,
  EmployeeLifecycleEvent,
  Onboarding,
  ProbationPeriod,
  InternalTransfer,
  EmployeeRelocation,
  LeaveOfAbsence,
  ReturnToWork,
  EmployeeExit,
  ExitInterview,
  RehireRecord,

  // Employee Registration & Onboarding
  registerEmployee,
  generateEmployeeNumber,
  createOnboardingPlan,
  updateOnboardingChecklistItem,
  startOnboarding,
  completeOnboarding,
  getOnboardingStatus,
  getOnboardingsByStatus,

  // Probation Period Management
  createProbationPeriod,
  extendProbationPeriod,
  completeProbationEvaluation,
  getProbationPeriodsEndingSoon,
  getProbationStatus,

  // Internal Transfers & Promotions
  createTransferRequest,
  approveTransferRequest,
  executeTransfer,
  getPendingTransfers,
  getTransferHistory,
  cancelTransferRequest,

  // Relocation Management
  createRelocationRequest,
  startRelocation,
  completeRelocation,
  getActiveRelocations,

  // Leave of Absence Management
  createLeaveOfAbsence,
  approveLeaveRequest,
  startLeave,
  extendLeave,
  denyLeaveRequest,
  cancelLeaveRequest,
  getActiveLeaves,
  getLeavesEndingSoon,

  // Return to Work Processes
  processReturnToWork,
  updateReturnToWorkPlan,
  getReturnToWorkFollowUps,

  // Resignation & Exit Workflows
  initiateEmployeeExit,
  conductExitInterview,
  completeExitClearance,
  finalizeEmployeeExit,
  getEmployeesInNoticePeriod,
  getExitsByType,

  // Retirement Processing
  processRetirement,
  getRetirementEligibleEmployees,
  calculateRetirementBenefits,
  getUpcomingRetirements,

  // Rehire & Boomerang Employees
  checkRehireEligibility,
  processBoomerangRehire,
  getBoomerangEmployeeStats,

  // Service
  EmployeeLifecycleService,
};
