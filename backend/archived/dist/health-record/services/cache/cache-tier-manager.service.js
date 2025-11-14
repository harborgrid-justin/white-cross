"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheTierManagerService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_interfaces_1 = require("./cache-interfaces");
const cache_constants_1 = require("./cache-constants");
const base_1 = require("../../../common/base");
let CacheTierManagerService = class CacheTierManagerService extends base_1.BaseService {
    redisCache;
    l1Cache = new Map();
    maxL1Size = cache_constants_1.CACHE_CONSTANTS.L1_MAX_SIZE;
    constructor(redisCache) {
        super("CacheTierManagerService");
        this.redisCache = redisCache;
    }
    getFromL1(key) {
        const entry = this.l1Cache.get(key);
        if (!entry)
            return null;
        entry.accessCount++;
        entry.lastAccessed = new Date();
        return entry.data;
    }
    async getFromL2(key, compliance) {
        const startTime = Date.now();
        try {
            const cacheKey = this.buildL2CacheKey(key, compliance);
            const cachedData = await this.redisCache.get(cacheKey);
            if (!cachedData) {
                return { success: false, responseTime: Date.now() - startTime };
            }
            const entry = JSON.parse(cachedData);
            if (this.isCacheEntryExpired(entry)) {
                await this.redisCache.del(cacheKey);
                return { success: false, responseTime: Date.now() - startTime };
            }
            return {
                success: true,
                data: entry.data,
                responseTime: Date.now() - startTime,
                tier: cache_interfaces_1.CacheTier.L2,
            };
        }
        catch (error) {
            this.logError(`L2 cache get failed for key ${key}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime: Date.now() - startTime,
            };
        }
    }
    async getFromL3(key, compliance) {
        const startTime = Date.now();
        try {
            const result = await this.l3CacheService.get(key);
            if (!result) {
                return {
                    success: false,
                    responseTime: Date.now() - startTime,
                    tier: cache_interfaces_1.CacheTier.L3,
                };
            }
            return {
                success: true,
                data: result,
                responseTime: Date.now() - startTime,
                tier: cache_interfaces_1.CacheTier.L3,
            };
        }
        catch (error) {
            this.logError(`L3 cache get failed for key ${key}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime: Date.now() - startTime,
                tier: cache_interfaces_1.CacheTier.L3,
            };
        }
    }
    setInL1(key, entry) {
        const startTime = Date.now();
        try {
            if (this.l1Cache.size >= this.maxL1Size) {
                this.evictLeastImportantL1Entry();
            }
            this.l1Cache.set(key, entry);
            return {
                success: true,
                responseTime: Date.now() - startTime,
                tier: cache_interfaces_1.CacheTier.L1,
            };
        }
        catch (error) {
            this.logError(`L1 cache set failed for key ${key}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime: Date.now() - startTime,
            };
        }
    }
    async setInL2(key, entry, ttl) {
        const startTime = Date.now();
        try {
            const cacheKey = this.buildL2CacheKey(key, entry.compliance);
            const serializedEntry = JSON.stringify(entry);
            await this.redisCache.set(cacheKey, serializedEntry, ttl * 1000);
            return {
                success: true,
                responseTime: Date.now() - startTime,
                tier: cache_interfaces_1.CacheTier.L2,
            };
        }
        catch (error) {
            this.logError(`L2 cache set failed for key ${key}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime: Date.now() - startTime,
            };
        }
    }
    async setInL3(key, entry, ttl) {
        const startTime = Date.now();
        try {
            await this.l3CacheService.set(key, entry.data, ttl);
            return {
                success: true,
                responseTime: Date.now() - startTime,
                tier: cache_interfaces_1.CacheTier.L3,
            };
        }
        catch (error) {
            this.logError(`L3 cache set failed for key ${key}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime: Date.now() - startTime,
                tier: cache_interfaces_1.CacheTier.L3,
            };
        }
    }
    promoteToL1(key, data, compliance) {
        const startTime = Date.now();
        try {
            if (this.l1Cache.size >= this.maxL1Size) {
                this.evictLeastImportantL1Entry();
            }
            const entry = {
                data,
                timestamp: new Date(),
                accessCount: 1,
                lastAccessed: new Date(),
                compliance,
                encrypted: compliance === cache_interfaces_1.ComplianceLevel.PHI || compliance === cache_interfaces_1.ComplianceLevel.SENSITIVE_PHI,
                tags: [],
                size: this.calculateDataSize(data),
                tier: cache_interfaces_1.CacheTier.L1,
            };
            this.l1Cache.set(key, entry);
            return {
                success: true,
                responseTime: Date.now() - startTime,
                tier: cache_interfaces_1.CacheTier.L1,
            };
        }
        catch (error) {
            this.logError(`L1 promotion failed for key ${key}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime: Date.now() - startTime,
            };
        }
    }
    determineBestTier(key, dataSize, compliance) {
        if (compliance === cache_interfaces_1.ComplianceLevel.PHI || compliance === cache_interfaces_1.ComplianceLevel.SENSITIVE_PHI) {
            return dataSize < cache_constants_1.CACHE_CONSTANTS.SIZE_THRESHOLDS.SMALL_DATA ? cache_interfaces_1.CacheTier.L1 : cache_interfaces_1.CacheTier.L2;
        }
        if (dataSize > cache_constants_1.CACHE_CONSTANTS.SIZE_THRESHOLDS.LARGE_DATA)
            return cache_interfaces_1.CacheTier.L3;
        if (dataSize > cache_constants_1.CACHE_CONSTANTS.SIZE_THRESHOLDS.MEDIUM_DATA)
            return cache_interfaces_1.CacheTier.L2;
        return cache_interfaces_1.CacheTier.L1;
    }
    getL1Stats() {
        return {
            hits: 0,
            misses: 0,
            evictions: 0,
            size: this.l1Cache.size,
            memoryUsage: this.calculateL1MemoryUsage(),
        };
    }
    calculateL1MemoryUsage() {
        let total = 0;
        for (const entry of this.l1Cache.values()) {
            total += entry.size;
        }
        return total;
    }
    calculateDataSize(data) {
        try {
            return JSON.stringify(data).length;
        }
        catch {
            return 0;
        }
    }
    buildL2CacheKey(key, compliance) {
        const prefix = compliance === cache_interfaces_1.ComplianceLevel.PHI || compliance === cache_interfaces_1.ComplianceLevel.SENSITIVE_PHI
            ? cache_constants_1.CACHE_CONSTANTS.KEY_PREFIXES.L2_PHI
            : cache_constants_1.CACHE_CONSTANTS.KEY_PREFIXES.L2_PUBLIC;
        return `${prefix}${key}`;
    }
    buildL3CacheKey(key, compliance) {
        const prefix = compliance === cache_interfaces_1.ComplianceLevel.PHI || compliance === cache_interfaces_1.ComplianceLevel.SENSITIVE_PHI
            ? cache_constants_1.CACHE_CONSTANTS.KEY_PREFIXES.L3_PHI
            : cache_constants_1.CACHE_CONSTANTS.KEY_PREFIXES.L3_PUBLIC;
        return `${prefix}${key}`;
    }
    isCacheEntryExpired(entry) {
        const maxAge = cache_constants_1.CACHE_CONSTANTS.METRICS.MAX_AGE;
        return Date.now() - entry.timestamp.getTime() > maxAge;
    }
    evictLeastImportantL1Entry() {
        if (this.l1Cache.size === 0)
            return;
        let oldestKey = null;
        let oldestTime = Date.now();
        for (const [key, entry] of this.l1Cache.entries()) {
            if (entry.lastAccessed.getTime() < oldestTime) {
                oldestTime = entry.lastAccessed.getTime();
                oldestKey = key;
            }
        }
        if (oldestKey) {
            this.l1Cache.delete(oldestKey);
        }
    }
    clearL1Cache() {
        this.l1Cache.clear();
    }
};
exports.CacheTierManagerService = CacheTierManagerService;
exports.CacheTierManagerService = CacheTierManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], CacheTierManagerService);
//# sourceMappingURL=cache-tier-manager.service.js.map