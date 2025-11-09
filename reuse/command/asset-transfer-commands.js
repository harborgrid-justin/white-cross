"use strict";
/**
 * ASSET TRANSFER MANAGEMENT COMMAND FUNCTIONS
 *
 * Enterprise-grade asset transfer management system for JD Edwards EnterpriseOne competition.
 * Provides comprehensive transfer workflows including:
 * - Inter-location transfers with tracking
 * - Inter-department transfers and assignments
 * - Custody transfers and chain of custody
 * - Transfer documentation and compliance
 * - Shipping management and logistics
 * - Multi-level transfer approvals
 * - Transfer cost tracking and allocation
 * - Complete transfer history and audit trails
 * - Bulk transfer operations
 * - Transfer request workflows
 * - Asset condition verification
 * - Transfer insurance and liability
 * - Real-time transfer status tracking
 *
 * @module AssetTransferCommands
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
 *   initiateAssetTransfer,
 *   approveTransferRequest,
 *   trackTransferShipment,
 *   completeTransfer,
 *   TransferType,
 *   TransferStatus
 * } from './asset-transfer-commands';
 *
 * // Initiate transfer
 * const transfer = await initiateAssetTransfer({
 *   assetId: 'asset-123',
 *   transferType: TransferType.INTER_LOCATION,
 *   fromLocationId: 'loc-001',
 *   toLocationId: 'loc-002',
 *   requestedBy: 'user-001',
 *   reason: 'Department relocation',
 *   targetTransferDate: new Date('2024-07-01')
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
exports.TransferTemplate = exports.TransferAuditLog = exports.TransferStatusHistory = exports.TransferApproval = exports.AssetTransfer = exports.TransferPriority = exports.ShippingMethod = exports.TransferStatus = exports.TransferType = void 0;
exports.initiateAssetTransfer = initiateAssetTransfer;
exports.generateTransferNumber = generateTransferNumber;
exports.updateTransferStatus = updateTransferStatus;
exports.submitTransferForApproval = submitTransferForApproval;
exports.approveTransferRequest = approveTransferRequest;
exports.getTransferWithApprovals = getTransferWithApprovals;
exports.assignShippingDetails = assignShippingDetails;
exports.trackTransferShipment = trackTransferShipment;
exports.recordDepartureVerification = recordDepartureVerification;
exports.recordArrivalVerification = recordArrivalVerification;
exports.calculateTransferCost = calculateTransferCost;
exports.allocateTransferCost = allocateTransferCost;
exports.completeTransfer = completeTransfer;
exports.cancelTransfer = cancelTransfer;
exports.initiateBulkTransfer = initiateBulkTransfer;
exports.bulkApproveTransfers = bulkApproveTransfers;
exports.createTransferTemplate = createTransferTemplate;
exports.createTransferFromTemplate = createTransferFromTemplate;
exports.getTransferAuditTrail = getTransferAuditTrail;
exports.getTransferStatusHistory = getTransferStatusHistory;
exports.generateTransferReport = generateTransferReport;
exports.searchTransfers = searchTransfers;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Transfer types
 */
var TransferType;
(function (TransferType) {
    TransferType["INTER_LOCATION"] = "inter_location";
    TransferType["INTER_DEPARTMENT"] = "inter_department";
    TransferType["INTER_FACILITY"] = "inter_facility";
    TransferType["CUSTODY_CHANGE"] = "custody_change";
    TransferType["EMPLOYEE_ASSIGNMENT"] = "employee_assignment";
    TransferType["TEMPORARY_LOAN"] = "temporary_loan";
    TransferType["PERMANENT_TRANSFER"] = "permanent_transfer";
    TransferType["RETURN_FROM_LOAN"] = "return_from_loan";
    TransferType["MAINTENANCE_TRANSFER"] = "maintenance_transfer";
    TransferType["STORAGE_TRANSFER"] = "storage_transfer";
})(TransferType || (exports.TransferType = TransferType = {}));
/**
 * Transfer status
 */
var TransferStatus;
(function (TransferStatus) {
    TransferStatus["DRAFT"] = "draft";
    TransferStatus["PENDING_APPROVAL"] = "pending_approval";
    TransferStatus["APPROVED"] = "approved";
    TransferStatus["REJECTED"] = "rejected";
    TransferStatus["IN_TRANSIT"] = "in_transit";
    TransferStatus["DELIVERED"] = "delivered";
    TransferStatus["COMPLETED"] = "completed";
    TransferStatus["CANCELLED"] = "cancelled";
    TransferStatus["ON_HOLD"] = "on_hold";
    TransferStatus["DELAYED"] = "delayed";
})(TransferStatus || (exports.TransferStatus = TransferStatus = {}));
/**
 * Shipping method
 */
var ShippingMethod;
(function (ShippingMethod) {
    ShippingMethod["INTERNAL_COURIER"] = "internal_courier";
    ShippingMethod["THIRD_PARTY_CARRIER"] = "third_party_carrier";
    ShippingMethod["FREIGHT"] = "freight";
    ShippingMethod["AIR_FREIGHT"] = "air_freight";
    ShippingMethod["HAND_CARRY"] = "hand_carry";
    ShippingMethod["POSTAL_SERVICE"] = "postal_service";
    ShippingMethod["WHITE_GLOVE"] = "white_glove";
})(ShippingMethod || (exports.ShippingMethod = ShippingMethod = {}));
/**
 * Transfer priority
 */
var TransferPriority;
(function (TransferPriority) {
    TransferPriority["CRITICAL"] = "critical";
    TransferPriority["HIGH"] = "high";
    TransferPriority["NORMAL"] = "normal";
    TransferPriority["LOW"] = "low";
})(TransferPriority || (exports.TransferPriority = TransferPriority = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Asset Transfer Model
 */
let AssetTransfer = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'asset_transfers',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['transfer_number'], unique: true },
                { fields: ['asset_id'] },
                { fields: ['transfer_type'] },
                { fields: ['status'] },
                { fields: ['from_location_id'] },
                { fields: ['to_location_id'] },
                { fields: ['from_custodian_id'] },
                { fields: ['to_custodian_id'] },
                { fields: ['requested_by'] },
                { fields: ['target_transfer_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _transferNumber_decorators;
    let _transferNumber_initializers = [];
    let _transferNumber_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _transferType_decorators;
    let _transferType_initializers = [];
    let _transferType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _fromLocationId_decorators;
    let _fromLocationId_initializers = [];
    let _fromLocationId_extraInitializers = [];
    let _toLocationId_decorators;
    let _toLocationId_initializers = [];
    let _toLocationId_extraInitializers = [];
    let _fromDepartmentId_decorators;
    let _fromDepartmentId_initializers = [];
    let _fromDepartmentId_extraInitializers = [];
    let _toDepartmentId_decorators;
    let _toDepartmentId_initializers = [];
    let _toDepartmentId_extraInitializers = [];
    let _fromCustodianId_decorators;
    let _fromCustodianId_initializers = [];
    let _fromCustodianId_extraInitializers = [];
    let _toCustodianId_decorators;
    let _toCustodianId_initializers = [];
    let _toCustodianId_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _requestDate_decorators;
    let _requestDate_initializers = [];
    let _requestDate_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _targetTransferDate_decorators;
    let _targetTransferDate_initializers = [];
    let _targetTransferDate_extraInitializers = [];
    let _actualTransferDate_decorators;
    let _actualTransferDate_initializers = [];
    let _actualTransferDate_extraInitializers = [];
    let _expectedReturnDate_decorators;
    let _expectedReturnDate_initializers = [];
    let _expectedReturnDate_extraInitializers = [];
    let _actualReturnDate_decorators;
    let _actualReturnDate_initializers = [];
    let _actualReturnDate_extraInitializers = [];
    let _requiresApproval_decorators;
    let _requiresApproval_initializers = [];
    let _requiresApproval_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvalDate_decorators;
    let _approvalDate_initializers = [];
    let _approvalDate_extraInitializers = [];
    let _requiresInsurance_decorators;
    let _requiresInsurance_initializers = [];
    let _requiresInsurance_extraInitializers = [];
    let _insuranceValue_decorators;
    let _insuranceValue_initializers = [];
    let _insuranceValue_extraInitializers = [];
    let _shippingDetails_decorators;
    let _shippingDetails_initializers = [];
    let _shippingDetails_extraInitializers = [];
    let _transferCost_decorators;
    let _transferCost_initializers = [];
    let _transferCost_extraInitializers = [];
    let _costBreakdown_decorators;
    let _costBreakdown_initializers = [];
    let _costBreakdown_extraInitializers = [];
    let _costAllocationDepartmentId_decorators;
    let _costAllocationDepartmentId_initializers = [];
    let _costAllocationDepartmentId_extraInitializers = [];
    let _specialHandling_decorators;
    let _specialHandling_initializers = [];
    let _specialHandling_extraInitializers = [];
    let _departureVerification_decorators;
    let _departureVerification_initializers = [];
    let _departureVerification_extraInitializers = [];
    let _arrivalVerification_decorators;
    let _arrivalVerification_initializers = [];
    let _arrivalVerification_extraInitializers = [];
    let _conditionOnDeparture_decorators;
    let _conditionOnDeparture_initializers = [];
    let _conditionOnDeparture_extraInitializers = [];
    let _conditionOnArrival_decorators;
    let _conditionOnArrival_initializers = [];
    let _conditionOnArrival_extraInitializers = [];
    let _damageReported_decorators;
    let _damageReported_initializers = [];
    let _damageReported_extraInitializers = [];
    let _damageDescription_decorators;
    let _damageDescription_initializers = [];
    let _damageDescription_extraInitializers = [];
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
    let _statusHistory_decorators;
    let _statusHistory_initializers = [];
    let _statusHistory_extraInitializers = [];
    let _auditLogs_decorators;
    let _auditLogs_initializers = [];
    let _auditLogs_extraInitializers = [];
    var AssetTransfer = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.transferNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _transferNumber_initializers, void 0));
            this.assetId = (__runInitializers(this, _transferNumber_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.transferType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _transferType_initializers, void 0));
            this.status = (__runInitializers(this, _transferType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.fromLocationId = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _fromLocationId_initializers, void 0));
            this.toLocationId = (__runInitializers(this, _fromLocationId_extraInitializers), __runInitializers(this, _toLocationId_initializers, void 0));
            this.fromDepartmentId = (__runInitializers(this, _toLocationId_extraInitializers), __runInitializers(this, _fromDepartmentId_initializers, void 0));
            this.toDepartmentId = (__runInitializers(this, _fromDepartmentId_extraInitializers), __runInitializers(this, _toDepartmentId_initializers, void 0));
            this.fromCustodianId = (__runInitializers(this, _toDepartmentId_extraInitializers), __runInitializers(this, _fromCustodianId_initializers, void 0));
            this.toCustodianId = (__runInitializers(this, _fromCustodianId_extraInitializers), __runInitializers(this, _toCustodianId_initializers, void 0));
            this.requestedBy = (__runInitializers(this, _toCustodianId_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
            this.requestDate = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _requestDate_initializers, void 0));
            this.reason = (__runInitializers(this, _requestDate_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            this.targetTransferDate = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _targetTransferDate_initializers, void 0));
            this.actualTransferDate = (__runInitializers(this, _targetTransferDate_extraInitializers), __runInitializers(this, _actualTransferDate_initializers, void 0));
            this.expectedReturnDate = (__runInitializers(this, _actualTransferDate_extraInitializers), __runInitializers(this, _expectedReturnDate_initializers, void 0));
            this.actualReturnDate = (__runInitializers(this, _expectedReturnDate_extraInitializers), __runInitializers(this, _actualReturnDate_initializers, void 0));
            this.requiresApproval = (__runInitializers(this, _actualReturnDate_extraInitializers), __runInitializers(this, _requiresApproval_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _requiresApproval_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvalDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
            this.requiresInsurance = (__runInitializers(this, _approvalDate_extraInitializers), __runInitializers(this, _requiresInsurance_initializers, void 0));
            this.insuranceValue = (__runInitializers(this, _requiresInsurance_extraInitializers), __runInitializers(this, _insuranceValue_initializers, void 0));
            this.shippingDetails = (__runInitializers(this, _insuranceValue_extraInitializers), __runInitializers(this, _shippingDetails_initializers, void 0));
            this.transferCost = (__runInitializers(this, _shippingDetails_extraInitializers), __runInitializers(this, _transferCost_initializers, void 0));
            this.costBreakdown = (__runInitializers(this, _transferCost_extraInitializers), __runInitializers(this, _costBreakdown_initializers, void 0));
            this.costAllocationDepartmentId = (__runInitializers(this, _costBreakdown_extraInitializers), __runInitializers(this, _costAllocationDepartmentId_initializers, void 0));
            this.specialHandling = (__runInitializers(this, _costAllocationDepartmentId_extraInitializers), __runInitializers(this, _specialHandling_initializers, void 0));
            this.departureVerification = (__runInitializers(this, _specialHandling_extraInitializers), __runInitializers(this, _departureVerification_initializers, void 0));
            this.arrivalVerification = (__runInitializers(this, _departureVerification_extraInitializers), __runInitializers(this, _arrivalVerification_initializers, void 0));
            this.conditionOnDeparture = (__runInitializers(this, _arrivalVerification_extraInitializers), __runInitializers(this, _conditionOnDeparture_initializers, void 0));
            this.conditionOnArrival = (__runInitializers(this, _conditionOnDeparture_extraInitializers), __runInitializers(this, _conditionOnArrival_initializers, void 0));
            this.damageReported = (__runInitializers(this, _conditionOnArrival_extraInitializers), __runInitializers(this, _damageReported_initializers, void 0));
            this.damageDescription = (__runInitializers(this, _damageReported_extraInitializers), __runInitializers(this, _damageDescription_initializers, void 0));
            this.notes = (__runInitializers(this, _damageDescription_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.attachments = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.metadata = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.approvals = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _approvals_initializers, void 0));
            this.statusHistory = (__runInitializers(this, _approvals_extraInitializers), __runInitializers(this, _statusHistory_initializers, void 0));
            this.auditLogs = (__runInitializers(this, _statusHistory_extraInitializers), __runInitializers(this, _auditLogs_initializers, void 0));
            __runInitializers(this, _auditLogs_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AssetTransfer");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _transferNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transfer number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _transferType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transfer type' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(TransferType)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transfer status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(TransferStatus)),
                defaultValue: TransferStatus.DRAFT,
            }), sequelize_typescript_1.Index];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transfer priority' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(TransferPriority)),
                defaultValue: TransferPriority.NORMAL,
            })];
        _fromLocationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'From location ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _toLocationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'To location ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _fromDepartmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'From department ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _toDepartmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'To department ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _fromCustodianId_decorators = [(0, swagger_1.ApiProperty)({ description: 'From custodian ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _toCustodianId_decorators = [(0, swagger_1.ApiProperty)({ description: 'To custodian ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _requestedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requested by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _requestDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Request date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transfer reason' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _targetTransferDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target transfer date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _actualTransferDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual transfer date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _expectedReturnDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expected return date (for loans)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _actualReturnDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual return date (for loans)' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _requiresApproval_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requires approval' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _approvalDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _requiresInsurance_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requires insurance' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _insuranceValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Insurance value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _shippingDetails_decorators = [(0, swagger_1.ApiProperty)({ description: 'Shipping details' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _transferCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transfer cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _costBreakdown_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost breakdown' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _costAllocationDepartmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cost allocation department' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _specialHandling_decorators = [(0, swagger_1.ApiProperty)({ description: 'Special handling instructions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _departureVerification_decorators = [(0, swagger_1.ApiProperty)({ description: 'Departure verification' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _arrivalVerification_decorators = [(0, swagger_1.ApiProperty)({ description: 'Arrival verification' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _conditionOnDeparture_decorators = [(0, swagger_1.ApiProperty)({ description: 'Condition on departure' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _conditionOnArrival_decorators = [(0, swagger_1.ApiProperty)({ description: 'Condition on arrival' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _damageReported_decorators = [(0, swagger_1.ApiProperty)({ description: 'Damage reported' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _damageDescription_decorators = [(0, swagger_1.ApiProperty)({ description: 'Damage description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _attachments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attachments' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _approvals_decorators = [(0, sequelize_typescript_1.HasMany)(() => TransferApproval)];
        _statusHistory_decorators = [(0, sequelize_typescript_1.HasMany)(() => TransferStatusHistory)];
        _auditLogs_decorators = [(0, sequelize_typescript_1.HasMany)(() => TransferAuditLog)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _transferNumber_decorators, { kind: "field", name: "transferNumber", static: false, private: false, access: { has: obj => "transferNumber" in obj, get: obj => obj.transferNumber, set: (obj, value) => { obj.transferNumber = value; } }, metadata: _metadata }, _transferNumber_initializers, _transferNumber_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _transferType_decorators, { kind: "field", name: "transferType", static: false, private: false, access: { has: obj => "transferType" in obj, get: obj => obj.transferType, set: (obj, value) => { obj.transferType = value; } }, metadata: _metadata }, _transferType_initializers, _transferType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _fromLocationId_decorators, { kind: "field", name: "fromLocationId", static: false, private: false, access: { has: obj => "fromLocationId" in obj, get: obj => obj.fromLocationId, set: (obj, value) => { obj.fromLocationId = value; } }, metadata: _metadata }, _fromLocationId_initializers, _fromLocationId_extraInitializers);
        __esDecorate(null, null, _toLocationId_decorators, { kind: "field", name: "toLocationId", static: false, private: false, access: { has: obj => "toLocationId" in obj, get: obj => obj.toLocationId, set: (obj, value) => { obj.toLocationId = value; } }, metadata: _metadata }, _toLocationId_initializers, _toLocationId_extraInitializers);
        __esDecorate(null, null, _fromDepartmentId_decorators, { kind: "field", name: "fromDepartmentId", static: false, private: false, access: { has: obj => "fromDepartmentId" in obj, get: obj => obj.fromDepartmentId, set: (obj, value) => { obj.fromDepartmentId = value; } }, metadata: _metadata }, _fromDepartmentId_initializers, _fromDepartmentId_extraInitializers);
        __esDecorate(null, null, _toDepartmentId_decorators, { kind: "field", name: "toDepartmentId", static: false, private: false, access: { has: obj => "toDepartmentId" in obj, get: obj => obj.toDepartmentId, set: (obj, value) => { obj.toDepartmentId = value; } }, metadata: _metadata }, _toDepartmentId_initializers, _toDepartmentId_extraInitializers);
        __esDecorate(null, null, _fromCustodianId_decorators, { kind: "field", name: "fromCustodianId", static: false, private: false, access: { has: obj => "fromCustodianId" in obj, get: obj => obj.fromCustodianId, set: (obj, value) => { obj.fromCustodianId = value; } }, metadata: _metadata }, _fromCustodianId_initializers, _fromCustodianId_extraInitializers);
        __esDecorate(null, null, _toCustodianId_decorators, { kind: "field", name: "toCustodianId", static: false, private: false, access: { has: obj => "toCustodianId" in obj, get: obj => obj.toCustodianId, set: (obj, value) => { obj.toCustodianId = value; } }, metadata: _metadata }, _toCustodianId_initializers, _toCustodianId_extraInitializers);
        __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
        __esDecorate(null, null, _requestDate_decorators, { kind: "field", name: "requestDate", static: false, private: false, access: { has: obj => "requestDate" in obj, get: obj => obj.requestDate, set: (obj, value) => { obj.requestDate = value; } }, metadata: _metadata }, _requestDate_initializers, _requestDate_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _targetTransferDate_decorators, { kind: "field", name: "targetTransferDate", static: false, private: false, access: { has: obj => "targetTransferDate" in obj, get: obj => obj.targetTransferDate, set: (obj, value) => { obj.targetTransferDate = value; } }, metadata: _metadata }, _targetTransferDate_initializers, _targetTransferDate_extraInitializers);
        __esDecorate(null, null, _actualTransferDate_decorators, { kind: "field", name: "actualTransferDate", static: false, private: false, access: { has: obj => "actualTransferDate" in obj, get: obj => obj.actualTransferDate, set: (obj, value) => { obj.actualTransferDate = value; } }, metadata: _metadata }, _actualTransferDate_initializers, _actualTransferDate_extraInitializers);
        __esDecorate(null, null, _expectedReturnDate_decorators, { kind: "field", name: "expectedReturnDate", static: false, private: false, access: { has: obj => "expectedReturnDate" in obj, get: obj => obj.expectedReturnDate, set: (obj, value) => { obj.expectedReturnDate = value; } }, metadata: _metadata }, _expectedReturnDate_initializers, _expectedReturnDate_extraInitializers);
        __esDecorate(null, null, _actualReturnDate_decorators, { kind: "field", name: "actualReturnDate", static: false, private: false, access: { has: obj => "actualReturnDate" in obj, get: obj => obj.actualReturnDate, set: (obj, value) => { obj.actualReturnDate = value; } }, metadata: _metadata }, _actualReturnDate_initializers, _actualReturnDate_extraInitializers);
        __esDecorate(null, null, _requiresApproval_decorators, { kind: "field", name: "requiresApproval", static: false, private: false, access: { has: obj => "requiresApproval" in obj, get: obj => obj.requiresApproval, set: (obj, value) => { obj.requiresApproval = value; } }, metadata: _metadata }, _requiresApproval_initializers, _requiresApproval_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: obj => "approvalDate" in obj, get: obj => obj.approvalDate, set: (obj, value) => { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
        __esDecorate(null, null, _requiresInsurance_decorators, { kind: "field", name: "requiresInsurance", static: false, private: false, access: { has: obj => "requiresInsurance" in obj, get: obj => obj.requiresInsurance, set: (obj, value) => { obj.requiresInsurance = value; } }, metadata: _metadata }, _requiresInsurance_initializers, _requiresInsurance_extraInitializers);
        __esDecorate(null, null, _insuranceValue_decorators, { kind: "field", name: "insuranceValue", static: false, private: false, access: { has: obj => "insuranceValue" in obj, get: obj => obj.insuranceValue, set: (obj, value) => { obj.insuranceValue = value; } }, metadata: _metadata }, _insuranceValue_initializers, _insuranceValue_extraInitializers);
        __esDecorate(null, null, _shippingDetails_decorators, { kind: "field", name: "shippingDetails", static: false, private: false, access: { has: obj => "shippingDetails" in obj, get: obj => obj.shippingDetails, set: (obj, value) => { obj.shippingDetails = value; } }, metadata: _metadata }, _shippingDetails_initializers, _shippingDetails_extraInitializers);
        __esDecorate(null, null, _transferCost_decorators, { kind: "field", name: "transferCost", static: false, private: false, access: { has: obj => "transferCost" in obj, get: obj => obj.transferCost, set: (obj, value) => { obj.transferCost = value; } }, metadata: _metadata }, _transferCost_initializers, _transferCost_extraInitializers);
        __esDecorate(null, null, _costBreakdown_decorators, { kind: "field", name: "costBreakdown", static: false, private: false, access: { has: obj => "costBreakdown" in obj, get: obj => obj.costBreakdown, set: (obj, value) => { obj.costBreakdown = value; } }, metadata: _metadata }, _costBreakdown_initializers, _costBreakdown_extraInitializers);
        __esDecorate(null, null, _costAllocationDepartmentId_decorators, { kind: "field", name: "costAllocationDepartmentId", static: false, private: false, access: { has: obj => "costAllocationDepartmentId" in obj, get: obj => obj.costAllocationDepartmentId, set: (obj, value) => { obj.costAllocationDepartmentId = value; } }, metadata: _metadata }, _costAllocationDepartmentId_initializers, _costAllocationDepartmentId_extraInitializers);
        __esDecorate(null, null, _specialHandling_decorators, { kind: "field", name: "specialHandling", static: false, private: false, access: { has: obj => "specialHandling" in obj, get: obj => obj.specialHandling, set: (obj, value) => { obj.specialHandling = value; } }, metadata: _metadata }, _specialHandling_initializers, _specialHandling_extraInitializers);
        __esDecorate(null, null, _departureVerification_decorators, { kind: "field", name: "departureVerification", static: false, private: false, access: { has: obj => "departureVerification" in obj, get: obj => obj.departureVerification, set: (obj, value) => { obj.departureVerification = value; } }, metadata: _metadata }, _departureVerification_initializers, _departureVerification_extraInitializers);
        __esDecorate(null, null, _arrivalVerification_decorators, { kind: "field", name: "arrivalVerification", static: false, private: false, access: { has: obj => "arrivalVerification" in obj, get: obj => obj.arrivalVerification, set: (obj, value) => { obj.arrivalVerification = value; } }, metadata: _metadata }, _arrivalVerification_initializers, _arrivalVerification_extraInitializers);
        __esDecorate(null, null, _conditionOnDeparture_decorators, { kind: "field", name: "conditionOnDeparture", static: false, private: false, access: { has: obj => "conditionOnDeparture" in obj, get: obj => obj.conditionOnDeparture, set: (obj, value) => { obj.conditionOnDeparture = value; } }, metadata: _metadata }, _conditionOnDeparture_initializers, _conditionOnDeparture_extraInitializers);
        __esDecorate(null, null, _conditionOnArrival_decorators, { kind: "field", name: "conditionOnArrival", static: false, private: false, access: { has: obj => "conditionOnArrival" in obj, get: obj => obj.conditionOnArrival, set: (obj, value) => { obj.conditionOnArrival = value; } }, metadata: _metadata }, _conditionOnArrival_initializers, _conditionOnArrival_extraInitializers);
        __esDecorate(null, null, _damageReported_decorators, { kind: "field", name: "damageReported", static: false, private: false, access: { has: obj => "damageReported" in obj, get: obj => obj.damageReported, set: (obj, value) => { obj.damageReported = value; } }, metadata: _metadata }, _damageReported_initializers, _damageReported_extraInitializers);
        __esDecorate(null, null, _damageDescription_decorators, { kind: "field", name: "damageDescription", static: false, private: false, access: { has: obj => "damageDescription" in obj, get: obj => obj.damageDescription, set: (obj, value) => { obj.damageDescription = value; } }, metadata: _metadata }, _damageDescription_initializers, _damageDescription_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _approvals_decorators, { kind: "field", name: "approvals", static: false, private: false, access: { has: obj => "approvals" in obj, get: obj => obj.approvals, set: (obj, value) => { obj.approvals = value; } }, metadata: _metadata }, _approvals_initializers, _approvals_extraInitializers);
        __esDecorate(null, null, _statusHistory_decorators, { kind: "field", name: "statusHistory", static: false, private: false, access: { has: obj => "statusHistory" in obj, get: obj => obj.statusHistory, set: (obj, value) => { obj.statusHistory = value; } }, metadata: _metadata }, _statusHistory_initializers, _statusHistory_extraInitializers);
        __esDecorate(null, null, _auditLogs_decorators, { kind: "field", name: "auditLogs", static: false, private: false, access: { has: obj => "auditLogs" in obj, get: obj => obj.auditLogs, set: (obj, value) => { obj.auditLogs = value; } }, metadata: _metadata }, _auditLogs_initializers, _auditLogs_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AssetTransfer = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AssetTransfer = _classThis;
})();
exports.AssetTransfer = AssetTransfer;
/**
 * Transfer Approval Model
 */
let TransferApproval = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'transfer_approvals',
            timestamps: true,
            indexes: [
                { fields: ['transfer_id'] },
                { fields: ['approver_id'] },
                { fields: ['approved'] },
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
    let _transferId_decorators;
    let _transferId_initializers = [];
    let _transferId_extraInitializers = [];
    let _approverId_decorators;
    let _approverId_initializers = [];
    let _approverId_extraInitializers = [];
    let _approvalLevel_decorators;
    let _approvalLevel_initializers = [];
    let _approvalLevel_extraInitializers = [];
    let _approved_decorators;
    let _approved_initializers = [];
    let _approved_extraInitializers = [];
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
    let _transfer_decorators;
    let _transfer_initializers = [];
    let _transfer_extraInitializers = [];
    var TransferApproval = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.transferId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _transferId_initializers, void 0));
            this.approverId = (__runInitializers(this, _transferId_extraInitializers), __runInitializers(this, _approverId_initializers, void 0));
            this.approvalLevel = (__runInitializers(this, _approverId_extraInitializers), __runInitializers(this, _approvalLevel_initializers, void 0));
            this.approved = (__runInitializers(this, _approvalLevel_extraInitializers), __runInitializers(this, _approved_initializers, void 0));
            this.approvalDate = (__runInitializers(this, _approved_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
            this.comments = (__runInitializers(this, _approvalDate_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
            this.conditions = (__runInitializers(this, _comments_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
            this.notified = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _notified_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notified_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.transfer = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _transfer_initializers, void 0));
            __runInitializers(this, _transfer_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TransferApproval");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _transferId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transfer ID' }), (0, sequelize_typescript_1.ForeignKey)(() => AssetTransfer), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _approverId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approver user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _approvalLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval level' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _approved_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN }), sequelize_typescript_1.Index];
        _approvalDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _comments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Comments' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _conditions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Conditions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT) })];
        _notified_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notified' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _transfer_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => AssetTransfer)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _transferId_decorators, { kind: "field", name: "transferId", static: false, private: false, access: { has: obj => "transferId" in obj, get: obj => obj.transferId, set: (obj, value) => { obj.transferId = value; } }, metadata: _metadata }, _transferId_initializers, _transferId_extraInitializers);
        __esDecorate(null, null, _approverId_decorators, { kind: "field", name: "approverId", static: false, private: false, access: { has: obj => "approverId" in obj, get: obj => obj.approverId, set: (obj, value) => { obj.approverId = value; } }, metadata: _metadata }, _approverId_initializers, _approverId_extraInitializers);
        __esDecorate(null, null, _approvalLevel_decorators, { kind: "field", name: "approvalLevel", static: false, private: false, access: { has: obj => "approvalLevel" in obj, get: obj => obj.approvalLevel, set: (obj, value) => { obj.approvalLevel = value; } }, metadata: _metadata }, _approvalLevel_initializers, _approvalLevel_extraInitializers);
        __esDecorate(null, null, _approved_decorators, { kind: "field", name: "approved", static: false, private: false, access: { has: obj => "approved" in obj, get: obj => obj.approved, set: (obj, value) => { obj.approved = value; } }, metadata: _metadata }, _approved_initializers, _approved_extraInitializers);
        __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: obj => "approvalDate" in obj, get: obj => obj.approvalDate, set: (obj, value) => { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
        __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
        __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: obj => "conditions" in obj, get: obj => obj.conditions, set: (obj, value) => { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
        __esDecorate(null, null, _notified_decorators, { kind: "field", name: "notified", static: false, private: false, access: { has: obj => "notified" in obj, get: obj => obj.notified, set: (obj, value) => { obj.notified = value; } }, metadata: _metadata }, _notified_initializers, _notified_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _transfer_decorators, { kind: "field", name: "transfer", static: false, private: false, access: { has: obj => "transfer" in obj, get: obj => obj.transfer, set: (obj, value) => { obj.transfer = value; } }, metadata: _metadata }, _transfer_initializers, _transfer_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TransferApproval = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TransferApproval = _classThis;
})();
exports.TransferApproval = TransferApproval;
/**
 * Transfer Status History Model
 */
let TransferStatusHistory = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'transfer_status_history',
            timestamps: true,
            indexes: [
                { fields: ['transfer_id'] },
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
    let _transferId_decorators;
    let _transferId_initializers = [];
    let _transferId_extraInitializers = [];
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
    let _locationAtChange_decorators;
    let _locationAtChange_initializers = [];
    let _locationAtChange_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _transfer_decorators;
    let _transfer_initializers = [];
    let _transfer_extraInitializers = [];
    var TransferStatusHistory = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.transferId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _transferId_initializers, void 0));
            this.previousStatus = (__runInitializers(this, _transferId_extraInitializers), __runInitializers(this, _previousStatus_initializers, void 0));
            this.status = (__runInitializers(this, _previousStatus_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.changedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _changedBy_initializers, void 0));
            this.changedAt = (__runInitializers(this, _changedBy_extraInitializers), __runInitializers(this, _changedAt_initializers, void 0));
            this.locationAtChange = (__runInitializers(this, _changedAt_extraInitializers), __runInitializers(this, _locationAtChange_initializers, void 0));
            this.notes = (__runInitializers(this, _locationAtChange_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.transfer = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _transfer_initializers, void 0));
            __runInitializers(this, _transfer_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TransferStatusHistory");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _transferId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transfer ID' }), (0, sequelize_typescript_1.ForeignKey)(() => AssetTransfer), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _previousStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Previous status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(TransferStatus)) })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'New status' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(TransferStatus)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _changedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Changed by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _changedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Changed at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _locationAtChange_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location at time of change' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _transfer_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => AssetTransfer)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _transferId_decorators, { kind: "field", name: "transferId", static: false, private: false, access: { has: obj => "transferId" in obj, get: obj => obj.transferId, set: (obj, value) => { obj.transferId = value; } }, metadata: _metadata }, _transferId_initializers, _transferId_extraInitializers);
        __esDecorate(null, null, _previousStatus_decorators, { kind: "field", name: "previousStatus", static: false, private: false, access: { has: obj => "previousStatus" in obj, get: obj => obj.previousStatus, set: (obj, value) => { obj.previousStatus = value; } }, metadata: _metadata }, _previousStatus_initializers, _previousStatus_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _changedBy_decorators, { kind: "field", name: "changedBy", static: false, private: false, access: { has: obj => "changedBy" in obj, get: obj => obj.changedBy, set: (obj, value) => { obj.changedBy = value; } }, metadata: _metadata }, _changedBy_initializers, _changedBy_extraInitializers);
        __esDecorate(null, null, _changedAt_decorators, { kind: "field", name: "changedAt", static: false, private: false, access: { has: obj => "changedAt" in obj, get: obj => obj.changedAt, set: (obj, value) => { obj.changedAt = value; } }, metadata: _metadata }, _changedAt_initializers, _changedAt_extraInitializers);
        __esDecorate(null, null, _locationAtChange_decorators, { kind: "field", name: "locationAtChange", static: false, private: false, access: { has: obj => "locationAtChange" in obj, get: obj => obj.locationAtChange, set: (obj, value) => { obj.locationAtChange = value; } }, metadata: _metadata }, _locationAtChange_initializers, _locationAtChange_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _transfer_decorators, { kind: "field", name: "transfer", static: false, private: false, access: { has: obj => "transfer" in obj, get: obj => obj.transfer, set: (obj, value) => { obj.transfer = value; } }, metadata: _metadata }, _transfer_initializers, _transfer_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TransferStatusHistory = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TransferStatusHistory = _classThis;
})();
exports.TransferStatusHistory = TransferStatusHistory;
/**
 * Transfer Audit Log Model
 */
let TransferAuditLog = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'transfer_audit_logs',
            timestamps: true,
            indexes: [
                { fields: ['transfer_id'] },
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
    let _transferId_decorators;
    let _transferId_initializers = [];
    let _transferId_extraInitializers = [];
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
    let _transfer_decorators;
    let _transfer_initializers = [];
    let _transfer_extraInitializers = [];
    var TransferAuditLog = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.transferId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _transferId_initializers, void 0));
            this.actionType = (__runInitializers(this, _transferId_extraInitializers), __runInitializers(this, _actionType_initializers, void 0));
            this.actionDescription = (__runInitializers(this, _actionType_extraInitializers), __runInitializers(this, _actionDescription_initializers, void 0));
            this.performedBy = (__runInitializers(this, _actionDescription_extraInitializers), __runInitializers(this, _performedBy_initializers, void 0));
            this.actionTimestamp = (__runInitializers(this, _performedBy_extraInitializers), __runInitializers(this, _actionTimestamp_initializers, void 0));
            this.previousState = (__runInitializers(this, _actionTimestamp_extraInitializers), __runInitializers(this, _previousState_initializers, void 0));
            this.newState = (__runInitializers(this, _previousState_extraInitializers), __runInitializers(this, _newState_initializers, void 0));
            this.ipAddress = (__runInitializers(this, _newState_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
            this.userAgent = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _userAgent_initializers, void 0));
            this.createdAt = (__runInitializers(this, _userAgent_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.transfer = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _transfer_initializers, void 0));
            __runInitializers(this, _transfer_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TransferAuditLog");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _transferId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transfer ID' }), (0, sequelize_typescript_1.ForeignKey)(() => AssetTransfer), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _actionType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }), sequelize_typescript_1.Index];
        _actionDescription_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _performedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Performed by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _actionTimestamp_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action timestamp' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _previousState_decorators = [(0, swagger_1.ApiProperty)({ description: 'Previous state' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _newState_decorators = [(0, swagger_1.ApiProperty)({ description: 'New state' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _ipAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'IP address' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _userAgent_decorators = [(0, swagger_1.ApiProperty)({ description: 'User agent' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _transfer_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => AssetTransfer)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _transferId_decorators, { kind: "field", name: "transferId", static: false, private: false, access: { has: obj => "transferId" in obj, get: obj => obj.transferId, set: (obj, value) => { obj.transferId = value; } }, metadata: _metadata }, _transferId_initializers, _transferId_extraInitializers);
        __esDecorate(null, null, _actionType_decorators, { kind: "field", name: "actionType", static: false, private: false, access: { has: obj => "actionType" in obj, get: obj => obj.actionType, set: (obj, value) => { obj.actionType = value; } }, metadata: _metadata }, _actionType_initializers, _actionType_extraInitializers);
        __esDecorate(null, null, _actionDescription_decorators, { kind: "field", name: "actionDescription", static: false, private: false, access: { has: obj => "actionDescription" in obj, get: obj => obj.actionDescription, set: (obj, value) => { obj.actionDescription = value; } }, metadata: _metadata }, _actionDescription_initializers, _actionDescription_extraInitializers);
        __esDecorate(null, null, _performedBy_decorators, { kind: "field", name: "performedBy", static: false, private: false, access: { has: obj => "performedBy" in obj, get: obj => obj.performedBy, set: (obj, value) => { obj.performedBy = value; } }, metadata: _metadata }, _performedBy_initializers, _performedBy_extraInitializers);
        __esDecorate(null, null, _actionTimestamp_decorators, { kind: "field", name: "actionTimestamp", static: false, private: false, access: { has: obj => "actionTimestamp" in obj, get: obj => obj.actionTimestamp, set: (obj, value) => { obj.actionTimestamp = value; } }, metadata: _metadata }, _actionTimestamp_initializers, _actionTimestamp_extraInitializers);
        __esDecorate(null, null, _previousState_decorators, { kind: "field", name: "previousState", static: false, private: false, access: { has: obj => "previousState" in obj, get: obj => obj.previousState, set: (obj, value) => { obj.previousState = value; } }, metadata: _metadata }, _previousState_initializers, _previousState_extraInitializers);
        __esDecorate(null, null, _newState_decorators, { kind: "field", name: "newState", static: false, private: false, access: { has: obj => "newState" in obj, get: obj => obj.newState, set: (obj, value) => { obj.newState = value; } }, metadata: _metadata }, _newState_initializers, _newState_extraInitializers);
        __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
        __esDecorate(null, null, _userAgent_decorators, { kind: "field", name: "userAgent", static: false, private: false, access: { has: obj => "userAgent" in obj, get: obj => obj.userAgent, set: (obj, value) => { obj.userAgent = value; } }, metadata: _metadata }, _userAgent_initializers, _userAgent_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _transfer_decorators, { kind: "field", name: "transfer", static: false, private: false, access: { has: obj => "transfer" in obj, get: obj => obj.transfer, set: (obj, value) => { obj.transfer = value; } }, metadata: _metadata }, _transfer_initializers, _transfer_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TransferAuditLog = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TransferAuditLog = _classThis;
})();
exports.TransferAuditLog = TransferAuditLog;
/**
 * Transfer Template Model - For common transfer routes
 */
let TransferTemplate = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'transfer_templates',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['template_name'] },
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
    let _templateName_decorators;
    let _templateName_initializers = [];
    let _templateName_extraInitializers = [];
    let _transferType_decorators;
    let _transferType_initializers = [];
    let _transferType_extraInitializers = [];
    let _fromLocationId_decorators;
    let _fromLocationId_initializers = [];
    let _fromLocationId_extraInitializers = [];
    let _toLocationId_decorators;
    let _toLocationId_initializers = [];
    let _toLocationId_extraInitializers = [];
    let _defaultShippingMethod_decorators;
    let _defaultShippingMethod_initializers = [];
    let _defaultShippingMethod_extraInitializers = [];
    let _estimatedTransitDays_decorators;
    let _estimatedTransitDays_initializers = [];
    let _estimatedTransitDays_extraInitializers = [];
    let _estimatedCost_decorators;
    let _estimatedCost_initializers = [];
    let _estimatedCost_extraInitializers = [];
    let _requiredApprovers_decorators;
    let _requiredApprovers_initializers = [];
    let _requiredApprovers_extraInitializers = [];
    let _specialInstructions_decorators;
    let _specialInstructions_initializers = [];
    let _specialInstructions_extraInitializers = [];
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
    var TransferTemplate = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.templateName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _templateName_initializers, void 0));
            this.transferType = (__runInitializers(this, _templateName_extraInitializers), __runInitializers(this, _transferType_initializers, void 0));
            this.fromLocationId = (__runInitializers(this, _transferType_extraInitializers), __runInitializers(this, _fromLocationId_initializers, void 0));
            this.toLocationId = (__runInitializers(this, _fromLocationId_extraInitializers), __runInitializers(this, _toLocationId_initializers, void 0));
            this.defaultShippingMethod = (__runInitializers(this, _toLocationId_extraInitializers), __runInitializers(this, _defaultShippingMethod_initializers, void 0));
            this.estimatedTransitDays = (__runInitializers(this, _defaultShippingMethod_extraInitializers), __runInitializers(this, _estimatedTransitDays_initializers, void 0));
            this.estimatedCost = (__runInitializers(this, _estimatedTransitDays_extraInitializers), __runInitializers(this, _estimatedCost_initializers, void 0));
            this.requiredApprovers = (__runInitializers(this, _estimatedCost_extraInitializers), __runInitializers(this, _requiredApprovers_initializers, void 0));
            this.specialInstructions = (__runInitializers(this, _requiredApprovers_extraInitializers), __runInitializers(this, _specialInstructions_initializers, void 0));
            this.isActive = (__runInitializers(this, _specialInstructions_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "TransferTemplate");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _templateName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false }), sequelize_typescript_1.Index];
        _transferType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transfer type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(TransferType)) })];
        _fromLocationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'From location ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _toLocationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'To location ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _defaultShippingMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Default shipping method' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ShippingMethod)) })];
        _estimatedTransitDays_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated transit days' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _estimatedCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _requiredApprovers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Required approvers' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID) })];
        _specialInstructions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Special instructions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _templateName_decorators, { kind: "field", name: "templateName", static: false, private: false, access: { has: obj => "templateName" in obj, get: obj => obj.templateName, set: (obj, value) => { obj.templateName = value; } }, metadata: _metadata }, _templateName_initializers, _templateName_extraInitializers);
        __esDecorate(null, null, _transferType_decorators, { kind: "field", name: "transferType", static: false, private: false, access: { has: obj => "transferType" in obj, get: obj => obj.transferType, set: (obj, value) => { obj.transferType = value; } }, metadata: _metadata }, _transferType_initializers, _transferType_extraInitializers);
        __esDecorate(null, null, _fromLocationId_decorators, { kind: "field", name: "fromLocationId", static: false, private: false, access: { has: obj => "fromLocationId" in obj, get: obj => obj.fromLocationId, set: (obj, value) => { obj.fromLocationId = value; } }, metadata: _metadata }, _fromLocationId_initializers, _fromLocationId_extraInitializers);
        __esDecorate(null, null, _toLocationId_decorators, { kind: "field", name: "toLocationId", static: false, private: false, access: { has: obj => "toLocationId" in obj, get: obj => obj.toLocationId, set: (obj, value) => { obj.toLocationId = value; } }, metadata: _metadata }, _toLocationId_initializers, _toLocationId_extraInitializers);
        __esDecorate(null, null, _defaultShippingMethod_decorators, { kind: "field", name: "defaultShippingMethod", static: false, private: false, access: { has: obj => "defaultShippingMethod" in obj, get: obj => obj.defaultShippingMethod, set: (obj, value) => { obj.defaultShippingMethod = value; } }, metadata: _metadata }, _defaultShippingMethod_initializers, _defaultShippingMethod_extraInitializers);
        __esDecorate(null, null, _estimatedTransitDays_decorators, { kind: "field", name: "estimatedTransitDays", static: false, private: false, access: { has: obj => "estimatedTransitDays" in obj, get: obj => obj.estimatedTransitDays, set: (obj, value) => { obj.estimatedTransitDays = value; } }, metadata: _metadata }, _estimatedTransitDays_initializers, _estimatedTransitDays_extraInitializers);
        __esDecorate(null, null, _estimatedCost_decorators, { kind: "field", name: "estimatedCost", static: false, private: false, access: { has: obj => "estimatedCost" in obj, get: obj => obj.estimatedCost, set: (obj, value) => { obj.estimatedCost = value; } }, metadata: _metadata }, _estimatedCost_initializers, _estimatedCost_extraInitializers);
        __esDecorate(null, null, _requiredApprovers_decorators, { kind: "field", name: "requiredApprovers", static: false, private: false, access: { has: obj => "requiredApprovers" in obj, get: obj => obj.requiredApprovers, set: (obj, value) => { obj.requiredApprovers = value; } }, metadata: _metadata }, _requiredApprovers_initializers, _requiredApprovers_extraInitializers);
        __esDecorate(null, null, _specialInstructions_decorators, { kind: "field", name: "specialInstructions", static: false, private: false, access: { has: obj => "specialInstructions" in obj, get: obj => obj.specialInstructions, set: (obj, value) => { obj.specialInstructions = value; } }, metadata: _metadata }, _specialInstructions_initializers, _specialInstructions_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TransferTemplate = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TransferTemplate = _classThis;
})();
exports.TransferTemplate = TransferTemplate;
// ============================================================================
// TRANSFER REQUEST MANAGEMENT
// ============================================================================
/**
 * Initiates a new asset transfer
 *
 * @param data - Transfer request data
 * @param transaction - Optional database transaction
 * @returns Created transfer record
 *
 * @example
 * ```typescript
 * const transfer = await initiateAssetTransfer({
 *   assetId: 'asset-123',
 *   transferType: TransferType.INTER_LOCATION,
 *   fromLocationId: 'loc-001',
 *   toLocationId: 'loc-002',
 *   requestedBy: 'user-001',
 *   reason: 'Department consolidation',
 *   targetTransferDate: new Date('2024-07-01'),
 *   priority: TransferPriority.HIGH
 * });
 * ```
 */
async function initiateAssetTransfer(data, transaction) {
    // Validate asset exists and is available for transfer
    // In production, would check asset status and location
    // Generate unique transfer number
    const transferNumber = await generateTransferNumber();
    const transfer = await AssetTransfer.create({
        transferNumber,
        assetId: data.assetId,
        transferType: data.transferType,
        fromLocationId: data.fromLocationId,
        toLocationId: data.toLocationId,
        fromDepartmentId: data.fromDepartmentId,
        toDepartmentId: data.toDepartmentId,
        fromCustodianId: data.fromCustodianId,
        toCustodianId: data.toCustodianId,
        requestedBy: data.requestedBy,
        requestDate: new Date(),
        reason: data.reason,
        targetTransferDate: data.targetTransferDate,
        expectedReturnDate: data.expectedReturnDate,
        priority: data.priority || TransferPriority.NORMAL,
        requiresInsurance: data.requiresInsurance || false,
        specialHandling: data.specialHandling,
        notes: data.notes,
        attachments: data.attachments,
        status: TransferStatus.DRAFT,
    }, { transaction });
    // Create initial status history
    await createStatusHistory(transfer.id, undefined, TransferStatus.DRAFT, data.requestedBy, 'Transfer initiated', transaction);
    // Create audit log
    await createTransferAuditLog({
        transferId: transfer.id,
        actionType: 'TRANSFER_INITIATED',
        actionDescription: `Transfer initiated for asset ${data.assetId}`,
        performedBy: data.requestedBy,
        actionTimestamp: new Date(),
        newState: transfer.toJSON(),
    }, transaction);
    return transfer;
}
/**
 * Generates unique transfer number
 *
 * @returns Transfer number
 *
 * @example
 * ```typescript
 * const transferNumber = await generateTransferNumber();
 * // Returns: "TRF-2024-001234"
 * ```
 */
async function generateTransferNumber() {
    const year = new Date().getFullYear();
    const count = await AssetTransfer.count({
        where: {
            createdAt: {
                [sequelize_1.Op.gte]: new Date(`${year}-01-01`),
            },
        },
    });
    return `TRF-${year}-${String(count + 1).padStart(6, '0')}`;
}
/**
 * Updates transfer status
 *
 * @param transferId - Transfer ID
 * @param status - New status
 * @param updatedBy - User ID performing update
 * @param notes - Optional notes
 * @param location - Optional current location
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await updateTransferStatus(
 *   'transfer-123',
 *   TransferStatus.IN_TRANSIT,
 *   'user-001',
 *   'Asset picked up by courier',
 *   'Warehouse A - Loading Dock'
 * );
 * ```
 */
async function updateTransferStatus(transferId, status, updatedBy, notes, location, transaction) {
    const transfer = await AssetTransfer.findByPk(transferId, { transaction });
    if (!transfer) {
        throw new common_1.NotFoundException(`Transfer ${transferId} not found`);
    }
    const previousState = transfer.toJSON();
    const oldStatus = transfer.status;
    await transfer.update({
        status,
        notes: notes ? `${transfer.notes || ''}\n[${new Date().toISOString()}] ${notes}` : transfer.notes,
    }, { transaction });
    // Create status history
    await createStatusHistory(transferId, oldStatus, status, updatedBy, notes, transaction, location);
    // Create audit log
    await createTransferAuditLog({
        transferId,
        actionType: 'STATUS_CHANGED',
        actionDescription: `Status changed from ${oldStatus} to ${status}`,
        performedBy: updatedBy,
        actionTimestamp: new Date(),
        previousState,
        newState: transfer.toJSON(),
    }, transaction);
    return transfer;
}
/**
 * Creates status history entry
 */
async function createStatusHistory(transferId, previousStatus, status, changedBy, notes, transaction, location) {
    return TransferStatusHistory.create({
        transferId,
        previousStatus,
        status,
        changedBy,
        changedAt: new Date(),
        locationAtChange: location,
        notes,
    }, { transaction });
}
/**
 * Submits transfer for approval
 *
 * @param transferId - Transfer ID
 * @param submittedBy - User ID submitting request
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await submitTransferForApproval('transfer-123', 'user-001');
 * ```
 */
async function submitTransferForApproval(transferId, submittedBy, transaction) {
    const transfer = await AssetTransfer.findByPk(transferId, { transaction });
    if (!transfer) {
        throw new common_1.NotFoundException(`Transfer ${transferId} not found`);
    }
    if (transfer.status !== TransferStatus.DRAFT) {
        throw new common_1.BadRequestException('Only draft transfers can be submitted for approval');
    }
    // Determine required approvers
    const approvers = await getRequiredApprovers(transfer);
    // Create approval records
    for (const approver of approvers) {
        await TransferApproval.create({
            transferId,
            approverId: approver.userId,
            approvalLevel: approver.level,
        }, { transaction });
    }
    return updateTransferStatus(transferId, TransferStatus.PENDING_APPROVAL, submittedBy, 'Submitted for approval', undefined, transaction);
}
/**
 * Gets required approvers for transfer
 *
 * @param transfer - Transfer record
 * @returns Array of required approvers
 */
async function getRequiredApprovers(transfer) {
    const approvers = [];
    // Level 1: Source location manager
    if (transfer.fromLocationId) {
        approvers.push({
            userId: 'location-mgr-from', // Would be looked up from location
            level: 1,
            role: 'Source Location Manager',
        });
    }
    // Level 2: Destination location manager
    if (transfer.toLocationId) {
        approvers.push({
            userId: 'location-mgr-to', // Would be looked up from location
            level: 2,
            role: 'Destination Location Manager',
        });
    }
    // Level 3: Asset Manager (for high-value or critical priority)
    if (transfer.priority === TransferPriority.CRITICAL || transfer.priority === TransferPriority.HIGH) {
        approvers.push({
            userId: 'asset-manager',
            level: 3,
            role: 'Asset Manager',
        });
    }
    // Level 4: Department head (for inter-department transfers)
    if (transfer.transferType === TransferType.INTER_DEPARTMENT) {
        approvers.push({
            userId: 'dept-head',
            level: 4,
            role: 'Department Head',
        });
    }
    return approvers;
}
/**
 * Processes transfer approval
 *
 * @param data - Approval data
 * @param transaction - Optional database transaction
 * @returns Updated approval record
 *
 * @example
 * ```typescript
 * await approveTransferRequest({
 *   transferId: 'transfer-123',
 *   approverId: 'mgr-001',
 *   approved: true,
 *   comments: 'Approved - asset available for transfer',
 *   approvalDate: new Date()
 * });
 * ```
 */
async function approveTransferRequest(data, transaction) {
    const approval = await TransferApproval.findOne({
        where: {
            transferId: data.transferId,
            approverId: data.approverId,
            approved: null,
        },
        transaction,
    });
    if (!approval) {
        throw new common_1.NotFoundException('Pending approval not found for this approver');
    }
    const previousState = approval.toJSON();
    await approval.update({
        approved: data.approved,
        approvalDate: data.approvalDate,
        comments: data.comments,
        conditions: data.conditions,
        notified: false,
    }, { transaction });
    // Check if all approvals are complete
    const allApprovals = await TransferApproval.findAll({
        where: { transferId: data.transferId },
        transaction,
    });
    const allApproved = allApprovals.every((a) => a.approved === true);
    const anyRejected = allApprovals.some((a) => a.approved === false);
    const transfer = await AssetTransfer.findByPk(data.transferId, { transaction });
    if (allApproved) {
        await transfer?.update({
            status: TransferStatus.APPROVED,
            approvedBy: data.approverId,
            approvalDate: data.approvalDate,
        }, { transaction });
        await createStatusHistory(data.transferId, TransferStatus.PENDING_APPROVAL, TransferStatus.APPROVED, data.approverId, 'All approvals received', transaction);
    }
    else if (anyRejected) {
        await transfer?.update({
            status: TransferStatus.REJECTED,
        }, { transaction });
        await createStatusHistory(data.transferId, TransferStatus.PENDING_APPROVAL, TransferStatus.REJECTED, data.approverId, `Rejected: ${data.comments}`, transaction);
    }
    // Create audit log
    await createTransferAuditLog({
        transferId: data.transferId,
        actionType: 'APPROVAL_DECISION',
        actionDescription: `Transfer ${data.approved ? 'approved' : 'rejected'} by ${data.approverId}`,
        performedBy: data.approverId,
        actionTimestamp: data.approvalDate,
        previousState,
        newState: approval.toJSON(),
    }, transaction);
    return approval;
}
/**
 * Gets transfer with all approvals
 *
 * @param transferId - Transfer ID
 * @returns Transfer with approvals
 *
 * @example
 * ```typescript
 * const transfer = await getTransferWithApprovals('transfer-123');
 * ```
 */
async function getTransferWithApprovals(transferId) {
    const transfer = await AssetTransfer.findByPk(transferId, {
        include: [
            { model: TransferApproval, as: 'approvals' },
            { model: TransferStatusHistory, as: 'statusHistory' },
        ],
    });
    if (!transfer) {
        throw new common_1.NotFoundException(`Transfer ${transferId} not found`);
    }
    return transfer;
}
// ============================================================================
// SHIPPING AND LOGISTICS MANAGEMENT
// ============================================================================
/**
 * Assigns shipping details to transfer
 *
 * @param transferId - Transfer ID
 * @param shippingDetails - Shipping information
 * @param assignedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await assignShippingDetails('transfer-123', {
 *   shippingMethod: ShippingMethod.THIRD_PARTY_CARRIER,
 *   carrier: 'FedEx',
 *   trackingNumber: '1Z999AA10123456784',
 *   shippingCost: 125.50,
 *   insuranceValue: 50000,
 *   estimatedDeliveryDate: new Date('2024-07-05')
 * }, 'user-001');
 * ```
 */
async function assignShippingDetails(transferId, shippingDetails, assignedBy, transaction) {
    const transfer = await AssetTransfer.findByPk(transferId, { transaction });
    if (!transfer) {
        throw new common_1.NotFoundException(`Transfer ${transferId} not found`);
    }
    if (transfer.status !== TransferStatus.APPROVED) {
        throw new common_1.BadRequestException('Transfer must be approved before assigning shipping');
    }
    const previousState = transfer.toJSON();
    await transfer.update({
        shippingDetails,
    }, { transaction });
    // Create audit log
    await createTransferAuditLog({
        transferId,
        actionType: 'SHIPPING_ASSIGNED',
        actionDescription: `Shipping assigned: ${shippingDetails.shippingMethod} via ${shippingDetails.carrier || 'internal'}`,
        performedBy: assignedBy,
        actionTimestamp: new Date(),
        previousState,
        newState: transfer.toJSON(),
    }, transaction);
    return transfer;
}
/**
 * Tracks shipment status update
 *
 * @param transferId - Transfer ID
 * @param trackingUpdate - Tracking information
 * @param updatedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await trackTransferShipment('transfer-123', {
 *   currentLocation: 'Memphis, TN Distribution Center',
 *   status: 'In Transit',
 *   estimatedDelivery: new Date('2024-07-05'),
 *   lastUpdate: new Date()
 * }, 'system');
 * ```
 */
async function trackTransferShipment(transferId, trackingUpdate, updatedBy, transaction) {
    const transfer = await AssetTransfer.findByPk(transferId, { transaction });
    if (!transfer) {
        throw new common_1.NotFoundException(`Transfer ${transferId} not found`);
    }
    const updatedShipping = {
        ...transfer.shippingDetails,
        ...trackingUpdate,
    };
    await transfer.update({
        shippingDetails: updatedShipping,
        metadata: {
            ...transfer.metadata,
            trackingHistory: [
                ...(transfer.metadata?.trackingHistory || []),
                trackingUpdate,
            ],
        },
    }, { transaction });
    return transfer;
}
/**
 * Records departure verification
 *
 * @param transferId - Transfer ID
 * @param verification - Departure verification data
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await recordDepartureVerification('transfer-123', {
 *   verifiedBy: 'warehouse-001',
 *   verificationDate: new Date(),
 *   conditionOnDeparture: 'Excellent',
 *   photosOnDeparture: ['https://storage/photo1.jpg'],
 *   signatureOnDeparture: 'base64-signature-data'
 * });
 * ```
 */
async function recordDepartureVerification(transferId, verification, transaction) {
    const transfer = await AssetTransfer.findByPk(transferId, { transaction });
    if (!transfer) {
        throw new common_1.NotFoundException(`Transfer ${transferId} not found`);
    }
    const previousState = transfer.toJSON();
    await transfer.update({
        departureVerification: verification,
        conditionOnDeparture: verification.conditionOnDeparture,
        status: TransferStatus.IN_TRANSIT,
        actualTransferDate: verification.verificationDate,
    }, { transaction });
    await createStatusHistory(transferId, transfer.status, TransferStatus.IN_TRANSIT, verification.verifiedBy, 'Asset departed source location', transaction);
    // Create audit log
    await createTransferAuditLog({
        transferId,
        actionType: 'DEPARTURE_VERIFIED',
        actionDescription: 'Asset departure verified and documented',
        performedBy: verification.verifiedBy,
        actionTimestamp: verification.verificationDate,
        previousState,
        newState: transfer.toJSON(),
    }, transaction);
    return transfer;
}
/**
 * Records arrival verification
 *
 * @param transferId - Transfer ID
 * @param verification - Arrival verification data
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await recordArrivalVerification('transfer-123', {
 *   verifiedBy: 'warehouse-002',
 *   verificationDate: new Date(),
 *   conditionOnArrival: 'Good',
 *   damageReported: false,
 *   photosOnArrival: ['https://storage/arrival1.jpg'],
 *   signatureOnArrival: 'base64-signature-data'
 * });
 * ```
 */
async function recordArrivalVerification(transferId, verification, transaction) {
    const transfer = await AssetTransfer.findByPk(transferId, { transaction });
    if (!transfer) {
        throw new common_1.NotFoundException(`Transfer ${transferId} not found`);
    }
    if (transfer.status !== TransferStatus.IN_TRANSIT) {
        throw new common_1.BadRequestException('Transfer must be in transit to record arrival');
    }
    const previousState = transfer.toJSON();
    await transfer.update({
        arrivalVerification: verification,
        conditionOnArrival: verification.conditionOnArrival,
        damageReported: verification.damageReported || false,
        damageDescription: verification.damageDescription,
        status: TransferStatus.DELIVERED,
    }, { transaction });
    await createStatusHistory(transferId, TransferStatus.IN_TRANSIT, TransferStatus.DELIVERED, verification.verifiedBy, 'Asset arrived at destination', transaction);
    // Create audit log
    await createTransferAuditLog({
        transferId,
        actionType: 'ARRIVAL_VERIFIED',
        actionDescription: 'Asset arrival verified and documented',
        performedBy: verification.verifiedBy,
        actionTimestamp: verification.verificationDate,
        previousState,
        newState: transfer.toJSON(),
    }, transaction);
    return transfer;
}
// ============================================================================
// TRANSFER COST MANAGEMENT
// ============================================================================
/**
 * Calculates transfer cost
 *
 * @param transferId - Transfer ID
 * @param costDetails - Cost component details
 * @param transaction - Optional database transaction
 * @returns Cost breakdown
 *
 * @example
 * ```typescript
 * const costs = await calculateTransferCost('transfer-123', {
 *   shippingCost: 125.50,
 *   packagingCost: 35.00,
 *   insuranceCost: 50.00,
 *   handlingFee: 25.00,
 *   laborCost: 75.00
 * });
 * ```
 */
async function calculateTransferCost(transferId, costDetails, transaction) {
    const breakdown = {
        shippingCost: costDetails.shippingCost || 0,
        packagingCost: costDetails.packagingCost || 0,
        insuranceCost: costDetails.insuranceCost || 0,
        handlingFee: costDetails.handlingFee || 0,
        laborCost: costDetails.laborCost || 0,
        documentationFee: costDetails.documentationFee || 10, // Default doc fee
        otherCosts: costDetails.otherCosts || 0,
        totalCost: 0,
    };
    breakdown.totalCost =
        breakdown.shippingCost +
            breakdown.packagingCost +
            breakdown.insuranceCost +
            breakdown.handlingFee +
            breakdown.laborCost +
            breakdown.documentationFee +
            breakdown.otherCosts;
    await AssetTransfer.update({
        transferCost: breakdown.totalCost,
        costBreakdown: breakdown,
    }, {
        where: { id: transferId },
        transaction,
    });
    return breakdown;
}
/**
 * Allocates transfer cost to department
 *
 * @param transferId - Transfer ID
 * @param departmentId - Department to charge
 * @param allocatedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 *
 * @example
 * ```typescript
 * await allocateTransferCost('transfer-123', 'dept-002', 'admin-001');
 * ```
 */
async function allocateTransferCost(transferId, departmentId, allocatedBy, transaction) {
    const transfer = await AssetTransfer.findByPk(transferId, { transaction });
    if (!transfer) {
        throw new common_1.NotFoundException(`Transfer ${transferId} not found`);
    }
    await transfer.update({
        costAllocationDepartmentId: departmentId,
    }, { transaction });
    // Create audit log
    await createTransferAuditLog({
        transferId,
        actionType: 'COST_ALLOCATED',
        actionDescription: `Transfer cost of $${transfer.transferCost} allocated to department ${departmentId}`,
        performedBy: allocatedBy,
        actionTimestamp: new Date(),
    }, transaction);
    return transfer;
}
// ============================================================================
// TRANSFER COMPLETION AND FINALIZATION
// ============================================================================
/**
 * Completes asset transfer
 *
 * @param transferId - Transfer ID
 * @param completedBy - User ID
 * @param finalNotes - Optional final notes
 * @param transaction - Optional database transaction
 * @returns Completed transfer
 *
 * @example
 * ```typescript
 * await completeTransfer('transfer-123', 'user-001',
 *   'Asset successfully transferred, all documentation complete'
 * );
 * ```
 */
async function completeTransfer(transferId, completedBy, finalNotes, transaction) {
    const transfer = await AssetTransfer.findByPk(transferId, { transaction });
    if (!transfer) {
        throw new common_1.NotFoundException(`Transfer ${transferId} not found`);
    }
    if (transfer.status !== TransferStatus.DELIVERED) {
        throw new common_1.BadRequestException('Transfer must be delivered before completion');
    }
    // Validate required verifications
    if (!transfer.departureVerification || !transfer.arrivalVerification) {
        throw new common_1.BadRequestException('Both departure and arrival verifications required');
    }
    const previousState = transfer.toJSON();
    await transfer.update({
        status: TransferStatus.COMPLETED,
        notes: finalNotes
            ? `${transfer.notes || ''}\n[${new Date().toISOString()}] ${finalNotes}`
            : transfer.notes,
    }, { transaction });
    await createStatusHistory(transferId, TransferStatus.DELIVERED, TransferStatus.COMPLETED, completedBy, 'Transfer completed successfully', transaction);
    // Create audit log
    await createTransferAuditLog({
        transferId,
        actionType: 'TRANSFER_COMPLETED',
        actionDescription: 'Transfer completed and finalized',
        performedBy: completedBy,
        actionTimestamp: new Date(),
        previousState,
        newState: transfer.toJSON(),
    }, transaction);
    return transfer;
}
/**
 * Cancels asset transfer
 *
 * @param transferId - Transfer ID
 * @param cancelledBy - User ID
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Cancelled transfer
 *
 * @example
 * ```typescript
 * await cancelTransfer('transfer-123', 'user-001',
 *   'Asset no longer required at destination'
 * );
 * ```
 */
async function cancelTransfer(transferId, cancelledBy, reason, transaction) {
    const transfer = await AssetTransfer.findByPk(transferId, { transaction });
    if (!transfer) {
        throw new common_1.NotFoundException(`Transfer ${transferId} not found`);
    }
    if (transfer.status === TransferStatus.COMPLETED) {
        throw new common_1.BadRequestException('Cannot cancel completed transfer');
    }
    if (transfer.status === TransferStatus.IN_TRANSIT) {
        throw new common_1.BadRequestException('Cannot cancel transfer in transit - put on hold first');
    }
    const previousState = transfer.toJSON();
    const oldStatus = transfer.status;
    await transfer.update({
        status: TransferStatus.CANCELLED,
        notes: `${transfer.notes || ''}\n[${new Date().toISOString()}] CANCELLED: ${reason}`,
    }, { transaction });
    await createStatusHistory(transferId, oldStatus, TransferStatus.CANCELLED, cancelledBy, `Cancelled: ${reason}`, transaction);
    // Create audit log
    await createTransferAuditLog({
        transferId,
        actionType: 'TRANSFER_CANCELLED',
        actionDescription: `Transfer cancelled: ${reason}`,
        performedBy: cancelledBy,
        actionTimestamp: new Date(),
        previousState,
        newState: transfer.toJSON(),
    }, transaction);
    return transfer;
}
// ============================================================================
// BULK TRANSFER OPERATIONS
// ============================================================================
/**
 * Initiates bulk asset transfer
 *
 * @param data - Bulk transfer data
 * @param transaction - Optional database transaction
 * @returns Bulk transfer result
 *
 * @example
 * ```typescript
 * const result = await initiateBulkTransfer({
 *   assetIds: ['asset-001', 'asset-002', 'asset-003'],
 *   transferType: TransferType.INTER_LOCATION,
 *   fromLocationId: 'loc-001',
 *   toLocationId: 'loc-002',
 *   requestedBy: 'user-001',
 *   reason: 'Office relocation',
 *   targetTransferDate: new Date('2024-08-01')
 * });
 * ```
 */
async function initiateBulkTransfer(data, transaction) {
    const result = {
        totalAssets: data.assetIds.length,
        successful: 0,
        failed: 0,
        transferIds: [],
        errors: [],
    };
    for (const assetId of data.assetIds) {
        try {
            const transfer = await initiateAssetTransfer({
                assetId,
                transferType: data.transferType,
                fromLocationId: data.fromLocationId,
                toLocationId: data.toLocationId,
                fromDepartmentId: data.fromDepartmentId,
                toDepartmentId: data.toDepartmentId,
                requestedBy: data.requestedBy,
                reason: data.reason,
                targetTransferDate: data.targetTransferDate,
            }, transaction);
            result.successful++;
            result.transferIds.push(transfer.id);
        }
        catch (error) {
            result.failed++;
            result.errors.push({
                assetId,
                error: error.message,
            });
        }
    }
    return result;
}
/**
 * Bulk approves transfers
 *
 * @param transferIds - Array of transfer IDs
 * @param approverId - Approver user ID
 * @param comments - Optional approval comments
 * @param transaction - Optional database transaction
 * @returns Bulk approval result
 *
 * @example
 * ```typescript
 * const result = await bulkApproveTransfers(
 *   ['transfer-001', 'transfer-002', 'transfer-003'],
 *   'mgr-001',
 *   'Batch approved for Q3 office move'
 * );
 * ```
 */
async function bulkApproveTransfers(transferIds, approverId, comments, transaction) {
    const result = {
        successful: 0,
        failed: 0,
        errors: [],
    };
    for (const transferId of transferIds) {
        try {
            await approveTransferRequest({
                transferId,
                approverId,
                approved: true,
                comments,
                approvalDate: new Date(),
            }, transaction);
            result.successful++;
        }
        catch (error) {
            result.failed++;
            result.errors.push({ transferId, error: error.message });
        }
    }
    return result;
}
// ============================================================================
// TRANSFER TEMPLATES AND AUTOMATION
// ============================================================================
/**
 * Creates transfer template
 *
 * @param templateData - Template data
 * @param transaction - Optional database transaction
 * @returns Created template
 *
 * @example
 * ```typescript
 * const template = await createTransferTemplate({
 *   templateName: 'HQ to Branch Office A',
 *   transferType: TransferType.INTER_FACILITY,
 *   fromLocationId: 'loc-hq',
 *   toLocationId: 'loc-branch-a',
 *   defaultShippingMethod: ShippingMethod.THIRD_PARTY_CARRIER,
 *   estimatedTransitDays: 3,
 *   estimatedCost: 150
 * });
 * ```
 */
async function createTransferTemplate(templateData, transaction) {
    return TransferTemplate.create(templateData, { transaction });
}
/**
 * Creates transfer from template
 *
 * @param templateId - Template ID
 * @param assetId - Asset to transfer
 * @param requestedBy - User ID
 * @param transaction - Optional database transaction
 * @returns Created transfer
 *
 * @example
 * ```typescript
 * const transfer = await createTransferFromTemplate(
 *   'template-123',
 *   'asset-456',
 *   'user-001'
 * );
 * ```
 */
async function createTransferFromTemplate(templateId, assetId, requestedBy, transaction) {
    const template = await TransferTemplate.findByPk(templateId, { transaction });
    if (!template) {
        throw new common_1.NotFoundException(`Template ${templateId} not found`);
    }
    if (!template.isActive) {
        throw new common_1.BadRequestException('Template is not active');
    }
    const transfer = await initiateAssetTransfer({
        assetId,
        transferType: template.transferType,
        fromLocationId: template.fromLocationId,
        toLocationId: template.toLocationId,
        requestedBy,
        reason: `Transfer using template: ${template.templateName}`,
        specialHandling: template.specialInstructions,
    }, transaction);
    return transfer;
}
// ============================================================================
// AUDIT AND REPORTING
// ============================================================================
/**
 * Creates transfer audit log entry
 */
async function createTransferAuditLog(logData, transaction) {
    return TransferAuditLog.create(logData, { transaction });
}
/**
 * Gets transfer audit trail
 *
 * @param transferId - Transfer ID
 * @returns Audit trail
 *
 * @example
 * ```typescript
 * const audit = await getTransferAuditTrail('transfer-123');
 * ```
 */
async function getTransferAuditTrail(transferId) {
    return TransferAuditLog.findAll({
        where: { transferId },
        order: [['actionTimestamp', 'DESC']],
    });
}
/**
 * Gets transfer status history
 *
 * @param transferId - Transfer ID
 * @returns Status history
 *
 * @example
 * ```typescript
 * const history = await getTransferStatusHistory('transfer-123');
 * ```
 */
async function getTransferStatusHistory(transferId) {
    return TransferStatusHistory.findAll({
        where: { transferId },
        order: [['changedAt', 'DESC']],
    });
}
/**
 * Generates transfer analytics report
 *
 * @param startDate - Report start date
 * @param endDate - Report end date
 * @param filters - Optional filters
 * @returns Analytics report
 *
 * @example
 * ```typescript
 * const report = await generateTransferReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
async function generateTransferReport(startDate, endDate, filters) {
    const where = {
        createdAt: {
            [sequelize_1.Op.between]: [startDate, endDate],
        },
    };
    if (filters?.transferType) {
        where.transferType = filters.transferType;
    }
    if (filters?.fromLocationId) {
        where.fromLocationId = filters.fromLocationId;
    }
    if (filters?.toLocationId) {
        where.toLocationId = filters.toLocationId;
    }
    const transfers = await AssetTransfer.findAll({ where });
    const byType = {};
    const byStatus = {};
    let totalCost = 0;
    let totalTransitDays = 0;
    let onTimeCount = 0;
    let damageCount = 0;
    transfers.forEach((transfer) => {
        byType[transfer.transferType] = (byType[transfer.transferType] || 0) + 1;
        byStatus[transfer.status] = (byStatus[transfer.status] || 0) + 1;
        totalCost += Number(transfer.transferCost || 0);
        if (transfer.actualTransferDate && transfer.shippingDetails?.actualDeliveryDate) {
            const transitDays = Math.floor((transfer.shippingDetails.actualDeliveryDate.getTime() - transfer.actualTransferDate.getTime()) /
                (1000 * 60 * 60 * 24));
            totalTransitDays += transitDays;
            if (transfer.shippingDetails.estimatedDeliveryDate &&
                transfer.shippingDetails.actualDeliveryDate <= transfer.shippingDetails.estimatedDeliveryDate) {
                onTimeCount++;
            }
        }
        if (transfer.damageReported) {
            damageCount++;
        }
    });
    const completedTransfers = transfers.filter((t) => t.status === TransferStatus.COMPLETED).length;
    return {
        totalTransfers: transfers.length,
        byType: byType,
        byStatus: byStatus,
        averageTransitDays: completedTransfers > 0 ? totalTransitDays / completedTransfers : 0,
        totalCost,
        onTimeDelivery: completedTransfers > 0 ? (onTimeCount / completedTransfers) * 100 : 0,
        damageRate: transfers.length > 0 ? (damageCount / transfers.length) * 100 : 0,
    };
}
/**
 * Searches transfers with filters
 *
 * @param filters - Search filters
 * @param options - Query options
 * @returns Filtered transfers
 *
 * @example
 * ```typescript
 * const results = await searchTransfers({
 *   status: TransferStatus.IN_TRANSIT,
 *   fromLocationId: 'loc-001',
 *   priority: TransferPriority.HIGH
 * });
 * ```
 */
async function searchTransfers(filters, options = {}) {
    const where = {};
    if (filters.status) {
        where.status = Array.isArray(filters.status)
            ? { [sequelize_1.Op.in]: filters.status }
            : filters.status;
    }
    if (filters.transferType) {
        where.transferType = Array.isArray(filters.transferType)
            ? { [sequelize_1.Op.in]: filters.transferType }
            : filters.transferType;
    }
    if (filters.assetId) {
        where.assetId = filters.assetId;
    }
    if (filters.fromLocationId) {
        where.fromLocationId = filters.fromLocationId;
    }
    if (filters.toLocationId) {
        where.toLocationId = filters.toLocationId;
    }
    if (filters.requestedBy) {
        where.requestedBy = filters.requestedBy;
    }
    if (filters.priority) {
        where.priority = filters.priority;
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
    const { rows: transfers, count: total } = await AssetTransfer.findAndCountAll({
        where,
        include: [
            { model: TransferApproval, as: 'approvals' },
            { model: TransferStatusHistory, as: 'statusHistory' },
        ],
        ...options,
    });
    return { transfers, total };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    AssetTransfer,
    TransferApproval,
    TransferStatusHistory,
    TransferAuditLog,
    TransferTemplate,
    // Transfer Management
    initiateAssetTransfer,
    generateTransferNumber,
    updateTransferStatus,
    submitTransferForApproval,
    approveTransferRequest,
    getTransferWithApprovals,
    // Shipping and Logistics
    assignShippingDetails,
    trackTransferShipment,
    recordDepartureVerification,
    recordArrivalVerification,
    // Cost Management
    calculateTransferCost,
    allocateTransferCost,
    // Completion
    completeTransfer,
    cancelTransfer,
    // Bulk Operations
    initiateBulkTransfer,
    bulkApproveTransfers,
    // Templates
    createTransferTemplate,
    createTransferFromTemplate,
    // Audit and Reporting
    getTransferAuditTrail,
    getTransferStatusHistory,
    generateTransferReport,
    searchTransfers,
};
//# sourceMappingURL=asset-transfer-commands.js.map