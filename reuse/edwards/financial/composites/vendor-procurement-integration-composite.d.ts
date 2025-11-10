/**
 * LOC: VNDPRCINT001
 * File: /reuse/edwards/financial/composites/vendor-procurement-integration-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../accounts-payable-management-kit
 *   - ../procurement-financial-integration-kit
 *   - ../invoice-management-matching-kit
 *   - ../payment-processing-collections-kit
 *   - ../financial-workflow-approval-kit
 *   - ../credit-management-risk-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend procurement modules
 *   - Vendor management REST API controllers
 *   - GraphQL procurement resolvers
 *   - Procurement analytics services
 *   - Supplier collaboration portals
 */
import { Transaction } from 'sequelize';
import { type Vendor, type Payment, type PaymentRun } from '../accounts-payable-management-kit';
import { type PurchaseRequisition, type PurchaseOrder, type POReceipt, type POCommitment } from '../procurement-financial-integration-kit';
import { type Invoice } from '../invoice-management-matching-kit';
import { type PaymentFile } from '../payment-processing-collections-kit';
import { type WorkflowDefinition, type WorkflowInstance } from '../financial-workflow-approval-kit';
import { type CreditAssessment, type RiskScore } from '../credit-management-risk-kit';
/**
 * Complete vendor onboarding request
 */
export interface VendorOnboardingRequest {
    vendorNumber: string;
    vendorName: string;
    taxId: string;
    businessType: string;
    paymentTerms: string;
    paymentMethod: 'check' | 'ach' | 'wire' | 'card';
    primaryContact: {
        name: string;
        email: string;
        phone: string;
        address: any;
    };
    bankingDetails?: {
        accountNumber: string;
        routingNumber: string;
        bankName: string;
    };
    complianceDocuments: string[];
    w9Form?: string;
}
/**
 * Vendor onboarding result
 */
export interface VendorOnboardingResult {
    vendor: Vendor;
    creditAssessment: CreditAssessment;
    complianceStatus: 'approved' | 'pending' | 'rejected';
    workflowInstance?: WorkflowInstance;
    riskScore: RiskScore;
}
/**
 * Complete procurement request from requisition to PO
 */
export interface ProcurementRequest {
    requisitionData: any;
    approvalRequired: boolean;
    urgency: 'standard' | 'expedited' | 'emergency';
    deliveryDate: Date;
    costCenter: string;
    projectId?: number;
}
/**
 * Three-way match execution result
 */
export interface ThreeWayMatchResult {
    matchStatus: 'matched' | 'variance' | 'failed';
    invoice: Invoice;
    purchaseOrder: PurchaseOrder;
    receipt: POReceipt;
    variances: {
        priceVariance: number;
        quantityVariance: number;
        totalVariance: number;
    };
    autoApproved: boolean;
    requiresReview: boolean;
}
/**
 * Vendor performance metrics
 */
export interface VendorPerformanceMetrics {
    vendorId: number;
    vendorNumber: string;
    vendorName: string;
    performancePeriod: {
        start: Date;
        end: Date;
    };
    onTimeDeliveryRate: number;
    qualityScore: number;
    invoiceAccuracyRate: number;
    averageLeadTime: number;
    totalSpend: number;
    numberOfOrders: number;
    numberOfInvoices: number;
    averagePaymentTime: number;
    discountCaptureRate: number;
    disputeRate: number;
    overallScore: number;
    rating: 'excellent' | 'good' | 'fair' | 'poor';
}
/**
 * Supplier collaboration portal data
 */
export interface SupplierPortalData {
    vendor: Vendor;
    openPurchaseOrders: PurchaseOrder[];
    pendingInvoices: Invoice[];
    paymentHistory: Payment[];
    performanceMetrics: VendorPerformanceMetrics;
    outstandingIssues: any[];
    contractDetails: any[];
}
/**
 * Payment automation configuration
 */
export interface PaymentAutomationConfig {
    vendorId: number;
    autoApproveUnderAmount?: number;
    earlyPayDiscountThreshold?: number;
    paymentSchedule: 'immediate' | 'weekly' | 'biweekly' | 'monthly';
    preferredPaymentMethod: 'ach' | 'wire' | 'check' | 'card';
    requiresApproval: boolean;
    approvalWorkflowId?: number;
}
/**
 * Complete vendor onboarding with compliance checks and credit assessment
 * Composes: createVendor, assessCreditRisk, calculateCreditScore, createWorkflowInstance
 */
export declare class VendorProcurementIntegrationService {
    private readonly logger;
    onboardNewVendor(request: VendorOnboardingRequest, transaction?: Transaction): Promise<VendorOnboardingResult>;
}
/**
 * Update vendor with compliance validation
 * Composes: updateVendor, monitorCreditLimit, evaluatePaymentBehavior
 */
export declare const updateVendorWithValidation: (vendorId: number, updateData: Partial<Vendor>, transaction?: Transaction) => Promise<{
    vendor: Vendor;
    creditCheck: any;
    paymentBehavior: any;
}>;
/**
 * Place vendor on hold with workflow and notification
 * Composes: placeVendorOnHold, createWorkflowInstance, searchVendors
 */
export declare const placeVendorOnHoldWithApproval: (vendorId: number, holdReason: string, requestedBy: string, transaction?: Transaction) => Promise<{
    vendor: Vendor;
    workflow: WorkflowInstance;
}>;
/**
 * Release vendor hold with authorization
 * Composes: releaseVendorHold, approveWorkflowStep, getVendorByNumber
 */
export declare const releaseVendorHoldWithAuthorization: (vendorId: number, workflowInstanceId: number, approverId: string, comments: string, transaction?: Transaction) => Promise<{
    vendor: Vendor;
    approved: boolean;
}>;
/**
 * Calculate vendor performance score
 * Composes: getVendorPaymentStats, searchVendors, getTopVendorsByVolume
 */
export declare const calculateVendorPerformanceScore: (vendorId: number, periodStart: Date, periodEnd: Date) => Promise<VendorPerformanceMetrics>;
/**
 * Complete procurement flow from requisition to PO
 * Composes: createPurchaseRequisition, approvePurchaseRequisition, convertRequisitionToPO, calculatePOCommitment
 */
export declare const executeProcurementFlow: (request: ProcurementRequest, transaction?: Transaction) => Promise<{
    requisition: PurchaseRequisition;
    purchaseOrder: PurchaseOrder;
    commitment: POCommitment;
}>;
/**
 * Approve and issue purchase order with commitment tracking
 * Composes: approvePurchaseOrder, issuePurchaseOrder, updatePOCommitment
 */
export declare const approveAndIssuePurchaseOrder: (poId: number, approverId: string, transaction?: Transaction) => Promise<{
    purchaseOrder: PurchaseOrder;
    commitment: POCommitment;
}>;
/**
 * Receive goods and update commitments
 * Composes: receivePurchaseOrder, updatePOCommitment, createPOAccrual
 */
export declare const receiveGoodsAndUpdateCommitments: (poId: number, receiptData: any, transaction?: Transaction) => Promise<{
    receipt: POReceipt;
    commitment: POCommitment;
    accrual: any;
}>;
/**
 * Close PO with variance analysis and accrual reversal
 * Composes: closePurchaseOrder, getPOReceiptVariance, reversePOAccrual
 */
export declare const closePurchaseOrderWithReconciliation: (poId: number, transaction?: Transaction) => Promise<{
    purchaseOrder: PurchaseOrder;
    variance: any;
    accrualReversed: boolean;
}>;
/**
 * Cancel PO with commitment and accrual cleanup
 * Composes: cancelPurchaseOrder, updatePOCommitment, reversePOAccrual
 */
export declare const cancelPurchaseOrderWithCleanup: (poId: number, cancellationReason: string, transaction?: Transaction) => Promise<{
    purchaseOrder: PurchaseOrder;
    commitmentReleased: boolean;
}>;
/**
 * Execute comprehensive three-way match with tolerance checking
 * Composes: performThreeWayMatch, performInvoiceThreeWayMatch, approveInvoice, placeInvoiceHold
 */
export declare const executeThreeWayMatchWithTolerance: (invoiceId: number, poId: number, receiptId: number, tolerancePercent?: number, transaction?: Transaction) => Promise<ThreeWayMatchResult>;
/**
 * Process two-way match for non-inventory invoices
 * Composes: performTwoWayMatch, validateInvoice, approveInvoice
 */
export declare const processTwoWayMatchFlow: (invoiceId: number, poId: number, transaction?: Transaction) => Promise<{
    matchResult: any;
    validated: boolean;
    approved: boolean;
}>;
/**
 * Handle invoice variance with dispute creation
 * Composes: createInvoiceDispute, placeInvoiceHold, createWorkflowInstance
 */
export declare const handleInvoiceVarianceWithDispute: (invoiceId: number, varianceDetails: any, transaction?: Transaction) => Promise<{
    dispute: any;
    workflow: WorkflowInstance;
    onHold: boolean;
}>;
/**
 * Resolve invoice dispute and release hold
 * Composes: releaseInvoiceHold, approveWorkflowStep, approveInvoice
 */
export declare const resolveInvoiceDisputeAndRelease: (invoiceId: number, workflowInstanceId: number, resolution: "approve" | "reject", approverId: string, transaction?: Transaction) => Promise<{
    released: boolean;
    approved: boolean;
}>;
/**
 * Create invoice with automated validation and duplicate check
 * Composes: createInvoice, detectDuplicateInvoices, validateInvoice, checkDuplicateInvoice
 */
export declare const createInvoiceWithValidation: (invoiceData: any, transaction?: Transaction) => Promise<{
    invoice: Invoice;
    validated: boolean;
    duplicates: any[];
}>;
/**
 * Process invoice with OCR and automated coding
 * Composes: processInvoiceOCR, applyAutomatedCoding, validateInvoice, createInvoice
 */
export declare const processInvoiceWithOCRAndCoding: (imageData: Buffer, defaultVendorId: number, transaction?: Transaction) => Promise<{
    invoice: Invoice;
    ocrData: any;
    codingApplied: boolean;
}>;
/**
 * Approve invoice with workflow and GL posting
 * Composes: approveInvoice, approveAPInvoice, executeApprovalStep, createAPInvoice
 */
export declare const approveInvoiceWithWorkflow: (invoiceId: number, workflowInstanceId: number, approverId: string, comments: string, transaction?: Transaction) => Promise<{
    invoice: Invoice;
    workflowCompleted: boolean;
    glPosted: boolean;
}>;
/**
 * Create payment run with discount optimization
 * Composes: createPaymentRun, selectInvoicesForPaymentRun, analyzeAvailableDiscounts, calculateCashRequirements
 */
export declare const createOptimizedPaymentRun: (paymentDate: Date, maxDiscountCapture?: boolean, transaction?: Transaction) => Promise<{
    paymentRun: PaymentRun;
    invoices: any[];
    discounts: any;
    cashRequired: number;
}>;
/**
 * Process payment run with batch generation
 * Composes: processPaymentRun, processPaymentBatch, generatePaymentFile
 */
export declare const executePaymentRunWithBatch: (paymentRunId: number, transaction?: Transaction) => Promise<{
    paymentRun: PaymentRun;
    batchResult: any;
    paymentFile: PaymentFile;
}>;
/**
 * Process individual payment with discount calculation
 * Composes: createPayment, applyEarlyPaymentDiscount, calculateDiscountTerms, processPayment
 */
export declare const processPaymentWithDiscount: (invoiceId: number, paymentDate: Date, transaction?: Transaction) => Promise<{
    payment: Payment;
    discountApplied: number;
    netAmount: number;
}>;
/**
 * Reconcile payment batch with bank file
 * Composes: reconcilePayments, validatePaymentFile, processPaymentReversals
 */
export declare const reconcilePaymentBatchWithBank: (paymentRunId: number, bankFile: any, transaction?: Transaction) => Promise<{
    reconciled: number;
    unreconciled: number;
    reversals: any[];
}>;
/**
 * Generate supplier portal data with complete vendor view
 * Composes: getVendorByNumber, searchVendors, generateVendorStatement, calculateVendorPerformanceScore
 */
export declare const generateSupplierPortalData: (vendorNumber: string, periodDays?: number) => Promise<SupplierPortalData>;
/**
 * Analyze vendor spend patterns
 * Composes: getTopVendorsByVolume, analyzeProcurementSpend, getVendorPaymentStats
 */
export declare const analyzeVendorSpendPatterns: (periodStart: Date, periodEnd: Date, topN?: number) => Promise<{
    topVendors: any[];
    spendAnalysis: any;
    concentrationRisk: number;
    diversificationScore: number;
}>;
/**
 * Generate comprehensive procurement report
 * Composes: generateProcurementReport, analyzeProcurementSpend, getTopVendorsByVolume
 */
export declare const generateComprehensiveProcurementReport: (periodStart: Date, periodEnd: Date) => Promise<{
    summary: any;
    topVendors: any[];
    spendByCategory: any;
    savingsOpportunities: any;
    complianceMetrics: any;
}>;
/**
 * Setup automated payment configuration for vendor
 * Composes: updateVendor, createApprovalRule, createWorkflowDefinition
 */
export declare const setupVendorPaymentAutomation: (vendorId: number, config: PaymentAutomationConfig, transaction?: Transaction) => Promise<{
    updated: boolean;
    workflow?: WorkflowDefinition;
    rule?: any;
}>;
/**
 * Execute automated payment processing
 * Composes: selectInvoicesForPaymentRun, analyzeAvailableDiscounts, createPayment, processPayment
 */
export declare const executeAutomatedPaymentProcessing: (vendorId: number, config: PaymentAutomationConfig, transaction?: Transaction) => Promise<{
    processed: number;
    totalAmount: number;
    discountsCaptured: number;
}>;
/**
 * Assess vendor risk with comprehensive analysis
 * Composes: assessCreditRisk, calculateCreditScore, evaluatePaymentBehavior, generateRiskReport
 */
export declare const performComprehensiveVendorRiskAssessment: (vendorId: number) => Promise<{
    creditRisk: CreditAssessment;
    riskScore: RiskScore;
    paymentBehavior: any;
    riskReport: any;
    overallRating: "low" | "medium" | "high" | "critical";
}>;
/**
 * Monitor vendor credit limits with alerts
 * Composes: monitorCreditLimit, getVendorPaymentStats, placeVendorOnHold
 */
export declare const monitorVendorCreditWithAlerts: (vendorId: number, transaction?: Transaction) => Promise<{
    withinLimit: boolean;
    utilizationPercent: number;
    actionTaken?: string;
}>;
export { VendorProcurementIntegrationService, updateVendorWithValidation, placeVendorOnHoldWithApproval, releaseVendorHoldWithAuthorization, calculateVendorPerformanceScore, executeProcurementFlow, approveAndIssuePurchaseOrder, receiveGoodsAndUpdateCommitments, closePurchaseOrderWithReconciliation, cancelPurchaseOrderWithCleanup, executeThreeWayMatchWithTolerance, processTwoWayMatchFlow, handleInvoiceVarianceWithDispute, resolveInvoiceDisputeAndRelease, createInvoiceWithValidation, processInvoiceWithOCRAndCoding, approveInvoiceWithWorkflow, createOptimizedPaymentRun, executePaymentRunWithBatch, processPaymentWithDiscount, reconcilePaymentBatchWithBank, generateSupplierPortalData, analyzeVendorSpendPatterns, generateComprehensiveProcurementReport, setupVendorPaymentAutomation, executeAutomatedPaymentProcessing, performComprehensiveVendorRiskAssessment, monitorVendorCreditWithAlerts, };
//# sourceMappingURL=vendor-procurement-integration-composite.d.ts.map