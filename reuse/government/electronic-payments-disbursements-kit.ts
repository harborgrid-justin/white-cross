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

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Payment types
 */
export enum PaymentType {
  ACH_CREDIT = 'ACH_CREDIT',
  ACH_DEBIT = 'ACH_DEBIT',
  WIRE_TRANSFER = 'WIRE_TRANSFER',
  CHECK = 'CHECK',
  DIRECT_DEPOSIT = 'DIRECT_DEPOSIT',
  EFT = 'EFT',
  CARD_PAYMENT = 'CARD_PAYMENT',
  VIRTUAL_CARD = 'VIRTUAL_CARD',
}

/**
 * Payment status
 */
export enum PaymentStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  SUBMITTED = 'SUBMITTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD',
}

/**
 * ACH transaction codes
 */
export enum ACHTransactionCode {
  CHECKING_CREDIT = '22',
  CHECKING_DEBIT = '27',
  SAVINGS_CREDIT = '32',
  SAVINGS_DEBIT = '37',
  PRENOTE_CHECKING_CREDIT = '23',
  PRENOTE_CHECKING_DEBIT = '28',
  PRENOTE_SAVINGS_CREDIT = '33',
  PRENOTE_SAVINGS_DEBIT = '38',
}

/**
 * ACH standard entry class codes
 */
export enum ACHStandardEntryClass {
  PPD = 'PPD', // Prearranged Payment and Deposit
  CCD = 'CCD', // Corporate Credit or Debit
  CTX = 'CTX', // Corporate Trade Exchange
  WEB = 'WEB', // Internet-Initiated Entry
  TEL = 'TEL', // Telephone-Initiated Entry
  POP = 'POP', // Point of Purchase
  ARC = 'ARC', // Accounts Receivable Entry
  BOC = 'BOC', // Back Office Conversion
}

/**
 * Batch status
 */
export enum BatchStatus {
  CREATING = 'CREATING',
  READY = 'READY',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  SUBMITTED = 'SUBMITTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PARTIALLY_COMPLETED = 'PARTIALLY_COMPLETED',
}

/**
 * Reconciliation status
 */
export enum ReconciliationStatus {
  UNRECONCILED = 'UNRECONCILED',
  PENDING = 'PENDING',
  RECONCILED = 'RECONCILED',
  DISCREPANCY = 'DISCREPANCY',
  EXCEPTION = 'EXCEPTION',
}

/**
 * Payment priority
 */
export enum PaymentPriority {
  URGENT = 'URGENT',
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW',
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
export enum ReversalReasonCode {
  DUPLICATE_PAYMENT = 'R01',
  INCORRECT_AMOUNT = 'R02',
  INCORRECT_ACCOUNT = 'R03',
  PAYEE_REQUEST = 'R04',
  UNAUTHORIZED = 'R05',
  RETURNED_BY_BANK = 'R06',
  OTHER = 'R99',
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

// ============================================================================
// ACH PAYMENT PROCESSING
// ============================================================================

/**
 * Creates an electronic payment
 */
export function createElectronicPayment(params: {
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
}): ElectronicPayment {
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
export function generatePaymentNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `PAY-${timestamp}-${random}`;
}

/**
 * Creates ACH payment details
 */
export function createACHPayment(params: {
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
}): ACHPayment {
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
export function generateACHTraceNumber(): string {
  const timestamp = Date.now().toString().slice(-7);
  const random = crypto.randomBytes(2).toString('hex');
  return timestamp + random;
}

/**
 * Validates routing number (ABA routing number)
 */
export function validateRoutingNumber(routingNumber: string): boolean {
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
export function validateAccountNumber(accountNumber: string): { valid: boolean; error?: string } {
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
export function initiateEFT(params: {
  amount: number;
  fromAccount: string;
  toAccount: string;
  toRoutingNumber: string;
  beneficiaryName: string;
  description: string;
  effectiveDate: Date;
  createdBy: string;
}): ElectronicPayment {
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
export function processEFT(
  payment: ElectronicPayment,
): ElectronicPayment {
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
export function createWireTransfer(params: {
  paymentId: string;
  senderBank: BankInfo;
  receiverBank: BankInfo;
  beneficiary: BeneficiaryInfo;
  amount: number;
  currency: string;
  valueDate: Date;
  purpose: string;
  charges?: 'OUR' | 'BEN' | 'SHA';
}): WireTransfer {
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
export function generateWireReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `WIRE${timestamp}${random}`;
}

/**
 * Validates SWIFT code
 */
export function validateSWIFTCode(swiftCode: string): boolean {
  // SWIFT codes are 8 or 11 characters
  const cleaned = swiftCode.toUpperCase().replace(/\s/g, '');
  const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  return swiftRegex.test(cleaned);
}

/**
 * Validates IBAN
 */
export function validateIBAN(iban: string): boolean {
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
export function createPaymentBatch(params: {
  batchType: PaymentType;
  effectiveDate: Date;
  createdBy: string;
}): PaymentBatch {
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
export function generateBatchNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `BATCH-${dateStr}-${random}`;
}

/**
 * Adds payment to batch
 */
export function addPaymentToBatch(
  batch: PaymentBatch,
  payment: ElectronicPayment,
): PaymentBatch {
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
export function finalizeBatch(
  batch: PaymentBatch,
): PaymentBatch {
  return {
    ...batch,
    status: BatchStatus.READY,
  };
}

/**
 * Approves payment batch
 */
export function approveBatch(
  batch: PaymentBatch,
  approvedBy: string,
): PaymentBatch {
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
export function submitBatch(
  batch: PaymentBatch,
): PaymentBatch {
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
export function createDirectDepositEnrollment(params: {
  employeeId: string;
  accountType: 'checking' | 'savings';
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  effectiveDate: Date;
}): DirectDepositEnrollment {
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
export function verifyDirectDepositAccount(
  enrollment: DirectDepositEnrollment,
): DirectDepositEnrollment {
  return {
    ...enrollment,
    verificationStatus: 'verified',
    status: 'active',
  };
}

/**
 * Creates prenote for direct deposit
 */
export function createPrenote(
  enrollment: DirectDepositEnrollment,
): ACHPayment {
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
export function processDirectDeposit(params: {
  enrollment: DirectDepositEnrollment;
  amount: number;
  description: string;
  effectiveDate: Date;
}): ACHPayment {
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
export function createPaymentReconciliation(params: {
  paymentId: string;
  reconciledBy: string;
  systemAmount: number;
  bankStatementAmount?: number;
}): PaymentReconciliation {
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
export function reconcilePayment(
  reconciliation: PaymentReconciliation,
  bankReference: string,
  clearingDate: Date,
): PaymentReconciliation {
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
export function flagReconciliationDiscrepancy(
  reconciliation: PaymentReconciliation,
  reason: string,
): PaymentReconciliation {
  return {
    ...reconciliation,
    status: ReconciliationStatus.DISCREPANCY,
    varianceReason: reason,
  };
}

/**
 * Resolves reconciliation exception
 */
export function resolveReconciliationException(
  reconciliation: PaymentReconciliation,
  notes: string,
): PaymentReconciliation {
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
export function createPaymentReversal(params: {
  originalPaymentId: string;
  reason: string;
  reasonCode: ReversalReasonCode;
  requestedBy: string;
  amount: number;
}): PaymentReversal {
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
export function approvePaymentReversal(
  reversal: PaymentReversal,
  approvedBy: string,
): PaymentReversal {
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
export function processPaymentReversal(
  reversal: PaymentReversal,
  reversalPaymentId: string,
): PaymentReversal {
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
export function rejectPaymentReversal(
  reversal: PaymentReversal,
  reason: string,
): PaymentReversal {
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
export function updatePaymentStatus(
  payment: ElectronicPayment,
  newStatus: PaymentStatus,
): ElectronicPayment {
  const updates: Partial<ElectronicPayment> = { status: newStatus };

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
export function trackPaymentLifecycle(
  payment: ElectronicPayment,
): {
  created: Date;
  submitted?: Date;
  completed?: Date;
  durationHours?: number;
} {
  const result: any = {
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
export function getPaymentStatusSummary(
  payments: ElectronicPayment[],
): Record<PaymentStatus, number> {
  return payments.reduce((acc, payment) => {
    acc[payment.status] = (acc[payment.status] || 0) + 1;
    return acc;
  }, {} as Record<PaymentStatus, number>);
}

// ============================================================================
// NACHA FILE GENERATION
// ============================================================================

/**
 * Generates NACHA file
 */
export function generateNACHAFile(params: {
  batches: PaymentBatch[];
  immediateDestination: string;
  immediateOrigin: string;
}): NACHAFile {
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
export function generateNACHAFileNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  return `NACHA${timestamp}`;
}

/**
 * Calculates entry hash for NACHA file
 */
export function calculateEntryHash(batches: PaymentBatch[]): string {
  // In production, this would calculate actual entry hash
  // For now, return a mock hash
  const hash = batches.reduce((sum, batch) => sum + batch.totalPayments, 0);
  return hash.toString().padStart(10, '0');
}

/**
 * Builds NACHA file content
 */
export function buildNACHAFileContent(params: {
  fileNumber: string;
  immediateDestination: string;
  immediateOrigin: string;
  batches: PaymentBatch[];
  entryHash: string;
}): string {
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
export function createPositivePayFile(params: {
  accountNumber: string;
  checks: PositivePayCheck[];
  effectiveDate: Date;
}): PositivePayFile {
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
export function generatePositivePayFileNumber(): string {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `PP-${date}-${random}`;
}

/**
 * Builds positive pay file content
 */
export function buildPositivePayFileContent(params: {
  accountNumber: string;
  checks: PositivePayCheck[];
}): string {
  // In production, this would build actual positive pay format
  return params.checks.map(check =>
    `${check.checkNumber},${check.amount},${check.payee},${check.issueDate.toISOString().split('T')[0]}`
  ).join('\n');
}

/**
 * Adds check to positive pay
 */
export function addCheckToPositivePay(
  file: PositivePayFile,
  check: PositivePayCheck,
): PositivePayFile {
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
export function createCheckPrintingRequest(params: {
  paymentId: string;
  checkNumber: string;
  amount: number;
  payee: string;
  payeeAddress: string;
  memo?: string;
  deliveryMethod: 'mail' | 'pickup' | 'courier';
  signatureRequired?: boolean;
}): CheckPrintingRequest {
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
export function generateCheckRequestNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `CHK-${timestamp}-${random}`;
}

/**
 * Marks check as printed
 */
export function markCheckPrinted(
  request: CheckPrintingRequest,
): CheckPrintingRequest {
  return {
    ...request,
    status: 'printed',
    printedDate: new Date(),
  };
}

/**
 * Marks check as mailed
 */
export function markCheckMailed(
  request: CheckPrintingRequest,
): CheckPrintingRequest {
  return {
    ...request,
    status: 'mailed',
    mailedDate: new Date(),
  };
}

/**
 * Voids check
 */
export function voidCheck(
  request: CheckPrintingRequest,
  reason: string,
): CheckPrintingRequest {
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
export function createPaymentApprovalWorkflow(params: {
  paymentId: string;
  workflowType: 'single' | 'dual' | 'multi';
  requiredApprovals: number;
  approvers: Array<{ approverId: string; approverName: string; level: number }>;
}): PaymentApprovalWorkflow {
  const approvals: ApprovalRecord[] = params.approvers.map(approver => ({
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
export function recordApprovalDecision(
  workflow: PaymentApprovalWorkflow,
  approverId: string,
  decision: 'approved' | 'rejected',
  comments?: string,
): PaymentApprovalWorkflow {
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

  let newStatus: 'pending' | 'approved' | 'rejected' | 'cancelled' = 'pending';

  if (rejectedCount > 0) {
    newStatus = 'rejected';
  } else if (approvedCount >= workflow.requiredApprovals) {
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
export function isApprovalWorkflowComplete(
  workflow: PaymentApprovalWorkflow,
): boolean {
  return workflow.status === 'approved' || workflow.status === 'rejected';
}

/**
 * Gets pending approvers
 */
export function getPendingApprovers(
  workflow: PaymentApprovalWorkflow,
): ApprovalRecord[] {
  return workflow.approvals.filter(a => a.decision === 'pending');
}

// ============================================================================
// PAYMENT METHOD CONFIGURATION
// ============================================================================

/**
 * Creates payment method configuration
 */
export function createPaymentMethodConfig(params: {
  paymentType: PaymentType;
  defaultAccount: string;
  approvalRequired: boolean;
  approvalThresholds: ApprovalThreshold[];
  processingDays: number[];
}): PaymentMethodConfig {
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
export function determineRequiredApprovals(
  config: PaymentMethodConfig,
  amount: number,
): number {
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
export function calculateNextProcessingDate(
  config: PaymentMethodConfig,
  requestedDate: Date = new Date(),
): Date {
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
export const ElectronicPaymentModel = {
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
export const PaymentBatchModel = {
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
export const PaymentReconciliationModel = {
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
export const PaymentReversalModel = {
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
export const ElectronicPaymentServiceExample = `
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
export const CreateElectronicPaymentDto = {
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
export const CreatePaymentBatchDto = {
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
export const CreateDirectDepositDto = {
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
export const ElectronicPaymentResponse = {
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
