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
/**
 * Payment types
 */
export declare enum PaymentType {
    ACH_CREDIT = "ACH_CREDIT",
    ACH_DEBIT = "ACH_DEBIT",
    WIRE_TRANSFER = "WIRE_TRANSFER",
    CHECK = "CHECK",
    DIRECT_DEPOSIT = "DIRECT_DEPOSIT",
    EFT = "EFT",
    CARD_PAYMENT = "CARD_PAYMENT",
    VIRTUAL_CARD = "VIRTUAL_CARD"
}
/**
 * Payment status
 */
export declare enum PaymentStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    SUBMITTED = "SUBMITTED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REVERSED = "REVERSED",
    CANCELLED = "CANCELLED",
    ON_HOLD = "ON_HOLD"
}
/**
 * ACH transaction codes
 */
export declare enum ACHTransactionCode {
    CHECKING_CREDIT = "22",
    CHECKING_DEBIT = "27",
    SAVINGS_CREDIT = "32",
    SAVINGS_DEBIT = "37",
    PRENOTE_CHECKING_CREDIT = "23",
    PRENOTE_CHECKING_DEBIT = "28",
    PRENOTE_SAVINGS_CREDIT = "33",
    PRENOTE_SAVINGS_DEBIT = "38"
}
/**
 * ACH standard entry class codes
 */
export declare enum ACHStandardEntryClass {
    PPD = "PPD",// Prearranged Payment and Deposit
    CCD = "CCD",// Corporate Credit or Debit
    CTX = "CTX",// Corporate Trade Exchange
    WEB = "WEB",// Internet-Initiated Entry
    TEL = "TEL",// Telephone-Initiated Entry
    POP = "POP",// Point of Purchase
    ARC = "ARC",// Accounts Receivable Entry
    BOC = "BOC"
}
/**
 * Batch status
 */
export declare enum BatchStatus {
    CREATING = "CREATING",
    READY = "READY",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    SUBMITTED = "SUBMITTED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    PARTIALLY_COMPLETED = "PARTIALLY_COMPLETED"
}
/**
 * Reconciliation status
 */
export declare enum ReconciliationStatus {
    UNRECONCILED = "UNRECONCILED",
    PENDING = "PENDING",
    RECONCILED = "RECONCILED",
    DISCREPANCY = "DISCREPANCY",
    EXCEPTION = "EXCEPTION"
}
/**
 * Payment priority
 */
export declare enum PaymentPriority {
    URGENT = "URGENT",
    HIGH = "HIGH",
    NORMAL = "NORMAL",
    LOW = "LOW"
}
/**
 * Electronic payment record
 */
export interface ElectronicPayment {
    id: string;
    paymentNumber: string;
    paymentType: PaymentType;
    status: PaymentStatus;
    amount: number;
    currency: string;
    payeeId: string;
    payeeName: string;
    payeeAccountNumber: string;
    payeeRoutingNumber?: string;
    payerAccountId: string;
    description: string;
    invoiceNumber?: string;
    purchaseOrderNumber?: string;
    effectiveDate: Date;
    createdDate: Date;
    createdBy: string;
    approvedBy?: string;
    approvalDate?: Date;
    submittedDate?: Date;
    completedDate?: Date;
    batchId?: string;
    traceNumber?: string;
    confirmationNumber?: string;
    metadata?: Record<string, any>;
}
/**
 * ACH payment details
 */
export interface ACHPayment {
    id: string;
    paymentId: string;
    transactionCode: ACHTransactionCode;
    standardEntryClass: ACHStandardEntryClass;
    companyName: string;
    companyIdentification: string;
    receiverName: string;
    receiverAccountNumber: string;
    receiverRoutingNumber: string;
    amount: number;
    addendaRecords?: ACHAddenda[];
    traceNumber: string;
    effectiveEntryDate: Date;
    discretionaryData?: string;
    metadata?: Record<string, any>;
}
/**
 * ACH addenda record
 */
export interface ACHAddenda {
    addendaTypeCode: string;
    paymentRelatedInformation: string;
    addendaSequenceNumber: number;
    entryDetailSequenceNumber: number;
}
/**
 * Wire transfer details
 */
export interface WireTransfer {
    id: string;
    paymentId: string;
    senderBank: BankInfo;
    receiverBank: BankInfo;
    beneficiary: BeneficiaryInfo;
    amount: number;
    currency: string;
    valueDate: Date;
    purpose: string;
    charges: 'OUR' | 'BEN' | 'SHA';
    reference: string;
    instructions?: string;
    swiftCode?: string;
    ibanNumber?: string;
    intermediaryBank?: BankInfo;
    metadata?: Record<string, any>;
}
/**
 * Bank information
 */
export interface BankInfo {
    bankName: string;
    routingNumber?: string;
    swiftCode?: string;
    accountNumber: string;
    address?: string;
}
/**
 * Beneficiary information
 */
export interface BeneficiaryInfo {
    name: string;
    accountNumber: string;
    address: string;
    bankName: string;
    routingNumber?: string;
    swiftCode?: string;
}
/**
 * Payment batch
 */
export interface PaymentBatch {
    id: string;
    batchNumber: string;
    batchType: PaymentType;
    status: BatchStatus;
    totalPayments: number;
    totalAmount: number;
    createdDate: Date;
    createdBy: string;
    approvedBy?: string;
    approvalDate?: Date;
    submittedDate?: Date;
    effectiveDate: Date;
    completedDate?: Date;
    payments: string[];
    nachaFileId?: string;
    metadata?: Record<string, any>;
}
/**
 * Direct deposit enrollment
 */
export interface DirectDepositEnrollment {
    id: string;
    employeeId: string;
    accountType: 'checking' | 'savings';
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    enrollmentDate: Date;
    effectiveDate: Date;
    status: 'active' | 'inactive' | 'pending' | 'suspended';
    verificationStatus: 'unverified' | 'pending' | 'verified' | 'failed';
    prenoteDate?: Date;
    prenoteStatus?: 'pending' | 'completed' | 'failed';
    metadata?: Record<string, any>;
}
/**
 * Payment reconciliation record
 */
export interface PaymentReconciliation {
    id: string;
    paymentId: string;
    reconciliationDate: Date;
    reconciledBy: string;
    status: ReconciliationStatus;
    bankStatementAmount?: number;
    systemAmount: number;
    variance?: number;
    varianceReason?: string;
    clearingDate?: Date;
    bankReference?: string;
    notes?: string;
    metadata?: Record<string, any>;
}
/**
 * Payment reversal
 */
export interface PaymentReversal {
    id: string;
    originalPaymentId: string;
    reversalPaymentId?: string;
    reason: string;
    reasonCode: ReversalReasonCode;
    requestedDate: Date;
    requestedBy: string;
    approvedDate?: Date;
    approvedBy?: string;
    processedDate?: Date;
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'failed';
    amount: number;
    metadata?: Record<string, any>;
}
/**
 * Reversal reason codes
 */
export declare enum ReversalReasonCode {
    DUPLICATE_PAYMENT = "R01",
    INCORRECT_AMOUNT = "R02",
    INCORRECT_ACCOUNT = "R03",
    PAYEE_REQUEST = "R04",
    UNAUTHORIZED = "R05",
    RETURNED_BY_BANK = "R06",
    OTHER = "R99"
}
/**
 * NACHA file
 */
export interface NACHAFile {
    id: string;
    fileNumber: string;
    fileCreationDate: Date;
    fileCreationTime: string;
    immediateDestination: string;
    immediateOrigin: string;
    batchCount: number;
    blockCount: number;
    entryAddendaCount: number;
    entryHash: string;
    totalDebitAmount: number;
    totalCreditAmount: number;
    fileContent: string;
    batches: string[];
    status: 'generated' | 'transmitted' | 'acknowledged' | 'rejected';
    metadata?: Record<string, any>;
}
/**
 * Positive pay file
 */
export interface PositivePayFile {
    id: string;
    fileNumber: string;
    accountNumber: string;
    generatedDate: Date;
    effectiveDate: Date;
    checks: PositivePayCheck[];
    totalChecks: number;
    totalAmount: number;
    fileContent: string;
    transmittedDate?: Date;
    status: 'pending' | 'transmitted' | 'acknowledged';
    metadata?: Record<string, any>;
}
/**
 * Positive pay check
 */
export interface PositivePayCheck {
    checkNumber: string;
    amount: number;
    issueDate: Date;
    payee: string;
    accountNumber: string;
    voidIndicator: boolean;
}
/**
 * Check printing request
 */
export interface CheckPrintingRequest {
    id: string;
    requestNumber: string;
    paymentId: string;
    checkNumber: string;
    amount: number;
    payee: string;
    payeeAddress: string;
    memo?: string;
    signatureRequired: boolean;
    requestedDate: Date;
    printedDate?: Date;
    mailedDate?: Date;
    deliveryMethod: 'mail' | 'pickup' | 'courier';
    status: 'pending' | 'printed' | 'mailed' | 'delivered' | 'void';
    voidDate?: Date;
    voidReason?: string;
    metadata?: Record<string, any>;
}
/**
 * Payment approval workflow
 */
export interface PaymentApprovalWorkflow {
    id: string;
    paymentId: string;
    workflowType: 'single' | 'dual' | 'multi';
    requiredApprovals: number;
    approvals: ApprovalRecord[];
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    createdDate: Date;
    completedDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Approval record
 */
export interface ApprovalRecord {
    approvalId: string;
    approverId: string;
    approverName: string;
    approvalLevel: number;
    decision: 'pending' | 'approved' | 'rejected';
    decisionDate?: Date;
    comments?: string;
}
/**
 * Payment method configuration
 */
export interface PaymentMethodConfig {
    id: string;
    paymentType: PaymentType;
    enabled: boolean;
    minAmount?: number;
    maxAmount?: number;
    defaultAccount: string;
    approvalRequired: boolean;
    approvalThresholds: ApprovalThreshold[];
    processingDays: number[];
    cutoffTime?: string;
    metadata?: Record<string, any>;
}
/**
 * Approval threshold
 */
export interface ApprovalThreshold {
    minAmount: number;
    maxAmount?: number;
    requiredApprovals: number;
    approverRoles: string[];
}
/**
 * Creates an electronic payment
 */
export declare function createElectronicPayment(params: {
    paymentType: PaymentType;
    amount: number;
    payeeId: string;
    payeeName: string;
    payeeAccountNumber: string;
    payeeRoutingNumber?: string;
    payerAccountId: string;
    description: string;
    effectiveDate: Date;
    createdBy: string;
    invoiceNumber?: string;
}): ElectronicPayment;
/**
 * Generates payment number
 */
export declare function generatePaymentNumber(): string;
/**
 * Creates ACH payment details
 */
export declare function createACHPayment(params: {
    paymentId: string;
    transactionCode: ACHTransactionCode;
    standardEntryClass: ACHStandardEntryClass;
    companyName: string;
    companyIdentification: string;
    receiverName: string;
    receiverAccountNumber: string;
    receiverRoutingNumber: string;
    amount: number;
    effectiveEntryDate: Date;
}): ACHPayment;
/**
 * Generates ACH trace number
 */
export declare function generateACHTraceNumber(): string;
/**
 * Validates routing number (ABA routing number)
 */
export declare function validateRoutingNumber(routingNumber: string): boolean;
/**
 * Validates account number format
 */
export declare function validateAccountNumber(accountNumber: string): {
    valid: boolean;
    error?: string;
};
/**
 * Initiates electronic funds transfer
 */
export declare function initiateEFT(params: {
    amount: number;
    fromAccount: string;
    toAccount: string;
    toRoutingNumber: string;
    beneficiaryName: string;
    description: string;
    effectiveDate: Date;
    createdBy: string;
}): ElectronicPayment;
/**
 * Processes EFT transaction
 */
export declare function processEFT(payment: ElectronicPayment): ElectronicPayment;
/**
 * Creates wire transfer
 */
export declare function createWireTransfer(params: {
    paymentId: string;
    senderBank: BankInfo;
    receiverBank: BankInfo;
    beneficiary: BeneficiaryInfo;
    amount: number;
    currency: string;
    valueDate: Date;
    purpose: string;
    charges?: 'OUR' | 'BEN' | 'SHA';
}): WireTransfer;
/**
 * Generates wire transfer reference
 */
export declare function generateWireReference(): string;
/**
 * Validates SWIFT code
 */
export declare function validateSWIFTCode(swiftCode: string): boolean;
/**
 * Validates IBAN
 */
export declare function validateIBAN(iban: string): boolean;
/**
 * Creates payment batch
 */
export declare function createPaymentBatch(params: {
    batchType: PaymentType;
    effectiveDate: Date;
    createdBy: string;
}): PaymentBatch;
/**
 * Generates batch number
 */
export declare function generateBatchNumber(): string;
/**
 * Adds payment to batch
 */
export declare function addPaymentToBatch(batch: PaymentBatch, payment: ElectronicPayment): PaymentBatch;
/**
 * Finalizes batch for submission
 */
export declare function finalizeBatch(batch: PaymentBatch): PaymentBatch;
/**
 * Approves payment batch
 */
export declare function approveBatch(batch: PaymentBatch, approvedBy: string): PaymentBatch;
/**
 * Submits batch for processing
 */
export declare function submitBatch(batch: PaymentBatch): PaymentBatch;
/**
 * Creates direct deposit enrollment
 */
export declare function createDirectDepositEnrollment(params: {
    employeeId: string;
    accountType: 'checking' | 'savings';
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    effectiveDate: Date;
}): DirectDepositEnrollment;
/**
 * Verifies direct deposit account
 */
export declare function verifyDirectDepositAccount(enrollment: DirectDepositEnrollment): DirectDepositEnrollment;
/**
 * Creates prenote for direct deposit
 */
export declare function createPrenote(enrollment: DirectDepositEnrollment): ACHPayment;
/**
 * Processes direct deposit payment
 */
export declare function processDirectDeposit(params: {
    enrollment: DirectDepositEnrollment;
    amount: number;
    description: string;
    effectiveDate: Date;
}): ACHPayment;
/**
 * Creates payment reconciliation record
 */
export declare function createPaymentReconciliation(params: {
    paymentId: string;
    reconciledBy: string;
    systemAmount: number;
    bankStatementAmount?: number;
}): PaymentReconciliation;
/**
 * Reconciles payment
 */
export declare function reconcilePayment(reconciliation: PaymentReconciliation, bankReference: string, clearingDate: Date): PaymentReconciliation;
/**
 * Flags reconciliation discrepancy
 */
export declare function flagReconciliationDiscrepancy(reconciliation: PaymentReconciliation, reason: string): PaymentReconciliation;
/**
 * Resolves reconciliation exception
 */
export declare function resolveReconciliationException(reconciliation: PaymentReconciliation, notes: string): PaymentReconciliation;
/**
 * Creates payment reversal request
 */
export declare function createPaymentReversal(params: {
    originalPaymentId: string;
    reason: string;
    reasonCode: ReversalReasonCode;
    requestedBy: string;
    amount: number;
}): PaymentReversal;
/**
 * Approves payment reversal
 */
export declare function approvePaymentReversal(reversal: PaymentReversal, approvedBy: string): PaymentReversal;
/**
 * Processes payment reversal
 */
export declare function processPaymentReversal(reversal: PaymentReversal, reversalPaymentId: string): PaymentReversal;
/**
 * Rejects payment reversal
 */
export declare function rejectPaymentReversal(reversal: PaymentReversal, reason: string): PaymentReversal;
/**
 * Updates payment status
 */
export declare function updatePaymentStatus(payment: ElectronicPayment, newStatus: PaymentStatus): ElectronicPayment;
/**
 * Tracks payment lifecycle
 */
export declare function trackPaymentLifecycle(payment: ElectronicPayment): {
    created: Date;
    submitted?: Date;
    completed?: Date;
    durationHours?: number;
};
/**
 * Gets payment status summary
 */
export declare function getPaymentStatusSummary(payments: ElectronicPayment[]): Record<PaymentStatus, number>;
/**
 * Generates NACHA file
 */
export declare function generateNACHAFile(params: {
    batches: PaymentBatch[];
    immediateDestination: string;
    immediateOrigin: string;
}): NACHAFile;
/**
 * Generates NACHA file number
 */
export declare function generateNACHAFileNumber(): string;
/**
 * Calculates entry hash for NACHA file
 */
export declare function calculateEntryHash(batches: PaymentBatch[]): string;
/**
 * Builds NACHA file content
 */
export declare function buildNACHAFileContent(params: {
    fileNumber: string;
    immediateDestination: string;
    immediateOrigin: string;
    batches: PaymentBatch[];
    entryHash: string;
}): string;
/**
 * Creates positive pay file
 */
export declare function createPositivePayFile(params: {
    accountNumber: string;
    checks: PositivePayCheck[];
    effectiveDate: Date;
}): PositivePayFile;
/**
 * Generates positive pay file number
 */
export declare function generatePositivePayFileNumber(): string;
/**
 * Builds positive pay file content
 */
export declare function buildPositivePayFileContent(params: {
    accountNumber: string;
    checks: PositivePayCheck[];
}): string;
/**
 * Adds check to positive pay
 */
export declare function addCheckToPositivePay(file: PositivePayFile, check: PositivePayCheck): PositivePayFile;
/**
 * Creates check printing request
 */
export declare function createCheckPrintingRequest(params: {
    paymentId: string;
    checkNumber: string;
    amount: number;
    payee: string;
    payeeAddress: string;
    memo?: string;
    deliveryMethod: 'mail' | 'pickup' | 'courier';
    signatureRequired?: boolean;
}): CheckPrintingRequest;
/**
 * Generates check request number
 */
export declare function generateCheckRequestNumber(): string;
/**
 * Marks check as printed
 */
export declare function markCheckPrinted(request: CheckPrintingRequest): CheckPrintingRequest;
/**
 * Marks check as mailed
 */
export declare function markCheckMailed(request: CheckPrintingRequest): CheckPrintingRequest;
/**
 * Voids check
 */
export declare function voidCheck(request: CheckPrintingRequest, reason: string): CheckPrintingRequest;
/**
 * Creates payment approval workflow
 */
export declare function createPaymentApprovalWorkflow(params: {
    paymentId: string;
    workflowType: 'single' | 'dual' | 'multi';
    requiredApprovals: number;
    approvers: Array<{
        approverId: string;
        approverName: string;
        level: number;
    }>;
}): PaymentApprovalWorkflow;
/**
 * Records approval decision
 */
export declare function recordApprovalDecision(workflow: PaymentApprovalWorkflow, approverId: string, decision: 'approved' | 'rejected', comments?: string): PaymentApprovalWorkflow;
/**
 * Checks if approval workflow is complete
 */
export declare function isApprovalWorkflowComplete(workflow: PaymentApprovalWorkflow): boolean;
/**
 * Gets pending approvers
 */
export declare function getPendingApprovers(workflow: PaymentApprovalWorkflow): ApprovalRecord[];
/**
 * Creates payment method configuration
 */
export declare function createPaymentMethodConfig(params: {
    paymentType: PaymentType;
    defaultAccount: string;
    approvalRequired: boolean;
    approvalThresholds: ApprovalThreshold[];
    processingDays: number[];
}): PaymentMethodConfig;
/**
 * Determines required approvals based on amount
 */
export declare function determineRequiredApprovals(config: PaymentMethodConfig, amount: number): number;
/**
 * Calculates next processing date
 */
export declare function calculateNextProcessingDate(config: PaymentMethodConfig, requestedDate?: Date): Date;
/**
 * Sequelize model for ElectronicPayment
 */
export declare const ElectronicPaymentModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        paymentNumber: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        paymentType: {
            type: string;
            values: PaymentType[];
        };
        status: {
            type: string;
            values: PaymentStatus[];
        };
        amount: {
            type: string;
            allowNull: boolean;
        };
        currency: {
            type: string;
            defaultValue: string;
        };
        payeeId: {
            type: string;
            allowNull: boolean;
        };
        payeeName: {
            type: string;
            allowNull: boolean;
        };
        payeeAccountNumber: {
            type: string;
            allowNull: boolean;
        };
        payeeRoutingNumber: {
            type: string;
            allowNull: boolean;
        };
        payerAccountId: {
            type: string;
            allowNull: boolean;
        };
        description: {
            type: string;
            allowNull: boolean;
        };
        invoiceNumber: {
            type: string;
            allowNull: boolean;
        };
        purchaseOrderNumber: {
            type: string;
            allowNull: boolean;
        };
        effectiveDate: {
            type: string;
            allowNull: boolean;
        };
        createdDate: {
            type: string;
            allowNull: boolean;
        };
        createdBy: {
            type: string;
            allowNull: boolean;
        };
        approvedBy: {
            type: string;
            allowNull: boolean;
        };
        approvalDate: {
            type: string;
            allowNull: boolean;
        };
        submittedDate: {
            type: string;
            allowNull: boolean;
        };
        completedDate: {
            type: string;
            allowNull: boolean;
        };
        batchId: {
            type: string;
            allowNull: boolean;
        };
        traceNumber: {
            type: string;
            allowNull: boolean;
        };
        confirmationNumber: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
    };
    indexes: {
        fields: string[];
    }[];
};
/**
 * Sequelize model for PaymentBatch
 */
export declare const PaymentBatchModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        batchNumber: {
            type: string;
            allowNull: boolean;
            unique: boolean;
        };
        batchType: {
            type: string;
            values: PaymentType[];
        };
        status: {
            type: string;
            values: BatchStatus[];
        };
        totalPayments: {
            type: string;
            defaultValue: number;
        };
        totalAmount: {
            type: string;
            defaultValue: number;
        };
        createdDate: {
            type: string;
            allowNull: boolean;
        };
        createdBy: {
            type: string;
            allowNull: boolean;
        };
        approvedBy: {
            type: string;
            allowNull: boolean;
        };
        approvalDate: {
            type: string;
            allowNull: boolean;
        };
        submittedDate: {
            type: string;
            allowNull: boolean;
        };
        effectiveDate: {
            type: string;
            allowNull: boolean;
        };
        completedDate: {
            type: string;
            allowNull: boolean;
        };
        payments: {
            type: string;
            defaultValue: never[];
        };
        nachaFileId: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
    };
    indexes: {
        fields: string[];
    }[];
};
/**
 * Sequelize model for PaymentReconciliation
 */
export declare const PaymentReconciliationModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        paymentId: {
            type: string;
            allowNull: boolean;
        };
        reconciliationDate: {
            type: string;
            allowNull: boolean;
        };
        reconciledBy: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            values: ReconciliationStatus[];
        };
        bankStatementAmount: {
            type: string;
            allowNull: boolean;
        };
        systemAmount: {
            type: string;
            allowNull: boolean;
        };
        variance: {
            type: string;
            allowNull: boolean;
        };
        varianceReason: {
            type: string;
            allowNull: boolean;
        };
        clearingDate: {
            type: string;
            allowNull: boolean;
        };
        bankReference: {
            type: string;
            allowNull: boolean;
        };
        notes: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
    };
    indexes: {
        fields: string[];
    }[];
};
/**
 * Sequelize model for PaymentReversal
 */
export declare const PaymentReversalModel: {
    tableName: string;
    columns: {
        id: {
            type: string;
            primaryKey: boolean;
            defaultValue: string;
        };
        originalPaymentId: {
            type: string;
            allowNull: boolean;
        };
        reversalPaymentId: {
            type: string;
            allowNull: boolean;
        };
        reason: {
            type: string;
            allowNull: boolean;
        };
        reasonCode: {
            type: string;
            values: ReversalReasonCode[];
        };
        requestedDate: {
            type: string;
            allowNull: boolean;
        };
        requestedBy: {
            type: string;
            allowNull: boolean;
        };
        approvedDate: {
            type: string;
            allowNull: boolean;
        };
        approvedBy: {
            type: string;
            allowNull: boolean;
        };
        processedDate: {
            type: string;
            allowNull: boolean;
        };
        status: {
            type: string;
            allowNull: boolean;
        };
        amount: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            defaultValue: {};
        };
    };
    indexes: {
        fields: string[];
    }[];
};
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
export declare const ElectronicPaymentServiceExample = "\n@Injectable()\nexport class ElectronicPaymentService {\n  constructor(\n    @InjectModel(ElectronicPaymentModel)\n    private paymentRepo: Repository<ElectronicPayment>,\n    @InjectModel(PaymentBatchModel)\n    private batchRepo: Repository<PaymentBatch>,\n    @InjectModel(PaymentReconciliationModel)\n    private reconciliationRepo: Repository<PaymentReconciliation>,\n  ) {}\n\n  async createAndApprovePayment(\n    dto: CreatePaymentDto,\n    approverId: string,\n  ): Promise<ElectronicPayment> {\n    let payment = createElectronicPayment(dto);\n    payment = await this.paymentRepo.save(payment);\n\n    // Create approval workflow\n    const workflow = createPaymentApprovalWorkflow({\n      paymentId: payment.id,\n      workflowType: 'single',\n      requiredApprovals: 1,\n      approvers: [{ approverId, approverName: 'Approver', level: 1 }],\n    });\n\n    const approvedWorkflow = recordApprovalDecision(\n      workflow,\n      approverId,\n      'approved',\n    );\n\n    if (isApprovalWorkflowComplete(approvedWorkflow)) {\n      payment = updatePaymentStatus(payment, PaymentStatus.APPROVED);\n      await this.paymentRepo.save(payment);\n    }\n\n    return payment;\n  }\n}\n";
/**
 * Swagger DTO for creating electronic payment
 */
export declare const CreateElectronicPaymentDto: {
    schema: {
        type: string;
        required: string[];
        properties: {
            paymentType: {
                type: string;
                enum: PaymentType[];
            };
            amount: {
                type: string;
                example: number;
            };
            payeeId: {
                type: string;
                format: string;
            };
            payeeName: {
                type: string;
                example: string;
            };
            payeeAccountNumber: {
                type: string;
                example: string;
            };
            payeeRoutingNumber: {
                type: string;
                example: string;
            };
            payerAccountId: {
                type: string;
                format: string;
            };
            description: {
                type: string;
                example: string;
            };
            invoiceNumber: {
                type: string;
                example: string;
            };
            effectiveDate: {
                type: string;
                format: string;
            };
            createdBy: {
                type: string;
                example: string;
            };
        };
    };
};
/**
 * Swagger DTO for payment batch
 */
export declare const CreatePaymentBatchDto: {
    schema: {
        type: string;
        required: string[];
        properties: {
            batchType: {
                type: string;
                enum: PaymentType[];
            };
            effectiveDate: {
                type: string;
                format: string;
            };
            createdBy: {
                type: string;
                example: string;
            };
        };
    };
};
/**
 * Swagger DTO for direct deposit enrollment
 */
export declare const CreateDirectDepositDto: {
    schema: {
        type: string;
        required: string[];
        properties: {
            employeeId: {
                type: string;
                format: string;
            };
            accountType: {
                type: string;
                enum: string[];
            };
            accountNumber: {
                type: string;
                example: string;
            };
            routingNumber: {
                type: string;
                example: string;
            };
            bankName: {
                type: string;
                example: string;
            };
            effectiveDate: {
                type: string;
                format: string;
            };
        };
    };
};
/**
 * Swagger response schema for payment
 */
export declare const ElectronicPaymentResponse: {
    schema: {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
            };
            paymentNumber: {
                type: string;
                example: string;
            };
            paymentType: {
                type: string;
                enum: PaymentType[];
            };
            status: {
                type: string;
                enum: PaymentStatus[];
            };
            amount: {
                type: string;
                example: number;
            };
            payeeName: {
                type: string;
            };
            effectiveDate: {
                type: string;
                format: string;
            };
            createdDate: {
                type: string;
                format: string;
            };
        };
    };
};
//# sourceMappingURL=electronic-payments-disbursements-kit.d.ts.map