"use strict";
/**
 * ASSET VENDOR MANAGEMENT COMMAND FUNCTIONS
 *
 * Enterprise-grade vendor management system for JD Edwards EnterpriseOne competition.
 * Provides comprehensive vendor lifecycle management including:
 * - Vendor master data management and onboarding
 * - Vendor performance tracking and scorecards
 * - Vendor contracts and agreements
 * - Service level agreements (SLAs) and monitoring
 * - Vendor evaluation and qualification
 * - Preferred vendor lists and tier management
 * - Vendor pricing and rate management
 * - Vendor communication and collaboration
 * - Vendor compliance and certification tracking
 * - Purchase order and invoice management
 * - Vendor risk assessment
 * - Multi-location vendor support
 *
 * @module AssetVendorCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   createVendor,
 *   evaluateVendorPerformance,
 *   createVendorContract,
 *   trackVendorSLA,
 *   VendorStatus,
 *   VendorTier
 * } from './asset-vendor-commands';
 *
 * // Create vendor
 * const vendor = await createVendor({
 *   vendorCode: 'VND-2024-001',
 *   vendorName: 'Tech Solutions Inc.',
 *   vendorType: VendorType.SERVICE_PROVIDER,
 *   tier: VendorTier.PREFERRED,
 *   contactInfo: { email: 'contact@techsolutions.com', phone: '555-0123' }
 * });
 * ```
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
exports.VendorPricingModel = exports.VendorPerformanceEvaluation = exports.SLAMeasurement = exports.VendorSLA = exports.VendorContract = exports.AssetVendor = exports.PerformanceRating = exports.SLAStatus = exports.ContractStatus = exports.VendorTier = exports.VendorStatus = exports.VendorType = void 0;
exports.createVendor = createVendor;
exports.updateVendor = updateVendor;
exports.approveVendor = approveVendor;
exports.getVendorById = getVendorById;
exports.searchVendors = searchVendors;
exports.createVendorContract = createVendorContract;
exports.activateVendorContract = activateVendorContract;
exports.getExpiringContracts = getExpiringContracts;
exports.createVendorSLA = createVendorSLA;
exports.recordSLAMeasurement = recordSLAMeasurement;
exports.getSLAComplianceReport = getSLAComplianceReport;
exports.evaluateVendorPerformance = evaluateVendorPerformance;
exports.generateVendorScorecard = generateVendorScorecard;
exports.createVendorPricing = createVendorPricing;
exports.getVendorPricing = getVendorPricing;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Vendor types
 */
var VendorType;
(function (VendorType) {
    VendorType["MANUFACTURER"] = "manufacturer";
    VendorType["DISTRIBUTOR"] = "distributor";
    VendorType["SERVICE_PROVIDER"] = "service_provider";
    VendorType["MAINTENANCE_PROVIDER"] = "maintenance_provider";
    VendorType["RESELLER"] = "reseller";
    VendorType["OEM"] = "oem";
    VendorType["CONTRACTOR"] = "contractor";
    VendorType["CONSULTANT"] = "consultant";
})(VendorType || (exports.VendorType = VendorType = {}));
/**
 * Vendor status
 */
var VendorStatus;
(function (VendorStatus) {
    VendorStatus["ACTIVE"] = "active";
    VendorStatus["INACTIVE"] = "inactive";
    VendorStatus["SUSPENDED"] = "suspended";
    VendorStatus["PENDING_APPROVAL"] = "pending_approval";
    VendorStatus["BLACKLISTED"] = "blacklisted";
    VendorStatus["UNDER_REVIEW"] = "under_review";
})(VendorStatus || (exports.VendorStatus = VendorStatus = {}));
/**
 * Vendor tier
 */
var VendorTier;
(function (VendorTier) {
    VendorTier["STRATEGIC"] = "strategic";
    VendorTier["PREFERRED"] = "preferred";
    VendorTier["APPROVED"] = "approved";
    VendorTier["CONDITIONAL"] = "conditional";
    VendorTier["PROBATIONARY"] = "probationary";
})(VendorTier || (exports.VendorTier = VendorTier = {}));
/**
 * Contract status
 */
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["DRAFT"] = "draft";
    ContractStatus["PENDING_APPROVAL"] = "pending_approval";
    ContractStatus["ACTIVE"] = "active";
    ContractStatus["EXPIRED"] = "expired";
    ContractStatus["TERMINATED"] = "terminated";
    ContractStatus["RENEWED"] = "renewed";
    ContractStatus["SUSPENDED"] = "suspended";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
/**
 * SLA status
 */
var SLAStatus;
(function (SLAStatus) {
    SLAStatus["MET"] = "met";
    SLAStatus["NOT_MET"] = "not_met";
    SLAStatus["EXCEEDED"] = "exceeded";
    SLAStatus["PENDING"] = "pending";
    SLAStatus["NA"] = "na";
})(SLAStatus || (exports.SLAStatus = SLAStatus = {}));
/**
 * Performance rating
 */
var PerformanceRating;
(function (PerformanceRating) {
    PerformanceRating["EXCELLENT"] = "excellent";
    PerformanceRating["GOOD"] = "good";
    PerformanceRating["SATISFACTORY"] = "satisfactory";
    PerformanceRating["NEEDS_IMPROVEMENT"] = "needs_improvement";
    PerformanceRating["POOR"] = "poor";
})(PerformanceRating || (exports.PerformanceRating = PerformanceRating = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Vendor Model
 */
let AssetVendor = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'asset_vendors',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['vendor_code'], unique: true },
                { fields: ['vendor_type'] },
                { fields: ['status'] },
                { fields: ['tier'] },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _vendorCode_decorators;
    let _vendorCode_initializers = [];
    let _vendorCode_extraInitializers = [];
    let _vendorName_decorators;
    let _vendorName_initializers = [];
    let _vendorName_extraInitializers = [];
    let _vendorType_decorators;
    let _vendorType_initializers = [];
    let _vendorType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _tier_decorators;
    let _tier_initializers = [];
    let _tier_extraInitializers = [];
    let _taxId_decorators;
    let _taxId_initializers = [];
    let _taxId_extraInitializers = [];
    let _website_decorators;
    let _website_initializers = [];
    let _website_extraInitializers = [];
    let _businessAddress_decorators;
    let _businessAddress_initializers = [];
    let _businessAddress_extraInitializers = [];
    let _billingAddress_decorators;
    let _billingAddress_initializers = [];
    let _billingAddress_extraInitializers = [];
    let _contactInfo_decorators;
    let _contactInfo_initializers = [];
    let _contactInfo_extraInitializers = [];
    let _paymentTerms_decorators;
    let _paymentTerms_initializers = [];
    let _paymentTerms_extraInitializers = [];
    let _bankingInfo_decorators;
    let _bankingInfo_initializers = [];
    let _bankingInfo_extraInitializers = [];
    let _certifications_decorators;
    let _certifications_initializers = [];
    let _certifications_extraInitializers = [];
    let _insuranceCoverage_decorators;
    let _insuranceCoverage_initializers = [];
    let _insuranceCoverage_extraInitializers = [];
    let _performanceScore_decorators;
    let _performanceScore_initializers = [];
    let _performanceScore_extraInitializers = [];
    let _qualityScore_decorators;
    let _qualityScore_initializers = [];
    let _qualityScore_extraInitializers = [];
    let _deliveryScore_decorators;
    let _deliveryScore_initializers = [];
    let _deliveryScore_extraInitializers = [];
    let _totalSpend_decorators;
    let _totalSpend_initializers = [];
    let _totalSpend_extraInitializers = [];
    let _lastEvaluationDate_decorators;
    let _lastEvaluationDate_initializers = [];
    let _lastEvaluationDate_extraInitializers = [];
    let _nextEvaluationDate_decorators;
    let _nextEvaluationDate_initializers = [];
    let _nextEvaluationDate_extraInitializers = [];
    let _onboardingDate_decorators;
    let _onboardingDate_initializers = [];
    let _onboardingDate_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
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
    let _contracts_decorators;
    let _contracts_initializers = [];
    let _contracts_extraInitializers = [];
    let _slas_decorators;
    let _slas_initializers = [];
    let _slas_extraInitializers = [];
    let _evaluations_decorators;
    let _evaluations_initializers = [];
    let _evaluations_extraInitializers = [];
    let _pricing_decorators;
    let _pricing_initializers = [];
    let _pricing_extraInitializers = [];
    var AssetVendor = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.vendorCode = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _vendorCode_initializers, void 0));
            this.vendorName = (__runInitializers(this, _vendorCode_extraInitializers), __runInitializers(this, _vendorName_initializers, void 0));
            this.vendorType = (__runInitializers(this, _vendorName_extraInitializers), __runInitializers(this, _vendorType_initializers, void 0));
            this.status = (__runInitializers(this, _vendorType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.tier = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _tier_initializers, void 0));
            this.taxId = (__runInitializers(this, _tier_extraInitializers), __runInitializers(this, _taxId_initializers, void 0));
            this.website = (__runInitializers(this, _taxId_extraInitializers), __runInitializers(this, _website_initializers, void 0));
            this.businessAddress = (__runInitializers(this, _website_extraInitializers), __runInitializers(this, _businessAddress_initializers, void 0));
            this.billingAddress = (__runInitializers(this, _businessAddress_extraInitializers), __runInitializers(this, _billingAddress_initializers, void 0));
            this.contactInfo = (__runInitializers(this, _billingAddress_extraInitializers), __runInitializers(this, _contactInfo_initializers, void 0));
            this.paymentTerms = (__runInitializers(this, _contactInfo_extraInitializers), __runInitializers(this, _paymentTerms_initializers, void 0));
            this.bankingInfo = (__runInitializers(this, _paymentTerms_extraInitializers), __runInitializers(this, _bankingInfo_initializers, void 0));
            this.certifications = (__runInitializers(this, _bankingInfo_extraInitializers), __runInitializers(this, _certifications_initializers, void 0));
            this.insuranceCoverage = (__runInitializers(this, _certifications_extraInitializers), __runInitializers(this, _insuranceCoverage_initializers, void 0));
            this.performanceScore = (__runInitializers(this, _insuranceCoverage_extraInitializers), __runInitializers(this, _performanceScore_initializers, void 0));
            this.qualityScore = (__runInitializers(this, _performanceScore_extraInitializers), __runInitializers(this, _qualityScore_initializers, void 0));
            this.deliveryScore = (__runInitializers(this, _qualityScore_extraInitializers), __runInitializers(this, _deliveryScore_initializers, void 0));
            this.totalSpend = (__runInitializers(this, _deliveryScore_extraInitializers), __runInitializers(this, _totalSpend_initializers, void 0));
            this.lastEvaluationDate = (__runInitializers(this, _totalSpend_extraInitializers), __runInitializers(this, _lastEvaluationDate_initializers, void 0));
            this.nextEvaluationDate = (__runInitializers(this, _lastEvaluationDate_extraInitializers), __runInitializers(this, _nextEvaluationDate_initializers, void 0));
            this.onboardingDate = (__runInitializers(this, _nextEvaluationDate_extraInitializers), __runInitializers(this, _onboardingDate_initializers, void 0));
            this.isActive = (__runInitializers(this, _onboardingDate_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.notes = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.contracts = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _contracts_initializers, void 0));
            this.slas = (__runInitializers(this, _contracts_extraInitializers), __runInitializers(this, _slas_initializers, void 0));
            this.evaluations = (__runInitializers(this, _slas_extraInitializers), __runInitializers(this, _evaluations_initializers, void 0));
            this.pricing = (__runInitializers(this, _evaluations_extraInitializers), __runInitializers(this, _pricing_initializers, void 0));
            __runInitializers(this, _pricing_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AssetVendor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _vendorCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _vendorName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _vendorType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor type' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(VendorType)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(VendorStatus)),
                defaultValue: VendorStatus.PENDING_APPROVAL,
            }), sequelize_typescript_1.Index];
        _tier_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor tier' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(VendorTier)) }), sequelize_typescript_1.Index];
        _taxId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tax ID / EIN' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _website_decorators = [(0, swagger_1.ApiProperty)({ description: 'Website URL' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _businessAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'Business address' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _billingAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'Billing address' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _contactInfo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contact information' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _paymentTerms_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment terms' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _bankingInfo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Banking information' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _certifications_decorators = [(0, swagger_1.ApiProperty)({ description: 'Certifications' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _insuranceCoverage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Insurance coverage' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _performanceScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Performance score' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2) })];
        _qualityScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quality score' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2) })];
        _deliveryScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delivery score' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2) })];
        _totalSpend_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total spend' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), defaultValue: 0 })];
        _lastEvaluationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last evaluation date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _nextEvaluationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Next evaluation date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _onboardingDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Onboarding date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _contracts_decorators = [(0, sequelize_typescript_1.HasMany)(() => VendorContract)];
        _slas_decorators = [(0, sequelize_typescript_1.HasMany)(() => VendorSLA)];
        _evaluations_decorators = [(0, sequelize_typescript_1.HasMany)(() => VendorPerformanceEvaluation)];
        _pricing_decorators = [(0, sequelize_typescript_1.HasMany)(() => VendorPricingModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _vendorCode_decorators, { kind: "field", name: "vendorCode", static: false, private: false, access: { has: obj => "vendorCode" in obj, get: obj => obj.vendorCode, set: (obj, value) => { obj.vendorCode = value; } }, metadata: _metadata }, _vendorCode_initializers, _vendorCode_extraInitializers);
        __esDecorate(null, null, _vendorName_decorators, { kind: "field", name: "vendorName", static: false, private: false, access: { has: obj => "vendorName" in obj, get: obj => obj.vendorName, set: (obj, value) => { obj.vendorName = value; } }, metadata: _metadata }, _vendorName_initializers, _vendorName_extraInitializers);
        __esDecorate(null, null, _vendorType_decorators, { kind: "field", name: "vendorType", static: false, private: false, access: { has: obj => "vendorType" in obj, get: obj => obj.vendorType, set: (obj, value) => { obj.vendorType = value; } }, metadata: _metadata }, _vendorType_initializers, _vendorType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _tier_decorators, { kind: "field", name: "tier", static: false, private: false, access: { has: obj => "tier" in obj, get: obj => obj.tier, set: (obj, value) => { obj.tier = value; } }, metadata: _metadata }, _tier_initializers, _tier_extraInitializers);
        __esDecorate(null, null, _taxId_decorators, { kind: "field", name: "taxId", static: false, private: false, access: { has: obj => "taxId" in obj, get: obj => obj.taxId, set: (obj, value) => { obj.taxId = value; } }, metadata: _metadata }, _taxId_initializers, _taxId_extraInitializers);
        __esDecorate(null, null, _website_decorators, { kind: "field", name: "website", static: false, private: false, access: { has: obj => "website" in obj, get: obj => obj.website, set: (obj, value) => { obj.website = value; } }, metadata: _metadata }, _website_initializers, _website_extraInitializers);
        __esDecorate(null, null, _businessAddress_decorators, { kind: "field", name: "businessAddress", static: false, private: false, access: { has: obj => "businessAddress" in obj, get: obj => obj.businessAddress, set: (obj, value) => { obj.businessAddress = value; } }, metadata: _metadata }, _businessAddress_initializers, _businessAddress_extraInitializers);
        __esDecorate(null, null, _billingAddress_decorators, { kind: "field", name: "billingAddress", static: false, private: false, access: { has: obj => "billingAddress" in obj, get: obj => obj.billingAddress, set: (obj, value) => { obj.billingAddress = value; } }, metadata: _metadata }, _billingAddress_initializers, _billingAddress_extraInitializers);
        __esDecorate(null, null, _contactInfo_decorators, { kind: "field", name: "contactInfo", static: false, private: false, access: { has: obj => "contactInfo" in obj, get: obj => obj.contactInfo, set: (obj, value) => { obj.contactInfo = value; } }, metadata: _metadata }, _contactInfo_initializers, _contactInfo_extraInitializers);
        __esDecorate(null, null, _paymentTerms_decorators, { kind: "field", name: "paymentTerms", static: false, private: false, access: { has: obj => "paymentTerms" in obj, get: obj => obj.paymentTerms, set: (obj, value) => { obj.paymentTerms = value; } }, metadata: _metadata }, _paymentTerms_initializers, _paymentTerms_extraInitializers);
        __esDecorate(null, null, _bankingInfo_decorators, { kind: "field", name: "bankingInfo", static: false, private: false, access: { has: obj => "bankingInfo" in obj, get: obj => obj.bankingInfo, set: (obj, value) => { obj.bankingInfo = value; } }, metadata: _metadata }, _bankingInfo_initializers, _bankingInfo_extraInitializers);
        __esDecorate(null, null, _certifications_decorators, { kind: "field", name: "certifications", static: false, private: false, access: { has: obj => "certifications" in obj, get: obj => obj.certifications, set: (obj, value) => { obj.certifications = value; } }, metadata: _metadata }, _certifications_initializers, _certifications_extraInitializers);
        __esDecorate(null, null, _insuranceCoverage_decorators, { kind: "field", name: "insuranceCoverage", static: false, private: false, access: { has: obj => "insuranceCoverage" in obj, get: obj => obj.insuranceCoverage, set: (obj, value) => { obj.insuranceCoverage = value; } }, metadata: _metadata }, _insuranceCoverage_initializers, _insuranceCoverage_extraInitializers);
        __esDecorate(null, null, _performanceScore_decorators, { kind: "field", name: "performanceScore", static: false, private: false, access: { has: obj => "performanceScore" in obj, get: obj => obj.performanceScore, set: (obj, value) => { obj.performanceScore = value; } }, metadata: _metadata }, _performanceScore_initializers, _performanceScore_extraInitializers);
        __esDecorate(null, null, _qualityScore_decorators, { kind: "field", name: "qualityScore", static: false, private: false, access: { has: obj => "qualityScore" in obj, get: obj => obj.qualityScore, set: (obj, value) => { obj.qualityScore = value; } }, metadata: _metadata }, _qualityScore_initializers, _qualityScore_extraInitializers);
        __esDecorate(null, null, _deliveryScore_decorators, { kind: "field", name: "deliveryScore", static: false, private: false, access: { has: obj => "deliveryScore" in obj, get: obj => obj.deliveryScore, set: (obj, value) => { obj.deliveryScore = value; } }, metadata: _metadata }, _deliveryScore_initializers, _deliveryScore_extraInitializers);
        __esDecorate(null, null, _totalSpend_decorators, { kind: "field", name: "totalSpend", static: false, private: false, access: { has: obj => "totalSpend" in obj, get: obj => obj.totalSpend, set: (obj, value) => { obj.totalSpend = value; } }, metadata: _metadata }, _totalSpend_initializers, _totalSpend_extraInitializers);
        __esDecorate(null, null, _lastEvaluationDate_decorators, { kind: "field", name: "lastEvaluationDate", static: false, private: false, access: { has: obj => "lastEvaluationDate" in obj, get: obj => obj.lastEvaluationDate, set: (obj, value) => { obj.lastEvaluationDate = value; } }, metadata: _metadata }, _lastEvaluationDate_initializers, _lastEvaluationDate_extraInitializers);
        __esDecorate(null, null, _nextEvaluationDate_decorators, { kind: "field", name: "nextEvaluationDate", static: false, private: false, access: { has: obj => "nextEvaluationDate" in obj, get: obj => obj.nextEvaluationDate, set: (obj, value) => { obj.nextEvaluationDate = value; } }, metadata: _metadata }, _nextEvaluationDate_initializers, _nextEvaluationDate_extraInitializers);
        __esDecorate(null, null, _onboardingDate_decorators, { kind: "field", name: "onboardingDate", static: false, private: false, access: { has: obj => "onboardingDate" in obj, get: obj => obj.onboardingDate, set: (obj, value) => { obj.onboardingDate = value; } }, metadata: _metadata }, _onboardingDate_initializers, _onboardingDate_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _contracts_decorators, { kind: "field", name: "contracts", static: false, private: false, access: { has: obj => "contracts" in obj, get: obj => obj.contracts, set: (obj, value) => { obj.contracts = value; } }, metadata: _metadata }, _contracts_initializers, _contracts_extraInitializers);
        __esDecorate(null, null, _slas_decorators, { kind: "field", name: "slas", static: false, private: false, access: { has: obj => "slas" in obj, get: obj => obj.slas, set: (obj, value) => { obj.slas = value; } }, metadata: _metadata }, _slas_initializers, _slas_extraInitializers);
        __esDecorate(null, null, _evaluations_decorators, { kind: "field", name: "evaluations", static: false, private: false, access: { has: obj => "evaluations" in obj, get: obj => obj.evaluations, set: (obj, value) => { obj.evaluations = value; } }, metadata: _metadata }, _evaluations_initializers, _evaluations_extraInitializers);
        __esDecorate(null, null, _pricing_decorators, { kind: "field", name: "pricing", static: false, private: false, access: { has: obj => "pricing" in obj, get: obj => obj.pricing, set: (obj, value) => { obj.pricing = value; } }, metadata: _metadata }, _pricing_initializers, _pricing_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AssetVendor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AssetVendor = _classThis;
})();
exports.AssetVendor = AssetVendor;
/**
 * Vendor Contract Model
 */
let VendorContract = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'vendor_contracts',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['contract_number'], unique: true },
                { fields: ['vendor_id'] },
                { fields: ['status'] },
                { fields: ['start_date'] },
                { fields: ['end_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _contractNumber_decorators;
    let _contractNumber_initializers = [];
    let _contractNumber_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _contractType_decorators;
    let _contractType_initializers = [];
    let _contractType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _autoRenew_decorators;
    let _autoRenew_initializers = [];
    let _autoRenew_extraInitializers = [];
    let _renewalNoticeDays_decorators;
    let _renewalNoticeDays_initializers = [];
    let _renewalNoticeDays_extraInitializers = [];
    let _contractValue_decorators;
    let _contractValue_initializers = [];
    let _contractValue_extraInitializers = [];
    let _paymentSchedule_decorators;
    let _paymentSchedule_initializers = [];
    let _paymentSchedule_extraInitializers = [];
    let _terms_decorators;
    let _terms_initializers = [];
    let _terms_extraInitializers = [];
    let _deliverables_decorators;
    let _deliverables_initializers = [];
    let _deliverables_extraInitializers = [];
    let _contractDocumentUrl_decorators;
    let _contractDocumentUrl_initializers = [];
    let _contractDocumentUrl_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvalDate_decorators;
    let _approvalDate_initializers = [];
    let _approvalDate_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _vendor_decorators;
    let _vendor_initializers = [];
    let _vendor_extraInitializers = [];
    var VendorContract = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.contractNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _contractNumber_initializers, void 0));
            this.vendorId = (__runInitializers(this, _contractNumber_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.contractType = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _contractType_initializers, void 0));
            this.status = (__runInitializers(this, _contractType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.startDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.autoRenew = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _autoRenew_initializers, void 0));
            this.renewalNoticeDays = (__runInitializers(this, _autoRenew_extraInitializers), __runInitializers(this, _renewalNoticeDays_initializers, void 0));
            this.contractValue = (__runInitializers(this, _renewalNoticeDays_extraInitializers), __runInitializers(this, _contractValue_initializers, void 0));
            this.paymentSchedule = (__runInitializers(this, _contractValue_extraInitializers), __runInitializers(this, _paymentSchedule_initializers, void 0));
            this.terms = (__runInitializers(this, _paymentSchedule_extraInitializers), __runInitializers(this, _terms_initializers, void 0));
            this.deliverables = (__runInitializers(this, _terms_extraInitializers), __runInitializers(this, _deliverables_initializers, void 0));
            this.contractDocumentUrl = (__runInitializers(this, _deliverables_extraInitializers), __runInitializers(this, _contractDocumentUrl_initializers, void 0));
            this.createdBy = (__runInitializers(this, _contractDocumentUrl_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvalDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
            this.notes = (__runInitializers(this, _approvalDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.vendor = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _vendor_initializers, void 0));
            __runInitializers(this, _vendor_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "VendorContract");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _contractNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _vendorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor ID' }), (0, sequelize_typescript_1.ForeignKey)(() => AssetVendor), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _contractType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ContractStatus)),
                defaultValue: ContractStatus.DRAFT,
            }), sequelize_typescript_1.Index];
        _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _autoRenew_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-renew enabled' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _renewalNoticeDays_decorators = [(0, swagger_1.ApiProperty)({ description: 'Renewal notice days' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _contractValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _paymentSchedule_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment schedule' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _terms_decorators = [(0, swagger_1.ApiProperty)({ description: 'Terms and conditions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _deliverables_decorators = [(0, swagger_1.ApiProperty)({ description: 'Deliverables' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT) })];
        _contractDocumentUrl_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract document URL' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Created by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _approvalDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _vendor_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => AssetVendor)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _contractNumber_decorators, { kind: "field", name: "contractNumber", static: false, private: false, access: { has: obj => "contractNumber" in obj, get: obj => obj.contractNumber, set: (obj, value) => { obj.contractNumber = value; } }, metadata: _metadata }, _contractNumber_initializers, _contractNumber_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _contractType_decorators, { kind: "field", name: "contractType", static: false, private: false, access: { has: obj => "contractType" in obj, get: obj => obj.contractType, set: (obj, value) => { obj.contractType = value; } }, metadata: _metadata }, _contractType_initializers, _contractType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _autoRenew_decorators, { kind: "field", name: "autoRenew", static: false, private: false, access: { has: obj => "autoRenew" in obj, get: obj => obj.autoRenew, set: (obj, value) => { obj.autoRenew = value; } }, metadata: _metadata }, _autoRenew_initializers, _autoRenew_extraInitializers);
        __esDecorate(null, null, _renewalNoticeDays_decorators, { kind: "field", name: "renewalNoticeDays", static: false, private: false, access: { has: obj => "renewalNoticeDays" in obj, get: obj => obj.renewalNoticeDays, set: (obj, value) => { obj.renewalNoticeDays = value; } }, metadata: _metadata }, _renewalNoticeDays_initializers, _renewalNoticeDays_extraInitializers);
        __esDecorate(null, null, _contractValue_decorators, { kind: "field", name: "contractValue", static: false, private: false, access: { has: obj => "contractValue" in obj, get: obj => obj.contractValue, set: (obj, value) => { obj.contractValue = value; } }, metadata: _metadata }, _contractValue_initializers, _contractValue_extraInitializers);
        __esDecorate(null, null, _paymentSchedule_decorators, { kind: "field", name: "paymentSchedule", static: false, private: false, access: { has: obj => "paymentSchedule" in obj, get: obj => obj.paymentSchedule, set: (obj, value) => { obj.paymentSchedule = value; } }, metadata: _metadata }, _paymentSchedule_initializers, _paymentSchedule_extraInitializers);
        __esDecorate(null, null, _terms_decorators, { kind: "field", name: "terms", static: false, private: false, access: { has: obj => "terms" in obj, get: obj => obj.terms, set: (obj, value) => { obj.terms = value; } }, metadata: _metadata }, _terms_initializers, _terms_extraInitializers);
        __esDecorate(null, null, _deliverables_decorators, { kind: "field", name: "deliverables", static: false, private: false, access: { has: obj => "deliverables" in obj, get: obj => obj.deliverables, set: (obj, value) => { obj.deliverables = value; } }, metadata: _metadata }, _deliverables_initializers, _deliverables_extraInitializers);
        __esDecorate(null, null, _contractDocumentUrl_decorators, { kind: "field", name: "contractDocumentUrl", static: false, private: false, access: { has: obj => "contractDocumentUrl" in obj, get: obj => obj.contractDocumentUrl, set: (obj, value) => { obj.contractDocumentUrl = value; } }, metadata: _metadata }, _contractDocumentUrl_initializers, _contractDocumentUrl_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: obj => "approvalDate" in obj, get: obj => obj.approvalDate, set: (obj, value) => { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _vendor_decorators, { kind: "field", name: "vendor", static: false, private: false, access: { has: obj => "vendor" in obj, get: obj => obj.vendor, set: (obj, value) => { obj.vendor = value; } }, metadata: _metadata }, _vendor_initializers, _vendor_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VendorContract = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VendorContract = _classThis;
})();
exports.VendorContract = VendorContract;
/**
 * Vendor SLA Model
 */
let VendorSLA = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'vendor_slas',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['vendor_id'] },
                { fields: ['metric_type'] },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _slaName_decorators;
    let _slaName_initializers = [];
    let _slaName_extraInitializers = [];
    let _metricType_decorators;
    let _metricType_initializers = [];
    let _metricType_extraInitializers = [];
    let _targetValue_decorators;
    let _targetValue_initializers = [];
    let _targetValue_extraInitializers = [];
    let _unit_decorators;
    let _unit_initializers = [];
    let _unit_extraInitializers = [];
    let _measurementFrequency_decorators;
    let _measurementFrequency_initializers = [];
    let _measurementFrequency_extraInitializers = [];
    let _currentValue_decorators;
    let _currentValue_initializers = [];
    let _currentValue_extraInitializers = [];
    let _compliancePercentage_decorators;
    let _compliancePercentage_initializers = [];
    let _compliancePercentage_extraInitializers = [];
    let _penaltyForBreach_decorators;
    let _penaltyForBreach_initializers = [];
    let _penaltyForBreach_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _lastMeasuredDate_decorators;
    let _lastMeasuredDate_initializers = [];
    let _lastMeasuredDate_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _vendor_decorators;
    let _vendor_initializers = [];
    let _vendor_extraInitializers = [];
    let _measurements_decorators;
    let _measurements_initializers = [];
    let _measurements_extraInitializers = [];
    var VendorSLA = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.vendorId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.slaName = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _slaName_initializers, void 0));
            this.metricType = (__runInitializers(this, _slaName_extraInitializers), __runInitializers(this, _metricType_initializers, void 0));
            this.targetValue = (__runInitializers(this, _metricType_extraInitializers), __runInitializers(this, _targetValue_initializers, void 0));
            this.unit = (__runInitializers(this, _targetValue_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
            this.measurementFrequency = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _measurementFrequency_initializers, void 0));
            this.currentValue = (__runInitializers(this, _measurementFrequency_extraInitializers), __runInitializers(this, _currentValue_initializers, void 0));
            this.compliancePercentage = (__runInitializers(this, _currentValue_extraInitializers), __runInitializers(this, _compliancePercentage_initializers, void 0));
            this.penaltyForBreach = (__runInitializers(this, _compliancePercentage_extraInitializers), __runInitializers(this, _penaltyForBreach_initializers, void 0));
            this.description = (__runInitializers(this, _penaltyForBreach_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.isActive = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.lastMeasuredDate = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _lastMeasuredDate_initializers, void 0));
            this.createdAt = (__runInitializers(this, _lastMeasuredDate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.vendor = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _vendor_initializers, void 0));
            this.measurements = (__runInitializers(this, _vendor_extraInitializers), __runInitializers(this, _measurements_initializers, void 0));
            __runInitializers(this, _measurements_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "VendorSLA");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _vendorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor ID' }), (0, sequelize_typescript_1.ForeignKey)(() => AssetVendor), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _slaName_decorators = [(0, swagger_1.ApiProperty)({ description: 'SLA name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _metricType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }), sequelize_typescript_1.Index];
        _targetValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false })];
        _unit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit of measurement' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false })];
        _measurementFrequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Measurement frequency' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _currentValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _compliancePercentage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Compliance percentage' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2) })];
        _penaltyForBreach_decorators = [(0, swagger_1.ApiProperty)({ description: 'Penalty for breach' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _lastMeasuredDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last measured date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _vendor_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => AssetVendor)];
        _measurements_decorators = [(0, sequelize_typescript_1.HasMany)(() => SLAMeasurement)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _slaName_decorators, { kind: "field", name: "slaName", static: false, private: false, access: { has: obj => "slaName" in obj, get: obj => obj.slaName, set: (obj, value) => { obj.slaName = value; } }, metadata: _metadata }, _slaName_initializers, _slaName_extraInitializers);
        __esDecorate(null, null, _metricType_decorators, { kind: "field", name: "metricType", static: false, private: false, access: { has: obj => "metricType" in obj, get: obj => obj.metricType, set: (obj, value) => { obj.metricType = value; } }, metadata: _metadata }, _metricType_initializers, _metricType_extraInitializers);
        __esDecorate(null, null, _targetValue_decorators, { kind: "field", name: "targetValue", static: false, private: false, access: { has: obj => "targetValue" in obj, get: obj => obj.targetValue, set: (obj, value) => { obj.targetValue = value; } }, metadata: _metadata }, _targetValue_initializers, _targetValue_extraInitializers);
        __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: obj => "unit" in obj, get: obj => obj.unit, set: (obj, value) => { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
        __esDecorate(null, null, _measurementFrequency_decorators, { kind: "field", name: "measurementFrequency", static: false, private: false, access: { has: obj => "measurementFrequency" in obj, get: obj => obj.measurementFrequency, set: (obj, value) => { obj.measurementFrequency = value; } }, metadata: _metadata }, _measurementFrequency_initializers, _measurementFrequency_extraInitializers);
        __esDecorate(null, null, _currentValue_decorators, { kind: "field", name: "currentValue", static: false, private: false, access: { has: obj => "currentValue" in obj, get: obj => obj.currentValue, set: (obj, value) => { obj.currentValue = value; } }, metadata: _metadata }, _currentValue_initializers, _currentValue_extraInitializers);
        __esDecorate(null, null, _compliancePercentage_decorators, { kind: "field", name: "compliancePercentage", static: false, private: false, access: { has: obj => "compliancePercentage" in obj, get: obj => obj.compliancePercentage, set: (obj, value) => { obj.compliancePercentage = value; } }, metadata: _metadata }, _compliancePercentage_initializers, _compliancePercentage_extraInitializers);
        __esDecorate(null, null, _penaltyForBreach_decorators, { kind: "field", name: "penaltyForBreach", static: false, private: false, access: { has: obj => "penaltyForBreach" in obj, get: obj => obj.penaltyForBreach, set: (obj, value) => { obj.penaltyForBreach = value; } }, metadata: _metadata }, _penaltyForBreach_initializers, _penaltyForBreach_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _lastMeasuredDate_decorators, { kind: "field", name: "lastMeasuredDate", static: false, private: false, access: { has: obj => "lastMeasuredDate" in obj, get: obj => obj.lastMeasuredDate, set: (obj, value) => { obj.lastMeasuredDate = value; } }, metadata: _metadata }, _lastMeasuredDate_initializers, _lastMeasuredDate_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _vendor_decorators, { kind: "field", name: "vendor", static: false, private: false, access: { has: obj => "vendor" in obj, get: obj => obj.vendor, set: (obj, value) => { obj.vendor = value; } }, metadata: _metadata }, _vendor_initializers, _vendor_extraInitializers);
        __esDecorate(null, null, _measurements_decorators, { kind: "field", name: "measurements", static: false, private: false, access: { has: obj => "measurements" in obj, get: obj => obj.measurements, set: (obj, value) => { obj.measurements = value; } }, metadata: _metadata }, _measurements_initializers, _measurements_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VendorSLA = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VendorSLA = _classThis;
})();
exports.VendorSLA = VendorSLA;
/**
 * SLA Measurement Model
 */
let SLAMeasurement = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'sla_measurements',
            timestamps: true,
            indexes: [
                { fields: ['sla_id'] },
                { fields: ['measurement_date'] },
                { fields: ['status'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _slaId_decorators;
    let _slaId_initializers = [];
    let _slaId_extraInitializers = [];
    let _measurementDate_decorators;
    let _measurementDate_initializers = [];
    let _measurementDate_extraInitializers = [];
    let _measuredValue_decorators;
    let _measuredValue_initializers = [];
    let _measuredValue_extraInitializers = [];
    let _targetValue_decorators;
    let _targetValue_initializers = [];
    let _targetValue_extraInitializers = [];
    let _variance_decorators;
    let _variance_initializers = [];
    let _variance_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _measuredBy_decorators;
    let _measuredBy_initializers = [];
    let _measuredBy_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _sla_decorators;
    let _sla_initializers = [];
    let _sla_extraInitializers = [];
    var SLAMeasurement = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.slaId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _slaId_initializers, void 0));
            this.measurementDate = (__runInitializers(this, _slaId_extraInitializers), __runInitializers(this, _measurementDate_initializers, void 0));
            this.measuredValue = (__runInitializers(this, _measurementDate_extraInitializers), __runInitializers(this, _measuredValue_initializers, void 0));
            this.targetValue = (__runInitializers(this, _measuredValue_extraInitializers), __runInitializers(this, _targetValue_initializers, void 0));
            this.variance = (__runInitializers(this, _targetValue_extraInitializers), __runInitializers(this, _variance_initializers, void 0));
            this.status = (__runInitializers(this, _variance_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.measuredBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _measuredBy_initializers, void 0));
            this.notes = (__runInitializers(this, _measuredBy_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.sla = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _sla_initializers, void 0));
            __runInitializers(this, _sla_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SLAMeasurement");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _slaId_decorators = [(0, swagger_1.ApiProperty)({ description: 'SLA ID' }), (0, sequelize_typescript_1.ForeignKey)(() => VendorSLA), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _measurementDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Measurement date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _measuredValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Measured value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false })];
        _targetValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false })];
        _variance_decorators = [(0, swagger_1.ApiProperty)({ description: 'Variance' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'SLA status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(SLAStatus)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _measuredBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Measured by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _sla_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => VendorSLA)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _slaId_decorators, { kind: "field", name: "slaId", static: false, private: false, access: { has: obj => "slaId" in obj, get: obj => obj.slaId, set: (obj, value) => { obj.slaId = value; } }, metadata: _metadata }, _slaId_initializers, _slaId_extraInitializers);
        __esDecorate(null, null, _measurementDate_decorators, { kind: "field", name: "measurementDate", static: false, private: false, access: { has: obj => "measurementDate" in obj, get: obj => obj.measurementDate, set: (obj, value) => { obj.measurementDate = value; } }, metadata: _metadata }, _measurementDate_initializers, _measurementDate_extraInitializers);
        __esDecorate(null, null, _measuredValue_decorators, { kind: "field", name: "measuredValue", static: false, private: false, access: { has: obj => "measuredValue" in obj, get: obj => obj.measuredValue, set: (obj, value) => { obj.measuredValue = value; } }, metadata: _metadata }, _measuredValue_initializers, _measuredValue_extraInitializers);
        __esDecorate(null, null, _targetValue_decorators, { kind: "field", name: "targetValue", static: false, private: false, access: { has: obj => "targetValue" in obj, get: obj => obj.targetValue, set: (obj, value) => { obj.targetValue = value; } }, metadata: _metadata }, _targetValue_initializers, _targetValue_extraInitializers);
        __esDecorate(null, null, _variance_decorators, { kind: "field", name: "variance", static: false, private: false, access: { has: obj => "variance" in obj, get: obj => obj.variance, set: (obj, value) => { obj.variance = value; } }, metadata: _metadata }, _variance_initializers, _variance_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _measuredBy_decorators, { kind: "field", name: "measuredBy", static: false, private: false, access: { has: obj => "measuredBy" in obj, get: obj => obj.measuredBy, set: (obj, value) => { obj.measuredBy = value; } }, metadata: _metadata }, _measuredBy_initializers, _measuredBy_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _sla_decorators, { kind: "field", name: "sla", static: false, private: false, access: { has: obj => "sla" in obj, get: obj => obj.sla, set: (obj, value) => { obj.sla = value; } }, metadata: _metadata }, _sla_initializers, _sla_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SLAMeasurement = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SLAMeasurement = _classThis;
})();
exports.SLAMeasurement = SLAMeasurement;
/**
 * Vendor Performance Evaluation Model
 */
let VendorPerformanceEvaluation = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'vendor_performance_evaluations',
            timestamps: true,
            indexes: [
                { fields: ['vendor_id'] },
                { fields: ['evaluation_date'] },
                { fields: ['overall_rating'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _evaluationPeriodStart_decorators;
    let _evaluationPeriodStart_initializers = [];
    let _evaluationPeriodStart_extraInitializers = [];
    let _evaluationPeriodEnd_decorators;
    let _evaluationPeriodEnd_initializers = [];
    let _evaluationPeriodEnd_extraInitializers = [];
    let _evaluationDate_decorators;
    let _evaluationDate_initializers = [];
    let _evaluationDate_extraInitializers = [];
    let _evaluatedBy_decorators;
    let _evaluatedBy_initializers = [];
    let _evaluatedBy_extraInitializers = [];
    let _overallRating_decorators;
    let _overallRating_initializers = [];
    let _overallRating_extraInitializers = [];
    let _qualityScore_decorators;
    let _qualityScore_initializers = [];
    let _qualityScore_extraInitializers = [];
    let _deliveryScore_decorators;
    let _deliveryScore_initializers = [];
    let _deliveryScore_extraInitializers = [];
    let _communicationScore_decorators;
    let _communicationScore_initializers = [];
    let _communicationScore_extraInitializers = [];
    let _pricingScore_decorators;
    let _pricingScore_initializers = [];
    let _pricingScore_extraInitializers = [];
    let _responseTimeScore_decorators;
    let _responseTimeScore_initializers = [];
    let _responseTimeScore_extraInitializers = [];
    let _overallScore_decorators;
    let _overallScore_initializers = [];
    let _overallScore_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    let _strengths_decorators;
    let _strengths_initializers = [];
    let _strengths_extraInitializers = [];
    let _weaknesses_decorators;
    let _weaknesses_initializers = [];
    let _weaknesses_extraInitializers = [];
    let _recommendations_decorators;
    let _recommendations_initializers = [];
    let _recommendations_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _vendor_decorators;
    let _vendor_initializers = [];
    let _vendor_extraInitializers = [];
    var VendorPerformanceEvaluation = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.vendorId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.evaluationPeriodStart = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _evaluationPeriodStart_initializers, void 0));
            this.evaluationPeriodEnd = (__runInitializers(this, _evaluationPeriodStart_extraInitializers), __runInitializers(this, _evaluationPeriodEnd_initializers, void 0));
            this.evaluationDate = (__runInitializers(this, _evaluationPeriodEnd_extraInitializers), __runInitializers(this, _evaluationDate_initializers, void 0));
            this.evaluatedBy = (__runInitializers(this, _evaluationDate_extraInitializers), __runInitializers(this, _evaluatedBy_initializers, void 0));
            this.overallRating = (__runInitializers(this, _evaluatedBy_extraInitializers), __runInitializers(this, _overallRating_initializers, void 0));
            this.qualityScore = (__runInitializers(this, _overallRating_extraInitializers), __runInitializers(this, _qualityScore_initializers, void 0));
            this.deliveryScore = (__runInitializers(this, _qualityScore_extraInitializers), __runInitializers(this, _deliveryScore_initializers, void 0));
            this.communicationScore = (__runInitializers(this, _deliveryScore_extraInitializers), __runInitializers(this, _communicationScore_initializers, void 0));
            this.pricingScore = (__runInitializers(this, _communicationScore_extraInitializers), __runInitializers(this, _pricingScore_initializers, void 0));
            this.responseTimeScore = (__runInitializers(this, _pricingScore_extraInitializers), __runInitializers(this, _responseTimeScore_initializers, void 0));
            this.overallScore = (__runInitializers(this, _responseTimeScore_extraInitializers), __runInitializers(this, _overallScore_initializers, void 0));
            this.comments = (__runInitializers(this, _overallScore_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
            this.strengths = (__runInitializers(this, _comments_extraInitializers), __runInitializers(this, _strengths_initializers, void 0));
            this.weaknesses = (__runInitializers(this, _strengths_extraInitializers), __runInitializers(this, _weaknesses_initializers, void 0));
            this.recommendations = (__runInitializers(this, _weaknesses_extraInitializers), __runInitializers(this, _recommendations_initializers, void 0));
            this.createdAt = (__runInitializers(this, _recommendations_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.vendor = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _vendor_initializers, void 0));
            __runInitializers(this, _vendor_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "VendorPerformanceEvaluation");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _vendorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor ID' }), (0, sequelize_typescript_1.ForeignKey)(() => AssetVendor), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _evaluationPeriodStart_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evaluation period start' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _evaluationPeriodEnd_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evaluation period end' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _evaluationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evaluation date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _evaluatedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evaluated by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _overallRating_decorators = [(0, swagger_1.ApiProperty)({ description: 'Overall rating' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PerformanceRating)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _qualityScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quality score (0-100)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), allowNull: false })];
        _deliveryScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delivery score (0-100)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), allowNull: false })];
        _communicationScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Communication score (0-100)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), allowNull: false })];
        _pricingScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Pricing score (0-100)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), allowNull: false })];
        _responseTimeScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Response time score (0-100)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), allowNull: false })];
        _overallScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Overall score (0-100)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2) })];
        _comments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Comments' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _strengths_decorators = [(0, swagger_1.ApiProperty)({ description: 'Strengths' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT) })];
        _weaknesses_decorators = [(0, swagger_1.ApiProperty)({ description: 'Weaknesses' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT) })];
        _recommendations_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recommendations' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _vendor_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => AssetVendor)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _evaluationPeriodStart_decorators, { kind: "field", name: "evaluationPeriodStart", static: false, private: false, access: { has: obj => "evaluationPeriodStart" in obj, get: obj => obj.evaluationPeriodStart, set: (obj, value) => { obj.evaluationPeriodStart = value; } }, metadata: _metadata }, _evaluationPeriodStart_initializers, _evaluationPeriodStart_extraInitializers);
        __esDecorate(null, null, _evaluationPeriodEnd_decorators, { kind: "field", name: "evaluationPeriodEnd", static: false, private: false, access: { has: obj => "evaluationPeriodEnd" in obj, get: obj => obj.evaluationPeriodEnd, set: (obj, value) => { obj.evaluationPeriodEnd = value; } }, metadata: _metadata }, _evaluationPeriodEnd_initializers, _evaluationPeriodEnd_extraInitializers);
        __esDecorate(null, null, _evaluationDate_decorators, { kind: "field", name: "evaluationDate", static: false, private: false, access: { has: obj => "evaluationDate" in obj, get: obj => obj.evaluationDate, set: (obj, value) => { obj.evaluationDate = value; } }, metadata: _metadata }, _evaluationDate_initializers, _evaluationDate_extraInitializers);
        __esDecorate(null, null, _evaluatedBy_decorators, { kind: "field", name: "evaluatedBy", static: false, private: false, access: { has: obj => "evaluatedBy" in obj, get: obj => obj.evaluatedBy, set: (obj, value) => { obj.evaluatedBy = value; } }, metadata: _metadata }, _evaluatedBy_initializers, _evaluatedBy_extraInitializers);
        __esDecorate(null, null, _overallRating_decorators, { kind: "field", name: "overallRating", static: false, private: false, access: { has: obj => "overallRating" in obj, get: obj => obj.overallRating, set: (obj, value) => { obj.overallRating = value; } }, metadata: _metadata }, _overallRating_initializers, _overallRating_extraInitializers);
        __esDecorate(null, null, _qualityScore_decorators, { kind: "field", name: "qualityScore", static: false, private: false, access: { has: obj => "qualityScore" in obj, get: obj => obj.qualityScore, set: (obj, value) => { obj.qualityScore = value; } }, metadata: _metadata }, _qualityScore_initializers, _qualityScore_extraInitializers);
        __esDecorate(null, null, _deliveryScore_decorators, { kind: "field", name: "deliveryScore", static: false, private: false, access: { has: obj => "deliveryScore" in obj, get: obj => obj.deliveryScore, set: (obj, value) => { obj.deliveryScore = value; } }, metadata: _metadata }, _deliveryScore_initializers, _deliveryScore_extraInitializers);
        __esDecorate(null, null, _communicationScore_decorators, { kind: "field", name: "communicationScore", static: false, private: false, access: { has: obj => "communicationScore" in obj, get: obj => obj.communicationScore, set: (obj, value) => { obj.communicationScore = value; } }, metadata: _metadata }, _communicationScore_initializers, _communicationScore_extraInitializers);
        __esDecorate(null, null, _pricingScore_decorators, { kind: "field", name: "pricingScore", static: false, private: false, access: { has: obj => "pricingScore" in obj, get: obj => obj.pricingScore, set: (obj, value) => { obj.pricingScore = value; } }, metadata: _metadata }, _pricingScore_initializers, _pricingScore_extraInitializers);
        __esDecorate(null, null, _responseTimeScore_decorators, { kind: "field", name: "responseTimeScore", static: false, private: false, access: { has: obj => "responseTimeScore" in obj, get: obj => obj.responseTimeScore, set: (obj, value) => { obj.responseTimeScore = value; } }, metadata: _metadata }, _responseTimeScore_initializers, _responseTimeScore_extraInitializers);
        __esDecorate(null, null, _overallScore_decorators, { kind: "field", name: "overallScore", static: false, private: false, access: { has: obj => "overallScore" in obj, get: obj => obj.overallScore, set: (obj, value) => { obj.overallScore = value; } }, metadata: _metadata }, _overallScore_initializers, _overallScore_extraInitializers);
        __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
        __esDecorate(null, null, _strengths_decorators, { kind: "field", name: "strengths", static: false, private: false, access: { has: obj => "strengths" in obj, get: obj => obj.strengths, set: (obj, value) => { obj.strengths = value; } }, metadata: _metadata }, _strengths_initializers, _strengths_extraInitializers);
        __esDecorate(null, null, _weaknesses_decorators, { kind: "field", name: "weaknesses", static: false, private: false, access: { has: obj => "weaknesses" in obj, get: obj => obj.weaknesses, set: (obj, value) => { obj.weaknesses = value; } }, metadata: _metadata }, _weaknesses_initializers, _weaknesses_extraInitializers);
        __esDecorate(null, null, _recommendations_decorators, { kind: "field", name: "recommendations", static: false, private: false, access: { has: obj => "recommendations" in obj, get: obj => obj.recommendations, set: (obj, value) => { obj.recommendations = value; } }, metadata: _metadata }, _recommendations_initializers, _recommendations_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _vendor_decorators, { kind: "field", name: "vendor", static: false, private: false, access: { has: obj => "vendor" in obj, get: obj => obj.vendor, set: (obj, value) => { obj.vendor = value; } }, metadata: _metadata }, _vendor_initializers, _vendor_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VendorPerformanceEvaluation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VendorPerformanceEvaluation = _classThis;
})();
exports.VendorPerformanceEvaluation = VendorPerformanceEvaluation;
/**
 * Vendor Pricing Model
 */
let VendorPricingModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'vendor_pricing',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['vendor_id'] },
                { fields: ['item_code'] },
                { fields: ['effective_date'] },
                { fields: ['is_active'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _itemCode_decorators;
    let _itemCode_initializers = [];
    let _itemCode_extraInitializers = [];
    let _itemDescription_decorators;
    let _itemDescription_initializers = [];
    let _itemDescription_extraInitializers = [];
    let _unitPrice_decorators;
    let _unitPrice_initializers = [];
    let _unitPrice_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _minimumOrderQuantity_decorators;
    let _minimumOrderQuantity_initializers = [];
    let _minimumOrderQuantity_extraInitializers = [];
    let _leadTimeDays_decorators;
    let _leadTimeDays_initializers = [];
    let _leadTimeDays_extraInitializers = [];
    let _volumeDiscounts_decorators;
    let _volumeDiscounts_initializers = [];
    let _volumeDiscounts_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _vendor_decorators;
    let _vendor_initializers = [];
    let _vendor_extraInitializers = [];
    var VendorPricingModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.vendorId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.itemCode = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _itemCode_initializers, void 0));
            this.itemDescription = (__runInitializers(this, _itemCode_extraInitializers), __runInitializers(this, _itemDescription_initializers, void 0));
            this.unitPrice = (__runInitializers(this, _itemDescription_extraInitializers), __runInitializers(this, _unitPrice_initializers, void 0));
            this.currency = (__runInitializers(this, _unitPrice_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.minimumOrderQuantity = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _minimumOrderQuantity_initializers, void 0));
            this.leadTimeDays = (__runInitializers(this, _minimumOrderQuantity_extraInitializers), __runInitializers(this, _leadTimeDays_initializers, void 0));
            this.volumeDiscounts = (__runInitializers(this, _leadTimeDays_extraInitializers), __runInitializers(this, _volumeDiscounts_initializers, void 0));
            this.isActive = (__runInitializers(this, _volumeDiscounts_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.notes = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.vendor = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _vendor_initializers, void 0));
            __runInitializers(this, _vendor_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "VendorPricingModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _vendorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor ID' }), (0, sequelize_typescript_1.ForeignKey)(() => AssetVendor), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _itemCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Item code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }), sequelize_typescript_1.Index];
        _itemDescription_decorators = [(0, swagger_1.ApiProperty)({ description: 'Item description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _unitPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit price' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(3), defaultValue: 'USD' })];
        _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _expirationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expiration date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _minimumOrderQuantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minimum order quantity' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _leadTimeDays_decorators = [(0, swagger_1.ApiProperty)({ description: 'Lead time in days' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _volumeDiscounts_decorators = [(0, swagger_1.ApiProperty)({ description: 'Volume discounts' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _vendor_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => AssetVendor)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _itemCode_decorators, { kind: "field", name: "itemCode", static: false, private: false, access: { has: obj => "itemCode" in obj, get: obj => obj.itemCode, set: (obj, value) => { obj.itemCode = value; } }, metadata: _metadata }, _itemCode_initializers, _itemCode_extraInitializers);
        __esDecorate(null, null, _itemDescription_decorators, { kind: "field", name: "itemDescription", static: false, private: false, access: { has: obj => "itemDescription" in obj, get: obj => obj.itemDescription, set: (obj, value) => { obj.itemDescription = value; } }, metadata: _metadata }, _itemDescription_initializers, _itemDescription_extraInitializers);
        __esDecorate(null, null, _unitPrice_decorators, { kind: "field", name: "unitPrice", static: false, private: false, access: { has: obj => "unitPrice" in obj, get: obj => obj.unitPrice, set: (obj, value) => { obj.unitPrice = value; } }, metadata: _metadata }, _unitPrice_initializers, _unitPrice_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _minimumOrderQuantity_decorators, { kind: "field", name: "minimumOrderQuantity", static: false, private: false, access: { has: obj => "minimumOrderQuantity" in obj, get: obj => obj.minimumOrderQuantity, set: (obj, value) => { obj.minimumOrderQuantity = value; } }, metadata: _metadata }, _minimumOrderQuantity_initializers, _minimumOrderQuantity_extraInitializers);
        __esDecorate(null, null, _leadTimeDays_decorators, { kind: "field", name: "leadTimeDays", static: false, private: false, access: { has: obj => "leadTimeDays" in obj, get: obj => obj.leadTimeDays, set: (obj, value) => { obj.leadTimeDays = value; } }, metadata: _metadata }, _leadTimeDays_initializers, _leadTimeDays_extraInitializers);
        __esDecorate(null, null, _volumeDiscounts_decorators, { kind: "field", name: "volumeDiscounts", static: false, private: false, access: { has: obj => "volumeDiscounts" in obj, get: obj => obj.volumeDiscounts, set: (obj, value) => { obj.volumeDiscounts = value; } }, metadata: _metadata }, _volumeDiscounts_initializers, _volumeDiscounts_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _vendor_decorators, { kind: "field", name: "vendor", static: false, private: false, access: { has: obj => "vendor" in obj, get: obj => obj.vendor, set: (obj, value) => { obj.vendor = value; } }, metadata: _metadata }, _vendor_initializers, _vendor_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VendorPricingModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VendorPricingModel = _classThis;
})();
exports.VendorPricingModel = VendorPricingModel;
// ============================================================================
// VENDOR MANAGEMENT
// ============================================================================
/**
 * Creates new vendor
 *
 * @param data - Vendor data
 * @param transaction - Optional database transaction
 * @returns Created vendor
 *
 * @example
 * ```typescript
 * const vendor = await createVendor({
 *   vendorCode: 'VND-2024-001',
 *   vendorName: 'ABC Manufacturing Inc.',
 *   vendorType: VendorType.MANUFACTURER,
 *   tier: VendorTier.APPROVED,
 *   contactInfo: {
 *     primaryContact: 'John Smith',
 *     email: 'john.smith@abcmfg.com',
 *     phone: '555-0123'
 *   },
 *   paymentTerms: 'Net 30',
 *   createdBy: 'user-001'
 * });
 * ```
 */
async function createVendor(data, transaction) {
    // Check for duplicate vendor code
    const existing = await AssetVendor.findOne({
        where: { vendorCode: data.vendorCode },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException(`Vendor code ${data.vendorCode} already exists`);
    }
    const vendor = await AssetVendor.create({
        ...data,
        status: VendorStatus.PENDING_APPROVAL,
        onboardingDate: new Date(),
        isActive: true,
    }, { transaction });
    return vendor;
}
/**
 * Updates vendor information
 *
 * @param vendorId - Vendor ID
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated vendor
 *
 * @example
 * ```typescript
 * await updateVendor('vendor-123', {
 *   tier: VendorTier.PREFERRED,
 *   paymentTerms: 'Net 45',
 *   contactInfo: { email: 'newemail@vendor.com' }
 * });
 * ```
 */
async function updateVendor(vendorId, updates, transaction) {
    const vendor = await AssetVendor.findByPk(vendorId, { transaction });
    if (!vendor) {
        throw new common_1.NotFoundException(`Vendor ${vendorId} not found`);
    }
    await vendor.update(updates, { transaction });
    return vendor;
}
/**
 * Approves vendor
 *
 * @param vendorId - Vendor ID
 * @param approvedBy - User ID
 * @param tier - Assigned tier
 * @param transaction - Optional database transaction
 * @returns Updated vendor
 *
 * @example
 * ```typescript
 * await approveVendor('vendor-123', 'mgr-001', VendorTier.APPROVED);
 * ```
 */
async function approveVendor(vendorId, approvedBy, tier = VendorTier.APPROVED, transaction) {
    const vendor = await AssetVendor.findByPk(vendorId, { transaction });
    if (!vendor) {
        throw new common_1.NotFoundException(`Vendor ${vendorId} not found`);
    }
    await vendor.update({
        status: VendorStatus.ACTIVE,
        tier,
        onboardingDate: new Date(),
    }, { transaction });
    return vendor;
}
/**
 * Gets vendor by ID
 *
 * @param vendorId - Vendor ID
 * @param includeRelated - Whether to include related data
 * @returns Vendor details
 *
 * @example
 * ```typescript
 * const vendor = await getVendorById('vendor-123', true);
 * ```
 */
async function getVendorById(vendorId, includeRelated = false) {
    const include = includeRelated
        ? [
            { model: VendorContract, as: 'contracts' },
            { model: VendorSLA, as: 'slas' },
            { model: VendorPerformanceEvaluation, as: 'evaluations' },
            { model: VendorPricingModel, as: 'pricing' },
        ]
        : [];
    const vendor = await AssetVendor.findByPk(vendorId, { include });
    if (!vendor) {
        throw new common_1.NotFoundException(`Vendor ${vendorId} not found`);
    }
    return vendor;
}
/**
 * Searches vendors with filters
 *
 * @param filters - Search filters
 * @param options - Query options
 * @returns Filtered vendors
 *
 * @example
 * ```typescript
 * const vendors = await searchVendors({
 *   status: VendorStatus.ACTIVE,
 *   vendorType: VendorType.SERVICE_PROVIDER,
 *   tier: VendorTier.PREFERRED
 * });
 * ```
 */
async function searchVendors(filters, options = {}) {
    const where = { isActive: true };
    if (filters.status) {
        where.status = Array.isArray(filters.status)
            ? { [sequelize_1.Op.in]: filters.status }
            : filters.status;
    }
    if (filters.vendorType) {
        where.vendorType = Array.isArray(filters.vendorType)
            ? { [sequelize_1.Op.in]: filters.vendorType }
            : filters.vendorType;
    }
    if (filters.tier) {
        where.tier = Array.isArray(filters.tier)
            ? { [sequelize_1.Op.in]: filters.tier }
            : filters.tier;
    }
    if (filters.searchTerm) {
        where[sequelize_1.Op.or] = [
            { vendorCode: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
            { vendorName: { [sequelize_1.Op.iLike]: `%${filters.searchTerm}%` } },
        ];
    }
    if (filters.minPerformanceScore !== undefined) {
        where.performanceScore = { [sequelize_1.Op.gte]: filters.minPerformanceScore };
    }
    const { rows: vendors, count: total } = await AssetVendor.findAndCountAll({
        where,
        ...options,
    });
    return { vendors, total };
}
// ============================================================================
// CONTRACT MANAGEMENT
// ============================================================================
/**
 * Creates vendor contract
 *
 * @param data - Contract data
 * @param transaction - Optional database transaction
 * @returns Created contract
 *
 * @example
 * ```typescript
 * const contract = await createVendorContract({
 *   vendorId: 'vendor-123',
 *   contractNumber: 'CNT-2024-001',
 *   contractType: 'Service Agreement',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2025-12-31'),
 *   autoRenew: true,
 *   contractValue: 100000,
 *   createdBy: 'user-001'
 * });
 * ```
 */
async function createVendorContract(data, transaction) {
    const vendor = await AssetVendor.findByPk(data.vendorId, { transaction });
    if (!vendor) {
        throw new common_1.NotFoundException(`Vendor ${data.vendorId} not found`);
    }
    // Check for duplicate contract number
    const existing = await VendorContract.findOne({
        where: { contractNumber: data.contractNumber },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException(`Contract number ${data.contractNumber} already exists`);
    }
    const contract = await VendorContract.create({
        ...data,
        status: ContractStatus.DRAFT,
    }, { transaction });
    return contract;
}
/**
 * Activates vendor contract
 *
 * @param contractId - Contract ID
 * @param approvedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Updated contract
 *
 * @example
 * ```typescript
 * await activateVendorContract('contract-123', 'mgr-001');
 * ```
 */
async function activateVendorContract(contractId, approvedBy, transaction) {
    const contract = await VendorContract.findByPk(contractId, { transaction });
    if (!contract) {
        throw new common_1.NotFoundException(`Contract ${contractId} not found`);
    }
    await contract.update({
        status: ContractStatus.ACTIVE,
        approvedBy,
        approvalDate: new Date(),
    }, { transaction });
    return contract;
}
/**
 * Gets expiring contracts
 *
 * @param daysAhead - Days to look ahead
 * @returns Expiring contracts
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringContracts(90);
 * ```
 */
async function getExpiringContracts(daysAhead = 90) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return VendorContract.findAll({
        where: {
            status: ContractStatus.ACTIVE,
            endDate: {
                [sequelize_1.Op.between]: [today, futureDate],
            },
        },
        include: [{ model: AssetVendor, as: 'vendor' }],
        order: [['endDate', 'ASC']],
    });
}
// ============================================================================
// SLA MANAGEMENT
// ============================================================================
/**
 * Creates vendor SLA
 *
 * @param data - SLA definition
 * @param transaction - Optional database transaction
 * @returns Created SLA
 *
 * @example
 * ```typescript
 * const sla = await createVendorSLA({
 *   vendorId: 'vendor-123',
 *   slaName: 'Response Time SLA',
 *   metricType: 'response_time',
 *   targetValue: 24,
 *   unit: 'hours',
 *   measurementFrequency: 'monthly',
 *   penaltyForBreach: '5% credit on monthly invoice'
 * });
 * ```
 */
async function createVendorSLA(data, transaction) {
    const vendor = await AssetVendor.findByPk(data.vendorId, { transaction });
    if (!vendor) {
        throw new common_1.NotFoundException(`Vendor ${data.vendorId} not found`);
    }
    return VendorSLA.create({
        ...data,
        isActive: true,
    }, { transaction });
}
/**
 * Records SLA measurement
 *
 * @param slaId - SLA ID
 * @param measuredValue - Measured value
 * @param measuredBy - User ID
 * @param notes - Optional notes
 * @param transaction - Optional database transaction
 * @returns SLA measurement
 *
 * @example
 * ```typescript
 * await recordSLAMeasurement('sla-123', 22, 'user-001',
 *   'Average response time for January'
 * );
 * ```
 */
async function recordSLAMeasurement(slaId, measuredValue, measuredBy, notes, transaction) {
    const sla = await VendorSLA.findByPk(slaId, { transaction });
    if (!sla) {
        throw new common_1.NotFoundException(`SLA ${slaId} not found`);
    }
    const targetValue = Number(sla.targetValue);
    const variance = measuredValue - targetValue;
    let status;
    if (measuredValue <= targetValue) {
        status = SLAStatus.MET;
    }
    else if (measuredValue <= targetValue * 1.1) {
        status = SLAStatus.EXCEEDED;
    }
    else {
        status = SLAStatus.NOT_MET;
    }
    const measurement = await SLAMeasurement.create({
        slaId,
        measurementDate: new Date(),
        measuredValue,
        targetValue,
        variance,
        status,
        measuredBy,
        notes,
    }, { transaction });
    // Update SLA current value
    await sla.update({
        currentValue: measuredValue,
        lastMeasuredDate: new Date(),
    }, { transaction });
    return measurement;
}
/**
 * Gets SLA compliance report
 *
 * @param vendorId - Vendor ID
 * @param startDate - Report start date
 * @param endDate - Report end date
 * @returns SLA compliance summary
 *
 * @example
 * ```typescript
 * const report = await getSLAComplianceReport(
 *   'vendor-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
async function getSLAComplianceReport(vendorId, startDate, endDate) {
    const slas = await VendorSLA.findAll({
        where: { vendorId },
        include: [
            {
                model: SLAMeasurement,
                as: 'measurements',
                where: {
                    measurementDate: {
                        [sequelize_1.Op.between]: [startDate, endDate],
                    },
                },
                required: false,
            },
        ],
    });
    const totalSLAs = slas.length;
    let totalMeasurements = 0;
    let totalMet = 0;
    let totalNotMet = 0;
    const slaDetails = slas.map((sla) => {
        const measurements = sla.measurements || [];
        const metCount = measurements.filter((m) => m.status === SLAStatus.MET || m.status === SLAStatus.EXCEEDED).length;
        const complianceRate = measurements.length > 0 ? (metCount / measurements.length) * 100 : 0;
        totalMeasurements += measurements.length;
        totalMet += metCount;
        totalNotMet += measurements.length - metCount;
        return {
            slaName: sla.slaName,
            metricType: sla.metricType,
            complianceRate,
        };
    });
    const complianceRate = totalMeasurements > 0 ? (totalMet / totalMeasurements) * 100 : 0;
    return {
        vendorId,
        totalSLAs,
        measurements: totalMeasurements,
        metCount: totalMet,
        notMetCount: totalNotMet,
        complianceRate,
        slaDetails,
    };
}
// ============================================================================
// PERFORMANCE EVALUATION
// ============================================================================
/**
 * Evaluates vendor performance
 *
 * @param data - Evaluation data
 * @param transaction - Optional database transaction
 * @returns Performance evaluation
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateVendorPerformance({
 *   vendorId: 'vendor-123',
 *   evaluationPeriodStart: new Date('2024-01-01'),
 *   evaluationPeriodEnd: new Date('2024-06-30'),
 *   evaluatedBy: 'mgr-001',
 *   overallRating: PerformanceRating.GOOD,
 *   qualityScore: 85,
 *   deliveryScore: 90,
 *   communicationScore: 88,
 *   pricingScore: 82,
 *   responseTimeScore: 87
 * });
 * ```
 */
async function evaluateVendorPerformance(data, transaction) {
    const vendor = await AssetVendor.findByPk(data.vendorId, { transaction });
    if (!vendor) {
        throw new common_1.NotFoundException(`Vendor ${data.vendorId} not found`);
    }
    // Calculate overall score
    const overallScore = (data.qualityScore +
        data.deliveryScore +
        data.communicationScore +
        data.pricingScore +
        data.responseTimeScore) /
        5;
    const evaluation = await VendorPerformanceEvaluation.create({
        ...data,
        evaluationDate: new Date(),
        overallScore,
    }, { transaction });
    // Update vendor scores
    await vendor.update({
        performanceScore: overallScore,
        qualityScore: data.qualityScore,
        deliveryScore: data.deliveryScore,
        lastEvaluationDate: new Date(),
    }, { transaction });
    return evaluation;
}
/**
 * Generates vendor scorecard
 *
 * @param vendorId - Vendor ID
 * @param period - Time period
 * @returns Vendor scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateVendorScorecard('vendor-123', '2024-Q2');
 * ```
 */
async function generateVendorScorecard(vendorId, period) {
    const vendor = await AssetVendor.findByPk(vendorId);
    if (!vendor) {
        throw new common_1.NotFoundException(`Vendor ${vendorId} not found`);
    }
    // Get latest evaluation
    const evaluation = await VendorPerformanceEvaluation.findOne({
        where: { vendorId },
        order: [['evaluationDate', 'DESC']],
    });
    // Get SLA compliance
    const slaReport = await getSLAComplianceReport(vendorId, new Date(new Date().setMonth(new Date().getMonth() - 3)), new Date());
    const overallScore = Number(vendor.performanceScore || 0);
    let rating;
    if (overallScore >= 90) {
        rating = PerformanceRating.EXCELLENT;
    }
    else if (overallScore >= 80) {
        rating = PerformanceRating.GOOD;
    }
    else if (overallScore >= 70) {
        rating = PerformanceRating.SATISFACTORY;
    }
    else if (overallScore >= 60) {
        rating = PerformanceRating.NEEDS_IMPROVEMENT;
    }
    else {
        rating = PerformanceRating.POOR;
    }
    return {
        vendorId,
        period,
        overallScore,
        qualityScore: Number(vendor.qualityScore || 0),
        deliveryScore: Number(vendor.deliveryScore || 0),
        communicationScore: evaluation?.communicationScore ? Number(evaluation.communicationScore) : 0,
        pricingScore: evaluation?.pricingScore ? Number(evaluation.pricingScore) : 0,
        responseTimeScore: evaluation?.responseTimeScore ? Number(evaluation.responseTimeScore) : 0,
        slaComplianceRate: slaReport.complianceRate,
        onTimeDeliveryRate: 0, // Would be calculated from actual delivery data
        defectRate: 0, // Would be calculated from actual defect data
        totalTransactions: 0, // Would be calculated from actual transaction data
        totalSpend: Number(vendor.totalSpend),
        rating,
    };
}
// ============================================================================
// PRICING MANAGEMENT
// ============================================================================
/**
 * Creates vendor pricing
 *
 * @param data - Pricing data
 * @param transaction - Optional database transaction
 * @returns Vendor pricing
 *
 * @example
 * ```typescript
 * const pricing = await createVendorPricing({
 *   vendorId: 'vendor-123',
 *   itemCode: 'PART-001',
 *   itemDescription: 'Replacement Part A',
 *   unitPrice: 125.50,
 *   currency: 'USD',
 *   effectiveDate: new Date(),
 *   minimumOrderQuantity: 10
 * });
 * ```
 */
async function createVendorPricing(data, transaction) {
    const vendor = await AssetVendor.findByPk(data.vendorId, { transaction });
    if (!vendor) {
        throw new common_1.NotFoundException(`Vendor ${data.vendorId} not found`);
    }
    // Deactivate previous pricing for same item
    await VendorPricingModel.update({ isActive: false }, {
        where: {
            vendorId: data.vendorId,
            itemCode: data.itemCode,
            isActive: true,
        },
        transaction,
    });
    return VendorPricingModel.create({
        ...data,
        isActive: true,
    }, { transaction });
}
/**
 * Gets current pricing for item
 *
 * @param vendorId - Vendor ID
 * @param itemCode - Item code
 * @returns Current pricing or null
 *
 * @example
 * ```typescript
 * const pricing = await getVendorPricing('vendor-123', 'PART-001');
 * ```
 */
async function getVendorPricing(vendorId, itemCode) {
    return VendorPricingModel.findOne({
        where: {
            vendorId,
            itemCode,
            isActive: true,
            effectiveDate: { [sequelize_1.Op.lte]: new Date() },
            [sequelize_1.Op.or]: [
                { expirationDate: null },
                { expirationDate: { [sequelize_1.Op.gte]: new Date() } },
            ],
        },
        order: [['effectiveDate', 'DESC']],
    });
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    AssetVendor,
    VendorContract,
    VendorSLA,
    SLAMeasurement,
    VendorPerformanceEvaluation,
    VendorPricingModel,
    // Vendor Management
    createVendor,
    updateVendor,
    approveVendor,
    getVendorById,
    searchVendors,
    // Contract Management
    createVendorContract,
    activateVendorContract,
    getExpiringContracts,
    // SLA Management
    createVendorSLA,
    recordSLAMeasurement,
    getSLAComplianceReport,
    // Performance Evaluation
    evaluateVendorPerformance,
    generateVendorScorecard,
    // Pricing Management
    createVendorPricing,
    getVendorPricing,
};
//# sourceMappingURL=asset-vendor-commands.js.map