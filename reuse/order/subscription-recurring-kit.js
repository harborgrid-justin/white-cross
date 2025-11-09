"use strict";
/**
 * LOC: ORD-SUB-001
 * File: /reuse/order/subscription-recurring-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Subscription controllers
 *   - Billing services
 *   - Recurring order processors
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
exports.SubscriptionUsage = exports.SubscriptionHistory = exports.RecurringOrder = exports.Subscription = exports.SubscriptionPlan = exports.UsageUnit = exports.ModificationType = exports.DunningStage = exports.PaymentMethodType = exports.CancellationReason = exports.RenewalType = exports.ProrationMethod = exports.PlanType = exports.BillingFrequency = exports.SubscriptionStatus = void 0;
exports.createSubscription = createSubscription;
exports.enrollInTrial = enrollInTrial;
exports.convertTrialToPaid = convertTrialToPaid;
exports.createCommitmentSubscription = createCommitmentSubscription;
exports.createSubscriptionPlan = createSubscriptionPlan;
exports.updatePlanPricing = updatePlanPricing;
exports.getActivePlans = getActivePlans;
exports.comparePlans = comparePlans;
exports.calculateNextBillingDate = calculateNextBillingDate;
exports.calculatePeriodEnd = calculatePeriodEnd;
exports.generateBillingCycles = generateBillingCycles;
exports.processBillingCycle = processBillingCycle;
exports.generateRecurringOrder = generateRecurringOrder;
exports.scheduleRecurringOrders = scheduleRecurringOrders;
exports.processPendingRecurringOrders = processPendingRecurringOrders;
exports.upgradeSubscription = upgradeSubscription;
exports.downgradeSubscription = downgradeSubscription;
exports.changeSubscriptionQuantity = changeSubscriptionQuantity;
exports.pauseSubscription = pauseSubscription;
exports.resumeSubscription = resumeSubscription;
exports.cancelSubscriptionImmediate = cancelSubscriptionImmediate;
exports.cancelSubscriptionAtPeriodEnd = cancelSubscriptionAtPeriodEnd;
exports.reactivateSubscription = reactivateSubscription;
exports.updatePaymentMethod = updatePaymentMethod;
exports.retryFailedPayment = retryFailedPayment;
exports.handleFailedPayment = handleFailedPayment;
exports.processDunningWorkflow = processDunningWorkflow;
exports.calculateProration = calculateProration;
exports.processSubscriptionRenewal = processSubscriptionRenewal;
exports.getSubscriptionsDueForRenewal = getSubscriptionsDueForRenewal;
exports.sendRenewalReminders = sendRenewalReminders;
exports.calculateSubscriptionMetrics = calculateSubscriptionMetrics;
exports.getRevenueForecast = getRevenueForecast;
exports.getCohortAnalysis = getCohortAnalysis;
exports.trackSubscriptionUsage = trackSubscriptionUsage;
exports.getSubscriptionUsageSummary = getSubscriptionUsageSummary;
/**
 * File: /reuse/order/subscription-recurring-kit.ts
 * Locator: WC-ORD-SUBREC-001
 * Purpose: Subscription & Recurring Orders - Subscription management, billing, renewals
 *
 * Upstream: Independent utility module for subscription and recurring order operations
 * Downstream: ../backend/subscription/*, Order modules, Billing services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 40 utility functions for subscription management, recurring orders, billing cycles
 *
 * LLM Context: Enterprise-grade subscription and recurring order utilities to compete with Oracle NetSuite.
 * Provides comprehensive subscription creation, plan management, billing cycle automation, recurring order generation,
 * subscription modifications, cancellations, renewals, payment method management, failed payment handling,
 * proration calculations, subscription analytics, dunning management, trial periods, commitment terms,
 * usage-based billing, tiered pricing, subscription migrations, and automated notifications.
 */
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================
/**
 * Subscription status lifecycle
 */
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["PENDING"] = "PENDING";
    SubscriptionStatus["TRIAL"] = "TRIAL";
    SubscriptionStatus["ACTIVE"] = "ACTIVE";
    SubscriptionStatus["PAST_DUE"] = "PAST_DUE";
    SubscriptionStatus["PAUSED"] = "PAUSED";
    SubscriptionStatus["SUSPENDED"] = "SUSPENDED";
    SubscriptionStatus["CANCELLED"] = "CANCELLED";
    SubscriptionStatus["EXPIRED"] = "EXPIRED";
    SubscriptionStatus["NON_RENEWING"] = "NON_RENEWING";
    SubscriptionStatus["PENDING_CANCELLATION"] = "PENDING_CANCELLATION";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
/**
 * Billing frequency for subscriptions
 */
var BillingFrequency;
(function (BillingFrequency) {
    BillingFrequency["DAILY"] = "DAILY";
    BillingFrequency["WEEKLY"] = "WEEKLY";
    BillingFrequency["BIWEEKLY"] = "BIWEEKLY";
    BillingFrequency["MONTHLY"] = "MONTHLY";
    BillingFrequency["QUARTERLY"] = "QUARTERLY";
    BillingFrequency["SEMIANNUAL"] = "SEMIANNUAL";
    BillingFrequency["ANNUAL"] = "ANNUAL";
    BillingFrequency["BIENNIAL"] = "BIENNIAL";
    BillingFrequency["CUSTOM"] = "CUSTOM";
})(BillingFrequency || (exports.BillingFrequency = BillingFrequency = {}));
/**
 * Subscription plan types
 */
var PlanType;
(function (PlanType) {
    PlanType["BASIC"] = "BASIC";
    PlanType["STANDARD"] = "STANDARD";
    PlanType["PREMIUM"] = "PREMIUM";
    PlanType["ENTERPRISE"] = "ENTERPRISE";
    PlanType["CUSTOM"] = "CUSTOM";
    PlanType["TIERED"] = "TIERED";
    PlanType["USAGE_BASED"] = "USAGE_BASED";
    PlanType["HYBRID"] = "HYBRID";
})(PlanType || (exports.PlanType = PlanType = {}));
/**
 * Proration methods
 */
var ProrationMethod;
(function (ProrationMethod) {
    ProrationMethod["FULL_PERIOD"] = "FULL_PERIOD";
    ProrationMethod["PRORATED_DAILY"] = "PRORATED_DAILY";
    ProrationMethod["PRORATED_HOURLY"] = "PRORATED_HOURLY";
    ProrationMethod["NO_PRORATION"] = "NO_PRORATION";
    ProrationMethod["CREDIT_BALANCE"] = "CREDIT_BALANCE";
})(ProrationMethod || (exports.ProrationMethod = ProrationMethod = {}));
/**
 * Renewal types
 */
var RenewalType;
(function (RenewalType) {
    RenewalType["AUTOMATIC"] = "AUTOMATIC";
    RenewalType["MANUAL"] = "MANUAL";
    RenewalType["OPT_IN"] = "OPT_IN";
    RenewalType["OPT_OUT"] = "OPT_OUT";
})(RenewalType || (exports.RenewalType = RenewalType = {}));
/**
 * Cancellation reasons
 */
var CancellationReason;
(function (CancellationReason) {
    CancellationReason["CUSTOMER_REQUEST"] = "CUSTOMER_REQUEST";
    CancellationReason["PAYMENT_FAILURE"] = "PAYMENT_FAILURE";
    CancellationReason["FRAUD"] = "FRAUD";
    CancellationReason["TOO_EXPENSIVE"] = "TOO_EXPENSIVE";
    CancellationReason["SWITCHING_TO_COMPETITOR"] = "SWITCHING_TO_COMPETITOR";
    CancellationReason["NOT_USING"] = "NOT_USING";
    CancellationReason["MISSING_FEATURES"] = "MISSING_FEATURES";
    CancellationReason["QUALITY_ISSUES"] = "QUALITY_ISSUES";
    CancellationReason["OTHER"] = "OTHER";
})(CancellationReason || (exports.CancellationReason = CancellationReason = {}));
/**
 * Payment method types
 */
var PaymentMethodType;
(function (PaymentMethodType) {
    PaymentMethodType["CREDIT_CARD"] = "CREDIT_CARD";
    PaymentMethodType["DEBIT_CARD"] = "DEBIT_CARD";
    PaymentMethodType["BANK_ACCOUNT"] = "BANK_ACCOUNT";
    PaymentMethodType["PAYPAL"] = "PAYPAL";
    PaymentMethodType["INVOICE"] = "INVOICE";
    PaymentMethodType["WIRE_TRANSFER"] = "WIRE_TRANSFER";
    PaymentMethodType["CRYPTOCURRENCY"] = "CRYPTOCURRENCY";
})(PaymentMethodType || (exports.PaymentMethodType = PaymentMethodType = {}));
/**
 * Dunning stages for failed payments
 */
var DunningStage;
(function (DunningStage) {
    DunningStage["NONE"] = "NONE";
    DunningStage["SOFT_DECLINE"] = "SOFT_DECLINE";
    DunningStage["RETRY_1"] = "RETRY_1";
    DunningStage["RETRY_2"] = "RETRY_2";
    DunningStage["RETRY_3"] = "RETRY_3";
    DunningStage["FINAL_NOTICE"] = "FINAL_NOTICE";
    DunningStage["SUSPENDED"] = "SUSPENDED";
    DunningStage["CANCELLED"] = "CANCELLED";
})(DunningStage || (exports.DunningStage = DunningStage = {}));
/**
 * Subscription modification types
 */
var ModificationType;
(function (ModificationType) {
    ModificationType["UPGRADE"] = "UPGRADE";
    ModificationType["DOWNGRADE"] = "DOWNGRADE";
    ModificationType["ADDON"] = "ADDON";
    ModificationType["REMOVE_ADDON"] = "REMOVE_ADDON";
    ModificationType["QUANTITY_CHANGE"] = "QUANTITY_CHANGE";
    ModificationType["PLAN_CHANGE"] = "PLAN_CHANGE";
    ModificationType["PAYMENT_METHOD_CHANGE"] = "PAYMENT_METHOD_CHANGE";
})(ModificationType || (exports.ModificationType = ModificationType = {}));
/**
 * Usage tracking units
 */
var UsageUnit;
(function (UsageUnit) {
    UsageUnit["API_CALLS"] = "API_CALLS";
    UsageUnit["USERS"] = "USERS";
    UsageUnit["STORAGE_GB"] = "STORAGE_GB";
    UsageUnit["BANDWIDTH_GB"] = "BANDWIDTH_GB";
    UsageUnit["TRANSACTIONS"] = "TRANSACTIONS";
    UsageUnit["HOURS"] = "HOURS";
    UsageUnit["UNITS"] = "UNITS";
    UsageUnit["CUSTOM"] = "CUSTOM";
})(UsageUnit || (exports.UsageUnit = UsageUnit = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Subscription Plan Model
 */
let SubscriptionPlan = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'subscription_plans',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['plan_code'], unique: true },
                { fields: ['plan_type'] },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _planId_decorators;
    let _planId_initializers = [];
    let _planId_extraInitializers = [];
    let _planCode_decorators;
    let _planCode_initializers = [];
    let _planCode_extraInitializers = [];
    let _planName_decorators;
    let _planName_initializers = [];
    let _planName_extraInitializers = [];
    let _planType_decorators;
    let _planType_initializers = [];
    let _planType_extraInitializers = [];
    let _billingFrequency_decorators;
    let _billingFrequency_initializers = [];
    let _billingFrequency_extraInitializers = [];
    let _price_decorators;
    let _price_initializers = [];
    let _price_extraInitializers = [];
    let _setupFee_decorators;
    let _setupFee_initializers = [];
    let _setupFee_extraInitializers = [];
    let _trialDays_decorators;
    let _trialDays_initializers = [];
    let _trialDays_extraInitializers = [];
    let _commitmentMonths_decorators;
    let _commitmentMonths_initializers = [];
    let _commitmentMonths_extraInitializers = [];
    let _features_decorators;
    let _features_initializers = [];
    let _features_extraInitializers = [];
    let _limits_decorators;
    let _limits_initializers = [];
    let _limits_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _subscriptions_decorators;
    let _subscriptions_initializers = [];
    let _subscriptions_extraInitializers = [];
    var SubscriptionPlan = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.planId = __runInitializers(this, _planId_initializers, void 0);
            this.planCode = (__runInitializers(this, _planId_extraInitializers), __runInitializers(this, _planCode_initializers, void 0));
            this.planName = (__runInitializers(this, _planCode_extraInitializers), __runInitializers(this, _planName_initializers, void 0));
            this.planType = (__runInitializers(this, _planName_extraInitializers), __runInitializers(this, _planType_initializers, void 0));
            this.billingFrequency = (__runInitializers(this, _planType_extraInitializers), __runInitializers(this, _billingFrequency_initializers, void 0));
            this.price = (__runInitializers(this, _billingFrequency_extraInitializers), __runInitializers(this, _price_initializers, void 0));
            this.setupFee = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _setupFee_initializers, void 0));
            this.trialDays = (__runInitializers(this, _setupFee_extraInitializers), __runInitializers(this, _trialDays_initializers, void 0));
            this.commitmentMonths = (__runInitializers(this, _trialDays_extraInitializers), __runInitializers(this, _commitmentMonths_initializers, void 0));
            this.features = (__runInitializers(this, _commitmentMonths_extraInitializers), __runInitializers(this, _features_initializers, void 0));
            this.limits = (__runInitializers(this, _features_extraInitializers), __runInitializers(this, _limits_initializers, void 0));
            this.isActive = (__runInitializers(this, _limits_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.metadata = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.subscriptions = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _subscriptions_initializers, void 0));
            __runInitializers(this, _subscriptions_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SubscriptionPlan");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _planId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _planCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique plan code' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                unique: true,
            }), sequelize_typescript_1.Index];
        _planName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan name' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _planType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan type', enum: PlanType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PlanType)),
                allowNull: false,
            })];
        _billingFrequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Billing frequency', enum: BillingFrequency }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(BillingFrequency)),
                allowNull: false,
            })];
        _price_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan price' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _setupFee_decorators = [(0, swagger_1.ApiProperty)({ description: 'Setup fee' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                defaultValue: 0,
            })];
        _trialDays_decorators = [(0, swagger_1.ApiProperty)({ description: 'Trial period in days' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                defaultValue: 0,
            })];
        _commitmentMonths_decorators = [(0, swagger_1.ApiProperty)({ description: 'Commitment period in months' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                defaultValue: 0,
            })];
        _features_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan features (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                defaultValue: [],
            })];
        _limits_decorators = [(0, swagger_1.ApiProperty)({ description: 'Usage limits (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                defaultValue: {},
            })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is plan active' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                defaultValue: true,
            }), sequelize_typescript_1.Index];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan metadata' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                defaultValue: {},
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _subscriptions_decorators = [(0, sequelize_typescript_1.HasMany)(() => Subscription)];
        __esDecorate(null, null, _planId_decorators, { kind: "field", name: "planId", static: false, private: false, access: { has: obj => "planId" in obj, get: obj => obj.planId, set: (obj, value) => { obj.planId = value; } }, metadata: _metadata }, _planId_initializers, _planId_extraInitializers);
        __esDecorate(null, null, _planCode_decorators, { kind: "field", name: "planCode", static: false, private: false, access: { has: obj => "planCode" in obj, get: obj => obj.planCode, set: (obj, value) => { obj.planCode = value; } }, metadata: _metadata }, _planCode_initializers, _planCode_extraInitializers);
        __esDecorate(null, null, _planName_decorators, { kind: "field", name: "planName", static: false, private: false, access: { has: obj => "planName" in obj, get: obj => obj.planName, set: (obj, value) => { obj.planName = value; } }, metadata: _metadata }, _planName_initializers, _planName_extraInitializers);
        __esDecorate(null, null, _planType_decorators, { kind: "field", name: "planType", static: false, private: false, access: { has: obj => "planType" in obj, get: obj => obj.planType, set: (obj, value) => { obj.planType = value; } }, metadata: _metadata }, _planType_initializers, _planType_extraInitializers);
        __esDecorate(null, null, _billingFrequency_decorators, { kind: "field", name: "billingFrequency", static: false, private: false, access: { has: obj => "billingFrequency" in obj, get: obj => obj.billingFrequency, set: (obj, value) => { obj.billingFrequency = value; } }, metadata: _metadata }, _billingFrequency_initializers, _billingFrequency_extraInitializers);
        __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: obj => "price" in obj, get: obj => obj.price, set: (obj, value) => { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
        __esDecorate(null, null, _setupFee_decorators, { kind: "field", name: "setupFee", static: false, private: false, access: { has: obj => "setupFee" in obj, get: obj => obj.setupFee, set: (obj, value) => { obj.setupFee = value; } }, metadata: _metadata }, _setupFee_initializers, _setupFee_extraInitializers);
        __esDecorate(null, null, _trialDays_decorators, { kind: "field", name: "trialDays", static: false, private: false, access: { has: obj => "trialDays" in obj, get: obj => obj.trialDays, set: (obj, value) => { obj.trialDays = value; } }, metadata: _metadata }, _trialDays_initializers, _trialDays_extraInitializers);
        __esDecorate(null, null, _commitmentMonths_decorators, { kind: "field", name: "commitmentMonths", static: false, private: false, access: { has: obj => "commitmentMonths" in obj, get: obj => obj.commitmentMonths, set: (obj, value) => { obj.commitmentMonths = value; } }, metadata: _metadata }, _commitmentMonths_initializers, _commitmentMonths_extraInitializers);
        __esDecorate(null, null, _features_decorators, { kind: "field", name: "features", static: false, private: false, access: { has: obj => "features" in obj, get: obj => obj.features, set: (obj, value) => { obj.features = value; } }, metadata: _metadata }, _features_initializers, _features_extraInitializers);
        __esDecorate(null, null, _limits_decorators, { kind: "field", name: "limits", static: false, private: false, access: { has: obj => "limits" in obj, get: obj => obj.limits, set: (obj, value) => { obj.limits = value; } }, metadata: _metadata }, _limits_initializers, _limits_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _subscriptions_decorators, { kind: "field", name: "subscriptions", static: false, private: false, access: { has: obj => "subscriptions" in obj, get: obj => obj.subscriptions, set: (obj, value) => { obj.subscriptions = value; } }, metadata: _metadata }, _subscriptions_initializers, _subscriptions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SubscriptionPlan = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SubscriptionPlan = _classThis;
})();
exports.SubscriptionPlan = SubscriptionPlan;
/**
 * Subscription Model
 */
let Subscription = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'subscriptions',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['subscription_number'], unique: true },
                { fields: ['customer_id'] },
                { fields: ['status'] },
                { fields: ['next_billing_date'] },
                { fields: ['plan_id'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateSubscriptionNumber_decorators;
    let _static_trackChanges_decorators;
    let _subscriptionId_decorators;
    let _subscriptionId_initializers = [];
    let _subscriptionId_extraInitializers = [];
    let _subscriptionNumber_decorators;
    let _subscriptionNumber_initializers = [];
    let _subscriptionNumber_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _planId_decorators;
    let _planId_initializers = [];
    let _planId_extraInitializers = [];
    let _plan_decorators;
    let _plan_initializers = [];
    let _plan_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _trialEndDate_decorators;
    let _trialEndDate_initializers = [];
    let _trialEndDate_extraInitializers = [];
    let _currentPeriodStart_decorators;
    let _currentPeriodStart_initializers = [];
    let _currentPeriodStart_extraInitializers = [];
    let _currentPeriodEnd_decorators;
    let _currentPeriodEnd_initializers = [];
    let _currentPeriodEnd_extraInitializers = [];
    let _nextBillingDate_decorators;
    let _nextBillingDate_initializers = [];
    let _nextBillingDate_extraInitializers = [];
    let _billingAmount_decorators;
    let _billingAmount_initializers = [];
    let _billingAmount_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _renewalType_decorators;
    let _renewalType_initializers = [];
    let _renewalType_extraInitializers = [];
    let _paymentMethodId_decorators;
    let _paymentMethodId_initializers = [];
    let _paymentMethodId_extraInitializers = [];
    let _dunningStage_decorators;
    let _dunningStage_initializers = [];
    let _dunningStage_extraInitializers = [];
    let _failedPaymentCount_decorators;
    let _failedPaymentCount_initializers = [];
    let _failedPaymentCount_extraInitializers = [];
    let _lastPaymentDate_decorators;
    let _lastPaymentDate_initializers = [];
    let _lastPaymentDate_extraInitializers = [];
    let _cancellationDate_decorators;
    let _cancellationDate_initializers = [];
    let _cancellationDate_extraInitializers = [];
    let _cancellationReason_decorators;
    let _cancellationReason_initializers = [];
    let _cancellationReason_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _recurringOrders_decorators;
    let _recurringOrders_initializers = [];
    let _recurringOrders_extraInitializers = [];
    let _history_decorators;
    let _history_initializers = [];
    let _history_extraInitializers = [];
    var Subscription = _classThis = class extends _classSuper {
        static async generateSubscriptionNumber(instance) {
            if (!instance.subscriptionNumber) {
                const count = await Subscription.count();
                instance.subscriptionNumber = `SUB-${Date.now()}-${(count + 1).toString().padStart(6, '0')}`;
            }
        }
        static async trackChanges(instance) {
            if (instance.changed()) {
                await SubscriptionHistory.create({
                    subscriptionId: instance.subscriptionId,
                    changeType: 'UPDATE',
                    changedFields: instance.changed(),
                    previousValues: instance._previousDataValues,
                    newValues: instance.dataValues,
                    changedBy: 'SYSTEM',
                });
            }
        }
        constructor() {
            super(...arguments);
            this.subscriptionId = __runInitializers(this, _subscriptionId_initializers, void 0);
            this.subscriptionNumber = (__runInitializers(this, _subscriptionId_extraInitializers), __runInitializers(this, _subscriptionNumber_initializers, void 0));
            this.customerId = (__runInitializers(this, _subscriptionNumber_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.planId = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _planId_initializers, void 0));
            this.plan = (__runInitializers(this, _planId_extraInitializers), __runInitializers(this, _plan_initializers, void 0));
            this.status = (__runInitializers(this, _plan_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.startDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.trialEndDate = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _trialEndDate_initializers, void 0));
            this.currentPeriodStart = (__runInitializers(this, _trialEndDate_extraInitializers), __runInitializers(this, _currentPeriodStart_initializers, void 0));
            this.currentPeriodEnd = (__runInitializers(this, _currentPeriodStart_extraInitializers), __runInitializers(this, _currentPeriodEnd_initializers, void 0));
            this.nextBillingDate = (__runInitializers(this, _currentPeriodEnd_extraInitializers), __runInitializers(this, _nextBillingDate_initializers, void 0));
            this.billingAmount = (__runInitializers(this, _nextBillingDate_extraInitializers), __runInitializers(this, _billingAmount_initializers, void 0));
            this.quantity = (__runInitializers(this, _billingAmount_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
            this.renewalType = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _renewalType_initializers, void 0));
            this.paymentMethodId = (__runInitializers(this, _renewalType_extraInitializers), __runInitializers(this, _paymentMethodId_initializers, void 0));
            this.dunningStage = (__runInitializers(this, _paymentMethodId_extraInitializers), __runInitializers(this, _dunningStage_initializers, void 0));
            this.failedPaymentCount = (__runInitializers(this, _dunningStage_extraInitializers), __runInitializers(this, _failedPaymentCount_initializers, void 0));
            this.lastPaymentDate = (__runInitializers(this, _failedPaymentCount_extraInitializers), __runInitializers(this, _lastPaymentDate_initializers, void 0));
            this.cancellationDate = (__runInitializers(this, _lastPaymentDate_extraInitializers), __runInitializers(this, _cancellationDate_initializers, void 0));
            this.cancellationReason = (__runInitializers(this, _cancellationDate_extraInitializers), __runInitializers(this, _cancellationReason_initializers, void 0));
            this.metadata = (__runInitializers(this, _cancellationReason_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.recurringOrders = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _recurringOrders_initializers, void 0));
            this.history = (__runInitializers(this, _recurringOrders_extraInitializers), __runInitializers(this, _history_initializers, void 0));
            __runInitializers(this, _history_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Subscription");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _subscriptionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Subscription ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _subscriptionNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique subscription number' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                unique: true,
            }), sequelize_typescript_1.Index];
        _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _planId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Plan ID' }), (0, sequelize_typescript_1.ForeignKey)(() => SubscriptionPlan), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _plan_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => SubscriptionPlan)];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Subscription status', enum: SubscriptionStatus }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(SubscriptionStatus)),
                allowNull: false,
                defaultValue: SubscriptionStatus.PENDING,
            }), sequelize_typescript_1.Index];
        _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _trialEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Trial end date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _currentPeriodStart_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current period start' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _currentPeriodEnd_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current period end' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _nextBillingDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Next billing date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _billingAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Billing amount' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _quantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                defaultValue: 1,
            })];
        _renewalType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Renewal type', enum: RenewalType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RenewalType)),
                defaultValue: RenewalType.AUTOMATIC,
            })];
        _paymentMethodId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment method ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            })];
        _dunningStage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dunning stage', enum: DunningStage }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(DunningStage)),
                defaultValue: DunningStage.NONE,
            })];
        _failedPaymentCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Failed payment count' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                defaultValue: 0,
            })];
        _lastPaymentDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last payment date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _cancellationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cancellation date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _cancellationReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cancellation reason', enum: CancellationReason }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(CancellationReason)),
                allowNull: true,
            })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Subscription metadata' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                defaultValue: {},
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _recurringOrders_decorators = [(0, sequelize_typescript_1.HasMany)(() => RecurringOrder)];
        _history_decorators = [(0, sequelize_typescript_1.HasMany)(() => SubscriptionHistory)];
        _static_generateSubscriptionNumber_decorators = [sequelize_typescript_1.BeforeCreate];
        _static_trackChanges_decorators = [sequelize_typescript_1.BeforeUpdate];
        __esDecorate(_classThis, null, _static_generateSubscriptionNumber_decorators, { kind: "method", name: "generateSubscriptionNumber", static: true, private: false, access: { has: obj => "generateSubscriptionNumber" in obj, get: obj => obj.generateSubscriptionNumber }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(_classThis, null, _static_trackChanges_decorators, { kind: "method", name: "trackChanges", static: true, private: false, access: { has: obj => "trackChanges" in obj, get: obj => obj.trackChanges }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _subscriptionId_decorators, { kind: "field", name: "subscriptionId", static: false, private: false, access: { has: obj => "subscriptionId" in obj, get: obj => obj.subscriptionId, set: (obj, value) => { obj.subscriptionId = value; } }, metadata: _metadata }, _subscriptionId_initializers, _subscriptionId_extraInitializers);
        __esDecorate(null, null, _subscriptionNumber_decorators, { kind: "field", name: "subscriptionNumber", static: false, private: false, access: { has: obj => "subscriptionNumber" in obj, get: obj => obj.subscriptionNumber, set: (obj, value) => { obj.subscriptionNumber = value; } }, metadata: _metadata }, _subscriptionNumber_initializers, _subscriptionNumber_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _planId_decorators, { kind: "field", name: "planId", static: false, private: false, access: { has: obj => "planId" in obj, get: obj => obj.planId, set: (obj, value) => { obj.planId = value; } }, metadata: _metadata }, _planId_initializers, _planId_extraInitializers);
        __esDecorate(null, null, _plan_decorators, { kind: "field", name: "plan", static: false, private: false, access: { has: obj => "plan" in obj, get: obj => obj.plan, set: (obj, value) => { obj.plan = value; } }, metadata: _metadata }, _plan_initializers, _plan_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _trialEndDate_decorators, { kind: "field", name: "trialEndDate", static: false, private: false, access: { has: obj => "trialEndDate" in obj, get: obj => obj.trialEndDate, set: (obj, value) => { obj.trialEndDate = value; } }, metadata: _metadata }, _trialEndDate_initializers, _trialEndDate_extraInitializers);
        __esDecorate(null, null, _currentPeriodStart_decorators, { kind: "field", name: "currentPeriodStart", static: false, private: false, access: { has: obj => "currentPeriodStart" in obj, get: obj => obj.currentPeriodStart, set: (obj, value) => { obj.currentPeriodStart = value; } }, metadata: _metadata }, _currentPeriodStart_initializers, _currentPeriodStart_extraInitializers);
        __esDecorate(null, null, _currentPeriodEnd_decorators, { kind: "field", name: "currentPeriodEnd", static: false, private: false, access: { has: obj => "currentPeriodEnd" in obj, get: obj => obj.currentPeriodEnd, set: (obj, value) => { obj.currentPeriodEnd = value; } }, metadata: _metadata }, _currentPeriodEnd_initializers, _currentPeriodEnd_extraInitializers);
        __esDecorate(null, null, _nextBillingDate_decorators, { kind: "field", name: "nextBillingDate", static: false, private: false, access: { has: obj => "nextBillingDate" in obj, get: obj => obj.nextBillingDate, set: (obj, value) => { obj.nextBillingDate = value; } }, metadata: _metadata }, _nextBillingDate_initializers, _nextBillingDate_extraInitializers);
        __esDecorate(null, null, _billingAmount_decorators, { kind: "field", name: "billingAmount", static: false, private: false, access: { has: obj => "billingAmount" in obj, get: obj => obj.billingAmount, set: (obj, value) => { obj.billingAmount = value; } }, metadata: _metadata }, _billingAmount_initializers, _billingAmount_extraInitializers);
        __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
        __esDecorate(null, null, _renewalType_decorators, { kind: "field", name: "renewalType", static: false, private: false, access: { has: obj => "renewalType" in obj, get: obj => obj.renewalType, set: (obj, value) => { obj.renewalType = value; } }, metadata: _metadata }, _renewalType_initializers, _renewalType_extraInitializers);
        __esDecorate(null, null, _paymentMethodId_decorators, { kind: "field", name: "paymentMethodId", static: false, private: false, access: { has: obj => "paymentMethodId" in obj, get: obj => obj.paymentMethodId, set: (obj, value) => { obj.paymentMethodId = value; } }, metadata: _metadata }, _paymentMethodId_initializers, _paymentMethodId_extraInitializers);
        __esDecorate(null, null, _dunningStage_decorators, { kind: "field", name: "dunningStage", static: false, private: false, access: { has: obj => "dunningStage" in obj, get: obj => obj.dunningStage, set: (obj, value) => { obj.dunningStage = value; } }, metadata: _metadata }, _dunningStage_initializers, _dunningStage_extraInitializers);
        __esDecorate(null, null, _failedPaymentCount_decorators, { kind: "field", name: "failedPaymentCount", static: false, private: false, access: { has: obj => "failedPaymentCount" in obj, get: obj => obj.failedPaymentCount, set: (obj, value) => { obj.failedPaymentCount = value; } }, metadata: _metadata }, _failedPaymentCount_initializers, _failedPaymentCount_extraInitializers);
        __esDecorate(null, null, _lastPaymentDate_decorators, { kind: "field", name: "lastPaymentDate", static: false, private: false, access: { has: obj => "lastPaymentDate" in obj, get: obj => obj.lastPaymentDate, set: (obj, value) => { obj.lastPaymentDate = value; } }, metadata: _metadata }, _lastPaymentDate_initializers, _lastPaymentDate_extraInitializers);
        __esDecorate(null, null, _cancellationDate_decorators, { kind: "field", name: "cancellationDate", static: false, private: false, access: { has: obj => "cancellationDate" in obj, get: obj => obj.cancellationDate, set: (obj, value) => { obj.cancellationDate = value; } }, metadata: _metadata }, _cancellationDate_initializers, _cancellationDate_extraInitializers);
        __esDecorate(null, null, _cancellationReason_decorators, { kind: "field", name: "cancellationReason", static: false, private: false, access: { has: obj => "cancellationReason" in obj, get: obj => obj.cancellationReason, set: (obj, value) => { obj.cancellationReason = value; } }, metadata: _metadata }, _cancellationReason_initializers, _cancellationReason_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _recurringOrders_decorators, { kind: "field", name: "recurringOrders", static: false, private: false, access: { has: obj => "recurringOrders" in obj, get: obj => obj.recurringOrders, set: (obj, value) => { obj.recurringOrders = value; } }, metadata: _metadata }, _recurringOrders_initializers, _recurringOrders_extraInitializers);
        __esDecorate(null, null, _history_decorators, { kind: "field", name: "history", static: false, private: false, access: { has: obj => "history" in obj, get: obj => obj.history, set: (obj, value) => { obj.history = value; } }, metadata: _metadata }, _history_initializers, _history_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Subscription = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Subscription = _classThis;
})();
exports.Subscription = Subscription;
/**
 * Recurring Order Model
 */
let RecurringOrder = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'recurring_orders',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['subscription_id'] },
                { fields: ['order_number'], unique: true },
                { fields: ['status'] },
                { fields: ['scheduled_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _recurringOrderId_decorators;
    let _recurringOrderId_initializers = [];
    let _recurringOrderId_extraInitializers = [];
    let _subscriptionId_decorators;
    let _subscriptionId_initializers = [];
    let _subscriptionId_extraInitializers = [];
    let _subscription_decorators;
    let _subscription_initializers = [];
    let _subscription_extraInitializers = [];
    let _orderNumber_decorators;
    let _orderNumber_initializers = [];
    let _orderNumber_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _generatedDate_decorators;
    let _generatedDate_initializers = [];
    let _generatedDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _orderAmount_decorators;
    let _orderAmount_initializers = [];
    let _orderAmount_extraInitializers = [];
    let _orderData_decorators;
    let _orderData_initializers = [];
    let _orderData_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var RecurringOrder = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.recurringOrderId = __runInitializers(this, _recurringOrderId_initializers, void 0);
            this.subscriptionId = (__runInitializers(this, _recurringOrderId_extraInitializers), __runInitializers(this, _subscriptionId_initializers, void 0));
            this.subscription = (__runInitializers(this, _subscriptionId_extraInitializers), __runInitializers(this, _subscription_initializers, void 0));
            this.orderNumber = (__runInitializers(this, _subscription_extraInitializers), __runInitializers(this, _orderNumber_initializers, void 0));
            this.scheduledDate = (__runInitializers(this, _orderNumber_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
            this.generatedDate = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _generatedDate_initializers, void 0));
            this.status = (__runInitializers(this, _generatedDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.orderAmount = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _orderAmount_initializers, void 0));
            this.orderData = (__runInitializers(this, _orderAmount_extraInitializers), __runInitializers(this, _orderData_initializers, void 0));
            this.createdAt = (__runInitializers(this, _orderData_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "RecurringOrder");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _recurringOrderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recurring order ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _subscriptionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Subscription ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Subscription), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _subscription_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Subscription)];
        _orderNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order number' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                unique: true,
            }), sequelize_typescript_1.Index];
        _scheduledDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _generatedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Generated date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('SCHEDULED', 'GENERATED', 'PROCESSING', 'COMPLETED', 'FAILED', 'SKIPPED', 'CANCELLED'),
                defaultValue: 'SCHEDULED',
            }), sequelize_typescript_1.Index];
        _orderAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order amount' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _orderData_decorators = [(0, swagger_1.ApiProperty)({ description: 'Order data (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                defaultValue: {},
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _recurringOrderId_decorators, { kind: "field", name: "recurringOrderId", static: false, private: false, access: { has: obj => "recurringOrderId" in obj, get: obj => obj.recurringOrderId, set: (obj, value) => { obj.recurringOrderId = value; } }, metadata: _metadata }, _recurringOrderId_initializers, _recurringOrderId_extraInitializers);
        __esDecorate(null, null, _subscriptionId_decorators, { kind: "field", name: "subscriptionId", static: false, private: false, access: { has: obj => "subscriptionId" in obj, get: obj => obj.subscriptionId, set: (obj, value) => { obj.subscriptionId = value; } }, metadata: _metadata }, _subscriptionId_initializers, _subscriptionId_extraInitializers);
        __esDecorate(null, null, _subscription_decorators, { kind: "field", name: "subscription", static: false, private: false, access: { has: obj => "subscription" in obj, get: obj => obj.subscription, set: (obj, value) => { obj.subscription = value; } }, metadata: _metadata }, _subscription_initializers, _subscription_extraInitializers);
        __esDecorate(null, null, _orderNumber_decorators, { kind: "field", name: "orderNumber", static: false, private: false, access: { has: obj => "orderNumber" in obj, get: obj => obj.orderNumber, set: (obj, value) => { obj.orderNumber = value; } }, metadata: _metadata }, _orderNumber_initializers, _orderNumber_extraInitializers);
        __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
        __esDecorate(null, null, _generatedDate_decorators, { kind: "field", name: "generatedDate", static: false, private: false, access: { has: obj => "generatedDate" in obj, get: obj => obj.generatedDate, set: (obj, value) => { obj.generatedDate = value; } }, metadata: _metadata }, _generatedDate_initializers, _generatedDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _orderAmount_decorators, { kind: "field", name: "orderAmount", static: false, private: false, access: { has: obj => "orderAmount" in obj, get: obj => obj.orderAmount, set: (obj, value) => { obj.orderAmount = value; } }, metadata: _metadata }, _orderAmount_initializers, _orderAmount_extraInitializers);
        __esDecorate(null, null, _orderData_decorators, { kind: "field", name: "orderData", static: false, private: false, access: { has: obj => "orderData" in obj, get: obj => obj.orderData, set: (obj, value) => { obj.orderData = value; } }, metadata: _metadata }, _orderData_initializers, _orderData_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RecurringOrder = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RecurringOrder = _classThis;
})();
exports.RecurringOrder = RecurringOrder;
/**
 * Subscription History Model
 */
let SubscriptionHistory = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'subscription_history',
            timestamps: true,
            indexes: [
                { fields: ['subscription_id'] },
                { fields: ['change_type'] },
                { fields: ['created_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _historyId_decorators;
    let _historyId_initializers = [];
    let _historyId_extraInitializers = [];
    let _subscriptionId_decorators;
    let _subscriptionId_initializers = [];
    let _subscriptionId_extraInitializers = [];
    let _subscription_decorators;
    let _subscription_initializers = [];
    let _subscription_extraInitializers = [];
    let _changeType_decorators;
    let _changeType_initializers = [];
    let _changeType_extraInitializers = [];
    let _changedFields_decorators;
    let _changedFields_initializers = [];
    let _changedFields_extraInitializers = [];
    let _previousValues_decorators;
    let _previousValues_initializers = [];
    let _previousValues_extraInitializers = [];
    let _newValues_decorators;
    let _newValues_initializers = [];
    let _newValues_extraInitializers = [];
    let _changedBy_decorators;
    let _changedBy_initializers = [];
    let _changedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    var SubscriptionHistory = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.historyId = __runInitializers(this, _historyId_initializers, void 0);
            this.subscriptionId = (__runInitializers(this, _historyId_extraInitializers), __runInitializers(this, _subscriptionId_initializers, void 0));
            this.subscription = (__runInitializers(this, _subscriptionId_extraInitializers), __runInitializers(this, _subscription_initializers, void 0));
            this.changeType = (__runInitializers(this, _subscription_extraInitializers), __runInitializers(this, _changeType_initializers, void 0));
            this.changedFields = (__runInitializers(this, _changeType_extraInitializers), __runInitializers(this, _changedFields_initializers, void 0));
            this.previousValues = (__runInitializers(this, _changedFields_extraInitializers), __runInitializers(this, _previousValues_initializers, void 0));
            this.newValues = (__runInitializers(this, _previousValues_extraInitializers), __runInitializers(this, _newValues_initializers, void 0));
            this.changedBy = (__runInitializers(this, _newValues_extraInitializers), __runInitializers(this, _changedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _changedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SubscriptionHistory");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _historyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'History ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _subscriptionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Subscription ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Subscription), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _subscription_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Subscription)];
        _changeType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Change type' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _changedFields_decorators = [(0, swagger_1.ApiProperty)({ description: 'Changed fields' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                defaultValue: [],
            })];
        _previousValues_decorators = [(0, swagger_1.ApiProperty)({ description: 'Previous values' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                defaultValue: {},
            })];
        _newValues_decorators = [(0, swagger_1.ApiProperty)({ description: 'New values' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                defaultValue: {},
            })];
        _changedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Changed by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        __esDecorate(null, null, _historyId_decorators, { kind: "field", name: "historyId", static: false, private: false, access: { has: obj => "historyId" in obj, get: obj => obj.historyId, set: (obj, value) => { obj.historyId = value; } }, metadata: _metadata }, _historyId_initializers, _historyId_extraInitializers);
        __esDecorate(null, null, _subscriptionId_decorators, { kind: "field", name: "subscriptionId", static: false, private: false, access: { has: obj => "subscriptionId" in obj, get: obj => obj.subscriptionId, set: (obj, value) => { obj.subscriptionId = value; } }, metadata: _metadata }, _subscriptionId_initializers, _subscriptionId_extraInitializers);
        __esDecorate(null, null, _subscription_decorators, { kind: "field", name: "subscription", static: false, private: false, access: { has: obj => "subscription" in obj, get: obj => obj.subscription, set: (obj, value) => { obj.subscription = value; } }, metadata: _metadata }, _subscription_initializers, _subscription_extraInitializers);
        __esDecorate(null, null, _changeType_decorators, { kind: "field", name: "changeType", static: false, private: false, access: { has: obj => "changeType" in obj, get: obj => obj.changeType, set: (obj, value) => { obj.changeType = value; } }, metadata: _metadata }, _changeType_initializers, _changeType_extraInitializers);
        __esDecorate(null, null, _changedFields_decorators, { kind: "field", name: "changedFields", static: false, private: false, access: { has: obj => "changedFields" in obj, get: obj => obj.changedFields, set: (obj, value) => { obj.changedFields = value; } }, metadata: _metadata }, _changedFields_initializers, _changedFields_extraInitializers);
        __esDecorate(null, null, _previousValues_decorators, { kind: "field", name: "previousValues", static: false, private: false, access: { has: obj => "previousValues" in obj, get: obj => obj.previousValues, set: (obj, value) => { obj.previousValues = value; } }, metadata: _metadata }, _previousValues_initializers, _previousValues_extraInitializers);
        __esDecorate(null, null, _newValues_decorators, { kind: "field", name: "newValues", static: false, private: false, access: { has: obj => "newValues" in obj, get: obj => obj.newValues, set: (obj, value) => { obj.newValues = value; } }, metadata: _metadata }, _newValues_initializers, _newValues_extraInitializers);
        __esDecorate(null, null, _changedBy_decorators, { kind: "field", name: "changedBy", static: false, private: false, access: { has: obj => "changedBy" in obj, get: obj => obj.changedBy, set: (obj, value) => { obj.changedBy = value; } }, metadata: _metadata }, _changedBy_initializers, _changedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SubscriptionHistory = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SubscriptionHistory = _classThis;
})();
exports.SubscriptionHistory = SubscriptionHistory;
/**
 * Usage Tracking Model
 */
let SubscriptionUsage = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'subscription_usage',
            timestamps: true,
            indexes: [
                { fields: ['subscription_id'] },
                { fields: ['usage_unit'] },
                { fields: ['usage_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _usageId_decorators;
    let _usageId_initializers = [];
    let _usageId_extraInitializers = [];
    let _subscriptionId_decorators;
    let _subscriptionId_initializers = [];
    let _subscriptionId_extraInitializers = [];
    let _subscription_decorators;
    let _subscription_initializers = [];
    let _subscription_extraInitializers = [];
    let _usageUnit_decorators;
    let _usageUnit_initializers = [];
    let _usageUnit_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _usageDate_decorators;
    let _usageDate_initializers = [];
    let _usageDate_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    var SubscriptionUsage = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.usageId = __runInitializers(this, _usageId_initializers, void 0);
            this.subscriptionId = (__runInitializers(this, _usageId_extraInitializers), __runInitializers(this, _subscriptionId_initializers, void 0));
            this.subscription = (__runInitializers(this, _subscriptionId_extraInitializers), __runInitializers(this, _subscription_initializers, void 0));
            this.usageUnit = (__runInitializers(this, _subscription_extraInitializers), __runInitializers(this, _usageUnit_initializers, void 0));
            this.quantity = (__runInitializers(this, _usageUnit_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
            this.usageDate = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _usageDate_initializers, void 0));
            this.metadata = (__runInitializers(this, _usageDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SubscriptionUsage");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _usageId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Usage ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _subscriptionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Subscription ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Subscription), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _subscription_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Subscription)];
        _usageUnit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Usage unit', enum: UsageUnit }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(UsageUnit)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _quantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity used' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 4),
                allowNull: false,
            })];
        _usageDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Usage date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Usage metadata' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                defaultValue: {},
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        __esDecorate(null, null, _usageId_decorators, { kind: "field", name: "usageId", static: false, private: false, access: { has: obj => "usageId" in obj, get: obj => obj.usageId, set: (obj, value) => { obj.usageId = value; } }, metadata: _metadata }, _usageId_initializers, _usageId_extraInitializers);
        __esDecorate(null, null, _subscriptionId_decorators, { kind: "field", name: "subscriptionId", static: false, private: false, access: { has: obj => "subscriptionId" in obj, get: obj => obj.subscriptionId, set: (obj, value) => { obj.subscriptionId = value; } }, metadata: _metadata }, _subscriptionId_initializers, _subscriptionId_extraInitializers);
        __esDecorate(null, null, _subscription_decorators, { kind: "field", name: "subscription", static: false, private: false, access: { has: obj => "subscription" in obj, get: obj => obj.subscription, set: (obj, value) => { obj.subscription = value; } }, metadata: _metadata }, _subscription_initializers, _subscription_extraInitializers);
        __esDecorate(null, null, _usageUnit_decorators, { kind: "field", name: "usageUnit", static: false, private: false, access: { has: obj => "usageUnit" in obj, get: obj => obj.usageUnit, set: (obj, value) => { obj.usageUnit = value; } }, metadata: _metadata }, _usageUnit_initializers, _usageUnit_extraInitializers);
        __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
        __esDecorate(null, null, _usageDate_decorators, { kind: "field", name: "usageDate", static: false, private: false, access: { has: obj => "usageDate" in obj, get: obj => obj.usageDate, set: (obj, value) => { obj.usageDate = value; } }, metadata: _metadata }, _usageDate_initializers, _usageDate_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SubscriptionUsage = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SubscriptionUsage = _classThis;
})();
exports.SubscriptionUsage = SubscriptionUsage;
// ============================================================================
// SUBSCRIPTION CREATION & ENROLLMENT FUNCTIONS
// ============================================================================
/**
 * Create new subscription with plan enrollment
 *
 * @param customerId - Customer identifier
 * @param planId - Subscription plan ID
 * @param options - Additional subscription options
 * @returns Created subscription
 *
 * @example
 * const subscription = await createSubscription('CUST-123', 'PLAN-456', {
 *   quantity: 5,
 *   startDate: new Date(),
 *   paymentMethodId: 'pm_123'
 * });
 */
async function createSubscription(customerId, planId, options = {}) {
    try {
        const plan = await SubscriptionPlan.findByPk(planId);
        if (!plan) {
            throw new common_1.NotFoundException(`Subscription plan ${planId} not found`);
        }
        if (!plan.isActive) {
            throw new common_1.BadRequestException('Subscription plan is not active');
        }
        const startDate = options.startDate || new Date();
        const quantity = options.quantity || 1;
        const trialDays = options.trialDays ?? plan.trialDays;
        const trialEndDate = trialDays > 0
            ? new Date(startDate.getTime() + trialDays * 24 * 60 * 60 * 1000)
            : null;
        const currentPeriodStart = trialEndDate || startDate;
        const currentPeriodEnd = calculatePeriodEnd(currentPeriodStart, plan.billingFrequency);
        const nextBillingDate = trialEndDate || currentPeriodEnd;
        const subscription = await Subscription.create({
            customerId,
            planId,
            status: trialDays > 0 ? SubscriptionStatus.TRIAL : SubscriptionStatus.ACTIVE,
            startDate,
            trialEndDate,
            currentPeriodStart,
            currentPeriodEnd,
            nextBillingDate,
            billingAmount: plan.price * quantity,
            quantity,
            paymentMethodId: options.paymentMethodId,
            metadata: options.metadata || {},
        });
        return subscription;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create subscription: ${error.message}`);
    }
}
/**
 * Enroll customer in trial subscription
 *
 * @param customerId - Customer identifier
 * @param planId - Plan identifier
 * @param trialDays - Number of trial days
 * @returns Trial subscription
 */
async function enrollInTrial(customerId, planId, trialDays) {
    try {
        return await createSubscription(customerId, planId, {
            trialDays,
            quantity: 1,
        });
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to enroll in trial: ${error.message}`);
    }
}
/**
 * Convert trial subscription to paid
 *
 * @param subscriptionId - Subscription identifier
 * @param paymentMethodId - Payment method to use
 * @returns Updated subscription
 */
async function convertTrialToPaid(subscriptionId, paymentMethodId) {
    try {
        const subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        if (subscription.status !== SubscriptionStatus.TRIAL) {
            throw new common_1.BadRequestException('Subscription is not in trial status');
        }
        subscription.status = SubscriptionStatus.ACTIVE;
        subscription.paymentMethodId = paymentMethodId;
        subscription.trialEndDate = new Date();
        await subscription.save();
        return subscription;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to convert trial: ${error.message}`);
    }
}
/**
 * Create subscription with commitment term
 *
 * @param customerId - Customer identifier
 * @param planId - Plan identifier
 * @param commitmentMonths - Commitment period in months
 * @param discountPercent - Discount for commitment
 * @returns Committed subscription
 */
async function createCommitmentSubscription(customerId, planId, commitmentMonths, discountPercent = 0) {
    try {
        const plan = await SubscriptionPlan.findByPk(planId);
        if (!plan) {
            throw new common_1.NotFoundException('Plan not found');
        }
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + commitmentMonths);
        const discountedAmount = plan.price * (1 - discountPercent / 100);
        const subscription = await createSubscription(customerId, planId, {
            startDate,
            metadata: {
                commitmentMonths,
                commitmentEndDate: endDate,
                discountPercent,
                originalPrice: plan.price,
            },
        });
        subscription.billingAmount = discountedAmount;
        subscription.endDate = endDate;
        await subscription.save();
        return subscription;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create commitment subscription: ${error.message}`);
    }
}
// ============================================================================
// SUBSCRIPTION PLAN & TIER MANAGEMENT
// ============================================================================
/**
 * Create subscription plan
 *
 * @param planData - Plan configuration
 * @returns Created plan
 */
async function createSubscriptionPlan(planData) {
    try {
        const plan = await SubscriptionPlan.create({
            planCode: planData.planId,
            planName: planData.planName,
            planType: planData.planType,
            billingFrequency: planData.billingFrequency,
            price: planData.price,
            setupFee: planData.setupFee || 0,
            trialDays: planData.trialDays || 0,
            commitmentMonths: planData.commitmentMonths || 0,
            features: planData.features || [],
            limits: planData.limits || {},
            metadata: planData.metadata || {},
            isActive: true,
        });
        return plan;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create plan: ${error.message}`);
    }
}
/**
 * Update subscription plan pricing
 *
 * @param planId - Plan identifier
 * @param newPrice - New price
 * @param effectiveDate - When price change takes effect
 * @returns Updated plan
 */
async function updatePlanPricing(planId, newPrice, effectiveDate = new Date()) {
    try {
        const plan = await SubscriptionPlan.findByPk(planId);
        if (!plan) {
            throw new common_1.NotFoundException('Plan not found');
        }
        plan.price = newPrice;
        plan.metadata = {
            ...plan.metadata,
            priceHistory: [
                ...(plan.metadata.priceHistory || []),
                {
                    price: plan.price,
                    effectiveDate,
                    changedAt: new Date(),
                },
            ],
        };
        await plan.save();
        return plan;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to update plan pricing: ${error.message}`);
    }
}
/**
 * Get active subscription plans
 *
 * @param planType - Optional plan type filter
 * @returns Array of active plans
 */
async function getActivePlans(planType) {
    try {
        const where = { isActive: true };
        if (planType) {
            where.planType = planType;
        }
        return await SubscriptionPlan.findAll({ where });
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to get active plans: ${error.message}`);
    }
}
/**
 * Compare subscription plans
 *
 * @param planIds - Array of plan IDs to compare
 * @returns Comparison matrix
 */
async function comparePlans(planIds) {
    try {
        const plans = await SubscriptionPlan.findAll({
            where: { planId: planIds },
        });
        return {
            plans: plans.map(plan => ({
                planId: plan.planId,
                planName: plan.planName,
                price: plan.price,
                billingFrequency: plan.billingFrequency,
                features: plan.features,
                limits: plan.limits,
            })),
            comparison: {
                priceRange: {
                    min: Math.min(...plans.map(p => p.price)),
                    max: Math.max(...plans.map(p => p.price)),
                },
                featuresUnion: [...new Set(plans.flatMap(p => p.features))],
            },
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to compare plans: ${error.message}`);
    }
}
// ============================================================================
// BILLING CYCLE MANAGEMENT
// ============================================================================
/**
 * Calculate next billing date
 *
 * @param currentDate - Current billing date
 * @param frequency - Billing frequency
 * @returns Next billing date
 */
function calculateNextBillingDate(currentDate, frequency) {
    const nextDate = new Date(currentDate);
    switch (frequency) {
        case BillingFrequency.DAILY:
            nextDate.setDate(nextDate.getDate() + 1);
            break;
        case BillingFrequency.WEEKLY:
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case BillingFrequency.BIWEEKLY:
            nextDate.setDate(nextDate.getDate() + 14);
            break;
        case BillingFrequency.MONTHLY:
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
        case BillingFrequency.QUARTERLY:
            nextDate.setMonth(nextDate.getMonth() + 3);
            break;
        case BillingFrequency.SEMIANNUAL:
            nextDate.setMonth(nextDate.getMonth() + 6);
            break;
        case BillingFrequency.ANNUAL:
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
        case BillingFrequency.BIENNIAL:
            nextDate.setFullYear(nextDate.getFullYear() + 2);
            break;
    }
    return nextDate;
}
/**
 * Calculate period end date
 *
 * @param startDate - Period start date
 * @param frequency - Billing frequency
 * @returns Period end date
 */
function calculatePeriodEnd(startDate, frequency) {
    const endDate = calculateNextBillingDate(startDate, frequency);
    endDate.setSeconds(endDate.getSeconds() - 1);
    return endDate;
}
/**
 * Generate billing cycles for subscription period
 *
 * @param subscriptionId - Subscription identifier
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of billing cycles
 */
async function generateBillingCycles(subscriptionId, startDate, endDate) {
    try {
        const subscription = await Subscription.findByPk(subscriptionId, {
            include: [SubscriptionPlan],
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const cycles = [];
        let currentDate = new Date(startDate);
        let cycleNumber = 1;
        while (currentDate < endDate) {
            const periodEnd = calculatePeriodEnd(currentDate, subscription.plan.billingFrequency);
            const billingDate = new Date(periodEnd);
            cycles.push({
                cycleNumber,
                periodStart: new Date(currentDate),
                periodEnd,
                billingDate,
                amount: subscription.billingAmount,
                taxAmount: 0,
                totalAmount: subscription.billingAmount,
                status: 'PENDING',
            });
            currentDate = calculateNextBillingDate(currentDate, subscription.plan.billingFrequency);
            cycleNumber++;
        }
        return cycles;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to generate billing cycles: ${error.message}`);
    }
}
/**
 * Process billing cycle
 *
 * @param subscriptionId - Subscription identifier
 * @returns Billing result
 */
async function processBillingCycle(subscriptionId) {
    try {
        const subscription = await Subscription.findByPk(subscriptionId, {
            include: [SubscriptionPlan],
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        if (subscription.status !== SubscriptionStatus.ACTIVE) {
            return { success: false, error: 'Subscription is not active' };
        }
        // Simulate payment processing
        const transactionId = `TXN-${Date.now()}`;
        // Update subscription billing dates
        subscription.currentPeriodStart = subscription.currentPeriodEnd;
        subscription.currentPeriodEnd = calculatePeriodEnd(subscription.currentPeriodStart, subscription.plan.billingFrequency);
        subscription.nextBillingDate = calculateNextBillingDate(subscription.currentPeriodEnd, subscription.plan.billingFrequency);
        subscription.lastPaymentDate = new Date();
        subscription.failedPaymentCount = 0;
        subscription.dunningStage = DunningStage.NONE;
        await subscription.save();
        return { success: true, transactionId };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to process billing cycle: ${error.message}`);
    }
}
// ============================================================================
// RECURRING ORDER GENERATION
// ============================================================================
/**
 * Generate recurring order from subscription
 *
 * @param subscriptionId - Subscription identifier
 * @param scheduledDate - When order should be generated
 * @returns Created recurring order
 */
async function generateRecurringOrder(subscriptionId, scheduledDate) {
    try {
        const subscription = await Subscription.findByPk(subscriptionId, {
            include: [SubscriptionPlan],
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const orderNumber = `REC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const recurringOrder = await RecurringOrder.create({
            subscriptionId,
            orderNumber,
            scheduledDate,
            status: 'SCHEDULED',
            orderAmount: subscription.billingAmount,
            orderData: {
                planId: subscription.planId,
                planName: subscription.plan.planName,
                quantity: subscription.quantity,
                customerId: subscription.customerId,
            },
        });
        return recurringOrder;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to generate recurring order: ${error.message}`);
    }
}
/**
 * Schedule recurring orders for subscription
 *
 * @param subscriptionId - Subscription identifier
 * @param numberOfOrders - How many orders to schedule
 * @returns Array of scheduled orders
 */
async function scheduleRecurringOrders(subscriptionId, numberOfOrders = 12) {
    try {
        const subscription = await Subscription.findByPk(subscriptionId, {
            include: [SubscriptionPlan],
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const orders = [];
        let scheduledDate = new Date(subscription.nextBillingDate);
        for (let i = 0; i < numberOfOrders; i++) {
            const order = await generateRecurringOrder(subscriptionId, scheduledDate);
            orders.push(order);
            scheduledDate = calculateNextBillingDate(scheduledDate, subscription.plan.billingFrequency);
        }
        return orders;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to schedule recurring orders: ${error.message}`);
    }
}
/**
 * Process pending recurring orders
 *
 * @param batchSize - Number of orders to process
 * @returns Processing results
 */
async function processPendingRecurringOrders(batchSize = 100) {
    try {
        const orders = await RecurringOrder.findAll({
            where: {
                status: 'SCHEDULED',
                scheduledDate: { $lte: new Date() },
            },
            limit: batchSize,
        });
        let processed = 0;
        let failed = 0;
        for (const order of orders) {
            try {
                order.status = 'GENERATED';
                order.generatedDate = new Date();
                await order.save();
                processed++;
            }
            catch (error) {
                order.status = 'FAILED';
                await order.save();
                failed++;
            }
        }
        return { processed, failed };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to process recurring orders: ${error.message}`);
    }
}
// ============================================================================
// SUBSCRIPTION MODIFICATIONS
// ============================================================================
/**
 * Upgrade subscription to higher tier
 *
 * @param subscriptionId - Subscription identifier
 * @param newPlanId - Target plan ID
 * @param prorationMethod - How to handle proration
 * @returns Updated subscription
 */
async function upgradeSubscription(subscriptionId, newPlanId, prorationMethod = ProrationMethod.PRORATED_DAILY) {
    try {
        const subscription = await Subscription.findByPk(subscriptionId, {
            include: [SubscriptionPlan],
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const newPlan = await SubscriptionPlan.findByPk(newPlanId);
        if (!newPlan) {
            throw new common_1.NotFoundException('New plan not found');
        }
        if (newPlan.price <= subscription.plan.price) {
            throw new common_1.BadRequestException('New plan must be higher tier');
        }
        // Calculate proration
        const proration = calculateProration(subscription.currentPeriodStart, subscription.currentPeriodEnd, subscription.billingAmount, newPlan.price, prorationMethod);
        subscription.planId = newPlanId;
        subscription.billingAmount = newPlan.price;
        subscription.metadata = {
            ...subscription.metadata,
            upgradeDate: new Date(),
            previousPlanId: subscription.plan.planId,
            prorationCredit: proration.creditAmount,
        };
        await subscription.save();
        return subscription;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to upgrade subscription: ${error.message}`);
    }
}
/**
 * Downgrade subscription to lower tier
 *
 * @param subscriptionId - Subscription identifier
 * @param newPlanId - Target plan ID
 * @param effectiveDate - When downgrade takes effect
 * @returns Updated subscription
 */
async function downgradeSubscription(subscriptionId, newPlanId, effectiveDate = new Date()) {
    try {
        const subscription = await Subscription.findByPk(subscriptionId, {
            include: [SubscriptionPlan],
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const newPlan = await SubscriptionPlan.findByPk(newPlanId);
        if (!newPlan) {
            throw new common_1.NotFoundException('New plan not found');
        }
        subscription.metadata = {
            ...subscription.metadata,
            pendingDowngrade: {
                newPlanId,
                effectiveDate,
                currentPlanId: subscription.planId,
            },
        };
        await subscription.save();
        return subscription;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to downgrade subscription: ${error.message}`);
    }
}
/**
 * Change subscription quantity
 *
 * @param subscriptionId - Subscription identifier
 * @param newQuantity - New quantity
 * @param prorationMethod - Proration method
 * @returns Updated subscription
 */
async function changeSubscriptionQuantity(subscriptionId, newQuantity, prorationMethod = ProrationMethod.PRORATED_DAILY) {
    try {
        const subscription = await Subscription.findByPk(subscriptionId, {
            include: [SubscriptionPlan],
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        if (newQuantity < 1) {
            throw new common_1.BadRequestException('Quantity must be at least 1');
        }
        const oldQuantity = subscription.quantity;
        const oldAmount = subscription.billingAmount;
        const newAmount = subscription.plan.price * newQuantity;
        const proration = calculateProration(subscription.currentPeriodStart, subscription.currentPeriodEnd, oldAmount, newAmount, prorationMethod);
        subscription.quantity = newQuantity;
        subscription.billingAmount = newAmount;
        subscription.metadata = {
            ...subscription.metadata,
            quantityChanges: [
                ...(subscription.metadata.quantityChanges || []),
                {
                    date: new Date(),
                    oldQuantity,
                    newQuantity,
                    proration,
                },
            ],
        };
        await subscription.save();
        return subscription;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to change quantity: ${error.message}`);
    }
}
/**
 * Pause subscription temporarily
 *
 * @param subscriptionId - Subscription identifier
 * @param resumeDate - When to resume
 * @returns Updated subscription
 */
async function pauseSubscription(subscriptionId, resumeDate) {
    try {
        const subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        subscription.status = SubscriptionStatus.PAUSED;
        subscription.metadata = {
            ...subscription.metadata,
            pausedDate: new Date(),
            resumeDate,
        };
        await subscription.save();
        return subscription;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to pause subscription: ${error.message}`);
    }
}
/**
 * Resume paused subscription
 *
 * @param subscriptionId - Subscription identifier
 * @returns Updated subscription
 */
async function resumeSubscription(subscriptionId) {
    try {
        const subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        if (subscription.status !== SubscriptionStatus.PAUSED) {
            throw new common_1.BadRequestException('Subscription is not paused');
        }
        subscription.status = SubscriptionStatus.ACTIVE;
        subscription.metadata = {
            ...subscription.metadata,
            resumedDate: new Date(),
        };
        await subscription.save();
        return subscription;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to resume subscription: ${error.message}`);
    }
}
// ============================================================================
// SUBSCRIPTION CANCELLATIONS
// ============================================================================
/**
 * Cancel subscription immediately
 *
 * @param subscriptionId - Subscription identifier
 * @param reason - Cancellation reason
 * @param refundProrated - Whether to refund unused time
 * @returns Cancelled subscription
 */
async function cancelSubscriptionImmediate(subscriptionId, reason, refundProrated = false) {
    try {
        const subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        subscription.status = SubscriptionStatus.CANCELLED;
        subscription.cancellationDate = new Date();
        subscription.cancellationReason = reason;
        subscription.endDate = new Date();
        if (refundProrated) {
            const proration = calculateProration(subscription.currentPeriodStart, subscription.currentPeriodEnd, subscription.billingAmount, 0, ProrationMethod.PRORATED_DAILY);
            subscription.metadata = {
                ...subscription.metadata,
                refundAmount: proration.creditAmount,
            };
        }
        await subscription.save();
        return subscription;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to cancel subscription: ${error.message}`);
    }
}
/**
 * Schedule subscription cancellation at period end
 *
 * @param subscriptionId - Subscription identifier
 * @param reason - Cancellation reason
 * @returns Updated subscription
 */
async function cancelSubscriptionAtPeriodEnd(subscriptionId, reason) {
    try {
        const subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        subscription.status = SubscriptionStatus.NON_RENEWING;
        subscription.cancellationReason = reason;
        subscription.endDate = subscription.currentPeriodEnd;
        subscription.metadata = {
            ...subscription.metadata,
            scheduledCancellationDate: subscription.currentPeriodEnd,
        };
        await subscription.save();
        return subscription;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to schedule cancellation: ${error.message}`);
    }
}
/**
 * Reactivate cancelled subscription
 *
 * @param subscriptionId - Subscription identifier
 * @returns Reactivated subscription
 */
async function reactivateSubscription(subscriptionId) {
    try {
        const subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        if (subscription.status !== SubscriptionStatus.CANCELLED &&
            subscription.status !== SubscriptionStatus.NON_RENEWING) {
            throw new common_1.BadRequestException('Only cancelled subscriptions can be reactivated');
        }
        subscription.status = SubscriptionStatus.ACTIVE;
        subscription.cancellationDate = null;
        subscription.cancellationReason = null;
        subscription.endDate = null;
        subscription.metadata = {
            ...subscription.metadata,
            reactivatedDate: new Date(),
        };
        await subscription.save();
        return subscription;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to reactivate subscription: ${error.message}`);
    }
}
// ============================================================================
// PAYMENT METHOD MANAGEMENT
// ============================================================================
/**
 * Update subscription payment method
 *
 * @param subscriptionId - Subscription identifier
 * @param paymentMethodId - New payment method ID
 * @returns Updated subscription
 */
async function updatePaymentMethod(subscriptionId, paymentMethodId) {
    try {
        const subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const oldPaymentMethodId = subscription.paymentMethodId;
        subscription.paymentMethodId = paymentMethodId;
        subscription.metadata = {
            ...subscription.metadata,
            paymentMethodHistory: [
                ...(subscription.metadata.paymentMethodHistory || []),
                {
                    date: new Date(),
                    oldPaymentMethodId,
                    newPaymentMethodId: paymentMethodId,
                },
            ],
        };
        // Reset dunning if in dunning process
        if (subscription.dunningStage !== DunningStage.NONE) {
            subscription.dunningStage = DunningStage.NONE;
            subscription.failedPaymentCount = 0;
        }
        await subscription.save();
        return subscription;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to update payment method: ${error.message}`);
    }
}
/**
 * Retry failed payment
 *
 * @param subscriptionId - Subscription identifier
 * @returns Payment retry result
 */
async function retryFailedPayment(subscriptionId) {
    try {
        const subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        if (!subscription.paymentMethodId) {
            throw new common_1.BadRequestException('No payment method on file');
        }
        // Simulate payment retry
        const success = Math.random() > 0.3; // 70% success rate
        const transactionId = success ? `TXN-${Date.now()}` : undefined;
        if (success) {
            subscription.status = SubscriptionStatus.ACTIVE;
            subscription.lastPaymentDate = new Date();
            subscription.failedPaymentCount = 0;
            subscription.dunningStage = DunningStage.NONE;
        }
        else {
            subscription.failedPaymentCount += 1;
            advanceDunningStage(subscription);
        }
        await subscription.save();
        return { success, transactionId };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to retry payment: ${error.message}`);
    }
}
// ============================================================================
// FAILED PAYMENT HANDLING & DUNNING
// ============================================================================
/**
 * Handle failed payment
 *
 * @param subscriptionId - Subscription identifier
 * @param failureReason - Reason for payment failure
 * @returns Updated subscription
 */
async function handleFailedPayment(subscriptionId, failureReason) {
    try {
        const subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        subscription.failedPaymentCount += 1;
        subscription.status = SubscriptionStatus.PAST_DUE;
        advanceDunningStage(subscription);
        subscription.metadata = {
            ...subscription.metadata,
            lastFailureReason: failureReason,
            lastFailureDate: new Date(),
            paymentFailures: [
                ...(subscription.metadata.paymentFailures || []),
                {
                    date: new Date(),
                    reason: failureReason,
                    attemptNumber: subscription.failedPaymentCount,
                },
            ],
        };
        await subscription.save();
        return subscription;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to handle payment failure: ${error.message}`);
    }
}
/**
 * Advance dunning stage based on failed payment count
 *
 * @param subscription - Subscription instance
 */
function advanceDunningStage(subscription) {
    if (subscription.failedPaymentCount === 1) {
        subscription.dunningStage = DunningStage.SOFT_DECLINE;
    }
    else if (subscription.failedPaymentCount === 2) {
        subscription.dunningStage = DunningStage.RETRY_1;
    }
    else if (subscription.failedPaymentCount === 3) {
        subscription.dunningStage = DunningStage.RETRY_2;
    }
    else if (subscription.failedPaymentCount === 4) {
        subscription.dunningStage = DunningStage.RETRY_3;
    }
    else if (subscription.failedPaymentCount === 5) {
        subscription.dunningStage = DunningStage.FINAL_NOTICE;
    }
    else if (subscription.failedPaymentCount >= 6) {
        subscription.dunningStage = DunningStage.SUSPENDED;
        subscription.status = SubscriptionStatus.SUSPENDED;
    }
}
/**
 * Process dunning workflow for past due subscriptions
 *
 * @returns Processing results
 */
async function processDunningWorkflow() {
    try {
        const pastDueSubscriptions = await Subscription.findAll({
            where: { status: SubscriptionStatus.PAST_DUE },
        });
        let processed = 0;
        let suspended = 0;
        let cancelled = 0;
        for (const subscription of pastDueSubscriptions) {
            // Retry payment based on dunning stage
            if (subscription.dunningStage === DunningStage.SOFT_DECLINE ||
                subscription.dunningStage === DunningStage.RETRY_1 ||
                subscription.dunningStage === DunningStage.RETRY_2) {
                await retryFailedPayment(subscription.subscriptionId);
                processed++;
            }
            else if (subscription.dunningStage === DunningStage.SUSPENDED) {
                subscription.status = SubscriptionStatus.SUSPENDED;
                await subscription.save();
                suspended++;
            }
            else if (subscription.failedPaymentCount >= 10) {
                await cancelSubscriptionImmediate(subscription.subscriptionId, CancellationReason.PAYMENT_FAILURE, false);
                cancelled++;
            }
        }
        return { processed, suspended, cancelled };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to process dunning workflow: ${error.message}`);
    }
}
// ============================================================================
// PRORATION CALCULATIONS
// ============================================================================
/**
 * Calculate proration amount for subscription changes
 *
 * @param periodStart - Billing period start
 * @param periodEnd - Billing period end
 * @param oldAmount - Previous billing amount
 * @param newAmount - New billing amount
 * @param method - Proration method
 * @returns Proration result
 */
function calculateProration(periodStart, periodEnd, oldAmount, newAmount, method) {
    const now = new Date();
    const totalMilliseconds = periodEnd.getTime() - periodStart.getTime();
    const usedMilliseconds = now.getTime() - periodStart.getTime();
    const remainingMilliseconds = periodEnd.getTime() - now.getTime();
    const totalDays = totalMilliseconds / (1000 * 60 * 60 * 24);
    const daysUsed = usedMilliseconds / (1000 * 60 * 60 * 24);
    const daysRemaining = remainingMilliseconds / (1000 * 60 * 60 * 24);
    let creditAmount = 0;
    let debitAmount = 0;
    let prorationFactor = 0;
    switch (method) {
        case ProrationMethod.PRORATED_DAILY:
            prorationFactor = daysRemaining / totalDays;
            creditAmount = oldAmount * prorationFactor;
            debitAmount = newAmount * prorationFactor;
            break;
        case ProrationMethod.PRORATED_HOURLY:
            const hoursRemaining = remainingMilliseconds / (1000 * 60 * 60);
            const totalHours = totalMilliseconds / (1000 * 60 * 60);
            prorationFactor = hoursRemaining / totalHours;
            creditAmount = oldAmount * prorationFactor;
            debitAmount = newAmount * prorationFactor;
            break;
        case ProrationMethod.FULL_PERIOD:
            creditAmount = 0;
            debitAmount = newAmount;
            prorationFactor = 1;
            break;
        case ProrationMethod.NO_PRORATION:
            creditAmount = 0;
            debitAmount = 0;
            prorationFactor = 0;
            break;
        case ProrationMethod.CREDIT_BALANCE:
            creditAmount = oldAmount;
            debitAmount = newAmount;
            prorationFactor = 1;
            break;
    }
    return {
        originalAmount: oldAmount,
        proratedAmount: debitAmount - creditAmount,
        creditAmount,
        debitAmount,
        daysUsed,
        totalDays,
        prorationFactor,
        effectiveDate: now,
    };
}
// ============================================================================
// SUBSCRIPTION RENEWALS
// ============================================================================
/**
 * Process subscription renewal
 *
 * @param subscriptionId - Subscription identifier
 * @returns Renewal result
 */
async function processSubscriptionRenewal(subscriptionId) {
    try {
        const subscription = await Subscription.findByPk(subscriptionId, {
            include: [SubscriptionPlan],
        });
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        if (subscription.renewalType !== RenewalType.AUTOMATIC) {
            throw new common_1.BadRequestException('Subscription is not set for automatic renewal');
        }
        // Process billing
        const billingResult = await processBillingCycle(subscriptionId);
        if (billingResult.success) {
            const newPeriodEnd = subscription.currentPeriodEnd;
            return { success: true, newPeriodEnd };
        }
        else {
            await handleFailedPayment(subscriptionId, billingResult.error);
            return { success: false, newPeriodEnd: subscription.currentPeriodEnd };
        }
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to process renewal: ${error.message}`);
    }
}
/**
 * Get subscriptions due for renewal
 *
 * @param daysAhead - How many days ahead to look
 * @returns Array of subscriptions
 */
async function getSubscriptionsDueForRenewal(daysAhead = 7) {
    try {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);
        return await Subscription.findAll({
            where: {
                status: SubscriptionStatus.ACTIVE,
                renewalType: RenewalType.AUTOMATIC,
                nextBillingDate: { $lte: futureDate },
            },
            include: [SubscriptionPlan],
        });
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to get renewals: ${error.message}`);
    }
}
/**
 * Send renewal reminders
 *
 * @param daysBeforeRenewal - Days before renewal to send reminder
 * @returns Number of reminders sent
 */
async function sendRenewalReminders(daysBeforeRenewal = 7) {
    try {
        const subscriptions = await getSubscriptionsDueForRenewal(daysBeforeRenewal);
        let sent = 0;
        for (const subscription of subscriptions) {
            // Simulate sending email/notification
            console.log(`Renewal reminder sent for subscription ${subscription.subscriptionNumber}`);
            sent++;
        }
        return sent;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to send reminders: ${error.message}`);
    }
}
// ============================================================================
// SUBSCRIPTION ANALYTICS
// ============================================================================
/**
 * Calculate subscription metrics
 *
 * @param startDate - Analysis start date
 * @param endDate - Analysis end date
 * @returns Subscription metrics
 */
async function calculateSubscriptionMetrics(startDate, endDate) {
    try {
        const activeSubscriptions = await Subscription.count({
            where: { status: SubscriptionStatus.ACTIVE },
        });
        const totalSubscriptions = await Subscription.count();
        const allSubscriptions = await Subscription.findAll({
            include: [SubscriptionPlan],
        });
        const monthlyRecurringRevenue = allSubscriptions
            .filter(s => s.status === SubscriptionStatus.ACTIVE)
            .reduce((sum, s) => {
            const monthlyAmount = convertToMonthlyAmount(s.billingAmount, s.plan.billingFrequency);
            return sum + monthlyAmount;
        }, 0);
        const averageRevenuePerUser = activeSubscriptions > 0
            ? monthlyRecurringRevenue / activeSubscriptions
            : 0;
        // Calculate churn rate
        const cancelledInPeriod = await Subscription.count({
            where: {
                status: SubscriptionStatus.CANCELLED,
                cancellationDate: { $gte: startDate, $lte: endDate },
            },
        });
        const churnRate = totalSubscriptions > 0 ? (cancelledInPeriod / totalSubscriptions) * 100 : 0;
        const retentionRate = 100 - churnRate;
        // Estimate CLV (simple calculation)
        const averageLifetimeMonths = 24; // Assumption
        const customerLifetimeValue = averageRevenuePerUser * averageLifetimeMonths;
        // Growth rate
        const previousPeriodStart = new Date(startDate);
        previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
        const previousPeriodSubscriptions = await Subscription.count({
            where: {
                createdAt: { $gte: previousPeriodStart, $lt: startDate },
            },
        });
        const currentPeriodSubscriptions = await Subscription.count({
            where: {
                createdAt: { $gte: startDate, $lte: endDate },
            },
        });
        const growthRate = previousPeriodSubscriptions > 0
            ? ((currentPeriodSubscriptions - previousPeriodSubscriptions) / previousPeriodSubscriptions) * 100
            : 0;
        return {
            totalSubscriptions,
            activeSubscriptions,
            churnRate,
            monthlyRecurringRevenue,
            averageRevenuePerUser,
            customerLifetimeValue,
            retentionRate,
            growthRate,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate metrics: ${error.message}`);
    }
}
/**
 * Convert billing amount to monthly equivalent
 *
 * @param amount - Billing amount
 * @param frequency - Billing frequency
 * @returns Monthly amount
 */
function convertToMonthlyAmount(amount, frequency) {
    switch (frequency) {
        case BillingFrequency.DAILY:
            return amount * 30;
        case BillingFrequency.WEEKLY:
            return amount * 4.33;
        case BillingFrequency.BIWEEKLY:
            return amount * 2.17;
        case BillingFrequency.MONTHLY:
            return amount;
        case BillingFrequency.QUARTERLY:
            return amount / 3;
        case BillingFrequency.SEMIANNUAL:
            return amount / 6;
        case BillingFrequency.ANNUAL:
            return amount / 12;
        case BillingFrequency.BIENNIAL:
            return amount / 24;
        default:
            return amount;
    }
}
/**
 * Get subscription revenue forecast
 *
 * @param months - Number of months to forecast
 * @returns Monthly revenue forecast
 */
async function getRevenueForecast(months = 12) {
    try {
        const activeSubscriptions = await Subscription.findAll({
            where: { status: SubscriptionStatus.ACTIVE },
            include: [SubscriptionPlan],
        });
        const forecast = [];
        const startDate = new Date();
        for (let i = 0; i < months; i++) {
            const forecastDate = new Date(startDate);
            forecastDate.setMonth(forecastDate.getMonth() + i);
            let monthlyRevenue = 0;
            for (const subscription of activeSubscriptions) {
                monthlyRevenue += convertToMonthlyAmount(subscription.billingAmount, subscription.plan.billingFrequency);
            }
            forecast.push({
                month: forecastDate.toISOString().slice(0, 7),
                revenue: monthlyRevenue,
            });
        }
        return forecast;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to generate forecast: ${error.message}`);
    }
}
/**
 * Get subscription cohort analysis
 *
 * @param cohortMonth - Cohort month (YYYY-MM)
 * @returns Cohort retention data
 */
async function getCohortAnalysis(cohortMonth) {
    try {
        const [year, month] = cohortMonth.split('-').map(Number);
        const cohortStart = new Date(year, month - 1, 1);
        const cohortEnd = new Date(year, month, 0);
        const cohortSubscriptions = await Subscription.findAll({
            where: {
                createdAt: { $gte: cohortStart, $lte: cohortEnd },
            },
        });
        const totalCohortSize = cohortSubscriptions.length;
        const stillActive = cohortSubscriptions.filter(s => s.status === SubscriptionStatus.ACTIVE).length;
        const retentionRate = totalCohortSize > 0
            ? (stillActive / totalCohortSize) * 100
            : 0;
        return {
            cohortMonth,
            totalCustomers: totalCohortSize,
            activeCustomers: stillActive,
            churnedCustomers: totalCohortSize - stillActive,
            retentionRate,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to get cohort analysis: ${error.message}`);
    }
}
/**
 * Track subscription usage
 *
 * @param subscriptionId - Subscription identifier
 * @param usageData - Usage record
 * @returns Created usage record
 */
async function trackSubscriptionUsage(subscriptionId, usageData) {
    try {
        const subscription = await Subscription.findByPk(subscriptionId);
        if (!subscription) {
            throw new common_1.NotFoundException('Subscription not found');
        }
        const usage = await SubscriptionUsage.create({
            subscriptionId,
            usageUnit: usageData.usageUnit,
            quantity: usageData.quantity,
            usageDate: usageData.timestamp || new Date(),
            metadata: usageData.metadata || {},
        });
        return usage;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to track usage: ${error.message}`);
    }
}
/**
 * Get subscription usage summary
 *
 * @param subscriptionId - Subscription identifier
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Usage summary by unit type
 */
async function getSubscriptionUsageSummary(subscriptionId, startDate, endDate) {
    try {
        const usageRecords = await SubscriptionUsage.findAll({
            where: {
                subscriptionId,
                usageDate: { $gte: startDate, $lte: endDate },
            },
        });
        const summary = {};
        for (const record of usageRecords) {
            const unit = record.usageUnit;
            summary[unit] = (summary[unit] || 0) + Number(record.quantity);
        }
        return summary;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to get usage summary: ${error.message}`);
    }
}
//# sourceMappingURL=subscription-recurring-kit.js.map