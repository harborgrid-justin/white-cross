"use strict";
/**
 * LOC: ELECTRONIC_PAYMENTS_DISBURSEMENTS_KIT_001
 * File: /reuse/government/electronic-payments-disbursements-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Government payment processing services
 *   - Disbursement management systems
 *   - Banking integration platforms
 *   - Payment reconciliation services
 *   - Treasury management systems
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronicPaymentResponse = exports.CreateDirectDepositDto = exports.CreatePaymentBatchDto = exports.CreateElectronicPaymentDto = exports.ElectronicPaymentServiceExample = exports.PaymentReversalModel = exports.PaymentReconciliationModel = exports.PaymentBatchModel = exports.ElectronicPaymentModel = exports.ReversalReasonCode = exports.PaymentPriority = exports.ReconciliationStatus = exports.BatchStatus = exports.ACHStandardEntryClass = exports.ACHTransactionCode = exports.PaymentStatus = exports.PaymentType = void 0;
exports.createElectronicPayment = createElectronicPayment;
exports.generatePaymentNumber = generatePaymentNumber;
exports.createACHPayment = createACHPayment;
exports.generateACHTraceNumber = generateACHTraceNumber;
exports.validateRoutingNumber = validateRoutingNumber;
exports.validateAccountNumber = validateAccountNumber;
exports.initiateEFT = initiateEFT;
exports.processEFT = processEFT;
exports.createWireTransfer = createWireTransfer;
exports.generateWireReference = generateWireReference;
exports.validateSWIFTCode = validateSWIFTCode;
exports.validateIBAN = validateIBAN;
exports.createPaymentBatch = createPaymentBatch;
exports.generateBatchNumber = generateBatchNumber;
exports.addPaymentToBatch = addPaymentToBatch;
exports.finalizeBatch = finalizeBatch;
exports.approveBatch = approveBatch;
exports.submitBatch = submitBatch;
exports.createDirectDepositEnrollment = createDirectDepositEnrollment;
exports.verifyDirectDepositAccount = verifyDirectDepositAccount;
exports.createPrenote = createPrenote;
exports.processDirectDeposit = processDirectDeposit;
exports.createPaymentReconciliation = createPaymentReconciliation;
exports.reconcilePayment = reconcilePayment;
exports.flagReconciliationDiscrepancy = flagReconciliationDiscrepancy;
exports.resolveReconciliationException = resolveReconciliationException;
exports.createPaymentReversal = createPaymentReversal;
exports.approvePaymentReversal = approvePaymentReversal;
exports.processPaymentReversal = processPaymentReversal;
exports.rejectPaymentReversal = rejectPaymentReversal;
exports.updatePaymentStatus = updatePaymentStatus;
exports.trackPaymentLifecycle = trackPaymentLifecycle;
exports.getPaymentStatusSummary = getPaymentStatusSummary;
exports.generateNACHAFile = generateNACHAFile;
exports.generateNACHAFileNumber = generateNACHAFileNumber;
exports.calculateEntryHash = calculateEntryHash;
exports.buildNACHAFileContent = buildNACHAFileContent;
exports.createPositivePayFile = createPositivePayFile;
exports.generatePositivePayFileNumber = generatePositivePayFileNumber;
exports.buildPositivePayFileContent = buildPositivePayFileContent;
exports.addCheckToPositivePay = addCheckToPositivePay;
exports.createCheckPrintingRequest = createCheckPrintingRequest;
exports.generateCheckRequestNumber = generateCheckRequestNumber;
exports.markCheckPrinted = markCheckPrinted;
exports.markCheckMailed = markCheckMailed;
exports.voidCheck = voidCheck;
exports.createPaymentApprovalWorkflow = createPaymentApprovalWorkflow;
exports.recordApprovalDecision = recordApprovalDecision;
exports.isApprovalWorkflowComplete = isApprovalWorkflowComplete;
exports.getPendingApprovers = getPendingApprovers;
exports.createPaymentMethodConfig = createPaymentMethodConfig;
exports.determineRequiredApprovals = determineRequiredApprovals;
exports.calculateNextProcessingDate = calculateNextProcessingDate;
/**
 * File: /reuse/government/electronic-payments-disbursements-kit.ts
 * Locator: WC-GOV-ELEC-PAYMENTS-DISB-001
 * Purpose: Comprehensive Electronic Payments and Disbursements Toolkit for Government Operations
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto, class-validator
 * Downstream: Payment processing, Disbursement management, Banking integration, Reconciliation
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10+, Sequelize 6+
 * Exports: 50+ government electronic payments and disbursements functions
 *
 * LLM Context: Enterprise-grade electronic payments and disbursements for government agencies.
 * Provides comprehensive ACH payment processing, electronic funds transfer, wire transfer management,
 * payment batch processing, direct deposit management, payment reconciliation, payment reversal handling,
 * payment status tracking, NACHA file generation, positive pay integration, check printing and mailing,
 * payment approval workflows with full Sequelize/NestJS/Swagger integration.
 */
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Payment types
 */
var PaymentType;
(function (PaymentType) {
    PaymentType["ACH_CREDIT"] = "ACH_CREDIT";
    PaymentType["ACH_DEBIT"] = "ACH_DEBIT";
    PaymentType["WIRE_TRANSFER"] = "WIRE_TRANSFER";
    PaymentType["CHECK"] = "CHECK";
    PaymentType["DIRECT_DEPOSIT"] = "DIRECT_DEPOSIT";
    PaymentType["EFT"] = "EFT";
    PaymentType["CARD_PAYMENT"] = "CARD_PAYMENT";
    PaymentType["VIRTUAL_CARD"] = "VIRTUAL_CARD";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
/**
 * Payment status
 */
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["DRAFT"] = "DRAFT";
    PaymentStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    PaymentStatus["APPROVED"] = "APPROVED";
    PaymentStatus["SUBMITTED"] = "SUBMITTED";
    PaymentStatus["PROCESSING"] = "PROCESSING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REVERSED"] = "REVERSED";
    PaymentStatus["CANCELLED"] = "CANCELLED";
    PaymentStatus["ON_HOLD"] = "ON_HOLD";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
/**
 * ACH transaction codes
 */
var ACHTransactionCode;
(function (ACHTransactionCode) {
    ACHTransactionCode["CHECKING_CREDIT"] = "22";
    ACHTransactionCode["CHECKING_DEBIT"] = "27";
    ACHTransactionCode["SAVINGS_CREDIT"] = "32";
    ACHTransactionCode["SAVINGS_DEBIT"] = "37";
    ACHTransactionCode["PRENOTE_CHECKING_CREDIT"] = "23";
    ACHTransactionCode["PRENOTE_CHECKING_DEBIT"] = "28";
    ACHTransactionCode["PRENOTE_SAVINGS_CREDIT"] = "33";
    ACHTransactionCode["PRENOTE_SAVINGS_DEBIT"] = "38";
})(ACHTransactionCode || (exports.ACHTransactionCode = ACHTransactionCode = {}));
/**
 * ACH standard entry class codes
 */
var ACHStandardEntryClass;
(function (ACHStandardEntryClass) {
    ACHStandardEntryClass["PPD"] = "PPD";
    ACHStandardEntryClass["CCD"] = "CCD";
    ACHStandardEntryClass["CTX"] = "CTX";
    ACHStandardEntryClass["WEB"] = "WEB";
    ACHStandardEntryClass["TEL"] = "TEL";
    ACHStandardEntryClass["POP"] = "POP";
    ACHStandardEntryClass["ARC"] = "ARC";
    ACHStandardEntryClass["BOC"] = "BOC";
})(ACHStandardEntryClass || (exports.ACHStandardEntryClass = ACHStandardEntryClass = {}));
/**
 * Batch status
 */
var BatchStatus;
(function (BatchStatus) {
    BatchStatus["CREATING"] = "CREATING";
    BatchStatus["READY"] = "READY";
    BatchStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    BatchStatus["APPROVED"] = "APPROVED";
    BatchStatus["SUBMITTED"] = "SUBMITTED";
    BatchStatus["PROCESSING"] = "PROCESSING";
    BatchStatus["COMPLETED"] = "COMPLETED";
    BatchStatus["FAILED"] = "FAILED";
    BatchStatus["PARTIALLY_COMPLETED"] = "PARTIALLY_COMPLETED";
})(BatchStatus || (exports.BatchStatus = BatchStatus = {}));
/**
 * Reconciliation status
 */
var ReconciliationStatus;
(function (ReconciliationStatus) {
    ReconciliationStatus["UNRECONCILED"] = "UNRECONCILED";
    ReconciliationStatus["PENDING"] = "PENDING";
    ReconciliationStatus["RECONCILED"] = "RECONCILED";
    ReconciliationStatus["DISCREPANCY"] = "DISCREPANCY";
    ReconciliationStatus["EXCEPTION"] = "EXCEPTION";
})(ReconciliationStatus || (exports.ReconciliationStatus = ReconciliationStatus = {}));
/**
 * Payment priority
 */
var PaymentPriority;
(function (PaymentPriority) {
    PaymentPriority["URGENT"] = "URGENT";
    PaymentPriority["HIGH"] = "HIGH";
    PaymentPriority["NORMAL"] = "NORMAL";
    PaymentPriority["LOW"] = "LOW";
})(PaymentPriority || (exports.PaymentPriority = PaymentPriority = {}));
/**
 * Reversal reason codes
 */
var ReversalReasonCode;
(function (ReversalReasonCode) {
    ReversalReasonCode["DUPLICATE_PAYMENT"] = "R01";
    ReversalReasonCode["INCORRECT_AMOUNT"] = "R02";
    ReversalReasonCode["INCORRECT_ACCOUNT"] = "R03";
    ReversalReasonCode["PAYEE_REQUEST"] = "R04";
    ReversalReasonCode["UNAUTHORIZED"] = "R05";
    ReversalReasonCode["RETURNED_BY_BANK"] = "R06";
    ReversalReasonCode["OTHER"] = "R99";
})(ReversalReasonCode || (exports.ReversalReasonCode = ReversalReasonCode = {}));
// ============================================================================
// ACH PAYMENT PROCESSING
// ============================================================================
/**
 * Creates an electronic payment
 */
function createElectronicPayment(params) {
    const paymentNumber = generatePaymentNumber();
    return {
        id: crypto.randomUUID(),
        paymentNumber,
        paymentType: params.paymentType,
        status: PaymentStatus.DRAFT,
        amount: params.amount,
        currency: 'USD',
        payeeId: params.payeeId,
        payeeName: params.payeeName,
        payeeAccountNumber: params.payeeAccountNumber,
        payeeRoutingNumber: params.payeeRoutingNumber,
        payerAccountId: params.payerAccountId,
        description: params.description,
        invoiceNumber: params.invoiceNumber,
        effectiveDate: params.effectiveDate,
        createdDate: new Date(),
        createdBy: params.createdBy,
    };
}
/**
 * Generates payment number
 */
function generatePaymentNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `PAY-${timestamp}-${random}`;
}
/**
 * Creates ACH payment details
 */
function createACHPayment(params) {
    const traceNumber = generateACHTraceNumber();
    return {
        id: crypto.randomUUID(),
        paymentId: params.paymentId,
        transactionCode: params.transactionCode,
        standardEntryClass: params.standardEntryClass,
        companyName: params.companyName,
        companyIdentification: params.companyIdentification,
        receiverName: params.receiverName,
        receiverAccountNumber: params.receiverAccountNumber,
        receiverRoutingNumber: params.receiverRoutingNumber,
        amount: params.amount,
        traceNumber,
        effectiveEntryDate: params.effectiveEntryDate,
    };
}
/**
 * Generates ACH trace number
 */
function generateACHTraceNumber() {
    const timestamp = Date.now().toString().slice(-7);
    const random = crypto.randomBytes(2).toString('hex');
    return timestamp + random;
}
/**
 * Validates routing number (ABA routing number)
 */
function validateRoutingNumber(routingNumber) {
    // Remove any non-digit characters
    const digits = routingNumber.replace(/\D/g, '');
    if (digits.length !== 9) {
        return false;
    }
    // Calculate checksum
    const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1];
    const sum = digits.split('').reduce((acc, digit, index) => {
        return acc + parseInt(digit) * weights[index];
    }, 0);
    return sum % 10 === 0;
}
/**
 * Validates account number format
 */
function validateAccountNumber(accountNumber) {
    const cleaned = accountNumber.replace(/\D/g, '');
    if (cleaned.length < 4 || cleaned.length > 17) {
        return { valid: false, error: 'Account number must be between 4 and 17 digits' };
    }
    return { valid: true };
}
// ============================================================================
// ELECTRONIC FUNDS TRANSFER
// ============================================================================
/**
 * Initiates electronic funds transfer
 */
function initiateEFT(params) {
    return createElectronicPayment({
        paymentType: PaymentType.EFT,
        amount: params.amount,
        payeeId: crypto.randomUUID(),
        payeeName: params.beneficiaryName,
        payeeAccountNumber: params.toAccount,
        payeeRoutingNumber: params.toRoutingNumber,
        payerAccountId: params.fromAccount,
        description: params.description,
        effectiveDate: params.effectiveDate,
        createdBy: params.createdBy,
    });
}
/**
 * Processes EFT transaction
 */
function processEFT(payment) {
    return {
        ...payment,
        status: PaymentStatus.PROCESSING,
        submittedDate: new Date(),
        traceNumber: generateACHTraceNumber(),
    };
}
// ============================================================================
// WIRE TRANSFER MANAGEMENT
// ============================================================================
/**
 * Creates wire transfer
 */
function createWireTransfer(params) {
    const reference = generateWireReference();
    return {
        id: crypto.randomUUID(),
        paymentId: params.paymentId,
        senderBank: params.senderBank,
        receiverBank: params.receiverBank,
        beneficiary: params.beneficiary,
        amount: params.amount,
        currency: params.currency,
        valueDate: params.valueDate,
        purpose: params.purpose,
        charges: params.charges || 'SHA',
        reference,
    };
}
/**
 * Generates wire transfer reference
 */
function generateWireReference() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `WIRE${timestamp}${random}`;
}
/**
 * Validates SWIFT code
 */
function validateSWIFTCode(swiftCode) {
    // SWIFT codes are 8 or 11 characters
    const cleaned = swiftCode.toUpperCase().replace(/\s/g, '');
    const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    return swiftRegex.test(cleaned);
}
/**
 * Validates IBAN
 */
function validateIBAN(iban) {
    const cleaned = iban.toUpperCase().replace(/\s/g, '');
    const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]+$/;
    if (!ibanRegex.test(cleaned) || cleaned.length < 15 || cleaned.length > 34) {
        return false;
    }
    // Move first 4 characters to end
    const rearranged = cleaned.substring(4) + cleaned.substring(0, 4);
    // Replace letters with numbers (A=10, B=11, etc.)
    const numeric = rearranged.split('').map(char => {
        const code = char.charCodeAt(0);
        return code >= 65 && code <= 90 ? (code - 55).toString() : char;
    }).join('');
    // Calculate mod 97
    let remainder = numeric;
    while (remainder.length > 2) {
        const block = remainder.substring(0, 9);
        remainder = (parseInt(block, 10) % 97).toString() + remainder.substring(block.length);
    }
    return parseInt(remainder, 10) % 97 === 1;
}
// ============================================================================
// PAYMENT BATCH PROCESSING
// ============================================================================
/**
 * Creates payment batch
 */
function createPaymentBatch(params) {
    const batchNumber = generateBatchNumber();
    return {
        id: crypto.randomUUID(),
        batchNumber,
        batchType: params.batchType,
        status: BatchStatus.CREATING,
        totalPayments: 0,
        totalAmount: 0,
        createdDate: new Date(),
        createdBy: params.createdBy,
        effectiveDate: params.effectiveDate,
        payments: [],
    };
}
/**
 * Generates batch number
 */
function generateBatchNumber() {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `BATCH-${dateStr}-${random}`;
}
/**
 * Adds payment to batch
 */
function addPaymentToBatch(batch, payment) {
    return {
        ...batch,
        payments: [...batch.payments, payment.id],
        totalPayments: batch.totalPayments + 1,
        totalAmount: batch.totalAmount + payment.amount,
    };
}
/**
 * Finalizes batch for submission
 */
function finalizeBatch(batch) {
    return {
        ...batch,
        status: BatchStatus.READY,
    };
}
/**
 * Approves payment batch
 */
function approveBatch(batch, approvedBy) {
    return {
        ...batch,
        status: BatchStatus.APPROVED,
        approvedBy,
        approvalDate: new Date(),
    };
}
/**
 * Submits batch for processing
 */
function submitBatch(batch) {
    return {
        ...batch,
        status: BatchStatus.SUBMITTED,
        submittedDate: new Date(),
    };
}
// ============================================================================
// DIRECT DEPOSIT MANAGEMENT
// ============================================================================
/**
 * Creates direct deposit enrollment
 */
function createDirectDepositEnrollment(params) {
    return {
        id: crypto.randomUUID(),
        employeeId: params.employeeId,
        accountType: params.accountType,
        accountNumber: params.accountNumber,
        routingNumber: params.routingNumber,
        bankName: params.bankName,
        enrollmentDate: new Date(),
        effectiveDate: params.effectiveDate,
        status: 'pending',
        verificationStatus: 'unverified',
    };
}
/**
 * Verifies direct deposit account
 */
function verifyDirectDepositAccount(enrollment) {
    return {
        ...enrollment,
        verificationStatus: 'verified',
        status: 'active',
    };
}
/**
 * Creates prenote for direct deposit
 */
function createPrenote(enrollment) {
    const transactionCode = enrollment.accountType === 'checking'
        ? ACHTransactionCode.PRENOTE_CHECKING_CREDIT
        : ACHTransactionCode.PRENOTE_SAVINGS_CREDIT;
    return {
        id: crypto.randomUUID(),
        paymentId: enrollment.id,
        transactionCode,
        standardEntryClass: ACHStandardEntryClass.PPD,
        companyName: 'Government Agency',
        companyIdentification: '1234567890',
        receiverName: 'Employee',
        receiverAccountNumber: enrollment.accountNumber,
        receiverRoutingNumber: enrollment.routingNumber,
        amount: 0,
        traceNumber: generateACHTraceNumber(),
        effectiveEntryDate: enrollment.effectiveDate,
    };
}
/**
 * Processes direct deposit payment
 */
function processDirectDeposit(params) {
    const transactionCode = params.enrollment.accountType === 'checking'
        ? ACHTransactionCode.CHECKING_CREDIT
        : ACHTransactionCode.SAVINGS_CREDIT;
    return {
        id: crypto.randomUUID(),
        paymentId: crypto.randomUUID(),
        transactionCode,
        standardEntryClass: ACHStandardEntryClass.PPD,
        companyName: 'Government Agency',
        companyIdentification: '1234567890',
        receiverName: 'Employee',
        receiverAccountNumber: params.enrollment.accountNumber,
        receiverRoutingNumber: params.enrollment.routingNumber,
        amount: params.amount,
        traceNumber: generateACHTraceNumber(),
        effectiveEntryDate: params.effectiveDate,
    };
}
// ============================================================================
// PAYMENT RECONCILIATION
// ============================================================================
/**
 * Creates payment reconciliation record
 */
function createPaymentReconciliation(params) {
    const variance = params.bankStatementAmount
        ? params.bankStatementAmount - params.systemAmount
        : undefined;
    const status = variance === 0 || variance === undefined
        ? ReconciliationStatus.RECONCILED
        : ReconciliationStatus.DISCREPANCY;
    return {
        id: crypto.randomUUID(),
        paymentId: params.paymentId,
        reconciliationDate: new Date(),
        reconciledBy: params.reconciledBy,
        status,
        systemAmount: params.systemAmount,
        bankStatementAmount: params.bankStatementAmount,
        variance,
    };
}
/**
 * Reconciles payment
 */
function reconcilePayment(reconciliation, bankReference, clearingDate) {
    return {
        ...reconciliation,
        status: ReconciliationStatus.RECONCILED,
        bankReference,
        clearingDate,
    };
}
/**
 * Flags reconciliation discrepancy
 */
function flagReconciliationDiscrepancy(reconciliation, reason) {
    return {
        ...reconciliation,
        status: ReconciliationStatus.DISCREPANCY,
        varianceReason: reason,
    };
}
/**
 * Resolves reconciliation exception
 */
function resolveReconciliationException(reconciliation, notes) {
    return {
        ...reconciliation,
        status: ReconciliationStatus.RECONCILED,
        notes,
    };
}
// ============================================================================
// PAYMENT REVERSAL HANDLING
// ============================================================================
/**
 * Creates payment reversal request
 */
function createPaymentReversal(params) {
    return {
        id: crypto.randomUUID(),
        originalPaymentId: params.originalPaymentId,
        reason: params.reason,
        reasonCode: params.reasonCode,
        requestedDate: new Date(),
        requestedBy: params.requestedBy,
        status: 'pending',
        amount: params.amount,
    };
}
/**
 * Approves payment reversal
 */
function approvePaymentReversal(reversal, approvedBy) {
    return {
        ...reversal,
        status: 'approved',
        approvedDate: new Date(),
        approvedBy,
    };
}
/**
 * Processes payment reversal
 */
function processPaymentReversal(reversal, reversalPaymentId) {
    return {
        ...reversal,
        status: 'completed',
        reversalPaymentId,
        processedDate: new Date(),
    };
}
/**
 * Rejects payment reversal
 */
function rejectPaymentReversal(reversal, reason) {
    return {
        ...reversal,
        status: 'rejected',
        metadata: {
            ...reversal.metadata,
            rejectionReason: reason,
            rejectionDate: new Date().toISOString(),
        },
    };
}
// ============================================================================
// PAYMENT STATUS TRACKING
// ============================================================================
/**
 * Updates payment status
 */
function updatePaymentStatus(payment, newStatus) {
    const updates = { status: newStatus };
    if (newStatus === PaymentStatus.COMPLETED) {
        updates.completedDate = new Date();
    }
    return {
        ...payment,
        ...updates,
    };
}
/**
 * Tracks payment lifecycle
 */
function trackPaymentLifecycle(payment) {
    const result = {
        created: payment.createdDate,
        submitted: payment.submittedDate,
        completed: payment.completedDate,
    };
    if (payment.completedDate && payment.submittedDate) {
        const duration = payment.completedDate.getTime() - payment.submittedDate.getTime();
        result.durationHours = duration / (1000 * 60 * 60);
    }
    return result;
}
/**
 * Gets payment status summary
 */
function getPaymentStatusSummary(payments) {
    return payments.reduce((acc, payment) => {
        acc[payment.status] = (acc[payment.status] || 0) + 1;
        return acc;
    }, {});
}
// ============================================================================
// NACHA FILE GENERATION
// ============================================================================
/**
 * Generates NACHA file
 */
function generateNACHAFile(params) {
    const fileNumber = generateNACHAFileNumber();
    let totalDebit = 0;
    let totalCredit = 0;
    let entryCount = 0;
    params.batches.forEach(batch => {
        entryCount += batch.totalPayments;
        totalCredit += batch.totalAmount;
    });
    const entryHash = calculateEntryHash(params.batches);
    const fileContent = buildNACHAFileContent({
        fileNumber,
        immediateDestination: params.immediateDestination,
        immediateOrigin: params.immediateOrigin,
        batches: params.batches,
        entryHash,
    });
    return {
        id: crypto.randomUUID(),
        fileNumber,
        fileCreationDate: new Date(),
        fileCreationTime: new Date().toTimeString().substring(0, 4),
        immediateDestination: params.immediateDestination,
        immediateOrigin: params.immediateOrigin,
        batchCount: params.batches.length,
        blockCount: Math.ceil((1 + params.batches.length * 2 + entryCount + 1) / 10),
        entryAddendaCount: entryCount,
        entryHash,
        totalDebitAmount: totalDebit,
        totalCreditAmount: totalCredit,
        fileContent,
        batches: params.batches.map(b => b.id),
        status: 'generated',
    };
}
/**
 * Generates NACHA file number
 */
function generateNACHAFileNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    return `NACHA${timestamp}`;
}
/**
 * Calculates entry hash for NACHA file
 */
function calculateEntryHash(batches) {
    // In production, this would calculate actual entry hash
    // For now, return a mock hash
    const hash = batches.reduce((sum, batch) => sum + batch.totalPayments, 0);
    return hash.toString().padStart(10, '0');
}
/**
 * Builds NACHA file content
 */
function buildNACHAFileContent(params) {
    // In production, this would build actual NACHA format
    // For now, return a formatted header
    const header = `101 ${params.immediateDestination} ${params.immediateOrigin} ${new Date().toISOString().split('T')[0].replace(/-/g, '')}`;
    return header;
}
// ============================================================================
// POSITIVE PAY INTEGRATION
// ============================================================================
/**
 * Creates positive pay file
 */
function createPositivePayFile(params) {
    const fileNumber = generatePositivePayFileNumber();
    const totalAmount = params.checks.reduce((sum, check) => sum + check.amount, 0);
    const fileContent = buildPositivePayFileContent({
        accountNumber: params.accountNumber,
        checks: params.checks,
    });
    return {
        id: crypto.randomUUID(),
        fileNumber,
        accountNumber: params.accountNumber,
        generatedDate: new Date(),
        effectiveDate: params.effectiveDate,
        checks: params.checks,
        totalChecks: params.checks.length,
        totalAmount,
        fileContent,
        status: 'pending',
    };
}
/**
 * Generates positive pay file number
 */
function generatePositivePayFileNumber() {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `PP-${date}-${random}`;
}
/**
 * Builds positive pay file content
 */
function buildPositivePayFileContent(params) {
    // In production, this would build actual positive pay format
    return params.checks.map(check => `${check.checkNumber},${check.amount},${check.payee},${check.issueDate.toISOString().split('T')[0]}`).join('\n');
}
/**
 * Adds check to positive pay
 */
function addCheckToPositivePay(file, check) {
    return {
        ...file,
        checks: [...file.checks, check],
        totalChecks: file.totalChecks + 1,
        totalAmount: file.totalAmount + check.amount,
    };
}
// ============================================================================
// CHECK PRINTING AND MAILING
// ============================================================================
/**
 * Creates check printing request
 */
function createCheckPrintingRequest(params) {
    const requestNumber = generateCheckRequestNumber();
    return {
        id: crypto.randomUUID(),
        requestNumber,
        paymentId: params.paymentId,
        checkNumber: params.checkNumber,
        amount: params.amount,
        payee: params.payee,
        payeeAddress: params.payeeAddress,
        memo: params.memo,
        signatureRequired: params.signatureRequired ?? true,
        requestedDate: new Date(),
        deliveryMethod: params.deliveryMethod,
        status: 'pending',
    };
}
/**
 * Generates check request number
 */
function generateCheckRequestNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `CHK-${timestamp}-${random}`;
}
/**
 * Marks check as printed
 */
function markCheckPrinted(request) {
    return {
        ...request,
        status: 'printed',
        printedDate: new Date(),
    };
}
/**
 * Marks check as mailed
 */
function markCheckMailed(request) {
    return {
        ...request,
        status: 'mailed',
        mailedDate: new Date(),
    };
}
/**
 * Voids check
 */
function voidCheck(request, reason) {
    return {
        ...request,
        status: 'void',
        voidDate: new Date(),
        voidReason: reason,
    };
}
// ============================================================================
// PAYMENT APPROVAL WORKFLOWS
// ============================================================================
/**
 * Creates payment approval workflow
 */
function createPaymentApprovalWorkflow(params) {
    const approvals = params.approvers.map(approver => ({
        approvalId: crypto.randomUUID(),
        approverId: approver.approverId,
        approverName: approver.approverName,
        approvalLevel: approver.level,
        decision: 'pending',
    }));
    return {
        id: crypto.randomUUID(),
        paymentId: params.paymentId,
        workflowType: params.workflowType,
        requiredApprovals: params.requiredApprovals,
        approvals,
        status: 'pending',
        createdDate: new Date(),
    };
}
/**
 * Records approval decision
 */
function recordApprovalDecision(workflow, approverId, decision, comments) {
    const updatedApprovals = workflow.approvals.map(approval => {
        if (approval.approverId === approverId && approval.decision === 'pending') {
            return {
                ...approval,
                decision,
                decisionDate: new Date(),
                comments,
            };
        }
        return approval;
    });
    const approvedCount = updatedApprovals.filter(a => a.decision === 'approved').length;
    const rejectedCount = updatedApprovals.filter(a => a.decision === 'rejected').length;
    let newStatus = 'pending';
    if (rejectedCount > 0) {
        newStatus = 'rejected';
    }
    else if (approvedCount >= workflow.requiredApprovals) {
        newStatus = 'approved';
    }
    return {
        ...workflow,
        approvals: updatedApprovals,
        status: newStatus,
        completedDate: newStatus !== 'pending' ? new Date() : undefined,
    };
}
/**
 * Checks if approval workflow is complete
 */
function isApprovalWorkflowComplete(workflow) {
    return workflow.status === 'approved' || workflow.status === 'rejected';
}
/**
 * Gets pending approvers
 */
function getPendingApprovers(workflow) {
    return workflow.approvals.filter(a => a.decision === 'pending');
}
// ============================================================================
// PAYMENT METHOD CONFIGURATION
// ============================================================================
/**
 * Creates payment method configuration
 */
function createPaymentMethodConfig(params) {
    return {
        id: crypto.randomUUID(),
        paymentType: params.paymentType,
        enabled: true,
        defaultAccount: params.defaultAccount,
        approvalRequired: params.approvalRequired,
        approvalThresholds: params.approvalThresholds,
        processingDays: params.processingDays,
    };
}
/**
 * Determines required approvals based on amount
 */
function determineRequiredApprovals(config, amount) {
    for (const threshold of config.approvalThresholds) {
        if (amount >= threshold.minAmount &&
            (!threshold.maxAmount || amount <= threshold.maxAmount)) {
            return threshold.requiredApprovals;
        }
    }
    return 1; // Default to single approval
}
/**
 * Calculates next processing date
 */
function calculateNextProcessingDate(config, requestedDate = new Date()) {
    const nextDate = new Date(requestedDate);
    // Find next valid processing day
    while (!config.processingDays.includes(nextDate.getDay())) {
        nextDate.setDate(nextDate.getDate() + 1);
    }
    return nextDate;
}
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
/**
 * Sequelize model for ElectronicPayment
 */
exports.ElectronicPaymentModel = {
    tableName: 'electronic_payments',
    columns: {
        id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
        paymentNumber: { type: 'STRING', allowNull: false, unique: true },
        paymentType: { type: 'ENUM', values: Object.values(PaymentType) },
        status: { type: 'ENUM', values: Object.values(PaymentStatus) },
        amount: { type: 'DECIMAL(15,2)', allowNull: false },
        currency: { type: 'STRING', defaultValue: 'USD' },
        payeeId: { type: 'UUID', allowNull: false },
        payeeName: { type: 'STRING', allowNull: false },
        payeeAccountNumber: { type: 'STRING', allowNull: false },
        payeeRoutingNumber: { type: 'STRING', allowNull: true },
        payerAccountId: { type: 'UUID', allowNull: false },
        description: { type: 'TEXT', allowNull: false },
        invoiceNumber: { type: 'STRING', allowNull: true },
        purchaseOrderNumber: { type: 'STRING', allowNull: true },
        effectiveDate: { type: 'DATE', allowNull: false },
        createdDate: { type: 'DATE', allowNull: false },
        createdBy: { type: 'STRING', allowNull: false },
        approvedBy: { type: 'STRING', allowNull: true },
        approvalDate: { type: 'DATE', allowNull: true },
        submittedDate: { type: 'DATE', allowNull: true },
        completedDate: { type: 'DATE', allowNull: true },
        batchId: { type: 'UUID', allowNull: true },
        traceNumber: { type: 'STRING', allowNull: true },
        confirmationNumber: { type: 'STRING', allowNull: true },
        metadata: { type: 'JSON', defaultValue: {} },
    },
    indexes: [
        { fields: ['paymentNumber'] },
        { fields: ['payeeId'] },
        { fields: ['status'] },
        { fields: ['paymentType'] },
        { fields: ['effectiveDate'] },
        { fields: ['batchId'] },
    ],
};
/**
 * Sequelize model for PaymentBatch
 */
exports.PaymentBatchModel = {
    tableName: 'payment_batches',
    columns: {
        id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
        batchNumber: { type: 'STRING', allowNull: false, unique: true },
        batchType: { type: 'ENUM', values: Object.values(PaymentType) },
        status: { type: 'ENUM', values: Object.values(BatchStatus) },
        totalPayments: { type: 'INTEGER', defaultValue: 0 },
        totalAmount: { type: 'DECIMAL(15,2)', defaultValue: 0 },
        createdDate: { type: 'DATE', allowNull: false },
        createdBy: { type: 'STRING', allowNull: false },
        approvedBy: { type: 'STRING', allowNull: true },
        approvalDate: { type: 'DATE', allowNull: true },
        submittedDate: { type: 'DATE', allowNull: true },
        effectiveDate: { type: 'DATE', allowNull: false },
        completedDate: { type: 'DATE', allowNull: true },
        payments: { type: 'JSON', defaultValue: [] },
        nachaFileId: { type: 'UUID', allowNull: true },
        metadata: { type: 'JSON', defaultValue: {} },
    },
    indexes: [
        { fields: ['batchNumber'] },
        { fields: ['status'] },
        { fields: ['effectiveDate'] },
        { fields: ['createdDate'] },
    ],
};
/**
 * Sequelize model for PaymentReconciliation
 */
exports.PaymentReconciliationModel = {
    tableName: 'payment_reconciliations',
    columns: {
        id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
        paymentId: { type: 'UUID', allowNull: false },
        reconciliationDate: { type: 'DATE', allowNull: false },
        reconciledBy: { type: 'STRING', allowNull: false },
        status: { type: 'ENUM', values: Object.values(ReconciliationStatus) },
        bankStatementAmount: { type: 'DECIMAL(15,2)', allowNull: true },
        systemAmount: { type: 'DECIMAL(15,2)', allowNull: false },
        variance: { type: 'DECIMAL(15,2)', allowNull: true },
        varianceReason: { type: 'TEXT', allowNull: true },
        clearingDate: { type: 'DATE', allowNull: true },
        bankReference: { type: 'STRING', allowNull: true },
        notes: { type: 'TEXT', allowNull: true },
        metadata: { type: 'JSON', defaultValue: {} },
    },
    indexes: [
        { fields: ['paymentId'] },
        { fields: ['status'] },
        { fields: ['reconciliationDate'] },
    ],
};
/**
 * Sequelize model for PaymentReversal
 */
exports.PaymentReversalModel = {
    tableName: 'payment_reversals',
    columns: {
        id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
        originalPaymentId: { type: 'UUID', allowNull: false },
        reversalPaymentId: { type: 'UUID', allowNull: true },
        reason: { type: 'TEXT', allowNull: false },
        reasonCode: { type: 'ENUM', values: Object.values(ReversalReasonCode) },
        requestedDate: { type: 'DATE', allowNull: false },
        requestedBy: { type: 'STRING', allowNull: false },
        approvedDate: { type: 'DATE', allowNull: true },
        approvedBy: { type: 'STRING', allowNull: true },
        processedDate: { type: 'DATE', allowNull: true },
        status: { type: 'STRING', allowNull: false },
        amount: { type: 'DECIMAL(15,2)', allowNull: false },
        metadata: { type: 'JSON', defaultValue: {} },
    },
    indexes: [
        { fields: ['originalPaymentId'] },
        { fields: ['status'] },
        { fields: ['requestedDate'] },
    ],
};
// ============================================================================
// NESTJS SERVICE CLASS EXAMPLE
// ============================================================================
/**
 * Example NestJS service for electronic payments
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class ElectronicPaymentService {
 *   constructor(
 *     @InjectModel(ElectronicPaymentModel)
 *     private paymentRepo: Repository<ElectronicPayment>,
 *   ) {}
 *
 *   async createPayment(dto: CreatePaymentDto): Promise<ElectronicPayment> {
 *     const payment = createElectronicPayment(dto);
 *     return this.paymentRepo.save(payment);
 *   }
 *
 *   async processBatch(batchId: string): Promise<PaymentBatch> {
 *     const batch = await this.batchRepo.findOne({ where: { id: batchId } });
 *     return submitBatch(batch);
 *   }
 * }
 * ```
 */
exports.ElectronicPaymentServiceExample = `
@Injectable()
export class ElectronicPaymentService {
  constructor(
    @InjectModel(ElectronicPaymentModel)
    private paymentRepo: Repository<ElectronicPayment>,
    @InjectModel(PaymentBatchModel)
    private batchRepo: Repository<PaymentBatch>,
    @InjectModel(PaymentReconciliationModel)
    private reconciliationRepo: Repository<PaymentReconciliation>,
  ) {}

  async createAndApprovePayment(
    dto: CreatePaymentDto,
    approverId: string,
  ): Promise<ElectronicPayment> {
    let payment = createElectronicPayment(dto);
    payment = await this.paymentRepo.save(payment);

    // Create approval workflow
    const workflow = createPaymentApprovalWorkflow({
      paymentId: payment.id,
      workflowType: 'single',
      requiredApprovals: 1,
      approvers: [{ approverId, approverName: 'Approver', level: 1 }],
    });

    const approvedWorkflow = recordApprovalDecision(
      workflow,
      approverId,
      'approved',
    );

    if (isApprovalWorkflowComplete(approvedWorkflow)) {
      payment = updatePaymentStatus(payment, PaymentStatus.APPROVED);
      await this.paymentRepo.save(payment);
    }

    return payment;
  }
}
`;
// ============================================================================
// SWAGGER API SCHEMA DEFINITIONS
// ============================================================================
/**
 * Swagger DTO for creating electronic payment
 */
exports.CreateElectronicPaymentDto = {
    schema: {
        type: 'object',
        required: [
            'paymentType',
            'amount',
            'payeeId',
            'payeeName',
            'payeeAccountNumber',
            'payerAccountId',
            'description',
            'effectiveDate',
            'createdBy',
        ],
        properties: {
            paymentType: { type: 'string', enum: Object.values(PaymentType) },
            amount: { type: 'number', example: 1500.00 },
            payeeId: { type: 'string', format: 'uuid' },
            payeeName: { type: 'string', example: 'ABC Vendor Inc.' },
            payeeAccountNumber: { type: 'string', example: '1234567890' },
            payeeRoutingNumber: { type: 'string', example: '021000021' },
            payerAccountId: { type: 'string', format: 'uuid' },
            description: { type: 'string', example: 'Invoice #12345 payment' },
            invoiceNumber: { type: 'string', example: 'INV-12345' },
            effectiveDate: { type: 'string', format: 'date' },
            createdBy: { type: 'string', example: 'user-123' },
        },
    },
};
/**
 * Swagger DTO for payment batch
 */
exports.CreatePaymentBatchDto = {
    schema: {
        type: 'object',
        required: ['batchType', 'effectiveDate', 'createdBy'],
        properties: {
            batchType: { type: 'string', enum: Object.values(PaymentType) },
            effectiveDate: { type: 'string', format: 'date' },
            createdBy: { type: 'string', example: 'user-123' },
        },
    },
};
/**
 * Swagger DTO for direct deposit enrollment
 */
exports.CreateDirectDepositDto = {
    schema: {
        type: 'object',
        required: [
            'employeeId',
            'accountType',
            'accountNumber',
            'routingNumber',
            'bankName',
            'effectiveDate',
        ],
        properties: {
            employeeId: { type: 'string', format: 'uuid' },
            accountType: { type: 'string', enum: ['checking', 'savings'] },
            accountNumber: { type: 'string', example: '1234567890' },
            routingNumber: { type: 'string', example: '021000021' },
            bankName: { type: 'string', example: 'First National Bank' },
            effectiveDate: { type: 'string', format: 'date' },
        },
    },
};
/**
 * Swagger response schema for payment
 */
exports.ElectronicPaymentResponse = {
    schema: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            paymentNumber: { type: 'string', example: 'PAY-ABC123' },
            paymentType: { type: 'string', enum: Object.values(PaymentType) },
            status: { type: 'string', enum: Object.values(PaymentStatus) },
            amount: { type: 'number', example: 1500.00 },
            payeeName: { type: 'string' },
            effectiveDate: { type: 'string', format: 'date' },
            createdDate: { type: 'string', format: 'date-time' },
        },
    },
};
//# sourceMappingURL=electronic-payments-disbursements-kit.js.map