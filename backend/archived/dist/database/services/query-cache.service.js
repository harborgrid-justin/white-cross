"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryCacheService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
let QueryCacheService = class QueryCacheService extends base_1.BaseService {
    localCache = new Map();
    stats = {
        hits: 0,
        misses: 0,
        sets: 0,
        deletes: 0,
        hitRate: 0,
        localCacheSize: 0,
        redisAvailable: false,
    };
    DEFAULT_TTL = 300;
    MAX_LOCAL_CACHE_SIZE = 1000;
    CLEANUP_INTERVAL = 60000;
    cleanupInterval = null;
    modelHooks = new Map();
    constructor(logger) {
        super({
            serviceName: 'QueryCacheService',
            logger,
            enableAuditLogging: true,
        });
    }
    async onModuleInit() {
        this.logInfo('Initializing Query Cache Service');
        this.startCleanupTask();
    }
    startCleanupTask() {
        this.cleanupInterval = setInterval(() => {
            this.cleanupExpiredEntries();
        }, this.CLEANUP_INTERVAL);
    }
    cleanupExpiredEntries() {
        const now = Date.now();
        let cleanedCount = 0;
        const entries = Array.from(this.localCache.entries());
        for (const [key, value] of entries) {
            if (value.expires < now) {
                this.localCache.delete(key);
                cleanedCount++;
            }
        }
        if (cleanedCount > 0) {
            this.logDebug(`Cleaned up ${cleanedCount} expired cache entries`);
        }
        this.stats.localCacheSize = this.localCache.size;
    }
    async findWithCache(model, findOptions, cacheOptions = {}) {
        const { ttl = this.DEFAULT_TTL, keyPrefix = 'query', invalidateOn = ['create', 'update', 'destroy'], useLocalCache = true, useRedisCache = false, } = cacheOptions;
        const cacheKey = this.generateCacheKey(keyPrefix, model.name, findOptions);
        if (useLocalCache) {
            const localData = this.getFromLocalCache(cacheKey);
            if (localData !== null) {
                this.stats.hits++;
                this.updateHitRate();
                return localData;
            }
        }
        this.stats.misses++;
        this.updateHitRate();
        const result = await model.findAll(findOptions);
        await this.set(cacheKey, result, ttl, { useLocalCache, useRedisCache });
        this.setupInvalidationHooks(model, keyPrefix, invalidateOn);
        return result;
    }
    async findOneWithCache(model, findOptions, cacheOptions = {}) {
        const { ttl = this.DEFAULT_TTL, keyPrefix = 'query_one', invalidateOn = ['create', 'update', 'destroy'], useLocalCache = true, useRedisCache = false, } = cacheOptions;
        const cacheKey = this.generateCacheKey(keyPrefix, model.name, findOptions);
        if (useLocalCache) {
            const localData = this.getFromLocalCache(cacheKey);
            if (localData !== null) {
                this.stats.hits++;
                this.updateHitRate();
                return localData;
            }
        }
        this.stats.misses++;
        this.updateHitRate();
        const result = await model.findOne(findOptions);
        await this.set(cacheKey, result, ttl, { useLocalCache, useRedisCache });
        this.setupInvalidationHooks(model, keyPrefix, invalidateOn);
        return result;
    }
    getFromLocalCache(key) {
        const entry = this.localCache.get(key);
        if (!entry) {
            return null;
        }
        if (entry.expires < Date.now()) {
            this.localCache.delete(key);
            return null;
        }
        return entry.data;
    }
    setInLocalCache(key, data, ttl) {
        if (this.localCache.size >= this.MAX_LOCAL_CACHE_SIZE) {
            const firstKey = this.localCache.keys().next().value;
            if (firstKey) {
                this.localCache.delete(firstKey);
            }
        }
        this.localCache.set(key, {
            data,
            expires: Date.now() + ttl * 1000,
        });
        this.stats.localCacheSize = this.localCache.size;
    }
    async set(key, data, ttl = this.DEFAULT_TTL, options = {}) {
        const { useLocalCache = true, useRedisCache = false } = options;
        this.stats.sets++;
        if (useLocalCache) {
            this.setInLocalCache(key, data, ttl);
        }
    }
    async invalidatePattern(pattern) {
        let deletedCount = 0;
        const keys = Array.from(this.localCache.keys());
        for (const key of keys) {
            if (key.includes(pattern)) {
                this.localCache.delete(key);
                deletedCount++;
            }
        }
        this.stats.deletes += deletedCount;
        this.stats.localCacheSize = this.localCache.size;
        if (deletedCount > 0) {
            this.logDebug(`Invalidated ${deletedCount} cache entries matching pattern: ${pattern}`);
        }
        return deletedCount;
    }
    setupInvalidationHooks(model, keyPrefix, operations) {
        const modelName = model.name;
        const hookKey = `${modelName}:${keyPrefix}`;
        if (this.modelHooks.has(hookKey)) {
            return;
        }
        const registeredHooks = new Set();
        operations.forEach((operation) => {
            const hookName = `after${this.capitalize(operation)}`;
            model.addHook(hookName, async () => {
                await this.invalidatePattern(`${keyPrefix}:${modelName}`);
            });
            const bulkHookName = `afterBulk${this.capitalize(operation)}`;
            model.addHook(bulkHookName, async () => {
                await this.invalidatePattern(`${keyPrefix}:${modelName}`);
            });
            registeredHooks.add(hookName);
        });
        this.modelHooks.set(hookKey, registeredHooks);
        this.logDebug(`Registered cache invalidation hooks for ${modelName}`);
    }
    generateCacheKey(prefix, modelName, options) {
        const sanitizedOptions = this.sanitizeOptionsForCaching(options);
        const optionsString = JSON.stringify(sanitizedOptions);
        const hash = crypto
            .createHash('md5')
            .update(optionsString)
            .digest('hex')
            .substring(0, 16);
        return `${prefix}:${modelName}:${hash}`;
    }
    sanitizeOptionsForCaching(options) {
        const sanitized = { ...options };
        if (sanitized.attributes) {
            delete sanitized.attributes;
        }
        if (sanitized.where) {
            sanitized.where = this.sanitizeWhereClause(sanitized.where);
        }
        return sanitized;
    }
    sanitizeWhereClause(where) {
        if (typeof where !== 'object' || where === null) {
            return 'VALUE';
        }
        const sanitized = {};
        for (const [key, value] of Object.entries(where)) {
            if (typeof value === 'object' && value !== null) {
                sanitized[key] = this.sanitizeWhereClause(value);
            }
            else {
                sanitized[key] = 'VALUE';
            }
        }
        return sanitized;
    }
    getStats() {
        return {
            ...this.stats,
            localCacheSize: this.localCache.size,
        };
    }
    updateHitRate() {
        const total = this.stats.hits + this.stats.misses;
        this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
    }
    async clearAll() {
        const size = this.localCache.size;
        this.localCache.clear();
        this.stats.localCacheSize = 0;
        this.logInfo(`Cleared ${size} entries from cache`);
    }
    resetStats() {
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0,
            hitRate: 0,
            localCacheSize: this.localCache.size,
            redisAvailable: false,
        };
    }
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    getFormattedStats() {
        const stats = this.getStats();
        return `
=== Query Cache Statistics ===
Total Hits: ${stats.hits}
Total Misses: ${stats.misses}
Hit Rate: ${(stats.hitRate * 100).toFixed(2)}%
Cache Sets: ${stats.sets}
Cache Deletes: ${stats.deletes}
Local Cache Size: ${stats.localCacheSize}
Redis Available: ${stats.redisAvailable}
    `.trim();
    }
    async onModuleDestroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        await this.clearAll();
    }
};
exports.QueryCacheService = QueryCacheService;
exports.QueryCacheService = QueryCacheService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], QueryCacheService);
//# sourceMappingURL=query-cache.service.js.map