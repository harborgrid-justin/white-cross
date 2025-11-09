"use strict";
/**
 * ASSET CONFIGURATION COMMAND FUNCTIONS
 *
 * Enterprise-grade asset configuration management system providing comprehensive
 * functionality for configuration items, baselines, change management, version control,
 * configuration audits, CMDB integration, and drift detection. Competes with ServiceNow CMDB
 * and BMC Helix CMDB solutions.
 *
 * Features:
 * - Configuration Item (CI) management
 * - Configuration baselines and snapshots
 * - Change control and approval workflows
 * - Version control and history tracking
 * - Configuration drift detection
 * - CMDB integration and synchronization
 * - Relationship mapping (CI dependencies)
 * - Configuration audits and compliance
 * - Impact analysis
 * - Rollback and restore capabilities
 *
 * @module AssetConfigurationCommands
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
 *   createConfigurationItem,
 *   createBaseline,
 *   detectConfigurationDrift,
 *   createChangeRequest,
 *   ConfigurationItem,
 *   ChangeRequestStatus
 * } from './asset-configuration-commands';
 *
 * // Create configuration item
 * const ci = await createConfigurationItem({
 *   assetId: 'asset-123',
 *   ciType: CIType.SERVER,
 *   attributes: {
 *     hostname: 'prod-web-01',
 *     os: 'Ubuntu 22.04',
 *     cpu: '8 cores',
 *     memory: '32GB'
 *   },
 *   version: '1.0.0'
 * });
 *
 * // Create baseline
 * const baseline = await createBaseline({
 *   name: 'Production Baseline Q4 2024',
 *   ciIds: ['ci-1', 'ci-2', 'ci-3'],
 *   approvedBy: 'manager-456'
 * });
 * ```
 */
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationVersionHistory = exports.ConfigurationAudit = exports.DriftRecord = exports.ConfigurationSnapshot = exports.CIRelationship = exports.ChangeRequest = exports.ConfigurationBaseline = exports.ConfigurationItem = exports.BaselineStatus = exports.AuditStatus = exports.DriftStatus = exports.RelationshipType = exports.ChangeType = exports.ChangePriority = exports.ChangeRequestStatus = exports.CIStatus = exports.CIType = void 0;
exports.createConfigurationItem = createConfigurationItem;
exports.updateConfigurationItem = updateConfigurationItem;
exports.getConfigurationItem = getConfigurationItem;
exports.getConfigurationItemsByType = getConfigurationItemsByType;
exports.getConfigurationItemsByEnvironment = getConfigurationItemsByEnvironment;
exports.verifyConfigurationItem = verifyConfigurationItem;
exports.decommissionConfigurationItem = decommissionConfigurationItem;
exports.createBaseline = createBaseline;
exports.approveBaseline = approveBaseline;
exports.activateBaseline = activateBaseline;
exports.getActiveBaselines = getActiveBaselines;
exports.compareToBaseline = compareToBaseline;
exports.createChangeRequest = createChangeRequest;
exports.submitChangeRequest = submitChangeRequest;
exports.approveChangeRequest = approveChangeRequest;
exports.rejectChangeRequest = rejectChangeRequest;
exports.implementChangeRequest = implementChangeRequest;
exports.rollbackChangeRequest = rollbackChangeRequest;
exports.getChangeRequestsByStatus = getChangeRequestsByStatus;
exports.analyzeChangeImpact = analyzeChangeImpact;
exports.createCIRelationship = createCIRelationship;
exports.removeCIRelationship = removeCIRelationship;
exports.getCIRelationships = getCIRelationships;
exports.getCIDependencyTree = getCIDependencyTree;
exports.createConfigurationSnapshot = createConfigurationSnapshot;
exports.getCISnapshots = getCISnapshots;
exports.restoreFromSnapshot = restoreFromSnapshot;
exports.detectConfigurationDrift = detectConfigurationDrift;
exports.scanForDrift = scanForDrift;
exports.remediateDrift = remediateDrift;
exports.getDriftRecordsByStatus = getDriftRecordsByStatus;
exports.createConfigurationAudit = createConfigurationAudit;
exports.startConfigurationAudit = startConfigurationAudit;
exports.completeConfigurationAudit = completeConfigurationAudit;
exports.getAuditsByStatus = getAuditsByStatus;
exports.getVersionHistory = getVersionHistory;
exports.compareVersions = compareVersions;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Configuration Item Type
 */
var CIType;
(function (CIType) {
    CIType["SERVER"] = "server";
    CIType["NETWORK_DEVICE"] = "network_device";
    CIType["STORAGE"] = "storage";
    CIType["DATABASE"] = "database";
    CIType["APPLICATION"] = "application";
    CIType["MIDDLEWARE"] = "middleware";
    CIType["WORKSTATION"] = "workstation";
    CIType["MOBILE_DEVICE"] = "mobile_device";
    CIType["VIRTUAL_MACHINE"] = "virtual_machine";
    CIType["CONTAINER"] = "container";
    CIType["CLOUD_SERVICE"] = "cloud_service";
    CIType["FACILITY"] = "facility";
    CIType["MANUFACTURING_EQUIPMENT"] = "manufacturing_equipment";
    CIType["VEHICLE"] = "vehicle";
})(CIType || (exports.CIType = CIType = {}));
/**
 * CI Status
 */
var CIStatus;
(function (CIStatus) {
    CIStatus["PLANNED"] = "planned";
    CIStatus["IN_DEVELOPMENT"] = "in_development";
    CIStatus["IN_TESTING"] = "in_testing";
    CIStatus["OPERATIONAL"] = "operational";
    CIStatus["MAINTENANCE"] = "maintenance";
    CIStatus["RETIRED"] = "retired";
    CIStatus["DECOMMISSIONED"] = "decommissioned";
})(CIStatus || (exports.CIStatus = CIStatus = {}));
/**
 * Change Request Status
 */
var ChangeRequestStatus;
(function (ChangeRequestStatus) {
    ChangeRequestStatus["DRAFT"] = "draft";
    ChangeRequestStatus["SUBMITTED"] = "submitted";
    ChangeRequestStatus["UNDER_REVIEW"] = "under_review";
    ChangeRequestStatus["APPROVED"] = "approved";
    ChangeRequestStatus["REJECTED"] = "rejected";
    ChangeRequestStatus["SCHEDULED"] = "scheduled";
    ChangeRequestStatus["IN_PROGRESS"] = "in_progress";
    ChangeRequestStatus["COMPLETED"] = "completed";
    ChangeRequestStatus["CANCELLED"] = "cancelled";
    ChangeRequestStatus["ROLLED_BACK"] = "rolled_back";
})(ChangeRequestStatus || (exports.ChangeRequestStatus = ChangeRequestStatus = {}));
/**
 * Change Priority
 */
var ChangePriority;
(function (ChangePriority) {
    ChangePriority["CRITICAL"] = "critical";
    ChangePriority["HIGH"] = "high";
    ChangePriority["MEDIUM"] = "medium";
    ChangePriority["LOW"] = "low";
})(ChangePriority || (exports.ChangePriority = ChangePriority = {}));
/**
 * Change Type
 */
var ChangeType;
(function (ChangeType) {
    ChangeType["STANDARD"] = "standard";
    ChangeType["NORMAL"] = "normal";
    ChangeType["EMERGENCY"] = "emergency";
    ChangeType["MAJOR"] = "major";
})(ChangeType || (exports.ChangeType = ChangeType = {}));
/**
 * Relationship Type
 */
var RelationshipType;
(function (RelationshipType) {
    RelationshipType["DEPENDS_ON"] = "depends_on";
    RelationshipType["HOSTED_ON"] = "hosted_on";
    RelationshipType["CONNECTED_TO"] = "connected_to";
    RelationshipType["USES"] = "uses";
    RelationshipType["PART_OF"] = "part_of";
    RelationshipType["MANAGES"] = "manages";
    RelationshipType["RUNS_ON"] = "runs_on";
    RelationshipType["BACKED_UP_BY"] = "backed_up_by";
    RelationshipType["REPLICATED_TO"] = "replicated_to";
})(RelationshipType || (exports.RelationshipType = RelationshipType = {}));
/**
 * Drift Status
 */
var DriftStatus;
(function (DriftStatus) {
    DriftStatus["COMPLIANT"] = "compliant";
    DriftStatus["DRIFT_DETECTED"] = "drift_detected";
    DriftStatus["CRITICAL_DRIFT"] = "critical_drift";
    DriftStatus["REVIEWING"] = "reviewing";
    DriftStatus["REMEDIATED"] = "remediated";
})(DriftStatus || (exports.DriftStatus = DriftStatus = {}));
/**
 * Audit Status
 */
var AuditStatus;
(function (AuditStatus) {
    AuditStatus["SCHEDULED"] = "scheduled";
    AuditStatus["IN_PROGRESS"] = "in_progress";
    AuditStatus["COMPLETED"] = "completed";
    AuditStatus["FAILED"] = "failed";
    AuditStatus["CANCELLED"] = "cancelled";
})(AuditStatus || (exports.AuditStatus = AuditStatus = {}));
/**
 * Baseline Status
 */
var BaselineStatus;
(function (BaselineStatus) {
    BaselineStatus["DRAFT"] = "draft";
    BaselineStatus["APPROVED"] = "approved";
    BaselineStatus["ACTIVE"] = "active";
    BaselineStatus["ARCHIVED"] = "archived";
    BaselineStatus["DEPRECATED"] = "deprecated";
})(BaselineStatus || (exports.BaselineStatus = BaselineStatus = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Configuration Item Model
 */
let ConfigurationItem = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'configuration_items',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['ci_number'], unique: true },
                { fields: ['asset_id'], unique: true },
                { fields: ['ci_type'] },
                { fields: ['status'] },
                { fields: ['environment'] },
                { fields: ['owner'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateCINumber_decorators;
    let _static_updateChecksum_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _ciNumber_decorators;
    let _ciNumber_initializers = [];
    let _ciNumber_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _ciType_decorators;
    let _ciType_initializers = [];
    let _ciType_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _attributes_decorators;
    let _attributes_initializers = [];
    let _attributes_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _owner_decorators;
    let _owner_initializers = [];
    let _owner_extraInitializers = [];
    let _custodian_decorators;
    let _custodian_initializers = [];
    let _custodian_extraInitializers = [];
    let _location_decorators;
    let _location_initializers = [];
    let _location_extraInitializers = [];
    let _environment_decorators;
    let _environment_initializers = [];
    let _environment_extraInitializers = [];
    let _criticality_decorators;
    let _criticality_initializers = [];
    let _criticality_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _lastVerifiedDate_decorators;
    let _lastVerifiedDate_initializers = [];
    let _lastVerifiedDate_extraInitializers = [];
    let _lastModifiedBy_decorators;
    let _lastModifiedBy_initializers = [];
    let _lastModifiedBy_extraInitializers = [];
    let _checksum_decorators;
    let _checksum_initializers = [];
    let _checksum_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _snapshots_decorators;
    let _snapshots_initializers = [];
    let _snapshots_extraInitializers = [];
    let _outgoingRelationships_decorators;
    let _outgoingRelationships_initializers = [];
    let _outgoingRelationships_extraInitializers = [];
    let _incomingRelationships_decorators;
    let _incomingRelationships_initializers = [];
    let _incomingRelationships_extraInitializers = [];
    let _changeRequests_decorators;
    let _changeRequests_initializers = [];
    let _changeRequests_extraInitializers = [];
    var ConfigurationItem = _classThis = class extends _classSuper {
        static async generateCINumber(instance) {
            if (!instance.ciNumber) {
                const count = await ConfigurationItem.count();
                const prefix = instance.ciType.toUpperCase().substring(0, 3);
                instance.ciNumber = `CI-${prefix}-${String(count + 1).padStart(7, '0')}`;
            }
        }
        static async updateChecksum(instance) {
            if (instance.changed('attributes')) {
                const crypto = require('crypto');
                const hash = crypto.createHash('sha256');
                hash.update(JSON.stringify(instance.attributes));
                instance.checksum = hash.digest('hex');
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.ciNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _ciNumber_initializers, void 0));
            this.assetId = (__runInitializers(this, _ciNumber_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.ciType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _ciType_initializers, void 0));
            this.name = (__runInitializers(this, _ciType_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.attributes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _attributes_initializers, void 0));
            this.version = (__runInitializers(this, _attributes_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.owner = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _owner_initializers, void 0));
            this.custodian = (__runInitializers(this, _owner_extraInitializers), __runInitializers(this, _custodian_initializers, void 0));
            this.location = (__runInitializers(this, _custodian_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            this.environment = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _environment_initializers, void 0));
            this.criticality = (__runInitializers(this, _environment_extraInitializers), __runInitializers(this, _criticality_initializers, void 0));
            this.tags = (__runInitializers(this, _criticality_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.lastVerifiedDate = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _lastVerifiedDate_initializers, void 0));
            this.lastModifiedBy = (__runInitializers(this, _lastVerifiedDate_extraInitializers), __runInitializers(this, _lastModifiedBy_initializers, void 0));
            this.checksum = (__runInitializers(this, _lastModifiedBy_extraInitializers), __runInitializers(this, _checksum_initializers, void 0));
            this.createdAt = (__runInitializers(this, _checksum_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.snapshots = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _snapshots_initializers, void 0));
            this.outgoingRelationships = (__runInitializers(this, _snapshots_extraInitializers), __runInitializers(this, _outgoingRelationships_initializers, void 0));
            this.incomingRelationships = (__runInitializers(this, _outgoingRelationships_extraInitializers), __runInitializers(this, _incomingRelationships_initializers, void 0));
            this.changeRequests = (__runInitializers(this, _incomingRelationships_extraInitializers), __runInitializers(this, _changeRequests_initializers, void 0));
            __runInitializers(this, _changeRequests_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConfigurationItem");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _ciNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'CI number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _ciType_decorators = [(0, swagger_1.ApiProperty)({ description: 'CI type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(CIType)), allowNull: false }), sequelize_typescript_1.Index];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(CIStatus)), defaultValue: CIStatus.PLANNED }), sequelize_typescript_1.Index];
        _attributes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Configuration attributes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _version_decorators = [(0, swagger_1.ApiProperty)({ description: 'Version' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false })];
        _owner_decorators = [(0, swagger_1.ApiProperty)({ description: 'Owner user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _custodian_decorators = [(0, swagger_1.ApiProperty)({ description: 'Custodian user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _location_decorators = [(0, swagger_1.ApiProperty)({ description: 'Location' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _environment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Environment' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) }), sequelize_typescript_1.Index];
        _criticality_decorators = [(0, swagger_1.ApiProperty)({ description: 'Criticality level' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _tags_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tags' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _lastVerifiedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last verified date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _lastModifiedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last modified by' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _checksum_decorators = [(0, swagger_1.ApiProperty)({ description: 'Checksum for drift detection' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _snapshots_decorators = [(0, sequelize_typescript_1.HasMany)(() => ConfigurationSnapshot)];
        _outgoingRelationships_decorators = [(0, sequelize_typescript_1.HasMany)(() => CIRelationship, 'sourceCI')];
        _incomingRelationships_decorators = [(0, sequelize_typescript_1.HasMany)(() => CIRelationship, 'targetCI')];
        _changeRequests_decorators = [(0, sequelize_typescript_1.HasMany)(() => ChangeRequest)];
        _static_generateCINumber_decorators = [sequelize_typescript_1.BeforeCreate];
        _static_updateChecksum_decorators = [sequelize_typescript_1.BeforeUpdate];
        __esDecorate(_classThis, null, _static_generateCINumber_decorators, { kind: "method", name: "generateCINumber", static: true, private: false, access: { has: obj => "generateCINumber" in obj, get: obj => obj.generateCINumber }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(_classThis, null, _static_updateChecksum_decorators, { kind: "method", name: "updateChecksum", static: true, private: false, access: { has: obj => "updateChecksum" in obj, get: obj => obj.updateChecksum }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _ciNumber_decorators, { kind: "field", name: "ciNumber", static: false, private: false, access: { has: obj => "ciNumber" in obj, get: obj => obj.ciNumber, set: (obj, value) => { obj.ciNumber = value; } }, metadata: _metadata }, _ciNumber_initializers, _ciNumber_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _ciType_decorators, { kind: "field", name: "ciType", static: false, private: false, access: { has: obj => "ciType" in obj, get: obj => obj.ciType, set: (obj, value) => { obj.ciType = value; } }, metadata: _metadata }, _ciType_initializers, _ciType_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _attributes_decorators, { kind: "field", name: "attributes", static: false, private: false, access: { has: obj => "attributes" in obj, get: obj => obj.attributes, set: (obj, value) => { obj.attributes = value; } }, metadata: _metadata }, _attributes_initializers, _attributes_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _owner_decorators, { kind: "field", name: "owner", static: false, private: false, access: { has: obj => "owner" in obj, get: obj => obj.owner, set: (obj, value) => { obj.owner = value; } }, metadata: _metadata }, _owner_initializers, _owner_extraInitializers);
        __esDecorate(null, null, _custodian_decorators, { kind: "field", name: "custodian", static: false, private: false, access: { has: obj => "custodian" in obj, get: obj => obj.custodian, set: (obj, value) => { obj.custodian = value; } }, metadata: _metadata }, _custodian_initializers, _custodian_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: obj => "location" in obj, get: obj => obj.location, set: (obj, value) => { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, null, _environment_decorators, { kind: "field", name: "environment", static: false, private: false, access: { has: obj => "environment" in obj, get: obj => obj.environment, set: (obj, value) => { obj.environment = value; } }, metadata: _metadata }, _environment_initializers, _environment_extraInitializers);
        __esDecorate(null, null, _criticality_decorators, { kind: "field", name: "criticality", static: false, private: false, access: { has: obj => "criticality" in obj, get: obj => obj.criticality, set: (obj, value) => { obj.criticality = value; } }, metadata: _metadata }, _criticality_initializers, _criticality_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _lastVerifiedDate_decorators, { kind: "field", name: "lastVerifiedDate", static: false, private: false, access: { has: obj => "lastVerifiedDate" in obj, get: obj => obj.lastVerifiedDate, set: (obj, value) => { obj.lastVerifiedDate = value; } }, metadata: _metadata }, _lastVerifiedDate_initializers, _lastVerifiedDate_extraInitializers);
        __esDecorate(null, null, _lastModifiedBy_decorators, { kind: "field", name: "lastModifiedBy", static: false, private: false, access: { has: obj => "lastModifiedBy" in obj, get: obj => obj.lastModifiedBy, set: (obj, value) => { obj.lastModifiedBy = value; } }, metadata: _metadata }, _lastModifiedBy_initializers, _lastModifiedBy_extraInitializers);
        __esDecorate(null, null, _checksum_decorators, { kind: "field", name: "checksum", static: false, private: false, access: { has: obj => "checksum" in obj, get: obj => obj.checksum, set: (obj, value) => { obj.checksum = value; } }, metadata: _metadata }, _checksum_initializers, _checksum_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _snapshots_decorators, { kind: "field", name: "snapshots", static: false, private: false, access: { has: obj => "snapshots" in obj, get: obj => obj.snapshots, set: (obj, value) => { obj.snapshots = value; } }, metadata: _metadata }, _snapshots_initializers, _snapshots_extraInitializers);
        __esDecorate(null, null, _outgoingRelationships_decorators, { kind: "field", name: "outgoingRelationships", static: false, private: false, access: { has: obj => "outgoingRelationships" in obj, get: obj => obj.outgoingRelationships, set: (obj, value) => { obj.outgoingRelationships = value; } }, metadata: _metadata }, _outgoingRelationships_initializers, _outgoingRelationships_extraInitializers);
        __esDecorate(null, null, _incomingRelationships_decorators, { kind: "field", name: "incomingRelationships", static: false, private: false, access: { has: obj => "incomingRelationships" in obj, get: obj => obj.incomingRelationships, set: (obj, value) => { obj.incomingRelationships = value; } }, metadata: _metadata }, _incomingRelationships_initializers, _incomingRelationships_extraInitializers);
        __esDecorate(null, null, _changeRequests_decorators, { kind: "field", name: "changeRequests", static: false, private: false, access: { has: obj => "changeRequests" in obj, get: obj => obj.changeRequests, set: (obj, value) => { obj.changeRequests = value; } }, metadata: _metadata }, _changeRequests_initializers, _changeRequests_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConfigurationItem = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConfigurationItem = _classThis;
})();
exports.ConfigurationItem = ConfigurationItem;
/**
 * Configuration Baseline Model
 */
let ConfigurationBaseline = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'configuration_baselines',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['baseline_number'], unique: true },
                { fields: ['status'] },
                { fields: ['effective_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateBaselineNumber_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _baselineNumber_decorators;
    let _baselineNumber_initializers = [];
    let _baselineNumber_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _configurationSnapshot_decorators;
    let _configurationSnapshot_initializers = [];
    let _configurationSnapshot_extraInitializers = [];
    let _ciIds_decorators;
    let _ciIds_initializers = [];
    let _ciIds_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvalDate_decorators;
    let _approvalDate_initializers = [];
    let _approvalDate_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _driftRecords_decorators;
    let _driftRecords_initializers = [];
    let _driftRecords_extraInitializers = [];
    var ConfigurationBaseline = _classThis = class extends _classSuper {
        static async generateBaselineNumber(instance) {
            if (!instance.baselineNumber) {
                const count = await ConfigurationBaseline.count();
                const year = new Date().getFullYear();
                instance.baselineNumber = `BL-${year}-${String(count + 1).padStart(6, '0')}`;
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.baselineNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _baselineNumber_initializers, void 0));
            this.name = (__runInitializers(this, _baselineNumber_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.configurationSnapshot = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _configurationSnapshot_initializers, void 0));
            this.ciIds = (__runInitializers(this, _configurationSnapshot_extraInitializers), __runInitializers(this, _ciIds_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _ciIds_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvalDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _approvalDate_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.tags = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.createdAt = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.driftRecords = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _driftRecords_initializers, void 0));
            __runInitializers(this, _driftRecords_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConfigurationBaseline");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _baselineNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Baseline number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(BaselineStatus)), defaultValue: BaselineStatus.DRAFT }), sequelize_typescript_1.Index];
        _configurationSnapshot_decorators = [(0, swagger_1.ApiProperty)({ description: 'Configuration snapshot' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _ciIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Included CI IDs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID), allowNull: false })];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _approvalDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _expirationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expiration date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _tags_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tags' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _driftRecords_decorators = [(0, sequelize_typescript_1.HasMany)(() => DriftRecord)];
        _static_generateBaselineNumber_decorators = [sequelize_typescript_1.BeforeCreate];
        __esDecorate(_classThis, null, _static_generateBaselineNumber_decorators, { kind: "method", name: "generateBaselineNumber", static: true, private: false, access: { has: obj => "generateBaselineNumber" in obj, get: obj => obj.generateBaselineNumber }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _baselineNumber_decorators, { kind: "field", name: "baselineNumber", static: false, private: false, access: { has: obj => "baselineNumber" in obj, get: obj => obj.baselineNumber, set: (obj, value) => { obj.baselineNumber = value; } }, metadata: _metadata }, _baselineNumber_initializers, _baselineNumber_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _configurationSnapshot_decorators, { kind: "field", name: "configurationSnapshot", static: false, private: false, access: { has: obj => "configurationSnapshot" in obj, get: obj => obj.configurationSnapshot, set: (obj, value) => { obj.configurationSnapshot = value; } }, metadata: _metadata }, _configurationSnapshot_initializers, _configurationSnapshot_extraInitializers);
        __esDecorate(null, null, _ciIds_decorators, { kind: "field", name: "ciIds", static: false, private: false, access: { has: obj => "ciIds" in obj, get: obj => obj.ciIds, set: (obj, value) => { obj.ciIds = value; } }, metadata: _metadata }, _ciIds_initializers, _ciIds_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: obj => "approvalDate" in obj, get: obj => obj.approvalDate, set: (obj, value) => { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _driftRecords_decorators, { kind: "field", name: "driftRecords", static: false, private: false, access: { has: obj => "driftRecords" in obj, get: obj => obj.driftRecords, set: (obj, value) => { obj.driftRecords = value; } }, metadata: _metadata }, _driftRecords_initializers, _driftRecords_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConfigurationBaseline = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConfigurationBaseline = _classThis;
})();
exports.ConfigurationBaseline = ConfigurationBaseline;
/**
 * Change Request Model
 */
let ChangeRequest = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'change_requests',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['change_number'], unique: true },
                { fields: ['ci_id'] },
                { fields: ['status'] },
                { fields: ['priority'] },
                { fields: ['requested_by'] },
                { fields: ['scheduled_start_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateChangeNumber_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _changeNumber_decorators;
    let _changeNumber_initializers = [];
    let _changeNumber_extraInitializers = [];
    let _ciId_decorators;
    let _ciId_initializers = [];
    let _ciId_extraInitializers = [];
    let _changeType_decorators;
    let _changeType_initializers = [];
    let _changeType_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _justification_decorators;
    let _justification_initializers = [];
    let _justification_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _proposedChanges_decorators;
    let _proposedChanges_initializers = [];
    let _proposedChanges_extraInitializers = [];
    let _implementationPlan_decorators;
    let _implementationPlan_initializers = [];
    let _implementationPlan_extraInitializers = [];
    let _rollbackPlan_decorators;
    let _rollbackPlan_initializers = [];
    let _rollbackPlan_extraInitializers = [];
    let _scheduledStartDate_decorators;
    let _scheduledStartDate_initializers = [];
    let _scheduledStartDate_extraInitializers = [];
    let _scheduledEndDate_decorators;
    let _scheduledEndDate_initializers = [];
    let _scheduledEndDate_extraInitializers = [];
    let _actualStartDate_decorators;
    let _actualStartDate_initializers = [];
    let _actualStartDate_extraInitializers = [];
    let _actualEndDate_decorators;
    let _actualEndDate_initializers = [];
    let _actualEndDate_extraInitializers = [];
    let _impactedCIs_decorators;
    let _impactedCIs_initializers = [];
    let _impactedCIs_extraInitializers = [];
    let _requiredApprovers_decorators;
    let _requiredApprovers_initializers = [];
    let _requiredApprovers_extraInitializers = [];
    let _approvals_decorators;
    let _approvals_initializers = [];
    let _approvals_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _riskAssessment_decorators;
    let _riskAssessment_initializers = [];
    let _riskAssessment_extraInitializers = [];
    let _implementedBy_decorators;
    let _implementedBy_initializers = [];
    let _implementedBy_extraInitializers = [];
    let _implementationNotes_decorators;
    let _implementationNotes_initializers = [];
    let _implementationNotes_extraInitializers = [];
    let _rollbackPerformed_decorators;
    let _rollbackPerformed_initializers = [];
    let _rollbackPerformed_extraInitializers = [];
    let _rollbackReason_decorators;
    let _rollbackReason_initializers = [];
    let _rollbackReason_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _configurationItem_decorators;
    let _configurationItem_initializers = [];
    let _configurationItem_extraInitializers = [];
    var ChangeRequest = _classThis = class extends _classSuper {
        static async generateChangeNumber(instance) {
            if (!instance.changeNumber) {
                const count = await ChangeRequest.count();
                const year = new Date().getFullYear();
                const prefix = instance.changeType.substring(0, 1).toUpperCase();
                instance.changeNumber = `CHG-${prefix}${year}-${String(count + 1).padStart(6, '0')}`;
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.changeNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _changeNumber_initializers, void 0));
            this.ciId = (__runInitializers(this, _changeNumber_extraInitializers), __runInitializers(this, _ciId_initializers, void 0));
            this.changeType = (__runInitializers(this, _ciId_extraInitializers), __runInitializers(this, _changeType_initializers, void 0));
            this.priority = (__runInitializers(this, _changeType_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.status = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.title = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.justification = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _justification_initializers, void 0));
            this.requestedBy = (__runInitializers(this, _justification_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
            this.proposedChanges = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _proposedChanges_initializers, void 0));
            this.implementationPlan = (__runInitializers(this, _proposedChanges_extraInitializers), __runInitializers(this, _implementationPlan_initializers, void 0));
            this.rollbackPlan = (__runInitializers(this, _implementationPlan_extraInitializers), __runInitializers(this, _rollbackPlan_initializers, void 0));
            this.scheduledStartDate = (__runInitializers(this, _rollbackPlan_extraInitializers), __runInitializers(this, _scheduledStartDate_initializers, void 0));
            this.scheduledEndDate = (__runInitializers(this, _scheduledStartDate_extraInitializers), __runInitializers(this, _scheduledEndDate_initializers, void 0));
            this.actualStartDate = (__runInitializers(this, _scheduledEndDate_extraInitializers), __runInitializers(this, _actualStartDate_initializers, void 0));
            this.actualEndDate = (__runInitializers(this, _actualStartDate_extraInitializers), __runInitializers(this, _actualEndDate_initializers, void 0));
            this.impactedCIs = (__runInitializers(this, _actualEndDate_extraInitializers), __runInitializers(this, _impactedCIs_initializers, void 0));
            this.requiredApprovers = (__runInitializers(this, _impactedCIs_extraInitializers), __runInitializers(this, _requiredApprovers_initializers, void 0));
            this.approvals = (__runInitializers(this, _requiredApprovers_extraInitializers), __runInitializers(this, _approvals_initializers, void 0));
            this.attachments = (__runInitializers(this, _approvals_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.riskAssessment = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _riskAssessment_initializers, void 0));
            this.implementedBy = (__runInitializers(this, _riskAssessment_extraInitializers), __runInitializers(this, _implementedBy_initializers, void 0));
            this.implementationNotes = (__runInitializers(this, _implementedBy_extraInitializers), __runInitializers(this, _implementationNotes_initializers, void 0));
            this.rollbackPerformed = (__runInitializers(this, _implementationNotes_extraInitializers), __runInitializers(this, _rollbackPerformed_initializers, void 0));
            this.rollbackReason = (__runInitializers(this, _rollbackPerformed_extraInitializers), __runInitializers(this, _rollbackReason_initializers, void 0));
            this.createdAt = (__runInitializers(this, _rollbackReason_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.configurationItem = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _configurationItem_initializers, void 0));
            __runInitializers(this, _configurationItem_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ChangeRequest");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _changeNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Change number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _ciId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Configuration Item ID' }), (0, sequelize_typescript_1.ForeignKey)(() => ConfigurationItem), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _changeType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Change type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ChangeType)), allowNull: false })];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ChangePriority)), allowNull: false }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ChangeRequestStatus)), defaultValue: ChangeRequestStatus.DRAFT }), sequelize_typescript_1.Index];
        _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Title' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(300), allowNull: false })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _justification_decorators = [(0, swagger_1.ApiProperty)({ description: 'Justification' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _requestedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requested by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _proposedChanges_decorators = [(0, swagger_1.ApiProperty)({ description: 'Proposed changes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _implementationPlan_decorators = [(0, swagger_1.ApiProperty)({ description: 'Implementation plan' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _rollbackPlan_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rollback plan' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _scheduledStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled start date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }), sequelize_typescript_1.Index];
        _scheduledEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled end date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _actualStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual start date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _actualEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual end date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _impactedCIs_decorators = [(0, swagger_1.ApiProperty)({ description: 'Impacted CI IDs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID) })];
        _requiredApprovers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Required approvers' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID) })];
        _approvals_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approvals' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _attachments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attachments' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _riskAssessment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Risk assessment' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _implementedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Implemented by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _implementationNotes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Implementation notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _rollbackPerformed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rollback performed' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _rollbackReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rollback reason' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _configurationItem_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ConfigurationItem)];
        _static_generateChangeNumber_decorators = [sequelize_typescript_1.BeforeCreate];
        __esDecorate(_classThis, null, _static_generateChangeNumber_decorators, { kind: "method", name: "generateChangeNumber", static: true, private: false, access: { has: obj => "generateChangeNumber" in obj, get: obj => obj.generateChangeNumber }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _changeNumber_decorators, { kind: "field", name: "changeNumber", static: false, private: false, access: { has: obj => "changeNumber" in obj, get: obj => obj.changeNumber, set: (obj, value) => { obj.changeNumber = value; } }, metadata: _metadata }, _changeNumber_initializers, _changeNumber_extraInitializers);
        __esDecorate(null, null, _ciId_decorators, { kind: "field", name: "ciId", static: false, private: false, access: { has: obj => "ciId" in obj, get: obj => obj.ciId, set: (obj, value) => { obj.ciId = value; } }, metadata: _metadata }, _ciId_initializers, _ciId_extraInitializers);
        __esDecorate(null, null, _changeType_decorators, { kind: "field", name: "changeType", static: false, private: false, access: { has: obj => "changeType" in obj, get: obj => obj.changeType, set: (obj, value) => { obj.changeType = value; } }, metadata: _metadata }, _changeType_initializers, _changeType_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _justification_decorators, { kind: "field", name: "justification", static: false, private: false, access: { has: obj => "justification" in obj, get: obj => obj.justification, set: (obj, value) => { obj.justification = value; } }, metadata: _metadata }, _justification_initializers, _justification_extraInitializers);
        __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
        __esDecorate(null, null, _proposedChanges_decorators, { kind: "field", name: "proposedChanges", static: false, private: false, access: { has: obj => "proposedChanges" in obj, get: obj => obj.proposedChanges, set: (obj, value) => { obj.proposedChanges = value; } }, metadata: _metadata }, _proposedChanges_initializers, _proposedChanges_extraInitializers);
        __esDecorate(null, null, _implementationPlan_decorators, { kind: "field", name: "implementationPlan", static: false, private: false, access: { has: obj => "implementationPlan" in obj, get: obj => obj.implementationPlan, set: (obj, value) => { obj.implementationPlan = value; } }, metadata: _metadata }, _implementationPlan_initializers, _implementationPlan_extraInitializers);
        __esDecorate(null, null, _rollbackPlan_decorators, { kind: "field", name: "rollbackPlan", static: false, private: false, access: { has: obj => "rollbackPlan" in obj, get: obj => obj.rollbackPlan, set: (obj, value) => { obj.rollbackPlan = value; } }, metadata: _metadata }, _rollbackPlan_initializers, _rollbackPlan_extraInitializers);
        __esDecorate(null, null, _scheduledStartDate_decorators, { kind: "field", name: "scheduledStartDate", static: false, private: false, access: { has: obj => "scheduledStartDate" in obj, get: obj => obj.scheduledStartDate, set: (obj, value) => { obj.scheduledStartDate = value; } }, metadata: _metadata }, _scheduledStartDate_initializers, _scheduledStartDate_extraInitializers);
        __esDecorate(null, null, _scheduledEndDate_decorators, { kind: "field", name: "scheduledEndDate", static: false, private: false, access: { has: obj => "scheduledEndDate" in obj, get: obj => obj.scheduledEndDate, set: (obj, value) => { obj.scheduledEndDate = value; } }, metadata: _metadata }, _scheduledEndDate_initializers, _scheduledEndDate_extraInitializers);
        __esDecorate(null, null, _actualStartDate_decorators, { kind: "field", name: "actualStartDate", static: false, private: false, access: { has: obj => "actualStartDate" in obj, get: obj => obj.actualStartDate, set: (obj, value) => { obj.actualStartDate = value; } }, metadata: _metadata }, _actualStartDate_initializers, _actualStartDate_extraInitializers);
        __esDecorate(null, null, _actualEndDate_decorators, { kind: "field", name: "actualEndDate", static: false, private: false, access: { has: obj => "actualEndDate" in obj, get: obj => obj.actualEndDate, set: (obj, value) => { obj.actualEndDate = value; } }, metadata: _metadata }, _actualEndDate_initializers, _actualEndDate_extraInitializers);
        __esDecorate(null, null, _impactedCIs_decorators, { kind: "field", name: "impactedCIs", static: false, private: false, access: { has: obj => "impactedCIs" in obj, get: obj => obj.impactedCIs, set: (obj, value) => { obj.impactedCIs = value; } }, metadata: _metadata }, _impactedCIs_initializers, _impactedCIs_extraInitializers);
        __esDecorate(null, null, _requiredApprovers_decorators, { kind: "field", name: "requiredApprovers", static: false, private: false, access: { has: obj => "requiredApprovers" in obj, get: obj => obj.requiredApprovers, set: (obj, value) => { obj.requiredApprovers = value; } }, metadata: _metadata }, _requiredApprovers_initializers, _requiredApprovers_extraInitializers);
        __esDecorate(null, null, _approvals_decorators, { kind: "field", name: "approvals", static: false, private: false, access: { has: obj => "approvals" in obj, get: obj => obj.approvals, set: (obj, value) => { obj.approvals = value; } }, metadata: _metadata }, _approvals_initializers, _approvals_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _riskAssessment_decorators, { kind: "field", name: "riskAssessment", static: false, private: false, access: { has: obj => "riskAssessment" in obj, get: obj => obj.riskAssessment, set: (obj, value) => { obj.riskAssessment = value; } }, metadata: _metadata }, _riskAssessment_initializers, _riskAssessment_extraInitializers);
        __esDecorate(null, null, _implementedBy_decorators, { kind: "field", name: "implementedBy", static: false, private: false, access: { has: obj => "implementedBy" in obj, get: obj => obj.implementedBy, set: (obj, value) => { obj.implementedBy = value; } }, metadata: _metadata }, _implementedBy_initializers, _implementedBy_extraInitializers);
        __esDecorate(null, null, _implementationNotes_decorators, { kind: "field", name: "implementationNotes", static: false, private: false, access: { has: obj => "implementationNotes" in obj, get: obj => obj.implementationNotes, set: (obj, value) => { obj.implementationNotes = value; } }, metadata: _metadata }, _implementationNotes_initializers, _implementationNotes_extraInitializers);
        __esDecorate(null, null, _rollbackPerformed_decorators, { kind: "field", name: "rollbackPerformed", static: false, private: false, access: { has: obj => "rollbackPerformed" in obj, get: obj => obj.rollbackPerformed, set: (obj, value) => { obj.rollbackPerformed = value; } }, metadata: _metadata }, _rollbackPerformed_initializers, _rollbackPerformed_extraInitializers);
        __esDecorate(null, null, _rollbackReason_decorators, { kind: "field", name: "rollbackReason", static: false, private: false, access: { has: obj => "rollbackReason" in obj, get: obj => obj.rollbackReason, set: (obj, value) => { obj.rollbackReason = value; } }, metadata: _metadata }, _rollbackReason_initializers, _rollbackReason_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _configurationItem_decorators, { kind: "field", name: "configurationItem", static: false, private: false, access: { has: obj => "configurationItem" in obj, get: obj => obj.configurationItem, set: (obj, value) => { obj.configurationItem = value; } }, metadata: _metadata }, _configurationItem_initializers, _configurationItem_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ChangeRequest = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ChangeRequest = _classThis;
})();
exports.ChangeRequest = ChangeRequest;
/**
 * CI Relationship Model
 */
let CIRelationship = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'ci_relationships',
            timestamps: true,
            indexes: [
                { fields: ['source_ci'] },
                { fields: ['target_ci'] },
                { fields: ['relationship_type'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _sourceCI_decorators;
    let _sourceCI_initializers = [];
    let _sourceCI_extraInitializers = [];
    let _targetCI_decorators;
    let _targetCI_initializers = [];
    let _targetCI_extraInitializers = [];
    let _relationshipType_decorators;
    let _relationshipType_initializers = [];
    let _relationshipType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _attributes_decorators;
    let _attributes_initializers = [];
    let _attributes_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _establishedDate_decorators;
    let _establishedDate_initializers = [];
    let _establishedDate_extraInitializers = [];
    let _severedDate_decorators;
    let _severedDate_initializers = [];
    let _severedDate_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _sourceConfiguration_decorators;
    let _sourceConfiguration_initializers = [];
    let _sourceConfiguration_extraInitializers = [];
    let _targetConfiguration_decorators;
    let _targetConfiguration_initializers = [];
    let _targetConfiguration_extraInitializers = [];
    var CIRelationship = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.sourceCI = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sourceCI_initializers, void 0));
            this.targetCI = (__runInitializers(this, _sourceCI_extraInitializers), __runInitializers(this, _targetCI_initializers, void 0));
            this.relationshipType = (__runInitializers(this, _targetCI_extraInitializers), __runInitializers(this, _relationshipType_initializers, void 0));
            this.description = (__runInitializers(this, _relationshipType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.attributes = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _attributes_initializers, void 0));
            this.isActive = (__runInitializers(this, _attributes_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.establishedDate = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _establishedDate_initializers, void 0));
            this.severedDate = (__runInitializers(this, _establishedDate_extraInitializers), __runInitializers(this, _severedDate_initializers, void 0));
            this.createdAt = (__runInitializers(this, _severedDate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.sourceConfiguration = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _sourceConfiguration_initializers, void 0));
            this.targetConfiguration = (__runInitializers(this, _sourceConfiguration_extraInitializers), __runInitializers(this, _targetConfiguration_initializers, void 0));
            __runInitializers(this, _targetConfiguration_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CIRelationship");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _sourceCI_decorators = [(0, swagger_1.ApiProperty)({ description: 'Source CI ID' }), (0, sequelize_typescript_1.ForeignKey)(() => ConfigurationItem), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _targetCI_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target CI ID' }), (0, sequelize_typescript_1.ForeignKey)(() => ConfigurationItem), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _relationshipType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Relationship type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(RelationshipType)), allowNull: false }), sequelize_typescript_1.Index];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _attributes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Relationship attributes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _establishedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Established date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, defaultValue: sequelize_typescript_1.DataType.NOW })];
        _severedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Severed date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _sourceConfiguration_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ConfigurationItem, 'sourceCI')];
        _targetConfiguration_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ConfigurationItem, 'targetCI')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _sourceCI_decorators, { kind: "field", name: "sourceCI", static: false, private: false, access: { has: obj => "sourceCI" in obj, get: obj => obj.sourceCI, set: (obj, value) => { obj.sourceCI = value; } }, metadata: _metadata }, _sourceCI_initializers, _sourceCI_extraInitializers);
        __esDecorate(null, null, _targetCI_decorators, { kind: "field", name: "targetCI", static: false, private: false, access: { has: obj => "targetCI" in obj, get: obj => obj.targetCI, set: (obj, value) => { obj.targetCI = value; } }, metadata: _metadata }, _targetCI_initializers, _targetCI_extraInitializers);
        __esDecorate(null, null, _relationshipType_decorators, { kind: "field", name: "relationshipType", static: false, private: false, access: { has: obj => "relationshipType" in obj, get: obj => obj.relationshipType, set: (obj, value) => { obj.relationshipType = value; } }, metadata: _metadata }, _relationshipType_initializers, _relationshipType_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _attributes_decorators, { kind: "field", name: "attributes", static: false, private: false, access: { has: obj => "attributes" in obj, get: obj => obj.attributes, set: (obj, value) => { obj.attributes = value; } }, metadata: _metadata }, _attributes_initializers, _attributes_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _establishedDate_decorators, { kind: "field", name: "establishedDate", static: false, private: false, access: { has: obj => "establishedDate" in obj, get: obj => obj.establishedDate, set: (obj, value) => { obj.establishedDate = value; } }, metadata: _metadata }, _establishedDate_initializers, _establishedDate_extraInitializers);
        __esDecorate(null, null, _severedDate_decorators, { kind: "field", name: "severedDate", static: false, private: false, access: { has: obj => "severedDate" in obj, get: obj => obj.severedDate, set: (obj, value) => { obj.severedDate = value; } }, metadata: _metadata }, _severedDate_initializers, _severedDate_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _sourceConfiguration_decorators, { kind: "field", name: "sourceConfiguration", static: false, private: false, access: { has: obj => "sourceConfiguration" in obj, get: obj => obj.sourceConfiguration, set: (obj, value) => { obj.sourceConfiguration = value; } }, metadata: _metadata }, _sourceConfiguration_initializers, _sourceConfiguration_extraInitializers);
        __esDecorate(null, null, _targetConfiguration_decorators, { kind: "field", name: "targetConfiguration", static: false, private: false, access: { has: obj => "targetConfiguration" in obj, get: obj => obj.targetConfiguration, set: (obj, value) => { obj.targetConfiguration = value; } }, metadata: _metadata }, _targetConfiguration_initializers, _targetConfiguration_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CIRelationship = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CIRelationship = _classThis;
})();
exports.CIRelationship = CIRelationship;
/**
 * Configuration Snapshot Model
 */
let ConfigurationSnapshot = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'configuration_snapshots',
            timestamps: true,
            indexes: [
                { fields: ['ci_id'] },
                { fields: ['snapshot_type'] },
                { fields: ['captured_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _ciId_decorators;
    let _ciId_initializers = [];
    let _ciId_extraInitializers = [];
    let _snapshotType_decorators;
    let _snapshotType_initializers = [];
    let _snapshotType_extraInitializers = [];
    let _configuration_decorators;
    let _configuration_initializers = [];
    let _configuration_extraInitializers = [];
    let _capturedAt_decorators;
    let _capturedAt_initializers = [];
    let _capturedAt_extraInitializers = [];
    let _capturedBy_decorators;
    let _capturedBy_initializers = [];
    let _capturedBy_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _checksum_decorators;
    let _checksum_initializers = [];
    let _checksum_extraInitializers = [];
    let _sizeBytes_decorators;
    let _sizeBytes_initializers = [];
    let _sizeBytes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _configurationItem_decorators;
    let _configurationItem_initializers = [];
    let _configurationItem_extraInitializers = [];
    var ConfigurationSnapshot = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.ciId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _ciId_initializers, void 0));
            this.snapshotType = (__runInitializers(this, _ciId_extraInitializers), __runInitializers(this, _snapshotType_initializers, void 0));
            this.configuration = (__runInitializers(this, _snapshotType_extraInitializers), __runInitializers(this, _configuration_initializers, void 0));
            this.capturedAt = (__runInitializers(this, _configuration_extraInitializers), __runInitializers(this, _capturedAt_initializers, void 0));
            this.capturedBy = (__runInitializers(this, _capturedAt_extraInitializers), __runInitializers(this, _capturedBy_initializers, void 0));
            this.reason = (__runInitializers(this, _capturedBy_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            this.tags = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.checksum = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _checksum_initializers, void 0));
            this.sizeBytes = (__runInitializers(this, _checksum_extraInitializers), __runInitializers(this, _sizeBytes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _sizeBytes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.configurationItem = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _configurationItem_initializers, void 0));
            __runInitializers(this, _configurationItem_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConfigurationSnapshot");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _ciId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Configuration Item ID' }), (0, sequelize_typescript_1.ForeignKey)(() => ConfigurationItem), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _snapshotType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Snapshot type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false }), sequelize_typescript_1.Index];
        _configuration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Configuration data' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _capturedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Captured at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW }), sequelize_typescript_1.Index];
        _capturedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Captured by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reason for snapshot' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _tags_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tags' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _checksum_decorators = [(0, swagger_1.ApiProperty)({ description: 'Checksum' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _sizeBytes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Size in bytes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _configurationItem_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ConfigurationItem)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _ciId_decorators, { kind: "field", name: "ciId", static: false, private: false, access: { has: obj => "ciId" in obj, get: obj => obj.ciId, set: (obj, value) => { obj.ciId = value; } }, metadata: _metadata }, _ciId_initializers, _ciId_extraInitializers);
        __esDecorate(null, null, _snapshotType_decorators, { kind: "field", name: "snapshotType", static: false, private: false, access: { has: obj => "snapshotType" in obj, get: obj => obj.snapshotType, set: (obj, value) => { obj.snapshotType = value; } }, metadata: _metadata }, _snapshotType_initializers, _snapshotType_extraInitializers);
        __esDecorate(null, null, _configuration_decorators, { kind: "field", name: "configuration", static: false, private: false, access: { has: obj => "configuration" in obj, get: obj => obj.configuration, set: (obj, value) => { obj.configuration = value; } }, metadata: _metadata }, _configuration_initializers, _configuration_extraInitializers);
        __esDecorate(null, null, _capturedAt_decorators, { kind: "field", name: "capturedAt", static: false, private: false, access: { has: obj => "capturedAt" in obj, get: obj => obj.capturedAt, set: (obj, value) => { obj.capturedAt = value; } }, metadata: _metadata }, _capturedAt_initializers, _capturedAt_extraInitializers);
        __esDecorate(null, null, _capturedBy_decorators, { kind: "field", name: "capturedBy", static: false, private: false, access: { has: obj => "capturedBy" in obj, get: obj => obj.capturedBy, set: (obj, value) => { obj.capturedBy = value; } }, metadata: _metadata }, _capturedBy_initializers, _capturedBy_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _checksum_decorators, { kind: "field", name: "checksum", static: false, private: false, access: { has: obj => "checksum" in obj, get: obj => obj.checksum, set: (obj, value) => { obj.checksum = value; } }, metadata: _metadata }, _checksum_initializers, _checksum_extraInitializers);
        __esDecorate(null, null, _sizeBytes_decorators, { kind: "field", name: "sizeBytes", static: false, private: false, access: { has: obj => "sizeBytes" in obj, get: obj => obj.sizeBytes, set: (obj, value) => { obj.sizeBytes = value; } }, metadata: _metadata }, _sizeBytes_initializers, _sizeBytes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _configurationItem_decorators, { kind: "field", name: "configurationItem", static: false, private: false, access: { has: obj => "configurationItem" in obj, get: obj => obj.configurationItem, set: (obj, value) => { obj.configurationItem = value; } }, metadata: _metadata }, _configurationItem_initializers, _configurationItem_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConfigurationSnapshot = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConfigurationSnapshot = _classThis;
})();
exports.ConfigurationSnapshot = ConfigurationSnapshot;
/**
 * Drift Record Model
 */
let DriftRecord = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'drift_records',
            timestamps: true,
            indexes: [
                { fields: ['ci_id'] },
                { fields: ['baseline_id'] },
                { fields: ['status'] },
                { fields: ['detected_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _ciId_decorators;
    let _ciId_initializers = [];
    let _ciId_extraInitializers = [];
    let _baselineId_decorators;
    let _baselineId_initializers = [];
    let _baselineId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _driftDetails_decorators;
    let _driftDetails_initializers = [];
    let _driftDetails_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _detectedAt_decorators;
    let _detectedAt_initializers = [];
    let _detectedAt_extraInitializers = [];
    let _detectedBy_decorators;
    let _detectedBy_initializers = [];
    let _detectedBy_extraInitializers = [];
    let _resolvedAt_decorators;
    let _resolvedAt_initializers = [];
    let _resolvedAt_extraInitializers = [];
    let _resolvedBy_decorators;
    let _resolvedBy_initializers = [];
    let _resolvedBy_extraInitializers = [];
    let _resolutionNotes_decorators;
    let _resolutionNotes_initializers = [];
    let _resolutionNotes_extraInitializers = [];
    let _autoRemediated_decorators;
    let _autoRemediated_initializers = [];
    let _autoRemediated_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _configurationItem_decorators;
    let _configurationItem_initializers = [];
    let _configurationItem_extraInitializers = [];
    let _baseline_decorators;
    let _baseline_initializers = [];
    let _baseline_extraInitializers = [];
    var DriftRecord = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.ciId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _ciId_initializers, void 0));
            this.baselineId = (__runInitializers(this, _ciId_extraInitializers), __runInitializers(this, _baselineId_initializers, void 0));
            this.status = (__runInitializers(this, _baselineId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.driftDetails = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _driftDetails_initializers, void 0));
            this.severity = (__runInitializers(this, _driftDetails_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.detectedAt = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _detectedAt_initializers, void 0));
            this.detectedBy = (__runInitializers(this, _detectedAt_extraInitializers), __runInitializers(this, _detectedBy_initializers, void 0));
            this.resolvedAt = (__runInitializers(this, _detectedBy_extraInitializers), __runInitializers(this, _resolvedAt_initializers, void 0));
            this.resolvedBy = (__runInitializers(this, _resolvedAt_extraInitializers), __runInitializers(this, _resolvedBy_initializers, void 0));
            this.resolutionNotes = (__runInitializers(this, _resolvedBy_extraInitializers), __runInitializers(this, _resolutionNotes_initializers, void 0));
            this.autoRemediated = (__runInitializers(this, _resolutionNotes_extraInitializers), __runInitializers(this, _autoRemediated_initializers, void 0));
            this.createdAt = (__runInitializers(this, _autoRemediated_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.configurationItem = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _configurationItem_initializers, void 0));
            this.baseline = (__runInitializers(this, _configurationItem_extraInitializers), __runInitializers(this, _baseline_initializers, void 0));
            __runInitializers(this, _baseline_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "DriftRecord");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _ciId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Configuration Item ID' }), (0, sequelize_typescript_1.ForeignKey)(() => ConfigurationItem), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _baselineId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Baseline ID' }), (0, sequelize_typescript_1.ForeignKey)(() => ConfigurationBaseline), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(DriftStatus)), defaultValue: DriftStatus.DRIFT_DETECTED }), sequelize_typescript_1.Index];
        _driftDetails_decorators = [(0, swagger_1.ApiProperty)({ description: 'Drift details' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _severity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Severity level' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false })];
        _detectedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Detected at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW }), sequelize_typescript_1.Index];
        _detectedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Detected by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _resolvedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resolved at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _resolvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resolved by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _resolutionNotes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Resolution notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _autoRemediated_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-remediated' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _configurationItem_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ConfigurationItem)];
        _baseline_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ConfigurationBaseline)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _ciId_decorators, { kind: "field", name: "ciId", static: false, private: false, access: { has: obj => "ciId" in obj, get: obj => obj.ciId, set: (obj, value) => { obj.ciId = value; } }, metadata: _metadata }, _ciId_initializers, _ciId_extraInitializers);
        __esDecorate(null, null, _baselineId_decorators, { kind: "field", name: "baselineId", static: false, private: false, access: { has: obj => "baselineId" in obj, get: obj => obj.baselineId, set: (obj, value) => { obj.baselineId = value; } }, metadata: _metadata }, _baselineId_initializers, _baselineId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _driftDetails_decorators, { kind: "field", name: "driftDetails", static: false, private: false, access: { has: obj => "driftDetails" in obj, get: obj => obj.driftDetails, set: (obj, value) => { obj.driftDetails = value; } }, metadata: _metadata }, _driftDetails_initializers, _driftDetails_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _detectedAt_decorators, { kind: "field", name: "detectedAt", static: false, private: false, access: { has: obj => "detectedAt" in obj, get: obj => obj.detectedAt, set: (obj, value) => { obj.detectedAt = value; } }, metadata: _metadata }, _detectedAt_initializers, _detectedAt_extraInitializers);
        __esDecorate(null, null, _detectedBy_decorators, { kind: "field", name: "detectedBy", static: false, private: false, access: { has: obj => "detectedBy" in obj, get: obj => obj.detectedBy, set: (obj, value) => { obj.detectedBy = value; } }, metadata: _metadata }, _detectedBy_initializers, _detectedBy_extraInitializers);
        __esDecorate(null, null, _resolvedAt_decorators, { kind: "field", name: "resolvedAt", static: false, private: false, access: { has: obj => "resolvedAt" in obj, get: obj => obj.resolvedAt, set: (obj, value) => { obj.resolvedAt = value; } }, metadata: _metadata }, _resolvedAt_initializers, _resolvedAt_extraInitializers);
        __esDecorate(null, null, _resolvedBy_decorators, { kind: "field", name: "resolvedBy", static: false, private: false, access: { has: obj => "resolvedBy" in obj, get: obj => obj.resolvedBy, set: (obj, value) => { obj.resolvedBy = value; } }, metadata: _metadata }, _resolvedBy_initializers, _resolvedBy_extraInitializers);
        __esDecorate(null, null, _resolutionNotes_decorators, { kind: "field", name: "resolutionNotes", static: false, private: false, access: { has: obj => "resolutionNotes" in obj, get: obj => obj.resolutionNotes, set: (obj, value) => { obj.resolutionNotes = value; } }, metadata: _metadata }, _resolutionNotes_initializers, _resolutionNotes_extraInitializers);
        __esDecorate(null, null, _autoRemediated_decorators, { kind: "field", name: "autoRemediated", static: false, private: false, access: { has: obj => "autoRemediated" in obj, get: obj => obj.autoRemediated, set: (obj, value) => { obj.autoRemediated = value; } }, metadata: _metadata }, _autoRemediated_initializers, _autoRemediated_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _configurationItem_decorators, { kind: "field", name: "configurationItem", static: false, private: false, access: { has: obj => "configurationItem" in obj, get: obj => obj.configurationItem, set: (obj, value) => { obj.configurationItem = value; } }, metadata: _metadata }, _configurationItem_initializers, _configurationItem_extraInitializers);
        __esDecorate(null, null, _baseline_decorators, { kind: "field", name: "baseline", static: false, private: false, access: { has: obj => "baseline" in obj, get: obj => obj.baseline, set: (obj, value) => { obj.baseline = value; } }, metadata: _metadata }, _baseline_initializers, _baseline_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DriftRecord = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DriftRecord = _classThis;
})();
exports.DriftRecord = DriftRecord;
/**
 * Configuration Audit Model
 */
let ConfigurationAudit = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'configuration_audits',
            timestamps: true,
            indexes: [
                { fields: ['audit_number'], unique: true },
                { fields: ['status'] },
                { fields: ['scheduled_date'] },
                { fields: ['audited_by'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateAuditNumber_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _auditNumber_decorators;
    let _auditNumber_initializers = [];
    let _auditNumber_extraInitializers = [];
    let _auditType_decorators;
    let _auditType_initializers = [];
    let _auditType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _ciIds_decorators;
    let _ciIds_initializers = [];
    let _ciIds_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _startedDate_decorators;
    let _startedDate_initializers = [];
    let _startedDate_extraInitializers = [];
    let _completedDate_decorators;
    let _completedDate_initializers = [];
    let _completedDate_extraInitializers = [];
    let _auditedBy_decorators;
    let _auditedBy_initializers = [];
    let _auditedBy_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _checklistItems_decorators;
    let _checklistItems_initializers = [];
    let _checklistItems_extraInitializers = [];
    let _findings_decorators;
    let _findings_initializers = [];
    let _findings_extraInitializers = [];
    let _complianceScore_decorators;
    let _complianceScore_initializers = [];
    let _complianceScore_extraInitializers = [];
    let _recommendations_decorators;
    let _recommendations_initializers = [];
    let _recommendations_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ConfigurationAudit = _classThis = class extends _classSuper {
        static async generateAuditNumber(instance) {
            if (!instance.auditNumber) {
                const count = await ConfigurationAudit.count();
                const year = new Date().getFullYear();
                instance.auditNumber = `AUD-${year}-${String(count + 1).padStart(6, '0')}`;
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.auditNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _auditNumber_initializers, void 0));
            this.auditType = (__runInitializers(this, _auditNumber_extraInitializers), __runInitializers(this, _auditType_initializers, void 0));
            this.status = (__runInitializers(this, _auditType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.ciIds = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _ciIds_initializers, void 0));
            this.scheduledDate = (__runInitializers(this, _ciIds_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
            this.startedDate = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _startedDate_initializers, void 0));
            this.completedDate = (__runInitializers(this, _startedDate_extraInitializers), __runInitializers(this, _completedDate_initializers, void 0));
            this.auditedBy = (__runInitializers(this, _completedDate_extraInitializers), __runInitializers(this, _auditedBy_initializers, void 0));
            this.scope = (__runInitializers(this, _auditedBy_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
            this.checklistItems = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _checklistItems_initializers, void 0));
            this.findings = (__runInitializers(this, _checklistItems_extraInitializers), __runInitializers(this, _findings_initializers, void 0));
            this.complianceScore = (__runInitializers(this, _findings_extraInitializers), __runInitializers(this, _complianceScore_initializers, void 0));
            this.recommendations = (__runInitializers(this, _complianceScore_extraInitializers), __runInitializers(this, _recommendations_initializers, void 0));
            this.attachments = (__runInitializers(this, _recommendations_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.createdAt = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConfigurationAudit");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _auditNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Audit number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _auditType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Audit type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(AuditStatus)), defaultValue: AuditStatus.SCHEDULED }), sequelize_typescript_1.Index];
        _ciIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'CI IDs to audit' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID), allowNull: false })];
        _scheduledDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _startedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Started date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _completedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completed date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _auditedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Audited by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _scope_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scope description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _checklistItems_decorators = [(0, swagger_1.ApiProperty)({ description: 'Checklist items' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _findings_decorators = [(0, swagger_1.ApiProperty)({ description: 'Findings' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _complianceScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Compliance score' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2) })];
        _recommendations_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recommendations' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _attachments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attachments' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _static_generateAuditNumber_decorators = [sequelize_typescript_1.BeforeCreate];
        __esDecorate(_classThis, null, _static_generateAuditNumber_decorators, { kind: "method", name: "generateAuditNumber", static: true, private: false, access: { has: obj => "generateAuditNumber" in obj, get: obj => obj.generateAuditNumber }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _auditNumber_decorators, { kind: "field", name: "auditNumber", static: false, private: false, access: { has: obj => "auditNumber" in obj, get: obj => obj.auditNumber, set: (obj, value) => { obj.auditNumber = value; } }, metadata: _metadata }, _auditNumber_initializers, _auditNumber_extraInitializers);
        __esDecorate(null, null, _auditType_decorators, { kind: "field", name: "auditType", static: false, private: false, access: { has: obj => "auditType" in obj, get: obj => obj.auditType, set: (obj, value) => { obj.auditType = value; } }, metadata: _metadata }, _auditType_initializers, _auditType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _ciIds_decorators, { kind: "field", name: "ciIds", static: false, private: false, access: { has: obj => "ciIds" in obj, get: obj => obj.ciIds, set: (obj, value) => { obj.ciIds = value; } }, metadata: _metadata }, _ciIds_initializers, _ciIds_extraInitializers);
        __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
        __esDecorate(null, null, _startedDate_decorators, { kind: "field", name: "startedDate", static: false, private: false, access: { has: obj => "startedDate" in obj, get: obj => obj.startedDate, set: (obj, value) => { obj.startedDate = value; } }, metadata: _metadata }, _startedDate_initializers, _startedDate_extraInitializers);
        __esDecorate(null, null, _completedDate_decorators, { kind: "field", name: "completedDate", static: false, private: false, access: { has: obj => "completedDate" in obj, get: obj => obj.completedDate, set: (obj, value) => { obj.completedDate = value; } }, metadata: _metadata }, _completedDate_initializers, _completedDate_extraInitializers);
        __esDecorate(null, null, _auditedBy_decorators, { kind: "field", name: "auditedBy", static: false, private: false, access: { has: obj => "auditedBy" in obj, get: obj => obj.auditedBy, set: (obj, value) => { obj.auditedBy = value; } }, metadata: _metadata }, _auditedBy_initializers, _auditedBy_extraInitializers);
        __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
        __esDecorate(null, null, _checklistItems_decorators, { kind: "field", name: "checklistItems", static: false, private: false, access: { has: obj => "checklistItems" in obj, get: obj => obj.checklistItems, set: (obj, value) => { obj.checklistItems = value; } }, metadata: _metadata }, _checklistItems_initializers, _checklistItems_extraInitializers);
        __esDecorate(null, null, _findings_decorators, { kind: "field", name: "findings", static: false, private: false, access: { has: obj => "findings" in obj, get: obj => obj.findings, set: (obj, value) => { obj.findings = value; } }, metadata: _metadata }, _findings_initializers, _findings_extraInitializers);
        __esDecorate(null, null, _complianceScore_decorators, { kind: "field", name: "complianceScore", static: false, private: false, access: { has: obj => "complianceScore" in obj, get: obj => obj.complianceScore, set: (obj, value) => { obj.complianceScore = value; } }, metadata: _metadata }, _complianceScore_initializers, _complianceScore_extraInitializers);
        __esDecorate(null, null, _recommendations_decorators, { kind: "field", name: "recommendations", static: false, private: false, access: { has: obj => "recommendations" in obj, get: obj => obj.recommendations, set: (obj, value) => { obj.recommendations = value; } }, metadata: _metadata }, _recommendations_initializers, _recommendations_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConfigurationAudit = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConfigurationAudit = _classThis;
})();
exports.ConfigurationAudit = ConfigurationAudit;
/**
 * Version History Model
 */
let ConfigurationVersionHistory = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'configuration_version_history',
            timestamps: true,
            indexes: [
                { fields: ['ci_id'] },
                { fields: ['version'] },
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
    let _ciId_decorators;
    let _ciId_initializers = [];
    let _ciId_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    let _previousVersion_decorators;
    let _previousVersion_initializers = [];
    let _previousVersion_extraInitializers = [];
    let _changedAt_decorators;
    let _changedAt_initializers = [];
    let _changedAt_extraInitializers = [];
    let _changedBy_decorators;
    let _changedBy_initializers = [];
    let _changedBy_extraInitializers = [];
    let _changeType_decorators;
    let _changeType_initializers = [];
    let _changeType_extraInitializers = [];
    let _changes_decorators;
    let _changes_initializers = [];
    let _changes_extraInitializers = [];
    let _previousConfiguration_decorators;
    let _previousConfiguration_initializers = [];
    let _previousConfiguration_extraInitializers = [];
    let _newConfiguration_decorators;
    let _newConfiguration_initializers = [];
    let _newConfiguration_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _changeRequestId_decorators;
    let _changeRequestId_initializers = [];
    let _changeRequestId_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _configurationItem_decorators;
    let _configurationItem_initializers = [];
    let _configurationItem_extraInitializers = [];
    var ConfigurationVersionHistory = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.ciId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _ciId_initializers, void 0));
            this.version = (__runInitializers(this, _ciId_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            this.previousVersion = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _previousVersion_initializers, void 0));
            this.changedAt = (__runInitializers(this, _previousVersion_extraInitializers), __runInitializers(this, _changedAt_initializers, void 0));
            this.changedBy = (__runInitializers(this, _changedAt_extraInitializers), __runInitializers(this, _changedBy_initializers, void 0));
            this.changeType = (__runInitializers(this, _changedBy_extraInitializers), __runInitializers(this, _changeType_initializers, void 0));
            this.changes = (__runInitializers(this, _changeType_extraInitializers), __runInitializers(this, _changes_initializers, void 0));
            this.previousConfiguration = (__runInitializers(this, _changes_extraInitializers), __runInitializers(this, _previousConfiguration_initializers, void 0));
            this.newConfiguration = (__runInitializers(this, _previousConfiguration_extraInitializers), __runInitializers(this, _newConfiguration_initializers, void 0));
            this.reason = (__runInitializers(this, _newConfiguration_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            this.changeRequestId = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _changeRequestId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _changeRequestId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.configurationItem = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _configurationItem_initializers, void 0));
            __runInitializers(this, _configurationItem_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConfigurationVersionHistory");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _ciId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Configuration Item ID' }), (0, sequelize_typescript_1.ForeignKey)(() => ConfigurationItem), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _version_decorators = [(0, swagger_1.ApiProperty)({ description: 'Version' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false }), sequelize_typescript_1.Index];
        _previousVersion_decorators = [(0, swagger_1.ApiProperty)({ description: 'Previous version' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _changedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Changed at' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW }), sequelize_typescript_1.Index];
        _changedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Changed by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _changeType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Change type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false })];
        _changes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Changes made' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _previousConfiguration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Previous configuration' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _newConfiguration_decorators = [(0, swagger_1.ApiProperty)({ description: 'New configuration' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _reason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Change reason' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _changeRequestId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Change request ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _configurationItem_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ConfigurationItem)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _ciId_decorators, { kind: "field", name: "ciId", static: false, private: false, access: { has: obj => "ciId" in obj, get: obj => obj.ciId, set: (obj, value) => { obj.ciId = value; } }, metadata: _metadata }, _ciId_initializers, _ciId_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, null, _previousVersion_decorators, { kind: "field", name: "previousVersion", static: false, private: false, access: { has: obj => "previousVersion" in obj, get: obj => obj.previousVersion, set: (obj, value) => { obj.previousVersion = value; } }, metadata: _metadata }, _previousVersion_initializers, _previousVersion_extraInitializers);
        __esDecorate(null, null, _changedAt_decorators, { kind: "field", name: "changedAt", static: false, private: false, access: { has: obj => "changedAt" in obj, get: obj => obj.changedAt, set: (obj, value) => { obj.changedAt = value; } }, metadata: _metadata }, _changedAt_initializers, _changedAt_extraInitializers);
        __esDecorate(null, null, _changedBy_decorators, { kind: "field", name: "changedBy", static: false, private: false, access: { has: obj => "changedBy" in obj, get: obj => obj.changedBy, set: (obj, value) => { obj.changedBy = value; } }, metadata: _metadata }, _changedBy_initializers, _changedBy_extraInitializers);
        __esDecorate(null, null, _changeType_decorators, { kind: "field", name: "changeType", static: false, private: false, access: { has: obj => "changeType" in obj, get: obj => obj.changeType, set: (obj, value) => { obj.changeType = value; } }, metadata: _metadata }, _changeType_initializers, _changeType_extraInitializers);
        __esDecorate(null, null, _changes_decorators, { kind: "field", name: "changes", static: false, private: false, access: { has: obj => "changes" in obj, get: obj => obj.changes, set: (obj, value) => { obj.changes = value; } }, metadata: _metadata }, _changes_initializers, _changes_extraInitializers);
        __esDecorate(null, null, _previousConfiguration_decorators, { kind: "field", name: "previousConfiguration", static: false, private: false, access: { has: obj => "previousConfiguration" in obj, get: obj => obj.previousConfiguration, set: (obj, value) => { obj.previousConfiguration = value; } }, metadata: _metadata }, _previousConfiguration_initializers, _previousConfiguration_extraInitializers);
        __esDecorate(null, null, _newConfiguration_decorators, { kind: "field", name: "newConfiguration", static: false, private: false, access: { has: obj => "newConfiguration" in obj, get: obj => obj.newConfiguration, set: (obj, value) => { obj.newConfiguration = value; } }, metadata: _metadata }, _newConfiguration_initializers, _newConfiguration_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _changeRequestId_decorators, { kind: "field", name: "changeRequestId", static: false, private: false, access: { has: obj => "changeRequestId" in obj, get: obj => obj.changeRequestId, set: (obj, value) => { obj.changeRequestId = value; } }, metadata: _metadata }, _changeRequestId_initializers, _changeRequestId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _configurationItem_decorators, { kind: "field", name: "configurationItem", static: false, private: false, access: { has: obj => "configurationItem" in obj, get: obj => obj.configurationItem, set: (obj, value) => { obj.configurationItem = value; } }, metadata: _metadata }, _configurationItem_initializers, _configurationItem_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConfigurationVersionHistory = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConfigurationVersionHistory = _classThis;
})();
exports.ConfigurationVersionHistory = ConfigurationVersionHistory;
// ============================================================================
// CONFIGURATION ITEM FUNCTIONS
// ============================================================================
/**
 * Creates a configuration item
 *
 * @param data - Configuration item data
 * @param transaction - Optional database transaction
 * @returns Created configuration item
 *
 * @example
 * ```typescript
 * const ci = await createConfigurationItem({
 *   assetId: 'asset-123',
 *   ciType: CIType.SERVER,
 *   name: 'Production Web Server 01',
 *   attributes: {
 *     hostname: 'prod-web-01',
 *     ipAddress: '10.0.1.50',
 *     os: 'Ubuntu 22.04 LTS',
 *     cpu: '16 cores',
 *     memory: '64GB'
 *   },
 *   version: '1.0.0',
 *   environment: 'production'
 * });
 * ```
 */
async function createConfigurationItem(data, transaction) {
    const ci = await ConfigurationItem.create({
        ...data,
        status: CIStatus.PLANNED,
    }, { transaction });
    // Create initial snapshot
    await createConfigurationSnapshot({
        ciId: ci.id,
        snapshotType: 'initial',
        configuration: ci.attributes,
        capturedBy: data.owner || 'system',
        reason: 'Initial configuration',
        tags: ['initial', 'baseline'],
    }, transaction);
    return ci;
}
/**
 * Updates configuration item
 *
 * @param ciId - CI identifier
 * @param updates - Fields to update
 * @param userId - User making the update
 * @param transaction - Optional database transaction
 * @returns Updated CI
 *
 * @example
 * ```typescript
 * await updateConfigurationItem('ci-123', {
 *   attributes: { memory: '128GB' },
 *   version: '1.1.0'
 * }, 'user-456');
 * ```
 */
async function updateConfigurationItem(ciId, updates, userId, transaction) {
    const ci = await ConfigurationItem.findByPk(ciId, { transaction });
    if (!ci) {
        throw new common_1.NotFoundException(`Configuration item ${ciId} not found`);
    }
    const previousConfig = { ...ci.toJSON() };
    await ci.update({ ...updates, lastModifiedBy: userId }, { transaction });
    // Create version history entry
    if (updates.attributes || updates.version) {
        await ConfigurationVersionHistory.create({
            ciId: ci.id,
            version: updates.version || ci.version,
            previousVersion: previousConfig.version,
            changedAt: new Date(),
            changedBy: userId,
            changeType: 'update',
            changes: updates,
            previousConfiguration: previousConfig.attributes,
            newConfiguration: ci.attributes,
        }, { transaction });
        // Create snapshot
        await createConfigurationSnapshot({
            ciId: ci.id,
            snapshotType: 'update',
            configuration: ci.attributes,
            capturedBy: userId,
            reason: 'Configuration updated',
        }, transaction);
    }
    return ci;
}
/**
 * Gets configuration item by ID
 *
 * @param ciId - CI identifier
 * @param includeRelationships - Include relationships
 * @returns Configuration item
 *
 * @example
 * ```typescript
 * const ci = await getConfigurationItem('ci-123', true);
 * ```
 */
async function getConfigurationItem(ciId, includeRelationships = false) {
    const include = [];
    if (includeRelationships) {
        include.push({ model: CIRelationship, as: 'outgoingRelationships' }, { model: CIRelationship, as: 'incomingRelationships' });
    }
    const ci = await ConfigurationItem.findByPk(ciId, { include });
    if (!ci) {
        throw new common_1.NotFoundException(`Configuration item ${ciId} not found`);
    }
    return ci;
}
/**
 * Gets CIs by type
 *
 * @param ciType - CI type
 * @param options - Query options
 * @returns Configuration items
 *
 * @example
 * ```typescript
 * const servers = await getConfigurationItemsByType(CIType.SERVER);
 * ```
 */
async function getConfigurationItemsByType(ciType, options = {}) {
    return ConfigurationItem.findAll({
        where: { ciType },
        order: [['name', 'ASC']],
        ...options,
    });
}
/**
 * Gets CIs by environment
 *
 * @param environment - Environment name
 * @returns Configuration items
 *
 * @example
 * ```typescript
 * const prodCIs = await getConfigurationItemsByEnvironment('production');
 * ```
 */
async function getConfigurationItemsByEnvironment(environment) {
    return ConfigurationItem.findAll({
        where: { environment },
        order: [['ciType', 'ASC'], ['name', 'ASC']],
    });
}
/**
 * Verifies configuration item
 *
 * @param ciId - CI identifier
 * @param userId - User verifying
 * @param transaction - Optional database transaction
 * @returns Updated CI
 *
 * @example
 * ```typescript
 * await verifyConfigurationItem('ci-123', 'user-456');
 * ```
 */
async function verifyConfigurationItem(ciId, userId, transaction) {
    const ci = await ConfigurationItem.findByPk(ciId, { transaction });
    if (!ci) {
        throw new common_1.NotFoundException(`Configuration item ${ciId} not found`);
    }
    await ci.update({
        lastVerifiedDate: new Date(),
        lastModifiedBy: userId,
    }, { transaction });
    return ci;
}
/**
 * Decommissions configuration item
 *
 * @param ciId - CI identifier
 * @param userId - User decommissioning
 * @param transaction - Optional database transaction
 * @returns Updated CI
 *
 * @example
 * ```typescript
 * await decommissionConfigurationItem('ci-123', 'user-456');
 * ```
 */
async function decommissionConfigurationItem(ciId, userId, transaction) {
    const ci = await ConfigurationItem.findByPk(ciId, { transaction });
    if (!ci) {
        throw new common_1.NotFoundException(`Configuration item ${ciId} not found`);
    }
    await ci.update({
        status: CIStatus.DECOMMISSIONED,
        lastModifiedBy: userId,
    }, { transaction });
    // Sever all relationships
    await CIRelationship.update({ isActive: false, severedDate: new Date() }, {
        where: {
            [sequelize_1.Op.or]: [{ sourceCI: ciId }, { targetCI: ciId }],
            isActive: true,
        },
        transaction,
    });
    return ci;
}
// ============================================================================
// BASELINE FUNCTIONS
// ============================================================================
/**
 * Creates configuration baseline
 *
 * @param data - Baseline data
 * @param transaction - Optional database transaction
 * @returns Created baseline
 *
 * @example
 * ```typescript
 * const baseline = await createBaseline({
 *   name: 'Production Baseline Q4 2024',
 *   description: 'Quarterly production environment baseline',
 *   ciIds: ['ci-1', 'ci-2', 'ci-3'],
 *   approvedBy: 'manager-456',
 *   effectiveDate: new Date('2024-10-01')
 * });
 * ```
 */
async function createBaseline(data, transaction) {
    // Fetch all CIs
    const cis = await ConfigurationItem.findAll({
        where: { id: { [sequelize_1.Op.in]: data.ciIds } },
        transaction,
    });
    if (cis.length !== data.ciIds.length) {
        throw new common_1.BadRequestException('Some CIs not found');
    }
    // Create snapshot
    const snapshot = {};
    cis.forEach(ci => {
        snapshot[ci.id] = {
            ciNumber: ci.ciNumber,
            name: ci.name,
            ciType: ci.ciType,
            version: ci.version,
            attributes: ci.attributes,
            checksum: ci.checksum,
        };
    });
    const baseline = await ConfigurationBaseline.create({
        ...data,
        configurationSnapshot: snapshot,
        status: BaselineStatus.DRAFT,
    }, { transaction });
    return baseline;
}
/**
 * Approves baseline
 *
 * @param baselineId - Baseline identifier
 * @param approverId - Approver user ID
 * @param transaction - Optional database transaction
 * @returns Updated baseline
 *
 * @example
 * ```typescript
 * await approveBaseline('baseline-123', 'manager-456');
 * ```
 */
async function approveBaseline(baselineId, approverId, transaction) {
    const baseline = await ConfigurationBaseline.findByPk(baselineId, { transaction });
    if (!baseline) {
        throw new common_1.NotFoundException(`Baseline ${baselineId} not found`);
    }
    await baseline.update({
        status: BaselineStatus.APPROVED,
        approvedBy: approverId,
        approvalDate: new Date(),
    }, { transaction });
    return baseline;
}
/**
 * Activates baseline
 *
 * @param baselineId - Baseline identifier
 * @param transaction - Optional database transaction
 * @returns Updated baseline
 *
 * @example
 * ```typescript
 * await activateBaseline('baseline-123');
 * ```
 */
async function activateBaseline(baselineId, transaction) {
    const baseline = await ConfigurationBaseline.findByPk(baselineId, { transaction });
    if (!baseline) {
        throw new common_1.NotFoundException(`Baseline ${baselineId} not found`);
    }
    if (baseline.status !== BaselineStatus.APPROVED) {
        throw new common_1.BadRequestException('Baseline must be approved before activation');
    }
    // Deactivate other active baselines for same CIs
    await ConfigurationBaseline.update({ status: BaselineStatus.ARCHIVED }, {
        where: {
            status: BaselineStatus.ACTIVE,
            id: { [sequelize_1.Op.ne]: baselineId },
        },
        transaction,
    });
    await baseline.update({
        status: BaselineStatus.ACTIVE,
        effectiveDate: new Date(),
    }, { transaction });
    return baseline;
}
/**
 * Gets active baselines
 *
 * @returns Active baselines
 *
 * @example
 * ```typescript
 * const activeBaselines = await getActiveBaselines();
 * ```
 */
async function getActiveBaselines() {
    return ConfigurationBaseline.findAll({
        where: { status: BaselineStatus.ACTIVE },
        order: [['effectiveDate', 'DESC']],
    });
}
/**
 * Compares CI against baseline
 *
 * @param ciId - CI identifier
 * @param baselineId - Baseline identifier
 * @returns Comparison result
 *
 * @example
 * ```typescript
 * const diff = await compareToBaseline('ci-123', 'baseline-456');
 * ```
 */
async function compareToBaseline(ciId, baselineId) {
    const ci = await ConfigurationItem.findByPk(ciId);
    if (!ci) {
        throw new common_1.NotFoundException(`CI ${ciId} not found`);
    }
    const baseline = await ConfigurationBaseline.findByPk(baselineId);
    if (!baseline) {
        throw new common_1.NotFoundException(`Baseline ${baselineId} not found`);
    }
    const baselineConfig = baseline.configurationSnapshot[ciId];
    if (!baselineConfig) {
        throw new common_1.BadRequestException('CI not included in baseline');
    }
    const differences = [];
    // Compare version
    if (ci.version !== baselineConfig.version) {
        differences.push({
            attribute: 'version',
            expectedValue: baselineConfig.version,
            actualValue: ci.version,
            deviation: 'Version mismatch',
            impact: 'medium',
        });
    }
    // Compare attributes
    const baselineAttrs = baselineConfig.attributes;
    const currentAttrs = ci.attributes;
    for (const key in baselineAttrs) {
        if (JSON.stringify(baselineAttrs[key]) !== JSON.stringify(currentAttrs[key])) {
            differences.push({
                attribute: key,
                expectedValue: baselineAttrs[key],
                actualValue: currentAttrs[key],
                deviation: 'Attribute changed',
                impact: 'low',
            });
        }
    }
    return {
        matches: differences.length === 0,
        differences,
    };
}
// ============================================================================
// CHANGE REQUEST FUNCTIONS
// ============================================================================
/**
 * Creates change request
 *
 * @param data - Change request data
 * @param transaction - Optional database transaction
 * @returns Created change request
 *
 * @example
 * ```typescript
 * const change = await createChangeRequest({
 *   ciId: 'ci-123',
 *   changeType: ChangeType.NORMAL,
 *   priority: ChangePriority.MEDIUM,
 *   title: 'Upgrade OS to Ubuntu 24.04',
 *   description: 'Upgrade operating system for security patches',
 *   justification: 'Current version EOL in 3 months',
 *   requestedBy: 'user-456',
 *   proposedChanges: { os: 'Ubuntu 24.04 LTS' },
 *   implementationPlan: 'Take snapshot, upgrade, test, validate',
 *   rollbackPlan: 'Restore from snapshot'
 * });
 * ```
 */
async function createChangeRequest(data, transaction) {
    const ci = await ConfigurationItem.findByPk(data.ciId, { transaction });
    if (!ci) {
        throw new common_1.NotFoundException(`CI ${data.ciId} not found`);
    }
    const changeRequest = await ChangeRequest.create({
        ...data,
        status: ChangeRequestStatus.DRAFT,
    }, { transaction });
    return changeRequest;
}
/**
 * Submits change request for approval
 *
 * @param changeId - Change request ID
 * @param transaction - Optional database transaction
 * @returns Updated change request
 *
 * @example
 * ```typescript
 * await submitChangeRequest('change-123');
 * ```
 */
async function submitChangeRequest(changeId, transaction) {
    const change = await ChangeRequest.findByPk(changeId, { transaction });
    if (!change) {
        throw new common_1.NotFoundException(`Change request ${changeId} not found`);
    }
    if (change.status !== ChangeRequestStatus.DRAFT) {
        throw new common_1.BadRequestException('Only draft changes can be submitted');
    }
    await change.update({
        status: ChangeRequestStatus.SUBMITTED,
    }, { transaction });
    return change;
}
/**
 * Approves change request
 *
 * @param changeId - Change request ID
 * @param approverId - Approver user ID
 * @param comments - Approval comments
 * @param transaction - Optional database transaction
 * @returns Updated change request
 *
 * @example
 * ```typescript
 * await approveChangeRequest('change-123', 'manager-456', 'Approved for implementation');
 * ```
 */
async function approveChangeRequest(changeId, approverId, comments, transaction) {
    const change = await ChangeRequest.findByPk(changeId, { transaction });
    if (!change) {
        throw new common_1.NotFoundException(`Change request ${changeId} not found`);
    }
    const approvals = change.approvals || [];
    approvals.push({
        approverId,
        approvedAt: new Date(),
        comments,
    });
    await change.update({
        approvals,
        status: ChangeRequestStatus.APPROVED,
    }, { transaction });
    return change;
}
/**
 * Rejects change request
 *
 * @param changeId - Change request ID
 * @param approverId - Approver user ID
 * @param reason - Rejection reason
 * @param transaction - Optional database transaction
 * @returns Updated change request
 *
 * @example
 * ```typescript
 * await rejectChangeRequest('change-123', 'manager-456', 'Insufficient testing plan');
 * ```
 */
async function rejectChangeRequest(changeId, approverId, reason, transaction) {
    const change = await ChangeRequest.findByPk(changeId, { transaction });
    if (!change) {
        throw new common_1.NotFoundException(`Change request ${changeId} not found`);
    }
    const approvals = change.approvals || [];
    approvals.push({
        approverId,
        rejectedAt: new Date(),
        reason,
    });
    await change.update({
        approvals,
        status: ChangeRequestStatus.REJECTED,
    }, { transaction });
    return change;
}
/**
 * Implements change request
 *
 * @param changeId - Change request ID
 * @param implementerId - User implementing
 * @param notes - Implementation notes
 * @param transaction - Optional database transaction
 * @returns Updated change request
 *
 * @example
 * ```typescript
 * await implementChangeRequest('change-123', 'tech-789', 'Upgrade completed successfully');
 * ```
 */
async function implementChangeRequest(changeId, implementerId, notes, transaction) {
    const change = await ChangeRequest.findByPk(changeId, {
        include: [{ model: ConfigurationItem }],
        transaction,
    });
    if (!change) {
        throw new common_1.NotFoundException(`Change request ${changeId} not found`);
    }
    if (change.status !== ChangeRequestStatus.APPROVED && change.status !== ChangeRequestStatus.SCHEDULED) {
        throw new common_1.BadRequestException('Change must be approved or scheduled');
    }
    // Update CI with proposed changes
    const ci = change.configurationItem;
    const newAttributes = { ...ci.attributes, ...change.proposedChanges };
    await updateConfigurationItem(ci.id, { attributes: newAttributes }, implementerId, transaction);
    await change.update({
        status: ChangeRequestStatus.COMPLETED,
        actualStartDate: new Date(),
        actualEndDate: new Date(),
        implementedBy: implementerId,
        implementationNotes: notes,
    }, { transaction });
    return change;
}
/**
 * Rolls back change request
 *
 * @param changeId - Change request ID
 * @param userId - User performing rollback
 * @param reason - Rollback reason
 * @param transaction - Optional database transaction
 * @returns Updated change request
 *
 * @example
 * ```typescript
 * await rollbackChangeRequest('change-123', 'tech-789', 'Service degradation detected');
 * ```
 */
async function rollbackChangeRequest(changeId, userId, reason, transaction) {
    const change = await ChangeRequest.findByPk(changeId, { transaction });
    if (!change) {
        throw new common_1.NotFoundException(`Change request ${changeId} not found`);
    }
    if (change.status !== ChangeRequestStatus.COMPLETED) {
        throw new common_1.BadRequestException('Only completed changes can be rolled back');
    }
    // Find version history to restore
    const history = await ConfigurationVersionHistory.findOne({
        where: {
            ciId: change.ciId,
            changeRequestId: changeId,
        },
        transaction,
    });
    if (history && history.previousConfiguration) {
        await updateConfigurationItem(change.ciId, { attributes: history.previousConfiguration }, userId, transaction);
    }
    await change.update({
        status: ChangeRequestStatus.ROLLED_BACK,
        rollbackPerformed: true,
        rollbackReason: reason,
    }, { transaction });
    return change;
}
/**
 * Gets change requests by status
 *
 * @param status - Change request status
 * @returns Change requests
 *
 * @example
 * ```typescript
 * const pending = await getChangeRequestsByStatus(ChangeRequestStatus.SUBMITTED);
 * ```
 */
async function getChangeRequestsByStatus(status) {
    return ChangeRequest.findAll({
        where: { status },
        order: [['priority', 'DESC'], ['createdAt', 'ASC']],
        include: [{ model: ConfigurationItem }],
    });
}
/**
 * Analyzes change impact
 *
 * @param changeId - Change request ID
 * @returns Impact analysis
 *
 * @example
 * ```typescript
 * const impact = await analyzeChangeImpact('change-123');
 * ```
 */
async function analyzeChangeImpact(changeId) {
    const change = await ChangeRequest.findByPk(changeId);
    if (!change) {
        throw new common_1.NotFoundException(`Change request ${changeId} not found`);
    }
    // Get direct relationships
    const directRelationships = await CIRelationship.findAll({
        where: {
            [sequelize_1.Op.or]: [
                { sourceCI: change.ciId },
                { targetCI: change.ciId },
            ],
            isActive: true,
        },
        include: [
            { model: ConfigurationItem, as: 'sourceConfiguration' },
            { model: ConfigurationItem, as: 'targetConfiguration' },
        ],
    });
    const directImpact = [];
    const directImpactIds = new Set();
    directRelationships.forEach(rel => {
        if (rel.sourceCI === change.ciId && rel.targetConfiguration) {
            directImpact.push(rel.targetConfiguration);
            directImpactIds.add(rel.targetCI);
        }
        else if (rel.targetCI === change.ciId && rel.sourceConfiguration) {
            directImpact.push(rel.sourceConfiguration);
            directImpactIds.add(rel.sourceCI);
        }
    });
    // Get indirect relationships (2 levels deep)
    const indirectRelationships = await CIRelationship.findAll({
        where: {
            [sequelize_1.Op.or]: [
                { sourceCI: { [sequelize_1.Op.in]: Array.from(directImpactIds) } },
                { targetCI: { [sequelize_1.Op.in]: Array.from(directImpactIds) } },
            ],
            isActive: true,
        },
        include: [
            { model: ConfigurationItem, as: 'sourceConfiguration' },
            { model: ConfigurationItem, as: 'targetConfiguration' },
        ],
    });
    const indirectImpact = [];
    const indirectImpactIds = new Set();
    indirectRelationships.forEach(rel => {
        if (!directImpactIds.has(rel.sourceCI) && !directImpactIds.has(rel.targetCI)) {
            if (rel.sourceConfiguration && !indirectImpactIds.has(rel.sourceCI)) {
                indirectImpact.push(rel.sourceConfiguration);
                indirectImpactIds.add(rel.sourceCI);
            }
            if (rel.targetConfiguration && !indirectImpactIds.has(rel.targetCI)) {
                indirectImpact.push(rel.targetConfiguration);
                indirectImpactIds.add(rel.targetCI);
            }
        }
    });
    return {
        directImpact,
        indirectImpact,
        totalImpacted: directImpact.length + indirectImpact.length,
    };
}
// ============================================================================
// RELATIONSHIP FUNCTIONS
// ============================================================================
/**
 * Creates CI relationship
 *
 * @param data - Relationship data
 * @param transaction - Optional database transaction
 * @returns Created relationship
 *
 * @example
 * ```typescript
 * await createCIRelationship({
 *   sourceCI: 'ci-app-1',
 *   targetCI: 'ci-db-1',
 *   relationshipType: RelationshipType.DEPENDS_ON,
 *   description: 'Application depends on database'
 * });
 * ```
 */
async function createCIRelationship(data, transaction) {
    // Verify CIs exist
    const sourceCi = await ConfigurationItem.findByPk(data.sourceCI, { transaction });
    const targetCi = await ConfigurationItem.findByPk(data.targetCI, { transaction });
    if (!sourceCi || !targetCi) {
        throw new common_1.NotFoundException('One or both CIs not found');
    }
    // Check for existing relationship
    const existing = await CIRelationship.findOne({
        where: {
            sourceCI: data.sourceCI,
            targetCI: data.targetCI,
            relationshipType: data.relationshipType,
            isActive: true,
        },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException('Relationship already exists');
    }
    const relationship = await CIRelationship.create(data, { transaction });
    return relationship;
}
/**
 * Removes CI relationship
 *
 * @param relationshipId - Relationship ID
 * @param transaction - Optional database transaction
 * @returns Updated relationship
 *
 * @example
 * ```typescript
 * await removeCIRelationship('rel-123');
 * ```
 */
async function removeCIRelationship(relationshipId, transaction) {
    const relationship = await CIRelationship.findByPk(relationshipId, { transaction });
    if (!relationship) {
        throw new common_1.NotFoundException(`Relationship ${relationshipId} not found`);
    }
    await relationship.update({
        isActive: false,
        severedDate: new Date(),
    }, { transaction });
    return relationship;
}
/**
 * Gets CI relationships
 *
 * @param ciId - CI identifier
 * @param direction - 'outgoing', 'incoming', or 'both'
 * @returns Relationships
 *
 * @example
 * ```typescript
 * const rels = await getCIRelationships('ci-123', 'both');
 * ```
 */
async function getCIRelationships(ciId, direction = 'both') {
    const where = { isActive: true };
    if (direction === 'outgoing') {
        where.sourceCI = ciId;
    }
    else if (direction === 'incoming') {
        where.targetCI = ciId;
    }
    else {
        where[sequelize_1.Op.or] = [{ sourceCI: ciId }, { targetCI: ciId }];
    }
    return CIRelationship.findAll({
        where,
        include: [
            { model: ConfigurationItem, as: 'sourceConfiguration' },
            { model: ConfigurationItem, as: 'targetConfiguration' },
        ],
    });
}
/**
 * Gets CI dependency tree
 *
 * @param ciId - CI identifier
 * @param depth - Maximum depth
 * @returns Dependency tree
 *
 * @example
 * ```typescript
 * const tree = await getCIDependencyTree('ci-123', 3);
 * ```
 */
async function getCIDependencyTree(ciId, depth = 3) {
    const visited = new Set();
    async function buildTree(currentId, currentDepth) {
        if (currentDepth > depth || visited.has(currentId)) {
            return null;
        }
        visited.add(currentId);
        const ci = await ConfigurationItem.findByPk(currentId);
        if (!ci)
            return null;
        const dependencies = await CIRelationship.findAll({
            where: {
                sourceCI: currentId,
                relationshipType: RelationshipType.DEPENDS_ON,
                isActive: true,
            },
            include: [{ model: ConfigurationItem, as: 'targetConfiguration' }],
        });
        const children = await Promise.all(dependencies.map(dep => buildTree(dep.targetCI, currentDepth + 1)));
        return {
            ci: ci.toJSON(),
            dependencies: children.filter(c => c !== null),
        };
    }
    return buildTree(ciId, 0);
}
// ============================================================================
// SNAPSHOT FUNCTIONS
// ============================================================================
/**
 * Creates configuration snapshot
 *
 * @param data - Snapshot data
 * @param transaction - Optional database transaction
 * @returns Created snapshot
 *
 * @example
 * ```typescript
 * await createConfigurationSnapshot({
 *   ciId: 'ci-123',
 *   snapshotType: 'scheduled',
 *   configuration: currentConfig,
 *   capturedBy: 'user-456',
 *   reason: 'Weekly backup'
 * });
 * ```
 */
async function createConfigurationSnapshot(data, transaction) {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(data.configuration));
    const checksum = hash.digest('hex');
    const sizeBytes = Buffer.byteLength(JSON.stringify(data.configuration), 'utf8');
    const snapshot = await ConfigurationSnapshot.create({
        ...data,
        checksum,
        sizeBytes,
    }, { transaction });
    return snapshot;
}
/**
 * Gets CI snapshots
 *
 * @param ciId - CI identifier
 * @param limit - Maximum snapshots to return
 * @returns Snapshots
 *
 * @example
 * ```typescript
 * const snapshots = await getCISnapshots('ci-123', 10);
 * ```
 */
async function getCISnapshots(ciId, limit = 50) {
    return ConfigurationSnapshot.findAll({
        where: { ciId },
        order: [['capturedAt', 'DESC']],
        limit,
    });
}
/**
 * Restores from snapshot
 *
 * @param snapshotId - Snapshot ID
 * @param userId - User restoring
 * @param transaction - Optional database transaction
 * @returns Updated CI
 *
 * @example
 * ```typescript
 * await restoreFromSnapshot('snapshot-123', 'user-456');
 * ```
 */
async function restoreFromSnapshot(snapshotId, userId, transaction) {
    const snapshot = await ConfigurationSnapshot.findByPk(snapshotId, { transaction });
    if (!snapshot) {
        throw new common_1.NotFoundException(`Snapshot ${snapshotId} not found`);
    }
    const ci = await updateConfigurationItem(snapshot.ciId, { attributes: snapshot.configuration }, userId, transaction);
    // Create new snapshot marking restore
    await createConfigurationSnapshot({
        ciId: ci.id,
        snapshotType: 'restore',
        configuration: snapshot.configuration,
        capturedBy: userId,
        reason: `Restored from snapshot ${snapshotId}`,
        tags: ['restore'],
    }, transaction);
    return ci;
}
// ============================================================================
// DRIFT DETECTION FUNCTIONS
// ============================================================================
/**
 * Detects configuration drift
 *
 * @param data - Drift detection data
 * @param transaction - Optional database transaction
 * @returns Drift record
 *
 * @example
 * ```typescript
 * const drift = await detectConfigurationDrift({
 *   ciId: 'ci-123',
 *   baselineId: 'baseline-456',
 *   driftDetails: [
 *     {
 *       attribute: 'memory',
 *       expectedValue: '64GB',
 *       actualValue: '32GB',
 *       deviation: 'Memory reduced',
 *       impact: 'high'
 *     }
 *   ],
 *   severity: 'high'
 * });
 * ```
 */
async function detectConfigurationDrift(data, transaction) {
    const drift = await DriftRecord.create({
        ...data,
        status: DriftStatus.DRIFT_DETECTED,
        detectedAt: new Date(),
    }, { transaction });
    return drift;
}
/**
 * Scans for drift against baseline
 *
 * @param baselineId - Baseline ID
 * @returns Drift records
 *
 * @example
 * ```typescript
 * const drifts = await scanForDrift('baseline-123');
 * ```
 */
async function scanForDrift(baselineId) {
    const baseline = await ConfigurationBaseline.findByPk(baselineId);
    if (!baseline) {
        throw new common_1.NotFoundException(`Baseline ${baselineId} not found`);
    }
    const drifts = [];
    for (const ciId of baseline.ciIds) {
        const comparison = await compareToBaseline(ciId, baselineId);
        if (!comparison.matches) {
            const severity = comparison.differences.some(d => d.impact === 'high')
                ? 'high'
                : comparison.differences.some(d => d.impact === 'medium')
                    ? 'medium'
                    : 'low';
            const drift = await detectConfigurationDrift({
                ciId,
                baselineId: baseline.id,
                driftDetails: comparison.differences,
                severity,
            });
            drifts.push(drift);
        }
    }
    return drifts;
}
/**
 * Remediates drift
 *
 * @param driftId - Drift record ID
 * @param userId - User remediating
 * @param notes - Remediation notes
 * @param transaction - Optional database transaction
 * @returns Updated drift record
 *
 * @example
 * ```typescript
 * await remediateDrift('drift-123', 'user-456', 'Restored to baseline configuration');
 * ```
 */
async function remediateDrift(driftId, userId, notes, transaction) {
    const drift = await DriftRecord.findByPk(driftId, {
        include: [{ model: ConfigurationBaseline }],
        transaction,
    });
    if (!drift) {
        throw new common_1.NotFoundException(`Drift record ${driftId} not found`);
    }
    // Restore to baseline
    const baselineConfig = drift.baseline.configurationSnapshot[drift.ciId];
    if (baselineConfig) {
        await updateConfigurationItem(drift.ciId, { attributes: baselineConfig.attributes }, userId, transaction);
    }
    await drift.update({
        status: DriftStatus.REMEDIATED,
        resolvedAt: new Date(),
        resolvedBy: userId,
        resolutionNotes: notes,
    }, { transaction });
    return drift;
}
/**
 * Gets drift records by status
 *
 * @param status - Drift status
 * @returns Drift records
 *
 * @example
 * ```typescript
 * const activeDrifts = await getDriftRecordsByStatus(DriftStatus.DRIFT_DETECTED);
 * ```
 */
async function getDriftRecordsByStatus(status) {
    return DriftRecord.findAll({
        where: { status },
        order: [['severity', 'DESC'], ['detectedAt', 'DESC']],
        include: [
            { model: ConfigurationItem },
            { model: ConfigurationBaseline },
        ],
    });
}
// ============================================================================
// AUDIT FUNCTIONS
// ============================================================================
/**
 * Creates configuration audit
 *
 * @param data - Audit data
 * @param transaction - Optional database transaction
 * @returns Created audit
 *
 * @example
 * ```typescript
 * const audit = await createConfigurationAudit({
 *   ciIds: ['ci-1', 'ci-2', 'ci-3'],
 *   auditType: 'compliance',
 *   auditedBy: 'auditor-123',
 *   scheduledDate: new Date('2024-12-01'),
 *   scope: 'Production environment quarterly audit',
 *   checklistItems: ['Verify configuration', 'Check compliance', 'Review changes']
 * });
 * ```
 */
async function createConfigurationAudit(data, transaction) {
    const audit = await ConfigurationAudit.create({
        ...data,
        status: AuditStatus.SCHEDULED,
    }, { transaction });
    return audit;
}
/**
 * Starts configuration audit
 *
 * @param auditId - Audit ID
 * @param transaction - Optional database transaction
 * @returns Updated audit
 *
 * @example
 * ```typescript
 * await startConfigurationAudit('audit-123');
 * ```
 */
async function startConfigurationAudit(auditId, transaction) {
    const audit = await ConfigurationAudit.findByPk(auditId, { transaction });
    if (!audit) {
        throw new common_1.NotFoundException(`Audit ${auditId} not found`);
    }
    await audit.update({
        status: AuditStatus.IN_PROGRESS,
        startedDate: new Date(),
    }, { transaction });
    return audit;
}
/**
 * Completes configuration audit
 *
 * @param auditId - Audit ID
 * @param findings - Audit findings
 * @param complianceScore - Compliance score
 * @param recommendations - Recommendations
 * @param transaction - Optional database transaction
 * @returns Updated audit
 *
 * @example
 * ```typescript
 * await completeConfigurationAudit('audit-123', findings, 95.5, 'All items compliant');
 * ```
 */
async function completeConfigurationAudit(auditId, findings, complianceScore, recommendations, transaction) {
    const audit = await ConfigurationAudit.findByPk(auditId, { transaction });
    if (!audit) {
        throw new common_1.NotFoundException(`Audit ${auditId} not found`);
    }
    await audit.update({
        status: AuditStatus.COMPLETED,
        completedDate: new Date(),
        findings,
        complianceScore,
        recommendations,
    }, { transaction });
    return audit;
}
/**
 * Gets audits by status
 *
 * @param status - Audit status
 * @returns Audits
 *
 * @example
 * ```typescript
 * const scheduled = await getAuditsByStatus(AuditStatus.SCHEDULED);
 * ```
 */
async function getAuditsByStatus(status) {
    return ConfigurationAudit.findAll({
        where: { status },
        order: [['scheduledDate', 'ASC']],
    });
}
// ============================================================================
// VERSION HISTORY FUNCTIONS
// ============================================================================
/**
 * Gets version history for CI
 *
 * @param ciId - CI identifier
 * @param limit - Maximum records
 * @returns Version history
 *
 * @example
 * ```typescript
 * const history = await getVersionHistory('ci-123', 20);
 * ```
 */
async function getVersionHistory(ciId, limit = 50) {
    return ConfigurationVersionHistory.findAll({
        where: { ciId },
        order: [['changedAt', 'DESC']],
        limit,
    });
}
/**
 * Compares two versions
 *
 * @param ciId - CI identifier
 * @param version1 - First version
 * @param version2 - Second version
 * @returns Version comparison
 *
 * @example
 * ```typescript
 * const diff = await compareVersions('ci-123', '1.0.0', '2.0.0');
 * ```
 */
async function compareVersions(ciId, version1, version2) {
    const v1 = await ConfigurationVersionHistory.findOne({
        where: { ciId, version: version1 },
    });
    const v2 = await ConfigurationVersionHistory.findOne({
        where: { ciId, version: version2 },
    });
    if (!v1 || !v2) {
        throw new common_1.NotFoundException('One or both versions not found');
    }
    const config1 = v1.newConfiguration;
    const config2 = v2.newConfiguration;
    const differences = {};
    const added = [];
    const removed = [];
    const modified = [];
    // Check for added and modified
    for (const key in config2) {
        if (!(key in config1)) {
            added.push(key);
            differences[key] = { v1: undefined, v2: config2[key] };
        }
        else if (JSON.stringify(config1[key]) !== JSON.stringify(config2[key])) {
            modified.push(key);
            differences[key] = { v1: config1[key], v2: config2[key] };
        }
    }
    // Check for removed
    for (const key in config1) {
        if (!(key in config2)) {
            removed.push(key);
            differences[key] = { v1: config1[key], v2: undefined };
        }
    }
    return { differences, added, removed, modified };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    ConfigurationItem,
    ConfigurationBaseline,
    ChangeRequest,
    CIRelationship,
    ConfigurationSnapshot,
    DriftRecord,
    ConfigurationAudit,
    ConfigurationVersionHistory,
    // CI Functions
    createConfigurationItem,
    updateConfigurationItem,
    getConfigurationItem,
    getConfigurationItemsByType,
    getConfigurationItemsByEnvironment,
    verifyConfigurationItem,
    decommissionConfigurationItem,
    // Baseline Functions
    createBaseline,
    approveBaseline,
    activateBaseline,
    getActiveBaselines,
    compareToBaseline,
    // Change Request Functions
    createChangeRequest,
    submitChangeRequest,
    approveChangeRequest,
    rejectChangeRequest,
    implementChangeRequest,
    rollbackChangeRequest,
    getChangeRequestsByStatus,
    analyzeChangeImpact,
    // Relationship Functions
    createCIRelationship,
    removeCIRelationship,
    getCIRelationships,
    getCIDependencyTree,
    // Snapshot Functions
    createConfigurationSnapshot,
    getCISnapshots,
    restoreFromSnapshot,
    // Drift Detection Functions
    detectConfigurationDrift,
    scanForDrift,
    remediateDrift,
    getDriftRecordsByStatus,
    // Audit Functions
    createConfigurationAudit,
    startConfigurationAudit,
    completeConfigurationAudit,
    getAuditsByStatus,
    // Version History Functions
    getVersionHistory,
    compareVersions,
};
//# sourceMappingURL=asset-configuration-commands.js.map