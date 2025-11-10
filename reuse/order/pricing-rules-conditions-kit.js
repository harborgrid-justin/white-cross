"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractPricing = exports.CustomerPricing = exports.BundlePricing = exports.QuantityBreak = exports.PricingMatrix = exports.PricingRule = exports.CreateBundlePricingDto = exports.CreateQuantityBreakDto = exports.CalculatePricingDto = exports.CreatePricingRuleDto = exports.SeasonalPeriod = exports.GeographicRegion = exports.SalesChannel = exports.CustomerTier = exports.RuleCombinationStrategy = exports.RulePrecedence = exports.PricingCalculationMethod = exports.LogicalOperator = exports.ConditionOperator = exports.PricingRuleStatus = exports.PricingRuleType = void 0;
exports.executePricingRuleEngine = executePricingRuleEngine;
exports.evaluateRuleApplicability = evaluateRuleApplicability;
exports.evaluateRuleConditions = evaluateRuleConditions;
exports.evaluateSingleCondition = evaluateSingleCondition;
exports.getContextValue = getContextValue;
exports.evaluatePricingRule = evaluatePricingRule;
exports.evaluatePricingFormula = evaluatePricingFormula;
exports.applyCombinationStrategy = applyCombinationStrategy;
exports.calculateQuantityBreakPricing = calculateQuantityBreakPricing;
exports.calculateBundlePricing = calculateBundlePricing;
exports.getCustomerSpecificPrice = getCustomerSpecificPrice;
exports.getContractPrice = getContractPrice;
exports.lookupPricingMatrix = lookupPricingMatrix;
exports.createPricingRule = createPricingRule;
exports.generatePricingRuleCode = generatePricingRuleCode;
exports.activatePricingRule = activatePricingRule;
exports.deactivatePricingRule = deactivatePricingRule;
exports.getPricingRulesForProduct = getPricingRulesForProduct;
exports.getPricingRulesForCustomer = getPricingRulesForCustomer;
exports.calculateTieredPricing = calculateTieredPricing;
exports.calculateChannelPricing = calculateChannelPricing;
exports.calculateGeographicPricing = calculateGeographicPricing;
exports.calculateSeasonalPricing = calculateSeasonalPricing;
exports.getCurrentSeason = getCurrentSeason;
exports.createQuantityBreak = createQuantityBreak;
exports.createBundlePricing = createBundlePricing;
exports.generateBundleCode = generateBundleCode;
exports.generateCrossSellRecommendations = generateCrossSellRecommendations;
exports.generateUpSellRecommendations = generateUpSellRecommendations;
exports.validatePricingRuleConflicts = validatePricingRuleConflicts;
exports.testPricingRule = testPricingRule;
exports.clonePricingRule = clonePricingRule;
exports.bulkActivatePricingRules = bulkActivatePricingRules;
exports.bulkDeactivatePricingRules = bulkDeactivatePricingRules;
exports.calculateVolumePricing = calculateVolumePricing;
exports.calculatePromotionalPricing = calculatePromotionalPricing;
exports.getPricingHistory = getPricingHistory;
exports.calculateCostPlusPricing = calculateCostPlusPricing;
exports.applyPricingRoundingRule = applyPricingRoundingRule;
exports.calculateCompetitivePricing = calculateCompetitivePricing;
exports.exportPricingRules = exportPricingRules;
exports.importPricingRules = importPricingRules;
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
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const sequelize_1 = require("sequelize");
// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================
/**
 * Pricing rule types
 */
var PricingRuleType;
(function (PricingRuleType) {
    PricingRuleType["BASE_PRICE"] = "BASE_PRICE";
    PricingRuleType["DISCOUNT"] = "DISCOUNT";
    PricingRuleType["MARKUP"] = "MARKUP";
    PricingRuleType["FIXED_PRICE"] = "FIXED_PRICE";
    PricingRuleType["FORMULA"] = "FORMULA";
    PricingRuleType["TIER"] = "TIER";
    PricingRuleType["QUANTITY_BREAK"] = "QUANTITY_BREAK";
    PricingRuleType["BUNDLE"] = "BUNDLE";
    PricingRuleType["PROMOTIONAL"] = "PROMOTIONAL";
    PricingRuleType["CONTRACT"] = "CONTRACT";
    PricingRuleType["SEASONAL"] = "SEASONAL";
    PricingRuleType["CHANNEL"] = "CHANNEL";
    PricingRuleType["CUSTOMER_SPECIFIC"] = "CUSTOMER_SPECIFIC";
    PricingRuleType["CATEGORY"] = "CATEGORY";
    PricingRuleType["GEOGRAPHIC"] = "GEOGRAPHIC";
    PricingRuleType["TIME_BASED"] = "TIME_BASED";
})(PricingRuleType || (exports.PricingRuleType = PricingRuleType = {}));
/**
 * Pricing rule status
 */
var PricingRuleStatus;
(function (PricingRuleStatus) {
    PricingRuleStatus["DRAFT"] = "DRAFT";
    PricingRuleStatus["ACTIVE"] = "ACTIVE";
    PricingRuleStatus["INACTIVE"] = "INACTIVE";
    PricingRuleStatus["SCHEDULED"] = "SCHEDULED";
    PricingRuleStatus["EXPIRED"] = "EXPIRED";
    PricingRuleStatus["SUSPENDED"] = "SUSPENDED";
})(PricingRuleStatus || (exports.PricingRuleStatus = PricingRuleStatus = {}));
/**
 * Condition operators for rule evaluation
 */
var ConditionOperator;
(function (ConditionOperator) {
    ConditionOperator["EQUALS"] = "EQUALS";
    ConditionOperator["NOT_EQUALS"] = "NOT_EQUALS";
    ConditionOperator["GREATER_THAN"] = "GREATER_THAN";
    ConditionOperator["GREATER_THAN_OR_EQUAL"] = "GREATER_THAN_OR_EQUAL";
    ConditionOperator["LESS_THAN"] = "LESS_THAN";
    ConditionOperator["LESS_THAN_OR_EQUAL"] = "LESS_THAN_OR_EQUAL";
    ConditionOperator["BETWEEN"] = "BETWEEN";
    ConditionOperator["IN"] = "IN";
    ConditionOperator["NOT_IN"] = "NOT_IN";
    ConditionOperator["CONTAINS"] = "CONTAINS";
    ConditionOperator["STARTS_WITH"] = "STARTS_WITH";
    ConditionOperator["ENDS_WITH"] = "ENDS_WITH";
    ConditionOperator["IS_NULL"] = "IS_NULL";
    ConditionOperator["IS_NOT_NULL"] = "IS_NOT_NULL";
})(ConditionOperator || (exports.ConditionOperator = ConditionOperator = {}));
/**
 * Condition logical operators
 */
var LogicalOperator;
(function (LogicalOperator) {
    LogicalOperator["AND"] = "AND";
    LogicalOperator["OR"] = "OR";
    LogicalOperator["NOT"] = "NOT";
})(LogicalOperator || (exports.LogicalOperator = LogicalOperator = {}));
/**
 * Pricing calculation methods
 */
var PricingCalculationMethod;
(function (PricingCalculationMethod) {
    PricingCalculationMethod["PERCENTAGE_DISCOUNT"] = "PERCENTAGE_DISCOUNT";
    PricingCalculationMethod["FIXED_DISCOUNT"] = "FIXED_DISCOUNT";
    PricingCalculationMethod["PERCENTAGE_MARKUP"] = "PERCENTAGE_MARKUP";
    PricingCalculationMethod["FIXED_MARKUP"] = "FIXED_MARKUP";
    PricingCalculationMethod["OVERRIDE_PRICE"] = "OVERRIDE_PRICE";
    PricingCalculationMethod["COST_PLUS"] = "COST_PLUS";
    PricingCalculationMethod["FORMULA"] = "FORMULA";
    PricingCalculationMethod["TIERED"] = "TIERED";
    PricingCalculationMethod["MATRIX"] = "MATRIX";
})(PricingCalculationMethod || (exports.PricingCalculationMethod = PricingCalculationMethod = {}));
/**
 * Rule precedence levels (higher number = higher priority)
 */
var RulePrecedence;
(function (RulePrecedence) {
    RulePrecedence[RulePrecedence["SYSTEM_DEFAULT"] = 0] = "SYSTEM_DEFAULT";
    RulePrecedence[RulePrecedence["CATEGORY"] = 10] = "CATEGORY";
    RulePrecedence[RulePrecedence["PRODUCT"] = 20] = "PRODUCT";
    RulePrecedence[RulePrecedence["CUSTOMER_TIER"] = 30] = "CUSTOMER_TIER";
    RulePrecedence[RulePrecedence["GEOGRAPHIC"] = 40] = "GEOGRAPHIC";
    RulePrecedence[RulePrecedence["CHANNEL"] = 50] = "CHANNEL";
    RulePrecedence[RulePrecedence["SEASONAL"] = 60] = "SEASONAL";
    RulePrecedence[RulePrecedence["PROMOTIONAL"] = 70] = "PROMOTIONAL";
    RulePrecedence[RulePrecedence["CONTRACT"] = 80] = "CONTRACT";
    RulePrecedence[RulePrecedence["CUSTOMER_SPECIFIC"] = 90] = "CUSTOMER_SPECIFIC";
    RulePrecedence[RulePrecedence["MANUAL_OVERRIDE"] = 100] = "MANUAL_OVERRIDE";
})(RulePrecedence || (exports.RulePrecedence = RulePrecedence = {}));
/**
 * Rule combination strategies when multiple rules apply
 */
var RuleCombinationStrategy;
(function (RuleCombinationStrategy) {
    RuleCombinationStrategy["HIGHEST_PRIORITY"] = "HIGHEST_PRIORITY";
    RuleCombinationStrategy["LOWEST_PRICE"] = "LOWEST_PRICE";
    RuleCombinationStrategy["HIGHEST_PRICE"] = "HIGHEST_PRICE";
    RuleCombinationStrategy["ADDITIVE"] = "ADDITIVE";
    RuleCombinationStrategy["MULTIPLICATIVE"] = "MULTIPLICATIVE";
    RuleCombinationStrategy["AVERAGE"] = "AVERAGE";
    RuleCombinationStrategy["FIRST_MATCH"] = "FIRST_MATCH";
    RuleCombinationStrategy["LAST_MATCH"] = "LAST_MATCH";
})(RuleCombinationStrategy || (exports.RuleCombinationStrategy = RuleCombinationStrategy = {}));
/**
 * Customer tier levels
 */
var CustomerTier;
(function (CustomerTier) {
    CustomerTier["BRONZE"] = "BRONZE";
    CustomerTier["SILVER"] = "SILVER";
    CustomerTier["GOLD"] = "GOLD";
    CustomerTier["PLATINUM"] = "PLATINUM";
    CustomerTier["DIAMOND"] = "DIAMOND";
    CustomerTier["VIP"] = "VIP";
})(CustomerTier || (exports.CustomerTier = CustomerTier = {}));
/**
 * Sales channels
 */
var SalesChannel;
(function (SalesChannel) {
    SalesChannel["WEB"] = "WEB";
    SalesChannel["MOBILE"] = "MOBILE";
    SalesChannel["RETAIL"] = "RETAIL";
    SalesChannel["WHOLESALE"] = "WHOLESALE";
    SalesChannel["DISTRIBUTOR"] = "DISTRIBUTOR";
    SalesChannel["PARTNER"] = "PARTNER";
    SalesChannel["DIRECT_SALES"] = "DIRECT_SALES";
    SalesChannel["MARKETPLACE"] = "MARKETPLACE";
})(SalesChannel || (exports.SalesChannel = SalesChannel = {}));
/**
 * Geographic regions
 */
var GeographicRegion;
(function (GeographicRegion) {
    GeographicRegion["NORTH_AMERICA"] = "NORTH_AMERICA";
    GeographicRegion["SOUTH_AMERICA"] = "SOUTH_AMERICA";
    GeographicRegion["EUROPE"] = "EUROPE";
    GeographicRegion["ASIA_PACIFIC"] = "ASIA_PACIFIC";
    GeographicRegion["MIDDLE_EAST"] = "MIDDLE_EAST";
    GeographicRegion["AFRICA"] = "AFRICA";
})(GeographicRegion || (exports.GeographicRegion = GeographicRegion = {}));
/**
 * Seasonal periods
 */
var SeasonalPeriod;
(function (SeasonalPeriod) {
    SeasonalPeriod["SPRING"] = "SPRING";
    SeasonalPeriod["SUMMER"] = "SUMMER";
    SeasonalPeriod["FALL"] = "FALL";
    SeasonalPeriod["WINTER"] = "WINTER";
    SeasonalPeriod["HOLIDAY"] = "HOLIDAY";
    SeasonalPeriod["BACK_TO_SCHOOL"] = "BACK_TO_SCHOOL";
    SeasonalPeriod["BLACK_FRIDAY"] = "BLACK_FRIDAY";
    SeasonalPeriod["CYBER_MONDAY"] = "CYBER_MONDAY";
    SeasonalPeriod["CLEARANCE"] = "CLEARANCE";
})(SeasonalPeriod || (exports.SeasonalPeriod = SeasonalPeriod = {}));
// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================
/**
 * Create pricing rule DTO
 */
let CreatePricingRuleDto = (() => {
    var _a;
    let _ruleName_decorators;
    let _ruleName_initializers = [];
    let _ruleName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _ruleType_decorators;
    let _ruleType_initializers = [];
    let _ruleType_extraInitializers = [];
    let _precedence_decorators;
    let _precedence_initializers = [];
    let _precedence_extraInitializers = [];
    let _conditions_decorators;
    let _conditions_initializers = [];
    let _conditions_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _effectiveStartDate_decorators;
    let _effectiveStartDate_initializers = [];
    let _effectiveStartDate_extraInitializers = [];
    let _effectiveEndDate_decorators;
    let _effectiveEndDate_initializers = [];
    let _effectiveEndDate_extraInitializers = [];
    let _customerIds_decorators;
    let _customerIds_initializers = [];
    let _customerIds_extraInitializers = [];
    let _productIds_decorators;
    let _productIds_initializers = [];
    let _productIds_extraInitializers = [];
    let _categoryIds_decorators;
    let _categoryIds_initializers = [];
    let _categoryIds_extraInitializers = [];
    let _channels_decorators;
    let _channels_initializers = [];
    let _channels_extraInitializers = [];
    let _allowStacking_decorators;
    let _allowStacking_initializers = [];
    let _allowStacking_extraInitializers = [];
    let _customFields_decorators;
    let _customFields_initializers = [];
    let _customFields_extraInitializers = [];
    return _a = class CreatePricingRuleDto {
            constructor() {
                this.ruleName = __runInitializers(this, _ruleName_initializers, void 0);
                this.description = (__runInitializers(this, _ruleName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.ruleType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _ruleType_initializers, void 0));
                this.precedence = (__runInitializers(this, _ruleType_extraInitializers), __runInitializers(this, _precedence_initializers, void 0));
                this.conditions = (__runInitializers(this, _precedence_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
                this.action = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _action_initializers, void 0));
                this.effectiveStartDate = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _effectiveStartDate_initializers, void 0));
                this.effectiveEndDate = (__runInitializers(this, _effectiveStartDate_extraInitializers), __runInitializers(this, _effectiveEndDate_initializers, void 0));
                this.customerIds = (__runInitializers(this, _effectiveEndDate_extraInitializers), __runInitializers(this, _customerIds_initializers, void 0));
                this.productIds = (__runInitializers(this, _customerIds_extraInitializers), __runInitializers(this, _productIds_initializers, void 0));
                this.categoryIds = (__runInitializers(this, _productIds_extraInitializers), __runInitializers(this, _categoryIds_initializers, void 0));
                this.channels = (__runInitializers(this, _categoryIds_extraInitializers), __runInitializers(this, _channels_initializers, void 0));
                this.allowStacking = (__runInitializers(this, _channels_extraInitializers), __runInitializers(this, _allowStacking_initializers, void 0));
                this.customFields = (__runInitializers(this, _allowStacking_extraInitializers), __runInitializers(this, _customFields_initializers, void 0));
                __runInitializers(this, _customFields_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _ruleName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _ruleType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule type', enum: PricingRuleType }), (0, class_validator_1.IsEnum)(PricingRuleType), (0, class_validator_1.IsNotEmpty)()];
            _precedence_decorators = [(0, swagger_1.ApiProperty)({ description: 'Precedence level', enum: RulePrecedence }), (0, class_validator_1.IsEnum)(RulePrecedence), (0, class_validator_1.IsNotEmpty)()];
            _conditions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule conditions (JSON)' }), (0, class_validator_1.IsNotEmpty)()];
            _action_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule action (JSON)' }), (0, class_validator_1.IsNotEmpty)()];
            _effectiveStartDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Effective start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsOptional)()];
            _effectiveEndDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Effective end date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsOptional)()];
            _customerIds_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Customer IDs this rule applies to' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _productIds_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Product IDs this rule applies to' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _categoryIds_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Product category IDs this rule applies to' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _channels_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Channels this rule applies to' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _allowStacking_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Enable rule stacking' }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _customFields_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Custom fields (JSON)' }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _ruleName_decorators, { kind: "field", name: "ruleName", static: false, private: false, access: { has: obj => "ruleName" in obj, get: obj => obj.ruleName, set: (obj, value) => { obj.ruleName = value; } }, metadata: _metadata }, _ruleName_initializers, _ruleName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _ruleType_decorators, { kind: "field", name: "ruleType", static: false, private: false, access: { has: obj => "ruleType" in obj, get: obj => obj.ruleType, set: (obj, value) => { obj.ruleType = value; } }, metadata: _metadata }, _ruleType_initializers, _ruleType_extraInitializers);
            __esDecorate(null, null, _precedence_decorators, { kind: "field", name: "precedence", static: false, private: false, access: { has: obj => "precedence" in obj, get: obj => obj.precedence, set: (obj, value) => { obj.precedence = value; } }, metadata: _metadata }, _precedence_initializers, _precedence_extraInitializers);
            __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: obj => "conditions" in obj, get: obj => obj.conditions, set: (obj, value) => { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
            __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
            __esDecorate(null, null, _effectiveStartDate_decorators, { kind: "field", name: "effectiveStartDate", static: false, private: false, access: { has: obj => "effectiveStartDate" in obj, get: obj => obj.effectiveStartDate, set: (obj, value) => { obj.effectiveStartDate = value; } }, metadata: _metadata }, _effectiveStartDate_initializers, _effectiveStartDate_extraInitializers);
            __esDecorate(null, null, _effectiveEndDate_decorators, { kind: "field", name: "effectiveEndDate", static: false, private: false, access: { has: obj => "effectiveEndDate" in obj, get: obj => obj.effectiveEndDate, set: (obj, value) => { obj.effectiveEndDate = value; } }, metadata: _metadata }, _effectiveEndDate_initializers, _effectiveEndDate_extraInitializers);
            __esDecorate(null, null, _customerIds_decorators, { kind: "field", name: "customerIds", static: false, private: false, access: { has: obj => "customerIds" in obj, get: obj => obj.customerIds, set: (obj, value) => { obj.customerIds = value; } }, metadata: _metadata }, _customerIds_initializers, _customerIds_extraInitializers);
            __esDecorate(null, null, _productIds_decorators, { kind: "field", name: "productIds", static: false, private: false, access: { has: obj => "productIds" in obj, get: obj => obj.productIds, set: (obj, value) => { obj.productIds = value; } }, metadata: _metadata }, _productIds_initializers, _productIds_extraInitializers);
            __esDecorate(null, null, _categoryIds_decorators, { kind: "field", name: "categoryIds", static: false, private: false, access: { has: obj => "categoryIds" in obj, get: obj => obj.categoryIds, set: (obj, value) => { obj.categoryIds = value; } }, metadata: _metadata }, _categoryIds_initializers, _categoryIds_extraInitializers);
            __esDecorate(null, null, _channels_decorators, { kind: "field", name: "channels", static: false, private: false, access: { has: obj => "channels" in obj, get: obj => obj.channels, set: (obj, value) => { obj.channels = value; } }, metadata: _metadata }, _channels_initializers, _channels_extraInitializers);
            __esDecorate(null, null, _allowStacking_decorators, { kind: "field", name: "allowStacking", static: false, private: false, access: { has: obj => "allowStacking" in obj, get: obj => obj.allowStacking, set: (obj, value) => { obj.allowStacking = value; } }, metadata: _metadata }, _allowStacking_initializers, _allowStacking_extraInitializers);
            __esDecorate(null, null, _customFields_decorators, { kind: "field", name: "customFields", static: false, private: false, access: { has: obj => "customFields" in obj, get: obj => obj.customFields, set: (obj, value) => { obj.customFields = value; } }, metadata: _metadata }, _customFields_initializers, _customFields_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePricingRuleDto = CreatePricingRuleDto;
/**
 * Calculate pricing DTO
 */
let CalculatePricingDto = (() => {
    var _a;
    let _context_decorators;
    let _context_initializers = [];
    let _context_extraInitializers = [];
    let _combinationStrategy_decorators;
    let _combinationStrategy_initializers = [];
    let _combinationStrategy_extraInitializers = [];
    let _includeInactive_decorators;
    let _includeInactive_initializers = [];
    let _includeInactive_extraInitializers = [];
    return _a = class CalculatePricingDto {
            constructor() {
                this.context = __runInitializers(this, _context_initializers, void 0);
                this.combinationStrategy = (__runInitializers(this, _context_extraInitializers), __runInitializers(this, _combinationStrategy_initializers, void 0));
                this.includeInactive = (__runInitializers(this, _combinationStrategy_extraInitializers), __runInitializers(this, _includeInactive_initializers, void 0));
                __runInitializers(this, _includeInactive_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _context_decorators = [(0, swagger_1.ApiProperty)({ description: 'Pricing context' }), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => Object), (0, class_validator_1.IsNotEmpty)()];
            _combinationStrategy_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Rule combination strategy', enum: RuleCombinationStrategy }), (0, class_validator_1.IsEnum)(RuleCombinationStrategy), (0, class_validator_1.IsOptional)()];
            _includeInactive_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Include inactive rules for testing' }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _context_decorators, { kind: "field", name: "context", static: false, private: false, access: { has: obj => "context" in obj, get: obj => obj.context, set: (obj, value) => { obj.context = value; } }, metadata: _metadata }, _context_initializers, _context_extraInitializers);
            __esDecorate(null, null, _combinationStrategy_decorators, { kind: "field", name: "combinationStrategy", static: false, private: false, access: { has: obj => "combinationStrategy" in obj, get: obj => obj.combinationStrategy, set: (obj, value) => { obj.combinationStrategy = value; } }, metadata: _metadata }, _combinationStrategy_initializers, _combinationStrategy_extraInitializers);
            __esDecorate(null, null, _includeInactive_decorators, { kind: "field", name: "includeInactive", static: false, private: false, access: { has: obj => "includeInactive" in obj, get: obj => obj.includeInactive, set: (obj, value) => { obj.includeInactive = value; } }, metadata: _metadata }, _includeInactive_initializers, _includeInactive_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CalculatePricingDto = CalculatePricingDto;
/**
 * Quantity break DTO
 */
let CreateQuantityBreakDto = (() => {
    var _a;
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _tiers_decorators;
    let _tiers_initializers = [];
    let _tiers_extraInitializers = [];
    let _effectiveStartDate_decorators;
    let _effectiveStartDate_initializers = [];
    let _effectiveStartDate_extraInitializers = [];
    let _effectiveEndDate_decorators;
    let _effectiveEndDate_initializers = [];
    let _effectiveEndDate_extraInitializers = [];
    return _a = class CreateQuantityBreakDto {
            constructor() {
                this.productId = __runInitializers(this, _productId_initializers, void 0);
                this.customerId = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
                this.tiers = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _tiers_initializers, void 0));
                this.effectiveStartDate = (__runInitializers(this, _tiers_extraInitializers), __runInitializers(this, _effectiveStartDate_initializers, void 0));
                this.effectiveEndDate = (__runInitializers(this, _effectiveStartDate_extraInitializers), __runInitializers(this, _effectiveEndDate_initializers, void 0));
                __runInitializers(this, _effectiveEndDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID (optional for customer-specific)' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _tiers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity break tiers' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object), (0, class_validator_1.IsNotEmpty)()];
            _effectiveStartDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Effective start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsOptional)()];
            _effectiveEndDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Effective end date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _tiers_decorators, { kind: "field", name: "tiers", static: false, private: false, access: { has: obj => "tiers" in obj, get: obj => obj.tiers, set: (obj, value) => { obj.tiers = value; } }, metadata: _metadata }, _tiers_initializers, _tiers_extraInitializers);
            __esDecorate(null, null, _effectiveStartDate_decorators, { kind: "field", name: "effectiveStartDate", static: false, private: false, access: { has: obj => "effectiveStartDate" in obj, get: obj => obj.effectiveStartDate, set: (obj, value) => { obj.effectiveStartDate = value; } }, metadata: _metadata }, _effectiveStartDate_initializers, _effectiveStartDate_extraInitializers);
            __esDecorate(null, null, _effectiveEndDate_decorators, { kind: "field", name: "effectiveEndDate", static: false, private: false, access: { has: obj => "effectiveEndDate" in obj, get: obj => obj.effectiveEndDate, set: (obj, value) => { obj.effectiveEndDate = value; } }, metadata: _metadata }, _effectiveEndDate_initializers, _effectiveEndDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateQuantityBreakDto = CreateQuantityBreakDto;
/**
 * Bundle pricing DTO
 */
let CreateBundlePricingDto = (() => {
    var _a;
    let _bundleName_decorators;
    let _bundleName_initializers = [];
    let _bundleName_extraInitializers = [];
    let _components_decorators;
    let _components_initializers = [];
    let _components_extraInitializers = [];
    let _bundlePrice_decorators;
    let _bundlePrice_initializers = [];
    let _bundlePrice_extraInitializers = [];
    let _discountPercent_decorators;
    let _discountPercent_initializers = [];
    let _discountPercent_extraInitializers = [];
    let _effectiveStartDate_decorators;
    let _effectiveStartDate_initializers = [];
    let _effectiveStartDate_extraInitializers = [];
    let _effectiveEndDate_decorators;
    let _effectiveEndDate_initializers = [];
    let _effectiveEndDate_extraInitializers = [];
    return _a = class CreateBundlePricingDto {
            constructor() {
                this.bundleName = __runInitializers(this, _bundleName_initializers, void 0);
                this.components = (__runInitializers(this, _bundleName_extraInitializers), __runInitializers(this, _components_initializers, void 0));
                this.bundlePrice = (__runInitializers(this, _components_extraInitializers), __runInitializers(this, _bundlePrice_initializers, void 0));
                this.discountPercent = (__runInitializers(this, _bundlePrice_extraInitializers), __runInitializers(this, _discountPercent_initializers, void 0));
                this.effectiveStartDate = (__runInitializers(this, _discountPercent_extraInitializers), __runInitializers(this, _effectiveStartDate_initializers, void 0));
                this.effectiveEndDate = (__runInitializers(this, _effectiveStartDate_extraInitializers), __runInitializers(this, _effectiveEndDate_initializers, void 0));
                __runInitializers(this, _effectiveEndDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _bundleName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bundle name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _components_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bundle components' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object), (0, class_validator_1.IsNotEmpty)()];
            _bundlePrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bundle price or discount percent' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _discountPercent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount percent off component sum' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100), (0, class_validator_1.IsOptional)()];
            _effectiveStartDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Effective start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsOptional)()];
            _effectiveEndDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Effective end date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _bundleName_decorators, { kind: "field", name: "bundleName", static: false, private: false, access: { has: obj => "bundleName" in obj, get: obj => obj.bundleName, set: (obj, value) => { obj.bundleName = value; } }, metadata: _metadata }, _bundleName_initializers, _bundleName_extraInitializers);
            __esDecorate(null, null, _components_decorators, { kind: "field", name: "components", static: false, private: false, access: { has: obj => "components" in obj, get: obj => obj.components, set: (obj, value) => { obj.components = value; } }, metadata: _metadata }, _components_initializers, _components_extraInitializers);
            __esDecorate(null, null, _bundlePrice_decorators, { kind: "field", name: "bundlePrice", static: false, private: false, access: { has: obj => "bundlePrice" in obj, get: obj => obj.bundlePrice, set: (obj, value) => { obj.bundlePrice = value; } }, metadata: _metadata }, _bundlePrice_initializers, _bundlePrice_extraInitializers);
            __esDecorate(null, null, _discountPercent_decorators, { kind: "field", name: "discountPercent", static: false, private: false, access: { has: obj => "discountPercent" in obj, get: obj => obj.discountPercent, set: (obj, value) => { obj.discountPercent = value; } }, metadata: _metadata }, _discountPercent_initializers, _discountPercent_extraInitializers);
            __esDecorate(null, null, _effectiveStartDate_decorators, { kind: "field", name: "effectiveStartDate", static: false, private: false, access: { has: obj => "effectiveStartDate" in obj, get: obj => obj.effectiveStartDate, set: (obj, value) => { obj.effectiveStartDate = value; } }, metadata: _metadata }, _effectiveStartDate_initializers, _effectiveStartDate_extraInitializers);
            __esDecorate(null, null, _effectiveEndDate_decorators, { kind: "field", name: "effectiveEndDate", static: false, private: false, access: { has: obj => "effectiveEndDate" in obj, get: obj => obj.effectiveEndDate, set: (obj, value) => { obj.effectiveEndDate = value; } }, metadata: _metadata }, _effectiveEndDate_initializers, _effectiveEndDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateBundlePricingDto = CreateBundlePricingDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Pricing rule model
 */
let PricingRule = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _ruleId_decorators;
    let _ruleId_initializers = [];
    let _ruleId_extraInitializers = [];
    let _ruleCode_decorators;
    let _ruleCode_initializers = [];
    let _ruleCode_extraInitializers = [];
    let _ruleName_decorators;
    let _ruleName_initializers = [];
    let _ruleName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _ruleType_decorators;
    let _ruleType_initializers = [];
    let _ruleType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _precedence_decorators;
    let _precedence_initializers = [];
    let _precedence_extraInitializers = [];
    let _conditions_decorators;
    let _conditions_initializers = [];
    let _conditions_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _effectiveStartDate_decorators;
    let _effectiveStartDate_initializers = [];
    let _effectiveStartDate_extraInitializers = [];
    let _effectiveEndDate_decorators;
    let _effectiveEndDate_initializers = [];
    let _effectiveEndDate_extraInitializers = [];
    let _customerIds_decorators;
    let _customerIds_initializers = [];
    let _customerIds_extraInitializers = [];
    let _productIds_decorators;
    let _productIds_initializers = [];
    let _productIds_extraInitializers = [];
    let _categoryIds_decorators;
    let _categoryIds_initializers = [];
    let _categoryIds_extraInitializers = [];
    let _channels_decorators;
    let _channels_initializers = [];
    let _channels_extraInitializers = [];
    let _allowStacking_decorators;
    let _allowStacking_initializers = [];
    let _allowStacking_extraInitializers = [];
    let _combinationStrategy_decorators;
    let _combinationStrategy_initializers = [];
    let _combinationStrategy_extraInitializers = [];
    let _customFields_decorators;
    let _customFields_initializers = [];
    let _customFields_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var PricingRule = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.ruleId = __runInitializers(this, _ruleId_initializers, void 0);
            this.ruleCode = (__runInitializers(this, _ruleId_extraInitializers), __runInitializers(this, _ruleCode_initializers, void 0));
            this.ruleName = (__runInitializers(this, _ruleCode_extraInitializers), __runInitializers(this, _ruleName_initializers, void 0));
            this.description = (__runInitializers(this, _ruleName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.ruleType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _ruleType_initializers, void 0));
            this.status = (__runInitializers(this, _ruleType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.precedence = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _precedence_initializers, void 0));
            this.conditions = (__runInitializers(this, _precedence_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
            this.action = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _action_initializers, void 0));
            this.effectiveStartDate = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _effectiveStartDate_initializers, void 0));
            this.effectiveEndDate = (__runInitializers(this, _effectiveStartDate_extraInitializers), __runInitializers(this, _effectiveEndDate_initializers, void 0));
            this.customerIds = (__runInitializers(this, _effectiveEndDate_extraInitializers), __runInitializers(this, _customerIds_initializers, void 0));
            this.productIds = (__runInitializers(this, _customerIds_extraInitializers), __runInitializers(this, _productIds_initializers, void 0));
            this.categoryIds = (__runInitializers(this, _productIds_extraInitializers), __runInitializers(this, _categoryIds_initializers, void 0));
            this.channels = (__runInitializers(this, _categoryIds_extraInitializers), __runInitializers(this, _channels_initializers, void 0));
            this.allowStacking = (__runInitializers(this, _channels_extraInitializers), __runInitializers(this, _allowStacking_initializers, void 0));
            this.combinationStrategy = (__runInitializers(this, _allowStacking_extraInitializers), __runInitializers(this, _combinationStrategy_initializers, void 0));
            this.customFields = (__runInitializers(this, _combinationStrategy_extraInitializers), __runInitializers(this, _customFields_initializers, void 0));
            this.createdBy = (__runInitializers(this, _customFields_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PricingRule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _ruleId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Pricing rule ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _ruleCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule code (unique)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                unique: true,
            }), sequelize_typescript_1.Index];
        _ruleName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule name' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule description' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _ruleType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule type', enum: PricingRuleType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PricingRuleType)),
                allowNull: false,
            })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule status', enum: PricingRuleStatus }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PricingRuleStatus)),
                allowNull: false,
                defaultValue: PricingRuleStatus.DRAFT,
            })];
        _precedence_decorators = [(0, swagger_1.ApiProperty)({ description: 'Precedence level (higher = higher priority)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _conditions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule conditions (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _action_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule action (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _effectiveStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective start date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _effectiveEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective end date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _customerIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer IDs (JSON array)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _productIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product IDs (JSON array)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _categoryIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Category IDs (JSON array)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _channels_decorators = [(0, swagger_1.ApiProperty)({ description: 'Channels (JSON array)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _allowStacking_decorators = [(0, swagger_1.ApiProperty)({ description: 'Allow rule stacking' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            })];
        _combinationStrategy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Combination strategy', enum: RuleCombinationStrategy }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RuleCombinationStrategy)),
                allowNull: false,
                defaultValue: RuleCombinationStrategy.HIGHEST_PRIORITY,
            })];
        _customFields_decorators = [(0, swagger_1.ApiProperty)({ description: 'Custom fields (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Created by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _updatedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Updated by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _ruleId_decorators, { kind: "field", name: "ruleId", static: false, private: false, access: { has: obj => "ruleId" in obj, get: obj => obj.ruleId, set: (obj, value) => { obj.ruleId = value; } }, metadata: _metadata }, _ruleId_initializers, _ruleId_extraInitializers);
        __esDecorate(null, null, _ruleCode_decorators, { kind: "field", name: "ruleCode", static: false, private: false, access: { has: obj => "ruleCode" in obj, get: obj => obj.ruleCode, set: (obj, value) => { obj.ruleCode = value; } }, metadata: _metadata }, _ruleCode_initializers, _ruleCode_extraInitializers);
        __esDecorate(null, null, _ruleName_decorators, { kind: "field", name: "ruleName", static: false, private: false, access: { has: obj => "ruleName" in obj, get: obj => obj.ruleName, set: (obj, value) => { obj.ruleName = value; } }, metadata: _metadata }, _ruleName_initializers, _ruleName_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _ruleType_decorators, { kind: "field", name: "ruleType", static: false, private: false, access: { has: obj => "ruleType" in obj, get: obj => obj.ruleType, set: (obj, value) => { obj.ruleType = value; } }, metadata: _metadata }, _ruleType_initializers, _ruleType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _precedence_decorators, { kind: "field", name: "precedence", static: false, private: false, access: { has: obj => "precedence" in obj, get: obj => obj.precedence, set: (obj, value) => { obj.precedence = value; } }, metadata: _metadata }, _precedence_initializers, _precedence_extraInitializers);
        __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: obj => "conditions" in obj, get: obj => obj.conditions, set: (obj, value) => { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
        __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
        __esDecorate(null, null, _effectiveStartDate_decorators, { kind: "field", name: "effectiveStartDate", static: false, private: false, access: { has: obj => "effectiveStartDate" in obj, get: obj => obj.effectiveStartDate, set: (obj, value) => { obj.effectiveStartDate = value; } }, metadata: _metadata }, _effectiveStartDate_initializers, _effectiveStartDate_extraInitializers);
        __esDecorate(null, null, _effectiveEndDate_decorators, { kind: "field", name: "effectiveEndDate", static: false, private: false, access: { has: obj => "effectiveEndDate" in obj, get: obj => obj.effectiveEndDate, set: (obj, value) => { obj.effectiveEndDate = value; } }, metadata: _metadata }, _effectiveEndDate_initializers, _effectiveEndDate_extraInitializers);
        __esDecorate(null, null, _customerIds_decorators, { kind: "field", name: "customerIds", static: false, private: false, access: { has: obj => "customerIds" in obj, get: obj => obj.customerIds, set: (obj, value) => { obj.customerIds = value; } }, metadata: _metadata }, _customerIds_initializers, _customerIds_extraInitializers);
        __esDecorate(null, null, _productIds_decorators, { kind: "field", name: "productIds", static: false, private: false, access: { has: obj => "productIds" in obj, get: obj => obj.productIds, set: (obj, value) => { obj.productIds = value; } }, metadata: _metadata }, _productIds_initializers, _productIds_extraInitializers);
        __esDecorate(null, null, _categoryIds_decorators, { kind: "field", name: "categoryIds", static: false, private: false, access: { has: obj => "categoryIds" in obj, get: obj => obj.categoryIds, set: (obj, value) => { obj.categoryIds = value; } }, metadata: _metadata }, _categoryIds_initializers, _categoryIds_extraInitializers);
        __esDecorate(null, null, _channels_decorators, { kind: "field", name: "channels", static: false, private: false, access: { has: obj => "channels" in obj, get: obj => obj.channels, set: (obj, value) => { obj.channels = value; } }, metadata: _metadata }, _channels_initializers, _channels_extraInitializers);
        __esDecorate(null, null, _allowStacking_decorators, { kind: "field", name: "allowStacking", static: false, private: false, access: { has: obj => "allowStacking" in obj, get: obj => obj.allowStacking, set: (obj, value) => { obj.allowStacking = value; } }, metadata: _metadata }, _allowStacking_initializers, _allowStacking_extraInitializers);
        __esDecorate(null, null, _combinationStrategy_decorators, { kind: "field", name: "combinationStrategy", static: false, private: false, access: { has: obj => "combinationStrategy" in obj, get: obj => obj.combinationStrategy, set: (obj, value) => { obj.combinationStrategy = value; } }, metadata: _metadata }, _combinationStrategy_initializers, _combinationStrategy_extraInitializers);
        __esDecorate(null, null, _customFields_decorators, { kind: "field", name: "customFields", static: false, private: false, access: { has: obj => "customFields" in obj, get: obj => obj.customFields, set: (obj, value) => { obj.customFields = value; } }, metadata: _metadata }, _customFields_initializers, _customFields_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PricingRule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PricingRule = _classThis;
})();
exports.PricingRule = PricingRule;
/**
 * Pricing matrix model for multi-dimensional pricing
 */
let PricingMatrix = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _matrixId_decorators;
    let _matrixId_initializers = [];
    let _matrixId_extraInitializers = [];
    let _matrixCode_decorators;
    let _matrixCode_initializers = [];
    let _matrixCode_extraInitializers = [];
    let _matrixName_decorators;
    let _matrixName_initializers = [];
    let _matrixName_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _dimensions_decorators;
    let _dimensions_initializers = [];
    let _dimensions_extraInitializers = [];
    let _cells_decorators;
    let _cells_initializers = [];
    let _cells_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _effectiveStartDate_decorators;
    let _effectiveStartDate_initializers = [];
    let _effectiveStartDate_extraInitializers = [];
    let _effectiveEndDate_decorators;
    let _effectiveEndDate_initializers = [];
    let _effectiveEndDate_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var PricingMatrix = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.matrixId = __runInitializers(this, _matrixId_initializers, void 0);
            this.matrixCode = (__runInitializers(this, _matrixId_extraInitializers), __runInitializers(this, _matrixCode_initializers, void 0));
            this.matrixName = (__runInitializers(this, _matrixCode_extraInitializers), __runInitializers(this, _matrixName_initializers, void 0));
            this.productId = (__runInitializers(this, _matrixName_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
            this.customerId = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.dimensions = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _dimensions_initializers, void 0));
            this.cells = (__runInitializers(this, _dimensions_extraInitializers), __runInitializers(this, _cells_initializers, void 0));
            this.isActive = (__runInitializers(this, _cells_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.effectiveStartDate = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _effectiveStartDate_initializers, void 0));
            this.effectiveEndDate = (__runInitializers(this, _effectiveStartDate_extraInitializers), __runInitializers(this, _effectiveEndDate_initializers, void 0));
            this.createdAt = (__runInitializers(this, _effectiveEndDate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PricingMatrix");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _matrixId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Pricing matrix ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _matrixCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Matrix code (unique)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                unique: true,
            })];
        _matrixName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Matrix name' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _dimensions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dimension definitions (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _cells_decorators = [(0, swagger_1.ApiProperty)({ description: 'Matrix cells (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            })];
        _effectiveStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective start date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _effectiveEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective end date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _matrixId_decorators, { kind: "field", name: "matrixId", static: false, private: false, access: { has: obj => "matrixId" in obj, get: obj => obj.matrixId, set: (obj, value) => { obj.matrixId = value; } }, metadata: _metadata }, _matrixId_initializers, _matrixId_extraInitializers);
        __esDecorate(null, null, _matrixCode_decorators, { kind: "field", name: "matrixCode", static: false, private: false, access: { has: obj => "matrixCode" in obj, get: obj => obj.matrixCode, set: (obj, value) => { obj.matrixCode = value; } }, metadata: _metadata }, _matrixCode_initializers, _matrixCode_extraInitializers);
        __esDecorate(null, null, _matrixName_decorators, { kind: "field", name: "matrixName", static: false, private: false, access: { has: obj => "matrixName" in obj, get: obj => obj.matrixName, set: (obj, value) => { obj.matrixName = value; } }, metadata: _metadata }, _matrixName_initializers, _matrixName_extraInitializers);
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _dimensions_decorators, { kind: "field", name: "dimensions", static: false, private: false, access: { has: obj => "dimensions" in obj, get: obj => obj.dimensions, set: (obj, value) => { obj.dimensions = value; } }, metadata: _metadata }, _dimensions_initializers, _dimensions_extraInitializers);
        __esDecorate(null, null, _cells_decorators, { kind: "field", name: "cells", static: false, private: false, access: { has: obj => "cells" in obj, get: obj => obj.cells, set: (obj, value) => { obj.cells = value; } }, metadata: _metadata }, _cells_initializers, _cells_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _effectiveStartDate_decorators, { kind: "field", name: "effectiveStartDate", static: false, private: false, access: { has: obj => "effectiveStartDate" in obj, get: obj => obj.effectiveStartDate, set: (obj, value) => { obj.effectiveStartDate = value; } }, metadata: _metadata }, _effectiveStartDate_initializers, _effectiveStartDate_extraInitializers);
        __esDecorate(null, null, _effectiveEndDate_decorators, { kind: "field", name: "effectiveEndDate", static: false, private: false, access: { has: obj => "effectiveEndDate" in obj, get: obj => obj.effectiveEndDate, set: (obj, value) => { obj.effectiveEndDate = value; } }, metadata: _metadata }, _effectiveEndDate_initializers, _effectiveEndDate_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PricingMatrix = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PricingMatrix = _classThis;
})();
exports.PricingMatrix = PricingMatrix;
/**
 * Quantity break pricing model
 */
let QuantityBreak = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _breakId_decorators;
    let _breakId_initializers = [];
    let _breakId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _tiers_decorators;
    let _tiers_initializers = [];
    let _tiers_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _effectiveStartDate_decorators;
    let _effectiveStartDate_initializers = [];
    let _effectiveStartDate_extraInitializers = [];
    let _effectiveEndDate_decorators;
    let _effectiveEndDate_initializers = [];
    let _effectiveEndDate_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var QuantityBreak = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.breakId = __runInitializers(this, _breakId_initializers, void 0);
            this.productId = (__runInitializers(this, _breakId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
            this.customerId = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.tiers = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _tiers_initializers, void 0));
            this.isActive = (__runInitializers(this, _tiers_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.effectiveStartDate = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _effectiveStartDate_initializers, void 0));
            this.effectiveEndDate = (__runInitializers(this, _effectiveStartDate_extraInitializers), __runInitializers(this, _effectiveEndDate_initializers, void 0));
            this.createdAt = (__runInitializers(this, _effectiveEndDate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "QuantityBreak");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _breakId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity break ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID (null = applies to all)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _tiers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity break tiers (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            })];
        _effectiveStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective start date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _effectiveEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective end date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _breakId_decorators, { kind: "field", name: "breakId", static: false, private: false, access: { has: obj => "breakId" in obj, get: obj => obj.breakId, set: (obj, value) => { obj.breakId = value; } }, metadata: _metadata }, _breakId_initializers, _breakId_extraInitializers);
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _tiers_decorators, { kind: "field", name: "tiers", static: false, private: false, access: { has: obj => "tiers" in obj, get: obj => obj.tiers, set: (obj, value) => { obj.tiers = value; } }, metadata: _metadata }, _tiers_initializers, _tiers_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _effectiveStartDate_decorators, { kind: "field", name: "effectiveStartDate", static: false, private: false, access: { has: obj => "effectiveStartDate" in obj, get: obj => obj.effectiveStartDate, set: (obj, value) => { obj.effectiveStartDate = value; } }, metadata: _metadata }, _effectiveStartDate_initializers, _effectiveStartDate_extraInitializers);
        __esDecorate(null, null, _effectiveEndDate_decorators, { kind: "field", name: "effectiveEndDate", static: false, private: false, access: { has: obj => "effectiveEndDate" in obj, get: obj => obj.effectiveEndDate, set: (obj, value) => { obj.effectiveEndDate = value; } }, metadata: _metadata }, _effectiveEndDate_initializers, _effectiveEndDate_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        QuantityBreak = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return QuantityBreak = _classThis;
})();
exports.QuantityBreak = QuantityBreak;
/**
 * Bundle pricing model
 */
let BundlePricing = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'bundle_pricing',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['bundleCode'] },
                { fields: ['isActive'] },
                { fields: ['effectiveStartDate', 'effectiveEndDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _bundleId_decorators;
    let _bundleId_initializers = [];
    let _bundleId_extraInitializers = [];
    let _bundleCode_decorators;
    let _bundleCode_initializers = [];
    let _bundleCode_extraInitializers = [];
    let _bundleName_decorators;
    let _bundleName_initializers = [];
    let _bundleName_extraInitializers = [];
    let _components_decorators;
    let _components_initializers = [];
    let _components_extraInitializers = [];
    let _bundlePrice_decorators;
    let _bundlePrice_initializers = [];
    let _bundlePrice_extraInitializers = [];
    let _discountPercent_decorators;
    let _discountPercent_initializers = [];
    let _discountPercent_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _effectiveStartDate_decorators;
    let _effectiveStartDate_initializers = [];
    let _effectiveStartDate_extraInitializers = [];
    let _effectiveEndDate_decorators;
    let _effectiveEndDate_initializers = [];
    let _effectiveEndDate_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var BundlePricing = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.bundleId = __runInitializers(this, _bundleId_initializers, void 0);
            this.bundleCode = (__runInitializers(this, _bundleId_extraInitializers), __runInitializers(this, _bundleCode_initializers, void 0));
            this.bundleName = (__runInitializers(this, _bundleCode_extraInitializers), __runInitializers(this, _bundleName_initializers, void 0));
            this.components = (__runInitializers(this, _bundleName_extraInitializers), __runInitializers(this, _components_initializers, void 0));
            this.bundlePrice = (__runInitializers(this, _components_extraInitializers), __runInitializers(this, _bundlePrice_initializers, void 0));
            this.discountPercent = (__runInitializers(this, _bundlePrice_extraInitializers), __runInitializers(this, _discountPercent_initializers, void 0));
            this.isActive = (__runInitializers(this, _discountPercent_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.effectiveStartDate = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _effectiveStartDate_initializers, void 0));
            this.effectiveEndDate = (__runInitializers(this, _effectiveStartDate_extraInitializers), __runInitializers(this, _effectiveEndDate_initializers, void 0));
            this.createdAt = (__runInitializers(this, _effectiveEndDate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "BundlePricing");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _bundleId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bundle ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _bundleCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bundle code (unique)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                unique: true,
            })];
        _bundleName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bundle name' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _components_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bundle components (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _bundlePrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bundle fixed price' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
            })];
        _discountPercent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount percent off component sum' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: true,
            })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            })];
        _effectiveStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective start date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _effectiveEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective end date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _bundleId_decorators, { kind: "field", name: "bundleId", static: false, private: false, access: { has: obj => "bundleId" in obj, get: obj => obj.bundleId, set: (obj, value) => { obj.bundleId = value; } }, metadata: _metadata }, _bundleId_initializers, _bundleId_extraInitializers);
        __esDecorate(null, null, _bundleCode_decorators, { kind: "field", name: "bundleCode", static: false, private: false, access: { has: obj => "bundleCode" in obj, get: obj => obj.bundleCode, set: (obj, value) => { obj.bundleCode = value; } }, metadata: _metadata }, _bundleCode_initializers, _bundleCode_extraInitializers);
        __esDecorate(null, null, _bundleName_decorators, { kind: "field", name: "bundleName", static: false, private: false, access: { has: obj => "bundleName" in obj, get: obj => obj.bundleName, set: (obj, value) => { obj.bundleName = value; } }, metadata: _metadata }, _bundleName_initializers, _bundleName_extraInitializers);
        __esDecorate(null, null, _components_decorators, { kind: "field", name: "components", static: false, private: false, access: { has: obj => "components" in obj, get: obj => obj.components, set: (obj, value) => { obj.components = value; } }, metadata: _metadata }, _components_initializers, _components_extraInitializers);
        __esDecorate(null, null, _bundlePrice_decorators, { kind: "field", name: "bundlePrice", static: false, private: false, access: { has: obj => "bundlePrice" in obj, get: obj => obj.bundlePrice, set: (obj, value) => { obj.bundlePrice = value; } }, metadata: _metadata }, _bundlePrice_initializers, _bundlePrice_extraInitializers);
        __esDecorate(null, null, _discountPercent_decorators, { kind: "field", name: "discountPercent", static: false, private: false, access: { has: obj => "discountPercent" in obj, get: obj => obj.discountPercent, set: (obj, value) => { obj.discountPercent = value; } }, metadata: _metadata }, _discountPercent_initializers, _discountPercent_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _effectiveStartDate_decorators, { kind: "field", name: "effectiveStartDate", static: false, private: false, access: { has: obj => "effectiveStartDate" in obj, get: obj => obj.effectiveStartDate, set: (obj, value) => { obj.effectiveStartDate = value; } }, metadata: _metadata }, _effectiveStartDate_initializers, _effectiveStartDate_extraInitializers);
        __esDecorate(null, null, _effectiveEndDate_decorators, { kind: "field", name: "effectiveEndDate", static: false, private: false, access: { has: obj => "effectiveEndDate" in obj, get: obj => obj.effectiveEndDate, set: (obj, value) => { obj.effectiveEndDate = value; } }, metadata: _metadata }, _effectiveEndDate_initializers, _effectiveEndDate_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BundlePricing = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BundlePricing = _classThis;
})();
exports.BundlePricing = BundlePricing;
/**
 * Customer-specific pricing model
 */
let CustomerPricing = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _customerPricingId_decorators;
    let _customerPricingId_initializers = [];
    let _customerPricingId_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _price_decorators;
    let _price_initializers = [];
    let _price_extraInitializers = [];
    let _discountPercent_decorators;
    let _discountPercent_initializers = [];
    let _discountPercent_extraInitializers = [];
    let _minOrderQuantity_decorators;
    let _minOrderQuantity_initializers = [];
    let _minOrderQuantity_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _effectiveStartDate_decorators;
    let _effectiveStartDate_initializers = [];
    let _effectiveStartDate_extraInitializers = [];
    let _effectiveEndDate_decorators;
    let _effectiveEndDate_initializers = [];
    let _effectiveEndDate_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var CustomerPricing = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.customerPricingId = __runInitializers(this, _customerPricingId_initializers, void 0);
            this.customerId = (__runInitializers(this, _customerPricingId_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.productId = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
            this.price = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _price_initializers, void 0));
            this.discountPercent = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _discountPercent_initializers, void 0));
            this.minOrderQuantity = (__runInitializers(this, _discountPercent_extraInitializers), __runInitializers(this, _minOrderQuantity_initializers, void 0));
            this.isActive = (__runInitializers(this, _minOrderQuantity_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.effectiveStartDate = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _effectiveStartDate_initializers, void 0));
            this.effectiveEndDate = (__runInitializers(this, _effectiveStartDate_extraInitializers), __runInitializers(this, _effectiveEndDate_initializers, void 0));
            this.createdAt = (__runInitializers(this, _effectiveEndDate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CustomerPricing");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _customerPricingId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer pricing ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _price_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer-specific price' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _discountPercent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount percent' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: true,
            })];
        _minOrderQuantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minimum order quantity' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
            })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            })];
        _effectiveStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective start date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _effectiveEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective end date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _customerPricingId_decorators, { kind: "field", name: "customerPricingId", static: false, private: false, access: { has: obj => "customerPricingId" in obj, get: obj => obj.customerPricingId, set: (obj, value) => { obj.customerPricingId = value; } }, metadata: _metadata }, _customerPricingId_initializers, _customerPricingId_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: obj => "price" in obj, get: obj => obj.price, set: (obj, value) => { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
        __esDecorate(null, null, _discountPercent_decorators, { kind: "field", name: "discountPercent", static: false, private: false, access: { has: obj => "discountPercent" in obj, get: obj => obj.discountPercent, set: (obj, value) => { obj.discountPercent = value; } }, metadata: _metadata }, _discountPercent_initializers, _discountPercent_extraInitializers);
        __esDecorate(null, null, _minOrderQuantity_decorators, { kind: "field", name: "minOrderQuantity", static: false, private: false, access: { has: obj => "minOrderQuantity" in obj, get: obj => obj.minOrderQuantity, set: (obj, value) => { obj.minOrderQuantity = value; } }, metadata: _metadata }, _minOrderQuantity_initializers, _minOrderQuantity_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _effectiveStartDate_decorators, { kind: "field", name: "effectiveStartDate", static: false, private: false, access: { has: obj => "effectiveStartDate" in obj, get: obj => obj.effectiveStartDate, set: (obj, value) => { obj.effectiveStartDate = value; } }, metadata: _metadata }, _effectiveStartDate_initializers, _effectiveStartDate_extraInitializers);
        __esDecorate(null, null, _effectiveEndDate_decorators, { kind: "field", name: "effectiveEndDate", static: false, private: false, access: { has: obj => "effectiveEndDate" in obj, get: obj => obj.effectiveEndDate, set: (obj, value) => { obj.effectiveEndDate = value; } }, metadata: _metadata }, _effectiveEndDate_initializers, _effectiveEndDate_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CustomerPricing = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CustomerPricing = _classThis;
})();
exports.CustomerPricing = CustomerPricing;
/**
 * Contract pricing model
 */
let ContractPricing = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
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
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _contractPricingId_decorators;
    let _contractPricingId_initializers = [];
    let _contractPricingId_extraInitializers = [];
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _contractPrice_decorators;
    let _contractPrice_initializers = [];
    let _contractPrice_extraInitializers = [];
    let _minCommitmentQuantity_decorators;
    let _minCommitmentQuantity_initializers = [];
    let _minCommitmentQuantity_extraInitializers = [];
    let _maxCommitmentQuantity_decorators;
    let _maxCommitmentQuantity_initializers = [];
    let _maxCommitmentQuantity_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _effectiveStartDate_decorators;
    let _effectiveStartDate_initializers = [];
    let _effectiveStartDate_extraInitializers = [];
    let _effectiveEndDate_decorators;
    let _effectiveEndDate_initializers = [];
    let _effectiveEndDate_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var ContractPricing = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.contractPricingId = __runInitializers(this, _contractPricingId_initializers, void 0);
            this.contractId = (__runInitializers(this, _contractPricingId_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
            this.customerId = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.productId = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
            this.contractPrice = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _contractPrice_initializers, void 0));
            this.minCommitmentQuantity = (__runInitializers(this, _contractPrice_extraInitializers), __runInitializers(this, _minCommitmentQuantity_initializers, void 0));
            this.maxCommitmentQuantity = (__runInitializers(this, _minCommitmentQuantity_extraInitializers), __runInitializers(this, _maxCommitmentQuantity_initializers, void 0));
            this.isActive = (__runInitializers(this, _maxCommitmentQuantity_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.effectiveStartDate = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _effectiveStartDate_initializers, void 0));
            this.effectiveEndDate = (__runInitializers(this, _effectiveStartDate_extraInitializers), __runInitializers(this, _effectiveEndDate_initializers, void 0));
            this.createdAt = (__runInitializers(this, _effectiveEndDate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ContractPricing");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _contractPricingId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract pricing ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _contractId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _contractPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract price' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _minCommitmentQuantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minimum commitment quantity' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
            })];
        _maxCommitmentQuantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maximum commitment quantity' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
            })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            })];
        _effectiveStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract start date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _effectiveEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract end date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _contractPricingId_decorators, { kind: "field", name: "contractPricingId", static: false, private: false, access: { has: obj => "contractPricingId" in obj, get: obj => obj.contractPricingId, set: (obj, value) => { obj.contractPricingId = value; } }, metadata: _metadata }, _contractPricingId_initializers, _contractPricingId_extraInitializers);
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _contractPrice_decorators, { kind: "field", name: "contractPrice", static: false, private: false, access: { has: obj => "contractPrice" in obj, get: obj => obj.contractPrice, set: (obj, value) => { obj.contractPrice = value; } }, metadata: _metadata }, _contractPrice_initializers, _contractPrice_extraInitializers);
        __esDecorate(null, null, _minCommitmentQuantity_decorators, { kind: "field", name: "minCommitmentQuantity", static: false, private: false, access: { has: obj => "minCommitmentQuantity" in obj, get: obj => obj.minCommitmentQuantity, set: (obj, value) => { obj.minCommitmentQuantity = value; } }, metadata: _metadata }, _minCommitmentQuantity_initializers, _minCommitmentQuantity_extraInitializers);
        __esDecorate(null, null, _maxCommitmentQuantity_decorators, { kind: "field", name: "maxCommitmentQuantity", static: false, private: false, access: { has: obj => "maxCommitmentQuantity" in obj, get: obj => obj.maxCommitmentQuantity, set: (obj, value) => { obj.maxCommitmentQuantity = value; } }, metadata: _metadata }, _maxCommitmentQuantity_initializers, _maxCommitmentQuantity_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _effectiveStartDate_decorators, { kind: "field", name: "effectiveStartDate", static: false, private: false, access: { has: obj => "effectiveStartDate" in obj, get: obj => obj.effectiveStartDate, set: (obj, value) => { obj.effectiveStartDate = value; } }, metadata: _metadata }, _effectiveStartDate_initializers, _effectiveStartDate_extraInitializers);
        __esDecorate(null, null, _effectiveEndDate_decorators, { kind: "field", name: "effectiveEndDate", static: false, private: false, access: { has: obj => "effectiveEndDate" in obj, get: obj => obj.effectiveEndDate, set: (obj, value) => { obj.effectiveEndDate = value; } }, metadata: _metadata }, _effectiveEndDate_initializers, _effectiveEndDate_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractPricing = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractPricing = _classThis;
})();
exports.ContractPricing = ContractPricing;
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
async function executePricingRuleEngine(context, basePrice, combinationStrategy = RuleCombinationStrategy.HIGHEST_PRIORITY) {
    try {
        const now = new Date();
        // Find all applicable active rules
        const applicableRules = await PricingRule.findAll({
            where: {
                status: PricingRuleStatus.ACTIVE,
                [sequelize_1.Op.or]: [
                    { effectiveStartDate: { [sequelize_1.Op.lte]: now }, effectiveEndDate: { [sequelize_1.Op.gte]: now } },
                    { effectiveStartDate: { [sequelize_1.Op.lte]: now }, effectiveEndDate: null },
                    { effectiveStartDate: null },
                ],
            },
            order: [['precedence', 'DESC']],
        });
        // Filter rules by context matching
        const matchingRules = applicableRules.filter(rule => evaluateRuleApplicability(rule, context));
        // Evaluate each matching rule
        const ruleResults = [];
        let currentPrice = basePrice;
        for (const rule of matchingRules) {
            const result = await evaluatePricingRule(rule, context, currentPrice, basePrice);
            if (result.applied) {
                ruleResults.push(result);
                // Update current price based on combination strategy
                if (combinationStrategy === RuleCombinationStrategy.FIRST_MATCH) {
                    currentPrice = result.adjustedPrice;
                    break;
                }
                else if (combinationStrategy === RuleCombinationStrategy.HIGHEST_PRIORITY) {
                    currentPrice = result.adjustedPrice;
                    break;
                }
                else if (combinationStrategy === RuleCombinationStrategy.ADDITIVE ||
                    combinationStrategy === RuleCombinationStrategy.MULTIPLICATIVE) {
                    currentPrice = result.adjustedPrice;
                }
            }
        }
        // Apply combination strategy
        const finalPrice = applyCombinationStrategy(basePrice, ruleResults, combinationStrategy);
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to execute pricing rule engine: ${error.message}`);
    }
}
/**
 * Evaluate if a pricing rule applies to the given context
 *
 * @param rule - Pricing rule to evaluate
 * @param context - Pricing context
 * @returns True if rule applies
 */
function evaluateRuleApplicability(rule, context) {
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
    }
    catch (error) {
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
function evaluateRuleConditions(conditions, context) {
    if (!conditions || conditions.length === 0) {
        return true;
    }
    let result = true;
    let currentLogic = LogicalOperator.AND;
    for (const condition of conditions) {
        const conditionResult = evaluateSingleCondition(condition, context);
        // Handle nested conditions
        if (condition.nestedConditions && condition.nestedConditions.length > 0) {
            const nestedResult = evaluateRuleConditions(condition.nestedConditions, context);
            if (currentLogic === LogicalOperator.AND) {
                result = result && nestedResult;
            }
            else if (currentLogic === LogicalOperator.OR) {
                result = result || nestedResult;
            }
            else if (currentLogic === LogicalOperator.NOT) {
                result = result && !nestedResult;
            }
        }
        else {
            // Handle simple condition
            if (currentLogic === LogicalOperator.AND) {
                result = result && conditionResult;
            }
            else if (currentLogic === LogicalOperator.OR) {
                result = result || conditionResult;
            }
            else if (currentLogic === LogicalOperator.NOT) {
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
function evaluateSingleCondition(condition, context) {
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
function getContextValue(field, context) {
    const parts = field.split('.');
    let value = context;
    for (const part of parts) {
        if (value && typeof value === 'object' && part in value) {
            value = value[part];
        }
        else {
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
async function evaluatePricingRule(rule, context, currentPrice, basePrice) {
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
    }
    catch (error) {
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
function evaluatePricingFormula(formula, context, currentPrice) {
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
    }
    catch (error) {
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
function applyCombinationStrategy(basePrice, results, strategy) {
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
async function calculateQuantityBreakPricing(productId, customerId, quantity, basePrice) {
    try {
        const now = new Date();
        // Find applicable quantity breaks (customer-specific first, then general)
        const breaks = await QuantityBreak.findAll({
            where: {
                productId,
                isActive: true,
                [sequelize_1.Op.or]: [
                    { customerId },
                    { customerId: null },
                ],
                [sequelize_1.Op.or]: [
                    { effectiveStartDate: { [sequelize_1.Op.lte]: now }, effectiveEndDate: { [sequelize_1.Op.gte]: now } },
                    { effectiveStartDate: { [sequelize_1.Op.lte]: now }, effectiveEndDate: null },
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
        }
        else if (tier.discountPercent) {
            return basePrice * (1 - tier.discountPercent / 100);
        }
        else if (tier.discountAmount) {
            return basePrice - tier.discountAmount;
        }
        return basePrice;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate quantity break pricing: ${error.message}`);
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
async function calculateBundlePricing(bundleCode, componentPrices) {
    try {
        const now = new Date();
        const bundle = await BundlePricing.findOne({
            where: {
                bundleCode,
                isActive: true,
                [sequelize_1.Op.or]: [
                    { effectiveStartDate: { [sequelize_1.Op.lte]: now }, effectiveEndDate: { [sequelize_1.Op.gte]: now } },
                    { effectiveStartDate: { [sequelize_1.Op.lte]: now }, effectiveEndDate: null },
                    { effectiveStartDate: null },
                ],
            },
        });
        if (!bundle) {
            throw new common_1.NotFoundException(`Bundle not found: ${bundleCode}`);
        }
        // Calculate component total
        let componentTotal = 0;
        for (const component of bundle.components) {
            const price = componentPrices[component.productId];
            if (!price && component.isRequired) {
                throw new common_1.BadRequestException(`Missing price for required component: ${component.productId}`);
            }
            componentTotal += (price || 0) * component.quantity;
        }
        // Calculate bundle price
        let bundlePrice = componentTotal;
        if (bundle.bundlePrice) {
            bundlePrice = bundle.bundlePrice;
        }
        else if (bundle.discountPercent) {
            bundlePrice = componentTotal * (1 - bundle.discountPercent / 100);
        }
        const savings = componentTotal - bundlePrice;
        return {
            bundlePrice,
            savings,
            componentTotal,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate bundle pricing: ${error.message}`);
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
async function getCustomerSpecificPrice(customerId, productId) {
    try {
        const now = new Date();
        const pricing = await CustomerPricing.findOne({
            where: {
                customerId,
                productId,
                isActive: true,
                [sequelize_1.Op.or]: [
                    { effectiveStartDate: { [sequelize_1.Op.lte]: now }, effectiveEndDate: { [sequelize_1.Op.gte]: now } },
                    { effectiveStartDate: { [sequelize_1.Op.lte]: now }, effectiveEndDate: null },
                    { effectiveStartDate: null },
                ],
            },
        });
        return pricing ? pricing.price : null;
    }
    catch (error) {
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
async function getContractPrice(contractId, productId) {
    try {
        const now = new Date();
        const pricing = await ContractPricing.findOne({
            where: {
                contractId,
                productId,
                isActive: true,
                effectiveStartDate: { [sequelize_1.Op.lte]: now },
                effectiveEndDate: { [sequelize_1.Op.gte]: now },
            },
        });
        return pricing ? pricing.contractPrice : null;
    }
    catch (error) {
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
async function lookupPricingMatrix(matrixCode, dimensions) {
    try {
        const now = new Date();
        const matrix = await PricingMatrix.findOne({
            where: {
                matrixCode,
                isActive: true,
                [sequelize_1.Op.or]: [
                    { effectiveStartDate: { [sequelize_1.Op.lte]: now }, effectiveEndDate: { [sequelize_1.Op.gte]: now } },
                    { effectiveStartDate: { [sequelize_1.Op.lte]: now }, effectiveEndDate: null },
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
                return c.dimensions.some(cellDim => cellDim.dimension === dim.dimension && cellDim.value === dim.value);
            });
        });
        return cell ? cell.price : null;
    }
    catch (error) {
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
async function createPricingRule(ruleData, userId) {
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create pricing rule: ${error.message}`);
    }
}
/**
 * Generate unique pricing rule code
 *
 * @param ruleType - Rule type
 * @returns Generated rule code
 */
async function generatePricingRuleCode(ruleType) {
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
async function activatePricingRule(ruleId, userId) {
    try {
        const rule = await PricingRule.findByPk(ruleId);
        if (!rule) {
            throw new common_1.NotFoundException(`Pricing rule not found: ${ruleId}`);
        }
        rule.status = PricingRuleStatus.ACTIVE;
        rule.updatedBy = userId;
        await rule.save();
        return rule;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to activate pricing rule: ${error.message}`);
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
async function deactivatePricingRule(ruleId, userId) {
    try {
        const rule = await PricingRule.findByPk(ruleId);
        if (!rule) {
            throw new common_1.NotFoundException(`Pricing rule not found: ${ruleId}`);
        }
        rule.status = PricingRuleStatus.INACTIVE;
        rule.updatedBy = userId;
        await rule.save();
        return rule;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to deactivate pricing rule: ${error.message}`);
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
async function getPricingRulesForProduct(productId, includeInactive = false) {
    try {
        const whereClause = {
            [sequelize_1.Op.or]: [
                { productIds: { [sequelize_1.Op.contains]: [productId] } },
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to get pricing rules: ${error.message}`);
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
async function getPricingRulesForCustomer(customerId, includeInactive = false) {
    try {
        const whereClause = {
            [sequelize_1.Op.or]: [
                { customerIds: { [sequelize_1.Op.contains]: [customerId] } },
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to get pricing rules: ${error.message}`);
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
function calculateTieredPricing(customerTier, basePrice, tierDiscounts) {
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
function calculateChannelPricing(channel, basePrice, channelMarkups) {
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
function calculateGeographicPricing(region, state, basePrice, regionalAdjustments) {
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
function calculateSeasonalPricing(season, basePrice, seasonalDiscounts) {
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
function getCurrentSeason(date = new Date()) {
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
async function createQuantityBreak(breakData) {
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create quantity break: ${error.message}`);
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
async function createBundlePricing(bundleData) {
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create bundle pricing: ${error.message}`);
    }
}
/**
 * Generate unique bundle code
 *
 * @returns Generated bundle code
 */
async function generateBundleCode() {
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
async function generateCrossSellRecommendations(productId, context) {
    try {
        // In production, this would query a cross-sell rules table
        // For now, return a mock structure
        const recommendations = [];
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
    }
    catch (error) {
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
async function generateUpSellRecommendations(productId, context) {
    try {
        // In production, this would query an up-sell rules table
        // For now, return a mock structure
        const recommendations = [];
        return recommendations;
    }
    catch (error) {
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
async function validatePricingRuleConflicts(ruleData) {
    try {
        const conflicts = [];
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
                const hasDateOverlap = (!rule.effectiveEndDate || ruleData.effectiveStartDate <= rule.effectiveEndDate) &&
                    (!rule.effectiveStartDate || ruleData.effectiveEndDate >= rule.effectiveStartDate);
                if (hasDateOverlap) {
                    // Check for product/customer overlaps
                    const hasProductOverlap = !ruleData.productIds || !rule.productIds ||
                        ruleData.productIds.some(p => rule.productIds.includes(p));
                    const hasCustomerOverlap = !ruleData.customerIds || !rule.customerIds ||
                        ruleData.customerIds.some(c => rule.customerIds.includes(c));
                    if (hasProductOverlap && hasCustomerOverlap) {
                        conflicts.push(`Conflicts with rule ${rule.ruleCode} (${rule.ruleName}) - same precedence and overlapping scope`);
                    }
                }
            }
        }
        return {
            isValid: conflicts.length === 0,
            conflicts,
        };
    }
    catch (error) {
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
async function testPricingRule(ruleId, testContext, testPrice) {
    try {
        const rule = await PricingRule.findByPk(ruleId);
        if (!rule) {
            throw new common_1.NotFoundException(`Pricing rule not found: ${ruleId}`);
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to test pricing rule: ${error.message}`);
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
async function clonePricingRule(ruleId, newRuleName, userId) {
    try {
        const sourceRule = await PricingRule.findByPk(ruleId);
        if (!sourceRule) {
            throw new common_1.NotFoundException(`Pricing rule not found: ${ruleId}`);
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to clone pricing rule: ${error.message}`);
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
async function bulkActivatePricingRules(ruleIds, userId) {
    try {
        const [count] = await PricingRule.update({
            status: PricingRuleStatus.ACTIVE,
            updatedBy: userId,
        }, {
            where: {
                ruleId: { [sequelize_1.Op.in]: ruleIds },
            },
        });
        return count;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to bulk activate pricing rules: ${error.message}`);
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
async function bulkDeactivatePricingRules(ruleIds, userId) {
    try {
        const [count] = await PricingRule.update({
            status: PricingRuleStatus.INACTIVE,
            updatedBy: userId,
        }, {
            where: {
                ruleId: { [sequelize_1.Op.in]: ruleIds },
            },
        });
        return count;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to bulk deactivate pricing rules: ${error.message}`);
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
function calculateVolumePricing(quantity, basePrice, volumeTiers) {
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
async function calculatePromotionalPricing(basePrice, promoCode, context) {
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
    }
    catch (error) {
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
async function getPricingHistory(productId, startDate, endDate) {
    try {
        // In production, this would query a pricing history table
        // For now, return mock structure
        return [];
    }
    catch (error) {
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
function calculateCostPlusPricing(costPrice, markupPercent, minMargin) {
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
function applyPricingRoundingRule(price, roundingRule) {
    const parts = roundingRule.split('_');
    const direction = parts[0]; // UP, DOWN, NEAREST
    const target = parseFloat(parts[1]); // 0.99, 0.95, 0.50, etc.
    const wholePart = Math.floor(price);
    const decimalPart = price - wholePart;
    if (direction === 'UP') {
        return wholePart + target;
    }
    else if (direction === 'DOWN') {
        return wholePart + target;
    }
    else if (direction === 'NEAREST') {
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
function calculateCompetitivePricing(basePrice, competitorPrices, strategy, adjustment = 0) {
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
async function exportPricingRules(filters) {
    try {
        const whereClause = {};
        if (filters?.ruleType) {
            whereClause.ruleType = filters.ruleType;
        }
        if (filters?.status) {
            whereClause.status = filters.status;
        }
        const rules = await PricingRule.findAll({ where: whereClause });
        return JSON.stringify(rules, null, 2);
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to export pricing rules: ${error.message}`);
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
async function importPricingRules(jsonData, userId) {
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
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to import pricing rules: ${error.message}`);
    }
}
//# sourceMappingURL=pricing-rules-conditions-kit.js.map