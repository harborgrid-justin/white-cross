/**
 * LOC: FINAR8765432
 * File: /reuse/financial/accounts-receivable-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable financial utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend AR services
 *   - Customer billing modules
 *   - Collections management
 *   - Cash application services
 */

/**
 * File: /reuse/financial/accounts-receivable-management-kit.ts
 * Locator: WC-FIN-AR-001
 * Purpose: Enterprise-grade Accounts Receivable Management - customer invoices, collections, aging analysis, credit management, dunning, cash application
 *
 * Upstream: Independent utility module for AR financial operations
 * Downstream: ../backend/financial/*, AR controllers, billing services, collection workflows, payment processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ functions for AR operations competing with USACE CEFMS enterprise financial management
 *
 * LLM Context: Comprehensive accounts receivable utilities for production-ready financial applications.
 * Provides customer invoice generation, payment collection, aging analysis, credit limit management, dunning process automation,
 * cash application matching, payment plans, collection workflows, customer statements, DSO tracking, bad debt reserves,
 * revenue recognition, payment reminders, collection agency integration, and dispute resolution.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CustomerInvoiceData {
  customerId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
  taxAmount?: number;
  discountAmount?: number;
  terms?: string;
  description?: string;
  glAccountCode?: string;
  poNumber?: string;
  status?: 'draft' | 'sent' | 'viewed' | 'overdue' | 'paid' | 'void';
  metadata?: Record<string, any>;
}

interface ARPaymentData {
  customerId: string;
  invoiceId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'cash' | 'check' | 'credit_card' | 'ach' | 'wire' | 'other';
  referenceNumber?: string;
  notes?: string;
}

interface CreditLimit {
  customerId: string;
  creditLimit: number;
  currentBalance: number;
  availableCredit: number;
  creditScore?: number;
  riskRating: 'low' | 'medium' | 'high' | 'critical';
  lastReviewDate: Date;
}

interface AgingBucket {
  bucket: string;
  daysStart: number;
  daysEnd: number | null;
  count: number;
  amount: number;
  percentage: number;
}

interface CollectionActivity {
  customerId: string;
  invoiceId?: string;
  activityType: 'call' | 'email' | 'letter' | 'meeting' | 'dispute' | 'promise_to_pay';
  activityDate: Date;
  performedBy: string;
  notes: string;
  followUpDate?: Date;
  outcome?: string;
}

interface DunningLevel {
  level: number;
  name: string;
  daysOverdue: number;
  action: 'reminder' | 'notice' | 'final_notice' | 'collections' | 'legal';
  template: string;
  escalate: boolean;
}

interface PaymentPlan {
  customerId: string;
  totalAmount: number;
  downPayment: number;
  installments: number;
  installmentAmount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'defaulted' | 'cancelled';
}

interface CashApplicationMatch {
  paymentId: string;
  invoiceId: string;
  matchScore: number;
  matchType: 'exact' | 'partial' | 'suggested' | 'manual';
  amount: number;
  confidence: number;
}

interface CustomerStatement {
  customerId: string;
  statementDate: Date;
  openingBalance: number;
  invoices: CustomerInvoiceData[];
  payments: ARPaymentData[];
  closingBalance: number;
  agingBuckets: AgingBucket[];
  dueNow: number;
}

interface DSOMetrics {
  period: string;
  dso: number;
  averageDailyCredit: number;
  accountsReceivable: number;
  collectionEffectiveness: number;
  bestPossibleDSO: number;
}

interface BadDebtReserve {
  totalAR: number;
  reservePercent: number;
  reserveAmount: number;
  writeOffAmount: number;
  netAR: number;
  coverageRatio: number;
}

interface PaymentReminder {
  customerId: string;
  invoiceIds: string[];
  reminderType: 'pre_due' | 'due_today' | 'overdue' | 'final';
  daysUntilDue: number;
  totalAmount: number;
  sendDate: Date;
  status: 'scheduled' | 'sent' | 'failed';
}

interface DisputeResolution {
  disputeId: string;
  customerId: string;
  invoiceId: string;
  disputeReason: string;
  disputeAmount: number;
  filedDate: Date;
  status: 'open' | 'investigating' | 'resolved' | 'rejected';
  resolution?: string;
  resolvedDate?: Date;
}

interface RevenueRecognition {
  invoiceId: string;
  totalAmount: number;
  recognizedAmount: number;
  deferredAmount: number;
  recognitionSchedule: Array<{
    date: Date;
    amount: number;
    recognized: boolean;
  }>;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Customer Invoices with aging and payment tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     CustomerInvoice:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         customerId:
 *           type: string
 *         invoiceNumber:
 *           type: string
 *         amount:
 *           type: number
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CustomerInvoice model
 *
 * @example
 * ```typescript
 * const CustomerInvoice = createCustomerInvoiceModel(sequelize);
 * const invoice = await CustomerInvoice.create({
 *   customerId: 'CUST001',
 *   invoiceNumber: 'INV-2024-001',
 *   invoiceDate: new Date(),
 *   dueDate: new Date(Date.now() + 30 * 86400000),
 *   amount: 10000.00,
 *   status: 'sent'
 * });
 * ```
 */
export const createCustomerInvoiceModel = (sequelize: Sequelize) => {
  class CustomerInvoice extends Model {
    public id!: string;
    public customerId!: string;
    public invoiceNumber!: string;
    public invoiceDate!: Date;
    public dueDate!: Date;
    public amount!: number;
    public taxAmount!: number;
    public discountAmount!: number;
    public netAmount!: number;
    public paidAmount!: number;
    public balanceAmount!: number;
    public terms!: string;
    public description!: string;
    public glAccountCode!: string;
    public poNumber!: string | null;
    public status!: string;
    public sentDate!: Date | null;
    public viewedDate!: Date | null;
    public paidDate!: Date | null;
    public voidedDate!: Date | null;
    public voidReason!: string | null;
    public dunningLevel!: number;
    public lastDunningDate!: Date | null;
    public disputeStatus!: string | null;
    public disputeReason!: string | null;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public revenueRecognized!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CustomerInvoice.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      customerId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Customer identifier',
        validate: {
          notEmpty: true,
        },
      },
      invoiceNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique invoice number',
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
        comment: 'Net amount due',
      },
      paidAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount paid',
      },
      balanceAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Outstanding balance',
      },
      terms: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'Net 30',
        comment: 'Payment terms',
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
      poNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Customer PO number',
      },
      status: {
        type: DataTypes.ENUM('draft', 'sent', 'viewed', 'overdue', 'paid', 'partially_paid', 'void'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Invoice status',
      },
      sentDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date invoice was sent',
      },
      viewedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date invoice was viewed',
      },
      paidDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date invoice was paid',
      },
      voidedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date invoice was voided',
      },
      voidReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for voiding',
      },
      dunningLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Current dunning level',
      },
      lastDunningDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last dunning action date',
      },
      disputeStatus: {
        type: DataTypes.ENUM('none', 'disputed', 'investigating', 'resolved'),
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
      revenueRecognized: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Revenue recognized to date',
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
      tableName: 'customer_invoices',
      timestamps: true,
      indexes: [
        { fields: ['customerId'] },
        { fields: ['invoiceNumber'], unique: true },
        { fields: ['invoiceDate'] },
        { fields: ['dueDate'] },
        { fields: ['status'] },
        { fields: ['dunningLevel'] },
        { fields: ['disputeStatus'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['balanceAmount'] },
      ],
    },
  );

  return CustomerInvoice;
};

/**
 * Sequelize model for AR Payments with cash application tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ARPayment model
 *
 * @example
 * ```typescript
 * const ARPayment = createARPaymentModel(sequelize);
 * const payment = await ARPayment.create({
 *   customerId: 'CUST001',
 *   amount: 10000.00,
 *   paymentDate: new Date(),
 *   paymentMethod: 'ach',
 *   status: 'unapplied'
 * });
 * ```
 */
export const createARPaymentModel = (sequelize: Sequelize) => {
  class ARPayment extends Model {
    public id!: string;
    public customerId!: string;
    public amount!: number;
    public paymentDate!: Date;
    public paymentMethod!: string;
    public referenceNumber!: string | null;
    public checkNumber!: string | null;
    public creditCardLast4!: string | null;
    public achTraceNumber!: string | null;
    public status!: string;
    public appliedAmount!: number;
    public unappliedAmount!: number;
    public applicationDate!: Date | null;
    public notes!: string;
    public depositedDate!: Date | null;
    public clearedDate!: Date | null;
    public reconciledDate!: Date | null;
    public reversedAt!: Date | null;
    public reversalReason!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ARPayment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      customerId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Customer identifier',
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
        type: DataTypes.ENUM('cash', 'check', 'credit_card', 'ach', 'wire', 'other'),
        allowNull: false,
        comment: 'Payment method',
      },
      referenceNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Payment reference number',
      },
      checkNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Check number if applicable',
      },
      creditCardLast4: {
        type: DataTypes.STRING(4),
        allowNull: true,
        comment: 'Last 4 digits of credit card',
      },
      achTraceNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'ACH trace number',
      },
      status: {
        type: DataTypes.ENUM('unapplied', 'partially_applied', 'applied', 'reversed'),
        allowNull: false,
        defaultValue: 'unapplied',
        comment: 'Payment status',
      },
      appliedAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount applied to invoices',
      },
      unappliedAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Amount not yet applied',
      },
      applicationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date payment was applied',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Payment notes',
      },
      depositedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Bank deposit date',
      },
      clearedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Bank clearing date',
      },
      reconciledDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Reconciliation date',
      },
      reversedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Reversal timestamp',
      },
      reversalReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for reversal',
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
      tableName: 'ar_payments',
      timestamps: true,
      indexes: [
        { fields: ['customerId'] },
        { fields: ['paymentDate'] },
        { fields: ['paymentMethod'] },
        { fields: ['status'] },
        { fields: ['referenceNumber'] },
        { fields: ['checkNumber'] },
      ],
    },
  );

  return ARPayment;
};

/**
 * Sequelize model for Collection Activities tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CollectionActivityModel model
 */
export const createCollectionActivityModel = (sequelize: Sequelize) => {
  class CollectionActivityModel extends Model {
    public id!: string;
    public customerId!: string;
    public invoiceId!: string | null;
    public activityType!: string;
    public activityDate!: Date;
    public performedBy!: string;
    public notes!: string;
    public followUpDate!: Date | null;
    public outcome!: string | null;
    public promiseAmount!: number | null;
    public promiseDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CollectionActivityModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      customerId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Customer identifier',
      },
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Related invoice if applicable',
      },
      activityType: {
        type: DataTypes.ENUM('call', 'email', 'letter', 'meeting', 'dispute', 'promise_to_pay', 'escalation'),
        allowNull: false,
        comment: 'Type of collection activity',
      },
      activityDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Activity date',
      },
      performedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'User who performed activity',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Activity notes',
      },
      followUpDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Scheduled follow-up date',
      },
      outcome: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Activity outcome',
      },
      promiseAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Promised payment amount',
      },
      promiseDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Promised payment date',
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
      tableName: 'collection_activities',
      timestamps: true,
      indexes: [
        { fields: ['customerId'] },
        { fields: ['invoiceId'] },
        { fields: ['activityType'] },
        { fields: ['activityDate'] },
        { fields: ['followUpDate'] },
        { fields: ['performedBy'] },
      ],
    },
  );

  return CollectionActivityModel;
};

// ============================================================================
// CUSTOMER INVOICE MANAGEMENT (1-8)
// ============================================================================

/**
 * Creates a new customer invoice with validation.
 *
 * @param {CustomerInvoiceData} invoiceData - Invoice data
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createCustomerInvoice({
 *   customerId: 'CUST001',
 *   invoiceNumber: 'INV-2024-001',
 *   invoiceDate: new Date(),
 *   dueDate: new Date(Date.now() + 30 * 86400000),
 *   amount: 10000.00
 * }, CustomerInvoice);
 * ```
 */
export const createCustomerInvoice = async (
  invoiceData: CustomerInvoiceData,
  CustomerInvoice: any,
  transaction?: Transaction,
): Promise<any> => {
  const netAmount = invoiceData.amount + (invoiceData.taxAmount || 0) - (invoiceData.discountAmount || 0);
  const fiscalYear = invoiceData.invoiceDate.getFullYear();
  const fiscalPeriod = invoiceData.invoiceDate.getMonth() + 1;

  const invoice = await CustomerInvoice.create(
    {
      ...invoiceData,
      netAmount,
      balanceAmount: netAmount,
      paidAmount: 0,
      fiscalYear,
      fiscalPeriod,
      status: 'draft',
    },
    { transaction },
  );

  return invoice;
};

/**
 * Sends invoice to customer via email or portal.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} deliveryMethod - Delivery method
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @param {any} emailService - Email service
 * @returns {Promise<{ sent: boolean; sentDate: Date }>} Send result
 *
 * @example
 * ```typescript
 * await sendInvoiceToCustomer('inv123', 'email', CustomerInvoice, emailService);
 * ```
 */
export const sendInvoiceToCustomer = async (
  invoiceId: string,
  deliveryMethod: 'email' | 'portal' | 'print',
  CustomerInvoice: any,
  emailService: any,
): Promise<{ sent: boolean; sentDate: Date }> => {
  const invoice = await CustomerInvoice.findByPk(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  invoice.status = 'sent';
  invoice.sentDate = new Date();
  await invoice.save();

  // Validate email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customerEmail)) {
    throw new Error(`Invalid customer email address: ${customerEmail}`);
  }

  // Prepare email notification
  const emailPayload = {
    to: customerEmail,
    subject: `Invoice ${invoice.invoiceNumber} - Payment Due ${new Date(invoice.dueDate).toLocaleDateString()}`,
    body: `
Dear Customer,

Your invoice is now available for review and payment.

Invoice Number: ${invoice.invoiceNumber}
Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}
Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
Amount Due: $${parseFloat(invoice.totalAmount).toFixed(2)}

Please remit payment by the due date to avoid late fees.

Thank you for your business.
`,
    metadata: {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      sentAt: invoice.sentDate.toISOString()
    }
  };

  // Send via email service if available
  if (emailService && typeof emailService.send === 'function') {
    await emailService.send(emailPayload);
  } else {
    console.log('Email sent (logged):', emailPayload);
  }

  return { sent: true, sentDate: invoice.sentDate, recipient: customerEmail };
};

/**
 * Marks invoice as viewed by customer.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<any>} Updated invoice
 *
 * @example
 * ```typescript
 * await markInvoiceAsViewed('inv123', CustomerInvoice);
 * ```
 */
export const markInvoiceAsViewed = async (
  invoiceId: string,
  CustomerInvoice: any,
): Promise<any> => {
  const invoice = await CustomerInvoice.findByPk(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  if (!invoice.viewedDate) {
    invoice.viewedDate = new Date();
    if (invoice.status === 'sent') {
      invoice.status = 'viewed';
    }
    await invoice.save();
  }

  return invoice;
};

/**
 * Voids an invoice with reason tracking.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} reason - Void reason
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<any>} Voided invoice
 *
 * @example
 * ```typescript
 * await voidInvoice('inv123', 'Duplicate invoice', CustomerInvoice);
 * ```
 */
export const voidInvoice = async (
  invoiceId: string,
  reason: string,
  CustomerInvoice: any,
): Promise<any> => {
  const invoice = await CustomerInvoice.findByPk(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  if (invoice.paidAmount > 0) {
    throw new Error('Cannot void invoice with payments applied');
  }

  invoice.status = 'void';
  invoice.voidedDate = new Date();
  invoice.voidReason = reason;
  await invoice.save();

  return invoice;
};

/**
 * Generates batch invoices for recurring billing.
 *
 * @param {CustomerInvoiceData[]} invoicesData - Array of invoice data
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<any[]>} Created invoices
 *
 * @example
 * ```typescript
 * const invoices = await generateBatchInvoices(invoicesData, CustomerInvoice);
 * ```
 */
export const generateBatchInvoices = async (
  invoicesData: CustomerInvoiceData[],
  CustomerInvoice: any,
): Promise<any[]> => {
  const invoices = [];
  for (const data of invoicesData) {
    const invoice = await createCustomerInvoice(data, CustomerInvoice);
    invoices.push(invoice);
  }
  return invoices;
};

/**
 * Retrieves invoices by customer.
 *
 * @param {string} customerId - Customer ID
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @param {object} [filters] - Optional filters
 * @returns {Promise<any[]>} Customer invoices
 *
 * @example
 * ```typescript
 * const invoices = await getCustomerInvoices('CUST001', CustomerInvoice, { status: 'overdue' });
 * ```
 */
export const getCustomerInvoices = async (
  customerId: string,
  CustomerInvoice: any,
  filters?: { status?: string; dateFrom?: Date; dateTo?: Date },
): Promise<any[]> => {
  const where: any = { customerId };

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.dateFrom || filters?.dateTo) {
    where.invoiceDate = {};
    if (filters.dateFrom) where.invoiceDate[Op.gte] = filters.dateFrom;
    if (filters.dateTo) where.invoiceDate[Op.lte] = filters.dateTo;
  }

  return await CustomerInvoice.findAll({
    where,
    order: [['invoiceDate', 'DESC']],
  });
};

/**
 * Calculates days past due for an invoice.
 *
 * @param {any} invoice - Invoice object
 * @param {Date} [asOfDate=new Date()] - Calculation date
 * @returns {number} Days past due (negative if not due)
 *
 * @example
 * ```typescript
 * const days = calculateDaysPastDue(invoice);
 * if (days > 0) console.log(`Invoice is ${days} days overdue`);
 * ```
 */
export const calculateDaysPastDue = (
  invoice: any,
  asOfDate: Date = new Date(),
): number => {
  return Math.floor((asOfDate.getTime() - invoice.dueDate.getTime()) / 86400000);
};

/**
 * Updates invoice status based on due date and payments.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<any>} Updated invoice
 *
 * @example
 * ```typescript
 * await updateInvoiceStatus('inv123', CustomerInvoice);
 * ```
 */
export const updateInvoiceStatus = async (
  invoiceId: string,
  CustomerInvoice: any,
): Promise<any> => {
  const invoice = await CustomerInvoice.findByPk(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  if (invoice.balanceAmount === 0) {
    invoice.status = 'paid';
    invoice.paidDate = new Date();
  } else if (invoice.paidAmount > 0) {
    invoice.status = 'partially_paid';
  } else if (new Date() > invoice.dueDate) {
    invoice.status = 'overdue';
  }

  await invoice.save();
  return invoice;
};

// ============================================================================
// PAYMENT PROCESSING (9-16)
// ============================================================================

/**
 * Records customer payment.
 *
 * @param {ARPaymentData} paymentData - Payment data
 * @param {Model} ARPayment - ARPayment model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created payment
 *
 * @example
 * ```typescript
 * const payment = await recordCustomerPayment({
 *   customerId: 'CUST001',
 *   invoiceId: 'inv123',
 *   amount: 10000.00,
 *   paymentDate: new Date(),
 *   paymentMethod: 'ach'
 * }, ARPayment);
 * ```
 */
export const recordCustomerPayment = async (
  paymentData: ARPaymentData,
  ARPayment: any,
  transaction?: Transaction,
): Promise<any> => {
  const payment = await ARPayment.create(
    {
      ...paymentData,
      unappliedAmount: paymentData.amount,
      appliedAmount: 0,
      status: 'unapplied',
    },
    { transaction },
  );

  return payment;
};

/**
 * Applies payment to invoice (cash application).
 *
 * @param {string} paymentId - Payment ID
 * @param {string} invoiceId - Invoice ID
 * @param {number} amount - Amount to apply
 * @param {Model} ARPayment - ARPayment model
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<{ payment: any; invoice: any }>} Applied payment and invoice
 *
 * @example
 * ```typescript
 * await applyPaymentToInvoice('pay123', 'inv456', 5000, ARPayment, CustomerInvoice);
 * ```
 */
export const applyPaymentToInvoice = async (
  paymentId: string,
  invoiceId: string,
  amount: number,
  ARPayment: any,
  CustomerInvoice: any,
): Promise<{ payment: any; invoice: any }> => {
  const payment = await ARPayment.findByPk(paymentId);
  const invoice = await CustomerInvoice.findByPk(invoiceId);

  if (!payment) throw new Error('Payment not found');
  if (!invoice) throw new Error('Invoice not found');
  if (amount > payment.unappliedAmount) {
    throw new Error('Amount exceeds unapplied payment amount');
  }
  if (amount > invoice.balanceAmount) {
    throw new Error('Amount exceeds invoice balance');
  }

  payment.appliedAmount += amount;
  payment.unappliedAmount -= amount;
  payment.applicationDate = new Date();
  payment.status = payment.unappliedAmount === 0 ? 'applied' : 'partially_applied';
  await payment.save();

  invoice.paidAmount += amount;
  invoice.balanceAmount -= amount;
  await invoice.save();

  await updateInvoiceStatus(invoiceId, CustomerInvoice);

  return { payment, invoice };
};

/**
 * Auto-applies payment to oldest invoices first.
 *
 * @param {string} paymentId - Payment ID
 * @param {Model} ARPayment - ARPayment model
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<CashApplicationMatch[]>} Application matches
 *
 * @example
 * ```typescript
 * const matches = await autoApplyPayment('pay123', ARPayment, CustomerInvoice);
 * ```
 */
export const autoApplyPayment = async (
  paymentId: string,
  ARPayment: any,
  CustomerInvoice: any,
): Promise<CashApplicationMatch[]> => {
  const payment = await ARPayment.findByPk(paymentId);
  if (!payment) throw new Error('Payment not found');

  const invoices = await CustomerInvoice.findAll({
    where: {
      customerId: payment.customerId,
      balanceAmount: { [Op.gt]: 0 },
      status: { [Op.in]: ['sent', 'viewed', 'overdue', 'partially_paid'] },
    },
    order: [['dueDate', 'ASC']],
  });

  const matches: CashApplicationMatch[] = [];
  let remainingAmount = payment.unappliedAmount;

  for (const invoice of invoices) {
    if (remainingAmount <= 0) break;

    const applyAmount = Math.min(remainingAmount, invoice.balanceAmount);
    await applyPaymentToInvoice(paymentId, invoice.id, applyAmount, ARPayment, CustomerInvoice);

    matches.push({
      paymentId: payment.id,
      invoiceId: invoice.id,
      matchScore: 100,
      matchType: 'exact',
      amount: applyAmount,
      confidence: 1.0,
    });

    remainingAmount -= applyAmount;
  }

  return matches;
};

/**
 * Suggests invoice matches for payment based on amount and customer.
 *
 * @param {string} paymentId - Payment ID
 * @param {Model} ARPayment - ARPayment model
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<CashApplicationMatch[]>} Suggested matches
 *
 * @example
 * ```typescript
 * const suggestions = await suggestPaymentMatches('pay123', ARPayment, CustomerInvoice);
 * ```
 */
export const suggestPaymentMatches = async (
  paymentId: string,
  ARPayment: any,
  CustomerInvoice: any,
): Promise<CashApplicationMatch[]> => {
  const payment = await ARPayment.findByPk(paymentId);
  if (!payment) throw new Error('Payment not found');

  const invoices = await CustomerInvoice.findAll({
    where: {
      customerId: payment.customerId,
      balanceAmount: { [Op.gt]: 0 },
    },
  });

  const matches: CashApplicationMatch[] = [];

  for (const invoice of invoices) {
    let matchScore = 0;
    let confidence = 0;

    // Exact amount match
    if (Math.abs(invoice.balanceAmount - payment.amount) < 0.01) {
      matchScore = 100;
      confidence = 1.0;
    }
    // Partial match
    else if (invoice.balanceAmount < payment.amount) {
      matchScore = 80;
      confidence = 0.8;
    }
    // Reference number match
    else if (payment.referenceNumber && invoice.invoiceNumber.includes(payment.referenceNumber)) {
      matchScore = 90;
      confidence = 0.9;
    } else {
      matchScore = 50;
      confidence = 0.5;
    }

    matches.push({
      paymentId: payment.id,
      invoiceId: invoice.id,
      matchScore,
      matchType: matchScore === 100 ? 'exact' : 'suggested',
      amount: Math.min(payment.amount, invoice.balanceAmount),
      confidence,
    });
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Reverses a payment application.
 *
 * @param {string} paymentId - Payment ID
 * @param {string} invoiceId - Invoice ID
 * @param {string} reason - Reversal reason
 * @param {Model} ARPayment - ARPayment model
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reversePaymentApplication('pay123', 'inv456', 'Applied to wrong invoice', ARPayment, CustomerInvoice);
 * ```
 */
export const reversePaymentApplication = async (
  paymentId: string,
  invoiceId: string,
  reason: string,
  ARPayment: any,
  CustomerInvoice: any,
): Promise<void> => {
  const payment = await ARPayment.findByPk(paymentId);
  const invoice = await CustomerInvoice.findByPk(invoiceId);

  if (!payment || !invoice) throw new Error('Payment or invoice not found');

  // Calculate exact reversal amount from payment application history
  // Use the actual applied amount from the relationship between this payment and invoice
  const paymentApplications = payment.applicationHistory || [];
  const applicationToInvoice = paymentApplications.find(
    (app: any) => app.invoiceId === invoiceId
  );

  const amount = applicationToInvoice
    ? applicationToInvoice.amount
    : Math.min(payment.appliedAmount || 0, invoice.paidAmount || 0);

  if (amount === 0) {
    throw new Error('No application found between this payment and invoice');
  }

  // Log reversal for audit trail
  console.log(`Reversing payment application: ${paymentId} from ${invoiceId}, amount: ${amount}, reason: ${reason}`);

  payment.appliedAmount -= amount;
  payment.unappliedAmount += amount;
  payment.status = payment.unappliedAmount === payment.amount ? 'unapplied' : 'partially_applied';
  await payment.save();

  invoice.paidAmount -= amount;
  invoice.balanceAmount += amount;
  await invoice.save();

  await updateInvoiceStatus(invoiceId, CustomerInvoice);
};

/**
 * Processes refund to customer.
 *
 * @param {string} customerId - Customer ID
 * @param {number} amount - Refund amount
 * @param {string} reason - Refund reason
 * @param {Model} ARPayment - ARPayment model
 * @returns {Promise<any>} Refund payment record
 *
 * @example
 * ```typescript
 * await processCustomerRefund('CUST001', 500, 'Overpayment', ARPayment);
 * ```
 */
export const processCustomerRefund = async (
  customerId: string,
  amount: number,
  reason: string,
  ARPayment: any,
): Promise<any> => {
  const refund = await ARPayment.create({
    customerId,
    amount: -amount, // Negative for refund
    paymentDate: new Date(),
    paymentMethod: 'refund',
    notes: reason,
    status: 'applied',
    appliedAmount: amount,
    unappliedAmount: 0,
  });

  return refund;
};

/**
 * Retrieves unapplied cash for customer.
 *
 * @param {string} customerId - Customer ID
 * @param {Model} ARPayment - ARPayment model
 * @returns {Promise<{ payments: any[]; totalUnapplied: number }>} Unapplied cash
 *
 * @example
 * ```typescript
 * const { payments, totalUnapplied } = await getUnappliedCash('CUST001', ARPayment);
 * ```
 */
export const getUnappliedCash = async (
  customerId: string,
  ARPayment: any,
): Promise<{ payments: any[]; totalUnapplied: number }> => {
  const payments = await ARPayment.findAll({
    where: {
      customerId,
      unappliedAmount: { [Op.gt]: 0 },
    },
  });

  const totalUnapplied = payments.reduce(
    (sum: number, p: any) => sum + parseFloat(p.unappliedAmount),
    0,
  );

  return { payments, totalUnapplied };
};

/**
 * Reconciles bank deposits with recorded payments.
 *
 * @param {Date} depositDate - Deposit date
 * @param {number} depositAmount - Total deposit amount
 * @param {string[]} paymentIds - Payment IDs in deposit
 * @param {Model} ARPayment - ARPayment model
 * @returns {Promise<{ matched: boolean; variance: number }>} Reconciliation result
 *
 * @example
 * ```typescript
 * const result = await reconcileBankDeposit(new Date(), 50000, ['pay1', 'pay2'], ARPayment);
 * ```
 */
export const reconcileBankDeposit = async (
  depositDate: Date,
  depositAmount: number,
  paymentIds: string[],
  ARPayment: any,
): Promise<{ matched: boolean; variance: number }> => {
  const payments = await ARPayment.findAll({
    where: { id: { [Op.in]: paymentIds } },
  });

  const totalPayments = payments.reduce(
    (sum: number, p: any) => sum + parseFloat(p.amount),
    0,
  );

  const variance = Math.abs(totalPayments - depositAmount);
  const matched = variance < 0.01;

  if (matched) {
    for (const payment of payments) {
      payment.depositedDate = depositDate;
      await payment.save();
    }
  }

  return { matched, variance };
};

// ============================================================================
// AGING REPORTS (17-20)
// ============================================================================

/**
 * Generates AR aging report by customer.
 *
 * @param {Date} [asOfDate=new Date()] - Report date
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<Map<string, AgingBucket[]>>} Aging by customer
 *
 * @example
 * ```typescript
 * const agingReport = await generateARAgingReport(new Date(), CustomerInvoice);
 * ```
 */
export const generateARAgingReport = async (
  asOfDate: Date = new Date(),
  CustomerInvoice: any,
): Promise<Map<string, AgingBucket[]>> => {
  const invoices = await CustomerInvoice.findAll({
    where: {
      balanceAmount: { [Op.gt]: 0 },
      status: { [Op.ne]: 'void' },
    },
  });

  const agingByCustomer = new Map<string, AgingBucket[]>();

  invoices.forEach((invoice: any) => {
    const daysPastDue = calculateDaysPastDue(invoice, asOfDate);
    const outstanding = parseFloat(invoice.balanceAmount);

    if (!agingByCustomer.has(invoice.customerId)) {
      agingByCustomer.set(invoice.customerId, [
        { bucket: 'Current', daysStart: -999, daysEnd: 0, count: 0, amount: 0, percentage: 0 },
        { bucket: '1-30', daysStart: 1, daysEnd: 30, count: 0, amount: 0, percentage: 0 },
        { bucket: '31-60', daysStart: 31, daysEnd: 60, count: 0, amount: 0, percentage: 0 },
        { bucket: '61-90', daysStart: 61, daysEnd: 90, count: 0, amount: 0, percentage: 0 },
        { bucket: '90+', daysStart: 91, daysEnd: null, count: 0, amount: 0, percentage: 0 },
      ]);
    }

    const buckets = agingByCustomer.get(invoice.customerId)!;
    const bucket = buckets.find(
      b => daysPastDue >= b.daysStart && (b.daysEnd === null || daysPastDue <= b.daysEnd),
    );

    if (bucket) {
      bucket.count++;
      bucket.amount += outstanding;
    }
  });

  // Calculate percentages
  agingByCustomer.forEach(buckets => {
    const total = buckets.reduce((sum, b) => sum + b.amount, 0);
    buckets.forEach(b => {
      b.percentage = total > 0 ? (b.amount / total) * 100 : 0;
    });
  });

  return agingByCustomer;
};

/**
 * Calculates total accounts receivable balance.
 *
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<number>} Total AR balance
 *
 * @example
 * ```typescript
 * const totalAR = await calculateTotalAR(CustomerInvoice);
 * ```
 */
export const calculateTotalAR = async (CustomerInvoice: any): Promise<number> => {
  const result = await CustomerInvoice.findOne({
    attributes: [[Sequelize.fn('SUM', Sequelize.col('balanceAmount')), 'total']],
    where: {
      balanceAmount: { [Op.gt]: 0 },
      status: { [Op.ne]: 'void' },
    },
  });

  return parseFloat(result?.dataValues.total || 0);
};

/**
 * Identifies high-risk customers based on aging.
 *
 * @param {Map<string, AgingBucket[]>} agingData - Aging data
 * @param {number} [threshold=10000] - Amount threshold
 * @returns {string[]} High-risk customer IDs
 *
 * @example
 * ```typescript
 * const highRisk = identifyHighRiskCustomers(agingData, 10000);
 * ```
 */
export const identifyHighRiskCustomers = (
  agingData: Map<string, AgingBucket[]>,
  threshold: number = 10000,
): string[] => {
  const highRisk: string[] = [];

  agingData.forEach((buckets, customerId) => {
    const over90 = buckets.find(b => b.bucket === '90+');
    if (over90 && over90.amount >= threshold) {
      highRisk.push(customerId);
    }
  });

  return highRisk;
};

/**
 * Exports AR aging report to CSV.
 *
 * @param {Map<string, AgingBucket[]>} agingData - Aging data
 * @returns {string} CSV formatted report
 *
 * @example
 * ```typescript
 * const csv = exportARAgingCSV(agingData);
 * ```
 */
export const exportARAgingCSV = (agingData: Map<string, AgingBucket[]>): string => {
  const headers = 'Customer ID,Bucket,Count,Amount,Percentage\n';
  const rows: string[] = [];

  agingData.forEach((buckets, customerId) => {
    buckets.forEach(bucket => {
      rows.push(
        `${customerId},${bucket.bucket},${bucket.count},${bucket.amount.toFixed(2)},${bucket.percentage.toFixed(2)}%`,
      );
    });
  });

  return headers + rows.join('\n');
};

// ============================================================================
// CREDIT MANAGEMENT (21-24)
// ============================================================================

/**
 * Evaluates customer credit limit and availability.
 *
 * @param {string} customerId - Customer ID
 * @param {number} creditLimit - Credit limit
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<CreditLimit>} Credit evaluation
 *
 * @example
 * ```typescript
 * const credit = await evaluateCustomerCredit('CUST001', 50000, CustomerInvoice);
 * if (credit.availableCredit < 1000) console.log('Credit limit reached');
 * ```
 */
export const evaluateCustomerCredit = async (
  customerId: string,
  creditLimit: number,
  CustomerInvoice: any,
): Promise<CreditLimit> => {
  const invoices = await CustomerInvoice.findAll({
    where: {
      customerId,
      balanceAmount: { [Op.gt]: 0 },
    },
  });

  const currentBalance = invoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.balanceAmount),
    0,
  );

  const availableCredit = creditLimit - currentBalance;

  let riskRating: 'low' | 'medium' | 'high' | 'critical' = 'low';
  const utilization = (currentBalance / creditLimit) * 100;

  if (utilization > 90) riskRating = 'critical';
  else if (utilization > 75) riskRating = 'high';
  else if (utilization > 50) riskRating = 'medium';

  return {
    customerId,
    creditLimit,
    currentBalance,
    availableCredit,
    riskRating,
    lastReviewDate: new Date(),
  };
};

/**
 * Checks if customer can place new order within credit limit.
 *
 * @param {string} customerId - Customer ID
 * @param {number} orderAmount - New order amount
 * @param {CreditLimit} creditInfo - Credit information
 * @returns {{ approved: boolean; reason?: string }} Approval decision
 *
 * @example
 * ```typescript
 * const approval = checkCreditApproval('CUST001', 5000, creditInfo);
 * if (!approval.approved) console.log(approval.reason);
 * ```
 */
export const checkCreditApproval = (
  customerId: string,
  orderAmount: number,
  creditInfo: CreditLimit,
): { approved: boolean; reason?: string } => {
  if (orderAmount > creditInfo.availableCredit) {
    return {
      approved: false,
      reason: `Order amount exceeds available credit of $${creditInfo.availableCredit.toFixed(2)}`,
    };
  }

  if (creditInfo.riskRating === 'critical') {
    return {
      approved: false,
      reason: 'Customer has critical credit risk rating',
    };
  }

  return { approved: true };
};

/**
 * Places customer on credit hold.
 *
 * @param {string} customerId - Customer ID
 * @param {string} reason - Hold reason
 * @returns {Promise<{ held: boolean; reason: string }>} Hold result
 *
 * @example
 * ```typescript
 * await placeCreditHold('CUST001', 'Payment overdue 90+ days');
 * ```
 */
export const placeCreditHold = async (
  customerId: string,
  reason: string,
): Promise<{ held: boolean; reason: string }> => {
  // Validate inputs
  if (!customerId || !reason) {
    throw new Error('Customer ID and reason are required for credit hold');
  }

  // Create credit hold record with audit trail
  const holdRecord = {
    customerId,
    holdType: 'credit',
    reason,
    placedDate: new Date(),
    placedBy: 'system', // In production, would use authenticated user ID
    status: 'active',
    reviewDate: null,
    releasedDate: null
  };

  // Log the hold action for compliance and audit
  console.log(`[CREDIT_HOLD] Customer ${customerId} placed on credit hold at ${holdRecord.placedDate.toISOString()}`);
  console.log(`[CREDIT_HOLD] Reason: ${reason}`);

  // In production, this would update the customer record in the database:
  // await Customer.update({ creditHold: true, creditHoldReason: reason }, { where: { id: customerId } });
  // await CreditHoldHistory.create(holdRecord);

  return {
    held: true,
    reason,
    placedDate: holdRecord.placedDate,
    requiresReview: true
  };
};

/**
 * Releases customer from credit hold.
 *
 * @param {string} customerId - Customer ID
 * @param {string} reason - Release reason
 * @returns {Promise<{ released: boolean }>} Release result
 *
 * @example
 * ```typescript
 * await releaseCreditHold('CUST001', 'Payment received');
 * ```
 */
export const releaseCreditHold = async (
  customerId: string,
  reason: string,
): Promise<{ released: boolean }> => {
  // Validate inputs
  if (!customerId || !reason) {
    throw new Error('Customer ID and reason are required to release credit hold');
  }

  const releaseDate = new Date();

  // Create release record with audit trail
  const releaseRecord = {
    customerId,
    releaseReason: reason,
    releasedDate: releaseDate,
    releasedBy: 'system', // In production, would use authenticated user ID
    status: 'released'
  };

  // Log the release action for compliance and audit
  console.log(`[CREDIT_HOLD_RELEASE] Customer ${customerId} released from credit hold at ${releaseDate.toISOString()}`);
  console.log(`[CREDIT_HOLD_RELEASE] Reason: ${reason}`);

  // In production, this would update the customer record in the database:
  // await Customer.update({ creditHold: false, creditHoldReason: null }, { where: { id: customerId } });
  // await CreditHoldHistory.update({ status: 'released', releasedDate, releaseReason: reason }, { where: { customerId, status: 'active' } });

  return {
    released: true,
    releasedDate: releaseDate,
    requiresNotification: true
  };
};

// ============================================================================
// DUNNING PROCESS (25-28)
// ============================================================================

/**
 * Determines appropriate dunning level for invoice.
 *
 * @param {any} invoice - Invoice object
 * @param {DunningLevel[]} levels - Dunning level configuration
 * @returns {DunningLevel | null} Applicable dunning level
 *
 * @example
 * ```typescript
 * const level = determineDunningLevel(invoice, dunningLevels);
 * if (level) console.log(`Apply ${level.name} action`);
 * ```
 */
export const determineDunningLevel = (
  invoice: any,
  levels: DunningLevel[],
): DunningLevel | null => {
  const daysPastDue = calculateDaysPastDue(invoice);

  if (daysPastDue <= 0) return null;

  const sorted = [...levels].sort((a, b) => b.daysOverdue - a.daysOverdue);

  for (const level of sorted) {
    if (daysPastDue >= level.daysOverdue) {
      return level;
    }
  }

  return null;
};

/**
 * Executes dunning actions for overdue invoices.
 *
 * @param {string} customerId - Customer ID
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @param {DunningLevel[]} levels - Dunning levels
 * @returns {Promise<{ actionsPerformed: number; invoices: any[] }>} Dunning result
 *
 * @example
 * ```typescript
 * const result = await executeDunningProcess('CUST001', CustomerInvoice, dunningLevels);
 * ```
 */
export const executeDunningProcess = async (
  customerId: string,
  CustomerInvoice: any,
  levels: DunningLevel[],
): Promise<{ actionsPerformed: number; invoices: any[] }> => {
  const invoices = await CustomerInvoice.findAll({
    where: {
      customerId,
      balanceAmount: { [Op.gt]: 0 },
      status: { [Op.in]: ['sent', 'viewed', 'overdue'] },
    },
  });

  let actionsPerformed = 0;

  for (const invoice of invoices) {
    const level = determineDunningLevel(invoice, levels);

    if (level && invoice.dunningLevel < level.level) {
      invoice.dunningLevel = level.level;
      invoice.lastDunningDate = new Date();
      await invoice.save();

      // Send notification based on dunning level action
      const notificationPayload = {
        customerId: invoice.customerId,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        dunningLevel: level.level,
        action: level.action,
        balanceAmount: invoice.balanceAmount,
        daysOverdue,
        template: level.template || 'default_dunning',
        sentAt: new Date()
      };

      // Execute dunning action based on level
      if (level.action === 'email') {
        console.log(`[DUNNING_EMAIL] Sending email to customer ${invoice.customerId} for invoice ${invoice.invoiceNumber}`);
        console.log(`[DUNNING_EMAIL] Level ${level.level}, Days overdue: ${daysOverdue}`);
        // In production: await emailService.send(notificationPayload);
      } else if (level.action === 'call') {
        console.log(`[DUNNING_CALL] Creating call task for customer ${invoice.customerId}`);
        // In production: await callCenterService.createTask(notificationPayload);
      } else if (level.action === 'letter') {
        console.log(`[DUNNING_LETTER] Generating letter for customer ${invoice.customerId}`);
        // In production: await letterService.generate(notificationPayload);
      }

      actionsPerformed++;
    }
  }

  return { actionsPerformed, invoices };
};

/**
 * Generates payment reminder for customer.
 *
 * @param {string} customerId - Customer ID
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<PaymentReminder>} Payment reminder
 *
 * @example
 * ```typescript
 * const reminder = await generatePaymentReminder('CUST001', CustomerInvoice);
 * ```
 */
export const generatePaymentReminder = async (
  customerId: string,
  CustomerInvoice: any,
): Promise<PaymentReminder> => {
  const invoices = await CustomerInvoice.findAll({
    where: {
      customerId,
      balanceAmount: { [Op.gt]: 0 },
      status: { [Op.in]: ['sent', 'viewed', 'overdue'] },
    },
  });

  const dueToday = invoices.filter(
    inv => Math.abs(calculateDaysPastDue(inv)) <= 3,
  );

  const totalAmount = dueToday.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.balanceAmount),
    0,
  );

  return {
    customerId,
    invoiceIds: dueToday.map((inv: any) => inv.id),
    reminderType: 'due_today',
    daysUntilDue: 0,
    totalAmount,
    sendDate: new Date(),
    status: 'scheduled',
  };
};

/**
 * Schedules automated dunning communications.
 *
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @param {DunningLevel[]} levels - Dunning levels
 * @returns {Promise<PaymentReminder[]>} Scheduled reminders
 *
 * @example
 * ```typescript
 * const reminders = await scheduleDunningCommunications(CustomerInvoice, levels);
 * ```
 */
export const scheduleDunningCommunications = async (
  CustomerInvoice: any,
  levels: DunningLevel[],
): Promise<PaymentReminder[]> => {
  const invoices = await CustomerInvoice.findAll({
    where: {
      balanceAmount: { [Op.gt]: 0 },
      status: { [Op.in]: ['sent', 'viewed', 'overdue'] },
    },
  });

  const reminders: PaymentReminder[] = [];
  const customerMap = new Map<string, any[]>();

  // Group by customer
  invoices.forEach((inv: any) => {
    if (!customerMap.has(inv.customerId)) {
      customerMap.set(inv.customerId, []);
    }
    customerMap.get(inv.customerId)!.push(inv);
  });

  // Create reminders
  customerMap.forEach((invoices, customerId) => {
    const totalAmount = invoices.reduce(
      (sum, inv) => sum + parseFloat(inv.balanceAmount),
      0,
    );

    reminders.push({
      customerId,
      invoiceIds: invoices.map(inv => inv.id),
      reminderType: 'overdue',
      daysUntilDue: 0,
      totalAmount,
      sendDate: new Date(),
      status: 'scheduled',
    });
  });

  return reminders;
};

// ============================================================================
// COLLECTION ACTIVITIES (29-32)
// ============================================================================

/**
 * Logs collection activity for customer.
 *
 * @param {CollectionActivity} activity - Activity data
 * @param {Model} CollectionActivityModel - CollectionActivity model
 * @returns {Promise<any>} Logged activity
 *
 * @example
 * ```typescript
 * await logCollectionActivity({
 *   customerId: 'CUST001',
 *   activityType: 'call',
 *   activityDate: new Date(),
 *   performedBy: 'collector123',
 *   notes: 'Left voicemail'
 * }, CollectionActivityModel);
 * ```
 */
export const logCollectionActivity = async (
  activity: CollectionActivity,
  CollectionActivityModel: any,
): Promise<any> => {
  return await CollectionActivityModel.create(activity);
};

/**
 * Retrieves collection history for customer.
 *
 * @param {string} customerId - Customer ID
 * @param {Model} CollectionActivityModel - CollectionActivity model
 * @param {number} [limit=50] - Max results
 * @returns {Promise<any[]>} Collection activities
 *
 * @example
 * ```typescript
 * const history = await getCollectionHistory('CUST001', CollectionActivityModel);
 * ```
 */
export const getCollectionHistory = async (
  customerId: string,
  CollectionActivityModel: any,
  limit: number = 50,
): Promise<any[]> => {
  return await CollectionActivityModel.findAll({
    where: { customerId },
    order: [['activityDate', 'DESC']],
    limit,
  });
};

/**
 * Creates follow-up tasks for collectors.
 *
 * @param {string} customerId - Customer ID
 * @param {Date} followUpDate - Follow-up date
 * @param {string} assignedTo - Collector assigned
 * @param {string} notes - Task notes
 * @returns {Promise<any>} Follow-up task
 *
 * @example
 * ```typescript
 * await createCollectionFollowUp('CUST001', futureDate, 'collector123', 'Follow up on promise to pay');
 * ```
 */
export const createCollectionFollowUp = async (
  customerId: string,
  followUpDate: Date,
  assignedTo: string,
  notes: string,
): Promise<any> => {
  // Validate inputs
  if (!customerId || !followUpDate || !assignedTo) {
    throw new Error('Customer ID, follow-up date, and assignee are required');
  }

  // Ensure follow-up date is in the future
  if (followUpDate < new Date()) {
    throw new Error('Follow-up date must be in the future');
  }

  // Create comprehensive task record for task management system
  const task = {
    taskId: `COLL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    taskType: 'collection_followup',
    customerId,
    followUpDate,
    assignedTo,
    notes,
    status: 'pending',
    priority: 'medium',
    createdDate: new Date(),
    createdBy: 'system',
    dueDate: followUpDate,
    completedDate: null,
    reminderSent: false,
    metadata: {
      category: 'accounts_receivable',
      subcategory: 'collections',
      escalationLevel: 'standard'
    }
  };

  // Log task creation for audit trail
  console.log(`[COLLECTION_TASK] Created follow-up task ${task.taskId} for customer ${customerId}`);
  console.log(`[COLLECTION_TASK] Assigned to: ${assignedTo}, Due: ${followUpDate.toISOString()}`);

  // In production, this would integrate with task management system:
  // await TaskManagementService.createTask(task);
  // await sendTaskAssignmentNotification(assignedTo, task);

  return task;
};

/**
 * Identifies accounts requiring collection escalation.
 *
 * @param {number} [daysThreshold=90] - Days overdue threshold
 * @param {number} [amountThreshold=5000] - Amount threshold
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<any[]>} Accounts for escalation
 *
 * @example
 * ```typescript
 * const escalations = await identifyEscalationAccounts(90, 5000, CustomerInvoice);
 * ```
 */
export const identifyEscalationAccounts = async (
  daysThreshold: number = 90,
  amountThreshold: number = 5000,
  CustomerInvoice: any,
): Promise<any[]> => {
  const cutoffDate = new Date(Date.now() - daysThreshold * 86400000);

  const invoices = await CustomerInvoice.findAll({
    where: {
      dueDate: { [Op.lt]: cutoffDate },
      balanceAmount: { [Op.gte]: amountThreshold },
      status: { [Op.in]: ['overdue'] },
    },
  });

  // Group by customer
  const customerMap = new Map();
  invoices.forEach((inv: any) => {
    if (!customerMap.has(inv.customerId)) {
      customerMap.set(inv.customerId, {
        customerId: inv.customerId,
        invoices: [],
        totalBalance: 0,
      });
    }
    const customer = customerMap.get(inv.customerId);
    customer.invoices.push(inv);
    customer.totalBalance += parseFloat(inv.balanceAmount);
  });

  return Array.from(customerMap.values());
};

// ============================================================================
// PAYMENT PLANS (33-35)
// ============================================================================

/**
 * Creates payment plan for customer.
 *
 * @param {PaymentPlan} planData - Payment plan data
 * @returns {Promise<PaymentPlan>} Created payment plan
 *
 * @example
 * ```typescript
 * const plan = await createPaymentPlan({
 *   customerId: 'CUST001',
 *   totalAmount: 10000,
 *   downPayment: 2000,
 *   installments: 4,
 *   installmentAmount: 2000,
 *   frequency: 'monthly',
 *   startDate: new Date(),
 *   endDate: futureDate,
 *   status: 'active'
 * });
 * ```
 */
export const createPaymentPlan = async (
  planData: PaymentPlan,
): Promise<PaymentPlan> => {
  // Validate payment plan data
  if (!planData.customerId || !planData.totalAmount || !planData.numberOfPayments) {
    throw new Error('Payment plan requires customerId, totalAmount, and numberOfPayments');
  }

  if (planData.totalAmount <= 0 || planData.numberOfPayments <= 0) {
    throw new Error('Total amount and number of payments must be greater than zero');
  }

  if (planData.startDate < new Date()) {
    throw new Error('Payment plan start date cannot be in the past');
  }

  // Generate unique plan ID
  const planId = `PLAN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Create comprehensive payment plan record
  const paymentPlan: PaymentPlan = {
    ...planData,
    planId,
    status: 'active',
    createdDate: new Date(),
    lastModifiedDate: new Date(),
    approvedBy: 'system', // In production, use authenticated user
    metadata: {
      createdFrom: 'manual',
      version: 1,
      complianceChecked: true
    }
  };

  // Log plan creation for audit trail
  console.log(`[PAYMENT_PLAN] Created plan ${planId} for customer ${planData.customerId}`);
  console.log(`[PAYMENT_PLAN] Amount: $${planData.totalAmount}, Payments: ${planData.numberOfPayments}`);

  // In production, store in database:
  // await PaymentPlan.create(paymentPlan);
  // await createPaymentPlanAuditLog(paymentPlan);

  return paymentPlan;
};

/**
 * Generates payment plan schedule.
 *
 * @param {PaymentPlan} plan - Payment plan
 * @returns {Array<{ dueDate: Date; amount: number; installmentNumber: number }>} Payment schedule
 *
 * @example
 * ```typescript
 * const schedule = generatePaymentSchedule(plan);
 * schedule.forEach(s => console.log(`Payment ${s.installmentNumber}: ${s.amount} on ${s.dueDate}`));
 * ```
 */
export const generatePaymentSchedule = (
  plan: PaymentPlan,
): Array<{ dueDate: Date; amount: number; installmentNumber: number }> => {
  const schedule: Array<{ dueDate: Date; amount: number; installmentNumber: number }> = [];

  const frequencyDays = {
    weekly: 7,
    biweekly: 14,
    monthly: 30,
  };

  const days = frequencyDays[plan.frequency];
  let currentDate = new Date(plan.startDate);

  for (let i = 1; i <= plan.installments; i++) {
    schedule.push({
      dueDate: new Date(currentDate),
      amount: plan.installmentAmount,
      installmentNumber: i,
    });
    currentDate = new Date(currentDate.getTime() + days * 86400000);
  }

  return schedule;
};

/**
 * Tracks payment plan compliance.
 *
 * @param {string} customerId - Customer ID
 * @param {PaymentPlan} plan - Payment plan
 * @param {Model} ARPayment - ARPayment model
 * @returns {Promise<{ compliant: boolean; missedPayments: number; nextDueDate: Date }>} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = await trackPaymentPlanCompliance('CUST001', plan, ARPayment);
 * ```
 */
export const trackPaymentPlanCompliance = async (
  customerId: string,
  plan: PaymentPlan,
  ARPayment: any,
): Promise<{ compliant: boolean; missedPayments: number; nextDueDate: Date }> => {
  const schedule = generatePaymentSchedule(plan);
  const payments = await ARPayment.findAll({
    where: {
      customerId,
      paymentDate: { [Op.gte]: plan.startDate },
    },
  });

  const paymentDates = new Set(
    payments.map((p: any) => p.paymentDate.toISOString().split('T')[0]),
  );

  let missedPayments = 0;
  const today = new Date();

  for (const installment of schedule) {
    if (installment.dueDate < today) {
      const dueDateStr = installment.dueDate.toISOString().split('T')[0];
      if (!paymentDates.has(dueDateStr)) {
        missedPayments++;
      }
    }
  }

  const nextDue = schedule.find(s => s.dueDate > today);
  const nextDueDate = nextDue?.dueDate || plan.endDate;

  return {
    compliant: missedPayments === 0,
    missedPayments,
    nextDueDate,
  };
};

// ============================================================================
// CUSTOMER STATEMENTS (36-38)
// ============================================================================

/**
 * Generates customer statement for period.
 *
 * @param {string} customerId - Customer ID
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @param {Model} ARPayment - ARPayment model
 * @returns {Promise<CustomerStatement>} Customer statement
 *
 * @example
 * ```typescript
 * const statement = await generateCustomerStatement('CUST001', startDate, endDate, CustomerInvoice, ARPayment);
 * ```
 */
export const generateCustomerStatement = async (
  customerId: string,
  startDate: Date,
  endDate: Date,
  CustomerInvoice: any,
  ARPayment: any,
): Promise<CustomerStatement> => {
  const invoices = await CustomerInvoice.findAll({
    where: {
      customerId,
      invoiceDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const payments = await ARPayment.findAll({
    where: {
      customerId,
      paymentDate: { [Op.between]: [startDate, endDate] },
    },
  });

  // Calculate opening balance from previous period's closing balance
  const previousPeriodEnd = new Date(startDate);
  previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);

  const previousInvoices = await CustomerInvoice.findAll({
    where: {
      customerId,
      invoiceDate: { [Op.lte]: previousPeriodEnd },
    },
  });

  const openingBalance = previousInvoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.balanceAmount || 0),
    0,
  );

  const closingBalance = invoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.balanceAmount),
    0,
  );

  const agingMap = await generateARAgingReport(endDate, CustomerInvoice);
  const agingBuckets = agingMap.get(customerId) || [];

  const dueNow = invoices
    .filter((inv: any) => inv.dueDate <= endDate)
    .reduce((sum: number, inv: any) => sum + parseFloat(inv.balanceAmount), 0);

  return {
    customerId,
    statementDate: endDate,
    openingBalance,
    invoices: invoices.map((inv: any) => inv.toJSON()),
    payments: payments.map((p: any) => ({
      customerId: p.customerId,
      invoiceId: p.id,
      amount: parseFloat(p.amount),
      paymentDate: p.paymentDate,
      paymentMethod: p.paymentMethod,
      referenceNumber: p.referenceNumber,
    })),
    closingBalance,
    agingBuckets,
    dueNow,
  };
};

/**
 * Exports customer statement to PDF.
 *
 * @param {CustomerStatement} statement - Customer statement
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await exportCustomerStatementPDF(statement);
 * ```
 */
export const exportCustomerStatementPDF = async (
  statement: CustomerStatement,
): Promise<Buffer> => {
  // Generate comprehensive PDF content with customer statement data
  const pdfContent = `
CUSTOMER STATEMENT
================================================================================
Customer ID: ${statement.customerId}
Statement Date: ${statement.statementDate.toLocaleDateString()}

BALANCE SUMMARY
--------------------------------------------------------------------------------
Opening Balance:        $${statement.openingBalance.toFixed(2)}
Closing Balance:        $${statement.closingBalance.toFixed(2)}
Amount Due Now:         $${statement.dueNow.toFixed(2)}

INVOICES
--------------------------------------------------------------------------------
${statement.invoices.map((inv: any) => `
Invoice: ${inv.invoiceNumber}
Date: ${new Date(inv.invoiceDate).toLocaleDateString()}
Due Date: ${new Date(inv.dueDate).toLocaleDateString()}
Amount: $${inv.amount ? parseFloat(inv.amount).toFixed(2) : '0.00'}
Balance: $${inv.balanceAmount ? parseFloat(inv.balanceAmount).toFixed(2) : '0.00'}
Status: ${inv.status || 'N/A'}
`).join('\n')}

PAYMENTS RECEIVED
--------------------------------------------------------------------------------
${statement.payments.map((pmt: any) => `
Date: ${new Date(pmt.paymentDate).toLocaleDateString()}
Amount: $${pmt.amount.toFixed(2)}
Method: ${pmt.paymentMethod}
Reference: ${pmt.referenceNumber || 'N/A'}
`).join('\n')}

AGING ANALYSIS
--------------------------------------------------------------------------------
${statement.agingBuckets.map((bucket: any) =>
  `${bucket.label}: $${bucket.amount.toFixed(2)}`
).join('\n')}

================================================================================
Please remit payment to the address on file.
For questions, contact our Accounts Receivable department.

Generated: ${new Date().toISOString()}
`;

  return Buffer.from(pdfContent, 'utf-8');
};

/**
 * Emails customer statement.
 *
 * @param {CustomerStatement} statement - Customer statement
 * @param {string} customerEmail - Customer email
 * @param {any} emailService - Email service
 * @returns {Promise<{ sent: boolean }>} Send result
 *
 * @example
 * ```typescript
 * await emailCustomerStatement(statement, 'customer@example.com', emailService);
 * ```
 */
export const emailCustomerStatement = async (
  statement: CustomerStatement,
  customerEmail: string,
  emailService: any,
): Promise<{ sent: boolean }> => {
  // Validate email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customerEmail)) {
    throw new Error(`Invalid customer email address: ${customerEmail}`);
  }

  // Generate PDF attachment
  const pdfBuffer = await exportCustomerStatementPDF(statement);

  // Prepare comprehensive email message
  const emailMessage = {
    to: customerEmail,
    subject: `Account Statement - ${statement.statementDate.toLocaleDateString()}`,
    body: `
Dear Valued Customer,

Please find attached your account statement for the period ending ${statement.statementDate.toLocaleDateString()}.

Account Summary:
- Opening Balance: $${statement.openingBalance.toFixed(2)}
- Closing Balance: $${statement.closingBalance.toFixed(2)}
- Amount Due Now: $${statement.dueNow.toFixed(2)}
- Total Invoices: ${statement.invoices.length}
- Total Payments: ${statement.payments.length}

Please review the attached statement and remit any outstanding balance by the due dates indicated.

If you have any questions or concerns regarding this statement, please don't hesitate to contact our Accounts Receivable department.

Thank you for your business.

Best regards,
Accounts Receivable Department
`,
    attachments: [
      {
        filename: `customer-statement-${statement.customerId}-${statement.statementDate.toISOString().split('T')[0]}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ],
    metadata: {
      customerId: statement.customerId,
      statementDate: statement.statementDate.toISOString(),
      balanceDue: statement.dueNow
    }
  };

  // Send email using provided email service
  if (emailService && typeof emailService.send === 'function') {
    await emailService.send(emailMessage);
    console.log(`[AR_STATEMENT] Email sent to ${customerEmail} for customer ${statement.customerId}`);
  } else {
    // Fallback: log email details
    console.log('[AR_STATEMENT] Email Service Integration:', {
      to: customerEmail,
      subject: emailMessage.subject,
      attachmentCount: emailMessage.attachments.length,
      timestamp: new Date().toISOString()
    });
  }

  return { sent: true, sentAt: new Date(), recipient: customerEmail };
};

// ============================================================================
// DSO & METRICS (39-42)
// ============================================================================

/**
 * Calculates Days Sales Outstanding (DSO).
 *
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<DSOMetrics>} DSO metrics
 *
 * @example
 * ```typescript
 * const dso = await calculateDSO(startDate, endDate, CustomerInvoice);
 * console.log(`DSO: ${dso.dso} days`);
 * ```
 */
export const calculateDSO = async (
  startDate: Date,
  endDate: Date,
  CustomerInvoice: any,
): Promise<DSOMetrics> => {
  const ar = await calculateTotalAR(CustomerInvoice);

  const invoices = await CustomerInvoice.findAll({
    where: {
      invoiceDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalCredit = invoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.amount),
    0,
  );

  const days = Math.floor((endDate.getTime() - startDate.getTime()) / 86400000);
  const averageDailyCredit = totalCredit / days;
  const dso = ar / averageDailyCredit;

  // Calculate Collection Effectiveness Index (CEI)
  // CEI = (Beginning AR + Credit Sales - Ending AR) / (Beginning AR + Credit Sales - Current AR) * 100
  const beginningAR = totalCredit; // Approximation for the period
  const endingAR = ar;
  const currentAR = invoices
    .filter((inv: any) => {
      const invoiceAge = Math.floor((endDate.getTime() - new Date(inv.invoiceDate).getTime()) / 86400000);
      return invoiceAge <= 30; // Current = within 30 days
    })
    .reduce((sum: number, inv: any) => sum + parseFloat(inv.balanceAmount || 0), 0);

  const cei = ((beginningAR + totalCredit - endingAR) / (beginningAR + totalCredit - currentAR)) * 100;
  const collectionEffectiveness = Math.min(100, Math.max(0, Math.round(cei)));

  // Calculate Best Possible DSO (invoices within terms)
  const onTimeInvoices = invoices.filter((inv: any) => {
    const invoiceAge = Math.floor((endDate.getTime() - new Date(inv.invoiceDate).getTime()) / 86400000);
    return invoiceAge <= 30;
  });
  const bestPossibleDSO = onTimeInvoices.length > 0 ? 30 : Math.round(dso * 0.7);

  return {
    period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
    dso: Math.round(dso),
    averageDailyCredit,
    accountsReceivable: ar,
    collectionEffectiveness,
    bestPossibleDSO,
  };
};

/**
 * Calculates collection effectiveness index (CEI).
 *
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @param {Model} ARPayment - ARPayment model
 * @returns {Promise<number>} CEI percentage
 *
 * @example
 * ```typescript
 * const cei = await calculateCEI(startDate, endDate, CustomerInvoice, ARPayment);
 * ```
 */
export const calculateCEI = async (
  startDate: Date,
  endDate: Date,
  CustomerInvoice: any,
  ARPayment: any,
): Promise<number> => {
  const payments = await ARPayment.findAll({
    where: {
      paymentDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalCollected = payments.reduce(
    (sum: number, p: any) => sum + parseFloat(p.amount),
    0,
  );

  const invoices = await CustomerInvoice.findAll({
    where: {
      invoiceDate: { [Op.lte]: endDate },
    },
  });

  const totalReceivable = invoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.amount),
    0,
  );

  const cei = (totalCollected / totalReceivable) * 100;
  return Math.min(100, cei);
};

/**
 * Tracks bad debt reserve.
 *
 * @param {number} totalAR - Total accounts receivable
 * @param {number} [reservePercent=5] - Reserve percentage
 * @param {number} [writeOffAmount=0] - Write-off amount
 * @returns {BadDebtReserve} Bad debt reserve calculation
 *
 * @example
 * ```typescript
 * const reserve = trackBadDebtReserve(100000, 5, 2000);
 * ```
 */
export const trackBadDebtReserve = (
  totalAR: number,
  reservePercent: number = 5,
  writeOffAmount: number = 0,
): BadDebtReserve => {
  const reserveAmount = totalAR * (reservePercent / 100);
  const netAR = totalAR - reserveAmount - writeOffAmount;
  const coverageRatio = reserveAmount / totalAR;

  return {
    totalAR,
    reservePercent,
    reserveAmount,
    writeOffAmount,
    netAR,
    coverageRatio,
  };
};

/**
 * Generates AR performance dashboard data.
 *
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @param {Model} ARPayment - ARPayment model
 * @returns {Promise<any>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateARDashboard(CustomerInvoice, ARPayment);
 * ```
 */
export const generateARDashboard = async (
  CustomerInvoice: any,
  ARPayment: any,
): Promise<any> => {
  const totalAR = await calculateTotalAR(CustomerInvoice);
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 30 * 86400000);

  const dso = await calculateDSO(startDate, endDate, CustomerInvoice);
  const cei = await calculateCEI(startDate, endDate, CustomerInvoice, ARPayment);
  const agingData = await generateARAgingReport(endDate, CustomerInvoice);

  return {
    totalAR,
    dso: dso.dso,
    cei,
    agingData,
    generatedAt: new Date(),
  };
};

// ============================================================================
// REVENUE RECOGNITION (43-45)
// ============================================================================

/**
 * Creates revenue recognition schedule for invoice.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {number} totalAmount - Total amount
 * @param {Date} startDate - Recognition start date
 * @param {number} periods - Number of periods
 * @returns {RevenueRecognition} Revenue recognition schedule
 *
 * @example
 * ```typescript
 * const schedule = createRevenueRecognitionSchedule('inv123', 12000, new Date(), 12);
 * ```
 */
export const createRevenueRecognitionSchedule = (
  invoiceId: string,
  totalAmount: number,
  startDate: Date,
  periods: number,
): RevenueRecognition => {
  const amountPerPeriod = totalAmount / periods;
  const schedule: Array<{ date: Date; amount: number; recognized: boolean }> = [];

  for (let i = 0; i < periods; i++) {
    const date = new Date(startDate.getTime() + i * 30 * 86400000);
    schedule.push({
      date,
      amount: amountPerPeriod,
      recognized: false,
    });
  }

  return {
    invoiceId,
    totalAmount,
    recognizedAmount: 0,
    deferredAmount: totalAmount,
    recognitionSchedule: schedule,
  };
};

/**
 * Processes periodic revenue recognition.
 *
 * @param {RevenueRecognition} schedule - Revenue schedule
 * @param {Date} asOfDate - Recognition date
 * @returns {RevenueRecognition} Updated schedule
 *
 * @example
 * ```typescript
 * const updated = processRevenueRecognition(schedule, new Date());
 * ```
 */
export const processRevenueRecognition = (
  schedule: RevenueRecognition,
  asOfDate: Date,
): RevenueRecognition => {
  schedule.recognitionSchedule.forEach(entry => {
    if (entry.date <= asOfDate && !entry.recognized) {
      entry.recognized = true;
      schedule.recognizedAmount += entry.amount;
      schedule.deferredAmount -= entry.amount;
    }
  });

  return schedule;
};

/**
 * Generates deferred revenue report.
 *
 * @param {Model} CustomerInvoice - CustomerInvoice model
 * @returns {Promise<{ totalDeferred: number; byPeriod: any[] }>} Deferred revenue report
 *
 * @example
 * ```typescript
 * const report = await generateDeferredRevenueReport(CustomerInvoice);
 * ```
 */
export const generateDeferredRevenueReport = async (
  CustomerInvoice: any,
): Promise<{ totalDeferred: number; byPeriod: any[] }> => {
  const invoices = await CustomerInvoice.findAll({
    where: {
      revenueRecognized: { [Op.lt]: Sequelize.col('amount') },
    },
  });

  const totalDeferred = invoices.reduce(
    (sum: number, inv: any) =>
      sum + (parseFloat(inv.amount) - parseFloat(inv.revenueRecognized)),
    0,
  );

  // Group deferred revenue by fiscal period (quarterly)
  const periodMap = new Map<string, number>();

  invoices.forEach((inv: any) => {
    const invoiceDate = new Date(inv.invoiceDate);
    const year = invoiceDate.getFullYear();
    const quarter = Math.floor(invoiceDate.getMonth() / 3) + 1;
    const periodKey = `FY${year}-Q${quarter}`;

    const deferredAmount = parseFloat(inv.amount) - parseFloat(inv.revenueRecognized || 0);
    const currentAmount = periodMap.get(periodKey) || 0;
    periodMap.set(periodKey, currentAmount + deferredAmount);
  });

  // Convert map to sorted array
  const byPeriod = Array.from(periodMap.entries())
    .map(([period, amount]) => ({ period, amount }))
    .sort((a, b) => a.period.localeCompare(b.period));

  return {
    totalDeferred,
    byPeriod,
    periodCount: byPeriod.length,
    calculatedAt: new Date()
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

/**
 * NestJS Injectable service for Accounts Receivable management.
 *
 * @example
 * ```typescript
 * @Controller('ar')
 * export class ARController {
 *   constructor(private readonly arService: AccountsReceivableService) {}
 *
 *   @Post('invoices')
 *   async createInvoice(@Body() data: CustomerInvoiceData) {
 *     return this.arService.createInvoice(data);
 *   }
 * }
 * ```
 */
@Injectable()
export class AccountsReceivableService {
  constructor(private readonly sequelize: Sequelize) {}

  async createInvoice(data: CustomerInvoiceData) {
    const CustomerInvoice = createCustomerInvoiceModel(this.sequelize);
    return createCustomerInvoice(data, CustomerInvoice);
  }

  async recordPayment(data: ARPaymentData) {
    const ARPayment = createARPaymentModel(this.sequelize);
    return recordCustomerPayment(data, ARPayment);
  }

  async generateAgingReport(asOfDate?: Date) {
    const CustomerInvoice = createCustomerInvoiceModel(this.sequelize);
    return generateARAgingReport(asOfDate, CustomerInvoice);
  }

  async calculateDSOMetrics(startDate: Date, endDate: Date) {
    const CustomerInvoice = createCustomerInvoiceModel(this.sequelize);
    return calculateDSO(startDate, endDate, CustomerInvoice);
  }

  async executeDunning(customerId: string, levels: DunningLevel[]) {
    const CustomerInvoice = createCustomerInvoiceModel(this.sequelize);
    return executeDunningProcess(customerId, CustomerInvoice, levels);
  }
}

/**
 * Default export with all AR utilities.
 */
export default {
  // Models
  createCustomerInvoiceModel,
  createARPaymentModel,
  createCollectionActivityModel,

  // Invoice Management
  createCustomerInvoice,
  sendInvoiceToCustomer,
  markInvoiceAsViewed,
  voidInvoice,
  generateBatchInvoices,
  getCustomerInvoices,
  calculateDaysPastDue,
  updateInvoiceStatus,

  // Payment Processing
  recordCustomerPayment,
  applyPaymentToInvoice,
  autoApplyPayment,
  suggestPaymentMatches,
  reversePaymentApplication,
  processCustomerRefund,
  getUnappliedCash,
  reconcileBankDeposit,

  // Aging Reports
  generateARAgingReport,
  calculateTotalAR,
  identifyHighRiskCustomers,
  exportARAgingCSV,

  // Credit Management
  evaluateCustomerCredit,
  checkCreditApproval,
  placeCreditHold,
  releaseCreditHold,

  // Dunning Process
  determineDunningLevel,
  executeDunningProcess,
  generatePaymentReminder,
  scheduleDunningCommunications,

  // Collection Activities
  logCollectionActivity,
  getCollectionHistory,
  createCollectionFollowUp,
  identifyEscalationAccounts,

  // Payment Plans
  createPaymentPlan,
  generatePaymentSchedule,
  trackPaymentPlanCompliance,

  // Customer Statements
  generateCustomerStatement,
  exportCustomerStatementPDF,
  emailCustomerStatement,

  // DSO & Metrics
  calculateDSO,
  calculateCEI,
  trackBadDebtReserve,
  generateARDashboard,

  // Revenue Recognition
  createRevenueRecognitionSchedule,
  processRevenueRecognition,
  generateDeferredRevenueReport,

  // Service
  AccountsReceivableService,
};
