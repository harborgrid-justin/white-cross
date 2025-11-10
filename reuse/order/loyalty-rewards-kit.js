"use strict";
/**
 * LOC: WC-ORD-LOYRWD-001
 * File: /reuse/order/loyalty-rewards-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - class-transformer
 *
 * DOWNSTREAM (imported by):
 *   - Order modules
 *   - Customer services
 *   - Marketing automation
 *   - CRM integrations
 *   - Point-of-sale systems
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
exports.LOYALTY_REWARDS_PROVIDERS = exports.PointsTransferService = exports.AnniversaryRewardService = exports.BirthdayRewardService = exports.ReferralLeaderboardService = exports.ReferralTrackingService = exports.ReferralProgramService = exports.FirstPurchaseBonusService = exports.SeasonalPromotionService = exports.PromotionApplicationService = exports.PromotionManagementService = exports.ExpirationPreventionService = exports.ExpirationPolicyService = exports.ExpirationNotificationService = exports.PointsExpirationService = exports.ConciergeService = exports.PersonalizedOfferService = exports.ExclusiveAccessService = exports.TierBenefitService = exports.TierRecertificationService = exports.TierAnniversaryService = exports.TierStatusService = exports.TierDowngradeService = exports.TierManagementService = exports.PartialRedemptionService = exports.RedemptionRecommendationService = exports.RedemptionHistoryService = exports.RedemptionValidationService = exports.PointsRedemptionService = exports.PointsForecastService = exports.EarningRateService = exports.PointsAdjustmentService = exports.PointsTransactionService = exports.PointsEarningCalculator = exports.EnrollmentChannelService = exports.BulkEnrollmentService = exports.EnrollmentEligibilityService = exports.LoyaltyEnrollmentService = exports.TierUpgradeDto = exports.TransferPointsDto = exports.RedeemPointsDto = exports.EarnPointsDto = exports.EnrollMemberDto = exports.ExpirationPolicy = exports.BenefitType = exports.PromotionType = exports.RedemptionType = exports.PointsTransactionType = exports.MemberStatus = exports.LoyaltyTier = void 0;
exports.CARRIER_CONFIGS = exports.TIER_CONFIGS = exports.LOYALTY_CONFIG = void 0;
/**
 * File: /reuse/order/loyalty-rewards-kit.ts
 * Locator: WC-ORD-LOYRWD-001
 * Purpose: Loyalty & Rewards Programs - Points, tiers, redemption
 *
 * Upstream: Independent utility module for comprehensive loyalty and rewards operations
 * Downstream: ../backend/order/*, Customer modules, Marketing services, CRM systems
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common 10.x, @nestjs/swagger 7.x
 * Exports: 37 utility functions for loyalty enrollment, points earning/redemption, tier management, rewards
 *
 * LLM Context: Production-ready loyalty and rewards toolkit for White Cross healthcare supply system.
 * Provides complete loyalty program management including member enrollment, points earning calculations,
 * points redemption, tier progression (Bronze, Silver, Gold, Platinum), tier benefits, points expiration,
 * bonus promotions, referral rewards, birthday/anniversary rewards, redemption catalog, and points transfer.
 * Built with NestJS dependency injection, comprehensive validation, and enterprise-grade error handling.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================
/**
 * Loyalty program membership tiers
 */
var LoyaltyTier;
(function (LoyaltyTier) {
    LoyaltyTier["BRONZE"] = "BRONZE";
    LoyaltyTier["SILVER"] = "SILVER";
    LoyaltyTier["GOLD"] = "GOLD";
    LoyaltyTier["PLATINUM"] = "PLATINUM";
    LoyaltyTier["DIAMOND"] = "DIAMOND";
})(LoyaltyTier || (exports.LoyaltyTier = LoyaltyTier = {}));
/**
 * Loyalty member status
 */
var MemberStatus;
(function (MemberStatus) {
    MemberStatus["ACTIVE"] = "ACTIVE";
    MemberStatus["INACTIVE"] = "INACTIVE";
    MemberStatus["SUSPENDED"] = "SUSPENDED";
    MemberStatus["PENDING"] = "PENDING";
    MemberStatus["EXPIRED"] = "EXPIRED";
    MemberStatus["CANCELLED"] = "CANCELLED";
})(MemberStatus || (exports.MemberStatus = MemberStatus = {}));
/**
 * Points transaction types
 */
var PointsTransactionType;
(function (PointsTransactionType) {
    PointsTransactionType["EARNED_PURCHASE"] = "EARNED_PURCHASE";
    PointsTransactionType["EARNED_BONUS"] = "EARNED_BONUS";
    PointsTransactionType["EARNED_REFERRAL"] = "EARNED_REFERRAL";
    PointsTransactionType["EARNED_BIRTHDAY"] = "EARNED_BIRTHDAY";
    PointsTransactionType["EARNED_ANNIVERSARY"] = "EARNED_ANNIVERSARY";
    PointsTransactionType["EARNED_PROMOTION"] = "EARNED_PROMOTION";
    PointsTransactionType["EARNED_SURVEY"] = "EARNED_SURVEY";
    PointsTransactionType["EARNED_REVIEW"] = "EARNED_REVIEW";
    PointsTransactionType["REDEEMED_PRODUCT"] = "REDEEMED_PRODUCT";
    PointsTransactionType["REDEEMED_DISCOUNT"] = "REDEEMED_DISCOUNT";
    PointsTransactionType["REDEEMED_GIFT_CARD"] = "REDEEMED_GIFT_CARD";
    PointsTransactionType["TRANSFERRED_OUT"] = "TRANSFERRED_OUT";
    PointsTransactionType["TRANSFERRED_IN"] = "TRANSFERRED_IN";
    PointsTransactionType["EXPIRED"] = "EXPIRED";
    PointsTransactionType["ADJUSTED"] = "ADJUSTED";
    PointsTransactionType["REVERSED"] = "REVERSED";
})(PointsTransactionType || (exports.PointsTransactionType = PointsTransactionType = {}));
/**
 * Redemption types
 */
var RedemptionType;
(function (RedemptionType) {
    RedemptionType["PRODUCT"] = "PRODUCT";
    RedemptionType["DISCOUNT"] = "DISCOUNT";
    RedemptionType["GIFT_CARD"] = "GIFT_CARD";
    RedemptionType["SHIPPING"] = "SHIPPING";
    RedemptionType["DONATION"] = "DONATION";
    RedemptionType["EXPERIENCE"] = "EXPERIENCE";
})(RedemptionType || (exports.RedemptionType = RedemptionType = {}));
/**
 * Promotion types
 */
var PromotionType;
(function (PromotionType) {
    PromotionType["DOUBLE_POINTS"] = "DOUBLE_POINTS";
    PromotionType["TRIPLE_POINTS"] = "TRIPLE_POINTS";
    PromotionType["BONUS_POINTS"] = "BONUS_POINTS";
    PromotionType["CATEGORY_MULTIPLIER"] = "CATEGORY_MULTIPLIER";
    PromotionType["THRESHOLD_BONUS"] = "THRESHOLD_BONUS";
    PromotionType["FIRST_PURCHASE"] = "FIRST_PURCHASE";
})(PromotionType || (exports.PromotionType = PromotionType = {}));
/**
 * Tier benefit types
 */
var BenefitType;
(function (BenefitType) {
    BenefitType["POINTS_MULTIPLIER"] = "POINTS_MULTIPLIER";
    BenefitType["EXCLUSIVE_DISCOUNT"] = "EXCLUSIVE_DISCOUNT";
    BenefitType["FREE_SHIPPING"] = "FREE_SHIPPING";
    BenefitType["EARLY_ACCESS"] = "EARLY_ACCESS";
    BenefitType["DEDICATED_SUPPORT"] = "DEDICATED_SUPPORT";
    BenefitType["GIFT"] = "GIFT";
    BenefitType["EXTENDED_RETURNS"] = "EXTENDED_RETURNS";
    BenefitType["CONCIERGE_SERVICE"] = "CONCIERGE_SERVICE";
})(BenefitType || (exports.BenefitType = BenefitType = {}));
/**
 * Points expiration policy
 */
var ExpirationPolicy;
(function (ExpirationPolicy) {
    ExpirationPolicy["FIXED_DURATION"] = "FIXED_DURATION";
    ExpirationPolicy["ROLLING_WINDOW"] = "ROLLING_WINDOW";
    ExpirationPolicy["END_OF_YEAR"] = "END_OF_YEAR";
    ExpirationPolicy["ACTIVITY_BASED"] = "ACTIVITY_BASED";
    ExpirationPolicy["NEVER_EXPIRE"] = "NEVER_EXPIRE";
})(ExpirationPolicy || (exports.ExpirationPolicy = ExpirationPolicy = {}));
// ============================================================================
// DTOs FOR API OPERATIONS
// ============================================================================
/**
 * DTO for loyalty member enrollment
 */
let EnrollMemberDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _dateOfBirth_decorators;
    let _dateOfBirth_initializers = [];
    let _dateOfBirth_extraInitializers = [];
    let _enrollmentSource_decorators;
    let _enrollmentSource_initializers = [];
    let _enrollmentSource_extraInitializers = [];
    let _initialBonus_decorators;
    let _initialBonus_initializers = [];
    let _initialBonus_extraInitializers = [];
    return _a = class EnrollMemberDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.email = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.dateOfBirth = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _dateOfBirth_initializers, void 0));
                this.enrollmentSource = (__runInitializers(this, _dateOfBirth_extraInitializers), __runInitializers(this, _enrollmentSource_initializers, void 0));
                this.initialBonus = (__runInitializers(this, _enrollmentSource_extraInitializers), __runInitializers(this, _initialBonus_initializers, void 0));
                __runInitializers(this, _initialBonus_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _email_decorators = [(0, swagger_1.ApiProperty)({ description: 'Email address', example: 'member@example.com' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEmail)()];
            _phone_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Phone number' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _dateOfBirth_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Date of birth' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _enrollmentSource_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Enrollment source channel' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _initialBonus_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Initial bonus points' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _dateOfBirth_decorators, { kind: "field", name: "dateOfBirth", static: false, private: false, access: { has: obj => "dateOfBirth" in obj, get: obj => obj.dateOfBirth, set: (obj, value) => { obj.dateOfBirth = value; } }, metadata: _metadata }, _dateOfBirth_initializers, _dateOfBirth_extraInitializers);
            __esDecorate(null, null, _enrollmentSource_decorators, { kind: "field", name: "enrollmentSource", static: false, private: false, access: { has: obj => "enrollmentSource" in obj, get: obj => obj.enrollmentSource, set: (obj, value) => { obj.enrollmentSource = value; } }, metadata: _metadata }, _enrollmentSource_initializers, _enrollmentSource_extraInitializers);
            __esDecorate(null, null, _initialBonus_decorators, { kind: "field", name: "initialBonus", static: false, private: false, access: { has: obj => "initialBonus" in obj, get: obj => obj.initialBonus, set: (obj, value) => { obj.initialBonus = value; } }, metadata: _metadata }, _initialBonus_initializers, _initialBonus_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.EnrollMemberDto = EnrollMemberDto;
/**
 * DTO for earning points
 */
let EarnPointsDto = (() => {
    var _a;
    let _memberId_decorators;
    let _memberId_initializers = [];
    let _memberId_extraInitializers = [];
    let _transactionType_decorators;
    let _transactionType_initializers = [];
    let _transactionType_extraInitializers = [];
    let _points_decorators;
    let _points_initializers = [];
    let _points_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _promotionId_decorators;
    let _promotionId_initializers = [];
    let _promotionId_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    return _a = class EarnPointsDto {
            constructor() {
                this.memberId = __runInitializers(this, _memberId_initializers, void 0);
                this.transactionType = (__runInitializers(this, _memberId_extraInitializers), __runInitializers(this, _transactionType_initializers, void 0));
                this.points = (__runInitializers(this, _transactionType_extraInitializers), __runInitializers(this, _points_initializers, void 0));
                this.orderId = (__runInitializers(this, _points_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
                this.promotionId = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _promotionId_initializers, void 0));
                this.description = (__runInitializers(this, _promotionId_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                __runInitializers(this, _expirationDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _memberId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Member ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _transactionType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transaction type', enum: PointsTransactionType }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEnum)(PointsTransactionType)];
            _points_decorators = [(0, swagger_1.ApiProperty)({ description: 'Points to earn' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _orderId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Associated order ID' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _promotionId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Promotion ID if applicable' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Description' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _expirationDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Expiration date for earned points' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            __esDecorate(null, null, _memberId_decorators, { kind: "field", name: "memberId", static: false, private: false, access: { has: obj => "memberId" in obj, get: obj => obj.memberId, set: (obj, value) => { obj.memberId = value; } }, metadata: _metadata }, _memberId_initializers, _memberId_extraInitializers);
            __esDecorate(null, null, _transactionType_decorators, { kind: "field", name: "transactionType", static: false, private: false, access: { has: obj => "transactionType" in obj, get: obj => obj.transactionType, set: (obj, value) => { obj.transactionType = value; } }, metadata: _metadata }, _transactionType_initializers, _transactionType_extraInitializers);
            __esDecorate(null, null, _points_decorators, { kind: "field", name: "points", static: false, private: false, access: { has: obj => "points" in obj, get: obj => obj.points, set: (obj, value) => { obj.points = value; } }, metadata: _metadata }, _points_initializers, _points_extraInitializers);
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
            __esDecorate(null, null, _promotionId_decorators, { kind: "field", name: "promotionId", static: false, private: false, access: { has: obj => "promotionId" in obj, get: obj => obj.promotionId, set: (obj, value) => { obj.promotionId = value; } }, metadata: _metadata }, _promotionId_initializers, _promotionId_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.EarnPointsDto = EarnPointsDto;
/**
 * DTO for redeeming points
 */
let RedeemPointsDto = (() => {
    var _a;
    let _memberId_decorators;
    let _memberId_initializers = [];
    let _memberId_extraInitializers = [];
    let _itemId_decorators;
    let _itemId_initializers = [];
    let _itemId_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _shippingAddress_decorators;
    let _shippingAddress_initializers = [];
    let _shippingAddress_extraInitializers = [];
    return _a = class RedeemPointsDto {
            constructor() {
                this.memberId = __runInitializers(this, _memberId_initializers, void 0);
                this.itemId = (__runInitializers(this, _memberId_extraInitializers), __runInitializers(this, _itemId_initializers, void 0));
                this.quantity = (__runInitializers(this, _itemId_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
                this.shippingAddress = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _shippingAddress_initializers, void 0));
                __runInitializers(this, _shippingAddress_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _memberId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Member ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _itemId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Redemption item ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _quantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity to redeem' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _shippingAddress_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Shipping address for physical items' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _memberId_decorators, { kind: "field", name: "memberId", static: false, private: false, access: { has: obj => "memberId" in obj, get: obj => obj.memberId, set: (obj, value) => { obj.memberId = value; } }, metadata: _metadata }, _memberId_initializers, _memberId_extraInitializers);
            __esDecorate(null, null, _itemId_decorators, { kind: "field", name: "itemId", static: false, private: false, access: { has: obj => "itemId" in obj, get: obj => obj.itemId, set: (obj, value) => { obj.itemId = value; } }, metadata: _metadata }, _itemId_initializers, _itemId_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _shippingAddress_decorators, { kind: "field", name: "shippingAddress", static: false, private: false, access: { has: obj => "shippingAddress" in obj, get: obj => obj.shippingAddress, set: (obj, value) => { obj.shippingAddress = value; } }, metadata: _metadata }, _shippingAddress_initializers, _shippingAddress_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RedeemPointsDto = RedeemPointsDto;
/**
 * DTO for points transfer
 */
let TransferPointsDto = (() => {
    var _a;
    let _fromMemberId_decorators;
    let _fromMemberId_initializers = [];
    let _fromMemberId_extraInitializers = [];
    let _toMemberId_decorators;
    let _toMemberId_initializers = [];
    let _toMemberId_extraInitializers = [];
    let _points_decorators;
    let _points_initializers = [];
    let _points_extraInitializers = [];
    let _note_decorators;
    let _note_initializers = [];
    let _note_extraInitializers = [];
    return _a = class TransferPointsDto {
            constructor() {
                this.fromMemberId = __runInitializers(this, _fromMemberId_initializers, void 0);
                this.toMemberId = (__runInitializers(this, _fromMemberId_extraInitializers), __runInitializers(this, _toMemberId_initializers, void 0));
                this.points = (__runInitializers(this, _toMemberId_extraInitializers), __runInitializers(this, _points_initializers, void 0));
                this.note = (__runInitializers(this, _points_extraInitializers), __runInitializers(this, _note_initializers, void 0));
                __runInitializers(this, _note_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fromMemberId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Source member ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _toMemberId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Destination member ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _points_decorators = [(0, swagger_1.ApiProperty)({ description: 'Points to transfer' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1)];
            _note_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Transfer reason/note' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(200)];
            __esDecorate(null, null, _fromMemberId_decorators, { kind: "field", name: "fromMemberId", static: false, private: false, access: { has: obj => "fromMemberId" in obj, get: obj => obj.fromMemberId, set: (obj, value) => { obj.fromMemberId = value; } }, metadata: _metadata }, _fromMemberId_initializers, _fromMemberId_extraInitializers);
            __esDecorate(null, null, _toMemberId_decorators, { kind: "field", name: "toMemberId", static: false, private: false, access: { has: obj => "toMemberId" in obj, get: obj => obj.toMemberId, set: (obj, value) => { obj.toMemberId = value; } }, metadata: _metadata }, _toMemberId_initializers, _toMemberId_extraInitializers);
            __esDecorate(null, null, _points_decorators, { kind: "field", name: "points", static: false, private: false, access: { has: obj => "points" in obj, get: obj => obj.points, set: (obj, value) => { obj.points = value; } }, metadata: _metadata }, _points_initializers, _points_extraInitializers);
            __esDecorate(null, null, _note_decorators, { kind: "field", name: "note", static: false, private: false, access: { has: obj => "note" in obj, get: obj => obj.note, set: (obj, value) => { obj.note = value; } }, metadata: _metadata }, _note_initializers, _note_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TransferPointsDto = TransferPointsDto;
/**
 * DTO for tier upgrade
 */
let TierUpgradeDto = (() => {
    var _a;
    let _memberId_decorators;
    let _memberId_initializers = [];
    let _memberId_extraInitializers = [];
    let _newTier_decorators;
    let _newTier_initializers = [];
    let _newTier_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _manualOverride_decorators;
    let _manualOverride_initializers = [];
    let _manualOverride_extraInitializers = [];
    return _a = class TierUpgradeDto {
            constructor() {
                this.memberId = __runInitializers(this, _memberId_initializers, void 0);
                this.newTier = (__runInitializers(this, _memberId_extraInitializers), __runInitializers(this, _newTier_initializers, void 0));
                this.reason = (__runInitializers(this, _newTier_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.manualOverride = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _manualOverride_initializers, void 0));
                __runInitializers(this, _manualOverride_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _memberId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Member ID' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _newTier_decorators = [(0, swagger_1.ApiProperty)({ description: 'New tier', enum: LoyaltyTier }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEnum)(LoyaltyTier)];
            _reason_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Reason for upgrade' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _manualOverride_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Manual override (bypass requirements)' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _memberId_decorators, { kind: "field", name: "memberId", static: false, private: false, access: { has: obj => "memberId" in obj, get: obj => obj.memberId, set: (obj, value) => { obj.memberId = value; } }, metadata: _metadata }, _memberId_initializers, _memberId_extraInitializers);
            __esDecorate(null, null, _newTier_decorators, { kind: "field", name: "newTier", static: false, private: false, access: { has: obj => "newTier" in obj, get: obj => obj.newTier, set: (obj, value) => { obj.newTier = value; } }, metadata: _metadata }, _newTier_initializers, _newTier_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _manualOverride_decorators, { kind: "field", name: "manualOverride", static: false, private: false, access: { has: obj => "manualOverride" in obj, get: obj => obj.manualOverride, set: (obj, value) => { obj.manualOverride = value; } }, metadata: _metadata }, _manualOverride_initializers, _manualOverride_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TierUpgradeDto = TierUpgradeDto;
// ============================================================================
// 1-4: LOYALTY PROGRAM ENROLLMENT FUNCTIONS
// ============================================================================
/**
 * 1. Service for enrolling new loyalty members
 */
let LoyaltyEnrollmentService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LoyaltyEnrollmentService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(LoyaltyEnrollmentService.name);
        }
        async enrollMember(dto) {
            this.logger.log(`Enrolling new loyalty member for customer: ${dto.customerId}`);
            // Check for existing membership
            const existingMember = await this.findMemberByCustomerId(dto.customerId);
            if (existingMember) {
                throw new common_1.ConflictException('Customer is already enrolled in loyalty program');
            }
            const member = {
                memberId: this.generateMemberId(),
                customerId: dto.customerId,
                memberNumber: this.generateMemberNumber(),
                enrollmentDate: new Date(),
                tier: LoyaltyTier.BRONZE,
                status: MemberStatus.ACTIVE,
                pointsBalance: dto.initialBonus || 0,
                lifetimePoints: dto.initialBonus || 0,
                tierQualifyingPoints: 0,
                tierStartDate: new Date(),
                email: dto.email,
                phone: dto.phone,
                dateOfBirth: dto.dateOfBirth,
                anniversaryDate: new Date(),
            };
            // Award welcome bonus
            if (dto.initialBonus) {
                await this.recordPointsTransaction({
                    memberId: member.memberId,
                    transactionType: PointsTransactionType.EARNED_BONUS,
                    points: dto.initialBonus,
                    description: 'Welcome bonus',
                });
            }
            this.logger.log(`Successfully enrolled member: ${member.memberNumber}`);
            return member;
        }
        generateMemberId() {
            return `MEM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        generateMemberNumber() {
            return `LM${Date.now().toString().slice(-8)}`;
        }
        async findMemberByCustomerId(customerId) {
            // Mock implementation - would query database
            return null;
        }
        async recordPointsTransaction(transaction) {
            this.logger.debug(`Recording points transaction: ${transaction.points} points`);
        }
    };
    __setFunctionName(_classThis, "LoyaltyEnrollmentService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LoyaltyEnrollmentService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LoyaltyEnrollmentService = _classThis;
})();
exports.LoyaltyEnrollmentService = LoyaltyEnrollmentService;
/**
 * 2. Service for validating enrollment eligibility
 */
let EnrollmentEligibilityService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EnrollmentEligibilityService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(EnrollmentEligibilityService.name);
        }
        async validateEnrollmentEligibility(customerId, email) {
            this.logger.log(`Validating enrollment eligibility for customer: ${customerId}`);
            const reasons = [];
            let eligible = true;
            // Check if already enrolled
            const existingMember = await this.checkExistingMembership(customerId, email);
            if (existingMember) {
                eligible = false;
                reasons.push('Customer already enrolled in loyalty program');
            }
            // Check customer account status
            const customerActive = await this.isCustomerActive(customerId);
            if (!customerActive) {
                eligible = false;
                reasons.push('Customer account is not active');
            }
            // Check fraud/blacklist status
            const blacklisted = await this.isBlacklisted(email);
            if (blacklisted) {
                eligible = false;
                reasons.push('Email address is not eligible');
            }
            // Check minimum purchase history
            const meetsMinimumPurchase = await this.checkMinimumPurchaseHistory(customerId);
            if (!meetsMinimumPurchase) {
                reasons.push('Warning: No purchase history - tier benefits may be limited');
            }
            return { eligible, reasons };
        }
        async checkExistingMembership(customerId, email) {
            // Mock implementation
            return false;
        }
        async isCustomerActive(customerId) {
            // Mock implementation
            return true;
        }
        async isBlacklisted(email) {
            // Mock implementation
            return false;
        }
        async checkMinimumPurchaseHistory(customerId) {
            // Mock implementation
            return true;
        }
    };
    __setFunctionName(_classThis, "EnrollmentEligibilityService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EnrollmentEligibilityService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EnrollmentEligibilityService = _classThis;
})();
exports.EnrollmentEligibilityService = EnrollmentEligibilityService;
/**
 * 3. Service for bulk member enrollment
 */
let BulkEnrollmentService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var BulkEnrollmentService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(BulkEnrollmentService.name);
        }
        async bulkEnrollMembers(enrollments) {
            this.logger.log(`Processing bulk enrollment for ${enrollments.length} members`);
            let successful = 0;
            let failed = 0;
            const errors = [];
            for (const enrollment of enrollments) {
                try {
                    await this.enrollSingleMember(enrollment);
                    successful++;
                }
                catch (error) {
                    failed++;
                    errors.push({
                        customerId: enrollment.customerId,
                        email: enrollment.email,
                        error: error.message,
                    });
                }
            }
            this.logger.log(`Bulk enrollment complete: ${successful} successful, ${failed} failed`);
            return { successful, failed, errors };
        }
        async enrollSingleMember(dto) {
            // Implementation would use LoyaltyEnrollmentService
            this.logger.debug(`Enrolling member: ${dto.email}`);
        }
    };
    __setFunctionName(_classThis, "BulkEnrollmentService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BulkEnrollmentService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BulkEnrollmentService = _classThis;
})();
exports.BulkEnrollmentService = BulkEnrollmentService;
/**
 * 4. Service for enrollment channel tracking
 */
let EnrollmentChannelService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EnrollmentChannelService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(EnrollmentChannelService.name);
        }
        async trackEnrollmentSource(memberId, source, metadata) {
            this.logger.log(`Tracking enrollment source for member: ${memberId}`);
            const channelData = {
                memberId,
                source,
                metadata,
                timestamp: new Date(),
                ipAddress: metadata?.ipAddress,
                userAgent: metadata?.userAgent,
                referrer: metadata?.referrer,
            };
            await this.saveChannelData(channelData);
        }
        async getEnrollmentSourceAnalytics(startDate, endDate) {
            this.logger.log(`Fetching enrollment analytics from ${startDate} to ${endDate}`);
            // Mock analytics data
            return {
                'web': 450,
                'mobile': 320,
                'in-store': 180,
                'referral': 95,
                'social': 67,
            };
        }
        async saveChannelData(data) {
            this.logger.debug('Saving enrollment channel data');
        }
    };
    __setFunctionName(_classThis, "EnrollmentChannelService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EnrollmentChannelService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EnrollmentChannelService = _classThis;
})();
exports.EnrollmentChannelService = EnrollmentChannelService;
// ============================================================================
// 5-9: POINTS EARNING CALCULATIONS
// ============================================================================
/**
 * 5. Service for calculating points earned from purchases
 */
let PointsEarningCalculator = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PointsEarningCalculator = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(PointsEarningCalculator.name);
        }
        async calculatePurchasePoints(memberId, purchaseAmount, categoryId, productIds) {
            this.logger.log(`Calculating points for member: ${memberId}, amount: ${purchaseAmount}`);
            // Get member tier for multiplier
            const member = await this.getMember(memberId);
            const tierConfig = await this.getTierConfiguration(member.tier);
            // Base points calculation (1 point per dollar)
            let basePoints = Math.floor(purchaseAmount);
            // Apply tier multiplier
            basePoints = Math.floor(basePoints * tierConfig.pointsMultiplier);
            // Check for active promotions
            const promotions = await this.getActivePromotions(member.tier, categoryId, productIds);
            let bonusPoints = 0;
            const appliedPromotions = [];
            for (const promo of promotions) {
                const promoPoints = this.calculatePromotionBonus(promo, purchaseAmount, basePoints);
                bonusPoints += promoPoints;
                appliedPromotions.push(promo.promotionId);
            }
            const totalPoints = basePoints + bonusPoints;
            return { basePoints, bonusPoints, totalPoints, appliedPromotions };
        }
        calculatePromotionBonus(promo, amount, basePoints) {
            switch (promo.promotionType) {
                case PromotionType.DOUBLE_POINTS:
                    return basePoints;
                case PromotionType.TRIPLE_POINTS:
                    return basePoints * 2;
                case PromotionType.BONUS_POINTS:
                    return promo.bonusPoints || 0;
                case PromotionType.CATEGORY_MULTIPLIER:
                    return Math.floor(basePoints * ((promo.multiplier || 1) - 1));
                case PromotionType.THRESHOLD_BONUS:
                    return amount >= (promo.thresholdAmount || 0) ? (promo.bonusPoints || 0) : 0;
                default:
                    return 0;
            }
        }
        async getMember(memberId) {
            // Mock implementation
            return {
                memberId,
                tier: LoyaltyTier.SILVER,
                pointsBalance: 1000,
            };
        }
        async getTierConfiguration(tier) {
            // Mock implementation
            return {
                tier,
                minPoints: 0,
                pointsMultiplier: tier === LoyaltyTier.PLATINUM ? 2.0 : tier === LoyaltyTier.GOLD ? 1.5 : 1.0,
                benefits: [],
            };
        }
        async getActivePromotions(tier, categoryId, productIds) {
            // Mock implementation
            return [];
        }
    };
    __setFunctionName(_classThis, "PointsEarningCalculator");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PointsEarningCalculator = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PointsEarningCalculator = _classThis;
})();
exports.PointsEarningCalculator = PointsEarningCalculator;
/**
 * 6. Service for recording points transactions
 */
let PointsTransactionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PointsTransactionService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(PointsTransactionService.name);
        }
        async recordEarnTransaction(dto) {
            this.logger.log(`Recording earn transaction: ${dto.points} points for member ${dto.memberId}`);
            // Validate member
            const member = await this.getMember(dto.memberId);
            if (!member) {
                throw new common_1.NotFoundException('Loyalty member not found');
            }
            if (member.status !== MemberStatus.ACTIVE) {
                throw new common_1.BadRequestException('Member account is not active');
            }
            // Calculate expiration date
            const expirationDate = dto.expirationDate || this.calculateExpirationDate(member.tier);
            // Create transaction
            const transaction = {
                transactionId: this.generateTransactionId(),
                memberId: dto.memberId,
                transactionType: dto.transactionType,
                points: dto.points,
                balanceAfter: member.pointsBalance + dto.points,
                orderId: dto.orderId,
                promotionId: dto.promotionId,
                expirationDate,
                description: dto.description || this.getDefaultDescription(dto.transactionType),
                createdAt: new Date(),
            };
            // Update member balance
            await this.updateMemberBalance(dto.memberId, dto.points);
            this.logger.log(`Transaction recorded: ${transaction.transactionId}`);
            return transaction;
        }
        generateTransactionId() {
            return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        calculateExpirationDate(tier) {
            const months = tier === LoyaltyTier.PLATINUM ? 24 : tier === LoyaltyTier.GOLD ? 18 : 12;
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + months);
            return expiryDate;
        }
        getDefaultDescription(type) {
            const descriptions = {
                [PointsTransactionType.EARNED_PURCHASE]: 'Points earned from purchase',
                [PointsTransactionType.EARNED_BONUS]: 'Bonus points awarded',
                [PointsTransactionType.EARNED_REFERRAL]: 'Referral reward points',
                [PointsTransactionType.EARNED_BIRTHDAY]: 'Birthday reward',
                [PointsTransactionType.EARNED_ANNIVERSARY]: 'Anniversary reward',
            };
            return descriptions[type] || 'Points transaction';
        }
        async getMember(memberId) {
            // Mock implementation
            return {
                memberId,
                status: MemberStatus.ACTIVE,
                pointsBalance: 500,
                tier: LoyaltyTier.SILVER,
            };
        }
        async updateMemberBalance(memberId, points) {
            this.logger.debug(`Updating member balance: +${points} points`);
        }
    };
    __setFunctionName(_classThis, "PointsTransactionService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PointsTransactionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PointsTransactionService = _classThis;
})();
exports.PointsTransactionService = PointsTransactionService;
/**
 * 7. Service for points adjustment and corrections
 */
let PointsAdjustmentService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PointsAdjustmentService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(PointsAdjustmentService.name);
        }
        async adjustPoints(memberId, points, reason, authorizedBy) {
            this.logger.log(`Adjusting points for member: ${memberId}, adjustment: ${points}`);
            const member = await this.getMember(memberId);
            if (!member) {
                throw new common_1.NotFoundException('Loyalty member not found');
            }
            // Validate adjustment doesn't result in negative balance
            if (member.pointsBalance + points < 0) {
                throw new common_1.BadRequestException('Adjustment would result in negative points balance');
            }
            const transaction = {
                transactionId: `ADJ-${Date.now()}`,
                memberId,
                transactionType: PointsTransactionType.ADJUSTED,
                points,
                balanceAfter: member.pointsBalance + points,
                description: `Admin adjustment: ${reason} (by ${authorizedBy})`,
                metadata: { authorizedBy, reason },
                createdAt: new Date(),
            };
            await this.saveTransaction(transaction);
            return transaction;
        }
        async reverseTransaction(transactionId, reason) {
            this.logger.log(`Reversing transaction: ${transactionId}`);
            const originalTxn = await this.getTransaction(transactionId);
            if (!originalTxn) {
                throw new common_1.NotFoundException('Original transaction not found');
            }
            const reversalTxn = {
                transactionId: `REV-${Date.now()}`,
                memberId: originalTxn.memberId,
                transactionType: PointsTransactionType.REVERSED,
                points: -originalTxn.points,
                balanceAfter: 0, // Will be calculated
                description: `Reversal of ${transactionId}: ${reason}`,
                metadata: { originalTransactionId: transactionId, reason },
                createdAt: new Date(),
            };
            await this.saveTransaction(reversalTxn);
            return reversalTxn;
        }
        async getMember(memberId) {
            return { memberId, pointsBalance: 1000 };
        }
        async getTransaction(transactionId) {
            return null;
        }
        async saveTransaction(transaction) {
            this.logger.debug('Saving transaction');
        }
    };
    __setFunctionName(_classThis, "PointsAdjustmentService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PointsAdjustmentService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PointsAdjustmentService = _classThis;
})();
exports.PointsAdjustmentService = PointsAdjustmentService;
/**
 * 8. Service for points earning rate management
 */
let EarningRateService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EarningRateService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(EarningRateService.name);
        }
        async getEarningRate(tier, categoryId) {
            this.logger.log(`Getting earning rate for tier: ${tier}, category: ${categoryId}`);
            const baseTierRates = {
                [LoyaltyTier.BRONZE]: 1.0,
                [LoyaltyTier.SILVER]: 1.25,
                [LoyaltyTier.GOLD]: 1.5,
                [LoyaltyTier.PLATINUM]: 2.0,
                [LoyaltyTier.DIAMOND]: 3.0,
            };
            let rate = baseTierRates[tier];
            // Apply category bonuses
            if (categoryId) {
                const categoryBonus = await this.getCategoryBonus(categoryId);
                rate += categoryBonus;
            }
            return rate;
        }
        async updateEarningRate(tier, newRate) {
            this.logger.log(`Updating earning rate for tier: ${tier} to ${newRate}`);
            if (newRate < 0 || newRate > 10) {
                throw new common_1.BadRequestException('Earning rate must be between 0 and 10');
            }
            await this.saveEarningRate(tier, newRate);
        }
        async getCategoryBonus(categoryId) {
            // Mock implementation - could return category-specific bonuses
            return 0;
        }
        async saveEarningRate(tier, rate) {
            this.logger.debug(`Saving earning rate: ${tier} = ${rate}`);
        }
    };
    __setFunctionName(_classThis, "EarningRateService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EarningRateService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EarningRateService = _classThis;
})();
exports.EarningRateService = EarningRateService;
/**
 * 9. Service for points forecasting
 */
let PointsForecastService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PointsForecastService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(PointsForecastService.name);
        }
        async forecastPointsEarning(memberId, projectedSpend, months) {
            this.logger.log(`Forecasting points for member: ${memberId} over ${months} months`);
            const member = await this.getMember(memberId);
            const monthlyPoints = [];
            let totalPoints = member.pointsBalance;
            for (let i = 0; i < months; i++) {
                const earnRate = await this.getEarningRate(member.tier);
                const monthPoints = Math.floor(projectedSpend * earnRate);
                monthlyPoints.push(monthPoints);
                totalPoints += monthPoints;
            }
            const projectedTier = this.determineTier(totalPoints);
            return { monthlyPoints, totalPoints, projectedTier };
        }
        async getMember(memberId) {
            return { memberId, tier: LoyaltyTier.SILVER, pointsBalance: 500 };
        }
        async getEarningRate(tier) {
            return tier === LoyaltyTier.PLATINUM ? 2.0 : 1.0;
        }
        determineTier(points) {
            if (points >= 10000)
                return LoyaltyTier.PLATINUM;
            if (points >= 5000)
                return LoyaltyTier.GOLD;
            if (points >= 2000)
                return LoyaltyTier.SILVER;
            return LoyaltyTier.BRONZE;
        }
    };
    __setFunctionName(_classThis, "PointsForecastService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PointsForecastService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PointsForecastService = _classThis;
})();
exports.PointsForecastService = PointsForecastService;
// ============================================================================
// 10-14: POINTS REDEMPTION FUNCTIONS
// ============================================================================
/**
 * 10. Service for points redemption processing
 */
let PointsRedemptionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PointsRedemptionService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(PointsRedemptionService.name);
        }
        async redeemPoints(dto) {
            this.logger.log(`Processing redemption for member: ${dto.memberId}, item: ${dto.itemId}`);
            // Validate member and balance
            const member = await this.getMember(dto.memberId);
            if (!member) {
                throw new common_1.NotFoundException('Loyalty member not found');
            }
            // Get redemption item
            const item = await this.getRedemptionItem(dto.itemId);
            if (!item) {
                throw new common_1.NotFoundException('Redemption item not found');
            }
            if (!item.isActive) {
                throw new common_1.BadRequestException('Redemption item is not currently available');
            }
            const totalPointsCost = item.pointsCost * dto.quantity;
            // Check sufficient balance
            if (member.pointsBalance < totalPointsCost) {
                throw new common_1.BadRequestException(`Insufficient points. Required: ${totalPointsCost}, Available: ${member.pointsBalance}`);
            }
            // Check tier restrictions
            if (item.tierRestrictions && !item.tierRestrictions.includes(member.tier)) {
                throw new common_1.BadRequestException('Your tier does not have access to this redemption item');
            }
            // Check stock
            if (item.stockQuantity !== undefined && item.stockQuantity < dto.quantity) {
                throw new common_1.BadRequestException('Insufficient stock for this redemption');
            }
            // Process redemption
            const redemptionId = this.generateRedemptionId();
            await this.deductPoints(dto.memberId, totalPointsCost, redemptionId);
            await this.createRedemptionOrder(redemptionId, dto, item);
            this.logger.log(`Redemption successful: ${redemptionId}`);
            return {
                success: true,
                redemptionId,
                pointsDeducted: totalPointsCost,
            };
        }
        generateRedemptionId() {
            return `RED-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        async getMember(memberId) {
            return {
                memberId,
                tier: LoyaltyTier.GOLD,
                pointsBalance: 5000,
                status: MemberStatus.ACTIVE,
            };
        }
        async getRedemptionItem(itemId) {
            return {
                itemId,
                itemCode: 'GIFT100',
                name: '$100 Gift Card',
                description: 'Redeemable gift card',
                redemptionType: RedemptionType.GIFT_CARD,
                pointsCost: 10000,
                isActive: true,
                category: 'gift_cards',
            };
        }
        async deductPoints(memberId, points, redemptionId) {
            this.logger.debug(`Deducting ${points} points from member ${memberId}`);
        }
        async createRedemptionOrder(redemptionId, dto, item) {
            this.logger.debug(`Creating redemption order: ${redemptionId}`);
        }
    };
    __setFunctionName(_classThis, "PointsRedemptionService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PointsRedemptionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PointsRedemptionService = _classThis;
})();
exports.PointsRedemptionService = PointsRedemptionService;
/**
 * 11. Service for redemption validation
 */
let RedemptionValidationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RedemptionValidationService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(RedemptionValidationService.name);
        }
        async validateRedemption(memberId, itemId, quantity) {
            this.logger.log(`Validating redemption: member=${memberId}, item=${itemId}`);
            const errors = [];
            const warnings = [];
            // Check member status
            const member = await this.getMember(memberId);
            if (!member) {
                errors.push('Member not found');
                return { valid: false, errors, warnings };
            }
            if (member.status !== MemberStatus.ACTIVE) {
                errors.push('Member account is not active');
            }
            // Check item availability
            const item = await this.getRedemptionItem(itemId);
            if (!item) {
                errors.push('Redemption item not found');
                return { valid: false, errors, warnings };
            }
            if (!item.isActive) {
                errors.push('Item is not currently available for redemption');
            }
            // Check points balance
            const requiredPoints = item.pointsCost * quantity;
            if (member.pointsBalance < requiredPoints) {
                errors.push(`Insufficient points (need ${requiredPoints}, have ${member.pointsBalance})`);
            }
            // Check expiring points
            const expiringPoints = await this.getExpiringPoints(memberId, 30);
            if (expiringPoints > 0) {
                warnings.push(`You have ${expiringPoints} points expiring in the next 30 days`);
            }
            return {
                valid: errors.length === 0,
                errors,
                warnings,
            };
        }
        async getMember(memberId) {
            return { memberId, status: MemberStatus.ACTIVE, pointsBalance: 5000 };
        }
        async getRedemptionItem(itemId) {
            return { itemId, isActive: true, pointsCost: 1000 };
        }
        async getExpiringPoints(memberId, days) {
            return 0;
        }
    };
    __setFunctionName(_classThis, "RedemptionValidationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RedemptionValidationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RedemptionValidationService = _classThis;
})();
exports.RedemptionValidationService = RedemptionValidationService;
/**
 * 12. Service for redemption history tracking
 */
let RedemptionHistoryService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RedemptionHistoryService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(RedemptionHistoryService.name);
        }
        async getRedemptionHistory(memberId, limit = 10, offset = 0) {
            this.logger.log(`Fetching redemption history for member: ${memberId}`);
            const redemptions = await this.fetchRedemptions(memberId, limit, offset);
            const total = await this.countRedemptions(memberId);
            return { redemptions, total };
        }
        async getRedemptionDetails(redemptionId) {
            this.logger.log(`Fetching details for redemption: ${redemptionId}`);
            const redemption = await this.findRedemption(redemptionId);
            if (!redemption) {
                throw new common_1.NotFoundException('Redemption not found');
            }
            return redemption;
        }
        async cancelRedemption(redemptionId, reason) {
            this.logger.log(`Cancelling redemption: ${redemptionId}`);
            const redemption = await this.findRedemption(redemptionId);
            if (!redemption) {
                throw new common_1.NotFoundException('Redemption not found');
            }
            // Refund points
            await this.refundPoints(redemption.memberId, redemption.pointsDeducted, redemptionId);
            // Update redemption status
            await this.updateRedemptionStatus(redemptionId, 'CANCELLED', reason);
        }
        async fetchRedemptions(memberId, limit, offset) {
            return [];
        }
        async countRedemptions(memberId) {
            return 0;
        }
        async findRedemption(redemptionId) {
            return null;
        }
        async refundPoints(memberId, points, redemptionId) {
            this.logger.debug(`Refunding ${points} points to member ${memberId}`);
        }
        async updateRedemptionStatus(redemptionId, status, reason) {
            this.logger.debug(`Updating redemption status: ${redemptionId} -> ${status}`);
        }
    };
    __setFunctionName(_classThis, "RedemptionHistoryService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RedemptionHistoryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RedemptionHistoryService = _classThis;
})();
exports.RedemptionHistoryService = RedemptionHistoryService;
/**
 * 13. Service for redemption recommendation engine
 */
let RedemptionRecommendationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RedemptionRecommendationService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(RedemptionRecommendationService.name);
        }
        async getPersonalizedRecommendations(memberId, limit = 5) {
            this.logger.log(`Generating personalized recommendations for member: ${memberId}`);
            const member = await this.getMember(memberId);
            const purchaseHistory = await this.getPurchaseHistory(memberId);
            const redemptionHistory = await this.getRedemptionHistory(memberId);
            // Generate recommendations based on:
            // 1. Points balance
            // 2. Tier level
            // 3. Purchase history
            // 4. Previous redemptions
            // 5. Trending items
            const recommendations = await this.calculateRecommendations(member, purchaseHistory, redemptionHistory, limit);
            return recommendations;
        }
        async getBestValueRedemptions(memberId, maxPoints) {
            this.logger.log(`Finding best value redemptions for member: ${memberId}`);
            const member = await this.getMember(memberId);
            const maxPointsToUse = maxPoints || member.pointsBalance;
            const items = await this.getAllRedemptionItems();
            // Calculate value ratio (cashValue / pointsCost)
            const itemsWithValue = items
                .filter(item => item.isActive && item.pointsCost <= maxPointsToUse)
                .map(item => ({
                ...item,
                valueRatio: (item.cashValue || 0) / item.pointsCost,
            }))
                .sort((a, b) => b.valueRatio - a.valueRatio);
            return itemsWithValue.slice(0, 10);
        }
        async getMember(memberId) {
            return { memberId, pointsBalance: 5000, tier: LoyaltyTier.GOLD };
        }
        async getPurchaseHistory(memberId) {
            return [];
        }
        async getRedemptionHistory(memberId) {
            return [];
        }
        async calculateRecommendations(member, purchases, redemptions, limit) {
            return [];
        }
        async getAllRedemptionItems() {
            return [];
        }
    };
    __setFunctionName(_classThis, "RedemptionRecommendationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RedemptionRecommendationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RedemptionRecommendationService = _classThis;
})();
exports.RedemptionRecommendationService = RedemptionRecommendationService;
/**
 * 14. Service for partial redemption support
 */
let PartialRedemptionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PartialRedemptionService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(PartialRedemptionService.name);
        }
        async redeemPartialPoints(memberId, orderId, pointsToRedeem) {
            this.logger.log(`Processing partial redemption for member: ${memberId}, order: ${orderId}`);
            const member = await this.getMember(memberId);
            if (!member) {
                throw new common_1.NotFoundException('Member not found');
            }
            if (pointsToRedeem > member.pointsBalance) {
                throw new common_1.BadRequestException('Insufficient points balance');
            }
            // Calculate discount (e.g., 100 points = $1)
            const conversionRate = 100; // points per dollar
            const discountAmount = pointsToRedeem / conversionRate;
            // Deduct points
            await this.deductPoints(memberId, pointsToRedeem);
            const remainingBalance = member.pointsBalance - pointsToRedeem;
            this.logger.log(`Partial redemption successful: $${discountAmount} discount applied`);
            return {
                discountAmount,
                pointsUsed: pointsToRedeem,
                remainingBalance,
            };
        }
        async getMember(memberId) {
            return { memberId, pointsBalance: 10000 };
        }
        async deductPoints(memberId, points) {
            this.logger.debug(`Deducting ${points} points`);
        }
    };
    __setFunctionName(_classThis, "PartialRedemptionService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PartialRedemptionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PartialRedemptionService = _classThis;
})();
exports.PartialRedemptionService = PartialRedemptionService;
// ============================================================================
// 15-19: TIER MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * 15. Service for tier qualification and upgrade
 */
let TierManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TierManagementService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(TierManagementService.name);
        }
        async evaluateTierQualification(memberId) {
            this.logger.log(`Evaluating tier qualification for member: ${memberId}`);
            const member = await this.getMember(memberId);
            const tierConfigs = await this.getAllTierConfigurations();
            // Determine qualified tier based on points
            const qualifiedTier = this.determineQualifiedTier(member.tierQualifyingPoints, tierConfigs);
            const upgradeAvailable = this.compareTiers(qualifiedTier, member.tier) > 0;
            let pointsToNextTier;
            if (!upgradeAvailable || qualifiedTier !== LoyaltyTier.PLATINUM) {
                pointsToNextTier = this.calculatePointsToNextTier(member.tierQualifyingPoints, qualifiedTier, tierConfigs);
            }
            return {
                currentTier: member.tier,
                qualifiedTier,
                upgradeAvailable,
                pointsToNextTier,
            };
        }
        async upgradeMemberTier(dto) {
            this.logger.log(`Upgrading member tier: ${dto.memberId} to ${dto.newTier}`);
            const member = await this.getMember(dto.memberId);
            if (!member) {
                throw new common_1.NotFoundException('Member not found');
            }
            // Validate upgrade eligibility
            if (!dto.manualOverride) {
                const qualification = await this.evaluateTierQualification(dto.memberId);
                if (this.compareTiers(dto.newTier, qualification.qualifiedTier) > 0) {
                    throw new common_1.BadRequestException('Member does not qualify for this tier upgrade');
                }
            }
            // Perform upgrade
            await this.updateMemberTier(dto.memberId, dto.newTier);
            // Award tier upgrade bonus
            const tierConfig = await this.getTierConfiguration(dto.newTier);
            if (tierConfig.welcomeBonus) {
                await this.awardWelcomeBonus(dto.memberId, tierConfig.welcomeBonus);
            }
            this.logger.log(`Tier upgrade successful: ${member.tier} -> ${dto.newTier}`);
            return {
                success: true,
                newTier: dto.newTier,
                benefits: tierConfig.benefits,
            };
        }
        determineQualifiedTier(points, configs) {
            const sorted = configs.sort((a, b) => b.minPoints - a.minPoints);
            for (const config of sorted) {
                if (points >= config.minPoints) {
                    return config.tier;
                }
            }
            return LoyaltyTier.BRONZE;
        }
        compareTiers(tier1, tier2) {
            const order = [LoyaltyTier.BRONZE, LoyaltyTier.SILVER, LoyaltyTier.GOLD, LoyaltyTier.PLATINUM, LoyaltyTier.DIAMOND];
            return order.indexOf(tier1) - order.indexOf(tier2);
        }
        calculatePointsToNextTier(currentPoints, currentTier, configs) {
            const nextTier = this.getNextTier(currentTier);
            if (!nextTier)
                return 0;
            const nextTierConfig = configs.find(c => c.tier === nextTier);
            if (!nextTierConfig)
                return 0;
            return Math.max(0, nextTierConfig.minPoints - currentPoints);
        }
        getNextTier(currentTier) {
            const progression = {
                [LoyaltyTier.BRONZE]: LoyaltyTier.SILVER,
                [LoyaltyTier.SILVER]: LoyaltyTier.GOLD,
                [LoyaltyTier.GOLD]: LoyaltyTier.PLATINUM,
                [LoyaltyTier.PLATINUM]: LoyaltyTier.DIAMOND,
                [LoyaltyTier.DIAMOND]: null,
            };
            return progression[currentTier];
        }
        async getMember(memberId) {
            return { memberId, tier: LoyaltyTier.SILVER, tierQualifyingPoints: 2500 };
        }
        async getAllTierConfigurations() {
            return [
                { tier: LoyaltyTier.BRONZE, minPoints: 0, pointsMultiplier: 1.0, benefits: [] },
                { tier: LoyaltyTier.SILVER, minPoints: 2000, pointsMultiplier: 1.25, benefits: [] },
                { tier: LoyaltyTier.GOLD, minPoints: 5000, pointsMultiplier: 1.5, benefits: [] },
                { tier: LoyaltyTier.PLATINUM, minPoints: 10000, pointsMultiplier: 2.0, benefits: [] },
            ];
        }
        async getTierConfiguration(tier) {
            return { tier, minPoints: 0, pointsMultiplier: 1.0, benefits: [], welcomeBonus: 500 };
        }
        async updateMemberTier(memberId, tier) {
            this.logger.debug(`Updating member tier: ${memberId} -> ${tier}`);
        }
        async awardWelcomeBonus(memberId, bonus) {
            this.logger.debug(`Awarding welcome bonus: ${bonus} points`);
        }
    };
    __setFunctionName(_classThis, "TierManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TierManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TierManagementService = _classThis;
})();
exports.TierManagementService = TierManagementService;
/**
 * 16. Service for tier downgrade handling
 */
let TierDowngradeService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TierDowngradeService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(TierDowngradeService.name);
        }
        async evaluateTierDowngrade(memberId) {
            this.logger.log(`Evaluating tier downgrade for member: ${memberId}`);
            const member = await this.getMember(memberId);
            const tierConfig = await this.getTierConfiguration(member.tier);
            // Check if member still qualifies for current tier
            if (member.tierQualifyingPoints < tierConfig.minPoints) {
                const gracePeriodEnd = new Date(member.tierStartDate);
                gracePeriodEnd.setMonth(gracePeriodEnd.getMonth() + 12); // 12-month grace period
                if (new Date() > gracePeriodEnd) {
                    return {
                        downgradePending: true,
                        effectiveDate: gracePeriodEnd,
                        reason: 'Insufficient qualifying points after grace period',
                    };
                }
            }
            return { downgradePending: false };
        }
        async processTierDowngrade(memberId, newTier, reason) {
            this.logger.log(`Processing tier downgrade: ${memberId} to ${newTier}`);
            await this.updateMemberTier(memberId, newTier);
            await this.notifyMemberOfDowngrade(memberId, newTier, reason);
        }
        async getMember(memberId) {
            return {
                memberId,
                tier: LoyaltyTier.GOLD,
                tierQualifyingPoints: 3000,
                tierStartDate: new Date('2023-01-01'),
            };
        }
        async getTierConfiguration(tier) {
            return { tier, minPoints: 5000, pointsMultiplier: 1.5, benefits: [] };
        }
        async updateMemberTier(memberId, tier) {
            this.logger.debug(`Downgrading tier: ${memberId} -> ${tier}`);
        }
        async notifyMemberOfDowngrade(memberId, tier, reason) {
            this.logger.debug('Sending tier downgrade notification');
        }
    };
    __setFunctionName(_classThis, "TierDowngradeService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TierDowngradeService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TierDowngradeService = _classThis;
})();
exports.TierDowngradeService = TierDowngradeService;
/**
 * 17. Service for tier status tracking
 */
let TierStatusService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TierStatusService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(TierStatusService.name);
        }
        async getTierProgress(memberId) {
            this.logger.log(`Getting tier progress for member: ${memberId}`);
            const member = await this.getMember(memberId);
            const tierConfigs = await this.getAllTierConfigurations();
            const nextTier = this.getNextTier(member.tier);
            const nextTierConfig = nextTier ? tierConfigs.find(c => c.tier === nextTier) : null;
            let progressPercentage = 100;
            let pointsNeeded;
            if (nextTierConfig) {
                const currentConfig = tierConfigs.find(c => c.tier === member.tier);
                const range = nextTierConfig.minPoints - currentConfig.minPoints;
                const progress = member.tierQualifyingPoints - currentConfig.minPoints;
                progressPercentage = Math.min(100, (progress / range) * 100);
                pointsNeeded = Math.max(0, nextTierConfig.minPoints - member.tierQualifyingPoints);
            }
            return {
                currentTier: member.tier,
                currentPoints: member.tierQualifyingPoints,
                nextTier,
                nextTierMinPoints: nextTierConfig?.minPoints,
                progressPercentage,
                pointsNeeded,
            };
        }
        async getMember(memberId) {
            return { memberId, tier: LoyaltyTier.SILVER, tierQualifyingPoints: 3500 };
        }
        async getAllTierConfigurations() {
            return [
                { tier: LoyaltyTier.BRONZE, minPoints: 0, pointsMultiplier: 1.0, benefits: [] },
                { tier: LoyaltyTier.SILVER, minPoints: 2000, pointsMultiplier: 1.25, benefits: [] },
                { tier: LoyaltyTier.GOLD, minPoints: 5000, pointsMultiplier: 1.5, benefits: [] },
                { tier: LoyaltyTier.PLATINUM, minPoints: 10000, pointsMultiplier: 2.0, benefits: [] },
            ];
        }
        getNextTier(currentTier) {
            const progression = {
                [LoyaltyTier.BRONZE]: LoyaltyTier.SILVER,
                [LoyaltyTier.SILVER]: LoyaltyTier.GOLD,
                [LoyaltyTier.GOLD]: LoyaltyTier.PLATINUM,
                [LoyaltyTier.PLATINUM]: LoyaltyTier.DIAMOND,
                [LoyaltyTier.DIAMOND]: null,
            };
            return progression[currentTier];
        }
    };
    __setFunctionName(_classThis, "TierStatusService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TierStatusService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TierStatusService = _classThis;
})();
exports.TierStatusService = TierStatusService;
/**
 * 18. Service for tier anniversary date tracking
 */
let TierAnniversaryService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TierAnniversaryService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(TierAnniversaryService.name);
        }
        async calculateTierAnniversary(memberId) {
            this.logger.log(`Calculating tier anniversary for member: ${memberId}`);
            const member = await this.getMember(memberId);
            const anniversaryDate = member.tierStartDate;
            const now = new Date();
            const yearsInTier = now.getFullYear() - anniversaryDate.getFullYear();
            const nextAnniversary = new Date(anniversaryDate);
            nextAnniversary.setFullYear(now.getFullYear() + (now > anniversaryDate ? 1 : 0));
            return {
                anniversaryDate,
                yearsInTier,
                nextAnniversary,
            };
        }
        async processTierAnniversaryRewards(memberId) {
            this.logger.log(`Processing tier anniversary rewards for member: ${memberId}`);
            const member = await this.getMember(memberId);
            const tierConfig = await this.getTierConfiguration(member.tier);
            const bonusAwarded = tierConfig.anniversaryBonus || 0;
            if (bonusAwarded > 0) {
                await this.awardAnniversaryBonus(memberId, bonusAwarded);
            }
            return {
                bonusAwarded,
                description: `${member.tier} tier anniversary bonus`,
            };
        }
        async getMember(memberId) {
            return {
                memberId,
                tier: LoyaltyTier.GOLD,
                tierStartDate: new Date('2022-06-15'),
            };
        }
        async getTierConfiguration(tier) {
            return {
                tier,
                minPoints: 5000,
                pointsMultiplier: 1.5,
                benefits: [],
                anniversaryBonus: 1000,
            };
        }
        async awardAnniversaryBonus(memberId, bonus) {
            this.logger.debug(`Awarding anniversary bonus: ${bonus} points`);
        }
    };
    __setFunctionName(_classThis, "TierAnniversaryService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TierAnniversaryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TierAnniversaryService = _classThis;
})();
exports.TierAnniversaryService = TierAnniversaryService;
/**
 * 19. Service for tier recertification
 */
let TierRecertificationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TierRecertificationService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(TierRecertificationService.name);
        }
        async recertifyTier(memberId) {
            this.logger.log(`Recertifying tier for member: ${memberId}`);
            const member = await this.getMember(memberId);
            const tierConfig = await this.getTierConfiguration(member.tier);
            // Check if member has met recertification requirements
            const qualifyingPointsLastYear = await this.getQualifyingPointsLastYear(memberId);
            const certified = qualifyingPointsLastYear >= tierConfig.minPoints;
            let action;
            if (certified) {
                action = 'TIER_MAINTAINED';
                await this.resetQualifyingPoints(memberId);
            }
            else {
                action = 'DOWNGRADE_PENDING';
                await this.initiateTierDowngrade(memberId);
            }
            return {
                certified,
                maintainedTier: member.tier,
                action,
            };
        }
        async getMember(memberId) {
            return { memberId, tier: LoyaltyTier.GOLD };
        }
        async getTierConfiguration(tier) {
            return { tier, minPoints: 5000, pointsMultiplier: 1.5, benefits: [] };
        }
        async getQualifyingPointsLastYear(memberId) {
            return 6000;
        }
        async resetQualifyingPoints(memberId) {
            this.logger.debug('Resetting qualifying points for new tier year');
        }
        async initiateTierDowngrade(memberId) {
            this.logger.debug('Initiating tier downgrade process');
        }
    };
    __setFunctionName(_classThis, "TierRecertificationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TierRecertificationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TierRecertificationService = _classThis;
})();
exports.TierRecertificationService = TierRecertificationService;
// ============================================================================
// 20-23: TIER BENEFITS AND PERKS
// ============================================================================
/**
 * 20. Service for tier benefit management
 */
let TierBenefitService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TierBenefitService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(TierBenefitService.name);
        }
        async getTierBenefits(tier) {
            this.logger.log(`Fetching benefits for tier: ${tier}`);
            const tierConfig = await this.getTierConfiguration(tier);
            return tierConfig.benefits;
        }
        async getMemberBenefits(memberId) {
            this.logger.log(`Fetching member benefits: ${memberId}`);
            const member = await this.getMember(memberId);
            const benefits = await this.getTierBenefits(member.tier);
            const now = new Date();
            const activeBenefits = benefits.filter(b => b.isActive && (!b.startDate || b.startDate <= now) && (!b.endDate || b.endDate >= now));
            return {
                tier: member.tier,
                benefits,
                activeBenefits,
            };
        }
        async applyBenefit(memberId, benefitId, orderId) {
            this.logger.log(`Applying benefit ${benefitId} for member: ${memberId}`);
            const member = await this.getMember(memberId);
            const benefits = await this.getTierBenefits(member.tier);
            const benefit = benefits.find(b => b.benefitId === benefitId);
            if (!benefit) {
                throw new common_1.NotFoundException('Benefit not found for member tier');
            }
            if (!benefit.isActive) {
                throw new common_1.BadRequestException('Benefit is not currently active');
            }
            // Apply benefit logic based on type
            const value = await this.calculateBenefitValue(benefit, member, orderId);
            await this.recordBenefitUsage(memberId, benefitId, orderId, value);
            return {
                applied: true,
                value,
                description: benefit.description,
            };
        }
        async getTierConfiguration(tier) {
            return {
                tier,
                minPoints: 0,
                pointsMultiplier: 1.0,
                benefits: [
                    {
                        benefitId: 'BEN-001',
                        benefitType: BenefitType.POINTS_MULTIPLIER,
                        name: '2x Points',
                        description: 'Earn double points on all purchases',
                        value: 2.0,
                        isActive: true,
                    },
                    {
                        benefitId: 'BEN-002',
                        benefitType: BenefitType.FREE_SHIPPING,
                        name: 'Free Shipping',
                        description: 'Free standard shipping on all orders',
                        isActive: true,
                    },
                ],
            };
        }
        async getMember(memberId) {
            return { memberId, tier: LoyaltyTier.GOLD };
        }
        async calculateBenefitValue(benefit, member, orderId) {
            return benefit.value || 0;
        }
        async recordBenefitUsage(memberId, benefitId, orderId, value) {
            this.logger.debug(`Recording benefit usage: ${benefitId}`);
        }
    };
    __setFunctionName(_classThis, "TierBenefitService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TierBenefitService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TierBenefitService = _classThis;
})();
exports.TierBenefitService = TierBenefitService;
/**
 * 21. Service for exclusive access management
 */
let ExclusiveAccessService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ExclusiveAccessService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(ExclusiveAccessService.name);
        }
        async checkExclusiveAccess(memberId, resourceId) {
            this.logger.log(`Checking exclusive access for member: ${memberId}, resource: ${resourceId}`);
            const member = await this.getMember(memberId);
            const resource = await this.getExclusiveResource(resourceId);
            if (!resource) {
                return { hasAccess: false, tier: member.tier, reason: 'Resource not found' };
            }
            const tierLevel = this.getTierLevel(member.tier);
            const requiredLevel = this.getTierLevel(resource.requiredTier);
            const hasAccess = tierLevel >= requiredLevel;
            return {
                hasAccess,
                tier: member.tier,
                reason: hasAccess ? undefined : `Requires ${resource.requiredTier} tier or higher`,
            };
        }
        async grantEarlyAccess(memberId, productId) {
            this.logger.log(`Granting early access to product ${productId} for member: ${memberId}`);
            const member = await this.getMember(memberId);
            // Only Gold and above get early access
            if (this.getTierLevel(member.tier) < this.getTierLevel(LoyaltyTier.GOLD)) {
                throw new common_1.BadRequestException('Early access is only available for Gold tier and above');
            }
            const accessStartDate = new Date();
            const accessEndDate = new Date();
            accessEndDate.setDate(accessEndDate.getDate() + 7); // 7-day early access
            await this.recordEarlyAccess(memberId, productId, accessStartDate, accessEndDate);
            return {
                accessGranted: true,
                accessStartDate,
                accessEndDate,
            };
        }
        async getMember(memberId) {
            return { memberId, tier: LoyaltyTier.PLATINUM };
        }
        async getExclusiveResource(resourceId) {
            return { requiredTier: LoyaltyTier.GOLD };
        }
        getTierLevel(tier) {
            const levels = {
                [LoyaltyTier.BRONZE]: 1,
                [LoyaltyTier.SILVER]: 2,
                [LoyaltyTier.GOLD]: 3,
                [LoyaltyTier.PLATINUM]: 4,
                [LoyaltyTier.DIAMOND]: 5,
            };
            return levels[tier];
        }
        async recordEarlyAccess(memberId, productId, startDate, endDate) {
            this.logger.debug('Recording early access grant');
        }
    };
    __setFunctionName(_classThis, "ExclusiveAccessService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExclusiveAccessService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExclusiveAccessService = _classThis;
})();
exports.ExclusiveAccessService = ExclusiveAccessService;
/**
 * 22. Service for personalized offers
 */
let PersonalizedOfferService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PersonalizedOfferService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(PersonalizedOfferService.name);
        }
        async generatePersonalizedOffers(memberId) {
            this.logger.log(`Generating personalized offers for member: ${memberId}`);
            const member = await this.getMember(memberId);
            const purchaseHistory = await this.getPurchaseHistory(memberId);
            const preferences = member.preferences || {};
            const offers = [];
            // Tier-based offers
            if (member.tier === LoyaltyTier.PLATINUM || member.tier === LoyaltyTier.DIAMOND) {
                offers.push({
                    offerId: 'PLAT-001',
                    title: 'VIP Exclusive: 25% Off Premium Products',
                    description: 'Exclusive discount for Platinum members',
                    discountPercent: 25,
                    validUntil: this.getFutureDate(30),
                });
            }
            // Purchase history-based offers
            if (purchaseHistory.length > 0) {
                offers.push({
                    offerId: 'REPURCH-001',
                    title: 'Repeat Purchase Bonus',
                    description: 'Bonus points on your favorite category',
                    bonusPoints: 500,
                    validUntil: this.getFutureDate(14),
                });
            }
            return offers;
        }
        async getMember(memberId) {
            return { memberId, tier: LoyaltyTier.PLATINUM, preferences: {} };
        }
        async getPurchaseHistory(memberId) {
            return [];
        }
        getFutureDate(days) {
            const date = new Date();
            date.setDate(date.getDate() + days);
            return date;
        }
    };
    __setFunctionName(_classThis, "PersonalizedOfferService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PersonalizedOfferService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PersonalizedOfferService = _classThis;
})();
exports.PersonalizedOfferService = PersonalizedOfferService;
/**
 * 23. Service for concierge services
 */
let ConciergeService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ConciergeService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(ConciergeService.name);
        }
        async requestConciergeService(memberId, serviceType, details) {
            this.logger.log(`Concierge service request from member: ${memberId}`);
            const member = await this.getMember(memberId);
            // Concierge only available for Platinum and Diamond
            if (![LoyaltyTier.PLATINUM, LoyaltyTier.DIAMOND].includes(member.tier)) {
                throw new common_1.BadRequestException('Concierge service is only available for Platinum and Diamond members');
            }
            const requestId = `CONC-${Date.now()}`;
            const estimatedResponse = new Date();
            estimatedResponse.setHours(estimatedResponse.getHours() + 2); // 2-hour response time
            await this.createConciergeRequest(requestId, memberId, serviceType, details);
            return {
                requestId,
                status: 'PENDING',
                estimatedResponse,
            };
        }
        async getMember(memberId) {
            return { memberId, tier: LoyaltyTier.PLATINUM };
        }
        async createConciergeRequest(requestId, memberId, serviceType, details) {
            this.logger.debug(`Creating concierge request: ${requestId}`);
        }
    };
    __setFunctionName(_classThis, "ConciergeService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConciergeService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConciergeService = _classThis;
})();
exports.ConciergeService = ConciergeService;
// ============================================================================
// 24-27: POINTS EXPIRATION
// ============================================================================
/**
 * 24. Service for points expiration management
 */
let PointsExpirationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PointsExpirationService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(PointsExpirationService.name);
        }
        async getExpiringPoints(memberId, daysThreshold = 30) {
            this.logger.log(`Fetching expiring points for member: ${memberId} within ${daysThreshold} days`);
            const thresholdDate = new Date();
            thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
            const expiringTransactions = await this.findExpiringTransactions(memberId, thresholdDate);
            const expiringPoints = expiringTransactions.reduce((sum, txn) => sum + txn.points, 0);
            const earliestExpiration = expiringTransactions.length > 0
                ? expiringTransactions[0].expirationDate
                : null;
            return {
                expiringPoints,
                expirationDate: earliestExpiration || thresholdDate,
                transactions: expiringTransactions,
            };
        }
        async processPointsExpiration() {
            this.logger.log('Processing points expiration for all members');
            const expiredTransactions = await this.findExpiredTransactions();
            let totalPointsExpired = 0;
            const processedMembers = new Set();
            for (const txn of expiredTransactions) {
                await this.expireTransaction(txn);
                totalPointsExpired += txn.points;
                processedMembers.add(txn.memberId);
            }
            return {
                membersProcessed: processedMembers.size,
                pointsExpired: totalPointsExpired,
            };
        }
        async extendPointsExpiration(memberId, transactionId, extensionDays) {
            this.logger.log(`Extending points expiration for transaction: ${transactionId}`);
            const transaction = await this.getTransaction(transactionId);
            if (!transaction) {
                throw new common_1.NotFoundException('Transaction not found');
            }
            if (transaction.memberId !== memberId) {
                throw new common_1.BadRequestException('Transaction does not belong to this member');
            }
            const newExpirationDate = new Date(transaction.expirationDate);
            newExpirationDate.setDate(newExpirationDate.getDate() + extensionDays);
            await this.updateTransactionExpiration(transactionId, newExpirationDate);
            return {
                success: true,
                newExpirationDate,
            };
        }
        async findExpiringTransactions(memberId, beforeDate) {
            return [];
        }
        async findExpiredTransactions() {
            return [];
        }
        async expireTransaction(transaction) {
            this.logger.debug(`Expiring transaction: ${transaction.transactionId}`);
        }
        async getTransaction(transactionId) {
            return null;
        }
        async updateTransactionExpiration(transactionId, newDate) {
            this.logger.debug(`Updating transaction expiration: ${transactionId}`);
        }
    };
    __setFunctionName(_classThis, "PointsExpirationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PointsExpirationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PointsExpirationService = _classThis;
})();
exports.PointsExpirationService = PointsExpirationService;
/**
 * 25. Service for expiration notifications
 */
let ExpirationNotificationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ExpirationNotificationService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(ExpirationNotificationService.name);
        }
        async sendExpirationReminders() {
            this.logger.log('Sending expiration reminder notifications');
            const membersWithExpiringPoints = await this.findMembersWithExpiringPoints([7, 14, 30]); // 7, 14, 30 days
            let notificationsSent = 0;
            for (const member of membersWithExpiringPoints) {
                await this.sendExpirationNotification(member.memberId, member.expiringPoints, member.expirationDate);
                notificationsSent++;
            }
            return { notificationsSent };
        }
        async notifyMemberOfExpiration(memberId, pointsExpired) {
            this.logger.log(`Sending expiration notification to member: ${memberId}`);
            await this.sendNotification(memberId, {
                type: 'POINTS_EXPIRED',
                subject: 'Points Expiration Notice',
                message: `${pointsExpired} loyalty points have expired from your account.`,
            });
        }
        async findMembersWithExpiringPoints(daysThresholds) {
            return [];
        }
        async sendExpirationNotification(memberId, points, expirationDate) {
            this.logger.debug(`Sending expiration reminder to member: ${memberId}`);
        }
        async sendNotification(memberId, notification) {
            this.logger.debug('Sending notification');
        }
    };
    __setFunctionName(_classThis, "ExpirationNotificationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExpirationNotificationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExpirationNotificationService = _classThis;
})();
exports.ExpirationNotificationService = ExpirationNotificationService;
/**
 * 26. Service for expiration policy configuration
 */
let ExpirationPolicyService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ExpirationPolicyService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(ExpirationPolicyService.name);
        }
        async getExpirationPolicy(tier) {
            this.logger.log(`Fetching expiration policy for tier: ${tier}`);
            const policies = {
                [LoyaltyTier.BRONZE]: {
                    policy: ExpirationPolicy.FIXED_DURATION,
                    months: 12,
                    details: 'Points expire 12 months from earn date',
                },
                [LoyaltyTier.SILVER]: {
                    policy: ExpirationPolicy.ROLLING_WINDOW,
                    months: 18,
                    details: 'Points expire 18 months from earn date',
                },
                [LoyaltyTier.GOLD]: {
                    policy: ExpirationPolicy.ROLLING_WINDOW,
                    months: 24,
                    details: 'Points expire 24 months from earn date',
                },
                [LoyaltyTier.PLATINUM]: {
                    policy: ExpirationPolicy.ACTIVITY_BASED,
                    months: 36,
                    details: 'Points never expire with activity every 12 months',
                },
                [LoyaltyTier.DIAMOND]: {
                    policy: ExpirationPolicy.NEVER_EXPIRE,
                    months: 0,
                    details: 'Points never expire',
                },
            };
            const config = policies[tier];
            return {
                policy: config.policy,
                expirationMonths: config.months,
                details: config.details,
            };
        }
        async updateExpirationPolicy(tier, policy, months) {
            this.logger.log(`Updating expiration policy for tier: ${tier}`);
            await this.saveExpirationPolicy(tier, policy, months);
        }
        async saveExpirationPolicy(tier, policy, months) {
            this.logger.debug('Saving expiration policy');
        }
    };
    __setFunctionName(_classThis, "ExpirationPolicyService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExpirationPolicyService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExpirationPolicyService = _classThis;
})();
exports.ExpirationPolicyService = ExpirationPolicyService;
/**
 * 27. Service for expiration prevention
 */
let ExpirationPreventionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ExpirationPreventionService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(ExpirationPreventionService.name);
        }
        async preventExpirationWithActivity(memberId) {
            this.logger.log(`Preventing expiration through activity for member: ${memberId}`);
            const expiringPoints = await this.getExpiringPoints(memberId, 90);
            // Activity extends expiration for activity-based policies
            const newExpirationDate = new Date();
            newExpirationDate.setMonth(newExpirationDate.getMonth() + 12);
            await this.extendAllExpiringPoints(memberId, newExpirationDate);
            return {
                pointsPreserved: expiringPoints,
                newExpirationDate,
            };
        }
        async getExpiringPoints(memberId, days) {
            return 0;
        }
        async extendAllExpiringPoints(memberId, newDate) {
            this.logger.debug('Extending all expiring points');
        }
    };
    __setFunctionName(_classThis, "ExpirationPreventionService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExpirationPreventionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExpirationPreventionService = _classThis;
})();
exports.ExpirationPreventionService = ExpirationPreventionService;
// ============================================================================
// 28-31: BONUS POINTS PROMOTIONS
// ============================================================================
/**
 * 28. Service for promotion management
 */
let PromotionManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PromotionManagementService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(PromotionManagementService.name);
        }
        async createPromotion(config) {
            this.logger.log(`Creating new promotion: ${config.name}`);
            if (config.startDate >= config.endDate) {
                throw new common_1.BadRequestException('Promotion end date must be after start date');
            }
            await this.savePromotion(config);
            return config;
        }
        async getActivePromotions(tier) {
            this.logger.log(`Fetching active promotions${tier ? ` for tier: ${tier}` : ''}`);
            const now = new Date();
            const allPromotions = await this.getAllPromotions();
            return allPromotions.filter(promo => {
                const isActive = promo.isActive && promo.startDate <= now && promo.endDate >= now;
                const tierEligible = !tier || !promo.eligibleTiers || promo.eligibleTiers.includes(tier);
                return isActive && tierEligible;
            });
        }
        async deactivatePromotion(promotionId) {
            this.logger.log(`Deactivating promotion: ${promotionId}`);
            await this.updatePromotionStatus(promotionId, false);
        }
        async savePromotion(config) {
            this.logger.debug('Saving promotion configuration');
        }
        async getAllPromotions() {
            return [];
        }
        async updatePromotionStatus(promotionId, isActive) {
            this.logger.debug(`Updating promotion status: ${promotionId}`);
        }
    };
    __setFunctionName(_classThis, "PromotionManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PromotionManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PromotionManagementService = _classThis;
})();
exports.PromotionManagementService = PromotionManagementService;
/**
 * 29. Service for promotion application
 */
let PromotionApplicationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PromotionApplicationService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(PromotionApplicationService.name);
        }
        async applyPromotionToTransaction(memberId, orderId, basePoints, categoryId) {
            this.logger.log(`Applying promotions for order: ${orderId}`);
            const member = await this.getMember(memberId);
            const activePromotions = await this.getEligiblePromotions(member.tier, categoryId);
            let totalBonusPoints = 0;
            const appliedPromotions = [];
            for (const promo of activePromotions) {
                const eligible = await this.checkPromotionEligibility(memberId, promo);
                if (eligible) {
                    const bonus = this.calculatePromotionBonus(promo, basePoints);
                    totalBonusPoints += bonus;
                    appliedPromotions.push(promo.promotionId);
                    await this.recordPromotionUsage(memberId, promo.promotionId, orderId);
                }
            }
            return { bonusPoints: totalBonusPoints, appliedPromotions };
        }
        async getMember(memberId) {
            return { memberId, tier: LoyaltyTier.GOLD };
        }
        async getEligiblePromotions(tier, categoryId) {
            return [];
        }
        async checkPromotionEligibility(memberId, promo) {
            if (promo.maxUsesPerMember) {
                const usageCount = await this.getPromotionUsageCount(memberId, promo.promotionId);
                return usageCount < promo.maxUsesPerMember;
            }
            return true;
        }
        calculatePromotionBonus(promo, basePoints) {
            switch (promo.promotionType) {
                case PromotionType.DOUBLE_POINTS:
                    return basePoints;
                case PromotionType.TRIPLE_POINTS:
                    return basePoints * 2;
                case PromotionType.BONUS_POINTS:
                    return promo.bonusPoints || 0;
                default:
                    return 0;
            }
        }
        async getPromotionUsageCount(memberId, promotionId) {
            return 0;
        }
        async recordPromotionUsage(memberId, promotionId, orderId) {
            this.logger.debug(`Recording promotion usage: ${promotionId}`);
        }
    };
    __setFunctionName(_classThis, "PromotionApplicationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PromotionApplicationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PromotionApplicationService = _classThis;
})();
exports.PromotionApplicationService = PromotionApplicationService;
/**
 * 30. Service for seasonal promotions
 */
let SeasonalPromotionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SeasonalPromotionService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(SeasonalPromotionService.name);
        }
        async createSeasonalPromotion(season, multiplier, durationDays) {
            this.logger.log(`Creating seasonal promotion for: ${season}`);
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + durationDays);
            const promo = {
                promotionId: `SEASONAL-${season}-${Date.now()}`,
                name: `${season} Bonus Points`,
                promotionType: PromotionType.CATEGORY_MULTIPLIER,
                multiplier,
                startDate,
                endDate,
                isActive: true,
            };
            await this.savePromotion(promo);
            return promo;
        }
        async savePromotion(promo) {
            this.logger.debug('Saving seasonal promotion');
        }
    };
    __setFunctionName(_classThis, "SeasonalPromotionService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SeasonalPromotionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SeasonalPromotionService = _classThis;
})();
exports.SeasonalPromotionService = SeasonalPromotionService;
/**
 * 31. Service for first purchase bonus
 */
let FirstPurchaseBonusService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FirstPurchaseBonusService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(FirstPurchaseBonusService.name);
        }
        async awardFirstPurchaseBonus(memberId, orderId) {
            this.logger.log(`Processing first purchase bonus for member: ${memberId}`);
            const isFirstPurchase = await this.checkIfFirstPurchase(memberId, orderId);
            if (!isFirstPurchase) {
                return {
                    bonusAwarded: 0,
                    description: 'Not eligible - previous purchases exist',
                };
            }
            const bonusPoints = 1000; // First purchase bonus
            await this.awardBonus(memberId, bonusPoints, 'First purchase bonus');
            return {
                bonusAwarded: bonusPoints,
                description: 'First purchase bonus awarded',
            };
        }
        async checkIfFirstPurchase(memberId, currentOrderId) {
            // Check if this is the first completed order
            return true; // Mock implementation
        }
        async awardBonus(memberId, points, description) {
            this.logger.debug(`Awarding first purchase bonus: ${points} points`);
        }
    };
    __setFunctionName(_classThis, "FirstPurchaseBonusService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FirstPurchaseBonusService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FirstPurchaseBonusService = _classThis;
})();
exports.FirstPurchaseBonusService = FirstPurchaseBonusService;
// ============================================================================
// 32-34: REFERRAL REWARDS
// ============================================================================
/**
 * 32. Service for referral program management
 */
let ReferralProgramService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ReferralProgramService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(ReferralProgramService.name);
        }
        async generateReferralCode(memberId) {
            this.logger.log(`Generating referral code for member: ${memberId}`);
            const member = await this.getMember(memberId);
            const referralCode = this.createReferralCode(member.memberNumber);
            await this.saveReferralCode(memberId, referralCode);
            return {
                referralCode,
                referralUrl: `https://example.com/join?ref=${referralCode}`,
            };
        }
        async processReferral(referralCode, newMemberId) {
            this.logger.log(`Processing referral with code: ${referralCode}`);
            const referrerId = await this.getReferrerByCode(referralCode);
            if (!referrerId) {
                throw new common_1.NotFoundException('Invalid referral code');
            }
            const referralProgram = {
                referralId: `REF-${Date.now()}`,
                referrerId,
                refereeId: newMemberId,
                referralCode,
                referrerPoints: 500,
                refereePoints: 250,
                status: 'PENDING',
                referralDate: new Date(),
                expiryDate: this.getFutureDate(90),
            };
            await this.saveReferral(referralProgram);
            return referralProgram;
        }
        async completeReferral(referralId) {
            this.logger.log(`Completing referral: ${referralId}`);
            const referral = await this.getReferral(referralId);
            if (!referral) {
                throw new common_1.NotFoundException('Referral not found');
            }
            if (referral.status === 'COMPLETED') {
                throw new common_1.BadRequestException('Referral already completed');
            }
            // Award points to both parties
            await this.awardPoints(referral.referrerId, referral.referrerPoints, 'Referral reward');
            await this.awardPoints(referral.refereeId, referral.refereePoints, 'Referral sign-up bonus');
            await this.updateReferralStatus(referralId, 'COMPLETED');
            return {
                referrerPoints: referral.referrerPoints,
                refereePoints: referral.refereePoints,
            };
        }
        createReferralCode(memberNumber) {
            return `${memberNumber}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        }
        async getMember(memberId) {
            return { memberId, memberNumber: 'LM12345678' };
        }
        async saveReferralCode(memberId, code) {
            this.logger.debug('Saving referral code');
        }
        async getReferrerByCode(code) {
            return 'MEMBER-123';
        }
        async saveReferral(referral) {
            this.logger.debug('Saving referral');
        }
        async getReferral(referralId) {
            return null;
        }
        async awardPoints(memberId, points, description) {
            this.logger.debug(`Awarding ${points} points: ${description}`);
        }
        async updateReferralStatus(referralId, status) {
            this.logger.debug(`Updating referral status: ${referralId} -> ${status}`);
        }
        getFutureDate(days) {
            const date = new Date();
            date.setDate(date.getDate() + days);
            return date;
        }
    };
    __setFunctionName(_classThis, "ReferralProgramService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReferralProgramService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReferralProgramService = _classThis;
})();
exports.ReferralProgramService = ReferralProgramService;
/**
 * 33. Service for referral tracking
 */
let ReferralTrackingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ReferralTrackingService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(ReferralTrackingService.name);
        }
        async getReferralStats(memberId) {
            this.logger.log(`Fetching referral stats for member: ${memberId}`);
            const referrals = await this.getMemberReferrals(memberId);
            const completed = referrals.filter(r => r.status === 'COMPLETED');
            const pending = referrals.filter(r => r.status === 'PENDING');
            const totalPointsEarned = completed.reduce((sum, r) => sum + r.referrerPoints, 0);
            return {
                totalReferrals: referrals.length,
                completedReferrals: completed.length,
                pendingReferrals: pending.length,
                totalPointsEarned,
            };
        }
        async getMemberReferrals(memberId) {
            return [];
        }
    };
    __setFunctionName(_classThis, "ReferralTrackingService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReferralTrackingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReferralTrackingService = _classThis;
})();
exports.ReferralTrackingService = ReferralTrackingService;
/**
 * 34. Service for referral leaderboard
 */
let ReferralLeaderboardService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ReferralLeaderboardService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(ReferralLeaderboardService.name);
        }
        async getTopReferrers(limit = 10, period = 'all') {
            this.logger.log(`Fetching top ${limit} referrers for period: ${period}`);
            const leaderboard = await this.calculateLeaderboard(period);
            return leaderboard.slice(0, limit);
        }
        async calculateLeaderboard(period) {
            // Mock leaderboard data
            return [
                { memberId: 'MEM-001', memberNumber: 'LM00001', referralCount: 25, pointsEarned: 12500 },
                { memberId: 'MEM-002', memberNumber: 'LM00002', referralCount: 18, pointsEarned: 9000 },
            ];
        }
    };
    __setFunctionName(_classThis, "ReferralLeaderboardService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReferralLeaderboardService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReferralLeaderboardService = _classThis;
})();
exports.ReferralLeaderboardService = ReferralLeaderboardService;
// ============================================================================
// 35-36: BIRTHDAY & ANNIVERSARY REWARDS
// ============================================================================
/**
 * 35. Service for birthday rewards
 */
let BirthdayRewardService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var BirthdayRewardService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(BirthdayRewardService.name);
        }
        async processBirthdayRewards() {
            this.logger.log('Processing birthday rewards');
            const birthdayMembers = await this.findBirthdayMembers();
            let totalPoints = 0;
            for (const member of birthdayMembers) {
                const points = await this.awardBirthdayBonus(member);
                totalPoints += points;
            }
            return {
                membersRewarded: birthdayMembers.length,
                totalPointsAwarded: totalPoints,
            };
        }
        async awardBirthdayBonus(member) {
            this.logger.log(`Awarding birthday bonus to member: ${member.memberId}`);
            const tierConfig = await this.getTierConfiguration(member.tier);
            const bonusPoints = tierConfig.birthdayBonus || 500;
            await this.recordBirthdayReward(member.memberId, bonusPoints);
            return bonusPoints;
        }
        async findBirthdayMembers() {
            return [];
        }
        async getTierConfiguration(tier) {
            return { tier, minPoints: 0, pointsMultiplier: 1.0, benefits: [], birthdayBonus: 500 };
        }
        async recordBirthdayReward(memberId, points) {
            this.logger.debug(`Recording birthday reward: ${points} points`);
        }
    };
    __setFunctionName(_classThis, "BirthdayRewardService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BirthdayRewardService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BirthdayRewardService = _classThis;
})();
exports.BirthdayRewardService = BirthdayRewardService;
/**
 * 36. Service for anniversary rewards
 */
let AnniversaryRewardService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AnniversaryRewardService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(AnniversaryRewardService.name);
        }
        async processAnniversaryRewards() {
            this.logger.log('Processing anniversary rewards');
            const anniversaryMembers = await this.findAnniversaryMembers();
            let totalPoints = 0;
            for (const member of anniversaryMembers) {
                const points = await this.awardAnniversaryBonus(member);
                totalPoints += points;
            }
            return {
                membersRewarded: anniversaryMembers.length,
                totalPointsAwarded: totalPoints,
            };
        }
        async awardAnniversaryBonus(member) {
            this.logger.log(`Awarding anniversary bonus to member: ${member.memberId}`);
            const yearsAsMember = this.calculateYearsAsMember(member.enrollmentDate);
            const bonusPoints = 500 + (yearsAsMember * 100); // Base 500 + 100 per year
            await this.recordAnniversaryReward(member.memberId, bonusPoints, yearsAsMember);
            return bonusPoints;
        }
        calculateYearsAsMember(enrollmentDate) {
            const now = new Date();
            return now.getFullYear() - enrollmentDate.getFullYear();
        }
        async findAnniversaryMembers() {
            return [];
        }
        async recordAnniversaryReward(memberId, points, years) {
            this.logger.debug(`Recording anniversary reward: ${points} points (${years} years)`);
        }
    };
    __setFunctionName(_classThis, "AnniversaryRewardService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnniversaryRewardService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnniversaryRewardService = _classThis;
})();
exports.AnniversaryRewardService = AnniversaryRewardService;
// ============================================================================
// 37: POINTS TRANSFER
// ============================================================================
/**
 * 37. Service for points transfer between members
 */
let PointsTransferService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PointsTransferService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(PointsTransferService.name);
        }
        async transferPoints(dto) {
            this.logger.log(`Processing points transfer: ${dto.points} points from ${dto.fromMemberId} to ${dto.toMemberId}`);
            // Validate source member
            const fromMember = await this.getMember(dto.fromMemberId);
            if (!fromMember) {
                throw new common_1.NotFoundException('Source member not found');
            }
            if (fromMember.status !== MemberStatus.ACTIVE) {
                throw new common_1.BadRequestException('Source member account is not active');
            }
            if (fromMember.pointsBalance < dto.points) {
                throw new common_1.BadRequestException('Insufficient points balance');
            }
            // Validate destination member
            const toMember = await this.getMember(dto.toMemberId);
            if (!toMember) {
                throw new common_1.NotFoundException('Destination member not found');
            }
            if (toMember.status !== MemberStatus.ACTIVE) {
                throw new common_1.BadRequestException('Destination member account is not active');
            }
            // Check transfer limits
            const transferLimit = await this.getTransferLimit(fromMember.tier);
            if (dto.points > transferLimit) {
                throw new common_1.BadRequestException(`Transfer amount exceeds limit of ${transferLimit} points`);
            }
            // Process transfer
            const transferId = `XFER-${Date.now()}`;
            await this.deductPoints(dto.fromMemberId, dto.points, transferId);
            await this.addPoints(dto.toMemberId, dto.points, transferId);
            await this.recordTransfer(transferId, dto);
            this.logger.log(`Transfer successful: ${transferId}`);
            return {
                success: true,
                transferId,
                pointsTransferred: dto.points,
                fromBalance: fromMember.pointsBalance - dto.points,
                toBalance: toMember.pointsBalance + dto.points,
            };
        }
        async getMember(memberId) {
            return {
                memberId,
                status: MemberStatus.ACTIVE,
                pointsBalance: 5000,
                tier: LoyaltyTier.GOLD,
            };
        }
        async getTransferLimit(tier) {
            const limits = {
                [LoyaltyTier.BRONZE]: 100,
                [LoyaltyTier.SILVER]: 500,
                [LoyaltyTier.GOLD]: 1000,
                [LoyaltyTier.PLATINUM]: 5000,
                [LoyaltyTier.DIAMOND]: 10000,
            };
            return limits[tier];
        }
        async deductPoints(memberId, points, transferId) {
            this.logger.debug(`Deducting ${points} points from ${memberId}`);
        }
        async addPoints(memberId, points, transferId) {
            this.logger.debug(`Adding ${points} points to ${memberId}`);
        }
        async recordTransfer(transferId, dto) {
            this.logger.debug(`Recording transfer: ${transferId}`);
        }
    };
    __setFunctionName(_classThis, "PointsTransferService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PointsTransferService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PointsTransferService = _classThis;
})();
exports.PointsTransferService = PointsTransferService;
// ============================================================================
// EXPORTED PROVIDER ARRAY
// ============================================================================
/**
 * All loyalty and rewards service providers for easy module import
 */
exports.LOYALTY_REWARDS_PROVIDERS = [
    // Enrollment (1-4)
    LoyaltyEnrollmentService,
    EnrollmentEligibilityService,
    BulkEnrollmentService,
    EnrollmentChannelService,
    // Points Earning (5-9)
    PointsEarningCalculator,
    PointsTransactionService,
    PointsAdjustmentService,
    EarningRateService,
    PointsForecastService,
    // Points Redemption (10-14)
    PointsRedemptionService,
    RedemptionValidationService,
    RedemptionHistoryService,
    RedemptionRecommendationService,
    PartialRedemptionService,
    // Tier Management (15-19)
    TierManagementService,
    TierDowngradeService,
    TierStatusService,
    TierAnniversaryService,
    TierRecertificationService,
    // Tier Benefits (20-23)
    TierBenefitService,
    ExclusiveAccessService,
    PersonalizedOfferService,
    ConciergeService,
    // Points Expiration (24-27)
    PointsExpirationService,
    ExpirationNotificationService,
    ExpirationPolicyService,
    ExpirationPreventionService,
    // Bonus Promotions (28-31)
    PromotionManagementService,
    PromotionApplicationService,
    SeasonalPromotionService,
    FirstPurchaseBonusService,
    // Referral Rewards (32-34)
    ReferralProgramService,
    ReferralTrackingService,
    ReferralLeaderboardService,
    // Birthday & Anniversary (35-36)
    BirthdayRewardService,
    AnniversaryRewardService,
    // Points Transfer (37)
    PointsTransferService,
];
/**
 * Configuration tokens for dependency injection
 */
exports.LOYALTY_CONFIG = 'LOYALTY_CONFIG';
exports.TIER_CONFIGS = 'TIER_CONFIGS';
exports.CARRIER_CONFIGS = 'CARRIER_CONFIGS';
//# sourceMappingURL=loyalty-rewards-kit.js.map