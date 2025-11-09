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
import { Sequelize, Transaction } from 'sequelize';
interface TaxCalculationRequest {
    grossAmount: number;
    taxableAmount?: number;
    taxYear: number;
    jurisdiction: 'federal' | 'state' | 'local' | 'all';
    jurisdictionCode?: string;
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
    boxes?: Record<string, any>;
}
interface Form1099Data {
    recipientId: string;
    recipientName: string;
    recipientTIN: string;
    recipientAddress: string;
    payerEIN: string;
    payerName: string;
    payerAddress: string;
    formType: '1099-MISC' | '1099-NEC' | '1099-INT' | '1099-DIV' | '1099-K';
    amount: number;
    federalWithheld?: number;
    stateWithheld?: Record<string, number>;
    taxYear: number;
    boxes?: Record<string, any>;
}
interface SalesTaxRequest {
    amount: number;
    jurisdiction: string;
    productCategory?: string;
    isExempt: boolean;
    exemptionCertificate?: string;
    shipToAddress?: Address;
    shipFromAddress?: Address;
    taxDate: Date;
}
interface VATCalculationRequest {
    netAmount: number;
    vatRate: number;
    vatRegion: string;
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
export declare const createTaxWithholdingModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        employeeId: string;
        taxYear: number;
        periodStartDate: Date;
        periodEndDate: Date;
        grossWages: number;
        taxableWages: number;
        federalWithholding: number;
        stateWithholding: number;
        localWithholding: number;
        socialSecurityWithholding: number;
        medicareWithholding: number;
        additionalMedicareWithholding: number;
        jurisdiction: string;
        jurisdictionCode: string | null;
        w4Data: W4FormData;
        calculationMethod: string;
        overrideReason: string | null;
        verified: boolean;
        verifiedBy: string | null;
        verifiedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
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
export declare const createTaxFormModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        recipientId: string;
        recipientType: string;
        formType: string;
        taxYear: number;
        formData: W2FormData | Form1099Data | Record<string, any>;
        generatedDate: Date;
        filedDate: Date | null;
        correctedFormId: number | null;
        status: string;
        filingMethod: string | null;
        confirmationNumber: string | null;
        pdfPath: string | null;
        electronicFileId: string | null;
        transmissionDate: Date | null;
        acknowledgmentDate: Date | null;
        errors: string[] | null;
        correctionReason: string | null;
        generatedBy: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
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
export declare const createSalesTaxComplianceModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        jurisdiction: string;
        jurisdictionType: string;
        taxPeriod: string;
        startDate: Date;
        endDate: Date;
        totalSales: number;
        taxableAmount: number;
        exemptAmount: number;
        taxCollected: number;
        taxRemitted: number;
        hasNexus: boolean;
        nexusType: string | null;
        registrationNumber: string | null;
        filingFrequency: string;
        filingDeadline: Date;
        filingStatus: string;
        filedDate: Date | null;
        returnId: string | null;
        penaltyAmount: number;
        interestAmount: number;
        adjustments: TaxAdjustment[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
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
export declare const calculateFederalWithholding: (grossWages: number, payFrequency: "weekly" | "biweekly" | "semimonthly" | "monthly", w4Data: W4FormData, taxYear: number) => number;
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
export declare const calculateStateWithholding: (grossWages: number, stateCode: string, payFrequency: "weekly" | "biweekly" | "semimonthly" | "monthly", w4Data: W4FormData, taxYear: number) => number;
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
export declare const calculateSocialSecurityTax: (grossWages: number, ytdWages: number, taxYear: number) => number;
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
export declare const calculateMedicareTax: (grossWages: number, ytdWages: number, filingStatus: string) => {
    regularMedicare: number;
    additionalMedicare: number;
    total: number;
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
export declare const calculateTax: (request: TaxCalculationRequest, sequelize: Sequelize) => Promise<TaxCalculationResult>;
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
export declare const calculateSalesTax: (request: SalesTaxRequest) => Promise<number>;
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
export declare const calculateVAT: (request: VATCalculationRequest) => {
    netAmount: number;
    vatAmount: number;
    grossAmount: number;
    isReverseCharge: boolean;
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
export declare const calculateEstimatedTax: (estimatedAnnualIncome: number, estimatedDeductions: number, filingStatus: string, taxYear: number) => {
    quarterlyPayment: number;
    annualTax: number;
    selfEmploymentTax: number;
};
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
export declare const generateW2Form: (employeeId: string, taxYear: number, sequelize: Sequelize) => Promise<W2FormData>;
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
export declare const generate1099NECForm: (recipientId: string, taxYear: number, sequelize: Sequelize) => Promise<Form1099Data>;
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
export declare const generate1099MISCForm: (recipientId: string, taxYear: number, sequelize: Sequelize) => Promise<Form1099Data>;
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
export declare const createW2PDF: (w2Data: W2FormData, outputPath: string) => Promise<string>;
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
export declare const create1099PDF: (form1099Data: Form1099Data, outputPath: string) => Promise<string>;
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
export declare const batchGenerateW2Forms: (taxYear: number, sequelize: Sequelize) => Promise<Array<{
    employeeId: string;
    formId: number;
    pdfPath: string;
}>>;
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
export declare const checkTaxNexus: (jurisdiction: string, checkDate: Date, sequelize: Sequelize) => Promise<TaxNexusResult>;
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
export declare const performComplianceCheck: (jurisdiction: string, taxType: string, period: string, sequelize: Sequelize) => Promise<TaxComplianceCheck>;
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
export declare const reconcileTaxPeriod: (request: TaxReconciliationRequest, sequelize: Sequelize) => Promise<TaxReconciliationResult>;
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
export declare const calculateTaxPenalty: (taxAmount: number, dueDate: Date, paidDate: Date, jurisdictionCode: string) => {
    penalty: number;
    interest: number;
    total: number;
    daysLate: number;
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
export declare const calculateTaxInterest: (underpaymentAmount: number, fromDate: Date, toDate: Date, annualRate: number) => number;
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
export declare const generateQuarterlyTaxReport: (quarter: string, year: number, sequelize: Sequelize) => Promise<object>;
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
export declare const generateAnnualTaxSummary: (taxYear: number, sequelize: Sequelize) => Promise<object>;
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
export declare const validateTIN: (tin: string, tinType: "SSN" | "EIN") => boolean;
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
export declare const validateVATNumber: (vatNumber: string, countryCode: string) => boolean;
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
export declare const submitElectronicFiling: (formId: number, filingMethod: string, sequelize: Sequelize, transaction?: Transaction) => Promise<ElectronicFilingResult>;
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
export declare const checkFilingStatus: (filingId: string, sequelize: Sequelize) => Promise<ElectronicFilingResult>;
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
export declare const generateElectronicFilingFile: (formIds: number[], fileType: string, sequelize: Sequelize) => Promise<string>;
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
export declare const processFilingAcknowledgment: (acknowledgmentData: string, sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
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
export declare const generateCombinedFiling: (taxYear: number, stateCodes: string[], sequelize: Sequelize) => Promise<{
    federalPath: string;
    statePaths: Record<string, string>;
}>;
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
export declare const validateElectronicFile: (filePath: string, fileType: string) => Promise<{
    isValid: boolean;
    errors: string[];
}>;
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
export declare const getSalesTaxRate: (jurisdiction: string, effectiveDate: Date) => Promise<number>;
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
export declare const getStandardDeduction: (filingStatus: string, taxYear: number) => number;
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
export declare const getSocialSecurityWageBase: (taxYear: number) => number;
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
export declare const getTaxBrackets: (filingStatus: string, taxYear: number) => TaxRateSchedule;
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
export declare const calculateTaxFromBrackets: (taxableIncome: number, filingStatus: string, taxYear: number) => number;
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
export declare const calculateMarginalRate: (taxableIncome: number, filingStatus: string, taxYear: number) => number;
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
export declare const updateTaxRate: (jurisdiction: string, newRate: number, effectiveDate: Date, sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
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
export declare const createTaxCalculationAuditLog: (calculationType: string, inputData: object, resultData: object, userId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<number>;
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
export declare const createTaxFormAuditLog: (formId: number, action: string, userId: string, notes: string | undefined, sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
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
export declare const getTaxFormAuditTrail: (formId: number, sequelize: Sequelize) => Promise<object[]>;
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
export declare const generateComplianceReport: (startDate: Date, endDate: Date, jurisdictions: string[], sequelize: Sequelize) => Promise<object>;
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
export declare const exportTaxDataForAudit: (taxYear: number, exportFormat: "csv" | "json" | "xml", sequelize: Sequelize) => Promise<string>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createTaxWithholdingModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            employeeId: string;
            taxYear: number;
            periodStartDate: Date;
            periodEndDate: Date;
            grossWages: number;
            taxableWages: number;
            federalWithholding: number;
            stateWithholding: number;
            localWithholding: number;
            socialSecurityWithholding: number;
            medicareWithholding: number;
            additionalMedicareWithholding: number;
            jurisdiction: string;
            jurisdictionCode: string | null;
            w4Data: W4FormData;
            calculationMethod: string;
            overrideReason: string | null;
            verified: boolean;
            verifiedBy: string | null;
            verifiedAt: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createTaxFormModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            recipientId: string;
            recipientType: string;
            formType: string;
            taxYear: number;
            formData: W2FormData | Form1099Data | Record<string, any>;
            generatedDate: Date;
            filedDate: Date | null;
            correctedFormId: number | null;
            status: string;
            filingMethod: string | null;
            confirmationNumber: string | null;
            pdfPath: string | null;
            electronicFileId: string | null;
            transmissionDate: Date | null;
            acknowledgmentDate: Date | null;
            errors: string[] | null;
            correctionReason: string | null;
            generatedBy: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createSalesTaxComplianceModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            jurisdiction: string;
            jurisdictionType: string;
            taxPeriod: string;
            startDate: Date;
            endDate: Date;
            totalSales: number;
            taxableAmount: number;
            exemptAmount: number;
            taxCollected: number;
            taxRemitted: number;
            hasNexus: boolean;
            nexusType: string | null;
            registrationNumber: string | null;
            filingFrequency: string;
            filingDeadline: Date;
            filingStatus: string;
            filedDate: Date | null;
            returnId: string | null;
            penaltyAmount: number;
            interestAmount: number;
            adjustments: TaxAdjustment[];
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    calculateFederalWithholding: (grossWages: number, payFrequency: "weekly" | "biweekly" | "semimonthly" | "monthly", w4Data: W4FormData, taxYear: number) => number;
    calculateStateWithholding: (grossWages: number, stateCode: string, payFrequency: "weekly" | "biweekly" | "semimonthly" | "monthly", w4Data: W4FormData, taxYear: number) => number;
    calculateSocialSecurityTax: (grossWages: number, ytdWages: number, taxYear: number) => number;
    calculateMedicareTax: (grossWages: number, ytdWages: number, filingStatus: string) => {
        regularMedicare: number;
        additionalMedicare: number;
        total: number;
    };
    calculateTax: (request: TaxCalculationRequest, sequelize: Sequelize) => Promise<TaxCalculationResult>;
    calculateSalesTax: (request: SalesTaxRequest) => Promise<number>;
    calculateVAT: (request: VATCalculationRequest) => {
        netAmount: number;
        vatAmount: number;
        grossAmount: number;
        isReverseCharge: boolean;
    };
    calculateEstimatedTax: (estimatedAnnualIncome: number, estimatedDeductions: number, filingStatus: string, taxYear: number) => {
        quarterlyPayment: number;
        annualTax: number;
        selfEmploymentTax: number;
    };
    generateW2Form: (employeeId: string, taxYear: number, sequelize: Sequelize) => Promise<W2FormData>;
    generate1099NECForm: (recipientId: string, taxYear: number, sequelize: Sequelize) => Promise<Form1099Data>;
    generate1099MISCForm: (recipientId: string, taxYear: number, sequelize: Sequelize) => Promise<Form1099Data>;
    createW2PDF: (w2Data: W2FormData, outputPath: string) => Promise<string>;
    create1099PDF: (form1099Data: Form1099Data, outputPath: string) => Promise<string>;
    batchGenerateW2Forms: (taxYear: number, sequelize: Sequelize) => Promise<Array<{
        employeeId: string;
        formId: number;
        pdfPath: string;
    }>>;
    checkTaxNexus: (jurisdiction: string, checkDate: Date, sequelize: Sequelize) => Promise<TaxNexusResult>;
    performComplianceCheck: (jurisdiction: string, taxType: string, period: string, sequelize: Sequelize) => Promise<TaxComplianceCheck>;
    reconcileTaxPeriod: (request: TaxReconciliationRequest, sequelize: Sequelize) => Promise<TaxReconciliationResult>;
    calculateTaxPenalty: (taxAmount: number, dueDate: Date, paidDate: Date, jurisdictionCode: string) => {
        penalty: number;
        interest: number;
        total: number;
        daysLate: number;
    };
    calculateTaxInterest: (underpaymentAmount: number, fromDate: Date, toDate: Date, annualRate: number) => number;
    generateQuarterlyTaxReport: (quarter: string, year: number, sequelize: Sequelize) => Promise<object>;
    generateAnnualTaxSummary: (taxYear: number, sequelize: Sequelize) => Promise<object>;
    validateTIN: (tin: string, tinType: "SSN" | "EIN") => boolean;
    validateVATNumber: (vatNumber: string, countryCode: string) => boolean;
    submitElectronicFiling: (formId: number, filingMethod: string, sequelize: Sequelize, transaction?: Transaction) => Promise<ElectronicFilingResult>;
    checkFilingStatus: (filingId: string, sequelize: Sequelize) => Promise<ElectronicFilingResult>;
    generateElectronicFilingFile: (formIds: number[], fileType: string, sequelize: Sequelize) => Promise<string>;
    processFilingAcknowledgment: (acknowledgmentData: string, sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
    generateCombinedFiling: (taxYear: number, stateCodes: string[], sequelize: Sequelize) => Promise<{
        federalPath: string;
        statePaths: Record<string, string>;
    }>;
    validateElectronicFile: (filePath: string, fileType: string) => Promise<{
        isValid: boolean;
        errors: string[];
    }>;
    getSalesTaxRate: (jurisdiction: string, effectiveDate: Date) => Promise<number>;
    getStandardDeduction: (filingStatus: string, taxYear: number) => number;
    getSocialSecurityWageBase: (taxYear: number) => number;
    getTaxBrackets: (filingStatus: string, taxYear: number) => TaxRateSchedule;
    calculateTaxFromBrackets: (taxableIncome: number, filingStatus: string, taxYear: number) => number;
    calculateMarginalRate: (taxableIncome: number, filingStatus: string, taxYear: number) => number;
    updateTaxRate: (jurisdiction: string, newRate: number, effectiveDate: Date, sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
    createTaxCalculationAuditLog: (calculationType: string, inputData: object, resultData: object, userId: string, sequelize: Sequelize, transaction?: Transaction) => Promise<number>;
    createTaxFormAuditLog: (formId: number, action: string, userId: string, notes: string | undefined, sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
    getTaxFormAuditTrail: (formId: number, sequelize: Sequelize) => Promise<object[]>;
    generateComplianceReport: (startDate: Date, endDate: Date, jurisdictions: string[], sequelize: Sequelize) => Promise<object>;
    exportTaxDataForAudit: (taxYear: number, exportFormat: "csv" | "json" | "xml", sequelize: Sequelize) => Promise<string>;
};
export default _default;
//# sourceMappingURL=tax-management-compliance-kit.d.ts.map