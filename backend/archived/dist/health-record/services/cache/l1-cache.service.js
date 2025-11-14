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
exports.L1CacheService = void 0;
const common_1 = require("@nestjs/common");
const cache_interfaces_1 = require("./cache-interfaces");
const base_1 = require("../../../common/base");
let L1CacheService = class L1CacheService extends base_1.BaseService {
    constructor() {
        super("L1CacheService");
    }
    l1Cache = new Map();
    maxL1Size = 1000;
    l1MaxMemory = 50 * 1024 * 1024;
    l1Hits = 0;
    l1Misses = 0;
    l1Evictions = 0;
    get(key) {
        const startTime = Date.now();
        const entry = this.l1Cache.get(key);
        if (!entry) {
            this.l1Misses++;
            return {
                success: false,
                responseTime: Date.now() - startTime,
            };
        }
        entry.accessCount++;
        entry.lastAccessed = new Date();
        this.l1Hits++;
        return {
            success: true,
            data: entry.data,
            responseTime: Date.now() - startTime,
        };
    }
    set(key, data, compliance, tags = []) {
        const startTime = Date.now();
        const dataSize = this.calculateDataSize(data);
        try {
            if (this.shouldEvictForMemory(dataSize)) {
                this.evictLeastImportantEntries();
            }
            if (this.l1Cache.size >= this.maxL1Size) {
                this.evictLeastImportantEntry();
            }
            const entry = {
                data,
                timestamp: new Date(),
                accessCount: 1,
                lastAccessed: new Date(),
                compliance,
                encrypted: compliance === 'PHI' || compliance === 'SENSITIVE_PHI',
                tags,
                size: dataSize,
                tier: cache_interfaces_1.CacheTier.L1,
            };
            this.l1Cache.set(key, entry);
            return {
                success: true,
                responseTime: Date.now() - startTime,
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
    delete(key) {
        const startTime = Date.now();
        const deleted = this.l1Cache.delete(key);
        return {
            success: true,
            data: deleted,
            responseTime: Date.now() - startTime,
        };
    }
    clear() {
        const startTime = Date.now();
        this.l1Cache.clear();
        this.resetMetrics();
        return {
            success: true,
            responseTime: Date.now() - startTime,
        };
    }
    getStats() {
        const totalRequests = this.l1Hits + this.l1Misses;
        const hitRate = totalRequests > 0 ? this.l1Hits / totalRequests : 0;
        return {
            hits: this.l1Hits,
            misses: this.l1Misses,
            evictions: this.l1Evictions,
            size: this.l1Cache.size,
            memoryUsage: this.calculateMemoryUsage(),
            hitRate,
        };
    }
    has(key) {
        return this.l1Cache.has(key);
    }
    keys() {
        return Array.from(this.l1Cache.keys());
    }
    optimize() {
        const beforeSize = this.l1Cache.size;
        this.evictLeastRecentlyUsed(100);
        const evicted = beforeSize - this.l1Cache.size;
        this.l1Evictions += evicted;
        return evicted;
    }
    calculateDataSize(data) {
        try {
            return JSON.stringify(data).length;
        }
        catch {
            return 0;
        }
    }
    calculateMemoryUsage() {
        let total = 0;
        for (const entry of Array.from(this.l1Cache.values())) {
            total += entry.size;
        }
        return total;
    }
    shouldEvictForMemory(newDataSize) {
        const currentMemory = this.calculateMemoryUsage();
        return currentMemory + newDataSize > this.l1MaxMemory;
    }
    evictLeastImportantEntries() {
        const entries = Array.from(this.l1Cache.entries()).map(([key, entry]) => ({
            key,
            entry,
            importance: entry.accessCount * (1 / (Date.now() - entry.lastAccessed.getTime() + 1)),
        }));
        entries.sort((a, b) => a.importance - b.importance);
        let currentMemory = this.calculateMemoryUsage();
        let evicted = 0;
        for (const { key } of entries) {
            if (currentMemory <= this.l1MaxMemory * 0.8)
                break;
            this.l1Cache.delete(key);
            currentMemory = this.calculateMemoryUsage();
            evicted++;
        }
        this.l1Evictions += evicted;
    }
    evictLeastImportantEntry() {
        let leastImportantKey = null;
        let leastImportance = Infinity;
        for (const [key, entry] of this.l1Cache.entries()) {
            const importance = entry.accessCount * (1 / (Date.now() - entry.lastAccessed.getTime() + 1));
            if (importance < leastImportance) {
                leastImportance = importance;
                leastImportantKey = key;
            }
        }
        if (leastImportantKey) {
            this.l1Cache.delete(leastImportantKey);
            this.l1Evictions++;
        }
    }
    evictLeastRecentlyUsed(count) {
        const entries = Array.from(this.l1Cache.entries())
            .map(([key, entry]) => ({ key, lastAccessed: entry.lastAccessed.getTime() }))
            .sort((a, b) => a.lastAccessed - b.lastAccessed);
        for (let i = 0; i < Math.min(count, entries.length); i++) {
            this.l1Cache.delete(entries[i].key);
            this.l1Evictions++;
        }
    }
    resetMetrics() {
        this.l1Hits = 0;
        this.l1Misses = 0;
        this.l1Evictions = 0;
    }
};
exports.L1CacheService = L1CacheService;
exports.L1CacheService = L1CacheService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], L1CacheService);
//# sourceMappingURL=l1-cache.service.js.map