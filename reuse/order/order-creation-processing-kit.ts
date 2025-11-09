/**
 * LOC: ORD-CRT-001
 * File: /reuse/order/order-creation-processing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Order controllers
 *   - Order services
 *   - Order processors
 */

/**
 * File: /reuse/order/order-creation-processing-kit.ts
 * Locator: WC-ORD-CRTPRC-001
 * Purpose: Comprehensive Order Creation & Processing - Complete order entry, validation, creation workflows
 *
 * Upstream: Independent utility module for order creation operations
 * Downstream: ../backend/order/*, Order modules, Transaction services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 45 utility functions for order creation, validation, processing, workflows
 *
 * LLM Context: Enterprise-grade order creation utilities to compete with JD Edwards EnterpriseOne.
 * Provides comprehensive order entry, multi-channel order capture, order validation with business rules,
 * order creation workflows, order templates, quick order entry, mass order import, order duplication,
 * order splitting, order merging, price calculations, tax calculations, shipping calculations,
 * credit checks, inventory availability checks, customer validation, address validation, and more.
 */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  Logger,
} from '@nestjs/common';
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
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsString, IsEnum, IsArray, IsBoolean, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * Order source channels for multi-channel order capture
 */
export enum OrderSource {
  WEB = 'WEB',
  MOBILE = 'MOBILE',
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  FAX = 'FAX',
  EDI = 'EDI',
  API = 'API',
  POS = 'POS',
  SALES_REP = 'SALES_REP',
  MARKETPLACE = 'MARKETPLACE',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  PARTNER = 'PARTNER',
}

/**
 * Order status for workflow management
 */
export enum OrderStatus {
  DRAFT = 'DRAFT',
  PENDING_VALIDATION = 'PENDING_VALIDATION',
  VALIDATED = 'VALIDATED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  PROCESSING = 'PROCESSING',
  CONFIRMED = 'CONFIRMED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

/**
 * Order type classifications
 */
export enum OrderType {
  STANDARD = 'STANDARD',
  RUSH = 'RUSH',
  BACKORDER = 'BACKORDER',
  PREORDER = 'PREORDER',
  SUBSCRIPTION = 'SUBSCRIPTION',
  SAMPLE = 'SAMPLE',
  WARRANTY = 'WARRANTY',
  RETURN_EXCHANGE = 'RETURN_EXCHANGE',
  QUOTE = 'QUOTE',
  CONTRACT = 'CONTRACT',
}

/**
 * Order priority levels
 */
export enum OrderPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
}

/**
 * Payment terms
 */
export enum PaymentTerms {
  NET_30 = 'NET_30',
  NET_60 = 'NET_60',
  NET_90 = 'NET_90',
  COD = 'COD',
  PREPAID = 'PREPAID',
  DUE_ON_RECEIPT = 'DUE_ON_RECEIPT',
  CREDIT_CARD = 'CREDIT_CARD',
  INSTALLMENT = 'INSTALLMENT',
}

/**
 * Shipping method types
 */
export enum ShippingMethod {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  OVERNIGHT = 'OVERNIGHT',
  TWO_DAY = 'TWO_DAY',
  GROUND = 'GROUND',
  FREIGHT = 'FREIGHT',
  PICKUP = 'PICKUP',
  DROP_SHIP = 'DROP_SHIP',
}

/**
 * Tax calculation methods
 */
export enum TaxCalculationMethod {
  ORIGIN_BASED = 'ORIGIN_BASED',
  DESTINATION_BASED = 'DESTINATION_BASED',
  HYBRID = 'HYBRID',
  VAT = 'VAT',
  GST = 'GST',
  EXEMPT = 'EXEMPT',
}

/**
 * Credit check status
 */
export enum CreditCheckStatus {
  NOT_REQUIRED = 'NOT_REQUIRED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
  OVER_LIMIT = 'OVER_LIMIT',
}

/**
 * Validation error severity
 */
export enum ValidationSeverity {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
}

// ============================================================================
// INTERFACES & DTOS
// ============================================================================

/**
 * Address information
 */
export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  addressType?: 'BILLING' | 'SHIPPING' | 'BOTH';
  isValidated?: boolean;
  validationTimestamp?: Date;
}

/**
 * Customer information for order
 */
export interface CustomerInfo {
  customerId: string;
  customerNumber?: string;
  customerName: string;
  email?: string;
  phone?: string;
  billingAddress: Address;
  shippingAddress?: Address;
  taxExempt?: boolean;
  taxExemptNumber?: string;
  creditLimit?: number;
  currentBalance?: number;
  paymentTerms: PaymentTerms;
}

/**
 * Order line item
 */
export interface OrderLineItem {
  lineNumber: number;
  itemId: string;
  itemNumber: string;
  itemDescription: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  discount?: number;
  discountPercent?: number;
  taxAmount?: number;
  taxRate?: number;
  lineTotal: number;
  requestedDeliveryDate?: Date;
  warehouseId?: string;
  notes?: string;
  customFields?: Record<string, unknown>;
}

/**
 * Order pricing breakdown
 */
export interface OrderPricing {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  handlingAmount: number;
  totalAmount: number;
  currency: string;
}

/**
 * Order validation result
 */
export interface OrderValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  validatedAt: Date;
}

/**
 * Validation error detail
 */
export interface ValidationError {
  code: string;
  field?: string;
  message: string;
  severity: ValidationSeverity;
  details?: Record<string, unknown>;
}

/**
 * Credit check result
 */
export interface CreditCheckResult {
  status: CreditCheckStatus;
  creditLimit: number;
  currentBalance: number;
  availableCredit: number;
  orderAmount: number;
  approved: boolean;
  reason?: string;
  checkedAt: Date;
  checkedBy?: string;
}

/**
 * Inventory availability result
 */
export interface InventoryAvailability {
  itemId: string;
  warehouseId: string;
  quantityRequested: number;
  quantityAvailable: number;
  quantityOnHand: number;
  quantityReserved: number;
  quantityBackordered: number;
  isAvailable: boolean;
  expectedAvailabilityDate?: Date;
}

/**
 * Order creation request DTO
 */
export class CreateOrderDto {
  @ApiProperty({ description: 'Order source channel', enum: OrderSource })
  @IsEnum(OrderSource)
  @IsNotEmpty()
  orderSource: OrderSource;

  @ApiProperty({ description: 'Order type', enum: OrderType })
  @IsEnum(OrderType)
  @IsNotEmpty()
  orderType: OrderType;

  @ApiProperty({ description: 'Order priority', enum: OrderPriority })
  @IsEnum(OrderPriority)
  @IsNotEmpty()
  priority: OrderPriority;

  @ApiProperty({ description: 'Customer information' })
  @ValidateNested()
  @Type(() => Object)
  @IsNotEmpty()
  customer: CustomerInfo;

  @ApiProperty({ description: 'Order line items', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsNotEmpty()
  lineItems: OrderLineItem[];

  @ApiPropertyOptional({ description: 'Shipping method', enum: ShippingMethod })
  @IsEnum(ShippingMethod)
  @IsOptional()
  shippingMethod?: ShippingMethod;

  @ApiPropertyOptional({ description: 'Requested delivery date' })
  @IsOptional()
  requestedDeliveryDate?: Date;

  @ApiPropertyOptional({ description: 'Purchase order number' })
  @IsString()
  @IsOptional()
  poNumber?: string;

  @ApiPropertyOptional({ description: 'Order notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Sales representative ID' })
  @IsString()
  @IsOptional()
  salesRepId?: string;

  @ApiPropertyOptional({ description: 'Custom fields' })
  @IsOptional()
  customFields?: Record<string, unknown>;
}

/**
 * Order template for quick entry
 */
export interface OrderTemplate {
  templateId: string;
  templateName: string;
  description?: string;
  customerId?: string;
  orderType: OrderType;
  lineItems: Partial<OrderLineItem>[];
  shippingMethod?: ShippingMethod;
  createdBy: string;
  createdAt: Date;
  isActive: boolean;
}

/**
 * Bulk order import record
 */
export interface BulkOrderImportRecord {
  rowNumber: number;
  customerId: string;
  itemId: string;
  quantity: number;
  unitPrice?: number;
  requestedDeliveryDate?: Date;
  poNumber?: string;
  errors?: string[];
  isValid: boolean;
}

/**
 * Order split configuration
 */
export interface OrderSplitConfig {
  splitBy: 'WAREHOUSE' | 'SHIP_DATE' | 'CUSTOM';
  preserveOrderNumber: boolean;
  generateChildOrders: boolean;
}

/**
 * Order merge configuration
 */
export interface OrderMergeConfig {
  orderIds: string[];
  mergeShippingCharges: boolean;
  useLowestTaxRate: boolean;
  consolidateLineItems: boolean;
}

/**
 * Price calculation context
 */
export interface PriceCalculationContext {
  customerId: string;
  itemId: string;
  quantity: number;
  orderDate: Date;
  customerPriceGroup?: string;
  promotionCode?: string;
  contractId?: string;
}

/**
 * Tax calculation context
 */
export interface TaxCalculationContext {
  customerId: string;
  shipToAddress: Address;
  shipFromAddress: Address;
  lineItems: OrderLineItem[];
  orderDate: Date;
  taxExempt: boolean;
  taxExemptNumber?: string;
}

/**
 * Shipping calculation context
 */
export interface ShippingCalculationContext {
  shipToAddress: Address;
  shipFromAddress: Address;
  shippingMethod: ShippingMethod;
  totalWeight: number;
  totalVolume: number;
  declaredValue: number;
  lineItems: OrderLineItem[];
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Order header model
 */
@Table({
  tableName: 'order_headers',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['orderNumber'], unique: true },
    { fields: ['customerId'] },
    { fields: ['orderStatus'] },
    { fields: ['orderDate'] },
    { fields: ['orderSource'] },
    { fields: ['createdAt'] },
  ],
})
export class OrderHeader extends Model {
  @ApiProperty({ description: 'Order ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  orderId: string;

  @ApiProperty({ description: 'Order number (auto-generated)' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  @Index
  orderNumber: string;

  @ApiProperty({ description: 'Customer ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @Index
  customerId: string;

  @ApiProperty({ description: 'Order date' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  orderDate: Date;

  @ApiProperty({ description: 'Order source channel', enum: OrderSource })
  @Column({
    type: DataType.ENUM(...Object.values(OrderSource)),
    allowNull: false,
  })
  orderSource: OrderSource;

  @ApiProperty({ description: 'Order type', enum: OrderType })
  @Column({
    type: DataType.ENUM(...Object.values(OrderType)),
    allowNull: false,
  })
  orderType: OrderType;

  @ApiProperty({ description: 'Order status', enum: OrderStatus })
  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    allowNull: false,
    defaultValue: OrderStatus.DRAFT,
  })
  @Index
  orderStatus: OrderStatus;

  @ApiProperty({ description: 'Order priority', enum: OrderPriority })
  @Column({
    type: DataType.ENUM(...Object.values(OrderPriority)),
    allowNull: false,
    defaultValue: OrderPriority.NORMAL,
  })
  priority: OrderPriority;

  @ApiProperty({ description: 'Customer information (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  customerInfo: CustomerInfo;

  @ApiProperty({ description: 'Billing address (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  billingAddress: Address;

  @ApiProperty({ description: 'Shipping address (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  shippingAddress: Address;

  @ApiProperty({ description: 'Shipping method', enum: ShippingMethod })
  @Column({
    type: DataType.ENUM(...Object.values(ShippingMethod)),
    allowNull: true,
  })
  shippingMethod: ShippingMethod;

  @ApiProperty({ description: 'Payment terms', enum: PaymentTerms })
  @Column({
    type: DataType.ENUM(...Object.values(PaymentTerms)),
    allowNull: false,
  })
  paymentTerms: PaymentTerms;

  @ApiProperty({ description: 'Subtotal amount' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  subtotal: number;

  @ApiProperty({ description: 'Discount amount' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  discountAmount: number;

  @ApiProperty({ description: 'Tax amount' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  taxAmount: number;

  @ApiProperty({ description: 'Shipping amount' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  shippingAmount: number;

  @ApiProperty({ description: 'Total amount' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  totalAmount: number;

  @ApiProperty({ description: 'Currency code' })
  @Column({
    type: DataType.STRING(3),
    allowNull: false,
    defaultValue: 'USD',
  })
  currency: string;

  @ApiProperty({ description: 'Purchase order number' })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  poNumber: string;

  @ApiProperty({ description: 'Requested delivery date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  requestedDeliveryDate: Date;

  @ApiProperty({ description: 'Sales representative ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  salesRepId: string;

  @ApiProperty({ description: 'Order notes' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @ApiProperty({ description: 'Credit check status', enum: CreditCheckStatus })
  @Column({
    type: DataType.ENUM(...Object.values(CreditCheckStatus)),
    allowNull: false,
    defaultValue: CreditCheckStatus.NOT_REQUIRED,
  })
  creditCheckStatus: CreditCheckStatus;

  @ApiProperty({ description: 'Credit check result (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  creditCheckResult: CreditCheckResult;

  @ApiProperty({ description: 'Validation result (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  validationResult: OrderValidationResult;

  @ApiProperty({ description: 'Parent order ID (for split orders)' })
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  parentOrderId: string;

  @ApiProperty({ description: 'Custom fields (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  customFields: Record<string, unknown>;

  @ApiProperty({ description: 'Created by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  createdBy: string;

  @ApiProperty({ description: 'Updated by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  updatedBy: string;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @DeletedAt
  @Column
  deletedAt: Date;

  @HasMany(() => OrderLine)
  lines: OrderLine[];
}

/**
 * Order line model
 */
@Table({
  tableName: 'order_lines',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['orderId'] },
    { fields: ['itemId'] },
    { fields: ['lineNumber'] },
  ],
})
export class OrderLine extends Model {
  @ApiProperty({ description: 'Order line ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  orderLineId: string;

  @ApiProperty({ description: 'Order ID' })
  @ForeignKey(() => OrderHeader)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  orderId: string;

  @BelongsTo(() => OrderHeader)
  order: OrderHeader;

  @ApiProperty({ description: 'Line number' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  lineNumber: number;

  @ApiProperty({ description: 'Item ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @Index
  itemId: string;

  @ApiProperty({ description: 'Item number' })
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  itemNumber: string;

  @ApiProperty({ description: 'Item description' })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  itemDescription: string;

  @ApiProperty({ description: 'Quantity ordered' })
  @Column({
    type: DataType.DECIMAL(15, 4),
    allowNull: false,
  })
  quantity: number;

  @ApiProperty({ description: 'Unit of measure' })
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  unitOfMeasure: string;

  @ApiProperty({ description: 'Unit price' })
  @Column({
    type: DataType.DECIMAL(15, 4),
    allowNull: false,
  })
  unitPrice: number;

  @ApiProperty({ description: 'Discount amount' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  discount: number;

  @ApiProperty({ description: 'Discount percentage' })
  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  })
  discountPercent: number;

  @ApiProperty({ description: 'Tax amount' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  taxAmount: number;

  @ApiProperty({ description: 'Tax rate' })
  @Column({
    type: DataType.DECIMAL(5, 4),
    allowNull: false,
    defaultValue: 0,
  })
  taxRate: number;

  @ApiProperty({ description: 'Line total amount' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  lineTotal: number;

  @ApiProperty({ description: 'Requested delivery date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  requestedDeliveryDate: Date;

  @ApiProperty({ description: 'Warehouse ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  warehouseId: string;

  @ApiProperty({ description: 'Line notes' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @ApiProperty({ description: 'Custom fields (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  customFields: Record<string, unknown>;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @DeletedAt
  @Column
  deletedAt: Date;
}

/**
 * Order template model
 */
@Table({
  tableName: 'order_templates',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['templateName'] },
    { fields: ['customerId'] },
    { fields: ['createdBy'] },
  ],
})
export class OrderTemplateModel extends Model {
  @ApiProperty({ description: 'Template ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  templateId: string;

  @ApiProperty({ description: 'Template name' })
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  @Index
  templateName: string;

  @ApiProperty({ description: 'Template description' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @ApiProperty({ description: 'Customer ID (optional)' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  @Index
  customerId: string;

  @ApiProperty({ description: 'Order type', enum: OrderType })
  @Column({
    type: DataType.ENUM(...Object.values(OrderType)),
    allowNull: false,
  })
  orderType: OrderType;

  @ApiProperty({ description: 'Line items template (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  lineItems: Partial<OrderLineItem>[];

  @ApiProperty({ description: 'Shipping method', enum: ShippingMethod })
  @Column({
    type: DataType.ENUM(...Object.values(ShippingMethod)),
    allowNull: true,
  })
  shippingMethod: ShippingMethod;

  @ApiProperty({ description: 'Is active' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @ApiProperty({ description: 'Created by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @Index
  createdBy: string;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;

  @DeletedAt
  @Column
  deletedAt: Date;
}

// ============================================================================
// UTILITY FUNCTIONS - ORDER CREATION & ENTRY
// ============================================================================

/**
 * Generate unique order number with prefix and sequence
 *
 * @param prefix - Order number prefix (e.g., 'SO', 'PO')
 * @param sequence - Sequence number
 * @param length - Total length of numeric portion
 * @returns Formatted order number
 *
 * @example
 * generateOrderNumber('SO', 12345, 8) // Returns: 'SO00012345'
 */
export function generateOrderNumber(
  prefix: string,
  sequence: number,
  length: number = 8,
): string {
  try {
    const paddedSequence = sequence.toString().padStart(length, '0');
    return `${prefix}${paddedSequence}`;
  } catch (error) {
    throw new Error(`Failed to generate order number: ${error.message}`);
  }
}

/**
 * Create order from web channel
 *
 * @param orderData - Order creation data
 * @param userId - User ID creating the order
 * @returns Created order header
 *
 * @example
 * const order = await createWebOrder(orderDto, 'user-123');
 */
export async function createWebOrder(
  orderData: CreateOrderDto,
  userId: string,
): Promise<OrderHeader> {
  try {
    const orderNumber = await generateNextOrderNumber('WEB');

    const order = await OrderHeader.create({
      orderNumber,
      customerId: orderData.customer.customerId,
      orderDate: new Date(),
      orderSource: OrderSource.WEB,
      orderType: orderData.orderType,
      orderStatus: OrderStatus.DRAFT,
      priority: orderData.priority,
      customerInfo: orderData.customer,
      billingAddress: orderData.customer.billingAddress,
      shippingAddress: orderData.customer.shippingAddress || orderData.customer.billingAddress,
      shippingMethod: orderData.shippingMethod,
      paymentTerms: orderData.customer.paymentTerms,
      poNumber: orderData.poNumber,
      requestedDeliveryDate: orderData.requestedDeliveryDate,
      salesRepId: orderData.salesRepId,
      notes: orderData.notes,
      customFields: orderData.customFields,
      createdBy: userId,
      subtotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      shippingAmount: 0,
      totalAmount: 0,
      currency: 'USD',
    });

    // Create order lines
    for (let i = 0; i < orderData.lineItems.length; i++) {
      const lineItem = orderData.lineItems[i];
      await OrderLine.create({
        orderId: order.orderId,
        lineNumber: i + 1,
        itemId: lineItem.itemId,
        itemNumber: lineItem.itemNumber,
        itemDescription: lineItem.itemDescription,
        quantity: lineItem.quantity,
        unitOfMeasure: lineItem.unitOfMeasure,
        unitPrice: lineItem.unitPrice,
        discount: lineItem.discount || 0,
        discountPercent: lineItem.discountPercent || 0,
        taxAmount: lineItem.taxAmount || 0,
        taxRate: lineItem.taxRate || 0,
        lineTotal: lineItem.lineTotal,
        requestedDeliveryDate: lineItem.requestedDeliveryDate,
        warehouseId: lineItem.warehouseId,
        notes: lineItem.notes,
        customFields: lineItem.customFields,
      });
    }

    return order;
  } catch (error) {
    throw new BadRequestException(`Failed to create web order: ${error.message}`);
  }
}

/**
 * Create order from mobile channel
 *
 * @param orderData - Order creation data
 * @param deviceInfo - Mobile device information
 * @param userId - User ID creating the order
 * @returns Created order header
 */
export async function createMobileOrder(
  orderData: CreateOrderDto,
  deviceInfo: Record<string, unknown>,
  userId: string,
): Promise<OrderHeader> {
  try {
    const orderNumber = await generateNextOrderNumber('MOB');

    const customFields = {
      ...orderData.customFields,
      deviceInfo,
      mobileApp: true,
    };

    const order = await OrderHeader.create({
      orderNumber,
      customerId: orderData.customer.customerId,
      orderDate: new Date(),
      orderSource: OrderSource.MOBILE,
      orderType: orderData.orderType,
      orderStatus: OrderStatus.DRAFT,
      priority: orderData.priority,
      customerInfo: orderData.customer,
      billingAddress: orderData.customer.billingAddress,
      shippingAddress: orderData.customer.shippingAddress || orderData.customer.billingAddress,
      shippingMethod: orderData.shippingMethod,
      paymentTerms: orderData.customer.paymentTerms,
      poNumber: orderData.poNumber,
      requestedDeliveryDate: orderData.requestedDeliveryDate,
      salesRepId: orderData.salesRepId,
      notes: orderData.notes,
      customFields,
      createdBy: userId,
      subtotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      shippingAmount: 0,
      totalAmount: 0,
      currency: 'USD',
    });

    return order;
  } catch (error) {
    throw new BadRequestException(`Failed to create mobile order: ${error.message}`);
  }
}

/**
 * Create order from EDI (Electronic Data Interchange)
 *
 * @param ediMessage - Parsed EDI 850 message
 * @param tradingPartnerId - Trading partner ID
 * @returns Created order header
 */
export async function createEDIOrder(
  ediMessage: Record<string, unknown>,
  tradingPartnerId: string,
): Promise<OrderHeader> {
  try {
    const orderNumber = await generateNextOrderNumber('EDI');

    // Parse EDI message to order structure
    const customerInfo = extractCustomerFromEDI(ediMessage);
    const lineItems = extractLineItemsFromEDI(ediMessage);

    const order = await OrderHeader.create({
      orderNumber,
      customerId: tradingPartnerId,
      orderDate: new Date(),
      orderSource: OrderSource.EDI,
      orderType: OrderType.STANDARD,
      orderStatus: OrderStatus.PENDING_VALIDATION,
      priority: OrderPriority.NORMAL,
      customerInfo,
      billingAddress: customerInfo.billingAddress,
      shippingAddress: customerInfo.shippingAddress,
      paymentTerms: customerInfo.paymentTerms,
      customFields: { ediMessage },
      createdBy: 'EDI_SYSTEM',
      subtotal: 0,
      taxAmount: 0,
      shippingAmount: 0,
      totalAmount: 0,
      currency: 'USD',
    });

    return order;
  } catch (error) {
    throw new UnprocessableEntityException(`Failed to create EDI order: ${error.message}`);
  }
}

/**
 * Create order from API call
 *
 * @param orderData - Order creation data
 * @param apiKey - API key used
 * @param sourceSystem - Source system identifier
 * @returns Created order header
 */
export async function createAPIOrder(
  orderData: CreateOrderDto,
  apiKey: string,
  sourceSystem: string,
): Promise<OrderHeader> {
  try {
    const orderNumber = await generateNextOrderNumber('API');

    const customFields = {
      ...orderData.customFields,
      apiKey,
      sourceSystem,
      apiVersion: '1.0',
    };

    const order = await OrderHeader.create({
      orderNumber,
      customerId: orderData.customer.customerId,
      orderDate: new Date(),
      orderSource: OrderSource.API,
      orderType: orderData.orderType,
      orderStatus: OrderStatus.DRAFT,
      priority: orderData.priority,
      customerInfo: orderData.customer,
      billingAddress: orderData.customer.billingAddress,
      shippingAddress: orderData.customer.shippingAddress || orderData.customer.billingAddress,
      shippingMethod: orderData.shippingMethod,
      paymentTerms: orderData.customer.paymentTerms,
      poNumber: orderData.poNumber,
      requestedDeliveryDate: orderData.requestedDeliveryDate,
      salesRepId: orderData.salesRepId,
      notes: orderData.notes,
      customFields,
      createdBy: 'API_SYSTEM',
      subtotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      shippingAmount: 0,
      totalAmount: 0,
      currency: 'USD',
    });

    return order;
  } catch (error) {
    throw new BadRequestException(`Failed to create API order: ${error.message}`);
  }
}

/**
 * Create order from phone/call center
 *
 * @param orderData - Order creation data
 * @param callCenterRep - Call center representative ID
 * @param callId - Call tracking ID
 * @returns Created order header
 */
export async function createPhoneOrder(
  orderData: CreateOrderDto,
  callCenterRep: string,
  callId: string,
): Promise<OrderHeader> {
  try {
    const orderNumber = await generateNextOrderNumber('PHN');

    const customFields = {
      ...orderData.customFields,
      callId,
      callCenterRep,
      orderMethod: 'PHONE',
    };

    const order = await OrderHeader.create({
      orderNumber,
      customerId: orderData.customer.customerId,
      orderDate: new Date(),
      orderSource: OrderSource.PHONE,
      orderType: orderData.orderType,
      orderStatus: OrderStatus.DRAFT,
      priority: orderData.priority,
      customerInfo: orderData.customer,
      billingAddress: orderData.customer.billingAddress,
      shippingAddress: orderData.customer.shippingAddress || orderData.customer.billingAddress,
      shippingMethod: orderData.shippingMethod,
      paymentTerms: orderData.customer.paymentTerms,
      poNumber: orderData.poNumber,
      requestedDeliveryDate: orderData.requestedDeliveryDate,
      salesRepId: orderData.salesRepId || callCenterRep,
      notes: orderData.notes,
      customFields,
      createdBy: callCenterRep,
      subtotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      shippingAmount: 0,
      totalAmount: 0,
      currency: 'USD',
    });

    return order;
  } catch (error) {
    throw new BadRequestException(`Failed to create phone order: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - ORDER VALIDATION
// ============================================================================

/**
 * Validate complete order with all business rules
 *
 * @param orderId - Order ID to validate
 * @returns Validation result with errors and warnings
 */
export async function validateOrder(orderId: string): Promise<OrderValidationResult> {
  try {
    const order = await OrderHeader.findByPk(orderId, {
      include: [{ model: OrderLine, as: 'lines' }],
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Validate customer
    const customerValidation = await validateCustomer(order.customerInfo);
    errors.push(...customerValidation.errors);
    warnings.push(...customerValidation.warnings);

    // Validate line items
    for (const line of order.lines) {
      const lineValidation = await validateOrderLine(line);
      errors.push(...lineValidation.errors);
      warnings.push(...lineValidation.warnings);
    }

    // Validate inventory availability
    const inventoryValidation = await validateInventoryAvailability(order.lines);
    errors.push(...inventoryValidation.errors);
    warnings.push(...inventoryValidation.warnings);

    // Validate pricing
    const pricingValidation = await validateOrderPricing(order);
    errors.push(...pricingValidation.errors);
    warnings.push(...pricingValidation.warnings);

    // Validate addresses
    const addressValidation = await validateAddresses(
      order.billingAddress,
      order.shippingAddress,
    );
    errors.push(...addressValidation.errors);
    warnings.push(...addressValidation.warnings);

    const result: OrderValidationResult = {
      isValid: errors.filter(e => e.severity === ValidationSeverity.ERROR).length === 0,
      errors,
      warnings,
      validatedAt: new Date(),
    };

    // Update order with validation result
    await order.update({
      validationResult: result,
      orderStatus: result.isValid ? OrderStatus.VALIDATED : OrderStatus.PENDING_VALIDATION,
    });

    return result;
  } catch (error) {
    throw new Error(`Order validation failed: ${error.message}`);
  }
}

/**
 * Validate customer information and credit standing
 *
 * @param customerInfo - Customer information to validate
 * @returns Validation result
 */
export async function validateCustomer(
  customerInfo: CustomerInfo,
): Promise<{ errors: ValidationError[]; warnings: ValidationError[] }> {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  try {
    // Validate customer exists and is active
    if (!customerInfo.customerId) {
      errors.push({
        code: 'CUSTOMER_ID_MISSING',
        field: 'customerId',
        message: 'Customer ID is required',
        severity: ValidationSeverity.ERROR,
      });
    }

    // Validate customer name
    if (!customerInfo.customerName || customerInfo.customerName.trim().length === 0) {
      errors.push({
        code: 'CUSTOMER_NAME_MISSING',
        field: 'customerName',
        message: 'Customer name is required',
        severity: ValidationSeverity.ERROR,
      });
    }

    // Validate payment terms
    if (!customerInfo.paymentTerms) {
      errors.push({
        code: 'PAYMENT_TERMS_MISSING',
        field: 'paymentTerms',
        message: 'Payment terms are required',
        severity: ValidationSeverity.ERROR,
      });
    }

    // Check credit limit if applicable
    if (customerInfo.creditLimit && customerInfo.currentBalance) {
      const availableCredit = customerInfo.creditLimit - customerInfo.currentBalance;
      if (availableCredit <= 0) {
        warnings.push({
          code: 'CREDIT_LIMIT_EXCEEDED',
          field: 'creditLimit',
          message: `Customer has exceeded credit limit. Available: $${availableCredit.toFixed(2)}`,
          severity: ValidationSeverity.WARNING,
          details: {
            creditLimit: customerInfo.creditLimit,
            currentBalance: customerInfo.currentBalance,
            availableCredit,
          },
        });
      }
    }

    return { errors, warnings };
  } catch (error) {
    errors.push({
      code: 'CUSTOMER_VALIDATION_ERROR',
      message: `Customer validation failed: ${error.message}`,
      severity: ValidationSeverity.ERROR,
    });
    return { errors, warnings };
  }
}

/**
 * Validate individual order line item
 *
 * @param orderLine - Order line to validate
 * @returns Validation result
 */
export async function validateOrderLine(
  orderLine: OrderLine,
): Promise<{ errors: ValidationError[]; warnings: ValidationError[] }> {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  try {
    // Validate item ID
    if (!orderLine.itemId) {
      errors.push({
        code: 'ITEM_ID_MISSING',
        field: `line${orderLine.lineNumber}.itemId`,
        message: 'Item ID is required',
        severity: ValidationSeverity.ERROR,
      });
    }

    // Validate quantity
    if (!orderLine.quantity || orderLine.quantity <= 0) {
      errors.push({
        code: 'INVALID_QUANTITY',
        field: `line${orderLine.lineNumber}.quantity`,
        message: 'Quantity must be greater than zero',
        severity: ValidationSeverity.ERROR,
      });
    }

    // Validate unit price
    if (orderLine.unitPrice < 0) {
      errors.push({
        code: 'INVALID_UNIT_PRICE',
        field: `line${orderLine.lineNumber}.unitPrice`,
        message: 'Unit price cannot be negative',
        severity: ValidationSeverity.ERROR,
      });
    }

    // Validate line total calculation
    const expectedTotal = (orderLine.quantity * orderLine.unitPrice) - orderLine.discount;
    if (Math.abs(expectedTotal - orderLine.lineTotal) > 0.01) {
      errors.push({
        code: 'LINE_TOTAL_MISMATCH',
        field: `line${orderLine.lineNumber}.lineTotal`,
        message: 'Line total does not match calculation',
        severity: ValidationSeverity.ERROR,
        details: {
          expected: expectedTotal,
          actual: orderLine.lineTotal,
        },
      });
    }

    return { errors, warnings };
  } catch (error) {
    errors.push({
      code: 'LINE_VALIDATION_ERROR',
      message: `Line validation failed: ${error.message}`,
      severity: ValidationSeverity.ERROR,
    });
    return { errors, warnings };
  }
}

/**
 * Validate inventory availability for all order lines
 *
 * @param orderLines - Order lines to check
 * @returns Validation result with availability details
 */
export async function validateInventoryAvailability(
  orderLines: OrderLine[],
): Promise<{ errors: ValidationError[]; warnings: ValidationError[] }> {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  try {
    for (const line of orderLines) {
      const availability = await checkInventoryAvailability(
        line.itemId,
        line.warehouseId || 'DEFAULT',
        line.quantity,
      );

      if (!availability.isAvailable) {
        if (availability.quantityAvailable === 0) {
          errors.push({
            code: 'OUT_OF_STOCK',
            field: `line${line.lineNumber}.itemId`,
            message: `Item ${line.itemNumber} is out of stock`,
            severity: ValidationSeverity.ERROR,
            details: availability,
          });
        } else if (availability.quantityAvailable < line.quantity) {
          warnings.push({
            code: 'PARTIAL_AVAILABILITY',
            field: `line${line.lineNumber}.quantity`,
            message: `Only ${availability.quantityAvailable} of ${line.quantity} available for ${line.itemNumber}`,
            severity: ValidationSeverity.WARNING,
            details: availability,
          });
        }
      }
    }

    return { errors, warnings };
  } catch (error) {
    errors.push({
      code: 'INVENTORY_CHECK_ERROR',
      message: `Inventory validation failed: ${error.message}`,
      severity: ValidationSeverity.ERROR,
    });
    return { errors, warnings };
  }
}

/**
 * Validate order pricing and calculations
 *
 * @param order - Order to validate
 * @returns Validation result
 */
export async function validateOrderPricing(
  order: OrderHeader,
): Promise<{ errors: ValidationError[]; warnings: ValidationError[] }> {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  try {
    // Validate subtotal matches sum of line totals
    const lines = await OrderLine.findAll({ where: { orderId: order.orderId } });
    const calculatedSubtotal = lines.reduce((sum, line) => sum + Number(line.lineTotal), 0);

    if (Math.abs(calculatedSubtotal - Number(order.subtotal)) > 0.01) {
      errors.push({
        code: 'SUBTOTAL_MISMATCH',
        field: 'subtotal',
        message: 'Order subtotal does not match sum of line totals',
        severity: ValidationSeverity.ERROR,
        details: {
          expected: calculatedSubtotal,
          actual: order.subtotal,
        },
      });
    }

    // Validate total amount calculation
    const expectedTotal = Number(order.subtotal) - Number(order.discountAmount) +
                         Number(order.taxAmount) + Number(order.shippingAmount);

    if (Math.abs(expectedTotal - Number(order.totalAmount)) > 0.01) {
      errors.push({
        code: 'TOTAL_AMOUNT_MISMATCH',
        field: 'totalAmount',
        message: 'Order total does not match calculation',
        severity: ValidationSeverity.ERROR,
        details: {
          expected: expectedTotal,
          actual: order.totalAmount,
        },
      });
    }

    // Warn if tax amount is zero for non-exempt customers
    if (Number(order.taxAmount) === 0 && !order.customerInfo.taxExempt) {
      warnings.push({
        code: 'ZERO_TAX_AMOUNT',
        field: 'taxAmount',
        message: 'Tax amount is zero for non-exempt customer',
        severity: ValidationSeverity.WARNING,
      });
    }

    return { errors, warnings };
  } catch (error) {
    errors.push({
      code: 'PRICING_VALIDATION_ERROR',
      message: `Pricing validation failed: ${error.message}`,
      severity: ValidationSeverity.ERROR,
    });
    return { errors, warnings };
  }
}

/**
 * Validate billing and shipping addresses
 *
 * @param billingAddress - Billing address
 * @param shippingAddress - Shipping address
 * @returns Validation result
 */
export async function validateAddresses(
  billingAddress: Address,
  shippingAddress: Address,
): Promise<{ errors: ValidationError[]; warnings: ValidationError[] }> {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  try {
    // Validate billing address
    const billingValidation = validateSingleAddress(billingAddress, 'billingAddress');
    errors.push(...billingValidation.errors);
    warnings.push(...billingValidation.warnings);

    // Validate shipping address
    if (shippingAddress) {
      const shippingValidation = validateSingleAddress(shippingAddress, 'shippingAddress');
      errors.push(...shippingValidation.errors);
      warnings.push(...shippingValidation.warnings);
    }

    return { errors, warnings };
  } catch (error) {
    errors.push({
      code: 'ADDRESS_VALIDATION_ERROR',
      message: `Address validation failed: ${error.message}`,
      severity: ValidationSeverity.ERROR,
    });
    return { errors, warnings };
  }
}

// ============================================================================
// UTILITY FUNCTIONS - CREDIT CHECKING
// ============================================================================

/**
 * Perform credit check for order
 *
 * @param orderId - Order ID to check
 * @returns Credit check result
 */
export async function performCreditCheck(orderId: string): Promise<CreditCheckResult> {
  try {
    const order = await OrderHeader.findByPk(orderId);
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    const customerInfo = order.customerInfo;

    // If prepaid or COD, no credit check needed
    if (
      customerInfo.paymentTerms === PaymentTerms.PREPAID ||
      customerInfo.paymentTerms === PaymentTerms.COD
    ) {
      const result: CreditCheckResult = {
        status: CreditCheckStatus.NOT_REQUIRED,
        creditLimit: 0,
        currentBalance: 0,
        availableCredit: 0,
        orderAmount: Number(order.totalAmount),
        approved: true,
        reason: 'Payment terms do not require credit check',
        checkedAt: new Date(),
      };

      await order.update({
        creditCheckStatus: CreditCheckStatus.NOT_REQUIRED,
        creditCheckResult: result,
      });

      return result;
    }

    const creditLimit = customerInfo.creditLimit || 0;
    const currentBalance = customerInfo.currentBalance || 0;
    const availableCredit = creditLimit - currentBalance;
    const orderAmount = Number(order.totalAmount);

    let status: CreditCheckStatus;
    let approved: boolean;
    let reason: string;

    if (availableCredit >= orderAmount) {
      status = CreditCheckStatus.APPROVED;
      approved = true;
      reason = 'Sufficient credit available';
    } else if (availableCredit > 0 && availableCredit < orderAmount) {
      status = CreditCheckStatus.MANUAL_REVIEW;
      approved = false;
      reason = `Order amount ($${orderAmount.toFixed(2)}) exceeds available credit ($${availableCredit.toFixed(2)})`;
    } else {
      status = CreditCheckStatus.OVER_LIMIT;
      approved = false;
      reason = 'Customer over credit limit';
    }

    const result: CreditCheckResult = {
      status,
      creditLimit,
      currentBalance,
      availableCredit,
      orderAmount,
      approved,
      reason,
      checkedAt: new Date(),
    };

    await order.update({
      creditCheckStatus: status,
      creditCheckResult: result,
    });

    return result;
  } catch (error) {
    throw new Error(`Credit check failed: ${error.message}`);
  }
}

/**
 * Override credit check with manual approval
 *
 * @param orderId - Order ID
 * @param approvedBy - User ID approving the override
 * @param reason - Reason for override
 * @returns Updated credit check result
 */
export async function overrideCreditCheck(
  orderId: string,
  approvedBy: string,
  reason: string,
): Promise<CreditCheckResult> {
  try {
    const order = await OrderHeader.findByPk(orderId);
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    const existingResult = order.creditCheckResult as CreditCheckResult;

    const result: CreditCheckResult = {
      ...existingResult,
      status: CreditCheckStatus.APPROVED,
      approved: true,
      reason: `Manual override by ${approvedBy}: ${reason}`,
      checkedAt: new Date(),
      checkedBy: approvedBy,
    };

    await order.update({
      creditCheckStatus: CreditCheckStatus.APPROVED,
      creditCheckResult: result,
      orderStatus: OrderStatus.APPROVED,
    });

    return result;
  } catch (error) {
    throw new Error(`Credit check override failed: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - INVENTORY CHECKING
// ============================================================================

/**
 * Check inventory availability for item
 *
 * @param itemId - Item ID
 * @param warehouseId - Warehouse ID
 * @param quantityRequested - Requested quantity
 * @returns Inventory availability details
 */
export async function checkInventoryAvailability(
  itemId: string,
  warehouseId: string,
  quantityRequested: number,
): Promise<InventoryAvailability> {
  try {
    // Mock implementation - replace with actual inventory service call
    const mockInventory = {
      quantityOnHand: 100,
      quantityReserved: 20,
    };

    const quantityAvailable = mockInventory.quantityOnHand - mockInventory.quantityReserved;
    const isAvailable = quantityAvailable >= quantityRequested;
    const quantityBackordered = isAvailable ? 0 : quantityRequested - quantityAvailable;

    return {
      itemId,
      warehouseId,
      quantityRequested,
      quantityAvailable,
      quantityOnHand: mockInventory.quantityOnHand,
      quantityReserved: mockInventory.quantityReserved,
      quantityBackordered,
      isAvailable,
      expectedAvailabilityDate: !isAvailable ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined,
    };
  } catch (error) {
    throw new Error(`Inventory availability check failed: ${error.message}`);
  }
}

/**
 * Reserve inventory for order
 *
 * @param orderId - Order ID
 * @returns Reservation results for each line item
 */
export async function reserveInventoryForOrder(
  orderId: string,
): Promise<Array<{ lineNumber: number; reserved: boolean; reason?: string }>> {
  try {
    const lines = await OrderLine.findAll({ where: { orderId } });
    const results = [];

    for (const line of lines) {
      const availability = await checkInventoryAvailability(
        line.itemId,
        line.warehouseId || 'DEFAULT',
        line.quantity,
      );

      if (availability.isAvailable) {
        // Mock reservation - replace with actual inventory service call
        results.push({
          lineNumber: line.lineNumber,
          reserved: true,
        });
      } else {
        results.push({
          lineNumber: line.lineNumber,
          reserved: false,
          reason: `Insufficient inventory. Available: ${availability.quantityAvailable}, Requested: ${line.quantity}`,
        });
      }
    }

    return results;
  } catch (error) {
    throw new Error(`Inventory reservation failed: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - PRICING CALCULATIONS
// ============================================================================

/**
 * Calculate unit price for item based on customer and quantity
 *
 * @param context - Price calculation context
 * @returns Calculated unit price
 */
export async function calculateUnitPrice(
  context: PriceCalculationContext,
): Promise<number> {
  try {
    // Mock implementation - replace with actual pricing service
    let basePrice = 100.00;

    // Apply quantity discounts
    if (context.quantity >= 100) {
      basePrice *= 0.85; // 15% discount
    } else if (context.quantity >= 50) {
      basePrice *= 0.90; // 10% discount
    } else if (context.quantity >= 10) {
      basePrice *= 0.95; // 5% discount
    }

    // Apply customer price group discounts
    if (context.customerPriceGroup === 'WHOLESALE') {
      basePrice *= 0.80;
    } else if (context.customerPriceGroup === 'VIP') {
      basePrice *= 0.85;
    }

    // Apply promotion codes
    if (context.promotionCode) {
      basePrice *= 0.90; // 10% promotion discount
    }

    return Number(basePrice.toFixed(4));
  } catch (error) {
    throw new Error(`Unit price calculation failed: ${error.message}`);
  }
}

/**
 * Calculate order totals including subtotal, tax, shipping
 *
 * @param orderId - Order ID
 * @returns Updated order pricing
 */
export async function calculateOrderTotals(orderId: string): Promise<OrderPricing> {
  try {
    const order = await OrderHeader.findByPk(orderId);
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    const lines = await OrderLine.findAll({ where: { orderId } });

    // Calculate subtotal
    const subtotal = lines.reduce((sum, line) => sum + Number(line.lineTotal), 0);

    // Calculate tax
    const taxContext: TaxCalculationContext = {
      customerId: order.customerId,
      shipToAddress: order.shippingAddress,
      shipFromAddress: { country: 'US', stateProvince: 'CA' } as Address, // Mock
      lineItems: lines.map(l => ({
        lineNumber: l.lineNumber,
        itemId: l.itemId,
        itemNumber: l.itemNumber,
        itemDescription: l.itemDescription,
        quantity: Number(l.quantity),
        unitOfMeasure: l.unitOfMeasure,
        unitPrice: Number(l.unitPrice),
        lineTotal: Number(l.lineTotal),
      })),
      orderDate: order.orderDate,
      taxExempt: order.customerInfo.taxExempt || false,
      taxExemptNumber: order.customerInfo.taxExemptNumber,
    };
    const taxAmount = await calculateOrderTax(taxContext);

    // Calculate shipping
    const shippingContext: ShippingCalculationContext = {
      shipToAddress: order.shippingAddress,
      shipFromAddress: { country: 'US', stateProvince: 'CA' } as Address, // Mock
      shippingMethod: order.shippingMethod || ShippingMethod.STANDARD,
      totalWeight: 10.0, // Mock
      totalVolume: 5.0, // Mock
      declaredValue: subtotal,
      lineItems: lines.map(l => ({
        lineNumber: l.lineNumber,
        itemId: l.itemId,
        itemNumber: l.itemNumber,
        itemDescription: l.itemDescription,
        quantity: Number(l.quantity),
        unitOfMeasure: l.unitOfMeasure,
        unitPrice: Number(l.unitPrice),
        lineTotal: Number(l.lineTotal),
      })),
    };
    const shippingAmount = await calculateShippingCost(shippingContext);

    const totalAmount = subtotal - Number(order.discountAmount) + taxAmount + shippingAmount;

    const pricing: OrderPricing = {
      subtotal,
      discountAmount: Number(order.discountAmount),
      taxAmount,
      shippingAmount,
      handlingAmount: 0,
      totalAmount,
      currency: order.currency,
    };

    // Update order with calculated totals
    await order.update({
      subtotal: pricing.subtotal,
      taxAmount: pricing.taxAmount,
      shippingAmount: pricing.shippingAmount,
      totalAmount: pricing.totalAmount,
    });

    return pricing;
  } catch (error) {
    throw new Error(`Order totals calculation failed: ${error.message}`);
  }
}

/**
 * Calculate tax amount for order
 *
 * @param context - Tax calculation context
 * @returns Calculated tax amount
 */
export async function calculateOrderTax(
  context: TaxCalculationContext,
): Promise<number> {
  try {
    // If tax exempt, return 0
    if (context.taxExempt) {
      return 0;
    }

    // Mock implementation - replace with actual tax service (Avalara, TaxJar, etc.)
    const subtotal = context.lineItems.reduce((sum, item) => sum + item.lineTotal, 0);

    // Use state-based tax rate (mock)
    let taxRate = 0.0;
    const state = context.shipToAddress.stateProvince;

    if (state === 'CA') {
      taxRate = 0.0725; // California base rate
    } else if (state === 'NY') {
      taxRate = 0.04; // New York base rate
    } else if (state === 'TX') {
      taxRate = 0.0625; // Texas base rate
    }

    const taxAmount = subtotal * taxRate;
    return Number(taxAmount.toFixed(2));
  } catch (error) {
    throw new Error(`Tax calculation failed: ${error.message}`);
  }
}

/**
 * Calculate shipping cost for order
 *
 * @param context - Shipping calculation context
 * @returns Calculated shipping cost
 */
export async function calculateShippingCost(
  context: ShippingCalculationContext,
): Promise<number> {
  try {
    // Mock implementation - replace with actual shipping service (UPS, FedEx, etc.)
    let baseCost = 10.00;

    // Apply shipping method multipliers
    switch (context.shippingMethod) {
      case ShippingMethod.OVERNIGHT:
        baseCost *= 5.0;
        break;
      case ShippingMethod.TWO_DAY:
        baseCost *= 3.0;
        break;
      case ShippingMethod.EXPRESS:
        baseCost *= 2.0;
        break;
      case ShippingMethod.FREIGHT:
        baseCost *= 10.0;
        break;
      case ShippingMethod.PICKUP:
        return 0;
      default:
        baseCost *= 1.0;
    }

    // Apply weight-based charges
    if (context.totalWeight > 50) {
      baseCost += (context.totalWeight - 50) * 0.50;
    }

    // Free shipping over threshold
    if (context.declaredValue > 100) {
      baseCost *= 0.5; // 50% discount
    }

    return Number(baseCost.toFixed(2));
  } catch (error) {
    throw new Error(`Shipping cost calculation failed: ${error.message}`);
  }
}

/**
 * Apply discount to order
 *
 * @param orderId - Order ID
 * @param discountAmount - Discount amount or percentage
 * @param isPercentage - Whether discount is percentage
 * @param reason - Reason for discount
 * @returns Updated order with discount applied
 */
export async function applyOrderDiscount(
  orderId: string,
  discountAmount: number,
  isPercentage: boolean,
  reason: string,
): Promise<OrderHeader> {
  try {
    const order = await OrderHeader.findByPk(orderId);
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    let finalDiscountAmount: number;

    if (isPercentage) {
      if (discountAmount < 0 || discountAmount > 100) {
        throw new BadRequestException('Discount percentage must be between 0 and 100');
      }
      finalDiscountAmount = Number(order.subtotal) * (discountAmount / 100);
    } else {
      finalDiscountAmount = discountAmount;
    }

    await order.update({
      discountAmount: finalDiscountAmount,
    });

    // Recalculate totals
    await calculateOrderTotals(orderId);

    return order.reload();
  } catch (error) {
    throw new Error(`Apply discount failed: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - ORDER TEMPLATES
// ============================================================================

/**
 * Create order template for quick entry
 *
 * @param templateData - Template data
 * @param userId - User creating template
 * @returns Created template
 */
export async function createOrderTemplate(
  templateData: Omit<OrderTemplate, 'templateId' | 'createdAt'>,
  userId: string,
): Promise<OrderTemplateModel> {
  try {
    const template = await OrderTemplateModel.create({
      templateName: templateData.templateName,
      description: templateData.description,
      customerId: templateData.customerId,
      orderType: templateData.orderType,
      lineItems: templateData.lineItems,
      shippingMethod: templateData.shippingMethod,
      isActive: templateData.isActive,
      createdBy: userId,
    });

    return template;
  } catch (error) {
    throw new BadRequestException(`Failed to create order template: ${error.message}`);
  }
}

/**
 * Create order from template
 *
 * @param templateId - Template ID
 * @param customerId - Customer ID for the order
 * @param userId - User creating order
 * @returns Created order
 */
export async function createOrderFromTemplate(
  templateId: string,
  customerId: string,
  userId: string,
): Promise<OrderHeader> {
  try {
    const template = await OrderTemplateModel.findByPk(templateId);
    if (!template) {
      throw new NotFoundException(`Template ${templateId} not found`);
    }

    if (!template.isActive) {
      throw new BadRequestException('Template is not active');
    }

    // Fetch customer information
    const customerInfo = await fetchCustomerInfo(customerId);

    const orderNumber = await generateNextOrderNumber('TPL');

    const order = await OrderHeader.create({
      orderNumber,
      customerId,
      orderDate: new Date(),
      orderSource: OrderSource.WEB,
      orderType: template.orderType,
      orderStatus: OrderStatus.DRAFT,
      priority: OrderPriority.NORMAL,
      customerInfo,
      billingAddress: customerInfo.billingAddress,
      shippingAddress: customerInfo.shippingAddress || customerInfo.billingAddress,
      shippingMethod: template.shippingMethod,
      paymentTerms: customerInfo.paymentTerms,
      createdBy: userId,
      subtotal: 0,
      taxAmount: 0,
      shippingAmount: 0,
      totalAmount: 0,
      currency: 'USD',
      customFields: { templateId },
    });

    // Create lines from template
    for (let i = 0; i < template.lineItems.length; i++) {
      const templateItem = template.lineItems[i];
      await OrderLine.create({
        orderId: order.orderId,
        lineNumber: i + 1,
        itemId: templateItem.itemId,
        itemNumber: templateItem.itemNumber,
        itemDescription: templateItem.itemDescription,
        quantity: templateItem.quantity,
        unitOfMeasure: templateItem.unitOfMeasure,
        unitPrice: templateItem.unitPrice,
        lineTotal: templateItem.quantity * templateItem.unitPrice,
      });
    }

    // Calculate totals
    await calculateOrderTotals(order.orderId);

    return order.reload();
  } catch (error) {
    throw new BadRequestException(`Failed to create order from template: ${error.message}`);
  }
}

/**
 * Get order templates for customer or user
 *
 * @param filters - Filter criteria
 * @returns Array of templates
 */
export async function getOrderTemplates(
  filters: {
    customerId?: string;
    createdBy?: string;
    isActive?: boolean;
  },
): Promise<OrderTemplateModel[]> {
  try {
    const whereClause: any = {};

    if (filters.customerId) {
      whereClause.customerId = filters.customerId;
    }
    if (filters.createdBy) {
      whereClause.createdBy = filters.createdBy;
    }
    if (filters.isActive !== undefined) {
      whereClause.isActive = filters.isActive;
    }

    const templates = await OrderTemplateModel.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    return templates;
  } catch (error) {
    throw new Error(`Failed to fetch order templates: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - BULK OPERATIONS
// ============================================================================

/**
 * Import bulk orders from CSV or Excel
 *
 * @param records - Array of import records
 * @param userId - User importing orders
 * @returns Import results with created orders and errors
 */
export async function importBulkOrders(
  records: BulkOrderImportRecord[],
  userId: string,
): Promise<{
  successful: OrderHeader[];
  failed: Array<{ record: BulkOrderImportRecord; errors: string[] }>;
}> {
  const successful: OrderHeader[] = [];
  const failed: Array<{ record: BulkOrderImportRecord; errors: string[] }> = [];

  try {
    for (const record of records) {
      try {
        // Validate record
        if (!record.isValid) {
          failed.push({ record, errors: record.errors || ['Invalid record'] });
          continue;
        }

        // Fetch customer info
        const customerInfo = await fetchCustomerInfo(record.customerId);

        // Create order
        const orderNumber = await generateNextOrderNumber('BLK');
        const order = await OrderHeader.create({
          orderNumber,
          customerId: record.customerId,
          orderDate: new Date(),
          orderSource: OrderSource.API,
          orderType: OrderType.STANDARD,
          orderStatus: OrderStatus.DRAFT,
          priority: OrderPriority.NORMAL,
          customerInfo,
          billingAddress: customerInfo.billingAddress,
          shippingAddress: customerInfo.shippingAddress || customerInfo.billingAddress,
          paymentTerms: customerInfo.paymentTerms,
          poNumber: record.poNumber,
          requestedDeliveryDate: record.requestedDeliveryDate,
          createdBy: userId,
          subtotal: 0,
          taxAmount: 0,
          shippingAmount: 0,
          totalAmount: 0,
          currency: 'USD',
        });

        // Create order line
        await OrderLine.create({
          orderId: order.orderId,
          lineNumber: 1,
          itemId: record.itemId,
          itemNumber: record.itemId,
          itemDescription: 'Bulk import item',
          quantity: record.quantity,
          unitOfMeasure: 'EA',
          unitPrice: record.unitPrice || 0,
          lineTotal: record.quantity * (record.unitPrice || 0),
        });

        // Calculate totals
        await calculateOrderTotals(order.orderId);

        successful.push(order);
      } catch (error) {
        failed.push({ record, errors: [error.message] });
      }
    }

    return { successful, failed };
  } catch (error) {
    throw new Error(`Bulk import failed: ${error.message}`);
  }
}

/**
 * Duplicate existing order
 *
 * @param orderId - Order ID to duplicate
 * @param userId - User creating duplicate
 * @returns Duplicated order
 */
export async function duplicateOrder(
  orderId: string,
  userId: string,
): Promise<OrderHeader> {
  try {
    const originalOrder = await OrderHeader.findByPk(orderId, {
      include: [{ model: OrderLine, as: 'lines' }],
    });

    if (!originalOrder) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    const orderNumber = await generateNextOrderNumber('DUP');

    // Create duplicate order
    const duplicateOrder = await OrderHeader.create({
      orderNumber,
      customerId: originalOrder.customerId,
      orderDate: new Date(),
      orderSource: originalOrder.orderSource,
      orderType: originalOrder.orderType,
      orderStatus: OrderStatus.DRAFT,
      priority: originalOrder.priority,
      customerInfo: originalOrder.customerInfo,
      billingAddress: originalOrder.billingAddress,
      shippingAddress: originalOrder.shippingAddress,
      shippingMethod: originalOrder.shippingMethod,
      paymentTerms: originalOrder.paymentTerms,
      salesRepId: originalOrder.salesRepId,
      createdBy: userId,
      subtotal: 0,
      taxAmount: 0,
      shippingAmount: 0,
      totalAmount: 0,
      currency: originalOrder.currency,
      customFields: {
        ...originalOrder.customFields,
        duplicatedFrom: originalOrder.orderId,
      },
    });

    // Duplicate order lines
    for (const line of originalOrder.lines) {
      await OrderLine.create({
        orderId: duplicateOrder.orderId,
        lineNumber: line.lineNumber,
        itemId: line.itemId,
        itemNumber: line.itemNumber,
        itemDescription: line.itemDescription,
        quantity: line.quantity,
        unitOfMeasure: line.unitOfMeasure,
        unitPrice: line.unitPrice,
        discount: line.discount,
        discountPercent: line.discountPercent,
        taxAmount: line.taxAmount,
        taxRate: line.taxRate,
        lineTotal: line.lineTotal,
        warehouseId: line.warehouseId,
        notes: line.notes,
        customFields: line.customFields,
      });
    }

    // Recalculate totals with current prices
    await calculateOrderTotals(duplicateOrder.orderId);

    return duplicateOrder.reload();
  } catch (error) {
    throw new BadRequestException(`Failed to duplicate order: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - ORDER SPLITTING & MERGING
// ============================================================================

/**
 * Split order into multiple orders based on criteria
 *
 * @param orderId - Order ID to split
 * @param config - Split configuration
 * @param userId - User performing split
 * @returns Array of split orders
 */
export async function splitOrder(
  orderId: string,
  config: OrderSplitConfig,
  userId: string,
): Promise<OrderHeader[]> {
  try {
    const originalOrder = await OrderHeader.findByPk(orderId, {
      include: [{ model: OrderLine, as: 'lines' }],
    });

    if (!originalOrder) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    const splitOrders: OrderHeader[] = [];

    if (config.splitBy === 'WAREHOUSE') {
      // Group lines by warehouse
      const warehouseGroups = new Map<string, OrderLine[]>();
      for (const line of originalOrder.lines) {
        const warehouse = line.warehouseId || 'DEFAULT';
        if (!warehouseGroups.has(warehouse)) {
          warehouseGroups.set(warehouse, []);
        }
        warehouseGroups.get(warehouse).push(line);
      }

      // Create order for each warehouse
      for (const [warehouse, lines] of warehouseGroups) {
        const newOrder = await createSplitOrder(
          originalOrder,
          lines,
          userId,
          { warehouse },
        );
        splitOrders.push(newOrder);
      }
    }

    // Mark original order as split
    await originalOrder.update({
      orderStatus: OrderStatus.CANCELLED,
      notes: `${originalOrder.notes || ''}\n\nOrder split into ${splitOrders.length} orders`,
    });

    return splitOrders;
  } catch (error) {
    throw new BadRequestException(`Failed to split order: ${error.message}`);
  }
}

/**
 * Merge multiple orders into single order
 *
 * @param config - Merge configuration
 * @param userId - User performing merge
 * @returns Merged order
 */
export async function mergeOrders(
  config: OrderMergeConfig,
  userId: string,
): Promise<OrderHeader> {
  try {
    if (config.orderIds.length < 2) {
      throw new BadRequestException('At least 2 orders required for merge');
    }

    const orders = await OrderHeader.findAll({
      where: { orderId: config.orderIds },
      include: [{ model: OrderLine, as: 'lines' }],
    });

    if (orders.length !== config.orderIds.length) {
      throw new NotFoundException('One or more orders not found');
    }

    // Validate all orders have same customer
    const customerId = orders[0].customerId;
    if (!orders.every(o => o.customerId === customerId)) {
      throw new BadRequestException('All orders must belong to same customer');
    }

    const orderNumber = await generateNextOrderNumber('MRG');

    // Create merged order
    const mergedOrder = await OrderHeader.create({
      orderNumber,
      customerId,
      orderDate: new Date(),
      orderSource: orders[0].orderSource,
      orderType: orders[0].orderType,
      orderStatus: OrderStatus.DRAFT,
      priority: orders[0].priority,
      customerInfo: orders[0].customerInfo,
      billingAddress: orders[0].billingAddress,
      shippingAddress: orders[0].shippingAddress,
      shippingMethod: orders[0].shippingMethod,
      paymentTerms: orders[0].paymentTerms,
      createdBy: userId,
      subtotal: 0,
      taxAmount: 0,
      shippingAmount: 0,
      totalAmount: 0,
      currency: orders[0].currency,
      customFields: {
        mergedFrom: config.orderIds,
      },
    });

    // Merge all lines
    let lineNumber = 1;
    for (const order of orders) {
      for (const line of order.lines) {
        await OrderLine.create({
          orderId: mergedOrder.orderId,
          lineNumber: lineNumber++,
          itemId: line.itemId,
          itemNumber: line.itemNumber,
          itemDescription: line.itemDescription,
          quantity: line.quantity,
          unitOfMeasure: line.unitOfMeasure,
          unitPrice: line.unitPrice,
          discount: line.discount,
          discountPercent: line.discountPercent,
          lineTotal: line.lineTotal,
          warehouseId: line.warehouseId,
          notes: line.notes,
          customFields: {
            ...line.customFields,
            originalOrderId: order.orderId,
          },
        });
      }
    }

    // Calculate totals
    await calculateOrderTotals(mergedOrder.orderId);

    // Mark original orders as merged
    for (const order of orders) {
      await order.update({
        orderStatus: OrderStatus.CANCELLED,
        notes: `${order.notes || ''}\n\nMerged into order ${orderNumber}`,
      });
    }

    return mergedOrder.reload();
  } catch (error) {
    throw new BadRequestException(`Failed to merge orders: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - WORKFLOW & STATE MANAGEMENT
// ============================================================================

/**
 * Update order status with validation
 *
 * @param orderId - Order ID
 * @param newStatus - New status
 * @param userId - User making change
 * @param notes - Optional notes
 * @returns Updated order
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  userId: string,
  notes?: string,
): Promise<OrderHeader> {
  try {
    const order = await OrderHeader.findByPk(orderId);
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    // Validate status transition
    const validTransition = validateStatusTransition(order.orderStatus, newStatus);
    if (!validTransition) {
      throw new BadRequestException(
        `Invalid status transition from ${order.orderStatus} to ${newStatus}`,
      );
    }

    await order.update({
      orderStatus: newStatus,
      notes: notes ? `${order.notes || ''}\n\n${notes}` : order.notes,
      updatedBy: userId,
    });

    return order;
  } catch (error) {
    throw new Error(`Failed to update order status: ${error.message}`);
  }
}

/**
 * Validate status transition is allowed
 *
 * @param currentStatus - Current status
 * @param newStatus - Desired new status
 * @returns Whether transition is valid
 */
export function validateStatusTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus,
): boolean {
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.DRAFT]: [
      OrderStatus.PENDING_VALIDATION,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.PENDING_VALIDATION]: [
      OrderStatus.VALIDATED,
      OrderStatus.DRAFT,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.VALIDATED]: [
      OrderStatus.PENDING_APPROVAL,
      OrderStatus.CONFIRMED,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.PENDING_APPROVAL]: [
      OrderStatus.APPROVED,
      OrderStatus.REJECTED,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.APPROVED]: [
      OrderStatus.PENDING_PAYMENT,
      OrderStatus.PROCESSING,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.REJECTED]: [
      OrderStatus.DRAFT,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.PENDING_PAYMENT]: [
      OrderStatus.PAYMENT_RECEIVED,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.PAYMENT_RECEIVED]: [
      OrderStatus.PROCESSING,
    ],
    [OrderStatus.PROCESSING]: [
      OrderStatus.CONFIRMED,
      OrderStatus.ON_HOLD,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.CONFIRMED]: [
      OrderStatus.COMPLETED,
      OrderStatus.ON_HOLD,
    ],
    [OrderStatus.ON_HOLD]: [
      OrderStatus.PROCESSING,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.CANCELLED]: [],
    [OrderStatus.COMPLETED]: [],
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
}

/**
 * Get order workflow history
 *
 * @param orderId - Order ID
 * @returns Workflow history
 */
export async function getOrderWorkflowHistory(
  orderId: string,
): Promise<Array<{
  status: OrderStatus;
  timestamp: Date;
  userId: string;
  notes?: string;
}>> {
  try {
    // Mock implementation - replace with actual audit log query
    const order = await OrderHeader.findByPk(orderId);
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    return [
      {
        status: OrderStatus.DRAFT,
        timestamp: order.createdAt,
        userId: order.createdBy,
      },
      {
        status: order.orderStatus,
        timestamp: order.updatedAt,
        userId: order.updatedBy || order.createdBy,
      },
    ];
  } catch (error) {
    throw new Error(`Failed to fetch workflow history: ${error.message}`);
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate next order number for given prefix
 */
async function generateNextOrderNumber(prefix: string): Promise<string> {
  // Mock implementation - replace with actual sequence generator
  const sequence = Math.floor(Math.random() * 1000000);
  return generateOrderNumber(prefix, sequence, 8);
}

/**
 * Fetch customer information from customer service
 */
async function fetchCustomerInfo(customerId: string): Promise<CustomerInfo> {
  // Mock implementation - replace with actual customer service call
  return {
    customerId,
    customerNumber: `CUST${customerId}`,
    customerName: 'Mock Customer',
    email: 'customer@example.com',
    phone: '555-0100',
    billingAddress: {
      addressLine1: '123 Main St',
      city: 'San Francisco',
      stateProvince: 'CA',
      postalCode: '94105',
      country: 'US',
      addressType: 'BILLING',
    },
    shippingAddress: {
      addressLine1: '123 Main St',
      city: 'San Francisco',
      stateProvince: 'CA',
      postalCode: '94105',
      country: 'US',
      addressType: 'SHIPPING',
    },
    creditLimit: 50000,
    currentBalance: 10000,
    paymentTerms: PaymentTerms.NET_30,
  };
}

/**
 * Extract customer info from EDI message
 */
function extractCustomerFromEDI(ediMessage: Record<string, unknown>): CustomerInfo {
  // Mock implementation
  return {
    customerId: 'EDI_CUSTOMER',
    customerName: 'EDI Trading Partner',
    billingAddress: {
      addressLine1: '123 EDI Lane',
      city: 'Commerce',
      stateProvince: 'CA',
      postalCode: '90001',
      country: 'US',
    },
    paymentTerms: PaymentTerms.NET_30,
  };
}

/**
 * Extract line items from EDI message
 */
function extractLineItemsFromEDI(ediMessage: Record<string, unknown>): OrderLineItem[] {
  // Mock implementation
  return [
    {
      lineNumber: 1,
      itemId: 'EDI_ITEM_001',
      itemNumber: 'ITEM001',
      itemDescription: 'EDI Item',
      quantity: 10,
      unitOfMeasure: 'EA',
      unitPrice: 100,
      lineTotal: 1000,
    },
  ];
}

/**
 * Validate single address
 */
function validateSingleAddress(
  address: Address,
  fieldPrefix: string,
): { errors: ValidationError[]; warnings: ValidationError[] } {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!address.addressLine1) {
    errors.push({
      code: 'ADDRESS_LINE1_MISSING',
      field: `${fieldPrefix}.addressLine1`,
      message: 'Address line 1 is required',
      severity: ValidationSeverity.ERROR,
    });
  }

  if (!address.city) {
    errors.push({
      code: 'CITY_MISSING',
      field: `${fieldPrefix}.city`,
      message: 'City is required',
      severity: ValidationSeverity.ERROR,
    });
  }

  if (!address.stateProvince) {
    errors.push({
      code: 'STATE_MISSING',
      field: `${fieldPrefix}.stateProvince`,
      message: 'State/Province is required',
      severity: ValidationSeverity.ERROR,
    });
  }

  if (!address.postalCode) {
    errors.push({
      code: 'POSTAL_CODE_MISSING',
      field: `${fieldPrefix}.postalCode`,
      message: 'Postal code is required',
      severity: ValidationSeverity.ERROR,
    });
  }

  if (!address.country) {
    errors.push({
      code: 'COUNTRY_MISSING',
      field: `${fieldPrefix}.country`,
      message: 'Country is required',
      severity: ValidationSeverity.ERROR,
    });
  }

  return { errors, warnings };
}

/**
 * Create split order from original
 */
async function createSplitOrder(
  originalOrder: OrderHeader,
  lines: OrderLine[],
  userId: string,
  metadata: Record<string, unknown>,
): Promise<OrderHeader> {
  const orderNumber = await generateNextOrderNumber('SPL');

  const splitOrder = await OrderHeader.create({
    orderNumber,
    customerId: originalOrder.customerId,
    orderDate: new Date(),
    orderSource: originalOrder.orderSource,
    orderType: originalOrder.orderType,
    orderStatus: OrderStatus.DRAFT,
    priority: originalOrder.priority,
    customerInfo: originalOrder.customerInfo,
    billingAddress: originalOrder.billingAddress,
    shippingAddress: originalOrder.shippingAddress,
    shippingMethod: originalOrder.shippingMethod,
    paymentTerms: originalOrder.paymentTerms,
    parentOrderId: originalOrder.orderId,
    createdBy: userId,
    subtotal: 0,
    taxAmount: 0,
    shippingAmount: 0,
    totalAmount: 0,
    currency: originalOrder.currency,
    customFields: {
      ...metadata,
      splitFrom: originalOrder.orderId,
    },
  });

  // Copy lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    await OrderLine.create({
      orderId: splitOrder.orderId,
      lineNumber: i + 1,
      itemId: line.itemId,
      itemNumber: line.itemNumber,
      itemDescription: line.itemDescription,
      quantity: line.quantity,
      unitOfMeasure: line.unitOfMeasure,
      unitPrice: line.unitPrice,
      discount: line.discount,
      discountPercent: line.discountPercent,
      lineTotal: line.lineTotal,
      warehouseId: line.warehouseId,
      notes: line.notes,
      customFields: line.customFields,
    });
  }

  // Calculate totals
  await calculateOrderTotals(splitOrder.orderId);

  return splitOrder.reload();
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Order Creation Functions
  generateOrderNumber,
  createWebOrder,
  createMobileOrder,
  createEDIOrder,
  createAPIOrder,
  createPhoneOrder,

  // Validation Functions
  validateOrder,
  validateCustomer,
  validateOrderLine,
  validateInventoryAvailability,
  validateOrderPricing,
  validateAddresses,

  // Credit Check Functions
  performCreditCheck,
  overrideCreditCheck,

  // Inventory Functions
  checkInventoryAvailability,
  reserveInventoryForOrder,

  // Pricing Functions
  calculateUnitPrice,
  calculateOrderTotals,
  calculateOrderTax,
  calculateShippingCost,
  applyOrderDiscount,

  // Template Functions
  createOrderTemplate,
  createOrderFromTemplate,
  getOrderTemplates,

  // Bulk Operations
  importBulkOrders,
  duplicateOrder,

  // Split/Merge Functions
  splitOrder,
  mergeOrders,

  // Workflow Functions
  updateOrderStatus,
  validateStatusTransition,
  getOrderWorkflowHistory,

  // Models
  OrderHeader,
  OrderLine,
  OrderTemplateModel,

  // Enums
  OrderSource,
  OrderStatus,
  OrderType,
  OrderPriority,
  PaymentTerms,
  ShippingMethod,
  TaxCalculationMethod,
  CreditCheckStatus,
  ValidationSeverity,
};
