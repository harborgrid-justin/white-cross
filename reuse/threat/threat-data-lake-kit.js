"use strict";
/**
 * LOC: TDLAKE1234567
 * File: /reuse/threat/threat-data-lake-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence data services
 *   - Big data analytics modules
 *   - Data retention services
 *   - Query optimization services
 *   - Threat archival services
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
exports.formatDuration = exports.formatBytes = exports.generateOptimizationReport = exports.monitorDataLakeHealth = exports.calculateDataLakeStatistics = exports.identifyDuplicatePartitions = exports.deduplicateData = exports.decompressPartition = exports.compressPartition = exports.createMaterializedView = exports.analyzeQueryPerformance = exports.generateOptimizedQueryPlan = exports.estimateStorageCosts = exports.restoreArchivedData = exports.archivePartitions = exports.applyRetentionPolicy = exports.rebalanceShards = exports.splitPartition = exports.mergePartitions = exports.createPartition = exports.aggregateTimeSeriesData = exports.queryTimeSeriesData = exports.determinePartition = exports.ingestTimeSeriesData = exports.calculateOptimalShardCount = exports.generatePartitionKey = exports.validateDataLakeConfig = exports.createDataLakeConfig = exports.ThreatArchiveOperation = exports.ThreatTimeSeriesData = exports.ThreatDataPartition = exports.ThreatDataLakeConfig = exports.CompressionAlgorithm = exports.ShardStrategy = exports.PartitionStrategy = exports.StorageTier = void 0;
/**
 * File: /reuse/threat/threat-data-lake-kit.ts
 * Locator: WC-THREAT-DATALAKE-001
 * Purpose: Comprehensive Threat Data Lake Toolkit - Production-ready big data threat intelligence storage
 *
 * Upstream: Independent utility module for threat intelligence data lake operations
 * Downstream: ../backend/*, Data lake services, Analytics, Time-series storage, Query optimization
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript
 * Exports: 40 utility functions for data lake architecture, partitioning, sharding, retention, archival
 *
 * LLM Context: Enterprise-grade threat data lake toolkit for White Cross healthcare platform.
 * Provides comprehensive big data storage for threat intelligence, time-series data management,
 * partitioning and sharding strategies, high-volume data ingestion, retention policies, archival
 * strategies, query optimization for large datasets, data compression, deduplication, and
 * HIPAA-compliant threat data storage for healthcare systems. Includes Sequelize models for
 * data lake tables with advanced TypeScript type safety and performance optimization.
 */
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Data lake storage tier
 */
var StorageTier;
(function (StorageTier) {
    StorageTier["HOT"] = "HOT";
    StorageTier["WARM"] = "WARM";
    StorageTier["COLD"] = "COLD";
    StorageTier["FROZEN"] = "FROZEN";
})(StorageTier || (exports.StorageTier = StorageTier = {}));
/**
 * Partitioning strategy
 */
var PartitionStrategy;
(function (PartitionStrategy) {
    PartitionStrategy["TIME_BASED"] = "TIME_BASED";
    PartitionStrategy["HASH_BASED"] = "HASH_BASED";
    PartitionStrategy["RANGE_BASED"] = "RANGE_BASED";
    PartitionStrategy["LIST_BASED"] = "LIST_BASED";
    PartitionStrategy["COMPOSITE"] = "COMPOSITE";
})(PartitionStrategy || (exports.PartitionStrategy = PartitionStrategy = {}));
/**
 * Sharding strategy
 */
var ShardStrategy;
(function (ShardStrategy) {
    ShardStrategy["CONSISTENT_HASH"] = "CONSISTENT_HASH";
    ShardStrategy["RANGE_SHARD"] = "RANGE_SHARD";
    ShardStrategy["GEOGRAPHIC"] = "GEOGRAPHIC";
    ShardStrategy["SEVERITY_BASED"] = "SEVERITY_BASED";
    ShardStrategy["SOURCE_BASED"] = "SOURCE_BASED";
})(ShardStrategy || (exports.ShardStrategy = ShardStrategy = {}));
/**
 * Compression algorithm
 */
var CompressionAlgorithm;
(function (CompressionAlgorithm) {
    CompressionAlgorithm["NONE"] = "NONE";
    CompressionAlgorithm["GZIP"] = "GZIP";
    CompressionAlgorithm["BROTLI"] = "BROTLI";
    CompressionAlgorithm["ZSTD"] = "ZSTD";
    CompressionAlgorithm["LZ4"] = "LZ4";
    CompressionAlgorithm["SNAPPY"] = "SNAPPY";
})(CompressionAlgorithm || (exports.CompressionAlgorithm = CompressionAlgorithm = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
let ThreatDataLakeConfig = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'threat_data_lake_configs',
            timestamps: true,
            indexes: [
                { fields: ['name'], unique: true },
                { fields: ['created_at'] },
            ],
        })];
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
    let _storagePath_decorators;
    let _storagePath_initializers = [];
    let _storagePath_extraInitializers = [];
    let _partitionStrategy_decorators;
    let _partitionStrategy_initializers = [];
    let _partitionStrategy_extraInitializers = [];
    let _shardStrategy_decorators;
    let _shardStrategy_initializers = [];
    let _shardStrategy_extraInitializers = [];
    let _compressionAlgorithm_decorators;
    let _compressionAlgorithm_initializers = [];
    let _compressionAlgorithm_extraInitializers = [];
    let _retentionPolicy_decorators;
    let _retentionPolicy_initializers = [];
    let _retentionPolicy_extraInitializers = [];
    let _indexingStrategy_decorators;
    let _indexingStrategy_initializers = [];
    let _indexingStrategy_extraInitializers = [];
    let _replicationFactor_decorators;
    let _replicationFactor_initializers = [];
    let _replicationFactor_extraInitializers = [];
    let _encryptionEnabled_decorators;
    let _encryptionEnabled_initializers = [];
    let _encryptionEnabled_extraInitializers = [];
    let _deduplicationEnabled_decorators;
    let _deduplicationEnabled_initializers = [];
    let _deduplicationEnabled_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ThreatDataLakeConfig = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.storagePath = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _storagePath_initializers, void 0));
            this.partitionStrategy = (__runInitializers(this, _storagePath_extraInitializers), __runInitializers(this, _partitionStrategy_initializers, void 0));
            this.shardStrategy = (__runInitializers(this, _partitionStrategy_extraInitializers), __runInitializers(this, _shardStrategy_initializers, void 0));
            this.compressionAlgorithm = (__runInitializers(this, _shardStrategy_extraInitializers), __runInitializers(this, _compressionAlgorithm_initializers, void 0));
            this.retentionPolicy = (__runInitializers(this, _compressionAlgorithm_extraInitializers), __runInitializers(this, _retentionPolicy_initializers, void 0));
            this.indexingStrategy = (__runInitializers(this, _retentionPolicy_extraInitializers), __runInitializers(this, _indexingStrategy_initializers, void 0));
            this.replicationFactor = (__runInitializers(this, _indexingStrategy_extraInitializers), __runInitializers(this, _replicationFactor_initializers, void 0));
            this.encryptionEnabled = (__runInitializers(this, _replicationFactor_extraInitializers), __runInitializers(this, _encryptionEnabled_initializers, void 0));
            this.deduplicationEnabled = (__runInitializers(this, _encryptionEnabled_extraInitializers), __runInitializers(this, _deduplicationEnabled_initializers, void 0));
            this.metadata = (__runInitializers(this, _deduplicationEnabled_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ThreatDataLakeConfig");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'dl_123456', description: 'Unique data lake identifier' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, primaryKey: true })];
        _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Production Threat Intelligence Lake', description: 'Data lake name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, unique: true })];
        _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Primary threat intelligence storage', description: 'Data lake description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _storagePath_decorators = [(0, swagger_1.ApiProperty)({ example: '/data/threat-lake', description: 'Storage path' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'storage_path' })];
        _partitionStrategy_decorators = [(0, swagger_1.ApiProperty)({ enum: PartitionStrategy, example: PartitionStrategy.TIME_BASED }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'partition_strategy' })];
        _shardStrategy_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: ShardStrategy, example: ShardStrategy.CONSISTENT_HASH }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'shard_strategy' })];
        _compressionAlgorithm_decorators = [(0, swagger_1.ApiProperty)({ enum: CompressionAlgorithm, example: CompressionAlgorithm.ZSTD }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'compression_algorithm' })];
        _retentionPolicy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Retention policy configuration' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, field: 'retention_policy' })];
        _indexingStrategy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Indexing strategy configuration' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, field: 'indexing_strategy' })];
        _replicationFactor_decorators = [(0, swagger_1.ApiProperty)({ example: 3, description: 'Replication factor' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 3, field: 'replication_factor' })];
        _encryptionEnabled_decorators = [(0, swagger_1.ApiProperty)({ example: true, description: 'Encryption enabled' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: true, field: 'encryption_enabled' })];
        _deduplicationEnabled_decorators = [(0, swagger_1.ApiProperty)({ example: true, description: 'Deduplication enabled' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false, defaultValue: true, field: 'deduplication_enabled' })];
        _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: {} })];
        _createdAt_decorators = [(0, swagger_1.ApiProperty)(), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, field: 'created_at' })];
        _updatedAt_decorators = [(0, swagger_1.ApiProperty)(), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, field: 'updated_at' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _storagePath_decorators, { kind: "field", name: "storagePath", static: false, private: false, access: { has: obj => "storagePath" in obj, get: obj => obj.storagePath, set: (obj, value) => { obj.storagePath = value; } }, metadata: _metadata }, _storagePath_initializers, _storagePath_extraInitializers);
        __esDecorate(null, null, _partitionStrategy_decorators, { kind: "field", name: "partitionStrategy", static: false, private: false, access: { has: obj => "partitionStrategy" in obj, get: obj => obj.partitionStrategy, set: (obj, value) => { obj.partitionStrategy = value; } }, metadata: _metadata }, _partitionStrategy_initializers, _partitionStrategy_extraInitializers);
        __esDecorate(null, null, _shardStrategy_decorators, { kind: "field", name: "shardStrategy", static: false, private: false, access: { has: obj => "shardStrategy" in obj, get: obj => obj.shardStrategy, set: (obj, value) => { obj.shardStrategy = value; } }, metadata: _metadata }, _shardStrategy_initializers, _shardStrategy_extraInitializers);
        __esDecorate(null, null, _compressionAlgorithm_decorators, { kind: "field", name: "compressionAlgorithm", static: false, private: false, access: { has: obj => "compressionAlgorithm" in obj, get: obj => obj.compressionAlgorithm, set: (obj, value) => { obj.compressionAlgorithm = value; } }, metadata: _metadata }, _compressionAlgorithm_initializers, _compressionAlgorithm_extraInitializers);
        __esDecorate(null, null, _retentionPolicy_decorators, { kind: "field", name: "retentionPolicy", static: false, private: false, access: { has: obj => "retentionPolicy" in obj, get: obj => obj.retentionPolicy, set: (obj, value) => { obj.retentionPolicy = value; } }, metadata: _metadata }, _retentionPolicy_initializers, _retentionPolicy_extraInitializers);
        __esDecorate(null, null, _indexingStrategy_decorators, { kind: "field", name: "indexingStrategy", static: false, private: false, access: { has: obj => "indexingStrategy" in obj, get: obj => obj.indexingStrategy, set: (obj, value) => { obj.indexingStrategy = value; } }, metadata: _metadata }, _indexingStrategy_initializers, _indexingStrategy_extraInitializers);
        __esDecorate(null, null, _replicationFactor_decorators, { kind: "field", name: "replicationFactor", static: false, private: false, access: { has: obj => "replicationFactor" in obj, get: obj => obj.replicationFactor, set: (obj, value) => { obj.replicationFactor = value; } }, metadata: _metadata }, _replicationFactor_initializers, _replicationFactor_extraInitializers);
        __esDecorate(null, null, _encryptionEnabled_decorators, { kind: "field", name: "encryptionEnabled", static: false, private: false, access: { has: obj => "encryptionEnabled" in obj, get: obj => obj.encryptionEnabled, set: (obj, value) => { obj.encryptionEnabled = value; } }, metadata: _metadata }, _encryptionEnabled_initializers, _encryptionEnabled_extraInitializers);
        __esDecorate(null, null, _deduplicationEnabled_decorators, { kind: "field", name: "deduplicationEnabled", static: false, private: false, access: { has: obj => "deduplicationEnabled" in obj, get: obj => obj.deduplicationEnabled, set: (obj, value) => { obj.deduplicationEnabled = value; } }, metadata: _metadata }, _deduplicationEnabled_initializers, _deduplicationEnabled_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ThreatDataLakeConfig = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ThreatDataLakeConfig = _classThis;
})();
exports.ThreatDataLakeConfig = ThreatDataLakeConfig;
let ThreatDataPartition = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'threat_data_partitions',
            timestamps: true,
            indexes: [
                { fields: ['table_name', 'partition_key'] },
                { fields: ['tier'] },
                { fields: ['created_at'] },
                { fields: ['last_accessed_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _tableName_decorators;
    let _tableName_initializers = [];
    let _tableName_extraInitializers = [];
    let _partitionKey_decorators;
    let _partitionKey_initializers = [];
    let _partitionKey_extraInitializers = [];
    let _partitionValue_decorators;
    let _partitionValue_initializers = [];
    let _partitionValue_extraInitializers = [];
    let _startRange_decorators;
    let _startRange_initializers = [];
    let _startRange_extraInitializers = [];
    let _endRange_decorators;
    let _endRange_initializers = [];
    let _endRange_extraInitializers = [];
    let _recordCount_decorators;
    let _recordCount_initializers = [];
    let _recordCount_extraInitializers = [];
    let _sizeBytes_decorators;
    let _sizeBytes_initializers = [];
    let _sizeBytes_extraInitializers = [];
    let _tier_decorators;
    let _tier_initializers = [];
    let _tier_extraInitializers = [];
    let _compressionRatio_decorators;
    let _compressionRatio_initializers = [];
    let _compressionRatio_extraInitializers = [];
    let _lastAccessedAt_decorators;
    let _lastAccessedAt_initializers = [];
    let _lastAccessedAt_extraInitializers = [];
    let _archivedAt_decorators;
    let _archivedAt_initializers = [];
    let _archivedAt_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ThreatDataPartition = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.tableName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _tableName_initializers, void 0));
            this.partitionKey = (__runInitializers(this, _tableName_extraInitializers), __runInitializers(this, _partitionKey_initializers, void 0));
            this.partitionValue = (__runInitializers(this, _partitionKey_extraInitializers), __runInitializers(this, _partitionValue_initializers, void 0));
            this.startRange = (__runInitializers(this, _partitionValue_extraInitializers), __runInitializers(this, _startRange_initializers, void 0));
            this.endRange = (__runInitializers(this, _startRange_extraInitializers), __runInitializers(this, _endRange_initializers, void 0));
            this.recordCount = (__runInitializers(this, _endRange_extraInitializers), __runInitializers(this, _recordCount_initializers, void 0));
            this.sizeBytes = (__runInitializers(this, _recordCount_extraInitializers), __runInitializers(this, _sizeBytes_initializers, void 0));
            this.tier = (__runInitializers(this, _sizeBytes_extraInitializers), __runInitializers(this, _tier_initializers, void 0));
            this.compressionRatio = (__runInitializers(this, _tier_extraInitializers), __runInitializers(this, _compressionRatio_initializers, void 0));
            this.lastAccessedAt = (__runInitializers(this, _compressionRatio_extraInitializers), __runInitializers(this, _lastAccessedAt_initializers, void 0));
            this.archivedAt = (__runInitializers(this, _lastAccessedAt_extraInitializers), __runInitializers(this, _archivedAt_initializers, void 0));
            this.createdAt = (__runInitializers(this, _archivedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ThreatDataPartition");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'part_123456', description: 'Unique partition identifier' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, primaryKey: true })];
        _tableName_decorators = [(0, swagger_1.ApiProperty)({ example: 'threat_timeseries_2024_01', description: 'Table name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'table_name' })];
        _partitionKey_decorators = [(0, swagger_1.ApiProperty)({ example: 'month', description: 'Partition key' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'partition_key' })];
        _partitionValue_decorators = [(0, swagger_1.ApiProperty)({ example: '2024-01', description: 'Partition value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'partition_value' })];
        _startRange_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '2024-01-01', description: 'Start range' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'start_range' })];
        _endRange_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '2024-01-31', description: 'End range' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'end_range' })];
        _recordCount_decorators = [(0, swagger_1.ApiProperty)({ example: 1000000, description: 'Record count' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BIGINT, allowNull: false, defaultValue: 0, field: 'record_count' })];
        _sizeBytes_decorators = [(0, swagger_1.ApiProperty)({ example: 536870912, description: 'Size in bytes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BIGINT, allowNull: false, defaultValue: 0, field: 'size_bytes' })];
        _tier_decorators = [(0, swagger_1.ApiProperty)({ enum: StorageTier, example: StorageTier.HOT }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, defaultValue: StorageTier.HOT })];
        _compressionRatio_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 0.65, description: 'Compression ratio' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.FLOAT, field: 'compression_ratio' })];
        _lastAccessedAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Last accessed timestamp' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'last_accessed_at' })];
        _archivedAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Archived timestamp' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'archived_at' })];
        _createdAt_decorators = [(0, swagger_1.ApiProperty)(), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, field: 'created_at' })];
        _updatedAt_decorators = [(0, swagger_1.ApiProperty)(), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, field: 'updated_at' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _tableName_decorators, { kind: "field", name: "tableName", static: false, private: false, access: { has: obj => "tableName" in obj, get: obj => obj.tableName, set: (obj, value) => { obj.tableName = value; } }, metadata: _metadata }, _tableName_initializers, _tableName_extraInitializers);
        __esDecorate(null, null, _partitionKey_decorators, { kind: "field", name: "partitionKey", static: false, private: false, access: { has: obj => "partitionKey" in obj, get: obj => obj.partitionKey, set: (obj, value) => { obj.partitionKey = value; } }, metadata: _metadata }, _partitionKey_initializers, _partitionKey_extraInitializers);
        __esDecorate(null, null, _partitionValue_decorators, { kind: "field", name: "partitionValue", static: false, private: false, access: { has: obj => "partitionValue" in obj, get: obj => obj.partitionValue, set: (obj, value) => { obj.partitionValue = value; } }, metadata: _metadata }, _partitionValue_initializers, _partitionValue_extraInitializers);
        __esDecorate(null, null, _startRange_decorators, { kind: "field", name: "startRange", static: false, private: false, access: { has: obj => "startRange" in obj, get: obj => obj.startRange, set: (obj, value) => { obj.startRange = value; } }, metadata: _metadata }, _startRange_initializers, _startRange_extraInitializers);
        __esDecorate(null, null, _endRange_decorators, { kind: "field", name: "endRange", static: false, private: false, access: { has: obj => "endRange" in obj, get: obj => obj.endRange, set: (obj, value) => { obj.endRange = value; } }, metadata: _metadata }, _endRange_initializers, _endRange_extraInitializers);
        __esDecorate(null, null, _recordCount_decorators, { kind: "field", name: "recordCount", static: false, private: false, access: { has: obj => "recordCount" in obj, get: obj => obj.recordCount, set: (obj, value) => { obj.recordCount = value; } }, metadata: _metadata }, _recordCount_initializers, _recordCount_extraInitializers);
        __esDecorate(null, null, _sizeBytes_decorators, { kind: "field", name: "sizeBytes", static: false, private: false, access: { has: obj => "sizeBytes" in obj, get: obj => obj.sizeBytes, set: (obj, value) => { obj.sizeBytes = value; } }, metadata: _metadata }, _sizeBytes_initializers, _sizeBytes_extraInitializers);
        __esDecorate(null, null, _tier_decorators, { kind: "field", name: "tier", static: false, private: false, access: { has: obj => "tier" in obj, get: obj => obj.tier, set: (obj, value) => { obj.tier = value; } }, metadata: _metadata }, _tier_initializers, _tier_extraInitializers);
        __esDecorate(null, null, _compressionRatio_decorators, { kind: "field", name: "compressionRatio", static: false, private: false, access: { has: obj => "compressionRatio" in obj, get: obj => obj.compressionRatio, set: (obj, value) => { obj.compressionRatio = value; } }, metadata: _metadata }, _compressionRatio_initializers, _compressionRatio_extraInitializers);
        __esDecorate(null, null, _lastAccessedAt_decorators, { kind: "field", name: "lastAccessedAt", static: false, private: false, access: { has: obj => "lastAccessedAt" in obj, get: obj => obj.lastAccessedAt, set: (obj, value) => { obj.lastAccessedAt = value; } }, metadata: _metadata }, _lastAccessedAt_initializers, _lastAccessedAt_extraInitializers);
        __esDecorate(null, null, _archivedAt_decorators, { kind: "field", name: "archivedAt", static: false, private: false, access: { has: obj => "archivedAt" in obj, get: obj => obj.archivedAt, set: (obj, value) => { obj.archivedAt = value; } }, metadata: _metadata }, _archivedAt_initializers, _archivedAt_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ThreatDataPartition = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ThreatDataPartition = _classThis;
})();
exports.ThreatDataPartition = ThreatDataPartition;
let ThreatTimeSeriesData = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'threat_timeseries_data',
            timestamps: false,
            indexes: [
                { fields: ['timestamp'] },
                { fields: ['threat_type', 'severity'] },
                { fields: ['source'] },
                { fields: ['partition_key'] },
                { fields: ['shard_key'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _threatId_decorators;
    let _threatId_initializers = [];
    let _threatId_extraInitializers = [];
    let _threatType_decorators;
    let _threatType_initializers = [];
    let _threatType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _source_decorators;
    let _source_initializers = [];
    let _source_extraInitializers = [];
    let _iocType_decorators;
    let _iocType_initializers = [];
    let _iocType_extraInitializers = [];
    let _iocValue_decorators;
    let _iocValue_initializers = [];
    let _iocValue_extraInitializers = [];
    let _geoLocation_decorators;
    let _geoLocation_initializers = [];
    let _geoLocation_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _partitionKey_decorators;
    let _partitionKey_initializers = [];
    let _partitionKey_extraInitializers = [];
    let _shardKey_decorators;
    let _shardKey_initializers = [];
    let _shardKey_extraInitializers = [];
    var ThreatTimeSeriesData = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.timestamp = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
            this.threatId = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _threatId_initializers, void 0));
            this.threatType = (__runInitializers(this, _threatId_extraInitializers), __runInitializers(this, _threatType_initializers, void 0));
            this.severity = (__runInitializers(this, _threatType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.source = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _source_initializers, void 0));
            this.iocType = (__runInitializers(this, _source_extraInitializers), __runInitializers(this, _iocType_initializers, void 0));
            this.iocValue = (__runInitializers(this, _iocType_extraInitializers), __runInitializers(this, _iocValue_initializers, void 0));
            this.geoLocation = (__runInitializers(this, _iocValue_extraInitializers), __runInitializers(this, _geoLocation_initializers, void 0));
            this.metadata = (__runInitializers(this, _geoLocation_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.partitionKey = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _partitionKey_initializers, void 0));
            this.shardKey = (__runInitializers(this, _partitionKey_extraInitializers), __runInitializers(this, _shardKey_initializers, void 0));
            __runInitializers(this, _shardKey_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ThreatTimeSeriesData");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'ts_123456', description: 'Unique record identifier' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, primaryKey: true })];
        _timestamp_decorators = [(0, swagger_1.ApiProperty)({ description: 'Event timestamp' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _threatId_decorators = [(0, swagger_1.ApiProperty)({ example: 'threat_123', description: 'Threat identifier' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'threat_id' })];
        _threatType_decorators = [(0, swagger_1.ApiProperty)({ example: 'malware', description: 'Threat type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'threat_type' })];
        _severity_decorators = [(0, swagger_1.ApiProperty)({ enum: ['critical', 'high', 'medium', 'low', 'info'], example: 'high' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _source_decorators = [(0, swagger_1.ApiProperty)({ example: 'threat-feed-xyz', description: 'Data source' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _iocType_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'IPV4', description: 'IOC type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'ioc_type' })];
        _iocValue_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '192.168.1.100', description: 'IOC value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'ioc_value' })];
        _geoLocation_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Geographic location data' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, field: 'geo_location' })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, defaultValue: {} })];
        _partitionKey_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '2024-01', description: 'Partition key for sharding' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'partition_key' })];
        _shardKey_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'shard-1', description: 'Shard key for distribution' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'shard_key' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
        __esDecorate(null, null, _threatId_decorators, { kind: "field", name: "threatId", static: false, private: false, access: { has: obj => "threatId" in obj, get: obj => obj.threatId, set: (obj, value) => { obj.threatId = value; } }, metadata: _metadata }, _threatId_initializers, _threatId_extraInitializers);
        __esDecorate(null, null, _threatType_decorators, { kind: "field", name: "threatType", static: false, private: false, access: { has: obj => "threatType" in obj, get: obj => obj.threatType, set: (obj, value) => { obj.threatType = value; } }, metadata: _metadata }, _threatType_initializers, _threatType_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _source_decorators, { kind: "field", name: "source", static: false, private: false, access: { has: obj => "source" in obj, get: obj => obj.source, set: (obj, value) => { obj.source = value; } }, metadata: _metadata }, _source_initializers, _source_extraInitializers);
        __esDecorate(null, null, _iocType_decorators, { kind: "field", name: "iocType", static: false, private: false, access: { has: obj => "iocType" in obj, get: obj => obj.iocType, set: (obj, value) => { obj.iocType = value; } }, metadata: _metadata }, _iocType_initializers, _iocType_extraInitializers);
        __esDecorate(null, null, _iocValue_decorators, { kind: "field", name: "iocValue", static: false, private: false, access: { has: obj => "iocValue" in obj, get: obj => obj.iocValue, set: (obj, value) => { obj.iocValue = value; } }, metadata: _metadata }, _iocValue_initializers, _iocValue_extraInitializers);
        __esDecorate(null, null, _geoLocation_decorators, { kind: "field", name: "geoLocation", static: false, private: false, access: { has: obj => "geoLocation" in obj, get: obj => obj.geoLocation, set: (obj, value) => { obj.geoLocation = value; } }, metadata: _metadata }, _geoLocation_initializers, _geoLocation_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _partitionKey_decorators, { kind: "field", name: "partitionKey", static: false, private: false, access: { has: obj => "partitionKey" in obj, get: obj => obj.partitionKey, set: (obj, value) => { obj.partitionKey = value; } }, metadata: _metadata }, _partitionKey_initializers, _partitionKey_extraInitializers);
        __esDecorate(null, null, _shardKey_decorators, { kind: "field", name: "shardKey", static: false, private: false, access: { has: obj => "shardKey" in obj, get: obj => obj.shardKey, set: (obj, value) => { obj.shardKey = value; } }, metadata: _metadata }, _shardKey_initializers, _shardKey_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ThreatTimeSeriesData = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ThreatTimeSeriesData = _classThis;
})();
exports.ThreatTimeSeriesData = ThreatTimeSeriesData;
let ThreatArchiveOperation = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'threat_archive_operations',
            timestamps: true,
            indexes: [
                { fields: ['status'] },
                { fields: ['started_at'] },
                { fields: ['completed_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _sourcePartitions_decorators;
    let _sourcePartitions_initializers = [];
    let _sourcePartitions_extraInitializers = [];
    let _destinationPath_decorators;
    let _destinationPath_initializers = [];
    let _destinationPath_extraInitializers = [];
    let _archiveFormat_decorators;
    let _archiveFormat_initializers = [];
    let _archiveFormat_extraInitializers = [];
    let _compressionAlgorithm_decorators;
    let _compressionAlgorithm_initializers = [];
    let _compressionAlgorithm_extraInitializers = [];
    let _startedAt_decorators;
    let _startedAt_initializers = [];
    let _startedAt_extraInitializers = [];
    let _completedAt_decorators;
    let _completedAt_initializers = [];
    let _completedAt_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _recordCount_decorators;
    let _recordCount_initializers = [];
    let _recordCount_extraInitializers = [];
    let _originalSizeBytes_decorators;
    let _originalSizeBytes_initializers = [];
    let _originalSizeBytes_extraInitializers = [];
    let _compressedSizeBytes_decorators;
    let _compressedSizeBytes_initializers = [];
    let _compressedSizeBytes_extraInitializers = [];
    let _checksumMD5_decorators;
    let _checksumMD5_initializers = [];
    let _checksumMD5_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ThreatArchiveOperation = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.sourcePartitions = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sourcePartitions_initializers, void 0));
            this.destinationPath = (__runInitializers(this, _sourcePartitions_extraInitializers), __runInitializers(this, _destinationPath_initializers, void 0));
            this.archiveFormat = (__runInitializers(this, _destinationPath_extraInitializers), __runInitializers(this, _archiveFormat_initializers, void 0));
            this.compressionAlgorithm = (__runInitializers(this, _archiveFormat_extraInitializers), __runInitializers(this, _compressionAlgorithm_initializers, void 0));
            this.startedAt = (__runInitializers(this, _compressionAlgorithm_extraInitializers), __runInitializers(this, _startedAt_initializers, void 0));
            this.completedAt = (__runInitializers(this, _startedAt_extraInitializers), __runInitializers(this, _completedAt_initializers, void 0));
            this.status = (__runInitializers(this, _completedAt_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.recordCount = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _recordCount_initializers, void 0));
            this.originalSizeBytes = (__runInitializers(this, _recordCount_extraInitializers), __runInitializers(this, _originalSizeBytes_initializers, void 0));
            this.compressedSizeBytes = (__runInitializers(this, _originalSizeBytes_extraInitializers), __runInitializers(this, _compressedSizeBytes_initializers, void 0));
            this.checksumMD5 = (__runInitializers(this, _compressedSizeBytes_extraInitializers), __runInitializers(this, _checksumMD5_initializers, void 0));
            this.metadata = (__runInitializers(this, _checksumMD5_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ThreatArchiveOperation");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ example: 'arch_123456', description: 'Unique archive operation identifier' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, primaryKey: true })];
        _sourcePartitions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Source partition IDs', type: [String] }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING), allowNull: false, field: 'source_partitions' })];
        _destinationPath_decorators = [(0, swagger_1.ApiProperty)({ example: '/archive/2024/01', description: 'Destination path' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'destination_path' })];
        _archiveFormat_decorators = [(0, swagger_1.ApiProperty)({ enum: ['parquet', 'avro', 'orc', 'csv', 'jsonl'], example: 'parquet' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'archive_format' })];
        _compressionAlgorithm_decorators = [(0, swagger_1.ApiProperty)({ enum: CompressionAlgorithm, example: CompressionAlgorithm.ZSTD }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, field: 'compression_algorithm' })];
        _startedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Operation start time' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, field: 'started_at' })];
        _completedAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Operation completion time' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, field: 'completed_at' })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ enum: ['pending', 'running', 'completed', 'failed', 'cancelled'], example: 'running' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, defaultValue: 'pending' })];
        _recordCount_decorators = [(0, swagger_1.ApiProperty)({ example: 1000000, description: 'Number of records archived' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BIGINT, allowNull: false, defaultValue: 0, field: 'record_count' })];
        _originalSizeBytes_decorators = [(0, swagger_1.ApiProperty)({ example: 1073741824, description: 'Original size in bytes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BIGINT, allowNull: false, defaultValue: 0, field: 'original_size_bytes' })];
        _compressedSizeBytes_decorators = [(0, swagger_1.ApiProperty)({ example: 268435456, description: 'Compressed size in bytes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BIGINT, allowNull: false, defaultValue: 0, field: 'compressed_size_bytes' })];
        _checksumMD5_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'd41d8cd98f00b204e9800998ecf8427e', description: 'MD5 checksum' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, field: 'checksum_md5' })];
        _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: {} })];
        _createdAt_decorators = [(0, swagger_1.ApiProperty)(), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, field: 'created_at' })];
        _updatedAt_decorators = [(0, swagger_1.ApiProperty)(), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, field: 'updated_at' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _sourcePartitions_decorators, { kind: "field", name: "sourcePartitions", static: false, private: false, access: { has: obj => "sourcePartitions" in obj, get: obj => obj.sourcePartitions, set: (obj, value) => { obj.sourcePartitions = value; } }, metadata: _metadata }, _sourcePartitions_initializers, _sourcePartitions_extraInitializers);
        __esDecorate(null, null, _destinationPath_decorators, { kind: "field", name: "destinationPath", static: false, private: false, access: { has: obj => "destinationPath" in obj, get: obj => obj.destinationPath, set: (obj, value) => { obj.destinationPath = value; } }, metadata: _metadata }, _destinationPath_initializers, _destinationPath_extraInitializers);
        __esDecorate(null, null, _archiveFormat_decorators, { kind: "field", name: "archiveFormat", static: false, private: false, access: { has: obj => "archiveFormat" in obj, get: obj => obj.archiveFormat, set: (obj, value) => { obj.archiveFormat = value; } }, metadata: _metadata }, _archiveFormat_initializers, _archiveFormat_extraInitializers);
        __esDecorate(null, null, _compressionAlgorithm_decorators, { kind: "field", name: "compressionAlgorithm", static: false, private: false, access: { has: obj => "compressionAlgorithm" in obj, get: obj => obj.compressionAlgorithm, set: (obj, value) => { obj.compressionAlgorithm = value; } }, metadata: _metadata }, _compressionAlgorithm_initializers, _compressionAlgorithm_extraInitializers);
        __esDecorate(null, null, _startedAt_decorators, { kind: "field", name: "startedAt", static: false, private: false, access: { has: obj => "startedAt" in obj, get: obj => obj.startedAt, set: (obj, value) => { obj.startedAt = value; } }, metadata: _metadata }, _startedAt_initializers, _startedAt_extraInitializers);
        __esDecorate(null, null, _completedAt_decorators, { kind: "field", name: "completedAt", static: false, private: false, access: { has: obj => "completedAt" in obj, get: obj => obj.completedAt, set: (obj, value) => { obj.completedAt = value; } }, metadata: _metadata }, _completedAt_initializers, _completedAt_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _recordCount_decorators, { kind: "field", name: "recordCount", static: false, private: false, access: { has: obj => "recordCount" in obj, get: obj => obj.recordCount, set: (obj, value) => { obj.recordCount = value; } }, metadata: _metadata }, _recordCount_initializers, _recordCount_extraInitializers);
        __esDecorate(null, null, _originalSizeBytes_decorators, { kind: "field", name: "originalSizeBytes", static: false, private: false, access: { has: obj => "originalSizeBytes" in obj, get: obj => obj.originalSizeBytes, set: (obj, value) => { obj.originalSizeBytes = value; } }, metadata: _metadata }, _originalSizeBytes_initializers, _originalSizeBytes_extraInitializers);
        __esDecorate(null, null, _compressedSizeBytes_decorators, { kind: "field", name: "compressedSizeBytes", static: false, private: false, access: { has: obj => "compressedSizeBytes" in obj, get: obj => obj.compressedSizeBytes, set: (obj, value) => { obj.compressedSizeBytes = value; } }, metadata: _metadata }, _compressedSizeBytes_initializers, _compressedSizeBytes_extraInitializers);
        __esDecorate(null, null, _checksumMD5_decorators, { kind: "field", name: "checksumMD5", static: false, private: false, access: { has: obj => "checksumMD5" in obj, get: obj => obj.checksumMD5, set: (obj, value) => { obj.checksumMD5 = value; } }, metadata: _metadata }, _checksumMD5_initializers, _checksumMD5_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ThreatArchiveOperation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ThreatArchiveOperation = _classThis;
})();
exports.ThreatArchiveOperation = ThreatArchiveOperation;
// ============================================================================
// DATA LAKE ARCHITECTURE FUNCTIONS
// ============================================================================
/**
 * Creates a new data lake configuration with optimized settings.
 *
 * @param {Partial<DataLakeConfig>} config - Data lake configuration
 * @returns {DataLakeConfig} Complete data lake configuration
 * @throws {Error} If configuration is invalid
 *
 * @example
 * ```typescript
 * const dataLake = createDataLakeConfig({
 *   name: 'Threat Intelligence Lake',
 *   storagePath: '/data/threat-lake',
 *   partitionStrategy: PartitionStrategy.TIME_BASED,
 *   compressionAlgorithm: CompressionAlgorithm.ZSTD
 * });
 * ```
 */
const createDataLakeConfig = (config) => {
    if (!config.name || !config.storagePath) {
        throw new Error('Name and storage path are required');
    }
    const id = `dl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const defaultRetentionPolicy = {
        id: `ret_${Date.now()}`,
        name: 'Default Retention',
        hotTierDays: 30,
        warmTierDays: 90,
        coldTierDays: 365,
        archiveAfterDays: 365,
        deleteAfterDays: undefined,
        compressAfterDays: 30,
    };
    const defaultIndexingStrategy = {
        primaryKeys: ['id', 'timestamp'],
        secondaryIndexes: [
            { fields: ['threat_type', 'severity'], type: 'btree' },
            { fields: ['source'], type: 'btree' },
        ],
    };
    return {
        id,
        name: config.name,
        description: config.description,
        storagePath: config.storagePath,
        partitionStrategy: config.partitionStrategy || PartitionStrategy.TIME_BASED,
        shardStrategy: config.shardStrategy,
        compressionAlgorithm: config.compressionAlgorithm || CompressionAlgorithm.ZSTD,
        retentionPolicy: config.retentionPolicy || defaultRetentionPolicy,
        indexingStrategy: config.indexingStrategy || defaultIndexingStrategy,
        replicationFactor: config.replicationFactor || 3,
        encryptionEnabled: config.encryptionEnabled !== false,
        deduplicationEnabled: config.deduplicationEnabled !== false,
        metadata: config.metadata || {},
    };
};
exports.createDataLakeConfig = createDataLakeConfig;
/**
 * Validates a data lake configuration for correctness and best practices.
 *
 * @param {DataLakeConfig} config - Data lake configuration to validate
 * @returns {{ valid: boolean; errors: string[]; warnings: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateDataLakeConfig(config);
 * if (!validation.valid) {
 *   console.error('Invalid configuration:', validation.errors);
 * }
 * ```
 */
const validateDataLakeConfig = (config) => {
    const errors = [];
    const warnings = [];
    if (!config.id || !config.name || !config.storagePath) {
        errors.push('Missing required fields: id, name, or storagePath');
    }
    if (config.replicationFactor < 1 || config.replicationFactor > 5) {
        errors.push('Replication factor must be between 1 and 5');
    }
    if (config.retentionPolicy.hotTierDays > config.retentionPolicy.warmTierDays) {
        errors.push('Hot tier days cannot exceed warm tier days');
    }
    if (config.retentionPolicy.warmTierDays > config.retentionPolicy.coldTierDays) {
        errors.push('Warm tier days cannot exceed cold tier days');
    }
    if (!config.encryptionEnabled) {
        warnings.push('Encryption is disabled - not recommended for healthcare data');
    }
    if (config.compressionAlgorithm === CompressionAlgorithm.NONE) {
        warnings.push('Compression is disabled - may result in higher storage costs');
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
};
exports.validateDataLakeConfig = validateDataLakeConfig;
/**
 * Generates optimal partition key based on data characteristics.
 *
 * @param {ThreatTimeSeries[]} sampleData - Sample data for analysis
 * @param {PartitionStrategy} strategy - Partitioning strategy
 * @returns {{ partitionKey: string; cardinality: number; distribution: Record<string, number> }} Partition key recommendation
 *
 * @example
 * ```typescript
 * const recommendation = generatePartitionKey(sampleData, PartitionStrategy.TIME_BASED);
 * console.log('Use partition key:', recommendation.partitionKey);
 * ```
 */
const generatePartitionKey = (sampleData, strategy) => {
    if (!Array.isArray(sampleData) || sampleData.length === 0) {
        throw new Error('Sample data is required');
    }
    let partitionKey;
    const distribution = {};
    switch (strategy) {
        case PartitionStrategy.TIME_BASED:
            partitionKey = 'timestamp_month';
            sampleData.forEach((record) => {
                const month = new Date(record.timestamp).toISOString().substring(0, 7);
                distribution[month] = (distribution[month] || 0) + 1;
            });
            break;
        case PartitionStrategy.HASH_BASED:
            partitionKey = 'hash(threat_id)';
            sampleData.forEach((record) => {
                const hash = Math.abs(hashString(record.threatId)) % 16;
                const key = `shard_${hash}`;
                distribution[key] = (distribution[key] || 0) + 1;
            });
            break;
        case PartitionStrategy.LIST_BASED:
            partitionKey = 'severity';
            sampleData.forEach((record) => {
                distribution[record.severity] = (distribution[record.severity] || 0) + 1;
            });
            break;
        default:
            partitionKey = 'timestamp_day';
            sampleData.forEach((record) => {
                const day = new Date(record.timestamp).toISOString().substring(0, 10);
                distribution[day] = (distribution[day] || 0) + 1;
            });
    }
    return {
        partitionKey,
        cardinality: Object.keys(distribution).length,
        distribution,
    };
};
exports.generatePartitionKey = generatePartitionKey;
/**
 * Calculates optimal shard count based on data volume and performance requirements.
 *
 * @param {number} totalRecords - Total number of records
 * @param {number} averageRecordSizeBytes - Average record size in bytes
 * @param {number} targetShardSizeGB - Target shard size in GB
 * @returns {{ shardCount: number; recordsPerShard: number; shardSizeGB: number }} Shard recommendation
 *
 * @example
 * ```typescript
 * const sharding = calculateOptimalShardCount(10000000, 1024, 50);
 * console.log(`Use ${sharding.shardCount} shards`);
 * ```
 */
const calculateOptimalShardCount = (totalRecords, averageRecordSizeBytes, targetShardSizeGB = 50) => {
    const totalSizeGB = (totalRecords * averageRecordSizeBytes) / (1024 * 1024 * 1024);
    const idealShardCount = Math.ceil(totalSizeGB / targetShardSizeGB);
    const shardCount = Math.max(1, Math.min(idealShardCount, 1024)); // Cap at 1024 shards
    const recordsPerShard = Math.ceil(totalRecords / shardCount);
    const shardSizeGB = totalSizeGB / shardCount;
    return {
        shardCount,
        recordsPerShard,
        shardSizeGB,
    };
};
exports.calculateOptimalShardCount = calculateOptimalShardCount;
// ============================================================================
// TIME-SERIES DATA MANAGEMENT
// ============================================================================
/**
 * Ingests time-series threat data with automatic partitioning.
 *
 * @param {ThreatTimeSeries[]} data - Time-series data to ingest
 * @param {DataLakeConfig} config - Data lake configuration
 * @returns {IngestionBatch} Ingestion batch metadata
 *
 * @example
 * ```typescript
 * const batch = ingestTimeSeriesData(threatData, dataLakeConfig);
 * console.log(`Ingested ${batch.recordCount} records`);
 * ```
 */
const ingestTimeSeriesData = (data, config) => {
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = new Date();
    // Calculate batch size
    const sizeBytes = data.reduce((sum, record) => {
        return sum + JSON.stringify(record).length;
    }, 0);
    // Determine affected partitions
    const partitionsAffected = new Set();
    data.forEach((record) => {
        const partitionKey = (0, exports.determinePartition)(record, config.partitionStrategy);
        partitionsAffected.add(partitionKey);
    });
    return {
        batchId,
        recordCount: data.length,
        sizeBytes,
        source: data[0]?.source || 'unknown',
        startTime,
        endTime: new Date(),
        status: 'completed',
        partitionsAffected: Array.from(partitionsAffected),
        metadata: {
            compressionAlgorithm: config.compressionAlgorithm,
            encryptionEnabled: config.encryptionEnabled,
        },
    };
};
exports.ingestTimeSeriesData = ingestTimeSeriesData;
/**
 * Determines the appropriate partition for a data record.
 *
 * @param {ThreatTimeSeries} record - Data record
 * @param {PartitionStrategy} strategy - Partitioning strategy
 * @returns {string} Partition key
 *
 * @example
 * ```typescript
 * const partition = determinePartition(record, PartitionStrategy.TIME_BASED);
 * console.log('Partition:', partition);
 * ```
 */
const determinePartition = (record, strategy) => {
    switch (strategy) {
        case PartitionStrategy.TIME_BASED:
            return new Date(record.timestamp).toISOString().substring(0, 7); // YYYY-MM
        case PartitionStrategy.HASH_BASED:
            const hash = Math.abs(hashString(record.threatId)) % 16;
            return `shard_${hash.toString().padStart(2, '0')}`;
        case PartitionStrategy.LIST_BASED:
            return `severity_${record.severity}`;
        case PartitionStrategy.RANGE_BASED:
            const hour = new Date(record.timestamp).getHours();
            return `hour_${hour.toString().padStart(2, '0')}`;
        default:
            return new Date(record.timestamp).toISOString().substring(0, 10); // YYYY-MM-DD
    }
};
exports.determinePartition = determinePartition;
/**
 * Queries time-series data with optimized partition pruning.
 *
 * @param {Date} startDate - Start date for query
 * @param {Date} endDate - End date for query
 * @param {Partial<ThreatTimeSeries>} filters - Additional filters
 * @param {QueryOptimizationHint} hints - Query optimization hints
 * @returns {{ partitions: string[]; estimatedRecords: number; queryPlan: string }} Query plan
 *
 * @example
 * ```typescript
 * const queryPlan = queryTimeSeriesData(
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   { severity: 'high' },
 *   { partitionPruning: true }
 * );
 * ```
 */
const queryTimeSeriesData = (startDate, endDate, filters = {}, hints = { partitionPruning: true, indexScan: true, parallelQuery: true, cachingEnabled: true, compressionAware: true }) => {
    const partitions = [];
    let currentDate = new Date(startDate);
    // Generate list of partitions to scan
    while (currentDate <= endDate) {
        const partition = currentDate.toISOString().substring(0, 7);
        partitions.push(partition);
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    // Estimate record count (simplified)
    const daysInRange = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const estimatedRecords = Math.floor(daysInRange * 10000); // Assume 10k records per day
    const queryPlan = `
    Partition Pruning: ${hints.partitionPruning ? 'ENABLED' : 'DISABLED'}
    Partitions to scan: ${partitions.join(', ')}
    Index Scan: ${hints.indexScan ? 'ENABLED' : 'DISABLED'}
    Parallel Query: ${hints.parallelQuery ? 'ENABLED' : 'DISABLED'}
    Estimated Records: ${estimatedRecords}
  `.trim();
    return {
        partitions,
        estimatedRecords,
        queryPlan,
    };
};
exports.queryTimeSeriesData = queryTimeSeriesData;
/**
 * Aggregates time-series data with time bucketing.
 *
 * @param {ThreatTimeSeries[]} data - Time-series data
 * @param {'hour' | 'day' | 'week' | 'month'} bucketSize - Time bucket size
 * @returns {Array<{ timestamp: Date; count: number; severityCounts: Record<string, number> }>} Aggregated data
 *
 * @example
 * ```typescript
 * const aggregated = aggregateTimeSeriesData(data, 'day');
 * console.log(`${aggregated.length} buckets created`);
 * ```
 */
const aggregateTimeSeriesData = (data, bucketSize) => {
    const buckets = new Map();
    data.forEach((record) => {
        const bucketKey = getBucketKey(new Date(record.timestamp), bucketSize);
        if (!buckets.has(bucketKey)) {
            buckets.set(bucketKey, {
                timestamp: new Date(bucketKey),
                count: 0,
                severityCounts: {},
            });
        }
        const bucket = buckets.get(bucketKey);
        bucket.count++;
        bucket.severityCounts[record.severity] = (bucket.severityCounts[record.severity] || 0) + 1;
    });
    return Array.from(buckets.values()).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};
exports.aggregateTimeSeriesData = aggregateTimeSeriesData;
// ============================================================================
// PARTITIONING AND SHARDING
// ============================================================================
/**
 * Creates a new partition for data organization.
 *
 * @param {string} tableName - Table name
 * @param {string} partitionKey - Partition key
 * @param {string | number | Date} partitionValue - Partition value
 * @param {StorageTier} tier - Storage tier
 * @returns {PartitionMetadata} Partition metadata
 *
 * @example
 * ```typescript
 * const partition = createPartition('threat_timeseries', 'month', '2024-01', StorageTier.HOT);
 * ```
 */
const createPartition = (tableName, partitionKey, partitionValue, tier = StorageTier.HOT) => {
    const id = `part_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
        id,
        tableName,
        partitionKey,
        partitionValue: partitionValue.toString(),
        recordCount: 0,
        sizeBytes: 0,
        tier,
        createdAt: new Date(),
    };
};
exports.createPartition = createPartition;
/**
 * Merges small partitions to optimize storage and query performance.
 *
 * @param {PartitionMetadata[]} partitions - Partitions to merge
 * @param {number} minSizeBytes - Minimum partition size threshold
 * @returns {{ mergedPartitions: PartitionMetadata[]; spaceSaved: number }} Merge result
 *
 * @example
 * ```typescript
 * const result = mergePartitions(smallPartitions, 10 * 1024 * 1024);
 * console.log(`Space saved: ${result.spaceSaved} bytes`);
 * ```
 */
const mergePartitions = (partitions, minSizeBytes) => {
    const smallPartitions = partitions.filter((p) => p.sizeBytes < minSizeBytes);
    if (smallPartitions.length < 2) {
        return { mergedPartitions: [], spaceSaved: 0 };
    }
    // Group partitions by table and partition key
    const groups = new Map();
    smallPartitions.forEach((p) => {
        const key = `${p.tableName}_${p.partitionKey}`;
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(p);
    });
    const mergedPartitions = [];
    let spaceSaved = 0;
    groups.forEach((group, key) => {
        if (group.length >= 2) {
            const [tableName, partitionKey] = key.split('_');
            const totalRecords = group.reduce((sum, p) => sum + p.recordCount, 0);
            const totalSize = group.reduce((sum, p) => sum + p.sizeBytes, 0);
            const merged = {
                id: `part_merged_${Date.now()}`,
                tableName,
                partitionKey,
                partitionValue: 'merged',
                recordCount: totalRecords,
                sizeBytes: Math.floor(totalSize * 0.9), // 10% overhead reduction from merge
                tier: group[0].tier,
                createdAt: new Date(),
            };
            mergedPartitions.push(merged);
            spaceSaved += totalSize - merged.sizeBytes;
        }
    });
    return { mergedPartitions, spaceSaved };
};
exports.mergePartitions = mergePartitions;
/**
 * Splits a large partition for better distribution.
 *
 * @param {PartitionMetadata} partition - Partition to split
 * @param {number} targetCount - Target number of partitions
 * @returns {PartitionMetadata[]} Split partitions
 *
 * @example
 * ```typescript
 * const splitPartitions = splitPartition(largePartition, 4);
 * console.log(`Split into ${splitPartitions.length} partitions`);
 * ```
 */
const splitPartition = (partition, targetCount) => {
    if (targetCount < 2) {
        throw new Error('Target count must be at least 2');
    }
    const recordsPerPartition = Math.ceil(partition.recordCount / targetCount);
    const bytesPerPartition = Math.ceil(partition.sizeBytes / targetCount);
    return Array.from({ length: targetCount }, (_, i) => ({
        id: `${partition.id}_split_${i}`,
        tableName: partition.tableName,
        partitionKey: `${partition.partitionKey}_${i}`,
        partitionValue: `${partition.partitionValue}_${i}`,
        recordCount: recordsPerPartition,
        sizeBytes: bytesPerPartition,
        tier: partition.tier,
        createdAt: new Date(),
    }));
};
exports.splitPartition = splitPartition;
/**
 * Rebalances shards across nodes for optimal distribution.
 *
 * @param {ShardMetadata[]} shards - Current shard distribution
 * @param {number} targetNodesCount - Target number of nodes
 * @returns {{ rebalancePlan: Array<{ shardId: string; fromNode: string; toNode: string }>; estimatedDataTransferGB: number }} Rebalance plan
 *
 * @example
 * ```typescript
 * const plan = rebalanceShards(currentShards, 8);
 * console.log(`Will transfer ${plan.estimatedDataTransferGB}GB of data`);
 * ```
 */
const rebalanceShards = (shards, targetNodesCount) => {
    const nodeLoads = new Map();
    shards.forEach((shard) => {
        const currentLoad = nodeLoads.get(shard.nodeId) || 0;
        nodeLoads.set(shard.nodeId, currentLoad + shard.sizeBytes);
    });
    const totalSize = shards.reduce((sum, s) => sum + s.sizeBytes, 0);
    const targetLoadPerNode = totalSize / targetNodesCount;
    const rebalancePlan = [];
    let estimatedDataTransferGB = 0;
    // Simple rebalancing strategy: move shards from overloaded to underloaded nodes
    const overloadedNodes = Array.from(nodeLoads.entries())
        .filter(([_, load]) => load > targetLoadPerNode * 1.1)
        .map(([nodeId, load]) => ({ nodeId, load }));
    const underloadedNodes = Array.from(nodeLoads.entries())
        .filter(([_, load]) => load < targetLoadPerNode * 0.9)
        .map(([nodeId, load]) => ({ nodeId, load }));
    overloadedNodes.forEach((overloaded) => {
        const shardsToMove = shards.filter((s) => s.nodeId === overloaded.nodeId);
        shardsToMove.slice(0, Math.floor(shardsToMove.length / 2)).forEach((shard) => {
            if (underloadedNodes.length > 0) {
                const target = underloadedNodes[0];
                rebalancePlan.push({
                    shardId: shard.id,
                    fromNode: overloaded.nodeId,
                    toNode: target.nodeId,
                });
                estimatedDataTransferGB += shard.sizeBytes / (1024 * 1024 * 1024);
            }
        });
    });
    return { rebalancePlan, estimatedDataTransferGB };
};
exports.rebalanceShards = rebalanceShards;
// ============================================================================
// DATA RETENTION AND ARCHIVAL
// ============================================================================
/**
 * Applies retention policy to partitions and moves data between tiers.
 *
 * @param {PartitionMetadata[]} partitions - Partitions to evaluate
 * @param {RetentionPolicy} policy - Retention policy
 * @returns {{ tierChanges: Array<{ partition: PartitionId; oldTier: StorageTier; newTier: StorageTier }>; deletions: PartitionId[] }} Retention actions
 *
 * @example
 * ```typescript
 * const actions = applyRetentionPolicy(allPartitions, retentionPolicy);
 * console.log(`${actions.tierChanges.length} tier changes, ${actions.deletions.length} deletions`);
 * ```
 */
const applyRetentionPolicy = (partitions, policy) => {
    const now = Date.now();
    const tierChanges = [];
    const deletions = [];
    partitions.forEach((partition) => {
        const ageInDays = (now - partition.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        let newTier = null;
        if (policy.deleteAfterDays && ageInDays > policy.deleteAfterDays) {
            deletions.push(partition.id);
            return;
        }
        if (ageInDays > policy.coldTierDays && partition.tier !== StorageTier.FROZEN) {
            newTier = StorageTier.FROZEN;
        }
        else if (ageInDays > policy.warmTierDays && partition.tier === StorageTier.HOT) {
            newTier = StorageTier.COLD;
        }
        else if (ageInDays > policy.hotTierDays && partition.tier === StorageTier.HOT) {
            newTier = StorageTier.WARM;
        }
        if (newTier && newTier !== partition.tier) {
            tierChanges.push({
                partition: partition.id,
                oldTier: partition.tier,
                newTier,
            });
        }
    });
    return { tierChanges, deletions };
};
exports.applyRetentionPolicy = applyRetentionPolicy;
/**
 * Archives partitions to long-term storage.
 *
 * @param {PartitionMetadata[]} partitions - Partitions to archive
 * @param {string} destinationPath - Archive destination path
 * @param {'parquet' | 'avro' | 'orc' | 'csv' | 'jsonl'} format - Archive format
 * @param {CompressionAlgorithm} compression - Compression algorithm
 * @returns {ArchiveOperation} Archive operation metadata
 *
 * @example
 * ```typescript
 * const archiveOp = archivePartitions(
 *   oldPartitions,
 *   '/archive/2023',
 *   'parquet',
 *   CompressionAlgorithm.ZSTD
 * );
 * ```
 */
const archivePartitions = (partitions, destinationPath, format, compression) => {
    const id = `arch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const recordCount = partitions.reduce((sum, p) => sum + p.recordCount, 0);
    const originalSizeBytes = partitions.reduce((sum, p) => sum + p.sizeBytes, 0);
    // Estimate compression ratio based on algorithm
    const compressionRatios = {
        [CompressionAlgorithm.NONE]: 1.0,
        [CompressionAlgorithm.GZIP]: 0.35,
        [CompressionAlgorithm.BROTLI]: 0.30,
        [CompressionAlgorithm.ZSTD]: 0.28,
        [CompressionAlgorithm.LZ4]: 0.50,
        [CompressionAlgorithm.SNAPPY]: 0.55,
    };
    const compressedSizeBytes = Math.floor(originalSizeBytes * compressionRatios[compression]);
    return {
        id,
        sourcePartitions: partitions.map((p) => p.id),
        destinationPath,
        archiveFormat: format,
        compressionAlgorithm: compression,
        startedAt: new Date(),
        status: 'pending',
        recordCount,
        originalSizeBytes,
        compressedSizeBytes,
    };
};
exports.archivePartitions = archivePartitions;
/**
 * Restores archived data back to active storage.
 *
 * @param {ArchiveOperation} archiveOp - Archive operation to restore
 * @param {StorageTier} targetTier - Target storage tier
 * @returns {{ partitions: PartitionMetadata[]; estimatedRestoreTime: number }} Restore plan
 *
 * @example
 * ```typescript
 * const restore = restoreArchivedData(archiveOperation, StorageTier.COLD);
 * console.log(`Restore will take approximately ${restore.estimatedRestoreTime}ms`);
 * ```
 */
const restoreArchivedData = (archiveOp, targetTier) => {
    // Estimate restore time based on compressed size (assume 100 MB/s throughput)
    const throughputBytesPerMs = (100 * 1024 * 1024) / 1000;
    const estimatedRestoreTime = archiveOp.compressedSizeBytes / throughputBytesPerMs;
    const partitions = archiveOp.sourcePartitions.map((partId, i) => ({
        id: `${partId}_restored`,
        tableName: 'threat_timeseries',
        partitionKey: 'restored',
        partitionValue: `restored_${i}`,
        recordCount: Math.floor(archiveOp.recordCount / archiveOp.sourcePartitions.length),
        sizeBytes: Math.floor(archiveOp.originalSizeBytes / archiveOp.sourcePartitions.length),
        tier: targetTier,
        createdAt: new Date(),
    }));
    return { partitions, estimatedRestoreTime };
};
exports.restoreArchivedData = restoreArchivedData;
/**
 * Estimates storage costs across different tiers.
 *
 * @param {PartitionMetadata[]} partitions - Partitions to analyze
 * @param {Record<StorageTier, number>} costPerGBPerMonth - Cost per GB per month by tier
 * @returns {{ totalCost: number; costByTier: Record<StorageTier, number>; optimizationSuggestions: string[] }} Cost analysis
 *
 * @example
 * ```typescript
 * const costs = estimateStorageCosts(partitions, {
 *   [StorageTier.HOT]: 0.023,
 *   [StorageTier.WARM]: 0.0125,
 *   [StorageTier.COLD]: 0.004,
 *   [StorageTier.FROZEN]: 0.001
 * });
 * ```
 */
const estimateStorageCosts = (partitions, costPerGBPerMonth) => {
    const costByTier = {
        [StorageTier.HOT]: 0,
        [StorageTier.WARM]: 0,
        [StorageTier.COLD]: 0,
        [StorageTier.FROZEN]: 0,
    };
    const optimizationSuggestions = [];
    partitions.forEach((partition) => {
        const sizeGB = partition.sizeBytes / (1024 * 1024 * 1024);
        const tier = partition.tier;
        costByTier[tier] += sizeGB * costPerGBPerMonth[tier];
        // Check for optimization opportunities
        const ageInDays = (Date.now() - partition.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        if (tier === StorageTier.HOT && ageInDays > 60) {
            optimizationSuggestions.push(`Partition ${partition.id} is ${Math.floor(ageInDays)} days old but still in HOT tier. Consider moving to WARM tier.`);
        }
    });
    const totalCost = Object.values(costByTier).reduce((sum, cost) => sum + cost, 0);
    return { totalCost, costByTier, optimizationSuggestions };
};
exports.estimateStorageCosts = estimateStorageCosts;
// ============================================================================
// QUERY OPTIMIZATION
// ============================================================================
/**
 * Generates an optimized query plan for large datasets.
 *
 * @param {Date} startDate - Query start date
 * @param {Date} endDate - Query end date
 * @param {string[]} filters - Query filters
 * @param {PartitionMetadata[]} availablePartitions - Available partitions
 * @returns {{ selectedPartitions: PartitionId[]; estimatedCost: number; parallelism: number; cachingStrategy: string }} Query plan
 *
 * @example
 * ```typescript
 * const plan = generateOptimizedQueryPlan(
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   ['severity = high'],
 *   allPartitions
 * );
 * ```
 */
const generateOptimizedQueryPlan = (startDate, endDate, filters, availablePartitions) => {
    // Filter partitions by date range
    const selectedPartitions = availablePartitions
        .filter((p) => {
        if (p.startRange && p.endRange) {
            const pStart = new Date(p.startRange);
            const pEnd = new Date(p.endRange);
            return pStart <= endDate && pEnd >= startDate;
        }
        return true;
    })
        .map((p) => p.id);
    const totalRecords = availablePartitions
        .filter((p) => selectedPartitions.includes(p.id))
        .reduce((sum, p) => sum + p.recordCount, 0);
    // Estimate query cost (simplified)
    const estimatedCost = totalRecords / 1000000; // Cost units
    // Determine parallelism based on partition count
    const parallelism = Math.min(selectedPartitions.length, 16);
    // Determine caching strategy
    const cachingStrategy = totalRecords < 1000000 ? 'full-result-cache' : 'partition-cache';
    return {
        selectedPartitions,
        estimatedCost,
        parallelism,
        cachingStrategy,
    };
};
exports.generateOptimizedQueryPlan = generateOptimizedQueryPlan;
/**
 * Analyzes query performance and suggests optimizations.
 *
 * @param {number} executionTimeMs - Query execution time in milliseconds
 * @param {number} recordsScanned - Number of records scanned
 * @param {number} recordsReturned - Number of records returned
 * @param {boolean} indexUsed - Whether index was used
 * @returns {{ efficiency: number; suggestions: string[]; indexRecommendations: string[] }} Performance analysis
 *
 * @example
 * ```typescript
 * const analysis = analyzeQueryPerformance(5000, 1000000, 500, false);
 * console.log('Efficiency:', analysis.efficiency);
 * console.log('Suggestions:', analysis.suggestions);
 * ```
 */
const analyzeQueryPerformance = (executionTimeMs, recordsScanned, recordsReturned, indexUsed) => {
    const suggestions = [];
    const indexRecommendations = [];
    // Calculate efficiency (records returned / records scanned)
    const efficiency = recordsScanned > 0 ? recordsReturned / recordsScanned : 0;
    // Throughput (records per second)
    const throughput = (recordsScanned / executionTimeMs) * 1000;
    if (efficiency < 0.01) {
        suggestions.push('Very low selectivity - consider adding more specific filters');
    }
    if (!indexUsed && recordsScanned > 10000) {
        suggestions.push('No index used - consider creating an index on filter columns');
        indexRecommendations.push('CREATE INDEX idx_timestamp_severity ON threat_timeseries(timestamp, severity)');
    }
    if (throughput < 1000) {
        suggestions.push('Low throughput - consider partition pruning or parallel query execution');
    }
    if (recordsScanned > 10000000) {
        suggestions.push('Large scan - consider using materialized views or summary tables');
    }
    return {
        efficiency,
        suggestions,
        indexRecommendations,
    };
};
exports.analyzeQueryPerformance = analyzeQueryPerformance;
/**
 * Creates a materialized view for frequently accessed query patterns.
 *
 * @param {string} viewName - Materialized view name
 * @param {string} query - Source query
 * @param {'hour' | 'day' | 'week'} refreshInterval - Refresh interval
 * @returns {{ viewName: string; estimatedSize: number; refreshSchedule: string }} Materialized view definition
 *
 * @example
 * ```typescript
 * const view = createMaterializedView(
 *   'daily_threat_summary',
 *   'SELECT date, severity, COUNT(*) FROM threat_timeseries GROUP BY date, severity',
 *   'day'
 * );
 * ```
 */
const createMaterializedView = (viewName, query, refreshInterval) => {
    const refreshSchedules = {
        hour: '0 * * * *', // Every hour
        day: '0 0 * * *', // Daily at midnight
        week: '0 0 * * 0', // Weekly on Sunday
    };
    return {
        viewName,
        estimatedSize: 1024 * 1024 * 100, // Estimate 100MB
        refreshSchedule: refreshSchedules[refreshInterval],
    };
};
exports.createMaterializedView = createMaterializedView;
// ============================================================================
// COMPRESSION AND DEDUPLICATION
// ============================================================================
/**
 * Applies compression to a partition.
 *
 * @param {PartitionMetadata} partition - Partition to compress
 * @param {CompressionAlgorithm} algorithm - Compression algorithm
 * @returns {{ originalSize: number; compressedSize: number; compressionRatio: number; estimatedTime: number }} Compression result
 *
 * @example
 * ```typescript
 * const result = compressPartition(partition, CompressionAlgorithm.ZSTD);
 * console.log(`Compression ratio: ${result.compressionRatio}`);
 * ```
 */
const compressPartition = (partition, algorithm) => {
    const compressionRatios = {
        [CompressionAlgorithm.NONE]: 1.0,
        [CompressionAlgorithm.GZIP]: 0.35,
        [CompressionAlgorithm.BROTLI]: 0.30,
        [CompressionAlgorithm.ZSTD]: 0.28,
        [CompressionAlgorithm.LZ4]: 0.50,
        [CompressionAlgorithm.SNAPPY]: 0.55,
    };
    // Compression speed estimates (MB/s)
    const compressionSpeeds = {
        [CompressionAlgorithm.NONE]: Infinity,
        [CompressionAlgorithm.GZIP]: 50,
        [CompressionAlgorithm.BROTLI]: 30,
        [CompressionAlgorithm.ZSTD]: 80,
        [CompressionAlgorithm.LZ4]: 200,
        [CompressionAlgorithm.SNAPPY]: 250,
    };
    const originalSize = partition.sizeBytes;
    const compressedSize = Math.floor(originalSize * compressionRatios[algorithm]);
    const compressionRatio = compressedSize / originalSize;
    const sizeMB = originalSize / (1024 * 1024);
    const estimatedTime = (sizeMB / compressionSpeeds[algorithm]) * 1000; // ms
    return {
        originalSize,
        compressedSize,
        compressionRatio,
        estimatedTime,
    };
};
exports.compressPartition = compressPartition;
/**
 * Decompresses a partition.
 *
 * @param {PartitionMetadata} partition - Partition to decompress
 * @param {CompressionAlgorithm} algorithm - Compression algorithm used
 * @returns {{ compressedSize: number; decompressedSize: number; estimatedTime: number }} Decompression result
 *
 * @example
 * ```typescript
 * const result = decompressPartition(compressedPartition, CompressionAlgorithm.ZSTD);
 * console.log(`Decompression will take ${result.estimatedTime}ms`);
 * ```
 */
const decompressPartition = (partition, algorithm) => {
    const compressedSize = partition.sizeBytes;
    const decompressedSize = partition.compressionRatio
        ? Math.floor(compressedSize / partition.compressionRatio)
        : compressedSize;
    // Decompression is typically 2-3x faster than compression
    const decompressionSpeeds = {
        [CompressionAlgorithm.NONE]: Infinity,
        [CompressionAlgorithm.GZIP]: 150,
        [CompressionAlgorithm.BROTLI]: 100,
        [CompressionAlgorithm.ZSTD]: 250,
        [CompressionAlgorithm.LZ4]: 600,
        [CompressionAlgorithm.SNAPPY]: 750,
    };
    const sizeMB = compressedSize / (1024 * 1024);
    const estimatedTime = (sizeMB / decompressionSpeeds[algorithm]) * 1000; // ms
    return {
        compressedSize,
        decompressedSize,
        estimatedTime,
    };
};
exports.decompressPartition = decompressPartition;
/**
 * Performs deduplication on threat data.
 *
 * @param {ThreatTimeSeries[]} data - Data to deduplicate
 * @param {'hash' | 'fuzzy' | 'semantic'} method - Deduplication method
 * @returns {DeduplicationResult} Deduplication result
 *
 * @example
 * ```typescript
 * const result = deduplicateData(threatData, 'hash');
 * console.log(`Removed ${result.duplicatesRemoved} duplicates`);
 * ```
 */
const deduplicateData = (data, method) => {
    const startTime = Date.now();
    const seen = new Set();
    const uniqueData = [];
    let duplicatesFound = 0;
    data.forEach((record) => {
        let key;
        switch (method) {
            case 'hash':
                key = hashString(JSON.stringify({ threatId: record.threatId, timestamp: record.timestamp })).toString();
                break;
            case 'fuzzy':
                key = `${record.threatId}_${Math.floor(new Date(record.timestamp).getTime() / 60000)}`; // 1-minute window
                break;
            case 'semantic':
                key = `${record.threatType}_${record.severity}_${record.source}`;
                break;
        }
        if (seen.has(key)) {
            duplicatesFound++;
        }
        else {
            seen.add(key);
            uniqueData.push(record);
        }
    });
    const recordSize = JSON.stringify(data[0] || {}).length;
    const spaceReclaimed = duplicatesFound * recordSize;
    return {
        recordsProcessed: data.length,
        duplicatesFound,
        duplicatesRemoved: duplicatesFound,
        spaceReclaimed,
        processingTimeMs: Date.now() - startTime,
        deduplicationMethod: method,
    };
};
exports.deduplicateData = deduplicateData;
/**
 * Identifies duplicate partitions across shards.
 *
 * @param {PartitionMetadata[]} partitions - Partitions to analyze
 * @returns {Array<{ original: PartitionId; duplicates: PartitionId[] }>} Duplicate groups
 *
 * @example
 * ```typescript
 * const duplicates = identifyDuplicatePartitions(allPartitions);
 * console.log(`Found ${duplicates.length} groups of duplicates`);
 * ```
 */
const identifyDuplicatePartitions = (partitions) => {
    const groups = new Map();
    partitions.forEach((partition) => {
        const key = `${partition.tableName}_${partition.partitionKey}_${partition.partitionValue}`;
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(partition);
    });
    return Array.from(groups.values())
        .filter((group) => group.length > 1)
        .map((group) => ({
        original: group[0].id,
        duplicates: group.slice(1).map((p) => p.id),
    }));
};
exports.identifyDuplicatePartitions = identifyDuplicatePartitions;
// ============================================================================
// STATISTICS AND MONITORING
// ============================================================================
/**
 * Calculates comprehensive statistics for the data lake.
 *
 * @param {PartitionMetadata[]} partitions - All partitions
 * @param {number} ingestRatePerSecond - Current ingestion rate
 * @param {number} queryRatePerSecond - Current query rate
 * @returns {DataLakeStatistics} Data lake statistics
 *
 * @example
 * ```typescript
 * const stats = calculateDataLakeStatistics(allPartitions, 1000, 50);
 * console.log(`Total records: ${stats.totalRecords}`);
 * ```
 */
const calculateDataLakeStatistics = (partitions, ingestRatePerSecond, queryRatePerSecond) => {
    const totalRecords = partitions.reduce((sum, p) => sum + p.recordCount, 0);
    const totalSizeBytes = partitions.reduce((sum, p) => sum + p.sizeBytes, 0);
    const totalCompressedSize = partitions.reduce((sum, p) => {
        return sum + (p.compressionRatio ? p.sizeBytes * p.compressionRatio : p.sizeBytes);
    }, 0);
    const compressionRatio = totalSizeBytes > 0 ? totalCompressedSize / totalSizeBytes : 1.0;
    const tierDistribution = {
        [StorageTier.HOT]: { records: 0, sizeBytes: 0 },
        [StorageTier.WARM]: { records: 0, sizeBytes: 0 },
        [StorageTier.COLD]: { records: 0, sizeBytes: 0 },
        [StorageTier.FROZEN]: { records: 0, sizeBytes: 0 },
    };
    partitions.forEach((p) => {
        const tier = p.tier;
        tierDistribution[tier].records += p.recordCount;
        tierDistribution[tier].sizeBytes += p.sizeBytes;
    });
    const timestamps = partitions
        .filter((p) => p.createdAt)
        .map((p) => p.createdAt)
        .sort((a, b) => a.getTime() - b.getTime());
    return {
        totalRecords,
        totalSizeBytes,
        partitionCount: partitions.length,
        shardCount: new Set(partitions.map((p) => p.tableName)).size,
        averageRecordsPerPartition: totalRecords / partitions.length,
        compressionRatio,
        tierDistribution,
        oldestRecord: timestamps[0],
        newestRecord: timestamps[timestamps.length - 1],
        ingestRatePerSecond,
        queryRatePerSecond,
    };
};
exports.calculateDataLakeStatistics = calculateDataLakeStatistics;
/**
 * Monitors data lake health and performance.
 *
 * @param {DataLakeStatistics} stats - Current statistics
 * @param {DataLakeConfig} config - Data lake configuration
 * @returns {{ health: 'healthy' | 'warning' | 'critical'; issues: string[]; recommendations: string[] }} Health report
 *
 * @example
 * ```typescript
 * const health = monitorDataLakeHealth(currentStats, dataLakeConfig);
 * console.log(`Data lake health: ${health.health}`);
 * ```
 */
const monitorDataLakeHealth = (stats, config) => {
    const issues = [];
    const recommendations = [];
    let health = 'healthy';
    // Check partition count
    if (stats.partitionCount > 10000) {
        issues.push('Partition count exceeds 10,000');
        recommendations.push('Consider merging small partitions or adjusting partition strategy');
        health = 'warning';
    }
    // Check average partition size
    const avgPartitionSize = stats.totalSizeBytes / stats.partitionCount;
    if (avgPartitionSize < 10 * 1024 * 1024) {
        // < 10MB
        issues.push('Average partition size is very small');
        recommendations.push('Merge small partitions to improve query performance');
    }
    // Check compression ratio
    if (stats.compressionRatio > 0.8) {
        issues.push('Low compression ratio');
        recommendations.push(`Consider using a more aggressive compression algorithm (current: ${config.compressionAlgorithm})`);
    }
    // Check tier distribution
    const hotTierPercent = (stats.tierDistribution[StorageTier.HOT].sizeBytes / stats.totalSizeBytes) * 100;
    if (hotTierPercent > 30) {
        issues.push(`${hotTierPercent.toFixed(1)}% of data is in HOT tier`);
        recommendations.push('Move older data to WARM or COLD tiers to reduce storage costs');
        health = 'warning';
    }
    // Check ingestion rate
    if (stats.ingestRatePerSecond > 10000) {
        issues.push('Very high ingestion rate');
        recommendations.push('Consider implementing batching or stream processing');
    }
    if (issues.length > 5) {
        health = 'critical';
    }
    return { health, issues, recommendations };
};
exports.monitorDataLakeHealth = monitorDataLakeHealth;
/**
 * Generates a data lake optimization report.
 *
 * @param {DataLakeStatistics} stats - Current statistics
 * @param {PartitionMetadata[]} partitions - All partitions
 * @param {RetentionPolicy} retentionPolicy - Retention policy
 * @returns {{ estimatedSavings: number; optimizationActions: string[]; priorityLevel: 'high' | 'medium' | 'low' }} Optimization report
 *
 * @example
 * ```typescript
 * const report = generateOptimizationReport(stats, partitions, policy);
 * console.log(`Estimated savings: $${report.estimatedSavings}/month`);
 * ```
 */
const generateOptimizationReport = (stats, partitions, retentionPolicy) => {
    const optimizationActions = [];
    let estimatedSavings = 0;
    // Check for tier optimization
    const now = Date.now();
    partitions.forEach((partition) => {
        const ageInDays = (now - partition.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        if (partition.tier === StorageTier.HOT && ageInDays > retentionPolicy.hotTierDays) {
            const sizeMB = partition.sizeBytes / (1024 * 1024);
            estimatedSavings += sizeMB * 0.00001; // Rough estimate
            optimizationActions.push(`Move partition ${partition.id} from HOT to WARM tier`);
        }
    });
    // Check for compression optimization
    const uncompressedPartitions = partitions.filter((p) => !p.compressionRatio || p.compressionRatio > 0.9);
    if (uncompressedPartitions.length > 0) {
        const uncompressedSize = uncompressedPartitions.reduce((sum, p) => sum + p.sizeBytes, 0);
        estimatedSavings += (uncompressedSize / (1024 * 1024 * 1024)) * 0.015; // $0.015/GB saved
        optimizationActions.push(`Compress ${uncompressedPartitions.length} uncompressed partitions`);
    }
    const priorityLevel = estimatedSavings > 100 ? 'high' : estimatedSavings > 10 ? 'medium' : 'low';
    return {
        estimatedSavings,
        optimizationActions,
        priorityLevel,
    };
};
exports.generateOptimizationReport = generateOptimizationReport;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Simple string hashing function for partitioning.
 *
 * @param {string} str - String to hash
 * @returns {number} Hash value
 */
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
}
/**
 * Gets bucket key for time aggregation.
 *
 * @param {Date} date - Date to bucket
 * @param {'hour' | 'day' | 'week' | 'month'} size - Bucket size
 * @returns {string} Bucket key
 */
function getBucketKey(date, size) {
    const d = new Date(date);
    switch (size) {
        case 'hour':
            d.setMinutes(0, 0, 0);
            return d.toISOString();
        case 'day':
            d.setHours(0, 0, 0, 0);
            return d.toISOString();
        case 'week':
            const dayOfWeek = d.getDay();
            d.setDate(d.getDate() - dayOfWeek);
            d.setHours(0, 0, 0, 0);
            return d.toISOString();
        case 'month':
            d.setDate(1);
            d.setHours(0, 0, 0, 0);
            return d.toISOString();
    }
}
/**
 * Formats bytes to human-readable string.
 *
 * @param {number} bytes - Bytes to format
 * @returns {string} Formatted string
 */
const formatBytes = (bytes) => {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
exports.formatBytes = formatBytes;
/**
 * Formats duration to human-readable string.
 *
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted string
 */
const formatDuration = (ms) => {
    if (ms < 1000)
        return `${ms}ms`;
    if (ms < 60000)
        return `${(ms / 1000).toFixed(2)}s`;
    if (ms < 3600000)
        return `${(ms / 60000).toFixed(2)}m`;
    return `${(ms / 3600000).toFixed(2)}h`;
};
exports.formatDuration = formatDuration;
//# sourceMappingURL=threat-data-lake-kit.js.map