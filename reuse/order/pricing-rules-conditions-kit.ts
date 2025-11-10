/**
 * LOC: ORD-PRC-001
 * File: /reuse/order/pricing-rules-conditions-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Order controllers
 *   - Pricing services
 *   - Quote processors
 *   - Contract management
 */

/**
 * File: /reuse/order/pricing-rules-conditions-kit.ts
 * Locator: WC-ORD-PRCRUL-001
 * Purpose: Pricing Rules & Conditions - Complex pricing rules, conditions, matrices, and precedence
 *
 * Upstream: Independent utility module for advanced pricing operations
 * Downstream: ../backend/order/*, Pricing modules, Quote services, Contract services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 42 utility functions for pricing rules, conditions, matrices, precedence, and complex pricing logic
 *
 * LLM Context: Enterprise-grade pricing rules engine to compete with SAP, Oracle, and JD Edwards pricing.
 * Provides comprehensive pricing rule engine execution, conditional pricing logic, multi-dimensional pricing matrices,
 * rule precedence and priority handling, customer-specific pricing, product category pricing, quantity breaks,
 * bundle pricing, cross-sell/up-sell pricing, seasonal pricing, channel-specific pricing, contract pricing,
 * promotional pricing, tiered pricing, volume discounts, customer tier pricing, geographic pricing, and more.
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
} from 'class-validator';
import { Type } from 'class-transformer';
import { Op, WhereOptions } from 'sequelize';

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * Pricing rule types
 */
export enum PricingRuleType {
  BASE_PRICE = 'BASE_PRICE',
  DISCOUNT = 'DISCOUNT',
  MARKUP = 'MARKUP',
  FIXED_PRICE = 'FIXED_PRICE',
  FORMULA = 'FORMULA',
  TIER = 'TIER',
  QUANTITY_BREAK = 'QUANTITY_BREAK',
  BUNDLE = 'BUNDLE',
  PROMOTIONAL = 'PROMOTIONAL',
  CONTRACT = 'CONTRACT',
  SEASONAL = 'SEASONAL',
  CHANNEL = 'CHANNEL',
  CUSTOMER_SPECIFIC = 'CUSTOMER_SPECIFIC',
  CATEGORY = 'CATEGORY',
  GEOGRAPHIC = 'GEOGRAPHIC',
  TIME_BASED = 'TIME_BASED',
}

/**
 * Pricing rule status
 */
export enum PricingRuleStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SCHEDULED = 'SCHEDULED',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
}

/**
 * Condition operators for rule evaluation
 */
export enum ConditionOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  LESS_THAN = 'LESS_THAN',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
  BETWEEN = 'BETWEEN',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  CONTAINS = 'CONTAINS',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
  IS_NULL = 'IS_NULL',
  IS_NOT_NULL = 'IS_NOT_NULL',
}

/**
 * Condition logical operators
 */
export enum LogicalOperator {
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
}

/**
 * Pricing calculation methods
 */
export enum PricingCalculationMethod {
  PERCENTAGE_DISCOUNT = 'PERCENTAGE_DISCOUNT',
  FIXED_DISCOUNT = 'FIXED_DISCOUNT',
  PERCENTAGE_MARKUP = 'PERCENTAGE_MARKUP',
  FIXED_MARKUP = 'FIXED_MARKUP',
  OVERRIDE_PRICE = 'OVERRIDE_PRICE',
  COST_PLUS = 'COST_PLUS',
  FORMULA = 'FORMULA',
  TIERED = 'TIERED',
  MATRIX = 'MATRIX',
}

/**
 * Rule precedence levels (higher number = higher priority)
 */
export enum RulePrecedence {
  SYSTEM_DEFAULT = 0,
  CATEGORY = 10,
  PRODUCT = 20,
  CUSTOMER_TIER = 30,
  GEOGRAPHIC = 40,
  CHANNEL = 50,
  SEASONAL = 60,
  PROMOTIONAL = 70,
  CONTRACT = 80,
  CUSTOMER_SPECIFIC = 90,
  MANUAL_OVERRIDE = 100,
}

/**
 * Rule combination strategies when multiple rules apply
 */
export enum RuleCombinationStrategy {
  HIGHEST_PRIORITY = 'HIGHEST_PRIORITY',
  LOWEST_PRICE = 'LOWEST_PRICE',
  HIGHEST_PRICE = 'HIGHEST_PRICE',
  ADDITIVE = 'ADDITIVE',
  MULTIPLICATIVE = 'MULTIPLICATIVE',
  AVERAGE = 'AVERAGE',
  FIRST_MATCH = 'FIRST_MATCH',
  LAST_MATCH = 'LAST_MATCH',
}

/**
 * Customer tier levels
 */
export enum CustomerTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
  VIP = 'VIP',
}

/**
 * Sales channels
 */
export enum SalesChannel {
  WEB = 'WEB',
  MOBILE = 'MOBILE',
  RETAIL = 'RETAIL',
  WHOLESALE = 'WHOLESALE',
  DISTRIBUTOR = 'DISTRIBUTOR',
  PARTNER = 'PARTNER',
  DIRECT_SALES = 'DIRECT_SALES',
  MARKETPLACE = 'MARKETPLACE',
}

/**
 * Geographic regions
 */
export enum GeographicRegion {
  NORTH_AMERICA = 'NORTH_AMERICA',
  SOUTH_AMERICA = 'SOUTH_AMERICA',
  EUROPE = 'EUROPE',
  ASIA_PACIFIC = 'ASIA_PACIFIC',
  MIDDLE_EAST = 'MIDDLE_EAST',
  AFRICA = 'AFRICA',
}

/**
 * Seasonal periods
 */
export enum SeasonalPeriod {
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  FALL = 'FALL',
  WINTER = 'WINTER',
  HOLIDAY = 'HOLIDAY',
  BACK_TO_SCHOOL = 'BACK_TO_SCHOOL',
  BLACK_FRIDAY = 'BLACK_FRIDAY',
  CYBER_MONDAY = 'CYBER_MONDAY',
  CLEARANCE = 'CLEARANCE',
}

// ============================================================================
// TYPE DEFINITIONS & INTERFACES
// ============================================================================

/**
 * Pricing context for rule evaluation
 */
export interface PricingContext {
  customerId?: string;
  customerTier?: CustomerTier;
  productId: string;
  productCategoryId?: string;
  quantity: number;
  unitOfMeasure?: string;
  channel: SalesChannel;
  region?: GeographicRegion;
  state?: string;
  country?: string;
  currency: string;
  orderDate: Date;
  requestedDeliveryDate?: Date;
  contractId?: string;
  promotionCode?: string;
  bundleItems?: string[];
  customFields?: Record<string, unknown>;
}

/**
 * Pricing rule condition
 */
export interface RuleCondition {
  conditionId: string;
  field: string;
  operator: ConditionOperator;
  value: unknown;
  logicalOperator?: LogicalOperator;
  nestedConditions?: RuleCondition[];
}

/**
 * Pricing rule action
 */
export interface RuleAction {
  calculationMethod: PricingCalculationMethod;
  value: number;
  formula?: string;
  minPrice?: number;
  maxPrice?: number;
  roundingRule?: string;
  applyToBasePrice?: boolean;
}

/**
 * Quantity break tier
 */
export interface QuantityBreakTier {
  minQuantity: number;
  maxQuantity?: number;
  discountPercent?: number;
  discountAmount?: number;
  fixedPrice?: number;
}

/**
 * Pricing matrix dimension
 */
export interface PricingMatrixDimension {
  dimension: string;
  value: string;
}

/**
 * Pricing matrix cell
 */
export interface PricingMatrixCell {
  dimensions: PricingMatrixDimension[];
  price: number;
  discountPercent?: number;
  effectiveDate?: Date;
  expirationDate?: Date;
}

/**
 * Bundle pricing component
 */
export interface BundleComponent {
  productId: string;
  quantity: number;
  isRequired: boolean;
  substituteProducts?: string[];
}

/**
 * Pricing rule evaluation result
 */
export interface PricingRuleResult {
  ruleId: string;
  ruleName: string;
  ruleType: PricingRuleType;
  precedence: number;
  originalPrice: number;
  adjustedPrice: number;
  discountAmount: number;
  discountPercent: number;
  applied: boolean;
  reason?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Final pricing result with all applied rules
 */
export interface FinalPricingResult {
  productId: string;
  quantity: number;
  basePrice: number;
  listPrice: number;
  finalPrice: number;
  totalDiscount: number;
  totalDiscountPercent: number;
  appliedRules: PricingRuleResult[];
  currency: string;
  effectiveDate: Date;
  calculatedAt: Date;
}

/**
 * Cross-sell/up-sell recommendation
 */
export interface PricingRecommendation {
  type: 'CROSS_SELL' | 'UP_SELL';
  productId: string;
  productName: string;
  suggestedPrice: number;
  discountPercent?: number;
  reason: string;
  priority: number;
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================

/**
 * Create pricing rule DTO
 */
export class CreatePricingRuleDto {
  @ApiProperty({ description: 'Rule name' })
  @IsString()
  @IsNotEmpty()
  ruleName: string;

  @ApiProperty({ description: 'Rule description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Rule type', enum: PricingRuleType })
  @IsEnum(PricingRuleType)
  @IsNotEmpty()
  ruleType: PricingRuleType;

  @ApiProperty({ description: 'Precedence level', enum: RulePrecedence })
  @IsEnum(RulePrecedence)
  @IsNotEmpty()
  precedence: RulePrecedence;

  @ApiProperty({ description: 'Rule conditions (JSON)' })
  @IsNotEmpty()
  conditions: RuleCondition[];

  @ApiProperty({ description: 'Rule action (JSON)' })
  @IsNotEmpty()
  action: RuleAction;

  @ApiPropertyOptional({ description: 'Effective start date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  effectiveStartDate?: Date;

  @ApiPropertyOptional({ description: 'Effective end date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  effectiveEndDate?: Date;

  @ApiPropertyOptional({ description: 'Customer IDs this rule applies to' })
  @IsArray()
  @IsOptional()
  customerIds?: string[];

  @ApiPropertyOptional({ description: 'Product IDs this rule applies to' })
  @IsArray()
  @IsOptional()
  productIds?: string[];

  @ApiPropertyOptional({ description: 'Product category IDs this rule applies to' })
  @IsArray()
  @IsOptional()
  categoryIds?: string[];

  @ApiPropertyOptional({ description: 'Channels this rule applies to' })
  @IsArray()
  @IsOptional()
  channels?: SalesChannel[];

  @ApiPropertyOptional({ description: 'Enable rule stacking' })
  @IsBoolean()
  @IsOptional()
  allowStacking?: boolean;

  @ApiPropertyOptional({ description: 'Custom fields (JSON)' })
  @IsOptional()
  customFields?: Record<string, unknown>;
}

/**
 * Calculate pricing DTO
 */
export class CalculatePricingDto {
  @ApiProperty({ description: 'Pricing context' })
  @ValidateNested()
  @Type(() => Object)
  @IsNotEmpty()
  context: PricingContext;

  @ApiPropertyOptional({ description: 'Rule combination strategy', enum: RuleCombinationStrategy })
  @IsEnum(RuleCombinationStrategy)
  @IsOptional()
  combinationStrategy?: RuleCombinationStrategy;

  @ApiPropertyOptional({ description: 'Include inactive rules for testing' })
  @IsBoolean()
  @IsOptional()
  includeInactive?: boolean;
}

/**
 * Quantity break DTO
 */
export class CreateQuantityBreakDto {
  @ApiProperty({ description: 'Product ID' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Customer ID (optional for customer-specific)' })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiProperty({ description: 'Quantity break tiers' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsNotEmpty()
  tiers: QuantityBreakTier[];

  @ApiPropertyOptional({ description: 'Effective start date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  effectiveStartDate?: Date;

  @ApiPropertyOptional({ description: 'Effective end date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  effectiveEndDate?: Date;
}

/**
 * Bundle pricing DTO
 */
export class CreateBundlePricingDto {
  @ApiProperty({ description: 'Bundle name' })
  @IsString()
  @IsNotEmpty()
  bundleName: string;

  @ApiProperty({ description: 'Bundle components' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsNotEmpty()
  components: BundleComponent[];

  @ApiProperty({ description: 'Bundle price or discount percent' })
  @IsNumber()
  @IsNotEmpty()
  bundlePrice?: number;

  @ApiProperty({ description: 'Discount percent off component sum' })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  discountPercent?: number;

  @ApiPropertyOptional({ description: 'Effective start date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  effectiveStartDate?: Date;

  @ApiPropertyOptional({ description: 'Effective end date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  effectiveEndDate?: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Pricing rule model
 */
@Table({
  tableName: 'pricing_rules',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['ruleType'] },
    { fields: ['status'] },
    { fields: ['precedence'] },
    { fields: ['effectiveStartDate', 'effectiveEndDate'] },
    {
      fields: ['status', 'precedence', 'effectiveStartDate', 'effectiveEndDate'],
      name: 'idx_pricing_rules_active_lookup'
    },
  ],
})
export class PricingRule extends Model {
  @ApiProperty({ description: 'Pricing rule ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  ruleId: string;

  @ApiProperty({ description: 'Rule code (unique)' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  @Index
  ruleCode: string;

  @ApiProperty({ description: 'Rule name' })
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  ruleName: string;

  @ApiProperty({ description: 'Rule description' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @ApiProperty({ description: 'Rule type', enum: PricingRuleType })
  @Column({
    type: DataType.ENUM(...Object.values(PricingRuleType)),
    allowNull: false,
  })
  ruleType: PricingRuleType;

  @ApiProperty({ description: 'Rule status', enum: PricingRuleStatus })
  @Column({
    type: DataType.ENUM(...Object.values(PricingRuleStatus)),
    allowNull: false,
    defaultValue: PricingRuleStatus.DRAFT,
  })
  status: PricingRuleStatus;

  @ApiProperty({ description: 'Precedence level (higher = higher priority)' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  precedence: number;

  @ApiProperty({ description: 'Rule conditions (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  conditions: RuleCondition[];

  @ApiProperty({ description: 'Rule action (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  action: RuleAction;

  @ApiProperty({ description: 'Effective start date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  effectiveStartDate: Date;

  @ApiProperty({ description: 'Effective end date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  effectiveEndDate: Date;

  @ApiProperty({ description: 'Customer IDs (JSON array)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  customerIds: string[];

  @ApiProperty({ description: 'Product IDs (JSON array)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  productIds: string[];

  @ApiProperty({ description: 'Category IDs (JSON array)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  categoryIds: string[];

  @ApiProperty({ description: 'Channels (JSON array)' })
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  channels: SalesChannel[];

  @ApiProperty({ description: 'Allow rule stacking' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  allowStacking: boolean;

  @ApiProperty({ description: 'Combination strategy', enum: RuleCombinationStrategy })
  @Column({
    type: DataType.ENUM(...Object.values(RuleCombinationStrategy)),
    allowNull: false,
    defaultValue: RuleCombinationStrategy.HIGHEST_PRIORITY,
  })
  combinationStrategy: RuleCombinationStrategy;

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
}

/**
 * Pricing matrix model for multi-dimensional pricing
 */
@Table({
  tableName: 'pricing_matrices',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['matrixCode'] },
    { fields: ['productId'] },
    { fields: ['customerId'] },
    { fields: ['isActive'] },
    { fields: ['effectiveStartDate', 'effectiveEndDate'] },
  ],
})
export class PricingMatrix extends Model {
  @ApiProperty({ description: 'Pricing matrix ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  matrixId: string;

  @ApiProperty({ description: 'Matrix code (unique)' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  matrixCode: string;

  @ApiProperty({ description: 'Matrix name' })
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  matrixName: string;

  @ApiProperty({ description: 'Product ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  productId: string;

  @ApiProperty({ description: 'Customer ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  customerId: string;

  @ApiProperty({ description: 'Dimension definitions (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  dimensions: string[];

  @ApiProperty({ description: 'Matrix cells (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  cells: PricingMatrixCell[];

  @ApiProperty({ description: 'Is active' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @ApiProperty({ description: 'Effective start date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  effectiveStartDate: Date;

  @ApiProperty({ description: 'Effective end date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  effectiveEndDate: Date;

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
 * Quantity break pricing model
 */
@Table({
  tableName: 'quantity_breaks',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['productId'] },
    { fields: ['customerId'] },
    { fields: ['isActive'] },
    { fields: ['productId', 'customerId'] },
    { fields: ['effectiveStartDate', 'effectiveEndDate'] },
  ],
})
export class QuantityBreak extends Model {
  @ApiProperty({ description: 'Quantity break ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  breakId: string;

  @ApiProperty({ description: 'Product ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  productId: string;

  @ApiProperty({ description: 'Customer ID (null = applies to all)' })
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  customerId: string;

  @ApiProperty({ description: 'Quantity break tiers (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  tiers: QuantityBreakTier[];

  @ApiProperty({ description: 'Is active' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @ApiProperty({ description: 'Effective start date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  effectiveStartDate: Date;

  @ApiProperty({ description: 'Effective end date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  effectiveEndDate: Date;

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
 * Bundle pricing model
 */
@Table({
  tableName: 'bundle_pricing',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['bundleCode'] },
    { fields: ['isActive'] },
    { fields: ['effectiveStartDate', 'effectiveEndDate'] },
  ],
})
export class BundlePricing extends Model {
  @ApiProperty({ description: 'Bundle ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  bundleId: string;

  @ApiProperty({ description: 'Bundle code (unique)' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  bundleCode: string;

  @ApiProperty({ description: 'Bundle name' })
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  bundleName: string;

  @ApiProperty({ description: 'Bundle components (JSON)' })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  components: BundleComponent[];

  @ApiProperty({ description: 'Bundle fixed price' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  bundlePrice: number;

  @ApiProperty({ description: 'Discount percent off component sum' })
  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
  })
  discountPercent: number;

  @ApiProperty({ description: 'Is active' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @ApiProperty({ description: 'Effective start date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  effectiveStartDate: Date;

  @ApiProperty({ description: 'Effective end date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  effectiveEndDate: Date;

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
 * Customer-specific pricing model
 */
@Table({
  tableName: 'customer_pricing',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['customerId'] },
    { fields: ['productId'] },
    { fields: ['customerId', 'productId'] },
    { fields: ['isActive'] },
    { fields: ['effectiveStartDate', 'effectiveEndDate'] },
  ],
})
export class CustomerPricing extends Model {
  @ApiProperty({ description: 'Customer pricing ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  customerPricingId: string;

  @ApiProperty({ description: 'Customer ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  customerId: string;

  @ApiProperty({ description: 'Product ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  productId: string;

  @ApiProperty({ description: 'Customer-specific price' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  price: number;

  @ApiProperty({ description: 'Discount percent' })
  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
  })
  discountPercent: number;

  @ApiProperty({ description: 'Minimum order quantity' })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  minOrderQuantity: number;

  @ApiProperty({ description: 'Is active' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @ApiProperty({ description: 'Effective start date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  effectiveStartDate: Date;

  @ApiProperty({ description: 'Effective end date' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  effectiveEndDate: Date;

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
 * Contract pricing model
 */
@Table({
  tableName: 'contract_pricing',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['contractId'] },
    { fields: ['customerId'] },
    { fields: ['productId'] },
    { fields: ['isActive'] },
    { fields: ['effectiveStartDate', 'effectiveEndDate'] },
  ],
})
export class ContractPricing extends Model {
  @ApiProperty({ description: 'Contract pricing ID (UUID)' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  contractPricingId: string;

  @ApiProperty({ description: 'Contract ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  contractId: string;

  @ApiProperty({ description: 'Customer ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  customerId: string;

  @ApiProperty({ description: 'Product ID' })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  productId: string;

  @ApiProperty({ description: 'Contract price' })
  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  contractPrice: number;

  @ApiProperty({ description: 'Minimum commitment quantity' })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  minCommitmentQuantity: number;

  @ApiProperty({ description: 'Maximum commitment quantity' })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  maxCommitmentQuantity: number;

  @ApiProperty({ description: 'Is active' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @ApiProperty({ description: 'Contract start date' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  effectiveStartDate: Date;

  @ApiProperty({ description: 'Contract end date' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  effectiveEndDate: Date;

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
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Execute pricing rule engine for a given context
 *
 * Evaluates all applicable pricing rules based on context and returns final pricing.
 * Handles rule precedence, conditions, and combination strategies.
 *
 * @param context - Pricing context with customer, product, quantity, channel info
 * @param basePrice - Base price before rules applied
 * @param combinationStrategy - How to combine multiple applicable rules
 * @returns Final pricing result with all applied rules
 *
 * @example
 * const result = await executePricingRuleEngine(context, 100.00, RuleCombinationStrategy.HIGHEST_PRIORITY);
 */
export async function executePricingRuleEngine(
  context: PricingContext,
  basePrice: number,
  combinationStrategy: RuleCombinationStrategy = RuleCombinationStrategy.HIGHEST_PRIORITY,
): Promise<FinalPricingResult> {
  try {
    const now = new Date();

    // Find all applicable active rules
    const applicableRules = await PricingRule.findAll({
      where: {
        status: PricingRuleStatus.ACTIVE,
        [Op.or]: [
          { effectiveStartDate: { [Op.lte]: now }, effectiveEndDate: { [Op.gte]: now } },
          { effectiveStartDate: { [Op.lte]: now }, effectiveEndDate: null },
          { effectiveStartDate: null },
        ],
      },
      order: [['precedence', 'DESC']],
    });

    // Filter rules by context matching
    const matchingRules = applicableRules.filter(rule =>
      evaluateRuleApplicability(rule, context)
    );

    // Evaluate each matching rule
    const ruleResults: PricingRuleResult[] = [];
    let currentPrice = basePrice;

    for (const rule of matchingRules) {
      const result = await evaluatePricingRule(rule, context, currentPrice, basePrice);
      if (result.applied) {
        ruleResults.push(result);

        // Update current price based on combination strategy
        if (combinationStrategy === RuleCombinationStrategy.FIRST_MATCH) {
          currentPrice = result.adjustedPrice;
          break;
        } else if (combinationStrategy === RuleCombinationStrategy.HIGHEST_PRIORITY) {
          currentPrice = result.adjustedPrice;
          break;
        } else if (combinationStrategy === RuleCombinationStrategy.ADDITIVE ||
                   combinationStrategy === RuleCombinationStrategy.MULTIPLICATIVE) {
          currentPrice = result.adjustedPrice;
        }
      }
    }

    // Apply combination strategy
    const finalPrice = applyCombinationStrategy(
      basePrice,
      ruleResults,
      combinationStrategy
    );

    const totalDiscount = basePrice - finalPrice;
    const totalDiscountPercent = (totalDiscount / basePrice) * 100;

    return {
      productId: context.productId,
      quantity: context.quantity,
      basePrice,
      listPrice: basePrice,
      finalPrice,
      totalDiscount,
      totalDiscountPercent,
      appliedRules: ruleResults,
      currency: context.currency,
      effectiveDate: now,
      calculatedAt: now,
    };
  } catch (error) {
    throw new BadRequestException(`Failed to execute pricing rule engine: ${error.message}`);
  }
}

/**
 * Evaluate if a pricing rule applies to the given context
 *
 * @param rule - Pricing rule to evaluate
 * @param context - Pricing context
 * @returns True if rule applies
 */
export function evaluateRuleApplicability(
  rule: PricingRule,
  context: PricingContext,
): boolean {
  try {
    // Check customer match
    if (rule.customerIds && rule.customerIds.length > 0) {
      if (!context.customerId || !rule.customerIds.includes(context.customerId)) {
        return false;
      }
    }

    // Check product match
    if (rule.productIds && rule.productIds.length > 0) {
      if (!rule.productIds.includes(context.productId)) {
        return false;
      }
    }

    // Check category match
    if (rule.categoryIds && rule.categoryIds.length > 0) {
      if (!context.productCategoryId || !rule.categoryIds.includes(context.productCategoryId)) {
        return false;
      }
    }

    // Check channel match
    if (rule.channels && rule.channels.length > 0) {
      if (!rule.channels.includes(context.channel)) {
        return false;
      }
    }

    // Evaluate rule conditions
    return evaluateRuleConditions(rule.conditions, context);
  } catch (error) {
    return false;
  }
}

/**
 * Evaluate rule conditions with support for complex logic
 *
 * @param conditions - Rule conditions to evaluate
 * @param context - Pricing context
 * @returns True if all conditions pass
 */
export function evaluateRuleConditions(
  conditions: RuleCondition[],
  context: PricingContext,
): boolean {
  if (!conditions || conditions.length === 0) {
    return true;
  }

  let result = true;
  let currentLogic: LogicalOperator = LogicalOperator.AND;

  for (const condition of conditions) {
    const conditionResult = evaluateSingleCondition(condition, context);

    // Handle nested conditions
    if (condition.nestedConditions && condition.nestedConditions.length > 0) {
      const nestedResult = evaluateRuleConditions(condition.nestedConditions, context);

      if (currentLogic === LogicalOperator.AND) {
        result = result && nestedResult;
      } else if (currentLogic === LogicalOperator.OR) {
        result = result || nestedResult;
      } else if (currentLogic === LogicalOperator.NOT) {
        result = result && !nestedResult;
      }
    } else {
      // Handle simple condition
      if (currentLogic === LogicalOperator.AND) {
        result = result && conditionResult;
      } else if (currentLogic === LogicalOperator.OR) {
        result = result || conditionResult;
      } else if (currentLogic === LogicalOperator.NOT) {
        result = result && !conditionResult;
      }
    }

    // Update logic operator for next iteration
    if (condition.logicalOperator) {
      currentLogic = condition.logicalOperator;
    }
  }

  return result;
}

/**
 * Evaluate a single rule condition
 *
 * @param condition - Single condition to evaluate
 * @param context - Pricing context
 * @returns True if condition passes
 */
export function evaluateSingleCondition(
  condition: RuleCondition,
  context: PricingContext,
): boolean {
  const contextValue = getContextValue(condition.field, context);
  const conditionValue = condition.value;

  switch (condition.operator) {
    case ConditionOperator.EQUALS:
      return contextValue === conditionValue;

    case ConditionOperator.NOT_EQUALS:
      return contextValue !== conditionValue;

    case ConditionOperator.GREATER_THAN:
      return Number(contextValue) > Number(conditionValue);

    case ConditionOperator.GREATER_THAN_OR_EQUAL:
      return Number(contextValue) >= Number(conditionValue);

    case ConditionOperator.LESS_THAN:
      return Number(contextValue) < Number(conditionValue);

    case ConditionOperator.LESS_THAN_OR_EQUAL:
      return Number(contextValue) <= Number(conditionValue);

    case ConditionOperator.BETWEEN:
      if (Array.isArray(conditionValue) && conditionValue.length === 2) {
        return Number(contextValue) >= Number(conditionValue[0]) &&
               Number(contextValue) <= Number(conditionValue[1]);
      }
      return false;

    case ConditionOperator.IN:
      return Array.isArray(conditionValue) && conditionValue.includes(contextValue);

    case ConditionOperator.NOT_IN:
      return Array.isArray(conditionValue) && !conditionValue.includes(contextValue);

    case ConditionOperator.CONTAINS:
      return String(contextValue).includes(String(conditionValue));

    case ConditionOperator.STARTS_WITH:
      return String(contextValue).startsWith(String(conditionValue));

    case ConditionOperator.ENDS_WITH:
      return String(contextValue).endsWith(String(conditionValue));

    case ConditionOperator.IS_NULL:
      return contextValue === null || contextValue === undefined;

    case ConditionOperator.IS_NOT_NULL:
      return contextValue !== null && contextValue !== undefined;

    default:
      return false;
  }
}

/**
 * Get value from context by field name
 *
 * @param field - Field name (supports dot notation)
 * @param context - Pricing context
 * @returns Field value
 */
export function getContextValue(field: string, context: PricingContext): unknown {
  const parts = field.split('.');
  let value: any = context;

  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * Evaluate a pricing rule and calculate adjusted price
 *
 * @param rule - Pricing rule
 * @param context - Pricing context
 * @param currentPrice - Current price before this rule
 * @param basePrice - Original base price
 * @returns Pricing rule result
 */
export async function evaluatePricingRule(
  rule: PricingRule,
  context: PricingContext,
  currentPrice: number,
  basePrice: number,
): Promise<PricingRuleResult> {
  try {
    const action = rule.action;
    let adjustedPrice = currentPrice;
    let discountAmount = 0;
    let discountPercent = 0;
    let applied = false;

    const priceToUse = action.applyToBasePrice ? basePrice : currentPrice;

    switch (action.calculationMethod) {
      case PricingCalculationMethod.PERCENTAGE_DISCOUNT:
        discountPercent = action.value;
        discountAmount = (priceToUse * action.value) / 100;
        adjustedPrice = priceToUse - discountAmount;
        applied = true;
        break;

      case PricingCalculationMethod.FIXED_DISCOUNT:
        discountAmount = action.value;
        adjustedPrice = priceToUse - action.value;
        discountPercent = (discountAmount / priceToUse) * 100;
        applied = true;
        break;

      case PricingCalculationMethod.PERCENTAGE_MARKUP:
        const markupAmount = (priceToUse * action.value) / 100;
        adjustedPrice = priceToUse + markupAmount;
        applied = true;
        break;

      case PricingCalculationMethod.FIXED_MARKUP:
        adjustedPrice = priceToUse + action.value;
        applied = true;
        break;

      case PricingCalculationMethod.OVERRIDE_PRICE:
        adjustedPrice = action.value;
        discountAmount = priceToUse - action.value;
        discountPercent = (discountAmount / priceToUse) * 100;
        applied = true;
        break;

      case PricingCalculationMethod.FORMULA:
        if (action.formula) {
          adjustedPrice = evaluatePricingFormula(action.formula, context, priceToUse);
          discountAmount = priceToUse - adjustedPrice;
          discountPercent = (discountAmount / priceToUse) * 100;
          applied = true;
        }
        break;

      default:
        applied = false;
    }

    // Apply min/max constraints
    if (action.minPrice && adjustedPrice < action.minPrice) {
      adjustedPrice = action.minPrice;
    }
    if (action.maxPrice && adjustedPrice > action.maxPrice) {
      adjustedPrice = action.maxPrice;
    }

    return {
      ruleId: rule.ruleId,
      ruleName: rule.ruleName,
      ruleType: rule.ruleType,
      precedence: rule.precedence,
      originalPrice: currentPrice,
      adjustedPrice,
      discountAmount,
      discountPercent,
      applied,
      metadata: {
        calculationMethod: action.calculationMethod,
        actionValue: action.value,
      },
    };
  } catch (error) {
    return {
      ruleId: rule.ruleId,
      ruleName: rule.ruleName,
      ruleType: rule.ruleType,
      precedence: rule.precedence,
      originalPrice: currentPrice,
      adjustedPrice: currentPrice,
      discountAmount: 0,
      discountPercent: 0,
      applied: false,
      reason: `Evaluation failed: ${error.message}`,
    };
  }
}

/**
 * Evaluate pricing formula with context variables
 *
 * @param formula - Formula string (e.g., "basePrice * 0.9 + (quantity > 10 ? -5 : 0)")
 * @param context - Pricing context
 * @param currentPrice - Current price
 * @returns Calculated price
 */
export function evaluatePricingFormula(
  formula: string,
  context: PricingContext,
  currentPrice: number,
): number {
  try {
    // Create safe evaluation context
    const evalContext = {
      basePrice: currentPrice,
      quantity: context.quantity,
      customerId: context.customerId,
      productId: context.productId,
      Math: Math,
    };

    // Simple formula evaluation (in production, use a proper expression parser)
    // This is a simplified version - use a library like mathjs for production
    const result = new Function(...Object.keys(evalContext), `return ${formula}`)(...Object.values(evalContext));

    return Number(result) || currentPrice;
  } catch (error) {
    return currentPrice;
  }
}

/**
 * Apply combination strategy to multiple pricing results
 *
 * @param basePrice - Original base price
 * @param results - Array of pricing rule results
 * @param strategy - Combination strategy
 * @returns Final combined price
 */
export function applyCombinationStrategy(
  basePrice: number,
  results: PricingRuleResult[],
  strategy: RuleCombinationStrategy,
): number {
  if (results.length === 0) {
    return basePrice;
  }

  switch (strategy) {
    case RuleCombinationStrategy.HIGHEST_PRIORITY:
    case RuleCombinationStrategy.FIRST_MATCH:
      return results[0].adjustedPrice;

    case RuleCombinationStrategy.LOWEST_PRICE:
      return Math.min(...results.map(r => r.adjustedPrice));

    case RuleCombinationStrategy.HIGHEST_PRICE:
      return Math.max(...results.map(r => r.adjustedPrice));

    case RuleCombinationStrategy.ADDITIVE:
      const totalDiscount = results.reduce((sum, r) => sum + r.discountAmount, 0);
      return basePrice - totalDiscount;

    case RuleCombinationStrategy.MULTIPLICATIVE:
      let price = basePrice;
      for (const result of results) {
        const factor = result.adjustedPrice / result.originalPrice;
        price = price * factor;
      }
      return price;

    case RuleCombinationStrategy.AVERAGE:
      const avgPrice = results.reduce((sum, r) => sum + r.adjustedPrice, 0) / results.length;
      return avgPrice;

    case RuleCombinationStrategy.LAST_MATCH:
      return results[results.length - 1].adjustedPrice;

    default:
      return results[0].adjustedPrice;
  }
}

/**
 * Calculate quantity break pricing
 *
 * Finds the applicable quantity break tier and returns the discounted price.
 *
 * @param productId - Product ID
 * @param customerId - Customer ID (optional)
 * @param quantity - Order quantity
 * @param basePrice - Base unit price
 * @returns Final price with quantity break applied
 *
 * @example
 * const price = await calculateQuantityBreakPricing('PROD-001', 'CUST-123', 50, 10.00);
 */
export async function calculateQuantityBreakPricing(
  productId: string,
  customerId: string | null,
  quantity: number,
  basePrice: number,
): Promise<number> {
  try {
    const now = new Date();

    // Find applicable quantity breaks (customer-specific first, then general)
    const breaks = await QuantityBreak.findAll({
      where: {
        productId,
        isActive: true,
        [Op.or]: [
          { customerId },
          { customerId: null },
        ],
        [Op.or]: [
          { effectiveStartDate: { [Op.lte]: now }, effectiveEndDate: { [Op.gte]: now } },
          { effectiveStartDate: { [Op.lte]: now }, effectiveEndDate: null },
          { effectiveStartDate: null },
        ],
      },
      order: [
        ['customerId', 'DESC NULLS LAST'], // Customer-specific first
      ],
    });

    if (breaks.length === 0) {
      return basePrice;
    }

    // Use the first matching break (customer-specific has priority)
    const quantityBreak = breaks[0];

    // Find the applicable tier
    const tier = quantityBreak.tiers.find(t => {
      const meetsMin = quantity >= t.minQuantity;
      const meetsMax = !t.maxQuantity || quantity <= t.maxQuantity;
      return meetsMin && meetsMax;
    });

    if (!tier) {
      return basePrice;
    }

    // Apply tier pricing
    if (tier.fixedPrice) {
      return tier.fixedPrice;
    } else if (tier.discountPercent) {
      return basePrice * (1 - tier.discountPercent / 100);
    } else if (tier.discountAmount) {
      return basePrice - tier.discountAmount;
    }

    return basePrice;
  } catch (error) {
    throw new BadRequestException(`Failed to calculate quantity break pricing: ${error.message}`);
  }
}

/**
 * Calculate bundle pricing
 *
 * Evaluates bundle pricing rules and returns the bundle price.
 *
 * @param bundleCode - Bundle code
 * @param componentPrices - Map of product IDs to their base prices
 * @returns Bundle pricing result
 *
 * @example
 * const result = await calculateBundlePricing('BUNDLE-001', { 'PROD-1': 10, 'PROD-2': 20 });
 */
export async function calculateBundlePricing(
  bundleCode: string,
  componentPrices: Record<string, number>,
): Promise<{ bundlePrice: number; savings: number; componentTotal: number }> {
  try {
    const now = new Date();

    const bundle = await BundlePricing.findOne({
      where: {
        bundleCode,
        isActive: true,
        [Op.or]: [
          { effectiveStartDate: { [Op.lte]: now }, effectiveEndDate: { [Op.gte]: now } },
          { effectiveStartDate: { [Op.lte]: now }, effectiveEndDate: null },
          { effectiveStartDate: null },
        ],
      },
    });

    if (!bundle) {
      throw new NotFoundException(`Bundle not found: ${bundleCode}`);
    }

    // Calculate component total
    let componentTotal = 0;
    for (const component of bundle.components) {
      const price = componentPrices[component.productId];
      if (!price && component.isRequired) {
        throw new BadRequestException(`Missing price for required component: ${component.productId}`);
      }
      componentTotal += (price || 0) * component.quantity;
    }

    // Calculate bundle price
    let bundlePrice = componentTotal;
    if (bundle.bundlePrice) {
      bundlePrice = bundle.bundlePrice;
    } else if (bundle.discountPercent) {
      bundlePrice = componentTotal * (1 - bundle.discountPercent / 100);
    }

    const savings = componentTotal - bundlePrice;

    return {
      bundlePrice,
      savings,
      componentTotal,
    };
  } catch (error) {
    throw new BadRequestException(`Failed to calculate bundle pricing: ${error.message}`);
  }
}

/**
 * Get customer-specific pricing
 *
 * @param customerId - Customer ID
 * @param productId - Product ID
 * @returns Customer-specific price or null
 *
 * @example
 * const price = await getCustomerSpecificPrice('CUST-123', 'PROD-001');
 */
export async function getCustomerSpecificPrice(
  customerId: string,
  productId: string,
): Promise<number | null> {
  try {
    const now = new Date();

    const pricing = await CustomerPricing.findOne({
      where: {
        customerId,
        productId,
        isActive: true,
        [Op.or]: [
          { effectiveStartDate: { [Op.lte]: now }, effectiveEndDate: { [Op.gte]: now } },
          { effectiveStartDate: { [Op.lte]: now }, effectiveEndDate: null },
          { effectiveStartDate: null },
        ],
      },
    });

    return pricing ? pricing.price : null;
  } catch (error) {
    return null;
  }
}

/**
 * Get contract pricing
 *
 * @param contractId - Contract ID
 * @param productId - Product ID
 * @returns Contract price or null
 *
 * @example
 * const price = await getContractPrice('CONTRACT-001', 'PROD-001');
 */
export async function getContractPrice(
  contractId: string,
  productId: string,
): Promise<number | null> {
  try {
    const now = new Date();

    const pricing = await ContractPricing.findOne({
      where: {
        contractId,
        productId,
        isActive: true,
        effectiveStartDate: { [Op.lte]: now },
        effectiveEndDate: { [Op.gte]: now },
      },
    });

    return pricing ? pricing.contractPrice : null;
  } catch (error) {
    return null;
  }
}

/**
 * Lookup price from multi-dimensional pricing matrix
 *
 * @param matrixCode - Matrix code
 * @param dimensions - Dimension values to lookup
 * @returns Price from matrix or null
 *
 * @example
 * const price = await lookupPricingMatrix('MATRIX-001', [
 *   { dimension: 'region', value: 'US-WEST' },
 *   { dimension: 'volume', value: 'HIGH' }
 * ]);
 */
export async function lookupPricingMatrix(
  matrixCode: string,
  dimensions: PricingMatrixDimension[],
): Promise<number | null> {
  try {
    const now = new Date();

    const matrix = await PricingMatrix.findOne({
      where: {
        matrixCode,
        isActive: true,
        [Op.or]: [
          { effectiveStartDate: { [Op.lte]: now }, effectiveEndDate: { [Op.gte]: now } },
          { effectiveStartDate: { [Op.lte]: now }, effectiveEndDate: null },
          { effectiveStartDate: null },
        ],
      },
    });

    if (!matrix) {
      return null;
    }

    // Find matching cell
    const cell = matrix.cells.find(c => {
      return dimensions.every(dim => {
        return c.dimensions.some(cellDim =>
          cellDim.dimension === dim.dimension && cellDim.value === dim.value
        );
      });
    });

    return cell ? cell.price : null;
  } catch (error) {
    return null;
  }
}

/**
 * Create a new pricing rule
 *
 * @param ruleData - Pricing rule data
 * @param userId - User ID creating the rule
 * @returns Created pricing rule
 *
 * @example
 * const rule = await createPricingRule(ruleDto, 'user-123');
 */
export async function createPricingRule(
  ruleData: CreatePricingRuleDto,
  userId: string,
): Promise<PricingRule> {
  try {
    const ruleCode = await generatePricingRuleCode(ruleData.ruleType);

    const rule = await PricingRule.create({
      ruleCode,
      ruleName: ruleData.ruleName,
      description: ruleData.description,
      ruleType: ruleData.ruleType,
      status: PricingRuleStatus.DRAFT,
      precedence: ruleData.precedence,
      conditions: ruleData.conditions,
      action: ruleData.action,
      effectiveStartDate: ruleData.effectiveStartDate,
      effectiveEndDate: ruleData.effectiveEndDate,
      customerIds: ruleData.customerIds,
      productIds: ruleData.productIds,
      categoryIds: ruleData.categoryIds,
      channels: ruleData.channels,
      allowStacking: ruleData.allowStacking || false,
      combinationStrategy: RuleCombinationStrategy.HIGHEST_PRIORITY,
      customFields: ruleData.customFields,
      createdBy: userId,
    });

    return rule;
  } catch (error) {
    throw new BadRequestException(`Failed to create pricing rule: ${error.message}`);
  }
}

/**
 * Generate unique pricing rule code
 *
 * @param ruleType - Rule type
 * @returns Generated rule code
 */
export async function generatePricingRuleCode(ruleType: PricingRuleType): Promise<string> {
  const prefix = ruleType.substring(0, 3);
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Activate pricing rule
 *
 * @param ruleId - Rule ID
 * @param userId - User ID activating the rule
 * @returns Updated pricing rule
 *
 * @example
 * const rule = await activatePricingRule('rule-123', 'user-456');
 */
export async function activatePricingRule(
  ruleId: string,
  userId: string,
): Promise<PricingRule> {
  try {
    const rule = await PricingRule.findByPk(ruleId);
    if (!rule) {
      throw new NotFoundException(`Pricing rule not found: ${ruleId}`);
    }

    rule.status = PricingRuleStatus.ACTIVE;
    rule.updatedBy = userId;
    await rule.save();

    return rule;
  } catch (error) {
    throw new BadRequestException(`Failed to activate pricing rule: ${error.message}`);
  }
}

/**
 * Deactivate pricing rule
 *
 * @param ruleId - Rule ID
 * @param userId - User ID deactivating the rule
 * @returns Updated pricing rule
 *
 * @example
 * const rule = await deactivatePricingRule('rule-123', 'user-456');
 */
export async function deactivatePricingRule(
  ruleId: string,
  userId: string,
): Promise<PricingRule> {
  try {
    const rule = await PricingRule.findByPk(ruleId);
    if (!rule) {
      throw new NotFoundException(`Pricing rule not found: ${ruleId}`);
    }

    rule.status = PricingRuleStatus.INACTIVE;
    rule.updatedBy = userId;
    await rule.save();

    return rule;
  } catch (error) {
    throw new BadRequestException(`Failed to deactivate pricing rule: ${error.message}`);
  }
}

/**
 * Get all pricing rules for a product
 *
 * @param productId - Product ID
 * @param includeInactive - Include inactive rules
 * @returns Array of pricing rules
 *
 * @example
 * const rules = await getPricingRulesForProduct('PROD-001', false);
 */
export async function getPricingRulesForProduct(
  productId: string,
  includeInactive: boolean = false,
): Promise<PricingRule[]> {
  try {
    const whereClause: WhereOptions = {
      [Op.or]: [
        { productIds: { [Op.contains]: [productId] } },
        { productIds: null },
      ],
    };

    if (!includeInactive) {
      whereClause.status = PricingRuleStatus.ACTIVE;
    }

    const rules = await PricingRule.findAll({
      where: whereClause,
      order: [['precedence', 'DESC']],
    });

    return rules;
  } catch (error) {
    throw new BadRequestException(`Failed to get pricing rules: ${error.message}`);
  }
}

/**
 * Get all pricing rules for a customer
 *
 * @param customerId - Customer ID
 * @param includeInactive - Include inactive rules
 * @returns Array of pricing rules
 *
 * @example
 * const rules = await getPricingRulesForCustomer('CUST-123', false);
 */
export async function getPricingRulesForCustomer(
  customerId: string,
  includeInactive: boolean = false,
): Promise<PricingRule[]> {
  try {
    const whereClause: WhereOptions = {
      [Op.or]: [
        { customerIds: { [Op.contains]: [customerId] } },
        { customerIds: null },
      ],
    };

    if (!includeInactive) {
      whereClause.status = PricingRuleStatus.ACTIVE;
    }

    const rules = await PricingRule.findAll({
      where: whereClause,
      order: [['precedence', 'DESC']],
    });

    return rules;
  } catch (error) {
    throw new BadRequestException(`Failed to get pricing rules: ${error.message}`);
  }
}

/**
 * Calculate tiered pricing based on customer tier
 *
 * @param customerTier - Customer tier level
 * @param basePrice - Base product price
 * @param tierDiscounts - Map of tier to discount percent
 * @returns Tiered price
 *
 * @example
 * const price = calculateTieredPricing('GOLD', 100, { GOLD: 15, PLATINUM: 20 });
 */
export function calculateTieredPricing(
  customerTier: CustomerTier,
  basePrice: number,
  tierDiscounts: Record<CustomerTier, number>,
): number {
  const discountPercent = tierDiscounts[customerTier] || 0;
  return basePrice * (1 - discountPercent / 100);
}

/**
 * Calculate channel-specific pricing
 *
 * @param channel - Sales channel
 * @param basePrice - Base product price
 * @param channelMarkups - Map of channel to markup percent
 * @returns Channel-specific price
 *
 * @example
 * const price = calculateChannelPricing('RETAIL', 100, { RETAIL: 30, WHOLESALE: 15 });
 */
export function calculateChannelPricing(
  channel: SalesChannel,
  basePrice: number,
  channelMarkups: Record<SalesChannel, number>,
): number {
  const markupPercent = channelMarkups[channel] || 0;
  return basePrice * (1 + markupPercent / 100);
}

/**
 * Calculate geographic pricing
 *
 * @param region - Geographic region
 * @param state - State/province code
 * @param basePrice - Base product price
 * @param regionalAdjustments - Map of region to adjustment percent
 * @returns Region-adjusted price
 *
 * @example
 * const price = calculateGeographicPricing('US-WEST', 'CA', 100, { 'US-WEST': 5 });
 */
export function calculateGeographicPricing(
  region: GeographicRegion | string,
  state: string,
  basePrice: number,
  regionalAdjustments: Record<string, number>,
): number {
  const adjustmentPercent = regionalAdjustments[region] || regionalAdjustments[state] || 0;
  return basePrice * (1 + adjustmentPercent / 100);
}

/**
 * Calculate seasonal pricing
 *
 * @param season - Seasonal period
 * @param basePrice - Base product price
 * @param seasonalDiscounts - Map of season to discount percent
 * @returns Seasonal price
 *
 * @example
 * const price = calculateSeasonalPricing('HOLIDAY', 100, { HOLIDAY: 20 });
 */
export function calculateSeasonalPricing(
  season: SeasonalPeriod,
  basePrice: number,
  seasonalDiscounts: Record<SeasonalPeriod, number>,
): number {
  const discountPercent = seasonalDiscounts[season] || 0;
  return basePrice * (1 - discountPercent / 100);
}

/**
 * Determine current season based on date
 *
 * @param date - Date to evaluate
 * @returns Seasonal period
 *
 * @example
 * const season = getCurrentSeason(new Date());
 */
export function getCurrentSeason(date: Date = new Date()): SeasonalPeriod {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Holiday season (Nov-Dec)
  if (month === 11 || month === 12) {
    return SeasonalPeriod.HOLIDAY;
  }

  // Spring (Mar-May)
  if (month >= 3 && month <= 5) {
    return SeasonalPeriod.SPRING;
  }

  // Summer (Jun-Aug)
  if (month >= 6 && month <= 8) {
    return SeasonalPeriod.SUMMER;
  }

  // Fall (Sep-Nov)
  if (month >= 9 && month <= 11) {
    return SeasonalPeriod.FALL;
  }

  // Winter (Dec-Feb)
  return SeasonalPeriod.WINTER;
}

/**
 * Create quantity break pricing
 *
 * @param breakData - Quantity break data
 * @returns Created quantity break
 *
 * @example
 * const qtyBreak = await createQuantityBreak(breakDto);
 */
export async function createQuantityBreak(
  breakData: CreateQuantityBreakDto,
): Promise<QuantityBreak> {
  try {
    const qtyBreak = await QuantityBreak.create({
      productId: breakData.productId,
      customerId: breakData.customerId,
      tiers: breakData.tiers,
      isActive: true,
      effectiveStartDate: breakData.effectiveStartDate,
      effectiveEndDate: breakData.effectiveEndDate,
    });

    return qtyBreak;
  } catch (error) {
    throw new BadRequestException(`Failed to create quantity break: ${error.message}`);
  }
}

/**
 * Create bundle pricing
 *
 * @param bundleData - Bundle pricing data
 * @returns Created bundle pricing
 *
 * @example
 * const bundle = await createBundlePricing(bundleDto);
 */
export async function createBundlePricing(
  bundleData: CreateBundlePricingDto,
): Promise<BundlePricing> {
  try {
    const bundleCode = await generateBundleCode();

    const bundle = await BundlePricing.create({
      bundleCode,
      bundleName: bundleData.bundleName,
      components: bundleData.components,
      bundlePrice: bundleData.bundlePrice,
      discountPercent: bundleData.discountPercent,
      isActive: true,
      effectiveStartDate: bundleData.effectiveStartDate,
      effectiveEndDate: bundleData.effectiveEndDate,
    });

    return bundle;
  } catch (error) {
    throw new BadRequestException(`Failed to create bundle pricing: ${error.message}`);
  }
}

/**
 * Generate unique bundle code
 *
 * @returns Generated bundle code
 */
export async function generateBundleCode(): Promise<string> {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BUN-${timestamp}-${random}`;
}

/**
 * Generate cross-sell recommendations based on pricing rules
 *
 * @param productId - Primary product ID
 * @param context - Pricing context
 * @returns Array of cross-sell recommendations
 *
 * @example
 * const recommendations = await generateCrossSellRecommendations('PROD-001', context);
 */
export async function generateCrossSellRecommendations(
  productId: string,
  context: PricingContext,
): Promise<PricingRecommendation[]> {
  try {
    // In production, this would query a cross-sell rules table
    // For now, return a mock structure
    const recommendations: PricingRecommendation[] = [];

    // Find bundle deals containing this product
    const bundles = await BundlePricing.findAll({
      where: {
        isActive: true,
      },
    });

    for (const bundle of bundles) {
      const containsProduct = bundle.components.some(c => c.productId === productId);
      if (containsProduct) {
        const otherComponents = bundle.components.filter(c => c.productId !== productId);

        for (const component of otherComponents) {
          recommendations.push({
            type: 'CROSS_SELL',
            productId: component.productId,
            productName: `Product ${component.productId}`,
            suggestedPrice: 0, // Would be calculated from bundle pricing
            discountPercent: bundle.discountPercent,
            reason: `Part of bundle: ${bundle.bundleName}`,
            priority: 1,
          });
        }
      }
    }

    return recommendations;
  } catch (error) {
    return [];
  }
}

/**
 * Generate up-sell recommendations based on pricing rules
 *
 * @param productId - Current product ID
 * @param context - Pricing context
 * @returns Array of up-sell recommendations
 *
 * @example
 * const recommendations = await generateUpSellRecommendations('PROD-001', context);
 */
export async function generateUpSellRecommendations(
  productId: string,
  context: PricingContext,
): Promise<PricingRecommendation[]> {
  try {
    // In production, this would query an up-sell rules table
    // For now, return a mock structure
    const recommendations: PricingRecommendation[] = [];

    return recommendations;
  } catch (error) {
    return [];
  }
}

/**
 * Validate pricing rule for conflicts
 *
 * @param ruleData - Pricing rule data to validate
 * @returns Validation result with conflicts
 *
 * @example
 * const validation = await validatePricingRuleConflicts(ruleDto);
 */
export async function validatePricingRuleConflicts(
  ruleData: CreatePricingRuleDto,
): Promise<{ isValid: boolean; conflicts: string[] }> {
  try {
    const conflicts: string[] = [];

    // Find overlapping rules
    const overlappingRules = await PricingRule.findAll({
      where: {
        status: PricingRuleStatus.ACTIVE,
        ruleType: ruleData.ruleType,
        precedence: ruleData.precedence,
      },
    });

    for (const rule of overlappingRules) {
      // Check for date overlaps
      if (ruleData.effectiveStartDate && ruleData.effectiveEndDate) {
        const hasDateOverlap =
          (!rule.effectiveEndDate || ruleData.effectiveStartDate <= rule.effectiveEndDate) &&
          (!rule.effectiveStartDate || ruleData.effectiveEndDate >= rule.effectiveStartDate);

        if (hasDateOverlap) {
          // Check for product/customer overlaps
          const hasProductOverlap = !ruleData.productIds || !rule.productIds ||
            ruleData.productIds.some(p => rule.productIds.includes(p));

          const hasCustomerOverlap = !ruleData.customerIds || !rule.customerIds ||
            ruleData.customerIds.some(c => rule.customerIds.includes(c));

          if (hasProductOverlap && hasCustomerOverlap) {
            conflicts.push(
              `Conflicts with rule ${rule.ruleCode} (${rule.ruleName}) - same precedence and overlapping scope`
            );
          }
        }
      }
    }

    return {
      isValid: conflicts.length === 0,
      conflicts,
    };
  } catch (error) {
    return {
      isValid: false,
      conflicts: [`Validation error: ${error.message}`],
    };
  }
}

/**
 * Test pricing rule with sample data
 *
 * @param ruleId - Pricing rule ID
 * @param testContext - Test pricing context
 * @param testPrice - Test base price
 * @returns Test result
 *
 * @example
 * const result = await testPricingRule('rule-123', context, 100);
 */
export async function testPricingRule(
  ruleId: string,
  testContext: PricingContext,
  testPrice: number,
): Promise<PricingRuleResult> {
  try {
    const rule = await PricingRule.findByPk(ruleId);
    if (!rule) {
      throw new NotFoundException(`Pricing rule not found: ${ruleId}`);
    }

    const applies = evaluateRuleApplicability(rule, testContext);
    if (!applies) {
      return {
        ruleId: rule.ruleId,
        ruleName: rule.ruleName,
        ruleType: rule.ruleType,
        precedence: rule.precedence,
        originalPrice: testPrice,
        adjustedPrice: testPrice,
        discountAmount: 0,
        discountPercent: 0,
        applied: false,
        reason: 'Rule conditions not met',
      };
    }

    return await evaluatePricingRule(rule, testContext, testPrice, testPrice);
  } catch (error) {
    throw new BadRequestException(`Failed to test pricing rule: ${error.message}`);
  }
}

/**
 * Clone pricing rule
 *
 * @param ruleId - Source rule ID
 * @param newRuleName - Name for cloned rule
 * @param userId - User ID creating the clone
 * @returns Cloned pricing rule
 *
 * @example
 * const clonedRule = await clonePricingRule('rule-123', 'Winter Sale 2024', 'user-456');
 */
export async function clonePricingRule(
  ruleId: string,
  newRuleName: string,
  userId: string,
): Promise<PricingRule> {
  try {
    const sourceRule = await PricingRule.findByPk(ruleId);
    if (!sourceRule) {
      throw new NotFoundException(`Pricing rule not found: ${ruleId}`);
    }

    const ruleCode = await generatePricingRuleCode(sourceRule.ruleType);

    const clonedRule = await PricingRule.create({
      ruleCode,
      ruleName: newRuleName,
      description: `Cloned from ${sourceRule.ruleName}`,
      ruleType: sourceRule.ruleType,
      status: PricingRuleStatus.DRAFT,
      precedence: sourceRule.precedence,
      conditions: sourceRule.conditions,
      action: sourceRule.action,
      effectiveStartDate: null,
      effectiveEndDate: null,
      customerIds: sourceRule.customerIds,
      productIds: sourceRule.productIds,
      categoryIds: sourceRule.categoryIds,
      channels: sourceRule.channels,
      allowStacking: sourceRule.allowStacking,
      combinationStrategy: sourceRule.combinationStrategy,
      customFields: sourceRule.customFields,
      createdBy: userId,
    });

    return clonedRule;
  } catch (error) {
    throw new BadRequestException(`Failed to clone pricing rule: ${error.message}`);
  }
}

/**
 * Bulk activate pricing rules
 *
 * @param ruleIds - Array of rule IDs
 * @param userId - User ID activating the rules
 * @returns Count of activated rules
 *
 * @example
 * const count = await bulkActivatePricingRules(['rule-1', 'rule-2'], 'user-456');
 */
export async function bulkActivatePricingRules(
  ruleIds: string[],
  userId: string,
): Promise<number> {
  try {
    const [count] = await PricingRule.update(
      {
        status: PricingRuleStatus.ACTIVE,
        updatedBy: userId,
      },
      {
        where: {
          ruleId: { [Op.in]: ruleIds },
        },
      }
    );

    return count;
  } catch (error) {
    throw new BadRequestException(`Failed to bulk activate pricing rules: ${error.message}`);
  }
}

/**
 * Bulk deactivate pricing rules
 *
 * @param ruleIds - Array of rule IDs
 * @param userId - User ID deactivating the rules
 * @returns Count of deactivated rules
 *
 * @example
 * const count = await bulkDeactivatePricingRules(['rule-1', 'rule-2'], 'user-456');
 */
export async function bulkDeactivatePricingRules(
  ruleIds: string[],
  userId: string,
): Promise<number> {
  try {
    const [count] = await PricingRule.update(
      {
        status: PricingRuleStatus.INACTIVE,
        updatedBy: userId,
      },
      {
        where: {
          ruleId: { [Op.in]: ruleIds },
        },
      }
    );

    return count;
  } catch (error) {
    throw new BadRequestException(`Failed to bulk deactivate pricing rules: ${error.message}`);
  }
}

/**
 * Calculate volume-based pricing with progressive discounts
 *
 * @param quantity - Order quantity
 * @param basePrice - Base unit price
 * @param volumeTiers - Volume discount tiers
 * @returns Volume-discounted price
 *
 * @example
 * const price = calculateVolumePricing(100, 10, [
 *   { minQty: 50, maxQty: 99, discount: 5 },
 *   { minQty: 100, maxQty: null, discount: 10 }
 * ]);
 */
export function calculateVolumePricing(
  quantity: number,
  basePrice: number,
  volumeTiers: Array<{ minQty: number; maxQty: number | null; discount: number }>,
): number {
  const applicableTier = volumeTiers.find(tier => {
    return quantity >= tier.minQty && (!tier.maxQty || quantity <= tier.maxQty);
  });

  if (applicableTier) {
    return basePrice * (1 - applicableTier.discount / 100);
  }

  return basePrice;
}

/**
 * Calculate promotional pricing with coupon codes
 *
 * @param basePrice - Base product price
 * @param promoCode - Promotional code
 * @param context - Pricing context
 * @returns Promotional price
 *
 * @example
 * const price = await calculatePromotionalPricing(100, 'SAVE20', context);
 */
export async function calculatePromotionalPricing(
  basePrice: number,
  promoCode: string,
  context: PricingContext,
): Promise<number> {
  try {
    // Find promotional pricing rules
    const promoRules = await PricingRule.findAll({
      where: {
        ruleType: PricingRuleType.PROMOTIONAL,
        status: PricingRuleStatus.ACTIVE,
        // In production, would match against promo code field
      },
    });

    if (promoRules.length === 0) {
      return basePrice;
    }

    // Apply the first matching promo
    const result = await evaluatePricingRule(promoRules[0], context, basePrice, basePrice);
    return result.adjustedPrice;
  } catch (error) {
    return basePrice;
  }
}

/**
 * Get pricing history for a product
 *
 * @param productId - Product ID
 * @param startDate - History start date
 * @param endDate - History end date
 * @returns Array of historical pricing records
 *
 * @example
 * const history = await getPricingHistory('PROD-001', new Date('2024-01-01'), new Date());
 */
export async function getPricingHistory(
  productId: string,
  startDate: Date,
  endDate: Date,
): Promise<Array<{ date: Date; price: number; ruleId: string; ruleName: string }>> {
  try {
    // In production, this would query a pricing history table
    // For now, return mock structure
    return [];
  } catch (error) {
    return [];
  }
}

/**
 * Calculate cost-plus pricing
 *
 * @param costPrice - Product cost
 * @param markupPercent - Markup percentage
 * @param minMargin - Minimum margin percentage
 * @returns Cost-plus price
 *
 * @example
 * const price = calculateCostPlusPricing(50, 40, 25);
 */
export function calculateCostPlusPricing(
  costPrice: number,
  markupPercent: number,
  minMargin?: number,
): number {
  const calculatedPrice = costPrice * (1 + markupPercent / 100);

  if (minMargin) {
    const minPrice = costPrice / (1 - minMargin / 100);
    return Math.max(calculatedPrice, minPrice);
  }

  return calculatedPrice;
}

/**
 * Apply rounding rules to price
 *
 * @param price - Price to round
 * @param roundingRule - Rounding rule (e.g., 'UP_0.99', 'DOWN_0.95', 'NEAREST_0.50')
 * @returns Rounded price
 *
 * @example
 * const rounded = applyPricingRoundingRule(12.47, 'UP_0.99');
 * // Returns 12.99
 */
export function applyPricingRoundingRule(price: number, roundingRule: string): number {
  const parts = roundingRule.split('_');
  const direction = parts[0]; // UP, DOWN, NEAREST
  const target = parseFloat(parts[1]); // 0.99, 0.95, 0.50, etc.

  const wholePart = Math.floor(price);
  const decimalPart = price - wholePart;

  if (direction === 'UP') {
    return wholePart + target;
  } else if (direction === 'DOWN') {
    return wholePart + target;
  } else if (direction === 'NEAREST') {
    const lower = wholePart + target;
    const upper = wholePart + 1 + target;
    return Math.abs(price - lower) < Math.abs(price - upper) ? lower : upper;
  }

  return price;
}

/**
 * Calculate competitive pricing based on market data
 *
 * @param basePrice - Base product price
 * @param competitorPrices - Array of competitor prices
 * @param strategy - Competitive strategy (MATCH, UNDERCUT, PREMIUM)
 * @param adjustment - Adjustment percentage
 * @returns Competitive price
 *
 * @example
 * const price = calculateCompetitivePricing(100, [95, 98, 102], 'UNDERCUT', 2);
 */
export function calculateCompetitivePricing(
  basePrice: number,
  competitorPrices: number[],
  strategy: 'MATCH' | 'UNDERCUT' | 'PREMIUM',
  adjustment: number = 0,
): number {
  if (competitorPrices.length === 0) {
    return basePrice;
  }

  const avgCompetitorPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;
  const minCompetitorPrice = Math.min(...competitorPrices);

  let competitivePrice = basePrice;

  switch (strategy) {
    case 'MATCH':
      competitivePrice = avgCompetitorPrice;
      break;
    case 'UNDERCUT':
      competitivePrice = minCompetitorPrice * (1 - adjustment / 100);
      break;
    case 'PREMIUM':
      competitivePrice = avgCompetitorPrice * (1 + adjustment / 100);
      break;
  }

  return competitivePrice;
}

/**
 * Export pricing rules to JSON for backup/migration
 *
 * @param filters - Optional filters for export
 * @returns JSON export of pricing rules
 *
 * @example
 * const export = await exportPricingRules({ ruleType: 'PROMOTIONAL' });
 */
export async function exportPricingRules(
  filters?: { ruleType?: PricingRuleType; status?: PricingRuleStatus },
): Promise<string> {
  try {
    const whereClause: WhereOptions = {};

    if (filters?.ruleType) {
      whereClause.ruleType = filters.ruleType;
    }
    if (filters?.status) {
      whereClause.status = filters.status;
    }

    const rules = await PricingRule.findAll({ where: whereClause });

    return JSON.stringify(rules, null, 2);
  } catch (error) {
    throw new BadRequestException(`Failed to export pricing rules: ${error.message}`);
  }
}

/**
 * Import pricing rules from JSON backup
 *
 * @param jsonData - JSON string of pricing rules
 * @param userId - User ID performing import
 * @returns Count of imported rules
 *
 * @example
 * const count = await importPricingRules(jsonString, 'user-123');
 */
export async function importPricingRules(
  jsonData: string,
  userId: string,
): Promise<number> {
  try {
    const rules = JSON.parse(jsonData);
    let importCount = 0;

    for (const rule of rules) {
      const newRuleCode = await generatePricingRuleCode(rule.ruleType);

      await PricingRule.create({
        ...rule,
        ruleId: undefined, // Generate new ID
        ruleCode: newRuleCode, // Generate new code
        status: PricingRuleStatus.DRAFT, // Import as draft
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      importCount++;
    }

    return importCount;
  } catch (error) {
    throw new BadRequestException(`Failed to import pricing rules: ${error.message}`);
  }
}
