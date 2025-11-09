/**
 * LOC: PROCFINCTRL001
 * File: /reuse/edwards/financial/composites/procurement-financial-controls-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../procurement-financial-integration-kit
 *   - ../invoice-management-matching-kit
 *   - ../financial-workflow-approval-kit
 *   - ../commitment-control-kit
 *   - ../encumbrance-accounting-kit
 *   - ../audit-trail-compliance-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend procurement control modules
 *   - Procurement REST API controllers
 *   - Spend analytics services
 *   - Contract compliance systems
 *   - Procurement audit dashboards
 */
import { Transaction } from 'sequelize';
import { type PurchaseRequisition, type PurchaseOrder, type POReceipt } from '../procurement-financial-integration-kit';
import { type Invoice, type InvoiceMatchResult, type InvoiceDispute } from '../invoice-management-matching-kit';
import { type WorkflowInstance } from '../financial-workflow-approval-kit';
import { type Commitment } from '../commitment-control-kit';
import { type Encumbrance } from '../encumbrance-accounting-kit';
import { type ComplianceCheckpoint } from '../audit-trail-compliance-kit';
/**
 * Procurement approval configuration
 */
export interface ProcurementApprovalConfig {
    requisitionApproval: {
        enabled: boolean;
        amountThresholds: {
            amount: number;
            approverLevel: string;
        }[];
        requireBudgetCheck: boolean;
    };
    poApproval: {
        enabled: boolean;
        amountThresholds: {
            amount: number;
            approverLevel: string;
        }[];
        requireContractCompliance: boolean;
    };
    invoiceApproval: {
        enabled: boolean;
        autoApproveMatched: boolean;
        varianceThreshold: number;
    };
    paymentApproval: {
        enabled: boolean;
        amountThresholds: {
            amount: number;
            approverLevel: string;
        }[];
    };
}
/**
 * Procurement control metrics
 */
export interface ProcurementControlMetrics {
    period: {
        start: Date;
        end: Date;
    };
    requisitions: {
        submitted: number;
        approved: number;
        rejected: number;
        pending: number;
        averageApprovalTime: number;
    };
    purchaseOrders: {
        created: number;
        approved: number;
        issued: number;
        averageAmount: number;
        totalValue: number;
    };
    receiving: {
        receiptsProcessed: number;
        receiptVariances: number;
        averageVariancePercent: number;
    };
    invoiceMatching: {
        invoicesProcessed: number;
        autoMatched: number;
        manualReview: number;
        matchRate: number;
    };
    compliance: {
        contractCompliance: number;
        mavrikSpend: number;
        policyViolations: number;
    };
}
/**
 * Spend analysis result
 */
export interface SpendAnalysisResult {
    period: {
        start: Date;
        end: Date;
    };
    totalSpend: number;
    byCategory: {
        category: string;
        amount: number;
        percent: number;
    }[];
    bySupplier: {
        supplierId: number;
        supplierName: string;
        amount: number;
        percent: number;
    }[];
    byDepartment: {
        department: string;
        amount: number;
        percent: number;
    }[];
    trends: {
        monthOverMonth: number;
        yearOverYear: number;
        forecast: number;
    };
    savingsOpportunities: {
        volumeDiscounts: number;
        contractConsolidation: number;
        supplierRationalization: number;
        totalPotentialSavings: number;
    };
    riskIndicators: {
        supplierConcentration: number;
        mavrikSpend: number;
        offContractSpend: number;
    };
}
/**
 * Contract compliance status
 */
export interface ContractComplianceStatus {
    contractId: number;
    contractNumber: string;
    supplier: string;
    contractValue: number;
    spendToDate: number;
    utilizationPercent: number;
    compliance: {
        onContract: number;
        offContract: number;
        complianceRate: number;
    };
    violations: any[];
    expirationDate: Date;
    daysToExpiration: number;
    renewalRequired: boolean;
}
/**
 * Create requisition with approval workflow
 * Composes: createPurchaseRequisition, createWorkflowInstance, createCommitment, createAuditEntry
 */
export declare class ProcurementFinancialControlsService {
    private readonly logger;
    createRequisitionWithWorkflow(requisitionData: any, approvalConfig: ProcurementApprovalConfig, transaction?: Transaction): Promise<{
        requisition: PurchaseRequisition;
        workflow?: WorkflowInstance;
        commitment?: Commitment;
    }>;
}
/**
 * Approve requisition with budget validation
 * Composes: approvePurchaseRequisition, approveWorkflowStep, trackCommitmentBalance, createAuditEntry
 */
export declare const approveRequisitionWithBudgetValidation: (requisitionId: number, workflowInstanceId: number, approverId: string, comments: string, transaction?: Transaction) => Promise<{
    approved: boolean;
    budgetValid: boolean;
    requisition: PurchaseRequisition;
}>;
/**
 * Reject requisition with workflow
 * Composes: rejectPurchaseRequisition, rejectWorkflowStep, createCommitment, createAuditEntry
 */
export declare const rejectRequisitionWithWorkflow: (requisitionId: number, workflowInstanceId: number, approverId: string, rejectionReason: string, transaction?: Transaction) => Promise<{
    rejected: boolean;
    commitmentReleased: boolean;
}>;
/**
 * Convert requisition to PO with controls
 * Composes: convertRequisitionToPO, createEncumbrance, updateCommitment, createAuditEntry
 */
export declare const convertRequisitionToPOWithControls: (requisitionId: number, convertedBy: string, transaction?: Transaction) => Promise<{
    purchaseOrder: PurchaseOrder;
    encumbrance: Encumbrance;
    commitmentUpdated: boolean;
}>;
/**
 * Create PO with approval and commitment
 * Composes: createPurchaseOrder, createWorkflowInstance, createEncumbrance, createAuditEntry
 */
export declare const createPOWithApprovalAndCommitment: (poData: any, requiresApproval: boolean, transaction?: Transaction) => Promise<{
    purchaseOrder: PurchaseOrder;
    workflow?: WorkflowInstance;
    encumbrance: Encumbrance;
}>;
/**
 * Approve PO with contract compliance check
 * Composes: approvePurchaseOrder, approveWorkflowStep, validateCompliance, createAuditEntry
 */
export declare const approvePOWithContractCompliance: (poId: number, workflowInstanceId: number, approverId: string, contractId?: number, transaction?: Transaction) => Promise<{
    approved: boolean;
    compliant: boolean;
    issued: boolean;
}>;
/**
 * Change PO with re-approval workflow
 * Composes: changePurchaseOrder, updateEncumbrance, createWorkflowInstance, createAuditEntry
 */
export declare const changePOWithReapproval: (poId: number, changeData: any, requiresReapproval: boolean, transaction?: Transaction) => Promise<{
    changed: boolean;
    encumbranceUpdated: boolean;
    workflow?: WorkflowInstance;
}>;
/**
 * Close PO with final reconciliation
 * Composes: closePurchaseOrder, liquidateEncumbrance, reconcileCommitments, createAuditEntry
 */
export declare const closePOWithFinalReconciliation: (poId: number, closedBy: string, transaction?: Transaction) => Promise<{
    closed: boolean;
    encumbranceLiquidated: boolean;
    variance: number;
}>;
/**
 * Receive goods with variance analysis
 * Composes: receivePurchaseOrder, getPOReceiptVariance, updateEncumbrance, createAuditEntry
 */
export declare const receiveGoodsWithVarianceAnalysis: (poId: number, receiptData: any, varianceThreshold: number, transaction?: Transaction) => Promise<{
    receipt: POReceipt;
    variance: any;
    withinTolerance: boolean;
    actionRequired: boolean;
}>;
/**
 * Process return to supplier
 * Composes: returnPurchaseOrder, reverseEncumbrance, createAuditEntry
 */
export declare const processReturnToSupplier: (poId: number, receiptId: number, returnData: any, transaction?: Transaction) => Promise<{
    returned: boolean;
    encumbranceReversed: boolean;
}>;
/**
 * Process invoice with automated matching
 * Composes: createInvoice, detectDuplicateInvoices, performThreeWayMatch, approveInvoice, createAuditEntry
 */
export declare const processInvoiceWithAutomatedMatching: (invoiceData: any, poId: number, receiptId: number, autoApproveThreshold: number, transaction?: Transaction) => Promise<{
    invoice: Invoice;
    matchResult: InvoiceMatchResult;
    autoApproved: boolean;
}>;
/**
 * Handle invoice variance with dispute workflow
 * Composes: placeInvoiceHold, createInvoiceDispute, createWorkflowInstance, createAuditEntry
 */
export declare const handleInvoiceVarianceWithDispute: (invoiceId: number, varianceData: any, transaction?: Transaction) => Promise<{
    onHold: boolean;
    dispute: InvoiceDispute;
    workflow: WorkflowInstance;
}>;
/**
 * Resolve invoice dispute and process
 * Composes: resolveInvoiceDispute, releaseInvoiceHold, approveInvoice, approveWorkflowStep
 */
export declare const resolveInvoiceDisputeAndProcess: (disputeId: number, invoiceId: number, workflowInstanceId: number, resolution: "approve" | "reject", adjustmentAmount: number, transaction?: Transaction) => Promise<{
    resolved: boolean;
    approved: boolean;
    adjustment: number;
}>;
/**
 * Process invoice OCR with automated routing
 * Composes: processInvoiceOCR, applyAutomatedCoding, routeInvoice, createAuditEntry
 */
export declare const processInvoiceOCRWithRouting: (imageData: Buffer, routingRules: any, transaction?: Transaction) => Promise<{
    ocrData: any;
    coded: boolean;
    routed: boolean;
}>;
/**
 * Analyze comprehensive procurement spend
 * Composes: analyzeProcurementSpend, generateProcurementReport, createAuditEntry
 */
export declare const analyzeComprehensiveProcurementSpend: (periodStart: Date, periodEnd: Date, transaction?: Transaction) => Promise<SpendAnalysisResult>;
/**
 * Generate procurement control metrics
 * Composes: Multiple procurement and approval functions
 */
export declare const generateProcurementControlMetrics: (periodStart: Date, periodEnd: Date, transaction?: Transaction) => Promise<ProcurementControlMetrics>;
/**
 * Monitor contract compliance
 * Composes: validateCompliance, generateComplianceReport, createComplianceCheckpoint
 */
export declare const monitorContractCompliance: (contractId: number, transaction?: Transaction) => Promise<ContractComplianceStatus>;
/**
 * Execute procurement compliance audit
 * Composes: validateCompliance, generateComplianceReport, createAuditTrail, logComplianceEvent
 */
export declare const executeProcurementComplianceAudit: (auditPeriod: {
    start: Date;
    end: Date;
}, auditType: "full" | "contract" | "spend", transaction?: Transaction) => Promise<{
    report: any;
    violations: any[];
    checkpoints: ComplianceCheckpoint[];
    auditTrail: any;
}>;
/**
 * Track procurement data changes
 * Composes: trackDataChange, createAuditEntry
 */
export declare const trackProcurementDataChanges: (entityType: string, entityId: number, changes: any[], transaction?: Transaction) => Promise<{
    tracked: number;
    auditEntriesCreated: number;
}>;
/**
 * Reconcile procurement commitments and encumbrances
 * Composes: reconcileCommitments, reconcileEncumbrances, generateCommitmentReport, generateEncumbranceReport
 */
export declare const reconcileProcurementCommitmentsAndEncumbrances: (periodEnd: Date, transaction?: Transaction) => Promise<{
    commitments: any;
    encumbrances: any;
    commitmentReport: any;
    encumbranceReport: any;
    balanced: boolean;
}>;
/**
 * Calculate encumbrance balance
 * Composes: calculateEncumbranceBalance, trackCommitmentBalance
 */
export declare const calculateProcurementEncumbranceBalance: (entityId: number, transaction?: Transaction) => Promise<{
    encumbranceBalance: number;
    commitmentBalance: number;
    variance: number;
}>;
export { ProcurementFinancialControlsService, approveRequisitionWithBudgetValidation, rejectRequisitionWithWorkflow, convertRequisitionToPOWithControls, createPOWithApprovalAndCommitment, approvePOWithContractCompliance, changePOWithReapproval, closePOWithFinalReconciliation, receiveGoodsWithVarianceAnalysis, processReturnToSupplier, processInvoiceWithAutomatedMatching, handleInvoiceVarianceWithDispute, resolveInvoiceDisputeAndProcess, processInvoiceOCRWithRouting, analyzeComprehensiveProcurementSpend, generateProcurementControlMetrics, monitorContractCompliance, executeProcurementComplianceAudit, trackProcurementDataChanges, reconcileProcurementCommitmentsAndEncumbrances, calculateProcurementEncumbranceBalance, };
//# sourceMappingURL=procurement-financial-controls-composite.d.ts.map