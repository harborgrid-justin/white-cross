"use strict";
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
exports.CustomerLTVModel = exports.RevenueForecastModel = exports.GrowthStrategy = exports.ChurnPredictionDto = exports.UpsellScoringDto = exports.PenetrationStrategyDto = exports.RevenueStreamAnalysisDto = exports.ProductMarketFitDto = exports.RevenueForecastDto = exports.SalesFunnelMetricsDto = exports.CrossSellOpportunityDto = exports.CustomerLifetimeValueDto = exports.PricingOptimizationDto = exports.MarketExpansionAnalysisDto = exports.CreateGrowthStrategyDto = exports.CrossSellType = exports.MarketPosition = exports.ProductLifecycle = exports.FunnelStage = exports.RevenueStreamType = exports.CustomerSegment = exports.PricingStrategy = exports.ExpansionApproach = exports.GrowthStrategyType = void 0;
exports.initGrowthStrategyModel = initGrowthStrategyModel;
exports.initRevenueForecastModel = initRevenueForecastModel;
exports.initCustomerLTVModel = initCustomerLTVModel;
exports.createGrowthStrategy = createGrowthStrategy;
exports.analyzeMarketExpansion = analyzeMarketExpansion;
exports.optimizeProductPricing = optimizeProductPricing;
exports.calculateCustomerLTV = calculateCustomerLTV;
exports.identifyCrossSellOpportunities = identifyCrossSellOpportunities;
exports.analyzeSalesFunnel = analyzeSalesFunnel;
exports.generateRevenueForecast = generateRevenueForecast;
exports.assessProductMarketFit = assessProductMarketFit;
exports.analyzeRevenueStream = analyzeRevenueStream;
exports.developPenetrationStrategy = developPenetrationStrategy;
exports.analyzePriceElasticity = analyzePriceElasticity;
exports.scoreUpsellOpportunity = scoreUpsellOpportunity;
exports.analyzeMarketShare = analyzeMarketShare;
exports.analyzeCustomerAcquisition = analyzeCustomerAcquisition;
exports.developRevenueOptimizationPlan = developRevenueOptimizationPlan;
exports.optimizeProductBundle = optimizeProductBundle;
exports.predictCustomerChurn = predictCustomerChurn;
exports.analyzePriceSensitivity = analyzePriceSensitivity;
exports.analyzeRevenueLeakage = analyzeRevenueLeakage;
exports.calculateSegmentRevenue = calculateSegmentRevenue;
exports.calculateGrowthRate = calculateGrowthRate;
exports.calculateCAGR = calculateCAGR;
exports.calculateRunRate = calculateRunRate;
exports.calculateARPU = calculateARPU;
exports.calculateRevenueConcentration = calculateRevenueConcentration;
exports.calculateRevenuePerEmployee = calculateRevenuePerEmployee;
exports.calculateCACPayback = calculateCACPayback;
exports.calculateNetRevenueRetention = calculateNetRevenueRetention;
exports.calculateQuickRatio = calculateQuickRatio;
exports.calculateRevenueQuality = calculateRevenueQuality;
exports.estimateMarketOpportunity = estimateMarketOpportunity;
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
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Growth strategy types
 */
var GrowthStrategyType;
(function (GrowthStrategyType) {
    GrowthStrategyType["MARKET_PENETRATION"] = "market_penetration";
    GrowthStrategyType["MARKET_DEVELOPMENT"] = "market_development";
    GrowthStrategyType["PRODUCT_DEVELOPMENT"] = "product_development";
    GrowthStrategyType["DIVERSIFICATION"] = "diversification";
    GrowthStrategyType["HORIZONTAL_INTEGRATION"] = "horizontal_integration";
    GrowthStrategyType["VERTICAL_INTEGRATION"] = "vertical_integration";
    GrowthStrategyType["ACQUISITION"] = "acquisition";
    GrowthStrategyType["PARTNERSHIP"] = "partnership";
})(GrowthStrategyType || (exports.GrowthStrategyType = GrowthStrategyType = {}));
/**
 * Market expansion approaches
 */
var ExpansionApproach;
(function (ExpansionApproach) {
    ExpansionApproach["GEOGRAPHIC"] = "geographic";
    ExpansionApproach["DEMOGRAPHIC"] = "demographic";
    ExpansionApproach["VERTICAL"] = "vertical";
    ExpansionApproach["HORIZONTAL"] = "horizontal";
    ExpansionApproach["CHANNEL"] = "channel";
    ExpansionApproach["PRODUCT_LINE"] = "product_line";
})(ExpansionApproach || (exports.ExpansionApproach = ExpansionApproach = {}));
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
    PricingStrategy["FREEMIUM"] = "freemium";
    PricingStrategy["TIERED"] = "tiered";
    PricingStrategy["DYNAMIC"] = "dynamic";
    PricingStrategy["BUNDLE"] = "bundle";
})(PricingStrategy || (exports.PricingStrategy = PricingStrategy = {}));
/**
 * Customer segment types
 */
var CustomerSegment;
(function (CustomerSegment) {
    CustomerSegment["ENTERPRISE"] = "enterprise";
    CustomerSegment["MID_MARKET"] = "mid_market";
    CustomerSegment["SMB"] = "smb";
    CustomerSegment["CONSUMER"] = "consumer";
    CustomerSegment["GOVERNMENT"] = "government";
    CustomerSegment["EDUCATION"] = "education";
    CustomerSegment["NONPROFIT"] = "nonprofit";
})(CustomerSegment || (exports.CustomerSegment = CustomerSegment = {}));
/**
 * Revenue stream types
 */
var RevenueStreamType;
(function (RevenueStreamType) {
    RevenueStreamType["SUBSCRIPTION"] = "subscription";
    RevenueStreamType["TRANSACTION"] = "transaction";
    RevenueStreamType["LICENSE"] = "license";
    RevenueStreamType["SERVICE"] = "service";
    RevenueStreamType["ADVERTISING"] = "advertising";
    RevenueStreamType["COMMISSION"] = "commission";
    RevenueStreamType["ROYALTY"] = "royalty";
    RevenueStreamType["RENTAL"] = "rental";
})(RevenueStreamType || (exports.RevenueStreamType = RevenueStreamType = {}));
/**
 * Sales funnel stages
 */
var FunnelStage;
(function (FunnelStage) {
    FunnelStage["AWARENESS"] = "awareness";
    FunnelStage["INTEREST"] = "interest";
    FunnelStage["CONSIDERATION"] = "consideration";
    FunnelStage["INTENT"] = "intent";
    FunnelStage["EVALUATION"] = "evaluation";
    FunnelStage["PURCHASE"] = "purchase";
    FunnelStage["RETENTION"] = "retention";
    FunnelStage["ADVOCACY"] = "advocacy";
})(FunnelStage || (exports.FunnelStage = FunnelStage = {}));
/**
 * Product lifecycle stages
 */
var ProductLifecycle;
(function (ProductLifecycle) {
    ProductLifecycle["INTRODUCTION"] = "introduction";
    ProductLifecycle["GROWTH"] = "growth";
    ProductLifecycle["MATURITY"] = "maturity";
    ProductLifecycle["DECLINE"] = "decline";
    ProductLifecycle["SUNSET"] = "sunset";
})(ProductLifecycle || (exports.ProductLifecycle = ProductLifecycle = {}));
/**
 * Market position types
 */
var MarketPosition;
(function (MarketPosition) {
    MarketPosition["LEADER"] = "leader";
    MarketPosition["CHALLENGER"] = "challenger";
    MarketPosition["FOLLOWER"] = "follower";
    MarketPosition["NICHER"] = "nicher";
})(MarketPosition || (exports.MarketPosition = MarketPosition = {}));
/**
 * Cross-sell opportunity types
 */
var CrossSellType;
(function (CrossSellType) {
    CrossSellType["COMPLEMENTARY_PRODUCT"] = "complementary_product";
    CrossSellType["UPGRADE"] = "upgrade";
    CrossSellType["ADD_ON"] = "add_on";
    CrossSellType["BUNDLE"] = "bundle";
    CrossSellType["PREMIUM_TIER"] = "premium_tier";
})(CrossSellType || (exports.CrossSellType = CrossSellType = {}));
// ============================================================================
// DTO CLASSES FOR VALIDATION AND SWAGGER
// ============================================================================
/**
 * Create Growth Strategy DTO
 */
let CreateGrowthStrategyDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _strategyType_decorators;
    let _strategyType_initializers = [];
    let _strategyType_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _targetMarkets_decorators;
    let _targetMarkets_initializers = [];
    let _targetMarkets_extraInitializers = [];
    let _targetSegments_decorators;
    let _targetSegments_initializers = [];
    let _targetSegments_extraInitializers = [];
    let _revenueGoal_decorators;
    let _revenueGoal_initializers = [];
    let _revenueGoal_extraInitializers = [];
    let _timeframeMonths_decorators;
    let _timeframeMonths_initializers = [];
    let _timeframeMonths_extraInitializers = [];
    let _investmentRequired_decorators;
    let _investmentRequired_initializers = [];
    let _investmentRequired_extraInitializers = [];
    let _expectedROI_decorators;
    let _expectedROI_initializers = [];
    let _expectedROI_extraInitializers = [];
    let _riskLevel_decorators;
    let _riskLevel_initializers = [];
    let _riskLevel_extraInitializers = [];
    let _keyInitiatives_decorators;
    let _keyInitiatives_initializers = [];
    let _keyInitiatives_extraInitializers = [];
    return _a = class CreateGrowthStrategyDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.strategyType = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _strategyType_initializers, void 0));
                this.name = (__runInitializers(this, _strategyType_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.targetMarkets = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _targetMarkets_initializers, void 0));
                this.targetSegments = (__runInitializers(this, _targetMarkets_extraInitializers), __runInitializers(this, _targetSegments_initializers, void 0));
                this.revenueGoal = (__runInitializers(this, _targetSegments_extraInitializers), __runInitializers(this, _revenueGoal_initializers, void 0));
                this.timeframeMonths = (__runInitializers(this, _revenueGoal_extraInitializers), __runInitializers(this, _timeframeMonths_initializers, void 0));
                this.investmentRequired = (__runInitializers(this, _timeframeMonths_extraInitializers), __runInitializers(this, _investmentRequired_initializers, void 0));
                this.expectedROI = (__runInitializers(this, _investmentRequired_extraInitializers), __runInitializers(this, _expectedROI_initializers, void 0));
                this.riskLevel = (__runInitializers(this, _expectedROI_extraInitializers), __runInitializers(this, _riskLevel_initializers, void 0));
                this.keyInitiatives = (__runInitializers(this, _riskLevel_extraInitializers), __runInitializers(this, _keyInitiatives_initializers, void 0));
                __runInitializers(this, _keyInitiatives_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID', example: 'uuid-org-123' }), (0, class_validator_1.IsUUID)()];
            _strategyType_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Strategy type',
                    enum: GrowthStrategyType,
                    example: GrowthStrategyType.MARKET_PENETRATION
                }), (0, class_validator_1.IsEnum)(GrowthStrategyType)];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strategy name', example: 'Enterprise Market Expansion 2024' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strategy description', example: 'Expand into Fortune 500 healthcare segment' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            _targetMarkets_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target markets', example: ['US Healthcare', 'EU Healthcare'], type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _targetSegments_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Target customer segments',
                    enum: CustomerSegment,
                    isArray: true,
                    example: [CustomerSegment.ENTERPRISE]
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsEnum)(CustomerSegment, { each: true })];
            _revenueGoal_decorators = [(0, swagger_1.ApiProperty)({ description: 'Revenue goal', example: 5000000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _timeframeMonths_decorators = [(0, swagger_1.ApiProperty)({ description: 'Timeframe in months', example: 12, minimum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _investmentRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Investment required', example: 500000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _expectedROI_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expected ROI', example: 3.5, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _riskLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Risk level', enum: ['low', 'medium', 'high'], example: 'medium' }), (0, class_validator_1.IsEnum)(['low', 'medium', 'high'])];
            _keyInitiatives_decorators = [(0, swagger_1.ApiProperty)({ description: 'Key initiatives', example: ['Hire enterprise sales team', 'Build partnership network'], type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _strategyType_decorators, { kind: "field", name: "strategyType", static: false, private: false, access: { has: obj => "strategyType" in obj, get: obj => obj.strategyType, set: (obj, value) => { obj.strategyType = value; } }, metadata: _metadata }, _strategyType_initializers, _strategyType_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _targetMarkets_decorators, { kind: "field", name: "targetMarkets", static: false, private: false, access: { has: obj => "targetMarkets" in obj, get: obj => obj.targetMarkets, set: (obj, value) => { obj.targetMarkets = value; } }, metadata: _metadata }, _targetMarkets_initializers, _targetMarkets_extraInitializers);
            __esDecorate(null, null, _targetSegments_decorators, { kind: "field", name: "targetSegments", static: false, private: false, access: { has: obj => "targetSegments" in obj, get: obj => obj.targetSegments, set: (obj, value) => { obj.targetSegments = value; } }, metadata: _metadata }, _targetSegments_initializers, _targetSegments_extraInitializers);
            __esDecorate(null, null, _revenueGoal_decorators, { kind: "field", name: "revenueGoal", static: false, private: false, access: { has: obj => "revenueGoal" in obj, get: obj => obj.revenueGoal, set: (obj, value) => { obj.revenueGoal = value; } }, metadata: _metadata }, _revenueGoal_initializers, _revenueGoal_extraInitializers);
            __esDecorate(null, null, _timeframeMonths_decorators, { kind: "field", name: "timeframeMonths", static: false, private: false, access: { has: obj => "timeframeMonths" in obj, get: obj => obj.timeframeMonths, set: (obj, value) => { obj.timeframeMonths = value; } }, metadata: _metadata }, _timeframeMonths_initializers, _timeframeMonths_extraInitializers);
            __esDecorate(null, null, _investmentRequired_decorators, { kind: "field", name: "investmentRequired", static: false, private: false, access: { has: obj => "investmentRequired" in obj, get: obj => obj.investmentRequired, set: (obj, value) => { obj.investmentRequired = value; } }, metadata: _metadata }, _investmentRequired_initializers, _investmentRequired_extraInitializers);
            __esDecorate(null, null, _expectedROI_decorators, { kind: "field", name: "expectedROI", static: false, private: false, access: { has: obj => "expectedROI" in obj, get: obj => obj.expectedROI, set: (obj, value) => { obj.expectedROI = value; } }, metadata: _metadata }, _expectedROI_initializers, _expectedROI_extraInitializers);
            __esDecorate(null, null, _riskLevel_decorators, { kind: "field", name: "riskLevel", static: false, private: false, access: { has: obj => "riskLevel" in obj, get: obj => obj.riskLevel, set: (obj, value) => { obj.riskLevel = value; } }, metadata: _metadata }, _riskLevel_initializers, _riskLevel_extraInitializers);
            __esDecorate(null, null, _keyInitiatives_decorators, { kind: "field", name: "keyInitiatives", static: false, private: false, access: { has: obj => "keyInitiatives" in obj, get: obj => obj.keyInitiatives, set: (obj, value) => { obj.keyInitiatives = value; } }, metadata: _metadata }, _keyInitiatives_initializers, _keyInitiatives_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateGrowthStrategyDto = CreateGrowthStrategyDto;
/**
 * Market Expansion Analysis DTO
 */
let MarketExpansionAnalysisDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _targetMarket_decorators;
    let _targetMarket_initializers = [];
    let _targetMarket_extraInitializers = [];
    let _approach_decorators;
    let _approach_initializers = [];
    let _approach_extraInitializers = [];
    let _marketSize_decorators;
    let _marketSize_initializers = [];
    let _marketSize_extraInitializers = [];
    let _addressableMarket_decorators;
    let _addressableMarket_initializers = [];
    let _addressableMarket_extraInitializers = [];
    let _penetrationRate_decorators;
    let _penetrationRate_initializers = [];
    let _penetrationRate_extraInitializers = [];
    return _a = class MarketExpansionAnalysisDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.targetMarket = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _targetMarket_initializers, void 0));
                this.approach = (__runInitializers(this, _targetMarket_extraInitializers), __runInitializers(this, _approach_initializers, void 0));
                this.marketSize = (__runInitializers(this, _approach_extraInitializers), __runInitializers(this, _marketSize_initializers, void 0));
                this.addressableMarket = (__runInitializers(this, _marketSize_extraInitializers), __runInitializers(this, _addressableMarket_initializers, void 0));
                this.penetrationRate = (__runInitializers(this, _addressableMarket_extraInitializers), __runInitializers(this, _penetrationRate_initializers, void 0));
                __runInitializers(this, _penetrationRate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID', example: 'uuid-org-123' }), (0, class_validator_1.IsUUID)()];
            _targetMarket_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target market', example: 'European Healthcare' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _approach_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Expansion approach',
                    enum: ExpansionApproach,
                    example: ExpansionApproach.GEOGRAPHIC
                }), (0, class_validator_1.IsEnum)(ExpansionApproach)];
            _marketSize_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total market size', example: 10000000000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _addressableMarket_decorators = [(0, swagger_1.ApiProperty)({ description: 'Addressable market', example: 1000000000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _penetrationRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current penetration rate', example: 0.05, minimum: 0, maximum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _targetMarket_decorators, { kind: "field", name: "targetMarket", static: false, private: false, access: { has: obj => "targetMarket" in obj, get: obj => obj.targetMarket, set: (obj, value) => { obj.targetMarket = value; } }, metadata: _metadata }, _targetMarket_initializers, _targetMarket_extraInitializers);
            __esDecorate(null, null, _approach_decorators, { kind: "field", name: "approach", static: false, private: false, access: { has: obj => "approach" in obj, get: obj => obj.approach, set: (obj, value) => { obj.approach = value; } }, metadata: _metadata }, _approach_initializers, _approach_extraInitializers);
            __esDecorate(null, null, _marketSize_decorators, { kind: "field", name: "marketSize", static: false, private: false, access: { has: obj => "marketSize" in obj, get: obj => obj.marketSize, set: (obj, value) => { obj.marketSize = value; } }, metadata: _metadata }, _marketSize_initializers, _marketSize_extraInitializers);
            __esDecorate(null, null, _addressableMarket_decorators, { kind: "field", name: "addressableMarket", static: false, private: false, access: { has: obj => "addressableMarket" in obj, get: obj => obj.addressableMarket, set: (obj, value) => { obj.addressableMarket = value; } }, metadata: _metadata }, _addressableMarket_initializers, _addressableMarket_extraInitializers);
            __esDecorate(null, null, _penetrationRate_decorators, { kind: "field", name: "penetrationRate", static: false, private: false, access: { has: obj => "penetrationRate" in obj, get: obj => obj.penetrationRate, set: (obj, value) => { obj.penetrationRate = value; } }, metadata: _metadata }, _penetrationRate_initializers, _penetrationRate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.MarketExpansionAnalysisDto = MarketExpansionAnalysisDto;
/**
 * Pricing Optimization DTO
 */
let PricingOptimizationDto = (() => {
    var _a;
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _currentPrice_decorators;
    let _currentPrice_initializers = [];
    let _currentPrice_extraInitializers = [];
    let _priceElasticity_decorators;
    let _priceElasticity_initializers = [];
    let _priceElasticity_extraInitializers = [];
    let _strategy_decorators;
    let _strategy_initializers = [];
    let _strategy_extraInitializers = [];
    let _variableCost_decorators;
    let _variableCost_initializers = [];
    let _variableCost_extraInitializers = [];
    let _fixedCosts_decorators;
    let _fixedCosts_initializers = [];
    let _fixedCosts_extraInitializers = [];
    return _a = class PricingOptimizationDto {
            constructor() {
                this.productId = __runInitializers(this, _productId_initializers, void 0);
                this.currentPrice = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _currentPrice_initializers, void 0));
                this.priceElasticity = (__runInitializers(this, _currentPrice_extraInitializers), __runInitializers(this, _priceElasticity_initializers, void 0));
                this.strategy = (__runInitializers(this, _priceElasticity_extraInitializers), __runInitializers(this, _strategy_initializers, void 0));
                this.variableCost = (__runInitializers(this, _strategy_extraInitializers), __runInitializers(this, _variableCost_initializers, void 0));
                this.fixedCosts = (__runInitializers(this, _variableCost_extraInitializers), __runInitializers(this, _fixedCosts_initializers, void 0));
                __runInitializers(this, _fixedCosts_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID', example: 'uuid-prod-123' }), (0, class_validator_1.IsUUID)()];
            _currentPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current price', example: 99.99, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _priceElasticity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Price elasticity', example: -1.5 }), (0, class_validator_1.IsNumber)()];
            _strategy_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Pricing strategy',
                    enum: PricingStrategy,
                    example: PricingStrategy.VALUE_BASED
                }), (0, class_validator_1.IsEnum)(PricingStrategy)];
            _variableCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Variable cost per unit', example: 25.50, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _fixedCosts_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fixed costs', example: 100000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _currentPrice_decorators, { kind: "field", name: "currentPrice", static: false, private: false, access: { has: obj => "currentPrice" in obj, get: obj => obj.currentPrice, set: (obj, value) => { obj.currentPrice = value; } }, metadata: _metadata }, _currentPrice_initializers, _currentPrice_extraInitializers);
            __esDecorate(null, null, _priceElasticity_decorators, { kind: "field", name: "priceElasticity", static: false, private: false, access: { has: obj => "priceElasticity" in obj, get: obj => obj.priceElasticity, set: (obj, value) => { obj.priceElasticity = value; } }, metadata: _metadata }, _priceElasticity_initializers, _priceElasticity_extraInitializers);
            __esDecorate(null, null, _strategy_decorators, { kind: "field", name: "strategy", static: false, private: false, access: { has: obj => "strategy" in obj, get: obj => obj.strategy, set: (obj, value) => { obj.strategy = value; } }, metadata: _metadata }, _strategy_initializers, _strategy_extraInitializers);
            __esDecorate(null, null, _variableCost_decorators, { kind: "field", name: "variableCost", static: false, private: false, access: { has: obj => "variableCost" in obj, get: obj => obj.variableCost, set: (obj, value) => { obj.variableCost = value; } }, metadata: _metadata }, _variableCost_initializers, _variableCost_extraInitializers);
            __esDecorate(null, null, _fixedCosts_decorators, { kind: "field", name: "fixedCosts", static: false, private: false, access: { has: obj => "fixedCosts" in obj, get: obj => obj.fixedCosts, set: (obj, value) => { obj.fixedCosts = value; } }, metadata: _metadata }, _fixedCosts_initializers, _fixedCosts_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PricingOptimizationDto = PricingOptimizationDto;
/**
 * Customer Lifetime Value DTO
 */
let CustomerLifetimeValueDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _segment_decorators;
    let _segment_initializers = [];
    let _segment_extraInitializers = [];
    let _acquisitionCost_decorators;
    let _acquisitionCost_initializers = [];
    let _acquisitionCost_extraInitializers = [];
    let _averageOrderValue_decorators;
    let _averageOrderValue_initializers = [];
    let _averageOrderValue_extraInitializers = [];
    let _purchaseFrequency_decorators;
    let _purchaseFrequency_initializers = [];
    let _purchaseFrequency_extraInitializers = [];
    let _customerLifespan_decorators;
    let _customerLifespan_initializers = [];
    let _customerLifespan_extraInitializers = [];
    let _retentionRate_decorators;
    let _retentionRate_initializers = [];
    let _retentionRate_extraInitializers = [];
    let _grossMargin_decorators;
    let _grossMargin_initializers = [];
    let _grossMargin_extraInitializers = [];
    let _discountRate_decorators;
    let _discountRate_initializers = [];
    let _discountRate_extraInitializers = [];
    return _a = class CustomerLifetimeValueDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.segment = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _segment_initializers, void 0));
                this.acquisitionCost = (__runInitializers(this, _segment_extraInitializers), __runInitializers(this, _acquisitionCost_initializers, void 0));
                this.averageOrderValue = (__runInitializers(this, _acquisitionCost_extraInitializers), __runInitializers(this, _averageOrderValue_initializers, void 0));
                this.purchaseFrequency = (__runInitializers(this, _averageOrderValue_extraInitializers), __runInitializers(this, _purchaseFrequency_initializers, void 0));
                this.customerLifespan = (__runInitializers(this, _purchaseFrequency_extraInitializers), __runInitializers(this, _customerLifespan_initializers, void 0));
                this.retentionRate = (__runInitializers(this, _customerLifespan_extraInitializers), __runInitializers(this, _retentionRate_initializers, void 0));
                this.grossMargin = (__runInitializers(this, _retentionRate_extraInitializers), __runInitializers(this, _grossMargin_initializers, void 0));
                this.discountRate = (__runInitializers(this, _grossMargin_extraInitializers), __runInitializers(this, _discountRate_initializers, void 0));
                __runInitializers(this, _discountRate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID', example: 'uuid-cust-123' }), (0, class_validator_1.IsUUID)()];
            _segment_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Customer segment',
                    enum: CustomerSegment,
                    example: CustomerSegment.ENTERPRISE
                }), (0, class_validator_1.IsEnum)(CustomerSegment)];
            _acquisitionCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer acquisition cost', example: 5000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _averageOrderValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Average order value', example: 1000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _purchaseFrequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Purchase frequency per year', example: 12, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _customerLifespan_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer lifespan in years', example: 5, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _retentionRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Retention rate', example: 0.85, minimum: 0, maximum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _grossMargin_decorators = [(0, swagger_1.ApiProperty)({ description: 'Gross margin', example: 0.6, minimum: 0, maximum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _discountRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount rate', example: 0.1, minimum: 0, maximum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _segment_decorators, { kind: "field", name: "segment", static: false, private: false, access: { has: obj => "segment" in obj, get: obj => obj.segment, set: (obj, value) => { obj.segment = value; } }, metadata: _metadata }, _segment_initializers, _segment_extraInitializers);
            __esDecorate(null, null, _acquisitionCost_decorators, { kind: "field", name: "acquisitionCost", static: false, private: false, access: { has: obj => "acquisitionCost" in obj, get: obj => obj.acquisitionCost, set: (obj, value) => { obj.acquisitionCost = value; } }, metadata: _metadata }, _acquisitionCost_initializers, _acquisitionCost_extraInitializers);
            __esDecorate(null, null, _averageOrderValue_decorators, { kind: "field", name: "averageOrderValue", static: false, private: false, access: { has: obj => "averageOrderValue" in obj, get: obj => obj.averageOrderValue, set: (obj, value) => { obj.averageOrderValue = value; } }, metadata: _metadata }, _averageOrderValue_initializers, _averageOrderValue_extraInitializers);
            __esDecorate(null, null, _purchaseFrequency_decorators, { kind: "field", name: "purchaseFrequency", static: false, private: false, access: { has: obj => "purchaseFrequency" in obj, get: obj => obj.purchaseFrequency, set: (obj, value) => { obj.purchaseFrequency = value; } }, metadata: _metadata }, _purchaseFrequency_initializers, _purchaseFrequency_extraInitializers);
            __esDecorate(null, null, _customerLifespan_decorators, { kind: "field", name: "customerLifespan", static: false, private: false, access: { has: obj => "customerLifespan" in obj, get: obj => obj.customerLifespan, set: (obj, value) => { obj.customerLifespan = value; } }, metadata: _metadata }, _customerLifespan_initializers, _customerLifespan_extraInitializers);
            __esDecorate(null, null, _retentionRate_decorators, { kind: "field", name: "retentionRate", static: false, private: false, access: { has: obj => "retentionRate" in obj, get: obj => obj.retentionRate, set: (obj, value) => { obj.retentionRate = value; } }, metadata: _metadata }, _retentionRate_initializers, _retentionRate_extraInitializers);
            __esDecorate(null, null, _grossMargin_decorators, { kind: "field", name: "grossMargin", static: false, private: false, access: { has: obj => "grossMargin" in obj, get: obj => obj.grossMargin, set: (obj, value) => { obj.grossMargin = value; } }, metadata: _metadata }, _grossMargin_initializers, _grossMargin_extraInitializers);
            __esDecorate(null, null, _discountRate_decorators, { kind: "field", name: "discountRate", static: false, private: false, access: { has: obj => "discountRate" in obj, get: obj => obj.discountRate, set: (obj, value) => { obj.discountRate = value; } }, metadata: _metadata }, _discountRate_initializers, _discountRate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CustomerLifetimeValueDto = CustomerLifetimeValueDto;
/**
 * Cross-Sell Opportunity DTO
 */
let CrossSellOpportunityDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _currentProducts_decorators;
    let _currentProducts_initializers = [];
    let _currentProducts_extraInitializers = [];
    let _recommendedProduct_decorators;
    let _recommendedProduct_initializers = [];
    let _recommendedProduct_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _expectedRevenue_decorators;
    let _expectedRevenue_initializers = [];
    let _expectedRevenue_extraInitializers = [];
    return _a = class CrossSellOpportunityDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.currentProducts = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _currentProducts_initializers, void 0));
                this.recommendedProduct = (__runInitializers(this, _currentProducts_extraInitializers), __runInitializers(this, _recommendedProduct_initializers, void 0));
                this.type = (__runInitializers(this, _recommendedProduct_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.expectedRevenue = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _expectedRevenue_initializers, void 0));
                __runInitializers(this, _expectedRevenue_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID', example: 'uuid-cust-123' }), (0, class_validator_1.IsUUID)()];
            _currentProducts_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current products', example: ['prod-1', 'prod-2'], type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _recommendedProduct_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recommended product ID', example: 'uuid-prod-456' }), (0, class_validator_1.IsUUID)()];
            _type_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Cross-sell type',
                    enum: CrossSellType,
                    example: CrossSellType.COMPLEMENTARY_PRODUCT
                }), (0, class_validator_1.IsEnum)(CrossSellType)];
            _expectedRevenue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expected revenue', example: 2500, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _currentProducts_decorators, { kind: "field", name: "currentProducts", static: false, private: false, access: { has: obj => "currentProducts" in obj, get: obj => obj.currentProducts, set: (obj, value) => { obj.currentProducts = value; } }, metadata: _metadata }, _currentProducts_initializers, _currentProducts_extraInitializers);
            __esDecorate(null, null, _recommendedProduct_decorators, { kind: "field", name: "recommendedProduct", static: false, private: false, access: { has: obj => "recommendedProduct" in obj, get: obj => obj.recommendedProduct, set: (obj, value) => { obj.recommendedProduct = value; } }, metadata: _metadata }, _recommendedProduct_initializers, _recommendedProduct_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _expectedRevenue_decorators, { kind: "field", name: "expectedRevenue", static: false, private: false, access: { has: obj => "expectedRevenue" in obj, get: obj => obj.expectedRevenue, set: (obj, value) => { obj.expectedRevenue = value; } }, metadata: _metadata }, _expectedRevenue_initializers, _expectedRevenue_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CrossSellOpportunityDto = CrossSellOpportunityDto;
/**
 * Sales Funnel Metrics DTO
 */
let SalesFunnelMetricsDto = (() => {
    var _a;
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _segment_decorators;
    let _segment_initializers = [];
    let _segment_extraInitializers = [];
    let _period_decorators;
    let _period_initializers = [];
    let _period_extraInitializers = [];
    let _averageDealSize_decorators;
    let _averageDealSize_initializers = [];
    let _averageDealSize_extraInitializers = [];
    return _a = class SalesFunnelMetricsDto {
            constructor() {
                this.productId = __runInitializers(this, _productId_initializers, void 0);
                this.segment = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _segment_initializers, void 0));
                this.period = (__runInitializers(this, _segment_extraInitializers), __runInitializers(this, _period_initializers, void 0));
                this.averageDealSize = (__runInitializers(this, _period_extraInitializers), __runInitializers(this, _averageDealSize_initializers, void 0));
                __runInitializers(this, _averageDealSize_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID', example: 'uuid-prod-123' }), (0, class_validator_1.IsUUID)()];
            _segment_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Customer segment',
                    enum: CustomerSegment,
                    example: CustomerSegment.MID_MARKET
                }), (0, class_validator_1.IsEnum)(CustomerSegment)];
            _period_decorators = [(0, swagger_1.ApiProperty)({ description: 'Analysis period', example: '2024-Q1' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _averageDealSize_decorators = [(0, swagger_1.ApiProperty)({ description: 'Average deal size', example: 50000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _segment_decorators, { kind: "field", name: "segment", static: false, private: false, access: { has: obj => "segment" in obj, get: obj => obj.segment, set: (obj, value) => { obj.segment = value; } }, metadata: _metadata }, _segment_initializers, _segment_extraInitializers);
            __esDecorate(null, null, _period_decorators, { kind: "field", name: "period", static: false, private: false, access: { has: obj => "period" in obj, get: obj => obj.period, set: (obj, value) => { obj.period = value; } }, metadata: _metadata }, _period_initializers, _period_extraInitializers);
            __esDecorate(null, null, _averageDealSize_decorators, { kind: "field", name: "averageDealSize", static: false, private: false, access: { has: obj => "averageDealSize" in obj, get: obj => obj.averageDealSize, set: (obj, value) => { obj.averageDealSize = value; } }, metadata: _metadata }, _averageDealSize_initializers, _averageDealSize_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SalesFunnelMetricsDto = SalesFunnelMetricsDto;
/**
 * Revenue Forecast DTO
 */
let RevenueForecastDto = (() => {
    var _a;
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _period_decorators;
    let _period_initializers = [];
    let _period_extraInitializers = [];
    let _baselineRevenue_decorators;
    let _baselineRevenue_initializers = [];
    let _baselineRevenue_extraInitializers = [];
    let _growthRate_decorators;
    let _growthRate_initializers = [];
    let _growthRate_extraInitializers = [];
    let _confidence_decorators;
    let _confidence_initializers = [];
    let _confidence_extraInitializers = [];
    return _a = class RevenueForecastDto {
            constructor() {
                this.organizationId = __runInitializers(this, _organizationId_initializers, void 0);
                this.period = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _period_initializers, void 0));
                this.baselineRevenue = (__runInitializers(this, _period_extraInitializers), __runInitializers(this, _baselineRevenue_initializers, void 0));
                this.growthRate = (__runInitializers(this, _baselineRevenue_extraInitializers), __runInitializers(this, _growthRate_initializers, void 0));
                this.confidence = (__runInitializers(this, _growthRate_extraInitializers), __runInitializers(this, _confidence_initializers, void 0));
                __runInitializers(this, _confidence_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _organizationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Organization ID', example: 'uuid-org-123' }), (0, class_validator_1.IsUUID)()];
            _period_decorators = [(0, swagger_1.ApiProperty)({ description: 'Forecast period', example: '2024-Q2' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _baselineRevenue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Baseline revenue', example: 10000000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _growthRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expected growth rate', example: 0.15, minimum: -1, maximum: 10 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(-1), (0, class_validator_1.Max)(10)];
            _confidence_decorators = [(0, swagger_1.ApiProperty)({ description: 'Confidence level', example: 0.85, minimum: 0, maximum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _period_decorators, { kind: "field", name: "period", static: false, private: false, access: { has: obj => "period" in obj, get: obj => obj.period, set: (obj, value) => { obj.period = value; } }, metadata: _metadata }, _period_initializers, _period_extraInitializers);
            __esDecorate(null, null, _baselineRevenue_decorators, { kind: "field", name: "baselineRevenue", static: false, private: false, access: { has: obj => "baselineRevenue" in obj, get: obj => obj.baselineRevenue, set: (obj, value) => { obj.baselineRevenue = value; } }, metadata: _metadata }, _baselineRevenue_initializers, _baselineRevenue_extraInitializers);
            __esDecorate(null, null, _growthRate_decorators, { kind: "field", name: "growthRate", static: false, private: false, access: { has: obj => "growthRate" in obj, get: obj => obj.growthRate, set: (obj, value) => { obj.growthRate = value; } }, metadata: _metadata }, _growthRate_initializers, _growthRate_extraInitializers);
            __esDecorate(null, null, _confidence_decorators, { kind: "field", name: "confidence", static: false, private: false, access: { has: obj => "confidence" in obj, get: obj => obj.confidence, set: (obj, value) => { obj.confidence = value; } }, metadata: _metadata }, _confidence_initializers, _confidence_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RevenueForecastDto = RevenueForecastDto;
/**
 * Product-Market Fit DTO
 */
let ProductMarketFitDto = (() => {
    var _a;
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _marketSegment_decorators;
    let _marketSegment_initializers = [];
    let _marketSegment_extraInitializers = [];
    let _adoptionRate_decorators;
    let _adoptionRate_initializers = [];
    let _adoptionRate_extraInitializers = [];
    let _retentionRate_decorators;
    let _retentionRate_initializers = [];
    let _retentionRate_extraInitializers = [];
    let _nps_decorators;
    let _nps_initializers = [];
    let _nps_extraInitializers = [];
    let _productUsage_decorators;
    let _productUsage_initializers = [];
    let _productUsage_extraInitializers = [];
    return _a = class ProductMarketFitDto {
            constructor() {
                this.productId = __runInitializers(this, _productId_initializers, void 0);
                this.marketSegment = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _marketSegment_initializers, void 0));
                this.adoptionRate = (__runInitializers(this, _marketSegment_extraInitializers), __runInitializers(this, _adoptionRate_initializers, void 0));
                this.retentionRate = (__runInitializers(this, _adoptionRate_extraInitializers), __runInitializers(this, _retentionRate_initializers, void 0));
                this.nps = (__runInitializers(this, _retentionRate_extraInitializers), __runInitializers(this, _nps_initializers, void 0));
                this.productUsage = (__runInitializers(this, _nps_extraInitializers), __runInitializers(this, _productUsage_initializers, void 0));
                __runInitializers(this, _productUsage_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID', example: 'uuid-prod-123' }), (0, class_validator_1.IsUUID)()];
            _marketSegment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Market segment', example: 'Enterprise Healthcare' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _adoptionRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Adoption rate', example: 0.35, minimum: 0, maximum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _retentionRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Retention rate', example: 0.92, minimum: 0, maximum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _nps_decorators = [(0, swagger_1.ApiProperty)({ description: 'Net Promoter Score', example: 65, minimum: -100, maximum: 100 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(-100), (0, class_validator_1.Max)(100)];
            _productUsage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product usage score', example: 0.75, minimum: 0, maximum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _marketSegment_decorators, { kind: "field", name: "marketSegment", static: false, private: false, access: { has: obj => "marketSegment" in obj, get: obj => obj.marketSegment, set: (obj, value) => { obj.marketSegment = value; } }, metadata: _metadata }, _marketSegment_initializers, _marketSegment_extraInitializers);
            __esDecorate(null, null, _adoptionRate_decorators, { kind: "field", name: "adoptionRate", static: false, private: false, access: { has: obj => "adoptionRate" in obj, get: obj => obj.adoptionRate, set: (obj, value) => { obj.adoptionRate = value; } }, metadata: _metadata }, _adoptionRate_initializers, _adoptionRate_extraInitializers);
            __esDecorate(null, null, _retentionRate_decorators, { kind: "field", name: "retentionRate", static: false, private: false, access: { has: obj => "retentionRate" in obj, get: obj => obj.retentionRate, set: (obj, value) => { obj.retentionRate = value; } }, metadata: _metadata }, _retentionRate_initializers, _retentionRate_extraInitializers);
            __esDecorate(null, null, _nps_decorators, { kind: "field", name: "nps", static: false, private: false, access: { has: obj => "nps" in obj, get: obj => obj.nps, set: (obj, value) => { obj.nps = value; } }, metadata: _metadata }, _nps_initializers, _nps_extraInitializers);
            __esDecorate(null, null, _productUsage_decorators, { kind: "field", name: "productUsage", static: false, private: false, access: { has: obj => "productUsage" in obj, get: obj => obj.productUsage, set: (obj, value) => { obj.productUsage = value; } }, metadata: _metadata }, _productUsage_initializers, _productUsage_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ProductMarketFitDto = ProductMarketFitDto;
/**
 * Revenue Stream Analysis DTO
 */
let RevenueStreamAnalysisDto = (() => {
    var _a;
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _currentRevenue_decorators;
    let _currentRevenue_initializers = [];
    let _currentRevenue_extraInitializers = [];
    let _growthRate_decorators;
    let _growthRate_initializers = [];
    let _growthRate_extraInitializers = [];
    let _profitability_decorators;
    let _profitability_initializers = [];
    let _profitability_extraInitializers = [];
    let _customerCount_decorators;
    let _customerCount_initializers = [];
    let _customerCount_extraInitializers = [];
    let _lifecycle_decorators;
    let _lifecycle_initializers = [];
    let _lifecycle_extraInitializers = [];
    return _a = class RevenueStreamAnalysisDto {
            constructor() {
                this.type = __runInitializers(this, _type_initializers, void 0);
                this.currentRevenue = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _currentRevenue_initializers, void 0));
                this.growthRate = (__runInitializers(this, _currentRevenue_extraInitializers), __runInitializers(this, _growthRate_initializers, void 0));
                this.profitability = (__runInitializers(this, _growthRate_extraInitializers), __runInitializers(this, _profitability_initializers, void 0));
                this.customerCount = (__runInitializers(this, _profitability_extraInitializers), __runInitializers(this, _customerCount_initializers, void 0));
                this.lifecycle = (__runInitializers(this, _customerCount_extraInitializers), __runInitializers(this, _lifecycle_initializers, void 0));
                __runInitializers(this, _lifecycle_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _type_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Revenue stream type',
                    enum: RevenueStreamType,
                    example: RevenueStreamType.SUBSCRIPTION
                }), (0, class_validator_1.IsEnum)(RevenueStreamType)];
            _currentRevenue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current revenue', example: 5000000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _growthRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Growth rate', example: 0.25, minimum: -1, maximum: 10 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(-1), (0, class_validator_1.Max)(10)];
            _profitability_decorators = [(0, swagger_1.ApiProperty)({ description: 'Profitability', example: 0.45, minimum: -1, maximum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(-1), (0, class_validator_1.Max)(1)];
            _customerCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer count', example: 500, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _lifecycle_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Product lifecycle',
                    enum: ProductLifecycle,
                    example: ProductLifecycle.GROWTH
                }), (0, class_validator_1.IsEnum)(ProductLifecycle)];
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _currentRevenue_decorators, { kind: "field", name: "currentRevenue", static: false, private: false, access: { has: obj => "currentRevenue" in obj, get: obj => obj.currentRevenue, set: (obj, value) => { obj.currentRevenue = value; } }, metadata: _metadata }, _currentRevenue_initializers, _currentRevenue_extraInitializers);
            __esDecorate(null, null, _growthRate_decorators, { kind: "field", name: "growthRate", static: false, private: false, access: { has: obj => "growthRate" in obj, get: obj => obj.growthRate, set: (obj, value) => { obj.growthRate = value; } }, metadata: _metadata }, _growthRate_initializers, _growthRate_extraInitializers);
            __esDecorate(null, null, _profitability_decorators, { kind: "field", name: "profitability", static: false, private: false, access: { has: obj => "profitability" in obj, get: obj => obj.profitability, set: (obj, value) => { obj.profitability = value; } }, metadata: _metadata }, _profitability_initializers, _profitability_extraInitializers);
            __esDecorate(null, null, _customerCount_decorators, { kind: "field", name: "customerCount", static: false, private: false, access: { has: obj => "customerCount" in obj, get: obj => obj.customerCount, set: (obj, value) => { obj.customerCount = value; } }, metadata: _metadata }, _customerCount_initializers, _customerCount_extraInitializers);
            __esDecorate(null, null, _lifecycle_decorators, { kind: "field", name: "lifecycle", static: false, private: false, access: { has: obj => "lifecycle" in obj, get: obj => obj.lifecycle, set: (obj, value) => { obj.lifecycle = value; } }, metadata: _metadata }, _lifecycle_initializers, _lifecycle_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RevenueStreamAnalysisDto = RevenueStreamAnalysisDto;
/**
 * Penetration Strategy DTO
 */
let PenetrationStrategyDto = (() => {
    var _a;
    let _targetMarket_decorators;
    let _targetMarket_initializers = [];
    let _targetMarket_extraInitializers = [];
    let _currentPenetration_decorators;
    let _currentPenetration_initializers = [];
    let _currentPenetration_extraInitializers = [];
    let _targetPenetration_decorators;
    let _targetPenetration_initializers = [];
    let _targetPenetration_extraInitializers = [];
    let _timeframe_decorators;
    let _timeframe_initializers = [];
    let _timeframe_extraInitializers = [];
    let _investmentRequired_decorators;
    let _investmentRequired_initializers = [];
    let _investmentRequired_extraInitializers = [];
    let _expectedRevenue_decorators;
    let _expectedRevenue_initializers = [];
    let _expectedRevenue_extraInitializers = [];
    return _a = class PenetrationStrategyDto {
            constructor() {
                this.targetMarket = __runInitializers(this, _targetMarket_initializers, void 0);
                this.currentPenetration = (__runInitializers(this, _targetMarket_extraInitializers), __runInitializers(this, _currentPenetration_initializers, void 0));
                this.targetPenetration = (__runInitializers(this, _currentPenetration_extraInitializers), __runInitializers(this, _targetPenetration_initializers, void 0));
                this.timeframe = (__runInitializers(this, _targetPenetration_extraInitializers), __runInitializers(this, _timeframe_initializers, void 0));
                this.investmentRequired = (__runInitializers(this, _timeframe_extraInitializers), __runInitializers(this, _investmentRequired_initializers, void 0));
                this.expectedRevenue = (__runInitializers(this, _investmentRequired_extraInitializers), __runInitializers(this, _expectedRevenue_initializers, void 0));
                __runInitializers(this, _expectedRevenue_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _targetMarket_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target market', example: 'US Mid-Market Healthcare' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _currentPenetration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current penetration rate', example: 0.08, minimum: 0, maximum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _targetPenetration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target penetration rate', example: 0.25, minimum: 0, maximum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _timeframe_decorators = [(0, swagger_1.ApiProperty)({ description: 'Timeframe in months', example: 18, minimum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _investmentRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Investment required', example: 750000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _expectedRevenue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expected revenue', example: 3000000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _targetMarket_decorators, { kind: "field", name: "targetMarket", static: false, private: false, access: { has: obj => "targetMarket" in obj, get: obj => obj.targetMarket, set: (obj, value) => { obj.targetMarket = value; } }, metadata: _metadata }, _targetMarket_initializers, _targetMarket_extraInitializers);
            __esDecorate(null, null, _currentPenetration_decorators, { kind: "field", name: "currentPenetration", static: false, private: false, access: { has: obj => "currentPenetration" in obj, get: obj => obj.currentPenetration, set: (obj, value) => { obj.currentPenetration = value; } }, metadata: _metadata }, _currentPenetration_initializers, _currentPenetration_extraInitializers);
            __esDecorate(null, null, _targetPenetration_decorators, { kind: "field", name: "targetPenetration", static: false, private: false, access: { has: obj => "targetPenetration" in obj, get: obj => obj.targetPenetration, set: (obj, value) => { obj.targetPenetration = value; } }, metadata: _metadata }, _targetPenetration_initializers, _targetPenetration_extraInitializers);
            __esDecorate(null, null, _timeframe_decorators, { kind: "field", name: "timeframe", static: false, private: false, access: { has: obj => "timeframe" in obj, get: obj => obj.timeframe, set: (obj, value) => { obj.timeframe = value; } }, metadata: _metadata }, _timeframe_initializers, _timeframe_extraInitializers);
            __esDecorate(null, null, _investmentRequired_decorators, { kind: "field", name: "investmentRequired", static: false, private: false, access: { has: obj => "investmentRequired" in obj, get: obj => obj.investmentRequired, set: (obj, value) => { obj.investmentRequired = value; } }, metadata: _metadata }, _investmentRequired_initializers, _investmentRequired_extraInitializers);
            __esDecorate(null, null, _expectedRevenue_decorators, { kind: "field", name: "expectedRevenue", static: false, private: false, access: { has: obj => "expectedRevenue" in obj, get: obj => obj.expectedRevenue, set: (obj, value) => { obj.expectedRevenue = value; } }, metadata: _metadata }, _expectedRevenue_initializers, _expectedRevenue_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PenetrationStrategyDto = PenetrationStrategyDto;
/**
 * Upsell Scoring DTO
 */
let UpsellScoringDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _currentTier_decorators;
    let _currentTier_initializers = [];
    let _currentTier_extraInitializers = [];
    let _targetTier_decorators;
    let _targetTier_initializers = [];
    let _targetTier_extraInitializers = [];
    let _featureAdoption_decorators;
    let _featureAdoption_initializers = [];
    let _featureAdoption_extraInitializers = [];
    let _engagementScore_decorators;
    let _engagementScore_initializers = [];
    let _engagementScore_extraInitializers = [];
    let _healthScore_decorators;
    let _healthScore_initializers = [];
    let _healthScore_extraInitializers = [];
    let _revenueIncrement_decorators;
    let _revenueIncrement_initializers = [];
    let _revenueIncrement_extraInitializers = [];
    return _a = class UpsellScoringDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.currentTier = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _currentTier_initializers, void 0));
                this.targetTier = (__runInitializers(this, _currentTier_extraInitializers), __runInitializers(this, _targetTier_initializers, void 0));
                this.featureAdoption = (__runInitializers(this, _targetTier_extraInitializers), __runInitializers(this, _featureAdoption_initializers, void 0));
                this.engagementScore = (__runInitializers(this, _featureAdoption_extraInitializers), __runInitializers(this, _engagementScore_initializers, void 0));
                this.healthScore = (__runInitializers(this, _engagementScore_extraInitializers), __runInitializers(this, _healthScore_initializers, void 0));
                this.revenueIncrement = (__runInitializers(this, _healthScore_extraInitializers), __runInitializers(this, _revenueIncrement_initializers, void 0));
                __runInitializers(this, _revenueIncrement_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID', example: 'uuid-cust-123' }), (0, class_validator_1.IsUUID)()];
            _currentTier_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current tier', example: 'Professional' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _targetTier_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target tier', example: 'Enterprise' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _featureAdoption_decorators = [(0, swagger_1.ApiProperty)({ description: 'Feature adoption rate', example: 0.75, minimum: 0, maximum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _engagementScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Engagement score', example: 85, minimum: 0, maximum: 100 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _healthScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer health score', example: 92, minimum: 0, maximum: 100 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _revenueIncrement_decorators = [(0, swagger_1.ApiProperty)({ description: 'Revenue increment', example: 15000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _currentTier_decorators, { kind: "field", name: "currentTier", static: false, private: false, access: { has: obj => "currentTier" in obj, get: obj => obj.currentTier, set: (obj, value) => { obj.currentTier = value; } }, metadata: _metadata }, _currentTier_initializers, _currentTier_extraInitializers);
            __esDecorate(null, null, _targetTier_decorators, { kind: "field", name: "targetTier", static: false, private: false, access: { has: obj => "targetTier" in obj, get: obj => obj.targetTier, set: (obj, value) => { obj.targetTier = value; } }, metadata: _metadata }, _targetTier_initializers, _targetTier_extraInitializers);
            __esDecorate(null, null, _featureAdoption_decorators, { kind: "field", name: "featureAdoption", static: false, private: false, access: { has: obj => "featureAdoption" in obj, get: obj => obj.featureAdoption, set: (obj, value) => { obj.featureAdoption = value; } }, metadata: _metadata }, _featureAdoption_initializers, _featureAdoption_extraInitializers);
            __esDecorate(null, null, _engagementScore_decorators, { kind: "field", name: "engagementScore", static: false, private: false, access: { has: obj => "engagementScore" in obj, get: obj => obj.engagementScore, set: (obj, value) => { obj.engagementScore = value; } }, metadata: _metadata }, _engagementScore_initializers, _engagementScore_extraInitializers);
            __esDecorate(null, null, _healthScore_decorators, { kind: "field", name: "healthScore", static: false, private: false, access: { has: obj => "healthScore" in obj, get: obj => obj.healthScore, set: (obj, value) => { obj.healthScore = value; } }, metadata: _metadata }, _healthScore_initializers, _healthScore_extraInitializers);
            __esDecorate(null, null, _revenueIncrement_decorators, { kind: "field", name: "revenueIncrement", static: false, private: false, access: { has: obj => "revenueIncrement" in obj, get: obj => obj.revenueIncrement, set: (obj, value) => { obj.revenueIncrement = value; } }, metadata: _metadata }, _revenueIncrement_initializers, _revenueIncrement_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpsellScoringDto = UpsellScoringDto;
/**
 * Churn Prediction DTO
 */
let ChurnPredictionDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _churnProbability_decorators;
    let _churnProbability_initializers = [];
    let _churnProbability_extraInitializers = [];
    let _revenueAtRisk_decorators;
    let _revenueAtRisk_initializers = [];
    let _revenueAtRisk_extraInitializers = [];
    let _retentionCost_decorators;
    let _retentionCost_initializers = [];
    let _retentionCost_extraInitializers = [];
    let _lifetimeValue_decorators;
    let _lifetimeValue_initializers = [];
    let _lifetimeValue_extraInitializers = [];
    return _a = class ChurnPredictionDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.churnProbability = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _churnProbability_initializers, void 0));
                this.revenueAtRisk = (__runInitializers(this, _churnProbability_extraInitializers), __runInitializers(this, _revenueAtRisk_initializers, void 0));
                this.retentionCost = (__runInitializers(this, _revenueAtRisk_extraInitializers), __runInitializers(this, _retentionCost_initializers, void 0));
                this.lifetimeValue = (__runInitializers(this, _retentionCost_extraInitializers), __runInitializers(this, _lifetimeValue_initializers, void 0));
                __runInitializers(this, _lifetimeValue_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID', example: 'uuid-cust-123' }), (0, class_validator_1.IsUUID)()];
            _churnProbability_decorators = [(0, swagger_1.ApiProperty)({ description: 'Churn probability', example: 0.35, minimum: 0, maximum: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(1)];
            _revenueAtRisk_decorators = [(0, swagger_1.ApiProperty)({ description: 'Revenue at risk', example: 50000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _retentionCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Retention cost', example: 5000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _lifetimeValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer lifetime value', example: 150000, minimum: 0 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _churnProbability_decorators, { kind: "field", name: "churnProbability", static: false, private: false, access: { has: obj => "churnProbability" in obj, get: obj => obj.churnProbability, set: (obj, value) => { obj.churnProbability = value; } }, metadata: _metadata }, _churnProbability_initializers, _churnProbability_extraInitializers);
            __esDecorate(null, null, _revenueAtRisk_decorators, { kind: "field", name: "revenueAtRisk", static: false, private: false, access: { has: obj => "revenueAtRisk" in obj, get: obj => obj.revenueAtRisk, set: (obj, value) => { obj.revenueAtRisk = value; } }, metadata: _metadata }, _revenueAtRisk_initializers, _revenueAtRisk_extraInitializers);
            __esDecorate(null, null, _retentionCost_decorators, { kind: "field", name: "retentionCost", static: false, private: false, access: { has: obj => "retentionCost" in obj, get: obj => obj.retentionCost, set: (obj, value) => { obj.retentionCost = value; } }, metadata: _metadata }, _retentionCost_initializers, _retentionCost_extraInitializers);
            __esDecorate(null, null, _lifetimeValue_decorators, { kind: "field", name: "lifetimeValue", static: false, private: false, access: { has: obj => "lifetimeValue" in obj, get: obj => obj.lifetimeValue, set: (obj, value) => { obj.lifetimeValue = value; } }, metadata: _metadata }, _lifetimeValue_initializers, _lifetimeValue_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ChurnPredictionDto = ChurnPredictionDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Growth Strategy Sequelize Model
 */
class GrowthStrategy extends sequelize_1.Model {
}
exports.GrowthStrategy = GrowthStrategy;
function initGrowthStrategyModel(sequelize) {
    GrowthStrategy.init({
        strategyId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        organizationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        strategyType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(GrowthStrategyType)),
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
        targetMarkets: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            defaultValue: [],
        },
        targetSegments: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.ENUM(...Object.values(CustomerSegment))),
            defaultValue: [],
        },
        revenueGoal: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        timeframeMonths: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        investmentRequired: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        expectedROI: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        riskLevel: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high'),
            allowNull: false,
        },
        keyInitiatives: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            defaultValue: [],
        },
        successMetrics: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('planning', 'active', 'paused', 'completed'),
            defaultValue: 'planning',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'growth_strategies',
        timestamps: true,
        indexes: [
            { fields: ['organizationId'] },
            { fields: ['strategyType'] },
            { fields: ['status'] },
        ],
    });
    return GrowthStrategy;
}
/**
 * Revenue Forecast Sequelize Model
 */
class RevenueForecastModel extends sequelize_1.Model {
}
exports.RevenueForecastModel = RevenueForecastModel;
function initRevenueForecastModel(sequelize) {
    RevenueForecastModel.init({
        forecastId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        organizationId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        period: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        baselineRevenue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        forecastedRevenue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        growthRate: {
            type: sequelize_1.DataTypes.DECIMAL(8, 4),
            allowNull: false,
        },
        confidence: {
            type: sequelize_1.DataTypes.DECIMAL(5, 4),
            allowNull: false,
        },
        revenueStreams: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
        },
        seasonalFactors: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
        },
        marketFactors: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
        },
        assumptions: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            defaultValue: [],
        },
        riskAdjustment: {
            type: sequelize_1.DataTypes.DECIMAL(8, 4),
            defaultValue: 0,
        },
        upside: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },
        downside: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            defaultValue: 0,
        },
    }, {
        sequelize,
        tableName: 'revenue_forecasts',
        timestamps: true,
        indexes: [
            { fields: ['organizationId'] },
            { fields: ['period'] },
        ],
    });
    return RevenueForecastModel;
}
/**
 * Customer Lifetime Value Sequelize Model
 */
class CustomerLTVModel extends sequelize_1.Model {
}
exports.CustomerLTVModel = CustomerLTVModel;
function initCustomerLTVModel(sequelize) {
    CustomerLTVModel.init({
        customerId: {
            type: sequelize_1.DataTypes.UUID,
            primaryKey: true,
        },
        segment: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(CustomerSegment)),
            allowNull: false,
        },
        acquisitionCost: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        averageOrderValue: {
            type: sequelize_1.DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        purchaseFrequency: {
            type: sequelize_1.DataTypes.DECIMAL(8, 2),
            allowNull: false,
        },
        customerLifespan: {
            type: sequelize_1.DataTypes.DECIMAL(8, 2),
            allowNull: false,
        },
        retentionRate: {
            type: sequelize_1.DataTypes.DECIMAL(5, 4),
            allowNull: false,
        },
        churnRate: {
            type: sequelize_1.DataTypes.DECIMAL(5, 4),
            allowNull: false,
        },
        grossMargin: {
            type: sequelize_1.DataTypes.DECIMAL(5, 4),
            allowNull: false,
        },
        discountRate: {
            type: sequelize_1.DataTypes.DECIMAL(5, 4),
            allowNull: false,
        },
        clv: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        clvCacRatio: {
            type: sequelize_1.DataTypes.DECIMAL(8, 2),
            allowNull: false,
        },
        profitability: {
            type: sequelize_1.DataTypes.ENUM('high', 'medium', 'low', 'negative'),
            allowNull: false,
        },
        recommendations: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            defaultValue: [],
        },
    }, {
        sequelize,
        tableName: 'customer_ltv',
        timestamps: true,
        indexes: [
            { fields: ['segment'] },
            { fields: ['profitability'] },
        ],
    });
    return CustomerLTVModel;
}
// ============================================================================
// CORE REVENUE GROWTH FUNCTIONS
// ============================================================================
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
async function createGrowthStrategy(data, transaction) {
    const strategyId = data.strategyId || `STRAT-${Date.now()}`;
    const roi = data.investmentRequired && data.revenueGoal ?
        (data.revenueGoal / data.investmentRequired) : 0;
    return {
        strategyId,
        organizationId: data.organizationId || '',
        strategyType: data.strategyType || GrowthStrategyType.MARKET_PENETRATION,
        name: data.name || '',
        description: data.description || '',
        targetMarkets: data.targetMarkets || [],
        targetSegments: data.targetSegments || [],
        revenueGoal: data.revenueGoal || 0,
        timeframeMonths: data.timeframeMonths || 12,
        investmentRequired: data.investmentRequired || 0,
        expectedROI: data.expectedROI || roi,
        riskLevel: data.riskLevel || 'medium',
        keyInitiatives: data.keyInitiatives || [],
        successMetrics: data.successMetrics || {},
        status: data.status || 'planning',
        metadata: data.metadata || {},
    };
}
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
async function analyzeMarketExpansion(data) {
    const analysisId = data.analysisId || `MKTEXP-${Date.now()}`;
    const estimatedRevenue = (data.addressableMarket || 0) * (data.penetrationRate || 0);
    const competitiveIntensity = data.competitiveIntensity || 0.5;
    const recommendations = [];
    if (competitiveIntensity > 0.7) {
        recommendations.push('High competitive intensity - consider differentiation strategy');
    }
    if ((data.penetrationRate || 0) < 0.1) {
        recommendations.push('Low penetration - significant growth opportunity');
    }
    return {
        analysisId,
        organizationId: data.organizationId || '',
        targetMarket: data.targetMarket || '',
        approach: data.approach || ExpansionApproach.GEOGRAPHIC,
        marketSize: data.marketSize || 0,
        addressableMarket: data.addressableMarket || 0,
        penetrationRate: data.penetrationRate || 0,
        competitiveIntensity,
        entryBarriers: data.entryBarriers || [],
        requiredCapabilities: data.requiredCapabilities || [],
        estimatedRevenue,
        timeToBreakeven: data.timeToBreakeven || 24,
        riskFactors: data.riskFactors || [],
        recommendations,
    };
}
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
async function optimizeProductPricing(data) {
    const optimizationId = data.optimizationId || `PRICEOPT-${Date.now()}`;
    const currentPrice = data.currentPrice || 0;
    const elasticity = data.priceElasticity || -1.2;
    // Simplified optimal pricing based on elasticity
    const markupFactor = 1 / (1 + (1 / elasticity));
    const optimalPrice = currentPrice * (1 + markupFactor * 0.1);
    const revenueImpact = ((optimalPrice - currentPrice) / currentPrice) * 100;
    const volumeImpact = elasticity * (revenueImpact / 100);
    const profitImpact = revenueImpact + volumeImpact * 50;
    return {
        optimizationId,
        productId: data.productId || '',
        currentPrice,
        optimalPrice,
        priceElasticity: elasticity,
        demandCurve: data.demandCurve || {},
        competitorPrices: data.competitorPrices || {},
        costStructure: data.costStructure || {
            variable: 0,
            fixed: 0,
            margin: 0,
        },
        strategy: data.strategy || PricingStrategy.VALUE_BASED,
        revenueImpact,
        volumeImpact,
        profitImpact,
        confidence: 0.85,
    };
}
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
async function calculateCustomerLTV(data) {
    const acquisitionCost = data.acquisitionCost || 0;
    const averageOrderValue = data.averageOrderValue || 0;
    const purchaseFrequency = data.purchaseFrequency || 0;
    const customerLifespan = data.customerLifespan || 0;
    const retentionRate = data.retentionRate || 0;
    const churnRate = 1 - retentionRate;
    const grossMargin = data.grossMargin || 0;
    const discountRate = data.discountRate || 0.1;
    // Simplified CLV calculation
    const annualValue = averageOrderValue * purchaseFrequency * grossMargin;
    const clv = annualValue * customerLifespan / (1 + discountRate);
    const clvCacRatio = acquisitionCost > 0 ? clv / acquisitionCost : 0;
    let profitability;
    if (clvCacRatio > 3)
        profitability = 'high';
    else if (clvCacRatio > 1.5)
        profitability = 'medium';
    else if (clvCacRatio > 1)
        profitability = 'low';
    else
        profitability = 'negative';
    const recommendations = [];
    if (clvCacRatio < 3) {
        recommendations.push('Reduce customer acquisition cost or increase retention');
    }
    if (churnRate > 0.2) {
        recommendations.push('High churn rate - implement retention program');
    }
    return {
        customerId: data.customerId || '',
        segment: data.segment || CustomerSegment.ENTERPRISE,
        acquisitionCost,
        averageOrderValue,
        purchaseFrequency,
        customerLifespan,
        retentionRate,
        churnRate,
        grossMargin,
        discountRate,
        clv,
        clvCacRatio,
        profitability,
        recommendations,
    };
}
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
async function identifyCrossSellOpportunities(data) {
    const opportunityId = data.opportunityId || `CROSS-${Date.now()}`;
    // Simplified propensity scoring based on product compatibility
    const baseScore = 0.4;
    const typeMultiplier = data.type === CrossSellType.COMPLEMENTARY_PRODUCT ? 1.5 : 1.0;
    const propensityScore = Math.min(baseScore * typeMultiplier, 1.0);
    const expectedRevenue = data.expectedRevenue || 0;
    const confidence = propensityScore * 0.9;
    const reasoning = [];
    if (data.type === CrossSellType.COMPLEMENTARY_PRODUCT) {
        reasoning.push('Strong product complementarity detected');
    }
    if ((data.currentProducts?.length || 0) >= 2) {
        reasoning.push('Customer has purchased multiple products - shows engagement');
    }
    return {
        opportunityId,
        customerId: data.customerId || '',
        currentProducts: data.currentProducts || [],
        recommendedProduct: data.recommendedProduct || '',
        type: data.type || CrossSellType.COMPLEMENTARY_PRODUCT,
        propensityScore,
        expectedRevenue,
        confidence,
        reasoning,
        nextBestAction: 'Schedule product demo',
        timing: 'Next 30 days',
        channel: 'Email + Sales call',
    };
}
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
async function analyzeSalesFunnel(data) {
    const funnelId = data.funnelId || `FUNNEL-${Date.now()}`;
    const stageMetrics = {
        [FunnelStage.AWARENESS]: { volume: 10000, conversionRate: 0.30, averageTime: 7, dropoffRate: 0.70 },
        [FunnelStage.INTEREST]: { volume: 3000, conversionRate: 0.40, averageTime: 14, dropoffRate: 0.60 },
        [FunnelStage.CONSIDERATION]: { volume: 1200, conversionRate: 0.50, averageTime: 21, dropoffRate: 0.50 },
        [FunnelStage.INTENT]: { volume: 600, conversionRate: 0.60, averageTime: 14, dropoffRate: 0.40 },
        [FunnelStage.EVALUATION]: { volume: 360, conversionRate: 0.70, averageTime: 21, dropoffRate: 0.30 },
        [FunnelStage.PURCHASE]: { volume: 252, conversionRate: 1.00, averageTime: 7, dropoffRate: 0.00 },
        [FunnelStage.RETENTION]: { volume: 252, conversionRate: 0.85, averageTime: 365, dropoffRate: 0.15 },
        [FunnelStage.ADVOCACY]: { volume: 214, conversionRate: 1.00, averageTime: 365, dropoffRate: 0.00 },
    };
    const overallConversion = 0.0252; // 2.52% from awareness to purchase
    const salesVelocity = 84; // Average days from awareness to purchase
    const bottlenecks = [];
    if (stageMetrics[FunnelStage.CONSIDERATION].dropoffRate > 0.5) {
        bottlenecks.push('High dropoff at consideration stage');
    }
    if (stageMetrics[FunnelStage.EVALUATION].averageTime > 21) {
        bottlenecks.push('Long evaluation period - streamline decision process');
    }
    const optimizationOpportunities = [
        'Improve lead nurturing in interest stage',
        'Provide better product comparisons for evaluation',
        'Implement fast-track purchasing for qualified leads',
    ];
    return {
        funnelId,
        productId: data.productId || '',
        segment: data.segment || CustomerSegment.ENTERPRISE,
        period: data.period || '',
        stageMetrics,
        overallConversion,
        averageDealSize: data.averageDealSize || 0,
        salesVelocity,
        bottlenecks,
        optimizationOpportunities,
    };
}
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
async function generateRevenueForecast(data) {
    const forecastId = data.forecastId || `FORECAST-${Date.now()}`;
    const baselineRevenue = data.baselineRevenue || 0;
    const growthRate = data.growthRate || 0;
    const forecastedRevenue = baselineRevenue * (1 + growthRate);
    const confidence = data.confidence || 0.80;
    const upside = forecastedRevenue * 1.2;
    const downside = forecastedRevenue * 0.8;
    const revenueStreams = {
        [RevenueStreamType.SUBSCRIPTION]: forecastedRevenue * 0.6,
        [RevenueStreamType.TRANSACTION]: forecastedRevenue * 0.2,
        [RevenueStreamType.LICENSE]: forecastedRevenue * 0.1,
        [RevenueStreamType.SERVICE]: forecastedRevenue * 0.1,
        [RevenueStreamType.ADVERTISING]: 0,
        [RevenueStreamType.COMMISSION]: 0,
        [RevenueStreamType.ROYALTY]: 0,
        [RevenueStreamType.RENTAL]: 0,
    };
    const seasonalFactors = {
        Q1: 0.9,
        Q2: 1.0,
        Q3: 0.95,
        Q4: 1.15,
    };
    const assumptions = [
        'Market conditions remain stable',
        'Customer retention rate of 85%',
        'No major competitive disruptions',
        'Sales capacity scales with demand',
    ];
    return {
        forecastId,
        organizationId: data.organizationId || '',
        period: data.period || '',
        baselineRevenue,
        forecastedRevenue,
        growthRate,
        confidence,
        revenueStreams,
        seasonalFactors,
        marketFactors: data.marketFactors || {},
        assumptions,
        riskAdjustment: -0.05,
        upside,
        downside,
    };
}
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
async function assessProductMarketFit(data) {
    const adoptionRate = data.adoptionRate || 0;
    const retentionRate = data.retentionRate || 0;
    const nps = data.nps || 0;
    const productUsage = data.productUsage || 0;
    const customerSatisfaction = data.customerSatisfaction || 0;
    // Calculate fit score (0-100)
    const fitScore = (adoptionRate * 20 +
        retentionRate * 30 +
        (nps + 100) / 200 * 25 +
        productUsage * 15 +
        customerSatisfaction * 10);
    const paybackPeriod = data.paybackPeriod || 18;
    const viralCoefficient = data.viralCoefficient || 0.5;
    const gaps = [];
    const strengths = [];
    const recommendations = [];
    if (retentionRate > 0.9) {
        strengths.push('Strong customer retention');
    }
    else if (retentionRate < 0.7) {
        gaps.push('Low retention rate');
        recommendations.push('Investigate churn reasons and improve onboarding');
    }
    if (nps > 50) {
        strengths.push('Strong customer advocacy (NPS > 50)');
    }
    else if (nps < 30) {
        gaps.push('Low Net Promoter Score');
        recommendations.push('Conduct customer feedback sessions to identify pain points');
    }
    if (adoptionRate < 0.3) {
        gaps.push('Low market adoption');
        recommendations.push('Refine product positioning and value proposition');
    }
    return {
        productId: data.productId || '',
        marketSegment: data.marketSegment || '',
        fitScore,
        adoptionRate,
        retentionRate,
        nps,
        productUsage,
        customerSatisfaction,
        paybackPeriod,
        viralCoefficient,
        gaps,
        strengths,
        recommendations,
    };
}
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
async function analyzeRevenueStream(data) {
    const streamId = data.streamId || `STREAM-${Date.now()}`;
    const currentRevenue = data.currentRevenue || 0;
    const growthRate = data.growthRate || 0;
    const profitability = data.profitability || 0;
    const customerCount = data.customerCount || 0;
    const totalRevenue = currentRevenue * 1.5; // Assuming total org revenue
    const revenueShare = currentRevenue / totalRevenue;
    const churnRate = data.churnRate || 0.15;
    const volatility = Math.abs(growthRate) * 0.5;
    let strategicValue;
    if (revenueShare > 0.4 && profitability > 0.3)
        strategicValue = 'core';
    else if (growthRate > 0.3)
        strategicValue = 'growth';
    else if (revenueShare < 0.1 && growthRate > 0)
        strategicValue = 'emerging';
    else
        strategicValue = 'sunset';
    let investmentPriority;
    if (strategicValue === 'growth' || (strategicValue === 'core' && profitability > 0.4)) {
        investmentPriority = 'high';
    }
    else if (strategicValue === 'emerging' || strategicValue === 'core') {
        investmentPriority = 'medium';
    }
    else {
        investmentPriority = 'low';
    }
    return {
        streamId,
        type: data.type || RevenueStreamType.SUBSCRIPTION,
        currentRevenue,
        revenueShare,
        growthRate,
        profitability,
        volatility,
        customerCount,
        churnRate,
        lifecycle: data.lifecycle || ProductLifecycle.GROWTH,
        strategicValue,
        investmentPriority,
    };
}
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
async function developPenetrationStrategy(data) {
    const strategyId = data.strategyId || `PEN-${Date.now()}`;
    const tactics = [
        'Aggressive pricing to gain market share',
        'Expand sales team in target region',
        'Partner with local distributors',
        'Launch targeted marketing campaign',
        'Offer introductory promotions',
    ];
    const successFactors = [
        'Strong product-market fit',
        'Competitive pricing advantage',
        'Effective go-to-market execution',
        'Customer success and retention',
    ];
    const riskMitigation = [
        'Monitor competitor response closely',
        'Maintain product quality during scaling',
        'Preserve profitability targets',
        'Build sustainable customer acquisition channels',
    ];
    return {
        strategyId,
        targetMarket: data.targetMarket || '',
        currentPenetration: data.currentPenetration || 0,
        targetPenetration: data.targetPenetration || 0,
        timeframe: data.timeframe || 12,
        tactics: data.tactics || tactics,
        investmentRequired: data.investmentRequired || 0,
        expectedRevenue: data.expectedRevenue || 0,
        competitiveResponse: 'Likely price matching and increased marketing spend',
        riskMitigation,
        successFactors,
    };
}
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
async function analyzePriceElasticity(productId, currentPrice, elasticity) {
    let elasticityType;
    if (Math.abs(elasticity) > 1)
        elasticityType = 'elastic';
    else if (Math.abs(elasticity) < 1)
        elasticityType = 'inelastic';
    else
        elasticityType = 'unit_elastic';
    const optimalPricePoint = currentPrice * (1 + (1 / (2 * elasticity)));
    const revenueMaximizingPrice = currentPrice * (1 + (1 / elasticity));
    const profitMaximizingPrice = currentPrice * 1.1; // Simplified
    const volumeSensitivity = Math.abs(elasticity * 100);
    const competitorImpact = 0.6;
    const seasonalVariation = {
        Q1: 0.95,
        Q2: 1.0,
        Q3: 1.0,
        Q4: 1.05,
    };
    const recommendations = [];
    if (elasticityType === 'elastic') {
        recommendations.push('Price sensitive market - consider competitive pricing');
    }
    else {
        recommendations.push('Price inelastic - opportunity for premium pricing');
    }
    return {
        productId,
        priceElasticity: elasticity,
        elasticityType,
        optimalPricePoint,
        revenueMaximizingPrice,
        profitMaximizingPrice,
        volumeSensitivity,
        competitorImpact,
        seasonalVariation,
        recommendations,
    };
}
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
async function scoreUpsellOpportunity(data) {
    const featureAdoption = data.featureAdoption || 0;
    const engagementScore = data.engagementScore || 0;
    const healthScore = data.healthScore || 0;
    // Calculate upsell score (0-100)
    const upsellScore = (featureAdoption * 40 +
        (engagementScore / 100) * 30 +
        (healthScore / 100) * 30);
    const successProbability = upsellScore / 100;
    let recommendedApproach;
    let timing;
    if (upsellScore > 75) {
        recommendedApproach = 'Direct sales outreach with ROI analysis';
        timing = 'Immediate';
    }
    else if (upsellScore > 50) {
        recommendedApproach = 'Nurture with feature education and case studies';
        timing = 'Next 60 days';
    }
    else {
        recommendedApproach = 'Continue engagement and feature adoption';
        timing = 'Next 90+ days';
    }
    const usagePatterns = data.usagePatterns || {};
    return {
        customerId: data.customerId || '',
        currentTier: data.currentTier || '',
        targetTier: data.targetTier || '',
        upsellScore,
        usagePatterns,
        featureAdoption,
        engagementScore,
        healthScore,
        revenueIncrement: data.revenueIncrement || 0,
        successProbability,
        recommendedApproach,
        timing,
    };
}
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
async function analyzeMarketShare(data) {
    const currentShare = data.currentShare || 0;
    const targetShare = data.targetShare || 0;
    let position;
    if (currentShare > 0.4)
        position = MarketPosition.LEADER;
    else if (currentShare > 0.2)
        position = MarketPosition.CHALLENGER;
    else if (currentShare > 0.05)
        position = MarketPosition.FOLLOWER;
    else
        position = MarketPosition.NICHER;
    const competitors = data.competitors || [
        { name: 'Competitor A', share: 0.35, strengths: ['Brand recognition', 'Enterprise sales'] },
        { name: 'Competitor B', share: 0.28, strengths: ['Product innovation', 'Customer service'] },
        { name: 'Competitor C', share: 0.15, strengths: ['Pricing', 'Channel partnerships'] },
    ];
    const shareGainStrategies = [
        'Differentiate through superior product features',
        'Expand into underserved market segments',
        'Build strategic partnerships',
        'Aggressive marketing and brand building',
        'Competitive pricing in key segments',
    ];
    const shareGap = targetShare - currentShare;
    const investmentRequired = shareGap * 10000000; // Simplified calculation
    const timeframe = 24; // months
    const feasibility = shareGap < 0.1 ? 0.8 : 0.6;
    return {
        organizationId: data.organizationId || '',
        market: data.market || '',
        currentShare,
        targetShare,
        position,
        competitors,
        shareGainStrategies,
        investmentRequired,
        timeframe,
        feasibility,
    };
}
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
async function analyzeCustomerAcquisition(segment, channel, cac) {
    const conversionRate = channel === 'Direct Sales' ? 0.25 : 0.05;
    const timeToConvert = channel === 'Direct Sales' ? 90 : 30;
    const firstOrderValue = segment === CustomerSegment.ENTERPRISE ? 50000 : 5000;
    const paybackPeriod = cac / (firstOrderValue * 0.4); // Assuming 40% margin
    const efficiency = firstOrderValue / cac;
    let scalability;
    if (channel === 'Digital Marketing' || channel === 'Self-Service')
        scalability = 'high';
    else if (channel === 'Partner Referral')
        scalability = 'medium';
    else
        scalability = 'low';
    const recommendations = [];
    if (paybackPeriod > 12) {
        recommendations.push('Reduce CAC or increase first order value');
    }
    if (conversionRate < 0.1) {
        recommendations.push('Improve lead qualification and nurturing');
    }
    if (scalability === 'low') {
        recommendations.push('Develop more scalable acquisition channels');
    }
    return {
        segment,
        channel,
        cac,
        conversionRate,
        timeToConvert,
        firstOrderValue,
        paybackPeriod,
        efficiency,
        scalability,
        recommendations,
    };
}
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
async function developRevenueOptimizationPlan(data) {
    const planId = data.planId || `OPTPLAN-${Date.now()}`;
    const currentRevenue = data.currentRevenue || 0;
    const targetRevenue = data.targetRevenue || 0;
    const revenueGap = targetRevenue - currentRevenue;
    const levers = [
        { lever: 'Optimize pricing strategy', impact: revenueGap * 0.15, effort: 'low', priority: 1 },
        { lever: 'Expand into new market segments', impact: revenueGap * 0.30, effort: 'high', priority: 2 },
        { lever: 'Increase cross-sell/upsell', impact: revenueGap * 0.20, effort: 'medium', priority: 3 },
        { lever: 'Improve sales conversion rates', impact: revenueGap * 0.15, effort: 'medium', priority: 4 },
        { lever: 'Launch new product features', impact: revenueGap * 0.20, effort: 'high', priority: 5 },
    ];
    const quickWins = [
        'Adjust pricing for low-tier products (+5% revenue)',
        'Launch targeted upsell campaign to high-value customers',
        'Optimize sales process to reduce cycle time',
    ];
    const strategicInitiatives = [
        'Enter European market within 12 months',
        'Develop enterprise product tier',
        'Build strategic partnership program',
    ];
    const investmentRequired = revenueGap * 0.20;
    const expectedROI = (targetRevenue - currentRevenue - investmentRequired) / investmentRequired;
    return {
        planId,
        organizationId: data.organizationId || '',
        currentRevenue,
        targetRevenue,
        timeframe: data.timeframe || 12,
        levers,
        quickWins,
        strategicInitiatives,
        investmentRequired,
        expectedROI,
    };
}
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
async function optimizeProductBundle(data) {
    const bundleId = data.bundleId || `BUNDLE-${Date.now()}`;
    const bundlePrice = data.bundlePrice || 0;
    const individualSum = data.individualSum || 0;
    const discountRate = (individualSum - bundlePrice) / individualSum;
    const takeRate = 0.30; // 30% of customers opt for bundle
    const baseRevenue = individualSum * 0.20; // 20% would have bought individual products
    const bundleRevenue = bundlePrice * takeRate;
    const revenueImpact = bundleRevenue - baseRevenue;
    const marginImpact = revenueImpact * 0.5; // Assuming 50% margin
    const cannibalizationRisk = 0.25;
    const recommendations = [];
    if (discountRate > 0.30) {
        recommendations.push('High discount rate may erode margins - consider reducing');
    }
    if (takeRate < 0.20) {
        recommendations.push('Low bundle adoption - improve value proposition or marketing');
    }
    if (cannibalizationRisk > 0.30) {
        recommendations.push('High cannibalization risk - ensure bundle targets different segment');
    }
    return {
        bundleId,
        products: data.products || [],
        bundlePrice,
        individualSum,
        discountRate,
        takeRate,
        revenueImpact,
        marginImpact,
        cannibalizationRisk,
        recommendations,
    };
}
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
async function predictCustomerChurn(data) {
    const churnProbability = data.churnProbability || 0;
    const revenueAtRisk = data.revenueAtRisk || 0;
    const retentionCost = data.retentionCost || 0;
    const lifetimeValue = data.lifetimeValue || 0;
    const expectedLoss = revenueAtRisk * churnProbability;
    const retentionValue = expectedLoss * 0.7; // 70% retention success rate
    const retentionROI = retentionCost > 0 ? retentionValue / retentionCost : 0;
    const riskFactors = [];
    const interventionRecommendations = [];
    if (churnProbability > 0.5) {
        riskFactors.push('High churn probability');
        interventionRecommendations.push('Immediate executive intervention required');
    }
    else if (churnProbability > 0.3) {
        riskFactors.push('Moderate churn risk');
        interventionRecommendations.push('Schedule account review with customer success team');
    }
    if (lifetimeValue > 100000) {
        interventionRecommendations.push('High-value customer - assign dedicated account manager');
    }
    if (retentionROI > 3) {
        interventionRecommendations.push('Strong ROI for retention efforts - invest in save campaign');
    }
    const timing = churnProbability > 0.5 ? 'Immediate (0-7 days)' : 'Near-term (7-30 days)';
    return {
        customerId: data.customerId || '',
        churnProbability,
        riskFactors,
        revenueAtRisk,
        retentionCost,
        lifetimeValue,
        retentionROI,
        interventionRecommendations,
        timing,
    };
}
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
async function analyzePriceSensitivity(data) {
    const priceSensitivity = data.priceSensitivity || 0.5;
    const valuePerception = data.valuePerception || 0.7;
    const willingnessToPayDistribution = {
        50: 0.10,
        75: 0.20,
        100: 0.30,
        125: 0.25,
        150: 0.15,
    };
    const competitiveAlternatives = [
        { competitor: 'Competitor A', price: 120, share: 0.35 },
        { competitor: 'Competitor B', price: 95, share: 0.28 },
        { competitor: 'Competitor C', price: 110, share: 0.20 },
    ];
    const avgCompetitorPrice = 108.3;
    const optimalPriceRange = {
        min: avgCompetitorPrice * 0.9,
        max: avgCompetitorPrice * 1.15,
        recommended: avgCompetitorPrice * (1 + (valuePerception - 0.5) * 0.3),
    };
    return {
        segment: data.segment || CustomerSegment.ENTERPRISE,
        productId: data.productId || '',
        priceSensitivity,
        willingnessToPayDistribution,
        valuePerception,
        competitiveAlternatives,
        optimalPriceRange,
    };
}
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
async function analyzeRevenueLeakage(organizationId) {
    return [
        {
            leakageId: `LEAK-${Date.now()}-1`,
            source: 'Unoptimized discounting',
            annualImpact: 500000,
            category: 'discounting',
            rootCauses: [
                'No discount approval process',
                'Sales reps have too much discretion',
                'No visibility into discount patterns',
            ],
            fixCost: 50000,
            recoverablePortion: 0.70,
            priority: 'critical',
            recommendations: [
                'Implement discount approval workflow',
                'Provide discount guidance and training',
                'Monitor discount trends by rep and product',
            ],
        },
        {
            leakageId: `LEAK-${Date.now()}-2`,
            source: 'Billing errors and missed charges',
            annualImpact: 300000,
            category: 'billing',
            rootCauses: [
                'Manual billing processes',
                'Complex pricing models',
                'Poor system integration',
            ],
            fixCost: 100000,
            recoverablePortion: 0.80,
            priority: 'high',
            recommendations: [
                'Automate billing processes',
                'Implement revenue recognition system',
                'Regular billing audits',
            ],
        },
        {
            leakageId: `LEAK-${Date.now()}-3`,
            source: 'Underutilized price increases',
            annualImpact: 400000,
            category: 'pricing',
            rootCauses: [
                'No regular price review process',
                'Fear of customer churn',
                'Competitive pressure',
            ],
            fixCost: 25000,
            recoverablePortion: 0.60,
            priority: 'high',
            recommendations: [
                'Implement annual price review',
                'Communicate value improvements',
                'Grandfather existing customers selectively',
            ],
        },
        {
            leakageId: `LEAK-${Date.now()}-4`,
            source: 'Revenue recognition delays',
            annualImpact: 200000,
            category: 'process',
            rootCauses: [
                'Slow contract approval',
                'Missing customer signatures',
                'Incomplete documentation',
            ],
            fixCost: 30000,
            recoverablePortion: 0.90,
            priority: 'medium',
            recommendations: [
                'Streamline contract approval',
                'Implement e-signature solution',
                'Automate revenue recognition',
            ],
        },
    ];
}
/**
 * Calculates revenue per customer segment.
 *
 * @param {CustomerSegment} segment - Customer segment
 * @param {number} customerCount - Number of customers
 * @param {number} averageRevenue - Average revenue per customer
 * @returns {number} Total segment revenue
 */
function calculateSegmentRevenue(segment, customerCount, averageRevenue) {
    return customerCount * averageRevenue;
}
/**
 * Calculates revenue growth rate.
 *
 * @param {number} currentRevenue - Current period revenue
 * @param {number} previousRevenue - Previous period revenue
 * @returns {number} Growth rate as decimal
 */
function calculateGrowthRate(currentRevenue, previousRevenue) {
    if (previousRevenue === 0)
        return 0;
    return (currentRevenue - previousRevenue) / previousRevenue;
}
/**
 * Calculates compound annual growth rate (CAGR).
 *
 * @param {number} beginningValue - Beginning value
 * @param {number} endingValue - Ending value
 * @param {number} years - Number of years
 * @returns {number} CAGR as decimal
 */
function calculateCAGR(beginningValue, endingValue, years) {
    if (beginningValue === 0 || years === 0)
        return 0;
    return Math.pow(endingValue / beginningValue, 1 / years) - 1;
}
/**
 * Calculates revenue run rate.
 *
 * @param {number} periodRevenue - Revenue for the period
 * @param {number} periodMonths - Number of months in period
 * @returns {number} Annualized run rate
 */
function calculateRunRate(periodRevenue, periodMonths) {
    if (periodMonths === 0)
        return 0;
    return (periodRevenue / periodMonths) * 12;
}
/**
 * Calculates average revenue per user (ARPU).
 *
 * @param {number} totalRevenue - Total revenue
 * @param {number} userCount - Number of users
 * @returns {number} ARPU
 */
function calculateARPU(totalRevenue, userCount) {
    if (userCount === 0)
        return 0;
    return totalRevenue / userCount;
}
/**
 * Calculates revenue concentration risk.
 *
 * @param {Record<string, number>} customerRevenues - Revenue by customer
 * @returns {number} Concentration index (0-1, higher = more concentrated)
 */
function calculateRevenueConcentration(customerRevenues) {
    const revenues = Object.values(customerRevenues);
    const totalRevenue = revenues.reduce((sum, rev) => sum + rev, 0);
    if (totalRevenue === 0)
        return 0;
    // Calculate Herfindahl-Hirschman Index
    const shares = revenues.map(rev => rev / totalRevenue);
    const hhi = shares.reduce((sum, share) => sum + Math.pow(share, 2), 0);
    return hhi;
}
/**
 * Calculates revenue per employee.
 *
 * @param {number} totalRevenue - Total revenue
 * @param {number} employeeCount - Number of employees
 * @returns {number} Revenue per employee
 */
function calculateRevenuePerEmployee(totalRevenue, employeeCount) {
    if (employeeCount === 0)
        return 0;
    return totalRevenue / employeeCount;
}
/**
 * Calculates customer acquisition payback period.
 *
 * @param {number} cac - Customer acquisition cost
 * @param {number} monthlyRecurringRevenue - Monthly recurring revenue
 * @param {number} grossMargin - Gross margin as decimal
 * @returns {number} Payback period in months
 */
function calculateCACPayback(cac, monthlyRecurringRevenue, grossMargin) {
    const monthlyProfit = monthlyRecurringRevenue * grossMargin;
    if (monthlyProfit === 0)
        return 0;
    return cac / monthlyProfit;
}
/**
 * Calculates net revenue retention (NRR).
 *
 * @param {number} startingARR - Starting annual recurring revenue
 * @param {number} expansion - Expansion revenue
 * @param {number} churn - Churned revenue
 * @returns {number} NRR as decimal
 */
function calculateNetRevenueRetention(startingARR, expansion, churn) {
    if (startingARR === 0)
        return 0;
    return (startingARR + expansion - churn) / startingARR;
}
/**
 * Calculates quick ratio for SaaS companies.
 *
 * @param {number} newMRR - New monthly recurring revenue
 * @param {number} expansionMRR - Expansion MRR
 * @param {number} churnedMRR - Churned MRR
 * @param {number} contractionMRR - Contraction MRR
 * @returns {number} Quick ratio
 */
function calculateQuickRatio(newMRR, expansionMRR, churnedMRR, contractionMRR) {
    const losses = churnedMRR + contractionMRR;
    if (losses === 0)
        return 0;
    return (newMRR + expansionMRR) / losses;
}
/**
 * Calculates revenue quality score.
 *
 * @param {number} recurringRevenue - Recurring revenue
 * @param {number} totalRevenue - Total revenue
 * @param {number} retentionRate - Customer retention rate
 * @param {number} grossMargin - Gross margin
 * @returns {number} Quality score (0-100)
 */
function calculateRevenueQuality(recurringRevenue, totalRevenue, retentionRate, grossMargin) {
    const recurringPortion = totalRevenue > 0 ? recurringRevenue / totalRevenue : 0;
    return (recurringPortion * 40 +
        retentionRate * 30 +
        grossMargin * 30) * 100;
}
/**
 * Estimates market opportunity size (TAM/SAM/SOM).
 *
 * @param {number} totalMarket - Total addressable market
 * @param {number} serviceable - Serviceable addressable market percentage
 * @param {number} obtainable - Serviceable obtainable market percentage
 * @returns {Record<string, number>} TAM, SAM, SOM
 */
function estimateMarketOpportunity(totalMarket, serviceable, obtainable) {
    const sam = totalMarket * serviceable;
    const som = sam * obtainable;
    return {
        tam: totalMarket,
        sam,
        som,
    };
}
//# sourceMappingURL=revenue-growth-kit.js.map