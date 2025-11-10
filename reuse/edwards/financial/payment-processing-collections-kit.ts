/**
 * LOC: PAYPRO001
 * File: /reuse/edwards/financial/payment-processing-collections-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ./invoice-management-matching-kit (Invoice data for payment processing)
 *
 * DOWNSTREAM (imported by):
 *   - Backend payment modules
 *   - ACH processing services
 *   - Payment reconciliation services
 *   - Treasury management modules
 */

/**
 * File: /reuse/edwards/financial/payment-processing-collections-kit.ts
 * Locator: WC-EDWARDS-PAYPRO-001
 * Purpose: Comprehensive Payment Processing & Collections - JD Edwards EnterpriseOne-level payment runs, ACH, wire transfers, check processing, payment reconciliation
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, invoice-management-matching-kit
 * Downstream: ../backend/payments/*, ACH Processing Services, Wire Transfer Services, Check Processing, Payment Reconciliation
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for payment runs, ACH processing, wire transfers, check processing, electronic payments, payment scheduling, payment cancellation, void/reissue, positive pay, payment reconciliation
 *
 * LLM Context: Enterprise-grade payment processing for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive payment run management, ACH/NACHA file generation, wire transfer processing, check printing,
 * electronic payment processing, payment scheduling, payment cancellation, void and reissue workflows, positive pay file generation,
 * payment reconciliation, multi-currency payments, payment approval workflows, payment method management, payment holds,
 * payment reversals, payment audit trails, and bank integration.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable, Controller, Get, Post, Put, Delete, Param, Query, Body, HttpCode, HttpStatus, UseGuards, UsePipes, ValidationPipe, ParseUUIDPipe, ParseIntPipe } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PaymentMethod {
  paymentMethodId: number;
  methodCode: string;
  methodName: string;
  methodType: 'ACH' | 'Wire' | 'Check' | 'EFT' | 'Credit_Card' | 'Virtual_Card' | 'Electronic';
  bankAccountId: number;
  isActive: boolean;
  requiresApproval: boolean;
  approvalThreshold: number;
  defaultProcessingDays: number;
  configuration: Record<string, any>;
}

interface PaymentRun {
  paymentRunId: number;
  runNumber: string;
  runDate: Date;
  scheduledDate: Date;
  paymentMethodId: number;
  paymentMethodType: string;
  bankAccountId: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'processing' | 'transmitted' | 'completed' | 'cancelled';
  invoiceCount: number;
  totalAmount: number;
  currency: string;
  paymentCount: number;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  transmittedAt?: Date;
  completedAt?: Date;
}

interface Payment {
  paymentId: number;
  paymentNumber: string;
  paymentRunId?: number;
  paymentDate: Date;
  paymentMethodId: number;
  paymentMethodType: string;
  supplierId: number;
  supplierName: string;
  supplierSiteId: number;
  bankAccountId: number;
  amount: number;
  currency: string;
  exchangeRate: number;
  baseAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'transmitted' | 'cleared' | 'reconciled' | 'void' | 'cancelled';
  checkNumber?: string;
  referenceNumber: string;
  description: string;
  invoiceCount: number;
  approvalStatus: 'none' | 'pending' | 'approved' | 'rejected';
  clearedDate?: Date;
  voidDate?: Date;
  voidReason?: string;
}

interface PaymentInvoiceAllocation {
  allocationId: number;
  paymentId: number;
  invoiceId: number;
  invoiceNumber: string;
  allocatedAmount: number;
  discountAmount: number;
  withholdingTaxAmount: number;
  netAmount: number;
  allocationDate: Date;
}

interface ACHBatch {
  achBatchId: number;
  batchNumber: string;
  fileCreationDate: Date;
  fileCreationTime: string;
  originatorId: string;
  originatorName: string;
  batchCount: number;
  entryCount: number;
  totalDebit: number;
  totalCredit: number;
  effectiveDate: Date;
  fileContent: string;
  fileName: string;
  status: 'created' | 'validated' | 'transmitted' | 'acknowledged' | 'settled';
  transmittedAt?: Date;
  settledAt?: Date;
}

interface ACHEntry {
  achEntryId: number;
  achBatchId: number;
  paymentId: number;
  transactionCode: string;
  receivingDFI: string;
  checkDigit: string;
  dfiAccountNumber: string;
  amount: number;
  individualId: string;
  individualName: string;
  discretionaryData?: string;
  addendaRecord?: string;
  traceNumber: string;
}

interface WireTransfer {
  wireTransferId: number;
  paymentId: number;
  wireDate: Date;
  wireType: 'Domestic' | 'International';
  beneficiaryName: string;
  beneficiaryAccountNumber: string;
  beneficiaryBankName: string;
  beneficiaryBankSwift?: string;
  beneficiaryBankABA?: string;
  intermediaryBankSwift?: string;
  intermediaryBankName?: string;
  amount: number;
  currency: string;
  purposeCode?: string;
  referenceNumber: string;
  instructions: string;
  status: 'pending' | 'transmitted' | 'confirmed' | 'rejected';
  transmittedAt?: Date;
  confirmedAt?: Date;
}

interface CheckRun {
  checkRunId: number;
  runNumber: string;
  runDate: Date;
  bankAccountId: number;
  checkCount: number;
  totalAmount: number;
  startingCheckNumber: string;
  endingCheckNumber: string;
  status: 'created' | 'printed' | 'issued' | 'cancelled';
  printedAt?: Date;
  printedBy?: string;
}

interface Check {
  checkId: number;
  paymentId: number;
  checkRunId?: number;
  checkNumber: string;
  checkDate: Date;
  payeeName: string;
  amount: number;
  amountInWords: string;
  bankAccountId: number;
  status: 'created' | 'printed' | 'issued' | 'presented' | 'cleared' | 'void' | 'stale';
  printedAt?: Date;
  issuedAt?: Date;
  clearedDate?: Date;
  voidDate?: Date;
  voidReason?: string;
  stopPayment?: boolean;
  stopPaymentDate?: Date;
}

interface PositivePayFile {
  positivePayId: number;
  fileDate: Date;
  bankAccountId: number;
  fileSequenceNumber: number;
  checkCount: number;
  totalAmount: number;
  fileName: string;
  fileContent: string;
  status: 'created' | 'transmitted' | 'acknowledged';
  transmittedAt?: Date;
  acknowledgedAt?: Date;
}

interface PaymentReconciliation {
  reconciliationId: number;
  paymentId: number;
  reconciliationDate: Date;
  bankStatementId: number;
  bankStatementDate: Date;
  clearedAmount: number;
  variance: number;
  status: 'matched' | 'variance' | 'unmatched' | 'pending_review';
  reconciledBy?: string;
  notes?: string;
}

interface PaymentHold {
  holdId: number;
  paymentId: number;
  holdType: 'manual' | 'duplicate' | 'validation' | 'approval' | 'compliance';
  holdReason: string;
  holdDate: Date;
  holdBy: string;
  releaseDate?: Date;
  releasedBy?: string;
  releaseNotes?: string;
}

interface PaymentApproval {
  approvalId: number;
  paymentId: number;
  approvalLevel: number;
  approverId: string;
  approverName: string;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'delegated';
  approvalDate?: Date;
  comments?: string;
  delegatedTo?: string;
}

interface PaymentSchedule {
  scheduleId: number;
  scheduleName: string;
  scheduleType: 'recurring' | 'one_time';
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  startDate: Date;
  endDate?: Date;
  nextRunDate: Date;
  paymentMethodId: number;
  bankAccountId: number;
  isActive: boolean;
  configuration: Record<string, any>;
}

interface PaymentAuditTrail {
  auditId: number;
  paymentId: number;
  action: 'CREATE' | 'UPDATE' | 'APPROVE' | 'TRANSMIT' | 'VOID' | 'RECONCILE' | 'HOLD' | 'RELEASE';
  actionDate: Date;
  userId: string;
  userName: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  notes?: string;
}

interface BankAccount {
  bankAccountId: number;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
  routingNumber: string;
  swiftCode?: string;
  iban?: string;
  currency: string;
  accountType: 'checking' | 'savings' | 'money_market';
  isActive: boolean;
  balance: number;
  availableBalance: number;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreatePaymentRunDto {
  @ApiProperty({ description: 'Run date', example: '2024-01-15' })
  runDate!: Date;

  @ApiProperty({ description: 'Scheduled payment date', example: '2024-01-20' })
  scheduledDate!: Date;

  @ApiProperty({ description: 'Payment method ID' })
  paymentMethodId!: number;

  @ApiProperty({ description: 'Bank account ID' })
  bankAccountId!: number;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  currency!: string;

  @ApiProperty({ description: 'Invoice IDs to include', type: [Number] })
  invoiceIds!: number[];
}

export class CreatePaymentDto {
  @ApiProperty({ description: 'Payment date', example: '2024-01-15' })
  paymentDate!: Date;

  @ApiProperty({ description: 'Payment method ID' })
  paymentMethodId!: number;

  @ApiProperty({ description: 'Supplier ID' })
  supplierId!: number;

  @ApiProperty({ description: 'Supplier site ID' })
  supplierSiteId!: number;

  @ApiProperty({ description: 'Bank account ID' })
  bankAccountId!: number;

  @ApiProperty({ description: 'Payment amount' })
  amount!: number;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  currency!: string;

  @ApiProperty({ description: 'Invoice allocations', type: [Object] })
  invoiceAllocations!: { invoiceId: number; amount: number; discountAmount?: number }[];
}

export class ProcessACHBatchDto {
  @ApiProperty({ description: 'Payment run ID' })
  paymentRunId!: number;

  @ApiProperty({ description: 'Effective date for ACH', example: '2024-01-20' })
  effectiveDate!: Date;

  @ApiProperty({ description: 'Originator ID', example: 'COMP001' })
  originatorId!: string;

  @ApiProperty({ description: 'Originator name', example: 'Company Name Inc' })
  originatorName!: string;
}

export class CreateWireTransferDto {
  @ApiProperty({ description: 'Payment ID' })
  paymentId!: number;

  @ApiProperty({ description: 'Wire type', enum: ['Domestic', 'International'] })
  wireType!: string;

  @ApiProperty({ description: 'Beneficiary name' })
  beneficiaryName!: string;

  @ApiProperty({ description: 'Beneficiary account number' })
  beneficiaryAccountNumber!: string;

  @ApiProperty({ description: 'Beneficiary bank name' })
  beneficiaryBankName!: string;

  @ApiProperty({ description: 'Beneficiary bank SWIFT code', required: false })
  beneficiaryBankSwift?: string;

  @ApiProperty({ description: 'Beneficiary bank ABA routing number', required: false })
  beneficiaryBankABA?: string;

  @ApiProperty({ description: 'Wire instructions' })
  instructions!: string;
}

export class VoidPaymentDto {
  @ApiProperty({ description: 'Payment ID' })
  paymentId!: number;

  @ApiProperty({ description: 'Void reason' })
  voidReason!: string;

  @ApiProperty({ description: 'Void date', example: '2024-01-15' })
  voidDate!: Date;

  @ApiProperty({ description: 'Reissue payment', default: false })
  reissuePayment!: boolean;
}

export class ReconcilePaymentDto {
  @ApiProperty({ description: 'Payment ID' })
  paymentId!: number;

  @ApiProperty({ description: 'Bank statement ID' })
  bankStatementId!: number;

  @ApiProperty({ description: 'Cleared date', example: '2024-01-15' })
  clearedDate!: Date;

  @ApiProperty({ description: 'Cleared amount' })
  clearedAmount!: number;
}

export class ApprovePaymentDto {
  @ApiProperty({ description: 'Payment ID' })
  paymentId!: number;

  @ApiProperty({ description: 'Approval level' })
  approvalLevel!: number;

  @ApiProperty({ description: 'Approval comments', required: false })
  comments?: string;
}

export class CreatePaymentScheduleDto {
  @ApiProperty({ description: 'Schedule name' })
  scheduleName!: string;

  @ApiProperty({ description: 'Schedule type', enum: ['recurring', 'one_time'] })
  scheduleType!: string;

  @ApiProperty({ description: 'Frequency', enum: ['daily', 'weekly', 'biweekly', 'monthly', 'quarterly'] })
  frequency!: string;

  @ApiProperty({ description: 'Start date', example: '2024-01-01' })
  startDate!: Date;

  @ApiProperty({ description: 'End date', required: false })
  endDate?: Date;

  @ApiProperty({ description: 'Payment method ID' })
  paymentMethodId!: number;

  @ApiProperty({ description: 'Bank account ID' })
  bankAccountId!: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Payment Runs with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PaymentRun model
 *
 * @example
 * ```typescript
 * const PaymentRun = createPaymentRunModel(sequelize);
 * const run = await PaymentRun.create({
 *   runNumber: 'PR-2024-001',
 *   runDate: new Date(),
 *   paymentMethodId: 1,
 *   status: 'draft'
 * });
 * ```
 */
export const createPaymentRunModel = (sequelize: Sequelize) => {
  class PaymentRun extends Model {
    public id!: number;
    public runNumber!: string;
    public runDate!: Date;
    public scheduledDate!: Date;
    public paymentMethodId!: number;
    public paymentMethodType!: string;
    public bankAccountId!: number;
    public status!: string;
    public invoiceCount!: number;
    public totalAmount!: number;
    public currency!: string;
    public paymentCount!: number;
    public createdBy!: string;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public transmittedAt!: Date | null;
    public completedAt!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PaymentRun.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      runNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique payment run number',
      },
      runDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Payment run creation date',
      },
      scheduledDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Scheduled payment date',
      },
      paymentMethodId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Payment method reference',
      },
      paymentMethodType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Payment method type (ACH, Wire, Check, etc.)',
      },
      bankAccountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Bank account reference',
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Payment run status',
      },
      invoiceCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of invoices in run',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total payment amount',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code',
      },
      paymentCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of payments in run',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the run',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who approved the run',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      transmittedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Transmission timestamp',
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Completion timestamp',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'payment_runs',
      timestamps: true,
      indexes: [
        { fields: ['runNumber'], unique: true },
        { fields: ['runDate'] },
        { fields: ['scheduledDate'] },
        { fields: ['status'] },
        { fields: ['paymentMethodId'] },
        { fields: ['bankAccountId'] },
      ],
    },
  );

  return PaymentRun;
};

/**
 * Sequelize model for Payments with multi-currency support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Payment model
 *
 * @example
 * ```typescript
 * const Payment = createPaymentModel(sequelize);
 * const payment = await Payment.create({
 *   paymentNumber: 'PAY-2024-001',
 *   paymentDate: new Date(),
 *   supplierId: 100,
 *   amount: 5000.00,
 *   status: 'draft'
 * });
 * ```
 */
export const createPaymentModel = (sequelize: Sequelize) => {
  class Payment extends Model {
    public id!: number;
    public paymentNumber!: string;
    public paymentRunId!: number | null;
    public paymentDate!: Date;
    public paymentMethodId!: number;
    public paymentMethodType!: string;
    public supplierId!: number;
    public supplierName!: string;
    public supplierSiteId!: number;
    public bankAccountId!: number;
    public amount!: number;
    public currency!: string;
    public exchangeRate!: number;
    public baseAmount!: number;
    public status!: string;
    public checkNumber!: string | null;
    public referenceNumber!: string;
    public description!: string;
    public invoiceCount!: number;
    public approvalStatus!: string;
    public clearedDate!: Date | null;
    public voidDate!: Date | null;
    public voidReason!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Payment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      paymentNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique payment number',
      },
      paymentRunId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Payment run reference',
        references: {
          model: 'payment_runs',
          key: 'id',
        },
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Payment date',
      },
      paymentMethodId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Payment method reference',
      },
      paymentMethodType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Payment method type',
      },
      supplierId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Supplier reference',
      },
      supplierName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Supplier name (denormalized)',
      },
      supplierSiteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Supplier site reference',
      },
      bankAccountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Bank account reference',
      },
      amount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Payment amount in payment currency',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Payment currency',
      },
      exchangeRate: {
        type: DataTypes.DECIMAL(12, 6),
        allowNull: false,
        defaultValue: 1.0,
        comment: 'Exchange rate to base currency',
      },
      baseAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Payment amount in base currency',
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Payment status',
      },
      checkNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Check number (if applicable)',
      },
      referenceNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Payment reference number',
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Payment description',
      },
      invoiceCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of invoices paid',
      },
      approvalStatus: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'none',
        comment: 'Approval status',
      },
      clearedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date payment cleared bank',
      },
      voidDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date payment was voided',
      },
      voidReason: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Reason for void',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'payments',
      timestamps: true,
      indexes: [
        { fields: ['paymentNumber'], unique: true },
        { fields: ['paymentDate'] },
        { fields: ['status'] },
        { fields: ['supplierId'] },
        { fields: ['paymentRunId'] },
        { fields: ['checkNumber'] },
        { fields: ['clearedDate'] },
      ],
    },
  );

  return Payment;
};

/**
 * Sequelize model for ACH Batches with NACHA compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ACHBatch model
 *
 * @example
 * ```typescript
 * const ACHBatch = createACHBatchModel(sequelize);
 * const batch = await ACHBatch.create({
 *   batchNumber: 'ACH-2024-001',
 *   originatorId: 'COMP001',
 *   effectiveDate: new Date()
 * });
 * ```
 */
export const createACHBatchModel = (sequelize: Sequelize) => {
  class ACHBatch extends Model {
    public id!: number;
    public batchNumber!: string;
    public fileCreationDate!: Date;
    public fileCreationTime!: string;
    public originatorId!: string;
    public originatorName!: string;
    public batchCount!: number;
    public entryCount!: number;
    public totalDebit!: number;
    public totalCredit!: number;
    public effectiveDate!: Date;
    public fileContent!: string;
    public fileName!: string;
    public status!: string;
    public transmittedAt!: Date | null;
    public settledAt!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ACHBatch.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      batchNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique ACH batch number',
      },
      fileCreationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'File creation date',
      },
      fileCreationTime: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'File creation time',
      },
      originatorId: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'Originator company ID',
      },
      originatorName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Originator company name',
      },
      batchCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of batches in file',
      },
      entryCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of entries in batch',
      },
      totalDebit: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total debit amount',
      },
      totalCredit: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total credit amount',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective entry date',
      },
      fileContent: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'NACHA file content',
      },
      fileName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'ACH file name',
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'created',
        comment: 'Batch status',
      },
      transmittedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Transmission timestamp',
      },
      settledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Settlement timestamp',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'ach_batches',
      timestamps: true,
      indexes: [
        { fields: ['batchNumber'], unique: true },
        { fields: ['fileCreationDate'] },
        { fields: ['effectiveDate'] },
        { fields: ['status'] },
      ],
    },
  );

  return ACHBatch;
};

// ============================================================================
// BUSINESS LOGIC FUNCTIONS
// ============================================================================

/**
 * Creates a new payment run for batch payment processing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreatePaymentRunDto} runData - Payment run data
 * @param {string} userId - User creating the run
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created payment run
 *
 * @example
 * ```typescript
 * const run = await createPaymentRun(sequelize, {
 *   runDate: new Date(),
 *   scheduledDate: new Date('2024-01-20'),
 *   paymentMethodId: 1,
 *   bankAccountId: 5,
 *   currency: 'USD',
 *   invoiceIds: [101, 102, 103]
 * }, 'user123');
 * ```
 */
export const createPaymentRun = async (
  sequelize: Sequelize,
  runData: CreatePaymentRunDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const PaymentRun = createPaymentRunModel(sequelize);

  // Generate run number
  const runNumber = await generatePaymentRunNumber(sequelize, runData.runDate, transaction);

  // Get payment method details
  const paymentMethod = await getPaymentMethod(sequelize, runData.paymentMethodId, transaction);

  // Calculate totals from invoices
  const { invoiceCount, totalAmount } = await calculatePaymentRunTotals(
    sequelize,
    runData.invoiceIds,
    transaction,
  );

  const run = await PaymentRun.create(
    {
      runNumber,
      runDate: runData.runDate,
      scheduledDate: runData.scheduledDate,
      paymentMethodId: runData.paymentMethodId,
      paymentMethodType: paymentMethod.methodType,
      bankAccountId: runData.bankAccountId,
      currency: runData.currency,
      invoiceCount,
      totalAmount,
      status: 'draft',
      createdBy: userId,
    },
    { transaction },
  );

  return run;
};

/**
 * Generates a unique payment run number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} runDate - Run date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated run number
 *
 * @example
 * ```typescript
 * const runNumber = await generatePaymentRunNumber(sequelize, new Date());
 * // Returns: 'PR-2024-001'
 * ```
 */
export const generatePaymentRunNumber = async (
  sequelize: Sequelize,
  runDate: Date,
  transaction?: Transaction,
): Promise<string> => {
  const PaymentRun = createPaymentRunModel(sequelize);

  const year = runDate.getFullYear();
  const prefix = `PR-${year}-`;

  const lastRun = await PaymentRun.findOne({
    where: {
      runNumber: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [['runNumber', 'DESC']],
    transaction,
  });

  let sequence = 1;
  if (lastRun) {
    const lastSequence = parseInt(lastRun.runNumber.split('-')[2], 10);
    sequence = lastSequence + 1;
  }

  return `${prefix}${sequence.toString().padStart(3, '0')}`;
};

/**
 * Retrieves payment method details by ID.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentMethodId - Payment method ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PaymentMethod>} Payment method details
 *
 * @example
 * ```typescript
 * const method = await getPaymentMethod(sequelize, 1);
 * console.log(method.methodType); // 'ACH'
 * ```
 */
export const getPaymentMethod = async (
  sequelize: Sequelize,
  paymentMethodId: number,
  transaction?: Transaction,
): Promise<PaymentMethod> => {
  const result = await sequelize.query(
    'SELECT * FROM payment_methods WHERE id = :paymentMethodId AND is_active = true',
    {
      replacements: { paymentMethodId },
      type: 'SELECT',
      transaction,
    },
  );

  if (!result || (result as any[]).length === 0) {
    throw new Error(`Payment method ${paymentMethodId} not found or inactive`);
  }

  return (result as any[])[0] as PaymentMethod;
};

/**
 * Calculates payment run totals from invoice list.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number[]} invoiceIds - Invoice IDs
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{invoiceCount: number; totalAmount: number}>} Totals
 *
 * @example
 * ```typescript
 * const totals = await calculatePaymentRunTotals(sequelize, [101, 102, 103]);
 * console.log(totals.totalAmount); // 15000.00
 * ```
 */
export const calculatePaymentRunTotals = async (
  sequelize: Sequelize,
  invoiceIds: number[],
  transaction?: Transaction,
): Promise<{ invoiceCount: number; totalAmount: number }> => {
  const result = await sequelize.query(
    `SELECT COUNT(*) as invoice_count, COALESCE(SUM(amount_due), 0) as total_amount
     FROM invoices
     WHERE id IN (:invoiceIds) AND status = 'approved'`,
    {
      replacements: { invoiceIds },
      type: 'SELECT',
      transaction,
    },
  );

  const row = (result as any[])[0];
  return {
    invoiceCount: parseInt(row.invoice_count, 10),
    totalAmount: parseFloat(row.total_amount),
  };
};

/**
 * Approves a payment run for processing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentRunId - Payment run ID
 * @param {string} userId - User approving the run
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved payment run
 *
 * @example
 * ```typescript
 * const approved = await approvePaymentRun(sequelize, 1, 'manager123');
 * ```
 */
export const approvePaymentRun = async (
  sequelize: Sequelize,
  paymentRunId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const PaymentRun = createPaymentRunModel(sequelize);

  const run = await PaymentRun.findByPk(paymentRunId, { transaction });
  if (!run) {
    throw new Error('Payment run not found');
  }

  if (run.status !== 'pending_approval') {
    throw new Error('Payment run is not pending approval');
  }

  await run.update(
    {
      status: 'approved',
      approvedBy: userId,
      approvedAt: new Date(),
    },
    { transaction },
  );

  await createPaymentAuditTrail(sequelize, 0, 'APPROVE', userId, {}, { paymentRunId }, transaction);

  return run;
};

/**
 * Creates individual payments from a payment run.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentRunId - Payment run ID
 * @param {string} userId - User creating payments
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Created payments
 *
 * @example
 * ```typescript
 * const payments = await createPaymentsFromRun(sequelize, 1, 'user123');
 * console.log(payments.length); // 5
 * ```
 */
export const createPaymentsFromRun = async (
  sequelize: Sequelize,
  paymentRunId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any[]> => {
  const PaymentRun = createPaymentRunModel(sequelize);
  const Payment = createPaymentModel(sequelize);

  const run = await PaymentRun.findByPk(paymentRunId, { transaction });
  if (!run) {
    throw new Error('Payment run not found');
  }

  // Get invoices grouped by supplier
  const invoices = await sequelize.query(
    `SELECT supplier_id, supplier_site_id, supplier_name, currency,
            SUM(amount_due) as total_amount, COUNT(*) as invoice_count,
            ARRAY_AGG(id) as invoice_ids
     FROM invoices
     WHERE payment_run_id = :paymentRunId AND status = 'approved'
     GROUP BY supplier_id, supplier_site_id, supplier_name, currency`,
    {
      replacements: { paymentRunId },
      type: 'SELECT',
      transaction,
    },
  );

  const payments = [];
  for (const inv of invoices as any[]) {
    const paymentNumber = await generatePaymentNumber(sequelize, run.runDate, transaction);

    const payment = await Payment.create(
      {
        paymentNumber,
        paymentRunId,
        paymentDate: run.scheduledDate,
        paymentMethodId: run.paymentMethodId,
        paymentMethodType: run.paymentMethodType,
        supplierId: inv.supplier_id,
        supplierName: inv.supplier_name,
        supplierSiteId: inv.supplier_site_id,
        bankAccountId: run.bankAccountId,
        amount: inv.total_amount,
        currency: inv.currency,
        exchangeRate: 1.0,
        baseAmount: inv.total_amount,
        status: 'pending',
        referenceNumber: `PR-${run.runNumber}`,
        description: `Payment for ${inv.invoice_count} invoices`,
        invoiceCount: inv.invoice_count,
        approvalStatus: 'none',
      },
      { transaction },
    );

    payments.push(payment);
  }

  await run.update({ paymentCount: payments.length }, { transaction });

  return payments;
};

/**
 * Generates a unique payment number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} paymentDate - Payment date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated payment number
 *
 * @example
 * ```typescript
 * const paymentNumber = await generatePaymentNumber(sequelize, new Date());
 * // Returns: 'PAY-2024-001'
 * ```
 */
export const generatePaymentNumber = async (
  sequelize: Sequelize,
  paymentDate: Date,
  transaction?: Transaction,
): Promise<string> => {
  const Payment = createPaymentModel(sequelize);

  const year = paymentDate.getFullYear();
  const prefix = `PAY-${year}-`;

  const lastPayment = await Payment.findOne({
    where: {
      paymentNumber: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [['paymentNumber', 'DESC']],
    transaction,
  });

  let sequence = 1;
  if (lastPayment) {
    const lastSequence = parseInt(lastPayment.paymentNumber.split('-')[2], 10);
    sequence = lastSequence + 1;
  }

  return `${prefix}${sequence.toString().padStart(6, '0')}`;
};

/**
 * Processes ACH batch for electronic payment transmission.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ProcessACHBatchDto} batchData - ACH batch data
 * @param {string} userId - User processing the batch
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created ACH batch
 *
 * @example
 * ```typescript
 * const batch = await processACHBatch(sequelize, {
 *   paymentRunId: 1,
 *   effectiveDate: new Date('2024-01-20'),
 *   originatorId: 'COMP001',
 *   originatorName: 'Company Name Inc'
 * }, 'user123');
 * ```
 */
export const processACHBatch = async (
  sequelize: Sequelize,
  batchData: ProcessACHBatchDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const ACHBatch = createACHBatchModel(sequelize);

  // Get payments from run
  const payments = await sequelize.query(
    'SELECT * FROM payments WHERE payment_run_id = :paymentRunId AND status = :status',
    {
      replacements: { paymentRunId: batchData.paymentRunId, status: 'approved' },
      type: 'SELECT',
      transaction,
    },
  );

  if (!payments || (payments as any[]).length === 0) {
    throw new Error('No approved payments found for ACH processing');
  }

  const batchNumber = await generateACHBatchNumber(sequelize, transaction);
  const now = new Date();

  // Generate NACHA file content
  const fileContent = await generateNACHAFile(
    payments as any[],
    batchData.originatorId,
    batchData.originatorName,
    batchData.effectiveDate,
  );

  let totalCredit = 0;
  for (const payment of payments as any[]) {
    totalCredit += parseFloat(payment.amount);
  }

  const batch = await ACHBatch.create(
    {
      batchNumber,
      fileCreationDate: now,
      fileCreationTime: now.toTimeString().slice(0, 8),
      originatorId: batchData.originatorId,
      originatorName: batchData.originatorName,
      batchCount: 1,
      entryCount: (payments as any[]).length,
      totalDebit: 0,
      totalCredit,
      effectiveDate: batchData.effectiveDate,
      fileContent,
      fileName: `ACH_${batchNumber}_${now.toISOString().split('T')[0]}.txt`,
      status: 'created',
    },
    { transaction },
  );

  return batch;
};

/**
 * Generates ACH batch number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated batch number
 *
 * @example
 * ```typescript
 * const batchNumber = await generateACHBatchNumber(sequelize);
 * // Returns: 'ACH-2024-001'
 * ```
 */
export const generateACHBatchNumber = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<string> => {
  const ACHBatch = createACHBatchModel(sequelize);

  const year = new Date().getFullYear();
  const prefix = `ACH-${year}-`;

  const lastBatch = await ACHBatch.findOne({
    where: {
      batchNumber: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [['batchNumber', 'DESC']],
    transaction,
  });

  let sequence = 1;
  if (lastBatch) {
    const lastSequence = parseInt(lastBatch.batchNumber.split('-')[2], 10);
    sequence = lastSequence + 1;
  }

  return `${prefix}${sequence.toString().padStart(3, '0')}`;
};

/**
 * Generates NACHA formatted ACH file content.
 *
 * @param {any[]} payments - Payments to include
 * @param {string} originatorId - Originator company ID
 * @param {string} originatorName - Originator company name
 * @param {Date} effectiveDate - Effective entry date
 * @returns {Promise<string>} NACHA file content
 *
 * @example
 * ```typescript
 * const content = await generateNACHAFile(payments, 'COMP001', 'Company Inc', new Date());
 * ```
 */
export const generateNACHAFile = async (
  payments: any[],
  originatorId: string,
  originatorName: string,
  effectiveDate: Date,
): Promise<string> => {
  const lines: string[] = [];

  // File Header Record (Type 1)
  const fileHeader = [
    '1',
    '01',
    ' '.repeat(10), // Immediate Destination
    originatorId.padEnd(10),
    effectiveDate.toISOString().slice(2, 10).replace(/-/g, ''),
    new Date().toTimeString().slice(0, 4),
    'A',
    '094',
    '10',
    originatorName.padEnd(23),
    ' '.repeat(23),
  ].join('');

  lines.push(fileHeader.padEnd(94, ' '));

  // Batch Header Record (Type 5)
  const batchHeader = [
    '5',
    '200', // Service class code (ACH Credits)
    originatorName.padEnd(16),
    ' '.repeat(20),
    originatorId.padEnd(10),
    'PPD', // Standard Entry Class
    'PAYMENT'.padEnd(10),
    effectiveDate.toISOString().slice(5, 10).replace(/-/g, ''),
    ' '.repeat(3),
    '1',
    ' '.repeat(8),
    '0'.repeat(8),
  ].join('');

  lines.push(batchHeader.padEnd(94, ' '));

  // Entry Detail Records (Type 6)
  let totalCredit = 0;
  for (let i = 0; i < payments.length; i++) {
    const payment = payments[i];
    const amount = Math.round(parseFloat(payment.amount) * 100);
    totalCredit += amount;

    const entryDetail = [
      '6',
      '22', // Transaction code (Checking Credit)
      '00000000', // Receiving DFI
      '0', // Check digit
      payment.metadata?.accountNumber || '0000000000',
      amount.toString().padStart(10, '0'),
      payment.supplierId.toString().padStart(15, '0'),
      payment.supplierName.slice(0, 22).padEnd(22),
      '  ',
      '0',
      (i + 1).toString().padStart(7, '0'),
    ].join('');

    lines.push(entryDetail.padEnd(94, ' '));
  }

  // Batch Control Record (Type 8)
  const batchControl = [
    '8',
    '200',
    payments.length.toString().padStart(6, '0'),
    '0'.repeat(10), // Entry hash
    '0'.repeat(12), // Total debits
    totalCredit.toString().padStart(12, '0'),
    originatorId.padEnd(10),
    ' '.repeat(19),
    ' '.repeat(6),
    ' '.repeat(8),
    '0'.repeat(8),
  ].join('');

  lines.push(batchControl.padEnd(94, ' '));

  // File Control Record (Type 9)
  const fileControl = [
    '9',
    '000001',
    '000001',
    payments.length.toString().padStart(8, '0'),
    '0'.repeat(10),
    '0'.repeat(12),
    totalCredit.toString().padStart(12, '0'),
    ' '.repeat(39),
  ].join('');

  lines.push(fileControl.padEnd(94, ' '));

  return lines.join('\n');
};

/**
 * Validates ACH batch before transmission.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} achBatchId - ACH batch ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{isValid: boolean; errors: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateACHBatch(sequelize, 1);
 * if (!validation.isValid) {
 *   console.log('Errors:', validation.errors);
 * }
 * ```
 */
export const validateACHBatch = async (
  sequelize: Sequelize,
  achBatchId: number,
  transaction?: Transaction,
): Promise<{ isValid: boolean; errors: string[] }> => {
  const ACHBatch = createACHBatchModel(sequelize);

  const batch = await ACHBatch.findByPk(achBatchId, { transaction });
  if (!batch) {
    return { isValid: false, errors: ['ACH batch not found'] };
  }

  const errors: string[] = [];

  // Validate file content length
  if (!batch.fileContent || batch.fileContent.length === 0) {
    errors.push('ACH file content is empty');
  }

  // Validate entry count
  if (batch.entryCount === 0) {
    errors.push('ACH batch has no entries');
  }

  // Validate totals
  if (batch.totalCredit <= 0 && batch.totalDebit <= 0) {
    errors.push('ACH batch has no transaction amounts');
  }

  // Validate effective date is future dated
  if (batch.effectiveDate <= new Date()) {
    errors.push('ACH effective date must be in the future');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Transmits ACH batch to bank.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} achBatchId - ACH batch ID
 * @param {string} userId - User transmitting the batch
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transmitted ACH batch
 *
 * @example
 * ```typescript
 * const transmitted = await transmitACHBatch(sequelize, 1, 'user123');
 * ```
 */
export const transmitACHBatch = async (
  sequelize: Sequelize,
  achBatchId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const ACHBatch = createACHBatchModel(sequelize);

  const validation = await validateACHBatch(sequelize, achBatchId, transaction);
  if (!validation.isValid) {
    throw new Error(`ACH batch validation failed: ${validation.errors.join(', ')}`);
  }

  const batch = await ACHBatch.findByPk(achBatchId, { transaction });
  if (!batch) {
    throw new Error('ACH batch not found');
  }

  await batch.update(
    {
      status: 'transmitted',
      transmittedAt: new Date(),
    },
    { transaction },
  );

  // In production, this would transmit to bank via SFTP/API
  // For now, we just mark as transmitted

  return batch;
};

/**
 * Creates a wire transfer for payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateWireTransferDto} wireData - Wire transfer data
 * @param {string} userId - User creating the wire
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created wire transfer
 *
 * @example
 * ```typescript
 * const wire = await createWireTransfer(sequelize, {
 *   paymentId: 1,
 *   wireType: 'Domestic',
 *   beneficiaryName: 'Supplier Inc',
 *   beneficiaryAccountNumber: '123456789',
 *   beneficiaryBankName: 'Bank of America',
 *   beneficiaryBankABA: '026009593',
 *   instructions: 'Payment for invoice 12345'
 * }, 'user123');
 * ```
 */
export const createWireTransfer = async (
  sequelize: Sequelize,
  wireData: CreateWireTransferDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Payment = createPaymentModel(sequelize);

  const payment = await Payment.findByPk(wireData.paymentId, { transaction });
  if (!payment) {
    throw new Error('Payment not found');
  }

  const wire = await sequelize.query(
    `INSERT INTO wire_transfers (
      payment_id, wire_date, wire_type, beneficiary_name, beneficiary_account_number,
      beneficiary_bank_name, beneficiary_bank_swift, beneficiary_bank_aba,
      intermediary_bank_swift, intermediary_bank_name, amount, currency,
      reference_number, instructions, status, created_at, updated_at
    ) VALUES (
      :paymentId, CURRENT_DATE, :wireType, :beneficiaryName, :beneficiaryAccountNumber,
      :beneficiaryBankName, :beneficiaryBankSwift, :beneficiaryBankABA,
      :intermediaryBankSwift, :intermediaryBankName, :amount, :currency,
      :referenceNumber, :instructions, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`,
    {
      replacements: {
        paymentId: wireData.paymentId,
        wireType: wireData.wireType,
        beneficiaryName: wireData.beneficiaryName,
        beneficiaryAccountNumber: wireData.beneficiaryAccountNumber,
        beneficiaryBankName: wireData.beneficiaryBankName,
        beneficiaryBankSwift: wireData.beneficiaryBankSwift || null,
        beneficiaryBankABA: wireData.beneficiaryBankABA || null,
        intermediaryBankSwift: null,
        intermediaryBankName: null,
        amount: payment.amount,
        currency: payment.currency,
        referenceNumber: payment.referenceNumber,
        instructions: wireData.instructions,
      },
      type: 'INSERT',
      transaction,
    },
  );

  await payment.update({ status: 'transmitted' }, { transaction });

  return wire;
};

/**
 * Processes check run for check printing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentRunId - Payment run ID
 * @param {string} startingCheckNumber - Starting check number
 * @param {string} userId - User processing the check run
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created check run
 *
 * @example
 * ```typescript
 * const checkRun = await processCheckRun(sequelize, 1, '100001', 'user123');
 * ```
 */
export const processCheckRun = async (
  sequelize: Sequelize,
  paymentRunId: number,
  startingCheckNumber: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const PaymentRun = createPaymentRunModel(sequelize);

  const run = await PaymentRun.findByPk(paymentRunId, { transaction });
  if (!run) {
    throw new Error('Payment run not found');
  }

  const payments = await sequelize.query(
    'SELECT * FROM payments WHERE payment_run_id = :paymentRunId AND status = :status',
    {
      replacements: { paymentRunId, status: 'approved' },
      type: 'SELECT',
      transaction,
    },
  );

  if (!payments || (payments as any[]).length === 0) {
    throw new Error('No approved payments found for check processing');
  }

  const runNumber = await generateCheckRunNumber(sequelize, transaction);
  let checkNum = parseInt(startingCheckNumber, 10);
  let totalAmount = 0;

  for (const payment of payments as any[]) {
    totalAmount += parseFloat(payment.amount);
    checkNum++;
  }

  const endingCheckNumber = (checkNum - 1).toString();

  const checkRun = await sequelize.query(
    `INSERT INTO check_runs (
      run_number, run_date, bank_account_id, check_count, total_amount,
      starting_check_number, ending_check_number, status, created_at, updated_at
    ) VALUES (
      :runNumber, CURRENT_DATE, :bankAccountId, :checkCount, :totalAmount,
      :startingCheckNumber, :endingCheckNumber, 'created', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`,
    {
      replacements: {
        runNumber,
        bankAccountId: run.bankAccountId,
        checkCount: (payments as any[]).length,
        totalAmount,
        startingCheckNumber,
        endingCheckNumber,
      },
      type: 'INSERT',
      transaction,
    },
  );

  return checkRun;
};

/**
 * Generates check run number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated check run number
 *
 * @example
 * ```typescript
 * const runNumber = await generateCheckRunNumber(sequelize);
 * // Returns: 'CHK-2024-001'
 * ```
 */
export const generateCheckRunNumber = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<string> => {
  const year = new Date().getFullYear();
  const prefix = `CHK-${year}-`;

  const result = await sequelize.query(
    `SELECT run_number FROM check_runs
     WHERE run_number LIKE :prefix
     ORDER BY run_number DESC LIMIT 1`,
    {
      replacements: { prefix: `${prefix}%` },
      type: 'SELECT',
      transaction,
    },
  );

  let sequence = 1;
  if (result && (result as any[]).length > 0) {
    const lastSequence = parseInt((result as any[])[0].run_number.split('-')[2], 10);
    sequence = lastSequence + 1;
  }

  return `${prefix}${sequence.toString().padStart(3, '0')}`;
};

/**
 * Prints individual check for payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {string} checkNumber - Check number
 * @param {number} checkRunId - Check run ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created check
 *
 * @example
 * ```typescript
 * const check = await printCheck(sequelize, 1, '100001', 5);
 * ```
 */
export const printCheck = async (
  sequelize: Sequelize,
  paymentId: number,
  checkNumber: string,
  checkRunId: number,
  transaction?: Transaction,
): Promise<any> => {
  const Payment = createPaymentModel(sequelize);

  const payment = await Payment.findByPk(paymentId, { transaction });
  if (!payment) {
    throw new Error('Payment not found');
  }

  const amountInWords = convertAmountToWords(parseFloat(payment.amount.toString()));

  const check = await sequelize.query(
    `INSERT INTO checks (
      payment_id, check_run_id, check_number, check_date, payee_name,
      amount, amount_in_words, bank_account_id, status, printed_at,
      created_at, updated_at
    ) VALUES (
      :paymentId, :checkRunId, :checkNumber, CURRENT_DATE, :payeeName,
      :amount, :amountInWords, :bankAccountId, 'printed', CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`,
    {
      replacements: {
        paymentId,
        checkRunId,
        checkNumber,
        payeeName: payment.supplierName,
        amount: payment.amount,
        amountInWords,
        bankAccountId: payment.bankAccountId,
      },
      type: 'INSERT',
      transaction,
    },
  );

  await payment.update({ checkNumber, status: 'transmitted' }, { transaction });

  return check;
};

/**
 * Converts numeric amount to words for check printing.
 *
 * @param {number} amount - Amount to convert
 * @returns {string} Amount in words
 *
 * @example
 * ```typescript
 * const words = convertAmountToWords(1234.56);
 * // Returns: 'One Thousand Two Hundred Thirty Four and 56/100'
 * ```
 */
export const convertAmountToWords = (amount: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const dollars = Math.floor(amount);
  const cents = Math.round((amount - dollars) * 100);

  let words = '';

  if (dollars === 0) {
    words = 'Zero';
  } else {
    if (dollars >= 1000) {
      const thousands = Math.floor(dollars / 1000);
      words += ones[thousands] + ' Thousand ';
      dollars %= 1000;
    }

    if (dollars >= 100) {
      const hundreds = Math.floor(dollars / 100);
      words += ones[hundreds] + ' Hundred ';
      dollars %= 100;
    }

    if (dollars >= 20) {
      const tensDigit = Math.floor(dollars / 10);
      words += tens[tensDigit] + ' ';
      dollars %= 10;
    } else if (dollars >= 10) {
      words += teens[dollars - 10] + ' ';
      dollars = 0;
    }

    if (dollars > 0) {
      words += ones[dollars] + ' ';
    }
  }

  words += `and ${cents.toString().padStart(2, '0')}/100`;
  return words.trim();
};

/**
 * Voids a payment and optionally reissues it.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {VoidPaymentDto} voidData - Void payment data
 * @param {string} userId - User voiding the payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Voided payment
 *
 * @example
 * ```typescript
 * const voided = await voidPayment(sequelize, {
 *   paymentId: 1,
 *   voidReason: 'Incorrect amount',
 *   voidDate: new Date(),
 *   reissuePayment: true
 * }, 'user123');
 * ```
 */
export const voidPayment = async (
  sequelize: Sequelize,
  voidData: VoidPaymentDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Payment = createPaymentModel(sequelize);

  const payment = await Payment.findByPk(voidData.paymentId, { transaction });
  if (!payment) {
    throw new Error('Payment not found');
  }

  if (payment.status === 'void') {
    throw new Error('Payment is already voided');
  }

  await payment.update(
    {
      status: 'void',
      voidDate: voidData.voidDate,
      voidReason: voidData.voidReason,
    },
    { transaction },
  );

  await createPaymentAuditTrail(
    sequelize,
    voidData.paymentId,
    'VOID',
    userId,
    { status: payment.status },
    { status: 'void', voidReason: voidData.voidReason },
    transaction,
  );

  if (voidData.reissuePayment) {
    // Create new payment as replacement
    const newPaymentNumber = await generatePaymentNumber(sequelize, new Date(), transaction);

    const newPayment = await Payment.create(
      {
        paymentNumber: newPaymentNumber,
        paymentRunId: payment.paymentRunId,
        paymentDate: new Date(),
        paymentMethodId: payment.paymentMethodId,
        paymentMethodType: payment.paymentMethodType,
        supplierId: payment.supplierId,
        supplierName: payment.supplierName,
        supplierSiteId: payment.supplierSiteId,
        bankAccountId: payment.bankAccountId,
        amount: payment.amount,
        currency: payment.currency,
        exchangeRate: payment.exchangeRate,
        baseAmount: payment.baseAmount,
        status: 'draft',
        referenceNumber: `Reissue of ${payment.paymentNumber}`,
        description: `Reissued payment - ${payment.description}`,
        invoiceCount: payment.invoiceCount,
        approvalStatus: 'none',
      },
      { transaction },
    );

    return newPayment;
  }

  return payment;
};

/**
 * Reconciles a payment with bank statement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ReconcilePaymentDto} reconData - Reconciliation data
 * @param {string} userId - User reconciling the payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment reconciliation record
 *
 * @example
 * ```typescript
 * const recon = await reconcilePayment(sequelize, {
 *   paymentId: 1,
 *   bankStatementId: 10,
 *   clearedDate: new Date(),
 *   clearedAmount: 5000.00
 * }, 'user123');
 * ```
 */
export const reconcilePayment = async (
  sequelize: Sequelize,
  reconData: ReconcilePaymentDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Payment = createPaymentModel(sequelize);

  const payment = await Payment.findByPk(reconData.paymentId, { transaction });
  if (!payment) {
    throw new Error('Payment not found');
  }

  const variance = parseFloat(payment.amount.toString()) - reconData.clearedAmount;
  const status = Math.abs(variance) < 0.01 ? 'matched' : 'variance';

  const reconciliation = await sequelize.query(
    `INSERT INTO payment_reconciliations (
      payment_id, reconciliation_date, bank_statement_id, bank_statement_date,
      cleared_amount, variance, status, reconciled_by, created_at, updated_at
    ) VALUES (
      :paymentId, CURRENT_DATE, :bankStatementId, CURRENT_DATE,
      :clearedAmount, :variance, :status, :userId, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`,
    {
      replacements: {
        paymentId: reconData.paymentId,
        bankStatementId: reconData.bankStatementId,
        clearedAmount: reconData.clearedAmount,
        variance,
        status,
        userId,
      },
      type: 'INSERT',
      transaction,
    },
  );

  await payment.update(
    {
      status: 'reconciled',
      clearedDate: reconData.clearedDate,
    },
    { transaction },
  );

  return reconciliation;
};

/**
 * Generates positive pay file for bank fraud prevention.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @param {Date} fileDate - File date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Positive pay file
 *
 * @example
 * ```typescript
 * const posPayFile = await generatePositivePayFile(sequelize, 1, new Date());
 * ```
 */
export const generatePositivePayFile = async (
  sequelize: Sequelize,
  bankAccountId: number,
  fileDate: Date,
  transaction?: Transaction,
): Promise<any> => {
  // Get checks issued for the bank account
  const checks = await sequelize.query(
    `SELECT c.* FROM checks c
     JOIN payments p ON c.payment_id = p.id
     WHERE p.bank_account_id = :bankAccountId
       AND c.status = 'issued'
       AND c.issued_at >= :startDate
       AND c.issued_at < :endDate`,
    {
      replacements: {
        bankAccountId,
        startDate: new Date(fileDate.getFullYear(), fileDate.getMonth(), fileDate.getDate()),
        endDate: new Date(fileDate.getFullYear(), fileDate.getMonth(), fileDate.getDate() + 1),
      },
      type: 'SELECT',
      transaction,
    },
  );

  if (!checks || (checks as any[]).length === 0) {
    throw new Error('No checks found for positive pay file generation');
  }

  // Generate file content
  const lines: string[] = [];
  let totalAmount = 0;

  for (const check of checks as any[]) {
    const line = [
      check.check_number.padStart(10, '0'),
      check.check_date.toISOString().split('T')[0].replace(/-/g, ''),
      (Math.round(parseFloat(check.amount) * 100)).toString().padStart(12, '0'),
      check.payee_name.slice(0, 35).padEnd(35),
    ].join('|');

    lines.push(line);
    totalAmount += parseFloat(check.amount);
  }

  const fileContent = lines.join('\n');
  const fileName = `POS_PAY_${bankAccountId}_${fileDate.toISOString().split('T')[0]}.txt`;

  const posPayFile = await sequelize.query(
    `INSERT INTO positive_pay_files (
      file_date, bank_account_id, file_sequence_number, check_count,
      total_amount, file_name, file_content, status, created_at, updated_at
    ) VALUES (
      :fileDate, :bankAccountId, 1, :checkCount,
      :totalAmount, :fileName, :fileContent, 'created', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`,
    {
      replacements: {
        fileDate,
        bankAccountId,
        checkCount: (checks as any[]).length,
        totalAmount,
        fileName,
        fileContent,
      },
      type: 'INSERT',
      transaction,
    },
  );

  return posPayFile;
};

/**
 * Places a hold on a payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {string} holdType - Hold type
 * @param {string} holdReason - Hold reason
 * @param {string} userId - User placing the hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment hold record
 *
 * @example
 * ```typescript
 * const hold = await placePaymentHold(sequelize, 1, 'manual', 'Pending verification', 'user123');
 * ```
 */
export const placePaymentHold = async (
  sequelize: Sequelize,
  paymentId: number,
  holdType: string,
  holdReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Payment = createPaymentModel(sequelize);

  const payment = await Payment.findByPk(paymentId, { transaction });
  if (!payment) {
    throw new Error('Payment not found');
  }

  const hold = await sequelize.query(
    `INSERT INTO payment_holds (
      payment_id, hold_type, hold_reason, hold_date, hold_by, created_at, updated_at
    ) VALUES (
      :paymentId, :holdType, :holdReason, CURRENT_DATE, :userId, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`,
    {
      replacements: {
        paymentId,
        holdType,
        holdReason,
        userId,
      },
      type: 'INSERT',
      transaction,
    },
  );

  await createPaymentAuditTrail(
    sequelize,
    paymentId,
    'HOLD',
    userId,
    {},
    { holdType, holdReason },
    transaction,
  );

  return hold;
};

/**
 * Releases a hold on a payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} holdId - Hold ID
 * @param {string} releaseNotes - Release notes
 * @param {string} userId - User releasing the hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Released payment hold
 *
 * @example
 * ```typescript
 * const released = await releasePaymentHold(sequelize, 1, 'Verification complete', 'user123');
 * ```
 */
export const releasePaymentHold = async (
  sequelize: Sequelize,
  holdId: number,
  releaseNotes: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const result = await sequelize.query(
    `UPDATE payment_holds
     SET release_date = CURRENT_DATE,
         released_by = :userId,
         release_notes = :releaseNotes,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :holdId
     RETURNING *`,
    {
      replacements: {
        holdId,
        userId,
        releaseNotes,
      },
      type: 'UPDATE',
      transaction,
    },
  );

  if (!result || (result as any[]).length === 0) {
    throw new Error('Payment hold not found');
  }

  const hold = (result as any[])[0];

  await createPaymentAuditTrail(
    sequelize,
    hold.payment_id,
    'RELEASE',
    userId,
    {},
    { releaseNotes },
    transaction,
  );

  return hold;
};

/**
 * Creates a payment approval record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ApprovePaymentDto} approvalData - Approval data
 * @param {string} userId - User approving the payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment approval record
 *
 * @example
 * ```typescript
 * const approval = await approvePayment(sequelize, {
 *   paymentId: 1,
 *   approvalLevel: 1,
 *   comments: 'Approved for payment'
 * }, 'manager123');
 * ```
 */
export const approvePayment = async (
  sequelize: Sequelize,
  approvalData: ApprovePaymentDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Payment = createPaymentModel(sequelize);

  const payment = await Payment.findByPk(approvalData.paymentId, { transaction });
  if (!payment) {
    throw new Error('Payment not found');
  }

  const approval = await sequelize.query(
    `INSERT INTO payment_approvals (
      payment_id, approval_level, approver_id, approver_name, approval_status,
      approval_date, comments, created_at, updated_at
    ) VALUES (
      :paymentId, :approvalLevel, :userId, :userName, 'approved',
      CURRENT_TIMESTAMP, :comments, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`,
    {
      replacements: {
        paymentId: approvalData.paymentId,
        approvalLevel: approvalData.approvalLevel,
        userId,
        userName: userId, // In production, fetch actual user name
        comments: approvalData.comments || '',
      },
      type: 'INSERT',
      transaction,
    },
  );

  await payment.update({ approvalStatus: 'approved', status: 'approved' }, { transaction });

  await createPaymentAuditTrail(
    sequelize,
    approvalData.paymentId,
    'APPROVE',
    userId,
    { approvalStatus: payment.approvalStatus },
    { approvalStatus: 'approved' },
    transaction,
  );

  return approval;
};

/**
 * Creates a payment schedule for recurring payments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreatePaymentScheduleDto} scheduleData - Schedule data
 * @param {string} userId - User creating the schedule
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created payment schedule
 *
 * @example
 * ```typescript
 * const schedule = await createPaymentSchedule(sequelize, {
 *   scheduleName: 'Monthly Rent Payment',
 *   scheduleType: 'recurring',
 *   frequency: 'monthly',
 *   startDate: new Date('2024-01-01'),
 *   paymentMethodId: 1,
 *   bankAccountId: 5
 * }, 'user123');
 * ```
 */
export const createPaymentSchedule = async (
  sequelize: Sequelize,
  scheduleData: CreatePaymentScheduleDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const nextRunDate = calculateNextRunDate(scheduleData.startDate, scheduleData.frequency);

  const schedule = await sequelize.query(
    `INSERT INTO payment_schedules (
      schedule_name, schedule_type, frequency, start_date, end_date,
      next_run_date, payment_method_id, bank_account_id, is_active,
      configuration, created_at, updated_at
    ) VALUES (
      :scheduleName, :scheduleType, :frequency, :startDate, :endDate,
      :nextRunDate, :paymentMethodId, :bankAccountId, true,
      '{}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`,
    {
      replacements: {
        scheduleName: scheduleData.scheduleName,
        scheduleType: scheduleData.scheduleType,
        frequency: scheduleData.frequency,
        startDate: scheduleData.startDate,
        endDate: scheduleData.endDate || null,
        nextRunDate,
        paymentMethodId: scheduleData.paymentMethodId,
        bankAccountId: scheduleData.bankAccountId,
      },
      type: 'INSERT',
      transaction,
    },
  );

  return schedule;
};

/**
 * Calculates next run date based on frequency.
 *
 * @param {Date} startDate - Start date
 * @param {string} frequency - Frequency (daily, weekly, monthly, etc.)
 * @returns {Date} Next run date
 *
 * @example
 * ```typescript
 * const nextRun = calculateNextRunDate(new Date('2024-01-01'), 'monthly');
 * // Returns: 2024-02-01
 * ```
 */
export const calculateNextRunDate = (startDate: Date, frequency: string): Date => {
  const next = new Date(startDate);

  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'biweekly':
      next.setDate(next.getDate() + 14);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    default:
      throw new Error(`Unknown frequency: ${frequency}`);
  }

  return next;
};

/**
 * Creates a payment audit trail entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {string} action - Action performed
 * @param {string} userId - User performing action
 * @param {Record<string, any>} oldValues - Old values
 * @param {Record<string, any>} newValues - New values
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Audit trail entry
 *
 * @example
 * ```typescript
 * await createPaymentAuditTrail(sequelize, 1, 'APPROVE', 'user123',
 *   { status: 'pending' }, { status: 'approved' });
 * ```
 */
export const createPaymentAuditTrail = async (
  sequelize: Sequelize,
  paymentId: number,
  action: string,
  userId: string,
  oldValues: Record<string, any>,
  newValues: Record<string, any>,
  transaction?: Transaction,
): Promise<any> => {
  const audit = await sequelize.query(
    `INSERT INTO payment_audit_trails (
      payment_id, action, action_date, user_id, user_name,
      old_values, new_values, ip_address, created_at, updated_at
    ) VALUES (
      :paymentId, :action, CURRENT_TIMESTAMP, :userId, :userName,
      :oldValues, :newValues, :ipAddress, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`,
    {
      replacements: {
        paymentId,
        action,
        userId,
        userName: userId, // In production, fetch actual user name
        oldValues: JSON.stringify(oldValues),
        newValues: JSON.stringify(newValues),
        ipAddress: '127.0.0.1', // In production, get from request
      },
      type: 'INSERT',
      transaction,
    },
  );

  return audit;
};

/**
 * Retrieves payment history with audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Payment audit trail
 *
 * @example
 * ```typescript
 * const history = await getPaymentHistory(sequelize, 1);
 * console.log(history.length); // Number of audit entries
 * ```
 */
export const getPaymentHistory = async (
  sequelize: Sequelize,
  paymentId: number,
  transaction?: Transaction,
): Promise<any[]> => {
  const result = await sequelize.query(
    `SELECT * FROM payment_audit_trails
     WHERE payment_id = :paymentId
     ORDER BY action_date DESC`,
    {
      replacements: { paymentId },
      type: 'SELECT',
      transaction,
    },
  );

  return result as any[];
};

/**
 * Cancels a payment run before processing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentRunId - Payment run ID
 * @param {string} userId - User cancelling the run
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancelled payment run
 *
 * @example
 * ```typescript
 * const cancelled = await cancelPaymentRun(sequelize, 1, 'user123');
 * ```
 */
export const cancelPaymentRun = async (
  sequelize: Sequelize,
  paymentRunId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const PaymentRun = createPaymentRunModel(sequelize);

  const run = await PaymentRun.findByPk(paymentRunId, { transaction });
  if (!run) {
    throw new Error('Payment run not found');
  }

  if (run.status === 'transmitted' || run.status === 'completed') {
    throw new Error('Cannot cancel transmitted or completed payment run');
  }

  await run.update({ status: 'cancelled' }, { transaction });

  // Cancel all payments in the run
  await sequelize.query(
    `UPDATE payments SET status = 'cancelled' WHERE payment_run_id = :paymentRunId`,
    {
      replacements: { paymentRunId },
      type: 'UPDATE',
      transaction,
    },
  );

  return run;
};

/**
 * Retrieves bank account details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BankAccount>} Bank account details
 *
 * @example
 * ```typescript
 * const account = await getBankAccount(sequelize, 1);
 * console.log(account.accountNumber);
 * ```
 */
export const getBankAccount = async (
  sequelize: Sequelize,
  bankAccountId: number,
  transaction?: Transaction,
): Promise<BankAccount> => {
  const result = await sequelize.query(
    'SELECT * FROM bank_accounts WHERE id = :bankAccountId AND is_active = true',
    {
      replacements: { bankAccountId },
      type: 'SELECT',
      transaction,
    },
  );

  if (!result || (result as any[]).length === 0) {
    throw new Error(`Bank account ${bankAccountId} not found or inactive`);
  }

  return (result as any[])[0] as BankAccount;
};

/**
 * Updates bank account balance after payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @param {number} amount - Amount to deduct
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated bank account
 *
 * @example
 * ```typescript
 * await updateBankAccountBalance(sequelize, 1, 5000.00);
 * ```
 */
export const updateBankAccountBalance = async (
  sequelize: Sequelize,
  bankAccountId: number,
  amount: number,
  transaction?: Transaction,
): Promise<any> => {
  const result = await sequelize.query(
    `UPDATE bank_accounts
     SET balance = balance - :amount,
         available_balance = available_balance - :amount,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :bankAccountId
     RETURNING *`,
    {
      replacements: {
        bankAccountId,
        amount,
      },
      type: 'UPDATE',
      transaction,
    },
  );

  if (!result || (result as any[]).length === 0) {
    throw new Error('Bank account not found');
  }

  return (result as any[])[0];
};

// ============================================================================
// NESTJS CONTROLLERS
// ============================================================================

/**
 * NestJS Controller for Payment Run operations.
 */
@ApiTags('Payment Runs')
@Controller('api/v1/payment-runs')
@Injectable()
export class PaymentRunsController {
  constructor(private readonly sequelize: Sequelize) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new payment run' })
  @ApiResponse({ status: 201, description: 'Payment run created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createRun(
    @Body(ValidationPipe) createDto: CreatePaymentRunDto,
    @Query('userId') userId: string,
  ): Promise<any> {
    return createPaymentRun(this.sequelize, createDto, userId);
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve payment run' })
  @ApiResponse({ status: 200, description: 'Payment run approved' })
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId') userId: string,
  ): Promise<any> {
    return approvePaymentRun(this.sequelize, id, userId);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel payment run' })
  @ApiResponse({ status: 200, description: 'Payment run cancelled' })
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId') userId: string,
  ): Promise<any> {
    return cancelPaymentRun(this.sequelize, id, userId);
  }
}

/**
 * NestJS Controller for Payment operations.
 */
@ApiTags('Payments')
@Controller('api/v1/payments')
@Injectable()
export class PaymentsController {
  constructor(private readonly sequelize: Sequelize) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create payment' })
  @ApiResponse({ status: 201, description: 'Payment created' })
  async create(
    @Body(ValidationPipe) createDto: CreatePaymentDto,
    @Query('userId') userId: string,
  ): Promise<any> {
    const paymentNumber = await generatePaymentNumber(this.sequelize, createDto.paymentDate);
    return { paymentNumber };
  }

  @Post(':id/void')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Void payment' })
  @ApiResponse({ status: 200, description: 'Payment voided' })
  async void(
    @Body(ValidationPipe) voidDto: VoidPaymentDto,
    @Query('userId') userId: string,
  ): Promise<any> {
    return voidPayment(this.sequelize, voidDto, userId);
  }

  @Post(':id/reconcile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reconcile payment' })
  @ApiResponse({ status: 200, description: 'Payment reconciled' })
  async reconcile(
    @Body(ValidationPipe) reconDto: ReconcilePaymentDto,
    @Query('userId') userId: string,
  ): Promise<any> {
    return reconcilePayment(this.sequelize, reconDto, userId);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get payment history' })
  @ApiResponse({ status: 200, description: 'Payment history retrieved' })
  async getHistory(@Param('id', ParseIntPipe) id: number): Promise<any[]> {
    return getPaymentHistory(this.sequelize, id);
  }
}

/**
 * NestJS Controller for ACH processing.
 */
@ApiTags('ACH Processing')
@Controller('api/v1/ach')
@Injectable()
export class ACHProcessingController {
  constructor(private readonly sequelize: Sequelize) {}

  @Post('batches')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Process ACH batch' })
  @ApiResponse({ status: 201, description: 'ACH batch created' })
  async processBatch(
    @Body(ValidationPipe) batchDto: ProcessACHBatchDto,
    @Query('userId') userId: string,
  ): Promise<any> {
    return processACHBatch(this.sequelize, batchDto, userId);
  }

  @Post('batches/:id/transmit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Transmit ACH batch to bank' })
  @ApiResponse({ status: 200, description: 'ACH batch transmitted' })
  async transmit(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId') userId: string,
  ): Promise<any> {
    return transmitACHBatch(this.sequelize, id, userId);
  }

  @Get('batches/:id/validate')
  @ApiOperation({ summary: 'Validate ACH batch' })
  @ApiResponse({ status: 200, description: 'Validation result' })
  async validate(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return validateACHBatch(this.sequelize, id);
  }
}
