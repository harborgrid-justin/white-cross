"use strict";
/**
 * ASSET WARRANTY MANAGEMENT COMMAND FUNCTIONS
 *
 * Enterprise-grade asset warranty management system for JD Edwards EnterpriseOne competition.
 * Provides comprehensive warranty tracking including:
 * - Warranty registration and activation
 * - Warranty claim processing and tracking
 * - Warranty expiration tracking and alerts
 * - Extended warranty management
 * - Warranty cost recovery and reimbursement
 * - Vendor warranty coordination
 * - Warranty analytics and reporting
 * - Warranty renewal management
 * - Service level agreement (SLA) tracking
 * - Warranty compliance verification
 * - Multi-tier warranty support
 * - Proactive maintenance under warranty
 *
 * @module AssetWarrantyCommands
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
 *   registerAssetWarranty,
 *   createWarrantyClaim,
 *   processWarrantyClaim,
 *   trackWarrantyExpiration,
 *   WarrantyType,
 *   WarrantyStatus
 * } from './asset-warranty-commands';
 *
 * // Register warranty
 * const warranty = await registerAssetWarranty({
 *   assetId: 'asset-123',
 *   warrantyType: WarrantyType.MANUFACTURER,
 *   vendorId: 'vendor-001',
 *   startDate: new Date(),
 *   durationMonths: 36,
 *   coverageDetails: 'Full parts and labor'
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
exports.WarrantyExpirationAlert = exports.ClaimStatusHistory = exports.WarrantyClaim = exports.AssetWarranty = exports.ClaimPriority = exports.CoverageType = exports.WarrantyClaimStatus = exports.WarrantyStatus = exports.WarrantyType = void 0;
exports.registerAssetWarranty = registerAssetWarranty;
exports.updateWarranty = updateWarranty;
exports.getWarrantyById = getWarrantyById;
exports.getAssetWarranties = getAssetWarranties;
exports.getActiveWarranty = getActiveWarranty;
exports.createWarrantyClaim = createWarrantyClaim;
exports.submitWarrantyClaim = submitWarrantyClaim;
exports.processWarrantyClaim = processWarrantyClaim;
exports.updateClaimServiceDetails = updateClaimServiceDetails;
exports.completeWarrantyClaim = completeWarrantyClaim;
exports.recordWarrantyCostRecovery = recordWarrantyCostRecovery;
exports.calculateWarrantyCostRecovery = calculateWarrantyCostRecovery;
exports.trackWarrantyExpiration = trackWarrantyExpiration;
exports.getExpirationAlerts = getExpirationAlerts;
exports.acknowledgeExpirationAlert = acknowledgeExpirationAlert;
exports.renewWarranty = renewWarranty;
exports.generateWarrantyAnalytics = generateWarrantyAnalytics;
exports.searchWarranties = searchWarranties;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Warranty types
 */
var WarrantyType;
(function (WarrantyType) {
    WarrantyType["MANUFACTURER"] = "manufacturer";
    WarrantyType["EXTENDED"] = "extended";
    WarrantyType["SERVICE_CONTRACT"] = "service_contract";
    WarrantyType["THIRD_PARTY"] = "third_party";
    WarrantyType["MAINTENANCE_AGREEMENT"] = "maintenance_agreement";
    WarrantyType["LABOR_ONLY"] = "labor_only";
    WarrantyType["PARTS_ONLY"] = "parts_only";
    WarrantyType["COMPREHENSIVE"] = "comprehensive";
})(WarrantyType || (exports.WarrantyType = WarrantyType = {}));
/**
 * Warranty status
 */
var WarrantyStatus;
(function (WarrantyStatus) {
    WarrantyStatus["ACTIVE"] = "active";
    WarrantyStatus["EXPIRED"] = "expired";
    WarrantyStatus["EXPIRING_SOON"] = "expiring_soon";
    WarrantyStatus["SUSPENDED"] = "suspended";
    WarrantyStatus["CANCELLED"] = "cancelled";
    WarrantyStatus["TRANSFERRED"] = "transferred";
})(WarrantyStatus || (exports.WarrantyStatus = WarrantyStatus = {}));
/**
 * Warranty claim status
 */
var WarrantyClaimStatus;
(function (WarrantyClaimStatus) {
    WarrantyClaimStatus["DRAFT"] = "draft";
    WarrantyClaimStatus["SUBMITTED"] = "submitted";
    WarrantyClaimStatus["UNDER_REVIEW"] = "under_review";
    WarrantyClaimStatus["APPROVED"] = "approved";
    WarrantyClaimStatus["REJECTED"] = "rejected";
    WarrantyClaimStatus["IN_PROGRESS"] = "in_progress";
    WarrantyClaimStatus["COMPLETED"] = "completed";
    WarrantyClaimStatus["PARTIALLY_APPROVED"] = "partially_approved";
    WarrantyClaimStatus["CANCELLED"] = "cancelled";
})(WarrantyClaimStatus || (exports.WarrantyClaimStatus = WarrantyClaimStatus = {}));
/**
 * Coverage type
 */
var CoverageType;
(function (CoverageType) {
    CoverageType["PARTS"] = "parts";
    CoverageType["LABOR"] = "labor";
    CoverageType["PARTS_AND_LABOR"] = "parts_and_labor";
    CoverageType["PREVENTIVE_MAINTENANCE"] = "preventive_maintenance";
    CoverageType["ON_SITE_SERVICE"] = "on_site_service";
    CoverageType["NEXT_DAY_SERVICE"] = "next_day_service";
    CoverageType["REPLACEMENT"] = "replacement";
    CoverageType["LOANER_EQUIPMENT"] = "loaner_equipment";
})(CoverageType || (exports.CoverageType = CoverageType = {}));
/**
 * Claim priority
 */
var ClaimPriority;
(function (ClaimPriority) {
    ClaimPriority["CRITICAL"] = "critical";
    ClaimPriority["HIGH"] = "high";
    ClaimPriority["NORMAL"] = "normal";
    ClaimPriority["LOW"] = "low";
})(ClaimPriority || (exports.ClaimPriority = ClaimPriority = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Asset Warranty Model
 */
let AssetWarranty = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'asset_warranties',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['asset_id'] },
                { fields: ['warranty_number'], unique: true },
                { fields: ['warranty_type'] },
                { fields: ['status'] },
                { fields: ['vendor_id'] },
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
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _warrantyNumber_decorators;
    let _warrantyNumber_initializers = [];
    let _warrantyNumber_extraInitializers = [];
    let _warrantyType_decorators;
    let _warrantyType_initializers = [];
    let _warrantyType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _durationMonths_decorators;
    let _durationMonths_initializers = [];
    let _durationMonths_extraInitializers = [];
    let _coverageDetails_decorators;
    let _coverageDetails_initializers = [];
    let _coverageDetails_extraInitializers = [];
    let _coverageTypes_decorators;
    let _coverageTypes_initializers = [];
    let _coverageTypes_extraInitializers = [];
    let _terms_decorators;
    let _terms_initializers = [];
    let _terms_extraInitializers = [];
    let _exclusions_decorators;
    let _exclusions_initializers = [];
    let _exclusions_extraInitializers = [];
    let _cost_decorators;
    let _cost_initializers = [];
    let _cost_extraInitializers = [];
    let _proofOfPurchase_decorators;
    let _proofOfPurchase_initializers = [];
    let _proofOfPurchase_extraInitializers = [];
    let _registeredBy_decorators;
    let _registeredBy_initializers = [];
    let _registeredBy_extraInitializers = [];
    let _registrationDate_decorators;
    let _registrationDate_initializers = [];
    let _registrationDate_extraInitializers = [];
    let _autoRenew_decorators;
    let _autoRenew_initializers = [];
    let _autoRenew_extraInitializers = [];
    let _renewalDate_decorators;
    let _renewalDate_initializers = [];
    let _renewalDate_extraInitializers = [];
    let _contactPerson_decorators;
    let _contactPerson_initializers = [];
    let _contactPerson_extraInitializers = [];
    let _contactPhone_decorators;
    let _contactPhone_initializers = [];
    let _contactPhone_extraInitializers = [];
    let _contactEmail_decorators;
    let _contactEmail_initializers = [];
    let _contactEmail_extraInitializers = [];
    let _serviceLevelAgreement_decorators;
    let _serviceLevelAgreement_initializers = [];
    let _serviceLevelAgreement_extraInitializers = [];
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
    let _claims_decorators;
    let _claims_initializers = [];
    let _claims_extraInitializers = [];
    var AssetWarranty = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.warrantyNumber = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _warrantyNumber_initializers, void 0));
            this.warrantyType = (__runInitializers(this, _warrantyNumber_extraInitializers), __runInitializers(this, _warrantyType_initializers, void 0));
            this.status = (__runInitializers(this, _warrantyType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.vendorId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.startDate = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.durationMonths = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _durationMonths_initializers, void 0));
            this.coverageDetails = (__runInitializers(this, _durationMonths_extraInitializers), __runInitializers(this, _coverageDetails_initializers, void 0));
            this.coverageTypes = (__runInitializers(this, _coverageDetails_extraInitializers), __runInitializers(this, _coverageTypes_initializers, void 0));
            this.terms = (__runInitializers(this, _coverageTypes_extraInitializers), __runInitializers(this, _terms_initializers, void 0));
            this.exclusions = (__runInitializers(this, _terms_extraInitializers), __runInitializers(this, _exclusions_initializers, void 0));
            this.cost = (__runInitializers(this, _exclusions_extraInitializers), __runInitializers(this, _cost_initializers, void 0));
            this.proofOfPurchase = (__runInitializers(this, _cost_extraInitializers), __runInitializers(this, _proofOfPurchase_initializers, void 0));
            this.registeredBy = (__runInitializers(this, _proofOfPurchase_extraInitializers), __runInitializers(this, _registeredBy_initializers, void 0));
            this.registrationDate = (__runInitializers(this, _registeredBy_extraInitializers), __runInitializers(this, _registrationDate_initializers, void 0));
            this.autoRenew = (__runInitializers(this, _registrationDate_extraInitializers), __runInitializers(this, _autoRenew_initializers, void 0));
            this.renewalDate = (__runInitializers(this, _autoRenew_extraInitializers), __runInitializers(this, _renewalDate_initializers, void 0));
            this.contactPerson = (__runInitializers(this, _renewalDate_extraInitializers), __runInitializers(this, _contactPerson_initializers, void 0));
            this.contactPhone = (__runInitializers(this, _contactPerson_extraInitializers), __runInitializers(this, _contactPhone_initializers, void 0));
            this.contactEmail = (__runInitializers(this, _contactPhone_extraInitializers), __runInitializers(this, _contactEmail_initializers, void 0));
            this.serviceLevelAgreement = (__runInitializers(this, _contactEmail_extraInitializers), __runInitializers(this, _serviceLevelAgreement_initializers, void 0));
            this.notes = (__runInitializers(this, _serviceLevelAgreement_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.claims = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _claims_initializers, void 0));
            __runInitializers(this, _claims_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AssetWarranty");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _warrantyNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Warranty number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), unique: true }), sequelize_typescript_1.Index];
        _warrantyType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Warranty type' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(WarrantyType)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Warranty status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(WarrantyStatus)),
                defaultValue: WarrantyStatus.ACTIVE,
            }), sequelize_typescript_1.Index];
        _vendorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _durationMonths_decorators = [(0, swagger_1.ApiProperty)({ description: 'Duration in months' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _coverageDetails_decorators = [(0, swagger_1.ApiProperty)({ description: 'Coverage details' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _coverageTypes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Coverage types' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _terms_decorators = [(0, swagger_1.ApiProperty)({ description: 'Terms and conditions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _exclusions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Exclusions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT) })];
        _cost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Warranty cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _proofOfPurchase_decorators = [(0, swagger_1.ApiProperty)({ description: 'Proof of purchase documents' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _registeredBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Registered by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _registrationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Registration date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _autoRenew_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-renew enabled' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _renewalDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Renewal date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _contactPerson_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contact person' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _contactPhone_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contact phone' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _contactEmail_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contact email' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _serviceLevelAgreement_decorators = [(0, swagger_1.ApiProperty)({ description: 'Service level agreement' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _claims_decorators = [(0, sequelize_typescript_1.HasMany)(() => WarrantyClaim)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _warrantyNumber_decorators, { kind: "field", name: "warrantyNumber", static: false, private: false, access: { has: obj => "warrantyNumber" in obj, get: obj => obj.warrantyNumber, set: (obj, value) => { obj.warrantyNumber = value; } }, metadata: _metadata }, _warrantyNumber_initializers, _warrantyNumber_extraInitializers);
        __esDecorate(null, null, _warrantyType_decorators, { kind: "field", name: "warrantyType", static: false, private: false, access: { has: obj => "warrantyType" in obj, get: obj => obj.warrantyType, set: (obj, value) => { obj.warrantyType = value; } }, metadata: _metadata }, _warrantyType_initializers, _warrantyType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _durationMonths_decorators, { kind: "field", name: "durationMonths", static: false, private: false, access: { has: obj => "durationMonths" in obj, get: obj => obj.durationMonths, set: (obj, value) => { obj.durationMonths = value; } }, metadata: _metadata }, _durationMonths_initializers, _durationMonths_extraInitializers);
        __esDecorate(null, null, _coverageDetails_decorators, { kind: "field", name: "coverageDetails", static: false, private: false, access: { has: obj => "coverageDetails" in obj, get: obj => obj.coverageDetails, set: (obj, value) => { obj.coverageDetails = value; } }, metadata: _metadata }, _coverageDetails_initializers, _coverageDetails_extraInitializers);
        __esDecorate(null, null, _coverageTypes_decorators, { kind: "field", name: "coverageTypes", static: false, private: false, access: { has: obj => "coverageTypes" in obj, get: obj => obj.coverageTypes, set: (obj, value) => { obj.coverageTypes = value; } }, metadata: _metadata }, _coverageTypes_initializers, _coverageTypes_extraInitializers);
        __esDecorate(null, null, _terms_decorators, { kind: "field", name: "terms", static: false, private: false, access: { has: obj => "terms" in obj, get: obj => obj.terms, set: (obj, value) => { obj.terms = value; } }, metadata: _metadata }, _terms_initializers, _terms_extraInitializers);
        __esDecorate(null, null, _exclusions_decorators, { kind: "field", name: "exclusions", static: false, private: false, access: { has: obj => "exclusions" in obj, get: obj => obj.exclusions, set: (obj, value) => { obj.exclusions = value; } }, metadata: _metadata }, _exclusions_initializers, _exclusions_extraInitializers);
        __esDecorate(null, null, _cost_decorators, { kind: "field", name: "cost", static: false, private: false, access: { has: obj => "cost" in obj, get: obj => obj.cost, set: (obj, value) => { obj.cost = value; } }, metadata: _metadata }, _cost_initializers, _cost_extraInitializers);
        __esDecorate(null, null, _proofOfPurchase_decorators, { kind: "field", name: "proofOfPurchase", static: false, private: false, access: { has: obj => "proofOfPurchase" in obj, get: obj => obj.proofOfPurchase, set: (obj, value) => { obj.proofOfPurchase = value; } }, metadata: _metadata }, _proofOfPurchase_initializers, _proofOfPurchase_extraInitializers);
        __esDecorate(null, null, _registeredBy_decorators, { kind: "field", name: "registeredBy", static: false, private: false, access: { has: obj => "registeredBy" in obj, get: obj => obj.registeredBy, set: (obj, value) => { obj.registeredBy = value; } }, metadata: _metadata }, _registeredBy_initializers, _registeredBy_extraInitializers);
        __esDecorate(null, null, _registrationDate_decorators, { kind: "field", name: "registrationDate", static: false, private: false, access: { has: obj => "registrationDate" in obj, get: obj => obj.registrationDate, set: (obj, value) => { obj.registrationDate = value; } }, metadata: _metadata }, _registrationDate_initializers, _registrationDate_extraInitializers);
        __esDecorate(null, null, _autoRenew_decorators, { kind: "field", name: "autoRenew", static: false, private: false, access: { has: obj => "autoRenew" in obj, get: obj => obj.autoRenew, set: (obj, value) => { obj.autoRenew = value; } }, metadata: _metadata }, _autoRenew_initializers, _autoRenew_extraInitializers);
        __esDecorate(null, null, _renewalDate_decorators, { kind: "field", name: "renewalDate", static: false, private: false, access: { has: obj => "renewalDate" in obj, get: obj => obj.renewalDate, set: (obj, value) => { obj.renewalDate = value; } }, metadata: _metadata }, _renewalDate_initializers, _renewalDate_extraInitializers);
        __esDecorate(null, null, _contactPerson_decorators, { kind: "field", name: "contactPerson", static: false, private: false, access: { has: obj => "contactPerson" in obj, get: obj => obj.contactPerson, set: (obj, value) => { obj.contactPerson = value; } }, metadata: _metadata }, _contactPerson_initializers, _contactPerson_extraInitializers);
        __esDecorate(null, null, _contactPhone_decorators, { kind: "field", name: "contactPhone", static: false, private: false, access: { has: obj => "contactPhone" in obj, get: obj => obj.contactPhone, set: (obj, value) => { obj.contactPhone = value; } }, metadata: _metadata }, _contactPhone_initializers, _contactPhone_extraInitializers);
        __esDecorate(null, null, _contactEmail_decorators, { kind: "field", name: "contactEmail", static: false, private: false, access: { has: obj => "contactEmail" in obj, get: obj => obj.contactEmail, set: (obj, value) => { obj.contactEmail = value; } }, metadata: _metadata }, _contactEmail_initializers, _contactEmail_extraInitializers);
        __esDecorate(null, null, _serviceLevelAgreement_decorators, { kind: "field", name: "serviceLevelAgreement", static: false, private: false, access: { has: obj => "serviceLevelAgreement" in obj, get: obj => obj.serviceLevelAgreement, set: (obj, value) => { obj.serviceLevelAgreement = value; } }, metadata: _metadata }, _serviceLevelAgreement_initializers, _serviceLevelAgreement_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _claims_decorators, { kind: "field", name: "claims", static: false, private: false, access: { has: obj => "claims" in obj, get: obj => obj.claims, set: (obj, value) => { obj.claims = value; } }, metadata: _metadata }, _claims_initializers, _claims_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AssetWarranty = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AssetWarranty = _classThis;
})();
exports.AssetWarranty = AssetWarranty;
/**
 * Warranty Claim Model
 */
let WarrantyClaim = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'warranty_claims',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['claim_number'], unique: true },
                { fields: ['warranty_id'] },
                { fields: ['asset_id'] },
                { fields: ['status'] },
                { fields: ['priority'] },
                { fields: ['failure_date'] },
                { fields: ['submitted_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _claimNumber_decorators;
    let _claimNumber_initializers = [];
    let _claimNumber_extraInitializers = [];
    let _warrantyId_decorators;
    let _warrantyId_initializers = [];
    let _warrantyId_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _claimType_decorators;
    let _claimType_initializers = [];
    let _claimType_extraInitializers = [];
    let _issueDescription_decorators;
    let _issueDescription_initializers = [];
    let _issueDescription_extraInitializers = [];
    let _failureDate_decorators;
    let _failureDate_initializers = [];
    let _failureDate_extraInitializers = [];
    let _reportedBy_decorators;
    let _reportedBy_initializers = [];
    let _reportedBy_extraInitializers = [];
    let _reportDate_decorators;
    let _reportDate_initializers = [];
    let _reportDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _estimatedCost_decorators;
    let _estimatedCost_initializers = [];
    let _estimatedCost_extraInitializers = [];
    let _actualCost_decorators;
    let _actualCost_initializers = [];
    let _actualCost_extraInitializers = [];
    let _claimedAmount_decorators;
    let _claimedAmount_initializers = [];
    let _claimedAmount_extraInitializers = [];
    let _approvedAmount_decorators;
    let _approvedAmount_initializers = [];
    let _approvedAmount_extraInitializers = [];
    let _reimbursedAmount_decorators;
    let _reimbursedAmount_initializers = [];
    let _reimbursedAmount_extraInitializers = [];
    let _diagnosticInfo_decorators;
    let _diagnosticInfo_initializers = [];
    let _diagnosticInfo_extraInitializers = [];
    let _photos_decorators;
    let _photos_initializers = [];
    let _photos_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _submittedDate_decorators;
    let _submittedDate_initializers = [];
    let _submittedDate_extraInitializers = [];
    let _reviewedBy_decorators;
    let _reviewedBy_initializers = [];
    let _reviewedBy_extraInitializers = [];
    let _reviewDate_decorators;
    let _reviewDate_initializers = [];
    let _reviewDate_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvalDate_decorators;
    let _approvalDate_initializers = [];
    let _approvalDate_extraInitializers = [];
    let _vendorResponse_decorators;
    let _vendorResponse_initializers = [];
    let _vendorResponse_extraInitializers = [];
    let _vendorReferenceNumber_decorators;
    let _vendorReferenceNumber_initializers = [];
    let _vendorReferenceNumber_extraInitializers = [];
    let _serviceTechnician_decorators;
    let _serviceTechnician_initializers = [];
    let _serviceTechnician_extraInitializers = [];
    let _serviceStartDate_decorators;
    let _serviceStartDate_initializers = [];
    let _serviceStartDate_extraInitializers = [];
    let _serviceCompletionDate_decorators;
    let _serviceCompletionDate_initializers = [];
    let _serviceCompletionDate_extraInitializers = [];
    let _resolutionDescription_decorators;
    let _resolutionDescription_initializers = [];
    let _resolutionDescription_extraInitializers = [];
    let _partsReplaced_decorators;
    let _partsReplaced_initializers = [];
    let _partsReplaced_extraInitializers = [];
    let _laborHours_decorators;
    let _laborHours_initializers = [];
    let _laborHours_extraInitializers = [];
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
    let _warranty_decorators;
    let _warranty_initializers = [];
    let _warranty_extraInitializers = [];
    let _statusHistory_decorators;
    let _statusHistory_initializers = [];
    let _statusHistory_extraInitializers = [];
    var WarrantyClaim = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.claimNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _claimNumber_initializers, void 0));
            this.warrantyId = (__runInitializers(this, _claimNumber_extraInitializers), __runInitializers(this, _warrantyId_initializers, void 0));
            this.assetId = (__runInitializers(this, _warrantyId_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.claimType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _claimType_initializers, void 0));
            this.issueDescription = (__runInitializers(this, _claimType_extraInitializers), __runInitializers(this, _issueDescription_initializers, void 0));
            this.failureDate = (__runInitializers(this, _issueDescription_extraInitializers), __runInitializers(this, _failureDate_initializers, void 0));
            this.reportedBy = (__runInitializers(this, _failureDate_extraInitializers), __runInitializers(this, _reportedBy_initializers, void 0));
            this.reportDate = (__runInitializers(this, _reportedBy_extraInitializers), __runInitializers(this, _reportDate_initializers, void 0));
            this.status = (__runInitializers(this, _reportDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.estimatedCost = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _estimatedCost_initializers, void 0));
            this.actualCost = (__runInitializers(this, _estimatedCost_extraInitializers), __runInitializers(this, _actualCost_initializers, void 0));
            this.claimedAmount = (__runInitializers(this, _actualCost_extraInitializers), __runInitializers(this, _claimedAmount_initializers, void 0));
            this.approvedAmount = (__runInitializers(this, _claimedAmount_extraInitializers), __runInitializers(this, _approvedAmount_initializers, void 0));
            this.reimbursedAmount = (__runInitializers(this, _approvedAmount_extraInitializers), __runInitializers(this, _reimbursedAmount_initializers, void 0));
            this.diagnosticInfo = (__runInitializers(this, _reimbursedAmount_extraInitializers), __runInitializers(this, _diagnosticInfo_initializers, void 0));
            this.photos = (__runInitializers(this, _diagnosticInfo_extraInitializers), __runInitializers(this, _photos_initializers, void 0));
            this.attachments = (__runInitializers(this, _photos_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.submittedDate = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _submittedDate_initializers, void 0));
            this.reviewedBy = (__runInitializers(this, _submittedDate_extraInitializers), __runInitializers(this, _reviewedBy_initializers, void 0));
            this.reviewDate = (__runInitializers(this, _reviewedBy_extraInitializers), __runInitializers(this, _reviewDate_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _reviewDate_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvalDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
            this.vendorResponse = (__runInitializers(this, _approvalDate_extraInitializers), __runInitializers(this, _vendorResponse_initializers, void 0));
            this.vendorReferenceNumber = (__runInitializers(this, _vendorResponse_extraInitializers), __runInitializers(this, _vendorReferenceNumber_initializers, void 0));
            this.serviceTechnician = (__runInitializers(this, _vendorReferenceNumber_extraInitializers), __runInitializers(this, _serviceTechnician_initializers, void 0));
            this.serviceStartDate = (__runInitializers(this, _serviceTechnician_extraInitializers), __runInitializers(this, _serviceStartDate_initializers, void 0));
            this.serviceCompletionDate = (__runInitializers(this, _serviceStartDate_extraInitializers), __runInitializers(this, _serviceCompletionDate_initializers, void 0));
            this.resolutionDescription = (__runInitializers(this, _serviceCompletionDate_extraInitializers), __runInitializers(this, _resolutionDescription_initializers, void 0));
            this.partsReplaced = (__runInitializers(this, _resolutionDescription_extraInitializers), __runInitializers(this, _partsReplaced_initializers, void 0));
            this.laborHours = (__runInitializers(this, _partsReplaced_extraInitializers), __runInitializers(this, _laborHours_initializers, void 0));
            this.notes = (__runInitializers(this, _laborHours_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.warranty = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _warranty_initializers, void 0));
            this.statusHistory = (__runInitializers(this, _warranty_extraInitializers), __runInitializers(this, _statusHistory_initializers, void 0));
            __runInitializers(this, _statusHistory_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WarrantyClaim");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _claimNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Claim number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _warrantyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Warranty ID' }), (0, sequelize_typescript_1.ForeignKey)(() => AssetWarranty), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _claimType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Claim type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _issueDescription_decorators = [(0, swagger_1.ApiProperty)({ description: 'Issue description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _failureDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Failure date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _reportedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reported by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _reportDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Claim status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(WarrantyClaimStatus)),
                defaultValue: WarrantyClaimStatus.DRAFT,
            }), sequelize_typescript_1.Index];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ClaimPriority)),
                defaultValue: ClaimPriority.NORMAL,
            }), sequelize_typescript_1.Index];
        _estimatedCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated repair cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _actualCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual repair cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _claimedAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Claimed amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _approvedAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _reimbursedAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reimbursed amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _diagnosticInfo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Diagnostic information' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _photos_decorators = [(0, swagger_1.ApiProperty)({ description: 'Photo URLs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _attachments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attachment URLs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _submittedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Submitted date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _reviewedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reviewed by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _reviewDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Review date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _approvalDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _vendorResponse_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor response' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _vendorReferenceNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor reference number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _serviceTechnician_decorators = [(0, swagger_1.ApiProperty)({ description: 'Service technician' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _serviceStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Service start date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _serviceCompletionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Service completion date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _resolutionDescription_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resolution description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _partsReplaced_decorators = [(0, swagger_1.ApiProperty)({ description: 'Parts replaced' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT) })];
        _laborHours_decorators = [(0, swagger_1.ApiProperty)({ description: 'Labor hours' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2) })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _warranty_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => AssetWarranty)];
        _statusHistory_decorators = [(0, sequelize_typescript_1.HasMany)(() => ClaimStatusHistory)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _claimNumber_decorators, { kind: "field", name: "claimNumber", static: false, private: false, access: { has: obj => "claimNumber" in obj, get: obj => obj.claimNumber, set: (obj, value) => { obj.claimNumber = value; } }, metadata: _metadata }, _claimNumber_initializers, _claimNumber_extraInitializers);
        __esDecorate(null, null, _warrantyId_decorators, { kind: "field", name: "warrantyId", static: false, private: false, access: { has: obj => "warrantyId" in obj, get: obj => obj.warrantyId, set: (obj, value) => { obj.warrantyId = value; } }, metadata: _metadata }, _warrantyId_initializers, _warrantyId_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _claimType_decorators, { kind: "field", name: "claimType", static: false, private: false, access: { has: obj => "claimType" in obj, get: obj => obj.claimType, set: (obj, value) => { obj.claimType = value; } }, metadata: _metadata }, _claimType_initializers, _claimType_extraInitializers);
        __esDecorate(null, null, _issueDescription_decorators, { kind: "field", name: "issueDescription", static: false, private: false, access: { has: obj => "issueDescription" in obj, get: obj => obj.issueDescription, set: (obj, value) => { obj.issueDescription = value; } }, metadata: _metadata }, _issueDescription_initializers, _issueDescription_extraInitializers);
        __esDecorate(null, null, _failureDate_decorators, { kind: "field", name: "failureDate", static: false, private: false, access: { has: obj => "failureDate" in obj, get: obj => obj.failureDate, set: (obj, value) => { obj.failureDate = value; } }, metadata: _metadata }, _failureDate_initializers, _failureDate_extraInitializers);
        __esDecorate(null, null, _reportedBy_decorators, { kind: "field", name: "reportedBy", static: false, private: false, access: { has: obj => "reportedBy" in obj, get: obj => obj.reportedBy, set: (obj, value) => { obj.reportedBy = value; } }, metadata: _metadata }, _reportedBy_initializers, _reportedBy_extraInitializers);
        __esDecorate(null, null, _reportDate_decorators, { kind: "field", name: "reportDate", static: false, private: false, access: { has: obj => "reportDate" in obj, get: obj => obj.reportDate, set: (obj, value) => { obj.reportDate = value; } }, metadata: _metadata }, _reportDate_initializers, _reportDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _estimatedCost_decorators, { kind: "field", name: "estimatedCost", static: false, private: false, access: { has: obj => "estimatedCost" in obj, get: obj => obj.estimatedCost, set: (obj, value) => { obj.estimatedCost = value; } }, metadata: _metadata }, _estimatedCost_initializers, _estimatedCost_extraInitializers);
        __esDecorate(null, null, _actualCost_decorators, { kind: "field", name: "actualCost", static: false, private: false, access: { has: obj => "actualCost" in obj, get: obj => obj.actualCost, set: (obj, value) => { obj.actualCost = value; } }, metadata: _metadata }, _actualCost_initializers, _actualCost_extraInitializers);
        __esDecorate(null, null, _claimedAmount_decorators, { kind: "field", name: "claimedAmount", static: false, private: false, access: { has: obj => "claimedAmount" in obj, get: obj => obj.claimedAmount, set: (obj, value) => { obj.claimedAmount = value; } }, metadata: _metadata }, _claimedAmount_initializers, _claimedAmount_extraInitializers);
        __esDecorate(null, null, _approvedAmount_decorators, { kind: "field", name: "approvedAmount", static: false, private: false, access: { has: obj => "approvedAmount" in obj, get: obj => obj.approvedAmount, set: (obj, value) => { obj.approvedAmount = value; } }, metadata: _metadata }, _approvedAmount_initializers, _approvedAmount_extraInitializers);
        __esDecorate(null, null, _reimbursedAmount_decorators, { kind: "field", name: "reimbursedAmount", static: false, private: false, access: { has: obj => "reimbursedAmount" in obj, get: obj => obj.reimbursedAmount, set: (obj, value) => { obj.reimbursedAmount = value; } }, metadata: _metadata }, _reimbursedAmount_initializers, _reimbursedAmount_extraInitializers);
        __esDecorate(null, null, _diagnosticInfo_decorators, { kind: "field", name: "diagnosticInfo", static: false, private: false, access: { has: obj => "diagnosticInfo" in obj, get: obj => obj.diagnosticInfo, set: (obj, value) => { obj.diagnosticInfo = value; } }, metadata: _metadata }, _diagnosticInfo_initializers, _diagnosticInfo_extraInitializers);
        __esDecorate(null, null, _photos_decorators, { kind: "field", name: "photos", static: false, private: false, access: { has: obj => "photos" in obj, get: obj => obj.photos, set: (obj, value) => { obj.photos = value; } }, metadata: _metadata }, _photos_initializers, _photos_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _submittedDate_decorators, { kind: "field", name: "submittedDate", static: false, private: false, access: { has: obj => "submittedDate" in obj, get: obj => obj.submittedDate, set: (obj, value) => { obj.submittedDate = value; } }, metadata: _metadata }, _submittedDate_initializers, _submittedDate_extraInitializers);
        __esDecorate(null, null, _reviewedBy_decorators, { kind: "field", name: "reviewedBy", static: false, private: false, access: { has: obj => "reviewedBy" in obj, get: obj => obj.reviewedBy, set: (obj, value) => { obj.reviewedBy = value; } }, metadata: _metadata }, _reviewedBy_initializers, _reviewedBy_extraInitializers);
        __esDecorate(null, null, _reviewDate_decorators, { kind: "field", name: "reviewDate", static: false, private: false, access: { has: obj => "reviewDate" in obj, get: obj => obj.reviewDate, set: (obj, value) => { obj.reviewDate = value; } }, metadata: _metadata }, _reviewDate_initializers, _reviewDate_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: obj => "approvalDate" in obj, get: obj => obj.approvalDate, set: (obj, value) => { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
        __esDecorate(null, null, _vendorResponse_decorators, { kind: "field", name: "vendorResponse", static: false, private: false, access: { has: obj => "vendorResponse" in obj, get: obj => obj.vendorResponse, set: (obj, value) => { obj.vendorResponse = value; } }, metadata: _metadata }, _vendorResponse_initializers, _vendorResponse_extraInitializers);
        __esDecorate(null, null, _vendorReferenceNumber_decorators, { kind: "field", name: "vendorReferenceNumber", static: false, private: false, access: { has: obj => "vendorReferenceNumber" in obj, get: obj => obj.vendorReferenceNumber, set: (obj, value) => { obj.vendorReferenceNumber = value; } }, metadata: _metadata }, _vendorReferenceNumber_initializers, _vendorReferenceNumber_extraInitializers);
        __esDecorate(null, null, _serviceTechnician_decorators, { kind: "field", name: "serviceTechnician", static: false, private: false, access: { has: obj => "serviceTechnician" in obj, get: obj => obj.serviceTechnician, set: (obj, value) => { obj.serviceTechnician = value; } }, metadata: _metadata }, _serviceTechnician_initializers, _serviceTechnician_extraInitializers);
        __esDecorate(null, null, _serviceStartDate_decorators, { kind: "field", name: "serviceStartDate", static: false, private: false, access: { has: obj => "serviceStartDate" in obj, get: obj => obj.serviceStartDate, set: (obj, value) => { obj.serviceStartDate = value; } }, metadata: _metadata }, _serviceStartDate_initializers, _serviceStartDate_extraInitializers);
        __esDecorate(null, null, _serviceCompletionDate_decorators, { kind: "field", name: "serviceCompletionDate", static: false, private: false, access: { has: obj => "serviceCompletionDate" in obj, get: obj => obj.serviceCompletionDate, set: (obj, value) => { obj.serviceCompletionDate = value; } }, metadata: _metadata }, _serviceCompletionDate_initializers, _serviceCompletionDate_extraInitializers);
        __esDecorate(null, null, _resolutionDescription_decorators, { kind: "field", name: "resolutionDescription", static: false, private: false, access: { has: obj => "resolutionDescription" in obj, get: obj => obj.resolutionDescription, set: (obj, value) => { obj.resolutionDescription = value; } }, metadata: _metadata }, _resolutionDescription_initializers, _resolutionDescription_extraInitializers);
        __esDecorate(null, null, _partsReplaced_decorators, { kind: "field", name: "partsReplaced", static: false, private: false, access: { has: obj => "partsReplaced" in obj, get: obj => obj.partsReplaced, set: (obj, value) => { obj.partsReplaced = value; } }, metadata: _metadata }, _partsReplaced_initializers, _partsReplaced_extraInitializers);
        __esDecorate(null, null, _laborHours_decorators, { kind: "field", name: "laborHours", static: false, private: false, access: { has: obj => "laborHours" in obj, get: obj => obj.laborHours, set: (obj, value) => { obj.laborHours = value; } }, metadata: _metadata }, _laborHours_initializers, _laborHours_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _warranty_decorators, { kind: "field", name: "warranty", static: false, private: false, access: { has: obj => "warranty" in obj, get: obj => obj.warranty, set: (obj, value) => { obj.warranty = value; } }, metadata: _metadata }, _warranty_initializers, _warranty_extraInitializers);
        __esDecorate(null, null, _statusHistory_decorators, { kind: "field", name: "statusHistory", static: false, private: false, access: { has: obj => "statusHistory" in obj, get: obj => obj.statusHistory, set: (obj, value) => { obj.statusHistory = value; } }, metadata: _metadata }, _statusHistory_initializers, _statusHistory_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WarrantyClaim = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WarrantyClaim = _classThis;
})();
exports.WarrantyClaim = WarrantyClaim;
/**
 * Claim Status History Model
 */
let ClaimStatusHistory = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'claim_status_history',
            timestamps: true,
            indexes: [
                { fields: ['claim_id'] },
                { fields: ['status'] },
                { fields: ['changed_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _claimId_decorators;
    let _claimId_initializers = [];
    let _claimId_extraInitializers = [];
    let _previousStatus_decorators;
    let _previousStatus_initializers = [];
    let _previousStatus_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _changedBy_decorators;
    let _changedBy_initializers = [];
    let _changedBy_extraInitializers = [];
    let _changedAt_decorators;
    let _changedAt_initializers = [];
    let _changedAt_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _claim_decorators;
    let _claim_initializers = [];
    let _claim_extraInitializers = [];
    var ClaimStatusHistory = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.claimId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _claimId_initializers, void 0));
            this.previousStatus = (__runInitializers(this, _claimId_extraInitializers), __runInitializers(this, _previousStatus_initializers, void 0));
            this.status = (__runInitializers(this, _previousStatus_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.changedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _changedBy_initializers, void 0));
            this.changedAt = (__runInitializers(this, _changedBy_extraInitializers), __runInitializers(this, _changedAt_initializers, void 0));
            this.notes = (__runInitializers(this, _changedAt_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.claim = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _claim_initializers, void 0));
            __runInitializers(this, _claim_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ClaimStatusHistory");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _claimId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Claim ID' }), (0, sequelize_typescript_1.ForeignKey)(() => WarrantyClaim), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _previousStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Previous status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(WarrantyClaimStatus)) })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'New status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(WarrantyClaimStatus)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _changedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Changed by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _changedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Changed at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _claim_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => WarrantyClaim)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _claimId_decorators, { kind: "field", name: "claimId", static: false, private: false, access: { has: obj => "claimId" in obj, get: obj => obj.claimId, set: (obj, value) => { obj.claimId = value; } }, metadata: _metadata }, _claimId_initializers, _claimId_extraInitializers);
        __esDecorate(null, null, _previousStatus_decorators, { kind: "field", name: "previousStatus", static: false, private: false, access: { has: obj => "previousStatus" in obj, get: obj => obj.previousStatus, set: (obj, value) => { obj.previousStatus = value; } }, metadata: _metadata }, _previousStatus_initializers, _previousStatus_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _changedBy_decorators, { kind: "field", name: "changedBy", static: false, private: false, access: { has: obj => "changedBy" in obj, get: obj => obj.changedBy, set: (obj, value) => { obj.changedBy = value; } }, metadata: _metadata }, _changedBy_initializers, _changedBy_extraInitializers);
        __esDecorate(null, null, _changedAt_decorators, { kind: "field", name: "changedAt", static: false, private: false, access: { has: obj => "changedAt" in obj, get: obj => obj.changedAt, set: (obj, value) => { obj.changedAt = value; } }, metadata: _metadata }, _changedAt_initializers, _changedAt_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _claim_decorators, { kind: "field", name: "claim", static: false, private: false, access: { has: obj => "claim" in obj, get: obj => obj.claim, set: (obj, value) => { obj.claim = value; } }, metadata: _metadata }, _claim_initializers, _claim_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ClaimStatusHistory = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ClaimStatusHistory = _classThis;
})();
exports.ClaimStatusHistory = ClaimStatusHistory;
/**
 * Warranty Expiration Alert Model
 */
let WarrantyExpirationAlert = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'warranty_expiration_alerts',
            timestamps: true,
            indexes: [
                { fields: ['warranty_id'] },
                { fields: ['alert_date'] },
                { fields: ['acknowledged'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _warrantyId_decorators;
    let _warrantyId_initializers = [];
    let _warrantyId_extraInitializers = [];
    let _alertDate_decorators;
    let _alertDate_initializers = [];
    let _alertDate_extraInitializers = [];
    let _daysUntilExpiration_decorators;
    let _daysUntilExpiration_initializers = [];
    let _daysUntilExpiration_extraInitializers = [];
    let _alertMessage_decorators;
    let _alertMessage_initializers = [];
    let _alertMessage_extraInitializers = [];
    let _acknowledged_decorators;
    let _acknowledged_initializers = [];
    let _acknowledged_extraInitializers = [];
    let _acknowledgedBy_decorators;
    let _acknowledgedBy_initializers = [];
    let _acknowledgedBy_extraInitializers = [];
    let _acknowledgedDate_decorators;
    let _acknowledgedDate_initializers = [];
    let _acknowledgedDate_extraInitializers = [];
    let _actionTaken_decorators;
    let _actionTaken_initializers = [];
    let _actionTaken_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _warranty_decorators;
    let _warranty_initializers = [];
    let _warranty_extraInitializers = [];
    var WarrantyExpirationAlert = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.warrantyId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _warrantyId_initializers, void 0));
            this.alertDate = (__runInitializers(this, _warrantyId_extraInitializers), __runInitializers(this, _alertDate_initializers, void 0));
            this.daysUntilExpiration = (__runInitializers(this, _alertDate_extraInitializers), __runInitializers(this, _daysUntilExpiration_initializers, void 0));
            this.alertMessage = (__runInitializers(this, _daysUntilExpiration_extraInitializers), __runInitializers(this, _alertMessage_initializers, void 0));
            this.acknowledged = (__runInitializers(this, _alertMessage_extraInitializers), __runInitializers(this, _acknowledged_initializers, void 0));
            this.acknowledgedBy = (__runInitializers(this, _acknowledged_extraInitializers), __runInitializers(this, _acknowledgedBy_initializers, void 0));
            this.acknowledgedDate = (__runInitializers(this, _acknowledgedBy_extraInitializers), __runInitializers(this, _acknowledgedDate_initializers, void 0));
            this.actionTaken = (__runInitializers(this, _acknowledgedDate_extraInitializers), __runInitializers(this, _actionTaken_initializers, void 0));
            this.createdAt = (__runInitializers(this, _actionTaken_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.warranty = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _warranty_initializers, void 0));
            __runInitializers(this, _warranty_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WarrantyExpirationAlert");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _warrantyId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Warranty ID' }), (0, sequelize_typescript_1.ForeignKey)(() => AssetWarranty), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _alertDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Alert date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _daysUntilExpiration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Days until expiration' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _alertMessage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Alert message' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _acknowledged_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acknowledged' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }), sequelize_typescript_1.Index];
        _acknowledgedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acknowledged by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _acknowledgedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Acknowledged date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _actionTaken_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action taken' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _warranty_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => AssetWarranty)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _warrantyId_decorators, { kind: "field", name: "warrantyId", static: false, private: false, access: { has: obj => "warrantyId" in obj, get: obj => obj.warrantyId, set: (obj, value) => { obj.warrantyId = value; } }, metadata: _metadata }, _warrantyId_initializers, _warrantyId_extraInitializers);
        __esDecorate(null, null, _alertDate_decorators, { kind: "field", name: "alertDate", static: false, private: false, access: { has: obj => "alertDate" in obj, get: obj => obj.alertDate, set: (obj, value) => { obj.alertDate = value; } }, metadata: _metadata }, _alertDate_initializers, _alertDate_extraInitializers);
        __esDecorate(null, null, _daysUntilExpiration_decorators, { kind: "field", name: "daysUntilExpiration", static: false, private: false, access: { has: obj => "daysUntilExpiration" in obj, get: obj => obj.daysUntilExpiration, set: (obj, value) => { obj.daysUntilExpiration = value; } }, metadata: _metadata }, _daysUntilExpiration_initializers, _daysUntilExpiration_extraInitializers);
        __esDecorate(null, null, _alertMessage_decorators, { kind: "field", name: "alertMessage", static: false, private: false, access: { has: obj => "alertMessage" in obj, get: obj => obj.alertMessage, set: (obj, value) => { obj.alertMessage = value; } }, metadata: _metadata }, _alertMessage_initializers, _alertMessage_extraInitializers);
        __esDecorate(null, null, _acknowledged_decorators, { kind: "field", name: "acknowledged", static: false, private: false, access: { has: obj => "acknowledged" in obj, get: obj => obj.acknowledged, set: (obj, value) => { obj.acknowledged = value; } }, metadata: _metadata }, _acknowledged_initializers, _acknowledged_extraInitializers);
        __esDecorate(null, null, _acknowledgedBy_decorators, { kind: "field", name: "acknowledgedBy", static: false, private: false, access: { has: obj => "acknowledgedBy" in obj, get: obj => obj.acknowledgedBy, set: (obj, value) => { obj.acknowledgedBy = value; } }, metadata: _metadata }, _acknowledgedBy_initializers, _acknowledgedBy_extraInitializers);
        __esDecorate(null, null, _acknowledgedDate_decorators, { kind: "field", name: "acknowledgedDate", static: false, private: false, access: { has: obj => "acknowledgedDate" in obj, get: obj => obj.acknowledgedDate, set: (obj, value) => { obj.acknowledgedDate = value; } }, metadata: _metadata }, _acknowledgedDate_initializers, _acknowledgedDate_extraInitializers);
        __esDecorate(null, null, _actionTaken_decorators, { kind: "field", name: "actionTaken", static: false, private: false, access: { has: obj => "actionTaken" in obj, get: obj => obj.actionTaken, set: (obj, value) => { obj.actionTaken = value; } }, metadata: _metadata }, _actionTaken_initializers, _actionTaken_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _warranty_decorators, { kind: "field", name: "warranty", static: false, private: false, access: { has: obj => "warranty" in obj, get: obj => obj.warranty, set: (obj, value) => { obj.warranty = value; } }, metadata: _metadata }, _warranty_initializers, _warranty_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WarrantyExpirationAlert = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WarrantyExpirationAlert = _classThis;
})();
exports.WarrantyExpirationAlert = WarrantyExpirationAlert;
// ============================================================================
// WARRANTY REGISTRATION AND MANAGEMENT
// ============================================================================
/**
 * Registers asset warranty
 *
 * @param data - Warranty registration data
 * @param transaction - Optional database transaction
 * @returns Created warranty
 *
 * @example
 * ```typescript
 * const warranty = await registerAssetWarranty({
 *   assetId: 'asset-123',
 *   warrantyType: WarrantyType.MANUFACTURER,
 *   vendorId: 'vendor-001',
 *   startDate: new Date('2024-01-01'),
 *   durationMonths: 36,
 *   coverageDetails: 'Comprehensive parts and labor coverage',
 *   coverageTypes: [CoverageType.PARTS_AND_LABOR, CoverageType.ON_SITE_SERVICE],
 *   registeredBy: 'user-001'
 * });
 * ```
 */
async function registerAssetWarranty(data, transaction) {
    // Generate warranty number if not provided
    const warrantyNumber = data.warrantyNumber || await generateWarrantyNumber();
    // Calculate end date
    const endDate = new Date(data.startDate);
    endDate.setMonth(endDate.getMonth() + data.durationMonths);
    const warranty = await AssetWarranty.create({
        assetId: data.assetId,
        warrantyNumber,
        warrantyType: data.warrantyType,
        vendorId: data.vendorId,
        startDate: data.startDate,
        endDate,
        durationMonths: data.durationMonths,
        coverageDetails: data.coverageDetails,
        coverageTypes: data.coverageTypes,
        terms: data.terms,
        exclusions: data.exclusions,
        cost: data.cost,
        proofOfPurchase: data.proofOfPurchase,
        registeredBy: data.registeredBy,
        registrationDate: new Date(),
        status: WarrantyStatus.ACTIVE,
    }, { transaction });
    return warranty;
}
/**
 * Generates unique warranty number
 */
async function generateWarrantyNumber() {
    const year = new Date().getFullYear();
    const count = await AssetWarranty.count({
        where: {
            createdAt: {
                [sequelize_1.Op.gte]: new Date(`${year}-01-01`),
            },
        },
    });
    return `WRN-${year}-${String(count + 1).padStart(6, '0')}`;
}
/**
 * Updates warranty details
 *
 * @param warrantyId - Warranty ID
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated warranty
 *
 * @example
 * ```typescript
 * await updateWarranty('warranty-123', {
 *   contactPerson: 'John Doe',
 *   contactPhone: '555-0123',
 *   autoRenew: true
 * });
 * ```
 */
async function updateWarranty(warrantyId, updates, transaction) {
    const warranty = await AssetWarranty.findByPk(warrantyId, { transaction });
    if (!warranty) {
        throw new common_1.NotFoundException(`Warranty ${warrantyId} not found`);
    }
    await warranty.update(updates, { transaction });
    return warranty;
}
/**
 * Gets warranty by ID
 *
 * @param warrantyId - Warranty ID
 * @param includeClaims - Whether to include claims
 * @returns Warranty details
 *
 * @example
 * ```typescript
 * const warranty = await getWarrantyById('warranty-123', true);
 * ```
 */
async function getWarrantyById(warrantyId, includeClaims = false) {
    const include = includeClaims
        ? [{ model: WarrantyClaim, as: 'claims' }]
        : [];
    const warranty = await AssetWarranty.findByPk(warrantyId, { include });
    if (!warranty) {
        throw new common_1.NotFoundException(`Warranty ${warrantyId} not found`);
    }
    return warranty;
}
/**
 * Gets all warranties for asset
 *
 * @param assetId - Asset ID
 * @returns Asset warranties
 *
 * @example
 * ```typescript
 * const warranties = await getAssetWarranties('asset-123');
 * ```
 */
async function getAssetWarranties(assetId) {
    return AssetWarranty.findAll({
        where: { assetId },
        order: [['startDate', 'DESC']],
    });
}
/**
 * Gets active warranty for asset
 *
 * @param assetId - Asset ID
 * @returns Active warranty or null
 *
 * @example
 * ```typescript
 * const warranty = await getActiveWarranty('asset-123');
 * ```
 */
async function getActiveWarranty(assetId) {
    return AssetWarranty.findOne({
        where: {
            assetId,
            status: WarrantyStatus.ACTIVE,
            endDate: { [sequelize_1.Op.gt]: new Date() },
        },
        order: [['endDate', 'DESC']],
    });
}
// ============================================================================
// WARRANTY CLAIM PROCESSING
// ============================================================================
/**
 * Creates warranty claim
 *
 * @param data - Warranty claim data
 * @param transaction - Optional database transaction
 * @returns Created claim
 *
 * @example
 * ```typescript
 * const claim = await createWarrantyClaim({
 *   warrantyId: 'warranty-123',
 *   assetId: 'asset-456',
 *   claimType: 'Equipment Malfunction',
 *   issueDescription: 'Device stops working after 30 minutes of operation',
 *   failureDate: new Date(),
 *   reportedBy: 'user-001',
 *   priority: ClaimPriority.HIGH,
 *   estimatedCost: 2500
 * });
 * ```
 */
async function createWarrantyClaim(data, transaction) {
    // Verify warranty is active
    const warranty = await AssetWarranty.findByPk(data.warrantyId, { transaction });
    if (!warranty) {
        throw new common_1.NotFoundException(`Warranty ${data.warrantyId} not found`);
    }
    if (warranty.status !== WarrantyStatus.ACTIVE) {
        throw new common_1.BadRequestException('Warranty is not active');
    }
    if (warranty.endDate < new Date()) {
        throw new common_1.BadRequestException('Warranty has expired');
    }
    // Generate claim number
    const claimNumber = await generateClaimNumber();
    const claim = await WarrantyClaim.create({
        claimNumber,
        warrantyId: data.warrantyId,
        assetId: data.assetId,
        claimType: data.claimType,
        issueDescription: data.issueDescription,
        failureDate: data.failureDate,
        reportedBy: data.reportedBy,
        reportDate: new Date(),
        priority: data.priority || ClaimPriority.NORMAL,
        estimatedCost: data.estimatedCost,
        diagnosticInfo: data.diagnosticInfo,
        photos: data.photos,
        attachments: data.attachments,
        status: WarrantyClaimStatus.DRAFT,
    }, { transaction });
    // Create initial status history
    await createClaimStatusHistory(claim.id, undefined, WarrantyClaimStatus.DRAFT, data.reportedBy, 'Claim created', transaction);
    return claim;
}
/**
 * Generates unique claim number
 */
async function generateClaimNumber() {
    const year = new Date().getFullYear();
    const count = await WarrantyClaim.count({
        where: {
            createdAt: {
                [sequelize_1.Op.gte]: new Date(`${year}-01-01`),
            },
        },
    });
    return `CLM-${year}-${String(count + 1).padStart(6, '0')}`;
}
/**
 * Creates claim status history entry
 */
async function createClaimStatusHistory(claimId, previousStatus, status, changedBy, notes, transaction) {
    return ClaimStatusHistory.create({
        claimId,
        previousStatus,
        status,
        changedBy,
        changedAt: new Date(),
        notes,
    }, { transaction });
}
/**
 * Submits warranty claim
 *
 * @param claimId - Claim ID
 * @param submittedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Updated claim
 *
 * @example
 * ```typescript
 * await submitWarrantyClaim('claim-123', 'user-001');
 * ```
 */
async function submitWarrantyClaim(claimId, submittedBy, transaction) {
    const claim = await WarrantyClaim.findByPk(claimId, { transaction });
    if (!claim) {
        throw new common_1.NotFoundException(`Claim ${claimId} not found`);
    }
    if (claim.status !== WarrantyClaimStatus.DRAFT) {
        throw new common_1.BadRequestException('Only draft claims can be submitted');
    }
    const oldStatus = claim.status;
    await claim.update({
        status: WarrantyClaimStatus.SUBMITTED,
        submittedDate: new Date(),
    }, { transaction });
    await createClaimStatusHistory(claimId, oldStatus, WarrantyClaimStatus.SUBMITTED, submittedBy, 'Claim submitted to vendor', transaction);
    return claim;
}
/**
 * Processes warranty claim approval
 *
 * @param data - Claim approval data
 * @param transaction - Optional database transaction
 * @returns Updated claim
 *
 * @example
 * ```typescript
 * await processWarrantyClaim({
 *   claimId: 'claim-123',
 *   approvedBy: 'vendor-mgr-001',
 *   approved: true,
 *   approvedAmount: 2500,
 *   decisionNotes: 'Approved - covered under warranty terms',
 *   approvalDate: new Date()
 * });
 * ```
 */
async function processWarrantyClaim(data, transaction) {
    const claim = await WarrantyClaim.findByPk(data.claimId, { transaction });
    if (!claim) {
        throw new common_1.NotFoundException(`Claim ${data.claimId} not found`);
    }
    if (claim.status !== WarrantyClaimStatus.SUBMITTED && claim.status !== WarrantyClaimStatus.UNDER_REVIEW) {
        throw new common_1.BadRequestException('Claim must be submitted or under review');
    }
    const oldStatus = claim.status;
    const newStatus = data.approved ? WarrantyClaimStatus.APPROVED : WarrantyClaimStatus.REJECTED;
    await claim.update({
        status: newStatus,
        approvedBy: data.approvedBy,
        approvalDate: data.approvalDate,
        approvedAmount: data.approvedAmount,
        notes: `${claim.notes || ''}\n[${new Date().toISOString()}] ${data.decisionNotes}`,
    }, { transaction });
    await createClaimStatusHistory(data.claimId, oldStatus, newStatus, data.approvedBy, data.decisionNotes, transaction);
    return claim;
}
/**
 * Updates claim with service details
 *
 * @param claimId - Claim ID
 * @param serviceData - Service information
 * @param transaction - Optional database transaction
 * @returns Updated claim
 *
 * @example
 * ```typescript
 * await updateClaimServiceDetails('claim-123', {
 *   vendorReferenceNumber: 'VND-REF-456',
 *   serviceTechnician: 'Tech Mike Johnson',
 *   serviceStartDate: new Date(),
 *   partsReplaced: ['Main Circuit Board', 'Power Supply Unit'],
 *   laborHours: 4.5
 * });
 * ```
 */
async function updateClaimServiceDetails(claimId, serviceData, transaction) {
    const claim = await WarrantyClaim.findByPk(claimId, { transaction });
    if (!claim) {
        throw new common_1.NotFoundException(`Claim ${claimId} not found`);
    }
    await claim.update(serviceData, { transaction });
    if (serviceData.serviceStartDate && claim.status === WarrantyClaimStatus.APPROVED) {
        await claim.update({ status: WarrantyClaimStatus.IN_PROGRESS }, { transaction });
    }
    if (serviceData.serviceCompletionDate) {
        await claim.update({ status: WarrantyClaimStatus.COMPLETED }, { transaction });
    }
    return claim;
}
/**
 * Completes warranty claim
 *
 * @param claimId - Claim ID
 * @param completedBy - User ID
 * @param finalCost - Final repair cost
 * @param resolution - Resolution description
 * @param transaction - Optional database transaction
 * @returns Updated claim
 *
 * @example
 * ```typescript
 * await completeWarrantyClaim(
 *   'claim-123',
 *   'user-001',
 *   2450,
 *   'Equipment repaired and tested, fully functional'
 * );
 * ```
 */
async function completeWarrantyClaim(claimId, completedBy, finalCost, resolution, transaction) {
    const claim = await WarrantyClaim.findByPk(claimId, { transaction });
    if (!claim) {
        throw new common_1.NotFoundException(`Claim ${claimId} not found`);
    }
    const oldStatus = claim.status;
    await claim.update({
        status: WarrantyClaimStatus.COMPLETED,
        actualCost: finalCost,
        resolutionDescription: resolution,
        serviceCompletionDate: new Date(),
    }, { transaction });
    await createClaimStatusHistory(claimId, oldStatus, WarrantyClaimStatus.COMPLETED, completedBy, `Claim completed: ${resolution}`, transaction);
    return claim;
}
// ============================================================================
// WARRANTY COST RECOVERY
// ============================================================================
/**
 * Records warranty cost recovery
 *
 * @param claimId - Claim ID
 * @param reimbursedAmount - Amount reimbursed by vendor
 * @param reimbursementDate - Date of reimbursement
 * @param transaction - Optional database transaction
 * @returns Cost recovery summary
 *
 * @example
 * ```typescript
 * const recovery = await recordWarrantyCostRecovery(
 *   'claim-123',
 *   2200,
 *   new Date()
 * );
 * ```
 */
async function recordWarrantyCostRecovery(claimId, reimbursedAmount, reimbursementDate, transaction) {
    const claim = await WarrantyClaim.findByPk(claimId, { transaction });
    if (!claim) {
        throw new common_1.NotFoundException(`Claim ${claimId} not found`);
    }
    await claim.update({
        reimbursedAmount,
    }, { transaction });
    const totalClaimAmount = Number(claim.claimedAmount || claim.estimatedCost || 0);
    const approvedAmount = Number(claim.approvedAmount || 0);
    const recoveredAmount = reimbursedAmount;
    const outOfPocketExpense = totalClaimAmount - recoveredAmount;
    const recoveryPercentage = totalClaimAmount > 0 ? (recoveredAmount / totalClaimAmount) * 100 : 0;
    return {
        claimId,
        totalClaimAmount,
        approvedAmount,
        recoveredAmount,
        outOfPocketExpense,
        recoveryPercentage,
        reimbursementDate,
    };
}
/**
 * Calculates total cost recovery for warranty
 *
 * @param warrantyId - Warranty ID
 * @returns Cost recovery summary
 *
 * @example
 * ```typescript
 * const summary = await calculateWarrantyCostRecovery('warranty-123');
 * ```
 */
async function calculateWarrantyCostRecovery(warrantyId) {
    const claims = await WarrantyClaim.findAll({
        where: { warrantyId },
    });
    const totalClaims = claims.length;
    const totalClaimValue = claims.reduce((sum, c) => sum + Number(c.claimedAmount || c.estimatedCost || 0), 0);
    const totalApprovedValue = claims.reduce((sum, c) => sum + Number(c.approvedAmount || 0), 0);
    const totalRecoveredValue = claims.reduce((sum, c) => sum + Number(c.reimbursedAmount || 0), 0);
    const totalOutOfPocket = totalClaimValue - totalRecoveredValue;
    const averageRecoveryRate = totalClaimValue > 0 ? (totalRecoveredValue / totalClaimValue) * 100 : 0;
    return {
        totalClaims,
        totalClaimValue,
        totalApprovedValue,
        totalRecoveredValue,
        totalOutOfPocket,
        averageRecoveryRate,
    };
}
// ============================================================================
// WARRANTY EXPIRATION TRACKING
// ============================================================================
/**
 * Tracks warranty expirations and creates alerts
 *
 * @param daysAhead - Days to look ahead for expirations
 * @returns Expiring warranties
 *
 * @example
 * ```typescript
 * const expiring = await trackWarrantyExpiration(90);
 * ```
 */
async function trackWarrantyExpiration(daysAhead = 90) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    const expiringWarranties = await AssetWarranty.findAll({
        where: {
            status: WarrantyStatus.ACTIVE,
            endDate: {
                [sequelize_1.Op.between]: [today, futureDate],
            },
        },
        order: [['endDate', 'ASC']],
    });
    // Create alerts for warranties expiring soon
    for (const warranty of expiringWarranties) {
        const daysUntilExpiration = Math.floor((warranty.endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        // Check if alert already exists
        const existingAlert = await WarrantyExpirationAlert.findOne({
            where: {
                warrantyId: warranty.id,
                alertDate: { [sequelize_1.Op.gte]: today },
            },
        });
        if (!existingAlert) {
            await WarrantyExpirationAlert.create({
                warrantyId: warranty.id,
                alertDate: today,
                daysUntilExpiration,
                alertMessage: `Warranty for asset ${warranty.assetId} expires in ${daysUntilExpiration} days`,
                acknowledged: false,
            });
            // Update warranty status if expiring soon
            if (daysUntilExpiration <= 30) {
                await warranty.update({ status: WarrantyStatus.EXPIRING_SOON });
            }
        }
    }
    return expiringWarranties;
}
/**
 * Gets expiration alerts
 *
 * @param acknowledgedOnly - Filter by acknowledged status
 * @returns Expiration alerts
 *
 * @example
 * ```typescript
 * const alerts = await getExpirationAlerts(false);
 * ```
 */
async function getExpirationAlerts(acknowledgedOnly = false) {
    const where = {};
    if (!acknowledgedOnly) {
        where.acknowledged = false;
    }
    return WarrantyExpirationAlert.findAll({
        where,
        include: [{ model: AssetWarranty, as: 'warranty' }],
        order: [['daysUntilExpiration', 'ASC']],
    });
}
/**
 * Acknowledges expiration alert
 *
 * @param alertId - Alert ID
 * @param acknowledgedBy - User ID
 * @param actionTaken - Action description
 * @param transaction - Optional database transaction
 * @returns Updated alert
 *
 * @example
 * ```typescript
 * await acknowledgeExpirationAlert(
 *   'alert-123',
 *   'user-001',
 *   'Extended warranty purchased for additional 12 months'
 * );
 * ```
 */
async function acknowledgeExpirationAlert(alertId, acknowledgedBy, actionTaken, transaction) {
    const alert = await WarrantyExpirationAlert.findByPk(alertId, { transaction });
    if (!alert) {
        throw new common_1.NotFoundException(`Alert ${alertId} not found`);
    }
    await alert.update({
        acknowledged: true,
        acknowledgedBy,
        acknowledgedDate: new Date(),
        actionTaken,
    }, { transaction });
    return alert;
}
// ============================================================================
// WARRANTY RENEWAL
// ============================================================================
/**
 * Renews warranty
 *
 * @param warrantyId - Warranty ID
 * @param renewalData - Renewal details
 * @param transaction - Optional database transaction
 * @returns New warranty
 *
 * @example
 * ```typescript
 * const renewed = await renewWarranty('warranty-123', {
 *   durationMonths: 12,
 *   cost: 500,
 *   renewedBy: 'user-001'
 * });
 * ```
 */
async function renewWarranty(warrantyId, renewalData, transaction) {
    const originalWarranty = await AssetWarranty.findByPk(warrantyId, { transaction });
    if (!originalWarranty) {
        throw new common_1.NotFoundException(`Warranty ${warrantyId} not found`);
    }
    // Create new warranty starting from end of original
    const startDate = originalWarranty.endDate;
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + renewalData.durationMonths);
    const renewedWarranty = await AssetWarranty.create({
        assetId: originalWarranty.assetId,
        warrantyType: WarrantyType.EXTENDED,
        vendorId: originalWarranty.vendorId,
        startDate,
        endDate,
        durationMonths: renewalData.durationMonths,
        coverageDetails: originalWarranty.coverageDetails,
        coverageTypes: originalWarranty.coverageTypes,
        terms: originalWarranty.terms,
        cost: renewalData.cost,
        registeredBy: renewalData.renewedBy,
        registrationDate: new Date(),
        status: WarrantyStatus.ACTIVE,
        notes: `Renewed from warranty ${originalWarranty.warrantyNumber}. ${renewalData.notes || ''}`,
    }, { transaction });
    // Update original warranty
    await originalWarranty.update({
        renewalDate: new Date(),
        notes: `${originalWarranty.notes || ''}\n[${new Date().toISOString()}] Renewed as ${renewedWarranty.warrantyNumber}`,
    }, { transaction });
    return renewedWarranty;
}
// ============================================================================
// ANALYTICS AND REPORTING
// ============================================================================
/**
 * Generates warranty analytics
 *
 * @param startDate - Analysis start date
 * @param endDate - Analysis end date
 * @returns Warranty analytics
 *
 * @example
 * ```typescript
 * const analytics = await generateWarrantyAnalytics(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
async function generateWarrantyAnalytics(startDate, endDate) {
    const warranties = await AssetWarranty.findAll({
        where: {
            registrationDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    const claims = await WarrantyClaim.findAll({
        where: {
            reportDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    const totalWarranties = warranties.length;
    const activeWarranties = warranties.filter((w) => w.status === WarrantyStatus.ACTIVE).length;
    const expiringSoon = warranties.filter((w) => w.status === WarrantyStatus.EXPIRING_SOON).length;
    const totalClaims = claims.length;
    const approvedClaims = claims.filter((c) => c.status === WarrantyClaimStatus.APPROVED || c.status === WarrantyClaimStatus.COMPLETED).length;
    const rejectedClaims = claims.filter((c) => c.status === WarrantyClaimStatus.REJECTED).length;
    const totalClaimValue = claims.reduce((sum, c) => sum + Number(c.claimedAmount || c.estimatedCost || 0), 0);
    const totalRecoveredValue = claims.reduce((sum, c) => sum + Number(c.reimbursedAmount || 0), 0);
    const averageClaimAmount = totalClaims > 0 ? totalClaimValue / totalClaims : 0;
    const claimApprovalRate = totalClaims > 0 ? (approvedClaims / totalClaims) * 100 : 0;
    return {
        totalWarranties,
        activeWarranties,
        expiringSoon,
        totalClaims,
        approvedClaims,
        rejectedClaims,
        totalClaimValue,
        totalRecoveredValue,
        averageClaimAmount,
        claimApprovalRate,
    };
}
/**
 * Searches warranties with filters
 *
 * @param filters - Search filters
 * @param options - Query options
 * @returns Filtered warranties
 *
 * @example
 * ```typescript
 * const warranties = await searchWarranties({
 *   status: WarrantyStatus.ACTIVE,
 *   warrantyType: WarrantyType.MANUFACTURER,
 *   vendorId: 'vendor-001'
 * });
 * ```
 */
async function searchWarranties(filters, options = {}) {
    const where = {};
    if (filters.status) {
        where.status = Array.isArray(filters.status)
            ? { [sequelize_1.Op.in]: filters.status }
            : filters.status;
    }
    if (filters.warrantyType) {
        where.warrantyType = Array.isArray(filters.warrantyType)
            ? { [sequelize_1.Op.in]: filters.warrantyType }
            : filters.warrantyType;
    }
    if (filters.vendorId) {
        where.vendorId = filters.vendorId;
    }
    if (filters.assetId) {
        where.assetId = filters.assetId;
    }
    if (filters.expiringWithinDays) {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + filters.expiringWithinDays);
        where.endDate = {
            [sequelize_1.Op.between]: [today, futureDate],
        };
    }
    const { rows: warranties, count: total } = await AssetWarranty.findAndCountAll({
        where,
        ...options,
    });
    return { warranties, total };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    AssetWarranty,
    WarrantyClaim,
    ClaimStatusHistory,
    WarrantyExpirationAlert,
    // Warranty Management
    registerAssetWarranty,
    updateWarranty,
    getWarrantyById,
    getAssetWarranties,
    getActiveWarranty,
    // Claim Processing
    createWarrantyClaim,
    submitWarrantyClaim,
    processWarrantyClaim,
    updateClaimServiceDetails,
    completeWarrantyClaim,
    // Cost Recovery
    recordWarrantyCostRecovery,
    calculateWarrantyCostRecovery,
    // Expiration Tracking
    trackWarrantyExpiration,
    getExpirationAlerts,
    acknowledgeExpirationAlert,
    // Renewal
    renewWarranty,
    // Analytics
    generateWarrantyAnalytics,
    searchWarranties,
};
//# sourceMappingURL=asset-warranty-commands.js.map