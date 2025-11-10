/**
 * LOC: DEBTBOND1234567
 * File: /reuse/government/debt-bond-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend government finance services
 *   - Debt management controllers
 *   - Bond administration engines
 */
/**
 * File: /reuse/government/debt-bond-management-kit.ts
 * Locator: WC-GOV-DEBT-001
 * Purpose: Comprehensive Debt & Bond Management Utilities - Government municipal finance system
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Government finance controllers, debt services, bond administration, compliance tracking
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 50+ utility functions for bond issuance, debt service, covenant compliance, capacity analysis, refunding, arbitrage
 *
 * LLM Context: Enterprise-grade government debt and bond management system for municipal finance.
 * Provides bond lifecycle management, debt service scheduling, bond covenant compliance monitoring,
 * debt capacity analysis, bond refunding optimization, debt service payments, interest rate management,
 * debt limit monitoring, bond rating tracking, debt service reserve funds, arbitrage rebate calculations,
 * continuing disclosure reporting, call option management, trustee coordination, bond insurance tracking.
 */
import { Sequelize } from 'sequelize';
interface BondIssuance {
    bondId: string;
    issueDate: Date;
    bondType: 'GENERAL_OBLIGATION' | 'REVENUE' | 'SPECIAL_ASSESSMENT' | 'LEASE_REVENUE' | 'CERTIFICATES_OF_PARTICIPATION';
    bondPurpose: string;
    principalAmount: number;
    interestRate: number;
    maturityDate: Date;
    callableDate?: Date;
    callPremium?: number;
    rating: string;
    insuranceProvider?: string;
    status: 'PLANNED' | 'ISSUED' | 'OUTSTANDING' | 'REFUNDED' | 'MATURED';
}
interface DebtService {
    debtServiceId: string;
    bondId: string;
    paymentDate: Date;
    principalPayment: number;
    interestPayment: number;
    totalPayment: number;
    fiscalYear: number;
    paymentNumber: number;
    status: 'SCHEDULED' | 'PAID' | 'OVERDUE' | 'DEFERRED';
}
interface BondCovenant {
    covenantId: string;
    bondId: string;
    covenantType: 'DEBT_SERVICE_COVERAGE' | 'DEBT_LIMIT' | 'RATE_COVENANT' | 'RESERVE_REQUIREMENT' | 'ADDITIONAL_BONDS' | 'FINANCIAL_REPORTING';
    requirement: string;
    threshold?: number;
    measurementFrequency: 'ANNUAL' | 'SEMI_ANNUAL' | 'QUARTERLY' | 'MONTHLY';
    complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'WARNING' | 'NOT_MEASURED';
    lastMeasurementDate?: Date;
    nextMeasurementDate: Date;
}
interface DebtCapacityAnalysis {
    analysisDate: Date;
    totalDebt: number;
    legalDebtLimit: number;
    availableDebtCapacity: number;
    utilizationRate: number;
    assessedValuation: number;
    debtPerCapita: number;
    debtServiceAsPercentOfRevenue: number;
    debtServiceAsPercentOfBudget: number;
    creditMetrics: {
        rating: string;
        outlook: string;
        ratingAgency: string;
    }[];
}
interface BondRefunding {
    refundingId: string;
    originalBondId: string;
    refundingBondId: string;
    refundingType: 'CURRENT' | 'ADVANCE';
    refundedPrincipal: number;
    newPrincipal: number;
    presentValueSavings: number;
    savingsPercent: number;
    escrowRequirement: number;
    refundingDate: Date;
    status: 'PLANNED' | 'EXECUTED' | 'CANCELLED';
}
interface DebtLimitMonitoring {
    monitoringDate: Date;
    legalDebtLimit: number;
    statutoryBasis: string;
    currentOutstandingDebt: number;
    authorizedButUnissuedDebt: number;
    totalDebtSubjectToLimit: number;
    remainingCapacity: number;
    utilizationPercent: number;
    exemptDebt: number;
    selfSupportingDebt: number;
}
interface BondRating {
    ratingId: string;
    bondId: string;
    ratingAgency: 'MOODYS' | 'SP' | 'FITCH' | 'KBRA';
    rating: string;
    outlook: 'POSITIVE' | 'STABLE' | 'NEGATIVE' | 'DEVELOPING';
    ratingDate: Date;
    nextReviewDate?: Date;
    ratingRationale?: string;
    watchStatus?: 'NONE' | 'POSITIVE' | 'NEGATIVE';
}
interface ArbitrageRebate {
    rebateId: string;
    bondId: string;
    calculationDate: Date;
    bondYield: number;
    investmentYield: number;
    excessYield: number;
    rebateLiability: number;
    rebatePaid: number;
    rebateOwed: number;
    nextCalculationDate: Date;
    filingRequired: boolean;
    exemptionClaimed?: string;
}
/**
 * Sequelize model for Bond Issuance Management with complete bond lifecycle tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BondIssuance model
 *
 * @example
 * ```typescript
 * const BondIssuance = createBondIssuanceModel(sequelize);
 * const bond = await BondIssuance.create({
 *   bondId: 'GO-2025-A',
 *   issueDate: new Date('2025-03-15'),
 *   bondType: 'GENERAL_OBLIGATION',
 *   bondPurpose: 'Capital improvements',
 *   principalAmount: 10000000,
 *   interestRate: 4.5,
 *   maturityDate: new Date('2045-03-15')
 * });
 * ```
 */
export declare const createBondIssuanceModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        bondId: string;
        bondSeries: string;
        issueDate: Date;
        bondType: string;
        bondPurpose: string;
        principalAmount: number;
        originalPrincipal: number;
        outstandingPrincipal: number;
        interestRate: number;
        maturityDate: Date;
        callableDate: Date | null;
        callPremium: number | null;
        rating: string;
        insuranceProvider: string | null;
        cusipNumber: string | null;
        taxExempt: boolean;
        status: string;
        covenants: Record<string, any>;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Debt Service Schedule with payment tracking and status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DebtService model
 *
 * @example
 * ```typescript
 * const DebtService = createDebtServiceModel(sequelize);
 * const payment = await DebtService.create({
 *   bondId: 'GO-2025-A',
 *   paymentDate: new Date('2025-09-01'),
 *   principalPayment: 250000,
 *   interestPayment: 225000,
 *   totalPayment: 475000
 * });
 * ```
 */
export declare const createDebtServiceModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        debtServiceId: string;
        bondId: string;
        paymentDate: Date;
        principalPayment: number;
        interestPayment: number;
        totalPayment: number;
        fiscalYear: number;
        paymentNumber: number;
        paidDate: Date | null;
        paidAmount: number | null;
        status: string;
        paymentSource: string | null;
        confirmationNumber: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Bond Covenant Compliance with monitoring and tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BondCovenant model
 *
 * @example
 * ```typescript
 * const BondCovenant = createBondCovenantModel(sequelize);
 * const covenant = await BondCovenant.create({
 *   covenantId: 'COV-2025-001',
 *   bondId: 'GO-2025-A',
 *   covenantType: 'DEBT_SERVICE_COVERAGE',
 *   requirement: 'Maintain 1.25x debt service coverage',
 *   threshold: 1.25,
 *   measurementFrequency: 'ANNUAL'
 * });
 * ```
 */
export declare const createBondCovenantModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        covenantId: string;
        bondId: string;
        covenantType: string;
        requirement: string;
        threshold: number | null;
        measurementFrequency: string;
        complianceStatus: string;
        lastMeasurementDate: Date | null;
        lastMeasurementValue: number | null;
        nextMeasurementDate: Date;
        complianceHistory: Record<string, any>[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates new bond issuance record with complete details.
 *
 * @param {Partial<BondIssuance>} bondData - Bond issuance data
 * @param {string} createdBy - User creating bond
 * @returns {Promise<object>} Created bond issuance
 *
 * @example
 * ```typescript
 * const bond = await createBondIssuance({
 *   bondId: 'GO-2025-A',
 *   bondType: 'GENERAL_OBLIGATION',
 *   bondPurpose: 'Infrastructure improvements',
 *   principalAmount: 10000000,
 *   interestRate: 4.5,
 *   maturityDate: new Date('2045-03-15')
 * }, 'finance.director');
 * ```
 */
export declare const createBondIssuance: (bondData: Partial<BondIssuance>, createdBy: string) => Promise<any>;
/**
 * Updates bond issuance status through lifecycle.
 *
 * @param {string} bondId - Bond ID
 * @param {string} newStatus - New bond status
 * @param {string} updatedBy - User updating status
 * @returns {Promise<object>} Updated bond
 *
 * @example
 * ```typescript
 * const updated = await updateBondStatus('GO-2025-A', 'ISSUED', 'finance.director');
 * ```
 */
export declare const updateBondStatus: (bondId: string, newStatus: string, updatedBy: string) => Promise<any>;
/**
 * Tracks bond principal payments and outstanding balance.
 *
 * @param {string} bondId - Bond ID
 * @param {number} principalPayment - Principal payment amount
 * @returns {Promise<object>} Updated bond principal
 *
 * @example
 * ```typescript
 * const result = await trackBondPrincipalPayment('GO-2025-A', 250000);
 * ```
 */
export declare const trackBondPrincipalPayment: (bondId: string, principalPayment: number) => Promise<any>;
/**
 * Retrieves bond issuances by type and status.
 *
 * @param {string} bondType - Bond type filter
 * @param {string} [status] - Optional status filter
 * @returns {Promise<BondIssuance[]>} Filtered bond issuances
 *
 * @example
 * ```typescript
 * const bonds = await getBondIssuancesByType('GENERAL_OBLIGATION', 'OUTSTANDING');
 * ```
 */
export declare const getBondIssuancesByType: (bondType: string, status?: string) => Promise<BondIssuance[]>;
/**
 * Calculates total debt service for a bond.
 *
 * @param {string} bondId - Bond ID
 * @returns {Promise<{ totalPrincipal: number; totalInterest: number; totalDebtService: number }>} Debt service totals
 *
 * @example
 * ```typescript
 * const totals = await calculateBondDebtService('GO-2025-A');
 * ```
 */
export declare const calculateBondDebtService: (bondId: string) => Promise<{
    totalPrincipal: number;
    totalInterest: number;
    totalDebtService: number;
}>;
/**
 * Generates complete debt service schedule for bond.
 *
 * @param {string} bondId - Bond ID
 * @param {number} principalAmount - Total principal
 * @param {number} interestRate - Annual interest rate
 * @param {Date} firstPaymentDate - First payment date
 * @param {Date} maturityDate - Final maturity date
 * @returns {Promise<DebtService[]>} Debt service schedule
 *
 * @example
 * ```typescript
 * const schedule = await generateDebtServiceSchedule(
 *   'GO-2025-A',
 *   10000000,
 *   4.5,
 *   new Date('2025-09-01'),
 *   new Date('2045-03-01')
 * );
 * ```
 */
export declare const generateDebtServiceSchedule: (bondId: string, principalAmount: number, interestRate: number, firstPaymentDate: Date, maturityDate: Date) => Promise<DebtService[]>;
/**
 * Records debt service payment execution.
 *
 * @param {string} debtServiceId - Debt service payment ID
 * @param {number} paidAmount - Amount paid
 * @param {string} confirmationNumber - Payment confirmation
 * @returns {Promise<object>} Payment record
 *
 * @example
 * ```typescript
 * const payment = await recordDebtServicePayment('DS-GO-2025-A-1', 475000, 'CONF-12345');
 * ```
 */
export declare const recordDebtServicePayment: (debtServiceId: string, paidAmount: number, confirmationNumber: string) => Promise<any>;
/**
 * Retrieves debt service schedule for fiscal year.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {string} [bondId] - Optional bond ID filter
 * @returns {Promise<DebtService[]>} Fiscal year debt service
 *
 * @example
 * ```typescript
 * const schedule = await getDebtServiceByFiscalYear(2025, 'GO-2025-A');
 * ```
 */
export declare const getDebtServiceByFiscalYear: (fiscalYear: number, bondId?: string) => Promise<DebtService[]>;
/**
 * Calculates annual debt service requirements.
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<{ totalPrincipal: number; totalInterest: number; totalDebtService: number; byBond: object[] }>} Annual debt service
 *
 * @example
 * ```typescript
 * const annual = await calculateAnnualDebtService(2025);
 * ```
 */
export declare const calculateAnnualDebtService: (fiscalYear: number) => Promise<{
    totalPrincipal: number;
    totalInterest: number;
    totalDebtService: number;
    byBond: any[];
}>;
/**
 * Projects future debt service requirements.
 *
 * @param {number} yearsForward - Number of years to project
 * @returns {Promise<object[]>} Projected debt service
 *
 * @example
 * ```typescript
 * const projection = await projectFutureDebtService(10);
 * ```
 */
export declare const projectFutureDebtService: (yearsForward: number) => Promise<any[]>;
/**
 * Creates bond covenant monitoring requirement.
 *
 * @param {Partial<BondCovenant>} covenantData - Covenant data
 * @returns {Promise<object>} Created covenant
 *
 * @example
 * ```typescript
 * const covenant = await createBondCovenant({
 *   bondId: 'GO-2025-A',
 *   covenantType: 'DEBT_SERVICE_COVERAGE',
 *   requirement: 'Maintain 1.25x coverage',
 *   threshold: 1.25,
 *   measurementFrequency: 'ANNUAL'
 * });
 * ```
 */
export declare const createBondCovenant: (covenantData: Partial<BondCovenant>) => Promise<any>;
/**
 * Measures covenant compliance.
 *
 * @param {string} covenantId - Covenant ID
 * @param {number} measuredValue - Measured value
 * @returns {Promise<{ compliant: boolean; measuredValue: number; threshold: number; variance: number }>} Compliance measurement
 *
 * @example
 * ```typescript
 * const compliance = await measureCovenantCompliance('COV-12345', 1.35);
 * ```
 */
export declare const measureCovenantCompliance: (covenantId: string, measuredValue: number) => Promise<{
    compliant: boolean;
    measuredValue: number;
    threshold: number;
    variance: number;
}>;
/**
 * Validates debt service coverage ratio.
 *
 * @param {number} netRevenue - Net revenue available for debt service
 * @param {number} debtServicePayment - Annual debt service payment
 * @param {number} requiredCoverage - Required coverage ratio
 * @returns {Promise<{ compliant: boolean; actualCoverage: number; requiredCoverage: number }>} Coverage validation
 *
 * @example
 * ```typescript
 * const coverage = await validateDebtServiceCoverage(1500000, 1200000, 1.25);
 * ```
 */
export declare const validateDebtServiceCoverage: (netRevenue: number, debtServicePayment: number, requiredCoverage: number) => Promise<{
    compliant: boolean;
    actualCoverage: number;
    requiredCoverage: number;
}>;
/**
 * Monitors rate covenant compliance.
 *
 * @param {string} bondId - Bond ID
 * @param {number} currentRate - Current rate charged
 * @param {number} requiredRate - Required minimum rate
 * @returns {Promise<{ compliant: boolean; currentRate: number; requiredRate: number }>} Rate covenant status
 *
 * @example
 * ```typescript
 * const rateCompliance = await monitorRateCovenant('REV-2025-A', 5.5, 5.0);
 * ```
 */
export declare const monitorRateCovenant: (bondId: string, currentRate: number, requiredRate: number) => Promise<{
    compliant: boolean;
    currentRate: number;
    requiredRate: number;
}>;
/**
 * Retrieves covenant compliance status for bond.
 *
 * @param {string} bondId - Bond ID
 * @returns {Promise<BondCovenant[]>} All covenants for bond
 *
 * @example
 * ```typescript
 * const covenants = await getCovenantComplianceStatus('GO-2025-A');
 * ```
 */
export declare const getCovenantComplianceStatus: (bondId: string) => Promise<BondCovenant[]>;
/**
 * Analyzes total debt capacity and utilization.
 *
 * @param {Date} analysisDate - Analysis date
 * @param {number} assessedValuation - Total assessed valuation
 * @param {number} legalDebtLimitPercent - Legal debt limit as percent of valuation
 * @returns {Promise<DebtCapacityAnalysis>} Debt capacity analysis
 *
 * @example
 * ```typescript
 * const capacity = await analyzeDebtCapacity(
 *   new Date(),
 *   5000000000,
 *   10
 * );
 * ```
 */
export declare const analyzeDebtCapacity: (analysisDate: Date, assessedValuation: number, legalDebtLimitPercent: number) => Promise<DebtCapacityAnalysis>;
/**
 * Calculates debt limit under statutory constraints.
 *
 * @param {number} assessedValuation - Assessed property valuation
 * @param {number} legalLimitPercent - Legal limit percentage
 * @param {number} currentDebt - Current outstanding debt
 * @returns {Promise<{ legalLimit: number; currentDebt: number; availableCapacity: number; utilizationPercent: number }>} Debt limit calculation
 *
 * @example
 * ```typescript
 * const limit = await calculateStatutoryDebtLimit(5000000000, 10, 250000000);
 * ```
 */
export declare const calculateStatutoryDebtLimit: (assessedValuation: number, legalLimitPercent: number, currentDebt: number) => Promise<{
    legalLimit: number;
    currentDebt: number;
    availableCapacity: number;
    utilizationPercent: number;
}>;
/**
 * Calculates debt per capita metrics.
 *
 * @param {number} totalDebt - Total outstanding debt
 * @param {number} population - Current population
 * @returns {Promise<{ debtPerCapita: number; totalDebt: number; population: number }>} Per capita calculation
 *
 * @example
 * ```typescript
 * const perCapita = await calculateDebtPerCapita(250000000, 100000);
 * ```
 */
export declare const calculateDebtPerCapita: (totalDebt: number, population: number) => Promise<{
    debtPerCapita: number;
    totalDebt: number;
    population: number;
}>;
/**
 * Analyzes debt service as percent of budget.
 *
 * @param {number} annualDebtService - Annual debt service
 * @param {number} totalBudget - Total budget
 * @returns {Promise<{ debtServicePercent: number; annualDebtService: number; totalBudget: number }>} Budget ratio analysis
 *
 * @example
 * ```typescript
 * const ratio = await analyzeDebtServiceRatio(15000000, 100000000);
 * ```
 */
export declare const analyzeDebtServiceRatio: (annualDebtService: number, totalBudget: number) => Promise<{
    debtServicePercent: number;
    annualDebtService: number;
    totalBudget: number;
}>;
/**
 * Evaluates additional debt capacity for new issuance.
 *
 * @param {number} proposedNewDebt - Proposed new debt amount
 * @returns {Promise<{ affordable: boolean; impactOnRatios: object; recommendation: string }>} Affordability analysis
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateAdditionalDebtCapacity(50000000);
 * ```
 */
export declare const evaluateAdditionalDebtCapacity: (proposedNewDebt: number) => Promise<{
    affordable: boolean;
    impactOnRatios: any;
    recommendation: string;
}>;
/**
 * Analyzes bond refunding opportunity and savings.
 *
 * @param {string} originalBondId - Original bond to refund
 * @param {number} currentInterestRate - Current market rate
 * @returns {Promise<{ economical: boolean; presentValueSavings: number; savingsPercent: number; recommendation: string }>} Refunding analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeBondRefundingOpportunity('GO-2020-A', 3.5);
 * ```
 */
export declare const analyzeBondRefundingOpportunity: (originalBondId: string, currentInterestRate: number) => Promise<{
    economical: boolean;
    presentValueSavings: number;
    savingsPercent: number;
    recommendation: string;
}>;
/**
 * Calculates present value savings from refunding.
 *
 * @param {number} oldDebtService - Old debt service payments
 * @param {number} newDebtService - New debt service payments
 * @param {number} discountRate - Discount rate for PV calculation
 * @returns {Promise<{ presentValueSavings: number; nominalSavings: number }>} PV savings calculation
 *
 * @example
 * ```typescript
 * const savings = await calculateRefundingSavings(15000000, 14000000, 3.5);
 * ```
 */
export declare const calculateRefundingSavings: (oldDebtService: number, newDebtService: number, discountRate: number) => Promise<{
    presentValueSavings: number;
    nominalSavings: number;
}>;
/**
 * Determines escrow requirement for advance refunding.
 *
 * @param {string} bondId - Bond to refund
 * @param {Date} callDate - Call date
 * @returns {Promise<{ escrowRequired: number; callPremium: number; totalEscrow: number }>} Escrow calculation
 *
 * @example
 * ```typescript
 * const escrow = await determineEscrowRequirement('GO-2020-A', new Date('2025-09-01'));
 * ```
 */
export declare const determineEscrowRequirement: (bondId: string, callDate: Date) => Promise<{
    escrowRequired: number;
    callPremium: number;
    totalEscrow: number;
}>;
/**
 * Creates bond refunding transaction record.
 *
 * @param {Partial<BondRefunding>} refundingData - Refunding data
 * @returns {Promise<object>} Refunding record
 *
 * @example
 * ```typescript
 * const refunding = await createBondRefunding({
 *   originalBondId: 'GO-2020-A',
 *   refundingBondId: 'GO-2025-REF',
 *   refundingType: 'ADVANCE',
 *   presentValueSavings: 850000
 * });
 * ```
 */
export declare const createBondRefunding: (refundingData: Partial<BondRefunding>) => Promise<any>;
/**
 * Validates refunding IRS regulations compliance.
 *
 * @param {string} refundingId - Refunding ID
 * @param {string} refundingType - Refunding type
 * @returns {Promise<{ compliant: boolean; issues: string[]; recommendations: string[] }>} Compliance validation
 *
 * @example
 * ```typescript
 * const validation = await validateRefundingCompliance('REF-12345', 'ADVANCE');
 * ```
 */
export declare const validateRefundingCompliance: (refundingId: string, refundingType: string) => Promise<{
    compliant: boolean;
    issues: string[];
    recommendations: string[];
}>;
/**
 * Tracks variable interest rate adjustments.
 *
 * @param {string} bondId - Bond ID
 * @param {number} newRate - New interest rate
 * @param {Date} effectiveDate - Rate effective date
 * @returns {Promise<object>} Rate adjustment record
 *
 * @example
 * ```typescript
 * const adjustment = await trackInterestRateAdjustment('VAR-2025-A', 3.75, new Date());
 * ```
 */
export declare const trackInterestRateAdjustment: (bondId: string, newRate: number, effectiveDate: Date) => Promise<any>;
/**
 * Calculates interest rate swap valuation.
 *
 * @param {string} swapId - Swap agreement ID
 * @param {number} notionalAmount - Notional amount
 * @param {Date} valuationDate - Valuation date
 * @returns {Promise<{ fairValue: number; notionalAmount: number; gainLoss: number }>} Swap valuation
 *
 * @example
 * ```typescript
 * const valuation = await calculateInterestRateSwapValue('SWAP-001', 50000000, new Date());
 * ```
 */
export declare const calculateInterestRateSwapValue: (swapId: string, notionalAmount: number, valuationDate: Date) => Promise<{
    fairValue: number;
    notionalAmount: number;
    gainLoss: number;
}>;
/**
 * Monitors interest rate caps and floors.
 *
 * @param {string} bondId - Bond ID
 * @param {number} currentRate - Current rate
 * @returns {Promise<{ withinLimits: boolean; currentRate: number; cap: number; floor: number }>} Rate limit monitoring
 *
 * @example
 * ```typescript
 * const monitoring = await monitorRateCapsFloors('VAR-2025-A', 4.25);
 * ```
 */
export declare const monitorRateCapsFloors: (bondId: string, currentRate: number) => Promise<{
    withinLimits: boolean;
    currentRate: number;
    cap: number;
    floor: number;
}>;
/**
 * Projects interest rate risk exposure.
 *
 * @param {string} bondId - Bond ID
 * @param {number[]} rateScenarios - Rate scenarios to model
 * @returns {Promise<object[]>} Rate scenario projections
 *
 * @example
 * ```typescript
 * const scenarios = await projectInterestRateRisk('VAR-2025-A', [3.0, 4.0, 5.0]);
 * ```
 */
export declare const projectInterestRateRisk: (bondId: string, rateScenarios: number[]) => Promise<any[]>;
/**
 * Generates interest rate hedging recommendations.
 *
 * @param {string} bondId - Bond ID
 * @param {object} riskProfile - Risk tolerance profile
 * @returns {Promise<{ recommended: boolean; strategies: string[]; rationale: string }>} Hedging recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await generateHedgingRecommendations('VAR-2025-A', riskProfile);
 * ```
 */
export declare const generateHedgingRecommendations: (bondId: string, riskProfile: any) => Promise<{
    recommended: boolean;
    strategies: string[];
    rationale: string;
}>;
/**
 * Monitors debt against statutory limits.
 *
 * @param {Date} monitoringDate - Monitoring date
 * @param {number} assessedValuation - Current assessed valuation
 * @returns {Promise<DebtLimitMonitoring>} Debt limit monitoring
 *
 * @example
 * ```typescript
 * const monitoring = await monitorStatutoryDebtLimits(new Date(), 5000000000);
 * ```
 */
export declare const monitorStatutoryDebtLimits: (monitoringDate: Date, assessedValuation: number) => Promise<DebtLimitMonitoring>;
/**
 * Tracks authorized but unissued debt.
 *
 * @param {string} authorizationId - Authorization ID
 * @param {number} authorizedAmount - Authorized amount
 * @param {number} issuedAmount - Amount already issued
 * @returns {Promise<{ remaining: number; percentIssued: number }>} Unissued debt tracking
 *
 * @example
 * ```typescript
 * const tracking = await trackAuthorizedUnissuedDebt('AUTH-2024-001', 100000000, 50000000);
 * ```
 */
export declare const trackAuthorizedUnissuedDebt: (authorizationId: string, authorizedAmount: number, issuedAmount: number) => Promise<{
    remaining: number;
    percentIssued: number;
}>;
/**
 * Validates proposed debt against limits.
 *
 * @param {number} proposedDebtAmount - Proposed new debt
 * @param {DebtLimitMonitoring} currentLimits - Current debt limits
 * @returns {Promise<{ permissible: boolean; exceedsLimit: boolean; availableCapacity: number }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateProposedDebtAgainstLimits(75000000, debtLimits);
 * ```
 */
export declare const validateProposedDebtAgainstLimits: (proposedDebtAmount: number, currentLimits: DebtLimitMonitoring) => Promise<{
    permissible: boolean;
    exceedsLimit: boolean;
    availableCapacity: number;
}>;
/**
 * Calculates exempt and self-supporting debt.
 *
 * @returns {Promise<{ exemptDebt: number; selfSupportingDebt: number; totalExcluded: number }>} Excluded debt calculation
 *
 * @example
 * ```typescript
 * const excluded = await calculateExemptDebt();
 * ```
 */
export declare const calculateExemptDebt: () => Promise<{
    exemptDebt: number;
    selfSupportingDebt: number;
    totalExcluded: number;
}>;
/**
 * Generates debt limit compliance report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<object>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateDebtLimitComplianceReport(2025);
 * ```
 */
export declare const generateDebtLimitComplianceReport: (fiscalYear: number) => Promise<any>;
/**
 * Records bond rating from rating agency.
 *
 * @param {Partial<BondRating>} ratingData - Rating data
 * @returns {Promise<object>} Rating record
 *
 * @example
 * ```typescript
 * const rating = await recordBondRating({
 *   bondId: 'GO-2025-A',
 *   ratingAgency: 'SP',
 *   rating: 'AA+',
 *   outlook: 'STABLE'
 * });
 * ```
 */
export declare const recordBondRating: (ratingData: Partial<BondRating>) => Promise<any>;
/**
 * Tracks rating changes and trends.
 *
 * @param {string} bondId - Bond ID
 * @returns {Promise<object[]>} Rating history
 *
 * @example
 * ```typescript
 * const history = await trackRatingChanges('GO-2025-A');
 * ```
 */
export declare const trackRatingChanges: (bondId: string) => Promise<any[]>;
/**
 * Monitors rating agency review schedule.
 *
 * @param {string} bondId - Bond ID
 * @returns {Promise<object[]>} Upcoming rating reviews
 *
 * @example
 * ```typescript
 * const reviews = await monitorRatingReviewSchedule('GO-2025-A');
 * ```
 */
export declare const monitorRatingReviewSchedule: (bondId: string) => Promise<any[]>;
/**
 * Analyzes rating impact on borrowing costs.
 *
 * @param {string} currentRating - Current bond rating
 * @param {string} proposedRating - Proposed/potential rating
 * @returns {Promise<{ basisPointDifference: number; annualCostImpact: number }>} Cost impact analysis
 *
 * @example
 * ```typescript
 * const impact = await analyzeRatingImpactOnCost('AA+', 'AAA');
 * ```
 */
export declare const analyzeRatingImpactOnCost: (currentRating: string, proposedRating: string) => Promise<{
    basisPointDifference: number;
    annualCostImpact: number;
}>;
/**
 * Prepares rating agency presentation materials.
 *
 * @param {string} bondId - Bond ID
 * @param {string} ratingAgency - Rating agency
 * @returns {Promise<object>} Presentation materials
 *
 * @example
 * ```typescript
 * const materials = await prepareRatingAgencyPresentation('GO-2025-A', 'SP');
 * ```
 */
export declare const prepareRatingAgencyPresentation: (bondId: string, ratingAgency: string) => Promise<any>;
/**
 * Establishes debt service reserve fund requirement.
 *
 * @param {string} bondId - Bond ID
 * @param {string} calculationBasis - Calculation basis
 * @param {number} percentOrAmount - Percent or fixed amount
 * @returns {Promise<object>} Reserve fund requirement
 *
 * @example
 * ```typescript
 * const reserve = await establishDebtServiceReserve('GO-2025-A', 'MAX_ANNUAL_DEBT_SERVICE', 1.0);
 * ```
 */
export declare const establishDebtServiceReserve: (bondId: string, calculationBasis: string, percentOrAmount: number) => Promise<any>;
/**
 * Monitors debt service reserve fund balance.
 *
 * @param {string} fundId - Reserve fund ID
 * @param {Date} valuationDate - Valuation date
 * @returns {Promise<{ compliant: boolean; requiredBalance: number; currentBalance: number; deficiency: number }>} Fund monitoring
 *
 * @example
 * ```typescript
 * const status = await monitorReserveFundBalance('DSRF-12345', new Date());
 * ```
 */
export declare const monitorReserveFundBalance: (fundId: string, valuationDate: Date) => Promise<{
    compliant: boolean;
    requiredBalance: number;
    currentBalance: number;
    deficiency: number;
}>;
/**
 * Processes reserve fund replenishment.
 *
 * @param {string} fundId - Reserve fund ID
 * @param {number} replenishmentAmount - Replenishment amount
 * @returns {Promise<object>} Replenishment transaction
 *
 * @example
 * ```typescript
 * const replenishment = await processReserveFundReplenishment('DSRF-12345', 50000);
 * ```
 */
export declare const processReserveFundReplenishment: (fundId: string, replenishmentAmount: number) => Promise<any>;
/**
 * Evaluates reserve fund surety vs cash funding.
 *
 * @param {number} requiredBalance - Required reserve balance
 * @param {number} suretyPremium - Annual surety premium
 * @param {number} investmentYield - Cash investment yield
 * @returns {Promise<{ recommendCash: boolean; netBenefit: number; analysis: string }>} Funding method analysis
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateReserveFundingOptions(1450000, 15000, 3.5);
 * ```
 */
export declare const evaluateReserveFundingOptions: (requiredBalance: number, suretyPremium: number, investmentYield: number) => Promise<{
    recommendCash: boolean;
    netBenefit: number;
    analysis: string;
}>;
/**
 * Releases reserve fund upon bond maturity.
 *
 * @param {string} fundId - Reserve fund ID
 * @param {string} bondId - Matured bond ID
 * @returns {Promise<object>} Release transaction
 *
 * @example
 * ```typescript
 * const release = await releaseReserveFund('DSRF-12345', 'GO-2025-A');
 * ```
 */
export declare const releaseReserveFund: (fundId: string, bondId: string) => Promise<any>;
/**
 * Calculates arbitrage rebate liability.
 *
 * @param {string} bondId - Bond ID
 * @param {Date} calculationDate - Calculation date
 * @param {number} bondYield - Bond yield
 * @param {number} investmentYield - Investment yield
 * @returns {Promise<ArbitrageRebate>} Rebate calculation
 *
 * @example
 * ```typescript
 * const rebate = await calculateArbitrageRebate('GO-2025-A', new Date(), 4.5, 5.2);
 * ```
 */
export declare const calculateArbitrageRebate: (bondId: string, calculationDate: Date, bondYield: number, investmentYield: number) => Promise<ArbitrageRebate>;
/**
 * Processes arbitrage rebate payment to IRS.
 *
 * @param {string} rebateId - Rebate ID
 * @param {number} paymentAmount - Payment amount
 * @returns {Promise<object>} Payment record
 *
 * @example
 * ```typescript
 * const payment = await processArbitrageRebatePayment('ARB-12345', 125000);
 * ```
 */
export declare const processArbitrageRebatePayment: (rebateId: string, paymentAmount: number) => Promise<any>;
/**
 * Monitors arbitrage safe harbors and exemptions.
 *
 * @param {string} bondId - Bond ID
 * @param {object} bondCharacteristics - Bond characteristics
 * @returns {Promise<{ exemptFromRebate: boolean; exemptionType: string; monitoring Required: boolean }>} Exemption status
 *
 * @example
 * ```typescript
 * const exemption = await monitorArbitrageSafeHarbors('GO-2025-A', bondCharacteristics);
 * ```
 */
export declare const monitorArbitrageSafeHarbors: (bondId: string, bondCharacteristics: any) => Promise<{
    exemptFromRebate: boolean;
    exemptionType: string;
    monitoringRequired: boolean;
}>;
/**
 * Validates investment yield calculations.
 *
 * @param {string} bondId - Bond ID
 * @param {object[]} investments - Investment portfolio
 * @returns {Promise<{ averageYield: number; excessEarnings: number; rebateLiability: number }>} Yield validation
 *
 * @example
 * ```typescript
 * const validation = await validateInvestmentYieldCalculations('GO-2025-A', investments);
 * ```
 */
export declare const validateInvestmentYieldCalculations: (bondId: string, investments: any[]) => Promise<{
    averageYield: number;
    excessEarnings: number;
    rebateLiability: number;
}>;
/**
 * Generates arbitrage compliance report.
 *
 * @param {string} bondId - Bond ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<object>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateArbitrageComplianceReport('GO-2025-A', 2025);
 * ```
 */
export declare const generateArbitrageComplianceReport: (bondId: string, fiscalYear: number) => Promise<any>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createBondIssuanceModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            bondId: string;
            bondSeries: string;
            issueDate: Date;
            bondType: string;
            bondPurpose: string;
            principalAmount: number;
            originalPrincipal: number;
            outstandingPrincipal: number;
            interestRate: number;
            maturityDate: Date;
            callableDate: Date | null;
            callPremium: number | null;
            rating: string;
            insuranceProvider: string | null;
            cusipNumber: string | null;
            taxExempt: boolean;
            status: string;
            covenants: Record<string, any>;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
            readonly createdBy: string;
            readonly updatedBy: string;
        };
    };
    createDebtServiceModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            debtServiceId: string;
            bondId: string;
            paymentDate: Date;
            principalPayment: number;
            interestPayment: number;
            totalPayment: number;
            fiscalYear: number;
            paymentNumber: number;
            paidDate: Date | null;
            paidAmount: number | null;
            status: string;
            paymentSource: string | null;
            confirmationNumber: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createBondCovenantModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            covenantId: string;
            bondId: string;
            covenantType: string;
            requirement: string;
            threshold: number | null;
            measurementFrequency: string;
            complianceStatus: string;
            lastMeasurementDate: Date | null;
            lastMeasurementValue: number | null;
            nextMeasurementDate: Date;
            complianceHistory: Record<string, any>[];
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createBondIssuance: (bondData: Partial<BondIssuance>, createdBy: string) => Promise<any>;
    updateBondStatus: (bondId: string, newStatus: string, updatedBy: string) => Promise<any>;
    trackBondPrincipalPayment: (bondId: string, principalPayment: number) => Promise<any>;
    getBondIssuancesByType: (bondType: string, status?: string) => Promise<BondIssuance[]>;
    calculateBondDebtService: (bondId: string) => Promise<{
        totalPrincipal: number;
        totalInterest: number;
        totalDebtService: number;
    }>;
    generateDebtServiceSchedule: (bondId: string, principalAmount: number, interestRate: number, firstPaymentDate: Date, maturityDate: Date) => Promise<DebtService[]>;
    recordDebtServicePayment: (debtServiceId: string, paidAmount: number, confirmationNumber: string) => Promise<any>;
    getDebtServiceByFiscalYear: (fiscalYear: number, bondId?: string) => Promise<DebtService[]>;
    calculateAnnualDebtService: (fiscalYear: number) => Promise<{
        totalPrincipal: number;
        totalInterest: number;
        totalDebtService: number;
        byBond: any[];
    }>;
    projectFutureDebtService: (yearsForward: number) => Promise<any[]>;
    createBondCovenant: (covenantData: Partial<BondCovenant>) => Promise<any>;
    measureCovenantCompliance: (covenantId: string, measuredValue: number) => Promise<{
        compliant: boolean;
        measuredValue: number;
        threshold: number;
        variance: number;
    }>;
    validateDebtServiceCoverage: (netRevenue: number, debtServicePayment: number, requiredCoverage: number) => Promise<{
        compliant: boolean;
        actualCoverage: number;
        requiredCoverage: number;
    }>;
    monitorRateCovenant: (bondId: string, currentRate: number, requiredRate: number) => Promise<{
        compliant: boolean;
        currentRate: number;
        requiredRate: number;
    }>;
    getCovenantComplianceStatus: (bondId: string) => Promise<BondCovenant[]>;
    analyzeDebtCapacity: (analysisDate: Date, assessedValuation: number, legalDebtLimitPercent: number) => Promise<DebtCapacityAnalysis>;
    calculateStatutoryDebtLimit: (assessedValuation: number, legalLimitPercent: number, currentDebt: number) => Promise<{
        legalLimit: number;
        currentDebt: number;
        availableCapacity: number;
        utilizationPercent: number;
    }>;
    calculateDebtPerCapita: (totalDebt: number, population: number) => Promise<{
        debtPerCapita: number;
        totalDebt: number;
        population: number;
    }>;
    analyzeDebtServiceRatio: (annualDebtService: number, totalBudget: number) => Promise<{
        debtServicePercent: number;
        annualDebtService: number;
        totalBudget: number;
    }>;
    evaluateAdditionalDebtCapacity: (proposedNewDebt: number) => Promise<{
        affordable: boolean;
        impactOnRatios: any;
        recommendation: string;
    }>;
    analyzeBondRefundingOpportunity: (originalBondId: string, currentInterestRate: number) => Promise<{
        economical: boolean;
        presentValueSavings: number;
        savingsPercent: number;
        recommendation: string;
    }>;
    calculateRefundingSavings: (oldDebtService: number, newDebtService: number, discountRate: number) => Promise<{
        presentValueSavings: number;
        nominalSavings: number;
    }>;
    determineEscrowRequirement: (bondId: string, callDate: Date) => Promise<{
        escrowRequired: number;
        callPremium: number;
        totalEscrow: number;
    }>;
    createBondRefunding: (refundingData: Partial<BondRefunding>) => Promise<any>;
    validateRefundingCompliance: (refundingId: string, refundingType: string) => Promise<{
        compliant: boolean;
        issues: string[];
        recommendations: string[];
    }>;
    trackInterestRateAdjustment: (bondId: string, newRate: number, effectiveDate: Date) => Promise<any>;
    calculateInterestRateSwapValue: (swapId: string, notionalAmount: number, valuationDate: Date) => Promise<{
        fairValue: number;
        notionalAmount: number;
        gainLoss: number;
    }>;
    monitorRateCapsFloors: (bondId: string, currentRate: number) => Promise<{
        withinLimits: boolean;
        currentRate: number;
        cap: number;
        floor: number;
    }>;
    projectInterestRateRisk: (bondId: string, rateScenarios: number[]) => Promise<any[]>;
    generateHedgingRecommendations: (bondId: string, riskProfile: any) => Promise<{
        recommended: boolean;
        strategies: string[];
        rationale: string;
    }>;
    monitorStatutoryDebtLimits: (monitoringDate: Date, assessedValuation: number) => Promise<DebtLimitMonitoring>;
    trackAuthorizedUnissuedDebt: (authorizationId: string, authorizedAmount: number, issuedAmount: number) => Promise<{
        remaining: number;
        percentIssued: number;
    }>;
    validateProposedDebtAgainstLimits: (proposedDebtAmount: number, currentLimits: DebtLimitMonitoring) => Promise<{
        permissible: boolean;
        exceedsLimit: boolean;
        availableCapacity: number;
    }>;
    calculateExemptDebt: () => Promise<{
        exemptDebt: number;
        selfSupportingDebt: number;
        totalExcluded: number;
    }>;
    generateDebtLimitComplianceReport: (fiscalYear: number) => Promise<any>;
    recordBondRating: (ratingData: Partial<BondRating>) => Promise<any>;
    trackRatingChanges: (bondId: string) => Promise<any[]>;
    monitorRatingReviewSchedule: (bondId: string) => Promise<any[]>;
    analyzeRatingImpactOnCost: (currentRating: string, proposedRating: string) => Promise<{
        basisPointDifference: number;
        annualCostImpact: number;
    }>;
    prepareRatingAgencyPresentation: (bondId: string, ratingAgency: string) => Promise<any>;
    establishDebtServiceReserve: (bondId: string, calculationBasis: string, percentOrAmount: number) => Promise<any>;
    monitorReserveFundBalance: (fundId: string, valuationDate: Date) => Promise<{
        compliant: boolean;
        requiredBalance: number;
        currentBalance: number;
        deficiency: number;
    }>;
    processReserveFundReplenishment: (fundId: string, replenishmentAmount: number) => Promise<any>;
    evaluateReserveFundingOptions: (requiredBalance: number, suretyPremium: number, investmentYield: number) => Promise<{
        recommendCash: boolean;
        netBenefit: number;
        analysis: string;
    }>;
    releaseReserveFund: (fundId: string, bondId: string) => Promise<any>;
    calculateArbitrageRebate: (bondId: string, calculationDate: Date, bondYield: number, investmentYield: number) => Promise<ArbitrageRebate>;
    processArbitrageRebatePayment: (rebateId: string, paymentAmount: number) => Promise<any>;
    monitorArbitrageSafeHarbors: (bondId: string, bondCharacteristics: any) => Promise<{
        exemptFromRebate: boolean;
        exemptionType: string;
        monitoringRequired: boolean;
    }>;
    validateInvestmentYieldCalculations: (bondId: string, investments: any[]) => Promise<{
        averageYield: number;
        excessEarnings: number;
        rebateLiability: number;
    }>;
    generateArbitrageComplianceReport: (bondId: string, fiscalYear: number) => Promise<any>;
};
export default _default;
//# sourceMappingURL=debt-bond-management-kit.d.ts.map