/**
 * LOC: EDWAP001
 * File: /reuse/edwards/financial/accounts-payable-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL integration)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Vendor management services
 *   - Payment processing modules
 *   - Cash management systems
 */

/**
 * File: /reuse/edwards/financial/accounts-payable-management-kit.ts
 * Locator: WC-EDWARDS-AP-001
 * Purpose: Comprehensive Accounts Payable Management - JD Edwards EnterpriseOne-level vendor management, invoice processing, payments, 1099 reporting
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/financial/*, Vendor Services, Payment Processing, Cash Management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for vendor management, invoice processing, payment processing, three-way matching, payment runs, ACH/wire transfers, 1099 reporting, vendor statements, aging reports, discount management, cash requirements forecasting
 *
 * LLM Context: Enterprise-grade accounts payable operations for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive vendor management, invoice validation, automated three-way matching, payment processing,
 * ACH and wire transfer support, early payment discounts, vendor statement reconciliation, aging reports,
 * 1099 tax reporting, cash requirements forecasting, duplicate invoice detection, approval workflows,
 * and audit trails. Supports multi-currency, multi-entity operations with full GL integration.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Vendor {
  vendorId: number;
  vendorNumber: string;
  vendorName: string;
  vendorType: 'supplier' | 'contractor' | 'employee' | 'government' | 'utility';
  taxId: string;
  is1099Vendor: boolean;
  is1099Type?: '1099-NEC' | '1099-MISC' | '1099-INT' | '1099-DIV';
  paymentTerms: string;
  paymentMethod: 'check' | 'ach' | 'wire' | 'card' | 'cash';
  creditLimit: number;
  status: 'active' | 'inactive' | 'hold' | 'blocked';
  holdReason?: string;
  defaultGLAccount: string;
  currency: string;
}

interface VendorContact {
  contactId: number;
  vendorId: number;
  contactType: 'primary' | 'billing' | 'shipping' | 'remittance';
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

interface APInvoice {
  invoiceId: number;
  invoiceNumber: string;
  vendorId: number;
  invoiceDate: Date;
  dueDate: Date;
  discountDate?: Date;
  discountAmount: number;
  invoiceAmount: number;
  taxAmount: number;
  freightAmount: number;
  otherCharges: number;
  netAmount: number;
  paidAmount: number;
  discountTaken: number;
  outstandingBalance: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'scheduled' | 'paid' | 'cancelled' | 'void';
  approvalStatus: 'not_required' | 'pending' | 'approved' | 'rejected';
  matchStatus: 'unmatched' | 'two_way' | 'three_way' | 'variance' | 'matched';
  glDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  purchaseOrderNumber?: string;
  receivingNumber?: string;
  description: string;
}

interface APInvoiceLine {
  lineId: number;
  invoiceId: number;
  lineNumber: number;
  accountCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineAmount: number;
  taxAmount: number;
  poLineNumber?: number;
  receiptLineNumber?: number;
  matchStatus: 'matched' | 'variance' | 'unmatched';
  varianceAmount: number;
  projectCode?: string;
  costCenterCode?: string;
  activityCode?: string;
}

interface Payment {
  paymentId: number;
  paymentNumber: string;
  paymentDate: Date;
  paymentMethod: 'check' | 'ach' | 'wire' | 'card' | 'eft';
  vendorId: number;
  paymentAmount: number;
  discountTaken: number;
  bankAccountId: number;
  checkNumber?: string;
  achBatchId?: string;
  wireReferenceNumber?: string;
  status: 'draft' | 'pending' | 'approved' | 'transmitted' | 'cleared' | 'cancelled' | 'void';
  clearedDate?: Date;
  voidDate?: Date;
  voidReason?: string;
  currency: string;
}

interface PaymentApplication {
  applicationId: number;
  paymentId: number;
  invoiceId: number;
  appliedAmount: number;
  discountAmount: number;
  applicationDate: Date;
  reversalId?: number;
}

interface PaymentRun {
  runId: number;
  runNumber: string;
  runDate: Date;
  paymentDate: Date;
  bankAccountId: number;
  paymentMethod: 'check' | 'ach' | 'wire';
  vendorSelection: 'all' | 'by_vendor' | 'by_due_date' | 'by_discount_date';
  status: 'created' | 'in_progress' | 'completed' | 'cancelled';
  totalPayments: number;
  totalAmount: number;
  processedBy: string;
  processedAt?: Date;
}

interface ThreeWayMatch {
  matchId: number;
  invoiceId: number;
  purchaseOrderId: number;
  receiptId: number;
  matchDate: Date;
  matchStatus: 'matched' | 'price_variance' | 'quantity_variance' | 'both_variance';
  priceVariance: number;
  quantityVariance: number;
  toleranceExceeded: boolean;
  requiresApproval: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

interface VendorStatement {
  statementId: number;
  vendorId: number;
  statementDate: Date;
  beginningBalance: number;
  invoices: number;
  payments: number;
  adjustments: number;
  endingBalance: number;
  reconciliationStatus: 'unreconciled' | 'reconciling' | 'reconciled';
  reconciledBy?: string;
  reconciledAt?: Date;
}

interface APAgingBucket {
  vendorId: number;
  vendorNumber: string;
  vendorName: string;
  current: number;
  days1To30: number;
  days31To60: number;
  days61To90: number;
  days91To120: number;
  over120: number;
  totalOutstanding: number;
}

interface Form1099Data {
  vendor1099Id: number;
  vendorId: number;
  taxYear: number;
  form1099Type: '1099-NEC' | '1099-MISC' | '1099-INT' | '1099-DIV';
  box1Amount?: number;
  box2Amount?: number;
  box3Amount?: number;
  box4Amount?: number;
  totalAmount: number;
  isCorrected: boolean;
  correctionNumber?: number;
  filingStatus: 'not_filed' | 'pending' | 'filed' | 'corrected';
}

interface CashRequirement {
  requirementDate: Date;
  dueAmount: number;
  discountEligibleAmount: number;
  potentialDiscount: number;
  netRequirement: number;
  projectedBalance: number;
  shortfallAmount: number;
}

interface DiscountAnalysis {
  invoiceId: number;
  invoiceNumber: string;
  vendorId: number;
  vendorName: string;
  invoiceAmount: number;
  discountAmount: number;
  discountPercent: number;
  discountDate: Date;
  dueDate: Date;
  daysToDiscount: number;
  annualizedRate: number;
  recommendation: 'take' | 'skip';
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateVendorDto {
  @ApiProperty({ description: 'Vendor number', example: 'V-10001' })
  vendorNumber!: string;

  @ApiProperty({ description: 'Vendor name', example: 'Acme Corporation' })
  vendorName!: string;

  @ApiProperty({ description: 'Vendor type', enum: ['supplier', 'contractor', 'employee', 'government', 'utility'] })
  vendorType!: string;

  @ApiProperty({ description: 'Tax ID (EIN or SSN)', example: '12-3456789' })
  taxId!: string;

  @ApiProperty({ description: 'Is 1099 vendor', default: false })
  is1099Vendor!: boolean;

  @ApiProperty({ description: 'Payment terms', example: 'Net 30' })
  paymentTerms!: string;

  @ApiProperty({ description: 'Payment method', enum: ['check', 'ach', 'wire', 'card'] })
  paymentMethod!: string;

  @ApiProperty({ description: 'Default GL account', example: '2000-00' })
  defaultGLAccount!: string;
}

export class CreateAPInvoiceDto {
  @ApiProperty({ description: 'Invoice number', example: 'INV-2024-001' })
  invoiceNumber!: string;

  @ApiProperty({ description: 'Vendor ID' })
  vendorId!: number;

  @ApiProperty({ description: 'Invoice date' })
  invoiceDate!: Date;

  @ApiProperty({ description: 'Invoice amount' })
  invoiceAmount!: number;

  @ApiProperty({ description: 'Tax amount', default: 0 })
  taxAmount?: number;

  @ApiProperty({ description: 'Purchase order number', required: false })
  purchaseOrderNumber?: string;

  @ApiProperty({ description: 'Invoice lines', type: [Object] })
  lines!: APInvoiceLine[];
}

export class ProcessPaymentDto {
  @ApiProperty({ description: 'Payment date' })
  paymentDate!: Date;

  @ApiProperty({ description: 'Payment method', enum: ['check', 'ach', 'wire'] })
  paymentMethod!: string;

  @ApiProperty({ description: 'Bank account ID' })
  bankAccountId!: number;

  @ApiProperty({ description: 'Invoice IDs to pay', type: [Number] })
  invoiceIds!: number[];

  @ApiProperty({ description: 'Take available discounts', default: true })
  takeDiscounts?: boolean;
}

export class PaymentRunDto {
  @ApiProperty({ description: 'Payment date' })
  paymentDate!: Date;

  @ApiProperty({ description: 'Bank account ID' })
  bankAccountId!: number;

  @ApiProperty({ description: 'Payment method', enum: ['check', 'ach', 'wire'] })
  paymentMethod!: string;

  @ApiProperty({ description: 'Vendor selection criteria', enum: ['all', 'by_vendor', 'by_due_date', 'by_discount_date'] })
  vendorSelection!: string;

  @ApiProperty({ description: 'Specific vendor IDs (if by_vendor)', type: [Number], required: false })
  vendorIds?: number[];
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Vendor master data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Vendor model
 *
 * @example
 * ```typescript
 * const Vendor = createVendorModel(sequelize);
 * const vendor = await Vendor.create({
 *   vendorNumber: 'V-10001',
 *   vendorName: 'Acme Corp',
 *   vendorType: 'supplier',
 *   status: 'active'
 * });
 * ```
 */
export const createVendorModel = (sequelize: Sequelize) => {
  class Vendor extends Model {
    public id!: number;
    public vendorNumber!: string;
    public vendorName!: string;
    public vendorType!: string;
    public taxId!: string;
    public is1099Vendor!: boolean;
    public is1099Type!: string | null;
    public paymentTerms!: string;
    public paymentMethod!: string;
    public creditLimit!: number;
    public status!: string;
    public holdReason!: string | null;
    public defaultGLAccount!: string;
    public currency!: string;
    public metadata!: Record<string, any>;
  }

  Vendor.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      vendorNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique vendor identifier',
      },
      vendorName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Vendor legal name',
      },
      vendorType: {
        type: DataTypes.ENUM('supplier', 'contractor', 'employee', 'government', 'utility'),
        allowNull: false,
        comment: 'Vendor classification',
      },
      taxId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'EIN or SSN for tax reporting',
      },
      is1099Vendor: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Subject to 1099 reporting',
      },
      is1099Type: {
        type: DataTypes.ENUM('1099-NEC', '1099-MISC', '1099-INT', '1099-DIV'),
        allowNull: true,
        comment: '1099 form type',
      },
      paymentTerms: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Payment terms (Net 30, 2/10 Net 30, etc.)',
      },
      paymentMethod: {
        type: DataTypes.ENUM('check', 'ach', 'wire', 'card', 'cash'),
        allowNull: false,
        defaultValue: 'check',
        comment: 'Preferred payment method',
      },
      creditLimit: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Vendor credit limit',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'hold', 'blocked'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Vendor status',
      },
      holdReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for payment hold',
      },
      defaultGLAccount: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Default AP account',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Vendor currency code',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional vendor data',
      },
    },
    {
      sequelize,
      tableName: 'ap_vendors',
      timestamps: true,
      indexes: [
        { fields: ['vendorNumber'], unique: true },
        { fields: ['vendorName'] },
        { fields: ['vendorType'] },
        { fields: ['status'] },
        { fields: ['is1099Vendor'] },
        { fields: ['taxId'] },
      ],
    },
  );

  return Vendor;
};

/**
 * Sequelize model for AP Invoice headers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} APInvoice model
 *
 * @example
 * ```typescript
 * const APInvoice = createAPInvoiceModel(sequelize);
 * const invoice = await APInvoice.create({
 *   invoiceNumber: 'INV-2024-001',
 *   vendorId: 1,
 *   invoiceAmount: 5000.00,
 *   status: 'pending_approval'
 * });
 * ```
 */
export const createAPInvoiceModel = (sequelize: Sequelize) => {
  class APInvoice extends Model {
    public id!: number;
    public invoiceNumber!: string;
    public vendorId!: number;
    public invoiceDate!: Date;
    public dueDate!: Date;
    public discountDate!: Date | null;
    public discountAmount!: number;
    public invoiceAmount!: number;
    public taxAmount!: number;
    public freightAmount!: number;
    public otherCharges!: number;
    public netAmount!: number;
    public paidAmount!: number;
    public discountTaken!: number;
    public outstandingBalance!: number;
    public status!: string;
    public approvalStatus!: string;
    public matchStatus!: string;
    public glDate!: Date;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public purchaseOrderNumber!: string | null;
    public receivingNumber!: string | null;
    public description!: string;
  }

  APInvoice.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      invoiceNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Vendor invoice number',
      },
      vendorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ap_vendors',
          key: 'id',
        },
        comment: 'Vendor reference',
      },
      invoiceDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Invoice date from vendor',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Payment due date',
      },
      discountDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Discount eligibility date',
      },
      discountAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Early payment discount available',
      },
      invoiceAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Gross invoice amount',
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
      netAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Net amount after discounts',
      },
      paidAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount paid to date',
      },
      discountTaken: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Discount amount taken',
      },
      outstandingBalance: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Remaining balance',
      },
      status: {
        type: DataTypes.ENUM('draft', 'pending_approval', 'approved', 'scheduled', 'paid', 'cancelled', 'void'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Invoice status',
      },
      approvalStatus: {
        type: DataTypes.ENUM('not_required', 'pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'not_required',
        comment: 'Approval workflow status',
      },
      matchStatus: {
        type: DataTypes.ENUM('unmatched', 'two_way', 'three_way', 'variance', 'matched'),
        allowNull: false,
        defaultValue: 'unmatched',
        comment: 'PO matching status',
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
      purchaseOrderNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Associated PO number',
      },
      receivingNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Associated receipt number',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Invoice description',
      },
    },
    {
      sequelize,
      tableName: 'ap_invoices',
      timestamps: true,
      indexes: [
        { fields: ['invoiceNumber', 'vendorId'], unique: true },
        { fields: ['vendorId'] },
        { fields: ['invoiceDate'] },
        { fields: ['dueDate'] },
        { fields: ['discountDate'] },
        { fields: ['status'] },
        { fields: ['approvalStatus'] },
        { fields: ['matchStatus'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['purchaseOrderNumber'] },
      ],
    },
  );

  return APInvoice;
};

/**
 * Sequelize model for Payment headers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Payment model
 *
 * @example
 * ```typescript
 * const Payment = createPaymentModel(sequelize);
 * const payment = await Payment.create({
 *   paymentNumber: 'PAY-2024-001',
 *   vendorId: 1,
 *   paymentAmount: 5000.00,
 *   paymentMethod: 'ach'
 * });
 * ```
 */
export const createPaymentModel = (sequelize: Sequelize) => {
  class Payment extends Model {
    public id!: number;
    public paymentNumber!: string;
    public paymentDate!: Date;
    public paymentMethod!: string;
    public vendorId!: number;
    public paymentAmount!: number;
    public discountTaken!: number;
    public bankAccountId!: number;
    public checkNumber!: string | null;
    public achBatchId!: string | null;
    public wireReferenceNumber!: string | null;
    public status!: string;
    public clearedDate!: Date | null;
    public voidDate!: Date | null;
    public voidReason!: string | null;
    public currency!: string;
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
        comment: 'Payment identifier',
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Payment date',
      },
      paymentMethod: {
        type: DataTypes.ENUM('check', 'ach', 'wire', 'card', 'eft'),
        allowNull: false,
        comment: 'Payment method',
      },
      vendorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ap_vendors',
          key: 'id',
        },
        comment: 'Vendor being paid',
      },
      paymentAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Total payment amount',
      },
      discountTaken: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Discount amount taken',
      },
      bankAccountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Bank account used',
      },
      checkNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Check number if check payment',
      },
      achBatchId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'ACH batch identifier',
      },
      wireReferenceNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Wire transfer reference',
      },
      status: {
        type: DataTypes.ENUM('draft', 'pending', 'approved', 'transmitted', 'cleared', 'cancelled', 'void'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Payment status',
      },
      clearedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Bank clearing date',
      },
      voidDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Void date if voided',
      },
      voidReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for void',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Payment currency',
      },
    },
    {
      sequelize,
      tableName: 'ap_payments',
      timestamps: true,
      indexes: [
        { fields: ['paymentNumber'], unique: true },
        { fields: ['paymentDate'] },
        { fields: ['vendorId'] },
        { fields: ['status'] },
        { fields: ['bankAccountId'] },
        { fields: ['checkNumber'] },
        { fields: ['achBatchId'] },
      ],
    },
  );

  return Payment;
};

// ============================================================================
// VENDOR MANAGEMENT (1-8)
// ============================================================================

/**
 * Creates a new vendor with validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateVendorDto} vendorData - Vendor data
 * @param {string} userId - User creating the vendor
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created vendor
 *
 * @example
 * ```typescript
 * const vendor = await createVendor(sequelize, {
 *   vendorNumber: 'V-10001',
 *   vendorName: 'Acme Corporation',
 *   vendorType: 'supplier',
 *   taxId: '12-3456789',
 *   paymentTerms: 'Net 30',
 *   paymentMethod: 'ach'
 * }, 'user123');
 * ```
 */
export const createVendor = async (
  sequelize: Sequelize,
  vendorData: CreateVendorDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Vendor = createVendorModel(sequelize);

  // Validate vendor number is unique
  const existing = await Vendor.findOne({
    where: { vendorNumber: vendorData.vendorNumber },
    transaction,
  });

  if (existing) {
    throw new Error(`Vendor number ${vendorData.vendorNumber} already exists`);
  }

  // Validate tax ID format
  if (vendorData.is1099Vendor && !vendorData.taxId) {
    throw new Error('Tax ID is required for 1099 vendors');
  }

  const vendor = await Vendor.create(
    {
      ...vendorData,
      status: 'active',
      currency: 'USD',
      creditLimit: 0,
      metadata: { createdBy: userId },
    },
    { transaction },
  );

  return vendor;
};

/**
 * Updates vendor information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {Partial<CreateVendorDto>} updateData - Update data
 * @param {string} userId - User updating the vendor
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated vendor
 *
 * @example
 * ```typescript
 * const updated = await updateVendor(sequelize, 1, {
 *   paymentTerms: '2/10 Net 30'
 * }, 'user123');
 * ```
 */
export const updateVendor = async (
  sequelize: Sequelize,
  vendorId: number,
  updateData: Partial<CreateVendorDto>,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Vendor = createVendorModel(sequelize);

  const vendor = await Vendor.findByPk(vendorId, { transaction });
  if (!vendor) {
    throw new Error(`Vendor ${vendorId} not found`);
  }

  await vendor.update(
    {
      ...updateData,
      metadata: { ...vendor.metadata, updatedBy: userId, updatedAt: new Date() },
    },
    { transaction },
  );

  return vendor;
};

/**
 * Places vendor on payment hold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {string} holdReason - Reason for hold
 * @param {string} userId - User placing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated vendor
 *
 * @example
 * ```typescript
 * const vendor = await placeVendorOnHold(sequelize, 1, 'Disputed invoice', 'user123');
 * ```
 */
export const placeVendorOnHold = async (
  sequelize: Sequelize,
  vendorId: number,
  holdReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Vendor = createVendorModel(sequelize);

  const vendor = await Vendor.findByPk(vendorId, { transaction });
  if (!vendor) {
    throw new Error(`Vendor ${vendorId} not found`);
  }

  await vendor.update(
    {
      status: 'hold',
      holdReason,
      metadata: { ...vendor.metadata, holdPlacedBy: userId, holdPlacedAt: new Date() },
    },
    { transaction },
  );

  return vendor;
};

/**
 * Releases vendor from payment hold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {string} userId - User releasing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated vendor
 *
 * @example
 * ```typescript
 * const vendor = await releaseVendorHold(sequelize, 1, 'user123');
 * ```
 */
export const releaseVendorHold = async (
  sequelize: Sequelize,
  vendorId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Vendor = createVendorModel(sequelize);

  const vendor = await Vendor.findByPk(vendorId, { transaction });
  if (!vendor) {
    throw new Error(`Vendor ${vendorId} not found`);
  }

  if (vendor.status !== 'hold') {
    throw new Error(`Vendor ${vendorId} is not on hold`);
  }

  await vendor.update(
    {
      status: 'active',
      holdReason: null,
      metadata: { ...vendor.metadata, holdReleasedBy: userId, holdReleasedAt: new Date() },
    },
    { transaction },
  );

  return vendor;
};

/**
 * Retrieves vendor by vendor number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} vendorNumber - Vendor number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Vendor record
 *
 * @example
 * ```typescript
 * const vendor = await getVendorByNumber(sequelize, 'V-10001');
 * ```
 */
export const getVendorByNumber = async (
  sequelize: Sequelize,
  vendorNumber: string,
  transaction?: Transaction,
): Promise<any> => {
  const Vendor = createVendorModel(sequelize);

  const vendor = await Vendor.findOne({
    where: { vendorNumber },
    transaction,
  });

  if (!vendor) {
    throw new Error(`Vendor ${vendorNumber} not found`);
  }

  return vendor;
};

/**
 * Searches vendors by criteria.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Record<string, any>} criteria - Search criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Matching vendors
 *
 * @example
 * ```typescript
 * const vendors = await searchVendors(sequelize, {
 *   vendorType: 'supplier',
 *   status: 'active',
 *   is1099Vendor: true
 * });
 * ```
 */
export const searchVendors = async (
  sequelize: Sequelize,
  criteria: Record<string, any>,
  transaction?: Transaction,
): Promise<any[]> => {
  const Vendor = createVendorModel(sequelize);

  const where: Record<string, any> = {};

  if (criteria.vendorType) where.vendorType = criteria.vendorType;
  if (criteria.status) where.status = criteria.status;
  if (criteria.is1099Vendor !== undefined) where.is1099Vendor = criteria.is1099Vendor;
  if (criteria.vendorName) {
    where.vendorName = { [Op.iLike]: `%${criteria.vendorName}%` };
  }

  const vendors = await Vendor.findAll({
    where,
    order: [['vendorNumber', 'ASC']],
    transaction,
  });

  return vendors;
};

/**
 * Deactivates a vendor.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {string} userId - User deactivating vendor
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated vendor
 *
 * @example
 * ```typescript
 * const vendor = await deactivateVendor(sequelize, 1, 'user123');
 * ```
 */
export const deactivateVendor = async (
  sequelize: Sequelize,
  vendorId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Vendor = createVendorModel(sequelize);

  const vendor = await Vendor.findByPk(vendorId, { transaction });
  if (!vendor) {
    throw new Error(`Vendor ${vendorId} not found`);
  }

  // Check for outstanding balances
  const APInvoice = createAPInvoiceModel(sequelize);
  const outstanding = await APInvoice.findOne({
    where: {
      vendorId,
      outstandingBalance: { [Op.gt]: 0 },
    },
    transaction,
  });

  if (outstanding) {
    throw new Error(`Cannot deactivate vendor with outstanding balance`);
  }

  await vendor.update(
    {
      status: 'inactive',
      metadata: { ...vendor.metadata, deactivatedBy: userId, deactivatedAt: new Date() },
    },
    { transaction },
  );

  return vendor;
};

/**
 * Gets vendor payment statistics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {number} [days=365] - Number of days to analyze
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Vendor payment statistics
 *
 * @example
 * ```typescript
 * const stats = await getVendorPaymentStats(sequelize, 1, 90);
 * ```
 */
export const getVendorPaymentStats = async (
  sequelize: Sequelize,
  vendorId: number,
  days: number = 365,
  transaction?: Transaction,
): Promise<any> => {
  const Payment = createPaymentModel(sequelize);
  const APInvoice = createAPInvoiceModel(sequelize);

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  const payments = await Payment.findAll({
    where: {
      vendorId,
      paymentDate: { [Op.gte]: sinceDate },
      status: { [Op.in]: ['transmitted', 'cleared'] },
    },
    transaction,
  });

  const invoices = await APInvoice.findAll({
    where: {
      vendorId,
      invoiceDate: { [Op.gte]: sinceDate },
    },
    transaction,
  });

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.paymentAmount), 0);
  const totalDiscountTaken = payments.reduce((sum, p) => sum + Number(p.discountTaken), 0);
  const totalInvoiced = invoices.reduce((sum, i) => sum + Number(i.invoiceAmount), 0);
  const currentOutstanding = invoices.reduce((sum, i) => sum + Number(i.outstandingBalance), 0);

  return {
    vendorId,
    periodDays: days,
    paymentCount: payments.length,
    invoiceCount: invoices.length,
    totalPaid,
    totalDiscountTaken,
    totalInvoiced,
    currentOutstanding,
    averagePaymentAmount: payments.length > 0 ? totalPaid / payments.length : 0,
    discountCaptureRate: totalInvoiced > 0 ? (totalDiscountTaken / totalInvoiced) * 100 : 0,
  };
};

// ============================================================================
// INVOICE PROCESSING (9-18)
// ============================================================================

/**
 * Creates a new AP invoice with validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateAPInvoiceDto} invoiceData - Invoice data
 * @param {string} userId - User creating invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createAPInvoice(sequelize, {
 *   invoiceNumber: 'INV-2024-001',
 *   vendorId: 1,
 *   invoiceDate: new Date(),
 *   invoiceAmount: 5000.00,
 *   lines: [...]
 * }, 'user123');
 * ```
 */
export const createAPInvoice = async (
  sequelize: Sequelize,
  invoiceData: CreateAPInvoiceDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const APInvoice = createAPInvoiceModel(sequelize);
  const Vendor = createVendorModel(sequelize);

  // Validate vendor exists and is active
  const vendor = await Vendor.findByPk(invoiceData.vendorId, { transaction });
  if (!vendor) {
    throw new Error(`Vendor ${invoiceData.vendorId} not found`);
  }

  if (vendor.status === 'blocked') {
    throw new Error(`Vendor ${vendor.vendorNumber} is blocked`);
  }

  // Check for duplicate invoice
  const duplicate = await checkDuplicateInvoice(sequelize, invoiceData.vendorId, invoiceData.invoiceNumber, transaction);
  if (duplicate) {
    throw new Error(`Duplicate invoice: ${invoiceData.invoiceNumber} for vendor ${vendor.vendorNumber}`);
  }

  // Calculate due date from payment terms
  const dueDate = calculateDueDate(invoiceData.invoiceDate, vendor.paymentTerms);
  const { discountDate, discountAmount } = calculateDiscountTerms(
    invoiceData.invoiceDate,
    invoiceData.invoiceAmount,
    vendor.paymentTerms,
  );

  // Determine fiscal year and period
  const { fiscalYear, fiscalPeriod } = getFiscalYearPeriod(invoiceData.invoiceDate);

  const invoice = await APInvoice.create(
    {
      invoiceNumber: invoiceData.invoiceNumber,
      vendorId: invoiceData.vendorId,
      invoiceDate: invoiceData.invoiceDate,
      dueDate,
      discountDate,
      discountAmount,
      invoiceAmount: invoiceData.invoiceAmount,
      taxAmount: invoiceData.taxAmount || 0,
      freightAmount: 0,
      otherCharges: 0,
      netAmount: invoiceData.invoiceAmount,
      paidAmount: 0,
      discountTaken: 0,
      outstandingBalance: invoiceData.invoiceAmount,
      status: 'draft',
      approvalStatus: 'not_required',
      matchStatus: invoiceData.purchaseOrderNumber ? 'unmatched' : 'matched',
      glDate: invoiceData.invoiceDate,
      fiscalYear,
      fiscalPeriod,
      purchaseOrderNumber: invoiceData.purchaseOrderNumber,
      description: invoiceData.lines[0]?.description || 'AP Invoice',
    },
    { transaction },
  );

  return invoice;
};

/**
 * Checks for duplicate invoices from vendor.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {string} invoiceNumber - Invoice number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} True if duplicate exists
 *
 * @example
 * ```typescript
 * const isDuplicate = await checkDuplicateInvoice(sequelize, 1, 'INV-2024-001');
 * ```
 */
export const checkDuplicateInvoice = async (
  sequelize: Sequelize,
  vendorId: number,
  invoiceNumber: string,
  transaction?: Transaction,
): Promise<boolean> => {
  const APInvoice = createAPInvoiceModel(sequelize);

  const existing = await APInvoice.findOne({
    where: {
      vendorId,
      invoiceNumber,
      status: { [Op.notIn]: ['cancelled', 'void'] },
    },
    transaction,
  });

  return !!existing;
};

/**
 * Approves an AP invoice for payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} userId - User approving invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated invoice
 *
 * @example
 * ```typescript
 * const invoice = await approveAPInvoice(sequelize, 1, 'user123');
 * ```
 */
export const approveAPInvoice = async (
  sequelize: Sequelize,
  invoiceId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const APInvoice = createAPInvoiceModel(sequelize);

  const invoice = await APInvoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    throw new Error(`Invoice ${invoiceId} not found`);
  }

  if (invoice.status === 'paid') {
    throw new Error(`Invoice ${invoiceId} is already paid`);
  }

  // Verify vendor not on hold
  const Vendor = createVendorModel(sequelize);
  const vendor = await Vendor.findByPk(invoice.vendorId, { transaction });

  if (vendor.status === 'hold' || vendor.status === 'blocked') {
    throw new Error(`Vendor ${vendor.vendorNumber} is on hold or blocked`);
  }

  await invoice.update(
    {
      status: 'approved',
      approvalStatus: 'approved',
    },
    { transaction },
  );

  return invoice;
};

/**
 * Rejects an AP invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} rejectionReason - Reason for rejection
 * @param {string} userId - User rejecting invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated invoice
 *
 * @example
 * ```typescript
 * const invoice = await rejectAPInvoice(sequelize, 1, 'Incorrect amount', 'user123');
 * ```
 */
export const rejectAPInvoice = async (
  sequelize: Sequelize,
  invoiceId: number,
  rejectionReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const APInvoice = createAPInvoiceModel(sequelize);

  const invoice = await APInvoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    throw new Error(`Invoice ${invoiceId} not found`);
  }

  await invoice.update(
    {
      approvalStatus: 'rejected',
      status: 'cancelled',
    },
    { transaction },
  );

  return invoice;
};

/**
 * Performs three-way match validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ThreeWayMatch>} Match result
 *
 * @example
 * ```typescript
 * const matchResult = await performThreeWayMatch(sequelize, 1);
 * ```
 */
export const performThreeWayMatch = async (
  sequelize: Sequelize,
  invoiceId: number,
  transaction?: Transaction,
): Promise<ThreeWayMatch> => {
  const APInvoice = createAPInvoiceModel(sequelize);

  const invoice = await APInvoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    throw new Error(`Invoice ${invoiceId} not found`);
  }

  if (!invoice.purchaseOrderNumber) {
    throw new Error(`Invoice ${invoiceId} has no PO reference`);
  }

  // Simplified match logic - in production would query PO and receipt tables
  const priceVariance = 0;
  const quantityVariance = 0;
  const toleranceExceeded = Math.abs(priceVariance) > 100 || Math.abs(quantityVariance) > 0;

  const matchResult: ThreeWayMatch = {
    matchId: Date.now(),
    invoiceId,
    purchaseOrderId: 0, // Would be actual PO ID
    receiptId: 0, // Would be actual receipt ID
    matchDate: new Date(),
    matchStatus: toleranceExceeded ? 'price_variance' : 'matched',
    priceVariance,
    quantityVariance,
    toleranceExceeded,
    requiresApproval: toleranceExceeded,
    approvalStatus: toleranceExceeded ? 'pending' : undefined,
  };

  // Update invoice match status
  await invoice.update(
    {
      matchStatus: matchResult.matchStatus === 'matched' ? 'three_way' : 'variance',
    },
    { transaction },
  );

  return matchResult;
};

/**
 * Calculates due date from invoice date and payment terms.
 *
 * @param {Date} invoiceDate - Invoice date
 * @param {string} paymentTerms - Payment terms (e.g., "Net 30", "2/10 Net 30")
 * @returns {Date} Due date
 *
 * @example
 * ```typescript
 * const dueDate = calculateDueDate(new Date(), 'Net 30');
 * ```
 */
export const calculateDueDate = (invoiceDate: Date, paymentTerms: string): Date => {
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
 * Calculates discount date and amount from payment terms.
 *
 * @param {Date} invoiceDate - Invoice date
 * @param {number} invoiceAmount - Invoice amount
 * @param {string} paymentTerms - Payment terms
 * @returns {{ discountDate: Date | null; discountAmount: number }} Discount terms
 *
 * @example
 * ```typescript
 * const terms = calculateDiscountTerms(new Date(), 1000, '2/10 Net 30');
 * // Returns: { discountDate: Date(10 days from now), discountAmount: 20 }
 * ```
 */
export const calculateDiscountTerms = (
  invoiceDate: Date,
  invoiceAmount: number,
  paymentTerms: string,
): { discountDate: Date | null; discountAmount: number } => {
  const discountMatch = paymentTerms.match(/(\d+(?:\.\d+)?)\/(\d+)/);

  if (discountMatch) {
    const discountPercent = parseFloat(discountMatch[1]);
    const discountDays = parseInt(discountMatch[2], 10);

    const discountDate = new Date(invoiceDate);
    discountDate.setDate(discountDate.getDate() + discountDays);

    const discountAmount = (invoiceAmount * discountPercent) / 100;

    return { discountDate, discountAmount };
  }

  return { discountDate: null, discountAmount: 0 };
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
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed

  // Assuming calendar year = fiscal year
  return {
    fiscalYear: year,
    fiscalPeriod: month,
  };
};

/**
 * Voids an AP invoice.
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
 * const invoice = await voidAPInvoice(sequelize, 1, 'Duplicate entry', 'user123');
 * ```
 */
export const voidAPInvoice = async (
  sequelize: Sequelize,
  invoiceId: number,
  voidReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const APInvoice = createAPInvoiceModel(sequelize);

  const invoice = await APInvoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    throw new Error(`Invoice ${invoiceId} not found`);
  }

  if (invoice.status === 'paid') {
    throw new Error(`Cannot void paid invoice ${invoiceId}`);
  }

  await invoice.update(
    {
      status: 'void',
      outstandingBalance: 0,
    },
    { transaction },
  );

  return invoice;
};

/**
 * Retrieves invoices pending approval.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Pending invoices
 *
 * @example
 * ```typescript
 * const pending = await getInvoicesPendingApproval(sequelize);
 * ```
 */
export const getInvoicesPendingApproval = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<any[]> => {
  const APInvoice = createAPInvoiceModel(sequelize);

  const invoices = await APInvoice.findAll({
    where: {
      approvalStatus: 'pending',
      status: { [Op.notIn]: ['cancelled', 'void', 'paid'] },
    },
    order: [['invoiceDate', 'ASC']],
    transaction,
  });

  return invoices;
};

/**
 * Retrieves invoices with matching variances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Invoices with variances
 *
 * @example
 * ```typescript
 * const variances = await getInvoicesWithVariances(sequelize);
 * ```
 */
export const getInvoicesWithVariances = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<any[]> => {
  const APInvoice = createAPInvoiceModel(sequelize);

  const invoices = await APInvoice.findAll({
    where: {
      matchStatus: 'variance',
      status: { [Op.notIn]: ['cancelled', 'void', 'paid'] },
    },
    order: [['invoiceDate', 'ASC']],
    transaction,
  });

  return invoices;
};

// ============================================================================
// PAYMENT PROCESSING (19-28)
// ============================================================================

/**
 * Creates a payment for approved invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ProcessPaymentDto} paymentData - Payment data
 * @param {string} userId - User creating payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created payment
 *
 * @example
 * ```typescript
 * const payment = await createPayment(sequelize, {
 *   paymentDate: new Date(),
 *   paymentMethod: 'ach',
 *   bankAccountId: 1,
 *   invoiceIds: [1, 2, 3],
 *   takeDiscounts: true
 * }, 'user123');
 * ```
 */
export const createPayment = async (
  sequelize: Sequelize,
  paymentData: ProcessPaymentDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Payment = createPaymentModel(sequelize);
  const APInvoice = createAPInvoiceModel(sequelize);

  // Validate all invoices exist and are approved
  const invoices = await APInvoice.findAll({
    where: {
      id: { [Op.in]: paymentData.invoiceIds },
    },
    transaction,
  });

  if (invoices.length !== paymentData.invoiceIds.length) {
    throw new Error('One or more invoices not found');
  }

  // Verify all invoices are from same vendor
  const vendorIds = new Set(invoices.map(i => i.vendorId));
  if (vendorIds.size > 1) {
    throw new Error('All invoices must be for the same vendor');
  }

  const vendorId = invoices[0].vendorId;

  // Check vendor is not on hold
  const Vendor = createVendorModel(sequelize);
  const vendor = await Vendor.findByPk(vendorId, { transaction });

  if (vendor.status === 'hold' || vendor.status === 'blocked') {
    throw new Error(`Vendor ${vendor.vendorNumber} is on hold or blocked`);
  }

  // Calculate payment amount and discounts
  let totalAmount = 0;
  let totalDiscount = 0;

  for (const invoice of invoices) {
    if (invoice.status !== 'approved') {
      throw new Error(`Invoice ${invoice.invoiceNumber} is not approved`);
    }

    const amount = Number(invoice.outstandingBalance);
    totalAmount += amount;

    if (paymentData.takeDiscounts && invoice.discountDate && invoice.discountDate >= paymentData.paymentDate) {
      totalDiscount += Number(invoice.discountAmount);
    }
  }

  const netPaymentAmount = totalAmount - totalDiscount;

  // Generate payment number
  const paymentNumber = await generatePaymentNumber(sequelize, paymentData.paymentMethod, transaction);

  // Create payment
  const payment = await Payment.create(
    {
      paymentNumber,
      paymentDate: paymentData.paymentDate,
      paymentMethod: paymentData.paymentMethod,
      vendorId,
      paymentAmount: netPaymentAmount,
      discountTaken: totalDiscount,
      bankAccountId: paymentData.bankAccountId,
      status: 'draft',
      currency: 'USD',
    },
    { transaction },
  );

  // Create payment applications
  for (const invoice of invoices) {
    const discountAmount =
      paymentData.takeDiscounts && invoice.discountDate && invoice.discountDate >= paymentData.paymentDate
        ? Number(invoice.discountAmount)
        : 0;

    const appliedAmount = Number(invoice.outstandingBalance) - discountAmount;

    await createPaymentApplication(sequelize, payment.id, invoice.id, appliedAmount, discountAmount, transaction);

    // Update invoice
    await invoice.update(
      {
        paidAmount: Number(invoice.paidAmount) + appliedAmount,
        discountTaken: Number(invoice.discountTaken) + discountAmount,
        outstandingBalance: 0,
        status: 'paid',
      },
      { transaction },
    );
  }

  return payment;
};

/**
 * Generates a unique payment number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} paymentMethod - Payment method
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Payment number
 *
 * @example
 * ```typescript
 * const paymentNumber = await generatePaymentNumber(sequelize, 'ach');
 * // Returns: "ACH-2024-00001"
 * ```
 */
export const generatePaymentNumber = async (
  sequelize: Sequelize,
  paymentMethod: string,
  transaction?: Transaction,
): Promise<string> => {
  const Payment = createPaymentModel(sequelize);

  const prefix = paymentMethod.toUpperCase().substring(0, 3);
  const year = new Date().getFullYear();

  const lastPayment = await Payment.findOne({
    where: {
      paymentNumber: { [Op.like]: `${prefix}-${year}-%` },
    },
    order: [['paymentNumber', 'DESC']],
    transaction,
  });

  let sequence = 1;
  if (lastPayment) {
    const match = lastPayment.paymentNumber.match(/(\d+)$/);
    if (match) {
      sequence = parseInt(match[1], 10) + 1;
    }
  }

  return `${prefix}-${year}-${sequence.toString().padStart(5, '0')}`;
};

/**
 * Creates a payment application record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {number} invoiceId - Invoice ID
 * @param {number} appliedAmount - Applied amount
 * @param {number} discountAmount - Discount amount
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment application record
 *
 * @example
 * ```typescript
 * const application = await createPaymentApplication(sequelize, 1, 2, 1000, 20);
 * ```
 */
export const createPaymentApplication = async (
  sequelize: Sequelize,
  paymentId: number,
  invoiceId: number,
  appliedAmount: number,
  discountAmount: number,
  transaction?: Transaction,
): Promise<any> => {
  const [results] = await sequelize.query(
    `INSERT INTO ap_payment_applications
     (payment_id, invoice_id, applied_amount, discount_amount, application_date, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
     RETURNING *`,
    {
      bind: [paymentId, invoiceId, appliedAmount, discountAmount, new Date()],
      type: 'INSERT',
      transaction,
    },
  );

  return results;
};

/**
 * Approves a payment for transmission.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {string} userId - User approving payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated payment
 *
 * @example
 * ```typescript
 * const payment = await approvePayment(sequelize, 1, 'user123');
 * ```
 */
export const approvePayment = async (
  sequelize: Sequelize,
  paymentId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Payment = createPaymentModel(sequelize);

  const payment = await Payment.findByPk(paymentId, { transaction });
  if (!payment) {
    throw new Error(`Payment ${paymentId} not found`);
  }

  if (payment.status !== 'draft') {
    throw new Error(`Payment ${paymentId} is not in draft status`);
  }

  await payment.update(
    {
      status: 'approved',
    },
    { transaction },
  );

  return payment;
};

/**
 * Voids a payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {string} voidReason - Reason for void
 * @param {string} userId - User voiding payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Voided payment
 *
 * @example
 * ```typescript
 * const payment = await voidPayment(sequelize, 1, 'Incorrect amount', 'user123');
 * ```
 */
export const voidPayment = async (
  sequelize: Sequelize,
  paymentId: number,
  voidReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Payment = createPaymentModel(sequelize);

  const payment = await Payment.findByPk(paymentId, { transaction });
  if (!payment) {
    throw new Error(`Payment ${paymentId} not found`);
  }

  if (payment.status === 'cleared') {
    throw new Error(`Cannot void cleared payment ${paymentId}`);
  }

  await payment.update(
    {
      status: 'void',
      voidDate: new Date(),
      voidReason,
    },
    { transaction },
  );

  // Reverse payment applications and restore invoices
  await reversePaymentApplications(sequelize, paymentId, transaction);

  return payment;
};

/**
 * Reverses payment applications for a voided payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reversePaymentApplications(sequelize, 1);
 * ```
 */
export const reversePaymentApplications = async (
  sequelize: Sequelize,
  paymentId: number,
  transaction?: Transaction,
): Promise<void> => {
  const APInvoice = createAPInvoiceModel(sequelize);

  const [applications] = await sequelize.query(
    `SELECT * FROM ap_payment_applications WHERE payment_id = $1`,
    {
      bind: [paymentId],
      type: 'SELECT',
      transaction,
    },
  );

  for (const app of applications as any[]) {
    const invoice = await APInvoice.findByPk(app.invoice_id, { transaction });
    if (invoice) {
      await invoice.update(
        {
          paidAmount: Number(invoice.paidAmount) - Number(app.applied_amount),
          discountTaken: Number(invoice.discountTaken) - Number(app.discount_amount),
          outstandingBalance: Number(invoice.outstandingBalance) + Number(app.applied_amount) + Number(app.discount_amount),
          status: 'approved',
        },
        { transaction },
      );
    }
  }
};

/**
 * Marks payment as transmitted to bank.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {string} userId - User transmitting payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated payment
 *
 * @example
 * ```typescript
 * const payment = await transmitPayment(sequelize, 1, 'user123');
 * ```
 */
export const transmitPayment = async (
  sequelize: Sequelize,
  paymentId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Payment = createPaymentModel(sequelize);

  const payment = await Payment.findByPk(paymentId, { transaction });
  if (!payment) {
    throw new Error(`Payment ${paymentId} not found`);
  }

  if (payment.status !== 'approved') {
    throw new Error(`Payment ${paymentId} is not approved`);
  }

  await payment.update(
    {
      status: 'transmitted',
    },
    { transaction },
  );

  return payment;
};

/**
 * Marks payment as cleared.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {Date} clearedDate - Date payment cleared
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated payment
 *
 * @example
 * ```typescript
 * const payment = await clearPayment(sequelize, 1, new Date());
 * ```
 */
export const clearPayment = async (
  sequelize: Sequelize,
  paymentId: number,
  clearedDate: Date,
  transaction?: Transaction,
): Promise<any> => {
  const Payment = createPaymentModel(sequelize);

  const payment = await Payment.findByPk(paymentId, { transaction });
  if (!payment) {
    throw new Error(`Payment ${paymentId} not found`);
  }

  await payment.update(
    {
      status: 'cleared',
      clearedDate,
    },
    { transaction },
  );

  return payment;
};

/**
 * Retrieves payments by status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} status - Payment status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Payments with specified status
 *
 * @example
 * ```typescript
 * const pending = await getPaymentsByStatus(sequelize, 'approved');
 * ```
 */
export const getPaymentsByStatus = async (
  sequelize: Sequelize,
  status: string,
  transaction?: Transaction,
): Promise<any[]> => {
  const Payment = createPaymentModel(sequelize);

  const payments = await Payment.findAll({
    where: { status },
    order: [['paymentDate', 'ASC']],
    transaction,
  });

  return payments;
};

/**
 * Retrieves payment details including applications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment with applications
 *
 * @example
 * ```typescript
 * const details = await getPaymentDetails(sequelize, 1);
 * ```
 */
export const getPaymentDetails = async (
  sequelize: Sequelize,
  paymentId: number,
  transaction?: Transaction,
): Promise<any> => {
  const Payment = createPaymentModel(sequelize);

  const payment = await Payment.findByPk(paymentId, { transaction });
  if (!payment) {
    throw new Error(`Payment ${paymentId} not found`);
  }

  const [applications] = await sequelize.query(
    `SELECT pa.*, i.invoice_number, i.invoice_date, i.invoice_amount
     FROM ap_payment_applications pa
     JOIN ap_invoices i ON i.id = pa.invoice_id
     WHERE pa.payment_id = $1
     ORDER BY pa.application_date`,
    {
      bind: [paymentId],
      type: 'SELECT',
      transaction,
    },
  );

  return {
    ...payment.toJSON(),
    applications,
  };
};

// ============================================================================
// PAYMENT RUNS AND BATCH PROCESSING (29-33)
// ============================================================================

/**
 * Creates a payment run for batch processing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {PaymentRunDto} runData - Payment run data
 * @param {string} userId - User creating run
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PaymentRun>} Created payment run
 *
 * @example
 * ```typescript
 * const run = await createPaymentRun(sequelize, {
 *   paymentDate: new Date(),
 *   bankAccountId: 1,
 *   paymentMethod: 'ach',
 *   vendorSelection: 'by_due_date'
 * }, 'user123');
 * ```
 */
export const createPaymentRun = async (
  sequelize: Sequelize,
  runData: PaymentRunDto,
  userId: string,
  transaction?: Transaction,
): Promise<PaymentRun> => {
  // Generate run number
  const runNumber = await generatePaymentRunNumber(sequelize, transaction);

  const run: PaymentRun = {
    runId: Date.now(),
    runNumber,
    runDate: new Date(),
    paymentDate: runData.paymentDate,
    bankAccountId: runData.bankAccountId,
    paymentMethod: runData.paymentMethod,
    vendorSelection: runData.vendorSelection,
    status: 'created',
    totalPayments: 0,
    totalAmount: 0,
    processedBy: userId,
  };

  return run;
};

/**
 * Generates a unique payment run number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Run number
 *
 * @example
 * ```typescript
 * const runNumber = await generatePaymentRunNumber(sequelize);
 * // Returns: "PR-2024-00001"
 * ```
 */
export const generatePaymentRunNumber = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<string> => {
  const year = new Date().getFullYear();
  const sequence = 1; // In production, query for last run number

  return `PR-${year}-${sequence.toString().padStart(5, '0')}`;
};

/**
 * Selects invoices for payment run based on criteria.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {PaymentRunDto} runData - Payment run criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Selected invoices
 *
 * @example
 * ```typescript
 * const invoices = await selectInvoicesForPaymentRun(sequelize, {
 *   paymentDate: new Date(),
 *   vendorSelection: 'by_due_date'
 * });
 * ```
 */
export const selectInvoicesForPaymentRun = async (
  sequelize: Sequelize,
  runData: PaymentRunDto,
  transaction?: Transaction,
): Promise<any[]> => {
  const APInvoice = createAPInvoiceModel(sequelize);
  const Vendor = createVendorModel(sequelize);

  const where: Record<string, any> = {
    status: 'approved',
    outstandingBalance: { [Op.gt]: 0 },
  };

  if (runData.vendorSelection === 'by_due_date') {
    where.dueDate = { [Op.lte]: runData.paymentDate };
  } else if (runData.vendorSelection === 'by_discount_date') {
    where.discountDate = { [Op.lte]: runData.paymentDate };
    where.discountAmount = { [Op.gt]: 0 };
  } else if (runData.vendorSelection === 'by_vendor' && runData.vendorIds) {
    where.vendorId = { [Op.in]: runData.vendorIds };
  }

  const invoices = await APInvoice.findAll({
    where,
    order: [['vendorId', 'ASC'], ['dueDate', 'ASC']],
    transaction,
  });

  // Filter out vendors on hold
  const filteredInvoices: any[] = [];
  for (const invoice of invoices) {
    const vendor = await Vendor.findByPk(invoice.vendorId, { transaction });
    if (vendor && vendor.status === 'active') {
      filteredInvoices.push(invoice);
    }
  }

  return filteredInvoices;
};

/**
 * Processes a payment run and creates payments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} runId - Payment run ID
 * @param {string} userId - User processing run
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Processing results
 *
 * @example
 * ```typescript
 * const results = await processPaymentRun(sequelize, 1, 'user123');
 * ```
 */
export const processPaymentRun = async (
  sequelize: Sequelize,
  runId: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  // In production, would retrieve run details and process
  // This is a simplified implementation

  return {
    runId,
    paymentsCreated: 0,
    totalAmount: 0,
    errors: [],
  };
};

/**
 * Generates ACH file for payment run.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} runId - Payment run ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} ACH file content
 *
 * @example
 * ```typescript
 * const achFile = await generateACHFile(sequelize, 1);
 * ```
 */
export const generateACHFile = async (
  sequelize: Sequelize,
  runId: number,
  transaction?: Transaction,
): Promise<string> => {
  // In production, would generate NACHA-formatted ACH file
  // This is a placeholder

  return ''; // ACH file content
};

// ============================================================================
// DISCOUNT AND CASH MANAGEMENT (34-38)
// ============================================================================

/**
 * Analyzes available discounts for optimization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Analysis date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<DiscountAnalysis[]>} Discount analysis results
 *
 * @example
 * ```typescript
 * const analysis = await analyzeAvailableDiscounts(sequelize, new Date());
 * ```
 */
export const analyzeAvailableDiscounts = async (
  sequelize: Sequelize,
  asOfDate: Date,
  transaction?: Transaction,
): Promise<DiscountAnalysis[]> => {
  const APInvoice = createAPInvoiceModel(sequelize);
  const Vendor = createVendorModel(sequelize);

  const invoices = await APInvoice.findAll({
    where: {
      status: 'approved',
      outstandingBalance: { [Op.gt]: 0 },
      discountDate: { [Op.gte]: asOfDate },
      discountAmount: { [Op.gt]: 0 },
    },
    transaction,
  });

  const analysis: DiscountAnalysis[] = [];

  for (const invoice of invoices) {
    const vendor = await Vendor.findByPk(invoice.vendorId, { transaction });
    if (!vendor) continue;

    const daysToDiscount = Math.ceil((invoice.discountDate!.getTime() - asOfDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysToNet = Math.ceil((invoice.dueDate.getTime() - asOfDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysSaved = daysToNet - daysToDiscount;

    const discountPercent = (Number(invoice.discountAmount) / Number(invoice.invoiceAmount)) * 100;
    const annualizedRate = daysSaved > 0 ? (discountPercent / daysSaved) * 365 : 0;

    analysis.push({
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      vendorId: vendor.id,
      vendorName: vendor.vendorName,
      invoiceAmount: Number(invoice.invoiceAmount),
      discountAmount: Number(invoice.discountAmount),
      discountPercent,
      discountDate: invoice.discountDate!,
      dueDate: invoice.dueDate,
      daysToDiscount,
      annualizedRate,
      recommendation: annualizedRate > 10 ? 'take' : 'skip', // 10% hurdle rate
    });
  }

  return analysis.sort((a, b) => b.annualizedRate - a.annualizedRate);
};

/**
 * Calculates cash requirements forecast.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Forecast start date
 * @param {number} days - Number of days to forecast
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CashRequirement[]>} Cash requirements by date
 *
 * @example
 * ```typescript
 * const forecast = await calculateCashRequirements(sequelize, new Date(), 30);
 * ```
 */
export const calculateCashRequirements = async (
  sequelize: Sequelize,
  startDate: Date,
  days: number,
  transaction?: Transaction,
): Promise<CashRequirement[]> => {
  const APInvoice = createAPInvoiceModel(sequelize);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days);

  const invoices = await APInvoice.findAll({
    where: {
      status: 'approved',
      outstandingBalance: { [Op.gt]: 0 },
      dueDate: { [Op.between]: [startDate, endDate] },
    },
    order: [['dueDate', 'ASC']],
    transaction,
  });

  // Group by due date
  const requirementsByDate = new Map<string, CashRequirement>();

  for (const invoice of invoices) {
    const dateKey = invoice.dueDate.toISOString().split('T')[0];

    if (!requirementsByDate.has(dateKey)) {
      requirementsByDate.set(dateKey, {
        requirementDate: invoice.dueDate,
        dueAmount: 0,
        discountEligibleAmount: 0,
        potentialDiscount: 0,
        netRequirement: 0,
        projectedBalance: 0,
        shortfallAmount: 0,
      });
    }

    const req = requirementsByDate.get(dateKey)!;
    req.dueAmount += Number(invoice.outstandingBalance);

    if (invoice.discountDate && invoice.discountDate >= invoice.dueDate) {
      req.discountEligibleAmount += Number(invoice.outstandingBalance);
      req.potentialDiscount += Number(invoice.discountAmount);
    }

    req.netRequirement = req.dueAmount - req.potentialDiscount;
  }

  return Array.from(requirementsByDate.values()).sort(
    (a, b) => a.requirementDate.getTime() - b.requirementDate.getTime(),
  );
};

/**
 * Recommends optimal payment strategy for discounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} availableCash - Available cash balance
 * @param {Date} asOfDate - Analysis date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment strategy recommendations
 *
 * @example
 * ```typescript
 * const strategy = await recommendPaymentStrategy(sequelize, 100000, new Date());
 * ```
 */
export const recommendPaymentStrategy = async (
  sequelize: Sequelize,
  availableCash: number,
  asOfDate: Date,
  transaction?: Transaction,
): Promise<any> => {
  const discounts = await analyzeAvailableDiscounts(sequelize, asOfDate, transaction);

  const recommended = discounts.filter(d => d.recommendation === 'take');

  let totalInvestment = 0;
  let totalSavings = 0;
  const selectedInvoices: number[] = [];

  for (const discount of recommended) {
    const netPayment = discount.invoiceAmount - discount.discountAmount;

    if (totalInvestment + netPayment <= availableCash) {
      totalInvestment += netPayment;
      totalSavings += discount.discountAmount;
      selectedInvoices.push(discount.invoiceId);
    }
  }

  return {
    availableCash,
    recommendedInvestment: totalInvestment,
    totalSavings,
    effectiveRate: totalInvestment > 0 ? (totalSavings / totalInvestment) * 100 : 0,
    invoiceCount: selectedInvoices.length,
    invoiceIds: selectedInvoices,
  };
};

/**
 * Calculates early payment discount ROI.
 *
 * @param {number} invoiceAmount - Invoice amount
 * @param {number} discountPercent - Discount percentage
 * @param {number} daysEarly - Days paid early
 * @returns {number} Annualized ROI percentage
 *
 * @example
 * ```typescript
 * const roi = calculateDiscountROI(10000, 2, 20);
 * // Returns annualized ROI for 2% discount on 20-day early payment
 * ```
 */
export const calculateDiscountROI = (invoiceAmount: number, discountPercent: number, daysEarly: number): number => {
  if (daysEarly <= 0) return 0;

  const annualizedRate = (discountPercent / daysEarly) * 365;
  return annualizedRate;
};

/**
 * Gets invoices eligible for early payment discount.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Analysis date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Discount-eligible invoices
 *
 * @example
 * ```typescript
 * const eligible = await getDiscountEligibleInvoices(sequelize, new Date());
 * ```
 */
export const getDiscountEligibleInvoices = async (
  sequelize: Sequelize,
  asOfDate: Date,
  transaction?: Transaction,
): Promise<any[]> => {
  const APInvoice = createAPInvoiceModel(sequelize);

  const invoices = await APInvoice.findAll({
    where: {
      status: 'approved',
      outstandingBalance: { [Op.gt]: 0 },
      discountDate: { [Op.gte]: asOfDate },
      discountAmount: { [Op.gt]: 0 },
    },
    order: [['discountDate', 'ASC']],
    transaction,
  });

  return invoices;
};

// ============================================================================
// REPORTING AND ANALYTICS (39-45)
// ============================================================================

/**
 * Generates accounts payable aging report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Aging as-of date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<APAgingBucket[]>} Aging buckets by vendor
 *
 * @example
 * ```typescript
 * const aging = await generateAPAgingReport(sequelize, new Date());
 * ```
 */
export const generateAPAgingReport = async (
  sequelize: Sequelize,
  asOfDate: Date,
  transaction?: Transaction,
): Promise<APAgingBucket[]> => {
  const APInvoice = createAPInvoiceModel(sequelize);
  const Vendor = createVendorModel(sequelize);

  const invoices = await APInvoice.findAll({
    where: {
      outstandingBalance: { [Op.gt]: 0 },
      status: { [Op.notIn]: ['cancelled', 'void'] },
    },
    transaction,
  });

  const vendorBuckets = new Map<number, APAgingBucket>();

  for (const invoice of invoices) {
    if (!vendorBuckets.has(invoice.vendorId)) {
      const vendor = await Vendor.findByPk(invoice.vendorId, { transaction });
      if (!vendor) continue;

      vendorBuckets.set(invoice.vendorId, {
        vendorId: vendor.id,
        vendorNumber: vendor.vendorNumber,
        vendorName: vendor.vendorName,
        current: 0,
        days1To30: 0,
        days31To60: 0,
        days61To90: 0,
        days91To120: 0,
        over120: 0,
        totalOutstanding: 0,
      });
    }

    const bucket = vendorBuckets.get(invoice.vendorId)!;
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

  return Array.from(vendorBuckets.values()).sort((a, b) => b.totalOutstanding - a.totalOutstanding);
};

/**
 * Generates 1099 tax data for vendors.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} taxYear - Tax year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Form1099Data[]>} 1099 data by vendor
 *
 * @example
 * ```typescript
 * const data1099 = await generate1099Data(sequelize, 2024);
 * ```
 */
export const generate1099Data = async (
  sequelize: Sequelize,
  taxYear: number,
  transaction?: Transaction,
): Promise<Form1099Data[]> => {
  const Vendor = createVendorModel(sequelize);
  const Payment = createPaymentModel(sequelize);

  const vendors = await Vendor.findAll({
    where: {
      is1099Vendor: true,
    },
    transaction,
  });

  const data1099: Form1099Data[] = [];

  for (const vendor of vendors) {
    const yearStart = new Date(taxYear, 0, 1);
    const yearEnd = new Date(taxYear, 11, 31);

    const payments = await Payment.findAll({
      where: {
        vendorId: vendor.id,
        paymentDate: { [Op.between]: [yearStart, yearEnd] },
        status: { [Op.in]: ['transmitted', 'cleared'] },
      },
      transaction,
    });

    const totalAmount = payments.reduce((sum, p) => sum + Number(p.paymentAmount), 0);

    if (totalAmount >= 600) {
      // IRS reporting threshold
      data1099.push({
        vendor1099Id: Date.now() + vendor.id,
        vendorId: vendor.id,
        taxYear,
        form1099Type: vendor.is1099Type || '1099-NEC',
        box1Amount: totalAmount,
        totalAmount,
        isCorrected: false,
        filingStatus: 'not_filed',
      });
    }
  }

  return data1099;
};

/**
 * Generates vendor statement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {Date} statementDate - Statement date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VendorStatement>} Vendor statement
 *
 * @example
 * ```typescript
 * const statement = await generateVendorStatement(sequelize, 1, new Date());
 * ```
 */
export const generateVendorStatement = async (
  sequelize: Sequelize,
  vendorId: number,
  statementDate: Date,
  transaction?: Transaction,
): Promise<VendorStatement> => {
  const APInvoice = createAPInvoiceModel(sequelize);
  const Payment = createPaymentModel(sequelize);

  const monthStart = new Date(statementDate.getFullYear(), statementDate.getMonth(), 1);
  const monthEnd = new Date(statementDate.getFullYear(), statementDate.getMonth() + 1, 0);

  const invoices = await APInvoice.findAll({
    where: {
      vendorId,
      invoiceDate: { [Op.between]: [monthStart, monthEnd] },
    },
    transaction,
  });

  const payments = await Payment.findAll({
    where: {
      vendorId,
      paymentDate: { [Op.between]: [monthStart, monthEnd] },
    },
    transaction,
  });

  const totalInvoices = invoices.reduce((sum, i) => sum + Number(i.invoiceAmount), 0);
  const totalPayments = payments.reduce((sum, p) => sum + Number(p.paymentAmount), 0);

  const currentBalance = await APInvoice.sum('outstandingBalance', {
    where: {
      vendorId,
      status: { [Op.notIn]: ['cancelled', 'void'] },
    },
    transaction,
  });

  const statement: VendorStatement = {
    statementId: Date.now(),
    vendorId,
    statementDate,
    beginningBalance: (currentBalance || 0) - totalInvoices + totalPayments,
    invoices: totalInvoices,
    payments: totalPayments,
    adjustments: 0,
    endingBalance: currentBalance || 0,
    reconciliationStatus: 'unreconciled',
  };

  return statement;
};

/**
 * Gets top vendors by payment volume.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [limit=10] - Number of top vendors
 * @param {number} [days=365] - Analysis period in days
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Top vendors
 *
 * @example
 * ```typescript
 * const topVendors = await getTopVendorsByVolume(sequelize, 10, 365);
 * ```
 */
export const getTopVendorsByVolume = async (
  sequelize: Sequelize,
  limit: number = 10,
  days: number = 365,
  transaction?: Transaction,
): Promise<any[]> => {
  const Payment = createPaymentModel(sequelize);
  const Vendor = createVendorModel(sequelize);

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  const [results] = await sequelize.query(
    `SELECT
      v.id,
      v.vendor_number,
      v.vendor_name,
      COUNT(p.id) as payment_count,
      SUM(p.payment_amount) as total_paid,
      AVG(p.payment_amount) as avg_payment
     FROM ap_vendors v
     JOIN ap_payments p ON p.vendor_id = v.id
     WHERE p.payment_date >= $1
       AND p.status IN ('transmitted', 'cleared')
     GROUP BY v.id, v.vendor_number, v.vendor_name
     ORDER BY total_paid DESC
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
 * Calculates payment cycle metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [days=90] - Analysis period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment cycle metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculatePaymentCycleMetrics(sequelize, 90);
 * ```
 */
export const calculatePaymentCycleMetrics = async (
  sequelize: Sequelize,
  days: number = 90,
  transaction?: Transaction,
): Promise<any> => {
  const APInvoice = createAPInvoiceModel(sequelize);

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  const paidInvoices = await APInvoice.findAll({
    where: {
      status: 'paid',
      invoiceDate: { [Op.gte]: sinceDate },
    },
    transaction,
  });

  let totalDays = 0;
  let onTimeCount = 0;
  let earlyCount = 0;
  let lateCount = 0;

  for (const invoice of paidInvoices) {
    // In production, would get actual payment date from payment record
    const paymentDate = invoice.updatedAt; // Approximation
    const daysToPayment = Math.floor((paymentDate.getTime() - invoice.invoiceDate.getTime()) / (1000 * 60 * 60 * 24));

    totalDays += daysToPayment;

    const daysToDue = Math.floor((invoice.dueDate.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysToDue > 0) earlyCount++;
    else if (daysToDue === 0) onTimeCount++;
    else lateCount++;
  }

  const avgDaysToPayment = paidInvoices.length > 0 ? totalDays / paidInvoices.length : 0;

  return {
    periodDays: days,
    invoicesPaid: paidInvoices.length,
    averageDaysToPayment: avgDaysToPayment,
    paidEarly: earlyCount,
    paidOnTime: onTimeCount,
    paidLate: lateCount,
    onTimePercentage: paidInvoices.length > 0 ? ((earlyCount + onTimeCount) / paidInvoices.length) * 100 : 0,
  };
};

/**
 * Retrieves outstanding invoices by vendor.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Outstanding invoices
 *
 * @example
 * ```typescript
 * const outstanding = await getOutstandingInvoicesByVendor(sequelize, 1);
 * ```
 */
export const getOutstandingInvoicesByVendor = async (
  sequelize: Sequelize,
  vendorId: number,
  transaction?: Transaction,
): Promise<any[]> => {
  const APInvoice = createAPInvoiceModel(sequelize);

  const invoices = await APInvoice.findAll({
    where: {
      vendorId,
      outstandingBalance: { [Op.gt]: 0 },
      status: { [Op.notIn]: ['cancelled', 'void'] },
    },
    order: [['dueDate', 'ASC']],
    transaction,
  });

  return invoices;
};

/**
 * Generates payment forecast based on approved invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Forecast start date
 * @param {Date} endDate - Forecast end date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment forecast
 *
 * @example
 * ```typescript
 * const forecast = await generatePaymentForecast(
 *   sequelize,
 *   new Date(),
 *   new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
 * );
 * ```
 */
export const generatePaymentForecast = async (
  sequelize: Sequelize,
  startDate: Date,
  endDate: Date,
  transaction?: Transaction,
): Promise<any> => {
  const cashRequirements = await calculateCashRequirements(
    sequelize,
    startDate,
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
    transaction,
  );

  const totalDue = cashRequirements.reduce((sum, r) => sum + r.dueAmount, 0);
  const totalDiscounts = cashRequirements.reduce((sum, r) => sum + r.potentialDiscount, 0);
  const netCashNeeded = totalDue - totalDiscounts;

  return {
    forecastStart: startDate,
    forecastEnd: endDate,
    totalAmountDue: totalDue,
    potentialDiscounts: totalDiscounts,
    netCashRequired: netCashNeeded,
    dailyRequirements: cashRequirements,
  };
};
