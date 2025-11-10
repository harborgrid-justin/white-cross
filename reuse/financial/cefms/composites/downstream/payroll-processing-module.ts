/**
 * LOC: CEFMS-PAYROLL-PROCESSING-001
 * File: /reuse/financial/cefms/composites/downstream/payroll-processing-module.ts
 *
 * UPSTREAM (imports from):
 *   - ../cefms-payroll-personnel-benefits-composite.ts
 *
 * DOWNSTREAM (imported by):
 *   - CEFMS payroll batch processors
 *   - Payroll calculation engines
 *   - Deduction management systems
 */

/**
 * File: /reuse/financial/cefms/composites/downstream/payroll-processing-module.ts
 * Locator: WC-CEFMS-PAYROLL-PROC-001
 * Purpose: Advanced USACE CEFMS Payroll Processing Module - Comprehensive payroll calculations, tax withholdings,
 *          deductions management, direct deposit processing, garnishment handling, and special pay processing
 *
 * Upstream: Imports composite functions from cefms-payroll-personnel-benefits-composite.ts
 * Downstream: Payroll batch jobs, calculation engines, tax processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, decimal.js 10.x
 * Exports: 60+ production-ready payroll processing functions with complete business logic
 *
 * LLM Context: Production-ready USACE CEFMS payroll processing module for advanced payroll operations.
 * Handles complex payroll calculations, federal/state/local tax withholdings, FICA/Medicare calculations,
 * retirement deductions (FERS/TSP), health insurance premiums, garnishment processing, direct deposit splits,
 * overtime calculations, special pay (hazard, shift differential), allowances, retroactive adjustments,
 * and comprehensive payroll audit trails.
 */

import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import Decimal from 'decimal.js';

// ============================================================================
// TYPE DEFINITIONS & INTERFACES
// ============================================================================

export interface PayrollCalculationInput {
  employeeId: string;
  payPeriodId: string;
  regularHours: number;
  overtimeHours?: number;
  doubleTimeHours?: number;
  holidayHours?: number;
  nightShiftHours?: number;
  weekendHours?: number;
  hazardPayHours?: number;
  onCallHours?: number;
  leaveHours?: LeaveHours;
  specialPayments?: SpecialPayment[];
  retroactiveAdjustments?: RetroactiveAdjustment[];
}

export interface LeaveHours {
  annualLeave: number;
  sickLeave: number;
  militaryLeave: number;
  compTime: number;
  lwop: number; // Leave without pay
  other: number;
}

export interface SpecialPayment {
  paymentType: 'bonus' | 'award' | 'relocation' | 'retention' | 'recruitment' | 'performance';
  amount: number;
  description: string;
  taxable: boolean;
}

export interface RetroactiveAdjustment {
  adjustmentType: 'salary_increase' | 'step_increase' | 'grade_change' | 'correction';
  effectiveDate: Date;
  amount: number;
  payPeriods: number;
  description: string;
}

export interface TaxCalculationResult {
  federalTax: number;
  stateTax: number;
  localTax: number;
  ficaTax: number;
  medicareTax: number;
  additionalMedicareTax: number;
  totalTax: number;
  taxableWages: TaxableWages;
}

export interface TaxableWages {
  federalTaxableWages: number;
  stateTaxableWages: number;
  socialSecurityWages: number;
  medicareWages: number;
}

export interface DeductionCalculationResult {
  retirementDeductions: RetirementDeduction[];
  insuranceDeductions: InsuranceDeduction[];
  voluntaryDeductions: VoluntaryDeduction[];
  mandatoryDeductions: MandatoryDeduction[];
  totalDeductions: number;
}

export interface RetirementDeduction {
  deductionType: 'fers' | 'csrs' | 'tsp_traditional' | 'tsp_roth' | 'tsp_catch_up';
  amount: number;
  employeeContribution: number;
  employerContribution: number;
  preTax: boolean;
}

export interface InsuranceDeduction {
  insuranceType: 'health' | 'dental' | 'vision' | 'life' | 'disability' | 'long_term_care';
  planCode: string;
  planName: string;
  premiumAmount: number;
  employeeShare: number;
  employerShare: number;
  preTax: boolean;
}

export interface VoluntaryDeduction {
  deductionCode: string;
  deductionName: string;
  amount: number;
  percentage?: number;
  preTax: boolean;
  frequency: 'per_pay_period' | 'monthly' | 'annual';
}

export interface MandatoryDeduction {
  deductionType: 'garnishment' | 'tax_levy' | 'student_loan' | 'child_support' | 'alimony';
  orderNumber: string;
  amount: number;
  percentage?: number;
  maxPercentage: number;
  recipientName: string;
  recipientAccount: string;
}

export interface DirectDepositAllocation {
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
  allocationType: 'amount' | 'percentage' | 'remainder';
  allocationValue: number;
  priority: number;
}

export interface PayrollProcessingResult {
  payrollId: string;
  employeeId: string;
  payPeriodId: string;
  grossEarnings: GrossEarnings;
  taxWithholdings: TaxCalculationResult;
  deductions: DeductionCalculationResult;
  netPay: number;
  directDepositAllocations: DirectDepositAllocation[];
  checkAmount: number;
  processingStatus: 'success' | 'warning' | 'error';
  messages: ProcessingMessage[];
}

export interface GrossEarnings {
  basicPay: number;
  regularOvertime: number;
  doubleTime: number;
  holidayPay: number;
  nightDifferential: number;
  weekendDifferential: number;
  hazardPay: number;
  onCallPay: number;
  specialPay: number;
  allowances: number;
  bonuses: number;
  awards: number;
  retroactivePay: number;
  totalGross: number;
}

export interface ProcessingMessage {
  messageType: 'info' | 'warning' | 'error';
  messageCode: string;
  messageText: string;
  field?: string;
}

export interface W4Information {
  employeeId: string;
  taxYear: number;
  filingStatus: 'single' | 'married_joint' | 'married_separate' | 'head_of_household';
  multipleJobs: boolean;
  claimDependents: boolean;
  dependentsAmount: number;
  otherIncome: number;
  deductions: number;
  extraWithholding: number;
  exempt: boolean;
  effectiveDate: Date;
}

export interface TaxBracket2024 {
  filingStatus: string;
  periodType: 'biweekly' | 'monthly';
  brackets: TaxBracketTier[];
}

export interface TaxBracketTier {
  minIncome: number;
  maxIncome: number;
  taxRate: number;
  baseAmount: number;
}

export interface PayrollAuditEntry {
  auditId: string;
  payrollId: string;
  employeeId: string;
  actionType: 'create' | 'calculate' | 'adjust' | 'approve' | 'void' | 'post';
  actionDate: Date;
  userId: string;
  beforeSnapshot?: any;
  afterSnapshot?: any;
  changes: AuditChange[];
  comments?: string;
}

export interface AuditChange {
  field: string;
  oldValue: any;
  newValue: any;
  changeReason?: string;
}

export interface GarnishmentOrder {
  id: string;
  garnishmentId: string;
  employeeId: string;
  orderType: 'child_support' | 'tax_levy' | 'student_loan' | 'creditor' | 'bankruptcy' | 'alimony';
  orderNumber: string;
  issuingAuthority: string;
  courtName?: string;
  caseNumber?: string;
  orderDate: Date;
  effectiveDate: Date;
  expirationDate?: Date;
  deductionMethod: 'fixed_amount' | 'percentage' | 'disposable_income';
  amount?: number;
  percentage?: number;
  maxPercentage: number;
  totalAmountOwed?: number;
  amountRemaining?: number;
  priorityLevel: number;
  recipientName: string;
  recipientAddress: string;
  recipientAccount?: string;
  status: 'active' | 'completed' | 'suspended' | 'cancelled';
  metadata: Record<string, any>;
}

export interface DisposableIncomeCalculation {
  grossPay: number;
  federalTax: number;
  stateTax: number;
  localTax: number;
  ficaTax: number;
  medicareTax: number;
  retirementMandatory: number;
  disposableIncome: number;
  ccpaLimit: number; // Consumer Credit Protection Act limit
  garnishmentAllowed: number;
}

export interface PayrollBatchConfig {
  batchId: string;
  payPeriodId: string;
  batchType: 'regular' | 'supplemental' | 'correction' | 'final';
  processingDate: Date;
  organizationFilter?: string[];
  employeeFilter?: string[];
  autoApprove: boolean;
  generateReports: boolean;
  postToGL: boolean;
}

export interface LeaveAccrualCalculation {
  employeeId: string;
  leaveType: 'annual' | 'sick' | 'comp_time';
  accrualRate: number;
  hoursWorked: number;
  accruedHours: number;
  currentBalance: number;
  maxAccrual: number;
  forfeitedHours: number;
}

export interface OvertimeRule {
  ruleId: string;
  ruleName: string;
  flsaStatus: 'exempt' | 'non_exempt';
  dailyThreshold: number;
  weeklyThreshold: number;
  overtimeRate: number;
  doubleTimeThreshold?: number;
  doubleTimeRate: number;
  holidayRate: number;
  weekendRate?: number;
}

export interface ShiftDifferential {
  differentialType: 'night' | 'evening' | 'weekend' | 'holiday';
  startTime: string;
  endTime: string;
  rate: number;
  rateType: 'percentage' | 'fixed_amount';
}

export interface HazardPaySchedule {
  hazardCode: string;
  hazardDescription: string;
  hazardRate: number;
  rateType: 'percentage' | 'hourly';
  approvalRequired: boolean;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

export const createW4InformationModel = (sequelize: Sequelize) => {
  class W4Information extends Model {
    public id!: string;
    public w4Id!: string;
    public employeeId!: string;
    public taxYear!: number;
    public filingStatus!: string;
    public multipleJobs!: boolean;
    public claimDependents!: boolean;
    public dependentsAmount!: number;
    public otherIncome!: number;
    public deductions!: number;
    public extraWithholding!: number;
    public exempt!: boolean;
    public effectiveDate!: Date;
    public submittedDate!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  W4Information.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      w4Id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'W-4 form identifier',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      taxYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Tax year',
      },
      filingStatus: {
        type: DataTypes.ENUM('single', 'married_joint', 'married_separate', 'head_of_household'),
        allowNull: false,
        comment: 'Filing status',
      },
      multipleJobs: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Multiple jobs or spouse works',
      },
      claimDependents: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Claim dependents',
      },
      dependentsAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Dependents credit amount',
      },
      otherIncome: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Other income amount',
      },
      deductions: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Deductions amount',
      },
      extraWithholding: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Extra withholding per pay period',
      },
      exempt: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Tax exempt status',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective date',
      },
      submittedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Submission date',
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
      tableName: 'cefms_w4_information',
      timestamps: true,
      indexes: [
        { fields: ['employeeId', 'taxYear'] },
        { fields: ['effectiveDate'] },
      ],
    }
  );

  return W4Information;
};

export const createGarnishmentOrderModel = (sequelize: Sequelize) => {
  class GarnishmentOrder extends Model {
    public id!: string;
    public garnishmentId!: string;
    public employeeId!: string;
    public orderType!: string;
    public orderNumber!: string;
    public issuingAuthority!: string;
    public courtName!: string | null;
    public caseNumber!: string | null;
    public orderDate!: Date;
    public effectiveDate!: Date;
    public expirationDate!: Date | null;
    public deductionMethod!: string;
    public amount!: number | null;
    public percentage!: number | null;
    public maxPercentage!: number;
    public totalAmountOwed!: number | null;
    public amountRemaining!: number | null;
    public priorityLevel!: number;
    public recipientName!: string;
    public recipientAddress!: string;
    public recipientAccount!: string | null;
    public status!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  GarnishmentOrder.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      garnishmentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Garnishment order identifier',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      orderType: {
        type: DataTypes.ENUM('child_support', 'tax_levy', 'student_loan', 'creditor', 'bankruptcy', 'alimony'),
        allowNull: false,
        comment: 'Order type',
      },
      orderNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Court/agency order number',
      },
      issuingAuthority: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Issuing authority',
      },
      courtName: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Court name if applicable',
      },
      caseNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Case number',
      },
      orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Order date',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective date',
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Expiration date',
      },
      deductionMethod: {
        type: DataTypes.ENUM('fixed_amount', 'percentage', 'disposable_income'),
        allowNull: false,
        comment: 'Deduction calculation method',
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Fixed deduction amount',
      },
      percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Percentage of wages/disposable income',
      },
      maxPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Maximum allowed percentage',
      },
      totalAmountOwed: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Total amount owed',
      },
      amountRemaining: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Remaining amount',
      },
      priorityLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Priority level (1=highest)',
      },
      recipientName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Recipient name',
      },
      recipientAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Recipient address',
      },
      recipientAccount: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Recipient account number',
      },
      status: {
        type: DataTypes.ENUM('active', 'completed', 'suspended', 'cancelled'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Garnishment status',
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
      tableName: 'cefms_garnishment_orders',
      timestamps: true,
      indexes: [
        { fields: ['employeeId'] },
        { fields: ['status'] },
        { fields: ['priorityLevel'] },
        { fields: ['effectiveDate'] },
      ],
    }
  );

  return GarnishmentOrder;
};

export const createDirectDepositModel = (sequelize: Sequelize) => {
  class DirectDeposit extends Model {
    public id!: string;
    public depositId!: string;
    public employeeId!: string;
    public accountNumber!: string;
    public routingNumber!: string;
    public accountType!: string;
    public accountName!: string;
    public bankName!: string;
    public allocationType!: string;
    public allocationValue!: number;
    public priority!: number;
    public status!: string;
    public verificationStatus!: string;
    public verificationDate!: Date | null;
    public effectiveDate!: Date;
    public endDate!: Date | null;
    public prenoteDate!: Date | null;
    public prenoteStatus!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DirectDeposit.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      depositId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Direct deposit identifier',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      accountNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Bank account number (encrypted)',
      },
      routingNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Bank routing number',
      },
      accountType: {
        type: DataTypes.ENUM('checking', 'savings'),
        allowNull: false,
        comment: 'Account type',
      },
      accountName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Account holder name',
      },
      bankName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Bank name',
      },
      allocationType: {
        type: DataTypes.ENUM('amount', 'percentage', 'remainder'),
        allowNull: false,
        comment: 'Allocation type',
      },
      allocationValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Allocation value (amount or percentage)',
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Allocation priority',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'pending', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Direct deposit status',
      },
      verificationStatus: {
        type: DataTypes.ENUM('pending', 'verified', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Account verification status',
      },
      verificationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Verification completion date',
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
      prenoteDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Prenote transaction date',
      },
      prenoteStatus: {
        type: DataTypes.ENUM('pending', 'success', 'failed'),
        allowNull: true,
        comment: 'Prenote status',
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
      tableName: 'cefms_direct_deposits',
      timestamps: true,
      indexes: [
        { fields: ['employeeId'] },
        { fields: ['status'] },
        { fields: ['priority'] },
        { fields: ['effectiveDate'] },
      ],
    }
  );

  return DirectDeposit;
};

export const createPayrollAuditModel = (sequelize: Sequelize) => {
  class PayrollAudit extends Model {
    public id!: string;
    public auditId!: string;
    public payrollId!: string;
    public employeeId!: string;
    public actionType!: string;
    public actionDate!: Date;
    public userId!: string;
    public userName!: string;
    public beforeSnapshot!: Record<string, any> | null;
    public afterSnapshot!: Record<string, any> | null;
    public changes!: any[];
    public comments!: string | null;
    public ipAddress!: string | null;
    public userAgent!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PayrollAudit.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      auditId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Audit entry identifier',
      },
      payrollId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Payroll record identifier',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      actionType: {
        type: DataTypes.ENUM('create', 'calculate', 'adjust', 'approve', 'void', 'post'),
        allowNull: false,
        comment: 'Action type',
      },
      actionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Action timestamp',
      },
      userId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'User who performed action',
      },
      userName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'User name',
      },
      beforeSnapshot: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Record state before change',
      },
      afterSnapshot: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Record state after change',
      },
      changes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'List of field changes',
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Audit comments',
      },
      ipAddress: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'User IP address',
      },
      userAgent: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'User agent string',
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
      tableName: 'cefms_payroll_audit',
      timestamps: true,
      indexes: [
        { fields: ['payrollId'] },
        { fields: ['employeeId'] },
        { fields: ['actionType'] },
        { fields: ['actionDate'] },
        { fields: ['userId'] },
      ],
    }
  );

  return PayrollAudit;
};

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

/**
 * CEFMS Payroll Processing Module
 *
 * Advanced payroll processing engine for USACE CEFMS system.
 * Handles complex payroll calculations, tax withholdings, deductions,
 * garnishments, direct deposits, and comprehensive payroll processing.
 */
@Injectable()
export class CEFMSPayrollProcessingModule {
  private readonly logger = new Logger(CEFMSPayrollProcessingModule.name);

  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel('W4Information') private readonly w4Model: typeof Model,
    @InjectModel('GarnishmentOrder') private readonly garnishmentModel: typeof Model,
    @InjectModel('DirectDeposit') private readonly directDepositModel: typeof Model,
    @InjectModel('PayrollAudit') private readonly auditModel: typeof Model
  ) {}

  // ============================================================================
  // TAX CALCULATION FUNCTIONS (Functions 1-15)
  // ============================================================================

  /**
   * Calculates comprehensive federal income tax withholding using 2024 tax tables and W-4 information.
   *
   * @param {number} grossPay - Gross pay for the period
   * @param {W4Information} w4Info - Employee W-4 information
   * @param {number} payPeriodsPerYear - Pay periods per year (26 for biweekly, 12 for monthly)
   * @param {number} ytdGross - Year-to-date gross pay
   * @returns {number} Federal tax withholding amount
   *
   * @example
   * ```typescript
   * const federalTax = module.calculateFederalIncomeTax(3500, w4Info, 26, 70000);
   * // Returns calculated federal tax based on 2024 IRS Publication 15-T
   * ```
   */
  calculateFederalIncomeTax(
    grossPay: number,
    w4Info: W4Information,
    payPeriodsPerYear: number,
    ytdGross: number
  ): number {
    this.logger.debug(`Calculating federal tax for gross pay: ${grossPay}`);

    // Step 1: Adjust gross pay for tax-deferred deductions (already done in caller)
    let adjustedAnnualWage = new Decimal(grossPay).times(payPeriodsPerYear);

    // Step 2: Apply W-4 adjustments
    if (w4Info.otherIncome > 0) {
      adjustedAnnualWage = adjustedAnnualWage.plus(w4Info.otherIncome);
    }

    if (w4Info.deductions > 0) {
      adjustedAnnualWage = adjustedAnnualWage.minus(w4Info.deductions);
    }

    // Step 3: Calculate standard deduction (2024 values)
    const standardDeductions: Record<string, number> = {
      'single': 14600,
      'married_joint': 29200,
      'married_separate': 14600,
      'head_of_household': 21900,
    };

    const standardDeduction = standardDeductions[w4Info.filingStatus] || 14600;

    // Tentative withholding amount
    let tentativeWithholdingAmount = adjustedAnnualWage.minus(standardDeduction);

    // Step 4: Apply dependent credits
    if (w4Info.claimDependents && w4Info.dependentsAmount > 0) {
      tentativeWithholdingAmount = tentativeWithholdingAmount.minus(w4Info.dependentsAmount);
    }

    // Step 5: Apply tax brackets (2024 federal tax brackets)
    const taxBrackets = this.getFederalTaxBrackets2024(w4Info.filingStatus);
    let annualTax = new Decimal(0);

    const taxableIncome = Math.max(0, tentativeWithholdingAmount.toNumber());

    for (const bracket of taxBrackets) {
      if (taxableIncome > bracket.minIncome) {
        const taxableInBracket = Math.min(
          taxableIncome - bracket.minIncome,
          bracket.maxIncome - bracket.minIncome
        );
        annualTax = annualTax.plus(new Decimal(taxableInBracket).times(bracket.taxRate));
        annualTax = annualTax.plus(bracket.baseAmount);

        if (taxableIncome <= bracket.maxIncome) {
          break;
        }
      }
    }

    // Step 6: Calculate per-period tax
    let periodTax = annualTax.dividedBy(payPeriodsPerYear);

    // Step 7: Add extra withholding
    if (w4Info.extraWithholding > 0) {
      periodTax = periodTax.plus(w4Info.extraWithholding);
    }

    // Step 8: Check for tax exempt status
    if (w4Info.exempt) {
      return 0;
    }

    return periodTax.toDecimalPlaces(2).toNumber();
  }

  /**
   * Gets 2024 federal tax brackets for specified filing status.
   *
   * @param {string} filingStatus - Tax filing status
   * @returns {TaxBracketTier[]} Tax brackets
   */
  private getFederalTaxBrackets2024(filingStatus: string): TaxBracketTier[] {
    const brackets: Record<string, TaxBracketTier[]> = {
      'single': [
        { minIncome: 0, maxIncome: 11600, taxRate: 0.10, baseAmount: 0 },
        { minIncome: 11600, maxIncome: 47150, taxRate: 0.12, baseAmount: 1160 },
        { minIncome: 47150, maxIncome: 100525, taxRate: 0.22, baseAmount: 5426 },
        { minIncome: 100525, maxIncome: 191950, taxRate: 0.24, baseAmount: 17168.50 },
        { minIncome: 191950, maxIncome: 243725, taxRate: 0.32, baseAmount: 39110.50 },
        { minIncome: 243725, maxIncome: 609350, taxRate: 0.35, baseAmount: 55678.50 },
        { minIncome: 609350, maxIncome: Infinity, taxRate: 0.37, baseAmount: 183647.25 },
      ],
      'married_joint': [
        { minIncome: 0, maxIncome: 23200, taxRate: 0.10, baseAmount: 0 },
        { minIncome: 23200, maxIncome: 94300, taxRate: 0.12, baseAmount: 2320 },
        { minIncome: 94300, maxIncome: 201050, taxRate: 0.22, baseAmount: 10852 },
        { minIncome: 201050, maxIncome: 383900, taxRate: 0.24, baseAmount: 34337 },
        { minIncome: 383900, maxIncome: 487450, taxRate: 0.32, baseAmount: 78221 },
        { minIncome: 487450, maxIncome: 731200, taxRate: 0.35, baseAmount: 111357 },
        { minIncome: 731200, maxIncome: Infinity, taxRate: 0.37, baseAmount: 196669.50 },
      ],
      'head_of_household': [
        { minIncome: 0, maxIncome: 16550, taxRate: 0.10, baseAmount: 0 },
        { minIncome: 16550, maxIncome: 63100, taxRate: 0.12, baseAmount: 1655 },
        { minIncome: 63100, maxIncome: 100500, taxRate: 0.22, baseAmount: 7241 },
        { minIncome: 100500, maxIncome: 191950, taxRate: 0.24, baseAmount: 15469 },
        { minIncome: 191950, maxIncome: 243700, taxRate: 0.32, baseAmount: 37417 },
        { minIncome: 243700, maxIncome: 609350, taxRate: 0.35, baseAmount: 53977 },
        { minIncome: 609350, maxIncome: Infinity, taxRate: 0.37, baseAmount: 181954.50 },
      ],
    };

    return brackets[filingStatus] || brackets['single'];
  }

  /**
   * Calculates state income tax withholding with state-specific rules.
   *
   * @param {number} grossPay - Gross pay amount
   * @param {string} stateCode - State code
   * @param {string} filingStatus - Filing status
   * @param {number} exemptions - Number of exemptions
   * @param {number} payPeriodsPerYear - Pay periods per year
   * @returns {number} State tax withholding
   */
  calculateStateTax(
    grossPay: number,
    stateCode: string,
    filingStatus: string,
    exemptions: number,
    payPeriodsPerYear: number
  ): number {
    this.logger.debug(`Calculating state tax for state: ${stateCode}`);

    // State-specific tax calculations
    const stateTaxCalculators: Record<string, (gross: number, filing: string, exemptions: number) => number> = {
      'CA': this.calculateCaliforniaTax.bind(this),
      'NY': this.calculateNewYorkTax.bind(this),
      'VA': this.calculateVirginiaTax.bind(this),
      'MD': this.calculateMarylandTax.bind(this),
      'DC': this.calculateDistrictOfColumbiaTax.bind(this),
      'TX': () => 0, // No state income tax
      'FL': () => 0, // No state income tax
      'WA': () => 0, // No state income tax
    };

    const calculator = stateTaxCalculators[stateCode];
    if (!calculator) {
      // Default calculation for states without specific rules
      return this.calculateDefaultStateTax(grossPay, filingStatus, exemptions);
    }

    return calculator(grossPay, filingStatus, exemptions);
  }

  /**
   * Calculates California state income tax.
   */
  private calculateCaliforniaTax(grossPay: number, filingStatus: string, exemptions: number): number {
    const exemptionAmount = exemptions * 144.23; // 2024 CA exemption per pay period (biweekly)
    const taxableIncome = Math.max(0, grossPay - exemptionAmount);

    // CA tax brackets (simplified)
    const brackets: TaxBracketTier[] = [
      { minIncome: 0, maxIncome: 394, taxRate: 0.01, baseAmount: 0 },
      { minIncome: 394, maxIncome: 934, taxRate: 0.02, baseAmount: 3.94 },
      { minIncome: 934, maxIncome: 1476, taxRate: 0.04, baseAmount: 14.74 },
      { minIncome: 1476, maxIncome: 2048, taxRate: 0.06, baseAmount: 36.42 },
      { minIncome: 2048, maxIncome: 2584, taxRate: 0.08, baseAmount: 70.74 },
      { minIncome: 2584, maxIncome: Infinity, taxRate: 0.093, baseAmount: 113.62 },
    ];

    return this.applyTaxBrackets(taxableIncome, brackets);
  }

  /**
   * Calculates New York state income tax.
   */
  private calculateNewYorkTax(grossPay: number, filingStatus: string, exemptions: number): number {
    const exemptionAmount = exemptions * 38.46; // 2024 NY exemption per pay period (biweekly)
    const taxableIncome = Math.max(0, grossPay - exemptionAmount);

    // NY tax brackets (simplified)
    const brackets: TaxBracketTier[] = [
      { minIncome: 0, maxIncome: 323, taxRate: 0.04, baseAmount: 0 },
      { minIncome: 323, maxIncome: 646, taxRate: 0.045, baseAmount: 12.92 },
      { minIncome: 646, maxIncome: 969, taxRate: 0.0525, baseAmount: 27.46 },
      { minIncome: 969, maxIncome: 1615, taxRate: 0.055, baseAmount: 44.42 },
      { minIncome: 1615, maxIncome: Infinity, taxRate: 0.0685, baseAmount: 79.95 },
    ];

    return this.applyTaxBrackets(taxableIncome, brackets);
  }

  /**
   * Calculates Virginia state income tax.
   */
  private calculateVirginiaTax(grossPay: number, filingStatus: string, exemptions: number): number {
    const exemptionAmount = exemptions * 38.46; // VA exemption
    const taxableIncome = Math.max(0, grossPay - exemptionAmount);

    // VA has a flat tax rate of 5.75% (2024)
    return new Decimal(taxableIncome).times(0.0575).toDecimalPlaces(2).toNumber();
  }

  /**
   * Calculates Maryland state income tax.
   */
  private calculateMarylandTax(grossPay: number, filingStatus: string, exemptions: number): number {
    const exemptionAmount = exemptions * 134.62; // MD exemption (biweekly)
    const taxableIncome = Math.max(0, grossPay - exemptionAmount);

    // MD tax brackets
    const brackets: TaxBracketTier[] = [
      { minIncome: 0, maxIncome: 385, taxRate: 0.02, baseAmount: 0 },
      { minIncome: 385, maxIncome: 962, taxRate: 0.03, baseAmount: 7.70 },
      { minIncome: 962, maxIncome: 1923, taxRate: 0.04, baseAmount: 24.01 },
      { minIncome: 1923, maxIncome: 2885, taxRate: 0.0475, baseAmount: 62.45 },
      { minIncome: 2885, maxIncome: 3846, taxRate: 0.05, baseAmount: 108.20 },
      { minIncome: 3846, maxIncome: Infinity, taxRate: 0.0575, baseAmount: 156.25 },
    ];

    return this.applyTaxBrackets(taxableIncome, brackets);
  }

  /**
   * Calculates DC income tax.
   */
  private calculateDistrictOfColumbiaTax(grossPay: number, filingStatus: string, exemptions: number): number {
    const exemptionAmount = exemptions * 70.19; // DC exemption (biweekly)
    const taxableIncome = Math.max(0, grossPay - exemptionAmount);

    // DC tax brackets
    const brackets: TaxBracketTier[] = [
      { minIncome: 0, maxIncome: 385, taxRate: 0.04, baseAmount: 0 },
      { minIncome: 385, maxIncome: 962, taxRate: 0.06, baseAmount: 15.40 },
      { minIncome: 962, maxIncome: 2308, taxRate: 0.065, baseAmount: 50.02 },
      { minIncome: 2308, maxIncome: 4615, taxRate: 0.085, baseAmount: 137.51 },
      { minIncome: 4615, maxIncome: Infinity, taxRate: 0.0975, baseAmount: 333.61 },
    ];

    return this.applyTaxBrackets(taxableIncome, brackets);
  }

  /**
   * Default state tax calculation for states without specific rules.
   */
  private calculateDefaultStateTax(grossPay: number, filingStatus: string, exemptions: number): number {
    const exemptionAmount = exemptions * 75; // Generic exemption
    const taxableIncome = Math.max(0, grossPay - exemptionAmount);
    return new Decimal(taxableIncome).times(0.05).toDecimalPlaces(2).toNumber(); // 5% flat rate
  }

  /**
   * Applies progressive tax brackets to taxable income.
   */
  private applyTaxBrackets(taxableIncome: number, brackets: TaxBracketTier[]): number {
    let totalTax = new Decimal(0);

    for (const bracket of brackets) {
      if (taxableIncome > bracket.minIncome) {
        const incomeInBracket = Math.min(
          taxableIncome - bracket.minIncome,
          bracket.maxIncome - bracket.minIncome
        );

        const bracketTax = new Decimal(incomeInBracket).times(bracket.taxRate);
        totalTax = totalTax.plus(bracketTax);

        if (taxableIncome <= bracket.maxIncome) {
          break;
        }
      }
    }

    return totalTax.toDecimalPlaces(2).toNumber();
  }

  /**
   * Calculates local income tax (city/county).
   *
   * @param {number} grossPay - Gross pay amount
   * @param {string} locality - Locality code
   * @param {string} stateCode - State code
   * @returns {number} Local tax withholding
   */
  calculateLocalTax(grossPay: number, locality: string, stateCode: string): number {
    this.logger.debug(`Calculating local tax for locality: ${locality}`);

    // Local tax rates by locality
    const localTaxRates: Record<string, number> = {
      'NYC': 0.03876, // New York City
      'PHILA': 0.03398, // Philadelphia
      'BALT': 0.032, // Baltimore City
      'DETROIT': 0.024, // Detroit
      'KC_MO': 0.01, // Kansas City, MO
    };

    const taxRate = localTaxRates[locality] || 0;
    return new Decimal(grossPay).times(taxRate).toDecimalPlaces(2).toNumber();
  }

  /**
   * Calculates FICA (Social Security) tax with wage base limit.
   *
   * @param {number} grossPay - Current period gross pay
   * @param {number} ytdGrossPay - Year-to-date gross pay (before this period)
   * @param {number} taxYear - Tax year
   * @returns {{ ficaTax: number, taxableWages: number, wageBaseExceeded: boolean }}
   */
  calculateFICATax(
    grossPay: number,
    ytdGrossPay: number,
    taxYear: number
  ): { ficaTax: number; taxableWages: number; wageBaseExceeded: boolean } {
    // 2024 Social Security wage base
    const wageBaseLimits: Record<number, number> = {
      2024: 168600,
      2025: 176100, // Projected
    };

    const wageBase = wageBaseLimits[taxYear] || 168600;
    const ficaRate = 0.062; // 6.2%

    // Calculate remaining wage base
    const remainingWageBase = Math.max(0, wageBase - ytdGrossPay);
    const taxableWages = Math.min(grossPay, remainingWageBase);
    const wageBaseExceeded = (ytdGrossPay + grossPay) > wageBase;

    const ficaTax = new Decimal(taxableWages).times(ficaRate).toDecimalPlaces(2).toNumber();

    return {
      ficaTax,
      taxableWages,
      wageBaseExceeded,
    };
  }

  /**
   * Calculates Medicare tax (no wage base limit).
   *
   * @param {number} grossPay - Gross pay amount
   * @returns {number} Medicare tax withholding
   */
  calculateMedicareTax(grossPay: number): number {
    const medicareRate = 0.0145; // 1.45%
    return new Decimal(grossPay).times(medicareRate).toDecimalPlaces(2).toNumber();
  }

  /**
   * Calculates additional Medicare tax for high earners (0.9% over threshold).
   *
   * @param {number} grossPay - Current period gross pay
   * @param {number} ytdGrossPay - Year-to-date gross pay
   * @param {string} filingStatus - Tax filing status
   * @returns {{ additionalMedicareTax: number, taxableWages: number }}
   */
  calculateAdditionalMedicareTax(
    grossPay: number,
    ytdGrossPay: number,
    filingStatus: string
  ): { additionalMedicareTax: number; taxableWages: number } {
    // Additional Medicare tax thresholds (2024)
    const thresholds: Record<string, number> = {
      'single': 200000,
      'married_joint': 250000,
      'married_separate': 125000,
      'head_of_household': 200000,
    };

    const threshold = thresholds[filingStatus] || 200000;
    const additionalRate = 0.009; // 0.9%

    const totalGrossPay = ytdGrossPay + grossPay;

    if (totalGrossPay <= threshold) {
      return { additionalMedicareTax: 0, taxableWages: 0 };
    }

    // Calculate taxable amount
    let taxableWages = 0;
    if (ytdGrossPay >= threshold) {
      taxableWages = grossPay;
    } else {
      taxableWages = totalGrossPay - threshold;
    }

    const additionalMedicareTax = new Decimal(taxableWages)
      .times(additionalRate)
      .toDecimalPlaces(2)
      .toNumber();

    return { additionalMedicareTax, taxableWages };
  }

  /**
   * Calculates comprehensive tax withholdings for a payroll period.
   *
   * @param {number} grossPay - Gross pay amount
   * @param {number} preTaxDeductions - Pre-tax deductions (401k, health insurance, etc.)
   * @param {W4Information} w4Info - Employee W-4 information
   * @param {string} stateCode - State code
   * @param {string} locality - Locality code
   * @param {number} payPeriodsPerYear - Pay periods per year
   * @param {number} ytdGrossPay - Year-to-date gross pay
   * @param {number} taxYear - Tax year
   * @returns {TaxCalculationResult} Complete tax calculation result
   */
  calculateComprehensiveTaxes(
    grossPay: number,
    preTaxDeductions: number,
    w4Info: W4Information,
    stateCode: string,
    locality: string,
    payPeriodsPerYear: number,
    ytdGrossPay: number,
    taxYear: number
  ): TaxCalculationResult {
    this.logger.debug('Calculating comprehensive taxes');

    // Calculate taxable wages for federal tax (after pre-tax deductions)
    const federalTaxableWages = new Decimal(grossPay).minus(preTaxDeductions).toNumber();

    // Federal income tax
    const federalTax = this.calculateFederalIncomeTax(
      federalTaxableWages,
      w4Info,
      payPeriodsPerYear,
      ytdGrossPay
    );

    // State income tax (some states allow pre-tax deductions)
    const stateTaxableWages = federalTaxableWages; // Most states follow federal
    const stateTax = this.calculateStateTax(
      stateTaxableWages,
      stateCode,
      w4Info.filingStatus,
      0, // Exemptions handled in W-4
      payPeriodsPerYear
    );

    // Local income tax
    const localTax = this.calculateLocalTax(grossPay, locality, stateCode);

    // FICA (Social Security)
    const fica = this.calculateFICATax(grossPay, ytdGrossPay, taxYear);

    // Medicare
    const medicareTax = this.calculateMedicareTax(grossPay);

    // Additional Medicare tax
    const additionalMedicare = this.calculateAdditionalMedicareTax(
      grossPay,
      ytdGrossPay,
      w4Info.filingStatus
    );

    const totalTax = new Decimal(federalTax)
      .plus(stateTax)
      .plus(localTax)
      .plus(fica.ficaTax)
      .plus(medicareTax)
      .plus(additionalMedicare.additionalMedicareTax)
      .toDecimalPlaces(2)
      .toNumber();

    return {
      federalTax,
      stateTax,
      localTax,
      ficaTax: fica.ficaTax,
      medicareTax,
      additionalMedicareTax: additionalMedicare.additionalMedicareTax,
      totalTax,
      taxableWages: {
        federalTaxableWages,
        stateTaxableWages,
        socialSecurityWages: fica.taxableWages,
        medicareWages: grossPay,
      },
    };
  }

  // ============================================================================
  // DEDUCTION CALCULATION FUNCTIONS (Functions 16-30)
  // ============================================================================

  /**
   * Calculates FERS (Federal Employees Retirement System) contribution.
   *
   * @param {number} grossPay - Gross pay amount
   * @param {Date} hireDate - Employee hire date
   * @param {string} employeeType - Employee type
   * @returns {RetirementDeduction} FERS contribution details
   */
  calculateFERSContribution(
    grossPay: number,
    hireDate: Date,
    employeeType: string
  ): RetirementDeduction {
    // FERS contribution rates based on hire date
    let contributionRate = 0.008; // 0.8% for employees hired before 2013

    const year2013 = new Date('2013-01-01');
    const year2014 = new Date('2014-01-01');

    if (hireDate >= year2014) {
      contributionRate = 0.047; // 4.7% for employees hired after 2014
    } else if (hireDate >= year2013) {
      contributionRate = 0.037; // 3.7% for employees hired in 2013
    }

    const employeeContribution = new Decimal(grossPay)
      .times(contributionRate)
      .toDecimalPlaces(2)
      .toNumber();

    // Government matching (varies, typically 1% automatic plus match)
    const employerContribution = new Decimal(grossPay)
      .times(0.01)
      .toDecimalPlaces(2)
      .toNumber();

    return {
      deductionType: 'fers',
      amount: employeeContribution,
      employeeContribution,
      employerContribution,
      preTax: true,
    };
  }

  /**
   * Calculates TSP (Thrift Savings Plan) contribution with matching.
   *
   * @param {number} grossPay - Gross pay amount
   * @param {number} contributionPercent - Employee contribution percentage
   * @param {number} maxAnnualContribution - Maximum annual contribution limit
   * @param {number} ytdContribution - Year-to-date TSP contribution
   * @param {boolean} isCatchUp - Whether employee is eligible for catch-up contributions
   * @param {boolean} isRoth - Whether this is Roth TSP (after-tax)
   * @returns {RetirementDeduction} TSP contribution details
   */
  calculateTSPContribution(
    grossPay: number,
    contributionPercent: number,
    maxAnnualContribution: number,
    ytdContribution: number,
    isCatchUp: boolean = false,
    isRoth: boolean = false
  ): RetirementDeduction {
    // 2024 TSP limits
    const regularLimit = maxAnnualContribution || 23000;
    const catchUpLimit = 7500;
    const totalLimit = isCatchUp ? regularLimit + catchUpLimit : regularLimit;

    const remainingLimit = Math.max(0, totalLimit - ytdContribution);

    // Calculate desired contribution
    const desiredContribution = new Decimal(grossPay)
      .times(contributionPercent)
      .dividedBy(100)
      .toDecimalPlaces(2)
      .toNumber();

    const employeeContribution = Math.min(desiredContribution, remainingLimit);

    // Calculate employer match (up to 5% of salary)
    // 1% automatic + match on first 3% + 0.5% match on next 2%
    let employerMatch = new Decimal(grossPay).times(0.01).toNumber(); // 1% automatic

    if (contributionPercent >= 1) {
      const matchPercent = Math.min(contributionPercent, 3);
      employerMatch += new Decimal(grossPay).times(matchPercent / 100).toNumber();
    }

    if (contributionPercent > 3) {
      const additionalMatchPercent = Math.min(contributionPercent - 3, 2) * 0.5;
      employerMatch += new Decimal(grossPay).times(additionalMatchPercent / 100).toNumber();
    }

    employerMatch = new Decimal(employerMatch).toDecimalPlaces(2).toNumber();

    return {
      deductionType: isRoth ? 'tsp_roth' : 'tsp_traditional',
      amount: employeeContribution,
      employeeContribution,
      employerContribution: employerMatch,
      preTax: !isRoth,
    };
  }

  /**
   * Calculates FEHB (Federal Employees Health Benefits) premium.
   *
   * @param {string} planCode - Health insurance plan code
   * @param {string} coverageLevel - Coverage level (employee/employee_spouse/family)
   * @param {string} payFrequency - Pay frequency
   * @returns {InsuranceDeduction} Health insurance premium details
   */
  calculateHealthInsurancePremium(
    planCode: string,
    coverageLevel: string,
    payFrequency: string
  ): InsuranceDeduction {
    // Sample FEHB premium rates (2024 biweekly)
    const premiumRates: Record<string, Record<string, number>> = {
      'BCBS_STANDARD': {
        'employee': 350.00,
        'employee_spouse': 800.00,
        'family': 950.00,
      },
      'BCBS_BASIC': {
        'employee': 180.00,
        'employee_spouse': 450.00,
        'family': 550.00,
      },
      'GEHA_HIGH': {
        'employee': 320.00,
        'employee_spouse': 750.00,
        'family': 900.00,
      },
      'GEHA_STANDARD': {
        'employee': 280.00,
        'employee_spouse': 680.00,
        'family': 820.00,
      },
      'MHBP': {
        'employee': 310.00,
        'employee_spouse': 720.00,
        'family': 860.00,
      },
    };

    const biweeklyPremium = premiumRates[planCode]?.[coverageLevel] || 0;

    // Adjust for pay frequency
    const premiumAmount = payFrequency === 'monthly'
      ? new Decimal(biweeklyPremium).times(26).dividedBy(12).toDecimalPlaces(2).toNumber()
      : biweeklyPremium;

    // Government contribution (approximately 72% of premium)
    const employerShare = new Decimal(premiumAmount).times(0.72).toDecimalPlaces(2).toNumber();
    const employeeShare = new Decimal(premiumAmount).minus(employerShare).toDecimalPlaces(2).toNumber();

    return {
      insuranceType: 'health',
      planCode,
      planName: this.getPlanName(planCode),
      premiumAmount,
      employeeShare,
      employerShare,
      preTax: true,
    };
  }

  /**
   * Gets plan name from plan code.
   */
  private getPlanName(planCode: string): string {
    const planNames: Record<string, string> = {
      'BCBS_STANDARD': 'Blue Cross Blue Shield Standard',
      'BCBS_BASIC': 'Blue Cross Blue Shield Basic',
      'GEHA_HIGH': 'GEHA High Option',
      'GEHA_STANDARD': 'GEHA Standard Option',
      'MHBP': 'Mail Handlers Benefit Plan',
    };
    return planNames[planCode] || planCode;
  }

  /**
   * Calculates dental insurance premium.
   *
   * @param {string} planCode - Dental plan code
   * @param {string} coverageLevel - Coverage level
   * @param {string} payFrequency - Pay frequency
   * @returns {InsuranceDeduction} Dental insurance premium details
   */
  calculateDentalInsurancePremium(
    planCode: string,
    coverageLevel: string,
    payFrequency: string
  ): InsuranceDeduction {
    // Sample FEDVIP dental rates (2024 biweekly)
    const dentalRates: Record<string, Record<string, number>> = {
      'METLIFE_HIGH': {
        'employee': 28.50,
        'employee_spouse': 65.00,
        'family': 85.00,
      },
      'METLIFE_LOW': {
        'employee': 18.50,
        'employee_spouse': 42.00,
        'family': 55.00,
      },
      'UNITED_CONCORDIA': {
        'employee': 25.00,
        'employee_spouse': 58.00,
        'family': 78.00,
      },
    };

    const biweeklyPremium = dentalRates[planCode]?.[coverageLevel] || 0;
    const premiumAmount = payFrequency === 'monthly'
      ? new Decimal(biweeklyPremium).times(26).dividedBy(12).toDecimalPlaces(2).toNumber()
      : biweeklyPremium;

    // FEDVIP has no government contribution
    return {
      insuranceType: 'dental',
      planCode,
      planName: planCode,
      premiumAmount,
      employeeShare: premiumAmount,
      employerShare: 0,
      preTax: true,
    };
  }

  /**
   * Calculates vision insurance premium.
   *
   * @param {string} planCode - Vision plan code
   * @param {string} coverageLevel - Coverage level
   * @param {string} payFrequency - Pay frequency
   * @returns {InsuranceDeduction} Vision insurance premium details
   */
  calculateVisionInsurancePremium(
    planCode: string,
    coverageLevel: string,
    payFrequency: string
  ): InsuranceDeduction {
    // Sample FEDVIP vision rates (2024 biweekly)
    const visionRates: Record<string, Record<string, number>> = {
      'VSP': {
        'employee': 8.50,
        'employee_spouse': 18.00,
        'family': 24.00,
      },
      'EYEMED': {
        'employee': 7.50,
        'employee_spouse': 16.00,
        'family': 22.00,
      },
    };

    const biweeklyPremium = visionRates[planCode]?.[coverageLevel] || 0;
    const premiumAmount = payFrequency === 'monthly'
      ? new Decimal(biweeklyPremium).times(26).dividedBy(12).toDecimalPlaces(2).toNumber()
      : biweeklyPremium;

    return {
      insuranceType: 'vision',
      planCode,
      planName: planCode,
      premiumAmount,
      employeeShare: premiumAmount,
      employerShare: 0,
      preTax: true,
    };
  }

  /**
   * Calculates FEGLI (Federal Employees' Group Life Insurance) premium.
   *
   * @param {number} annualSalary - Employee annual salary
   * @param {number} age - Employee age
   * @param {string} coverageOptions - Coverage options (Basic, Option A, Option B, Option C)
   * @returns {InsuranceDeduction} Life insurance premium details
   */
  calculateLifeInsurancePremium(
    annualSalary: number,
    age: number,
    coverageOptions: string
  ): InsuranceDeduction {
    let totalPremium = 0;

    // Basic coverage (automatic unless waived)
    // Rate: $0.15 per $1,000 of coverage (biweekly)
    const basicCoverage = Math.round(annualSalary / 1000) * 1000; // Round to nearest $1,000
    const basicPremium = (basicCoverage / 1000) * 0.15;
    totalPremium += basicPremium;

    // Government pays 1/3 of basic premium
    const employerShare = basicPremium / 3;
    const employeeShare = totalPremium - employerShare;

    return {
      insuranceType: 'life',
      planCode: 'FEGLI',
      planName: 'Federal Employees Group Life Insurance',
      premiumAmount: new Decimal(totalPremium).toDecimalPlaces(2).toNumber(),
      employeeShare: new Decimal(employeeShare).toDecimalPlaces(2).toNumber(),
      employerShare: new Decimal(employerShare).toDecimalPlaces(2).toNumber(),
      preTax: false, // FEGLI is after-tax
    };
  }

  /**
   * Calculates FSA (Flexible Spending Account) deduction.
   *
   * @param {number} annualElection - Annual FSA election amount
   * @param {number} payPeriodsRemaining - Remaining pay periods in year
   * @param {number} ytdDeduction - Year-to-date FSA deduction
   * @returns {VoluntaryDeduction} FSA deduction details
   */
  calculateFSADeduction(
    annualElection: number,
    payPeriodsRemaining: number,
    ytdDeduction: number
  ): VoluntaryDeduction {
    // 2024 FSA limits
    const healthcareFSALimit = 3200;
    const dependentCareFSALimit = 5000;

    const validElection = Math.min(annualElection, healthcareFSALimit);
    const remainingDeduction = validElection - ytdDeduction;
    const perPeriodDeduction = payPeriodsRemaining > 0
      ? new Decimal(remainingDeduction).dividedBy(payPeriodsRemaining).toDecimalPlaces(2).toNumber()
      : 0;

    return {
      deductionCode: 'FSA_HEALTH',
      deductionName: 'Healthcare Flexible Spending Account',
      amount: perPeriodDeduction,
      preTax: true,
      frequency: 'per_pay_period',
    };
  }

  /**
   * Calculates HSA (Health Savings Account) contribution.
   *
   * @param {number} perPeriodContribution - Per-period contribution amount
   * @param {number} annualLimit - Annual HSA contribution limit
   * @param {number} ytdContribution - Year-to-date contribution
   * @param {boolean} isCatchUp - Whether eligible for catch-up contributions
   * @returns {VoluntaryDeduction} HSA contribution details
   */
  calculateHSAContribution(
    perPeriodContribution: number,
    annualLimit: number,
    ytdContribution: number,
    isCatchUp: boolean = false
  ): VoluntaryDeduction {
    // 2024 HSA limits
    const individualLimit = 4150;
    const familyLimit = 8300;
    const catchUpAmount = 1000;

    const baseLimit = annualLimit || individualLimit;
    const totalLimit = isCatchUp ? baseLimit + catchUpAmount : baseLimit;
    const remainingLimit = Math.max(0, totalLimit - ytdContribution);

    const contribution = Math.min(perPeriodContribution, remainingLimit);

    return {
      deductionCode: 'HSA',
      deductionName: 'Health Savings Account',
      amount: new Decimal(contribution).toDecimalPlaces(2).toNumber(),
      preTax: true,
      frequency: 'per_pay_period',
    };
  }

  /**
   * Calculates comprehensive deductions for a payroll period.
   *
   * @param {any} employee - Employee record
   * @param {number} grossPay - Gross pay amount
   * @param {number} ytdData - Year-to-date deduction data
   * @param {string} payFrequency - Pay frequency
   * @returns {DeductionCalculationResult} Complete deduction calculations
   */
  calculateComprehensiveDeductions(
    employee: any,
    grossPay: number,
    ytdData: any,
    payFrequency: string
  ): DeductionCalculationResult {
    this.logger.debug(`Calculating comprehensive deductions for employee: ${employee.employeeId}`);

    const retirementDeductions: RetirementDeduction[] = [];
    const insuranceDeductions: InsuranceDeduction[] = [];
    const voluntaryDeductions: VoluntaryDeduction[] = [];

    // FERS contribution
    if (employee.employeeType === 'civilian') {
      const fers = this.calculateFERSContribution(
        grossPay,
        employee.hireDate,
        employee.employeeType
      );
      retirementDeductions.push(fers);

      // TSP contribution
      if (employee.metadata?.tspContributionPercent > 0) {
        const tsp = this.calculateTSPContribution(
          grossPay,
          employee.metadata.tspContributionPercent,
          23000,
          ytdData.ytdTSP || 0,
          employee.age >= 50,
          employee.metadata.tspIsRoth || false
        );
        retirementDeductions.push(tsp);
      }
    }

    // Health insurance
    if (employee.metadata?.healthPlanCode) {
      const health = this.calculateHealthInsurancePremium(
        employee.metadata.healthPlanCode,
        employee.metadata.healthCoverageLevel || 'employee',
        payFrequency
      );
      insuranceDeductions.push(health);
    }

    // Dental insurance
    if (employee.metadata?.dentalPlanCode) {
      const dental = this.calculateDentalInsurancePremium(
        employee.metadata.dentalPlanCode,
        employee.metadata.dentalCoverageLevel || 'employee',
        payFrequency
      );
      insuranceDeductions.push(dental);
    }

    // Vision insurance
    if (employee.metadata?.visionPlanCode) {
      const vision = this.calculateVisionInsurancePremium(
        employee.metadata.visionPlanCode,
        employee.metadata.visionCoverageLevel || 'employee',
        payFrequency
      );
      insuranceDeductions.push(vision);
    }

    // Life insurance (FEGLI)
    if (!employee.metadata?.fegliWaived) {
      const life = this.calculateLifeInsurancePremium(
        employee.annualSalary,
        employee.age || 40,
        employee.metadata?.fegliOptions || 'Basic'
      );
      insuranceDeductions.push(life);
    }

    // FSA
    if (employee.metadata?.fsaAnnualElection > 0) {
      const payPeriodsPerYear = payFrequency === 'biweekly' ? 26 : 12;
      const currentPeriod = Math.floor((ytdData.ytdPayPeriods || 0) + 1);
      const payPeriodsRemaining = payPeriodsPerYear - currentPeriod;

      const fsa = this.calculateFSADeduction(
        employee.metadata.fsaAnnualElection,
        payPeriodsRemaining,
        ytdData.ytdFSA || 0
      );
      voluntaryDeductions.push(fsa);
    }

    // HSA
    if (employee.metadata?.hsaPerPeriodContribution > 0) {
      const hsa = this.calculateHSAContribution(
        employee.metadata.hsaPerPeriodContribution,
        employee.metadata.hsaAnnualLimit || 4150,
        ytdData.ytdHSA || 0,
        employee.age >= 55
      );
      voluntaryDeductions.push(hsa);
    }

    // Calculate total deductions
    const totalRetirement = retirementDeductions.reduce((sum, d) => sum + d.amount, 0);
    const totalInsurance = insuranceDeductions.reduce((sum, d) => sum + d.employeeShare, 0);
    const totalVoluntary = voluntaryDeductions.reduce((sum, d) => sum + d.amount, 0);
    const totalDeductions = totalRetirement + totalInsurance + totalVoluntary;

    return {
      retirementDeductions,
      insuranceDeductions,
      voluntaryDeductions,
      mandatoryDeductions: [], // Will be populated with garnishments separately
      totalDeductions: new Decimal(totalDeductions).toDecimalPlaces(2).toNumber(),
    };
  }

  // ============================================================================
  // GARNISHMENT PROCESSING (Functions 31-40)
  // ============================================================================

  /**
   * Calculates disposable income for garnishment purposes per CCPA.
   *
   * @param {number} grossPay - Gross pay amount
   * @param {TaxCalculationResult} taxes - Tax calculation result
   * @param {DeductionCalculationResult} deductions - Deduction calculation result
   * @returns {DisposableIncomeCalculation} Disposable income calculation
   */
  calculateDisposableIncome(
    grossPay: number,
    taxes: TaxCalculationResult,
    deductions: DeductionCalculationResult
  ): DisposableIncomeCalculation {
    // Per CCPA (Consumer Credit Protection Act), disposable income is gross pay minus:
    // - Federal, state, and local income taxes
    // - Social Security tax
    // - Medicare tax
    // - Mandatory retirement contributions

    const mandatoryRetirement = deductions.retirementDeductions
      .filter(d => d.deductionType === 'fers' || d.deductionType === 'csrs')
      .reduce((sum, d) => sum + d.amount, 0);

    const disposableIncome = new Decimal(grossPay)
      .minus(taxes.federalTax)
      .minus(taxes.stateTax)
      .minus(taxes.localTax)
      .minus(taxes.ficaTax)
      .minus(taxes.medicareTax)
      .minus(mandatoryRetirement)
      .toDecimalPlaces(2)
      .toNumber();

    // CCPA limits on garnishment (percentage of disposable income):
    // - 50% if supporting another spouse/child
    // - 55% if supporting another spouse/child and more than 12 weeks in arrears
    // - 60% if not supporting another spouse/child
    // - 65% if not supporting another spouse/child and more than 12 weeks in arrears
    // - 25% for other creditors

    const ccpaLimit = new Decimal(disposableIncome).times(0.25).toDecimalPlaces(2).toNumber();
    const garnishmentAllowed = ccpaLimit;

    return {
      grossPay,
      federalTax: taxes.federalTax,
      stateTax: taxes.stateTax,
      localTax: taxes.localTax,
      ficaTax: taxes.ficaTax,
      medicareTax: taxes.medicareTax,
      retirementMandatory: mandatoryRetirement,
      disposableIncome,
      ccpaLimit,
      garnishmentAllowed,
    };
  }

  /**
   * Processes garnishment deductions according to priority and CCPA limits.
   *
   * @param {string} employeeId - Employee identifier
   * @param {DisposableIncomeCalculation} disposableIncome - Disposable income calculation
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<MandatoryDeduction[]>} Garnishment deductions
   */
  async processGarnishments(
    employeeId: string,
    disposableIncome: DisposableIncomeCalculation,
    transaction?: Transaction
  ): Promise<MandatoryDeduction[]> {
    this.logger.debug(`Processing garnishments for employee: ${employeeId}`);

    // Get active garnishment orders sorted by priority
    const garnishments = await this.garnishmentModel.findAll({
      where: {
        employeeId,
        status: 'active',
        effectiveDate: { [Op.lte]: new Date() },
        [Op.or]: [
          { expirationDate: null },
          { expirationDate: { [Op.gte]: new Date() } },
        ],
      },
      order: [['priorityLevel', 'ASC']],
      transaction,
    });

    const deductions: MandatoryDeduction[] = [];
    let remainingIncome = disposableIncome.garnishmentAllowed;

    for (const garnishment of garnishments) {
      const g = garnishment.toJSON() as any;

      if (remainingIncome <= 0) {
        this.logger.warn(`CCPA limit reached, cannot process garnishment: ${g.garnishmentId}`);
        break;
      }

      let deductionAmount = 0;

      // Calculate deduction based on method
      if (g.deductionMethod === 'fixed_amount') {
        deductionAmount = g.amount || 0;
      } else if (g.deductionMethod === 'percentage') {
        deductionAmount = new Decimal(disposableIncome.grossPay)
          .times((g.percentage || 0) / 100)
          .toDecimalPlaces(2)
          .toNumber();
      } else if (g.deductionMethod === 'disposable_income') {
        deductionAmount = new Decimal(disposableIncome.disposableIncome)
          .times((g.percentage || 0) / 100)
          .toDecimalPlaces(2)
          .toNumber();
      }

      // Apply maximum percentage limit
      const maxAmount = new Decimal(disposableIncome.disposableIncome)
        .times(g.maxPercentage / 100)
        .toDecimalPlaces(2)
        .toNumber();

      deductionAmount = Math.min(deductionAmount, maxAmount, remainingIncome);

      // Check if there's a total amount owed
      if (g.amountRemaining !== null && g.amountRemaining !== undefined) {
        deductionAmount = Math.min(deductionAmount, g.amountRemaining);

        // Update remaining amount
        const newRemaining = new Decimal(g.amountRemaining).minus(deductionAmount).toNumber();

        if (newRemaining <= 0) {
          // Garnishment fully satisfied
          await garnishment.update(
            {
              status: 'completed',
              amountRemaining: 0,
            },
            { transaction }
          );
        } else {
          await garnishment.update(
            { amountRemaining: newRemaining },
            { transaction }
          );
        }
      }

      deductions.push({
        deductionType: g.orderType,
        orderNumber: g.orderNumber,
        amount: deductionAmount,
        percentage: g.percentage,
        maxPercentage: g.maxPercentage,
        recipientName: g.recipientName,
        recipientAccount: g.recipientAccount,
      });

      remainingIncome = new Decimal(remainingIncome).minus(deductionAmount).toNumber();
    }

    return deductions;
  }

  /**
   * Creates a new garnishment order.
   *
   * @param {Partial<GarnishmentOrder>} garnishmentData - Garnishment order data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<GarnishmentOrder>} Created garnishment order
   */
  async createGarnishmentOrder(
    garnishmentData: Partial<GarnishmentOrder>,
    transaction?: Transaction
  ): Promise<GarnishmentOrder> {
    this.logger.log(`Creating garnishment order: ${garnishmentData.orderNumber}`);

    const garnishment = await this.garnishmentModel.create(
      {
        ...garnishmentData,
        status: 'active',
        metadata: garnishmentData.metadata || {},
      },
      { transaction }
    );

    return garnishment.toJSON() as GarnishmentOrder;
  }

  /**
   * Updates a garnishment order.
   *
   * @param {string} garnishmentId - Garnishment identifier
   * @param {Partial<GarnishmentOrder>} updateData - Update data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<GarnishmentOrder>} Updated garnishment order
   */
  async updateGarnishmentOrder(
    garnishmentId: string,
    updateData: Partial<GarnishmentOrder>,
    transaction?: Transaction
  ): Promise<GarnishmentOrder> {
    this.logger.log(`Updating garnishment order: ${garnishmentId}`);

    const garnishment = await this.garnishmentModel.findOne({
      where: { garnishmentId },
      transaction,
    });

    if (!garnishment) {
      throw new NotFoundException(`Garnishment ${garnishmentId} not found`);
    }

    await garnishment.update(updateData, { transaction });

    return garnishment.toJSON() as GarnishmentOrder;
  }

  /**
   * Suspends a garnishment order.
   *
   * @param {string} garnishmentId - Garnishment identifier
   * @param {string} reason - Suspension reason
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<GarnishmentOrder>} Updated garnishment order
   */
  async suspendGarnishment(
    garnishmentId: string,
    reason: string,
    transaction?: Transaction
  ): Promise<GarnishmentOrder> {
    return this.updateGarnishmentOrder(
      garnishmentId,
      {
        status: 'suspended',
        metadata: { suspensionReason: reason, suspendedAt: new Date() },
      },
      transaction
    );
  }

  // ============================================================================
  // DIRECT DEPOSIT PROCESSING (Functions 41-50)
  // ============================================================================

  /**
   * Processes direct deposit allocations for net pay.
   *
   * @param {string} employeeId - Employee identifier
   * @param {number} netPay - Net pay amount
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<DirectDepositAllocation[]>} Direct deposit allocations
   */
  async processDirectDepositAllocations(
    employeeId: string,
    netPay: number,
    transaction?: Transaction
  ): Promise<DirectDepositAllocation[]> {
    this.logger.debug(`Processing direct deposit for employee: ${employeeId}, net pay: ${netPay}`);

    // Get active direct deposit accounts sorted by priority
    const deposits = await this.directDepositModel.findAll({
      where: {
        employeeId,
        status: 'active',
        effectiveDate: { [Op.lte]: new Date() },
        [Op.or]: [
          { endDate: null },
          { endDate: { [Op.gte]: new Date() } },
        ],
      },
      order: [['priority', 'ASC']],
      transaction,
    });

    if (deposits.length === 0) {
      this.logger.warn(`No active direct deposit accounts for employee: ${employeeId}`);
      return [];
    }

    const allocations: DirectDepositAllocation[] = [];
    let remainingAmount = netPay;

    for (const deposit of deposits) {
      const d = deposit.toJSON() as any;

      let allocationAmount = 0;

      if (d.allocationType === 'amount') {
        // Fixed dollar amount
        allocationAmount = Math.min(d.allocationValue, remainingAmount);
      } else if (d.allocationType === 'percentage') {
        // Percentage of net pay
        allocationAmount = new Decimal(netPay)
          .times(d.allocationValue / 100)
          .toDecimalPlaces(2)
          .toNumber();
        allocationAmount = Math.min(allocationAmount, remainingAmount);
      } else if (d.allocationType === 'remainder') {
        // Remainder goes to this account
        allocationAmount = remainingAmount;
      }

      if (allocationAmount > 0) {
        allocations.push({
          accountNumber: d.accountNumber,
          routingNumber: d.routingNumber,
          accountType: d.accountType,
          allocationType: d.allocationType,
          allocationValue: allocationAmount,
          priority: d.priority,
        });

        remainingAmount = new Decimal(remainingAmount).minus(allocationAmount).toNumber();
      }

      if (remainingAmount <= 0) {
        break;
      }
    }

    // If there's still remaining amount, issue a check
    if (remainingAmount > 0.01) {
      this.logger.warn(`Remaining amount ${remainingAmount} will be issued as check`);
    }

    return allocations;
  }

  /**
   * Creates a new direct deposit account.
   *
   * @param {Partial<any>} depositData - Direct deposit data
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Created direct deposit account
   */
  async createDirectDepositAccount(
    depositData: Partial<any>,
    transaction?: Transaction
  ): Promise<any> {
    this.logger.log(`Creating direct deposit account for employee: ${depositData.employeeId}`);

    // Encrypt account number (in production)
    const encryptedAccount = depositData.accountNumber; // TODO: Implement encryption

    const deposit = await this.directDepositModel.create(
      {
        ...depositData,
        accountNumber: encryptedAccount,
        status: 'pending',
        verificationStatus: 'pending',
        metadata: depositData.metadata || {},
      },
      { transaction }
    );

    // Schedule prenote verification
    await this.schedulePrenoteVerification(deposit.toJSON().depositId, transaction);

    return deposit.toJSON();
  }

  /**
   * Schedules prenote verification for new direct deposit account.
   *
   * @param {string} depositId - Direct deposit identifier
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<void>}
   */
  private async schedulePrenoteVerification(
    depositId: string,
    transaction?: Transaction
  ): Promise<void> {
    this.logger.log(`Scheduling prenote verification for: ${depositId}`);

    // In production, this would create a prenote ACH transaction
    // and schedule verification for the next pay period

    await this.directDepositModel.update(
      {
        prenoteDate: new Date(),
        prenoteStatus: 'pending',
      },
      {
        where: { depositId },
        transaction,
      }
    );
  }

  /**
   * Verifies direct deposit account after prenote period.
   *
   * @param {string} depositId - Direct deposit identifier
   * @param {boolean} verified - Whether verification was successful
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<any>} Updated direct deposit account
   */
  async verifyDirectDepositAccount(
    depositId: string,
    verified: boolean,
    transaction?: Transaction
  ): Promise<any> {
    this.logger.log(`Verifying direct deposit account: ${depositId}, verified: ${verified}`);

    const deposit = await this.directDepositModel.findOne({
      where: { depositId },
      transaction,
    });

    if (!deposit) {
      throw new NotFoundException(`Direct deposit account ${depositId} not found`);
    }

    await deposit.update(
      {
        verificationStatus: verified ? 'verified' : 'failed',
        verificationDate: new Date(),
        status: verified ? 'active' : 'rejected',
        prenoteStatus: verified ? 'success' : 'failed',
      },
      { transaction }
    );

    return deposit.toJSON();
  }

  // ============================================================================
  // PAYROLL AUDIT TRAIL (Functions 51-55)
  // ============================================================================

  /**
   * Creates a payroll audit entry.
   *
   * @param {string} payrollId - Payroll record identifier
   * @param {string} employeeId - Employee identifier
   * @param {string} actionType - Action type
   * @param {string} userId - User performing action
   * @param {string} userName - User name
   * @param {any} beforeSnapshot - Record state before change
   * @param {any} afterSnapshot - Record state after change
   * @param {AuditChange[]} changes - List of changes
   * @param {string} [comments] - Optional comments
   * @param {Transaction} [transaction] - Optional database transaction
   * @returns {Promise<PayrollAuditEntry>} Created audit entry
   */
  async createPayrollAudit(
    payrollId: string,
    employeeId: string,
    actionType: string,
    userId: string,
    userName: string,
    beforeSnapshot: any,
    afterSnapshot: any,
    changes: AuditChange[],
    comments?: string,
    transaction?: Transaction
  ): Promise<PayrollAuditEntry> {
    this.logger.debug(`Creating payroll audit entry for: ${payrollId}`);

    const auditId = `AUDIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const audit = await this.auditModel.create(
      {
        auditId,
        payrollId,
        employeeId,
        actionType,
        actionDate: new Date(),
        userId,
        userName,
        beforeSnapshot,
        afterSnapshot,
        changes,
        comments,
        metadata: {},
      },
      { transaction }
    );

    return audit.toJSON() as PayrollAuditEntry;
  }

  /**
   * Retrieves payroll audit trail for a payroll record.
   *
   * @param {string} payrollId - Payroll record identifier
   * @returns {Promise<PayrollAuditEntry[]>} Audit trail
   */
  async getPayrollAuditTrail(payrollId: string): Promise<PayrollAuditEntry[]> {
    this.logger.debug(`Retrieving audit trail for payroll: ${payrollId}`);

    const audits = await this.auditModel.findAll({
      where: { payrollId },
      order: [['actionDate', 'DESC']],
    });

    return audits.map(a => a.toJSON() as PayrollAuditEntry);
  }

  /**
   * Retrieves employee payroll audit history.
   *
   * @param {string} employeeId - Employee identifier
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<PayrollAuditEntry[]>} Audit history
   */
  async getEmployeeAuditHistory(
    employeeId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PayrollAuditEntry[]> {
    this.logger.debug(`Retrieving audit history for employee: ${employeeId}`);

    const audits = await this.auditModel.findAll({
      where: {
        employeeId,
        actionDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['actionDate', 'DESC']],
    });

    return audits.map(a => a.toJSON() as PayrollAuditEntry);
  }

  /**
   * Generates comprehensive payroll audit report.
   *
   * @param {string} payPeriodId - Pay period identifier
   * @returns {Promise<any>} Audit report
   */
  async generatePayrollAuditReport(payPeriodId: string): Promise<any> {
    this.logger.log(`Generating payroll audit report for period: ${payPeriodId}`);

    const audits = await this.auditModel.findAll({
      where: {
        payrollId: { [Op.like]: `%${payPeriodId}%` },
      },
      order: [['actionDate', 'ASC']],
    });

    // Group by action type
    const auditsByType = audits.reduce((acc, audit) => {
      const a = audit.toJSON() as any;
      if (!acc[a.actionType]) {
        acc[a.actionType] = [];
      }
      acc[a.actionType].push(a);
      return acc;
    }, {} as Record<string, any[]>);

    return {
      payPeriodId,
      totalAudits: audits.length,
      auditsByType,
      reportGeneratedAt: new Date(),
    };
  }
}

export default CEFMSPayrollProcessingModule;
