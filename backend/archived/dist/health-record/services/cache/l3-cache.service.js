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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.L3CacheService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const crypto = __importStar(require("crypto"));
const phi_access_logger_service_1 = require("../phi-access-logger.service");
const cache_interfaces_1 = require("./cache-interfaces");
const models_1 = require("../../../database/models");
const base_1 = require("../../../common/base");
let L3CacheService = class L3CacheService extends base_1.BaseService {
    phiLogger;
    cacheEntryModel;
    stats = { hits: 0, misses: 0, queryTime: 0, size: 0 };
    constructor(phiLogger, cacheEntryModel) {
        super("L3CacheService");
        this.phiLogger = phiLogger;
        this.cacheEntryModel = cacheEntryModel;
    }
    async get(key, compliance) {
        const startTime = Date.now();
        try {
            const cacheKey = this.buildCacheKey(key, compliance);
            const cacheEntry = await this.cacheEntryModel.findOne({
                where: {
                    cacheKey,
                    expiresAt: {
                        [sequelize_2.Op.gt]: new Date(),
                    },
                },
            });
            if (!cacheEntry) {
                this.stats.misses++;
                this.stats.queryTime += Date.now() - startTime;
                return null;
            }
            await cacheEntry.recordAccess();
            const parsedData = cacheEntry.getParsedData();
            if (parsedData === null) {
                this.logWarning(`L3 cache entry found but data parsing failed for key: ${key}`);
                this.stats.misses++;
                return null;
            }
            this.stats.hits++;
            this.stats.queryTime += Date.now() - startTime;
            this.stats.size++;
            if (compliance === cache_interfaces_1.ComplianceLevel.PHI || compliance === cache_interfaces_1.ComplianceLevel.SENSITIVE_PHI) {
                this.phiLogger.logPHIAccess({
                    correlationId: this.generateCorrelationId(),
                    timestamp: new Date(),
                    operation: 'CACHE_READ_L3',
                    dataTypes: [this.extractDataType(key, cacheEntry.getParsedTags())],
                    recordCount: 1,
                    sensitivityLevel: compliance,
                    ipAddress: 'internal',
                    userAgent: 'cache-service',
                    success: true,
                });
            }
            return parsedData;
        }
        catch (error) {
            this.logError(`L3 cache get failed for key ${key}:`, error);
            this.stats.misses++;
            this.stats.queryTime += Date.now() - startTime;
            return null;
        }
    }
    async set(key, entry, ttl) {
        const startTime = Date.now();
        try {
            const cacheKey = this.buildCacheKey(key, entry.compliance);
            const expiresAt = new Date(Date.now() + ttl * 1000);
            const serializedData = JSON.stringify(entry.data);
            const serializedTags = JSON.stringify(entry.tags);
            const queryHash = this.generateQueryHash(key, entry.data);
            await this.cacheEntryModel.upsert({
                cacheKey,
                data: serializedData,
                complianceLevel: entry.compliance,
                tags: serializedTags,
                expiresAt,
                accessCount: entry.accessCount,
                lastAccessed: entry.lastAccessed,
                dataSize: entry.size,
                queryHash,
            });
            this.stats.size++;
            this.stats.queryTime += Date.now() - startTime;
            if (entry.compliance === cache_interfaces_1.ComplianceLevel.PHI ||
                entry.compliance === cache_interfaces_1.ComplianceLevel.SENSITIVE_PHI) {
                this.phiLogger.logPHIAccess({
                    correlationId: this.generateCorrelationId(),
                    timestamp: new Date(),
                    operation: 'CACHE_WRITE_L3',
                    dataTypes: [this.extractDataType(key, entry.tags)],
                    recordCount: 1,
                    sensitivityLevel: entry.compliance,
                    ipAddress: 'internal',
                    userAgent: 'cache-service',
                    success: true,
                });
            }
            this.logDebug(`L3 cache entry stored: ${cacheKey}, size: ${entry.size} bytes, TTL: ${ttl}s`);
        }
        catch (error) {
            this.logError(`L3 cache set failed for key ${key}:`, error);
        }
    }
    async invalidate(pattern) {
        try {
            const deletedCount = await this.cacheEntryModel.destroy({
                where: {
                    cacheKey: {
                        [sequelize_2.Op.like]: pattern.replace('*', '%'),
                    },
                },
            });
            this.stats.size = Math.max(0, this.stats.size - deletedCount);
            this.logDebug(`L3 cache invalidated ${deletedCount} entries for pattern: ${pattern}`);
            return deletedCount;
        }
        catch (error) {
            this.logError(`L3 cache invalidation failed for pattern ${pattern}:`, error);
            return 0;
        }
    }
    async cleanupExpired() {
        try {
            const deletedCount = await this.cacheEntryModel.destroy({
                where: {
                    expiresAt: {
                        [sequelize_2.Op.lt]: new Date(),
                    },
                },
            });
            if (deletedCount > 0) {
                this.logDebug(`Cleaned up ${deletedCount} expired L3 cache entries`);
                this.stats.size = Math.max(0, this.stats.size - deletedCount);
            }
            return deletedCount;
        }
        catch (error) {
            this.logError('Failed to cleanup expired L3 cache entries:', error);
            return 0;
        }
    }
    getStats() {
        return {
            hits: this.stats.hits,
            misses: this.stats.misses,
            queryTime: this.stats.queryTime,
            size: this.stats.size,
        };
    }
    resetStats() {
        this.stats = { hits: 0, misses: 0, queryTime: 0, size: 0 };
    }
    async getCacheSize() {
        try {
            const count = await this.cacheEntryModel.count({
                where: {
                    expiresAt: {
                        [sequelize_2.Op.gt]: new Date(),
                    },
                },
            });
            return count;
        }
        catch (error) {
            this.logError('Failed to get L3 cache size:', error);
            return 0;
        }
    }
    buildCacheKey(key, compliance) {
        const prefix = compliance === cache_interfaces_1.ComplianceLevel.PHI || compliance === cache_interfaces_1.ComplianceLevel.SENSITIVE_PHI
            ? 'l3:phi:'
            : 'l3:hr:';
        return `${prefix}${key}`;
    }
    generateQueryHash(key, data) {
        const queryString = `${key}:${JSON.stringify(data)}`;
        return crypto.createHash('sha256').update(queryString).digest('hex').substring(0, 16);
    }
    generateCorrelationId() {
        return `l3-cache-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    }
    extractDataType(key, tags) {
        if (tags && tags.length > 0)
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
};
exports.L3CacheService = L3CacheService;
exports.L3CacheService = L3CacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(models_1.CacheEntry)),
    __metadata("design:paramtypes", [phi_access_logger_service_1.PHIAccessLogger, Object])
], L3CacheService);
//# sourceMappingURL=l3-cache.service.js.map