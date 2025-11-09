/**
 * LOC: TAXREV1234567
 * File: /reuse/government/tax-revenue-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (database ORM)
 *   - nestjs (framework utilities)
 *   - Node.js crypto, fs modules
 *
 * DOWNSTREAM (imported by):
 *   - ../backend/modules/government/revenue/*
 *   - ../backend/modules/government/tax-assessment/*
 *   - ../backend/modules/government/collections/*
 *   - API controllers for tax revenue management
 */
/**
 * File: /reuse/government/tax-revenue-management-kit.ts
 * Locator: WC-GOV-TAXREV-001
 * Purpose: Comprehensive Government Tax Revenue Management - property tax, sales tax, tax billing, collections, liens, abatements
 *
 * Upstream: Independent utility module for government tax revenue operations
 * Downstream: ../backend/*, tax assessment controllers, revenue services, collection modules, lien processing
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for property tax assessment, sales tax processing, tax billing, payment plans, delinquent tracking, lien processing
 *
 * LLM Context: Enterprise-grade government tax revenue management utilities for production-ready NestJS applications.
 * Provides property tax assessment and valuation, sales tax rate management, tax billing generation, payment plan creation,
 * delinquent tax tracking, tax lien filing and processing, tax exemption management, tax abatement tracking, revenue forecasting,
 * penalty and interest calculation, tax refund processing, installment payment management, tax sale processing, and comprehensive
 * audit trail generation for all government tax revenue operations.
 */
import { Sequelize, Transaction } from 'sequelize';
interface PropertyTaxAssessment {
    parcelId: string;
    propertyAddress: string;
    ownerName: string;
    ownerAddress: string;
    assessedLandValue: number;
    assessedImprovementValue: number;
    totalAssessedValue: number;
    taxableValue: number;
    exemptions: TaxExemption[];
    assessmentYear: number;
    assessmentDate: Date;
    assessor: string;
    propertyType: 'residential' | 'commercial' | 'industrial' | 'agricultural' | 'vacant' | 'mixed_use';
    landArea: number;
    buildingArea: number;
    yearBuilt?: number;
    zoning: string;
    neighborhood: string;
    taxDistrict: string;
    metadata?: Record<string, any>;
}
interface TaxExemption {
    exemptionType: string;
    exemptionCode: string;
    description: string;
    exemptionAmount: number;
    exemptionPercentage?: number;
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'expired' | 'revoked';
    certificateNumber?: string;
    approvedBy: string;
    approvalDate: Date;
    renewalRequired: boolean;
    renewalDate?: Date;
}
interface SpecialAssessment {
    assessmentType: string;
    description: string;
    amount: number;
    district?: string;
    purpose: string;
}
interface SalesTaxTransaction {
    transactionId: string;
    merchantId: string;
    merchantName: string;
    transactionDate: Date;
    saleAmount: number;
    taxableAmount: number;
    exemptAmount: number;
    taxRate: number;
    taxAmount: number;
    jurisdiction: string;
    category: string;
    paymentMethod: string;
    reportingPeriod: string;
    filedDate?: Date;
    status: 'pending' | 'filed' | 'paid' | 'overdue';
}
interface PaymentPlan {
    planId: string;
    taxBillId: string;
    parcelId: string;
    taxpayerName: string;
    totalAmount: number;
    downPayment: number;
    remainingBalance: number;
    numberOfInstallments: number;
    installmentAmount: number;
    installmentFrequency: 'monthly' | 'quarterly' | 'semiannual';
    startDate: Date;
    endDate: Date;
    status: 'active' | 'completed' | 'defaulted' | 'cancelled';
    installments: PaymentInstallment[];
    interestRate?: number;
    setupFee?: number;
    createdBy: string;
    createdDate: Date;
    approvedBy?: string;
    approvalDate?: Date;
}
interface PaymentInstallment {
    installmentNumber: number;
    dueDate: Date;
    amount: number;
    principal: number;
    interest: number;
    fees: number;
    paidDate?: Date;
    paidAmount?: number;
    status: 'pending' | 'paid' | 'partial' | 'late' | 'missed';
    lateFee?: number;
    paymentReference?: string;
}
interface DelinquentTax {
    delinquencyId: string;
    billId: string;
    parcelId: string;
    propertyOwner: string;
    propertyAddress: string;
    originalAmount: number;
    currentBalance: number;
    penaltiesAccrued: number;
    interestAccrued: number;
    totalOwed: number;
    delinquentSince: Date;
    yearsDelinquent: number;
    collectionStatus: 'new' | 'notice_sent' | 'payment_plan' | 'lien_filed' | 'foreclosure' | 'sale';
    lastContactDate?: Date;
    lastPaymentDate?: Date;
    assignedCollector?: string;
    collectionPriority: 'low' | 'medium' | 'high' | 'critical';
    lienId?: string;
    metadata?: Record<string, any>;
}
interface TaxAbatement {
    abatementId: string;
    parcelId: string;
    billId?: string;
    applicantName: string;
    abatementType: 'assessment_reduction' | 'tax_relief' | 'exemption' | 'credit';
    requestedAmount: number;
    approvedAmount?: number;
    reason: string;
    applicationDate: Date;
    reviewDate?: Date;
    approvalDate?: Date;
    status: 'pending' | 'under_review' | 'approved' | 'denied' | 'appealed';
    reviewer?: string;
    approver?: string;
    denialReason?: string;
    effectiveTaxYear: number;
    supportingDocuments: string[];
    appealDeadline?: Date;
    appealDate?: Date;
    appealStatus?: string;
    metadata?: Record<string, any>;
}
interface TaxRefund {
    refundId: string;
    billId: string;
    parcelId: string;
    taxpayerName: string;
    refundAmount: number;
    refundReason: 'overpayment' | 'abatement' | 'exemption_granted' | 'assessment_reduction' | 'duplicate_payment' | 'error';
    originalPaymentAmount: number;
    originalPaymentDate: Date;
    refundRequestDate: Date;
    approvalDate?: Date;
    refundDate?: Date;
    status: 'requested' | 'approved' | 'issued' | 'denied' | 'cancelled';
    paymentMethod: 'check' | 'ach' | 'credit_card_reversal';
    checkNumber?: string;
    approvedBy?: string;
    issuedBy?: string;
    denialReason?: string;
    fiscalYear: string;
    metadata?: Record<string, any>;
}
interface TaxForecast {
    forecastId: string;
    fiscalYear: string;
    jurisdiction: string;
    taxType: 'property' | 'sales' | 'business' | 'utility' | 'excise';
    forecastedRevenue: number;
    historicalAverage: number;
    growthRate: number;
    confidenceLevel: number;
    assumptions: string[];
    riskFactors: string[];
    forecastDate: Date;
    forecastedBy: string;
    methodology: string;
    scenarioType: 'conservative' | 'moderate' | 'optimistic';
    monthlyBreakdown?: MonthlyRevenue[];
}
interface MonthlyRevenue {
    month: string;
    forecastedAmount: number;
    actualAmount?: number;
    variance?: number;
}
interface PenaltyCalculation {
    penaltyType: 'late_payment' | 'delinquency' | 'lien_filing' | 'returned_payment' | 'failure_to_file';
    baseAmount: number;
    penaltyRate: number;
    penaltyAmount: number;
    startDate: Date;
    endDate?: Date;
    daysLate: number;
    calculationMethod: 'flat_rate' | 'percentage' | 'tiered' | 'daily_accrual';
    waived: boolean;
    waiverReason?: string;
    waivedBy?: string;
    waiverDate?: Date;
}
interface InterestCalculation {
    principal: number;
    interestRate: number;
    startDate: Date;
    endDate: Date;
    daysAccrued: number;
    interestAmount: number;
    calculationMethod: 'simple' | 'compound' | 'daily';
    compoundingFrequency?: 'daily' | 'monthly' | 'quarterly' | 'annual';
    totalWithInterest: number;
}
/**
 * Sequelize model for Property Tax Assessments with full valuation tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PropertyTaxAssessment model
 *
 * @example
 * ```typescript
 * const PropertyTaxAssessment = createPropertyTaxAssessmentModel(sequelize);
 * const assessment = await PropertyTaxAssessment.create({
 *   parcelId: 'PARC-2024-001',
 *   propertyAddress: '123 Main St',
 *   ownerName: 'John Doe',
 *   assessedLandValue: 150000.00,
 *   assessedImprovementValue: 250000.00,
 *   totalAssessedValue: 400000.00,
 *   assessmentYear: 2024,
 *   propertyType: 'residential'
 * });
 * ```
 *
 * @openapi
 * components:
 *   schemas:
 *     PropertyTaxAssessment:
 *       type: object
 *       required:
 *         - parcelId
 *         - propertyAddress
 *         - ownerName
 *         - totalAssessedValue
 *         - assessmentYear
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier
 *         parcelId:
 *           type: string
 *           maxLength: 50
 *           description: Unique parcel identifier
 *         propertyAddress:
 *           type: string
 *           maxLength: 500
 *           description: Full property address
 *         ownerName:
 *           type: string
 *           maxLength: 200
 *           description: Property owner name
 *         ownerAddress:
 *           type: string
 *           maxLength: 500
 *         assessedLandValue:
 *           type: number
 *           format: decimal
 *           description: Assessed value of land
 *         assessedImprovementValue:
 *           type: number
 *           format: decimal
 *           description: Assessed value of improvements
 *         totalAssessedValue:
 *           type: number
 *           format: decimal
 *           description: Total assessed value
 *         taxableValue:
 *           type: number
 *           format: decimal
 *           description: Taxable value after exemptions
 *         assessmentYear:
 *           type: integer
 *           description: Assessment year
 *         propertyType:
 *           type: string
 *           enum: [residential, commercial, industrial, agricultural, vacant, mixed_use]
 */
export declare const createPropertyTaxAssessmentModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        parcelId: string;
        propertyAddress: string;
        ownerName: string;
        ownerAddress: string;
        assessedLandValue: number;
        assessedImprovementValue: number;
        totalAssessedValue: number;
        taxableValue: number;
        exemptions: TaxExemption[];
        assessmentYear: number;
        assessmentDate: Date;
        assessor: string;
        propertyType: string;
        landArea: number;
        buildingArea: number;
        yearBuilt: number | null;
        zoning: string;
        neighborhood: string;
        taxDistrict: string;
        lastSaleDate: Date | null;
        lastSalePrice: number | null;
        appraisalMethod: string;
        marketValue: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Tax Bills with comprehensive billing and payment tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TaxBill model
 *
 * @example
 * ```typescript
 * const TaxBill = createTaxBillModel(sequelize);
 * const bill = await TaxBill.create({
 *   parcelId: 'PARC-2024-001',
 *   billNumber: 'BILL-2024-00001',
 *   billYear: 2024,
 *   assessedValue: 400000.00,
 *   millageRate: 0.025,
 *   baseTaxAmount: 10000.00,
 *   netTaxAmount: 9500.00,
 *   dueDate: new Date('2024-12-31')
 * });
 * ```
 *
 * @openapi
 * components:
 *   schemas:
 *     TaxBill:
 *       type: object
 *       required:
 *         - parcelId
 *         - billNumber
 *         - billYear
 *         - baseTaxAmount
 *         - dueDate
 *       properties:
 *         id:
 *           type: integer
 *         billId:
 *           type: string
 *           format: uuid
 *         parcelId:
 *           type: string
 *         billNumber:
 *           type: string
 *         billYear:
 *           type: integer
 *         assessedValue:
 *           type: number
 *           format: decimal
 *         millageRate:
 *           type: number
 *           format: decimal
 *         baseTaxAmount:
 *           type: number
 *           format: decimal
 *         netTaxAmount:
 *           type: number
 *           format: decimal
 *         paymentStatus:
 *           type: string
 *           enum: [unpaid, partial, paid, delinquent, lien]
 */
export declare const createTaxBillModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        billId: string;
        parcelId: string;
        billNumber: string;
        billYear: number;
        propertyOwner: string;
        propertyAddress: string;
        assessedValue: number;
        taxableValue: number;
        millageRate: number;
        baseTaxAmount: number;
        exemptionAmount: number;
        netTaxAmount: number;
        specialAssessments: SpecialAssessment[];
        totalDue: number;
        dueDate: Date;
        delinquentDate: Date;
        billDate: Date;
        fiscalYear: string;
        paymentStatus: string;
        amountPaid: number;
        balanceRemaining: number;
        installmentPlanId: string | null;
        penaltiesAccrued: number;
        interestAccrued: number;
        lastPaymentDate: Date | null;
        paidInFull: boolean;
        paidInFullDate: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Tax Liens with comprehensive lien tracking and status management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} TaxLien model
 *
 * @example
 * ```typescript
 * const TaxLien = createTaxLienModel(sequelize);
 * const lien = await TaxLien.create({
 *   parcelId: 'PARC-2024-001',
 *   billId: 'BILL-2024-00001',
 *   lienNumber: 'LIEN-2024-00001',
 *   lienAmount: 15000.00,
 *   interestRate: 0.18,
 *   filingDate: new Date(),
 *   status: 'filed'
 * });
 * ```
 */
export declare const createTaxLienModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        lienId: string;
        lienNumber: string;
        parcelId: string;
        billId: string;
        propertyOwner: string;
        propertyAddress: string;
        lienAmount: number;
        interestRate: number;
        penaltyAmount: number;
        filingDate: Date;
        filingFee: number;
        status: string;
        releaseDate: Date | null;
        releaseReason: string | null;
        certificateNumber: string;
        recordedBook: string | null;
        recordedPage: string | null;
        purchaser: string | null;
        purchaseDate: Date | null;
        purchaseAmount: number | null;
        redemptionDeadline: Date | null;
        foreclosureDate: Date | null;
        filedBy: string;
        releasedBy: string | null;
        currentBalance: number;
        totalInterestAccrued: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new property tax assessment record.
 *
 * @param {PropertyTaxAssessment} assessmentData - Assessment data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created assessment
 *
 * @example
 * ```typescript
 * const assessment = await createPropertyAssessment({
 *   parcelId: 'PARC-2024-001',
 *   propertyAddress: '123 Main St',
 *   ownerName: 'John Doe',
 *   ownerAddress: '123 Main St, City, ST 12345',
 *   assessedLandValue: 150000,
 *   assessedImprovementValue: 250000,
 *   totalAssessedValue: 400000,
 *   taxableValue: 400000,
 *   assessmentYear: 2024,
 *   assessmentDate: new Date(),
 *   assessor: 'Jane Smith',
 *   propertyType: 'residential',
 *   landArea: 5000,
 *   buildingArea: 2500,
 *   zoning: 'R1',
 *   neighborhood: 'Downtown',
 *   taxDistrict: 'DIST-001',
 *   exemptions: []
 * }, sequelize);
 * ```
 */
export declare const createPropertyAssessment: (assessmentData: Partial<PropertyTaxAssessment>, sequelize: Sequelize, transaction?: Transaction) => Promise<any>;
/**
 * Calculates property tax assessment based on market value and property characteristics.
 *
 * @param {string} parcelId - Parcel ID
 * @param {number} marketValue - Market value
 * @param {string} propertyType - Property type
 * @param {number} assessmentRatio - Assessment ratio (e.g., 0.85 for 85%)
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ assessedValue: number; landValue: number; improvementValue: number }>}
 *
 * @example
 * ```typescript
 * const values = await calculatePropertyAssessment(
 *   'PARC-2024-001',
 *   500000,
 *   'residential',
 *   0.85,
 *   sequelize
 * );
 * // Returns: { assessedValue: 425000, landValue: 127500, improvementValue: 297500 }
 * ```
 */
export declare const calculatePropertyAssessment: (parcelId: string, marketValue: number, propertyType: string, assessmentRatio: number, sequelize: Sequelize) => Promise<{
    assessedValue: number;
    landValue: number;
    improvementValue: number;
}>;
/**
 * Applies tax exemptions to a property assessment.
 *
 * @param {string} parcelId - Parcel ID
 * @param {TaxExemption[]} exemptions - Exemptions to apply
 * @param {number} totalAssessedValue - Total assessed value
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ taxableValue: number; totalExemption: number; appliedExemptions: TaxExemption[] }>}
 *
 * @example
 * ```typescript
 * const result = await applyTaxExemptions(
 *   'PARC-2024-001',
 *   [{ exemptionType: 'homestead', exemptionAmount: 25000, ... }],
 *   400000,
 *   sequelize
 * );
 * // Returns: { taxableValue: 375000, totalExemption: 25000, appliedExemptions: [...] }
 * ```
 */
export declare const applyTaxExemptions: (parcelId: string, exemptions: TaxExemption[], totalAssessedValue: number, sequelize: Sequelize) => Promise<{
    taxableValue: number;
    totalExemption: number;
    appliedExemptions: TaxExemption[];
}>;
/**
 * Updates property assessment for a new tax year.
 *
 * @param {string} parcelId - Parcel ID
 * @param {number} newAssessmentYear - New assessment year
 * @param {number} appreciationRate - Annual appreciation rate
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Updated assessment
 *
 * @example
 * ```typescript
 * const updated = await updatePropertyAssessmentYear(
 *   'PARC-2024-001',
 *   2025,
 *   0.03,
 *   sequelize
 * );
 * ```
 */
export declare const updatePropertyAssessmentYear: (parcelId: string, newAssessmentYear: number, appreciationRate: number, sequelize: Sequelize) => Promise<any>;
/**
 * Generates a property tax bill from an assessment.
 *
 * @param {string} parcelId - Parcel ID
 * @param {number} billYear - Bill year
 * @param {number} millageRate - Millage rate (tax per $1000)
 * @param {Date} dueDate - Payment due date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Generated tax bill
 *
 * @example
 * ```typescript
 * const bill = await generatePropertyTaxBill(
 *   'PARC-2024-001',
 *   2024,
 *   25.50,
 *   new Date('2024-12-31'),
 *   sequelize
 * );
 * ```
 */
export declare const generatePropertyTaxBill: (parcelId: string, billYear: number, millageRate: number, dueDate: Date, sequelize: Sequelize) => Promise<any>;
/**
 * Adds special assessments to a tax bill.
 *
 * @param {string} billId - Bill ID
 * @param {SpecialAssessment[]} assessments - Special assessments
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Updated bill
 *
 * @example
 * ```typescript
 * const updated = await addSpecialAssessments(
 *   'bill-uuid',
 *   [{ assessmentType: 'street_improvement', amount: 500, description: 'Street paving' }],
 *   sequelize
 * );
 * ```
 */
export declare const addSpecialAssessments: (billId: string, assessments: SpecialAssessment[], sequelize: Sequelize) => Promise<any>;
/**
 * Calculates penalty for late payment.
 *
 * @param {number} principalAmount - Principal amount owed
 * @param {Date} dueDate - Original due date
 * @param {Date} currentDate - Current date
 * @param {number} penaltyRate - Penalty rate (e.g., 0.01 for 1% per month)
 * @returns {PenaltyCalculation}
 *
 * @example
 * ```typescript
 * const penalty = calculateLatePenalty(
 *   10000,
 *   new Date('2024-01-31'),
 *   new Date('2024-03-15'),
 *   0.015
 * );
 * // Returns penalty calculation for ~45 days late
 * ```
 */
export declare const calculateLatePenalty: (principalAmount: number, dueDate: Date, currentDate: Date, penaltyRate: number) => PenaltyCalculation;
/**
 * Calculates interest on delinquent taxes.
 *
 * @param {number} principal - Principal amount
 * @param {number} annualRate - Annual interest rate
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} method - Calculation method
 * @returns {InterestCalculation}
 *
 * @example
 * ```typescript
 * const interest = calculateDelinquentInterest(
 *   10000,
 *   0.18,
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   'simple'
 * );
 * ```
 */
export declare const calculateDelinquentInterest: (principal: number, annualRate: number, startDate: Date, endDate: Date, method?: "simple" | "compound" | "daily") => InterestCalculation;
/**
 * Processes a tax payment.
 *
 * @param {string} billId - Bill ID
 * @param {number} paymentAmount - Payment amount
 * @param {string} paymentMethod - Payment method
 * @param {string} receivedBy - User receiving payment
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Payment record
 *
 * @example
 * ```typescript
 * const payment = await processTaxPayment(
 *   'bill-uuid',
 *   5000,
 *   'check',
 *   'user-123',
 *   sequelize
 * );
 * ```
 */
export declare const processTaxPayment: (billId: string, paymentAmount: number, paymentMethod: string, receivedBy: string, sequelize: Sequelize) => Promise<any>;
/**
 * Creates a payment plan for delinquent taxes.
 *
 * @param {string} billId - Bill ID
 * @param {number} downPayment - Down payment amount
 * @param {number} numberOfInstallments - Number of installments
 * @param {string} frequency - Installment frequency
 * @param {string} createdBy - User creating plan
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<PaymentPlan>}
 *
 * @example
 * ```typescript
 * const plan = await createPaymentPlan(
 *   'bill-uuid',
 *   2000,
 *   12,
 *   'monthly',
 *   'user-123',
 *   sequelize
 * );
 * ```
 */
export declare const createPaymentPlan: (billId: string, downPayment: number, numberOfInstallments: number, frequency: "monthly" | "quarterly" | "semiannual", createdBy: string, sequelize: Sequelize) => Promise<PaymentPlan>;
/**
 * Processes an installment payment.
 *
 * @param {string} planId - Payment plan ID
 * @param {number} installmentNumber - Installment number
 * @param {number} paymentAmount - Payment amount
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<PaymentPlan>} Updated payment plan
 *
 * @example
 * ```typescript
 * const plan = await processInstallmentPayment(
 *   'plan-uuid',
 *   1,
 *   500,
 *   sequelize
 * );
 * ```
 */
export declare const processInstallmentPayment: (planId: string, installmentNumber: number, paymentAmount: number, sequelize: Sequelize) => Promise<PaymentPlan>;
/**
 * Files a tax lien for delinquent taxes.
 *
 * @param {string} billId - Bill ID
 * @param {string} parcelId - Parcel ID
 * @param {number} lienAmount - Lien amount
 * @param {number} interestRate - Annual interest rate
 * @param {string} filedBy - User filing lien
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Created lien
 *
 * @example
 * ```typescript
 * const lien = await fileTaxLien(
 *   'bill-uuid',
 *   'PARC-2024-001',
 *   15000,
 *   0.18,
 *   'user-123',
 *   sequelize
 * );
 * ```
 */
export declare const fileTaxLien: (billId: string, parcelId: string, lienAmount: number, interestRate: number, filedBy: string, sequelize: Sequelize) => Promise<any>;
/**
 * Releases a tax lien after payment.
 *
 * @param {string} lienId - Lien ID
 * @param {string} releaseReason - Reason for release
 * @param {string} releasedBy - User releasing lien
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Released lien
 *
 * @example
 * ```typescript
 * const released = await releaseTaxLien(
 *   'lien-uuid',
 *   'Paid in full',
 *   'user-123',
 *   sequelize
 * );
 * ```
 */
export declare const releaseTaxLien: (lienId: string, releaseReason: string, releasedBy: string, sequelize: Sequelize) => Promise<any>;
/**
 * Calculates total lien redemption amount including interest.
 *
 * @param {string} lienId - Lien ID
 * @param {Date} redemptionDate - Redemption date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ totalRedemption: number; principal: number; interest: number; penalties: number; fees: number }>}
 *
 * @example
 * ```typescript
 * const redemption = await calculateLienRedemption(
 *   'lien-uuid',
 *   new Date(),
 *   sequelize
 * );
 * ```
 */
export declare const calculateLienRedemption: (lienId: string, redemptionDate: Date, sequelize: Sequelize) => Promise<{
    totalRedemption: number;
    principal: number;
    interest: number;
    penalties: number;
    fees: number;
}>;
/**
 * Gets combined sales tax rate for a jurisdiction.
 *
 * @param {string} jurisdiction - Jurisdiction code
 * @param {string} category - Item category
 * @returns {Promise<number>} Combined tax rate
 *
 * @example
 * ```typescript
 * const rate = await getSalesTaxRate('CA-LA-90001', 'general');
 * // Returns: 0.0975 (9.75%)
 * ```
 */
export declare const getSalesTaxRate: (jurisdiction: string, category?: string) => Promise<number>;
/**
 * Calculates sales tax for a transaction.
 *
 * @param {number} saleAmount - Sale amount
 * @param {string} jurisdiction - Jurisdiction
 * @param {string} category - Item category
 * @returns {Promise<{ taxableAmount: number; taxRate: number; taxAmount: number; totalAmount: number }>}
 *
 * @example
 * ```typescript
 * const tax = await calculateSalesTax(100, 'CA-LA-90001', 'general');
 * // Returns: { taxableAmount: 100, taxRate: 0.0975, taxAmount: 9.75, totalAmount: 109.75 }
 * ```
 */
export declare const calculateSalesTax: (saleAmount: number, jurisdiction: string, category?: string) => Promise<{
    taxableAmount: number;
    taxRate: number;
    taxAmount: number;
    totalAmount: number;
}>;
/**
 * Records a sales tax transaction.
 *
 * @param {Partial<SalesTaxTransaction>} transactionData - Transaction data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<SalesTaxTransaction>}
 *
 * @example
 * ```typescript
 * const transaction = await recordSalesTaxTransaction({
 *   merchantId: 'MERCH-001',
 *   merchantName: 'ABC Store',
 *   transactionDate: new Date(),
 *   saleAmount: 1000,
 *   taxableAmount: 1000,
 *   taxRate: 0.0975,
 *   taxAmount: 97.50,
 *   jurisdiction: 'CA-LA-90001',
 *   category: 'general'
 * }, sequelize);
 * ```
 */
export declare const recordSalesTaxTransaction: (transactionData: Partial<SalesTaxTransaction>, sequelize: Sequelize) => Promise<SalesTaxTransaction>;
/**
 * Creates a tax exemption application.
 *
 * @param {string} parcelId - Parcel ID
 * @param {string} exemptionType - Exemption type
 * @param {number} exemptionAmount - Exemption amount
 * @param {string} applicantName - Applicant name
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TaxExemption>}
 *
 * @example
 * ```typescript
 * const exemption = await createTaxExemption(
 *   'PARC-2024-001',
 *   'homestead',
 *   25000,
 *   'John Doe',
 *   sequelize
 * );
 * ```
 */
export declare const createTaxExemption: (parcelId: string, exemptionType: string, exemptionAmount: number, applicantName: string, sequelize: Sequelize) => Promise<TaxExemption>;
/**
 * Processes a tax abatement request.
 *
 * @param {Partial<TaxAbatement>} abatementData - Abatement data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TaxAbatement>}
 *
 * @example
 * ```typescript
 * const abatement = await processTaxAbatement({
 *   parcelId: 'PARC-2024-001',
 *   applicantName: 'John Doe',
 *   abatementType: 'assessment_reduction',
 *   requestedAmount: 5000,
 *   reason: 'Property damage',
 *   effectiveTaxYear: 2024
 * }, sequelize);
 * ```
 */
export declare const processTaxAbatement: (abatementData: Partial<TaxAbatement>, sequelize: Sequelize) => Promise<TaxAbatement>;
/**
 * Approves a tax abatement.
 *
 * @param {string} abatementId - Abatement ID
 * @param {number} approvedAmount - Approved amount
 * @param {string} approver - Approver name
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TaxAbatement>}
 *
 * @example
 * ```typescript
 * const approved = await approveTaxAbatement(
 *   'abatement-uuid',
 *   4000,
 *   'assessor-123',
 *   sequelize
 * );
 * ```
 */
export declare const approveTaxAbatement: (abatementId: string, approvedAmount: number, approver: string, sequelize: Sequelize) => Promise<TaxAbatement>;
/**
 * Processes a tax refund request.
 *
 * @param {Partial<TaxRefund>} refundData - Refund data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TaxRefund>}
 *
 * @example
 * ```typescript
 * const refund = await processTaxRefund({
 *   billId: 'bill-uuid',
 *   parcelId: 'PARC-2024-001',
 *   taxpayerName: 'John Doe',
 *   refundAmount: 1000,
 *   refundReason: 'overpayment',
 *   originalPaymentAmount: 6000,
 *   originalPaymentDate: new Date('2024-01-15'),
 *   fiscalYear: 'FY2024'
 * }, sequelize);
 * ```
 */
export declare const processTaxRefund: (refundData: Partial<TaxRefund>, sequelize: Sequelize) => Promise<TaxRefund>;
/**
 * Approves and issues a tax refund.
 *
 * @param {string} refundId - Refund ID
 * @param {string} approver - Approver name
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TaxRefund>}
 *
 * @example
 * ```typescript
 * const issued = await issueTaxRefund('refund-uuid', 'finance-director', sequelize);
 * ```
 */
export declare const issueTaxRefund: (refundId: string, approver: string, sequelize: Sequelize) => Promise<TaxRefund>;
/**
 * Generates tax revenue forecast.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} jurisdiction - Jurisdiction
 * @param {string} taxType - Tax type
 * @param {number} growthRate - Expected growth rate
 * @param {string} forecastedBy - Forecaster name
 * @returns {Promise<TaxForecast>}
 *
 * @example
 * ```typescript
 * const forecast = await generateRevenueForecast(
 *   'FY2025',
 *   'COUNTY-001',
 *   'property',
 *   0.03,
 *   'budget-director'
 * );
 * ```
 */
export declare const generateRevenueForecast: (fiscalYear: string, jurisdiction: string, taxType: string, growthRate: number, forecastedBy: string) => Promise<TaxForecast>;
/**
 * Calculates collection rate for a tax type.
 *
 * @param {string} taxType - Tax type
 * @param {string} fiscalYear - Fiscal year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ collectionRate: number; totalBilled: number; totalCollected: number; outstanding: number }>}
 *
 * @example
 * ```typescript
 * const rate = await calculateCollectionRate('property', 'FY2024', sequelize);
 * // Returns: { collectionRate: 0.95, totalBilled: 50000000, totalCollected: 47500000, outstanding: 2500000 }
 * ```
 */
export declare const calculateCollectionRate: (taxType: string, fiscalYear: string, sequelize: Sequelize) => Promise<{
    collectionRate: number;
    totalBilled: number;
    totalCollected: number;
    outstanding: number;
}>;
/**
 * Creates delinquent tax record.
 *
 * @param {string} billId - Bill ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<DelinquentTax>}
 *
 * @example
 * ```typescript
 * const delinquent = await createDelinquentTaxRecord('bill-uuid', sequelize);
 * ```
 */
export declare const createDelinquentTaxRecord: (billId: string, sequelize: Sequelize) => Promise<DelinquentTax>;
/**
 * Gets all delinquent taxes for a jurisdiction.
 *
 * @param {string} taxDistrict - Tax district
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<DelinquentTax[]>}
 *
 * @example
 * ```typescript
 * const delinquencies = await getDelinquentTaxes('DIST-001', sequelize);
 * ```
 */
export declare const getDelinquentTaxes: (taxDistrict: string, sequelize: Sequelize) => Promise<DelinquentTax[]>;
/**
 * Generates tax revenue report.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} reportType - Report type
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>}
 *
 * @example
 * ```typescript
 * const report = await generateTaxRevenueReport('FY2024', 'annual', sequelize);
 * ```
 */
export declare const generateTaxRevenueReport: (fiscalYear: string, reportType: "monthly" | "quarterly" | "annual", sequelize: Sequelize) => Promise<any>;
/**
 * Exports tax data for audit.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} exportFormat - Export format
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<string>} Export file path
 *
 * @example
 * ```typescript
 * const path = await exportTaxDataForAudit('FY2024', 'csv', sequelize);
 * ```
 */
export declare const exportTaxDataForAudit: (fiscalYear: string, exportFormat: "csv" | "json" | "xml", sequelize: Sequelize) => Promise<string>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createPropertyTaxAssessmentModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            parcelId: string;
            propertyAddress: string;
            ownerName: string;
            ownerAddress: string;
            assessedLandValue: number;
            assessedImprovementValue: number;
            totalAssessedValue: number;
            taxableValue: number;
            exemptions: TaxExemption[];
            assessmentYear: number;
            assessmentDate: Date;
            assessor: string;
            propertyType: string;
            landArea: number;
            buildingArea: number;
            yearBuilt: number | null;
            zoning: string;
            neighborhood: string;
            taxDistrict: string;
            lastSaleDate: Date | null;
            lastSalePrice: number | null;
            appraisalMethod: string;
            marketValue: number;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createTaxBillModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            billId: string;
            parcelId: string;
            billNumber: string;
            billYear: number;
            propertyOwner: string;
            propertyAddress: string;
            assessedValue: number;
            taxableValue: number;
            millageRate: number;
            baseTaxAmount: number;
            exemptionAmount: number;
            netTaxAmount: number;
            specialAssessments: SpecialAssessment[];
            totalDue: number;
            dueDate: Date;
            delinquentDate: Date;
            billDate: Date;
            fiscalYear: string;
            paymentStatus: string;
            amountPaid: number;
            balanceRemaining: number;
            installmentPlanId: string | null;
            penaltiesAccrued: number;
            interestAccrued: number;
            lastPaymentDate: Date | null;
            paidInFull: boolean;
            paidInFullDate: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createTaxLienModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            lienId: string;
            lienNumber: string;
            parcelId: string;
            billId: string;
            propertyOwner: string;
            propertyAddress: string;
            lienAmount: number;
            interestRate: number;
            penaltyAmount: number;
            filingDate: Date;
            filingFee: number;
            status: string;
            releaseDate: Date | null;
            releaseReason: string | null;
            certificateNumber: string;
            recordedBook: string | null;
            recordedPage: string | null;
            purchaser: string | null;
            purchaseDate: Date | null;
            purchaseAmount: number | null;
            redemptionDeadline: Date | null;
            foreclosureDate: Date | null;
            filedBy: string;
            releasedBy: string | null;
            currentBalance: number;
            totalInterestAccrued: number;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createPropertyAssessment: (assessmentData: Partial<PropertyTaxAssessment>, sequelize: Sequelize, transaction?: Transaction) => Promise<any>;
    calculatePropertyAssessment: (parcelId: string, marketValue: number, propertyType: string, assessmentRatio: number, sequelize: Sequelize) => Promise<{
        assessedValue: number;
        landValue: number;
        improvementValue: number;
    }>;
    applyTaxExemptions: (parcelId: string, exemptions: TaxExemption[], totalAssessedValue: number, sequelize: Sequelize) => Promise<{
        taxableValue: number;
        totalExemption: number;
        appliedExemptions: TaxExemption[];
    }>;
    updatePropertyAssessmentYear: (parcelId: string, newAssessmentYear: number, appreciationRate: number, sequelize: Sequelize) => Promise<any>;
    generatePropertyTaxBill: (parcelId: string, billYear: number, millageRate: number, dueDate: Date, sequelize: Sequelize) => Promise<any>;
    addSpecialAssessments: (billId: string, assessments: SpecialAssessment[], sequelize: Sequelize) => Promise<any>;
    calculateLatePenalty: (principalAmount: number, dueDate: Date, currentDate: Date, penaltyRate: number) => PenaltyCalculation;
    calculateDelinquentInterest: (principal: number, annualRate: number, startDate: Date, endDate: Date, method?: "simple" | "compound" | "daily") => InterestCalculation;
    processTaxPayment: (billId: string, paymentAmount: number, paymentMethod: string, receivedBy: string, sequelize: Sequelize) => Promise<any>;
    createPaymentPlan: (billId: string, downPayment: number, numberOfInstallments: number, frequency: "monthly" | "quarterly" | "semiannual", createdBy: string, sequelize: Sequelize) => Promise<PaymentPlan>;
    processInstallmentPayment: (planId: string, installmentNumber: number, paymentAmount: number, sequelize: Sequelize) => Promise<PaymentPlan>;
    fileTaxLien: (billId: string, parcelId: string, lienAmount: number, interestRate: number, filedBy: string, sequelize: Sequelize) => Promise<any>;
    releaseTaxLien: (lienId: string, releaseReason: string, releasedBy: string, sequelize: Sequelize) => Promise<any>;
    calculateLienRedemption: (lienId: string, redemptionDate: Date, sequelize: Sequelize) => Promise<{
        totalRedemption: number;
        principal: number;
        interest: number;
        penalties: number;
        fees: number;
    }>;
    getSalesTaxRate: (jurisdiction: string, category?: string) => Promise<number>;
    calculateSalesTax: (saleAmount: number, jurisdiction: string, category?: string) => Promise<{
        taxableAmount: number;
        taxRate: number;
        taxAmount: number;
        totalAmount: number;
    }>;
    recordSalesTaxTransaction: (transactionData: Partial<SalesTaxTransaction>, sequelize: Sequelize) => Promise<SalesTaxTransaction>;
    createTaxExemption: (parcelId: string, exemptionType: string, exemptionAmount: number, applicantName: string, sequelize: Sequelize) => Promise<TaxExemption>;
    processTaxAbatement: (abatementData: Partial<TaxAbatement>, sequelize: Sequelize) => Promise<TaxAbatement>;
    approveTaxAbatement: (abatementId: string, approvedAmount: number, approver: string, sequelize: Sequelize) => Promise<TaxAbatement>;
    processTaxRefund: (refundData: Partial<TaxRefund>, sequelize: Sequelize) => Promise<TaxRefund>;
    issueTaxRefund: (refundId: string, approver: string, sequelize: Sequelize) => Promise<TaxRefund>;
    generateRevenueForecast: (fiscalYear: string, jurisdiction: string, taxType: string, growthRate: number, forecastedBy: string) => Promise<TaxForecast>;
    calculateCollectionRate: (taxType: string, fiscalYear: string, sequelize: Sequelize) => Promise<{
        collectionRate: number;
        totalBilled: number;
        totalCollected: number;
        outstanding: number;
    }>;
    createDelinquentTaxRecord: (billId: string, sequelize: Sequelize) => Promise<DelinquentTax>;
    getDelinquentTaxes: (taxDistrict: string, sequelize: Sequelize) => Promise<DelinquentTax[]>;
    generateTaxRevenueReport: (fiscalYear: string, reportType: "monthly" | "quarterly" | "annual", sequelize: Sequelize) => Promise<any>;
    exportTaxDataForAudit: (fiscalYear: string, exportFormat: "csv" | "json" | "xml", sequelize: Sequelize) => Promise<string>;
};
export default _default;
//# sourceMappingURL=tax-revenue-management-kit.d.ts.map