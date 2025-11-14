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
var SmartGarbageCollectionModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartGarbageCollectionModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const smart_garbage_collection_service_1 = require("./services/smart-garbage-collection.service");
const memory_leak_detection_service_1 = require("./services/memory-leak-detection.service");
const gc_optimization_service_1 = require("./services/gc-optimization.service");
const memory_pressure_interceptor_1 = require("./interceptors/memory-pressure.interceptor");
const gc_scheduler_guard_1 = require("./guards/gc-scheduler.guard");
let SmartGarbageCollectionModuleService = class SmartGarbageCollectionModuleService {
    discoveryService;
    reflector;
    gcService;
    leakDetectionService;
    optimizationService;
    gcMonitoringInterval;
    leakDetectionInterval;
    optimizationInterval;
    constructor(discoveryService, reflector, gcService, leakDetectionService, optimizationService) {
        this.discoveryService = discoveryService;
        this.reflector = reflector;
        this.gcService = gcService;
        this.leakDetectionService = leakDetectionService;
        this.optimizationService = optimizationService;
    }
    async onApplicationBootstrap() {
        await this.discoverMemoryIntensiveProviders();
        this.gcService.startMonitoring();
        this.gcMonitoringInterval = setInterval(async () => {
            await this.monitorGarbageCollection();
        }, 15000);
        this.leakDetectionInterval = setInterval(async () => {
            await this.leakDetectionService.detectMemoryLeaks();
        }, 300000);
        this.optimizationInterval = setInterval(async () => {
            await this.optimizationService.performOptimization();
        }, 600000);
    }
    async onApplicationShutdown() {
        if (this.gcMonitoringInterval) {
            clearInterval(this.gcMonitoringInterval);
        }
        if (this.leakDetectionInterval) {
            clearInterval(this.leakDetectionInterval);
        }
        if (this.optimizationInterval) {
            clearInterval(this.optimizationInterval);
        }
        this.gcService.stopMonitoring();
        await this.gcService.performFinalCleanup();
    }
    async discoverMemoryIntensiveProviders() {
        const providers = this.discoveryService.getProviders();
        for (const wrapper of providers) {
            if (!wrapper.metatype)
                continue;
            const gcMetadata = this.reflector.get('garbage-collection', wrapper.metatype);
            if (gcMetadata?.enabled) {
                this.gcService.registerMemoryIntensiveProvider(wrapper.name || wrapper.token?.toString() || 'unknown', {
                    priority: gcMetadata.priority || 'normal',
                    cleanupStrategy: gcMetadata.strategy || 'standard',
                    memoryThreshold: gcMetadata.threshold || 50,
                    customCleanup: gcMetadata.customCleanup,
                });
            }
            const leakProneMetadata = this.reflector.get('leak-prone', wrapper.metatype);
            if (leakProneMetadata) {
                this.leakDetectionService.addMonitoredProvider(wrapper.name || 'unknown', leakProneMetadata);
            }
            const computationMetadata = this.reflector.get('heavy-computation', wrapper.metatype);
            if (computationMetadata) {
                this.gcService.registerComputationIntensiveProvider(wrapper.name || 'unknown', computationMetadata);
            }
        }
    }
    async monitorGarbageCollection() {
        const memoryUsage = process.memoryUsage();
        const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
        if (heapUsedMB > 450) {
            await this.gcService.performAggressiveGarbageCollection();
        }
        else if (heapUsedMB > 350) {
            await this.gcService.performSmartGarbageCollection();
        }
        this.gcService.updateGcMetrics(memoryUsage);
    }
};
SmartGarbageCollectionModuleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.Reflector,
        smart_garbage_collection_service_1.SmartGarbageCollectionService,
        memory_leak_detection_service_1.MemoryLeakDetectionService,
        gc_optimization_service_1.GCOptimizationService])
], SmartGarbageCollectionModuleService);
let SmartGarbageCollectionModule = SmartGarbageCollectionModule_1 = class SmartGarbageCollectionModule {
    static forRoot(options = {}) {
        return {
            module: SmartGarbageCollectionModule_1,
            imports: [core_1.DiscoveryModule],
            providers: [
                smart_garbage_collection_service_1.SmartGarbageCollectionService,
                memory_leak_detection_service_1.MemoryLeakDetectionService,
                gc_optimization_service_1.GCOptimizationService,
                memory_pressure_interceptor_1.MemoryPressureInterceptor,
                gc_scheduler_guard_1.GCSchedulerGuard,
                SmartGarbageCollectionModuleService,
                {
                    provide: 'SMART_GC_OPTIONS',
                    useValue: {
                        enableAutoGc: true,
                        gcThresholdMB: 350,
                        aggressiveGcThresholdMB: 450,
                        monitoringInterval: 15,
                        leakDetectionEnabled: true,
                        performanceOptimization: true,
                        discoveryEnabled: true,
                        ...options,
                    },
                },
            ],
            exports: [
                smart_garbage_collection_service_1.SmartGarbageCollectionService,
                memory_leak_detection_service_1.MemoryLeakDetectionService,
                gc_optimization_service_1.GCOptimizationService,
                memory_pressure_interceptor_1.MemoryPressureInterceptor,
                gc_scheduler_guard_1.GCSchedulerGuard,
            ],
        };
    }
};
exports.SmartGarbageCollectionModule = SmartGarbageCollectionModule;
exports.SmartGarbageCollectionModule = SmartGarbageCollectionModule = SmartGarbageCollectionModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [core_1.DiscoveryModule],
        providers: [
            smart_garbage_collection_service_1.SmartGarbageCollectionService,
            memory_leak_detection_service_1.MemoryLeakDetectionService,
            gc_optimization_service_1.GCOptimizationService,
            memory_pressure_interceptor_1.MemoryPressureInterceptor,
            gc_scheduler_guard_1.GCSchedulerGuard,
            SmartGarbageCollectionModuleService,
        ],
        exports: [
            smart_garbage_collection_service_1.SmartGarbageCollectionService,
            memory_leak_detection_service_1.MemoryLeakDetectionService,
            gc_optimization_service_1.GCOptimizationService,
            memory_pressure_interceptor_1.MemoryPressureInterceptor,
            gc_scheduler_guard_1.GCSchedulerGuard,
        ],
    })
], SmartGarbageCollectionModule);
//# sourceMappingURL=smart-garbage-collection.module.js.map