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
exports.GCOptimizationService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const smart_garbage_collection_service_1 = require("./smart-garbage-collection.service");
const memory_leak_detection_service_1 = require("./memory-leak-detection.service");
const base_1 = require("../../../common/base");
const logger_service_1 = require("../../../common/logging/logger.service");
let GCOptimizationService = class GCOptimizationService extends base_1.BaseService {
    discoveryService;
    reflector;
    smartGCService;
    leakDetectionService;
    gcTimer = null;
    gcStrategies = new Map();
    gcMetrics = {
        totalCollections: 0,
        memoryFreed: 0,
        averageCollectionTime: 0,
        successRate: 100,
        lastOptimization: new Date(),
        heapUtilization: 0,
    };
    optimizationHistory = [];
    gcProviders = new Set();
    isOptimizing = false;
    constructor(logger, discoveryService, reflector, smartGCService, leakDetectionService) {
        super({
            serviceName: 'GCOptimizationService',
            logger,
            enableAuditLogging: true,
        });
        this.discoveryService = discoveryService;
        this.reflector = reflector;
        this.smartGCService = smartGCService;
        this.leakDetectionService = leakDetectionService;
        this.initializeDefaultStrategies();
    }
    async onModuleInit() {
        this.logInfo('Initializing GC Optimization Service');
        await this.discoverGCProviders();
        this.startOptimizationScheduler();
    }
    async onApplicationShutdown() {
        this.logInfo('Shutting down GC Optimization Service');
        if (this.gcTimer) {
            clearInterval(this.gcTimer);
        }
        await this.performFinalOptimization();
    }
    async discoverGCProviders() {
        try {
            const providers = this.discoveryService.getProviders();
            const controllers = this.discoveryService.getControllers();
            const allWrappers = [...providers, ...controllers];
            for (const wrapper of allWrappers) {
                if (this.isGCOptimizable(wrapper)) {
                    this.gcProviders.add(wrapper.instance);
                    this.logDebug(`Discovered GC optimizable provider: ${wrapper.name}`);
                }
            }
            this.logInfo(`Discovered ${this.gcProviders.size} GC optimizable providers`);
        }
        catch (error) {
            this.logError('Error discovering GC providers', error);
        }
    }
    isGCOptimizable(wrapper) {
        if (!wrapper.instance || !wrapper.metatype) {
            return false;
        }
        const gcMetadata = this.reflector.get('gc-optimization', wrapper.metatype);
        const memoryIntensive = this.reflector.get('memory-intensive', wrapper.metatype);
        const leakProne = this.reflector.get('leak-prone', wrapper.metatype);
        return (gcMetadata ||
            memoryIntensive ||
            leakProne ||
            this.hasGCMethods(wrapper.instance));
    }
    hasGCMethods(instance) {
        if (typeof instance !== 'object' || instance === null) {
            return false;
        }
        const gcMethods = ['cleanup', 'clearCache', 'dispose', 'destroy', 'reset'];
        return gcMethods.some((method) => typeof instance[method] === 'function');
    }
    initializeDefaultStrategies() {
        this.gcStrategies.set('memory-pressure', {
            name: 'Memory Pressure',
            priority: 1,
            condition: (memoryUsage) => {
                const heapUsed = memoryUsage.heapUsed / 1024 / 1024;
                return heapUsed > 100;
            },
            execute: async () => {
                if (global.gc) {
                    global.gc();
                }
                await this.clearProviderCaches();
            },
        });
        this.gcStrategies.set('heap-fragmentation', {
            name: 'Heap Fragmentation',
            priority: 2,
            condition: (memoryUsage) => {
                const heapTotal = memoryUsage.heapTotal;
                const heapUsed = memoryUsage.heapUsed;
                const fragmentation = (heapTotal - heapUsed) / heapTotal;
                return fragmentation > 0.3;
            },
            execute: async () => {
                if (global.gc) {
                    global.gc();
                }
                await this.compactProviderData();
            },
        });
        this.gcStrategies.set('leak-detection', {
            name: 'Leak Detection',
            priority: 3,
            condition: async () => {
                const suspects = await this.leakDetectionService.getLeakSuspects();
                return suspects.length > 0;
            },
            execute: async () => {
                const suspects = await this.leakDetectionService.getLeakSuspects();
                for (const suspect of suspects) {
                    const provider = this.findProviderByName(suspect.providerName);
                    if (provider) {
                        await this.optimizeProvider(provider);
                    }
                }
            },
        });
        this.gcStrategies.set('periodic-cleanup', {
            name: 'Periodic Cleanup',
            priority: 4,
            condition: () => {
                const timeSinceLastGC = Date.now() - this.gcMetrics.lastOptimization.getTime();
                return timeSinceLastGC > 300000;
            },
            execute: async () => {
                await this.performLightweightCleanup();
            },
        });
    }
    startOptimizationScheduler() {
        const interval = 60000;
        this.gcTimer = setInterval(async () => {
            await this.performOptimization();
        }, interval);
        this.logInfo(`GC optimization scheduler started (interval: ${interval}ms)`);
    }
    async performOptimization(options) {
        if (this.isOptimizing) {
            this.logDebug('Optimization already in progress, skipping');
            return [];
        }
        this.isOptimizing = true;
        const results = [];
        try {
            const memoryBefore = process.memoryUsage();
            const startTime = Date.now();
            const sortedStrategies = Array.from(this.gcStrategies.entries()).sort(([, a], [, b]) => a.priority - b.priority);
            for (const [name, strategy] of sortedStrategies) {
                try {
                    const shouldExecute = await strategy.condition(memoryBefore, options);
                    if (shouldExecute) {
                        const strategyStartTime = Date.now();
                        const strategyMemoryBefore = process.memoryUsage().heapUsed;
                        await strategy.execute(options);
                        const strategyMemoryAfter = process.memoryUsage().heapUsed;
                        const executionTime = Date.now() - strategyStartTime;
                        const memoryFreed = strategyMemoryBefore - strategyMemoryAfter;
                        const result = {
                            strategy: name,
                            memoryBefore: strategyMemoryBefore,
                            memoryAfter: strategyMemoryAfter,
                            memoryFreed,
                            executionTime,
                            success: true,
                        };
                        results.push(result);
                        this.logDebug(`GC strategy '${name}' freed ${memoryFreed} bytes in ${executionTime}ms`);
                    }
                }
                catch (error) {
                    const result = {
                        strategy: name,
                        memoryBefore: 0,
                        memoryAfter: 0,
                        memoryFreed: 0,
                        executionTime: 0,
                        success: false,
                        error: error.message,
                    };
                    results.push(result);
                    this.logError(`GC strategy '${name}' failed:`, error);
                }
            }
            this.updateMetrics(results);
            this.optimizationHistory.push(...results);
            if (this.optimizationHistory.length > 100) {
                this.optimizationHistory = this.optimizationHistory.slice(-100);
            }
            const totalTime = Date.now() - startTime;
            const memoryAfter = process.memoryUsage();
            const totalMemoryFreed = memoryBefore.heapUsed - memoryAfter.heapUsed;
            this.logInfo(`GC optimization completed: ${totalMemoryFreed} bytes freed in ${totalTime}ms`);
        }
        catch (error) {
            this.logError('Error during GC optimization:', error);
        }
        finally {
            this.isOptimizing = false;
        }
        return results;
    }
    async clearProviderCaches() {
        for (const provider of this.gcProviders) {
            try {
                if (typeof provider.clearCache === 'function') {
                    await provider.clearCache();
                }
                else if (typeof provider.cleanup === 'function') {
                    await provider.cleanup();
                }
            }
            catch (error) {
                this.logError(`Error clearing cache for provider:`, error);
            }
        }
    }
    async compactProviderData() {
        for (const provider of this.gcProviders) {
            try {
                if (typeof provider.compact === 'function') {
                    await provider.compact();
                }
                else if (typeof provider.optimize === 'function') {
                    await provider.optimize();
                }
            }
            catch (error) {
                this.logError(`Error compacting provider data:`, error);
            }
        }
    }
    findProviderByName(providerName) {
        const providers = this.discoveryService.getProviders();
        const controllers = this.discoveryService.getControllers();
        const allWrappers = [...providers, ...controllers];
        const wrapper = allWrappers.find((w) => w.name === providerName);
        const instance = wrapper?.instance;
        if (instance && this.hasGCMethods(instance)) {
            return instance;
        }
        return null;
    }
    async optimizeProvider(provider) {
        try {
            if (typeof provider.optimize === 'function') {
                await provider.optimize();
            }
            else if (typeof provider.cleanup === 'function') {
                await provider.cleanup();
            }
            else if (typeof provider.clearCache === 'function') {
                await provider.clearCache();
            }
        }
        catch (error) {
            this.logError(`Error optimizing provider:`, error);
        }
    }
    async performLightweightCleanup() {
        for (const provider of this.gcProviders) {
            try {
                if (typeof provider.lightCleanup === 'function') {
                    await provider.lightCleanup();
                }
            }
            catch (error) {
                this.logError(`Error during lightweight cleanup:`, error);
            }
        }
    }
    updateMetrics(results) {
        const successfulResults = results.filter((r) => r.success);
        const totalMemoryFreed = successfulResults.reduce((sum, r) => sum + r.memoryFreed, 0);
        const averageTime = successfulResults.reduce((sum, r) => sum + r.executionTime, 0) /
            successfulResults.length || 0;
        this.gcMetrics.totalCollections += results.length;
        this.gcMetrics.memoryFreed += totalMemoryFreed;
        this.gcMetrics.averageCollectionTime =
            (this.gcMetrics.averageCollectionTime + averageTime) / 2;
        this.gcMetrics.successRate =
            (successfulResults.length / results.length) * 100;
        this.gcMetrics.lastOptimization = new Date();
        const memoryUsage = process.memoryUsage();
        this.gcMetrics.heapUtilization =
            (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
    }
    async performFinalOptimization() {
        this.logInfo('Performing final GC optimization before shutdown');
        await this.clearProviderCaches();
        if (global.gc) {
            global.gc();
        }
        this.logInfo('Final GC optimization completed');
    }
    addStrategy(name, strategy) {
        this.gcStrategies.set(name, strategy);
        this.logInfo(`Added custom GC strategy: ${name}`);
    }
    removeStrategy(name) {
        const removed = this.gcStrategies.delete(name);
        if (removed) {
            this.logInfo(`Removed GC strategy: ${name}`);
        }
        return removed;
    }
    getMetrics() {
        return { ...this.gcMetrics };
    }
    getOptimizationHistory() {
        return [...this.optimizationHistory];
    }
    getMemoryStats() {
        const memoryUsage = process.memoryUsage();
        return {
            ...memoryUsage,
            heapUtilization: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
        };
    }
    async forceOptimization(options) {
        this.logInfo('Forcing immediate GC optimization');
        return await this.performOptimization(options);
    }
    resetMetrics() {
        this.gcMetrics.totalCollections = 0;
        this.gcMetrics.memoryFreed = 0;
        this.gcMetrics.averageCollectionTime = 0;
        this.gcMetrics.successRate = 100;
        this.gcMetrics.lastOptimization = new Date();
        this.gcMetrics.heapUtilization = 0;
        this.optimizationHistory = [];
        this.logInfo('GC metrics and history reset');
    }
};
exports.GCOptimizationService = GCOptimizationService;
exports.GCOptimizationService = GCOptimizationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        core_1.DiscoveryService,
        core_1.Reflector,
        smart_garbage_collection_service_1.SmartGarbageCollectionService,
        memory_leak_detection_service_1.MemoryLeakDetectionService])
], GCOptimizationService);
//# sourceMappingURL=gc-optimization.service.js.map