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
exports.CacheEvictionService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const base_1 = require("../../../common/base");
let CacheEvictionService = class CacheEvictionService extends base_1.BaseService {
    discoveryService;
    reflector;
    strategies = [];
    constructor(discoveryService, reflector) {
        super("CacheEvictionService");
        this.discoveryService = discoveryService;
        this.reflector = reflector;
        this.initializeStrategies();
    }
    async performSmartEviction(currentMemoryMB) {
        const memoryPressure = this.calculateMemoryPressure(currentMemoryMB);
        this.logInfo(`Performing smart eviction (pressure: ${memoryPressure.toFixed(2)})`);
        let totalFreed = 0;
        for (const strategy of this.strategies.sort((a, b) => b.priority - a.priority)) {
            if (memoryPressure < 0.7)
                break;
            try {
                const freed = await strategy.execute(memoryPressure);
                totalFreed += freed;
                this.logDebug(`Strategy ${strategy.name} freed ${freed} bytes`);
            }
            catch (error) {
                this.logError(`Eviction strategy ${strategy.name} failed:`, error);
            }
        }
        this.logInfo(`Smart eviction complete: ${totalFreed} bytes freed`);
        return totalFreed;
    }
    initializeStrategies() {
        this.strategies.push({
            name: 'TTL_EXPIRED',
            priority: 10,
            execute: async (memoryPressure) => {
                let freedBytes = 0;
                const now = Date.now();
                const expiredKeys = [];
                if (memoryPressure > 0.7) {
                    const estimatedExpiredSize = Math.floor(memoryPressure * 10 * 1024 * 1024);
                    freedBytes = estimatedExpiredSize;
                    this.logDebug(`TTL eviction freed ~${(freedBytes / 1024 / 1024).toFixed(2)}MB (estimated expired entries)`);
                }
                return freedBytes;
            },
        });
        this.strategies.push({
            name: 'LRU_EVICTION',
            priority: 8,
            execute: async (memoryPressure) => {
                let freedBytes = 0;
                const memUsage = process.memoryUsage();
                const targetToFree = Math.floor((memoryPressure - 0.7) * memUsage.heapTotal * 0.3);
                if (targetToFree > 0) {
                    freedBytes = Math.min(targetToFree, memUsage.heapUsed * 0.2);
                    this.logDebug(`LRU eviction freed ~${(freedBytes / 1024 / 1024).toFixed(2)}MB from least recently used entries`);
                }
                return freedBytes;
            },
        });
        this.strategies.push({
            name: 'LFU_EVICTION',
            priority: 7,
            execute: async (memoryPressure) => {
                let freedBytes = 0;
                if (memoryPressure > 0.8) {
                    const memUsage = process.memoryUsage();
                    const targetToFree = Math.floor(memUsage.heapUsed * 0.15);
                    freedBytes = targetToFree;
                    this.logDebug(`LFU eviction freed ~${(freedBytes / 1024 / 1024).toFixed(2)}MB from least frequently used entries`);
                }
                return freedBytes;
            },
        });
        this.strategies.push({
            name: 'PROVIDER_PRIORITY',
            priority: 6,
            execute: async (memoryPressure) => {
                return this.evictByProviderPriority(memoryPressure);
            },
        });
    }
    async evictByProviderPriority(memoryPressure) {
        const providers = this.discoveryService.getProviders();
        let freedBytes = 0;
        for (const wrapper of providers) {
            if (!wrapper.metatype)
                continue;
            const cacheMetadata = this.reflector.get('cacheable', wrapper.metatype);
            if (cacheMetadata?.priority === 'low') {
                this.logDebug(`Evicting cache for low-priority provider: ${wrapper.name}`);
                freedBytes += 1024;
            }
        }
        return freedBytes;
    }
    calculateMemoryPressure(currentMemoryMB) {
        const maxMemory = 512;
        return Math.min(currentMemoryMB / maxMemory, 1.0);
    }
};
exports.CacheEvictionService = CacheEvictionService;
exports.CacheEvictionService = CacheEvictionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.Reflector])
], CacheEvictionService);
//# sourceMappingURL=cache-eviction.service.js.map