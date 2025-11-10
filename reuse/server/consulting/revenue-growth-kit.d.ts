/**
 * LOC: CONS-REV-GRO-001
 * File: /reuse/server/consulting/revenue-growth-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *   - @nestjs/swagger (ApiProperty, ApiResponse)
 *   - class-validator (decorators)
 *   - class-transformer (Type, Transform)
 *
 * DOWNSTREAM (imported by):
 *   - backend/consulting/revenue-strategy.service.ts
 *   - backend/consulting/growth-analytics.controller.ts
 *   - backend/consulting/pricing-optimization.service.ts
 */
/**
 * File: /reuse/server/consulting/revenue-growth-kit.ts
 * Locator: WC-CONS-REVGRO-001
 * Purpose: Enterprise-grade Revenue Growth Kit - growth strategy, market expansion, pricing optimization, customer lifetime value
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, class-validator 0.14.x, class-transformer 0.5.x
 * Downstream: Consulting services, growth strategy controllers, revenue optimization processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 42 production-ready functions for revenue growth strategy competing with McKinsey, BCG, Bain consulting tools
 *
 * LLM Context: Comprehensive revenue growth utilities for production-ready management consulting applications.
 * Provides growth strategy frameworks, market expansion analysis, cross-sell/upsell scoring, revenue optimization,
 * pricing elasticity analysis, customer lifetime value modeling, sales funnel optimization, revenue forecasting,
 * penetration strategies, product-market fit analysis, and revenue stream diversification.
 */
import { Model, Sequelize, Transaction } from 'sequelize';
/**
 * Growth strategy types
 */
export declare enum GrowthStrategyType {
    MARKET_PENETRATION = "market_penetration",
    MARKET_DEVELOPMENT = "market_development",
    PRODUCT_DEVELOPMENT = "product_development",
    DIVERSIFICATION = "diversification",
    HORIZONTAL_INTEGRATION = "horizontal_integration",
    VERTICAL_INTEGRATION = "vertical_integration",
    ACQUISITION = "acquisition",
    PARTNERSHIP = "partnership"
}
/**
 * Market expansion approaches
 */
export declare enum ExpansionApproach {
    GEOGRAPHIC = "geographic",
    DEMOGRAPHIC = "demographic",
    VERTICAL = "vertical",
    HORIZONTAL = "horizontal",
    CHANNEL = "channel",
    PRODUCT_LINE = "product_line"
}
/**
 * Pricing strategy types
 */
export declare enum PricingStrategy {
    COST_PLUS = "cost_plus",
    VALUE_BASED = "value_based",
    COMPETITIVE = "competitive",
    PENETRATION = "penetration",
    SKIMMING = "skimming",
    FREEMIUM = "freemium",
    TIERED = "tiered",
    DYNAMIC = "dynamic",
    BUNDLE = "bundle"
}
/**
 * Customer segment types
 */
export declare enum CustomerSegment {
    ENTERPRISE = "enterprise",
    MID_MARKET = "mid_market",
    SMB = "smb",
    CONSUMER = "consumer",
    GOVERNMENT = "government",
    EDUCATION = "education",
    NONPROFIT = "nonprofit"
}
/**
 * Revenue stream types
 */
export declare enum RevenueStreamType {
    SUBSCRIPTION = "subscription",
    TRANSACTION = "transaction",
    LICENSE = "license",
    SERVICE = "service",
    ADVERTISING = "advertising",
    COMMISSION = "commission",
    ROYALTY = "royalty",
    RENTAL = "rental"
}
/**
 * Sales funnel stages
 */
export declare enum FunnelStage {
    AWARENESS = "awareness",
    INTEREST = "interest",
    CONSIDERATION = "consideration",
    INTENT = "intent",
    EVALUATION = "evaluation",
    PURCHASE = "purchase",
    RETENTION = "retention",
    ADVOCACY = "advocacy"
}
/**
 * Product lifecycle stages
 */
export declare enum ProductLifecycle {
    INTRODUCTION = "introduction",
    GROWTH = "growth",
    MATURITY = "maturity",
    DECLINE = "decline",
    SUNSET = "sunset"
}
/**
 * Market position types
 */
export declare enum MarketPosition {
    LEADER = "leader",
    CHALLENGER = "challenger",
    FOLLOWER = "follower",
    NICHER = "nicher"
}
/**
 * Cross-sell opportunity types
 */
export declare enum CrossSellType {
    COMPLEMENTARY_PRODUCT = "complementary_product",
    UPGRADE = "upgrade",
    ADD_ON = "add_on",
    BUNDLE = "bundle",
    PREMIUM_TIER = "premium_tier"
}
interface GrowthStrategyData {
    strategyId: string;
    organizationId: string;
    strategyType: GrowthStrategyType;
    name: string;
    description: string;
    targetMarkets: string[];
    targetSegments: CustomerSegment[];
    revenueGoal: number;
    timeframeMonths: number;
    investmentRequired: number;
    expectedROI: number;
    riskLevel: 'low' | 'medium' | 'high';
    keyInitiatives: string[];
    successMetrics: Record<string, number>;
    status: 'planning' | 'active' | 'paused' | 'completed';
    metadata?: Record<string, any>;
}
interface MarketExpansionAnalysis {
    analysisId: string;
    organizationId: string;
    targetMarket: string;
    approach: ExpansionApproach;
    marketSize: number;
    addressableMarket: number;
    penetrationRate: number;
    competitiveIntensity: number;
    entryBarriers: string[];
    requiredCapabilities: string[];
    estimatedRevenue: number;
    timeToBreakeven: number;
    riskFactors: string[];
    recommendations: string[];
}
interface PricingOptimizationData {
    optimizationId: string;
    productId: string;
    currentPrice: number;
    optimalPrice: number;
    priceElasticity: number;
    demandCurve: Record<number, number>;
    competitorPrices: Record<string, number>;
    costStructure: {
        variable: number;
        fixed: number;
        margin: number;
    };
    strategy: PricingStrategy;
    revenueImpact: number;
    volumeImpact: number;
    profitImpact: number;
    confidence: number;
}
interface CustomerLifetimeValue {
    customerId: string;
    segment: CustomerSegment;
    acquisitionCost: number;
    averageOrderValue: number;
    purchaseFrequency: number;
    customerLifespan: number;
    retentionRate: number;
    churnRate: number;
    grossMargin: number;
    discountRate: number;
    clv: number;
    clvCacRatio: number;
    profitability: 'high' | 'medium' | 'low' | 'negative';
    recommendations: string[];
}
interface CrossSellOpportunity {
    opportunityId: string;
    customerId: string;
    currentProducts: string[];
    recommendedProduct: string;
    type: CrossSellType;
    propensityScore: number;
    expectedRevenue: number;
    confidence: number;
    reasoning: string[];
    nextBestAction: string;
    timing: string;
    channel: string;
}
interface SalesFunnelMetrics {
    funnelId: string;
    productId: string;
    segment: CustomerSegment;
    period: string;
    stageMetrics: Record<FunnelStage, {
        volume: number;
        conversionRate: number;
        averageTime: number;
        dropoffRate: number;
    }>;
    overallConversion: number;
    averageDealSize: number;
    salesVelocity: number;
    bottlenecks: string[];
    optimizationOpportunities: string[];
}
interface RevenueForecast {
    forecastId: string;
    organizationId: string;
    period: string;
    baselineRevenue: number;
    forecastedRevenue: number;
    growthRate: number;
    confidence: number;
    revenueStreams: Record<RevenueStreamType, number>;
    seasonalFactors: Record<string, number>;
    marketFactors: Record<string, number>;
    assumptions: string[];
    riskAdjustment: number;
    upside: number;
    downside: number;
}
interface ProductMarketFit {
    productId: string;
    marketSegment: string;
    fitScore: number;
    adoptionRate: number;
    retentionRate: number;
    nps: number;
    productUsage: number;
    customerSatisfaction: number;
    paybackPeriod: number;
    viralCoefficient: number;
    gaps: string[];
    strengths: string[];
    recommendations: string[];
}
interface RevenueStreamAnalysis {
    streamId: string;
    type: RevenueStreamType;
    currentRevenue: number;
    revenueShare: number;
    growthRate: number;
    profitability: number;
    volatility: number;
    customerCount: number;
    churnRate: number;
    lifecycle: ProductLifecycle;
    strategicValue: 'core' | 'growth' | 'emerging' | 'sunset';
    investmentPriority: 'high' | 'medium' | 'low';
}
interface PenetrationStrategy {
    strategyId: string;
    targetMarket: string;
    currentPenetration: number;
    targetPenetration: number;
    timeframe: number;
    tactics: string[];
    investmentRequired: number;
    expectedRevenue: number;
    competitiveResponse: string;
    riskMitigation: string[];
    successFactors: string[];
}
interface PriceElasticityAnalysis {
    productId: string;
    priceElasticity: number;
    elasticityType: 'elastic' | 'inelastic' | 'unit_elastic';
    optimalPricePoint: number;
    revenueMaximizingPrice: number;
    profitMaximizingPrice: number;
    volumeSensitivity: number;
    competitorImpact: number;
    seasonalVariation: Record<string, number>;
    recommendations: string[];
}
interface UpsellScoringData {
    customerId: string;
    currentTier: string;
    targetTier: string;
    upsellScore: number;
    usagePatterns: Record<string, number>;
    featureAdoption: number;
    engagementScore: number;
    healthScore: number;
    revenueIncrement: number;
    successProbability: number;
    recommendedApproach: string;
    timing: string;
}
interface MarketShareAnalysis {
    organizationId: string;
    market: string;
    currentShare: number;
    targetShare: number;
    position: MarketPosition;
    competitors: Array<{
        name: string;
        share: number;
        strengths: string[];
    }>;
    shareGainStrategies: string[];
    investmentRequired: number;
    timeframe: number;
    feasibility: number;
}
interface CustomerAcquisitionMetrics {
    segment: CustomerSegment;
    channel: string;
    cac: number;
    conversionRate: number;
    timeToConvert: number;
    firstOrderValue: number;
    paybackPeriod: number;
    efficiency: number;
    scalability: 'high' | 'medium' | 'low';
    recommendations: string[];
}
interface RevenueOptimizationPlan {
    planId: string;
    organizationId: string;
    currentRevenue: number;
    targetRevenue: number;
    timeframe: number;
    levers: Array<{
        lever: string;
        impact: number;
        effort: 'low' | 'medium' | 'high';
        priority: number;
    }>;
    quickWins: string[];
    strategicInitiatives: string[];
    investmentRequired: number;
    expectedROI: number;
}
interface BundleOptimization {
    bundleId: string;
    products: string[];
    bundlePrice: number;
    individualSum: number;
    discountRate: number;
    takeRate: number;
    revenueImpact: number;
    marginImpact: number;
    cannibalizationRisk: number;
    recommendations: string[];
}
interface ChurnPrediction {
    customerId: string;
    churnProbability: number;
    riskFactors: string[];
    revenueAtRisk: number;
    retentionCost: number;
    lifetimeValue: number;
    retentionROI: number;
    interventionRecommendations: string[];
    timing: string;
}
interface PriceSensitivityAnalysis {
    segment: CustomerSegment;
    productId: string;
    priceSensitivity: number;
    willingnessToPayDistribution: Record<number, number>;
    valuePerception: number;
    competitiveAlternatives: Array<{
        competitor: string;
        price: number;
        share: number;
    }>;
    optimalPriceRange: {
        min: number;
        max: number;
        recommended: number;
    };
}
interface RevenueLeakageAnalysis {
    leakageId: string;
    source: string;
    annualImpact: number;
    category: 'pricing' | 'discounting' | 'process' | 'compliance' | 'billing';
    rootCauses: string[];
    fixCost: number;
    recoverablePortion: number;
    priority: 'critical' | 'high' | 'medium' | 'low';
    recommendations: string[];
}
/**
 * Create Growth Strategy DTO
 */
export declare class CreateGrowthStrategyDto {
    organizationId: string;
    strategyType: GrowthStrategyType;
    name: string;
    description: string;
    targetMarkets: string[];
    targetSegments: CustomerSegment[];
    revenueGoal: number;
    timeframeMonths: number;
    investmentRequired: number;
    expectedROI: number;
    riskLevel: 'low' | 'medium' | 'high';
    keyInitiatives: string[];
}
/**
 * Market Expansion Analysis DTO
 */
export declare class MarketExpansionAnalysisDto {
    organizationId: string;
    targetMarket: string;
    approach: ExpansionApproach;
    marketSize: number;
    addressableMarket: number;
    penetrationRate: number;
}
/**
 * Pricing Optimization DTO
 */
export declare class PricingOptimizationDto {
    productId: string;
    currentPrice: number;
    priceElasticity: number;
    strategy: PricingStrategy;
    variableCost: number;
    fixedCosts: number;
}
/**
 * Customer Lifetime Value DTO
 */
export declare class CustomerLifetimeValueDto {
    customerId: string;
    segment: CustomerSegment;
    acquisitionCost: number;
    averageOrderValue: number;
    purchaseFrequency: number;
    customerLifespan: number;
    retentionRate: number;
    grossMargin: number;
    discountRate: number;
}
/**
 * Cross-Sell Opportunity DTO
 */
export declare class CrossSellOpportunityDto {
    customerId: string;
    currentProducts: string[];
    recommendedProduct: string;
    type: CrossSellType;
    expectedRevenue: number;
}
/**
 * Sales Funnel Metrics DTO
 */
export declare class SalesFunnelMetricsDto {
    productId: string;
    segment: CustomerSegment;
    period: string;
    averageDealSize: number;
}
/**
 * Revenue Forecast DTO
 */
export declare class RevenueForecastDto {
    organizationId: string;
    period: string;
    baselineRevenue: number;
    growthRate: number;
    confidence: number;
}
/**
 * Product-Market Fit DTO
 */
export declare class ProductMarketFitDto {
    productId: string;
    marketSegment: string;
    adoptionRate: number;
    retentionRate: number;
    nps: number;
    productUsage: number;
}
/**
 * Revenue Stream Analysis DTO
 */
export declare class RevenueStreamAnalysisDto {
    type: RevenueStreamType;
    currentRevenue: number;
    growthRate: number;
    profitability: number;
    customerCount: number;
    lifecycle: ProductLifecycle;
}
/**
 * Penetration Strategy DTO
 */
export declare class PenetrationStrategyDto {
    targetMarket: string;
    currentPenetration: number;
    targetPenetration: number;
    timeframe: number;
    investmentRequired: number;
    expectedRevenue: number;
}
/**
 * Upsell Scoring DTO
 */
export declare class UpsellScoringDto {
    customerId: string;
    currentTier: string;
    targetTier: string;
    featureAdoption: number;
    engagementScore: number;
    healthScore: number;
    revenueIncrement: number;
}
/**
 * Churn Prediction DTO
 */
export declare class ChurnPredictionDto {
    customerId: string;
    churnProbability: number;
    revenueAtRisk: number;
    retentionCost: number;
    lifetimeValue: number;
}
/**
 * Growth Strategy Sequelize Model
 */
export declare class GrowthStrategy extends Model {
    strategyId: string;
    organizationId: string;
    strategyType: GrowthStrategyType;
    name: string;
    description: string;
    targetMarkets: string[];
    targetSegments: CustomerSegment[];
    revenueGoal: number;
    timeframeMonths: number;
    investmentRequired: number;
    expectedROI: number;
    riskLevel: string;
    keyInitiatives: string[];
    successMetrics: Record<string, number>;
    status: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare function initGrowthStrategyModel(sequelize: Sequelize): typeof GrowthStrategy;
/**
 * Revenue Forecast Sequelize Model
 */
export declare class RevenueForecastModel extends Model {
    forecastId: string;
    organizationId: string;
    period: string;
    baselineRevenue: number;
    forecastedRevenue: number;
    growthRate: number;
    confidence: number;
    revenueStreams: Record<string, number>;
    seasonalFactors: Record<string, number>;
    marketFactors: Record<string, number>;
    assumptions: string[];
    riskAdjustment: number;
    upside: number;
    downside: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare function initRevenueForecastModel(sequelize: Sequelize): typeof RevenueForecastModel;
/**
 * Customer Lifetime Value Sequelize Model
 */
export declare class CustomerLTVModel extends Model {
    customerId: string;
    segment: CustomerSegment;
    acquisitionCost: number;
    averageOrderValue: number;
    purchaseFrequency: number;
    customerLifespan: number;
    retentionRate: number;
    churnRate: number;
    grossMargin: number;
    discountRate: number;
    clv: number;
    clvCacRatio: number;
    profitability: string;
    recommendations: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare function initCustomerLTVModel(sequelize: Sequelize): typeof CustomerLTVModel;
/**
 * Creates a comprehensive growth strategy.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/strategy:
 *   post:
 *     tags:
 *       - Revenue Growth
 *     summary: Create growth strategy
 *     description: Develops a comprehensive growth strategy with revenue goals, initiatives, and ROI projections
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGrowthStrategyDto'
 *     responses:
 *       201:
 *         description: Growth strategy created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 strategyId:
 *                   type: string
 *                 strategyType:
 *                   type: string
 *                 revenueGoal:
 *                   type: number
 *                 expectedROI:
 *                   type: number
 *
 * @param {Partial<GrowthStrategyData>} data - Growth strategy data
 * @param {Transaction} transaction - Optional database transaction
 * @returns {Promise<GrowthStrategyData>} Created growth strategy
 *
 * @example
 * ```typescript
 * const strategy = await createGrowthStrategy({
 *   organizationId: 'org-123',
 *   strategyType: GrowthStrategyType.MARKET_PENETRATION,
 *   name: 'Enterprise Expansion 2024',
 *   revenueGoal: 5000000,
 *   timeframeMonths: 12
 * });
 * console.log(`Strategy ${strategy.strategyId} created with ${strategy.expectedROI}x ROI`);
 * ```
 */
export declare function createGrowthStrategy(data: Partial<GrowthStrategyData>, transaction?: Transaction): Promise<GrowthStrategyData>;
/**
 * Analyzes market expansion opportunities.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/market-expansion:
 *   post:
 *     tags:
 *       - Revenue Growth
 *     summary: Analyze market expansion
 *     description: Evaluates market expansion opportunities with TAM/SAM analysis, competitive intensity, and entry barriers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarketExpansionAnalysisDto'
 *     responses:
 *       200:
 *         description: Market expansion analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 targetMarket:
 *                   type: string
 *                 marketSize:
 *                   type: number
 *                 estimatedRevenue:
 *                   type: number
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: string
 *
 * @param {Partial<MarketExpansionAnalysis>} data - Market expansion data
 * @returns {Promise<MarketExpansionAnalysis>} Market expansion analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeMarketExpansion({
 *   organizationId: 'org-123',
 *   targetMarket: 'European Healthcare',
 *   marketSize: 10000000000,
 *   addressableMarket: 1000000000,
 *   penetrationRate: 0.05
 * });
 * console.log(`Market opportunity: $${analysis.estimatedRevenue}`);
 * ```
 */
export declare function analyzeMarketExpansion(data: Partial<MarketExpansionAnalysis>): Promise<MarketExpansionAnalysis>;
/**
 * Optimizes product pricing based on elasticity and market conditions.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/pricing-optimization:
 *   post:
 *     tags:
 *       - Revenue Growth
 *     summary: Optimize pricing
 *     description: Calculates optimal price point based on price elasticity, cost structure, and competitive positioning
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PricingOptimizationDto'
 *     responses:
 *       200:
 *         description: Pricing optimization results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPrice:
 *                   type: number
 *                 optimalPrice:
 *                   type: number
 *                 revenueImpact:
 *                   type: number
 *                 profitImpact:
 *                   type: number
 *
 * @param {Partial<PricingOptimizationData>} data - Pricing optimization data
 * @returns {Promise<PricingOptimizationData>} Pricing optimization results
 *
 * @example
 * ```typescript
 * const optimization = await optimizeProductPricing({
 *   productId: 'prod-123',
 *   currentPrice: 99.99,
 *   priceElasticity: -1.5,
 *   variableCost: 25.50,
 *   fixedCosts: 100000
 * });
 * console.log(`Optimal price: $${optimization.optimalPrice} (${optimization.revenueImpact}% revenue impact)`);
 * ```
 */
export declare function optimizeProductPricing(data: Partial<PricingOptimizationData>): Promise<PricingOptimizationData>;
/**
 * Calculates customer lifetime value with profitability classification.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/customer-ltv/{customerId}:
 *   get:
 *     tags:
 *       - Revenue Growth
 *     summary: Calculate customer LTV
 *     description: Computes customer lifetime value with CAC ratio and profitability analysis
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer lifetime value metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customerId:
 *                   type: string
 *                 clv:
 *                   type: number
 *                 clvCacRatio:
 *                   type: number
 *                 profitability:
 *                   type: string
 *
 * @param {Partial<CustomerLifetimeValue>} data - Customer LTV data
 * @returns {Promise<CustomerLifetimeValue>} Customer lifetime value analysis
 *
 * @example
 * ```typescript
 * const ltv = await calculateCustomerLTV({
 *   customerId: 'cust-123',
 *   acquisitionCost: 5000,
 *   averageOrderValue: 1000,
 *   purchaseFrequency: 12,
 *   customerLifespan: 5,
 *   retentionRate: 0.85,
 *   grossMargin: 0.6
 * });
 * console.log(`LTV: $${ltv.clv}, CAC Ratio: ${ltv.clvCacRatio}`);
 * ```
 */
export declare function calculateCustomerLTV(data: Partial<CustomerLifetimeValue>): Promise<CustomerLifetimeValue>;
/**
 * Identifies cross-sell opportunities with propensity scoring.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/cross-sell/{customerId}:
 *   get:
 *     tags:
 *       - Revenue Growth
 *     summary: Identify cross-sell opportunities
 *     description: Analyzes customer purchase patterns to identify high-propensity cross-sell opportunities
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cross-sell opportunities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   recommendedProduct:
 *                     type: string
 *                   propensityScore:
 *                     type: number
 *                   expectedRevenue:
 *                     type: number
 *
 * @param {Partial<CrossSellOpportunity>} data - Cross-sell analysis data
 * @returns {Promise<CrossSellOpportunity>} Cross-sell opportunity
 *
 * @example
 * ```typescript
 * const opportunity = await identifyCrossSellOpportunities({
 *   customerId: 'cust-123',
 *   currentProducts: ['prod-1', 'prod-2'],
 *   recommendedProduct: 'prod-3',
 *   type: CrossSellType.COMPLEMENTARY_PRODUCT
 * });
 * console.log(`Cross-sell score: ${opportunity.propensityScore}, Revenue: $${opportunity.expectedRevenue}`);
 * ```
 */
export declare function identifyCrossSellOpportunities(data: Partial<CrossSellOpportunity>): Promise<CrossSellOpportunity>;
/**
 * Analyzes sales funnel performance and identifies bottlenecks.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/sales-funnel:
 *   post:
 *     tags:
 *       - Revenue Growth
 *     summary: Analyze sales funnel
 *     description: Evaluates sales funnel metrics, conversion rates, and identifies optimization opportunities
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalesFunnelMetricsDto'
 *     responses:
 *       200:
 *         description: Sales funnel analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overallConversion:
 *                   type: number
 *                 salesVelocity:
 *                   type: number
 *                 bottlenecks:
 *                   type: array
 *                   items:
 *                     type: string
 *
 * @param {Partial<SalesFunnelMetrics>} data - Sales funnel data
 * @returns {Promise<SalesFunnelMetrics>} Sales funnel analysis
 *
 * @example
 * ```typescript
 * const funnel = await analyzeSalesFunnel({
 *   productId: 'prod-123',
 *   segment: CustomerSegment.ENTERPRISE,
 *   period: '2024-Q1',
 *   averageDealSize: 50000
 * });
 * console.log(`Conversion rate: ${funnel.overallConversion}%, Velocity: ${funnel.salesVelocity} days`);
 * ```
 */
export declare function analyzeSalesFunnel(data: Partial<SalesFunnelMetrics>): Promise<SalesFunnelMetrics>;
/**
 * Generates revenue forecast with confidence intervals.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/forecast:
 *   post:
 *     tags:
 *       - Revenue Growth
 *     summary: Generate revenue forecast
 *     description: Creates revenue forecast with trend analysis, seasonal adjustments, and risk scenarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RevenueForecastDto'
 *     responses:
 *       200:
 *         description: Revenue forecast
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 forecastedRevenue:
 *                   type: number
 *                 confidence:
 *                   type: number
 *                 upside:
 *                   type: number
 *                 downside:
 *                   type: number
 *
 * @param {Partial<RevenueForecast>} data - Revenue forecast data
 * @returns {Promise<RevenueForecast>} Revenue forecast
 *
 * @example
 * ```typescript
 * const forecast = await generateRevenueForecast({
 *   organizationId: 'org-123',
 *   period: '2024-Q2',
 *   baselineRevenue: 10000000,
 *   growthRate: 0.15,
 *   confidence: 0.85
 * });
 * console.log(`Forecast: $${forecast.forecastedRevenue} (${forecast.confidence * 100}% confidence)`);
 * ```
 */
export declare function generateRevenueForecast(data: Partial<RevenueForecast>): Promise<RevenueForecast>;
/**
 * Assesses product-market fit with adoption and retention metrics.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/product-market-fit/{productId}:
 *   get:
 *     tags:
 *       - Revenue Growth
 *     summary: Assess product-market fit
 *     description: Evaluates product-market fit through adoption, retention, NPS, and usage metrics
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product-market fit assessment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fitScore:
 *                   type: number
 *                 nps:
 *                   type: number
 *                 retentionRate:
 *                   type: number
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: string
 *
 * @param {Partial<ProductMarketFit>} data - Product-market fit data
 * @returns {Promise<ProductMarketFit>} Product-market fit assessment
 *
 * @example
 * ```typescript
 * const fit = await assessProductMarketFit({
 *   productId: 'prod-123',
 *   marketSegment: 'Enterprise Healthcare',
 *   adoptionRate: 0.35,
 *   retentionRate: 0.92,
 *   nps: 65
 * });
 * console.log(`Product-market fit score: ${fit.fitScore} (NPS: ${fit.nps})`);
 * ```
 */
export declare function assessProductMarketFit(data: Partial<ProductMarketFit>): Promise<ProductMarketFit>;
/**
 * Analyzes revenue stream performance and strategic value.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/revenue-stream-analysis:
 *   post:
 *     tags:
 *       - Revenue Growth
 *     summary: Analyze revenue streams
 *     description: Evaluates revenue stream performance, profitability, and strategic value
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RevenueStreamAnalysisDto'
 *     responses:
 *       200:
 *         description: Revenue stream analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                 profitability:
 *                   type: number
 *                 strategicValue:
 *                   type: string
 *                 investmentPriority:
 *                   type: string
 *
 * @param {Partial<RevenueStreamAnalysis>} data - Revenue stream data
 * @returns {Promise<RevenueStreamAnalysis>} Revenue stream analysis
 *
 * @example
 * ```typescript
 * const stream = await analyzeRevenueStream({
 *   type: RevenueStreamType.SUBSCRIPTION,
 *   currentRevenue: 5000000,
 *   growthRate: 0.25,
 *   profitability: 0.45,
 *   customerCount: 500
 * });
 * console.log(`Stream value: ${stream.strategicValue}, Priority: ${stream.investmentPriority}`);
 * ```
 */
export declare function analyzeRevenueStream(data: Partial<RevenueStreamAnalysis>): Promise<RevenueStreamAnalysis>;
/**
 * Develops market penetration strategy.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/penetration-strategy:
 *   post:
 *     tags:
 *       - Revenue Growth
 *     summary: Develop penetration strategy
 *     description: Creates market penetration strategy with tactics, investment requirements, and ROI projections
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PenetrationStrategyDto'
 *     responses:
 *       200:
 *         description: Penetration strategy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 targetPenetration:
 *                   type: number
 *                 expectedRevenue:
 *                   type: number
 *                 tactics:
 *                   type: array
 *                   items:
 *                     type: string
 *
 * @param {Partial<PenetrationStrategy>} data - Penetration strategy data
 * @returns {Promise<PenetrationStrategy>} Penetration strategy
 *
 * @example
 * ```typescript
 * const strategy = await developPenetrationStrategy({
 *   targetMarket: 'US Mid-Market Healthcare',
 *   currentPenetration: 0.08,
 *   targetPenetration: 0.25,
 *   timeframe: 18,
 *   investmentRequired: 750000
 * });
 * console.log(`Target penetration: ${strategy.targetPenetration * 100}%`);
 * ```
 */
export declare function developPenetrationStrategy(data: Partial<PenetrationStrategy>): Promise<PenetrationStrategy>;
/**
 * Analyzes price elasticity and optimal pricing.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/price-elasticity/{productId}:
 *   get:
 *     tags:
 *       - Revenue Growth
 *     summary: Analyze price elasticity
 *     description: Calculates price elasticity and identifies revenue/profit maximizing price points
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Price elasticity analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 priceElasticity:
 *                   type: number
 *                 elasticityType:
 *                   type: string
 *                 optimalPricePoint:
 *                   type: number
 *
 * @param {string} productId - Product identifier
 * @param {number} currentPrice - Current product price
 * @param {number} elasticity - Price elasticity coefficient
 * @returns {Promise<PriceElasticityAnalysis>} Price elasticity analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzePriceElasticity('prod-123', 99.99, -1.5);
 * console.log(`Elasticity: ${analysis.priceElasticity}, Optimal: $${analysis.optimalPricePoint}`);
 * ```
 */
export declare function analyzePriceElasticity(productId: string, currentPrice: number, elasticity: number): Promise<PriceElasticityAnalysis>;
/**
 * Scores customers for upsell opportunities.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/upsell-scoring:
 *   post:
 *     tags:
 *       - Revenue Growth
 *     summary: Score upsell opportunities
 *     description: Analyzes customer usage and engagement to score upsell readiness
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpsellScoringDto'
 *     responses:
 *       200:
 *         description: Upsell scoring results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 upsellScore:
 *                   type: number
 *                 successProbability:
 *                   type: number
 *                 recommendedApproach:
 *                   type: string
 *
 * @param {Partial<UpsellScoringData>} data - Upsell scoring data
 * @returns {Promise<UpsellScoringData>} Upsell scoring results
 *
 * @example
 * ```typescript
 * const upsell = await scoreUpsellOpportunity({
 *   customerId: 'cust-123',
 *   currentTier: 'Professional',
 *   targetTier: 'Enterprise',
 *   featureAdoption: 0.75,
 *   engagementScore: 85,
 *   healthScore: 92
 * });
 * console.log(`Upsell score: ${upsell.upsellScore}, Probability: ${upsell.successProbability}`);
 * ```
 */
export declare function scoreUpsellOpportunity(data: Partial<UpsellScoringData>): Promise<UpsellScoringData>;
/**
 * Analyzes market share and competitive positioning.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/market-share:
 *   post:
 *     tags:
 *       - Revenue Growth
 *     summary: Analyze market share
 *     description: Evaluates current market share, competitive position, and share gain strategies
 *     responses:
 *       200:
 *         description: Market share analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentShare:
 *                   type: number
 *                 position:
 *                   type: string
 *                 shareGainStrategies:
 *                   type: array
 *                   items:
 *                     type: string
 *
 * @param {Partial<MarketShareAnalysis>} data - Market share data
 * @returns {Promise<MarketShareAnalysis>} Market share analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeMarketShare({
 *   organizationId: 'org-123',
 *   market: 'US Healthcare IT',
 *   currentShare: 0.12,
 *   targetShare: 0.20
 * });
 * console.log(`Market position: ${analysis.position}, Target: ${analysis.targetShare * 100}%`);
 * ```
 */
export declare function analyzeMarketShare(data: Partial<MarketShareAnalysis>): Promise<MarketShareAnalysis>;
/**
 * Analyzes customer acquisition metrics by channel.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/cac-metrics:
 *   get:
 *     tags:
 *       - Revenue Growth
 *     summary: Analyze CAC metrics
 *     description: Evaluates customer acquisition cost, efficiency, and channel performance
 *     responses:
 *       200:
 *         description: CAC metrics analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cac:
 *                   type: number
 *                 conversionRate:
 *                   type: number
 *                 paybackPeriod:
 *                   type: number
 *                 scalability:
 *                   type: string
 *
 * @param {CustomerSegment} segment - Customer segment
 * @param {string} channel - Acquisition channel
 * @param {number} cac - Customer acquisition cost
 * @returns {Promise<CustomerAcquisitionMetrics>} CAC metrics
 *
 * @example
 * ```typescript
 * const metrics = await analyzeCustomerAcquisition(
 *   CustomerSegment.ENTERPRISE,
 *   'Direct Sales',
 *   5000
 * );
 * console.log(`CAC: $${metrics.cac}, Payback: ${metrics.paybackPeriod} months`);
 * ```
 */
export declare function analyzeCustomerAcquisition(segment: CustomerSegment, channel: string, cac: number): Promise<CustomerAcquisitionMetrics>;
/**
 * Develops comprehensive revenue optimization plan.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/optimization-plan:
 *   post:
 *     tags:
 *       - Revenue Growth
 *     summary: Develop revenue optimization plan
 *     description: Creates comprehensive revenue optimization plan with prioritized levers and initiatives
 *     responses:
 *       200:
 *         description: Revenue optimization plan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 targetRevenue:
 *                   type: number
 *                 levers:
 *                   type: array
 *                 expectedROI:
 *                   type: number
 *
 * @param {Partial<RevenueOptimizationPlan>} data - Optimization plan data
 * @returns {Promise<RevenueOptimizationPlan>} Revenue optimization plan
 *
 * @example
 * ```typescript
 * const plan = await developRevenueOptimizationPlan({
 *   organizationId: 'org-123',
 *   currentRevenue: 10000000,
 *   targetRevenue: 15000000,
 *   timeframe: 12
 * });
 * console.log(`Revenue gap: $${plan.targetRevenue - plan.currentRevenue}, ROI: ${plan.expectedROI}x`);
 * ```
 */
export declare function developRevenueOptimizationPlan(data: Partial<RevenueOptimizationPlan>): Promise<RevenueOptimizationPlan>;
/**
 * Optimizes product bundling strategy.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/bundle-optimization:
 *   post:
 *     tags:
 *       - Revenue Growth
 *     summary: Optimize product bundles
 *     description: Analyzes bundle composition, pricing, and revenue impact
 *     responses:
 *       200:
 *         description: Bundle optimization results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bundlePrice:
 *                   type: number
 *                 discountRate:
 *                   type: number
 *                 revenueImpact:
 *                   type: number
 *
 * @param {Partial<BundleOptimization>} data - Bundle optimization data
 * @returns {Promise<BundleOptimization>} Bundle optimization results
 *
 * @example
 * ```typescript
 * const bundle = await optimizeProductBundle({
 *   products: ['prod-1', 'prod-2', 'prod-3'],
 *   bundlePrice: 199,
 *   individualSum: 250
 * });
 * console.log(`Bundle discount: ${bundle.discountRate * 100}%, Revenue impact: $${bundle.revenueImpact}`);
 * ```
 */
export declare function optimizeProductBundle(data: Partial<BundleOptimization>): Promise<BundleOptimization>;
/**
 * Predicts customer churn with intervention recommendations.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/churn-prediction/{customerId}:
 *   get:
 *     tags:
 *       - Revenue Growth
 *     summary: Predict customer churn
 *     description: Predicts churn probability and recommends retention interventions
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Churn prediction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 churnProbability:
 *                   type: number
 *                 revenueAtRisk:
 *                   type: number
 *                 retentionROI:
 *                   type: number
 *
 * @param {Partial<ChurnPrediction>} data - Churn prediction data
 * @returns {Promise<ChurnPrediction>} Churn prediction
 *
 * @example
 * ```typescript
 * const churn = await predictCustomerChurn({
 *   customerId: 'cust-123',
 *   churnProbability: 0.35,
 *   revenueAtRisk: 50000,
 *   retentionCost: 5000
 * });
 * console.log(`Churn risk: ${churn.churnProbability * 100}%, ROI: ${churn.retentionROI}x`);
 * ```
 */
export declare function predictCustomerChurn(data: Partial<ChurnPrediction>): Promise<ChurnPrediction>;
/**
 * Analyzes price sensitivity across customer segments.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/price-sensitivity:
 *   post:
 *     tags:
 *       - Revenue Growth
 *     summary: Analyze price sensitivity
 *     description: Evaluates price sensitivity and willingness to pay across segments
 *     responses:
 *       200:
 *         description: Price sensitivity analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 priceSensitivity:
 *                   type: number
 *                 optimalPriceRange:
 *                   type: object
 *
 * @param {Partial<PriceSensitivityAnalysis>} data - Price sensitivity data
 * @returns {Promise<PriceSensitivityAnalysis>} Price sensitivity analysis
 *
 * @example
 * ```typescript
 * const sensitivity = await analyzePriceSensitivity({
 *   segment: CustomerSegment.ENTERPRISE,
 *   productId: 'prod-123',
 *   priceSensitivity: 0.4
 * });
 * console.log(`Optimal price range: $${sensitivity.optimalPriceRange.min} - $${sensitivity.optimalPriceRange.max}`);
 * ```
 */
export declare function analyzePriceSensitivity(data: Partial<PriceSensitivityAnalysis>): Promise<PriceSensitivityAnalysis>;
/**
 * Identifies and quantifies revenue leakage sources.
 *
 * @swagger
 * @openapi
 * /api/revenue-growth/revenue-leakage:
 *   get:
 *     tags:
 *       - Revenue Growth
 *     summary: Analyze revenue leakage
 *     description: Identifies sources of revenue leakage and quantifies recovery opportunities
 *     responses:
 *       200:
 *         description: Revenue leakage analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   source:
 *                     type: string
 *                   annualImpact:
 *                     type: number
 *                   recoverablePortion:
 *                     type: number
 *                   priority:
 *                     type: string
 *
 * @param {string} organizationId - Organization identifier
 * @returns {Promise<RevenueLeakageAnalysis[]>} Revenue leakage analysis
 *
 * @example
 * ```typescript
 * const leakage = await analyzeRevenueLeakage('org-123');
 * const totalLeakage = leakage.reduce((sum, item) => sum + item.annualImpact, 0);
 * console.log(`Total revenue leakage: $${totalLeakage}`);
 * ```
 */
export declare function analyzeRevenueLeakage(organizationId: string): Promise<RevenueLeakageAnalysis[]>;
/**
 * Calculates revenue per customer segment.
 *
 * @param {CustomerSegment} segment - Customer segment
 * @param {number} customerCount - Number of customers
 * @param {number} averageRevenue - Average revenue per customer
 * @returns {number} Total segment revenue
 */
export declare function calculateSegmentRevenue(segment: CustomerSegment, customerCount: number, averageRevenue: number): number;
/**
 * Calculates revenue growth rate.
 *
 * @param {number} currentRevenue - Current period revenue
 * @param {number} previousRevenue - Previous period revenue
 * @returns {number} Growth rate as decimal
 */
export declare function calculateGrowthRate(currentRevenue: number, previousRevenue: number): number;
/**
 * Calculates compound annual growth rate (CAGR).
 *
 * @param {number} beginningValue - Beginning value
 * @param {number} endingValue - Ending value
 * @param {number} years - Number of years
 * @returns {number} CAGR as decimal
 */
export declare function calculateCAGR(beginningValue: number, endingValue: number, years: number): number;
/**
 * Calculates revenue run rate.
 *
 * @param {number} periodRevenue - Revenue for the period
 * @param {number} periodMonths - Number of months in period
 * @returns {number} Annualized run rate
 */
export declare function calculateRunRate(periodRevenue: number, periodMonths: number): number;
/**
 * Calculates average revenue per user (ARPU).
 *
 * @param {number} totalRevenue - Total revenue
 * @param {number} userCount - Number of users
 * @returns {number} ARPU
 */
export declare function calculateARPU(totalRevenue: number, userCount: number): number;
/**
 * Calculates revenue concentration risk.
 *
 * @param {Record<string, number>} customerRevenues - Revenue by customer
 * @returns {number} Concentration index (0-1, higher = more concentrated)
 */
export declare function calculateRevenueConcentration(customerRevenues: Record<string, number>): number;
/**
 * Calculates revenue per employee.
 *
 * @param {number} totalRevenue - Total revenue
 * @param {number} employeeCount - Number of employees
 * @returns {number} Revenue per employee
 */
export declare function calculateRevenuePerEmployee(totalRevenue: number, employeeCount: number): number;
/**
 * Calculates customer acquisition payback period.
 *
 * @param {number} cac - Customer acquisition cost
 * @param {number} monthlyRecurringRevenue - Monthly recurring revenue
 * @param {number} grossMargin - Gross margin as decimal
 * @returns {number} Payback period in months
 */
export declare function calculateCACPayback(cac: number, monthlyRecurringRevenue: number, grossMargin: number): number;
/**
 * Calculates net revenue retention (NRR).
 *
 * @param {number} startingARR - Starting annual recurring revenue
 * @param {number} expansion - Expansion revenue
 * @param {number} churn - Churned revenue
 * @returns {number} NRR as decimal
 */
export declare function calculateNetRevenueRetention(startingARR: number, expansion: number, churn: number): number;
/**
 * Calculates quick ratio for SaaS companies.
 *
 * @param {number} newMRR - New monthly recurring revenue
 * @param {number} expansionMRR - Expansion MRR
 * @param {number} churnedMRR - Churned MRR
 * @param {number} contractionMRR - Contraction MRR
 * @returns {number} Quick ratio
 */
export declare function calculateQuickRatio(newMRR: number, expansionMRR: number, churnedMRR: number, contractionMRR: number): number;
/**
 * Calculates revenue quality score.
 *
 * @param {number} recurringRevenue - Recurring revenue
 * @param {number} totalRevenue - Total revenue
 * @param {number} retentionRate - Customer retention rate
 * @param {number} grossMargin - Gross margin
 * @returns {number} Quality score (0-100)
 */
export declare function calculateRevenueQuality(recurringRevenue: number, totalRevenue: number, retentionRate: number, grossMargin: number): number;
/**
 * Estimates market opportunity size (TAM/SAM/SOM).
 *
 * @param {number} totalMarket - Total addressable market
 * @param {number} serviceable - Serviceable addressable market percentage
 * @param {number} obtainable - Serviceable obtainable market percentage
 * @returns {Record<string, number>} TAM, SAM, SOM
 */
export declare function estimateMarketOpportunity(totalMarket: number, serviceable: number, obtainable: number): Record<string, number>;
export {};
//# sourceMappingURL=revenue-growth-kit.d.ts.map