/**
 * LOC: INVMGMT001
 * File: /reuse/edwards/financial/invoice-management-matching-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - multer (File upload handling)
 *   - sharp (Image processing)
 *
 * DOWNSTREAM (imported by):
 *   - Backend invoice modules
 *   - Accounts payable services
 *   - Payment processing services
 *   - Procurement modules
 */

/**
 * File: /reuse/edwards/financial/invoice-management-matching-kit.ts
 * Locator: WC-EDWARDS-INVMGMT-001
 * Purpose: Comprehensive Invoice Management & Matching - JD Edwards EnterpriseOne-level invoice capture, validation, three-way matching, approval workflows
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, Multer 1.x, Sharp 0.32.x
 * Downstream: ../backend/invoices/*, Accounts Payable Services, Payment Processing, Procurement
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+, Multer 1.x, Sharp 0.32.x
 * Exports: 45 functions for invoice capture, validation, three-way matching, two-way matching, approval workflows, holds, disputes, routing, image processing, OCR integration
 *
 * LLM Context: Enterprise-grade invoice management for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive invoice capture, automated validation, three-way matching (PO/Receipt/Invoice), two-way matching,
 * multi-level approval workflows, invoice holds and exceptions, dispute management, intelligent routing, image processing,
 * OCR integration, duplicate detection, tax validation, variance analysis, automated coding, audit trails,
 * and supplier portal integration.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable, Controller, Get, Post, Put, Delete, Param, Query, Body, HttpCode, HttpStatus, UseGuards, UsePipes, ValidationPipe, ParseUUIDPipe, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Invoice {
  invoiceId: number;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  supplierId: number;
  supplierName: string;
  supplierSiteId: number;
  purchaseOrderId?: number;
  purchaseOrderNumber?: string;
  invoiceAmount: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  netAmount: number;
  currency: string;
  exchangeRate: number;
  baseAmount: number;
  status: 'draft' | 'pending_validation' | 'validated' | 'pending_approval' | 'approved' | 'rejected' | 'on_hold' | 'disputed' | 'paid' | 'cancelled';
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid';
  matchingStatus: 'unmatched' | 'two_way_matched' | 'three_way_matched' | 'variance' | 'exception';
  approvalStatus: 'none' | 'pending' | 'approved' | 'rejected';
  hasImage: boolean;
  imageUrl?: string;
  ocrProcessed: boolean;
  ocrConfidence?: number;
}

interface InvoiceLine {
  invoiceLineId: number;
  invoiceId: number;
  lineNumber: number;
  purchaseOrderLineId?: number;
  itemId?: number;
  itemCode?: string;
  itemDescription: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  lineAmount: number;
  taxAmount: number;
  discountAmount: number;
  netAmount: number;
  accountCode: string;
  glAccountId: number;
  costCenterCode?: string;
  projectCode?: string;
  matchedQuantity: number;
  varianceAmount: number;
}

interface ThreeWayMatch {
  matchId: number;
  invoiceId: number;
  invoiceLineId: number;
  purchaseOrderId: number;
  purchaseOrderLineId: number;
  receiptId: number;
  receiptLineId: number;
  invoiceQuantity: number;
  receivedQuantity: number;
  poQuantity: number;
  invoiceUnitPrice: number;
  poUnitPrice: number;
  quantityVariance: number;
  priceVariance: number;
  amountVariance: number;
  matchStatus: 'matched' | 'quantity_variance' | 'price_variance' | 'both_variance' | 'exception';
  toleranceExceeded: boolean;
  autoApproved: boolean;
}

interface TwoWayMatch {
  matchId: number;
  invoiceId: number;
  invoiceLineId: number;
  purchaseOrderId: number;
  purchaseOrderLineId: number;
  invoiceQuantity: number;
  poQuantity: number;
  invoiceUnitPrice: number;
  poUnitPrice: number;
  quantityVariance: number;
  priceVariance: number;
  amountVariance: number;
  matchStatus: 'matched' | 'quantity_variance' | 'price_variance' | 'both_variance';
  toleranceExceeded: boolean;
}

interface InvoiceApproval {
  approvalId: number;
  invoiceId: number;
  approvalLevel: number;
  approverId: string;
  approverName: string;
  approverRole: string;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'delegated';
  approvalDate?: Date;
  comments?: string;
  delegatedTo?: string;
  escalationLevel: number;
}

interface InvoiceHold {
  holdId: number;
  invoiceId: number;
  holdType: 'manual' | 'duplicate' | 'validation' | 'matching' | 'approval' | 'tax' | 'compliance';
  holdReason: string;
  holdCategory: string;
  holdDate: Date;
  holdBy: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  releaseDate?: Date;
  releasedBy?: string;
  releaseNotes?: string;
  autoRelease: boolean;
}

interface InvoiceDispute {
  disputeId: number;
  invoiceId: number;
  disputeType: 'price' | 'quantity' | 'quality' | 'delivery' | 'duplicate' | 'unauthorized' | 'other';
  disputeReason: string;
  disputeAmount: number;
  disputeDate: Date;
  disputedBy: string;
  assignedTo?: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed' | 'escalated';
  resolutionDate?: Date;
  resolutionNotes?: string;
  supplierNotified: boolean;
  supplierResponse?: string;
}

interface InvoiceRouting {
  routingId: number;
  invoiceId: number;
  routingStep: number;
  routingRole: string;
  routingUser?: string;
  routingDate: Date;
  completedDate?: Date;
  status: 'pending' | 'completed' | 'skipped' | 'rejected';
  actionTaken?: string;
  comments?: string;
}

interface InvoiceImage {
  imageId: number;
  invoiceId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadDate: Date;
  uploadedBy: string;
  pageCount: number;
  thumbnailPath?: string;
  ocrProcessed: boolean;
  ocrText?: string;
  ocrData?: Record<string, any>;
}

interface OCRResult {
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
  supplierName?: string;
  supplierAddress?: string;
  totalAmount?: number;
  taxAmount?: number;
  lineItems?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  confidence: number;
  rawData: Record<string, any>;
}

interface DuplicateDetection {
  detectionId: number;
  invoiceId: number;
  duplicateInvoiceId: number;
  matchType: 'exact' | 'fuzzy' | 'amount' | 'supplier_date';
  matchScore: number;
  detectionDate: Date;
  status: 'potential' | 'confirmed' | 'dismissed';
  reviewedBy?: string;
  reviewDate?: Date;
}

interface InvoiceValidationRule {
  ruleId: number;
  ruleName: string;
  ruleType: 'required_field' | 'format' | 'range' | 'calculation' | 'duplicate' | 'tax' | 'tolerance';
  ruleExpression: string;
  errorMessage: string;
  severity: 'error' | 'warning' | 'info';
  isActive: boolean;
  autoCorrect: boolean;
}

interface InvoiceException {
  exceptionId: number;
  invoiceId: number;
  exceptionType: string;
  exceptionMessage: string;
  exceptionData?: Record<string, any>;
  severity: 'low' | 'medium' | 'high';
  detectedDate: Date;
  resolvedDate?: Date;
  resolvedBy?: string;
  resolutionAction?: string;
}

interface InvoiceCodingRule {
  ruleId: number;
  supplierId?: number;
  itemCategoryId?: number;
  defaultGLAccountId: number;
  defaultCostCenter?: string;
  defaultProject?: string;
  priority: number;
  isActive: boolean;
}

interface InvoiceAuditTrail {
  auditId: number;
  invoiceId: number;
  action: 'CREATE' | 'UPDATE' | 'VALIDATE' | 'MATCH' | 'APPROVE' | 'REJECT' | 'HOLD' | 'RELEASE' | 'DISPUTE' | 'PAY';
  actionDate: Date;
  userId: string;
  userName: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  notes?: string;
}

interface MatchingTolerance {
  toleranceId: number;
  toleranceName: string;
  toleranceType: 'quantity' | 'price' | 'amount';
  toleranceValue: number;
  tolerancePercent: number;
  supplierId?: number;
  itemCategoryId?: number;
  isActive: boolean;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Invoice number', example: 'INV-2024-001' })
  invoiceNumber!: string;

  @ApiProperty({ description: 'Invoice date', example: '2024-01-15' })
  invoiceDate!: Date;

  @ApiProperty({ description: 'Due date', example: '2024-02-15' })
  dueDate!: Date;

  @ApiProperty({ description: 'Supplier ID' })
  supplierId!: number;

  @ApiProperty({ description: 'Supplier site ID' })
  supplierSiteId!: number;

  @ApiProperty({ description: 'Purchase order ID', required: false })
  purchaseOrderId?: number;

  @ApiProperty({ description: 'Invoice amount' })
  invoiceAmount!: number;

  @ApiProperty({ description: 'Tax amount', default: 0 })
  taxAmount?: number;

  @ApiProperty({ description: 'Shipping amount', default: 0 })
  shippingAmount?: number;

  @ApiProperty({ description: 'Discount amount', default: 0 })
  discountAmount?: number;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  currency!: string;

  @ApiProperty({ description: 'Invoice lines', type: [Object] })
  lines!: InvoiceLine[];
}

export class ValidateInvoiceDto {
  @ApiProperty({ description: 'Invoice ID' })
  invoiceId!: number;

  @ApiProperty({ description: 'Skip duplicate check', default: false })
  skipDuplicateCheck?: boolean;

  @ApiProperty({ description: 'Skip tax validation', default: false })
  skipTaxValidation?: boolean;
}

export class PerformThreeWayMatchDto {
  @ApiProperty({ description: 'Invoice ID' })
  invoiceId!: number;

  @ApiProperty({ description: 'Purchase order ID' })
  purchaseOrderId!: number;

  @ApiProperty({ description: 'Receipt ID' })
  receiptId!: number;

  @ApiProperty({ description: 'Auto-approve within tolerance', default: true })
  autoApproveWithinTolerance?: boolean;
}

export class PerformTwoWayMatchDto {
  @ApiProperty({ description: 'Invoice ID' })
  invoiceId!: number;

  @ApiProperty({ description: 'Purchase order ID' })
  purchaseOrderId!: number;

  @ApiProperty({ description: 'Auto-approve within tolerance', default: true })
  autoApproveWithinTolerance?: boolean;
}

export class ApproveInvoiceDto {
  @ApiProperty({ description: 'Invoice ID' })
  invoiceId!: number;

  @ApiProperty({ description: 'Approval level' })
  approvalLevel!: number;

  @ApiProperty({ description: 'Comments', required: false })
  comments?: string;
}

export class PlaceInvoiceHoldDto {
  @ApiProperty({ description: 'Invoice ID' })
  invoiceId!: number;

  @ApiProperty({ description: 'Hold type', enum: ['manual', 'duplicate', 'validation', 'matching', 'approval', 'tax', 'compliance'] })
  holdType!: string;

  @ApiProperty({ description: 'Hold reason' })
  holdReason!: string;

  @ApiProperty({ description: 'Priority', enum: ['low', 'medium', 'high', 'critical'] })
  priority!: string;
}

export class CreateInvoiceDisputeDto {
  @ApiProperty({ description: 'Invoice ID' })
  invoiceId!: number;

  @ApiProperty({ description: 'Dispute type', enum: ['price', 'quantity', 'quality', 'delivery', 'duplicate', 'unauthorized', 'other'] })
  disputeType!: string;

  @ApiProperty({ description: 'Dispute reason' })
  disputeReason!: string;

  @ApiProperty({ description: 'Disputed amount' })
  disputeAmount!: number;

  @ApiProperty({ description: 'Notify supplier', default: true })
  notifySupplier?: boolean;
}

export class ProcessOCRDto {
  @ApiProperty({ description: 'Invoice image ID' })
  imageId!: number;

  @ApiProperty({ description: 'OCR provider', enum: ['tesseract', 'google', 'aws', 'azure'], default: 'tesseract' })
  provider?: string;

  @ApiProperty({ description: 'Auto-create invoice from OCR', default: false })
  autoCreateInvoice?: boolean;
}

export class RouteInvoiceDto {
  @ApiProperty({ description: 'Invoice ID' })
  invoiceId!: number;

  @ApiProperty({ description: 'Target role for routing' })
  targetRole!: string;

  @ApiProperty({ description: 'Specific user to route to', required: false })
  targetUser?: string;

  @ApiProperty({ description: 'Routing comments', required: false })
  comments?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Invoices with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Invoice model
 *
 * @example
 * ```typescript
 * const Invoice = createInvoiceModel(sequelize);
 * const invoice = await Invoice.create({
 *   invoiceNumber: 'INV-2024-001',
 *   invoiceDate: new Date(),
 *   supplierId: 100,
 *   invoiceAmount: 5000.00,
 *   status: 'draft'
 * });
 * ```
 */
export const createInvoiceModel = (sequelize: Sequelize) => {
  class Invoice extends Model {
    public id!: number;
    public invoiceNumber!: string;
    public invoiceDate!: Date;
    public dueDate!: Date;
    public supplierId!: number;
    public supplierName!: string;
    public supplierSiteId!: number;
    public purchaseOrderId!: number | null;
    public purchaseOrderNumber!: string | null;
    public invoiceAmount!: number;
    public taxAmount!: number;
    public shippingAmount!: number;
    public discountAmount!: number;
    public netAmount!: number;
    public currency!: string;
    public exchangeRate!: number;
    public baseAmount!: number;
    public status!: string;
    public paymentStatus!: string;
    public matchingStatus!: string;
    public approvalStatus!: string;
    public hasImage!: boolean;
    public imageUrl!: string | null;
    public ocrProcessed!: boolean;
    public ocrConfidence!: number | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  Invoice.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      invoiceNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique invoice number',
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
      purchaseOrderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Purchase order reference',
      },
      purchaseOrderNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Purchase order number (denormalized)',
      },
      invoiceAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Invoice gross amount',
      },
      taxAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Tax amount',
      },
      shippingAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Shipping/freight amount',
      },
      discountAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Discount amount',
      },
      netAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Net payable amount',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        comment: 'Currency code',
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
        comment: 'Amount in base currency',
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Invoice status',
      },
      paymentStatus: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'unpaid',
        comment: 'Payment status',
      },
      matchingStatus: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'unmatched',
        comment: 'Matching status',
      },
      approvalStatus: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'none',
        comment: 'Approval status',
      },
      hasImage: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Has scanned image',
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Image URL',
      },
      ocrProcessed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'OCR processing completed',
      },
      ocrConfidence: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'OCR confidence score (0-100)',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the invoice',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the invoice',
      },
    },
    {
      sequelize,
      tableName: 'invoices',
      timestamps: true,
      indexes: [
        { fields: ['invoiceNumber'], unique: true },
        { fields: ['invoiceDate'] },
        { fields: ['dueDate'] },
        { fields: ['supplierId'] },
        { fields: ['purchaseOrderId'] },
        { fields: ['status'] },
        { fields: ['matchingStatus'] },
        { fields: ['approvalStatus'] },
      ],
    },
  );

  return Invoice;
};

/**
 * Sequelize model for Invoice Lines with GL coding.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InvoiceLine model
 *
 * @example
 * ```typescript
 * const InvoiceLine = createInvoiceLineModel(sequelize);
 * const line = await InvoiceLine.create({
 *   invoiceId: 1,
 *   lineNumber: 1,
 *   itemDescription: 'Office supplies',
 *   quantity: 10,
 *   unitPrice: 25.00
 * });
 * ```
 */
export const createInvoiceLineModel = (sequelize: Sequelize) => {
  class InvoiceLine extends Model {
    public id!: number;
    public invoiceId!: number;
    public lineNumber!: number;
    public purchaseOrderLineId!: number | null;
    public itemId!: number | null;
    public itemCode!: string | null;
    public itemDescription!: string;
    public quantity!: number;
    public unitOfMeasure!: string;
    public unitPrice!: number;
    public lineAmount!: number;
    public taxAmount!: number;
    public discountAmount!: number;
    public netAmount!: number;
    public accountCode!: string;
    public glAccountId!: number;
    public costCenterCode!: string | null;
    public projectCode!: string | null;
    public matchedQuantity!: number;
    public varianceAmount!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InvoiceLine.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      invoiceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Invoice reference',
        references: {
          model: 'invoices',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      lineNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Line number within invoice',
      },
      purchaseOrderLineId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Purchase order line reference',
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Item/product reference',
      },
      itemCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Item code',
      },
      itemDescription: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Item/service description',
      },
      quantity: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: false,
        comment: 'Quantity',
      },
      unitOfMeasure: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'EA',
        comment: 'Unit of measure',
      },
      unitPrice: {
        type: DataTypes.DECIMAL(20, 4),
        allowNull: false,
        comment: 'Unit price',
      },
      lineAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Line amount (quantity * unitPrice)',
      },
      taxAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Tax amount for line',
      },
      discountAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Discount amount for line',
      },
      netAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        comment: 'Net line amount',
      },
      accountCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'GL account code',
      },
      glAccountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'GL account reference',
      },
      costCenterCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Cost center code',
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Project code',
      },
      matchedQuantity: {
        type: DataTypes.DECIMAL(15, 4),
        allowNull: false,
        defaultValue: 0,
        comment: 'Matched quantity from receipt',
      },
      varianceAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Variance amount from PO/receipt',
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
      tableName: 'invoice_lines',
      timestamps: true,
      indexes: [
        { fields: ['invoiceId'] },
        { fields: ['purchaseOrderLineId'] },
        { fields: ['itemId'] },
        { fields: ['accountCode'] },
      ],
    },
  );

  return InvoiceLine;
};

// ============================================================================
// BUSINESS LOGIC FUNCTIONS
// ============================================================================

/**
 * Creates a new invoice with lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateInvoiceDto} invoiceData - Invoice data
 * @param {string} userId - User creating the invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createInvoice(sequelize, {
 *   invoiceNumber: 'INV-2024-001',
 *   invoiceDate: new Date(),
 *   dueDate: new Date('2024-02-15'),
 *   supplierId: 100,
 *   supplierSiteId: 1,
 *   invoiceAmount: 5000.00,
 *   taxAmount: 400.00,
 *   currency: 'USD',
 *   lines: [...]
 * }, 'user123');
 * ```
 */
export const createInvoice = async (
  sequelize: Sequelize,
  invoiceData: CreateInvoiceDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Invoice = createInvoiceModel(sequelize);
  const InvoiceLine = createInvoiceLineModel(sequelize);

  // Get supplier details
  const supplier = await getSupplierDetails(sequelize, invoiceData.supplierId, transaction);

  // Calculate net amount
  const netAmount =
    invoiceData.invoiceAmount +
    (invoiceData.taxAmount || 0) +
    (invoiceData.shippingAmount || 0) -
    (invoiceData.discountAmount || 0);

  // Create invoice header
  const invoice = await Invoice.create(
    {
      invoiceNumber: invoiceData.invoiceNumber,
      invoiceDate: invoiceData.invoiceDate,
      dueDate: invoiceData.dueDate,
      supplierId: invoiceData.supplierId,
      supplierName: supplier.name,
      supplierSiteId: invoiceData.supplierSiteId,
      purchaseOrderId: invoiceData.purchaseOrderId || null,
      invoiceAmount: invoiceData.invoiceAmount,
      taxAmount: invoiceData.taxAmount || 0,
      shippingAmount: invoiceData.shippingAmount || 0,
      discountAmount: invoiceData.discountAmount || 0,
      netAmount,
      currency: invoiceData.currency,
      exchangeRate: 1.0,
      baseAmount: netAmount,
      status: 'draft',
      paymentStatus: 'unpaid',
      matchingStatus: 'unmatched',
      approvalStatus: 'none',
      hasImage: false,
      ocrProcessed: false,
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  // Create invoice lines
  for (let i = 0; i < invoiceData.lines.length; i++) {
    const lineData = invoiceData.lines[i];

    await InvoiceLine.create(
      {
        invoiceId: invoice.id,
        lineNumber: i + 1,
        purchaseOrderLineId: lineData.purchaseOrderLineId,
        itemId: lineData.itemId,
        itemCode: lineData.itemCode,
        itemDescription: lineData.itemDescription,
        quantity: lineData.quantity,
        unitOfMeasure: lineData.unitOfMeasure,
        unitPrice: lineData.unitPrice,
        lineAmount: lineData.lineAmount,
        taxAmount: lineData.taxAmount || 0,
        discountAmount: lineData.discountAmount || 0,
        netAmount: lineData.netAmount,
        accountCode: lineData.accountCode,
        glAccountId: lineData.glAccountId,
        costCenterCode: lineData.costCenterCode,
        projectCode: lineData.projectCode,
        matchedQuantity: 0,
        varianceAmount: 0,
      },
      { transaction },
    );
  }

  return invoice;
};

/**
 * Retrieves supplier details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} supplierId - Supplier ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Supplier details
 *
 * @example
 * ```typescript
 * const supplier = await getSupplierDetails(sequelize, 100);
 * console.log(supplier.name);
 * ```
 */
export const getSupplierDetails = async (
  sequelize: Sequelize,
  supplierId: number,
  transaction?: Transaction,
): Promise<any> => {
  const result = await sequelize.query(
    'SELECT * FROM suppliers WHERE id = :supplierId AND is_active = true',
    {
      replacements: { supplierId },
      type: 'SELECT',
      transaction,
    },
  );

  if (!result || (result as any[]).length === 0) {
    throw new Error(`Supplier ${supplierId} not found or inactive`);
  }

  return (result as any[])[0];
};

/**
 * Validates an invoice against validation rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ValidateInvoiceDto} validationData - Validation parameters
 * @param {string} userId - User performing validation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{isValid: boolean; errors: string[]; warnings: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateInvoice(sequelize, {
 *   invoiceId: 1,
 *   skipDuplicateCheck: false
 * }, 'user123');
 * if (!validation.isValid) {
 *   console.log('Errors:', validation.errors);
 * }
 * ```
 */
export const validateInvoice = async (
  sequelize: Sequelize,
  validationData: ValidateInvoiceDto,
  userId: string,
  transaction?: Transaction,
): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> => {
  const Invoice = createInvoiceModel(sequelize);

  const invoice = await Invoice.findByPk(validationData.invoiceId, { transaction });
  if (!invoice) {
    return { isValid: false, errors: ['Invoice not found'], warnings: [] };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Required field validation
  if (!invoice.invoiceNumber) errors.push('Invoice number is required');
  if (!invoice.invoiceDate) errors.push('Invoice date is required');
  if (!invoice.dueDate) errors.push('Due date is required');
  if (!invoice.supplierId) errors.push('Supplier is required');

  // Date validation
  if (invoice.dueDate < invoice.invoiceDate) {
    errors.push('Due date must be after invoice date');
  }

  // Amount validation
  if (invoice.netAmount <= 0) {
    errors.push('Invoice amount must be greater than zero');
  }

  // Duplicate check
  if (!validationData.skipDuplicateCheck) {
    const duplicates = await detectDuplicateInvoices(
      sequelize,
      validationData.invoiceId,
      transaction,
    );
    if (duplicates.length > 0) {
      warnings.push(`Potential duplicate invoices found: ${duplicates.length}`);
    }
  }

  // Tax validation
  if (!validationData.skipTaxValidation) {
    const taxValid = await validateInvoiceTax(sequelize, validationData.invoiceId, transaction);
    if (!taxValid.isValid) {
      warnings.push(`Tax validation issues: ${taxValid.message}`);
    }
  }

  // Line totals validation
  const lineTotals = await calculateInvoiceLineTotals(
    sequelize,
    validationData.invoiceId,
    transaction,
  );
  if (Math.abs(lineTotals.totalAmount - parseFloat(invoice.invoiceAmount.toString())) > 0.01) {
    errors.push('Invoice header amount does not match line totals');
  }

  const isValid = errors.length === 0;

  // Update invoice status
  if (isValid) {
    await invoice.update(
      {
        status: 'validated',
        updatedBy: userId,
      },
      { transaction },
    );
  }

  return { isValid, errors, warnings };
};

/**
 * Detects potential duplicate invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID to check
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} List of potential duplicates
 *
 * @example
 * ```typescript
 * const duplicates = await detectDuplicateInvoices(sequelize, 1);
 * console.log(`Found ${duplicates.length} potential duplicates`);
 * ```
 */
export const detectDuplicateInvoices = async (
  sequelize: Sequelize,
  invoiceId: number,
  transaction?: Transaction,
): Promise<any[]> => {
  const Invoice = createInvoiceModel(sequelize);

  const invoice = await Invoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    throw new Error('Invoice not found');
  }

  // Check for exact match on invoice number and supplier
  const exactMatches = await Invoice.findAll({
    where: {
      id: { [Op.ne]: invoiceId },
      invoiceNumber: invoice.invoiceNumber,
      supplierId: invoice.supplierId,
    },
    transaction,
  });

  // Check for fuzzy match on amount and date
  const fuzzyMatches = await Invoice.findAll({
    where: {
      id: { [Op.ne]: invoiceId },
      supplierId: invoice.supplierId,
      invoiceDate: invoice.invoiceDate,
      netAmount: {
        [Op.between]: [
          parseFloat(invoice.netAmount.toString()) * 0.99,
          parseFloat(invoice.netAmount.toString()) * 1.01,
        ],
      },
    },
    transaction,
  });

  return [...exactMatches, ...fuzzyMatches];
};

/**
 * Validates invoice tax amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{isValid: boolean; message: string}>} Validation result
 *
 * @example
 * ```typescript
 * const taxValid = await validateInvoiceTax(sequelize, 1);
 * console.log(taxValid.message);
 * ```
 */
export const validateInvoiceTax = async (
  sequelize: Sequelize,
  invoiceId: number,
  transaction?: Transaction,
): Promise<{ isValid: boolean; message: string }> => {
  const Invoice = createInvoiceModel(sequelize);

  const invoice = await Invoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    return { isValid: false, message: 'Invoice not found' };
  }

  // Get applicable tax rate
  const taxRate = await getApplicableTaxRate(
    sequelize,
    invoice.supplierId,
    invoice.invoiceDate,
    transaction,
  );

  // Calculate expected tax
  const expectedTax = parseFloat(invoice.invoiceAmount.toString()) * taxRate;
  const actualTax = parseFloat(invoice.taxAmount.toString());

  // Allow 1% variance
  if (Math.abs(expectedTax - actualTax) > expectedTax * 0.01) {
    return {
      isValid: false,
      message: `Tax amount variance: Expected ${expectedTax.toFixed(2)}, Got ${actualTax.toFixed(2)}`,
    };
  }

  return { isValid: true, message: 'Tax validation passed' };
};

/**
 * Gets applicable tax rate for supplier and date.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} supplierId - Supplier ID
 * @param {Date} invoiceDate - Invoice date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Tax rate as decimal
 *
 * @example
 * ```typescript
 * const rate = await getApplicableTaxRate(sequelize, 100, new Date());
 * console.log(`Tax rate: ${rate * 100}%`);
 * ```
 */
export const getApplicableTaxRate = async (
  sequelize: Sequelize,
  supplierId: number,
  invoiceDate: Date,
  transaction?: Transaction,
): Promise<number> => {
  const result = await sequelize.query(
    `SELECT tax_rate FROM tax_rates
     WHERE supplier_id = :supplierId
       AND effective_date <= :invoiceDate
       AND (expiry_date IS NULL OR expiry_date >= :invoiceDate)
     ORDER BY effective_date DESC
     LIMIT 1`,
    {
      replacements: { supplierId, invoiceDate },
      type: 'SELECT',
      transaction,
    },
  );

  if (result && (result as any[]).length > 0) {
    return parseFloat((result as any[])[0].tax_rate);
  }

  // Default tax rate
  return 0.08; // 8%
};

/**
 * Calculates invoice line totals.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{totalAmount: number; totalTax: number; totalNet: number}>} Line totals
 *
 * @example
 * ```typescript
 * const totals = await calculateInvoiceLineTotals(sequelize, 1);
 * console.log(totals.totalAmount);
 * ```
 */
export const calculateInvoiceLineTotals = async (
  sequelize: Sequelize,
  invoiceId: number,
  transaction?: Transaction,
): Promise<{ totalAmount: number; totalTax: number; totalNet: number }> => {
  const result = await sequelize.query(
    `SELECT
       COALESCE(SUM(line_amount), 0) as total_amount,
       COALESCE(SUM(tax_amount), 0) as total_tax,
       COALESCE(SUM(net_amount), 0) as total_net
     FROM invoice_lines
     WHERE invoice_id = :invoiceId`,
    {
      replacements: { invoiceId },
      type: 'SELECT',
      transaction,
    },
  );

  const row = (result as any[])[0];
  return {
    totalAmount: parseFloat(row.total_amount),
    totalTax: parseFloat(row.total_tax),
    totalNet: parseFloat(row.total_net),
  };
};

/**
 * Performs three-way matching (PO, Receipt, Invoice).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {PerformThreeWayMatchDto} matchData - Match parameters
 * @param {string} userId - User performing match
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Match results
 *
 * @example
 * ```typescript
 * const matches = await performThreeWayMatch(sequelize, {
 *   invoiceId: 1,
 *   purchaseOrderId: 10,
 *   receiptId: 5,
 *   autoApproveWithinTolerance: true
 * }, 'user123');
 * ```
 */
export const performThreeWayMatch = async (
  sequelize: Sequelize,
  matchData: PerformThreeWayMatchDto,
  userId: string,
  transaction?: Transaction,
): Promise<any[]> => {
  const Invoice = createInvoiceModel(sequelize);
  const InvoiceLine = createInvoiceLineModel(sequelize);

  const invoice = await Invoice.findByPk(matchData.invoiceId, { transaction });
  if (!invoice) {
    throw new Error('Invoice not found');
  }

  const invoiceLines = await InvoiceLine.findAll({
    where: { invoiceId: matchData.invoiceId },
    transaction,
  });

  const matchResults = [];

  for (const invLine of invoiceLines) {
    // Get PO line details
    const poLine = await getPurchaseOrderLine(
      sequelize,
      matchData.purchaseOrderId,
      invLine.purchaseOrderLineId || 0,
      transaction,
    );

    // Get receipt line details
    const receiptLine = await getReceiptLine(
      sequelize,
      matchData.receiptId,
      invLine.purchaseOrderLineId || 0,
      transaction,
    );

    if (!poLine || !receiptLine) {
      matchResults.push({
        invoiceLineId: invLine.id,
        matchStatus: 'exception',
        message: 'No matching PO or receipt line found',
      });
      continue;
    }

    // Calculate variances
    const quantityVariance = parseFloat(invLine.quantity.toString()) - parseFloat(receiptLine.quantity);
    const priceVariance = parseFloat(invLine.unitPrice.toString()) - parseFloat(poLine.unit_price);
    const amountVariance = parseFloat(invLine.netAmount.toString()) - (parseFloat(receiptLine.quantity) * parseFloat(poLine.unit_price));

    // Get matching tolerances
    const tolerance = await getMatchingTolerance(sequelize, invoice.supplierId, transaction);

    const quantityToleranceExceeded = Math.abs(quantityVariance) > tolerance.quantityTolerance;
    const priceToleranceExceeded = Math.abs(priceVariance) > tolerance.priceTolerance;
    const amountToleranceExceeded = Math.abs(amountVariance) > tolerance.amountTolerance;

    let matchStatus = 'matched';
    if (quantityToleranceExceeded && priceToleranceExceeded) {
      matchStatus = 'both_variance';
    } else if (quantityToleranceExceeded) {
      matchStatus = 'quantity_variance';
    } else if (priceToleranceExceeded) {
      matchStatus = 'price_variance';
    }

    const toleranceExceeded = quantityToleranceExceeded || priceToleranceExceeded || amountToleranceExceeded;

    // Create match record
    const match = await sequelize.query(
      `INSERT INTO three_way_matches (
        invoice_id, invoice_line_id, purchase_order_id, purchase_order_line_id,
        receipt_id, receipt_line_id, invoice_quantity, received_quantity, po_quantity,
        invoice_unit_price, po_unit_price, quantity_variance, price_variance,
        amount_variance, match_status, tolerance_exceeded, auto_approved, created_at, updated_at
      ) VALUES (
        :invoiceId, :invoiceLineId, :purchaseOrderId, :purchaseOrderLineId,
        :receiptId, :receiptLineId, :invoiceQuantity, :receivedQuantity, :poQuantity,
        :invoiceUnitPrice, :poUnitPrice, :quantityVariance, :priceVariance,
        :amountVariance, :matchStatus, :toleranceExceeded, :autoApproved, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ) RETURNING *`,
      {
        replacements: {
          invoiceId: matchData.invoiceId,
          invoiceLineId: invLine.id,
          purchaseOrderId: matchData.purchaseOrderId,
          purchaseOrderLineId: invLine.purchaseOrderLineId,
          receiptId: matchData.receiptId,
          receiptLineId: receiptLine.id,
          invoiceQuantity: invLine.quantity,
          receivedQuantity: receiptLine.quantity,
          poQuantity: poLine.quantity,
          invoiceUnitPrice: invLine.unitPrice,
          poUnitPrice: poLine.unit_price,
          quantityVariance,
          priceVariance,
          amountVariance,
          matchStatus,
          toleranceExceeded,
          autoApproved: matchData.autoApproveWithinTolerance && !toleranceExceeded,
        },
        type: 'INSERT',
        transaction,
      },
    );

    matchResults.push(match);
  }

  // Update invoice matching status
  const allMatched = matchResults.every((m: any) => m.match_status === 'matched' && !m.tolerance_exceeded);
  const newMatchingStatus = allMatched ? 'three_way_matched' : 'variance';

  await invoice.update(
    {
      matchingStatus: newMatchingStatus,
      status: allMatched && matchData.autoApproveWithinTolerance ? 'approved' : 'pending_approval',
      updatedBy: userId,
    },
    { transaction },
  );

  return matchResults;
};

/**
 * Gets purchase order line details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} purchaseOrderId - PO ID
 * @param {number} lineId - PO line ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} PO line details
 *
 * @example
 * ```typescript
 * const poLine = await getPurchaseOrderLine(sequelize, 10, 1);
 * console.log(poLine.unit_price);
 * ```
 */
export const getPurchaseOrderLine = async (
  sequelize: Sequelize,
  purchaseOrderId: number,
  lineId: number,
  transaction?: Transaction,
): Promise<any> => {
  const result = await sequelize.query(
    `SELECT * FROM purchase_order_lines
     WHERE purchase_order_id = :purchaseOrderId AND id = :lineId`,
    {
      replacements: { purchaseOrderId, lineId },
      type: 'SELECT',
      transaction,
    },
  );

  return result && (result as any[]).length > 0 ? (result as any[])[0] : null;
};

/**
 * Gets receipt line details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {number} poLineId - PO line ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Receipt line details
 *
 * @example
 * ```typescript
 * const receiptLine = await getReceiptLine(sequelize, 5, 1);
 * console.log(receiptLine.quantity);
 * ```
 */
export const getReceiptLine = async (
  sequelize: Sequelize,
  receiptId: number,
  poLineId: number,
  transaction?: Transaction,
): Promise<any> => {
  const result = await sequelize.query(
    `SELECT * FROM receipt_lines
     WHERE receipt_id = :receiptId AND purchase_order_line_id = :poLineId`,
    {
      replacements: { receiptId, poLineId },
      type: 'SELECT',
      transaction,
    },
  );

  return result && (result as any[]).length > 0 ? (result as any[])[0] : null;
};

/**
 * Gets matching tolerance settings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} supplierId - Supplier ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Tolerance settings
 *
 * @example
 * ```typescript
 * const tolerance = await getMatchingTolerance(sequelize, 100);
 * console.log(tolerance.priceTolerance);
 * ```
 */
export const getMatchingTolerance = async (
  sequelize: Sequelize,
  supplierId: number,
  transaction?: Transaction,
): Promise<any> => {
  const result = await sequelize.query(
    `SELECT * FROM matching_tolerances
     WHERE (supplier_id = :supplierId OR supplier_id IS NULL)
       AND is_active = true
     ORDER BY supplier_id DESC NULLS LAST
     LIMIT 1`,
    {
      replacements: { supplierId },
      type: 'SELECT',
      transaction,
    },
  );

  if (result && (result as any[]).length > 0) {
    const tol = (result as any[])[0];
    return {
      quantityTolerance: parseFloat(tol.tolerance_value || 0),
      priceTolerance: parseFloat(tol.tolerance_value || 0),
      amountTolerance: parseFloat(tol.tolerance_value || 0),
    };
  }

  // Default tolerances
  return {
    quantityTolerance: 5, // 5 units
    priceTolerance: 0.10, // $0.10
    amountTolerance: 10, // $10
  };
};

/**
 * Performs two-way matching (PO and Invoice only).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {PerformTwoWayMatchDto} matchData - Match parameters
 * @param {string} userId - User performing match
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Match results
 *
 * @example
 * ```typescript
 * const matches = await performTwoWayMatch(sequelize, {
 *   invoiceId: 1,
 *   purchaseOrderId: 10,
 *   autoApproveWithinTolerance: true
 * }, 'user123');
 * ```
 */
export const performTwoWayMatch = async (
  sequelize: Sequelize,
  matchData: PerformTwoWayMatchDto,
  userId: string,
  transaction?: Transaction,
): Promise<any[]> => {
  const Invoice = createInvoiceModel(sequelize);
  const InvoiceLine = createInvoiceLineModel(sequelize);

  const invoice = await Invoice.findByPk(matchData.invoiceId, { transaction });
  if (!invoice) {
    throw new Error('Invoice not found');
  }

  const invoiceLines = await InvoiceLine.findAll({
    where: { invoiceId: matchData.invoiceId },
    transaction,
  });

  const matchResults = [];

  for (const invLine of invoiceLines) {
    const poLine = await getPurchaseOrderLine(
      sequelize,
      matchData.purchaseOrderId,
      invLine.purchaseOrderLineId || 0,
      transaction,
    );

    if (!poLine) {
      matchResults.push({
        invoiceLineId: invLine.id,
        matchStatus: 'exception',
        message: 'No matching PO line found',
      });
      continue;
    }

    const quantityVariance = parseFloat(invLine.quantity.toString()) - parseFloat(poLine.quantity);
    const priceVariance = parseFloat(invLine.unitPrice.toString()) - parseFloat(poLine.unit_price);
    const amountVariance = parseFloat(invLine.netAmount.toString()) - (parseFloat(poLine.quantity) * parseFloat(poLine.unit_price));

    const tolerance = await getMatchingTolerance(sequelize, invoice.supplierId, transaction);

    const quantityToleranceExceeded = Math.abs(quantityVariance) > tolerance.quantityTolerance;
    const priceToleranceExceeded = Math.abs(priceVariance) > tolerance.priceTolerance;

    let matchStatus = 'matched';
    if (quantityToleranceExceeded && priceToleranceExceeded) {
      matchStatus = 'both_variance';
    } else if (quantityToleranceExceeded) {
      matchStatus = 'quantity_variance';
    } else if (priceToleranceExceeded) {
      matchStatus = 'price_variance';
    }

    const toleranceExceeded = quantityToleranceExceeded || priceToleranceExceeded;

    const match = await sequelize.query(
      `INSERT INTO two_way_matches (
        invoice_id, invoice_line_id, purchase_order_id, purchase_order_line_id,
        invoice_quantity, po_quantity, invoice_unit_price, po_unit_price,
        quantity_variance, price_variance, amount_variance, match_status,
        tolerance_exceeded, created_at, updated_at
      ) VALUES (
        :invoiceId, :invoiceLineId, :purchaseOrderId, :purchaseOrderLineId,
        :invoiceQuantity, :poQuantity, :invoiceUnitPrice, :poUnitPrice,
        :quantityVariance, :priceVariance, :amountVariance, :matchStatus,
        :toleranceExceeded, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ) RETURNING *`,
      {
        replacements: {
          invoiceId: matchData.invoiceId,
          invoiceLineId: invLine.id,
          purchaseOrderId: matchData.purchaseOrderId,
          purchaseOrderLineId: invLine.purchaseOrderLineId,
          invoiceQuantity: invLine.quantity,
          poQuantity: poLine.quantity,
          invoiceUnitPrice: invLine.unitPrice,
          poUnitPrice: poLine.unit_price,
          quantityVariance,
          priceVariance,
          amountVariance,
          matchStatus,
          toleranceExceeded,
        },
        type: 'INSERT',
        transaction,
      },
    );

    matchResults.push(match);
  }

  const allMatched = matchResults.every((m: any) => m.match_status === 'matched');

  await invoice.update(
    {
      matchingStatus: allMatched ? 'two_way_matched' : 'variance',
      status: allMatched && matchData.autoApproveWithinTolerance ? 'approved' : 'pending_approval',
      updatedBy: userId,
    },
    { transaction },
  );

  return matchResults;
};

/**
 * Approves an invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ApproveInvoiceDto} approvalData - Approval data
 * @param {string} userId - User approving the invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approval record
 *
 * @example
 * ```typescript
 * const approval = await approveInvoice(sequelize, {
 *   invoiceId: 1,
 *   approvalLevel: 1,
 *   comments: 'Approved for payment'
 * }, 'manager123');
 * ```
 */
export const approveInvoice = async (
  sequelize: Sequelize,
  approvalData: ApproveInvoiceDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Invoice = createInvoiceModel(sequelize);

  const invoice = await Invoice.findByPk(approvalData.invoiceId, { transaction });
  if (!invoice) {
    throw new Error('Invoice not found');
  }

  const approval = await sequelize.query(
    `INSERT INTO invoice_approvals (
      invoice_id, approval_level, approver_id, approver_name, approver_role,
      approval_status, approval_date, comments, escalation_level, created_at, updated_at
    ) VALUES (
      :invoiceId, :approvalLevel, :userId, :userName, :userRole,
      'approved', CURRENT_TIMESTAMP, :comments, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`,
    {
      replacements: {
        invoiceId: approvalData.invoiceId,
        approvalLevel: approvalData.approvalLevel,
        userId,
        userName: userId,
        userRole: 'Approver',
        comments: approvalData.comments || '',
      },
      type: 'INSERT',
      transaction,
    },
  );

  await invoice.update(
    {
      approvalStatus: 'approved',
      status: 'approved',
      updatedBy: userId,
    },
    { transaction },
  );

  await createInvoiceAuditTrail(
    sequelize,
    approvalData.invoiceId,
    'APPROVE',
    userId,
    { approvalStatus: invoice.approvalStatus },
    { approvalStatus: 'approved' },
    transaction,
  );

  return approval;
};

/**
 * Places a hold on an invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {PlaceInvoiceHoldDto} holdData - Hold data
 * @param {string} userId - User placing the hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Hold record
 *
 * @example
 * ```typescript
 * const hold = await placeInvoiceHold(sequelize, {
 *   invoiceId: 1,
 *   holdType: 'validation',
 *   holdReason: 'Missing documentation',
 *   priority: 'high'
 * }, 'user123');
 * ```
 */
export const placeInvoiceHold = async (
  sequelize: Sequelize,
  holdData: PlaceInvoiceHoldDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Invoice = createInvoiceModel(sequelize);

  const invoice = await Invoice.findByPk(holdData.invoiceId, { transaction });
  if (!invoice) {
    throw new Error('Invoice not found');
  }

  const hold = await sequelize.query(
    `INSERT INTO invoice_holds (
      invoice_id, hold_type, hold_reason, hold_category, hold_date,
      hold_by, priority, auto_release, created_at, updated_at
    ) VALUES (
      :invoiceId, :holdType, :holdReason, :holdCategory, CURRENT_DATE,
      :userId, :priority, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`,
    {
      replacements: {
        invoiceId: holdData.invoiceId,
        holdType: holdData.holdType,
        holdReason: holdData.holdReason,
        holdCategory: holdData.holdType,
        userId,
        priority: holdData.priority,
      },
      type: 'INSERT',
      transaction,
    },
  );

  await invoice.update({ status: 'on_hold', updatedBy: userId }, { transaction });

  await createInvoiceAuditTrail(
    sequelize,
    holdData.invoiceId,
    'HOLD',
    userId,
    { status: invoice.status },
    { status: 'on_hold', holdReason: holdData.holdReason },
    transaction,
  );

  return hold;
};

/**
 * Releases a hold on an invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} holdId - Hold ID
 * @param {string} releaseNotes - Release notes
 * @param {string} userId - User releasing the hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Released hold
 *
 * @example
 * ```typescript
 * const released = await releaseInvoiceHold(sequelize, 1, 'Documentation received', 'user123');
 * ```
 */
export const releaseInvoiceHold = async (
  sequelize: Sequelize,
  holdId: number,
  releaseNotes: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const result = await sequelize.query(
    `UPDATE invoice_holds
     SET release_date = CURRENT_DATE,
         released_by = :userId,
         release_notes = :releaseNotes,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :holdId
     RETURNING *`,
    {
      replacements: { holdId, userId, releaseNotes },
      type: 'UPDATE',
      transaction,
    },
  );

  if (!result || (result as any[]).length === 0) {
    throw new Error('Hold not found');
  }

  const hold = (result as any[])[0];

  const Invoice = createInvoiceModel(sequelize);
  const invoice = await Invoice.findByPk(hold.invoice_id, { transaction });

  if (invoice) {
    await invoice.update({ status: 'validated', updatedBy: userId }, { transaction });

    await createInvoiceAuditTrail(
      sequelize,
      hold.invoice_id,
      'RELEASE',
      userId,
      { status: 'on_hold' },
      { status: 'validated', releaseNotes },
      transaction,
    );
  }

  return hold;
};

/**
 * Creates an invoice dispute.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateInvoiceDisputeDto} disputeData - Dispute data
 * @param {string} userId - User creating the dispute
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Dispute record
 *
 * @example
 * ```typescript
 * const dispute = await createInvoiceDispute(sequelize, {
 *   invoiceId: 1,
 *   disputeType: 'price',
 *   disputeReason: 'Price does not match PO',
 *   disputeAmount: 500.00,
 *   notifySupplier: true
 * }, 'user123');
 * ```
 */
export const createInvoiceDispute = async (
  sequelize: Sequelize,
  disputeData: CreateInvoiceDisputeDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Invoice = createInvoiceModel(sequelize);

  const invoice = await Invoice.findByPk(disputeData.invoiceId, { transaction });
  if (!invoice) {
    throw new Error('Invoice not found');
  }

  const dispute = await sequelize.query(
    `INSERT INTO invoice_disputes (
      invoice_id, dispute_type, dispute_reason, dispute_amount, dispute_date,
      disputed_by, status, supplier_notified, created_at, updated_at
    ) VALUES (
      :invoiceId, :disputeType, :disputeReason, :disputeAmount, CURRENT_DATE,
      :userId, 'open', :supplierNotified, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`,
    {
      replacements: {
        invoiceId: disputeData.invoiceId,
        disputeType: disputeData.disputeType,
        disputeReason: disputeData.disputeReason,
        disputeAmount: disputeData.disputeAmount,
        userId,
        supplierNotified: disputeData.notifySupplier || false,
      },
      type: 'INSERT',
      transaction,
    },
  );

  await invoice.update({ status: 'disputed', updatedBy: userId }, { transaction });

  if (disputeData.notifySupplier) {
    // In production, send notification to supplier
    // await notifySupplier(invoice.supplierId, dispute);
  }

  await createInvoiceAuditTrail(
    sequelize,
    disputeData.invoiceId,
    'DISPUTE',
    userId,
    { status: invoice.status },
    { status: 'disputed', disputeReason: disputeData.disputeReason },
    transaction,
  );

  return dispute;
};

/**
 * Routes invoice to specified role or user.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RouteInvoiceDto} routingData - Routing data
 * @param {string} userId - User performing routing
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Routing record
 *
 * @example
 * ```typescript
 * const routing = await routeInvoice(sequelize, {
 *   invoiceId: 1,
 *   targetRole: 'accounts_payable',
 *   targetUser: 'ap_clerk_001',
 *   comments: 'Please review urgently'
 * }, 'user123');
 * ```
 */
export const routeInvoice = async (
  sequelize: Sequelize,
  routingData: RouteInvoiceDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  // Get current routing step
  const currentStep = await sequelize.query(
    `SELECT COALESCE(MAX(routing_step), 0) as max_step
     FROM invoice_routings
     WHERE invoice_id = :invoiceId`,
    {
      replacements: { invoiceId: routingData.invoiceId },
      type: 'SELECT',
      transaction,
    },
  );

  const nextStep = ((currentStep as any[])[0].max_step || 0) + 1;

  const routing = await sequelize.query(
    `INSERT INTO invoice_routings (
      invoice_id, routing_step, routing_role, routing_user, routing_date,
      status, comments, created_at, updated_at
    ) VALUES (
      :invoiceId, :routingStep, :routingRole, :routingUser, CURRENT_TIMESTAMP,
      'pending', :comments, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`,
    {
      replacements: {
        invoiceId: routingData.invoiceId,
        routingStep: nextStep,
        routingRole: routingData.targetRole,
        routingUser: routingData.targetUser || null,
        comments: routingData.comments || '',
      },
      type: 'INSERT',
      transaction,
    },
  );

  return routing;
};

/**
 * Uploads invoice image/document.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {any} file - Uploaded file
 * @param {string} userId - User uploading the file
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Image record
 *
 * @example
 * ```typescript
 * const image = await uploadInvoiceImage(sequelize, 1, file, 'user123');
 * console.log(image.filePath);
 * ```
 */
export const uploadInvoiceImage = async (
  sequelize: Sequelize,
  invoiceId: number,
  file: any,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Invoice = createInvoiceModel(sequelize);

  const invoice = await Invoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    throw new Error('Invoice not found');
  }

  const filePath = `/uploads/invoices/${invoiceId}/${file.filename}`;
  const thumbnailPath = `/uploads/invoices/${invoiceId}/thumb_${file.filename}`;

  const image = await sequelize.query(
    `INSERT INTO invoice_images (
      invoice_id, file_name, file_path, file_size, mime_type,
      upload_date, uploaded_by, page_count, thumbnail_path,
      ocr_processed, created_at, updated_at
    ) VALUES (
      :invoiceId, :fileName, :filePath, :fileSize, :mimeType,
      CURRENT_TIMESTAMP, :userId, 1, :thumbnailPath,
      false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`,
    {
      replacements: {
        invoiceId,
        fileName: file.originalname,
        filePath,
        fileSize: file.size,
        mimeType: file.mimetype,
        userId,
        thumbnailPath,
      },
      type: 'INSERT',
      transaction,
    },
  );

  await invoice.update(
    {
      hasImage: true,
      imageUrl: filePath,
      updatedBy: userId,
    },
    { transaction },
  );

  return image;
};

/**
 * Processes invoice image with OCR.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ProcessOCRDto} ocrData - OCR processing data
 * @param {string} userId - User initiating OCR
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<OCRResult>} OCR result
 *
 * @example
 * ```typescript
 * const ocrResult = await processInvoiceOCR(sequelize, {
 *   imageId: 1,
 *   provider: 'google',
 *   autoCreateInvoice: true
 * }, 'user123');
 * console.log(ocrResult.confidence);
 * ```
 */
export const processInvoiceOCR = async (
  sequelize: Sequelize,
  ocrData: ProcessOCRDto,
  userId: string,
  transaction?: Transaction,
): Promise<OCRResult> => {
  // Get image record
  const imageResult = await sequelize.query(
    'SELECT * FROM invoice_images WHERE id = :imageId',
    {
      replacements: { imageId: ocrData.imageId },
      type: 'SELECT',
      transaction,
    },
  );

  if (!imageResult || (imageResult as any[]).length === 0) {
    throw new Error('Invoice image not found');
  }

  const image = (imageResult as any[])[0];

  // In production, call actual OCR service (Google Vision, AWS Textract, etc.)
  // For now, return mock OCR result
  const ocrResult: OCRResult = {
    invoiceNumber: 'INV-2024-OCR-001',
    invoiceDate: '2024-01-15',
    dueDate: '2024-02-15',
    supplierName: 'ACME Corporation',
    supplierAddress: '123 Main St, City, ST 12345',
    totalAmount: 5000.00,
    taxAmount: 400.00,
    lineItems: [
      { description: 'Product A', quantity: 10, unitPrice: 450.00, amount: 4500.00 },
      { description: 'Product B', quantity: 2, unitPrice: 250.00, amount: 500.00 },
    ],
    confidence: 95.5,
    rawData: {},
  };

  // Update image record with OCR data
  await sequelize.query(
    `UPDATE invoice_images
     SET ocr_processed = true,
         ocr_text = :ocrText,
         ocr_data = :ocrData,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :imageId`,
    {
      replacements: {
        imageId: ocrData.imageId,
        ocrText: JSON.stringify(ocrResult),
        ocrData: JSON.stringify(ocrResult.rawData),
      },
      type: 'UPDATE',
      transaction,
    },
  );

  // Update invoice with OCR confidence
  await sequelize.query(
    `UPDATE invoices
     SET ocr_processed = true,
         ocr_confidence = :confidence,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :invoiceId`,
    {
      replacements: {
        invoiceId: image.invoice_id,
        confidence: ocrResult.confidence,
      },
      type: 'UPDATE',
      transaction,
    },
  );

  return ocrResult;
};

/**
 * Applies automated GL coding rules to invoice lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyAutomatedCoding(sequelize, 1);
 * ```
 */
export const applyAutomatedCoding = async (
  sequelize: Sequelize,
  invoiceId: number,
  transaction?: Transaction,
): Promise<void> => {
  const Invoice = createInvoiceModel(sequelize);
  const InvoiceLine = createInvoiceLineModel(sequelize);

  const invoice = await Invoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    throw new Error('Invoice not found');
  }

  const lines = await InvoiceLine.findAll({
    where: { invoiceId },
    transaction,
  });

  for (const line of lines) {
    // Get coding rule for supplier/item
    const rule = await sequelize.query(
      `SELECT * FROM invoice_coding_rules
       WHERE (supplier_id = :supplierId OR supplier_id IS NULL)
         AND (item_category_id = :itemCategoryId OR item_category_id IS NULL)
         AND is_active = true
       ORDER BY priority DESC, supplier_id DESC NULLS LAST
       LIMIT 1`,
      {
        replacements: {
          supplierId: invoice.supplierId,
          itemCategoryId: line.itemId || null,
        },
        type: 'SELECT',
        transaction,
      },
    );

    if (rule && (rule as any[]).length > 0) {
      const codingRule = (rule as any[])[0];

      await line.update(
        {
          glAccountId: codingRule.default_gl_account_id,
          accountCode: codingRule.default_account_code,
          costCenterCode: codingRule.default_cost_center,
          projectCode: codingRule.default_project,
        },
        { transaction },
      );
    }
  }
};

/**
 * Creates invoice audit trail entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} action - Action performed
 * @param {string} userId - User performing action
 * @param {Record<string, any>} oldValues - Old values
 * @param {Record<string, any>} newValues - New values
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Audit trail entry
 *
 * @example
 * ```typescript
 * await createInvoiceAuditTrail(sequelize, 1, 'APPROVE', 'user123',
 *   { status: 'pending' }, { status: 'approved' });
 * ```
 */
export const createInvoiceAuditTrail = async (
  sequelize: Sequelize,
  invoiceId: number,
  action: string,
  userId: string,
  oldValues: Record<string, any>,
  newValues: Record<string, any>,
  transaction?: Transaction,
): Promise<any> => {
  const audit = await sequelize.query(
    `INSERT INTO invoice_audit_trails (
      invoice_id, action, action_date, user_id, user_name,
      old_values, new_values, ip_address, created_at, updated_at
    ) VALUES (
      :invoiceId, :action, CURRENT_TIMESTAMP, :userId, :userName,
      :oldValues, :newValues, :ipAddress, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`,
    {
      replacements: {
        invoiceId,
        action,
        userId,
        userName: userId,
        oldValues: JSON.stringify(oldValues),
        newValues: JSON.stringify(newValues),
        ipAddress: '127.0.0.1',
      },
      type: 'INSERT',
      transaction,
    },
  );

  return audit;
};

/**
 * Retrieves invoice history with audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Invoice audit trail
 *
 * @example
 * ```typescript
 * const history = await getInvoiceHistory(sequelize, 1);
 * console.log(history.length);
 * ```
 */
export const getInvoiceHistory = async (
  sequelize: Sequelize,
  invoiceId: number,
  transaction?: Transaction,
): Promise<any[]> => {
  const result = await sequelize.query(
    `SELECT * FROM invoice_audit_trails
     WHERE invoice_id = :invoiceId
     ORDER BY action_date DESC`,
    {
      replacements: { invoiceId },
      type: 'SELECT',
      transaction,
    },
  );

  return result as any[];
};

/**
 * Cancels an invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} cancelReason - Cancellation reason
 * @param {string} userId - User cancelling the invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancelled invoice
 *
 * @example
 * ```typescript
 * const cancelled = await cancelInvoice(sequelize, 1, 'Duplicate entry', 'user123');
 * ```
 */
export const cancelInvoice = async (
  sequelize: Sequelize,
  invoiceId: number,
  cancelReason: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const Invoice = createInvoiceModel(sequelize);

  const invoice = await Invoice.findByPk(invoiceId, { transaction });
  if (!invoice) {
    throw new Error('Invoice not found');
  }

  if (invoice.paymentStatus === 'paid') {
    throw new Error('Cannot cancel paid invoice');
  }

  await invoice.update(
    {
      status: 'cancelled',
      updatedBy: userId,
      metadata: { ...invoice.metadata, cancelReason, cancelledAt: new Date() },
    },
    { transaction },
  );

  await createInvoiceAuditTrail(
    sequelize,
    invoiceId,
    'CANCEL',
    userId,
    { status: invoice.status },
    { status: 'cancelled', cancelReason },
    transaction,
  );

  return invoice;
};

// ============================================================================
// NESTJS CONTROLLERS
// ============================================================================

/**
 * NestJS Controller for Invoice operations.
 */
@ApiTags('Invoices')
@Controller('api/v1/invoices')
@Injectable()
export class InvoicesController {
  constructor(private readonly sequelize: Sequelize) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(
    @Body(ValidationPipe) createDto: CreateInvoiceDto,
    @Query('userId') userId: string,
  ): Promise<any> {
    return createInvoice(this.sequelize, createDto, userId);
  }

  @Post(':id/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate invoice' })
  @ApiResponse({ status: 200, description: 'Validation result' })
  async validate(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId') userId: string,
  ): Promise<any> {
    return validateInvoice(this.sequelize, { invoiceId: id }, userId);
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve invoice' })
  @ApiResponse({ status: 200, description: 'Invoice approved' })
  async approve(
    @Body(ValidationPipe) approvalDto: ApproveInvoiceDto,
    @Query('userId') userId: string,
  ): Promise<any> {
    return approveInvoice(this.sequelize, approvalDto, userId);
  }

  @Post(':id/hold')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Place invoice on hold' })
  @ApiResponse({ status: 200, description: 'Hold placed' })
  async placeHold(
    @Body(ValidationPipe) holdDto: PlaceInvoiceHoldDto,
    @Query('userId') userId: string,
  ): Promise<any> {
    return placeInvoiceHold(this.sequelize, holdDto, userId);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get invoice history' })
  @ApiResponse({ status: 200, description: 'Invoice history retrieved' })
  async getHistory(@Param('id', ParseIntPipe) id: number): Promise<any[]> {
    return getInvoiceHistory(this.sequelize, id);
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload invoice image' })
  @ApiResponse({ status: 201, description: 'Image uploaded' })
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Query('userId') userId: string,
  ): Promise<any> {
    return uploadInvoiceImage(this.sequelize, id, file, userId);
  }
}

/**
 * NestJS Controller for Invoice Matching operations.
 */
@ApiTags('Invoice Matching')
@Controller('api/v1/invoice-matching')
@Injectable()
export class InvoiceMatchingController {
  constructor(private readonly sequelize: Sequelize) {}

  @Post('three-way')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Perform three-way match' })
  @ApiResponse({ status: 200, description: 'Match completed' })
  async threeWayMatch(
    @Body(ValidationPipe) matchDto: PerformThreeWayMatchDto,
    @Query('userId') userId: string,
  ): Promise<any> {
    return performThreeWayMatch(this.sequelize, matchDto, userId);
  }

  @Post('two-way')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Perform two-way match' })
  @ApiResponse({ status: 200, description: 'Match completed' })
  async twoWayMatch(
    @Body(ValidationPipe) matchDto: PerformTwoWayMatchDto,
    @Query('userId') userId: string,
  ): Promise<any> {
    return performTwoWayMatch(this.sequelize, matchDto, userId);
  }
}

/**
 * NestJS Controller for Invoice Dispute operations.
 */
@ApiTags('Invoice Disputes')
@Controller('api/v1/invoice-disputes')
@Injectable()
export class InvoiceDisputesController {
  constructor(private readonly sequelize: Sequelize) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create invoice dispute' })
  @ApiResponse({ status: 201, description: 'Dispute created' })
  async create(
    @Body(ValidationPipe) disputeDto: CreateInvoiceDisputeDto,
    @Query('userId') userId: string,
  ): Promise<any> {
    return createInvoiceDispute(this.sequelize, disputeDto, userId);
  }
}
