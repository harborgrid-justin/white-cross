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
exports.L2CacheService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const phi_access_logger_service_1 = require("../phi-access-logger.service");
const base_1 = require("../../../common/base");
let L2CacheService = class L2CacheService extends base_1.BaseService {
    redisCache;
    phiLogger;
    l2Hits = 0;
    l2Misses = 0;
    totalNetworkLatency = 0;
    operationCount = 0;
    constructor(redisCache, phiLogger) {
        super("L2CacheService");
        this.redisCache = redisCache;
        this.phiLogger = phiLogger;
    }
    async get(key, compliance) {
        const startTime = Date.now();
        try {
            const cacheKey = this.buildL2CacheKey(key, compliance);
            const cachedData = await this.redisCache.get(cacheKey);
            if (!cachedData) {
                this.l2Misses++;
                this.updateLatencyMetrics(Date.now() - startTime);
                return {
                    success: false,
                    responseTime: Date.now() - startTime,
                };
            }
            const entry = JSON.parse(cachedData);
            if (this.isCacheEntryExpired(entry)) {
                await this.redisCache.del(cacheKey);
                this.l2Misses++;
                this.updateLatencyMetrics(Date.now() - startTime);
                return {
                    success: false,
                    responseTime: Date.now() - startTime,
                };
            }
            this.l2Hits++;
            this.updateLatencyMetrics(Date.now() - startTime);
            if (compliance === 'PHI' || compliance === 'SENSITIVE_PHI') {
                await this.logPHIAccess('CACHE_READ_L2', [this.extractDataType(key, entry.tags)], 1, compliance);
            }
            return {
                success: true,
                data: entry.data,
                responseTime: Date.now() - startTime,
            };
        }
        catch (error) {
            this.logError(`L2 cache get failed for key ${key}:`, error);
            this.l2Misses++;
            this.updateLatencyMetrics(Date.now() - startTime);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime: Date.now() - startTime,
            };
        }
    }
    async set(key, entry, ttl) {
        const startTime = Date.now();
        try {
            const cacheKey = this.buildL2CacheKey(key, entry.compliance);
            const serializedEntry = JSON.stringify(entry);
            await this.redisCache.set(cacheKey, serializedEntry, ttl * 1000);
            this.updateLatencyMetrics(Date.now() - startTime);
            if (entry.compliance === 'PHI' || entry.compliance === 'SENSITIVE_PHI') {
                await this.logPHIAccess('CACHE_WRITE_L2', [this.extractDataType(key, entry.tags)], 1, entry.compliance);
            }
            return {
                success: true,
                responseTime: Date.now() - startTime,
            };
        }
        catch (error) {
            this.logError(`L2 cache set failed for key ${key}:`, error);
            this.updateLatencyMetrics(Date.now() - startTime);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime: Date.now() - startTime,
            };
        }
    }
    async delete(key, compliance) {
        const startTime = Date.now();
        try {
            const cacheKey = this.buildL2CacheKey(key, compliance);
            const deleted = (await this.redisCache.del(cacheKey)) > 0;
            this.updateLatencyMetrics(Date.now() - startTime);
            return {
                success: true,
                data: deleted,
                responseTime: Date.now() - startTime,
            };
        }
        catch (error) {
            this.logError(`L2 cache delete failed for key ${key}:`, error);
            this.updateLatencyMetrics(Date.now() - startTime);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime: Date.now() - startTime,
            };
        }
    }
    async has(key, compliance) {
        try {
            const cacheKey = this.buildL2CacheKey(key, compliance);
            const result = await this.redisCache.get(cacheKey);
            return result !== undefined && result !== null;
        }
        catch (error) {
            this.logError(`L2 cache has check failed for key ${key}:`, error);
            return false;
        }
    }
    async clear(pattern) {
        const startTime = Date.now();
        try {
            this.logWarning(`L2 cache clear pattern not fully implemented: ${pattern}`);
            await Promise.resolve();
            this.updateLatencyMetrics(Date.now() - startTime);
            return {
                success: true,
                data: 0,
                responseTime: Date.now() - startTime,
            };
        }
        catch (error) {
            this.logError(`L2 cache clear failed for pattern ${pattern}:`, error);
            this.updateLatencyMetrics(Date.now() - startTime);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime: Date.now() - startTime,
            };
        }
    }
    getStats() {
        const totalRequests = this.l2Hits + this.l2Misses;
        const hitRate = totalRequests > 0 ? this.l2Hits / totalRequests : 0;
        const averageLatency = this.operationCount > 0 ? this.totalNetworkLatency / this.operationCount : 0;
        return {
            hits: this.l2Hits,
            misses: this.l2Misses,
            hitRate,
            averageNetworkLatency: averageLatency,
            totalOperations: this.operationCount,
        };
    }
    resetMetrics() {
        this.l2Hits = 0;
        this.l2Misses = 0;
        this.totalNetworkLatency = 0;
        this.operationCount = 0;
    }
    buildL2CacheKey(key, compliance) {
        const prefix = compliance === 'PHI' || compliance === 'SENSITIVE_PHI' ? 'phi:' : 'hr:';
        return `${prefix}${key}`;
    }
    isCacheEntryExpired(entry) {
        const maxAge = 24 * 60 * 60 * 1000;
        return Date.now() - entry.timestamp.getTime() > maxAge;
    }
    extractDataType(key, tags) {
        if (tags.length > 0)
            return tags[0];
        if (key.includes('allergies'))
            return 'ALLERGIES';
        if (key.includes('vaccinations'))
            return 'VACCINATIONS';
        if (key.includes('conditions'))
            return 'CONDITIONS';
        if (key.includes('vitals'))
            return 'VITALS';
        if (key.includes('summary'))
            return 'SUMMARY';
        return 'HEALTH_RECORD';
    }
    updateLatencyMetrics(latency) {
        this.totalNetworkLatency += latency;
        this.operationCount++;
    }
    async logPHIAccess(operation, dataTypes, recordCount, compliance) {
        try {
            await this.phiLogger.logPHIAccess({
                correlationId: this.generateCorrelationId(),
                timestamp: new Date(),
                operation,
                dataTypes,
                recordCount,
                sensitivityLevel: compliance,
                ipAddress: 'internal',
                userAgent: 'l2-cache-service',
                success: true,
            });
        }
        catch (error) {
            this.logError('Failed to log PHI access:', error);
        }
    }
    generateCorrelationId() {
        return `l2-cache-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    }
};
exports.L2CacheService = L2CacheService;
exports.L2CacheService = L2CacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, phi_access_logger_service_1.PHIAccessLogger])
], L2CacheService);
//# sourceMappingURL=l2-cache.service.js.map