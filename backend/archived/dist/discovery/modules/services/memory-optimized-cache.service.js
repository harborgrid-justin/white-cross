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
exports.MemoryOptimizedCacheService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const base_1 = require("../../../common/base");
let MemoryOptimizedCacheService = class MemoryOptimizedCacheService extends base_1.BaseService {
    options;
    discoveryService;
    reflector;
    cache = new Map();
    providerConfigs = new Map();
    memoryUsage = 0;
    compressionThreshold = 1024;
    constructor(options, discoveryService, reflector) {
        super("MemoryOptimizedCacheService");
        this.options = options;
        this.discoveryService = discoveryService;
        this.reflector = reflector;
    }
    async registerCacheableProvider(providerName, config) {
        this.providerConfigs.set(providerName, config);
        this.logInfo(`Registered cacheable provider: ${providerName}`, {
            ttl: config.ttl,
            maxSize: config.maxSize,
            priority: config.priority,
        });
    }
    async set(key, data, providerName, customTtl) {
        const provider = providerName || 'default';
        const config = this.providerConfigs.get(provider) || {
            ttl: 300,
            maxSize: 100,
            priority: 'normal',
            compressionEnabled: true,
        };
        const dataSize = this.calculateSize(data);
        let finalData = data;
        let compressed = false;
        if (config.compressionEnabled && dataSize > this.compressionThreshold) {
            try {
                finalData = await this.compressData(data);
                compressed = true;
                this.logDebug(`Compressed cache entry ${key}: ${dataSize} -> ${this.calculateSize(finalData)} bytes`);
            }
            catch (error) {
                this.logWarning(`Failed to compress cache entry ${key}:`, error);
            }
        }
        const entry = {
            data: finalData,
            timestamp: Date.now(),
            accessCount: 0,
            lastAccessed: Date.now(),
            size: this.calculateSize(finalData),
            compressed,
            provider,
        };
        if (this.memoryUsage + entry.size >
            this.options.maxMemoryThreshold * 1024 * 1024) {
            await this.evictLeastValuable(entry.size);
        }
        if (this.cache.has(key)) {
            this.memoryUsage -= this.cache.get(key).size;
        }
        this.cache.set(key, entry);
        this.memoryUsage += entry.size;
        const ttl = customTtl || config.ttl;
        setTimeout(() => {
            this.delete(key);
        }, ttl * 1000);
    }
    async get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return null;
        }
        entry.accessCount++;
        entry.lastAccessed = Date.now();
        let data = entry.data;
        if (entry.compressed) {
            try {
                data = await this.decompressData(entry.data);
            }
            catch (error) {
                this.logError(`Failed to decompress cache entry ${key}:`, error);
                this.delete(key);
                return null;
            }
        }
        return data;
    }
    delete(key) {
        const entry = this.cache.get(key);
        if (entry) {
            this.memoryUsage -= entry.size;
            this.cache.delete(key);
            return true;
        }
        return false;
    }
    clearProvider(providerName) {
        for (const [key, entry] of this.cache.entries()) {
            if (entry.provider === providerName) {
                this.delete(key);
            }
        }
        this.logInfo(`Cleared cache for provider: ${providerName}`);
    }
    getStats() {
        const providerBreakdown = {};
        let compressedEntries = 0;
        let totalCompressedSize = 0;
        let totalUncompressedSize = 0;
        for (const [key, entry] of this.cache.entries()) {
            providerBreakdown[entry.provider] =
                (providerBreakdown[entry.provider] || 0) + 1;
            if (entry.compressed) {
                compressedEntries++;
                totalCompressedSize += entry.size;
                totalUncompressedSize += entry.size * 3;
            }
        }
        return {
            totalEntries: this.cache.size,
            memoryUsage: this.memoryUsage,
            hitRate: 0,
            providerBreakdown,
            compressionRatio: totalUncompressedSize > 0
                ? totalUncompressedSize / totalCompressedSize
                : 1,
        };
    }
    async evictLeastValuable(requiredSpace) {
        const entries = Array.from(this.cache.entries());
        entries.sort(([keyA, entryA], [keyB, entryB]) => {
            const configA = this.providerConfigs.get(entryA.provider);
            const configB = this.providerConfigs.get(entryB.provider);
            const priorityScoreA = this.getPriorityScore(configA?.priority || 'normal');
            const priorityScoreB = this.getPriorityScore(configB?.priority || 'normal');
            const valueA = this.calculateEntryValue(entryA, priorityScoreA);
            const valueB = this.calculateEntryValue(entryB, priorityScoreB);
            return valueA - valueB;
        });
        let freedSpace = 0;
        const now = Date.now();
        for (const [key, entry] of entries) {
            if (freedSpace >= requiredSpace)
                break;
            this.delete(key);
            freedSpace += entry.size;
            this.logDebug(`Evicted cache entry ${key} (${entry.size} bytes, provider: ${entry.provider})`);
        }
        this.logInfo(`Evicted ${freedSpace} bytes to free memory`);
    }
    calculateEntryValue(entry, priorityScore) {
        const now = Date.now();
        const age = now - entry.timestamp;
        const timeSinceLastAccess = now - entry.lastAccessed;
        const frequencyScore = entry.accessCount / Math.max(age / 1000, 1);
        const recencyScore = 1 / Math.max(timeSinceLastAccess / 1000, 1);
        return frequencyScore * recencyScore * priorityScore;
    }
    getPriorityScore(priority) {
        switch (priority) {
            case 'high':
                return 3;
            case 'normal':
                return 2;
            case 'low':
                return 1;
            default:
                return 2;
        }
    }
    calculateSize(data) {
        try {
            return JSON.stringify(data).length * 2;
        }
        catch {
            return 1024;
        }
    }
    async compressData(data) {
        return JSON.stringify(data);
    }
    async decompressData(compressedData) {
        return JSON.parse(compressedData);
    }
    async shutdown() {
        this.cache.clear();
        this.providerConfigs.clear();
        this.memoryUsage = 0;
        this.logInfo('Memory optimized cache shutdown complete');
    }
};
exports.MemoryOptimizedCacheService = MemoryOptimizedCacheService;
exports.MemoryOptimizedCacheService = MemoryOptimizedCacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('MEMORY_CACHE_OPTIONS')),
    __metadata("design:paramtypes", [Object, core_1.DiscoveryService,
        core_1.Reflector])
], MemoryOptimizedCacheService);
//# sourceMappingURL=memory-optimized-cache.service.js.map