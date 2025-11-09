/**
 * Credit Collections Management Kit - Enterprise-Grade Financial Operations
 * Competes with: HighRadius, Billtrust, ARC Global Solutions
 * LOC: FIN-CRED-001
 *
 * 40 functions for comprehensive credit and collections management:
 * - Credit assessment, limits, and approval workflows
 * - Accounts receivable tracking and aging analysis
 * - Collection case management and activity tracking
 * - Payment promises and dispute resolution
 * - Write-off and recovery operations
 * - Advanced reporting and predictive automation
 *
 * @module financial/credit-collections-management-kit
 * @requires sequelize ^6.0
 * @requires nestjs ^10.0
 * @author HighRadius Competitor
 * @version 2.0.0
 */
import { Model, Sequelize } from 'sequelize';
/**
 * Credit assessment result with risk scoring
 */
export interface CreditAssessment {
    customerId: string;
    creditScore: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    recommendedLimit: number;
    approvalProbability: number;
    assessmentDate: Date;
    notes: string;
}
/**
 * AR aging bucket with metrics
 */
export interface ARAgingBucket {
    current: number;
    days30: number;
    days60: number;
    days90: number;
    days120Plus: number;
    totalOutstanding: number;
    percentageCurrent: number;
}
/**
 * Collection performance metrics
 */
export interface CollectionMetrics {
    totalCases: number;
    resolvedCases: number;
    resolutionRate: number;
    averageDaysToResolve: number;
    collectionAmount: number;
    costToCollect: number;
    roi: number;
}
/**
 * Payment promise tracking
 */
export interface PaymentPromise {
    caseId: string;
    promisedAmount: number;
    promisedDate: Date;
    status: 'PENDING' | 'FULFILLED' | 'BROKEN' | 'ESCALATED';
    actualPaymentDate?: Date;
    actualPaymentAmount?: number;
}
/**
 * Dispute details
 */
export interface DisputeRecord {
    invoiceId: string;
    disputeAmount: number;
    reason: string;
    status: 'OPEN' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'DENIED';
    investigationNotes?: string;
    adjustmentAmount?: number;
}
/**
 * Write-off analysis
 */
export interface WriteOffAnalysis {
    customerId: string;
    invoiceId: string;
    amount: number;
    daysOverdue: number;
    collectionProbability: number;
    recommendation: 'WRITE_OFF' | 'CONTINUE_COLLECTION' | 'PARTIAL_RECOVERY';
    reason: string;
}
/**
 * Recovery operation tracking
 */
export interface RecoveryOperation {
    caseId: string;
    recoveryMethod: 'NEGOTIATION' | 'LITIGATION' | 'AGENCY' | 'BANKRUPTCY';
    status: 'INITIATED' | 'IN_PROGRESS' | 'RECOVERED' | 'CLOSED';
    estimatedRecovery: number;
    actualRecovery?: number;
    effortCount?: number;
}
/**
 * DSO and collection trend
 */
export interface FinancialTrend {
    period: string;
    dso: number;
    collectionRate: number;
    recoveryRate: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
    forecastedDso?: number;
}
/**
 * Credit Profile Model
 */
export declare class CreditProfile extends Model {
    customerId: string;
    creditScore: number;
    riskLevel: string;
    approvedLimit: number;
    currentUtilization: number;
    lastAssessmentDate: Date;
    externalScore?: number;
    industryAverage?: number;
    static init(sequelize: Sequelize): any;
}
/**
 * Credit Terms Model
 */
export declare class CreditTerms extends Model {
    customerId: string;
    netDays: number;
    discountPercent: number;
    discountDays: number;
    creditLimit: number;
    status: string;
    static init(sequelize: Sequelize): any;
}
/**
 * AR Tracking Model
 */
export declare class ARTracking extends Model {
    invoiceId: string;
    customerId: string;
    invoiceAmount: number;
    daysOverdue: number;
    status: string;
    static init(sequelize: Sequelize): any;
}
/**
 * Collection Case Model
 */
export declare class CollectionCase extends Model {
    invoiceId: string;
    customerId: string;
    collectionAmount: number;
    assignedCollector?: string;
    status: string;
    static init(sequelize: Sequelize): any;
}
/**
 * Collection Activity Model
 */
export declare class CollectionActivity extends Model {
    caseId: string;
    activityType: string;
    notes: string;
    static init(sequelize: Sequelize): any;
}
/**
 * Payment Promise Model
 */
export declare class PaymentPromiseRecord extends Model {
    caseId: string;
    promisedAmount: number;
    promisedDate: Date;
    status: string;
    static init(sequelize: Sequelize): any;
}
/**
 * Dispute Record Model
 */
export declare class DisputeRecordModel extends Model {
    invoiceId: string;
    customerId: string;
    disputeAmount: number;
    status: string;
    static init(sequelize: Sequelize): any;
}
/**
 * Write-Off Model
 */
export declare class WriteOff extends Model {
    invoiceId: string;
    customerId: string;
    amount: number;
    status: string;
    static init(sequelize: Sequelize): any;
}
/**
 * Recovery Operation Model
 */
export declare class RecoveryCase extends Model {
    caseId: string;
    recoveryMethod: string;
    estimatedRecovery: number;
    status: string;
    static init(sequelize: Sequelize): any;
}
/**
 * 1. ASSESS CREDIT PROFILE
 * Analyze customer creditworthiness and generate risk assessment
 */
export declare function assessCreditProfile(sequelize: Sequelize, customerId: string, creditScore: number, paymentHistory: number, debtToEquityRatio: number): Promise<CreditAssessment>;
/**
 * 2. SET CREDIT TERMS
 * Establish payment terms and credit limits for customer
 */
export declare function setCreditTerms(customerId: string, netDays: number, discountPercent: number, discountDays: number, creditLimit: number): Promise<CreditTerms>;
/**
 * 3. APPROVE CREDIT
 * Approve credit request with automated decision
 */
export declare function approveCreditRequest(customerId: string, requestedLimit: number, approverName: string): Promise<{
    approved: boolean;
    approvedLimit: number;
    reason: string;
}>;
/**
 * 4. MONITOR CREDIT EXPOSURE
 * Track customer credit utilization and exposure
 */
export declare function monitorCreditExposure(customerId: string): Promise<{
    customerId: string;
    utilization: number;
    available: number;
    status: string;
}>;
/**
 * 5. SET CREDIT LIMIT
 * Establish initial credit limit for new customer
 */
export declare function setCreditLimit(customerId: string, limit: number): Promise<CreditProfile>;
/**
 * 6. CHECK CREDIT UTILIZATION
 * Calculate current credit utilization percentage
 */
export declare function checkCreditUtilization(customerId: string): Promise<number>;
/**
 * 7. ADJUST CREDIT LIMIT
 * Increase or decrease customer credit limit
 */
export declare function adjustCreditLimit(customerId: string, newLimit: number, reason: string): Promise<CreditProfile>;
/**
 * 8. SUSPEND CREDIT
 * Suspend credit line due to payment issues
 */
export declare function suspendCredit(customerId: string, reason: string): Promise<CreditTerms>;
/**
 * 9. TRACK RECEIVABLES
 * Create and update AR record for invoice
 */
export declare function trackReceivables(invoiceId: string, customerId: string, invoiceAmount: number, invoiceDate: Date, dueDate: Date): Promise<ARTracking>;
/**
 * 10. AGE INVOICES
 * Calculate invoice aging for AR report
 */
export declare function ageInvoices(customerId: string): Promise<ARAgingBucket>;
/**
 * 11. CALCULATE DSO
 * Calculate Days Sales Outstanding metric
 */
export declare function calculateDSO(customerId: string): Promise<number>;
/**
 * 12. FORECAST COLLECTIONS
 * Predict collection amounts based on historical data
 */
export declare function forecastCollections(customerId: string, daysAhead?: number): Promise<number>;
/**
 * 13. CREATE COLLECTION CASE
 * Initiate collection case for overdue invoice
 */
export declare function createCollectionCase(invoiceId: string, customerId: string, collectionAmount: number): Promise<CollectionCase>;
/**
 * 14. ASSIGN COLLECTOR
 * Assign collection case to specific collector/team
 */
export declare function assignCollector(caseId: string, collectorName: string): Promise<CollectionCase>;
/**
 * 15. TRACK COLLECTION ACTIVITY
 * Log collection activity (calls, emails, payments)
 */
export declare function trackCollectionActivity(caseId: string, activityType: string, notes: string, nextActionDate?: Date): Promise<CollectionActivity>;
/**
 * 16. RESOLVE COLLECTION CASE
 * Close collection case with outcome
 */
export declare function resolveCollectionCase(caseId: string, recoveredAmount: number, resolution: string): Promise<CollectionCase>;
/**
 * 17. RECORD PAYMENT PROMISE
 * Document customer promise to pay
 */
export declare function recordPaymentPromise(caseId: string, promisedAmount: number, promisedDate: Date, collectorName?: string): Promise<PaymentPromiseRecord>;
/**
 * 18. TRACK PROMISE FULFILLMENT
 * Monitor and verify promise payment
 */
export declare function trackPromiseFulfillment(promiseId: string, actualPaymentAmount?: number, actualPaymentDate?: Date): Promise<PaymentPromiseRecord>;
/**
 * 19. FOLLOW UP PROMISE
 * Schedule and execute promise follow-up
 */
export declare function followUpPromise(promiseId: string, followUpDate: Date): Promise<PaymentPromiseRecord>;
/**
 * 20. ESCALATE BROKEN PROMISE
 * Escalate case when promise is broken
 */
export declare function escalateBrokenPromise(promiseId: string, escalationReason: string): Promise<PaymentPromiseRecord>;
/**
 * 21. CREATE DISPUTE
 * Record customer dispute on invoice
 */
export declare function createDispute(invoiceId: string, customerId: string, disputeAmount: number, reason: string): Promise<DisputeRecordModel>;
/**
 * 22. INVESTIGATE DISPUTE
 * Record investigation notes and findings
 */
export declare function investigateDispute(disputeId: string, investigationNotes: string, findingStatus: 'VALID' | 'INVALID'): Promise<DisputeRecordModel>;
/**
 * 23. RESOLVE DISPUTE
 * Close dispute with adjustment or denial
 */
export declare function resolveDispute(disputeId: string, adjustmentAmount?: number, approved?: boolean): Promise<DisputeRecordModel>;
/**
 * 24. ADJUST DISPUTE AMOUNT
 * Modify disputed amount based on investigation
 */
export declare function adjustDisputeAmount(disputeId: string, newAmount: number): Promise<DisputeRecordModel>;
/**
 * 25. IDENTIFY BAD DEBT
 */
export declare function identifyBadDebt(daysOverdueThreshold?: number): Promise<WriteOffAnalysis[]>;
/**
 * 26. APPROVE WRITE-OFF
 * Approve bad debt write-off
 */
export declare function approveWriteOff(invoiceId: string, approverName: string): Promise<WriteOff>;
/**
 * 27. PROCESS WRITE-OFF
 * Execute write-off in accounting system
 */
export declare function processWriteOff(writeOffId: string): Promise<WriteOff>;
/**
 * 28. REPORT WRITE-OFFS
 * Generate write-off summary report
 */
export declare function reportWriteOffs(startDate: Date, endDate: Date): Promise<{
    totalAmount: number;
    count: number;
    byReason: Record<string, number>;
}>;
/**
 * 29. INITIATE RECOVERY
 * Start recovery process for written-off debt
 */
export declare function initiateRecovery(caseId: string, recoveryMethod: string, estimatedRecovery: number): Promise<RecoveryCase>;
/**
 * 30. TRACK RECOVERY EFFORTS
 * Log recovery attempt details
 */
export declare function trackRecoveryEfforts(caseId: string, effortNotes: string): Promise<RecoveryCase>;
/**
 * 31. RECEIVE RECOVERY PAYMENT
 * Record recovery payment received
 */
export declare function receiveRecoveryPayment(caseId: string, paymentAmount: number): Promise<RecoveryCase>;
/**
 * 32. CLOSE RECOVERY CASE
 * Finalize recovery operation
 */
export declare function closeRecoveryCase(caseId: string): Promise<RecoveryCase>;
/**
 * 33. AGING REPORT
 * Generate AR aging analysis
 */
export declare function generateAgingReport(): Promise<Record<string, ARAgingBucket>>;
/**
 * 34. COLLECTION PERFORMANCE REPORT
 * Analyze collection metrics and KPIs
 */
export declare function generateCollectionReport(): Promise<CollectionMetrics>;
/**
 * 35. DSO TREND ANALYSIS
 * Track DSO changes over time
 */
export declare function analyzeDSOTrends(customerId: string, periods?: number): Promise<FinancialTrend[]>;
/**
 * 36. RECOVERY RATE ANALYSIS
 * Measure recovery success metrics
 */
export declare function analyzeRecoveryRate(): Promise<{
    totalEstimated: number;
    totalRecovered: number;
    recoveryRate: number;
}>;
/**
 * 37. AUTO-ESCALATE OVERDUE
 * Automatically escalate cases beyond threshold
 */
export declare function autoEscalateOverdue(daysThreshold?: number): Promise<number>;
/**
 * 38. SMART COLLECTOR ROUTING
 * Intelligently route cases to collectors based on workload/specialization
 */
export declare function smartCollectorRouting(caseId: string): Promise<{
    assignedCollector: string;
    reason: string;
}>;
/**
 * 39. PREDICTIVE RISK SCORING
 * ML-based risk prediction for collections
 */
export declare function predictiveRiskScore(customerId: string): Promise<number>;
/**
 * 40. OPTIMIZE COLLECTION STRATEGY
 * Recommend strategy based on case characteristics
 */
export declare function optimizeCollectionStrategy(caseId: string): Promise<{
    strategy: string;
    recommendedMethod: string;
    priority: string;
}>;
declare const _default: {
    assessCreditProfile: typeof assessCreditProfile;
    setCreditTerms: typeof setCreditTerms;
    approveCreditRequest: typeof approveCreditRequest;
    monitorCreditExposure: typeof monitorCreditExposure;
    setCreditLimit: typeof setCreditLimit;
    checkCreditUtilization: typeof checkCreditUtilization;
    adjustCreditLimit: typeof adjustCreditLimit;
    suspendCredit: typeof suspendCredit;
    trackReceivables: typeof trackReceivables;
    ageInvoices: typeof ageInvoices;
    calculateDSO: typeof calculateDSO;
    forecastCollections: typeof forecastCollections;
    createCollectionCase: typeof createCollectionCase;
    assignCollector: typeof assignCollector;
    trackCollectionActivity: typeof trackCollectionActivity;
    resolveCollectionCase: typeof resolveCollectionCase;
    recordPaymentPromise: typeof recordPaymentPromise;
    trackPromiseFulfillment: typeof trackPromiseFulfillment;
    followUpPromise: typeof followUpPromise;
    escalateBrokenPromise: typeof escalateBrokenPromise;
    createDispute: typeof createDispute;
    investigateDispute: typeof investigateDispute;
    resolveDispute: typeof resolveDispute;
    adjustDisputeAmount: typeof adjustDisputeAmount;
    identifyBadDebt: typeof identifyBadDebt;
    approveWriteOff: typeof approveWriteOff;
    processWriteOff: typeof processWriteOff;
    reportWriteOffs: typeof reportWriteOffs;
    initiateRecovery: typeof initiateRecovery;
    trackRecoveryEfforts: typeof trackRecoveryEfforts;
    receiveRecoveryPayment: typeof receiveRecoveryPayment;
    closeRecoveryCase: typeof closeRecoveryCase;
    generateAgingReport: typeof generateAgingReport;
    generateCollectionReport: typeof generateCollectionReport;
    analyzeDSOTrends: typeof analyzeDSOTrends;
    analyzeRecoveryRate: typeof analyzeRecoveryRate;
    autoEscalateOverdue: typeof autoEscalateOverdue;
    smartCollectorRouting: typeof smartCollectorRouting;
    predictiveRiskScore: typeof predictiveRiskScore;
    optimizeCollectionStrategy: typeof optimizeCollectionStrategy;
};
export default _default;
//# sourceMappingURL=credit-collections-management-kit.d.ts.map