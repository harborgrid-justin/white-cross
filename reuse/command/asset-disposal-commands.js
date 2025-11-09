"use strict";
/**
 * ASSET DISPOSAL MANAGEMENT COMMAND FUNCTIONS
 *
 * Enterprise-grade asset disposal management system for JD Edwards EnterpriseOne competition.
 * Provides comprehensive disposal workflows including:
 * - Disposal workflows and approval processes
 * - Salvage value calculation and optimization
 * - Multiple disposal methods (sale, donation, scrap, trade-in)
 * - Environmental disposal requirements and compliance
 * - Disposal documentation and audit trails
 * - Asset write-off processing
 * - Disposal approvals and authorization
 * - Disposal vendor management
 * - Revenue recovery tracking
 * - Disposal cost management
 * - Certificate of destruction
 * - Data sanitization requirements
 * - Regulatory compliance (EPA, WEEE, RoHS)
 *
 * @module AssetDisposalCommands
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
 *   initiateAssetDisposal,
 *   calculateSalvageValue,
 *   processDisposalApproval,
 *   generateCertificateOfDestruction,
 *   DisposalRequest,
 *   DisposalMethod
 * } from './asset-disposal-commands';
 *
 * // Initiate disposal request
 * const disposal = await initiateAssetDisposal({
 *   assetId: 'asset-123',
 *   disposalMethod: DisposalMethod.SALE,
 *   reason: 'End of useful life',
 *   estimatedValue: 5000,
 *   requestedBy: 'user-001'
 * });
 *
 * // Calculate salvage value
 * const salvage = await calculateSalvageValue('asset-123', {
 *   marketConditions: 'fair',
 *   assetCondition: 'good',
 *   demandLevel: 'high'
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
exports.DisposalAuditLog = exports.CertificateOfDestruction = exports.DisposalVendor = exports.DisposalApproval = exports.DisposalRequest = exports.DataSanitizationLevel = exports.EnvironmentalClassification = exports.ApprovalStatus = exports.DisposalStatus = exports.DisposalMethod = void 0;
exports.initiateAssetDisposal = initiateAssetDisposal;
exports.generateDisposalRequestNumber = generateDisposalRequestNumber;
exports.updateDisposalStatus = updateDisposalStatus;
exports.submitDisposalForApproval = submitDisposalForApproval;
exports.getRequiredApprovalLevels = getRequiredApprovalLevels;
exports.processDisposalApproval = processDisposalApproval;
exports.getDisposalWithApprovals = getDisposalWithApprovals;
exports.calculateSalvageValue = calculateSalvageValue;
exports.optimizeSalvageValue = optimizeSalvageValue;
exports.compareDisposalMethods = compareDisposalMethods;
exports.getEnvironmentalRequirements = getEnvironmentalRequirements;
exports.validateVendorCompliance = validateVendorCompliance;
exports.processDataSanitization = processDataSanitization;
exports.generateCertificateOfDestruction = generateCertificateOfDestruction;
exports.validateDestructionDocumentation = validateDestructionDocumentation;
exports.registerDisposalVendor = registerDisposalVendor;
exports.updateVendorPerformance = updateVendorPerformance;
exports.getCertifiedVendors = getCertifiedVendors;
exports.evaluateVendorForDisposal = evaluateVendorForDisposal;
exports.calculateDisposalCost = calculateDisposalCost;
exports.trackRevenueRecovery = trackRevenueRecovery;
exports.completeDisposal = completeDisposal;
exports.getDisposalAuditTrail = getDisposalAuditTrail;
exports.generateDisposalComplianceReport = generateDisposalComplianceReport;
exports.searchDisposalRequests = searchDisposalRequests;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Disposal methods
 */
var DisposalMethod;
(function (DisposalMethod) {
    DisposalMethod["SALE"] = "sale";
    DisposalMethod["DONATION"] = "donation";
    DisposalMethod["SCRAP"] = "scrap";
    DisposalMethod["RECYCLE"] = "recycle";
    DisposalMethod["TRADE_IN"] = "trade_in";
    DisposalMethod["DESTRUCTION"] = "destruction";
    DisposalMethod["RETURN_TO_VENDOR"] = "return_to_vendor";
    DisposalMethod["CANNIBALIZE"] = "cannibalize";
    DisposalMethod["LANDFILL"] = "landfill";
    DisposalMethod["HAZARDOUS_WASTE"] = "hazardous_waste";
})(DisposalMethod || (exports.DisposalMethod = DisposalMethod = {}));
/**
 * Disposal request status
 */
var DisposalStatus;
(function (DisposalStatus) {
    DisposalStatus["DRAFT"] = "draft";
    DisposalStatus["PENDING_APPROVAL"] = "pending_approval";
    DisposalStatus["APPROVED"] = "approved";
    DisposalStatus["REJECTED"] = "rejected";
    DisposalStatus["IN_PROGRESS"] = "in_progress";
    DisposalStatus["COMPLETED"] = "completed";
    DisposalStatus["CANCELLED"] = "cancelled";
    DisposalStatus["ON_HOLD"] = "on_hold";
})(DisposalStatus || (exports.DisposalStatus = DisposalStatus = {}));
/**
 * Approval status
 */
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "pending";
    ApprovalStatus["APPROVED"] = "approved";
    ApprovalStatus["REJECTED"] = "rejected";
    ApprovalStatus["ESCALATED"] = "escalated";
    ApprovalStatus["WITHDRAWN"] = "withdrawn";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
/**
 * Environmental classification
 */
var EnvironmentalClassification;
(function (EnvironmentalClassification) {
    EnvironmentalClassification["NON_HAZARDOUS"] = "non_hazardous";
    EnvironmentalClassification["HAZARDOUS"] = "hazardous";
    EnvironmentalClassification["ELECTRONIC_WASTE"] = "electronic_waste";
    EnvironmentalClassification["CHEMICAL"] = "chemical";
    EnvironmentalClassification["BIOLOGICAL"] = "biological";
    EnvironmentalClassification["RADIOACTIVE"] = "radioactive";
    EnvironmentalClassification["UNIVERSAL_WASTE"] = "universal_waste";
})(EnvironmentalClassification || (exports.EnvironmentalClassification = EnvironmentalClassification = {}));
/**
 * Data sanitization level
 */
var DataSanitizationLevel;
(function (DataSanitizationLevel) {
    DataSanitizationLevel["NONE"] = "none";
    DataSanitizationLevel["BASIC_WIPE"] = "basic_wipe";
    DataSanitizationLevel["DOD_3_PASS"] = "dod_3_pass";
    DataSanitizationLevel["DOD_7_PASS"] = "dod_7_pass";
    DataSanitizationLevel["GUTMANN"] = "gutmann";
    DataSanitizationLevel["PHYSICAL_DESTRUCTION"] = "physical_destruction";
    DataSanitizationLevel["DEGAUSSING"] = "degaussing";
})(DataSanitizationLevel || (exports.DataSanitizationLevel = DataSanitizationLevel = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Disposal Request Model
 */
let DisposalRequest = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'asset_disposal_requests',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['asset_id'] },
                { fields: ['status'] },
                { fields: ['disposal_method'] },
                { fields: ['requested_by'] },
                { fields: ['target_disposal_date'] },
                { fields: ['disposal_vendor_id'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _requestNumber_decorators;
    let _requestNumber_initializers = [];
    let _requestNumber_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _disposalMethod_decorators;
    let _disposalMethod_initializers = [];
    let _disposalMethod_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _requestDate_decorators;
    let _requestDate_initializers = [];
    let _requestDate_extraInitializers = [];
    let _estimatedValue_decorators;
    let _estimatedValue_initializers = [];
    let _estimatedValue_extraInitializers = [];
    let _actualValue_decorators;
    let _actualValue_initializers = [];
    let _actualValue_extraInitializers = [];
    let _targetDisposalDate_decorators;
    let _targetDisposalDate_initializers = [];
    let _targetDisposalDate_extraInitializers = [];
    let _actualDisposalDate_decorators;
    let _actualDisposalDate_initializers = [];
    let _actualDisposalDate_extraInitializers = [];
    let _disposalVendorId_decorators;
    let _disposalVendorId_initializers = [];
    let _disposalVendorId_extraInitializers = [];
    let _requiresDataSanitization_decorators;
    let _requiresDataSanitization_initializers = [];
    let _requiresDataSanitization_extraInitializers = [];
    let _sanitizationLevel_decorators;
    let _sanitizationLevel_initializers = [];
    let _sanitizationLevel_extraInitializers = [];
    let _sanitizationCompleted_decorators;
    let _sanitizationCompleted_initializers = [];
    let _sanitizationCompleted_extraInitializers = [];
    let _sanitizationDate_decorators;
    let _sanitizationDate_initializers = [];
    let _sanitizationDate_extraInitializers = [];
    let _sanitizedBy_decorators;
    let _sanitizedBy_initializers = [];
    let _sanitizedBy_extraInitializers = [];
    let _environmentalClassification_decorators;
    let _environmentalClassification_initializers = [];
    let _environmentalClassification_extraInitializers = [];
    let _permitRequired_decorators;
    let _permitRequired_initializers = [];
    let _permitRequired_extraInitializers = [];
    let _permitNumbers_decorators;
    let _permitNumbers_initializers = [];
    let _permitNumbers_extraInitializers = [];
    let _approvalRequired_decorators;
    let _approvalRequired_initializers = [];
    let _approvalRequired_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvalDate_decorators;
    let _approvalDate_initializers = [];
    let _approvalDate_extraInitializers = [];
    let _disposalCost_decorators;
    let _disposalCost_initializers = [];
    let _disposalCost_extraInitializers = [];
    let _costBreakdown_decorators;
    let _costBreakdown_initializers = [];
    let _costBreakdown_extraInitializers = [];
    let _revenueRecovery_decorators;
    let _revenueRecovery_initializers = [];
    let _revenueRecovery_extraInitializers = [];
    let _certificateOfDestructionId_decorators;
    let _certificateOfDestructionId_initializers = [];
    let _certificateOfDestructionId_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
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
    let _approvals_decorators;
    let _approvals_initializers = [];
    let _approvals_extraInitializers = [];
    let _auditLogs_decorators;
    let _auditLogs_initializers = [];
    let _auditLogs_extraInitializers = [];
    var DisposalRequest = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.requestNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _requestNumber_initializers, void 0));
            this.assetId = (__runInitializers(this, _requestNumber_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.disposalMethod = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _disposalMethod_initializers, void 0));
            this.status = (__runInitializers(this, _disposalMethod_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.reason = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            this.requestedBy = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
            this.requestDate = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _requestDate_initializers, void 0));
            this.estimatedValue = (__runInitializers(this, _requestDate_extraInitializers), __runInitializers(this, _estimatedValue_initializers, void 0));
            this.actualValue = (__runInitializers(this, _estimatedValue_extraInitializers), __runInitializers(this, _actualValue_initializers, void 0));
            this.targetDisposalDate = (__runInitializers(this, _actualValue_extraInitializers), __runInitializers(this, _targetDisposalDate_initializers, void 0));
            this.actualDisposalDate = (__runInitializers(this, _targetDisposalDate_extraInitializers), __runInitializers(this, _actualDisposalDate_initializers, void 0));
            this.disposalVendorId = (__runInitializers(this, _actualDisposalDate_extraInitializers), __runInitializers(this, _disposalVendorId_initializers, void 0));
            this.requiresDataSanitization = (__runInitializers(this, _disposalVendorId_extraInitializers), __runInitializers(this, _requiresDataSanitization_initializers, void 0));
            this.sanitizationLevel = (__runInitializers(this, _requiresDataSanitization_extraInitializers), __runInitializers(this, _sanitizationLevel_initializers, void 0));
            this.sanitizationCompleted = (__runInitializers(this, _sanitizationLevel_extraInitializers), __runInitializers(this, _sanitizationCompleted_initializers, void 0));
            this.sanitizationDate = (__runInitializers(this, _sanitizationCompleted_extraInitializers), __runInitializers(this, _sanitizationDate_initializers, void 0));
            this.sanitizedBy = (__runInitializers(this, _sanitizationDate_extraInitializers), __runInitializers(this, _sanitizedBy_initializers, void 0));
            this.environmentalClassification = (__runInitializers(this, _sanitizedBy_extraInitializers), __runInitializers(this, _environmentalClassification_initializers, void 0));
            this.permitRequired = (__runInitializers(this, _environmentalClassification_extraInitializers), __runInitializers(this, _permitRequired_initializers, void 0));
            this.permitNumbers = (__runInitializers(this, _permitRequired_extraInitializers), __runInitializers(this, _permitNumbers_initializers, void 0));
            this.approvalRequired = (__runInitializers(this, _permitNumbers_extraInitializers), __runInitializers(this, _approvalRequired_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _approvalRequired_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvalDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
            this.disposalCost = (__runInitializers(this, _approvalDate_extraInitializers), __runInitializers(this, _disposalCost_initializers, void 0));
            this.costBreakdown = (__runInitializers(this, _disposalCost_extraInitializers), __runInitializers(this, _costBreakdown_initializers, void 0));
            this.revenueRecovery = (__runInitializers(this, _costBreakdown_extraInitializers), __runInitializers(this, _revenueRecovery_initializers, void 0));
            this.certificateOfDestructionId = (__runInitializers(this, _revenueRecovery_extraInitializers), __runInitializers(this, _certificateOfDestructionId_initializers, void 0));
            this.notes = (__runInitializers(this, _certificateOfDestructionId_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.attachments = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.metadata = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.approvals = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _approvals_initializers, void 0));
            this.auditLogs = (__runInitializers(this, _approvals_extraInitializers), __runInitializers(this, _auditLogs_initializers, void 0));
            __runInitializers(this, _auditLogs_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DisposalRequest");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _requestNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Disposal request number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _disposalMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Disposal method' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(DisposalMethod)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Disposal status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(DisposalStatus)),
                defaultValue: DisposalStatus.DRAFT,
            }), sequelize_typescript_1.Index];
        _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Disposal reason' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _requestedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requested by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _requestDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Request date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _estimatedValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated disposal value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _actualValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual disposal value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _targetDisposalDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target disposal date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _actualDisposalDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual disposal date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _disposalVendorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Disposal vendor ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _requiresDataSanitization_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requires data sanitization' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _sanitizationLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Data sanitization level' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(DataSanitizationLevel)) })];
        _sanitizationCompleted_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sanitization completed' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _sanitizationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sanitization date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _sanitizedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sanitized by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _environmentalClassification_decorators = [(0, swagger_1.ApiProperty)({ description: 'Environmental classification' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(EnvironmentalClassification)) })];
        _permitRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Environmental permit required' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _permitNumbers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Permit numbers' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _approvalRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval required' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _approvalDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _disposalCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Disposal cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _costBreakdown_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost breakdown' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _revenueRecovery_decorators = [(0, swagger_1.ApiProperty)({ description: 'Revenue recovery' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _certificateOfDestructionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Certificate of destruction ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _attachments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attachments' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _approvals_decorators = [(0, sequelize_typescript_1.HasMany)(() => DisposalApproval)];
        _auditLogs_decorators = [(0, sequelize_typescript_1.HasMany)(() => DisposalAuditLog)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _requestNumber_decorators, { kind: "field", name: "requestNumber", static: false, private: false, access: { has: obj => "requestNumber" in obj, get: obj => obj.requestNumber, set: (obj, value) => { obj.requestNumber = value; } }, metadata: _metadata }, _requestNumber_initializers, _requestNumber_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _disposalMethod_decorators, { kind: "field", name: "disposalMethod", static: false, private: false, access: { has: obj => "disposalMethod" in obj, get: obj => obj.disposalMethod, set: (obj, value) => { obj.disposalMethod = value; } }, metadata: _metadata }, _disposalMethod_initializers, _disposalMethod_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
        __esDecorate(null, null, _requestDate_decorators, { kind: "field", name: "requestDate", static: false, private: false, access: { has: obj => "requestDate" in obj, get: obj => obj.requestDate, set: (obj, value) => { obj.requestDate = value; } }, metadata: _metadata }, _requestDate_initializers, _requestDate_extraInitializers);
        __esDecorate(null, null, _estimatedValue_decorators, { kind: "field", name: "estimatedValue", static: false, private: false, access: { has: obj => "estimatedValue" in obj, get: obj => obj.estimatedValue, set: (obj, value) => { obj.estimatedValue = value; } }, metadata: _metadata }, _estimatedValue_initializers, _estimatedValue_extraInitializers);
        __esDecorate(null, null, _actualValue_decorators, { kind: "field", name: "actualValue", static: false, private: false, access: { has: obj => "actualValue" in obj, get: obj => obj.actualValue, set: (obj, value) => { obj.actualValue = value; } }, metadata: _metadata }, _actualValue_initializers, _actualValue_extraInitializers);
        __esDecorate(null, null, _targetDisposalDate_decorators, { kind: "field", name: "targetDisposalDate", static: false, private: false, access: { has: obj => "targetDisposalDate" in obj, get: obj => obj.targetDisposalDate, set: (obj, value) => { obj.targetDisposalDate = value; } }, metadata: _metadata }, _targetDisposalDate_initializers, _targetDisposalDate_extraInitializers);
        __esDecorate(null, null, _actualDisposalDate_decorators, { kind: "field", name: "actualDisposalDate", static: false, private: false, access: { has: obj => "actualDisposalDate" in obj, get: obj => obj.actualDisposalDate, set: (obj, value) => { obj.actualDisposalDate = value; } }, metadata: _metadata }, _actualDisposalDate_initializers, _actualDisposalDate_extraInitializers);
        __esDecorate(null, null, _disposalVendorId_decorators, { kind: "field", name: "disposalVendorId", static: false, private: false, access: { has: obj => "disposalVendorId" in obj, get: obj => obj.disposalVendorId, set: (obj, value) => { obj.disposalVendorId = value; } }, metadata: _metadata }, _disposalVendorId_initializers, _disposalVendorId_extraInitializers);
        __esDecorate(null, null, _requiresDataSanitization_decorators, { kind: "field", name: "requiresDataSanitization", static: false, private: false, access: { has: obj => "requiresDataSanitization" in obj, get: obj => obj.requiresDataSanitization, set: (obj, value) => { obj.requiresDataSanitization = value; } }, metadata: _metadata }, _requiresDataSanitization_initializers, _requiresDataSanitization_extraInitializers);
        __esDecorate(null, null, _sanitizationLevel_decorators, { kind: "field", name: "sanitizationLevel", static: false, private: false, access: { has: obj => "sanitizationLevel" in obj, get: obj => obj.sanitizationLevel, set: (obj, value) => { obj.sanitizationLevel = value; } }, metadata: _metadata }, _sanitizationLevel_initializers, _sanitizationLevel_extraInitializers);
        __esDecorate(null, null, _sanitizationCompleted_decorators, { kind: "field", name: "sanitizationCompleted", static: false, private: false, access: { has: obj => "sanitizationCompleted" in obj, get: obj => obj.sanitizationCompleted, set: (obj, value) => { obj.sanitizationCompleted = value; } }, metadata: _metadata }, _sanitizationCompleted_initializers, _sanitizationCompleted_extraInitializers);
        __esDecorate(null, null, _sanitizationDate_decorators, { kind: "field", name: "sanitizationDate", static: false, private: false, access: { has: obj => "sanitizationDate" in obj, get: obj => obj.sanitizationDate, set: (obj, value) => { obj.sanitizationDate = value; } }, metadata: _metadata }, _sanitizationDate_initializers, _sanitizationDate_extraInitializers);
        __esDecorate(null, null, _sanitizedBy_decorators, { kind: "field", name: "sanitizedBy", static: false, private: false, access: { has: obj => "sanitizedBy" in obj, get: obj => obj.sanitizedBy, set: (obj, value) => { obj.sanitizedBy = value; } }, metadata: _metadata }, _sanitizedBy_initializers, _sanitizedBy_extraInitializers);
        __esDecorate(null, null, _environmentalClassification_decorators, { kind: "field", name: "environmentalClassification", static: false, private: false, access: { has: obj => "environmentalClassification" in obj, get: obj => obj.environmentalClassification, set: (obj, value) => { obj.environmentalClassification = value; } }, metadata: _metadata }, _environmentalClassification_initializers, _environmentalClassification_extraInitializers);
        __esDecorate(null, null, _permitRequired_decorators, { kind: "field", name: "permitRequired", static: false, private: false, access: { has: obj => "permitRequired" in obj, get: obj => obj.permitRequired, set: (obj, value) => { obj.permitRequired = value; } }, metadata: _metadata }, _permitRequired_initializers, _permitRequired_extraInitializers);
        __esDecorate(null, null, _permitNumbers_decorators, { kind: "field", name: "permitNumbers", static: false, private: false, access: { has: obj => "permitNumbers" in obj, get: obj => obj.permitNumbers, set: (obj, value) => { obj.permitNumbers = value; } }, metadata: _metadata }, _permitNumbers_initializers, _permitNumbers_extraInitializers);
        __esDecorate(null, null, _approvalRequired_decorators, { kind: "field", name: "approvalRequired", static: false, private: false, access: { has: obj => "approvalRequired" in obj, get: obj => obj.approvalRequired, set: (obj, value) => { obj.approvalRequired = value; } }, metadata: _metadata }, _approvalRequired_initializers, _approvalRequired_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: obj => "approvalDate" in obj, get: obj => obj.approvalDate, set: (obj, value) => { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
        __esDecorate(null, null, _disposalCost_decorators, { kind: "field", name: "disposalCost", static: false, private: false, access: { has: obj => "disposalCost" in obj, get: obj => obj.disposalCost, set: (obj, value) => { obj.disposalCost = value; } }, metadata: _metadata }, _disposalCost_initializers, _disposalCost_extraInitializers);
        __esDecorate(null, null, _costBreakdown_decorators, { kind: "field", name: "costBreakdown", static: false, private: false, access: { has: obj => "costBreakdown" in obj, get: obj => obj.costBreakdown, set: (obj, value) => { obj.costBreakdown = value; } }, metadata: _metadata }, _costBreakdown_initializers, _costBreakdown_extraInitializers);
        __esDecorate(null, null, _revenueRecovery_decorators, { kind: "field", name: "revenueRecovery", static: false, private: false, access: { has: obj => "revenueRecovery" in obj, get: obj => obj.revenueRecovery, set: (obj, value) => { obj.revenueRecovery = value; } }, metadata: _metadata }, _revenueRecovery_initializers, _revenueRecovery_extraInitializers);
        __esDecorate(null, null, _certificateOfDestructionId_decorators, { kind: "field", name: "certificateOfDestructionId", static: false, private: false, access: { has: obj => "certificateOfDestructionId" in obj, get: obj => obj.certificateOfDestructionId, set: (obj, value) => { obj.certificateOfDestructionId = value; } }, metadata: _metadata }, _certificateOfDestructionId_initializers, _certificateOfDestructionId_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _approvals_decorators, { kind: "field", name: "approvals", static: false, private: false, access: { has: obj => "approvals" in obj, get: obj => obj.approvals, set: (obj, value) => { obj.approvals = value; } }, metadata: _metadata }, _approvals_initializers, _approvals_extraInitializers);
        __esDecorate(null, null, _auditLogs_decorators, { kind: "field", name: "auditLogs", static: false, private: false, access: { has: obj => "auditLogs" in obj, get: obj => obj.auditLogs, set: (obj, value) => { obj.auditLogs = value; } }, metadata: _metadata }, _auditLogs_initializers, _auditLogs_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DisposalRequest = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DisposalRequest = _classThis;
})();
exports.DisposalRequest = DisposalRequest;
/**
 * Disposal Approval Model
 */
let DisposalApproval = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'asset_disposal_approvals',
            timestamps: true,
            indexes: [
                { fields: ['disposal_request_id'] },
                { fields: ['approver_id'] },
                { fields: ['status'] },
                { fields: ['approval_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _disposalRequestId_decorators;
    let _disposalRequestId_initializers = [];
    let _disposalRequestId_extraInitializers = [];
    let _approverId_decorators;
    let _approverId_initializers = [];
    let _approverId_extraInitializers = [];
    let _approvalLevel_decorators;
    let _approvalLevel_initializers = [];
    let _approvalLevel_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _approvalDate_decorators;
    let _approvalDate_initializers = [];
    let _approvalDate_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    let _conditions_decorators;
    let _conditions_initializers = [];
    let _conditions_extraInitializers = [];
    let _notified_decorators;
    let _notified_initializers = [];
    let _notified_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _disposalRequest_decorators;
    let _disposalRequest_initializers = [];
    let _disposalRequest_extraInitializers = [];
    var DisposalApproval = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.disposalRequestId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _disposalRequestId_initializers, void 0));
            this.approverId = (__runInitializers(this, _disposalRequestId_extraInitializers), __runInitializers(this, _approverId_initializers, void 0));
            this.approvalLevel = (__runInitializers(this, _approverId_extraInitializers), __runInitializers(this, _approvalLevel_initializers, void 0));
            this.status = (__runInitializers(this, _approvalLevel_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.approvalDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
            this.comments = (__runInitializers(this, _approvalDate_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
            this.conditions = (__runInitializers(this, _comments_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
            this.notified = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _notified_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notified_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.disposalRequest = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _disposalRequest_initializers, void 0));
            __runInitializers(this, _disposalRequest_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DisposalApproval");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _disposalRequestId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Disposal request ID' }), (0, sequelize_typescript_1.ForeignKey)(() => DisposalRequest), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _approverId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approver user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _approvalLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval level' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ApprovalStatus)),
                defaultValue: ApprovalStatus.PENDING,
            }), sequelize_typescript_1.Index];
        _approvalDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _comments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Comments' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _conditions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conditions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT) })];
        _notified_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notified' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _disposalRequest_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => DisposalRequest)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _disposalRequestId_decorators, { kind: "field", name: "disposalRequestId", static: false, private: false, access: { has: obj => "disposalRequestId" in obj, get: obj => obj.disposalRequestId, set: (obj, value) => { obj.disposalRequestId = value; } }, metadata: _metadata }, _disposalRequestId_initializers, _disposalRequestId_extraInitializers);
        __esDecorate(null, null, _approverId_decorators, { kind: "field", name: "approverId", static: false, private: false, access: { has: obj => "approverId" in obj, get: obj => obj.approverId, set: (obj, value) => { obj.approverId = value; } }, metadata: _metadata }, _approverId_initializers, _approverId_extraInitializers);
        __esDecorate(null, null, _approvalLevel_decorators, { kind: "field", name: "approvalLevel", static: false, private: false, access: { has: obj => "approvalLevel" in obj, get: obj => obj.approvalLevel, set: (obj, value) => { obj.approvalLevel = value; } }, metadata: _metadata }, _approvalLevel_initializers, _approvalLevel_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: obj => "approvalDate" in obj, get: obj => obj.approvalDate, set: (obj, value) => { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
        __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
        __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: obj => "conditions" in obj, get: obj => obj.conditions, set: (obj, value) => { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
        __esDecorate(null, null, _notified_decorators, { kind: "field", name: "notified", static: false, private: false, access: { has: obj => "notified" in obj, get: obj => obj.notified, set: (obj, value) => { obj.notified = value; } }, metadata: _metadata }, _notified_initializers, _notified_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _disposalRequest_decorators, { kind: "field", name: "disposalRequest", static: false, private: false, access: { has: obj => "disposalRequest" in obj, get: obj => obj.disposalRequest, set: (obj, value) => { obj.disposalRequest = value; } }, metadata: _metadata }, _disposalRequest_initializers, _disposalRequest_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DisposalApproval = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DisposalApproval = _classThis;
})();
exports.DisposalApproval = DisposalApproval;
/**
 * Disposal Vendor Model
 */
let DisposalVendor = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'disposal_vendors',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['vendor_code'], unique: true },
                { fields: ['is_active'] },
                { fields: ['is_certified'] },
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
    let _disposalMethodsOffered_decorators;
    let _disposalMethodsOffered_initializers = [];
    let _disposalMethodsOffered_extraInitializers = [];
    let _certifications_decorators;
    let _certifications_initializers = [];
    let _certifications_extraInitializers = [];
    let _isCertified_decorators;
    let _isCertified_initializers = [];
    let _isCertified_extraInitializers = [];
    let _environmentalCompliance_decorators;
    let _environmentalCompliance_initializers = [];
    let _environmentalCompliance_extraInitializers = [];
    let _contactName_decorators;
    let _contactName_initializers = [];
    let _contactName_extraInitializers = [];
    let _contactEmail_decorators;
    let _contactEmail_initializers = [];
    let _contactEmail_extraInitializers = [];
    let _contactPhone_decorators;
    let _contactPhone_initializers = [];
    let _contactPhone_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _serviceAreas_decorators;
    let _serviceAreas_initializers = [];
    let _serviceAreas_extraInitializers = [];
    let _pricingStructure_decorators;
    let _pricingStructure_initializers = [];
    let _pricingStructure_extraInitializers = [];
    let _performanceRating_decorators;
    let _performanceRating_initializers = [];
    let _performanceRating_extraInitializers = [];
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
    var DisposalVendor = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.vendorCode = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _vendorCode_initializers, void 0));
            this.vendorName = (__runInitializers(this, _vendorCode_extraInitializers), __runInitializers(this, _vendorName_initializers, void 0));
            this.disposalMethodsOffered = (__runInitializers(this, _vendorName_extraInitializers), __runInitializers(this, _disposalMethodsOffered_initializers, void 0));
            this.certifications = (__runInitializers(this, _disposalMethodsOffered_extraInitializers), __runInitializers(this, _certifications_initializers, void 0));
            this.isCertified = (__runInitializers(this, _certifications_extraInitializers), __runInitializers(this, _isCertified_initializers, void 0));
            this.environmentalCompliance = (__runInitializers(this, _isCertified_extraInitializers), __runInitializers(this, _environmentalCompliance_initializers, void 0));
            this.contactName = (__runInitializers(this, _environmentalCompliance_extraInitializers), __runInitializers(this, _contactName_initializers, void 0));
            this.contactEmail = (__runInitializers(this, _contactName_extraInitializers), __runInitializers(this, _contactEmail_initializers, void 0));
            this.contactPhone = (__runInitializers(this, _contactEmail_extraInitializers), __runInitializers(this, _contactPhone_initializers, void 0));
            this.address = (__runInitializers(this, _contactPhone_extraInitializers), __runInitializers(this, _address_initializers, void 0));
            this.serviceAreas = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _serviceAreas_initializers, void 0));
            this.pricingStructure = (__runInitializers(this, _serviceAreas_extraInitializers), __runInitializers(this, _pricingStructure_initializers, void 0));
            this.performanceRating = (__runInitializers(this, _pricingStructure_extraInitializers), __runInitializers(this, _performanceRating_initializers, void 0));
            this.isActive = (__runInitializers(this, _performanceRating_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.notes = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DisposalVendor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _vendorCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _vendorName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _disposalMethodsOffered_decorators = [(0, swagger_1.ApiProperty)({ description: 'Disposal methods offered' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _certifications_decorators = [(0, swagger_1.ApiProperty)({ description: 'Certifications' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _isCertified_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is certified vendor' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }), sequelize_typescript_1.Index];
        _environmentalCompliance_decorators = [(0, swagger_1.ApiProperty)({ description: 'Environmental compliance' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _contactName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contact name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _contactEmail_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contact email' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _contactPhone_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contact phone' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _address_decorators = [(0, swagger_1.ApiProperty)({ description: 'Address' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _serviceAreas_decorators = [(0, swagger_1.ApiProperty)({ description: 'Service areas' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _pricingStructure_decorators = [(0, swagger_1.ApiProperty)({ description: 'Pricing structure' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _performanceRating_decorators = [(0, swagger_1.ApiProperty)({ description: 'Performance rating' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(3, 2) })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _vendorCode_decorators, { kind: "field", name: "vendorCode", static: false, private: false, access: { has: obj => "vendorCode" in obj, get: obj => obj.vendorCode, set: (obj, value) => { obj.vendorCode = value; } }, metadata: _metadata }, _vendorCode_initializers, _vendorCode_extraInitializers);
        __esDecorate(null, null, _vendorName_decorators, { kind: "field", name: "vendorName", static: false, private: false, access: { has: obj => "vendorName" in obj, get: obj => obj.vendorName, set: (obj, value) => { obj.vendorName = value; } }, metadata: _metadata }, _vendorName_initializers, _vendorName_extraInitializers);
        __esDecorate(null, null, _disposalMethodsOffered_decorators, { kind: "field", name: "disposalMethodsOffered", static: false, private: false, access: { has: obj => "disposalMethodsOffered" in obj, get: obj => obj.disposalMethodsOffered, set: (obj, value) => { obj.disposalMethodsOffered = value; } }, metadata: _metadata }, _disposalMethodsOffered_initializers, _disposalMethodsOffered_extraInitializers);
        __esDecorate(null, null, _certifications_decorators, { kind: "field", name: "certifications", static: false, private: false, access: { has: obj => "certifications" in obj, get: obj => obj.certifications, set: (obj, value) => { obj.certifications = value; } }, metadata: _metadata }, _certifications_initializers, _certifications_extraInitializers);
        __esDecorate(null, null, _isCertified_decorators, { kind: "field", name: "isCertified", static: false, private: false, access: { has: obj => "isCertified" in obj, get: obj => obj.isCertified, set: (obj, value) => { obj.isCertified = value; } }, metadata: _metadata }, _isCertified_initializers, _isCertified_extraInitializers);
        __esDecorate(null, null, _environmentalCompliance_decorators, { kind: "field", name: "environmentalCompliance", static: false, private: false, access: { has: obj => "environmentalCompliance" in obj, get: obj => obj.environmentalCompliance, set: (obj, value) => { obj.environmentalCompliance = value; } }, metadata: _metadata }, _environmentalCompliance_initializers, _environmentalCompliance_extraInitializers);
        __esDecorate(null, null, _contactName_decorators, { kind: "field", name: "contactName", static: false, private: false, access: { has: obj => "contactName" in obj, get: obj => obj.contactName, set: (obj, value) => { obj.contactName = value; } }, metadata: _metadata }, _contactName_initializers, _contactName_extraInitializers);
        __esDecorate(null, null, _contactEmail_decorators, { kind: "field", name: "contactEmail", static: false, private: false, access: { has: obj => "contactEmail" in obj, get: obj => obj.contactEmail, set: (obj, value) => { obj.contactEmail = value; } }, metadata: _metadata }, _contactEmail_initializers, _contactEmail_extraInitializers);
        __esDecorate(null, null, _contactPhone_decorators, { kind: "field", name: "contactPhone", static: false, private: false, access: { has: obj => "contactPhone" in obj, get: obj => obj.contactPhone, set: (obj, value) => { obj.contactPhone = value; } }, metadata: _metadata }, _contactPhone_initializers, _contactPhone_extraInitializers);
        __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
        __esDecorate(null, null, _serviceAreas_decorators, { kind: "field", name: "serviceAreas", static: false, private: false, access: { has: obj => "serviceAreas" in obj, get: obj => obj.serviceAreas, set: (obj, value) => { obj.serviceAreas = value; } }, metadata: _metadata }, _serviceAreas_initializers, _serviceAreas_extraInitializers);
        __esDecorate(null, null, _pricingStructure_decorators, { kind: "field", name: "pricingStructure", static: false, private: false, access: { has: obj => "pricingStructure" in obj, get: obj => obj.pricingStructure, set: (obj, value) => { obj.pricingStructure = value; } }, metadata: _metadata }, _pricingStructure_initializers, _pricingStructure_extraInitializers);
        __esDecorate(null, null, _performanceRating_decorators, { kind: "field", name: "performanceRating", static: false, private: false, access: { has: obj => "performanceRating" in obj, get: obj => obj.performanceRating, set: (obj, value) => { obj.performanceRating = value; } }, metadata: _metadata }, _performanceRating_initializers, _performanceRating_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DisposalVendor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DisposalVendor = _classThis;
})();
exports.DisposalVendor = DisposalVendor;
/**
 * Certificate of Destruction Model
 */
let CertificateOfDestruction = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'certificates_of_destruction',
            timestamps: true,
            indexes: [
                { fields: ['certificate_number'], unique: true },
                { fields: ['disposal_request_id'] },
                { fields: ['issued_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _certificateNumber_decorators;
    let _certificateNumber_initializers = [];
    let _certificateNumber_extraInitializers = [];
    let _disposalRequestId_decorators;
    let _disposalRequestId_initializers = [];
    let _disposalRequestId_extraInitializers = [];
    let _issuedBy_decorators;
    let _issuedBy_initializers = [];
    let _issuedBy_extraInitializers = [];
    let _issuedDate_decorators;
    let _issuedDate_initializers = [];
    let _issuedDate_extraInitializers = [];
    let _destructionMethod_decorators;
    let _destructionMethod_initializers = [];
    let _destructionMethod_extraInitializers = [];
    let _destructionDate_decorators;
    let _destructionDate_initializers = [];
    let _destructionDate_extraInitializers = [];
    let _destructionLocation_decorators;
    let _destructionLocation_initializers = [];
    let _destructionLocation_extraInitializers = [];
    let _witnessList_decorators;
    let _witnessList_initializers = [];
    let _witnessList_extraInitializers = [];
    let _photographicEvidence_decorators;
    let _photographicEvidence_initializers = [];
    let _photographicEvidence_extraInitializers = [];
    let _videoEvidence_decorators;
    let _videoEvidence_initializers = [];
    let _videoEvidence_extraInitializers = [];
    let _certificationStandard_decorators;
    let _certificationStandard_initializers = [];
    let _certificationStandard_extraInitializers = [];
    let _complianceVerification_decorators;
    let _complianceVerification_initializers = [];
    let _complianceVerification_extraInitializers = [];
    let _digitalSignature_decorators;
    let _digitalSignature_initializers = [];
    let _digitalSignature_extraInitializers = [];
    let _certificateDocumentUrl_decorators;
    let _certificateDocumentUrl_initializers = [];
    let _certificateDocumentUrl_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _disposalRequest_decorators;
    let _disposalRequest_initializers = [];
    let _disposalRequest_extraInitializers = [];
    var CertificateOfDestruction = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.certificateNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _certificateNumber_initializers, void 0));
            this.disposalRequestId = (__runInitializers(this, _certificateNumber_extraInitializers), __runInitializers(this, _disposalRequestId_initializers, void 0));
            this.issuedBy = (__runInitializers(this, _disposalRequestId_extraInitializers), __runInitializers(this, _issuedBy_initializers, void 0));
            this.issuedDate = (__runInitializers(this, _issuedBy_extraInitializers), __runInitializers(this, _issuedDate_initializers, void 0));
            this.destructionMethod = (__runInitializers(this, _issuedDate_extraInitializers), __runInitializers(this, _destructionMethod_initializers, void 0));
            this.destructionDate = (__runInitializers(this, _destructionMethod_extraInitializers), __runInitializers(this, _destructionDate_initializers, void 0));
            this.destructionLocation = (__runInitializers(this, _destructionDate_extraInitializers), __runInitializers(this, _destructionLocation_initializers, void 0));
            this.witnessList = (__runInitializers(this, _destructionLocation_extraInitializers), __runInitializers(this, _witnessList_initializers, void 0));
            this.photographicEvidence = (__runInitializers(this, _witnessList_extraInitializers), __runInitializers(this, _photographicEvidence_initializers, void 0));
            this.videoEvidence = (__runInitializers(this, _photographicEvidence_extraInitializers), __runInitializers(this, _videoEvidence_initializers, void 0));
            this.certificationStandard = (__runInitializers(this, _videoEvidence_extraInitializers), __runInitializers(this, _certificationStandard_initializers, void 0));
            this.complianceVerification = (__runInitializers(this, _certificationStandard_extraInitializers), __runInitializers(this, _complianceVerification_initializers, void 0));
            this.digitalSignature = (__runInitializers(this, _complianceVerification_extraInitializers), __runInitializers(this, _digitalSignature_initializers, void 0));
            this.certificateDocumentUrl = (__runInitializers(this, _digitalSignature_extraInitializers), __runInitializers(this, _certificateDocumentUrl_initializers, void 0));
            this.notes = (__runInitializers(this, _certificateDocumentUrl_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.disposalRequest = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _disposalRequest_initializers, void 0));
            __runInitializers(this, _disposalRequest_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CertificateOfDestruction");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _certificateNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Certificate number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _disposalRequestId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Disposal request ID' }), (0, sequelize_typescript_1.ForeignKey)(() => DisposalRequest), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _issuedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Issued by' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _issuedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Issued date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _destructionMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Destruction method' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _destructionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Destruction date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _destructionLocation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Destruction location' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _witnessList_decorators = [(0, swagger_1.ApiProperty)({ description: 'Witness list' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _photographicEvidence_decorators = [(0, swagger_1.ApiProperty)({ description: 'Photographic evidence URLs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _videoEvidence_decorators = [(0, swagger_1.ApiProperty)({ description: 'Video evidence URLs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _certificationStandard_decorators = [(0, swagger_1.ApiProperty)({ description: 'Certification standard' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _complianceVerification_decorators = [(0, swagger_1.ApiProperty)({ description: 'Compliance verification' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _digitalSignature_decorators = [(0, swagger_1.ApiProperty)({ description: 'Digital signature' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _certificateDocumentUrl_decorators = [(0, swagger_1.ApiProperty)({ description: 'Certificate document URL' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _disposalRequest_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => DisposalRequest)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _certificateNumber_decorators, { kind: "field", name: "certificateNumber", static: false, private: false, access: { has: obj => "certificateNumber" in obj, get: obj => obj.certificateNumber, set: (obj, value) => { obj.certificateNumber = value; } }, metadata: _metadata }, _certificateNumber_initializers, _certificateNumber_extraInitializers);
        __esDecorate(null, null, _disposalRequestId_decorators, { kind: "field", name: "disposalRequestId", static: false, private: false, access: { has: obj => "disposalRequestId" in obj, get: obj => obj.disposalRequestId, set: (obj, value) => { obj.disposalRequestId = value; } }, metadata: _metadata }, _disposalRequestId_initializers, _disposalRequestId_extraInitializers);
        __esDecorate(null, null, _issuedBy_decorators, { kind: "field", name: "issuedBy", static: false, private: false, access: { has: obj => "issuedBy" in obj, get: obj => obj.issuedBy, set: (obj, value) => { obj.issuedBy = value; } }, metadata: _metadata }, _issuedBy_initializers, _issuedBy_extraInitializers);
        __esDecorate(null, null, _issuedDate_decorators, { kind: "field", name: "issuedDate", static: false, private: false, access: { has: obj => "issuedDate" in obj, get: obj => obj.issuedDate, set: (obj, value) => { obj.issuedDate = value; } }, metadata: _metadata }, _issuedDate_initializers, _issuedDate_extraInitializers);
        __esDecorate(null, null, _destructionMethod_decorators, { kind: "field", name: "destructionMethod", static: false, private: false, access: { has: obj => "destructionMethod" in obj, get: obj => obj.destructionMethod, set: (obj, value) => { obj.destructionMethod = value; } }, metadata: _metadata }, _destructionMethod_initializers, _destructionMethod_extraInitializers);
        __esDecorate(null, null, _destructionDate_decorators, { kind: "field", name: "destructionDate", static: false, private: false, access: { has: obj => "destructionDate" in obj, get: obj => obj.destructionDate, set: (obj, value) => { obj.destructionDate = value; } }, metadata: _metadata }, _destructionDate_initializers, _destructionDate_extraInitializers);
        __esDecorate(null, null, _destructionLocation_decorators, { kind: "field", name: "destructionLocation", static: false, private: false, access: { has: obj => "destructionLocation" in obj, get: obj => obj.destructionLocation, set: (obj, value) => { obj.destructionLocation = value; } }, metadata: _metadata }, _destructionLocation_initializers, _destructionLocation_extraInitializers);
        __esDecorate(null, null, _witnessList_decorators, { kind: "field", name: "witnessList", static: false, private: false, access: { has: obj => "witnessList" in obj, get: obj => obj.witnessList, set: (obj, value) => { obj.witnessList = value; } }, metadata: _metadata }, _witnessList_initializers, _witnessList_extraInitializers);
        __esDecorate(null, null, _photographicEvidence_decorators, { kind: "field", name: "photographicEvidence", static: false, private: false, access: { has: obj => "photographicEvidence" in obj, get: obj => obj.photographicEvidence, set: (obj, value) => { obj.photographicEvidence = value; } }, metadata: _metadata }, _photographicEvidence_initializers, _photographicEvidence_extraInitializers);
        __esDecorate(null, null, _videoEvidence_decorators, { kind: "field", name: "videoEvidence", static: false, private: false, access: { has: obj => "videoEvidence" in obj, get: obj => obj.videoEvidence, set: (obj, value) => { obj.videoEvidence = value; } }, metadata: _metadata }, _videoEvidence_initializers, _videoEvidence_extraInitializers);
        __esDecorate(null, null, _certificationStandard_decorators, { kind: "field", name: "certificationStandard", static: false, private: false, access: { has: obj => "certificationStandard" in obj, get: obj => obj.certificationStandard, set: (obj, value) => { obj.certificationStandard = value; } }, metadata: _metadata }, _certificationStandard_initializers, _certificationStandard_extraInitializers);
        __esDecorate(null, null, _complianceVerification_decorators, { kind: "field", name: "complianceVerification", static: false, private: false, access: { has: obj => "complianceVerification" in obj, get: obj => obj.complianceVerification, set: (obj, value) => { obj.complianceVerification = value; } }, metadata: _metadata }, _complianceVerification_initializers, _complianceVerification_extraInitializers);
        __esDecorate(null, null, _digitalSignature_decorators, { kind: "field", name: "digitalSignature", static: false, private: false, access: { has: obj => "digitalSignature" in obj, get: obj => obj.digitalSignature, set: (obj, value) => { obj.digitalSignature = value; } }, metadata: _metadata }, _digitalSignature_initializers, _digitalSignature_extraInitializers);
        __esDecorate(null, null, _certificateDocumentUrl_decorators, { kind: "field", name: "certificateDocumentUrl", static: false, private: false, access: { has: obj => "certificateDocumentUrl" in obj, get: obj => obj.certificateDocumentUrl, set: (obj, value) => { obj.certificateDocumentUrl = value; } }, metadata: _metadata }, _certificateDocumentUrl_initializers, _certificateDocumentUrl_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _disposalRequest_decorators, { kind: "field", name: "disposalRequest", static: false, private: false, access: { has: obj => "disposalRequest" in obj, get: obj => obj.disposalRequest, set: (obj, value) => { obj.disposalRequest = value; } }, metadata: _metadata }, _disposalRequest_initializers, _disposalRequest_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CertificateOfDestruction = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CertificateOfDestruction = _classThis;
})();
exports.CertificateOfDestruction = CertificateOfDestruction;
/**
 * Disposal Audit Log Model
 */
let DisposalAuditLog = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'disposal_audit_logs',
            timestamps: true,
            indexes: [
                { fields: ['disposal_request_id'] },
                { fields: ['action_type'] },
                { fields: ['performed_by'] },
                { fields: ['action_timestamp'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _disposalRequestId_decorators;
    let _disposalRequestId_initializers = [];
    let _disposalRequestId_extraInitializers = [];
    let _actionType_decorators;
    let _actionType_initializers = [];
    let _actionType_extraInitializers = [];
    let _actionDescription_decorators;
    let _actionDescription_initializers = [];
    let _actionDescription_extraInitializers = [];
    let _performedBy_decorators;
    let _performedBy_initializers = [];
    let _performedBy_extraInitializers = [];
    let _actionTimestamp_decorators;
    let _actionTimestamp_initializers = [];
    let _actionTimestamp_extraInitializers = [];
    let _previousState_decorators;
    let _previousState_initializers = [];
    let _previousState_extraInitializers = [];
    let _newState_decorators;
    let _newState_initializers = [];
    let _newState_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _userAgent_decorators;
    let _userAgent_initializers = [];
    let _userAgent_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _disposalRequest_decorators;
    let _disposalRequest_initializers = [];
    let _disposalRequest_extraInitializers = [];
    var DisposalAuditLog = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.disposalRequestId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _disposalRequestId_initializers, void 0));
            this.actionType = (__runInitializers(this, _disposalRequestId_extraInitializers), __runInitializers(this, _actionType_initializers, void 0));
            this.actionDescription = (__runInitializers(this, _actionType_extraInitializers), __runInitializers(this, _actionDescription_initializers, void 0));
            this.performedBy = (__runInitializers(this, _actionDescription_extraInitializers), __runInitializers(this, _performedBy_initializers, void 0));
            this.actionTimestamp = (__runInitializers(this, _performedBy_extraInitializers), __runInitializers(this, _actionTimestamp_initializers, void 0));
            this.previousState = (__runInitializers(this, _actionTimestamp_extraInitializers), __runInitializers(this, _previousState_initializers, void 0));
            this.newState = (__runInitializers(this, _previousState_extraInitializers), __runInitializers(this, _newState_initializers, void 0));
            this.ipAddress = (__runInitializers(this, _newState_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
            this.userAgent = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _userAgent_initializers, void 0));
            this.createdAt = (__runInitializers(this, _userAgent_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.disposalRequest = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _disposalRequest_initializers, void 0));
            __runInitializers(this, _disposalRequest_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DisposalAuditLog");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _disposalRequestId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Disposal request ID' }), (0, sequelize_typescript_1.ForeignKey)(() => DisposalRequest), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _actionType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }), sequelize_typescript_1.Index];
        _actionDescription_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _performedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Performed by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _actionTimestamp_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action timestamp' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _previousState_decorators = [(0, swagger_1.ApiProperty)({ description: 'Previous state' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _newState_decorators = [(0, swagger_1.ApiProperty)({ description: 'New state' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _ipAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'IP address' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _userAgent_decorators = [(0, swagger_1.ApiProperty)({ description: 'User agent' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _disposalRequest_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => DisposalRequest)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _disposalRequestId_decorators, { kind: "field", name: "disposalRequestId", static: false, private: false, access: { has: obj => "disposalRequestId" in obj, get: obj => obj.disposalRequestId, set: (obj, value) => { obj.disposalRequestId = value; } }, metadata: _metadata }, _disposalRequestId_initializers, _disposalRequestId_extraInitializers);
        __esDecorate(null, null, _actionType_decorators, { kind: "field", name: "actionType", static: false, private: false, access: { has: obj => "actionType" in obj, get: obj => obj.actionType, set: (obj, value) => { obj.actionType = value; } }, metadata: _metadata }, _actionType_initializers, _actionType_extraInitializers);
        __esDecorate(null, null, _actionDescription_decorators, { kind: "field", name: "actionDescription", static: false, private: false, access: { has: obj => "actionDescription" in obj, get: obj => obj.actionDescription, set: (obj, value) => { obj.actionDescription = value; } }, metadata: _metadata }, _actionDescription_initializers, _actionDescription_extraInitializers);
        __esDecorate(null, null, _performedBy_decorators, { kind: "field", name: "performedBy", static: false, private: false, access: { has: obj => "performedBy" in obj, get: obj => obj.performedBy, set: (obj, value) => { obj.performedBy = value; } }, metadata: _metadata }, _performedBy_initializers, _performedBy_extraInitializers);
        __esDecorate(null, null, _actionTimestamp_decorators, { kind: "field", name: "actionTimestamp", static: false, private: false, access: { has: obj => "actionTimestamp" in obj, get: obj => obj.actionTimestamp, set: (obj, value) => { obj.actionTimestamp = value; } }, metadata: _metadata }, _actionTimestamp_initializers, _actionTimestamp_extraInitializers);
        __esDecorate(null, null, _previousState_decorators, { kind: "field", name: "previousState", static: false, private: false, access: { has: obj => "previousState" in obj, get: obj => obj.previousState, set: (obj, value) => { obj.previousState = value; } }, metadata: _metadata }, _previousState_initializers, _previousState_extraInitializers);
        __esDecorate(null, null, _newState_decorators, { kind: "field", name: "newState", static: false, private: false, access: { has: obj => "newState" in obj, get: obj => obj.newState, set: (obj, value) => { obj.newState = value; } }, metadata: _metadata }, _newState_initializers, _newState_extraInitializers);
        __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
        __esDecorate(null, null, _userAgent_decorators, { kind: "field", name: "userAgent", static: false, private: false, access: { has: obj => "userAgent" in obj, get: obj => obj.userAgent, set: (obj, value) => { obj.userAgent = value; } }, metadata: _metadata }, _userAgent_initializers, _userAgent_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _disposalRequest_decorators, { kind: "field", name: "disposalRequest", static: false, private: false, access: { has: obj => "disposalRequest" in obj, get: obj => obj.disposalRequest, set: (obj, value) => { obj.disposalRequest = value; } }, metadata: _metadata }, _disposalRequest_initializers, _disposalRequest_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DisposalAuditLog = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DisposalAuditLog = _classThis;
})();
exports.DisposalAuditLog = DisposalAuditLog;
// ============================================================================
// DISPOSAL REQUEST MANAGEMENT
// ============================================================================
/**
 * Initiates a new asset disposal request
 *
 * @param data - Disposal request data
 * @param transaction - Optional database transaction
 * @returns Created disposal request
 *
 * @example
 * ```typescript
 * const disposal = await initiateAssetDisposal({
 *   assetId: 'asset-123',
 *   disposalMethod: DisposalMethod.SALE,
 *   reason: 'Equipment upgrade, existing unit fully functional',
 *   requestedBy: 'user-001',
 *   estimatedValue: 15000,
 *   targetDisposalDate: new Date('2024-06-30')
 * });
 * ```
 */
async function initiateAssetDisposal(data, transaction) {
    // Validate asset exists (would check against Asset model)
    // In production, verify asset is not already in disposal process
    // Generate unique request number
    const requestNumber = await generateDisposalRequestNumber();
    const disposal = await DisposalRequest.create({
        requestNumber,
        assetId: data.assetId,
        disposalMethod: data.disposalMethod,
        reason: data.reason,
        requestedBy: data.requestedBy,
        requestDate: new Date(),
        estimatedValue: data.estimatedValue,
        targetDisposalDate: data.targetDisposalDate,
        disposalVendorId: data.disposalVendorId,
        requiresDataSanitization: data.requiresDataSanitization || false,
        sanitizationLevel: data.sanitizationLevel,
        environmentalClassification: data.environmentalClassification,
        notes: data.notes,
        attachments: data.attachments,
        status: DisposalStatus.DRAFT,
    }, { transaction });
    // Create audit log
    await createDisposalAuditLog({
        disposalRequestId: disposal.id,
        actionType: 'DISPOSAL_INITIATED',
        actionDescription: `Disposal request initiated for asset ${data.assetId}`,
        performedBy: data.requestedBy,
        actionTimestamp: new Date(),
        newState: disposal.toJSON(),
    }, transaction);
    return disposal;
}
/**
 * Generates unique disposal request number
 *
 * @returns Disposal request number
 *
 * @example
 * ```typescript
 * const requestNumber = await generateDisposalRequestNumber();
 * // Returns: "DISP-2024-001234"
 * ```
 */
async function generateDisposalRequestNumber() {
    const year = new Date().getFullYear();
    const count = await DisposalRequest.count({
        where: {
            createdAt: {
                [sequelize_1.Op.gte]: new Date(`${year}-01-01`),
            },
        },
    });
    return `DISP-${year}-${String(count + 1).padStart(6, '0')}`;
}
/**
 * Updates disposal request status
 *
 * @param requestId - Disposal request ID
 * @param status - New status
 * @param updatedBy - User ID performing update
 * @param notes - Optional notes
 * @param transaction - Optional database transaction
 * @returns Updated disposal request
 *
 * @example
 * ```typescript
 * await updateDisposalStatus(
 *   'disposal-123',
 *   DisposalStatus.PENDING_APPROVAL,
 *   'user-001',
 *   'Ready for management review'
 * );
 * ```
 */
async function updateDisposalStatus(requestId, status, updatedBy, notes, transaction) {
    const disposal = await DisposalRequest.findByPk(requestId, { transaction });
    if (!disposal) {
        throw new common_1.NotFoundException(`Disposal request ${requestId} not found`);
    }
    const previousState = disposal.toJSON();
    const oldStatus = disposal.status;
    await disposal.update({
        status,
        notes: notes ? `${disposal.notes || ''}\n[${new Date().toISOString()}] ${notes}` : disposal.notes,
    }, { transaction });
    // Create audit log
    await createDisposalAuditLog({
        disposalRequestId: requestId,
        actionType: 'STATUS_CHANGED',
        actionDescription: `Status changed from ${oldStatus} to ${status}`,
        performedBy: updatedBy,
        actionTimestamp: new Date(),
        previousState,
        newState: disposal.toJSON(),
    }, transaction);
    return disposal;
}
/**
 * Submits disposal request for approval
 *
 * @param requestId - Disposal request ID
 * @param submittedBy - User ID submitting request
 * @param transaction - Optional database transaction
 * @returns Updated disposal request
 *
 * @example
 * ```typescript
 * await submitDisposalForApproval('disposal-123', 'user-001');
 * ```
 */
async function submitDisposalForApproval(requestId, submittedBy, transaction) {
    const disposal = await DisposalRequest.findByPk(requestId, { transaction });
    if (!disposal) {
        throw new common_1.NotFoundException(`Disposal request ${requestId} not found`);
    }
    if (disposal.status !== DisposalStatus.DRAFT) {
        throw new common_1.BadRequestException('Only draft requests can be submitted for approval');
    }
    // Create approval records based on approval hierarchy
    const approvalLevels = await getRequiredApprovalLevels(disposal);
    for (const level of approvalLevels) {
        await DisposalApproval.create({
            disposalRequestId: requestId,
            approverId: level.approverId,
            approvalLevel: level.level,
            status: ApprovalStatus.PENDING,
        }, { transaction });
    }
    return updateDisposalStatus(requestId, DisposalStatus.PENDING_APPROVAL, submittedBy, 'Submitted for approval', transaction);
}
/**
 * Gets required approval levels for disposal request
 *
 * @param disposal - Disposal request
 * @returns Array of approval level requirements
 *
 * @example
 * ```typescript
 * const levels = await getRequiredApprovalLevels(disposalRequest);
 * ```
 */
async function getRequiredApprovalLevels(disposal) {
    const levels = [];
    // Level 1: Department Manager (always required)
    levels.push({
        level: 1,
        approverId: 'dept-manager-id', // Would be determined from asset's department
        roleName: 'Department Manager',
    });
    // Level 2: Asset Manager (for values > $5,000)
    if ((disposal.estimatedValue || 0) > 5000) {
        levels.push({
            level: 2,
            approverId: 'asset-manager-id',
            roleName: 'Asset Manager',
        });
    }
    // Level 3: CFO (for values > $25,000)
    if ((disposal.estimatedValue || 0) > 25000) {
        levels.push({
            level: 3,
            approverId: 'cfo-id',
            roleName: 'CFO',
        });
    }
    // Level 4: Environmental Officer (for hazardous materials)
    if (disposal.environmentalClassification &&
        disposal.environmentalClassification !== EnvironmentalClassification.NON_HAZARDOUS) {
        levels.push({
            level: 4,
            approverId: 'env-officer-id',
            roleName: 'Environmental Officer',
        });
    }
    return levels;
}
/**
 * Processes disposal approval decision
 *
 * @param data - Approval data
 * @param transaction - Optional database transaction
 * @returns Updated approval record
 *
 * @example
 * ```typescript
 * await processDisposalApproval({
 *   disposalRequestId: 'disposal-123',
 *   approverId: 'user-mgr-001',
 *   decision: ApprovalStatus.APPROVED,
 *   comments: 'Approved for disposal via certified vendor',
 *   approvalDate: new Date()
 * });
 * ```
 */
async function processDisposalApproval(data, transaction) {
    // Find the pending approval for this approver
    const approval = await DisposalApproval.findOne({
        where: {
            disposalRequestId: data.disposalRequestId,
            approverId: data.approverId,
            status: ApprovalStatus.PENDING,
        },
        transaction,
    });
    if (!approval) {
        throw new common_1.NotFoundException('Pending approval not found for this approver');
    }
    const previousState = approval.toJSON();
    await approval.update({
        status: data.decision,
        approvalDate: data.approvalDate,
        comments: data.comments,
        conditions: data.conditions,
        notified: false,
    }, { transaction });
    // Check if all approvals are complete
    const allApprovals = await DisposalApproval.findAll({
        where: { disposalRequestId: data.disposalRequestId },
        transaction,
    });
    const allApproved = allApprovals.every((a) => a.status === ApprovalStatus.APPROVED);
    const anyRejected = allApprovals.some((a) => a.status === ApprovalStatus.REJECTED);
    const disposal = await DisposalRequest.findByPk(data.disposalRequestId, { transaction });
    if (allApproved) {
        await disposal?.update({
            status: DisposalStatus.APPROVED,
            approvedBy: data.approverId,
            approvalDate: data.approvalDate,
        }, { transaction });
    }
    else if (anyRejected) {
        await disposal?.update({
            status: DisposalStatus.REJECTED,
        }, { transaction });
    }
    // Create audit log
    await createDisposalAuditLog({
        disposalRequestId: data.disposalRequestId,
        actionType: 'APPROVAL_DECISION',
        actionDescription: `Approval ${data.decision} by ${data.approverId}`,
        performedBy: data.approverId,
        actionTimestamp: data.approvalDate,
        previousState,
        newState: approval.toJSON(),
    }, transaction);
    return approval;
}
/**
 * Gets disposal request with all approvals
 *
 * @param requestId - Disposal request ID
 * @returns Disposal request with approvals
 *
 * @example
 * ```typescript
 * const disposal = await getDisposalWithApprovals('disposal-123');
 * console.log(disposal.approvals);
 * ```
 */
async function getDisposalWithApprovals(requestId) {
    const disposal = await DisposalRequest.findByPk(requestId, {
        include: [
            {
                model: DisposalApproval,
                as: 'approvals',
            },
        ],
    });
    if (!disposal) {
        throw new common_1.NotFoundException(`Disposal request ${requestId} not found`);
    }
    return disposal;
}
// ============================================================================
// SALVAGE VALUE CALCULATION
// ============================================================================
/**
 * Calculates salvage value for asset
 *
 * @param assetId - Asset ID
 * @param params - Calculation parameters
 * @param transaction - Optional database transaction
 * @returns Salvage value calculation result
 *
 * @example
 * ```typescript
 * const salvage = await calculateSalvageValue('asset-123', {
 *   marketConditions: 'good',
 *   assetCondition: 'fair',
 *   demandLevel: 'medium',
 *   urgency: 'normal',
 *   includeShippingCost: true,
 *   includeRestorationCost: true
 * });
 * ```
 */
async function calculateSalvageValue(assetId, params = {}, transaction) {
    // In production, would fetch actual asset data
    const asset = {
        id: assetId,
        originalCost: 100000,
        currentBookValue: 45000,
        acquisitionDate: new Date('2020-01-01'),
        assetType: 'medical-equipment',
        manufacturer: 'GE Healthcare',
        model: 'MRI-3000',
    };
    const { marketConditions = 'fair', assetCondition = 'good', demandLevel = 'medium', urgency = 'normal', includeShippingCost = true, includeRestorationCost = true, } = params;
    // Base salvage value starts with current book value
    let salvageValue = asset.currentBookValue;
    // Market conditions factor
    const marketFactors = {
        excellent: 1.2,
        good: 1.0,
        fair: 0.8,
        poor: 0.6,
    };
    salvageValue *= marketFactors[marketConditions];
    // Asset condition factor
    const conditionFactors = {
        excellent: 1.0,
        good: 0.85,
        fair: 0.65,
        poor: 0.4,
    };
    salvageValue *= conditionFactors[assetCondition];
    // Demand level factor
    const demandFactors = {
        high: 1.3,
        medium: 1.0,
        low: 0.7,
    };
    salvageValue *= demandFactors[demandLevel];
    // Urgency factor
    const urgencyFactors = {
        immediate: 0.7,
        normal: 1.0,
        flexible: 1.1,
    };
    salvageValue *= urgencyFactors[urgency];
    // Calculate restoration cost
    const restorationCost = includeRestorationCost
        ? salvageValue * 0.1 // Assume 10% restoration cost
        : 0;
    // Calculate shipping cost
    const shippingCost = includeShippingCost
        ? asset.originalCost * 0.02 // Assume 2% of original cost
        : 0;
    // Estimated market value (before costs)
    const estimatedMarketValue = salvageValue;
    // Net salvage value after costs
    const netSalvageValue = Math.max(0, salvageValue - restorationCost - shippingCost);
    // Confidence level (0-100)
    const confidenceLevel = calculateConfidenceLevel({
        marketConditions,
        assetCondition,
        demandLevel,
        urgency,
    });
    return {
        assetId,
        originalCost: asset.originalCost,
        currentBookValue: asset.currentBookValue,
        estimatedMarketValue,
        salvageValue,
        restorationCost,
        shippingCost,
        netSalvageValue,
        calculationDate: new Date(),
        confidenceLevel,
        factors: {
            marketConditions,
            assetCondition,
            demandLevel,
            urgency,
            marketFactor: marketFactors[marketConditions],
            conditionFactor: conditionFactors[assetCondition],
            demandFactor: demandFactors[demandLevel],
            urgencyFactor: urgencyFactors[urgency],
        },
    };
}
/**
 * Calculates confidence level for salvage value estimate
 *
 * @param factors - Calculation factors
 * @returns Confidence level (0-100)
 */
function calculateConfidenceLevel(factors) {
    let confidence = 70; // Base confidence
    // Adjust based on market conditions
    if (factors.marketConditions === 'excellent' || factors.marketConditions === 'good') {
        confidence += 10;
    }
    else if (factors.marketConditions === 'poor') {
        confidence -= 15;
    }
    // Adjust based on asset condition
    if (factors.assetCondition === 'excellent') {
        confidence += 10;
    }
    else if (factors.assetCondition === 'poor') {
        confidence -= 10;
    }
    // Adjust based on demand
    if (factors.demandLevel === 'high') {
        confidence += 10;
    }
    else if (factors.demandLevel === 'low') {
        confidence -= 10;
    }
    return Math.max(0, Math.min(100, confidence));
}
/**
 * Optimizes salvage value through market analysis
 *
 * @param assetId - Asset ID
 * @param targetRevenue - Target revenue amount
 * @returns Optimization recommendations
 *
 * @example
 * ```typescript
 * const optimization = await optimizeSalvageValue('asset-123', 50000);
 * ```
 */
async function optimizeSalvageValue(assetId, targetRevenue) {
    const currentEstimate = await calculateSalvageValue(assetId, {
        marketConditions: 'fair',
        assetCondition: 'good',
        demandLevel: 'medium',
        urgency: 'normal',
    });
    const recommendations = [
        {
            strategy: 'Immediate sale as-is',
            expectedValue: currentEstimate.netSalvageValue * 0.85,
            timeline: '1-2 weeks',
            riskLevel: 'low',
        },
        {
            strategy: 'Minor refurbishment + sale',
            expectedValue: currentEstimate.netSalvageValue * 1.15,
            timeline: '4-6 weeks',
            riskLevel: 'medium',
        },
        {
            strategy: 'Full refurbishment + auction',
            expectedValue: currentEstimate.netSalvageValue * 1.35,
            timeline: '8-12 weeks',
            riskLevel: 'high',
        },
        {
            strategy: 'Part out components',
            expectedValue: currentEstimate.netSalvageValue * 1.2,
            timeline: '12-16 weeks',
            riskLevel: 'medium',
        },
    ];
    // Determine optimal strategy based on target revenue
    let optimalStrategy = recommendations[0].strategy;
    if (targetRevenue) {
        const viableOptions = recommendations.filter((r) => r.expectedValue >= targetRevenue);
        if (viableOptions.length > 0) {
            // Choose option with lowest risk among viable options
            optimalStrategy = viableOptions.sort((a, b) => {
                const riskOrder = { low: 1, medium: 2, high: 3 };
                return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
            })[0].strategy;
        }
        else {
            // If no option meets target, choose highest value
            optimalStrategy = recommendations.sort((a, b) => b.expectedValue - a.expectedValue)[0].strategy;
        }
    }
    return {
        currentEstimate,
        recommendations,
        optimalStrategy,
    };
}
/**
 * Compares disposal methods by financial impact
 *
 * @param assetId - Asset ID
 * @returns Comparison of disposal methods
 *
 * @example
 * ```typescript
 * const comparison = await compareDisposalMethods('asset-123');
 * ```
 */
async function compareDisposalMethods(assetId) {
    const salvage = await calculateSalvageValue(assetId);
    return [
        {
            method: DisposalMethod.SALE,
            estimatedRevenue: salvage.netSalvageValue,
            estimatedCost: salvage.shippingCost + salvage.restorationCost,
            netValue: salvage.netSalvageValue,
            timeline: '4-8 weeks',
            complexity: 'medium',
        },
        {
            method: DisposalMethod.TRADE_IN,
            estimatedRevenue: salvage.netSalvageValue * 0.85,
            estimatedCost: 0,
            netValue: salvage.netSalvageValue * 0.85,
            timeline: '1-2 weeks',
            complexity: 'low',
        },
        {
            method: DisposalMethod.DONATION,
            estimatedRevenue: salvage.currentBookValue * 0.3, // Tax deduction
            estimatedCost: salvage.shippingCost,
            netValue: salvage.currentBookValue * 0.3 - salvage.shippingCost,
            timeline: '2-4 weeks',
            complexity: 'medium',
        },
        {
            method: DisposalMethod.SCRAP,
            estimatedRevenue: salvage.salvageValue * 0.1,
            estimatedCost: 500,
            netValue: salvage.salvageValue * 0.1 - 500,
            timeline: '1 week',
            complexity: 'low',
        },
        {
            method: DisposalMethod.RECYCLE,
            estimatedRevenue: 0,
            estimatedCost: 1000,
            netValue: -1000,
            timeline: '2 weeks',
            complexity: 'low',
        },
    ];
}
// ============================================================================
// ENVIRONMENTAL COMPLIANCE AND DISPOSAL REQUIREMENTS
// ============================================================================
/**
 * Determines environmental requirements for asset disposal
 *
 * @param assetId - Asset ID
 * @param disposalMethod - Disposal method
 * @returns Environmental requirements
 *
 * @example
 * ```typescript
 * const requirements = await getEnvironmentalRequirements(
 *   'asset-123',
 *   DisposalMethod.RECYCLE
 * );
 * ```
 */
async function getEnvironmentalRequirements(assetId, disposalMethod) {
    // In production, would fetch actual asset environmental data
    const asset = {
        id: assetId,
        assetType: 'electronic-equipment',
        containsHazardousMaterials: true,
        materials: ['lead', 'mercury', 'lithium-batteries'],
    };
    let classification;
    let requiresPermit = false;
    let certifiedVendorRequired = false;
    let manifestRequired = false;
    if (asset.containsHazardousMaterials) {
        if (asset.assetType === 'electronic-equipment') {
            classification = EnvironmentalClassification.ELECTRONIC_WASTE;
            certifiedVendorRequired = true;
            manifestRequired = true;
        }
        else {
            classification = EnvironmentalClassification.HAZARDOUS;
            requiresPermit = true;
            certifiedVendorRequired = true;
            manifestRequired = true;
        }
    }
    else {
        classification = EnvironmentalClassification.NON_HAZARDOUS;
    }
    const regulatoryCompliance = [];
    if (classification === EnvironmentalClassification.ELECTRONIC_WASTE) {
        regulatoryCompliance.push('WEEE Directive', 'RoHS Compliance', 'EPA R2 Standard');
    }
    if (classification === EnvironmentalClassification.HAZARDOUS) {
        regulatoryCompliance.push('RCRA', 'EPA TSCA', 'DOT Hazardous Materials');
    }
    return {
        classification,
        requiresPermit,
        permitNumbers: requiresPermit ? ['EPA-2024-12345'] : undefined,
        handlingInstructions: generateHandlingInstructions(classification, disposalMethod),
        regulatoryCompliance,
        certifiedVendorRequired,
        manifestRequired,
        disposalFacilityType: getRequiredFacilityType(classification, disposalMethod),
        transportationRequirements: getTransportationRequirements(classification),
    };
}
/**
 * Generates handling instructions based on classification
 */
function generateHandlingInstructions(classification, method) {
    const instructions = [];
    switch (classification) {
        case EnvironmentalClassification.ELECTRONIC_WASTE:
            instructions.push('Remove and segregate batteries', 'Drain all fluids', 'Label all hazardous components', 'Use anti-static packaging', 'Transport in enclosed vehicle');
            break;
        case EnvironmentalClassification.HAZARDOUS:
            instructions.push('Use appropriate PPE during handling', 'Maintain chain of custody documentation', 'Store in approved containment', 'Transport with certified hazmat carrier', 'Obtain signed manifests');
            break;
        default:
            instructions.push('Standard handling procedures apply', 'Ensure proper packaging for transport');
    }
    return instructions.join('\n');
}
/**
 * Gets required facility type for disposal
 */
function getRequiredFacilityType(classification, method) {
    if (classification === EnvironmentalClassification.HAZARDOUS) {
        return 'EPA-permitted hazardous waste facility';
    }
    if (classification === EnvironmentalClassification.ELECTRONIC_WASTE) {
        return 'R2 or e-Stewards certified e-waste recycler';
    }
    if (method === DisposalMethod.RECYCLE) {
        return 'Certified recycling facility';
    }
    return 'Standard disposal facility';
}
/**
 * Gets transportation requirements
 */
function getTransportationRequirements(classification) {
    if (classification === EnvironmentalClassification.HAZARDOUS ||
        classification === EnvironmentalClassification.ELECTRONIC_WASTE) {
        return 'DOT-certified hazardous materials transporter with proper placarding and documentation';
    }
    return 'Standard freight transportation';
}
/**
 * Validates disposal vendor compliance
 *
 * @param vendorId - Disposal vendor ID
 * @param requirements - Environmental requirements
 * @returns Compliance validation result
 *
 * @example
 * ```typescript
 * const validation = await validateVendorCompliance('vendor-123', requirements);
 * ```
 */
async function validateVendorCompliance(vendorId, requirements) {
    const vendor = await DisposalVendor.findByPk(vendorId);
    if (!vendor) {
        throw new common_1.NotFoundException(`Vendor ${vendorId} not found`);
    }
    const missingCertifications = [];
    const warnings = [];
    if (requirements.certifiedVendorRequired && !vendor.isCertified) {
        missingCertifications.push('Certified vendor status required');
    }
    const vendorCompliance = vendor.environmentalCompliance || [];
    requirements.regulatoryCompliance.forEach((req) => {
        if (!vendorCompliance.includes(req)) {
            missingCertifications.push(req);
        }
    });
    if (vendor.performanceRating && vendor.performanceRating < 3.5) {
        warnings.push('Vendor has below-average performance rating');
    }
    return {
        compliant: missingCertifications.length === 0,
        missingCertifications,
        warnings,
    };
}
// ============================================================================
// DATA SANITIZATION AND DESTRUCTION
// ============================================================================
/**
 * Processes data sanitization for asset
 *
 * @param requestId - Disposal request ID
 * @param sanitizationData - Sanitization details
 * @param transaction - Optional database transaction
 * @returns Updated disposal request
 *
 * @example
 * ```typescript
 * await processDataSanitization('disposal-123', {
 *   sanitizationLevel: DataSanitizationLevel.DOD_7_PASS,
 *   sanitizedBy: 'tech-001',
 *   sanitizationDate: new Date(),
 *   verificationMethod: 'Visual inspection and software verification',
 *   certificateUrl: 'https://storage/cert-123.pdf'
 * });
 * ```
 */
async function processDataSanitization(requestId, sanitizationData, transaction) {
    const disposal = await DisposalRequest.findByPk(requestId, { transaction });
    if (!disposal) {
        throw new common_1.NotFoundException(`Disposal request ${requestId} not found`);
    }
    if (!disposal.requiresDataSanitization) {
        throw new common_1.BadRequestException('Data sanitization not required for this disposal');
    }
    const previousState = disposal.toJSON();
    await disposal.update({
        sanitizationLevel: sanitizationData.sanitizationLevel,
        sanitizationCompleted: true,
        sanitizationDate: sanitizationData.sanitizationDate,
        sanitizedBy: sanitizationData.sanitizedBy,
        metadata: {
            ...disposal.metadata,
            sanitization: {
                verificationMethod: sanitizationData.verificationMethod,
                certificateUrl: sanitizationData.certificateUrl,
                notes: sanitizationData.notes,
            },
        },
    }, { transaction });
    // Create audit log
    await createDisposalAuditLog({
        disposalRequestId: requestId,
        actionType: 'DATA_SANITIZATION_COMPLETED',
        actionDescription: `Data sanitization completed using ${sanitizationData.sanitizationLevel}`,
        performedBy: sanitizationData.sanitizedBy,
        actionTimestamp: sanitizationData.sanitizationDate,
        previousState,
        newState: disposal.toJSON(),
    }, transaction);
    return disposal;
}
/**
 * Generates certificate of destruction
 *
 * @param data - Certificate data
 * @param transaction - Optional database transaction
 * @returns Created certificate
 *
 * @example
 * ```typescript
 * const certificate = await generateCertificateOfDestruction({
 *   disposalRequestId: 'disposal-123',
 *   certificateNumber: 'COD-2024-001234',
 *   issuedBy: 'Certified Disposal Vendor Inc.',
 *   issuedDate: new Date(),
 *   destructionMethod: 'Industrial shredding and smelting',
 *   destructionDate: new Date(),
 *   witnessList: ['John Doe', 'Jane Smith'],
 *   photographicEvidence: ['https://storage/photo1.jpg'],
 *   certificationStandard: 'NAID AAA Certification'
 * });
 * ```
 */
async function generateCertificateOfDestruction(data, transaction) {
    const disposal = await DisposalRequest.findByPk(data.disposalRequestId, { transaction });
    if (!disposal) {
        throw new common_1.NotFoundException(`Disposal request ${data.disposalRequestId} not found`);
    }
    const certificate = await CertificateOfDestruction.create({
        certificateNumber: data.certificateNumber,
        disposalRequestId: data.disposalRequestId,
        issuedBy: data.issuedBy,
        issuedDate: data.issuedDate,
        destructionMethod: data.destructionMethod,
        destructionDate: data.destructionDate,
        witnessList: data.witnessList,
        photographicEvidence: data.photographicEvidence,
        videoEvidence: data.videoEvidence,
        certificationStandard: data.certificationStandard,
    }, { transaction });
    // Update disposal request with certificate reference
    await disposal.update({
        certificateOfDestructionId: certificate.id,
    }, { transaction });
    return certificate;
}
/**
 * Validates destruction documentation
 *
 * @param certificateId - Certificate ID
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateDestructionDocumentation('cert-123');
 * ```
 */
async function validateDestructionDocumentation(certificateId) {
    const certificate = await CertificateOfDestruction.findByPk(certificateId);
    if (!certificate) {
        throw new common_1.NotFoundException(`Certificate ${certificateId} not found`);
    }
    const issues = [];
    const recommendations = [];
    if (!certificate.witnessList || certificate.witnessList.length === 0) {
        issues.push('No witnesses documented');
    }
    if (!certificate.photographicEvidence || certificate.photographicEvidence.length === 0) {
        issues.push('No photographic evidence provided');
    }
    if (!certificate.certificationStandard) {
        recommendations.push('Consider obtaining third-party certification');
    }
    if (!certificate.digitalSignature) {
        recommendations.push('Add digital signature for enhanced security');
    }
    const daysSinceDestruction = Math.floor((new Date().getTime() - certificate.destructionDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceDestruction > 90) {
        recommendations.push('Certificate is older than 90 days, consider archival');
    }
    return {
        valid: issues.length === 0,
        issues,
        recommendations,
    };
}
// ============================================================================
// DISPOSAL VENDOR MANAGEMENT
// ============================================================================
/**
 * Registers new disposal vendor
 *
 * @param vendorData - Vendor registration data
 * @param transaction - Optional database transaction
 * @returns Created vendor
 *
 * @example
 * ```typescript
 * const vendor = await registerDisposalVendor({
 *   vendorCode: 'DV-2024-001',
 *   vendorName: 'Green Disposal Solutions Inc.',
 *   disposalMethodsOffered: [DisposalMethod.RECYCLE, DisposalMethod.SCRAP],
 *   certifications: ['R2', 'e-Stewards', 'ISO 14001'],
 *   isCertified: true,
 *   contactEmail: 'contact@greendisposal.com',
 *   contactPhone: '555-0123'
 * });
 * ```
 */
async function registerDisposalVendor(vendorData, transaction) {
    // Check for duplicate vendor code
    const existing = await DisposalVendor.findOne({
        where: { vendorCode: vendorData.vendorCode },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException(`Vendor code ${vendorData.vendorCode} already exists`);
    }
    const vendor = await DisposalVendor.create({
        ...vendorData,
        performanceRating: 0,
        isActive: true,
    }, { transaction });
    return vendor;
}
/**
 * Updates vendor performance rating
 *
 * @param vendorId - Vendor ID
 * @param disposalRequestId - Completed disposal request ID
 * @param rating - Performance rating (1-5)
 * @param feedback - Optional feedback
 * @param transaction - Optional database transaction
 * @returns Updated vendor
 *
 * @example
 * ```typescript
 * await updateVendorPerformance('vendor-123', 'disposal-456', 4.5,
 *   'Excellent service, timely completion'
 * );
 * ```
 */
async function updateVendorPerformance(vendorId, disposalRequestId, rating, feedback, transaction) {
    if (rating < 1 || rating > 5) {
        throw new common_1.BadRequestException('Rating must be between 1 and 5');
    }
    const vendor = await DisposalVendor.findByPk(vendorId, { transaction });
    if (!vendor) {
        throw new common_1.NotFoundException(`Vendor ${vendorId} not found`);
    }
    // Calculate new rolling average rating
    const currentRating = vendor.performanceRating || 0;
    const newRating = currentRating === 0 ? rating : (currentRating + rating) / 2;
    await vendor.update({
        performanceRating: newRating,
        notes: feedback
            ? `${vendor.notes || ''}\n[${new Date().toISOString()}] Rating: ${rating}/5 - ${feedback}`
            : vendor.notes,
    }, { transaction });
    return vendor;
}
/**
 * Gets certified vendors for disposal method
 *
 * @param disposalMethod - Disposal method
 * @param environmentalClassification - Optional environmental classification filter
 * @returns Certified vendors
 *
 * @example
 * ```typescript
 * const vendors = await getCertifiedVendors(
 *   DisposalMethod.RECYCLE,
 *   EnvironmentalClassification.ELECTRONIC_WASTE
 * );
 * ```
 */
async function getCertifiedVendors(disposalMethod, environmentalClassification) {
    const where = {
        isActive: true,
        isCertified: true,
        disposalMethodsOffered: {
            [sequelize_1.Op.contains]: [disposalMethod],
        },
    };
    if (environmentalClassification && environmentalClassification !== EnvironmentalClassification.NON_HAZARDOUS) {
        // Filter vendors with appropriate environmental compliance
        const requiredCompliance = getRequiredComplianceForClassification(environmentalClassification);
        if (requiredCompliance.length > 0) {
            where.environmentalCompliance = {
                [sequelize_1.Op.overlap]: requiredCompliance,
            };
        }
    }
    return DisposalVendor.findAll({
        where,
        order: [['performanceRating', 'DESC']],
    });
}
/**
 * Gets required compliance certifications for environmental classification
 */
function getRequiredComplianceForClassification(classification) {
    switch (classification) {
        case EnvironmentalClassification.ELECTRONIC_WASTE:
            return ['WEEE Directive', 'RoHS Compliance', 'R2', 'e-Stewards'];
        case EnvironmentalClassification.HAZARDOUS:
            return ['RCRA', 'EPA TSCA'];
        case EnvironmentalClassification.CHEMICAL:
            return ['RCRA', 'EPA TSCA', 'DOT Hazardous Materials'];
        default:
            return [];
    }
}
/**
 * Evaluates vendor for disposal request
 *
 * @param vendorId - Vendor ID
 * @param disposalRequestId - Disposal request ID
 * @returns Vendor evaluation
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateVendorForDisposal('vendor-123', 'disposal-456');
 * ```
 */
async function evaluateVendorForDisposal(vendorId, disposalRequestId) {
    const vendor = await DisposalVendor.findByPk(vendorId);
    if (!vendor) {
        throw new common_1.NotFoundException(`Vendor ${vendorId} not found`);
    }
    const disposal = await DisposalRequest.findByPk(disposalRequestId);
    if (!disposal) {
        throw new common_1.NotFoundException(`Disposal request ${disposalRequestId} not found`);
    }
    const strengths = [];
    const concerns = [];
    let suitabilityScore = 50; // Base score
    // Check if vendor offers required disposal method
    if (!vendor.disposalMethodsOffered.includes(disposal.disposalMethod)) {
        concerns.push('Vendor does not offer required disposal method');
        suitabilityScore -= 50;
    }
    else {
        strengths.push('Offers required disposal method');
        suitabilityScore += 10;
    }
    // Check certification
    if (vendor.isCertified) {
        strengths.push('Certified vendor');
        suitabilityScore += 20;
    }
    else if (disposal.environmentalClassification !== EnvironmentalClassification.NON_HAZARDOUS) {
        concerns.push('Not certified for hazardous disposal');
        suitabilityScore -= 30;
    }
    // Check performance rating
    if (vendor.performanceRating) {
        if (vendor.performanceRating >= 4.5) {
            strengths.push('Excellent performance history');
            suitabilityScore += 20;
        }
        else if (vendor.performanceRating >= 3.5) {
            strengths.push('Good performance history');
            suitabilityScore += 10;
        }
        else {
            concerns.push('Below-average performance history');
            suitabilityScore -= 15;
        }
    }
    // Determine recommendation
    let recommendation;
    if (suitabilityScore >= 80) {
        recommendation = 'highly_recommended';
    }
    else if (suitabilityScore >= 60) {
        recommendation = 'recommended';
    }
    else if (suitabilityScore >= 40) {
        recommendation = 'acceptable';
    }
    else {
        recommendation = 'not_recommended';
    }
    return {
        vendor,
        suitabilityScore,
        strengths,
        concerns,
        recommendation,
    };
}
// ============================================================================
// DISPOSAL COST MANAGEMENT
// ============================================================================
/**
 * Calculates total disposal cost
 *
 * @param requestId - Disposal request ID
 * @param costDetails - Cost detail inputs
 * @returns Cost breakdown
 *
 * @example
 * ```typescript
 * const costs = await calculateDisposalCost('disposal-123', {
 *   vendorFees: 2500,
 *   transportationCost: 750,
 *   sanitizationCost: 500,
 *   certificationCost: 300
 * });
 * ```
 */
async function calculateDisposalCost(requestId, costDetails) {
    const breakdown = {
        vendorFees: costDetails.vendorFees || 0,
        transportationCost: costDetails.transportationCost || 0,
        sanitizationCost: costDetails.sanitizationCost || 0,
        certificationCost: costDetails.certificationCost || 0,
        environmentalFees: costDetails.environmentalFees || 0,
        administrativeCost: costDetails.administrativeCost || 100, // Default admin cost
        totalCost: 0,
    };
    breakdown.totalCost =
        breakdown.vendorFees +
            breakdown.transportationCost +
            breakdown.sanitizationCost +
            breakdown.certificationCost +
            breakdown.environmentalFees +
            breakdown.administrativeCost;
    // Update disposal request with cost breakdown
    await DisposalRequest.update({
        disposalCost: breakdown.totalCost,
        costBreakdown: breakdown,
    }, {
        where: { id: requestId },
    });
    return breakdown;
}
/**
 * Tracks revenue recovery from disposal
 *
 * @param requestId - Disposal request ID
 * @param revenueData - Revenue details
 * @param transaction - Optional database transaction
 * @returns Revenue recovery summary
 *
 * @example
 * ```typescript
 * const recovery = await trackRevenueRecovery('disposal-123', {
 *   saleAmount: 15000,
 *   taxDeduction: 5000
 * });
 * ```
 */
async function trackRevenueRecovery(requestId, revenueData, transaction) {
    const disposal = await DisposalRequest.findByPk(requestId, { transaction });
    if (!disposal) {
        throw new common_1.NotFoundException(`Disposal request ${requestId} not found`);
    }
    const totalRecovery = (revenueData.saleAmount || 0) +
        (revenueData.tradeInValue || 0) +
        (revenueData.salvageValue || 0) +
        (revenueData.taxDeduction || 0);
    const originalValue = disposal.estimatedValue || 0;
    const recoveryPercentage = originalValue > 0 ? (totalRecovery / originalValue) * 100 : 0;
    const recovery = {
        ...revenueData,
        totalRecovery,
        recoveryPercentage,
    };
    await disposal.update({
        actualValue: totalRecovery,
        revenueRecovery: recovery,
    }, { transaction });
    return recovery;
}
/**
 * Completes disposal request
 *
 * @param requestId - Disposal request ID
 * @param completionData - Completion details
 * @param transaction - Optional database transaction
 * @returns Completed disposal request
 *
 * @example
 * ```typescript
 * await completeDisposal('disposal-123', {
 *   completedBy: 'user-001',
 *   actualDisposalDate: new Date(),
 *   finalNotes: 'Asset disposed via certified recycler, all documentation on file'
 * });
 * ```
 */
async function completeDisposal(requestId, completionData, transaction) {
    const disposal = await DisposalRequest.findByPk(requestId, { transaction });
    if (!disposal) {
        throw new common_1.NotFoundException(`Disposal request ${requestId} not found`);
    }
    if (disposal.status !== DisposalStatus.IN_PROGRESS) {
        throw new common_1.BadRequestException('Only in-progress disposals can be completed');
    }
    // Validate required fields
    if (disposal.requiresDataSanitization && !disposal.sanitizationCompleted) {
        throw new common_1.BadRequestException('Data sanitization must be completed before finalizing disposal');
    }
    const previousState = disposal.toJSON();
    await disposal.update({
        status: DisposalStatus.COMPLETED,
        actualDisposalDate: completionData.actualDisposalDate,
        notes: completionData.finalNotes
            ? `${disposal.notes || ''}\n[${new Date().toISOString()}] ${completionData.finalNotes}`
            : disposal.notes,
    }, { transaction });
    // Create audit log
    await createDisposalAuditLog({
        disposalRequestId: requestId,
        actionType: 'DISPOSAL_COMPLETED',
        actionDescription: 'Disposal request completed',
        performedBy: completionData.completedBy,
        actionTimestamp: completionData.actualDisposalDate,
        previousState,
        newState: disposal.toJSON(),
    }, transaction);
    return disposal;
}
// ============================================================================
// AUDIT AND REPORTING
// ============================================================================
/**
 * Creates disposal audit log entry
 *
 * @param logData - Audit log data
 * @param transaction - Optional database transaction
 * @returns Created audit log
 */
async function createDisposalAuditLog(logData, transaction) {
    return DisposalAuditLog.create(logData, { transaction });
}
/**
 * Gets disposal audit trail
 *
 * @param requestId - Disposal request ID
 * @returns Audit trail
 *
 * @example
 * ```typescript
 * const audit = await getDisposalAuditTrail('disposal-123');
 * ```
 */
async function getDisposalAuditTrail(requestId) {
    return DisposalAuditLog.findAll({
        where: { disposalRequestId: requestId },
        order: [['actionTimestamp', 'DESC']],
    });
}
/**
 * Generates disposal compliance report
 *
 * @param startDate - Report start date
 * @param endDate - Report end date
 * @returns Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateDisposalComplianceReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
async function generateDisposalComplianceReport(startDate, endDate) {
    const disposals = await DisposalRequest.findAll({
        where: {
            createdAt: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    const byMethod = {};
    const byStatus = {};
    let hazardousDisposals = 0;
    let certifiedVendorUsage = 0;
    let totalCosts = 0;
    let totalRecovery = 0;
    disposals.forEach((disposal) => {
        byMethod[disposal.disposalMethod] = (byMethod[disposal.disposalMethod] || 0) + 1;
        byStatus[disposal.status] = (byStatus[disposal.status] || 0) + 1;
        if (disposal.environmentalClassification &&
            disposal.environmentalClassification !== EnvironmentalClassification.NON_HAZARDOUS) {
            hazardousDisposals++;
        }
        if (disposal.disposalVendorId) {
            certifiedVendorUsage++;
        }
        totalCosts += Number(disposal.disposalCost || 0);
        totalRecovery += Number(disposal.actualValue || 0);
    });
    const certificates = await CertificateOfDestruction.count({
        where: {
            issuedDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    return {
        totalDisposals: disposals.length,
        byMethod: byMethod,
        byStatus: byStatus,
        environmentalCompliance: {
            hazardousDisposals,
            certifiedVendorUsage,
            certificatesIssued: certificates,
        },
        financialSummary: {
            totalCosts,
            totalRecovery,
            netImpact: totalRecovery - totalCosts,
        },
    };
}
/**
 * Searches disposal requests with filters
 *
 * @param filters - Search filters
 * @param options - Query options
 * @returns Filtered disposal requests
 *
 * @example
 * ```typescript
 * const results = await searchDisposalRequests({
 *   status: DisposalStatus.PENDING_APPROVAL,
 *   disposalMethod: DisposalMethod.SALE,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
async function searchDisposalRequests(filters, options = {}) {
    const where = {};
    if (filters.status) {
        where.status = Array.isArray(filters.status)
            ? { [sequelize_1.Op.in]: filters.status }
            : filters.status;
    }
    if (filters.disposalMethod) {
        where.disposalMethod = Array.isArray(filters.disposalMethod)
            ? { [sequelize_1.Op.in]: filters.disposalMethod }
            : filters.disposalMethod;
    }
    if (filters.assetId) {
        where.assetId = filters.assetId;
    }
    if (filters.requestedBy) {
        where.requestedBy = filters.requestedBy;
    }
    if (filters.startDate || filters.endDate) {
        where.requestDate = {};
        if (filters.startDate) {
            where.requestDate[sequelize_1.Op.gte] = filters.startDate;
        }
        if (filters.endDate) {
            where.requestDate[sequelize_1.Op.lte] = filters.endDate;
        }
    }
    if (filters.vendorId) {
        where.disposalVendorId = filters.vendorId;
    }
    if (filters.requiresApproval !== undefined) {
        where.approvalRequired = filters.requiresApproval;
    }
    const { rows: requests, count: total } = await DisposalRequest.findAndCountAll({
        where,
        include: [
            { model: DisposalApproval, as: 'approvals' },
        ],
        ...options,
    });
    return { requests, total };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    DisposalRequest,
    DisposalApproval,
    DisposalVendor,
    CertificateOfDestruction,
    DisposalAuditLog,
    // Disposal Request Management
    initiateAssetDisposal,
    generateDisposalRequestNumber,
    updateDisposalStatus,
    submitDisposalForApproval,
    getRequiredApprovalLevels,
    processDisposalApproval,
    getDisposalWithApprovals,
    // Salvage Value
    calculateSalvageValue,
    optimizeSalvageValue,
    compareDisposalMethods,
    // Environmental Compliance
    getEnvironmentalRequirements,
    validateVendorCompliance,
    // Data Sanitization
    processDataSanitization,
    generateCertificateOfDestruction,
    validateDestructionDocumentation,
    // Vendor Management
    registerDisposalVendor,
    updateVendorPerformance,
    getCertifiedVendors,
    evaluateVendorForDisposal,
    // Cost Management
    calculateDisposalCost,
    trackRevenueRecovery,
    completeDisposal,
    // Audit and Reporting
    getDisposalAuditTrail,
    generateDisposalComplianceReport,
    searchDisposalRequests,
};
//# sourceMappingURL=asset-disposal-commands.js.map