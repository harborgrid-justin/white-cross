/**
 * LOC: CUSTREVOP001
 * File: /reuse/edwards/financial/composites/customer-revenue-operations-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../accounts-receivable-management-kit
 *   - ../revenue-recognition-billing-kit
 *   - ../payment-processing-collections-kit
 *   - ../credit-management-risk-kit
 *   - ../financial-workflow-approval-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend revenue modules
 *   - Customer billing REST API controllers
 *   - Collections management services
 *   - Customer portal applications
 *   - Revenue analytics dashboards
 */
import { Transaction } from 'sequelize';
import { type Customer, type ARInvoice, type CashReceipt, type PaymentPlan, type CustomerDispute } from '../accounts-receivable-management-kit';
import { type RevenueContract, type PerformanceObligation, type RevenueSchedule } from '../revenue-recognition-billing-kit';
import { type CreditAssessment, type CreditPolicy } from '../credit-management-risk-kit';
import { type WorkflowInstance } from '../financial-workflow-approval-kit';
/**
 * Complete customer onboarding request
 */
export interface CustomerOnboardingRequest {
    customerNumber: string;
    customerName: string;
    customerType: 'commercial' | 'government' | 'individual' | 'nonprofit';
    taxId: string;
    paymentTerms: string;
    requestedCreditLimit: number;
    billingContact: {
        name: string;
        email: string;
        phone: string;
        address: any;
    };
    businessReferences?: string[];
    financialStatements?: any;
}
/**
 * Customer onboarding result
 */
export interface CustomerOnboardingResult {
    customer: Customer;
    creditAssessment: CreditAssessment;
    approvedCreditLimit: number;
    requiresApproval: boolean;
    workflowInstance?: WorkflowInstance;
    riskRating: string;
}
/**
 * Comprehensive AR aging analysis
 */
export interface ARAgingAnalysis {
    asOfDate: Date;
    totalOutstanding: number;
    current: {
        amount: number;
        count: number;
        percent: number;
    };
    days30: {
        amount: number;
        count: number;
        percent: number;
    };
    days60: {
        amount: number;
        count: number;
        percent: number;
    };
    days90: {
        amount: number;
        count: number;
        percent: number;
    };
    days120Plus: {
        amount: number;
        count: number;
        percent: number;
    };
    averageDaysOutstanding: number;
    dso: number;
    topDelinquentCustomers: any[];
    collectionPriority: any[];
}
/**
 * Collections automation configuration
 */
export interface CollectionsAutomationConfig {
    enableAutoDunning: boolean;
    dunningLevels: number;
    daysBetweenDunning: number;
    escalationThreshold: number;
    autoHoldShipments: boolean;
    autoHoldThreshold: number;
    assignCollector: boolean;
    priorityRules: string[];
}
/**
 * Customer portal data
 */
export interface CustomerPortalData {
    customer: Customer;
    openInvoices: ARInvoice[];
    paymentHistory: CashReceipt[];
    currentBalance: number;
    creditAvailable: number;
    recentStatements: any[];
    paymentPlans: PaymentPlan[];
    openDisputes: CustomerDispute[];
}
/**
 * Revenue recognition workflow result
 */
export interface RevenueRecognitionWorkflowResult {
    contract: RevenueContract;
    obligations: PerformanceObligation[];
    schedules: RevenueSchedule[];
    recognizedAmount: number;
    deferredAmount: number;
    unbilledAmount: number;
    contractAssets: number;
    contractLiabilities: number;
}
/**
 * Complete customer onboarding with credit assessment
 * Composes: createCustomer, assessCreditRisk, calculateCreditScore, determineCreditLimit, createWorkflowInstance
 */
export declare class CustomerRevenueOperationsService {
    private readonly logger;
    onboardNewCustomer(request: CustomerOnboardingRequest, transaction?: Transaction): Promise<CustomerOnboardingResult>;
}
/**
 * Update customer with credit reevaluation
 * Composes: updateCustomer, evaluatePaymentBehavior, updateCreditRating, monitorCreditLimit
 */
export declare const updateCustomerWithCreditReview: (customerId: number, updateData: Partial<Customer>, transaction?: Transaction) => Promise<{
    customer: Customer;
    creditReview: any;
    ratingUpdated: boolean;
}>;
/**
 * Place customer on hold with collections workflow
 * Composes: placeCustomerOnHold, createWorkflowInstance, processDunning
 */
export declare const placeCustomerOnHoldWithCollections: (customerId: number, holdReason: string, transaction?: Transaction) => Promise<{
    customer: Customer;
    workflow: WorkflowInstance;
    dunningLevel: number;
}>;
/**
 * Release customer hold with payment verification
 * Composes: releaseCustomerHold, evaluatePaymentBehavior, updateDunningLevel
 */
export declare const releaseCustomerHoldWithVerification: (customerId: number, paymentReceived: boolean, transaction?: Transaction) => Promise<{
    customer: Customer;
    holdReleased: boolean;
    dunningReset: boolean;
}>;
/**
 * Create and post invoice with revenue recognition
 * Composes: createARInvoice, postARInvoice, recognizeRevenue, createRevenueSchedule
 */
export declare const createAndPostInvoiceWithRevenue: (invoiceData: any, contractId?: number, transaction?: Transaction) => Promise<{
    invoice: ARInvoice;
    revenueSchedule?: RevenueSchedule;
    posted: boolean;
}>;
/**
 * Process billing with milestone recognition
 * Composes: createMilestoneBilling, processMilestoneCompletion, createARInvoice, recognizeRevenueAtPoint
 */
export declare const processMilestoneBillingWithRevenue: (contractId: number, milestoneId: number, completionData: any, transaction?: Transaction) => Promise<{
    invoice: ARInvoice;
    milestone: any;
    revenueRecognized: number;
}>;
/**
 * Create credit memo with revenue reversal
 * Composes: createCreditMemo, applyCreditMemo, deferRevenue
 */
export declare const createCreditMemoWithRevenueReversal: (customerId: number, invoiceId: number, creditAmount: number, reason: string, transaction?: Transaction) => Promise<{
    creditMemo: any;
    applied: boolean;
    revenueReversed: number;
}>;
/**
 * Generate customer statement with aging
 * Composes: generateCustomerStatement, generateARAgingReport, calculateDaysSalesOutstanding
 */
export declare const generateCustomerStatementWithAging: (customerId: number, statementDate: Date, periodDays?: number) => Promise<{
    statement: any;
    aging: any;
    dso: number;
}>;
/**
 * Apply payment with automatic allocation
 * Composes: applyPaymentToInvoice, applyPaymentToMultipleInvoices, applyCashReceipts
 */
export declare const applyPaymentWithAutoAllocation: (customerId: number, paymentAmount: number, paymentMethod: string, transaction?: Transaction) => Promise<{
    applied: number;
    invoicesPaid: number;
    remaining: number;
}>;
/**
 * Process lockbox with auto-matching
 * Composes: processLockboxFile, applyCashReceipts, reconcilePayments
 */
export declare const processLockboxWithAutoMatching: (lockboxFile: any, transaction?: Transaction) => Promise<{
    processed: number;
    matched: number;
    unmatched: number;
    total: number;
}>;
/**
 * Process refund with credit verification
 * Composes: processRefund, createCreditMemo, updateCustomer
 */
export declare const processRefundWithCreditVerification: (customerId: number, refundAmount: number, reason: string, transaction?: Transaction) => Promise<{
    refund: any;
    creditMemo: any;
    processed: boolean;
}>;
/**
 * Process chargeback with dispute creation
 * Composes: processChargeback, createDispute, createWorkflowInstance
 */
export declare const processChargebackWithDispute: (customerId: number, invoiceId: number, chargebackAmount: number, reason: string, transaction?: Transaction) => Promise<{
    chargeback: any;
    dispute: CustomerDispute;
    workflow: WorkflowInstance;
}>;
/**
 * Execute automated collections process
 * Composes: prioritizeCollectionAccounts, createCollectionStrategy, executeCollectionCampaign, processDunning
 */
export declare const executeAutomatedCollections: (asOfDate: Date, config: CollectionsAutomationConfig, transaction?: Transaction) => Promise<{
    accountsPrioritized: number;
    campaignsExecuted: number;
    dunningProcessed: number;
}>;
/**
 * Generate and send dunning letters
 * Composes: generateDunningLetter, updateDunningLevel, processDunning
 */
export declare const generateAndSendDunningLetters: (customerId: number, currentLevel: number, transaction?: Transaction) => Promise<{
    letter: any;
    levelUpdated: number;
    sent: boolean;
}>;
/**
 * Calculate collection efficiency metrics
 * Composes: calculateCollectionEfficiency, generateARAgingReport, calculateDaysSalesOutstanding
 */
export declare const calculateCollectionEfficiencyMetrics: (periodStart: Date, periodEnd: Date) => Promise<{
    efficiency: any;
    aging: any;
    dso: number;
    collectionRate: number;
    averageCollectionPeriod: number;
}>;
/**
 * Monitor customer credit with automated actions
 * Composes: monitorCreditLimit, getCustomerCreditProfile, flagHighRiskCustomer, placeCustomerOnHold
 */
export declare const monitorCustomerCreditWithActions: (customerId: number, transaction?: Transaction) => Promise<{
    withinLimit: boolean;
    utilizationPercent: number;
    action?: string;
    flagged: boolean;
}>;
/**
 * Reevaluate customer credit limit
 * Composes: evaluatePaymentBehavior, calculateCreditScore, determineCreditLimit, updateCustomer
 */
export declare const reevaluateCustomerCreditLimit: (customerId: number, transaction?: Transaction) => Promise<{
    previousLimit: number;
    newLimit: number;
    increased: boolean;
    justification: string;
}>;
/**
 * Apply credit policy to customer
 * Composes: createCreditPolicy, applyCreditPolicy, updateCustomer, createWorkflowInstance
 */
export declare const applyCreditPolicyToCustomer: (customerId: number, policyType: "standard" | "preferred" | "restricted", transaction?: Transaction) => Promise<{
    policy: CreditPolicy;
    applied: boolean;
    workflow?: WorkflowInstance;
}>;
/**
 * Create payment plan with approval workflow
 * Composes: createPaymentPlan, createWorkflowInstance, updateCustomer
 */
export declare const createPaymentPlanWithApproval: (customerId: number, totalAmount: number, numberOfInstallments: number, startDate: Date, transaction?: Transaction) => Promise<{
    paymentPlan: PaymentPlan;
    workflow: WorkflowInstance;
    requiresApproval: boolean;
}>;
/**
 * Process payment plan installment with auto-application
 * Composes: processPaymentPlanInstallment, applyPaymentToInvoice, updateDunningLevel
 */
export declare const processPaymentPlanInstallmentWithApplication: (paymentPlanId: number, installmentNumber: number, paymentAmount: number, transaction?: Transaction) => Promise<{
    processed: boolean;
    applied: boolean;
    remainingBalance: number;
}>;
/**
 * Cancel payment plan with balance reinstatement
 * Composes: cancelPaymentPlan, voidARInvoice, createWorkflowInstance
 */
export declare const cancelPaymentPlanWithReinstatement: (paymentPlanId: number, cancellationReason: string, transaction?: Transaction) => Promise<{
    cancelled: boolean;
    balanceReinstated: number;
    workflow: WorkflowInstance;
}>;
/**
 * Create and route dispute for resolution
 * Composes: createDispute, createWorkflowInstance, placeCustomerOnHold
 */
export declare const createAndRouteDispute: (disputeData: any, transaction?: Transaction) => Promise<{
    dispute: CustomerDispute;
    workflow: WorkflowInstance;
    onHold: boolean;
}>;
/**
 * Resolve dispute with financial adjustments
 * Composes: resolveDispute, createCreditMemo, releaseCustomerHold, approveWorkflowStep
 */
export declare const resolveDisputeWithAdjustments: (disputeId: number, resolution: "customer_favor" | "company_favor" | "partial", adjustmentAmount: number, workflowInstanceId: number, transaction?: Transaction) => Promise<{
    resolved: boolean;
    creditMemo?: any;
    holdReleased: boolean;
}>;
/**
 * Generate customer portal data
 * Composes: getCustomerByNumber, generateCustomerStatement, getCustomerCreditProfile
 */
export declare const generateCustomerPortalData: (customerNumber: string) => Promise<CustomerPortalData>;
/**
 * Process customer self-service payment
 * Composes: applyPaymentToInvoice, processPayment, generateCustomerStatement
 */
export declare const processCustomerSelfServicePayment: (customerId: number, invoiceId: number, paymentAmount: number, paymentMethod: string, transaction?: Transaction) => Promise<{
    payment: any;
    invoice: ARInvoice;
    newBalance: number;
}>;
/**
 * Write off bad debt with approval workflow
 * Composes: writeOffBadDebt, createWorkflowInstance, voidARInvoice
 */
export declare const writeOffBadDebtWithApproval: (invoiceId: number, writeOffAmount: number, reason: string, transaction?: Transaction) => Promise<{
    writtenOff: boolean;
    workflow: WorkflowInstance;
    amount: number;
}>;
/**
 * Create revenue contract with performance obligations
 * Composes: createRevenueContract, createPerformanceObligation, allocateTransactionPrice
 */
export declare const createRevenueContractWithObligations: (contractData: any, obligations: any[], transaction?: Transaction) => Promise<RevenueRecognitionWorkflowResult>;
export { CustomerRevenueOperationsService, updateCustomerWithCreditReview, placeCustomerOnHoldWithCollections, releaseCustomerHoldWithVerification, createAndPostInvoiceWithRevenue, processMilestoneBillingWithRevenue, createCreditMemoWithRevenueReversal, generateCustomerStatementWithAging, applyPaymentWithAutoAllocation, processLockboxWithAutoMatching, processRefundWithCreditVerification, processChargebackWithDispute, executeAutomatedCollections, generateAndSendDunningLetters, calculateCollectionEfficiencyMetrics, monitorCustomerCreditWithActions, reevaluateCustomerCreditLimit, applyCreditPolicyToCustomer, createPaymentPlanWithApproval, processPaymentPlanInstallmentWithApplication, cancelPaymentPlanWithReinstatement, createAndRouteDispute, resolveDisputeWithAdjustments, generateCustomerPortalData, processCustomerSelfServicePayment, writeOffBadDebtWithApproval, createRevenueContractWithObligations, };
//# sourceMappingURL=customer-revenue-operations-composite.d.ts.map