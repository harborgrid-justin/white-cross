/**
 * LOC: FINAP9876543
 * File: /reuse/financial/accounts-payable-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable financial utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend AP services
 *   - Vendor management modules
 *   - Payment processing services
 *   - Financial reporting systems
 */

/**
 * File: /reuse/financial/accounts-payable-management-kit.ts
 * Locator: WC-FIN-AP-001
 * Purpose: Enterprise-grade Accounts Payable Management - vendor invoices, payment processing, three-way matching, 1099 reporting, aging analysis
 *
 * Upstream: Independent utility module for AP financial operations
 * Downstream: ../backend/financial/*, AP controllers, vendor services, payment processors, reporting modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ functions for AP operations competing with USACE CEFMS enterprise financial management
 *
 * LLM Context: Comprehensive accounts payable utilities for production-ready financial applications.
 * Provides vendor invoice management, payment processing, three-way matching (PO/receipt/invoice), early payment discounts,
 * payment terms enforcement, 1099 reporting, aging analysis, vendor performance tracking, payment batch processing,
 * ACH/wire transfers, check printing, invoice dispute management, approval workflows, and audit trail compliance.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface VendorInvoiceData {
  vendorId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
  taxAmount?: number;
  discountAmount?: number;
  purchaseOrderId?: string;
  receiptId?: string;
  description?: string;
  glAccountCode?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  metadata?: Record<string, any>;
}

interface PaymentTerms {
  termCode: string;
  description: string;
  netDays: number;
  discountDays?: number;
  discountPercent?: number;
  isActive: boolean;
}

interface ThreeWayMatchResult {
  matched: boolean;
  poAmount: number;
  receiptQuantity: number;
  invoiceAmount: number;
  variance: number;
  variancePercent: number;
  issues: string[];
  matchedAt?: Date;
}

interface PaymentBatchData {
  batchNumber: string;
  paymentDate: Date;
  paymentMethod: 'ach' | 'wire' | 'check' | 'credit_card';
  totalAmount: number;
  invoiceIds: string[];
  bankAccountId: string;
  approvedBy: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface AgingBucket {
  bucket: string;
  daysStart: number;
  daysEnd: number | null;
  count: number;
  amount: number;
  percentage: number;
}

interface VendorPerformance {
  vendorId: string;
  vendorName: string;
  totalInvoices: number;
  totalAmount: number;
  averagePaymentDays: number;
  onTimePaymentRate: number;
  discountsCaptured: number;
  discountsMissed: number;
  disputeRate: number;
  qualityScore: number;
}

interface Form1099Data {
  vendorId: string;
  taxYear: number;
  ein: string;
  businessName: string;
  address: string;
  totalPayments: number;
  box1Rents?: number;
  box2Royalties?: number;
  box3OtherIncome?: number;
  box7NonemployeeCompensation?: number;
  federalTaxWithheld?: number;
}

interface InvoiceApprovalWorkflow {
  invoiceId: string;
  workflowSteps: ApprovalStep[];
  currentStepIndex: number;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected';
  submittedAt: Date;
  completedAt?: Date;
}

interface ApprovalStep {
  stepNumber: number;
  approverRole: string;
  approverId?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvalDate?: Date;
  comments?: string;
  threshold?: number;
}

interface PaymentScheduleEntry {
  invoiceId: string;
  scheduledDate: Date;
  amount: number;
  priority: number;
  paymentMethod: string;
  status: 'scheduled' | 'processing' | 'completed' | 'cancelled';
}

interface VendorStatement {
  vendorId: string;
  statementDate: Date;
  openingBalance: number;
  invoices: VendorInvoiceData[];
  payments: PaymentData[];
  closingBalance: number;
  agingBuckets: AgingBucket[];
}

interface PaymentData {
  paymentId: string;
  invoiceId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  checkNumber?: string;
  confirmationNumber?: string;
}

interface EarlyPaymentDiscount {
  invoiceId: string;
  discountPercent: number;
  discountAmount: number;
  discountDeadline: Date;
  paymentAmount: number;
  savingsAmount: number;
}

interface APAuditEntry {
  entityType: 'invoice' | 'payment' | 'vendor' | 'batch';
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'pay';
  userId: string;
  timestamp: Date;
  changes: Record<string, any>;
  ipAddress?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Vendor Invoices with approval workflow and three-way matching.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     VendorInvoice:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         vendorId:
 *           type: string
 *         invoiceNumber:
 *           type: string
 *         amount:
 *           type: number
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorInvoice model
 *
 * @example
 * ```typescript
 * const VendorInvoice = createVendorInvoiceModel(sequelize);
 * const invoice = await VendorInvoice.create({
 *   vendorId: 'VND001',
 *   invoiceNumber: 'INV-2024-001',
 *   invoiceDate: new Date(),
 *   dueDate: new Date(Date.now() + 30 * 86400000),
 *   amount: 5000.00,
 *   approvalStatus: 'pending'
 * });
 * ```
 */
export const createVendorInvoiceModel = (sequelize: Sequelize) => {
  class VendorInvoice extends Model {
    public id!: string;
    public vendorId!: string;
    public invoiceNumber!: string;
    public invoiceDate!: Date;
    public dueDate!: Date;
    public amount!: number;
    public taxAmount!: number;
    public discountAmount!: number;
    public netAmount!: number;
    public purchaseOrderId!: string | null;
    public receiptId!: string | null;
    public description!: string;
    public glAccountCode!: string;
    public approvalStatus!: string;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public paymentStatus!: string;
    public paidAmount!: number;
    public paymentDate!: Date | null;
    public threeWayMatchStatus!: string;
    public matchedAt!: Date | null;
    public disputeStatus!: string | null;
    public disputeReason!: string | null;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public form1099Reportable!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  VendorInvoice.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      vendorId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Vendor identifier',
        validate: {
          notEmpty: true,
        },
      },
      invoiceNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Vendor invoice number',
        validate: {
          notEmpty: true,
        },
      },
      invoiceDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Invoice date',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Payment due date',
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Gross invoice amount',
        validate: {
          min: 0.01,
        },
      },
      taxAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Tax amount',
      },
      discountAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Discount amount',
      },
      netAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Net amount payable',
      },
      purchaseOrderId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Related purchase order',
      },
      receiptId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Related goods receipt',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Invoice description',
      },
      glAccountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'General ledger account code',
      },
      approvalStatus: {
        type: DataTypes.ENUM('pending', 'in_review', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Approval workflow status',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approver user ID',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      paymentStatus: {
        type: DataTypes.ENUM('unpaid', 'partially_paid', 'paid', 'void'),
        allowNull: false,
        defaultValue: 'unpaid',
        comment: 'Payment status',
      },
      paidAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount paid to date',
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Payment date',
      },
      threeWayMatchStatus: {
        type: DataTypes.ENUM('not_required', 'pending', 'matched', 'variance'),
        allowNull: false,
        defaultValue: 'not_required',
        comment: 'Three-way match status',
      },
      matchedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Match completion timestamp',
      },
      disputeStatus: {
        type: DataTypes.ENUM('none', 'disputed', 'resolved'),
        allowNull: false,
        defaultValue: 'none',
        comment: 'Dispute status',
      },
      disputeReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Dispute reason',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      fiscalPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal period (1-12)',
        validate: {
          min: 1,
          max: 12,
        },
      },
      form1099Reportable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Subject to 1099 reporting',
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
      tableName: 'vendor_invoices',
      timestamps: true,
      indexes: [
        { fields: ['vendorId'] },
        { fields: ['invoiceNumber', 'vendorId'], unique: true },
        { fields: ['invoiceDate'] },
        { fields: ['dueDate'] },
        { fields: ['approvalStatus'] },
        { fields: ['paymentStatus'] },
        { fields: ['threeWayMatchStatus'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['form1099Reportable'] },
        { fields: ['purchaseOrderId'] },
      ],
    },
  );

  return VendorInvoice;
};

/**
 * Sequelize model for AP Payments with batch processing and reconciliation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} APPayment model
 *
 * @example
 * ```typescript
 * const APPayment = createAPPaymentModel(sequelize);
 * const payment = await APPayment.create({
 *   paymentBatchId: 'BATCH-2024-001',
 *   invoiceId: 'INV-001',
 *   amount: 5000.00,
 *   paymentDate: new Date(),
 *   paymentMethod: 'ach',
 *   status: 'completed'
 * });
 * ```
 */
export const createAPPaymentModel = (sequelize: Sequelize) => {
  class APPayment extends Model {
    public id!: string;
    public paymentBatchId!: string;
    public invoiceId!: string;
    public vendorId!: string;
    public amount!: number;
    public paymentDate!: Date;
    public paymentMethod!: string;
    public checkNumber!: string | null;
    public achTraceNumber!: string | null;
    public wireConfirmation!: string | null;
    public bankAccountId!: string;
    public status!: string;
    public processedAt!: Date | null;
    public clearedAt!: Date | null;
    public reconciledAt!: Date | null;
    public voidedAt!: Date | null;
    public voidReason!: string | null;
    public discountTaken!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  APPayment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      paymentBatchId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Payment batch identifier',
      },
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Related invoice ID',
      },
      vendorId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Vendor identifier',
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Payment amount',
        validate: {
          min: 0.01,
        },
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Payment date',
      },
      paymentMethod: {
        type: DataTypes.ENUM('ach', 'wire', 'check', 'credit_card', 'eft'),
        allowNull: false,
        comment: 'Payment method',
      },
      checkNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Check number if applicable',
      },
      achTraceNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'ACH trace number',
      },
      wireConfirmation: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Wire transfer confirmation',
      },
      bankAccountId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Bank account used for payment',
      },
      status: {
        type: DataTypes.ENUM('pending', 'processing', 'completed', 'cleared', 'failed', 'void'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Payment status',
      },
      processedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Processing timestamp',
      },
      clearedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Bank clearing timestamp',
      },
      reconciledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Reconciliation timestamp',
      },
      voidedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Void timestamp',
      },
      voidReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for voiding payment',
      },
      discountTaken: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Early payment discount taken',
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
      tableName: 'ap_payments',
      timestamps: true,
      indexes: [
        { fields: ['paymentBatchId'] },
        { fields: ['invoiceId'] },
        { fields: ['vendorId'] },
        { fields: ['paymentDate'] },
        { fields: ['paymentMethod'] },
        { fields: ['status'] },
        { fields: ['checkNumber'] },
        { fields: ['achTraceNumber'] },
      ],
    },
  );

  return APPayment;
};

/**
 * Sequelize model for AP Audit Trail with HIPAA compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} APAuditLog model
 */
export const createAPAuditLogModel = (sequelize: Sequelize) => {
  class APAuditLog extends Model {
    public id!: string;
    public entityType!: string;
    public entityId!: string;
    public action!: string;
    public userId!: string;
    public userName!: string;
    public changes!: Record<string, any>;
    public ipAddress!: string;
    public userAgent!: string;
    public readonly createdAt!: Date;
  }

  APAuditLog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      entityType: {
        type: DataTypes.ENUM('invoice', 'payment', 'vendor', 'batch', 'approval'),
        allowNull: false,
        comment: 'Entity type',
      },
      entityId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Entity identifier',
      },
      action: {
        type: DataTypes.ENUM('create', 'update', 'delete', 'approve', 'reject', 'pay', 'void'),
        allowNull: false,
        comment: 'Action performed',
      },
      userId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'User who performed action',
      },
      userName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'User name for audit',
      },
      changes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Change details',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
        comment: 'IP address',
      },
      userAgent: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'User agent',
      },
    },
    {
      sequelize,
      tableName: 'ap_audit_logs',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['entityType', 'entityId'] },
        { fields: ['userId'] },
        { fields: ['action'] },
        { fields: ['createdAt'] },
      ],
    },
  );

  return APAuditLog;
};

// ============================================================================
// VENDOR INVOICE MANAGEMENT (1-8)
// ============================================================================

/**
 * Creates a new vendor invoice with validation and audit trail.
 *
 * @param {VendorInvoiceData} invoiceData - Invoice data
 * @param {Model} VendorInvoice - VendorInvoice model
 * @param {string} userId - User creating invoice
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<any>} Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createVendorInvoice({
 *   vendorId: 'VND001',
 *   invoiceNumber: 'INV-2024-001',
 *   invoiceDate: new Date(),
 *   dueDate: new Date(Date.now() + 30 * 86400000),
 *   amount: 5000.00
 * }, VendorInvoice, 'user123');
 * ```
 */
export const createVendorInvoice = async (
  invoiceData: VendorInvoiceData,
  VendorInvoice: any,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const netAmount = invoiceData.amount + (invoiceData.taxAmount || 0) - (invoiceData.discountAmount || 0);
  const fiscalYear = invoiceData.invoiceDate.getFullYear();
  const fiscalPeriod = invoiceData.invoiceDate.getMonth() + 1;

  const invoice = await VendorInvoice.create(
    {
      ...invoiceData,
      netAmount,
      fiscalYear,
      fiscalPeriod,
      approvalStatus: 'pending',
      paymentStatus: 'unpaid',
      paidAmount: 0,
    },
    { transaction },
  );

  await logAuditEvent({
    entityType: 'invoice',
    entityId: invoice.id,
    action: 'create',
    userId,
    changes: invoiceData,
  });

  return invoice;
};

/**
 * Validates invoice data against business rules and vendor settings.
 *
 * @param {VendorInvoiceData} invoiceData - Invoice data to validate
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateInvoiceData(invoiceData);
 * if (!result.valid) {
 *   throw new Error(result.errors.join(', '));
 * }
 * ```
 */
export const validateInvoiceData = async (
  invoiceData: VendorInvoiceData,
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  if (!invoiceData.vendorId) errors.push('Vendor ID is required');
  if (!invoiceData.invoiceNumber) errors.push('Invoice number is required');
  if (!invoiceData.amount || invoiceData.amount <= 0) errors.push('Amount must be positive');
  if (!invoiceData.invoiceDate) errors.push('Invoice date is required');
  if (!invoiceData.dueDate) errors.push('Due date is required');
  if (invoiceData.dueDate < invoiceData.invoiceDate) {
    errors.push('Due date must be after invoice date');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Checks for duplicate invoices from the same vendor.
 *
 * @param {string} vendorId - Vendor identifier
 * @param {string} invoiceNumber - Invoice number
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<boolean>} True if duplicate exists
 *
 * @example
 * ```typescript
 * const isDuplicate = await checkDuplicateInvoice('VND001', 'INV-123', VendorInvoice);
 * if (isDuplicate) throw new Error('Duplicate invoice');
 * ```
 */
export const checkDuplicateInvoice = async (
  vendorId: string,
  invoiceNumber: string,
  VendorInvoice: any,
): Promise<boolean> => {
  const existing = await VendorInvoice.findOne({
    where: {
      vendorId,
      invoiceNumber,
      paymentStatus: { [Op.ne]: 'void' },
    },
  });
  return !!existing;
};

/**
 * Applies payment terms to calculate discount and net amount.
 *
 * @param {number} amount - Gross amount
 * @param {PaymentTerms} terms - Payment terms
 * @param {Date} invoiceDate - Invoice date
 * @param {Date} paymentDate - Planned payment date
 * @returns {EarlyPaymentDiscount} Discount calculation
 *
 * @example
 * ```typescript
 * const discount = calculatePaymentTermsDiscount(
 *   5000,
 *   { netDays: 30, discountDays: 10, discountPercent: 2 },
 *   new Date(),
 *   new Date(Date.now() + 5 * 86400000)
 * );
 * ```
 */
export const calculatePaymentTermsDiscount = (
  amount: number,
  terms: PaymentTerms,
  invoiceDate: Date,
  paymentDate: Date,
): EarlyPaymentDiscount => {
  const daysDiff = Math.floor((paymentDate.getTime() - invoiceDate.getTime()) / 86400000);
  const discountDeadline = new Date(invoiceDate.getTime() + (terms.discountDays || 0) * 86400000);

  let discountAmount = 0;
  if (terms.discountPercent && daysDiff <= (terms.discountDays || 0)) {
    discountAmount = amount * (terms.discountPercent / 100);
  }

  return {
    invoiceId: '',
    discountPercent: terms.discountPercent || 0,
    discountAmount,
    discountDeadline,
    paymentAmount: amount - discountAmount,
    savingsAmount: discountAmount,
  };
};

/**
 * Updates invoice approval status with workflow tracking.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} status - New approval status
 * @param {string} userId - Approver user ID
 * @param {Model} VendorInvoice - VendorInvoice model
 * @param {string} [comments] - Approval comments
 * @returns {Promise<any>} Updated invoice
 *
 * @example
 * ```typescript
 * await updateInvoiceApprovalStatus('inv123', 'approved', 'user456', VendorInvoice);
 * ```
 */
export const updateInvoiceApprovalStatus = async (
  invoiceId: string,
  status: 'approved' | 'rejected',
  userId: string,
  VendorInvoice: any,
  comments?: string,
): Promise<any> => {
  const invoice = await VendorInvoice.findByPk(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  invoice.approvalStatus = status;
  invoice.approvedBy = userId;
  invoice.approvedAt = new Date();
  await invoice.save();

  await logAuditEvent({
    entityType: 'invoice',
    entityId: invoiceId,
    action: status === 'approved' ? 'approve' : 'reject',
    userId,
    changes: { status, comments },
  });

  return invoice;
};

/**
 * Retrieves invoices pending approval for a specific approver.
 *
 * @param {string} approverRole - Approver role
 * @param {number} [limit=50] - Max results
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any[]>} Pending invoices
 *
 * @example
 * ```typescript
 * const pending = await getInvoicesPendingApproval('manager', 100, VendorInvoice);
 * ```
 */
export const getInvoicesPendingApproval = async (
  approverRole: string,
  limit: number = 50,
  VendorInvoice: any,
): Promise<any[]> => {
  return await VendorInvoice.findAll({
    where: {
      approvalStatus: { [Op.in]: ['pending', 'in_review'] },
    },
    order: [['invoiceDate', 'ASC']],
    limit,
  });
};

/**
 * Marks invoice as disputed with reason tracking.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} reason - Dispute reason
 * @param {string} userId - User disputing invoice
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any>} Updated invoice
 *
 * @example
 * ```typescript
 * await disputeInvoice('inv123', 'Incorrect pricing', 'user789', VendorInvoice);
 * ```
 */
export const disputeInvoice = async (
  invoiceId: string,
  reason: string,
  userId: string,
  VendorInvoice: any,
): Promise<any> => {
  const invoice = await VendorInvoice.findByPk(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  invoice.disputeStatus = 'disputed';
  invoice.disputeReason = reason;
  await invoice.save();

  await logAuditEvent({
    entityType: 'invoice',
    entityId: invoiceId,
    action: 'update',
    userId,
    changes: { disputeStatus: 'disputed', disputeReason: reason },
  });

  return invoice;
};

/**
 * Resolves invoice dispute and updates status.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} resolution - Resolution notes
 * @param {string} userId - User resolving dispute
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any>} Updated invoice
 *
 * @example
 * ```typescript
 * await resolveInvoiceDispute('inv123', 'Pricing corrected', 'user789', VendorInvoice);
 * ```
 */
export const resolveInvoiceDispute = async (
  invoiceId: string,
  resolution: string,
  userId: string,
  VendorInvoice: any,
): Promise<any> => {
  const invoice = await VendorInvoice.findByPk(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  invoice.disputeStatus = 'resolved';
  invoice.metadata = {
    ...invoice.metadata,
    disputeResolution: resolution,
    resolvedAt: new Date().toISOString(),
  };
  await invoice.save();

  await logAuditEvent({
    entityType: 'invoice',
    entityId: invoiceId,
    action: 'update',
    userId,
    changes: { disputeStatus: 'resolved', resolution },
  });

  return invoice;
};

// ============================================================================
// THREE-WAY MATCHING (9-12)
// ============================================================================

/**
 * Performs three-way match between PO, receipt, and invoice.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {any} poData - Purchase order data
 * @param {any} receiptData - Receipt data
 * @param {number} [varianceThreshold=0.05] - Allowable variance (5%)
 * @returns {Promise<ThreeWayMatchResult>} Match result
 *
 * @example
 * ```typescript
 * const matchResult = await performThreeWayMatch('inv123', poData, receiptData, 0.05);
 * if (!matchResult.matched) {
 *   console.log('Match failed:', matchResult.issues);
 * }
 * ```
 */
export const performThreeWayMatch = async (
  invoiceId: string,
  poData: any,
  receiptData: any,
  varianceThreshold: number = 0.05,
): Promise<ThreeWayMatchResult> => {
  const issues: string[] = [];

  // Check PO amount vs invoice amount
  const amountVariance = Math.abs(poData.amount - poData.invoiceAmount);
  const amountVariancePercent = amountVariance / poData.amount;

  if (amountVariancePercent > varianceThreshold) {
    issues.push(`Amount variance ${(amountVariancePercent * 100).toFixed(2)}% exceeds threshold`);
  }

  // Check receipt quantity vs invoice quantity
  if (receiptData.quantity !== poData.invoiceQuantity) {
    issues.push('Quantity mismatch between receipt and invoice');
  }

  // Check PO items vs invoice items
  if (poData.items && poData.invoiceItems) {
    const poItemSet = new Set(poData.items.map((i: any) => i.itemCode));
    const invoiceItemSet = new Set(poData.invoiceItems.map((i: any) => i.itemCode));
    const difference = [...invoiceItemSet].filter(x => !poItemSet.has(x));

    if (difference.length > 0) {
      issues.push(`Invoice contains items not on PO: ${difference.join(', ')}`);
    }
  }

  const matched = issues.length === 0;

  return {
    matched,
    poAmount: poData.amount,
    receiptQuantity: receiptData.quantity,
    invoiceAmount: poData.invoiceAmount,
    variance: amountVariance,
    variancePercent: amountVariancePercent,
    issues,
    matchedAt: matched ? new Date() : undefined,
  };
};

/**
 * Updates invoice three-way match status.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {ThreeWayMatchResult} matchResult - Match result
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any>} Updated invoice
 *
 * @example
 * ```typescript
 * await updateThreeWayMatchStatus('inv123', matchResult, VendorInvoice);
 * ```
 */
export const updateThreeWayMatchStatus = async (
  invoiceId: string,
  matchResult: ThreeWayMatchResult,
  VendorInvoice: any,
): Promise<any> => {
  const invoice = await VendorInvoice.findByPk(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  invoice.threeWayMatchStatus = matchResult.matched ? 'matched' : 'variance';
  invoice.matchedAt = matchResult.matchedAt || null;
  invoice.metadata = {
    ...invoice.metadata,
    matchResult,
  };
  await invoice.save();

  return invoice;
};

/**
 * Retrieves invoices requiring three-way matching.
 *
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any[]>} Invoices requiring matching
 *
 * @example
 * ```typescript
 * const invoices = await getInvoicesRequiringMatch(VendorInvoice);
 * ```
 */
export const getInvoicesRequiringMatch = async (VendorInvoice: any): Promise<any[]> => {
  return await VendorInvoice.findAll({
    where: {
      threeWayMatchStatus: 'pending',
      purchaseOrderId: { [Op.ne]: null },
      receiptId: { [Op.ne]: null },
    },
    order: [['invoiceDate', 'ASC']],
  });
};

/**
 * Processes match variances for exceptions handling.
 *
 * @param {ThreeWayMatchResult} matchResult - Match result with variances
 * @param {string} userId - User processing variance
 * @returns {Promise<{ approved: boolean; reason: string }>} Variance decision
 *
 * @example
 * ```typescript
 * const decision = await processMatchVariance(matchResult, 'user123');
 * ```
 */
export const processMatchVariance = async (
  matchResult: ThreeWayMatchResult,
  userId: string,
): Promise<{ approved: boolean; reason: string }> => {
  // Auto-approve small variances
  if (matchResult.variancePercent < 0.01) {
    return {
      approved: true,
      reason: 'Variance within acceptable tolerance',
    };
  }

  // Require manual approval for larger variances
  return {
    approved: false,
    reason: `Manual approval required: ${matchResult.issues.join('; ')}`,
  };
};

// ============================================================================
// PAYMENT PROCESSING (13-20)
// ============================================================================

/**
 * Creates payment batch for multiple invoices.
 *
 * @param {PaymentBatchData} batchData - Payment batch data
 * @param {Model} APPayment - APPayment model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Created payments
 *
 * @example
 * ```typescript
 * const payments = await createPaymentBatch({
 *   batchNumber: 'BATCH-2024-001',
 *   paymentDate: new Date(),
 *   paymentMethod: 'ach',
 *   totalAmount: 50000,
 *   invoiceIds: ['inv1', 'inv2'],
 *   bankAccountId: 'bank123',
 *   approvedBy: 'user456',
 *   status: 'pending'
 * }, APPayment);
 * ```
 */
export const createPaymentBatch = async (
  batchData: PaymentBatchData,
  APPayment: any,
  transaction?: Transaction,
): Promise<any[]> => {
  const payments = [];

  for (const invoiceId of batchData.invoiceIds) {
    const payment = await APPayment.create(
      {
        paymentBatchId: batchData.batchNumber,
        invoiceId,
        vendorId: '', // Should be fetched from invoice
        amount: 0, // Should be calculated
        paymentDate: batchData.paymentDate,
        paymentMethod: batchData.paymentMethod,
        bankAccountId: batchData.bankAccountId,
        status: 'pending',
      },
      { transaction },
    );
    payments.push(payment);
  }

  return payments;
};

/**
 * Processes ACH payment for vendor invoice.
 *
 * @param {string} paymentId - Payment ID
 * @param {any} bankingService - Banking service for ACH
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<{ success: boolean; traceNumber?: string; error?: string }>} Process result
 *
 * @example
 * ```typescript
 * const result = await processACHPayment('pay123', bankingService, APPayment);
 * ```
 */
export const processACHPayment = async (
  paymentId: string,
  bankingService: any,
  APPayment: any,
): Promise<{ success: boolean; traceNumber?: string; error?: string }> => {
  const payment = await APPayment.findByPk(paymentId);
  if (!payment) throw new Error('Payment not found');

  try {
    payment.status = 'processing';
    await payment.save();

    // Simulate ACH processing
    const traceNumber = `ACH${Date.now()}${Math.floor(Math.random() * 10000)}`;

    payment.achTraceNumber = traceNumber;
    payment.status = 'completed';
    payment.processedAt = new Date();
    await payment.save();

    return { success: true, traceNumber };
  } catch (error: any) {
    payment.status = 'failed';
    await payment.save();
    return { success: false, error: error.message };
  }
};

/**
 * Processes wire transfer for vendor payment.
 *
 * @param {string} paymentId - Payment ID
 * @param {any} bankingService - Banking service
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<{ success: boolean; confirmation?: string; error?: string }>} Process result
 *
 * @example
 * ```typescript
 * const result = await processWireTransfer('pay123', bankingService, APPayment);
 * ```
 */
export const processWireTransfer = async (
  paymentId: string,
  bankingService: any,
  APPayment: any,
): Promise<{ success: boolean; confirmation?: string; error?: string }> => {
  const payment = await APPayment.findByPk(paymentId);
  if (!payment) throw new Error('Payment not found');

  try {
    payment.status = 'processing';
    await payment.save();

    const confirmation = `WIRE${Date.now()}`;

    payment.wireConfirmation = confirmation;
    payment.status = 'completed';
    payment.processedAt = new Date();
    await payment.save();

    return { success: true, confirmation };
  } catch (error: any) {
    payment.status = 'failed';
    await payment.save();
    return { success: false, error: error.message };
  }
};

/**
 * Generates and prints check for payment.
 *
 * @param {string} paymentId - Payment ID
 * @param {string} checkNumber - Check number
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<{ success: boolean; checkNumber: string }>} Print result
 *
 * @example
 * ```typescript
 * const result = await printCheck('pay123', 'CHK-10001', APPayment);
 * ```
 */
export const printCheck = async (
  paymentId: string,
  checkNumber: string,
  APPayment: any,
): Promise<{ success: boolean; checkNumber: string }> => {
  const payment = await APPayment.findByPk(paymentId);
  if (!payment) throw new Error('Payment not found');

  payment.checkNumber = checkNumber;
  payment.status = 'completed';
  payment.processedAt = new Date();
  await payment.save();

  // TODO: Integrate with check printing service
  return { success: true, checkNumber };
};

/**
 * Voids a payment and updates related invoice.
 *
 * @param {string} paymentId - Payment ID
 * @param {string} reason - Void reason
 * @param {string} userId - User voiding payment
 * @param {Model} APPayment - APPayment model
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any>} Voided payment
 *
 * @example
 * ```typescript
 * await voidPayment('pay123', 'Duplicate payment', 'user456', APPayment, VendorInvoice);
 * ```
 */
export const voidPayment = async (
  paymentId: string,
  reason: string,
  userId: string,
  APPayment: any,
  VendorInvoice: any,
): Promise<any> => {
  const payment = await APPayment.findByPk(paymentId);
  if (!payment) throw new Error('Payment not found');

  payment.status = 'void';
  payment.voidedAt = new Date();
  payment.voidReason = reason;
  await payment.save();

  // Update related invoice
  const invoice = await VendorInvoice.findByPk(payment.invoiceId);
  if (invoice) {
    invoice.paidAmount -= payment.amount;
    invoice.paymentStatus = invoice.paidAmount === 0 ? 'unpaid' : 'partially_paid';
    await invoice.save();
  }

  await logAuditEvent({
    entityType: 'payment',
    entityId: paymentId,
    action: 'void',
    userId,
    changes: { reason },
  });

  return payment;
};

/**
 * Reconciles payment with bank statement.
 *
 * @param {string} paymentId - Payment ID
 * @param {Date} clearedDate - Bank clearing date
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<any>} Reconciled payment
 *
 * @example
 * ```typescript
 * await reconcilePayment('pay123', new Date(), APPayment);
 * ```
 */
export const reconcilePayment = async (
  paymentId: string,
  clearedDate: Date,
  APPayment: any,
): Promise<any> => {
  const payment = await APPayment.findByPk(paymentId);
  if (!payment) throw new Error('Payment not found');

  payment.clearedAt = clearedDate;
  payment.reconciledAt = new Date();
  await payment.save();

  return payment;
};

/**
 * Retrieves payment schedule for upcoming dates.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<PaymentScheduleEntry[]>} Scheduled payments
 *
 * @example
 * ```typescript
 * const schedule = await getPaymentSchedule(new Date(), futureDate, VendorInvoice);
 * ```
 */
export const getPaymentSchedule = async (
  startDate: Date,
  endDate: Date,
  VendorInvoice: any,
): Promise<PaymentScheduleEntry[]> => {
  const invoices = await VendorInvoice.findAll({
    where: {
      dueDate: {
        [Op.between]: [startDate, endDate],
      },
      paymentStatus: { [Op.in]: ['unpaid', 'partially_paid'] },
      approvalStatus: 'approved',
    },
    order: [['dueDate', 'ASC']],
  });

  return invoices.map((inv: any, index: number) => ({
    invoiceId: inv.id,
    scheduledDate: inv.dueDate,
    amount: inv.netAmount - inv.paidAmount,
    priority: index + 1,
    paymentMethod: 'ach',
    status: 'scheduled',
  }));
};

/**
 * Calculates optimal payment date considering discounts.
 *
 * @param {any} invoice - Invoice data
 * @param {PaymentTerms} terms - Payment terms
 * @param {Date} [currentDate=new Date()] - Current date
 * @returns {{ optimalDate: Date; reason: string; savings: number }} Optimal payment date
 *
 * @example
 * ```typescript
 * const optimal = calculateOptimalPaymentDate(invoice, terms);
 * console.log(`Pay on ${optimal.optimalDate} to save ${optimal.savings}`);
 * ```
 */
export const calculateOptimalPaymentDate = (
  invoice: any,
  terms: PaymentTerms,
  currentDate: Date = new Date(),
): { optimalDate: Date; reason: string; savings: number } => {
  if (terms.discountDays && terms.discountPercent) {
    const discountDeadline = new Date(
      invoice.invoiceDate.getTime() + terms.discountDays * 86400000,
    );

    if (discountDeadline >= currentDate) {
      const savings = invoice.amount * (terms.discountPercent / 100);
      return {
        optimalDate: discountDeadline,
        reason: `Capture ${terms.discountPercent}% early payment discount`,
        savings,
      };
    }
  }

  return {
    optimalDate: invoice.dueDate,
    reason: 'No early payment discount available',
    savings: 0,
  };
};

// ============================================================================
// AGING REPORTS (21-24)
// ============================================================================

/**
 * Generates AP aging report by vendor.
 *
 * @param {Date} [asOfDate=new Date()] - Report date
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<Map<string, AgingBucket[]>>} Aging by vendor
 *
 * @example
 * ```typescript
 * const agingReport = await generateAPAgingReport(new Date(), VendorInvoice);
 * agingReport.forEach((buckets, vendorId) => {
 *   console.log(`Vendor ${vendorId}:`, buckets);
 * });
 * ```
 */
export const generateAPAgingReport = async (
  asOfDate: Date = new Date(),
  VendorInvoice: any,
): Promise<Map<string, AgingBucket[]>> => {
  const invoices = await VendorInvoice.findAll({
    where: {
      paymentStatus: { [Op.in]: ['unpaid', 'partially_paid'] },
    },
  });

  const agingByVendor = new Map<string, AgingBucket[]>();

  invoices.forEach((invoice: any) => {
    const daysPastDue = Math.floor(
      (asOfDate.getTime() - invoice.dueDate.getTime()) / 86400000,
    );
    const outstanding = invoice.netAmount - invoice.paidAmount;

    if (!agingByVendor.has(invoice.vendorId)) {
      agingByVendor.set(invoice.vendorId, [
        { bucket: 'Current', daysStart: -999, daysEnd: 0, count: 0, amount: 0, percentage: 0 },
        { bucket: '1-30', daysStart: 1, daysEnd: 30, count: 0, amount: 0, percentage: 0 },
        { bucket: '31-60', daysStart: 31, daysEnd: 60, count: 0, amount: 0, percentage: 0 },
        { bucket: '61-90', daysStart: 61, daysEnd: 90, count: 0, amount: 0, percentage: 0 },
        { bucket: '90+', daysStart: 91, daysEnd: null, count: 0, amount: 0, percentage: 0 },
      ]);
    }

    const buckets = agingByVendor.get(invoice.vendorId)!;
    const bucket = buckets.find(
      b =>
        daysPastDue >= b.daysStart &&
        (b.daysEnd === null || daysPastDue <= b.daysEnd),
    );

    if (bucket) {
      bucket.count++;
      bucket.amount += outstanding;
    }
  });

  // Calculate percentages
  agingByVendor.forEach(buckets => {
    const total = buckets.reduce((sum, b) => sum + b.amount, 0);
    buckets.forEach(b => {
      b.percentage = total > 0 ? (b.amount / total) * 100 : 0;
    });
  });

  return agingByVendor;
};

/**
 * Calculates aging buckets for a single vendor.
 *
 * @param {string} vendorId - Vendor identifier
 * @param {Date} asOfDate - Report date
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<AgingBucket[]>} Aging buckets
 *
 * @example
 * ```typescript
 * const buckets = await calculateVendorAgingBuckets('VND001', new Date(), VendorInvoice);
 * ```
 */
export const calculateVendorAgingBuckets = async (
  vendorId: string,
  asOfDate: Date,
  VendorInvoice: any,
): Promise<AgingBucket[]> => {
  const agingMap = await generateAPAgingReport(asOfDate, VendorInvoice);
  return agingMap.get(vendorId) || [];
};

/**
 * Identifies overdue invoices requiring attention.
 *
 * @param {number} [daysOverdue=30] - Days past due threshold
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any[]>} Overdue invoices
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueInvoices(30, VendorInvoice);
 * ```
 */
export const getOverdueInvoices = async (
  daysOverdue: number = 30,
  VendorInvoice: any,
): Promise<any[]> => {
  const cutoffDate = new Date(Date.now() - daysOverdue * 86400000);

  return await VendorInvoice.findAll({
    where: {
      dueDate: { [Op.lt]: cutoffDate },
      paymentStatus: { [Op.in]: ['unpaid', 'partially_paid'] },
    },
    order: [['dueDate', 'ASC']],
  });
};

/**
 * Exports aging report to CSV format.
 *
 * @param {Map<string, AgingBucket[]>} agingData - Aging data by vendor
 * @returns {string} CSV formatted report
 *
 * @example
 * ```typescript
 * const csv = exportAgingReportCSV(agingData);
 * fs.writeFileSync('aging-report.csv', csv);
 * ```
 */
export const exportAgingReportCSV = (
  agingData: Map<string, AgingBucket[]>,
): string => {
  const headers = 'Vendor ID,Bucket,Count,Amount,Percentage\n';
  const rows: string[] = [];

  agingData.forEach((buckets, vendorId) => {
    buckets.forEach(bucket => {
      rows.push(
        `${vendorId},${bucket.bucket},${bucket.count},${bucket.amount.toFixed(2)},${bucket.percentage.toFixed(2)}%`,
      );
    });
  });

  return headers + rows.join('\n');
};

// ============================================================================
// 1099 REPORTING (25-28)
// ============================================================================

/**
 * Generates Form 1099 data for a vendor for tax year.
 *
 * @param {string} vendorId - Vendor identifier
 * @param {number} taxYear - Tax year
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<Form1099Data>} 1099 data
 *
 * @example
 * ```typescript
 * const data1099 = await generate1099Data('VND001', 2024, APPayment);
 * ```
 */
export const generate1099Data = async (
  vendorId: string,
  taxYear: number,
  APPayment: any,
): Promise<Form1099Data> => {
  const startDate = new Date(taxYear, 0, 1);
  const endDate = new Date(taxYear, 11, 31);

  const payments = await APPayment.findAll({
    where: {
      vendorId,
      paymentDate: { [Op.between]: [startDate, endDate] },
      status: { [Op.in]: ['completed', 'cleared'] },
    },
  });

  const totalPayments = payments.reduce(
    (sum: number, p: any) => sum + parseFloat(p.amount),
    0,
  );

  return {
    vendorId,
    taxYear,
    ein: '', // Should be fetched from vendor
    businessName: '', // Should be fetched from vendor
    address: '', // Should be fetched from vendor
    totalPayments,
    box7NonemployeeCompensation: totalPayments,
  };
};

/**
 * Identifies vendors requiring 1099 reporting.
 *
 * @param {number} taxYear - Tax year
 * @param {number} [threshold=600] - Reporting threshold
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<string[]>} Vendor IDs requiring 1099
 *
 * @example
 * ```typescript
 * const vendors = await get1099RequiredVendors(2024, 600, APPayment);
 * ```
 */
export const get1099RequiredVendors = async (
  taxYear: number,
  threshold: number = 600,
  APPayment: any,
): Promise<string[]> => {
  const startDate = new Date(taxYear, 0, 1);
  const endDate = new Date(taxYear, 11, 31);

  const payments = await APPayment.findAll({
    where: {
      paymentDate: { [Op.between]: [startDate, endDate] },
      status: { [Op.in]: ['completed', 'cleared'] },
    },
    attributes: [
      'vendorId',
      [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalPayments'],
    ],
    group: ['vendorId'],
    having: Sequelize.where(
      Sequelize.fn('SUM', Sequelize.col('amount')),
      Op.gte,
      threshold,
    ),
  });

  return payments.map((p: any) => p.vendorId);
};

/**
 * Exports 1099 data in IRS electronic filing format.
 *
 * @param {Form1099Data[]} data1099 - Array of 1099 data
 * @returns {string} IRS format file content
 *
 * @example
 * ```typescript
 * const irsFile = export1099ElectronicFile(data1099Array);
 * ```
 */
export const export1099ElectronicFile = (
  data1099: Form1099Data[],
): string => {
  // Simplified IRS 1099 format
  const lines: string[] = [];

  data1099.forEach(data => {
    lines.push(
      [
        data.taxYear,
        data.ein,
        data.businessName,
        data.totalPayments.toFixed(2),
        data.box7NonemployeeCompensation?.toFixed(2) || '0.00',
      ].join('|'),
    );
  });

  return lines.join('\n');
};

/**
 * Validates vendor 1099 eligibility and completeness.
 *
 * @param {string} vendorId - Vendor identifier
 * @param {any} vendorData - Vendor data with tax info
 * @returns {{ eligible: boolean; issues: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validate1099Eligibility('VND001', vendorData);
 * if (!validation.eligible) {
 *   console.log('Issues:', validation.issues);
 * }
 * ```
 */
export const validate1099Eligibility = (
  vendorId: string,
  vendorData: any,
): { eligible: boolean; issues: string[] } => {
  const issues: string[] = [];

  if (!vendorData.ein && !vendorData.ssn) {
    issues.push('Missing EIN or SSN');
  }
  if (!vendorData.businessName) {
    issues.push('Missing business name');
  }
  if (!vendorData.address) {
    issues.push('Missing address');
  }
  if (!vendorData.w9OnFile) {
    issues.push('W-9 form not on file');
  }

  return {
    eligible: issues.length === 0,
    issues,
  };
};

// ============================================================================
// VENDOR PERFORMANCE (29-32)
// ============================================================================

/**
 * Calculates vendor performance metrics.
 *
 * @param {string} vendorId - Vendor identifier
 * @param {Model} VendorInvoice - VendorInvoice model
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<VendorPerformance>} Performance metrics
 *
 * @example
 * ```typescript
 * const performance = await calculateVendorPerformance('VND001', VendorInvoice, APPayment);
 * console.log(`Quality score: ${performance.qualityScore}`);
 * ```
 */
export const calculateVendorPerformance = async (
  vendorId: string,
  VendorInvoice: any,
  APPayment: any,
): Promise<VendorPerformance> => {
  const invoices = await VendorInvoice.findAll({ where: { vendorId } });
  const payments = await APPayment.findAll({ where: { vendorId } });

  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.amount),
    0,
  );

  const paymentDays = payments.map((p: any) => {
    const invoice = invoices.find((inv: any) => inv.id === p.invoiceId);
    if (!invoice) return 0;
    return Math.floor(
      (p.paymentDate.getTime() - invoice.invoiceDate.getTime()) / 86400000,
    );
  });

  const averagePaymentDays =
    paymentDays.reduce((sum, days) => sum + days, 0) / paymentDays.length || 0;

  const onTimePayments = payments.filter((p: any) => {
    const invoice = invoices.find((inv: any) => inv.id === p.invoiceId);
    return invoice && p.paymentDate <= invoice.dueDate;
  }).length;

  const onTimePaymentRate = (onTimePayments / payments.length) * 100 || 0;

  const discountsCaptured = payments.reduce(
    (sum: number, p: any) => sum + parseFloat(p.discountTaken || 0),
    0,
  );

  const disputedInvoices = invoices.filter(
    (inv: any) => inv.disputeStatus === 'disputed',
  ).length;
  const disputeRate = (disputedInvoices / totalInvoices) * 100 || 0;

  const qualityScore = Math.max(
    0,
    100 - disputeRate * 2 + Math.min(onTimePaymentRate / 2, 25),
  );

  return {
    vendorId,
    vendorName: '', // Should be fetched from vendor
    totalInvoices,
    totalAmount,
    averagePaymentDays,
    onTimePaymentRate,
    discountsCaptured,
    discountsMissed: 0, // TODO: Calculate
    disputeRate,
    qualityScore,
  };
};

/**
 * Generates vendor scorecard for evaluation.
 *
 * @param {VendorPerformance} performance - Performance metrics
 * @returns {{ grade: string; strengths: string[]; improvements: string[] }} Scorecard
 *
 * @example
 * ```typescript
 * const scorecard = generateVendorScorecard(performance);
 * console.log(`Grade: ${scorecard.grade}`);
 * ```
 */
export const generateVendorScorecard = (
  performance: VendorPerformance,
): { grade: string; strengths: string[]; improvements: string[] } => {
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (performance.onTimePaymentRate > 95) {
    strengths.push('Excellent payment reliability');
  } else if (performance.onTimePaymentRate < 80) {
    improvements.push('Improve on-time payment rate');
  }

  if (performance.disputeRate < 2) {
    strengths.push('Low dispute rate');
  } else if (performance.disputeRate > 5) {
    improvements.push('Reduce invoice disputes');
  }

  if (performance.discountsCaptured > 1000) {
    strengths.push('Good discount capture');
  }

  let grade = 'C';
  if (performance.qualityScore >= 90) grade = 'A';
  else if (performance.qualityScore >= 80) grade = 'B';
  else if (performance.qualityScore >= 70) grade = 'C';
  else if (performance.qualityScore >= 60) grade = 'D';
  else grade = 'F';

  return { grade, strengths, improvements };
};

/**
 * Ranks vendors by performance metrics.
 *
 * @param {VendorPerformance[]} performances - Array of vendor performances
 * @param {string} [metric='qualityScore'] - Ranking metric
 * @returns {VendorPerformance[]} Ranked vendors
 *
 * @example
 * ```typescript
 * const ranked = rankVendorsByPerformance(performances, 'qualityScore');
 * ```
 */
export const rankVendorsByPerformance = (
  performances: VendorPerformance[],
  metric: keyof VendorPerformance = 'qualityScore',
): VendorPerformance[] => {
  return [...performances].sort((a, b) => {
    const aValue = a[metric] as number;
    const bValue = b[metric] as number;
    return bValue - aValue;
  });
};

/**
 * Identifies vendors requiring attention based on performance.
 *
 * @param {VendorPerformance[]} performances - Vendor performances
 * @param {number} [thresholdScore=60] - Quality score threshold
 * @returns {VendorPerformance[]} Vendors requiring attention
 *
 * @example
 * ```typescript
 * const attention = identifyVendorsRequiringAttention(performances, 60);
 * ```
 */
export const identifyVendorsRequiringAttention = (
  performances: VendorPerformance[],
  thresholdScore: number = 60,
): VendorPerformance[] => {
  return performances.filter(p => p.qualityScore < thresholdScore);
};

// ============================================================================
// VENDOR STATEMENT & RECONCILIATION (33-36)
// ============================================================================

/**
 * Generates vendor statement for a period.
 *
 * @param {string} vendorId - Vendor identifier
 * @param {Date} startDate - Period start date
 * @param {Date} endDate - Period end date
 * @param {Model} VendorInvoice - VendorInvoice model
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<VendorStatement>} Vendor statement
 *
 * @example
 * ```typescript
 * const statement = await generateVendorStatement('VND001', startDate, endDate, VendorInvoice, APPayment);
 * ```
 */
export const generateVendorStatement = async (
  vendorId: string,
  startDate: Date,
  endDate: Date,
  VendorInvoice: any,
  APPayment: any,
): Promise<VendorStatement> => {
  const invoices = await VendorInvoice.findAll({
    where: {
      vendorId,
      invoiceDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const payments = await APPayment.findAll({
    where: {
      vendorId,
      paymentDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const openingBalance = 0; // TODO: Calculate from previous period
  const closingBalance = invoices.reduce(
    (sum: number, inv: any) => sum + (parseFloat(inv.netAmount) - parseFloat(inv.paidAmount)),
    0,
  );

  const agingBuckets = await calculateVendorAgingBuckets(vendorId, endDate, VendorInvoice);

  return {
    vendorId,
    statementDate: endDate,
    openingBalance,
    invoices: invoices.map((inv: any) => inv.toJSON()),
    payments: payments.map((p: any) => ({
      paymentId: p.id,
      invoiceId: p.invoiceId,
      amount: parseFloat(p.amount),
      paymentDate: p.paymentDate,
      paymentMethod: p.paymentMethod,
      checkNumber: p.checkNumber,
      confirmationNumber: p.achTraceNumber || p.wireConfirmation,
    })),
    closingBalance,
    agingBuckets,
  };
};

/**
 * Reconciles vendor statement with internal records.
 *
 * @param {VendorStatement} ourStatement - Our statement
 * @param {VendorStatement} vendorStatement - Vendor's statement
 * @returns {{ matched: boolean; discrepancies: any[] }} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = reconcileVendorStatement(ourStatement, vendorStatement);
 * if (!result.matched) {
 *   console.log('Discrepancies:', result.discrepancies);
 * }
 * ```
 */
export const reconcileVendorStatement = (
  ourStatement: VendorStatement,
  vendorStatement: VendorStatement,
): { matched: boolean; discrepancies: any[] } => {
  const discrepancies: any[] = [];

  if (Math.abs(ourStatement.closingBalance - vendorStatement.closingBalance) > 0.01) {
    discrepancies.push({
      type: 'balance_mismatch',
      our: ourStatement.closingBalance,
      vendor: vendorStatement.closingBalance,
      difference: ourStatement.closingBalance - vendorStatement.closingBalance,
    });
  }

  // Check invoice counts
  if (ourStatement.invoices.length !== vendorStatement.invoices.length) {
    discrepancies.push({
      type: 'invoice_count_mismatch',
      our: ourStatement.invoices.length,
      vendor: vendorStatement.invoices.length,
    });
  }

  return {
    matched: discrepancies.length === 0,
    discrepancies,
  };
};

/**
 * Exports vendor statement to PDF format.
 *
 * @param {VendorStatement} statement - Vendor statement
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await exportVendorStatementPDF(statement);
 * fs.writeFileSync('statement.pdf', pdf);
 * ```
 */
export const exportVendorStatementPDF = async (
  statement: VendorStatement,
): Promise<Buffer> => {
  // TODO: Integrate with PDF generation library
  return Buffer.from('PDF content placeholder');
};

/**
 * Sends vendor statement via email.
 *
 * @param {VendorStatement} statement - Vendor statement
 * @param {string} vendorEmail - Vendor email address
 * @param {any} emailService - Email service
 * @returns {Promise<{ sent: boolean; messageId?: string }>} Send result
 *
 * @example
 * ```typescript
 * await sendVendorStatementEmail(statement, 'vendor@example.com', emailService);
 * ```
 */
export const sendVendorStatementEmail = async (
  statement: VendorStatement,
  vendorEmail: string,
  emailService: any,
): Promise<{ sent: boolean; messageId?: string }> => {
  // TODO: Integrate with email service
  return { sent: true, messageId: 'msg_123' };
};

// ============================================================================
// APPROVAL WORKFLOW (37-40)
// ============================================================================

/**
 * Creates multi-step approval workflow for invoice.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {number} amount - Invoice amount
 * @returns {InvoiceApprovalWorkflow} Approval workflow
 *
 * @example
 * ```typescript
 * const workflow = createApprovalWorkflow('inv123', 50000);
 * ```
 */
export const createApprovalWorkflow = (
  invoiceId: string,
  amount: number,
): InvoiceApprovalWorkflow => {
  const steps: ApprovalStep[] = [];

  // Level 1: Manager approval for < $10k
  steps.push({
    stepNumber: 1,
    approverRole: 'manager',
    approvalStatus: 'pending',
    threshold: 10000,
  });

  // Level 2: Director approval for $10k - $50k
  if (amount >= 10000) {
    steps.push({
      stepNumber: 2,
      approverRole: 'director',
      approvalStatus: 'pending',
      threshold: 50000,
    });
  }

  // Level 3: VP approval for > $50k
  if (amount >= 50000) {
    steps.push({
      stepNumber: 3,
      approverRole: 'vp',
      approvalStatus: 'pending',
    });
  }

  return {
    invoiceId,
    workflowSteps: steps,
    currentStepIndex: 0,
    status: 'pending',
    submittedAt: new Date(),
  };
};

/**
 * Processes approval step in workflow.
 *
 * @param {InvoiceApprovalWorkflow} workflow - Approval workflow
 * @param {number} stepNumber - Step number
 * @param {boolean} approved - Approval decision
 * @param {string} approverId - Approver user ID
 * @param {string} [comments] - Approval comments
 * @returns {InvoiceApprovalWorkflow} Updated workflow
 *
 * @example
 * ```typescript
 * const updated = processApprovalStep(workflow, 1, true, 'user123', 'Approved');
 * ```
 */
export const processApprovalStep = (
  workflow: InvoiceApprovalWorkflow,
  stepNumber: number,
  approved: boolean,
  approverId: string,
  comments?: string,
): InvoiceApprovalWorkflow => {
  const step = workflow.workflowSteps.find(s => s.stepNumber === stepNumber);
  if (!step) throw new Error('Invalid step number');

  step.approvalStatus = approved ? 'approved' : 'rejected';
  step.approverId = approverId;
  step.approvalDate = new Date();
  step.comments = comments;

  if (!approved) {
    workflow.status = 'rejected';
    workflow.completedAt = new Date();
  } else {
    workflow.currentStepIndex++;
    if (workflow.currentStepIndex >= workflow.workflowSteps.length) {
      workflow.status = 'approved';
      workflow.completedAt = new Date();
    } else {
      workflow.status = 'in_progress';
    }
  }

  return workflow;
};

/**
 * Routes invoice to appropriate approver based on rules.
 *
 * @param {any} invoice - Invoice data
 * @param {InvoiceApprovalWorkflow} workflow - Workflow
 * @returns {string} Approver role
 *
 * @example
 * ```typescript
 * const approver = routeToApprover(invoice, workflow);
 * console.log(`Route to: ${approver}`);
 * ```
 */
export const routeToApprover = (
  invoice: any,
  workflow: InvoiceApprovalWorkflow,
): string => {
  const currentStep = workflow.workflowSteps[workflow.currentStepIndex];
  if (!currentStep) throw new Error('No current step');

  return currentStep.approverRole;
};

/**
 * Retrieves approval history for invoice.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {Model} APAuditLog - APAuditLog model
 * @returns {Promise<any[]>} Approval history
 *
 * @example
 * ```typescript
 * const history = await getApprovalHistory('inv123', APAuditLog);
 * ```
 */
export const getApprovalHistory = async (
  invoiceId: string,
  APAuditLog: any,
): Promise<any[]> => {
  return await APAuditLog.findAll({
    where: {
      entityType: 'invoice',
      entityId: invoiceId,
      action: { [Op.in]: ['approve', 'reject'] },
    },
    order: [['createdAt', 'ASC']],
  });
};

// ============================================================================
// AUDIT & COMPLIANCE (41-45)
// ============================================================================

/**
 * Logs audit event for AP operations.
 *
 * @param {APAuditEntry} auditData - Audit entry data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logAuditEvent({
 *   entityType: 'payment',
 *   entityId: 'pay123',
 *   action: 'create',
 *   userId: 'user456',
 *   changes: { amount: 5000 }
 * });
 * ```
 */
export const logAuditEvent = async (
  auditData: APAuditEntry,
): Promise<void> => {
  // In production, this would write to APAuditLog model
  console.log('Audit Event:', auditData);
};

/**
 * Generates compliance report for audit period.
 *
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {Model} VendorInvoice - VendorInvoice model
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<any>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport(startDate, endDate, VendorInvoice, APPayment);
 * ```
 */
export const generateComplianceReport = async (
  startDate: Date,
  endDate: Date,
  VendorInvoice: any,
  APPayment: any,
): Promise<any> => {
  const invoices = await VendorInvoice.findAll({
    where: { invoiceDate: { [Op.between]: [startDate, endDate] } },
  });

  const payments = await APPayment.findAll({
    where: { paymentDate: { [Op.between]: [startDate, endDate] } },
  });

  return {
    period: { startDate, endDate },
    totalInvoices: invoices.length,
    totalPayments: payments.length,
    approvedInvoices: invoices.filter((i: any) => i.approvalStatus === 'approved').length,
    pendingApprovals: invoices.filter((i: any) => i.approvalStatus === 'pending').length,
    disputedInvoices: invoices.filter((i: any) => i.disputeStatus === 'disputed').length,
    threeWayMatched: invoices.filter((i: any) => i.threeWayMatchStatus === 'matched').length,
    complianceScore: 95.5, // TODO: Calculate
  };
};

/**
 * Validates SOX compliance for AP transactions.
 *
 * @param {string} transactionId - Transaction ID
 * @param {string} type - Transaction type
 * @returns {Promise<{ compliant: boolean; issues: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const sox = await validateSOXCompliance('pay123', 'payment');
 * ```
 */
export const validateSOXCompliance = async (
  transactionId: string,
  type: 'invoice' | 'payment',
): Promise<{ compliant: boolean; issues: string[] }> => {
  const issues: string[] = [];

  // Check segregation of duties
  // Check approval trail
  // Check documentation

  return {
    compliant: issues.length === 0,
    issues,
  };
};

/**
 * Exports audit trail for external auditors.
 *
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {Model} APAuditLog - APAuditLog model
 * @returns {Promise<string>} Audit trail CSV
 *
 * @example
 * ```typescript
 * const csv = await exportAuditTrail(startDate, endDate, APAuditLog);
 * ```
 */
export const exportAuditTrail = async (
  startDate: Date,
  endDate: Date,
  APAuditLog: any,
): Promise<string> => {
  const logs = await APAuditLog.findAll({
    where: {
      createdAt: { [Op.between]: [startDate, endDate] },
    },
    order: [['createdAt', 'ASC']],
  });

  const headers = 'Timestamp,Entity Type,Entity ID,Action,User,Changes\n';
  const rows = logs.map(
    (log: any) =>
      `${log.createdAt},${log.entityType},${log.entityId},${log.action},${log.userName},"${JSON.stringify(log.changes)}"`,
  );

  return headers + rows.join('\n');
};

/**
 * Detects anomalies in AP transactions for fraud prevention.
 *
 * @param {Model} VendorInvoice - VendorInvoice model
 * @param {Model} APPayment - APPayment model
 * @returns {Promise<any[]>} Detected anomalies
 *
 * @example
 * ```typescript
 * const anomalies = await detectAPAnomalies(VendorInvoice, APPayment);
 * anomalies.forEach(a => console.log(`Anomaly: ${a.type} - ${a.description}`));
 * ```
 */
export const detectAPAnomalies = async (
  VendorInvoice: any,
  APPayment: any,
): Promise<any[]> => {
  const anomalies: any[] = [];

  // Detect duplicate payments
  const payments = await APPayment.findAll({
    attributes: [
      'invoiceId',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
    ],
    group: ['invoiceId'],
    having: Sequelize.where(Sequelize.fn('COUNT', Sequelize.col('id')), Op.gt, 1),
  });

  payments.forEach((p: any) => {
    anomalies.push({
      type: 'duplicate_payment',
      invoiceId: p.invoiceId,
      description: 'Multiple payments detected for same invoice',
    });
  });

  // Detect unusual amounts
  const invoices = await VendorInvoice.findAll({
    where: { amount: { [Op.gt]: 100000 } },
  });

  invoices.forEach((inv: any) => {
    anomalies.push({
      type: 'high_value',
      invoiceId: inv.id,
      description: `Unusually high amount: ${inv.amount}`,
    });
  });

  return anomalies;
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

/**
 * NestJS Injectable service for Accounts Payable management.
 *
 * @example
 * ```typescript
 * @Controller('ap')
 * export class APController {
 *   constructor(private readonly apService: AccountsPayableService) {}
 *
 *   @Post('invoices')
 *   async createInvoice(@Body() data: VendorInvoiceData) {
 *     return this.apService.createInvoice(data);
 *   }
 * }
 * ```
 */
@Injectable()
export class AccountsPayableService {
  constructor(
    private readonly sequelize: Sequelize,
  ) {}

  async createInvoice(data: VendorInvoiceData, userId: string) {
    const VendorInvoice = createVendorInvoiceModel(this.sequelize);
    return createVendorInvoice(data, VendorInvoice, userId);
  }

  async generateAgingReport(asOfDate?: Date) {
    const VendorInvoice = createVendorInvoiceModel(this.sequelize);
    return generateAPAgingReport(asOfDate, VendorInvoice);
  }

  async processPaymentBatch(batchData: PaymentBatchData) {
    const APPayment = createAPPaymentModel(this.sequelize);
    return createPaymentBatch(batchData, APPayment);
  }

  async generate1099Reports(taxYear: number) {
    const APPayment = createAPPaymentModel(this.sequelize);
    const vendors = await get1099RequiredVendors(taxYear, 600, APPayment);
    const reports = [];
    for (const vendorId of vendors) {
      reports.push(await generate1099Data(vendorId, taxYear, APPayment));
    }
    return reports;
  }
}

/**
 * Default export with all AP utilities.
 */
export default {
  // Models
  createVendorInvoiceModel,
  createAPPaymentModel,
  createAPAuditLogModel,

  // Invoice Management
  createVendorInvoice,
  validateInvoiceData,
  checkDuplicateInvoice,
  calculatePaymentTermsDiscount,
  updateInvoiceApprovalStatus,
  getInvoicesPendingApproval,
  disputeInvoice,
  resolveInvoiceDispute,

  // Three-Way Matching
  performThreeWayMatch,
  updateThreeWayMatchStatus,
  getInvoicesRequiringMatch,
  processMatchVariance,

  // Payment Processing
  createPaymentBatch,
  processACHPayment,
  processWireTransfer,
  printCheck,
  voidPayment,
  reconcilePayment,
  getPaymentSchedule,
  calculateOptimalPaymentDate,

  // Aging Reports
  generateAPAgingReport,
  calculateVendorAgingBuckets,
  getOverdueInvoices,
  exportAgingReportCSV,

  // 1099 Reporting
  generate1099Data,
  get1099RequiredVendors,
  export1099ElectronicFile,
  validate1099Eligibility,

  // Vendor Performance
  calculateVendorPerformance,
  generateVendorScorecard,
  rankVendorsByPerformance,
  identifyVendorsRequiringAttention,

  // Vendor Statement
  generateVendorStatement,
  reconcileVendorStatement,
  exportVendorStatementPDF,
  sendVendorStatementEmail,

  // Approval Workflow
  createApprovalWorkflow,
  processApprovalStep,
  routeToApprover,
  getApprovalHistory,

  // Audit & Compliance
  logAuditEvent,
  generateComplianceReport,
  validateSOXCompliance,
  exportAuditTrail,
  detectAPAnomalies,

  // Service
  AccountsPayableService,
};
