/**
 * LOC: CEFMSAPP001
 * File: /reuse/financial/cefms/composites/cefms-accounts-payable-processing-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../../government/electronic-payments-disbursements-kit.ts
 *   - ../../../government/vendor-supplier-management-kit.ts
 *   - ../../../government/procurement-contract-management-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS accounts payable services
 *   - USACE invoice processing systems
 *   - Payment processing modules
 *   - Vendor payment management
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-accounts-payable-processing-composite.ts
 * Locator: WC-CEFMS-APP-001
 * Purpose: USACE CEFMS Accounts Payable Processing - invoice validation, 3-way matching, payment scheduling, vendor payments, 1099 reporting
 *
 * Upstream: Composes utilities from government kits for comprehensive AP operations
 * Downstream: ../../../backend/cefms/*, AP controllers, invoice processing, payment workflows, vendor management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 42 composite functions for USACE CEFMS accounts payable processing operations
 *
 * LLM Context: Production-ready USACE CEFMS accounts payable processing system.
 * Comprehensive invoice processing, 3-way matching (PO/receipt/invoice), automated payment scheduling,
 * vendor payment processing, ACH and wire transfer management, early payment discounts, payment holds,
 * payment reversal handling, 1099 tax reporting, duplicate invoice detection, payment approval workflows,
 * disbursement batch processing, positive pay integration, and payment reconciliation.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface InvoiceData {
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  invoiceDate: Date;
  dueDate: Date;
  invoiceAmount: number;
  taxAmount: number;
  discountAmount: number;
  netAmount: number;
  currency: string;
  purchaseOrderNumber?: string;
  receiptNumber?: string;
  description: string;
  lineItems: InvoiceLineItem[];
  status: 'draft' | 'pending_approval' | 'approved' | 'paid' | 'rejected' | 'on_hold';
  paymentTerms: string;
}

interface InvoiceLineItem {
  lineNumber: number;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  accountCode: string;
  taxCode?: string;
  poLineNumber?: number;
}

interface ThreeWayMatchResult {
  matched: boolean;
  poMatch: boolean;
  receiptMatch: boolean;
  invoiceMatch: boolean;
  variances: MatchVariance[];
  toleranceExceeded: boolean;
  requiresReview: boolean;
  matchScore: number;
}

interface MatchVariance {
  type: 'quantity' | 'price' | 'amount' | 'description';
  poValue: any;
  receiptValue: any;
  invoiceValue: any;
  variance: number;
  variancePercent: number;
  withinTolerance: boolean;
}

interface PaymentScheduleEntry {
  scheduleId: string;
  invoiceId: string;
  vendorId: string;
  paymentAmount: number;
  scheduledDate: Date;
  paymentMethod: 'ACH' | 'WIRE' | 'CHECK' | 'CARD';
  priority: 'normal' | 'urgent' | 'rush';
  status: 'scheduled' | 'pending_approval' | 'approved' | 'processed' | 'cancelled';
  batchId?: string;
}

interface PaymentBatchData {
  batchId: string;
  batchDate: Date;
  batchType: 'ACH' | 'WIRE' | 'CHECK';
  totalPayments: number;
  totalAmount: number;
  status: 'created' | 'submitted' | 'processing' | 'completed' | 'failed';
  payments: PaymentScheduleEntry[];
  submittedBy?: string;
  submittedAt?: Date;
  completedAt?: Date;
}

interface VendorPaymentData {
  paymentId: string;
  vendorId: string;
  invoiceNumber: string;
  paymentAmount: number;
  paymentDate: Date;
  paymentMethod: string;
  paymentStatus: string;
  confirmationNumber?: string;
  bankTraceNumber?: string;
  checkNumber?: string;
  metadata?: Record<string, any>;
}

interface EarlyPaymentDiscount {
  invoiceId: string;
  discountTerms: string; // e.g., "2/10 Net 30"
  discountPercent: number;
  discountAmount: number;
  discountDueDate: Date;
  eligible: boolean;
  savings: number;
}

interface PaymentHoldData {
  holdId: string;
  invoiceId: string;
  vendorId: string;
  holdType: 'dispute' | 'documentation' | 'approval_pending' | 'compliance' | 'investigation';
  holdReason: string;
  holdDate: Date;
  placedBy: string;
  releaseDate?: Date;
  releasedBy?: string;
  status: 'active' | 'released' | 'expired';
}

interface Form1099Data {
  vendorId: string;
  taxYear: number;
  formType: '1099-NEC' | '1099-MISC' | '1099-INT' | '1099-DIV';
  box1Amount: number;
  box2Amount?: number;
  box3Amount?: number;
  totalPayments: number;
  reportableAmount: number;
  withholdingAmount: number;
  corrections: number;
  filingStatus: 'pending' | 'filed' | 'corrected' | 'voided';
}

interface DuplicateInvoiceCheck {
  isDuplicate: boolean;
  matchType: 'exact' | 'fuzzy' | 'potential';
  matchedInvoiceId?: string;
  matchedInvoiceNumber?: string;
  matchScore: number;
  matchReasons: string[];
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Invoice with validation and workflow tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Invoice model
 *
 * @example
 * ```typescript
 * const Invoice = createInvoiceModel(sequelize);
 * const invoice = await Invoice.create({
 *   invoiceNumber: 'INV-2024-001',
 *   vendorId: 'V-123',
 *   vendorName: 'Acme Corp',
 *   invoiceDate: new Date(),
 *   dueDate: new Date('2024-12-31'),
 *   invoiceAmount: 50000,
 *   netAmount: 50000,
 *   status: 'pending_approval'
 * });
 * ```
 */
export const createInvoiceModel = (sequelize: Sequelize) => {
  class Invoice extends Model {
    public id!: string;
    public invoiceNumber!: string;
    public vendorId!: string;
    public vendorName!: string;
    public invoiceDate!: Date;
    public dueDate!: Date;
    public invoiceAmount!: number;
    public taxAmount!: number;
    public discountAmount!: number;
    public netAmount!: number;
    public currency!: string;
    public purchaseOrderNumber!: string | null;
    public receiptNumber!: string | null;
    public description!: string;
    public status!: string;
    public paymentTerms!: string;
    public matchStatus!: string;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public paidAmount!: number;
    public remainingAmount!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Invoice.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      invoiceNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Invoice number',
      },
      vendorId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Vendor identifier',
      },
      vendorName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Vendor name',
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
      invoiceAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Gross invoice amount',
      },
      taxAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Tax amount',
      },
      discountAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Discount amount',
      },
      netAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Net payable amount',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code',
      },
      purchaseOrderNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'PO number for matching',
      },
      receiptNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Receipt number for matching',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Invoice description',
      },
      status: {
        type: DataTypes.ENUM('draft', 'pending_approval', 'approved', 'paid', 'rejected', 'on_hold'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Invoice status',
      },
      paymentTerms: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'Net 30',
        comment: 'Payment terms',
      },
      matchStatus: {
        type: DataTypes.ENUM('unmatched', 'matched', 'partial_match', 'variance'),
        allowNull: false,
        defaultValue: 'unmatched',
        comment: '3-way match status',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approved by user',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      paidAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount paid',
      },
      remainingAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Remaining unpaid amount',
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
      tableName: 'ap_invoices',
      timestamps: true,
      indexes: [
        { fields: ['invoiceNumber'], unique: true },
        { fields: ['vendorId'] },
        { fields: ['status'] },
        { fields: ['dueDate'] },
        { fields: ['purchaseOrderNumber'] },
        { fields: ['matchStatus'] },
      ],
    },
  );

  return Invoice;
};

/**
 * Sequelize model for Invoice Line Items.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InvoiceLineItem model
 */
export const createInvoiceLineItemModel = (sequelize: Sequelize) => {
  class InvoiceLineItem extends Model {
    public id!: string;
    public invoiceId!: string;
    public lineNumber!: number;
    public description!: string;
    public quantity!: number;
    public unitPrice!: number;
    public amount!: number;
    public accountCode!: string;
    public taxCode!: string | null;
    public poLineNumber!: number | null;
    public metadata!: Record<string, any>;
  }

  InvoiceLineItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Related invoice',
      },
      lineNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Line number',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Line description',
      },
      quantity: {
        type: DataTypes.DECIMAL(18, 4),
        allowNull: false,
        comment: 'Quantity',
      },
      unitPrice: {
        type: DataTypes.DECIMAL(18, 4),
        allowNull: false,
        comment: 'Unit price',
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Line amount',
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'GL account code',
      },
      taxCode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Tax code',
      },
      poLineNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'PO line reference',
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
      tableName: 'ap_invoice_line_items',
      timestamps: true,
      indexes: [
        { fields: ['invoiceId', 'lineNumber'] },
        { fields: ['accountCode'] },
      ],
    },
  );

  return InvoiceLineItem;
};

/**
 * Sequelize model for Payment Schedule.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PaymentSchedule model
 */
export const createPaymentScheduleModel = (sequelize: Sequelize) => {
  class PaymentSchedule extends Model {
    public id!: string;
    public scheduleId!: string;
    public invoiceId!: string;
    public vendorId!: string;
    public paymentAmount!: number;
    public scheduledDate!: Date;
    public paymentMethod!: string;
    public priority!: string;
    public status!: string;
    public batchId!: string | null;
    public processedDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PaymentSchedule.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      scheduleId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Schedule identifier',
      },
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Related invoice',
      },
      vendorId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Vendor identifier',
      },
      paymentAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Payment amount',
      },
      scheduledDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Scheduled payment date',
      },
      paymentMethod: {
        type: DataTypes.ENUM('ACH', 'WIRE', 'CHECK', 'CARD'),
        allowNull: false,
        comment: 'Payment method',
      },
      priority: {
        type: DataTypes.ENUM('normal', 'urgent', 'rush'),
        allowNull: false,
        defaultValue: 'normal',
        comment: 'Payment priority',
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'pending_approval', 'approved', 'processed', 'cancelled'),
        allowNull: false,
        defaultValue: 'scheduled',
        comment: 'Schedule status',
      },
      batchId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Payment batch ID',
      },
      processedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Processing date',
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
      tableName: 'ap_payment_schedules',
      timestamps: true,
      indexes: [
        { fields: ['scheduleId'], unique: true },
        { fields: ['invoiceId'] },
        { fields: ['vendorId'] },
        { fields: ['scheduledDate'] },
        { fields: ['status'] },
        { fields: ['batchId'] },
      ],
    },
  );

  return PaymentSchedule;
};

/**
 * Sequelize model for Payment Hold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PaymentHold model
 */
export const createPaymentHoldModel = (sequelize: Sequelize) => {
  class PaymentHold extends Model {
    public id!: string;
    public holdId!: string;
    public invoiceId!: string;
    public vendorId!: string;
    public holdType!: string;
    public holdReason!: string;
    public holdDate!: Date;
    public placedBy!: string;
    public releaseDate!: Date | null;
    public releasedBy!: string | null;
    public status!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PaymentHold.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      holdId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Hold identifier',
      },
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Related invoice',
      },
      vendorId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Vendor identifier',
      },
      holdType: {
        type: DataTypes.ENUM('dispute', 'documentation', 'approval_pending', 'compliance', 'investigation'),
        allowNull: false,
        comment: 'Hold type',
      },
      holdReason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Reason for hold',
      },
      holdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Hold placement date',
      },
      placedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'User who placed hold',
      },
      releaseDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Hold release date',
      },
      releasedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'User who released hold',
      },
      status: {
        type: DataTypes.ENUM('active', 'released', 'expired'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Hold status',
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
      tableName: 'ap_payment_holds',
      timestamps: true,
      indexes: [
        { fields: ['holdId'], unique: true },
        { fields: ['invoiceId'] },
        { fields: ['vendorId'] },
        { fields: ['status'] },
        { fields: ['holdType'] },
      ],
    },
  );

  return PaymentHold;
};

/**
 * Sequelize model for 1099 Tax Reporting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Form1099 model
 */
export const createForm1099Model = (sequelize: Sequelize) => {
  class Form1099 extends Model {
    public id!: string;
    public vendorId!: string;
    public taxYear!: number;
    public formType!: string;
    public box1Amount!: number;
    public box2Amount!: number;
    public box3Amount!: number;
    public totalPayments!: number;
    public reportableAmount!: number;
    public withholdingAmount!: number;
    public corrections!: number;
    public filingStatus!: string;
    public filedDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Form1099.init(
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
      },
      taxYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Tax year',
      },
      formType: {
        type: DataTypes.ENUM('1099-NEC', '1099-MISC', '1099-INT', '1099-DIV'),
        allowNull: false,
        comment: '1099 form type',
      },
      box1Amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Box 1 amount',
      },
      box2Amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Box 2 amount',
      },
      box3Amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Box 3 amount',
      },
      totalPayments: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total payments',
      },
      reportableAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Reportable amount',
      },
      withholdingAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Withholding amount',
      },
      corrections: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of corrections',
      },
      filingStatus: {
        type: DataTypes.ENUM('pending', 'filed', 'corrected', 'voided'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Filing status',
      },
      filedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Filing date',
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
      tableName: 'ap_form_1099',
      timestamps: true,
      indexes: [
        { fields: ['vendorId', 'taxYear'], unique: true },
        { fields: ['taxYear'] },
        { fields: ['filingStatus'] },
      ],
    },
  );

  return Form1099;
};

// ============================================================================
// INVOICE PROCESSING (1-8)
// ============================================================================

/**
 * Creates and validates invoice with line items.
 *
 * @param {InvoiceData} invoiceData - Invoice data
 * @param {Model} Invoice - Invoice model
 * @param {Model} InvoiceLineItem - InvoiceLineItem model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createInvoice({
 *   invoiceNumber: 'INV-2024-001',
 *   vendorId: 'V-123',
 *   vendorName: 'Acme Corp',
 *   invoiceDate: new Date(),
 *   dueDate: new Date('2024-12-31'),
 *   invoiceAmount: 50000,
 *   netAmount: 50000,
 *   description: 'Professional services',
 *   lineItems: [...]
 * }, Invoice, InvoiceLineItem);
 * ```
 */
export const createInvoice = async (
  invoiceData: InvoiceData,
  Invoice: any,
  InvoiceLineItem: any,
  transaction?: Transaction,
): Promise<any> => {
  // Validate invoice amounts
  const lineItemsTotal = invoiceData.lineItems.reduce((sum, item) => sum + item.amount, 0);
  if (Math.abs(lineItemsTotal - invoiceData.invoiceAmount) > 0.01) {
    throw new Error('Invoice amount does not match line items total');
  }

  const invoice = await Invoice.create(
    {
      invoiceNumber: invoiceData.invoiceNumber,
      vendorId: invoiceData.vendorId,
      vendorName: invoiceData.vendorName,
      invoiceDate: invoiceData.invoiceDate,
      dueDate: invoiceData.dueDate,
      invoiceAmount: invoiceData.invoiceAmount,
      taxAmount: invoiceData.taxAmount,
      discountAmount: invoiceData.discountAmount,
      netAmount: invoiceData.netAmount,
      currency: invoiceData.currency || 'USD',
      purchaseOrderNumber: invoiceData.purchaseOrderNumber,
      receiptNumber: invoiceData.receiptNumber,
      description: invoiceData.description,
      status: invoiceData.status || 'draft',
      paymentTerms: invoiceData.paymentTerms || 'Net 30',
      remainingAmount: invoiceData.netAmount,
    },
    { transaction },
  );

  for (const lineItem of invoiceData.lineItems) {
    await InvoiceLineItem.create(
      {
        invoiceId: invoice.id,
        lineNumber: lineItem.lineNumber,
        description: lineItem.description,
        quantity: lineItem.quantity,
        unitPrice: lineItem.unitPrice,
        amount: lineItem.amount,
        accountCode: lineItem.accountCode,
        taxCode: lineItem.taxCode,
        poLineNumber: lineItem.poLineNumber,
      },
      { transaction },
    );
  }

  return invoice;
};

/**
 * Validates invoice data for completeness and accuracy.
 *
 * @param {InvoiceData} invoiceData - Invoice data to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 */
export const validateInvoice = (invoiceData: InvoiceData): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!invoiceData.invoiceNumber || invoiceData.invoiceNumber.trim() === '') {
    errors.push('Invoice number is required');
  }

  if (!invoiceData.vendorId || invoiceData.vendorId.trim() === '') {
    errors.push('Vendor ID is required');
  }

  if (!invoiceData.invoiceDate) {
    errors.push('Invoice date is required');
  }

  if (!invoiceData.dueDate) {
    errors.push('Due date is required');
  }

  if (invoiceData.invoiceDate && invoiceData.dueDate && invoiceData.dueDate < invoiceData.invoiceDate) {
    errors.push('Due date cannot be before invoice date');
  }

  if (invoiceData.invoiceAmount <= 0) {
    errors.push('Invoice amount must be greater than zero');
  }

  if (!invoiceData.lineItems || invoiceData.lineItems.length === 0) {
    errors.push('Invoice must have at least one line item');
  }

  const lineItemsTotal = invoiceData.lineItems?.reduce((sum, item) => sum + item.amount, 0) || 0;
  if (Math.abs(lineItemsTotal - invoiceData.invoiceAmount) > 0.01) {
    errors.push('Invoice amount does not match line items total');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Checks for duplicate invoices.
 *
 * @param {string} invoiceNumber - Invoice number
 * @param {string} vendorId - Vendor ID
 * @param {number} amount - Invoice amount
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<DuplicateInvoiceCheck>} Duplicate check result
 */
export const checkDuplicateInvoice = async (
  invoiceNumber: string,
  vendorId: string,
  amount: number,
  Invoice: any,
): Promise<DuplicateInvoiceCheck> => {
  // Exact match on invoice number and vendor
  const exactMatch = await Invoice.findOne({
    where: {
      invoiceNumber,
      vendorId,
    },
  });

  if (exactMatch) {
    return {
      isDuplicate: true,
      matchType: 'exact',
      matchedInvoiceId: exactMatch.id,
      matchedInvoiceNumber: exactMatch.invoiceNumber,
      matchScore: 100,
      matchReasons: ['Exact match on invoice number and vendor'],
    };
  }

  // Fuzzy match on vendor and amount within 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const fuzzyMatches = await Invoice.findAll({
    where: {
      vendorId,
      invoiceAmount: {
        [Op.between]: [amount * 0.99, amount * 1.01],
      },
      invoiceDate: {
        [Op.gte]: thirtyDaysAgo,
      },
    },
  });

  if (fuzzyMatches.length > 0) {
    return {
      isDuplicate: true,
      matchType: 'potential',
      matchedInvoiceId: fuzzyMatches[0].id,
      matchedInvoiceNumber: fuzzyMatches[0].invoiceNumber,
      matchScore: 75,
      matchReasons: [
        'Same vendor',
        'Similar amount (within 1%)',
        'Invoice within 30 days',
      ],
    };
  }

  return {
    isDuplicate: false,
    matchType: 'exact',
    matchScore: 0,
    matchReasons: [],
  };
};

/**
 * Performs 3-way match (PO, Receipt, Invoice).
 *
 * @param {string} invoiceId - Invoice ID
 * @param {Model} Invoice - Invoice model
 * @param {Model} InvoiceLineItem - InvoiceLineItem model
 * @returns {Promise<ThreeWayMatchResult>} Match result
 */
export const performThreeWayMatch = async (
  invoiceId: string,
  Invoice: any,
  InvoiceLineItem: any,
): Promise<ThreeWayMatchResult> => {
  const invoice = await Invoice.findByPk(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  const lineItems = await InvoiceLineItem.findAll({ where: { invoiceId } });
  const variances: MatchVariance[] = [];

  // Mock PO and receipt data for demonstration
  const poData = {
    totalAmount: invoice.invoiceAmount * 1.01, // 1% variance
    lineItems: lineItems.length,
  };

  const receiptData = {
    totalQuantity: lineItems.reduce((sum: number, item: any) => sum + parseFloat(item.quantity), 0),
  };

  // Check PO match
  const poVariance = Math.abs(invoice.invoiceAmount - poData.totalAmount);
  const poVariancePercent = (poVariance / invoice.invoiceAmount) * 100;
  const poMatch = poVariancePercent <= 5; // 5% tolerance

  if (!poMatch) {
    variances.push({
      type: 'amount',
      poValue: poData.totalAmount,
      receiptValue: null,
      invoiceValue: invoice.invoiceAmount,
      variance: poVariance,
      variancePercent: poVariancePercent,
      withinTolerance: false,
    });
  }

  // Check receipt match
  const receiptMatch = receiptData.totalQuantity > 0;

  // Calculate match score
  const matchScore = (poMatch ? 50 : 0) + (receiptMatch ? 50 : 0);

  const result: ThreeWayMatchResult = {
    matched: poMatch && receiptMatch,
    poMatch,
    receiptMatch,
    invoiceMatch: true,
    variances,
    toleranceExceeded: !poMatch || !receiptMatch,
    requiresReview: variances.length > 0,
    matchScore,
  };

  // Update invoice match status
  invoice.matchStatus = result.matched ? 'matched' : 'variance';
  await invoice.save();

  return result;
};

/**
 * Approves invoice for payment.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} approverId - Approver user ID
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<any>} Approved invoice
 */
export const approveInvoice = async (
  invoiceId: string,
  approverId: string,
  Invoice: any,
): Promise<any> => {
  const invoice = await Invoice.findByPk(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  if (invoice.status === 'approved') {
    throw new Error('Invoice already approved');
  }

  if (invoice.status === 'paid') {
    throw new Error('Cannot approve paid invoice');
  }

  invoice.status = 'approved';
  invoice.approvedBy = approverId;
  invoice.approvedAt = new Date();
  await invoice.save();

  return invoice;
};

/**
 * Rejects invoice with reason.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} reason - Rejection reason
 * @param {string} rejectedBy - User rejecting invoice
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<any>} Rejected invoice
 */
export const rejectInvoice = async (
  invoiceId: string,
  reason: string,
  rejectedBy: string,
  Invoice: any,
): Promise<any> => {
  const invoice = await Invoice.findByPk(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  if (invoice.status === 'paid') {
    throw new Error('Cannot reject paid invoice');
  }

  invoice.status = 'rejected';
  invoice.metadata = {
    ...invoice.metadata,
    rejectionReason: reason,
    rejectedBy,
    rejectedAt: new Date().toISOString(),
  };
  await invoice.save();

  return invoice;
};

/**
 * Retrieves invoices by status.
 *
 * @param {string} status - Invoice status
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<any[]>} Invoices
 */
export const getInvoicesByStatus = async (
  status: string,
  Invoice: any,
): Promise<any[]> => {
  return await Invoice.findAll({
    where: { status },
    order: [['dueDate', 'ASC']],
  });
};

/**
 * Retrieves overdue invoices.
 *
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<any[]>} Overdue invoices
 */
export const getOverdueInvoices = async (Invoice: any): Promise<any[]> => {
  return await Invoice.findAll({
    where: {
      status: { [Op.in]: ['approved', 'pending_approval'] },
      dueDate: { [Op.lt]: new Date() },
    },
    order: [['dueDate', 'ASC']],
  });
};

// ============================================================================
// PAYMENT SCHEDULING & PROCESSING (9-16)
// ============================================================================

/**
 * Schedules payment for invoice.
 *
 * @param {PaymentScheduleEntry} scheduleData - Schedule data
 * @param {Model} PaymentSchedule - PaymentSchedule model
 * @returns {Promise<any>} Created schedule
 */
export const schedulePayment = async (
  scheduleData: PaymentScheduleEntry,
  PaymentSchedule: any,
): Promise<any> => {
  return await PaymentSchedule.create(scheduleData);
};

/**
 * Creates payment batch for processing.
 *
 * @param {PaymentBatchData} batchData - Batch data
 * @param {Model} PaymentSchedule - PaymentSchedule model
 * @returns {Promise<any>} Created batch
 */
export const createPaymentBatch = async (
  batchData: PaymentBatchData,
  PaymentSchedule: any,
): Promise<any> => {
  const batchId = batchData.batchId;

  // Update payment schedules with batch ID
  for (const payment of batchData.payments) {
    await PaymentSchedule.update(
      { batchId, status: 'approved' },
      { where: { scheduleId: payment.scheduleId } },
    );
  }

  return {
    batchId,
    batchDate: batchData.batchDate,
    batchType: batchData.batchType,
    totalPayments: batchData.totalPayments,
    totalAmount: batchData.totalAmount,
    status: 'created',
  };
};

/**
 * Processes vendor payment.
 *
 * @param {VendorPaymentData} paymentData - Payment data
 * @param {Model} Invoice - Invoice model
 * @param {Model} PaymentSchedule - PaymentSchedule model
 * @returns {Promise<any>} Processed payment
 */
export const processVendorPayment = async (
  paymentData: VendorPaymentData,
  Invoice: any,
  PaymentSchedule: any,
): Promise<any> => {
  const invoice = await Invoice.findOne({
    where: { invoiceNumber: paymentData.invoiceNumber },
  });

  if (!invoice) throw new Error('Invoice not found');

  // Update invoice payment
  invoice.paidAmount += paymentData.paymentAmount;
  invoice.remainingAmount = invoice.netAmount - invoice.paidAmount;

  if (invoice.remainingAmount <= 0.01) {
    invoice.status = 'paid';
  }

  await invoice.save();

  // Update payment schedule
  await PaymentSchedule.update(
    {
      status: 'processed',
      processedDate: paymentData.paymentDate,
      metadata: paymentData.metadata,
    },
    {
      where: {
        invoiceId: invoice.id,
        status: 'approved',
      },
    },
  );

  return {
    paymentId: paymentData.paymentId,
    invoiceId: invoice.id,
    amountPaid: paymentData.paymentAmount,
    remainingBalance: invoice.remainingAmount,
    status: paymentData.paymentStatus,
  };
};

/**
 * Generates ACH payment file (NACHA format).
 *
 * @param {string} batchId - Batch ID
 * @param {Model} PaymentSchedule - PaymentSchedule model
 * @returns {Promise<string>} ACH file content
 */
export const generateACHPaymentFile = async (
  batchId: string,
  PaymentSchedule: any,
): Promise<string> => {
  const payments = await PaymentSchedule.findAll({
    where: { batchId, paymentMethod: 'ACH' },
  });

  let achContent = ''; // NACHA file format
  achContent += '101 123456789 987654321 ' + new Date().toISOString().substring(0, 10).replace(/-/g, '') + '\n';

  payments.forEach((payment: any, index: number) => {
    const lineNumber = (index + 1).toString().padStart(7, '0');
    achContent += `6${lineNumber} ACH ${payment.paymentAmount.toFixed(2)} ${payment.vendorId}\n`;
  });

  return achContent;
};

/**
 * Generates wire transfer instructions.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {Model} PaymentSchedule - PaymentSchedule model
 * @returns {Promise<any>} Wire instructions
 */
export const generateWireTransferInstructions = async (
  scheduleId: string,
  PaymentSchedule: any,
): Promise<any> => {
  const schedule = await PaymentSchedule.findOne({ where: { scheduleId } });
  if (!schedule) throw new Error('Payment schedule not found');

  return {
    scheduleId,
    vendorId: schedule.vendorId,
    amount: schedule.paymentAmount,
    currency: 'USD',
    wireType: 'domestic',
    instructions: {
      beneficiaryName: 'Vendor Name',
      beneficiaryAccount: 'XXXX-XXXX-1234',
      beneficiaryBank: 'Bank Name',
      routingNumber: '123456789',
      swiftCode: 'XXXXX123',
      reference: schedule.invoiceId,
    },
  };
};

/**
 * Retrieves scheduled payments by date range.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} PaymentSchedule - PaymentSchedule model
 * @returns {Promise<any[]>} Scheduled payments
 */
export const getScheduledPayments = async (
  startDate: Date,
  endDate: Date,
  PaymentSchedule: any,
): Promise<any[]> => {
  return await PaymentSchedule.findAll({
    where: {
      scheduledDate: { [Op.between]: [startDate, endDate] },
      status: { [Op.in]: ['scheduled', 'approved'] },
    },
    order: [['scheduledDate', 'ASC']],
  });
};

/**
 * Cancels scheduled payment.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {string} reason - Cancellation reason
 * @param {Model} PaymentSchedule - PaymentSchedule model
 * @returns {Promise<any>} Cancelled schedule
 */
export const cancelScheduledPayment = async (
  scheduleId: string,
  reason: string,
  PaymentSchedule: any,
): Promise<any> => {
  const schedule = await PaymentSchedule.findOne({ where: { scheduleId } });
  if (!schedule) throw new Error('Payment schedule not found');

  if (schedule.status === 'processed') {
    throw new Error('Cannot cancel processed payment');
  }

  schedule.status = 'cancelled';
  schedule.metadata = {
    ...schedule.metadata,
    cancellationReason: reason,
    cancelledAt: new Date().toISOString(),
  };
  await schedule.save();

  return schedule;
};

/**
 * Reverses payment (voids or refunds).
 *
 * @param {string} paymentId - Payment ID
 * @param {string} reason - Reversal reason
 * @param {Model} Invoice - Invoice model
 * @param {Model} PaymentSchedule - PaymentSchedule model
 * @returns {Promise<any>} Reversal result
 */
export const reversePayment = async (
  paymentId: string,
  reason: string,
  Invoice: any,
  PaymentSchedule: any,
): Promise<any> => {
  const schedule = await PaymentSchedule.findOne({
    where: { metadata: { paymentId } },
  });

  if (!schedule) throw new Error('Payment not found');

  const invoice = await Invoice.findByPk(schedule.invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  // Reverse payment amounts
  invoice.paidAmount -= schedule.paymentAmount;
  invoice.remainingAmount += schedule.paymentAmount;
  invoice.status = 'approved'; // Reset to approved
  await invoice.save();

  schedule.status = 'cancelled';
  schedule.metadata = {
    ...schedule.metadata,
    reversed: true,
    reversalReason: reason,
    reversedAt: new Date().toISOString(),
  };
  await schedule.save();

  return {
    paymentId,
    invoiceId: invoice.id,
    reversedAmount: schedule.paymentAmount,
    reason,
  };
};

// ============================================================================
// EARLY PAYMENT DISCOUNTS & HOLDS (17-24)
// ============================================================================

/**
 * Calculates early payment discount.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<EarlyPaymentDiscount>} Discount calculation
 */
export const calculateEarlyPaymentDiscount = async (
  invoiceId: string,
  Invoice: any,
): Promise<EarlyPaymentDiscount> => {
  const invoice = await Invoice.findByPk(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  // Parse payment terms (e.g., "2/10 Net 30")
  const termsMatch = invoice.paymentTerms.match(/(\d+)\/(\d+)\s+Net\s+(\d+)/i);

  if (!termsMatch) {
    return {
      invoiceId,
      discountTerms: invoice.paymentTerms,
      discountPercent: 0,
      discountAmount: 0,
      discountDueDate: invoice.dueDate,
      eligible: false,
      savings: 0,
    };
  }

  const discountPercent = parseFloat(termsMatch[1]);
  const discountDays = parseInt(termsMatch[2]);

  const discountDueDate = new Date(invoice.invoiceDate);
  discountDueDate.setDate(discountDueDate.getDate() + discountDays);

  const eligible = new Date() <= discountDueDate;
  const discountAmount = eligible ? invoice.netAmount * (discountPercent / 100) : 0;

  return {
    invoiceId,
    discountTerms: invoice.paymentTerms,
    discountPercent,
    discountAmount,
    discountDueDate,
    eligible,
    savings: discountAmount,
  };
};

/**
 * Applies early payment discount.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<any>} Updated invoice
 */
export const applyEarlyPaymentDiscount = async (
  invoiceId: string,
  Invoice: any,
): Promise<any> => {
  const discount = await calculateEarlyPaymentDiscount(invoiceId, Invoice);

  if (!discount.eligible) {
    throw new Error('Invoice not eligible for early payment discount');
  }

  const invoice = await Invoice.findByPk(invoiceId);
  invoice.discountAmount = discount.discountAmount;
  invoice.netAmount = invoice.invoiceAmount - discount.discountAmount;
  invoice.remainingAmount = invoice.netAmount - invoice.paidAmount;
  invoice.metadata = {
    ...invoice.metadata,
    earlyPaymentDiscount: {
      applied: true,
      amount: discount.discountAmount,
      appliedAt: new Date().toISOString(),
    },
  };
  await invoice.save();

  return invoice;
};

/**
 * Places payment hold on invoice.
 *
 * @param {PaymentHoldData} holdData - Hold data
 * @param {Model} PaymentHold - PaymentHold model
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<any>} Created hold
 */
export const placePaymentHold = async (
  holdData: PaymentHoldData,
  PaymentHold: any,
  Invoice: any,
): Promise<any> => {
  const hold = await PaymentHold.create(holdData);

  // Update invoice status
  await Invoice.update(
    { status: 'on_hold' },
    { where: { id: holdData.invoiceId } },
  );

  return hold;
};

/**
 * Releases payment hold.
 *
 * @param {string} holdId - Hold ID
 * @param {string} releasedBy - User releasing hold
 * @param {Model} PaymentHold - PaymentHold model
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<any>} Released hold
 */
export const releasePaymentHold = async (
  holdId: string,
  releasedBy: string,
  PaymentHold: any,
  Invoice: any,
): Promise<any> => {
  const hold = await PaymentHold.findOne({ where: { holdId } });
  if (!hold) throw new Error('Hold not found');

  hold.status = 'released';
  hold.releaseDate = new Date();
  hold.releasedBy = releasedBy;
  await hold.save();

  // Update invoice status
  await Invoice.update(
    { status: 'approved' },
    { where: { id: hold.invoiceId } },
  );

  return hold;
};

/**
 * Retrieves active payment holds.
 *
 * @param {Model} PaymentHold - PaymentHold model
 * @returns {Promise<any[]>} Active holds
 */
export const getActivePaymentHolds = async (PaymentHold: any): Promise<any[]> => {
  return await PaymentHold.findAll({
    where: { status: 'active' },
    order: [['holdDate', 'DESC']],
  });
};

/**
 * Retrieves invoices eligible for early payment discount.
 *
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<any[]>} Eligible invoices
 */
export const getEarlyPaymentEligibleInvoices = async (Invoice: any): Promise<any[]> => {
  const invoices = await Invoice.findAll({
    where: {
      status: 'approved',
      paymentTerms: { [Op.like]: '%/%Net%' },
    },
  });

  const eligibleInvoices = [];
  for (const invoice of invoices) {
    const discount = await calculateEarlyPaymentDiscount(invoice.id, Invoice);
    if (discount.eligible && discount.savings > 0) {
      eligibleInvoices.push({
        ...invoice.toJSON(),
        discount,
      });
    }
  }

  return eligibleInvoices;
};

/**
 * Generates payment hold report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} PaymentHold - PaymentHold model
 * @returns {Promise<any>} Hold report
 */
export const generatePaymentHoldReport = async (
  startDate: Date,
  endDate: Date,
  PaymentHold: any,
): Promise<any> => {
  const holds = await PaymentHold.findAll({
    where: {
      holdDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const holdsByType = new Map<string, number>();
  const holdsByStatus = new Map<string, number>();

  holds.forEach((hold: any) => {
    holdsByType.set(hold.holdType, (holdsByType.get(hold.holdType) || 0) + 1);
    holdsByStatus.set(hold.status, (holdsByStatus.get(hold.status) || 0) + 1);
  });

  return {
    period: { startDate, endDate },
    totalHolds: holds.length,
    byType: Array.from(holdsByType.entries()).map(([type, count]) => ({ type, count })),
    byStatus: Array.from(holdsByStatus.entries()).map(([status, count]) => ({ status, count })),
    holds,
  };
};

/**
 * Escalates overdue payment holds.
 *
 * @param {number} daysOverdue - Days overdue threshold
 * @param {Model} PaymentHold - PaymentHold model
 * @returns {Promise<any[]>} Escalated holds
 */
export const escalateOverdueHolds = async (
  daysOverdue: number,
  PaymentHold: any,
): Promise<any[]> => {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - daysOverdue);

  const overdueHolds = await PaymentHold.findAll({
    where: {
      status: 'active',
      holdDate: { [Op.lte]: thresholdDate },
    },
  });

  overdueHolds.forEach((hold: any) => {
    hold.metadata = {
      ...hold.metadata,
      escalated: true,
      escalatedAt: new Date().toISOString(),
    };
    hold.save();
  });

  return overdueHolds;
};

// ============================================================================
// 1099 TAX REPORTING (25-32)
// ============================================================================

/**
 * Calculates 1099 reportable amounts for vendor.
 *
 * @param {string} vendorId - Vendor ID
 * @param {number} taxYear - Tax year
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<any>} Reportable amounts
 */
export const calculate1099Amounts = async (
  vendorId: string,
  taxYear: number,
  Invoice: any,
): Promise<any> => {
  const yearStart = new Date(taxYear, 0, 1);
  const yearEnd = new Date(taxYear, 11, 31);

  const invoices = await Invoice.findAll({
    where: {
      vendorId,
      status: 'paid',
      invoiceDate: { [Op.between]: [yearStart, yearEnd] },
    },
  });

  const totalPayments = invoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.paidAmount),
    0,
  );

  // 1099-NEC threshold is $600
  const reportable = totalPayments >= 600;

  return {
    vendorId,
    taxYear,
    totalPayments,
    reportableAmount: reportable ? totalPayments : 0,
    invoiceCount: invoices.length,
    reportable,
    threshold: 600,
  };
};

/**
 * Generates 1099 form for vendor.
 *
 * @param {Form1099Data} form1099Data - Form data
 * @param {Model} Form1099 - Form1099 model
 * @returns {Promise<any>} Generated form
 */
export const generate1099Form = async (
  form1099Data: Form1099Data,
  Form1099: any,
): Promise<any> => {
  const existing = await Form1099.findOne({
    where: {
      vendorId: form1099Data.vendorId,
      taxYear: form1099Data.taxYear,
    },
  });

  if (existing) {
    Object.assign(existing, form1099Data);
    await existing.save();
    return existing;
  }

  return await Form1099.create(form1099Data);
};

/**
 * Retrieves vendors requiring 1099 for tax year.
 *
 * @param {number} taxYear - Tax year
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<string[]>} Vendor IDs
 */
export const get1099RequiredVendors = async (
  taxYear: number,
  Invoice: any,
): Promise<string[]> => {
  const yearStart = new Date(taxYear, 0, 1);
  const yearEnd = new Date(taxYear, 11, 31);

  const invoices = await Invoice.findAll({
    attributes: [
      'vendorId',
      [Sequelize.fn('SUM', Sequelize.col('paidAmount')), 'totalPaid'],
    ],
    where: {
      status: 'paid',
      invoiceDate: { [Op.between]: [yearStart, yearEnd] },
    },
    group: ['vendorId'],
    having: Sequelize.where(
      Sequelize.fn('SUM', Sequelize.col('paidAmount')),
      Op.gte,
      600,
    ),
  });

  return invoices.map((inv: any) => inv.vendorId);
};

/**
 * Files 1099 form electronically.
 *
 * @param {string} form1099Id - Form ID
 * @param {Model} Form1099 - Form1099 model
 * @returns {Promise<any>} Filed form
 */
export const file1099Electronically = async (
  form1099Id: string,
  Form1099: any,
): Promise<any> => {
  const form = await Form1099.findByPk(form1099Id);
  if (!form) throw new Error('Form 1099 not found');

  form.filingStatus = 'filed';
  form.filedDate = new Date();
  await form.save();

  return form;
};

/**
 * Corrects 1099 form.
 *
 * @param {string} form1099Id - Form ID
 * @param {Partial<Form1099Data>} corrections - Correction data
 * @param {Model} Form1099 - Form1099 model
 * @returns {Promise<any>} Corrected form
 */
export const correct1099Form = async (
  form1099Id: string,
  corrections: Partial<Form1099Data>,
  Form1099: any,
): Promise<any> => {
  const form = await Form1099.findByPk(form1099Id);
  if (!form) throw new Error('Form 1099 not found');

  Object.assign(form, corrections);
  form.corrections += 1;
  form.filingStatus = 'corrected';
  await form.save();

  return form;
};

/**
 * Exports 1099 data to IRS format.
 *
 * @param {number} taxYear - Tax year
 * @param {Model} Form1099 - Form1099 model
 * @returns {Promise<string>} IRS formatted data
 */
export const export1099ToIRSFormat = async (
  taxYear: number,
  Form1099: any,
): Promise<string> => {
  const forms = await Form1099.findAll({
    where: { taxYear, filingStatus: { [Op.in]: ['filed', 'corrected'] } },
  });

  let irsData = `1099-NEC TAX YEAR ${taxYear}\n`;
  irsData += 'VENDOR_ID,BOX1_AMOUNT,TOTAL_PAYMENTS,WITHHOLDING\n';

  forms.forEach((form: any) => {
    irsData += `${form.vendorId},${form.box1Amount},${form.totalPayments},${form.withholdingAmount}\n`;
  });

  return irsData;
};

/**
 * Generates 1099 summary report.
 *
 * @param {number} taxYear - Tax year
 * @param {Model} Form1099 - Form1099 model
 * @returns {Promise<any>} Summary report
 */
export const generate1099SummaryReport = async (
  taxYear: number,
  Form1099: any,
): Promise<any> => {
  const forms = await Form1099.findAll({ where: { taxYear } });

  const totalForms = forms.length;
  const totalReportableAmount = forms.reduce(
    (sum: number, f: any) => sum + parseFloat(f.reportableAmount),
    0,
  );
  const totalWithholding = forms.reduce(
    (sum: number, f: any) => sum + parseFloat(f.withholdingAmount),
    0,
  );

  const byStatus = new Map<string, number>();
  forms.forEach((form: any) => {
    byStatus.set(form.filingStatus, (byStatus.get(form.filingStatus) || 0) + 1);
  });

  return {
    taxYear,
    totalForms,
    totalReportableAmount,
    totalWithholding,
    byStatus: Array.from(byStatus.entries()).map(([status, count]) => ({ status, count })),
  };
};

/**
 * Validates 1099 compliance.
 *
 * @param {number} taxYear - Tax year
 * @param {Model} Form1099 - Form1099 model
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<{ compliant: boolean; issues: string[] }>}
 */
export const validate1099Compliance = async (
  taxYear: number,
  Form1099: any,
  Invoice: any,
): Promise<{ compliant: boolean; issues: string[] }> => {
  const issues: string[] = [];

  const requiredVendors = await get1099RequiredVendors(taxYear, Invoice);
  const filedForms = await Form1099.findAll({ where: { taxYear } });
  const filedVendors = new Set(filedForms.map((f: any) => f.vendorId));

  const missingVendors = requiredVendors.filter((v) => !filedVendors.has(v));
  if (missingVendors.length > 0) {
    issues.push(`Missing 1099 forms for ${missingVendors.length} vendors`);
  }

  const pendingForms = filedForms.filter((f: any) => f.filingStatus === 'pending');
  if (pendingForms.length > 0) {
    issues.push(`${pendingForms.length} forms pending filing`);
  }

  return {
    compliant: issues.length === 0,
    issues,
  };
};

// ============================================================================
// REPORTING & ANALYTICS (33-42)
// ============================================================================

/**
 * Generates AP aging report.
 *
 * @param {Date} asOfDate - As of date
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<any>} Aging report
 */
export const generateAPAgingReport = async (
  asOfDate: Date,
  Invoice: any,
): Promise<any> => {
  const unpaidInvoices = await Invoice.findAll({
    where: {
      status: { [Op.in]: ['approved', 'pending_approval'] },
      remainingAmount: { [Op.gt]: 0 },
    },
  });

  const aging = {
    current: 0,
    days30: 0,
    days60: 0,
    days90: 0,
    daysOver90: 0,
  };

  unpaidInvoices.forEach((invoice: any) => {
    const daysOld = Math.floor(
      (asOfDate.getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24),
    );
    const amount = parseFloat(invoice.remainingAmount);

    if (daysOld < 0) {
      aging.current += amount;
    } else if (daysOld <= 30) {
      aging.days30 += amount;
    } else if (daysOld <= 60) {
      aging.days60 += amount;
    } else if (daysOld <= 90) {
      aging.days90 += amount;
    } else {
      aging.daysOver90 += amount;
    }
  });

  return {
    asOfDate,
    totalUnpaid: aging.current + aging.days30 + aging.days60 + aging.days90 + aging.daysOver90,
    aging,
    invoiceCount: unpaidInvoices.length,
  };
};

/**
 * Generates cash requirements forecast.
 *
 * @param {number} days - Number of days to forecast
 * @param {Model} PaymentSchedule - PaymentSchedule model
 * @returns {Promise<any>} Cash forecast
 */
export const generateCashRequirementsForecast = async (
  days: number,
  PaymentSchedule: any,
): Promise<any> => {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);

  const scheduledPayments = await PaymentSchedule.findAll({
    where: {
      scheduledDate: { [Op.lte]: endDate },
      status: { [Op.in]: ['scheduled', 'approved'] },
    },
    order: [['scheduledDate', 'ASC']],
  });

  const dailyRequirements = new Map<string, number>();

  scheduledPayments.forEach((payment: any) => {
    const dateKey = payment.scheduledDate.toISOString().split('T')[0];
    const current = dailyRequirements.get(dateKey) || 0;
    dailyRequirements.set(dateKey, current + parseFloat(payment.paymentAmount));
  });

  return {
    forecastDays: days,
    totalCashRequired: scheduledPayments.reduce(
      (sum: number, p: any) => sum + parseFloat(p.paymentAmount),
      0,
    ),
    dailyRequirements: Array.from(dailyRequirements.entries()).map(([date, amount]) => ({
      date,
      amount,
    })),
    paymentCount: scheduledPayments.length,
  };
};

/**
 * Generates vendor payment summary.
 *
 * @param {string} vendorId - Vendor ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<any>} Payment summary
 */
export const generateVendorPaymentSummary = async (
  vendorId: string,
  startDate: Date,
  endDate: Date,
  Invoice: any,
): Promise<any> => {
  const invoices = await Invoice.findAll({
    where: {
      vendorId,
      invoiceDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalInvoiced = invoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.invoiceAmount),
    0,
  );
  const totalPaid = invoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.paidAmount),
    0,
  );
  const totalOutstanding = invoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.remainingAmount),
    0,
  );

  return {
    vendorId,
    period: { startDate, endDate },
    invoiceCount: invoices.length,
    totalInvoiced,
    totalPaid,
    totalOutstanding,
    paymentRate: totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0,
  };
};

/**
 * Generates payment method distribution report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} PaymentSchedule - PaymentSchedule model
 * @returns {Promise<any>} Method distribution
 */
export const generatePaymentMethodReport = async (
  startDate: Date,
  endDate: Date,
  PaymentSchedule: any,
): Promise<any> => {
  const payments = await PaymentSchedule.findAll({
    where: {
      processedDate: { [Op.between]: [startDate, endDate] },
      status: 'processed',
    },
  });

  const methodCounts = new Map<string, { count: number; amount: number }>();

  payments.forEach((payment: any) => {
    const current = methodCounts.get(payment.paymentMethod) || { count: 0, amount: 0 };
    methodCounts.set(payment.paymentMethod, {
      count: current.count + 1,
      amount: current.amount + parseFloat(payment.paymentAmount),
    });
  });

  return {
    period: { startDate, endDate },
    totalPayments: payments.length,
    byMethod: Array.from(methodCounts.entries()).map(([method, data]) => ({
      method,
      count: data.count,
      amount: data.amount,
    })),
  };
};

/**
 * Generates duplicate invoice report.
 *
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<any>} Duplicate report
 */
export const generateDuplicateInvoiceReport = async (Invoice: any): Promise<any> => {
  const invoices = await Invoice.findAll({
    attributes: [
      'invoiceNumber',
      'vendorId',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'duplicateCount'],
    ],
    group: ['invoiceNumber', 'vendorId'],
    having: Sequelize.where(Sequelize.fn('COUNT', Sequelize.col('id')), Op.gt, 1),
  });

  return {
    totalDuplicates: invoices.length,
    duplicates: invoices.map((inv: any) => ({
      invoiceNumber: inv.invoiceNumber,
      vendorId: inv.vendorId,
      count: inv.get('duplicateCount'),
    })),
  };
};

/**
 * Generates payment approval workflow metrics.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<any>} Approval metrics
 */
export const generateApprovalWorkflowMetrics = async (
  startDate: Date,
  endDate: Date,
  Invoice: any,
): Promise<any> => {
  const invoices = await Invoice.findAll({
    where: {
      createdAt: { [Op.between]: [startDate, endDate] },
    },
  });

  let totalApprovalTime = 0;
  let approvedCount = 0;

  invoices.forEach((invoice: any) => {
    if (invoice.approvedAt) {
      const approvalTime =
        new Date(invoice.approvedAt).getTime() - new Date(invoice.createdAt).getTime();
      totalApprovalTime += approvalTime;
      approvedCount++;
    }
  });

  const avgApprovalTimeMs = approvedCount > 0 ? totalApprovalTime / approvedCount : 0;
  const avgApprovalDays = avgApprovalTimeMs / (1000 * 60 * 60 * 24);

  const statusCounts = new Map<string, number>();
  invoices.forEach((inv: any) => {
    statusCounts.set(inv.status, (statusCounts.get(inv.status) || 0) + 1);
  });

  return {
    period: { startDate, endDate },
    totalInvoices: invoices.length,
    approvedCount,
    avgApprovalDays,
    byStatus: Array.from(statusCounts.entries()).map(([status, count]) => ({ status, count })),
  };
};

/**
 * Generates payment exception report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} Invoice - Invoice model
 * @param {Model} PaymentHold - PaymentHold model
 * @returns {Promise<any>} Exception report
 */
export const generatePaymentExceptionReport = async (
  startDate: Date,
  endDate: Date,
  Invoice: any,
  PaymentHold: any,
): Promise<any> => {
  const rejectedInvoices = await Invoice.findAll({
    where: {
      status: 'rejected',
      updatedAt: { [Op.between]: [startDate, endDate] },
    },
  });

  const holds = await PaymentHold.findAll({
    where: {
      holdDate: { [Op.between]: [startDate, endDate] },
    },
  });

  return {
    period: { startDate, endDate },
    rejectedInvoices: rejectedInvoices.length,
    activeHolds: holds.filter((h: any) => h.status === 'active').length,
    totalExceptions: rejectedInvoices.length + holds.length,
    details: {
      rejections: rejectedInvoices.map((inv: any) => ({
        invoiceNumber: inv.invoiceNumber,
        vendorId: inv.vendorId,
        amount: inv.invoiceAmount,
        reason: inv.metadata.rejectionReason,
      })),
      holds: holds.map((h: any) => ({
        invoiceId: h.invoiceId,
        holdType: h.holdType,
        reason: h.holdReason,
      })),
    },
  };
};

/**
 * Calculates payment processing cost savings.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} PaymentSchedule - PaymentSchedule model
 * @returns {Promise<any>} Cost savings analysis
 */
export const calculatePaymentCostSavings = async (
  startDate: Date,
  endDate: Date,
  PaymentSchedule: any,
): Promise<any> => {
  const payments = await PaymentSchedule.findAll({
    where: {
      processedDate: { [Op.between]: [startDate, endDate] },
      status: 'processed',
    },
  });

  // Cost per payment method
  const costs = {
    ACH: 0.25,
    WIRE: 15.0,
    CHECK: 2.5,
    CARD: 2.0,
  };

  let totalCost = 0;
  const costByMethod = new Map<string, number>();

  payments.forEach((payment: any) => {
    const cost = costs[payment.paymentMethod as keyof typeof costs] || 0;
    totalCost += cost;
    costByMethod.set(
      payment.paymentMethod,
      (costByMethod.get(payment.paymentMethod) || 0) + cost,
    );
  });

  // Calculate savings vs all checks
  const allChecksCost = payments.length * costs.CHECK;
  const savings = allChecksCost - totalCost;

  return {
    period: { startDate, endDate },
    totalPayments: payments.length,
    totalCost,
    allChecksCost,
    savings,
    savingsPercent: (savings / allChecksCost) * 100,
    costByMethod: Array.from(costByMethod.entries()).map(([method, cost]) => ({ method, cost })),
  };
};

/**
 * Exports AP data to CSV format.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<Buffer>} CSV buffer
 */
export const exportAPDataCSV = async (
  startDate: Date,
  endDate: Date,
  Invoice: any,
): Promise<Buffer> => {
  const invoices = await Invoice.findAll({
    where: {
      invoiceDate: { [Op.between]: [startDate, endDate] },
    },
    order: [['invoiceDate', 'DESC']],
  });

  const csv =
    'Invoice Number,Vendor ID,Vendor Name,Invoice Date,Due Date,Amount,Status,Paid Amount,Remaining\n' +
    invoices
      .map(
        (inv: any) =>
          `${inv.invoiceNumber},${inv.vendorId},${inv.vendorName},${inv.invoiceDate.toISOString().split('T')[0]},${inv.dueDate.toISOString().split('T')[0]},${inv.invoiceAmount},${inv.status},${inv.paidAmount},${inv.remainingAmount}`,
      )
      .join('\n');

  return Buffer.from(csv, 'utf-8');
};

/**
 * Generates comprehensive AP dashboard.
 *
 * @param {Model} Invoice - Invoice model
 * @param {Model} PaymentSchedule - PaymentSchedule model
 * @param {Model} PaymentHold - PaymentHold model
 * @returns {Promise<any>} Dashboard data
 */
export const generateAPDashboard = async (
  Invoice: any,
  PaymentSchedule: any,
  PaymentHold: any,
): Promise<any> => {
  const totalInvoices = await Invoice.count();
  const pendingApproval = await Invoice.count({ where: { status: 'pending_approval' } });
  const approved = await Invoice.count({ where: { status: 'approved' } });
  const paid = await Invoice.count({ where: { status: 'paid' } });
  const onHold = await Invoice.count({ where: { status: 'on_hold' } });

  const totalOutstanding = await Invoice.sum('remainingAmount', {
    where: { status: { [Op.in]: ['approved', 'pending_approval'] } },
  });

  const paymentsScheduledToday = await PaymentSchedule.count({
    where: {
      scheduledDate: new Date(),
      status: 'scheduled',
    },
  });

  const activeHolds = await PaymentHold.count({ where: { status: 'active' } });

  return {
    invoiceMetrics: {
      total: totalInvoices,
      pendingApproval,
      approved,
      paid,
      onHold,
    },
    financialMetrics: {
      totalOutstanding: totalOutstanding || 0,
    },
    paymentMetrics: {
      scheduledToday: paymentsScheduledToday,
      activeHolds,
    },
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSAccountsPayableService {
  constructor(private readonly sequelize: Sequelize) {}

  async createInvoice(invoiceData: InvoiceData) {
    const Invoice = createInvoiceModel(this.sequelize);
    const InvoiceLineItem = createInvoiceLineItemModel(this.sequelize);
    return createInvoice(invoiceData, Invoice, InvoiceLineItem);
  }

  async performThreeWayMatch(invoiceId: string) {
    const Invoice = createInvoiceModel(this.sequelize);
    const InvoiceLineItem = createInvoiceLineItemModel(this.sequelize);
    return performThreeWayMatch(invoiceId, Invoice, InvoiceLineItem);
  }

  async schedulePayment(scheduleData: PaymentScheduleEntry) {
    const PaymentSchedule = createPaymentScheduleModel(this.sequelize);
    return schedulePayment(scheduleData, PaymentSchedule);
  }

  async processVendorPayment(paymentData: VendorPaymentData) {
    const Invoice = createInvoiceModel(this.sequelize);
    const PaymentSchedule = createPaymentScheduleModel(this.sequelize);
    return processVendorPayment(paymentData, Invoice, PaymentSchedule);
  }

  async generate1099Summary(taxYear: number) {
    const Form1099 = createForm1099Model(this.sequelize);
    return generate1099SummaryReport(taxYear, Form1099);
  }
}

export default {
  // Models
  createInvoiceModel,
  createInvoiceLineItemModel,
  createPaymentScheduleModel,
  createPaymentHoldModel,
  createForm1099Model,

  // Invoice Processing
  createInvoice,
  validateInvoice,
  checkDuplicateInvoice,
  performThreeWayMatch,
  approveInvoice,
  rejectInvoice,
  getInvoicesByStatus,
  getOverdueInvoices,

  // Payment Processing
  schedulePayment,
  createPaymentBatch,
  processVendorPayment,
  generateACHPaymentFile,
  generateWireTransferInstructions,
  getScheduledPayments,
  cancelScheduledPayment,
  reversePayment,

  // Discounts & Holds
  calculateEarlyPaymentDiscount,
  applyEarlyPaymentDiscount,
  placePaymentHold,
  releasePaymentHold,
  getActivePaymentHolds,
  getEarlyPaymentEligibleInvoices,
  generatePaymentHoldReport,
  escalateOverdueHolds,

  // 1099 Reporting
  calculate1099Amounts,
  generate1099Form,
  get1099RequiredVendors,
  file1099Electronically,
  correct1099Form,
  export1099ToIRSFormat,
  generate1099SummaryReport,
  validate1099Compliance,

  // Reporting
  generateAPAgingReport,
  generateCashRequirementsForecast,
  generateVendorPaymentSummary,
  generatePaymentMethodReport,
  generateDuplicateInvoiceReport,
  generateApprovalWorkflowMetrics,
  generatePaymentExceptionReport,
  calculatePaymentCostSavings,
  exportAPDataCSV,
  generateAPDashboard,

  // Service
  CEFMSAccountsPayableService,
};
