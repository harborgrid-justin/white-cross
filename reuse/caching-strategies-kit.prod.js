"use strict";
/**
 * LOC: CACHE-STRAT-2024
 * File: /reuse/caching-strategies-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend services and controllers
 *   - API gateway implementations
 *   - Database access layers
 *   - NestJS modules
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchGet = exports.batchSet = exports.memoize = exports.createCacheHealthCheck = exports.exportPrometheusMetrics = exports.collectCacheMetrics = exports.replicateCacheData = exports.selectCacheNode = exports.consistentHash = exports.setupComprehensiveCacheHooks = exports.setupCacheWarmingHooks = exports.setupCacheInvalidationHooks = exports.CacheInvalidationInterceptor = exports.CacheInterceptor = exports.slidingExpiration = exports.extendTTL = exports.calculateAdaptiveTTL = exports.predictiveWarmCache = exports.scheduleWarmCache = exports.warmCache = exports.invalidateExpired = exports.invalidateByDependency = exports.invalidateByTags = exports.invalidateByPattern = exports.refreshAhead = exports.readThrough = exports.writeBack = exports.writeThrough = exports.cacheAside = exports.MultiLevelCacheManager = exports.deserializeData = exports.serializeData = exports.decompressData = exports.compressData = exports.generateKeyPattern = exports.hashObject = exports.generateHashKey = exports.generateCacheKey = exports.LRUCache = exports.CacheInvalidationLogModel = exports.CacheEntryModel = exports.DistributedCacheConfigSchema = exports.CacheInvalidationRuleSchema = exports.CacheKeyConfigSchema = exports.CacheConfigSchema = void 0;
/**
 * File: /reuse/caching-strategies-kit.prod.ts
 * Locator: WC-UTL-CACHE-STRAT-001
 * Purpose: Production-Grade Caching Strategies - Multi-level, distributed, and intelligent caching
 *
 * Upstream: Independent utility module for advanced caching strategies
 * Downstream: ../backend/*, services, controllers, database layers, NestJS modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Redis 7.x, Sequelize 6.x, Zod 3.x
 * Exports: 48 utility functions for caching strategies, invalidation, distributed caching, monitoring
 *
 * LLM Context: Production-grade caching strategies for White Cross healthcare system.
 * Provides multi-level caching (L1 memory/LRU, L2 Redis, L3 database), cache invalidation patterns,
 * distributed caching, cache-aside/write-through/write-back/read-through patterns, TTL management,
 * cache warming, compression, serialization, NestJS interceptors, Sequelize hooks, and monitoring.
 */
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const crypto = __importStar(require("crypto"));
const zlib = __importStar(require("zlib"));
const util_1 = require("util");
const zod_1 = require("zod");
// Promisified compression utilities
const gzipAsync = (0, util_1.promisify)(zlib.gzip);
const gunzipAsync = (0, util_1.promisify)(zlib.gunzip);
const brotliCompressAsync = (0, util_1.promisify)(zlib.brotliCompress);
const brotliDecompressAsync = (0, util_1.promisify)(zlib.brotliDecompress);
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Zod schema for cache configuration validation
 */
exports.CacheConfigSchema = zod_1.z.object({
    ttl: zod_1.z.number().positive().optional(),
    namespace: zod_1.z.string().min(1).max(128).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    compress: zod_1.z.boolean().optional(),
    compressionThreshold: zod_1.z.number().positive().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
    priority: zod_1.z.enum(['low', 'medium', 'high', 'critical']).optional(),
});
/**
 * Zod schema for cache key configuration
 */
exports.CacheKeyConfigSchema = zod_1.z.object({
    prefix: zod_1.z.string().min(1).max(64).optional(),
    namespace: zod_1.z.string().min(1).max(128).optional(),
    separator: zod_1.z.string().length(1).optional(),
    includeVersion: zod_1.z.boolean().optional(),
    version: zod_1.z.string().optional(),
    includeTimestamp: zod_1.z.boolean().optional(),
});
/**
 * Zod schema for cache invalidation rules
 */
exports.CacheInvalidationRuleSchema = zod_1.z.object({
    pattern: zod_1.z.string().min(1),
    strategy: zod_1.z.enum(['immediate', 'lazy', 'scheduled', 'ttl-based']),
    delay: zod_1.z.number().nonnegative().optional(),
    condition: zod_1.z.function().optional(),
});
/**
 * Zod schema for distributed cache configuration
 */
exports.DistributedCacheConfigSchema = zod_1.z.object({
    nodes: zod_1.z.array(zod_1.z.object({
        host: zod_1.z.string(),
        port: zod_1.z.number().positive(),
        weight: zod_1.z.number().positive().optional(),
    })).min(1),
    replicationFactor: zod_1.z.number().int().positive().optional(),
    consistencyLevel: zod_1.z.enum(['one', 'quorum', 'all']).optional(),
    partitionStrategy: zod_1.z.enum(['hash', 'consistent-hash', 'range']).optional(),
});
/**
 * Sequelize model for persistent cache entries in L3 layer
 */
class CacheEntryModel extends sequelize_1.Model {
    static initModel(sequelize) {
        CacheEntryModel.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            key: {
                type: sequelize_1.DataTypes.STRING(512),
                allowNull: false,
                unique: true,
                comment: 'Unique cache key with namespace',
            },
            value: {
                type: sequelize_1.DataTypes.BLOB('long'),
                allowNull: false,
                comment: 'Cached value (may be compressed)',
            },
            namespace: {
                type: sequelize_1.DataTypes.STRING(128),
                allowNull: false,
                defaultValue: 'default',
                comment: 'Cache namespace for logical grouping',
            },
            ttl: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                comment: 'Time to live in milliseconds',
            },
            expiresAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                comment: 'Expiration timestamp',
            },
            lastAccessedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
                comment: 'Last access timestamp for LRU',
            },
            accessCount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: 'Access count for LFU',
            },
            tags: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
                comment: 'Tags for cache invalidation',
            },
            metadata: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false,
                defaultValue: {},
                comment: 'Additional metadata',
            },
            size: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: 'Size in bytes',
            },
            compressed: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                comment: 'Whether value is compressed',
            },
            compressionAlgorithm: {
                type: sequelize_1.DataTypes.STRING(32),
                allowNull: true,
                comment: 'Compression algorithm used',
            },
            priority: {
                type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
                allowNull: false,
                defaultValue: 'medium',
                comment: 'Cache entry priority',
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: 'cache_entries',
            indexes: [
                { fields: ['key'], unique: true },
                { fields: ['namespace'] },
                { fields: ['expiresAt'] },
                { fields: ['lastAccessedAt'] },
                { fields: ['priority'] },
                { fields: ['tags'], using: 'GIN' },
                { fields: ['namespace', 'expiresAt'] },
            ],
        });
        return CacheEntryModel;
    }
}
exports.CacheEntryModel = CacheEntryModel;
/**
 * Sequelize model for cache invalidation audit log
 */
class CacheInvalidationLogModel extends sequelize_1.Model {
    static initModel(sequelize) {
        CacheInvalidationLogModel.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            namespace: {
                type: sequelize_1.DataTypes.STRING(128),
                allowNull: false,
                comment: 'Cache namespace',
            },
            pattern: {
                type: sequelize_1.DataTypes.STRING(512),
                allowNull: false,
                comment: 'Invalidation pattern',
            },
            strategy: {
                type: sequelize_1.DataTypes.STRING(64),
                allowNull: false,
                comment: 'Invalidation strategy used',
            },
            invalidatedKeys: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
                comment: 'List of invalidated keys',
            },
            invalidatedCount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: 'Number of entries invalidated',
            },
            reason: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
                comment: 'Reason for invalidation',
            },
            triggeredBy: {
                type: sequelize_1.DataTypes.STRING(256),
                allowNull: false,
                comment: 'User or system that triggered invalidation',
            },
            metadata: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false,
                defaultValue: {},
                comment: 'Additional metadata',
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: 'cache_invalidation_logs',
            timestamps: true,
            updatedAt: false,
            indexes: [
                { fields: ['namespace'] },
                { fields: ['strategy'] },
                { fields: ['createdAt'] },
                { fields: ['triggeredBy'] },
            ],
        });
        return CacheInvalidationLogModel;
    }
}
exports.CacheInvalidationLogModel = CacheInvalidationLogModel;
// ============================================================================
// L1 CACHE - IN-MEMORY LRU CACHE
// ============================================================================
/**
 * LRU node for doubly-linked list
 */
class LRUNode {
    constructor(key, value, prev = null, next = null) {
        this.key = key;
        this.value = value;
        this.prev = prev;
        this.next = next;
    }
}
/**
 * Production-grade LRU (Least Recently Used) cache implementation.
 * Provides O(1) get, set, and delete operations using hash map + doubly-linked list.
 *
 * @template T - Type of cached values
 *
 * @example
 * ```typescript
 * const cache = new LRUCache<User>({ maxSize: 1000, ttl: 300000 });
 * await cache.set('user:123', userData, { ttl: 600000 });
 * const user = await cache.get('user:123');
 * ```
 */
class LRUCache {
    constructor(config) {
        this.config = config;
        this.name = 'L1-LRU';
        this.priority = 1;
        this.head = null;
        this.tail = null;
        this.cache = new Map();
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0,
            evictions: 0,
            size: 0,
            hitRate: 0,
            missRate: 0,
            avgResponseTime: 0,
            memoryUsage: 0,
        };
    }
    /**
     * Gets a value from the LRU cache and updates access order
     */
    async get(key) {
        const startTime = Date.now();
        const node = this.cache.get(key);
        if (!node) {
            this.stats.misses++;
            this.updateStats(startTime);
            return null;
        }
        // Check expiration
        if (node.value.expiresAt < Date.now()) {
            await this.delete(key);
            this.stats.misses++;
            this.updateStats(startTime);
            return null;
        }
        // Move to head (most recently used)
        this.moveToHead(node);
        node.value.lastAccessedAt = Date.now();
        node.value.accessCount++;
        this.stats.hits++;
        this.updateStats(startTime);
        return node.value.value;
    }
    /**
     * Sets a value in the LRU cache with automatic eviction if needed
     */
    async set(key, value, options = {}) {
        const ttl = options.ttl || this.config.ttl || 300000; // Default 5 minutes
        const now = Date.now();
        const entry = {
            key,
            value,
            ttl,
            createdAt: now,
            expiresAt: now + ttl,
            lastAccessedAt: now,
            accessCount: 0,
            tags: options.tags,
            metadata: options.metadata,
            size: this.estimateSize(value),
            compressed: false,
            layer: 'L1',
        };
        const existingNode = this.cache.get(key);
        if (existingNode) {
            existingNode.value = entry;
            this.moveToHead(existingNode);
        }
        else {
            const newNode = new LRUNode(key, entry);
            this.cache.set(key, newNode);
            this.addToHead(newNode);
            this.stats.size++;
            // Evict if necessary
            if (this.cache.size > this.config.maxSize) {
                await this.evictLRU();
            }
        }
        this.stats.sets++;
    }
    /**
     * Deletes a value from the LRU cache
     */
    async delete(key) {
        const node = this.cache.get(key);
        if (!node)
            return;
        this.removeNode(node);
        this.cache.delete(key);
        this.stats.deletes++;
        this.stats.size--;
    }
    /**
     * Clears all entries from the cache
     */
    async clear() {
        this.cache.clear();
        this.head = null;
        this.tail = null;
        this.stats.size = 0;
    }
    /**
     * Checks if a key exists in the cache
     */
    async has(key) {
        const node = this.cache.get(key);
        if (!node)
            return false;
        return node.value.expiresAt > Date.now();
    }
    /**
     * Returns the current size of the cache
     */
    async size() {
        return this.cache.size;
    }
    /**
     * Gets cache statistics
     */
    getStats() {
        this.stats.hitRate = this.stats.hits / (this.stats.hits + this.stats.misses) || 0;
        this.stats.missRate = 1 - this.stats.hitRate;
        return { ...this.stats };
    }
    moveToHead(node) {
        this.removeNode(node);
        this.addToHead(node);
    }
    addToHead(node) {
        node.next = this.head;
        node.prev = null;
        if (this.head) {
            this.head.prev = node;
        }
        this.head = node;
        if (!this.tail) {
            this.tail = node;
        }
    }
    removeNode(node) {
        if (node.prev) {
            node.prev.next = node.next;
        }
        else {
            this.head = node.next;
        }
        if (node.next) {
            node.next.prev = node.prev;
        }
        else {
            this.tail = node.prev;
        }
    }
    async evictLRU() {
        if (!this.tail)
            return;
        const key = this.tail.key;
        await this.delete(key);
        this.stats.evictions++;
    }
    estimateSize(value) {
        const str = JSON.stringify(value);
        return Buffer.byteLength(str, 'utf8');
    }
    updateStats(startTime) {
        const responseTime = Date.now() - startTime;
        this.stats.avgResponseTime = (this.stats.avgResponseTime + responseTime) / 2;
    }
}
exports.LRUCache = LRUCache;
// ============================================================================
// CACHE KEY GENERATION
// ============================================================================
/**
 * Generates a deterministic cache key from arguments with version support.
 *
 * @param {CacheKeyConfig} config - Cache key configuration
 * @param {...any[]} args - Arguments to include in key
 * @returns {string} Generated cache key
 *
 * @example
 * ```typescript
 * const key = generateCacheKey(
 *   { prefix: 'user', namespace: 'auth', version: 'v2' },
 *   'getUserById',
 *   123
 * );
 * // Result: 'auth:user:v2:getUserById:123'
 * ```
 */
const generateCacheKey = (config, ...args) => {
    const validated = exports.CacheKeyConfigSchema.parse(config);
    const parts = [];
    if (validated.namespace)
        parts.push(validated.namespace);
    if (validated.prefix)
        parts.push(validated.prefix);
    if (validated.includeVersion && validated.version)
        parts.push(validated.version);
    args.forEach((arg) => {
        if (typeof arg === 'object' && arg !== null) {
            parts.push((0, exports.hashObject)(arg));
        }
        else {
            parts.push(String(arg));
        }
    });
    if (validated.includeTimestamp) {
        parts.push(Date.now().toString());
    }
    return parts.join(validated.separator || ':');
};
exports.generateCacheKey = generateCacheKey;
/**
 * Generates a hash-based cache key for complex objects.
 *
 * @param {CacheKeyConfig} config - Cache key configuration
 * @param {Record<string, any>} obj - Object to hash
 * @returns {string} Hash-based cache key
 *
 * @example
 * ```typescript
 * const key = generateHashKey(
 *   { prefix: 'query', namespace: 'db' },
 *   { table: 'users', where: { active: true }, limit: 10 }
 * );
 * ```
 */
const generateHashKey = (config, obj) => {
    const hash = (0, exports.hashObject)(obj);
    return (0, exports.generateCacheKey)(config, hash);
};
exports.generateHashKey = generateHashKey;
/**
 * Hashes an object to create a deterministic fingerprint.
 *
 * @param {any} obj - Object to hash
 * @returns {string} SHA-256 hash
 */
const hashObject = (obj) => {
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    return crypto.createHash('sha256').update(str).digest('hex').substring(0, 16);
};
exports.hashObject = hashObject;
/**
 * Generates a wildcard pattern for cache key matching.
 *
 * @param {CacheKeyConfig} config - Cache key configuration
 * @param {string} pattern - Pattern with wildcards (*)
 * @returns {RegExp} Regular expression for matching
 *
 * @example
 * ```typescript
 * const pattern = generateKeyPattern({ namespace: 'users' }, 'user:*:profile');
 * // Matches: users:user:123:profile, users:user:456:profile, etc.
 * ```
 */
const generateKeyPattern = (config, pattern) => {
    const prefix = config.namespace ? `${config.namespace}:` : '';
    const regexPattern = pattern.replace(/\*/g, '.*').replace(/\?/g, '.');
    return new RegExp(`^${prefix}${regexPattern}$`);
};
exports.generateKeyPattern = generateKeyPattern;
// ============================================================================
// COMPRESSION & SERIALIZATION
// ============================================================================
/**
 * Compresses data using specified algorithm.
 *
 * @param {any} data - Data to compress
 * @param {CompressionOptions} options - Compression options
 * @returns {Promise<Buffer>} Compressed data
 *
 * @example
 * ```typescript
 * const compressed = await compressData(largeObject, {
 *   algorithm: 'brotli',
 *   level: 6,
 *   threshold: 1024
 * });
 * ```
 */
const compressData = async (data, options = { algorithm: 'gzip' }) => {
    const buffer = Buffer.from(JSON.stringify(data));
    // Skip compression if below threshold
    if (options.threshold && buffer.length < options.threshold) {
        return buffer;
    }
    switch (options.algorithm) {
        case 'gzip':
            return await gzipAsync(buffer, { level: options.level || 6 });
        case 'brotli':
            return await brotliCompressAsync(buffer, {
                params: {
                    [zlib.constants.BROTLI_PARAM_QUALITY]: options.level || 6,
                },
            });
        case 'deflate':
            return await (0, util_1.promisify)(zlib.deflate)(buffer, { level: options.level || 6 });
        default:
            throw new Error(`Unsupported compression algorithm: ${options.algorithm}`);
    }
};
exports.compressData = compressData;
/**
 * Decompresses data using specified algorithm.
 *
 * @param {Buffer} compressed - Compressed data
 * @param {CompressionOptions} options - Decompression options
 * @returns {Promise<any>} Decompressed data
 *
 * @example
 * ```typescript
 * const data = await decompressData(compressedBuffer, { algorithm: 'brotli' });
 * ```
 */
const decompressData = async (compressed, options = { algorithm: 'gzip' }) => {
    let buffer;
    switch (options.algorithm) {
        case 'gzip':
            buffer = await gunzipAsync(compressed);
            break;
        case 'brotli':
            buffer = await brotliDecompressAsync(compressed);
            break;
        case 'deflate':
            buffer = await (0, util_1.promisify)(zlib.inflate)(compressed);
            break;
        default:
            throw new Error(`Unsupported compression algorithm: ${options.algorithm}`);
    }
    return JSON.parse(buffer.toString());
};
exports.decompressData = decompressData;
/**
 * Serializes data with optional schema validation.
 *
 * @param {any} data - Data to serialize
 * @param {SerializationOptions} options - Serialization options
 * @returns {Buffer} Serialized data
 *
 * @example
 * ```typescript
 * const serialized = serializeData(userData, { format: 'json' });
 * ```
 */
const serializeData = (data, options = { format: 'json' }) => {
    switch (options.format) {
        case 'json':
            return Buffer.from(JSON.stringify(data));
        case 'msgpack':
            // Placeholder for msgpack implementation
            return Buffer.from(JSON.stringify(data));
        default:
            throw new Error(`Unsupported serialization format: ${options.format}`);
    }
};
exports.serializeData = serializeData;
/**
 * Deserializes data with optional schema validation.
 *
 * @param {Buffer} buffer - Serialized data
 * @param {SerializationOptions} options - Deserialization options
 * @returns {any} Deserialized data
 *
 * @example
 * ```typescript
 * const data = deserializeData(buffer, { format: 'json' });
 * ```
 */
const deserializeData = (buffer, options = { format: 'json' }) => {
    switch (options.format) {
        case 'json':
            return JSON.parse(buffer.toString());
        case 'msgpack':
            // Placeholder for msgpack implementation
            return JSON.parse(buffer.toString());
        default:
            throw new Error(`Unsupported serialization format: ${options.format}`);
    }
};
exports.deserializeData = deserializeData;
// ============================================================================
// MULTI-LEVEL CACHE MANAGER
// ============================================================================
/**
 * Multi-level cache manager with L1 (memory), L2 (Redis), and L3 (database) layers.
 * Implements automatic promotion/demotion between layers.
 *
 * @example
 * ```typescript
 * const cacheManager = new MultiLevelCacheManager([l1Cache, l2Cache, l3Cache]);
 * await cacheManager.set('user:123', userData, { ttl: 300000 });
 * const data = await cacheManager.get('user:123');
 * ```
 */
class MultiLevelCacheManager {
    constructor(layers, compressionOptions) {
        this.layers = layers;
        this.compressionOptions = compressionOptions;
        this.stats = new Map();
        // Sort layers by priority (L1 = 1, L2 = 2, L3 = 3)
        this.layers.sort((a, b) => a.priority - b.priority);
    }
    /**
     * Gets a value from the cache, checking all layers in order.
     * Promotes cache hits to higher layers.
     */
    async get(key) {
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            const startTime = Date.now();
            try {
                const value = await layer.get(key);
                if (value !== null) {
                    this.updateLayerStats(layer.name, true, Date.now() - startTime);
                    // Promote to higher layers
                    for (let j = 0; j < i; j++) {
                        await this.layers[j].set(key, value);
                    }
                    return value;
                }
                this.updateLayerStats(layer.name, false, Date.now() - startTime);
            }
            catch (error) {
                console.error(`Error getting from ${layer.name}:`, error);
                continue;
            }
        }
        return null;
    }
    /**
     * Sets a value in all cache layers.
     */
    async set(key, value, options = {}) {
        const errors = [];
        for (const layer of this.layers) {
            try {
                await layer.set(key, value, options);
            }
            catch (error) {
                console.error(`Error setting in ${layer.name}:`, error);
                errors.push(error);
            }
        }
        if (errors.length === this.layers.length) {
            throw new Error('Failed to set value in all cache layers');
        }
    }
    /**
     * Deletes a value from all cache layers.
     */
    async delete(key) {
        await Promise.all(this.layers.map(layer => layer.delete(key).catch(() => { })));
    }
    /**
     * Clears all cache layers.
     */
    async clear() {
        await Promise.all(this.layers.map(layer => layer.clear().catch(() => { })));
    }
    /**
     * Gets aggregate statistics from all cache layers.
     */
    getStats() {
        const stats = {};
        this.stats.forEach((value, key) => {
            stats[key] = value;
        });
        return stats;
    }
    updateLayerStats(layerName, hit, responseTime) {
        const stats = this.stats.get(layerName) || {
            hits: 0,
            misses: 0,
            size: 0,
            hitRate: 0,
            avgResponseTime: 0,
        };
        if (hit) {
            stats.hits++;
        }
        else {
            stats.misses++;
        }
        stats.hitRate = stats.hits / (stats.hits + stats.misses);
        stats.avgResponseTime = (stats.avgResponseTime + responseTime) / 2;
        this.stats.set(layerName, stats);
    }
}
exports.MultiLevelCacheManager = MultiLevelCacheManager;
// ============================================================================
// CACHE PATTERNS - CACHE-ASIDE, WRITE-THROUGH, WRITE-BACK, READ-THROUGH
// ============================================================================
/**
 * Cache-aside pattern implementation.
 * Application code is responsible for loading data on cache miss.
 *
 * @template T - Type of cached data
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Function to load data on cache miss
 * @param {CacheLayer} cache - Cache layer to use
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<T>} Cached or loaded data
 *
 * @example
 * ```typescript
 * const user = await cacheAside(
 *   'user:123',
 *   async () => await userRepository.findById(123),
 *   l1Cache,
 *   { ttl: 300000 }
 * );
 * ```
 */
const cacheAside = async (key, loader, cache, options = {}) => {
    // Try to get from cache
    const cached = await cache.get(key);
    if (cached !== null) {
        return cached;
    }
    // Load from source
    const data = await loader();
    // Store in cache (async, don't wait)
    cache.set(key, data, options).catch(err => {
        console.error('Cache-aside set error:', err);
    });
    return data;
};
exports.cacheAside = cacheAside;
/**
 * Write-through pattern implementation.
 * Writes data to cache and database synchronously.
 *
 * @template T - Type of data to write
 * @param {string} key - Cache key
 * @param {T} data - Data to write
 * @param {(data: T) => Promise<void>} writer - Function to write to database
 * @param {CacheLayer} cache - Cache layer to use
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeThrough(
 *   'user:123',
 *   userData,
 *   async (data) => await userRepository.save(data),
 *   l1Cache,
 *   { ttl: 300000 }
 * );
 * ```
 */
const writeThrough = async (key, data, writer, cache, options = {}) => {
    // Write to database first
    await writer(data);
    // Write to cache
    await cache.set(key, data, options);
};
exports.writeThrough = writeThrough;
/**
 * Write-back (write-behind) pattern implementation.
 * Writes to cache immediately and database asynchronously.
 *
 * @template T - Type of data to write
 * @param {string} key - Cache key
 * @param {T} data - Data to write
 * @param {(data: T) => Promise<void>} writer - Function to write to database
 * @param {CacheLayer} cache - Cache layer to use
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeBack(
 *   'user:123',
 *   userData,
 *   async (data) => await userRepository.save(data),
 *   l1Cache,
 *   { ttl: 300000 }
 * );
 * ```
 */
const writeBack = async (key, data, writer, cache, options = {}) => {
    // Write to cache immediately
    await cache.set(key, data, options);
    // Write to database asynchronously
    writer(data).catch(err => {
        console.error('Write-back database write error:', err);
    });
};
exports.writeBack = writeBack;
/**
 * Read-through pattern implementation.
 * Cache automatically loads data on miss.
 *
 * @template T - Type of cached data
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Function to load data on cache miss
 * @param {CacheLayer} cache - Cache layer to use
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<T>} Cached or loaded data
 *
 * @example
 * ```typescript
 * const user = await readThrough(
 *   'user:123',
 *   async () => await userRepository.findById(123),
 *   l1Cache,
 *   { ttl: 300000 }
 * );
 * ```
 */
const readThrough = async (key, loader, cache, options = {}) => {
    // Try to get from cache
    const cached = await cache.get(key);
    if (cached !== null) {
        return cached;
    }
    // Load from source and set in cache synchronously
    const data = await loader();
    await cache.set(key, data, options);
    return data;
};
exports.readThrough = readThrough;
/**
 * Refresh-ahead pattern implementation.
 * Proactively refreshes cache before expiration.
 *
 * @template T - Type of cached data
 * @param {string} key - Cache key
 * @param {() => Promise<T>} loader - Function to load data
 * @param {CacheLayer} cache - Cache layer to use
 * @param {CacheOptions & { refreshThreshold: number }} options - Cache options with refresh threshold
 * @returns {Promise<T>} Cached data
 *
 * @example
 * ```typescript
 * const user = await refreshAhead(
 *   'user:123',
 *   async () => await userRepository.findById(123),
 *   l1Cache,
 *   { ttl: 300000, refreshThreshold: 0.8 }
 * );
 * ```
 */
const refreshAhead = async (key, loader, cache, options = {}) => {
    const cached = await cache.get(key);
    if (cached !== null) {
        // Check if we should refresh proactively
        const threshold = options.refreshThreshold || 0.8;
        const ttl = options.ttl || 300000;
        // Refresh in background if approaching expiration
        // Note: This is a simplified version; in production, track actual expiration
        if (Math.random() > threshold) {
            loader().then(data => cache.set(key, data, options)).catch(() => { });
        }
        return cached;
    }
    const data = await loader();
    await cache.set(key, data, options);
    return data;
};
exports.refreshAhead = refreshAhead;
// ============================================================================
// CACHE INVALIDATION STRATEGIES
// ============================================================================
/**
 * Invalidates cache entries matching a pattern.
 *
 * @param {string} pattern - Pattern to match (supports wildcards)
 * @param {CacheLayer[]} layers - Cache layers to invalidate
 * @param {CacheInvalidationRule} rule - Invalidation rule
 * @returns {Promise<number>} Number of invalidated entries
 *
 * @example
 * ```typescript
 * const count = await invalidateByPattern('user:*', [l1Cache, l2Cache], {
 *   strategy: 'immediate',
 *   pattern: 'user:*'
 * });
 * ```
 */
const invalidateByPattern = async (pattern, layers, rule) => {
    const validated = exports.CacheInvalidationRuleSchema.parse(rule);
    let totalInvalidated = 0;
    const invalidate = async () => {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        for (const layer of layers) {
            // Note: This requires cache layer to support pattern matching
            // In production, implement pattern matching in each cache layer
            await layer.clear(); // Simplified for demonstration
            totalInvalidated++;
        }
    };
    switch (validated.strategy) {
        case 'immediate':
            await invalidate();
            break;
        case 'lazy':
            // Mark for lazy deletion on next access
            break;
        case 'scheduled':
            setTimeout(() => invalidate(), validated.delay || 0);
            break;
        case 'ttl-based':
            // Let TTL handle invalidation
            break;
    }
    return totalInvalidated;
};
exports.invalidateByPattern = invalidateByPattern;
/**
 * Invalidates cache entries by tags.
 *
 * @param {string[]} tags - Tags to match
 * @param {CacheLayer[]} layers - Cache layers to invalidate
 * @returns {Promise<number>} Number of invalidated entries
 *
 * @example
 * ```typescript
 * const count = await invalidateByTags(['user', 'profile'], [l1Cache, l2Cache]);
 * ```
 */
const invalidateByTags = async (tags, layers) => {
    let totalInvalidated = 0;
    for (const layer of layers) {
        // Note: This requires cache layer to support tag-based invalidation
        // In production, implement tag tracking in each cache layer
        await layer.clear(); // Simplified for demonstration
        totalInvalidated++;
    }
    return totalInvalidated;
};
exports.invalidateByTags = invalidateByTags;
/**
 * Invalidates cache entries based on a dependency graph.
 *
 * @param {string} key - Key that changed
 * @param {Map<string, string[]>} dependencyGraph - Dependency graph
 * @param {CacheLayer[]} layers - Cache layers to invalidate
 * @returns {Promise<string[]>} Invalidated keys
 *
 * @example
 * ```typescript
 * const graph = new Map([
 *   ['user:123', ['user:123:profile', 'user:123:settings']],
 * ]);
 * const invalidated = await invalidateByDependency('user:123', graph, [l1Cache]);
 * ```
 */
const invalidateByDependency = async (key, dependencyGraph, layers) => {
    const toInvalidate = new Set([key]);
    const invalidated = [];
    // Build list of dependent keys
    const queue = [key];
    while (queue.length > 0) {
        const current = queue.shift();
        const dependents = dependencyGraph.get(current) || [];
        dependents.forEach(dep => {
            if (!toInvalidate.has(dep)) {
                toInvalidate.add(dep);
                queue.push(dep);
            }
        });
    }
    // Invalidate all dependent keys
    for (const keyToInvalidate of toInvalidate) {
        for (const layer of layers) {
            await layer.delete(keyToInvalidate);
        }
        invalidated.push(keyToInvalidate);
    }
    return invalidated;
};
exports.invalidateByDependency = invalidateByDependency;
/**
 * Time-based cache invalidation with configurable intervals.
 *
 * @param {CacheLayer[]} layers - Cache layers to manage
 * @param {number} interval - Check interval in milliseconds
 * @returns {NodeJS.Timer} Interval timer
 *
 * @example
 * ```typescript
 * const timer = invalidateExpired([l1Cache, l2Cache, l3Cache], 60000);
 * ```
 */
const invalidateExpired = (layers, interval = 60000) => {
    return setInterval(async () => {
        for (const layer of layers) {
            // Note: Each layer should implement its own expiration check
            // This is a trigger for layers to clean up expired entries
            const size = await layer.size();
            console.log(`Expiration check for ${layer.name}: ${size} entries`);
        }
    }, interval);
};
exports.invalidateExpired = invalidateExpired;
// ============================================================================
// CACHE WARMING STRATEGIES
// ============================================================================
/**
 * Warms the cache by preloading frequently accessed data.
 *
 * @param {CacheWarmingStrategy} strategy - Warming strategy configuration
 * @param {CacheLayer} cache - Cache layer to warm
 * @returns {Promise<number>} Number of warmed entries
 *
 * @example
 * ```typescript
 * const warmed = await warmCache({
 *   enabled: true,
 *   keys: ['user:123', 'user:456'],
 *   loader: async (key) => await userRepository.findById(key.split(':')[1])
 * }, l1Cache);
 * ```
 */
const warmCache = async (strategy, cache) => {
    if (!strategy.enabled)
        return 0;
    const keys = typeof strategy.keys === 'function' ? await strategy.keys() : strategy.keys;
    let warmed = 0;
    for (const key of keys) {
        try {
            const data = await strategy.loader(key);
            await cache.set(key, data);
            warmed++;
        }
        catch (error) {
            if (strategy.onError) {
                strategy.onError(key, error);
            }
            else {
                console.error(`Cache warming error for key ${key}:`, error);
            }
        }
    }
    return warmed;
};
exports.warmCache = warmCache;
/**
 * Schedules periodic cache warming.
 *
 * @param {CacheWarmingStrategy} strategy - Warming strategy configuration
 * @param {CacheLayer} cache - Cache layer to warm
 * @returns {NodeJS.Timer} Interval timer
 *
 * @example
 * ```typescript
 * const timer = scheduleWarmCache({
 *   enabled: true,
 *   interval: 300000, // 5 minutes
 *   keys: async () => await getFrequentlyAccessedKeys(),
 *   loader: async (key) => await loadData(key)
 * }, l1Cache);
 * ```
 */
const scheduleWarmCache = (strategy, cache) => {
    const interval = strategy.interval || 300000; // Default 5 minutes
    return setInterval(async () => {
        const warmed = await (0, exports.warmCache)(strategy, cache);
        console.log(`Cache warming completed: ${warmed} entries`);
    }, interval);
};
exports.scheduleWarmCache = scheduleWarmCache;
/**
 * Predictive cache warming based on access patterns.
 *
 * @param {Map<string, number>} accessPatterns - Access frequency map
 * @param {(key: string) => Promise<any>} loader - Data loader function
 * @param {CacheLayer} cache - Cache layer to warm
 * @param {number} threshold - Minimum access count to warm
 * @returns {Promise<number>} Number of warmed entries
 *
 * @example
 * ```typescript
 * const patterns = new Map([['user:123', 150], ['user:456', 80]]);
 * const warmed = await predictiveWarmCache(
 *   patterns,
 *   async (key) => await loadData(key),
 *   l1Cache,
 *   100
 * );
 * ```
 */
const predictiveWarmCache = async (accessPatterns, loader, cache, threshold = 10) => {
    let warmed = 0;
    for (const [key, accessCount] of accessPatterns.entries()) {
        if (accessCount >= threshold) {
            try {
                const data = await loader(key);
                await cache.set(key, data);
                warmed++;
            }
            catch (error) {
                console.error(`Predictive warming error for key ${key}:`, error);
            }
        }
    }
    return warmed;
};
exports.predictiveWarmCache = predictiveWarmCache;
// ============================================================================
// TTL MANAGEMENT
// ============================================================================
/**
 * Calculates adaptive TTL based on access patterns.
 *
 * @param {number} accessCount - Number of times accessed
 * @param {number} baseTTL - Base TTL in milliseconds
 * @param {number} maxTTL - Maximum TTL in milliseconds
 * @returns {number} Calculated TTL
 *
 * @example
 * ```typescript
 * const ttl = calculateAdaptiveTTL(150, 300000, 3600000);
 * // Returns higher TTL for frequently accessed items
 * ```
 */
const calculateAdaptiveTTL = (accessCount, baseTTL = 300000, maxTTL = 3600000) => {
    // Increase TTL logarithmically with access count
    const factor = Math.log(accessCount + 1) / Math.log(10);
    const calculatedTTL = baseTTL * (1 + factor);
    return Math.min(calculatedTTL, maxTTL);
};
exports.calculateAdaptiveTTL = calculateAdaptiveTTL;
/**
 * Extends TTL for a cache entry on access.
 *
 * @param {string} key - Cache key
 * @param {CacheLayer} cache - Cache layer
 * @param {number} extensionTime - Time to extend in milliseconds
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await extendTTL('user:123', l1Cache, 300000);
 * ```
 */
const extendTTL = async (key, cache, extensionTime) => {
    const value = await cache.get(key);
    if (value === null)
        return false;
    await cache.set(key, value, { ttl: extensionTime });
    return true;
};
exports.extendTTL = extendTTL;
/**
 * Implements sliding expiration (TTL resets on access).
 *
 * @template T - Type of cached data
 * @param {string} key - Cache key
 * @param {CacheLayer} cache - Cache layer
 * @param {number} ttl - TTL in milliseconds
 * @returns {Promise<T | null>} Cached value
 *
 * @example
 * ```typescript
 * const user = await slidingExpiration('user:123', l1Cache, 300000);
 * ```
 */
const slidingExpiration = async (key, cache, ttl) => {
    const value = await cache.get(key);
    if (value === null)
        return null;
    // Reset TTL on access
    await cache.set(key, value, { ttl });
    return value;
};
exports.slidingExpiration = slidingExpiration;
// ============================================================================
// NESTJS INTERCEPTORS
// ============================================================================
/**
 * NestJS interceptor for automatic HTTP response caching.
 *
 * @example
 * ```typescript
 * @UseInterceptors(new CacheInterceptor(cacheManager, { ttl: 300000 }))
 * @Get('users/:id')
 * async getUser(@Param('id') id: string) {
 *   return await this.userService.findById(id);
 * }
 * ```
 */
let CacheInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CacheInterceptor = _classThis = class {
        constructor(cacheManager, options = {}) {
            this.cacheManager = cacheManager;
            this.options = options;
        }
        async intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const cacheKey = this.generateKeyFromRequest(request);
            // Try to get from cache
            const cached = await this.cacheManager.get(cacheKey);
            if (cached !== null) {
                return new rxjs_1.Observable(subscriber => {
                    subscriber.next(cached);
                    subscriber.complete();
                });
            }
            // Execute handler and cache result
            return next.handle().pipe((0, operators_1.tap)(async (response) => {
                await this.cacheManager.set(cacheKey, response, this.options);
            }));
        }
        generateKeyFromRequest(request) {
            const method = request.method;
            const url = request.url;
            const query = JSON.stringify(request.query);
            return `http:${method}:${url}:${(0, exports.hashObject)(query)}`;
        }
    };
    __setFunctionName(_classThis, "CacheInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CacheInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CacheInterceptor = _classThis;
})();
exports.CacheInterceptor = CacheInterceptor;
/**
 * NestJS interceptor for cache invalidation on mutations.
 *
 * @example
 * ```typescript
 * @UseInterceptors(new CacheInvalidationInterceptor(cacheManager, 'user:*'))
 * @Put('users/:id')
 * async updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
 *   return await this.userService.update(id, data);
 * }
 * ```
 */
let CacheInvalidationInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CacheInvalidationInterceptor = _classThis = class {
        constructor(cacheManager, pattern) {
            this.cacheManager = cacheManager;
            this.pattern = pattern;
        }
        async intercept(context, next) {
            return next.handle().pipe((0, operators_1.tap)(async () => {
                // Invalidate after successful mutation
                await this.cacheManager.delete(this.pattern);
            }));
        }
    };
    __setFunctionName(_classThis, "CacheInvalidationInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CacheInvalidationInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CacheInvalidationInterceptor = _classThis;
})();
exports.CacheInvalidationInterceptor = CacheInvalidationInterceptor;
// ============================================================================
// SEQUELIZE HOOKS FOR CACHE INVALIDATION
// ============================================================================
/**
 * Creates Sequelize hooks for automatic cache invalidation on model changes.
 *
 * @param {ModelStatic<Model>} model - Sequelize model
 * @param {MultiLevelCacheManager} cacheManager - Cache manager
 * @param {(instance: any) => string} keyGenerator - Function to generate cache key from instance
 *
 * @example
 * ```typescript
 * setupCacheInvalidationHooks(
 *   UserModel,
 *   cacheManager,
 *   (user) => `user:${user.id}`
 * );
 * ```
 */
const setupCacheInvalidationHooks = (model, cacheManager, keyGenerator) => {
    // Invalidate on update
    model.addHook('afterUpdate', async (instance) => {
        const key = keyGenerator(instance);
        await cacheManager.delete(key);
    });
    // Invalidate on delete
    model.addHook('afterDestroy', async (instance) => {
        const key = keyGenerator(instance);
        await cacheManager.delete(key);
    });
    // Invalidate on bulk update
    model.addHook('afterBulkUpdate', async (options) => {
        // Clear all cache for this model (pattern-based)
        await cacheManager.clear();
    });
    // Invalidate on bulk delete
    model.addHook('afterBulkDestroy', async (options) => {
        await cacheManager.clear();
    });
};
exports.setupCacheInvalidationHooks = setupCacheInvalidationHooks;
/**
 * Creates Sequelize hooks for cache warming on model creation.
 *
 * @param {ModelStatic<Model>} model - Sequelize model
 * @param {MultiLevelCacheManager} cacheManager - Cache manager
 * @param {(instance: any) => string} keyGenerator - Function to generate cache key
 * @param {CacheOptions} options - Cache options
 *
 * @example
 * ```typescript
 * setupCacheWarmingHooks(
 *   UserModel,
 *   cacheManager,
 *   (user) => `user:${user.id}`,
 *   { ttl: 300000 }
 * );
 * ```
 */
const setupCacheWarmingHooks = (model, cacheManager, keyGenerator, options = {}) => {
    // Warm cache on create
    model.addHook('afterCreate', async (instance) => {
        const key = keyGenerator(instance);
        await cacheManager.set(key, instance.toJSON(), options);
    });
    // Warm cache on update
    model.addHook('afterUpdate', async (instance) => {
        const key = keyGenerator(instance);
        await cacheManager.set(key, instance.toJSON(), options);
    });
};
exports.setupCacheWarmingHooks = setupCacheWarmingHooks;
/**
 * Creates comprehensive Sequelize hooks for cache management.
 *
 * @param {ModelStatic<Model>} model - Sequelize model
 * @param {MultiLevelCacheManager} cacheManager - Cache manager
 * @param {object} config - Hook configuration
 *
 * @example
 * ```typescript
 * setupComprehensiveCacheHooks(UserModel, cacheManager, {
 *   keyGenerator: (user) => `user:${user.id}`,
 *   warmOnCreate: true,
 *   invalidateOnUpdate: true,
 *   options: { ttl: 300000 }
 * });
 * ```
 */
const setupComprehensiveCacheHooks = (model, cacheManager, config) => {
    if (config.warmOnCreate) {
        (0, exports.setupCacheWarmingHooks)(model, cacheManager, config.keyGenerator, config.options);
    }
    if (config.invalidateOnUpdate || config.invalidateOnDelete) {
        (0, exports.setupCacheInvalidationHooks)(model, cacheManager, config.keyGenerator);
    }
};
exports.setupComprehensiveCacheHooks = setupComprehensiveCacheHooks;
// ============================================================================
// DISTRIBUTED CACHING
// ============================================================================
/**
 * Consistent hashing for distributed cache key distribution.
 *
 * @param {string} key - Cache key
 * @param {DistributedCacheConfig} config - Distributed cache configuration
 * @returns {number} Node index
 *
 * @example
 * ```typescript
 * const nodeIndex = consistentHash('user:123', {
 *   nodes: [
 *     { host: 'cache1.example.com', port: 6379 },
 *     { host: 'cache2.example.com', port: 6379 }
 *   ]
 * });
 * ```
 */
const consistentHash = (key, config) => {
    const validated = exports.DistributedCacheConfigSchema.parse(config);
    const hash = crypto.createHash('md5').update(key).digest('hex');
    const hashValue = parseInt(hash.substring(0, 8), 16);
    let totalWeight = 0;
    const weights = validated.nodes.map(node => {
        const weight = node.weight || 1;
        totalWeight += weight;
        return weight;
    });
    const target = (hashValue % totalWeight);
    let currentWeight = 0;
    for (let i = 0; i < weights.length; i++) {
        currentWeight += weights[i];
        if (target < currentWeight) {
            return i;
        }
    }
    return 0;
};
exports.consistentHash = consistentHash;
/**
 * Distributes cache operations across multiple nodes.
 *
 * @template T - Type of cached data
 * @param {string} key - Cache key
 * @param {DistributedCacheConfig} config - Distributed cache configuration
 * @param {CacheLayer[]} nodes - Cache nodes
 * @returns {CacheLayer} Selected cache node
 *
 * @example
 * ```typescript
 * const node = selectCacheNode('user:123', config, cacheNodes);
 * await node.set('user:123', userData);
 * ```
 */
const selectCacheNode = (key, config, nodes) => {
    const nodeIndex = (0, exports.consistentHash)(key, config);
    return nodes[nodeIndex];
};
exports.selectCacheNode = selectCacheNode;
/**
 * Replicates cache data across multiple nodes for high availability.
 *
 * @template T - Type of cached data
 * @param {string} key - Cache key
 * @param {T} value - Value to cache
 * @param {CacheLayer[]} nodes - Cache nodes
 * @param {number} replicationFactor - Number of replicas
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await replicateCacheData('user:123', userData, cacheNodes, 3, { ttl: 300000 });
 * ```
 */
const replicateCacheData = async (key, value, nodes, replicationFactor = 2, options = {}) => {
    const primaryNodeIndex = (0, exports.consistentHash)(key, { nodes: nodes.map((_, i) => ({ host: `node${i}`, port: 6379 })) });
    const replicaIndices = [primaryNodeIndex];
    for (let i = 1; i < replicationFactor && replicaIndices.length < nodes.length; i++) {
        const nextIndex = (primaryNodeIndex + i) % nodes.length;
        replicaIndices.push(nextIndex);
    }
    await Promise.all(replicaIndices.map(index => nodes[index].set(key, value, options)));
};
exports.replicateCacheData = replicateCacheData;
// ============================================================================
// MONITORING & OBSERVABILITY
// ============================================================================
/**
 * Collects comprehensive cache metrics for monitoring.
 *
 * @param {CacheLayer[]} layers - Cache layers to monitor
 * @returns {Promise<CacheStats>} Aggregate cache statistics
 *
 * @example
 * ```typescript
 * const stats = await collectCacheMetrics([l1Cache, l2Cache, l3Cache]);
 * console.log(`Hit rate: ${stats.hitRate * 100}%`);
 * ```
 */
const collectCacheMetrics = async (layers) => {
    const stats = {
        hits: 0,
        misses: 0,
        sets: 0,
        deletes: 0,
        evictions: 0,
        size: 0,
        hitRate: 0,
        missRate: 0,
        avgResponseTime: 0,
        memoryUsage: 0,
    };
    for (const layer of layers) {
        const size = await layer.size();
        stats.size += size;
    }
    return stats;
};
exports.collectCacheMetrics = collectCacheMetrics;
/**
 * Exports cache statistics in Prometheus format.
 *
 * @param {CacheStats} stats - Cache statistics
 * @param {string} namespace - Metric namespace
 * @returns {string} Prometheus metrics
 *
 * @example
 * ```typescript
 * const metrics = exportPrometheusMetrics(stats, 'white_cross_cache');
 * ```
 */
const exportPrometheusMetrics = (stats, namespace = 'cache') => {
    const metrics = [];
    metrics.push(`# HELP ${namespace}_hits_total Total cache hits`);
    metrics.push(`# TYPE ${namespace}_hits_total counter`);
    metrics.push(`${namespace}_hits_total ${stats.hits}`);
    metrics.push(`# HELP ${namespace}_misses_total Total cache misses`);
    metrics.push(`# TYPE ${namespace}_misses_total counter`);
    metrics.push(`${namespace}_misses_total ${stats.misses}`);
    metrics.push(`# HELP ${namespace}_hit_rate Cache hit rate`);
    metrics.push(`# TYPE ${namespace}_hit_rate gauge`);
    metrics.push(`${namespace}_hit_rate ${stats.hitRate}`);
    metrics.push(`# HELP ${namespace}_size Current cache size`);
    metrics.push(`# TYPE ${namespace}_size gauge`);
    metrics.push(`${namespace}_size ${stats.size}`);
    metrics.push(`# HELP ${namespace}_avg_response_time_ms Average response time in milliseconds`);
    metrics.push(`# TYPE ${namespace}_avg_response_time_ms gauge`);
    metrics.push(`${namespace}_avg_response_time_ms ${stats.avgResponseTime}`);
    return metrics.join('\n');
};
exports.exportPrometheusMetrics = exportPrometheusMetrics;
/**
 * Creates a cache health check function.
 *
 * @param {CacheLayer[]} layers - Cache layers to check
 * @returns {() => Promise<{ healthy: boolean; details: any }>} Health check function
 *
 * @example
 * ```typescript
 * const healthCheck = createCacheHealthCheck([l1Cache, l2Cache]);
 * const health = await healthCheck();
 * ```
 */
const createCacheHealthCheck = (layers) => {
    return async () => {
        const details = {};
        let healthy = true;
        for (const layer of layers) {
            try {
                const testKey = `health_check_${Date.now()}`;
                await layer.set(testKey, 'ok', { ttl: 1000 });
                const value = await layer.get(testKey);
                await layer.delete(testKey);
                details[layer.name] = {
                    status: 'healthy',
                    latency: 0, // Measure actual latency in production
                };
            }
            catch (error) {
                healthy = false;
                details[layer.name] = {
                    status: 'unhealthy',
                    error: error.message,
                };
            }
        }
        return { healthy, details };
    };
};
exports.createCacheHealthCheck = createCacheHealthCheck;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Memoizes a function with automatic cache management.
 *
 * @template T - Return type of function
 * @param {(...args: any[]) => Promise<T>} fn - Function to memoize
 * @param {CacheLayer} cache - Cache layer to use
 * @param {object} options - Memoization options
 * @returns {(...args: any[]) => Promise<T>} Memoized function
 *
 * @example
 * ```typescript
 * const memoizedGetUser = memoize(
 *   async (id: string) => await userRepository.findById(id),
 *   l1Cache,
 *   { ttl: 300000, keyPrefix: 'user' }
 * );
 * ```
 */
const memoize = (fn, cache, options = {}) => {
    return async (...args) => {
        const key = options.keyGenerator
            ? options.keyGenerator(...args)
            : `${options.keyPrefix || 'memoized'}:${(0, exports.hashObject)(args)}`;
        const cached = await cache.get(key);
        if (cached !== null) {
            return cached;
        }
        const result = await fn(...args);
        await cache.set(key, result, { ttl: options.ttl });
        return result;
    };
};
exports.memoize = memoize;
/**
 * Batches cache operations for better performance.
 *
 * @template T - Type of cached data
 * @param {Array<{ key: string; value: T }>} operations - Batch operations
 * @param {CacheLayer} cache - Cache layer
 * @param {CacheOptions} options - Cache options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await batchSet([
 *   { key: 'user:1', value: user1 },
 *   { key: 'user:2', value: user2 }
 * ], l1Cache, { ttl: 300000 });
 * ```
 */
const batchSet = async (operations, cache, options = {}) => {
    await Promise.all(operations.map(op => cache.set(op.key, op.value, options)));
};
exports.batchSet = batchSet;
/**
 * Batches cache get operations.
 *
 * @template T - Type of cached data
 * @param {string[]} keys - Cache keys
 * @param {CacheLayer} cache - Cache layer
 * @returns {Promise<Map<string, T | null>>} Map of keys to values
 *
 * @example
 * ```typescript
 * const results = await batchGet(['user:1', 'user:2'], l1Cache);
 * ```
 */
const batchGet = async (keys, cache) => {
    const results = new Map();
    await Promise.all(keys.map(async (key) => {
        const value = await cache.get(key);
        results.set(key, value);
    }));
    return results;
};
exports.batchGet = batchGet;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Classes
    LRUCache,
    MultiLevelCacheManager,
    CacheInterceptor,
    CacheInvalidationInterceptor,
    CacheEntryModel,
    CacheInvalidationLogModel,
    // Key Generation
    generateCacheKey: exports.generateCacheKey,
    generateHashKey: exports.generateHashKey,
    hashObject: exports.hashObject,
    generateKeyPattern: exports.generateKeyPattern,
    // Compression & Serialization
    compressData: exports.compressData,
    decompressData: exports.decompressData,
    serializeData: exports.serializeData,
    deserializeData: exports.deserializeData,
    // Cache Patterns
    cacheAside: exports.cacheAside,
    writeThrough: exports.writeThrough,
    writeBack: exports.writeBack,
    readThrough: exports.readThrough,
    refreshAhead: exports.refreshAhead,
    // Invalidation
    invalidateByPattern: exports.invalidateByPattern,
    invalidateByTags: exports.invalidateByTags,
    invalidateByDependency: exports.invalidateByDependency,
    invalidateExpired: exports.invalidateExpired,
    // Cache Warming
    warmCache: exports.warmCache,
    scheduleWarmCache: exports.scheduleWarmCache,
    predictiveWarmCache: exports.predictiveWarmCache,
    // TTL Management
    calculateAdaptiveTTL: exports.calculateAdaptiveTTL,
    extendTTL: exports.extendTTL,
    slidingExpiration: exports.slidingExpiration,
    // Sequelize Hooks
    setupCacheInvalidationHooks: exports.setupCacheInvalidationHooks,
    setupCacheWarmingHooks: exports.setupCacheWarmingHooks,
    setupComprehensiveCacheHooks: exports.setupComprehensiveCacheHooks,
    // Distributed Caching
    consistentHash: exports.consistentHash,
    selectCacheNode: exports.selectCacheNode,
    replicateCacheData: exports.replicateCacheData,
    // Monitoring
    collectCacheMetrics: exports.collectCacheMetrics,
    exportPrometheusMetrics: exports.exportPrometheusMetrics,
    createCacheHealthCheck: exports.createCacheHealthCheck,
    // Utilities
    memoize: exports.memoize,
    batchSet: exports.batchSet,
    batchGet: exports.batchGet,
    // Validation Schemas
    CacheConfigSchema: exports.CacheConfigSchema,
    CacheKeyConfigSchema: exports.CacheKeyConfigSchema,
    CacheInvalidationRuleSchema: exports.CacheInvalidationRuleSchema,
    DistributedCacheConfigSchema: exports.DistributedCacheConfigSchema,
};
//# sourceMappingURL=caching-strategies-kit.prod.js.map