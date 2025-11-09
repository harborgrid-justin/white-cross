/**
 * LOC: ORD-DSC-001
 * File: /reuse/order/discount-promotion-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize-typescript
 *   - class-validator
 *   - class-transformer
 *
 * DOWNSTREAM (imported by):
 *   - Order controllers
 *   - Promotion services
 *   - Discount processors
 *   - Marketing campaign modules
 */

/**
 * File: /reuse/order/discount-promotion-kit.ts
 * Locator: WC-ORD-DSCPRO-001
 * Purpose: Discount & Promotion Management - Coupons, promos, discounts
 *
 * Upstream: Independent utility module for discount and promotion operations
 * Downstream: ../backend/order/*, Promotion modules, Marketing services, Campaign services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 40 utility functions for discounts, coupons, promotions, campaigns, stacking rules
 *
 * LLM Context: Enterprise-grade discount and promotion management to compete with Oracle, SAP, and Shopify Plus.
 * Provides comprehensive discount code generation/validation, coupon management, promotion campaigns, discount stacking,
 * BOGO deals, volume discounts, tiered promotions, time-limited offers, customer segment targeting, product category
 * promotions, minimum purchase requirements, exclusion rules, loyalty rewards, referral bonuses, and flash sales.
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
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  IsArray,
  IsBoolean,
  Min,
  Max,
  ValidateNested,
  IsDate,
  Matches,
  Length,
  MinLength,
  MaxLength,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Op, WhereOptions } from 'sequelize';

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * Discount types
 */
export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  BUY_X_GET_Y = 'BUY_X_GET_Y',
  VOLUME_DISCOUNT = 'VOLUME_DISCOUNT',
  TIERED = 'TIERED',
  FREE_SHIPPING = 'FREE_SHIPPING',
  BUNDLE = 'BUNDLE',
  LOYALTY_POINTS = 'LOYALTY_POINTS',
}

/**
 * Promotion types
 */
export enum PromotionType {
  COUPON_CODE = 'COUPON_CODE',
  AUTOMATIC = 'AUTOMATIC',
  CART_RULE = 'CART_RULE',
  CATALOG_RULE = 'CATALOG_RULE',
  FLASH_SALE = 'FLASH_SALE',
  SEASONAL = 'SEASONAL',
  CLEARANCE = 'CLEARANCE',
  REFERRAL = 'REFERRAL',
}

/**
 * Promotion status
 */
export enum PromotionStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

/**
 * Coupon code patterns
 */
export enum CouponCodePattern {
  ALPHANUMERIC = 'ALPHANUMERIC',
  NUMERIC = 'NUMERIC',
  ALPHABETIC = 'ALPHABETIC',
  CUSTOM = 'CUSTOM',
}

/**
 * Customer eligibility criteria
 */
export enum CustomerEligibility {
  ALL_CUSTOMERS = 'ALL_CUSTOMERS',
  NEW_CUSTOMERS = 'NEW_CUSTOMERS',
  EXISTING_CUSTOMERS = 'EXISTING_CUSTOMERS',
  VIP_TIER = 'VIP_TIER',
  LOYALTY_MEMBERS = 'LOYALTY_MEMBERS',
  EMAIL_SUBSCRIBERS = 'EMAIL_SUBSCRIBERS',
  SPECIFIC_SEGMENTS = 'SPECIFIC_SEGMENTS',
}

/**
 * Stacking rule types
 */
export enum StackingRuleType {
  NO_STACKING = 'NO_STACKING',
  BEST_DISCOUNT = 'BEST_DISCOUNT',
  ADDITIVE = 'ADDITIVE',
  SEQUENTIAL = 'SEQUENTIAL',
  EXCLUSIVE_GROUPS = 'EXCLUSIVE_GROUPS',
}

/**
 * Application scope
 */
export enum ApplicationScope {
  ORDER_LEVEL = 'ORDER_LEVEL',
  LINE_ITEM = 'LINE_ITEM',
  SHIPPING = 'SHIPPING',
  CATEGORY = 'CATEGORY',
  PRODUCT = 'PRODUCT',
}

// ============================================================================
// DTOS
// ============================================================================

/**
 * Create discount DTO
 */
export class CreateDiscountDto {
  @ApiProperty({ description: 'Discount name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({ description: 'Discount description' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ enum: DiscountType, description: 'Discount type' })
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @ApiProperty({ description: 'Discount value (percentage or fixed amount)', example: 15 })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiProperty({ description: 'Maximum discount amount (for percentage discounts)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number;

  @ApiProperty({ enum: ApplicationScope, description: 'Application scope' })
  @IsEnum(ApplicationScope)
  scope: ApplicationScope;

  @ApiProperty({ description: 'Start date', type: String })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date', type: String })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Minimum purchase amount', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPurchaseAmount?: number;

  @ApiProperty({ description: 'Minimum quantity', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minQuantity?: number;

  @ApiProperty({ description: 'Applicable product IDs', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  applicableProductIds?: string[];

  @ApiProperty({ description: 'Applicable category IDs', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  applicableCategoryIds?: string[];

  @ApiProperty({ description: 'Excluded product IDs', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  excludedProductIds?: string[];

  @ApiProperty({ description: 'Priority for stacking (higher = applied first)', example: 10 })
  @IsNumber()
  @Min(1)
  @Max(100)
  priority: number;
}

/**
 * Create promotion DTO
 */
export class CreatePromotionDto {
  @ApiProperty({ description: 'Promotion name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({ description: 'Internal code for tracking' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Matches(/^[A-Z0-9_-]+$/)
  internalCode: string;

  @ApiProperty({ enum: PromotionType, description: 'Promotion type' })
  @IsEnum(PromotionType)
  promotionType: PromotionType;

  @ApiProperty({ description: 'Promotion description' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ description: 'Start date', type: String })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date', type: String })
  @IsDateString()
  endDate: string;

  @ApiProperty({ enum: CustomerEligibility, description: 'Customer eligibility' })
  @IsEnum(CustomerEligibility)
  customerEligibility: CustomerEligibility;

  @ApiProperty({ description: 'Customer segment IDs', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  customerSegmentIds?: string[];

  @ApiProperty({ description: 'Usage limit per customer', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimitPerCustomer?: number;

  @ApiProperty({ description: 'Total usage limit', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  totalUsageLimit?: number;

  @ApiProperty({ description: 'Discount IDs included in promotion', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  discountIds: string[];

  @ApiProperty({ enum: StackingRuleType, description: 'Stacking rule' })
  @IsEnum(StackingRuleType)
  stackingRule: StackingRuleType;

  @ApiProperty({ description: 'Requires coupon code' })
  @IsBoolean()
  requiresCouponCode: boolean;
}

/**
 * Generate coupon codes DTO
 */
export class GenerateCouponCodesDto {
  @ApiProperty({ description: 'Promotion ID' })
  @IsUUID('4')
  promotionId: string;

  @ApiProperty({ description: 'Number of codes to generate' })
  @IsNumber()
  @Min(1)
  @Max(10000)
  quantity: number;

  @ApiProperty({ enum: CouponCodePattern, description: 'Code pattern' })
  @IsEnum(CouponCodePattern)
  pattern: CouponCodePattern;

  @ApiProperty({ description: 'Code prefix', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  prefix?: string;

  @ApiProperty({ description: 'Code length (excluding prefix)', example: 8 })
  @IsNumber()
  @Min(4)
  @Max(20)
  codeLength: number;

  @ApiProperty({ description: 'Usage limit per code', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimitPerCode?: number;

  @ApiProperty({ description: 'Expiration date', required: false, type: String })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}

/**
 * Validate coupon DTO
 */
export class ValidateCouponDto {
  @ApiProperty({ description: 'Coupon code' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: 'Customer ID' })
  @IsUUID('4')
  customerId: string;

  @ApiProperty({ description: 'Cart total amount' })
  @IsNumber()
  @Min(0)
  cartTotal: number;

  @ApiProperty({ description: 'Cart items', type: 'array' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  cartItems: CartItemDto[];
}

/**
 * Cart item DTO
 */
export class CartItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID('4')
  productId: string;

  @ApiProperty({ description: 'Category ID' })
  @IsOptional()
  @IsUUID('4')
  categoryId?: string;

  @ApiProperty({ description: 'Quantity' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Unit price' })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ description: 'Line total' })
  @IsNumber()
  @Min(0)
  lineTotal: number;
}

/**
 * BOGO configuration DTO
 */
export class BogoConfigDto {
  @ApiProperty({ description: 'Buy quantity' })
  @IsNumber()
  @Min(1)
  buyQuantity: number;

  @ApiProperty({ description: 'Get quantity' })
  @IsNumber()
  @Min(1)
  getQuantity: number;

  @ApiProperty({ description: 'Discount on get items (percentage)', example: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  getItemsDiscountPercentage: number;

  @ApiProperty({ description: 'Same product required' })
  @IsBoolean()
  sameProductRequired: boolean;

  @ApiProperty({ description: 'Get product IDs (if different products allowed)', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  getProductIds?: string[];

  @ApiProperty({ description: 'Maximum applications per order', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxApplications?: number;
}

/**
 * Volume discount tier DTO
 */
export class VolumeDiscountTierDto {
  @ApiProperty({ description: 'Minimum quantity' })
  @IsNumber()
  @Min(1)
  minQuantity: number;

  @ApiProperty({ description: 'Maximum quantity (null for unlimited)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxQuantity?: number;

  @ApiProperty({ description: 'Discount percentage', example: 10 })
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage: number;

  @ApiProperty({ description: 'Fixed discount amount (alternative to percentage)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fixedDiscountAmount?: number;
}

/**
 * Tiered promotion DTO
 */
export class TieredPromotionDto {
  @ApiProperty({ description: 'Promotion name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Tier definitions', type: [VolumeDiscountTierDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VolumeDiscountTierDto)
  tiers: VolumeDiscountTierDto[];

  @ApiProperty({ description: 'Based on quantity or amount' })
  @IsEnum(['QUANTITY', 'AMOUNT'])
  basedOn: 'QUANTITY' | 'AMOUNT';

  @ApiProperty({ description: 'Applicable product IDs', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  applicableProductIds?: string[];
}

/**
 * Apply discount DTO
 */
export class ApplyDiscountDto {
  @ApiProperty({ description: 'Order ID' })
  @IsUUID('4')
  orderId: string;

  @ApiProperty({ description: 'Discount IDs to apply', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  discountIds: string[];

  @ApiProperty({ description: 'Coupon codes to apply', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  couponCodes?: string[];

  @ApiProperty({ description: 'Customer ID' })
  @IsUUID('4')
  customerId: string;
}

/**
 * Customer segment promotion DTO
 */
export class CustomerSegmentPromotionDto {
  @ApiProperty({ description: 'Segment name' })
  @IsNotEmpty()
  @IsString()
  segmentName: string;

  @ApiProperty({ description: 'Segment criteria' })
  @IsNotEmpty()
  @IsString()
  criteria: string;

  @ApiProperty({ description: 'Discount percentage', example: 15 })
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage: number;

  @ApiProperty({ description: 'Minimum purchase amount', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPurchaseAmount?: number;

  @ApiProperty({ description: 'Valid from', type: String })
  @IsDateString()
  validFrom: string;

  @ApiProperty({ description: 'Valid to', type: String })
  @IsDateString()
  validTo: string;
}

/**
 * Flash sale DTO
 */
export class FlashSaleDto {
  @ApiProperty({ description: 'Sale name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Product IDs on sale', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  productIds: string[];

  @ApiProperty({ description: 'Discount percentage', example: 50 })
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage: number;

  @ApiProperty({ description: 'Start time', type: String })
  @IsDateString()
  startTime: string;

  @ApiProperty({ description: 'End time', type: String })
  @IsDateString()
  endTime: string;

  @ApiProperty({ description: 'Stock limit per product', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  stockLimit?: number;

  @ApiProperty({ description: 'Per customer limit', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  perCustomerLimit?: number;
}

/**
 * Exclusion rule DTO
 */
export class ExclusionRuleDto {
  @ApiProperty({ description: 'Promotion ID' })
  @IsUUID('4')
  promotionId: string;

  @ApiProperty({ description: 'Excluded product IDs', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  excludedProductIds?: string[];

  @ApiProperty({ description: 'Excluded category IDs', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  excludedCategoryIds?: string[];

  @ApiProperty({ description: 'Excluded customer IDs', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  excludedCustomerIds?: string[];

  @ApiProperty({ description: 'Excluded on sale items' })
  @IsBoolean()
  excludeSaleItems: boolean;

  @ApiProperty({ description: 'Excluded clearance items' })
  @IsBoolean()
  excludeClearanceItems: boolean;
}

/**
 * Discount calculation result
 */
export class DiscountCalculationResult {
  @ApiProperty({ description: 'Original total' })
  originalTotal: number;

  @ApiProperty({ description: 'Discount amount' })
  discountAmount: number;

  @ApiProperty({ description: 'Final total' })
  finalTotal: number;

  @ApiProperty({ description: 'Applied discount details', type: 'array' })
  appliedDiscounts: AppliedDiscountDetail[];

  @ApiProperty({ description: 'Total savings' })
  totalSavings: number;
}

/**
 * Applied discount detail
 */
export class AppliedDiscountDetail {
  @ApiProperty({ description: 'Discount ID' })
  discountId: string;

  @ApiProperty({ description: 'Discount name' })
  discountName: string;

  @ApiProperty({ description: 'Discount amount' })
  amount: number;

  @ApiProperty({ description: 'Applied at scope' })
  scope: ApplicationScope;

  @ApiProperty({ description: 'Coupon code used', required: false })
  couponCode?: string;
}

// ============================================================================
// MODELS
// ============================================================================

@Table({ tableName: 'discounts', paranoid: true })
export class Discount extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @Column({ type: DataType.STRING(200), allowNull: false })
  @Index
  name: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.ENUM(...Object.values(DiscountType)), allowNull: false })
  discountType: DiscountType;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  value: number;

  @Column({ type: DataType.DECIMAL(10, 2) })
  maxDiscountAmount: number;

  @Column({ type: DataType.ENUM(...Object.values(ApplicationScope)), allowNull: false })
  scope: ApplicationScope;

  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  startDate: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  endDate: Date;

  @Column({ type: DataType.DECIMAL(10, 2) })
  minPurchaseAmount: number;

  @Column({ type: DataType.INTEGER })
  minQuantity: number;

  @Column({ type: DataType.JSONB })
  applicableProductIds: string[];

  @Column({ type: DataType.JSONB })
  applicableCategoryIds: string[];

  @Column({ type: DataType.JSONB })
  excludedProductIds: string[];

  @Column({ type: DataType.INTEGER, defaultValue: 50 })
  priority: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

@Table({ tableName: 'promotions', paranoid: true })
export class Promotion extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @Column({ type: DataType.STRING(200), allowNull: false })
  @Index
  name: string;

  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  @Index
  internalCode: string;

  @Column({ type: DataType.ENUM(...Object.values(PromotionType)), allowNull: false })
  promotionType: PromotionType;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  startDate: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  endDate: Date;

  @Column({ type: DataType.ENUM(...Object.values(PromotionStatus)), defaultValue: PromotionStatus.DRAFT })
  @Index
  status: PromotionStatus;

  @Column({ type: DataType.ENUM(...Object.values(CustomerEligibility)), allowNull: false })
  customerEligibility: CustomerEligibility;

  @Column({ type: DataType.JSONB })
  customerSegmentIds: string[];

  @Column({ type: DataType.INTEGER })
  usageLimitPerCustomer: number;

  @Column({ type: DataType.INTEGER })
  totalUsageLimit: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  totalUsageCount: number;

  @Column({ type: DataType.JSONB })
  discountIds: string[];

  @Column({ type: DataType.ENUM(...Object.values(StackingRuleType)), allowNull: false })
  stackingRule: StackingRuleType;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  requiresCouponCode: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

@Table({ tableName: 'coupon_codes', paranoid: true })
export class CouponCode extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  @Index
  code: string;

  @ForeignKey(() => Promotion)
  @Column({ type: DataType.UUID, allowNull: false })
  promotionId: string;

  @BelongsTo(() => Promotion)
  promotion: Promotion;

  @Column({ type: DataType.INTEGER })
  usageLimitPerCode: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  usageCount: number;

  @Column({ type: DataType.DATE })
  expirationDate: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

@Table({ tableName: 'coupon_usage', paranoid: true })
export class CouponUsage extends Model {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @ForeignKey(() => CouponCode)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  couponCodeId: string;

  @BelongsTo(() => CouponCode)
  couponCode: CouponCode;

  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  customerId: string;

  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  orderId: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  discountAmount: number;

  @Column({ type: DataType.DATE, allowNull: false })
  usedAt: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const logger = new Logger('DiscountPromotionKit');

/**
 * 1. Generate unique discount code
 */
export function generateDiscountCode(
  pattern: CouponCodePattern,
  length: number,
  prefix?: string
): string {
  const chars = {
    [CouponCodePattern.ALPHANUMERIC]: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
    [CouponCodePattern.NUMERIC]: '0123456789',
    [CouponCodePattern.ALPHABETIC]: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
    [CouponCodePattern.CUSTOM]: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
  };

  const charset = chars[pattern];
  let code = '';

  for (let i = 0; i < length; i++) {
    code += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return prefix ? `${prefix}${code}` : code;
}

/**
 * 2. Validate coupon code format
 */
export function validateCouponCodeFormat(code: string): boolean {
  const regex = /^[A-Z0-9_-]{4,50}$/;
  return regex.test(code);
}

/**
 * 3. Check if coupon is valid and active
 */
export async function isCouponValid(
  couponCode: CouponCode,
  customerId: string
): Promise<{ valid: boolean; reason?: string }> {
  if (!couponCode.isActive) {
    return { valid: false, reason: 'Coupon is inactive' };
  }

  if (couponCode.expirationDate && new Date() > new Date(couponCode.expirationDate)) {
    return { valid: false, reason: 'Coupon has expired' };
  }

  if (couponCode.usageLimitPerCode && couponCode.usageCount >= couponCode.usageLimitPerCode) {
    return { valid: false, reason: 'Coupon usage limit reached' };
  }

  // Check customer-specific usage
  const customerUsage = await CouponUsage.count({
    where: { couponCodeId: couponCode.id, customerId },
  });

  const promotion = await Promotion.findByPk(couponCode.promotionId);
  if (promotion?.usageLimitPerCustomer && customerUsage >= promotion.usageLimitPerCustomer) {
    return { valid: false, reason: 'Customer usage limit reached' };
  }

  return { valid: true };
}

/**
 * 4. Calculate percentage discount
 */
export function calculatePercentageDiscount(
  amount: number,
  percentage: number,
  maxDiscount?: number
): number {
  const discount = (amount * percentage) / 100;
  return maxDiscount ? Math.min(discount, maxDiscount) : discount;
}

/**
 * 5. Calculate fixed amount discount
 */
export function calculateFixedDiscount(amount: number, discountAmount: number): number {
  return Math.min(discountAmount, amount);
}

/**
 * 6. Apply BOGO discount
 */
export function applyBogoDiscount(
  items: CartItemDto[],
  config: BogoConfigDto
): { discountAmount: number; affectedItems: string[] } {
  const eligibleItems = items.filter(
    (item) => config.sameProductRequired || config.getProductIds?.includes(item.productId)
  );

  const totalEligibleQty = eligibleItems.reduce((sum, item) => sum + item.quantity, 0);
  const sets = Math.floor(totalEligibleQty / (config.buyQuantity + config.getQuantity));

  if (sets === 0) {
    return { discountAmount: 0, affectedItems: [] };
  }

  const maxSets = config.maxApplications ? Math.min(sets, config.maxApplications) : sets;
  const getItemsCount = maxSets * config.getQuantity;

  let discountAmount = 0;
  let remainingGetItems = getItemsCount;
  const affectedItems: string[] = [];

  for (const item of eligibleItems) {
    if (remainingGetItems <= 0) break;

    const itemsToDiscount = Math.min(item.quantity, remainingGetItems);
    const itemDiscount =
      item.unitPrice * itemsToDiscount * (config.getItemsDiscountPercentage / 100);

    discountAmount += itemDiscount;
    affectedItems.push(item.productId);
    remainingGetItems -= itemsToDiscount;
  }

  return { discountAmount, affectedItems };
}

/**
 * 7. Calculate volume discount based on quantity
 */
export function calculateVolumeDiscount(
  quantity: number,
  unitPrice: number,
  tiers: VolumeDiscountTierDto[]
): { discountAmount: number; tier: VolumeDiscountTierDto | null } {
  const applicableTier = tiers
    .filter((tier) => quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity))
    .sort((a, b) => b.discountPercentage - a.discountPercentage)[0];

  if (!applicableTier) {
    return { discountAmount: 0, tier: null };
  }

  const lineTotal = quantity * unitPrice;
  const discountAmount = applicableTier.discountPercentage
    ? calculatePercentageDiscount(lineTotal, applicableTier.discountPercentage)
    : applicableTier.fixedDiscountAmount || 0;

  return { discountAmount, tier: applicableTier };
}

/**
 * 8. Calculate tiered promotion discount
 */
export function calculateTieredDiscount(
  cartTotal: number,
  totalQuantity: number,
  promotion: TieredPromotionDto
): number {
  const value = promotion.basedOn === 'AMOUNT' ? cartTotal : totalQuantity;

  const applicableTier = promotion.tiers
    .filter((tier) => value >= tier.minQuantity && (!tier.maxQuantity || value <= tier.maxQuantity))
    .sort((a, b) => b.discountPercentage - a.discountPercentage)[0];

  if (!applicableTier) {
    return 0;
  }

  return applicableTier.discountPercentage
    ? calculatePercentageDiscount(cartTotal, applicableTier.discountPercentage)
    : applicableTier.fixedDiscountAmount || 0;
}

/**
 * 9. Check minimum purchase requirement
 */
export function meetsMinimumPurchase(cartTotal: number, minPurchase?: number): boolean {
  if (!minPurchase) return true;
  return cartTotal >= minPurchase;
}

/**
 * 10. Check minimum quantity requirement
 */
export function meetsMinimumQuantity(totalQuantity: number, minQuantity?: number): boolean {
  if (!minQuantity) return true;
  return totalQuantity >= minQuantity;
}

/**
 * 11. Filter eligible products
 */
export function filterEligibleProducts(
  items: CartItemDto[],
  applicableProductIds?: string[],
  excludedProductIds?: string[]
): CartItemDto[] {
  return items.filter((item) => {
    if (excludedProductIds?.includes(item.productId)) return false;
    if (applicableProductIds && !applicableProductIds.includes(item.productId)) return false;
    return true;
  });
}

/**
 * 12. Filter eligible categories
 */
export function filterEligibleCategories(
  items: CartItemDto[],
  applicableCategoryIds?: string[],
  excludedCategoryIds?: string[]
): CartItemDto[] {
  return items.filter((item) => {
    if (!item.categoryId) return false;
    if (excludedCategoryIds?.includes(item.categoryId)) return false;
    if (applicableCategoryIds && !applicableCategoryIds.includes(item.categoryId)) return false;
    return true;
  });
}

/**
 * 13. Apply stacking rules - best discount
 */
export function applyBestDiscount(discounts: AppliedDiscountDetail[]): AppliedDiscountDetail[] {
  if (discounts.length === 0) return [];
  return [discounts.reduce((best, current) => (current.amount > best.amount ? current : best))];
}

/**
 * 14. Apply stacking rules - additive
 */
export function applyAdditiveDiscounts(discounts: AppliedDiscountDetail[]): AppliedDiscountDetail[] {
  return discounts;
}

/**
 * 15. Apply stacking rules - sequential
 */
export function applySequentialDiscounts(
  originalTotal: number,
  discounts: AppliedDiscountDetail[]
): { discounts: AppliedDiscountDetail[]; finalTotal: number } {
  const sortedDiscounts = [...discounts].sort((a, b) => {
    // Priority sorting would be done based on discount priority field
    return b.amount - a.amount;
  });

  let runningTotal = originalTotal;
  const appliedDiscounts: AppliedDiscountDetail[] = [];

  for (const discount of sortedDiscounts) {
    const discountAmount = Math.min(discount.amount, runningTotal);
    if (discountAmount > 0) {
      appliedDiscounts.push({ ...discount, amount: discountAmount });
      runningTotal -= discountAmount;
    }
  }

  return { discounts: appliedDiscounts, finalTotal: runningTotal };
}

/**
 * 16. Check if promotion is currently active
 */
export function isPromotionActive(promotion: Promotion): boolean {
  const now = new Date();
  return (
    promotion.status === PromotionStatus.ACTIVE &&
    now >= new Date(promotion.startDate) &&
    now <= new Date(promotion.endDate)
  );
}

/**
 * 17. Check customer eligibility
 */
export async function isCustomerEligible(
  customerId: string,
  promotion: Promotion,
  customerSegmentIds?: string[]
): Promise<boolean> {
  switch (promotion.customerEligibility) {
    case CustomerEligibility.ALL_CUSTOMERS:
      return true;

    case CustomerEligibility.SPECIFIC_SEGMENTS:
      if (!customerSegmentIds || !promotion.customerSegmentIds) return false;
      return promotion.customerSegmentIds.some((segId) => customerSegmentIds.includes(segId));

    // Add more eligibility checks as needed
    default:
      return true;
  }
}

/**
 * 18. Calculate total discount for cart
 */
export function calculateCartDiscount(
  cartItems: CartItemDto[],
  discounts: Discount[],
  stackingRule: StackingRuleType
): DiscountCalculationResult {
  const originalTotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const appliedDiscounts: AppliedDiscountDetail[] = [];

  for (const discount of discounts) {
    let discountAmount = 0;

    if (discount.scope === ApplicationScope.ORDER_LEVEL) {
      if (discount.discountType === DiscountType.PERCENTAGE) {
        discountAmount = calculatePercentageDiscount(
          originalTotal,
          Number(discount.value),
          discount.maxDiscountAmount ? Number(discount.maxDiscountAmount) : undefined
        );
      } else if (discount.discountType === DiscountType.FIXED_AMOUNT) {
        discountAmount = calculateFixedDiscount(originalTotal, Number(discount.value));
      }
    } else if (discount.scope === ApplicationScope.LINE_ITEM) {
      const eligibleItems = filterEligibleProducts(
        cartItems,
        discount.applicableProductIds,
        discount.excludedProductIds
      );

      for (const item of eligibleItems) {
        if (discount.discountType === DiscountType.PERCENTAGE) {
          discountAmount += calculatePercentageDiscount(item.lineTotal, Number(discount.value));
        } else if (discount.discountType === DiscountType.FIXED_AMOUNT) {
          discountAmount += calculateFixedDiscount(item.lineTotal, Number(discount.value));
        }
      }
    }

    if (discountAmount > 0) {
      appliedDiscounts.push({
        discountId: discount.id,
        discountName: discount.name,
        amount: discountAmount,
        scope: discount.scope,
      });
    }
  }

  let finalDiscounts: AppliedDiscountDetail[] = [];
  let totalDiscount = 0;

  switch (stackingRule) {
    case StackingRuleType.BEST_DISCOUNT:
      finalDiscounts = applyBestDiscount(appliedDiscounts);
      totalDiscount = finalDiscounts.reduce((sum, d) => sum + d.amount, 0);
      break;

    case StackingRuleType.ADDITIVE:
      finalDiscounts = applyAdditiveDiscounts(appliedDiscounts);
      totalDiscount = finalDiscounts.reduce((sum, d) => sum + d.amount, 0);
      break;

    case StackingRuleType.SEQUENTIAL:
      const result = applySequentialDiscounts(originalTotal, appliedDiscounts);
      finalDiscounts = result.discounts;
      totalDiscount = originalTotal - result.finalTotal;
      break;

    default:
      finalDiscounts = appliedDiscounts.slice(0, 1);
      totalDiscount = finalDiscounts.reduce((sum, d) => sum + d.amount, 0);
  }

  return {
    originalTotal,
    discountAmount: totalDiscount,
    finalTotal: Math.max(0, originalTotal - totalDiscount),
    appliedDiscounts: finalDiscounts,
    totalSavings: totalDiscount,
  };
}

/**
 * 19. Validate exclusion rules
 */
export function validateExclusionRules(
  items: CartItemDto[],
  exclusionRule: ExclusionRuleDto
): { valid: boolean; excludedItems: string[] } {
  const excludedItems: string[] = [];

  for (const item of items) {
    if (exclusionRule.excludedProductIds?.includes(item.productId)) {
      excludedItems.push(item.productId);
    }
    if (item.categoryId && exclusionRule.excludedCategoryIds?.includes(item.categoryId)) {
      excludedItems.push(item.productId);
    }
  }

  return {
    valid: excludedItems.length === 0,
    excludedItems,
  };
}

/**
 * 20. Generate bulk coupon codes
 */
export async function generateBulkCoupons(
  dto: GenerateCouponCodesDto
): Promise<CouponCode[]> {
  const codes: string[] = [];
  const existingCodes = new Set<string>();

  // Fetch existing codes to avoid duplicates
  const existing = await CouponCode.findAll({
    where: { promotionId: dto.promotionId },
    attributes: ['code'],
  });
  existing.forEach((c) => existingCodes.add(c.code));

  // Generate unique codes
  while (codes.length < dto.quantity) {
    const code = generateDiscountCode(dto.pattern, dto.codeLength, dto.prefix);
    if (!existingCodes.has(code) && !codes.includes(code)) {
      codes.push(code);
    }
  }

  // Create coupon code records
  const coupons = await CouponCode.bulkCreate(
    codes.map((code) => ({
      code,
      promotionId: dto.promotionId,
      usageLimitPerCode: dto.usageLimitPerCode,
      expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : null,
      isActive: true,
    }))
  );

  logger.log(`Generated ${coupons.length} coupon codes for promotion ${dto.promotionId}`);
  return coupons;
}

/**
 * 21. Validate and apply coupon code
 */
export async function validateAndApplyCoupon(
  dto: ValidateCouponDto
): Promise<{ valid: boolean; discount?: AppliedDiscountDetail; reason?: string }> {
  const coupon = await CouponCode.findOne({
    where: { code: dto.code.toUpperCase(), isActive: true },
    include: [Promotion],
  });

  if (!coupon) {
    return { valid: false, reason: 'Invalid coupon code' };
  }

  const validationResult = await isCouponValid(coupon, dto.customerId);
  if (!validationResult.valid) {
    return { valid: false, reason: validationResult.reason };
  }

  const promotion = coupon.promotion;
  if (!isPromotionActive(promotion)) {
    return { valid: false, reason: 'Promotion is not active' };
  }

  // Fetch associated discounts
  const discounts = await Discount.findAll({
    where: { id: { [Op.in]: promotion.discountIds }, isActive: true },
  });

  // Calculate discount
  const result = calculateCartDiscount(dto.cartItems, discounts, promotion.stackingRule);

  if (result.discountAmount > 0) {
    return {
      valid: true,
      discount: {
        discountId: promotion.id,
        discountName: promotion.name,
        amount: result.discountAmount,
        scope: ApplicationScope.ORDER_LEVEL,
        couponCode: dto.code,
      },
    };
  }

  return { valid: false, reason: 'No applicable discounts found' };
}

/**
 * 22. Record coupon usage
 */
export async function recordCouponUsage(
  couponCodeId: string,
  customerId: string,
  orderId: string,
  discountAmount: number
): Promise<CouponUsage> {
  const usage = await CouponUsage.create({
    couponCodeId,
    customerId,
    orderId,
    discountAmount,
    usedAt: new Date(),
  });

  // Increment usage counts
  await CouponCode.increment('usageCount', { where: { id: couponCodeId } });
  const coupon = await CouponCode.findByPk(couponCodeId);
  await Promotion.increment('totalUsageCount', { where: { id: coupon.promotionId } });

  logger.log(`Recorded coupon usage: ${couponCodeId} for order ${orderId}`);
  return usage;
}

/**
 * 23. Create flash sale promotion
 */
export async function createFlashSale(dto: FlashSaleDto): Promise<Promotion> {
  const promotion = await Promotion.create({
    name: dto.name,
    internalCode: `FLASH_${Date.now()}`,
    promotionType: PromotionType.FLASH_SALE,
    startDate: new Date(dto.startTime),
    endDate: new Date(dto.endTime),
    status: PromotionStatus.SCHEDULED,
    customerEligibility: CustomerEligibility.ALL_CUSTOMERS,
    stackingRule: StackingRuleType.NO_STACKING,
    requiresCouponCode: false,
    usageLimitPerCustomer: dto.perCustomerLimit,
  } as any);

  // Create associated discount
  const discount = await Discount.create({
    name: `${dto.name} - Flash Discount`,
    discountType: DiscountType.PERCENTAGE,
    value: dto.discountPercentage,
    scope: ApplicationScope.PRODUCT,
    startDate: new Date(dto.startTime),
    endDate: new Date(dto.endTime),
    applicableProductIds: dto.productIds,
    priority: 100, // High priority for flash sales
    isActive: true,
  } as any);

  await promotion.update({ discountIds: [discount.id] });

  logger.log(`Created flash sale promotion: ${promotion.id}`);
  return promotion;
}

/**
 * 24. Get active promotions for customer
 */
export async function getActivePromotionsForCustomer(
  customerId: string,
  customerSegmentIds?: string[]
): Promise<Promotion[]> {
  const now = new Date();

  const promotions = await Promotion.findAll({
    where: {
      status: PromotionStatus.ACTIVE,
      startDate: { [Op.lte]: now },
      endDate: { [Op.gte]: now },
    },
  });

  const eligible: Promotion[] = [];

  for (const promo of promotions) {
    const isEligible = await isCustomerEligible(customerId, promo, customerSegmentIds);
    if (isEligible) {
      eligible.push(promo);
    }
  }

  return eligible;
}

/**
 * 25. Calculate loyalty points discount
 */
export function calculateLoyaltyPointsDiscount(
  points: number,
  pointValue: number,
  maxRedemption?: number
): number {
  const discountAmount = points * pointValue;
  return maxRedemption ? Math.min(discountAmount, maxRedemption) : discountAmount;
}

/**
 * 26. Apply referral bonus
 */
export async function applyReferralBonus(
  referrerId: string,
  refereeId: string,
  bonusAmount: number
): Promise<{ referrerDiscount: number; refereeDiscount: number }> {
  // This would create discount records or credits for both parties
  logger.log(`Applied referral bonus: Referrer ${referrerId}, Referee ${refereeId}`);

  return {
    referrerDiscount: bonusAmount,
    refereeDiscount: bonusAmount * 0.5, // Example: referee gets 50% of referrer bonus
  };
}

/**
 * 27. Calculate bundle discount
 */
export function calculateBundleDiscount(
  bundleItems: CartItemDto[],
  requiredProductIds: string[],
  bundleDiscount: number
): { applicable: boolean; discountAmount: number } {
  const itemProductIds = bundleItems.map((item) => item.productId);
  const hasAllRequired = requiredProductIds.every((id) => itemProductIds.includes(id));

  if (!hasAllRequired) {
    return { applicable: false, discountAmount: 0 };
  }

  const bundleTotal = bundleItems
    .filter((item) => requiredProductIds.includes(item.productId))
    .reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    applicable: true,
    discountAmount: calculatePercentageDiscount(bundleTotal, bundleDiscount),
  };
}

/**
 * 28. Check promotion usage limits
 */
export async function checkPromotionUsageLimits(
  promotionId: string,
  customerId: string
): Promise<{ canUse: boolean; reason?: string }> {
  const promotion = await Promotion.findByPk(promotionId);
  if (!promotion) {
    return { canUse: false, reason: 'Promotion not found' };
  }

  // Check total usage limit
  if (promotion.totalUsageLimit && promotion.totalUsageCount >= promotion.totalUsageLimit) {
    return { canUse: false, reason: 'Total usage limit reached' };
  }

  // Check customer usage limit
  if (promotion.usageLimitPerCustomer) {
    const customerUsage = await CouponUsage.count({
      where: { customerId },
      include: [
        {
          model: CouponCode,
          where: { promotionId },
          required: true,
        },
      ],
    });

    if (customerUsage >= promotion.usageLimitPerCustomer) {
      return { canUse: false, reason: 'Customer usage limit reached' };
    }
  }

  return { canUse: true };
}

/**
 * 29. Calculate seasonal promotion discount
 */
export function calculateSeasonalDiscount(
  cartTotal: number,
  seasonalRate: number,
  seasonStart: Date,
  seasonEnd: Date
): { applicable: boolean; discountAmount: number } {
  const now = new Date();

  if (now < seasonStart || now > seasonEnd) {
    return { applicable: false, discountAmount: 0 };
  }

  return {
    applicable: true,
    discountAmount: calculatePercentageDiscount(cartTotal, seasonalRate),
  };
}

/**
 * 30. Apply first-time customer discount
 */
export async function applyFirstTimeCustomerDiscount(
  customerId: string,
  discountPercentage: number,
  cartTotal: number
): Promise<{ applicable: boolean; discountAmount: number }> {
  // Check if customer has previous orders
  const previousOrders = await CouponUsage.count({ where: { customerId } });

  if (previousOrders > 0) {
    return { applicable: false, discountAmount: 0 };
  }

  return {
    applicable: true,
    discountAmount: calculatePercentageDiscount(cartTotal, discountPercentage),
  };
}

/**
 * 31. Calculate category-specific promotion
 */
export function calculateCategoryPromotion(
  items: CartItemDto[],
  categoryId: string,
  discountPercentage: number
): number {
  const categoryTotal = items
    .filter((item) => item.categoryId === categoryId)
    .reduce((sum, item) => sum + item.lineTotal, 0);

  return calculatePercentageDiscount(categoryTotal, discountPercentage);
}

/**
 * 32. Apply early bird discount
 */
export function applyEarlyBirdDiscount(
  orderTime: Date,
  cutoffTime: Date,
  discountPercentage: number,
  cartTotal: number
): { applicable: boolean; discountAmount: number } {
  if (orderTime > cutoffTime) {
    return { applicable: false, discountAmount: 0 };
  }

  return {
    applicable: true,
    discountAmount: calculatePercentageDiscount(cartTotal, discountPercentage),
  };
}

/**
 * 33. Calculate cart abandonment recovery discount
 */
export function calculateAbandonmentDiscount(
  abandonedCartAge: number,
  baseDiscount: number,
  maxDiscount: number,
  cartTotal: number
): number {
  // Increase discount based on cart age (in days)
  const discountPercentage = Math.min(baseDiscount + abandonedCartAge * 2, maxDiscount);
  return calculatePercentageDiscount(cartTotal, discountPercentage);
}

/**
 * 34. Validate time-limited promotion
 */
export function validateTimeLimitedPromotion(
  promotion: Promotion,
  currentTime?: Date
): { valid: boolean; reason?: string } {
  const now = currentTime || new Date();

  if (now < new Date(promotion.startDate)) {
    return { valid: false, reason: 'Promotion has not started yet' };
  }

  if (now > new Date(promotion.endDate)) {
    return { valid: false, reason: 'Promotion has expired' };
  }

  return { valid: true };
}

/**
 * 35. Calculate multi-buy discount (e.g., 3 for $10)
 */
export function calculateMultiBuyDiscount(
  quantity: number,
  unitPrice: number,
  buyQuantity: number,
  bundlePrice: number
): number {
  const sets = Math.floor(quantity / buyQuantity);
  const remainder = quantity % buyQuantity;

  const regularTotal = quantity * unitPrice;
  const discountedTotal = sets * bundlePrice + remainder * unitPrice;

  return Math.max(0, regularTotal - discountedTotal);
}

/**
 * 36. Apply spend threshold bonus
 */
export function applySpendThresholdBonus(
  cartTotal: number,
  thresholds: { amount: number; bonus: number }[]
): { applicable: boolean; bonusAmount: number } {
  const applicableThreshold = thresholds
    .filter((t) => cartTotal >= t.amount)
    .sort((a, b) => b.amount - a.amount)[0];

  if (!applicableThreshold) {
    return { applicable: false, bonusAmount: 0 };
  }

  return {
    applicable: true,
    bonusAmount: applicableThreshold.bonus,
  };
}

/**
 * 37. Calculate cross-sell promotion discount
 */
export function calculateCrossSellDiscount(
  items: CartItemDto[],
  primaryProductId: string,
  crossSellProductIds: string[],
  discountPercentage: number
): { applicable: boolean; discountAmount: number } {
  const hasPrimary = items.some((item) => item.productId === primaryProductId);
  const hasCrossSell = items.some((item) => crossSellProductIds.includes(item.productId));

  if (!hasPrimary || !hasCrossSell) {
    return { applicable: false, discountAmount: 0 };
  }

  const crossSellTotal = items
    .filter((item) => crossSellProductIds.includes(item.productId))
    .reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    applicable: true,
    discountAmount: calculatePercentageDiscount(crossSellTotal, discountPercentage),
  };
}

/**
 * 38. Deactivate expired promotions
 */
export async function deactivateExpiredPromotions(): Promise<number> {
  const now = new Date();

  const [affectedCount] = await Promotion.update(
    { status: PromotionStatus.EXPIRED },
    {
      where: {
        status: { [Op.in]: [PromotionStatus.ACTIVE, PromotionStatus.SCHEDULED] },
        endDate: { [Op.lt]: now },
      },
    }
  );

  logger.log(`Deactivated ${affectedCount} expired promotions`);
  return affectedCount;
}

/**
 * 39. Activate scheduled promotions
 */
export async function activateScheduledPromotions(): Promise<number> {
  const now = new Date();

  const [affectedCount] = await Promotion.update(
    { status: PromotionStatus.ACTIVE },
    {
      where: {
        status: PromotionStatus.SCHEDULED,
        startDate: { [Op.lte]: now },
        endDate: { [Op.gte]: now },
      },
    }
  );

  logger.log(`Activated ${affectedCount} scheduled promotions`);
  return affectedCount;
}

/**
 * 40. Generate promotion performance report
 */
export async function generatePromotionPerformanceReport(
  promotionId: string,
  startDate?: Date,
  endDate?: Date
): Promise<{
  totalUsage: number;
  totalRevenue: number;
  totalDiscount: number;
  uniqueCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
}> {
  const whereClause: any = { promotionId };

  if (startDate || endDate) {
    whereClause.usedAt = {};
    if (startDate) whereClause.usedAt[Op.gte] = startDate;
    if (endDate) whereClause.usedAt[Op.lte] = endDate;
  }

  const usages = await CouponUsage.findAll({
    where: whereClause,
    include: [{ model: CouponCode, where: { promotionId }, required: true }],
  });

  const totalUsage = usages.length;
  const totalDiscount = usages.reduce((sum, u) => sum + Number(u.discountAmount), 0);
  const uniqueCustomers = new Set(usages.map((u) => u.customerId)).size;

  // Note: Revenue calculation would require order data
  const totalRevenue = 0; // Placeholder

  return {
    totalUsage,
    totalRevenue,
    totalDiscount,
    uniqueCustomers,
    averageOrderValue: totalRevenue / totalUsage || 0,
    conversionRate: 0, // Placeholder - would need total visitors
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  Discount,
  Promotion,
  CouponCode,
  CouponUsage,

  // DTOs
  CreateDiscountDto,
  CreatePromotionDto,
  GenerateCouponCodesDto,
  ValidateCouponDto,
  CartItemDto,
  BogoConfigDto,
  VolumeDiscountTierDto,
  TieredPromotionDto,
  ApplyDiscountDto,
  CustomerSegmentPromotionDto,
  FlashSaleDto,
  ExclusionRuleDto,
  DiscountCalculationResult,
  AppliedDiscountDetail,

  // Enums
  DiscountType,
  PromotionType,
  PromotionStatus,
  CouponCodePattern,
  CustomerEligibility,
  StackingRuleType,
  ApplicationScope,

  // Functions
  generateDiscountCode,
  validateCouponCodeFormat,
  isCouponValid,
  calculatePercentageDiscount,
  calculateFixedDiscount,
  applyBogoDiscount,
  calculateVolumeDiscount,
  calculateTieredDiscount,
  meetsMinimumPurchase,
  meetsMinimumQuantity,
  filterEligibleProducts,
  filterEligibleCategories,
  applyBestDiscount,
  applyAdditiveDiscounts,
  applySequentialDiscounts,
  isPromotionActive,
  isCustomerEligible,
  calculateCartDiscount,
  validateExclusionRules,
  generateBulkCoupons,
  validateAndApplyCoupon,
  recordCouponUsage,
  createFlashSale,
  getActivePromotionsForCustomer,
  calculateLoyaltyPointsDiscount,
  applyReferralBonus,
  calculateBundleDiscount,
  checkPromotionUsageLimits,
  calculateSeasonalDiscount,
  applyFirstTimeCustomerDiscount,
  calculateCategoryPromotion,
  applyEarlyBirdDiscount,
  calculateAbandonmentDiscount,
  validateTimeLimitedPromotion,
  calculateMultiBuyDiscount,
  applySpendThresholdBonus,
  calculateCrossSellDiscount,
  deactivateExpiredPromotions,
  activateScheduledPromotions,
  generatePromotionPerformanceReport,
};
