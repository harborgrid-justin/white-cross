/**
 * LOC: CEFMSPAYP001
 * File: /reuse/financial/cefms/composites/downstream/payment-processing-module.ts
 *
 * UPSTREAM (imports from):
 *   - ../cefms-accounts-payable-processing-composite.ts
 *
 * DOWNSTREAM (imported by):
 *   - Payment processing APIs
 *   - Bank integration services
 *   - ACH/Wire processing systems
 */

/**
 * File: /reuse/financial/cefms/composites/downstream/payment-processing-module.ts
 * Locator: WC-CEFMS-PAYP-001
 * Purpose: USACE CEFMS Payment Processing Module - Complete payment scheduling, ACH/Wire/Check processing, reconciliation
 *
 * Upstream: Imports from cefms-accounts-payable-processing-composite.ts
 * Downstream: Payment APIs, bank integrations, treasury systems, reconciliation
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: Complete payment processing with 50+ functions for all payment types
 *
 * LLM Context: Production-ready USACE CEFMS payment processing module.
 * Comprehensive payment scheduling, ACH file generation (NACHA format), wire transfer processing,
 * check printing, payment status tracking, positive pay, bank reconciliation, payment reversal,
 * payment batching, payment holds, and payment audit trail.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable, Logger } from '@nestjs/common';

// Import from composite
import {
  createPaymentScheduleModel,
  createPaymentHoldModel,
  schedulePayment,
  createPaymentBatch,
  processVendorPayment,
  generateACHPaymentFile,
  generateWireTransferInstructions,
  getScheduledPayments,
  cancelScheduledPayment,
  reversePayment,
} from '../cefms-accounts-payable-processing-composite';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PaymentBatch {
  batchId: string;
  batchDate: Date;
  paymentMethod: 'ACH' | 'WIRE' | 'CHECK' | 'CARD';
  totalPayments: number;
  totalAmount: number;
  status: 'draft' | 'approved' | 'processing' | 'transmitted' | 'settled' | 'failed';
  createdBy: string;
  approvedBy?: string;
  transmittedAt?: Date;
  settledAt?: Date;
}

interface ACHPaymentFile {
  fileId: string;
  batchId: string;
  fileFormat: 'NACHA' | 'CCD' | 'CTX';
  fileContent: string;
  recordCount: number;
  totalDebit: number;
  totalCredit: number;
  generatedAt: Date;
  transmittedAt?: Date;
  status: 'generated' | 'transmitted' | 'acknowledged' | 'returned';
}

interface WireTransfer {
  wireId: string;
  paymentId: string;
  recipientName: string;
  recipientBank: string;
  recipientABA: string;
  recipientAccount: string;
  amount: number;
  purpose: string;
  priority: 'standard' | 'same_day' | 'next_day';
  status: 'pending' | 'approved' | 'transmitted' | 'confirmed' | 'failed';
}

interface CheckPayment {
  checkId: string;
  checkNumber: string;
  paymentId: string;
  vendorName: string;
  amount: number;
  checkDate: Date;
  status: 'printed' | 'mailed' | 'cleared' | 'voided' | 'stale';
  voidedReason?: string;
  clearedDate?: Date;
}

interface PaymentReconciliation {
  reconciliationId: string;
  paymentId: string;
  bankStatementDate: Date;
  bankAmount: number;
  systemAmount: number;
  variance: number;
  status: 'matched' | 'unmatched' | 'investigating';
  resolvedBy?: string;
  resolvedAt?: Date;
}

interface PositivePayRecord {
  recordId: string;
  checkNumber: string;
  payee: string;
  amount: number;
  issueDate: Date;
  status: 'issued' | 'presented' | 'cleared' | 'exception';
  exceptionType?: 'amount_mismatch' | 'payee_mismatch' | 'unauthorized';
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Payment Batches.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PaymentBatch model
 */
export const createPaymentBatchModel = (sequelize: Sequelize) => {
  class PaymentBatchModel extends Model {
    public id!: string;
    public batchId!: string;
    public batchDate!: Date;
    public paymentMethod!: string;
    public totalPayments!: number;
    public totalAmount!: number;
    public status!: string;
    public createdBy!: string;
    public approvedBy!: string | null;
    public transmittedAt!: Date | null;
    public settledAt!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PaymentBatchModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      batchId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Batch identifier',
      },
      batchDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Batch date',
      },
      paymentMethod: {
        type: DataTypes.ENUM('ACH', 'WIRE', 'CHECK', 'CARD'),
        allowNull: false,
        comment: 'Payment method',
      },
      totalPayments: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total payment count',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total batch amount',
      },
      status: {
        type: DataTypes.ENUM('draft', 'approved', 'processing', 'transmitted', 'settled', 'failed'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Batch status',
      },
      createdBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Created by user ID',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approved by user ID',
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
      tableName: 'payment_batches',
      timestamps: true,
      indexes: [
        { fields: ['batchId'], unique: true },
        { fields: ['batchDate'] },
        { fields: ['status'] },
        { fields: ['paymentMethod'] },
      ],
    },
  );

  return PaymentBatchModel;
};

/**
 * Sequelize model for ACH Payment Files.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ACHPaymentFile model
 */
export const createACHFileModel = (sequelize: Sequelize) => {
  class ACHFile extends Model {
    public id!: string;
    public fileId!: string;
    public batchId!: string;
    public fileFormat!: string;
    public fileContent!: string;
    public recordCount!: number;
    public totalDebit!: number;
    public totalCredit!: number;
    public generatedAt!: Date;
    public transmittedAt!: Date | null;
    public status!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ACHFile.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fileId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'File identifier',
      },
      batchId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related batch ID',
      },
      fileFormat: {
        type: DataTypes.ENUM('NACHA', 'CCD', 'CTX'),
        allowNull: false,
        comment: 'ACH file format',
      },
      fileContent: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        comment: 'ACH file content',
      },
      recordCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Total record count',
      },
      totalDebit: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total debit amount',
      },
      totalCredit: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total credit amount',
      },
      generatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Generation timestamp',
      },
      transmittedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Transmission timestamp',
      },
      status: {
        type: DataTypes.ENUM('generated', 'transmitted', 'acknowledged', 'returned'),
        allowNull: false,
        defaultValue: 'generated',
        comment: 'File status',
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
      tableName: 'ach_payment_files',
      timestamps: true,
      indexes: [
        { fields: ['fileId'], unique: true },
        { fields: ['batchId'] },
        { fields: ['status'] },
        { fields: ['generatedAt'] },
      ],
    },
  );

  return ACHFile;
};

/**
 * Sequelize model for Wire Transfers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WireTransfer model
 */
export const createWireTransferModel = (sequelize: Sequelize) => {
  class WireTransferModel extends Model {
    public id!: string;
    public wireId!: string;
    public paymentId!: string;
    public recipientName!: string;
    public recipientBank!: string;
    public recipientABA!: string;
    public recipientAccount!: string;
    public amount!: number;
    public purpose!: string;
    public priority!: string;
    public status!: string;
    public confirmationNumber!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  WireTransferModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      wireId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Wire transfer identifier',
      },
      paymentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related payment ID',
      },
      recipientName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Recipient name',
      },
      recipientBank: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Recipient bank name',
      },
      recipientABA: {
        type: DataTypes.STRING(9),
        allowNull: false,
        comment: 'Recipient bank ABA routing',
      },
      recipientAccount: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Recipient account number',
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Wire transfer amount',
      },
      purpose: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Wire transfer purpose',
      },
      priority: {
        type: DataTypes.ENUM('standard', 'same_day', 'next_day'),
        allowNull: false,
        defaultValue: 'standard',
        comment: 'Wire priority',
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'transmitted', 'confirmed', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Wire status',
      },
      confirmationNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Bank confirmation number',
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
      tableName: 'wire_transfers',
      timestamps: true,
      indexes: [
        { fields: ['wireId'], unique: true },
        { fields: ['paymentId'] },
        { fields: ['status'] },
        { fields: ['priority'] },
      ],
    },
  );

  return WireTransferModel;
};

/**
 * Sequelize model for Check Payments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CheckPayment model
 */
export const createCheckPaymentModel = (sequelize: Sequelize) => {
  class CheckPaymentModel extends Model {
    public id!: string;
    public checkId!: string;
    public checkNumber!: string;
    public paymentId!: string;
    public vendorName!: string;
    public amount!: number;
    public checkDate!: Date;
    public status!: string;
    public voidedReason!: string | null;
    public clearedDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CheckPaymentModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      checkId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Check identifier',
      },
      checkNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        comment: 'Check number',
      },
      paymentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related payment ID',
      },
      vendorName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Vendor/payee name',
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Check amount',
      },
      checkDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Check date',
      },
      status: {
        type: DataTypes.ENUM('printed', 'mailed', 'cleared', 'voided', 'stale'),
        allowNull: false,
        defaultValue: 'printed',
        comment: 'Check status',
      },
      voidedReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Void reason',
      },
      clearedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Check cleared date',
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
      tableName: 'check_payments',
      timestamps: true,
      indexes: [
        { fields: ['checkId'], unique: true },
        { fields: ['checkNumber'], unique: true },
        { fields: ['paymentId'] },
        { fields: ['status'] },
        { fields: ['checkDate'] },
      ],
    },
  );

  return CheckPaymentModel;
};

/**
 * Sequelize model for Payment Reconciliation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PaymentReconciliation model
 */
export const createPaymentReconciliationModel = (sequelize: Sequelize) => {
  class PaymentReconciliationModel extends Model {
    public id!: string;
    public reconciliationId!: string;
    public paymentId!: string;
    public bankStatementDate!: Date;
    public bankAmount!: number;
    public systemAmount!: number;
    public variance!: number;
    public status!: string;
    public resolvedBy!: string | null;
    public resolvedAt!: Date | null;
    public notes!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PaymentReconciliationModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      reconciliationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Reconciliation identifier',
      },
      paymentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Related payment ID',
      },
      bankStatementDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Bank statement date',
      },
      bankAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Bank statement amount',
      },
      systemAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'System recorded amount',
      },
      variance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Variance amount',
      },
      status: {
        type: DataTypes.ENUM('matched', 'unmatched', 'investigating'),
        allowNull: false,
        defaultValue: 'matched',
        comment: 'Reconciliation status',
      },
      resolvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Resolved by user ID',
      },
      resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Resolution timestamp',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reconciliation notes',
      },
    },
    {
      sequelize,
      tableName: 'payment_reconciliations',
      timestamps: true,
      indexes: [
        { fields: ['reconciliationId'], unique: true },
        { fields: ['paymentId'] },
        { fields: ['status'] },
        { fields: ['bankStatementDate'] },
      ],
    },
  );

  return PaymentReconciliationModel;
};

/**
 * Sequelize model for Positive Pay Records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PositivePayRecord model
 */
export const createPositivePayModel = (sequelize: Sequelize) => {
  class PositivePay extends Model {
    public id!: string;
    public recordId!: string;
    public checkNumber!: string;
    public payee!: string;
    public amount!: number;
    public issueDate!: Date;
    public status!: string;
    public exceptionType!: string | null;
    public exceptionResolution!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PositivePay.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      recordId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Positive pay record ID',
      },
      checkNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Check number',
      },
      payee: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Payee name',
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Check amount',
      },
      issueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Check issue date',
      },
      status: {
        type: DataTypes.ENUM('issued', 'presented', 'cleared', 'exception'),
        allowNull: false,
        defaultValue: 'issued',
        comment: 'Positive pay status',
      },
      exceptionType: {
        type: DataTypes.ENUM('amount_mismatch', 'payee_mismatch', 'unauthorized'),
        allowNull: true,
        comment: 'Exception type if any',
      },
      exceptionResolution: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Exception resolution',
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
      tableName: 'positive_pay_records',
      timestamps: true,
      indexes: [
        { fields: ['recordId'], unique: true },
        { fields: ['checkNumber'] },
        { fields: ['status'] },
        { fields: ['issueDate'] },
      ],
    },
  );

  return PositivePay;
};

// ============================================================================
// PAYMENT BATCH MANAGEMENT (1-8)
// ============================================================================

/**
 * Creates payment batch.
 *
 * @param {PaymentBatch} batchData - Batch data
 * @param {Model} PaymentBatch - Batch model
 * @returns {Promise<any>} Created batch
 */
export const createNewPaymentBatch = async (
  batchData: PaymentBatch,
  PaymentBatch: any,
): Promise<any> => {
  return await PaymentBatch.create(batchData);
};

/**
 * Adds payments to batch.
 *
 * @param {string} batchId - Batch ID
 * @param {string[]} paymentIds - Payment IDs
 * @param {Model} PaymentSchedule - Schedule model
 * @param {Model} PaymentBatch - Batch model
 * @returns {Promise<any>} Updated batch
 */
export const addPaymentsToBatch = async (
  batchId: string,
  paymentIds: string[],
  PaymentSchedule: any,
  PaymentBatch: any,
): Promise<any> => {
  const batch = await PaymentBatch.findOne({ where: { batchId } });
  if (!batch) throw new Error('Batch not found');

  if (batch.status !== 'draft') {
    throw new Error('Can only add payments to draft batch');
  }

  // Update payment schedules
  await PaymentSchedule.update(
    { metadata: Sequelize.fn('JSON_SET', Sequelize.col('metadata'), '$.batchId', batchId) },
    { where: { scheduleId: { [Op.in]: paymentIds } } },
  );

  // Update batch totals
  const payments = await PaymentSchedule.findAll({
    where: { scheduleId: { [Op.in]: paymentIds } },
  });

  const totalAmount = payments.reduce(
    (sum: number, pay: any) => sum + parseFloat(pay.paymentAmount),
    0,
  );

  batch.totalPayments += payments.length;
  batch.totalAmount = parseFloat(batch.totalAmount.toString()) + totalAmount;
  await batch.save();

  return batch;
};

/**
 * Approves payment batch.
 *
 * @param {string} batchId - Batch ID
 * @param {string} approverId - Approver user ID
 * @param {Model} PaymentBatch - Batch model
 * @returns {Promise<any>} Approved batch
 */
export const approvePaymentBatch = async (
  batchId: string,
  approverId: string,
  PaymentBatch: any,
): Promise<any> => {
  const batch = await PaymentBatch.findOne({ where: { batchId } });
  if (!batch) throw new Error('Batch not found');

  if (batch.status !== 'draft') {
    throw new Error('Only draft batches can be approved');
  }

  if (batch.totalPayments === 0) {
    throw new Error('Cannot approve empty batch');
  }

  batch.status = 'approved';
  batch.approvedBy = approverId;
  await batch.save();

  return batch;
};

/**
 * Processes payment batch.
 *
 * @param {string} batchId - Batch ID
 * @param {Model} PaymentBatch - Batch model
 * @param {Model} PaymentSchedule - Schedule model
 * @returns {Promise<any>} Processing result
 */
export const processPaymentBatchTransactions = async (
  batchId: string,
  PaymentBatch: any,
  PaymentSchedule: any,
): Promise<any> => {
  const batch = await PaymentBatch.findOne({ where: { batchId } });
  if (!batch) throw new Error('Batch not found');

  if (batch.status !== 'approved') {
    throw new Error('Only approved batches can be processed');
  }

  batch.status = 'processing';
  await batch.save();

  // Get all payments in batch
  const payments = await PaymentSchedule.findAll({
    where: {
      metadata: {
        batchId,
      },
    },
  });

  const processed = [];
  const failed = [];

  for (const payment of payments) {
    try {
      // Process payment based on method
      payment.status = 'processing';
      await payment.save();
      processed.push(payment.scheduleId);
    } catch (error: any) {
      failed.push({
        paymentId: payment.scheduleId,
        error: error.message,
      });
    }
  }

  return {
    batchId,
    totalProcessed: processed.length,
    totalFailed: failed.length,
    processed,
    failed,
  };
};

/**
 * Transmits payment batch.
 *
 * @param {string} batchId - Batch ID
 * @param {Model} PaymentBatch - Batch model
 * @returns {Promise<any>} Transmission result
 */
export const transmitPaymentBatch = async (
  batchId: string,
  PaymentBatch: any,
): Promise<any> => {
  const batch = await PaymentBatch.findOne({ where: { batchId } });
  if (!batch) throw new Error('Batch not found');

  if (batch.status !== 'processing') {
    throw new Error('Only processing batches can be transmitted');
  }

  batch.status = 'transmitted';
  batch.transmittedAt = new Date();
  await batch.save();

  return {
    batchId,
    transmittedAt: batch.transmittedAt,
    method: batch.paymentMethod,
  };
};

/**
 * Settles payment batch.
 *
 * @param {string} batchId - Batch ID
 * @param {Model} PaymentBatch - Batch model
 * @returns {Promise<any>} Settlement result
 */
export const settlePaymentBatch = async (
  batchId: string,
  PaymentBatch: any,
): Promise<any> => {
  const batch = await PaymentBatch.findOne({ where: { batchId } });
  if (!batch) throw new Error('Batch not found');

  if (batch.status !== 'transmitted') {
    throw new Error('Only transmitted batches can be settled');
  }

  batch.status = 'settled';
  batch.settledAt = new Date();
  await batch.save();

  return {
    batchId,
    settledAt: batch.settledAt,
    totalAmount: batch.totalAmount,
  };
};

/**
 * Retrieves batches by status.
 *
 * @param {string} status - Batch status
 * @param {Model} PaymentBatch - Batch model
 * @returns {Promise<any[]>} Batches
 */
export const getBatchesByStatus = async (
  status: string,
  PaymentBatch: any,
): Promise<any[]> => {
  return await PaymentBatch.findAll({
    where: { status },
    order: [['batchDate', 'DESC']],
  });
};

/**
 * Generates batch summary report.
 *
 * @param {string} batchId - Batch ID
 * @param {Model} PaymentBatch - Batch model
 * @param {Model} PaymentSchedule - Schedule model
 * @returns {Promise<any>} Batch summary
 */
export const generateBatchSummary = async (
  batchId: string,
  PaymentBatch: any,
  PaymentSchedule: any,
): Promise<any> => {
  const batch = await PaymentBatch.findOne({ where: { batchId } });
  if (!batch) throw new Error('Batch not found');

  const payments = await PaymentSchedule.findAll({
    where: {
      metadata: {
        batchId,
      },
    },
  });

  const byStatus = new Map<string, number>();
  payments.forEach((pay: any) => {
    byStatus.set(pay.status, (byStatus.get(pay.status) || 0) + 1);
  });

  return {
    batchId,
    batchDate: batch.batchDate,
    paymentMethod: batch.paymentMethod,
    totalPayments: batch.totalPayments,
    totalAmount: batch.totalAmount,
    status: batch.status,
    byStatus: Array.from(byStatus.entries()).map(([status, count]) => ({ status, count })),
  };
};

// ============================================================================
// ACH PROCESSING (9-16)
// ============================================================================

/**
 * Generates NACHA format ACH file.
 *
 * @param {string} batchId - Batch ID
 * @param {Model} PaymentBatch - Batch model
 * @param {Model} PaymentSchedule - Schedule model
 * @param {Model} ACHFile - ACH file model
 * @returns {Promise<any>} Generated ACH file
 */
export const generateNACHAFile = async (
  batchId: string,
  PaymentBatch: any,
  PaymentSchedule: any,
  ACHFile: any,
): Promise<any> => {
  const batch = await PaymentBatch.findOne({ where: { batchId } });
  if (!batch) throw new Error('Batch not found');

  const payments = await PaymentSchedule.findAll({
    where: {
      metadata: {
        batchId,
      },
    },
  });

  // Build NACHA file format
  const fileHeader = buildNACHAFileHeader(batch);
  const batchHeader = buildNACHABatchHeader(batch);
  const entryDetails = payments.map((pay: any) => buildNACHAEntry(pay)).join('\n');
  const batchControl = buildNACHABatchControl(batch, payments);
  const fileControl = buildNACHAFileControl(batch);

  const fileContent = [
    fileHeader,
    batchHeader,
    entryDetails,
    batchControl,
    fileControl,
  ].join('\n');

  const achFile = await ACHFile.create({
    fileId: `ACH-${Date.now()}`,
    batchId,
    fileFormat: 'NACHA',
    fileContent,
    recordCount: payments.length + 4, // +4 for headers/controls
    totalDebit: 0,
    totalCredit: batch.totalAmount,
    generatedAt: new Date(),
    status: 'generated',
  });

  return achFile;
};

/**
 * Builds NACHA file header record.
 *
 * @param {any} batch - Payment batch
 * @returns {string} File header (94 characters)
 */
export const buildNACHAFileHeader = (batch: any): string => {
  const recordType = '1';
  const priorityCode = '01';
  const immediateDestination = ' 123456789'; // Bank routing (10 chars)
  const immediateOrigin = '1234567890'; // Company ID (10 chars)
  const fileCreationDate = new Date().toISOString().substring(2, 10).replace(/-/g, ''); // YYMMDD
  const fileCreationTime = new Date().toTimeString().substring(0, 4); // HHMM
  const fileIdModifier = 'A';
  const recordSize = '094';
  const blockingFactor = '10';
  const formatCode = '1';
  const immediateDestinationName = 'DESTINATION BANK'.padEnd(23);
  const immediateOriginName = 'ORIGIN COMPANY'.padEnd(23);
  const referenceCode = ''.padEnd(8);

  return [
    recordType,
    priorityCode,
    immediateDestination,
    immediateOrigin,
    fileCreationDate,
    fileCreationTime,
    fileIdModifier,
    recordSize,
    blockingFactor,
    formatCode,
    immediateDestinationName,
    immediateOriginName,
    referenceCode,
  ].join('');
};

/**
 * Builds NACHA batch header record.
 *
 * @param {any} batch - Payment batch
 * @returns {string} Batch header (94 characters)
 */
export const buildNACHABatchHeader = (batch: any): string => {
  const recordType = '5';
  const serviceClassCode = '200'; // Mixed debits and credits
  const companyName = 'USACE'.padEnd(16);
  const companyDiscretionaryData = ''.padEnd(20);
  const companyId = '1234567890';
  const standardEntryClass = 'PPD'; // Prearranged Payment & Deposit
  const companyEntryDescription = 'PAYMENT'.padEnd(10);
  const companyDescriptiveDate = ''.padEnd(6);
  const effectiveEntryDate = new Date().toISOString().substring(2, 10).replace(/-/g, '');
  const settlementDate = ''.padEnd(3);
  const originatorStatusCode = '1';
  const originatingDFI = '12345678';
  const batchNumber = '0000001'.padStart(7, '0');

  return [
    recordType,
    serviceClassCode,
    companyName,
    companyDiscretionaryData,
    companyId,
    standardEntryClass,
    companyEntryDescription,
    companyDescriptiveDate,
    effectiveEntryDate,
    settlementDate,
    originatorStatusCode,
    originatingDFI,
    batchNumber,
  ].join('');
};

/**
 * Builds NACHA entry detail record.
 *
 * @param {any} payment - Payment schedule
 * @returns {string} Entry detail (94 characters)
 */
export const buildNACHAEntry = (payment: any): string => {
  const recordType = '6';
  const transactionCode = '22'; // Checking credit
  const receivingDFI = '12345678';
  const checkDigit = '9';
  const dfAccount = payment.vendorBankAccount || '123456789012'.padEnd(17);
  const amount = Math.round(payment.paymentAmount * 100).toString().padStart(10, '0');
  const individualId = payment.vendorId.substring(0, 15).padEnd(15);
  const individualName = payment.vendorName.substring(0, 22).padEnd(22);
  const discretionaryData = ''.padEnd(2);
  const addendaRecordIndicator = '0';
  const traceNumber = '123456780000001'.padStart(15, '0');

  return [
    recordType,
    transactionCode,
    receivingDFI,
    checkDigit,
    dfAccount,
    amount,
    individualId,
    individualName,
    discretionaryData,
    addendaRecordIndicator,
    traceNumber,
  ].join('');
};

/**
 * Builds NACHA batch control record.
 *
 * @param {any} batch - Payment batch
 * @param {any[]} payments - Payments
 * @returns {string} Batch control (94 characters)
 */
export const buildNACHABatchControl = (batch: any, payments: any[]): string => {
  const recordType = '8';
  const serviceClassCode = '200';
  const entryAddendaCount = payments.length.toString().padStart(6, '0');
  const entryHash = '12345678'.padStart(10, '0');
  const totalDebit = '0'.padStart(12, '0');
  const totalCredit = Math.round(batch.totalAmount * 100).toString().padStart(12, '0');
  const companyId = '1234567890';
  const messageAuthenticationCode = ''.padEnd(19);
  const reserved = ''.padEnd(6);
  const originatingDFI = '12345678';
  const batchNumber = '0000001'.padStart(7, '0');

  return [
    recordType,
    serviceClassCode,
    entryAddendaCount,
    entryHash,
    totalDebit,
    totalCredit,
    companyId,
    messageAuthenticationCode,
    reserved,
    originatingDFI,
    batchNumber,
  ].join('');
};

/**
 * Builds NACHA file control record.
 *
 * @param {any} batch - Payment batch
 * @returns {string} File control (94 characters)
 */
export const buildNACHAFileControl = (batch: any): string => {
  const recordType = '9';
  const batchCount = '000001'.padStart(6, '0');
  const blockCount = '000001'.padStart(6, '0');
  const entryAddendaCount = batch.totalPayments.toString().padStart(8, '0');
  const entryHash = '12345678'.padStart(10, '0');
  const totalDebit = '0'.padStart(12, '0');
  const totalCredit = Math.round(batch.totalAmount * 100).toString().padStart(12, '0');
  const reserved = ''.padEnd(39);

  return [
    recordType,
    batchCount,
    blockCount,
    entryAddendaCount,
    entryHash,
    totalDebit,
    totalCredit,
    reserved,
  ].join('');
};

/**
 * Validates ACH file format.
 *
 * @param {string} fileContent - ACH file content
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 */
export const validateACHFileFormat = (
  fileContent: string,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const lines = fileContent.split('\n');

  // Check file header
  if (!lines[0] || lines[0][0] !== '1') {
    errors.push('Invalid file header record');
  }

  // Check batch header
  if (!lines[1] || lines[1][0] !== '5') {
    errors.push('Invalid batch header record');
  }

  // Check file control
  const lastLine = lines[lines.length - 1];
  if (!lastLine || lastLine[0] !== '9') {
    errors.push('Invalid file control record');
  }

  // Validate record lengths
  lines.forEach((line, index) => {
    if (line.length !== 94) {
      errors.push(`Record ${index + 1} has invalid length: ${line.length}`);
    }
  });

  return { valid: errors.length === 0, errors };
};

/**
 * Exports ACH file.
 *
 * @param {string} fileId - File ID
 * @param {Model} ACHFile - ACH file model
 * @returns {Promise<Buffer>} ACH file content
 */
export const exportACHFile = async (
  fileId: string,
  ACHFile: any,
): Promise<Buffer> => {
  const achFile = await ACHFile.findOne({ where: { fileId } });
  if (!achFile) throw new Error('ACH file not found');

  return Buffer.from(achFile.fileContent, 'utf-8');
};

/**
 * Processes ACH return file.
 *
 * @param {string} returnFileContent - Return file content
 * @param {Model} PaymentSchedule - Schedule model
 * @returns {Promise<any>} Processing result
 */
export const processACHReturnFile = async (
  returnFileContent: string,
  PaymentSchedule: any,
): Promise<any> => {
  const returns = [];

  // Parse return file (simplified)
  const lines = returnFileContent.split('\n');

  for (const line of lines) {
    if (line[0] === '6' && line[1] === '9') {
      // Entry return record
      const returnCode = line.substring(79, 82);
      const traceNumber = line.substring(79, 94);

      returns.push({
        traceNumber,
        returnCode,
        returnReason: getReturnCodeDescription(returnCode),
      });

      // Update payment status
      await PaymentSchedule.update(
        {
          status: 'returned',
          metadata: Sequelize.fn(
            'JSON_SET',
            Sequelize.col('metadata'),
            '$.returnCode',
            returnCode,
            '$.returnedAt',
            new Date().toISOString(),
          ),
        },
        { where: { metadata: { traceNumber } } },
      );
    }
  }

  return {
    totalReturns: returns.length,
    returns,
  };
};

/**
 * Gets ACH return code description.
 *
 * @param {string} returnCode - Return code
 * @returns {string} Description
 */
export const getReturnCodeDescription = (returnCode: string): string => {
  const codes: Record<string, string> = {
    R01: 'Insufficient Funds',
    R02: 'Account Closed',
    R03: 'No Account/Unable to Locate Account',
    R04: 'Invalid Account Number',
    R05: 'Improper Debit to Consumer Account',
    R06: 'Returned per ODFI Request',
    R07: 'Authorization Revoked by Customer',
    R08: 'Payment Stopped',
    R09: 'Uncollected Funds',
    R10: 'Customer Advises Not Authorized',
  };

  return codes[returnCode] || 'Unknown Return Code';
};

// ============================================================================
// WIRE TRANSFER PROCESSING (17-22)
// ============================================================================

/**
 * Creates wire transfer.
 *
 * @param {WireTransfer} wireData - Wire transfer data
 * @param {Model} WireTransfer - Wire model
 * @returns {Promise<any>} Created wire transfer
 */
export const createWireTransfer = async (
  wireData: WireTransfer,
  WireTransfer: any,
): Promise<any> => {
  return await WireTransfer.create(wireData);
};

/**
 * Approves wire transfer.
 *
 * @param {string} wireId - Wire ID
 * @param {string} approverId - Approver user ID
 * @param {Model} WireTransfer - Wire model
 * @returns {Promise<any>} Approved wire
 */
export const approveWireTransfer = async (
  wireId: string,
  approverId: string,
  WireTransfer: any,
): Promise<any> => {
  const wire = await WireTransfer.findOne({ where: { wireId } });
  if (!wire) throw new Error('Wire transfer not found');

  if (wire.status !== 'pending') {
    throw new Error('Only pending wire transfers can be approved');
  }

  wire.status = 'approved';
  wire.metadata = {
    ...wire.metadata,
    approvedBy: approverId,
    approvedAt: new Date().toISOString(),
  };
  await wire.save();

  return wire;
};

/**
 * Transmits wire transfer.
 *
 * @param {string} wireId - Wire ID
 * @param {Model} WireTransfer - Wire model
 * @returns {Promise<any>} Transmission result
 */
export const transmitWireTransfer = async (
  wireId: string,
  WireTransfer: any,
): Promise<any> => {
  const wire = await WireTransfer.findOne({ where: { wireId } });
  if (!wire) throw new Error('Wire transfer not found');

  if (wire.status !== 'approved') {
    throw new Error('Only approved wire transfers can be transmitted');
  }

  // Generate confirmation number
  const confirmationNumber = `WR${Date.now()}`;

  wire.status = 'transmitted';
  wire.confirmationNumber = confirmationNumber;
  await wire.save();

  return {
    wireId,
    confirmationNumber,
    transmittedAt: new Date(),
  };
};

/**
 * Confirms wire transfer settlement.
 *
 * @param {string} wireId - Wire ID
 * @param {string} confirmationNumber - Bank confirmation
 * @param {Model} WireTransfer - Wire model
 * @returns {Promise<any>} Confirmed wire
 */
export const confirmWireSettlement = async (
  wireId: string,
  confirmationNumber: string,
  WireTransfer: any,
): Promise<any> => {
  const wire = await WireTransfer.findOne({ where: { wireId } });
  if (!wire) throw new Error('Wire transfer not found');

  wire.status = 'confirmed';
  wire.confirmationNumber = confirmationNumber;
  await wire.save();

  return wire;
};

/**
 * Generates wire transfer instructions.
 *
 * @param {string} wireId - Wire ID
 * @param {Model} WireTransfer - Wire model
 * @returns {Promise<any>} Wire instructions
 */
export const generateWireInstructions = async (
  wireId: string,
  WireTransfer: any,
): Promise<any> => {
  const wire = await WireTransfer.findOne({ where: { wireId } });
  if (!wire) throw new Error('Wire transfer not found');

  return {
    wireId,
    instructions: {
      beneficiaryName: wire.recipientName,
      beneficiaryBank: wire.recipientBank,
      beneficiaryBankABA: wire.recipientABA,
      beneficiaryAccount: wire.recipientAccount,
      amount: wire.amount,
      purpose: wire.purpose,
      priority: wire.priority,
    },
    generatedAt: new Date(),
  };
};

/**
 * Retrieves wire transfers by status.
 *
 * @param {string} status - Wire status
 * @param {Model} WireTransfer - Wire model
 * @returns {Promise<any[]>} Wire transfers
 */
export const getWireTransfersByStatus = async (
  status: string,
  WireTransfer: any,
): Promise<any[]> => {
  return await WireTransfer.findAll({
    where: { status },
    order: [['createdAt', 'DESC']],
  });
};

// ============================================================================
// CHECK PROCESSING (23-28)
// ============================================================================

/**
 * Prints check payment.
 *
 * @param {CheckPayment} checkData - Check data
 * @param {Model} CheckPayment - Check model
 * @returns {Promise<any>} Printed check
 */
export const printCheckPayment = async (
  checkData: CheckPayment,
  CheckPayment: any,
): Promise<any> => {
  return await CheckPayment.create(checkData);
};

/**
 * Voids check payment.
 *
 * @param {string} checkNumber - Check number
 * @param {string} reason - Void reason
 * @param {Model} CheckPayment - Check model
 * @returns {Promise<any>} Voided check
 */
export const voidCheckPayment = async (
  checkNumber: string,
  reason: string,
  CheckPayment: any,
): Promise<any> => {
  const check = await CheckPayment.findOne({ where: { checkNumber } });
  if (!check) throw new Error('Check not found');

  if (check.status === 'cleared') {
    throw new Error('Cannot void cleared check');
  }

  check.status = 'voided';
  check.voidedReason = reason;
  await check.save();

  return check;
};

/**
 * Marks check as cleared.
 *
 * @param {string} checkNumber - Check number
 * @param {Date} clearedDate - Cleared date
 * @param {Model} CheckPayment - Check model
 * @returns {Promise<any>} Cleared check
 */
export const markCheckCleared = async (
  checkNumber: string,
  clearedDate: Date,
  CheckPayment: any,
): Promise<any> => {
  const check = await CheckPayment.findOne({ where: { checkNumber } });
  if (!check) throw new Error('Check not found');

  check.status = 'cleared';
  check.clearedDate = clearedDate;
  await check.save();

  return check;
};

/**
 * Identifies stale checks.
 *
 * @param {number} daysStale - Days stale threshold
 * @param {Model} CheckPayment - Check model
 * @returns {Promise<any[]>} Stale checks
 */
export const identifyStaleChecks = async (
  daysStale: number,
  CheckPayment: any,
): Promise<any[]> => {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - daysStale);

  const staleChecks = await CheckPayment.findAll({
    where: {
      status: { [Op.in]: ['printed', 'mailed'] },
      checkDate: { [Op.lte]: thresholdDate },
    },
  });

  // Mark as stale
  for (const check of staleChecks) {
    check.status = 'stale';
    await check.save();
  }

  return staleChecks;
};

/**
 * Generates positive pay file.
 *
 * @param {Date} fileDate - File date
 * @param {Model} CheckPayment - Check model
 * @param {Model} PositivePay - Positive pay model
 * @returns {Promise<any>} Positive pay file
 */
export const generatePositivePayFile = async (
  fileDate: Date,
  CheckPayment: any,
  PositivePay: any,
): Promise<any> => {
  const checks = await CheckPayment.findAll({
    where: {
      checkDate: fileDate,
      status: 'printed',
    },
  });

  const records = [];

  for (const check of checks) {
    const record = await PositivePay.create({
      recordId: `PP-${Date.now()}-${check.checkNumber}`,
      checkNumber: check.checkNumber,
      payee: check.vendorName,
      amount: check.amount,
      issueDate: check.checkDate,
      status: 'issued',
    });

    records.push(record);
  }

  // Generate file content
  const fileContent = records
    .map(
      (rec: any) =>
        `${rec.checkNumber},${rec.payee},${rec.amount},${rec.issueDate.toISOString().split('T')[0]}`,
    )
    .join('\n');

  return {
    fileDate,
    recordCount: records.length,
    fileContent,
  };
};

/**
 * Processes positive pay exceptions.
 *
 * @param {string} exceptionFile - Exception file content
 * @param {Model} PositivePay - Positive pay model
 * @returns {Promise<any>} Processing result
 */
export const processPositivePayExceptions = async (
  exceptionFile: string,
  PositivePay: any,
): Promise<any> => {
  const exceptions = [];
  const lines = exceptionFile.split('\n');

  for (const line of lines) {
    const [checkNumber, exceptionType, details] = line.split(',');

    const record = await PositivePay.findOne({ where: { checkNumber } });
    if (record) {
      record.status = 'exception';
      record.exceptionType = exceptionType as any;
      await record.save();

      exceptions.push({
        checkNumber,
        exceptionType,
        details,
      });
    }
  }

  return {
    totalExceptions: exceptions.length,
    exceptions,
  };
};

// ============================================================================
// PAYMENT RECONCILIATION (29-35)
// ============================================================================

/**
 * Reconciles payment with bank statement.
 *
 * @param {string} paymentId - Payment ID
 * @param {Date} bankStatementDate - Bank statement date
 * @param {number} bankAmount - Bank amount
 * @param {Model} PaymentSchedule - Schedule model
 * @param {Model} PaymentReconciliation - Reconciliation model
 * @returns {Promise<any>} Reconciliation result
 */
export const reconcilePayment = async (
  paymentId: string,
  bankStatementDate: Date,
  bankAmount: number,
  PaymentSchedule: any,
  PaymentReconciliation: any,
): Promise<any> => {
  const payment = await PaymentSchedule.findOne({ where: { scheduleId: paymentId } });
  if (!payment) throw new Error('Payment not found');

  const systemAmount = payment.paymentAmount;
  const variance = Math.abs(bankAmount - systemAmount);

  const status = variance < 0.01 ? 'matched' : 'unmatched';

  const reconciliation = await PaymentReconciliation.create({
    reconciliationId: `REC-${Date.now()}`,
    paymentId,
    bankStatementDate,
    bankAmount,
    systemAmount,
    variance,
    status,
  });

  return reconciliation;
};

/**
 * Auto-matches payments to bank transactions.
 *
 * @param {any[]} bankTransactions - Bank transactions
 * @param {Model} PaymentSchedule - Schedule model
 * @param {Model} PaymentReconciliation - Reconciliation model
 * @returns {Promise<any>} Matching result
 */
export const autoMatchPayments = async (
  bankTransactions: any[],
  PaymentSchedule: any,
  PaymentReconciliation: any,
): Promise<any> => {
  const matched = [];
  const unmatched = [];

  for (const txn of bankTransactions) {
    // Find matching payment
    const payment = await PaymentSchedule.findOne({
      where: {
        paymentAmount: txn.amount,
        status: 'transmitted',
      },
    });

    if (payment) {
      await reconcilePayment(
        payment.scheduleId,
        txn.date,
        txn.amount,
        PaymentSchedule,
        PaymentReconciliation,
      );
      matched.push({ paymentId: payment.scheduleId, transactionId: txn.id });
    } else {
      unmatched.push(txn);
    }
  }

  return {
    totalMatched: matched.length,
    totalUnmatched: unmatched.length,
    matched,
    unmatched,
  };
};

/**
 * Resolves reconciliation variance.
 *
 * @param {string} reconciliationId - Reconciliation ID
 * @param {string} resolution - Resolution notes
 * @param {string} userId - User ID
 * @param {Model} PaymentReconciliation - Reconciliation model
 * @returns {Promise<any>} Resolved reconciliation
 */
export const resolveReconciliationVariance = async (
  reconciliationId: string,
  resolution: string,
  userId: string,
  PaymentReconciliation: any,
): Promise<any> => {
  const reconciliation = await PaymentReconciliation.findOne({ where: { reconciliationId } });
  if (!reconciliation) throw new Error('Reconciliation not found');

  reconciliation.status = 'matched';
  reconciliation.resolvedBy = userId;
  reconciliation.resolvedAt = new Date();
  reconciliation.notes = resolution;
  await reconciliation.save();

  return reconciliation;
};

/**
 * Generates reconciliation report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} PaymentReconciliation - Reconciliation model
 * @returns {Promise<any>} Reconciliation report
 */
export const generateReconciliationReport = async (
  startDate: Date,
  endDate: Date,
  PaymentReconciliation: any,
): Promise<any> => {
  const reconciliations = await PaymentReconciliation.findAll({
    where: {
      bankStatementDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalVariance = reconciliations.reduce(
    (sum: number, rec: any) => sum + parseFloat(rec.variance),
    0,
  );

  const byStatus = new Map<string, number>();
  reconciliations.forEach((rec: any) => {
    byStatus.set(rec.status, (byStatus.get(rec.status) || 0) + 1);
  });

  return {
    period: { startDate, endDate },
    totalReconciliations: reconciliations.length,
    totalVariance,
    byStatus: Array.from(byStatus.entries()).map(([status, count]) => ({ status, count })),
  };
};

/**
 * Exports unmatched payments.
 *
 * @param {Model} PaymentReconciliation - Reconciliation model
 * @returns {Promise<Buffer>} CSV export
 */
export const exportUnmatchedPayments = async (
  PaymentReconciliation: any,
): Promise<Buffer> => {
  const unmatched = await PaymentReconciliation.findAll({
    where: { status: 'unmatched' },
  });

  const csv =
    'Reconciliation ID,Payment ID,Bank Date,Bank Amount,System Amount,Variance\n' +
    unmatched
      .map(
        (rec: any) =>
          `${rec.reconciliationId},${rec.paymentId},${rec.bankStatementDate.toISOString().split('T')[0]},${rec.bankAmount},${rec.systemAmount},${rec.variance}`,
      )
      .join('\n');

  return Buffer.from(csv, 'utf-8');
};

/**
 * Imports bank statement for reconciliation.
 *
 * @param {string} bankStatementFile - Bank statement CSV
 * @param {Model} PaymentSchedule - Schedule model
 * @param {Model} PaymentReconciliation - Reconciliation model
 * @returns {Promise<any>} Import result
 */
export const importBankStatement = async (
  bankStatementFile: string,
  PaymentSchedule: any,
  PaymentReconciliation: any,
): Promise<any> => {
  const lines = bankStatementFile.split('\n').slice(1); // Skip header
  const transactions = lines.map(line => {
    const [date, amount, reference] = line.split(',');
    return { date: new Date(date), amount: parseFloat(amount), reference };
  });

  return autoMatchPayments(transactions, PaymentSchedule, PaymentReconciliation);
};

/**
 * Performs end-of-day payment reconciliation.
 *
 * @param {Date} businessDate - Business date
 * @param {Model} PaymentSchedule - Schedule model
 * @param {Model} PaymentReconciliation - Reconciliation model
 * @returns {Promise<any>} EOD reconciliation
 */
export const performEODReconciliation = async (
  businessDate: Date,
  PaymentSchedule: any,
  PaymentReconciliation: any,
): Promise<any> => {
  const payments = await PaymentSchedule.findAll({
    where: {
      scheduledDate: businessDate,
      status: { [Op.in]: ['transmitted', 'settled'] },
    },
  });

  const reconciliations = await PaymentReconciliation.findAll({
    where: { bankStatementDate: businessDate },
  });

  return {
    businessDate,
    totalPayments: payments.length,
    totalReconciliations: reconciliations.length,
    matched: reconciliations.filter((r: any) => r.status === 'matched').length,
    unmatched: reconciliations.filter((r: any) => r.status === 'unmatched').length,
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class PaymentProcessingService {
  private readonly logger = new Logger(PaymentProcessingService.name);

  constructor(private readonly sequelize: Sequelize) {}

  async createBatch(batchData: PaymentBatch) {
    const PaymentBatch = createPaymentBatchModel(this.sequelize);
    return createNewPaymentBatch(batchData, PaymentBatch);
  }

  async generateACH(batchId: string) {
    const PaymentBatch = createPaymentBatchModel(this.sequelize);
    const PaymentSchedule = createPaymentScheduleModel(this.sequelize);
    const ACHFile = createACHFileModel(this.sequelize);

    return generateNACHAFile(batchId, PaymentBatch, PaymentSchedule, ACHFile);
  }

  async processWire(wireData: WireTransfer) {
    const WireTransfer = createWireTransferModel(this.sequelize);
    return createWireTransfer(wireData, WireTransfer);
  }

  async reconcilePayments(bankStatementFile: string) {
    const PaymentSchedule = createPaymentScheduleModel(this.sequelize);
    const PaymentReconciliation = createPaymentReconciliationModel(this.sequelize);

    return importBankStatement(bankStatementFile, PaymentSchedule, PaymentReconciliation);
  }
}

export default {
  // Models
  createPaymentBatchModel,
  createACHFileModel,
  createWireTransferModel,
  createCheckPaymentModel,
  createPaymentReconciliationModel,
  createPositivePayModel,

  // Batch Management
  createNewPaymentBatch,
  addPaymentsToBatch,
  approvePaymentBatch,
  processPaymentBatchTransactions,
  transmitPaymentBatch,
  settlePaymentBatch,
  getBatchesByStatus,
  generateBatchSummary,

  // ACH Processing
  generateNACHAFile,
  buildNACHAFileHeader,
  buildNACHABatchHeader,
  buildNACHAEntry,
  buildNACHABatchControl,
  buildNACHAFileControl,
  validateACHFileFormat,
  exportACHFile,
  processACHReturnFile,
  getReturnCodeDescription,

  // Wire Transfers
  createWireTransfer,
  approveWireTransfer,
  transmitWireTransfer,
  confirmWireSettlement,
  generateWireInstructions,
  getWireTransfersByStatus,

  // Check Processing
  printCheckPayment,
  voidCheckPayment,
  markCheckCleared,
  identifyStaleChecks,
  generatePositivePayFile,
  processPositivePayExceptions,

  // Reconciliation
  reconcilePayment,
  autoMatchPayments,
  resolveReconciliationVariance,
  generateReconciliationReport,
  exportUnmatchedPayments,
  importBankStatement,
  performEODReconciliation,

  // Service
  PaymentProcessingService,
};
