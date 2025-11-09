/**
 * LOC: REVRECOG1234567
 * File: /reuse/government/revenue-recognition-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend government finance services
 *   - Revenue management controllers
 *   - Revenue recognition engines
 */
/**
 * File: /reuse/government/revenue-recognition-management-kit.ts
 * Locator: WC-GOV-REV-001
 * Purpose: Comprehensive Revenue Recognition & Management Utilities - Government financial management system
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Government finance controllers, revenue services, recognition engines, forecasting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 50+ utility functions for revenue recognition, source tracking, estimation, reconciliation, allocation, forecasting
 *
 * LLM Context: Enterprise-grade government revenue recognition system for state and local governments.
 * Provides revenue lifecycle management, modified accrual and accrual accounting, revenue source tracking,
 * tax revenue recognition, intergovernmental revenue, deferred revenue management, revenue allocation,
 * revenue forecasting, variance analysis, revenue collection tracking, revenue reconciliation,
 * grant revenue recognition, fee and fine revenue, special assessment revenue, compliance validation.
 */
import { Sequelize } from 'sequelize';
interface RevenueRecognitionPeriod {
    fiscalYear: number;
    period: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'ANNUAL' | 'MONTHLY';
    startDate: Date;
    endDate: Date;
    status: 'OPEN' | 'CLOSED' | 'LOCKED';
}
interface RevenueSource {
    sourceCode: string;
    sourceName: string;
    sourceCategory: 'TAX' | 'FEE' | 'GRANT' | 'INTERGOVERNMENTAL' | 'FINE' | 'ASSESSMENT' | 'OTHER';
    recognitionMethod: 'MODIFIED_ACCRUAL' | 'ACCRUAL' | 'CASH';
    fundType: string;
    accountCode: string;
    estimatedAnnualRevenue: number;
    actualRevenue: number;
}
interface RevenueRecognitionRule {
    ruleId: string;
    revenueSourceCode: string;
    recognitionBasis: 'EARNED' | 'AVAILABLE' | 'COLLECTED' | 'MEASURABLE';
    timingCriteria: 'OCCURRENCE' | 'PERIOD_END' | 'CASH_RECEIPT' | 'BILLING';
    availabilityPeriodDays: number;
    deferralsRequired: boolean;
    accrualsRequired: boolean;
}
interface TaxRevenueRecognition {
    taxType: 'PROPERTY' | 'SALES' | 'INCOME' | 'EXCISE' | 'USE' | 'FRANCHISE';
    assessedValue?: number;
    taxRate: number;
    billedAmount: number;
    collectiblePercent: number;
    estimatedUncollectible: number;
    recognizedAmount: number;
    deferredAmount: number;
    collectionPeriod: Date;
}
interface DeferredRevenue {
    deferralId: string;
    revenueSourceCode: string;
    originalAmount: number;
    deferredAmount: number;
    recognizedToDate: number;
    remainingDeferred: number;
    deferralReason: string;
    recognitionSchedule: RevenueRecognitionSchedule[];
    status: 'ACTIVE' | 'PARTIALLY_RECOGNIZED' | 'FULLY_RECOGNIZED' | 'CANCELLED';
}
interface RevenueRecognitionSchedule {
    scheduleDate: Date;
    scheduledAmount: number;
    recognizedAmount: number;
    status: 'PENDING' | 'RECOGNIZED' | 'DEFERRED';
}
interface RevenueAllocation {
    allocationId: string;
    revenueSourceCode: string;
    totalRevenue: number;
    allocations: {
        fundCode: string;
        allocationPercent: number;
        allocatedAmount: number;
        purpose: string;
    }[];
    allocationMethod: 'PERCENTAGE' | 'FORMULA' | 'FIXED' | 'PRIORITY';
    effectiveDate: Date;
}
interface RevenueForecast {
    forecastId: string;
    revenueSourceCode: string;
    fiscalYear: number;
    forecastMethod: 'TREND' | 'REGRESSION' | 'MOVING_AVERAGE' | 'JUDGMENTAL';
    historicalData: {
        period: string;
        actualRevenue: number;
    }[];
    forecastedAmount: number;
    confidenceLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    assumptions: string[];
    variancePercent: number;
}
interface RevenueVariance {
    varianceId: string;
    revenueSourceCode: string;
    period: RevenueRecognitionPeriod;
    budgetedAmount: number;
    actualAmount: number;
    variance: number;
    variancePercent: number;
    varianceType: 'FAVORABLE' | 'UNFAVORABLE';
    explanation?: string;
    correctiveActions?: string[];
}
interface GrantRevenue {
    grantId: string;
    grantorName: string;
    grantType: 'FEDERAL' | 'STATE' | 'LOCAL' | 'PRIVATE';
    grantPurpose: string;
    totalAwardAmount: number;
    recognitionBasis: 'REIMBURSEMENT' | 'ADVANCE' | 'PERFORMANCE';
    eligibilityRequirements: string[];
    expendituresRequired: boolean;
    revenueRecognizedToDate: number;
    remainingRevenue: number;
}
interface IntergovernmentalRevenue {
    revenueId: string;
    sourceGovernment: string;
    programName: string;
    revenueType: 'SHARED_TAX' | 'GRANT' | 'REIMBURSEMENT' | 'PAYMENT_IN_LIEU';
    distributionFormula?: string;
    expectedAmount: number;
    receivedAmount: number;
    recognizedAmount: number;
    paymentSchedule: Date[];
}
interface RevenueCollection {
    collectionId: string;
    revenueSourceCode: string;
    billedAmount: number;
    collectedAmount: number;
    outstandingAmount: number;
    collectionRate: number;
    agingBrackets: {
        current: number;
        days30: number;
        days60: number;
        days90: number;
        over90: number;
    };
    estimatedUncollectible: number;
}
/**
 * Sequelize model for Revenue Source Management with revenue tracking and recognition rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RevenueSource model
 *
 * @example
 * ```typescript
 * const RevenueSource = createRevenueSourceModel(sequelize);
 * const source = await RevenueSource.create({
 *   sourceCode: 'PROP-TAX-001',
 *   sourceName: 'Property Tax Revenue',
 *   sourceCategory: 'TAX',
 *   recognitionMethod: 'MODIFIED_ACCRUAL',
 *   estimatedAnnualRevenue: 5000000
 * });
 * ```
 */
export declare const createRevenueSourceModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        sourceCode: string;
        sourceName: string;
        sourceCategory: string;
        sourceDescription: string;
        recognitionMethod: string;
        fundType: string;
        accountCode: string;
        estimatedAnnualRevenue: number;
        actualRevenue: number;
        recognizedRevenue: number;
        deferredRevenue: number;
        fiscalYear: number;
        status: string;
        recognitionRules: Record<string, any>;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Revenue Recognition Transactions with accrual and deferral tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RevenueTransaction model
 *
 * @example
 * ```typescript
 * const RevenueTransaction = createRevenueTransactionModel(sequelize);
 * const transaction = await RevenueTransaction.create({
 *   revenueSourceId: 1,
 *   transactionType: 'RECOGNITION',
 *   amount: 125000,
 *   recognitionDate: new Date(),
 *   recognitionBasis: 'EARNED'
 * });
 * ```
 */
export declare const createRevenueTransactionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        transactionNumber: string;
        revenueSourceId: number;
        revenueSourceCode: string;
        transactionType: string;
        amount: number;
        recognitionDate: Date;
        recognitionBasis: string;
        fiscalPeriod: string;
        description: string;
        referenceNumber: string | null;
        deferralId: string | null;
        reversalOf: number | null;
        reversedBy: number | null;
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly createdBy: string;
    };
};
/**
 * Sequelize model for Deferred Revenue Management with recognition schedules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DeferredRevenue model
 *
 * @example
 * ```typescript
 * const DeferredRevenue = createDeferredRevenueModel(sequelize);
 * const deferred = await DeferredRevenue.create({
 *   deferralId: 'DEF-2025-001',
 *   revenueSourceId: 1,
 *   originalAmount: 300000,
 *   deferredAmount: 300000,
 *   deferralReason: 'Advance payment for multi-year service'
 * });
 * ```
 */
export declare const createDeferredRevenueModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        deferralId: string;
        revenueSourceId: number;
        revenueSourceCode: string;
        originalAmount: number;
        deferredAmount: number;
        recognizedToDate: number;
        remainingDeferred: number;
        deferralReason: string;
        deferralDate: Date;
        recognitionStartDate: Date;
        recognitionEndDate: Date;
        recognitionSchedule: Record<string, any>[];
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Applies modified accrual revenue recognition rules.
 *
 * @param {object} revenueData - Revenue transaction data
 * @param {RevenueRecognitionRule} rules - Recognition rules
 * @returns {Promise<{ recognizable: boolean; amount: number; deferralAmount: number; reason: string }>} Recognition determination
 *
 * @example
 * ```typescript
 * const result = await applyModifiedAccrualRecognition({
 *   amount: 500000,
 *   sourceCode: 'PROP-TAX-001',
 *   transactionDate: new Date()
 * }, recognitionRules);
 * ```
 */
export declare const applyModifiedAccrualRecognition: (revenueData: any, rules: RevenueRecognitionRule) => Promise<{
    recognizable: boolean;
    amount: number;
    deferralAmount: number;
    reason: string;
}>;
/**
 * Applies full accrual revenue recognition rules.
 *
 * @param {object} revenueData - Revenue transaction data
 * @param {RevenueRecognitionRule} rules - Recognition rules
 * @returns {Promise<{ recognizable: boolean; amount: number; reason: string }>} Recognition determination
 *
 * @example
 * ```typescript
 * const result = await applyAccrualRecognition(revenueData, rules);
 * ```
 */
export declare const applyAccrualRecognition: (revenueData: any, rules: RevenueRecognitionRule) => Promise<{
    recognizable: boolean;
    amount: number;
    reason: string;
}>;
/**
 * Validates revenue recognition timing against fiscal period.
 *
 * @param {Date} transactionDate - Transaction date
 * @param {RevenueRecognitionPeriod} period - Fiscal period
 * @param {number} availabilityPeriodDays - Availability period in days
 * @returns {Promise<{ valid: boolean; recognitionDate: Date; reason: string }>} Timing validation
 *
 * @example
 * ```typescript
 * const validation = await validateRecognitionTiming(
 *   new Date('2025-01-15'),
 *   fiscalPeriod,
 *   60
 * );
 * ```
 */
export declare const validateRecognitionTiming: (transactionDate: Date, period: RevenueRecognitionPeriod, availabilityPeriodDays: number) => Promise<{
    valid: boolean;
    recognitionDate: Date;
    reason: string;
}>;
/**
 * Determines if revenue should be deferred based on criteria.
 *
 * @param {object} revenueData - Revenue data
 * @param {RevenueRecognitionRule} rules - Recognition rules
 * @returns {Promise<{ shouldDefer: boolean; deferralAmount: number; reason: string }>} Deferral determination
 *
 * @example
 * ```typescript
 * const deferral = await determineDeferralRequirement(revenueData, rules);
 * ```
 */
export declare const determineDeferralRequirement: (revenueData: any, rules: RevenueRecognitionRule) => Promise<{
    shouldDefer: boolean;
    deferralAmount: number;
    reason: string;
}>;
/**
 * Creates revenue recognition rule for a revenue source.
 *
 * @param {string} revenueSourceCode - Revenue source code
 * @param {Partial<RevenueRecognitionRule>} ruleData - Rule configuration
 * @returns {Promise<RevenueRecognitionRule>} Created recognition rule
 *
 * @example
 * ```typescript
 * const rule = await createRecognitionRule('PROP-TAX-001', {
 *   recognitionBasis: 'EARNED',
 *   timingCriteria: 'OCCURRENCE',
 *   availabilityPeriodDays: 60
 * });
 * ```
 */
export declare const createRecognitionRule: (revenueSourceCode: string, ruleData: Partial<RevenueRecognitionRule>) => Promise<RevenueRecognitionRule>;
/**
 * Registers new revenue source with recognition configuration.
 *
 * @param {Partial<RevenueSource>} sourceData - Revenue source data
 * @param {string} createdBy - User creating source
 * @returns {Promise<object>} Created revenue source
 *
 * @example
 * ```typescript
 * const source = await registerRevenueSource({
 *   sourceCode: 'SALES-TAX-001',
 *   sourceName: 'Sales Tax Revenue',
 *   sourceCategory: 'TAX',
 *   recognitionMethod: 'MODIFIED_ACCRUAL',
 *   estimatedAnnualRevenue: 2500000
 * }, 'admin');
 * ```
 */
export declare const registerRevenueSource: (sourceData: Partial<RevenueSource>, createdBy: string) => Promise<any>;
/**
 * Tracks actual revenue against revenue source.
 *
 * @param {string} sourceCode - Revenue source code
 * @param {number} amount - Revenue amount
 * @param {Date} transactionDate - Transaction date
 * @returns {Promise<object>} Updated revenue tracking
 *
 * @example
 * ```typescript
 * const tracking = await trackRevenueBySource('SALES-TAX-001', 125000, new Date());
 * ```
 */
export declare const trackRevenueBySource: (sourceCode: string, amount: number, transactionDate: Date) => Promise<any>;
/**
 * Retrieves revenue sources by category.
 *
 * @param {string} category - Revenue category
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<RevenueSource[]>} Revenue sources in category
 *
 * @example
 * ```typescript
 * const taxSources = await getRevenueSourcesByCategory('TAX', 2025);
 * ```
 */
export declare const getRevenueSourcesByCategory: (category: string, fiscalYear: number) => Promise<RevenueSource[]>;
/**
 * Updates revenue source estimates.
 *
 * @param {string} sourceCode - Revenue source code
 * @param {number} newEstimate - Updated estimate
 * @param {string} reason - Reason for change
 * @returns {Promise<object>} Updated source with change history
 *
 * @example
 * ```typescript
 * const updated = await updateRevenueEstimate('SALES-TAX-001', 2750000, 'Economic growth adjustment');
 * ```
 */
export declare const updateRevenueEstimate: (sourceCode: string, newEstimate: number, reason: string) => Promise<any>;
/**
 * Compares revenue sources performance.
 *
 * @param {string[]} sourceCodes - Revenue source codes to compare
 * @param {RevenueRecognitionPeriod} period - Comparison period
 * @returns {Promise<object[]>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareRevenueSources(['SALES-TAX-001', 'PROP-TAX-001'], period);
 * ```
 */
export declare const compareRevenueSources: (sourceCodes: string[], period: RevenueRecognitionPeriod) => Promise<any[]>;
/**
 * Recognizes property tax revenue with collectibility estimation.
 *
 * @param {TaxRevenueRecognition} taxData - Property tax data
 * @returns {Promise<object>} Recognition calculation
 *
 * @example
 * ```typescript
 * const recognition = await recognizePropertyTaxRevenue({
 *   taxType: 'PROPERTY',
 *   assessedValue: 5000000,
 *   taxRate: 0.025,
 *   billedAmount: 125000,
 *   collectiblePercent: 98
 * });
 * ```
 */
export declare const recognizePropertyTaxRevenue: (taxData: TaxRevenueRecognition) => Promise<any>;
/**
 * Recognizes sales tax revenue with distribution timing.
 *
 * @param {number} amount - Sales tax amount
 * @param {Date} collectionMonth - Collection month
 * @param {number} distributionLagMonths - Distribution lag in months
 * @returns {Promise<object>} Recognition determination
 *
 * @example
 * ```typescript
 * const recognition = await recognizeSalesTaxRevenue(
 *   250000,
 *   new Date('2025-01-01'),
 *   2
 * );
 * ```
 */
export declare const recognizeSalesTaxRevenue: (amount: number, collectionMonth: Date, distributionLagMonths: number) => Promise<any>;
/**
 * Calculates tax revenue with uncollectible allowance.
 *
 * @param {number} billedAmount - Billed tax amount
 * @param {number} historicalCollectionRate - Historical collection rate percent
 * @returns {Promise<{ recognizedRevenue: number; allowanceForUncollectible: number; netRevenue: number }>} Revenue calculation
 *
 * @example
 * ```typescript
 * const calculation = await calculateTaxRevenueWithAllowance(500000, 97);
 * ```
 */
export declare const calculateTaxRevenueWithAllowance: (billedAmount: number, historicalCollectionRate: number) => Promise<{
    recognizedRevenue: number;
    allowanceForUncollectible: number;
    netRevenue: number;
}>;
/**
 * Processes tax levy and revenue recognition.
 *
 * @param {object} levyData - Tax levy data
 * @returns {Promise<object>} Levy processing result
 *
 * @example
 * ```typescript
 * const result = await processTaxLevy({
 *   taxType: 'PROPERTY',
 *   totalLevy: 5000000,
 *   collectionPeriod: new Date('2025-09-30')
 * });
 * ```
 */
export declare const processTaxLevy: (levyData: any) => Promise<any>;
/**
 * Reconciles tax revenue collections to recognition.
 *
 * @param {string} taxSourceCode - Tax revenue source code
 * @param {RevenueRecognitionPeriod} period - Reconciliation period
 * @returns {Promise<object>} Reconciliation results
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileTaxRevenue('PROP-TAX-001', fiscalPeriod);
 * ```
 */
export declare const reconcileTaxRevenue: (taxSourceCode: string, period: RevenueRecognitionPeriod) => Promise<any>;
/**
 * Creates deferred revenue record with recognition schedule.
 *
 * @param {Partial<DeferredRevenue>} deferralData - Deferral data
 * @returns {Promise<object>} Created deferral
 *
 * @example
 * ```typescript
 * const deferred = await createDeferredRevenue({
 *   revenueSourceCode: 'GRANT-001',
 *   originalAmount: 300000,
 *   deferralReason: 'Multi-year grant award',
 *   recognitionStartDate: new Date('2025-01-01'),
 *   recognitionEndDate: new Date('2027-12-31')
 * });
 * ```
 */
export declare const createDeferredRevenue: (deferralData: Partial<DeferredRevenue>) => Promise<any>;
/**
 * Processes periodic recognition of deferred revenue.
 *
 * @param {string} deferralId - Deferral ID
 * @param {Date} recognitionDate - Recognition date
 * @returns {Promise<object>} Recognition processing result
 *
 * @example
 * ```typescript
 * const result = await recognizeDeferredRevenue('DEF-12345', new Date());
 * ```
 */
export declare const recognizeDeferredRevenue: (deferralId: string, recognitionDate: Date) => Promise<any>;
/**
 * Generates revenue recognition schedule for deferral.
 *
 * @param {number} totalAmount - Total deferred amount
 * @param {Date} startDate - Recognition start date
 * @param {Date} endDate - Recognition end date
 * @param {string} method - Recognition method ('STRAIGHT_LINE' | 'PERFORMANCE')
 * @returns {Promise<RevenueRecognitionSchedule[]>} Recognition schedule
 *
 * @example
 * ```typescript
 * const schedule = await generateRecognitionSchedule(
 *   300000,
 *   new Date('2025-01-01'),
 *   new Date('2027-12-31'),
 *   'STRAIGHT_LINE'
 * );
 * ```
 */
export declare const generateRecognitionSchedule: (totalAmount: number, startDate: Date, endDate: Date, method: string) => Promise<RevenueRecognitionSchedule[]>;
/**
 * Retrieves deferred revenue balances by source.
 *
 * @param {string} revenueSourceCode - Revenue source code
 * @returns {Promise<object>} Deferred revenue summary
 *
 * @example
 * ```typescript
 * const balances = await getDeferredRevenueBalances('GRANT-001');
 * ```
 */
export declare const getDeferredRevenueBalances: (revenueSourceCode: string) => Promise<any>;
/**
 * Cancels deferred revenue and reverses recognition.
 *
 * @param {string} deferralId - Deferral ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<object>} Cancellation result
 *
 * @example
 * ```typescript
 * const result = await cancelDeferredRevenue('DEF-12345', 'Grant terminated');
 * ```
 */
export declare const cancelDeferredRevenue: (deferralId: string, reason: string) => Promise<any>;
/**
 * Allocates revenue across multiple funds.
 *
 * @param {Partial<RevenueAllocation>} allocationData - Allocation configuration
 * @returns {Promise<object>} Allocation result
 *
 * @example
 * ```typescript
 * const allocation = await allocateRevenueToFunds({
 *   revenueSourceCode: 'SALES-TAX-001',
 *   totalRevenue: 500000,
 *   allocations: [
 *     { fundCode: 'GEN-FUND', allocationPercent: 60, purpose: 'General operations' },
 *     { fundCode: 'CAP-FUND', allocationPercent: 40, purpose: 'Capital projects' }
 *   ]
 * });
 * ```
 */
export declare const allocateRevenueToFunds: (allocationData: Partial<RevenueAllocation>) => Promise<any>;
/**
 * Updates revenue allocation percentages.
 *
 * @param {string} allocationId - Allocation ID
 * @param {object[]} newAllocations - Updated allocations
 * @returns {Promise<object>} Updated allocation
 *
 * @example
 * ```typescript
 * const updated = await updateRevenueAllocation('ALLOC-12345', newAllocations);
 * ```
 */
export declare const updateRevenueAllocation: (allocationId: string, newAllocations: any[]) => Promise<any>;
/**
 * Validates revenue allocation totals to 100%.
 *
 * @param {object[]} allocations - Allocation percentages
 * @returns {Promise<{ valid: boolean; totalPercent: number; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateAllocationPercentages(allocations);
 * ```
 */
export declare const validateAllocationPercentages: (allocations: any[]) => Promise<{
    valid: boolean;
    totalPercent: number;
    errors: string[];
}>;
/**
 * Processes revenue allocation for a period.
 *
 * @param {string} revenueSourceCode - Revenue source code
 * @param {RevenueRecognitionPeriod} period - Allocation period
 * @returns {Promise<object>} Allocation processing result
 *
 * @example
 * ```typescript
 * const result = await processRevenueAllocation('SALES-TAX-001', fiscalPeriod);
 * ```
 */
export declare const processRevenueAllocation: (revenueSourceCode: string, period: RevenueRecognitionPeriod) => Promise<any>;
/**
 * Retrieves revenue allocation history.
 *
 * @param {string} revenueSourceCode - Revenue source code
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<RevenueAllocation[]>} Allocation history
 *
 * @example
 * ```typescript
 * const history = await getRevenueAllocationHistory('SALES-TAX-001', 2025);
 * ```
 */
export declare const getRevenueAllocationHistory: (revenueSourceCode: string, fiscalYear: number) => Promise<RevenueAllocation[]>;
/**
 * Forecasts revenue using trend analysis.
 *
 * @param {string} revenueSourceCode - Revenue source code
 * @param {number} fiscalYear - Forecast fiscal year
 * @param {number} historicalYears - Years of historical data
 * @returns {Promise<RevenueForecast>} Revenue forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastRevenueTrend('SALES-TAX-001', 2026, 5);
 * ```
 */
export declare const forecastRevenueTrend: (revenueSourceCode: string, fiscalYear: number, historicalYears: number) => Promise<RevenueForecast>;
/**
 * Calculates revenue forecast using moving average.
 *
 * @param {string} revenueSourceCode - Revenue source code
 * @param {number} periods - Number of periods for average
 * @returns {Promise<number>} Forecasted amount
 *
 * @example
 * ```typescript
 * const forecast = await calculateMovingAverageForecast('SALES-TAX-001', 12);
 * ```
 */
export declare const calculateMovingAverageForecast: (revenueSourceCode: string, periods: number) => Promise<number>;
/**
 * Performs regression analysis for revenue forecasting.
 *
 * @param {string} revenueSourceCode - Revenue source code
 * @param {object[]} historicalData - Historical revenue data
 * @returns {Promise<{ forecastedAmount: number; rSquared: number; equation: string }>} Regression results
 *
 * @example
 * ```typescript
 * const regression = await performRegressionForecast('SALES-TAX-001', historicalData);
 * ```
 */
export declare const performRegressionForecast: (revenueSourceCode: string, historicalData: any[]) => Promise<{
    forecastedAmount: number;
    rSquared: number;
    equation: string;
}>;
/**
 * Compares forecast to actual revenue performance.
 *
 * @param {string} forecastId - Forecast ID
 * @param {number} actualRevenue - Actual revenue received
 * @returns {Promise<{ variance: number; variancePercent: number; accuracy: string }>} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = await compareForecastToActual('FCST-12345', 2475000);
 * ```
 */
export declare const compareForecastToActual: (forecastId: string, actualRevenue: number) => Promise<{
    variance: number;
    variancePercent: number;
    accuracy: string;
}>;
/**
 * Generates revenue forecast sensitivity analysis.
 *
 * @param {string} revenueSourceCode - Revenue source code
 * @param {object} scenarios - Scenario parameters
 * @returns {Promise<object>} Sensitivity analysis
 *
 * @example
 * ```typescript
 * const sensitivity = await generateForecastSensitivity('SALES-TAX-001', {
 *   optimistic: 1.1,
 *   expected: 1.0,
 *   pessimistic: 0.9
 * });
 * ```
 */
export declare const generateForecastSensitivity: (revenueSourceCode: string, scenarios: any) => Promise<any>;
/**
 * Calculates revenue variance from budget.
 *
 * @param {string} revenueSourceCode - Revenue source code
 * @param {RevenueRecognitionPeriod} period - Analysis period
 * @returns {Promise<RevenueVariance>} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = await calculateRevenueVariance('SALES-TAX-001', fiscalPeriod);
 * ```
 */
export declare const calculateRevenueVariance: (revenueSourceCode: string, period: RevenueRecognitionPeriod) => Promise<RevenueVariance>;
/**
 * Analyzes revenue trends over multiple periods.
 *
 * @param {string} revenueSourceCode - Revenue source code
 * @param {number} periods - Number of periods to analyze
 * @returns {Promise<object>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeRevenueTrends('SALES-TAX-001', 12);
 * ```
 */
export declare const analyzeRevenueTrends: (revenueSourceCode: string, periods: number) => Promise<any>;
/**
 * Identifies revenue sources with significant variances.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} thresholdPercent - Variance threshold
 * @returns {Promise<RevenueVariance[]>} Significant variances
 *
 * @example
 * ```typescript
 * const variances = await identifyRevenueVarianceExceptions(2025, 10);
 * ```
 */
export declare const identifyRevenueVarianceExceptions: (fiscalYear: number, thresholdPercent: number) => Promise<RevenueVariance[]>;
/**
 * Generates revenue variance report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {RevenueRecognitionPeriod} period - Reporting period
 * @returns {Promise<object>} Variance report
 *
 * @example
 * ```typescript
 * const report = await generateRevenueVarianceReport(2025, fiscalPeriod);
 * ```
 */
export declare const generateRevenueVarianceReport: (fiscalYear: number, period: RevenueRecognitionPeriod) => Promise<any>;
/**
 * Tracks revenue performance against targets.
 *
 * @param {string} revenueSourceCode - Revenue source code
 * @param {Date} asOfDate - Performance date
 * @returns {Promise<object>} Performance tracking
 *
 * @example
 * ```typescript
 * const performance = await trackRevenuePerformance('SALES-TAX-001', new Date());
 * ```
 */
export declare const trackRevenuePerformance: (revenueSourceCode: string, asOfDate: Date) => Promise<any>;
/**
 * Recognizes grant revenue based on eligibility and expenditure.
 *
 * @param {GrantRevenue} grantData - Grant revenue data
 * @param {number} expendituresIncurred - Expenditures incurred
 * @returns {Promise<object>} Grant recognition result
 *
 * @example
 * ```typescript
 * const recognition = await recognizeGrantRevenue(grantData, 150000);
 * ```
 */
export declare const recognizeGrantRevenue: (grantData: GrantRevenue, expendituresIncurred: number) => Promise<any>;
/**
 * Validates grant eligibility requirements.
 *
 * @param {string} grantId - Grant ID
 * @param {object} eligibilityData - Eligibility validation data
 * @returns {Promise<{ eligible: boolean; metRequirements: string[]; unmetRequirements: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateGrantEligibility('GRANT-001', eligibilityData);
 * ```
 */
export declare const validateGrantEligibility: (grantId: string, eligibilityData: any) => Promise<{
    eligible: boolean;
    metRequirements: string[];
    unmetRequirements: string[];
}>;
/**
 * Tracks grant expenditures for revenue recognition.
 *
 * @param {string} grantId - Grant ID
 * @param {number} expenditureAmount - Expenditure amount
 * @returns {Promise<object>} Expenditure tracking result
 *
 * @example
 * ```typescript
 * const tracking = await trackGrantExpenditures('GRANT-001', 50000);
 * ```
 */
export declare const trackGrantExpenditures: (grantId: string, expenditureAmount: number) => Promise<any>;
/**
 * Processes grant advance payments and deferrals.
 *
 * @param {string} grantId - Grant ID
 * @param {number} advanceAmount - Advance payment amount
 * @returns {Promise<object>} Advance processing result
 *
 * @example
 * ```typescript
 * const result = await processGrantAdvance('GRANT-001', 100000);
 * ```
 */
export declare const processGrantAdvance: (grantId: string, advanceAmount: number) => Promise<any>;
/**
 * Reconciles grant awards to revenue recognized.
 *
 * @param {string} grantId - Grant ID
 * @returns {Promise<object>} Grant reconciliation
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileGrantRevenue('GRANT-001');
 * ```
 */
export declare const reconcileGrantRevenue: (grantId: string) => Promise<any>;
/**
 * Recognizes intergovernmental revenue receipts.
 *
 * @param {IntergovernmentalRevenue} revenueData - Intergovernmental revenue data
 * @returns {Promise<object>} Recognition result
 *
 * @example
 * ```typescript
 * const recognition = await recognizeIntergovernmentalRevenue({
 *   sourceGovernment: 'State of California',
 *   programName: 'Shared Sales Tax',
 *   revenueType: 'SHARED_TAX',
 *   expectedAmount: 500000,
 *   receivedAmount: 500000
 * });
 * ```
 */
export declare const recognizeIntergovernmentalRevenue: (revenueData: IntergovernmentalRevenue) => Promise<any>;
/**
 * Tracks shared tax revenue distributions.
 *
 * @param {string} programName - Shared tax program name
 * @param {Date} distributionDate - Distribution date
 * @returns {Promise<object>} Distribution tracking
 *
 * @example
 * ```typescript
 * const distribution = await trackSharedTaxDistribution('State Sales Tax', new Date());
 * ```
 */
export declare const trackSharedTaxDistribution: (programName: string, distributionDate: Date) => Promise<any>;
/**
 * Validates payment-in-lieu-of-taxes (PILOT) revenue.
 *
 * @param {object} pilotData - PILOT payment data
 * @returns {Promise<{ valid: boolean; recognizableAmount: number; reason: string }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePilotRevenue(pilotData);
 * ```
 */
export declare const validatePilotRevenue: (pilotData: any) => Promise<{
    valid: boolean;
    recognizableAmount: number;
    reason: string;
}>;
/**
 * Processes state aid revenue recognition.
 *
 * @param {string} aidProgramName - State aid program name
 * @param {number} entitlementAmount - Entitlement amount
 * @returns {Promise<object>} State aid processing
 *
 * @example
 * ```typescript
 * const result = await processStateAidRevenue('Education Aid', 1500000);
 * ```
 */
export declare const processStateAidRevenue: (aidProgramName: string, entitlementAmount: number) => Promise<any>;
/**
 * Reconciles intergovernmental revenue to budget.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} sourceGovernment - Source government entity
 * @returns {Promise<object>} Reconciliation result
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileIntergovernmentalRevenue(2025, 'State');
 * ```
 */
export declare const reconcileIntergovernmentalRevenue: (fiscalYear: number, sourceGovernment: string) => Promise<any>;
/**
 * Tracks revenue collections and outstanding receivables.
 *
 * @param {string} revenueSourceCode - Revenue source code
 * @param {number} billedAmount - Billed amount
 * @param {number} collectedAmount - Collected amount
 * @returns {Promise<RevenueCollection>} Collection tracking
 *
 * @example
 * ```typescript
 * const collection = await trackRevenueCollection('PROP-TAX-001', 5000000, 4750000);
 * ```
 */
export declare const trackRevenueCollection: (revenueSourceCode: string, billedAmount: number, collectedAmount: number) => Promise<RevenueCollection>;
/**
 * Analyzes revenue aging and collectibility.
 *
 * @param {string} revenueSourceCode - Revenue source code
 * @returns {Promise<object>} Aging analysis
 *
 * @example
 * ```typescript
 * const aging = await analyzeRevenueAging('PROP-TAX-001');
 * ```
 */
export declare const analyzeRevenueAging: (revenueSourceCode: string) => Promise<any>;
/**
 * Calculates uncollectible revenue allowance.
 *
 * @param {string} revenueSourceCode - Revenue source code
 * @param {number} outstandingBalance - Outstanding balance
 * @param {number} historicalCollectionRate - Historical collection rate
 * @returns {Promise<{ allowance: number; netReceivable: number }>} Allowance calculation
 *
 * @example
 * ```typescript
 * const allowance = await calculateUncollectibleAllowance('PROP-TAX-001', 250000, 96);
 * ```
 */
export declare const calculateUncollectibleAllowance: (revenueSourceCode: string, outstandingBalance: number, historicalCollectionRate: number) => Promise<{
    allowance: number;
    netReceivable: number;
}>;
/**
 * Processes revenue write-offs.
 *
 * @param {string} revenueSourceCode - Revenue source code
 * @param {number} writeOffAmount - Write-off amount
 * @param {string} reason - Write-off reason
 * @returns {Promise<object>} Write-off processing result
 *
 * @example
 * ```typescript
 * const result = await processRevenueWriteOff('FINE-REV-001', 5000, 'Uncollectible after 5 years');
 * ```
 */
export declare const processRevenueWriteOff: (revenueSourceCode: string, writeOffAmount: number, reason: string) => Promise<any>;
/**
 * Generates revenue collection performance report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {RevenueRecognitionPeriod} period - Reporting period
 * @returns {Promise<object>} Collection performance report
 *
 * @example
 * ```typescript
 * const report = await generateCollectionPerformanceReport(2025, fiscalPeriod);
 * ```
 */
export declare const generateCollectionPerformanceReport: (fiscalYear: number, period: RevenueRecognitionPeriod) => Promise<any>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createRevenueSourceModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            sourceCode: string;
            sourceName: string;
            sourceCategory: string;
            sourceDescription: string;
            recognitionMethod: string;
            fundType: string;
            accountCode: string;
            estimatedAnnualRevenue: number;
            actualRevenue: number;
            recognizedRevenue: number;
            deferredRevenue: number;
            fiscalYear: number;
            status: string;
            recognitionRules: Record<string, any>;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
            readonly createdBy: string;
            readonly updatedBy: string;
        };
    };
    createRevenueTransactionModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            transactionNumber: string;
            revenueSourceId: number;
            revenueSourceCode: string;
            transactionType: string;
            amount: number;
            recognitionDate: Date;
            recognitionBasis: string;
            fiscalPeriod: string;
            description: string;
            referenceNumber: string | null;
            deferralId: string | null;
            reversalOf: number | null;
            reversedBy: number | null;
            status: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly createdBy: string;
        };
    };
    createDeferredRevenueModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            deferralId: string;
            revenueSourceId: number;
            revenueSourceCode: string;
            originalAmount: number;
            deferredAmount: number;
            recognizedToDate: number;
            remainingDeferred: number;
            deferralReason: string;
            deferralDate: Date;
            recognitionStartDate: Date;
            recognitionEndDate: Date;
            recognitionSchedule: Record<string, any>[];
            status: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    applyModifiedAccrualRecognition: (revenueData: any, rules: RevenueRecognitionRule) => Promise<{
        recognizable: boolean;
        amount: number;
        deferralAmount: number;
        reason: string;
    }>;
    applyAccrualRecognition: (revenueData: any, rules: RevenueRecognitionRule) => Promise<{
        recognizable: boolean;
        amount: number;
        reason: string;
    }>;
    validateRecognitionTiming: (transactionDate: Date, period: RevenueRecognitionPeriod, availabilityPeriodDays: number) => Promise<{
        valid: boolean;
        recognitionDate: Date;
        reason: string;
    }>;
    determineDeferralRequirement: (revenueData: any, rules: RevenueRecognitionRule) => Promise<{
        shouldDefer: boolean;
        deferralAmount: number;
        reason: string;
    }>;
    createRecognitionRule: (revenueSourceCode: string, ruleData: Partial<RevenueRecognitionRule>) => Promise<RevenueRecognitionRule>;
    registerRevenueSource: (sourceData: Partial<RevenueSource>, createdBy: string) => Promise<any>;
    trackRevenueBySource: (sourceCode: string, amount: number, transactionDate: Date) => Promise<any>;
    getRevenueSourcesByCategory: (category: string, fiscalYear: number) => Promise<RevenueSource[]>;
    updateRevenueEstimate: (sourceCode: string, newEstimate: number, reason: string) => Promise<any>;
    compareRevenueSources: (sourceCodes: string[], period: RevenueRecognitionPeriod) => Promise<any[]>;
    recognizePropertyTaxRevenue: (taxData: TaxRevenueRecognition) => Promise<any>;
    recognizeSalesTaxRevenue: (amount: number, collectionMonth: Date, distributionLagMonths: number) => Promise<any>;
    calculateTaxRevenueWithAllowance: (billedAmount: number, historicalCollectionRate: number) => Promise<{
        recognizedRevenue: number;
        allowanceForUncollectible: number;
        netRevenue: number;
    }>;
    processTaxLevy: (levyData: any) => Promise<any>;
    reconcileTaxRevenue: (taxSourceCode: string, period: RevenueRecognitionPeriod) => Promise<any>;
    createDeferredRevenue: (deferralData: Partial<DeferredRevenue>) => Promise<any>;
    recognizeDeferredRevenue: (deferralId: string, recognitionDate: Date) => Promise<any>;
    generateRecognitionSchedule: (totalAmount: number, startDate: Date, endDate: Date, method: string) => Promise<RevenueRecognitionSchedule[]>;
    getDeferredRevenueBalances: (revenueSourceCode: string) => Promise<any>;
    cancelDeferredRevenue: (deferralId: string, reason: string) => Promise<any>;
    allocateRevenueToFunds: (allocationData: Partial<RevenueAllocation>) => Promise<any>;
    updateRevenueAllocation: (allocationId: string, newAllocations: any[]) => Promise<any>;
    validateAllocationPercentages: (allocations: any[]) => Promise<{
        valid: boolean;
        totalPercent: number;
        errors: string[];
    }>;
    processRevenueAllocation: (revenueSourceCode: string, period: RevenueRecognitionPeriod) => Promise<any>;
    getRevenueAllocationHistory: (revenueSourceCode: string, fiscalYear: number) => Promise<RevenueAllocation[]>;
    forecastRevenueTrend: (revenueSourceCode: string, fiscalYear: number, historicalYears: number) => Promise<RevenueForecast>;
    calculateMovingAverageForecast: (revenueSourceCode: string, periods: number) => Promise<number>;
    performRegressionForecast: (revenueSourceCode: string, historicalData: any[]) => Promise<{
        forecastedAmount: number;
        rSquared: number;
        equation: string;
    }>;
    compareForecastToActual: (forecastId: string, actualRevenue: number) => Promise<{
        variance: number;
        variancePercent: number;
        accuracy: string;
    }>;
    generateForecastSensitivity: (revenueSourceCode: string, scenarios: any) => Promise<any>;
    calculateRevenueVariance: (revenueSourceCode: string, period: RevenueRecognitionPeriod) => Promise<RevenueVariance>;
    analyzeRevenueTrends: (revenueSourceCode: string, periods: number) => Promise<any>;
    identifyRevenueVarianceExceptions: (fiscalYear: number, thresholdPercent: number) => Promise<RevenueVariance[]>;
    generateRevenueVarianceReport: (fiscalYear: number, period: RevenueRecognitionPeriod) => Promise<any>;
    trackRevenuePerformance: (revenueSourceCode: string, asOfDate: Date) => Promise<any>;
    recognizeGrantRevenue: (grantData: GrantRevenue, expendituresIncurred: number) => Promise<any>;
    validateGrantEligibility: (grantId: string, eligibilityData: any) => Promise<{
        eligible: boolean;
        metRequirements: string[];
        unmetRequirements: string[];
    }>;
    trackGrantExpenditures: (grantId: string, expenditureAmount: number) => Promise<any>;
    processGrantAdvance: (grantId: string, advanceAmount: number) => Promise<any>;
    reconcileGrantRevenue: (grantId: string) => Promise<any>;
    recognizeIntergovernmentalRevenue: (revenueData: IntergovernmentalRevenue) => Promise<any>;
    trackSharedTaxDistribution: (programName: string, distributionDate: Date) => Promise<any>;
    validatePilotRevenue: (pilotData: any) => Promise<{
        valid: boolean;
        recognizableAmount: number;
        reason: string;
    }>;
    processStateAidRevenue: (aidProgramName: string, entitlementAmount: number) => Promise<any>;
    reconcileIntergovernmentalRevenue: (fiscalYear: number, sourceGovernment: string) => Promise<any>;
    trackRevenueCollection: (revenueSourceCode: string, billedAmount: number, collectedAmount: number) => Promise<RevenueCollection>;
    analyzeRevenueAging: (revenueSourceCode: string) => Promise<any>;
    calculateUncollectibleAllowance: (revenueSourceCode: string, outstandingBalance: number, historicalCollectionRate: number) => Promise<{
        allowance: number;
        netReceivable: number;
    }>;
    processRevenueWriteOff: (revenueSourceCode: string, writeOffAmount: number, reason: string) => Promise<any>;
    generateCollectionPerformanceReport: (fiscalYear: number, period: RevenueRecognitionPeriod) => Promise<any>;
};
export default _default;
//# sourceMappingURL=revenue-recognition-management-kit.d.ts.map