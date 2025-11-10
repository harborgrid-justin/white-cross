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
import { Model } from 'sequelize-typescript';
/**
 * Pricing rule types
 */
export declare enum PricingRuleType {
    BASE_PRICE = "BASE_PRICE",
    DISCOUNT = "DISCOUNT",
    MARKUP = "MARKUP",
    FIXED_PRICE = "FIXED_PRICE",
    FORMULA = "FORMULA",
    TIER = "TIER",
    QUANTITY_BREAK = "QUANTITY_BREAK",
    BUNDLE = "BUNDLE",
    PROMOTIONAL = "PROMOTIONAL",
    CONTRACT = "CONTRACT",
    SEASONAL = "SEASONAL",
    CHANNEL = "CHANNEL",
    CUSTOMER_SPECIFIC = "CUSTOMER_SPECIFIC",
    CATEGORY = "CATEGORY",
    GEOGRAPHIC = "GEOGRAPHIC",
    TIME_BASED = "TIME_BASED"
}
/**
 * Pricing rule status
 */
export declare enum PricingRuleStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SCHEDULED = "SCHEDULED",
    EXPIRED = "EXPIRED",
    SUSPENDED = "SUSPENDED"
}
/**
 * Condition operators for rule evaluation
 */
export declare enum ConditionOperator {
    EQUALS = "EQUALS",
    NOT_EQUALS = "NOT_EQUALS",
    GREATER_THAN = "GREATER_THAN",
    GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",
    LESS_THAN = "LESS_THAN",
    LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
    BETWEEN = "BETWEEN",
    IN = "IN",
    NOT_IN = "NOT_IN",
    CONTAINS = "CONTAINS",
    STARTS_WITH = "STARTS_WITH",
    ENDS_WITH = "ENDS_WITH",
    IS_NULL = "IS_NULL",
    IS_NOT_NULL = "IS_NOT_NULL"
}
/**
 * Condition logical operators
 */
export declare enum LogicalOperator {
    AND = "AND",
    OR = "OR",
    NOT = "NOT"
}
/**
 * Pricing calculation methods
 */
export declare enum PricingCalculationMethod {
    PERCENTAGE_DISCOUNT = "PERCENTAGE_DISCOUNT",
    FIXED_DISCOUNT = "FIXED_DISCOUNT",
    PERCENTAGE_MARKUP = "PERCENTAGE_MARKUP",
    FIXED_MARKUP = "FIXED_MARKUP",
    OVERRIDE_PRICE = "OVERRIDE_PRICE",
    COST_PLUS = "COST_PLUS",
    FORMULA = "FORMULA",
    TIERED = "TIERED",
    MATRIX = "MATRIX"
}
/**
 * Rule precedence levels (higher number = higher priority)
 */
export declare enum RulePrecedence {
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
    MANUAL_OVERRIDE = 100
}
/**
 * Rule combination strategies when multiple rules apply
 */
export declare enum RuleCombinationStrategy {
    HIGHEST_PRIORITY = "HIGHEST_PRIORITY",
    LOWEST_PRICE = "LOWEST_PRICE",
    HIGHEST_PRICE = "HIGHEST_PRICE",
    ADDITIVE = "ADDITIVE",
    MULTIPLICATIVE = "MULTIPLICATIVE",
    AVERAGE = "AVERAGE",
    FIRST_MATCH = "FIRST_MATCH",
    LAST_MATCH = "LAST_MATCH"
}
/**
 * Customer tier levels
 */
export declare enum CustomerTier {
    BRONZE = "BRONZE",
    SILVER = "SILVER",
    GOLD = "GOLD",
    PLATINUM = "PLATINUM",
    DIAMOND = "DIAMOND",
    VIP = "VIP"
}
/**
 * Sales channels
 */
export declare enum SalesChannel {
    WEB = "WEB",
    MOBILE = "MOBILE",
    RETAIL = "RETAIL",
    WHOLESALE = "WHOLESALE",
    DISTRIBUTOR = "DISTRIBUTOR",
    PARTNER = "PARTNER",
    DIRECT_SALES = "DIRECT_SALES",
    MARKETPLACE = "MARKETPLACE"
}
/**
 * Geographic regions
 */
export declare enum GeographicRegion {
    NORTH_AMERICA = "NORTH_AMERICA",
    SOUTH_AMERICA = "SOUTH_AMERICA",
    EUROPE = "EUROPE",
    ASIA_PACIFIC = "ASIA_PACIFIC",
    MIDDLE_EAST = "MIDDLE_EAST",
    AFRICA = "AFRICA"
}
/**
 * Seasonal periods
 */
export declare enum SeasonalPeriod {
    SPRING = "SPRING",
    SUMMER = "SUMMER",
    FALL = "FALL",
    WINTER = "WINTER",
    HOLIDAY = "HOLIDAY",
    BACK_TO_SCHOOL = "BACK_TO_SCHOOL",
    BLACK_FRIDAY = "BLACK_FRIDAY",
    CYBER_MONDAY = "CYBER_MONDAY",
    CLEARANCE = "CLEARANCE"
}
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
/**
 * Create pricing rule DTO
 */
export declare class CreatePricingRuleDto {
    ruleName: string;
    description?: string;
    ruleType: PricingRuleType;
    precedence: RulePrecedence;
    conditions: RuleCondition[];
    action: RuleAction;
    effectiveStartDate?: Date;
    effectiveEndDate?: Date;
    customerIds?: string[];
    productIds?: string[];
    categoryIds?: string[];
    channels?: SalesChannel[];
    allowStacking?: boolean;
    customFields?: Record<string, unknown>;
}
/**
 * Calculate pricing DTO
 */
export declare class CalculatePricingDto {
    context: PricingContext;
    combinationStrategy?: RuleCombinationStrategy;
    includeInactive?: boolean;
}
/**
 * Quantity break DTO
 */
export declare class CreateQuantityBreakDto {
    productId: string;
    customerId?: string;
    tiers: QuantityBreakTier[];
    effectiveStartDate?: Date;
    effectiveEndDate?: Date;
}
/**
 * Bundle pricing DTO
 */
export declare class CreateBundlePricingDto {
    bundleName: string;
    components: BundleComponent[];
    bundlePrice?: number;
    discountPercent?: number;
    effectiveStartDate?: Date;
    effectiveEndDate?: Date;
}
/**
 * Pricing rule model
 */
export declare class PricingRule extends Model {
    ruleId: string;
    ruleCode: string;
    ruleName: string;
    description: string;
    ruleType: PricingRuleType;
    status: PricingRuleStatus;
    precedence: number;
    conditions: RuleCondition[];
    action: RuleAction;
    effectiveStartDate: Date;
    effectiveEndDate: Date;
    customerIds: string[];
    productIds: string[];
    categoryIds: string[];
    channels: SalesChannel[];
    allowStacking: boolean;
    combinationStrategy: RuleCombinationStrategy;
    customFields: Record<string, unknown>;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Pricing matrix model for multi-dimensional pricing
 */
export declare class PricingMatrix extends Model {
    matrixId: string;
    matrixCode: string;
    matrixName: string;
    productId: string;
    customerId: string;
    dimensions: string[];
    cells: PricingMatrixCell[];
    isActive: boolean;
    effectiveStartDate: Date;
    effectiveEndDate: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Quantity break pricing model
 */
export declare class QuantityBreak extends Model {
    breakId: string;
    productId: string;
    customerId: string;
    tiers: QuantityBreakTier[];
    isActive: boolean;
    effectiveStartDate: Date;
    effectiveEndDate: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Bundle pricing model
 */
export declare class BundlePricing extends Model {
    bundleId: string;
    bundleCode: string;
    bundleName: string;
    components: BundleComponent[];
    bundlePrice: number;
    discountPercent: number;
    isActive: boolean;
    effectiveStartDate: Date;
    effectiveEndDate: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Customer-specific pricing model
 */
export declare class CustomerPricing extends Model {
    customerPricingId: string;
    customerId: string;
    productId: string;
    price: number;
    discountPercent: number;
    minOrderQuantity: number;
    isActive: boolean;
    effectiveStartDate: Date;
    effectiveEndDate: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Contract pricing model
 */
export declare class ContractPricing extends Model {
    contractPricingId: string;
    contractId: string;
    customerId: string;
    productId: string;
    contractPrice: number;
    minCommitmentQuantity: number;
    maxCommitmentQuantity: number;
    isActive: boolean;
    effectiveStartDate: Date;
    effectiveEndDate: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
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
export declare function executePricingRuleEngine(context: PricingContext, basePrice: number, combinationStrategy?: RuleCombinationStrategy): Promise<FinalPricingResult>;
/**
 * Evaluate if a pricing rule applies to the given context
 *
 * @param rule - Pricing rule to evaluate
 * @param context - Pricing context
 * @returns True if rule applies
 */
export declare function evaluateRuleApplicability(rule: PricingRule, context: PricingContext): boolean;
/**
 * Evaluate rule conditions with support for complex logic
 *
 * @param conditions - Rule conditions to evaluate
 * @param context - Pricing context
 * @returns True if all conditions pass
 */
export declare function evaluateRuleConditions(conditions: RuleCondition[], context: PricingContext): boolean;
/**
 * Evaluate a single rule condition
 *
 * @param condition - Single condition to evaluate
 * @param context - Pricing context
 * @returns True if condition passes
 */
export declare function evaluateSingleCondition(condition: RuleCondition, context: PricingContext): boolean;
/**
 * Get value from context by field name
 *
 * @param field - Field name (supports dot notation)
 * @param context - Pricing context
 * @returns Field value
 */
export declare function getContextValue(field: string, context: PricingContext): unknown;
/**
 * Evaluate a pricing rule and calculate adjusted price
 *
 * @param rule - Pricing rule
 * @param context - Pricing context
 * @param currentPrice - Current price before this rule
 * @param basePrice - Original base price
 * @returns Pricing rule result
 */
export declare function evaluatePricingRule(rule: PricingRule, context: PricingContext, currentPrice: number, basePrice: number): Promise<PricingRuleResult>;
/**
 * Evaluate pricing formula with context variables
 *
 * @param formula - Formula string (e.g., "basePrice * 0.9 + (quantity > 10 ? -5 : 0)")
 * @param context - Pricing context
 * @param currentPrice - Current price
 * @returns Calculated price
 */
export declare function evaluatePricingFormula(formula: string, context: PricingContext, currentPrice: number): number;
/**
 * Apply combination strategy to multiple pricing results
 *
 * @param basePrice - Original base price
 * @param results - Array of pricing rule results
 * @param strategy - Combination strategy
 * @returns Final combined price
 */
export declare function applyCombinationStrategy(basePrice: number, results: PricingRuleResult[], strategy: RuleCombinationStrategy): number;
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
export declare function calculateQuantityBreakPricing(productId: string, customerId: string | null, quantity: number, basePrice: number): Promise<number>;
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
export declare function calculateBundlePricing(bundleCode: string, componentPrices: Record<string, number>): Promise<{
    bundlePrice: number;
    savings: number;
    componentTotal: number;
}>;
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
export declare function getCustomerSpecificPrice(customerId: string, productId: string): Promise<number | null>;
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
export declare function getContractPrice(contractId: string, productId: string): Promise<number | null>;
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
export declare function lookupPricingMatrix(matrixCode: string, dimensions: PricingMatrixDimension[]): Promise<number | null>;
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
export declare function createPricingRule(ruleData: CreatePricingRuleDto, userId: string): Promise<PricingRule>;
/**
 * Generate unique pricing rule code
 *
 * @param ruleType - Rule type
 * @returns Generated rule code
 */
export declare function generatePricingRuleCode(ruleType: PricingRuleType): Promise<string>;
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
export declare function activatePricingRule(ruleId: string, userId: string): Promise<PricingRule>;
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
export declare function deactivatePricingRule(ruleId: string, userId: string): Promise<PricingRule>;
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
export declare function getPricingRulesForProduct(productId: string, includeInactive?: boolean): Promise<PricingRule[]>;
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
export declare function getPricingRulesForCustomer(customerId: string, includeInactive?: boolean): Promise<PricingRule[]>;
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
export declare function calculateTieredPricing(customerTier: CustomerTier, basePrice: number, tierDiscounts: Record<CustomerTier, number>): number;
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
export declare function calculateChannelPricing(channel: SalesChannel, basePrice: number, channelMarkups: Record<SalesChannel, number>): number;
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
export declare function calculateGeographicPricing(region: GeographicRegion | string, state: string, basePrice: number, regionalAdjustments: Record<string, number>): number;
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
export declare function calculateSeasonalPricing(season: SeasonalPeriod, basePrice: number, seasonalDiscounts: Record<SeasonalPeriod, number>): number;
/**
 * Determine current season based on date
 *
 * @param date - Date to evaluate
 * @returns Seasonal period
 *
 * @example
 * const season = getCurrentSeason(new Date());
 */
export declare function getCurrentSeason(date?: Date): SeasonalPeriod;
/**
 * Create quantity break pricing
 *
 * @param breakData - Quantity break data
 * @returns Created quantity break
 *
 * @example
 * const qtyBreak = await createQuantityBreak(breakDto);
 */
export declare function createQuantityBreak(breakData: CreateQuantityBreakDto): Promise<QuantityBreak>;
/**
 * Create bundle pricing
 *
 * @param bundleData - Bundle pricing data
 * @returns Created bundle pricing
 *
 * @example
 * const bundle = await createBundlePricing(bundleDto);
 */
export declare function createBundlePricing(bundleData: CreateBundlePricingDto): Promise<BundlePricing>;
/**
 * Generate unique bundle code
 *
 * @returns Generated bundle code
 */
export declare function generateBundleCode(): Promise<string>;
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
export declare function generateCrossSellRecommendations(productId: string, context: PricingContext): Promise<PricingRecommendation[]>;
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
export declare function generateUpSellRecommendations(productId: string, context: PricingContext): Promise<PricingRecommendation[]>;
/**
 * Validate pricing rule for conflicts
 *
 * @param ruleData - Pricing rule data to validate
 * @returns Validation result with conflicts
 *
 * @example
 * const validation = await validatePricingRuleConflicts(ruleDto);
 */
export declare function validatePricingRuleConflicts(ruleData: CreatePricingRuleDto): Promise<{
    isValid: boolean;
    conflicts: string[];
}>;
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
export declare function testPricingRule(ruleId: string, testContext: PricingContext, testPrice: number): Promise<PricingRuleResult>;
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
export declare function clonePricingRule(ruleId: string, newRuleName: string, userId: string): Promise<PricingRule>;
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
export declare function bulkActivatePricingRules(ruleIds: string[], userId: string): Promise<number>;
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
export declare function bulkDeactivatePricingRules(ruleIds: string[], userId: string): Promise<number>;
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
export declare function calculateVolumePricing(quantity: number, basePrice: number, volumeTiers: Array<{
    minQty: number;
    maxQty: number | null;
    discount: number;
}>): number;
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
export declare function calculatePromotionalPricing(basePrice: number, promoCode: string, context: PricingContext): Promise<number>;
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
export declare function getPricingHistory(productId: string, startDate: Date, endDate: Date): Promise<Array<{
    date: Date;
    price: number;
    ruleId: string;
    ruleName: string;
}>>;
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
export declare function calculateCostPlusPricing(costPrice: number, markupPercent: number, minMargin?: number): number;
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
export declare function applyPricingRoundingRule(price: number, roundingRule: string): number;
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
export declare function calculateCompetitivePricing(basePrice: number, competitorPrices: number[], strategy: 'MATCH' | 'UNDERCUT' | 'PREMIUM', adjustment?: number): number;
/**
 * Export pricing rules to JSON for backup/migration
 *
 * @param filters - Optional filters for export
 * @returns JSON export of pricing rules
 *
 * @example
 * const export = await exportPricingRules({ ruleType: 'PROMOTIONAL' });
 */
export declare function exportPricingRules(filters?: {
    ruleType?: PricingRuleType;
    status?: PricingRuleStatus;
}): Promise<string>;
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
export declare function importPricingRules(jsonData: string, userId: string): Promise<number>;
//# sourceMappingURL=pricing-rules-conditions-kit.d.ts.map