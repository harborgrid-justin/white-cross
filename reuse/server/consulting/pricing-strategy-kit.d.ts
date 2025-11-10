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
import { Model, Sequelize, Transaction } from 'sequelize';
/**
 * Pricing strategy types
 */
export declare enum PricingStrategy {
    COST_PLUS = "cost_plus",
    VALUE_BASED = "value_based",
    COMPETITIVE = "competitive",
    PENETRATION = "penetration",
    SKIMMING = "skimming",
    DYNAMIC = "dynamic",
    FREEMIUM = "freemium",
    PSYCHOLOGICAL = "psychological",
    BUNDLE = "bundle",
    TIERED = "tiered"
}
/**
 * Price elasticity categories
 */
export declare enum PriceElasticity {
    PERFECTLY_ELASTIC = "perfectly_elastic",
    ELASTIC = "elastic",
    UNIT_ELASTIC = "unit_elastic",
    INELASTIC = "inelastic",
    PERFECTLY_INELASTIC = "perfectly_inelastic"
}
/**
 * Pricing waterfall components
 */
export declare enum WaterfallComponent {
    LIST_PRICE = "list_price",
    INVOICE_DISCOUNT = "invoice_discount",
    OFF_INVOICE_DISCOUNT = "off_invoice_discount",
    REBATE = "rebate",
    PROMOTIONAL_ALLOWANCE = "promotional_allowance",
    PAYMENT_TERMS = "payment_terms",
    FREIGHT = "freight",
    POCKET_PRICE = "pocket_price"
}
/**
 * Customer price segments
 */
export declare enum PriceSegment {
    PREMIUM = "premium",
    MID_MARKET = "mid_market",
    VALUE = "value",
    ECONOMY = "economy",
    ENTERPRISE = "enterprise",
    SMB = "smb",
    CUSTOM = "custom"
}
/**
 * Discount types
 */
export declare enum DiscountType {
    VOLUME = "volume",
    EARLY_PAYMENT = "early_payment",
    SEASONAL = "seasonal",
    PROMOTIONAL = "promotional",
    LOYALTY = "loyalty",
    BUNDLE = "bundle",
    CONTRACT = "contract",
    NEGOTIATED = "negotiated"
}
/**
 * Competitive position
 */
export declare enum CompetitivePosition {
    PREMIUM = "premium",
    PARITY = "parity",
    DISCOUNT = "discount",
    PENETRATION = "penetration"
}
/**
 * Price optimization objective
 */
export declare enum OptimizationObjective {
    MAXIMIZE_REVENUE = "maximize_revenue",
    MAXIMIZE_PROFIT = "maximize_profit",
    MAXIMIZE_VOLUME = "maximize_volume",
    MAXIMIZE_MARKET_SHARE = "maximize_market_share",
    TARGET_MARGIN = "target_margin"
}
/**
 * Psychological pricing tactics
 */
export declare enum PsychologicalTactic {
    CHARM_PRICING = "charm_pricing",// $9.99
    PRESTIGE_PRICING = "prestige_pricing",// $10.00
    ANCHOR_PRICING = "anchor_pricing",
    DECOY_PRICING = "decoy_pricing",
    BUNDLE_PRICING = "bundle_pricing",
    SCARCITY_PRICING = "scarcity_pricing"
}
/**
 * Pricing analysis status
 */
export declare enum AnalysisStatus {
    DRAFT = "draft",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    APPROVED = "approved",
    IMPLEMENTED = "implemented",
    ARCHIVED = "archived"
}
/**
 * Revenue metric types
 */
export declare enum RevenueMetric {
    GROSS_REVENUE = "gross_revenue",
    NET_REVENUE = "net_revenue",
    POCKET_REVENUE = "pocket_revenue",
    RECURRING_REVENUE = "recurring_revenue",
    AVERAGE_REVENUE_PER_USER = "average_revenue_per_user"
}
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
    priceRange: {
        min: number;
        max: number;
    };
    demandCurve: Array<{
        price: number;
        quantity: number;
    }>;
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
    components: Array<{
        type: WaterfallComponent;
        amount: number;
        percent: number;
    }>;
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
    valueDrivers: Array<{
        driver: string;
        value: number;
        weight: number;
    }>;
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
/**
 * DTO for creating a pricing strategy
 */
export declare class CreatePricingStrategyDto {
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
    objectives: OptimizationObjective[];
    competitivePosition: CompetitivePosition;
    metadata?: Record<string, any>;
}
/**
 * DTO for price elasticity analysis
 */
export declare class CreatePriceElasticityDto {
    organizationId: string;
    productId: string;
    segment: PriceSegment;
    elasticityCoefficient: number;
    priceRange: {
        min: number;
        max: number;
    };
    demandCurve: Array<{
        price: number;
        quantity: number;
    }>;
    confidenceInterval: number;
    dataPoints: number;
    methodology: string;
    metadata?: Record<string, any>;
}
/**
 * DTO for competitive pricing benchmark
 */
export declare class CreateCompetitivePricingDto {
    organizationId: string;
    productId: string;
    competitorId: string;
    competitorName: string;
    competitorPrice: number;
    ourPrice: number;
    featureComparison: Record<string, any>;
    valueScore: number;
    benchmarkDate: Date;
    dataSource: string;
    metadata?: Record<string, any>;
}
/**
 * DTO for pricing waterfall analysis
 */
export declare class CreatePricingWaterfallDto {
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
    components: Array<{
        type: WaterfallComponent;
        amount: number;
        percent: number;
    }>;
    metadata?: Record<string, any>;
}
/**
 * DTO for discount structure
 */
export declare class CreateDiscountStructureDto {
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
    metadata?: Record<string, any>;
}
/**
 * DTO for price optimization
 */
export declare class CreatePriceOptimizationDto {
    organizationId: string;
    productId: string;
    objective: OptimizationObjective;
    currentPrice: number;
    optimizedPrice: number;
    expectedRevenue: number;
    expectedProfit: number;
    expectedVolume: number;
    confidenceLevel: number;
    constraints: Record<string, any>;
    assumptions: string[];
    sensitivityAnalysis: Record<string, any>;
    implementationDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * DTO for value-based pricing
 */
export declare class CreateValueBasedPricingDto {
    organizationId: string;
    productId: string;
    segment: PriceSegment;
    economicValue: number;
    perceivedValue: number;
    differentiationValue: number;
    competitiveAlternativePrice: number;
    valueDrivers: Array<{
        driver: string;
        value: number;
        weight: number;
    }>;
    willingnessToPay: number;
    recommendedPrice: number;
    valueCapturePercent: number;
    metadata?: Record<string, any>;
}
/**
 * DTO for price segmentation
 */
export declare class CreatePriceSegmentationDto {
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
/**
 * Pricing Strategy Model
 */
export declare class PricingStrategyModel extends Model<PricingStrategyData> implements PricingStrategyData {
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
    static initialize(sequelize: Sequelize): typeof PricingStrategyModel;
}
/**
 * Price Elasticity Model
 */
export declare class PriceElasticityModel extends Model<PriceElasticityData> implements PriceElasticityData {
    elasticityId: string;
    organizationId: string;
    productId: string;
    segment: PriceSegment;
    elasticityCoefficient: number;
    elasticityCategory: PriceElasticity;
    priceRange: {
        min: number;
        max: number;
    };
    demandCurve: Array<{
        price: number;
        quantity: number;
    }>;
    confidenceInterval: number;
    analysisDate: Date;
    dataPoints: number;
    methodology: string;
    metadata?: Record<string, any>;
    static initialize(sequelize: Sequelize): typeof PriceElasticityModel;
}
/**
 * Competitive Pricing Model
 */
export declare class CompetitivePricingModel extends Model<CompetitivePricingData> implements CompetitivePricingData {
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
    static initialize(sequelize: Sequelize): typeof CompetitivePricingModel;
}
/**
 * Pricing Waterfall Model
 */
export declare class PricingWaterfallModel extends Model<PricingWaterfallData> implements PricingWaterfallData {
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
    components: Array<{
        type: WaterfallComponent;
        amount: number;
        percent: number;
    }>;
    metadata?: Record<string, any>;
    static initialize(sequelize: Sequelize): typeof PricingWaterfallModel;
}
/**
 * Discount Structure Model
 */
export declare class DiscountStructureModel extends Model<DiscountStructureData> implements DiscountStructureData {
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
    static initialize(sequelize: Sequelize): typeof DiscountStructureModel;
}
/**
 * Price Optimization Model
 */
export declare class PriceOptimizationModel extends Model<PriceOptimizationData> implements PriceOptimizationData {
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
    static initialize(sequelize: Sequelize): typeof PriceOptimizationModel;
}
/**
 * Value-Based Pricing Model
 */
export declare class ValueBasedPricingModel extends Model<ValueBasedPricingData> implements ValueBasedPricingData {
    valueId: string;
    organizationId: string;
    productId: string;
    segment: PriceSegment;
    economicValue: number;
    perceivedValue: number;
    differentiationValue: number;
    competitiveAlternativePrice: number;
    valueDrivers: Array<{
        driver: string;
        value: number;
        weight: number;
    }>;
    willingnessToPay: number;
    recommendedPrice: number;
    valueCapturePercent: number;
    analysisDate: Date;
    metadata?: Record<string, any>;
    static initialize(sequelize: Sequelize): typeof ValueBasedPricingModel;
}
/**
 * Price Segmentation Model
 */
export declare class PriceSegmentationModel extends Model<PriceSegmentationData> implements PriceSegmentationData {
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
    static initialize(sequelize: Sequelize): typeof PriceSegmentationModel;
}
/**
 * 1. Create comprehensive pricing strategy
 */
export declare function createPricingStrategy(dto: CreatePricingStrategyDto, transaction?: Transaction): Promise<PricingStrategyModel>;
/**
 * 2. Calculate price elasticity of demand
 */
export declare function calculatePriceElasticity(priceChangePercent: number, quantityChangePercent: number): Promise<{
    coefficient: number;
    category: PriceElasticity;
}>;
/**
 * 3. Generate demand curve from historical data
 */
export declare function generateDemandCurve(historicalData: Array<{
    price: number;
    quantity: number;
}>): Array<{
    price: number;
    quantity: number;
    revenue: number;
}>;
/**
 * 4. Optimize price for maximum revenue
 */
export declare function optimizePriceForRevenue(demandCurve: Array<{
    price: number;
    quantity: number;
}>): {
    optimalPrice: number;
    expectedRevenue: number;
    expectedVolume: number;
};
/**
 * 5. Optimize price for maximum profit
 */
export declare function optimizePriceForProfit(demandCurve: Array<{
    price: number;
    quantity: number;
}>, costPerUnit: number): {
    optimalPrice: number;
    expectedProfit: number;
    expectedVolume: number;
    margin: number;
};
/**
 * 6. Calculate competitive price positioning
 */
export declare function calculateCompetitivePosition(ourPrice: number, competitorPrice: number): {
    difference: number;
    differencePercent: number;
    position: CompetitivePosition;
};
/**
 * 7. Build pricing waterfall analysis
 */
export declare function buildPricingWaterfall(dto: CreatePricingWaterfallDto, transaction?: Transaction): Promise<PricingWaterfallModel>;
/**
 * 8. Calculate pricing waterfall leakage
 */
export declare function calculateWaterfallLeakage(listPrice: number, pocketPrice: number): {
    leakageAmount: number;
    leakagePercent: number;
    retentionPercent: number;
};
/**
 * 9. Analyze waterfall components by type
 */
export declare function analyzeWaterfallComponents(organizationId: string, productId: string, startDate: Date, endDate: Date): Promise<Record<WaterfallComponent, {
    totalAmount: number;
    averagePercent: number;
    count: number;
}>>;
/**
 * 10. Create value-based pricing analysis
 */
export declare function createValueBasedPricing(dto: CreateValueBasedPricingDto, transaction?: Transaction): Promise<ValueBasedPricingModel>;
/**
 * 11. Calculate economic value to customer
 */
export declare function calculateEconomicValue(competitiveAlternativePrice: number, differentiationValue: number): {
    economicValue: number;
    valuePremium: number;
};
/**
 * 12. Compute value drivers weighted score
 */
export declare function computeValueDriversScore(valueDrivers: Array<{
    driver: string;
    value: number;
    weight: number;
}>): {
    totalScore: number;
    weightedAverage: number;
    topDrivers: Array<{
        driver: string;
        contribution: number;
    }>;
};
/**
 * 13. Determine value capture percentage
 */
export declare function determineValueCapturePercent(recommendedPrice: number, economicValue: number): {
    valueCapturePercent: number;
    customerSurplusPercent: number;
};
/**
 * 14. Create discount structure
 */
export declare function createDiscountStructure(dto: CreateDiscountStructureDto, transaction?: Transaction): Promise<DiscountStructureModel>;
/**
 * 15. Calculate volume discount tiers
 */
export declare function calculateVolumeDiscountTiers(basePrice: number, tiers: Array<{
    minQuantity: number;
    discountPercent: number;
}>): Array<{
    minQuantity: number;
    maxQuantity: number | null;
    discountPercent: number;
    pricePerUnit: number;
    savings: number;
}>;
/**
 * 16. Apply discount to price
 */
export declare function applyDiscount(basePrice: number, discount: {
    discountPercent?: number;
    discountAmount?: number;
}): {
    finalPrice: number;
    discountApplied: number;
    savingsPercent: number;
};
/**
 * 17. Calculate cumulative discount impact
 */
export declare function calculateCumulativeDiscounts(basePrice: number, discounts: Array<{
    type: string;
    percent: number;
}>): {
    finalPrice: number;
    totalDiscount: number;
    totalDiscountPercent: number;
    effectiveRate: number;
};
/**
 * 18. Create price segmentation
 */
export declare function createPriceSegmentation(dto: CreatePriceSegmentationDto, transaction?: Transaction): Promise<PriceSegmentationModel>;
/**
 * 19. Segment customers by willingness to pay
 */
export declare function segmentByWillingnessToPay(customers: Array<{
    customerId: string;
    willingnessToPay: number;
    annualRevenue: number;
}>, segments?: number): Array<{
    segment: number;
    minWTP: number;
    maxWTP: number;
    customerCount: number;
    totalRevenue: number;
    avgWTP: number;
}>;
/**
 * 20. Calculate price sensitivity by segment
 */
export declare function calculatePriceSensitivity(segment: {
    priceElasticity: number;
    competitorSwitchRate: number;
    priceImportance: number;
}): {
    sensitivityScore: number;
    sensitivityLevel: 'low' | 'medium' | 'high' | 'very_high';
};
/**
 * 21. Apply psychological pricing tactics
 */
export declare function applyPsychologicalPricing(price: number, tactic: PsychologicalTactic): {
    adjustedPrice: number;
    displayPrice: string;
    tactic: PsychologicalTactic;
};
/**
 * 22. Create bundle pricing strategy
 */
export declare function createBundlePricing(products: Array<{
    productId: string;
    individualPrice: number;
}>, bundleDiscountPercent: number): {
    bundlePrice: number;
    individualTotal: number;
    savings: number;
    savingsPercent: number;
};
/**
 * 23. Calculate tiered pricing structure
 */
export declare function calculateTieredPricing(usage: number, tiers: Array<{
    upTo: number | null;
    pricePerUnit: number;
}>): {
    totalCost: number;
    effectiveRate: number;
    breakdown: Array<{
        tier: number;
        units: number;
        cost: number;
    }>;
};
/**
 * 24. Optimize dynamic pricing
 */
export declare function optimizeDynamicPricing(basePrice: number, factors: {
    demandLevel: number;
    inventory: number;
    competitorPrice: number;
    timeToEvent?: number;
}): {
    dynamicPrice: number;
    adjustmentPercent: number;
    factors: Record<string, number>;
};
/**
 * 25. Calculate promotional pricing effectiveness
 */
export declare function calculatePromotionalEffectiveness(baseline: {
    price: number;
    volume: number;
    revenue: number;
}, promotional: {
    price: number;
    volume: number;
    revenue: number;
    promotionCost: number;
}): {
    volumeLift: number;
    volumeLiftPercent: number;
    revenueChange: number;
    revenueChangePercent: number;
    profitImpact: number;
    roi: number;
    isEffective: boolean;
};
/**
 * 26. Analyze price-volume-mix
 */
export declare function analyzePriceVolumeMix(currentPeriod: {
    price: number;
    volume: number;
    mix: number;
}[], priorPeriod: {
    price: number;
    volume: number;
    mix: number;
}[]): {
    priceEffect: number;
    volumeEffect: number;
    mixEffect: number;
    totalVariance: number;
};
/**
 * 27. Calculate price floor based on costs
 */
export declare function calculatePriceFloor(costs: {
    directMaterial: number;
    directLabor: number;
    variableOverhead: number;
    fixedOverhead: number;
    allocatedFixed?: number;
}, targetMargin: number): {
    priceFloor: number;
    variableCost: number;
    fullCost: number;
    marginPrice: number;
};
/**
 * 28. Calculate price ceiling based on value
 */
export declare function calculatePriceCeiling(valueToCustomer: number, competitiveBenchmark: number, maxWillingnessToPay: number): {
    priceCeiling: number;
    constrainingFactor: 'value' | 'competitive' | 'willingness';
};
/**
 * 29. Perform price sensitivity analysis
 */
export declare function performSensitivityAnalysis(baseCase: {
    price: number;
    volume: number;
    cost: number;
}, priceChanges: number[]): Array<{
    priceChange: number;
    newPrice: number;
    estimatedVolume: number;
    revenue: number;
    profit: number;
    margin: number;
}>;
/**
 * 30. Calculate break-even price
 */
export declare function calculateBreakEvenPrice(fixedCosts: number, variableCostPerUnit: number, targetVolume: number): {
    breakEvenPrice: number;
    contributionMargin: number;
    contributionMarginRatio: number;
};
/**
 * 31. Analyze competitive pricing gaps
 */
export declare function analyzeCompetitivePricingGaps(organizationId: string, productId: string): Promise<{
    averageCompetitorPrice: number;
    priceGap: number;
    priceGapPercent: number;
    competitorsAbove: number;
    competitorsBelow: number;
    recommendedPosition: CompetitivePosition;
}>;
/**
 * 32. Generate price recommendation
 */
export declare function generatePriceRecommendation(inputs: {
    costFloor: number;
    valueCeiling: number;
    competitivePrice: number;
    targetMargin: number;
    marketPosition: 'leader' | 'challenger' | 'follower' | 'niche';
}): {
    recommendedPrice: number;
    rationale: string;
    confidenceLevel: number;
};
/**
 * 33. Calculate revenue at risk from pricing
 */
export declare function calculateRevenueAtRisk(organizationId: string, productId: string, priceIncreasePercent: number, elasticity: number): Promise<{
    currentRevenue: number;
    projectedRevenue: number;
    revenueAtRisk: number;
    riskPercent: number;
}>;
/**
 * 34. Model price change scenarios
 */
export declare function modelPriceChangeScenarios(baseline: {
    price: number;
    volume: number;
    cost: number;
}, scenarios: Array<{
    name: string;
    priceChange: number;
    elasticity: number;
}>): Array<{
    scenario: string;
    newPrice: number;
    projectedVolume: number;
    revenue: number;
    profit: number;
    revenueChange: number;
    profitChange: number;
}>;
/**
 * 35. Calculate customer lifetime value impact
 */
export declare function calculateCLVImpact(pricing: {
    acquisitionPrice: number;
    renewalPrice: number;
    churnRate: number;
}, costs: {
    acquisitionCost: number;
    serviceCost: number;
}, averageLifespanYears: number): {
    clv: number;
    customerMargin: number;
    paybackPeriod: number;
    roi: number;
};
/**
 * 36. Optimize subscription pricing tiers
 */
export declare function optimizeSubscriptionTiers(customerDistribution: Array<{
    usageLevel: number;
    willingnessToPay: number;
    count: number;
}>, targetTiers: number): Array<{
    tier: number;
    name: string;
    usageLimit: number;
    price: number;
    targetCustomers: number;
    projectedRevenue: number;
}>;
/**
 * 37. Calculate price discrimination opportunities
 */
export declare function calculatePriceDiscrimination(segments: Array<{
    segment: string;
    elasticity: number;
    size: number;
    baseWTP: number;
}>): Array<{
    segment: string;
    optimalPrice: number;
    projectedVolume: number;
    revenue: number;
    consumerSurplus: number;
}>;
/**
 * 38. Analyze price anchoring effects
 */
export declare function analyzePriceAnchoring(anchorPrice: number, actualPrice: number, referencePrice: number): {
    perceivedValue: number;
};
/**
 * 39. Calculate freemium conversion metrics
 */
export declare function calculateFreemiumMetrics(data: {
    freeUsers: number;
    paidUsers: number;
    conversionRate: number;
    avgRevenuePerPaidUser: number;
    freeTierCost: number;
}): {
    totalRevenue: number;
    revenuePerUser: number;
    costToServe: number;
    contributionMargin: number;
    breakEvenConversionRate: number;
};
/**
 * 40. Generate pricing strategy recommendations
 */
export declare function generatePricingRecommendations(organizationId: string, productId: string): Promise<{
    currentStrategy: PricingStrategy;
    recommendedStrategy: PricingStrategy;
    rationale: string[];
    expectedImpact: {
        revenue: number;
        margin: number;
        volume: number;
    };
    implementationSteps: string[];
}>;
/**
 * 41. Calculate pricing power index
 */
export declare function calculatePricingPower(metrics: {
    marketShare: number;
    brandStrength: number;
    productDifferentiation: number;
    switchingCosts: number;
    customerLoyalty: number;
}): {
    pricingPowerIndex: number;
    pricingPowerLevel: 'low' | 'moderate' | 'high' | 'very_high';
    recommendations: string[];
};
/**
 * 42. Track pricing strategy performance
 */
export declare function trackPricingPerformance(organizationId: string, productId: string, startDate: Date, endDate: Date): Promise<{
    revenueGrowth: number;
    volumeGrowth: number;
    priceMixEffect: number;
    realizationRate: number;
    discountRate: number;
    performanceScore: number;
}>;
export declare const PricingStrategyKit: {
    PricingStrategyModel: typeof PricingStrategyModel;
    PriceElasticityModel: typeof PriceElasticityModel;
    CompetitivePricingModel: typeof CompetitivePricingModel;
    PricingWaterfallModel: typeof PricingWaterfallModel;
    DiscountStructureModel: typeof DiscountStructureModel;
    PriceOptimizationModel: typeof PriceOptimizationModel;
    ValueBasedPricingModel: typeof ValueBasedPricingModel;
    PriceSegmentationModel: typeof PriceSegmentationModel;
    CreatePricingStrategyDto: typeof CreatePricingStrategyDto;
    CreatePriceElasticityDto: typeof CreatePriceElasticityDto;
    CreateCompetitivePricingDto: typeof CreateCompetitivePricingDto;
    CreatePricingWaterfallDto: typeof CreatePricingWaterfallDto;
    CreateDiscountStructureDto: typeof CreateDiscountStructureDto;
    CreatePriceOptimizationDto: typeof CreatePriceOptimizationDto;
    CreateValueBasedPricingDto: typeof CreateValueBasedPricingDto;
    CreatePriceSegmentationDto: typeof CreatePriceSegmentationDto;
    createPricingStrategy: typeof createPricingStrategy;
    calculatePriceElasticity: typeof calculatePriceElasticity;
    generateDemandCurve: typeof generateDemandCurve;
    optimizePriceForRevenue: typeof optimizePriceForRevenue;
    optimizePriceForProfit: typeof optimizePriceForProfit;
    calculateCompetitivePosition: typeof calculateCompetitivePosition;
    buildPricingWaterfall: typeof buildPricingWaterfall;
    calculateWaterfallLeakage: typeof calculateWaterfallLeakage;
    analyzeWaterfallComponents: typeof analyzeWaterfallComponents;
    createValueBasedPricing: typeof createValueBasedPricing;
    calculateEconomicValue: typeof calculateEconomicValue;
    computeValueDriversScore: typeof computeValueDriversScore;
    determineValueCapturePercent: typeof determineValueCapturePercent;
    createDiscountStructure: typeof createDiscountStructure;
    calculateVolumeDiscountTiers: typeof calculateVolumeDiscountTiers;
    applyDiscount: typeof applyDiscount;
    calculateCumulativeDiscounts: typeof calculateCumulativeDiscounts;
    createPriceSegmentation: typeof createPriceSegmentation;
    segmentByWillingnessToPay: typeof segmentByWillingnessToPay;
    calculatePriceSensitivity: typeof calculatePriceSensitivity;
    applyPsychologicalPricing: typeof applyPsychologicalPricing;
    createBundlePricing: typeof createBundlePricing;
    calculateTieredPricing: typeof calculateTieredPricing;
    optimizeDynamicPricing: typeof optimizeDynamicPricing;
    calculatePromotionalEffectiveness: typeof calculatePromotionalEffectiveness;
    analyzePriceVolumeMix: typeof analyzePriceVolumeMix;
    calculatePriceFloor: typeof calculatePriceFloor;
    calculatePriceCeiling: typeof calculatePriceCeiling;
    performSensitivityAnalysis: typeof performSensitivityAnalysis;
    calculateBreakEvenPrice: typeof calculateBreakEvenPrice;
    analyzeCompetitivePricingGaps: typeof analyzeCompetitivePricingGaps;
    generatePriceRecommendation: typeof generatePriceRecommendation;
    calculateRevenueAtRisk: typeof calculateRevenueAtRisk;
    modelPriceChangeScenarios: typeof modelPriceChangeScenarios;
    calculateCLVImpact: typeof calculateCLVImpact;
    optimizeSubscriptionTiers: typeof optimizeSubscriptionTiers;
    calculatePriceDiscrimination: typeof calculatePriceDiscrimination;
    analyzePriceAnchoring: typeof analyzePriceAnchoring;
    calculateFreemiumMetrics: typeof calculateFreemiumMetrics;
    generatePricingRecommendations: typeof generatePricingRecommendations;
    calculatePricingPower: typeof calculatePricingPower;
    trackPricingPerformance: typeof trackPricingPerformance;
};
export default PricingStrategyKit;
//# sourceMappingURL=pricing-strategy-kit.d.ts.map