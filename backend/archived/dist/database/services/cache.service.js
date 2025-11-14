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
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
const common_2 = require("@nestjs/common");
let CacheService = class CacheService extends base_1.BaseService {
    configService;
    cache;
    stats;
    config;
    constructor(logger, configService) {
        super({
            serviceName: 'CacheService',
            logger,
            enableAuditLogging: true,
        });
        this.configService = configService;
        this.cache = new Map();
        this.stats = { hits: 0, misses: 0
        };
        this.config = {
            enabled: this.configService.get('cache.enabled', true),
            defaultTTL: this.configService.get('cache.defaultTTL', 900),
            encryptPHI: this.configService.get('cache.encryptPHI', false),
            auditCacheAccess: this.configService.get('cache.auditCacheAccess', false),
            allowedEntityTypes: this.configService.get('cache.allowedEntityTypes', []),
            maxCacheSize: this.configService.get('cache.maxCacheSize', 100),
            evictionPolicy: this.configService.get('cache.evictionPolicy', 'LRU'),
        };
        this.logInfo('Cache service initialized (In-Memory implementation)');
    }
    async get(key) {
        if (!this.config.enabled) {
            return null;
        }
        const entry = this.cache.get(key);
        if (!entry) {
            this.stats.misses++;
            return null;
        }
        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            this.stats.misses++;
            return null;
        }
        this.stats.hits++;
        return entry.value;
    }
    async set(key, value, ttl) {
        if (!this.config.enabled) {
            return;
        }
        const expiry = Date.now() + ttl * 1000;
        this.cache.set(key, { value, expiry });
        if (this.cache.size > this.config.maxCacheSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    }
    async delete(key) {
        this.cache.delete(key);
    }
    async deletePattern(pattern) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        const keysToDelete = [];
        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach((key) => this.cache.delete(key));
        this.logDebug(`Deleted ${keysToDelete.length} keys matching pattern: ${pattern}`);
    }
    async exists(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return false;
        }
        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }
    async mset(entries) {
        for (const [key, value, ttl] of entries) {
            await this.set(key, value, ttl);
        }
    }
    async mget(keys) {
        const results = [];
        for (const key of keys) {
            results.push(await this.get(key));
        }
        return results;
    }
    async clear() {
        this.cache.clear();
        this.stats = { hits: 0, misses: 0 };
        this.logWarning('Cache cleared');
    }
    async getStats() {
        const { hits, misses } = this.stats;
        const total = hits + misses;
        const hitRate = total > 0 ? (hits / total) * 100 : 0;
        return {
            hits,
            misses,
            keyCount: this.cache.size,
            memoryUsage: 0,
            hitRate,
        };
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        config_1.ConfigService])
], CacheService);
//# sourceMappingURL=cache.service.js.map