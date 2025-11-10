/**
 * LOC: REVRECCOMP001
 * File: /reuse/edwards/financial/composites/revenue-recognition-compliance-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../revenue-recognition-billing-kit
 *   - ../audit-trail-compliance-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../financial-close-automation-kit
 *   - ../dimension-management-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend revenue compliance modules
 *   - ASC 606 compliance REST APIs
 *   - Revenue audit services
 *   - Financial reporting systems
 *   - Contract management portals
 */
import { Transaction } from 'sequelize';
import { type RevenueContract, type PerformanceObligation, type RevenueSchedule, type ContractModification, type ContractAsset, type ContractLiability } from '../revenue-recognition-billing-kit';
import { type AuditEntry, type ComplianceCheckpoint } from '../audit-trail-compliance-kit';
import { type FinancialReport, type RevenueMetrics } from '../financial-reporting-analytics-kit';
import { type ClosePeriod } from '../financial-close-automation-kit';
/**
 * ASC 606 five-step model implementation
 */
export interface ASC606FiveStepModel {
    step1_ContractIdentification: {
        contractId: number;
        identified: boolean;
        criteria: string[];
        approved: boolean;
    };
    step2_PerformanceObligations: {
        obligations: PerformanceObligation[];
        distinct: boolean[];
        identified: boolean;
    };
    step3_TransactionPrice: {
        totalPrice: number;
        variableConsideration: number;
        constrainedAmount: number;
        finalPrice: number;
    };
    step4_PriceAllocation: {
        allocations: any[];
        method: string;
        validated: boolean;
    };
    step5_RevenueRecognition: {
        schedules: RevenueSchedule[];
        recognizedAmount: number;
        deferredAmount: number;
        timing: 'over-time' | 'point-in-time';
    };
    complianceStatus: 'compliant' | 'non-compliant' | 'under-review';
    auditTrail: AuditEntry[];
}
/**
 * Contract lifecycle status
 */
export interface ContractLifecycleStatus {
    contract: RevenueContract;
    currentStage: 'draft' | 'active' | 'modified' | 'completed' | 'terminated';
    performanceStatus: {
        totalObligations: number;
        completedObligations: number;
        inProgressObligations: number;
        percentComplete: number;
    };
    financialStatus: {
        totalContractValue: number;
        billedAmount: number;
        unbilledAmount: number;
        recognizedRevenue: number;
        deferredRevenue: number;
        contractAssets: number;
        contractLiabilities: number;
    };
    complianceStatus: {
        asc606Compliant: boolean;
        auditReady: boolean;
        lastAuditDate?: Date;
    };
}
/**
 * Revenue compliance dashboard
 */
export interface RevenueComplianceDashboard {
    summary: {
        totalContracts: number;
        activeContracts: number;
        totalRevenue: number;
        recognizedRevenue: number;
        deferredRevenue: number;
        unbilledRevenue: number;
    };
    complianceMetrics: {
        compliantContracts: number;
        complianceRate: number;
        pendingReviews: number;
        auditFindings: number;
    };
    performanceObligations: {
        total: number;
        completed: number;
        inProgress: number;
        notStarted: number;
    };
    topRisks: any[];
    upcomingMilestones: any[];
}
/**
 * Revenue forecast model
 */
export interface RevenueForecastModel {
    forecastPeriod: {
        start: Date;
        end: Date;
    };
    baselineRevenue: number;
    forecastedRevenue: number;
    confidenceLevel: number;
    methodology: string;
    assumptions: string[];
    risks: any[];
    scenarios: {
        optimistic: number;
        realistic: number;
        pessimistic: number;
    };
}
/**
 * Execute complete ASC 606 five-step model
 * Composes: createRevenueContract, createPerformanceObligation, allocateTransactionPrice, createRevenueSchedule, createAuditEntry
 */
export declare class RevenueRecognitionComplianceService {
    private readonly logger;
    executeASC606FiveStepModel(contractData: any, obligationsData: any[], transaction?: Transaction): Promise<ASC606FiveStepModel>;
}
/**
 * Validate ASC 606 compliance for contract
 * Composes: validateCompliance, createComplianceCheckpoint, generateComplianceReport
 */
export declare const validateASC606Compliance: (contractId: number, transaction?: Transaction) => Promise<{
    compliant: boolean;
    checkpoint: ComplianceCheckpoint;
    issues: any[];
    report: any;
}>;
/**
 * Process contract modification with ASC 606 compliance
 * Composes: processContractModification, modifyRevenueContract, reallocateTransactionPrice, createAuditEntry
 */
export declare const processContractModificationCompliant: (contractId: number, modificationData: any, transaction?: Transaction) => Promise<{
    modification: ContractModification;
    reallocated: boolean;
    compliant: boolean;
}>;
/**
 * Create and track performance obligation
 * Composes: createPerformanceObligation, createDimension, assignDimension, createAuditEntry
 */
export declare const createPerformanceObligationWithTracking: (contractId: number, obligationData: any, dimensions: any[], transaction?: Transaction) => Promise<{
    obligation: PerformanceObligation;
    dimensionsAssigned: number;
    tracked: boolean;
}>;
/**
 * Update performance obligation progress
 * Composes: updatePerformanceObligation, calculateCompletionPercentage, recognizeRevenueOverTime, trackDataChange
 */
export declare const updatePerformanceObligationProgress: (obligationId: number, progressData: any, transaction?: Transaction) => Promise<{
    updated: boolean;
    completionPercent: number;
    revenueRecognized: number;
}>;
/**
 * Complete performance obligation with revenue recognition
 * Composes: completePerformanceObligation, recognizeRevenueAtPoint, updateContractAsset, createAuditEntry
 */
export declare const completePerformanceObligationWithRecognition: (obligationId: number, completionData: any, transaction?: Transaction) => Promise<{
    completed: boolean;
    revenueRecognized: number;
    assetCleared: boolean;
}>;
/**
 * Calculate and allocate transaction price
 * Composes: calculateStandaloneSellingPrice, allocateTransactionPrice, createAuditEntry
 */
export declare const calculateAndAllocateTransactionPrice: (contractId: number, totalPrice: number, obligationIds: number[], transaction?: Transaction) => Promise<{
    allocations: any[];
    validated: boolean;
    auditCreated: boolean;
}>;
/**
 * Reallocate transaction price on modification
 * Composes: reallocateTransactionPrice, updatePerformanceObligation, createAuditEntry, trackDataChange
 */
export declare const reallocateTransactionPriceOnModification: (contractId: number, newTotalPrice: number, affectedObligations: number[], transaction?: Transaction) => Promise<{
    reallocated: boolean;
    obligationsUpdated: number;
    changeTracked: boolean;
}>;
/**
 * Create comprehensive revenue schedule
 * Composes: createRevenueSchedule, createDimension, assignDimension, createAuditEntry
 */
export declare const createComprehensiveRevenueSchedule: (contractId: number, obligationId: number, scheduleData: any, transaction?: Transaction) => Promise<{
    schedule: RevenueSchedule;
    dimensioned: boolean;
    audited: boolean;
}>;
/**
 * Recognize scheduled revenue with compliance
 * Composes: recognizeRevenue, updateContractLiability, createAuditEntry, logComplianceEvent
 */
export declare const recognizeScheduledRevenueCompliant: (scheduleId: number, amount: number, transaction?: Transaction) => Promise<{
    recognized: number;
    liabilityUpdated: boolean;
    compliant: boolean;
}>;
/**
 * Defer revenue with tracking
 * Composes: deferRevenue, createContractLiability, createAuditEntry, trackDataChange
 */
export declare const deferRevenueWithTracking: (scheduleId: number, amount: number, deferralReason: string, transaction?: Transaction) => Promise<{
    deferred: number;
    liabilityCreated: boolean;
    tracked: boolean;
}>;
/**
 * Reverse revenue with audit trail
 * Composes: reverseRevenue, updateContractAsset, createAuditEntry, logComplianceEvent
 */
export declare const reverseRevenueWithAuditTrail: (scheduleId: number, amount: number, reversalReason: string, transaction?: Transaction) => Promise<{
    reversed: number;
    assetCreated: boolean;
    auditComplete: boolean;
}>;
/**
 * Manage contract assets with tracking
 * Composes: createContractAsset, updateContractAsset, analyzeDimensionData, createAuditEntry
 */
export declare const manageContractAssetsWithTracking: (contractId: number, assetData: any, transaction?: Transaction) => Promise<{
    asset: ContractAsset;
    tracked: boolean;
    analyzed: boolean;
}>;
/**
 * Manage contract liabilities with compliance
 * Composes: createContractLiability, updateContractLiability, logComplianceEvent, createAuditEntry
 */
export declare const manageContractLiabilitiesCompliant: (contractId: number, liabilityData: any, transaction?: Transaction) => Promise<{
    liability: ContractLiability;
    compliant: boolean;
    audited: boolean;
}>;
/**
 * Process milestone billing with revenue recognition
 * Composes: createMilestoneBilling, processMilestoneCompletion, recognizeRevenueAtPoint, createAuditEntry
 */
export declare const processMilestoneBillingCompliant: (contractId: number, milestoneId: number, completionData: any, transaction?: Transaction) => Promise<{
    billing: any;
    milestone: any;
    revenueRecognized: number;
    compliant: boolean;
}>;
/**
 * Create subscription schedule with recurring revenue
 * Composes: createSubscriptionSchedule, createRevenueSchedule, createDimension, createAuditEntry
 */
export declare const createSubscriptionScheduleCompliant: (contractId: number, subscriptionData: any, transaction?: Transaction) => Promise<{
    schedule: any;
    revenueSchedules: RevenueSchedule[];
    periods: number;
}>;
/**
 * Process subscription renewal with revenue continuation
 * Composes: processSubscriptionRenewal, createRevenueSchedule, updateContractLiability, createAuditEntry
 */
export declare const processSubscriptionRenewalCompliant: (subscriptionId: number, renewalData: any, transaction?: Transaction) => Promise<{
    renewed: boolean;
    newSchedules: number;
    liabilityUpdated: boolean;
}>;
/**
 * Forecast revenue with multi-scenario analysis
 * Composes: forecastRevenue, calculateRevenueMetrics, generateVarianceAnalysis, createRevenueAnalysis
 */
export declare const forecastRevenueWithScenarios: (forecastPeriod: {
    start: Date;
    end: Date;
}, methodology: "historical" | "pipeline" | "contract_based", transaction?: Transaction) => Promise<RevenueForecastModel>;
/**
 * Analyze revenue variance with root cause
 * Composes: analyzeRevenueVariance, generateVarianceAnalysis, createRevenueAnalysis, createAuditEntry
 */
export declare const analyzeRevenueVarianceWithRootCause: (actualPeriod: {
    start: Date;
    end: Date;
}, transaction?: Transaction) => Promise<{
    variance: any;
    analysis: any;
    rootCauses: any[];
    actionItems: any[];
}>;
/**
 * Calculate comprehensive revenue metrics
 * Composes: calculateRevenueMetrics, calculateUnbilledRevenue, calculateDeferredRevenue, createDashboard
 */
export declare const calculateComprehensiveRevenueMetrics: (periodStart: Date, periodEnd: Date, transaction?: Transaction) => Promise<RevenueMetrics>;
/**
 * Execute revenue close process
 * Composes: createClosePeriod, reconcileRevenueAccounts, validateCloseChecklist, finalizeClosePeriod
 */
export declare const executeRevenueCloseProcess: (fiscalPeriod: {
    year: number;
    period: number;
}, transaction?: Transaction) => Promise<{
    closePeriod: ClosePeriod;
    reconciled: boolean;
    validated: boolean;
    finalized: boolean;
}>;
/**
 * Generate comprehensive revenue compliance report
 * Composes: generateRevenueReport, generateComplianceReport, generateFinancialReport, distributeReport
 */
export declare const generateComprehensiveRevenueComplianceReport: (reportPeriod: {
    start: Date;
    end: Date;
}, transaction?: Transaction) => Promise<{
    revenueReport: any;
    complianceReport: any;
    financialReport: FinancialReport;
    distributed: boolean;
}>;
/**
 * Archive revenue compliance data
 * Composes: archiveAuditData, validateAuditTrail, createComplianceCheckpoint
 */
export declare const archiveRevenueComplianceData: (archiveDate: Date, retentionYears: number, transaction?: Transaction) => Promise<{
    archived: boolean;
    validated: boolean;
    checkpoint: ComplianceCheckpoint;
}>;
/**
 * Get complete contract lifecycle status
 * Composes: Multiple revenue and audit functions for comprehensive contract view
 */
export declare const getContractLifecycleStatus: (contractId: number, transaction?: Transaction) => Promise<ContractLifecycleStatus>;
/**
 * Generate revenue compliance dashboard
 * Composes: Multiple reporting and analytics functions
 */
export declare const generateRevenueComplianceDashboard: (asOfDate: Date, transaction?: Transaction) => Promise<RevenueComplianceDashboard>;
export { RevenueRecognitionComplianceService, validateASC606Compliance, processContractModificationCompliant, createPerformanceObligationWithTracking, updatePerformanceObligationProgress, completePerformanceObligationWithRecognition, calculateAndAllocateTransactionPrice, reallocateTransactionPriceOnModification, createComprehensiveRevenueSchedule, recognizeScheduledRevenueCompliant, deferRevenueWithTracking, reverseRevenueWithAuditTrail, manageContractAssetsWithTracking, manageContractLiabilitiesCompliant, processMilestoneBillingCompliant, createSubscriptionScheduleCompliant, processSubscriptionRenewalCompliant, forecastRevenueWithScenarios, analyzeRevenueVarianceWithRootCause, calculateComprehensiveRevenueMetrics, executeRevenueCloseProcess, generateComprehensiveRevenueComplianceReport, archiveRevenueComplianceData, getContractLifecycleStatus, generateRevenueComplianceDashboard, };
//# sourceMappingURL=revenue-recognition-compliance-composite.d.ts.map