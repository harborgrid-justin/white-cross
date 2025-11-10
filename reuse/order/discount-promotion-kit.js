"use strict";
/**
 * LOC: ORD-DSC-001
 * File: /reuse/order/discount-promotion-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize-typescript
 *   - class-validator
 *   - class-transformer
 *
 * DOWNSTREAM (imported by):
 *   - Order controllers
 *   - Promotion services
 *   - Discount processors
 *   - Marketing campaign modules
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
exports.CouponUsage = exports.CouponCode = exports.Promotion = exports.Discount = exports.AppliedDiscountDetail = exports.DiscountCalculationResult = exports.ExclusionRuleDto = exports.FlashSaleDto = exports.CustomerSegmentPromotionDto = exports.ApplyDiscountDto = exports.TieredPromotionDto = exports.VolumeDiscountTierDto = exports.BogoConfigDto = exports.CartItemDto = exports.ValidateCouponDto = exports.GenerateCouponCodesDto = exports.CreatePromotionDto = exports.CreateDiscountDto = exports.ApplicationScope = exports.StackingRuleType = exports.CustomerEligibility = exports.CouponCodePattern = exports.PromotionStatus = exports.PromotionType = exports.DiscountType = void 0;
exports.generateDiscountCode = generateDiscountCode;
exports.validateCouponCodeFormat = validateCouponCodeFormat;
exports.isCouponValid = isCouponValid;
exports.calculatePercentageDiscount = calculatePercentageDiscount;
exports.calculateFixedDiscount = calculateFixedDiscount;
exports.applyBogoDiscount = applyBogoDiscount;
exports.calculateVolumeDiscount = calculateVolumeDiscount;
exports.calculateTieredDiscount = calculateTieredDiscount;
exports.meetsMinimumPurchase = meetsMinimumPurchase;
exports.meetsMinimumQuantity = meetsMinimumQuantity;
exports.filterEligibleProducts = filterEligibleProducts;
exports.filterEligibleCategories = filterEligibleCategories;
exports.applyBestDiscount = applyBestDiscount;
exports.applyAdditiveDiscounts = applyAdditiveDiscounts;
exports.applySequentialDiscounts = applySequentialDiscounts;
exports.isPromotionActive = isPromotionActive;
exports.isCustomerEligible = isCustomerEligible;
exports.calculateCartDiscount = calculateCartDiscount;
exports.validateExclusionRules = validateExclusionRules;
exports.generateBulkCoupons = generateBulkCoupons;
exports.validateAndApplyCoupon = validateAndApplyCoupon;
exports.recordCouponUsage = recordCouponUsage;
exports.createFlashSale = createFlashSale;
exports.getActivePromotionsForCustomer = getActivePromotionsForCustomer;
exports.calculateLoyaltyPointsDiscount = calculateLoyaltyPointsDiscount;
exports.applyReferralBonus = applyReferralBonus;
exports.calculateBundleDiscount = calculateBundleDiscount;
exports.checkPromotionUsageLimits = checkPromotionUsageLimits;
exports.calculateSeasonalDiscount = calculateSeasonalDiscount;
exports.applyFirstTimeCustomerDiscount = applyFirstTimeCustomerDiscount;
exports.calculateCategoryPromotion = calculateCategoryPromotion;
exports.applyEarlyBirdDiscount = applyEarlyBirdDiscount;
exports.calculateAbandonmentDiscount = calculateAbandonmentDiscount;
exports.validateTimeLimitedPromotion = validateTimeLimitedPromotion;
exports.calculateMultiBuyDiscount = calculateMultiBuyDiscount;
exports.applySpendThresholdBonus = applySpendThresholdBonus;
exports.calculateCrossSellDiscount = calculateCrossSellDiscount;
exports.deactivateExpiredPromotions = deactivateExpiredPromotions;
exports.activateScheduledPromotions = activateScheduledPromotions;
exports.generatePromotionPerformanceReport = generatePromotionPerformanceReport;
/**
 * File: /reuse/order/discount-promotion-kit.ts
 * Locator: WC-ORD-DSCPRO-001
 * Purpose: Discount & Promotion Management - Coupons, promos, discounts
 *
 * Upstream: Independent utility module for discount and promotion operations
 * Downstream: ../backend/order/*, Promotion modules, Marketing services, Campaign services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 40 utility functions for discounts, coupons, promotions, campaigns, stacking rules
 *
 * LLM Context: Enterprise-grade discount and promotion management to compete with Oracle, SAP, and Shopify Plus.
 * Provides comprehensive discount code generation/validation, coupon management, promotion campaigns, discount stacking,
 * BOGO deals, volume discounts, tiered promotions, time-limited offers, customer segment targeting, product category
 * promotions, minimum purchase requirements, exclusion rules, loyalty rewards, referral bonuses, and flash sales.
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
 * Discount types
 */
var DiscountType;
(function (DiscountType) {
    DiscountType["PERCENTAGE"] = "PERCENTAGE";
    DiscountType["FIXED_AMOUNT"] = "FIXED_AMOUNT";
    DiscountType["BUY_X_GET_Y"] = "BUY_X_GET_Y";
    DiscountType["VOLUME_DISCOUNT"] = "VOLUME_DISCOUNT";
    DiscountType["TIERED"] = "TIERED";
    DiscountType["FREE_SHIPPING"] = "FREE_SHIPPING";
    DiscountType["BUNDLE"] = "BUNDLE";
    DiscountType["LOYALTY_POINTS"] = "LOYALTY_POINTS";
})(DiscountType || (exports.DiscountType = DiscountType = {}));
/**
 * Promotion types
 */
var PromotionType;
(function (PromotionType) {
    PromotionType["COUPON_CODE"] = "COUPON_CODE";
    PromotionType["AUTOMATIC"] = "AUTOMATIC";
    PromotionType["CART_RULE"] = "CART_RULE";
    PromotionType["CATALOG_RULE"] = "CATALOG_RULE";
    PromotionType["FLASH_SALE"] = "FLASH_SALE";
    PromotionType["SEASONAL"] = "SEASONAL";
    PromotionType["CLEARANCE"] = "CLEARANCE";
    PromotionType["REFERRAL"] = "REFERRAL";
})(PromotionType || (exports.PromotionType = PromotionType = {}));
/**
 * Promotion status
 */
var PromotionStatus;
(function (PromotionStatus) {
    PromotionStatus["DRAFT"] = "DRAFT";
    PromotionStatus["SCHEDULED"] = "SCHEDULED";
    PromotionStatus["ACTIVE"] = "ACTIVE";
    PromotionStatus["PAUSED"] = "PAUSED";
    PromotionStatus["EXPIRED"] = "EXPIRED";
    PromotionStatus["CANCELLED"] = "CANCELLED";
})(PromotionStatus || (exports.PromotionStatus = PromotionStatus = {}));
/**
 * Coupon code patterns
 */
var CouponCodePattern;
(function (CouponCodePattern) {
    CouponCodePattern["ALPHANUMERIC"] = "ALPHANUMERIC";
    CouponCodePattern["NUMERIC"] = "NUMERIC";
    CouponCodePattern["ALPHABETIC"] = "ALPHABETIC";
    CouponCodePattern["CUSTOM"] = "CUSTOM";
})(CouponCodePattern || (exports.CouponCodePattern = CouponCodePattern = {}));
/**
 * Customer eligibility criteria
 */
var CustomerEligibility;
(function (CustomerEligibility) {
    CustomerEligibility["ALL_CUSTOMERS"] = "ALL_CUSTOMERS";
    CustomerEligibility["NEW_CUSTOMERS"] = "NEW_CUSTOMERS";
    CustomerEligibility["EXISTING_CUSTOMERS"] = "EXISTING_CUSTOMERS";
    CustomerEligibility["VIP_TIER"] = "VIP_TIER";
    CustomerEligibility["LOYALTY_MEMBERS"] = "LOYALTY_MEMBERS";
    CustomerEligibility["EMAIL_SUBSCRIBERS"] = "EMAIL_SUBSCRIBERS";
    CustomerEligibility["SPECIFIC_SEGMENTS"] = "SPECIFIC_SEGMENTS";
})(CustomerEligibility || (exports.CustomerEligibility = CustomerEligibility = {}));
/**
 * Stacking rule types
 */
var StackingRuleType;
(function (StackingRuleType) {
    StackingRuleType["NO_STACKING"] = "NO_STACKING";
    StackingRuleType["BEST_DISCOUNT"] = "BEST_DISCOUNT";
    StackingRuleType["ADDITIVE"] = "ADDITIVE";
    StackingRuleType["SEQUENTIAL"] = "SEQUENTIAL";
    StackingRuleType["EXCLUSIVE_GROUPS"] = "EXCLUSIVE_GROUPS";
})(StackingRuleType || (exports.StackingRuleType = StackingRuleType = {}));
/**
 * Application scope
 */
var ApplicationScope;
(function (ApplicationScope) {
    ApplicationScope["ORDER_LEVEL"] = "ORDER_LEVEL";
    ApplicationScope["LINE_ITEM"] = "LINE_ITEM";
    ApplicationScope["SHIPPING"] = "SHIPPING";
    ApplicationScope["CATEGORY"] = "CATEGORY";
    ApplicationScope["PRODUCT"] = "PRODUCT";
})(ApplicationScope || (exports.ApplicationScope = ApplicationScope = {}));
// ============================================================================
// DTOS
// ============================================================================
/**
 * Create discount DTO
 */
let CreateDiscountDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _discountType_decorators;
    let _discountType_initializers = [];
    let _discountType_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _maxDiscountAmount_decorators;
    let _maxDiscountAmount_initializers = [];
    let _maxDiscountAmount_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _minPurchaseAmount_decorators;
    let _minPurchaseAmount_initializers = [];
    let _minPurchaseAmount_extraInitializers = [];
    let _minQuantity_decorators;
    let _minQuantity_initializers = [];
    let _minQuantity_extraInitializers = [];
    let _applicableProductIds_decorators;
    let _applicableProductIds_initializers = [];
    let _applicableProductIds_extraInitializers = [];
    let _applicableCategoryIds_decorators;
    let _applicableCategoryIds_initializers = [];
    let _applicableCategoryIds_extraInitializers = [];
    let _excludedProductIds_decorators;
    let _excludedProductIds_initializers = [];
    let _excludedProductIds_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    return _a = class CreateDiscountDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.discountType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _discountType_initializers, void 0));
                this.value = (__runInitializers(this, _discountType_extraInitializers), __runInitializers(this, _value_initializers, void 0));
                this.maxDiscountAmount = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _maxDiscountAmount_initializers, void 0));
                this.scope = (__runInitializers(this, _maxDiscountAmount_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
                this.startDate = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.minPurchaseAmount = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _minPurchaseAmount_initializers, void 0));
                this.minQuantity = (__runInitializers(this, _minPurchaseAmount_extraInitializers), __runInitializers(this, _minQuantity_initializers, void 0));
                this.applicableProductIds = (__runInitializers(this, _minQuantity_extraInitializers), __runInitializers(this, _applicableProductIds_initializers, void 0));
                this.applicableCategoryIds = (__runInitializers(this, _applicableProductIds_extraInitializers), __runInitializers(this, _applicableCategoryIds_initializers, void 0));
                this.excludedProductIds = (__runInitializers(this, _applicableCategoryIds_extraInitializers), __runInitializers(this, _excludedProductIds_initializers, void 0));
                this.priority = (__runInitializers(this, _excludedProductIds_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                __runInitializers(this, _priority_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount name' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(200)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount description' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _discountType_decorators = [(0, swagger_1.ApiProperty)({ enum: DiscountType, description: 'Discount type' }), (0, class_validator_1.IsEnum)(DiscountType)];
            _value_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount value (percentage or fixed amount)', example: 15 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _maxDiscountAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maximum discount amount (for percentage discounts)', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _scope_decorators = [(0, swagger_1.ApiProperty)({ enum: ApplicationScope, description: 'Application scope' }), (0, class_validator_1.IsEnum)(ApplicationScope)];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date', type: String }), (0, class_validator_1.IsDateString)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date', type: String }), (0, class_validator_1.IsDateString)()];
            _minPurchaseAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minimum purchase amount', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _minQuantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minimum quantity', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _applicableProductIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Applicable product IDs', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)('4', { each: true })];
            _applicableCategoryIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Applicable category IDs', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)('4', { each: true })];
            _excludedProductIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Excluded product IDs', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)('4', { each: true })];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority for stacking (higher = applied first)', example: 10 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100)];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _discountType_decorators, { kind: "field", name: "discountType", static: false, private: false, access: { has: obj => "discountType" in obj, get: obj => obj.discountType, set: (obj, value) => { obj.discountType = value; } }, metadata: _metadata }, _discountType_initializers, _discountType_extraInitializers);
            __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(null, null, _maxDiscountAmount_decorators, { kind: "field", name: "maxDiscountAmount", static: false, private: false, access: { has: obj => "maxDiscountAmount" in obj, get: obj => obj.maxDiscountAmount, set: (obj, value) => { obj.maxDiscountAmount = value; } }, metadata: _metadata }, _maxDiscountAmount_initializers, _maxDiscountAmount_extraInitializers);
            __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _minPurchaseAmount_decorators, { kind: "field", name: "minPurchaseAmount", static: false, private: false, access: { has: obj => "minPurchaseAmount" in obj, get: obj => obj.minPurchaseAmount, set: (obj, value) => { obj.minPurchaseAmount = value; } }, metadata: _metadata }, _minPurchaseAmount_initializers, _minPurchaseAmount_extraInitializers);
            __esDecorate(null, null, _minQuantity_decorators, { kind: "field", name: "minQuantity", static: false, private: false, access: { has: obj => "minQuantity" in obj, get: obj => obj.minQuantity, set: (obj, value) => { obj.minQuantity = value; } }, metadata: _metadata }, _minQuantity_initializers, _minQuantity_extraInitializers);
            __esDecorate(null, null, _applicableProductIds_decorators, { kind: "field", name: "applicableProductIds", static: false, private: false, access: { has: obj => "applicableProductIds" in obj, get: obj => obj.applicableProductIds, set: (obj, value) => { obj.applicableProductIds = value; } }, metadata: _metadata }, _applicableProductIds_initializers, _applicableProductIds_extraInitializers);
            __esDecorate(null, null, _applicableCategoryIds_decorators, { kind: "field", name: "applicableCategoryIds", static: false, private: false, access: { has: obj => "applicableCategoryIds" in obj, get: obj => obj.applicableCategoryIds, set: (obj, value) => { obj.applicableCategoryIds = value; } }, metadata: _metadata }, _applicableCategoryIds_initializers, _applicableCategoryIds_extraInitializers);
            __esDecorate(null, null, _excludedProductIds_decorators, { kind: "field", name: "excludedProductIds", static: false, private: false, access: { has: obj => "excludedProductIds" in obj, get: obj => obj.excludedProductIds, set: (obj, value) => { obj.excludedProductIds = value; } }, metadata: _metadata }, _excludedProductIds_initializers, _excludedProductIds_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateDiscountDto = CreateDiscountDto;
/**
 * Create promotion DTO
 */
let CreatePromotionDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _internalCode_decorators;
    let _internalCode_initializers = [];
    let _internalCode_extraInitializers = [];
    let _promotionType_decorators;
    let _promotionType_initializers = [];
    let _promotionType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _customerEligibility_decorators;
    let _customerEligibility_initializers = [];
    let _customerEligibility_extraInitializers = [];
    let _customerSegmentIds_decorators;
    let _customerSegmentIds_initializers = [];
    let _customerSegmentIds_extraInitializers = [];
    let _usageLimitPerCustomer_decorators;
    let _usageLimitPerCustomer_initializers = [];
    let _usageLimitPerCustomer_extraInitializers = [];
    let _totalUsageLimit_decorators;
    let _totalUsageLimit_initializers = [];
    let _totalUsageLimit_extraInitializers = [];
    let _discountIds_decorators;
    let _discountIds_initializers = [];
    let _discountIds_extraInitializers = [];
    let _stackingRule_decorators;
    let _stackingRule_initializers = [];
    let _stackingRule_extraInitializers = [];
    let _requiresCouponCode_decorators;
    let _requiresCouponCode_initializers = [];
    let _requiresCouponCode_extraInitializers = [];
    return _a = class CreatePromotionDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.internalCode = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _internalCode_initializers, void 0));
                this.promotionType = (__runInitializers(this, _internalCode_extraInitializers), __runInitializers(this, _promotionType_initializers, void 0));
                this.description = (__runInitializers(this, _promotionType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.startDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.customerEligibility = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _customerEligibility_initializers, void 0));
                this.customerSegmentIds = (__runInitializers(this, _customerEligibility_extraInitializers), __runInitializers(this, _customerSegmentIds_initializers, void 0));
                this.usageLimitPerCustomer = (__runInitializers(this, _customerSegmentIds_extraInitializers), __runInitializers(this, _usageLimitPerCustomer_initializers, void 0));
                this.totalUsageLimit = (__runInitializers(this, _usageLimitPerCustomer_extraInitializers), __runInitializers(this, _totalUsageLimit_initializers, void 0));
                this.discountIds = (__runInitializers(this, _totalUsageLimit_extraInitializers), __runInitializers(this, _discountIds_initializers, void 0));
                this.stackingRule = (__runInitializers(this, _discountIds_extraInitializers), __runInitializers(this, _stackingRule_initializers, void 0));
                this.requiresCouponCode = (__runInitializers(this, _stackingRule_extraInitializers), __runInitializers(this, _requiresCouponCode_initializers, void 0));
                __runInitializers(this, _requiresCouponCode_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Promotion name' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(200)];
            _internalCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Internal code for tracking' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(50), (0, class_validator_1.Matches)(/^[A-Z0-9_-]+$/)];
            _promotionType_decorators = [(0, swagger_1.ApiProperty)({ enum: PromotionType, description: 'Promotion type' }), (0, class_validator_1.IsEnum)(PromotionType)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Promotion description' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(2000)];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date', type: String }), (0, class_validator_1.IsDateString)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date', type: String }), (0, class_validator_1.IsDateString)()];
            _customerEligibility_decorators = [(0, swagger_1.ApiProperty)({ enum: CustomerEligibility, description: 'Customer eligibility' }), (0, class_validator_1.IsEnum)(CustomerEligibility)];
            _customerSegmentIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer segment IDs', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)('4', { each: true })];
            _usageLimitPerCustomer_decorators = [(0, swagger_1.ApiProperty)({ description: 'Usage limit per customer', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _totalUsageLimit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total usage limit', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _discountIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount IDs included in promotion', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)('4', { each: true })];
            _stackingRule_decorators = [(0, swagger_1.ApiProperty)({ enum: StackingRuleType, description: 'Stacking rule' }), (0, class_validator_1.IsEnum)(StackingRuleType)];
            _requiresCouponCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requires coupon code' }), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _internalCode_decorators, { kind: "field", name: "internalCode", static: false, private: false, access: { has: obj => "internalCode" in obj, get: obj => obj.internalCode, set: (obj, value) => { obj.internalCode = value; } }, metadata: _metadata }, _internalCode_initializers, _internalCode_extraInitializers);
            __esDecorate(null, null, _promotionType_decorators, { kind: "field", name: "promotionType", static: false, private: false, access: { has: obj => "promotionType" in obj, get: obj => obj.promotionType, set: (obj, value) => { obj.promotionType = value; } }, metadata: _metadata }, _promotionType_initializers, _promotionType_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _customerEligibility_decorators, { kind: "field", name: "customerEligibility", static: false, private: false, access: { has: obj => "customerEligibility" in obj, get: obj => obj.customerEligibility, set: (obj, value) => { obj.customerEligibility = value; } }, metadata: _metadata }, _customerEligibility_initializers, _customerEligibility_extraInitializers);
            __esDecorate(null, null, _customerSegmentIds_decorators, { kind: "field", name: "customerSegmentIds", static: false, private: false, access: { has: obj => "customerSegmentIds" in obj, get: obj => obj.customerSegmentIds, set: (obj, value) => { obj.customerSegmentIds = value; } }, metadata: _metadata }, _customerSegmentIds_initializers, _customerSegmentIds_extraInitializers);
            __esDecorate(null, null, _usageLimitPerCustomer_decorators, { kind: "field", name: "usageLimitPerCustomer", static: false, private: false, access: { has: obj => "usageLimitPerCustomer" in obj, get: obj => obj.usageLimitPerCustomer, set: (obj, value) => { obj.usageLimitPerCustomer = value; } }, metadata: _metadata }, _usageLimitPerCustomer_initializers, _usageLimitPerCustomer_extraInitializers);
            __esDecorate(null, null, _totalUsageLimit_decorators, { kind: "field", name: "totalUsageLimit", static: false, private: false, access: { has: obj => "totalUsageLimit" in obj, get: obj => obj.totalUsageLimit, set: (obj, value) => { obj.totalUsageLimit = value; } }, metadata: _metadata }, _totalUsageLimit_initializers, _totalUsageLimit_extraInitializers);
            __esDecorate(null, null, _discountIds_decorators, { kind: "field", name: "discountIds", static: false, private: false, access: { has: obj => "discountIds" in obj, get: obj => obj.discountIds, set: (obj, value) => { obj.discountIds = value; } }, metadata: _metadata }, _discountIds_initializers, _discountIds_extraInitializers);
            __esDecorate(null, null, _stackingRule_decorators, { kind: "field", name: "stackingRule", static: false, private: false, access: { has: obj => "stackingRule" in obj, get: obj => obj.stackingRule, set: (obj, value) => { obj.stackingRule = value; } }, metadata: _metadata }, _stackingRule_initializers, _stackingRule_extraInitializers);
            __esDecorate(null, null, _requiresCouponCode_decorators, { kind: "field", name: "requiresCouponCode", static: false, private: false, access: { has: obj => "requiresCouponCode" in obj, get: obj => obj.requiresCouponCode, set: (obj, value) => { obj.requiresCouponCode = value; } }, metadata: _metadata }, _requiresCouponCode_initializers, _requiresCouponCode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePromotionDto = CreatePromotionDto;
/**
 * Generate coupon codes DTO
 */
let GenerateCouponCodesDto = (() => {
    var _a;
    let _promotionId_decorators;
    let _promotionId_initializers = [];
    let _promotionId_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _pattern_decorators;
    let _pattern_initializers = [];
    let _pattern_extraInitializers = [];
    let _prefix_decorators;
    let _prefix_initializers = [];
    let _prefix_extraInitializers = [];
    let _codeLength_decorators;
    let _codeLength_initializers = [];
    let _codeLength_extraInitializers = [];
    let _usageLimitPerCode_decorators;
    let _usageLimitPerCode_initializers = [];
    let _usageLimitPerCode_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    return _a = class GenerateCouponCodesDto {
            constructor() {
                this.promotionId = __runInitializers(this, _promotionId_initializers, void 0);
                this.quantity = (__runInitializers(this, _promotionId_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
                this.pattern = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _pattern_initializers, void 0));
                this.prefix = (__runInitializers(this, _pattern_extraInitializers), __runInitializers(this, _prefix_initializers, void 0));
                this.codeLength = (__runInitializers(this, _prefix_extraInitializers), __runInitializers(this, _codeLength_initializers, void 0));
                this.usageLimitPerCode = (__runInitializers(this, _codeLength_extraInitializers), __runInitializers(this, _usageLimitPerCode_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _usageLimitPerCode_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                __runInitializers(this, _expirationDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _promotionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Promotion ID' }), (0, class_validator_1.IsUUID)('4')];
            _quantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of codes to generate' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10000)];
            _pattern_decorators = [(0, swagger_1.ApiProperty)({ enum: CouponCodePattern, description: 'Code pattern' }), (0, class_validator_1.IsEnum)(CouponCodePattern)];
            _prefix_decorators = [(0, swagger_1.ApiProperty)({ description: 'Code prefix', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(10)];
            _codeLength_decorators = [(0, swagger_1.ApiProperty)({ description: 'Code length (excluding prefix)', example: 8 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(4), (0, class_validator_1.Max)(20)];
            _usageLimitPerCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Usage limit per code', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _expirationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expiration date', required: false, type: String }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _promotionId_decorators, { kind: "field", name: "promotionId", static: false, private: false, access: { has: obj => "promotionId" in obj, get: obj => obj.promotionId, set: (obj, value) => { obj.promotionId = value; } }, metadata: _metadata }, _promotionId_initializers, _promotionId_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _pattern_decorators, { kind: "field", name: "pattern", static: false, private: false, access: { has: obj => "pattern" in obj, get: obj => obj.pattern, set: (obj, value) => { obj.pattern = value; } }, metadata: _metadata }, _pattern_initializers, _pattern_extraInitializers);
            __esDecorate(null, null, _prefix_decorators, { kind: "field", name: "prefix", static: false, private: false, access: { has: obj => "prefix" in obj, get: obj => obj.prefix, set: (obj, value) => { obj.prefix = value; } }, metadata: _metadata }, _prefix_initializers, _prefix_extraInitializers);
            __esDecorate(null, null, _codeLength_decorators, { kind: "field", name: "codeLength", static: false, private: false, access: { has: obj => "codeLength" in obj, get: obj => obj.codeLength, set: (obj, value) => { obj.codeLength = value; } }, metadata: _metadata }, _codeLength_initializers, _codeLength_extraInitializers);
            __esDecorate(null, null, _usageLimitPerCode_decorators, { kind: "field", name: "usageLimitPerCode", static: false, private: false, access: { has: obj => "usageLimitPerCode" in obj, get: obj => obj.usageLimitPerCode, set: (obj, value) => { obj.usageLimitPerCode = value; } }, metadata: _metadata }, _usageLimitPerCode_initializers, _usageLimitPerCode_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.GenerateCouponCodesDto = GenerateCouponCodesDto;
/**
 * Validate coupon DTO
 */
let ValidateCouponDto = (() => {
    var _a;
    let _code_decorators;
    let _code_initializers = [];
    let _code_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _cartTotal_decorators;
    let _cartTotal_initializers = [];
    let _cartTotal_extraInitializers = [];
    let _cartItems_decorators;
    let _cartItems_initializers = [];
    let _cartItems_extraInitializers = [];
    return _a = class ValidateCouponDto {
            constructor() {
                this.code = __runInitializers(this, _code_initializers, void 0);
                this.customerId = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
                this.cartTotal = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _cartTotal_initializers, void 0));
                this.cartItems = (__runInitializers(this, _cartTotal_extraInitializers), __runInitializers(this, _cartItems_initializers, void 0));
                __runInitializers(this, _cartItems_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _code_decorators = [(0, swagger_1.ApiProperty)({ description: 'Coupon code' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(50)];
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, class_validator_1.IsUUID)('4')];
            _cartTotal_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cart total amount' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _cartItems_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cart items', type: 'array' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => CartItemDto)];
            __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: obj => "code" in obj, get: obj => obj.code, set: (obj, value) => { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _cartTotal_decorators, { kind: "field", name: "cartTotal", static: false, private: false, access: { has: obj => "cartTotal" in obj, get: obj => obj.cartTotal, set: (obj, value) => { obj.cartTotal = value; } }, metadata: _metadata }, _cartTotal_initializers, _cartTotal_extraInitializers);
            __esDecorate(null, null, _cartItems_decorators, { kind: "field", name: "cartItems", static: false, private: false, access: { has: obj => "cartItems" in obj, get: obj => obj.cartItems, set: (obj, value) => { obj.cartItems = value; } }, metadata: _metadata }, _cartItems_initializers, _cartItems_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ValidateCouponDto = ValidateCouponDto;
/**
 * Cart item DTO
 */
let CartItemDto = (() => {
    var _a;
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _categoryId_decorators;
    let _categoryId_initializers = [];
    let _categoryId_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _unitPrice_decorators;
    let _unitPrice_initializers = [];
    let _unitPrice_extraInitializers = [];
    let _lineTotal_decorators;
    let _lineTotal_initializers = [];
    let _lineTotal_extraInitializers = [];
    return _a = class CartItemDto {
            constructor() {
                this.productId = __runInitializers(this, _productId_initializers, void 0);
                this.categoryId = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _categoryId_initializers, void 0));
                this.quantity = (__runInitializers(this, _categoryId_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
                this.unitPrice = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _unitPrice_initializers, void 0));
                this.lineTotal = (__runInitializers(this, _unitPrice_extraInitializers), __runInitializers(this, _lineTotal_initializers, void 0));
                __runInitializers(this, _lineTotal_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, class_validator_1.IsUUID)('4')];
            _categoryId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Category ID' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)('4')];
            _quantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _unitPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit price' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _lineTotal_decorators = [(0, swagger_1.ApiProperty)({ description: 'Line total' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: obj => "categoryId" in obj, get: obj => obj.categoryId, set: (obj, value) => { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _unitPrice_decorators, { kind: "field", name: "unitPrice", static: false, private: false, access: { has: obj => "unitPrice" in obj, get: obj => obj.unitPrice, set: (obj, value) => { obj.unitPrice = value; } }, metadata: _metadata }, _unitPrice_initializers, _unitPrice_extraInitializers);
            __esDecorate(null, null, _lineTotal_decorators, { kind: "field", name: "lineTotal", static: false, private: false, access: { has: obj => "lineTotal" in obj, get: obj => obj.lineTotal, set: (obj, value) => { obj.lineTotal = value; } }, metadata: _metadata }, _lineTotal_initializers, _lineTotal_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CartItemDto = CartItemDto;
/**
 * BOGO configuration DTO
 */
let BogoConfigDto = (() => {
    var _a;
    let _buyQuantity_decorators;
    let _buyQuantity_initializers = [];
    let _buyQuantity_extraInitializers = [];
    let _getQuantity_decorators;
    let _getQuantity_initializers = [];
    let _getQuantity_extraInitializers = [];
    let _getItemsDiscountPercentage_decorators;
    let _getItemsDiscountPercentage_initializers = [];
    let _getItemsDiscountPercentage_extraInitializers = [];
    let _sameProductRequired_decorators;
    let _sameProductRequired_initializers = [];
    let _sameProductRequired_extraInitializers = [];
    let _getProductIds_decorators;
    let _getProductIds_initializers = [];
    let _getProductIds_extraInitializers = [];
    let _maxApplications_decorators;
    let _maxApplications_initializers = [];
    let _maxApplications_extraInitializers = [];
    return _a = class BogoConfigDto {
            constructor() {
                this.buyQuantity = __runInitializers(this, _buyQuantity_initializers, void 0);
                this.getQuantity = (__runInitializers(this, _buyQuantity_extraInitializers), __runInitializers(this, _getQuantity_initializers, void 0));
                this.getItemsDiscountPercentage = (__runInitializers(this, _getQuantity_extraInitializers), __runInitializers(this, _getItemsDiscountPercentage_initializers, void 0));
                this.sameProductRequired = (__runInitializers(this, _getItemsDiscountPercentage_extraInitializers), __runInitializers(this, _sameProductRequired_initializers, void 0));
                this.getProductIds = (__runInitializers(this, _sameProductRequired_extraInitializers), __runInitializers(this, _getProductIds_initializers, void 0));
                this.maxApplications = (__runInitializers(this, _getProductIds_extraInitializers), __runInitializers(this, _maxApplications_initializers, void 0));
                __runInitializers(this, _maxApplications_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _buyQuantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Buy quantity' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _getQuantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Get quantity' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _getItemsDiscountPercentage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount on get items (percentage)', example: 100 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _sameProductRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Same product required' }), (0, class_validator_1.IsBoolean)()];
            _getProductIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Get product IDs (if different products allowed)', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)('4', { each: true })];
            _maxApplications_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maximum applications per order', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            __esDecorate(null, null, _buyQuantity_decorators, { kind: "field", name: "buyQuantity", static: false, private: false, access: { has: obj => "buyQuantity" in obj, get: obj => obj.buyQuantity, set: (obj, value) => { obj.buyQuantity = value; } }, metadata: _metadata }, _buyQuantity_initializers, _buyQuantity_extraInitializers);
            __esDecorate(null, null, _getQuantity_decorators, { kind: "field", name: "getQuantity", static: false, private: false, access: { has: obj => "getQuantity" in obj, get: obj => obj.getQuantity, set: (obj, value) => { obj.getQuantity = value; } }, metadata: _metadata }, _getQuantity_initializers, _getQuantity_extraInitializers);
            __esDecorate(null, null, _getItemsDiscountPercentage_decorators, { kind: "field", name: "getItemsDiscountPercentage", static: false, private: false, access: { has: obj => "getItemsDiscountPercentage" in obj, get: obj => obj.getItemsDiscountPercentage, set: (obj, value) => { obj.getItemsDiscountPercentage = value; } }, metadata: _metadata }, _getItemsDiscountPercentage_initializers, _getItemsDiscountPercentage_extraInitializers);
            __esDecorate(null, null, _sameProductRequired_decorators, { kind: "field", name: "sameProductRequired", static: false, private: false, access: { has: obj => "sameProductRequired" in obj, get: obj => obj.sameProductRequired, set: (obj, value) => { obj.sameProductRequired = value; } }, metadata: _metadata }, _sameProductRequired_initializers, _sameProductRequired_extraInitializers);
            __esDecorate(null, null, _getProductIds_decorators, { kind: "field", name: "getProductIds", static: false, private: false, access: { has: obj => "getProductIds" in obj, get: obj => obj.getProductIds, set: (obj, value) => { obj.getProductIds = value; } }, metadata: _metadata }, _getProductIds_initializers, _getProductIds_extraInitializers);
            __esDecorate(null, null, _maxApplications_decorators, { kind: "field", name: "maxApplications", static: false, private: false, access: { has: obj => "maxApplications" in obj, get: obj => obj.maxApplications, set: (obj, value) => { obj.maxApplications = value; } }, metadata: _metadata }, _maxApplications_initializers, _maxApplications_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.BogoConfigDto = BogoConfigDto;
/**
 * Volume discount tier DTO
 */
let VolumeDiscountTierDto = (() => {
    var _a;
    let _minQuantity_decorators;
    let _minQuantity_initializers = [];
    let _minQuantity_extraInitializers = [];
    let _maxQuantity_decorators;
    let _maxQuantity_initializers = [];
    let _maxQuantity_extraInitializers = [];
    let _discountPercentage_decorators;
    let _discountPercentage_initializers = [];
    let _discountPercentage_extraInitializers = [];
    let _fixedDiscountAmount_decorators;
    let _fixedDiscountAmount_initializers = [];
    let _fixedDiscountAmount_extraInitializers = [];
    return _a = class VolumeDiscountTierDto {
            constructor() {
                this.minQuantity = __runInitializers(this, _minQuantity_initializers, void 0);
                this.maxQuantity = (__runInitializers(this, _minQuantity_extraInitializers), __runInitializers(this, _maxQuantity_initializers, void 0));
                this.discountPercentage = (__runInitializers(this, _maxQuantity_extraInitializers), __runInitializers(this, _discountPercentage_initializers, void 0));
                this.fixedDiscountAmount = (__runInitializers(this, _discountPercentage_extraInitializers), __runInitializers(this, _fixedDiscountAmount_initializers, void 0));
                __runInitializers(this, _fixedDiscountAmount_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _minQuantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minimum quantity' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _maxQuantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maximum quantity (null for unlimited)', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _discountPercentage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount percentage', example: 10 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _fixedDiscountAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fixed discount amount (alternative to percentage)', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _minQuantity_decorators, { kind: "field", name: "minQuantity", static: false, private: false, access: { has: obj => "minQuantity" in obj, get: obj => obj.minQuantity, set: (obj, value) => { obj.minQuantity = value; } }, metadata: _metadata }, _minQuantity_initializers, _minQuantity_extraInitializers);
            __esDecorate(null, null, _maxQuantity_decorators, { kind: "field", name: "maxQuantity", static: false, private: false, access: { has: obj => "maxQuantity" in obj, get: obj => obj.maxQuantity, set: (obj, value) => { obj.maxQuantity = value; } }, metadata: _metadata }, _maxQuantity_initializers, _maxQuantity_extraInitializers);
            __esDecorate(null, null, _discountPercentage_decorators, { kind: "field", name: "discountPercentage", static: false, private: false, access: { has: obj => "discountPercentage" in obj, get: obj => obj.discountPercentage, set: (obj, value) => { obj.discountPercentage = value; } }, metadata: _metadata }, _discountPercentage_initializers, _discountPercentage_extraInitializers);
            __esDecorate(null, null, _fixedDiscountAmount_decorators, { kind: "field", name: "fixedDiscountAmount", static: false, private: false, access: { has: obj => "fixedDiscountAmount" in obj, get: obj => obj.fixedDiscountAmount, set: (obj, value) => { obj.fixedDiscountAmount = value; } }, metadata: _metadata }, _fixedDiscountAmount_initializers, _fixedDiscountAmount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.VolumeDiscountTierDto = VolumeDiscountTierDto;
/**
 * Tiered promotion DTO
 */
let TieredPromotionDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _tiers_decorators;
    let _tiers_initializers = [];
    let _tiers_extraInitializers = [];
    let _basedOn_decorators;
    let _basedOn_initializers = [];
    let _basedOn_extraInitializers = [];
    let _applicableProductIds_decorators;
    let _applicableProductIds_initializers = [];
    let _applicableProductIds_extraInitializers = [];
    return _a = class TieredPromotionDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.tiers = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _tiers_initializers, void 0));
                this.basedOn = (__runInitializers(this, _tiers_extraInitializers), __runInitializers(this, _basedOn_initializers, void 0));
                this.applicableProductIds = (__runInitializers(this, _basedOn_extraInitializers), __runInitializers(this, _applicableProductIds_initializers, void 0));
                __runInitializers(this, _applicableProductIds_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Promotion name' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _tiers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tier definitions', type: [VolumeDiscountTierDto] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => VolumeDiscountTierDto)];
            _basedOn_decorators = [(0, swagger_1.ApiProperty)({ description: 'Based on quantity or amount' }), (0, class_validator_1.IsEnum)(['QUANTITY', 'AMOUNT'])];
            _applicableProductIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Applicable product IDs', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)('4', { each: true })];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _tiers_decorators, { kind: "field", name: "tiers", static: false, private: false, access: { has: obj => "tiers" in obj, get: obj => obj.tiers, set: (obj, value) => { obj.tiers = value; } }, metadata: _metadata }, _tiers_initializers, _tiers_extraInitializers);
            __esDecorate(null, null, _basedOn_decorators, { kind: "field", name: "basedOn", static: false, private: false, access: { has: obj => "basedOn" in obj, get: obj => obj.basedOn, set: (obj, value) => { obj.basedOn = value; } }, metadata: _metadata }, _basedOn_initializers, _basedOn_extraInitializers);
            __esDecorate(null, null, _applicableProductIds_decorators, { kind: "field", name: "applicableProductIds", static: false, private: false, access: { has: obj => "applicableProductIds" in obj, get: obj => obj.applicableProductIds, set: (obj, value) => { obj.applicableProductIds = value; } }, metadata: _metadata }, _applicableProductIds_initializers, _applicableProductIds_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TieredPromotionDto = TieredPromotionDto;
/**
 * Apply discount DTO
 */
let ApplyDiscountDto = (() => {
    var _a;
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _discountIds_decorators;
    let _discountIds_initializers = [];
    let _discountIds_extraInitializers = [];
    let _couponCodes_decorators;
    let _couponCodes_initializers = [];
    let _couponCodes_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    return _a = class ApplyDiscountDto {
            constructor() {
                this.orderId = __runInitializers(this, _orderId_initializers, void 0);
                this.discountIds = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _discountIds_initializers, void 0));
                this.couponCodes = (__runInitializers(this, _discountIds_extraInitializers), __runInitializers(this, _couponCodes_initializers, void 0));
                this.customerId = (__runInitializers(this, _couponCodes_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
                __runInitializers(this, _customerId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _orderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order ID' }), (0, class_validator_1.IsUUID)('4')];
            _discountIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount IDs to apply', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)('4', { each: true })];
            _couponCodes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Coupon codes to apply', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, class_validator_1.IsUUID)('4')];
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
            __esDecorate(null, null, _discountIds_decorators, { kind: "field", name: "discountIds", static: false, private: false, access: { has: obj => "discountIds" in obj, get: obj => obj.discountIds, set: (obj, value) => { obj.discountIds = value; } }, metadata: _metadata }, _discountIds_initializers, _discountIds_extraInitializers);
            __esDecorate(null, null, _couponCodes_decorators, { kind: "field", name: "couponCodes", static: false, private: false, access: { has: obj => "couponCodes" in obj, get: obj => obj.couponCodes, set: (obj, value) => { obj.couponCodes = value; } }, metadata: _metadata }, _couponCodes_initializers, _couponCodes_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ApplyDiscountDto = ApplyDiscountDto;
/**
 * Customer segment promotion DTO
 */
let CustomerSegmentPromotionDto = (() => {
    var _a;
    let _segmentName_decorators;
    let _segmentName_initializers = [];
    let _segmentName_extraInitializers = [];
    let _criteria_decorators;
    let _criteria_initializers = [];
    let _criteria_extraInitializers = [];
    let _discountPercentage_decorators;
    let _discountPercentage_initializers = [];
    let _discountPercentage_extraInitializers = [];
    let _minPurchaseAmount_decorators;
    let _minPurchaseAmount_initializers = [];
    let _minPurchaseAmount_extraInitializers = [];
    let _validFrom_decorators;
    let _validFrom_initializers = [];
    let _validFrom_extraInitializers = [];
    let _validTo_decorators;
    let _validTo_initializers = [];
    let _validTo_extraInitializers = [];
    return _a = class CustomerSegmentPromotionDto {
            constructor() {
                this.segmentName = __runInitializers(this, _segmentName_initializers, void 0);
                this.criteria = (__runInitializers(this, _segmentName_extraInitializers), __runInitializers(this, _criteria_initializers, void 0));
                this.discountPercentage = (__runInitializers(this, _criteria_extraInitializers), __runInitializers(this, _discountPercentage_initializers, void 0));
                this.minPurchaseAmount = (__runInitializers(this, _discountPercentage_extraInitializers), __runInitializers(this, _minPurchaseAmount_initializers, void 0));
                this.validFrom = (__runInitializers(this, _minPurchaseAmount_extraInitializers), __runInitializers(this, _validFrom_initializers, void 0));
                this.validTo = (__runInitializers(this, _validFrom_extraInitializers), __runInitializers(this, _validTo_initializers, void 0));
                __runInitializers(this, _validTo_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _segmentName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Segment name' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _criteria_decorators = [(0, swagger_1.ApiProperty)({ description: 'Segment criteria' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _discountPercentage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount percentage', example: 15 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _minPurchaseAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minimum purchase amount', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _validFrom_decorators = [(0, swagger_1.ApiProperty)({ description: 'Valid from', type: String }), (0, class_validator_1.IsDateString)()];
            _validTo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Valid to', type: String }), (0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _segmentName_decorators, { kind: "field", name: "segmentName", static: false, private: false, access: { has: obj => "segmentName" in obj, get: obj => obj.segmentName, set: (obj, value) => { obj.segmentName = value; } }, metadata: _metadata }, _segmentName_initializers, _segmentName_extraInitializers);
            __esDecorate(null, null, _criteria_decorators, { kind: "field", name: "criteria", static: false, private: false, access: { has: obj => "criteria" in obj, get: obj => obj.criteria, set: (obj, value) => { obj.criteria = value; } }, metadata: _metadata }, _criteria_initializers, _criteria_extraInitializers);
            __esDecorate(null, null, _discountPercentage_decorators, { kind: "field", name: "discountPercentage", static: false, private: false, access: { has: obj => "discountPercentage" in obj, get: obj => obj.discountPercentage, set: (obj, value) => { obj.discountPercentage = value; } }, metadata: _metadata }, _discountPercentage_initializers, _discountPercentage_extraInitializers);
            __esDecorate(null, null, _minPurchaseAmount_decorators, { kind: "field", name: "minPurchaseAmount", static: false, private: false, access: { has: obj => "minPurchaseAmount" in obj, get: obj => obj.minPurchaseAmount, set: (obj, value) => { obj.minPurchaseAmount = value; } }, metadata: _metadata }, _minPurchaseAmount_initializers, _minPurchaseAmount_extraInitializers);
            __esDecorate(null, null, _validFrom_decorators, { kind: "field", name: "validFrom", static: false, private: false, access: { has: obj => "validFrom" in obj, get: obj => obj.validFrom, set: (obj, value) => { obj.validFrom = value; } }, metadata: _metadata }, _validFrom_initializers, _validFrom_extraInitializers);
            __esDecorate(null, null, _validTo_decorators, { kind: "field", name: "validTo", static: false, private: false, access: { has: obj => "validTo" in obj, get: obj => obj.validTo, set: (obj, value) => { obj.validTo = value; } }, metadata: _metadata }, _validTo_initializers, _validTo_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CustomerSegmentPromotionDto = CustomerSegmentPromotionDto;
/**
 * Flash sale DTO
 */
let FlashSaleDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _productIds_decorators;
    let _productIds_initializers = [];
    let _productIds_extraInitializers = [];
    let _discountPercentage_decorators;
    let _discountPercentage_initializers = [];
    let _discountPercentage_extraInitializers = [];
    let _startTime_decorators;
    let _startTime_initializers = [];
    let _startTime_extraInitializers = [];
    let _endTime_decorators;
    let _endTime_initializers = [];
    let _endTime_extraInitializers = [];
    let _stockLimit_decorators;
    let _stockLimit_initializers = [];
    let _stockLimit_extraInitializers = [];
    let _perCustomerLimit_decorators;
    let _perCustomerLimit_initializers = [];
    let _perCustomerLimit_extraInitializers = [];
    return _a = class FlashSaleDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.productIds = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _productIds_initializers, void 0));
                this.discountPercentage = (__runInitializers(this, _productIds_extraInitializers), __runInitializers(this, _discountPercentage_initializers, void 0));
                this.startTime = (__runInitializers(this, _discountPercentage_extraInitializers), __runInitializers(this, _startTime_initializers, void 0));
                this.endTime = (__runInitializers(this, _startTime_extraInitializers), __runInitializers(this, _endTime_initializers, void 0));
                this.stockLimit = (__runInitializers(this, _endTime_extraInitializers), __runInitializers(this, _stockLimit_initializers, void 0));
                this.perCustomerLimit = (__runInitializers(this, _stockLimit_extraInitializers), __runInitializers(this, _perCustomerLimit_initializers, void 0));
                __runInitializers(this, _perCustomerLimit_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sale name' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _productIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product IDs on sale', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)('4', { each: true })];
            _discountPercentage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount percentage', example: 50 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            _startTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start time', type: String }), (0, class_validator_1.IsDateString)()];
            _endTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'End time', type: String }), (0, class_validator_1.IsDateString)()];
            _stockLimit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Stock limit per product', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _perCustomerLimit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Per customer limit', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _productIds_decorators, { kind: "field", name: "productIds", static: false, private: false, access: { has: obj => "productIds" in obj, get: obj => obj.productIds, set: (obj, value) => { obj.productIds = value; } }, metadata: _metadata }, _productIds_initializers, _productIds_extraInitializers);
            __esDecorate(null, null, _discountPercentage_decorators, { kind: "field", name: "discountPercentage", static: false, private: false, access: { has: obj => "discountPercentage" in obj, get: obj => obj.discountPercentage, set: (obj, value) => { obj.discountPercentage = value; } }, metadata: _metadata }, _discountPercentage_initializers, _discountPercentage_extraInitializers);
            __esDecorate(null, null, _startTime_decorators, { kind: "field", name: "startTime", static: false, private: false, access: { has: obj => "startTime" in obj, get: obj => obj.startTime, set: (obj, value) => { obj.startTime = value; } }, metadata: _metadata }, _startTime_initializers, _startTime_extraInitializers);
            __esDecorate(null, null, _endTime_decorators, { kind: "field", name: "endTime", static: false, private: false, access: { has: obj => "endTime" in obj, get: obj => obj.endTime, set: (obj, value) => { obj.endTime = value; } }, metadata: _metadata }, _endTime_initializers, _endTime_extraInitializers);
            __esDecorate(null, null, _stockLimit_decorators, { kind: "field", name: "stockLimit", static: false, private: false, access: { has: obj => "stockLimit" in obj, get: obj => obj.stockLimit, set: (obj, value) => { obj.stockLimit = value; } }, metadata: _metadata }, _stockLimit_initializers, _stockLimit_extraInitializers);
            __esDecorate(null, null, _perCustomerLimit_decorators, { kind: "field", name: "perCustomerLimit", static: false, private: false, access: { has: obj => "perCustomerLimit" in obj, get: obj => obj.perCustomerLimit, set: (obj, value) => { obj.perCustomerLimit = value; } }, metadata: _metadata }, _perCustomerLimit_initializers, _perCustomerLimit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.FlashSaleDto = FlashSaleDto;
/**
 * Exclusion rule DTO
 */
let ExclusionRuleDto = (() => {
    var _a;
    let _promotionId_decorators;
    let _promotionId_initializers = [];
    let _promotionId_extraInitializers = [];
    let _excludedProductIds_decorators;
    let _excludedProductIds_initializers = [];
    let _excludedProductIds_extraInitializers = [];
    let _excludedCategoryIds_decorators;
    let _excludedCategoryIds_initializers = [];
    let _excludedCategoryIds_extraInitializers = [];
    let _excludedCustomerIds_decorators;
    let _excludedCustomerIds_initializers = [];
    let _excludedCustomerIds_extraInitializers = [];
    let _excludeSaleItems_decorators;
    let _excludeSaleItems_initializers = [];
    let _excludeSaleItems_extraInitializers = [];
    let _excludeClearanceItems_decorators;
    let _excludeClearanceItems_initializers = [];
    let _excludeClearanceItems_extraInitializers = [];
    return _a = class ExclusionRuleDto {
            constructor() {
                this.promotionId = __runInitializers(this, _promotionId_initializers, void 0);
                this.excludedProductIds = (__runInitializers(this, _promotionId_extraInitializers), __runInitializers(this, _excludedProductIds_initializers, void 0));
                this.excludedCategoryIds = (__runInitializers(this, _excludedProductIds_extraInitializers), __runInitializers(this, _excludedCategoryIds_initializers, void 0));
                this.excludedCustomerIds = (__runInitializers(this, _excludedCategoryIds_extraInitializers), __runInitializers(this, _excludedCustomerIds_initializers, void 0));
                this.excludeSaleItems = (__runInitializers(this, _excludedCustomerIds_extraInitializers), __runInitializers(this, _excludeSaleItems_initializers, void 0));
                this.excludeClearanceItems = (__runInitializers(this, _excludeSaleItems_extraInitializers), __runInitializers(this, _excludeClearanceItems_initializers, void 0));
                __runInitializers(this, _excludeClearanceItems_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _promotionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Promotion ID' }), (0, class_validator_1.IsUUID)('4')];
            _excludedProductIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Excluded product IDs', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)('4', { each: true })];
            _excludedCategoryIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Excluded category IDs', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)('4', { each: true })];
            _excludedCustomerIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Excluded customer IDs', required: false, type: [String] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)('4', { each: true })];
            _excludeSaleItems_decorators = [(0, swagger_1.ApiProperty)({ description: 'Excluded on sale items' }), (0, class_validator_1.IsBoolean)()];
            _excludeClearanceItems_decorators = [(0, swagger_1.ApiProperty)({ description: 'Excluded clearance items' }), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _promotionId_decorators, { kind: "field", name: "promotionId", static: false, private: false, access: { has: obj => "promotionId" in obj, get: obj => obj.promotionId, set: (obj, value) => { obj.promotionId = value; } }, metadata: _metadata }, _promotionId_initializers, _promotionId_extraInitializers);
            __esDecorate(null, null, _excludedProductIds_decorators, { kind: "field", name: "excludedProductIds", static: false, private: false, access: { has: obj => "excludedProductIds" in obj, get: obj => obj.excludedProductIds, set: (obj, value) => { obj.excludedProductIds = value; } }, metadata: _metadata }, _excludedProductIds_initializers, _excludedProductIds_extraInitializers);
            __esDecorate(null, null, _excludedCategoryIds_decorators, { kind: "field", name: "excludedCategoryIds", static: false, private: false, access: { has: obj => "excludedCategoryIds" in obj, get: obj => obj.excludedCategoryIds, set: (obj, value) => { obj.excludedCategoryIds = value; } }, metadata: _metadata }, _excludedCategoryIds_initializers, _excludedCategoryIds_extraInitializers);
            __esDecorate(null, null, _excludedCustomerIds_decorators, { kind: "field", name: "excludedCustomerIds", static: false, private: false, access: { has: obj => "excludedCustomerIds" in obj, get: obj => obj.excludedCustomerIds, set: (obj, value) => { obj.excludedCustomerIds = value; } }, metadata: _metadata }, _excludedCustomerIds_initializers, _excludedCustomerIds_extraInitializers);
            __esDecorate(null, null, _excludeSaleItems_decorators, { kind: "field", name: "excludeSaleItems", static: false, private: false, access: { has: obj => "excludeSaleItems" in obj, get: obj => obj.excludeSaleItems, set: (obj, value) => { obj.excludeSaleItems = value; } }, metadata: _metadata }, _excludeSaleItems_initializers, _excludeSaleItems_extraInitializers);
            __esDecorate(null, null, _excludeClearanceItems_decorators, { kind: "field", name: "excludeClearanceItems", static: false, private: false, access: { has: obj => "excludeClearanceItems" in obj, get: obj => obj.excludeClearanceItems, set: (obj, value) => { obj.excludeClearanceItems = value; } }, metadata: _metadata }, _excludeClearanceItems_initializers, _excludeClearanceItems_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ExclusionRuleDto = ExclusionRuleDto;
/**
 * Discount calculation result
 */
let DiscountCalculationResult = (() => {
    var _a;
    let _originalTotal_decorators;
    let _originalTotal_initializers = [];
    let _originalTotal_extraInitializers = [];
    let _discountAmount_decorators;
    let _discountAmount_initializers = [];
    let _discountAmount_extraInitializers = [];
    let _finalTotal_decorators;
    let _finalTotal_initializers = [];
    let _finalTotal_extraInitializers = [];
    let _appliedDiscounts_decorators;
    let _appliedDiscounts_initializers = [];
    let _appliedDiscounts_extraInitializers = [];
    let _totalSavings_decorators;
    let _totalSavings_initializers = [];
    let _totalSavings_extraInitializers = [];
    return _a = class DiscountCalculationResult {
            constructor() {
                this.originalTotal = __runInitializers(this, _originalTotal_initializers, void 0);
                this.discountAmount = (__runInitializers(this, _originalTotal_extraInitializers), __runInitializers(this, _discountAmount_initializers, void 0));
                this.finalTotal = (__runInitializers(this, _discountAmount_extraInitializers), __runInitializers(this, _finalTotal_initializers, void 0));
                this.appliedDiscounts = (__runInitializers(this, _finalTotal_extraInitializers), __runInitializers(this, _appliedDiscounts_initializers, void 0));
                this.totalSavings = (__runInitializers(this, _appliedDiscounts_extraInitializers), __runInitializers(this, _totalSavings_initializers, void 0));
                __runInitializers(this, _totalSavings_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _originalTotal_decorators = [(0, swagger_1.ApiProperty)({ description: 'Original total' })];
            _discountAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount amount' })];
            _finalTotal_decorators = [(0, swagger_1.ApiProperty)({ description: 'Final total' })];
            _appliedDiscounts_decorators = [(0, swagger_1.ApiProperty)({ description: 'Applied discount details', type: 'array' })];
            _totalSavings_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total savings' })];
            __esDecorate(null, null, _originalTotal_decorators, { kind: "field", name: "originalTotal", static: false, private: false, access: { has: obj => "originalTotal" in obj, get: obj => obj.originalTotal, set: (obj, value) => { obj.originalTotal = value; } }, metadata: _metadata }, _originalTotal_initializers, _originalTotal_extraInitializers);
            __esDecorate(null, null, _discountAmount_decorators, { kind: "field", name: "discountAmount", static: false, private: false, access: { has: obj => "discountAmount" in obj, get: obj => obj.discountAmount, set: (obj, value) => { obj.discountAmount = value; } }, metadata: _metadata }, _discountAmount_initializers, _discountAmount_extraInitializers);
            __esDecorate(null, null, _finalTotal_decorators, { kind: "field", name: "finalTotal", static: false, private: false, access: { has: obj => "finalTotal" in obj, get: obj => obj.finalTotal, set: (obj, value) => { obj.finalTotal = value; } }, metadata: _metadata }, _finalTotal_initializers, _finalTotal_extraInitializers);
            __esDecorate(null, null, _appliedDiscounts_decorators, { kind: "field", name: "appliedDiscounts", static: false, private: false, access: { has: obj => "appliedDiscounts" in obj, get: obj => obj.appliedDiscounts, set: (obj, value) => { obj.appliedDiscounts = value; } }, metadata: _metadata }, _appliedDiscounts_initializers, _appliedDiscounts_extraInitializers);
            __esDecorate(null, null, _totalSavings_decorators, { kind: "field", name: "totalSavings", static: false, private: false, access: { has: obj => "totalSavings" in obj, get: obj => obj.totalSavings, set: (obj, value) => { obj.totalSavings = value; } }, metadata: _metadata }, _totalSavings_initializers, _totalSavings_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DiscountCalculationResult = DiscountCalculationResult;
/**
 * Applied discount detail
 */
let AppliedDiscountDetail = (() => {
    var _a;
    let _discountId_decorators;
    let _discountId_initializers = [];
    let _discountId_extraInitializers = [];
    let _discountName_decorators;
    let _discountName_initializers = [];
    let _discountName_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _couponCode_decorators;
    let _couponCode_initializers = [];
    let _couponCode_extraInitializers = [];
    return _a = class AppliedDiscountDetail {
            constructor() {
                this.discountId = __runInitializers(this, _discountId_initializers, void 0);
                this.discountName = (__runInitializers(this, _discountId_extraInitializers), __runInitializers(this, _discountName_initializers, void 0));
                this.amount = (__runInitializers(this, _discountName_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.scope = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
                this.couponCode = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _couponCode_initializers, void 0));
                __runInitializers(this, _couponCode_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _discountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount ID' })];
            _discountName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount name' })];
            _amount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount amount' })];
            _scope_decorators = [(0, swagger_1.ApiProperty)({ description: 'Applied at scope' })];
            _couponCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Coupon code used', required: false })];
            __esDecorate(null, null, _discountId_decorators, { kind: "field", name: "discountId", static: false, private: false, access: { has: obj => "discountId" in obj, get: obj => obj.discountId, set: (obj, value) => { obj.discountId = value; } }, metadata: _metadata }, _discountId_initializers, _discountId_extraInitializers);
            __esDecorate(null, null, _discountName_decorators, { kind: "field", name: "discountName", static: false, private: false, access: { has: obj => "discountName" in obj, get: obj => obj.discountName, set: (obj, value) => { obj.discountName = value; } }, metadata: _metadata }, _discountName_initializers, _discountName_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
            __esDecorate(null, null, _couponCode_decorators, { kind: "field", name: "couponCode", static: false, private: false, access: { has: obj => "couponCode" in obj, get: obj => obj.couponCode, set: (obj, value) => { obj.couponCode = value; } }, metadata: _metadata }, _couponCode_initializers, _couponCode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AppliedDiscountDetail = AppliedDiscountDetail;
// ============================================================================
// MODELS
// ============================================================================
let Discount = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'discounts', paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _discountType_decorators;
    let _discountType_initializers = [];
    let _discountType_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _maxDiscountAmount_decorators;
    let _maxDiscountAmount_initializers = [];
    let _maxDiscountAmount_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _minPurchaseAmount_decorators;
    let _minPurchaseAmount_initializers = [];
    let _minPurchaseAmount_extraInitializers = [];
    let _minQuantity_decorators;
    let _minQuantity_initializers = [];
    let _minQuantity_extraInitializers = [];
    let _applicableProductIds_decorators;
    let _applicableProductIds_initializers = [];
    let _applicableProductIds_extraInitializers = [];
    let _applicableCategoryIds_decorators;
    let _applicableCategoryIds_initializers = [];
    let _applicableCategoryIds_extraInitializers = [];
    let _excludedProductIds_decorators;
    let _excludedProductIds_initializers = [];
    let _excludedProductIds_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var Discount = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.discountType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _discountType_initializers, void 0));
            this.value = (__runInitializers(this, _discountType_extraInitializers), __runInitializers(this, _value_initializers, void 0));
            this.maxDiscountAmount = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _maxDiscountAmount_initializers, void 0));
            this.scope = (__runInitializers(this, _maxDiscountAmount_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
            this.startDate = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.minPurchaseAmount = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _minPurchaseAmount_initializers, void 0));
            this.minQuantity = (__runInitializers(this, _minPurchaseAmount_extraInitializers), __runInitializers(this, _minQuantity_initializers, void 0));
            this.applicableProductIds = (__runInitializers(this, _minQuantity_extraInitializers), __runInitializers(this, _applicableProductIds_initializers, void 0));
            this.applicableCategoryIds = (__runInitializers(this, _applicableProductIds_extraInitializers), __runInitializers(this, _applicableCategoryIds_initializers, void 0));
            this.excludedProductIds = (__runInitializers(this, _applicableCategoryIds_extraInitializers), __runInitializers(this, _excludedProductIds_initializers, void 0));
            this.priority = (__runInitializers(this, _excludedProductIds_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.isActive = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Discount");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false }), sequelize_typescript_1.Index];
        _description_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _discountType_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(DiscountType)), allowNull: false })];
        _value_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false })];
        _maxDiscountAmount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _scope_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ApplicationScope)), allowNull: false })];
        _startDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _endDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _minPurchaseAmount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _minQuantity_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _applicableProductIds_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _applicableCategoryIds_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _excludedProductIds_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _priority_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 50 })];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _discountType_decorators, { kind: "field", name: "discountType", static: false, private: false, access: { has: obj => "discountType" in obj, get: obj => obj.discountType, set: (obj, value) => { obj.discountType = value; } }, metadata: _metadata }, _discountType_initializers, _discountType_extraInitializers);
        __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
        __esDecorate(null, null, _maxDiscountAmount_decorators, { kind: "field", name: "maxDiscountAmount", static: false, private: false, access: { has: obj => "maxDiscountAmount" in obj, get: obj => obj.maxDiscountAmount, set: (obj, value) => { obj.maxDiscountAmount = value; } }, metadata: _metadata }, _maxDiscountAmount_initializers, _maxDiscountAmount_extraInitializers);
        __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _minPurchaseAmount_decorators, { kind: "field", name: "minPurchaseAmount", static: false, private: false, access: { has: obj => "minPurchaseAmount" in obj, get: obj => obj.minPurchaseAmount, set: (obj, value) => { obj.minPurchaseAmount = value; } }, metadata: _metadata }, _minPurchaseAmount_initializers, _minPurchaseAmount_extraInitializers);
        __esDecorate(null, null, _minQuantity_decorators, { kind: "field", name: "minQuantity", static: false, private: false, access: { has: obj => "minQuantity" in obj, get: obj => obj.minQuantity, set: (obj, value) => { obj.minQuantity = value; } }, metadata: _metadata }, _minQuantity_initializers, _minQuantity_extraInitializers);
        __esDecorate(null, null, _applicableProductIds_decorators, { kind: "field", name: "applicableProductIds", static: false, private: false, access: { has: obj => "applicableProductIds" in obj, get: obj => obj.applicableProductIds, set: (obj, value) => { obj.applicableProductIds = value; } }, metadata: _metadata }, _applicableProductIds_initializers, _applicableProductIds_extraInitializers);
        __esDecorate(null, null, _applicableCategoryIds_decorators, { kind: "field", name: "applicableCategoryIds", static: false, private: false, access: { has: obj => "applicableCategoryIds" in obj, get: obj => obj.applicableCategoryIds, set: (obj, value) => { obj.applicableCategoryIds = value; } }, metadata: _metadata }, _applicableCategoryIds_initializers, _applicableCategoryIds_extraInitializers);
        __esDecorate(null, null, _excludedProductIds_decorators, { kind: "field", name: "excludedProductIds", static: false, private: false, access: { has: obj => "excludedProductIds" in obj, get: obj => obj.excludedProductIds, set: (obj, value) => { obj.excludedProductIds = value; } }, metadata: _metadata }, _excludedProductIds_initializers, _excludedProductIds_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Discount = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Discount = _classThis;
})();
exports.Discount = Discount;
let Promotion = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'promotions', paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _internalCode_decorators;
    let _internalCode_initializers = [];
    let _internalCode_extraInitializers = [];
    let _promotionType_decorators;
    let _promotionType_initializers = [];
    let _promotionType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _customerEligibility_decorators;
    let _customerEligibility_initializers = [];
    let _customerEligibility_extraInitializers = [];
    let _customerSegmentIds_decorators;
    let _customerSegmentIds_initializers = [];
    let _customerSegmentIds_extraInitializers = [];
    let _usageLimitPerCustomer_decorators;
    let _usageLimitPerCustomer_initializers = [];
    let _usageLimitPerCustomer_extraInitializers = [];
    let _totalUsageLimit_decorators;
    let _totalUsageLimit_initializers = [];
    let _totalUsageLimit_extraInitializers = [];
    let _totalUsageCount_decorators;
    let _totalUsageCount_initializers = [];
    let _totalUsageCount_extraInitializers = [];
    let _discountIds_decorators;
    let _discountIds_initializers = [];
    let _discountIds_extraInitializers = [];
    let _stackingRule_decorators;
    let _stackingRule_initializers = [];
    let _stackingRule_extraInitializers = [];
    let _requiresCouponCode_decorators;
    let _requiresCouponCode_initializers = [];
    let _requiresCouponCode_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var Promotion = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.internalCode = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _internalCode_initializers, void 0));
            this.promotionType = (__runInitializers(this, _internalCode_extraInitializers), __runInitializers(this, _promotionType_initializers, void 0));
            this.description = (__runInitializers(this, _promotionType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.startDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.status = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.customerEligibility = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _customerEligibility_initializers, void 0));
            this.customerSegmentIds = (__runInitializers(this, _customerEligibility_extraInitializers), __runInitializers(this, _customerSegmentIds_initializers, void 0));
            this.usageLimitPerCustomer = (__runInitializers(this, _customerSegmentIds_extraInitializers), __runInitializers(this, _usageLimitPerCustomer_initializers, void 0));
            this.totalUsageLimit = (__runInitializers(this, _usageLimitPerCustomer_extraInitializers), __runInitializers(this, _totalUsageLimit_initializers, void 0));
            this.totalUsageCount = (__runInitializers(this, _totalUsageLimit_extraInitializers), __runInitializers(this, _totalUsageCount_initializers, void 0));
            this.discountIds = (__runInitializers(this, _totalUsageCount_extraInitializers), __runInitializers(this, _discountIds_initializers, void 0));
            this.stackingRule = (__runInitializers(this, _discountIds_extraInitializers), __runInitializers(this, _stackingRule_initializers, void 0));
            this.requiresCouponCode = (__runInitializers(this, _stackingRule_extraInitializers), __runInitializers(this, _requiresCouponCode_initializers, void 0));
            this.createdAt = (__runInitializers(this, _requiresCouponCode_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Promotion");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _name_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false }), sequelize_typescript_1.Index];
        _internalCode_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false, unique: true }), sequelize_typescript_1.Index];
        _promotionType_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PromotionType)), allowNull: false })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _startDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _endDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _status_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PromotionStatus)), defaultValue: PromotionStatus.DRAFT }), sequelize_typescript_1.Index];
        _customerEligibility_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(CustomerEligibility)), allowNull: false })];
        _customerSegmentIds_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _usageLimitPerCustomer_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _totalUsageLimit_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _totalUsageCount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _discountIds_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _stackingRule_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(StackingRuleType)), allowNull: false })];
        _requiresCouponCode_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _internalCode_decorators, { kind: "field", name: "internalCode", static: false, private: false, access: { has: obj => "internalCode" in obj, get: obj => obj.internalCode, set: (obj, value) => { obj.internalCode = value; } }, metadata: _metadata }, _internalCode_initializers, _internalCode_extraInitializers);
        __esDecorate(null, null, _promotionType_decorators, { kind: "field", name: "promotionType", static: false, private: false, access: { has: obj => "promotionType" in obj, get: obj => obj.promotionType, set: (obj, value) => { obj.promotionType = value; } }, metadata: _metadata }, _promotionType_initializers, _promotionType_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _customerEligibility_decorators, { kind: "field", name: "customerEligibility", static: false, private: false, access: { has: obj => "customerEligibility" in obj, get: obj => obj.customerEligibility, set: (obj, value) => { obj.customerEligibility = value; } }, metadata: _metadata }, _customerEligibility_initializers, _customerEligibility_extraInitializers);
        __esDecorate(null, null, _customerSegmentIds_decorators, { kind: "field", name: "customerSegmentIds", static: false, private: false, access: { has: obj => "customerSegmentIds" in obj, get: obj => obj.customerSegmentIds, set: (obj, value) => { obj.customerSegmentIds = value; } }, metadata: _metadata }, _customerSegmentIds_initializers, _customerSegmentIds_extraInitializers);
        __esDecorate(null, null, _usageLimitPerCustomer_decorators, { kind: "field", name: "usageLimitPerCustomer", static: false, private: false, access: { has: obj => "usageLimitPerCustomer" in obj, get: obj => obj.usageLimitPerCustomer, set: (obj, value) => { obj.usageLimitPerCustomer = value; } }, metadata: _metadata }, _usageLimitPerCustomer_initializers, _usageLimitPerCustomer_extraInitializers);
        __esDecorate(null, null, _totalUsageLimit_decorators, { kind: "field", name: "totalUsageLimit", static: false, private: false, access: { has: obj => "totalUsageLimit" in obj, get: obj => obj.totalUsageLimit, set: (obj, value) => { obj.totalUsageLimit = value; } }, metadata: _metadata }, _totalUsageLimit_initializers, _totalUsageLimit_extraInitializers);
        __esDecorate(null, null, _totalUsageCount_decorators, { kind: "field", name: "totalUsageCount", static: false, private: false, access: { has: obj => "totalUsageCount" in obj, get: obj => obj.totalUsageCount, set: (obj, value) => { obj.totalUsageCount = value; } }, metadata: _metadata }, _totalUsageCount_initializers, _totalUsageCount_extraInitializers);
        __esDecorate(null, null, _discountIds_decorators, { kind: "field", name: "discountIds", static: false, private: false, access: { has: obj => "discountIds" in obj, get: obj => obj.discountIds, set: (obj, value) => { obj.discountIds = value; } }, metadata: _metadata }, _discountIds_initializers, _discountIds_extraInitializers);
        __esDecorate(null, null, _stackingRule_decorators, { kind: "field", name: "stackingRule", static: false, private: false, access: { has: obj => "stackingRule" in obj, get: obj => obj.stackingRule, set: (obj, value) => { obj.stackingRule = value; } }, metadata: _metadata }, _stackingRule_initializers, _stackingRule_extraInitializers);
        __esDecorate(null, null, _requiresCouponCode_decorators, { kind: "field", name: "requiresCouponCode", static: false, private: false, access: { has: obj => "requiresCouponCode" in obj, get: obj => obj.requiresCouponCode, set: (obj, value) => { obj.requiresCouponCode = value; } }, metadata: _metadata }, _requiresCouponCode_initializers, _requiresCouponCode_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Promotion = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Promotion = _classThis;
})();
exports.Promotion = Promotion;
let CouponCode = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'coupon_codes', paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _code_decorators;
    let _code_initializers = [];
    let _code_extraInitializers = [];
    let _promotionId_decorators;
    let _promotionId_initializers = [];
    let _promotionId_extraInitializers = [];
    let _promotion_decorators;
    let _promotion_initializers = [];
    let _promotion_extraInitializers = [];
    let _usageLimitPerCode_decorators;
    let _usageLimitPerCode_initializers = [];
    let _usageLimitPerCode_extraInitializers = [];
    let _usageCount_decorators;
    let _usageCount_initializers = [];
    let _usageCount_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var CouponCode = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.code = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _code_initializers, void 0));
            this.promotionId = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _promotionId_initializers, void 0));
            this.promotion = (__runInitializers(this, _promotionId_extraInitializers), __runInitializers(this, _promotion_initializers, void 0));
            this.usageLimitPerCode = (__runInitializers(this, _promotion_extraInitializers), __runInitializers(this, _usageLimitPerCode_initializers, void 0));
            this.usageCount = (__runInitializers(this, _usageLimitPerCode_extraInitializers), __runInitializers(this, _usageCount_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _usageCount_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.isActive = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CouponCode");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _code_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false, unique: true }), sequelize_typescript_1.Index];
        _promotionId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => Promotion), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _promotion_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Promotion)];
        _usageLimitPerCode_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _usageCount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 0 })];
        _expirationDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _isActive_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: obj => "code" in obj, get: obj => obj.code, set: (obj, value) => { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
        __esDecorate(null, null, _promotionId_decorators, { kind: "field", name: "promotionId", static: false, private: false, access: { has: obj => "promotionId" in obj, get: obj => obj.promotionId, set: (obj, value) => { obj.promotionId = value; } }, metadata: _metadata }, _promotionId_initializers, _promotionId_extraInitializers);
        __esDecorate(null, null, _promotion_decorators, { kind: "field", name: "promotion", static: false, private: false, access: { has: obj => "promotion" in obj, get: obj => obj.promotion, set: (obj, value) => { obj.promotion = value; } }, metadata: _metadata }, _promotion_initializers, _promotion_extraInitializers);
        __esDecorate(null, null, _usageLimitPerCode_decorators, { kind: "field", name: "usageLimitPerCode", static: false, private: false, access: { has: obj => "usageLimitPerCode" in obj, get: obj => obj.usageLimitPerCode, set: (obj, value) => { obj.usageLimitPerCode = value; } }, metadata: _metadata }, _usageLimitPerCode_initializers, _usageLimitPerCode_extraInitializers);
        __esDecorate(null, null, _usageCount_decorators, { kind: "field", name: "usageCount", static: false, private: false, access: { has: obj => "usageCount" in obj, get: obj => obj.usageCount, set: (obj, value) => { obj.usageCount = value; } }, metadata: _metadata }, _usageCount_initializers, _usageCount_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CouponCode = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CouponCode = _classThis;
})();
exports.CouponCode = CouponCode;
let CouponUsage = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'coupon_usage', paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _couponCodeId_decorators;
    let _couponCodeId_initializers = [];
    let _couponCodeId_extraInitializers = [];
    let _couponCode_decorators;
    let _couponCode_initializers = [];
    let _couponCode_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _discountAmount_decorators;
    let _discountAmount_initializers = [];
    let _discountAmount_extraInitializers = [];
    let _usedAt_decorators;
    let _usedAt_initializers = [];
    let _usedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var CouponUsage = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.couponCodeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _couponCodeId_initializers, void 0));
            this.couponCode = (__runInitializers(this, _couponCodeId_extraInitializers), __runInitializers(this, _couponCode_initializers, void 0));
            this.customerId = (__runInitializers(this, _couponCode_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.orderId = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
            this.discountAmount = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _discountAmount_initializers, void 0));
            this.usedAt = (__runInitializers(this, _discountAmount_extraInitializers), __runInitializers(this, _usedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _usedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CouponUsage");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _couponCodeId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => CouponCode), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _couponCode_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => CouponCode)];
        _customerId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _orderId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _discountAmount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false })];
        _usedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _couponCodeId_decorators, { kind: "field", name: "couponCodeId", static: false, private: false, access: { has: obj => "couponCodeId" in obj, get: obj => obj.couponCodeId, set: (obj, value) => { obj.couponCodeId = value; } }, metadata: _metadata }, _couponCodeId_initializers, _couponCodeId_extraInitializers);
        __esDecorate(null, null, _couponCode_decorators, { kind: "field", name: "couponCode", static: false, private: false, access: { has: obj => "couponCode" in obj, get: obj => obj.couponCode, set: (obj, value) => { obj.couponCode = value; } }, metadata: _metadata }, _couponCode_initializers, _couponCode_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
        __esDecorate(null, null, _discountAmount_decorators, { kind: "field", name: "discountAmount", static: false, private: false, access: { has: obj => "discountAmount" in obj, get: obj => obj.discountAmount, set: (obj, value) => { obj.discountAmount = value; } }, metadata: _metadata }, _discountAmount_initializers, _discountAmount_extraInitializers);
        __esDecorate(null, null, _usedAt_decorators, { kind: "field", name: "usedAt", static: false, private: false, access: { has: obj => "usedAt" in obj, get: obj => obj.usedAt, set: (obj, value) => { obj.usedAt = value; } }, metadata: _metadata }, _usedAt_initializers, _usedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CouponUsage = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CouponUsage = _classThis;
})();
exports.CouponUsage = CouponUsage;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const logger = new common_1.Logger('DiscountPromotionKit');
/**
 * 1. Generate unique discount code
 */
function generateDiscountCode(pattern, length, prefix) {
    const chars = {
        [CouponCodePattern.ALPHANUMERIC]: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
        [CouponCodePattern.NUMERIC]: '0123456789',
        [CouponCodePattern.ALPHABETIC]: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
        [CouponCodePattern.CUSTOM]: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
    };
    const charset = chars[pattern];
    let code = '';
    for (let i = 0; i < length; i++) {
        code += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return prefix ? `${prefix}${code}` : code;
}
/**
 * 2. Validate coupon code format
 */
function validateCouponCodeFormat(code) {
    const regex = /^[A-Z0-9_-]{4,50}$/;
    return regex.test(code);
}
/**
 * 3. Check if coupon is valid and active
 */
async function isCouponValid(couponCode, customerId) {
    if (!couponCode.isActive) {
        return { valid: false, reason: 'Coupon is inactive' };
    }
    if (couponCode.expirationDate && new Date() > new Date(couponCode.expirationDate)) {
        return { valid: false, reason: 'Coupon has expired' };
    }
    if (couponCode.usageLimitPerCode && couponCode.usageCount >= couponCode.usageLimitPerCode) {
        return { valid: false, reason: 'Coupon usage limit reached' };
    }
    // Check customer-specific usage
    const customerUsage = await CouponUsage.count({
        where: { couponCodeId: couponCode.id, customerId },
    });
    const promotion = await Promotion.findByPk(couponCode.promotionId);
    if (promotion?.usageLimitPerCustomer && customerUsage >= promotion.usageLimitPerCustomer) {
        return { valid: false, reason: 'Customer usage limit reached' };
    }
    return { valid: true };
}
/**
 * 4. Calculate percentage discount
 */
function calculatePercentageDiscount(amount, percentage, maxDiscount) {
    const discount = (amount * percentage) / 100;
    return maxDiscount ? Math.min(discount, maxDiscount) : discount;
}
/**
 * 5. Calculate fixed amount discount
 */
function calculateFixedDiscount(amount, discountAmount) {
    return Math.min(discountAmount, amount);
}
/**
 * 6. Apply BOGO discount
 */
function applyBogoDiscount(items, config) {
    const eligibleItems = items.filter((item) => config.sameProductRequired || config.getProductIds?.includes(item.productId));
    const totalEligibleQty = eligibleItems.reduce((sum, item) => sum + item.quantity, 0);
    const sets = Math.floor(totalEligibleQty / (config.buyQuantity + config.getQuantity));
    if (sets === 0) {
        return { discountAmount: 0, affectedItems: [] };
    }
    const maxSets = config.maxApplications ? Math.min(sets, config.maxApplications) : sets;
    const getItemsCount = maxSets * config.getQuantity;
    let discountAmount = 0;
    let remainingGetItems = getItemsCount;
    const affectedItems = [];
    for (const item of eligibleItems) {
        if (remainingGetItems <= 0)
            break;
        const itemsToDiscount = Math.min(item.quantity, remainingGetItems);
        const itemDiscount = item.unitPrice * itemsToDiscount * (config.getItemsDiscountPercentage / 100);
        discountAmount += itemDiscount;
        affectedItems.push(item.productId);
        remainingGetItems -= itemsToDiscount;
    }
    return { discountAmount, affectedItems };
}
/**
 * 7. Calculate volume discount based on quantity
 */
function calculateVolumeDiscount(quantity, unitPrice, tiers) {
    const applicableTier = tiers
        .filter((tier) => quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity))
        .sort((a, b) => b.discountPercentage - a.discountPercentage)[0];
    if (!applicableTier) {
        return { discountAmount: 0, tier: null };
    }
    const lineTotal = quantity * unitPrice;
    const discountAmount = applicableTier.discountPercentage
        ? calculatePercentageDiscount(lineTotal, applicableTier.discountPercentage)
        : applicableTier.fixedDiscountAmount || 0;
    return { discountAmount, tier: applicableTier };
}
/**
 * 8. Calculate tiered promotion discount
 */
function calculateTieredDiscount(cartTotal, totalQuantity, promotion) {
    const value = promotion.basedOn === 'AMOUNT' ? cartTotal : totalQuantity;
    const applicableTier = promotion.tiers
        .filter((tier) => value >= tier.minQuantity && (!tier.maxQuantity || value <= tier.maxQuantity))
        .sort((a, b) => b.discountPercentage - a.discountPercentage)[0];
    if (!applicableTier) {
        return 0;
    }
    return applicableTier.discountPercentage
        ? calculatePercentageDiscount(cartTotal, applicableTier.discountPercentage)
        : applicableTier.fixedDiscountAmount || 0;
}
/**
 * 9. Check minimum purchase requirement
 */
function meetsMinimumPurchase(cartTotal, minPurchase) {
    if (!minPurchase)
        return true;
    return cartTotal >= minPurchase;
}
/**
 * 10. Check minimum quantity requirement
 */
function meetsMinimumQuantity(totalQuantity, minQuantity) {
    if (!minQuantity)
        return true;
    return totalQuantity >= minQuantity;
}
/**
 * 11. Filter eligible products
 */
function filterEligibleProducts(items, applicableProductIds, excludedProductIds) {
    return items.filter((item) => {
        if (excludedProductIds?.includes(item.productId))
            return false;
        if (applicableProductIds && !applicableProductIds.includes(item.productId))
            return false;
        return true;
    });
}
/**
 * 12. Filter eligible categories
 */
function filterEligibleCategories(items, applicableCategoryIds, excludedCategoryIds) {
    return items.filter((item) => {
        if (!item.categoryId)
            return false;
        if (excludedCategoryIds?.includes(item.categoryId))
            return false;
        if (applicableCategoryIds && !applicableCategoryIds.includes(item.categoryId))
            return false;
        return true;
    });
}
/**
 * 13. Apply stacking rules - best discount
 */
function applyBestDiscount(discounts) {
    if (discounts.length === 0)
        return [];
    return [discounts.reduce((best, current) => (current.amount > best.amount ? current : best))];
}
/**
 * 14. Apply stacking rules - additive
 */
function applyAdditiveDiscounts(discounts) {
    return discounts;
}
/**
 * 15. Apply stacking rules - sequential
 */
function applySequentialDiscounts(originalTotal, discounts) {
    const sortedDiscounts = [...discounts].sort((a, b) => {
        // Priority sorting would be done based on discount priority field
        return b.amount - a.amount;
    });
    let runningTotal = originalTotal;
    const appliedDiscounts = [];
    for (const discount of sortedDiscounts) {
        const discountAmount = Math.min(discount.amount, runningTotal);
        if (discountAmount > 0) {
            appliedDiscounts.push({ ...discount, amount: discountAmount });
            runningTotal -= discountAmount;
        }
    }
    return { discounts: appliedDiscounts, finalTotal: runningTotal };
}
/**
 * 16. Check if promotion is currently active
 */
function isPromotionActive(promotion) {
    const now = new Date();
    return (promotion.status === PromotionStatus.ACTIVE &&
        now >= new Date(promotion.startDate) &&
        now <= new Date(promotion.endDate));
}
/**
 * 17. Check customer eligibility
 */
async function isCustomerEligible(customerId, promotion, customerSegmentIds) {
    switch (promotion.customerEligibility) {
        case CustomerEligibility.ALL_CUSTOMERS:
            return true;
        case CustomerEligibility.SPECIFIC_SEGMENTS:
            if (!customerSegmentIds || !promotion.customerSegmentIds)
                return false;
            return promotion.customerSegmentIds.some((segId) => customerSegmentIds.includes(segId));
        // Add more eligibility checks as needed
        default:
            return true;
    }
}
/**
 * 18. Calculate total discount for cart
 */
function calculateCartDiscount(cartItems, discounts, stackingRule) {
    const originalTotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const appliedDiscounts = [];
    for (const discount of discounts) {
        let discountAmount = 0;
        if (discount.scope === ApplicationScope.ORDER_LEVEL) {
            if (discount.discountType === DiscountType.PERCENTAGE) {
                discountAmount = calculatePercentageDiscount(originalTotal, Number(discount.value), discount.maxDiscountAmount ? Number(discount.maxDiscountAmount) : undefined);
            }
            else if (discount.discountType === DiscountType.FIXED_AMOUNT) {
                discountAmount = calculateFixedDiscount(originalTotal, Number(discount.value));
            }
        }
        else if (discount.scope === ApplicationScope.LINE_ITEM) {
            const eligibleItems = filterEligibleProducts(cartItems, discount.applicableProductIds, discount.excludedProductIds);
            for (const item of eligibleItems) {
                if (discount.discountType === DiscountType.PERCENTAGE) {
                    discountAmount += calculatePercentageDiscount(item.lineTotal, Number(discount.value));
                }
                else if (discount.discountType === DiscountType.FIXED_AMOUNT) {
                    discountAmount += calculateFixedDiscount(item.lineTotal, Number(discount.value));
                }
            }
        }
        if (discountAmount > 0) {
            appliedDiscounts.push({
                discountId: discount.id,
                discountName: discount.name,
                amount: discountAmount,
                scope: discount.scope,
            });
        }
    }
    let finalDiscounts = [];
    let totalDiscount = 0;
    switch (stackingRule) {
        case StackingRuleType.BEST_DISCOUNT:
            finalDiscounts = applyBestDiscount(appliedDiscounts);
            totalDiscount = finalDiscounts.reduce((sum, d) => sum + d.amount, 0);
            break;
        case StackingRuleType.ADDITIVE:
            finalDiscounts = applyAdditiveDiscounts(appliedDiscounts);
            totalDiscount = finalDiscounts.reduce((sum, d) => sum + d.amount, 0);
            break;
        case StackingRuleType.SEQUENTIAL:
            const result = applySequentialDiscounts(originalTotal, appliedDiscounts);
            finalDiscounts = result.discounts;
            totalDiscount = originalTotal - result.finalTotal;
            break;
        default:
            finalDiscounts = appliedDiscounts.slice(0, 1);
            totalDiscount = finalDiscounts.reduce((sum, d) => sum + d.amount, 0);
    }
    return {
        originalTotal,
        discountAmount: totalDiscount,
        finalTotal: Math.max(0, originalTotal - totalDiscount),
        appliedDiscounts: finalDiscounts,
        totalSavings: totalDiscount,
    };
}
/**
 * 19. Validate exclusion rules
 */
function validateExclusionRules(items, exclusionRule) {
    const excludedItems = [];
    for (const item of items) {
        if (exclusionRule.excludedProductIds?.includes(item.productId)) {
            excludedItems.push(item.productId);
        }
        if (item.categoryId && exclusionRule.excludedCategoryIds?.includes(item.categoryId)) {
            excludedItems.push(item.productId);
        }
    }
    return {
        valid: excludedItems.length === 0,
        excludedItems,
    };
}
/**
 * 20. Generate bulk coupon codes
 */
async function generateBulkCoupons(dto) {
    const codes = [];
    const existingCodes = new Set();
    // Fetch existing codes to avoid duplicates
    const existing = await CouponCode.findAll({
        where: { promotionId: dto.promotionId },
        attributes: ['code'],
    });
    existing.forEach((c) => existingCodes.add(c.code));
    // Generate unique codes
    while (codes.length < dto.quantity) {
        const code = generateDiscountCode(dto.pattern, dto.codeLength, dto.prefix);
        if (!existingCodes.has(code) && !codes.includes(code)) {
            codes.push(code);
        }
    }
    // Create coupon code records
    const coupons = await CouponCode.bulkCreate(codes.map((code) => ({
        code,
        promotionId: dto.promotionId,
        usageLimitPerCode: dto.usageLimitPerCode,
        expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : null,
        isActive: true,
    })));
    logger.log(`Generated ${coupons.length} coupon codes for promotion ${dto.promotionId}`);
    return coupons;
}
/**
 * 21. Validate and apply coupon code
 */
async function validateAndApplyCoupon(dto) {
    const coupon = await CouponCode.findOne({
        where: { code: dto.code.toUpperCase(), isActive: true },
        include: [Promotion],
    });
    if (!coupon) {
        return { valid: false, reason: 'Invalid coupon code' };
    }
    const validationResult = await isCouponValid(coupon, dto.customerId);
    if (!validationResult.valid) {
        return { valid: false, reason: validationResult.reason };
    }
    const promotion = coupon.promotion;
    if (!isPromotionActive(promotion)) {
        return { valid: false, reason: 'Promotion is not active' };
    }
    // Fetch associated discounts
    const discounts = await Discount.findAll({
        where: { id: { [sequelize_1.Op.in]: promotion.discountIds }, isActive: true },
    });
    // Calculate discount
    const result = calculateCartDiscount(dto.cartItems, discounts, promotion.stackingRule);
    if (result.discountAmount > 0) {
        return {
            valid: true,
            discount: {
                discountId: promotion.id,
                discountName: promotion.name,
                amount: result.discountAmount,
                scope: ApplicationScope.ORDER_LEVEL,
                couponCode: dto.code,
            },
        };
    }
    return { valid: false, reason: 'No applicable discounts found' };
}
/**
 * 22. Record coupon usage
 */
async function recordCouponUsage(couponCodeId, customerId, orderId, discountAmount) {
    const usage = await CouponUsage.create({
        couponCodeId,
        customerId,
        orderId,
        discountAmount,
        usedAt: new Date(),
    });
    // Increment usage counts
    await CouponCode.increment('usageCount', { where: { id: couponCodeId } });
    const coupon = await CouponCode.findByPk(couponCodeId);
    await Promotion.increment('totalUsageCount', { where: { id: coupon.promotionId } });
    logger.log(`Recorded coupon usage: ${couponCodeId} for order ${orderId}`);
    return usage;
}
/**
 * 23. Create flash sale promotion
 */
async function createFlashSale(dto) {
    const promotion = await Promotion.create({
        name: dto.name,
        internalCode: `FLASH_${Date.now()}`,
        promotionType: PromotionType.FLASH_SALE,
        startDate: new Date(dto.startTime),
        endDate: new Date(dto.endTime),
        status: PromotionStatus.SCHEDULED,
        customerEligibility: CustomerEligibility.ALL_CUSTOMERS,
        stackingRule: StackingRuleType.NO_STACKING,
        requiresCouponCode: false,
        usageLimitPerCustomer: dto.perCustomerLimit,
    });
    // Create associated discount
    const discount = await Discount.create({
        name: `${dto.name} - Flash Discount`,
        discountType: DiscountType.PERCENTAGE,
        value: dto.discountPercentage,
        scope: ApplicationScope.PRODUCT,
        startDate: new Date(dto.startTime),
        endDate: new Date(dto.endTime),
        applicableProductIds: dto.productIds,
        priority: 100, // High priority for flash sales
        isActive: true,
    });
    await promotion.update({ discountIds: [discount.id] });
    logger.log(`Created flash sale promotion: ${promotion.id}`);
    return promotion;
}
/**
 * 24. Get active promotions for customer
 */
async function getActivePromotionsForCustomer(customerId, customerSegmentIds) {
    const now = new Date();
    const promotions = await Promotion.findAll({
        where: {
            status: PromotionStatus.ACTIVE,
            startDate: { [sequelize_1.Op.lte]: now },
            endDate: { [sequelize_1.Op.gte]: now },
        },
    });
    const eligible = [];
    for (const promo of promotions) {
        const isEligible = await isCustomerEligible(customerId, promo, customerSegmentIds);
        if (isEligible) {
            eligible.push(promo);
        }
    }
    return eligible;
}
/**
 * 25. Calculate loyalty points discount
 */
function calculateLoyaltyPointsDiscount(points, pointValue, maxRedemption) {
    const discountAmount = points * pointValue;
    return maxRedemption ? Math.min(discountAmount, maxRedemption) : discountAmount;
}
/**
 * 26. Apply referral bonus
 */
async function applyReferralBonus(referrerId, refereeId, bonusAmount) {
    // This would create discount records or credits for both parties
    logger.log(`Applied referral bonus: Referrer ${referrerId}, Referee ${refereeId}`);
    return {
        referrerDiscount: bonusAmount,
        refereeDiscount: bonusAmount * 0.5, // Example: referee gets 50% of referrer bonus
    };
}
/**
 * 27. Calculate bundle discount
 */
function calculateBundleDiscount(bundleItems, requiredProductIds, bundleDiscount) {
    const itemProductIds = bundleItems.map((item) => item.productId);
    const hasAllRequired = requiredProductIds.every((id) => itemProductIds.includes(id));
    if (!hasAllRequired) {
        return { applicable: false, discountAmount: 0 };
    }
    const bundleTotal = bundleItems
        .filter((item) => requiredProductIds.includes(item.productId))
        .reduce((sum, item) => sum + item.lineTotal, 0);
    return {
        applicable: true,
        discountAmount: calculatePercentageDiscount(bundleTotal, bundleDiscount),
    };
}
/**
 * 28. Check promotion usage limits
 */
async function checkPromotionUsageLimits(promotionId, customerId) {
    const promotion = await Promotion.findByPk(promotionId);
    if (!promotion) {
        return { canUse: false, reason: 'Promotion not found' };
    }
    // Check total usage limit
    if (promotion.totalUsageLimit && promotion.totalUsageCount >= promotion.totalUsageLimit) {
        return { canUse: false, reason: 'Total usage limit reached' };
    }
    // Check customer usage limit
    if (promotion.usageLimitPerCustomer) {
        const customerUsage = await CouponUsage.count({
            where: { customerId },
            include: [
                {
                    model: CouponCode,
                    where: { promotionId },
                    required: true,
                },
            ],
        });
        if (customerUsage >= promotion.usageLimitPerCustomer) {
            return { canUse: false, reason: 'Customer usage limit reached' };
        }
    }
    return { canUse: true };
}
/**
 * 29. Calculate seasonal promotion discount
 */
function calculateSeasonalDiscount(cartTotal, seasonalRate, seasonStart, seasonEnd) {
    const now = new Date();
    if (now < seasonStart || now > seasonEnd) {
        return { applicable: false, discountAmount: 0 };
    }
    return {
        applicable: true,
        discountAmount: calculatePercentageDiscount(cartTotal, seasonalRate),
    };
}
/**
 * 30. Apply first-time customer discount
 */
async function applyFirstTimeCustomerDiscount(customerId, discountPercentage, cartTotal) {
    // Check if customer has previous orders
    const previousOrders = await CouponUsage.count({ where: { customerId } });
    if (previousOrders > 0) {
        return { applicable: false, discountAmount: 0 };
    }
    return {
        applicable: true,
        discountAmount: calculatePercentageDiscount(cartTotal, discountPercentage),
    };
}
/**
 * 31. Calculate category-specific promotion
 */
function calculateCategoryPromotion(items, categoryId, discountPercentage) {
    const categoryTotal = items
        .filter((item) => item.categoryId === categoryId)
        .reduce((sum, item) => sum + item.lineTotal, 0);
    return calculatePercentageDiscount(categoryTotal, discountPercentage);
}
/**
 * 32. Apply early bird discount
 */
function applyEarlyBirdDiscount(orderTime, cutoffTime, discountPercentage, cartTotal) {
    if (orderTime > cutoffTime) {
        return { applicable: false, discountAmount: 0 };
    }
    return {
        applicable: true,
        discountAmount: calculatePercentageDiscount(cartTotal, discountPercentage),
    };
}
/**
 * 33. Calculate cart abandonment recovery discount
 */
function calculateAbandonmentDiscount(abandonedCartAge, baseDiscount, maxDiscount, cartTotal) {
    // Increase discount based on cart age (in days)
    const discountPercentage = Math.min(baseDiscount + abandonedCartAge * 2, maxDiscount);
    return calculatePercentageDiscount(cartTotal, discountPercentage);
}
/**
 * 34. Validate time-limited promotion
 */
function validateTimeLimitedPromotion(promotion, currentTime) {
    const now = currentTime || new Date();
    if (now < new Date(promotion.startDate)) {
        return { valid: false, reason: 'Promotion has not started yet' };
    }
    if (now > new Date(promotion.endDate)) {
        return { valid: false, reason: 'Promotion has expired' };
    }
    return { valid: true };
}
/**
 * 35. Calculate multi-buy discount (e.g., 3 for $10)
 */
function calculateMultiBuyDiscount(quantity, unitPrice, buyQuantity, bundlePrice) {
    const sets = Math.floor(quantity / buyQuantity);
    const remainder = quantity % buyQuantity;
    const regularTotal = quantity * unitPrice;
    const discountedTotal = sets * bundlePrice + remainder * unitPrice;
    return Math.max(0, regularTotal - discountedTotal);
}
/**
 * 36. Apply spend threshold bonus
 */
function applySpendThresholdBonus(cartTotal, thresholds) {
    const applicableThreshold = thresholds
        .filter((t) => cartTotal >= t.amount)
        .sort((a, b) => b.amount - a.amount)[0];
    if (!applicableThreshold) {
        return { applicable: false, bonusAmount: 0 };
    }
    return {
        applicable: true,
        bonusAmount: applicableThreshold.bonus,
    };
}
/**
 * 37. Calculate cross-sell promotion discount
 */
function calculateCrossSellDiscount(items, primaryProductId, crossSellProductIds, discountPercentage) {
    const hasPrimary = items.some((item) => item.productId === primaryProductId);
    const hasCrossSell = items.some((item) => crossSellProductIds.includes(item.productId));
    if (!hasPrimary || !hasCrossSell) {
        return { applicable: false, discountAmount: 0 };
    }
    const crossSellTotal = items
        .filter((item) => crossSellProductIds.includes(item.productId))
        .reduce((sum, item) => sum + item.lineTotal, 0);
    return {
        applicable: true,
        discountAmount: calculatePercentageDiscount(crossSellTotal, discountPercentage),
    };
}
/**
 * 38. Deactivate expired promotions
 */
async function deactivateExpiredPromotions() {
    const now = new Date();
    const [affectedCount] = await Promotion.update({ status: PromotionStatus.EXPIRED }, {
        where: {
            status: { [sequelize_1.Op.in]: [PromotionStatus.ACTIVE, PromotionStatus.SCHEDULED] },
            endDate: { [sequelize_1.Op.lt]: now },
        },
    });
    logger.log(`Deactivated ${affectedCount} expired promotions`);
    return affectedCount;
}
/**
 * 39. Activate scheduled promotions
 */
async function activateScheduledPromotions() {
    const now = new Date();
    const [affectedCount] = await Promotion.update({ status: PromotionStatus.ACTIVE }, {
        where: {
            status: PromotionStatus.SCHEDULED,
            startDate: { [sequelize_1.Op.lte]: now },
            endDate: { [sequelize_1.Op.gte]: now },
        },
    });
    logger.log(`Activated ${affectedCount} scheduled promotions`);
    return affectedCount;
}
/**
 * 40. Generate promotion performance report
 */
async function generatePromotionPerformanceReport(promotionId, startDate, endDate) {
    const whereClause = { promotionId };
    if (startDate || endDate) {
        whereClause.usedAt = {};
        if (startDate)
            whereClause.usedAt[sequelize_1.Op.gte] = startDate;
        if (endDate)
            whereClause.usedAt[sequelize_1.Op.lte] = endDate;
    }
    const usages = await CouponUsage.findAll({
        where: whereClause,
        include: [{ model: CouponCode, where: { promotionId }, required: true }],
    });
    const totalUsage = usages.length;
    const totalDiscount = usages.reduce((sum, u) => sum + Number(u.discountAmount), 0);
    const uniqueCustomers = new Set(usages.map((u) => u.customerId)).size;
    // Note: Revenue calculation would require order data
    const totalRevenue = 0; // Placeholder
    return {
        totalUsage,
        totalRevenue,
        totalDiscount,
        uniqueCustomers,
        averageOrderValue: totalRevenue / totalUsage || 0,
        conversionRate: 0, // Placeholder - would need total visitors
    };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    Discount,
    Promotion,
    CouponCode,
    CouponUsage,
    // DTOs
    CreateDiscountDto,
    CreatePromotionDto,
    GenerateCouponCodesDto,
    ValidateCouponDto,
    CartItemDto,
    BogoConfigDto,
    VolumeDiscountTierDto,
    TieredPromotionDto,
    ApplyDiscountDto,
    CustomerSegmentPromotionDto,
    FlashSaleDto,
    ExclusionRuleDto,
    DiscountCalculationResult,
    AppliedDiscountDetail,
    // Enums
    DiscountType,
    PromotionType,
    PromotionStatus,
    CouponCodePattern,
    CustomerEligibility,
    StackingRuleType,
    ApplicationScope,
    // Functions
    generateDiscountCode,
    validateCouponCodeFormat,
    isCouponValid,
    calculatePercentageDiscount,
    calculateFixedDiscount,
    applyBogoDiscount,
    calculateVolumeDiscount,
    calculateTieredDiscount,
    meetsMinimumPurchase,
    meetsMinimumQuantity,
    filterEligibleProducts,
    filterEligibleCategories,
    applyBestDiscount,
    applyAdditiveDiscounts,
    applySequentialDiscounts,
    isPromotionActive,
    isCustomerEligible,
    calculateCartDiscount,
    validateExclusionRules,
    generateBulkCoupons,
    validateAndApplyCoupon,
    recordCouponUsage,
    createFlashSale,
    getActivePromotionsForCustomer,
    calculateLoyaltyPointsDiscount,
    applyReferralBonus,
    calculateBundleDiscount,
    checkPromotionUsageLimits,
    calculateSeasonalDiscount,
    applyFirstTimeCustomerDiscount,
    calculateCategoryPromotion,
    applyEarlyBirdDiscount,
    calculateAbandonmentDiscount,
    validateTimeLimitedPromotion,
    calculateMultiBuyDiscount,
    applySpendThresholdBonus,
    calculateCrossSellDiscount,
    deactivateExpiredPromotions,
    activateScheduledPromotions,
    generatePromotionPerformanceReport,
};
//# sourceMappingURL=discount-promotion-kit.js.map