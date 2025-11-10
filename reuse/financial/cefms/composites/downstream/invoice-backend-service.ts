/**
 * CEFMS Invoice Backend Service
 *
 * This service provides comprehensive backend functionality for vendor invoice processing,
 * validation, matching, and payment processing in the Corps of Engineers Financial
 * Management System (CEFMS). It imports and extends functionality from the vendor invoice
 * processing composite.
 *
 * Key Features:
 * - Invoice receipt and data capture
 * - Invoice validation and verification
 * - Automated three-way matching (PO, receipt, invoice)
 * - Invoice approval workflows
 * - Payment processing integration
 * - Invoice discrepancy management
 * - Tax calculation and validation
 * - Invoice aging and tracking
 *
 * @module CEFMSInvoiceBackendService
 */

import { Injectable, Logger, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { Sequelize, DataTypes, Model, Transaction, Op, QueryTypes } from 'sequelize';
import {
  createVendorInvoiceModel,
  createInvoiceLineItemModel,
  CEFMSVendorInvoiceProcessingService
} from '../cefms-vendor-invoice-processing-composite';

/**
 * Invoice status enumeration
 */
export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  MATCHED = 'MATCHED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ON_HOLD = 'ON_HOLD',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED'
}

/**
 * Invoice type enumeration
 */
export enum InvoiceType {
  STANDARD = 'STANDARD',
  PROGRESS_PAYMENT = 'PROGRESS_PAYMENT',
  MILESTONE = 'MILESTONE',
  FINAL = 'FINAL',
  CREDIT_MEMO = 'CREDIT_MEMO',
  DEBIT_MEMO = 'DEBIT_MEMO',
  PREPAYMENT = 'PREPAYMENT',
  RECURRING = 'RECURRING'
}

/**
 * Discrepancy type enumeration
 */
export enum DiscrepancyType {
  QUANTITY_MISMATCH = 'QUANTITY_MISMATCH',
  PRICE_MISMATCH = 'PRICE_MISMATCH',
  MISSING_PO = 'MISSING_PO',
  MISSING_RECEIPT = 'MISSING_RECEIPT',
  TAX_ERROR = 'TAX_ERROR',
  DUPLICATE_INVOICE = 'DUPLICATE_INVOICE',
  EXPIRED_PO = 'EXPIRED_PO',
  VENDOR_MISMATCH = 'VENDOR_MISMATCH',
  OTHER = 'OTHER'
}

/**
 * Tax type enumeration
 */
export enum TaxType {
  SALES_TAX = 'SALES_TAX',
  USE_TAX = 'USE_TAX',
  VAT = 'VAT',
  GST = 'GST',
  EXCISE = 'EXCISE',
  EXEMPT = 'EXEMPT'
}

/**
 * Invoice data interface
 */
export interface InvoiceData {
  invoiceNumber: string;
  vendorId: string;
  purchaseOrderId?: string;
  contractId?: string;
  invoiceType: InvoiceType;
  invoiceDate: Date;
  dueDate: Date;
  currency: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentTerms: string;
  description: string;
  lineItems: InvoiceLineItemData[];
  attachments?: string[];
  metadata?: Record<string, any>;
}

/**
 * Invoice line item data interface
 */
export interface InvoiceLineItemData {
  lineNumber: number;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxAmount: number;
  accountCode: string;
  poLineItemId?: string;
}

/**
 * Invoice validation result interface
 */
export interface InvoiceValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  discrepancies: DiscrepancyData[];
}

/**
 * Discrepancy data interface
 */
export interface DiscrepancyData {
  discrepancyType: DiscrepancyType;
  description: string;
  expectedValue: any;
  actualValue: any;
  lineItemId?: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

/**
 * Invoice matching result interface
 */
export interface InvoiceMatchingResult {
  matched: boolean;
  matchPercentage: number;
  poMatched: boolean;
  receiptMatched: boolean;
  quantityVariance: number;
  priceVariance: number;
  discrepancies: DiscrepancyData[];
}

/**
 * Invoice discrepancy model
 */
export const createInvoiceDiscrepancyModel = (sequelize: Sequelize) => {
  class InvoiceDiscrepancy extends Model {
    public id!: string;
    public invoiceId!: string;
    public invoiceNumber!: string;
    public discrepancyType!: DiscrepancyType;
    public description!: string;
    public expectedValue!: string;
    public actualValue!: string;
    public lineItemId!: string;
    public severity!: 'HIGH' | 'MEDIUM' | 'LOW';
    public status!: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'WAIVED';
    public identifiedBy!: string;
    public identifiedDate!: Date;
    public assignedTo!: string;
    public resolutionNotes!: string;
    public resolvedBy!: string;
    public resolvedDate!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InvoiceDiscrepancy.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the discrepancy'
      },
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the invoice'
      },
      invoiceNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Invoice number for reference'
      },
      discrepancyType: {
        type: DataTypes.ENUM(...Object.values(DiscrepancyType)),
        allowNull: false,
        comment: 'Type of discrepancy'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed description of the discrepancy'
      },
      expectedValue: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Expected value'
      },
      actualValue: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Actual value found'
      },
      lineItemId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Reference to line item if applicable'
      },
      severity: {
        type: DataTypes.ENUM('HIGH', 'MEDIUM', 'LOW'),
        allowNull: false,
        comment: 'Severity of the discrepancy'
      },
      status: {
        type: DataTypes.ENUM('OPEN', 'INVESTIGATING', 'RESOLVED', 'WAIVED'),
        allowNull: false,
        defaultValue: 'OPEN',
        comment: 'Current status of the discrepancy'
      },
      identifiedBy: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Person who identified the discrepancy'
      },
      identifiedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date discrepancy was identified'
      },
      assignedTo: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Person assigned to investigate'
      },
      resolutionNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Notes about how discrepancy was resolved'
      },
      resolvedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Person who resolved the discrepancy'
      },
      resolvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date discrepancy was resolved'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional discrepancy metadata'
      }
    },
    {
      sequelize,
      tableName: 'invoice_discrepancies',
      timestamps: true,
      indexes: [
        { fields: ['invoiceId'] },
        { fields: ['invoiceNumber'] },
        { fields: ['discrepancyType'] },
        { fields: ['severity'] },
        { fields: ['status'] },
        { fields: ['identifiedDate'] }
      ]
    }
  );

  return InvoiceDiscrepancy;
};

/**
 * Invoice tax line model
 */
export const createInvoiceTaxLineModel = (sequelize: Sequelize) => {
  class InvoiceTaxLine extends Model {
    public id!: string;
    public invoiceId!: string;
    public taxType!: TaxType;
    public taxDescription!: string;
    public taxableAmount!: number;
    public taxRate!: number;
    public taxAmount!: number;
    public taxJurisdiction!: string;
    public taxExemptionNumber!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InvoiceTaxLine.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the tax line'
      },
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the invoice'
      },
      taxType: {
        type: DataTypes.ENUM(...Object.values(TaxType)),
        allowNull: false,
        comment: 'Type of tax'
      },
      taxDescription: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Description of the tax'
      },
      taxableAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Amount subject to tax'
      },
      taxRate: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: false,
        comment: 'Tax rate as decimal (e.g., 0.0825 for 8.25%)'
      },
      taxAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Calculated tax amount'
      },
      taxJurisdiction: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Tax jurisdiction (state, county, city)'
      },
      taxExemptionNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Tax exemption number if applicable'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional tax metadata'
      }
    },
    {
      sequelize,
      tableName: 'invoice_tax_lines',
      timestamps: true,
      indexes: [
        { fields: ['invoiceId'] },
        { fields: ['taxType'] },
        { fields: ['taxJurisdiction'] }
      ]
    }
  );

  return InvoiceTaxLine;
};

/**
 * Invoice attachment model
 */
export const createInvoiceAttachmentModel = (sequelize: Sequelize) => {
  class InvoiceAttachment extends Model {
    public id!: string;
    public invoiceId!: string;
    public fileName!: string;
    public fileType!: string;
    public fileSize!: number;
    public filePath!: string;
    public uploadedBy!: string;
    public uploadedDate!: Date;
    public description!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InvoiceAttachment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the attachment'
      },
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the invoice'
      },
      fileName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Name of the file'
      },
      fileType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'File type/extension'
      },
      fileSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'File size in bytes'
      },
      filePath: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Path to the stored file'
      },
      uploadedBy: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Person who uploaded the file'
      },
      uploadedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date file was uploaded'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Description of the attachment'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional attachment metadata'
      }
    },
    {
      sequelize,
      tableName: 'invoice_attachments',
      timestamps: true,
      indexes: [
        { fields: ['invoiceId'] },
        { fields: ['uploadedDate'] }
      ]
    }
  );

  return InvoiceAttachment;
};

/**
 * Invoice comment model
 */
export const createInvoiceCommentModel = (sequelize: Sequelize) => {
  class InvoiceComment extends Model {
    public id!: string;
    public invoiceId!: string;
    public commentText!: string;
    public commentType!: 'NOTE' | 'APPROVAL' | 'REJECTION' | 'QUESTION' | 'RESOLUTION';
    public commentedBy!: string;
    public commentedByName!: string;
    public commentDate!: Date;
    public isInternal!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InvoiceComment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the comment'
      },
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the invoice'
      },
      commentText: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Comment text'
      },
      commentType: {
        type: DataTypes.ENUM('NOTE', 'APPROVAL', 'REJECTION', 'QUESTION', 'RESOLUTION'),
        allowNull: false,
        comment: 'Type of comment'
      },
      commentedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'User ID who made the comment'
      },
      commentedByName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Name of user who made the comment'
      },
      commentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date comment was made'
      },
      isInternal: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether comment is internal only'
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional comment metadata'
      }
    },
    {
      sequelize,
      tableName: 'invoice_comments',
      timestamps: true,
      indexes: [
        { fields: ['invoiceId'] },
        { fields: ['commentedBy'] },
        { fields: ['commentType'] },
        { fields: ['commentDate'] }
      ]
    }
  );

  return InvoiceComment;
};

/**
 * Invoice aging bucket model
 */
export const createInvoiceAgingBucketModel = (sequelize: Sequelize) => {
  class InvoiceAgingBucket extends Model {
    public id!: string;
    public invoiceId!: string;
    public invoiceNumber!: string;
    public vendorId!: string;
    public vendorName!: string;
    public invoiceDate!: Date;
    public dueDate!: Date;
    public totalAmount!: number;
    public paidAmount!: number;
    public remainingAmount!: number;
    public daysOutstanding!: number;
    public agingBucket!: 'CURRENT' | '1_30_DAYS' | '31_60_DAYS' | '61_90_DAYS' | 'OVER_90_DAYS';
    public status!: InvoiceStatus;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InvoiceAgingBucket.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Unique identifier for the aging record'
      },
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        comment: 'Reference to the invoice'
      },
      invoiceNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Invoice number for reference'
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Reference to the vendor'
      },
      vendorName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Vendor name for reference'
      },
      invoiceDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Invoice date'
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Invoice due date'
      },
      totalAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Total invoice amount'
      },
      paidAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Amount paid to date'
      },
      remainingAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Remaining amount due'
      },
      daysOutstanding: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Number of days invoice has been outstanding'
      },
      agingBucket: {
        type: DataTypes.ENUM('CURRENT', '1_30_DAYS', '31_60_DAYS', '61_90_DAYS', 'OVER_90_DAYS'),
        allowNull: false,
        comment: 'Aging bucket category'
      },
      status: {
        type: DataTypes.ENUM(...Object.values(InvoiceStatus)),
        allowNull: false,
        comment: 'Current invoice status'
      }
    },
    {
      sequelize,
      tableName: 'invoice_aging_buckets',
      timestamps: true,
      indexes: [
        { fields: ['invoiceId'], unique: true },
        { fields: ['vendorId'] },
        { fields: ['agingBucket'] },
        { fields: ['status'] },
        { fields: ['daysOutstanding'] }
      ]
    }
  );

  return InvoiceAgingBucket;
};

/**
 * Main CEFMS Invoice Backend Service
 *
 * Provides comprehensive invoice processing, validation, matching, and
 * payment coordination functionality.
 */
@Injectable()
export class CEFMSInvoiceBackendService {
  private readonly logger = new Logger(CEFMSInvoiceBackendService.name);

  constructor(
    private readonly sequelize: Sequelize,
    private readonly invoiceProcessingService: CEFMSVendorInvoiceProcessingService
  ) {}

  /**
   * Creates a new invoice
   *
   * @param invoiceData - Invoice data
   * @param userId - User ID
   * @returns Created invoice
   */
  async createInvoice(invoiceData: InvoiceData, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Creating invoice: ${invoiceData.invoiceNumber}`);

      // Validate invoice data
      const validationResult = await this.validateInvoiceData(invoiceData);
      if (!validationResult.isValid) {
        throw new BadRequestException(`Invoice validation failed: ${validationResult.errors.join(', ')}`);
      }

      // Check for duplicate invoice
      await this.checkDuplicateInvoice(invoiceData.invoiceNumber, invoiceData.vendorId);

      // Get vendor name
      const vendorName = await this.getVendorName(invoiceData.vendorId);

      // Create invoice using composite service
      const VendorInvoice = createVendorInvoiceModel(this.sequelize);
      const invoice = await VendorInvoice.create(
        {
          invoiceNumber: invoiceData.invoiceNumber,
          vendorId: invoiceData.vendorId,
          vendorName,
          purchaseOrderId: invoiceData.purchaseOrderId || null,
          contractId: invoiceData.contractId || null,
          invoiceType: invoiceData.invoiceType,
          invoiceDate: invoiceData.invoiceDate,
          dueDate: invoiceData.dueDate,
          currency: invoiceData.currency || 'USD',
          subtotal: invoiceData.subtotal,
          taxAmount: invoiceData.taxAmount,
          shippingAmount: invoiceData.shippingAmount || 0,
          discountAmount: invoiceData.discountAmount || 0,
          totalAmount: invoiceData.totalAmount,
          paidAmount: 0,
          remainingAmount: invoiceData.totalAmount,
          paymentTerms: invoiceData.paymentTerms,
          description: invoiceData.description,
          status: InvoiceStatus.DRAFT,
          metadata: { ...invoiceData.metadata, createdBy: userId }
        },
        { transaction }
      );

      // Create line items
      await this.createInvoiceLineItems(invoice.id, invoiceData.lineItems, transaction);

      // Create tax lines if applicable
      if (invoiceData.taxAmount > 0) {
        await this.createTaxLines(invoice.id, invoiceData, transaction);
      }

      // Create aging bucket record
      await this.createAgingBucket(invoice, transaction);

      // Record discrepancies if any
      if (validationResult.discrepancies.length > 0) {
        await this.recordDiscrepancies(invoice.id, invoiceData.invoiceNumber, validationResult.discrepancies, userId, transaction);
      }

      await transaction.commit();
      this.logger.log(`Invoice created successfully: ${invoiceData.invoiceNumber}`);

      return invoice;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to create invoice: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Validates invoice data
   *
   * @param invoiceData - Invoice data to validate
   * @returns Validation result
   */
  private async validateInvoiceData(invoiceData: InvoiceData): Promise<InvoiceValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const discrepancies: DiscrepancyData[] = [];

    // Basic validation
    if (!invoiceData.invoiceNumber || invoiceData.invoiceNumber.length === 0) {
      errors.push('Invoice number is required');
    }

    if (invoiceData.totalAmount <= 0) {
      errors.push('Total amount must be greater than zero');
    }

    if (!invoiceData.lineItems || invoiceData.lineItems.length === 0) {
      errors.push('At least one line item is required');
    }

    // Validate line items sum matches total
    const lineItemsTotal = invoiceData.lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const calculatedTotal = lineItemsTotal + invoiceData.taxAmount + invoiceData.shippingAmount - invoiceData.discountAmount;

    if (Math.abs(calculatedTotal - invoiceData.totalAmount) > 0.01) {
      discrepancies.push({
        discrepancyType: DiscrepancyType.PRICE_MISMATCH,
        description: 'Invoice total does not match sum of line items',
        expectedValue: calculatedTotal,
        actualValue: invoiceData.totalAmount,
        severity: 'HIGH'
      });
    }

    // If PO is provided, validate against PO
    if (invoiceData.purchaseOrderId) {
      const poValidation = await this.validateAgainstPO(invoiceData);
      discrepancies.push(...poValidation.discrepancies);
    }

    // Check invoice date is not in future
    if (invoiceData.invoiceDate > new Date()) {
      warnings.push('Invoice date is in the future');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      discrepancies
    };
  }

  /**
   * Validates invoice against purchase order
   *
   * @param invoiceData - Invoice data
   * @returns Validation result with discrepancies
   */
  private async validateAgainstPO(invoiceData: InvoiceData): Promise<InvoiceValidationResult> {
    const discrepancies: DiscrepancyData[] = [];

    try {
      const po = await this.getPurchaseOrder(invoiceData.purchaseOrderId);

      if (!po) {
        discrepancies.push({
          discrepancyType: DiscrepancyType.MISSING_PO,
          description: 'Purchase order not found',
          expectedValue: invoiceData.purchaseOrderId,
          actualValue: null,
          severity: 'HIGH'
        });
        return { isValid: false, errors: [], warnings: [], discrepancies };
      }

      // Validate vendor matches
      if (po.vendorId !== invoiceData.vendorId) {
        discrepancies.push({
          discrepancyType: DiscrepancyType.VENDOR_MISMATCH,
          description: 'Invoice vendor does not match PO vendor',
          expectedValue: po.vendorId,
          actualValue: invoiceData.vendorId,
          severity: 'HIGH'
        });
      }

      // Validate total amount
      const poTotalWithTolerance = po.totalAmount * 1.05; // 5% tolerance
      if (invoiceData.totalAmount > poTotalWithTolerance) {
        discrepancies.push({
          discrepancyType: DiscrepancyType.PRICE_MISMATCH,
          description: 'Invoice amount exceeds PO amount by more than 5%',
          expectedValue: po.totalAmount,
          actualValue: invoiceData.totalAmount,
          severity: 'MEDIUM'
        });
      }
    } catch (error) {
      this.logger.error(`Failed to validate against PO: ${error.message}`, error.stack);
    }

    return { isValid: discrepancies.length === 0, errors: [], warnings: [], discrepancies };
  }

  /**
   * Gets purchase order details
   *
   * @param poId - Purchase order ID
   * @returns Purchase order
   */
  private async getPurchaseOrder(poId: string): Promise<any> {
    const result = await this.sequelize.query(
      `SELECT * FROM purchase_orders WHERE id = :poId`,
      {
        replacements: { poId },
        type: QueryTypes.SELECT
      }
    );

    return result && result.length > 0 ? result[0] : null;
  }

  /**
   * Checks for duplicate invoice
   *
   * @param invoiceNumber - Invoice number
   * @param vendorId - Vendor ID
   */
  private async checkDuplicateInvoice(invoiceNumber: string, vendorId: string): Promise<void> {
    const VendorInvoice = createVendorInvoiceModel(this.sequelize);
    const existing = await VendorInvoice.findOne({
      where: {
        invoiceNumber,
        vendorId,
        status: {
          [Op.not]: InvoiceStatus.CANCELLED
        }
      }
    });

    if (existing) {
      throw new ConflictException(`Duplicate invoice: Invoice ${invoiceNumber} already exists for this vendor`);
    }
  }

  /**
   * Gets vendor name by ID
   *
   * @param vendorId - Vendor ID
   * @returns Vendor name
   */
  private async getVendorName(vendorId: string): Promise<string> {
    const result = await this.sequelize.query(
      `SELECT vendor_name FROM vendors WHERE id = :vendorId`,
      {
        replacements: { vendorId },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      throw new NotFoundException(`Vendor not found: ${vendorId}`);
    }

    return result[0]['vendor_name'];
  }

  /**
   * Creates invoice line items
   *
   * @param invoiceId - Invoice ID
   * @param lineItems - Line item data
   * @param transaction - Database transaction
   */
  private async createInvoiceLineItems(
    invoiceId: string,
    lineItems: InvoiceLineItemData[],
    transaction: Transaction
  ): Promise<void> {
    const InvoiceLineItem = createInvoiceLineItemModel(this.sequelize);

    for (const item of lineItems) {
      await InvoiceLineItem.create(
        {
          invoiceId,
          lineNumber: item.lineNumber,
          itemDescription: item.itemDescription,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          taxAmount: item.taxAmount || 0,
          accountCode: item.accountCode,
          poLineItemId: item.poLineItemId || null
        },
        { transaction }
      );
    }
  }

  /**
   * Creates tax lines for invoice
   *
   * @param invoiceId - Invoice ID
   * @param invoiceData - Invoice data
   * @param transaction - Database transaction
   */
  private async createTaxLines(
    invoiceId: string,
    invoiceData: InvoiceData,
    transaction: Transaction
  ): Promise<void> {
    const InvoiceTaxLine = createInvoiceTaxLineModel(this.sequelize);

    // Determine tax jurisdiction based on delivery address or vendor location
    const taxJurisdiction = 'United States'; // Would be calculated based on actual location

    await InvoiceTaxLine.create(
      {
        invoiceId,
        taxType: TaxType.SALES_TAX,
        taxDescription: 'Sales Tax',
        taxableAmount: invoiceData.subtotal,
        taxRate: invoiceData.taxAmount / invoiceData.subtotal,
        taxAmount: invoiceData.taxAmount,
        taxJurisdiction,
        taxExemptionNumber: null
      },
      { transaction }
    );
  }

  /**
   * Creates aging bucket record for invoice
   *
   * @param invoice - Invoice record
   * @param transaction - Database transaction
   */
  private async createAgingBucket(invoice: any, transaction: Transaction): Promise<void> {
    const InvoiceAgingBucket = createInvoiceAgingBucketModel(this.sequelize);

    const daysOutstanding = this.calculateDaysOutstanding(invoice.invoiceDate);
    const agingBucket = this.determineAgingBucket(daysOutstanding);

    await InvoiceAgingBucket.create(
      {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        vendorId: invoice.vendorId,
        vendorName: invoice.vendorName,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        totalAmount: invoice.totalAmount,
        paidAmount: 0,
        remainingAmount: invoice.totalAmount,
        daysOutstanding,
        agingBucket,
        status: invoice.status
      },
      { transaction }
    );
  }

  /**
   * Calculates days outstanding for invoice
   *
   * @param invoiceDate - Invoice date
   * @returns Days outstanding
   */
  private calculateDaysOutstanding(invoiceDate: Date): number {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - invoiceDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Determines aging bucket for invoice
   *
   * @param daysOutstanding - Days outstanding
   * @returns Aging bucket
   */
  private determineAgingBucket(daysOutstanding: number): 'CURRENT' | '1_30_DAYS' | '31_60_DAYS' | '61_90_DAYS' | 'OVER_90_DAYS' {
    if (daysOutstanding <= 0) return 'CURRENT';
    if (daysOutstanding <= 30) return '1_30_DAYS';
    if (daysOutstanding <= 60) return '31_60_DAYS';
    if (daysOutstanding <= 90) return '61_90_DAYS';
    return 'OVER_90_DAYS';
  }

  /**
   * Records discrepancies for invoice
   *
   * @param invoiceId - Invoice ID
   * @param invoiceNumber - Invoice number
   * @param discrepancies - Array of discrepancies
   * @param userId - User ID
   * @param transaction - Database transaction
   */
  private async recordDiscrepancies(
    invoiceId: string,
    invoiceNumber: string,
    discrepancies: DiscrepancyData[],
    userId: string,
    transaction: Transaction
  ): Promise<void> {
    const InvoiceDiscrepancy = createInvoiceDiscrepancyModel(this.sequelize);

    for (const discrepancy of discrepancies) {
      await InvoiceDiscrepancy.create(
        {
          invoiceId,
          invoiceNumber,
          discrepancyType: discrepancy.discrepancyType,
          description: discrepancy.description,
          expectedValue: String(discrepancy.expectedValue),
          actualValue: String(discrepancy.actualValue),
          lineItemId: discrepancy.lineItemId || null,
          severity: discrepancy.severity,
          status: 'OPEN',
          identifiedBy: await this.getUserName(userId),
          identifiedDate: new Date()
        },
        { transaction }
      );
    }
  }

  /**
   * Gets user name by ID
   *
   * @param userId - User ID
   * @returns User full name
   */
  private async getUserName(userId: string): Promise<string> {
    const result = await this.sequelize.query(
      `SELECT full_name FROM users WHERE id = :userId`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      return 'Unknown User';
    }

    return result[0]['full_name'];
  }

  /**
   * Performs three-way matching for invoice
   *
   * @param invoiceId - Invoice ID
   * @param userId - User ID
   * @returns Matching result
   */
  async performThreeWayMatching(invoiceId: string, userId: string): Promise<InvoiceMatchingResult> {
    try {
      this.logger.log(`Performing three-way matching for invoice: ${invoiceId}`);

      const VendorInvoice = createVendorInvoiceModel(this.sequelize);
      const invoice = await VendorInvoice.findByPk(invoiceId);

      if (!invoice) {
        throw new NotFoundException(`Invoice not found: ${invoiceId}`);
      }

      if (!invoice.purchaseOrderId) {
        throw new BadRequestException('Invoice must have a purchase order for three-way matching');
      }

      // Get PO and receipt data
      const po = await this.getPurchaseOrder(invoice.purchaseOrderId);
      const receipts = await this.getReceiptsForPO(invoice.purchaseOrderId);

      if (!po) {
        return {
          matched: false,
          matchPercentage: 0,
          poMatched: false,
          receiptMatched: false,
          quantityVariance: 0,
          priceVariance: 0,
          discrepancies: [{
            discrepancyType: DiscrepancyType.MISSING_PO,
            description: 'Purchase order not found',
            expectedValue: invoice.purchaseOrderId,
            actualValue: null,
            severity: 'HIGH'
          }]
        };
      }

      if (!receipts || receipts.length === 0) {
        return {
          matched: false,
          matchPercentage: 0,
          poMatched: true,
          receiptMatched: false,
          quantityVariance: 0,
          priceVariance: 0,
          discrepancies: [{
            discrepancyType: DiscrepancyType.MISSING_RECEIPT,
            description: 'No receipts found for purchase order',
            expectedValue: invoice.purchaseOrderId,
            actualValue: null,
            severity: 'HIGH'
          }]
        };
      }

      // Calculate variances
      const quantityVariance = this.calculateQuantityVariance(invoice, po, receipts);
      const priceVariance = this.calculatePriceVariance(invoice, po);

      const tolerance = 0.05; // 5% tolerance
      const quantityMatched = Math.abs(quantityVariance) <= tolerance;
      const priceMatched = Math.abs(priceVariance) <= tolerance;

      const matched = quantityMatched && priceMatched;
      const matchPercentage = ((quantityMatched ? 50 : 0) + (priceMatched ? 50 : 0));

      const discrepancies: DiscrepancyData[] = [];
      if (!quantityMatched) {
        discrepancies.push({
          discrepancyType: DiscrepancyType.QUANTITY_MISMATCH,
          description: `Quantity variance exceeds tolerance: ${(quantityVariance * 100).toFixed(2)}%`,
          expectedValue: 0,
          actualValue: quantityVariance,
          severity: 'MEDIUM'
        });
      }

      if (!priceMatched) {
        discrepancies.push({
          discrepancyType: DiscrepancyType.PRICE_MISMATCH,
          description: `Price variance exceeds tolerance: ${(priceVariance * 100).toFixed(2)}%`,
          expectedValue: po.totalAmount,
          actualValue: invoice.totalAmount,
          severity: 'MEDIUM'
        });
      }

      return {
        matched,
        matchPercentage,
        poMatched: true,
        receiptMatched: true,
        quantityVariance,
        priceVariance,
        discrepancies
      };
    } catch (error) {
      this.logger.error(`Failed to perform three-way matching: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Gets receipts for purchase order
   *
   * @param poId - Purchase order ID
   * @returns Array of receipts
   */
  private async getReceiptsForPO(poId: string): Promise<any[]> {
    const result = await this.sequelize.query(
      `SELECT * FROM purchase_order_receipts WHERE purchase_order_id = :poId`,
      {
        replacements: { poId },
        type: QueryTypes.SELECT
      }
    );

    return result;
  }

  /**
   * Calculates quantity variance between invoice, PO, and receipts
   *
   * @param invoice - Invoice
   * @param po - Purchase order
   * @param receipts - Receipts
   * @returns Quantity variance percentage
   */
  private calculateQuantityVariance(invoice: any, po: any, receipts: any[]): number {
    const totalReceived = receipts.reduce((sum, r) => sum + parseFloat(r.received_quantity), 0);
    const invoicedQuantity = invoice.lineItems ? invoice.lineItems.reduce((sum: number, item: any) => sum + item.quantity, 0) : 0;

    if (totalReceived === 0) return 0;

    return (invoicedQuantity - totalReceived) / totalReceived;
  }

  /**
   * Calculates price variance between invoice and PO
   *
   * @param invoice - Invoice
   * @param po - Purchase order
   * @returns Price variance percentage
   */
  private calculatePriceVariance(invoice: any, po: any): number {
    if (po.totalAmount === 0) return 0;

    return (parseFloat(invoice.totalAmount) - parseFloat(po.totalAmount)) / parseFloat(po.totalAmount);
  }

  /**
   * Submits invoice for approval
   *
   * @param invoiceId - Invoice ID
   * @param userId - User ID
   * @returns Updated invoice
   */
  async submitInvoice(invoiceId: string, userId: string): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Submitting invoice: ${invoiceId}`);

      const VendorInvoice = createVendorInvoiceModel(this.sequelize);
      const invoice = await VendorInvoice.findByPk(invoiceId, { transaction });

      if (!invoice) {
        throw new NotFoundException(`Invoice not found: ${invoiceId}`);
      }

      if (invoice.status !== InvoiceStatus.DRAFT) {
        throw new BadRequestException(`Invoice must be in DRAFT status to submit. Current status: ${invoice.status}`);
      }

      await invoice.update(
        {
          status: InvoiceStatus.SUBMITTED,
          metadata: { ...invoice.metadata, submittedBy: userId, submittedDate: new Date() }
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Invoice submitted: ${invoice.invoiceNumber}`);

      return invoice;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to submit invoice: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Adds a comment to an invoice
   *
   * @param invoiceId - Invoice ID
   * @param commentData - Comment data
   * @param userId - User ID
   * @returns Created comment
   */
  async addInvoiceComment(
    invoiceId: string,
    commentData: { text: string; type: 'NOTE' | 'APPROVAL' | 'REJECTION' | 'QUESTION' | 'RESOLUTION'; isInternal: boolean },
    userId: string
  ): Promise<any> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Adding comment to invoice: ${invoiceId}`);

      const InvoiceComment = createInvoiceCommentModel(this.sequelize);
      const comment = await InvoiceComment.create(
        {
          invoiceId,
          commentText: commentData.text,
          commentType: commentData.type,
          commentedBy: userId,
          commentedByName: await this.getUserName(userId),
          commentDate: new Date(),
          isInternal: commentData.isInternal
        },
        { transaction }
      );

      await transaction.commit();
      this.logger.log(`Comment added to invoice: ${invoiceId}`);

      return comment;
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to add comment: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generates invoice aging report
   *
   * @param vendorId - Vendor ID (optional)
   * @returns Aging report
   */
  async generateInvoiceAgingReport(vendorId?: string): Promise<any> {
    try {
      this.logger.log(`Generating invoice aging report${vendorId ? ` for vendor: ${vendorId}` : ''}`);

      const whereClause = vendorId ? 'WHERE vendor_id = :vendorId' : '';
      const replacements = vendorId ? { vendorId } : {};

      const result = await this.sequelize.query(
        `
        SELECT
          aging_bucket,
          COUNT(*) as invoice_count,
          SUM(remaining_amount) as total_amount
        FROM invoice_aging_buckets
        ${whereClause}
          AND status NOT IN ('PAID', 'CANCELLED')
        GROUP BY aging_bucket
        ORDER BY
          CASE aging_bucket
            WHEN 'CURRENT' THEN 1
            WHEN '1_30_DAYS' THEN 2
            WHEN '31_60_DAYS' THEN 3
            WHEN '61_90_DAYS' THEN 4
            WHEN 'OVER_90_DAYS' THEN 5
          END
        `,
        {
          replacements,
          type: QueryTypes.SELECT
        }
      );

      const totalInvoices = result.reduce((sum, row) => sum + parseInt(row['invoice_count']), 0);
      const totalAmount = result.reduce((sum, row) => sum + parseFloat(row['total_amount']), 0);

      return {
        agingBuckets: result,
        summary: {
          totalInvoices,
          totalAmount
        },
        generatedAt: new Date()
      };
    } catch (error) {
      this.logger.error(`Failed to generate aging report: ${error.message}`, error.stack);
      throw error;
    }
  }
}

/**
 * Export all models and services
 */
export default {
  CEFMSInvoiceBackendService,
  createInvoiceDiscrepancyModel,
  createInvoiceTaxLineModel,
  createInvoiceAttachmentModel,
  createInvoiceCommentModel,
  createInvoiceAgingBucketModel,
  InvoiceStatus,
  InvoiceType,
  DiscrepancyType,
  TaxType
};
