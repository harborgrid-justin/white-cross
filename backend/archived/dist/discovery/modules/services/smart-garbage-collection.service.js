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
exports.SmartGarbageCollectionService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const base_1 = require("../../../common/base");
let SmartGarbageCollectionService = class SmartGarbageCollectionService extends base_1.BaseService {
    options;
    discoveryService;
    reflector;
    memoryIntensiveProviders = new Map();
    computationIntensiveProviders = new Map();
    gcHistory = [];
    gcMetrics = {
        totalGcCycles: 0,
        totalMemoryFreed: 0,
        averageGcTime: 0,
        lastGcTimestamp: 0,
        gcEfficiency: 0,
        memoryLeaksDetected: 0,
        memoryLeaksPrevented: 0,
    };
    monitoringInterval;
    isMonitoring = false;
    constructor(options, discoveryService, reflector) {
        super("SmartGarbageCollectionService");
        this.options = options;
        this.discoveryService = discoveryService;
        this.reflector = reflector;
    }
    startMonitoring() {
        if (this.isMonitoring) {
            this.logWarning('GC monitoring already started');
            return;
        }
        this.isMonitoring = true;
        this.logInfo('Starting smart garbage collection monitoring');
        this.monitoringInterval = setInterval(async () => {
            await this.monitorMemoryAndTriggerGc();
        }, this.options.monitoringInterval * 1000 || 15000);
    }
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = undefined;
        }
        this.isMonitoring = false;
        this.logInfo('GC monitoring stopped');
    }
    registerMemoryIntensiveProvider(name, config) {
        this.memoryIntensiveProviders.set(name, config);
        this.logInfo(`Registered memory-intensive provider: ${name}`, {
            priority: config.priority,
            strategy: config.cleanupStrategy,
            threshold: config.memoryThreshold,
        });
    }
    registerComputationIntensiveProvider(name, metadata) {
        this.computationIntensiveProviders.set(name, metadata);
        this.logInfo(`Registered computation-intensive provider: ${name}`);
    }
    async performSmartGarbageCollection() {
        const startTime = Date.now();
        const memoryBefore = process.memoryUsage();
        this.logInfo('Performing smart garbage collection');
        try {
            await this.executeCustomCleanups('high');
            if (global.gc) {
                global.gc();
            }
            await this.executeCustomCleanups('normal');
            await this.executeCustomCleanups('low');
            const memoryAfter = process.memoryUsage();
            const duration = Date.now() - startTime;
            const memoryFreed = memoryBefore.heapUsed - memoryAfter.heapUsed;
            this.recordGcEvent({
                timestamp: startTime,
                type: 'standard',
                memoryBefore: memoryBefore.heapUsed,
                memoryAfter: memoryAfter.heapUsed,
                duration,
                triggeredBy: 'smart_gc_threshold',
                success: true,
            });
            this.updateMetrics(memoryFreed, duration);
            this.logInfo(`Smart GC completed: freed ${(memoryFreed / 1024 / 1024).toFixed(2)}MB in ${duration}ms`);
        }
        catch (error) {
            const duration = Date.now() - startTime;
            this.recordGcEvent({
                timestamp: startTime,
                type: 'standard',
                memoryBefore: memoryBefore.heapUsed,
                memoryAfter: memoryBefore.heapUsed,
                duration,
                triggeredBy: 'smart_gc_threshold',
                success: false,
            });
            this.logError('Smart GC failed:', error);
        }
    }
    async performAggressiveGarbageCollection() {
        const startTime = Date.now();
        const memoryBefore = process.memoryUsage();
        this.logWarning('Performing aggressive garbage collection');
        try {
            await this.executeAllCustomCleanups();
            if (global.gc) {
                for (let i = 0; i < 3; i++) {
                    global.gc();
                    await this.sleep(100);
                }
            }
            await this.clearDiscoveredCaches();
            const memoryAfter = process.memoryUsage();
            const duration = Date.now() - startTime;
            const memoryFreed = memoryBefore.heapUsed - memoryAfter.heapUsed;
            this.recordGcEvent({
                timestamp: startTime,
                type: 'aggressive',
                memoryBefore: memoryBefore.heapUsed,
                memoryAfter: memoryAfter.heapUsed,
                duration,
                triggeredBy: 'aggressive_gc_threshold',
                success: true,
            });
            this.updateMetrics(memoryFreed, duration);
            this.logWarning(`Aggressive GC completed: freed ${(memoryFreed / 1024 / 1024).toFixed(2)}MB in ${duration}ms`);
        }
        catch (error) {
            const duration = Date.now() - startTime;
            this.recordGcEvent({
                timestamp: startTime,
                type: 'aggressive',
                memoryBefore: memoryBefore.heapUsed,
                memoryAfter: memoryBefore.heapUsed,
                duration,
                triggeredBy: 'aggressive_gc_threshold',
                success: false,
            });
            this.logError('Aggressive GC failed:', error);
        }
    }
    updateGcMetrics(memoryUsage) {
        const currentMemoryMB = memoryUsage.heapUsed / 1024 / 1024;
        if (this.gcMetrics.totalGcCycles > 0) {
            this.gcMetrics.gcEfficiency = Math.max(0, 1 - currentMemoryMB / 512);
        }
    }
    getGcMetrics() {
        return { ...this.gcMetrics };
    }
    getGcHistory(limit = 50) {
        return this.gcHistory.slice(-limit);
    }
    async performFinalCleanup() {
        this.logInfo('Performing final cleanup before shutdown');
        try {
            await this.executeAllCustomCleanups();
            if (global.gc) {
                global.gc();
            }
            this.gcHistory.length = 0;
            this.logInfo('Final cleanup completed');
        }
        catch (error) {
            this.logError('Final cleanup failed:', error);
        }
    }
    getGcRecommendations() {
        const recommendations = [];
        const currentMemory = process.memoryUsage().heapUsed / 1024 / 1024;
        const recentGcs = this.gcHistory.slice(-10);
        const failedGcs = recentGcs.filter((gc) => !gc.success);
        if (currentMemory > 400) {
            recommendations.push({
                type: 'alert',
                message: `High memory usage: ${currentMemory.toFixed(2)}MB`,
                action: 'Consider aggressive garbage collection or scaling resources',
                priority: 'high',
            });
        }
        if (failedGcs.length > 2) {
            recommendations.push({
                type: 'warning',
                message: `${failedGcs.length} GC failures in recent cycles`,
                action: 'Review memory-intensive providers and custom cleanup implementations',
                priority: 'high',
            });
        }
        if (this.gcMetrics.gcEfficiency < 0.5) {
            recommendations.push({
                type: 'optimization',
                message: `Low GC efficiency: ${(this.gcMetrics.gcEfficiency * 100).toFixed(1)}%`,
                action: 'Optimize memory usage patterns and cleanup strategies',
                priority: 'medium',
            });
        }
        if (this.gcMetrics.averageGcTime > 5000) {
            recommendations.push({
                type: 'warning',
                message: `Long average GC time: ${this.gcMetrics.averageGcTime.toFixed(0)}ms`,
                action: 'Review and optimize custom cleanup implementations',
                priority: 'medium',
            });
        }
        return recommendations;
    }
    async monitorMemoryAndTriggerGc() {
        const memoryUsage = process.memoryUsage();
        const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
        this.updateGcMetrics(memoryUsage);
        if (heapUsedMB >= this.options.aggressiveGcThresholdMB) {
            await this.performAggressiveGarbageCollection();
        }
        else if (heapUsedMB >= this.options.gcThresholdMB) {
            await this.performSmartGarbageCollection();
        }
    }
    async executeCustomCleanups(priority) {
        const providers = Array.from(this.memoryIntensiveProviders.entries()).filter(([_, config]) => config.priority === priority);
        for (const [name, config] of providers) {
            if (config.customCleanup) {
                try {
                    this.logDebug(`Executing custom cleanup for ${name}`);
                    await config.customCleanup();
                }
                catch (error) {
                    this.logError(`Custom cleanup failed for ${name}:`, error);
                }
            }
        }
    }
    async executeAllCustomCleanups() {
        await this.executeCustomCleanups('high');
        await this.executeCustomCleanups('normal');
        await this.executeCustomCleanups('low');
    }
    async clearDiscoveredCaches() {
        const providers = this.discoveryService.getProviders();
        for (const wrapper of providers) {
            if (!wrapper.metatype)
                continue;
            const cacheMetadata = this.reflector.get('cacheable', wrapper.metatype);
            if (cacheMetadata?.enabled && wrapper.instance) {
                if (typeof wrapper.instance.clearCache === 'function') {
                    try {
                        await wrapper.instance.clearCache();
                        this.logDebug(`Cleared cache for provider: ${wrapper.name}`);
                    }
                    catch (error) {
                        this.logError(`Failed to clear cache for ${wrapper.name}:`, error);
                    }
                }
            }
        }
    }
    recordGcEvent(event) {
        this.gcHistory.push(event);
        if (this.gcHistory.length > 1000) {
            this.gcHistory = this.gcHistory.slice(-1000);
        }
    }
    updateMetrics(memoryFreed, duration) {
        this.gcMetrics.totalGcCycles++;
        this.gcMetrics.totalMemoryFreed += Math.max(0, memoryFreed);
        this.gcMetrics.lastGcTimestamp = Date.now();
        if (this.gcMetrics.totalGcCycles === 1) {
            this.gcMetrics.averageGcTime = duration;
        }
        else {
            this.gcMetrics.averageGcTime =
                (this.gcMetrics.averageGcTime * (this.gcMetrics.totalGcCycles - 1) +
                    duration) /
                    this.gcMetrics.totalGcCycles;
        }
        if (duration > 0) {
            const efficiency = Math.max(0, memoryFreed / duration);
            this.gcMetrics.gcEfficiency =
                (this.gcMetrics.gcEfficiency + efficiency) / 2;
        }
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    getGcReport() {
        const currentMemory = process.memoryUsage().heapUsed / 1024 / 1024;
        const recommendations = this.getGcRecommendations();
        const totalMemory = process.memoryUsage().heapTotal / 1024 / 1024;
        const memoryEfficiency = totalMemory > 0 ? (totalMemory - currentMemory) / totalMemory : 0;
        const summary = [
            `Memory: ${currentMemory.toFixed(2)}MB`,
            `GC Cycles: ${this.gcMetrics.totalGcCycles}`,
            `Efficiency: ${(this.gcMetrics.gcEfficiency * 100).toFixed(1)}%`,
            `Alerts: ${recommendations.filter((r) => r.type === 'alert').length}`,
        ].join(' | ');
        return {
            summary,
            metrics: this.gcMetrics,
            recentEvents: this.gcHistory.slice(-10),
            recommendations,
            memoryEfficiency,
        };
    }
};
exports.SmartGarbageCollectionService = SmartGarbageCollectionService;
exports.SmartGarbageCollectionService = SmartGarbageCollectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SMART_GC_OPTIONS')),
    __metadata("design:paramtypes", [Object, core_1.DiscoveryService,
        core_1.Reflector])
], SmartGarbageCollectionService);
//# sourceMappingURL=smart-garbage-collection.service.js.map