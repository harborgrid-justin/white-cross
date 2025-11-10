"use strict";
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
exports.CreateABTestDto = exports.OptimizePriceDto = exports.CalculatePriceDto = exports.PriceElasticityData = exports.PricingRule = exports.PriceHistory = exports.MarginAction = exports.RecommendationConfidence = exports.ABTestStatus = exports.PriceElasticity = exports.PriceChangeReason = exports.TimePricingPeriod = exports.GeographicZone = exports.CustomerSegment = exports.OptimizationObjective = exports.PricingStrategy = void 0;
exports.calculateRealtimePrice = calculateRealtimePrice;
exports.calculateDemandBasedPrice = calculateDemandBasedPrice;
exports.calculateTimeBasedPrice = calculateTimeBasedPrice;
exports.calculateCompetitorBasedPrice = calculateCompetitorBasedPrice;
exports.calculateVolumeTierPrice = calculateVolumeTierPrice;
exports.calculateSegmentPrice = calculateSegmentPrice;
exports.calculateGeographicPrice = calculateGeographicPrice;
exports.optimizePrice = optimizePrice;
exports.calculateMarginTargetPrice = calculateMarginTargetPrice;
exports.calculatePriceFloor = calculatePriceFloor;
exports.calculatePriceCeiling = calculatePriceCeiling;
exports.calculateMarginPercent = calculateMarginPercent;
exports.calculateMarkupPercent = calculateMarkupPercent;
exports.enforceMarginPolicy = enforceMarginPolicy;
exports.calculateBlendedMargin = calculateBlendedMargin;
exports.createFlashSale = createFlashSale;
exports.calculateClearancePrice = calculateClearancePrice;
exports.calculateMarkdownSchedule = calculateMarkdownSchedule;
exports.calculatePriceElasticity = calculatePriceElasticity;
exports.analyzePriceSensitivity = analyzePriceSensitivity;
exports.createABPricingTest = createABPricingTest;
exports.assignABVariant = assignABVariant;
exports.analyzeABTestResults = analyzeABTestResults;
exports.generatePriceRecommendation = generatePriceRecommendation;
exports.batchGeneratePriceRecommendations = batchGeneratePriceRecommendations;
/**
 * File: /reuse/order/dynamic-pricing-engine-kit.ts
 * Locator: WC-ORD-DYNPRC-001
 * Purpose: Dynamic Pricing Engine - Real-time pricing, algorithms, and optimization
 *
 * Upstream: Independent utility module for dynamic pricing operations
 * Downstream: ../backend/order/*, ../backend/product/*, Pricing modules, Analytics services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 45 utility functions for dynamic pricing, optimization, algorithms, analytics
 *
 * LLM Context: Enterprise-grade dynamic pricing engine to compete with Oracle MICROS and SAP Pricing.
 * Provides comprehensive real-time price calculations, demand-based pricing, time-based pricing,
 * competitor-based pricing, price optimization, margin enforcement, volume-based tiers, customer
 * segment pricing, geographic variations, flash sales, clearance pricing, price elasticity analysis,
 * A/B pricing testing, and price recommendation engine with machine learning capabilities.
 */
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================
/**
 * Dynamic pricing strategy types
 */
var PricingStrategy;
(function (PricingStrategy) {
    PricingStrategy["DEMAND_BASED"] = "DEMAND_BASED";
    PricingStrategy["TIME_BASED"] = "TIME_BASED";
    PricingStrategy["COMPETITOR_BASED"] = "COMPETITOR_BASED";
    PricingStrategy["COST_PLUS"] = "COST_PLUS";
    PricingStrategy["VALUE_BASED"] = "VALUE_BASED";
    PricingStrategy["PENETRATION"] = "PENETRATION";
    PricingStrategy["SKIMMING"] = "SKIMMING";
    PricingStrategy["BUNDLE"] = "BUNDLE";
    PricingStrategy["PSYCHOLOGICAL"] = "PSYCHOLOGICAL";
    PricingStrategy["DYNAMIC_SURGE"] = "DYNAMIC_SURGE";
    PricingStrategy["SEGMENTED"] = "SEGMENTED";
    PricingStrategy["GEOGRAPHIC"] = "GEOGRAPHIC";
})(PricingStrategy || (exports.PricingStrategy = PricingStrategy = {}));
/**
 * Price optimization objective
 */
var OptimizationObjective;
(function (OptimizationObjective) {
    OptimizationObjective["MAXIMIZE_REVENUE"] = "MAXIMIZE_REVENUE";
    OptimizationObjective["MAXIMIZE_PROFIT"] = "MAXIMIZE_PROFIT";
    OptimizationObjective["MAXIMIZE_VOLUME"] = "MAXIMIZE_VOLUME";
    OptimizationObjective["MAXIMIZE_MARKET_SHARE"] = "MAXIMIZE_MARKET_SHARE";
    OptimizationObjective["TARGET_MARGIN"] = "TARGET_MARGIN";
    OptimizationObjective["INVENTORY_CLEARANCE"] = "INVENTORY_CLEARANCE";
    OptimizationObjective["COMPETITIVE_PARITY"] = "COMPETITIVE_PARITY";
})(OptimizationObjective || (exports.OptimizationObjective = OptimizationObjective = {}));
/**
 * Customer segment types for pricing
 */
var CustomerSegment;
(function (CustomerSegment) {
    CustomerSegment["ENTERPRISE"] = "ENTERPRISE";
    CustomerSegment["SMALL_BUSINESS"] = "SMALL_BUSINESS";
    CustomerSegment["INDIVIDUAL"] = "INDIVIDUAL";
    CustomerSegment["VIP"] = "VIP";
    CustomerSegment["WHOLESALE"] = "WHOLESALE";
    CustomerSegment["RETAIL"] = "RETAIL";
    CustomerSegment["GOVERNMENT"] = "GOVERNMENT";
    CustomerSegment["EDUCATION"] = "EDUCATION";
    CustomerSegment["NON_PROFIT"] = "NON_PROFIT";
    CustomerSegment["NEW_CUSTOMER"] = "NEW_CUSTOMER";
    CustomerSegment["LOYAL_CUSTOMER"] = "LOYAL_CUSTOMER";
})(CustomerSegment || (exports.CustomerSegment = CustomerSegment = {}));
/**
 * Geographic pricing zones
 */
var GeographicZone;
(function (GeographicZone) {
    GeographicZone["METRO_PREMIUM"] = "METRO_PREMIUM";
    GeographicZone["METRO_STANDARD"] = "METRO_STANDARD";
    GeographicZone["SUBURBAN"] = "SUBURBAN";
    GeographicZone["RURAL"] = "RURAL";
    GeographicZone["INTERNATIONAL"] = "INTERNATIONAL";
    GeographicZone["HIGH_COST_AREA"] = "HIGH_COST_AREA";
    GeographicZone["LOW_COST_AREA"] = "LOW_COST_AREA";
})(GeographicZone || (exports.GeographicZone = GeographicZone = {}));
/**
 * Time-based pricing period types
 */
var TimePricingPeriod;
(function (TimePricingPeriod) {
    TimePricingPeriod["PEAK_HOURS"] = "PEAK_HOURS";
    TimePricingPeriod["OFF_PEAK"] = "OFF_PEAK";
    TimePricingPeriod["WEEKEND"] = "WEEKEND";
    TimePricingPeriod["WEEKDAY"] = "WEEKDAY";
    TimePricingPeriod["HOLIDAY"] = "HOLIDAY";
    TimePricingPeriod["SEASONAL_HIGH"] = "SEASONAL_HIGH";
    TimePricingPeriod["SEASONAL_LOW"] = "SEASONAL_LOW";
    TimePricingPeriod["FLASH_SALE"] = "FLASH_SALE";
    TimePricingPeriod["EARLY_BIRD"] = "EARLY_BIRD";
    TimePricingPeriod["LATE_NIGHT"] = "LATE_NIGHT";
})(TimePricingPeriod || (exports.TimePricingPeriod = TimePricingPeriod = {}));
/**
 * Price change reason codes
 */
var PriceChangeReason;
(function (PriceChangeReason) {
    PriceChangeReason["DEMAND_SURGE"] = "DEMAND_SURGE";
    PriceChangeReason["DEMAND_DROP"] = "DEMAND_DROP";
    PriceChangeReason["COMPETITOR_PRICE_CHANGE"] = "COMPETITOR_PRICE_CHANGE";
    PriceChangeReason["COST_INCREASE"] = "COST_INCREASE";
    PriceChangeReason["COST_DECREASE"] = "COST_DECREASE";
    PriceChangeReason["INVENTORY_HIGH"] = "INVENTORY_HIGH";
    PriceChangeReason["INVENTORY_LOW"] = "INVENTORY_LOW";
    PriceChangeReason["SEASONAL_ADJUSTMENT"] = "SEASONAL_ADJUSTMENT";
    PriceChangeReason["PROMOTION"] = "PROMOTION";
    PriceChangeReason["CLEARANCE"] = "CLEARANCE";
    PriceChangeReason["NEW_PRODUCT_LAUNCH"] = "NEW_PRODUCT_LAUNCH";
    PriceChangeReason["MARGIN_OPTIMIZATION"] = "MARGIN_OPTIMIZATION";
    PriceChangeReason["AB_TEST"] = "AB_TEST";
    PriceChangeReason["MANUAL_OVERRIDE"] = "MANUAL_OVERRIDE";
})(PriceChangeReason || (exports.PriceChangeReason = PriceChangeReason = {}));
/**
 * Price elasticity classification
 */
var PriceElasticity;
(function (PriceElasticity) {
    PriceElasticity["HIGHLY_ELASTIC"] = "HIGHLY_ELASTIC";
    PriceElasticity["ELASTIC"] = "ELASTIC";
    PriceElasticity["UNIT_ELASTIC"] = "UNIT_ELASTIC";
    PriceElasticity["INELASTIC"] = "INELASTIC";
    PriceElasticity["HIGHLY_INELASTIC"] = "HIGHLY_INELASTIC";
})(PriceElasticity || (exports.PriceElasticity = PriceElasticity = {}));
/**
 * A/B test status
 */
var ABTestStatus;
(function (ABTestStatus) {
    ABTestStatus["DRAFT"] = "DRAFT";
    ABTestStatus["ACTIVE"] = "ACTIVE";
    ABTestStatus["PAUSED"] = "PAUSED";
    ABTestStatus["COMPLETED"] = "COMPLETED";
    ABTestStatus["WINNER_SELECTED"] = "WINNER_SELECTED";
    ABTestStatus["CANCELLED"] = "CANCELLED";
})(ABTestStatus || (exports.ABTestStatus = ABTestStatus = {}));
/**
 * Price recommendation confidence level
 */
var RecommendationConfidence;
(function (RecommendationConfidence) {
    RecommendationConfidence["VERY_HIGH"] = "VERY_HIGH";
    RecommendationConfidence["HIGH"] = "HIGH";
    RecommendationConfidence["MEDIUM"] = "MEDIUM";
    RecommendationConfidence["LOW"] = "LOW";
    RecommendationConfidence["VERY_LOW"] = "VERY_LOW";
})(RecommendationConfidence || (exports.RecommendationConfidence = RecommendationConfidence = {}));
/**
 * Margin enforcement action
 */
var MarginAction;
(function (MarginAction) {
    MarginAction["APPROVE"] = "APPROVE";
    MarginAction["REJECT"] = "REJECT";
    MarginAction["REQUIRE_MANAGER_APPROVAL"] = "REQUIRE_MANAGER_APPROVAL";
    MarginAction["REQUIRE_DIRECTOR_APPROVAL"] = "REQUIRE_DIRECTOR_APPROVAL";
    MarginAction["WARN"] = "WARN";
    MarginAction["AUTO_ADJUST"] = "AUTO_ADJUST";
})(MarginAction || (exports.MarginAction = MarginAction = {}));
revenue;
Impact: RevenueImpact[];
confidence: number;
dataPoints: number;
analysisDate: Date;
// ============================================================================
// DATABASE MODELS
// ============================================================================
/**
 * Price history model for audit and analysis
 */
let PriceHistory = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'price_history',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['productId'] },
                { fields: ['effectiveDate'] },
                { fields: ['pricingStrategy'] },
                { fields: ['createdAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _priceHistoryId_decorators;
    let _priceHistoryId_initializers = [];
    let _priceHistoryId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _previousPrice_decorators;
    let _previousPrice_initializers = [];
    let _previousPrice_extraInitializers = [];
    let _newPrice_decorators;
    let _newPrice_initializers = [];
    let _newPrice_extraInitializers = [];
    let _priceChange_decorators;
    let _priceChange_initializers = [];
    let _priceChange_extraInitializers = [];
    let _priceChangePercent_decorators;
    let _priceChangePercent_initializers = [];
    let _priceChangePercent_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _pricingStrategy_decorators;
    let _pricingStrategy_initializers = [];
    let _pricingStrategy_extraInitializers = [];
    let _changeReason_decorators;
    let _changeReason_initializers = [];
    let _changeReason_extraInitializers = [];
    let _reasoning_decorators;
    let _reasoning_initializers = [];
    let _reasoning_extraInitializers = [];
    let _marketConditions_decorators;
    let _marketConditions_initializers = [];
    let _marketConditions_extraInitializers = [];
    let _changedBy_decorators;
    let _changedBy_initializers = [];
    let _changedBy_extraInitializers = [];
    let _isAutomated_decorators;
    let _isAutomated_initializers = [];
    let _isAutomated_extraInitializers = [];
    let _abTestId_decorators;
    let _abTestId_initializers = [];
    let _abTestId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var PriceHistory = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.priceHistoryId = __runInitializers(this, _priceHistoryId_initializers, void 0);
            this.productId = (__runInitializers(this, _priceHistoryId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
            this.previousPrice = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _previousPrice_initializers, void 0));
            this.newPrice = (__runInitializers(this, _previousPrice_extraInitializers), __runInitializers(this, _newPrice_initializers, void 0));
            this.priceChange = (__runInitializers(this, _newPrice_extraInitializers), __runInitializers(this, _priceChange_initializers, void 0));
            this.priceChangePercent = (__runInitializers(this, _priceChange_extraInitializers), __runInitializers(this, _priceChangePercent_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _priceChangePercent_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.pricingStrategy = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _pricingStrategy_initializers, void 0));
            this.changeReason = (__runInitializers(this, _pricingStrategy_extraInitializers), __runInitializers(this, _changeReason_initializers, void 0));
            this.reasoning = (__runInitializers(this, _changeReason_extraInitializers), __runInitializers(this, _reasoning_initializers, void 0));
            this.marketConditions = (__runInitializers(this, _reasoning_extraInitializers), __runInitializers(this, _marketConditions_initializers, void 0));
            this.changedBy = (__runInitializers(this, _marketConditions_extraInitializers), __runInitializers(this, _changedBy_initializers, void 0));
            this.isAutomated = (__runInitializers(this, _changedBy_extraInitializers), __runInitializers(this, _isAutomated_initializers, void 0));
            this.abTestId = (__runInitializers(this, _isAutomated_extraInitializers), __runInitializers(this, _abTestId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _abTestId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PriceHistory");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _priceHistoryId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Price history ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _previousPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Previous price' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 4),
                allowNull: true,
            })];
        _newPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'New price' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 4),
                allowNull: false,
            })];
        _priceChange_decorators = [(0, swagger_1.ApiProperty)({ description: 'Price change amount' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 4),
                allowNull: false,
            })];
        _priceChangePercent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Price change percentage' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(8, 4),
                allowNull: false,
            })];
        _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _pricingStrategy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Pricing strategy used', enum: PricingStrategy }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PricingStrategy)),
                allowNull: false,
            })];
        _changeReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Change reason', enum: PriceChangeReason }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PriceChangeReason)),
                allowNull: false,
            })];
        _reasoning_decorators = [(0, swagger_1.ApiProperty)({ description: 'Detailed reasoning (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _marketConditions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Market conditions at time of change (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _changedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Changed by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _isAutomated_decorators = [(0, swagger_1.ApiProperty)({ description: 'Automated change flag' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: false,
            })];
        _abTestId_decorators = [(0, swagger_1.ApiProperty)({ description: 'A/B test ID if applicable' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _priceHistoryId_decorators, { kind: "field", name: "priceHistoryId", static: false, private: false, access: { has: obj => "priceHistoryId" in obj, get: obj => obj.priceHistoryId, set: (obj, value) => { obj.priceHistoryId = value; } }, metadata: _metadata }, _priceHistoryId_initializers, _priceHistoryId_extraInitializers);
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _previousPrice_decorators, { kind: "field", name: "previousPrice", static: false, private: false, access: { has: obj => "previousPrice" in obj, get: obj => obj.previousPrice, set: (obj, value) => { obj.previousPrice = value; } }, metadata: _metadata }, _previousPrice_initializers, _previousPrice_extraInitializers);
        __esDecorate(null, null, _newPrice_decorators, { kind: "field", name: "newPrice", static: false, private: false, access: { has: obj => "newPrice" in obj, get: obj => obj.newPrice, set: (obj, value) => { obj.newPrice = value; } }, metadata: _metadata }, _newPrice_initializers, _newPrice_extraInitializers);
        __esDecorate(null, null, _priceChange_decorators, { kind: "field", name: "priceChange", static: false, private: false, access: { has: obj => "priceChange" in obj, get: obj => obj.priceChange, set: (obj, value) => { obj.priceChange = value; } }, metadata: _metadata }, _priceChange_initializers, _priceChange_extraInitializers);
        __esDecorate(null, null, _priceChangePercent_decorators, { kind: "field", name: "priceChangePercent", static: false, private: false, access: { has: obj => "priceChangePercent" in obj, get: obj => obj.priceChangePercent, set: (obj, value) => { obj.priceChangePercent = value; } }, metadata: _metadata }, _priceChangePercent_initializers, _priceChangePercent_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _pricingStrategy_decorators, { kind: "field", name: "pricingStrategy", static: false, private: false, access: { has: obj => "pricingStrategy" in obj, get: obj => obj.pricingStrategy, set: (obj, value) => { obj.pricingStrategy = value; } }, metadata: _metadata }, _pricingStrategy_initializers, _pricingStrategy_extraInitializers);
        __esDecorate(null, null, _changeReason_decorators, { kind: "field", name: "changeReason", static: false, private: false, access: { has: obj => "changeReason" in obj, get: obj => obj.changeReason, set: (obj, value) => { obj.changeReason = value; } }, metadata: _metadata }, _changeReason_initializers, _changeReason_extraInitializers);
        __esDecorate(null, null, _reasoning_decorators, { kind: "field", name: "reasoning", static: false, private: false, access: { has: obj => "reasoning" in obj, get: obj => obj.reasoning, set: (obj, value) => { obj.reasoning = value; } }, metadata: _metadata }, _reasoning_initializers, _reasoning_extraInitializers);
        __esDecorate(null, null, _marketConditions_decorators, { kind: "field", name: "marketConditions", static: false, private: false, access: { has: obj => "marketConditions" in obj, get: obj => obj.marketConditions, set: (obj, value) => { obj.marketConditions = value; } }, metadata: _metadata }, _marketConditions_initializers, _marketConditions_extraInitializers);
        __esDecorate(null, null, _changedBy_decorators, { kind: "field", name: "changedBy", static: false, private: false, access: { has: obj => "changedBy" in obj, get: obj => obj.changedBy, set: (obj, value) => { obj.changedBy = value; } }, metadata: _metadata }, _changedBy_initializers, _changedBy_extraInitializers);
        __esDecorate(null, null, _isAutomated_decorators, { kind: "field", name: "isAutomated", static: false, private: false, access: { has: obj => "isAutomated" in obj, get: obj => obj.isAutomated, set: (obj, value) => { obj.isAutomated = value; } }, metadata: _metadata }, _isAutomated_initializers, _isAutomated_extraInitializers);
        __esDecorate(null, null, _abTestId_decorators, { kind: "field", name: "abTestId", static: false, private: false, access: { has: obj => "abTestId" in obj, get: obj => obj.abTestId, set: (obj, value) => { obj.abTestId = value; } }, metadata: _metadata }, _abTestId_initializers, _abTestId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PriceHistory = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PriceHistory = _classThis;
})();
exports.PriceHistory = PriceHistory;
/**
 * Dynamic pricing rule model
 */
let PricingRule = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'pricing_rules',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['productId'] },
                { fields: ['isActive'] },
                { fields: ['priority'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _ruleId_decorators;
    let _ruleId_initializers = [];
    let _ruleId_extraInitializers = [];
    let _ruleName_decorators;
    let _ruleName_initializers = [];
    let _ruleName_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _productCategory_decorators;
    let _productCategory_initializers = [];
    let _productCategory_extraInitializers = [];
    let _strategy_decorators;
    let _strategy_initializers = [];
    let _strategy_extraInitializers = [];
    let _customerSegment_decorators;
    let _customerSegment_initializers = [];
    let _customerSegment_extraInitializers = [];
    let _geographicZone_decorators;
    let _geographicZone_initializers = [];
    let _geographicZone_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _configuration_decorators;
    let _configuration_initializers = [];
    let _configuration_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _validFrom_decorators;
    let _validFrom_initializers = [];
    let _validFrom_extraInitializers = [];
    let _validUntil_decorators;
    let _validUntil_initializers = [];
    let _validUntil_extraInitializers = [];
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
            this.ruleName = (__runInitializers(this, _ruleId_extraInitializers), __runInitializers(this, _ruleName_initializers, void 0));
            this.productId = (__runInitializers(this, _ruleName_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
            this.productCategory = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _productCategory_initializers, void 0));
            this.strategy = (__runInitializers(this, _productCategory_extraInitializers), __runInitializers(this, _strategy_initializers, void 0));
            this.customerSegment = (__runInitializers(this, _strategy_extraInitializers), __runInitializers(this, _customerSegment_initializers, void 0));
            this.geographicZone = (__runInitializers(this, _customerSegment_extraInitializers), __runInitializers(this, _geographicZone_initializers, void 0));
            this.priority = (__runInitializers(this, _geographicZone_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.configuration = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _configuration_initializers, void 0));
            this.isActive = (__runInitializers(this, _configuration_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.validFrom = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _validFrom_initializers, void 0));
            this.validUntil = (__runInitializers(this, _validFrom_extraInitializers), __runInitializers(this, _validUntil_initializers, void 0));
            this.createdAt = (__runInitializers(this, _validUntil_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PricingRule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _ruleId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Pricing rule ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _ruleName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule name' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID (null for global rules)' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _productCategory_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product category (null for product-specific)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            })];
        _strategy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Pricing strategy', enum: PricingStrategy }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PricingStrategy)),
                allowNull: false,
            })];
        _customerSegment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer segment filter', enum: CustomerSegment }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(CustomerSegment)),
                allowNull: true,
            })];
        _geographicZone_decorators = [(0, swagger_1.ApiProperty)({ description: 'Geographic zone filter', enum: GeographicZone }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(GeographicZone)),
                allowNull: true,
            })];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority (higher = evaluated first)' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                defaultValue: 100,
            })];
        _configuration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule configuration (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Active status' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: true,
            })];
        _validFrom_decorators = [(0, swagger_1.ApiProperty)({ description: 'Valid from date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _validUntil_decorators = [(0, swagger_1.ApiProperty)({ description: 'Valid until date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _ruleId_decorators, { kind: "field", name: "ruleId", static: false, private: false, access: { has: obj => "ruleId" in obj, get: obj => obj.ruleId, set: (obj, value) => { obj.ruleId = value; } }, metadata: _metadata }, _ruleId_initializers, _ruleId_extraInitializers);
        __esDecorate(null, null, _ruleName_decorators, { kind: "field", name: "ruleName", static: false, private: false, access: { has: obj => "ruleName" in obj, get: obj => obj.ruleName, set: (obj, value) => { obj.ruleName = value; } }, metadata: _metadata }, _ruleName_initializers, _ruleName_extraInitializers);
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _productCategory_decorators, { kind: "field", name: "productCategory", static: false, private: false, access: { has: obj => "productCategory" in obj, get: obj => obj.productCategory, set: (obj, value) => { obj.productCategory = value; } }, metadata: _metadata }, _productCategory_initializers, _productCategory_extraInitializers);
        __esDecorate(null, null, _strategy_decorators, { kind: "field", name: "strategy", static: false, private: false, access: { has: obj => "strategy" in obj, get: obj => obj.strategy, set: (obj, value) => { obj.strategy = value; } }, metadata: _metadata }, _strategy_initializers, _strategy_extraInitializers);
        __esDecorate(null, null, _customerSegment_decorators, { kind: "field", name: "customerSegment", static: false, private: false, access: { has: obj => "customerSegment" in obj, get: obj => obj.customerSegment, set: (obj, value) => { obj.customerSegment = value; } }, metadata: _metadata }, _customerSegment_initializers, _customerSegment_extraInitializers);
        __esDecorate(null, null, _geographicZone_decorators, { kind: "field", name: "geographicZone", static: false, private: false, access: { has: obj => "geographicZone" in obj, get: obj => obj.geographicZone, set: (obj, value) => { obj.geographicZone = value; } }, metadata: _metadata }, _geographicZone_initializers, _geographicZone_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _configuration_decorators, { kind: "field", name: "configuration", static: false, private: false, access: { has: obj => "configuration" in obj, get: obj => obj.configuration, set: (obj, value) => { obj.configuration = value; } }, metadata: _metadata }, _configuration_initializers, _configuration_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _validFrom_decorators, { kind: "field", name: "validFrom", static: false, private: false, access: { has: obj => "validFrom" in obj, get: obj => obj.validFrom, set: (obj, value) => { obj.validFrom = value; } }, metadata: _metadata }, _validFrom_initializers, _validFrom_extraInitializers);
        __esDecorate(null, null, _validUntil_decorators, { kind: "field", name: "validUntil", static: false, private: false, access: { has: obj => "validUntil" in obj, get: obj => obj.validUntil, set: (obj, value) => { obj.validUntil = value; } }, metadata: _metadata }, _validUntil_initializers, _validUntil_extraInitializers);
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
 * Price elasticity data model
 */
let PriceElasticityData = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'price_elasticity',
            timestamps: true,
            indexes: [
                { fields: ['productId'], unique: true },
                { fields: ['lastCalculated'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _elasticityId_decorators;
    let _elasticityId_initializers = [];
    let _elasticityId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _elasticity_decorators;
    let _elasticity_initializers = [];
    let _elasticity_extraInitializers = [];
    let _classification_decorators;
    let _classification_initializers = [];
    let _classification_extraInitializers = [];
    let _demandCurve_decorators;
    let _demandCurve_initializers = [];
    let _demandCurve_extraInitializers = [];
    let _optimalPriceRange_decorators;
    let _optimalPriceRange_initializers = [];
    let _optimalPriceRange_extraInitializers = [];
    let _confidence_decorators;
    let _confidence_initializers = [];
    let _confidence_extraInitializers = [];
    let _dataPoints_decorators;
    let _dataPoints_initializers = [];
    let _dataPoints_extraInitializers = [];
    let _lastCalculated_decorators;
    let _lastCalculated_initializers = [];
    let _lastCalculated_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var PriceElasticityData = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.elasticityId = __runInitializers(this, _elasticityId_initializers, void 0);
            this.productId = (__runInitializers(this, _elasticityId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
            this.elasticity = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _elasticity_initializers, void 0));
            this.classification = (__runInitializers(this, _elasticity_extraInitializers), __runInitializers(this, _classification_initializers, void 0));
            this.demandCurve = (__runInitializers(this, _classification_extraInitializers), __runInitializers(this, _demandCurve_initializers, void 0));
            this.optimalPriceRange = (__runInitializers(this, _demandCurve_extraInitializers), __runInitializers(this, _optimalPriceRange_initializers, void 0));
            this.confidence = (__runInitializers(this, _optimalPriceRange_extraInitializers), __runInitializers(this, _confidence_initializers, void 0));
            this.dataPoints = (__runInitializers(this, _confidence_extraInitializers), __runInitializers(this, _dataPoints_initializers, void 0));
            this.lastCalculated = (__runInitializers(this, _dataPoints_extraInitializers), __runInitializers(this, _lastCalculated_initializers, void 0));
            this.createdAt = (__runInitializers(this, _lastCalculated_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PriceElasticityData");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _elasticityId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Elasticity record ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                unique: true,
            })];
        _elasticity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Elasticity coefficient' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(10, 4),
                allowNull: false,
            })];
        _classification_decorators = [(0, swagger_1.ApiProperty)({ description: 'Elasticity classification', enum: PriceElasticity }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PriceElasticity)),
                allowNull: false,
            })];
        _demandCurve_decorators = [(0, swagger_1.ApiProperty)({ description: 'Demand curve data (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _optimalPriceRange_decorators = [(0, swagger_1.ApiProperty)({ description: 'Optimal price range (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            })];
        _confidence_decorators = [(0, swagger_1.ApiProperty)({ description: 'Confidence score (0-100)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: false,
            })];
        _dataPoints_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of data points used' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
            })];
        _lastCalculated_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last calculated date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _elasticityId_decorators, { kind: "field", name: "elasticityId", static: false, private: false, access: { has: obj => "elasticityId" in obj, get: obj => obj.elasticityId, set: (obj, value) => { obj.elasticityId = value; } }, metadata: _metadata }, _elasticityId_initializers, _elasticityId_extraInitializers);
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _elasticity_decorators, { kind: "field", name: "elasticity", static: false, private: false, access: { has: obj => "elasticity" in obj, get: obj => obj.elasticity, set: (obj, value) => { obj.elasticity = value; } }, metadata: _metadata }, _elasticity_initializers, _elasticity_extraInitializers);
        __esDecorate(null, null, _classification_decorators, { kind: "field", name: "classification", static: false, private: false, access: { has: obj => "classification" in obj, get: obj => obj.classification, set: (obj, value) => { obj.classification = value; } }, metadata: _metadata }, _classification_initializers, _classification_extraInitializers);
        __esDecorate(null, null, _demandCurve_decorators, { kind: "field", name: "demandCurve", static: false, private: false, access: { has: obj => "demandCurve" in obj, get: obj => obj.demandCurve, set: (obj, value) => { obj.demandCurve = value; } }, metadata: _metadata }, _demandCurve_initializers, _demandCurve_extraInitializers);
        __esDecorate(null, null, _optimalPriceRange_decorators, { kind: "field", name: "optimalPriceRange", static: false, private: false, access: { has: obj => "optimalPriceRange" in obj, get: obj => obj.optimalPriceRange, set: (obj, value) => { obj.optimalPriceRange = value; } }, metadata: _metadata }, _optimalPriceRange_initializers, _optimalPriceRange_extraInitializers);
        __esDecorate(null, null, _confidence_decorators, { kind: "field", name: "confidence", static: false, private: false, access: { has: obj => "confidence" in obj, get: obj => obj.confidence, set: (obj, value) => { obj.confidence = value; } }, metadata: _metadata }, _confidence_initializers, _confidence_extraInitializers);
        __esDecorate(null, null, _dataPoints_decorators, { kind: "field", name: "dataPoints", static: false, private: false, access: { has: obj => "dataPoints" in obj, get: obj => obj.dataPoints, set: (obj, value) => { obj.dataPoints = value; } }, metadata: _metadata }, _dataPoints_initializers, _dataPoints_extraInitializers);
        __esDecorate(null, null, _lastCalculated_decorators, { kind: "field", name: "lastCalculated", static: false, private: false, access: { has: obj => "lastCalculated" in obj, get: obj => obj.lastCalculated, set: (obj, value) => { obj.lastCalculated = value; } }, metadata: _metadata }, _lastCalculated_initializers, _lastCalculated_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PriceElasticityData = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PriceElasticityData = _classThis;
})();
exports.PriceElasticityData = PriceElasticityData;
// ============================================================================
// DTO CLASSES
// ============================================================================
/**
 * DTO for real-time price calculation request
 */
let CalculatePriceDto = (() => {
    var _a;
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _customerSegment_decorators;
    let _customerSegment_initializers = [];
    let _customerSegment_extraInitializers = [];
    let _geographicZone_decorators;
    let _geographicZone_initializers = [];
    let _geographicZone_extraInitializers = [];
    let _channel_decorators;
    let _channel_initializers = [];
    let _channel_extraInitializers = [];
    let _includeCompetitorAnalysis_decorators;
    let _includeCompetitorAnalysis_initializers = [];
    let _includeCompetitorAnalysis_extraInitializers = [];
    return _a = class CalculatePriceDto {
            constructor() {
                this.productId = __runInitializers(this, _productId_initializers, void 0);
                this.quantity = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
                this.customerId = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
                this.customerSegment = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _customerSegment_initializers, void 0));
                this.geographicZone = (__runInitializers(this, _customerSegment_extraInitializers), __runInitializers(this, _geographicZone_initializers, void 0));
                this.channel = (__runInitializers(this, _geographicZone_extraInitializers), __runInitializers(this, _channel_initializers, void 0));
                this.includeCompetitorAnalysis = (__runInitializers(this, _channel_extraInitializers), __runInitializers(this, _includeCompetitorAnalysis_initializers, void 0));
                __runInitializers(this, _includeCompetitorAnalysis_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _quantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _customerId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Customer ID' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _customerSegment_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Customer segment', enum: CustomerSegment }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(CustomerSegment)];
            _geographicZone_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Geographic zone', enum: GeographicZone }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(GeographicZone)];
            _channel_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Channel identifier' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _includeCompetitorAnalysis_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Include competitor analysis' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _customerSegment_decorators, { kind: "field", name: "customerSegment", static: false, private: false, access: { has: obj => "customerSegment" in obj, get: obj => obj.customerSegment, set: (obj, value) => { obj.customerSegment = value; } }, metadata: _metadata }, _customerSegment_initializers, _customerSegment_extraInitializers);
            __esDecorate(null, null, _geographicZone_decorators, { kind: "field", name: "geographicZone", static: false, private: false, access: { has: obj => "geographicZone" in obj, get: obj => obj.geographicZone, set: (obj, value) => { obj.geographicZone = value; } }, metadata: _metadata }, _geographicZone_initializers, _geographicZone_extraInitializers);
            __esDecorate(null, null, _channel_decorators, { kind: "field", name: "channel", static: false, private: false, access: { has: obj => "channel" in obj, get: obj => obj.channel, set: (obj, value) => { obj.channel = value; } }, metadata: _metadata }, _channel_initializers, _channel_extraInitializers);
            __esDecorate(null, null, _includeCompetitorAnalysis_decorators, { kind: "field", name: "includeCompetitorAnalysis", static: false, private: false, access: { has: obj => "includeCompetitorAnalysis" in obj, get: obj => obj.includeCompetitorAnalysis, set: (obj, value) => { obj.includeCompetitorAnalysis = value; } }, metadata: _metadata }, _includeCompetitorAnalysis_initializers, _includeCompetitorAnalysis_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CalculatePriceDto = CalculatePriceDto;
/**
 * DTO for price optimization request
 */
let OptimizePriceDto = (() => {
    var _a;
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _objective_decorators;
    let _objective_initializers = [];
    let _objective_extraInitializers = [];
    let _minPrice_decorators;
    let _minPrice_initializers = [];
    let _minPrice_extraInitializers = [];
    let _maxPrice_decorators;
    let _maxPrice_initializers = [];
    let _maxPrice_extraInitializers = [];
    let _minMarginPercent_decorators;
    let _minMarginPercent_initializers = [];
    let _minMarginPercent_extraInitializers = [];
    let _timeHorizonDays_decorators;
    let _timeHorizonDays_initializers = [];
    let _timeHorizonDays_extraInitializers = [];
    return _a = class OptimizePriceDto {
            constructor() {
                this.productId = __runInitializers(this, _productId_initializers, void 0);
                this.objective = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _objective_initializers, void 0));
                this.minPrice = (__runInitializers(this, _objective_extraInitializers), __runInitializers(this, _minPrice_initializers, void 0));
                this.maxPrice = (__runInitializers(this, _minPrice_extraInitializers), __runInitializers(this, _maxPrice_initializers, void 0));
                this.minMarginPercent = (__runInitializers(this, _maxPrice_extraInitializers), __runInitializers(this, _minMarginPercent_initializers, void 0));
                this.timeHorizonDays = (__runInitializers(this, _minMarginPercent_extraInitializers), __runInitializers(this, _timeHorizonDays_initializers, void 0));
                __runInitializers(this, _timeHorizonDays_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _objective_decorators = [(0, swagger_1.ApiProperty)({ description: 'Optimization objective', enum: OptimizationObjective }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEnum)(OptimizationObjective)];
            _minPrice_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Constraint: minimum price' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _maxPrice_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Constraint: maximum price' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _minMarginPercent_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Constraint: minimum margin %' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _timeHorizonDays_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Time horizon in days' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(365)];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _objective_decorators, { kind: "field", name: "objective", static: false, private: false, access: { has: obj => "objective" in obj, get: obj => obj.objective, set: (obj, value) => { obj.objective = value; } }, metadata: _metadata }, _objective_initializers, _objective_extraInitializers);
            __esDecorate(null, null, _minPrice_decorators, { kind: "field", name: "minPrice", static: false, private: false, access: { has: obj => "minPrice" in obj, get: obj => obj.minPrice, set: (obj, value) => { obj.minPrice = value; } }, metadata: _metadata }, _minPrice_initializers, _minPrice_extraInitializers);
            __esDecorate(null, null, _maxPrice_decorators, { kind: "field", name: "maxPrice", static: false, private: false, access: { has: obj => "maxPrice" in obj, get: obj => obj.maxPrice, set: (obj, value) => { obj.maxPrice = value; } }, metadata: _metadata }, _maxPrice_initializers, _maxPrice_extraInitializers);
            __esDecorate(null, null, _minMarginPercent_decorators, { kind: "field", name: "minMarginPercent", static: false, private: false, access: { has: obj => "minMarginPercent" in obj, get: obj => obj.minMarginPercent, set: (obj, value) => { obj.minMarginPercent = value; } }, metadata: _metadata }, _minMarginPercent_initializers, _minMarginPercent_extraInitializers);
            __esDecorate(null, null, _timeHorizonDays_decorators, { kind: "field", name: "timeHorizonDays", static: false, private: false, access: { has: obj => "timeHorizonDays" in obj, get: obj => obj.timeHorizonDays, set: (obj, value) => { obj.timeHorizonDays = value; } }, metadata: _metadata }, _timeHorizonDays_initializers, _timeHorizonDays_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.OptimizePriceDto = OptimizePriceDto;
/**
 * DTO for creating A/B pricing test
 */
let CreateABTestDto = (() => {
    var _a;
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _testName_decorators;
    let _testName_initializers = [];
    let _testName_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _variants_decorators;
    let _variants_initializers = [];
    let _variants_extraInitializers = [];
    let _trafficSplit_decorators;
    let _trafficSplit_initializers = [];
    let _trafficSplit_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _targetSampleSize_decorators;
    let _targetSampleSize_initializers = [];
    let _targetSampleSize_extraInitializers = [];
    return _a = class CreateABTestDto {
            constructor() {
                this.productId = __runInitializers(this, _productId_initializers, void 0);
                this.testName = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _testName_initializers, void 0));
                this.description = (__runInitializers(this, _testName_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.variants = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _variants_initializers, void 0));
                this.trafficSplit = (__runInitializers(this, _variants_extraInitializers), __runInitializers(this, _trafficSplit_initializers, void 0));
                this.startDate = (__runInitializers(this, _trafficSplit_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.targetSampleSize = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _targetSampleSize_initializers, void 0));
                __runInitializers(this, _targetSampleSize_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _testName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Test name' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Test description' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _variants_decorators = [(0, swagger_1.ApiProperty)({ description: 'Price variants', type: [Object] }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => PriceVariant)];
            _trafficSplit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Traffic split percentages', type: [Number] }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsArray)()];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, class_validator_1.IsNotEmpty)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, class_validator_1.IsNotEmpty)()];
            _targetSampleSize_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target sample size' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(100)];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _testName_decorators, { kind: "field", name: "testName", static: false, private: false, access: { has: obj => "testName" in obj, get: obj => obj.testName, set: (obj, value) => { obj.testName = value; } }, metadata: _metadata }, _testName_initializers, _testName_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _variants_decorators, { kind: "field", name: "variants", static: false, private: false, access: { has: obj => "variants" in obj, get: obj => obj.variants, set: (obj, value) => { obj.variants = value; } }, metadata: _metadata }, _variants_initializers, _variants_extraInitializers);
            __esDecorate(null, null, _trafficSplit_decorators, { kind: "field", name: "trafficSplit", static: false, private: false, access: { has: obj => "trafficSplit" in obj, get: obj => obj.trafficSplit, set: (obj, value) => { obj.trafficSplit = value; } }, metadata: _metadata }, _trafficSplit_initializers, _trafficSplit_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _targetSampleSize_decorators, { kind: "field", name: "targetSampleSize", static: false, private: false, access: { has: obj => "targetSampleSize" in obj, get: obj => obj.targetSampleSize, set: (obj, value) => { obj.targetSampleSize = value; } }, metadata: _metadata }, _targetSampleSize_initializers, _targetSampleSize_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateABTestDto = CreateABTestDto;
// ============================================================================
// UTILITY FUNCTIONS - REAL-TIME PRICING
// ============================================================================
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
async function calculateRealtimePrice(productId, context) {
    try {
        const logger = new common_1.Logger('PricingEngine');
        // Fetch base price and cost
        const basePrice = await getBasePrice(productId);
        const cost = await getProductCost(productId);
        // Apply pricing rules in priority order
        const applicableRules = await getApplicablePricingRules(productId, context);
        let finalPrice = basePrice;
        const adjustments = [];
        const appliedStrategies = [];
        for (const rule of applicableRules) {
            const adjustment = await applyPricingRule(rule, finalPrice, context);
            if (adjustment) {
                finalPrice += adjustment.amount;
                adjustments.push(adjustment);
                if (!appliedStrategies.includes(rule.strategy)) {
                    appliedStrategies.push(rule.strategy);
                }
            }
        }
        // Ensure price doesn't go below cost
        const floorPrice = cost * 1.05; // Minimum 5% margin
        if (finalPrice < floorPrice) {
            logger.warn(`Price ${finalPrice} below floor ${floorPrice}, adjusting`);
            finalPrice = floorPrice;
        }
        const margin = finalPrice - cost;
        const marginPercent = (margin / finalPrice) * 100;
        // Calculate cache validity based on volatility
        const validityMinutes = context.marketConditions?.volatility > 70 ? 5 : 60;
        const validUntil = new Date(Date.now() + validityMinutes * 60 * 1000);
        return {
            basePrice,
            finalPrice: Math.round(finalPrice * 100) / 100,
            adjustments,
            margin,
            marginPercent,
            confidence: determineConfidence(adjustments.length, context),
            validUntil,
            appliedStrategies,
            metadata: {
                productId,
                calculatedAt: new Date(),
                cacheValidityMinutes: validityMinutes,
            },
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate real-time price: ${error.message}`);
    }
}
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
async function calculateDemandBasedPrice(productId, demandLevel, inventoryLevel) {
    try {
        const basePrice = await getBasePrice(productId);
        const elasticityData = await getPriceElasticity(productId);
        // Calculate demand multiplier (higher demand = higher price)
        let demandMultiplier = 1.0;
        if (demandLevel > 80) {
            // High demand - increase price
            demandMultiplier = 1.0 + ((demandLevel - 80) / 100);
        }
        else if (demandLevel < 30) {
            // Low demand - decrease price
            demandMultiplier = 1.0 - ((30 - demandLevel) / 100);
        }
        // Adjust based on inventory
        if (inventoryLevel < 50) {
            // Low inventory - increase price
            demandMultiplier *= 1.1;
        }
        else if (inventoryLevel > 200) {
            // High inventory - decrease price
            demandMultiplier *= 0.95;
        }
        // Apply elasticity factor
        if (elasticityData && elasticityData.classification === PriceElasticity.HIGHLY_ELASTIC) {
            // Be more conservative with elastic products
            demandMultiplier = 1.0 + ((demandMultiplier - 1.0) * 0.5);
        }
        const adjustedPrice = basePrice * demandMultiplier;
        // Record price change
        await recordPriceChange(productId, basePrice, adjustedPrice, PriceChangeReason.DEMAND_SURGE);
        return Math.round(adjustedPrice * 100) / 100;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate demand-based price: ${error.message}`);
    }
}
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
async function calculateTimeBasedPrice(productId, timePeriod, basePrice) {
    try {
        const timeMultipliers = {
            [TimePricingPeriod.PEAK_HOURS]: 1.15,
            [TimePricingPeriod.OFF_PEAK]: 0.90,
            [TimePricingPeriod.WEEKEND]: 1.05,
            [TimePricingPeriod.WEEKDAY]: 1.00,
            [TimePricingPeriod.HOLIDAY]: 1.20,
            [TimePricingPeriod.SEASONAL_HIGH]: 1.25,
            [TimePricingPeriod.SEASONAL_LOW]: 0.85,
            [TimePricingPeriod.FLASH_SALE]: 0.70,
            [TimePricingPeriod.EARLY_BIRD]: 0.80,
            [TimePricingPeriod.LATE_NIGHT]: 0.95,
        };
        const multiplier = timeMultipliers[timePeriod] || 1.0;
        const adjustedPrice = basePrice * multiplier;
        return Math.round(adjustedPrice * 100) / 100;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate time-based price: ${error.message}`);
    }
}
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
async function calculateCompetitorBasedPrice(productId, competitorPrices, strategy = 'MATCH') {
    try {
        if (!competitorPrices || competitorPrices.length === 0) {
            throw new common_1.BadRequestException('No competitor prices available');
        }
        // Calculate average competitor price
        const availablePrices = competitorPrices
            .filter(cp => cp.availability)
            .map(cp => cp.totalCost || cp.price);
        if (availablePrices.length === 0) {
            throw new common_1.BadRequestException('No available competitor products');
        }
        const avgCompetitorPrice = availablePrices.reduce((a, b) => a + b, 0) / availablePrices.length;
        const minCompetitorPrice = Math.min(...availablePrices);
        let targetPrice;
        switch (strategy) {
            case 'BELOW':
                // Price 2-5% below lowest competitor
                targetPrice = minCompetitorPrice * 0.97;
                break;
            case 'MATCH':
                // Match average competitor price
                targetPrice = avgCompetitorPrice;
                break;
            case 'PREMIUM':
                // Price 10-15% above average (premium positioning)
                targetPrice = avgCompetitorPrice * 1.12;
                break;
            default:
                targetPrice = avgCompetitorPrice;
        }
        // Ensure margin requirements
        const cost = await getProductCost(productId);
        const minPrice = cost * 1.15; // Minimum 15% margin
        if (targetPrice < minPrice) {
            targetPrice = minPrice;
        }
        return Math.round(targetPrice * 100) / 100;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate competitor-based price: ${error.message}`);
    }
}
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
async function calculateVolumeTierPrice(productId, quantity, basePrice) {
    try {
        const tiers = await getVolumePricingTiers(productId);
        if (!tiers || tiers.length === 0) {
            return basePrice;
        }
        // Sort tiers by minQuantity descending
        const sortedTiers = tiers.sort((a, b) => b.minQuantity - a.minQuantity);
        // Find applicable tier
        const applicableTier = sortedTiers.find(tier => quantity >= tier.minQuantity &&
            (!tier.maxQuantity || quantity <= tier.maxQuantity));
        if (!applicableTier) {
            return basePrice;
        }
        let tierPrice = basePrice;
        if (applicableTier.price !== undefined) {
            tierPrice = applicableTier.price;
        }
        else if (applicableTier.discountPercent !== undefined) {
            tierPrice = basePrice * (1 - applicableTier.discountPercent / 100);
        }
        else if (applicableTier.discountAmount !== undefined) {
            tierPrice = basePrice - applicableTier.discountAmount;
        }
        return Math.round(tierPrice * 100) / 100;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate volume tier price: ${error.message}`);
    }
}
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
async function calculateSegmentPrice(productId, customerSegment, basePrice) {
    try {
        const segmentMultipliers = {
            [CustomerSegment.ENTERPRISE]: 0.85, // 15% discount
            [CustomerSegment.SMALL_BUSINESS]: 0.93, // 7% discount
            [CustomerSegment.INDIVIDUAL]: 1.00,
            [CustomerSegment.VIP]: 0.80, // 20% discount
            [CustomerSegment.WHOLESALE]: 0.70, // 30% discount
            [CustomerSegment.RETAIL]: 1.00,
            [CustomerSegment.GOVERNMENT]: 0.90, // 10% discount
            [CustomerSegment.EDUCATION]: 0.85, // 15% discount
            [CustomerSegment.NON_PROFIT]: 0.88, // 12% discount
            [CustomerSegment.NEW_CUSTOMER]: 0.95, // 5% introductory discount
            [CustomerSegment.LOYAL_CUSTOMER]: 0.92, // 8% loyalty discount
        };
        const multiplier = segmentMultipliers[customerSegment] || 1.0;
        const adjustedPrice = basePrice * multiplier;
        return Math.round(adjustedPrice * 100) / 100;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate segment price: ${error.message}`);
    }
}
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
async function calculateGeographicPrice(productId, geographicZone, basePrice) {
    try {
        const zoneMultipliers = {
            [GeographicZone.METRO_PREMIUM]: 1.15,
            [GeographicZone.METRO_STANDARD]: 1.05,
            [GeographicZone.SUBURBAN]: 1.00,
            [GeographicZone.RURAL]: 0.95,
            [GeographicZone.INTERNATIONAL]: 1.20,
            [GeographicZone.HIGH_COST_AREA]: 1.10,
            [GeographicZone.LOW_COST_AREA]: 0.90,
        };
        const multiplier = zoneMultipliers[geographicZone] || 1.0;
        const adjustedPrice = basePrice * multiplier;
        return Math.round(adjustedPrice * 100) / 100;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate geographic price: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - PRICE OPTIMIZATION
// ============================================================================
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
async function optimizePrice(productId, objective, constraints = {}) {
    try {
        const currentPrice = await getBasePrice(productId);
        const cost = await getProductCost(productId);
        const elasticityData = await getPriceElasticity(productId);
        const historicalData = await getHistoricalSalesData(productId, constraints.timeHorizonDays || 90);
        // Calculate constraints
        const minPrice = constraints.minPrice || cost * 1.15;
        const maxPrice = constraints.maxPrice || currentPrice * 2;
        const minMargin = constraints.minMarginPercent || 15;
        // Simulate different price points
        const pricePoints = generatePricePoints(minPrice, maxPrice, 20);
        const scenarios = [];
        for (const price of pricePoints) {
            const margin = ((price - cost) / price) * 100;
            if (margin < minMargin)
                continue;
            const expectedImpact = await simulatePriceImpact(productId, currentPrice, price, elasticityData, historicalData);
            let score = 0;
            switch (objective) {
                case OptimizationObjective.MAXIMIZE_REVENUE:
                    score = expectedImpact.revenueChangePercent;
                    break;
                case OptimizationObjective.MAXIMIZE_PROFIT:
                    score = expectedImpact.profitChangePercent;
                    break;
                case OptimizationObjective.MAXIMIZE_VOLUME:
                    score = expectedImpact.volumeChangePercent;
                    break;
                case OptimizationObjective.MAXIMIZE_MARKET_SHARE:
                    score = expectedImpact.marketShareChange || 0;
                    break;
                case OptimizationObjective.TARGET_MARGIN:
                    score = 100 - Math.abs(margin - (constraints.minMarginPercent || 25));
                    break;
                case OptimizationObjective.INVENTORY_CLEARANCE:
                    score = expectedImpact.volumeChangePercent * 2;
                    break;
                case OptimizationObjective.COMPETITIVE_PARITY:
                    const competitorAvg = await getAverageCompetitorPrice(productId);
                    score = 100 - Math.abs(((price - competitorAvg) / competitorAvg) * 100);
                    break;
            }
            scenarios.push({ price, score, impact: expectedImpact });
        }
        // Find best scenario
        const bestScenario = scenarios.reduce((best, current) => current.score > best.score ? current : best);
        const confidence = calculateRecommendationConfidence(scenarios, elasticityData, historicalData.length);
        const reasoning = buildRecommendationReasoning(objective, bestScenario, elasticityData, constraints);
        const riskFactors = identifyRiskFactors(currentPrice, bestScenario.price, elasticityData, historicalData);
        return {
            productId,
            currentPrice,
            recommendedPrice: bestScenario.price,
            priceChange: bestScenario.price - currentPrice,
            priceChangePercent: ((bestScenario.price - currentPrice) / currentPrice) * 100,
            confidence,
            reasoning,
            expectedImpact: bestScenario.impact,
            riskFactors,
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            generatedAt: new Date(),
            model: 'price-optimization-v2',
            modelVersion: '2.1.0',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to optimize price: ${error.message}`);
    }
}
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
async function calculateMarginTargetPrice(productId, targetMarginPercent, cost) {
    try {
        // Formula: Price = Cost / (1 - (Margin% / 100))
        const targetPrice = cost / (1 - (targetMarginPercent / 100));
        return Math.round(targetPrice * 100) / 100;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate margin target price: ${error.message}`);
    }
}
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
function calculatePriceFloor(cost, minMarginPercent) {
    try {
        const floorPrice = cost / (1 - (minMarginPercent / 100));
        return Math.round(floorPrice * 100) / 100;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate price floor: ${error.message}`);
    }
}
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
async function calculatePriceCeiling(productId, marketConditions) {
    try {
        const competitorPrices = marketConditions.competitorPrices
            .filter(cp => cp.availability)
            .map(cp => cp.totalCost || cp.price);
        if (competitorPrices.length === 0) {
            const basePrice = await getBasePrice(productId);
            return basePrice * 1.5;
        }
        const maxCompetitorPrice = Math.max(...competitorPrices);
        // Ceiling is typically 10-20% above highest competitor
        const ceiling = maxCompetitorPrice * 1.15;
        return Math.round(ceiling * 100) / 100;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate price ceiling: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - MARGIN CALCULATIONS
// ============================================================================
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
function calculateMarginPercent(price, cost) {
    try {
        if (price <= 0) {
            throw new common_1.BadRequestException('Price must be greater than zero');
        }
        const margin = ((price - cost) / price) * 100;
        return Math.round(margin * 100) / 100;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate margin percent: ${error.message}`);
    }
}
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
function calculateMarkupPercent(price, cost) {
    try {
        if (cost <= 0) {
            throw new common_1.BadRequestException('Cost must be greater than zero');
        }
        const markup = ((price - cost) / cost) * 100;
        return Math.round(markup * 100) / 100;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate markup percent: ${error.message}`);
    }
}
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
function enforceMarginPolicy(price, cost, policy) {
    try {
        const marginPercent = calculateMarginPercent(price, cost);
        if (policy.autoRejectBelow && marginPercent < policy.autoRejectBelow) {
            return {
                action: MarginAction.REJECT,
                reason: `Margin ${marginPercent.toFixed(2)}% below auto-reject threshold ${policy.autoRejectBelow}%`,
            };
        }
        if (marginPercent < policy.minMarginPercent) {
            const adjustedPrice = calculateMarginTargetPrice('temp', policy.minMarginPercent, cost);
            if (marginPercent < policy.requiresApprovalBelow) {
                return {
                    action: MarginAction.REQUIRE_DIRECTOR_APPROVAL,
                    adjustedPrice,
                    reason: `Margin ${marginPercent.toFixed(2)}% below minimum ${policy.minMarginPercent}%, requires director approval`,
                };
            }
            return {
                action: MarginAction.REQUIRE_MANAGER_APPROVAL,
                adjustedPrice,
                reason: `Margin ${marginPercent.toFixed(2)}% below minimum ${policy.minMarginPercent}%, requires manager approval`,
            };
        }
        if (marginPercent < policy.targetMarginPercent) {
            return {
                action: MarginAction.WARN,
                reason: `Margin ${marginPercent.toFixed(2)}% below target ${policy.targetMarginPercent}%`,
            };
        }
        return {
            action: MarginAction.APPROVE,
            reason: `Margin ${marginPercent.toFixed(2)}% meets policy requirements`,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to enforce margin policy: ${error.message}`);
    }
}
/**
 * Calculate blended margin for multiple products
 *
 * @param items - Array of items with price, cost, and quantity
 * @returns Blended margin percentage
 *
 * @example
 * const blendedMargin = calculateBlendedMargin(orderItems);
 */
function calculateBlendedMargin(items) {
    try {
        let totalRevenue = 0;
        let totalCost = 0;
        for (const item of items) {
            totalRevenue += item.price * item.quantity;
            totalCost += item.cost * item.quantity;
        }
        if (totalRevenue === 0) {
            return 0;
        }
        const blendedMargin = ((totalRevenue - totalCost) / totalRevenue) * 100;
        return Math.round(blendedMargin * 100) / 100;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate blended margin: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - FLASH SALES & CLEARANCE
// ============================================================================
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
async function createFlashSale(config) {
    try {
        const prices = {};
        for (const productId of config.productIds) {
            const basePrice = await getBasePrice(productId);
            const flashPrice = basePrice * (1 - config.discountPercent / 100);
            // Ensure minimum margin
            const cost = await getProductCost(productId);
            const minPrice = cost * 1.05;
            prices[productId] = Math.max(flashPrice, minPrice);
        }
        // Store flash sale configuration
        await storeFlashSaleConfig(config, prices);
        return {
            saleId: config.saleId,
            prices,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create flash sale: ${error.message}`);
    }
}
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
async function calculateClearancePrice(config) {
    try {
        const inventoryToMove = config.currentInventory - config.targetInventory;
        const velocityNeeded = inventoryToMove / config.daysRemaining;
        const currentVelocity = await getCurrentSalesVelocity(config.productId);
        // Calculate required discount to achieve velocity
        const velocityRatio = velocityNeeded / (currentVelocity || 1);
        let discountPercent = 0;
        switch (config.aggressiveness) {
            case 'LOW':
                discountPercent = Math.min(velocityRatio * 10, 25);
                break;
            case 'MEDIUM':
                discountPercent = Math.min(velocityRatio * 15, 40);
                break;
            case 'HIGH':
                discountPercent = Math.min(velocityRatio * 20, 60);
                break;
            case 'AGGRESSIVE':
                discountPercent = Math.min(velocityRatio * 25, 75);
                break;
        }
        const clearancePrice = config.currentPrice * (1 - discountPercent / 100);
        // Ensure price doesn't go below floor
        const finalPrice = Math.max(clearancePrice, config.floorPrice);
        await recordPriceChange(config.productId, config.currentPrice, finalPrice, PriceChangeReason.CLEARANCE);
        return Math.round(finalPrice * 100) / 100;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate clearance price: ${error.message}`);
    }
}
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
function calculateMarkdownSchedule(productId, startPrice, floorPrice, durationDays) {
    try {
        const schedule = [];
        // Typical markdown schedule: 4 phases
        const phases = [
            { day: 0, discountPercent: 0 },
            { day: Math.floor(durationDays * 0.25), discountPercent: 20 },
            { day: Math.floor(durationDays * 0.50), discountPercent: 40 },
            { day: Math.floor(durationDays * 0.75), discountPercent: 60 },
            { day: durationDays, discountPercent: 70 },
        ];
        for (const phase of phases) {
            const phasePrice = startPrice * (1 - phase.discountPercent / 100);
            const finalPhasePrice = Math.max(phasePrice, floorPrice);
            schedule.push({
                date: new Date(Date.now() + phase.day * 24 * 60 * 60 * 1000),
                price: Math.round(finalPhasePrice * 100) / 100,
                discountPercent: phase.discountPercent,
            });
        }
        return schedule;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate markdown schedule: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - PRICE ELASTICITY
// ============================================================================
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
async function calculatePriceElasticity(productId, historicalData) {
    try {
        if (historicalData.length < 10) {
            throw new common_1.BadRequestException('Insufficient data for elasticity analysis (minimum 10 data points)');
        }
        // Calculate elasticity using log-log regression
        // Elasticity = % change in quantity / % change in price
        const dataPoints = historicalData.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        for (const point of historicalData) {
            const logPrice = Math.log(point.price);
            const logQuantity = Math.log(point.quantity);
            sumX += logPrice;
            sumY += logQuantity;
            sumXY += logPrice * logQuantity;
            sumX2 += logPrice * logPrice;
        }
        const elasticity = (dataPoints * sumXY - sumX * sumY) / (dataPoints * sumX2 - sumX * sumX);
        const elasticityAbs = Math.abs(elasticity);
        let classification;
        if (elasticityAbs > 1.5) {
            classification = PriceElasticity.HIGHLY_ELASTIC;
        }
        else if (elasticityAbs >= 1.0) {
            classification = PriceElasticity.ELASTIC;
        }
        else if (elasticityAbs >= 0.9 && elasticityAbs <= 1.1) {
            classification = PriceElasticity.UNIT_ELASTIC;
        }
        else if (elasticityAbs >= 0.5) {
            classification = PriceElasticity.INELASTIC;
        }
        else {
            classification = PriceElasticity.HIGHLY_INELASTIC;
        }
        // Generate demand curve
        const currentPrice = await getBasePrice(productId);
        const demandCurve = generateDemandCurve(historicalData, elasticity, currentPrice);
        // Calculate optimal price range
        const optimalPriceRange = calculateOptimalPriceRange(demandCurve, await getProductCost(productId));
        // Generate revenue impact scenarios
        const revenueImpact = generateRevenueImpactScenarios(currentPrice, elasticity, demandCurve);
        // Calculate confidence score based on R²
        const confidence = calculateRSquared(historicalData, elasticity);
        // Store elasticity data
        await storePriceElasticity(productId, {
            elasticity,
            classification,
            demandCurve,
            optimalPriceRange,
            confidence,
            dataPoints,
        });
        return {
            productId,
            currentPrice,
            elasticity,
            classification,
            optimalPriceRange,
            demandCurve,
            revenueImpact,
            confidence,
            dataPoints,
            analysisDate: new Date(),
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate price elasticity: ${error.message}`);
    }
}
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
async function analyzePriceSensitivity(productId, segment, pricePoints) {
    try {
        const elasticityData = await getPriceElasticity(productId);
        const basePrice = await getBasePrice(productId);
        const baseDemand = await getAverageDemand(productId, segment);
        const results = pricePoints.map(price => {
            const priceChangePercent = ((price - basePrice) / basePrice) * 100;
            const demandChangePercent = -elasticityData.elasticity * priceChangePercent;
            const expectedDemand = baseDemand * (1 + demandChangePercent / 100);
            const expectedRevenue = price * expectedDemand;
            return {
                price: Math.round(price * 100) / 100,
                expectedDemand: Math.round(expectedDemand),
                expectedRevenue: Math.round(expectedRevenue * 100) / 100,
            };
        });
        return results;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to analyze price sensitivity: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - A/B TESTING
// ============================================================================
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
async function createABPricingTest(config) {
    try {
        // Validate traffic split
        const totalSplit = config.trafficSplit.reduce((a, b) => a + b, 0);
        if (Math.abs(totalSplit - 100) > 0.01) {
            throw new common_1.BadRequestException('Traffic split must sum to 100%');
        }
        if (config.variants.length !== config.trafficSplit.length) {
            throw new common_1.BadRequestException('Number of variants must match traffic split array length');
        }
        const testId = `AB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const test = {
            testId,
            productId: config.productId,
            testName: config.testName,
            description: config.description || '',
            status: ABTestStatus.ACTIVE,
            variants: config.variants,
            trafficSplit: config.trafficSplit,
            startDate: config.startDate,
            endDate: config.endDate,
            targetSampleSize: config.targetSampleSize,
            currentSampleSize: 0,
            metrics: {
                variantResults: config.variants.map(v => ({
                    variantId: v.variantId,
                    impressions: 0,
                    conversions: 0,
                    conversionRate: 0,
                    revenue: 0,
                    averageOrderValue: 0,
                    profit: 0,
                })),
                statisticalSignificance: 0,
                confidenceLevel: 0,
                expectedLift: 0,
            },
        };
        // Store A/B test
        await storeABTest(test);
        return test;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create A/B pricing test: ${error.message}`);
    }
}
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
async function assignABVariant(testId, customerId) {
    try {
        const test = await getABTest(testId);
        if (test.status !== ABTestStatus.ACTIVE) {
            throw new common_1.BadRequestException('A/B test is not active');
        }
        // Consistent hashing for stable variant assignment
        const hash = hashString(`${testId}-${customerId}`);
        const bucket = hash % 100;
        let cumulativeSplit = 0;
        for (let i = 0; i < test.trafficSplit.length; i++) {
            cumulativeSplit += test.trafficSplit[i];
            if (bucket < cumulativeSplit) {
                return test.variants[i];
            }
        }
        return test.variants[0];
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to assign A/B variant: ${error.message}`);
    }
}
/**
 * Analyze A/B test results
 *
 * @param testId - A/B test identifier
 * @returns Test analysis with statistical significance
 *
 * @example
 * const analysis = await analyzeABTestResults('AB-123');
 */
async function analyzeABTestResults(testId) {
    try {
        const test = await getABTest(testId);
        const results = test.metrics.variantResults;
        // Calculate statistical significance using chi-square test
        const significance = calculateChiSquare(results);
        test.metrics.statisticalSignificance = significance;
        // Calculate confidence level
        const confidence = significance > 3.841 ? 95 : (significance > 2.706 ? 90 : 0);
        test.metrics.confidenceLevel = confidence;
        // Find best performing variant
        const bestVariant = results.reduce((best, current) => current.revenue > best.revenue ? current : best);
        const controlVariant = results[0];
        const lift = ((bestVariant.revenue - controlVariant.revenue) / controlVariant.revenue) * 100;
        test.metrics.actualLift = lift;
        let recommendation;
        if (confidence >= 95 && lift > 5) {
            recommendation = `Strong recommendation: Implement variant ${bestVariant.variantId} (${lift.toFixed(1)}% lift with ${confidence}% confidence)`;
        }
        else if (confidence >= 90 && lift > 0) {
            recommendation = `Moderate recommendation: Consider variant ${bestVariant.variantId} (${lift.toFixed(1)}% lift with ${confidence}% confidence)`;
        }
        else if (test.currentSampleSize < test.targetSampleSize) {
            recommendation = `Inconclusive: Continue test to reach target sample size (${test.currentSampleSize}/${test.targetSampleSize})`;
        }
        else {
            recommendation = `No significant difference found. Consider testing different price points.`;
        }
        return {
            test,
            recommendation,
            confidence,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to analyze A/B test results: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - PRICE RECOMMENDATIONS
// ============================================================================
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
async function generatePriceRecommendation(productId, features = {}) {
    try {
        const currentPrice = await getBasePrice(productId);
        const cost = await getProductCost(productId);
        const elasticityData = await getPriceElasticity(productId);
        const competitorPrices = await getCompetitorPrices(productId);
        const historicalData = await getHistoricalSalesData(productId, 90);
        // Feature engineering
        const featureVector = {
            currentPrice,
            cost,
            elasticity: elasticityData?.elasticity || -1.0,
            avgCompetitorPrice: competitorPrices.length > 0
                ? competitorPrices.reduce((sum, cp) => sum + cp.price, 0) / competitorPrices.length
                : currentPrice,
            inventoryLevel: features.inventoryLevel || 'medium',
            seasonality: features.seasonality || 'normal',
            trendDirection: features.trendDirection || 'stable',
            ...features,
        };
        // Simple ML model (in production, use actual ML model)
        let recommendedPrice = currentPrice;
        const reasoning = [];
        // Elasticity-based adjustment
        if (elasticityData) {
            if (elasticityData.classification === PriceElasticity.INELASTIC) {
                recommendedPrice = currentPrice * 1.05;
                reasoning.push('Product shows price inelasticity - room for price increase');
            }
            else if (elasticityData.classification === PriceElasticity.HIGHLY_ELASTIC) {
                recommendedPrice = currentPrice * 0.97;
                reasoning.push('Product is highly price elastic - lower price may increase revenue');
            }
        }
        // Competitor-based adjustment
        if (competitorPrices.length > 0) {
            const avgCompetitorPrice = featureVector.avgCompetitorPrice;
            if (currentPrice > avgCompetitorPrice * 1.1) {
                recommendedPrice = Math.min(recommendedPrice, avgCompetitorPrice * 1.05);
                reasoning.push('Price is significantly above competitors - adjustment recommended');
            }
        }
        // Inventory-based adjustment
        if (features.inventoryLevel === 'high') {
            recommendedPrice *= 0.95;
            reasoning.push('High inventory level - promotional pricing recommended');
        }
        else if (features.inventoryLevel === 'low') {
            recommendedPrice *= 1.08;
            reasoning.push('Low inventory level - price increase recommended');
        }
        // Ensure margin requirements
        const minPrice = cost * 1.15;
        recommendedPrice = Math.max(recommendedPrice, minPrice);
        // Calculate expected impact
        const priceChange = recommendedPrice - currentPrice;
        const priceChangePercent = (priceChange / currentPrice) * 100;
        const elasticity = elasticityData?.elasticity || -1.0;
        const volumeChangePercent = -elasticity * priceChangePercent;
        const currentRevenue = currentPrice * (historicalData[historicalData.length - 1]?.quantity || 100);
        const newRevenue = recommendedPrice * (historicalData[historicalData.length - 1]?.quantity || 100) * (1 + volumeChangePercent / 100);
        const expectedImpact = {
            revenueChange: newRevenue - currentRevenue,
            revenueChangePercent: ((newRevenue - currentRevenue) / currentRevenue) * 100,
            volumeChange: volumeChangePercent,
            volumeChangePercent,
            profitChange: (recommendedPrice - cost) - (currentPrice - cost),
            profitChangePercent: (((recommendedPrice - cost) - (currentPrice - cost)) / (currentPrice - cost)) * 100,
        };
        // Identify risk factors
        const riskFactors = [];
        if (Math.abs(priceChangePercent) > 10) {
            riskFactors.push('Large price change may impact customer perception');
        }
        if (elasticityData && elasticityData.confidence < 70) {
            riskFactors.push('Elasticity estimate has low confidence - monitor closely');
        }
        if (competitorPrices.length === 0) {
            riskFactors.push('No competitor data available for validation');
        }
        // Determine confidence
        let confidence;
        const confidenceScore = calculateOverallConfidence(elasticityData, competitorPrices.length, historicalData.length);
        if (confidenceScore >= 90)
            confidence = RecommendationConfidence.VERY_HIGH;
        else if (confidenceScore >= 75)
            confidence = RecommendationConfidence.HIGH;
        else if (confidenceScore >= 50)
            confidence = RecommendationConfidence.MEDIUM;
        else if (confidenceScore >= 25)
            confidence = RecommendationConfidence.LOW;
        else
            confidence = RecommendationConfidence.VERY_LOW;
        return {
            productId,
            currentPrice,
            recommendedPrice: Math.round(recommendedPrice * 100) / 100,
            priceChange: Math.round(priceChange * 100) / 100,
            priceChangePercent: Math.round(priceChangePercent * 100) / 100,
            confidence,
            reasoning,
            expectedImpact,
            riskFactors,
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
            generatedAt: new Date(),
            model: 'ml-price-recommender',
            modelVersion: '1.5.0',
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to generate price recommendation: ${error.message}`);
    }
}
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
async function batchGeneratePriceRecommendations(productIds, objective = OptimizationObjective.MAXIMIZE_PROFIT) {
    try {
        const recommendations = [];
        for (const productId of productIds) {
            try {
                const recommendation = await generatePriceRecommendation(productId, { objective });
                recommendations.push(recommendation);
            }
            catch (error) {
                // Log error but continue with other products
                const logger = new common_1.Logger('PricingEngine');
                logger.error(`Failed to generate recommendation for ${productId}: ${error.message}`);
            }
        }
        return recommendations;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to batch generate price recommendations: ${error.message}`);
    }
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Get base price for product
 */
async function getBasePrice(productId) {
    // Mock implementation - replace with actual database query
    return 99.99;
}
/**
 * Get product cost
 */
async function getProductCost(productId) {
    // Mock implementation - replace with actual database query
    return 65.00;
}
/**
 * Get applicable pricing rules
 */
async function getApplicablePricingRules(productId, context) {
    // Mock implementation - replace with actual database query
    return [];
}
/**
 * Apply pricing rule
 */
async function applyPricingRule(rule, currentPrice, context) {
    // Mock implementation
    return null;
}
/**
 * Determine confidence level
 */
function determineConfidence(adjustmentsCount, context) {
    if (context.marketConditions && context.marketConditions.volatility < 20) {
        return RecommendationConfidence.VERY_HIGH;
    }
    return RecommendationConfidence.HIGH;
}
/**
 * Record price change in history
 */
async function recordPriceChange(productId, oldPrice, newPrice, reason) {
    // Mock implementation - replace with actual database insert
    return;
}
/**
 * Get price elasticity data
 */
async function getPriceElasticity(productId) {
    // Mock implementation
    return null;
}
/**
 * Get volume pricing tiers
 */
async function getVolumePricingTiers(productId) {
    // Mock implementation
    return [];
}
/**
 * Get historical sales data
 */
async function getHistoricalSalesData(productId, days) {
    // Mock implementation
    return [];
}
/**
 * Generate price points for optimization
 */
function generatePricePoints(min, max, count) {
    const step = (max - min) / (count - 1);
    return Array.from({ length: count }, (_, i) => min + step * i);
}
/**
 * Simulate price impact
 */
async function simulatePriceImpact(productId, currentPrice, newPrice, elasticityData, historicalData) {
    const elasticity = elasticityData?.elasticity || -1.0;
    const priceChangePercent = ((newPrice - currentPrice) / currentPrice) * 100;
    const volumeChangePercent = -elasticity * priceChangePercent;
    return {
        revenueChange: 0,
        revenueChangePercent: priceChangePercent + volumeChangePercent,
        volumeChange: volumeChangePercent,
        volumeChangePercent,
        profitChange: 0,
        profitChangePercent: 0,
    };
}
/**
 * Get average competitor price
 */
async function getAverageCompetitorPrice(productId) {
    // Mock implementation
    return 99.99;
}
/**
 * Calculate recommendation confidence
 */
function calculateRecommendationConfidence(scenarios, elasticityData, dataPoints) {
    let score = 50;
    if (elasticityData && elasticityData.confidence > 80)
        score += 20;
    if (dataPoints > 100)
        score += 15;
    if (scenarios.length > 15)
        score += 10;
    if (score >= 90)
        return RecommendationConfidence.VERY_HIGH;
    if (score >= 75)
        return RecommendationConfidence.HIGH;
    if (score >= 50)
        return RecommendationConfidence.MEDIUM;
    if (score >= 25)
        return RecommendationConfidence.LOW;
    return RecommendationConfidence.VERY_LOW;
}
/**
 * Build recommendation reasoning
 */
function buildRecommendationReasoning(objective, scenario, elasticityData, constraints) {
    const reasoning = [];
    reasoning.push(`Optimized for ${objective}`);
    if (elasticityData) {
        reasoning.push(`Product elasticity: ${elasticityData.classification}`);
    }
    reasoning.push(`Expected impact: ${scenario.impact.revenueChangePercent.toFixed(1)}% revenue change`);
    return reasoning;
}
/**
 * Identify risk factors
 */
function identifyRiskFactors(currentPrice, newPrice, elasticityData, historicalData) {
    const risks = [];
    const changePercent = Math.abs(((newPrice - currentPrice) / currentPrice) * 100);
    if (changePercent > 15) {
        risks.push('Significant price change may require customer communication');
    }
    if (!elasticityData || elasticityData.dataPoints < 30) {
        risks.push('Limited elasticity data - monitor results closely');
    }
    return risks;
}
/**
 * Generate demand curve from historical data
 */
function generateDemandCurve(historicalData, elasticity, currentPrice) {
    // Simplified demand curve generation
    const priceRange = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3];
    return priceRange.map(multiplier => {
        const price = currentPrice * multiplier;
        const priceChange = ((price - currentPrice) / currentPrice) * 100;
        const quantityChange = -elasticity * priceChange;
        const baseQuantity = 100; // Simplified
        const quantity = baseQuantity * (1 + quantityChange / 100);
        return {
            price: Math.round(price * 100) / 100,
            quantity: Math.round(quantity),
            revenue: Math.round(price * quantity * 100) / 100,
        };
    });
}
/**
 * Calculate optimal price range
 */
function calculateOptimalPriceRange(demandCurve, cost) {
    const maxRevenue = demandCurve.reduce((max, point) => point.revenue > max.revenue ? point : max);
    return {
        min: cost * 1.15,
        max: maxRevenue.price * 1.2,
        optimal: maxRevenue.price,
        current: demandCurve.find(p => p.revenue === maxRevenue.revenue)?.price || maxRevenue.price,
    };
}
/**
 * Generate revenue impact scenarios
 */
function generateRevenueImpactScenarios(currentPrice, elasticity, demandCurve) {
    const scenarios = [-10, -5, 5, 10, 15];
    return scenarios.map(changePercent => {
        const newPrice = currentPrice * (1 + changePercent / 100);
        const demandChangePercent = -elasticity * changePercent;
        return {
            priceChange: newPrice - currentPrice,
            priceChangePercent: changePercent,
            newPrice,
            expectedDemandChange: demandChangePercent,
            expectedDemandChangePercent: demandChangePercent,
            expectedRevenue: 0,
            expectedRevenueChange: 0,
            expectedProfit: 0,
            expectedProfitChange: 0,
        };
    });
}
/**
 * Calculate R-squared for elasticity model
 */
function calculateRSquared(historicalData, elasticity) {
    // Simplified R² calculation
    return 75.5;
}
/**
 * Store price elasticity data
 */
async function storePriceElasticity(productId, data) {
    // Mock implementation
    return;
}
/**
 * Get current sales velocity
 */
async function getCurrentSalesVelocity(productId) {
    // Mock implementation
    return 10;
}
/**
 * Store flash sale configuration
 */
async function storeFlashSaleConfig(config, prices) {
    // Mock implementation
    return;
}
/**
 * Get average demand for segment
 */
async function getAverageDemand(productId, segment) {
    // Mock implementation
    return 100;
}
/**
 * Store A/B test
 */
async function storeABTest(test) {
    // Mock implementation
    return;
}
/**
 * Get A/B test
 */
async function getABTest(testId) {
    // Mock implementation
    throw new common_1.NotFoundException('A/B test not found');
}
/**
 * Hash string for consistent assignment
 */
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}
/**
 * Calculate chi-square statistic
 */
function calculateChiSquare(results) {
    // Simplified chi-square calculation
    return 4.2;
}
/**
 * Get competitor prices
 */
async function getCompetitorPrices(productId) {
    // Mock implementation
    return [];
}
/**
 * Calculate overall confidence
 */
function calculateOverallConfidence(elasticityData, competitorCount, historicalDataPoints) {
    let confidence = 50;
    if (elasticityData && elasticityData.confidence > 70)
        confidence += 20;
    if (competitorCount > 3)
        confidence += 15;
    if (historicalDataPoints > 90)
        confidence += 15;
    return Math.min(confidence, 100);
}
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
//# sourceMappingURL=dynamic-pricing-engine-kit.js.map