/**
 * LOC: ORD-DYN-001
 * File: /reuse/order/dynamic-pricing-engine-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Order controllers
 *   - Pricing services
 *   - Product services
 *   - Analytics services
 */
import { Model } from 'sequelize-typescript';
/**
 * Dynamic pricing strategy types
 */
export declare enum PricingStrategy {
    DEMAND_BASED = "DEMAND_BASED",
    TIME_BASED = "TIME_BASED",
    COMPETITOR_BASED = "COMPETITOR_BASED",
    COST_PLUS = "COST_PLUS",
    VALUE_BASED = "VALUE_BASED",
    PENETRATION = "PENETRATION",
    SKIMMING = "SKIMMING",
    BUNDLE = "BUNDLE",
    PSYCHOLOGICAL = "PSYCHOLOGICAL",
    DYNAMIC_SURGE = "DYNAMIC_SURGE",
    SEGMENTED = "SEGMENTED",
    GEOGRAPHIC = "GEOGRAPHIC"
}
/**
 * Price optimization objective
 */
export declare enum OptimizationObjective {
    MAXIMIZE_REVENUE = "MAXIMIZE_REVENUE",
    MAXIMIZE_PROFIT = "MAXIMIZE_PROFIT",
    MAXIMIZE_VOLUME = "MAXIMIZE_VOLUME",
    MAXIMIZE_MARKET_SHARE = "MAXIMIZE_MARKET_SHARE",
    TARGET_MARGIN = "TARGET_MARGIN",
    INVENTORY_CLEARANCE = "INVENTORY_CLEARANCE",
    COMPETITIVE_PARITY = "COMPETITIVE_PARITY"
}
/**
 * Customer segment types for pricing
 */
export declare enum CustomerSegment {
    ENTERPRISE = "ENTERPRISE",
    SMALL_BUSINESS = "SMALL_BUSINESS",
    INDIVIDUAL = "INDIVIDUAL",
    VIP = "VIP",
    WHOLESALE = "WHOLESALE",
    RETAIL = "RETAIL",
    GOVERNMENT = "GOVERNMENT",
    EDUCATION = "EDUCATION",
    NON_PROFIT = "NON_PROFIT",
    NEW_CUSTOMER = "NEW_CUSTOMER",
    LOYAL_CUSTOMER = "LOYAL_CUSTOMER"
}
/**
 * Geographic pricing zones
 */
export declare enum GeographicZone {
    METRO_PREMIUM = "METRO_PREMIUM",
    METRO_STANDARD = "METRO_STANDARD",
    SUBURBAN = "SUBURBAN",
    RURAL = "RURAL",
    INTERNATIONAL = "INTERNATIONAL",
    HIGH_COST_AREA = "HIGH_COST_AREA",
    LOW_COST_AREA = "LOW_COST_AREA"
}
/**
 * Time-based pricing period types
 */
export declare enum TimePricingPeriod {
    PEAK_HOURS = "PEAK_HOURS",
    OFF_PEAK = "OFF_PEAK",
    WEEKEND = "WEEKEND",
    WEEKDAY = "WEEKDAY",
    HOLIDAY = "HOLIDAY",
    SEASONAL_HIGH = "SEASONAL_HIGH",
    SEASONAL_LOW = "SEASONAL_LOW",
    FLASH_SALE = "FLASH_SALE",
    EARLY_BIRD = "EARLY_BIRD",
    LATE_NIGHT = "LATE_NIGHT"
}
/**
 * Price change reason codes
 */
export declare enum PriceChangeReason {
    DEMAND_SURGE = "DEMAND_SURGE",
    DEMAND_DROP = "DEMAND_DROP",
    COMPETITOR_PRICE_CHANGE = "COMPETITOR_PRICE_CHANGE",
    COST_INCREASE = "COST_INCREASE",
    COST_DECREASE = "COST_DECREASE",
    INVENTORY_HIGH = "INVENTORY_HIGH",
    INVENTORY_LOW = "INVENTORY_LOW",
    SEASONAL_ADJUSTMENT = "SEASONAL_ADJUSTMENT",
    PROMOTION = "PROMOTION",
    CLEARANCE = "CLEARANCE",
    NEW_PRODUCT_LAUNCH = "NEW_PRODUCT_LAUNCH",
    MARGIN_OPTIMIZATION = "MARGIN_OPTIMIZATION",
    AB_TEST = "AB_TEST",
    MANUAL_OVERRIDE = "MANUAL_OVERRIDE"
}
/**
 * Price elasticity classification
 */
export declare enum PriceElasticity {
    HIGHLY_ELASTIC = "HIGHLY_ELASTIC",// Elasticity > 1.5
    ELASTIC = "ELASTIC",// Elasticity 1.0 - 1.5
    UNIT_ELASTIC = "UNIT_ELASTIC",// Elasticity ~1.0
    INELASTIC = "INELASTIC",// Elasticity 0.5 - 1.0
    HIGHLY_INELASTIC = "HIGHLY_INELASTIC"
}
/**
 * A/B test status
 */
export declare enum ABTestStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
    WINNER_SELECTED = "WINNER_SELECTED",
    CANCELLED = "CANCELLED"
}
/**
 * Price recommendation confidence level
 */
export declare enum RecommendationConfidence {
    VERY_HIGH = "VERY_HIGH",// > 90%
    HIGH = "HIGH",// 75-90%
    MEDIUM = "MEDIUM",// 50-75%
    LOW = "LOW",// 25-50%
    VERY_LOW = "VERY_LOW"
}
/**
 * Margin enforcement action
 */
export declare enum MarginAction {
    APPROVE = "APPROVE",
    REJECT = "REJECT",
    REQUIRE_MANAGER_APPROVAL = "REQUIRE_MANAGER_APPROVAL",
    REQUIRE_DIRECTOR_APPROVAL = "REQUIRE_DIRECTOR_APPROVAL",
    WARN = "WARN",
    AUTO_ADJUST = "AUTO_ADJUST"
}
/**
 * Real-time pricing context
 */
export interface PricingContext {
    customerId?: string;
    customerSegment?: CustomerSegment;
    geographicZone?: GeographicZone;
    quantity: number;
    orderValue?: number;
    timestamp: Date;
    channel?: string;
    deviceType?: string;
    sessionData?: Record<string, unknown>;
    marketConditions?: MarketConditions;
}
/**
 * Market conditions data
 */
export interface MarketConditions {
    demandLevel: number;
    competitorPrices: CompetitorPrice[];
    inventoryLevel: number;
    seasonalFactor: number;
    trendDirection: 'UP' | 'DOWN' | 'STABLE';
    volatility: number;
}
/**
 * Competitor price information
 */
export interface CompetitorPrice {
    competitorId: string;
    competitorName: string;
    price: number;
    lastUpdated: Date;
    availability: boolean;
    shippingCost?: number;
    totalCost?: number;
}
/**
 * Volume-based pricing tier
 */
export interface VolumePricingTier {
    minQuantity: number;
    maxQuantity?: number;
    price?: number;
    discountPercent?: number;
    discountAmount?: number;
}
/**
 * Price calculation result
 */
export interface PriceCalculationResult {
    basePrice: number;
    finalPrice: number;
    adjustments: PriceAdjustment[];
    margin: number;
    marginPercent: number;
    confidence: RecommendationConfidence;
    validUntil: Date;
    appliedStrategies: PricingStrategy[];
    metadata: Record<string, unknown>;
}
/**
 * Price adjustment detail
 */
export interface PriceAdjustment {
    type: string;
    description: string;
    amount: number;
    percent?: number;
    reason: PriceChangeReason;
    appliedAt: Date;
}
/**
 * Elasticity analysis result
 */
export interface ElasticityAnalysisResult {
    productId: string;
    currentPrice: number;
    elasticity: number;
    classification: PriceElasticity;
    optimalPriceRange: PriceRange;
    demandCurve: DemandPoint[];
}
/**
 * Price range
 */
export interface PriceRange {
    min: number;
    max: number;
    optimal: number;
    current: number;
}
/**
 * Demand curve point
 */
export interface DemandPoint {
    price: number;
    quantity: number;
    revenue: number;
    timestamp?: Date;
}
/**
 * Revenue impact scenario
 */
export interface RevenueImpact {
    priceChange: number;
    priceChangePercent: number;
    newPrice: number;
    expectedDemandChange: number;
    expectedDemandChangePercent: number;
    expectedRevenue: number;
    expectedRevenueChange: number;
    expectedProfit: number;
    expectedProfitChange: number;
}
/**
 * Margin policy
 */
export interface MarginPolicy {
    productCategory?: string;
    customerSegment?: CustomerSegment;
    minMarginPercent: number;
    targetMarginPercent: number;
    maxDiscountPercent: number;
    requiresApprovalBelow: number;
    autoRejectBelow?: number;
}
/**
 * A/B pricing test configuration
 */
export interface ABPricingTest {
    testId: string;
    productId: string;
    testName: string;
    description: string;
    status: ABTestStatus;
    variants: PriceVariant[];
    trafficSplit: number[];
    startDate: Date;
    endDate: Date;
    targetSampleSize: number;
    currentSampleSize: number;
    metrics: ABTestMetrics;
    winningVariant?: string;
}
/**
 * Price variant for A/B testing
 */
export interface PriceVariant {
    variantId: string;
    variantName: string;
    price: number;
    description?: string;
}
/**
 * A/B test metrics
 */
export interface ABTestMetrics {
    variantResults: VariantResult[];
    statisticalSignificance: number;
    confidenceLevel: number;
    expectedLift: number;
    actualLift?: number;
}
/**
 * Variant test results
 */
export interface VariantResult {
    variantId: string;
    impressions: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
    averageOrderValue: number;
    profit: number;
}
/**
 * Price recommendation
 */
export interface PriceRecommendation {
    productId: string;
    currentPrice: number;
    recommendedPrice: number;
    priceChange: number;
    priceChangePercent: number;
    confidence: RecommendationConfidence;
    reasoning: string[];
    expectedImpact: ExpectedImpact;
    riskFactors: string[];
    validUntil: Date;
    generatedAt: Date;
    model: string;
    modelVersion: string;
}
/**
 * Expected impact of price change
 */
export interface ExpectedImpact {
    revenueChange: number;
    revenueChangePercent: number;
    volumeChange: number;
    volumeChangePercent: number;
    profitChange: number;
    profitChangePercent: number;
    marketShareChange?: number;
}
/**
 * Flash sale configuration
 */
export interface FlashSaleConfig {
    saleId: string;
    productIds: string[];
    discountPercent: number;
    startTime: Date;
    endTime: Date;
    maxQuantity?: number;
    maxPerCustomer?: number;
    triggerCondition?: string;
}
/**
 * Clearance pricing configuration
 */
export interface ClearanceConfig {
    productId: string;
    currentInventory: number;
    targetInventory: number;
    daysRemaining: number;
    costBasis: number;
    currentPrice: number;
    floorPrice: number;
    aggressiveness: 'LOW' | 'MEDIUM' | 'HIGH' | 'AGGRESSIVE';
}
/**
 * Price history model for audit and analysis
 */
export declare class PriceHistory extends Model {
    priceHistoryId: string;
    productId: string;
    previousPrice: number;
    newPrice: number;
    priceChange: number;
    priceChangePercent: number;
    effectiveDate: Date;
    pricingStrategy: PricingStrategy;
    changeReason: PriceChangeReason;
    reasoning: string[];
    marketConditions: MarketConditions;
    changedBy: string;
    isAutomated: boolean;
    abTestId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Dynamic pricing rule model
 */
export declare class PricingRule extends Model {
    ruleId: string;
    ruleName: string;
    productId: string;
    productCategory: string;
    strategy: PricingStrategy;
    customerSegment: CustomerSegment;
    geographicZone: GeographicZone;
    priority: number;
    configuration: Record<string, unknown>;
    isActive: boolean;
    validFrom: Date;
    validUntil: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Price elasticity data model
 */
export declare class PriceElasticityData extends Model {
    elasticityId: string;
    productId: string;
    elasticity: number;
    classification: PriceElasticity;
    demandCurve: DemandPoint[];
    optimalPriceRange: PriceRange;
    confidence: number;
    dataPoints: number;
    lastCalculated: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * DTO for real-time price calculation request
 */
export declare class CalculatePriceDto {
    productId: string;
    quantity: number;
    customerId?: string;
    customerSegment?: CustomerSegment;
    geographicZone?: GeographicZone;
    channel?: string;
    includeCompetitorAnalysis?: boolean;
}
/**
 * DTO for price optimization request
 */
export declare class OptimizePriceDto {
    productId: string;
    objective: OptimizationObjective;
    minPrice?: number;
    maxPrice?: number;
    minMarginPercent?: number;
    timeHorizonDays?: number;
}
/**
 * DTO for creating A/B pricing test
 */
export declare class CreateABTestDto {
    productId: string;
    testName: string;
    description?: string;
    variants: PriceVariant[];
    trafficSplit: number[];
    startDate: Date;
    endDate: Date;
    targetSampleSize: number;
}
/**
 * Calculate real-time price with dynamic adjustments
 *
 * @param productId - Product identifier
 * @param context - Pricing context with customer and market data
 * @returns Price calculation result with all adjustments
 *
 * @example
 * const price = await calculateRealtimePrice('PROD-123', {
 *   customerId: 'CUST-456',
 *   quantity: 10,
 *   geographicZone: GeographicZone.METRO_PREMIUM,
 *   timestamp: new Date()
 * });
 */
export declare function calculateRealtimePrice(productId: string, context: PricingContext): Promise<PriceCalculationResult>;
/**
 * Calculate demand-based dynamic price
 *
 * @param productId - Product identifier
 * @param demandLevel - Current demand level (0-100)
 * @param inventoryLevel - Current inventory level
 * @returns Adjusted price based on demand
 *
 * @example
 * const price = await calculateDemandBasedPrice('PROD-123', 85, 150);
 */
export declare function calculateDemandBasedPrice(productId: string, demandLevel: number, inventoryLevel: number): Promise<number>;
/**
 * Calculate time-based dynamic price
 *
 * @param productId - Product identifier
 * @param timePeriod - Time-based pricing period
 * @param basePrice - Base price to adjust
 * @returns Time-adjusted price
 *
 * @example
 * const price = await calculateTimeBasedPrice('PROD-123', TimePricingPeriod.PEAK_HOURS, 99.99);
 */
export declare function calculateTimeBasedPrice(productId: string, timePeriod: TimePricingPeriod, basePrice: number): Promise<number>;
/**
 * Calculate competitor-based dynamic price
 *
 * @param productId - Product identifier
 * @param competitorPrices - Array of competitor pricing data
 * @param strategy - Pricing strategy (BELOW/MATCH/PREMIUM)
 * @returns Competitor-adjusted price
 *
 * @example
 * const price = await calculateCompetitorBasedPrice('PROD-123', competitors, 'BELOW');
 */
export declare function calculateCompetitorBasedPrice(productId: string, competitorPrices: CompetitorPrice[], strategy?: 'BELOW' | 'MATCH' | 'PREMIUM'): Promise<number>;
/**
 * Calculate volume-based tiered pricing
 *
 * @param productId - Product identifier
 * @param quantity - Order quantity
 * @param basePrice - Base unit price
 * @returns Volume-adjusted price per unit
 *
 * @example
 * const unitPrice = await calculateVolumeTierPrice('PROD-123', 100, 10.00);
 */
export declare function calculateVolumeTierPrice(productId: string, quantity: number, basePrice: number): Promise<number>;
/**
 * Calculate customer segment-based pricing
 *
 * @param productId - Product identifier
 * @param customerSegment - Customer segment type
 * @param basePrice - Base price
 * @returns Segment-adjusted price
 *
 * @example
 * const price = await calculateSegmentPrice('PROD-123', CustomerSegment.ENTERPRISE, 100.00);
 */
export declare function calculateSegmentPrice(productId: string, customerSegment: CustomerSegment, basePrice: number): Promise<number>;
/**
 * Calculate geographic zone-based pricing
 *
 * @param productId - Product identifier
 * @param geographicZone - Geographic pricing zone
 * @param basePrice - Base price
 * @returns Geographic-adjusted price
 *
 * @example
 * const price = await calculateGeographicPrice('PROD-123', GeographicZone.METRO_PREMIUM, 100.00);
 */
export declare function calculateGeographicPrice(productId: string, geographicZone: GeographicZone, basePrice: number): Promise<number>;
/**
 * Optimize price for specific objective
 *
 * @param productId - Product identifier
 * @param objective - Optimization objective
 * @param constraints - Pricing constraints
 * @returns Optimized price recommendation
 *
 * @example
 * const optimized = await optimizePrice('PROD-123', OptimizationObjective.MAXIMIZE_PROFIT, {
 *   minPrice: 50,
 *   maxPrice: 150,
 *   minMarginPercent: 20
 * });
 */
export declare function optimizePrice(productId: string, objective: OptimizationObjective, constraints?: {
    minPrice?: number;
    maxPrice?: number;
    minMarginPercent?: number;
    timeHorizonDays?: number;
}): Promise<PriceRecommendation>;
/**
 * Calculate optimal price for margin target
 *
 * @param productId - Product identifier
 * @param targetMarginPercent - Target margin percentage
 * @param cost - Product cost
 * @returns Optimal price for target margin
 *
 * @example
 * const price = await calculateMarginTargetPrice('PROD-123', 30, 70.00);
 */
export declare function calculateMarginTargetPrice(productId: string, targetMarginPercent: number, cost: number): Promise<number>;
/**
 * Calculate price floor based on cost and minimum margin
 *
 * @param cost - Product cost
 * @param minMarginPercent - Minimum acceptable margin percentage
 * @returns Minimum acceptable price
 *
 * @example
 * const floorPrice = calculatePriceFloor(80.00, 15);
 */
export declare function calculatePriceFloor(cost: number, minMarginPercent: number): number;
/**
 * Calculate price ceiling based on market conditions
 *
 * @param productId - Product identifier
 * @param marketConditions - Current market conditions
 * @returns Maximum recommended price
 *
 * @example
 * const ceiling = await calculatePriceCeiling('PROD-123', marketData);
 */
export declare function calculatePriceCeiling(productId: string, marketConditions: MarketConditions): Promise<number>;
/**
 * Calculate margin percentage from price and cost
 *
 * @param price - Selling price
 * @param cost - Product cost
 * @returns Margin percentage
 *
 * @example
 * const margin = calculateMarginPercent(100.00, 70.00); // Returns 30
 */
export declare function calculateMarginPercent(price: number, cost: number): number;
/**
 * Calculate markup percentage from cost
 *
 * @param price - Selling price
 * @param cost - Product cost
 * @returns Markup percentage
 *
 * @example
 * const markup = calculateMarkupPercent(100.00, 70.00); // Returns 42.86
 */
export declare function calculateMarkupPercent(price: number, cost: number): number;
/**
 * Enforce margin policy on price
 *
 * @param price - Proposed price
 * @param cost - Product cost
 * @param policy - Margin policy
 * @returns Margin enforcement result
 *
 * @example
 * const result = enforceMarginPolicy(95.00, 80.00, policy);
 */
export declare function enforceMarginPolicy(price: number, cost: number, policy: MarginPolicy): {
    action: MarginAction;
    adjustedPrice?: number;
    reason: string;
};
/**
 * Calculate blended margin for multiple products
 *
 * @param items - Array of items with price, cost, and quantity
 * @returns Blended margin percentage
 *
 * @example
 * const blendedMargin = calculateBlendedMargin(orderItems);
 */
export declare function calculateBlendedMargin(items: Array<{
    price: number;
    cost: number;
    quantity: number;
}>): number;
/**
 * Create flash sale pricing
 *
 * @param config - Flash sale configuration
 * @returns Flash sale pricing details
 *
 * @example
 * const flashSale = await createFlashSale({
 *   productIds: ['PROD-123'],
 *   discountPercent: 30,
 *   startTime: new Date(),
 *   endTime: new Date(Date.now() + 3600000)
 * });
 */
export declare function createFlashSale(config: FlashSaleConfig): Promise<{
    saleId: string;
    prices: Record<string, number>;
}>;
/**
 * Calculate clearance pricing based on inventory
 *
 * @param config - Clearance configuration
 * @returns Recommended clearance price
 *
 * @example
 * const clearancePrice = await calculateClearancePrice({
 *   productId: 'PROD-123',
 *   currentInventory: 500,
 *   targetInventory: 50,
 *   daysRemaining: 30,
 *   costBasis: 60.00,
 *   currentPrice: 100.00,
 *   floorPrice: 65.00,
 *   aggressiveness: 'HIGH'
 * });
 */
export declare function calculateClearancePrice(config: ClearanceConfig): Promise<number>;
/**
 * Calculate markdown schedule for seasonal clearance
 *
 * @param productId - Product identifier
 * @param startPrice - Starting price
 * @param floorPrice - Minimum acceptable price
 * @param durationDays - Markdown period in days
 * @returns Scheduled markdown prices by date
 *
 * @example
 * const schedule = calculateMarkdownSchedule('PROD-123', 100, 50, 60);
 */
export declare function calculateMarkdownSchedule(productId: string, startPrice: number, floorPrice: number, durationDays: number): Array<{
    date: Date;
    price: number;
    discountPercent: number;
}>;
/**
 * Calculate price elasticity of demand
 *
 * @param productId - Product identifier
 * @param historicalData - Historical price and quantity data
 * @returns Elasticity analysis result
 *
 * @example
 * const elasticity = await calculatePriceElasticity('PROD-123', salesData);
 */
export declare function calculatePriceElasticity(productId: string, historicalData: Array<{
    price: number;
    quantity: number;
    date: Date;
}>): Promise<ElasticityAnalysisResult>;
/**
 * Analyze price sensitivity for customer segment
 *
 * @param productId - Product identifier
 * @param segment - Customer segment
 * @param pricePoints - Array of price points to test
 * @returns Sensitivity analysis results
 *
 * @example
 * const sensitivity = await analyzePriceSensitivity('PROD-123', CustomerSegment.ENTERPRISE, [90, 95, 100, 105, 110]);
 */
export declare function analyzePriceSensitivity(productId: string, segment: CustomerSegment, pricePoints: number[]): Promise<Array<{
    price: number;
    expectedDemand: number;
    expectedRevenue: number;
}>>;
/**
 * Create A/B pricing test
 *
 * @param config - A/B test configuration
 * @returns Created A/B test
 *
 * @example
 * const test = await createABPricingTest({
 *   productId: 'PROD-123',
 *   testName: 'Price Optimization Test',
 *   variants: [
 *     { variantId: 'A', variantName: 'Current', price: 99.99 },
 *     { variantId: 'B', variantName: 'Optimized', price: 94.99 }
 *   ],
 *   trafficSplit: [50, 50],
 *   startDate: new Date(),
 *   endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
 *   targetSampleSize: 1000
 * });
 */
export declare function createABPricingTest(config: CreateABTestDto): Promise<ABPricingTest>;
/**
 * Assign price variant for A/B test
 *
 * @param testId - A/B test identifier
 * @param customerId - Customer identifier for consistent assignment
 * @returns Assigned variant
 *
 * @example
 * const variant = await assignABVariant('AB-123', 'CUST-456');
 */
export declare function assignABVariant(testId: string, customerId: string): Promise<PriceVariant>;
/**
 * Analyze A/B test results
 *
 * @param testId - A/B test identifier
 * @returns Test analysis with statistical significance
 *
 * @example
 * const analysis = await analyzeABTestResults('AB-123');
 */
export declare function analyzeABTestResults(testId: string): Promise<{
    test: ABPricingTest;
    recommendation: string;
    confidence: number;
}>;
/**
 * Generate ML-powered price recommendation
 *
 * @param productId - Product identifier
 * @param features - Contextual features for recommendation
 * @returns Price recommendation with confidence and reasoning
 *
 * @example
 * const recommendation = await generatePriceRecommendation('PROD-123', {
 *   seasonality: 'high',
 *   competitorActivity: 'aggressive',
 *   inventoryLevel: 'low'
 * });
 */
export declare function generatePriceRecommendation(productId: string, features?: Record<string, unknown>): Promise<PriceRecommendation>;
/**
 * Batch generate price recommendations for multiple products
 *
 * @param productIds - Array of product identifiers
 * @param objective - Optimization objective
 * @returns Array of price recommendations
 *
 * @example
 * const recommendations = await batchGeneratePriceRecommendations(['PROD-1', 'PROD-2'], OptimizationObjective.MAXIMIZE_PROFIT);
 */
export declare function batchGeneratePriceRecommendations(productIds: string[], objective?: OptimizationObjective): Promise<PriceRecommendation[]>;
/**
 * @module dynamic-pricing-engine-kit
 * @description Enterprise-grade dynamic pricing engine with 45 comprehensive functions
 *
 * OpenAPI/Swagger Integration:
 * All DTOs are decorated with @ApiProperty for automatic Swagger documentation generation.
 * Rate limiting should be implemented at the controller level using @Throttle decorator.
 * Caching should use @CacheKey and @CacheTTL decorators on controller methods.
 *
 * REST API Design Pattern:
 * - POST /api/v1/pricing/calculate - Calculate real-time price
 * - POST /api/v1/pricing/optimize - Optimize price for objective
 * - GET /api/v1/pricing/elasticity/:productId - Get price elasticity
 * - POST /api/v1/pricing/ab-test - Create A/B pricing test
 * - GET /api/v1/pricing/ab-test/:testId/results - Analyze A/B test results
 * - POST /api/v1/pricing/recommendation - Generate price recommendation
 * - POST /api/v1/pricing/flash-sale - Create flash sale
 * - POST /api/v1/pricing/clearance - Calculate clearance price
 * - GET /api/v1/pricing/history/:productId - Get price history
 * - POST /api/v1/pricing/margin/enforce - Enforce margin policy
 */
//# sourceMappingURL=dynamic-pricing-engine-kit.d.ts.map