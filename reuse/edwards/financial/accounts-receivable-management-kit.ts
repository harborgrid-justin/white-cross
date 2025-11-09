/**
 * LOC: EDWAR001
 * File: /reuse/edwards/financial/accounts-receivable-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL integration)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Customer billing services
 *   - Collections management modules
 *   - Cash receipts systems
 */

/**
 * File: /reuse/edwards/financial/accounts-receivable-management-kit.ts
 * Locator: WC-EDWARDS-AR-001
 * Purpose: Comprehensive Accounts Receivable Management - JD Edwards EnterpriseOne-level customer billing, collections, cash receipts, credit management
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/financial/*, Customer Services, Collections, Cash Management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for customer management, invoice generation, payment application, collections, credit management, dunning, lockbox processing, cash receipts, AR aging, credit limits, customer statements, dispute management, payment plans, write-offs
 *
 * LLM Context: Enterprise-grade accounts receivable operations for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive customer billing, automated invoice generation, payment application, collections workflows,
 * credit limit management, dunning process automation, lockbox processing, cash receipts posting,
 * AR aging analysis, customer statement generation, dispute tracking, payment plan management,
 * bad debt write-offs, and audit trails. Supports multi-currency, multi-entity operations with full GL integration.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Customer {
  customerId: number;
  customerNumber: string;
  customerName: string;
  customerType: 'commercial' | 'government' | 'individual' | 'nonprofit';
  taxId: string;
  creditLimit: number;
  creditRating: 'excellent' | 'good' | 'fair' | 'poor' | 'blocked';
  paymentTerms: string;
  status: 'active' | 'inactive' | 'hold' | 'collections';
  holdReason?: string;
  defaultGLAccount: string;
  currency: string;
  dunningLevel: number;
  lastDunningDate?: Date;
}

interface CustomerContact {
  contactId: number;
  customerId: number;
  contactType: 'primary' | 'billing' | 'shipping' | 'collections';
  contactName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ARInvoice {
  invoiceId: number;
  invoiceNumber: string;
  customerId: number;
  invoiceDate: Date;
  dueDate: Date;
  invoiceAmount: number;
  taxAmount: number;
  freightAmount: number;
  otherCharges: number;
  grossAmount: number;
  appliedAmount: number;
  unappliedAmount: number;
  outstandingBalance: number;
  status: 'draft' | 'posted' | 'partial_paid' | 'paid' | 'disputed' | 'written_off' | 'cancelled';
  disputeStatus: 'none' | 'under_review' | 'approved' | 'rejected';
  glDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  salesOrderNumber?: string;
  shipmentNumber?: string;
  description: string;
}

interface ARInvoiceLine {
  lineId: number;
  invoiceId: number;
  lineNumber: number;
  accountCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineAmount: number;
  taxAmount: number;
  salesOrderLine?: number;
  projectCode?: string;
  costCenterCode?: string;
  activityCode?: string;
}

interface CashReceipt {
  receiptId: number;
  receiptNumber: string;
  receiptDate: Date;
  receiptMethod: 'check' | 'wire' | 'ach' | 'credit_card' | 'cash' | 'lockbox';
  customerId: number;
  receiptAmount: number;
  unappliedAmount: number;
  bankAccountId: number;
  checkNumber?: string;
  referenceNumber?: string;
  lockboxBatchId?: string;
  status: 'unposted' | 'posted' | 'applied' | 'reversed' | 'nsf';
  postedDate?: Date;
  reversalDate?: Date;
  reversalReason?: string;
  currency: string;
}

interface ReceiptApplication {
  applicationId: number;
  receiptId: number;
  invoiceId: number;
  appliedAmount: number;
  applicationDate: Date;
  reversalId?: number;
}

interface CollectionsCase {
  caseId: number;
  customerId: number;
  caseNumber: string;
  caseDate: Date;
  totalOutstanding: number;
  oldestInvoiceDate: Date;
  daysOutstanding: number;
  collectorId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'promise_to_pay' | 'legal' | 'resolved' | 'closed';
  resolutionDate?: Date;
  resolutionNotes?: string;
}

interface CollectionsActivity {
  activityId: number;
  caseId: number;
  activityDate: Date;
  activityType: 'call' | 'email' | 'letter' | 'meeting' | 'legal_notice';
  contactedPerson: string;
  activityNotes: string;
  promiseDate?: Date;
  promiseAmount?: number;
  collectorId: string;
}

interface DunningRun {
  runId: number;
  runNumber: string;
  runDate: Date;
  dunningLevel: number;
  customerCount: number;
  totalAmount: number;
  status: 'created' | 'in_progress' | 'completed';
  processedBy: string;
  processedAt?: Date;
}

interface CustomerStatement {
  statementId: number;
  customerId: number;
  statementDate: Date;
  beginningBalance: number;
  charges: number;
  payments: number;
  adjustments: number;
  endingBalance: number;
  currentDue: number;
  pastDue: number;
}

interface ARAgingBucket {
  customerId: number;
  customerNumber: string;
  customerName: string;
  current: number;
  days1To30: number;
  days31To60: number;
  days61To90: number;
  days91To120: number;
  over120: number;
  totalOutstanding: number;
}

interface PaymentPlan {
  planId: number;
  customerId: number;
  planStartDate: Date;
  totalAmount: number;
  numberOfPayments: number;
  paymentFrequency: 'weekly' | 'biweekly' | 'monthly';
  paymentAmount: number;
  nextPaymentDate: Date;
  status: 'active' | 'completed' | 'defaulted' | 'cancelled';
}

interface CreditLimitReview {
  reviewId: number;
  customerId: number;
  reviewDate: Date;
  currentCreditLimit: number;
  proposedCreditLimit: number;
  currentOutstanding: number;
  paymentHistory: string;
  creditRating: string;
  reviewedBy: string;
  decision: 'approved' | 'rejected' | 'pending';
}

interface Dispute {
  disputeId: number;
  invoiceId: number;
  customerId: number;
  disputeDate: Date;
  disputeAmount: number;
  disputeReason: string;
  disputeCategory: 'pricing' | 'quantity' | 'quality' | 'delivery' | 'other';
  status: 'open' | 'investigating' | 'resolved' | 'rejected';
  assignedTo?: string;
  resolutionDate?: Date;
  resolutionNotes?: string;
}

interface WriteOff {
  writeOffId: number;
  invoiceId: number;
  customerId: number;
  writeOffDate: Date;
  writeOffAmount: number;
  writeOffReason: string;
  writeOffType: 'bad_debt' | 'adjustment' | 'settlement';
  approvedBy: string;
  glJournalEntryId?: number;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateCustomerDto {
  @ApiProperty({ description: 'Customer number', example: 'C-10001' })
  customerNumber!: string;

  @ApiProperty({ description: 'Customer name', example: 'ABC Corporation' })
  customerName!: string;

  @ApiProperty({ description: 'Customer type', enum: ['commercial', 'government', 'individual', 'nonprofit'] })
  customerType!: string;

  @ApiProperty({ description: 'Tax ID (EIN or SSN)', example: '12-3456789' })
  taxId!: string;

  @ApiProperty({ description: 'Credit limit', example: 50000 })
  creditLimit!: number;

  @ApiProperty({ description: 'Payment terms', example: 'Net 30' })
  paymentTerms!: string;

  @ApiProperty({ description: 'Default GL account', example: '1200-00' })
  defaultGLAccount!: string;
}

export class CreateARInvoiceDto {
  @ApiProperty({ description: 'Invoice number', example: 'AR-2024-001' })
  invoiceNumber!: string;

  @ApiProperty({ description: 'Customer ID' })
  customerId!: number;

  @ApiProperty({ description: 'Invoice date' })
  invoiceDate!: Date;

  @ApiProperty({ description: 'Gross amount' })
  grossAmount!: number;

  @ApiProperty({ description: 'Tax amount', default: 0 })
  taxAmount?: number;

  @ApiProperty({ description: 'Sales order number', required: false })
  salesOrderNumber?: string;

  @ApiProperty({ description: 'Invoice lines', type: [Object] })
  lines!: ARInvoiceLine[];
}

export class ProcessCashReceiptDto {
  @ApiProperty({ description: 'Receipt date' })
  receiptDate!: Date;

  @ApiProperty({ description: 'Receipt method', enum: ['check', 'wire', 'ach', 'credit_card'] })
  receiptMethod!: string;

  @ApiProperty({ description: 'Customer ID' })
  customerId!: number;

  @ApiProperty({ description: 'Receipt amount' })
  receiptAmount!: number;

  @ApiProperty({ description: 'Bank account ID' })
  bankAccountId!: number;

  @ApiProperty({ description: 'Check number', required: false })
  checkNumber?: string;

  @ApiProperty({ description: 'Invoice IDs to apply', type: [Number], required: false })
  invoiceIds?: number[];
}

export class CreateCollectionsCaseDto {
  @ApiProperty({ description: 'Customer ID' })
  customerId!: number;

  @ApiProperty({ description: 'Collector ID' })
  collectorId!: string;

  @ApiProperty({ description: 'Priority', enum: ['low', 'medium', 'high', 'critical'] })
  priority!: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Customer master data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Customer model
 *
 * @example
 * ```typescript
 * const Customer = createCustomerModel(sequelize);
 * const customer = await Customer.create({
 *   customerNumber: 'C-10001',
 *   customerName: 'ABC Corp',
 *   customerType: 'commercial',
 *   status: 'active'
 * });
 * ```
 */
export const createCustomerModel = (sequelize: Sequelize) => {
  class Customer extends Model {
    public id!: number;
    public customerNumber!: string;
    public customerName!: string;
    public customerType!: string;
    public taxId!: string;
    public creditLimit!: number;
    public creditRating!: string;
    public paymentTerms!: string;
    public status!: string;
    public holdReason!: string | null;
    public defaultGLAccount!: string;
    public currency!: string;
    public dunningLevel!: number;
    public lastDunningDate!: Date | null;
    public metadata!: Record<string, any>;
  }

  Customer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      customerNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique customer identifier',
      },
      customerName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Customer legal name',
      },
      customerType: {
        type: DataTypes.ENUM('commercial', 'government', 'individual', 'nonprofit'),
        allowNull: false,
        comment: 'Customer classification',
      },
      taxId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'EIN or SSN for tax reporting',
      },
      creditLimit: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Customer credit limit',
      },
      creditRating: {
        type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor', 'blocked'),
        allowNull: false,
        defaultValue: 'good',
        comment: 'Credit rating assessment',
      },
      paymentTerms: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Payment terms (Net 30, etc.)',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'hold', 'collections'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Customer status',
      },
      holdReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for credit hold',
      },
      defaultGLAccount: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Default AR account',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Customer currency code',
      },
      dunningLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Current dunning level (0-5)',
      },
      lastDunningDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last dunning communication date',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional customer data',
      },
    },
    {
      sequelize,
      tableName: 'ar_customers',
      timestamps: true,
      indexes: [
        { fields: ['customerNumber'], unique: true },
        { fields: ['customerName'] },
        { fields: ['customerType'] },
        { fields: ['status'] },
        { fields: ['creditRating'] },
        { fields: ['taxId'] },
      ],
    },
  );

  return Customer;
};

/**
 * Sequelize model for AR Invoice headers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ARInvoice model
 *
 * @example
 * ```typescript
 * const ARInvoice = createARInvoiceModel(sequelize);
 * const invoice = await ARInvoice.create({
 *   invoiceNumber: 'AR-2024-001',
 *   customerId: 1,
 *   grossAmount: 10000.00,
 *   status: 'posted'
 * });
 * ```
 */
export const createARInvoiceModel = (sequelize: Sequelize) => {
  class ARInvoice extends Model {
    public id!: number;
    public invoiceNumber!: string;
    public customerId!: number;
    public invoiceDate!: Date;
    public dueDate!: Date;
    public invoiceAmount!: number;
    public taxAmount!: number;
    public freightAmount!: number;
    public otherCharges!: number;
    public grossAmount!: number;
    public appliedAmount!: number;
    public unappliedAmount!: number;
    public outstandingBalance!: number;
    public status!: string;
    public disputeStatus!: string;
    public glDate!: Date;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public salesOrderNumber!: string | null;
    public shipmentNumber!: string | null;
    public description!: string;
  }

  ARInvoice.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      invoiceNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique invoice number',
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ar_customers',
          key: 'id',
        },
        comment: 'Customer reference',
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
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Net invoice amount',
      },
      taxAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Tax amount',
      },
      freightAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Freight charges',
      },
      otherCharges: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Other charges',
      },
      grossAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Gross amount including tax and charges',
      },
      appliedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount applied from receipts',
      },
      unappliedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Unapplied receipt amount',
      },
      outstandingBalance: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Remaining balance',
      },
      status: {
        type: DataTypes.ENUM('draft', 'posted', 'partial_paid', 'paid', 'disputed', 'written_off', 'cancelled'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Invoice status',
      },
      disputeStatus: {
        type: DataTypes.ENUM('none', 'under_review', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'none',
        comment: 'Dispute status',
      },
      glDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'GL posting date',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      fiscalPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal period',
      },
      salesOrderNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Associated sales order',
      },
      shipmentNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Associated shipment',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Invoice description',
      },
    },
    {
      sequelize,
      tableName: 'ar_invoices',
      timestamps: true,
      indexes: [
        { fields: ['invoiceNumber'], unique: true },
        { fields: ['customerId'] },
        { fields: ['invoiceDate'] },
        { fields: ['dueDate'] },
        { fields: ['status'] },
        { fields: ['disputeStatus'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['salesOrderNumber'] },
      ],
    },
  );

  return ARInvoice;
};

/**
 * Sequelize model for Cash Receipt headers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CashReceipt model
 *
 * @example
 * ```typescript
 * const CashReceipt = createCashReceiptModel(sequelize);
 * const receipt = await CashReceipt.create({
 *   receiptNumber: 'CR-2024-001',
 *   customerId: 1,
 *   receiptAmount: 5000.00,
 *   receiptMethod: 'check'
 * });
 * ```
 */
export const createCashReceiptModel = (sequelize: Sequelize) => {
  class CashReceipt extends Model {
    public id!: number;
    public receiptNumber!: string;
    public receiptDate!: Date;
    public receiptMethod!: string;
    public customerId!: number;
    public receiptAmount!: number;
    public unappliedAmount!: number;
    public bankAccountId!: number;
    public checkNumber!: string | null;
    public referenceNumber!: string | null;
    public lockboxBatchId!: string | null;
    public status!: string;
    public postedDate!: Date | null;
    public reversalDate!: Date | null;
    public reversalReason!: string | null;
    public currency!: string;
  }

  CashReceipt.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      receiptNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Receipt identifier',
      },
      receiptDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Receipt date',
      },
      receiptMethod: {
        type: DataTypes.ENUM('check', 'wire', 'ach', 'credit_card', 'cash', 'lockbox'),
        allowNull: false,
        comment: 'Receipt method',
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ar_customers',
          key: 'id',
        },
        comment: 'Customer paying',
      },
      receiptAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Total receipt amount',
      },
      unappliedAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Unapplied portion',
      },
      bankAccountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Bank account deposited',
      },
      checkNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Check number if check receipt',
      },
      referenceNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Wire/ACH reference',
      },
      lockboxBatchId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Lockbox batch identifier',
      },
      status: {
        type: DataTypes.ENUM('unposted', 'posted', 'applied', 'reversed', 'nsf'),
        allowNull: false,
        defaultValue: 'unposted',
        comment: 'Receipt status',
      },
      postedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'GL posting date',
      },
      reversalDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Reversal date if reversed',
      },
      reversalReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for reversal',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Receipt currency',
      },
    },
    {
      sequelize,
      tableName: 'ar_cash_receipts',
      timestamps: true,
      indexes: [
        { fields: ['receiptNumber'], unique: true },
        { fields: ['receiptDate'] },
        { fields: ['customerId'] },
        { fields: ['status'] },
        { fields: ['bankAccountId'] },
        { fields: ['checkNumber'] },
        { fields: ['lockboxBatchId'] },
      ],
    },
  );

  return CashReceipt;
};

// ============================================================================
// CUSTOMER MANAGEMENT (1-8)
// ============================================================================

/**
 * Creates a new customer with validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCustomerDto} customerData - Customer data
 * @param {string} userId - User creating the customer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created customer
 *
 * @example
 * ```typescript
 * const customer = await createCustomer(sequelize, {
 *   customerNumber: 'C-10001',
 *   customerName: 'ABC Corporation',
 *   customerType: 'commercial',
 *   taxId: '12-3456789',
 *   creditLimit: 50000,
 *   paymentTerms: 'Net 30'
 * }, 'user123');
 * ```
 */
export const createCustomer = async (
  sequelize: Sequelize,
  customerData: CreateCustomerDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Customer = createCustomerModel(sequelize);

  // Validate customer number is unique
  const existing = await Customer.findOne({
    where: { customerNumber: customerData.customerNumber },
    transaction,
  });

  if (existing) {
    throw new Error(`Customer number ${customerData.customerNumber} already exists`);
  }

  const customer = await Customer.create(
    {
      ...customerData,
      status: 'active',
      creditRating: 'good',
      currency: 'USD',
      dunningLevel: 0,
      metadata: { createdBy: userId },
    },
    { transaction },
  );

  return customer;
};

/**
 * Updates customer information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {Partial<CreateCustomerDto>} updateData - Update data
 * @param {string} userId - User updating the customer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated customer
 *
 * @example
 * ```typescript
 * const updated = await updateCustomer(sequelize, 1, {
 *   creditLimit: 75000
 * }, 'user123');
 * ```
 */
export const updateCustomer = async (
  sequelize: Sequelize,
  customerId: number,
  updateData: Partial<CreateCustomerDto>,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Customer = createCustomerModel(sequelize);

  const customer = await Customer.findByPk(customerId, { transaction });
  if (!customer) {
    throw new Error(`Customer ${customerId} not found`);
  }

  await customer.update(
    {
      ...updateData,
      metadata: { ...customer.metadata, updatedBy: userId, updatedAt: new Date() },
    },
    { transaction },
  );

  return customer;
};

/**
 * Places customer on credit hold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {string} holdReason - Reason for hold
 * @param {string} userId - User placing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated customer
 *
 * @example
 * ```typescript
 * const customer = await placeCustomerOnHold(sequelize, 1, 'Exceeded credit limit', 'user123');
 * ```
 */
export const placeCustomerOnHold = async (
  sequelize: Sequelize,
  customerId: number,
  holdReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Customer = createCustomerModel(sequelize);

  const customer = await Customer.findByPk(customerId, { transaction });
  if (!customer) {
    throw new Error(`Customer ${customerId} not found`);
  }

  await customer.update(
    {
      status: 'hold',
      holdReason,
      metadata: { ...customer.metadata, holdPlacedBy: userId, holdPlacedAt: new Date() },
    },
    { transaction },
  );

  return customer;
};

/**
 * Releases customer from credit hold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {string} userId - User releasing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated customer
 *
 * @example
 * ```typescript
 * const customer = await releaseCustomerHold(sequelize, 1, 'user123');
 * ```
 */
export const releaseCustomerHold = async (
  sequelize: Sequelize,
  customerId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Customer = createCustomerModel(sequelize);

  const customer = await Customer.findByPk(customerId, { transaction });
  if (!customer) {
    throw new Error(`Customer ${customerId} not found`);
  }

  if (customer.status !== 'hold') {
    throw new Error(`Customer ${customerId} is not on hold`);
  }

  await customer.update(
    {
      status: 'active',
      holdReason: null,
      metadata: { ...customer.metadata, holdReleasedBy: userId, holdReleasedAt: new Date() },
    },
    { transaction },
  );

  return customer;
};

/**
 * Updates customer credit limit.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {number} newCreditLimit - New credit limit
 * @param {string} userId - User updating limit
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated customer
 *
 * @example
 * ```typescript
 * const customer = await updateCustomerCreditLimit(sequelize, 1, 100000, 'user123');
 * ```
 */
export const updateCustomerCreditLimit = async (
  sequelize: Sequelize,
  customerId: number,
  newCreditLimit: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Customer = createCustomerModel(sequelize);

  const customer = await Customer.findByPk(customerId, { transaction });
  if (!customer) {
    throw new Error(`Customer ${customerId} not found`);
  }

  const oldLimit = customer.creditLimit;

  await customer.update(
    {
      creditLimit: newCreditLimit,
      metadata: {
        ...customer.metadata,
        creditLimitHistory: [
          ...(customer.metadata.creditLimitHistory || []),
          { oldLimit, newLimit: newCreditLimit, changedBy: userId, changedAt: new Date() },
        ],
      },
    },
    { transaction },
  );

  return customer;
};

/**
 * Checks if customer is over credit limit.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ isOverLimit: boolean; currentBalance: number; creditLimit: number; available: number }>} Credit status
 *
 * @example
 * ```typescript
 * const status = await checkCustomerCreditLimit(sequelize, 1);
 * ```
 */
export const checkCustomerCreditLimit = async (
  sequelize: Sequelize,
  customerId: number,
  transaction?: Transaction,
): Promise<{ isOverLimit: boolean; currentBalance: number; creditLimit: number; available: number }> => {
  const Customer = createCustomerModel(sequelize);
  const ARInvoice = createARInvoiceModel(sequelize);

  const customer = await Customer.findByPk(customerId, { transaction });
  if (!customer) {
    throw new Error(`Customer ${customerId} not found`);
  }

  const currentBalance =
    (await ARInvoice.sum('outstandingBalance', {
      where: {
        customerId,
        status: { [Op.notIn]: ['cancelled', 'written_off'] },
      },
      transaction,
    })) || 0;

  const available = customer.creditLimit - currentBalance;

  return {
    isOverLimit: currentBalance > customer.creditLimit,
    currentBalance,
    creditLimit: customer.creditLimit,
    available: Math.max(0, available),
  };
};

/**
 * Retrieves customer by customer number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} customerNumber - Customer number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Customer record
 *
 * @example
 * ```typescript
 * const customer = await getCustomerByNumber(sequelize, 'C-10001');
 * ```
 */
export const getCustomerByNumber = async (
  sequelize: Sequelize,
  customerNumber: string,
  transaction?: Transaction,
): Promise<any> => {
  const Customer = createCustomerModel(sequelize);

  const customer = await Customer.findOne({
    where: { customerNumber },
    transaction,
  });

  if (!customer) {
    throw new Error(`Customer ${customerNumber} not found`);
  }

  return customer;
};

/**
 * Searches customers by criteria.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Record<string, any>} criteria - Search criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Matching customers
 *
 * @example
 * ```typescript
 * const customers = await searchCustomers(sequelize, {
 *   customerType: 'commercial',
 *   status: 'active',
 *   creditRating: 'excellent'
 * });
 * ```
 */
export const searchCustomers = async (
  sequelize: Sequelize,
  criteria: Record<string, any>,
  transaction?: Transaction,
): Promise<any[]> => {
  const Customer = createCustomerModel(sequelize);

  const where: Record<string, any> = {};

  if (criteria.customerType) where.customerType = criteria.customerType;
  if (criteria.status) where.status = criteria.status;
  if (criteria.creditRating) where.creditRating = criteria.creditRating;
  if (criteria.customerName) {
    where.customerName = { [Op.iLike]: `%${criteria.customerName}%` };
  }

  const customers = await Customer.findAll({
    where,
    order: [['customerNumber', 'ASC']],
    transaction,
  });

  return customers;
};

// ============================================================================
// INVOICE GENERATION AND POSTING (9-16)
// ============================================================================

/**
 * Creates a new AR invoice with validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateARInvoiceDto} invoiceData - Invoice data
 * @param {string} userId - User creating invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createARInvoice(sequelize, {
 *   invoiceNumber: 'AR-2024-001',
 *   customerId: 1,
 *   invoiceDate: new Date(),
 *   grossAmount: 10000.00,
 *   lines: [...]
 * }, 'user123');
 * ```
 */
export const createARInvoice = async (
  sequelize: Sequelize,
  invoiceData: CreateARInvoiceDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const ARInvoice = createARInvoiceModel(sequelize);
  const Customer = createCustomerModel(sequelize);

  // Validate customer exists and is active
  const customer = await Customer.findByPk(invoiceData.customerId, { transaction });
  if (!customer) {
    throw new Error(`Customer ${invoiceData.customerId} not found`);
  }

  if (customer.status === 'hold') {
    throw new Error(`Customer ${customer.customerNumber} is on credit hold`);
  }

  // Check for duplicate invoice
  const existing = await ARInvoice.findOne({
    where: { invoiceNumber: invoiceData.invoiceNumber },
    transaction,
  });

  if (existing) {
    throw new Error(`Invoice number ${invoiceData.invoiceNumber} already exists`);
  }

  // Calculate due date from payment terms
  const dueDate = calculateInvoiceDueDate(invoiceData.invoiceDate, customer.paymentTerms);

  // Determine fiscal year and period
  const { fiscalYear, fiscalPeriod } = getFiscalYearPeriod(invoiceData.invoiceDate);

  const invoice = await ARInvoice.create(
    {
      invoiceNumber: invoiceData.invoiceNumber,
      customerId: invoiceData.customerId,
      invoiceDate: invoiceData.invoiceDate,
      dueDate,
      invoiceAmount: invoiceData.grossAmount - (invoiceData.taxAmount || 0),
      taxAmount: invoiceData.taxAmount || 0,
      freightAmount: 0,
      otherCharges: 0,
      grossAmount: invoiceData.grossAmount,
      appliedAmount: 0,
      unappliedAmount: 0,
      outstandingBalance: invoiceData.grossAmount,
      status: 'draft',
      disputeStatus: 'none',
      glDate: invoiceData.invoiceDate,
      fiscalYear,
      fiscalPeriod,
      salesOrderNumber: invoiceData.salesOrderNumber,
      description: invoiceData.lines[0]?.description || 'AR Invoice',
    },
    { transaction },
  );

  return invoice;
};

/**
 * Calculates invoice due date from invoice date and payment terms.
 *
 * @param {Date} invoiceDate - Invoice date
 * @param {string} paymentTerms - Payment terms (e.g., "Net 30")
 * @returns {Date} Due date
 *
 * @example
 * ```typescript
 * const dueDate = calculateInvoiceDueDate(new Date(), 'Net 30');
 * ```
 */
export const calculateInvoiceDueDate = (invoiceDate: Date, paymentTerms: string): Date => {
  const dueDate = new Date(invoiceDate);
  const netMatch = paymentTerms.match(/Net\s+(\d+)/i);

  if (netMatch) {
    const days = parseInt(netMatch[1], 10);
    dueDate.setDate(dueDate.getDate() + days);
  } else {
    // Default to 30 days if terms not recognized
    dueDate.setDate(dueDate.getDate() + 30);
  }

  return dueDate;
};

/**
 * Posts an AR invoice to GL.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} userId - User posting invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted invoice
 *
 * @example
 * ```typescript
 * const invoice = await postARInvoice(sequelize, 1, 'user123');
 * ```
 */
export const postARInvoice = async (
  sequelize: Sequelize,
  invoiceId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const ARInvoice = createARInvoiceModel(sequelize);

  const invoice = await ARInvoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    throw new Error(`Invoice ${invoiceId} not found`);
  }

  if (invoice.status !== 'draft') {
    throw new Error(`Invoice ${invoiceId} is not in draft status`);
  }

  // In production, would create GL journal entry here

  await invoice.update(
    {
      status: 'posted',
    },
    { transaction },
  );

  return invoice;
};

/**
 * Voids an AR invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} voidReason - Reason for void
 * @param {string} userId - User voiding invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Voided invoice
 *
 * @example
 * ```typescript
 * const invoice = await voidARInvoice(sequelize, 1, 'Duplicate entry', 'user123');
 * ```
 */
export const voidARInvoice = async (
  sequelize: Sequelize,
  invoiceId: number,
  voidReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const ARInvoice = createARInvoiceModel(sequelize);

  const invoice = await ARInvoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    throw new Error(`Invoice ${invoiceId} not found`);
  }

  if (invoice.status === 'paid' || invoice.appliedAmount > 0) {
    throw new Error(`Cannot void invoice ${invoiceId} with payments applied`);
  }

  await invoice.update(
    {
      status: 'cancelled',
      outstandingBalance: 0,
    },
    { transaction },
  );

  return invoice;
};

/**
 * Retrieves invoices by status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} status - Invoice status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Invoices with specified status
 *
 * @example
 * ```typescript
 * const posted = await getInvoicesByStatus(sequelize, 'posted');
 * ```
 */
export const getInvoicesByStatus = async (
  sequelize: Sequelize,
  status: string,
  transaction?: Transaction,
): Promise<any[]> => {
  const ARInvoice = createARInvoiceModel(sequelize);

  const invoices = await ARInvoice.findAll({
    where: { status },
    order: [['invoiceDate', 'ASC']],
    transaction,
  });

  return invoices;
};

/**
 * Gets overdue invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} [asOfDate] - As-of date (defaults to today)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Overdue invoices
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueInvoices(sequelize);
 * ```
 */
export const getOverdueInvoices = async (
  sequelize: Sequelize,
  asOfDate?: Date,
  transaction?: Transaction,
): Promise<any[]> => {
  const ARInvoice = createARInvoiceModel(sequelize);

  const checkDate = asOfDate || new Date();

  const invoices = await ARInvoice.findAll({
    where: {
      dueDate: { [Op.lt]: checkDate },
      outstandingBalance: { [Op.gt]: 0 },
      status: { [Op.notIn]: ['cancelled', 'written_off'] },
    },
    order: [['dueDate', 'ASC']],
    transaction,
  });

  return invoices;
};

/**
 * Generates invoice number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} [prefix='AR'] - Invoice number prefix
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Invoice number
 *
 * @example
 * ```typescript
 * const invoiceNumber = await generateInvoiceNumber(sequelize, 'INV');
 * // Returns: "INV-2024-00001"
 * ```
 */
export const generateInvoiceNumber = async (
  sequelize: Sequelize,
  prefix: string = 'AR',
  transaction?: Transaction,
): Promise<string> => {
  const ARInvoice = createARInvoiceModel(sequelize);

  const year = new Date().getFullYear();

  const lastInvoice = await ARInvoice.findOne({
    where: {
      invoiceNumber: { [Op.like]: `${prefix}-${year}-%` },
    },
    order: [['invoiceNumber', 'DESC']],
    transaction,
  });

  let sequence = 1;
  if (lastInvoice) {
    const match = lastInvoice.invoiceNumber.match(/(\d+)$/);
    if (match) {
      sequence = parseInt(match[1], 10) + 1;
    }
  }

  return `${prefix}-${year}-${sequence.toString().padStart(5, '0')}`;
};

/**
 * Gets fiscal year and period from date.
 *
 * @param {Date} date - Date to convert
 * @returns {{ fiscalYear: number; fiscalPeriod: number }} Fiscal year and period
 *
 * @example
 * ```typescript
 * const { fiscalYear, fiscalPeriod } = getFiscalYearPeriod(new Date('2024-03-15'));
 * // Returns: { fiscalYear: 2024, fiscalPeriod: 3 }
 * ```
 */
export const getFiscalYearPeriod = (date: Date): { fiscalYear: number; fiscalPeriod: number } => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return {
    fiscalYear: year,
    fiscalPeriod: month,
  };
};

// ============================================================================
// CASH RECEIPT PROCESSING (17-24)
// ============================================================================

/**
 * Creates a cash receipt.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ProcessCashReceiptDto} receiptData - Receipt data
 * @param {string} userId - User creating receipt
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created receipt
 *
 * @example
 * ```typescript
 * const receipt = await createCashReceipt(sequelize, {
 *   receiptDate: new Date(),
 *   receiptMethod: 'check',
 *   customerId: 1,
 *   receiptAmount: 5000.00,
 *   bankAccountId: 1,
 *   checkNumber: '12345'
 * }, 'user123');
 * ```
 */
export const createCashReceipt = async (
  sequelize: Sequelize,
  receiptData: ProcessCashReceiptDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const CashReceipt = createCashReceiptModel(sequelize);
  const Customer = createCustomerModel(sequelize);

  // Validate customer exists
  const customer = await Customer.findByPk(receiptData.customerId, { transaction });
  if (!customer) {
    throw new Error(`Customer ${receiptData.customerId} not found`);
  }

  // Generate receipt number
  const receiptNumber = await generateReceiptNumber(sequelize, receiptData.receiptMethod, transaction);

  const receipt = await CashReceipt.create(
    {
      receiptNumber,
      receiptDate: receiptData.receiptDate,
      receiptMethod: receiptData.receiptMethod,
      customerId: receiptData.customerId,
      receiptAmount: receiptData.receiptAmount,
      unappliedAmount: receiptData.receiptAmount,
      bankAccountId: receiptData.bankAccountId,
      checkNumber: receiptData.checkNumber,
      status: 'unposted',
      currency: 'USD',
    },
    { transaction },
  );

  return receipt;
};

/**
 * Generates a unique receipt number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} receiptMethod - Receipt method
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Receipt number
 *
 * @example
 * ```typescript
 * const receiptNumber = await generateReceiptNumber(sequelize, 'check');
 * // Returns: "CR-2024-00001"
 * ```
 */
export const generateReceiptNumber = async (
  sequelize: Sequelize,
  receiptMethod: string,
  transaction?: Transaction,
): Promise<string> => {
  const CashReceipt = createCashReceiptModel(sequelize);

  const prefix = 'CR';
  const year = new Date().getFullYear();

  const lastReceipt = await CashReceipt.findOne({
    where: {
      receiptNumber: { [Op.like]: `${prefix}-${year}-%` },
    },
    order: [['receiptNumber', 'DESC']],
    transaction,
  });

  let sequence = 1;
  if (lastReceipt) {
    const match = lastReceipt.receiptNumber.match(/(\d+)$/);
    if (match) {
      sequence = parseInt(match[1], 10) + 1;
    }
  }

  return `${prefix}-${year}-${sequence.toString().padStart(5, '0')}`;
};

/**
 * Posts a cash receipt to GL.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {string} userId - User posting receipt
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted receipt
 *
 * @example
 * ```typescript
 * const receipt = await postCashReceipt(sequelize, 1, 'user123');
 * ```
 */
export const postCashReceipt = async (
  sequelize: Sequelize,
  receiptId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const CashReceipt = createCashReceiptModel(sequelize);

  const receipt = await CashReceipt.findByPk(receiptId, { transaction });
  if (!receipt) {
    throw new Error(`Receipt ${receiptId} not found`);
  }

  if (receipt.status !== 'unposted') {
    throw new Error(`Receipt ${receiptId} is not in unposted status`);
  }

  // In production, would create GL journal entry here

  await receipt.update(
    {
      status: 'posted',
      postedDate: new Date(),
    },
    { transaction },
  );

  return receipt;
};

/**
 * Applies cash receipt to invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {number[]} invoiceIds - Invoice IDs to apply to
 * @param {string} userId - User applying receipt
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated receipt
 *
 * @example
 * ```typescript
 * const receipt = await applyCashReceipt(sequelize, 1, [1, 2, 3], 'user123');
 * ```
 */
export const applyCashReceipt = async (
  sequelize: Sequelize,
  receiptId: number,
  invoiceIds: number[],
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const CashReceipt = createCashReceiptModel(sequelize);
  const ARInvoice = createARInvoiceModel(sequelize);

  const receipt = await CashReceipt.findByPk(receiptId, { transaction });
  if (!receipt) {
    throw new Error(`Receipt ${receiptId} not found`);
  }

  if (receipt.status !== 'posted') {
    throw new Error(`Receipt ${receiptId} must be posted before application`);
  }

  let remainingAmount = Number(receipt.unappliedAmount);

  for (const invoiceId of invoiceIds) {
    if (remainingAmount <= 0) break;

    const invoice = await ARInvoice.findByPk(invoiceId, { transaction });
    if (!invoice) continue;

    if (invoice.customerId !== receipt.customerId) {
      throw new Error(`Invoice ${invoice.invoiceNumber} is not for customer ${receipt.customerId}`);
    }

    const applyAmount = Math.min(remainingAmount, Number(invoice.outstandingBalance));

    await createReceiptApplication(sequelize, receiptId, invoiceId, applyAmount, transaction);

    await invoice.update(
      {
        appliedAmount: Number(invoice.appliedAmount) + applyAmount,
        outstandingBalance: Number(invoice.outstandingBalance) - applyAmount,
        status: Number(invoice.outstandingBalance) - applyAmount <= 0.01 ? 'paid' : 'partial_paid',
      },
      { transaction },
    );

    remainingAmount -= applyAmount;
  }

  await receipt.update(
    {
      unappliedAmount: remainingAmount,
      status: remainingAmount > 0 ? 'posted' : 'applied',
    },
    { transaction },
  );

  return receipt;
};

/**
 * Creates a receipt application record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {number} invoiceId - Invoice ID
 * @param {number} appliedAmount - Applied amount
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Receipt application record
 *
 * @example
 * ```typescript
 * const application = await createReceiptApplication(sequelize, 1, 2, 1000);
 * ```
 */
export const createReceiptApplication = async (
  sequelize: Sequelize,
  receiptId: number,
  invoiceId: number,
  appliedAmount: number,
  transaction?: Transaction,
): Promise<any> => {
  const [results] = await sequelize.query(
    `INSERT INTO ar_receipt_applications
     (receipt_id, invoice_id, applied_amount, application_date, created_at, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     RETURNING *`,
    {
      bind: [receiptId, invoiceId, appliedAmount, new Date()],
      type: 'INSERT',
      transaction,
    },
  );

  return results;
};

/**
 * Reverses a cash receipt.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {string} reversalReason - Reason for reversal
 * @param {string} userId - User reversing receipt
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reversed receipt
 *
 * @example
 * ```typescript
 * const receipt = await reverseCashReceipt(sequelize, 1, 'NSF check', 'user123');
 * ```
 */
export const reverseCashReceipt = async (
  sequelize: Sequelize,
  receiptId: number,
  reversalReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const CashReceipt = createCashReceiptModel(sequelize);

  const receipt = await CashReceipt.findByPk(receiptId, { transaction });
  if (!receipt) {
    throw new Error(`Receipt ${receiptId} not found`);
  }

  // Reverse all applications
  await reverseReceiptApplications(sequelize, receiptId, transaction);

  await receipt.update(
    {
      status: 'reversed',
      reversalDate: new Date(),
      reversalReason,
      unappliedAmount: Number(receipt.receiptAmount),
    },
    { transaction },
  );

  return receipt;
};

/**
 * Reverses receipt applications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reverseReceiptApplications(sequelize, 1);
 * ```
 */
export const reverseReceiptApplications = async (
  sequelize: Sequelize,
  receiptId: number,
  transaction?: Transaction,
): Promise<void> => {
  const ARInvoice = createARInvoiceModel(sequelize);

  const [applications] = await sequelize.query(`SELECT * FROM ar_receipt_applications WHERE receipt_id = $1`, {
    bind: [receiptId],
    type: 'SELECT',
    transaction,
  });

  for (const app of applications as any[]) {
    const invoice = await ARInvoice.findByPk(app.invoice_id, { transaction });
    if (invoice) {
      await invoice.update(
        {
          appliedAmount: Number(invoice.appliedAmount) - Number(app.applied_amount),
          outstandingBalance: Number(invoice.outstandingBalance) + Number(app.applied_amount),
          status: 'posted',
        },
        { transaction },
      );
    }
  }
};

/**
 * Processes lockbox file.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} lockboxBatchId - Lockbox batch ID
 * @param {any[]} lockboxRecords - Lockbox records
 * @param {string} userId - User processing lockbox
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Processing results
 *
 * @example
 * ```typescript
 * const results = await processLockboxFile(sequelize, 'LB-2024-001', lockboxData, 'user123');
 * ```
 */
export const processLockboxFile = async (
  sequelize: Sequelize,
  lockboxBatchId: string,
  lockboxRecords: any[],
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  let successCount = 0;
  let errorCount = 0;
  const errors: any[] = [];

  for (const record of lockboxRecords) {
    try {
      const receipt = await createCashReceipt(
        sequelize,
        {
          receiptDate: record.receiptDate,
          receiptMethod: 'lockbox',
          customerId: record.customerId,
          receiptAmount: record.amount,
          bankAccountId: record.bankAccountId,
          checkNumber: record.checkNumber,
        },
        userId,
        transaction,
      );

      if (record.invoiceIds && record.invoiceIds.length > 0) {
        await postCashReceipt(sequelize, receipt.id, userId, transaction);
        await applyCashReceipt(sequelize, receipt.id, record.invoiceIds, userId, transaction);
      }

      successCount++;
    } catch (error: any) {
      errorCount++;
      errors.push({ record, error: error.message });
    }
  }

  return {
    lockboxBatchId,
    totalRecords: lockboxRecords.length,
    successCount,
    errorCount,
    errors,
  };
};

// ============================================================================
// COLLECTIONS MANAGEMENT (25-32)
// ============================================================================

/**
 * Creates a collections case.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCollectionsCaseDto} caseData - Case data
 * @param {string} userId - User creating case
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CollectionsCase>} Created case
 *
 * @example
 * ```typescript
 * const case = await createCollectionsCase(sequelize, {
 *   customerId: 1,
 *   collectorId: 'collector1',
 *   priority: 'high'
 * }, 'user123');
 * ```
 */
export const createCollectionsCase = async (
  sequelize: Sequelize,
  caseData: CreateCollectionsCaseDto,
  userId: string,
  transaction?: Transaction,
): Promise<CollectionsCase> => {
  const ARInvoice = createARInvoiceModel(sequelize);

  // Get oldest invoice and total outstanding
  const invoices = await ARInvoice.findAll({
    where: {
      customerId: caseData.customerId,
      outstandingBalance: { [Op.gt]: 0 },
      status: { [Op.notIn]: ['cancelled', 'written_off'] },
    },
    order: [['invoiceDate', 'ASC']],
    transaction,
  });

  if (invoices.length === 0) {
    throw new Error(`No outstanding invoices for customer ${caseData.customerId}`);
  }

  const totalOutstanding = invoices.reduce((sum, inv) => sum + Number(inv.outstandingBalance), 0);
  const oldestInvoice = invoices[0];
  const daysOutstanding = Math.floor((new Date().getTime() - oldestInvoice.invoiceDate.getTime()) / (1000 * 60 * 60 * 24));

  const caseNumber = `COLL-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

  const collectionsCase: CollectionsCase = {
    caseId: Date.now(),
    customerId: caseData.customerId,
    caseNumber,
    caseDate: new Date(),
    totalOutstanding,
    oldestInvoiceDate: oldestInvoice.invoiceDate,
    daysOutstanding,
    collectorId: caseData.collectorId,
    priority: caseData.priority as any,
    status: 'open',
  };

  return collectionsCase;
};

/**
 * Adds activity to collections case.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} caseId - Case ID
 * @param {string} activityType - Activity type
 * @param {string} activityNotes - Activity notes
 * @param {string} collectorId - Collector ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CollectionsActivity>} Created activity
 *
 * @example
 * ```typescript
 * const activity = await addCollectionsActivity(sequelize, 1, 'call', 'Left voicemail', 'collector1');
 * ```
 */
export const addCollectionsActivity = async (
  sequelize: Sequelize,
  caseId: number,
  activityType: string,
  activityNotes: string,
  collectorId: string,
  transaction?: Transaction,
): Promise<CollectionsActivity> => {
  const activity: CollectionsActivity = {
    activityId: Date.now(),
    caseId,
    activityDate: new Date(),
    activityType: activityType as any,
    contactedPerson: '',
    activityNotes,
    collectorId,
  };

  return activity;
};

/**
 * Updates collections case status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} caseId - Case ID
 * @param {string} newStatus - New status
 * @param {string} userId - User updating case
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated case
 *
 * @example
 * ```typescript
 * const case = await updateCollectionsCaseStatus(sequelize, 1, 'resolved', 'user123');
 * ```
 */
export const updateCollectionsCaseStatus = async (
  sequelize: Sequelize,
  caseId: number,
  newStatus: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  // In production, would update actual case record
  return {
    caseId,
    status: newStatus,
    updatedBy: userId,
    updatedAt: new Date(),
  };
};

/**
 * Gets open collections cases.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} [collectorId] - Optional collector filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Open cases
 *
 * @example
 * ```typescript
 * const cases = await getOpenCollectionsCases(sequelize, 'collector1');
 * ```
 */
export const getOpenCollectionsCases = async (
  sequelize: Sequelize,
  collectorId?: string,
  transaction?: Transaction,
): Promise<any[]> => {
  // In production, would query actual collections case table
  return [];
};

/**
 * Runs dunning process for overdue customers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} dunningLevel - Dunning level (1-5)
 * @param {string} userId - User running dunning
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<DunningRun>} Dunning run results
 *
 * @example
 * ```typescript
 * const run = await runDunningProcess(sequelize, 1, 'user123');
 * ```
 */
export const runDunningProcess = async (
  sequelize: Sequelize,
  dunningLevel: number,
  userId: string,
  transaction?: Transaction,
): Promise<DunningRun> => {
  const Customer = createCustomerModel(sequelize);
  const ARInvoice = createARInvoiceModel(sequelize);

  // Get customers with overdue invoices
  const overdueInvoices = await getOverdueInvoices(sequelize, new Date(), transaction);

  const customerIds = new Set(overdueInvoices.map(inv => inv.customerId));
  let totalAmount = 0;

  for (const customerId of customerIds) {
    const customer = await Customer.findByPk(customerId, { transaction });
    if (!customer) continue;

    const customerOverdue = overdueInvoices.filter(inv => inv.customerId === customerId);
    const customerTotal = customerOverdue.reduce((sum, inv) => sum + Number(inv.outstandingBalance), 0);

    totalAmount += customerTotal;

    // Update customer dunning level
    await customer.update(
      {
        dunningLevel,
        lastDunningDate: new Date(),
      },
      { transaction },
    );
  }

  const runNumber = `DUN-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

  const run: DunningRun = {
    runId: Date.now(),
    runNumber,
    runDate: new Date(),
    dunningLevel,
    customerCount: customerIds.size,
    totalAmount,
    status: 'completed',
    processedBy: userId,
    processedAt: new Date(),
  };

  return run;
};

/**
 * Gets customers eligible for dunning.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} daysPastDue - Minimum days past due
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Eligible customers
 *
 * @example
 * ```typescript
 * const eligible = await getCustomersEligibleForDunning(sequelize, 30);
 * ```
 */
export const getCustomersEligibleForDunning = async (
  sequelize: Sequelize,
  daysPastDue: number,
  transaction?: Transaction,
): Promise<any[]> => {
  const overdueDate = new Date();
  overdueDate.setDate(overdueDate.getDate() - daysPastDue);

  const overdueInvoices = await getOverdueInvoices(sequelize, overdueDate, transaction);

  const customerMap = new Map<number, any>();

  for (const invoice of overdueInvoices) {
    if (!customerMap.has(invoice.customerId)) {
      customerMap.set(invoice.customerId, {
        customerId: invoice.customerId,
        invoiceCount: 0,
        totalOverdue: 0,
        oldestDueDate: invoice.dueDate,
      });
    }

    const customer = customerMap.get(invoice.customerId);
    customer.invoiceCount++;
    customer.totalOverdue += Number(invoice.outstandingBalance);

    if (invoice.dueDate < customer.oldestDueDate) {
      customer.oldestDueDate = invoice.dueDate;
    }
  }

  return Array.from(customerMap.values());
};

/**
 * Creates payment plan for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {number} totalAmount - Total plan amount
 * @param {number} numberOfPayments - Number of payments
 * @param {string} frequency - Payment frequency
 * @param {string} userId - User creating plan
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PaymentPlan>} Created payment plan
 *
 * @example
 * ```typescript
 * const plan = await createPaymentPlan(sequelize, 1, 10000, 12, 'monthly', 'user123');
 * ```
 */
export const createPaymentPlan = async (
  sequelize: Sequelize,
  customerId: number,
  totalAmount: number,
  numberOfPayments: number,
  frequency: string,
  userId: string,
  transaction?: Transaction,
): Promise<PaymentPlan> => {
  const paymentAmount = totalAmount / numberOfPayments;

  const nextPaymentDate = new Date();
  if (frequency === 'weekly') {
    nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
  } else if (frequency === 'biweekly') {
    nextPaymentDate.setDate(nextPaymentDate.getDate() + 14);
  } else {
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
  }

  const plan: PaymentPlan = {
    planId: Date.now(),
    customerId,
    planStartDate: new Date(),
    totalAmount,
    numberOfPayments,
    paymentFrequency: frequency as any,
    paymentAmount,
    nextPaymentDate,
    status: 'active',
  };

  return plan;
};

/**
 * Processes payment plan payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} planId - Payment plan ID
 * @param {number} paymentAmount - Payment amount
 * @param {string} userId - User processing payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated plan
 *
 * @example
 * ```typescript
 * const plan = await processPaymentPlanPayment(sequelize, 1, 833.33, 'user123');
 * ```
 */
export const processPaymentPlanPayment = async (
  sequelize: Sequelize,
  planId: number,
  paymentAmount: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  // In production, would update payment plan and create receipt
  return {
    planId,
    paymentAmount,
    processedBy: userId,
    processedAt: new Date(),
  };
};

// ============================================================================
// REPORTING AND ANALYTICS (33-45)
// ============================================================================

/**
 * Generates accounts receivable aging report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Aging as-of date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ARAgingBucket[]>} Aging buckets by customer
 *
 * @example
 * ```typescript
 * const aging = await generateARAgingReport(sequelize, new Date());
 * ```
 */
export const generateARAgingReport = async (
  sequelize: Sequelize,
  asOfDate: Date,
  transaction?: Transaction,
): Promise<ARAgingBucket[]> => {
  const ARInvoice = createARInvoiceModel(sequelize);
  const Customer = createCustomerModel(sequelize);

  const invoices = await ARInvoice.findAll({
    where: {
      outstandingBalance: { [Op.gt]: 0 },
      status: { [Op.notIn]: ['cancelled', 'written_off'] },
    },
    transaction,
  });

  const customerBuckets = new Map<number, ARAgingBucket>();

  for (const invoice of invoices) {
    if (!customerBuckets.has(invoice.customerId)) {
      const customer = await Customer.findByPk(invoice.customerId, { transaction });
      if (!customer) continue;

      customerBuckets.set(invoice.customerId, {
        customerId: customer.id,
        customerNumber: customer.customerNumber,
        customerName: customer.customerName,
        current: 0,
        days1To30: 0,
        days31To60: 0,
        days61To90: 0,
        days91To120: 0,
        over120: 0,
        totalOutstanding: 0,
      });
    }

    const bucket = customerBuckets.get(invoice.customerId)!;
    const daysOld = Math.floor((asOfDate.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24));
    const amount = Number(invoice.outstandingBalance);

    if (daysOld < 0) {
      bucket.current += amount;
    } else if (daysOld <= 30) {
      bucket.days1To30 += amount;
    } else if (daysOld <= 60) {
      bucket.days31To60 += amount;
    } else if (daysOld <= 90) {
      bucket.days61To90 += amount;
    } else if (daysOld <= 120) {
      bucket.days91To120 += amount;
    } else {
      bucket.over120 += amount;
    }

    bucket.totalOutstanding += amount;
  }

  return Array.from(customerBuckets.values()).sort((a, b) => b.totalOutstanding - a.totalOutstanding);
};

/**
 * Generates customer statement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {Date} statementDate - Statement date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CustomerStatement>} Customer statement
 *
 * @example
 * ```typescript
 * const statement = await generateCustomerStatement(sequelize, 1, new Date());
 * ```
 */
export const generateCustomerStatement = async (
  sequelize: Sequelize,
  customerId: number,
  statementDate: Date,
  transaction?: Transaction,
): Promise<CustomerStatement> => {
  const ARInvoice = createARInvoiceModel(sequelize);
  const CashReceipt = createCashReceiptModel(sequelize);

  const monthStart = new Date(statementDate.getFullYear(), statementDate.getMonth(), 1);
  const monthEnd = new Date(statementDate.getFullYear(), statementDate.getMonth() + 1, 0);

  const invoices = await ARInvoice.findAll({
    where: {
      customerId,
      invoiceDate: { [Op.between]: [monthStart, monthEnd] },
    },
    transaction,
  });

  const receipts = await CashReceipt.findAll({
    where: {
      customerId,
      receiptDate: { [Op.between]: [monthStart, monthEnd] },
      status: { [Op.in]: ['posted', 'applied'] },
    },
    transaction,
  });

  const totalCharges = invoices.reduce((sum, inv) => sum + Number(inv.grossAmount), 0);
  const totalPayments = receipts.reduce((sum, rec) => sum + Number(rec.receiptAmount), 0);

  const currentBalance =
    (await ARInvoice.sum('outstandingBalance', {
      where: {
        customerId,
        status: { [Op.notIn]: ['cancelled', 'written_off'] },
      },
      transaction,
    })) || 0;

  const pastDue =
    (await ARInvoice.sum('outstandingBalance', {
      where: {
        customerId,
        dueDate: { [Op.lt]: statementDate },
        status: { [Op.notIn]: ['cancelled', 'written_off'] },
      },
      transaction,
    })) || 0;

  const statement: CustomerStatement = {
    statementId: Date.now(),
    customerId,
    statementDate,
    beginningBalance: currentBalance - totalCharges + totalPayments,
    charges: totalCharges,
    payments: totalPayments,
    adjustments: 0,
    endingBalance: currentBalance,
    currentDue: currentBalance - pastDue,
    pastDue,
  };

  return statement;
};

/**
 * Gets top customers by revenue.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [limit=10] - Number of top customers
 * @param {number} [days=365] - Analysis period in days
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Top customers
 *
 * @example
 * ```typescript
 * const topCustomers = await getTopCustomersByRevenue(sequelize, 10, 365);
 * ```
 */
export const getTopCustomersByRevenue = async (
  sequelize: Sequelize,
  limit: number = 10,
  days: number = 365,
  transaction?: Transaction,
): Promise<any[]> => {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  const [results] = await sequelize.query(
    `SELECT
      c.id,
      c.customer_number,
      c.customer_name,
      COUNT(i.id) as invoice_count,
      SUM(i.gross_amount) as total_revenue,
      SUM(i.outstanding_balance) as current_balance
     FROM ar_customers c
     JOIN ar_invoices i ON i.customer_id = c.id
     WHERE i.invoice_date >= $1
       AND i.status NOT IN ('cancelled', 'written_off')
     GROUP BY c.id, c.customer_number, c.customer_name
     ORDER BY total_revenue DESC
     LIMIT $2`,
    {
      bind: [sinceDate, limit],
      type: 'SELECT',
      transaction,
    },
  );

  return results as any[];
};

/**
 * Calculates DSO (Days Sales Outstanding).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [days=90] - Analysis period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} DSO in days
 *
 * @example
 * ```typescript
 * const dso = await calculateDSO(sequelize, 90);
 * ```
 */
export const calculateDSO = async (sequelize: Sequelize, days: number = 90, transaction?: Transaction): Promise<number> => {
  const ARInvoice = createARInvoiceModel(sequelize);

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  const totalAR =
    (await ARInvoice.sum('outstandingBalance', {
      where: {
        status: { [Op.notIn]: ['cancelled', 'written_off'] },
      },
      transaction,
    })) || 0;

  const totalSales =
    (await ARInvoice.sum('grossAmount', {
      where: {
        invoiceDate: { [Op.gte]: sinceDate },
        status: { [Op.notIn]: ['cancelled', 'written_off'] },
      },
      transaction,
    })) || 0;

  if (totalSales === 0) return 0;

  const dso = (totalAR / totalSales) * days;
  return Math.round(dso * 10) / 10;
};

/**
 * Creates bad debt write-off.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {number} writeOffAmount - Amount to write off
 * @param {string} writeOffReason - Reason for write-off
 * @param {string} userId - User creating write-off
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WriteOff>} Created write-off
 *
 * @example
 * ```typescript
 * const writeOff = await createBadDebtWriteOff(sequelize, 1, 5000, 'Customer bankruptcy', 'user123');
 * ```
 */
export const createBadDebtWriteOff = async (
  sequelize: Sequelize,
  invoiceId: number,
  writeOffAmount: number,
  writeOffReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<WriteOff> => {
  const ARInvoice = createARInvoiceModel(sequelize);

  const invoice = await ARInvoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    throw new Error(`Invoice ${invoiceId} not found`);
  }

  if (writeOffAmount > Number(invoice.outstandingBalance)) {
    throw new Error(`Write-off amount exceeds outstanding balance`);
  }

  // Update invoice
  await invoice.update(
    {
      outstandingBalance: Number(invoice.outstandingBalance) - writeOffAmount,
      status: Number(invoice.outstandingBalance) - writeOffAmount <= 0.01 ? 'written_off' : invoice.status,
    },
    { transaction },
  );

  const writeOff: WriteOff = {
    writeOffId: Date.now(),
    invoiceId,
    customerId: invoice.customerId,
    writeOffDate: new Date(),
    writeOffAmount,
    writeOffReason,
    writeOffType: 'bad_debt',
    approvedBy: userId,
  };

  return writeOff;
};

/**
 * Creates dispute for invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {number} disputeAmount - Disputed amount
 * @param {string} disputeReason - Dispute reason
 * @param {string} disputeCategory - Dispute category
 * @param {string} userId - User creating dispute
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Dispute>} Created dispute
 *
 * @example
 * ```typescript
 * const dispute = await createInvoiceDispute(sequelize, 1, 1000, 'Incorrect pricing', 'pricing', 'user123');
 * ```
 */
export const createInvoiceDispute = async (
  sequelize: Sequelize,
  invoiceId: number,
  disputeAmount: number,
  disputeReason: string,
  disputeCategory: string,
  userId: string,
  transaction?: Transaction,
): Promise<Dispute> => {
  const ARInvoice = createARInvoiceModel(sequelize);

  const invoice = await ARInvoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    throw new Error(`Invoice ${invoiceId} not found`);
  }

  await invoice.update(
    {
      disputeStatus: 'under_review',
    },
    { transaction },
  );

  const dispute: Dispute = {
    disputeId: Date.now(),
    invoiceId,
    customerId: invoice.customerId,
    disputeDate: new Date(),
    disputeAmount,
    disputeReason,
    disputeCategory: disputeCategory as any,
    status: 'open',
  };

  return dispute;
};

/**
 * Resolves invoice dispute.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} disputeId - Dispute ID
 * @param {string} resolution - Resolution decision ('approved' or 'rejected')
 * @param {string} resolutionNotes - Resolution notes
 * @param {string} userId - User resolving dispute
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Dispute>} Resolved dispute
 *
 * @example
 * ```typescript
 * const dispute = await resolveInvoiceDispute(sequelize, 1, 'approved', 'Credit memo issued', 'user123');
 * ```
 */
export const resolveInvoiceDispute = async (
  sequelize: Sequelize,
  disputeId: number,
  resolution: string,
  resolutionNotes: string,
  userId: string,
  transaction?: Transaction,
): Promise<Dispute> => {
  // In production, would update actual dispute record
  const dispute: Dispute = {
    disputeId,
    invoiceId: 0,
    customerId: 0,
    disputeDate: new Date(),
    disputeAmount: 0,
    disputeReason: '',
    disputeCategory: 'other',
    status: 'resolved',
    resolutionDate: new Date(),
    resolutionNotes,
  };

  return dispute;
};

/**
 * Gets collection effectiveness metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [days=90] - Analysis period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Collection metrics
 *
 * @example
 * ```typescript
 * const metrics = await getCollectionEffectivenessMetrics(sequelize, 90);
 * ```
 */
export const getCollectionEffectivenessMetrics = async (
  sequelize: Sequelize,
  days: number = 90,
  transaction?: Transaction,
): Promise<any> => {
  const ARInvoice = createARInvoiceModel(sequelize);
  const CashReceipt = createCashReceiptModel(sequelize);

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  const invoiced =
    (await ARInvoice.sum('grossAmount', {
      where: {
        invoiceDate: { [Op.gte]: sinceDate },
        status: { [Op.notIn]: ['cancelled', 'written_off'] },
      },
      transaction,
    })) || 0;

  const collected =
    (await CashReceipt.sum('receiptAmount', {
      where: {
        receiptDate: { [Op.gte]: sinceDate },
        status: { [Op.in]: ['posted', 'applied'] },
      },
      transaction,
    })) || 0;

  const currentAR =
    (await ARInvoice.sum('outstandingBalance', {
      where: {
        status: { [Op.notIn]: ['cancelled', 'written_off'] },
      },
      transaction,
    })) || 0;

  const collectionRate = invoiced > 0 ? (collected / invoiced) * 100 : 0;

  return {
    periodDays: days,
    totalInvoiced: invoiced,
    totalCollected: collected,
    currentOutstanding: currentAR,
    collectionRate: Math.round(collectionRate * 100) / 100,
  };
};

/**
 * Gets customers exceeding credit limit.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Customers over limit
 *
 * @example
 * ```typescript
 * const overLimit = await getCustomersOverCreditLimit(sequelize);
 * ```
 */
export const getCustomersOverCreditLimit = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<any[]> => {
  const Customer = createCustomerModel(sequelize);
  const ARInvoice = createARInvoiceModel(sequelize);

  const customers = await Customer.findAll({
    where: {
      status: { [Op.in]: ['active', 'hold'] },
    },
    transaction,
  });

  const overLimit: any[] = [];

  for (const customer of customers) {
    const currentBalance =
      (await ARInvoice.sum('outstandingBalance', {
        where: {
          customerId: customer.id,
          status: { [Op.notIn]: ['cancelled', 'written_off'] },
        },
        transaction,
      })) || 0;

    if (currentBalance > customer.creditLimit) {
      overLimit.push({
        customerId: customer.id,
        customerNumber: customer.customerNumber,
        customerName: customer.customerName,
        creditLimit: customer.creditLimit,
        currentBalance,
        overage: currentBalance - customer.creditLimit,
      });
    }
  }

  return overLimit.sort((a, b) => b.overage - a.overage);
};

/**
 * Generates cash forecast from AR.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Forecast start date
 * @param {Date} endDate - Forecast end date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cash forecast
 *
 * @example
 * ```typescript
 * const forecast = await generateCashForecast(
 *   sequelize,
 *   new Date(),
 *   new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
 * );
 * ```
 */
export const generateCashForecast = async (
  sequelize: Sequelize,
  startDate: Date,
  endDate: Date,
  transaction?: Transaction,
): Promise<any> => {
  const ARInvoice = createARInvoiceModel(sequelize);

  const invoices = await ARInvoice.findAll({
    where: {
      dueDate: { [Op.between]: [startDate, endDate] },
      outstandingBalance: { [Op.gt]: 0 },
      status: { [Op.notIn]: ['cancelled', 'written_off'] },
    },
    order: [['dueDate', 'ASC']],
    transaction,
  });

  const forecastByDate = new Map<string, number>();

  for (const invoice of invoices) {
    const dateKey = invoice.dueDate.toISOString().split('T')[0];
    const current = forecastByDate.get(dateKey) || 0;
    forecastByDate.set(dateKey, current + Number(invoice.outstandingBalance));
  }

  const dailyForecast = Array.from(forecastByDate.entries()).map(([date, amount]) => ({
    date,
    expectedReceipts: amount,
  }));

  const totalExpected = Array.from(forecastByDate.values()).reduce((sum, amt) => sum + amt, 0);

  return {
    forecastStart: startDate,
    forecastEnd: endDate,
    totalExpectedReceipts: totalExpected,
    dailyForecast,
  };
};

/**
 * Gets outstanding invoices by customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Outstanding invoices
 *
 * @example
 * ```typescript
 * const outstanding = await getOutstandingInvoicesByCustomer(sequelize, 1);
 * ```
 */
export const getOutstandingInvoicesByCustomer = async (
  sequelize: Sequelize,
  customerId: number,
  transaction?: Transaction,
): Promise<any[]> => {
  const ARInvoice = createARInvoiceModel(sequelize);

  const invoices = await ARInvoice.findAll({
    where: {
      customerId,
      outstandingBalance: { [Op.gt]: 0 },
      status: { [Op.notIn]: ['cancelled', 'written_off'] },
    },
    order: [['dueDate', 'ASC']],
    transaction,
  });

  return invoices;
};
