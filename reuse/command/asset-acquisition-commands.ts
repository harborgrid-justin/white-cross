/**
 * ASSET ACQUISITION COMMAND FUNCTIONS
 *
 * Enterprise-grade asset procurement and acquisition management system competing with
 * Oracle JD Edwards EnterpriseOne. Provides comprehensive functionality for:
 * - Purchase requisition and approval workflows
 * - Vendor selection and RFQ/RFP processing
 * - Purchase order creation and management
 * - Contract lifecycle management
 * - Budget validation and tracking
 * - Asset receiving and inspection
 * - Asset tagging and registration
 * - Procurement analytics and reporting
 * - Multi-level approval routing
 * - Supplier performance tracking
 *
 * @module AssetAcquisitionCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   createPurchaseRequisition,
 *   createRFQ,
 *   createPurchaseOrder,
 *   receiveAsset,
 *   PurchaseRequisition,
 *   ApprovalStatus
 * } from './asset-acquisition-commands';
 *
 * // Create purchase requisition
 * const requisition = await createPurchaseRequisition({
 *   requestorId: 'user-123',
 *   departmentId: 'dept-456',
 *   items: [{
 *     assetTypeId: 'laptop-dell-xps',
 *     quantity: 10,
 *     estimatedUnitCost: 1500,
 *     justification: 'New employee onboarding'
 *   }],
 *   priority: PriorityLevel.HIGH
 * });
 *
 * // Create RFQ for vendor quotes
 * const rfq = await createRFQ({
 *   requisitionId: requisition.id,
 *   vendorIds: ['vendor-1', 'vendor-2', 'vendor-3'],
 *   responseDeadline: new Date('2024-06-01')
 * });
 * ```
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BeforeCreate,
  AfterCreate,
} from 'sequelize-typescript';
import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsObject,
  IsUUID,
  IsArray,
  Min,
  Max,
  ValidateNested,
  IsEmail,
  IsUrl,
  MinLength,
  MaxLength,
  IsDecimal,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions, Sequelize } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Requisition approval status
 */
export enum ApprovalStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold',
}

/**
 * Purchase order status
 */
export enum PurchaseOrderStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  ISSUED = 'issued',
  PARTIALLY_RECEIVED = 'partially_received',
  FULLY_RECEIVED = 'fully_received',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

/**
 * RFQ/RFP status
 */
export enum RFQStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  IN_REVIEW = 'in_review',
  AWARDED = 'awarded',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

/**
 * Priority levels
 */
export enum PriorityLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

/**
 * Contract types
 */
export enum ContractType {
  PURCHASE_AGREEMENT = 'purchase_agreement',
  BLANKET_ORDER = 'blanket_order',
  SERVICE_CONTRACT = 'service_contract',
  LEASE_AGREEMENT = 'lease_agreement',
  MAINTENANCE_CONTRACT = 'maintenance_contract',
  FRAMEWORK_AGREEMENT = 'framework_agreement',
}

/**
 * Contract status
 */
export enum ContractStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
  RENEWED = 'renewed',
}

/**
 * Receiving status
 */
export enum ReceivingStatus {
  PENDING = 'pending',
  IN_INSPECTION = 'in_inspection',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PARTIALLY_ACCEPTED = 'partially_accepted',
}

/**
 * Inspection result
 */
export enum InspectionResult {
  PASSED = 'passed',
  FAILED = 'failed',
  CONDITIONAL = 'conditional',
  REQUIRES_REWORK = 'requires_rework',
}

/**
 * Vendor rating
 */
export enum VendorRating {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  AVERAGE = 'average',
  POOR = 'poor',
  UNRATED = 'unrated',
}

/**
 * Budget status
 */
export enum BudgetStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  COMMITTED = 'committed',
  SPENT = 'spent',
  EXCEEDED = 'exceeded',
}

/**
 * Payment terms
 */
export enum PaymentTerms {
  NET_30 = 'net_30',
  NET_60 = 'net_60',
  NET_90 = 'net_90',
  IMMEDIATE = 'immediate',
  ON_DELIVERY = 'on_delivery',
  MILESTONE_BASED = 'milestone_based',
}

/**
 * Purchase requisition item interface
 */
export interface PurchaseRequisitionItem {
  assetTypeId: string;
  description: string;
  quantity: number;
  estimatedUnitCost: number;
  justification?: string;
  specifications?: Record<string, any>;
  preferredVendorId?: string;
  accountCode?: string;
  deliveryDate?: Date;
}

/**
 * Purchase requisition data
 */
export interface PurchaseRequisitionData {
  requestorId: string;
  departmentId: string;
  items: PurchaseRequisitionItem[];
  priority: PriorityLevel;
  justification: string;
  budgetId?: string;
  projectId?: string;
  expectedDeliveryDate?: Date;
  notes?: string;
}

/**
 * RFQ creation data
 */
export interface RFQCreationData {
  requisitionId?: string;
  title: string;
  description: string;
  vendorIds: string[];
  items: RFQItem[];
  responseDeadline: Date;
  evaluationCriteria?: Record<string, any>;
  termsAndConditions?: string;
  attachments?: string[];
}

/**
 * RFQ item
 */
export interface RFQItem {
  assetTypeId: string;
  description: string;
  quantity: number;
  specifications: Record<string, any>;
  deliveryRequirements?: string;
}

/**
 * Vendor quote data
 */
export interface VendorQuoteData {
  rfqId: string;
  vendorId: string;
  items: QuoteItem[];
  totalAmount: number;
  validUntil: Date;
  paymentTerms: PaymentTerms;
  deliveryTimeframe: string;
  notes?: string;
  attachments?: string[];
}

/**
 * Quote item
 */
export interface QuoteItem {
  rfqItemId: string;
  unitPrice: number;
  quantity: number;
  leadTime: number;
  specifications?: Record<string, any>;
}

/**
 * Purchase order creation data
 */
export interface PurchaseOrderData {
  vendorId: string;
  requisitionId?: string;
  quoteId?: string;
  items: PurchaseOrderItem[];
  shippingAddress: string;
  billingAddress: string;
  paymentTerms: PaymentTerms;
  expectedDeliveryDate: Date;
  notes?: string;
  contractId?: string;
}

/**
 * Purchase order item
 */
export interface PurchaseOrderItem {
  assetTypeId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  accountCode?: string;
  specifications?: Record<string, any>;
}

/**
 * Asset receiving data
 */
export interface AssetReceivingData {
  purchaseOrderId: string;
  receivedBy: string;
  receivedDate: Date;
  items: ReceivedItem[];
  packingSlipNumber?: string;
  trackingNumber?: string;
  notes?: string;
}

/**
 * Received item
 */
export interface ReceivedItem {
  poItemId: string;
  quantityReceived: number;
  condition: string;
  serialNumbers?: string[];
  inspectionNotes?: string;
}

/**
 * Inspection data
 */
export interface InspectionData {
  receivingId: string;
  inspectorId: string;
  inspectionDate: Date;
  items: InspectedItem[];
  overallResult: InspectionResult;
  notes?: string;
  photos?: string[];
  documents?: string[];
}

/**
 * Inspected item
 */
export interface InspectedItem {
  receivedItemId: string;
  result: InspectionResult;
  defects?: string[];
  measurements?: Record<string, any>;
  notes?: string;
}

/**
 * Contract data
 */
export interface ContractData {
  vendorId: string;
  contractType: ContractType;
  contractNumber: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  value: number;
  paymentTerms: PaymentTerms;
  renewalOptions?: string;
  termsAndConditions: string;
  attachments?: string[];
}

/**
 * Budget allocation data
 */
export interface BudgetAllocationData {
  budgetId: string;
  departmentId: string;
  fiscalYear: number;
  amount: number;
  categoryCode: string;
  approvedBy: string;
  notes?: string;
}

/**
 * Approval workflow data
 */
export interface ApprovalWorkflowData {
  documentType: string;
  documentId: string;
  approvers: ApproverData[];
  sequenceRequired: boolean;
  notes?: string;
}

/**
 * Approver data
 */
export interface ApproverData {
  userId: string;
  level: number;
  required: boolean;
  delegateUserId?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Vendor Model - Supplier management
 */
@Table({
  tableName: 'vendors',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['vendor_code'], unique: true },
    { fields: ['rating'] },
    { fields: ['is_active'] },
    { fields: ['is_preferred'] },
  ],
})
export class Vendor extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Vendor code' })
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  @Index
  vendorCode!: string;

  @ApiProperty({ description: 'Vendor name' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  name!: string;

  @ApiProperty({ description: 'Legal entity name' })
  @Column({ type: DataType.STRING(200) })
  legalName?: string;

  @ApiProperty({ description: 'Tax identification number' })
  @Column({ type: DataType.STRING(50) })
  taxId?: string;

  @ApiProperty({ description: 'Contact email' })
  @Column({ type: DataType.STRING(200) })
  email?: string;

  @ApiProperty({ description: 'Contact phone' })
  @Column({ type: DataType.STRING(50) })
  phone?: string;

  @ApiProperty({ description: 'Website' })
  @Column({ type: DataType.STRING(500) })
  website?: string;

  @ApiProperty({ description: 'Primary address' })
  @Column({ type: DataType.TEXT })
  address?: string;

  @ApiProperty({ description: 'Vendor rating' })
  @Column({ type: DataType.ENUM(...Object.values(VendorRating)), defaultValue: VendorRating.UNRATED })
  @Index
  rating!: VendorRating;

  @ApiProperty({ description: 'Payment terms' })
  @Column({ type: DataType.ENUM(...Object.values(PaymentTerms)) })
  defaultPaymentTerms?: PaymentTerms;

  @ApiProperty({ description: 'Credit limit' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  creditLimit?: number;

  @ApiProperty({ description: 'Whether vendor is preferred' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  @Index
  isPreferred!: boolean;

  @ApiProperty({ description: 'Whether vendor is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Certifications' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  certifications?: string[];

  @ApiProperty({ description: 'Performance metrics' })
  @Column({ type: DataType.JSONB })
  performanceMetrics?: Record<string, any>;

  @ApiProperty({ description: 'Additional metadata' })
  @Column({ type: DataType.JSONB })
  metadata?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => PurchaseRequisition)
  requisitions?: PurchaseRequisition[];

  @HasMany(() => PurchaseOrder)
  purchaseOrders?: PurchaseOrder[];

  @HasMany(() => Contract)
  contracts?: Contract[];
}

/**
 * Purchase Requisition Model - Purchase requests
 */
@Table({
  tableName: 'purchase_requisitions',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['requisition_number'], unique: true },
    { fields: ['requestor_id'] },
    { fields: ['department_id'] },
    { fields: ['status'] },
    { fields: ['priority'] },
    { fields: ['created_at'] },
  ],
})
export class PurchaseRequisition extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Requisition number' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  requisitionNumber!: string;

  @ApiProperty({ description: 'Requestor user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  requestorId!: string;

  @ApiProperty({ description: 'Department ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  departmentId!: string;

  @ApiProperty({ description: 'Budget ID' })
  @Column({ type: DataType.UUID })
  budgetId?: string;

  @ApiProperty({ description: 'Project ID' })
  @Column({ type: DataType.UUID })
  projectId?: string;

  @ApiProperty({ description: 'Approval status' })
  @Column({ type: DataType.ENUM(...Object.values(ApprovalStatus)), defaultValue: ApprovalStatus.DRAFT })
  @Index
  status!: ApprovalStatus;

  @ApiProperty({ description: 'Priority level' })
  @Column({ type: DataType.ENUM(...Object.values(PriorityLevel)), defaultValue: PriorityLevel.MEDIUM })
  @Index
  priority!: PriorityLevel;

  @ApiProperty({ description: 'Justification' })
  @Column({ type: DataType.TEXT, allowNull: false })
  justification!: string;

  @ApiProperty({ description: 'Requisition items' })
  @Column({ type: DataType.JSONB, allowNull: false })
  items!: PurchaseRequisitionItem[];

  @ApiProperty({ description: 'Total estimated cost' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  totalEstimatedCost?: number;

  @ApiProperty({ description: 'Expected delivery date' })
  @Column({ type: DataType.DATE })
  expectedDeliveryDate?: Date;

  @ApiProperty({ description: 'Approved by user ID' })
  @Column({ type: DataType.UUID })
  approvedBy?: string;

  @ApiProperty({ description: 'Approval date' })
  @Column({ type: DataType.DATE })
  approvalDate?: Date;

  @ApiProperty({ description: 'Rejection reason' })
  @Column({ type: DataType.TEXT })
  rejectionReason?: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @ApiProperty({ description: 'Attachments' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  attachments?: string[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => RFQ)
  rfqs?: RFQ[];

  @HasMany(() => PurchaseOrder)
  purchaseOrders?: PurchaseOrder[];

  @BeforeCreate
  static async generateRequisitionNumber(instance: PurchaseRequisition) {
    if (!instance.requisitionNumber) {
      const count = await PurchaseRequisition.count();
      const year = new Date().getFullYear();
      instance.requisitionNumber = `PR-${year}-${String(count + 1).padStart(6, '0')}`;
    }
  }

  @BeforeCreate
  static calculateTotalCost(instance: PurchaseRequisition) {
    if (instance.items && instance.items.length > 0) {
      instance.totalEstimatedCost = instance.items.reduce(
        (sum, item) => sum + item.quantity * item.estimatedUnitCost,
        0
      );
    }
  }
}

/**
 * RFQ Model - Request for Quotation
 */
@Table({
  tableName: 'rfqs',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['rfq_number'], unique: true },
    { fields: ['requisition_id'] },
    { fields: ['status'] },
    { fields: ['response_deadline'] },
  ],
})
export class RFQ extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'RFQ number' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  rfqNumber!: string;

  @ApiProperty({ description: 'Requisition ID' })
  @ForeignKey(() => PurchaseRequisition)
  @Column({ type: DataType.UUID })
  @Index
  requisitionId?: string;

  @ApiProperty({ description: 'Title' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  title!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(RFQStatus)), defaultValue: RFQStatus.DRAFT })
  @Index
  status!: RFQStatus;

  @ApiProperty({ description: 'Vendor IDs invited' })
  @Column({ type: DataType.ARRAY(DataType.UUID), allowNull: false })
  vendorIds!: string[];

  @ApiProperty({ description: 'RFQ items' })
  @Column({ type: DataType.JSONB, allowNull: false })
  items!: RFQItem[];

  @ApiProperty({ description: 'Response deadline' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  responseDeadline!: Date;

  @ApiProperty({ description: 'Evaluation criteria' })
  @Column({ type: DataType.JSONB })
  evaluationCriteria?: Record<string, any>;

  @ApiProperty({ description: 'Terms and conditions' })
  @Column({ type: DataType.TEXT })
  termsAndConditions?: string;

  @ApiProperty({ description: 'Attachments' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  attachments?: string[];

  @ApiProperty({ description: 'Published date' })
  @Column({ type: DataType.DATE })
  publishedDate?: Date;

  @ApiProperty({ description: 'Awarded vendor ID' })
  @Column({ type: DataType.UUID })
  awardedVendorId?: string;

  @ApiProperty({ description: 'Award date' })
  @Column({ type: DataType.DATE })
  awardDate?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => PurchaseRequisition)
  requisition?: PurchaseRequisition;

  @HasMany(() => VendorQuote)
  quotes?: VendorQuote[];

  @BeforeCreate
  static async generateRFQNumber(instance: RFQ) {
    if (!instance.rfqNumber) {
      const count = await RFQ.count();
      const year = new Date().getFullYear();
      instance.rfqNumber = `RFQ-${year}-${String(count + 1).padStart(6, '0')}`;
    }
  }
}

/**
 * Vendor Quote Model - Vendor responses to RFQs
 */
@Table({
  tableName: 'vendor_quotes',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['quote_number'], unique: true },
    { fields: ['rfq_id'] },
    { fields: ['vendor_id'] },
    { fields: ['valid_until'] },
  ],
})
export class VendorQuote extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Quote number' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  quoteNumber!: string;

  @ApiProperty({ description: 'RFQ ID' })
  @ForeignKey(() => RFQ)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  rfqId!: string;

  @ApiProperty({ description: 'Vendor ID' })
  @ForeignKey(() => Vendor)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  vendorId!: string;

  @ApiProperty({ description: 'Quote items' })
  @Column({ type: DataType.JSONB, allowNull: false })
  items!: QuoteItem[];

  @ApiProperty({ description: 'Total amount' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  totalAmount!: number;

  @ApiProperty({ description: 'Valid until date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  validUntil!: Date;

  @ApiProperty({ description: 'Payment terms' })
  @Column({ type: DataType.ENUM(...Object.values(PaymentTerms)), allowNull: false })
  paymentTerms!: PaymentTerms;

  @ApiProperty({ description: 'Delivery timeframe' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  deliveryTimeframe!: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @ApiProperty({ description: 'Attachments' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  attachments?: string[];

  @ApiProperty({ description: 'Evaluation score' })
  @Column({ type: DataType.DECIMAL(5, 2) })
  evaluationScore?: number;

  @ApiProperty({ description: 'Is selected' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isSelected!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => RFQ)
  rfq?: RFQ;

  @BelongsTo(() => Vendor)
  vendor?: Vendor;

  @BeforeCreate
  static async generateQuoteNumber(instance: VendorQuote) {
    if (!instance.quoteNumber) {
      const count = await VendorQuote.count();
      const year = new Date().getFullYear();
      instance.quoteNumber = `QT-${year}-${String(count + 1).padStart(6, '0')}`;
    }
  }
}

/**
 * Purchase Order Model - Purchase orders
 */
@Table({
  tableName: 'purchase_orders',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['po_number'], unique: true },
    { fields: ['vendor_id'] },
    { fields: ['requisition_id'] },
    { fields: ['status'] },
    { fields: ['expected_delivery_date'] },
  ],
})
export class PurchaseOrder extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'PO number' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  poNumber!: string;

  @ApiProperty({ description: 'Vendor ID' })
  @ForeignKey(() => Vendor)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  vendorId!: string;

  @ApiProperty({ description: 'Requisition ID' })
  @ForeignKey(() => PurchaseRequisition)
  @Column({ type: DataType.UUID })
  @Index
  requisitionId?: string;

  @ApiProperty({ description: 'Quote ID' })
  @ForeignKey(() => VendorQuote)
  @Column({ type: DataType.UUID })
  quoteId?: string;

  @ApiProperty({ description: 'Contract ID' })
  @Column({ type: DataType.UUID })
  contractId?: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(PurchaseOrderStatus)), defaultValue: PurchaseOrderStatus.DRAFT })
  @Index
  status!: PurchaseOrderStatus;

  @ApiProperty({ description: 'PO items' })
  @Column({ type: DataType.JSONB, allowNull: false })
  items!: PurchaseOrderItem[];

  @ApiProperty({ description: 'Subtotal amount' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  subtotal?: number;

  @ApiProperty({ description: 'Tax amount' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  taxAmount?: number;

  @ApiProperty({ description: 'Total amount' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  totalAmount!: number;

  @ApiProperty({ description: 'Shipping address' })
  @Column({ type: DataType.TEXT, allowNull: false })
  shippingAddress!: string;

  @ApiProperty({ description: 'Billing address' })
  @Column({ type: DataType.TEXT, allowNull: false })
  billingAddress!: string;

  @ApiProperty({ description: 'Payment terms' })
  @Column({ type: DataType.ENUM(...Object.values(PaymentTerms)), allowNull: false })
  paymentTerms!: PaymentTerms;

  @ApiProperty({ description: 'Expected delivery date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  expectedDeliveryDate!: Date;

  @ApiProperty({ description: 'Issued date' })
  @Column({ type: DataType.DATE })
  issuedDate?: Date;

  @ApiProperty({ description: 'Approved by user ID' })
  @Column({ type: DataType.UUID })
  approvedBy?: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => Vendor)
  vendor?: Vendor;

  @BelongsTo(() => PurchaseRequisition)
  requisition?: PurchaseRequisition;

  @BelongsTo(() => VendorQuote)
  quote?: VendorQuote;

  @HasMany(() => AssetReceiving)
  receivings?: AssetReceiving[];

  @BeforeCreate
  static async generatePONumber(instance: PurchaseOrder) {
    if (!instance.poNumber) {
      const count = await PurchaseOrder.count();
      const year = new Date().getFullYear();
      instance.poNumber = `PO-${year}-${String(count + 1).padStart(6, '0')}`;
    }
  }

  @BeforeCreate
  static calculateTotals(instance: PurchaseOrder) {
    if (instance.items && instance.items.length > 0) {
      const subtotal = instance.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );
      const taxAmount = instance.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice * (item.taxRate || 0) / 100,
        0
      );
      instance.subtotal = subtotal;
      instance.taxAmount = taxAmount;
      instance.totalAmount = subtotal + taxAmount;
    }
  }
}

/**
 * Asset Receiving Model - Asset receipt tracking
 */
@Table({
  tableName: 'asset_receivings',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['receiving_number'], unique: true },
    { fields: ['purchase_order_id'] },
    { fields: ['received_by'] },
    { fields: ['status'] },
    { fields: ['received_date'] },
  ],
})
export class AssetReceiving extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Receiving number' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  receivingNumber!: string;

  @ApiProperty({ description: 'Purchase order ID' })
  @ForeignKey(() => PurchaseOrder)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  purchaseOrderId!: string;

  @ApiProperty({ description: 'Received by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  receivedBy!: string;

  @ApiProperty({ description: 'Received date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  receivedDate!: Date;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(ReceivingStatus)), defaultValue: ReceivingStatus.PENDING })
  @Index
  status!: ReceivingStatus;

  @ApiProperty({ description: 'Received items' })
  @Column({ type: DataType.JSONB, allowNull: false })
  items!: ReceivedItem[];

  @ApiProperty({ description: 'Packing slip number' })
  @Column({ type: DataType.STRING(100) })
  packingSlipNumber?: string;

  @ApiProperty({ description: 'Tracking number' })
  @Column({ type: DataType.STRING(100) })
  trackingNumber?: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => PurchaseOrder)
  purchaseOrder?: PurchaseOrder;

  @HasMany(() => AssetInspection)
  inspections?: AssetInspection[];

  @BeforeCreate
  static async generateReceivingNumber(instance: AssetReceiving) {
    if (!instance.receivingNumber) {
      const count = await AssetReceiving.count();
      const year = new Date().getFullYear();
      instance.receivingNumber = `RCV-${year}-${String(count + 1).padStart(6, '0')}`;
    }
  }
}

/**
 * Asset Inspection Model - Receipt inspection tracking
 */
@Table({
  tableName: 'asset_inspections',
  timestamps: true,
  indexes: [
    { fields: ['inspection_number'], unique: true },
    { fields: ['receiving_id'] },
    { fields: ['inspector_id'] },
    { fields: ['overall_result'] },
  ],
})
export class AssetInspection extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Inspection number' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  inspectionNumber!: string;

  @ApiProperty({ description: 'Receiving ID' })
  @ForeignKey(() => AssetReceiving)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  receivingId!: string;

  @ApiProperty({ description: 'Inspector user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  inspectorId!: string;

  @ApiProperty({ description: 'Inspection date' })
  @Column({ type: DataType.DATE, allowNull: false })
  inspectionDate!: Date;

  @ApiProperty({ description: 'Inspected items' })
  @Column({ type: DataType.JSONB, allowNull: false })
  items!: InspectedItem[];

  @ApiProperty({ description: 'Overall result' })
  @Column({ type: DataType.ENUM(...Object.values(InspectionResult)), allowNull: false })
  @Index
  overallResult!: InspectionResult;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @ApiProperty({ description: 'Photos' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  photos?: string[];

  @ApiProperty({ description: 'Documents' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  documents?: string[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => AssetReceiving)
  receiving?: AssetReceiving;

  @BeforeCreate
  static async generateInspectionNumber(instance: AssetInspection) {
    if (!instance.inspectionNumber) {
      const count = await AssetInspection.count();
      const year = new Date().getFullYear();
      instance.inspectionNumber = `INS-${year}-${String(count + 1).padStart(6, '0')}`;
    }
  }
}

/**
 * Contract Model - Vendor contracts
 */
@Table({
  tableName: 'contracts',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['contract_number'], unique: true },
    { fields: ['vendor_id'] },
    { fields: ['status'] },
    { fields: ['start_date'] },
    { fields: ['end_date'] },
  ],
})
export class Contract extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Contract number' })
  @Column({ type: DataType.STRING(50), unique: true, allowNull: false })
  @Index
  contractNumber!: string;

  @ApiProperty({ description: 'Vendor ID' })
  @ForeignKey(() => Vendor)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  vendorId!: string;

  @ApiProperty({ description: 'Contract type' })
  @Column({ type: DataType.ENUM(...Object.values(ContractType)), allowNull: false })
  contractType!: ContractType;

  @ApiProperty({ description: 'Title' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  title!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(ContractStatus)), defaultValue: ContractStatus.DRAFT })
  @Index
  status!: ContractStatus;

  @ApiProperty({ description: 'Start date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  startDate!: Date;

  @ApiProperty({ description: 'End date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  endDate!: Date;

  @ApiProperty({ description: 'Contract value' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  value!: number;

  @ApiProperty({ description: 'Payment terms' })
  @Column({ type: DataType.ENUM(...Object.values(PaymentTerms)), allowNull: false })
  paymentTerms!: PaymentTerms;

  @ApiProperty({ description: 'Renewal options' })
  @Column({ type: DataType.TEXT })
  renewalOptions?: string;

  @ApiProperty({ description: 'Terms and conditions' })
  @Column({ type: DataType.TEXT, allowNull: false })
  termsAndConditions!: string;

  @ApiProperty({ description: 'Attachments' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  attachments?: string[];

  @ApiProperty({ description: 'Auto renewal enabled' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  autoRenewal!: boolean;

  @ApiProperty({ description: 'Notification days before expiry' })
  @Column({ type: DataType.INTEGER, defaultValue: 30 })
  notificationDays!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => Vendor)
  vendor?: Vendor;
}

/**
 * Budget Model - Budget tracking
 */
@Table({
  tableName: 'budgets',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['department_id', 'fiscal_year', 'category_code'], unique: true },
    { fields: ['fiscal_year'] },
    { fields: ['status'] },
  ],
})
export class Budget extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Department ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  departmentId!: string;

  @ApiProperty({ description: 'Fiscal year' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  @Index
  fiscalYear!: number;

  @ApiProperty({ description: 'Category code' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  categoryCode!: string;

  @ApiProperty({ description: 'Total allocated amount' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  allocatedAmount!: number;

  @ApiProperty({ description: 'Reserved amount' })
  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  reservedAmount!: number;

  @ApiProperty({ description: 'Committed amount' })
  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  committedAmount!: number;

  @ApiProperty({ description: 'Spent amount' })
  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  spentAmount!: number;

  @ApiProperty({ description: 'Available amount' })
  @Column({ type: DataType.DECIMAL(15, 2) })
  availableAmount?: number;

  @ApiProperty({ description: 'Budget status' })
  @Column({ type: DataType.ENUM(...Object.values(BudgetStatus)), defaultValue: BudgetStatus.AVAILABLE })
  @Index
  status!: BudgetStatus;

  @ApiProperty({ description: 'Approved by user ID' })
  @Column({ type: DataType.UUID })
  approvedBy?: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BeforeCreate
  @BeforeCreate
  static calculateAvailable(instance: Budget) {
    const allocated = Number(instance.allocatedAmount || 0);
    const reserved = Number(instance.reservedAmount || 0);
    const committed = Number(instance.committedAmount || 0);
    const spent = Number(instance.spentAmount || 0);
    instance.availableAmount = allocated - reserved - committed - spent;
  }
}

/**
 * Approval Workflow Model - Approval routing
 */
@Table({
  tableName: 'approval_workflows',
  timestamps: true,
  indexes: [
    { fields: ['document_type', 'document_id'] },
    { fields: ['current_approver_id'] },
    { fields: ['status'] },
  ],
})
export class ApprovalWorkflow extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Document type' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  @Index
  documentType!: string;

  @ApiProperty({ description: 'Document ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  documentId!: string;

  @ApiProperty({ description: 'Approvers list' })
  @Column({ type: DataType.JSONB, allowNull: false })
  approvers!: ApproverData[];

  @ApiProperty({ description: 'Current approver user ID' })
  @Column({ type: DataType.UUID })
  @Index
  currentApproverId?: string;

  @ApiProperty({ description: 'Current approval level' })
  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  currentLevel!: number;

  @ApiProperty({ description: 'Workflow status' })
  @Column({ type: DataType.ENUM(...Object.values(ApprovalStatus)), defaultValue: ApprovalStatus.PENDING })
  @Index
  status!: ApprovalStatus;

  @ApiProperty({ description: 'Sequence required' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  sequenceRequired!: boolean;

  @ApiProperty({ description: 'Approval history' })
  @Column({ type: DataType.JSONB })
  approvalHistory?: Array<{
    userId: string;
    action: string;
    timestamp: Date;
    comments?: string;
  }>;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

// ============================================================================
// PURCHASE REQUISITION FUNCTIONS
// ============================================================================

/**
 * Creates a new purchase requisition
 *
 * @param data - Requisition data
 * @param transaction - Optional database transaction
 * @returns Created purchase requisition
 *
 * @example
 * ```typescript
 * const requisition = await createPurchaseRequisition({
 *   requestorId: 'user-123',
 *   departmentId: 'dept-456',
 *   items: [{
 *     assetTypeId: 'laptop-dell',
 *     description: 'Dell XPS 15',
 *     quantity: 5,
 *     estimatedUnitCost: 1500,
 *     justification: 'New employee laptops'
 *   }],
 *   priority: PriorityLevel.HIGH,
 *   justification: 'Q1 hiring plan'
 * });
 * ```
 */
export async function createPurchaseRequisition(
  data: PurchaseRequisitionData,
  transaction?: Transaction
): Promise<PurchaseRequisition> {
  // Validate budget if provided
  if (data.budgetId) {
    await validateBudgetAvailability(data.budgetId, data.items, transaction);
  }

  const requisition = await PurchaseRequisition.create(
    {
      ...data,
      status: ApprovalStatus.DRAFT,
    },
    { transaction }
  );

  return requisition;
}

/**
 * Submits requisition for approval
 *
 * @param requisitionId - Requisition identifier
 * @param transaction - Optional database transaction
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await submitRequisitionForApproval('req-123');
 * ```
 */
export async function submitRequisitionForApproval(
  requisitionId: string,
  transaction?: Transaction
): Promise<PurchaseRequisition> {
  const requisition = await PurchaseRequisition.findByPk(requisitionId, { transaction });
  if (!requisition) {
    throw new NotFoundException(`Requisition ${requisitionId} not found`);
  }

  if (requisition.status !== ApprovalStatus.DRAFT) {
    throw new BadRequestException('Only draft requisitions can be submitted');
  }

  // Create approval workflow
  await createApprovalWorkflow(
    {
      documentType: 'purchase_requisition',
      documentId: requisitionId,
      approvers: await getApproversForRequisition(requisition),
      sequenceRequired: true,
    },
    transaction
  );

  await requisition.update({ status: ApprovalStatus.PENDING }, { transaction });
  return requisition;
}

/**
 * Approves a purchase requisition
 *
 * @param requisitionId - Requisition identifier
 * @param approverId - Approver user ID
 * @param comments - Optional approval comments
 * @param transaction - Optional database transaction
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await approvePurchaseRequisition('req-123', 'manager-456', 'Approved for Q1 budget');
 * ```
 */
export async function approvePurchaseRequisition(
  requisitionId: string,
  approverId: string,
  comments?: string,
  transaction?: Transaction
): Promise<PurchaseRequisition> {
  const requisition = await PurchaseRequisition.findByPk(requisitionId, { transaction });
  if (!requisition) {
    throw new NotFoundException(`Requisition ${requisitionId} not found`);
  }

  if (requisition.status !== ApprovalStatus.PENDING) {
    throw new BadRequestException('Only pending requisitions can be approved');
  }

  // Process approval in workflow
  const workflow = await ApprovalWorkflow.findOne({
    where: {
      documentType: 'purchase_requisition',
      documentId: requisitionId,
      status: ApprovalStatus.PENDING,
    },
    transaction,
  });

  if (!workflow) {
    throw new NotFoundException('Approval workflow not found');
  }

  // Verify approver is authorized
  if (workflow.currentApproverId !== approverId) {
    throw new ForbiddenException('User is not authorized to approve at this level');
  }

  // Update approval history
  const history = workflow.approvalHistory || [];
  history.push({
    userId: approverId,
    action: 'approved',
    timestamp: new Date(),
    comments,
  });

  // Check if more approvals needed
  const nextLevel = workflow.currentLevel + 1;
  const nextApprover = workflow.approvers.find(a => a.level === nextLevel);

  if (nextApprover) {
    // More approvals needed
    await workflow.update({
      currentLevel: nextLevel,
      currentApproverId: nextApprover.userId,
      approvalHistory: history,
    }, { transaction });
  } else {
    // Final approval
    await workflow.update({
      status: ApprovalStatus.APPROVED,
      approvalHistory: history,
    }, { transaction });

    await requisition.update({
      status: ApprovalStatus.APPROVED,
      approvedBy: approverId,
      approvalDate: new Date(),
    }, { transaction });
  }

  return requisition;
}

/**
 * Rejects a purchase requisition
 *
 * @param requisitionId - Requisition identifier
 * @param approverId - Approver user ID
 * @param reason - Rejection reason
 * @param transaction - Optional database transaction
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await rejectPurchaseRequisition('req-123', 'manager-456', 'Budget not available');
 * ```
 */
export async function rejectPurchaseRequisition(
  requisitionId: string,
  approverId: string,
  reason: string,
  transaction?: Transaction
): Promise<PurchaseRequisition> {
  const requisition = await PurchaseRequisition.findByPk(requisitionId, { transaction });
  if (!requisition) {
    throw new NotFoundException(`Requisition ${requisitionId} not found`);
  }

  await requisition.update({
    status: ApprovalStatus.REJECTED,
    rejectionReason: reason,
  }, { transaction });

  // Update workflow
  await ApprovalWorkflow.update(
    { status: ApprovalStatus.REJECTED },
    {
      where: {
        documentType: 'purchase_requisition',
        documentId: requisitionId,
      },
      transaction,
    }
  );

  return requisition;
}

/**
 * Gets purchase requisitions by status
 *
 * @param status - Requisition status
 * @param options - Query options
 * @returns Requisitions
 *
 * @example
 * ```typescript
 * const pending = await getRequisitionsByStatus(ApprovalStatus.PENDING);
 * ```
 */
export async function getRequisitionsByStatus(
  status: ApprovalStatus,
  options: FindOptions = {}
): Promise<PurchaseRequisition[]> {
  return PurchaseRequisition.findAll({
    where: { status },
    order: [['createdAt', 'DESC']],
    ...options,
  });
}

/**
 * Gets requisitions by department
 *
 * @param departmentId - Department identifier
 * @param options - Query options
 * @returns Requisitions
 *
 * @example
 * ```typescript
 * const deptReqs = await getRequisitionsByDepartment('dept-123');
 * ```
 */
export async function getRequisitionsByDepartment(
  departmentId: string,
  options: FindOptions = {}
): Promise<PurchaseRequisition[]> {
  return PurchaseRequisition.findAll({
    where: { departmentId },
    order: [['createdAt', 'DESC']],
    ...options,
  });
}

/**
 * Updates purchase requisition
 *
 * @param requisitionId - Requisition identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await updatePurchaseRequisition('req-123', {
 *   priority: PriorityLevel.CRITICAL,
 *   notes: 'Urgent requirement'
 * });
 * ```
 */
export async function updatePurchaseRequisition(
  requisitionId: string,
  updates: Partial<PurchaseRequisition>,
  transaction?: Transaction
): Promise<PurchaseRequisition> {
  const requisition = await PurchaseRequisition.findByPk(requisitionId, { transaction });
  if (!requisition) {
    throw new NotFoundException(`Requisition ${requisitionId} not found`);
  }

  if (requisition.status !== ApprovalStatus.DRAFT) {
    throw new BadRequestException('Only draft requisitions can be updated');
  }

  await requisition.update(updates, { transaction });
  return requisition;
}

/**
 * Cancels a purchase requisition
 *
 * @param requisitionId - Requisition identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await cancelPurchaseRequisition('req-123', 'Requirements changed');
 * ```
 */
export async function cancelPurchaseRequisition(
  requisitionId: string,
  reason: string,
  transaction?: Transaction
): Promise<PurchaseRequisition> {
  const requisition = await PurchaseRequisition.findByPk(requisitionId, { transaction });
  if (!requisition) {
    throw new NotFoundException(`Requisition ${requisitionId} not found`);
  }

  await requisition.update({
    status: ApprovalStatus.CANCELLED,
    notes: `${requisition.notes || ''}\nCancelled: ${reason}`,
  }, { transaction });

  return requisition;
}

// ============================================================================
// RFQ/RFP MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates a new RFQ
 *
 * @param data - RFQ data
 * @param transaction - Optional database transaction
 * @returns Created RFQ
 *
 * @example
 * ```typescript
 * const rfq = await createRFQ({
 *   title: 'Laptop Procurement RFQ',
 *   description: 'Request for quotes for 50 laptops',
 *   vendorIds: ['vendor-1', 'vendor-2'],
 *   items: [{
 *     assetTypeId: 'laptop-dell',
 *     description: 'Dell XPS 15 or equivalent',
 *     quantity: 50,
 *     specifications: { ram: '16GB', storage: '512GB SSD' }
 *   }],
 *   responseDeadline: new Date('2024-06-01')
 * });
 * ```
 */
export async function createRFQ(
  data: RFQCreationData,
  transaction?: Transaction
): Promise<RFQ> {
  const rfq = await RFQ.create(
    {
      ...data,
      status: RFQStatus.DRAFT,
    },
    { transaction }
  );

  return rfq;
}

/**
 * Publishes an RFQ to vendors
 *
 * @param rfqId - RFQ identifier
 * @param transaction - Optional database transaction
 * @returns Updated RFQ
 *
 * @example
 * ```typescript
 * await publishRFQ('rfq-123');
 * ```
 */
export async function publishRFQ(
  rfqId: string,
  transaction?: Transaction
): Promise<RFQ> {
  const rfq = await RFQ.findByPk(rfqId, { transaction });
  if (!rfq) {
    throw new NotFoundException(`RFQ ${rfqId} not found`);
  }

  if (rfq.status !== RFQStatus.DRAFT) {
    throw new BadRequestException('Only draft RFQs can be published');
  }

  // Validate vendors exist
  for (const vendorId of rfq.vendorIds) {
    const vendor = await Vendor.findByPk(vendorId, { transaction });
    if (!vendor || !vendor.isActive) {
      throw new BadRequestException(`Vendor ${vendorId} is not active`);
    }
  }

  await rfq.update({
    status: RFQStatus.PUBLISHED,
    publishedDate: new Date(),
  }, { transaction });

  // TODO: Send notifications to vendors

  return rfq;
}

/**
 * Submits a vendor quote for an RFQ
 *
 * @param data - Quote data
 * @param transaction - Optional database transaction
 * @returns Created quote
 *
 * @example
 * ```typescript
 * const quote = await submitVendorQuote({
 *   rfqId: 'rfq-123',
 *   vendorId: 'vendor-456',
 *   items: [{
 *     rfqItemId: 'item-1',
 *     unitPrice: 1450,
 *     quantity: 50,
 *     leadTime: 14
 *   }],
 *   totalAmount: 72500,
 *   validUntil: new Date('2024-07-01'),
 *   paymentTerms: PaymentTerms.NET_30,
 *   deliveryTimeframe: '2 weeks from PO'
 * });
 * ```
 */
export async function submitVendorQuote(
  data: VendorQuoteData,
  transaction?: Transaction
): Promise<VendorQuote> {
  const rfq = await RFQ.findByPk(data.rfqId, { transaction });
  if (!rfq) {
    throw new NotFoundException(`RFQ ${data.rfqId} not found`);
  }

  if (rfq.status !== RFQStatus.PUBLISHED) {
    throw new BadRequestException('RFQ is not accepting quotes');
  }

  if (new Date() > rfq.responseDeadline) {
    throw new BadRequestException('RFQ response deadline has passed');
  }

  if (!rfq.vendorIds.includes(data.vendorId)) {
    throw new ForbiddenException('Vendor not invited to this RFQ');
  }

  const quote = await VendorQuote.create(data, { transaction });
  return quote;
}

/**
 * Evaluates vendor quotes
 *
 * @param rfqId - RFQ identifier
 * @param evaluationCriteria - Evaluation weights
 * @param transaction - Optional database transaction
 * @returns Evaluated quotes with scores
 *
 * @example
 * ```typescript
 * const evaluated = await evaluateVendorQuotes('rfq-123', {
 *   price: 0.5,
 *   quality: 0.3,
 *   delivery: 0.2
 * });
 * ```
 */
export async function evaluateVendorQuotes(
  rfqId: string,
  evaluationCriteria: Record<string, number>,
  transaction?: Transaction
): Promise<VendorQuote[]> {
  const quotes = await VendorQuote.findAll({
    where: { rfqId },
    include: [{ model: Vendor }],
    transaction,
  });

  if (quotes.length === 0) {
    throw new NotFoundException('No quotes found for this RFQ');
  }

  // Simple scoring based on price (lower is better)
  const prices = quotes.map(q => Number(q.totalAmount));
  const minPrice = Math.min(...prices);

  for (const quote of quotes) {
    const priceScore = (minPrice / Number(quote.totalAmount)) * 100;
    const vendorRatingScore = getVendorRatingScore(quote.vendor?.rating);

    // Weighted average
    const finalScore =
      (priceScore * (evaluationCriteria.price || 0.6)) +
      (vendorRatingScore * (evaluationCriteria.quality || 0.4));

    await quote.update({ evaluationScore: finalScore }, { transaction });
  }

  // Return sorted by score
  return quotes.sort((a, b) => (b.evaluationScore || 0) - (a.evaluationScore || 0));
}

/**
 * Awards RFQ to a vendor
 *
 * @param rfqId - RFQ identifier
 * @param quoteId - Selected quote identifier
 * @param transaction - Optional database transaction
 * @returns Updated RFQ and quote
 *
 * @example
 * ```typescript
 * await awardRFQ('rfq-123', 'quote-456');
 * ```
 */
export async function awardRFQ(
  rfqId: string,
  quoteId: string,
  transaction?: Transaction
): Promise<{ rfq: RFQ; quote: VendorQuote }> {
  const rfq = await RFQ.findByPk(rfqId, { transaction });
  const quote = await VendorQuote.findByPk(quoteId, { transaction });

  if (!rfq || !quote) {
    throw new NotFoundException('RFQ or quote not found');
  }

  if (quote.rfqId !== rfqId) {
    throw new BadRequestException('Quote does not belong to this RFQ');
  }

  await rfq.update({
    status: RFQStatus.AWARDED,
    awardedVendorId: quote.vendorId,
    awardDate: new Date(),
  }, { transaction });

  await quote.update({ isSelected: true }, { transaction });

  return { rfq, quote };
}

/**
 * Gets quotes for an RFQ
 *
 * @param rfqId - RFQ identifier
 * @returns Vendor quotes
 *
 * @example
 * ```typescript
 * const quotes = await getQuotesForRFQ('rfq-123');
 * ```
 */
export async function getQuotesForRFQ(rfqId: string): Promise<VendorQuote[]> {
  return VendorQuote.findAll({
    where: { rfqId },
    include: [{ model: Vendor }],
    order: [['evaluationScore', 'DESC']],
  });
}

// ============================================================================
// PURCHASE ORDER MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates a purchase order
 *
 * @param data - PO data
 * @param transaction - Optional database transaction
 * @returns Created purchase order
 *
 * @example
 * ```typescript
 * const po = await createPurchaseOrder({
 *   vendorId: 'vendor-123',
 *   quoteId: 'quote-456',
 *   items: [{
 *     assetTypeId: 'laptop-dell',
 *     description: 'Dell XPS 15',
 *     quantity: 50,
 *     unitPrice: 1450,
 *     taxRate: 8.5
 *   }],
 *   shippingAddress: '123 Main St, City, State 12345',
 *   billingAddress: '456 Office Blvd, City, State 12345',
 *   paymentTerms: PaymentTerms.NET_30,
 *   expectedDeliveryDate: new Date('2024-07-15')
 * });
 * ```
 */
export async function createPurchaseOrder(
  data: PurchaseOrderData,
  transaction?: Transaction
): Promise<PurchaseOrder> {
  // Validate vendor
  const vendor = await Vendor.findByPk(data.vendorId, { transaction });
  if (!vendor || !vendor.isActive) {
    throw new BadRequestException('Vendor is not active');
  }

  // If quote provided, validate it
  if (data.quoteId) {
    const quote = await VendorQuote.findByPk(data.quoteId, { transaction });
    if (!quote || quote.vendorId !== data.vendorId) {
      throw new BadRequestException('Invalid quote for vendor');
    }

    if (new Date() > quote.validUntil) {
      throw new BadRequestException('Quote has expired');
    }
  }

  const po = await PurchaseOrder.create(
    {
      ...data,
      status: PurchaseOrderStatus.DRAFT,
    },
    { transaction }
  );

  return po;
}

/**
 * Approves a purchase order
 *
 * @param poId - PO identifier
 * @param approverId - Approver user ID
 * @param transaction - Optional database transaction
 * @returns Updated PO
 *
 * @example
 * ```typescript
 * await approvePurchaseOrder('po-123', 'manager-456');
 * ```
 */
export async function approvePurchaseOrder(
  poId: string,
  approverId: string,
  transaction?: Transaction
): Promise<PurchaseOrder> {
  const po = await PurchaseOrder.findByPk(poId, { transaction });
  if (!po) {
    throw new NotFoundException(`PO ${poId} not found`);
  }

  if (po.status !== PurchaseOrderStatus.PENDING_APPROVAL) {
    throw new BadRequestException('PO is not pending approval');
  }

  await po.update({
    status: PurchaseOrderStatus.APPROVED,
    approvedBy: approverId,
  }, { transaction });

  return po;
}

/**
 * Issues a purchase order to vendor
 *
 * @param poId - PO identifier
 * @param transaction - Optional database transaction
 * @returns Updated PO
 *
 * @example
 * ```typescript
 * await issuePurchaseOrder('po-123');
 * ```
 */
export async function issuePurchaseOrder(
  poId: string,
  transaction?: Transaction
): Promise<PurchaseOrder> {
  const po = await PurchaseOrder.findByPk(poId, {
    include: [{ model: Vendor }],
    transaction,
  });

  if (!po) {
    throw new NotFoundException(`PO ${poId} not found`);
  }

  if (po.status !== PurchaseOrderStatus.APPROVED) {
    throw new BadRequestException('PO must be approved before issuing');
  }

  await po.update({
    status: PurchaseOrderStatus.ISSUED,
    issuedDate: new Date(),
  }, { transaction });

  // TODO: Send PO to vendor

  return po;
}

/**
 * Gets purchase orders by status
 *
 * @param status - PO status
 * @param options - Query options
 * @returns Purchase orders
 *
 * @example
 * ```typescript
 * const issued = await getPurchaseOrdersByStatus(PurchaseOrderStatus.ISSUED);
 * ```
 */
export async function getPurchaseOrdersByStatus(
  status: PurchaseOrderStatus,
  options: FindOptions = {}
): Promise<PurchaseOrder[]> {
  return PurchaseOrder.findAll({
    where: { status },
    include: [{ model: Vendor }],
    order: [['createdAt', 'DESC']],
    ...options,
  });
}

/**
 * Gets purchase orders by vendor
 *
 * @param vendorId - Vendor identifier
 * @param options - Query options
 * @returns Purchase orders
 *
 * @example
 * ```typescript
 * const vendorPOs = await getPurchaseOrdersByVendor('vendor-123');
 * ```
 */
export async function getPurchaseOrdersByVendor(
  vendorId: string,
  options: FindOptions = {}
): Promise<PurchaseOrder[]> {
  return PurchaseOrder.findAll({
    where: { vendorId },
    include: [{ model: Vendor }],
    order: [['createdAt', 'DESC']],
    ...options,
  });
}

/**
 * Updates purchase order
 *
 * @param poId - PO identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated PO
 *
 * @example
 * ```typescript
 * await updatePurchaseOrder('po-123', {
 *   expectedDeliveryDate: new Date('2024-08-01')
 * });
 * ```
 */
export async function updatePurchaseOrder(
  poId: string,
  updates: Partial<PurchaseOrder>,
  transaction?: Transaction
): Promise<PurchaseOrder> {
  const po = await PurchaseOrder.findByPk(poId, { transaction });
  if (!po) {
    throw new NotFoundException(`PO ${poId} not found`);
  }

  if (po.status === PurchaseOrderStatus.CLOSED || po.status === PurchaseOrderStatus.CANCELLED) {
    throw new BadRequestException('Cannot update closed or cancelled PO');
  }

  await po.update(updates, { transaction });
  return po;
}

/**
 * Cancels a purchase order
 *
 * @param poId - PO identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated PO
 *
 * @example
 * ```typescript
 * await cancelPurchaseOrder('po-123', 'Vendor unavailable');
 * ```
 */
export async function cancelPurchaseOrder(
  poId: string,
  reason: string,
  transaction?: Transaction
): Promise<PurchaseOrder> {
  const po = await PurchaseOrder.findByPk(poId, { transaction });
  if (!po) {
    throw new NotFoundException(`PO ${poId} not found`);
  }

  if (po.status === PurchaseOrderStatus.FULLY_RECEIVED) {
    throw new BadRequestException('Cannot cancel fully received PO');
  }

  await po.update({
    status: PurchaseOrderStatus.CANCELLED,
    notes: `${po.notes || ''}\nCancelled: ${reason}`,
  }, { transaction });

  return po;
}

// ============================================================================
// ASSET RECEIVING FUNCTIONS
// ============================================================================

/**
 * Receives assets from a purchase order
 *
 * @param data - Receiving data
 * @param transaction - Optional database transaction
 * @returns Created receiving record
 *
 * @example
 * ```typescript
 * const receiving = await receiveAssets({
 *   purchaseOrderId: 'po-123',
 *   receivedBy: 'user-456',
 *   receivedDate: new Date(),
 *   items: [{
 *     poItemId: 'item-1',
 *     quantityReceived: 50,
 *     condition: 'good',
 *     serialNumbers: ['SN001', 'SN002', ...]
 *   }],
 *   packingSlipNumber: 'PS-12345'
 * });
 * ```
 */
export async function receiveAssets(
  data: AssetReceivingData,
  transaction?: Transaction
): Promise<AssetReceiving> {
  const po = await PurchaseOrder.findByPk(data.purchaseOrderId, { transaction });
  if (!po) {
    throw new NotFoundException(`PO ${data.purchaseOrderId} not found`);
  }

  if (po.status !== PurchaseOrderStatus.ISSUED &&
      po.status !== PurchaseOrderStatus.PARTIALLY_RECEIVED) {
    throw new BadRequestException('PO must be issued before receiving');
  }

  const receiving = await AssetReceiving.create(
    {
      ...data,
      status: ReceivingStatus.PENDING,
    },
    { transaction }
  );

  // Update PO status
  const allItemsReceived = checkIfAllItemsReceived(po, data.items);
  await po.update({
    status: allItemsReceived
      ? PurchaseOrderStatus.FULLY_RECEIVED
      : PurchaseOrderStatus.PARTIALLY_RECEIVED,
  }, { transaction });

  return receiving;
}

/**
 * Inspects received assets
 *
 * @param data - Inspection data
 * @param transaction - Optional database transaction
 * @returns Created inspection record
 *
 * @example
 * ```typescript
 * const inspection = await inspectReceivedAssets({
 *   receivingId: 'rcv-123',
 *   inspectorId: 'user-789',
 *   inspectionDate: new Date(),
 *   items: [{
 *     receivedItemId: 'item-1',
 *     result: InspectionResult.PASSED,
 *     measurements: { weight: '2.5kg', dimensions: '35x25x2cm' }
 *   }],
 *   overallResult: InspectionResult.PASSED
 * });
 * ```
 */
export async function inspectReceivedAssets(
  data: InspectionData,
  transaction?: Transaction
): Promise<AssetInspection> {
  const receiving = await AssetReceiving.findByPk(data.receivingId, { transaction });
  if (!receiving) {
    throw new NotFoundException(`Receiving ${data.receivingId} not found`);
  }

  const inspection = await AssetInspection.create(data, { transaction });

  // Update receiving status based on inspection result
  let status: ReceivingStatus;
  switch (data.overallResult) {
    case InspectionResult.PASSED:
      status = ReceivingStatus.ACCEPTED;
      break;
    case InspectionResult.FAILED:
      status = ReceivingStatus.REJECTED;
      break;
    case InspectionResult.CONDITIONAL:
    case InspectionResult.REQUIRES_REWORK:
      status = ReceivingStatus.PARTIALLY_ACCEPTED;
      break;
    default:
      status = ReceivingStatus.IN_INSPECTION;
  }

  await receiving.update({ status }, { transaction });

  return inspection;
}

/**
 * Gets receiving records for a purchase order
 *
 * @param poId - PO identifier
 * @returns Receiving records
 *
 * @example
 * ```typescript
 * const receivings = await getReceivingsForPO('po-123');
 * ```
 */
export async function getReceivingsForPO(poId: string): Promise<AssetReceiving[]> {
  return AssetReceiving.findAll({
    where: { purchaseOrderId: poId },
    include: [
      { model: PurchaseOrder, include: [{ model: Vendor }] },
      { model: AssetInspection },
    ],
    order: [['receivedDate', 'DESC']],
  });
}

/**
 * Gets inspection records for a receiving
 *
 * @param receivingId - Receiving identifier
 * @returns Inspection records
 *
 * @example
 * ```typescript
 * const inspections = await getInspectionsForReceiving('rcv-123');
 * ```
 */
export async function getInspectionsForReceiving(receivingId: string): Promise<AssetInspection[]> {
  return AssetInspection.findAll({
    where: { receivingId },
    order: [['inspectionDate', 'DESC']],
  });
}

// ============================================================================
// CONTRACT MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates a vendor contract
 *
 * @param data - Contract data
 * @param transaction - Optional database transaction
 * @returns Created contract
 *
 * @example
 * ```typescript
 * const contract = await createContract({
 *   vendorId: 'vendor-123',
 *   contractType: ContractType.BLANKET_ORDER,
 *   contractNumber: 'CON-2024-001',
 *   title: 'IT Equipment Blanket Order',
 *   description: 'Annual IT equipment procurement',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   value: 500000,
 *   paymentTerms: PaymentTerms.NET_30,
 *   termsAndConditions: 'Standard terms apply...'
 * });
 * ```
 */
export async function createContract(
  data: ContractData,
  transaction?: Transaction
): Promise<Contract> {
  const vendor = await Vendor.findByPk(data.vendorId, { transaction });
  if (!vendor || !vendor.isActive) {
    throw new BadRequestException('Vendor is not active');
  }

  // Check for duplicate contract number
  const existing = await Contract.findOne({
    where: { contractNumber: data.contractNumber },
    transaction,
  });

  if (existing) {
    throw new ConflictException('Contract number already exists');
  }

  const contract = await Contract.create(
    {
      ...data,
      status: ContractStatus.DRAFT,
    },
    { transaction }
  );

  return contract;
}

/**
 * Activates a contract
 *
 * @param contractId - Contract identifier
 * @param transaction - Optional database transaction
 * @returns Updated contract
 *
 * @example
 * ```typescript
 * await activateContract('contract-123');
 * ```
 */
export async function activateContract(
  contractId: string,
  transaction?: Transaction
): Promise<Contract> {
  const contract = await Contract.findByPk(contractId, { transaction });
  if (!contract) {
    throw new NotFoundException(`Contract ${contractId} not found`);
  }

  if (contract.status !== ContractStatus.UNDER_REVIEW) {
    throw new BadRequestException('Contract must be under review to activate');
  }

  if (new Date() < contract.startDate) {
    throw new BadRequestException('Cannot activate contract before start date');
  }

  await contract.update({ status: ContractStatus.ACTIVE }, { transaction });
  return contract;
}

/**
 * Renews a contract
 *
 * @param contractId - Contract identifier
 * @param newEndDate - New end date
 * @param transaction - Optional database transaction
 * @returns Renewed contract
 *
 * @example
 * ```typescript
 * await renewContract('contract-123', new Date('2025-12-31'));
 * ```
 */
export async function renewContract(
  contractId: string,
  newEndDate: Date,
  transaction?: Transaction
): Promise<Contract> {
  const contract = await Contract.findByPk(contractId, { transaction });
  if (!contract) {
    throw new NotFoundException(`Contract ${contractId} not found`);
  }

  await contract.update({
    endDate: newEndDate,
    status: ContractStatus.RENEWED,
  }, { transaction });

  return contract;
}

/**
 * Gets expiring contracts
 *
 * @param daysUntilExpiry - Days threshold
 * @returns Expiring contracts
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringContracts(30);
 * ```
 */
export async function getExpiringContracts(daysUntilExpiry: number = 30): Promise<Contract[]> {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysUntilExpiry);

  return Contract.findAll({
    where: {
      status: ContractStatus.ACTIVE,
      endDate: {
        [Op.between]: [new Date(), thresholdDate],
      },
    },
    include: [{ model: Vendor }],
    order: [['endDate', 'ASC']],
  });
}

/**
 * Gets contracts by vendor
 *
 * @param vendorId - Vendor identifier
 * @param activeOnly - Filter for active contracts only
 * @returns Vendor contracts
 *
 * @example
 * ```typescript
 * const contracts = await getContractsByVendor('vendor-123', true);
 * ```
 */
export async function getContractsByVendor(
  vendorId: string,
  activeOnly: boolean = false
): Promise<Contract[]> {
  const where: WhereOptions = { vendorId };
  if (activeOnly) {
    where.status = ContractStatus.ACTIVE;
  }

  return Contract.findAll({
    where,
    order: [['startDate', 'DESC']],
  });
}

// ============================================================================
// BUDGET MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates a budget allocation
 *
 * @param data - Budget data
 * @param transaction - Optional database transaction
 * @returns Created budget
 *
 * @example
 * ```typescript
 * const budget = await createBudgetAllocation({
 *   budgetId: 'budget-123',
 *   departmentId: 'dept-456',
 *   fiscalYear: 2024,
 *   amount: 100000,
 *   categoryCode: 'IT-EQUIPMENT',
 *   approvedBy: 'cfo-789'
 * });
 * ```
 */
export async function createBudgetAllocation(
  data: BudgetAllocationData,
  transaction?: Transaction
): Promise<Budget> {
  const budget = await Budget.create(
    {
      ...data,
      allocatedAmount: data.amount,
      status: BudgetStatus.AVAILABLE,
    },
    { transaction }
  );

  return budget;
}

/**
 * Validates budget availability
 *
 * @param budgetId - Budget identifier
 * @param items - Items to validate against budget
 * @param transaction - Optional database transaction
 * @returns Validation result
 *
 * @example
 * ```typescript
 * await validateBudgetAvailability('budget-123', requisitionItems);
 * ```
 */
export async function validateBudgetAvailability(
  budgetId: string,
  items: PurchaseRequisitionItem[],
  transaction?: Transaction
): Promise<boolean> {
  const budget = await Budget.findByPk(budgetId, { transaction });
  if (!budget) {
    throw new NotFoundException(`Budget ${budgetId} not found`);
  }

  const requestedAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.estimatedUnitCost,
    0
  );

  const available = Number(budget.availableAmount || 0);
  if (requestedAmount > available) {
    throw new BadRequestException(
      `Insufficient budget. Available: ${available}, Requested: ${requestedAmount}`
    );
  }

  return true;
}

/**
 * Reserves budget for a requisition
 *
 * @param budgetId - Budget identifier
 * @param amount - Amount to reserve
 * @param transaction - Optional database transaction
 * @returns Updated budget
 *
 * @example
 * ```typescript
 * await reserveBudget('budget-123', 5000);
 * ```
 */
export async function reserveBudget(
  budgetId: string,
  amount: number,
  transaction?: Transaction
): Promise<Budget> {
  const budget = await Budget.findByPk(budgetId, { transaction });
  if (!budget) {
    throw new NotFoundException(`Budget ${budgetId} not found`);
  }

  const newReserved = Number(budget.reservedAmount) + amount;
  const newAvailable = Number(budget.allocatedAmount) - newReserved -
                       Number(budget.committedAmount) - Number(budget.spentAmount);

  if (newAvailable < 0) {
    throw new BadRequestException('Insufficient budget available');
  }

  await budget.update({
    reservedAmount: newReserved,
    availableAmount: newAvailable,
    status: newAvailable > 0 ? BudgetStatus.RESERVED : BudgetStatus.COMMITTED,
  }, { transaction });

  return budget;
}

/**
 * Commits budget for a purchase order
 *
 * @param budgetId - Budget identifier
 * @param amount - Amount to commit
 * @param transaction - Optional database transaction
 * @returns Updated budget
 *
 * @example
 * ```typescript
 * await commitBudget('budget-123', 5000);
 * ```
 */
export async function commitBudget(
  budgetId: string,
  amount: number,
  transaction?: Transaction
): Promise<Budget> {
  const budget = await Budget.findByPk(budgetId, { transaction });
  if (!budget) {
    throw new NotFoundException(`Budget ${budgetId} not found`);
  }

  const newCommitted = Number(budget.committedAmount) + amount;
  const newReserved = Math.max(0, Number(budget.reservedAmount) - amount);
  const newAvailable = Number(budget.allocatedAmount) - newReserved - newCommitted -
                       Number(budget.spentAmount);

  await budget.update({
    committedAmount: newCommitted,
    reservedAmount: newReserved,
    availableAmount: newAvailable,
    status: BudgetStatus.COMMITTED,
  }, { transaction });

  return budget;
}

/**
 * Records actual budget spend
 *
 * @param budgetId - Budget identifier
 * @param amount - Amount spent
 * @param transaction - Optional database transaction
 * @returns Updated budget
 *
 * @example
 * ```typescript
 * await recordBudgetSpend('budget-123', 5000);
 * ```
 */
export async function recordBudgetSpend(
  budgetId: string,
  amount: number,
  transaction?: Transaction
): Promise<Budget> {
  const budget = await Budget.findByPk(budgetId, { transaction });
  if (!budget) {
    throw new NotFoundException(`Budget ${budgetId} not found`);
  }

  const newSpent = Number(budget.spentAmount) + amount;
  const newCommitted = Math.max(0, Number(budget.committedAmount) - amount);
  const newAvailable = Number(budget.allocatedAmount) - Number(budget.reservedAmount) -
                       newCommitted - newSpent;

  await budget.update({
    spentAmount: newSpent,
    committedAmount: newCommitted,
    availableAmount: newAvailable,
    status: newSpent > Number(budget.allocatedAmount) ? BudgetStatus.EXCEEDED : BudgetStatus.SPENT,
  }, { transaction });

  return budget;
}

/**
 * Gets budget status by department
 *
 * @param departmentId - Department identifier
 * @param fiscalYear - Fiscal year
 * @returns Department budgets
 *
 * @example
 * ```typescript
 * const budgets = await getBudgetsByDepartment('dept-123', 2024);
 * ```
 */
export async function getBudgetsByDepartment(
  departmentId: string,
  fiscalYear: number
): Promise<Budget[]> {
  return Budget.findAll({
    where: { departmentId, fiscalYear },
    order: [['categoryCode', 'ASC']],
  });
}

// ============================================================================
// VENDOR MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates a new vendor
 *
 * @param data - Vendor data
 * @param transaction - Optional database transaction
 * @returns Created vendor
 *
 * @example
 * ```typescript
 * const vendor = await createVendor({
 *   vendorCode: 'DELL-001',
 *   name: 'Dell Technologies',
 *   email: 'procurement@dell.com',
 *   phone: '1-800-DELL',
 *   address: '1 Dell Way, Round Rock, TX',
 *   defaultPaymentTerms: PaymentTerms.NET_30
 * });
 * ```
 */
export async function createVendor(
  data: Partial<Vendor>,
  transaction?: Transaction
): Promise<Vendor> {
  // Check for duplicate vendor code
  if (data.vendorCode) {
    const existing = await Vendor.findOne({
      where: { vendorCode: data.vendorCode },
      transaction,
    });

    if (existing) {
      throw new ConflictException('Vendor code already exists');
    }
  }

  const vendor = await Vendor.create(
    {
      ...data,
      isActive: true,
      rating: VendorRating.UNRATED,
    } as any,
    { transaction }
  );

  return vendor;
}

/**
 * Updates vendor rating
 *
 * @param vendorId - Vendor identifier
 * @param rating - New rating
 * @param transaction - Optional database transaction
 * @returns Updated vendor
 *
 * @example
 * ```typescript
 * await updateVendorRating('vendor-123', VendorRating.EXCELLENT);
 * ```
 */
export async function updateVendorRating(
  vendorId: string,
  rating: VendorRating,
  transaction?: Transaction
): Promise<Vendor> {
  const vendor = await Vendor.findByPk(vendorId, { transaction });
  if (!vendor) {
    throw new NotFoundException(`Vendor ${vendorId} not found`);
  }

  await vendor.update({ rating }, { transaction });
  return vendor;
}

/**
 * Updates vendor performance metrics
 *
 * @param vendorId - Vendor identifier
 * @param metrics - Performance metrics
 * @param transaction - Optional database transaction
 * @returns Updated vendor
 *
 * @example
 * ```typescript
 * await updateVendorPerformance('vendor-123', {
 *   onTimeDelivery: 95,
 *   qualityScore: 98,
 *   responseTime: 24
 * });
 * ```
 */
export async function updateVendorPerformance(
  vendorId: string,
  metrics: Record<string, any>,
  transaction?: Transaction
): Promise<Vendor> {
  const vendor = await Vendor.findByPk(vendorId, { transaction });
  if (!vendor) {
    throw new NotFoundException(`Vendor ${vendorId} not found`);
  }

  const currentMetrics = vendor.performanceMetrics || {};
  await vendor.update({
    performanceMetrics: { ...currentMetrics, ...metrics },
  }, { transaction });

  return vendor;
}

/**
 * Gets preferred vendors
 *
 * @returns Preferred vendors
 *
 * @example
 * ```typescript
 * const preferred = await getPreferredVendors();
 * ```
 */
export async function getPreferredVendors(): Promise<Vendor[]> {
  return Vendor.findAll({
    where: { isPreferred: true, isActive: true },
    order: [['rating', 'DESC'], ['name', 'ASC']],
  });
}

/**
 * Gets vendors by rating
 *
 * @param minRating - Minimum rating
 * @returns Vendors
 *
 * @example
 * ```typescript
 * const topVendors = await getVendorsByRating(VendorRating.GOOD);
 * ```
 */
export async function getVendorsByRating(minRating: VendorRating): Promise<Vendor[]> {
  const ratingOrder = [
    VendorRating.EXCELLENT,
    VendorRating.GOOD,
    VendorRating.AVERAGE,
    VendorRating.POOR,
  ];
  const minIndex = ratingOrder.indexOf(minRating);
  const allowedRatings = ratingOrder.slice(0, minIndex + 1);

  return Vendor.findAll({
    where: {
      rating: { [Op.in]: allowedRatings },
      isActive: true,
    },
    order: [['rating', 'ASC'], ['name', 'ASC']],
  });
}

// ============================================================================
// APPROVAL WORKFLOW FUNCTIONS
// ============================================================================

/**
 * Creates an approval workflow
 *
 * @param data - Workflow data
 * @param transaction - Optional database transaction
 * @returns Created workflow
 *
 * @example
 * ```typescript
 * await createApprovalWorkflow({
 *   documentType: 'purchase_requisition',
 *   documentId: 'req-123',
 *   approvers: [
 *     { userId: 'manager-1', level: 1, required: true },
 *     { userId: 'director-1', level: 2, required: true }
 *   ],
 *   sequenceRequired: true
 * });
 * ```
 */
export async function createApprovalWorkflow(
  data: ApprovalWorkflowData,
  transaction?: Transaction
): Promise<ApprovalWorkflow> {
  // Sort approvers by level
  const sortedApprovers = data.approvers.sort((a, b) => a.level - b.level);

  const workflow = await ApprovalWorkflow.create(
    {
      ...data,
      approvers: sortedApprovers,
      currentApproverId: sortedApprovers[0]?.userId,
      currentLevel: 1,
      status: ApprovalStatus.PENDING,
      approvalHistory: [],
    },
    { transaction }
  );

  return workflow;
}

/**
 * Processes approval action
 *
 * @param workflowId - Workflow identifier
 * @param userId - User performing action
 * @param action - Approval action
 * @param comments - Optional comments
 * @param transaction - Optional database transaction
 * @returns Updated workflow
 *
 * @example
 * ```typescript
 * await processApprovalAction('workflow-123', 'manager-456', 'approved', 'Looks good');
 * ```
 */
export async function processApprovalAction(
  workflowId: string,
  userId: string,
  action: 'approved' | 'rejected',
  comments?: string,
  transaction?: Transaction
): Promise<ApprovalWorkflow> {
  const workflow = await ApprovalWorkflow.findByPk(workflowId, { transaction });
  if (!workflow) {
    throw new NotFoundException(`Workflow ${workflowId} not found`);
  }

  if (workflow.currentApproverId !== userId) {
    throw new ForbiddenException('User not authorized for current approval level');
  }

  const history = workflow.approvalHistory || [];
  history.push({
    userId,
    action,
    timestamp: new Date(),
    comments,
  });

  if (action === 'rejected') {
    await workflow.update({
      status: ApprovalStatus.REJECTED,
      approvalHistory: history,
    }, { transaction });
  } else {
    // Check for next approver
    const nextLevel = workflow.currentLevel + 1;
    const nextApprover = workflow.approvers.find(a => a.level === nextLevel && a.required);

    if (nextApprover) {
      await workflow.update({
        currentLevel: nextLevel,
        currentApproverId: nextApprover.userId,
        approvalHistory: history,
      }, { transaction });
    } else {
      await workflow.update({
        status: ApprovalStatus.APPROVED,
        approvalHistory: history,
      }, { transaction });
    }
  }

  return workflow;
}

/**
 * Gets pending approvals for a user
 *
 * @param userId - User identifier
 * @returns Pending workflows
 *
 * @example
 * ```typescript
 * const pending = await getPendingApprovalsForUser('manager-123');
 * ```
 */
export async function getPendingApprovalsForUser(userId: string): Promise<ApprovalWorkflow[]> {
  return ApprovalWorkflow.findAll({
    where: {
      currentApproverId: userId,
      status: ApprovalStatus.PENDING,
    },
    order: [['createdAt', 'ASC']],
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Gets approvers for a requisition based on amount
 */
async function getApproversForRequisition(
  requisition: PurchaseRequisition
): Promise<ApproverData[]> {
  const amount = Number(requisition.totalEstimatedCost || 0);
  const approvers: ApproverData[] = [];

  // Simple approval hierarchy based on amount
  if (amount < 5000) {
    approvers.push({ userId: 'manager', level: 1, required: true });
  } else if (amount < 25000) {
    approvers.push({ userId: 'manager', level: 1, required: true });
    approvers.push({ userId: 'director', level: 2, required: true });
  } else {
    approvers.push({ userId: 'manager', level: 1, required: true });
    approvers.push({ userId: 'director', level: 2, required: true });
    approvers.push({ userId: 'vp', level: 3, required: true });
  }

  return approvers;
}

/**
 * Gets vendor rating score for evaluation
 */
function getVendorRatingScore(rating?: VendorRating): number {
  const scores: Record<VendorRating, number> = {
    [VendorRating.EXCELLENT]: 100,
    [VendorRating.GOOD]: 80,
    [VendorRating.AVERAGE]: 60,
    [VendorRating.POOR]: 40,
    [VendorRating.UNRATED]: 50,
  };

  return scores[rating || VendorRating.UNRATED];
}

/**
 * Checks if all PO items have been received
 */
function checkIfAllItemsReceived(
  po: PurchaseOrder,
  receivedItems: ReceivedItem[]
): boolean {
  // Simplified check - would need more complex logic in production
  const totalOrdered = po.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalReceived = receivedItems.reduce((sum, item) => sum + item.quantityReceived, 0);
  return totalReceived >= totalOrdered;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  Vendor,
  PurchaseRequisition,
  RFQ,
  VendorQuote,
  PurchaseOrder,
  AssetReceiving,
  AssetInspection,
  Contract,
  Budget,
  ApprovalWorkflow,

  // Requisition Functions
  createPurchaseRequisition,
  submitRequisitionForApproval,
  approvePurchaseRequisition,
  rejectPurchaseRequisition,
  getRequisitionsByStatus,
  getRequisitionsByDepartment,
  updatePurchaseRequisition,
  cancelPurchaseRequisition,

  // RFQ Functions
  createRFQ,
  publishRFQ,
  submitVendorQuote,
  evaluateVendorQuotes,
  awardRFQ,
  getQuotesForRFQ,

  // Purchase Order Functions
  createPurchaseOrder,
  approvePurchaseOrder,
  issuePurchaseOrder,
  getPurchaseOrdersByStatus,
  getPurchaseOrdersByVendor,
  updatePurchaseOrder,
  cancelPurchaseOrder,

  // Receiving Functions
  receiveAssets,
  inspectReceivedAssets,
  getReceivingsForPO,
  getInspectionsForReceiving,

  // Contract Functions
  createContract,
  activateContract,
  renewContract,
  getExpiringContracts,
  getContractsByVendor,

  // Budget Functions
  createBudgetAllocation,
  validateBudgetAvailability,
  reserveBudget,
  commitBudget,
  recordBudgetSpend,
  getBudgetsByDepartment,

  // Vendor Functions
  createVendor,
  updateVendorRating,
  updateVendorPerformance,
  getPreferredVendors,
  getVendorsByRating,

  // Approval Functions
  createApprovalWorkflow,
  processApprovalAction,
  getPendingApprovalsForUser,
};
