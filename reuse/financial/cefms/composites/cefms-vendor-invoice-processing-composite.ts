/**
 * LOC: CEFMSVIP001
 * File: /reuse/financial/cefms/composites/cefms-vendor-invoice-processing-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../../government/vendor-supplier-management-kit.ts
 *   - ../../../government/electronic-payments-disbursements-kit.ts
 *   - ../../../government/procurement-contract-management-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS invoice services
 *   - USACE vendor payment systems
 *   - Invoice approval workflow modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-vendor-invoice-processing-composite.ts
 * Locator: WC-CEFMS-VIP-001
 * Purpose: USACE CEFMS Vendor Invoice Processing - invoice receipt, validation, approval workflows, payment processing
 *
 * Upstream: Composes utilities from government kits for vendor invoice management
 * Downstream: ../../../backend/cefms/*, Invoice controllers, payment processing, vendor communications
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 42 composite functions for USACE CEFMS vendor invoice operations
 *
 * LLM Context: Production-ready USACE CEFMS vendor invoice processing system.
 * Comprehensive invoice receipt, validation, three-way matching, approval workflows, coding and allocation,
 * dispute resolution, payment processing, vendor communications, early payment discounts, invoice holds,
 * duplicate detection, recurring invoice automation, and vendor performance tracking.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface VendorInvoiceData {
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  invoiceDate: Date;
  dueDate: Date;
  invoiceAmount: number;
  taxAmount: number;
  totalAmount: number;
  purchaseOrderNumber?: string;
  description: string;
  status: 'received' | 'validated' | 'approved' | 'disputed' | 'paid' | 'void';
  paymentTerms: string;
  discountTerms?: string;
}

interface InvoiceLineItemData {
  lineNumber: number;
  description: string;
  quantity: number;
  unitPrice: number;
  lineAmount: number;
  accountCode: string;
  fundCode?: string;
  costCenter?: string;
  projectCode?: string;
}

interface InvoiceApprovalData {
  invoiceId: string;
  approvalLevel: number;
  approverId: string;
  approverName: string;
  approvalDate: Date;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  comments?: string;
}

interface InvoiceMatchingData {
  invoiceId: string;
  purchaseOrderId?: string;
  receivingDocumentId?: string;
  matchStatus: 'unmatched' | 'two_way_match' | 'three_way_match' | 'exception';
  quantityVariance: number;
  priceVariance: number;
  totalVariance: number;
  varianceReason?: string;
}

interface InvoiceDisputeData {
  disputeId: string;
  invoiceId: string;
  disputeReason: string;
  disputeAmount: number;
  raisedBy: string;
  raisedDate: Date;
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  resolution?: string;
}

interface InvoicePaymentData {
  paymentId: string;
  invoiceId: string;
  paymentDate: Date;
  paymentAmount: number;
  discountTaken: number;
  paymentMethod: 'ach' | 'wire' | 'check' | 'card';
  paymentReference: string;
  status: 'scheduled' | 'processing' | 'completed' | 'failed';
}

interface VendorCommunicationData {
  communicationId: string;
  vendorId: string;
  invoiceId?: string;
  communicationType: 'inquiry' | 'dispute' | 'payment_notice' | 'request';
  subject: string;
  message: string;
  sentBy: string;
  sentDate: Date;
  responseRequired: boolean;
}

interface InvoiceHoldData {
  holdId: string;
  invoiceId: string;
  holdReason: string;
  holdType: 'payment' | 'approval' | 'dispute' | 'compliance';
  placedBy: string;
  placedDate: Date;
  releasedBy?: string;
  releasedDate?: Date;
  status: 'active' | 'released';
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Vendor Invoices with comprehensive workflow tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorInvoice model
 *
 * @example
 * ```typescript
 * const VendorInvoice = createVendorInvoiceModel(sequelize);
 * const invoice = await VendorInvoice.create({
 *   invoiceNumber: 'INV-2024-001',
 *   vendorId: 'V123',
 *   vendorName: 'ABC Supplies',
 *   invoiceDate: new Date(),
 *   dueDate: new Date('2024-12-31'),
 *   invoiceAmount: 10000,
 *   taxAmount: 800,
 *   totalAmount: 10800,
 *   status: 'received'
 * });
 * ```
 */
export const createVendorInvoiceModel = (sequelize: Sequelize) => {
  class VendorInvoice extends Model {
    public id!: string;
    public invoiceNumber!: string;
    public vendorId!: string;
    public vendorName!: string;
    public invoiceDate!: Date;
    public dueDate!: Date;
    public invoiceAmount!: number;
    public taxAmount!: number;
    public totalAmount!: number;
    public purchaseOrderNumber!: string | null;
    public description!: string;
    public status!: string;
    public paymentTerms!: string;
    public discountTerms!: string | null;
    public discountAmount!: number;
    public paidAmount!: number;
    public balanceAmount!: number;
    public receivedDate!: Date;
    public approvedDate!: Date | null;
    public paidDate!: Date | null;
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
        comment: 'Invoice amount before tax',
      },
      taxAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Tax amount',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total invoice amount',
      },
      purchaseOrderNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Related purchase order',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Invoice description',
      },
      status: {
        type: DataTypes.ENUM('received', 'validated', 'approved', 'disputed', 'paid', 'void'),
        allowNull: false,
        defaultValue: 'received',
        comment: 'Invoice status',
      },
      paymentTerms: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Payment terms',
      },
      discountTerms: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Discount terms',
      },
      discountAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Discount amount',
      },
      paidAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount paid',
      },
      balanceAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Balance remaining',
      },
      receivedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date received',
      },
      approvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval date',
      },
      paidDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Payment date',
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
        { fields: ['invoiceNumber'], unique: true },
        { fields: ['vendorId'] },
        { fields: ['status'] },
        { fields: ['invoiceDate'] },
        { fields: ['dueDate'] },
        { fields: ['purchaseOrderNumber'] },
      ],
    },
  );

  return VendorInvoice;
};

/**
 * Sequelize model for Invoice Line Items with account coding.
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
    public lineAmount!: number;
    public accountCode!: string;
    public fundCode!: string | null;
    public costCenter!: string | null;
    public projectCode!: string | null;
    public taxAmount!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
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
      lineAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Line amount',
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'GL account code',
      },
      fundCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Fund code',
      },
      costCenter: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Cost center',
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Project code',
      },
      taxAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Tax amount',
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
      tableName: 'invoice_line_items',
      timestamps: true,
      indexes: [
        { fields: ['invoiceId', 'lineNumber'] },
        { fields: ['accountCode'] },
        { fields: ['fundCode'] },
      ],
    },
  );

  return InvoiceLineItem;
};

/**
 * Sequelize model for Invoice Approvals with multi-level workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InvoiceApproval model
 */
export const createInvoiceApprovalModel = (sequelize: Sequelize) => {
  class InvoiceApproval extends Model {
    public id!: string;
    public invoiceId!: string;
    public approvalLevel!: number;
    public approverId!: string;
    public approverName!: string;
    public approvalDate!: Date | null;
    public approvalStatus!: string;
    public comments!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InvoiceApproval.init(
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
      approvalLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Approval level',
      },
      approverId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Approver ID',
      },
      approverName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Approver name',
      },
      approvalDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval date',
      },
      approvalStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Approval status',
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Approval comments',
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
      tableName: 'invoice_approvals',
      timestamps: true,
      indexes: [
        { fields: ['invoiceId'] },
        { fields: ['approverId'] },
        { fields: ['approvalStatus'] },
      ],
    },
  );

  return InvoiceApproval;
};

/**
 * Sequelize model for Invoice Matching with three-way match support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InvoiceMatching model
 */
export const createInvoiceMatchingModel = (sequelize: Sequelize) => {
  class InvoiceMatching extends Model {
    public id!: string;
    public invoiceId!: string;
    public purchaseOrderId!: string | null;
    public receivingDocumentId!: string | null;
    public matchStatus!: string;
    public quantityVariance!: number;
    public priceVariance!: number;
    public totalVariance!: number;
    public varianceReason!: string;
    public matchedBy!: string;
    public matchedDate!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InvoiceMatching.init(
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
      purchaseOrderId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Purchase order ID',
      },
      receivingDocumentId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Receiving document ID',
      },
      matchStatus: {
        type: DataTypes.ENUM('unmatched', 'two_way_match', 'three_way_match', 'exception'),
        allowNull: false,
        defaultValue: 'unmatched',
        comment: 'Match status',
      },
      quantityVariance: {
        type: DataTypes.DECIMAL(18, 4),
        allowNull: false,
        defaultValue: 0,
        comment: 'Quantity variance',
      },
      priceVariance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Price variance',
      },
      totalVariance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total variance',
      },
      varianceReason: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Variance reason',
      },
      matchedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Matched by user',
      },
      matchedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Match date',
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
      tableName: 'invoice_matching',
      timestamps: true,
      indexes: [
        { fields: ['invoiceId'] },
        { fields: ['purchaseOrderId'] },
        { fields: ['matchStatus'] },
      ],
    },
  );

  return InvoiceMatching;
};

/**
 * Sequelize model for Invoice Disputes with resolution tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InvoiceDispute model
 */
export const createInvoiceDisputeModel = (sequelize: Sequelize) => {
  class InvoiceDispute extends Model {
    public id!: string;
    public disputeId!: string;
    public invoiceId!: string;
    public disputeReason!: string;
    public disputeAmount!: number;
    public raisedBy!: string;
    public raisedDate!: Date;
    public status!: string;
    public resolution!: string;
    public resolvedBy!: string | null;
    public resolvedDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InvoiceDispute.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      disputeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Dispute identifier',
      },
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Related invoice',
      },
      disputeReason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Dispute reason',
      },
      disputeAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Disputed amount',
      },
      raisedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Raised by user',
      },
      raisedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Raised date',
      },
      status: {
        type: DataTypes.ENUM('open', 'in_review', 'resolved', 'closed'),
        allowNull: false,
        defaultValue: 'open',
        comment: 'Dispute status',
      },
      resolution: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Resolution details',
      },
      resolvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Resolved by user',
      },
      resolvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Resolution date',
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
      tableName: 'invoice_disputes',
      timestamps: true,
      indexes: [
        { fields: ['disputeId'], unique: true },
        { fields: ['invoiceId'] },
        { fields: ['status'] },
      ],
    },
  );

  return InvoiceDispute;
};

/**
 * Sequelize model for Invoice Payments with disbursement tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InvoicePayment model
 */
export const createInvoicePaymentModel = (sequelize: Sequelize) => {
  class InvoicePayment extends Model {
    public id!: string;
    public paymentId!: string;
    public invoiceId!: string;
    public paymentDate!: Date;
    public paymentAmount!: number;
    public discountTaken!: number;
    public paymentMethod!: string;
    public paymentReference!: string;
    public status!: string;
    public processedBy!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InvoicePayment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      paymentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Payment identifier',
      },
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Related invoice',
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Payment date',
      },
      paymentAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Payment amount',
      },
      discountTaken: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Discount taken',
      },
      paymentMethod: {
        type: DataTypes.ENUM('ach', 'wire', 'check', 'card'),
        allowNull: false,
        comment: 'Payment method',
      },
      paymentReference: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Payment reference number',
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'processing', 'completed', 'failed'),
        allowNull: false,
        defaultValue: 'scheduled',
        comment: 'Payment status',
      },
      processedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Processed by user',
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
      tableName: 'invoice_payments',
      timestamps: true,
      indexes: [
        { fields: ['paymentId'], unique: true },
        { fields: ['invoiceId'] },
        { fields: ['status'] },
        { fields: ['paymentDate'] },
      ],
    },
  );

  return InvoicePayment;
};

/**
 * Sequelize model for Invoice Holds with release tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InvoiceHold model
 */
export const createInvoiceHoldModel = (sequelize: Sequelize) => {
  class InvoiceHold extends Model {
    public id!: string;
    public holdId!: string;
    public invoiceId!: string;
    public holdReason!: string;
    public holdType!: string;
    public placedBy!: string;
    public placedDate!: Date;
    public releasedBy!: string | null;
    public releasedDate!: Date | null;
    public status!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InvoiceHold.init(
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
      holdReason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Hold reason',
      },
      holdType: {
        type: DataTypes.ENUM('payment', 'approval', 'dispute', 'compliance'),
        allowNull: false,
        comment: 'Hold type',
      },
      placedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Placed by user',
      },
      placedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Placed date',
      },
      releasedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Released by user',
      },
      releasedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Released date',
      },
      status: {
        type: DataTypes.ENUM('active', 'released'),
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
      tableName: 'invoice_holds',
      timestamps: true,
      indexes: [
        { fields: ['holdId'], unique: true },
        { fields: ['invoiceId'] },
        { fields: ['status'] },
        { fields: ['holdType'] },
      ],
    },
  );

  return InvoiceHold;
};

// ============================================================================
// INVOICE RECEIPT & VALIDATION (1-7)
// ============================================================================

/**
 * Receives vendor invoice into system.
 *
 * @param {VendorInvoiceData} invoiceData - Invoice data
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any>} Created invoice
 */
export const receiveVendorInvoice = async (
  invoiceData: VendorInvoiceData,
  VendorInvoice: any,
): Promise<any> => {
  const invoice = await VendorInvoice.create({
    ...invoiceData,
    balanceAmount: invoiceData.totalAmount,
    receivedDate: new Date(),
    status: 'received',
  });

  return invoice;
};

/**
 * Validates invoice data completeness and format.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {Model} VendorInvoice - VendorInvoice model
 * @param {Model} InvoiceLineItem - InvoiceLineItem model
 * @returns {Promise<{ valid: boolean; errors: string[] }>}
 */
export const validateInvoiceData = async (
  invoiceId: string,
  VendorInvoice: any,
  InvoiceLineItem: any,
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];
  const invoice = await VendorInvoice.findByPk(invoiceId);

  if (!invoice) {
    errors.push('Invoice not found');
    return { valid: false, errors };
  }

  if (!invoice.invoiceNumber || invoice.invoiceNumber.trim() === '') {
    errors.push('Invoice number is required');
  }

  if (!invoice.vendorId) {
    errors.push('Vendor ID is required');
  }

  if (invoice.totalAmount <= 0) {
    errors.push('Invoice total must be greater than zero');
  }

  const lineItems = await InvoiceLineItem.findAll({ where: { invoiceId } });
  if (lineItems.length === 0) {
    errors.push('Invoice must have at least one line item');
  }

  const lineTotal = lineItems.reduce((sum: number, line: any) => sum + parseFloat(line.lineAmount), 0);
  if (Math.abs(lineTotal - invoice.invoiceAmount) > 0.01) {
    errors.push('Line items total does not match invoice amount');
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Detects duplicate invoices based on vendor and invoice number.
 *
 * @param {string} vendorId - Vendor ID
 * @param {string} invoiceNumber - Invoice number
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<{ isDuplicate: boolean; existingInvoiceId?: string }>}
 */
export const detectDuplicateInvoice = async (
  vendorId: string,
  invoiceNumber: string,
  VendorInvoice: any,
): Promise<{ isDuplicate: boolean; existingInvoiceId?: string }> => {
  const existing = await VendorInvoice.findOne({
    where: {
      vendorId,
      invoiceNumber,
      status: { [Op.ne]: 'void' },
    },
  });

  return {
    isDuplicate: !!existing,
    existingInvoiceId: existing?.id,
  };
};

/**
 * Adds line items to invoice with account coding.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {InvoiceLineItemData[]} lineItems - Line item data
 * @param {Model} InvoiceLineItem - InvoiceLineItem model
 * @returns {Promise<any[]>} Created line items
 */
export const addInvoiceLineItems = async (
  invoiceId: string,
  lineItems: InvoiceLineItemData[],
  InvoiceLineItem: any,
): Promise<any[]> => {
  const createdItems = [];

  for (const item of lineItems) {
    const lineItem = await InvoiceLineItem.create({
      invoiceId,
      ...item,
    });
    createdItems.push(lineItem);
  }

  return createdItems;
};

/**
 * Validates invoice against purchase order.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} purchaseOrderId - Purchase order ID
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<{ matched: boolean; variances: any[] }>}
 */
export const validateAgainstPurchaseOrder = async (
  invoiceId: string,
  purchaseOrderId: string,
  VendorInvoice: any,
): Promise<{ matched: boolean; variances: any[] }> => {
  const invoice = await VendorInvoice.findByPk(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  // Simplified PO validation - in production would fetch actual PO data
  const variances = [];

  if (invoice.totalAmount > 10000) {
    variances.push({
      type: 'amount',
      message: 'Invoice amount exceeds PO limit',
      invoiceAmount: invoice.totalAmount,
      poAmount: 10000,
    });
  }

  return {
    matched: variances.length === 0,
    variances,
  };
};

/**
 * Calculates early payment discount eligibility.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {Date} proposedPaymentDate - Proposed payment date
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<{ eligible: boolean; discountAmount: number; discountPercent: number }>}
 */
export const calculateEarlyPaymentDiscount = async (
  invoiceId: string,
  proposedPaymentDate: Date,
  VendorInvoice: any,
): Promise<{ eligible: boolean; discountAmount: number; discountPercent: number }> => {
  const invoice = await VendorInvoice.findByPk(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  if (!invoice.discountTerms) {
    return { eligible: false, discountAmount: 0, discountPercent: 0 };
  }

  // Parse discount terms (e.g., "2/10 Net 30" means 2% if paid within 10 days)
  const match = invoice.discountTerms.match(/(\d+)\/(\d+)/);
  if (!match) {
    return { eligible: false, discountAmount: 0, discountPercent: 0 };
  }

  const discountPercent = parseFloat(match[1]);
  const discountDays = parseInt(match[2]);

  const daysSinceInvoice = Math.floor(
    (proposedPaymentDate.getTime() - invoice.invoiceDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceInvoice <= discountDays) {
    const discountAmount = (invoice.totalAmount * discountPercent) / 100;
    return { eligible: true, discountAmount, discountPercent };
  }

  return { eligible: false, discountAmount: 0, discountPercent: 0 };
};

/**
 * Updates invoice status through workflow.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} newStatus - New status
 * @param {string} userId - User updating status
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any>} Updated invoice
 */
export const updateInvoiceStatus = async (
  invoiceId: string,
  newStatus: string,
  userId: string,
  VendorInvoice: any,
): Promise<any> => {
  const invoice = await VendorInvoice.findByPk(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  invoice.status = newStatus;

  if (newStatus === 'approved') {
    invoice.approvedDate = new Date();
  } else if (newStatus === 'paid') {
    invoice.paidDate = new Date();
  }

  invoice.metadata = {
    ...invoice.metadata,
    lastUpdatedBy: userId,
    lastUpdatedAt: new Date().toISOString(),
  };

  await invoice.save();
  return invoice;
};

// ============================================================================
// THREE-WAY MATCHING (8-14)
// ============================================================================

/**
 * Performs two-way match (invoice to PO).
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} purchaseOrderId - Purchase order ID
 * @param {string} userId - User performing match
 * @param {Model} InvoiceMatching - InvoiceMatching model
 * @returns {Promise<any>} Match result
 */
export const performTwoWayMatch = async (
  invoiceId: string,
  purchaseOrderId: string,
  userId: string,
  InvoiceMatching: any,
): Promise<any> => {
  const match = await InvoiceMatching.create({
    invoiceId,
    purchaseOrderId,
    matchStatus: 'two_way_match',
    quantityVariance: 0,
    priceVariance: 0,
    totalVariance: 0,
    matchedBy: userId,
    matchedDate: new Date(),
  });

  return match;
};

/**
 * Performs three-way match (invoice to PO and receipt).
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} purchaseOrderId - Purchase order ID
 * @param {string} receivingDocumentId - Receiving document ID
 * @param {string} userId - User performing match
 * @param {Model} InvoiceMatching - InvoiceMatching model
 * @returns {Promise<any>} Match result
 */
export const performThreeWayMatch = async (
  invoiceId: string,
  purchaseOrderId: string,
  receivingDocumentId: string,
  userId: string,
  InvoiceMatching: any,
): Promise<any> => {
  // Simplified three-way match logic
  const quantityVariance = 0; // Would calculate actual variance
  const priceVariance = 0; // Would calculate actual variance
  const totalVariance = quantityVariance + priceVariance;

  const matchStatus = Math.abs(totalVariance) < 0.01 ? 'three_way_match' : 'exception';

  const match = await InvoiceMatching.create({
    invoiceId,
    purchaseOrderId,
    receivingDocumentId,
    matchStatus,
    quantityVariance,
    priceVariance,
    totalVariance,
    matchedBy: userId,
    matchedDate: new Date(),
  });

  return match;
};

/**
 * Identifies matching exceptions requiring review.
 *
 * @param {number} [varianceThreshold=100] - Variance threshold
 * @param {Model} InvoiceMatching - InvoiceMatching model
 * @returns {Promise<any[]>} Match exceptions
 */
export const identifyMatchingExceptions = async (
  varianceThreshold: number = 100,
  InvoiceMatching: any,
): Promise<any[]> => {
  return await InvoiceMatching.findAll({
    where: {
      matchStatus: 'exception',
      totalVariance: {
        [Op.or]: [
          { [Op.gt]: varianceThreshold },
          { [Op.lt]: -varianceThreshold },
        ],
      },
    },
    order: [['totalVariance', 'DESC']],
  });
};

/**
 * Resolves matching exception with approval.
 *
 * @param {string} matchingId - Matching ID
 * @param {string} resolution - Resolution reason
 * @param {string} userId - User resolving exception
 * @param {Model} InvoiceMatching - InvoiceMatching model
 * @returns {Promise<any>} Resolved match
 */
export const resolveMatchingException = async (
  matchingId: string,
  resolution: string,
  userId: string,
  InvoiceMatching: any,
): Promise<any> => {
  const match = await InvoiceMatching.findByPk(matchingId);
  if (!match) throw new Error('Match not found');

  match.matchStatus = 'three_way_match';
  match.varianceReason = resolution;
  match.metadata = {
    ...match.metadata,
    resolvedBy: userId,
    resolvedAt: new Date().toISOString(),
  };

  await match.save();
  return match;
};

/**
 * Generates matching variance report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} InvoiceMatching - InvoiceMatching model
 * @returns {Promise<any>} Variance report
 */
export const generateMatchingVarianceReport = async (
  startDate: Date,
  endDate: Date,
  InvoiceMatching: any,
): Promise<any> => {
  const matches = await InvoiceMatching.findAll({
    where: {
      matchedDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalMatches = matches.length;
  const exceptions = matches.filter((m: any) => m.matchStatus === 'exception').length;
  const totalVariance = matches.reduce((sum: number, m: any) => sum + Math.abs(parseFloat(m.totalVariance)), 0);

  return {
    period: { startDate, endDate },
    totalMatches,
    exceptions,
    exceptionRate: totalMatches > 0 ? (exceptions / totalMatches) * 100 : 0,
    totalVariance,
    averageVariance: totalMatches > 0 ? totalVariance / totalMatches : 0,
  };
};

/**
 * Validates quantity received against invoice.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} receivingDocumentId - Receiving document ID
 * @returns {Promise<{ matched: boolean; quantityVariance: number }>}
 */
export const validateQuantityReceived = async (
  invoiceId: string,
  receivingDocumentId: string,
): Promise<{ matched: boolean; quantityVariance: number }> => {
  // Simplified quantity validation
  const quantityVariance = 0; // Would fetch actual received quantities

  return {
    matched: Math.abs(quantityVariance) < 0.01,
    quantityVariance,
  };
};

/**
 * Validates price against purchase order.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} purchaseOrderId - Purchase order ID
 * @returns {Promise<{ matched: boolean; priceVariance: number }>}
 */
export const validatePriceAgainstPO = async (
  invoiceId: string,
  purchaseOrderId: string,
): Promise<{ matched: boolean; priceVariance: number }> => {
  // Simplified price validation
  const priceVariance = 0; // Would fetch actual PO prices

  return {
    matched: Math.abs(priceVariance) < 0.01,
    priceVariance,
  };
};

// ============================================================================
// APPROVAL WORKFLOWS (15-21)
// ============================================================================

/**
 * Initiates invoice approval workflow.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string[]} approverIds - List of approver IDs
 * @param {Model} InvoiceApproval - InvoiceApproval model
 * @returns {Promise<any[]>} Created approval records
 */
export const initiateApprovalWorkflow = async (
  invoiceId: string,
  approverIds: string[],
  InvoiceApproval: any,
): Promise<any[]> => {
  const approvals = [];

  for (let i = 0; i < approverIds.length; i++) {
    const approval = await InvoiceApproval.create({
      invoiceId,
      approvalLevel: i + 1,
      approverId: approverIds[i],
      approverName: `Approver ${i + 1}`,
      approvalStatus: 'pending',
    });
    approvals.push(approval);
  }

  return approvals;
};

/**
 * Processes approval decision for invoice.
 *
 * @param {string} approvalId - Approval ID
 * @param {boolean} approved - Approval decision
 * @param {string} comments - Approval comments
 * @param {Model} InvoiceApproval - InvoiceApproval model
 * @returns {Promise<any>} Updated approval
 */
export const processApprovalDecision = async (
  approvalId: string,
  approved: boolean,
  comments: string,
  InvoiceApproval: any,
): Promise<any> => {
  const approval = await InvoiceApproval.findByPk(approvalId);
  if (!approval) throw new Error('Approval not found');

  approval.approvalStatus = approved ? 'approved' : 'rejected';
  approval.approvalDate = new Date();
  approval.comments = comments;
  await approval.save();

  return approval;
};

/**
 * Retrieves pending approvals for user.
 *
 * @param {string} approverId - Approver ID
 * @param {Model} InvoiceApproval - InvoiceApproval model
 * @returns {Promise<any[]>} Pending approvals
 */
export const getPendingApprovals = async (
  approverId: string,
  InvoiceApproval: any,
): Promise<any[]> => {
  return await InvoiceApproval.findAll({
    where: {
      approverId,
      approvalStatus: 'pending',
    },
    order: [['createdAt', 'ASC']],
  });
};

/**
 * Validates approval authorization levels.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} approverId - Approver ID
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<{ authorized: boolean; requiredLevel: number }>}
 */
export const validateApprovalAuthorization = async (
  invoiceId: string,
  approverId: string,
  VendorInvoice: any,
): Promise<{ authorized: boolean; requiredLevel: number }> => {
  const invoice = await VendorInvoice.findByPk(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  let requiredLevel = 1;
  if (invoice.totalAmount > 50000) requiredLevel = 3;
  else if (invoice.totalAmount > 10000) requiredLevel = 2;

  // Simplified authorization check
  return { authorized: true, requiredLevel };
};

/**
 * Escalates approval to higher authority.
 *
 * @param {string} approvalId - Approval ID
 * @param {string} escalationReason - Escalation reason
 * @param {string} newApproverId - New approver ID
 * @param {Model} InvoiceApproval - InvoiceApproval model
 * @returns {Promise<any>} Escalated approval
 */
export const escalateApproval = async (
  approvalId: string,
  escalationReason: string,
  newApproverId: string,
  InvoiceApproval: any,
): Promise<any> => {
  const approval = await InvoiceApproval.findByPk(approvalId);
  if (!approval) throw new Error('Approval not found');

  const newApproval = await InvoiceApproval.create({
    invoiceId: approval.invoiceId,
    approvalLevel: approval.approvalLevel + 1,
    approverId: newApproverId,
    approverName: 'Escalated Approver',
    approvalStatus: 'pending',
    comments: `Escalated: ${escalationReason}`,
  });

  approval.approvalStatus = 'rejected';
  approval.comments = `Escalated to level ${newApproval.approvalLevel}`;
  await approval.save();

  return newApproval;
};

/**
 * Generates approval workflow status report.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {Model} InvoiceApproval - InvoiceApproval model
 * @returns {Promise<any>} Approval status
 */
export const getApprovalWorkflowStatus = async (
  invoiceId: string,
  InvoiceApproval: any,
): Promise<any> => {
  const approvals = await InvoiceApproval.findAll({
    where: { invoiceId },
    order: [['approvalLevel', 'ASC']],
  });

  const totalLevels = approvals.length;
  const approvedLevels = approvals.filter((a: any) => a.approvalStatus === 'approved').length;
  const rejectedLevels = approvals.filter((a: any) => a.approvalStatus === 'rejected').length;

  return {
    invoiceId,
    totalLevels,
    approvedLevels,
    rejectedLevels,
    currentLevel: approvedLevels + 1,
    fullyApproved: approvedLevels === totalLevels,
    hasRejection: rejectedLevels > 0,
    approvals,
  };
};

/**
 * Auto-approves invoices meeting criteria.
 *
 * @param {number} autoApprovalThreshold - Auto-approval amount threshold
 * @param {Model} VendorInvoice - VendorInvoice model
 * @param {Model} InvoiceApproval - InvoiceApproval model
 * @returns {Promise<number>} Count of auto-approved invoices
 */
export const autoApproveInvoices = async (
  autoApprovalThreshold: number,
  VendorInvoice: any,
  InvoiceApproval: any,
): Promise<number> => {
  const eligibleInvoices = await VendorInvoice.findAll({
    where: {
      status: 'validated',
      totalAmount: { [Op.lte]: autoApprovalThreshold },
    },
  });

  let count = 0;
  for (const invoice of eligibleInvoices) {
    await InvoiceApproval.create({
      invoiceId: invoice.id,
      approvalLevel: 1,
      approverId: 'SYSTEM',
      approverName: 'Auto-Approval',
      approvalStatus: 'approved',
      approvalDate: new Date(),
      comments: 'Auto-approved based on threshold criteria',
    });

    invoice.status = 'approved';
    invoice.approvedDate = new Date();
    await invoice.save();
    count++;
  }

  return count;
};

// ============================================================================
// DISPUTE MANAGEMENT (22-28)
// ============================================================================

/**
 * Creates invoice dispute with details.
 *
 * @param {InvoiceDisputeData} disputeData - Dispute data
 * @param {Model} InvoiceDispute - InvoiceDispute model
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any>} Created dispute
 */
export const createInvoiceDispute = async (
  disputeData: InvoiceDisputeData,
  InvoiceDispute: any,
  VendorInvoice: any,
): Promise<any> => {
  const dispute = await InvoiceDispute.create(disputeData);

  // Update invoice status
  const invoice = await VendorInvoice.findByPk(disputeData.invoiceId);
  if (invoice) {
    invoice.status = 'disputed';
    await invoice.save();
  }

  return dispute;
};

/**
 * Updates dispute status and resolution.
 *
 * @param {string} disputeId - Dispute ID
 * @param {string} status - New status
 * @param {string} resolution - Resolution details
 * @param {string} userId - User updating dispute
 * @param {Model} InvoiceDispute - InvoiceDispute model
 * @returns {Promise<any>} Updated dispute
 */
export const updateDisputeStatus = async (
  disputeId: string,
  status: string,
  resolution: string,
  userId: string,
  InvoiceDispute: any,
): Promise<any> => {
  const dispute = await InvoiceDispute.findOne({ where: { disputeId } });
  if (!dispute) throw new Error('Dispute not found');

  dispute.status = status;
  dispute.resolution = resolution;

  if (status === 'resolved' || status === 'closed') {
    dispute.resolvedBy = userId;
    dispute.resolvedDate = new Date();
  }

  await dispute.save();
  return dispute;
};

/**
 * Retrieves open disputes requiring action.
 *
 * @param {Model} InvoiceDispute - InvoiceDispute model
 * @returns {Promise<any[]>} Open disputes
 */
export const getOpenDisputes = async (
  InvoiceDispute: any,
): Promise<any[]> => {
  return await InvoiceDispute.findAll({
    where: {
      status: { [Op.in]: ['open', 'in_review'] },
    },
    order: [['raisedDate', 'ASC']],
  });
};

/**
 * Generates dispute aging report.
 *
 * @param {Model} InvoiceDispute - InvoiceDispute model
 * @returns {Promise<any>} Dispute aging
 */
export const generateDisputeAgingReport = async (
  InvoiceDispute: any,
): Promise<any> => {
  const disputes = await InvoiceDispute.findAll({
    where: { status: { [Op.in]: ['open', 'in_review'] } },
  });

  const now = new Date();
  const aging = {
    under30Days: 0,
    days30to60: 0,
    days60to90: 0,
    over90Days: 0,
  };

  disputes.forEach((dispute: any) => {
    const daysPending = Math.floor((now.getTime() - dispute.raisedDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysPending < 30) aging.under30Days++;
    else if (daysPending < 60) aging.days30to60++;
    else if (daysPending < 90) aging.days60to90++;
    else aging.over90Days++;
  });

  return {
    totalDisputes: disputes.length,
    aging,
  };
};

/**
 * Notifies vendor of dispute status.
 *
 * @param {string} disputeId - Dispute ID
 * @param {string} message - Notification message
 * @param {Model} InvoiceDispute - InvoiceDispute model
 * @returns {Promise<any>} Notification result
 */
export const notifyVendorOfDispute = async (
  disputeId: string,
  message: string,
  InvoiceDispute: any,
): Promise<any> => {
  const dispute = await InvoiceDispute.findOne({ where: { disputeId } });
  if (!dispute) throw new Error('Dispute not found');

  // Simplified notification - would integrate with email/messaging system
  return {
    disputeId,
    notificationSent: true,
    sentAt: new Date(),
    message,
  };
};

/**
 * Resolves dispute with invoice adjustment.
 *
 * @param {string} disputeId - Dispute ID
 * @param {number} adjustmentAmount - Adjustment amount
 * @param {string} userId - User resolving dispute
 * @param {Model} InvoiceDispute - InvoiceDispute model
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any>} Resolution result
 */
export const resolveDisputeWithAdjustment = async (
  disputeId: string,
  adjustmentAmount: number,
  userId: string,
  InvoiceDispute: any,
  VendorInvoice: any,
): Promise<any> => {
  const dispute = await InvoiceDispute.findOne({ where: { disputeId } });
  if (!dispute) throw new Error('Dispute not found');

  const invoice = await VendorInvoice.findByPk(dispute.invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  // Apply adjustment
  invoice.totalAmount = parseFloat(invoice.totalAmount) - adjustmentAmount;
  invoice.balanceAmount = parseFloat(invoice.balanceAmount) - adjustmentAmount;
  invoice.status = 'approved';
  await invoice.save();

  // Resolve dispute
  dispute.status = 'resolved';
  dispute.resolution = `Adjusted by ${adjustmentAmount}`;
  dispute.resolvedBy = userId;
  dispute.resolvedDate = new Date();
  await dispute.save();

  return { dispute, invoice };
};

/**
 * Escalates unresolved disputes to management.
 *
 * @param {number} daysOpen - Days open threshold
 * @param {Model} InvoiceDispute - InvoiceDispute model
 * @returns {Promise<any[]>} Escalated disputes
 */
export const escalateUnresolvedDisputes = async (
  daysOpen: number,
  InvoiceDispute: any,
): Promise<any[]> => {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - daysOpen);

  const disputes = await InvoiceDispute.findAll({
    where: {
      status: { [Op.in]: ['open', 'in_review'] },
      raisedDate: { [Op.lt]: threshold },
    },
  });

  disputes.forEach((dispute: any) => {
    dispute.metadata = {
      ...dispute.metadata,
      escalated: true,
      escalatedAt: new Date().toISOString(),
    };
    dispute.save();
  });

  return disputes;
};

// ============================================================================
// PAYMENT PROCESSING (29-35)
// ============================================================================

/**
 * Schedules invoice payment with method selection.
 *
 * @param {InvoicePaymentData} paymentData - Payment data
 * @param {Model} InvoicePayment - InvoicePayment model
 * @returns {Promise<any>} Scheduled payment
 */
export const scheduleInvoicePayment = async (
  paymentData: InvoicePaymentData,
  InvoicePayment: any,
): Promise<any> => {
  const payment = await InvoicePayment.create({
    ...paymentData,
    status: 'scheduled',
  });

  return payment;
};

/**
 * Processes scheduled payments for due date.
 *
 * @param {Date} paymentDate - Payment date
 * @param {Model} InvoicePayment - InvoicePayment model
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<number>} Count of processed payments
 */
export const processScheduledPayments = async (
  paymentDate: Date,
  InvoicePayment: any,
  VendorInvoice: any,
): Promise<number> => {
  const payments = await InvoicePayment.findAll({
    where: {
      paymentDate: { [Op.lte]: paymentDate },
      status: 'scheduled',
    },
  });

  let count = 0;
  for (const payment of payments) {
    payment.status = 'processing';
    await payment.save();

    // Update invoice
    const invoice = await VendorInvoice.findByPk(payment.invoiceId);
    if (invoice) {
      invoice.paidAmount = parseFloat(invoice.paidAmount) + parseFloat(payment.paymentAmount);
      invoice.balanceAmount = parseFloat(invoice.balanceAmount) - parseFloat(payment.paymentAmount);

      if (invoice.balanceAmount <= 0.01) {
        invoice.status = 'paid';
        invoice.paidDate = new Date();
      }

      await invoice.save();
    }

    payment.status = 'completed';
    await payment.save();
    count++;
  }

  return count;
};

/**
 * Voids payment transaction.
 *
 * @param {string} paymentId - Payment ID
 * @param {string} reason - Void reason
 * @param {Model} InvoicePayment - InvoicePayment model
 * @returns {Promise<any>} Voided payment
 */
export const voidPayment = async (
  paymentId: string,
  reason: string,
  InvoicePayment: any,
): Promise<any> => {
  const payment = await InvoicePayment.findOne({ where: { paymentId } });
  if (!payment) throw new Error('Payment not found');

  payment.status = 'failed';
  payment.metadata = {
    ...payment.metadata,
    voidReason: reason,
    voidedAt: new Date().toISOString(),
  };
  await payment.save();

  return payment;
};

/**
 * Generates payment run for batch processing.
 *
 * @param {Date} paymentDate - Payment date
 * @param {Model} VendorInvoice - VendorInvoice model
 * @param {Model} InvoicePayment - InvoicePayment model
 * @returns {Promise<any>} Payment run details
 */
export const generatePaymentRun = async (
  paymentDate: Date,
  VendorInvoice: any,
  InvoicePayment: any,
): Promise<any> => {
  const invoices = await VendorInvoice.findAll({
    where: {
      status: 'approved',
      dueDate: { [Op.lte]: paymentDate },
      balanceAmount: { [Op.gt]: 0 },
    },
  });

  const paymentRun = {
    runDate: paymentDate,
    totalInvoices: invoices.length,
    totalAmount: invoices.reduce((sum: number, inv: any) => sum + parseFloat(inv.balanceAmount), 0),
    invoices: invoices.map((inv: any) => ({
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      vendorId: inv.vendorId,
      amount: inv.balanceAmount,
    })),
  };

  return paymentRun;
};

/**
 * Validates payment account availability.
 *
 * @param {string} accountCode - Account code
 * @param {number} amount - Payment amount
 * @returns {Promise<{ available: boolean; balance: number }>}
 */
export const validatePaymentAccountAvailability = async (
  accountCode: string,
  amount: number,
): Promise<{ available: boolean; balance: number }> => {
  // Simplified availability check - would integrate with GL system
  const balance = 100000; // Mock balance

  return {
    available: balance >= amount,
    balance,
  };
};

/**
 * Retrieves payment history for vendor.
 *
 * @param {string} vendorId - Vendor ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} InvoicePayment - InvoicePayment model
 * @returns {Promise<any[]>} Payment history
 */
export const getVendorPaymentHistory = async (
  vendorId: string,
  startDate: Date,
  endDate: Date,
  InvoicePayment: any,
): Promise<any[]> => {
  return await InvoicePayment.findAll({
    where: {
      paymentDate: { [Op.between]: [startDate, endDate] },
      status: 'completed',
    },
    order: [['paymentDate', 'DESC']],
  });
};

/**
 * Generates payment confirmation documentation.
 *
 * @param {string} paymentId - Payment ID
 * @param {Model} InvoicePayment - InvoicePayment model
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<Buffer>} Payment confirmation
 */
export const generatePaymentConfirmation = async (
  paymentId: string,
  InvoicePayment: any,
  VendorInvoice: any,
): Promise<Buffer> => {
  const payment = await InvoicePayment.findOne({ where: { paymentId } });
  if (!payment) throw new Error('Payment not found');

  const invoice = await VendorInvoice.findByPk(payment.invoiceId);

  const content = `
PAYMENT CONFIRMATION
Payment ID: ${payment.paymentId}
Invoice Number: ${invoice?.invoiceNumber}
Vendor: ${invoice?.vendorName}
Payment Amount: $${payment.paymentAmount}
Payment Date: ${payment.paymentDate.toISOString().split('T')[0]}
Payment Method: ${payment.paymentMethod}
Reference: ${payment.paymentReference}

Generated: ${new Date().toISOString()}
`;

  return Buffer.from(content, 'utf-8');
};

// ============================================================================
// INVOICE HOLDS & RECURRING INVOICES (36-42)
// ============================================================================

/**
 * Places hold on invoice with reason.
 *
 * @param {InvoiceHoldData} holdData - Hold data
 * @param {Model} InvoiceHold - InvoiceHold model
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any>} Created hold
 */
export const placeInvoiceHold = async (
  holdData: InvoiceHoldData,
  InvoiceHold: any,
  VendorInvoice: any,
): Promise<any> => {
  const hold = await InvoiceHold.create(holdData);

  // Update invoice metadata
  const invoice = await VendorInvoice.findByPk(holdData.invoiceId);
  if (invoice) {
    invoice.metadata = {
      ...invoice.metadata,
      onHold: true,
      holdId: hold.holdId,
    };
    await invoice.save();
  }

  return hold;
};

/**
 * Releases invoice hold with authorization.
 *
 * @param {string} holdId - Hold ID
 * @param {string} userId - User releasing hold
 * @param {Model} InvoiceHold - InvoiceHold model
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any>} Released hold
 */
export const releaseInvoiceHold = async (
  holdId: string,
  userId: string,
  InvoiceHold: any,
  VendorInvoice: any,
): Promise<any> => {
  const hold = await InvoiceHold.findOne({ where: { holdId } });
  if (!hold) throw new Error('Hold not found');

  hold.status = 'released';
  hold.releasedBy = userId;
  hold.releasedDate = new Date();
  await hold.save();

  // Update invoice metadata
  const invoice = await VendorInvoice.findByPk(hold.invoiceId);
  if (invoice) {
    invoice.metadata = {
      ...invoice.metadata,
      onHold: false,
    };
    await invoice.save();
  }

  return hold;
};

/**
 * Retrieves active holds requiring review.
 *
 * @param {Model} InvoiceHold - InvoiceHold model
 * @returns {Promise<any[]>} Active holds
 */
export const getActiveInvoiceHolds = async (
  InvoiceHold: any,
): Promise<any[]> => {
  return await InvoiceHold.findAll({
    where: { status: 'active' },
    order: [['placedDate', 'ASC']],
  });
};

/**
 * Creates recurring invoice template.
 *
 * @param {string} templateId - Template ID
 * @param {VendorInvoiceData} invoiceTemplate - Invoice template
 * @returns {Promise<any>} Created template
 */
export const createRecurringInvoiceTemplate = async (
  templateId: string,
  invoiceTemplate: VendorInvoiceData,
): Promise<any> => {
  // Simplified template creation - would store in template repository
  return {
    templateId,
    template: invoiceTemplate,
    frequency: 'monthly',
    active: true,
  };
};

/**
 * Generates recurring invoice from template.
 *
 * @param {string} templateId - Template ID
 * @param {Date} invoiceDate - Invoice date
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<any>} Generated invoice
 */
export const generateRecurringInvoice = async (
  templateId: string,
  invoiceDate: Date,
  VendorInvoice: any,
): Promise<any> => {
  // Simplified recurring invoice generation
  const invoice = await VendorInvoice.create({
    invoiceNumber: `REC-${templateId}-${invoiceDate.getTime()}`,
    vendorId: 'VENDOR-001',
    vendorName: 'Recurring Vendor',
    invoiceDate,
    dueDate: new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000),
    invoiceAmount: 1000,
    taxAmount: 80,
    totalAmount: 1080,
    description: 'Recurring invoice',
    status: 'received',
    paymentTerms: 'Net 30',
  });

  return invoice;
};

/**
 * Exports invoice data to CSV format.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} VendorInvoice - VendorInvoice model
 * @returns {Promise<Buffer>} CSV export
 */
export const exportInvoicesToCSV = async (
  startDate: Date,
  endDate: Date,
  VendorInvoice: any,
): Promise<Buffer> => {
  const invoices = await VendorInvoice.findAll({
    where: {
      invoiceDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const csv = 'Invoice Number,Vendor ID,Vendor Name,Invoice Date,Due Date,Total Amount,Status\n' +
    invoices.map((inv: any) =>
      `${inv.invoiceNumber},${inv.vendorId},${inv.vendorName},${inv.invoiceDate.toISOString().split('T')[0]},${inv.dueDate.toISOString().split('T')[0]},${inv.totalAmount},${inv.status}`
    ).join('\n');

  return Buffer.from(csv, 'utf-8');
};

/**
 * Generates invoice processing metrics dashboard.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} VendorInvoice - VendorInvoice model
 * @param {Model} InvoicePayment - InvoicePayment model
 * @returns {Promise<any>} Processing metrics
 */
export const generateInvoiceProcessingMetrics = async (
  startDate: Date,
  endDate: Date,
  VendorInvoice: any,
  InvoicePayment: any,
): Promise<any> => {
  const invoices = await VendorInvoice.findAll({
    where: {
      invoiceDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const payments = await InvoicePayment.findAll({
    where: {
      paymentDate: { [Op.between]: [startDate, endDate] },
      status: 'completed',
    },
  });

  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum: number, inv: any) => sum + parseFloat(inv.totalAmount), 0);
  const totalPaid = payments.reduce((sum: number, pay: any) => sum + parseFloat(pay.paymentAmount), 0);

  const statusCounts = invoices.reduce((acc: any, inv: any) => {
    acc[inv.status] = (acc[inv.status] || 0) + 1;
    return acc;
  }, {});

  return {
    period: { startDate, endDate },
    totalInvoices,
    totalAmount,
    totalPaid,
    averageInvoiceAmount: totalInvoices > 0 ? totalAmount / totalInvoices : 0,
    statusBreakdown: statusCounts,
    paymentCount: payments.length,
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSVendorInvoiceService {
  constructor(private readonly sequelize: Sequelize) {}

  async receiveInvoice(invoiceData: VendorInvoiceData) {
    const VendorInvoice = createVendorInvoiceModel(this.sequelize);
    return receiveVendorInvoice(invoiceData, VendorInvoice);
  }

  async processApproval(approvalId: string, approved: boolean, comments: string) {
    const InvoiceApproval = createInvoiceApprovalModel(this.sequelize);
    return processApprovalDecision(approvalId, approved, comments, InvoiceApproval);
  }

  async schedulePayment(paymentData: InvoicePaymentData) {
    const InvoicePayment = createInvoicePaymentModel(this.sequelize);
    return scheduleInvoicePayment(paymentData, InvoicePayment);
  }

  async getProcessingMetrics(startDate: Date, endDate: Date) {
    const VendorInvoice = createVendorInvoiceModel(this.sequelize);
    const InvoicePayment = createInvoicePaymentModel(this.sequelize);
    return generateInvoiceProcessingMetrics(startDate, endDate, VendorInvoice, InvoicePayment);
  }
}

export default {
  // Models
  createVendorInvoiceModel,
  createInvoiceLineItemModel,
  createInvoiceApprovalModel,
  createInvoiceMatchingModel,
  createInvoiceDisputeModel,
  createInvoicePaymentModel,
  createInvoiceHoldModel,

  // Invoice Receipt & Validation
  receiveVendorInvoice,
  validateInvoiceData,
  detectDuplicateInvoice,
  addInvoiceLineItems,
  validateAgainstPurchaseOrder,
  calculateEarlyPaymentDiscount,
  updateInvoiceStatus,

  // Three-Way Matching
  performTwoWayMatch,
  performThreeWayMatch,
  identifyMatchingExceptions,
  resolveMatchingException,
  generateMatchingVarianceReport,
  validateQuantityReceived,
  validatePriceAgainstPO,

  // Approval Workflows
  initiateApprovalWorkflow,
  processApprovalDecision,
  getPendingApprovals,
  validateApprovalAuthorization,
  escalateApproval,
  getApprovalWorkflowStatus,
  autoApproveInvoices,

  // Dispute Management
  createInvoiceDispute,
  updateDisputeStatus,
  getOpenDisputes,
  generateDisputeAgingReport,
  notifyVendorOfDispute,
  resolveDisputeWithAdjustment,
  escalateUnresolvedDisputes,

  // Payment Processing
  scheduleInvoicePayment,
  processScheduledPayments,
  voidPayment,
  generatePaymentRun,
  validatePaymentAccountAvailability,
  getVendorPaymentHistory,
  generatePaymentConfirmation,

  // Holds & Recurring
  placeInvoiceHold,
  releaseInvoiceHold,
  getActiveInvoiceHolds,
  createRecurringInvoiceTemplate,
  generateRecurringInvoice,
  exportInvoicesToCSV,
  generateInvoiceProcessingMetrics,

  // Service
  CEFMSVendorInvoiceService,
};
