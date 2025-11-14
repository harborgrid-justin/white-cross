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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseCacheService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../base");
let EnterpriseCacheService = class EnterpriseCacheService extends base_1.BaseService {
    moduleName;
    cache = new Map();
    stats;
    cleanupInterval = null;
    constructor(moduleName) {
        super("EnterpriseCacheService");
        this.moduleName = moduleName;
        this.stats = {
            hits: 0,
            misses: 0,
            keys: 0,
            memoryUsage: 0,
            hitRate: 0,
            module: moduleName,
            lastCleanup: Date.now(),
        };
        this.startCleanupInterval();
    }
    async set(key, data, ttl, options) {
        try {
            const fullKey = `${this.moduleName}:${key}`;
            const entry = {
                data,
                timestamp: Date.now(),
                ttl: ttl * 1000,
                key: fullKey,
                module: this.moduleName,
                compliance: options?.compliance,
            };
            if (options?.compliance?.phiData && !options?.compliance?.encrypted) {
                this.logWarning(`Setting PHI data without encryption: ${key}`);
            }
            this.cache.set(fullKey, entry);
            this.updateStats();
            this.logDebug(`Cache set: ${fullKey} (TTL: ${ttl}s, Module: ${this.moduleName})`);
        }
        catch (error) {
            this.logError(`Failed to set cache entry: ${key}`, error);
            throw error;
        }
    }
    async get(key) {
        try {
            const fullKey = `${this.moduleName}:${key}`;
            const entry = this.cache.get(fullKey);
            if (!entry) {
                this.stats.misses++;
                this.updateHitRate();
                return null;
            }
            const now = Date.now();
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(fullKey);
                this.stats.misses++;
                this.updateHitRate();
                this.logDebug(`Cache expired: ${fullKey}`);
                return null;
            }
            if (entry.compliance?.phiData) {
                this.logInfo(`PHI cache access: ${key} (Module: ${this.moduleName})`);
            }
            this.stats.hits++;
            this.updateHitRate();
            return entry.data;
        }
        catch (error) {
            this.logError(`Failed to get cache entry: ${key}`, error);
            this.stats.misses++;
            return null;
        }
    }
    async delete(key) {
        try {
            const fullKey = `${this.moduleName}:${key}`;
            const deleted = this.cache.delete(fullKey);
            this.updateStats();
            if (deleted) {
                this.logDebug(`Cache deleted: ${fullKey}`);
            }
            return deleted;
        }
        catch (error) {
            this.logError(`Failed to delete cache entry: ${key}`, error);
            return false;
        }
    }
    async clearPattern(pattern) {
        try {
            let deletedCount = 0;
            const regex = new RegExp(pattern);
            for (const [_key, entry] of this.cache.entries()) {
                if (regex.test(_key) && entry.module === this.moduleName) {
                    this.cache.delete(_key);
                    deletedCount++;
                }
            }
            this.updateStats();
            this.logInfo(`Cleared ${deletedCount} cache entries matching pattern: ${pattern}`);
            return deletedCount;
        }
        catch (error) {
            this.logError(`Failed to clear cache pattern: ${pattern}`, error);
            return 0;
        }
    }
    async clear() {
        try {
            let deletedCount = 0;
            for (const [key, entry] of this.cache.entries()) {
                if (entry.module === this.moduleName) {
                    this.cache.delete(key);
                    deletedCount++;
                }
            }
            this.updateStats();
            this.logInfo(`Cleared ${deletedCount} cache entries for module: ${this.moduleName}`);
        }
        catch (error) {
            this.logError(`Failed to clear cache for module: ${this.moduleName}`, error);
        }
    }
    getStats() {
        this.updateStats();
        return { ...this.stats };
    }
    getEntriesByComplianceLevel(level) {
        const entries = [];
        for (const [key, entry] of this.cache.entries()) {
            if (entry.module === this.moduleName &&
                entry.compliance?.accessLevel === level) {
                entries.push(entry);
            }
        }
        return entries;
    }
    async cleanup() {
        try {
            let deletedCount = 0;
            const now = Date.now();
            for (const [key, entry] of this.cache.entries()) {
                if (entry.module === this.moduleName &&
                    now - entry.timestamp > entry.ttl) {
                    this.cache.delete(key);
                    deletedCount++;
                }
            }
            this.stats.lastCleanup = now;
            this.updateStats();
            if (deletedCount > 0) {
                this.logDebug(`Cleaned up ${deletedCount} expired cache entries for module: ${this.moduleName}`);
            }
            return deletedCount;
        }
        catch (error) {
            this.logError(`Failed to cleanup cache for module: ${this.moduleName}`, error);
            return 0;
        }
    }
    getHealthStatus() {
        const issues = [];
        let healthy = true;
        if (this.cache.size > 1000) {
            issues.push('High cache size - consider cleanup');
            healthy = false;
        }
        if (this.stats.hitRate < 0.5 && this.stats.hits + this.stats.misses > 100) {
            issues.push('Low cache hit rate - review caching strategy');
        }
        const timeSinceLastCleanup = Date.now() - this.stats.lastCleanup;
        if (timeSinceLastCleanup > 30 * 60 * 1000) {
            issues.push('Cache cleanup overdue');
        }
        return {
            healthy,
            issues,
            stats: this.getStats(),
        };
    }
    startCleanupInterval() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.cleanupInterval = setInterval(async () => {
            await this.cleanup();
        }, 5 * 60 * 1000);
        this.logDebug(`Started cache cleanup interval for module: ${this.moduleName}`);
    }
    stopCleanupInterval() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
            this.logDebug(`Stopped cache cleanup interval for module: ${this.moduleName}`);
        }
    }
    updateStats() {
        this.stats.keys = Array.from(this.cache.values()).filter((entry) => entry.module === this.moduleName).length;
        this.stats.memoryUsage = this.estimateMemoryUsage();
        this.updateHitRate();
    }
    updateHitRate() {
        const total = this.stats.hits + this.stats.misses;
        this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
    }
    estimateMemoryUsage() {
        let totalSize = 0;
        for (const [key, entry] of this.cache.entries()) {
            if (entry.module === this.moduleName) {
                totalSize += key.length * 2;
                totalSize += JSON.stringify(entry.data).length * 2;
                totalSize += 100;
            }
        }
        return totalSize;
    }
    onModuleDestroy() {
        this.stopCleanupInterval();
        this.logInfo(`Enterprise cache service destroyed for module: ${this.moduleName}`);
    }
};
exports.EnterpriseCacheService = EnterpriseCacheService;
exports.EnterpriseCacheService = EnterpriseCacheService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], EnterpriseCacheService);
//# sourceMappingURL=enterprise-cache.service.js.map