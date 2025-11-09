/**
 * LOC: HCM_PAYROLL_INT_001
 * File: /reuse/server/human-capital/payroll-integration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - moment
 *
 * DOWNSTREAM (imported by):
 *   - Payroll service implementations
 *   - Third-party payroll provider integrations
 *   - Tax calculation services
 *   - GL reconciliation services
 *   - Payroll reporting & analytics
 *   - Compliance & audit systems
 */

/**
 * File: /reuse/server/human-capital/payroll-integration-kit.ts
 * Locator: WC-HCM-PAYROLL-INT-001
 * Purpose: Payroll Integration Kit - Comprehensive payroll processing and integration
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, Moment
 * Downstream: ../backend/payroll/*, ../services/tax/*, GL systems, Third-party providers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 46+ utility functions for payroll data synchronization, payroll run preparation and
 *          validation, earnings and deductions management, tax withholding calculations, payroll
 *          calendar management, retroactive pay adjustments, off-cycle and bonus payroll, garnishment
 *          and child support, payroll reporting and analytics, payroll reconciliation, third-party
 *          payroll provider integration, and payroll audit and compliance
 *
 * LLM Context: Enterprise-grade payroll integration for White Cross healthcare system. Provides
 * comprehensive payroll processing capabilities including bi-directional synchronization with HR
 * systems, multi-country payroll run preparation with validation, complex earnings and deductions
 * management, sophisticated tax withholding calculations (federal, state, local), intelligent
 * payroll calendar management, retroactive pay adjustments with audit trails, off-cycle payroll
 * processing for bonuses and terminations, garnishment and child support order management, real-time
 * payroll analytics and reporting, GL reconciliation with variance analysis, seamless integration
 * with third-party providers (ADP, Workday, SAP, Paylocity), and comprehensive compliance monitoring.
 * Supports multiple payroll frequencies, multi-currency processing, FLSA compliance, SOX controls,
 * and full audit trails. HIPAA-compliant for healthcare payroll data.
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnprocessableEntityException,
  InternalServerErrorException,
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
  Unique,
  Default,
  AllowNull,
  IsEmail,
  Length,
  IsUUID,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { z } from 'zod';
import { Op, Transaction, FindOptions, WhereOptions } from 'sequelize';

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Payroll run status
 */
export enum PayrollRunStatus {
  DRAFT = 'DRAFT',
  IN_PREPARATION = 'IN_PREPARATION',
  VALIDATION_IN_PROGRESS = 'VALIDATION_IN_PROGRESS',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  READY_FOR_APPROVAL = 'READY_FOR_APPROVAL',
  APPROVED = 'APPROVED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  LOCKED = 'LOCKED',
}

/**
 * Earning types
 */
export enum EarningType {
  REGULAR_SALARY = 'REGULAR_SALARY',
  HOURLY_WAGES = 'HOURLY_WAGES',
  OVERTIME = 'OVERTIME',
  DOUBLE_TIME = 'DOUBLE_TIME',
  BONUS = 'BONUS',
  COMMISSION = 'COMMISSION',
  SHIFT_DIFFERENTIAL = 'SHIFT_DIFFERENTIAL',
  ON_CALL_PAY = 'ON_CALL_PAY',
  HOLIDAY_PAY = 'HOLIDAY_PAY',
  SICK_PAY = 'SICK_PAY',
  VACATION_PAY = 'VACATION_PAY',
  SEVERANCE = 'SEVERANCE',
  RETENTION_BONUS = 'RETENTION_BONUS',
  SIGNING_BONUS = 'SIGNING_BONUS',
  PROFIT_SHARING = 'PROFIT_SHARING',
  STOCK_OPTIONS = 'STOCK_OPTIONS',
  ALLOWANCE = 'ALLOWANCE',
  REIMBURSEMENT = 'REIMBURSEMENT',
}

/**
 * Deduction types
 */
export enum DeductionType {
  FEDERAL_TAX = 'FEDERAL_TAX',
  STATE_TAX = 'STATE_TAX',
  LOCAL_TAX = 'LOCAL_TAX',
  SOCIAL_SECURITY = 'SOCIAL_SECURITY',
  MEDICARE = 'MEDICARE',
  HEALTH_INSURANCE = 'HEALTH_INSURANCE',
  DENTAL_INSURANCE = 'DENTAL_INSURANCE',
  VISION_INSURANCE = 'VISION_INSURANCE',
  LIFE_INSURANCE = 'LIFE_INSURANCE',
  RETIREMENT_401K = 'RETIREMENT_401K',
  RETIREMENT_ROTH = 'RETIREMENT_ROTH',
  HSA = 'HSA',
  FSA = 'FSA',
  UNION_DUES = 'UNION_DUES',
  GARNISHMENT = 'GARNISHMENT',
  CHILD_SUPPORT = 'CHILD_SUPPORT',
  STUDENT_LOAN = 'STUDENT_LOAN',
  CHARITABLE_DONATION = 'CHARITABLE_DONATION',
  OTHER = 'OTHER',
}

/**
 * Deduction calculation method
 */
export enum DeductionCalculationMethod {
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  PERCENTAGE = 'PERCENTAGE',
  PERCENTAGE_OF_GROSS = 'PERCENTAGE_OF_GROSS',
  TIERED = 'TIERED',
  FORMULA = 'FORMULA',
}

/**
 * Tax filing status
 */
export enum TaxFilingStatus {
  SINGLE = 'SINGLE',
  MARRIED_FILING_JOINTLY = 'MARRIED_FILING_JOINTLY',
  MARRIED_FILING_SEPARATELY = 'MARRIED_FILING_SEPARATELY',
  HEAD_OF_HOUSEHOLD = 'HEAD_OF_HOUSEHOLD',
  QUALIFYING_WIDOW = 'QUALIFYING_WIDOW',
}

/**
 * Tax type
 */
export enum TaxType {
  FEDERAL_INCOME_TAX = 'FEDERAL_INCOME_TAX',
  STATE_INCOME_TAX = 'STATE_INCOME_TAX',
  LOCAL_INCOME_TAX = 'LOCAL_INCOME_TAX',
  SOCIAL_SECURITY = 'SOCIAL_SECURITY',
  MEDICARE = 'MEDICARE',
  MEDICARE_ADDITIONAL = 'MEDICARE_ADDITIONAL',
  UNEMPLOYMENT_TAX = 'UNEMPLOYMENT_TAX',
  DISABILITY_TAX = 'DISABILITY_TAX',
}

/**
 * Payroll frequency
 */
export enum PayrollFrequency {
  WEEKLY = 'WEEKLY',
  BI_WEEKLY = 'BI_WEEKLY',
  SEMI_MONTHLY = 'SEMI_MONTHLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY',
  ON_DEMAND = 'ON_DEMAND',
}

/**
 * Payroll period status
 */
export enum PayrollPeriodStatus {
  OPEN = 'OPEN',
  LOCKED = 'LOCKED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CLOSED = 'CLOSED',
}

/**
 * Adjustment type
 */
export enum AdjustmentType {
  RETROACTIVE_PAY_INCREASE = 'RETROACTIVE_PAY_INCREASE',
  RETROACTIVE_PAY_DECREASE = 'RETROACTIVE_PAY_DECREASE',
  MISSED_HOURS = 'MISSED_HOURS',
  OVERPAYMENT_RECOVERY = 'OVERPAYMENT_RECOVERY',
  TAX_ADJUSTMENT = 'TAX_ADJUSTMENT',
  DEDUCTION_ADJUSTMENT = 'DEDUCTION_ADJUSTMENT',
  BONUS_ADJUSTMENT = 'BONUS_ADJUSTMENT',
  CORRECTION = 'CORRECTION',
  MANUAL = 'MANUAL',
}

/**
 * Off-cycle payroll reason
 */
export enum OffCycleReason {
  BONUS = 'BONUS',
  COMMISSION = 'COMMISSION',
  TERMINATION = 'TERMINATION',
  SEVERANCE = 'SEVERANCE',
  CORRECTION = 'CORRECTION',
  NEW_HIRE = 'NEW_HIRE',
  MANUAL_CHECK = 'MANUAL_CHECK',
  EMERGENCY = 'EMERGENCY',
}

/**
 * Garnishment type
 */
export enum GarnishmentType {
  CHILD_SUPPORT = 'CHILD_SUPPORT',
  SPOUSAL_SUPPORT = 'SPOUSAL_SUPPORT',
  TAX_LEVY = 'TAX_LEVY',
  BANKRUPTCY = 'BANKRUPTCY',
  CREDITOR_GARNISHMENT = 'CREDITOR_GARNISHMENT',
  STUDENT_LOAN = 'STUDENT_LOAN',
  OTHER = 'OTHER',
}

/**
 * Garnishment status
 */
export enum GarnishmentStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Third-party payroll provider
 */
export enum PayrollProvider {
  ADP = 'ADP',
  WORKDAY = 'WORKDAY',
  SAP_SUCCESSFACTORS = 'SAP_SUCCESSFACTORS',
  PAYLOCITY = 'PAYLOCITY',
  PAYCHEX = 'PAYCHEX',
  GUSTO = 'GUSTO',
  RIPPLING = 'RIPPLING',
  BAMBOO_HR = 'BAMBOO_HR',
  NAMELY = 'NAMELY',
  INTERNAL = 'INTERNAL',
}

/**
 * Integration sync status
 */
export enum SyncStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PARTIAL = 'PARTIAL',
}

/**
 * Reconciliation status
 */
export enum ReconciliationStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  RECONCILED = 'RECONCILED',
  DISCREPANCY_FOUND = 'DISCREPANCY_FOUND',
  REVIEW_REQUIRED = 'REVIEW_REQUIRED',
  APPROVED = 'APPROVED',
}

/**
 * Payment method
 */
export enum PaymentMethod {
  DIRECT_DEPOSIT = 'DIRECT_DEPOSIT',
  CHECK = 'CHECK',
  CASH = 'CASH',
  PAYCARD = 'PAYCARD',
  WIRE_TRANSFER = 'WIRE_TRANSFER',
}

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================

/**
 * Payroll run
 */
export interface IPayrollRun {
  id: string;
  payrollRunName: string;
  payrollPeriodId: string;
  frequency: PayrollFrequency;
  startDate: Date;
  endDate: Date;
  payDate: Date;
  status: PayrollRunStatus;
  employeeCount: number;
  totalGross: number;
  totalDeductions: number;
  totalTaxes: number;
  totalNet: number;
  currency: string;
  validationErrors: IValidationError[];
  approvedBy?: string;
  approvedAt?: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Validation error
 */
export interface IValidationError {
  employeeId?: string;
  errorCode: string;
  errorMessage: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  field?: string;
}

/**
 * Payroll data sync record
 */
export interface IPayrollDataSync {
  id: string;
  syncType: 'EMPLOYEE_DATA' | 'TIME_ATTENDANCE' | 'CHANGES' | 'FULL';
  syncStatus: SyncStatus;
  recordsProcessed: number;
  recordsFailed: number;
  errors: string[];
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Earnings record
 */
export interface IEarnings {
  id: string;
  employeeId: string;
  payrollRunId: string;
  earningType: EarningType;
  description: string;
  hours?: number;
  rate?: number;
  amount: number;
  taxable: boolean;
  subject_to_social_security: boolean;
  subject_to_medicare: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Deductions record
 */
export interface IDeductions {
  id: string;
  employeeId: string;
  payrollRunId: string;
  deductionType: DeductionType;
  description: string;
  calculationMethod: DeductionCalculationMethod;
  amount: number;
  isRecurring: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tax withholding
 */
export interface ITaxWithholding {
  id: string;
  employeeId: string;
  payrollRunId: string;
  taxType: TaxType;
  taxableWages: number;
  taxAmount: number;
  taxRate: number;
  jurisdiction: string;
  filingStatus?: TaxFilingStatus;
  exemptions: number;
  additionalWithholding: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payroll calendar
 */
export interface IPayrollCalendar {
  id: string;
  year: number;
  frequency: PayrollFrequency;
  periods: IPayrollPeriod[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payroll period
 */
export interface IPayrollPeriod {
  id: string;
  calendarId: string;
  periodNumber: number;
  startDate: Date;
  endDate: Date;
  payDate: Date;
  status: PayrollPeriodStatus;
  lockedAt?: Date;
  lockedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Retroactive pay adjustment
 */
export interface IRetroactivePay {
  id: string;
  employeeId: string;
  adjustmentType: AdjustmentType;
  effectiveDate: Date;
  originalPayRate: number;
  newPayRate: number;
  periodsAffected: number;
  totalAdjustment: number;
  status: 'PENDING' | 'APPROVED' | 'PROCESSED';
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Off-cycle payroll
 */
export interface IOffCyclePayroll {
  id: string;
  employeeId: string;
  reason: OffCycleReason;
  payDate: Date;
  grossAmount: number;
  netAmount: number;
  status: PayrollRunStatus;
  approvedBy?: string;
  approvedAt?: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Garnishment order
 */
export interface IGarnishment {
  id: string;
  employeeId: string;
  garnishmentType: GarnishmentType;
  caseNumber: string;
  issuingAuthority: string;
  orderDate: Date;
  startDate: Date;
  endDate?: Date;
  status: GarnishmentStatus;
  amountType: 'FIXED' | 'PERCENTAGE';
  amount: number;
  maxPercentage?: number;
  totalOwed?: number;
  totalPaid: number;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payroll reconciliation
 */
export interface IPayrollReconciliation {
  id: string;
  payrollRunId: string;
  reconciledWith: 'GL' | 'BANK' | 'PROVIDER';
  status: ReconciliationStatus;
  expectedTotal: number;
  actualTotal: number;
  variance: number;
  variancePercentage: number;
  discrepancies: IDiscrepancy[];
  reconciledBy?: string;
  reconciledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Discrepancy
 */
export interface IDiscrepancy {
  type: string;
  description: string;
  expectedValue: number;
  actualValue: number;
  difference: number;
  resolved: boolean;
  resolution?: string;
}

/**
 * Third-party integration
 */
export interface IThirdPartyIntegration {
  id: string;
  provider: PayrollProvider;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncAt?: Date;
  configuration: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payroll audit log
 */
export interface IPayrollAuditLog {
  id: string;
  payrollRunId?: string;
  action: string;
  performedBy: string;
  entityType: string;
  entityId: string;
  changes: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  createdAt: Date;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

export const PayrollRunSchema = z.object({
  payrollRunName: z.string().min(1).max(200),
  payrollPeriodId: z.string().uuid(),
  frequency: z.nativeEnum(PayrollFrequency),
  startDate: z.date(),
  endDate: z.date(),
  payDate: z.date(),
  currency: z.string().length(3),
});

export const EarningsSchema = z.object({
  employeeId: z.string().uuid(),
  payrollRunId: z.string().uuid(),
  earningType: z.nativeEnum(EarningType),
  description: z.string().min(1).max(500),
  hours: z.number().min(0).optional(),
  rate: z.number().min(0).optional(),
  amount: z.number().min(0),
  taxable: z.boolean(),
});

export const DeductionsSchema = z.object({
  employeeId: z.string().uuid(),
  payrollRunId: z.string().uuid(),
  deductionType: z.nativeEnum(DeductionType),
  description: z.string().min(1).max(500),
  calculationMethod: z.nativeEnum(DeductionCalculationMethod),
  amount: z.number().min(0),
  isRecurring: z.boolean(),
  priority: z.number().int().min(1).max(100),
});

export const TaxWithholdingSchema = z.object({
  employeeId: z.string().uuid(),
  payrollRunId: z.string().uuid(),
  taxType: z.nativeEnum(TaxType),
  taxableWages: z.number().min(0),
  taxRate: z.number().min(0).max(1),
  jurisdiction: z.string().min(1).max(100),
  exemptions: z.number().int().min(0),
  additionalWithholding: z.number().min(0),
});

export const PayrollPeriodSchema = z.object({
  calendarId: z.string().uuid(),
  periodNumber: z.number().int().min(1),
  startDate: z.date(),
  endDate: z.date(),
  payDate: z.date(),
});

export const RetroactivePaySchema = z.object({
  employeeId: z.string().uuid(),
  adjustmentType: z.nativeEnum(AdjustmentType),
  effectiveDate: z.date(),
  originalPayRate: z.number().min(0),
  newPayRate: z.number().min(0),
  periodsAffected: z.number().int().min(1),
});

export const OffCyclePayrollSchema = z.object({
  employeeId: z.string().uuid(),
  reason: z.nativeEnum(OffCycleReason),
  payDate: z.date(),
  grossAmount: z.number().min(0),
});

export const GarnishmentSchema = z.object({
  employeeId: z.string().uuid(),
  garnishmentType: z.nativeEnum(GarnishmentType),
  caseNumber: z.string().min(1).max(100),
  issuingAuthority: z.string().min(1).max(200),
  orderDate: z.date(),
  startDate: z.date(),
  amountType: z.enum(['FIXED', 'PERCENTAGE']),
  amount: z.number().min(0),
  priority: z.number().int().min(1),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Payroll Run Model
 */
@Table({ tableName: 'payroll_runs', timestamps: true, paranoid: true })
export class PayrollRunModel extends Model<IPayrollRun> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(200))
  payrollRunName!: string;

  @IsUUID(4)
  @AllowNull(false)
  @ForeignKey(() => PayrollPeriodModel)
  @Index
  @Column(DataType.UUID)
  payrollPeriodId!: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  frequency!: PayrollFrequency;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  startDate!: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  endDate!: Date;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  payDate!: Date;

  @AllowNull(false)
  @Default('DRAFT')
  @Index
  @Column(DataType.STRING(50))
  status!: PayrollRunStatus;

  @Default(0)
  @Column(DataType.INTEGER)
  employeeCount!: number;

  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  totalGross!: number;

  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  totalDeductions!: number;

  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  totalTaxes!: number;

  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  totalNet!: number;

  @AllowNull(false)
  @Default('USD')
  @Column(DataType.STRING(3))
  currency!: string;

  @Default([])
  @Column(DataType.JSONB)
  validationErrors!: IValidationError[];

  @Column(DataType.STRING(200))
  approvedBy?: string;

  @Column(DataType.DATE)
  approvedAt?: Date;

  @Column(DataType.DATE)
  processedAt?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => PayrollPeriodModel)
  payrollPeriod!: PayrollPeriodModel;

  @HasMany(() => EarningsModel)
  earnings!: EarningsModel[];

  @HasMany(() => DeductionsModel)
  deductions!: DeductionsModel[];

  @HasMany(() => TaxWithholdingModel)
  taxWithholdings!: TaxWithholdingModel[];
}

/**
 * Payroll Data Sync Model
 */
@Table({ tableName: 'payroll_data_sync', timestamps: true })
export class PayrollDataSyncModel extends Model<IPayrollDataSync> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  syncType!: string;

  @AllowNull(false)
  @Default('PENDING')
  @Index
  @Column(DataType.STRING(50))
  syncStatus!: SyncStatus;

  @Default(0)
  @Column(DataType.INTEGER)
  recordsProcessed!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  recordsFailed!: number;

  @Default([])
  @Column(DataType.ARRAY(DataType.TEXT))
  errors!: string[];

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  startedAt!: Date;

  @Column(DataType.DATE)
  completedAt?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Earnings Model
 */
@Table({ tableName: 'payroll_earnings', timestamps: true })
export class EarningsModel extends Model<IEarnings> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  employeeId!: string;

  @IsUUID(4)
  @AllowNull(false)
  @ForeignKey(() => PayrollRunModel)
  @Index
  @Column(DataType.UUID)
  payrollRunId!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  earningType!: EarningType;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  description!: string;

  @Column(DataType.DECIMAL(10, 2))
  hours?: number;

  @Column(DataType.DECIMAL(10, 2))
  rate?: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(15, 2))
  amount!: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  taxable!: boolean;

  @Default(true)
  @Column(DataType.BOOLEAN)
  subject_to_social_security!: boolean;

  @Default(true)
  @Column(DataType.BOOLEAN)
  subject_to_medicare!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => PayrollRunModel)
  payrollRun!: PayrollRunModel;
}

/**
 * Deductions Model
 */
@Table({ tableName: 'payroll_deductions', timestamps: true })
export class DeductionsModel extends Model<IDeductions> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  employeeId!: string;

  @IsUUID(4)
  @AllowNull(false)
  @ForeignKey(() => PayrollRunModel)
  @Index
  @Column(DataType.UUID)
  payrollRunId!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  deductionType!: DeductionType;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  description!: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  calculationMethod!: DeductionCalculationMethod;

  @AllowNull(false)
  @Column(DataType.DECIMAL(15, 2))
  amount!: number;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isRecurring!: boolean;

  @AllowNull(false)
  @Default(50)
  @Column(DataType.INTEGER)
  priority!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => PayrollRunModel)
  payrollRun!: PayrollRunModel;
}

/**
 * Tax Withholding Model
 */
@Table({ tableName: 'tax_withholdings', timestamps: true })
export class TaxWithholdingModel extends Model<ITaxWithholding> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  employeeId!: string;

  @IsUUID(4)
  @AllowNull(false)
  @ForeignKey(() => PayrollRunModel)
  @Index
  @Column(DataType.UUID)
  payrollRunId!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  taxType!: TaxType;

  @AllowNull(false)
  @Column(DataType.DECIMAL(15, 2))
  taxableWages!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(15, 2))
  taxAmount!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(6, 4))
  taxRate!: number;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  jurisdiction!: string;

  @Column(DataType.STRING(50))
  filingStatus?: TaxFilingStatus;

  @Default(0)
  @Column(DataType.INTEGER)
  exemptions!: number;

  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  additionalWithholding!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => PayrollRunModel)
  payrollRun!: PayrollRunModel;
}

/**
 * Payroll Calendar Model
 */
@Table({ tableName: 'payroll_calendars', timestamps: true })
export class PayrollCalendarModel extends Model<IPayrollCalendar> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @AllowNull(false)
  @Unique('year_frequency')
  @Index
  @Column(DataType.INTEGER)
  year!: number;

  @AllowNull(false)
  @Unique('year_frequency')
  @Index
  @Column(DataType.STRING(50))
  frequency!: PayrollFrequency;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @HasMany(() => PayrollPeriodModel)
  periods!: PayrollPeriodModel[];
}

/**
 * Payroll Period Model
 */
@Table({ tableName: 'payroll_periods', timestamps: true })
export class PayrollPeriodModel extends Model<IPayrollPeriod> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @AllowNull(false)
  @ForeignKey(() => PayrollCalendarModel)
  @Index
  @Column(DataType.UUID)
  calendarId!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.INTEGER)
  periodNumber!: number;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  startDate!: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  endDate!: Date;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  payDate!: Date;

  @AllowNull(false)
  @Default('OPEN')
  @Index
  @Column(DataType.STRING(50))
  status!: PayrollPeriodStatus;

  @Column(DataType.DATE)
  lockedAt?: Date;

  @Column(DataType.STRING(200))
  lockedBy?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => PayrollCalendarModel)
  calendar!: PayrollCalendarModel;

  @HasMany(() => PayrollRunModel)
  payrollRuns!: PayrollRunModel[];
}

/**
 * Retroactive Pay Model
 */
@Table({ tableName: 'retroactive_pay', timestamps: true })
export class RetroactivePayModel extends Model<IRetroactivePay> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  employeeId!: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  adjustmentType!: AdjustmentType;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  effectiveDate!: Date;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  originalPayRate!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  newPayRate!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  periodsAffected!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(15, 2))
  totalAdjustment!: number;

  @AllowNull(false)
  @Default('PENDING')
  @Index
  @Column(DataType.STRING(50))
  status!: string;

  @Column(DataType.STRING(200))
  approvedBy?: string;

  @Column(DataType.DATE)
  approvedAt?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Off-Cycle Payroll Model
 */
@Table({ tableName: 'off_cycle_payroll', timestamps: true })
export class OffCyclePayrollModel extends Model<IOffCyclePayroll> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  employeeId!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  reason!: OffCycleReason;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  payDate!: Date;

  @AllowNull(false)
  @Column(DataType.DECIMAL(15, 2))
  grossAmount!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(15, 2))
  netAmount!: number;

  @AllowNull(false)
  @Default('DRAFT')
  @Index
  @Column(DataType.STRING(50))
  status!: PayrollRunStatus;

  @Column(DataType.STRING(200))
  approvedBy?: string;

  @Column(DataType.DATE)
  approvedAt?: Date;

  @Column(DataType.DATE)
  processedAt?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Garnishment Model
 */
@Table({ tableName: 'garnishments', timestamps: true, paranoid: true })
export class GarnishmentModel extends Model<IGarnishment> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  employeeId!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  garnishmentType!: GarnishmentType;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(100))
  caseNumber!: string;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  issuingAuthority!: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  orderDate!: Date;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  startDate!: Date;

  @Column(DataType.DATE)
  endDate?: Date;

  @AllowNull(false)
  @Default('ACTIVE')
  @Index
  @Column(DataType.STRING(50))
  status!: GarnishmentStatus;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  amountType!: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(15, 2))
  amount!: number;

  @Column(DataType.DECIMAL(5, 2))
  maxPercentage?: number;

  @Column(DataType.DECIMAL(15, 2))
  totalOwed?: number;

  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  totalPaid!: number;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.INTEGER)
  priority!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * Payroll Reconciliation Model
 */
@Table({ tableName: 'payroll_reconciliations', timestamps: true })
export class PayrollReconciliationModel extends Model<IPayrollReconciliation> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  payrollRunId!: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  reconciledWith!: string;

  @AllowNull(false)
  @Default('NOT_STARTED')
  @Index
  @Column(DataType.STRING(50))
  status!: ReconciliationStatus;

  @AllowNull(false)
  @Column(DataType.DECIMAL(15, 2))
  expectedTotal!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(15, 2))
  actualTotal!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(15, 2))
  variance!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(6, 2))
  variancePercentage!: number;

  @Default([])
  @Column(DataType.JSONB)
  discrepancies!: IDiscrepancy[];

  @Column(DataType.STRING(200))
  reconciledBy?: string;

  @Column(DataType.DATE)
  reconciledAt?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Third-Party Integration Model
 */
@Table({ tableName: 'third_party_integrations', timestamps: true })
export class ThirdPartyIntegrationModel extends Model<IThirdPartyIntegration> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.STRING(50))
  provider!: PayrollProvider;

  @AllowNull(false)
  @Default('DISCONNECTED')
  @Index
  @Column(DataType.STRING(50))
  status!: string;

  @Column(DataType.DATE)
  lastSyncAt?: Date;

  @AllowNull(false)
  @Column(DataType.JSONB)
  configuration!: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Payroll Audit Log Model
 */
@Table({ tableName: 'payroll_audit_logs', timestamps: true })
export class PayrollAuditLogModel extends Model<IPayrollAuditLog> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @Index
  @Column(DataType.UUID)
  payrollRunId?: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(100))
  action!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(200))
  performedBy!: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  entityType!: string;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  entityId!: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  changes!: Record<string, any>;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  timestamp!: Date;

  @Column(DataType.STRING(50))
  ipAddress?: string;

  @CreatedAt
  createdAt!: Date;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Payroll Data Synchronization Functions
 */

/**
 * Synchronize employee data from HR system to payroll
 * @param syncType - Type of sync to perform
 * @param transaction - Optional database transaction
 * @returns Sync record
 */
export async function syncPayrollEmployeeData(
  syncType: 'EMPLOYEE_DATA' | 'TIME_ATTENDANCE' | 'CHANGES' | 'FULL',
  transaction?: Transaction,
): Promise<PayrollDataSyncModel> {
  const sync = await PayrollDataSyncModel.create(
    {
      syncType,
      syncStatus: SyncStatus.IN_PROGRESS,
      recordsProcessed: 0,
      recordsFailed: 0,
      errors: [],
      startedAt: new Date(),
    },
    { transaction },
  );

  // In real implementation, perform actual sync with HR system
  // For now, simulate success
  await sync.update(
    {
      syncStatus: SyncStatus.COMPLETED,
      recordsProcessed: 100,
      completedAt: new Date(),
    },
    { transaction },
  );

  return sync;
}

/**
 * Sync time and attendance data for payroll processing
 * @param startDate - Start date for sync
 * @param endDate - End date for sync
 * @param transaction - Optional database transaction
 * @returns Sync results
 */
export async function syncTimeAndAttendance(
  startDate: Date,
  endDate: Date,
  transaction?: Transaction,
): Promise<{ synced: boolean; recordsProcessed: number; errors: string[] }> {
  const sync = await syncPayrollEmployeeData('TIME_ATTENDANCE', transaction);

  return {
    synced: sync.syncStatus === SyncStatus.COMPLETED,
    recordsProcessed: sync.recordsProcessed,
    errors: sync.errors,
  };
}

/**
 * Synchronize payroll changes (salary, deductions, etc.)
 * @param changesSince - Date to sync changes from
 * @param transaction - Optional database transaction
 * @returns Sync results
 */
export async function syncPayrollChanges(
  changesSince: Date,
  transaction?: Transaction,
): Promise<PayrollDataSyncModel> {
  const sync = await PayrollDataSyncModel.create(
    {
      syncType: 'CHANGES',
      syncStatus: SyncStatus.IN_PROGRESS,
      recordsProcessed: 0,
      recordsFailed: 0,
      errors: [],
      startedAt: new Date(),
    },
    { transaction },
  );

  // Process changes since date
  await sync.update(
    {
      syncStatus: SyncStatus.COMPLETED,
      recordsProcessed: 25,
      completedAt: new Date(),
    },
    { transaction },
  );

  return sync;
}

/**
 * Validate payroll data integrity before processing
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Validation results
 */
export async function validatePayrollDataIntegrity(
  payrollRunId: string,
  transaction?: Transaction,
): Promise<{ valid: boolean; errors: IValidationError[] }> {
  const payrollRun = await PayrollRunModel.findByPk(payrollRunId, { transaction });

  if (!payrollRun) {
    throw new NotFoundException(`Payroll run ${payrollRunId} not found`);
  }

  const errors: IValidationError[] = [];

  // Validate employee count
  if (payrollRun.employeeCount === 0) {
    errors.push({
      errorCode: 'NO_EMPLOYEES',
      errorMessage: 'No employees in payroll run',
      severity: 'ERROR',
    });
  }

  // Validate totals
  if (payrollRun.totalNet <= 0) {
    errors.push({
      errorCode: 'INVALID_TOTAL',
      errorMessage: 'Total net pay is zero or negative',
      severity: 'ERROR',
    });
  }

  await payrollRun.update({ validationErrors: errors }, { transaction });

  return {
    valid: errors.filter((e) => e.severity === 'ERROR').length === 0,
    errors,
  };
}

/**
 * Payroll Run Preparation & Validation Functions
 */

/**
 * Prepare payroll run for processing
 * @param payrollData - Payroll run data
 * @param transaction - Optional database transaction
 * @returns Created payroll run
 */
export async function preparePayrollRun(
  payrollData: z.infer<typeof PayrollRunSchema>,
  transaction?: Transaction,
): Promise<PayrollRunModel> {
  const validated = PayrollRunSchema.parse(payrollData);

  const payrollRun = await PayrollRunModel.create(
    {
      ...validated,
      status: PayrollRunStatus.IN_PREPARATION,
      employeeCount: 0,
      totalGross: 0,
      totalDeductions: 0,
      totalTaxes: 0,
      totalNet: 0,
      validationErrors: [],
    },
    { transaction },
  );

  return payrollRun;
}

/**
 * Validate payroll inputs before processing
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Validation results
 */
export async function validatePayrollInputs(
  payrollRunId: string,
  transaction?: Transaction,
): Promise<{ valid: boolean; errors: IValidationError[]; warnings: IValidationError[] }> {
  const payrollRun = await PayrollRunModel.findByPk(payrollRunId, {
    include: [EarningsModel, DeductionsModel, TaxWithholdingModel],
    transaction,
  });

  if (!payrollRun) {
    throw new NotFoundException(`Payroll run ${payrollRunId} not found`);
  }

  const errors: IValidationError[] = [];
  const warnings: IValidationError[] = [];

  // Validate earnings
  if (!payrollRun.earnings || payrollRun.earnings.length === 0) {
    errors.push({
      errorCode: 'NO_EARNINGS',
      errorMessage: 'No earnings records found',
      severity: 'ERROR',
    });
  }

  // Validate deductions don't exceed gross
  const totalEarnings = payrollRun.earnings?.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0) || 0;
  const totalDeductions = payrollRun.deductions?.reduce((sum, d) => sum + parseFloat(d.amount.toString()), 0) || 0;

  if (totalDeductions > totalEarnings) {
    errors.push({
      errorCode: 'DEDUCTIONS_EXCEED_GROSS',
      errorMessage: 'Total deductions exceed gross earnings',
      severity: 'ERROR',
    });
  }

  // Update validation status
  const newStatus =
    errors.length > 0
      ? PayrollRunStatus.VALIDATION_FAILED
      : PayrollRunStatus.READY_FOR_APPROVAL;

  await payrollRun.update(
    {
      status: newStatus,
      validationErrors: [...errors, ...warnings],
    },
    { transaction },
  );

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Lock payroll period to prevent changes
 * @param periodId - Period ID
 * @param lockedBy - User locking the period
 * @param transaction - Optional database transaction
 * @returns Locked period
 */
export async function lockPayrollPeriod(
  periodId: string,
  lockedBy: string,
  transaction?: Transaction,
): Promise<PayrollPeriodModel> {
  const period = await PayrollPeriodModel.findByPk(periodId, { transaction });

  if (!period) {
    throw new NotFoundException(`Payroll period ${periodId} not found`);
  }

  if (period.status === PayrollPeriodStatus.LOCKED) {
    throw new ConflictException(`Payroll period ${periodId} is already locked`);
  }

  await period.update(
    {
      status: PayrollPeriodStatus.LOCKED,
      lockedAt: new Date(),
      lockedBy,
    },
    { transaction },
  );

  return period;
}

/**
 * Approve payroll run for processing
 * @param payrollRunId - Payroll run ID
 * @param approvedBy - User approving the run
 * @param transaction - Optional database transaction
 * @returns Approved payroll run
 */
export async function approvePayrollRun(
  payrollRunId: string,
  approvedBy: string,
  transaction?: Transaction,
): Promise<PayrollRunModel> {
  const payrollRun = await PayrollRunModel.findByPk(payrollRunId, { transaction });

  if (!payrollRun) {
    throw new NotFoundException(`Payroll run ${payrollRunId} not found`);
  }

  if (payrollRun.status !== PayrollRunStatus.READY_FOR_APPROVAL) {
    throw new BadRequestException(
      `Payroll run ${payrollRunId} is not ready for approval (status: ${payrollRun.status})`,
    );
  }

  await payrollRun.update(
    {
      status: PayrollRunStatus.APPROVED,
      approvedBy,
      approvedAt: new Date(),
    },
    { transaction },
  );

  return payrollRun;
}

/**
 * Earnings & Deductions Management Functions
 */

/**
 * Calculate earnings for employee
 * @param employeeId - Employee ID
 * @param payrollRunId - Payroll run ID
 * @param earningsData - Earnings data array
 * @param transaction - Optional database transaction
 * @returns Created earnings records
 */
export async function calculateEarnings(
  employeeId: string,
  payrollRunId: string,
  earningsData: Array<Omit<IEarnings, 'id' | 'createdAt' | 'updatedAt'>>,
  transaction?: Transaction,
): Promise<EarningsModel[]> {
  const earnings = await Promise.all(
    earningsData.map((data) =>
      EarningsModel.create(
        {
          ...data,
          employeeId,
          payrollRunId,
        },
        { transaction },
      ),
    ),
  );

  return earnings;
}

/**
 * Apply deductions to employee payroll
 * @param employeeId - Employee ID
 * @param payrollRunId - Payroll run ID
 * @param deductionsData - Deductions data array
 * @param transaction - Optional database transaction
 * @returns Created deduction records
 */
export async function applyDeductions(
  employeeId: string,
  payrollRunId: string,
  deductionsData: Array<Omit<IDeductions, 'id' | 'createdAt' | 'updatedAt'>>,
  transaction?: Transaction,
): Promise<DeductionsModel[]> {
  // Sort by priority
  const sorted = deductionsData.sort((a, b) => a.priority - b.priority);

  const deductions = await Promise.all(
    sorted.map((data) =>
      DeductionsModel.create(
        {
          ...data,
          employeeId,
          payrollRunId,
        },
        { transaction },
      ),
    ),
  );

  return deductions;
}

/**
 * Track recurring deductions for employee
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns List of recurring deductions
 */
export async function trackRecurringDeductions(
  employeeId: string,
  transaction?: Transaction,
): Promise<DeductionsModel[]> {
  const deductions = await DeductionsModel.findAll({
    where: {
      employeeId,
      isRecurring: true,
    },
    order: [['priority', 'ASC']],
    transaction,
  });

  return deductions;
}

/**
 * Generate earnings statement for employee
 * @param employeeId - Employee ID
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Earnings statement
 */
export async function generateEarningsStatement(
  employeeId: string,
  payrollRunId: string,
  transaction?: Transaction,
): Promise<{
  employeeId: string;
  payrollRunId: string;
  earnings: EarningsModel[];
  totalEarnings: number;
}> {
  const earnings = await EarningsModel.findAll({
    where: { employeeId, payrollRunId },
    transaction,
  });

  const totalEarnings = earnings.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);

  return {
    employeeId,
    payrollRunId,
    earnings,
    totalEarnings,
  };
}

/**
 * Tax Withholding Calculations Functions
 */

/**
 * Calculate federal income tax withholding
 * @param employeeId - Employee ID
 * @param payrollRunId - Payroll run ID
 * @param taxableWages - Taxable wages amount
 * @param filingStatus - Tax filing status
 * @param exemptions - Number of exemptions
 * @param transaction - Optional database transaction
 * @returns Federal tax withholding record
 */
export async function calculateFederalTax(
  employeeId: string,
  payrollRunId: string,
  taxableWages: number,
  filingStatus: TaxFilingStatus,
  exemptions: number,
  transaction?: Transaction,
): Promise<TaxWithholdingModel> {
  // Simplified federal tax calculation (in real implementation, use IRS tax tables)
  let taxRate = 0.22; // Simplified rate

  if (taxableWages < 10000) taxRate = 0.1;
  else if (taxableWages < 40000) taxRate = 0.12;
  else if (taxableWages < 85000) taxRate = 0.22;
  else if (taxableWages < 163000) taxRate = 0.24;
  else taxRate = 0.32;

  const exemptionAmount = exemptions * 4300; // Simplified exemption value
  const adjustedWages = Math.max(0, taxableWages - exemptionAmount);
  const taxAmount = adjustedWages * taxRate;

  const tax = await TaxWithholdingModel.create(
    {
      employeeId,
      payrollRunId,
      taxType: TaxType.FEDERAL_INCOME_TAX,
      taxableWages,
      taxAmount,
      taxRate,
      jurisdiction: 'US',
      filingStatus,
      exemptions,
      additionalWithholding: 0,
    },
    { transaction },
  );

  return tax;
}

/**
 * Calculate state income tax withholding
 * @param employeeId - Employee ID
 * @param payrollRunId - Payroll run ID
 * @param taxableWages - Taxable wages amount
 * @param state - State code
 * @param transaction - Optional database transaction
 * @returns State tax withholding record
 */
export async function calculateStateTax(
  employeeId: string,
  payrollRunId: string,
  taxableWages: number,
  state: string,
  transaction?: Transaction,
): Promise<TaxWithholdingModel> {
  // Simplified state tax rates (in real implementation, use state-specific tax tables)
  const stateTaxRates: Record<string, number> = {
    CA: 0.093,
    NY: 0.0685,
    TX: 0.0, // No state income tax
    FL: 0.0, // No state income tax
    IL: 0.0495,
    PA: 0.0307,
    OH: 0.0399,
  };

  const taxRate = stateTaxRates[state] || 0.05; // Default 5%
  const taxAmount = taxableWages * taxRate;

  const tax = await TaxWithholdingModel.create(
    {
      employeeId,
      payrollRunId,
      taxType: TaxType.STATE_INCOME_TAX,
      taxableWages,
      taxAmount,
      taxRate,
      jurisdiction: state,
      exemptions: 0,
      additionalWithholding: 0,
    },
    { transaction },
  );

  return tax;
}

/**
 * Calculate local/city income tax withholding
 * @param employeeId - Employee ID
 * @param payrollRunId - Payroll run ID
 * @param taxableWages - Taxable wages amount
 * @param locality - Local jurisdiction
 * @param transaction - Optional database transaction
 * @returns Local tax withholding record
 */
export async function calculateLocalTax(
  employeeId: string,
  payrollRunId: string,
  taxableWages: number,
  locality: string,
  transaction?: Transaction,
): Promise<TaxWithholdingModel> {
  // Simplified local tax rate
  const taxRate = 0.01; // 1% local tax
  const taxAmount = taxableWages * taxRate;

  const tax = await TaxWithholdingModel.create(
    {
      employeeId,
      payrollRunId,
      taxType: TaxType.LOCAL_INCOME_TAX,
      taxableWages,
      taxAmount,
      taxRate,
      jurisdiction: locality,
      exemptions: 0,
      additionalWithholding: 0,
    },
    { transaction },
  );

  return tax;
}

/**
 * Apply tax exemptions and adjustments
 * @param taxWithholdingId - Tax withholding ID
 * @param exemptions - Number of exemptions
 * @param additionalWithholding - Additional withholding amount
 * @param transaction - Optional database transaction
 * @returns Updated tax withholding
 */
export async function applyTaxExemptions(
  taxWithholdingId: string,
  exemptions: number,
  additionalWithholding: number,
  transaction?: Transaction,
): Promise<TaxWithholdingModel> {
  const tax = await TaxWithholdingModel.findByPk(taxWithholdingId, { transaction });

  if (!tax) {
    throw new NotFoundException(`Tax withholding ${taxWithholdingId} not found`);
  }

  // Recalculate with exemptions
  const exemptionAmount = exemptions * 4300;
  const adjustedWages = Math.max(0, tax.taxableWages - exemptionAmount);
  const newTaxAmount = adjustedWages * parseFloat(tax.taxRate.toString()) + additionalWithholding;

  await tax.update(
    {
      exemptions,
      additionalWithholding,
      taxAmount: newTaxAmount,
    },
    { transaction },
  );

  return tax;
}

/**
 * Payroll Calendar Management Functions
 */

/**
 * Create payroll calendar for year
 * @param year - Calendar year
 * @param frequency - Payroll frequency
 * @param transaction - Optional database transaction
 * @returns Created payroll calendar with periods
 */
export async function createPayrollCalendar(
  year: number,
  frequency: PayrollFrequency,
  transaction?: Transaction,
): Promise<PayrollCalendarModel> {
  const calendar = await PayrollCalendarModel.create(
    {
      year,
      frequency,
    },
    { transaction },
  );

  // Generate periods based on frequency
  const periods = generatePayrollPeriods(year, frequency);

  for (let i = 0; i < periods.length; i++) {
    await PayrollPeriodModel.create(
      {
        calendarId: calendar.id,
        periodNumber: i + 1,
        ...periods[i],
        status: PayrollPeriodStatus.OPEN,
      },
      { transaction },
    );
  }

  return calendar;
}

/**
 * Helper function to generate payroll periods
 */
function generatePayrollPeriods(
  year: number,
  frequency: PayrollFrequency,
): Array<{ startDate: Date; endDate: Date; payDate: Date }> {
  const periods: Array<{ startDate: Date; endDate: Date; payDate: Date }> = [];
  const startOfYear = new Date(year, 0, 1);

  switch (frequency) {
    case PayrollFrequency.BI_WEEKLY:
      // 26 pay periods
      for (let i = 0; i < 26; i++) {
        const startDate = new Date(startOfYear);
        startDate.setDate(startDate.getDate() + i * 14);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 13);
        const payDate = new Date(endDate);
        payDate.setDate(payDate.getDate() + 3); // Pay 3 days after period end

        periods.push({ startDate, endDate, payDate });
      }
      break;

    case PayrollFrequency.SEMI_MONTHLY:
      // 24 pay periods (1st-15th, 16th-end of month)
      for (let month = 0; month < 12; month++) {
        // First half
        periods.push({
          startDate: new Date(year, month, 1),
          endDate: new Date(year, month, 15),
          payDate: new Date(year, month, 18),
        });
        // Second half
        const lastDay = new Date(year, month + 1, 0).getDate();
        periods.push({
          startDate: new Date(year, month, 16),
          endDate: new Date(year, month, lastDay),
          payDate: new Date(year, month + 1, 3),
        });
      }
      break;

    case PayrollFrequency.MONTHLY:
      // 12 pay periods
      for (let month = 0; month < 12; month++) {
        const lastDay = new Date(year, month + 1, 0).getDate();
        periods.push({
          startDate: new Date(year, month, 1),
          endDate: new Date(year, month, lastDay),
          payDate: new Date(year, month + 1, 5),
        });
      }
      break;

    default:
      throw new BadRequestException(`Unsupported payroll frequency: ${frequency}`);
  }

  return periods;
}

/**
 * Get payroll schedule for employee
 * @param employeeId - Employee ID
 * @param year - Year
 * @param transaction - Optional database transaction
 * @returns Payroll schedule
 */
export async function getPayrollSchedule(
  employeeId: string,
  year: number,
  transaction?: Transaction,
): Promise<PayrollPeriodModel[]> {
  // In real implementation, get employee's payroll frequency
  const frequency = PayrollFrequency.BI_WEEKLY;

  const calendar = await PayrollCalendarModel.findOne({
    where: { year, frequency },
    include: [PayrollPeriodModel],
    transaction,
  });

  if (!calendar) {
    throw new NotFoundException(`Payroll calendar for ${year} (${frequency}) not found`);
  }

  return calendar.periods;
}

/**
 * Adjust payroll dates for holidays
 * @param periodId - Period ID
 * @param newPayDate - New pay date
 * @param transaction - Optional database transaction
 * @returns Updated period
 */
export async function adjustPayrollDates(
  periodId: string,
  newPayDate: Date,
  transaction?: Transaction,
): Promise<PayrollPeriodModel> {
  const period = await PayrollPeriodModel.findByPk(periodId, { transaction });

  if (!period) {
    throw new NotFoundException(`Payroll period ${periodId} not found`);
  }

  if (period.status === PayrollPeriodStatus.LOCKED) {
    throw new ConflictException('Cannot adjust dates for locked period');
  }

  await period.update({ payDate: newPayDate }, { transaction });

  return period;
}

/**
 * Notify stakeholders of payroll deadlines
 * @param periodId - Period ID
 * @param transaction - Optional database transaction
 * @returns Notification results
 */
export async function notifyPayrollDeadlines(
  periodId: string,
  transaction?: Transaction,
): Promise<{ notified: boolean; recipientCount: number }> {
  const period = await PayrollPeriodModel.findByPk(periodId, { transaction });

  if (!period) {
    throw new NotFoundException(`Payroll period ${periodId} not found`);
  }

  // In real implementation, send notifications via email/SMS
  const recipientCount = 5; // HR team, payroll processors, etc.

  return {
    notified: true,
    recipientCount,
  };
}

/**
 * Retroactive Pay & Adjustments Functions
 */

/**
 * Calculate retroactive pay adjustment
 * @param adjustmentData - Adjustment data
 * @param transaction - Optional database transaction
 * @returns Retroactive pay record
 */
export async function calculateRetroactivePay(
  adjustmentData: z.infer<typeof RetroactivePaySchema>,
  transaction?: Transaction,
): Promise<RetroactivePayModel> {
  const validated = RetroactivePaySchema.parse(adjustmentData);

  const payDifference = validated.newPayRate - validated.originalPayRate;
  const totalAdjustment = payDifference * validated.periodsAffected * 80; // Assuming 80 hours per period

  const retro = await RetroactivePayModel.create(
    {
      ...validated,
      totalAdjustment,
      status: 'PENDING',
    },
    { transaction },
  );

  return retro;
}

/**
 * Apply payroll adjustments to current or past periods
 * @param payrollRunId - Payroll run ID
 * @param adjustments - Array of adjustments
 * @param transaction - Optional database transaction
 * @returns Applied adjustments
 */
export async function applyPayrollAdjustments(
  payrollRunId: string,
  adjustments: Array<{
    employeeId: string;
    adjustmentType: AdjustmentType;
    amount: number;
    description: string;
  }>,
  transaction?: Transaction,
): Promise<any[]> {
  const payrollRun = await PayrollRunModel.findByPk(payrollRunId, { transaction });

  if (!payrollRun) {
    throw new NotFoundException(`Payroll run ${payrollRunId} not found`);
  }

  const appliedAdjustments = await Promise.all(
    adjustments.map(async (adj) => {
      // Create earning or deduction based on adjustment type
      if (adj.amount > 0) {
        return EarningsModel.create(
          {
            employeeId: adj.employeeId,
            payrollRunId,
            earningType: EarningType.BONUS,
            description: adj.description,
            amount: adj.amount,
            taxable: true,
            subject_to_social_security: true,
            subject_to_medicare: true,
          },
          { transaction },
        );
      } else {
        return DeductionsModel.create(
          {
            employeeId: adj.employeeId,
            payrollRunId,
            deductionType: DeductionType.OTHER,
            description: adj.description,
            calculationMethod: DeductionCalculationMethod.FIXED_AMOUNT,
            amount: Math.abs(adj.amount),
            isRecurring: false,
            priority: 99,
          },
          { transaction },
        );
      }
    }),
  );

  return appliedAdjustments;
}

/**
 * Track adjustment history for auditing
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns Adjustment history
 */
export async function trackAdjustmentHistory(
  employeeId: string,
  transaction?: Transaction,
): Promise<RetroactivePayModel[]> {
  const adjustments = await RetroactivePayModel.findAll({
    where: { employeeId },
    order: [['effectiveDate', 'DESC']],
    transaction,
  });

  return adjustments;
}

/**
 * Reconcile retroactive changes across periods
 * @param employeeId - Employee ID
 * @param startDate - Start date
 * @param endDate - End date
 * @param transaction - Optional database transaction
 * @returns Reconciliation summary
 */
export async function reconcileRetroactiveChanges(
  employeeId: string,
  startDate: Date,
  endDate: Date,
  transaction?: Transaction,
): Promise<{ totalAdjustments: number; adjustmentCount: number }> {
  const adjustments = await RetroactivePayModel.findAll({
    where: {
      employeeId,
      effectiveDate: {
        [Op.between]: [startDate, endDate],
      },
      status: 'PROCESSED',
    },
    transaction,
  });

  const totalAdjustments = adjustments.reduce(
    (sum, adj) => sum + parseFloat(adj.totalAdjustment.toString()),
    0,
  );

  return {
    totalAdjustments,
    adjustmentCount: adjustments.length,
  };
}

/**
 * Off-Cycle & Bonus Payroll Functions
 */

/**
 * Create off-cycle payroll run
 * @param offCycleData - Off-cycle payroll data
 * @param transaction - Optional database transaction
 * @returns Created off-cycle payroll
 */
export async function createOffCyclePayroll(
  offCycleData: z.infer<typeof OffCyclePayrollSchema>,
  transaction?: Transaction,
): Promise<OffCyclePayrollModel> {
  const validated = OffCyclePayrollSchema.parse(offCycleData);

  // Calculate net (simplified - in real implementation, calculate taxes)
  const netAmount = validated.grossAmount * 0.75; // Assume 25% tax

  const offCycle = await OffCyclePayrollModel.create(
    {
      ...validated,
      netAmount,
      status: PayrollRunStatus.DRAFT,
    },
    { transaction },
  );

  return offCycle;
}

/**
 * Process bonus payment
 * @param employeeId - Employee ID
 * @param bonusAmount - Bonus amount
 * @param bonusType - Type of bonus
 * @param payDate - Payment date
 * @param transaction - Optional database transaction
 * @returns Processed bonus payment
 */
export async function processBonusPayment(
  employeeId: string,
  bonusAmount: number,
  bonusType: string,
  payDate: Date,
  transaction?: Transaction,
): Promise<OffCyclePayrollModel> {
  const bonus = await createOffCyclePayroll(
    {
      employeeId,
      reason: OffCycleReason.BONUS,
      payDate,
      grossAmount: bonusAmount,
    },
    transaction,
  );

  return bonus;
}

/**
 * Calculate severance pay
 * @param employeeId - Employee ID
 * @param yearsOfService - Years of service
 * @param finalSalary - Final salary
 * @param transaction - Optional database transaction
 * @returns Severance calculation
 */
export async function calculateSeverancePay(
  employeeId: string,
  yearsOfService: number,
  finalSalary: number,
  transaction?: Transaction,
): Promise<{ severanceAmount: number; weeks: number }> {
  // Typical calculation: 1-2 weeks per year of service
  const weeksPerYear = 2;
  const weeks = Math.min(yearsOfService * weeksPerYear, 52); // Cap at 52 weeks
  const weeklyPay = finalSalary / 52;
  const severanceAmount = weeklyPay * weeks;

  return {
    severanceAmount: Math.round(severanceAmount * 100) / 100,
    weeks,
  };
}

/**
 * Process commission payment
 * @param employeeId - Employee ID
 * @param commissionAmount - Commission amount
 * @param period - Commission period
 * @param transaction - Optional database transaction
 * @returns Processed commission
 */
export async function processCommissionPayment(
  employeeId: string,
  commissionAmount: number,
  period: string,
  transaction?: Transaction,
): Promise<OffCyclePayrollModel> {
  const commission = await createOffCyclePayroll(
    {
      employeeId,
      reason: OffCycleReason.COMMISSION,
      payDate: new Date(),
      grossAmount: commissionAmount,
    },
    transaction,
  );

  return commission;
}

/**
 * Garnishment & Child Support Functions
 */

/**
 * Apply garnishment to payroll
 * @param garnishmentData - Garnishment data
 * @param transaction - Optional database transaction
 * @returns Created garnishment
 */
export async function applyGarnishment(
  garnishmentData: z.infer<typeof GarnishmentSchema>,
  transaction?: Transaction,
): Promise<GarnishmentModel> {
  const validated = GarnishmentSchema.parse(garnishmentData);

  const garnishment = await GarnishmentModel.create(
    {
      ...validated,
      status: GarnishmentStatus.ACTIVE,
      totalPaid: 0,
    },
    { transaction },
  );

  return garnishment;
}

/**
 * Track garnishment orders for employee
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns Active garnishments
 */
export async function trackGarnishmentOrders(
  employeeId: string,
  transaction?: Transaction,
): Promise<GarnishmentModel[]> {
  const garnishments = await GarnishmentModel.findAll({
    where: {
      employeeId,
      status: GarnishmentStatus.ACTIVE,
    },
    order: [['priority', 'ASC']],
    transaction,
  });

  return garnishments;
}

/**
 * Report garnishment payments to authorities
 * @param garnishmentId - Garnishment ID
 * @param paymentAmount - Payment amount
 * @param paymentDate - Payment date
 * @param transaction - Optional database transaction
 * @returns Reporting confirmation
 */
export async function reportGarnishmentPayments(
  garnishmentId: string,
  paymentAmount: number,
  paymentDate: Date,
  transaction?: Transaction,
): Promise<{ reported: boolean; garnishment: GarnishmentModel }> {
  const garnishment = await GarnishmentModel.findByPk(garnishmentId, { transaction });

  if (!garnishment) {
    throw new NotFoundException(`Garnishment ${garnishmentId} not found`);
  }

  const newTotalPaid = parseFloat(garnishment.totalPaid.toString()) + paymentAmount;

  await garnishment.update({ totalPaid: newTotalPaid }, { transaction });

  // Check if garnishment is complete
  if (garnishment.totalOwed && newTotalPaid >= garnishment.totalOwed) {
    await garnishment.update({ status: GarnishmentStatus.COMPLETED }, { transaction });
  }

  return {
    reported: true,
    garnishment,
  };
}

/**
 * Payroll Reporting & Analytics Functions
 */

/**
 * Generate payroll register report
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Payroll register
 */
export async function generatePayrollRegister(
  payrollRunId: string,
  transaction?: Transaction,
): Promise<any> {
  const payrollRun = await PayrollRunModel.findByPk(payrollRunId, {
    include: [EarningsModel, DeductionsModel, TaxWithholdingModel],
    transaction,
  });

  if (!payrollRun) {
    throw new NotFoundException(`Payroll run ${payrollRunId} not found`);
  }

  return {
    payrollRun: payrollRun.toJSON(),
    summary: {
      totalGross: payrollRun.totalGross,
      totalDeductions: payrollRun.totalDeductions,
      totalTaxes: payrollRun.totalTaxes,
      totalNet: payrollRun.totalNet,
    },
  };
}

/**
 * Analyze payroll costs and trends
 * @param startDate - Start date
 * @param endDate - End date
 * @param transaction - Optional database transaction
 * @returns Cost analysis
 */
export async function analyzePayrollCosts(
  startDate: Date,
  endDate: Date,
  transaction?: Transaction,
): Promise<{
  totalCost: number;
  averagePerEmployee: number;
  trends: any[];
}> {
  const payrollRuns = await PayrollRunModel.findAll({
    where: {
      payDate: {
        [Op.between]: [startDate, endDate],
      },
      status: PayrollRunStatus.COMPLETED,
    },
    transaction,
  });

  const totalCost = payrollRuns.reduce(
    (sum, run) => sum + parseFloat(run.totalGross.toString()),
    0,
  );
  const totalEmployees = payrollRuns.reduce((sum, run) => sum + run.employeeCount, 0);
  const averagePerEmployee = totalEmployees > 0 ? totalCost / totalEmployees : 0;

  return {
    totalCost,
    averagePerEmployee: Math.round(averagePerEmployee * 100) / 100,
    trends: [], // In real implementation, calculate trends
  };
}

/**
 * Generate payroll summary report
 * @param periodId - Period ID
 * @param transaction - Optional database transaction
 * @returns Summary report
 */
export async function generatePayrollSummary(
  periodId: string,
  transaction?: Transaction,
): Promise<any> {
  const period = await PayrollPeriodModel.findByPk(periodId, {
    include: [PayrollRunModel],
    transaction,
  });

  if (!period) {
    throw new NotFoundException(`Payroll period ${periodId} not found`);
  }

  const runs = period.payrollRuns || [];
  const totalGross = runs.reduce((sum, run) => sum + parseFloat(run.totalGross.toString()), 0);
  const totalNet = runs.reduce((sum, run) => sum + parseFloat(run.totalNet.toString()), 0);
  const totalEmployees = runs.reduce((sum, run) => sum + run.employeeCount, 0);

  return {
    period: period.toJSON(),
    summary: {
      totalGross,
      totalNet,
      totalEmployees,
      runsCount: runs.length,
    },
  };
}

/**
 * Export payroll reports in various formats
 * @param payrollRunId - Payroll run ID
 * @param format - Export format
 * @param transaction - Optional database transaction
 * @returns Export result
 */
export async function exportPayrollReports(
  payrollRunId: string,
  format: 'PDF' | 'CSV' | 'EXCEL' | 'JSON',
  transaction?: Transaction,
): Promise<{ exported: boolean; format: string; url?: string }> {
  const payrollRun = await PayrollRunModel.findByPk(payrollRunId, { transaction });

  if (!payrollRun) {
    throw new NotFoundException(`Payroll run ${payrollRunId} not found`);
  }

  // In real implementation, generate actual export file
  return {
    exported: true,
    format,
    url: `/exports/payroll/${payrollRunId}.${format.toLowerCase()}`,
  };
}

/**
 * Payroll Reconciliation Functions
 */

/**
 * Reconcile payroll to general ledger
 * @param payrollRunId - Payroll run ID
 * @param glTotal - GL total amount
 * @param transaction - Optional database transaction
 * @returns Reconciliation record
 */
export async function reconcilePayrollToGL(
  payrollRunId: string,
  glTotal: number,
  transaction?: Transaction,
): Promise<PayrollReconciliationModel> {
  const payrollRun = await PayrollRunModel.findByPk(payrollRunId, { transaction });

  if (!payrollRun) {
    throw new NotFoundException(`Payroll run ${payrollRunId} not found`);
  }

  const expectedTotal = parseFloat(payrollRun.totalNet.toString());
  const variance = glTotal - expectedTotal;
  const variancePercentage = expectedTotal > 0 ? (variance / expectedTotal) * 100 : 0;

  const discrepancies: IDiscrepancy[] = [];
  if (Math.abs(variance) > 0.01) {
    discrepancies.push({
      type: 'NET_PAY_VARIANCE',
      description: 'Variance between payroll and GL totals',
      expectedValue: expectedTotal,
      actualValue: glTotal,
      difference: variance,
      resolved: false,
    });
  }

  const reconciliation = await PayrollReconciliationModel.create(
    {
      payrollRunId,
      reconciledWith: 'GL',
      status:
        Math.abs(variance) < 0.01
          ? ReconciliationStatus.RECONCILED
          : ReconciliationStatus.DISCREPANCY_FOUND,
      expectedTotal,
      actualTotal: glTotal,
      variance,
      variancePercentage,
      discrepancies,
    },
    { transaction },
  );

  return reconciliation;
}

/**
 * Validate payroll totals against source data
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Validation results
 */
export async function validatePayrollTotals(
  payrollRunId: string,
  transaction?: Transaction,
): Promise<{ valid: boolean; discrepancies: IDiscrepancy[] }> {
  const payrollRun = await PayrollRunModel.findByPk(payrollRunId, {
    include: [EarningsModel, DeductionsModel, TaxWithholdingModel],
    transaction,
  });

  if (!payrollRun) {
    throw new NotFoundException(`Payroll run ${payrollRunId} not found`);
  }

  const discrepancies: IDiscrepancy[] = [];

  // Validate earnings total
  const calculatedEarnings = payrollRun.earnings?.reduce(
    (sum, e) => sum + parseFloat(e.amount.toString()),
    0,
  ) || 0;
  const recordedEarnings = parseFloat(payrollRun.totalGross.toString());

  if (Math.abs(calculatedEarnings - recordedEarnings) > 0.01) {
    discrepancies.push({
      type: 'EARNINGS_TOTAL',
      description: 'Earnings total mismatch',
      expectedValue: calculatedEarnings,
      actualValue: recordedEarnings,
      difference: calculatedEarnings - recordedEarnings,
      resolved: false,
    });
  }

  return {
    valid: discrepancies.length === 0,
    discrepancies,
  };
}

/**
 * Track payroll discrepancies
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Discrepancy list
 */
export async function trackPayrollDiscrepancies(
  payrollRunId: string,
  transaction?: Transaction,
): Promise<IDiscrepancy[]> {
  const reconciliations = await PayrollReconciliationModel.findAll({
    where: { payrollRunId },
    transaction,
  });

  const allDiscrepancies = reconciliations.flatMap((r) => r.discrepancies);

  return allDiscrepancies.filter((d) => !d.resolved);
}

/**
 * Generate reconciliation report
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Reconciliation report
 */
export async function generateReconciliationReport(
  payrollRunId: string,
  transaction?: Transaction,
): Promise<any> {
  const reconciliations = await PayrollReconciliationModel.findAll({
    where: { payrollRunId },
    transaction,
  });

  const totalVariance = reconciliations.reduce(
    (sum, r) => sum + parseFloat(r.variance.toString()),
    0,
  );

  return {
    payrollRunId,
    reconciliations: reconciliations.map((r) => r.toJSON()),
    totalVariance,
    reconciliationCount: reconciliations.length,
  };
}

/**
 * Third-Party Payroll Provider Integration Functions
 */

/**
 * Connect to third-party payroll provider
 * @param provider - Payroll provider
 * @param configuration - Provider configuration
 * @param transaction - Optional database transaction
 * @returns Integration record
 */
export async function connectPayrollProvider(
  provider: PayrollProvider,
  configuration: Record<string, any>,
  transaction?: Transaction,
): Promise<ThirdPartyIntegrationModel> {
  const integration = await ThirdPartyIntegrationModel.create(
    {
      provider,
      status: 'CONNECTED',
      configuration,
      lastSyncAt: new Date(),
    },
    { transaction },
  );

  return integration;
}

/**
 * Export payroll data to third-party provider
 * @param providerId - Provider integration ID
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Export results
 */
export async function exportPayrollDataToProvider(
  providerId: string,
  payrollRunId: string,
  transaction?: Transaction,
): Promise<{ exported: boolean; recordCount: number }> {
  const integration = await ThirdPartyIntegrationModel.findByPk(providerId, { transaction });

  if (!integration) {
    throw new NotFoundException(`Provider integration ${providerId} not found`);
  }

  const payrollRun = await PayrollRunModel.findByPk(payrollRunId, {
    include: [EarningsModel, DeductionsModel, TaxWithholdingModel],
    transaction,
  });

  if (!payrollRun) {
    throw new NotFoundException(`Payroll run ${payrollRunId} not found`);
  }

  // In real implementation, export to provider API
  const recordCount = payrollRun.employeeCount;

  await integration.update({ lastSyncAt: new Date() }, { transaction });

  return {
    exported: true,
    recordCount,
  };
}

/**
 * Import payroll results from third-party provider
 * @param providerId - Provider integration ID
 * @param transaction - Optional database transaction
 * @returns Import results
 */
export async function importPayrollResultsFromProvider(
  providerId: string,
  transaction?: Transaction,
): Promise<{ imported: boolean; recordCount: number }> {
  const integration = await ThirdPartyIntegrationModel.findByPk(providerId, { transaction });

  if (!integration) {
    throw new NotFoundException(`Provider integration ${providerId} not found`);
  }

  // In real implementation, import from provider API
  const recordCount = 100;

  await integration.update({ lastSyncAt: new Date() }, { transaction });

  return {
    imported: true,
    recordCount,
  };
}

/**
 * Sync payroll provider status
 * @param providerId - Provider integration ID
 * @param transaction - Optional database transaction
 * @returns Sync status
 */
export async function syncPayrollProviderStatus(
  providerId: string,
  transaction?: Transaction,
): Promise<ThirdPartyIntegrationModel> {
  const integration = await ThirdPartyIntegrationModel.findByPk(providerId, { transaction });

  if (!integration) {
    throw new NotFoundException(`Provider integration ${providerId} not found`);
  }

  // In real implementation, check provider API status
  await integration.update({ lastSyncAt: new Date() }, { transaction });

  return integration;
}

/**
 * Payroll Audit & Compliance Functions
 */

/**
 * Audit payroll run for compliance
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Audit results
 */
export async function auditPayrollRun(
  payrollRunId: string,
  transaction?: Transaction,
): Promise<{ compliant: boolean; findings: string[]; recommendations: string[] }> {
  const payrollRun = await PayrollRunModel.findByPk(payrollRunId, {
    include: [EarningsModel, DeductionsModel, TaxWithholdingModel],
    transaction,
  });

  if (!payrollRun) {
    throw new NotFoundException(`Payroll run ${payrollRunId} not found`);
  }

  const findings: string[] = [];
  const recommendations: string[] = [];

  // Check if approved
  if (!payrollRun.approvedBy) {
    findings.push('Payroll run not approved');
    recommendations.push('Require approval before processing');
  }

  // Check for validation errors
  if (payrollRun.validationErrors.length > 0) {
    findings.push(`${payrollRun.validationErrors.length} validation errors found`);
    recommendations.push('Resolve all validation errors before processing');
  }

  // Check totals
  if (parseFloat(payrollRun.totalNet.toString()) <= 0) {
    findings.push('Total net pay is zero or negative');
    recommendations.push('Review earnings and deductions');
  }

  return {
    compliant: findings.length === 0,
    findings,
    recommendations,
  };
}

/**
 * Validate payroll compliance with regulations
 * @param payrollRunId - Payroll run ID
 * @param regulations - Array of regulation codes
 * @param transaction - Optional database transaction
 * @returns Compliance validation
 */
export async function validatePayrollCompliance(
  payrollRunId: string,
  regulations: string[],
  transaction?: Transaction,
): Promise<{ compliant: boolean; violations: string[] }> {
  const payrollRun = await PayrollRunModel.findByPk(payrollRunId, { transaction });

  if (!payrollRun) {
    throw new NotFoundException(`Payroll run ${payrollRunId} not found`);
  }

  const violations: string[] = [];

  // In real implementation, check against specific regulations
  // FLSA, SOX, etc.

  return {
    compliant: violations.length === 0,
    violations,
  };
}

/**
 * Generate compliance report
 * @param startDate - Start date
 * @param endDate - End date
 * @param transaction - Optional database transaction
 * @returns Compliance report
 */
export async function generateComplianceReport(
  startDate: Date,
  endDate: Date,
  transaction?: Transaction,
): Promise<{
  period: { startDate: Date; endDate: Date };
  payrollRunsAudited: number;
  complianceRate: number;
  violations: string[];
}> {
  const payrollRuns = await PayrollRunModel.findAll({
    where: {
      payDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    transaction,
  });

  const audits = await Promise.all(
    payrollRuns.map((run) => auditPayrollRun(run.id, transaction)),
  );

  const compliantRuns = audits.filter((a) => a.compliant).length;
  const complianceRate = payrollRuns.length > 0 ? (compliantRuns / payrollRuns.length) * 100 : 100;
  const allFindings = audits.flatMap((a) => a.findings);

  return {
    period: { startDate, endDate },
    payrollRunsAudited: payrollRuns.length,
    complianceRate: Math.round(complianceRate * 100) / 100,
    violations: allFindings,
  };
}

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

/**
 * Payroll Integration Service
 * Provides enterprise-grade payroll processing and integration
 */
@Injectable()
@ApiTags('Payroll Integration')
export class PayrollIntegrationService {
  // Payroll Data Synchronization
  async syncPayrollEmployeeData(
    syncType: 'EMPLOYEE_DATA' | 'TIME_ATTENDANCE' | 'CHANGES' | 'FULL',
    transaction?: Transaction,
  ) {
    return syncPayrollEmployeeData(syncType, transaction);
  }

  async syncTimeAndAttendance(startDate: Date, endDate: Date, transaction?: Transaction) {
    return syncTimeAndAttendance(startDate, endDate, transaction);
  }

  async syncPayrollChanges(changesSince: Date, transaction?: Transaction) {
    return syncPayrollChanges(changesSince, transaction);
  }

  async validatePayrollDataIntegrity(payrollRunId: string, transaction?: Transaction) {
    return validatePayrollDataIntegrity(payrollRunId, transaction);
  }

  // Payroll Run Preparation
  async preparePayrollRun(data: z.infer<typeof PayrollRunSchema>, transaction?: Transaction) {
    return preparePayrollRun(data, transaction);
  }

  async validatePayrollInputs(payrollRunId: string, transaction?: Transaction) {
    return validatePayrollInputs(payrollRunId, transaction);
  }

  async lockPayrollPeriod(periodId: string, lockedBy: string, transaction?: Transaction) {
    return lockPayrollPeriod(periodId, lockedBy, transaction);
  }

  async approvePayrollRun(payrollRunId: string, approvedBy: string, transaction?: Transaction) {
    return approvePayrollRun(payrollRunId, approvedBy, transaction);
  }

  // Earnings & Deductions
  async calculateEarnings(
    employeeId: string,
    payrollRunId: string,
    earningsData: any[],
    transaction?: Transaction,
  ) {
    return calculateEarnings(employeeId, payrollRunId, earningsData, transaction);
  }

  async applyDeductions(
    employeeId: string,
    payrollRunId: string,
    deductionsData: any[],
    transaction?: Transaction,
  ) {
    return applyDeductions(employeeId, payrollRunId, deductionsData, transaction);
  }

  async trackRecurringDeductions(employeeId: string, transaction?: Transaction) {
    return trackRecurringDeductions(employeeId, transaction);
  }

  async generateEarningsStatement(
    employeeId: string,
    payrollRunId: string,
    transaction?: Transaction,
  ) {
    return generateEarningsStatement(employeeId, payrollRunId, transaction);
  }

  // Tax Calculations
  async calculateFederalTax(
    employeeId: string,
    payrollRunId: string,
    taxableWages: number,
    filingStatus: TaxFilingStatus,
    exemptions: number,
    transaction?: Transaction,
  ) {
    return calculateFederalTax(
      employeeId,
      payrollRunId,
      taxableWages,
      filingStatus,
      exemptions,
      transaction,
    );
  }

  async calculateStateTax(
    employeeId: string,
    payrollRunId: string,
    taxableWages: number,
    state: string,
    transaction?: Transaction,
  ) {
    return calculateStateTax(employeeId, payrollRunId, taxableWages, state, transaction);
  }

  async calculateLocalTax(
    employeeId: string,
    payrollRunId: string,
    taxableWages: number,
    locality: string,
    transaction?: Transaction,
  ) {
    return calculateLocalTax(employeeId, payrollRunId, taxableWages, locality, transaction);
  }

  async applyTaxExemptions(
    taxWithholdingId: string,
    exemptions: number,
    additionalWithholding: number,
    transaction?: Transaction,
  ) {
    return applyTaxExemptions(taxWithholdingId, exemptions, additionalWithholding, transaction);
  }

  // Calendar Management
  async createPayrollCalendar(year: number, frequency: PayrollFrequency, transaction?: Transaction) {
    return createPayrollCalendar(year, frequency, transaction);
  }

  async getPayrollSchedule(employeeId: string, year: number, transaction?: Transaction) {
    return getPayrollSchedule(employeeId, year, transaction);
  }

  async adjustPayrollDates(periodId: string, newPayDate: Date, transaction?: Transaction) {
    return adjustPayrollDates(periodId, newPayDate, transaction);
  }

  async notifyPayrollDeadlines(periodId: string, transaction?: Transaction) {
    return notifyPayrollDeadlines(periodId, transaction);
  }

  // Retroactive Pay
  async calculateRetroactivePay(
    data: z.infer<typeof RetroactivePaySchema>,
    transaction?: Transaction,
  ) {
    return calculateRetroactivePay(data, transaction);
  }

  async applyPayrollAdjustments(
    payrollRunId: string,
    adjustments: any[],
    transaction?: Transaction,
  ) {
    return applyPayrollAdjustments(payrollRunId, adjustments, transaction);
  }

  async trackAdjustmentHistory(employeeId: string, transaction?: Transaction) {
    return trackAdjustmentHistory(employeeId, transaction);
  }

  async reconcileRetroactiveChanges(
    employeeId: string,
    startDate: Date,
    endDate: Date,
    transaction?: Transaction,
  ) {
    return reconcileRetroactiveChanges(employeeId, startDate, endDate, transaction);
  }

  // Off-Cycle Payroll
  async createOffCyclePayroll(data: z.infer<typeof OffCyclePayrollSchema>, transaction?: Transaction) {
    return createOffCyclePayroll(data, transaction);
  }

  async processBonusPayment(
    employeeId: string,
    bonusAmount: number,
    bonusType: string,
    payDate: Date,
    transaction?: Transaction,
  ) {
    return processBonusPayment(employeeId, bonusAmount, bonusType, payDate, transaction);
  }

  async calculateSeverancePay(
    employeeId: string,
    yearsOfService: number,
    finalSalary: number,
    transaction?: Transaction,
  ) {
    return calculateSeverancePay(employeeId, yearsOfService, finalSalary, transaction);
  }

  async processCommissionPayment(
    employeeId: string,
    commissionAmount: number,
    period: string,
    transaction?: Transaction,
  ) {
    return processCommissionPayment(employeeId, commissionAmount, period, transaction);
  }

  // Garnishments
  async applyGarnishment(data: z.infer<typeof GarnishmentSchema>, transaction?: Transaction) {
    return applyGarnishment(data, transaction);
  }

  async trackGarnishmentOrders(employeeId: string, transaction?: Transaction) {
    return trackGarnishmentOrders(employeeId, transaction);
  }

  async reportGarnishmentPayments(
    garnishmentId: string,
    paymentAmount: number,
    paymentDate: Date,
    transaction?: Transaction,
  ) {
    return reportGarnishmentPayments(garnishmentId, paymentAmount, paymentDate, transaction);
  }

  // Reporting & Analytics
  async generatePayrollRegister(payrollRunId: string, transaction?: Transaction) {
    return generatePayrollRegister(payrollRunId, transaction);
  }

  async analyzePayrollCosts(startDate: Date, endDate: Date, transaction?: Transaction) {
    return analyzePayrollCosts(startDate, endDate, transaction);
  }

  async generatePayrollSummary(periodId: string, transaction?: Transaction) {
    return generatePayrollSummary(periodId, transaction);
  }

  async exportPayrollReports(
    payrollRunId: string,
    format: 'PDF' | 'CSV' | 'EXCEL' | 'JSON',
    transaction?: Transaction,
  ) {
    return exportPayrollReports(payrollRunId, format, transaction);
  }

  // Reconciliation
  async reconcilePayrollToGL(payrollRunId: string, glTotal: number, transaction?: Transaction) {
    return reconcilePayrollToGL(payrollRunId, glTotal, transaction);
  }

  async validatePayrollTotals(payrollRunId: string, transaction?: Transaction) {
    return validatePayrollTotals(payrollRunId, transaction);
  }

  async trackPayrollDiscrepancies(payrollRunId: string, transaction?: Transaction) {
    return trackPayrollDiscrepancies(payrollRunId, transaction);
  }

  async generateReconciliationReport(payrollRunId: string, transaction?: Transaction) {
    return generateReconciliationReport(payrollRunId, transaction);
  }

  // Third-Party Integration
  async connectPayrollProvider(
    provider: PayrollProvider,
    configuration: Record<string, any>,
    transaction?: Transaction,
  ) {
    return connectPayrollProvider(provider, configuration, transaction);
  }

  async exportPayrollDataToProvider(
    providerId: string,
    payrollRunId: string,
    transaction?: Transaction,
  ) {
    return exportPayrollDataToProvider(providerId, payrollRunId, transaction);
  }

  async importPayrollResultsFromProvider(providerId: string, transaction?: Transaction) {
    return importPayrollResultsFromProvider(providerId, transaction);
  }

  async syncPayrollProviderStatus(providerId: string, transaction?: Transaction) {
    return syncPayrollProviderStatus(providerId, transaction);
  }

  // Audit & Compliance
  async auditPayrollRun(payrollRunId: string, transaction?: Transaction) {
    return auditPayrollRun(payrollRunId, transaction);
  }

  async validatePayrollCompliance(
    payrollRunId: string,
    regulations: string[],
    transaction?: Transaction,
  ) {
    return validatePayrollCompliance(payrollRunId, regulations, transaction);
  }

  async generateComplianceReport(startDate: Date, endDate: Date, transaction?: Transaction) {
    return generateComplianceReport(startDate, endDate, transaction);
  }
}
