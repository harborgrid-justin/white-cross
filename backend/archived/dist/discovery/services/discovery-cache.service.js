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
exports.DiscoveryCacheService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
let DiscoveryCacheService = class DiscoveryCacheService extends base_1.BaseService {
    cache = new Map();
    stats = {
        hits: 0,
        misses: 0,
        keys: 0,
        memoryUsage: 0,
        hitRate: 0,
    };
    cleanupInterval;
    constructor() {
        super("DiscoveryCacheService");
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 5 * 60 * 1000);
    }
    onModuleDestroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
    async get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            this.stats.misses++;
            this.updateHitRate();
            return null;
        }
        const now = Date.now();
        if (now > entry.timestamp + entry.ttl * 1000) {
            this.cache.delete(key);
            this.stats.misses++;
            this.updateStats();
            return null;
        }
        this.stats.hits++;
        this.updateHitRate();
        return entry.data;
    }
    async set(key, data, ttl = 300) {
        const entry = {
            data,
            timestamp: Date.now(),
            ttl,
            key,
        };
        this.cache.set(key, entry);
        this.updateStats();
        this.logDebug(`Cache set: ${key} (TTL: ${ttl}s)`);
    }
    async delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
            this.updateStats();
            this.logDebug(`Cache deleted: ${key}`);
        }
        return deleted;
    }
    async clear() {
        const count = this.cache.size;
        this.cache.clear();
        this.resetStats();
        this.logInfo(`Cache cleared: ${count} entries removed`);
        return count;
    }
    async has(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return false;
        }
        const now = Date.now();
        if (now > entry.timestamp + entry.ttl * 1000) {
            this.cache.delete(key);
            this.updateStats();
            return false;
        }
        return true;
    }
    getStats() {
        this.updateStats();
        return { ...this.stats };
    }
    async getHitRates() {
        return {
            overall: this.stats.hitRate,
        };
    }
    getKeys() {
        return Array.from(this.cache.keys());
    }
    getKeysByPrefix(prefix) {
        return Array.from(this.cache.keys()).filter((key) => key.startsWith(prefix));
    }
    async invalidateByPattern(pattern) {
        let invalidated = 0;
        const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                this.cache.delete(key);
                invalidated++;
            }
        }
        if (invalidated > 0) {
            this.updateStats();
            this.logInfo(`Cache invalidated by pattern: ${invalidated} entries`);
        }
        return invalidated;
    }
    getMemoryUsage() {
        let totalSize = 0;
        for (const entry of this.cache.values()) {
            totalSize += JSON.stringify(entry).length * 2;
        }
        return totalSize;
    }
    async updateTTL(key, newTTL) {
        const entry = this.cache.get(key);
        if (!entry) {
            return false;
        }
        entry.ttl = newTTL;
        entry.timestamp = Date.now();
        this.logDebug(`Cache TTL updated: ${key} (new TTL: ${newTTL}s)`);
        return true;
    }
    getEntryMetadata(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return null;
        }
        const now = Date.now();
        const age = now - entry.timestamp;
        const expiresIn = entry.timestamp + entry.ttl * 1000 - now;
        return {
            ttl: entry.ttl,
            age: Math.floor(age / 1000),
            expiresIn: Math.max(0, Math.floor(expiresIn / 1000)),
        };
    }
    cleanup() {
        const now = Date.now();
        let cleanedCount = 0;
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.timestamp + entry.ttl * 1000) {
                this.cache.delete(key);
                cleanedCount++;
            }
        }
        if (cleanedCount > 0) {
            this.updateStats();
            this.logInfo(`Cache cleanup: ${cleanedCount} expired entries removed`);
        }
    }
    updateStats() {
        this.stats.keys = this.cache.size;
        this.stats.memoryUsage = this.getMemoryUsage();
        this.updateHitRate();
    }
    updateHitRate() {
        const total = this.stats.hits + this.stats.misses;
        this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
    }
    resetStats() {
        this.stats = {
            hits: 0,
            misses: 0,
            keys: 0,
            memoryUsage: 0,
            hitRate: 0,
        };
    }
};
exports.DiscoveryCacheService = DiscoveryCacheService;
exports.DiscoveryCacheService = DiscoveryCacheService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DiscoveryCacheService);
//# sourceMappingURL=discovery-cache.service.js.map