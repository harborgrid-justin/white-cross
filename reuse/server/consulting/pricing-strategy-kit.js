"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingStrategyKit = exports.PriceSegmentationModel = exports.ValueBasedPricingModel = exports.PriceOptimizationModel = exports.DiscountStructureModel = exports.PricingWaterfallModel = exports.CompetitivePricingModel = exports.PriceElasticityModel = exports.PricingStrategyModel = exports.CreatePriceSegmentationDto = exports.CreateValueBasedPricingDto = exports.CreatePriceOptimizationDto = exports.CreateDiscountStructureDto = exports.CreatePricingWaterfallDto = exports.CreateCompetitivePricingDto = exports.CreatePriceElasticityDto = exports.CreatePricingStrategyDto = exports.RevenueMetric = exports.AnalysisStatus = exports.PsychologicalTactic = exports.OptimizationObjective = exports.CompetitivePosition = exports.DiscountType = exports.PriceSegment = exports.WaterfallComponent = exports.PriceElasticity = exports.PricingStrategy = void 0;
exports.createPricingStrategy = createPricingStrategy;
exports.calculatePriceElasticity = calculatePriceElasticity;
exports.generateDemandCurve = generateDemandCurve;
exports.optimizePriceForRevenue = optimizePriceForRevenue;
exports.optimizePriceForProfit = optimizePriceForProfit;
exports.calculateCompetitivePosition = calculateCompetitivePosition;
exports.buildPricingWaterfall = buildPricingWaterfall;
exports.calculateWaterfallLeakage = calculateWaterfallLeakage;
exports.analyzeWaterfallComponents = analyzeWaterfallComponents;
exports.createValueBasedPricing = createValueBasedPricing;
exports.calculateEconomicValue = calculateEconomicValue;
exports.computeValueDriversScore = computeValueDriversScore;
exports.determineValueCapturePercent = determineValueCapturePercent;
exports.createDiscountStructure = createDiscountStructure;
exports.calculateVolumeDiscountTiers = calculateVolumeDiscountTiers;
exports.applyDiscount = applyDiscount;
exports.calculateCumulativeDiscounts = calculateCumulativeDiscounts;
exports.createPriceSegmentation = createPriceSegmentation;
exports.segmentByWillingnessToPay = segmentByWillingnessToPay;
exports.calculatePriceSensitivity = calculatePriceSensitivity;
exports.applyPsychologicalPricing = applyPsychologicalPricing;
exports.createBundlePricing = createBundlePricing;
exports.calculateTieredPricing = calculateTieredPricing;
exports.optimizeDynamicPricing = optimizeDynamicPricing;
exports.calculatePromotionalEffectiveness = calculatePromotionalEffectiveness;
exports.analyzePriceVolumeMix = analyzePriceVolumeMix;
exports.calculatePriceFloor = calculatePriceFloor;
exports.calculatePriceCeiling = calculatePriceCeiling;
exports.performSensitivityAnalysis = performSensitivityAnalysis;
exports.calculateBreakEvenPrice = calculateBreakEvenPrice;
exports.analyzeCompetitivePricingGaps = analyzeCompetitivePricingGaps;
exports.generatePriceRecommendation = generatePriceRecommendation;
exports.calculateRevenueAtRisk = calculateRevenueAtRisk;
exports.modelPriceChangeScenarios = modelPriceChangeScenarios;
exports.calculateCLVImpact = calculateCLVImpact;
exports.optimizeSubscriptionTiers = optimizeSubscriptionTiers;
exports.calculatePriceDiscrimination = calculatePriceDiscrimination;
exports.calculateFreemiumMetrics = calculateFreemiumMetrics;
exports.generatePricingRecommendations = generatePricingRecommendations;
exports.calculatePricingPower = calculatePricingPower;
exports.trackPricingPerformance = trackPricingPerformance;
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
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Pricing strategy types
 */
var PricingStrategy;
(function (PricingStrategy) {
    PricingStrategy["COST_PLUS"] = "cost_plus";
    PricingStrategy["VALUE_BASED"] = "value_based";
    PricingStrategy["COMPETITIVE"] = "competitive";
    PricingStrategy["PENETRATION"] = "penetration";
    PricingStrategy["SKIMMING"] = "skimming";
    PricingStrategy["DYNAMIC"] = "dynamic";
    PricingStrategy["FREEMIUM"] = "freemium";
    PricingStrategy["PSYCHOLOGICAL"] = "psychological";
    PricingStrategy["BUNDLE"] = "bundle";
    PricingStrategy["TIERED"] = "tiered";
})(PricingStrategy || (exports.PricingStrategy = PricingStrategy = {}));
/**
 * Price elasticity categories
 */
var PriceElasticity;
(function (PriceElasticity) {
    PriceElasticity["PERFECTLY_ELASTIC"] = "perfectly_elastic";
    PriceElasticity["ELASTIC"] = "elastic";
    PriceElasticity["UNIT_ELASTIC"] = "unit_elastic";
    PriceElasticity["INELASTIC"] = "inelastic";
    PriceElasticity["PERFECTLY_INELASTIC"] = "perfectly_inelastic";
})(PriceElasticity || (exports.PriceElasticity = PriceElasticity = {}));
/**
 * Pricing waterfall components
 */
var WaterfallComponent;
(function (WaterfallComponent) {
    WaterfallComponent["LIST_PRICE"] = "list_price";
    WaterfallComponent["INVOICE_DISCOUNT"] = "invoice_discount";
    WaterfallComponent["OFF_INVOICE_DISCOUNT"] = "off_invoice_discount";
    WaterfallComponent["REBATE"] = "rebate";
    WaterfallComponent["PROMOTIONAL_ALLOWANCE"] = "promotional_allowance";
    WaterfallComponent["PAYMENT_TERMS"] = "payment_terms";
    WaterfallComponent["FREIGHT"] = "freight";
    WaterfallComponent["POCKET_PRICE"] = "pocket_price";
})(WaterfallComponent || (exports.WaterfallComponent = WaterfallComponent = {}));
/**
 * Customer price segments
 */
var PriceSegment;
(function (PriceSegment) {
    PriceSegment["PREMIUM"] = "premium";
    PriceSegment["MID_MARKET"] = "mid_market";
    PriceSegment["VALUE"] = "value";
    PriceSegment["ECONOMY"] = "economy";
    PriceSegment["ENTERPRISE"] = "enterprise";
    PriceSegment["SMB"] = "smb";
    PriceSegment["CUSTOM"] = "custom";
})(PriceSegment || (exports.PriceSegment = PriceSegment = {}));
/**
 * Discount types
 */
var DiscountType;
(function (DiscountType) {
    DiscountType["VOLUME"] = "volume";
    DiscountType["EARLY_PAYMENT"] = "early_payment";
    DiscountType["SEASONAL"] = "seasonal";
    DiscountType["PROMOTIONAL"] = "promotional";
    DiscountType["LOYALTY"] = "loyalty";
    DiscountType["BUNDLE"] = "bundle";
    DiscountType["CONTRACT"] = "contract";
    DiscountType["NEGOTIATED"] = "negotiated";
})(DiscountType || (exports.DiscountType = DiscountType = {}));
/**
 * Competitive position
 */
var CompetitivePosition;
(function (CompetitivePosition) {
    CompetitivePosition["PREMIUM"] = "premium";
    CompetitivePosition["PARITY"] = "parity";
    CompetitivePosition["DISCOUNT"] = "discount";
    CompetitivePosition["PENETRATION"] = "penetration";
})(CompetitivePosition || (exports.CompetitivePosition = CompetitivePosition = {}));
/**
 * Price optimization objective
 */
var OptimizationObjective;
(function (OptimizationObjective) {
    OptimizationObjective["MAXIMIZE_REVENUE"] = "maximize_revenue";
    OptimizationObjective["MAXIMIZE_PROFIT"] = "maximize_profit";
    OptimizationObjective["MAXIMIZE_VOLUME"] = "maximize_volume";
    OptimizationObjective["MAXIMIZE_MARKET_SHARE"] = "maximize_market_share";
    OptimizationObjective["TARGET_MARGIN"] = "target_margin";
})(OptimizationObjective || (exports.OptimizationObjective = OptimizationObjective = {}));
/**
 * Psychological pricing tactics
 */
var PsychologicalTactic;
(function (PsychologicalTactic) {
    PsychologicalTactic["CHARM_PRICING"] = "charm_pricing";
    PsychologicalTactic["PRESTIGE_PRICING"] = "prestige_pricing";
    PsychologicalTactic["ANCHOR_PRICING"] = "anchor_pricing";
    PsychologicalTactic["DECOY_PRICING"] = "decoy_pricing";
    PsychologicalTactic["BUNDLE_PRICING"] = "bundle_pricing";
    PsychologicalTactic["SCARCITY_PRICING"] = "scarcity_pricing";
})(PsychologicalTactic || (exports.PsychologicalTactic = PsychologicalTactic = {}));
/**
 * Pricing analysis status
 */
var AnalysisStatus;
(function (AnalysisStatus) {
    AnalysisStatus["DRAFT"] = "draft";
    AnalysisStatus["IN_PROGRESS"] = "in_progress";
    AnalysisStatus["COMPLETED"] = "completed";
    AnalysisStatus["APPROVED"] = "approved";
    AnalysisStatus["IMPLEMENTED"] = "implemented";
    AnalysisStatus["ARCHIVED"] = "archived";
})(AnalysisStatus || (exports.AnalysisStatus = AnalysisStatus = {}));
/**
 * Revenue metric types
 */
var RevenueMetric;
(function (RevenueMetric) {
    RevenueMetric["GROSS_REVENUE"] = "gross_revenue";
    RevenueMetric["NET_REVENUE"] = "net_revenue";
    RevenueMetric["POCKET_REVENUE"] = "pocket_revenue";
    RevenueMetric["RECURRING_REVENUE"] = "recurring_revenue";
    RevenueMetric["AVERAGE_REVENUE_PER_USER"] = "average_revenue_per_user";
})(RevenueMetric || (exports.RevenueMetric = RevenueMetric = {}));
willingness;
ToPay: number;
recommendedPrice: number;
valueCapturePercent: number;
analysisDate: Date;
metadata ?  : Record;
// ============================================================================
// DTO CLASSES
// ============================================================================
/**
 * DTO for creating a pricing strategy
 */
let CreatePricingStrategyDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _serviceId_decorators;
    let _serviceId_initializers = [];
    let _serviceId_extraInitializers = [];
    let _strategyType_decorators;
    let _strategyType_initializers = [];
    let _strategyType_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _targetSegment_decorators;
    let _targetSegment_initializers = [];
    let _targetSegment_extraInitializers = [];
    let _basePrice_decorators;
    let _basePrice_initializers = [];
    let _basePrice_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _objectives_decorators;
    let _objectives_initializers = [];
    let _objectives_extraInitializers = [];
    let _competitivePosition_decorators;
    let _competitivePosition_initializers = [];
    let _competitivePosition_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreatePricingStrategyDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.productId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
                this.serviceId = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _serviceId_initializers, void 0));
                this.strategyType = (__runInitializers(this, _serviceId_extraInitializers), __runInitializers(this, _strategyType_initializers, void 0));
                this.name = (__runInitializers(this, _strategyType_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.targetSegment = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _targetSegment_initializers, void 0));
                this.basePrice = (__runInitializers(this, _targetSegment_extraInitializers), __runInitializers(this, _basePrice_initializers, void 0));
                this.currency = (__runInitializers(this, _basePrice_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                this.objectives = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _objectives_initializers, void 0));
                this.competitivePosition = (__runInitializers(this, _objectives_extraInitializers), __runInitializers(this, _competitivePosition_initializers, void 0));
                this.metadata = (__runInitializers(this, _competitivePosition_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID', example: '550e8400-e29b-41d4-a716-446655440000' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID', example: '550e8400-e29b-41d4-a716-446655440001', required: false }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            _serviceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Service ID', example: '550e8400-e29b-41d4-a716-446655440002', required: false }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            _strategyType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Pricing strategy type', enum: PricingStrategy }), (0, class_validator_1.IsEnum)(PricingStrategy), (0, class_validator_1.IsNotEmpty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strategy name', example: 'Premium Value Strategy' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strategy description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _targetSegment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target price segment', enum: PriceSegment }), (0, class_validator_1.IsEnum)(PriceSegment), (0, class_validator_1.IsNotEmpty)()];
            _basePrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Base price', example: 99.99 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code', example: 'USD' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(3)];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _expirationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expiration date', required: false }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsOptional)()];
            _objectives_decorators = [(0, swagger_1.ApiProperty)({ description: 'Optimization objectives', enum: OptimizationObjective, isArray: true }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsEnum)(OptimizationObjective, { each: true })];
            _competitivePosition_decorators = [(0, swagger_1.ApiProperty)({ description: 'Competitive position', enum: CompetitivePosition }), (0, class_validator_1.IsEnum)(CompetitivePosition)];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _serviceId_decorators, { kind: "field", name: "serviceId", static: false, private: false, access: { has: obj => "serviceId" in obj, get: obj => obj.serviceId, set: (obj, value) => { obj.serviceId = value; } }, metadata: _metadata }, _serviceId_initializers, _serviceId_extraInitializers);
            __esDecorate(null, null, _strategyType_decorators, { kind: "field", name: "strategyType", static: false, private: false, access: { has: obj => "strategyType" in obj, get: obj => obj.strategyType, set: (obj, value) => { obj.strategyType = value; } }, metadata: _metadata }, _strategyType_initializers, _strategyType_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _targetSegment_decorators, { kind: "field", name: "targetSegment", static: false, private: false, access: { has: obj => "targetSegment" in obj, get: obj => obj.targetSegment, set: (obj, value) => { obj.targetSegment = value; } }, metadata: _metadata }, _targetSegment_initializers, _targetSegment_extraInitializers);
            __esDecorate(null, null, _basePrice_decorators, { kind: "field", name: "basePrice", static: false, private: false, access: { has: obj => "basePrice" in obj, get: obj => obj.basePrice, set: (obj, value) => { obj.basePrice = value; } }, metadata: _metadata }, _basePrice_initializers, _basePrice_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            __esDecorate(null, null, _objectives_decorators, { kind: "field", name: "objectives", static: false, private: false, access: { has: obj => "objectives" in obj, get: obj => obj.objectives, set: (obj, value) => { obj.objectives = value; } }, metadata: _metadata }, _objectives_initializers, _objectives_extraInitializers);
            __esDecorate(null, null, _competitivePosition_decorators, { kind: "field", name: "competitivePosition", static: false, private: false, access: { has: obj => "competitivePosition" in obj, get: obj => obj.competitivePosition, set: (obj, value) => { obj.competitivePosition = value; } }, metadata: _metadata }, _competitivePosition_initializers, _competitivePosition_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePricingStrategyDto = CreatePricingStrategyDto;
/**
 * DTO for price elasticity analysis
 */
let CreatePriceElasticityDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _segment_decorators;
    let _segment_initializers = [];
    let _segment_extraInitializers = [];
    let _elasticityCoefficient_decorators;
    let _elasticityCoefficient_initializers = [];
    let _elasticityCoefficient_extraInitializers = [];
    let _priceRange_decorators;
    let _priceRange_initializers = [];
    let _priceRange_extraInitializers = [];
    let _demandCurve_decorators;
    let _demandCurve_initializers = [];
    let _demandCurve_extraInitializers = [];
    let _confidenceInterval_decorators;
    let _confidenceInterval_initializers = [];
    let _confidenceInterval_extraInitializers = [];
    let _dataPoints_decorators;
    let _dataPoints_initializers = [];
    let _dataPoints_extraInitializers = [];
    let _methodology_decorators;
    let _methodology_initializers = [];
    let _methodology_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreatePriceElasticityDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.productId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
                this.segment = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _segment_initializers, void 0));
                this.elasticityCoefficient = (__runInitializers(this, _segment_extraInitializers), __runInitializers(this, _elasticityCoefficient_initializers, void 0));
                this.priceRange = (__runInitializers(this, _elasticityCoefficient_extraInitializers), __runInitializers(this, _priceRange_initializers, void 0));
                this.demandCurve = (__runInitializers(this, _priceRange_extraInitializers), __runInitializers(this, _demandCurve_initializers, void 0));
                this.confidenceInterval = (__runInitializers(this, _demandCurve_extraInitializers), __runInitializers(this, _confidenceInterval_initializers, void 0));
                this.dataPoints = (__runInitializers(this, _confidenceInterval_extraInitializers), __runInitializers(this, _dataPoints_initializers, void 0));
                this.methodology = (__runInitializers(this, _dataPoints_extraInitializers), __runInitializers(this, _methodology_initializers, void 0));
                this.metadata = (__runInitializers(this, _methodology_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _segment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer segment', enum: PriceSegment }), (0, class_validator_1.IsEnum)(PriceSegment), (0, class_validator_1.IsNotEmpty)()];
            _elasticityCoefficient_decorators = [(0, swagger_1.ApiProperty)({ description: 'Elasticity coefficient', example: -1.5 }), (0, class_validator_1.IsNumber)()];
            _priceRange_decorators = [(0, swagger_1.ApiProperty)({ description: 'Price range for analysis' }), (0, class_validator_1.IsObject)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(() => Object)];
            _demandCurve_decorators = [(0, swagger_1.ApiProperty)({ description: 'Demand curve data points' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _confidenceInterval_decorators = [(0, swagger_1.ApiProperty)({ description: 'Confidence interval', example: 0.95 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _dataPoints_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of data points used', example: 1000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _methodology_decorators = [(0, swagger_1.ApiProperty)({ description: 'Analysis methodology', example: 'Linear regression' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _segment_decorators, { kind: "field", name: "segment", static: false, private: false, access: { has: obj => "segment" in obj, get: obj => obj.segment, set: (obj, value) => { obj.segment = value; } }, metadata: _metadata }, _segment_initializers, _segment_extraInitializers);
            __esDecorate(null, null, _elasticityCoefficient_decorators, { kind: "field", name: "elasticityCoefficient", static: false, private: false, access: { has: obj => "elasticityCoefficient" in obj, get: obj => obj.elasticityCoefficient, set: (obj, value) => { obj.elasticityCoefficient = value; } }, metadata: _metadata }, _elasticityCoefficient_initializers, _elasticityCoefficient_extraInitializers);
            __esDecorate(null, null, _priceRange_decorators, { kind: "field", name: "priceRange", static: false, private: false, access: { has: obj => "priceRange" in obj, get: obj => obj.priceRange, set: (obj, value) => { obj.priceRange = value; } }, metadata: _metadata }, _priceRange_initializers, _priceRange_extraInitializers);
            __esDecorate(null, null, _demandCurve_decorators, { kind: "field", name: "demandCurve", static: false, private: false, access: { has: obj => "demandCurve" in obj, get: obj => obj.demandCurve, set: (obj, value) => { obj.demandCurve = value; } }, metadata: _metadata }, _demandCurve_initializers, _demandCurve_extraInitializers);
            __esDecorate(null, null, _confidenceInterval_decorators, { kind: "field", name: "confidenceInterval", static: false, private: false, access: { has: obj => "confidenceInterval" in obj, get: obj => obj.confidenceInterval, set: (obj, value) => { obj.confidenceInterval = value; } }, metadata: _metadata }, _confidenceInterval_initializers, _confidenceInterval_extraInitializers);
            __esDecorate(null, null, _dataPoints_decorators, { kind: "field", name: "dataPoints", static: false, private: false, access: { has: obj => "dataPoints" in obj, get: obj => obj.dataPoints, set: (obj, value) => { obj.dataPoints = value; } }, metadata: _metadata }, _dataPoints_initializers, _dataPoints_extraInitializers);
            __esDecorate(null, null, _methodology_decorators, { kind: "field", name: "methodology", static: false, private: false, access: { has: obj => "methodology" in obj, get: obj => obj.methodology, set: (obj, value) => { obj.methodology = value; } }, metadata: _metadata }, _methodology_initializers, _methodology_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePriceElasticityDto = CreatePriceElasticityDto;
/**
 * DTO for competitive pricing benchmark
 */
let CreateCompetitivePricingDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _competitorId_decorators;
    let _competitorId_initializers = [];
    let _competitorId_extraInitializers = [];
    let _competitorName_decorators;
    let _competitorName_initializers = [];
    let _competitorName_extraInitializers = [];
    let _competitorPrice_decorators;
    let _competitorPrice_initializers = [];
    let _competitorPrice_extraInitializers = [];
    let _ourPrice_decorators;
    let _ourPrice_initializers = [];
    let _ourPrice_extraInitializers = [];
    let _featureComparison_decorators;
    let _featureComparison_initializers = [];
    let _featureComparison_extraInitializers = [];
    let _valueScore_decorators;
    let _valueScore_initializers = [];
    let _valueScore_extraInitializers = [];
    let _benchmarkDate_decorators;
    let _benchmarkDate_initializers = [];
    let _benchmarkDate_extraInitializers = [];
    let _dataSource_decorators;
    let _dataSource_initializers = [];
    let _dataSource_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateCompetitivePricingDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.productId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
                this.competitorId = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _competitorId_initializers, void 0));
                this.competitorName = (__runInitializers(this, _competitorId_extraInitializers), __runInitializers(this, _competitorName_initializers, void 0));
                this.competitorPrice = (__runInitializers(this, _competitorName_extraInitializers), __runInitializers(this, _competitorPrice_initializers, void 0));
                this.ourPrice = (__runInitializers(this, _competitorPrice_extraInitializers), __runInitializers(this, _ourPrice_initializers, void 0));
                this.featureComparison = (__runInitializers(this, _ourPrice_extraInitializers), __runInitializers(this, _featureComparison_initializers, void 0));
                this.valueScore = (__runInitializers(this, _featureComparison_extraInitializers), __runInitializers(this, _valueScore_initializers, void 0));
                this.benchmarkDate = (__runInitializers(this, _valueScore_extraInitializers), __runInitializers(this, _benchmarkDate_initializers, void 0));
                this.dataSource = (__runInitializers(this, _benchmarkDate_extraInitializers), __runInitializers(this, _dataSource_initializers, void 0));
                this.metadata = (__runInitializers(this, _dataSource_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _competitorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Competitor ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _competitorName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Competitor name', example: 'Acme Corp' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _competitorPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Competitor price', example: 89.99 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _ourPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Our price', example: 99.99 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _featureComparison_decorators = [(0, swagger_1.ApiProperty)({ description: 'Feature comparison matrix' }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsNotEmpty)()];
            _valueScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Value score (0-100)', example: 85 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _benchmarkDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Benchmark date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _dataSource_decorators = [(0, swagger_1.ApiProperty)({ description: 'Data source', example: 'Public website' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _competitorId_decorators, { kind: "field", name: "competitorId", static: false, private: false, access: { has: obj => "competitorId" in obj, get: obj => obj.competitorId, set: (obj, value) => { obj.competitorId = value; } }, metadata: _metadata }, _competitorId_initializers, _competitorId_extraInitializers);
            __esDecorate(null, null, _competitorName_decorators, { kind: "field", name: "competitorName", static: false, private: false, access: { has: obj => "competitorName" in obj, get: obj => obj.competitorName, set: (obj, value) => { obj.competitorName = value; } }, metadata: _metadata }, _competitorName_initializers, _competitorName_extraInitializers);
            __esDecorate(null, null, _competitorPrice_decorators, { kind: "field", name: "competitorPrice", static: false, private: false, access: { has: obj => "competitorPrice" in obj, get: obj => obj.competitorPrice, set: (obj, value) => { obj.competitorPrice = value; } }, metadata: _metadata }, _competitorPrice_initializers, _competitorPrice_extraInitializers);
            __esDecorate(null, null, _ourPrice_decorators, { kind: "field", name: "ourPrice", static: false, private: false, access: { has: obj => "ourPrice" in obj, get: obj => obj.ourPrice, set: (obj, value) => { obj.ourPrice = value; } }, metadata: _metadata }, _ourPrice_initializers, _ourPrice_extraInitializers);
            __esDecorate(null, null, _featureComparison_decorators, { kind: "field", name: "featureComparison", static: false, private: false, access: { has: obj => "featureComparison" in obj, get: obj => obj.featureComparison, set: (obj, value) => { obj.featureComparison = value; } }, metadata: _metadata }, _featureComparison_initializers, _featureComparison_extraInitializers);
            __esDecorate(null, null, _valueScore_decorators, { kind: "field", name: "valueScore", static: false, private: false, access: { has: obj => "valueScore" in obj, get: obj => obj.valueScore, set: (obj, value) => { obj.valueScore = value; } }, metadata: _metadata }, _valueScore_initializers, _valueScore_extraInitializers);
            __esDecorate(null, null, _benchmarkDate_decorators, { kind: "field", name: "benchmarkDate", static: false, private: false, access: { has: obj => "benchmarkDate" in obj, get: obj => obj.benchmarkDate, set: (obj, value) => { obj.benchmarkDate = value; } }, metadata: _metadata }, _benchmarkDate_initializers, _benchmarkDate_extraInitializers);
            __esDecorate(null, null, _dataSource_decorators, { kind: "field", name: "dataSource", static: false, private: false, access: { has: obj => "dataSource" in obj, get: obj => obj.dataSource, set: (obj, value) => { obj.dataSource = value; } }, metadata: _metadata }, _dataSource_initializers, _dataSource_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCompetitivePricingDto = CreateCompetitivePricingDto;
/**
 * DTO for pricing waterfall analysis
 */
let CreatePricingWaterfallDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _segment_decorators;
    let _segment_initializers = [];
    let _segment_extraInitializers = [];
    let _listPrice_decorators;
    let _listPrice_initializers = [];
    let _listPrice_extraInitializers = [];
    let _invoiceDiscount_decorators;
    let _invoiceDiscount_initializers = [];
    let _invoiceDiscount_extraInitializers = [];
    let _offInvoiceDiscount_decorators;
    let _offInvoiceDiscount_initializers = [];
    let _offInvoiceDiscount_extraInitializers = [];
    let _rebates_decorators;
    let _rebates_initializers = [];
    let _rebates_extraInitializers = [];
    let _promotionalAllowances_decorators;
    let _promotionalAllowances_initializers = [];
    let _promotionalAllowances_extraInitializers = [];
    let _paymentTermsDiscount_decorators;
    let _paymentTermsDiscount_initializers = [];
    let _paymentTermsDiscount_extraInitializers = [];
    let _freight_decorators;
    let _freight_initializers = [];
    let _freight_extraInitializers = [];
    let _components_decorators;
    let _components_initializers = [];
    let _components_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreatePricingWaterfallDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.productId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
                this.customerId = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
                this.segment = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _segment_initializers, void 0));
                this.listPrice = (__runInitializers(this, _segment_extraInitializers), __runInitializers(this, _listPrice_initializers, void 0));
                this.invoiceDiscount = (__runInitializers(this, _listPrice_extraInitializers), __runInitializers(this, _invoiceDiscount_initializers, void 0));
                this.offInvoiceDiscount = (__runInitializers(this, _invoiceDiscount_extraInitializers), __runInitializers(this, _offInvoiceDiscount_initializers, void 0));
                this.rebates = (__runInitializers(this, _offInvoiceDiscount_extraInitializers), __runInitializers(this, _rebates_initializers, void 0));
                this.promotionalAllowances = (__runInitializers(this, _rebates_extraInitializers), __runInitializers(this, _promotionalAllowances_initializers, void 0));
                this.paymentTermsDiscount = (__runInitializers(this, _promotionalAllowances_extraInitializers), __runInitializers(this, _paymentTermsDiscount_initializers, void 0));
                this.freight = (__runInitializers(this, _paymentTermsDiscount_extraInitializers), __runInitializers(this, _freight_initializers, void 0));
                this.components = (__runInitializers(this, _freight_extraInitializers), __runInitializers(this, _components_initializers, void 0));
                this.metadata = (__runInitializers(this, _components_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID', required: false }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            _segment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Price segment', enum: PriceSegment }), (0, class_validator_1.IsEnum)(PriceSegment), (0, class_validator_1.IsNotEmpty)()];
            _listPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'List price', example: 100.00 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _invoiceDiscount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice discount', example: 5.00 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _offInvoiceDiscount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Off-invoice discount', example: 3.00 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _rebates_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rebates', example: 2.00 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _promotionalAllowances_decorators = [(0, swagger_1.ApiProperty)({ description: 'Promotional allowances', example: 1.50 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _paymentTermsDiscount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment terms discount', example: 1.00 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _freight_decorators = [(0, swagger_1.ApiProperty)({ description: 'Freight cost', example: 2.50 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _components_decorators = [(0, swagger_1.ApiProperty)({ description: 'Waterfall components breakdown' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _segment_decorators, { kind: "field", name: "segment", static: false, private: false, access: { has: obj => "segment" in obj, get: obj => obj.segment, set: (obj, value) => { obj.segment = value; } }, metadata: _metadata }, _segment_initializers, _segment_extraInitializers);
            __esDecorate(null, null, _listPrice_decorators, { kind: "field", name: "listPrice", static: false, private: false, access: { has: obj => "listPrice" in obj, get: obj => obj.listPrice, set: (obj, value) => { obj.listPrice = value; } }, metadata: _metadata }, _listPrice_initializers, _listPrice_extraInitializers);
            __esDecorate(null, null, _invoiceDiscount_decorators, { kind: "field", name: "invoiceDiscount", static: false, private: false, access: { has: obj => "invoiceDiscount" in obj, get: obj => obj.invoiceDiscount, set: (obj, value) => { obj.invoiceDiscount = value; } }, metadata: _metadata }, _invoiceDiscount_initializers, _invoiceDiscount_extraInitializers);
            __esDecorate(null, null, _offInvoiceDiscount_decorators, { kind: "field", name: "offInvoiceDiscount", static: false, private: false, access: { has: obj => "offInvoiceDiscount" in obj, get: obj => obj.offInvoiceDiscount, set: (obj, value) => { obj.offInvoiceDiscount = value; } }, metadata: _metadata }, _offInvoiceDiscount_initializers, _offInvoiceDiscount_extraInitializers);
            __esDecorate(null, null, _rebates_decorators, { kind: "field", name: "rebates", static: false, private: false, access: { has: obj => "rebates" in obj, get: obj => obj.rebates, set: (obj, value) => { obj.rebates = value; } }, metadata: _metadata }, _rebates_initializers, _rebates_extraInitializers);
            __esDecorate(null, null, _promotionalAllowances_decorators, { kind: "field", name: "promotionalAllowances", static: false, private: false, access: { has: obj => "promotionalAllowances" in obj, get: obj => obj.promotionalAllowances, set: (obj, value) => { obj.promotionalAllowances = value; } }, metadata: _metadata }, _promotionalAllowances_initializers, _promotionalAllowances_extraInitializers);
            __esDecorate(null, null, _paymentTermsDiscount_decorators, { kind: "field", name: "paymentTermsDiscount", static: false, private: false, access: { has: obj => "paymentTermsDiscount" in obj, get: obj => obj.paymentTermsDiscount, set: (obj, value) => { obj.paymentTermsDiscount = value; } }, metadata: _metadata }, _paymentTermsDiscount_initializers, _paymentTermsDiscount_extraInitializers);
            __esDecorate(null, null, _freight_decorators, { kind: "field", name: "freight", static: false, private: false, access: { has: obj => "freight" in obj, get: obj => obj.freight, set: (obj, value) => { obj.freight = value; } }, metadata: _metadata }, _freight_initializers, _freight_extraInitializers);
            __esDecorate(null, null, _components_decorators, { kind: "field", name: "components", static: false, private: false, access: { has: obj => "components" in obj, get: obj => obj.components, set: (obj, value) => { obj.components = value; } }, metadata: _metadata }, _components_initializers, _components_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePricingWaterfallDto = CreatePricingWaterfallDto;
/**
 * DTO for discount structure
 */
let CreateDiscountStructureDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _discountType_decorators;
    let _discountType_initializers = [];
    let _discountType_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _discountPercent_decorators;
    let _discountPercent_initializers = [];
    let _discountPercent_extraInitializers = [];
    let _discountAmount_decorators;
    let _discountAmount_initializers = [];
    let _discountAmount_extraInitializers = [];
    let _minimumQuantity_decorators;
    let _minimumQuantity_initializers = [];
    let _minimumQuantity_extraInitializers = [];
    let _minimumValue_decorators;
    let _minimumValue_initializers = [];
    let _minimumValue_extraInitializers = [];
    let _eligibleSegments_decorators;
    let _eligibleSegments_initializers = [];
    let _eligibleSegments_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateDiscountStructureDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.discountType = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _discountType_initializers, void 0));
                this.name = (__runInitializers(this, _discountType_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.discountPercent = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _discountPercent_initializers, void 0));
                this.discountAmount = (__runInitializers(this, _discountPercent_extraInitializers), __runInitializers(this, _discountAmount_initializers, void 0));
                this.minimumQuantity = (__runInitializers(this, _discountAmount_extraInitializers), __runInitializers(this, _minimumQuantity_initializers, void 0));
                this.minimumValue = (__runInitializers(this, _minimumQuantity_extraInitializers), __runInitializers(this, _minimumValue_initializers, void 0));
                this.eligibleSegments = (__runInitializers(this, _minimumValue_extraInitializers), __runInitializers(this, _eligibleSegments_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _eligibleSegments_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                this.metadata = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _discountType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount type', enum: DiscountType }), (0, class_validator_1.IsEnum)(DiscountType), (0, class_validator_1.IsNotEmpty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount name', example: 'Volume Discount - 1000+ units' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _discountPercent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount percentage', example: 15, required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100), (0, class_validator_1.IsOptional)()];
            _discountAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount amount', example: 10.00, required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsOptional)()];
            _minimumQuantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minimum quantity', example: 1000, required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsOptional)()];
            _minimumValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minimum value', example: 10000.00, required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsOptional)()];
            _eligibleSegments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Eligible segments', enum: PriceSegment, isArray: true }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsEnum)(PriceSegment, { each: true })];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _expirationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expiration date', required: false }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsOptional)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _discountType_decorators, { kind: "field", name: "discountType", static: false, private: false, access: { has: obj => "discountType" in obj, get: obj => obj.discountType, set: (obj, value) => { obj.discountType = value; } }, metadata: _metadata }, _discountType_initializers, _discountType_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _discountPercent_decorators, { kind: "field", name: "discountPercent", static: false, private: false, access: { has: obj => "discountPercent" in obj, get: obj => obj.discountPercent, set: (obj, value) => { obj.discountPercent = value; } }, metadata: _metadata }, _discountPercent_initializers, _discountPercent_extraInitializers);
            __esDecorate(null, null, _discountAmount_decorators, { kind: "field", name: "discountAmount", static: false, private: false, access: { has: obj => "discountAmount" in obj, get: obj => obj.discountAmount, set: (obj, value) => { obj.discountAmount = value; } }, metadata: _metadata }, _discountAmount_initializers, _discountAmount_extraInitializers);
            __esDecorate(null, null, _minimumQuantity_decorators, { kind: "field", name: "minimumQuantity", static: false, private: false, access: { has: obj => "minimumQuantity" in obj, get: obj => obj.minimumQuantity, set: (obj, value) => { obj.minimumQuantity = value; } }, metadata: _metadata }, _minimumQuantity_initializers, _minimumQuantity_extraInitializers);
            __esDecorate(null, null, _minimumValue_decorators, { kind: "field", name: "minimumValue", static: false, private: false, access: { has: obj => "minimumValue" in obj, get: obj => obj.minimumValue, set: (obj, value) => { obj.minimumValue = value; } }, metadata: _metadata }, _minimumValue_initializers, _minimumValue_extraInitializers);
            __esDecorate(null, null, _eligibleSegments_decorators, { kind: "field", name: "eligibleSegments", static: false, private: false, access: { has: obj => "eligibleSegments" in obj, get: obj => obj.eligibleSegments, set: (obj, value) => { obj.eligibleSegments = value; } }, metadata: _metadata }, _eligibleSegments_initializers, _eligibleSegments_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateDiscountStructureDto = CreateDiscountStructureDto;
/**
 * DTO for price optimization
 */
let CreatePriceOptimizationDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _objective_decorators;
    let _objective_initializers = [];
    let _objective_extraInitializers = [];
    let _currentPrice_decorators;
    let _currentPrice_initializers = [];
    let _currentPrice_extraInitializers = [];
    let _optimizedPrice_decorators;
    let _optimizedPrice_initializers = [];
    let _optimizedPrice_extraInitializers = [];
    let _expectedRevenue_decorators;
    let _expectedRevenue_initializers = [];
    let _expectedRevenue_extraInitializers = [];
    let _expectedProfit_decorators;
    let _expectedProfit_initializers = [];
    let _expectedProfit_extraInitializers = [];
    let _expectedVolume_decorators;
    let _expectedVolume_initializers = [];
    let _expectedVolume_extraInitializers = [];
    let _confidenceLevel_decorators;
    let _confidenceLevel_initializers = [];
    let _confidenceLevel_extraInitializers = [];
    let _constraints_decorators;
    let _constraints_initializers = [];
    let _constraints_extraInitializers = [];
    let _assumptions_decorators;
    let _assumptions_initializers = [];
    let _assumptions_extraInitializers = [];
    let _sensitivityAnalysis_decorators;
    let _sensitivityAnalysis_initializers = [];
    let _sensitivityAnalysis_extraInitializers = [];
    let _implementationDate_decorators;
    let _implementationDate_initializers = [];
    let _implementationDate_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreatePriceOptimizationDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.productId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
                this.objective = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _objective_initializers, void 0));
                this.currentPrice = (__runInitializers(this, _objective_extraInitializers), __runInitializers(this, _currentPrice_initializers, void 0));
                this.optimizedPrice = (__runInitializers(this, _currentPrice_extraInitializers), __runInitializers(this, _optimizedPrice_initializers, void 0));
                this.expectedRevenue = (__runInitializers(this, _optimizedPrice_extraInitializers), __runInitializers(this, _expectedRevenue_initializers, void 0));
                this.expectedProfit = (__runInitializers(this, _expectedRevenue_extraInitializers), __runInitializers(this, _expectedProfit_initializers, void 0));
                this.expectedVolume = (__runInitializers(this, _expectedProfit_extraInitializers), __runInitializers(this, _expectedVolume_initializers, void 0));
                this.confidenceLevel = (__runInitializers(this, _expectedVolume_extraInitializers), __runInitializers(this, _confidenceLevel_initializers, void 0));
                this.constraints = (__runInitializers(this, _confidenceLevel_extraInitializers), __runInitializers(this, _constraints_initializers, void 0));
                this.assumptions = (__runInitializers(this, _constraints_extraInitializers), __runInitializers(this, _assumptions_initializers, void 0));
                this.sensitivityAnalysis = (__runInitializers(this, _assumptions_extraInitializers), __runInitializers(this, _sensitivityAnalysis_initializers, void 0));
                this.implementationDate = (__runInitializers(this, _sensitivityAnalysis_extraInitializers), __runInitializers(this, _implementationDate_initializers, void 0));
                this.metadata = (__runInitializers(this, _implementationDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _objective_decorators = [(0, swagger_1.ApiProperty)({ description: 'Optimization objective', enum: OptimizationObjective }), (0, class_validator_1.IsEnum)(OptimizationObjective), (0, class_validator_1.IsNotEmpty)()];
            _currentPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current price', example: 99.99 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _optimizedPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Optimized price', example: 109.99 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _expectedRevenue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expected revenue', example: 1500000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _expectedProfit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expected profit', example: 450000 }), (0, class_validator_1.IsNumber)()];
            _expectedVolume_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expected volume', example: 15000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _confidenceLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Confidence level', example: 0.90 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _constraints_decorators = [(0, swagger_1.ApiProperty)({ description: 'Optimization constraints' }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsNotEmpty)()];
            _assumptions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Analysis assumptions' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _sensitivityAnalysis_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sensitivity analysis results' }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsNotEmpty)()];
            _implementationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Implementation date', required: false }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsOptional)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _objective_decorators, { kind: "field", name: "objective", static: false, private: false, access: { has: obj => "objective" in obj, get: obj => obj.objective, set: (obj, value) => { obj.objective = value; } }, metadata: _metadata }, _objective_initializers, _objective_extraInitializers);
            __esDecorate(null, null, _currentPrice_decorators, { kind: "field", name: "currentPrice", static: false, private: false, access: { has: obj => "currentPrice" in obj, get: obj => obj.currentPrice, set: (obj, value) => { obj.currentPrice = value; } }, metadata: _metadata }, _currentPrice_initializers, _currentPrice_extraInitializers);
            __esDecorate(null, null, _optimizedPrice_decorators, { kind: "field", name: "optimizedPrice", static: false, private: false, access: { has: obj => "optimizedPrice" in obj, get: obj => obj.optimizedPrice, set: (obj, value) => { obj.optimizedPrice = value; } }, metadata: _metadata }, _optimizedPrice_initializers, _optimizedPrice_extraInitializers);
            __esDecorate(null, null, _expectedRevenue_decorators, { kind: "field", name: "expectedRevenue", static: false, private: false, access: { has: obj => "expectedRevenue" in obj, get: obj => obj.expectedRevenue, set: (obj, value) => { obj.expectedRevenue = value; } }, metadata: _metadata }, _expectedRevenue_initializers, _expectedRevenue_extraInitializers);
            __esDecorate(null, null, _expectedProfit_decorators, { kind: "field", name: "expectedProfit", static: false, private: false, access: { has: obj => "expectedProfit" in obj, get: obj => obj.expectedProfit, set: (obj, value) => { obj.expectedProfit = value; } }, metadata: _metadata }, _expectedProfit_initializers, _expectedProfit_extraInitializers);
            __esDecorate(null, null, _expectedVolume_decorators, { kind: "field", name: "expectedVolume", static: false, private: false, access: { has: obj => "expectedVolume" in obj, get: obj => obj.expectedVolume, set: (obj, value) => { obj.expectedVolume = value; } }, metadata: _metadata }, _expectedVolume_initializers, _expectedVolume_extraInitializers);
            __esDecorate(null, null, _confidenceLevel_decorators, { kind: "field", name: "confidenceLevel", static: false, private: false, access: { has: obj => "confidenceLevel" in obj, get: obj => obj.confidenceLevel, set: (obj, value) => { obj.confidenceLevel = value; } }, metadata: _metadata }, _confidenceLevel_initializers, _confidenceLevel_extraInitializers);
            __esDecorate(null, null, _constraints_decorators, { kind: "field", name: "constraints", static: false, private: false, access: { has: obj => "constraints" in obj, get: obj => obj.constraints, set: (obj, value) => { obj.constraints = value; } }, metadata: _metadata }, _constraints_initializers, _constraints_extraInitializers);
            __esDecorate(null, null, _assumptions_decorators, { kind: "field", name: "assumptions", static: false, private: false, access: { has: obj => "assumptions" in obj, get: obj => obj.assumptions, set: (obj, value) => { obj.assumptions = value; } }, metadata: _metadata }, _assumptions_initializers, _assumptions_extraInitializers);
            __esDecorate(null, null, _sensitivityAnalysis_decorators, { kind: "field", name: "sensitivityAnalysis", static: false, private: false, access: { has: obj => "sensitivityAnalysis" in obj, get: obj => obj.sensitivityAnalysis, set: (obj, value) => { obj.sensitivityAnalysis = value; } }, metadata: _metadata }, _sensitivityAnalysis_initializers, _sensitivityAnalysis_extraInitializers);
            __esDecorate(null, null, _implementationDate_decorators, { kind: "field", name: "implementationDate", static: false, private: false, access: { has: obj => "implementationDate" in obj, get: obj => obj.implementationDate, set: (obj, value) => { obj.implementationDate = value; } }, metadata: _metadata }, _implementationDate_initializers, _implementationDate_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePriceOptimizationDto = CreatePriceOptimizationDto;
/**
 * DTO for value-based pricing
 */
let CreateValueBasedPricingDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _segment_decorators;
    let _segment_initializers = [];
    let _segment_extraInitializers = [];
    let _economicValue_decorators;
    let _economicValue_initializers = [];
    let _economicValue_extraInitializers = [];
    let _perceivedValue_decorators;
    let _perceivedValue_initializers = [];
    let _perceivedValue_extraInitializers = [];
    let _differentiationValue_decorators;
    let _differentiationValue_initializers = [];
    let _differentiationValue_extraInitializers = [];
    let _competitiveAlternativePrice_decorators;
    let _competitiveAlternativePrice_initializers = [];
    let _competitiveAlternativePrice_extraInitializers = [];
    let _valueDrivers_decorators;
    let _valueDrivers_initializers = [];
    let _valueDrivers_extraInitializers = [];
    let _willingnessToPay_decorators;
    let _willingnessToPay_initializers = [];
    let _willingnessToPay_extraInitializers = [];
    let _recommendedPrice_decorators;
    let _recommendedPrice_initializers = [];
    let _recommendedPrice_extraInitializers = [];
    let _valueCapturePercent_decorators;
    let _valueCapturePercent_initializers = [];
    let _valueCapturePercent_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateValueBasedPricingDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.productId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
                this.segment = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _segment_initializers, void 0));
                this.economicValue = (__runInitializers(this, _segment_extraInitializers), __runInitializers(this, _economicValue_initializers, void 0));
                this.perceivedValue = (__runInitializers(this, _economicValue_extraInitializers), __runInitializers(this, _perceivedValue_initializers, void 0));
                this.differentiationValue = (__runInitializers(this, _perceivedValue_extraInitializers), __runInitializers(this, _differentiationValue_initializers, void 0));
                this.competitiveAlternativePrice = (__runInitializers(this, _differentiationValue_extraInitializers), __runInitializers(this, _competitiveAlternativePrice_initializers, void 0));
                this.valueDrivers = (__runInitializers(this, _competitiveAlternativePrice_extraInitializers), __runInitializers(this, _valueDrivers_initializers, void 0));
                this.willingnessToPay = (__runInitializers(this, _valueDrivers_extraInitializers), __runInitializers(this, _willingnessToPay_initializers, void 0));
                this.recommendedPrice = (__runInitializers(this, _willingnessToPay_extraInitializers), __runInitializers(this, _recommendedPrice_initializers, void 0));
                this.valueCapturePercent = (__runInitializers(this, _recommendedPrice_extraInitializers), __runInitializers(this, _valueCapturePercent_initializers, void 0));
                this.metadata = (__runInitializers(this, _valueCapturePercent_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _segment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer segment', enum: PriceSegment }), (0, class_validator_1.IsEnum)(PriceSegment), (0, class_validator_1.IsNotEmpty)()];
            _economicValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Economic value to customer', example: 150000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _perceivedValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Perceived value', example: 120000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _differentiationValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Differentiation value', example: 30000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _competitiveAlternativePrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Competitive alternative price', example: 100000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _valueDrivers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Value drivers with weights' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object)];
            _willingnessToPay_decorators = [(0, swagger_1.ApiProperty)({ description: 'Willingness to pay', example: 125000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _recommendedPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recommended price', example: 115000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _valueCapturePercent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Value capture percentage', example: 76.67 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _segment_decorators, { kind: "field", name: "segment", static: false, private: false, access: { has: obj => "segment" in obj, get: obj => obj.segment, set: (obj, value) => { obj.segment = value; } }, metadata: _metadata }, _segment_initializers, _segment_extraInitializers);
            __esDecorate(null, null, _economicValue_decorators, { kind: "field", name: "economicValue", static: false, private: false, access: { has: obj => "economicValue" in obj, get: obj => obj.economicValue, set: (obj, value) => { obj.economicValue = value; } }, metadata: _metadata }, _economicValue_initializers, _economicValue_extraInitializers);
            __esDecorate(null, null, _perceivedValue_decorators, { kind: "field", name: "perceivedValue", static: false, private: false, access: { has: obj => "perceivedValue" in obj, get: obj => obj.perceivedValue, set: (obj, value) => { obj.perceivedValue = value; } }, metadata: _metadata }, _perceivedValue_initializers, _perceivedValue_extraInitializers);
            __esDecorate(null, null, _differentiationValue_decorators, { kind: "field", name: "differentiationValue", static: false, private: false, access: { has: obj => "differentiationValue" in obj, get: obj => obj.differentiationValue, set: (obj, value) => { obj.differentiationValue = value; } }, metadata: _metadata }, _differentiationValue_initializers, _differentiationValue_extraInitializers);
            __esDecorate(null, null, _competitiveAlternativePrice_decorators, { kind: "field", name: "competitiveAlternativePrice", static: false, private: false, access: { has: obj => "competitiveAlternativePrice" in obj, get: obj => obj.competitiveAlternativePrice, set: (obj, value) => { obj.competitiveAlternativePrice = value; } }, metadata: _metadata }, _competitiveAlternativePrice_initializers, _competitiveAlternativePrice_extraInitializers);
            __esDecorate(null, null, _valueDrivers_decorators, { kind: "field", name: "valueDrivers", static: false, private: false, access: { has: obj => "valueDrivers" in obj, get: obj => obj.valueDrivers, set: (obj, value) => { obj.valueDrivers = value; } }, metadata: _metadata }, _valueDrivers_initializers, _valueDrivers_extraInitializers);
            __esDecorate(null, null, _willingnessToPay_decorators, { kind: "field", name: "willingnessToPay", static: false, private: false, access: { has: obj => "willingnessToPay" in obj, get: obj => obj.willingnessToPay, set: (obj, value) => { obj.willingnessToPay = value; } }, metadata: _metadata }, _willingnessToPay_initializers, _willingnessToPay_extraInitializers);
            __esDecorate(null, null, _recommendedPrice_decorators, { kind: "field", name: "recommendedPrice", static: false, private: false, access: { has: obj => "recommendedPrice" in obj, get: obj => obj.recommendedPrice, set: (obj, value) => { obj.recommendedPrice = value; } }, metadata: _metadata }, _recommendedPrice_initializers, _recommendedPrice_extraInitializers);
            __esDecorate(null, null, _valueCapturePercent_decorators, { kind: "field", name: "valueCapturePercent", static: false, private: false, access: { has: obj => "valueCapturePercent" in obj, get: obj => obj.valueCapturePercent, set: (obj, value) => { obj.valueCapturePercent = value; } }, metadata: _metadata }, _valueCapturePercent_initializers, _valueCapturePercent_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateValueBasedPricingDto = CreateValueBasedPricingDto;
/**
 * DTO for price segmentation
 */
let CreatePriceSegmentationDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _segment_decorators;
    let _segment_initializers = [];
    let _segment_extraInitializers = [];
    let _segmentName_decorators;
    let _segmentName_initializers = [];
    let _segmentName_extraInitializers = [];
    let _customerCount_decorators;
    let _customerCount_initializers = [];
    let _customerCount_extraInitializers = [];
    let _revenueContribution_decorators;
    let _revenueContribution_initializers = [];
    let _revenueContribution_extraInitializers = [];
    let _pricePoint_decorators;
    let _pricePoint_initializers = [];
    let _pricePoint_extraInitializers = [];
    let _priceFloor_decorators;
    let _priceFloor_initializers = [];
    let _priceFloor_extraInitializers = [];
    let _priceCeiling_decorators;
    let _priceCeiling_initializers = [];
    let _priceCeiling_extraInitializers = [];
    let _willingnessToPay_decorators;
    let _willingnessToPay_initializers = [];
    let _willingnessToPay_extraInitializers = [];
    let _priceSensitivity_decorators;
    let _priceSensitivity_initializers = [];
    let _priceSensitivity_extraInitializers = [];
    let _characteristics_decorators;
    let _characteristics_initializers = [];
    let _characteristics_extraInitializers = [];
    let _targetMargin_decorators;
    let _targetMargin_initializers = [];
    let _targetMargin_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreatePriceSegmentationDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.productId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
                this.segment = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _segment_initializers, void 0));
                this.segmentName = (__runInitializers(this, _segment_extraInitializers), __runInitializers(this, _segmentName_initializers, void 0));
                this.customerCount = (__runInitializers(this, _segmentName_extraInitializers), __runInitializers(this, _customerCount_initializers, void 0));
                this.revenueContribution = (__runInitializers(this, _customerCount_extraInitializers), __runInitializers(this, _revenueContribution_initializers, void 0));
                this.pricePoint = (__runInitializers(this, _revenueContribution_extraInitializers), __runInitializers(this, _pricePoint_initializers, void 0));
                this.priceFloor = (__runInitializers(this, _pricePoint_extraInitializers), __runInitializers(this, _priceFloor_initializers, void 0));
                this.priceCeiling = (__runInitializers(this, _priceFloor_extraInitializers), __runInitializers(this, _priceCeiling_initializers, void 0));
                this.willingnessToPay = (__runInitializers(this, _priceCeiling_extraInitializers), __runInitializers(this, _willingnessToPay_initializers, void 0));
                this.priceSensitivity = (__runInitializers(this, _willingnessToPay_extraInitializers), __runInitializers(this, _priceSensitivity_initializers, void 0));
                this.characteristics = (__runInitializers(this, _priceSensitivity_extraInitializers), __runInitializers(this, _characteristics_initializers, void 0));
                this.targetMargin = (__runInitializers(this, _characteristics_extraInitializers), __runInitializers(this, _targetMargin_initializers, void 0));
                this.metadata = (__runInitializers(this, _targetMargin_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _segment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Price segment', enum: PriceSegment }), (0, class_validator_1.IsEnum)(PriceSegment), (0, class_validator_1.IsNotEmpty)()];
            _segmentName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Segment name', example: 'Enterprise Customers' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _customerCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer count in segment', example: 250 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _revenueContribution_decorators = [(0, swagger_1.ApiProperty)({ description: 'Revenue contribution', example: 2500000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _pricePoint_decorators = [(0, swagger_1.ApiProperty)({ description: 'Price point for segment', example: 10000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _priceFloor_decorators = [(0, swagger_1.ApiProperty)({ description: 'Price floor', example: 8000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _priceCeiling_decorators = [(0, swagger_1.ApiProperty)({ description: 'Price ceiling', example: 15000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _willingnessToPay_decorators = [(0, swagger_1.ApiProperty)({ description: 'Willingness to pay', example: 12000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _priceSensitivity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Price sensitivity (0-100)', example: 35 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _characteristics_decorators = [(0, swagger_1.ApiProperty)({ description: 'Segment characteristics' }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsNotEmpty)()];
            _targetMargin_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target margin percentage', example: 45 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _segment_decorators, { kind: "field", name: "segment", static: false, private: false, access: { has: obj => "segment" in obj, get: obj => obj.segment, set: (obj, value) => { obj.segment = value; } }, metadata: _metadata }, _segment_initializers, _segment_extraInitializers);
            __esDecorate(null, null, _segmentName_decorators, { kind: "field", name: "segmentName", static: false, private: false, access: { has: obj => "segmentName" in obj, get: obj => obj.segmentName, set: (obj, value) => { obj.segmentName = value; } }, metadata: _metadata }, _segmentName_initializers, _segmentName_extraInitializers);
            __esDecorate(null, null, _customerCount_decorators, { kind: "field", name: "customerCount", static: false, private: false, access: { has: obj => "customerCount" in obj, get: obj => obj.customerCount, set: (obj, value) => { obj.customerCount = value; } }, metadata: _metadata }, _customerCount_initializers, _customerCount_extraInitializers);
            __esDecorate(null, null, _revenueContribution_decorators, { kind: "field", name: "revenueContribution", static: false, private: false, access: { has: obj => "revenueContribution" in obj, get: obj => obj.revenueContribution, set: (obj, value) => { obj.revenueContribution = value; } }, metadata: _metadata }, _revenueContribution_initializers, _revenueContribution_extraInitializers);
            __esDecorate(null, null, _pricePoint_decorators, { kind: "field", name: "pricePoint", static: false, private: false, access: { has: obj => "pricePoint" in obj, get: obj => obj.pricePoint, set: (obj, value) => { obj.pricePoint = value; } }, metadata: _metadata }, _pricePoint_initializers, _pricePoint_extraInitializers);
            __esDecorate(null, null, _priceFloor_decorators, { kind: "field", name: "priceFloor", static: false, private: false, access: { has: obj => "priceFloor" in obj, get: obj => obj.priceFloor, set: (obj, value) => { obj.priceFloor = value; } }, metadata: _metadata }, _priceFloor_initializers, _priceFloor_extraInitializers);
            __esDecorate(null, null, _priceCeiling_decorators, { kind: "field", name: "priceCeiling", static: false, private: false, access: { has: obj => "priceCeiling" in obj, get: obj => obj.priceCeiling, set: (obj, value) => { obj.priceCeiling = value; } }, metadata: _metadata }, _priceCeiling_initializers, _priceCeiling_extraInitializers);
            __esDecorate(null, null, _willingnessToPay_decorators, { kind: "field", name: "willingnessToPay", static: false, private: false, access: { has: obj => "willingnessToPay" in obj, get: obj => obj.willingnessToPay, set: (obj, value) => { obj.willingnessToPay = value; } }, metadata: _metadata }, _willingnessToPay_initializers, _willingnessToPay_extraInitializers);
            __esDecorate(null, null, _priceSensitivity_decorators, { kind: "field", name: "priceSensitivity", static: false, private: false, access: { has: obj => "priceSensitivity" in obj, get: obj => obj.priceSensitivity, set: (obj, value) => { obj.priceSensitivity = value; } }, metadata: _metadata }, _priceSensitivity_initializers, _priceSensitivity_extraInitializers);
            __esDecorate(null, null, _characteristics_decorators, { kind: "field", name: "characteristics", static: false, private: false, access: { has: obj => "characteristics" in obj, get: obj => obj.characteristics, set: (obj, value) => { obj.characteristics = value; } }, metadata: _metadata }, _characteristics_initializers, _characteristics_extraInitializers);
            __esDecorate(null, null, _targetMargin_decorators, { kind: "field", name: "targetMargin", static: false, private: false, access: { has: obj => "targetMargin" in obj, get: obj => obj.targetMargin, set: (obj, value) => { obj.targetMargin = value; } }, metadata: _metadata }, _targetMargin_initializers, _targetMargin_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePriceSegmentationDto = CreatePriceSegmentationDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Pricing Strategy Model
 */
class PricingStrategyModel extends sequelize_1.Model {
    static initialize(sequelize) {
        PricingStrategyModel.init({
            strategyId: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            productId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
            },
            serviceId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
            },
            strategyType: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(PricingStrategy)),
                allowNull: false,
            },
            name: {
                type: sequelize_1.DataTypes.STRING(200),
                allowNull: false,
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            targetSegment: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(PriceSegment)),
                allowNull: false,
            },
            basePrice: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            currency: {
                type: sequelize_1.DataTypes.STRING(3),
                allowNull: false,
                defaultValue: 'USD',
            },
            effectiveDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            expirationDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(AnalysisStatus)),
                allowNull: false,
                defaultValue: AnalysisStatus.DRAFT,
            },
            objectives: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
                allowNull: false,
                defaultValue: [],
            },
            competitivePosition: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(CompetitivePosition)),
                allowNull: false,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
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
        });
        return PricingStrategyModel;
    }
}
exports.PricingStrategyModel = PricingStrategyModel;
/**
 * Price Elasticity Model
 */
class PriceElasticityModel extends sequelize_1.Model {
    static initialize(sequelize) {
        PriceElasticityModel.init({
            elasticityId: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            productId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            segment: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(PriceSegment)),
                allowNull: false,
            },
            elasticityCoefficient: {
                type: sequelize_1.DataTypes.DECIMAL(10, 4),
                allowNull: false,
            },
            elasticityCategory: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(PriceElasticity)),
                allowNull: false,
            },
            priceRange: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
            },
            demandCurve: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
            },
            confidenceInterval: {
                type: sequelize_1.DataTypes.DECIMAL(5, 4),
                allowNull: false,
            },
            analysisDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            dataPoints: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            methodology: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'price_elasticities',
            timestamps: true,
            indexes: [
                { fields: ['organizationId'] },
                { fields: ['productId'] },
                { fields: ['segment'] },
                { fields: ['analysisDate'] },
            ],
        });
        return PriceElasticityModel;
    }
}
exports.PriceElasticityModel = PriceElasticityModel;
/**
 * Competitive Pricing Model
 */
class CompetitivePricingModel extends sequelize_1.Model {
    static initialize(sequelize) {
        CompetitivePricingModel.init({
            benchmarkId: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            productId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            competitorId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            competitorName: {
                type: sequelize_1.DataTypes.STRING(200),
                allowNull: false,
            },
            competitorPrice: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            ourPrice: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            priceDifference: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            priceDifferencePercent: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            competitivePosition: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(CompetitivePosition)),
                allowNull: false,
            },
            featureComparison: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
            },
            valueScore: {
                type: sequelize_1.DataTypes.DECIMAL(5, 2),
                allowNull: false,
            },
            benchmarkDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            dataSource: {
                type: sequelize_1.DataTypes.STRING(200),
                allowNull: false,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'competitive_pricing',
            timestamps: true,
            indexes: [
                { fields: ['organizationId'] },
                { fields: ['productId'] },
                { fields: ['competitorId'] },
                { fields: ['benchmarkDate'] },
            ],
        });
        return CompetitivePricingModel;
    }
}
exports.CompetitivePricingModel = CompetitivePricingModel;
/**
 * Pricing Waterfall Model
 */
class PricingWaterfallModel extends sequelize_1.Model {
    static initialize(sequelize) {
        PricingWaterfallModel.init({
            waterfallId: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            productId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            customerId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
            },
            segment: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(PriceSegment)),
                allowNull: false,
            },
            listPrice: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            invoiceDiscount: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            },
            offInvoiceDiscount: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            },
            rebates: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            },
            promotionalAllowances: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            },
            paymentTermsDiscount: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            },
            freight: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            },
            pocketPrice: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            pocketMargin: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            leakagePercent: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            analysisDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            components: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
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
        });
        return PricingWaterfallModel;
    }
}
exports.PricingWaterfallModel = PricingWaterfallModel;
/**
 * Discount Structure Model
 */
class DiscountStructureModel extends sequelize_1.Model {
    static initialize(sequelize) {
        DiscountStructureModel.init({
            discountId: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            discountType: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(DiscountType)),
                allowNull: false,
            },
            name: {
                type: sequelize_1.DataTypes.STRING(200),
                allowNull: false,
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            discountPercent: {
                type: sequelize_1.DataTypes.DECIMAL(5, 2),
                allowNull: true,
            },
            discountAmount: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: true,
            },
            minimumQuantity: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            minimumValue: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: true,
            },
            eligibleSegments: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
                allowNull: false,
                defaultValue: [],
            },
            effectiveDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            expirationDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            isActive: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            usageCount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            totalDiscount: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'discount_structures',
            timestamps: true,
            indexes: [
                { fields: ['organizationId'] },
                { fields: ['discountType'] },
                { fields: ['effectiveDate'] },
                { fields: ['isActive'] },
            ],
        });
        return DiscountStructureModel;
    }
}
exports.DiscountStructureModel = DiscountStructureModel;
/**
 * Price Optimization Model
 */
class PriceOptimizationModel extends sequelize_1.Model {
    static initialize(sequelize) {
        PriceOptimizationModel.init({
            optimizationId: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            productId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            objective: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(OptimizationObjective)),
                allowNull: false,
            },
            currentPrice: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            optimizedPrice: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            priceChange: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            priceChangePercent: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            expectedRevenue: {
                type: sequelize_1.DataTypes.DECIMAL(18, 2),
                allowNull: false,
            },
            expectedProfit: {
                type: sequelize_1.DataTypes.DECIMAL(18, 2),
                allowNull: false,
            },
            expectedVolume: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            confidenceLevel: {
                type: sequelize_1.DataTypes.DECIMAL(5, 4),
                allowNull: false,
            },
            constraints: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
            },
            assumptions: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
                allowNull: false,
                defaultValue: [],
            },
            sensitivityAnalysis: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
            },
            analysisDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            implementationDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'price_optimizations',
            timestamps: true,
            indexes: [
                { fields: ['organizationId'] },
                { fields: ['productId'] },
                { fields: ['objective'] },
                { fields: ['analysisDate'] },
            ],
        });
        return PriceOptimizationModel;
    }
}
exports.PriceOptimizationModel = PriceOptimizationModel;
/**
 * Value-Based Pricing Model
 */
class ValueBasedPricingModel extends sequelize_1.Model {
    static initialize(sequelize) {
        ValueBasedPricingModel.init({
            valueId: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            productId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            segment: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(PriceSegment)),
                allowNull: false,
            },
            economicValue: {
                type: sequelize_1.DataTypes.DECIMAL(18, 2),
                allowNull: false,
            },
            perceivedValue: {
                type: sequelize_1.DataTypes.DECIMAL(18, 2),
                allowNull: false,
            },
            differentiationValue: {
                type: sequelize_1.DataTypes.DECIMAL(18, 2),
                allowNull: false,
            },
            competitiveAlternativePrice: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            valueDrivers: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
            },
            willingnessToPay: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            recommendedPrice: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            valueCapturePercent: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            analysisDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'value_based_pricing',
            timestamps: true,
            indexes: [
                { fields: ['organizationId'] },
                { fields: ['productId'] },
                { fields: ['segment'] },
                { fields: ['analysisDate'] },
            ],
        });
        return ValueBasedPricingModel;
    }
}
exports.ValueBasedPricingModel = ValueBasedPricingModel;
/**
 * Price Segmentation Model
 */
class PriceSegmentationModel extends sequelize_1.Model {
    static initialize(sequelize) {
        PriceSegmentationModel.init({
            segmentationId: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
            },
            organizationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            productId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            segment: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(PriceSegment)),
                allowNull: false,
            },
            segmentName: {
                type: sequelize_1.DataTypes.STRING(200),
                allowNull: false,
            },
            customerCount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            revenueContribution: {
                type: sequelize_1.DataTypes.DECIMAL(18, 2),
                allowNull: false,
            },
            pricePoint: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            priceFloor: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            priceCeiling: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            willingnessToPay: {
                type: sequelize_1.DataTypes.DECIMAL(15, 2),
                allowNull: false,
            },
            priceSensitivity: {
                type: sequelize_1.DataTypes.DECIMAL(5, 2),
                allowNull: false,
            },
            characteristics: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: false,
            },
            targetMargin: {
                type: sequelize_1.DataTypes.DECIMAL(5, 2),
                allowNull: false,
            },
            metadata: {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: 'price_segmentations',
            timestamps: true,
            indexes: [
                { fields: ['organizationId'] },
                { fields: ['productId'] },
                { fields: ['segment'] },
            ],
        });
        return PriceSegmentationModel;
    }
}
exports.PriceSegmentationModel = PriceSegmentationModel;
// ============================================================================
// PRICING STRATEGY FUNCTIONS
// ============================================================================
/**
 * 1. Create comprehensive pricing strategy
 */
async function createPricingStrategy(dto, transaction) {
    return await PricingStrategyModel.create({
        strategyId: '',
        ...dto,
        status: AnalysisStatus.DRAFT,
    }, { transaction });
}
/**
 * 2. Calculate price elasticity of demand
 */
async function calculatePriceElasticity(priceChangePercent, quantityChangePercent) {
    const coefficient = quantityChangePercent / priceChangePercent;
    const absCoefficient = Math.abs(coefficient);
    let category;
    if (absCoefficient === Infinity) {
        category = PriceElasticity.PERFECTLY_ELASTIC;
    }
    else if (absCoefficient > 1) {
        category = PriceElasticity.ELASTIC;
    }
    else if (absCoefficient === 1) {
        category = PriceElasticity.UNIT_ELASTIC;
    }
    else if (absCoefficient > 0) {
        category = PriceElasticity.INELASTIC;
    }
    else {
        category = PriceElasticity.PERFECTLY_INELASTIC;
    }
    return { coefficient, category };
}
/**
 * 3. Generate demand curve from historical data
 */
function generateDemandCurve(historicalData) {
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
function optimizePriceForRevenue(demandCurve) {
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
function optimizePriceForProfit(demandCurve, costPerUnit) {
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
function calculateCompetitivePosition(ourPrice, competitorPrice) {
    const difference = ourPrice - competitorPrice;
    const differencePercent = (difference / competitorPrice) * 100;
    let position;
    if (differencePercent > 10) {
        position = CompetitivePosition.PREMIUM;
    }
    else if (differencePercent >= -5 && differencePercent <= 10) {
        position = CompetitivePosition.PARITY;
    }
    else if (differencePercent >= -15 && differencePercent < -5) {
        position = CompetitivePosition.DISCOUNT;
    }
    else {
        position = CompetitivePosition.PENETRATION;
    }
    return { difference, differencePercent, position };
}
/**
 * 7. Build pricing waterfall analysis
 */
async function buildPricingWaterfall(dto, transaction) {
    const totalDiscounts = dto.invoiceDiscount +
        dto.offInvoiceDiscount +
        dto.rebates +
        dto.promotionalAllowances +
        dto.paymentTermsDiscount +
        dto.freight;
    const pocketPrice = dto.listPrice - totalDiscounts;
    const pocketMargin = ((pocketPrice / dto.listPrice) * 100);
    const leakagePercent = ((totalDiscounts / dto.listPrice) * 100);
    return await PricingWaterfallModel.create({
        waterfallId: '',
        ...dto,
        pocketPrice,
        pocketMargin,
        leakagePercent,
        analysisDate: new Date(),
    }, { transaction });
}
/**
 * 8. Calculate pricing waterfall leakage
 */
function calculateWaterfallLeakage(listPrice, pocketPrice) {
    const leakageAmount = listPrice - pocketPrice;
    const leakagePercent = (leakageAmount / listPrice) * 100;
    const retentionPercent = 100 - leakagePercent;
    return { leakageAmount, leakagePercent, retentionPercent };
}
/**
 * 9. Analyze waterfall components by type
 */
async function analyzeWaterfallComponents(organizationId, productId, startDate, endDate) {
    const waterfalls = await PricingWaterfallModel.findAll({
        where: {
            organizationId,
            productId,
            analysisDate: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
    });
    const componentStats = {};
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
    const result = {};
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
async function createValueBasedPricing(dto, transaction) {
    return await ValueBasedPricingModel.create({
        valueId: '',
        ...dto,
        analysisDate: new Date(),
    }, { transaction });
}
/**
 * 11. Calculate economic value to customer
 */
function calculateEconomicValue(competitiveAlternativePrice, differentiationValue) {
    const economicValue = competitiveAlternativePrice + differentiationValue;
    const valuePremium = differentiationValue;
    return { economicValue, valuePremium };
}
/**
 * 12. Compute value drivers weighted score
 */
function computeValueDriversScore(valueDrivers) {
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
function determineValueCapturePercent(recommendedPrice, economicValue) {
    const valueCapturePercent = (recommendedPrice / economicValue) * 100;
    const customerSurplusPercent = 100 - valueCapturePercent;
    return { valueCapturePercent, customerSurplusPercent };
}
/**
 * 14. Create discount structure
 */
async function createDiscountStructure(dto, transaction) {
    return await DiscountStructureModel.create({
        discountId: '',
        ...dto,
        isActive: true,
        usageCount: 0,
        totalDiscount: 0,
    }, { transaction });
}
/**
 * 15. Calculate volume discount tiers
 */
function calculateVolumeDiscountTiers(basePrice, tiers) {
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
function applyDiscount(basePrice, discount) {
    let discountApplied = 0;
    if (discount.discountPercent !== undefined) {
        discountApplied = basePrice * (discount.discountPercent / 100);
    }
    else if (discount.discountAmount !== undefined) {
        discountApplied = discount.discountAmount;
    }
    const finalPrice = Math.max(0, basePrice - discountApplied);
    const savingsPercent = basePrice > 0 ? (discountApplied / basePrice) * 100 : 0;
    return { finalPrice, discountApplied, savingsPercent };
}
/**
 * 17. Calculate cumulative discount impact
 */
function calculateCumulativeDiscounts(basePrice, discounts) {
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
async function createPriceSegmentation(dto, transaction) {
    return await PriceSegmentationModel.create({
        segmentationId: '',
        ...dto,
    }, { transaction });
}
/**
 * 19. Segment customers by willingness to pay
 */
function segmentByWillingnessToPay(customers, segments = 4) {
    const sorted = customers.sort((a, b) => a.willingnessToPay - b.willingnessToPay);
    const segmentSize = Math.ceil(customers.length / segments);
    const result = [];
    for (let i = 0; i < segments; i++) {
        const start = i * segmentSize;
        const end = Math.min((i + 1) * segmentSize, customers.length);
        const segmentCustomers = sorted.slice(start, end);
        if (segmentCustomers.length === 0)
            continue;
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
function calculatePriceSensitivity(segment) {
    const elasticityWeight = 0.5;
    const switchRateWeight = 0.3;
    const importanceWeight = 0.2;
    const normalizedElasticity = Math.min(Math.abs(segment.priceElasticity) / 2, 1);
    const sensitivityScore = normalizedElasticity * elasticityWeight +
        segment.competitorSwitchRate * switchRateWeight +
        segment.priceImportance * importanceWeight;
    let sensitivityLevel;
    if (sensitivityScore < 0.3) {
        sensitivityLevel = 'low';
    }
    else if (sensitivityScore < 0.6) {
        sensitivityLevel = 'medium';
    }
    else if (sensitivityScore < 0.8) {
        sensitivityLevel = 'high';
    }
    else {
        sensitivityLevel = 'very_high';
    }
    return { sensitivityScore, sensitivityLevel };
}
/**
 * 21. Apply psychological pricing tactics
 */
function applyPsychologicalPricing(price, tactic) {
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
function createBundlePricing(products, bundleDiscountPercent) {
    const individualTotal = products.reduce((sum, p) => sum + p.individualPrice, 0);
    const bundlePrice = individualTotal * (1 - bundleDiscountPercent / 100);
    const savings = individualTotal - bundlePrice;
    const savingsPercent = bundleDiscountPercent;
    return { bundlePrice, individualTotal, savings, savingsPercent };
}
/**
 * 23. Calculate tiered pricing structure
 */
function calculateTieredPricing(usage, tiers) {
    let remainingUsage = usage;
    let totalCost = 0;
    const breakdown = [];
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
        if (remainingUsage <= 0)
            break;
    }
    const effectiveRate = usage > 0 ? totalCost / usage : 0;
    return { totalCost, effectiveRate, breakdown };
}
/**
 * 24. Optimize dynamic pricing
 */
function optimizeDynamicPricing(basePrice, factors) {
    let priceMultiplier = 1.0;
    const factorImpacts = {};
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
function calculatePromotionalEffectiveness(baseline, promotional) {
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
function analyzePriceVolumeMix(currentPeriod, priorPeriod) {
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
function calculatePriceFloor(costs, targetMargin) {
    const variableCost = costs.directMaterial + costs.directLabor + costs.variableOverhead;
    const fullCost = variableCost + costs.fixedOverhead + (costs.allocatedFixed || 0);
    const priceFloor = variableCost;
    const marginPrice = fullCost / (1 - targetMargin / 100);
    return { priceFloor, variableCost, fullCost, marginPrice };
}
/**
 * 28. Calculate price ceiling based on value
 */
function calculatePriceCeiling(valueToCustomer, competitiveBenchmark, maxWillingnessToPay) {
    const constraints = [
        { value: valueToCustomer, factor: 'value' },
        { value: competitiveBenchmark, factor: 'competitive' },
        { value: maxWillingnessToPay, factor: 'willingness' },
    ];
    const minimum = constraints.reduce((min, curr) => (curr.value < min.value ? curr : min));
    return { priceCeiling: minimum.value, constrainingFactor: minimum.factor };
}
/**
 * 29. Perform price sensitivity analysis
 */
function performSensitivityAnalysis(baseCase, priceChanges) {
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
function calculateBreakEvenPrice(fixedCosts, variableCostPerUnit, targetVolume) {
    const breakEvenPrice = (fixedCosts / targetVolume) + variableCostPerUnit;
    const contributionMargin = breakEvenPrice - variableCostPerUnit;
    const contributionMarginRatio = breakEvenPrice > 0 ? (contributionMargin / breakEvenPrice) * 100 : 0;
    return { breakEvenPrice, contributionMargin, contributionMarginRatio };
}
/**
 * 31. Analyze competitive pricing gaps
 */
async function analyzeCompetitivePricingGaps(organizationId, productId) {
    const benchmarks = await CompetitivePricingModel.findAll({
        where: { organizationId, productId },
        order: [['benchmarkDate', 'DESC']],
        limit: 10,
    });
    if (benchmarks.length === 0) {
        throw new Error('No competitive benchmarks found');
    }
    const averageCompetitorPrice = benchmarks.reduce((sum, b) => sum + b.competitorPrice, 0) / benchmarks.length;
    const ourPrice = benchmarks[0].ourPrice;
    const priceGap = ourPrice - averageCompetitorPrice;
    const priceGapPercent = (priceGap / averageCompetitorPrice) * 100;
    const competitorsAbove = benchmarks.filter((b) => b.competitorPrice > ourPrice).length;
    const competitorsBelow = benchmarks.filter((b) => b.competitorPrice < ourPrice).length;
    let recommendedPosition;
    if (priceGapPercent > 15) {
        recommendedPosition = CompetitivePosition.PREMIUM;
    }
    else if (priceGapPercent >= -5 && priceGapPercent <= 15) {
        recommendedPosition = CompetitivePosition.PARITY;
    }
    else if (priceGapPercent >= -20 && priceGapPercent < -5) {
        recommendedPosition = CompetitivePosition.DISCOUNT;
    }
    else {
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
function generatePriceRecommendation(inputs) {
    let recommendedPrice;
    let rationale;
    let confidenceLevel;
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
async function calculateRevenueAtRisk(organizationId, productId, priceIncreasePercent, elasticity) {
    const waterfalls = await PricingWaterfallModel.findAll({
        where: { organizationId, productId },
        attributes: [
            [sequelize_1.Sequelize.fn('AVG', sequelize_1.Sequelize.col('pocketPrice')), 'avgPrice'],
            [sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.col('pocketPrice')), 'totalRevenue'],
        ],
    });
    if (waterfalls.length === 0 || !waterfalls[0]) {
        throw new Error('No pricing data found');
    }
    const data = waterfalls[0];
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
function modelPriceChangeScenarios(baseline, scenarios) {
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
function calculateCLVImpact(pricing, costs, averageLifespanYears) {
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
function optimizeSubscriptionTiers(customerDistribution, targetTiers) {
    const sorted = customerDistribution.sort((a, b) => a.usageLevel - b.usageLevel);
    const totalCustomers = sorted.reduce((sum, c) => sum + c.count, 0);
    const customersPerTier = Math.floor(totalCustomers / targetTiers);
    const tiers = [];
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
function calculatePriceDiscrimination(segments) {
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
discount;
Perception: number;
anchoring;
Effect: number;
purchaseIntent: number;
{
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
function calculateFreemiumMetrics(data) {
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
async function generatePricingRecommendations(organizationId, productId) {
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
    let recommendedStrategy;
    const rationale = [];
    let expectedImpact = { revenue: 0, margin: 0, volume: 0 };
    const implementationSteps = [];
    if (Math.abs(elasticity) < 0.8) {
        recommendedStrategy = PricingStrategy.VALUE_BASED;
        rationale.push('Low price elasticity indicates value-based pricing opportunity');
        rationale.push('Customers are less sensitive to price changes');
        expectedImpact = { revenue: 15, margin: 20, volume: -5 };
        implementationSteps.push('Conduct customer value research');
        implementationSteps.push('Identify key value drivers');
        implementationSteps.push('Develop value-based pricing model');
    }
    else if (avgLeakage > 20) {
        recommendedStrategy = PricingStrategy.COMPETITIVE;
        rationale.push('High pricing waterfall leakage detected');
        rationale.push('Focus on reducing discounts and improving price realization');
        expectedImpact = { revenue: 10, margin: 15, volume: 0 };
        implementationSteps.push('Analyze waterfall components');
        implementationSteps.push('Implement discount controls');
        implementationSteps.push('Train sales on value selling');
    }
    else {
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
function calculatePricingPower(metrics) {
    const weights = {
        marketShare: 0.25,
        brandStrength: 0.2,
        productDifferentiation: 0.25,
        switchingCosts: 0.15,
        customerLoyalty: 0.15,
    };
    const pricingPowerIndex = metrics.marketShare * weights.marketShare +
        metrics.brandStrength * weights.brandStrength +
        metrics.productDifferentiation * weights.productDifferentiation +
        metrics.switchingCosts * weights.switchingCosts +
        metrics.customerLoyalty * weights.customerLoyalty;
    let pricingPowerLevel;
    const recommendations = [];
    if (pricingPowerIndex < 30) {
        pricingPowerLevel = 'low';
        recommendations.push('Focus on cost efficiency and competitive pricing');
        recommendations.push('Invest in product differentiation');
        recommendations.push('Build customer loyalty programs');
    }
    else if (pricingPowerIndex < 60) {
        pricingPowerLevel = 'moderate';
        recommendations.push('Explore value-based pricing opportunities');
        recommendations.push('Segment customers by willingness to pay');
        recommendations.push('Strengthen brand positioning');
    }
    else if (pricingPowerIndex < 80) {
        pricingPowerLevel = 'high';
        recommendations.push('Implement premium pricing strategy');
        recommendations.push('Capture value through tiered offerings');
        recommendations.push('Maintain pricing discipline');
    }
    else {
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
async function trackPricingPerformance(organizationId, productId, startDate, endDate) {
    const waterfalls = await PricingWaterfallModel.findAll({
        where: {
            organizationId,
            productId,
            analysisDate: { [sequelize_1.Op.between]: [startDate, endDate] },
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
    const performanceScore = (revenueGrowth > 0 ? 25 : 0) +
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
exports.PricingStrategyKit = {
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
exports.default = exports.PricingStrategyKit;
//# sourceMappingURL=pricing-strategy-kit.js.map