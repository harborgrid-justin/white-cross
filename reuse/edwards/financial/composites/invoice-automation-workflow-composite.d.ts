/**
 * LOC: INVAUTOCMP001
 * File: /reuse/edwards/financial/composites/invoice-automation-workflow-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../invoice-management-matching-kit
 *   - ../accounts-payable-management-kit
 *   - ../financial-workflow-approval-kit
 *   - ../payment-processing-collections-kit
 *   - ../procurement-financial-integration-kit
 *
 * DOWNSTREAM (imported by):
 *   - Invoice processing REST API controllers
 *   - AP automation services
 *   - OCR processing pipelines
 *   - Invoice matching engines
 */
import { Transaction } from 'sequelize';
/**
 * Invoice capture request
 */
export declare class CaptureInvoiceRequest {
    captureMethod: 'scan' | 'email' | 'edi' | 'api' | 'manual' | 'portal';
    supplierId?: number;
    supplierNumber?: string;
    documentType: 'pdf' | 'jpeg' | 'png' | 'tiff' | 'xml';
    autoProcessOCR: boolean;
    autoMatch: boolean;
    metadata?: Record<string, any>;
}
/**
 * Invoice capture response
 */
export declare class CaptureInvoiceResponse {
    invoiceId: number;
    status: string;
    ocrConfidence?: number;
    extractedData?: any;
    validationResults?: any;
}
/**
 * OCR processing request
 */
export declare class ProcessOCRRequest {
    invoiceId: number;
    ocrEngine: 'tesseract' | 'google_vision' | 'aws_textract' | 'azure_form_recognizer';
    extractLineItems: boolean;
    autoValidate: boolean;
    applyMLCorrections: boolean;
}
/**
 * OCR processing response
 */
export declare class ProcessOCRResponse {
    status: string;
    confidence: number;
    extractedFields: {
        invoiceNumber?: {
            value: string;
            confidence: number;
        };
        invoiceDate?: {
            value: string;
            confidence: number;
        };
        dueDate?: {
            value: string;
            confidence: number;
        };
        supplierName?: {
            value: string;
            confidence: number;
        };
        totalAmount?: {
            value: number;
            confidence: number;
        };
        taxAmount?: {
            value: number;
            confidence: number;
        };
        poNumber?: {
            value: string;
            confidence: number;
        };
    };
    lineItems: any[];
    validationIssues: string[];
}
/**
 * Automated matching request
 */
export declare class AutomatedMatchingRequest {
    invoiceId: number;
    matchingType: 'two_way' | 'three_way' | 'four_way';
    autoApprove: boolean;
    toleranceOverrides?: {
        quantityTolerancePercent?: number;
        priceTolerancePercent?: number;
        amountToleranceAmount?: number;
    };
}
/**
 * Automated matching response
 */
export declare class AutomatedMatchingResponse {
    status: string;
    matchQuality: number;
    variances: {
        lineNumber: number;
        varianceType: string;
        varianceAmount: number;
        withinTolerance: boolean;
    }[];
    autoApproved: boolean;
    exceptions: string[];
}
/**
 * Approval routing request
 */
export declare class ApprovalRoutingRequest {
    invoiceId: number;
    routingRules: string[];
    priority: 'low' | 'normal' | 'high' | 'urgent';
    approvalDueDate: Date;
}
/**
 * Approval routing response
 */
export declare class ApprovalRoutingResponse {
    routingId: number;
    approvalSteps: {
        stepNumber: number;
        approverRole: string;
        approverUser?: string;
        status: string;
        dueDate: Date;
    }[];
    currentStep: number;
    estimatedCompletionDate: Date;
}
/**
 * Exception handling request
 */
export declare class InvoiceExceptionRequest {
    invoiceId: number;
    exceptionType: string;
    exceptionDetails: string;
    autoEscalate: boolean;
    assignTo?: string;
}
/**
 * Duplicate detection request
 */
export declare class DuplicateDetectionRequest {
    invoice: {
        supplierNumber: string;
        invoiceNumber: string;
        invoiceDate: Date;
        amount: number;
    };
    sensitivity: number;
    lookbackDays: number;
}
/**
 * Invoice analytics request
 */
export declare class InvoiceAnalyticsRequest {
    startDate: Date;
    endDate: Date;
    groupBy: 'supplier' | 'gl_account' | 'business_unit' | 'day' | 'week' | 'month' | 'status';
    includeProcessingMetrics: boolean;
}
/**
 * Invoice analytics response
 */
export declare class InvoiceAnalyticsResponse {
    totalInvoices: number;
    totalAmount: number;
    avgProcessingTime: number;
    stpRate: number;
    exceptionRate: number;
    breakdown: any[];
}
/**
 * Orchestrates complete invoice capture with image processing
 * Composes: createInvoice, uploadInvoiceImage, getSupplierDetails, validateInvoice
 *
 * @param request Invoice capture request
 * @param file Uploaded file
 * @param transaction Database transaction
 * @returns Invoice capture result with validation
 */
export declare const orchestrateInvoiceCapture: (request: CaptureInvoiceRequest, file: any, transaction?: Transaction) => Promise<CaptureInvoiceResponse>;
/**
 * Orchestrates OCR processing with ML validation and corrections
 * Composes: processInvoiceOCR, validateInvoice, getSupplierDetails, applyAutomatedCoding
 *
 * @param request OCR processing request
 * @param transaction Database transaction
 * @returns OCR processing result with confidence scores
 */
export declare const orchestrateOCRProcessing: (request: ProcessOCRRequest, transaction?: Transaction) => Promise<ProcessOCRResponse>;
/**
 * Orchestrates invoice validation with comprehensive checks
 * Composes: validateInvoice, validateInvoiceTax, detectDuplicateInvoices, getSupplierDetails
 *
 * @param invoiceId Invoice ID
 * @param transaction Database transaction
 * @returns Validation result with detailed checks
 */
export declare const orchestrateInvoiceValidation: (invoiceId: number, transaction?: Transaction) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    checks: {
        check: string;
        passed: boolean;
        message?: string;
    }[];
}>;
/**
 * Orchestrates automated GL coding with machine learning
 * Composes: applyAutomatedCoding, getSupplierDetails, getInvoiceHistory
 *
 * @param invoiceId Invoice ID
 * @param transaction Database transaction
 * @returns GL coding result with confidence scores
 */
export declare const orchestrateAutomatedGLCoding: (invoiceId: number, transaction?: Transaction) => Promise<{
    coded: boolean;
    confidence: number;
    codings: {
        lineNumber: number;
        glAccount: string;
        confidence: number;
    }[];
    learningApplied: boolean;
}>;
/**
 * Orchestrates three-way matching with tolerance management
 * Composes: performThreeWayMatch, getMatchingTolerance, getPurchaseOrderLine, getReceiptLine
 *
 * @param request Automated matching request
 * @param transaction Database transaction
 * @returns Three-way match result with variances
 */
export declare const orchestrateThreeWayMatching: (request: AutomatedMatchingRequest, transaction?: Transaction) => Promise<AutomatedMatchingResponse>;
/**
 * Orchestrates two-way matching for non-PO invoices
 * Composes: performTwoWayMatch, getMatchingTolerance, approveInvoice
 *
 * @param request Automated matching request
 * @param transaction Database transaction
 * @returns Two-way match result
 */
export declare const orchestrateTwoWayMatching: (request: AutomatedMatchingRequest, transaction?: Transaction) => Promise<AutomatedMatchingResponse>;
/**
 * Orchestrates fuzzy matching for complex scenarios
 * Composes: performThreeWayMatch, getPurchaseOrderLine, getReceiptLine
 *
 * @param invoiceId Invoice ID
 * @param transaction Database transaction
 * @returns Fuzzy match result with confidence
 */
export declare const orchestrateFuzzyMatching: (invoiceId: number, transaction?: Transaction) => Promise<{
    matched: boolean;
    confidence: number;
    suggestedPOs: {
        poId: number;
        confidence: number;
    }[];
    requiresReview: boolean;
}>;
/**
 * Orchestrates variance analysis and exception routing
 * Composes: performThreeWayMatch, getMatchingTolerance, placeInvoiceHold, routeInvoice
 *
 * @param invoiceId Invoice ID
 * @param transaction Database transaction
 * @returns Variance analysis result with routing
 */
export declare const orchestrateVarianceAnalysis: (invoiceId: number, transaction?: Transaction) => Promise<{
    totalVariance: number;
    variancePercent: number;
    withinTolerance: boolean;
    variances: any[];
    routed: boolean;
    routedTo?: string;
}>;
/**
 * Orchestrates dynamic approval routing based on business rules
 * Composes: routeInvoice, createWorkflowInstanceModel, createApprovalStepModel
 *
 * @param request Approval routing request
 * @param transaction Database transaction
 * @returns Approval routing result with workflow steps
 */
export declare const orchestrateApprovalRouting: (request: ApprovalRoutingRequest, transaction?: Transaction) => Promise<ApprovalRoutingResponse>;
/**
 * Orchestrates approval step execution with delegation support
 * Composes: approveInvoice, createApprovalActionModel, routeInvoice
 *
 * @param invoiceId Invoice ID
 * @param approverId Approver user ID
 * @param approved Approval decision
 * @param comments Approval comments
 * @param delegateTo Optional delegation target
 * @param transaction Database transaction
 * @returns Approval execution result
 */
export declare const orchestrateApprovalExecution: (invoiceId: number, approverId: string, approved: boolean, comments: string, delegateTo?: string, transaction?: Transaction) => Promise<{
    executed: boolean;
    workflowComplete: boolean;
    nextApprover?: string;
    delegated: boolean;
}>;
/**
 * Orchestrates approval escalation for overdue approvals
 * Composes: routeInvoice, createWorkflowInstanceModel, createInvoiceAuditTrail
 *
 * @param transaction Database transaction
 * @returns Escalation results
 */
export declare const orchestrateApprovalEscalation: (transaction?: Transaction) => Promise<{
    escalated: number;
    notifications: number;
}>;
/**
 * Orchestrates invoice exception detection and handling
 * Composes: placeInvoiceHold, createInvoiceDispute, routeInvoice, createInvoiceAuditTrail
 *
 * @param request Exception handling request
 * @param transaction Database transaction
 * @returns Exception handling result
 */
export declare const orchestrateInvoiceExceptionHandling: (request: InvoiceExceptionRequest, transaction?: Transaction) => Promise<{
    handled: boolean;
    holdPlaced: boolean;
    escalated: boolean;
    assignedTo: string;
    dueDate: Date;
}>;
/**
 * Orchestrates invoice hold management with release workflows
 * Composes: releaseInvoiceHold, approveInvoice, routeInvoice, createInvoiceAuditTrail
 *
 * @param invoiceId Invoice ID
 * @param releaseReason Hold release reason
 * @param releasedBy User releasing hold
 * @param autoReprocess Auto-reprocess after release
 * @param transaction Database transaction
 * @returns Hold release result
 */
export declare const orchestrateInvoiceHoldRelease: (invoiceId: number, releaseReason: string, releasedBy: string, autoReprocess: boolean, transaction?: Transaction) => Promise<{
    released: boolean;
    reprocessed: boolean;
    status: string;
}>;
/**
 * Orchestrates invoice dispute resolution workflow
 * Composes: createInvoiceDispute, getVendorByNumber, routeInvoice, createInvoiceAuditTrail
 *
 * @param invoiceId Invoice ID
 * @param disputeDetails Dispute details
 * @param transaction Database transaction
 * @returns Dispute resolution workflow result
 */
export declare const orchestrateInvoiceDisputeResolution: (invoiceId: number, disputeDetails: {
    disputeType: string;
    disputeReason: string;
    disputeAmount: number;
    notifySupplier: boolean;
}, transaction?: Transaction) => Promise<{
    disputeId: number;
    status: string;
    assignedTo: string;
    supplierNotified: boolean;
}>;
/**
 * Orchestrates comprehensive duplicate invoice detection
 * Composes: detectDuplicateInvoices, checkDuplicateInvoice, getInvoiceHistory
 *
 * @param request Duplicate detection request
 * @param transaction Database transaction
 * @returns Duplicate detection result with match details
 */
export declare const orchestrateDuplicateDetection: (request: DuplicateDetectionRequest, transaction?: Transaction) => Promise<{
    isDuplicate: boolean;
    confidence: number;
    potentialDuplicates: {
        invoiceId: number;
        matchScore: number;
        matchReasons: string[];
    }[];
}>;
/**
 * Orchestrates comprehensive invoice analytics generation
 * Composes: getInvoiceHistory, calculateInvoiceLineTotals, getInvoicesPendingApproval
 *
 * @param request Invoice analytics request
 * @param transaction Database transaction
 * @returns Invoice analytics with processing metrics
 */
export declare const orchestrateInvoiceAnalytics: (request: InvoiceAnalyticsRequest, transaction?: Transaction) => Promise<InvoiceAnalyticsResponse>;
/**
 * Orchestrates invoice processing dashboard metrics
 * Composes: getInvoicesPendingApproval, getInvoicesWithVariances, getInvoiceHistory
 *
 * @param transaction Database transaction
 * @returns Dashboard metrics
 */
export declare const orchestrateInvoiceDashboardMetrics: (transaction?: Transaction) => Promise<{
    pendingCount: number;
    pendingAmount: number;
    overdueCount: number;
    exceptionCount: number;
    stpRate: number;
    avgProcessingTime: number;
    topSuppliers: any[];
    recentActivity: any[];
}>;
/**
 * Orchestrates end-of-period invoice processing summary
 * Composes: getInvoiceHistory, calculateInvoiceLineTotals
 *
 * @param periodEndDate Period end date
 * @param transaction Database transaction
 * @returns End-of-period summary
 */
export declare const orchestrateEndOfPeriodInvoiceSummary: (periodEndDate: Date, transaction?: Transaction) => Promise<{
    totalInvoicesProcessed: number;
    totalAmount: number;
    approvedCount: number;
    rejectedCount: number;
    pendingCount: number;
    stpRate: number;
    avgProcessingTime: number;
    exceptionCount: number;
    topExceptions: any[];
}>;
/**
 * Orchestrates straight-through processing (STP) automation
 * Composes: validateInvoice, performThreeWayMatch, approveInvoice, detectDuplicateInvoices
 *
 * @param invoiceId Invoice ID
 * @param transaction Database transaction
 * @returns STP result
 */
export declare const orchestrateStraightThroughProcessing: (invoiceId: number, transaction?: Transaction) => Promise<{
    stpSuccess: boolean;
    stageCompleted: string;
    autoApproved: boolean;
    reason?: string;
}>;
/**
 * Orchestrates batch invoice processing
 * Composes: validateInvoice, performThreeWayMatch, approveInvoice
 *
 * @param invoiceIds Array of invoice IDs
 * @param transaction Database transaction
 * @returns Batch processing results
 */
export declare const orchestrateBatchInvoiceProcessing: (invoiceIds: number[], transaction?: Transaction) => Promise<{
    processed: number;
    approved: number;
    failed: number;
    results: any[];
}>;
/**
 * Orchestrates invoice workflow optimization recommendations
 * Composes: getInvoiceHistory, getInvoicesPendingApproval, getInvoicesWithVariances
 *
 * @param analysisStartDate Analysis start date
 * @param transaction Database transaction
 * @returns Optimization recommendations
 */
export declare const orchestrateWorkflowOptimizationAnalysis: (analysisStartDate: Date, transaction?: Transaction) => Promise<{
    recommendations: any[];
    bottlenecks: any[];
    stpOpportunities: any[];
    estimatedSavings: number;
}>;
export { orchestrateInvoiceCapture, orchestrateOCRProcessing, orchestrateInvoiceValidation, orchestrateAutomatedGLCoding, orchestrateThreeWayMatching, orchestrateTwoWayMatching, orchestrateFuzzyMatching, orchestrateVarianceAnalysis, orchestrateApprovalRouting, orchestrateApprovalExecution, orchestrateApprovalEscalation, orchestrateInvoiceExceptionHandling, orchestrateInvoiceHoldRelease, orchestrateInvoiceDisputeResolution, orchestrateDuplicateDetection, orchestrateInvoiceAnalytics, orchestrateInvoiceDashboardMetrics, orchestrateEndOfPeriodInvoiceSummary, orchestrateStraightThroughProcessing, orchestrateBatchInvoiceProcessing, orchestrateWorkflowOptimizationAnalysis, };
//# sourceMappingURL=invoice-automation-workflow-composite.d.ts.map