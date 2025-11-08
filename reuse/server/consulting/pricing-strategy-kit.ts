/**
 * LOC: CONS-PRI-STR-001
 * File: /reuse/server/consulting/pricing-strategy-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *   - @nestjs/swagger (ApiProperty, ApiResponse)
 *   - class-validator (decorators)
 *   - class-transformer (Type, Transform)
 *
 * DOWNSTREAM (imported by):
 *   - backend/consulting/pricing.service.ts
 *   - backend/consulting/revenue-optimization.controller.ts
 *   - backend/consulting/pricing-analytics.service.ts
 */

/**
 * File: /reuse/server/consulting/pricing-strategy-kit.ts
 * Locator: WC-CONS-PRICING-001
 * Purpose: Enterprise-grade Pricing Strategy Kit - price elasticity, competitive pricing, value-based pricing, optimization, waterfall analysis
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, class-validator 0.14.x, class-transformer 0.5.x
 * Downstream: Consulting services, pricing controllers, revenue optimization processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 42 production-ready functions for pricing strategy competing with McKinsey, BCG, Bain pricing tools
 *
 * LLM Context: Comprehensive pricing strategy utilities for production-ready management consulting applications.
 * Provides price elasticity analysis, competitive pricing benchmarks, value-based pricing frameworks, price optimization,
 * discount management, pricing waterfall analysis, price segmentation, psychological pricing, dynamic pricing,
 * price bundling strategies, revenue management, margin analysis, and promotional pricing effectiveness.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsObject,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Pricing strategy types
 */
export enum PricingStrategy {
  COST_PLUS = 'cost_plus',
  VALUE_BASED = 'value_based',
  COMPETITIVE = 'competitive',
  PENETRATION = 'penetration',
  SKIMMING = 'skimming',
  DYNAMIC = 'dynamic',
  FREEMIUM = 'freemium',
  PSYCHOLOGICAL = 'psychological',
  BUNDLE = 'bundle',
  TIERED = 'tiered',
}

/**
 * Price elasticity categories
 */
export enum PriceElasticity {
  PERFECTLY_ELASTIC = 'perfectly_elastic',
  ELASTIC = 'elastic',
  UNIT_ELASTIC = 'unit_elastic',
  INELASTIC = 'inelastic',
  PERFECTLY_INELASTIC = 'perfectly_inelastic',
}

/**
 * Pricing waterfall components
 */
export enum WaterfallComponent {
  LIST_PRICE = 'list_price',
  INVOICE_DISCOUNT = 'invoice_discount',
  OFF_INVOICE_DISCOUNT = 'off_invoice_discount',
  REBATE = 'rebate',
  PROMOTIONAL_ALLOWANCE = 'promotional_allowance',
  PAYMENT_TERMS = 'payment_terms',
  FREIGHT = 'freight',
  POCKET_PRICE = 'pocket_price',
}

/**
 * Customer price segments
 */
export enum PriceSegment {
  PREMIUM = 'premium',
  MID_MARKET = 'mid_market',
  VALUE = 'value',
  ECONOMY = 'economy',
  ENTERPRISE = 'enterprise',
  SMB = 'smb',
  CUSTOM = 'custom',
}

/**
 * Discount types
 */
export enum DiscountType {
  VOLUME = 'volume',
  EARLY_PAYMENT = 'early_payment',
  SEASONAL = 'seasonal',
  PROMOTIONAL = 'promotional',
  LOYALTY = 'loyalty',
  BUNDLE = 'bundle',
  CONTRACT = 'contract',
  NEGOTIATED = 'negotiated',
}

/**
 * Competitive position
 */
export enum CompetitivePosition {
  PREMIUM = 'premium',
  PARITY = 'parity',
  DISCOUNT = 'discount',
  PENETRATION = 'penetration',
}

/**
 * Price optimization objective
 */
export enum OptimizationObjective {
  MAXIMIZE_REVENUE = 'maximize_revenue',
  MAXIMIZE_PROFIT = 'maximize_profit',
  MAXIMIZE_VOLUME = 'maximize_volume',
  MAXIMIZE_MARKET_SHARE = 'maximize_market_share',
  TARGET_MARGIN = 'target_margin',
}

/**
 * Psychological pricing tactics
 */
export enum PsychologicalTactic {
  CHARM_PRICING = 'charm_pricing', // $9.99
  PRESTIGE_PRICING = 'prestige_pricing', // $10.00
  ANCHOR_PRICING = 'anchor_pricing',
  DECOY_PRICING = 'decoy_pricing',
  BUNDLE_PRICING = 'bundle_pricing',
  SCARCITY_PRICING = 'scarcity_pricing',
}

/**
 * Pricing analysis status
 */
export enum AnalysisStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  APPROVED = 'approved',
  IMPLEMENTED = 'implemented',
  ARCHIVED = 'archived',
}

/**
 * Revenue metric types
 */
export enum RevenueMetric {
  GROSS_REVENUE = 'gross_revenue',
  NET_REVENUE = 'net_revenue',
  POCKET_REVENUE = 'pocket_revenue',
  RECURRING_REVENUE = 'recurring_revenue',
  AVERAGE_REVENUE_PER_USER = 'average_revenue_per_user',
}

// ============================================================================
// INTERFACE DEFINITIONS
// ============================================================================

interface PricingStrategyData {
  strategyId: string;
  organizationId: string;
  productId?: string;
  serviceId?: string;
  strategyType: PricingStrategy;
  name: string;
  description: string;
  targetSegment: PriceSegment;
  basePrice: number;
  currency: string;
  effectiveDate: Date;
  expirationDate?: Date;
  status: AnalysisStatus;
  objectives: OptimizationObjective[];
  competitivePosition: CompetitivePosition;
  metadata?: Record<string, any>;
}

interface PriceElasticityData {
  elasticityId: string;
  organizationId: string;
  productId: string;
  segment: PriceSegment;
  elasticityCoefficient: number;
  elasticityCategory: PriceElasticity;
  priceRange: { min: number; max: number };
  demandCurve: Array<{ price: number; quantity: number }>;
  confidenceInterval: number;
  analysisDate: Date;
  dataPoints: number;
  methodology: string;
  metadata?: Record<string, any>;
}

interface CompetitivePricingData {
  benchmarkId: string;
  organizationId: string;
  productId: string;
  competitorId: string;
  competitorName: string;
  competitorPrice: number;
  ourPrice: number;
  priceDifference: number;
  priceDifferencePercent: number;
  competitivePosition: CompetitivePosition;
  featureComparison: Record<string, any>;
  valueScore: number;
  benchmarkDate: Date;
  dataSource: string;
  metadata?: Record<string, any>;
}

interface PricingWaterfallData {
  waterfallId: string;
  organizationId: string;
  productId: string;
  customerId?: string;
  segment: PriceSegment;
  listPrice: number;
  invoiceDiscount: number;
  offInvoiceDiscount: number;
  rebates: number;
  promotionalAllowances: number;
  paymentTermsDiscount: number;
  freight: number;
  pocketPrice: number;
  pocketMargin: number;
  leakagePercent: number;
  analysisDate: Date;
  components: Array<{ type: WaterfallComponent; amount: number; percent: number }>;
  metadata?: Record<string, any>;
}

interface DiscountStructureData {
  discountId: string;
  organizationId: string;
  discountType: DiscountType;
  name: string;
  description: string;
  discountPercent?: number;
  discountAmount?: number;
  minimumQuantity?: number;
  minimumValue?: number;
  eligibleSegments: PriceSegment[];
  effectiveDate: Date;
  expirationDate?: Date;
  isActive: boolean;
  usageCount: number;
  totalDiscount: number;
  metadata?: Record<string, any>;
}

interface PriceOptimizationData {
  optimizationId: string;
  organizationId: string;
  productId: string;
  objective: OptimizationObjective;
  currentPrice: number;
  optimizedPrice: number;
  priceChange: number;
  priceChangePercent: number;
  expectedRevenue: number;
  expectedProfit: number;
  expectedVolume: number;
  confidenceLevel: number;
  constraints: Record<string, any>;
  assumptions: string[];
  sensitivityAnalysis: Record<string, any>;
  analysisDate: Date;
  implementationDate?: Date;
  metadata?: Record<string, any>;
}

interface ValueBasedPricingData {
  valueId: string;
  organizationId: string;
  productId: string;
  segment: PriceSegment;
  economicValue: number;
  perceivedValue: number;
  differentiationValue: number;
  competitiveAlternativePrice: number;
  valueDrivers: Array<{ driver: string; value: number; weight: number }>;
  willingness ToPay: number;
  recommendedPrice: number;
  valueCapturePercent: number;
  analysisDate: Date;
  metadata?: Record<string, any>;
}

interface PriceSegmentationData {
  segmentationId: string;
  organizationId: string;
  productId: string;
  segment: PriceSegment;
  segmentName: string;
  customerCount: number;
  revenueContribution: number;
  pricePoint: number;
  priceFloor: number;
  priceCeiling: number;
  willingnessToPay: number;
  priceSensitivity: number;
  characteristics: Record<string, any>;
  targetMargin: number;
  metadata?: Record<string, any>;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

/**
 * DTO for creating a pricing strategy
 */
export class CreatePricingStrategyDto {
  @ApiProperty({ description: 'Organization ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @ApiProperty({ description: 'Product ID', example: '550e8400-e29b-41d4-a716-446655440001', required: false })
  @IsUUID()
  @IsOptional()
  productId?: string;

  @ApiProperty({ description: 'Service ID', example: '550e8400-e29b-41d4-a716-446655440002', required: false })
  @IsUUID()
  @IsOptional()
  serviceId?: string;

  @ApiProperty({ description: 'Pricing strategy type', enum: PricingStrategy })
  @IsEnum(PricingStrategy)
  @IsNotEmpty()
  strategyType!: PricingStrategy;

  @ApiProperty({ description: 'Strategy name', example: 'Premium Value Strategy' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ description: 'Strategy description' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ description: 'Target price segment', enum: PriceSegment })
  @IsEnum(PriceSegment)
  @IsNotEmpty()
  targetSegment!: PriceSegment;

  @ApiProperty({ description: 'Base price', example: 99.99 })
  @IsNumber()
  @Min(0)
  basePrice!: number;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  @IsString()
  @MaxLength(3)
  currency!: string;

  @ApiProperty({ description: 'Effective date' })
  @IsDate()
  @Type(() => Date)
  effectiveDate!: Date;

  @ApiProperty({ description: 'Expiration date', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  expirationDate?: Date;

  @ApiProperty({ description: 'Optimization objectives', enum: OptimizationObjective, isArray: true })
  @IsArray()
  @IsEnum(OptimizationObjective, { each: true })
  objectives!: OptimizationObjective[];

  @ApiProperty({ description: 'Competitive position', enum: CompetitivePosition })
  @IsEnum(CompetitivePosition)
  competitivePosition!: CompetitivePosition;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for price elasticity analysis
 */
export class CreatePriceElasticityDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ description: 'Customer segment', enum: PriceSegment })
  @IsEnum(PriceSegment)
  @IsNotEmpty()
  segment!: PriceSegment;

  @ApiProperty({ description: 'Elasticity coefficient', example: -1.5 })
  @IsNumber()
  elasticityCoefficient!: number;

  @ApiProperty({ description: 'Price range for analysis' })
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  priceRange!: { min: number; max: number };

  @ApiProperty({ description: 'Demand curve data points' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  demandCurve!: Array<{ price: number; quantity: number }>;

  @ApiProperty({ description: 'Confidence interval', example: 0.95 })
  @IsNumber()
  @Min(0)
  @Max(1)
  confidenceInterval!: number;

  @ApiProperty({ description: 'Number of data points used', example: 1000 })
  @IsNumber()
  @Min(1)
  dataPoints!: number;

  @ApiProperty({ description: 'Analysis methodology', example: 'Linear regression' })
  @IsString()
  @IsNotEmpty()
  methodology!: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for competitive pricing benchmark
 */
export class CreateCompetitivePricingDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ description: 'Competitor ID' })
  @IsUUID()
  @IsNotEmpty()
  competitorId!: string;

  @ApiProperty({ description: 'Competitor name', example: 'Acme Corp' })
  @IsString()
  @IsNotEmpty()
  competitorName!: string;

  @ApiProperty({ description: 'Competitor price', example: 89.99 })
  @IsNumber()
  @Min(0)
  competitorPrice!: number;

  @ApiProperty({ description: 'Our price', example: 99.99 })
  @IsNumber()
  @Min(0)
  ourPrice!: number;

  @ApiProperty({ description: 'Feature comparison matrix' })
  @IsObject()
  @IsNotEmpty()
  featureComparison!: Record<string, any>;

  @ApiProperty({ description: 'Value score (0-100)', example: 85 })
  @IsNumber()
  @Min(0)
  @Max(100)
  valueScore!: number;

  @ApiProperty({ description: 'Benchmark date' })
  @IsDate()
  @Type(() => Date)
  benchmarkDate!: Date;

  @ApiProperty({ description: 'Data source', example: 'Public website' })
  @IsString()
  @IsNotEmpty()
  dataSource!: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for pricing waterfall analysis
 */
export class CreatePricingWaterfallDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ description: 'Customer ID', required: false })
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @ApiProperty({ description: 'Price segment', enum: PriceSegment })
  @IsEnum(PriceSegment)
  @IsNotEmpty()
  segment!: PriceSegment;

  @ApiProperty({ description: 'List price', example: 100.00 })
  @IsNumber()
  @Min(0)
  listPrice!: number;

  @ApiProperty({ description: 'Invoice discount', example: 5.00 })
  @IsNumber()
  @Min(0)
  invoiceDiscount!: number;

  @ApiProperty({ description: 'Off-invoice discount', example: 3.00 })
  @IsNumber()
  @Min(0)
  offInvoiceDiscount!: number;

  @ApiProperty({ description: 'Rebates', example: 2.00 })
  @IsNumber()
  @Min(0)
  rebates!: number;

  @ApiProperty({ description: 'Promotional allowances', example: 1.50 })
  @IsNumber()
  @Min(0)
  promotionalAllowances!: number;

  @ApiProperty({ description: 'Payment terms discount', example: 1.00 })
  @IsNumber()
  @Min(0)
  paymentTermsDiscount!: number;

  @ApiProperty({ description: 'Freight cost', example: 2.50 })
  @IsNumber()
  @Min(0)
  freight!: number;

  @ApiProperty({ description: 'Waterfall components breakdown' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  components!: Array<{ type: WaterfallComponent; amount: number; percent: number }>;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for discount structure
 */
export class CreateDiscountStructureDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @ApiProperty({ description: 'Discount type', enum: DiscountType })
  @IsEnum(DiscountType)
  @IsNotEmpty()
  discountType!: DiscountType;

  @ApiProperty({ description: 'Discount name', example: 'Volume Discount - 1000+ units' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ description: 'Discount description' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ description: 'Discount percentage', example: 15, required: false })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  discountPercent?: number;

  @ApiProperty({ description: 'Discount amount', example: 10.00, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @ApiProperty({ description: 'Minimum quantity', example: 1000, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minimumQuantity?: number;

  @ApiProperty({ description: 'Minimum value', example: 10000.00, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minimumValue?: number;

  @ApiProperty({ description: 'Eligible segments', enum: PriceSegment, isArray: true })
  @IsArray()
  @IsEnum(PriceSegment, { each: true })
  eligibleSegments!: PriceSegment[];

  @ApiProperty({ description: 'Effective date' })
  @IsDate()
  @Type(() => Date)
  effectiveDate!: Date;

  @ApiProperty({ description: 'Expiration date', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  expirationDate?: Date;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for price optimization
 */
export class CreatePriceOptimizationDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ description: 'Optimization objective', enum: OptimizationObjective })
  @IsEnum(OptimizationObjective)
  @IsNotEmpty()
  objective!: OptimizationObjective;

  @ApiProperty({ description: 'Current price', example: 99.99 })
  @IsNumber()
  @Min(0)
  currentPrice!: number;

  @ApiProperty({ description: 'Optimized price', example: 109.99 })
  @IsNumber()
  @Min(0)
  optimizedPrice!: number;

  @ApiProperty({ description: 'Expected revenue', example: 1500000 })
  @IsNumber()
  @Min(0)
  expectedRevenue!: number;

  @ApiProperty({ description: 'Expected profit', example: 450000 })
  @IsNumber()
  expectedProfit!: number;

  @ApiProperty({ description: 'Expected volume', example: 15000 })
  @IsNumber()
  @Min(0)
  expectedVolume!: number;

  @ApiProperty({ description: 'Confidence level', example: 0.90 })
  @IsNumber()
  @Min(0)
  @Max(1)
  confidenceLevel!: number;

  @ApiProperty({ description: 'Optimization constraints' })
  @IsObject()
  @IsNotEmpty()
  constraints!: Record<string, any>;

  @ApiProperty({ description: 'Analysis assumptions' })
  @IsArray()
  @IsString({ each: true })
  assumptions!: string[];

  @ApiProperty({ description: 'Sensitivity analysis results' })
  @IsObject()
  @IsNotEmpty()
  sensitivityAnalysis!: Record<string, any>;

  @ApiProperty({ description: 'Implementation date', required: false })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  implementationDate?: Date;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for value-based pricing
 */
export class CreateValueBasedPricingDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ description: 'Customer segment', enum: PriceSegment })
  @IsEnum(PriceSegment)
  @IsNotEmpty()
  segment!: PriceSegment;

  @ApiProperty({ description: 'Economic value to customer', example: 150000 })
  @IsNumber()
  @Min(0)
  economicValue!: number;

  @ApiProperty({ description: 'Perceived value', example: 120000 })
  @IsNumber()
  @Min(0)
  perceivedValue!: number;

  @ApiProperty({ description: 'Differentiation value', example: 30000 })
  @IsNumber()
  @Min(0)
  differentiationValue!: number;

  @ApiProperty({ description: 'Competitive alternative price', example: 100000 })
  @IsNumber()
  @Min(0)
  competitiveAlternativePrice!: number;

  @ApiProperty({ description: 'Value drivers with weights' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  valueDrivers!: Array<{ driver: string; value: number; weight: number }>;

  @ApiProperty({ description: 'Willingness to pay', example: 125000 })
  @IsNumber()
  @Min(0)
  willingnessToPay!: number;

  @ApiProperty({ description: 'Recommended price', example: 115000 })
  @IsNumber()
  @Min(0)
  recommendedPrice!: number;

  @ApiProperty({ description: 'Value capture percentage', example: 76.67 })
  @IsNumber()
  @Min(0)
  @Max(100)
  valueCapturePercent!: number;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for price segmentation
 */
export class CreatePriceSegmentationDto {
  @ApiProperty({ description: 'Organization ID' })
  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ description: 'Price segment', enum: PriceSegment })
  @IsEnum(PriceSegment)
  @IsNotEmpty()
  segment!: PriceSegment;

  @ApiProperty({ description: 'Segment name', example: 'Enterprise Customers' })
  @IsString()
  @IsNotEmpty()
  segmentName!: string;

  @ApiProperty({ description: 'Customer count in segment', example: 250 })
  @IsNumber()
  @Min(0)
  customerCount!: number;

  @ApiProperty({ description: 'Revenue contribution', example: 2500000 })
  @IsNumber()
  @Min(0)
  revenueContribution!: number;

  @ApiProperty({ description: 'Price point for segment', example: 10000 })
  @IsNumber()
  @Min(0)
  pricePoint!: number;

  @ApiProperty({ description: 'Price floor', example: 8000 })
  @IsNumber()
  @Min(0)
  priceFloor!: number;

  @ApiProperty({ description: 'Price ceiling', example: 15000 })
  @IsNumber()
  @Min(0)
  priceCeiling!: number;

  @ApiProperty({ description: 'Willingness to pay', example: 12000 })
  @IsNumber()
  @Min(0)
  willingnessToPay!: number;

  @ApiProperty({ description: 'Price sensitivity (0-100)', example: 35 })
  @IsNumber()
  @Min(0)
  @Max(100)
  priceSensitivity!: number;

  @ApiProperty({ description: 'Segment characteristics' })
  @IsObject()
  @IsNotEmpty()
  characteristics!: Record<string, any>;

  @ApiProperty({ description: 'Target margin percentage', example: 45 })
  @IsNumber()
  @Min(0)
  @Max(100)
  targetMargin!: number;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Pricing Strategy Model
 */
export class PricingStrategyModel extends Model<PricingStrategyData> implements PricingStrategyData {
  declare strategyId: string;
  declare organizationId: string;
  declare productId?: string;
  declare serviceId?: string;
  declare strategyType: PricingStrategy;
  declare name: string;
  declare description: string;
  declare targetSegment: PriceSegment;
  declare basePrice: number;
  declare currency: string;
  declare effectiveDate: Date;
  declare expirationDate?: Date;
  declare status: AnalysisStatus;
  declare objectives: OptimizationObjective[];
  declare competitivePosition: CompetitivePosition;
  declare metadata?: Record<string, any>;

  static initialize(sequelize: Sequelize): typeof PricingStrategyModel {
    PricingStrategyModel.init(
      {
        strategyId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        serviceId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        strategyType: {
          type: DataTypes.ENUM(...Object.values(PricingStrategy)),
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        targetSegment: {
          type: DataTypes.ENUM(...Object.values(PriceSegment)),
          allowNull: false,
        },
        basePrice: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        currency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          defaultValue: 'USD',
        },
        effectiveDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        expirationDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM(...Object.values(AnalysisStatus)),
          allowNull: false,
          defaultValue: AnalysisStatus.DRAFT,
        },
        objectives: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
        },
        competitivePosition: {
          type: DataTypes.ENUM(...Object.values(CompetitivePosition)),
          allowNull: false,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'pricing_strategies',
        timestamps: true,
        indexes: [
          { fields: ['organizationId'] },
          { fields: ['productId'] },
          { fields: ['strategyType'] },
          { fields: ['targetSegment'] },
          { fields: ['effectiveDate'] },
        ],
      }
    );

    return PricingStrategyModel;
  }
}

/**
 * Price Elasticity Model
 */
export class PriceElasticityModel extends Model<PriceElasticityData> implements PriceElasticityData {
  declare elasticityId: string;
  declare organizationId: string;
  declare productId: string;
  declare segment: PriceSegment;
  declare elasticityCoefficient: number;
  declare elasticityCategory: PriceElasticity;
  declare priceRange: { min: number; max: number };
  declare demandCurve: Array<{ price: number; quantity: number }>;
  declare confidenceInterval: number;
  declare analysisDate: Date;
  declare dataPoints: number;
  declare methodology: string;
  declare metadata?: Record<string, any>;

  static initialize(sequelize: Sequelize): typeof PriceElasticityModel {
    PriceElasticityModel.init(
      {
        elasticityId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        segment: {
          type: DataTypes.ENUM(...Object.values(PriceSegment)),
          allowNull: false,
        },
        elasticityCoefficient: {
          type: DataTypes.DECIMAL(10, 4),
          allowNull: false,
        },
        elasticityCategory: {
          type: DataTypes.ENUM(...Object.values(PriceElasticity)),
          allowNull: false,
        },
        priceRange: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        demandCurve: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        confidenceInterval: {
          type: DataTypes.DECIMAL(5, 4),
          allowNull: false,
        },
        analysisDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        dataPoints: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        methodology: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'price_elasticities',
        timestamps: true,
        indexes: [
          { fields: ['organizationId'] },
          { fields: ['productId'] },
          { fields: ['segment'] },
          { fields: ['analysisDate'] },
        ],
      }
    );

    return PriceElasticityModel;
  }
}

/**
 * Competitive Pricing Model
 */
export class CompetitivePricingModel extends Model<CompetitivePricingData> implements CompetitivePricingData {
  declare benchmarkId: string;
  declare organizationId: string;
  declare productId: string;
  declare competitorId: string;
  declare competitorName: string;
  declare competitorPrice: number;
  declare ourPrice: number;
  declare priceDifference: number;
  declare priceDifferencePercent: number;
  declare competitivePosition: CompetitivePosition;
  declare featureComparison: Record<string, any>;
  declare valueScore: number;
  declare benchmarkDate: Date;
  declare dataSource: string;
  declare metadata?: Record<string, any>;

  static initialize(sequelize: Sequelize): typeof CompetitivePricingModel {
    CompetitivePricingModel.init(
      {
        benchmarkId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        competitorId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        competitorName: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        competitorPrice: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        ourPrice: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        priceDifference: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        priceDifferencePercent: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        competitivePosition: {
          type: DataTypes.ENUM(...Object.values(CompetitivePosition)),
          allowNull: false,
        },
        featureComparison: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        valueScore: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
        },
        benchmarkDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        dataSource: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'competitive_pricing',
        timestamps: true,
        indexes: [
          { fields: ['organizationId'] },
          { fields: ['productId'] },
          { fields: ['competitorId'] },
          { fields: ['benchmarkDate'] },
        ],
      }
    );

    return CompetitivePricingModel;
  }
}

/**
 * Pricing Waterfall Model
 */
export class PricingWaterfallModel extends Model<PricingWaterfallData> implements PricingWaterfallData {
  declare waterfallId: string;
  declare organizationId: string;
  declare productId: string;
  declare customerId?: string;
  declare segment: PriceSegment;
  declare listPrice: number;
  declare invoiceDiscount: number;
  declare offInvoiceDiscount: number;
  declare rebates: number;
  declare promotionalAllowances: number;
  declare paymentTermsDiscount: number;
  declare freight: number;
  declare pocketPrice: number;
  declare pocketMargin: number;
  declare leakagePercent: number;
  declare analysisDate: Date;
  declare components: Array<{ type: WaterfallComponent; amount: number; percent: number }>;
  declare metadata?: Record<string, any>;

  static initialize(sequelize: Sequelize): typeof PricingWaterfallModel {
    PricingWaterfallModel.init(
      {
        waterfallId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        customerId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        segment: {
          type: DataTypes.ENUM(...Object.values(PriceSegment)),
          allowNull: false,
        },
        listPrice: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        invoiceDiscount: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0,
        },
        offInvoiceDiscount: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0,
        },
        rebates: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0,
        },
        promotionalAllowances: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0,
        },
        paymentTermsDiscount: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0,
        },
        freight: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0,
        },
        pocketPrice: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        pocketMargin: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        leakagePercent: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        analysisDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        components: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'pricing_waterfalls',
        timestamps: true,
        indexes: [
          { fields: ['organizationId'] },
          { fields: ['productId'] },
          { fields: ['customerId'] },
          { fields: ['segment'] },
          { fields: ['analysisDate'] },
        ],
      }
    );

    return PricingWaterfallModel;
  }
}

/**
 * Discount Structure Model
 */
export class DiscountStructureModel extends Model<DiscountStructureData> implements DiscountStructureData {
  declare discountId: string;
  declare organizationId: string;
  declare discountType: DiscountType;
  declare name: string;
  declare description: string;
  declare discountPercent?: number;
  declare discountAmount?: number;
  declare minimumQuantity?: number;
  declare minimumValue?: number;
  declare eligibleSegments: PriceSegment[];
  declare effectiveDate: Date;
  declare expirationDate?: Date;
  declare isActive: boolean;
  declare usageCount: number;
  declare totalDiscount: number;
  declare metadata?: Record<string, any>;

  static initialize(sequelize: Sequelize): typeof DiscountStructureModel {
    DiscountStructureModel.init(
      {
        discountId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        discountType: {
          type: DataTypes.ENUM(...Object.values(DiscountType)),
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        discountPercent: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: true,
        },
        discountAmount: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: true,
        },
        minimumQuantity: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        minimumValue: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: true,
        },
        eligibleSegments: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          defaultValue: [],
        },
        effectiveDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        expirationDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        usageCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        totalDiscount: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'discount_structures',
        timestamps: true,
        indexes: [
          { fields: ['organizationId'] },
          { fields: ['discountType'] },
          { fields: ['effectiveDate'] },
          { fields: ['isActive'] },
        ],
      }
    );

    return DiscountStructureModel;
  }
}

/**
 * Price Optimization Model
 */
export class PriceOptimizationModel extends Model<PriceOptimizationData> implements PriceOptimizationData {
  declare optimizationId: string;
  declare organizationId: string;
  declare productId: string;
  declare objective: OptimizationObjective;
  declare currentPrice: number;
  declare optimizedPrice: number;
  declare priceChange: number;
  declare priceChangePercent: number;
  declare expectedRevenue: number;
  declare expectedProfit: number;
  declare expectedVolume: number;
  declare confidenceLevel: number;
  declare constraints: Record<string, any>;
  declare assumptions: string[];
  declare sensitivityAnalysis: Record<string, any>;
  declare analysisDate: Date;
  declare implementationDate?: Date;
  declare metadata?: Record<string, any>;

  static initialize(sequelize: Sequelize): typeof PriceOptimizationModel {
    PriceOptimizationModel.init(
      {
        optimizationId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        objective: {
          type: DataTypes.ENUM(...Object.values(OptimizationObjective)),
          allowNull: false,
        },
        currentPrice: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        optimizedPrice: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        priceChange: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        priceChangePercent: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        expectedRevenue: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
        },
        expectedProfit: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
        },
        expectedVolume: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        confidenceLevel: {
          type: DataTypes.DECIMAL(5, 4),
          allowNull: false,
        },
        constraints: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        assumptions: {
          type: DataTypes.ARRAY(DataTypes.TEXT),
          allowNull: false,
          defaultValue: [],
        },
        sensitivityAnalysis: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        analysisDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        implementationDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'price_optimizations',
        timestamps: true,
        indexes: [
          { fields: ['organizationId'] },
          { fields: ['productId'] },
          { fields: ['objective'] },
          { fields: ['analysisDate'] },
        ],
      }
    );

    return PriceOptimizationModel;
  }
}

/**
 * Value-Based Pricing Model
 */
export class ValueBasedPricingModel extends Model<ValueBasedPricingData> implements ValueBasedPricingData {
  declare valueId: string;
  declare organizationId: string;
  declare productId: string;
  declare segment: PriceSegment;
  declare economicValue: number;
  declare perceivedValue: number;
  declare differentiationValue: number;
  declare competitiveAlternativePrice: number;
  declare valueDrivers: Array<{ driver: string; value: number; weight: number }>;
  declare willingnessToPay: number;
  declare recommendedPrice: number;
  declare valueCapturePercent: number;
  declare analysisDate: Date;
  declare metadata?: Record<string, any>;

  static initialize(sequelize: Sequelize): typeof ValueBasedPricingModel {
    ValueBasedPricingModel.init(
      {
        valueId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        segment: {
          type: DataTypes.ENUM(...Object.values(PriceSegment)),
          allowNull: false,
        },
        economicValue: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
        },
        perceivedValue: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
        },
        differentiationValue: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
        },
        competitiveAlternativePrice: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        valueDrivers: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        willingnessToPay: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        recommendedPrice: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        valueCapturePercent: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        analysisDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'value_based_pricing',
        timestamps: true,
        indexes: [
          { fields: ['organizationId'] },
          { fields: ['productId'] },
          { fields: ['segment'] },
          { fields: ['analysisDate'] },
        ],
      }
    );

    return ValueBasedPricingModel;
  }
}

/**
 * Price Segmentation Model
 */
export class PriceSegmentationModel extends Model<PriceSegmentationData> implements PriceSegmentationData {
  declare segmentationId: string;
  declare organizationId: string;
  declare productId: string;
  declare segment: PriceSegment;
  declare segmentName: string;
  declare customerCount: number;
  declare revenueContribution: number;
  declare pricePoint: number;
  declare priceFloor: number;
  declare priceCeiling: number;
  declare willingnessToPay: number;
  declare priceSensitivity: number;
  declare characteristics: Record<string, any>;
  declare targetMargin: number;
  declare metadata?: Record<string, any>;

  static initialize(sequelize: Sequelize): typeof PriceSegmentationModel {
    PriceSegmentationModel.init(
      {
        segmentationId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        organizationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        segment: {
          type: DataTypes.ENUM(...Object.values(PriceSegment)),
          allowNull: false,
        },
        segmentName: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        customerCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        revenueContribution: {
          type: DataTypes.DECIMAL(18, 2),
          allowNull: false,
        },
        pricePoint: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        priceFloor: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        priceCeiling: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        willingnessToPay: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
        },
        priceSensitivity: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
        },
        characteristics: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        targetMargin: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'price_segmentations',
        timestamps: true,
        indexes: [
          { fields: ['organizationId'] },
          { fields: ['productId'] },
          { fields: ['segment'] },
        ],
      }
    );

    return PriceSegmentationModel;
  }
}

// ============================================================================
// PRICING STRATEGY FUNCTIONS
// ============================================================================

/**
 * 1. Create comprehensive pricing strategy
 */
export async function createPricingStrategy(
  dto: CreatePricingStrategyDto,
  transaction?: Transaction
): Promise<PricingStrategyModel> {
  return await PricingStrategyModel.create(
    {
      strategyId: '',
      ...dto,
      status: AnalysisStatus.DRAFT,
    },
    { transaction }
  );
}

/**
 * 2. Calculate price elasticity of demand
 */
export async function calculatePriceElasticity(
  priceChangePercent: number,
  quantityChangePercent: number
): Promise<{ coefficient: number; category: PriceElasticity }> {
  const coefficient = quantityChangePercent / priceChangePercent;
  const absCoefficient = Math.abs(coefficient);

  let category: PriceElasticity;
  if (absCoefficient === Infinity) {
    category = PriceElasticity.PERFECTLY_ELASTIC;
  } else if (absCoefficient > 1) {
    category = PriceElasticity.ELASTIC;
  } else if (absCoefficient === 1) {
    category = PriceElasticity.UNIT_ELASTIC;
  } else if (absCoefficient > 0) {
    category = PriceElasticity.INELASTIC;
  } else {
    category = PriceElasticity.PERFECTLY_INELASTIC;
  }

  return { coefficient, category };
}

/**
 * 3. Generate demand curve from historical data
 */
export function generateDemandCurve(
  historicalData: Array<{ price: number; quantity: number }>
): Array<{ price: number; quantity: number; revenue: number }> {
  return historicalData
    .map((point) => ({
      price: point.price,
      quantity: point.quantity,
      revenue: point.price * point.quantity,
    }))
    .sort((a, b) => a.price - b.price);
}

/**
 * 4. Optimize price for maximum revenue
 */
export function optimizePriceForRevenue(
  demandCurve: Array<{ price: number; quantity: number }>
): { optimalPrice: number; expectedRevenue: number; expectedVolume: number } {
  let maxRevenue = 0;
  let optimalPrice = 0;
  let expectedVolume = 0;

  for (const point of demandCurve) {
    const revenue = point.price * point.quantity;
    if (revenue > maxRevenue) {
      maxRevenue = revenue;
      optimalPrice = point.price;
      expectedVolume = point.quantity;
    }
  }

  return { optimalPrice, expectedRevenue: maxRevenue, expectedVolume };
}

/**
 * 5. Optimize price for maximum profit
 */
export function optimizePriceForProfit(
  demandCurve: Array<{ price: number; quantity: number }>,
  costPerUnit: number
): { optimalPrice: number; expectedProfit: number; expectedVolume: number; margin: number } {
  let maxProfit = 0;
  let optimalPrice = 0;
  let expectedVolume = 0;

  for (const point of demandCurve) {
    const revenue = point.price * point.quantity;
    const cost = costPerUnit * point.quantity;
    const profit = revenue - cost;

    if (profit > maxProfit) {
      maxProfit = profit;
      optimalPrice = point.price;
      expectedVolume = point.quantity;
    }
  }

  const margin = optimalPrice > 0 ? ((optimalPrice - costPerUnit) / optimalPrice) * 100 : 0;

  return { optimalPrice, expectedProfit: maxProfit, expectedVolume, margin };
}

/**
 * 6. Calculate competitive price positioning
 */
export function calculateCompetitivePosition(
  ourPrice: number,
  competitorPrice: number
): { difference: number; differencePercent: number; position: CompetitivePosition } {
  const difference = ourPrice - competitorPrice;
  const differencePercent = (difference / competitorPrice) * 100;

  let position: CompetitivePosition;
  if (differencePercent > 10) {
    position = CompetitivePosition.PREMIUM;
  } else if (differencePercent >= -5 && differencePercent <= 10) {
    position = CompetitivePosition.PARITY;
  } else if (differencePercent >= -15 && differencePercent < -5) {
    position = CompetitivePosition.DISCOUNT;
  } else {
    position = CompetitivePosition.PENETRATION;
  }

  return { difference, differencePercent, position };
}

/**
 * 7. Build pricing waterfall analysis
 */
export async function buildPricingWaterfall(
  dto: CreatePricingWaterfallDto,
  transaction?: Transaction
): Promise<PricingWaterfallModel> {
  const totalDiscounts =
    dto.invoiceDiscount +
    dto.offInvoiceDiscount +
    dto.rebates +
    dto.promotionalAllowances +
    dto.paymentTermsDiscount +
    dto.freight;

  const pocketPrice = dto.listPrice - totalDiscounts;
  const pocketMargin = ((pocketPrice / dto.listPrice) * 100);
  const leakagePercent = ((totalDiscounts / dto.listPrice) * 100);

  return await PricingWaterfallModel.create(
    {
      waterfallId: '',
      ...dto,
      pocketPrice,
      pocketMargin,
      leakagePercent,
      analysisDate: new Date(),
    },
    { transaction }
  );
}

/**
 * 8. Calculate pricing waterfall leakage
 */
export function calculateWaterfallLeakage(
  listPrice: number,
  pocketPrice: number
): { leakageAmount: number; leakagePercent: number; retentionPercent: number } {
  const leakageAmount = listPrice - pocketPrice;
  const leakagePercent = (leakageAmount / listPrice) * 100;
  const retentionPercent = 100 - leakagePercent;

  return { leakageAmount, leakagePercent, retentionPercent };
}

/**
 * 9. Analyze waterfall components by type
 */
export async function analyzeWaterfallComponents(
  organizationId: string,
  productId: string,
  startDate: Date,
  endDate: Date
): Promise<Record<WaterfallComponent, { totalAmount: number; averagePercent: number; count: number }>> {
  const waterfalls = await PricingWaterfallModel.findAll({
    where: {
      organizationId,
      productId,
      analysisDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const componentStats: Record<string, { totalAmount: number; totalPercent: number; count: number }> = {};

  for (const waterfall of waterfalls) {
    for (const component of waterfall.components) {
      if (!componentStats[component.type]) {
        componentStats[component.type] = { totalAmount: 0, totalPercent: 0, count: 0 };
      }
      componentStats[component.type].totalAmount += component.amount;
      componentStats[component.type].totalPercent += component.percent;
      componentStats[component.type].count += 1;
    }
  }

  const result: any = {};
  for (const [type, stats] of Object.entries(componentStats)) {
    result[type] = {
      totalAmount: stats.totalAmount,
      averagePercent: stats.count > 0 ? stats.totalPercent / stats.count : 0,
      count: stats.count,
    };
  }

  return result;
}

/**
 * 10. Create value-based pricing analysis
 */
export async function createValueBasedPricing(
  dto: CreateValueBasedPricingDto,
  transaction?: Transaction
): Promise<ValueBasedPricingModel> {
  return await ValueBasedPricingModel.create(
    {
      valueId: '',
      ...dto,
      analysisDate: new Date(),
    },
    { transaction }
  );
}

/**
 * 11. Calculate economic value to customer
 */
export function calculateEconomicValue(
  competitiveAlternativePrice: number,
  differentiationValue: number
): { economicValue: number; valuePremium: number } {
  const economicValue = competitiveAlternativePrice + differentiationValue;
  const valuePremium = differentiationValue;

  return { economicValue, valuePremium };
}

/**
 * 12. Compute value drivers weighted score
 */
export function computeValueDriversScore(
  valueDrivers: Array<{ driver: string; value: number; weight: number }>
): { totalScore: number; weightedAverage: number; topDrivers: Array<{ driver: string; contribution: number }> } {
  const totalWeight = valueDrivers.reduce((sum, driver) => sum + driver.weight, 0);
  const weightedScore = valueDrivers.reduce((sum, driver) => sum + driver.value * driver.weight, 0);
  const weightedAverage = totalWeight > 0 ? weightedScore / totalWeight : 0;

  const topDrivers = valueDrivers
    .map((driver) => ({
      driver: driver.driver,
      contribution: (driver.value * driver.weight) / weightedScore * 100,
    }))
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 5);

  return { totalScore: weightedScore, weightedAverage, topDrivers };
}

/**
 * 13. Determine value capture percentage
 */
export function determineValueCapturePercent(
  recommendedPrice: number,
  economicValue: number
): { valueCapturePercent: number; customerSurplusPercent: number } {
  const valueCapturePercent = (recommendedPrice / economicValue) * 100;
  const customerSurplusPercent = 100 - valueCapturePercent;

  return { valueCapturePercent, customerSurplusPercent };
}

/**
 * 14. Create discount structure
 */
export async function createDiscountStructure(
  dto: CreateDiscountStructureDto,
  transaction?: Transaction
): Promise<DiscountStructureModel> {
  return await DiscountStructureModel.create(
    {
      discountId: '',
      ...dto,
      isActive: true,
      usageCount: 0,
      totalDiscount: 0,
    },
    { transaction }
  );
}

/**
 * 15. Calculate volume discount tiers
 */
export function calculateVolumeDiscountTiers(
  basePrice: number,
  tiers: Array<{ minQuantity: number; discountPercent: number }>
): Array<{ minQuantity: number; maxQuantity: number | null; discountPercent: number; pricePerUnit: number; savings: number }> {
  return tiers.map((tier, index) => {
    const pricePerUnit = basePrice * (1 - tier.discountPercent / 100);
    const savings = basePrice - pricePerUnit;
    const maxQuantity = index < tiers.length - 1 ? tiers[index + 1].minQuantity - 1 : null;

    return {
      minQuantity: tier.minQuantity,
      maxQuantity,
      discountPercent: tier.discountPercent,
      pricePerUnit,
      savings,
    };
  });
}

/**
 * 16. Apply discount to price
 */
export function applyDiscount(
  basePrice: number,
  discount: { discountPercent?: number; discountAmount?: number }
): { finalPrice: number; discountApplied: number; savingsPercent: number } {
  let discountApplied = 0;

  if (discount.discountPercent !== undefined) {
    discountApplied = basePrice * (discount.discountPercent / 100);
  } else if (discount.discountAmount !== undefined) {
    discountApplied = discount.discountAmount;
  }

  const finalPrice = Math.max(0, basePrice - discountApplied);
  const savingsPercent = basePrice > 0 ? (discountApplied / basePrice) * 100 : 0;

  return { finalPrice, discountApplied, savingsPercent };
}

/**
 * 17. Calculate cumulative discount impact
 */
export function calculateCumulativeDiscounts(
  basePrice: number,
  discounts: Array<{ type: string; percent: number }>
): { finalPrice: number; totalDiscount: number; totalDiscountPercent: number; effectiveRate: number } {
  let currentPrice = basePrice;

  for (const discount of discounts) {
    currentPrice = currentPrice * (1 - discount.percent / 100);
  }

  const totalDiscount = basePrice - currentPrice;
  const totalDiscountPercent = (totalDiscount / basePrice) * 100;
  const effectiveRate = 100 - totalDiscountPercent;

  return { finalPrice: currentPrice, totalDiscount, totalDiscountPercent, effectiveRate };
}

/**
 * 18. Create price segmentation
 */
export async function createPriceSegmentation(
  dto: CreatePriceSegmentationDto,
  transaction?: Transaction
): Promise<PriceSegmentationModel> {
  return await PriceSegmentationModel.create(
    {
      segmentationId: '',
      ...dto,
    },
    { transaction }
  );
}

/**
 * 19. Segment customers by willingness to pay
 */
export function segmentByWillingnessToPay(
  customers: Array<{ customerId: string; willingnessToPay: number; annualRevenue: number }>,
  segments: number = 4
): Array<{ segment: number; minWTP: number; maxWTP: number; customerCount: number; totalRevenue: number; avgWTP: number }> {
  const sorted = customers.sort((a, b) => a.willingnessToPay - b.willingnessToPay);
  const segmentSize = Math.ceil(customers.length / segments);

  const result: Array<any> = [];

  for (let i = 0; i < segments; i++) {
    const start = i * segmentSize;
    const end = Math.min((i + 1) * segmentSize, customers.length);
    const segmentCustomers = sorted.slice(start, end);

    if (segmentCustomers.length === 0) continue;

    const minWTP = Math.min(...segmentCustomers.map((c) => c.willingnessToPay));
    const maxWTP = Math.max(...segmentCustomers.map((c) => c.willingnessToPay));
    const totalRevenue = segmentCustomers.reduce((sum, c) => sum + c.annualRevenue, 0);
    const avgWTP = segmentCustomers.reduce((sum, c) => sum + c.willingnessToPay, 0) / segmentCustomers.length;

    result.push({
      segment: i + 1,
      minWTP,
      maxWTP,
      customerCount: segmentCustomers.length,
      totalRevenue,
      avgWTP,
    });
  }

  return result;
}

/**
 * 20. Calculate price sensitivity by segment
 */
export function calculatePriceSensitivity(
  segment: { priceElasticity: number; competitorSwitchRate: number; priceImportance: number }
): { sensitivityScore: number; sensitivityLevel: 'low' | 'medium' | 'high' | 'very_high' } {
  const elasticityWeight = 0.5;
  const switchRateWeight = 0.3;
  const importanceWeight = 0.2;

  const normalizedElasticity = Math.min(Math.abs(segment.priceElasticity) / 2, 1);
  const sensitivityScore =
    normalizedElasticity * elasticityWeight +
    segment.competitorSwitchRate * switchRateWeight +
    segment.priceImportance * importanceWeight;

  let sensitivityLevel: 'low' | 'medium' | 'high' | 'very_high';
  if (sensitivityScore < 0.3) {
    sensitivityLevel = 'low';
  } else if (sensitivityScore < 0.6) {
    sensitivityLevel = 'medium';
  } else if (sensitivityScore < 0.8) {
    sensitivityLevel = 'high';
  } else {
    sensitivityLevel = 'very_high';
  }

  return { sensitivityScore, sensitivityLevel };
}

/**
 * 21. Apply psychological pricing tactics
 */
export function applyPsychologicalPricing(
  price: number,
  tactic: PsychologicalTactic
): { adjustedPrice: number; displayPrice: string; tactic: PsychologicalTactic } {
  let adjustedPrice = price;
  let displayPrice = '';

  switch (tactic) {
    case PsychologicalTactic.CHARM_PRICING:
      adjustedPrice = Math.floor(price) - 0.01;
      displayPrice = `$${adjustedPrice.toFixed(2)}`;
      break;
    case PsychologicalTactic.PRESTIGE_PRICING:
      adjustedPrice = Math.round(price);
      displayPrice = `$${adjustedPrice.toFixed(0)}`;
      break;
    case PsychologicalTactic.ANCHOR_PRICING:
      displayPrice = `Was $${(price * 1.3).toFixed(2)} Now $${price.toFixed(2)}`;
      break;
    case PsychologicalTactic.BUNDLE_PRICING:
      displayPrice = `Bundle: $${price.toFixed(2)} (Save 20%)`;
      break;
    default:
      displayPrice = `$${price.toFixed(2)}`;
  }

  return { adjustedPrice, displayPrice, tactic };
}

/**
 * 22. Create bundle pricing strategy
 */
export function createBundlePricing(
  products: Array<{ productId: string; individualPrice: number }>,
  bundleDiscountPercent: number
): { bundlePrice: number; individualTotal: number; savings: number; savingsPercent: number } {
  const individualTotal = products.reduce((sum, p) => sum + p.individualPrice, 0);
  const bundlePrice = individualTotal * (1 - bundleDiscountPercent / 100);
  const savings = individualTotal - bundlePrice;
  const savingsPercent = bundleDiscountPercent;

  return { bundlePrice, individualTotal, savings, savingsPercent };
}

/**
 * 23. Calculate tiered pricing structure
 */
export function calculateTieredPricing(
  usage: number,
  tiers: Array<{ upTo: number | null; pricePerUnit: number }>
): { totalCost: number; effectiveRate: number; breakdown: Array<{ tier: number; units: number; cost: number }> } {
  let remainingUsage = usage;
  let totalCost = 0;
  const breakdown: Array<{ tier: number; units: number; cost: number }> = [];

  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i];
    const previousLimit = i > 0 ? (tiers[i - 1].upTo || 0) : 0;
    const currentLimit = tier.upTo || Infinity;
    const tierCapacity = currentLimit - previousLimit;
    const unitsInTier = Math.min(remainingUsage, tierCapacity);

    if (unitsInTier > 0) {
      const cost = unitsInTier * tier.pricePerUnit;
      totalCost += cost;
      breakdown.push({ tier: i + 1, units: unitsInTier, cost });
      remainingUsage -= unitsInTier;
    }

    if (remainingUsage <= 0) break;
  }

  const effectiveRate = usage > 0 ? totalCost / usage : 0;

  return { totalCost, effectiveRate, breakdown };
}

/**
 * 24. Optimize dynamic pricing
 */
export function optimizeDynamicPricing(
  basePrice: number,
  factors: {
    demandLevel: number; // 0-1
    inventory: number;
    competitorPrice: number;
    timeToEvent?: number; // days
  }
): { dynamicPrice: number; adjustmentPercent: number; factors: Record<string, number> } {
  let priceMultiplier = 1.0;
  const factorImpacts: Record<string, number> = {};

  // Demand factor
  const demandAdjustment = (factors.demandLevel - 0.5) * 0.4;
  priceMultiplier += demandAdjustment;
  factorImpacts.demand = demandAdjustment * 100;

  // Inventory factor
  const inventoryAdjustment = factors.inventory < 20 ? 0.15 : factors.inventory > 80 ? -0.1 : 0;
  priceMultiplier += inventoryAdjustment;
  factorImpacts.inventory = inventoryAdjustment * 100;

  // Competitive factor
  const competitiveDiff = (basePrice - factors.competitorPrice) / factors.competitorPrice;
  const competitiveAdjustment = Math.max(-0.1, Math.min(0.1, -competitiveDiff * 0.5));
  priceMultiplier += competitiveAdjustment;
  factorImpacts.competitive = competitiveAdjustment * 100;

  // Time-based factor (if applicable)
  if (factors.timeToEvent !== undefined) {
    const timeAdjustment = factors.timeToEvent < 7 ? 0.2 : factors.timeToEvent > 30 ? -0.05 : 0;
    priceMultiplier += timeAdjustment;
    factorImpacts.time = timeAdjustment * 100;
  }

  priceMultiplier = Math.max(0.7, Math.min(1.5, priceMultiplier));

  const dynamicPrice = basePrice * priceMultiplier;
  const adjustmentPercent = (priceMultiplier - 1) * 100;

  return { dynamicPrice, adjustmentPercent, factors: factorImpacts };
}

/**
 * 25. Calculate promotional pricing effectiveness
 */
export function calculatePromotionalEffectiveness(
  baseline: { price: number; volume: number; revenue: number },
  promotional: { price: number; volume: number; revenue: number; promotionCost: number }
): {
  volumeLift: number;
  volumeLiftPercent: number;
  revenueChange: number;
  revenueChangePercent: number;
  profitImpact: number;
  roi: number;
  isEffective: boolean;
} {
  const volumeLift = promotional.volume - baseline.volume;
  const volumeLiftPercent = (volumeLift / baseline.volume) * 100;
  const revenueChange = promotional.revenue - baseline.revenue;
  const revenueChangePercent = (revenueChange / baseline.revenue) * 100;
  const profitImpact = revenueChange - promotional.promotionCost;
  const roi = promotional.promotionCost > 0 ? (profitImpact / promotional.promotionCost) * 100 : 0;
  const isEffective = profitImpact > 0;

  return {
    volumeLift,
    volumeLiftPercent,
    revenueChange,
    revenueChangePercent,
    profitImpact,
    roi,
    isEffective,
  };
}

/**
 * 26. Analyze price-volume-mix
 */
export function analyzePriceVolumeMix(
  currentPeriod: { price: number; volume: number; mix: number }[],
  priorPeriod: { price: number; volume: number; mix: number }[]
): { priceEffect: number; volumeEffect: number; mixEffect: number; totalVariance: number } {
  const currentRevenue = currentPeriod.reduce((sum, p) => sum + p.price * p.volume * p.mix, 0);
  const priorRevenue = priorPeriod.reduce((sum, p) => sum + p.price * p.volume * p.mix, 0);

  let priceEffect = 0;
  let volumeEffect = 0;
  let mixEffect = 0;

  for (let i = 0; i < currentPeriod.length && i < priorPeriod.length; i++) {
    const curr = currentPeriod[i];
    const prior = priorPeriod[i];

    priceEffect += (curr.price - prior.price) * prior.volume * prior.mix;
    volumeEffect += prior.price * (curr.volume - prior.volume) * prior.mix;
    mixEffect += prior.price * prior.volume * (curr.mix - prior.mix);
  }

  const totalVariance = currentRevenue - priorRevenue;

  return { priceEffect, volumeEffect, mixEffect, totalVariance };
}

/**
 * 27. Calculate price floor based on costs
 */
export function calculatePriceFloor(
  costs: {
    directMaterial: number;
    directLabor: number;
    variableOverhead: number;
    fixedOverhead: number;
    allocatedFixed?: number;
  },
  targetMargin: number
): { priceFloor: number; variableCost: number; fullCost: number; marginPrice: number } {
  const variableCost = costs.directMaterial + costs.directLabor + costs.variableOverhead;
  const fullCost = variableCost + costs.fixedOverhead + (costs.allocatedFixed || 0);
  const priceFloor = variableCost;
  const marginPrice = fullCost / (1 - targetMargin / 100);

  return { priceFloor, variableCost, fullCost, marginPrice };
}

/**
 * 28. Calculate price ceiling based on value
 */
export function calculatePriceCeiling(
  valueToCustomer: number,
  competitiveBenchmark: number,
  maxWillingnessToPay: number
): { priceCeiling: number; constrainingFactor: 'value' | 'competitive' | 'willingness' } {
  const constraints = [
    { value: valueToCustomer, factor: 'value' as const },
    { value: competitiveBenchmark, factor: 'competitive' as const },
    { value: maxWillingnessToPay, factor: 'willingness' as const },
  ];

  const minimum = constraints.reduce((min, curr) => (curr.value < min.value ? curr : min));

  return { priceCeiling: minimum.value, constrainingFactor: minimum.factor };
}

/**
 * 29. Perform price sensitivity analysis
 */
export function performSensitivityAnalysis(
  baseCase: { price: number; volume: number; cost: number },
  priceChanges: number[]
): Array<{ priceChange: number; newPrice: number; estimatedVolume: number; revenue: number; profit: number; margin: number }> {
  const elasticity = -1.5; // Assume elastic demand

  return priceChanges.map((changePercent) => {
    const newPrice = baseCase.price * (1 + changePercent / 100);
    const volumeChangePercent = elasticity * changePercent;
    const estimatedVolume = baseCase.volume * (1 + volumeChangePercent / 100);
    const revenue = newPrice * estimatedVolume;
    const totalCost = baseCase.cost * estimatedVolume;
    const profit = revenue - totalCost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return { priceChange: changePercent, newPrice, estimatedVolume, revenue, profit, margin };
  });
}

/**
 * 30. Calculate break-even price
 */
export function calculateBreakEvenPrice(
  fixedCosts: number,
  variableCostPerUnit: number,
  targetVolume: number
): { breakEvenPrice: number; contributionMargin: number; contributionMarginRatio: number } {
  const breakEvenPrice = (fixedCosts / targetVolume) + variableCostPerUnit;
  const contributionMargin = breakEvenPrice - variableCostPerUnit;
  const contributionMarginRatio = breakEvenPrice > 0 ? (contributionMargin / breakEvenPrice) * 100 : 0;

  return { breakEvenPrice, contributionMargin, contributionMarginRatio };
}

/**
 * 31. Analyze competitive pricing gaps
 */
export async function analyzeCompetitivePricingGaps(
  organizationId: string,
  productId: string
): Promise<{
  averageCompetitorPrice: number;
  priceGap: number;
  priceGapPercent: number;
  competitorsAbove: number;
  competitorsBelow: number;
  recommendedPosition: CompetitivePosition;
}> {
  const benchmarks = await CompetitivePricingModel.findAll({
    where: { organizationId, productId },
    order: [['benchmarkDate', 'DESC']],
    limit: 10,
  });

  if (benchmarks.length === 0) {
    throw new Error('No competitive benchmarks found');
  }

  const averageCompetitorPrice =
    benchmarks.reduce((sum, b) => sum + b.competitorPrice, 0) / benchmarks.length;
  const ourPrice = benchmarks[0].ourPrice;
  const priceGap = ourPrice - averageCompetitorPrice;
  const priceGapPercent = (priceGap / averageCompetitorPrice) * 100;
  const competitorsAbove = benchmarks.filter((b) => b.competitorPrice > ourPrice).length;
  const competitorsBelow = benchmarks.filter((b) => b.competitorPrice < ourPrice).length;

  let recommendedPosition: CompetitivePosition;
  if (priceGapPercent > 15) {
    recommendedPosition = CompetitivePosition.PREMIUM;
  } else if (priceGapPercent >= -5 && priceGapPercent <= 15) {
    recommendedPosition = CompetitivePosition.PARITY;
  } else if (priceGapPercent >= -20 && priceGapPercent < -5) {
    recommendedPosition = CompetitivePosition.DISCOUNT;
  } else {
    recommendedPosition = CompetitivePosition.PENETRATION;
  }

  return {
    averageCompetitorPrice,
    priceGap,
    priceGapPercent,
    competitorsAbove,
    competitorsBelow,
    recommendedPosition,
  };
}

/**
 * 32. Generate price recommendation
 */
export function generatePriceRecommendation(
  inputs: {
    costFloor: number;
    valueCeiling: number;
    competitivePrice: number;
    targetMargin: number;
    marketPosition: 'leader' | 'challenger' | 'follower' | 'niche';
  }
): { recommendedPrice: number; rationale: string; confidenceLevel: number } {
  let recommendedPrice: number;
  let rationale: string;
  let confidenceLevel: number;

  const costBasedPrice = inputs.costFloor / (1 - inputs.targetMargin / 100);
  const priceRange = inputs.valueCeiling - inputs.costFloor;

  switch (inputs.marketPosition) {
    case 'leader':
      recommendedPrice = inputs.valueCeiling * 0.9;
      rationale = 'Premium pricing for market leader';
      confidenceLevel = 0.85;
      break;
    case 'challenger':
      recommendedPrice = inputs.competitivePrice * 0.95;
      rationale = 'Slight discount to competitive benchmark';
      confidenceLevel = 0.8;
      break;
    case 'follower':
      recommendedPrice = inputs.competitivePrice * 0.9;
      rationale = 'Value pricing below market average';
      confidenceLevel = 0.75;
      break;
    case 'niche':
      recommendedPrice = inputs.valueCeiling * 0.95;
      rationale = 'Value-based pricing for specialized offering';
      confidenceLevel = 0.9;
      break;
    default:
      recommendedPrice = costBasedPrice;
      rationale = 'Cost-plus pricing';
      confidenceLevel = 0.7;
  }

  recommendedPrice = Math.max(inputs.costFloor, Math.min(inputs.valueCeiling, recommendedPrice));

  return { recommendedPrice, rationale, confidenceLevel };
}

/**
 * 33. Calculate revenue at risk from pricing
 */
export async function calculateRevenueAtRisk(
  organizationId: string,
  productId: string,
  priceIncreasePercent: number,
  elasticity: number
): Promise<{ currentRevenue: number; projectedRevenue: number; revenueAtRisk: number; riskPercent: number }> {
  const waterfalls = await PricingWaterfallModel.findAll({
    where: { organizationId, productId },
    attributes: [
      [Sequelize.fn('AVG', Sequelize.col('pocketPrice')), 'avgPrice'],
      [Sequelize.fn('SUM', Sequelize.col('pocketPrice')), 'totalRevenue'],
    ],
  });

  if (waterfalls.length === 0 || !waterfalls[0]) {
    throw new Error('No pricing data found');
  }

  const data = waterfalls[0] as any;
  const currentRevenue = parseFloat(data.getDataValue('totalRevenue') || '0');
  const volumeChangePercent = elasticity * priceIncreasePercent;
  const revenueFromPrice = currentRevenue * (1 + priceIncreasePercent / 100);
  const projectedRevenue = revenueFromPrice * (1 + volumeChangePercent / 100);
  const revenueAtRisk = currentRevenue - projectedRevenue;
  const riskPercent = (revenueAtRisk / currentRevenue) * 100;

  return { currentRevenue, projectedRevenue, revenueAtRisk, riskPercent };
}

/**
 * 34. Model price change scenarios
 */
export function modelPriceChangeScenarios(
  baseline: { price: number; volume: number; cost: number },
  scenarios: Array<{ name: string; priceChange: number; elasticity: number }>
): Array<{
  scenario: string;
  newPrice: number;
  projectedVolume: number;
  revenue: number;
  profit: number;
  revenueChange: number;
  profitChange: number;
}> {
  const baselineRevenue = baseline.price * baseline.volume;
  const baselineProfit = baselineRevenue - baseline.cost * baseline.volume;

  return scenarios.map((scenario) => {
    const newPrice = baseline.price * (1 + scenario.priceChange / 100);
    const volumeChange = scenario.elasticity * scenario.priceChange;
    const projectedVolume = baseline.volume * (1 + volumeChange / 100);
    const revenue = newPrice * projectedVolume;
    const profit = revenue - baseline.cost * projectedVolume;
    const revenueChange = ((revenue - baselineRevenue) / baselineRevenue) * 100;
    const profitChange = ((profit - baselineProfit) / baselineProfit) * 100;

    return {
      scenario: scenario.name,
      newPrice,
      projectedVolume,
      revenue,
      profit,
      revenueChange,
      profitChange,
    };
  });
}

/**
 * 35. Calculate customer lifetime value impact
 */
export function calculateCLVImpact(
  pricing: { acquisitionPrice: number; renewalPrice: number; churnRate: number },
  costs: { acquisitionCost: number; serviceCost: number },
  averageLifespanYears: number
): { clv: number; customerMargin: number; paybackPeriod: number; roi: number } {
  const annualRevenue = pricing.renewalPrice;
  const annualCost = costs.serviceCost;
  const annualProfit = annualRevenue - annualCost;
  const retentionRate = 1 - pricing.churnRate;

  let clv = -costs.acquisitionCost;
  for (let year = 0; year < averageLifespanYears; year++) {
    clv += annualProfit * Math.pow(retentionRate, year);
  }

  const customerMargin = clv;
  const paybackPeriod = costs.acquisitionCost / annualProfit;
  const roi = (clv / costs.acquisitionCost) * 100;

  return { clv, customerMargin, paybackPeriod, roi };
}

/**
 * 36. Optimize subscription pricing tiers
 */
export function optimizeSubscriptionTiers(
  customerDistribution: Array<{ usageLevel: number; willingnessToPay: number; count: number }>,
  targetTiers: number
): Array<{
  tier: number;
  name: string;
  usageLimit: number;
  price: number;
  targetCustomers: number;
  projectedRevenue: number;
}> {
  const sorted = customerDistribution.sort((a, b) => a.usageLevel - b.usageLevel);
  const totalCustomers = sorted.reduce((sum, c) => sum + c.count, 0);
  const customersPerTier = Math.floor(totalCustomers / targetTiers);

  const tiers: Array<any> = [];
  let accumulatedCustomers = 0;

  const tierNames = ['Basic', 'Pro', 'Business', 'Enterprise'];

  for (let i = 0; i < targetTiers; i++) {
    const startIdx = Math.floor((i / targetTiers) * sorted.length);
    const endIdx = Math.floor(((i + 1) / targetTiers) * sorted.length);
    const tierCustomers = sorted.slice(startIdx, endIdx);

    const maxUsage = Math.max(...tierCustomers.map((c) => c.usageLevel));
    const avgWTP = tierCustomers.reduce((sum, c) => sum + c.willingnessToPay * c.count, 0) /
      tierCustomers.reduce((sum, c) => sum + c.count, 0);
    const tierCount = tierCustomers.reduce((sum, c) => sum + c.count, 0);

    tiers.push({
      tier: i + 1,
      name: tierNames[i] || `Tier ${i + 1}`,
      usageLimit: Math.ceil(maxUsage),
      price: Math.round(avgWTP * 0.9),
      targetCustomers: tierCount,
      projectedRevenue: Math.round(avgWTP * 0.9) * tierCount,
    });

    accumulatedCustomers += tierCount;
  }

  return tiers;
}

/**
 * 37. Calculate price discrimination opportunities
 */
export function calculatePriceDiscrimination(
  segments: Array<{ segment: string; elasticity: number; size: number; baseWTP: number }>
): Array<{
  segment: string;
  optimalPrice: number;
  projectedVolume: number;
  revenue: number;
  consumerSurplus: number;
}> {
  return segments.map((seg) => {
    const optimalPrice = seg.baseWTP * (seg.elasticity / (seg.elasticity + 1));
    const volumeRatio = 1 - (optimalPrice / seg.baseWTP);
    const projectedVolume = seg.size * Math.max(0, volumeRatio);
    const revenue = optimalPrice * projectedVolume;
    const consumerSurplus = 0.5 * (seg.baseWTP - optimalPrice) * projectedVolume;

    return {
      segment: seg.segment,
      optimalPrice,
      projectedVolume,
      revenue,
      consumerSurplus,
    };
  });
}

/**
 * 38. Analyze price anchoring effects
 */
export function analyzePriceAnchoring(
  anchorPrice: number,
  actualPrice: number,
  referencePrice: number
): { perceivedValue: number; discount Perception: number; anchoring Effect: number; purchaseIntent: number } {
  const discountPerception = ((anchorPrice - actualPrice) / anchorPrice) * 100;
  const anchoringEffect = ((anchorPrice - referencePrice) / referencePrice) * 100;
  const perceivedValue = (anchorPrice - actualPrice) / actualPrice;

  // Purchase intent increases with perceived discount
  const purchaseIntent = Math.min(1, Math.max(0, discountPerception / 50));

  return {
    perceivedValue,
    discountPerception,
    anchoringEffect,
    purchaseIntent,
  };
}

/**
 * 39. Calculate freemium conversion metrics
 */
export function calculateFreemiumMetrics(
  data: {
    freeUsers: number;
    paidUsers: number;
    conversionRate: number;
    avgRevenuePerPaidUser: number;
    freeTierCost: number;
  }
): {
  totalRevenue: number;
  revenuePerUser: number;
  costToServe: number;
  contributionMargin: number;
  breakEvenConversionRate: number;
} {
  const totalUsers = data.freeUsers + data.paidUsers;
  const totalRevenue = data.paidUsers * data.avgRevenuePerPaidUser;
  const revenuePerUser = totalRevenue / totalUsers;
  const costToServe = data.freeUsers * data.freeTierCost;
  const contributionMargin = totalRevenue - costToServe;
  const breakEvenConversionRate = (data.freeTierCost / data.avgRevenuePerPaidUser) * 100;

  return {
    totalRevenue,
    revenuePerUser,
    costToServe,
    contributionMargin,
    breakEvenConversionRate,
  };
}

/**
 * 40. Generate pricing strategy recommendations
 */
export async function generatePricingRecommendations(
  organizationId: string,
  productId: string
): Promise<{
  currentStrategy: PricingStrategy;
  recommendedStrategy: PricingStrategy;
  rationale: string[];
  expectedImpact: { revenue: number; margin: number; volume: number };
  implementationSteps: string[];
}> {
  const [strategies, elasticities, waterfalls] = await Promise.all([
    PricingStrategyModel.findAll({ where: { organizationId, productId }, limit: 1 }),
    PriceElasticityModel.findAll({ where: { organizationId, productId }, limit: 1 }),
    PricingWaterfallModel.findAll({ where: { organizationId, productId }, limit: 10 }),
  ]);

  const currentStrategy = strategies[0]?.strategyType || PricingStrategy.COST_PLUS;
  const elasticity = elasticities[0]?.elasticityCoefficient || -1.0;
  const avgLeakage = waterfalls.length > 0
    ? waterfalls.reduce((sum, w) => sum + w.leakagePercent, 0) / waterfalls.length
    : 15;

  let recommendedStrategy: PricingStrategy;
  const rationale: string[] = [];
  let expectedImpact = { revenue: 0, margin: 0, volume: 0 };
  const implementationSteps: string[] = [];

  if (Math.abs(elasticity) < 0.8) {
    recommendedStrategy = PricingStrategy.VALUE_BASED;
    rationale.push('Low price elasticity indicates value-based pricing opportunity');
    rationale.push('Customers are less sensitive to price changes');
    expectedImpact = { revenue: 15, margin: 20, volume: -5 };
    implementationSteps.push('Conduct customer value research');
    implementationSteps.push('Identify key value drivers');
    implementationSteps.push('Develop value-based pricing model');
  } else if (avgLeakage > 20) {
    recommendedStrategy = PricingStrategy.COMPETITIVE;
    rationale.push('High pricing waterfall leakage detected');
    rationale.push('Focus on reducing discounts and improving price realization');
    expectedImpact = { revenue: 10, margin: 15, volume: 0 };
    implementationSteps.push('Analyze waterfall components');
    implementationSteps.push('Implement discount controls');
    implementationSteps.push('Train sales on value selling');
  } else {
    recommendedStrategy = PricingStrategy.DYNAMIC;
    rationale.push('Market conditions support dynamic pricing');
    rationale.push('Optimize pricing based on demand and competition');
    expectedImpact = { revenue: 12, margin: 10, volume: 2 };
    implementationSteps.push('Implement pricing algorithm');
    implementationSteps.push('Define pricing rules and constraints');
    implementationSteps.push('Monitor and adjust pricing dynamically');
  }

  return {
    currentStrategy,
    recommendedStrategy,
    rationale,
    expectedImpact,
    implementationSteps,
  };
}

/**
 * 41. Calculate pricing power index
 */
export function calculatePricingPower(
  metrics: {
    marketShare: number;
    brandStrength: number;
    productDifferentiation: number;
    switchingCosts: number;
    customerLoyalty: number;
  }
): { pricingPowerIndex: number; pricingPowerLevel: 'low' | 'moderate' | 'high' | 'very_high'; recommendations: string[] } {
  const weights = {
    marketShare: 0.25,
    brandStrength: 0.2,
    productDifferentiation: 0.25,
    switchingCosts: 0.15,
    customerLoyalty: 0.15,
  };

  const pricingPowerIndex =
    metrics.marketShare * weights.marketShare +
    metrics.brandStrength * weights.brandStrength +
    metrics.productDifferentiation * weights.productDifferentiation +
    metrics.switchingCosts * weights.switchingCosts +
    metrics.customerLoyalty * weights.customerLoyalty;

  let pricingPowerLevel: 'low' | 'moderate' | 'high' | 'very_high';
  const recommendations: string[] = [];

  if (pricingPowerIndex < 30) {
    pricingPowerLevel = 'low';
    recommendations.push('Focus on cost efficiency and competitive pricing');
    recommendations.push('Invest in product differentiation');
    recommendations.push('Build customer loyalty programs');
  } else if (pricingPowerIndex < 60) {
    pricingPowerLevel = 'moderate';
    recommendations.push('Explore value-based pricing opportunities');
    recommendations.push('Segment customers by willingness to pay');
    recommendations.push('Strengthen brand positioning');
  } else if (pricingPowerIndex < 80) {
    pricingPowerLevel = 'high';
    recommendations.push('Implement premium pricing strategy');
    recommendations.push('Capture value through tiered offerings');
    recommendations.push('Maintain pricing discipline');
  } else {
    pricingPowerLevel = 'very_high';
    recommendations.push('Maximize value capture with premium pricing');
    recommendations.push('Consider price leadership position');
    recommendations.push('Avoid commoditization through innovation');
  }

  return { pricingPowerIndex, pricingPowerLevel, recommendations };
}

/**
 * 42. Track pricing strategy performance
 */
export async function trackPricingPerformance(
  organizationId: string,
  productId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  revenueGrowth: number;
  volumeGrowth: number;
  priceMixEffect: number;
  realizationRate: number;
  discountRate: number;
  performanceScore: number;
}> {
  const waterfalls = await PricingWaterfallModel.findAll({
    where: {
      organizationId,
      productId,
      analysisDate: { [Op.between]: [startDate, endDate] },
    },
    order: [['analysisDate', 'ASC']],
  });

  if (waterfalls.length < 2) {
    throw new Error('Insufficient data for performance tracking');
  }

  const firstPeriod = waterfalls.slice(0, Math.floor(waterfalls.length / 2));
  const secondPeriod = waterfalls.slice(Math.floor(waterfalls.length / 2));

  const firstRevenue = firstPeriod.reduce((sum, w) => sum + Number(w.pocketPrice), 0);
  const secondRevenue = secondPeriod.reduce((sum, w) => sum + Number(w.pocketPrice), 0);
  const revenueGrowth = ((secondRevenue - firstRevenue) / firstRevenue) * 100;

  const volumeGrowth = ((secondPeriod.length - firstPeriod.length) / firstPeriod.length) * 100;

  const avgListPrice = waterfalls.reduce((sum, w) => sum + Number(w.listPrice), 0) / waterfalls.length;
  const avgPocketPrice = waterfalls.reduce((sum, w) => sum + Number(w.pocketPrice), 0) / waterfalls.length;
  const realizationRate = (avgPocketPrice / avgListPrice) * 100;

  const avgLeakage = waterfalls.reduce((sum, w) => sum + Number(w.leakagePercent), 0) / waterfalls.length;
  const discountRate = avgLeakage;

  const priceMixEffect = revenueGrowth - volumeGrowth;

  const performanceScore =
    (revenueGrowth > 0 ? 25 : 0) +
    (realizationRate > 80 ? 25 : realizationRate > 70 ? 15 : 0) +
    (discountRate < 15 ? 25 : discountRate < 20 ? 15 : 0) +
    (priceMixEffect > 0 ? 25 : 0);

  return {
    revenueGrowth,
    volumeGrowth,
    priceMixEffect,
    realizationRate,
    discountRate,
    performanceScore,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const PricingStrategyKit = {
  // Models
  PricingStrategyModel,
  PriceElasticityModel,
  CompetitivePricingModel,
  PricingWaterfallModel,
  DiscountStructureModel,
  PriceOptimizationModel,
  ValueBasedPricingModel,
  PriceSegmentationModel,

  // DTOs
  CreatePricingStrategyDto,
  CreatePriceElasticityDto,
  CreateCompetitivePricingDto,
  CreatePricingWaterfallDto,
  CreateDiscountStructureDto,
  CreatePriceOptimizationDto,
  CreateValueBasedPricingDto,
  CreatePriceSegmentationDto,

  // Functions (42 total)
  createPricingStrategy,
  calculatePriceElasticity,
  generateDemandCurve,
  optimizePriceForRevenue,
  optimizePriceForProfit,
  calculateCompetitivePosition,
  buildPricingWaterfall,
  calculateWaterfallLeakage,
  analyzeWaterfallComponents,
  createValueBasedPricing,
  calculateEconomicValue,
  computeValueDriversScore,
  determineValueCapturePercent,
  createDiscountStructure,
  calculateVolumeDiscountTiers,
  applyDiscount,
  calculateCumulativeDiscounts,
  createPriceSegmentation,
  segmentByWillingnessToPay,
  calculatePriceSensitivity,
  applyPsychologicalPricing,
  createBundlePricing,
  calculateTieredPricing,
  optimizeDynamicPricing,
  calculatePromotionalEffectiveness,
  analyzePriceVolumeMix,
  calculatePriceFloor,
  calculatePriceCeiling,
  performSensitivityAnalysis,
  calculateBreakEvenPrice,
  analyzeCompetitivePricingGaps,
  generatePriceRecommendation,
  calculateRevenueAtRisk,
  modelPriceChangeScenarios,
  calculateCLVImpact,
  optimizeSubscriptionTiers,
  calculatePriceDiscrimination,
  analyzePriceAnchoring,
  calculateFreemiumMetrics,
  generatePricingRecommendations,
  calculatePricingPower,
  trackPricingPerformance,
};

export default PricingStrategyKit;
