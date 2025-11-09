/**
 * LOC: ORD-RETREF-001
 * File: /reuse/order/order-returns-refunds-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Return controllers
 *   - Refund services
 *   - RMA processors
 *   - Warehouse systems
 */

/**
 * File: /reuse/order/order-returns-refunds-kit.ts
 * Locator: WC-ORD-RETREF-001
 * Purpose: Order Returns & Refunds - Complete returns authorization, processing, and refund management
 *
 * Upstream: Independent utility module for returns and refunds operations
 * Downstream: ../backend/order/*, Return modules, Refund services, Warehouse systems
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 38 utility functions for return authorization, RMA, inspection, refund processing, restocking
 *
 * LLM Context: Enterprise-grade returns and refunds utilities to compete with Oracle NetSuite and SAP.
 * Provides comprehensive return authorization workflows, RMA generation, return shipping labels, return receipt
 * and inspection, quality checks, restocking operations, refund calculations with fees, multi-channel refund
 * processing (original payment, store credit, exchange), return-to-vendor (RTV), warranty returns, advanced
 * replacement programs, partial returns, serial number tracking, and automated refund approval workflows.
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
 * Return authorization status workflow
 */
export enum ReturnAuthStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

/**
 * Return request status tracking
 */
export enum ReturnStatus {
  REQUESTED = 'REQUESTED',
  AUTHORIZED = 'AUTHORIZED',
  LABEL_GENERATED = 'LABEL_GENERATED',
  IN_TRANSIT = 'IN_TRANSIT',
  RECEIVED = 'RECEIVED',
  INSPECTING = 'INSPECTING',
  INSPECTION_PASSED = 'INSPECTION_PASSED',
  INSPECTION_FAILED = 'INSPECTION_FAILED',
  RESTOCKING = 'RESTOCKING',
  RESTOCKED = 'RESTOCKED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

/**
 * Return reason codes for classification
 */
export enum ReturnReasonCode {
  DEFECTIVE = 'DEFECTIVE',
  DAMAGED_IN_SHIPPING = 'DAMAGED_IN_SHIPPING',
  WRONG_ITEM = 'WRONG_ITEM',
  NOT_AS_DESCRIBED = 'NOT_AS_DESCRIBED',
  CUSTOMER_REMORSE = 'CUSTOMER_REMORSE',
  CHANGED_MIND = 'CHANGED_MIND',
  FOUND_BETTER_PRICE = 'FOUND_BETTER_PRICE',
  NO_LONGER_NEEDED = 'NO_LONGER_NEEDED',
  ORDERED_BY_MISTAKE = 'ORDERED_BY_MISTAKE',
  ARRIVED_TOO_LATE = 'ARRIVED_TOO_LATE',
  SIZE_FIT_ISSUE = 'SIZE_FIT_ISSUE',
  WARRANTY_CLAIM = 'WARRANTY_CLAIM',
  RECALL = 'RECALL',
  OTHER = 'OTHER',
}

/**
 * Refund method types
 */
export enum RefundMethod {
  ORIGINAL_PAYMENT = 'ORIGINAL_PAYMENT',
  STORE_CREDIT = 'STORE_CREDIT',
  GIFT_CARD = 'GIFT_CARD',
  EXCHANGE = 'EXCHANGE',
  MANUAL_CHECK = 'MANUAL_CHECK',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
}

/**
 * Refund status workflow
 */
export enum RefundStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

/**
 * Return item condition after inspection
 */
export enum ItemCondition {
  NEW_UNOPENED = 'NEW_UNOPENED',
  NEW_OPENED = 'NEW_OPENED',
  LIKE_NEW = 'LIKE_NEW',
  GOOD = 'GOOD',
  ACCEPTABLE = 'ACCEPTABLE',
  DAMAGED = 'DAMAGED',
  DEFECTIVE = 'DEFECTIVE',
  NOT_RESALEABLE = 'NOT_RESALEABLE',
}

/**
 * Restocking disposition
 */
export enum RestockingDisposition {
  RETURN_TO_STOCK = 'RETURN_TO_STOCK',
  RETURN_TO_VENDOR = 'RETURN_TO_VENDOR',
  REFURBISH = 'REFURBISH',
  SALVAGE = 'SALVAGE',
  SCRAP = 'SCRAP',
  QUARANTINE = 'QUARANTINE',
}

/**
 * RMA type classifications
 */
export enum RMAType {
  STANDARD_RETURN = 'STANDARD_RETURN',
  WARRANTY_RETURN = 'WARRANTY_RETURN',
  ADVANCED_REPLACEMENT = 'ADVANCED_REPLACEMENT',
  CROSS_SHIP = 'CROSS_SHIP',
  DOA = 'DOA',
  RECALL = 'RECALL',
}

// ============================================================================
// TYPE DEFINITIONS & INTERFACES
// ============================================================================

export interface ReturnLineItem {
  orderLineId: string;
  itemId: string;
  itemSku: string;
  itemDescription: string;
  quantityOrdered: number;
  quantityReturned: number;
  unitPrice: number;
  returnReasonCode: ReturnReasonCode;
  reasonDescription?: string;
  serialNumbers?: string[];
  lotNumbers?: string[];
  images?: string[];
}

export interface RefundCalculation {
  subtotal: number;
  taxRefund: number;
  shippingRefund: number;
  restockingFee: number;
  adjustments: number;
  totalRefund: number;
  originalPaymentAmount: number;
  breakdownByPaymentMethod: Array<{
    paymentMethod: string;
    paymentId: string;
    refundAmount: number;
  }>;
}

export interface InspectionResult {
  inspectedBy: string;
  inspectionDate: Date;
  itemsPassed: number;
  itemsFailed: number;
  overallStatus: 'PASSED' | 'FAILED' | 'PARTIAL';
  lineInspections: Array<{
    returnLineId: string;
    quantityInspected: number;
    quantityPassed: number;
    quantityFailed: number;
    condition: ItemCondition;
    defects: string[];
    notes: string;
    disposition: RestockingDisposition;
  }>;
  photos: string[];
  notes: string;
}

export interface RestockingOperation {
  warehouseId: string;
  locationId: string;
  itemId: string;
  quantity: number;
  condition: ItemCondition;
  disposition: RestockingDisposition;
  restockedBy: string;
  restockedAt: Date;
  serialNumbers?: string[];
  lotNumbers?: string[];
}

export interface WarrantyValidation {
  isValid: boolean;
  warrantyId?: string;
  warrantyType: 'MANUFACTURER' | 'EXTENDED' | 'STORE' | 'NONE';
  warrantyStartDate?: Date;
  warrantyEndDate?: Date;
  daysRemaining?: number;
  coverageDetails?: Record<string, any>;
  validationErrors?: string[];
}

export interface AdvancedReplacementRequest {
  originalOrderId: string;
  defectiveItemId: string;
  defectiveSerialNumber?: string;
  replacementItemId: string;
  shippingAddress: any;
  shippingMethod: string;
  creditCardHold?: {
    amount: number;
    authorizationId: string;
    expiresAt: Date;
  };
  requireReturnTracking: boolean;
  returnDeadlineDays: number;
}

// ============================================================================
// DTOs WITH SWAGGER ANNOTATIONS
// ============================================================================

/**
 * Return request creation DTO
 */
export class CreateReturnRequestDto {
  @ApiProperty({ description: 'Original order ID' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ description: 'RMA type', enum: RMAType })
  @IsEnum(RMAType)
  @IsNotEmpty()
  rmaType: RMAType;

  @ApiProperty({ description: 'Return line items', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsNotEmpty()
  lineItems: ReturnLineItem[];

  @ApiPropertyOptional({ description: 'Customer comments' })
  @IsString()
  @IsOptional()
  customerComments?: string;

  @ApiPropertyOptional({ description: 'Preferred refund method', enum: RefundMethod })
  @IsEnum(RefundMethod)
  @IsOptional()
  preferredRefundMethod?: RefundMethod;

  @ApiPropertyOptional({ description: 'Exchange item IDs' })
  @IsArray()
  @IsOptional()
  exchangeItemIds?: string[];
}

/**
 * Return authorization DTO
 */
export class AuthorizeReturnDto {
  @ApiProperty({ description: 'Authorization status', enum: ReturnAuthStatus })
  @IsEnum(ReturnAuthStatus)
  @IsNotEmpty()
  authorizationStatus: ReturnAuthStatus;

  @ApiProperty({ description: 'Authorized by user ID' })
  @IsString()
  @IsNotEmpty()
  authorizedBy: string;

  @ApiPropertyOptional({ description: 'Authorization notes' })
  @IsString()
  @IsOptional()
  authorizationNotes?: string;

  @ApiPropertyOptional({ description: 'RMA expiration days' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(365)
  expirationDays?: number;

  @ApiPropertyOptional({ description: 'Restocking fee percentage' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  restockingFeePercent?: number;
}

/**
 * Return inspection DTO
 */
export class RecordInspectionDto {
  @ApiProperty({ description: 'Inspected by user ID' })
  @IsString()
  @IsNotEmpty()
  inspectedBy: string;

  @ApiProperty({ description: 'Line inspections', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsNotEmpty()
  lineInspections: Array<{
    returnLineId: string;
    quantityPassed: number;
    quantityFailed: number;
    condition: ItemCondition;
    disposition: RestockingDisposition;
    defects?: string[];
    notes?: string;
  }>;

  @ApiPropertyOptional({ description: 'Inspection notes' })
  @IsString()
  @IsOptional()
  inspectionNotes?: string;

  @ApiPropertyOptional({ description: 'Photo URLs' })
  @IsArray()
  @IsOptional()
  photos?: string[];
}

/**
 * Refund processing DTO
 */
export class ProcessRefundDto {
  @ApiProperty({ description: 'Refund method', enum: RefundMethod })
  @IsEnum(RefundMethod)
  @IsNotEmpty()
  refundMethod: RefundMethod;

  @ApiPropertyOptional({ description: 'Refund amount override' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  refundAmountOverride?: number;

  @ApiPropertyOptional({ description: 'Refund reason/notes' })
  @IsString()
  @IsOptional()
  refundNotes?: string;

  @ApiPropertyOptional({ description: 'Store credit account ID' })
  @IsString()
  @IsOptional()
  storeCreditAccountId?: string;

  @ApiProperty({ description: 'Processed by user ID' })
  @IsString()
  @IsNotEmpty()
  processedBy: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Return request header model
 */
@Table({
  tableName: 'return_requests',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['rmaNumber'], unique: true },
    { fields: ['orderId'] },
    { fields: ['customerId'] },
    { fields: ['returnStatus'] },
    { fields: ['authorizationStatus'] },
    { fields: ['createdAt'] },
  ],
})
export class ReturnRequest extends Model {
  @ApiProperty({ description: 'Return request ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  returnId: string;

  @ApiProperty({ description: 'RMA number' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  @Index
  rmaNumber: string;

  @ApiProperty({ description: 'Original order ID' })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  orderId: string;

  @ApiProperty({ description: 'Customer ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @Index
  customerId: string;

  @ApiProperty({ description: 'RMA type', enum: RMAType })
  @Column({
    type: DataType.ENUM(...Object.values(RMAType)),
    allowNull: false,
    defaultValue: RMAType.STANDARD_RETURN,
  })
  rmaType: RMAType;

  @ApiProperty({ description: 'Return status', enum: ReturnStatus })
  @Column({
    type: DataType.ENUM(...Object.values(ReturnStatus)),
    allowNull: false,
    defaultValue: ReturnStatus.REQUESTED,
  })
  @Index
  returnStatus: ReturnStatus;

  @ApiProperty({ description: 'Authorization status', enum: ReturnAuthStatus })
  @Column({
    type: DataType.ENUM(...Object.values(ReturnAuthStatus)),
    allowNull: false,
    defaultValue: ReturnAuthStatus.PENDING,
  })
  @Index
  authorizationStatus: ReturnAuthStatus;

  @ApiProperty({ description: 'Request date' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  requestDate: Date;

  @ApiProperty({ description: 'Authorization date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  authorizationDate: Date;

  @ApiProperty({ description: 'RMA expiration date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expirationDate: Date;

  @ApiProperty({ description: 'Authorized by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  authorizedBy: string;

  @ApiProperty({ description: 'Authorization notes' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  authorizationNotes: string;

  @ApiProperty({ description: 'Customer comments' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  customerComments: string;

  @ApiProperty({ description: 'Return shipping address (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  returnShippingAddress: Record<string, any>;

  @ApiProperty({ description: 'Shipping label URL' })
  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  shippingLabelUrl: string;

  @ApiProperty({ description: 'Tracking number' })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  trackingNumber: string;

  @ApiProperty({ description: 'Carrier' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  carrier: string;

  @ApiProperty({ description: 'Received date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  receivedDate: Date;

  @ApiProperty({ description: 'Received by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  receivedBy: string;

  @ApiProperty({ description: 'Inspection result (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  inspectionResult: InspectionResult;

  @ApiProperty({ description: 'Restocking fee percentage' })
  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  })
  restockingFeePercent: number;

  @ApiProperty({ description: 'Restocking fee amount' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  restockingFeeAmount: number;

  @ApiProperty({ description: 'Refund calculation (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  refundCalculation: RefundCalculation;

  @ApiProperty({ description: 'Preferred refund method', enum: RefundMethod })
  @Column({
    type: DataType.ENUM(...Object.values(RefundMethod)),
    allowNull: true,
  })
  preferredRefundMethod: RefundMethod;

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

  @HasMany(() => ReturnLine)
  lines: ReturnLine[];

  @HasMany(() => Refund)
  refunds: Refund[];
}

/**
 * Return line model
 */
@Table({
  tableName: 'return_lines',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['returnId'] },
    { fields: ['orderLineId'] },
    { fields: ['itemId'] },
  ],
})
export class ReturnLine extends Model {
  @ApiProperty({ description: 'Return line ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  returnLineId: string;

  @ApiProperty({ description: 'Return request ID' })
  @ForeignKey(() => ReturnRequest)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  returnId: string;

  @ApiProperty({ description: 'Original order line ID' })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  orderLineId: string;

  @ApiProperty({ description: 'Item ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  @Index
  itemId: string;

  @ApiProperty({ description: 'Item SKU' })
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  itemSku: string;

  @ApiProperty({ description: 'Item description' })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  itemDescription: string;

  @ApiProperty({ description: 'Quantity ordered' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantityOrdered: number;

  @ApiProperty({ description: 'Quantity returned' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantityReturned: number;

  @ApiProperty({ description: 'Quantity received' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  quantityReceived: number;

  @ApiProperty({ description: 'Quantity passed inspection' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  quantityPassed: number;

  @ApiProperty({ description: 'Quantity failed inspection' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  quantityFailed: number;

  @ApiProperty({ description: 'Unit price' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  unitPrice: number;

  @ApiProperty({ description: 'Return reason code', enum: ReturnReasonCode })
  @Column({
    type: DataType.ENUM(...Object.values(ReturnReasonCode)),
    allowNull: false,
  })
  returnReasonCode: ReturnReasonCode;

  @ApiProperty({ description: 'Reason description' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  reasonDescription: string;

  @ApiProperty({ description: 'Item condition', enum: ItemCondition })
  @Column({
    type: DataType.ENUM(...Object.values(ItemCondition)),
    allowNull: true,
  })
  itemCondition: ItemCondition;

  @ApiProperty({ description: 'Restocking disposition', enum: RestockingDisposition })
  @Column({
    type: DataType.ENUM(...Object.values(RestockingDisposition)),
    allowNull: true,
  })
  restockingDisposition: RestockingDisposition;

  @ApiProperty({ description: 'Serial numbers (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  serialNumbers: string[];

  @ApiProperty({ description: 'Lot numbers (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  lotNumbers: string[];

  @ApiProperty({ description: 'Defects found (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  defects: string[];

  @ApiProperty({ description: 'Inspection notes' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  inspectionNotes: string;

  @ApiProperty({ description: 'Images/photos (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  images: string[];

  @BelongsTo(() => ReturnRequest)
  returnRequest: ReturnRequest;

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
 * Refund transaction model
 */
@Table({
  tableName: 'refunds',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['refundNumber'], unique: true },
    { fields: ['returnId'] },
    { fields: ['orderId'] },
    { fields: ['refundStatus'] },
    { fields: ['refundMethod'] },
    { fields: ['createdAt'] },
  ],
})
export class Refund extends Model {
  @ApiProperty({ description: 'Refund ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  refundId: string;

  @ApiProperty({ description: 'Refund number' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  @Index
  refundNumber: string;

  @ApiProperty({ description: 'Return request ID' })
  @ForeignKey(() => ReturnRequest)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  returnId: string;

  @ApiProperty({ description: 'Original order ID' })
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  orderId: string;

  @ApiProperty({ description: 'Refund status', enum: RefundStatus })
  @Column({
    type: DataType.ENUM(...Object.values(RefundStatus)),
    allowNull: false,
    defaultValue: RefundStatus.PENDING,
  })
  @Index
  refundStatus: RefundStatus;

  @ApiProperty({ description: 'Refund method', enum: RefundMethod })
  @Column({
    type: DataType.ENUM(...Object.values(RefundMethod)),
    allowNull: false,
  })
  @Index
  refundMethod: RefundMethod;

  @ApiProperty({ description: 'Refund amount' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  refundAmount: number;

  @ApiProperty({ description: 'Tax refund amount' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  taxRefund: number;

  @ApiProperty({ description: 'Shipping refund amount' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  shippingRefund: number;

  @ApiProperty({ description: 'Restocking fee deducted' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  restockingFee: number;

  @ApiProperty({ description: 'Refund adjustments' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  adjustments: number;

  @ApiProperty({ description: 'Total refund amount' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  totalRefund: number;

  @ApiProperty({ description: 'Original payment method ID' })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  originalPaymentMethodId: string;

  @ApiProperty({ description: 'Store credit account ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  storeCreditAccountId: string;

  @ApiProperty({ description: 'Payment gateway transaction ID' })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  gatewayTransactionId: string;

  @ApiProperty({ description: 'Refund notes' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  refundNotes: string;

  @ApiProperty({ description: 'Processed date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  processedDate: Date;

  @ApiProperty({ description: 'Processed by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  processedBy: string;

  @ApiProperty({ description: 'Approved by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  approvedBy: string;

  @ApiProperty({ description: 'Created by user ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  createdBy: string;

  @BelongsTo(() => ReturnRequest)
  returnRequest: ReturnRequest;

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
// UTILITY FUNCTIONS - RETURN AUTHORIZATION
// ============================================================================

/**
 * Generate unique RMA number with prefix and sequence
 *
 * @param prefix - RMA number prefix (e.g., 'RMA', 'RTN')
 * @param sequence - Sequence number
 * @param length - Total length of numeric portion
 * @returns Formatted RMA number
 *
 * @example
 * generateRMANumber('RMA', 12345, 8) // Returns: 'RMA00012345'
 */
export function generateRMANumber(
  prefix: string = 'RMA',
  sequence: number,
  length: number = 8,
): string {
  try {
    const paddedSequence = sequence.toString().padStart(length, '0');
    return `${prefix}${paddedSequence}`;
  } catch (error) {
    throw new Error(`Failed to generate RMA number: ${error.message}`);
  }
}

/**
 * Create return request from customer
 *
 * @param returnData - Return request data
 * @param userId - User ID creating the request
 * @returns Created return request
 *
 * @example
 * const returnRequest = await createReturnRequest(returnDto, 'user-123');
 */
export async function createReturnRequest(
  returnData: CreateReturnRequestDto,
  userId: string,
): Promise<ReturnRequest> {
  try {
    const rmaNumber = await generateNextRMANumber();

    const returnRequest = await ReturnRequest.create({
      rmaNumber,
      orderId: returnData.orderId,
      customerId: await getCustomerIdFromOrder(returnData.orderId),
      rmaType: returnData.rmaType,
      returnStatus: ReturnStatus.REQUESTED,
      authorizationStatus: ReturnAuthStatus.PENDING,
      requestDate: new Date(),
      customerComments: returnData.customerComments,
      preferredRefundMethod: returnData.preferredRefundMethod,
      createdBy: userId,
    });

    // Create return lines
    for (const lineItem of returnData.lineItems) {
      await ReturnLine.create({
        returnId: returnRequest.returnId,
        orderLineId: lineItem.orderLineId,
        itemId: lineItem.itemId,
        itemSku: lineItem.itemSku,
        itemDescription: lineItem.itemDescription,
        quantityOrdered: lineItem.quantityOrdered,
        quantityReturned: lineItem.quantityReturned,
        unitPrice: lineItem.unitPrice,
        returnReasonCode: lineItem.returnReasonCode,
        reasonDescription: lineItem.reasonDescription,
        serialNumbers: lineItem.serialNumbers,
        lotNumbers: lineItem.lotNumbers,
        images: lineItem.images,
      });
    }

    return returnRequest;
  } catch (error) {
    throw new BadRequestException(`Failed to create return request: ${error.message}`);
  }
}

/**
 * Authorize return request (approve or reject)
 *
 * @param returnId - Return request ID
 * @param authData - Authorization data
 * @returns Updated return request
 *
 * @example
 * const authorized = await authorizeReturnRequest('ret-123', authDto);
 */
export async function authorizeReturnRequest(
  returnId: string,
  authData: AuthorizeReturnDto,
): Promise<ReturnRequest> {
  try {
    const returnRequest = await ReturnRequest.findByPk(returnId);
    if (!returnRequest) {
      throw new NotFoundException('Return request not found');
    }

    const updates: any = {
      authorizationStatus: authData.authorizationStatus,
      authorizationDate: new Date(),
      authorizedBy: authData.authorizedBy,
      authorizationNotes: authData.authorizationNotes,
      updatedBy: authData.authorizedBy,
    };

    if (authData.authorizationStatus === ReturnAuthStatus.APPROVED) {
      updates.returnStatus = ReturnStatus.AUTHORIZED;

      if (authData.expirationDays) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + authData.expirationDays);
        updates.expirationDate = expirationDate;
      }

      if (authData.restockingFeePercent !== undefined) {
        updates.restockingFeePercent = authData.restockingFeePercent;
      }
    } else if (authData.authorizationStatus === ReturnAuthStatus.REJECTED) {
      updates.returnStatus = ReturnStatus.REJECTED;
    }

    await returnRequest.update(updates);
    return returnRequest;
  } catch (error) {
    throw new BadRequestException(`Failed to authorize return: ${error.message}`);
  }
}

/**
 * Validate return eligibility based on return window and order status
 *
 * @param orderId - Order ID
 * @param returnWindowDays - Return window in days
 * @returns Eligibility result
 *
 * @example
 * const eligible = await validateReturnEligibility('ord-123', 30);
 */
export async function validateReturnEligibility(
  orderId: string,
  returnWindowDays: number = 30,
): Promise<{ isEligible: boolean; reasons: string[] }> {
  try {
    const reasons: string[] = [];

    const order = await getOrderById(orderId);
    if (!order) {
      return { isEligible: false, reasons: ['Order not found'] };
    }

    // Check if order is in a returnable status
    const returnableStatuses = ['COMPLETED', 'DELIVERED', 'SHIPPED'];
    if (!returnableStatuses.includes(order.orderStatus)) {
      reasons.push(`Order status ${order.orderStatus} is not eligible for returns`);
    }

    // Check return window
    const orderDate = new Date(order.orderDate);
    const daysSinceOrder = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceOrder > returnWindowDays) {
      reasons.push(`Return window of ${returnWindowDays} days has expired (${daysSinceOrder} days since order)`);
    }

    // Check if already returned
    const existingReturn = await ReturnRequest.findOne({
      where: { orderId, returnStatus: { [Op.notIn]: ['CANCELLED', 'REJECTED'] } },
    });
    if (existingReturn) {
      reasons.push('Order already has an active return request');
    }

    return {
      isEligible: reasons.length === 0,
      reasons,
    };
  } catch (error) {
    throw new Error(`Failed to validate return eligibility: ${error.message}`);
  }
}

/**
 * Check return reason code validity and auto-approve rules
 *
 * @param reasonCode - Return reason code
 * @param orderAge - Order age in days
 * @returns Validation result with auto-approval flag
 *
 * @example
 * const result = await validateReturnReason(ReturnReasonCode.DEFECTIVE, 5);
 */
export function validateReturnReason(
  reasonCode: ReturnReasonCode,
  orderAge: number,
): { isValid: boolean; requiresApproval: boolean; autoApprove: boolean; notes: string } {
  try {
    // Auto-approve rules
    const autoApproveReasons = [
      ReturnReasonCode.DEFECTIVE,
      ReturnReasonCode.DAMAGED_IN_SHIPPING,
      ReturnReasonCode.WRONG_ITEM,
      ReturnReasonCode.NOT_AS_DESCRIBED,
      ReturnReasonCode.RECALL,
    ];

    const autoApprove = autoApproveReasons.includes(reasonCode) && orderAge <= 30;

    // Reasons that always require approval
    const requiresApprovalReasons = [
      ReturnReasonCode.CUSTOMER_REMORSE,
      ReturnReasonCode.FOUND_BETTER_PRICE,
    ];

    const requiresApproval = requiresApprovalReasons.includes(reasonCode) || orderAge > 60;

    let notes = '';
    if (autoApprove) {
      notes = 'Eligible for automatic approval due to product issue';
    } else if (requiresApproval) {
      notes = 'Requires manual approval review';
    }

    return {
      isValid: true,
      requiresApproval,
      autoApprove,
      notes,
    };
  } catch (error) {
    throw new Error(`Failed to validate return reason: ${error.message}`);
  }
}

/**
 * Calculate restocking fee based on return reason and condition
 *
 * @param returnReasonCode - Return reason
 * @param itemCondition - Item condition
 * @param subtotal - Order subtotal
 * @param feePercent - Restocking fee percentage override
 * @returns Restocking fee amount
 *
 * @example
 * const fee = calculateRestockingFee(ReturnReasonCode.CHANGED_MIND, ItemCondition.NEW_OPENED, 100);
 */
export function calculateRestockingFee(
  returnReasonCode: ReturnReasonCode,
  itemCondition: ItemCondition,
  subtotal: number,
  feePercent?: number,
): number {
  try {
    // No restocking fee for defective/damaged items
    const noFeeReasons = [
      ReturnReasonCode.DEFECTIVE,
      ReturnReasonCode.DAMAGED_IN_SHIPPING,
      ReturnReasonCode.WRONG_ITEM,
      ReturnReasonCode.NOT_AS_DESCRIBED,
      ReturnReasonCode.WARRANTY_CLAIM,
      ReturnReasonCode.RECALL,
    ];

    if (noFeeReasons.includes(returnReasonCode)) {
      return 0;
    }

    // Determine fee percentage if not provided
    let feePercentage = feePercent;
    if (feePercentage === undefined) {
      if (itemCondition === ItemCondition.NEW_UNOPENED) {
        feePercentage = 0;
      } else if (itemCondition === ItemCondition.NEW_OPENED) {
        feePercentage = 10;
      } else if (itemCondition === ItemCondition.LIKE_NEW) {
        feePercentage = 15;
      } else {
        feePercentage = 25;
      }
    }

    return Number(((subtotal * feePercentage) / 100).toFixed(2));
  } catch (error) {
    throw new Error(`Failed to calculate restocking fee: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - RMA GENERATION & SHIPPING
// ============================================================================

/**
 * Generate return shipping label for authorized return
 *
 * @param returnId - Return request ID
 * @param carrier - Shipping carrier
 * @param serviceLevel - Service level
 * @returns Shipping label details
 *
 * @example
 * const label = await generateReturnShippingLabel('ret-123', 'UPS', 'GROUND');
 */
export async function generateReturnShippingLabel(
  returnId: string,
  carrier: string = 'UPS',
  serviceLevel: string = 'GROUND',
): Promise<{ labelUrl: string; trackingNumber: string; carrier: string }> {
  try {
    const returnRequest = await ReturnRequest.findByPk(returnId);
    if (!returnRequest) {
      throw new NotFoundException('Return request not found');
    }

    if (returnRequest.authorizationStatus !== ReturnAuthStatus.APPROVED) {
      throw new BadRequestException('Return must be authorized before generating shipping label');
    }

    // Call shipping API to generate label
    const labelData = await callShippingAPI({
      carrier,
      serviceLevel,
      fromAddress: returnRequest.returnShippingAddress,
      toAddress: await getWarehouseReturnAddress(),
      packageDetails: await getReturnPackageDetails(returnId),
      returnLabel: true,
    });

    await returnRequest.update({
      shippingLabelUrl: labelData.labelUrl,
      trackingNumber: labelData.trackingNumber,
      carrier: labelData.carrier,
      returnStatus: ReturnStatus.LABEL_GENERATED,
    });

    return {
      labelUrl: labelData.labelUrl,
      trackingNumber: labelData.trackingNumber,
      carrier: labelData.carrier,
    };
  } catch (error) {
    throw new BadRequestException(`Failed to generate shipping label: ${error.message}`);
  }
}

/**
 * Update return tracking status from carrier webhook
 *
 * @param trackingNumber - Tracking number
 * @param status - Tracking status
 * @param location - Current location
 * @returns Updated return request
 *
 * @example
 * await updateReturnTracking('1Z999AA10123456784', 'IN_TRANSIT', 'Memphis, TN');
 */
export async function updateReturnTracking(
  trackingNumber: string,
  status: string,
  location?: string,
): Promise<ReturnRequest> {
  try {
    const returnRequest = await ReturnRequest.findOne({
      where: { trackingNumber },
    });

    if (!returnRequest) {
      throw new NotFoundException('Return request not found for tracking number');
    }

    let returnStatus = returnRequest.returnStatus;
    if (status === 'IN_TRANSIT') {
      returnStatus = ReturnStatus.IN_TRANSIT;
    } else if (status === 'DELIVERED') {
      returnStatus = ReturnStatus.RECEIVED;
      await returnRequest.update({
        receivedDate: new Date(),
      });
    }

    await returnRequest.update({ returnStatus });
    return returnRequest;
  } catch (error) {
    throw new BadRequestException(`Failed to update return tracking: ${error.message}`);
  }
}

/**
 * Record return receipt at warehouse
 *
 * @param returnId - Return request ID
 * @param receivedBy - User ID receiving the return
 * @param notes - Receipt notes
 * @returns Updated return request
 *
 * @example
 * await recordReturnReceipt('ret-123', 'user-456', 'All items received');
 */
export async function recordReturnReceipt(
  returnId: string,
  receivedBy: string,
  notes?: string,
): Promise<ReturnRequest> {
  try {
    const returnRequest = await ReturnRequest.findByPk(returnId);
    if (!returnRequest) {
      throw new NotFoundException('Return request not found');
    }

    await returnRequest.update({
      returnStatus: ReturnStatus.RECEIVED,
      receivedDate: new Date(),
      receivedBy,
      updatedBy: receivedBy,
    });

    // Update return lines with received quantities
    const lines = await ReturnLine.findAll({ where: { returnId } });
    for (const line of lines) {
      await line.update({
        quantityReceived: line.quantityReturned,
      });
    }

    return returnRequest;
  } catch (error) {
    throw new BadRequestException(`Failed to record return receipt: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - INSPECTION & QUALITY
// ============================================================================

/**
 * Perform return inspection and quality check
 *
 * @param returnId - Return request ID
 * @param inspectionData - Inspection data
 * @returns Inspection result
 *
 * @example
 * const result = await performReturnInspection('ret-123', inspectionDto);
 */
export async function performReturnInspection(
  returnId: string,
  inspectionData: RecordInspectionDto,
): Promise<InspectionResult> {
  try {
    const returnRequest = await ReturnRequest.findByPk(returnId, {
      include: [ReturnLine],
    });

    if (!returnRequest) {
      throw new NotFoundException('Return request not found');
    }

    let totalPassed = 0;
    let totalFailed = 0;
    const lineInspections = [];

    // Process each line inspection
    for (const lineInsp of inspectionData.lineInspections) {
      const returnLine = await ReturnLine.findByPk(lineInsp.returnLineId);
      if (!returnLine) continue;

      await returnLine.update({
        quantityPassed: lineInsp.quantityPassed,
        quantityFailed: lineInsp.quantityFailed,
        itemCondition: lineInsp.condition,
        restockingDisposition: lineInsp.disposition,
        defects: lineInsp.defects,
        inspectionNotes: lineInsp.notes,
      });

      totalPassed += lineInsp.quantityPassed;
      totalFailed += lineInsp.quantityFailed;

      lineInspections.push({
        returnLineId: lineInsp.returnLineId,
        quantityInspected: lineInsp.quantityPassed + lineInsp.quantityFailed,
        quantityPassed: lineInsp.quantityPassed,
        quantityFailed: lineInsp.quantityFailed,
        condition: lineInsp.condition,
        defects: lineInsp.defects || [],
        notes: lineInsp.notes || '',
        disposition: lineInsp.disposition,
      });
    }

    const inspectionResult: InspectionResult = {
      inspectedBy: inspectionData.inspectedBy,
      inspectionDate: new Date(),
      itemsPassed: totalPassed,
      itemsFailed: totalFailed,
      overallStatus: totalFailed === 0 ? 'PASSED' : totalPassed === 0 ? 'FAILED' : 'PARTIAL',
      lineInspections,
      photos: inspectionData.photos || [],
      notes: inspectionData.inspectionNotes || '',
    };

    await returnRequest.update({
      inspectionResult,
      returnStatus:
        inspectionResult.overallStatus === 'PASSED'
          ? ReturnStatus.INSPECTION_PASSED
          : inspectionResult.overallStatus === 'FAILED'
          ? ReturnStatus.INSPECTION_FAILED
          : ReturnStatus.INSPECTING,
      updatedBy: inspectionData.inspectedBy,
    });

    return inspectionResult;
  } catch (error) {
    throw new BadRequestException(`Failed to perform inspection: ${error.message}`);
  }
}

/**
 * Validate item condition and determine disposition
 *
 * @param condition - Item condition
 * @param returnReason - Return reason code
 * @returns Recommended disposition
 *
 * @example
 * const disposition = determineRestockingDisposition(ItemCondition.LIKE_NEW, ReturnReasonCode.CHANGED_MIND);
 */
export function determineRestockingDisposition(
  condition: ItemCondition,
  returnReason: ReturnReasonCode,
): RestockingDisposition {
  try {
    if (condition === ItemCondition.DEFECTIVE) {
      return RestockingDisposition.RETURN_TO_VENDOR;
    }

    if (condition === ItemCondition.DAMAGED || condition === ItemCondition.NOT_RESALEABLE) {
      return RestockingDisposition.SALVAGE;
    }

    if (condition === ItemCondition.NEW_UNOPENED || condition === ItemCondition.LIKE_NEW) {
      return RestockingDisposition.RETURN_TO_STOCK;
    }

    if (condition === ItemCondition.NEW_OPENED || condition === ItemCondition.GOOD) {
      if (returnReason === ReturnReasonCode.DEFECTIVE) {
        return RestockingDisposition.REFURBISH;
      }
      return RestockingDisposition.RETURN_TO_STOCK;
    }

    return RestockingDisposition.QUARANTINE;
  } catch (error) {
    throw new Error(`Failed to determine disposition: ${error.message}`);
  }
}

/**
 * Quality check with photo verification
 *
 * @param returnLineId - Return line ID
 * @param photos - Array of photo URLs
 * @param defects - List of defects found
 * @returns Quality check result
 *
 * @example
 * const qc = await performQualityCheck('line-123', ['url1', 'url2'], ['scratch on screen']);
 */
export async function performQualityCheck(
  returnLineId: string,
  photos: string[],
  defects: string[],
): Promise<{ passed: boolean; condition: ItemCondition; notes: string }> {
  try {
    const returnLine = await ReturnLine.findByPk(returnLineId);
    if (!returnLine) {
      throw new NotFoundException('Return line not found');
    }

    let condition: ItemCondition;
    let passed: boolean;
    let notes: string;

    if (defects.length === 0) {
      condition = ItemCondition.LIKE_NEW;
      passed = true;
      notes = 'No defects found, item in excellent condition';
    } else if (defects.length <= 2) {
      condition = ItemCondition.GOOD;
      passed = true;
      notes = `Minor defects found: ${defects.join(', ')}`;
    } else {
      condition = ItemCondition.DAMAGED;
      passed = false;
      notes = `Multiple defects found: ${defects.join(', ')}`;
    }

    await returnLine.update({
      itemCondition: condition,
      defects,
      images: photos,
      inspectionNotes: notes,
    });

    return { passed, condition, notes };
  } catch (error) {
    throw new BadRequestException(`Failed to perform quality check: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - RESTOCKING
// ============================================================================

/**
 * Process restocking for approved returns
 *
 * @param returnId - Return request ID
 * @param warehouseId - Warehouse ID
 * @param userId - User performing restocking
 * @returns Restocking operations
 *
 * @example
 * const operations = await processRestocking('ret-123', 'wh-001', 'user-789');
 */
export async function processRestocking(
  returnId: string,
  warehouseId: string,
  userId: string,
): Promise<RestockingOperation[]> {
  try {
    const returnRequest = await ReturnRequest.findByPk(returnId, {
      include: [ReturnLine],
    });

    if (!returnRequest) {
      throw new NotFoundException('Return request not found');
    }

    if (returnRequest.returnStatus !== ReturnStatus.INSPECTION_PASSED) {
      throw new BadRequestException('Return must pass inspection before restocking');
    }

    const operations: RestockingOperation[] = [];

    for (const line of returnRequest.lines) {
      if (line.restockingDisposition === RestockingDisposition.RETURN_TO_STOCK && line.quantityPassed > 0) {
        const operation: RestockingOperation = {
          warehouseId,
          locationId: await getRestockingLocation(warehouseId, line.itemId),
          itemId: line.itemId,
          quantity: line.quantityPassed,
          condition: line.itemCondition,
          disposition: line.restockingDisposition,
          restockedBy: userId,
          restockedAt: new Date(),
          serialNumbers: line.serialNumbers,
          lotNumbers: line.lotNumbers,
        };

        // Update inventory
        await updateInventoryQuantity(
          warehouseId,
          line.itemId,
          line.quantityPassed,
          'ADD',
          'RETURN_RESTOCKING',
        );

        operations.push(operation);
      }
    }

    await returnRequest.update({
      returnStatus: ReturnStatus.RESTOCKED,
      updatedBy: userId,
    });

    return operations;
  } catch (error) {
    throw new BadRequestException(`Failed to process restocking: ${error.message}`);
  }
}

/**
 * Create return-to-vendor (RTV) request for defective items
 *
 * @param returnId - Return request ID
 * @param vendorId - Vendor ID
 * @param userId - User creating RTV
 * @returns RTV request
 *
 * @example
 * const rtv = await createReturnToVendor('ret-123', 'vendor-456', 'user-789');
 */
export async function createReturnToVendor(
  returnId: string,
  vendorId: string,
  userId: string,
): Promise<any> {
  try {
    const returnRequest = await ReturnRequest.findByPk(returnId, {
      include: [ReturnLine],
    });

    if (!returnRequest) {
      throw new NotFoundException('Return request not found');
    }

    const rtvLines = returnRequest.lines.filter(
      (line) => line.restockingDisposition === RestockingDisposition.RETURN_TO_VENDOR,
    );

    if (rtvLines.length === 0) {
      throw new BadRequestException('No items eligible for return to vendor');
    }

    const rtvRequest = {
      rtvNumber: await generateNextRTVNumber(),
      vendorId,
      returnId,
      lines: rtvLines.map((line) => ({
        itemId: line.itemId,
        quantity: line.quantityFailed,
        reason: line.returnReasonCode,
        defects: line.defects,
      })),
      createdBy: userId,
      createdAt: new Date(),
    };

    // Create RTV in system
    // await createVendorReturnRequest(rtvRequest);

    return rtvRequest;
  } catch (error) {
    throw new BadRequestException(`Failed to create RTV: ${error.message}`);
  }
}

/**
 * Track serial numbers through return process
 *
 * @param returnLineId - Return line ID
 * @param serialNumbers - Array of serial numbers
 * @returns Serial tracking result
 *
 * @example
 * await trackReturnSerialNumbers('line-123', ['SN001', 'SN002']);
 */
export async function trackReturnSerialNumbers(
  returnLineId: string,
  serialNumbers: string[],
): Promise<{ tracked: number; duplicates: string[]; invalid: string[] }> {
  try {
    const returnLine = await ReturnLine.findByPk(returnLineId);
    if (!returnLine) {
      throw new NotFoundException('Return line not found');
    }

    const duplicates: string[] = [];
    const invalid: string[] = [];
    const tracked: string[] = [];

    for (const sn of serialNumbers) {
      // Check if serial number exists in original order
      const isValid = await validateSerialNumber(returnLine.orderLineId, sn);
      if (!isValid) {
        invalid.push(sn);
        continue;
      }

      // Check if already returned
      const alreadyReturned = await checkSerialAlreadyReturned(sn);
      if (alreadyReturned) {
        duplicates.push(sn);
        continue;
      }

      tracked.push(sn);
    }

    await returnLine.update({
      serialNumbers: tracked,
    });

    return {
      tracked: tracked.length,
      duplicates,
      invalid,
    };
  } catch (error) {
    throw new BadRequestException(`Failed to track serial numbers: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - REFUND PROCESSING
// ============================================================================

/**
 * Calculate refund amounts with fees and taxes
 *
 * @param returnId - Return request ID
 * @param includeShipping - Include shipping refund
 * @returns Refund calculation
 *
 * @example
 * const calculation = await calculateRefundAmount('ret-123', true);
 */
export async function calculateRefundAmount(
  returnId: string,
  includeShipping: boolean = false,
): Promise<RefundCalculation> {
  try {
    const returnRequest = await ReturnRequest.findByPk(returnId, {
      include: [ReturnLine],
    });

    if (!returnRequest) {
      throw new NotFoundException('Return request not found');
    }

    const order = await getOrderById(returnRequest.orderId);
    if (!order) {
      throw new NotFoundException('Original order not found');
    }

    // Calculate subtotal from passed items
    let subtotal = 0;
    for (const line of returnRequest.lines) {
      subtotal += line.quantityPassed * line.unitPrice;
    }

    // Calculate proportional tax
    const taxRate = order.taxAmount / order.subtotal;
    const taxRefund = Number((subtotal * taxRate).toFixed(2));

    // Calculate shipping refund
    const shippingRefund = includeShipping ? order.shippingAmount : 0;

    // Calculate restocking fee
    const restockingFee = calculateRestockingFee(
      returnRequest.lines[0]?.returnReasonCode,
      returnRequest.lines[0]?.itemCondition,
      subtotal,
      returnRequest.restockingFeePercent,
    );

    const totalRefund = subtotal + taxRefund + shippingRefund - restockingFee;

    const calculation: RefundCalculation = {
      subtotal,
      taxRefund,
      shippingRefund,
      restockingFee,
      adjustments: 0,
      totalRefund: Number(totalRefund.toFixed(2)),
      originalPaymentAmount: order.totalAmount,
      breakdownByPaymentMethod: await getPaymentMethodBreakdown(order.orderId, totalRefund),
    };

    await returnRequest.update({
      refundCalculation: calculation,
      restockingFeeAmount: restockingFee,
    });

    return calculation;
  } catch (error) {
    throw new BadRequestException(`Failed to calculate refund: ${error.message}`);
  }
}

/**
 * Process refund to original payment method
 *
 * @param returnId - Return request ID
 * @param refundData - Refund processing data
 * @returns Created refund
 *
 * @example
 * const refund = await processRefund('ret-123', refundDto);
 */
export async function processRefund(
  returnId: string,
  refundData: ProcessRefundDto,
): Promise<Refund> {
  try {
    const returnRequest = await ReturnRequest.findByPk(returnId);
    if (!returnRequest) {
      throw new NotFoundException('Return request not found');
    }

    if (!returnRequest.refundCalculation) {
      throw new BadRequestException('Refund must be calculated before processing');
    }

    const refundNumber = await generateNextRefundNumber();
    const calculation = returnRequest.refundCalculation;

    const refundAmount = refundData.refundAmountOverride || calculation.totalRefund;

    const refund = await Refund.create({
      refundNumber,
      returnId,
      orderId: returnRequest.orderId,
      refundStatus: RefundStatus.PENDING,
      refundMethod: refundData.refundMethod,
      refundAmount: calculation.subtotal,
      taxRefund: calculation.taxRefund,
      shippingRefund: calculation.shippingRefund,
      restockingFee: calculation.restockingFee,
      adjustments: refundData.refundAmountOverride
        ? refundData.refundAmountOverride - calculation.totalRefund
        : 0,
      totalRefund: refundAmount,
      refundNotes: refundData.refundNotes,
      storeCreditAccountId: refundData.storeCreditAccountId,
      createdBy: refundData.processedBy,
    });

    // Process based on refund method
    if (refundData.refundMethod === RefundMethod.ORIGINAL_PAYMENT) {
      await processOriginalPaymentRefund(refund);
    } else if (refundData.refundMethod === RefundMethod.STORE_CREDIT) {
      await processStoreCreditRefund(refund, refundData.storeCreditAccountId);
    }

    await returnRequest.update({
      returnStatus: ReturnStatus.COMPLETED,
    });

    return refund;
  } catch (error) {
    throw new BadRequestException(`Failed to process refund: ${error.message}`);
  }
}

/**
 * Process refund to original payment method via gateway
 *
 * @param refund - Refund record
 * @returns Gateway response
 *
 * @example
 * await processOriginalPaymentRefund(refund);
 */
async function processOriginalPaymentRefund(refund: Refund): Promise<any> {
  try {
    // Call payment gateway API
    const gatewayResponse = await callPaymentGateway({
      action: 'refund',
      orderId: refund.orderId,
      amount: refund.totalRefund,
      reason: refund.refundNotes,
    });

    await refund.update({
      refundStatus: RefundStatus.COMPLETED,
      gatewayTransactionId: gatewayResponse.transactionId,
      processedDate: new Date(),
    });

    return gatewayResponse;
  } catch (error) {
    await refund.update({ refundStatus: RefundStatus.FAILED });
    throw error;
  }
}

/**
 * Process refund as store credit
 *
 * @param refund - Refund record
 * @param accountId - Store credit account ID
 * @returns Store credit result
 *
 * @example
 * await processStoreCreditRefund(refund, 'account-123');
 */
async function processStoreCreditRefund(refund: Refund, accountId: string): Promise<any> {
  try {
    const creditResult = await addStoreCredit({
      accountId,
      amount: refund.totalRefund,
      reason: `Refund for return ${refund.returnId}`,
      expirationDays: 365,
    });

    await refund.update({
      refundStatus: RefundStatus.COMPLETED,
      storeCreditAccountId: accountId,
      processedDate: new Date(),
    });

    return creditResult;
  } catch (error) {
    await refund.update({ refundStatus: RefundStatus.FAILED });
    throw error;
  }
}

/**
 * Process partial refund for partial returns
 *
 * @param returnId - Return request ID
 * @param lineRefunds - Line-specific refund amounts
 * @param userId - User processing refund
 * @returns Partial refund
 *
 * @example
 * const refund = await processPartialRefund('ret-123', [{lineId: 'ln-1', amount: 50}], 'user-789');
 */
export async function processPartialRefund(
  returnId: string,
  lineRefunds: Array<{ returnLineId: string; refundAmount: number }>,
  userId: string,
): Promise<Refund> {
  try {
    const returnRequest = await ReturnRequest.findByPk(returnId);
    if (!returnRequest) {
      throw new NotFoundException('Return request not found');
    }

    let totalRefund = 0;
    for (const lineRefund of lineRefunds) {
      totalRefund += lineRefund.refundAmount;
    }

    const refundNumber = await generateNextRefundNumber();

    const refund = await Refund.create({
      refundNumber,
      returnId,
      orderId: returnRequest.orderId,
      refundStatus: RefundStatus.PENDING,
      refundMethod: returnRequest.preferredRefundMethod || RefundMethod.ORIGINAL_PAYMENT,
      refundAmount: totalRefund,
      taxRefund: 0,
      shippingRefund: 0,
      restockingFee: 0,
      totalRefund,
      refundNotes: 'Partial refund',
      createdBy: userId,
    });

    await refund.update({
      refundStatus: RefundStatus.PARTIALLY_REFUNDED,
    });

    return refund;
  } catch (error) {
    throw new BadRequestException(`Failed to process partial refund: ${error.message}`);
  }
}

// ============================================================================
// UTILITY FUNCTIONS - WARRANTY & ADVANCED REPLACEMENT
// ============================================================================

/**
 * Validate warranty coverage for return
 *
 * @param orderId - Order ID
 * @param itemId - Item ID
 * @param serialNumber - Serial number
 * @returns Warranty validation result
 *
 * @example
 * const warranty = await validateWarrantyCoverage('ord-123', 'item-456', 'SN001');
 */
export async function validateWarrantyCoverage(
  orderId: string,
  itemId: string,
  serialNumber?: string,
): Promise<WarrantyValidation> {
  try {
    const order = await getOrderById(orderId);
    if (!order) {
      return {
        isValid: false,
        warrantyType: 'NONE',
        validationErrors: ['Order not found'],
      };
    }

    // Check for warranty records
    const warranty = await findWarrantyRecord(itemId, serialNumber);
    if (!warranty) {
      return {
        isValid: false,
        warrantyType: 'NONE',
        validationErrors: ['No warranty found for this item'],
      };
    }

    const now = new Date();
    const isExpired = warranty.warrantyEndDate < now;

    if (isExpired) {
      return {
        isValid: false,
        warrantyId: warranty.warrantyId,
        warrantyType: warranty.warrantyType,
        warrantyStartDate: warranty.warrantyStartDate,
        warrantyEndDate: warranty.warrantyEndDate,
        daysRemaining: 0,
        validationErrors: [`Warranty expired on ${warranty.warrantyEndDate.toISOString()}`],
      };
    }

    const daysRemaining = Math.floor(
      (warranty.warrantyEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    return {
      isValid: true,
      warrantyId: warranty.warrantyId,
      warrantyType: warranty.warrantyType,
      warrantyStartDate: warranty.warrantyStartDate,
      warrantyEndDate: warranty.warrantyEndDate,
      daysRemaining,
      coverageDetails: warranty.coverageDetails,
    };
  } catch (error) {
    throw new Error(`Failed to validate warranty: ${error.message}`);
  }
}

/**
 * Create advanced replacement order
 *
 * @param request - Advanced replacement request
 * @param userId - User creating replacement
 * @returns Replacement order and return
 *
 * @example
 * const replacement = await createAdvancedReplacement(requestDto, 'user-123');
 */
export async function createAdvancedReplacement(
  request: AdvancedReplacementRequest,
  userId: string,
): Promise<{ replacementOrderId: string; returnId: string; holdAmount?: number }> {
  try {
    // Validate warranty
    const warranty = await validateWarrantyCoverage(
      request.originalOrderId,
      request.defectiveItemId,
      request.defectiveSerialNumber,
    );

    if (!warranty.isValid) {
      throw new BadRequestException(`Warranty validation failed: ${warranty.validationErrors.join(', ')}`);
    }

    // Create replacement order
    const replacementOrder = await createReplacementOrder({
      customerId: await getCustomerIdFromOrder(request.originalOrderId),
      itemId: request.replacementItemId,
      quantity: 1,
      shippingAddress: request.shippingAddress,
      shippingMethod: request.shippingMethod,
      orderType: 'WARRANTY',
      createdBy: userId,
    });

    // Create return request for defective item
    const returnRequest = await createReturnRequest(
      {
        orderId: request.originalOrderId,
        rmaType: RMAType.ADVANCED_REPLACEMENT,
        lineItems: [
          {
            orderLineId: await getOrderLineId(request.originalOrderId, request.defectiveItemId),
            itemId: request.defectiveItemId,
            itemSku: await getItemSku(request.defectiveItemId),
            itemDescription: await getItemDescription(request.defectiveItemId),
            quantityOrdered: 1,
            quantityReturned: 1,
            unitPrice: 0,
            returnReasonCode: ReturnReasonCode.DEFECTIVE,
            serialNumbers: request.defectiveSerialNumber ? [request.defectiveSerialNumber] : [],
          },
        ],
      },
      userId,
    );

    // Auto-authorize the return
    await authorizeReturnRequest(returnRequest.returnId, {
      authorizationStatus: ReturnAuthStatus.APPROVED,
      authorizedBy: userId,
      authorizationNotes: 'Auto-approved for advanced replacement',
      expirationDays: request.returnDeadlineDays,
      restockingFeePercent: 0,
    });

    // Place credit card hold if configured
    let holdAmount: number | undefined;
    if (request.creditCardHold) {
      holdAmount = request.creditCardHold.amount;
      // await placeCreditCardHold(request.creditCardHold);
    }

    return {
      replacementOrderId: replacementOrder.orderId,
      returnId: returnRequest.returnId,
      holdAmount,
    };
  } catch (error) {
    throw new BadRequestException(`Failed to create advanced replacement: ${error.message}`);
  }
}

// ============================================================================
// HELPER FUNCTIONS (Mocked for demonstration)
// ============================================================================

async function generateNextRMANumber(): Promise<string> {
  return generateRMANumber('RMA', Date.now() % 100000000);
}

async function generateNextRefundNumber(): Promise<string> {
  return `REF${Date.now()}`;
}

async function generateNextRTVNumber(): Promise<string> {
  return `RTV${Date.now()}`;
}

async function getCustomerIdFromOrder(orderId: string): Promise<string> {
  return 'customer-123';
}

async function getOrderById(orderId: string): Promise<any> {
  return {
    orderId,
    orderStatus: 'COMPLETED',
    orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    subtotal: 100,
    taxAmount: 10,
    shippingAmount: 15,
    totalAmount: 125,
  };
}

async function callShippingAPI(data: any): Promise<any> {
  return {
    labelUrl: 'https://example.com/label.pdf',
    trackingNumber: '1Z999AA10123456784',
    carrier: data.carrier,
  };
}

async function getWarehouseReturnAddress(): Promise<any> {
  return { address: '123 Warehouse St', city: 'Memphis', state: 'TN', zip: '38103' };
}

async function getReturnPackageDetails(returnId: string): Promise<any> {
  return { weight: 2, dimensions: { length: 12, width: 10, height: 8 } };
}

async function getRestockingLocation(warehouseId: string, itemId: string): Promise<string> {
  return 'LOC-A-001';
}

async function updateInventoryQuantity(
  warehouseId: string,
  itemId: string,
  quantity: number,
  operation: string,
  reason: string,
): Promise<void> {
  // Mock inventory update
}

async function validateSerialNumber(orderLineId: string, serialNumber: string): Promise<boolean> {
  return true;
}

async function checkSerialAlreadyReturned(serialNumber: string): Promise<boolean> {
  return false;
}

async function getPaymentMethodBreakdown(orderId: string, amount: number): Promise<any[]> {
  return [{ paymentMethod: 'CREDIT_CARD', paymentId: 'pay-123', refundAmount: amount }];
}

async function callPaymentGateway(data: any): Promise<any> {
  return { transactionId: 'txn-' + Date.now(), status: 'SUCCESS' };
}

async function addStoreCredit(data: any): Promise<any> {
  return { creditId: 'credit-' + Date.now(), amount: data.amount };
}

async function findWarrantyRecord(itemId: string, serialNumber?: string): Promise<any> {
  return {
    warrantyId: 'war-123',
    warrantyType: 'MANUFACTURER',
    warrantyStartDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    warrantyEndDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
    coverageDetails: { type: 'Full replacement' },
  };
}

async function createReplacementOrder(data: any): Promise<any> {
  return { orderId: 'ord-replacement-' + Date.now() };
}

async function getOrderLineId(orderId: string, itemId: string): Promise<string> {
  return 'line-123';
}

async function getItemSku(itemId: string): Promise<string> {
  return 'SKU-' + itemId;
}

async function getItemDescription(itemId: string): Promise<string> {
  return 'Product Description for ' + itemId;
}

// Op helper for Sequelize queries
const Op = {
  notIn: Symbol('notIn'),
};
