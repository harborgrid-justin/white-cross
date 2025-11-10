"use strict";
/**
 * LOC: S1A2N3C4T5
 * File: /reuse/san/san-api-controllers-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/swagger (v11.2.1)
 *   - @nestjs/platform-express (v11.1.8)
 *   - class-transformer (v0.5.1)
 *   - class-validator (v0.14.2)
 *
 * DOWNSTREAM (imported by):
 *   - SAN Volume Controllers
 *   - SAN LUN Controllers
 *   - SAN Snapshot Controllers
 *   - SAN Replication Controllers
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
exports.StorageArrayId = exports.SanAuditContext = exports.CapacityReportDto = exports.PerformanceMetricsDto = exports.PaginatedResponseDto = exports.ReplicationResponseDto = exports.SnapshotResponseDto = exports.LunResponseDto = exports.VolumeResponseDto = exports.PerformanceQueryDto = exports.VolumeQueryDto = exports.CreateReplicationDto = exports.CreateSnapshotDto = exports.UpdateLunDto = exports.CreateLunDto = exports.UpdateVolumeDto = exports.CreateVolumeDto = exports.SanAuditMetadata = exports.RaidLevel = exports.StorageTier = exports.ReplicationMode = exports.ReplicationStatus = exports.SnapshotStatus = exports.LunProtocol = exports.VolumeStatus = exports.VolumeType = void 0;
exports.SanApiOperation = SanApiOperation;
exports.VolumeEndpoint = VolumeEndpoint;
exports.LunEndpoint = LunEndpoint;
exports.SnapshotEndpoint = SnapshotEndpoint;
exports.ReplicationEndpoint = ReplicationEndpoint;
exports.createSanPaginatedResponse = createSanPaginatedResponse;
exports.validateVolumeCreation = validateVolumeCreation;
exports.validateVolumeExpansion = validateVolumeExpansion;
exports.validateLunCreation = validateLunCreation;
exports.validateLunMapping = validateLunMapping;
exports.validateSnapshotCreation = validateSnapshotCreation;
exports.calculateSnapshotExpiration = calculateSnapshotExpiration;
exports.validateReplicationConfig = validateReplicationConfig;
exports.calculateNextSyncTime = calculateNextSyncTime;
exports.validateTierMigration = validateTierMigration;
exports.calculateVolumeUtilization = calculateVolumeUtilization;
exports.determineVolumeHealth = determineVolumeHealth;
exports.validatePerformanceQuery = validatePerformanceQuery;
exports.calculateAverageMetrics = calculateAverageMetrics;
exports.generateCapacityForecast = generateCapacityForecast;
exports.validateRaidForVolumeSize = validateRaidForVolumeSize;
exports.calculateRaidUsableCapacity = calculateRaidUsableCapacity;
exports.validateSnapshotRestore = validateSnapshotRestore;
exports.calculateSnapshotSavings = calculateSnapshotSavings;
exports.validateVolumeDeletion = validateVolumeDeletion;
exports.createSanAuditLog = createSanAuditLog;
exports.validateStorageArrayConnection = validateStorageArrayConnection;
exports.calculateReplicationBandwidth = calculateReplicationBandwidth;
exports.validateThinProvisioningRatio = validateThinProvisioningRatio;
exports.generateEfficiencyReport = generateEfficiencyReport;
exports.validateQoSSettings = validateQoSSettings;
exports.validateVolumeClone = validateVolumeClone;
exports.calculateSnapshotSchedule = calculateSnapshotSchedule;
exports.validateMultipathConfig = validateMultipathConfig;
exports.calculateDRReadiness = calculateDRReadiness;
exports.validateMigrationPlan = validateMigrationPlan;
exports.calculateStorageTCO = calculateStorageTCO;
exports.validateFirmwareVersion = validateFirmwareVersion;
exports.generateHealthCheckReport = generateHealthCheckReport;
exports.sanitizeVolumeName = sanitizeVolumeName;
/**
 * File: /reuse/san/san-api-controllers-kit.ts
 * Locator: WC-SAN-CTRL-001
 * Purpose: SAN REST API Controllers Kit - Comprehensive controller utilities for Storage Area Network APIs
 *
 * Upstream: @nestjs/common, @nestjs/swagger, @nestjs/platform-express, class-transformer, class-validator
 * Downstream: All SAN controllers, volume management, LUN management, snapshot management, replication APIs
 * Dependencies: NestJS v11.x, Node 18+, TypeScript 5.x, Express
 * Exports: 35 SAN controller functions for volumes, LUNs, snapshots, replication, monitoring
 *
 * LLM Context: Production-grade SAN REST API controller toolkit for White Cross healthcare platform.
 * Provides comprehensive utilities for SAN volume management, LUN provisioning, snapshot operations,
 * replication management, performance monitoring, capacity planning, and storage analytics.
 * HIPAA-compliant with comprehensive audit logging, PHI protection, and healthcare-specific storage validation.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * SAN Volume types
 */
var VolumeType;
(function (VolumeType) {
    VolumeType["THICK"] = "THICK";
    VolumeType["THIN"] = "THIN";
    VolumeType["DEDUP"] = "DEDUP";
    VolumeType["COMPRESSED"] = "COMPRESSED";
})(VolumeType || (exports.VolumeType = VolumeType = {}));
/**
 * Volume status enumeration
 */
var VolumeStatus;
(function (VolumeStatus) {
    VolumeStatus["ONLINE"] = "ONLINE";
    VolumeStatus["OFFLINE"] = "OFFLINE";
    VolumeStatus["DEGRADED"] = "DEGRADED";
    VolumeStatus["FAILED"] = "FAILED";
    VolumeStatus["CREATING"] = "CREATING";
    VolumeStatus["DELETING"] = "DELETING";
    VolumeStatus["MIGRATING"] = "MIGRATING";
})(VolumeStatus || (exports.VolumeStatus = VolumeStatus = {}));
/**
 * LUN protocol types
 */
var LunProtocol;
(function (LunProtocol) {
    LunProtocol["ISCSI"] = "ISCSI";
    LunProtocol["FC"] = "FC";
    LunProtocol["FCOE"] = "FCOE";
    LunProtocol["NVME"] = "NVME";
})(LunProtocol || (exports.LunProtocol = LunProtocol = {}));
/**
 * Snapshot status
 */
var SnapshotStatus;
(function (SnapshotStatus) {
    SnapshotStatus["ACTIVE"] = "ACTIVE";
    SnapshotStatus["CREATING"] = "CREATING";
    SnapshotStatus["DELETING"] = "DELETING";
    SnapshotStatus["FAILED"] = "FAILED";
})(SnapshotStatus || (exports.SnapshotStatus = SnapshotStatus = {}));
/**
 * Replication status
 */
var ReplicationStatus;
(function (ReplicationStatus) {
    ReplicationStatus["SYNCING"] = "SYNCING";
    ReplicationStatus["SYNCHRONIZED"] = "SYNCHRONIZED";
    ReplicationStatus["PAUSED"] = "PAUSED";
    ReplicationStatus["FAILED"] = "FAILED";
    ReplicationStatus["INITIALIZING"] = "INITIALIZING";
})(ReplicationStatus || (exports.ReplicationStatus = ReplicationStatus = {}));
/**
 * Replication mode
 */
var ReplicationMode;
(function (ReplicationMode) {
    ReplicationMode["SYNCHRONOUS"] = "SYNCHRONOUS";
    ReplicationMode["ASYNCHRONOUS"] = "ASYNCHRONOUS";
    ReplicationMode["SEMI_SYNCHRONOUS"] = "SEMI_SYNCHRONOUS";
})(ReplicationMode || (exports.ReplicationMode = ReplicationMode = {}));
/**
 * Storage tier for tiered storage
 */
var StorageTier;
(function (StorageTier) {
    StorageTier["TIER_0"] = "TIER_0";
    StorageTier["TIER_1"] = "TIER_1";
    StorageTier["TIER_2"] = "TIER_2";
    StorageTier["TIER_3"] = "TIER_3";
})(StorageTier || (exports.StorageTier = StorageTier = {}));
/**
 * RAID level configuration
 */
var RaidLevel;
(function (RaidLevel) {
    RaidLevel["RAID_0"] = "RAID_0";
    RaidLevel["RAID_1"] = "RAID_1";
    RaidLevel["RAID_5"] = "RAID_5";
    RaidLevel["RAID_6"] = "RAID_6";
    RaidLevel["RAID_10"] = "RAID_10";
    RaidLevel["RAID_50"] = "RAID_50";
})(RaidLevel || (exports.RaidLevel = RaidLevel = {}));
// ============================================================================
// REQUEST DTOs
// ============================================================================
/**
 * Base SAN audit metadata
 */
let SanAuditMetadata = (() => {
    var _a;
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _organizationId_decorators;
    let _organizationId_initializers = [];
    let _organizationId_extraInitializers = [];
    let _requestId_decorators;
    let _requestId_initializers = [];
    let _requestId_extraInitializers = [];
    let _ipAddress_decorators;
    let _ipAddress_initializers = [];
    let _ipAddress_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    return _a = class SanAuditMetadata {
            constructor() {
                this.userId = __runInitializers(this, _userId_initializers, void 0);
                this.organizationId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _organizationId_initializers, void 0));
                this.requestId = (__runInitializers(this, _organizationId_extraInitializers), __runInitializers(this, _requestId_initializers, void 0));
                this.ipAddress = (__runInitializers(this, _requestId_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
                this.reason = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userId_decorators = [ApiProperty({ description: 'User ID performing the operation' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _organizationId_decorators = [ApiProperty({ description: 'Organization ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _requestId_decorators = [ApiProperty({ description: 'Request ID for tracking' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _ipAddress_decorators = [ApiProperty({ description: 'Client IP address' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _reason_decorators = [ApiProperty({ description: 'Reason for operation' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(500)];
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _organizationId_decorators, { kind: "field", name: "organizationId", static: false, private: false, access: { has: obj => "organizationId" in obj, get: obj => obj.organizationId, set: (obj, value) => { obj.organizationId = value; } }, metadata: _metadata }, _organizationId_initializers, _organizationId_extraInitializers);
            __esDecorate(null, null, _requestId_decorators, { kind: "field", name: "requestId", static: false, private: false, access: { has: obj => "requestId" in obj, get: obj => obj.requestId, set: (obj, value) => { obj.requestId = value; } }, metadata: _metadata }, _requestId_initializers, _requestId_extraInitializers);
            __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: obj => "ipAddress" in obj, get: obj => obj.ipAddress, set: (obj, value) => { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SanAuditMetadata = SanAuditMetadata;
/**
 * Create Volume DTO
 */
let CreateVolumeDto = (() => {
    var _a;
    let _classSuper = SanAuditMetadata;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _sizeGB_decorators;
    let _sizeGB_initializers = [];
    let _sizeGB_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _tier_decorators;
    let _tier_initializers = [];
    let _tier_extraInitializers = [];
    let _raidLevel_decorators;
    let _raidLevel_initializers = [];
    let _raidLevel_extraInitializers = [];
    let _encrypted_decorators;
    let _encrypted_initializers = [];
    let _encrypted_extraInitializers = [];
    let _compressed_decorators;
    let _compressed_initializers = [];
    let _compressed_extraInitializers = [];
    let _deduplication_decorators;
    let _deduplication_initializers = [];
    let _deduplication_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    return _a = class CreateVolumeDto extends _classSuper {
            constructor() {
                super(...arguments);
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.sizeGB = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _sizeGB_initializers, void 0));
                this.type = (__runInitializers(this, _sizeGB_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.tier = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _tier_initializers, void 0));
                this.raidLevel = (__runInitializers(this, _tier_extraInitializers), __runInitializers(this, _raidLevel_initializers, void 0));
                this.encrypted = (__runInitializers(this, _raidLevel_extraInitializers), __runInitializers(this, _encrypted_initializers, void 0));
                this.compressed = (__runInitializers(this, _encrypted_extraInitializers), __runInitializers(this, _compressed_initializers, void 0));
                this.deduplication = (__runInitializers(this, _compressed_extraInitializers), __runInitializers(this, _deduplication_initializers, void 0));
                this.description = (__runInitializers(this, _deduplication_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.tags = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                __runInitializers(this, _tags_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _name_decorators = [ApiProperty({ description: 'Volume name', example: 'patient-records-vol-01' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(64)];
            _sizeGB_decorators = [ApiProperty({ description: 'Volume size in GB', example: 500 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100000)];
            _type_decorators = [ApiProperty({ description: 'Volume type', enum: VolumeType }), (0, class_validator_1.IsEnum)(VolumeType)];
            _tier_decorators = [ApiProperty({ description: 'Storage tier', enum: StorageTier, required: false }), (0, class_validator_1.IsEnum)(StorageTier), (0, class_validator_1.IsOptional)()];
            _raidLevel_decorators = [ApiProperty({ description: 'RAID level', enum: RaidLevel, required: false }), (0, class_validator_1.IsEnum)(RaidLevel), (0, class_validator_1.IsOptional)()];
            _encrypted_decorators = [ApiProperty({ description: 'Enable encryption', default: true }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _compressed_decorators = [ApiProperty({ description: 'Enable compression', default: false }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _deduplication_decorators = [ApiProperty({ description: 'Enable deduplication', default: false }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _description_decorators = [ApiProperty({ description: 'Volume description', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(500)];
            _tags_decorators = [ApiProperty({ description: 'Tags for classification', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _sizeGB_decorators, { kind: "field", name: "sizeGB", static: false, private: false, access: { has: obj => "sizeGB" in obj, get: obj => obj.sizeGB, set: (obj, value) => { obj.sizeGB = value; } }, metadata: _metadata }, _sizeGB_initializers, _sizeGB_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _tier_decorators, { kind: "field", name: "tier", static: false, private: false, access: { has: obj => "tier" in obj, get: obj => obj.tier, set: (obj, value) => { obj.tier = value; } }, metadata: _metadata }, _tier_initializers, _tier_extraInitializers);
            __esDecorate(null, null, _raidLevel_decorators, { kind: "field", name: "raidLevel", static: false, private: false, access: { has: obj => "raidLevel" in obj, get: obj => obj.raidLevel, set: (obj, value) => { obj.raidLevel = value; } }, metadata: _metadata }, _raidLevel_initializers, _raidLevel_extraInitializers);
            __esDecorate(null, null, _encrypted_decorators, { kind: "field", name: "encrypted", static: false, private: false, access: { has: obj => "encrypted" in obj, get: obj => obj.encrypted, set: (obj, value) => { obj.encrypted = value; } }, metadata: _metadata }, _encrypted_initializers, _encrypted_extraInitializers);
            __esDecorate(null, null, _compressed_decorators, { kind: "field", name: "compressed", static: false, private: false, access: { has: obj => "compressed" in obj, get: obj => obj.compressed, set: (obj, value) => { obj.compressed = value; } }, metadata: _metadata }, _compressed_initializers, _compressed_extraInitializers);
            __esDecorate(null, null, _deduplication_decorators, { kind: "field", name: "deduplication", static: false, private: false, access: { has: obj => "deduplication" in obj, get: obj => obj.deduplication, set: (obj, value) => { obj.deduplication = value; } }, metadata: _metadata }, _deduplication_initializers, _deduplication_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateVolumeDto = CreateVolumeDto;
/**
 * Update Volume DTO
 */
let UpdateVolumeDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _sizeGB_decorators;
    let _sizeGB_initializers = [];
    let _sizeGB_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _tier_decorators;
    let _tier_initializers = [];
    let _tier_extraInitializers = [];
    return _a = class UpdateVolumeDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.sizeGB = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _sizeGB_initializers, void 0));
                this.description = (__runInitializers(this, _sizeGB_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.tags = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.tier = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _tier_initializers, void 0));
                __runInitializers(this, _tier_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [ApiProperty({ description: 'New volume name', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(64)];
            _sizeGB_decorators = [ApiProperty({ description: 'New size in GB (expand only)', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(1)];
            _description_decorators = [ApiProperty({ description: 'Update description', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(500)];
            _tags_decorators = [ApiProperty({ description: 'Update tags', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            _tier_decorators = [ApiProperty({ description: 'Change storage tier', enum: StorageTier, required: false }), (0, class_validator_1.IsEnum)(StorageTier), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _sizeGB_decorators, { kind: "field", name: "sizeGB", static: false, private: false, access: { has: obj => "sizeGB" in obj, get: obj => obj.sizeGB, set: (obj, value) => { obj.sizeGB = value; } }, metadata: _metadata }, _sizeGB_initializers, _sizeGB_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _tier_decorators, { kind: "field", name: "tier", static: false, private: false, access: { has: obj => "tier" in obj, get: obj => obj.tier, set: (obj, value) => { obj.tier = value; } }, metadata: _metadata }, _tier_initializers, _tier_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateVolumeDto = UpdateVolumeDto;
/**
 * Create LUN DTO
 */
let CreateLunDto = (() => {
    var _a;
    let _classSuper = SanAuditMetadata;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _volumeId_decorators;
    let _volumeId_initializers = [];
    let _volumeId_extraInitializers = [];
    let _sizeGB_decorators;
    let _sizeGB_initializers = [];
    let _sizeGB_extraInitializers = [];
    let _protocol_decorators;
    let _protocol_initializers = [];
    let _protocol_extraInitializers = [];
    let _lunId_decorators;
    let _lunId_initializers = [];
    let _lunId_extraInitializers = [];
    let _hostGroups_decorators;
    let _hostGroups_initializers = [];
    let _hostGroups_extraInitializers = [];
    let _writeCache_decorators;
    let _writeCache_initializers = [];
    let _writeCache_extraInitializers = [];
    let _readCache_decorators;
    let _readCache_initializers = [];
    let _readCache_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    return _a = class CreateLunDto extends _classSuper {
            constructor() {
                super(...arguments);
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.volumeId = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _volumeId_initializers, void 0));
                this.sizeGB = (__runInitializers(this, _volumeId_extraInitializers), __runInitializers(this, _sizeGB_initializers, void 0));
                this.protocol = (__runInitializers(this, _sizeGB_extraInitializers), __runInitializers(this, _protocol_initializers, void 0));
                this.lunId = (__runInitializers(this, _protocol_extraInitializers), __runInitializers(this, _lunId_initializers, void 0));
                this.hostGroups = (__runInitializers(this, _lunId_extraInitializers), __runInitializers(this, _hostGroups_initializers, void 0));
                this.writeCache = (__runInitializers(this, _hostGroups_extraInitializers), __runInitializers(this, _writeCache_initializers, void 0));
                this.readCache = (__runInitializers(this, _writeCache_extraInitializers), __runInitializers(this, _readCache_initializers, void 0));
                this.description = (__runInitializers(this, _readCache_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _name_decorators = [ApiProperty({ description: 'LUN name', example: 'medical-imaging-lun-01' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(64)];
            _volumeId_decorators = [ApiProperty({ description: 'Volume ID to create LUN on' }), (0, class_validator_1.IsUUID)()];
            _sizeGB_decorators = [ApiProperty({ description: 'LUN size in GB', example: 100 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10000)];
            _protocol_decorators = [ApiProperty({ description: 'Protocol', enum: LunProtocol }), (0, class_validator_1.IsEnum)(LunProtocol)];
            _lunId_decorators = [ApiProperty({ description: 'LUN ID (if specific ID required)', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(255)];
            _hostGroups_decorators = [ApiProperty({ description: 'Host access groups (initiators)', type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _writeCache_decorators = [ApiProperty({ description: 'Enable write cache', default: true }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _readCache_decorators = [ApiProperty({ description: 'Enable read cache', default: true }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _description_decorators = [ApiProperty({ description: 'LUN description', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(500)];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _volumeId_decorators, { kind: "field", name: "volumeId", static: false, private: false, access: { has: obj => "volumeId" in obj, get: obj => obj.volumeId, set: (obj, value) => { obj.volumeId = value; } }, metadata: _metadata }, _volumeId_initializers, _volumeId_extraInitializers);
            __esDecorate(null, null, _sizeGB_decorators, { kind: "field", name: "sizeGB", static: false, private: false, access: { has: obj => "sizeGB" in obj, get: obj => obj.sizeGB, set: (obj, value) => { obj.sizeGB = value; } }, metadata: _metadata }, _sizeGB_initializers, _sizeGB_extraInitializers);
            __esDecorate(null, null, _protocol_decorators, { kind: "field", name: "protocol", static: false, private: false, access: { has: obj => "protocol" in obj, get: obj => obj.protocol, set: (obj, value) => { obj.protocol = value; } }, metadata: _metadata }, _protocol_initializers, _protocol_extraInitializers);
            __esDecorate(null, null, _lunId_decorators, { kind: "field", name: "lunId", static: false, private: false, access: { has: obj => "lunId" in obj, get: obj => obj.lunId, set: (obj, value) => { obj.lunId = value; } }, metadata: _metadata }, _lunId_initializers, _lunId_extraInitializers);
            __esDecorate(null, null, _hostGroups_decorators, { kind: "field", name: "hostGroups", static: false, private: false, access: { has: obj => "hostGroups" in obj, get: obj => obj.hostGroups, set: (obj, value) => { obj.hostGroups = value; } }, metadata: _metadata }, _hostGroups_initializers, _hostGroups_extraInitializers);
            __esDecorate(null, null, _writeCache_decorators, { kind: "field", name: "writeCache", static: false, private: false, access: { has: obj => "writeCache" in obj, get: obj => obj.writeCache, set: (obj, value) => { obj.writeCache = value; } }, metadata: _metadata }, _writeCache_initializers, _writeCache_extraInitializers);
            __esDecorate(null, null, _readCache_decorators, { kind: "field", name: "readCache", static: false, private: false, access: { has: obj => "readCache" in obj, get: obj => obj.readCache, set: (obj, value) => { obj.readCache = value; } }, metadata: _metadata }, _readCache_initializers, _readCache_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateLunDto = CreateLunDto;
/**
 * Update LUN DTO
 */
let UpdateLunDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _sizeGB_decorators;
    let _sizeGB_initializers = [];
    let _sizeGB_extraInitializers = [];
    let _hostGroups_decorators;
    let _hostGroups_initializers = [];
    let _hostGroups_extraInitializers = [];
    let _writeCache_decorators;
    let _writeCache_initializers = [];
    let _writeCache_extraInitializers = [];
    let _readCache_decorators;
    let _readCache_initializers = [];
    let _readCache_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    return _a = class UpdateLunDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.sizeGB = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _sizeGB_initializers, void 0));
                this.hostGroups = (__runInitializers(this, _sizeGB_extraInitializers), __runInitializers(this, _hostGroups_initializers, void 0));
                this.writeCache = (__runInitializers(this, _hostGroups_extraInitializers), __runInitializers(this, _writeCache_initializers, void 0));
                this.readCache = (__runInitializers(this, _writeCache_extraInitializers), __runInitializers(this, _readCache_initializers, void 0));
                this.description = (__runInitializers(this, _readCache_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [ApiProperty({ description: 'New LUN name', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(64)];
            _sizeGB_decorators = [ApiProperty({ description: 'Expand size in GB', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(1)];
            _hostGroups_decorators = [ApiProperty({ description: 'Update host groups', required: false, type: [String] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)({ each: true })];
            _writeCache_decorators = [ApiProperty({ description: 'Update write cache setting', required: false }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _readCache_decorators = [ApiProperty({ description: 'Update read cache setting', required: false }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _description_decorators = [ApiProperty({ description: 'Update description', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(500)];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _sizeGB_decorators, { kind: "field", name: "sizeGB", static: false, private: false, access: { has: obj => "sizeGB" in obj, get: obj => obj.sizeGB, set: (obj, value) => { obj.sizeGB = value; } }, metadata: _metadata }, _sizeGB_initializers, _sizeGB_extraInitializers);
            __esDecorate(null, null, _hostGroups_decorators, { kind: "field", name: "hostGroups", static: false, private: false, access: { has: obj => "hostGroups" in obj, get: obj => obj.hostGroups, set: (obj, value) => { obj.hostGroups = value; } }, metadata: _metadata }, _hostGroups_initializers, _hostGroups_extraInitializers);
            __esDecorate(null, null, _writeCache_decorators, { kind: "field", name: "writeCache", static: false, private: false, access: { has: obj => "writeCache" in obj, get: obj => obj.writeCache, set: (obj, value) => { obj.writeCache = value; } }, metadata: _metadata }, _writeCache_initializers, _writeCache_extraInitializers);
            __esDecorate(null, null, _readCache_decorators, { kind: "field", name: "readCache", static: false, private: false, access: { has: obj => "readCache" in obj, get: obj => obj.readCache, set: (obj, value) => { obj.readCache = value; } }, metadata: _metadata }, _readCache_initializers, _readCache_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateLunDto = UpdateLunDto;
/**
 * Create Snapshot DTO
 */
let CreateSnapshotDto = (() => {
    var _a;
    let _classSuper = SanAuditMetadata;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _sourceId_decorators;
    let _sourceId_initializers = [];
    let _sourceId_extraInitializers = [];
    let _sourceType_decorators;
    let _sourceType_initializers = [];
    let _sourceType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _retentionDays_decorators;
    let _retentionDays_initializers = [];
    let _retentionDays_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    return _a = class CreateSnapshotDto extends _classSuper {
            constructor() {
                super(...arguments);
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.sourceId = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _sourceId_initializers, void 0));
                this.sourceType = (__runInitializers(this, _sourceId_extraInitializers), __runInitializers(this, _sourceType_initializers, void 0));
                this.description = (__runInitializers(this, _sourceType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.retentionDays = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _retentionDays_initializers, void 0));
                this.tags = (__runInitializers(this, _retentionDays_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                __runInitializers(this, _tags_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _name_decorators = [ApiProperty({ description: 'Snapshot name', example: 'patient-data-snapshot-2024-01' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(64)];
            _sourceId_decorators = [ApiProperty({ description: 'Volume ID or LUN ID to snapshot' }), (0, class_validator_1.IsUUID)()];
            _sourceType_decorators = [ApiProperty({ description: 'Source type', enum: ['volume', 'lun'] }), (0, class_validator_1.IsEnum)(['volume', 'lun'])];
            _description_decorators = [ApiProperty({ description: 'Snapshot description', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(500)];
            _retentionDays_decorators = [ApiProperty({ description: 'Retention period in days', required: false, default: 30 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(3650)];
            _tags_decorators = [ApiProperty({ description: 'Tags for classification', required: false }), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _sourceId_decorators, { kind: "field", name: "sourceId", static: false, private: false, access: { has: obj => "sourceId" in obj, get: obj => obj.sourceId, set: (obj, value) => { obj.sourceId = value; } }, metadata: _metadata }, _sourceId_initializers, _sourceId_extraInitializers);
            __esDecorate(null, null, _sourceType_decorators, { kind: "field", name: "sourceType", static: false, private: false, access: { has: obj => "sourceType" in obj, get: obj => obj.sourceType, set: (obj, value) => { obj.sourceType = value; } }, metadata: _metadata }, _sourceType_initializers, _sourceType_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _retentionDays_decorators, { kind: "field", name: "retentionDays", static: false, private: false, access: { has: obj => "retentionDays" in obj, get: obj => obj.retentionDays, set: (obj, value) => { obj.retentionDays = value; } }, metadata: _metadata }, _retentionDays_initializers, _retentionDays_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateSnapshotDto = CreateSnapshotDto;
/**
 * Create Replication DTO
 */
let CreateReplicationDto = (() => {
    var _a;
    let _classSuper = SanAuditMetadata;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _sourceVolumeId_decorators;
    let _sourceVolumeId_initializers = [];
    let _sourceVolumeId_extraInitializers = [];
    let _targetVolumeId_decorators;
    let _targetVolumeId_initializers = [];
    let _targetVolumeId_extraInitializers = [];
    let _mode_decorators;
    let _mode_initializers = [];
    let _mode_extraInitializers = [];
    let _targetArrayId_decorators;
    let _targetArrayId_initializers = [];
    let _targetArrayId_extraInitializers = [];
    let _syncIntervalMinutes_decorators;
    let _syncIntervalMinutes_initializers = [];
    let _syncIntervalMinutes_extraInitializers = [];
    let _compressionEnabled_decorators;
    let _compressionEnabled_initializers = [];
    let _compressionEnabled_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    return _a = class CreateReplicationDto extends _classSuper {
            constructor() {
                super(...arguments);
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.sourceVolumeId = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _sourceVolumeId_initializers, void 0));
                this.targetVolumeId = (__runInitializers(this, _sourceVolumeId_extraInitializers), __runInitializers(this, _targetVolumeId_initializers, void 0));
                this.mode = (__runInitializers(this, _targetVolumeId_extraInitializers), __runInitializers(this, _mode_initializers, void 0));
                this.targetArrayId = (__runInitializers(this, _mode_extraInitializers), __runInitializers(this, _targetArrayId_initializers, void 0));
                this.syncIntervalMinutes = (__runInitializers(this, _targetArrayId_extraInitializers), __runInitializers(this, _syncIntervalMinutes_initializers, void 0));
                this.compressionEnabled = (__runInitializers(this, _syncIntervalMinutes_extraInitializers), __runInitializers(this, _compressionEnabled_initializers, void 0));
                this.description = (__runInitializers(this, _compressionEnabled_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _name_decorators = [ApiProperty({ description: 'Replication name', example: 'dr-replication-primary-to-secondary' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(64)];
            _sourceVolumeId_decorators = [ApiProperty({ description: 'Source volume ID' }), (0, class_validator_1.IsUUID)()];
            _targetVolumeId_decorators = [ApiProperty({ description: 'Target volume ID' }), (0, class_validator_1.IsUUID)()];
            _mode_decorators = [ApiProperty({ description: 'Replication mode', enum: ReplicationMode }), (0, class_validator_1.IsEnum)(ReplicationMode)];
            _targetArrayId_decorators = [ApiProperty({ description: 'Target array ID/address' }), (0, class_validator_1.IsString)()];
            _syncIntervalMinutes_decorators = [ApiProperty({ description: 'Sync interval in minutes (for async)', required: false }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(5), (0, class_validator_1.Max)(1440)];
            _compressionEnabled_decorators = [ApiProperty({ description: 'Enable compression for data transfer', default: true }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _description_decorators = [ApiProperty({ description: 'Description', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(500)];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _sourceVolumeId_decorators, { kind: "field", name: "sourceVolumeId", static: false, private: false, access: { has: obj => "sourceVolumeId" in obj, get: obj => obj.sourceVolumeId, set: (obj, value) => { obj.sourceVolumeId = value; } }, metadata: _metadata }, _sourceVolumeId_initializers, _sourceVolumeId_extraInitializers);
            __esDecorate(null, null, _targetVolumeId_decorators, { kind: "field", name: "targetVolumeId", static: false, private: false, access: { has: obj => "targetVolumeId" in obj, get: obj => obj.targetVolumeId, set: (obj, value) => { obj.targetVolumeId = value; } }, metadata: _metadata }, _targetVolumeId_initializers, _targetVolumeId_extraInitializers);
            __esDecorate(null, null, _mode_decorators, { kind: "field", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
            __esDecorate(null, null, _targetArrayId_decorators, { kind: "field", name: "targetArrayId", static: false, private: false, access: { has: obj => "targetArrayId" in obj, get: obj => obj.targetArrayId, set: (obj, value) => { obj.targetArrayId = value; } }, metadata: _metadata }, _targetArrayId_initializers, _targetArrayId_extraInitializers);
            __esDecorate(null, null, _syncIntervalMinutes_decorators, { kind: "field", name: "syncIntervalMinutes", static: false, private: false, access: { has: obj => "syncIntervalMinutes" in obj, get: obj => obj.syncIntervalMinutes, set: (obj, value) => { obj.syncIntervalMinutes = value; } }, metadata: _metadata }, _syncIntervalMinutes_initializers, _syncIntervalMinutes_extraInitializers);
            __esDecorate(null, null, _compressionEnabled_decorators, { kind: "field", name: "compressionEnabled", static: false, private: false, access: { has: obj => "compressionEnabled" in obj, get: obj => obj.compressionEnabled, set: (obj, value) => { obj.compressionEnabled = value; } }, metadata: _metadata }, _compressionEnabled_initializers, _compressionEnabled_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateReplicationDto = CreateReplicationDto;
/**
 * Volume query/filter DTO
 */
let VolumeQueryDto = (() => {
    var _a;
    let _page_decorators;
    let _page_initializers = [];
    let _page_extraInitializers = [];
    let _limit_decorators;
    let _limit_initializers = [];
    let _limit_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _tier_decorators;
    let _tier_initializers = [];
    let _tier_extraInitializers = [];
    let _search_decorators;
    let _search_initializers = [];
    let _search_extraInitializers = [];
    let _sortBy_decorators;
    let _sortBy_initializers = [];
    let _sortBy_extraInitializers = [];
    let _sortOrder_decorators;
    let _sortOrder_initializers = [];
    let _sortOrder_extraInitializers = [];
    return _a = class VolumeQueryDto {
            constructor() {
                this.page = __runInitializers(this, _page_initializers, 1);
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, 20));
                this.status = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.type = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.tier = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _tier_initializers, void 0));
                this.search = (__runInitializers(this, _tier_extraInitializers), __runInitializers(this, _search_initializers, void 0));
                this.sortBy = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _sortBy_initializers, 'createdAt'));
                this.sortOrder = (__runInitializers(this, _sortBy_extraInitializers), __runInitializers(this, _sortOrder_initializers, 'DESC'));
                __runInitializers(this, _sortOrder_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _page_decorators = [ApiProperty({ description: 'Page number', required: false, default: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(1), (0, class_transformer_1.Type)(() => Number)];
            _limit_decorators = [ApiProperty({ description: 'Items per page', required: false, default: 20 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100), (0, class_transformer_1.Type)(() => Number)];
            _status_decorators = [ApiProperty({ description: 'Filter by status', enum: VolumeStatus, required: false }), (0, class_validator_1.IsEnum)(VolumeStatus), (0, class_validator_1.IsOptional)()];
            _type_decorators = [ApiProperty({ description: 'Filter by type', enum: VolumeType, required: false }), (0, class_validator_1.IsEnum)(VolumeType), (0, class_validator_1.IsOptional)()];
            _tier_decorators = [ApiProperty({ description: 'Filter by storage tier', enum: StorageTier, required: false }), (0, class_validator_1.IsEnum)(StorageTier), (0, class_validator_1.IsOptional)()];
            _search_decorators = [ApiProperty({ description: 'Search by name', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _sortBy_decorators = [ApiProperty({ description: 'Sort by field', required: false, default: 'createdAt' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _sortOrder_decorators = [ApiProperty({ description: 'Sort order', enum: ['ASC', 'DESC'], required: false, default: 'DESC' }), (0, class_validator_1.IsEnum)(['ASC', 'DESC']), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: obj => "page" in obj, get: obj => obj.page, set: (obj, value) => { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: obj => "limit" in obj, get: obj => obj.limit, set: (obj, value) => { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _tier_decorators, { kind: "field", name: "tier", static: false, private: false, access: { has: obj => "tier" in obj, get: obj => obj.tier, set: (obj, value) => { obj.tier = value; } }, metadata: _metadata }, _tier_initializers, _tier_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: obj => "search" in obj, get: obj => obj.search, set: (obj, value) => { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _sortBy_decorators, { kind: "field", name: "sortBy", static: false, private: false, access: { has: obj => "sortBy" in obj, get: obj => obj.sortBy, set: (obj, value) => { obj.sortBy = value; } }, metadata: _metadata }, _sortBy_initializers, _sortBy_extraInitializers);
            __esDecorate(null, null, _sortOrder_decorators, { kind: "field", name: "sortOrder", static: false, private: false, access: { has: obj => "sortOrder" in obj, get: obj => obj.sortOrder, set: (obj, value) => { obj.sortOrder = value; } }, metadata: _metadata }, _sortOrder_initializers, _sortOrder_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.VolumeQueryDto = VolumeQueryDto;
/**
 * Performance metrics query DTO
 */
let PerformanceQueryDto = (() => {
    var _a;
    let _startTime_decorators;
    let _startTime_initializers = [];
    let _startTime_extraInitializers = [];
    let _endTime_decorators;
    let _endTime_initializers = [];
    let _endTime_extraInitializers = [];
    let _intervalSeconds_decorators;
    let _intervalSeconds_initializers = [];
    let _intervalSeconds_extraInitializers = [];
    let _metrics_decorators;
    let _metrics_initializers = [];
    let _metrics_extraInitializers = [];
    return _a = class PerformanceQueryDto {
            constructor() {
                this.startTime = __runInitializers(this, _startTime_initializers, void 0);
                this.endTime = (__runInitializers(this, _startTime_extraInitializers), __runInitializers(this, _endTime_initializers, void 0));
                this.intervalSeconds = (__runInitializers(this, _endTime_extraInitializers), __runInitializers(this, _intervalSeconds_initializers, 300));
                this.metrics = (__runInitializers(this, _intervalSeconds_extraInitializers), __runInitializers(this, _metrics_initializers, void 0));
                __runInitializers(this, _metrics_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _startTime_decorators = [ApiProperty({ description: 'Start time (ISO 8601)', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _endTime_decorators = [ApiProperty({ description: 'End time (ISO 8601)', required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _intervalSeconds_decorators = [ApiProperty({ description: 'Metric interval in seconds', required: false, default: 300 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(60), (0, class_validator_1.Max)(3600), (0, class_transformer_1.Type)(() => Number)];
            _metrics_decorators = [ApiProperty({ description: 'Metrics to retrieve', type: [String], required: false }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _startTime_decorators, { kind: "field", name: "startTime", static: false, private: false, access: { has: obj => "startTime" in obj, get: obj => obj.startTime, set: (obj, value) => { obj.startTime = value; } }, metadata: _metadata }, _startTime_initializers, _startTime_extraInitializers);
            __esDecorate(null, null, _endTime_decorators, { kind: "field", name: "endTime", static: false, private: false, access: { has: obj => "endTime" in obj, get: obj => obj.endTime, set: (obj, value) => { obj.endTime = value; } }, metadata: _metadata }, _endTime_initializers, _endTime_extraInitializers);
            __esDecorate(null, null, _intervalSeconds_decorators, { kind: "field", name: "intervalSeconds", static: false, private: false, access: { has: obj => "intervalSeconds" in obj, get: obj => obj.intervalSeconds, set: (obj, value) => { obj.intervalSeconds = value; } }, metadata: _metadata }, _intervalSeconds_initializers, _intervalSeconds_extraInitializers);
            __esDecorate(null, null, _metrics_decorators, { kind: "field", name: "metrics", static: false, private: false, access: { has: obj => "metrics" in obj, get: obj => obj.metrics, set: (obj, value) => { obj.metrics = value; } }, metadata: _metadata }, _metrics_initializers, _metrics_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PerformanceQueryDto = PerformanceQueryDto;
// ============================================================================
// RESPONSE DTOs
// ============================================================================
/**
 * Volume response DTO
 */
let VolumeResponseDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _sizeGB_decorators;
    let _sizeGB_initializers = [];
    let _sizeGB_extraInitializers = [];
    let _usedGB_decorators;
    let _usedGB_initializers = [];
    let _usedGB_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _tier_decorators;
    let _tier_initializers = [];
    let _tier_extraInitializers = [];
    let _raidLevel_decorators;
    let _raidLevel_initializers = [];
    let _raidLevel_extraInitializers = [];
    let _encrypted_decorators;
    let _encrypted_initializers = [];
    let _encrypted_extraInitializers = [];
    let _compressed_decorators;
    let _compressed_initializers = [];
    let _compressed_extraInitializers = [];
    let _deduplication_decorators;
    let _deduplication_initializers = [];
    let _deduplication_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    return _a = class VolumeResponseDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.sizeGB = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _sizeGB_initializers, void 0));
                this.usedGB = (__runInitializers(this, _sizeGB_extraInitializers), __runInitializers(this, _usedGB_initializers, void 0));
                this.type = (__runInitializers(this, _usedGB_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.status = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.tier = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _tier_initializers, void 0));
                this.raidLevel = (__runInitializers(this, _tier_extraInitializers), __runInitializers(this, _raidLevel_initializers, void 0));
                this.encrypted = (__runInitializers(this, _raidLevel_extraInitializers), __runInitializers(this, _encrypted_initializers, void 0));
                this.compressed = (__runInitializers(this, _encrypted_extraInitializers), __runInitializers(this, _compressed_initializers, void 0));
                this.deduplication = (__runInitializers(this, _compressed_extraInitializers), __runInitializers(this, _deduplication_initializers, void 0));
                this.description = (__runInitializers(this, _deduplication_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.tags = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.createdAt = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                this.createdBy = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
                __runInitializers(this, _createdBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [ApiProperty({ description: 'Volume ID' }), (0, class_transformer_1.Expose)()];
            _name_decorators = [ApiProperty({ description: 'Volume name' }), (0, class_transformer_1.Expose)()];
            _sizeGB_decorators = [ApiProperty({ description: 'Size in GB' }), (0, class_transformer_1.Expose)()];
            _usedGB_decorators = [ApiProperty({ description: 'Used space in GB' }), (0, class_transformer_1.Expose)()];
            _type_decorators = [ApiProperty({ description: 'Volume type', enum: VolumeType }), (0, class_transformer_1.Expose)()];
            _status_decorators = [ApiProperty({ description: 'Volume status', enum: VolumeStatus }), (0, class_transformer_1.Expose)()];
            _tier_decorators = [ApiProperty({ description: 'Storage tier', enum: StorageTier }), (0, class_transformer_1.Expose)()];
            _raidLevel_decorators = [ApiProperty({ description: 'RAID level', enum: RaidLevel }), (0, class_transformer_1.Expose)()];
            _encrypted_decorators = [ApiProperty({ description: 'Encryption enabled' }), (0, class_transformer_1.Expose)()];
            _compressed_decorators = [ApiProperty({ description: 'Compression enabled' }), (0, class_transformer_1.Expose)()];
            _deduplication_decorators = [ApiProperty({ description: 'Deduplication enabled' }), (0, class_transformer_1.Expose)()];
            _description_decorators = [ApiProperty({ description: 'Description' }), (0, class_transformer_1.Expose)()];
            _tags_decorators = [ApiProperty({ description: 'Tags' }), (0, class_transformer_1.Expose)()];
            _createdAt_decorators = [ApiProperty({ description: 'Created at' }), (0, class_transformer_1.Expose)()];
            _updatedAt_decorators = [ApiProperty({ description: 'Updated at' }), (0, class_transformer_1.Expose)()];
            _createdBy_decorators = [ApiProperty({ description: 'Created by user ID' }), (0, class_transformer_1.Expose)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _sizeGB_decorators, { kind: "field", name: "sizeGB", static: false, private: false, access: { has: obj => "sizeGB" in obj, get: obj => obj.sizeGB, set: (obj, value) => { obj.sizeGB = value; } }, metadata: _metadata }, _sizeGB_initializers, _sizeGB_extraInitializers);
            __esDecorate(null, null, _usedGB_decorators, { kind: "field", name: "usedGB", static: false, private: false, access: { has: obj => "usedGB" in obj, get: obj => obj.usedGB, set: (obj, value) => { obj.usedGB = value; } }, metadata: _metadata }, _usedGB_initializers, _usedGB_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _tier_decorators, { kind: "field", name: "tier", static: false, private: false, access: { has: obj => "tier" in obj, get: obj => obj.tier, set: (obj, value) => { obj.tier = value; } }, metadata: _metadata }, _tier_initializers, _tier_extraInitializers);
            __esDecorate(null, null, _raidLevel_decorators, { kind: "field", name: "raidLevel", static: false, private: false, access: { has: obj => "raidLevel" in obj, get: obj => obj.raidLevel, set: (obj, value) => { obj.raidLevel = value; } }, metadata: _metadata }, _raidLevel_initializers, _raidLevel_extraInitializers);
            __esDecorate(null, null, _encrypted_decorators, { kind: "field", name: "encrypted", static: false, private: false, access: { has: obj => "encrypted" in obj, get: obj => obj.encrypted, set: (obj, value) => { obj.encrypted = value; } }, metadata: _metadata }, _encrypted_initializers, _encrypted_extraInitializers);
            __esDecorate(null, null, _compressed_decorators, { kind: "field", name: "compressed", static: false, private: false, access: { has: obj => "compressed" in obj, get: obj => obj.compressed, set: (obj, value) => { obj.compressed = value; } }, metadata: _metadata }, _compressed_initializers, _compressed_extraInitializers);
            __esDecorate(null, null, _deduplication_decorators, { kind: "field", name: "deduplication", static: false, private: false, access: { has: obj => "deduplication" in obj, get: obj => obj.deduplication, set: (obj, value) => { obj.deduplication = value; } }, metadata: _metadata }, _deduplication_initializers, _deduplication_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.VolumeResponseDto = VolumeResponseDto;
/**
 * LUN response DTO
 */
let LunResponseDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _lunId_decorators;
    let _lunId_initializers = [];
    let _lunId_extraInitializers = [];
    let _volumeId_decorators;
    let _volumeId_initializers = [];
    let _volumeId_extraInitializers = [];
    let _sizeGB_decorators;
    let _sizeGB_initializers = [];
    let _sizeGB_extraInitializers = [];
    let _protocol_decorators;
    let _protocol_initializers = [];
    let _protocol_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _hostGroups_decorators;
    let _hostGroups_initializers = [];
    let _hostGroups_extraInitializers = [];
    let _writeCache_decorators;
    let _writeCache_initializers = [];
    let _writeCache_extraInitializers = [];
    let _readCache_decorators;
    let _readCache_initializers = [];
    let _readCache_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    return _a = class LunResponseDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.lunId = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _lunId_initializers, void 0));
                this.volumeId = (__runInitializers(this, _lunId_extraInitializers), __runInitializers(this, _volumeId_initializers, void 0));
                this.sizeGB = (__runInitializers(this, _volumeId_extraInitializers), __runInitializers(this, _sizeGB_initializers, void 0));
                this.protocol = (__runInitializers(this, _sizeGB_extraInitializers), __runInitializers(this, _protocol_initializers, void 0));
                this.status = (__runInitializers(this, _protocol_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.hostGroups = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _hostGroups_initializers, void 0));
                this.writeCache = (__runInitializers(this, _hostGroups_extraInitializers), __runInitializers(this, _writeCache_initializers, void 0));
                this.readCache = (__runInitializers(this, _writeCache_extraInitializers), __runInitializers(this, _readCache_initializers, void 0));
                this.description = (__runInitializers(this, _readCache_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.createdAt = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [ApiProperty({ description: 'LUN ID' }), (0, class_transformer_1.Expose)()];
            _name_decorators = [ApiProperty({ description: 'LUN name' }), (0, class_transformer_1.Expose)()];
            _lunId_decorators = [ApiProperty({ description: 'LUN number' }), (0, class_transformer_1.Expose)()];
            _volumeId_decorators = [ApiProperty({ description: 'Volume ID' }), (0, class_transformer_1.Expose)()];
            _sizeGB_decorators = [ApiProperty({ description: 'Size in GB' }), (0, class_transformer_1.Expose)()];
            _protocol_decorators = [ApiProperty({ description: 'Protocol', enum: LunProtocol }), (0, class_transformer_1.Expose)()];
            _status_decorators = [ApiProperty({ description: 'Status' }), (0, class_transformer_1.Expose)()];
            _hostGroups_decorators = [ApiProperty({ description: 'Host groups' }), (0, class_transformer_1.Expose)()];
            _writeCache_decorators = [ApiProperty({ description: 'Write cache enabled' }), (0, class_transformer_1.Expose)()];
            _readCache_decorators = [ApiProperty({ description: 'Read cache enabled' }), (0, class_transformer_1.Expose)()];
            _description_decorators = [ApiProperty({ description: 'Description' }), (0, class_transformer_1.Expose)()];
            _createdAt_decorators = [ApiProperty({ description: 'Created at' }), (0, class_transformer_1.Expose)()];
            _updatedAt_decorators = [ApiProperty({ description: 'Updated at' }), (0, class_transformer_1.Expose)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _lunId_decorators, { kind: "field", name: "lunId", static: false, private: false, access: { has: obj => "lunId" in obj, get: obj => obj.lunId, set: (obj, value) => { obj.lunId = value; } }, metadata: _metadata }, _lunId_initializers, _lunId_extraInitializers);
            __esDecorate(null, null, _volumeId_decorators, { kind: "field", name: "volumeId", static: false, private: false, access: { has: obj => "volumeId" in obj, get: obj => obj.volumeId, set: (obj, value) => { obj.volumeId = value; } }, metadata: _metadata }, _volumeId_initializers, _volumeId_extraInitializers);
            __esDecorate(null, null, _sizeGB_decorators, { kind: "field", name: "sizeGB", static: false, private: false, access: { has: obj => "sizeGB" in obj, get: obj => obj.sizeGB, set: (obj, value) => { obj.sizeGB = value; } }, metadata: _metadata }, _sizeGB_initializers, _sizeGB_extraInitializers);
            __esDecorate(null, null, _protocol_decorators, { kind: "field", name: "protocol", static: false, private: false, access: { has: obj => "protocol" in obj, get: obj => obj.protocol, set: (obj, value) => { obj.protocol = value; } }, metadata: _metadata }, _protocol_initializers, _protocol_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _hostGroups_decorators, { kind: "field", name: "hostGroups", static: false, private: false, access: { has: obj => "hostGroups" in obj, get: obj => obj.hostGroups, set: (obj, value) => { obj.hostGroups = value; } }, metadata: _metadata }, _hostGroups_initializers, _hostGroups_extraInitializers);
            __esDecorate(null, null, _writeCache_decorators, { kind: "field", name: "writeCache", static: false, private: false, access: { has: obj => "writeCache" in obj, get: obj => obj.writeCache, set: (obj, value) => { obj.writeCache = value; } }, metadata: _metadata }, _writeCache_initializers, _writeCache_extraInitializers);
            __esDecorate(null, null, _readCache_decorators, { kind: "field", name: "readCache", static: false, private: false, access: { has: obj => "readCache" in obj, get: obj => obj.readCache, set: (obj, value) => { obj.readCache = value; } }, metadata: _metadata }, _readCache_initializers, _readCache_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.LunResponseDto = LunResponseDto;
/**
 * Snapshot response DTO
 */
let SnapshotResponseDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _sourceId_decorators;
    let _sourceId_initializers = [];
    let _sourceId_extraInitializers = [];
    let _sourceType_decorators;
    let _sourceType_initializers = [];
    let _sourceType_extraInitializers = [];
    let _sizeGB_decorators;
    let _sizeGB_initializers = [];
    let _sizeGB_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _retentionDays_decorators;
    let _retentionDays_initializers = [];
    let _retentionDays_extraInitializers = [];
    let _expiresAt_decorators;
    let _expiresAt_initializers = [];
    let _expiresAt_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _tags_decorators;
    let _tags_initializers = [];
    let _tags_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    return _a = class SnapshotResponseDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.sourceId = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _sourceId_initializers, void 0));
                this.sourceType = (__runInitializers(this, _sourceId_extraInitializers), __runInitializers(this, _sourceType_initializers, void 0));
                this.sizeGB = (__runInitializers(this, _sourceType_extraInitializers), __runInitializers(this, _sizeGB_initializers, void 0));
                this.status = (__runInitializers(this, _sizeGB_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.retentionDays = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _retentionDays_initializers, void 0));
                this.expiresAt = (__runInitializers(this, _retentionDays_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
                this.description = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.tags = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.createdAt = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.createdBy = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
                __runInitializers(this, _createdBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [ApiProperty({ description: 'Snapshot ID' }), (0, class_transformer_1.Expose)()];
            _name_decorators = [ApiProperty({ description: 'Snapshot name' }), (0, class_transformer_1.Expose)()];
            _sourceId_decorators = [ApiProperty({ description: 'Source ID (volume or LUN)' }), (0, class_transformer_1.Expose)()];
            _sourceType_decorators = [ApiProperty({ description: 'Source type' }), (0, class_transformer_1.Expose)()];
            _sizeGB_decorators = [ApiProperty({ description: 'Snapshot size in GB' }), (0, class_transformer_1.Expose)()];
            _status_decorators = [ApiProperty({ description: 'Status', enum: SnapshotStatus }), (0, class_transformer_1.Expose)()];
            _retentionDays_decorators = [ApiProperty({ description: 'Retention days' }), (0, class_transformer_1.Expose)()];
            _expiresAt_decorators = [ApiProperty({ description: 'Expiration date' }), (0, class_transformer_1.Expose)()];
            _description_decorators = [ApiProperty({ description: 'Description' }), (0, class_transformer_1.Expose)()];
            _tags_decorators = [ApiProperty({ description: 'Tags' }), (0, class_transformer_1.Expose)()];
            _createdAt_decorators = [ApiProperty({ description: 'Created at' }), (0, class_transformer_1.Expose)()];
            _createdBy_decorators = [ApiProperty({ description: 'Created by user ID' }), (0, class_transformer_1.Expose)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _sourceId_decorators, { kind: "field", name: "sourceId", static: false, private: false, access: { has: obj => "sourceId" in obj, get: obj => obj.sourceId, set: (obj, value) => { obj.sourceId = value; } }, metadata: _metadata }, _sourceId_initializers, _sourceId_extraInitializers);
            __esDecorate(null, null, _sourceType_decorators, { kind: "field", name: "sourceType", static: false, private: false, access: { has: obj => "sourceType" in obj, get: obj => obj.sourceType, set: (obj, value) => { obj.sourceType = value; } }, metadata: _metadata }, _sourceType_initializers, _sourceType_extraInitializers);
            __esDecorate(null, null, _sizeGB_decorators, { kind: "field", name: "sizeGB", static: false, private: false, access: { has: obj => "sizeGB" in obj, get: obj => obj.sizeGB, set: (obj, value) => { obj.sizeGB = value; } }, metadata: _metadata }, _sizeGB_initializers, _sizeGB_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _retentionDays_decorators, { kind: "field", name: "retentionDays", static: false, private: false, access: { has: obj => "retentionDays" in obj, get: obj => obj.retentionDays, set: (obj, value) => { obj.retentionDays = value; } }, metadata: _metadata }, _retentionDays_initializers, _retentionDays_extraInitializers);
            __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: obj => "expiresAt" in obj, get: obj => obj.expiresAt, set: (obj, value) => { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: obj => "tags" in obj, get: obj => obj.tags, set: (obj, value) => { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SnapshotResponseDto = SnapshotResponseDto;
/**
 * Replication response DTO
 */
let ReplicationResponseDto = (() => {
    var _a;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _sourceVolumeId_decorators;
    let _sourceVolumeId_initializers = [];
    let _sourceVolumeId_extraInitializers = [];
    let _targetVolumeId_decorators;
    let _targetVolumeId_initializers = [];
    let _targetVolumeId_extraInitializers = [];
    let _targetArrayId_decorators;
    let _targetArrayId_initializers = [];
    let _targetArrayId_extraInitializers = [];
    let _mode_decorators;
    let _mode_initializers = [];
    let _mode_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _syncIntervalMinutes_decorators;
    let _syncIntervalMinutes_initializers = [];
    let _syncIntervalMinutes_extraInitializers = [];
    let _compressionEnabled_decorators;
    let _compressionEnabled_initializers = [];
    let _compressionEnabled_extraInitializers = [];
    let _lastSyncAt_decorators;
    let _lastSyncAt_initializers = [];
    let _lastSyncAt_extraInitializers = [];
    let _nextSyncAt_decorators;
    let _nextSyncAt_initializers = [];
    let _nextSyncAt_extraInitializers = [];
    let _bytesTransferred_decorators;
    let _bytesTransferred_initializers = [];
    let _bytesTransferred_extraInitializers = [];
    let _syncProgress_decorators;
    let _syncProgress_initializers = [];
    let _syncProgress_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    return _a = class ReplicationResponseDto {
            constructor() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.sourceVolumeId = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _sourceVolumeId_initializers, void 0));
                this.targetVolumeId = (__runInitializers(this, _sourceVolumeId_extraInitializers), __runInitializers(this, _targetVolumeId_initializers, void 0));
                this.targetArrayId = (__runInitializers(this, _targetVolumeId_extraInitializers), __runInitializers(this, _targetArrayId_initializers, void 0));
                this.mode = (__runInitializers(this, _targetArrayId_extraInitializers), __runInitializers(this, _mode_initializers, void 0));
                this.status = (__runInitializers(this, _mode_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.syncIntervalMinutes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _syncIntervalMinutes_initializers, void 0));
                this.compressionEnabled = (__runInitializers(this, _syncIntervalMinutes_extraInitializers), __runInitializers(this, _compressionEnabled_initializers, void 0));
                this.lastSyncAt = (__runInitializers(this, _compressionEnabled_extraInitializers), __runInitializers(this, _lastSyncAt_initializers, void 0));
                this.nextSyncAt = (__runInitializers(this, _lastSyncAt_extraInitializers), __runInitializers(this, _nextSyncAt_initializers, void 0));
                this.bytesTransferred = (__runInitializers(this, _nextSyncAt_extraInitializers), __runInitializers(this, _bytesTransferred_initializers, void 0));
                this.syncProgress = (__runInitializers(this, _bytesTransferred_extraInitializers), __runInitializers(this, _syncProgress_initializers, void 0));
                this.description = (__runInitializers(this, _syncProgress_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.createdAt = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                __runInitializers(this, _createdAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [ApiProperty({ description: 'Replication ID' }), (0, class_transformer_1.Expose)()];
            _name_decorators = [ApiProperty({ description: 'Replication name' }), (0, class_transformer_1.Expose)()];
            _sourceVolumeId_decorators = [ApiProperty({ description: 'Source volume ID' }), (0, class_transformer_1.Expose)()];
            _targetVolumeId_decorators = [ApiProperty({ description: 'Target volume ID' }), (0, class_transformer_1.Expose)()];
            _targetArrayId_decorators = [ApiProperty({ description: 'Target array ID' }), (0, class_transformer_1.Expose)()];
            _mode_decorators = [ApiProperty({ description: 'Mode', enum: ReplicationMode }), (0, class_transformer_1.Expose)()];
            _status_decorators = [ApiProperty({ description: 'Status', enum: ReplicationStatus }), (0, class_transformer_1.Expose)()];
            _syncIntervalMinutes_decorators = [ApiProperty({ description: 'Sync interval minutes' }), (0, class_transformer_1.Expose)()];
            _compressionEnabled_decorators = [ApiProperty({ description: 'Compression enabled' }), (0, class_transformer_1.Expose)()];
            _lastSyncAt_decorators = [ApiProperty({ description: 'Last sync time' }), (0, class_transformer_1.Expose)()];
            _nextSyncAt_decorators = [ApiProperty({ description: 'Next sync time' }), (0, class_transformer_1.Expose)()];
            _bytesTransferred_decorators = [ApiProperty({ description: 'Bytes transferred' }), (0, class_transformer_1.Expose)()];
            _syncProgress_decorators = [ApiProperty({ description: 'Sync progress percentage' }), (0, class_transformer_1.Expose)()];
            _description_decorators = [ApiProperty({ description: 'Description' }), (0, class_transformer_1.Expose)()];
            _createdAt_decorators = [ApiProperty({ description: 'Created at' }), (0, class_transformer_1.Expose)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _sourceVolumeId_decorators, { kind: "field", name: "sourceVolumeId", static: false, private: false, access: { has: obj => "sourceVolumeId" in obj, get: obj => obj.sourceVolumeId, set: (obj, value) => { obj.sourceVolumeId = value; } }, metadata: _metadata }, _sourceVolumeId_initializers, _sourceVolumeId_extraInitializers);
            __esDecorate(null, null, _targetVolumeId_decorators, { kind: "field", name: "targetVolumeId", static: false, private: false, access: { has: obj => "targetVolumeId" in obj, get: obj => obj.targetVolumeId, set: (obj, value) => { obj.targetVolumeId = value; } }, metadata: _metadata }, _targetVolumeId_initializers, _targetVolumeId_extraInitializers);
            __esDecorate(null, null, _targetArrayId_decorators, { kind: "field", name: "targetArrayId", static: false, private: false, access: { has: obj => "targetArrayId" in obj, get: obj => obj.targetArrayId, set: (obj, value) => { obj.targetArrayId = value; } }, metadata: _metadata }, _targetArrayId_initializers, _targetArrayId_extraInitializers);
            __esDecorate(null, null, _mode_decorators, { kind: "field", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _syncIntervalMinutes_decorators, { kind: "field", name: "syncIntervalMinutes", static: false, private: false, access: { has: obj => "syncIntervalMinutes" in obj, get: obj => obj.syncIntervalMinutes, set: (obj, value) => { obj.syncIntervalMinutes = value; } }, metadata: _metadata }, _syncIntervalMinutes_initializers, _syncIntervalMinutes_extraInitializers);
            __esDecorate(null, null, _compressionEnabled_decorators, { kind: "field", name: "compressionEnabled", static: false, private: false, access: { has: obj => "compressionEnabled" in obj, get: obj => obj.compressionEnabled, set: (obj, value) => { obj.compressionEnabled = value; } }, metadata: _metadata }, _compressionEnabled_initializers, _compressionEnabled_extraInitializers);
            __esDecorate(null, null, _lastSyncAt_decorators, { kind: "field", name: "lastSyncAt", static: false, private: false, access: { has: obj => "lastSyncAt" in obj, get: obj => obj.lastSyncAt, set: (obj, value) => { obj.lastSyncAt = value; } }, metadata: _metadata }, _lastSyncAt_initializers, _lastSyncAt_extraInitializers);
            __esDecorate(null, null, _nextSyncAt_decorators, { kind: "field", name: "nextSyncAt", static: false, private: false, access: { has: obj => "nextSyncAt" in obj, get: obj => obj.nextSyncAt, set: (obj, value) => { obj.nextSyncAt = value; } }, metadata: _metadata }, _nextSyncAt_initializers, _nextSyncAt_extraInitializers);
            __esDecorate(null, null, _bytesTransferred_decorators, { kind: "field", name: "bytesTransferred", static: false, private: false, access: { has: obj => "bytesTransferred" in obj, get: obj => obj.bytesTransferred, set: (obj, value) => { obj.bytesTransferred = value; } }, metadata: _metadata }, _bytesTransferred_initializers, _bytesTransferred_extraInitializers);
            __esDecorate(null, null, _syncProgress_decorators, { kind: "field", name: "syncProgress", static: false, private: false, access: { has: obj => "syncProgress" in obj, get: obj => obj.syncProgress, set: (obj, value) => { obj.syncProgress = value; } }, metadata: _metadata }, _syncProgress_initializers, _syncProgress_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ReplicationResponseDto = ReplicationResponseDto;
/**
 * Paginated response wrapper
 */
let PaginatedResponseDto = (() => {
    var _a;
    let _data_decorators;
    let _data_initializers = [];
    let _data_extraInitializers = [];
    let _meta_decorators;
    let _meta_initializers = [];
    let _meta_extraInitializers = [];
    return _a = class PaginatedResponseDto {
            constructor() {
                this.data = __runInitializers(this, _data_initializers, void 0);
                this.meta = (__runInitializers(this, _data_extraInitializers), __runInitializers(this, _meta_initializers, void 0));
                __runInitializers(this, _meta_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _data_decorators = [ApiProperty({ description: 'Data items' })];
            _meta_decorators = [ApiProperty({ description: 'Pagination metadata' })];
            __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: obj => "data" in obj, get: obj => obj.data, set: (obj, value) => { obj.data = value; } }, metadata: _metadata }, _data_initializers, _data_extraInitializers);
            __esDecorate(null, null, _meta_decorators, { kind: "field", name: "meta", static: false, private: false, access: { has: obj => "meta" in obj, get: obj => obj.meta, set: (obj, value) => { obj.meta = value; } }, metadata: _metadata }, _meta_initializers, _meta_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PaginatedResponseDto = PaginatedResponseDto;
/**
 * Performance metrics response DTO
 */
let PerformanceMetricsDto = (() => {
    var _a;
    let _resourceId_decorators;
    let _resourceId_initializers = [];
    let _resourceId_extraInitializers = [];
    let _resourceType_decorators;
    let _resourceType_initializers = [];
    let _resourceType_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _iopsRead_decorators;
    let _iopsRead_initializers = [];
    let _iopsRead_extraInitializers = [];
    let _iopsWrite_decorators;
    let _iopsWrite_initializers = [];
    let _iopsWrite_extraInitializers = [];
    let _throughputReadMBps_decorators;
    let _throughputReadMBps_initializers = [];
    let _throughputReadMBps_extraInitializers = [];
    let _throughputWriteMBps_decorators;
    let _throughputWriteMBps_initializers = [];
    let _throughputWriteMBps_extraInitializers = [];
    let _latencyReadMs_decorators;
    let _latencyReadMs_initializers = [];
    let _latencyReadMs_extraInitializers = [];
    let _latencyWriteMs_decorators;
    let _latencyWriteMs_initializers = [];
    let _latencyWriteMs_extraInitializers = [];
    let _queueDepth_decorators;
    let _queueDepth_initializers = [];
    let _queueDepth_extraInitializers = [];
    let _cpuUtilization_decorators;
    let _cpuUtilization_initializers = [];
    let _cpuUtilization_extraInitializers = [];
    return _a = class PerformanceMetricsDto {
            constructor() {
                this.resourceId = __runInitializers(this, _resourceId_initializers, void 0);
                this.resourceType = (__runInitializers(this, _resourceId_extraInitializers), __runInitializers(this, _resourceType_initializers, void 0));
                this.timestamp = (__runInitializers(this, _resourceType_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
                this.iopsRead = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _iopsRead_initializers, void 0));
                this.iopsWrite = (__runInitializers(this, _iopsRead_extraInitializers), __runInitializers(this, _iopsWrite_initializers, void 0));
                this.throughputReadMBps = (__runInitializers(this, _iopsWrite_extraInitializers), __runInitializers(this, _throughputReadMBps_initializers, void 0));
                this.throughputWriteMBps = (__runInitializers(this, _throughputReadMBps_extraInitializers), __runInitializers(this, _throughputWriteMBps_initializers, void 0));
                this.latencyReadMs = (__runInitializers(this, _throughputWriteMBps_extraInitializers), __runInitializers(this, _latencyReadMs_initializers, void 0));
                this.latencyWriteMs = (__runInitializers(this, _latencyReadMs_extraInitializers), __runInitializers(this, _latencyWriteMs_initializers, void 0));
                this.queueDepth = (__runInitializers(this, _latencyWriteMs_extraInitializers), __runInitializers(this, _queueDepth_initializers, void 0));
                this.cpuUtilization = (__runInitializers(this, _queueDepth_extraInitializers), __runInitializers(this, _cpuUtilization_initializers, void 0));
                __runInitializers(this, _cpuUtilization_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _resourceId_decorators = [ApiProperty({ description: 'Resource ID' }), (0, class_transformer_1.Expose)()];
            _resourceType_decorators = [ApiProperty({ description: 'Resource type' }), (0, class_transformer_1.Expose)()];
            _timestamp_decorators = [ApiProperty({ description: 'Timestamp' }), (0, class_transformer_1.Expose)()];
            _iopsRead_decorators = [ApiProperty({ description: 'IOPS (read)' }), (0, class_transformer_1.Expose)()];
            _iopsWrite_decorators = [ApiProperty({ description: 'IOPS (write)' }), (0, class_transformer_1.Expose)()];
            _throughputReadMBps_decorators = [ApiProperty({ description: 'Throughput MB/s (read)' }), (0, class_transformer_1.Expose)()];
            _throughputWriteMBps_decorators = [ApiProperty({ description: 'Throughput MB/s (write)' }), (0, class_transformer_1.Expose)()];
            _latencyReadMs_decorators = [ApiProperty({ description: 'Latency ms (read)' }), (0, class_transformer_1.Expose)()];
            _latencyWriteMs_decorators = [ApiProperty({ description: 'Latency ms (write)' }), (0, class_transformer_1.Expose)()];
            _queueDepth_decorators = [ApiProperty({ description: 'Queue depth' }), (0, class_transformer_1.Expose)()];
            _cpuUtilization_decorators = [ApiProperty({ description: 'CPU utilization %' }), (0, class_transformer_1.Expose)()];
            __esDecorate(null, null, _resourceId_decorators, { kind: "field", name: "resourceId", static: false, private: false, access: { has: obj => "resourceId" in obj, get: obj => obj.resourceId, set: (obj, value) => { obj.resourceId = value; } }, metadata: _metadata }, _resourceId_initializers, _resourceId_extraInitializers);
            __esDecorate(null, null, _resourceType_decorators, { kind: "field", name: "resourceType", static: false, private: false, access: { has: obj => "resourceType" in obj, get: obj => obj.resourceType, set: (obj, value) => { obj.resourceType = value; } }, metadata: _metadata }, _resourceType_initializers, _resourceType_extraInitializers);
            __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
            __esDecorate(null, null, _iopsRead_decorators, { kind: "field", name: "iopsRead", static: false, private: false, access: { has: obj => "iopsRead" in obj, get: obj => obj.iopsRead, set: (obj, value) => { obj.iopsRead = value; } }, metadata: _metadata }, _iopsRead_initializers, _iopsRead_extraInitializers);
            __esDecorate(null, null, _iopsWrite_decorators, { kind: "field", name: "iopsWrite", static: false, private: false, access: { has: obj => "iopsWrite" in obj, get: obj => obj.iopsWrite, set: (obj, value) => { obj.iopsWrite = value; } }, metadata: _metadata }, _iopsWrite_initializers, _iopsWrite_extraInitializers);
            __esDecorate(null, null, _throughputReadMBps_decorators, { kind: "field", name: "throughputReadMBps", static: false, private: false, access: { has: obj => "throughputReadMBps" in obj, get: obj => obj.throughputReadMBps, set: (obj, value) => { obj.throughputReadMBps = value; } }, metadata: _metadata }, _throughputReadMBps_initializers, _throughputReadMBps_extraInitializers);
            __esDecorate(null, null, _throughputWriteMBps_decorators, { kind: "field", name: "throughputWriteMBps", static: false, private: false, access: { has: obj => "throughputWriteMBps" in obj, get: obj => obj.throughputWriteMBps, set: (obj, value) => { obj.throughputWriteMBps = value; } }, metadata: _metadata }, _throughputWriteMBps_initializers, _throughputWriteMBps_extraInitializers);
            __esDecorate(null, null, _latencyReadMs_decorators, { kind: "field", name: "latencyReadMs", static: false, private: false, access: { has: obj => "latencyReadMs" in obj, get: obj => obj.latencyReadMs, set: (obj, value) => { obj.latencyReadMs = value; } }, metadata: _metadata }, _latencyReadMs_initializers, _latencyReadMs_extraInitializers);
            __esDecorate(null, null, _latencyWriteMs_decorators, { kind: "field", name: "latencyWriteMs", static: false, private: false, access: { has: obj => "latencyWriteMs" in obj, get: obj => obj.latencyWriteMs, set: (obj, value) => { obj.latencyWriteMs = value; } }, metadata: _metadata }, _latencyWriteMs_initializers, _latencyWriteMs_extraInitializers);
            __esDecorate(null, null, _queueDepth_decorators, { kind: "field", name: "queueDepth", static: false, private: false, access: { has: obj => "queueDepth" in obj, get: obj => obj.queueDepth, set: (obj, value) => { obj.queueDepth = value; } }, metadata: _metadata }, _queueDepth_initializers, _queueDepth_extraInitializers);
            __esDecorate(null, null, _cpuUtilization_decorators, { kind: "field", name: "cpuUtilization", static: false, private: false, access: { has: obj => "cpuUtilization" in obj, get: obj => obj.cpuUtilization, set: (obj, value) => { obj.cpuUtilization = value; } }, metadata: _metadata }, _cpuUtilization_initializers, _cpuUtilization_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PerformanceMetricsDto = PerformanceMetricsDto;
/**
 * Capacity report DTO
 */
let CapacityReportDto = (() => {
    var _a;
    let _totalCapacityGB_decorators;
    let _totalCapacityGB_initializers = [];
    let _totalCapacityGB_extraInitializers = [];
    let _usedCapacityGB_decorators;
    let _usedCapacityGB_initializers = [];
    let _usedCapacityGB_extraInitializers = [];
    let _availableCapacityGB_decorators;
    let _availableCapacityGB_initializers = [];
    let _availableCapacityGB_extraInitializers = [];
    let _utilizationPercent_decorators;
    let _utilizationPercent_initializers = [];
    let _utilizationPercent_extraInitializers = [];
    let _projectedDaysUntilFull_decorators;
    let _projectedDaysUntilFull_initializers = [];
    let _projectedDaysUntilFull_extraInitializers = [];
    let _capacityByTier_decorators;
    let _capacityByTier_initializers = [];
    let _capacityByTier_extraInitializers = [];
    let _capacityByType_decorators;
    let _capacityByType_initializers = [];
    let _capacityByType_extraInitializers = [];
    return _a = class CapacityReportDto {
            constructor() {
                this.totalCapacityGB = __runInitializers(this, _totalCapacityGB_initializers, void 0);
                this.usedCapacityGB = (__runInitializers(this, _totalCapacityGB_extraInitializers), __runInitializers(this, _usedCapacityGB_initializers, void 0));
                this.availableCapacityGB = (__runInitializers(this, _usedCapacityGB_extraInitializers), __runInitializers(this, _availableCapacityGB_initializers, void 0));
                this.utilizationPercent = (__runInitializers(this, _availableCapacityGB_extraInitializers), __runInitializers(this, _utilizationPercent_initializers, void 0));
                this.projectedDaysUntilFull = (__runInitializers(this, _utilizationPercent_extraInitializers), __runInitializers(this, _projectedDaysUntilFull_initializers, void 0));
                this.capacityByTier = (__runInitializers(this, _projectedDaysUntilFull_extraInitializers), __runInitializers(this, _capacityByTier_initializers, void 0));
                this.capacityByType = (__runInitializers(this, _capacityByTier_extraInitializers), __runInitializers(this, _capacityByType_initializers, void 0));
                __runInitializers(this, _capacityByType_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _totalCapacityGB_decorators = [ApiProperty({ description: 'Total capacity GB' }), (0, class_transformer_1.Expose)()];
            _usedCapacityGB_decorators = [ApiProperty({ description: 'Used capacity GB' }), (0, class_transformer_1.Expose)()];
            _availableCapacityGB_decorators = [ApiProperty({ description: 'Available capacity GB' }), (0, class_transformer_1.Expose)()];
            _utilizationPercent_decorators = [ApiProperty({ description: 'Utilization percentage' }), (0, class_transformer_1.Expose)()];
            _projectedDaysUntilFull_decorators = [ApiProperty({ description: 'Projected days until full' }), (0, class_transformer_1.Expose)()];
            _capacityByTier_decorators = [ApiProperty({ description: 'Capacity by tier' }), (0, class_transformer_1.Expose)()];
            _capacityByType_decorators = [ApiProperty({ description: 'Capacity by volume type' }), (0, class_transformer_1.Expose)()];
            __esDecorate(null, null, _totalCapacityGB_decorators, { kind: "field", name: "totalCapacityGB", static: false, private: false, access: { has: obj => "totalCapacityGB" in obj, get: obj => obj.totalCapacityGB, set: (obj, value) => { obj.totalCapacityGB = value; } }, metadata: _metadata }, _totalCapacityGB_initializers, _totalCapacityGB_extraInitializers);
            __esDecorate(null, null, _usedCapacityGB_decorators, { kind: "field", name: "usedCapacityGB", static: false, private: false, access: { has: obj => "usedCapacityGB" in obj, get: obj => obj.usedCapacityGB, set: (obj, value) => { obj.usedCapacityGB = value; } }, metadata: _metadata }, _usedCapacityGB_initializers, _usedCapacityGB_extraInitializers);
            __esDecorate(null, null, _availableCapacityGB_decorators, { kind: "field", name: "availableCapacityGB", static: false, private: false, access: { has: obj => "availableCapacityGB" in obj, get: obj => obj.availableCapacityGB, set: (obj, value) => { obj.availableCapacityGB = value; } }, metadata: _metadata }, _availableCapacityGB_initializers, _availableCapacityGB_extraInitializers);
            __esDecorate(null, null, _utilizationPercent_decorators, { kind: "field", name: "utilizationPercent", static: false, private: false, access: { has: obj => "utilizationPercent" in obj, get: obj => obj.utilizationPercent, set: (obj, value) => { obj.utilizationPercent = value; } }, metadata: _metadata }, _utilizationPercent_initializers, _utilizationPercent_extraInitializers);
            __esDecorate(null, null, _projectedDaysUntilFull_decorators, { kind: "field", name: "projectedDaysUntilFull", static: false, private: false, access: { has: obj => "projectedDaysUntilFull" in obj, get: obj => obj.projectedDaysUntilFull, set: (obj, value) => { obj.projectedDaysUntilFull = value; } }, metadata: _metadata }, _projectedDaysUntilFull_initializers, _projectedDaysUntilFull_extraInitializers);
            __esDecorate(null, null, _capacityByTier_decorators, { kind: "field", name: "capacityByTier", static: false, private: false, access: { has: obj => "capacityByTier" in obj, get: obj => obj.capacityByTier, set: (obj, value) => { obj.capacityByTier = value; } }, metadata: _metadata }, _capacityByTier_initializers, _capacityByTier_extraInitializers);
            __esDecorate(null, null, _capacityByType_decorators, { kind: "field", name: "capacityByType", static: false, private: false, access: { has: obj => "capacityByType" in obj, get: obj => obj.capacityByType, set: (obj, value) => { obj.capacityByType = value; } }, metadata: _metadata }, _capacityByType_initializers, _capacityByType_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CapacityReportDto = CapacityReportDto;
// ============================================================================
// CUSTOM PARAMETER DECORATORS
// ============================================================================
/**
 * Extracts SAN audit context from request
 */
exports.SanAuditContext = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return {
        userId: request.user?.id,
        organizationId: request.user?.organizationId,
        requestId: request.headers['x-request-id'] || `req-${Date.now()}`,
        ipAddress: request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
            request.ip ||
            'unknown',
    };
});
/**
 * Extracts storage array ID from headers
 */
exports.StorageArrayId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-storage-array-id'];
});
// ============================================================================
// CUSTOM ROUTE DECORATORS
// ============================================================================
/**
 * Decorator for SAN controller endpoints with audit logging
 */
function SanApiOperation(summary, description) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary, description }), (0, common_1.SetMetadata)('san:audit', true), (0, common_1.SetMetadata)('san:operation', summary));
}
/**
 * Decorator for volume management endpoints
 */
function VolumeEndpoint(summary) {
    return (0, common_1.applyDecorators)(SanApiOperation(summary), (0, swagger_1.ApiTags)('SAN - Volumes'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal Server Error' }));
}
/**
 * Decorator for LUN management endpoints
 */
function LunEndpoint(summary) {
    return (0, common_1.applyDecorators)(SanApiOperation(summary), (0, swagger_1.ApiTags)('SAN - LUNs'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal Server Error' }));
}
/**
 * Decorator for snapshot management endpoints
 */
function SnapshotEndpoint(summary) {
    return (0, common_1.applyDecorators)(SanApiOperation(summary), (0, swagger_1.ApiTags)('SAN - Snapshots'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal Server Error' }));
}
/**
 * Decorator for replication management endpoints
 */
function ReplicationEndpoint(summary) {
    return (0, common_1.applyDecorators)(SanApiOperation(summary), (0, swagger_1.ApiTags)('SAN - Replication'), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal Server Error' }));
}
// ============================================================================
// CONTROLLER UTILITY FUNCTIONS
// ============================================================================
/**
 * 1. Creates paginated response for SAN resources
 */
function createSanPaginatedResponse(data, total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
}
/**
 * 2. Validates volume creation parameters
 */
function validateVolumeCreation(dto) {
    // Validate size constraints based on type
    if (dto.type === VolumeType.THIN && dto.sizeGB > 50000) {
        throw new common_1.BadRequestException('Thin volumes cannot exceed 50TB');
    }
    // Validate tier and RAID compatibility
    if (dto.tier === StorageTier.TIER_0 && dto.raidLevel === RaidLevel.RAID_5) {
        throw new common_1.BadRequestException('RAID 5 is not recommended for Tier 0 storage');
    }
    // Validate deduplication only on supported types
    if (dto.deduplication && dto.type !== VolumeType.DEDUP) {
        throw new common_1.BadRequestException('Deduplication requires DEDUP volume type');
    }
}
/**
 * 3. Validates volume expansion request
 */
function validateVolumeExpansion(currentSizeGB, newSizeGB, maxSizeGB = 100000) {
    if (newSizeGB <= currentSizeGB) {
        throw new common_1.BadRequestException('New size must be larger than current size');
    }
    if (newSizeGB > maxSizeGB) {
        throw new common_1.BadRequestException(`Volume size cannot exceed ${maxSizeGB}GB`);
    }
    const expansionPercent = ((newSizeGB - currentSizeGB) / currentSizeGB) * 100;
    if (expansionPercent > 500) {
        throw new common_1.BadRequestException('Volume expansion cannot exceed 500% of current size');
    }
}
/**
 * 4. Validates LUN creation parameters
 */
function validateLunCreation(dto) {
    // Validate LUN size
    if (dto.sizeGB > 10000) {
        throw new common_1.BadRequestException('LUN size cannot exceed 10TB');
    }
    // Validate protocol-specific constraints
    if (dto.protocol === LunProtocol.ISCSI && dto.hostGroups.length === 0) {
        throw new common_1.BadRequestException('iSCSI LUNs require at least one host group');
    }
    // Validate LUN ID range
    if (dto.lunId !== undefined && (dto.lunId < 0 || dto.lunId > 255)) {
        throw new common_1.BadRequestException('LUN ID must be between 0 and 255');
    }
}
/**
 * 5. Validates LUN mapping to host groups
 */
function validateLunMapping(hostGroups, availableGroups) {
    if (hostGroups.length === 0) {
        throw new common_1.BadRequestException('At least one host group is required');
    }
    const invalidGroups = hostGroups.filter((group) => !availableGroups.includes(group));
    if (invalidGroups.length > 0) {
        throw new common_1.BadRequestException(`Invalid host groups: ${invalidGroups.join(', ')}`);
    }
}
/**
 * 6. Validates snapshot creation parameters
 */
function validateSnapshotCreation(dto) {
    // Validate retention period
    if (dto.retentionDays && (dto.retentionDays < 1 || dto.retentionDays > 3650)) {
        throw new common_1.BadRequestException('Retention period must be between 1 and 3650 days');
    }
    // Validate snapshot naming convention
    const namePattern = /^[a-zA-Z0-9][a-zA-Z0-9-_]*[a-zA-Z0-9]$/;
    if (!namePattern.test(dto.name)) {
        throw new common_1.BadRequestException('Snapshot name must start and end with alphanumeric characters');
    }
}
/**
 * 7. Calculates snapshot expiration date
 */
function calculateSnapshotExpiration(createdAt, retentionDays) {
    const expirationDate = new Date(createdAt);
    expirationDate.setDate(expirationDate.getDate() + retentionDays);
    return expirationDate;
}
/**
 * 8. Validates replication configuration
 */
function validateReplicationConfig(dto) {
    // Validate source and target are different
    if (dto.sourceVolumeId === dto.targetVolumeId) {
        throw new common_1.BadRequestException('Source and target volumes must be different');
    }
    // Validate sync interval for async mode
    if (dto.mode === ReplicationMode.ASYNCHRONOUS && !dto.syncIntervalMinutes) {
        throw new common_1.BadRequestException('Sync interval is required for asynchronous replication');
    }
    // Validate sync interval range
    if (dto.syncIntervalMinutes &&
        (dto.syncIntervalMinutes < 5 || dto.syncIntervalMinutes > 1440)) {
        throw new common_1.BadRequestException('Sync interval must be between 5 and 1440 minutes');
    }
}
/**
 * 9. Calculates replication next sync time
 */
function calculateNextSyncTime(lastSyncAt, intervalMinutes) {
    const nextSync = new Date(lastSyncAt);
    nextSync.setMinutes(nextSync.getMinutes() + intervalMinutes);
    return nextSync;
}
/**
 * 10. Validates storage tier migration
 */
function validateTierMigration(currentTier, targetTier, volumeType) {
    // Prevent downgrade for certain volume types
    if (volumeType === VolumeType.DEDUP && targetTier === StorageTier.TIER_3) {
        throw new common_1.BadRequestException('Dedup volumes cannot be migrated to Tier 3');
    }
    // Validate tier order
    const tierOrder = [StorageTier.TIER_0, StorageTier.TIER_1, StorageTier.TIER_2, StorageTier.TIER_3];
    const currentIndex = tierOrder.indexOf(currentTier);
    const targetIndex = tierOrder.indexOf(targetTier);
    if (Math.abs(currentIndex - targetIndex) > 2) {
        throw new common_1.BadRequestException('Cannot skip more than 2 tiers in migration');
    }
}
/**
 * 11. Calculates volume utilization percentage
 */
function calculateVolumeUtilization(usedGB, totalGB) {
    if (totalGB === 0)
        return 0;
    return Math.round((usedGB / totalGB) * 100 * 100) / 100; // Round to 2 decimals
}
/**
 * 12. Generates volume health status
 */
function determineVolumeHealth(status, utilizationPercent, performanceMetrics) {
    if (status === VolumeStatus.FAILED)
        return 'failed';
    if (status === VolumeStatus.DEGRADED)
        return 'critical';
    if (utilizationPercent > 95)
        return 'critical';
    if (utilizationPercent > 85)
        return 'warning';
    if (performanceMetrics && performanceMetrics.latencyReadMs > 50)
        return 'warning';
    return 'healthy';
}
/**
 * 13. Validates performance metrics query
 */
function validatePerformanceQuery(dto) {
    if (dto.startTime && dto.endTime) {
        const start = new Date(dto.startTime);
        const end = new Date(dto.endTime);
        if (start >= end) {
            throw new common_1.BadRequestException('Start time must be before end time');
        }
        const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays > 90) {
            throw new common_1.BadRequestException('Time range cannot exceed 90 days');
        }
    }
}
/**
 * 14. Calculates average performance metrics
 */
function calculateAverageMetrics(metrics) {
    if (metrics.length === 0)
        return null;
    const sum = metrics.reduce((acc, m) => ({
        iopsRead: acc.iopsRead + m.iopsRead,
        iopsWrite: acc.iopsWrite + m.iopsWrite,
        throughputReadMBps: acc.throughputReadMBps + m.throughputReadMBps,
        throughputWriteMBps: acc.throughputWriteMBps + m.throughputWriteMBps,
        latencyReadMs: acc.latencyReadMs + m.latencyReadMs,
        latencyWriteMs: acc.latencyWriteMs + m.latencyWriteMs,
        queueDepth: acc.queueDepth + m.queueDepth,
        cpuUtilization: acc.cpuUtilization + m.cpuUtilization,
    }), {
        iopsRead: 0,
        iopsWrite: 0,
        throughputReadMBps: 0,
        throughputWriteMBps: 0,
        latencyReadMs: 0,
        latencyWriteMs: 0,
        queueDepth: 0,
        cpuUtilization: 0,
    });
    const count = metrics.length;
    return {
        resourceId: metrics[0].resourceId,
        resourceType: metrics[0].resourceType,
        timestamp: new Date(),
        iopsRead: Math.round(sum.iopsRead / count),
        iopsWrite: Math.round(sum.iopsWrite / count),
        throughputReadMBps: Math.round((sum.throughputReadMBps / count) * 100) / 100,
        throughputWriteMBps: Math.round((sum.throughputWriteMBps / count) * 100) / 100,
        latencyReadMs: Math.round((sum.latencyReadMs / count) * 100) / 100,
        latencyWriteMs: Math.round((sum.latencyWriteMs / count) * 100) / 100,
        queueDepth: Math.round(sum.queueDepth / count),
        cpuUtilization: Math.round((sum.cpuUtilization / count) * 100) / 100,
    };
}
/**
 * 15. Generates capacity forecast
 */
function generateCapacityForecast(currentUsedGB, totalGB, dailyGrowthGB) {
    const availableGB = totalGB - currentUsedGB;
    if (dailyGrowthGB <= 0 || availableGB <= 0)
        return -1;
    return Math.floor(availableGB / dailyGrowthGB);
}
/**
 * 16. Validates RAID level for volume size
 */
function validateRaidForVolumeSize(raidLevel, sizeGB, diskCount) {
    // Minimum disk requirements
    const minDisks = {
        [RaidLevel.RAID_0]: 2,
        [RaidLevel.RAID_1]: 2,
        [RaidLevel.RAID_5]: 3,
        [RaidLevel.RAID_6]: 4,
        [RaidLevel.RAID_10]: 4,
        [RaidLevel.RAID_50]: 6,
    };
    if (diskCount < minDisks[raidLevel]) {
        throw new common_1.BadRequestException(`${raidLevel} requires at least ${minDisks[raidLevel]} disks`);
    }
    // Size limitations
    if (raidLevel === RaidLevel.RAID_0 && sizeGB > 10000) {
        throw new common_1.BadRequestException('RAID 0 volumes should not exceed 10TB for safety');
    }
}
/**
 * 17. Calculates RAID usable capacity
 */
function calculateRaidUsableCapacity(raidLevel, diskSizeGB, diskCount) {
    switch (raidLevel) {
        case RaidLevel.RAID_0:
            return diskSizeGB * diskCount;
        case RaidLevel.RAID_1:
            return diskSizeGB * (diskCount / 2);
        case RaidLevel.RAID_5:
            return diskSizeGB * (diskCount - 1);
        case RaidLevel.RAID_6:
            return diskSizeGB * (diskCount - 2);
        case RaidLevel.RAID_10:
            return diskSizeGB * (diskCount / 2);
        case RaidLevel.RAID_50:
            return diskSizeGB * (diskCount - 2);
        default:
            return 0;
    }
}
/**
 * 18. Validates snapshot restore operation
 */
function validateSnapshotRestore(snapshotStatus, targetVolumeStatus) {
    if (snapshotStatus !== SnapshotStatus.ACTIVE) {
        throw new common_1.BadRequestException('Can only restore from active snapshots');
    }
    if (targetVolumeStatus !== VolumeStatus.ONLINE &&
        targetVolumeStatus !== VolumeStatus.OFFLINE) {
        throw new common_1.BadRequestException('Target volume must be online or offline for restore');
    }
}
/**
 * 19. Calculates snapshot space savings
 */
function calculateSnapshotSavings(originalSizeGB, actualSizeGB) {
    const savingsGB = originalSizeGB - actualSizeGB;
    const savingsPercent = (savingsGB / originalSizeGB) * 100;
    return {
        savingsGB: Math.round(savingsGB * 100) / 100,
        savingsPercent: Math.round(savingsPercent * 100) / 100,
    };
}
/**
 * 20. Validates volume deletion
 */
function validateVolumeDeletion(volumeStatus, hasSnapshots, hasLuns, hasReplications) {
    if (volumeStatus === VolumeStatus.CREATING || volumeStatus === VolumeStatus.DELETING) {
        throw new common_1.ConflictException('Volume is currently being created or deleted');
    }
    if (hasLuns) {
        throw new common_1.ConflictException('Cannot delete volume with active LUNs');
    }
    if (hasReplications) {
        throw new common_1.ConflictException('Cannot delete volume with active replications');
    }
    if (hasSnapshots) {
        throw new common_1.ConflictException('Cannot delete volume with snapshots. Delete snapshots first.');
    }
}
/**
 * 21. Generates SAN audit log entry
 */
function createSanAuditLog(operation, resourceType, resourceId, metadata, success, errorMessage) {
    return {
        operation,
        resourceType,
        resourceId,
        userId: metadata.userId || 'system',
        organizationId: metadata.organizationId,
        requestId: metadata.requestId || 'unknown',
        ipAddress: metadata.ipAddress || 'unknown',
        success,
        errorMessage,
        timestamp: new Date(),
    };
}
/**
 * 22. Validates storage array connectivity
 */
function validateStorageArrayConnection(arrayId, availableArrays) {
    if (!availableArrays.includes(arrayId)) {
        throw new common_1.NotFoundException(`Storage array ${arrayId} not found or unavailable`);
    }
}
/**
 * 23. Calculates replication bandwidth requirements
 */
function calculateReplicationBandwidth(volumeSizeGB, changeRatePercent, syncIntervalMinutes) {
    const dailyChangeGB = (volumeSizeGB * changeRatePercent) / 100;
    const changePerSyncGB = (dailyChangeGB / (24 * 60)) * syncIntervalMinutes;
    const requiredMBps = (changePerSyncGB * 1024) / (syncIntervalMinutes * 60);
    return {
        requiredMBps: Math.round(requiredMBps * 100) / 100,
        dailyDataGB: Math.round(dailyChangeGB * 100) / 100,
    };
}
/**
 * 24. Validates thin provisioning over-commitment
 */
function validateThinProvisioningRatio(totalProvisionedGB, totalPhysicalGB, maxRatio = 3) {
    const ratio = totalProvisionedGB / totalPhysicalGB;
    if (ratio > maxRatio) {
        throw new common_1.BadRequestException(`Thin provisioning ratio ${ratio.toFixed(2)}:1 exceeds maximum ${maxRatio}:1`);
    }
}
/**
 * 25. Generates storage efficiency report
 */
function generateEfficiencyReport(totalPhysicalGB, totalUsedGB, deduplicationSavingsGB, compressionSavingsGB) {
    const logicalUsage = totalUsedGB + deduplicationSavingsGB + compressionSavingsGB;
    const deduplicationRatio = logicalUsage / (logicalUsage - deduplicationSavingsGB);
    const compressionRatio = (logicalUsage - deduplicationSavingsGB) /
        (logicalUsage - deduplicationSavingsGB - compressionSavingsGB);
    const overallEfficiency = logicalUsage / totalUsedGB;
    return {
        physicalUsage: totalUsedGB,
        logicalUsage,
        deduplicationRatio: Math.round(deduplicationRatio * 100) / 100,
        compressionRatio: Math.round(compressionRatio * 100) / 100,
        overallEfficiency: Math.round(overallEfficiency * 100) / 100,
    };
}
/**
 * 26. Validates QoS (Quality of Service) settings
 */
function validateQoSSettings(minIOPS, maxIOPS, minThroughputMBps, maxThroughputMBps) {
    if (minIOPS > maxIOPS) {
        throw new common_1.BadRequestException('Minimum IOPS cannot exceed maximum IOPS');
    }
    if (minThroughputMBps > maxThroughputMBps) {
        throw new common_1.BadRequestException('Minimum throughput cannot exceed maximum throughput');
    }
    if (maxIOPS > 1000000) {
        throw new common_1.BadRequestException('Maximum IOPS cannot exceed 1,000,000');
    }
    if (maxThroughputMBps > 10000) {
        throw new common_1.BadRequestException('Maximum throughput cannot exceed 10,000 MB/s');
    }
}
/**
 * 27. Generates volume clone validation
 */
function validateVolumeClone(sourceVolumeId, sourceStatus, targetName, existingVolumeNames) {
    if (sourceStatus !== VolumeStatus.ONLINE) {
        throw new common_1.BadRequestException('Source volume must be online to clone');
    }
    if (existingVolumeNames.includes(targetName)) {
        throw new common_1.ConflictException(`Volume with name ${targetName} already exists`);
    }
}
/**
 * 28. Calculates optimal snapshot schedule
 */
function calculateSnapshotSchedule(changeRateGB, availableSnapshotSpaceGB, retentionDays) {
    const dailySnapshots = Math.max(1, Math.floor(24 / Math.ceil(changeRateGB / 10)));
    const intervalHours = 24 / dailySnapshots;
    const maxSnapshots = Math.floor(availableSnapshotSpaceGB / (changeRateGB * (retentionDays / dailySnapshots)));
    return {
        intervalHours: Math.round(intervalHours),
        maxSnapshots,
    };
}
/**
 * 29. Validates multipath configuration
 */
function validateMultipathConfig(pathCount, protocol) {
    if (pathCount < 2) {
        throw new common_1.BadRequestException('Multipath requires at least 2 paths for redundancy');
    }
    if (protocol === LunProtocol.ISCSI && pathCount > 8) {
        throw new common_1.BadRequestException('iSCSI supports maximum 8 paths');
    }
    if (protocol === LunProtocol.FC && pathCount > 16) {
        throw new common_1.BadRequestException('FC supports maximum 16 paths');
    }
}
/**
 * 30. Generates disaster recovery readiness score
 */
function calculateDRReadiness(hasReplication, replicationStatus, snapshotCount, lastBackupAge) {
    let score = 0;
    if (hasReplication && replicationStatus === ReplicationStatus.SYNCHRONIZED) {
        score += 40;
    }
    else if (hasReplication) {
        score += 20;
    }
    if (snapshotCount >= 7) {
        score += 30;
    }
    else if (snapshotCount >= 3) {
        score += 20;
    }
    else if (snapshotCount >= 1) {
        score += 10;
    }
    if (lastBackupAge <= 24) {
        score += 30;
    }
    else if (lastBackupAge <= 48) {
        score += 20;
    }
    else if (lastBackupAge <= 168) {
        score += 10;
    }
    let status;
    if (score >= 80)
        status = 'excellent';
    else if (score >= 60)
        status = 'good';
    else if (score >= 40)
        status = 'fair';
    else
        status = 'poor';
    return { score, status };
}
/**
 * 31. Validates storage migration plan
 */
function validateMigrationPlan(sourceVolumeSize, targetArrayCapacity, estimatedMigrationHours, allowedDowntime) {
    const requiredCapacity = sourceVolumeSize * 1.2; // 20% buffer
    if (targetArrayCapacity < requiredCapacity) {
        throw new common_1.BadRequestException(`Target array needs ${requiredCapacity}GB (including 20% buffer), has ${targetArrayCapacity}GB`);
    }
    if (estimatedMigrationHours > allowedDowntime) {
        throw new common_1.BadRequestException(`Estimated migration time ${estimatedMigrationHours}h exceeds allowed downtime ${allowedDowntime}h`);
    }
}
/**
 * 32. Calculates storage TCO (Total Cost of Ownership)
 */
function calculateStorageTCO(capacityGB, tier, years) {
    // Cost per GB per year by tier (example values)
    const tierCosts = {
        [StorageTier.TIER_0]: 5.0,
        [StorageTier.TIER_1]: 2.5,
        [StorageTier.TIER_2]: 1.0,
        [StorageTier.TIER_3]: 0.5,
    };
    const costPerGB = tierCosts[tier];
    const hardwareCost = capacityGB * costPerGB * years;
    const maintenanceCost = hardwareCost * 0.15; // 15% maintenance
    const powerCost = capacityGB * 0.05 * years; // Power cost
    const totalCost = hardwareCost + maintenanceCost + powerCost;
    return {
        hardwareCost: Math.round(hardwareCost * 100) / 100,
        maintenanceCost: Math.round(maintenanceCost * 100) / 100,
        powerCost: Math.round(powerCost * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        costPerGBPerYear: Math.round((totalCost / capacityGB / years) * 100) / 100,
    };
}
/**
 * 33. Validates storage array firmware version
 */
function validateFirmwareVersion(currentVersion, minimumVersion, operation) {
    const current = currentVersion.split('.').map(Number);
    const minimum = minimumVersion.split('.').map(Number);
    for (let i = 0; i < Math.max(current.length, minimum.length); i++) {
        const c = current[i] || 0;
        const m = minimum[i] || 0;
        if (c < m) {
            throw new common_1.BadRequestException(`Operation '${operation}' requires firmware version ${minimumVersion} or higher. Current: ${currentVersion}`);
        }
        if (c > m)
            break;
    }
}
/**
 * 34. Generates storage health check report
 */
function generateHealthCheckReport(volumes, performanceIssues, capacityWarnings, failedComponents) {
    const healthyVolumes = volumes.filter((v) => v.status === VolumeStatus.ONLINE).length;
    const volumeHealth = (healthyVolumes / volumes.length) * 100;
    const performanceHealth = Math.max(0, 100 - performanceIssues * 10);
    const capacityHealth = Math.max(0, 100 - capacityWarnings * 15);
    const overallScore = (volumeHealth + performanceHealth + capacityHealth) / 3;
    let overallHealth;
    if (overallScore >= 80 && failedComponents === 0)
        overallHealth = 'healthy';
    else if (overallScore >= 60 && failedComponents < 2)
        overallHealth = 'degraded';
    else
        overallHealth = 'critical';
    const recommendations = [];
    if (volumeHealth < 90)
        recommendations.push('Check and repair degraded volumes');
    if (performanceIssues > 0)
        recommendations.push('Investigate performance bottlenecks');
    if (capacityWarnings > 0)
        recommendations.push('Plan capacity expansion');
    if (failedComponents > 0)
        recommendations.push('Replace failed hardware components');
    return {
        overallHealth,
        volumeHealth: Math.round(volumeHealth),
        performanceHealth: Math.round(performanceHealth),
        capacityHealth: Math.round(capacityHealth),
        recommendations,
    };
}
/**
 * 35. Validates and sanitizes volume name
 */
function sanitizeVolumeName(name, maxLength = 64) {
    // Remove invalid characters
    let sanitized = name
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    // Ensure it starts with alphanumeric
    if (!/^[a-z0-9]/.test(sanitized)) {
        sanitized = 'vol-' + sanitized;
    }
    // Truncate if needed
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }
    // Ensure minimum length
    if (sanitized.length < 3) {
        throw new common_1.BadRequestException('Volume name too short after sanitization');
    }
    return sanitized;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Enums
    VolumeType,
    VolumeStatus,
    LunProtocol,
    SnapshotStatus,
    ReplicationStatus,
    ReplicationMode,
    StorageTier,
    RaidLevel,
    // DTOs
    CreateVolumeDto,
    UpdateVolumeDto,
    CreateLunDto,
    UpdateLunDto,
    CreateSnapshotDto,
    CreateReplicationDto,
    VolumeQueryDto,
    PerformanceQueryDto,
    VolumeResponseDto,
    LunResponseDto,
    SnapshotResponseDto,
    ReplicationResponseDto,
    PaginatedResponseDto,
    PerformanceMetricsDto,
    CapacityReportDto,
    // Decorators
    SanAuditContext: exports.SanAuditContext,
    StorageArrayId: exports.StorageArrayId,
    VolumeEndpoint,
    LunEndpoint,
    SnapshotEndpoint,
    ReplicationEndpoint,
    SanApiOperation,
    // Utility Functions (35 total)
    createSanPaginatedResponse,
    validateVolumeCreation,
    validateVolumeExpansion,
    validateLunCreation,
    validateLunMapping,
    validateSnapshotCreation,
    calculateSnapshotExpiration,
    validateReplicationConfig,
    calculateNextSyncTime,
    validateTierMigration,
    calculateVolumeUtilization,
    determineVolumeHealth,
    validatePerformanceQuery,
    calculateAverageMetrics,
    generateCapacityForecast,
    validateRaidForVolumeSize,
    calculateRaidUsableCapacity,
    validateSnapshotRestore,
    calculateSnapshotSavings,
    validateVolumeDeletion,
    createSanAuditLog,
    validateStorageArrayConnection,
    calculateReplicationBandwidth,
    validateThinProvisioningRatio,
    generateEfficiencyReport,
    validateQoSSettings,
    validateVolumeClone,
    calculateSnapshotSchedule,
    validateMultipathConfig,
    calculateDRReadiness,
    validateMigrationPlan,
    calculateStorageTCO,
    validateFirmwareVersion,
    generateHealthCheckReport,
    sanitizeVolumeName,
};
// Add ApiProperty decorator import
function ApiProperty(options) {
    return (target, propertyKey) => {
        // Placeholder for actual implementation
    };
}
//# sourceMappingURL=san-api-controllers-kit.js.map