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
import { Model } from 'sequelize-typescript';
import { z } from 'zod';
import { Transaction } from 'sequelize';
/**
 * Payroll run status
 */
export declare enum PayrollRunStatus {
    DRAFT = "DRAFT",
    IN_PREPARATION = "IN_PREPARATION",
    VALIDATION_IN_PROGRESS = "VALIDATION_IN_PROGRESS",
    VALIDATION_FAILED = "VALIDATION_FAILED",
    READY_FOR_APPROVAL = "READY_FOR_APPROVAL",
    APPROVED = "APPROVED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    LOCKED = "LOCKED"
}
/**
 * Earning types
 */
export declare enum EarningType {
    REGULAR_SALARY = "REGULAR_SALARY",
    HOURLY_WAGES = "HOURLY_WAGES",
    OVERTIME = "OVERTIME",
    DOUBLE_TIME = "DOUBLE_TIME",
    BONUS = "BONUS",
    COMMISSION = "COMMISSION",
    SHIFT_DIFFERENTIAL = "SHIFT_DIFFERENTIAL",
    ON_CALL_PAY = "ON_CALL_PAY",
    HOLIDAY_PAY = "HOLIDAY_PAY",
    SICK_PAY = "SICK_PAY",
    VACATION_PAY = "VACATION_PAY",
    SEVERANCE = "SEVERANCE",
    RETENTION_BONUS = "RETENTION_BONUS",
    SIGNING_BONUS = "SIGNING_BONUS",
    PROFIT_SHARING = "PROFIT_SHARING",
    STOCK_OPTIONS = "STOCK_OPTIONS",
    ALLOWANCE = "ALLOWANCE",
    REIMBURSEMENT = "REIMBURSEMENT"
}
/**
 * Deduction types
 */
export declare enum DeductionType {
    FEDERAL_TAX = "FEDERAL_TAX",
    STATE_TAX = "STATE_TAX",
    LOCAL_TAX = "LOCAL_TAX",
    SOCIAL_SECURITY = "SOCIAL_SECURITY",
    MEDICARE = "MEDICARE",
    HEALTH_INSURANCE = "HEALTH_INSURANCE",
    DENTAL_INSURANCE = "DENTAL_INSURANCE",
    VISION_INSURANCE = "VISION_INSURANCE",
    LIFE_INSURANCE = "LIFE_INSURANCE",
    RETIREMENT_401K = "RETIREMENT_401K",
    RETIREMENT_ROTH = "RETIREMENT_ROTH",
    HSA = "HSA",
    FSA = "FSA",
    UNION_DUES = "UNION_DUES",
    GARNISHMENT = "GARNISHMENT",
    CHILD_SUPPORT = "CHILD_SUPPORT",
    STUDENT_LOAN = "STUDENT_LOAN",
    CHARITABLE_DONATION = "CHARITABLE_DONATION",
    OTHER = "OTHER"
}
/**
 * Deduction calculation method
 */
export declare enum DeductionCalculationMethod {
    FIXED_AMOUNT = "FIXED_AMOUNT",
    PERCENTAGE = "PERCENTAGE",
    PERCENTAGE_OF_GROSS = "PERCENTAGE_OF_GROSS",
    TIERED = "TIERED",
    FORMULA = "FORMULA"
}
/**
 * Tax filing status
 */
export declare enum TaxFilingStatus {
    SINGLE = "SINGLE",
    MARRIED_FILING_JOINTLY = "MARRIED_FILING_JOINTLY",
    MARRIED_FILING_SEPARATELY = "MARRIED_FILING_SEPARATELY",
    HEAD_OF_HOUSEHOLD = "HEAD_OF_HOUSEHOLD",
    QUALIFYING_WIDOW = "QUALIFYING_WIDOW"
}
/**
 * Tax type
 */
export declare enum TaxType {
    FEDERAL_INCOME_TAX = "FEDERAL_INCOME_TAX",
    STATE_INCOME_TAX = "STATE_INCOME_TAX",
    LOCAL_INCOME_TAX = "LOCAL_INCOME_TAX",
    SOCIAL_SECURITY = "SOCIAL_SECURITY",
    MEDICARE = "MEDICARE",
    MEDICARE_ADDITIONAL = "MEDICARE_ADDITIONAL",
    UNEMPLOYMENT_TAX = "UNEMPLOYMENT_TAX",
    DISABILITY_TAX = "DISABILITY_TAX"
}
/**
 * Payroll frequency
 */
export declare enum PayrollFrequency {
    WEEKLY = "WEEKLY",
    BI_WEEKLY = "BI_WEEKLY",
    SEMI_MONTHLY = "SEMI_MONTHLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    ANNUALLY = "ANNUALLY",
    ON_DEMAND = "ON_DEMAND"
}
/**
 * Payroll period status
 */
export declare enum PayrollPeriodStatus {
    OPEN = "OPEN",
    LOCKED = "LOCKED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    CLOSED = "CLOSED"
}
/**
 * Adjustment type
 */
export declare enum AdjustmentType {
    RETROACTIVE_PAY_INCREASE = "RETROACTIVE_PAY_INCREASE",
    RETROACTIVE_PAY_DECREASE = "RETROACTIVE_PAY_DECREASE",
    MISSED_HOURS = "MISSED_HOURS",
    OVERPAYMENT_RECOVERY = "OVERPAYMENT_RECOVERY",
    TAX_ADJUSTMENT = "TAX_ADJUSTMENT",
    DEDUCTION_ADJUSTMENT = "DEDUCTION_ADJUSTMENT",
    BONUS_ADJUSTMENT = "BONUS_ADJUSTMENT",
    CORRECTION = "CORRECTION",
    MANUAL = "MANUAL"
}
/**
 * Off-cycle payroll reason
 */
export declare enum OffCycleReason {
    BONUS = "BONUS",
    COMMISSION = "COMMISSION",
    TERMINATION = "TERMINATION",
    SEVERANCE = "SEVERANCE",
    CORRECTION = "CORRECTION",
    NEW_HIRE = "NEW_HIRE",
    MANUAL_CHECK = "MANUAL_CHECK",
    EMERGENCY = "EMERGENCY"
}
/**
 * Garnishment type
 */
export declare enum GarnishmentType {
    CHILD_SUPPORT = "CHILD_SUPPORT",
    SPOUSAL_SUPPORT = "SPOUSAL_SUPPORT",
    TAX_LEVY = "TAX_LEVY",
    BANKRUPTCY = "BANKRUPTCY",
    CREDITOR_GARNISHMENT = "CREDITOR_GARNISHMENT",
    STUDENT_LOAN = "STUDENT_LOAN",
    OTHER = "OTHER"
}
/**
 * Garnishment status
 */
export declare enum GarnishmentStatus {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
/**
 * Third-party payroll provider
 */
export declare enum PayrollProvider {
    ADP = "ADP",
    WORKDAY = "WORKDAY",
    SAP_SUCCESSFACTORS = "SAP_SUCCESSFACTORS",
    PAYLOCITY = "PAYLOCITY",
    PAYCHEX = "PAYCHEX",
    GUSTO = "GUSTO",
    RIPPLING = "RIPPLING",
    BAMBOO_HR = "BAMBOO_HR",
    NAMELY = "NAMELY",
    INTERNAL = "INTERNAL"
}
/**
 * Integration sync status
 */
export declare enum SyncStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    PARTIAL = "PARTIAL"
}
/**
 * Reconciliation status
 */
export declare enum ReconciliationStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    RECONCILED = "RECONCILED",
    DISCREPANCY_FOUND = "DISCREPANCY_FOUND",
    REVIEW_REQUIRED = "REVIEW_REQUIRED",
    APPROVED = "APPROVED"
}
/**
 * Payment method
 */
export declare enum PaymentMethod {
    DIRECT_DEPOSIT = "DIRECT_DEPOSIT",
    CHECK = "CHECK",
    CASH = "CASH",
    PAYCARD = "PAYCARD",
    WIRE_TRANSFER = "WIRE_TRANSFER"
}
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
export declare const PayrollRunSchema: any;
export declare const EarningsSchema: any;
export declare const DeductionsSchema: any;
export declare const TaxWithholdingSchema: any;
export declare const PayrollPeriodSchema: any;
export declare const RetroactivePaySchema: any;
export declare const OffCyclePayrollSchema: any;
export declare const GarnishmentSchema: any;
/**
 * Payroll Run Model
 */
export declare class PayrollRunModel extends Model<IPayrollRun> {
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
    deletedAt?: Date;
    payrollPeriod: PayrollPeriodModel;
    earnings: EarningsModel[];
    deductions: DeductionsModel[];
    taxWithholdings: TaxWithholdingModel[];
}
/**
 * Payroll Data Sync Model
 */
export declare class PayrollDataSyncModel extends Model<IPayrollDataSync> {
    id: string;
    syncType: string;
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
 * Earnings Model
 */
export declare class EarningsModel extends Model<IEarnings> {
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
    payrollRun: PayrollRunModel;
}
/**
 * Deductions Model
 */
export declare class DeductionsModel extends Model<IDeductions> {
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
    payrollRun: PayrollRunModel;
}
/**
 * Tax Withholding Model
 */
export declare class TaxWithholdingModel extends Model<ITaxWithholding> {
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
    payrollRun: PayrollRunModel;
}
/**
 * Payroll Calendar Model
 */
export declare class PayrollCalendarModel extends Model<IPayrollCalendar> {
    id: string;
    year: number;
    frequency: PayrollFrequency;
    createdAt: Date;
    updatedAt: Date;
    periods: PayrollPeriodModel[];
}
/**
 * Payroll Period Model
 */
export declare class PayrollPeriodModel extends Model<IPayrollPeriod> {
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
    calendar: PayrollCalendarModel;
    payrollRuns: PayrollRunModel[];
}
/**
 * Retroactive Pay Model
 */
export declare class RetroactivePayModel extends Model<IRetroactivePay> {
    id: string;
    employeeId: string;
    adjustmentType: AdjustmentType;
    effectiveDate: Date;
    originalPayRate: number;
    newPayRate: number;
    periodsAffected: number;
    totalAdjustment: number;
    status: string;
    approvedBy?: string;
    approvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Off-Cycle Payroll Model
 */
export declare class OffCyclePayrollModel extends Model<IOffCyclePayroll> {
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
 * Garnishment Model
 */
export declare class GarnishmentModel extends Model<IGarnishment> {
    id: string;
    employeeId: string;
    garnishmentType: GarnishmentType;
    caseNumber: string;
    issuingAuthority: string;
    orderDate: Date;
    startDate: Date;
    endDate?: Date;
    status: GarnishmentStatus;
    amountType: string;
    amount: number;
    maxPercentage?: number;
    totalOwed?: number;
    totalPaid: number;
    priority: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Payroll Reconciliation Model
 */
export declare class PayrollReconciliationModel extends Model<IPayrollReconciliation> {
    id: string;
    payrollRunId: string;
    reconciledWith: string;
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
 * Third-Party Integration Model
 */
export declare class ThirdPartyIntegrationModel extends Model<IThirdPartyIntegration> {
    id: string;
    provider: PayrollProvider;
    status: string;
    lastSyncAt?: Date;
    configuration: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Payroll Audit Log Model
 */
export declare class PayrollAuditLogModel extends Model<IPayrollAuditLog> {
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
/**
 * Payroll Data Synchronization Functions
 */
/**
 * Synchronize employee data from HR system to payroll
 * @param syncType - Type of sync to perform
 * @param transaction - Optional database transaction
 * @returns Sync record
 */
export declare function syncPayrollEmployeeData(syncType: 'EMPLOYEE_DATA' | 'TIME_ATTENDANCE' | 'CHANGES' | 'FULL', transaction?: Transaction): Promise<PayrollDataSyncModel>;
/**
 * Sync time and attendance data for payroll processing
 * @param startDate - Start date for sync
 * @param endDate - End date for sync
 * @param transaction - Optional database transaction
 * @returns Sync results
 */
export declare function syncTimeAndAttendance(startDate: Date, endDate: Date, transaction?: Transaction): Promise<{
    synced: boolean;
    recordsProcessed: number;
    errors: string[];
}>;
/**
 * Synchronize payroll changes (salary, deductions, etc.)
 * @param changesSince - Date to sync changes from
 * @param transaction - Optional database transaction
 * @returns Sync results
 */
export declare function syncPayrollChanges(changesSince: Date, transaction?: Transaction): Promise<PayrollDataSyncModel>;
/**
 * Validate payroll data integrity before processing
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Validation results
 */
export declare function validatePayrollDataIntegrity(payrollRunId: string, transaction?: Transaction): Promise<{
    valid: boolean;
    errors: IValidationError[];
}>;
/**
 * Payroll Run Preparation & Validation Functions
 */
/**
 * Prepare payroll run for processing
 * @param payrollData - Payroll run data
 * @param transaction - Optional database transaction
 * @returns Created payroll run
 */
export declare function preparePayrollRun(payrollData: z.infer<typeof PayrollRunSchema>, transaction?: Transaction): Promise<PayrollRunModel>;
/**
 * Validate payroll inputs before processing
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Validation results
 */
export declare function validatePayrollInputs(payrollRunId: string, transaction?: Transaction): Promise<{
    valid: boolean;
    errors: IValidationError[];
    warnings: IValidationError[];
}>;
/**
 * Lock payroll period to prevent changes
 * @param periodId - Period ID
 * @param lockedBy - User locking the period
 * @param transaction - Optional database transaction
 * @returns Locked period
 */
export declare function lockPayrollPeriod(periodId: string, lockedBy: string, transaction?: Transaction): Promise<PayrollPeriodModel>;
/**
 * Approve payroll run for processing
 * @param payrollRunId - Payroll run ID
 * @param approvedBy - User approving the run
 * @param transaction - Optional database transaction
 * @returns Approved payroll run
 */
export declare function approvePayrollRun(payrollRunId: string, approvedBy: string, transaction?: Transaction): Promise<PayrollRunModel>;
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
export declare function calculateEarnings(employeeId: string, payrollRunId: string, earningsData: Array<Omit<IEarnings, 'id' | 'createdAt' | 'updatedAt'>>, transaction?: Transaction): Promise<EarningsModel[]>;
/**
 * Apply deductions to employee payroll
 * @param employeeId - Employee ID
 * @param payrollRunId - Payroll run ID
 * @param deductionsData - Deductions data array
 * @param transaction - Optional database transaction
 * @returns Created deduction records
 */
export declare function applyDeductions(employeeId: string, payrollRunId: string, deductionsData: Array<Omit<IDeductions, 'id' | 'createdAt' | 'updatedAt'>>, transaction?: Transaction): Promise<DeductionsModel[]>;
/**
 * Track recurring deductions for employee
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns List of recurring deductions
 */
export declare function trackRecurringDeductions(employeeId: string, transaction?: Transaction): Promise<DeductionsModel[]>;
/**
 * Generate earnings statement for employee
 * @param employeeId - Employee ID
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Earnings statement
 */
export declare function generateEarningsStatement(employeeId: string, payrollRunId: string, transaction?: Transaction): Promise<{
    employeeId: string;
    payrollRunId: string;
    earnings: EarningsModel[];
    totalEarnings: number;
}>;
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
export declare function calculateFederalTax(employeeId: string, payrollRunId: string, taxableWages: number, filingStatus: TaxFilingStatus, exemptions: number, transaction?: Transaction): Promise<TaxWithholdingModel>;
/**
 * Calculate state income tax withholding
 * @param employeeId - Employee ID
 * @param payrollRunId - Payroll run ID
 * @param taxableWages - Taxable wages amount
 * @param state - State code
 * @param transaction - Optional database transaction
 * @returns State tax withholding record
 */
export declare function calculateStateTax(employeeId: string, payrollRunId: string, taxableWages: number, state: string, transaction?: Transaction): Promise<TaxWithholdingModel>;
/**
 * Calculate local/city income tax withholding
 * @param employeeId - Employee ID
 * @param payrollRunId - Payroll run ID
 * @param taxableWages - Taxable wages amount
 * @param locality - Local jurisdiction
 * @param transaction - Optional database transaction
 * @returns Local tax withholding record
 */
export declare function calculateLocalTax(employeeId: string, payrollRunId: string, taxableWages: number, locality: string, transaction?: Transaction): Promise<TaxWithholdingModel>;
/**
 * Apply tax exemptions and adjustments
 * @param taxWithholdingId - Tax withholding ID
 * @param exemptions - Number of exemptions
 * @param additionalWithholding - Additional withholding amount
 * @param transaction - Optional database transaction
 * @returns Updated tax withholding
 */
export declare function applyTaxExemptions(taxWithholdingId: string, exemptions: number, additionalWithholding: number, transaction?: Transaction): Promise<TaxWithholdingModel>;
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
export declare function createPayrollCalendar(year: number, frequency: PayrollFrequency, transaction?: Transaction): Promise<PayrollCalendarModel>;
/**
 * Get payroll schedule for employee
 * @param employeeId - Employee ID
 * @param year - Year
 * @param transaction - Optional database transaction
 * @returns Payroll schedule
 */
export declare function getPayrollSchedule(employeeId: string, year: number, transaction?: Transaction): Promise<PayrollPeriodModel[]>;
/**
 * Adjust payroll dates for holidays
 * @param periodId - Period ID
 * @param newPayDate - New pay date
 * @param transaction - Optional database transaction
 * @returns Updated period
 */
export declare function adjustPayrollDates(periodId: string, newPayDate: Date, transaction?: Transaction): Promise<PayrollPeriodModel>;
/**
 * Notify stakeholders of payroll deadlines
 * @param periodId - Period ID
 * @param transaction - Optional database transaction
 * @returns Notification results
 */
export declare function notifyPayrollDeadlines(periodId: string, transaction?: Transaction): Promise<{
    notified: boolean;
    recipientCount: number;
}>;
/**
 * Retroactive Pay & Adjustments Functions
 */
/**
 * Calculate retroactive pay adjustment
 * @param adjustmentData - Adjustment data
 * @param transaction - Optional database transaction
 * @returns Retroactive pay record
 */
export declare function calculateRetroactivePay(adjustmentData: z.infer<typeof RetroactivePaySchema>, transaction?: Transaction): Promise<RetroactivePayModel>;
/**
 * Apply payroll adjustments to current or past periods
 * @param payrollRunId - Payroll run ID
 * @param adjustments - Array of adjustments
 * @param transaction - Optional database transaction
 * @returns Applied adjustments
 */
export declare function applyPayrollAdjustments(payrollRunId: string, adjustments: Array<{
    employeeId: string;
    adjustmentType: AdjustmentType;
    amount: number;
    description: string;
}>, transaction?: Transaction): Promise<any[]>;
/**
 * Track adjustment history for auditing
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns Adjustment history
 */
export declare function trackAdjustmentHistory(employeeId: string, transaction?: Transaction): Promise<RetroactivePayModel[]>;
/**
 * Reconcile retroactive changes across periods
 * @param employeeId - Employee ID
 * @param startDate - Start date
 * @param endDate - End date
 * @param transaction - Optional database transaction
 * @returns Reconciliation summary
 */
export declare function reconcileRetroactiveChanges(employeeId: string, startDate: Date, endDate: Date, transaction?: Transaction): Promise<{
    totalAdjustments: number;
    adjustmentCount: number;
}>;
/**
 * Off-Cycle & Bonus Payroll Functions
 */
/**
 * Create off-cycle payroll run
 * @param offCycleData - Off-cycle payroll data
 * @param transaction - Optional database transaction
 * @returns Created off-cycle payroll
 */
export declare function createOffCyclePayroll(offCycleData: z.infer<typeof OffCyclePayrollSchema>, transaction?: Transaction): Promise<OffCyclePayrollModel>;
/**
 * Process bonus payment
 * @param employeeId - Employee ID
 * @param bonusAmount - Bonus amount
 * @param bonusType - Type of bonus
 * @param payDate - Payment date
 * @param transaction - Optional database transaction
 * @returns Processed bonus payment
 */
export declare function processBonusPayment(employeeId: string, bonusAmount: number, bonusType: string, payDate: Date, transaction?: Transaction): Promise<OffCyclePayrollModel>;
/**
 * Calculate severance pay
 * @param employeeId - Employee ID
 * @param yearsOfService - Years of service
 * @param finalSalary - Final salary
 * @param transaction - Optional database transaction
 * @returns Severance calculation
 */
export declare function calculateSeverancePay(employeeId: string, yearsOfService: number, finalSalary: number, transaction?: Transaction): Promise<{
    severanceAmount: number;
    weeks: number;
}>;
/**
 * Process commission payment
 * @param employeeId - Employee ID
 * @param commissionAmount - Commission amount
 * @param period - Commission period
 * @param transaction - Optional database transaction
 * @returns Processed commission
 */
export declare function processCommissionPayment(employeeId: string, commissionAmount: number, period: string, transaction?: Transaction): Promise<OffCyclePayrollModel>;
/**
 * Garnishment & Child Support Functions
 */
/**
 * Apply garnishment to payroll
 * @param garnishmentData - Garnishment data
 * @param transaction - Optional database transaction
 * @returns Created garnishment
 */
export declare function applyGarnishment(garnishmentData: z.infer<typeof GarnishmentSchema>, transaction?: Transaction): Promise<GarnishmentModel>;
/**
 * Track garnishment orders for employee
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns Active garnishments
 */
export declare function trackGarnishmentOrders(employeeId: string, transaction?: Transaction): Promise<GarnishmentModel[]>;
/**
 * Report garnishment payments to authorities
 * @param garnishmentId - Garnishment ID
 * @param paymentAmount - Payment amount
 * @param paymentDate - Payment date
 * @param transaction - Optional database transaction
 * @returns Reporting confirmation
 */
export declare function reportGarnishmentPayments(garnishmentId: string, paymentAmount: number, paymentDate: Date, transaction?: Transaction): Promise<{
    reported: boolean;
    garnishment: GarnishmentModel;
}>;
/**
 * Payroll Reporting & Analytics Functions
 */
/**
 * Generate payroll register report
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Payroll register
 */
export declare function generatePayrollRegister(payrollRunId: string, transaction?: Transaction): Promise<any>;
/**
 * Analyze payroll costs and trends
 * @param startDate - Start date
 * @param endDate - End date
 * @param transaction - Optional database transaction
 * @returns Cost analysis
 */
export declare function analyzePayrollCosts(startDate: Date, endDate: Date, transaction?: Transaction): Promise<{
    totalCost: number;
    averagePerEmployee: number;
    trends: any[];
}>;
/**
 * Generate payroll summary report
 * @param periodId - Period ID
 * @param transaction - Optional database transaction
 * @returns Summary report
 */
export declare function generatePayrollSummary(periodId: string, transaction?: Transaction): Promise<any>;
/**
 * Export payroll reports in various formats
 * @param payrollRunId - Payroll run ID
 * @param format - Export format
 * @param transaction - Optional database transaction
 * @returns Export result
 */
export declare function exportPayrollReports(payrollRunId: string, format: 'PDF' | 'CSV' | 'EXCEL' | 'JSON', transaction?: Transaction): Promise<{
    exported: boolean;
    format: string;
    url?: string;
}>;
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
export declare function reconcilePayrollToGL(payrollRunId: string, glTotal: number, transaction?: Transaction): Promise<PayrollReconciliationModel>;
/**
 * Validate payroll totals against source data
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Validation results
 */
export declare function validatePayrollTotals(payrollRunId: string, transaction?: Transaction): Promise<{
    valid: boolean;
    discrepancies: IDiscrepancy[];
}>;
/**
 * Track payroll discrepancies
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Discrepancy list
 */
export declare function trackPayrollDiscrepancies(payrollRunId: string, transaction?: Transaction): Promise<IDiscrepancy[]>;
/**
 * Generate reconciliation report
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Reconciliation report
 */
export declare function generateReconciliationReport(payrollRunId: string, transaction?: Transaction): Promise<any>;
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
export declare function connectPayrollProvider(provider: PayrollProvider, configuration: Record<string, any>, transaction?: Transaction): Promise<ThirdPartyIntegrationModel>;
/**
 * Export payroll data to third-party provider
 * @param providerId - Provider integration ID
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Export results
 */
export declare function exportPayrollDataToProvider(providerId: string, payrollRunId: string, transaction?: Transaction): Promise<{
    exported: boolean;
    recordCount: number;
}>;
/**
 * Import payroll results from third-party provider
 * @param providerId - Provider integration ID
 * @param transaction - Optional database transaction
 * @returns Import results
 */
export declare function importPayrollResultsFromProvider(providerId: string, transaction?: Transaction): Promise<{
    imported: boolean;
    recordCount: number;
}>;
/**
 * Sync payroll provider status
 * @param providerId - Provider integration ID
 * @param transaction - Optional database transaction
 * @returns Sync status
 */
export declare function syncPayrollProviderStatus(providerId: string, transaction?: Transaction): Promise<ThirdPartyIntegrationModel>;
/**
 * Payroll Audit & Compliance Functions
 */
/**
 * Audit payroll run for compliance
 * @param payrollRunId - Payroll run ID
 * @param transaction - Optional database transaction
 * @returns Audit results
 */
export declare function auditPayrollRun(payrollRunId: string, transaction?: Transaction): Promise<{
    compliant: boolean;
    findings: string[];
    recommendations: string[];
}>;
/**
 * Validate payroll compliance with regulations
 * @param payrollRunId - Payroll run ID
 * @param regulations - Array of regulation codes
 * @param transaction - Optional database transaction
 * @returns Compliance validation
 */
export declare function validatePayrollCompliance(payrollRunId: string, regulations: string[], transaction?: Transaction): Promise<{
    compliant: boolean;
    violations: string[];
}>;
/**
 * Generate compliance report
 * @param startDate - Start date
 * @param endDate - End date
 * @param transaction - Optional database transaction
 * @returns Compliance report
 */
export declare function generateComplianceReport(startDate: Date, endDate: Date, transaction?: Transaction): Promise<{
    period: {
        startDate: Date;
        endDate: Date;
    };
    payrollRunsAudited: number;
    complianceRate: number;
    violations: string[];
}>;
/**
 * Payroll Integration Service
 * Provides enterprise-grade payroll processing and integration
 */
export declare class PayrollIntegrationService {
    syncPayrollEmployeeData(syncType: 'EMPLOYEE_DATA' | 'TIME_ATTENDANCE' | 'CHANGES' | 'FULL', transaction?: Transaction): Promise<PayrollDataSyncModel>;
    syncTimeAndAttendance(startDate: Date, endDate: Date, transaction?: Transaction): Promise<{
        synced: boolean;
        recordsProcessed: number;
        errors: string[];
    }>;
    syncPayrollChanges(changesSince: Date, transaction?: Transaction): Promise<PayrollDataSyncModel>;
    validatePayrollDataIntegrity(payrollRunId: string, transaction?: Transaction): Promise<{
        valid: boolean;
        errors: IValidationError[];
    }>;
    preparePayrollRun(data: z.infer<typeof PayrollRunSchema>, transaction?: Transaction): Promise<PayrollRunModel>;
    validatePayrollInputs(payrollRunId: string, transaction?: Transaction): Promise<{
        valid: boolean;
        errors: IValidationError[];
        warnings: IValidationError[];
    }>;
    lockPayrollPeriod(periodId: string, lockedBy: string, transaction?: Transaction): Promise<PayrollPeriodModel>;
    approvePayrollRun(payrollRunId: string, approvedBy: string, transaction?: Transaction): Promise<PayrollRunModel>;
    calculateEarnings(employeeId: string, payrollRunId: string, earningsData: any[], transaction?: Transaction): Promise<EarningsModel[]>;
    applyDeductions(employeeId: string, payrollRunId: string, deductionsData: any[], transaction?: Transaction): Promise<DeductionsModel[]>;
    trackRecurringDeductions(employeeId: string, transaction?: Transaction): Promise<DeductionsModel[]>;
    generateEarningsStatement(employeeId: string, payrollRunId: string, transaction?: Transaction): Promise<{
        employeeId: string;
        payrollRunId: string;
        earnings: EarningsModel[];
        totalEarnings: number;
    }>;
    calculateFederalTax(employeeId: string, payrollRunId: string, taxableWages: number, filingStatus: TaxFilingStatus, exemptions: number, transaction?: Transaction): Promise<TaxWithholdingModel>;
    calculateStateTax(employeeId: string, payrollRunId: string, taxableWages: number, state: string, transaction?: Transaction): Promise<TaxWithholdingModel>;
    calculateLocalTax(employeeId: string, payrollRunId: string, taxableWages: number, locality: string, transaction?: Transaction): Promise<TaxWithholdingModel>;
    applyTaxExemptions(taxWithholdingId: string, exemptions: number, additionalWithholding: number, transaction?: Transaction): Promise<TaxWithholdingModel>;
    createPayrollCalendar(year: number, frequency: PayrollFrequency, transaction?: Transaction): Promise<PayrollCalendarModel>;
    getPayrollSchedule(employeeId: string, year: number, transaction?: Transaction): Promise<PayrollPeriodModel[]>;
    adjustPayrollDates(periodId: string, newPayDate: Date, transaction?: Transaction): Promise<PayrollPeriodModel>;
    notifyPayrollDeadlines(periodId: string, transaction?: Transaction): Promise<{
        notified: boolean;
        recipientCount: number;
    }>;
    calculateRetroactivePay(data: z.infer<typeof RetroactivePaySchema>, transaction?: Transaction): Promise<RetroactivePayModel>;
    applyPayrollAdjustments(payrollRunId: string, adjustments: any[], transaction?: Transaction): Promise<any[]>;
    trackAdjustmentHistory(employeeId: string, transaction?: Transaction): Promise<RetroactivePayModel[]>;
    reconcileRetroactiveChanges(employeeId: string, startDate: Date, endDate: Date, transaction?: Transaction): Promise<{
        totalAdjustments: number;
        adjustmentCount: number;
    }>;
    createOffCyclePayroll(data: z.infer<typeof OffCyclePayrollSchema>, transaction?: Transaction): Promise<OffCyclePayrollModel>;
    processBonusPayment(employeeId: string, bonusAmount: number, bonusType: string, payDate: Date, transaction?: Transaction): Promise<OffCyclePayrollModel>;
    calculateSeverancePay(employeeId: string, yearsOfService: number, finalSalary: number, transaction?: Transaction): Promise<{
        severanceAmount: number;
        weeks: number;
    }>;
    processCommissionPayment(employeeId: string, commissionAmount: number, period: string, transaction?: Transaction): Promise<OffCyclePayrollModel>;
    applyGarnishment(data: z.infer<typeof GarnishmentSchema>, transaction?: Transaction): Promise<GarnishmentModel>;
    trackGarnishmentOrders(employeeId: string, transaction?: Transaction): Promise<GarnishmentModel[]>;
    reportGarnishmentPayments(garnishmentId: string, paymentAmount: number, paymentDate: Date, transaction?: Transaction): Promise<{
        reported: boolean;
        garnishment: GarnishmentModel;
    }>;
    generatePayrollRegister(payrollRunId: string, transaction?: Transaction): Promise<any>;
    analyzePayrollCosts(startDate: Date, endDate: Date, transaction?: Transaction): Promise<{
        totalCost: number;
        averagePerEmployee: number;
        trends: any[];
    }>;
    generatePayrollSummary(periodId: string, transaction?: Transaction): Promise<any>;
    exportPayrollReports(payrollRunId: string, format: 'PDF' | 'CSV' | 'EXCEL' | 'JSON', transaction?: Transaction): Promise<{
        exported: boolean;
        format: string;
        url?: string;
    }>;
    reconcilePayrollToGL(payrollRunId: string, glTotal: number, transaction?: Transaction): Promise<PayrollReconciliationModel>;
    validatePayrollTotals(payrollRunId: string, transaction?: Transaction): Promise<{
        valid: boolean;
        discrepancies: IDiscrepancy[];
    }>;
    trackPayrollDiscrepancies(payrollRunId: string, transaction?: Transaction): Promise<IDiscrepancy[]>;
    generateReconciliationReport(payrollRunId: string, transaction?: Transaction): Promise<any>;
    connectPayrollProvider(provider: PayrollProvider, configuration: Record<string, any>, transaction?: Transaction): Promise<ThirdPartyIntegrationModel>;
    exportPayrollDataToProvider(providerId: string, payrollRunId: string, transaction?: Transaction): Promise<{
        exported: boolean;
        recordCount: number;
    }>;
    importPayrollResultsFromProvider(providerId: string, transaction?: Transaction): Promise<{
        imported: boolean;
        recordCount: number;
    }>;
    syncPayrollProviderStatus(providerId: string, transaction?: Transaction): Promise<ThirdPartyIntegrationModel>;
    auditPayrollRun(payrollRunId: string, transaction?: Transaction): Promise<{
        compliant: boolean;
        findings: string[];
        recommendations: string[];
    }>;
    validatePayrollCompliance(payrollRunId: string, regulations: string[], transaction?: Transaction): Promise<{
        compliant: boolean;
        violations: string[];
    }>;
    generateComplianceReport(startDate: Date, endDate: Date, transaction?: Transaction): Promise<{
        period: {
            startDate: Date;
            endDate: Date;
        };
        payrollRunsAudited: number;
        complianceRate: number;
        violations: string[];
    }>;
}
//# sourceMappingURL=payroll-integration-kit.d.ts.map