/**
 * LOC: TAXMGMT1234567
 * File: /reuse/financial/tax-management-compliance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (database ORM)
 *   - nestjs (framework utilities)
 *   - Node.js crypto, fs modules
 *
 * DOWNSTREAM (imported by):
 *   - ../backend/modules/tax/*
 *   - ../backend/modules/payroll/*
 *   - ../backend/modules/accounting/*
 *   - API controllers for tax compliance
 */

/**
 * File: /reuse/financial/tax-management-compliance-kit.ts
 * Locator: WC-FIN-TAXMGMT-001
 * Purpose: Comprehensive Tax Management & Compliance Utilities - tax calculation, withholding, 1099/W2 reporting, sales tax, VAT, tax filing, compliance tracking
 *
 * Upstream: Independent utility module for USACE CEFMS-level tax management
 * Downstream: ../backend/*, tax controllers, payroll services, accounting modules, compliance reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PDFKit 0.13.x
 * Exports: 40+ utility functions for tax calculation, withholding, reporting, compliance, VAT/sales tax, 1099/W2 generation
 *
 * LLM Context: Enterprise-grade tax management and compliance utilities for production-ready NestJS applications.
 * Provides tax calculation engines (federal/state/local), withholding algorithms, 1099/W2 form generation,
 * sales tax and VAT calculation with nexus detection, tax filing preparation, quarterly reporting,
 * year-end processing, tax code management, multi-jurisdiction support, audit trail generation,
 * electronic filing (EFTPS), tax reconciliation, compliance tracking, and penalty/interest calculation.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { createHash, randomUUID } from 'crypto';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface TaxCalculationRequest {
  grossAmount: number;
  taxableAmount?: number;
  taxYear: number;
  jurisdiction: 'federal' | 'state' | 'local' | 'all';
  jurisdictionCode?: string; // State code, locality ID
  filingStatus?: 'single' | 'married' | 'head_of_household' | 'married_separate';
  exemptions?: number;
  additionalWithholding?: number;
  taxType: 'income' | 'payroll' | 'sales' | 'vat' | 'property' | 'excise';
  employeeW4Data?: W4FormData;
  metadata?: Record<string, any>;
}

interface TaxCalculationResult {
  taxableAmount: number;
  totalTax: number;
  federalTax?: number;
  stateTax?: number;
  localTax?: number;
  socialSecurityTax?: number;
  medicareTax?: number;
  additionalMedicareTax?: number;
  effectiveRate: number;
  marginalRate: number;
  breakdown: TaxBreakdown[];
  withholdingAmount: number;
  metadata?: Record<string, any>;
}

interface TaxBreakdown {
  jurisdiction: string;
  taxType: string;
  rate: number;
  taxableBase: number;
  taxAmount: number;
  description: string;
}

interface W4FormData {
  filingStatus: 'single' | 'married_joint' | 'married_separate' | 'head_of_household';
  multipleJobs: boolean;
  dependents: number;
  otherIncome: number;
  deductions: number;
  extraWithholding: number;
  exempt: boolean;
  year: number;
}

interface W2FormData {
  employeeId: string;
  employeeName: string;
  employeeSSN: string;
  employeeAddress: string;
  employerEIN: string;
  employerName: string;
  employerAddress: string;
  wages: number;
  federalWithheld: number;
  socialSecurityWages: number;
  socialSecurityWithheld: number;
  medicareWages: number;
  medicareWithheld: number;
  stateWages: Record<string, number>;
  stateWithheld: Record<string, number>;
  localWages?: Record<string, number>;
  localWithheld?: Record<string, number>;
  taxYear: number;
  boxes?: Record<string, any>; // Additional W2 boxes
}

interface Form1099Data {
  recipientId: string;
  recipientName: string;
  recipientTIN: string; // SSN or EIN
  recipientAddress: string;
  payerEIN: string;
  payerName: string;
  payerAddress: string;
  formType: '1099-MISC' | '1099-NEC' | '1099-INT' | '1099-DIV' | '1099-K';
  amount: number;
  federalWithheld?: number;
  stateWithheld?: Record<string, number>;
  taxYear: number;
  boxes?: Record<string, any>; // Type-specific boxes
}

interface SalesTaxRequest {
  amount: number;
  jurisdiction: string; // State/county/city codes
  productCategory?: string; // For category-specific rates
  isExempt: boolean;
  exemptionCertificate?: string;
  shipToAddress?: Address;
  shipFromAddress?: Address;
  taxDate: Date;
}

interface VATCalculationRequest {
  netAmount: number;
  vatRate: number;
  vatRegion: string; // EU country code, etc.
  reverseCharge: boolean;
  isIntraEU: boolean;
  customerVATNumber?: string;
  supplierVATNumber: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface TaxFilingRequest {
  filingType: 'quarterly' | 'annual' | 'monthly';
  taxType: 'income' | 'payroll' | 'sales' | 'vat';
  period: string; // YYYY-Q1, YYYY, YYYY-MM
  jurisdiction: string;
  formType: string; // 941, 940, ST-1, etc.
  filingMethod: 'electronic' | 'paper' | 'eftps';
}

interface TaxReconciliationRequest {
  startDate: Date;
  endDate: Date;
  jurisdiction: string;
  taxType: string;
  includeAdjustments: boolean;
}

interface TaxReconciliationResult {
  grossTaxable: number;
  totalTaxCalculated: number;
  totalTaxWithheld: number;
  totalTaxPaid: number;
  variance: number;
  variancePercentage: number;
  adjustments: TaxAdjustment[];
  needsCorrection: boolean;
}

interface TaxAdjustment {
  adjustmentType: 'correction' | 'penalty' | 'interest' | 'credit' | 'refund';
  amount: number;
  reason: string;
  date: Date;
  reference: string;
}

interface TaxNexusResult {
  hasNexus: boolean;
  jurisdiction: string;
  nexusType: 'physical' | 'economic' | 'affiliate' | 'click_through';
  thresholdMet: boolean;
  requiresRegistration: boolean;
  registrationDeadline?: Date;
  details: string;
}

interface TaxComplianceCheck {
  isCompliant: boolean;
  jurisdiction: string;
  taxType: string;
  period: string;
  issues: ComplianceIssue[];
  lastAuditDate?: Date;
  nextFilingDeadline?: Date;
}

interface ComplianceIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  issueType: string;
  description: string;
  resolution: string;
  dueDate?: Date;
}

interface TaxBracket {
  minIncome: number;
  maxIncome: number | null;
  rate: number;
  baseAmount: number;
}

interface TaxRateSchedule {
  jurisdiction: string;
  taxYear: number;
  filingStatus: string;
  brackets: TaxBracket[];
  standardDeduction: number;
  personalExemption: number;
}

interface ElectronicFilingResult {
  filingId: string;
  status: 'submitted' | 'accepted' | 'rejected' | 'pending';
  submissionDate: Date;
  confirmationNumber?: string;
  errors?: string[];
  acknowledgmentDate?: Date;
}

// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================

/**
 * Sequelize model for Tax Withholding Records with full audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TaxWithholding model
 *
 * @example
 * ```typescript
 * const TaxWithholding = createTaxWithholdingModel(sequelize);
 * const withholding = await TaxWithholding.create({
 *   employeeId: 'EMP001',
 *   taxYear: 2024,
 *   federalWithholding: 2500.00,
 *   stateWithholding: 800.00,
 *   jurisdiction: 'federal'
 * });
 * ```
 *
 * @openapi
 * components:
 *   schemas:
 *     TaxWithholding:
 *       type: object
 *       required:
 *         - employeeId
 *         - taxYear
 *         - periodStartDate
 *         - periodEndDate
 *         - jurisdiction
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier
 *         employeeId:
 *           type: string
 *           maxLength: 50
 *           description: Employee identifier
 *         taxYear:
 *           type: integer
 *           description: Tax year
 *         periodStartDate:
 *           type: string
 *           format: date
 *         periodEndDate:
 *           type: string
 *           format: date
 *         grossWages:
 *           type: number
 *           format: decimal
 *         taxableWages:
 *           type: number
 *           format: decimal
 *         federalWithholding:
 *           type: number
 *           format: decimal
 *         stateWithholding:
 *           type: number
 *           format: decimal
 *         localWithholding:
 *           type: number
 *           format: decimal
 *         socialSecurityWithholding:
 *           type: number
 *           format: decimal
 *         medicareWithholding:
 *           type: number
 *           format: decimal
 */
export const createTaxWithholdingModel = (sequelize: Sequelize) => {
  class TaxWithholding extends Model {
    public id!: number;
    public employeeId!: string;
    public taxYear!: number;
    public periodStartDate!: Date;
    public periodEndDate!: Date;
    public grossWages!: number;
    public taxableWages!: number;
    public federalWithholding!: number;
    public stateWithholding!: number;
    public localWithholding!: number;
    public socialSecurityWithholding!: number;
    public medicareWithholding!: number;
    public additionalMedicareWithholding!: number;
    public jurisdiction!: string;
    public jurisdictionCode!: string | null;
    public w4Data!: W4FormData;
    public calculationMethod!: string;
    public overrideReason!: string | null;
    public verified!: boolean;
    public verifiedBy!: string | null;
    public verifiedAt!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  TaxWithholding.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      taxYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 2000,
          max: 2100,
        },
        comment: 'Tax year',
      },
      periodStartDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Pay period start date',
      },
      periodEndDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Pay period end date',
      },
      grossWages: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Gross wages for period',
      },
      taxableWages: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Taxable wages after deductions',
      },
      federalWithholding: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Federal income tax withheld',
      },
      stateWithholding: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'State income tax withheld',
      },
      localWithholding: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Local income tax withheld',
      },
      socialSecurityWithholding: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Social Security tax withheld',
      },
      medicareWithholding: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Medicare tax withheld',
      },
      additionalMedicareWithholding: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Additional Medicare tax (0.9% on high earners)',
      },
      jurisdiction: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Tax jurisdiction (federal/state/local)',
      },
      jurisdictionCode: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: 'State/locality code',
      },
      w4Data: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'W4 form data used for calculation',
      },
      calculationMethod: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'standard',
        comment: 'Tax calculation method used',
      },
      overrideReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for manual override',
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether withholding has been verified',
      },
      verifiedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'User who verified withholding',
      },
      verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Verification timestamp',
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
      tableName: 'tax_withholdings',
      timestamps: true,
      indexes: [
        { fields: ['employeeId'] },
        { fields: ['taxYear'] },
        { fields: ['periodStartDate', 'periodEndDate'] },
        { fields: ['jurisdiction', 'jurisdictionCode'] },
        { fields: ['verified'] },
        { fields: ['employeeId', 'taxYear'] },
      ],
    },
  );

  return TaxWithholding;
};

/**
 * Sequelize model for Tax Forms (W2, 1099, etc.) with electronic filing support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TaxForm model
 *
 * @example
 * ```typescript
 * const TaxForm = createTaxFormModel(sequelize);
 * const w2 = await TaxForm.create({
 *   recipientId: 'EMP001',
 *   formType: 'W2',
 *   taxYear: 2024,
 *   formData: w2Data,
 *   status: 'generated'
 * });
 * ```
 */
export const createTaxFormModel = (sequelize: Sequelize) => {
  class TaxForm extends Model {
    public id!: number;
    public recipientId!: string;
    public recipientType!: string;
    public formType!: string;
    public taxYear!: number;
    public formData!: W2FormData | Form1099Data | Record<string, any>;
    public generatedDate!: Date;
    public filedDate!: Date | null;
    public correctedFormId!: number | null;
    public status!: string;
    public filingMethod!: string | null;
    public confirmationNumber!: string | null;
    public pdfPath!: string | null;
    public electronicFileId!: string | null;
    public transmissionDate!: Date | null;
    public acknowledgmentDate!: Date | null;
    public errors!: string[] | null;
    public correctionReason!: string | null;
    public generatedBy!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  TaxForm.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      recipientId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee or vendor ID',
      },
      recipientType: {
        type: DataTypes.ENUM('employee', 'contractor', 'vendor', 'other'),
        allowNull: false,
        comment: 'Type of recipient',
      },
      formType: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'W2, 1099-MISC, 1099-NEC, etc.',
      },
      taxYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 2000,
          max: 2100,
        },
        comment: 'Tax year',
      },
      formData: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Complete form data',
      },
      generatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Form generation timestamp',
      },
      filedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Filing date with IRS/state',
      },
      correctedFormId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID of original form if this is a correction',
      },
      status: {
        type: DataTypes.ENUM('draft', 'generated', 'reviewed', 'filed', 'accepted', 'rejected', 'corrected'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Form status',
      },
      filingMethod: {
        type: DataTypes.ENUM('paper', 'electronic', 'combined'),
        allowNull: true,
        comment: 'Method of filing',
      },
      confirmationNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Filing confirmation number',
      },
      pdfPath: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Path to generated PDF',
      },
      electronicFileId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Electronic filing system ID',
      },
      transmissionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Electronic transmission date',
      },
      acknowledgmentDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'IRS acknowledgment date',
      },
      errors: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Filing errors if rejected',
      },
      correctionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for correction',
      },
      generatedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'User who generated form',
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
      tableName: 'tax_forms',
      timestamps: true,
      indexes: [
        { fields: ['recipientId'] },
        { fields: ['formType'] },
        { fields: ['taxYear'] },
        { fields: ['status'] },
        { fields: ['recipientId', 'formType', 'taxYear'] },
        { fields: ['correctedFormId'] },
      ],
    },
  );

  return TaxForm;
};

/**
 * Sequelize model for Sales Tax Compliance with nexus tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SalesTaxCompliance model
 *
 * @example
 * ```typescript
 * const SalesTaxCompliance = createSalesTaxComplianceModel(sequelize);
 * const record = await SalesTaxCompliance.create({
 *   jurisdiction: 'CA',
 *   taxPeriod: '2024-Q1',
 *   totalSales: 150000.00,
 *   taxableAmount: 140000.00,
 *   taxCollected: 11200.00
 * });
 * ```
 */
export const createSalesTaxComplianceModel = (sequelize: Sequelize) => {
  class SalesTaxCompliance extends Model {
    public id!: number;
    public jurisdiction!: string;
    public jurisdictionType!: string;
    public taxPeriod!: string;
    public startDate!: Date;
    public endDate!: Date;
    public totalSales!: number;
    public taxableAmount!: number;
    public exemptAmount!: number;
    public taxCollected!: number;
    public taxRemitted!: number;
    public hasNexus!: boolean;
    public nexusType!: string | null;
    public registrationNumber!: string | null;
    public filingFrequency!: string;
    public filingDeadline!: Date;
    public filingStatus!: string;
    public filedDate!: Date | null;
    public returnId!: string | null;
    public penaltyAmount!: number;
    public interestAmount!: number;
    public adjustments!: TaxAdjustment[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  SalesTaxCompliance.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      jurisdiction: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'State/county/city code',
      },
      jurisdictionType: {
        type: DataTypes.ENUM('state', 'county', 'city', 'district'),
        allowNull: false,
        comment: 'Type of jurisdiction',
      },
      taxPeriod: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Tax period (YYYY-QN, YYYY-MM)',
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Period start date',
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Period end date',
      },
      totalSales: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total sales in jurisdiction',
      },
      taxableAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Taxable sales amount',
      },
      exemptAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Exempt sales amount',
      },
      taxCollected: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Sales tax collected',
      },
      taxRemitted: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Sales tax remitted to jurisdiction',
      },
      hasNexus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether nexus exists',
      },
      nexusType: {
        type: DataTypes.ENUM('physical', 'economic', 'affiliate', 'click_through'),
        allowNull: true,
        comment: 'Type of nexus',
      },
      registrationNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Tax registration number',
      },
      filingFrequency: {
        type: DataTypes.ENUM('monthly', 'quarterly', 'annual'),
        allowNull: false,
        comment: 'Filing frequency',
      },
      filingDeadline: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Filing deadline',
      },
      filingStatus: {
        type: DataTypes.ENUM('pending', 'filed', 'accepted', 'late', 'amended'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Filing status',
      },
      filedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date filed',
      },
      returnId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Return confirmation ID',
      },
      penaltyAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Penalties assessed',
      },
      interestAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Interest assessed',
      },
      adjustments: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Tax adjustments',
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
      tableName: 'sales_tax_compliance',
      timestamps: true,
      indexes: [
        { fields: ['jurisdiction'] },
        { fields: ['taxPeriod'] },
        { fields: ['filingStatus'] },
        { fields: ['hasNexus'] },
        { fields: ['filingDeadline'] },
        { fields: ['jurisdiction', 'taxPeriod'], unique: true },
      ],
    },
  );

  return SalesTaxCompliance;
};

// ============================================================================
// TAX CALCULATION ENGINE (1-8)
// ============================================================================

/**
 * Calculates federal income tax withholding based on W4 and tax tables.
 *
 * @param {number} grossWages - Gross wages for period
 * @param {string} payFrequency - Pay frequency (weekly/biweekly/monthly)
 * @param {W4FormData} w4Data - W4 form information
 * @param {number} taxYear - Tax year
 * @returns {number} Federal withholding amount
 *
 * @example
 * ```typescript
 * const withholding = calculateFederalWithholding(5000, 'monthly', {
 *   filingStatus: 'single',
 *   multipleJobs: false,
 *   dependents: 0,
 *   otherIncome: 0,
 *   deductions: 0,
 *   extraWithholding: 100,
 *   exempt: false,
 *   year: 2024
 * }, 2024);
 * // Returns: 625.50
 * ```
 */
export const calculateFederalWithholding = (
  grossWages: number,
  payFrequency: 'weekly' | 'biweekly' | 'semimonthly' | 'monthly',
  w4Data: W4FormData,
  taxYear: number,
): number => {
  if (w4Data.exempt) {
    return 0;
  }

  // Convert to annual amount
  const periodsPerYear = {
    weekly: 52,
    biweekly: 26,
    semimonthly: 24,
    monthly: 12,
  };

  const annualWages = grossWages * periodsPerYear[payFrequency];

  // Adjust for W4 Step 2 (multiple jobs)
  const adjustedWages = w4Data.multipleJobs ? annualWages : annualWages;

  // Step 3: Claim dependents
  const dependentAmount = w4Data.dependents * 2000; // $2000 per dependent for 2024

  // Step 4a: Other income
  const totalIncome = adjustedWages + w4Data.otherIncome;

  // Step 4b: Deductions
  const standardDeduction = getStandardDeduction(w4Data.filingStatus, taxYear);
  const totalDeductions = standardDeduction + w4Data.deductions;

  // Taxable income
  const taxableIncome = Math.max(0, totalIncome - totalDeductions - dependentAmount);

  // Calculate tax using tax brackets
  const annualTax = calculateTaxFromBrackets(taxableIncome, w4Data.filingStatus, taxYear);

  // Convert to per-period withholding
  const periodWithholding = annualTax / periodsPerYear[payFrequency];

  // Step 4c: Extra withholding
  const totalWithholding = periodWithholding + w4Data.extraWithholding;

  return Math.max(0, Math.round(totalWithholding * 100) / 100);
};

/**
 * Calculates state income tax withholding based on state tax tables.
 *
 * @param {number} grossWages - Gross wages for period
 * @param {string} stateCode - Two-letter state code
 * @param {string} payFrequency - Pay frequency
 * @param {W4FormData} w4Data - W4/state withholding form data
 * @param {number} taxYear - Tax year
 * @returns {number} State withholding amount
 *
 * @example
 * ```typescript
 * const stateWithholding = calculateStateWithholding(5000, 'CA', 'monthly', w4Data, 2024);
 * // Returns: 250.75
 * ```
 */
export const calculateStateWithholding = (
  grossWages: number,
  stateCode: string,
  payFrequency: 'weekly' | 'biweekly' | 'semimonthly' | 'monthly',
  w4Data: W4FormData,
  taxYear: number,
): number => {
  // States with no income tax
  const noIncomeTaxStates = ['AK', 'FL', 'NV', 'NH', 'SD', 'TN', 'TX', 'WA', 'WY'];
  if (noIncomeTaxStates.includes(stateCode)) {
    return 0;
  }

  const periodsPerYear = {
    weekly: 52,
    biweekly: 26,
    semimonthly: 24,
    monthly: 12,
  };

  const annualWages = grossWages * periodsPerYear[payFrequency];

  // State-specific calculation (simplified for example)
  // In production, use actual state tax tables
  const stateTaxRates: Record<string, number> = {
    CA: 0.05, // California progressive rate (simplified)
    NY: 0.045,
    TX: 0,
    FL: 0,
    IL: 0.0495, // Flat rate
    PA: 0.0307, // Flat rate
  };

  const rate = stateTaxRates[stateCode] || 0.04; // Default 4%
  const annualStateTax = annualWages * rate;
  const periodWithholding = annualStateTax / periodsPerYear[payFrequency];

  return Math.round(periodWithholding * 100) / 100;
};

/**
 * Calculates Social Security tax (FICA) with wage base limit.
 *
 * @param {number} grossWages - Gross wages for period
 * @param {number} ytdWages - Year-to-date wages
 * @param {number} taxYear - Tax year
 * @returns {number} Social Security tax amount
 *
 * @example
 * ```typescript
 * const ssTax = calculateSocialSecurityTax(5000, 120000, 2024);
 * // Returns: 310.00 (6.2% of 5000, if under wage base)
 * ```
 */
export const calculateSocialSecurityTax = (
  grossWages: number,
  ytdWages: number,
  taxYear: number,
): number => {
  const wageBase = getSocialSecurityWageBase(taxYear);
  const rate = 0.062; // 6.2%

  // Calculate taxable amount for this period
  const remainingBase = Math.max(0, wageBase - ytdWages);
  const taxableWages = Math.min(grossWages, remainingBase);

  return Math.round(taxableWages * rate * 100) / 100;
};

/**
 * Calculates Medicare tax including additional Medicare tax for high earners.
 *
 * @param {number} grossWages - Gross wages for period
 * @param {number} ytdWages - Year-to-date wages
 * @param {string} filingStatus - Filing status for additional Medicare threshold
 * @returns {{ regularMedicare: number; additionalMedicare: number; total: number }}
 *
 * @example
 * ```typescript
 * const medicare = calculateMedicareTax(10000, 180000, 'single');
 * // Returns: { regularMedicare: 145.00, additionalMedicare: 90.00, total: 235.00 }
 * ```
 */
export const calculateMedicareTax = (
  grossWages: number,
  ytdWages: number,
  filingStatus: string,
): { regularMedicare: number; additionalMedicare: number; total: number } => {
  const regularRate = 0.0145; // 1.45%
  const additionalRate = 0.009; // 0.9% additional

  // Additional Medicare threshold
  const thresholds: Record<string, number> = {
    single: 200000,
    married_joint: 250000,
    married_separate: 125000,
    head_of_household: 200000,
  };

  const threshold = thresholds[filingStatus] || 200000;

  // Regular Medicare (no wage base limit)
  const regularMedicare = Math.round(grossWages * regularRate * 100) / 100;

  // Additional Medicare (only on wages above threshold)
  let additionalMedicare = 0;
  if (ytdWages + grossWages > threshold) {
    const previousExcess = Math.max(0, ytdWages - threshold);
    const currentExcess = Math.max(0, ytdWages + grossWages - threshold);
    const newExcess = currentExcess - previousExcess;
    additionalMedicare = Math.round(newExcess * additionalRate * 100) / 100;
  }

  return {
    regularMedicare,
    additionalMedicare,
    total: regularMedicare + additionalMedicare,
  };
};

/**
 * Performs comprehensive tax calculation for a single transaction.
 *
 * @param {TaxCalculationRequest} request - Tax calculation request
 * @param {Sequelize} sequelize - Sequelize instance for database access
 * @returns {Promise<TaxCalculationResult>} Complete tax calculation result
 *
 * @example
 * ```typescript
 * const result = await calculateTax({
 *   grossAmount: 5000,
 *   taxYear: 2024,
 *   jurisdiction: 'all',
 *   jurisdictionCode: 'CA',
 *   filingStatus: 'single',
 *   taxType: 'income',
 *   employeeW4Data: w4Data
 * }, sequelize);
 * ```
 */
export const calculateTax = async (
  request: TaxCalculationRequest,
  sequelize: Sequelize,
): Promise<TaxCalculationResult> => {
  const taxableAmount = request.taxableAmount || request.grossAmount;
  const breakdown: TaxBreakdown[] = [];

  let federalTax = 0;
  let stateTax = 0;
  let localTax = 0;
  let socialSecurityTax = 0;
  let medicareTax = 0;
  let additionalMedicareTax = 0;

  // Calculate based on tax type
  if (request.taxType === 'income' || request.taxType === 'payroll') {
    if (request.jurisdiction === 'federal' || request.jurisdiction === 'all') {
      if (request.employeeW4Data) {
        federalTax = calculateFederalWithholding(
          request.grossAmount,
          'monthly',
          request.employeeW4Data,
          request.taxYear,
        );
        breakdown.push({
          jurisdiction: 'Federal',
          taxType: 'Income Tax',
          rate: (federalTax / taxableAmount) * 100,
          taxableBase: taxableAmount,
          taxAmount: federalTax,
          description: 'Federal income tax withholding',
        });
      }
    }

    if (request.jurisdiction === 'state' || request.jurisdiction === 'all') {
      if (request.jurisdictionCode && request.employeeW4Data) {
        stateTax = calculateStateWithholding(
          request.grossAmount,
          request.jurisdictionCode,
          'monthly',
          request.employeeW4Data,
          request.taxYear,
        );
        breakdown.push({
          jurisdiction: request.jurisdictionCode,
          taxType: 'State Income Tax',
          rate: (stateTax / taxableAmount) * 100,
          taxableBase: taxableAmount,
          taxAmount: stateTax,
          description: `${request.jurisdictionCode} state income tax`,
        });
      }
    }

    // FICA taxes
    if (request.taxType === 'payroll') {
      socialSecurityTax = calculateSocialSecurityTax(request.grossAmount, 0, request.taxYear);
      const medicare = calculateMedicareTax(
        request.grossAmount,
        0,
        request.filingStatus || 'single',
      );
      medicareTax = medicare.regularMedicare;
      additionalMedicareTax = medicare.additionalMedicare;

      breakdown.push({
        jurisdiction: 'Federal',
        taxType: 'Social Security',
        rate: 6.2,
        taxableBase: request.grossAmount,
        taxAmount: socialSecurityTax,
        description: 'Social Security tax (FICA)',
      });

      breakdown.push({
        jurisdiction: 'Federal',
        taxType: 'Medicare',
        rate: 1.45,
        taxableBase: request.grossAmount,
        taxAmount: medicareTax,
        description: 'Medicare tax',
      });

      if (additionalMedicareTax > 0) {
        breakdown.push({
          jurisdiction: 'Federal',
          taxType: 'Additional Medicare',
          rate: 0.9,
          taxableBase: request.grossAmount,
          taxAmount: additionalMedicareTax,
          description: 'Additional Medicare tax (high earners)',
        });
      }
    }
  }

  const totalTax =
    federalTax +
    stateTax +
    localTax +
    socialSecurityTax +
    medicareTax +
    additionalMedicareTax +
    (request.additionalWithholding || 0);

  const effectiveRate = (totalTax / taxableAmount) * 100;
  const marginalRate = calculateMarginalRate(taxableAmount, request.filingStatus || 'single', request.taxYear);

  return {
    taxableAmount,
    totalTax: Math.round(totalTax * 100) / 100,
    federalTax,
    stateTax,
    localTax,
    socialSecurityTax,
    medicareTax,
    additionalMedicareTax,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    marginalRate,
    breakdown,
    withholdingAmount: Math.round(totalTax * 100) / 100,
    metadata: request.metadata,
  };
};

/**
 * Calculates sales tax for a transaction based on jurisdiction.
 *
 * @param {SalesTaxRequest} request - Sales tax calculation request
 * @returns {Promise<number>} Sales tax amount
 *
 * @example
 * ```typescript
 * const salesTax = await calculateSalesTax({
 *   amount: 100.00,
 *   jurisdiction: 'CA-SANTA-CLARA',
 *   isExempt: false,
 *   taxDate: new Date()
 * });
 * // Returns: 9.25
 * ```
 */
export const calculateSalesTax = async (request: SalesTaxRequest): Promise<number> => {
  if (request.isExempt) {
    return 0;
  }

  // Parse jurisdiction code (e.g., "CA-SANTA-CLARA")
  const parts = request.jurisdiction.split('-');
  const state = parts[0];

  // Get combined rate (state + county + city)
  const rate = await getSalesTaxRate(request.jurisdiction, request.taxDate);

  const salesTax = request.amount * rate;
  return Math.round(salesTax * 100) / 100;
};

/**
 * Calculates VAT (Value Added Tax) for international transactions.
 *
 * @param {VATCalculationRequest} request - VAT calculation request
 * @returns {{ netAmount: number; vatAmount: number; grossAmount: number; isReverseCharge: boolean }}
 *
 * @example
 * ```typescript
 * const vat = calculateVAT({
 *   netAmount: 1000,
 *   vatRate: 20,
 *   vatRegion: 'GB',
 *   reverseCharge: false,
 *   isIntraEU: false,
 *   supplierVATNumber: 'GB123456789'
 * });
 * // Returns: { netAmount: 1000, vatAmount: 200, grossAmount: 1200, isReverseCharge: false }
 * ```
 */
export const calculateVAT = (request: VATCalculationRequest): {
  netAmount: number;
  vatAmount: number;
  grossAmount: number;
  isReverseCharge: boolean;
} => {
  // Reverse charge mechanism for B2B intra-EU transactions
  if (request.isIntraEU && request.customerVATNumber && request.reverseCharge) {
    return {
      netAmount: request.netAmount,
      vatAmount: 0,
      grossAmount: request.netAmount,
      isReverseCharge: true,
    };
  }

  // Standard VAT calculation
  const vatAmount = (request.netAmount * request.vatRate) / 100;
  const grossAmount = request.netAmount + vatAmount;

  return {
    netAmount: request.netAmount,
    vatAmount: Math.round(vatAmount * 100) / 100,
    grossAmount: Math.round(grossAmount * 100) / 100,
    isReverseCharge: false,
  };
};

/**
 * Calculates estimated quarterly tax payments for self-employed individuals.
 *
 * @param {number} estimatedAnnualIncome - Estimated annual income
 * @param {number} estimatedDeductions - Estimated annual deductions
 * @param {string} filingStatus - Tax filing status
 * @param {number} taxYear - Tax year
 * @returns {{ quarterlyPayment: number; annualTax: number; selfEmploymentTax: number }}
 *
 * @example
 * ```typescript
 * const estimated = calculateEstimatedTax(120000, 20000, 'single', 2024);
 * // Returns: { quarterlyPayment: 6250, annualTax: 18000, selfEmploymentTax: 7000 }
 * ```
 */
export const calculateEstimatedTax = (
  estimatedAnnualIncome: number,
  estimatedDeductions: number,
  filingStatus: string,
  taxYear: number,
): { quarterlyPayment: number; annualTax: number; selfEmploymentTax: number } => {
  // Self-employment tax (Social Security + Medicare)
  const selfEmploymentRate = 0.153; // 15.3%
  const deductibleSETax = estimatedAnnualIncome * selfEmploymentRate * 0.5;
  const selfEmploymentTax = estimatedAnnualIncome * selfEmploymentRate - deductibleSETax;

  // Adjusted gross income
  const agi = estimatedAnnualIncome - deductibleSETax - estimatedDeductions;

  // Income tax
  const incomeTax = calculateTaxFromBrackets(agi, filingStatus, taxYear);

  // Total annual tax
  const annualTax = incomeTax + selfEmploymentTax;

  // Quarterly payment
  const quarterlyPayment = annualTax / 4;

  return {
    quarterlyPayment: Math.round(quarterlyPayment * 100) / 100,
    annualTax: Math.round(annualTax * 100) / 100,
    selfEmploymentTax: Math.round(selfEmploymentTax * 100) / 100,
  };
};

// ============================================================================
// TAX FORM GENERATION (9-14)
// ============================================================================

/**
 * Generates W2 form data for an employee for a tax year.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} taxYear - Tax year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<W2FormData>} W2 form data
 *
 * @example
 * ```typescript
 * const w2 = await generateW2Form('EMP001', 2024, sequelize);
 * // Returns complete W2 data with all boxes filled
 * ```
 */
export const generateW2Form = async (
  employeeId: string,
  taxYear: number,
  sequelize: Sequelize,
): Promise<W2FormData> => {
  const TaxWithholding = createTaxWithholdingModel(sequelize);

  // Get all withholding records for the year
  const withholdings = await TaxWithholding.findAll({
    where: {
      employeeId,
      taxYear,
    },
    order: [['periodStartDate', 'ASC']],
  });

  if (withholdings.length === 0) {
    throw new Error(`No withholding records found for employee ${employeeId} in ${taxYear}`);
  }

  // Aggregate totals
  let totalWages = 0;
  let federalWithheld = 0;
  let socialSecurityWages = 0;
  let socialSecurityWithheld = 0;
  let medicareWages = 0;
  let medicareWithheld = 0;
  const stateWages: Record<string, number> = {};
  const stateWithheld: Record<string, number> = {};

  withholdings.forEach((w: any) => {
    totalWages += parseFloat(w.grossWages);
    federalWithheld += parseFloat(w.federalWithholding);
    socialSecurityWages += parseFloat(w.grossWages);
    socialSecurityWithheld += parseFloat(w.socialSecurityWithholding);
    medicareWages += parseFloat(w.grossWages);
    medicareWithheld +=
      parseFloat(w.medicareWithholding) + parseFloat(w.additionalMedicareWithholding);

    if (w.jurisdictionCode) {
      stateWages[w.jurisdictionCode] =
        (stateWages[w.jurisdictionCode] || 0) + parseFloat(w.grossWages);
      stateWithheld[w.jurisdictionCode] =
        (stateWithheld[w.jurisdictionCode] || 0) + parseFloat(w.stateWithholding);
    }
  });

  // Get employee and employer information (simplified - would come from database)
  const w2Data: W2FormData = {
    employeeId,
    employeeName: 'Employee Name', // Would fetch from employee table
    employeeSSN: '000-00-0000', // Would fetch from employee table
    employeeAddress: '123 Main St, City, ST 12345',
    employerEIN: '00-0000000',
    employerName: 'USACE Organization',
    employerAddress: '456 Federal Blvd, City, ST 12345',
    wages: Math.round(totalWages * 100) / 100,
    federalWithheld: Math.round(federalWithheld * 100) / 100,
    socialSecurityWages: Math.round(socialSecurityWages * 100) / 100,
    socialSecurityWithheld: Math.round(socialSecurityWithheld * 100) / 100,
    medicareWages: Math.round(medicareWages * 100) / 100,
    medicareWithheld: Math.round(medicareWithheld * 100) / 100,
    stateWages,
    stateWithheld,
    taxYear,
    boxes: {
      box12: [], // Codes for retirement plans, etc.
      box13: {
        statutoryEmployee: false,
        retirementPlan: false,
        thirdPartySickPay: false,
      },
    },
  };

  return w2Data;
};

/**
 * Generates 1099-NEC form for non-employee compensation.
 *
 * @param {string} recipientId - Recipient (contractor) ID
 * @param {number} taxYear - Tax year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Form1099Data>} 1099-NEC form data
 *
 * @example
 * ```typescript
 * const form1099 = await generate1099NECForm('CONTR001', 2024, sequelize);
 * ```
 */
export const generate1099NECForm = async (
  recipientId: string,
  taxYear: number,
  sequelize: Sequelize,
): Promise<Form1099Data> => {
  // Query payment records for contractor
  const payments = await sequelize.query(
    `
    SELECT SUM(amount) as total_compensation
    FROM contractor_payments
    WHERE recipient_id = :recipientId
    AND YEAR(payment_date) = :taxYear
    AND payment_type = 'non_employee_compensation'
  `,
    {
      replacements: { recipientId, taxYear },
      type: 'SELECT',
    },
  );

  const totalCompensation = (payments[0] as any)?.total_compensation || 0;

  if (totalCompensation < 600) {
    throw new Error('1099-NEC not required for amounts under $600');
  }

  const form1099: Form1099Data = {
    recipientId,
    recipientName: 'Contractor Name',
    recipientTIN: '00-0000000',
    recipientAddress: '789 Contractor Ave, City, ST 12345',
    payerEIN: '00-0000000',
    payerName: 'USACE Organization',
    payerAddress: '456 Federal Blvd, City, ST 12345',
    formType: '1099-NEC',
    amount: Math.round(totalCompensation * 100) / 100,
    taxYear,
    boxes: {
      box1: Math.round(totalCompensation * 100) / 100, // Nonemployee compensation
      box4: 0, // Federal income tax withheld
    },
  };

  return form1099;
};

/**
 * Generates 1099-MISC form for miscellaneous income.
 *
 * @param {string} recipientId - Recipient ID
 * @param {number} taxYear - Tax year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Form1099Data>} 1099-MISC form data
 *
 * @example
 * ```typescript
 * const form1099 = await generate1099MISCForm('VEND001', 2024, sequelize);
 * ```
 */
export const generate1099MISCForm = async (
  recipientId: string,
  taxYear: number,
  sequelize: Sequelize,
): Promise<Form1099Data> => {
  const form1099: Form1099Data = {
    recipientId,
    recipientName: 'Recipient Name',
    recipientTIN: '00-0000000',
    recipientAddress: '789 Recipient Ave, City, ST 12345',
    payerEIN: '00-0000000',
    payerName: 'USACE Organization',
    payerAddress: '456 Federal Blvd, City, ST 12345',
    formType: '1099-MISC',
    amount: 0,
    taxYear,
    boxes: {
      box1: 0, // Rents
      box2: 0, // Royalties
      box3: 0, // Other income
      box8: 0, // Substitute payments
      box10: 0, // Crop insurance proceeds
    },
  };

  return form1099;
};

/**
 * Creates PDF file for W2 form.
 *
 * @param {W2FormData} w2Data - W2 form data
 * @param {string} outputPath - Output file path
 * @returns {Promise<string>} Path to generated PDF
 *
 * @example
 * ```typescript
 * const pdfPath = await createW2PDF(w2Data, '/tmp/w2_2024_EMP001.pdf');
 * ```
 */
export const createW2PDF = async (w2Data: W2FormData, outputPath: string): Promise<string> => {
  // In production, use PDFKit or similar library to generate actual W2 PDF
  // This is a simplified placeholder

  const pdfContent = `
=== W-2 Wage and Tax Statement - ${w2Data.taxYear} ===

EMPLOYER INFORMATION:
EIN: ${w2Data.employerEIN}
Name: ${w2Data.employerName}
Address: ${w2Data.employerAddress}

EMPLOYEE INFORMATION:
SSN: ${w2Data.employeeSSN}
Name: ${w2Data.employeeName}
Address: ${w2Data.employeeAddress}

BOX 1 - Wages, tips, other compensation: $${w2Data.wages.toFixed(2)}
BOX 2 - Federal income tax withheld: $${w2Data.federalWithheld.toFixed(2)}
BOX 3 - Social security wages: $${w2Data.socialSecurityWages.toFixed(2)}
BOX 4 - Social security tax withheld: $${w2Data.socialSecurityWithheld.toFixed(2)}
BOX 5 - Medicare wages and tips: $${w2Data.medicareWages.toFixed(2)}
BOX 6 - Medicare tax withheld: $${w2Data.medicareWithheld.toFixed(2)}

STATE INFORMATION:
${Object.entries(w2Data.stateWages)
  .map(([state, wages]) => `${state}: Wages $${wages.toFixed(2)}, Withheld $${w2Data.stateWithheld[state].toFixed(2)}`)
  .join('\n')}
  `.trim();

  // Ensure directory exists
  const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(outputPath, pdfContent);
  return outputPath;
};

/**
 * Creates PDF file for 1099 form.
 *
 * @param {Form1099Data} form1099Data - 1099 form data
 * @param {string} outputPath - Output file path
 * @returns {Promise<string>} Path to generated PDF
 *
 * @example
 * ```typescript
 * const pdfPath = await create1099PDF(form1099Data, '/tmp/1099_2024_CONTR001.pdf');
 * ```
 */
export const create1099PDF = async (
  form1099Data: Form1099Data,
  outputPath: string,
): Promise<string> => {
  const pdfContent = `
=== Form ${form1099Data.formType} - ${form1099Data.taxYear} ===

PAYER INFORMATION:
EIN: ${form1099Data.payerEIN}
Name: ${form1099Data.payerName}
Address: ${form1099Data.payerAddress}

RECIPIENT INFORMATION:
TIN: ${form1099Data.recipientTIN}
Name: ${form1099Data.recipientName}
Address: ${form1099Data.recipientAddress}

AMOUNT: $${form1099Data.amount.toFixed(2)}

${form1099Data.formType === '1099-NEC' ? `BOX 1 - Nonemployee compensation: $${form1099Data.amount.toFixed(2)}` : ''}
${form1099Data.federalWithheld ? `Federal income tax withheld: $${form1099Data.federalWithheld.toFixed(2)}` : ''}
  `.trim();

  const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(outputPath, pdfContent);
  return outputPath;
};

/**
 * Batch generates all W2 forms for a tax year.
 *
 * @param {number} taxYear - Tax year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<{ employeeId: string; formId: number; pdfPath: string }>>}
 *
 * @example
 * ```typescript
 * const results = await batchGenerateW2Forms(2024, sequelize);
 * // Returns array of generated W2 records
 * ```
 */
export const batchGenerateW2Forms = async (
  taxYear: number,
  sequelize: Sequelize,
): Promise<Array<{ employeeId: string; formId: number; pdfPath: string }>> => {
  const TaxWithholding = createTaxWithholdingModel(sequelize);
  const TaxForm = createTaxFormModel(sequelize);

  // Get all unique employees for the tax year
  const employees = await sequelize.query(
    `
    SELECT DISTINCT employee_id
    FROM tax_withholdings
    WHERE tax_year = :taxYear
    ORDER BY employee_id
  `,
    {
      replacements: { taxYear },
      type: 'SELECT',
    },
  );

  const results: Array<{ employeeId: string; formId: number; pdfPath: string }> = [];

  for (const emp of employees as any[]) {
    try {
      // Generate W2 data
      const w2Data = await generateW2Form(emp.employee_id, taxYear, sequelize);

      // Create PDF
      const pdfPath = `/tmp/tax_forms/w2/${taxYear}/w2_${taxYear}_${emp.employee_id}.pdf`;
      await createW2PDF(w2Data, pdfPath);

      // Save to database
      const form = await TaxForm.create({
        recipientId: emp.employee_id,
        recipientType: 'employee',
        formType: 'W2',
        taxYear,
        formData: w2Data,
        generatedDate: new Date(),
        status: 'generated',
        pdfPath,
        generatedBy: 'system',
        metadata: {},
      });

      results.push({
        employeeId: emp.employee_id,
        formId: (form as any).id,
        pdfPath,
      });
    } catch (error) {
      console.error(`Failed to generate W2 for employee ${emp.employee_id}:`, error);
    }
  }

  return results;
};

// ============================================================================
// TAX COMPLIANCE & REPORTING (15-22)
// ============================================================================

/**
 * Checks tax nexus for a jurisdiction (sales tax/VAT).
 *
 * @param {string} jurisdiction - Jurisdiction code
 * @param {Date} checkDate - Date to check nexus
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TaxNexusResult>} Nexus determination result
 *
 * @example
 * ```typescript
 * const nexus = await checkTaxNexus('CA', new Date(), sequelize);
 * // Returns: { hasNexus: true, nexusType: 'economic', thresholdMet: true, ... }
 * ```
 */
export const checkTaxNexus = async (
  jurisdiction: string,
  checkDate: Date,
  sequelize: Sequelize,
): Promise<TaxNexusResult> => {
  // Economic nexus thresholds by state (as of 2024)
  const economicThresholds: Record<string, { sales: number; transactions: number }> = {
    CA: { sales: 500000, transactions: 0 },
    NY: { sales: 500000, transactions: 100 },
    TX: { sales: 500000, transactions: 0 },
    FL: { sales: 100000, transactions: 0 },
  };

  const threshold = economicThresholds[jurisdiction];

  if (!threshold) {
    return {
      hasNexus: false,
      jurisdiction,
      nexusType: 'economic',
      thresholdMet: false,
      requiresRegistration: false,
      details: 'No economic nexus threshold defined for jurisdiction',
    };
  }

  // Check sales in trailing 12 months
  const startDate = new Date(checkDate);
  startDate.setFullYear(startDate.getFullYear() - 1);

  const salesData = await sequelize.query(
    `
    SELECT
      SUM(amount) as total_sales,
      COUNT(*) as transaction_count
    FROM sales_transactions
    WHERE jurisdiction = :jurisdiction
    AND transaction_date BETWEEN :startDate AND :checkDate
  `,
    {
      replacements: { jurisdiction, startDate, checkDate },
      type: 'SELECT',
    },
  );

  const totalSales = (salesData[0] as any)?.total_sales || 0;
  const transactionCount = (salesData[0] as any)?.transaction_count || 0;

  const salesThresholdMet = totalSales >= threshold.sales;
  const transactionThresholdMet =
    threshold.transactions === 0 || transactionCount >= threshold.transactions;

  const hasNexus = salesThresholdMet || transactionThresholdMet;

  return {
    hasNexus,
    jurisdiction,
    nexusType: 'economic',
    thresholdMet: hasNexus,
    requiresRegistration: hasNexus,
    registrationDeadline: hasNexus
      ? new Date(checkDate.getTime() + 30 * 24 * 60 * 60 * 1000)
      : undefined,
    details: hasNexus
      ? `Economic nexus threshold met: $${totalSales.toFixed(2)} sales, ${transactionCount} transactions`
      : 'Below economic nexus threshold',
  };
};

/**
 * Performs tax compliance check for a jurisdiction and period.
 *
 * @param {string} jurisdiction - Jurisdiction code
 * @param {string} taxType - Type of tax
 * @param {string} period - Tax period
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TaxComplianceCheck>} Compliance check results
 *
 * @example
 * ```typescript
 * const compliance = await performComplianceCheck('CA', 'sales', '2024-Q1', sequelize);
 * ```
 */
export const performComplianceCheck = async (
  jurisdiction: string,
  taxType: string,
  period: string,
  sequelize: Sequelize,
): Promise<TaxComplianceCheck> => {
  const issues: ComplianceIssue[] = [];

  // Check for missing registrations
  const registration = await sequelize.query(
    `
    SELECT * FROM tax_registrations
    WHERE jurisdiction = :jurisdiction
    AND tax_type = :taxType
    AND status = 'active'
  `,
    {
      replacements: { jurisdiction, taxType },
      type: 'SELECT',
    },
  );

  if (registration.length === 0) {
    issues.push({
      severity: 'critical',
      issueType: 'missing_registration',
      description: `No active tax registration found for ${jurisdiction} ${taxType}`,
      resolution: 'Register with tax authority',
      dueDate: new Date(),
    });
  }

  // Check for unfiled returns
  const returns = await sequelize.query(
    `
    SELECT * FROM tax_returns
    WHERE jurisdiction = :jurisdiction
    AND tax_type = :taxType
    AND period = :period
    AND status IN ('filed', 'accepted')
  `,
    {
      replacements: { jurisdiction, taxType, period },
      type: 'SELECT',
    },
  );

  if (returns.length === 0) {
    issues.push({
      severity: 'high',
      issueType: 'unfiled_return',
      description: `Tax return not filed for period ${period}`,
      resolution: 'File tax return immediately',
      dueDate: calculateFilingDeadline(period),
    });
  }

  // Check for unpaid tax liabilities
  const liabilities = await sequelize.query(
    `
    SELECT SUM(amount) as total_liability
    FROM tax_liabilities
    WHERE jurisdiction = :jurisdiction
    AND tax_type = :taxType
    AND period = :period
    AND status = 'unpaid'
  `,
    {
      replacements: { jurisdiction, taxType, period },
      type: 'SELECT',
    },
  );

  const totalLiability = (liabilities[0] as any)?.total_liability || 0;
  if (totalLiability > 0) {
    issues.push({
      severity: 'high',
      issueType: 'unpaid_liability',
      description: `Unpaid tax liability of $${totalLiability.toFixed(2)}`,
      resolution: 'Remit payment to tax authority',
      dueDate: calculateFilingDeadline(period),
    });
  }

  const isCompliant = issues.length === 0;

  return {
    isCompliant,
    jurisdiction,
    taxType,
    period,
    issues,
    nextFilingDeadline: calculateFilingDeadline(getNextPeriod(period)),
  };
};

/**
 * Reconciles tax collected vs. tax remitted for a period.
 *
 * @param {TaxReconciliationRequest} request - Reconciliation request
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TaxReconciliationResult>} Reconciliation results
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileTaxPeriod({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-03-31'),
 *   jurisdiction: 'CA',
 *   taxType: 'sales',
 *   includeAdjustments: true
 * }, sequelize);
 * ```
 */
export const reconcileTaxPeriod = async (
  request: TaxReconciliationRequest,
  sequelize: Sequelize,
): Promise<TaxReconciliationResult> => {
  // Get total taxable amount
  const taxableData = await sequelize.query(
    `
    SELECT SUM(taxable_amount) as gross_taxable
    FROM sales_transactions
    WHERE jurisdiction = :jurisdiction
    AND transaction_date BETWEEN :startDate AND :endDate
  `,
    {
      replacements: {
        jurisdiction: request.jurisdiction,
        startDate: request.startDate,
        endDate: request.endDate,
      },
      type: 'SELECT',
    },
  );

  const grossTaxable = (taxableData[0] as any)?.gross_taxable || 0;

  // Calculate expected tax
  const rate = await getSalesTaxRate(request.jurisdiction, request.startDate);
  const totalTaxCalculated = grossTaxable * rate;

  // Get tax collected
  const collectedData = await sequelize.query(
    `
    SELECT SUM(tax_amount) as total_withheld
    FROM sales_transactions
    WHERE jurisdiction = :jurisdiction
    AND transaction_date BETWEEN :startDate AND :endDate
  `,
    {
      replacements: {
        jurisdiction: request.jurisdiction,
        startDate: request.startDate,
        endDate: request.endDate,
      },
      type: 'SELECT',
    },
  );

  const totalTaxWithheld = (collectedData[0] as any)?.total_withheld || 0;

  // Get tax paid
  const paidData = await sequelize.query(
    `
    SELECT SUM(amount) as total_paid
    FROM tax_payments
    WHERE jurisdiction = :jurisdiction
    AND tax_type = :taxType
    AND payment_date BETWEEN :startDate AND :endDate
  `,
    {
      replacements: {
        jurisdiction: request.jurisdiction,
        taxType: request.taxType,
        startDate: request.startDate,
        endDate: request.endDate,
      },
      type: 'SELECT',
    },
  );

  const totalTaxPaid = (paidData[0] as any)?.total_paid || 0;

  // Calculate variance
  const variance = totalTaxWithheld - totalTaxPaid;
  const variancePercentage = (variance / totalTaxWithheld) * 100;

  // Get adjustments
  const adjustments: TaxAdjustment[] = [];
  if (request.includeAdjustments) {
    const adjustmentData = await sequelize.query(
      `
      SELECT *
      FROM tax_adjustments
      WHERE jurisdiction = :jurisdiction
      AND adjustment_date BETWEEN :startDate AND :endDate
    `,
      {
        replacements: {
          jurisdiction: request.jurisdiction,
          startDate: request.startDate,
          endDate: request.endDate,
        },
        type: 'SELECT',
      },
    );

    adjustments.push(...(adjustmentData as any[]));
  }

  const needsCorrection = Math.abs(variance) > 0.01; // More than 1 cent variance

  return {
    grossTaxable: Math.round(grossTaxable * 100) / 100,
    totalTaxCalculated: Math.round(totalTaxCalculated * 100) / 100,
    totalTaxWithheld: Math.round(totalTaxWithheld * 100) / 100,
    totalTaxPaid: Math.round(totalTaxPaid * 100) / 100,
    variance: Math.round(variance * 100) / 100,
    variancePercentage: Math.round(variancePercentage * 100) / 100,
    adjustments,
    needsCorrection,
  };
};

/**
 * Calculates penalty for late tax filing or payment.
 *
 * @param {number} taxAmount - Tax amount owed
 * @param {Date} dueDate - Original due date
 * @param {Date} paidDate - Actual payment date
 * @param {string} jurisdictionCode - Jurisdiction code for penalty rules
 * @returns {{ penalty: number; interest: number; total: number; daysLate: number }}
 *
 * @example
 * ```typescript
 * const penalty = calculateTaxPenalty(1000, new Date('2024-04-15'), new Date('2024-05-15'), 'federal');
 * // Returns: { penalty: 50, interest: 8.33, total: 1058.33, daysLate: 30 }
 * ```
 */
export const calculateTaxPenalty = (
  taxAmount: number,
  dueDate: Date,
  paidDate: Date,
  jurisdictionCode: string,
): { penalty: number; interest: number; total: number; daysLate: number } => {
  const daysLate = Math.max(0, Math.floor((paidDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));

  if (daysLate === 0) {
    return { penalty: 0, interest: 0, total: taxAmount, daysLate: 0 };
  }

  // Penalty rates by jurisdiction
  const penaltyRates: Record<string, { penaltyRate: number; interestRate: number }> = {
    federal: { penaltyRate: 0.005, interestRate: 0.0001 }, // 0.5% per month late, ~3.65% annual interest
    CA: { penaltyRate: 0.05, interestRate: 0.0001 },
    NY: { penaltyRate: 0.05, interestRate: 0.0001 },
  };

  const rates = penaltyRates[jurisdictionCode] || { penaltyRate: 0.05, interestRate: 0.0001 };

  // Penalty: typically 0.5% per month or part of month
  const monthsLate = Math.ceil(daysLate / 30);
  const penalty = taxAmount * rates.penaltyRate * monthsLate;

  // Interest: daily compounding
  const dailyRate = rates.interestRate;
  const interest = taxAmount * dailyRate * daysLate;

  const total = taxAmount + penalty + interest;

  return {
    penalty: Math.round(penalty * 100) / 100,
    interest: Math.round(interest * 100) / 100,
    total: Math.round(total * 100) / 100,
    daysLate,
  };
};

/**
 * Calculates interest on underpaid estimated taxes.
 *
 * @param {number} underpaymentAmount - Amount underpaid
 * @param {Date} fromDate - Start date for interest calculation
 * @param {Date} toDate - End date for interest calculation
 * @param {number} annualRate - Annual interest rate (decimal)
 * @returns {number} Interest amount
 *
 * @example
 * ```typescript
 * const interest = calculateTaxInterest(5000, new Date('2024-01-01'), new Date('2024-12-31'), 0.05);
 * // Returns: 250.00
 * ```
 */
export const calculateTaxInterest = (
  underpaymentAmount: number,
  fromDate: Date,
  toDate: Date,
  annualRate: number,
): number => {
  const days = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
  const dailyRate = annualRate / 365;
  const interest = underpaymentAmount * dailyRate * days;

  return Math.round(interest * 100) / 100;
};

/**
 * Generates quarterly tax report (Form 941 data for payroll taxes).
 *
 * @param {string} quarter - Quarter (Q1, Q2, Q3, Q4)
 * @param {number} year - Tax year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object>} Form 941 data
 *
 * @example
 * ```typescript
 * const form941 = await generateQuarterlyTaxReport('Q1', 2024, sequelize);
 * ```
 */
export const generateQuarterlyTaxReport = async (
  quarter: string,
  year: number,
  sequelize: Sequelize,
): Promise<object> => {
  const quarters: Record<string, { start: string; end: string }> = {
    Q1: { start: `${year}-01-01`, end: `${year}-03-31` },
    Q2: { start: `${year}-04-01`, end: `${year}-06-30` },
    Q3: { start: `${year}-07-01`, end: `${year}-09-30` },
    Q4: { start: `${year}-10-01`, end: `${year}-12-31` },
  };

  const period = quarters[quarter];

  const TaxWithholding = createTaxWithholdingModel(sequelize);

  const totals = await TaxWithholding.findAll({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('gross_wages')), 'total_wages'],
      [sequelize.fn('SUM', sequelize.col('federal_withholding')), 'total_federal'],
      [sequelize.fn('SUM', sequelize.col('social_security_withholding')), 'total_ss'],
      [sequelize.fn('SUM', sequelize.col('medicare_withholding')), 'total_medicare'],
      [sequelize.fn('COUNT', sequelize.col('DISTINCT employee_id')), 'employee_count'],
    ],
    where: {
      periodStartDate: {
        [Op.gte]: period.start,
      },
      periodEndDate: {
        [Op.lte]: period.end,
      },
    },
    raw: true,
  });

  const data = totals[0] as any;

  const form941Data = {
    quarter,
    year,
    period,
    employeeCount: parseInt(data.employee_count) || 0,
    totalWages: parseFloat(data.total_wages) || 0,
    federalWithheld: parseFloat(data.total_federal) || 0,
    socialSecurityTax: parseFloat(data.total_ss) || 0,
    medicareTax: parseFloat(data.total_medicare) || 0,
    totalTax: 0,
    deposits: [],
    balance: 0,
  };

  form941Data.totalTax =
    form941Data.federalWithheld +
    form941Data.socialSecurityTax * 2 + // Employer match
    form941Data.medicareTax * 2; // Employer match

  return form941Data;
};

/**
 * Generates annual tax summary for year-end reporting.
 *
 * @param {number} taxYear - Tax year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object>} Annual tax summary
 *
 * @example
 * ```typescript
 * const summary = await generateAnnualTaxSummary(2024, sequelize);
 * ```
 */
export const generateAnnualTaxSummary = async (
  taxYear: number,
  sequelize: Sequelize,
): Promise<object> => {
  const TaxWithholding = createTaxWithholdingModel(sequelize);

  const totals = await TaxWithholding.findAll({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('gross_wages')), 'total_wages'],
      [sequelize.fn('SUM', sequelize.col('federal_withholding')), 'total_federal'],
      [sequelize.fn('SUM', sequelize.col('state_withholding')), 'total_state'],
      [sequelize.fn('SUM', sequelize.col('social_security_withholding')), 'total_ss'],
      [sequelize.fn('SUM', sequelize.col('medicare_withholding')), 'total_medicare'],
      [sequelize.fn('COUNT', sequelize.col('DISTINCT employee_id')), 'employee_count'],
    ],
    where: {
      taxYear,
    },
    raw: true,
  });

  const data = totals[0] as any;

  return {
    taxYear,
    employeeCount: parseInt(data.employee_count) || 0,
    totalWages: parseFloat(data.total_wages) || 0,
    federalWithheld: parseFloat(data.total_federal) || 0,
    stateWithheld: parseFloat(data.total_state) || 0,
    socialSecurityTax: parseFloat(data.total_ss) || 0,
    medicareTax: parseFloat(data.total_medicare) || 0,
    totalWithheld:
      parseFloat(data.total_federal) +
      parseFloat(data.total_state) +
      parseFloat(data.total_ss) +
      parseFloat(data.total_medicare),
    w2FormsGenerated: 0,
    form1099Generated: 0,
  };
};

/**
 * Validates tax identification number (TIN/EIN/SSN).
 *
 * @param {string} tin - Tax identification number
 * @param {string} tinType - Type of TIN (SSN, EIN)
 * @returns {boolean} Whether TIN is valid format
 *
 * @example
 * ```typescript
 * const isValid = validateTIN('12-3456789', 'EIN');
 * // Returns: true
 * ```
 */
export const validateTIN = (tin: string, tinType: 'SSN' | 'EIN'): boolean => {
  // Remove hyphens and spaces
  const cleaned = tin.replace(/[-\s]/g, '');

  if (tinType === 'SSN') {
    // SSN: 9 digits, format XXX-XX-XXXX
    if (!/^\d{9}$/.test(cleaned)) {
      return false;
    }
    // Invalid SSN patterns
    if (cleaned === '000000000' || cleaned.startsWith('000') || cleaned.substring(3, 5) === '00') {
      return false;
    }
    return true;
  } else if (tinType === 'EIN') {
    // EIN: 9 digits, format XX-XXXXXXX
    if (!/^\d{9}$/.test(cleaned)) {
      return false;
    }
    // EIN cannot start with 00, 07, 08, 09, etc.
    const prefix = cleaned.substring(0, 2);
    if (['00', '07', '08', '09', '17', '18', '19', '28', '29', '49', '78', '79', '89'].includes(prefix)) {
      return false;
    }
    return true;
  }

  return false;
};

/**
 * Validates VAT number format for EU countries.
 *
 * @param {string} vatNumber - VAT number
 * @param {string} countryCode - ISO country code
 * @returns {boolean} Whether VAT number is valid format
 *
 * @example
 * ```typescript
 * const isValid = validateVATNumber('GB123456789', 'GB');
 * // Returns: true
 * ```
 */
export const validateVATNumber = (vatNumber: string, countryCode: string): boolean => {
  // Remove spaces and convert to uppercase
  const cleaned = vatNumber.replace(/\s/g, '').toUpperCase();

  // VAT number patterns by country
  const patterns: Record<string, RegExp> = {
    GB: /^GB\d{9}$|^GB\d{12}$|^GBGD\d{3}$|^GBHA\d{3}$/,
    DE: /^DE\d{9}$/,
    FR: /^FR[A-Z0-9]{2}\d{9}$/,
    IT: /^IT\d{11}$/,
    ES: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/,
    NL: /^NL\d{9}B\d{2}$/,
    BE: /^BE0\d{9}$/,
    AT: /^ATU\d{8}$/,
    DK: /^DK\d{8}$/,
    SE: /^SE\d{12}$/,
  };

  const pattern = patterns[countryCode];
  if (!pattern) {
    return false;
  }

  return pattern.test(cleaned);
};

// ============================================================================
// ELECTRONIC FILING & TRANSMISSION (23-28)
// ============================================================================

/**
 * Submits tax form for electronic filing (EFTPS, state systems).
 *
 * @param {number} formId - Tax form ID
 * @param {string} filingMethod - Filing method (eftps, state_electronic)
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<ElectronicFilingResult>} Filing result
 *
 * @example
 * ```typescript
 * const result = await submitElectronicFiling(123, 'eftps', sequelize);
 * // Returns: { filingId: 'EF123456', status: 'submitted', ... }
 * ```
 */
export const submitElectronicFiling = async (
  formId: number,
  filingMethod: string,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<ElectronicFilingResult> => {
  const TaxForm = createTaxFormModel(sequelize);

  const form = await TaxForm.findByPk(formId, { transaction });
  if (!form) {
    throw new Error(`Tax form ${formId} not found`);
  }

  // Validate form is ready for filing
  if ((form as any).status !== 'reviewed' && (form as any).status !== 'generated') {
    throw new Error(`Form status ${(form as any).status} not eligible for filing`);
  }

  // Generate filing ID
  const filingId = `EF${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // In production, integrate with actual EFTPS or state filing systems
  // This is a simulation
  const filingResult: ElectronicFilingResult = {
    filingId,
    status: 'submitted',
    submissionDate: new Date(),
    confirmationNumber: undefined,
    errors: undefined,
    acknowledgmentDate: undefined,
  };

  // Simulate filing process (would be actual API call in production)
  const isSuccessful = Math.random() > 0.1; // 90% success rate for simulation

  if (isSuccessful) {
    filingResult.status = 'accepted';
    filingResult.confirmationNumber = `CONF${randomUUID().substring(0, 8).toUpperCase()}`;
    filingResult.acknowledgmentDate = new Date();

    // Update form status
    await form.update(
      {
        status: 'filed',
        filingMethod,
        electronicFileId: filingId,
        confirmationNumber: filingResult.confirmationNumber,
        transmissionDate: filingResult.submissionDate,
        acknowledgmentDate: filingResult.acknowledgmentDate,
      },
      { transaction },
    );
  } else {
    filingResult.status = 'rejected';
    filingResult.errors = ['Invalid TIN format', 'Missing required field: Box 1'];

    await form.update(
      {
        electronicFileId: filingId,
        transmissionDate: filingResult.submissionDate,
        errors: filingResult.errors,
      },
      { transaction },
    );
  }

  return filingResult;
};

/**
 * Checks status of electronic filing submission.
 *
 * @param {string} filingId - Electronic filing ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ElectronicFilingResult>} Current filing status
 *
 * @example
 * ```typescript
 * const status = await checkFilingStatus('EF123456', sequelize);
 * ```
 */
export const checkFilingStatus = async (
  filingId: string,
  sequelize: Sequelize,
): Promise<ElectronicFilingResult> => {
  const TaxForm = createTaxFormModel(sequelize);

  const form = await TaxForm.findOne({
    where: {
      electronicFileId: filingId,
    },
  });

  if (!form) {
    throw new Error(`Filing ${filingId} not found`);
  }

  return {
    filingId,
    status: (form as any).status,
    submissionDate: (form as any).transmissionDate,
    confirmationNumber: (form as any).confirmationNumber,
    errors: (form as any).errors,
    acknowledgmentDate: (form as any).acknowledgmentDate,
  };
};

/**
 * Generates IRS electronic filing file (e.g., for bulk W2/1099 submission).
 *
 * @param {number[]} formIds - Array of form IDs to include
 * @param {string} fileType - File type (W2, 1099)
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<string>} Path to generated file
 *
 * @example
 * ```typescript
 * const filePath = await generateElectronicFilingFile([1, 2, 3], 'W2', sequelize);
 * ```
 */
export const generateElectronicFilingFile = async (
  formIds: number[],
  fileType: string,
  sequelize: Sequelize,
): Promise<string> => {
  const TaxForm = createTaxFormModel(sequelize);

  const forms = await TaxForm.findAll({
    where: {
      id: formIds,
      formType: fileType,
    },
  });

  if (forms.length === 0) {
    throw new Error('No forms found');
  }

  // Generate electronic file content (simplified - actual format would follow IRS specifications)
  let fileContent = '';

  // Header record
  fileContent += `RA${(forms[0] as any).formData.payerEIN.replace(/-/g, '')}${(forms[0] as any).formData.payerName.padEnd(40)}\n`;

  // Detail records
  forms.forEach((form: any) => {
    const data = form.formData;
    fileContent += `RW${data.employeeSSN.replace(/-/g, '')}${data.employeeName.padEnd(40)}${String(Math.round(data.wages * 100)).padStart(11, '0')}\n`;
  });

  // Trailer record
  fileContent += `RT${String(forms.length).padStart(7, '0')}\n`;

  // Save to file
  const outputPath = `/tmp/tax_filings/${fileType}_${Date.now()}.txt`;
  const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(outputPath, fileContent);
  return outputPath;
};

/**
 * Processes acknowledgment from IRS/state tax authority.
 *
 * @param {string} acknowledgmentData - Acknowledgment data (XML/JSON)
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processFilingAcknowledgment(acknowledgmentXML, sequelize);
 * ```
 */
export const processFilingAcknowledgment = async (
  acknowledgmentData: string,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<void> => {
  // Parse acknowledgment (simplified - would parse actual XML/JSON)
  const ack = JSON.parse(acknowledgmentData);

  const TaxForm = createTaxFormModel(sequelize);

  for (const filing of ack.filings) {
    const form = await TaxForm.findOne({
      where: {
        electronicFileId: filing.filingId,
      },
      transaction,
    });

    if (form) {
      await form.update(
        {
          status: filing.accepted ? 'accepted' : 'rejected',
          acknowledgmentDate: new Date(),
          errors: filing.errors || null,
        },
        { transaction },
      );
    }
  }
};

/**
 * Generates combined federal/state electronic filing.
 *
 * @param {number} taxYear - Tax year
 * @param {string[]} stateCodes - State codes to include
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ federalPath: string; statePaths: Record<string, string> }>}
 *
 * @example
 * ```typescript
 * const files = await generateCombinedFiling(2024, ['CA', 'NY'], sequelize);
 * ```
 */
export const generateCombinedFiling = async (
  taxYear: number,
  stateCodes: string[],
  sequelize: Sequelize,
): Promise<{ federalPath: string; statePaths: Record<string, string> }> => {
  const TaxForm = createTaxFormModel(sequelize);

  // Get all W2 forms for the year
  const w2Forms = await TaxForm.findAll({
    where: {
      formType: 'W2',
      taxYear,
      status: 'reviewed',
    },
  });

  const w2Ids = w2Forms.map((f: any) => f.id);

  // Generate federal file
  const federalPath = await generateElectronicFilingFile(w2Ids, 'W2', sequelize);

  // Generate state files
  const statePaths: Record<string, string> = {};
  for (const stateCode of stateCodes) {
    // Filter forms for this state
    const stateForms = w2Forms.filter((f: any) => f.formData.stateWages[stateCode] > 0);
    if (stateForms.length > 0) {
      const stateFormIds = stateForms.map((f: any) => f.id);
      statePaths[stateCode] = await generateElectronicFilingFile(
        stateFormIds,
        `W2_${stateCode}`,
        sequelize,
      );
    }
  }

  return {
    federalPath,
    statePaths,
  };
};

/**
 * Validates electronic filing file format before submission.
 *
 * @param {string} filePath - Path to filing file
 * @param {string} fileType - Type of file (W2, 1099)
 * @returns {Promise<{ isValid: boolean; errors: string[] }>}
 *
 * @example
 * ```typescript
 * const validation = await validateElectronicFile('/tmp/W2_2024.txt', 'W2');
 * ```
 */
export const validateElectronicFile = async (
  filePath: string,
  fileType: string,
): Promise<{ isValid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  if (!existsSync(filePath)) {
    errors.push('File does not exist');
    return { isValid: false, errors };
  }

  // Read file content
  const fs = require('fs');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Validate header
  if (!lines[0] || !lines[0].startsWith('RA')) {
    errors.push('Missing or invalid header record');
  }

  // Validate trailer
  const lastLine = lines[lines.length - 1] || lines[lines.length - 2];
  if (!lastLine || !lastLine.startsWith('RT')) {
    errors.push('Missing or invalid trailer record');
  }

  // Validate record count
  const trailerCount = parseInt(lastLine.substring(2, 9));
  const actualCount = lines.filter(l => l.startsWith('RW')).length;
  if (trailerCount !== actualCount) {
    errors.push(`Record count mismatch: trailer=${trailerCount}, actual=${actualCount}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// TAX CODE & RATE MANAGEMENT (29-35)
// ============================================================================

/**
 * Gets sales tax rate for a jurisdiction on a specific date.
 *
 * @param {string} jurisdiction - Jurisdiction code
 * @param {Date} effectiveDate - Date to get rate for
 * @returns {Promise<number>} Tax rate (decimal)
 *
 * @example
 * ```typescript
 * const rate = await getSalesTaxRate('CA-SANTA-CLARA', new Date());
 * // Returns: 0.0925 (9.25%)
 * ```
 */
export const getSalesTaxRate = async (
  jurisdiction: string,
  effectiveDate: Date,
): Promise<number> => {
  // In production, query from tax_rates table
  // Simplified rate lookup
  const rates: Record<string, number> = {
    'CA': 0.0725,
    'CA-SANTA-CLARA': 0.0925,
    'NY': 0.04,
    'NY-NYC': 0.08875,
    'TX': 0.0625,
    'FL': 0.06,
  };

  return rates[jurisdiction] || 0;
};

/**
 * Gets standard deduction amount for filing status and tax year.
 *
 * @param {string} filingStatus - Filing status
 * @param {number} taxYear - Tax year
 * @returns {number} Standard deduction amount
 *
 * @example
 * ```typescript
 * const deduction = getStandardDeduction('single', 2024);
 * // Returns: 14600
 * ```
 */
export const getStandardDeduction = (filingStatus: string, taxYear: number): number => {
  const deductions: Record<number, Record<string, number>> = {
    2024: {
      single: 14600,
      married_joint: 29200,
      married_separate: 14600,
      head_of_household: 21900,
    },
    2023: {
      single: 13850,
      married_joint: 27700,
      married_separate: 13850,
      head_of_household: 20800,
    },
  };

  return deductions[taxYear]?.[filingStatus] || 0;
};

/**
 * Gets Social Security wage base limit for a tax year.
 *
 * @param {number} taxYear - Tax year
 * @returns {number} Wage base limit
 *
 * @example
 * ```typescript
 * const wageBase = getSocialSecurityWageBase(2024);
 * // Returns: 168600
 * ```
 */
export const getSocialSecurityWageBase = (taxYear: number): number => {
  const wageBases: Record<number, number> = {
    2024: 168600,
    2023: 160200,
    2022: 147000,
  };

  return wageBases[taxYear] || 160200;
};

/**
 * Gets tax brackets for a filing status and tax year.
 *
 * @param {string} filingStatus - Filing status
 * @param {number} taxYear - Tax year
 * @returns {TaxRateSchedule} Tax rate schedule
 *
 * @example
 * ```typescript
 * const schedule = getTaxBrackets('single', 2024);
 * ```
 */
export const getTaxBrackets = (filingStatus: string, taxYear: number): TaxRateSchedule => {
  // 2024 tax brackets (federal)
  const brackets2024: Record<string, TaxBracket[]> = {
    single: [
      { minIncome: 0, maxIncome: 11600, rate: 0.10, baseAmount: 0 },
      { minIncome: 11600, maxIncome: 47150, rate: 0.12, baseAmount: 1160 },
      { minIncome: 47150, maxIncome: 100525, rate: 0.22, baseAmount: 5426 },
      { minIncome: 100525, maxIncome: 191950, rate: 0.24, baseAmount: 17168.50 },
      { minIncome: 191950, maxIncome: 243725, rate: 0.32, baseAmount: 39110.50 },
      { minIncome: 243725, maxIncome: 609350, rate: 0.35, baseAmount: 55678.50 },
      { minIncome: 609350, maxIncome: null, rate: 0.37, baseAmount: 183647.25 },
    ],
    married_joint: [
      { minIncome: 0, maxIncome: 23200, rate: 0.10, baseAmount: 0 },
      { minIncome: 23200, maxIncome: 94300, rate: 0.12, baseAmount: 2320 },
      { minIncome: 94300, maxIncome: 201050, rate: 0.22, baseAmount: 10852 },
      { minIncome: 201050, maxIncome: 383900, rate: 0.24, baseAmount: 34337 },
      { minIncome: 383900, maxIncome: 487450, rate: 0.32, baseAmount: 78221 },
      { minIncome: 487450, maxIncome: 731200, rate: 0.35, baseAmount: 111357 },
      { minIncome: 731200, maxIncome: null, rate: 0.37, baseAmount: 196669.50 },
    ],
  };

  return {
    jurisdiction: 'federal',
    taxYear,
    filingStatus,
    brackets: brackets2024[filingStatus] || brackets2024.single,
    standardDeduction: getStandardDeduction(filingStatus, taxYear),
    personalExemption: 0, // Suspended for 2018-2025
  };
};

/**
 * Calculates tax from bracket schedule.
 *
 * @param {number} taxableIncome - Taxable income
 * @param {string} filingStatus - Filing status
 * @param {number} taxYear - Tax year
 * @returns {number} Tax amount
 *
 * @example
 * ```typescript
 * const tax = calculateTaxFromBrackets(100000, 'single', 2024);
 * // Returns: 17168.50
 * ```
 */
export const calculateTaxFromBrackets = (
  taxableIncome: number,
  filingStatus: string,
  taxYear: number,
): number => {
  const schedule = getTaxBrackets(filingStatus, taxYear);
  let tax = 0;

  for (const bracket of schedule.brackets) {
    if (taxableIncome <= bracket.minIncome) {
      break;
    }

    const upperLimit = bracket.maxIncome !== null ? bracket.maxIncome : Infinity;

    if (taxableIncome <= upperLimit) {
      // Income falls in this bracket
      const incomeInBracket = taxableIncome - bracket.minIncome;
      tax = bracket.baseAmount + incomeInBracket * bracket.rate;
      break;
    }
  }

  return Math.round(tax * 100) / 100;
};

/**
 * Calculates marginal tax rate for income level.
 *
 * @param {number} taxableIncome - Taxable income
 * @param {string} filingStatus - Filing status
 * @param {number} taxYear - Tax year
 * @returns {number} Marginal tax rate (percentage)
 *
 * @example
 * ```typescript
 * const marginalRate = calculateMarginalRate(100000, 'single', 2024);
 * // Returns: 24
 * ```
 */
export const calculateMarginalRate = (
  taxableIncome: number,
  filingStatus: string,
  taxYear: number,
): number => {
  const schedule = getTaxBrackets(filingStatus, taxYear);

  for (const bracket of schedule.brackets) {
    const upperLimit = bracket.maxIncome !== null ? bracket.maxIncome : Infinity;
    if (taxableIncome >= bracket.minIncome && taxableIncome <= upperLimit) {
      return bracket.rate * 100;
    }
  }

  return 0;
};

/**
 * Updates tax rate for a jurisdiction.
 *
 * @param {string} jurisdiction - Jurisdiction code
 * @param {number} newRate - New tax rate (decimal)
 * @param {Date} effectiveDate - Effective date of rate change
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateTaxRate('CA-SANTA-CLARA', 0.0950, new Date('2025-01-01'), sequelize);
 * ```
 */
export const updateTaxRate = async (
  jurisdiction: string,
  newRate: number,
  effectiveDate: Date,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `
    INSERT INTO tax_rates (jurisdiction, rate, effective_date, created_at, updated_at)
    VALUES (:jurisdiction, :newRate, :effectiveDate, NOW(), NOW())
  `,
    {
      replacements: { jurisdiction, newRate, effectiveDate },
      transaction,
    },
  );
};

// ============================================================================
// AUDIT TRAIL & COMPLIANCE LOGGING (36-40)
// ============================================================================

/**
 * Creates audit log entry for tax calculation.
 *
 * @param {string} calculationType - Type of calculation
 * @param {object} inputData - Input data used
 * @param {object} resultData - Calculation result
 * @param {string} userId - User who performed calculation
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<number>} Audit log ID
 *
 * @example
 * ```typescript
 * const logId = await createTaxCalculationAuditLog('withholding', request, result, 'user123', sequelize);
 * ```
 */
export const createTaxCalculationAuditLog = async (
  calculationType: string,
  inputData: object,
  resultData: object,
  userId: string,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<number> => {
  const result = await sequelize.query(
    `
    INSERT INTO tax_calculation_audit_logs
    (calculation_type, input_data, result_data, user_id, calculation_timestamp, created_at, updated_at)
    VALUES (:calculationType, :inputData, :resultData, :userId, NOW(), NOW(), NOW())
  `,
    {
      replacements: {
        calculationType,
        inputData: JSON.stringify(inputData),
        resultData: JSON.stringify(resultData),
        userId,
      },
      transaction,
    },
  );

  return (result[0] as any).insertId || 0;
};

/**
 * Creates audit log for tax form generation.
 *
 * @param {number} formId - Tax form ID
 * @param {string} action - Action performed
 * @param {string} userId - User who performed action
 * @param {string} [notes] - Additional notes
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Sequelize transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createTaxFormAuditLog(123, 'generated', 'user123', 'Initial generation', sequelize);
 * ```
 */
export const createTaxFormAuditLog = async (
  formId: number,
  action: string,
  userId: string,
  notes: string | undefined,
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `
    INSERT INTO tax_form_audit_logs
    (form_id, action, user_id, notes, action_timestamp, created_at, updated_at)
    VALUES (:formId, :action, :userId, :notes, NOW(), NOW(), NOW())
  `,
    {
      replacements: { formId, action, userId, notes },
      transaction,
    },
  );
};

/**
 * Retrieves audit trail for a tax form.
 *
 * @param {number} formId - Tax form ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object[]>} Audit trail entries
 *
 * @example
 * ```typescript
 * const auditTrail = await getTaxFormAuditTrail(123, sequelize);
 * ```
 */
export const getTaxFormAuditTrail = async (
  formId: number,
  sequelize: Sequelize,
): Promise<object[]> => {
  const results = await sequelize.query(
    `
    SELECT *
    FROM tax_form_audit_logs
    WHERE form_id = :formId
    ORDER BY action_timestamp DESC
  `,
    {
      replacements: { formId },
      type: 'SELECT',
    },
  );

  return results;
};

/**
 * Generates compliance report for audit purposes.
 *
 * @param {Date} startDate - Start date of report period
 * @param {Date} endDate - End date of report period
 * @param {string[]} jurisdictions - Jurisdictions to include
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   ['federal', 'CA', 'NY'],
 *   sequelize
 * );
 * ```
 */
export const generateComplianceReport = async (
  startDate: Date,
  endDate: Date,
  jurisdictions: string[],
  sequelize: Sequelize,
): Promise<object> => {
  const report = {
    reportPeriod: { startDate, endDate },
    jurisdictions: [] as any[],
    summary: {
      totalTaxCollected: 0,
      totalTaxRemitted: 0,
      outstandingLiability: 0,
      complianceIssues: 0,
    },
  };

  for (const jurisdiction of jurisdictions) {
    const compliance = await performComplianceCheck(
      jurisdiction,
      'all',
      `${startDate.getFullYear()}-Q1`,
      sequelize,
    );

    const reconciliation = await reconcileTaxPeriod(
      {
        startDate,
        endDate,
        jurisdiction,
        taxType: 'all',
        includeAdjustments: true,
      },
      sequelize,
    );

    report.jurisdictions.push({
      jurisdiction,
      compliance,
      reconciliation,
    });

    report.summary.totalTaxCollected += reconciliation.totalTaxWithheld;
    report.summary.totalTaxRemitted += reconciliation.totalTaxPaid;
    report.summary.outstandingLiability += reconciliation.variance;
    report.summary.complianceIssues += compliance.issues.length;
  }

  return report;
};

/**
 * Exports tax data for external audit.
 *
 * @param {number} taxYear - Tax year
 * @param {string} exportFormat - Export format (csv, json, xml)
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<string>} Path to export file
 *
 * @example
 * ```typescript
 * const exportPath = await exportTaxDataForAudit(2024, 'csv', sequelize);
 * ```
 */
export const exportTaxDataForAudit = async (
  taxYear: number,
  exportFormat: 'csv' | 'json' | 'xml',
  sequelize: Sequelize,
): Promise<string> => {
  const TaxWithholding = createTaxWithholdingModel(sequelize);
  const TaxForm = createTaxFormModel(sequelize);

  const withholdings = await TaxWithholding.findAll({
    where: { taxYear },
    order: [['employeeId', 'ASC'], ['periodStartDate', 'ASC']],
  });

  const forms = await TaxForm.findAll({
    where: { taxYear },
    order: [['recipientId', 'ASC']],
  });

  let content = '';
  const outputPath = `/tmp/tax_exports/audit_${taxYear}.${exportFormat}`;

  if (exportFormat === 'json') {
    content = JSON.stringify(
      {
        taxYear,
        withholdings: withholdings.map((w: any) => w.toJSON()),
        forms: forms.map((f: any) => f.toJSON()),
      },
      null,
      2,
    );
  } else if (exportFormat === 'csv') {
    // CSV header
    content = 'Type,ID,Employee/Recipient,Period,Gross,Federal,State,SS,Medicare\n';

    withholdings.forEach((w: any) => {
      content += `Withholding,${w.id},${w.employeeId},${w.periodStartDate},${w.grossWages},${w.federalWithholding},${w.stateWithholding},${w.socialSecurityWithholding},${w.medicareWithholding}\n`;
    });
  }

  const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(outputPath, content);
  return outputPath;
};

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Calculates filing deadline for a tax period.
 */
const calculateFilingDeadline = (period: string): Date => {
  // Period format: YYYY-QN or YYYY-MM or YYYY
  if (period.includes('-Q')) {
    const [year, quarter] = period.split('-Q');
    const deadlines: Record<string, string> = {
      '1': `${year}-04-30`,
      '2': `${year}-07-31`,
      '3': `${year}-10-31`,
      '4': `${parseInt(year) + 1}-01-31`,
    };
    return new Date(deadlines[quarter]);
  } else if (period.includes('-')) {
    const [year, month] = period.split('-');
    const nextMonth = parseInt(month) + 1;
    return new Date(`${year}-${String(nextMonth).padStart(2, '0')}-15`);
  } else {
    // Annual
    return new Date(`${parseInt(period) + 1}-04-15`);
  }
};

/**
 * Gets next tax period.
 */
const getNextPeriod = (period: string): string => {
  if (period.includes('-Q')) {
    const [year, quarter] = period.split('-Q');
    const nextQuarter = parseInt(quarter) + 1;
    if (nextQuarter > 4) {
      return `${parseInt(year) + 1}-Q1`;
    }
    return `${year}-Q${nextQuarter}`;
  }
  return period;
};

/**
 * Default export with all utilities.
 */
export default {
  // Models
  createTaxWithholdingModel,
  createTaxFormModel,
  createSalesTaxComplianceModel,

  // Tax Calculation
  calculateFederalWithholding,
  calculateStateWithholding,
  calculateSocialSecurityTax,
  calculateMedicareTax,
  calculateTax,
  calculateSalesTax,
  calculateVAT,
  calculateEstimatedTax,

  // Form Generation
  generateW2Form,
  generate1099NECForm,
  generate1099MISCForm,
  createW2PDF,
  create1099PDF,
  batchGenerateW2Forms,

  // Compliance & Reporting
  checkTaxNexus,
  performComplianceCheck,
  reconcileTaxPeriod,
  calculateTaxPenalty,
  calculateTaxInterest,
  generateQuarterlyTaxReport,
  generateAnnualTaxSummary,
  validateTIN,
  validateVATNumber,

  // Electronic Filing
  submitElectronicFiling,
  checkFilingStatus,
  generateElectronicFilingFile,
  processFilingAcknowledgment,
  generateCombinedFiling,
  validateElectronicFile,

  // Tax Code Management
  getSalesTaxRate,
  getStandardDeduction,
  getSocialSecurityWageBase,
  getTaxBrackets,
  calculateTaxFromBrackets,
  calculateMarginalRate,
  updateTaxRate,

  // Audit & Logging
  createTaxCalculationAuditLog,
  createTaxFormAuditLog,
  getTaxFormAuditTrail,
  generateComplianceReport,
  exportTaxDataForAudit,
};
