"use strict";
/**
 * LOC: SAN_DB_KIT_001
 * File: /reuse/san/san-database-schema-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM core)
 *   - sequelize-typescript (decorators)
 *   - @nestjs/common
 *
 * DOWNSTREAM (imported by):
 *   - SAN management modules
 *   - Storage infrastructure services
 *   - Database migration files
 *   - SAN monitoring systems
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
exports.SanMaintenance = exports.SanBulkOperations = exports.SanQueryFunctions = exports.SanIndexing = exports.SanSeedingValidation = exports.SanSchemaOperations = exports.SanMigrationHelpers = exports.SanModels = exports.SanReplication = exports.SanSnapshot = exports.SanLun = exports.SanVolume = exports.ReplicationType = exports.StorageProtocol = exports.ReplicationStatus = exports.SnapshotStatus = exports.LunStatus = exports.VolumeStatus = void 0;
exports.createSanVolumeTable = createSanVolumeTable;
exports.createSanLunTable = createSanLunTable;
exports.createSanSnapshotTable = createSanSnapshotTable;
exports.createSanReplicationTable = createSanReplicationTable;
exports.addColumnToSanTable = addColumnToSanTable;
exports.modifyColumnInSanTable = modifyColumnInSanTable;
exports.dropColumnFromSanTable = dropColumnFromSanTable;
exports.createIndexOnSanTable = createIndexOnSanTable;
exports.initializeSanSchema = initializeSanSchema;
exports.validateSanSchema = validateSanSchema;
exports.migrateSanSchema = migrateSanSchema;
exports.rollbackSanSchema = rollbackSanSchema;
exports.getSanSchemaVersion = getSanSchemaVersion;
exports.compareSanSchemas = compareSanSchemas;
exports.seedSanVolumes = seedSanVolumes;
exports.seedSanLuns = seedSanLuns;
exports.validateSanVolumeData = validateSanVolumeData;
exports.validateSanReplicationConfig = validateSanReplicationConfig;
exports.createSanVolumeIndexes = createSanVolumeIndexes;
exports.createSanLunIndexes = createSanLunIndexes;
exports.createSanSnapshotIndexes = createSanSnapshotIndexes;
exports.createSanReplicationIndexes = createSanReplicationIndexes;
exports.getVolumeCapacityStats = getVolumeCapacityStats;
exports.getLunPerformanceMetrics = getLunPerformanceMetrics;
exports.getSnapshotRetentionCompliance = getSnapshotRetentionCompliance;
exports.getReplicationHealthStatus = getReplicationHealthStatus;
exports.findVolumesByUtilization = findVolumesByUtilization;
exports.findLunsWithHighLatency = findLunsWithHighLatency;
exports.findExpiredSnapshots = findExpiredSnapshots;
exports.findStaleReplications = findStaleReplications;
exports.bulkCreateVolumes = bulkCreateVolumes;
exports.bulkUpdateVolumeStatus = bulkUpdateVolumeStatus;
exports.bulkDeleteExpiredSnapshots = bulkDeleteExpiredSnapshots;
exports.bulkCreateSnapshotsForVolumes = bulkCreateSnapshotsForVolumes;
exports.cleanupDeletedResources = cleanupDeletedResources;
exports.optimizeSanDatabaseTables = optimizeSanDatabaseTables;
/**
 * File: /reuse/san/san-database-schema-kit.ts
 * Locator: WC-SAN-DBK-001
 * Purpose: SAN Database Schema Kit - Comprehensive database operations for Storage Area Network management
 *
 * Upstream: Sequelize 6.x, Sequelize-TypeScript, NestJS, PostgreSQL
 * Downstream: SAN management services, storage infrastructure, monitoring systems
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, PostgreSQL 14+
 * Exports: 36 utility functions for SAN schema operations, migrations, seeding, validation, indexing
 *
 * LLM Context: Comprehensive SAN (Storage Area Network) database schema utilities for enterprise storage management.
 * Provides Sequelize model definitions for SAN volumes, LUNs, snapshots, and replication configurations.
 * Includes migration helpers, type-safe schema operations, validation utilities, and performance-optimized indexing
 * strategies. Designed for high-performance storage infrastructure with audit trails, temporal tracking, and
 * comprehensive data integrity constraints. Essential for managing enterprise storage operations with compliance
 * requirements and zero tolerance for data loss.
 */
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Volume status enumeration
 */
var VolumeStatus;
(function (VolumeStatus) {
    VolumeStatus["AVAILABLE"] = "AVAILABLE";
    VolumeStatus["IN_USE"] = "IN_USE";
    VolumeStatus["CREATING"] = "CREATING";
    VolumeStatus["DELETING"] = "DELETING";
    VolumeStatus["ERROR"] = "ERROR";
    VolumeStatus["MAINTENANCE"] = "MAINTENANCE";
})(VolumeStatus || (exports.VolumeStatus = VolumeStatus = {}));
/**
 * LUN status enumeration
 */
var LunStatus;
(function (LunStatus) {
    LunStatus["ONLINE"] = "ONLINE";
    LunStatus["OFFLINE"] = "OFFLINE";
    LunStatus["DEGRADED"] = "DEGRADED";
    LunStatus["FAILED"] = "FAILED";
    LunStatus["INITIALIZING"] = "INITIALIZING";
})(LunStatus || (exports.LunStatus = LunStatus = {}));
/**
 * Snapshot status enumeration
 */
var SnapshotStatus;
(function (SnapshotStatus) {
    SnapshotStatus["CREATING"] = "CREATING";
    SnapshotStatus["AVAILABLE"] = "AVAILABLE";
    SnapshotStatus["DELETING"] = "DELETING";
    SnapshotStatus["ERROR"] = "ERROR";
    SnapshotStatus["RESTORING"] = "RESTORING";
})(SnapshotStatus || (exports.SnapshotStatus = SnapshotStatus = {}));
/**
 * Replication status enumeration
 */
var ReplicationStatus;
(function (ReplicationStatus) {
    ReplicationStatus["ACTIVE"] = "ACTIVE";
    ReplicationStatus["PAUSED"] = "PAUSED";
    ReplicationStatus["SYNCING"] = "SYNCING";
    ReplicationStatus["ERROR"] = "ERROR";
    ReplicationStatus["STOPPED"] = "STOPPED";
})(ReplicationStatus || (exports.ReplicationStatus = ReplicationStatus = {}));
/**
 * Storage protocol enumeration
 */
var StorageProtocol;
(function (StorageProtocol) {
    StorageProtocol["ISCSI"] = "ISCSI";
    StorageProtocol["FC"] = "FC";
    StorageProtocol["FCOE"] = "FCOE";
    StorageProtocol["NFS"] = "NFS";
    StorageProtocol["SMB"] = "SMB";
})(StorageProtocol || (exports.StorageProtocol = StorageProtocol = {}));
/**
 * Replication type enumeration
 */
var ReplicationType;
(function (ReplicationType) {
    ReplicationType["SYNCHRONOUS"] = "SYNCHRONOUS";
    ReplicationType["ASYNCHRONOUS"] = "ASYNCHRONOUS";
    ReplicationType["SNAPSHOT"] = "SNAPSHOT";
})(ReplicationType || (exports.ReplicationType = ReplicationType = {}));
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
/**
 * SanVolume Model
 * Represents a storage volume in the SAN infrastructure
 */
let SanVolume = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Scopes)(() => ({
            active: {
                where: {
                    deletedAt: null,
                    status: { [sequelize_1.Op.ne]: VolumeStatus.DELETING },
                },
            },
            available: {
                where: {
                    status: VolumeStatus.AVAILABLE,
                    deletedAt: null,
                },
            },
            inUse: {
                where: {
                    status: VolumeStatus.IN_USE,
                    deletedAt: null,
                },
            },
            withCapacityAbove: (minGb) => ({
                where: {
                    capacityGb: { [sequelize_1.Op.gte]: minGb },
                },
            }),
            thinProvisioned: {
                where: {
                    thinProvisioned: true,
                },
            },
        })), (0, sequelize_typescript_1.Table)({
            tableName: 'san_volumes',
            timestamps: true,
            paranoid: true,
            underscored: true,
            indexes: [
                {
                    name: 'idx_san_volumes_status',
                    fields: ['status'],
                },
                {
                    name: 'idx_san_volumes_wwn',
                    fields: ['wwn'],
                    unique: true,
                    where: { wwn: { [sequelize_1.Op.ne]: null } },
                },
                {
                    name: 'idx_san_volumes_pool_status',
                    fields: ['storage_pool_id', 'status'],
                },
                {
                    name: 'idx_san_volumes_created_at',
                    fields: ['created_at'],
                },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateWwn_decorators;
    let _static_validateCapacity_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _capacityGb_decorators;
    let _capacityGb_initializers = [];
    let _capacityGb_extraInitializers = [];
    let _usedCapacityGb_decorators;
    let _usedCapacityGb_initializers = [];
    let _usedCapacityGb_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _storagePoolId_decorators;
    let _storagePoolId_initializers = [];
    let _storagePoolId_extraInitializers = [];
    let _protocol_decorators;
    let _protocol_initializers = [];
    let _protocol_extraInitializers = [];
    let _wwn_decorators;
    let _wwn_initializers = [];
    let _wwn_extraInitializers = [];
    let _serialNumber_decorators;
    let _serialNumber_initializers = [];
    let _serialNumber_extraInitializers = [];
    let _thinProvisioned_decorators;
    let _thinProvisioned_initializers = [];
    let _thinProvisioned_extraInitializers = [];
    let _compressionEnabled_decorators;
    let _compressionEnabled_initializers = [];
    let _compressionEnabled_extraInitializers = [];
    let _deduplicationEnabled_decorators;
    let _deduplicationEnabled_initializers = [];
    let _deduplicationEnabled_extraInitializers = [];
    let _encryptionEnabled_decorators;
    let _encryptionEnabled_initializers = [];
    let _encryptionEnabled_extraInitializers = [];
    let _iopsLimit_decorators;
    let _iopsLimit_initializers = [];
    let _iopsLimit_extraInitializers = [];
    let _throughputMbps_decorators;
    let _throughputMbps_initializers = [];
    let _throughputMbps_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _luns_decorators;
    let _luns_initializers = [];
    let _luns_extraInitializers = [];
    let _snapshots_decorators;
    let _snapshots_initializers = [];
    let _snapshots_extraInitializers = [];
    let _sourceReplications_decorators;
    let _sourceReplications_initializers = [];
    let _sourceReplications_extraInitializers = [];
    let _targetReplications_decorators;
    let _targetReplications_initializers = [];
    let _targetReplications_extraInitializers = [];
    var SanVolume = _classThis = class extends _classSuper {
        // Hooks
        static async generateWwn(instance) {
            if (!instance.wwn && instance.protocol === StorageProtocol.FC) {
                instance.wwn = `50:${Array.from({ length: 7 }, () => Math.floor(Math.random() * 256)
                    .toString(16)
                    .padStart(2, '0')).join(':')}`;
            }
        }
        static validateCapacity(instance) {
            if (instance.usedCapacityGb > instance.capacityGb) {
                throw new Error('Used capacity cannot exceed total capacity');
            }
        }
        // Virtual attributes
        get availableCapacityGb() {
            return Number(this.capacityGb) - Number(this.usedCapacityGb);
        }
        get utilizationPercent() {
            return (Number(this.usedCapacityGb) / Number(this.capacityGb)) * 100;
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.capacityGb = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _capacityGb_initializers, void 0));
            this.usedCapacityGb = (__runInitializers(this, _capacityGb_extraInitializers), __runInitializers(this, _usedCapacityGb_initializers, void 0));
            this.status = (__runInitializers(this, _usedCapacityGb_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.storagePoolId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _storagePoolId_initializers, void 0));
            this.protocol = (__runInitializers(this, _storagePoolId_extraInitializers), __runInitializers(this, _protocol_initializers, void 0));
            this.wwn = (__runInitializers(this, _protocol_extraInitializers), __runInitializers(this, _wwn_initializers, void 0));
            this.serialNumber = (__runInitializers(this, _wwn_extraInitializers), __runInitializers(this, _serialNumber_initializers, void 0));
            this.thinProvisioned = (__runInitializers(this, _serialNumber_extraInitializers), __runInitializers(this, _thinProvisioned_initializers, void 0));
            this.compressionEnabled = (__runInitializers(this, _thinProvisioned_extraInitializers), __runInitializers(this, _compressionEnabled_initializers, void 0));
            this.deduplicationEnabled = (__runInitializers(this, _compressionEnabled_extraInitializers), __runInitializers(this, _deduplicationEnabled_initializers, void 0));
            this.encryptionEnabled = (__runInitializers(this, _deduplicationEnabled_extraInitializers), __runInitializers(this, _encryptionEnabled_initializers, void 0));
            this.iopsLimit = (__runInitializers(this, _encryptionEnabled_extraInitializers), __runInitializers(this, _iopsLimit_initializers, void 0));
            this.throughputMbps = (__runInitializers(this, _iopsLimit_extraInitializers), __runInitializers(this, _throughputMbps_initializers, void 0));
            this.tags = (__runInitializers(this, _throughputMbps_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdBy = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            // Associations
            this.luns = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _luns_initializers, void 0));
            this.snapshots = (__runInitializers(this, _luns_extraInitializers), __runInitializers(this, _snapshots_initializers, void 0));
            this.sourceReplications = (__runInitializers(this, _snapshots_extraInitializers), __runInitializers(this, _sourceReplications_initializers, void 0));
            this.targetReplications = (__runInitializers(this, _sourceReplications_extraInitializers), __runInitializers(this, _targetReplications_initializers, void 0));
            __runInitializers(this, _targetReplications_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SanVolume");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _name_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _description_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _capacityGb_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _usedCapacityGb_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(VolumeStatus.CREATING), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(VolumeStatus)))];
        _storagePoolId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _protocol_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(StorageProtocol)))];
        _wwn_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(32))];
        _serialNumber_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(64))];
        _thinProvisioned_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _compressionEnabled_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _deduplicationEnabled_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _encryptionEnabled_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _iopsLimit_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _throughputMbps_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _tags_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _updatedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _deletedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _createdAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _updatedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _luns_decorators = [(0, sequelize_typescript_1.HasMany)(() => SanLun)];
        _snapshots_decorators = [(0, sequelize_typescript_1.HasMany)(() => SanSnapshot)];
        _sourceReplications_decorators = [(0, sequelize_typescript_1.HasMany)(() => SanReplication, 'sourceVolumeId')];
        _targetReplications_decorators = [(0, sequelize_typescript_1.HasMany)(() => SanReplication, 'targetVolumeId')];
        _static_generateWwn_decorators = [sequelize_typescript_1.BeforeCreate];
        _static_validateCapacity_decorators = [sequelize_typescript_1.BeforeCreate, sequelize_typescript_1.BeforeUpdate];
        __esDecorate(_classThis, null, _static_generateWwn_decorators, { kind: "method", name: "generateWwn", static: true, private: false, access: { has: obj => "generateWwn" in obj, get: obj => obj.generateWwn }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(_classThis, null, _static_validateCapacity_decorators, { kind: "method", name: "validateCapacity", static: true, private: false, access: { has: obj => "validateCapacity" in obj, get: obj => obj.validateCapacity }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _capacityGb_decorators, { kind: "field", name: "capacityGb", static: false, private: false, access: { has: obj => "capacityGb" in obj, get: obj => obj.capacityGb, set: (obj, value) => { obj.capacityGb = value; } }, metadata: _metadata }, _capacityGb_initializers, _capacityGb_extraInitializers);
        __esDecorate(null, null, _usedCapacityGb_decorators, { kind: "field", name: "usedCapacityGb", static: false, private: false, access: { has: obj => "usedCapacityGb" in obj, get: obj => obj.usedCapacityGb, set: (obj, value) => { obj.usedCapacityGb = value; } }, metadata: _metadata }, _usedCapacityGb_initializers, _usedCapacityGb_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _storagePoolId_decorators, { kind: "field", name: "storagePoolId", static: false, private: false, access: { has: obj => "storagePoolId" in obj, get: obj => obj.storagePoolId, set: (obj, value) => { obj.storagePoolId = value; } }, metadata: _metadata }, _storagePoolId_initializers, _storagePoolId_extraInitializers);
        __esDecorate(null, null, _protocol_decorators, { kind: "field", name: "protocol", static: false, private: false, access: { has: obj => "protocol" in obj, get: obj => obj.protocol, set: (obj, value) => { obj.protocol = value; } }, metadata: _metadata }, _protocol_initializers, _protocol_extraInitializers);
        __esDecorate(null, null, _wwn_decorators, { kind: "field", name: "wwn", static: false, private: false, access: { has: obj => "wwn" in obj, get: obj => obj.wwn, set: (obj, value) => { obj.wwn = value; } }, metadata: _metadata }, _wwn_initializers, _wwn_extraInitializers);
        __esDecorate(null, null, _serialNumber_decorators, { kind: "field", name: "serialNumber", static: false, private: false, access: { has: obj => "serialNumber" in obj, get: obj => obj.serialNumber, set: (obj, value) => { obj.serialNumber = value; } }, metadata: _metadata }, _serialNumber_initializers, _serialNumber_extraInitializers);
        __esDecorate(null, null, _thinProvisioned_decorators, { kind: "field", name: "thinProvisioned", static: false, private: false, access: { has: obj => "thinProvisioned" in obj, get: obj => obj.thinProvisioned, set: (obj, value) => { obj.thinProvisioned = value; } }, metadata: _metadata }, _thinProvisioned_initializers, _thinProvisioned_extraInitializers);
        __esDecorate(null, null, _compressionEnabled_decorators, { kind: "field", name: "compressionEnabled", static: false, private: false, access: { has: obj => "compressionEnabled" in obj, get: obj => obj.compressionEnabled, set: (obj, value) => { obj.compressionEnabled = value; } }, metadata: _metadata }, _compressionEnabled_initializers, _compressionEnabled_extraInitializers);
        __esDecorate(null, null, _deduplicationEnabled_decorators, { kind: "field", name: "deduplicationEnabled", static: false, private: false, access: { has: obj => "deduplicationEnabled" in obj, get: obj => obj.deduplicationEnabled, set: (obj, value) => { obj.deduplicationEnabled = value; } }, metadata: _metadata }, _deduplicationEnabled_initializers, _deduplicationEnabled_extraInitializers);
        __esDecorate(null, null, _encryptionEnabled_decorators, { kind: "field", name: "encryptionEnabled", static: false, private: false, access: { has: obj => "encryptionEnabled" in obj, get: obj => obj.encryptionEnabled, set: (obj, value) => { obj.encryptionEnabled = value; } }, metadata: _metadata }, _encryptionEnabled_initializers, _encryptionEnabled_extraInitializers);
        __esDecorate(null, null, _iopsLimit_decorators, { kind: "field", name: "iopsLimit", static: false, private: false, access: { has: obj => "iopsLimit" in obj, get: obj => obj.iopsLimit, set: (obj, value) => { obj.iopsLimit = value; } }, metadata: _metadata }, _iopsLimit_initializers, _iopsLimit_extraInitializers);
        __esDecorate(null, null, _throughputMbps_decorators, { kind: "field", name: "throughputMbps", static: false, private: false, access: { has: obj => "throughputMbps" in obj, get: obj => obj.throughputMbps, set: (obj, value) => { obj.throughputMbps = value; } }, metadata: _metadata }, _throughputMbps_initializers, _throughputMbps_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _luns_decorators, { kind: "field", name: "luns", static: false, private: false, access: { has: obj => "luns" in obj, get: obj => obj.luns, set: (obj, value) => { obj.luns = value; } }, metadata: _metadata }, _luns_initializers, _luns_extraInitializers);
        __esDecorate(null, null, _snapshots_decorators, { kind: "field", name: "snapshots", static: false, private: false, access: { has: obj => "snapshots" in obj, get: obj => obj.snapshots, set: (obj, value) => { obj.snapshots = value; } }, metadata: _metadata }, _snapshots_initializers, _snapshots_extraInitializers);
        __esDecorate(null, null, _sourceReplications_decorators, { kind: "field", name: "sourceReplications", static: false, private: false, access: { has: obj => "sourceReplications" in obj, get: obj => obj.sourceReplications, set: (obj, value) => { obj.sourceReplications = value; } }, metadata: _metadata }, _sourceReplications_initializers, _sourceReplications_extraInitializers);
        __esDecorate(null, null, _targetReplications_decorators, { kind: "field", name: "targetReplications", static: false, private: false, access: { has: obj => "targetReplications" in obj, get: obj => obj.targetReplications, set: (obj, value) => { obj.targetReplications = value; } }, metadata: _metadata }, _targetReplications_initializers, _targetReplications_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SanVolume = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SanVolume = _classThis;
})();
exports.SanVolume = SanVolume;
/**
 * SanLun Model
 * Represents a Logical Unit Number (LUN) in the SAN
 */
let SanLun = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Scopes)(() => ({
            online: {
                where: {
                    status: LunStatus.ONLINE,
                    deletedAt: null,
                },
            },
            byVolume: (volumeId) => ({
                where: {
                    volumeId,
                },
            }),
            readOnly: {
                where: {
                    readOnly: true,
                },
            },
            readWrite: {
                where: {
                    readOnly: false,
                },
            },
        })), (0, sequelize_typescript_1.Table)({
            tableName: 'san_luns',
            timestamps: true,
            paranoid: true,
            underscored: true,
            indexes: [
                {
                    name: 'idx_san_luns_volume_id',
                    fields: ['volume_id'],
                },
                {
                    name: 'idx_san_luns_status',
                    fields: ['status'],
                },
                {
                    name: 'idx_san_luns_volume_lun_number',
                    fields: ['volume_id', 'lun_number'],
                    unique: true,
                },
                {
                    name: 'idx_san_luns_created_at',
                    fields: ['created_at'],
                },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_validateLunNumber_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _lunNumber_decorators;
    let _lunNumber_initializers = [];
    let _lunNumber_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _volumeId_decorators;
    let _volumeId_initializers = [];
    let _volumeId_extraInitializers = [];
    let _capacityGb_decorators;
    let _capacityGb_initializers = [];
    let _capacityGb_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _targetId_decorators;
    let _targetId_initializers = [];
    let _targetId_extraInitializers = [];
    let _initiatorGroup_decorators;
    let _initiatorGroup_initializers = [];
    let _initiatorGroup_extraInitializers = [];
    let _maskedTo_decorators;
    let _maskedTo_initializers = [];
    let _maskedTo_extraInitializers = [];
    let _readOnly_decorators;
    let _readOnly_initializers = [];
    let _readOnly_extraInitializers = [];
    let _blockSizeBytes_decorators;
    let _blockSizeBytes_initializers = [];
    let _blockSizeBytes_extraInitializers = [];
    let _multipath_decorators;
    let _multipath_initializers = [];
    let _multipath_extraInitializers = [];
    let _alua_decorators;
    let _alua_initializers = [];
    let _alua_extraInitializers = [];
    let _iopsRead_decorators;
    let _iopsRead_initializers = [];
    let _iopsRead_extraInitializers = [];
    let _iopsWrite_decorators;
    let _iopsWrite_initializers = [];
    let _iopsWrite_extraInitializers = [];
    let _latencyMs_decorators;
    let _latencyMs_initializers = [];
    let _latencyMs_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _volume_decorators;
    let _volume_initializers = [];
    let _volume_extraInitializers = [];
    let _snapshots_decorators;
    let _snapshots_initializers = [];
    let _snapshots_extraInitializers = [];
    var SanLun = _classThis = class extends _classSuper {
        // Hooks
        static validateLunNumber(instance) {
            if (instance.lunNumber < 0 || instance.lunNumber > 255) {
                throw new Error('LUN number must be between 0 and 255');
            }
        }
        // Virtual attributes
        get totalIops() {
            return (this.iopsRead || 0) + (this.iopsWrite || 0);
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.lunNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _lunNumber_initializers, void 0));
            this.name = (__runInitializers(this, _lunNumber_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.volumeId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _volumeId_initializers, void 0));
            this.capacityGb = (__runInitializers(this, _volumeId_extraInitializers), __runInitializers(this, _capacityGb_initializers, void 0));
            this.status = (__runInitializers(this, _capacityGb_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.targetId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _targetId_initializers, void 0));
            this.initiatorGroup = (__runInitializers(this, _targetId_extraInitializers), __runInitializers(this, _initiatorGroup_initializers, void 0));
            this.maskedTo = (__runInitializers(this, _initiatorGroup_extraInitializers), __runInitializers(this, _maskedTo_initializers, void 0));
            this.readOnly = (__runInitializers(this, _maskedTo_extraInitializers), __runInitializers(this, _readOnly_initializers, void 0));
            this.blockSizeBytes = (__runInitializers(this, _readOnly_extraInitializers), __runInitializers(this, _blockSizeBytes_initializers, void 0));
            this.multipath = (__runInitializers(this, _blockSizeBytes_extraInitializers), __runInitializers(this, _multipath_initializers, void 0));
            this.alua = (__runInitializers(this, _multipath_extraInitializers), __runInitializers(this, _alua_initializers, void 0));
            this.iopsRead = (__runInitializers(this, _alua_extraInitializers), __runInitializers(this, _iopsRead_initializers, void 0));
            this.iopsWrite = (__runInitializers(this, _iopsRead_extraInitializers), __runInitializers(this, _iopsWrite_initializers, void 0));
            this.latencyMs = (__runInitializers(this, _iopsWrite_extraInitializers), __runInitializers(this, _latencyMs_initializers, void 0));
            this.tags = (__runInitializers(this, _latencyMs_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdBy = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            // Associations
            this.volume = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _volume_initializers, void 0));
            this.snapshots = (__runInitializers(this, _volume_extraInitializers), __runInitializers(this, _snapshots_initializers, void 0));
            __runInitializers(this, _snapshots_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SanLun");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _lunNumber_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _name_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _description_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _volumeId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => SanVolume), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _capacityGb_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(LunStatus.INITIALIZING), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(LunStatus)))];
        _targetId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(64))];
        _initiatorGroup_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _maskedTo_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _readOnly_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _blockSizeBytes_decorators = [(0, sequelize_typescript_1.Default)(512), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _multipath_decorators = [(0, sequelize_typescript_1.Default)(true), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _alua_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _iopsRead_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _iopsWrite_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _latencyMs_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 4))];
        _tags_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _updatedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _deletedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _createdAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _updatedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _volume_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => SanVolume)];
        _snapshots_decorators = [(0, sequelize_typescript_1.HasMany)(() => SanSnapshot)];
        _static_validateLunNumber_decorators = [sequelize_typescript_1.BeforeCreate, sequelize_typescript_1.BeforeUpdate];
        __esDecorate(_classThis, null, _static_validateLunNumber_decorators, { kind: "method", name: "validateLunNumber", static: true, private: false, access: { has: obj => "validateLunNumber" in obj, get: obj => obj.validateLunNumber }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _lunNumber_decorators, { kind: "field", name: "lunNumber", static: false, private: false, access: { has: obj => "lunNumber" in obj, get: obj => obj.lunNumber, set: (obj, value) => { obj.lunNumber = value; } }, metadata: _metadata }, _lunNumber_initializers, _lunNumber_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _volumeId_decorators, { kind: "field", name: "volumeId", static: false, private: false, access: { has: obj => "volumeId" in obj, get: obj => obj.volumeId, set: (obj, value) => { obj.volumeId = value; } }, metadata: _metadata }, _volumeId_initializers, _volumeId_extraInitializers);
        __esDecorate(null, null, _capacityGb_decorators, { kind: "field", name: "capacityGb", static: false, private: false, access: { has: obj => "capacityGb" in obj, get: obj => obj.capacityGb, set: (obj, value) => { obj.capacityGb = value; } }, metadata: _metadata }, _capacityGb_initializers, _capacityGb_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _targetId_decorators, { kind: "field", name: "targetId", static: false, private: false, access: { has: obj => "targetId" in obj, get: obj => obj.targetId, set: (obj, value) => { obj.targetId = value; } }, metadata: _metadata }, _targetId_initializers, _targetId_extraInitializers);
        __esDecorate(null, null, _initiatorGroup_decorators, { kind: "field", name: "initiatorGroup", static: false, private: false, access: { has: obj => "initiatorGroup" in obj, get: obj => obj.initiatorGroup, set: (obj, value) => { obj.initiatorGroup = value; } }, metadata: _metadata }, _initiatorGroup_initializers, _initiatorGroup_extraInitializers);
        __esDecorate(null, null, _maskedTo_decorators, { kind: "field", name: "maskedTo", static: false, private: false, access: { has: obj => "maskedTo" in obj, get: obj => obj.maskedTo, set: (obj, value) => { obj.maskedTo = value; } }, metadata: _metadata }, _maskedTo_initializers, _maskedTo_extraInitializers);
        __esDecorate(null, null, _readOnly_decorators, { kind: "field", name: "readOnly", static: false, private: false, access: { has: obj => "readOnly" in obj, get: obj => obj.readOnly, set: (obj, value) => { obj.readOnly = value; } }, metadata: _metadata }, _readOnly_initializers, _readOnly_extraInitializers);
        __esDecorate(null, null, _blockSizeBytes_decorators, { kind: "field", name: "blockSizeBytes", static: false, private: false, access: { has: obj => "blockSizeBytes" in obj, get: obj => obj.blockSizeBytes, set: (obj, value) => { obj.blockSizeBytes = value; } }, metadata: _metadata }, _blockSizeBytes_initializers, _blockSizeBytes_extraInitializers);
        __esDecorate(null, null, _multipath_decorators, { kind: "field", name: "multipath", static: false, private: false, access: { has: obj => "multipath" in obj, get: obj => obj.multipath, set: (obj, value) => { obj.multipath = value; } }, metadata: _metadata }, _multipath_initializers, _multipath_extraInitializers);
        __esDecorate(null, null, _alua_decorators, { kind: "field", name: "alua", static: false, private: false, access: { has: obj => "alua" in obj, get: obj => obj.alua, set: (obj, value) => { obj.alua = value; } }, metadata: _metadata }, _alua_initializers, _alua_extraInitializers);
        __esDecorate(null, null, _iopsRead_decorators, { kind: "field", name: "iopsRead", static: false, private: false, access: { has: obj => "iopsRead" in obj, get: obj => obj.iopsRead, set: (obj, value) => { obj.iopsRead = value; } }, metadata: _metadata }, _iopsRead_initializers, _iopsRead_extraInitializers);
        __esDecorate(null, null, _iopsWrite_decorators, { kind: "field", name: "iopsWrite", static: false, private: false, access: { has: obj => "iopsWrite" in obj, get: obj => obj.iopsWrite, set: (obj, value) => { obj.iopsWrite = value; } }, metadata: _metadata }, _iopsWrite_initializers, _iopsWrite_extraInitializers);
        __esDecorate(null, null, _latencyMs_decorators, { kind: "field", name: "latencyMs", static: false, private: false, access: { has: obj => "latencyMs" in obj, get: obj => obj.latencyMs, set: (obj, value) => { obj.latencyMs = value; } }, metadata: _metadata }, _latencyMs_initializers, _latencyMs_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _volume_decorators, { kind: "field", name: "volume", static: false, private: false, access: { has: obj => "volume" in obj, get: obj => obj.volume, set: (obj, value) => { obj.volume = value; } }, metadata: _metadata }, _volume_initializers, _volume_extraInitializers);
        __esDecorate(null, null, _snapshots_decorators, { kind: "field", name: "snapshots", static: false, private: false, access: { has: obj => "snapshots" in obj, get: obj => obj.snapshots, set: (obj, value) => { obj.snapshots = value; } }, metadata: _metadata }, _snapshots_initializers, _snapshots_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SanLun = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SanLun = _classThis;
})();
exports.SanLun = SanLun;
/**
 * SanSnapshot Model
 * Represents a point-in-time snapshot of a volume or LUN
 */
let SanSnapshot = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'san_snapshots',
            timestamps: true,
            paranoid: true,
            underscored: true,
            indexes: [
                {
                    name: 'idx_san_snapshots_volume_id_created_at',
                    fields: ['volume_id', 'created_at'],
                },
                {
                    name: 'idx_san_snapshots_lun_id_created_at',
                    fields: ['lun_id', 'created_at'],
                },
                {
                    name: 'idx_san_snapshots_status',
                    fields: ['status'],
                },
                {
                    name: 'idx_san_snapshots_expires_at',
                    fields: ['expires_at'],
                    where: { expires_at: { [sequelize_1.Op.ne]: null } },
                },
                {
                    name: 'idx_san_snapshots_schedule_id',
                    fields: ['schedule_id'],
                },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_setExpirationDate_decorators;
    let _static_validateVolumeOrLun_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _volumeId_decorators;
    let _volumeId_initializers = [];
    let _volumeId_extraInitializers = [];
    let _lunId_decorators;
    let _lunId_initializers = [];
    let _lunId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _sizeGb_decorators;
    let _sizeGb_initializers = [];
    let _sizeGb_extraInitializers = [];
    let _retentionDays_decorators;
    let _retentionDays_initializers = [];
    let _retentionDays_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    let _isAutomatic_decorators;
    let _isAutomatic_initializers = [];
    let _isAutomatic_extraInitializers = [];
    let _scheduleId_decorators;
    let _scheduleId_initializers = [];
    let _scheduleId_extraInitializers = [];
    let _consistencyGroupId_decorators;
    let _consistencyGroupId_initializers = [];
    let _consistencyGroupId_extraInitializers = [];
    let _sourceSnapshotId_decorators;
    let _sourceSnapshotId_initializers = [];
    let _sourceSnapshotId_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _volume_decorators;
    let _volume_initializers = [];
    let _volume_extraInitializers = [];
    let _lun_decorators;
    let _lun_initializers = [];
    let _lun_extraInitializers = [];
    var SanSnapshot = _classThis = class extends _classSuper {
        // Hooks
        static setExpirationDate(instance) {
            if (instance.retentionDays && !instance.expiresAt) {
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + instance.retentionDays);
                instance.expiresAt = expiresAt;
            }
        }
        static validateVolumeOrLun(instance) {
            if (!instance.volumeId && !instance.lunId) {
                throw new Error('Snapshot must be associated with either a volume or LUN');
            }
            if (instance.volumeId && instance.lunId) {
                throw new Error('Snapshot cannot be associated with both volume and LUN');
            }
        }
        // Virtual attributes
        get isExpired() {
            return this.expiresAt ? this.expiresAt < new Date() : false;
        }
        get daysUntilExpiration() {
            if (!this.expiresAt)
                return null;
            const diffMs = this.expiresAt.getTime() - Date.now();
            return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.volumeId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _volumeId_initializers, void 0));
            this.lunId = (__runInitializers(this, _volumeId_extraInitializers), __runInitializers(this, _lunId_initializers, void 0));
            this.status = (__runInitializers(this, _lunId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.sizeGb = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _sizeGb_initializers, void 0));
            this.retentionDays = (__runInitializers(this, _sizeGb_extraInitializers), __runInitializers(this, _retentionDays_initializers, void 0));
            this.expiresAt = (__runInitializers(this, _retentionDays_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
            this.isAutomatic = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _isAutomatic_initializers, void 0));
            this.scheduleId = (__runInitializers(this, _isAutomatic_extraInitializers), __runInitializers(this, _scheduleId_initializers, void 0));
            this.consistencyGroupId = (__runInitializers(this, _scheduleId_extraInitializers), __runInitializers(this, _consistencyGroupId_initializers, void 0));
            this.sourceSnapshotId = (__runInitializers(this, _consistencyGroupId_extraInitializers), __runInitializers(this, _sourceSnapshotId_initializers, void 0));
            this.tags = (__runInitializers(this, _sourceSnapshotId_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdBy = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            // Associations
            this.volume = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _volume_initializers, void 0));
            this.lun = (__runInitializers(this, _volume_extraInitializers), __runInitializers(this, _lun_initializers, void 0));
            __runInitializers(this, _lun_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SanSnapshot");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _name_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _description_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _volumeId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => SanVolume), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _lunId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => SanLun), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(SnapshotStatus.CREATING), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(SnapshotStatus)))];
        _sizeGb_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _retentionDays_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _expiresAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _isAutomatic_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _scheduleId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _consistencyGroupId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _sourceSnapshotId_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _tags_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _updatedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _deletedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _createdAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _updatedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _volume_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => SanVolume)];
        _lun_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => SanLun)];
        _static_setExpirationDate_decorators = [sequelize_typescript_1.BeforeCreate];
        _static_validateVolumeOrLun_decorators = [sequelize_typescript_1.BeforeCreate, sequelize_typescript_1.BeforeUpdate];
        __esDecorate(_classThis, null, _static_setExpirationDate_decorators, { kind: "method", name: "setExpirationDate", static: true, private: false, access: { has: obj => "setExpirationDate" in obj, get: obj => obj.setExpirationDate }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(_classThis, null, _static_validateVolumeOrLun_decorators, { kind: "method", name: "validateVolumeOrLun", static: true, private: false, access: { has: obj => "validateVolumeOrLun" in obj, get: obj => obj.validateVolumeOrLun }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _volumeId_decorators, { kind: "field", name: "volumeId", static: false, private: false, access: { has: obj => "volumeId" in obj, get: obj => obj.volumeId, set: (obj, value) => { obj.volumeId = value; } }, metadata: _metadata }, _volumeId_initializers, _volumeId_extraInitializers);
        __esDecorate(null, null, _lunId_decorators, { kind: "field", name: "lunId", static: false, private: false, access: { has: obj => "lunId" in obj, get: obj => obj.lunId, set: (obj, value) => { obj.lunId = value; } }, metadata: _metadata }, _lunId_initializers, _lunId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _sizeGb_decorators, { kind: "field", name: "sizeGb", static: false, private: false, access: { has: obj => "sizeGb" in obj, get: obj => obj.sizeGb, set: (obj, value) => { obj.sizeGb = value; } }, metadata: _metadata }, _sizeGb_initializers, _sizeGb_extraInitializers);
        __esDecorate(null, null, _retentionDays_decorators, { kind: "field", name: "retentionDays", static: false, private: false, access: { has: obj => "retentionDays" in obj, get: obj => obj.retentionDays, set: (obj, value) => { obj.retentionDays = value; } }, metadata: _metadata }, _retentionDays_initializers, _retentionDays_extraInitializers);
        __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
        __esDecorate(null, null, _isAutomatic_decorators, { kind: "field", name: "isAutomatic", static: false, private: false, access: { has: obj => "isAutomatic" in obj, get: obj => obj.isAutomatic, set: (obj, value) => { obj.isAutomatic = value; } }, metadata: _metadata }, _isAutomatic_initializers, _isAutomatic_extraInitializers);
        __esDecorate(null, null, _scheduleId_decorators, { kind: "field", name: "scheduleId", static: false, private: false, access: { has: obj => "scheduleId" in obj, get: obj => obj.scheduleId, set: (obj, value) => { obj.scheduleId = value; } }, metadata: _metadata }, _scheduleId_initializers, _scheduleId_extraInitializers);
        __esDecorate(null, null, _consistencyGroupId_decorators, { kind: "field", name: "consistencyGroupId", static: false, private: false, access: { has: obj => "consistencyGroupId" in obj, get: obj => obj.consistencyGroupId, set: (obj, value) => { obj.consistencyGroupId = value; } }, metadata: _metadata }, _consistencyGroupId_initializers, _consistencyGroupId_extraInitializers);
        __esDecorate(null, null, _sourceSnapshotId_decorators, { kind: "field", name: "sourceSnapshotId", static: false, private: false, access: { has: obj => "sourceSnapshotId" in obj, get: obj => obj.sourceSnapshotId, set: (obj, value) => { obj.sourceSnapshotId = value; } }, metadata: _metadata }, _sourceSnapshotId_initializers, _sourceSnapshotId_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _volume_decorators, { kind: "field", name: "volume", static: false, private: false, access: { has: obj => "volume" in obj, get: obj => obj.volume, set: (obj, value) => { obj.volume = value; } }, metadata: _metadata }, _volume_initializers, _volume_extraInitializers);
        __esDecorate(null, null, _lun_decorators, { kind: "field", name: "lun", static: false, private: false, access: { has: obj => "lun" in obj, get: obj => obj.lun, set: (obj, value) => { obj.lun = value; } }, metadata: _metadata }, _lun_initializers, _lun_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SanSnapshot = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SanSnapshot = _classThis;
})();
exports.SanSnapshot = SanSnapshot;
/**
 * SanReplication Model
 * Represents replication configuration between volumes
 */
let SanReplication = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Scopes)(() => ({
            active: {
                where: {
                    status: ReplicationStatus.ACTIVE,
                    deletedAt: null,
                },
            },
            bySourceVolume: (volumeId) => ({
                where: {
                    sourceVolumeId: volumeId,
                },
            }),
            byTargetVolume: (volumeId) => ({
                where: {
                    targetVolumeId: volumeId,
                },
            }),
            synchronous: {
                where: {
                    replicationType: ReplicationType.SYNCHRONOUS,
                },
            },
            asynchronous: {
                where: {
                    replicationType: ReplicationType.ASYNCHRONOUS,
                },
            },
            withErrors: {
                where: {
                    errorCount: { [sequelize_1.Op.gt]: 0 },
                },
            },
        })), (0, sequelize_typescript_1.Table)({
            tableName: 'san_replications',
            timestamps: true,
            paranoid: true,
            underscored: true,
            indexes: [
                {
                    name: 'idx_san_replications_source_volume_id',
                    fields: ['source_volume_id'],
                },
                {
                    name: 'idx_san_replications_target_volume_id',
                    fields: ['target_volume_id'],
                },
                {
                    name: 'idx_san_replications_status_last_sync',
                    fields: ['status', 'last_sync_at'],
                },
                {
                    name: 'idx_san_replications_next_sync_at',
                    fields: ['next_sync_at'],
                    where: { next_sync_at: { [sequelize_1.Op.ne]: null } },
                },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_validateVolumes_decorators;
    let _static_calculateNextSync_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _sourceVolumeId_decorators;
    let _sourceVolumeId_initializers = [];
    let _sourceVolumeId_extraInitializers = [];
    let _targetVolumeId_decorators;
    let _targetVolumeId_initializers = [];
    let _targetVolumeId_extraInitializers = [];
    let _replicationType_decorators;
    let _replicationType_initializers = [];
    let _replicationType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _direction_decorators;
    let _direction_initializers = [];
    let _direction_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _rpoMinutes_decorators;
    let _rpoMinutes_initializers = [];
    let _rpoMinutes_extraInitializers = [];
    let _rtoMinutes_decorators;
    let _rtoMinutes_initializers = [];
    let _rtoMinutes_extraInitializers = [];
    let _lastSyncAt_decorators;
    let _lastSyncAt_initializers = [];
    let _lastSyncAt_extraInitializers = [];
    let _nextSyncAt_decorators;
    let _nextSyncAt_initializers = [];
    let _nextSyncAt_extraInitializers = [];
    let _syncIntervalMinutes_decorators;
    let _syncIntervalMinutes_initializers = [];
    let _syncIntervalMinutes_extraInitializers = [];
    let _bandwidthLimitMbps_decorators;
    let _bandwidthLimitMbps_initializers = [];
    let _bandwidthLimitMbps_extraInitializers = [];
    let _compressionEnabled_decorators;
    let _compressionEnabled_initializers = [];
    let _compressionEnabled_extraInitializers = [];
    let _encryptionEnabled_decorators;
    let _encryptionEnabled_initializers = [];
    let _encryptionEnabled_extraInitializers = [];
    let _errorCount_decorators;
    let _errorCount_initializers = [];
    let _errorCount_extraInitializers = [];
    let _lastError_decorators;
    let _lastError_initializers = [];
    let _lastError_extraInitializers = [];
    let _totalBytesSynced_decorators;
    let _totalBytesSynced_initializers = [];
    let _totalBytesSynced_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _sourceVolume_decorators;
    let _sourceVolume_initializers = [];
    let _sourceVolume_extraInitializers = [];
    let _targetVolume_decorators;
    let _targetVolume_initializers = [];
    let _targetVolume_extraInitializers = [];
    var SanReplication = _classThis = class extends _classSuper {
        // Hooks
        static validateVolumes(instance) {
            if (instance.sourceVolumeId === instance.targetVolumeId) {
                throw new Error('Source and target volumes cannot be the same');
            }
        }
        static calculateNextSync(instance) {
            if (instance.syncIntervalMinutes &&
                instance.replicationType === ReplicationType.ASYNCHRONOUS) {
                const nextSync = new Date();
                nextSync.setMinutes(nextSync.getMinutes() + instance.syncIntervalMinutes);
                instance.nextSyncAt = nextSync;
            }
        }
        // Virtual attributes
        get totalGbSynced() {
            return Number(this.totalBytesSynced || 0) / (1024 * 1024 * 1024);
        }
        get isHealthy() {
            return this.status === ReplicationStatus.ACTIVE && this.errorCount === 0;
        }
        get syncLag() {
            if (!this.lastSyncAt)
                return null;
            return Math.floor((Date.now() - this.lastSyncAt.getTime()) / (1000 * 60));
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.sourceVolumeId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _sourceVolumeId_initializers, void 0));
            this.targetVolumeId = (__runInitializers(this, _sourceVolumeId_extraInitializers), __runInitializers(this, _targetVolumeId_initializers, void 0));
            this.replicationType = (__runInitializers(this, _targetVolumeId_extraInitializers), __runInitializers(this, _replicationType_initializers, void 0));
            this.status = (__runInitializers(this, _replicationType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.direction = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _direction_initializers, void 0));
            this.priority = (__runInitializers(this, _direction_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.rpoMinutes = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _rpoMinutes_initializers, void 0));
            this.rtoMinutes = (__runInitializers(this, _rpoMinutes_extraInitializers), __runInitializers(this, _rtoMinutes_initializers, void 0));
            this.lastSyncAt = (__runInitializers(this, _rtoMinutes_extraInitializers), __runInitializers(this, _lastSyncAt_initializers, void 0));
            this.nextSyncAt = (__runInitializers(this, _lastSyncAt_extraInitializers), __runInitializers(this, _nextSyncAt_initializers, void 0));
            this.syncIntervalMinutes = (__runInitializers(this, _nextSyncAt_extraInitializers), __runInitializers(this, _syncIntervalMinutes_initializers, void 0));
            this.bandwidthLimitMbps = (__runInitializers(this, _syncIntervalMinutes_extraInitializers), __runInitializers(this, _bandwidthLimitMbps_initializers, void 0));
            this.compressionEnabled = (__runInitializers(this, _bandwidthLimitMbps_extraInitializers), __runInitializers(this, _compressionEnabled_initializers, void 0));
            this.encryptionEnabled = (__runInitializers(this, _compressionEnabled_extraInitializers), __runInitializers(this, _encryptionEnabled_initializers, void 0));
            this.errorCount = (__runInitializers(this, _encryptionEnabled_extraInitializers), __runInitializers(this, _errorCount_initializers, void 0));
            this.lastError = (__runInitializers(this, _errorCount_extraInitializers), __runInitializers(this, _lastError_initializers, void 0));
            this.totalBytesSynced = (__runInitializers(this, _lastError_extraInitializers), __runInitializers(this, _totalBytesSynced_initializers, void 0));
            this.tags = (__runInitializers(this, _totalBytesSynced_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.metadata = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdBy = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            // Associations
            this.sourceVolume = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _sourceVolume_initializers, void 0));
            this.targetVolume = (__runInitializers(this, _sourceVolume_extraInitializers), __runInitializers(this, _targetVolume_initializers, void 0));
            __runInitializers(this, _targetVolume_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "SanReplication");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _name_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255))];
        _description_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _sourceVolumeId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => SanVolume), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _targetVolumeId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => SanVolume), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _replicationType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(ReplicationType)))];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(ReplicationStatus.ACTIVE), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(ReplicationStatus)))];
        _direction_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('SOURCE_TO_TARGET'), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('SOURCE_TO_TARGET', 'TARGET_TO_SOURCE', 'BIDIRECTIONAL'))];
        _priority_decorators = [(0, sequelize_typescript_1.Default)(5), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _rpoMinutes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _rtoMinutes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _lastSyncAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _nextSyncAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _syncIntervalMinutes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _bandwidthLimitMbps_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _compressionEnabled_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _encryptionEnabled_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _errorCount_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _lastError_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _totalBytesSynced_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT)];
        _tags_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _updatedBy_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _deletedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _createdAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _updatedAt_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _sourceVolume_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => SanVolume, 'sourceVolumeId')];
        _targetVolume_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => SanVolume, 'targetVolumeId')];
        _static_validateVolumes_decorators = [sequelize_typescript_1.BeforeCreate, sequelize_typescript_1.BeforeUpdate];
        _static_calculateNextSync_decorators = [sequelize_typescript_1.BeforeCreate, sequelize_typescript_1.BeforeUpdate];
        __esDecorate(_classThis, null, _static_validateVolumes_decorators, { kind: "method", name: "validateVolumes", static: true, private: false, access: { has: obj => "validateVolumes" in obj, get: obj => obj.validateVolumes }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(_classThis, null, _static_calculateNextSync_decorators, { kind: "method", name: "calculateNextSync", static: true, private: false, access: { has: obj => "calculateNextSync" in obj, get: obj => obj.calculateNextSync }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _sourceVolumeId_decorators, { kind: "field", name: "sourceVolumeId", static: false, private: false, access: { has: obj => "sourceVolumeId" in obj, get: obj => obj.sourceVolumeId, set: (obj, value) => { obj.sourceVolumeId = value; } }, metadata: _metadata }, _sourceVolumeId_initializers, _sourceVolumeId_extraInitializers);
        __esDecorate(null, null, _targetVolumeId_decorators, { kind: "field", name: "targetVolumeId", static: false, private: false, access: { has: obj => "targetVolumeId" in obj, get: obj => obj.targetVolumeId, set: (obj, value) => { obj.targetVolumeId = value; } }, metadata: _metadata }, _targetVolumeId_initializers, _targetVolumeId_extraInitializers);
        __esDecorate(null, null, _replicationType_decorators, { kind: "field", name: "replicationType", static: false, private: false, access: { has: obj => "replicationType" in obj, get: obj => obj.replicationType, set: (obj, value) => { obj.replicationType = value; } }, metadata: _metadata }, _replicationType_initializers, _replicationType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _direction_decorators, { kind: "field", name: "direction", static: false, private: false, access: { has: obj => "direction" in obj, get: obj => obj.direction, set: (obj, value) => { obj.direction = value; } }, metadata: _metadata }, _direction_initializers, _direction_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _rpoMinutes_decorators, { kind: "field", name: "rpoMinutes", static: false, private: false, access: { has: obj => "rpoMinutes" in obj, get: obj => obj.rpoMinutes, set: (obj, value) => { obj.rpoMinutes = value; } }, metadata: _metadata }, _rpoMinutes_initializers, _rpoMinutes_extraInitializers);
        __esDecorate(null, null, _rtoMinutes_decorators, { kind: "field", name: "rtoMinutes", static: false, private: false, access: { has: obj => "rtoMinutes" in obj, get: obj => obj.rtoMinutes, set: (obj, value) => { obj.rtoMinutes = value; } }, metadata: _metadata }, _rtoMinutes_initializers, _rtoMinutes_extraInitializers);
        __esDecorate(null, null, _lastSyncAt_decorators, { kind: "field", name: "lastSyncAt", static: false, private: false, access: { has: obj => "lastSyncAt" in obj, get: obj => obj.lastSyncAt, set: (obj, value) => { obj.lastSyncAt = value; } }, metadata: _metadata }, _lastSyncAt_initializers, _lastSyncAt_extraInitializers);
        __esDecorate(null, null, _nextSyncAt_decorators, { kind: "field", name: "nextSyncAt", static: false, private: false, access: { has: obj => "nextSyncAt" in obj, get: obj => obj.nextSyncAt, set: (obj, value) => { obj.nextSyncAt = value; } }, metadata: _metadata }, _nextSyncAt_initializers, _nextSyncAt_extraInitializers);
        __esDecorate(null, null, _syncIntervalMinutes_decorators, { kind: "field", name: "syncIntervalMinutes", static: false, private: false, access: { has: obj => "syncIntervalMinutes" in obj, get: obj => obj.syncIntervalMinutes, set: (obj, value) => { obj.syncIntervalMinutes = value; } }, metadata: _metadata }, _syncIntervalMinutes_initializers, _syncIntervalMinutes_extraInitializers);
        __esDecorate(null, null, _bandwidthLimitMbps_decorators, { kind: "field", name: "bandwidthLimitMbps", static: false, private: false, access: { has: obj => "bandwidthLimitMbps" in obj, get: obj => obj.bandwidthLimitMbps, set: (obj, value) => { obj.bandwidthLimitMbps = value; } }, metadata: _metadata }, _bandwidthLimitMbps_initializers, _bandwidthLimitMbps_extraInitializers);
        __esDecorate(null, null, _compressionEnabled_decorators, { kind: "field", name: "compressionEnabled", static: false, private: false, access: { has: obj => "compressionEnabled" in obj, get: obj => obj.compressionEnabled, set: (obj, value) => { obj.compressionEnabled = value; } }, metadata: _metadata }, _compressionEnabled_initializers, _compressionEnabled_extraInitializers);
        __esDecorate(null, null, _encryptionEnabled_decorators, { kind: "field", name: "encryptionEnabled", static: false, private: false, access: { has: obj => "encryptionEnabled" in obj, get: obj => obj.encryptionEnabled, set: (obj, value) => { obj.encryptionEnabled = value; } }, metadata: _metadata }, _encryptionEnabled_initializers, _encryptionEnabled_extraInitializers);
        __esDecorate(null, null, _errorCount_decorators, { kind: "field", name: "errorCount", static: false, private: false, access: { has: obj => "errorCount" in obj, get: obj => obj.errorCount, set: (obj, value) => { obj.errorCount = value; } }, metadata: _metadata }, _errorCount_initializers, _errorCount_extraInitializers);
        __esDecorate(null, null, _lastError_decorators, { kind: "field", name: "lastError", static: false, private: false, access: { has: obj => "lastError" in obj, get: obj => obj.lastError, set: (obj, value) => { obj.lastError = value; } }, metadata: _metadata }, _lastError_initializers, _lastError_extraInitializers);
        __esDecorate(null, null, _totalBytesSynced_decorators, { kind: "field", name: "totalBytesSynced", static: false, private: false, access: { has: obj => "totalBytesSynced" in obj, get: obj => obj.totalBytesSynced, set: (obj, value) => { obj.totalBytesSynced = value; } }, metadata: _metadata }, _totalBytesSynced_initializers, _totalBytesSynced_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _sourceVolume_decorators, { kind: "field", name: "sourceVolume", static: false, private: false, access: { has: obj => "sourceVolume" in obj, get: obj => obj.sourceVolume, set: (obj, value) => { obj.sourceVolume = value; } }, metadata: _metadata }, _sourceVolume_initializers, _sourceVolume_extraInitializers);
        __esDecorate(null, null, _targetVolume_decorators, { kind: "field", name: "targetVolume", static: false, private: false, access: { has: obj => "targetVolume" in obj, get: obj => obj.targetVolume, set: (obj, value) => { obj.targetVolume = value; } }, metadata: _metadata }, _targetVolume_initializers, _targetVolume_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SanReplication = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SanReplication = _classThis;
})();
exports.SanReplication = SanReplication;
// ============================================================================
// MIGRATION HELPER FUNCTIONS
// ============================================================================
/**
 * Function 1: Create SanVolume table
 */
async function createSanVolumeTable(queryInterface, transaction) {
    await queryInterface.createTable('san_volumes', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            primaryKey: true,
            defaultValue: (0, sequelize_1.literal)('gen_random_uuid()'),
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        capacity_gb: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        used_capacity_gb: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(VolumeStatus)),
            allowNull: false,
            defaultValue: VolumeStatus.CREATING,
        },
        storage_pool_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        protocol: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(StorageProtocol)),
            allowNull: false,
        },
        wwn: {
            type: sequelize_1.DataTypes.STRING(32),
            allowNull: true,
            unique: true,
        },
        serial_number: {
            type: sequelize_1.DataTypes.STRING(64),
            allowNull: true,
        },
        thin_provisioned: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        compression_enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        deduplication_enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        encryption_enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        iops_limit: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        throughput_mbps: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        tags: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        created_by: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        updated_by: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: (0, sequelize_1.literal)('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: (0, sequelize_1.literal)('CURRENT_TIMESTAMP'),
        },
        deleted_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, { transaction });
}
/**
 * Function 2: Create SanLun table
 */
async function createSanLunTable(queryInterface, transaction) {
    await queryInterface.createTable('san_luns', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            primaryKey: true,
            defaultValue: (0, sequelize_1.literal)('gen_random_uuid()'),
        },
        lun_number: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        volume_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'san_volumes',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
        },
        capacity_gb: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(LunStatus)),
            allowNull: false,
            defaultValue: LunStatus.INITIALIZING,
        },
        target_id: {
            type: sequelize_1.DataTypes.STRING(64),
            allowNull: true,
        },
        initiator_group: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        masked_to: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
        },
        read_only: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        block_size_bytes: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 512,
        },
        multipath: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        alua: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        iops_read: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        iops_write: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        latency_ms: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: true,
        },
        tags: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        created_by: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        updated_by: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: (0, sequelize_1.literal)('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: (0, sequelize_1.literal)('CURRENT_TIMESTAMP'),
        },
        deleted_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, { transaction });
}
/**
 * Function 3: Create SanSnapshot table
 */
async function createSanSnapshotTable(queryInterface, transaction) {
    await queryInterface.createTable('san_snapshots', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            primaryKey: true,
            defaultValue: (0, sequelize_1.literal)('gen_random_uuid()'),
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        volume_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'san_volumes',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        lun_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'san_luns',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(SnapshotStatus)),
            allowNull: false,
            defaultValue: SnapshotStatus.CREATING,
        },
        size_gb: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        retention_days: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        expires_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        is_automatic: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        schedule_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        consistency_group_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        source_snapshot_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        tags: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        created_by: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        updated_by: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: (0, sequelize_1.literal)('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: (0, sequelize_1.literal)('CURRENT_TIMESTAMP'),
        },
        deleted_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, { transaction });
}
/**
 * Function 4: Create SanReplication table
 */
async function createSanReplicationTable(queryInterface, transaction) {
    await queryInterface.createTable('san_replications', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            primaryKey: true,
            defaultValue: (0, sequelize_1.literal)('gen_random_uuid()'),
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        source_volume_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'san_volumes',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
        },
        target_volume_id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'san_volumes',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
        },
        replication_type: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ReplicationType)),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(ReplicationStatus)),
            allowNull: false,
            defaultValue: ReplicationStatus.ACTIVE,
        },
        direction: {
            type: sequelize_1.DataTypes.ENUM('SOURCE_TO_TARGET', 'TARGET_TO_SOURCE', 'BIDIRECTIONAL'),
            allowNull: false,
            defaultValue: 'SOURCE_TO_TARGET',
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
        },
        rpo_minutes: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        rto_minutes: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        last_sync_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        next_sync_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        sync_interval_minutes: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        bandwidth_limit_mbps: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        compression_enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        encryption_enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        error_count: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        last_error: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        total_bytes_synced: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        tags: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        created_by: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        updated_by: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        created_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: (0, sequelize_1.literal)('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: (0, sequelize_1.literal)('CURRENT_TIMESTAMP'),
        },
        deleted_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, { transaction });
}
/**
 * Function 5: Add column to SAN table
 */
async function addColumnToSanTable(queryInterface, tableName, columnName, columnDefinition, transaction) {
    await queryInterface.addColumn(tableName, columnName, columnDefinition, { transaction });
}
/**
 * Function 6: Modify column in SAN table
 */
async function modifyColumnInSanTable(queryInterface, tableName, columnName, columnDefinition, transaction) {
    await queryInterface.changeColumn(tableName, columnName, columnDefinition, { transaction });
}
/**
 * Function 7: Drop column from SAN table
 */
async function dropColumnFromSanTable(queryInterface, tableName, columnName, transaction) {
    await queryInterface.removeColumn(tableName, columnName, { transaction });
}
/**
 * Function 8: Create index on SAN table
 */
async function createIndexOnSanTable(queryInterface, tableName, indexDefinition, transaction) {
    await queryInterface.addIndex(tableName, indexDefinition.fields, {
        ...indexDefinition,
        transaction,
    });
}
// ============================================================================
// SCHEMA OPERATION FUNCTIONS
// ============================================================================
/**
 * Function 9: Initialize complete SAN schema
 */
async function initializeSanSchema(queryInterface, transaction) {
    await createSanVolumeTable(queryInterface, transaction);
    await createSanLunTable(queryInterface, transaction);
    await createSanSnapshotTable(queryInterface, transaction);
    await createSanReplicationTable(queryInterface, transaction);
    // Create all indexes
    await createSanVolumeIndexes(queryInterface, transaction);
    await createSanLunIndexes(queryInterface, transaction);
    await createSanSnapshotIndexes(queryInterface, transaction);
    await createSanReplicationIndexes(queryInterface, transaction);
}
/**
 * Function 10: Validate SAN schema structure
 */
async function validateSanSchema(queryInterface) {
    const errors = [];
    const requiredTables = ['san_volumes', 'san_luns', 'san_snapshots', 'san_replications'];
    try {
        const tables = await queryInterface.showAllTables();
        for (const table of requiredTables) {
            if (!tables.includes(table)) {
                errors.push(`Missing required table: ${table}`);
            }
        }
        // Validate foreign key constraints
        for (const table of tables.filter((t) => requiredTables.includes(t))) {
            const tableDescription = await queryInterface.describeTable(table);
            if (table === 'san_luns') {
                if (!tableDescription.volume_id) {
                    errors.push('san_luns missing volume_id foreign key');
                }
            }
            if (table === 'san_snapshots') {
                if (!tableDescription.volume_id && !tableDescription.lun_id) {
                    errors.push('san_snapshots missing volume_id or lun_id foreign keys');
                }
            }
            if (table === 'san_replications') {
                if (!tableDescription.source_volume_id || !tableDescription.target_volume_id) {
                    errors.push('san_replications missing volume foreign keys');
                }
            }
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
    catch (error) {
        errors.push(`Schema validation error: ${error.message}`);
        return { valid: false, errors };
    }
}
/**
 * Function 11: Migrate SAN schema to new version
 */
async function migrateSanSchema(queryInterface, fromVersion, toVersion, transaction) {
    // Version-specific migrations
    if (fromVersion === '1.0' && toVersion === '2.0') {
        // Example migration: Add performance metrics columns
        await addColumnToSanTable(queryInterface, 'san_volumes', 'performance_tier', {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        }, transaction);
    }
    // Add more version migrations as needed
}
/**
 * Function 12: Rollback SAN schema to previous version
 */
async function rollbackSanSchema(queryInterface, toVersion, transaction) {
    if (toVersion === '1.0') {
        // Rollback from v2.0 to v1.0
        await dropColumnFromSanTable(queryInterface, 'san_volumes', 'performance_tier', transaction);
    }
}
/**
 * Function 13: Get SAN schema version
 */
async function getSanSchemaVersion(sequelize) {
    try {
        const [results] = await sequelize.query(`SELECT version FROM schema_versions WHERE schema_name = 'san' ORDER BY applied_at DESC LIMIT 1`);
        return results.length > 0 ? results[0].version : '1.0';
    }
    catch (error) {
        return '1.0';
    }
}
/**
 * Function 14: Compare two SAN schemas
 */
async function compareSanSchemas(queryInterface1, queryInterface2) {
    const differences = [];
    const tables = ['san_volumes', 'san_luns', 'san_snapshots', 'san_replications'];
    for (const table of tables) {
        try {
            const desc1 = await queryInterface1.describeTable(table);
            const desc2 = await queryInterface2.describeTable(table);
            const columns1 = Object.keys(desc1);
            const columns2 = Object.keys(desc2);
            const missingInSchema2 = columns1.filter((c) => !columns2.includes(c));
            const missingInSchema1 = columns2.filter((c) => !columns1.includes(c));
            if (missingInSchema2.length > 0) {
                differences.push(`Table ${table}: Columns missing in schema 2: ${missingInSchema2.join(', ')}`);
            }
            if (missingInSchema1.length > 0) {
                differences.push(`Table ${table}: Columns missing in schema 1: ${missingInSchema1.join(', ')}`);
            }
        }
        catch (error) {
            differences.push(`Error comparing table ${table}: ${error.message}`);
        }
    }
    return {
        differences,
        identical: differences.length === 0,
    };
}
// ============================================================================
// SEEDING & VALIDATION FUNCTIONS
// ============================================================================
/**
 * Function 15: Seed SAN volumes
 */
async function seedSanVolumes(sequelize, count = 10) {
    const volumes = [];
    for (let i = 0; i < count; i++) {
        const volume = await SanVolume.create({
            name: `volume-${i + 1}`,
            description: `Test SAN volume ${i + 1}`,
            capacityGb: 100 + i * 50,
            usedCapacityGb: 10 + i * 5,
            status: VolumeStatus.AVAILABLE,
            protocol: i % 2 === 0 ? StorageProtocol.ISCSI : StorageProtocol.FC,
            thinProvisioned: i % 3 === 0,
            compressionEnabled: i % 2 === 0,
            deduplicationEnabled: i % 4 === 0,
            encryptionEnabled: i % 5 === 0,
            tags: { environment: 'test', tier: i % 2 === 0 ? 'premium' : 'standard' },
        });
        volumes.push(volume);
    }
    return volumes;
}
/**
 * Function 16: Seed SAN LUNs
 */
async function seedSanLuns(sequelize, volumeIds, lunsPerVolume = 3) {
    const luns = [];
    for (const volumeId of volumeIds) {
        for (let i = 0; i < lunsPerVolume; i++) {
            const lun = await SanLun.create({
                lunNumber: i,
                name: `lun-${volumeId.substring(0, 8)}-${i}`,
                description: `Test LUN ${i} for volume ${volumeId}`,
                volumeId,
                capacityGb: 20 + i * 10,
                status: LunStatus.ONLINE,
                readOnly: i === 0,
                blockSizeBytes: 4096,
                multipath: true,
                alua: i % 2 === 0,
                tags: { type: 'test', lun_number: String(i) },
            });
            luns.push(lun);
        }
    }
    return luns;
}
/**
 * Function 17: Validate SAN volume data
 */
function validateSanVolumeData(data) {
    const errors = [];
    if (!data.name || data.name.trim().length === 0) {
        errors.push('Volume name is required');
    }
    if (!data.capacityGb || data.capacityGb <= 0) {
        errors.push('Capacity must be greater than 0');
    }
    if (data.usedCapacityGb && data.capacityGb && data.usedCapacityGb > data.capacityGb) {
        errors.push('Used capacity cannot exceed total capacity');
    }
    if (!data.protocol || !Object.values(StorageProtocol).includes(data.protocol)) {
        errors.push('Invalid storage protocol');
    }
    if (!data.status || !Object.values(VolumeStatus).includes(data.status)) {
        errors.push('Invalid volume status');
    }
    if (data.iopsLimit && data.iopsLimit < 0) {
        errors.push('IOPS limit cannot be negative');
    }
    if (data.throughputMbps && data.throughputMbps < 0) {
        errors.push('Throughput limit cannot be negative');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Function 18: Validate SAN replication configuration
 */
function validateSanReplicationConfig(data) {
    const errors = [];
    if (!data.name || data.name.trim().length === 0) {
        errors.push('Replication name is required');
    }
    if (!data.sourceVolumeId) {
        errors.push('Source volume ID is required');
    }
    if (!data.targetVolumeId) {
        errors.push('Target volume ID is required');
    }
    if (data.sourceVolumeId === data.targetVolumeId) {
        errors.push('Source and target volumes must be different');
    }
    if (!data.replicationType || !Object.values(ReplicationType).includes(data.replicationType)) {
        errors.push('Invalid replication type');
    }
    if (data.priority !== undefined && (data.priority < 1 || data.priority > 10)) {
        errors.push('Priority must be between 1 and 10');
    }
    if (data.rpoMinutes !== undefined && data.rpoMinutes < 0) {
        errors.push('RPO cannot be negative');
    }
    if (data.rtoMinutes !== undefined && data.rtoMinutes < 0) {
        errors.push('RTO cannot be negative');
    }
    if (data.replicationType === ReplicationType.ASYNCHRONOUS &&
        (!data.syncIntervalMinutes || data.syncIntervalMinutes <= 0)) {
        errors.push('Sync interval is required for asynchronous replication');
    }
    if (data.bandwidthLimitMbps !== undefined && data.bandwidthLimitMbps < 0) {
        errors.push('Bandwidth limit cannot be negative');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
// ============================================================================
// INDEXING STRATEGY FUNCTIONS
// ============================================================================
/**
 * Function 19: Create SAN volume indexes
 */
async function createSanVolumeIndexes(queryInterface, transaction) {
    const indexes = [
        {
            name: 'idx_san_volumes_status',
            fields: ['status'],
        },
        {
            name: 'idx_san_volumes_wwn',
            fields: ['wwn'],
            unique: true,
            where: { wwn: { [sequelize_1.Op.ne]: null } },
        },
        {
            name: 'idx_san_volumes_pool_status',
            fields: ['storage_pool_id', 'status'],
        },
        {
            name: 'idx_san_volumes_created_at',
            fields: ['created_at'],
        },
        {
            name: 'idx_san_volumes_protocol',
            fields: ['protocol'],
        },
        {
            name: 'idx_san_volumes_capacity',
            fields: ['capacity_gb'],
        },
    ];
    for (const index of indexes) {
        try {
            await queryInterface.addIndex('san_volumes', index.fields, {
                ...index,
                transaction,
            });
        }
        catch (error) {
            console.warn(`Index ${index.name} may already exist: ${error.message}`);
        }
    }
}
/**
 * Function 20: Create SAN LUN indexes
 */
async function createSanLunIndexes(queryInterface, transaction) {
    const indexes = [
        {
            name: 'idx_san_luns_volume_id',
            fields: ['volume_id'],
        },
        {
            name: 'idx_san_luns_status',
            fields: ['status'],
        },
        {
            name: 'idx_san_luns_volume_lun_number',
            fields: ['volume_id', 'lun_number'],
            unique: true,
        },
        {
            name: 'idx_san_luns_created_at',
            fields: ['created_at'],
        },
        {
            name: 'idx_san_luns_target_id',
            fields: ['target_id'],
        },
    ];
    for (const index of indexes) {
        try {
            await queryInterface.addIndex('san_luns', index.fields, {
                ...index,
                transaction,
            });
        }
        catch (error) {
            console.warn(`Index ${index.name} may already exist: ${error.message}`);
        }
    }
}
/**
 * Function 21: Create SAN snapshot indexes
 */
async function createSanSnapshotIndexes(queryInterface, transaction) {
    const indexes = [
        {
            name: 'idx_san_snapshots_volume_id_created_at',
            fields: ['volume_id', 'created_at'],
        },
        {
            name: 'idx_san_snapshots_lun_id_created_at',
            fields: ['lun_id', 'created_at'],
        },
        {
            name: 'idx_san_snapshots_status',
            fields: ['status'],
        },
        {
            name: 'idx_san_snapshots_expires_at',
            fields: ['expires_at'],
            where: { expires_at: { [sequelize_1.Op.ne]: null } },
        },
        {
            name: 'idx_san_snapshots_schedule_id',
            fields: ['schedule_id'],
        },
    ];
    for (const index of indexes) {
        try {
            await queryInterface.addIndex('san_snapshots', index.fields, {
                ...index,
                transaction,
            });
        }
        catch (error) {
            console.warn(`Index ${index.name} may already exist: ${error.message}`);
        }
    }
}
/**
 * Function 22: Create SAN replication indexes
 */
async function createSanReplicationIndexes(queryInterface, transaction) {
    const indexes = [
        {
            name: 'idx_san_replications_source_volume_id',
            fields: ['source_volume_id'],
        },
        {
            name: 'idx_san_replications_target_volume_id',
            fields: ['target_volume_id'],
        },
        {
            name: 'idx_san_replications_status_last_sync',
            fields: ['status', 'last_sync_at'],
        },
        {
            name: 'idx_san_replications_next_sync_at',
            fields: ['next_sync_at'],
            where: { next_sync_at: { [sequelize_1.Op.ne]: null } },
        },
    ];
    for (const index of indexes) {
        try {
            await queryInterface.addIndex('san_replications', index.fields, {
                ...index,
                transaction,
            });
        }
        catch (error) {
            console.warn(`Index ${index.name} may already exist: ${error.message}`);
        }
    }
}
// ============================================================================
// ADVANCED QUERY FUNCTIONS
// ============================================================================
/**
 * Function 23: Get volume capacity statistics
 */
async function getVolumeCapacityStats(sequelize) {
    const [results] = await sequelize.query(`
    SELECT
      COALESCE(SUM(capacity_gb), 0) as total_capacity_gb,
      COALESCE(SUM(used_capacity_gb), 0) as used_capacity_gb,
      COALESCE(SUM(capacity_gb - used_capacity_gb), 0) as available_capacity_gb,
      CASE
        WHEN SUM(capacity_gb) > 0 THEN (SUM(used_capacity_gb) / SUM(capacity_gb) * 100)
        ELSE 0
      END as utilization_percent
    FROM san_volumes
    WHERE deleted_at IS NULL
      AND status != 'DELETING'
  `);
    return results[0];
}
/**
 * Function 24: Get LUN performance metrics
 */
async function getLunPerformanceMetrics(lunId, sequelize) {
    const [results] = await sequelize.query(`
    SELECT
      id as lun_id,
      COALESCE(latency_ms, 0) as avg_latency_ms,
      COALESCE(iops_read, 0) + COALESCE(iops_write, 0) as total_iops,
      CASE
        WHEN COALESCE(iops_write, 0) > 0
        THEN COALESCE(iops_read, 0)::FLOAT / iops_write
        ELSE 0
      END as read_write_ratio
    FROM san_luns
    WHERE id = :lunId
      AND deleted_at IS NULL
  `, {
        replacements: { lunId },
    });
    return results.length > 0 ? results[0] : null;
}
/**
 * Function 25: Get snapshot retention compliance
 */
async function getSnapshotRetentionCompliance(sequelize) {
    const [results] = await sequelize.query(`
    SELECT
      COUNT(*) as total_snapshots,
      COUNT(CASE WHEN expires_at < NOW() THEN 1 END) as expired_snapshots,
      COUNT(CASE WHEN expires_at BETWEEN NOW() AND NOW() + INTERVAL '7 days' THEN 1 END) as expiring_soon_snapshots,
      CASE
        WHEN COUNT(*) > 0
        THEN ((COUNT(*) - COUNT(CASE WHEN expires_at < NOW() THEN 1 END))::FLOAT / COUNT(*) * 100)
        ELSE 100
      END as compliance_percent
    FROM san_snapshots
    WHERE deleted_at IS NULL
      AND expires_at IS NOT NULL
  `);
    return results[0];
}
/**
 * Function 26: Get replication health status
 */
async function getReplicationHealthStatus(sequelize) {
    const [results] = await sequelize.query(`
    SELECT
      COUNT(*) as total_replications,
      COUNT(CASE WHEN status = 'ACTIVE' AND error_count = 0 THEN 1 END) as healthy_replications,
      COUNT(CASE WHEN status != 'ACTIVE' OR error_count > 0 THEN 1 END) as unhealthy_replications,
      COALESCE(AVG(EXTRACT(EPOCH FROM (NOW() - last_sync_at)) / 60), 0) as avg_sync_lag_minutes
    FROM san_replications
    WHERE deleted_at IS NULL
  `);
    return results[0];
}
/**
 * Function 27: Find volumes by utilization threshold
 */
async function findVolumesByUtilization(minUtilizationPercent, maxUtilizationPercent = 100) {
    return await SanVolume.findAll({
        where: (0, sequelize_1.literal)(`(used_capacity_gb / capacity_gb * 100) BETWEEN ${minUtilizationPercent} AND ${maxUtilizationPercent}`),
        order: [['used_capacity_gb', 'DESC']],
    });
}
/**
 * Function 28: Find LUNs with high latency
 */
async function findLunsWithHighLatency(latencyThresholdMs) {
    return await SanLun.findAll({
        where: {
            latencyMs: {
                [sequelize_1.Op.gte]: latencyThresholdMs,
            },
            status: LunStatus.ONLINE,
        },
        include: [
            {
                model: SanVolume,
                as: 'volume',
            },
        ],
        order: [['latencyMs', 'DESC']],
    });
}
/**
 * Function 29: Find expired snapshots
 */
async function findExpiredSnapshots() {
    return await SanSnapshot.findAll({
        where: {
            expiresAt: {
                [sequelize_1.Op.lt]: new Date(),
            },
            status: SnapshotStatus.AVAILABLE,
        },
        include: [
            {
                model: SanVolume,
                as: 'volume',
            },
            {
                model: SanLun,
                as: 'lun',
            },
        ],
        order: [['expiresAt', 'ASC']],
    });
}
/**
 * Function 30: Find stale replications
 */
async function findStaleReplications(staleLagMinutes) {
    const staleThreshold = new Date(Date.now() - staleLagMinutes * 60 * 1000);
    return await SanReplication.findAll({
        where: {
            status: ReplicationStatus.ACTIVE,
            lastSyncAt: {
                [sequelize_1.Op.lt]: staleThreshold,
            },
        },
        include: [
            {
                model: SanVolume,
                as: 'sourceVolume',
            },
            {
                model: SanVolume,
                as: 'targetVolume',
            },
        ],
        order: [['lastSyncAt', 'ASC']],
    });
}
// ============================================================================
// BULK OPERATION FUNCTIONS
// ============================================================================
/**
 * Function 31: Bulk create volumes
 */
async function bulkCreateVolumes(volumeData, transaction) {
    return await SanVolume.bulkCreate(volumeData, {
        transaction,
        validate: true,
        returning: true,
    });
}
/**
 * Function 32: Bulk update volume status
 */
async function bulkUpdateVolumeStatus(volumeIds, status, transaction) {
    const [affectedCount] = await SanVolume.update({ status }, {
        where: {
            id: {
                [sequelize_1.Op.in]: volumeIds,
            },
        },
        transaction,
    });
    return affectedCount;
}
/**
 * Function 33: Bulk delete expired snapshots
 */
async function bulkDeleteExpiredSnapshots(transaction) {
    const expiredSnapshots = await findExpiredSnapshots();
    const snapshotIds = expiredSnapshots.map((s) => s.id);
    if (snapshotIds.length === 0) {
        return 0;
    }
    return await SanSnapshot.destroy({
        where: {
            id: {
                [sequelize_1.Op.in]: snapshotIds,
            },
        },
        transaction,
    });
}
/**
 * Function 34: Bulk create snapshots for volumes
 */
async function bulkCreateSnapshotsForVolumes(volumeIds, retentionDays, transaction) {
    const volumes = await SanVolume.findAll({
        where: {
            id: {
                [sequelize_1.Op.in]: volumeIds,
            },
        },
    });
    const snapshotData = volumes.map((volume) => ({
        name: `${volume.name}-snapshot-${Date.now()}`,
        description: `Automated snapshot for ${volume.name}`,
        volumeId: volume.id,
        status: SnapshotStatus.CREATING,
        sizeGb: volume.usedCapacityGb,
        retentionDays,
        isAutomatic: true,
    }));
    return await SanSnapshot.bulkCreate(snapshotData, {
        transaction,
        validate: true,
        returning: true,
    });
}
// ============================================================================
// MAINTENANCE & CLEANUP FUNCTIONS
// ============================================================================
/**
 * Function 35: Cleanup deleted resources
 */
async function cleanupDeletedResources(olderThanDays, transaction) {
    const deletionThreshold = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
    const volumesDeleted = await SanVolume.destroy({
        where: {
            deletedAt: {
                [sequelize_1.Op.lt]: deletionThreshold,
            },
        },
        force: true,
        transaction,
    });
    const lunsDeleted = await SanLun.destroy({
        where: {
            deletedAt: {
                [sequelize_1.Op.lt]: deletionThreshold,
            },
        },
        force: true,
        transaction,
    });
    const snapshotsDeleted = await SanSnapshot.destroy({
        where: {
            deletedAt: {
                [sequelize_1.Op.lt]: deletionThreshold,
            },
        },
        force: true,
        transaction,
    });
    const replicationsDeleted = await SanReplication.destroy({
        where: {
            deletedAt: {
                [sequelize_1.Op.lt]: deletionThreshold,
            },
        },
        force: true,
        transaction,
    });
    return {
        volumesDeleted,
        lunsDeleted,
        snapshotsDeleted,
        replicationsDeleted,
    };
}
/**
 * Function 36: Optimize SAN database tables
 */
async function optimizeSanDatabaseTables(sequelize) {
    const tables = ['san_volumes', 'san_luns', 'san_snapshots', 'san_replications'];
    const tablesOptimized = [];
    const statistics = {};
    for (const table of tables) {
        try {
            // Run VACUUM ANALYZE for PostgreSQL
            await sequelize.query(`VACUUM ANALYZE ${table}`);
            // Gather table statistics
            const [stats] = await sequelize.query(`
        SELECT
          '${table}' as table_name,
          pg_size_pretty(pg_total_relation_size('${table}')) as total_size,
          pg_size_pretty(pg_relation_size('${table}')) as table_size,
          pg_size_pretty(pg_indexes_size('${table}')) as indexes_size,
          (SELECT COUNT(*) FROM ${table}) as row_count
      `);
            tablesOptimized.push(table);
            statistics[table] = stats[0];
        }
        catch (error) {
            console.error(`Error optimizing table ${table}:`, error.message);
        }
    }
    return {
        tablesOptimized,
        statistics,
    };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.SanModels = {
    SanVolume,
    SanLun,
    SanSnapshot,
    SanReplication,
};
exports.SanMigrationHelpers = {
    createSanVolumeTable,
    createSanLunTable,
    createSanSnapshotTable,
    createSanReplicationTable,
    addColumnToSanTable,
    modifyColumnInSanTable,
    dropColumnFromSanTable,
    createIndexOnSanTable,
};
exports.SanSchemaOperations = {
    initializeSanSchema,
    validateSanSchema,
    migrateSanSchema,
    rollbackSanSchema,
    getSanSchemaVersion,
    compareSanSchemas,
};
exports.SanSeedingValidation = {
    seedSanVolumes,
    seedSanLuns,
    validateSanVolumeData,
    validateSanReplicationConfig,
};
exports.SanIndexing = {
    createSanVolumeIndexes,
    createSanLunIndexes,
    createSanSnapshotIndexes,
    createSanReplicationIndexes,
};
exports.SanQueryFunctions = {
    getVolumeCapacityStats,
    getLunPerformanceMetrics,
    getSnapshotRetentionCompliance,
    getReplicationHealthStatus,
    findVolumesByUtilization,
    findLunsWithHighLatency,
    findExpiredSnapshots,
    findStaleReplications,
};
exports.SanBulkOperations = {
    bulkCreateVolumes,
    bulkUpdateVolumeStatus,
    bulkDeleteExpiredSnapshots,
    bulkCreateSnapshotsForVolumes,
};
exports.SanMaintenance = {
    cleanupDeletedResources,
    optimizeSanDatabaseTables,
};
//# sourceMappingURL=san-database-schema-kit.js.map