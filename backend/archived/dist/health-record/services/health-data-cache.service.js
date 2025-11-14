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
exports.HealthDataCacheService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const redis_1 = require("redis");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
let HealthDataCacheService = class HealthDataCacheService extends base_1.BaseService {
    configService;
    redisClient;
    isConnected = false;
    l1Cache = new Map();
    L1_MAX_SIZE = 1000;
    L1_TTL = 60000;
    stats = {
        hits: 0,
        misses: 0,
        sets: 0,
        deletes: 0,
    };
    constructor(logger, configService) {
        super({
            serviceName: 'HealthDataCacheService',
            logger,
            enableAuditLogging: true,
        });
        this.configService = configService;
    }
    async onModuleInit() {
        await this.connect();
    }
    async connect() {
        try {
            const redisConfig = this.configService.get('redis');
            this.redisClient = (0, redis_1.createClient)({
                socket: {
                    host: redisConfig?.cache.host,
                    port: redisConfig?.cache.port,
                    connectTimeout: redisConfig?.cache.connectionTimeout,
                },
                password: redisConfig?.cache.password,
                username: redisConfig?.cache.username,
                database: redisConfig?.cache.db,
            });
            this.redisClient.on('error', (err) => {
                this.logError('Redis Client Error:', err);
                this.isConnected = false;
            });
            this.redisClient.on('connect', () => {
                this.logInfo('Redis client connected');
                this.isConnected = true;
            });
            this.redisClient.on('ready', () => {
                this.logInfo('Redis client ready');
            });
            await this.redisClient.connect();
        }
        catch (error) {
            this.logError('Failed to connect to Redis:', error);
            this.isConnected = false;
        }
    }
    async get(key) {
        const fullKey = this.buildKey(key);
        const l1Data = this.getFromL1(fullKey);
        if (l1Data !== null) {
            this.stats.hits++;
            this.logDebug(`L1 Cache HIT: ${key}`);
            return l1Data;
        }
        if (!this.isConnected) {
            this.stats.misses++;
            return null;
        }
        try {
            const data = await this.redisClient.get(fullKey);
            if (data) {
                this.stats.hits++;
                const parsed = typeof data === 'string' ? JSON.parse(data) : data;
                this.setInL1(fullKey, parsed);
                this.logDebug(`L2 Cache HIT: ${key}`);
                return parsed;
            }
            this.stats.misses++;
            this.logDebug(`Cache MISS: ${key}`);
            return null;
        }
        catch (error) {
            this.logError(`Cache GET error for key ${key}:`, error);
            this.stats.misses++;
            return null;
        }
    }
    async set(key, value, options = {}) {
        const fullKey = this.buildKey(key);
        const ttl = options.ttl || this.configService.get('redis.cache.ttl', 300);
        try {
            const serialized = JSON.stringify(value);
            this.setInL1(fullKey, value);
            if (this.isConnected) {
                await this.redisClient.setEx(fullKey, ttl, serialized);
                if (options.tags && options.tags.length > 0) {
                    await this.storeTags(fullKey, options.tags);
                }
            }
            this.stats.sets++;
            this.logDebug(`Cache SET: ${key} (TTL: ${ttl}s)`);
            return true;
        }
        catch (error) {
            this.logError(`Cache SET error for key ${key}:`, error);
            return false;
        }
    }
    async delete(key) {
        const fullKey = this.buildKey(key);
        try {
            this.l1Cache.delete(fullKey);
            if (this.isConnected) {
                await this.redisClient.del(fullKey);
            }
            this.stats.deletes++;
            this.logDebug(`Cache DELETE: ${key}`);
            return true;
        }
        catch (error) {
            this.logError(`Cache DELETE error for key ${key}:`, error);
            return false;
        }
    }
    async invalidateByTag(tag) {
        if (!this.isConnected) {
            return 0;
        }
        try {
            const tagKey = `tag:${tag}`;
            const keys = await this.redisClient.sMembers(tagKey);
            if (keys.length === 0) {
                return 0;
            }
            const pipeline = this.redisClient.multi();
            keys.forEach((key) => {
                pipeline.del(key);
                this.l1Cache.delete(key);
            });
            pipeline.del(tagKey);
            await pipeline.exec();
            this.logInfo(`Invalidated ${keys.length} cache entries for tag: ${tag}`);
            return keys.length;
        }
        catch (error) {
            this.logError(`Error invalidating tag ${tag}:`, error);
            return 0;
        }
    }
    async clear() {
        try {
            this.l1Cache.clear();
            if (this.isConnected) {
                await this.redisClient.flushDb();
            }
            this.logInfo('All cache cleared');
        }
        catch (error) {
            this.logError('Error clearing cache:', error);
        }
    }
    getStats() {
        const total = this.stats.hits + this.stats.misses;
        const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
        return {
            ...this.stats,
            hitRate: Math.round(hitRate * 100) / 100,
            memoryUsage: `L1: ${this.l1Cache.size}/${this.L1_MAX_SIZE} entries`,
        };
    }
    resetStats() {
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0,
        };
        this.logInfo('Cache statistics reset');
    }
    isRedisConnected() {
        return this.isConnected;
    }
    buildKey(key) {
        const prefix = this.configService.get('redis.cache.keyPrefix', 'cache');
        return `${prefix}:${key}`;
    }
    getFromL1(key) {
        const entry = this.l1Cache.get(key);
        if (!entry) {
            return null;
        }
        if (Date.now() > entry.expires) {
            this.l1Cache.delete(key);
            return null;
        }
        return entry.data;
    }
    setInL1(key, data) {
        if (this.l1Cache.size >= this.L1_MAX_SIZE) {
            const firstKey = this.l1Cache.keys().next().value;
            this.l1Cache.delete(firstKey);
        }
        this.l1Cache.set(key, {
            data,
            expires: Date.now() + this.L1_TTL,
        });
    }
    async storeTags(key, tags) {
        if (!this.isConnected) {
            return;
        }
        const pipeline = this.redisClient.multi();
        tags.forEach((tag) => {
            const tagKey = `tag:${tag}`;
            pipeline.sAdd(tagKey, key);
        });
        await pipeline.exec();
    }
    async cacheStudentHealthSummary(studentId, data) {
        return this.set(`student:health:${studentId}`, data, {
            ttl: 300,
            tags: ['student', `student:${studentId}`, 'health-summary'],
        });
    }
    async getStudentHealthSummary(studentId) {
        return this.get(`student:health:${studentId}`);
    }
    async cacheVaccinations(studentId, data) {
        return this.set(`student:vaccinations:${studentId}`, data, {
            ttl: 600,
            tags: ['vaccinations', `student:${studentId}`],
        });
    }
    async getVaccinations(studentId) {
        return this.get(`student:vaccinations:${studentId}`);
    }
    async cacheAllergies(studentId, data) {
        return this.set(`student:allergies:${studentId}`, data, {
            ttl: 600,
            tags: ['allergies', `student:${studentId}`],
        });
    }
    async getAllergies(studentId) {
        return this.get(`student:allergies:${studentId}`);
    }
    async cacheChronicConditions(studentId, data) {
        return this.set(`student:chronic-conditions:${studentId}`, data, {
            ttl: 600,
            tags: ['chronic-conditions', `student:${studentId}`],
        });
    }
    async getChronicConditions(studentId) {
        return this.get(`student:chronic-conditions:${studentId}`);
    }
    async invalidateStudentHealthData(studentId) {
        await Promise.all([
            this.delete(`student:health:${studentId}`),
            this.delete(`student:vaccinations:${studentId}`),
            this.delete(`student:allergies:${studentId}`),
            this.delete(`student:chronic-conditions:${studentId}`),
            this.invalidateByTag(`student:${studentId}`),
        ]);
    }
    async invalidateByHealthDataType(type) {
        await this.invalidateByTag(type);
    }
    async onModuleDestroy() {
        if (this.redisClient && this.isConnected) {
            await this.redisClient.quit();
            this.logInfo('Redis connection closed');
        }
    }
};
exports.HealthDataCacheService = HealthDataCacheService;
exports.HealthDataCacheService = HealthDataCacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        config_1.ConfigService])
], HealthDataCacheService);
//# sourceMappingURL=health-data-cache.service.js.map