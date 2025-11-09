/**
 * LOC: WC-ORD-MODLIF-001
 * File: /reuse/order/order-modification-lifecycle-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - class-transformer
 *
 * DOWNSTREAM (imported by):
 *   - Order controllers
 *   - Order services
 *   - Workflow engines
 *   - Audit systems
 */

/**
 * File: /reuse/order/order-modification-lifecycle-kit.ts
 * Locator: WC-ORD-MODLIF-001
 * Purpose: Order Modification & Lifecycle - Complete order change management and lifecycle operations
 *
 * Upstream: Independent utility module for order modification and lifecycle operations
 * Downstream: ../backend/order/*, Order modules, Workflow services, Audit systems
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, class-validator
 * Exports: 42 comprehensive functions for order modifications, amendments, cancellations, holds, lifecycle, history
 *
 * LLM Context: Enterprise-grade order modification and lifecycle management utilities for healthcare operations.
 * Provides comprehensive order change management, amendment workflows, cancellation processing, hold/release operations,
 * state machine transitions, audit trails, version control, approval workflows, notification systems, and archival.
 * Designed for HIPAA compliance with full audit logging and change tracking.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
  ParseUUIDPipe,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsArray,
  IsBoolean,
  IsUUID,
  ValidateNested,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS & ENUMS
// ============================================================================

/**
 * Order status enumeration
 */
export enum OrderStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  ON_HOLD = 'ON_HOLD',
  PARTIALLY_SHIPPED = 'PARTIALLY_SHIPPED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Order modification type enumeration
 */
export enum OrderModificationType {
  QUANTITY_CHANGE = 'QUANTITY_CHANGE',
  PRICE_ADJUSTMENT = 'PRICE_ADJUSTMENT',
  DATE_CHANGE = 'DATE_CHANGE',
  CUSTOMER_CHANGE = 'CUSTOMER_CHANGE',
  ADDRESS_CHANGE = 'ADDRESS_CHANGE',
  PAYMENT_METHOD_CHANGE = 'PAYMENT_METHOD_CHANGE',
  SHIPPING_METHOD_CHANGE = 'SHIPPING_METHOD_CHANGE',
  LINE_ITEM_ADDITION = 'LINE_ITEM_ADDITION',
  LINE_ITEM_REMOVAL = 'LINE_ITEM_REMOVAL',
  DISCOUNT_APPLICATION = 'DISCOUNT_APPLICATION',
  TAX_ADJUSTMENT = 'TAX_ADJUSTMENT',
  NOTES_UPDATE = 'NOTES_UPDATE',
}

/**
 * Change approval status
 */
export enum ChangeApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  AUTO_APPROVED = 'AUTO_APPROVED',
}

/**
 * Hold reason enumeration
 */
export enum HoldReason {
  PAYMENT_VERIFICATION = 'PAYMENT_VERIFICATION',
  FRAUD_CHECK = 'FRAUD_CHECK',
  INVENTORY_CHECK = 'INVENTORY_CHECK',
  CUSTOMER_REQUEST = 'CUSTOMER_REQUEST',
  ADDRESS_VERIFICATION = 'ADDRESS_VERIFICATION',
  CREDIT_LIMIT_EXCEEDED = 'CREDIT_LIMIT_EXCEEDED',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
  REGULATORY_COMPLIANCE = 'REGULATORY_COMPLIANCE',
  OTHER = 'OTHER',
}

/**
 * Cancellation reason enumeration
 */
export enum CancellationReason {
  CUSTOMER_REQUEST = 'CUSTOMER_REQUEST',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  FRAUD_DETECTED = 'FRAUD_DETECTED',
  DUPLICATE_ORDER = 'DUPLICATE_ORDER',
  SHIPPING_ISSUE = 'SHIPPING_ISSUE',
  PRICING_ERROR = 'PRICING_ERROR',
  CUSTOMER_UNAVAILABLE = 'CUSTOMER_UNAVAILABLE',
  REGULATORY_RESTRICTION = 'REGULATORY_RESTRICTION',
  OTHER = 'OTHER',
}

/**
 * Order line item interface
 */
export interface OrderLineItem {
  lineItemId: string;
  productId: string;
  sku: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  subtotal: number;
  total: number;
  metadata?: Record<string, any>;
  version: number;
  modifiedAt?: Date;
  modifiedBy?: string;
}

/**
 * Order modification record
 */
export interface OrderModification {
  modificationId: string;
  orderId: string;
  type: OrderModificationType;
  timestamp: Date;
  modifiedBy: string;
  modifiedByRole: string;
  previousValue: any;
  newValue: any;
  reason?: string;
  approvalStatus: ChangeApprovalStatus;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  metadata?: Record<string, any>;
}

/**
 * Order amendment
 */
export interface OrderAmendment {
  amendmentId: string;
  orderId: string;
  amendmentNumber: string;
  createdAt: Date;
  createdBy: string;
  modifications: OrderModification[];
  status: ChangeApprovalStatus;
  effectiveDate?: Date;
  notes?: string;
  requiresCustomerApproval: boolean;
  customerApprovedAt?: Date;
  totalImpact: {
    priceDelta: number;
    quantityDelta: number;
    taxDelta: number;
  };
}

/**
 * Order hold record
 */
export interface OrderHold {
  holdId: string;
  orderId: string;
  reason: HoldReason;
  description: string;
  placedAt: Date;
  placedBy: string;
  releasedAt?: Date;
  releasedBy?: string;
  releaseNotes?: string;
  expiresAt?: Date;
  autoRelease: boolean;
  notificationsSent: string[];
}

/**
 * Order cancellation record
 */
export interface OrderCancellation {
  cancellationId: string;
  orderId: string;
  reason: CancellationReason;
  description: string;
  cancelledAt: Date;
  cancelledBy: string;
  refundAmount?: number;
  refundProcessed: boolean;
  restockingFee?: number;
  partialCancellation: boolean;
  cancelledLineItems?: string[];
  customerNotified: boolean;
}

/**
 * Order state transition
 */
export interface OrderStateTransition {
  transitionId: string;
  orderId: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  timestamp: Date;
  triggeredBy: string;
  triggeredBySystem: boolean;
  reason?: string;
  validationsPassed: boolean;
  validationErrors?: string[];
  rollbackAvailable: boolean;
}

/**
 * Order version
 */
export interface OrderVersion {
  versionId: string;
  orderId: string;
  versionNumber: number;
  createdAt: Date;
  createdBy: string;
  snapshot: any; // Complete order snapshot
  changesSummary: string;
  tags?: string[];
  restorable: boolean;
}

/**
 * Order audit entry
 */
export interface OrderAuditEntry {
  auditId: string;
  orderId: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

/**
 * Complete order interface
 */
export interface Order {
  orderId: string;
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  lineItems: OrderLineItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingCost: number;
  total: number;
  currency: string;
  orderDate: Date;
  requestedDeliveryDate?: Date;
  shippingAddress: any;
  billingAddress: any;
  paymentMethod: string;
  shippingMethod: string;
  notes?: string;
  metadata?: Record<string, any>;
  version: number;
  currentHold?: OrderHold;
  modifications: OrderModification[];
  amendments: OrderAmendment[];
  stateHistory: OrderStateTransition[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// ============================================================================
// DTOs (Data Transfer Objects)
// ============================================================================

/**
 * DTO for quantity modification
 */
export class ModifyQuantityDto {
  @ApiProperty({ description: 'Line item ID to modify' })
  @IsUUID()
  lineItemId: string;

  @ApiProperty({ description: 'New quantity', minimum: 0 })
  @IsNumber()
  @Min(0)
  newQuantity: number;

  @ApiPropertyOptional({ description: 'Reason for modification' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional({ description: 'Requires approval flag' })
  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;
}

/**
 * DTO for price adjustment
 */
export class AdjustPriceDto {
  @ApiProperty({ description: 'Line item ID to adjust' })
  @IsUUID()
  lineItemId: string;

  @ApiProperty({ description: 'New unit price' })
  @IsNumber()
  @Min(0)
  newPrice: number;

  @ApiProperty({ description: 'Adjustment reason' })
  @IsString()
  @MaxLength(500)
  reason: string;

  @ApiPropertyOptional({ description: 'Override approval requirement' })
  @IsOptional()
  @IsBoolean()
  overrideApproval?: boolean;
}

/**
 * DTO for date change
 */
export class ChangeDateDto {
  @ApiProperty({ description: 'New requested delivery date' })
  @IsDate()
  @Type(() => Date)
  newDeliveryDate: Date;

  @ApiPropertyOptional({ description: 'Reason for date change' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional({ description: 'Notify customer' })
  @IsOptional()
  @IsBoolean()
  notifyCustomer?: boolean;
}

/**
 * DTO for customer change
 */
export class ChangeCustomerDto {
  @ApiProperty({ description: 'New customer ID' })
  @IsUUID()
  newCustomerId: string;

  @ApiProperty({ description: 'Transfer reason' })
  @IsString()
  @MaxLength(500)
  transferReason: string;

  @ApiPropertyOptional({ description: 'Update billing address' })
  @IsOptional()
  @IsBoolean()
  updateBillingAddress?: boolean;

  @ApiPropertyOptional({ description: 'Update shipping address' })
  @IsOptional()
  @IsBoolean()
  updateShippingAddress?: boolean;
}

/**
 * DTO for creating amendment
 */
export class CreateAmendmentDto {
  @ApiProperty({ description: 'Modifications to include', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  modifications: Partial<OrderModification>[];

  @ApiPropertyOptional({ description: 'Amendment notes' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({ description: 'Requires customer approval' })
  @IsOptional()
  @IsBoolean()
  requiresCustomerApproval?: boolean;

  @ApiPropertyOptional({ description: 'Effective date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  effectiveDate?: Date;
}

/**
 * DTO for cancellation request
 */
export class CancelOrderDto {
  @ApiProperty({ description: 'Cancellation reason', enum: CancellationReason })
  @IsEnum(CancellationReason)
  reason: CancellationReason;

  @ApiProperty({ description: 'Detailed description' })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiPropertyOptional({ description: 'Partial cancellation - line item IDs' })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  lineItemIds?: string[];

  @ApiPropertyOptional({ description: 'Process refund automatically' })
  @IsOptional()
  @IsBoolean()
  processRefund?: boolean;

  @ApiPropertyOptional({ description: 'Restocking fee percentage (0-1)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  restockingFeePercent?: number;

  @ApiPropertyOptional({ description: 'Notify customer' })
  @IsOptional()
  @IsBoolean()
  notifyCustomer?: boolean;
}

/**
 * DTO for placing order on hold
 */
export class PlaceHoldDto {
  @ApiProperty({ description: 'Hold reason', enum: HoldReason })
  @IsEnum(HoldReason)
  reason: HoldReason;

  @ApiProperty({ description: 'Hold description' })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiPropertyOptional({ description: 'Auto-release after duration (minutes)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  autoReleaseDuration?: number;

  @ApiPropertyOptional({ description: 'Send notifications to' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  notifyUsers?: string[];
}

/**
 * DTO for releasing hold
 */
export class ReleaseHoldDto {
  @ApiPropertyOptional({ description: 'Release notes' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  releaseNotes?: string;

  @ApiPropertyOptional({ description: 'Resume processing immediately' })
  @IsOptional()
  @IsBoolean()
  resumeProcessing?: boolean;
}

/**
 * DTO for state transition
 */
export class TransitionStateDto {
  @ApiProperty({ description: 'Target status', enum: OrderStatus })
  @IsEnum(OrderStatus)
  targetStatus: OrderStatus;

  @ApiPropertyOptional({ description: 'Transition reason' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional({ description: 'Skip validations' })
  @IsOptional()
  @IsBoolean()
  skipValidations?: boolean;
}

/**
 * DTO for approval decision
 */
export class ApprovalDecisionDto {
  @ApiProperty({ description: 'Approval decision', enum: ChangeApprovalStatus })
  @IsEnum(ChangeApprovalStatus)
  decision: ChangeApprovalStatus;

  @ApiPropertyOptional({ description: 'Decision notes' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({ description: 'Conditions or requirements' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  conditions?: string[];
}

/**
 * DTO for order clone
 */
export class CloneOrderDto {
  @ApiPropertyOptional({ description: 'New customer ID (if different)' })
  @IsOptional()
  @IsUUID()
  newCustomerId?: string;

  @ApiPropertyOptional({ description: 'Include modifications' })
  @IsOptional()
  @IsBoolean()
  includeModifications?: boolean;

  @ApiPropertyOptional({ description: 'Reset to draft status' })
  @IsOptional()
  @IsBoolean()
  resetToDraft?: boolean;

  @ApiPropertyOptional({ description: 'Clone tags' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

/**
 * DTO for archival
 */
export class ArchiveOrderDto {
  @ApiPropertyOptional({ description: 'Archival reason' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional({ description: 'Create backup before archival' })
  @IsOptional()
  @IsBoolean()
  createBackup?: boolean;

  @ApiPropertyOptional({ description: 'Retention period (days)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  retentionDays?: number;
}

// ============================================================================
// SECTION 1: ORDER MODIFICATIONS (Functions 1-7)
// ============================================================================

/**
 * 1. Modifies line item quantity in an order.
 *
 * @param {Order} order - Order to modify
 * @param {ModifyQuantityDto} dto - Modification details
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const modifiedOrder = await modifyLineItemQuantity(order, {
 *   lineItemId: 'line-123',
 *   newQuantity: 5,
 *   reason: 'Customer requested increase'
 * }, 'user-456');
 * ```
 */
export async function modifyLineItemQuantity(
  order: Order,
  dto: ModifyQuantityDto,
  userId: string
): Promise<Order> {
  const lineItem = order.lineItems.find(item => item.lineItemId === dto.lineItemId);

  if (!lineItem) {
    throw new NotFoundException(`Line item ${dto.lineItemId} not found`);
  }

  const previousQuantity = lineItem.quantity;
  const modification: OrderModification = {
    modificationId: generateModificationId(),
    orderId: order.orderId,
    type: OrderModificationType.QUANTITY_CHANGE,
    timestamp: new Date(),
    modifiedBy: userId,
    modifiedByRole: 'user', // Would come from context
    previousValue: previousQuantity,
    newValue: dto.newQuantity,
    reason: dto.reason,
    approvalStatus: dto.requiresApproval
      ? ChangeApprovalStatus.PENDING
      : ChangeApprovalStatus.AUTO_APPROVED,
  };

  // Update line item
  lineItem.quantity = dto.newQuantity;
  lineItem.subtotal = lineItem.quantity * lineItem.unitPrice;
  lineItem.total = lineItem.subtotal - lineItem.discountAmount + lineItem.taxAmount;
  lineItem.modifiedAt = new Date();
  lineItem.modifiedBy = userId;
  lineItem.version++;

  // Recalculate order totals
  const updatedOrder = recalculateOrderTotals(order);
  updatedOrder.modifications.push(modification);
  updatedOrder.version++;
  updatedOrder.updatedAt = new Date();
  updatedOrder.updatedBy = userId;

  return updatedOrder;
}

/**
 * 2. Adjusts price for a line item.
 *
 * @param {Order} order - Order to modify
 * @param {AdjustPriceDto} dto - Price adjustment details
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const adjusted = await adjustLineItemPrice(order, {
 *   lineItemId: 'line-123',
 *   newPrice: 99.99,
 *   reason: 'Price match guarantee'
 * }, 'user-456');
 * ```
 */
export async function adjustLineItemPrice(
  order: Order,
  dto: AdjustPriceDto,
  userId: string
): Promise<Order> {
  const lineItem = order.lineItems.find(item => item.lineItemId === dto.lineItemId);

  if (!lineItem) {
    throw new NotFoundException(`Line item ${dto.lineItemId} not found`);
  }

  const previousPrice = lineItem.unitPrice;
  const priceDifference = Math.abs(dto.newPrice - previousPrice);
  const percentageChange = (priceDifference / previousPrice) * 100;

  // Require approval for significant price changes (>10%)
  const requiresApproval = percentageChange > 10 && !dto.overrideApproval;

  const modification: OrderModification = {
    modificationId: generateModificationId(),
    orderId: order.orderId,
    type: OrderModificationType.PRICE_ADJUSTMENT,
    timestamp: new Date(),
    modifiedBy: userId,
    modifiedByRole: 'user',
    previousValue: previousPrice,
    newValue: dto.newPrice,
    reason: dto.reason,
    approvalStatus: requiresApproval
      ? ChangeApprovalStatus.PENDING
      : ChangeApprovalStatus.AUTO_APPROVED,
    metadata: { percentageChange, priceDifference },
  };

  // Update line item
  lineItem.unitPrice = dto.newPrice;
  lineItem.subtotal = lineItem.quantity * lineItem.unitPrice;
  lineItem.total = lineItem.subtotal - lineItem.discountAmount + lineItem.taxAmount;
  lineItem.modifiedAt = new Date();
  lineItem.modifiedBy = userId;
  lineItem.version++;

  const updatedOrder = recalculateOrderTotals(order);
  updatedOrder.modifications.push(modification);
  updatedOrder.version++;
  updatedOrder.updatedAt = new Date();
  updatedOrder.updatedBy = userId;

  return updatedOrder;
}

/**
 * 3. Changes the requested delivery date for an order.
 *
 * @param {Order} order - Order to modify
 * @param {ChangeDateDto} dto - Date change details
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const updated = await changeDeliveryDate(order, {
 *   newDeliveryDate: new Date('2024-02-01'),
 *   reason: 'Customer unavailable on original date',
 *   notifyCustomer: true
 * }, 'user-456');
 * ```
 */
export async function changeDeliveryDate(
  order: Order,
  dto: ChangeDateDto,
  userId: string
): Promise<Order> {
  const previousDate = order.requestedDeliveryDate;

  const modification: OrderModification = {
    modificationId: generateModificationId(),
    orderId: order.orderId,
    type: OrderModificationType.DATE_CHANGE,
    timestamp: new Date(),
    modifiedBy: userId,
    modifiedByRole: 'user',
    previousValue: previousDate,
    newValue: dto.newDeliveryDate,
    reason: dto.reason,
    approvalStatus: ChangeApprovalStatus.AUTO_APPROVED,
    metadata: { notifyCustomer: dto.notifyCustomer },
  };

  order.requestedDeliveryDate = dto.newDeliveryDate;
  order.modifications.push(modification);
  order.version++;
  order.updatedAt = new Date();
  order.updatedBy = userId;

  return order;
}

/**
 * 4. Changes the customer associated with an order.
 *
 * @param {Order} order - Order to modify
 * @param {ChangeCustomerDto} dto - Customer change details
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const transferred = await changeOrderCustomer(order, {
 *   newCustomerId: 'cust-789',
 *   transferReason: 'Order placed by assistant on behalf of customer',
 *   updateBillingAddress: true
 * }, 'user-456');
 * ```
 */
export async function changeOrderCustomer(
  order: Order,
  dto: ChangeCustomerDto,
  userId: string
): Promise<Order> {
  const previousCustomerId = order.customerId;

  if (order.status !== OrderStatus.DRAFT && order.status !== OrderStatus.PENDING) {
    throw new BadRequestException('Cannot change customer for orders beyond pending status');
  }

  const modification: OrderModification = {
    modificationId: generateModificationId(),
    orderId: order.orderId,
    type: OrderModificationType.CUSTOMER_CHANGE,
    timestamp: new Date(),
    modifiedBy: userId,
    modifiedByRole: 'user',
    previousValue: previousCustomerId,
    newValue: dto.newCustomerId,
    reason: dto.transferReason,
    approvalStatus: ChangeApprovalStatus.PENDING, // Always requires approval
    metadata: {
      updateBillingAddress: dto.updateBillingAddress,
      updateShippingAddress: dto.updateShippingAddress,
    },
  };

  order.customerId = dto.newCustomerId;
  order.modifications.push(modification);
  order.version++;
  order.updatedAt = new Date();
  order.updatedBy = userId;

  return order;
}

/**
 * 5. Adds a new line item to an existing order.
 *
 * @param {Order} order - Order to modify
 * @param {Partial<OrderLineItem>} lineItem - Line item to add
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const updated = await addLineItemToOrder(order, {
 *   productId: 'prod-789',
 *   sku: 'SKU-789',
 *   name: 'Additional Product',
 *   quantity: 2,
 *   unitPrice: 49.99
 * }, 'user-456');
 * ```
 */
export async function addLineItemToOrder(
  order: Order,
  lineItem: Partial<OrderLineItem>,
  userId: string
): Promise<Order> {
  const newLineItem: OrderLineItem = {
    lineItemId: generateLineItemId(),
    productId: lineItem.productId || '',
    sku: lineItem.sku || '',
    name: lineItem.name || '',
    description: lineItem.description,
    quantity: lineItem.quantity || 1,
    unitPrice: lineItem.unitPrice || 0,
    discountAmount: lineItem.discountAmount || 0,
    taxAmount: calculateLineTax(lineItem.quantity || 1, lineItem.unitPrice || 0),
    subtotal: (lineItem.quantity || 1) * (lineItem.unitPrice || 0),
    total: 0, // Will be calculated
    metadata: lineItem.metadata,
    version: 1,
    modifiedAt: new Date(),
    modifiedBy: userId,
  };

  newLineItem.total = newLineItem.subtotal - newLineItem.discountAmount + newLineItem.taxAmount;

  const modification: OrderModification = {
    modificationId: generateModificationId(),
    orderId: order.orderId,
    type: OrderModificationType.LINE_ITEM_ADDITION,
    timestamp: new Date(),
    modifiedBy: userId,
    modifiedByRole: 'user',
    previousValue: null,
    newValue: newLineItem,
    approvalStatus: ChangeApprovalStatus.AUTO_APPROVED,
  };

  order.lineItems.push(newLineItem);
  const updatedOrder = recalculateOrderTotals(order);
  updatedOrder.modifications.push(modification);
  updatedOrder.version++;
  updatedOrder.updatedAt = new Date();
  updatedOrder.updatedBy = userId;

  return updatedOrder;
}

/**
 * 6. Removes a line item from an order.
 *
 * @param {Order} order - Order to modify
 * @param {string} lineItemId - Line item ID to remove
 * @param {string} reason - Removal reason
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const updated = await removeLineItemFromOrder(
 *   order,
 *   'line-123',
 *   'Product discontinued',
 *   'user-456'
 * );
 * ```
 */
export async function removeLineItemFromOrder(
  order: Order,
  lineItemId: string,
  reason: string,
  userId: string
): Promise<Order> {
  const lineItemIndex = order.lineItems.findIndex(item => item.lineItemId === lineItemId);

  if (lineItemIndex === -1) {
    throw new NotFoundException(`Line item ${lineItemId} not found`);
  }

  const removedItem = order.lineItems[lineItemIndex];

  const modification: OrderModification = {
    modificationId: generateModificationId(),
    orderId: order.orderId,
    type: OrderModificationType.LINE_ITEM_REMOVAL,
    timestamp: new Date(),
    modifiedBy: userId,
    modifiedByRole: 'user',
    previousValue: removedItem,
    newValue: null,
    reason,
    approvalStatus: ChangeApprovalStatus.AUTO_APPROVED,
  };

  order.lineItems.splice(lineItemIndex, 1);

  if (order.lineItems.length === 0) {
    throw new BadRequestException('Cannot remove all line items from order');
  }

  const updatedOrder = recalculateOrderTotals(order);
  updatedOrder.modifications.push(modification);
  updatedOrder.version++;
  updatedOrder.updatedAt = new Date();
  updatedOrder.updatedBy = userId;

  return updatedOrder;
}

/**
 * 7. Updates order notes or special instructions.
 *
 * @param {Order} order - Order to modify
 * @param {string} notes - New notes
 * @param {string} userId - User making the change
 * @returns {Promise<Order>} Modified order
 *
 * @example
 * ```typescript
 * const updated = await updateOrderNotes(
 *   order,
 *   'Please ring doorbell twice and leave at side door',
 *   'user-456'
 * );
 * ```
 */
export async function updateOrderNotes(
  order: Order,
  notes: string,
  userId: string
): Promise<Order> {
  const previousNotes = order.notes;

  const modification: OrderModification = {
    modificationId: generateModificationId(),
    orderId: order.orderId,
    type: OrderModificationType.NOTES_UPDATE,
    timestamp: new Date(),
    modifiedBy: userId,
    modifiedByRole: 'user',
    previousValue: previousNotes,
    newValue: notes,
    approvalStatus: ChangeApprovalStatus.AUTO_APPROVED,
  };

  order.notes = notes;
  order.modifications.push(modification);
  order.updatedAt = new Date();
  order.updatedBy = userId;

  return order;
}

// ============================================================================
// SECTION 2: ORDER AMENDMENTS & CHANGE ORDERS (Functions 8-14)
// ============================================================================

/**
 * 8. Creates a formal amendment to an order.
 *
 * @param {Order} order - Order to amend
 * @param {CreateAmendmentDto} dto - Amendment details
 * @param {string} userId - User creating amendment
 * @returns {Promise<OrderAmendment>} Created amendment
 *
 * @example
 * ```typescript
 * const amendment = await createOrderAmendment(order, {
 *   modifications: [mod1, mod2],
 *   notes: 'Customer requested changes to delivery',
 *   requiresCustomerApproval: true
 * }, 'user-456');
 * ```
 */
export async function createOrderAmendment(
  order: Order,
  dto: CreateAmendmentDto,
  userId: string
): Promise<OrderAmendment> {
  const amendmentNumber = generateAmendmentNumber(order.orderNumber, order.amendments.length + 1);

  // Calculate total impact
  const totalImpact = calculateAmendmentImpact(dto.modifications);

  const amendment: OrderAmendment = {
    amendmentId: generateAmendmentId(),
    orderId: order.orderId,
    amendmentNumber,
    createdAt: new Date(),
    createdBy: userId,
    modifications: dto.modifications as OrderModification[],
    status: dto.requiresCustomerApproval
      ? ChangeApprovalStatus.PENDING
      : ChangeApprovalStatus.AUTO_APPROVED,
    effectiveDate: dto.effectiveDate,
    notes: dto.notes,
    requiresCustomerApproval: dto.requiresCustomerApproval || false,
    totalImpact,
  };

  order.amendments.push(amendment);
  order.version++;
  order.updatedAt = new Date();
  order.updatedBy = userId;

  return amendment;
}

/**
 * 9. Approves a pending order amendment.
 *
 * @param {OrderAmendment} amendment - Amendment to approve
 * @param {ApprovalDecisionDto} dto - Approval details
 * @param {string} approverId - User approving
 * @returns {Promise<OrderAmendment>} Approved amendment
 *
 * @example
 * ```typescript
 * const approved = await approveAmendment(amendment, {
 *   decision: ChangeApprovalStatus.APPROVED,
 *   notes: 'All changes look good'
 * }, 'approver-789');
 * ```
 */
export async function approveAmendment(
  amendment: OrderAmendment,
  dto: ApprovalDecisionDto,
  approverId: string
): Promise<OrderAmendment> {
  if (amendment.status !== ChangeApprovalStatus.PENDING) {
    throw new BadRequestException('Amendment is not pending approval');
  }

  amendment.status = dto.decision;
  amendment.approvedBy = approverId;
  amendment.approvedAt = new Date();

  // Update all modifications in the amendment
  amendment.modifications.forEach(mod => {
    mod.approvalStatus = dto.decision;
    mod.approvedBy = approverId;
    mod.approvedAt = new Date();
    if (dto.decision === ChangeApprovalStatus.REJECTED) {
      mod.rejectionReason = dto.notes;
    }
  });

  return amendment;
}

/**
 * 10. Rejects a pending order amendment.
 *
 * @param {OrderAmendment} amendment - Amendment to reject
 * @param {string} reason - Rejection reason
 * @param {string} approverId - User rejecting
 * @returns {Promise<OrderAmendment>} Rejected amendment
 *
 * @example
 * ```typescript
 * const rejected = await rejectAmendment(
 *   amendment,
 *   'Price change exceeds allowed threshold',
 *   'approver-789'
 * );
 * ```
 */
export async function rejectAmendment(
  amendment: OrderAmendment,
  reason: string,
  approverId: string
): Promise<OrderAmendment> {
  if (amendment.status !== ChangeApprovalStatus.PENDING) {
    throw new BadRequestException('Amendment is not pending approval');
  }

  amendment.status = ChangeApprovalStatus.REJECTED;
  amendment.approvedBy = approverId;
  amendment.approvedAt = new Date();

  amendment.modifications.forEach(mod => {
    mod.approvalStatus = ChangeApprovalStatus.REJECTED;
    mod.approvedBy = approverId;
    mod.approvedAt = new Date();
    mod.rejectionReason = reason;
  });

  return amendment;
}

/**
 * 11. Gets customer approval for an amendment.
 *
 * @param {OrderAmendment} amendment - Amendment requiring approval
 * @param {boolean} approved - Customer approval decision
 * @returns {Promise<OrderAmendment>} Updated amendment
 *
 * @example
 * ```typescript
 * const updated = await getCustomerApproval(amendment, true);
 * ```
 */
export async function getCustomerApproval(
  amendment: OrderAmendment,
  approved: boolean
): Promise<OrderAmendment> {
  if (!amendment.requiresCustomerApproval) {
    throw new BadRequestException('Amendment does not require customer approval');
  }

  if (approved) {
    amendment.customerApprovedAt = new Date();
    amendment.status = ChangeApprovalStatus.APPROVED;
  } else {
    amendment.status = ChangeApprovalStatus.REJECTED;
  }

  return amendment;
}

/**
 * 12. Applies an approved amendment to the order.
 *
 * @param {Order} order - Order to apply amendment to
 * @param {OrderAmendment} amendment - Approved amendment
 * @param {string} userId - User applying amendment
 * @returns {Promise<Order>} Updated order
 *
 * @example
 * ```typescript
 * const updated = await applyAmendmentToOrder(order, amendment, 'user-456');
 * ```
 */
export async function applyAmendmentToOrder(
  order: Order,
  amendment: OrderAmendment,
  userId: string
): Promise<Order> {
  if (amendment.status !== ChangeApprovalStatus.APPROVED) {
    throw new BadRequestException('Amendment must be approved before applying');
  }

  if (amendment.orderId !== order.orderId) {
    throw new BadRequestException('Amendment does not belong to this order');
  }

  // Apply each modification from the amendment
  for (const modification of amendment.modifications) {
    switch (modification.type) {
      case OrderModificationType.QUANTITY_CHANGE:
        const lineItem = order.lineItems.find(
          item => item.lineItemId === modification.metadata?.lineItemId
        );
        if (lineItem) {
          lineItem.quantity = modification.newValue;
        }
        break;
      case OrderModificationType.PRICE_ADJUSTMENT:
        const priceItem = order.lineItems.find(
          item => item.lineItemId === modification.metadata?.lineItemId
        );
        if (priceItem) {
          priceItem.unitPrice = modification.newValue;
        }
        break;
      // Handle other modification types...
    }
  }

  const updatedOrder = recalculateOrderTotals(order);
  updatedOrder.version++;
  updatedOrder.updatedAt = new Date();
  updatedOrder.updatedBy = userId;

  return updatedOrder;
}

/**
 * 13. Calculates the financial impact of proposed changes.
 *
 * @param {OrderModification[]} modifications - Proposed modifications
 * @returns {object} Impact summary
 *
 * @example
 * ```typescript
 * const impact = calculateChangeImpact([mod1, mod2, mod3]);
 * console.log(`Price delta: $${impact.priceDelta}`);
 * ```
 */
export function calculateChangeImpact(modifications: OrderModification[]): {
  priceDelta: number;
  quantityDelta: number;
  taxDelta: number;
  affectedLineItems: string[];
} {
  let priceDelta = 0;
  let quantityDelta = 0;
  let taxDelta = 0;
  const affectedLineItems = new Set<string>();

  for (const mod of modifications) {
    if (mod.metadata?.lineItemId) {
      affectedLineItems.add(mod.metadata.lineItemId);
    }

    switch (mod.type) {
      case OrderModificationType.PRICE_ADJUSTMENT:
        priceDelta += (mod.newValue - mod.previousValue);
        break;
      case OrderModificationType.QUANTITY_CHANGE:
        quantityDelta += (mod.newValue - mod.previousValue);
        break;
      case OrderModificationType.TAX_ADJUSTMENT:
        taxDelta += (mod.newValue - mod.previousValue);
        break;
    }
  }

  return {
    priceDelta,
    quantityDelta,
    taxDelta,
    affectedLineItems: Array.from(affectedLineItems),
  };
}

/**
 * 14. Generates change notification for customer.
 *
 * @param {Order} order - Modified order
 * @param {OrderAmendment} amendment - Amendment details
 * @returns {object} Notification details
 *
 * @example
 * ```typescript
 * const notification = generateChangeNotification(order, amendment);
 * await emailService.send(notification);
 * ```
 */
export function generateChangeNotification(
  order: Order,
  amendment: OrderAmendment
): {
  to: string;
  subject: string;
  body: string;
  priority: string;
} {
  const impact = amendment.totalImpact;
  const priceChange = impact.priceDelta >= 0 ? `+$${impact.priceDelta.toFixed(2)}` : `-$${Math.abs(impact.priceDelta).toFixed(2)}`;

  return {
    to: order.customerId, // Would be customer email
    subject: `Order ${order.orderNumber} - Changes Requiring Your Approval`,
    body: `
Dear Customer,

Your order ${order.orderNumber} has been modified and requires your approval.

Amendment: ${amendment.amendmentNumber}
Changes: ${amendment.modifications.length} modification(s)
Price Impact: ${priceChange}
Quantity Impact: ${impact.quantityDelta}

Notes: ${amendment.notes || 'None'}

Please review and approve these changes at your earliest convenience.

Thank you,
Order Management Team
    `.trim(),
    priority: 'high',
  };
}

// ============================================================================
// SECTION 3: ORDER CANCELLATIONS (Functions 15-21)
// ============================================================================

/**
 * 15. Cancels an entire order.
 *
 * @param {Order} order - Order to cancel
 * @param {CancelOrderDto} dto - Cancellation details
 * @param {string} userId - User cancelling
 * @returns {Promise<OrderCancellation>} Cancellation record
 *
 * @example
 * ```typescript
 * const cancellation = await cancelOrder(order, {
 *   reason: CancellationReason.CUSTOMER_REQUEST,
 *   description: 'Customer no longer needs items',
 *   processRefund: true,
 *   notifyCustomer: true
 * }, 'user-456');
 * ```
 */
export async function cancelOrder(
  order: Order,
  dto: CancelOrderDto,
  userId: string
): Promise<OrderCancellation> {
  // Validate cancellation is allowed
  if (order.status === OrderStatus.CANCELLED) {
    throw new BadRequestException('Order is already cancelled');
  }

  if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.COMPLETED) {
    throw new BadRequestException('Cannot cancel completed or delivered orders');
  }

  const refundAmount = dto.processRefund ? order.total : 0;
  const restockingFee = dto.restockingFeePercent
    ? order.total * dto.restockingFeePercent
    : 0;

  const cancellation: OrderCancellation = {
    cancellationId: generateCancellationId(),
    orderId: order.orderId,
    reason: dto.reason,
    description: dto.description,
    cancelledAt: new Date(),
    cancelledBy: userId,
    refundAmount: refundAmount - restockingFee,
    refundProcessed: false,
    restockingFee,
    partialCancellation: false,
    customerNotified: dto.notifyCustomer || false,
  };

  // Update order status
  const stateTransition: OrderStateTransition = {
    transitionId: generateTransitionId(),
    orderId: order.orderId,
    fromStatus: order.status,
    toStatus: OrderStatus.CANCELLED,
    timestamp: new Date(),
    triggeredBy: userId,
    triggeredBySystem: false,
    reason: dto.description,
    validationsPassed: true,
    rollbackAvailable: false,
  };

  order.status = OrderStatus.CANCELLED;
  order.stateHistory.push(stateTransition);
  order.metadata = {
    ...order.metadata,
    cancellation,
  };
  order.updatedAt = new Date();
  order.updatedBy = userId;

  return cancellation;
}

/**
 * 16. Partially cancels specific line items.
 *
 * @param {Order} order - Order to partially cancel
 * @param {CancelOrderDto} dto - Cancellation details with line items
 * @param {string} userId - User cancelling
 * @returns {Promise<OrderCancellation>} Cancellation record
 *
 * @example
 * ```typescript
 * const cancellation = await partialCancelOrder(order, {
 *   reason: CancellationReason.OUT_OF_STOCK,
 *   description: 'Items no longer available',
 *   lineItemIds: ['line-123', 'line-456'],
 *   processRefund: true
 * }, 'user-456');
 * ```
 */
export async function partialCancelOrder(
  order: Order,
  dto: CancelOrderDto,
  userId: string
): Promise<OrderCancellation> {
  if (!dto.lineItemIds || dto.lineItemIds.length === 0) {
    throw new BadRequestException('Line item IDs required for partial cancellation');
  }

  // Calculate refund amount for cancelled items
  const cancelledItems = order.lineItems.filter(item =>
    dto.lineItemIds!.includes(item.lineItemId)
  );

  if (cancelledItems.length === 0) {
    throw new NotFoundException('No valid line items found for cancellation');
  }

  const refundAmount = cancelledItems.reduce((sum, item) => sum + item.total, 0);
  const restockingFee = dto.restockingFeePercent
    ? refundAmount * dto.restockingFeePercent
    : 0;

  const cancellation: OrderCancellation = {
    cancellationId: generateCancellationId(),
    orderId: order.orderId,
    reason: dto.reason,
    description: dto.description,
    cancelledAt: new Date(),
    cancelledBy: userId,
    refundAmount: refundAmount - restockingFee,
    refundProcessed: false,
    restockingFee,
    partialCancellation: true,
    cancelledLineItems: dto.lineItemIds,
    customerNotified: dto.notifyCustomer || false,
  };

  // Remove cancelled line items
  order.lineItems = order.lineItems.filter(item =>
    !dto.lineItemIds!.includes(item.lineItemId)
  );

  // Recalculate order totals
  const updatedOrder = recalculateOrderTotals(order);
  updatedOrder.metadata = {
    ...updatedOrder.metadata,
    partialCancellations: [
      ...(updatedOrder.metadata?.partialCancellations || []),
      cancellation,
    ],
  };
  updatedOrder.updatedAt = new Date();
  updatedOrder.updatedBy = userId;

  return cancellation;
}

/**
 * 17. Processes refund for cancelled order.
 *
 * @param {OrderCancellation} cancellation - Cancellation to process refund for
 * @param {string} refundMethod - Payment method for refund
 * @returns {Promise<object>} Refund details
 *
 * @example
 * ```typescript
 * const refund = await processRefund(cancellation, 'original_payment_method');
 * ```
 */
export async function processRefund(
  cancellation: OrderCancellation,
  refundMethod: string
): Promise<{
  refundId: string;
  amount: number;
  method: string;
  processedAt: Date;
  status: string;
}> {
  if (cancellation.refundProcessed) {
    throw new BadRequestException('Refund already processed');
  }

  const refund = {
    refundId: generateRefundId(),
    amount: cancellation.refundAmount || 0,
    method: refundMethod,
    processedAt: new Date(),
    status: 'processed',
  };

  cancellation.refundProcessed = true;

  return refund;
}

/**
 * 18. Calculates cancellation restocking fee.
 *
 * @param {number} orderTotal - Original order total
 * @param {number} feePercentage - Fee percentage (0-1)
 * @param {OrderStatus} currentStatus - Current order status
 * @returns {object} Fee breakdown
 *
 * @example
 * ```typescript
 * const fee = calculateRestockingFee(500.00, 0.15, OrderStatus.PROCESSING);
 * // Returns: { originalAmount: 500, fee: 75, refundAmount: 425 }
 * ```
 */
export function calculateRestockingFee(
  orderTotal: number,
  feePercentage: number,
  currentStatus: OrderStatus
): {
  originalAmount: number;
  fee: number;
  refundAmount: number;
  feeWaived: boolean;
  waiverReason?: string;
} {
  // Waive fee for early-stage cancellations
  if (currentStatus === OrderStatus.DRAFT || currentStatus === OrderStatus.PENDING) {
    return {
      originalAmount: orderTotal,
      fee: 0,
      refundAmount: orderTotal,
      feeWaived: true,
      waiverReason: 'Order not yet processed',
    };
  }

  const fee = orderTotal * feePercentage;

  return {
    originalAmount: orderTotal,
    fee,
    refundAmount: orderTotal - fee,
    feeWaived: false,
  };
}

/**
 * 19. Validates if an order can be cancelled.
 *
 * @param {Order} order - Order to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCancellationEligibility(order);
 * if (!result.canCancel) {
 *   console.error(result.reason);
 * }
 * ```
 */
export function validateCancellationEligibility(order: Order): {
  canCancel: boolean;
  reason?: string;
  requiresApproval: boolean;
  estimatedRefund: number;
} {
  if (order.status === OrderStatus.CANCELLED) {
    return {
      canCancel: false,
      reason: 'Order is already cancelled',
      requiresApproval: false,
      estimatedRefund: 0,
    };
  }

  if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.COMPLETED) {
    return {
      canCancel: false,
      reason: 'Cannot cancel completed or delivered orders',
      requiresApproval: false,
      estimatedRefund: 0,
    };
  }

  if (order.status === OrderStatus.SHIPPED) {
    return {
      canCancel: true,
      reason: 'Order in transit - requires supervisor approval',
      requiresApproval: true,
      estimatedRefund: order.total,
    };
  }

  return {
    canCancel: true,
    requiresApproval: false,
    estimatedRefund: order.total,
  };
}

/**
 * 20. Sends cancellation notification to customer.
 *
 * @param {Order} order - Cancelled order
 * @param {OrderCancellation} cancellation - Cancellation details
 * @returns {object} Notification details
 *
 * @example
 * ```typescript
 * const notification = sendCancellationNotification(order, cancellation);
 * ```
 */
export function sendCancellationNotification(
  order: Order,
  cancellation: OrderCancellation
): {
  to: string;
  subject: string;
  body: string;
  includeRefundInfo: boolean;
} {
  return {
    to: order.customerId,
    subject: `Order ${order.orderNumber} - Cancellation Confirmation`,
    body: `
Dear Customer,

Your order ${order.orderNumber} has been ${cancellation.partialCancellation ? 'partially ' : ''}cancelled.

Reason: ${cancellation.reason}
Cancelled on: ${cancellation.cancelledAt.toLocaleDateString()}

${cancellation.refundAmount ? `Refund Amount: $${cancellation.refundAmount.toFixed(2)}` : ''}
${cancellation.restockingFee ? `Restocking Fee: $${cancellation.restockingFee.toFixed(2)}` : ''}

${cancellation.partialCancellation
  ? `Items Cancelled: ${cancellation.cancelledLineItems?.length} item(s)\nRemaining items will be processed normally.`
  : 'All items have been cancelled.'
}

If you have any questions, please contact our customer service team.

Thank you,
Order Management Team
    `.trim(),
    includeRefundInfo: (cancellation.refundAmount || 0) > 0,
  };
}

/**
 * 21. Restocks inventory for cancelled items.
 *
 * @param {Order} order - Cancelled order
 * @param {string[]} lineItemIds - Line items to restock
 * @returns {Promise<object>} Restock summary
 *
 * @example
 * ```typescript
 * const restocked = await restockCancelledItems(order, ['line-123', 'line-456']);
 * ```
 */
export async function restockCancelledItems(
  order: Order,
  lineItemIds?: string[]
): Promise<{
  restockedItems: Array<{ productId: string; quantity: number }>;
  totalItemsRestocked: number;
  restockedAt: Date;
}> {
  const itemsToRestock = lineItemIds
    ? order.lineItems.filter(item => lineItemIds.includes(item.lineItemId))
    : order.lineItems;

  const restockedItems = itemsToRestock.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
  }));

  const totalItemsRestocked = restockedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return {
    restockedItems,
    totalItemsRestocked,
    restockedAt: new Date(),
  };
}

// ============================================================================
// SECTION 4: ORDER HOLDS & RELEASES (Functions 22-28)
// ============================================================================

/**
 * 22. Places an order on hold.
 *
 * @param {Order} order - Order to hold
 * @param {PlaceHoldDto} dto - Hold details
 * @param {string} userId - User placing hold
 * @returns {Promise<OrderHold>} Hold record
 *
 * @example
 * ```typescript
 * const hold = await placeOrderOnHold(order, {
 *   reason: HoldReason.PAYMENT_VERIFICATION,
 *   description: 'Verifying payment method',
 *   autoReleaseDuration: 120
 * }, 'user-456');
 * ```
 */
export async function placeOrderOnHold(
  order: Order,
  dto: PlaceHoldDto,
  userId: string
): Promise<OrderHold> {
  if (order.currentHold) {
    throw new ConflictException('Order is already on hold');
  }

  const expiresAt = dto.autoReleaseDuration
    ? new Date(Date.now() + dto.autoReleaseDuration * 60000)
    : undefined;

  const hold: OrderHold = {
    holdId: generateHoldId(),
    orderId: order.orderId,
    reason: dto.reason,
    description: dto.description,
    placedAt: new Date(),
    placedBy: userId,
    expiresAt,
    autoRelease: !!dto.autoReleaseDuration,
    notificationsSent: dto.notifyUsers || [],
  };

  const stateTransition: OrderStateTransition = {
    transitionId: generateTransitionId(),
    orderId: order.orderId,
    fromStatus: order.status,
    toStatus: OrderStatus.ON_HOLD,
    timestamp: new Date(),
    triggeredBy: userId,
    triggeredBySystem: false,
    reason: dto.description,
    validationsPassed: true,
    rollbackAvailable: true,
  };

  order.status = OrderStatus.ON_HOLD;
  order.currentHold = hold;
  order.stateHistory.push(stateTransition);
  order.updatedAt = new Date();
  order.updatedBy = userId;

  return hold;
}

/**
 * 23. Releases an order from hold.
 *
 * @param {Order} order - Order to release
 * @param {ReleaseHoldDto} dto - Release details
 * @param {string} userId - User releasing hold
 * @returns {Promise<Order>} Updated order
 *
 * @example
 * ```typescript
 * const released = await releaseOrderHold(order, {
 *   releaseNotes: 'Payment verified successfully',
 *   resumeProcessing: true
 * }, 'user-456');
 * ```
 */
export async function releaseOrderHold(
  order: Order,
  dto: ReleaseHoldDto,
  userId: string
): Promise<Order> {
  if (!order.currentHold) {
    throw new BadRequestException('Order is not on hold');
  }

  order.currentHold.releasedAt = new Date();
  order.currentHold.releasedBy = userId;
  order.currentHold.releaseNotes = dto.releaseNotes;

  // Determine next status
  const previousStatus = order.stateHistory
    .filter(t => t.toStatus !== OrderStatus.ON_HOLD)
    .pop()?.fromStatus || OrderStatus.PENDING;

  const stateTransition: OrderStateTransition = {
    transitionId: generateTransitionId(),
    orderId: order.orderId,
    fromStatus: OrderStatus.ON_HOLD,
    toStatus: dto.resumeProcessing ? OrderStatus.PROCESSING : previousStatus,
    timestamp: new Date(),
    triggeredBy: userId,
    triggeredBySystem: false,
    reason: dto.releaseNotes,
    validationsPassed: true,
    rollbackAvailable: false,
  };

  order.status = stateTransition.toStatus;
  order.stateHistory.push(stateTransition);

  // Archive the hold
  if (!order.metadata) order.metadata = {};
  if (!order.metadata.holdHistory) order.metadata.holdHistory = [];
  order.metadata.holdHistory.push(order.currentHold);
  order.currentHold = undefined;

  order.updatedAt = new Date();
  order.updatedBy = userId;

  return order;
}

/**
 * 24. Auto-releases expired holds.
 *
 * @param {Order[]} orders - Orders to check for expired holds
 * @returns {Promise<Order[]>} Auto-released orders
 *
 * @example
 * ```typescript
 * const released = await autoReleaseExpiredHolds(ordersOnHold);
 * ```
 */
export async function autoReleaseExpiredHolds(orders: Order[]): Promise<Order[]> {
  const now = new Date();
  const autoReleased: Order[] = [];

  for (const order of orders) {
    if (
      order.currentHold &&
      order.currentHold.autoRelease &&
      order.currentHold.expiresAt &&
      order.currentHold.expiresAt <= now
    ) {
      await releaseOrderHold(
        order,
        {
          releaseNotes: 'Auto-released due to expiration',
          resumeProcessing: true,
        },
        'system'
      );
      autoReleased.push(order);
    }
  }

  return autoReleased;
}

/**
 * 25. Extends hold duration.
 *
 * @param {OrderHold} hold - Hold to extend
 * @param {number} additionalMinutes - Minutes to add
 * @param {string} reason - Extension reason
 * @returns {Promise<OrderHold>} Updated hold
 *
 * @example
 * ```typescript
 * const extended = await extendHoldDuration(hold, 60, 'Awaiting additional documentation');
 * ```
 */
export async function extendHoldDuration(
  hold: OrderHold,
  additionalMinutes: number,
  reason: string
): Promise<OrderHold> {
  if (hold.releasedAt) {
    throw new BadRequestException('Hold has already been released');
  }

  if (!hold.expiresAt) {
    hold.expiresAt = new Date(Date.now() + additionalMinutes * 60000);
  } else {
    hold.expiresAt = new Date(hold.expiresAt.getTime() + additionalMinutes * 60000);
  }

  if (!hold.metadata) hold.metadata = {};
  if (!hold.metadata.extensions) hold.metadata.extensions = [];
  hold.metadata.extensions.push({
    extendedBy: additionalMinutes,
    reason,
    timestamp: new Date(),
  });

  return hold;
}

/**
 * 26. Gets all orders currently on hold.
 *
 * @param {Order[]} orders - All orders
 * @param {HoldReason} filterByReason - Optional reason filter
 * @returns {Order[]} Orders on hold
 *
 * @example
 * ```typescript
 * const onHold = getOrdersOnHold(allOrders, HoldReason.PAYMENT_VERIFICATION);
 * ```
 */
export function getOrdersOnHold(
  orders: Order[],
  filterByReason?: HoldReason
): Order[] {
  return orders.filter(order => {
    if (!order.currentHold) return false;
    if (filterByReason && order.currentHold.reason !== filterByReason) return false;
    return true;
  });
}

/**
 * 27. Sends hold notification to stakeholders.
 *
 * @param {Order} order - Order on hold
 * @param {OrderHold} hold - Hold details
 * @returns {object} Notification details
 *
 * @example
 * ```typescript
 * const notification = sendHoldNotification(order, hold);
 * ```
 */
export function sendHoldNotification(
  order: Order,
  hold: OrderHold
): {
  recipients: string[];
  subject: string;
  body: string;
  priority: string;
} {
  return {
    recipients: [order.customerId, ...hold.notificationsSent],
    subject: `Order ${order.orderNumber} - Currently On Hold`,
    body: `
Order ${order.orderNumber} has been placed on hold.

Reason: ${hold.reason}
Description: ${hold.description}
Hold placed: ${hold.placedAt.toLocaleString()}
${hold.expiresAt ? `Auto-release scheduled: ${hold.expiresAt.toLocaleString()}` : 'No auto-release scheduled'}

We will notify you once the hold is resolved and your order resumes processing.

If you have any questions, please contact our customer service team.

Thank you for your patience.
    `.trim(),
    priority: 'medium',
  };
}

/**
 * 28. Validates if order can be placed on hold.
 *
 * @param {Order} order - Order to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateHoldEligibility(order);
 * ```
 */
export function validateHoldEligibility(order: Order): {
  canHold: boolean;
  reason?: string;
} {
  if (order.currentHold) {
    return {
      canHold: false,
      reason: 'Order is already on hold',
    };
  }

  if (order.status === OrderStatus.CANCELLED) {
    return {
      canHold: false,
      reason: 'Cannot hold cancelled orders',
    };
  }

  if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.DELIVERED) {
    return {
      canHold: false,
      reason: 'Cannot hold completed or delivered orders',
    };
  }

  return { canHold: true };
}

// ============================================================================
// SECTION 5: ORDER LIFECYCLE & STATE MACHINE (Functions 29-35)
// ============================================================================

/**
 * 29. Transitions order to a new status.
 *
 * @param {Order} order - Order to transition
 * @param {TransitionStateDto} dto - Transition details
 * @param {string} userId - User triggering transition
 * @returns {Promise<Order>} Updated order
 *
 * @example
 * ```typescript
 * const transitioned = await transitionOrderStatus(order, {
 *   targetStatus: OrderStatus.PROCESSING,
 *   reason: 'Payment confirmed'
 * }, 'user-456');
 * ```
 */
export async function transitionOrderStatus(
  order: Order,
  dto: TransitionStateDto,
  userId: string
): Promise<Order> {
  const fromStatus = order.status;
  const toStatus = dto.targetStatus;

  // Validate transition
  if (!dto.skipValidations) {
    const validation = validateStateTransition(fromStatus, toStatus);
    if (!validation.valid) {
      throw new BadRequestException(`Invalid state transition: ${validation.reason}`);
    }
  }

  const transition: OrderStateTransition = {
    transitionId: generateTransitionId(),
    orderId: order.orderId,
    fromStatus,
    toStatus,
    timestamp: new Date(),
    triggeredBy: userId,
    triggeredBySystem: false,
    reason: dto.reason,
    validationsPassed: true,
    rollbackAvailable: canRollbackTransition(fromStatus, toStatus),
  };

  order.status = toStatus;
  order.stateHistory.push(transition);
  order.updatedAt = new Date();
  order.updatedBy = userId;

  return order;
}

/**
 * 30. Validates if a state transition is allowed.
 *
 * @param {OrderStatus} fromStatus - Current status
 * @param {OrderStatus} toStatus - Target status
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateStateTransition(
 *   OrderStatus.PENDING,
 *   OrderStatus.PROCESSING
 * );
 * ```
 */
export function validateStateTransition(
  fromStatus: OrderStatus,
  toStatus: OrderStatus
): {
  valid: boolean;
  reason?: string;
} {
  // Define allowed transitions
  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.DRAFT]: [OrderStatus.PENDING, OrderStatus.CANCELLED],
    [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.ON_HOLD, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.ON_HOLD, OrderStatus.CANCELLED],
    [OrderStatus.PROCESSING]: [
      OrderStatus.PARTIALLY_SHIPPED,
      OrderStatus.SHIPPED,
      OrderStatus.ON_HOLD,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.ON_HOLD]: [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.PROCESSING,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.PARTIALLY_SHIPPED]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.REFUNDED],
    [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED, OrderStatus.REFUNDED],
    [OrderStatus.COMPLETED]: [OrderStatus.REFUNDED, OrderStatus.ARCHIVED],
    [OrderStatus.CANCELLED]: [OrderStatus.ARCHIVED],
    [OrderStatus.REFUNDED]: [OrderStatus.ARCHIVED],
    [OrderStatus.ARCHIVED]: [],
  };

  if (!allowedTransitions[fromStatus]) {
    return {
      valid: false,
      reason: `Unknown source status: ${fromStatus}`,
    };
  }

  if (!allowedTransitions[fromStatus].includes(toStatus)) {
    return {
      valid: false,
      reason: `Cannot transition from ${fromStatus} to ${toStatus}`,
    };
  }

  return { valid: true };
}

/**
 * 31. Gets order lifecycle timeline.
 *
 * @param {Order} order - Order to get timeline for
 * @returns {object[]} Timeline events
 *
 * @example
 * ```typescript
 * const timeline = getOrderLifecycleTimeline(order);
 * ```
 */
export function getOrderLifecycleTimeline(order: Order): Array<{
  timestamp: Date;
  event: string;
  status?: OrderStatus;
  actor: string;
  description: string;
}> {
  const timeline: Array<{
    timestamp: Date;
    event: string;
    status?: OrderStatus;
    actor: string;
    description: string;
  }> = [];

  // Order creation
  timeline.push({
    timestamp: order.createdAt,
    event: 'ORDER_CREATED',
    status: OrderStatus.DRAFT,
    actor: order.createdBy,
    description: 'Order created',
  });

  // State transitions
  for (const transition of order.stateHistory) {
    timeline.push({
      timestamp: transition.timestamp,
      event: 'STATUS_CHANGE',
      status: transition.toStatus,
      actor: transition.triggeredBy,
      description: `Status changed from ${transition.fromStatus} to ${transition.toStatus}`,
    });
  }

  // Modifications
  for (const modification of order.modifications) {
    timeline.push({
      timestamp: modification.timestamp,
      event: 'MODIFICATION',
      actor: modification.modifiedBy,
      description: `${modification.type}: ${modification.reason || 'No reason provided'}`,
    });
  }

  // Sort by timestamp
  timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return timeline;
}

/**
 * 32. Checks if order can be rolled back to previous state.
 *
 * @param {Order} order - Order to check
 * @returns {object} Rollback information
 *
 * @example
 * ```typescript
 * const rollback = canRollbackOrder(order);
 * if (rollback.canRollback) {
 *   console.log(`Can rollback to: ${rollback.targetStatus}`);
 * }
 * ```
 */
export function canRollbackOrder(order: Order): {
  canRollback: boolean;
  targetStatus?: OrderStatus;
  lastTransition?: OrderStateTransition;
  reason?: string;
} {
  if (order.stateHistory.length < 2) {
    return {
      canRollback: false,
      reason: 'No previous state to rollback to',
    };
  }

  const lastTransition = order.stateHistory[order.stateHistory.length - 1];

  if (!lastTransition.rollbackAvailable) {
    return {
      canRollback: false,
      lastTransition,
      reason: 'Last transition does not support rollback',
    };
  }

  return {
    canRollback: true,
    targetStatus: lastTransition.fromStatus,
    lastTransition,
  };
}

/**
 * 33. Performs rollback to previous order state.
 *
 * @param {Order} order - Order to rollback
 * @param {string} reason - Rollback reason
 * @param {string} userId - User performing rollback
 * @returns {Promise<Order>} Rolled back order
 *
 * @example
 * ```typescript
 * const rolledBack = await rollbackOrderState(
 *   order,
 *   'Incorrect status change',
 *   'user-456'
 * );
 * ```
 */
export async function rollbackOrderState(
  order: Order,
  reason: string,
  userId: string
): Promise<Order> {
  const rollbackInfo = canRollbackOrder(order);

  if (!rollbackInfo.canRollback) {
    throw new BadRequestException(`Cannot rollback: ${rollbackInfo.reason}`);
  }

  const transition: OrderStateTransition = {
    transitionId: generateTransitionId(),
    orderId: order.orderId,
    fromStatus: order.status,
    toStatus: rollbackInfo.targetStatus!,
    timestamp: new Date(),
    triggeredBy: userId,
    triggeredBySystem: false,
    reason: `Rollback: ${reason}`,
    validationsPassed: true,
    rollbackAvailable: false,
  };

  order.status = rollbackInfo.targetStatus!;
  order.stateHistory.push(transition);
  order.updatedAt = new Date();
  order.updatedBy = userId;

  return order;
}

/**
 * 34. Gets current lifecycle stage details.
 *
 * @param {Order} order - Order to analyze
 * @returns {object} Lifecycle stage information
 *
 * @example
 * ```typescript
 * const stage = getCurrentLifecycleStage(order);
 * console.log(`Current stage: ${stage.stageName}`);
 * ```
 */
export function getCurrentLifecycleStage(order: Order): {
  stageName: string;
  stageNumber: number;
  totalStages: number;
  progressPercentage: number;
  nextStage?: string;
  estimatedCompletionDate?: Date;
} {
  const stageMap: Record<OrderStatus, { name: string; stage: number }> = {
    [OrderStatus.DRAFT]: { name: 'Draft', stage: 1 },
    [OrderStatus.PENDING]: { name: 'Pending Confirmation', stage: 2 },
    [OrderStatus.CONFIRMED]: { name: 'Confirmed', stage: 3 },
    [OrderStatus.PROCESSING]: { name: 'Processing', stage: 4 },
    [OrderStatus.ON_HOLD]: { name: 'On Hold', stage: 4 },
    [OrderStatus.PARTIALLY_SHIPPED]: { name: 'Partially Shipped', stage: 5 },
    [OrderStatus.SHIPPED]: { name: 'Shipped', stage: 6 },
    [OrderStatus.DELIVERED]: { name: 'Delivered', stage: 7 },
    [OrderStatus.COMPLETED]: { name: 'Completed', stage: 8 },
    [OrderStatus.CANCELLED]: { name: 'Cancelled', stage: 0 },
    [OrderStatus.REFUNDED]: { name: 'Refunded', stage: 0 },
    [OrderStatus.ARCHIVED]: { name: 'Archived', stage: 0 },
  };

  const currentStage = stageMap[order.status];
  const totalStages = 8;
  const progressPercentage = (currentStage.stage / totalStages) * 100;

  return {
    stageName: currentStage.name,
    stageNumber: currentStage.stage,
    totalStages,
    progressPercentage,
  };
}

/**
 * 35. Generates state machine diagram for order.
 *
 * @param {Order} order - Order to generate diagram for
 * @returns {string} Mermaid diagram syntax
 *
 * @example
 * ```typescript
 * const diagram = generateStateMachineDiagram(order);
 * console.log(diagram);
 * ```
 */
export function generateStateMachineDiagram(order: Order): string {
  let diagram = 'stateDiagram-v2\n';
  diagram += '    [*] --> DRAFT\n';

  const transitions = order.stateHistory;
  const visited = new Set<string>();

  for (const transition of transitions) {
    const edge = `${transition.fromStatus} --> ${transition.toStatus}`;
    if (!visited.has(edge)) {
      diagram += `    ${edge}\n`;
      visited.add(edge);
    }
  }

  if (order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.CANCELLED) {
    diagram += `    ${order.status} --> [*]\n`;
  }

  return diagram;
}

// ============================================================================
// SECTION 6: ORDER HISTORY & ARCHIVAL (Functions 36-42)
// ============================================================================

/**
 * 36. Creates audit entry for order action.
 *
 * @param {Order} order - Order being audited
 * @param {string} action - Action performed
 * @param {string} userId - User performing action
 * @param {any} changes - Changes made
 * @returns {Promise<OrderAuditEntry>} Audit entry
 *
 * @example
 * ```typescript
 * const audit = await createOrderAuditEntry(
 *   order,
 *   'UPDATE_QUANTITY',
 *   'user-456',
 *   { field: 'quantity', oldValue: 1, newValue: 2 }
 * );
 * ```
 */
export async function createOrderAuditEntry(
  order: Order,
  action: string,
  userId: string,
  changes: Array<{ field: string; oldValue: any; newValue: any }>
): Promise<OrderAuditEntry> {
  const auditEntry: OrderAuditEntry = {
    auditId: generateAuditId(),
    orderId: order.orderId,
    timestamp: new Date(),
    userId,
    userName: 'User Name', // Would come from user service
    userRole: 'role', // Would come from context
    action,
    entityType: 'ORDER',
    entityId: order.orderId,
    changes,
    metadata: {
      orderNumber: order.orderNumber,
      orderStatus: order.status,
    },
  };

  return auditEntry;
}

/**
 * 37. Gets complete audit trail for an order.
 *
 * @param {Order} order - Order to get audit trail for
 * @param {Date} fromDate - Optional start date
 * @param {Date} toDate - Optional end date
 * @returns {Promise<OrderAuditEntry[]>} Audit entries
 *
 * @example
 * ```typescript
 * const trail = await getOrderAuditTrail(order, startDate, endDate);
 * ```
 */
export async function getOrderAuditTrail(
  order: Order,
  fromDate?: Date,
  toDate?: Date
): Promise<OrderAuditEntry[]> {
  // This would typically query a database
  // For now, we'll construct from order history

  const auditEntries: OrderAuditEntry[] = [];

  // Add state transitions
  for (const transition of order.stateHistory) {
    if (fromDate && transition.timestamp < fromDate) continue;
    if (toDate && transition.timestamp > toDate) continue;

    auditEntries.push({
      auditId: generateAuditId(),
      orderId: order.orderId,
      timestamp: transition.timestamp,
      userId: transition.triggeredBy,
      userName: transition.triggeredBy,
      userRole: 'unknown',
      action: 'STATE_TRANSITION',
      entityType: 'ORDER',
      entityId: order.orderId,
      changes: [
        {
          field: 'status',
          oldValue: transition.fromStatus,
          newValue: transition.toStatus,
        },
      ],
    });
  }

  // Add modifications
  for (const modification of order.modifications) {
    if (fromDate && modification.timestamp < fromDate) continue;
    if (toDate && modification.timestamp > toDate) continue;

    auditEntries.push({
      auditId: generateAuditId(),
      orderId: order.orderId,
      timestamp: modification.timestamp,
      userId: modification.modifiedBy,
      userName: modification.modifiedBy,
      userRole: modification.modifiedByRole,
      action: modification.type,
      entityType: 'ORDER',
      entityId: order.orderId,
      changes: [
        {
          field: modification.type,
          oldValue: modification.previousValue,
          newValue: modification.newValue,
        },
      ],
    });
  }

  return auditEntries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

/**
 * 38. Creates version snapshot of order.
 *
 * @param {Order} order - Order to snapshot
 * @param {string} changesSummary - Summary of changes
 * @param {string} userId - User creating version
 * @returns {Promise<OrderVersion>} Version record
 *
 * @example
 * ```typescript
 * const version = await createOrderVersion(
 *   order,
 *   'Updated quantities and delivery date',
 *   'user-456'
 * );
 * ```
 */
export async function createOrderVersion(
  order: Order,
  changesSummary: string,
  userId: string
): Promise<OrderVersion> {
  const version: OrderVersion = {
    versionId: generateVersionId(),
    orderId: order.orderId,
    versionNumber: order.version,
    createdAt: new Date(),
    createdBy: userId,
    snapshot: JSON.parse(JSON.stringify(order)), // Deep clone
    changesSummary,
    restorable: true,
  };

  return version;
}

/**
 * 39. Restores order from a specific version.
 *
 * @param {OrderVersion} version - Version to restore from
 * @param {string} userId - User performing restoration
 * @returns {Promise<Order>} Restored order
 *
 * @example
 * ```typescript
 * const restored = await restoreOrderVersion(version, 'user-456');
 * ```
 */
export async function restoreOrderVersion(
  version: OrderVersion,
  userId: string
): Promise<Order> {
  if (!version.restorable) {
    throw new BadRequestException('This version cannot be restored');
  }

  const restoredOrder: Order = JSON.parse(JSON.stringify(version.snapshot));

  // Update metadata
  restoredOrder.updatedAt = new Date();
  restoredOrder.updatedBy = userId;
  restoredOrder.metadata = {
    ...restoredOrder.metadata,
    restoredFrom: {
      versionId: version.versionId,
      versionNumber: version.versionNumber,
      restoredAt: new Date(),
      restoredBy: userId,
    },
  };

  return restoredOrder;
}

/**
 * 40. Clones an existing order.
 *
 * @param {Order} order - Order to clone
 * @param {CloneOrderDto} dto - Clone options
 * @param {string} userId - User cloning order
 * @returns {Promise<Order>} Cloned order
 *
 * @example
 * ```typescript
 * const clone = await cloneOrder(originalOrder, {
 *   resetToDraft: true,
 *   includeModifications: false
 * }, 'user-456');
 * ```
 */
export async function cloneOrder(
  order: Order,
  dto: CloneOrderDto,
  userId: string
): Promise<Order> {
  const clonedOrder: Order = JSON.parse(JSON.stringify(order));

  // Generate new IDs
  clonedOrder.orderId = generateOrderId();
  clonedOrder.orderNumber = generateOrderNumber();
  clonedOrder.createdAt = new Date();
  clonedOrder.updatedAt = new Date();
  clonedOrder.createdBy = userId;
  clonedOrder.updatedBy = userId;

  // Update customer if specified
  if (dto.newCustomerId) {
    clonedOrder.customerId = dto.newCustomerId;
  }

  // Reset status if requested
  if (dto.resetToDraft) {
    clonedOrder.status = OrderStatus.DRAFT;
    clonedOrder.stateHistory = [];
  }

  // Clear modifications if not included
  if (!dto.includeModifications) {
    clonedOrder.modifications = [];
    clonedOrder.amendments = [];
  }

  // Reset version
  clonedOrder.version = 1;

  // Clear current hold
  clonedOrder.currentHold = undefined;

  // Add clone metadata
  clonedOrder.metadata = {
    ...clonedOrder.metadata,
    clonedFrom: {
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      clonedAt: new Date(),
      clonedBy: userId,
    },
    tags: dto.tags,
  };

  return clonedOrder;
}

/**
 * 41. Archives an order.
 *
 * @param {Order} order - Order to archive
 * @param {ArchiveOrderDto} dto - Archive options
 * @param {string} userId - User archiving
 * @returns {Promise<Order>} Archived order
 *
 * @example
 * ```typescript
 * const archived = await archiveOrder(order, {
 *   reason: 'Order completed over 90 days ago',
 *   createBackup: true,
 *   retentionDays: 2555
 * }, 'user-456');
 * ```
 */
export async function archiveOrder(
  order: Order,
  dto: ArchiveOrderDto,
  userId: string
): Promise<Order> {
  if (order.status === OrderStatus.ARCHIVED) {
    throw new BadRequestException('Order is already archived');
  }

  // Only archive completed, cancelled, or refunded orders
  const archivableStatuses = [
    OrderStatus.COMPLETED,
    OrderStatus.CANCELLED,
    OrderStatus.REFUNDED,
  ];

  if (!archivableStatuses.includes(order.status)) {
    throw new BadRequestException(
      'Only completed, cancelled, or refunded orders can be archived'
    );
  }

  const previousStatus = order.status;

  const transition: OrderStateTransition = {
    transitionId: generateTransitionId(),
    orderId: order.orderId,
    fromStatus: previousStatus,
    toStatus: OrderStatus.ARCHIVED,
    timestamp: new Date(),
    triggeredBy: userId,
    triggeredBySystem: false,
    reason: dto.reason,
    validationsPassed: true,
    rollbackAvailable: false,
  };

  order.status = OrderStatus.ARCHIVED;
  order.stateHistory.push(transition);
  order.updatedAt = new Date();
  order.updatedBy = userId;

  order.metadata = {
    ...order.metadata,
    archive: {
      archivedAt: new Date(),
      archivedBy: userId,
      reason: dto.reason,
      retentionDays: dto.retentionDays || 2555, // 7 years default
      createBackup: dto.createBackup,
    },
  };

  return order;
}

/**
 * 42. Generates comprehensive order modification report.
 *
 * @param {Order} order - Order to generate report for
 * @returns {object} Modification report
 *
 * @example
 * ```typescript
 * const report = generateModificationReport(order);
 * console.log(`Total modifications: ${report.totalModifications}`);
 * ```
 */
export function generateModificationReport(order: Order): {
  orderId: string;
  orderNumber: string;
  totalModifications: number;
  modificationsByType: Record<OrderModificationType, number>;
  totalAmendments: number;
  pendingApprovals: number;
  priceImpact: number;
  lastModifiedAt: Date;
  lastModifiedBy: string;
  modificationTimeline: Array<{
    date: Date;
    type: OrderModificationType;
    description: string;
  }>;
} {
  const modificationsByType: Record<OrderModificationType, number> = {} as any;

  for (const mod of order.modifications) {
    modificationsByType[mod.type] = (modificationsByType[mod.type] || 0) + 1;
  }

  const pendingApprovals = order.modifications.filter(
    m => m.approvalStatus === ChangeApprovalStatus.PENDING
  ).length;

  const priceImpact = order.modifications
    .filter(m => m.type === OrderModificationType.PRICE_ADJUSTMENT)
    .reduce((sum, m) => sum + (m.newValue - m.previousValue), 0);

  const modificationTimeline = order.modifications
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .map(m => ({
      date: m.timestamp,
      type: m.type,
      description: m.reason || 'No description',
    }));

  return {
    orderId: order.orderId,
    orderNumber: order.orderNumber,
    totalModifications: order.modifications.length,
    modificationsByType,
    totalAmendments: order.amendments.length,
    pendingApprovals,
    priceImpact,
    lastModifiedAt: order.updatedAt,
    lastModifiedBy: order.updatedBy,
    modificationTimeline,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Recalculates all order totals after modifications.
 */
function recalculateOrderTotals(order: Order): Order {
  order.subtotal = order.lineItems.reduce((sum, item) => sum + item.subtotal, 0);
  order.discountTotal = order.lineItems.reduce((sum, item) => sum + item.discountAmount, 0);
  order.taxTotal = order.lineItems.reduce((sum, item) => sum + item.taxAmount, 0);
  order.total = order.subtotal - order.discountTotal + order.taxTotal + (order.shippingCost || 0);
  return order;
}

/**
 * Calculates tax for a line item.
 */
function calculateLineTax(quantity: number, unitPrice: number, taxRate: number = 0.08): number {
  return Number(((quantity * unitPrice) * taxRate).toFixed(2));
}

/**
 * Calculates total impact of amendments.
 */
function calculateAmendmentImpact(modifications: Partial<OrderModification>[]): {
  priceDelta: number;
  quantityDelta: number;
  taxDelta: number;
} {
  let priceDelta = 0;
  let quantityDelta = 0;
  let taxDelta = 0;

  for (const mod of modifications) {
    switch (mod.type) {
      case OrderModificationType.PRICE_ADJUSTMENT:
        priceDelta += (mod.newValue - mod.previousValue);
        break;
      case OrderModificationType.QUANTITY_CHANGE:
        quantityDelta += (mod.newValue - mod.previousValue);
        break;
      case OrderModificationType.TAX_ADJUSTMENT:
        taxDelta += (mod.newValue - mod.previousValue);
        break;
    }
  }

  return { priceDelta, quantityDelta, taxDelta };
}

/**
 * Determines if a state transition can be rolled back.
 */
function canRollbackTransition(fromStatus: OrderStatus, toStatus: OrderStatus): boolean {
  // Cannot rollback to/from terminal states
  const terminalStates = [
    OrderStatus.COMPLETED,
    OrderStatus.CANCELLED,
    OrderStatus.REFUNDED,
    OrderStatus.ARCHIVED,
  ];

  return !terminalStates.includes(toStatus);
}

/**
 * Generates unique modification ID.
 */
function generateModificationId(): string {
  return `MOD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates unique amendment ID.
 */
function generateAmendmentId(): string {
  return `AMD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates amendment number.
 */
function generateAmendmentNumber(orderNumber: string, amendmentCount: number): string {
  return `${orderNumber}-AMD-${String(amendmentCount).padStart(3, '0')}`;
}

/**
 * Generates unique line item ID.
 */
function generateLineItemId(): string {
  return `LINE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates unique cancellation ID.
 */
function generateCancellationId(): string {
  return `CANC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates unique refund ID.
 */
function generateRefundId(): string {
  return `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates unique hold ID.
 */
function generateHoldId(): string {
  return `HOLD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates unique transition ID.
 */
function generateTransitionId(): string {
  return `TRANS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates unique audit ID.
 */
function generateAuditId(): string {
  return `AUDIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates unique version ID.
 */
function generateVersionId(): string {
  return `VER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates unique order ID.
 */
function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generates unique order number.
 */
function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = date.getTime().toString().slice(-6);
  return `ORD-${dateStr}-${timeStr}`;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Order Modifications
  modifyLineItemQuantity,
  adjustLineItemPrice,
  changeDeliveryDate,
  changeOrderCustomer,
  addLineItemToOrder,
  removeLineItemFromOrder,
  updateOrderNotes,

  // Order Amendments & Change Orders
  createOrderAmendment,
  approveAmendment,
  rejectAmendment,
  getCustomerApproval,
  applyAmendmentToOrder,
  calculateChangeImpact,
  generateChangeNotification,

  // Order Cancellations
  cancelOrder,
  partialCancelOrder,
  processRefund,
  calculateRestockingFee,
  validateCancellationEligibility,
  sendCancellationNotification,
  restockCancelledItems,

  // Order Holds & Releases
  placeOrderOnHold,
  releaseOrderHold,
  autoReleaseExpiredHolds,
  extendHoldDuration,
  getOrdersOnHold,
  sendHoldNotification,
  validateHoldEligibility,

  // Order Lifecycle & State Machine
  transitionOrderStatus,
  validateStateTransition,
  getOrderLifecycleTimeline,
  canRollbackOrder,
  rollbackOrderState,
  getCurrentLifecycleStage,
  generateStateMachineDiagram,

  // Order History & Archival
  createOrderAuditEntry,
  getOrderAuditTrail,
  createOrderVersion,
  restoreOrderVersion,
  cloneOrder,
  archiveOrder,
  generateModificationReport,
};
