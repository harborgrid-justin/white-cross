/**
 * LOC: PAYORCHCMP001
 * File: /reuse/edwards/financial/composites/payment-processing-orchestration-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../payment-processing-collections-kit
 *   - ../accounts-payable-management-kit
 *   - ../banking-reconciliation-kit
 *   - ../financial-workflow-approval-kit
 *   - ../invoice-management-matching-kit
 *
 * DOWNSTREAM (imported by):
 *   - Payment processing REST API controllers
 *   - GraphQL payment resolvers
 *   - ACH/wire transfer orchestration services
 *   - Treasury management dashboards
 */
import { Transaction } from 'sequelize';
/**
 * Payment orchestration REST API configuration
 */
export interface PaymentOrchestrationApiConfig {
    baseUrl: string;
    version: string;
    maxPaymentsPerRun: number;
    autoApprovalThreshold: number;
    achTransmissionWindow: string[];
    wireTransmissionWindow: string[];
    checkPrintingEnabled: boolean;
    positivePayEnabled: boolean;
}
/**
 * Payment run orchestration request
 */
export declare class CreatePaymentRunRequest {
    runDate: Date;
    scheduledDate: Date;
    paymentMethodId: number;
    bankAccountId: number;
    selectionCriteria: {
        supplierIds?: number[];
        dueDateFrom?: Date;
        dueDateTo?: Date;
        minAmount?: number;
        maxAmount?: number;
        paymentTerms?: string[];
        businessUnits?: string[];
    };
    autoApprove: boolean;
}
/**
 * Payment run orchestration response
 */
export declare class PaymentRunResponse {
    paymentRunId: number;
    runNumber: string;
    status: string;
    paymentCount: number;
    totalAmount: number;
    currency: string;
    approvalRequired: boolean;
}
/**
 * ACH batch processing request
 */
export declare class ProcessACHBatchRequest {
    paymentRunId: number;
    effectiveDate: Date;
    originatorId: string;
    originatorName: string;
    autoTransmit: boolean;
}
/**
 * ACH batch processing response
 */
export declare class ACHBatchResponse {
    achBatchId: number;
    batchNumber: string;
    fileName: string;
    entryCount: number;
    totalDebit: number;
    totalCredit: number;
    validationStatus: string;
    fileContent?: string;
}
/**
 * Wire transfer request
 */
export declare class CreateWireTransferRequest {
    paymentId: number;
    wireType: 'Domestic' | 'International';
    beneficiary: {
        name: string;
        accountNumber: string;
        bankName: string;
        bankSwift?: string;
        bankABA?: string;
    };
    intermediaryBank?: {
        bankSwift: string;
        bankName: string;
    };
    purposeCode?: string;
    instructions: string;
}
/**
 * Wire transfer response
 */
export declare class WireTransferResponse {
    wireTransferId: number;
    referenceNumber: string;
    status: string;
    amount: number;
    currency: string;
}
/**
 * Check run request
 */
export declare class ProcessCheckRunRequest {
    paymentRunId: number;
    bankAccountId: number;
    startingCheckNumber: string;
    autoPrint: boolean;
}
/**
 * Check run response
 */
export declare class CheckRunResponse {
    checkRunId: number;
    runNumber: string;
    checkCount: number;
    totalAmount: number;
    startingCheckNumber: string;
    endingCheckNumber: string;
    status: string;
}
/**
 * Positive pay file request
 */
export declare class GeneratePositivePayRequest {
    bankAccountId: number;
    startDate: Date;
    endDate: Date;
    fileFormat: 'CSV' | 'BAI2' | 'Fixed';
}
/**
 * Positive pay file response
 */
export declare class PositivePayFileResponse {
    fileName: string;
    checkCount: number;
    totalAmount: number;
    fileContent: string;
    generatedAt: Date;
}
/**
 * Payment reconciliation request
 */
export declare class ReconcilePaymentRequest {
    paymentId: number;
    statementLineId: number;
    clearedDate: Date;
    bankReference: string;
}
/**
 * Payment analytics request
 */
export declare class PaymentAnalyticsRequest {
    startDate: Date;
    endDate: Date;
    groupBy: 'payment_method' | 'supplier' | 'bank_account' | 'day' | 'week' | 'month';
    includeForecast: boolean;
}
/**
 * Payment analytics response
 */
export declare class PaymentAnalyticsResponse {
    totalPayments: number;
    totalAmount: number;
    averagePaymentAmount: number;
    breakdown: {
        category: string;
        count: number;
        amount: number;
        percentage: number;
    }[];
    forecast?: {
        period: string;
        predictedAmount: number;
        confidence: number;
    }[];
}
/**
 * Orchestrates complete payment run creation with invoice selection and validation
 * Composes: createPaymentRun, calculatePaymentRunTotals, getInvoicesPendingApproval, validateInvoice
 *
 * @param request Payment run creation request
 * @param transaction Database transaction
 * @returns Payment run with calculated totals and validation status
 */
export declare const orchestratePaymentRunCreation: (request: CreatePaymentRunRequest, transaction?: Transaction) => Promise<PaymentRunResponse>;
/**
 * Orchestrates payment run approval workflow with multi-level approvals
 * Composes: approvePaymentRun, createWorkflowInstanceModel, createApprovalActionModel, createPaymentAuditTrail
 *
 * @param paymentRunId Payment run ID
 * @param approverId Approver user ID
 * @param comments Approval comments
 * @param transaction Database transaction
 * @returns Approval result with workflow status
 */
export declare const orchestratePaymentRunApproval: (paymentRunId: number, approverId: string, comments: string, transaction?: Transaction) => Promise<{
    approved: boolean;
    workflowComplete: boolean;
    nextApprover?: string;
}>;
/**
 * Orchestrates payment generation from approved run with invoice applications
 * Composes: createPaymentsFromRun, generatePaymentNumber, createPaymentApplication, updateBankAccountBalance
 *
 * @param paymentRunId Payment run ID
 * @param transaction Database transaction
 * @returns Generated payments with invoice applications
 */
export declare const orchestratePaymentGeneration: (paymentRunId: number, transaction?: Transaction) => Promise<{
    payments: any[];
    totalAmount: number;
}>;
/**
 * Orchestrates ACH batch processing with NACHA file generation and validation
 * Composes: processACHBatch, generateACHBatchNumber, generateNACHAFile, validateACHBatch
 *
 * @param request ACH batch processing request
 * @param transaction Database transaction
 * @returns ACH batch with NACHA file
 */
export declare const orchestrateACHBatchProcessing: (request: ProcessACHBatchRequest, transaction?: Transaction) => Promise<ACHBatchResponse>;
/**
 * Orchestrates ACH transmission with bank connectivity and retry logic
 * Composes: transmitACHBatch, getBankAccount, createPaymentAuditTrail
 *
 * @param achBatchId ACH batch ID
 * @param transaction Database transaction
 * @returns Transmission result with confirmation
 */
export declare const orchestrateACHTransmission: (achBatchId: number, transaction?: Transaction) => Promise<{
    transmitted: boolean;
    confirmationNumber?: string;
    transmittedAt: Date;
}>;
/**
 * Orchestrates wire transfer creation with compliance checks and approvals
 * Composes: createWireTransfer, getVendorByNumber, approvePayment, createPaymentAuditTrail
 *
 * @param request Wire transfer creation request
 * @param transaction Database transaction
 * @returns Wire transfer with approval status
 */
export declare const orchestrateWireTransferCreation: (request: CreateWireTransferRequest, transaction?: Transaction) => Promise<WireTransferResponse>;
/**
 * Orchestrates international wire transfer with SWIFT message generation
 * Composes: createWireTransfer, getBankAccount, generatePaymentNumber, createPaymentAuditTrail
 *
 * @param request Wire transfer creation request
 * @param transaction Database transaction
 * @returns Wire transfer with SWIFT message
 */
export declare const orchestrateInternationalWireTransfer: (request: CreateWireTransferRequest, transaction?: Transaction) => Promise<WireTransferResponse & {
    swiftMessage?: string;
}>;
/**
 * Orchestrates check run processing with check printing and numbering
 * Composes: processCheckRun, generateCheckRunNumber, printCheck, convertAmountToWords
 *
 * @param request Check run processing request
 * @param transaction Database transaction
 * @returns Check run with check details
 */
export declare const orchestrateCheckRunProcessing: (request: ProcessCheckRunRequest, transaction?: Transaction) => Promise<CheckRunResponse>;
/**
 * Orchestrates check printing with MICR encoding and signature validation
 * Composes: printCheck, convertAmountToWords, getBankAccount, createPaymentAuditTrail
 *
 * @param checkId Check ID
 * @param transaction Database transaction
 * @returns Check print data with MICR line
 */
export declare const orchestrateCheckPrinting: (checkId: number, transaction?: Transaction) => Promise<{
    checkData: any;
    micrLine: string;
    printReady: boolean;
}>;
/**
 * Orchestrates positive pay file generation for fraud prevention
 * Composes: generatePositivePayFile, getBankAccount, createPaymentAuditTrail
 *
 * @param request Positive pay file generation request
 * @param transaction Database transaction
 * @returns Positive pay file with check details
 */
export declare const orchestratePositivePayGeneration: (request: GeneratePositivePayRequest, transaction?: Transaction) => Promise<PositivePayFileResponse>;
/**
 * Orchestrates payment reconciliation with bank statement matching
 * Composes: reconcilePayment, getBankAccount, clearPayment, createPaymentAuditTrail
 *
 * @param request Payment reconciliation request
 * @param transaction Database transaction
 * @returns Reconciliation result with cleared status
 */
export declare const orchestratePaymentReconciliation: (request: ReconcilePaymentRequest, transaction?: Transaction) => Promise<{
    reconciled: boolean;
    clearedDate: Date;
    variance: number;
}>;
/**
 * Orchestrates automated payment reconciliation with fuzzy matching
 * Composes: reconcilePayment, getBankAccount, clearPayment, createPaymentAuditTrail
 *
 * @param bankAccountId Bank account ID
 * @param statementId Bank statement ID
 * @param transaction Database transaction
 * @returns Reconciliation results with match confidence
 */
export declare const orchestrateAutomatedPaymentReconciliation: (bankAccountId: number, statementId: number, transaction?: Transaction) => Promise<{
    matched: number;
    unmatched: number;
    confidence: number;
}>;
/**
 * Orchestrates payment hold placement with workflow notifications
 * Composes: placePaymentHold, createPaymentAuditTrail, createWorkflowInstanceModel
 *
 * @param paymentId Payment ID
 * @param holdReason Hold reason
 * @param holdBy User placing hold
 * @param transaction Database transaction
 * @returns Hold placement result
 */
export declare const orchestratePaymentHoldPlacement: (paymentId: number, holdReason: string, holdBy: string, transaction?: Transaction) => Promise<{
    holdPlaced: boolean;
    holdDate: Date;
    notificationsSent: number;
}>;
/**
 * Orchestrates payment hold release with approval validation
 * Composes: releasePaymentHold, createPaymentAuditTrail, approvePayment
 *
 * @param paymentId Payment ID
 * @param releaseReason Release reason
 * @param releasedBy User releasing hold
 * @param transaction Database transaction
 * @returns Hold release result
 */
export declare const orchestratePaymentHoldRelease: (paymentId: number, releaseReason: string, releasedBy: string, transaction?: Transaction) => Promise<{
    holdReleased: boolean;
    releaseDate: Date;
}>;
/**
 * Orchestrates payment voiding with reversal entries
 * Composes: voidPayment, createPaymentAuditTrail, updateBankAccountBalance
 *
 * @param paymentId Payment ID
 * @param voidReason Void reason
 * @param voidedBy User voiding payment
 * @param transaction Database transaction
 * @returns Void result with reversal details
 */
export declare const orchestratePaymentVoid: (paymentId: number, voidReason: string, voidedBy: string, transaction?: Transaction) => Promise<{
    voided: boolean;
    voidDate: Date;
    reversalEntries: number;
}>;
/**
 * Orchestrates payment reissue after void
 * Composes: voidPayment, createPayment, generatePaymentNumber, createPaymentAuditTrail
 *
 * @param originalPaymentId Original payment ID
 * @param reissueReason Reissue reason
 * @param reissuedBy User reissuing payment
 * @param transaction Database transaction
 * @returns Reissue result with new payment
 */
export declare const orchestratePaymentReissue: (originalPaymentId: number, reissueReason: string, reissuedBy: string, transaction?: Transaction) => Promise<{
    reissued: boolean;
    newPaymentId: number;
    newPaymentNumber: string;
}>;
/**
 * Orchestrates payment schedule creation with recurring payments
 * Composes: createPaymentSchedule, calculateNextRunDate, createPaymentAuditTrail
 *
 * @param scheduleConfig Payment schedule configuration
 * @param transaction Database transaction
 * @returns Payment schedule with calculated run dates
 */
export declare const orchestratePaymentScheduleCreation: (scheduleConfig: {
    paymentMethodId: number;
    frequency: "daily" | "weekly" | "biweekly" | "monthly" | "semimonthly";
    startDate: Date;
    endDate?: Date;
    selectionCriteria: any;
}, transaction?: Transaction) => Promise<{
    scheduleId: number;
    scheduledRuns: Date[];
}>;
/**
 * Orchestrates payment run cancellation with cleanup
 * Composes: cancelPaymentRun, voidPayment, createPaymentAuditTrail
 *
 * @param paymentRunId Payment run ID
 * @param cancellationReason Cancellation reason
 * @param cancelledBy User cancelling run
 * @param transaction Database transaction
 * @returns Cancellation result with cleanup details
 */
export declare const orchestratePaymentRunCancellation: (paymentRunId: number, cancellationReason: string, cancelledBy: string, transaction?: Transaction) => Promise<{
    cancelled: boolean;
    paymentsVoided: number;
    cleanupComplete: boolean;
}>;
/**
 * Orchestrates payment analytics generation with forecasting
 * Composes: getPaymentHistory, calculatePaymentRunTotals, generatePaymentNumber
 *
 * @param request Payment analytics request
 * @param transaction Database transaction
 * @returns Payment analytics with trends and forecasts
 */
export declare const orchestratePaymentAnalytics: (request: PaymentAnalyticsRequest, transaction?: Transaction) => Promise<PaymentAnalyticsResponse>;
/**
 * Orchestrates payment batch processing with parallel execution
 * Composes: createPayment, approvePayment, transmitPayment, createPaymentAuditTrail
 *
 * @param paymentRequests Array of payment requests
 * @param transaction Database transaction
 * @returns Batch processing results
 */
export declare const orchestratePaymentBatchProcessing: (paymentRequests: any[], transaction?: Transaction) => Promise<{
    processed: number;
    failed: number;
    results: any[];
}>;
/**
 * Orchestrates payment reversal with GL impact
 * Composes: voidPayment, createPaymentAuditTrail, updateBankAccountBalance
 *
 * @param paymentId Payment ID
 * @param reversalReason Reversal reason
 * @param reversedBy User reversing payment
 * @param transaction Database transaction
 * @returns Reversal result with GL entries
 */
export declare const orchestratePaymentReversal: (paymentId: number, reversalReason: string, reversedBy: string, transaction?: Transaction) => Promise<{
    reversed: boolean;
    glEntries: number;
    reversalDate: Date;
}>;
/**
 * Orchestrates payment method validation with bank account verification
 * Composes: getPaymentMethod, getBankAccount, validateACHBatch
 *
 * @param paymentMethodId Payment method ID
 * @param bankAccountId Bank account ID
 * @param transaction Database transaction
 * @returns Validation result with compatibility check
 */
export declare const orchestratePaymentMethodValidation: (paymentMethodId: number, bankAccountId: number, transaction?: Transaction) => Promise<{
    valid: boolean;
    compatible: boolean;
    errors: string[];
}>;
/**
 * Orchestrates payment exception handling with escalation
 * Composes: placePaymentHold, createPaymentAuditTrail, createWorkflowInstanceModel
 *
 * @param paymentId Payment ID
 * @param exceptionType Exception type
 * @param exceptionDetails Exception details
 * @param transaction Database transaction
 * @returns Exception handling result with escalation status
 */
export declare const orchestratePaymentExceptionHandling: (paymentId: number, exceptionType: string, exceptionDetails: string, transaction?: Transaction) => Promise<{
    handled: boolean;
    escalated: boolean;
    assignedTo?: string;
}>;
/**
 * Orchestrates payment file transmission tracking
 * Composes: transmitACHBatch, createPaymentAuditTrail, getBankAccount
 *
 * @param fileType File type (ACH, Wire, PositivePay)
 * @param fileId File ID
 * @param transaction Database transaction
 * @returns Transmission tracking result
 */
export declare const orchestratePaymentFileTransmissionTracking: (fileType: "ACH" | "Wire" | "PositivePay", fileId: number, transaction?: Transaction) => Promise<{
    transmitted: boolean;
    confirmationNumber: string;
    transmittedAt: Date;
    status: string;
}>;
/**
 * Orchestrates payment approval workflow routing
 * Composes: approvePayment, createApprovalStepModel, createPaymentAuditTrail
 *
 * @param paymentId Payment ID
 * @param currentApprover Current approver user ID
 * @param approved Approval decision
 * @param comments Approval comments
 * @param transaction Database transaction
 * @returns Workflow routing result
 */
export declare const orchestratePaymentApprovalWorkflowRouting: (paymentId: number, currentApprover: string, approved: boolean, comments: string, transaction?: Transaction) => Promise<{
    workflowComplete: boolean;
    nextApprover?: string;
    finalStatus: string;
}>;
/**
 * Orchestrates payment duplicate detection and prevention
 * Composes: checkDuplicateInvoice, getPaymentHistory, createPaymentAuditTrail
 *
 * @param paymentRequest Payment request
 * @param transaction Database transaction
 * @returns Duplicate detection result
 */
export declare const orchestratePaymentDuplicateDetection: (paymentRequest: any, transaction?: Transaction) => Promise<{
    isDuplicate: boolean;
    matchScore: number;
    potentialDuplicates: any[];
}>;
/**
 * Orchestrates payment dashboard metrics aggregation
 * Composes: getPaymentHistory, calculatePaymentRunTotals, getVendorPaymentStats
 *
 * @param dateRange Date range for metrics
 * @param transaction Database transaction
 * @returns Dashboard metrics
 */
export declare const orchestratePaymentDashboardMetrics: (dateRange: {
    startDate: Date;
    endDate: Date;
}, transaction?: Transaction) => Promise<{
    totalPayments: number;
    totalAmount: number;
    paymentsByMethod: any[];
    paymentsByStatus: any[];
    topSuppliers: any[];
    trends: any[];
}>;
/**
 * Orchestrates payment file archive and retention
 * Composes: generateNACHAFile, generatePositivePayFile, createPaymentAuditTrail
 *
 * @param fileType File type
 * @param fileId File ID
 * @param retentionYears Retention period in years
 * @param transaction Database transaction
 * @returns Archive result
 */
export declare const orchestratePaymentFileArchive: (fileType: "ACH" | "Wire" | "PositivePay" | "Check", fileId: number, retentionYears: number, transaction?: Transaction) => Promise<{
    archived: boolean;
    archiveLocation: string;
    expirationDate: Date;
}>;
/**
 * Orchestrates payment compliance validation
 * Composes: validateACHBatch, getVendorByNumber, checkDuplicateInvoice
 *
 * @param paymentId Payment ID
 * @param complianceRules Compliance rules to check
 * @param transaction Database transaction
 * @returns Compliance validation result
 */
export declare const orchestratePaymentComplianceValidation: (paymentId: number, complianceRules: string[], transaction?: Transaction) => Promise<{
    compliant: boolean;
    violations: string[];
    warnings: string[];
}>;
/**
 * Orchestrates end-of-day payment processing summary
 * Composes: getPaymentHistory, calculatePaymentRunTotals, createPaymentAuditTrail
 *
 * @param businessDate Business date
 * @param transaction Database transaction
 * @returns End-of-day summary
 */
export declare const orchestrateEndOfDayPaymentSummary: (businessDate: Date, transaction?: Transaction) => Promise<{
    date: Date;
    paymentsProcessed: number;
    totalAmount: number;
    paymentRunsCompleted: number;
    achBatchesTransmitted: number;
    checksIssued: number;
    wiresProcessed: number;
    exceptions: number;
}>;
export { orchestratePaymentRunCreation, orchestratePaymentRunApproval, orchestratePaymentGeneration, orchestratePaymentRunCancellation, orchestrateACHBatchProcessing, orchestrateACHTransmission, orchestrateWireTransferCreation, orchestrateInternationalWireTransfer, orchestrateCheckRunProcessing, orchestrateCheckPrinting, orchestratePositivePayGeneration, orchestratePaymentReconciliation, orchestrateAutomatedPaymentReconciliation, orchestratePaymentHoldPlacement, orchestratePaymentHoldRelease, orchestratePaymentVoid, orchestratePaymentReissue, orchestratePaymentReversal, orchestratePaymentScheduleCreation, orchestratePaymentAnalytics, orchestratePaymentDashboardMetrics, orchestratePaymentBatchProcessing, orchestratePaymentMethodValidation, orchestratePaymentComplianceValidation, orchestratePaymentExceptionHandling, orchestratePaymentFileTransmissionTracking, orchestratePaymentFileArchive, orchestratePaymentApprovalWorkflowRouting, orchestratePaymentDuplicateDetection, orchestrateEndOfDayPaymentSummary, };
//# sourceMappingURL=payment-processing-orchestration-composite.d.ts.map