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
var MemoryOptimizedCacheModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryOptimizedCacheModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const memory_optimized_cache_service_1 = require("./services/memory-optimized-cache.service");
const cache_eviction_service_1 = require("./services/cache-eviction.service");
const memory_monitor_service_1 = require("./services/memory-monitor.service");
const smart_cache_interceptor_1 = require("./interceptors/smart-cache.interceptor");
const memory_threshold_guard_1 = require("./guards/memory-threshold.guard");
let MemoryOptimizedCacheModuleService = class MemoryOptimizedCacheModuleService {
    discoveryService;
    reflector;
    cacheService;
    evictionService;
    memoryMonitor;
    cleanupInterval;
    constructor(discoveryService, reflector, cacheService, evictionService, memoryMonitor) {
        this.discoveryService = discoveryService;
        this.reflector = reflector;
        this.cacheService = cacheService;
        this.evictionService = evictionService;
        this.memoryMonitor = memoryMonitor;
    }
    async onApplicationBootstrap() {
        await this.discoverCacheableProviders();
        this.memoryMonitor.startMonitoring();
        this.cleanupInterval = setInterval(async () => {
            await this.performSmartCleanup();
        }, 30000);
    }
    async onApplicationShutdown() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.memoryMonitor.stopMonitoring();
        await this.cacheService.shutdown();
    }
    async discoverCacheableProviders() {
        const providers = this.discoveryService.getProviders();
        for (const wrapper of providers) {
            if (!wrapper.metatype)
                continue;
            const cacheMetadata = this.reflector.get('cacheable', wrapper.metatype);
            if (cacheMetadata?.enabled) {
                await this.cacheService.registerCacheableProvider(wrapper.name || wrapper.token?.toString() || 'unknown', {
                    ttl: cacheMetadata.ttl || 300,
                    maxSize: cacheMetadata.maxSize || 100,
                    priority: cacheMetadata.priority || 'normal',
                    compressionEnabled: cacheMetadata.compress !== false,
                });
            }
            const memoryMetadata = this.reflector.get('memory-sensitive', wrapper.metatype);
            if (memoryMetadata) {
                this.memoryMonitor.addMonitoredProvider(wrapper.name || 'unknown', memoryMetadata);
            }
        }
    }
    async performSmartCleanup() {
        const memoryUsage = process.memoryUsage();
        const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
        if (heapUsedMB > 400) {
            await this.evictionService.performSmartEviction(heapUsedMB);
        }
    }
};
MemoryOptimizedCacheModuleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.Reflector,
        memory_optimized_cache_service_1.MemoryOptimizedCacheService,
        cache_eviction_service_1.CacheEvictionService,
        memory_monitor_service_1.MemoryMonitorService])
], MemoryOptimizedCacheModuleService);
let MemoryOptimizedCacheModule = MemoryOptimizedCacheModule_1 = class MemoryOptimizedCacheModule {
    static forRoot(options = {}) {
        return {
            module: MemoryOptimizedCacheModule_1,
            imports: [core_1.DiscoveryModule],
            providers: [
                memory_optimized_cache_service_1.MemoryOptimizedCacheService,
                cache_eviction_service_1.CacheEvictionService,
                memory_monitor_service_1.MemoryMonitorService,
                smart_cache_interceptor_1.SmartCacheInterceptor,
                memory_threshold_guard_1.MemoryThresholdGuard,
                MemoryOptimizedCacheModuleService,
                {
                    provide: 'MEMORY_CACHE_OPTIONS',
                    useValue: {
                        maxMemoryThreshold: 512,
                        evictionStrategy: 'smart',
                        compressionEnabled: true,
                        autoScalingEnabled: true,
                        metricsEnabled: true,
                        discoveryEnabled: true,
                        ...options,
                    },
                },
            ],
            exports: [
                memory_optimized_cache_service_1.MemoryOptimizedCacheService,
                cache_eviction_service_1.CacheEvictionService,
                memory_monitor_service_1.MemoryMonitorService,
                smart_cache_interceptor_1.SmartCacheInterceptor,
                memory_threshold_guard_1.MemoryThresholdGuard,
            ],
        };
    }
};
exports.MemoryOptimizedCacheModule = MemoryOptimizedCacheModule;
exports.MemoryOptimizedCacheModule = MemoryOptimizedCacheModule = MemoryOptimizedCacheModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [core_1.DiscoveryModule],
        providers: [
            memory_optimized_cache_service_1.MemoryOptimizedCacheService,
            cache_eviction_service_1.CacheEvictionService,
            memory_monitor_service_1.MemoryMonitorService,
            smart_cache_interceptor_1.SmartCacheInterceptor,
            memory_threshold_guard_1.MemoryThresholdGuard,
            MemoryOptimizedCacheModuleService,
        ],
        exports: [
            memory_optimized_cache_service_1.MemoryOptimizedCacheService,
            cache_eviction_service_1.CacheEvictionService,
            memory_monitor_service_1.MemoryMonitorService,
            smart_cache_interceptor_1.SmartCacheInterceptor,
            memory_threshold_guard_1.MemoryThresholdGuard,
        ],
    })
], MemoryOptimizedCacheModule);
//# sourceMappingURL=memory-optimized-cache.module.js.map