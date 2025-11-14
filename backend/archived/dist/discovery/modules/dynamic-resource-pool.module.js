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
var DynamicResourcePoolModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicResourcePoolModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const dynamic_resource_pool_service_1 = require("./services/dynamic-resource-pool.service");
const resource_monitor_service_1 = require("./services/resource-monitor.service");
const pool_optimization_service_1 = require("./services/pool-optimization.service");
const resource_throttle_interceptor_1 = require("./interceptors/resource-throttle.interceptor");
const resource_quota_guard_1 = require("./guards/resource-quota.guard");
let DynamicResourcePoolModuleService = class DynamicResourcePoolModuleService {
    discoveryService;
    reflector;
    poolService;
    monitorService;
    optimizationService;
    monitoringInterval;
    optimizationInterval;
    constructor(discoveryService, reflector, poolService, monitorService, optimizationService) {
        this.discoveryService = discoveryService;
        this.reflector = reflector;
        this.poolService = poolService;
        this.monitorService = monitorService;
        this.optimizationService = optimizationService;
    }
    async onApplicationBootstrap() {
        await this.discoverResourceProviders();
        this.monitorService.startMonitoring();
        this.monitoringInterval = setInterval(async () => {
            await this.monitorResourceUsage();
        }, 10000);
        this.optimizationInterval = setInterval(async () => {
            await this.optimizationService.optimizePools();
        }, 60000);
    }
    async onApplicationShutdown() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
        if (this.optimizationInterval) {
            clearInterval(this.optimizationInterval);
        }
        this.monitorService.stopMonitoring();
        await this.poolService.shutdown();
    }
    async discoverResourceProviders() {
        const providers = this.discoveryService.getProviders();
        for (const wrapper of providers) {
            if (!wrapper.metatype)
                continue;
            const poolMetadata = this.reflector.get('resource-pool', wrapper.metatype);
            if (poolMetadata?.enabled) {
                await this.poolService.createPool(wrapper.name || wrapper.token?.toString() || 'unknown', {
                    minSize: poolMetadata.minSize || 1,
                    maxSize: poolMetadata.maxSize || 10,
                    resourceType: poolMetadata.type || 'connection',
                    factory: poolMetadata.factory,
                    validation: poolMetadata.validation,
                });
            }
            const dbMetadata = this.reflector.get('database', wrapper.metatype);
            if (dbMetadata) {
                await this.poolService.registerDatabaseProvider(wrapper.name || 'unknown', dbMetadata);
            }
        }
    }
    async monitorResourceUsage() {
        const stats = this.monitorService.getResourceStats();
        const memoryUsage = process.memoryUsage();
        if (memoryUsage.heapUsed / 1024 / 1024 > 400) {
            await this.poolService.scaleDownPools('memory-pressure');
        }
        await this.poolService.cleanupIdleResources();
    }
};
DynamicResourcePoolModuleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.Reflector,
        dynamic_resource_pool_service_1.DynamicResourcePoolService,
        resource_monitor_service_1.ResourceMonitorService,
        pool_optimization_service_1.PoolOptimizationService])
], DynamicResourcePoolModuleService);
let DynamicResourcePoolModule = DynamicResourcePoolModule_1 = class DynamicResourcePoolModule {
    static forRoot(options = {}) {
        return {
            module: DynamicResourcePoolModule_1,
            imports: [core_1.DiscoveryModule],
            providers: [
                dynamic_resource_pool_service_1.DynamicResourcePoolService,
                resource_monitor_service_1.ResourceMonitorService,
                pool_optimization_service_1.PoolOptimizationService,
                resource_throttle_interceptor_1.ResourceThrottleInterceptor,
                resource_quota_guard_1.ResourceQuotaGuard,
                DynamicResourcePoolModuleService,
                {
                    provide: 'RESOURCE_POOL_OPTIONS',
                    useValue: {
                        maxConnections: 50,
                        connectionTimeout: 30000,
                        idleTimeout: 300000,
                        maxMemoryPerPool: 64,
                        autoScaling: true,
                        metricsEnabled: true,
                        discoveryEnabled: true,
                        ...options,
                    },
                },
            ],
            exports: [
                dynamic_resource_pool_service_1.DynamicResourcePoolService,
                resource_monitor_service_1.ResourceMonitorService,
                pool_optimization_service_1.PoolOptimizationService,
                resource_throttle_interceptor_1.ResourceThrottleInterceptor,
                resource_quota_guard_1.ResourceQuotaGuard,
            ],
        };
    }
};
exports.DynamicResourcePoolModule = DynamicResourcePoolModule;
exports.DynamicResourcePoolModule = DynamicResourcePoolModule = DynamicResourcePoolModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [core_1.DiscoveryModule],
        providers: [
            dynamic_resource_pool_service_1.DynamicResourcePoolService,
            resource_monitor_service_1.ResourceMonitorService,
            pool_optimization_service_1.PoolOptimizationService,
            resource_throttle_interceptor_1.ResourceThrottleInterceptor,
            resource_quota_guard_1.ResourceQuotaGuard,
            DynamicResourcePoolModuleService,
        ],
        exports: [
            dynamic_resource_pool_service_1.DynamicResourcePoolService,
            resource_monitor_service_1.ResourceMonitorService,
            pool_optimization_service_1.PoolOptimizationService,
            resource_throttle_interceptor_1.ResourceThrottleInterceptor,
            resource_quota_guard_1.ResourceQuotaGuard,
        ],
    })
], DynamicResourcePoolModule);
//# sourceMappingURL=dynamic-resource-pool.module.js.map