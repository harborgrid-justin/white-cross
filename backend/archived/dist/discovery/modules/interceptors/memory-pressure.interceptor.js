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
exports.MemoryPressureInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const smart_garbage_collection_service_1 = require("../services/smart-garbage-collection.service");
const gc_optimization_service_1 = require("../services/gc-optimization.service");
const base_interceptor_1 = require("../../../common/interceptors/base.interceptor");
let MemoryPressureInterceptor = class MemoryPressureInterceptor extends base_interceptor_1.BaseInterceptor {
    reflector;
    smartGCService;
    gcOptimizationService;
    memoryHistory = [];
    maxHistorySize = 100;
    lastGCTime = 0;
    gcCooldownMs = 5000;
    constructor(reflector, smartGCService, gcOptimizationService) {
        this.reflector = reflector;
        this.smartGCService = smartGCService;
        this.gcOptimizationService = gcOptimizationService;
    }
    async intercept(context, next) {
        const handler = context.getHandler();
        const controllerClass = context.getClass();
        const methodConfig = this.reflector.get('memory-pressure', handler);
        const classConfig = this.reflector.get('memory-pressure', controllerClass);
        const config = methodConfig || classConfig;
        if (!config) {
            return next.handle();
        }
        const requestId = this.getOrGenerateRequestId(context.switchToHttp().getRequest());
        try {
            const memoryBefore = this.getCurrentMemoryMetrics();
            const pressureLevel = this.calculateMemoryPressure(memoryBefore, config);
            this.logRequest('debug', `Memory pressure check for ${requestId}: ${pressureLevel} (${memoryBefore.heapUtilization.toFixed(1)}%)`, {
                operation: 'MEMORY_PRESSURE_CHECK',
                requestId,
                pressureLevel,
                heapUtilization: memoryBefore.heapUtilization,
            });
            if (pressureLevel === 'critical' && config.failOnPressure) {
                this.logRequest('error', `Critical memory pressure detected, rejecting request ${requestId}`, {
                    operation: 'MEMORY_PRESSURE_REJECTION',
                    requestId,
                });
                return (0, rxjs_1.throwError)(() => new Error('Request rejected due to critical memory pressure'));
            }
            if (config.enableAutoGC &&
                (pressureLevel === 'high' || pressureLevel === 'critical')) {
                await this.triggerMemoryOptimization(pressureLevel, config);
            }
            return next.handle().pipe((0, operators_1.tap)(() => {
                if (config.memoryMonitoring) {
                    this.recordMemoryMetrics(requestId, true);
                }
            }), (0, operators_1.catchError)((error) => {
                if (config.memoryMonitoring) {
                    this.recordMemoryMetrics(requestId, false);
                }
                return (0, rxjs_1.throwError)(() => error);
            }), (0, operators_1.tap)(() => {
                const memoryAfter = this.getCurrentMemoryMetrics();
                const pressureAfter = this.calculateMemoryPressure(memoryAfter, config);
                if (pressureAfter !== pressureLevel) {
                    this.logRequest('debug', `Memory pressure changed after request ${requestId}: ${pressureLevel} -> ${pressureAfter}`, {
                        operation: 'MEMORY_PRESSURE_CHANGE',
                        requestId,
                        pressureBefore: pressureLevel,
                        pressureAfter,
                    });
                }
                const memoryIncrease = memoryAfter.heapUsed - memoryBefore.heapUsed;
                if (memoryIncrease > 10 * 1024 * 1024 && config.enableAutoGC) {
                    this.scheduleCleanup(config);
                }
            }));
        }
        catch (error) {
            this.logError(`Error in memory pressure interceptor for request ${requestId}`, error, {
                operation: 'MEMORY_PRESSURE_INTERCEPTOR_ERROR',
                requestId,
            });
            return (0, rxjs_1.throwError)(() => error);
        }
    }
    getCurrentMemoryMetrics() {
        const memoryUsage = process.memoryUsage();
        const heapUtilization = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
        let memoryPressureLevel = 'low';
        if (heapUtilization > 90) {
            memoryPressureLevel = 'critical';
        }
        else if (heapUtilization > 75) {
            memoryPressureLevel = 'high';
        }
        else if (heapUtilization > 60) {
            memoryPressureLevel = 'medium';
        }
        return {
            heapUsed: memoryUsage.heapUsed,
            heapTotal: memoryUsage.heapTotal,
            external: memoryUsage.external,
            heapUtilization,
            memoryPressureLevel,
        };
    }
    calculateMemoryPressure(metrics, config) {
        const heapUsedMB = metrics.heapUsed / (1024 * 1024);
        if (heapUsedMB > config.maxHeapSize) {
            return 'critical';
        }
        else if (heapUsedMB > config.gcThreshold) {
            return 'high';
        }
        else if (metrics.heapUtilization > 75) {
            return 'high';
        }
        else if (metrics.heapUtilization > 60) {
            return 'medium';
        }
        return metrics.memoryPressureLevel;
    }
    async triggerMemoryOptimization(pressureLevel, config) {
        const now = Date.now();
        if (now - this.lastGCTime < this.gcCooldownMs) {
            this.logRequest('debug', 'GC cooldown period active, skipping memory optimization', {
                operation: 'GC_COOLDOWN',
            });
            return;
        }
        this.lastGCTime = now;
        try {
            switch (pressureLevel) {
                case 'critical':
                    this.logRequest('warn', 'Critical memory pressure detected, triggering aggressive cleanup', {
                        operation: 'CRITICAL_MEMORY_PRESSURE',
                        pressureLevel,
                    });
                    await this.performAggressiveCleanup(config);
                    break;
                case 'high':
                    this.logRequest('warn', 'High memory pressure detected, triggering memory optimization', {
                        operation: 'HIGH_MEMORY_PRESSURE',
                        pressureLevel,
                    });
                    await this.performStandardCleanup(config);
                    break;
                case 'medium':
                    this.logRequest('debug', 'Medium memory pressure detected, triggering light cleanup', {
                        operation: 'MEDIUM_MEMORY_PRESSURE',
                        pressureLevel,
                    });
                    await this.performLightCleanup(config);
                    break;
                default:
                    break;
            }
        }
        catch (error) {
            this.logError('Error during memory optimization', error, {
                operation: 'MEMORY_OPTIMIZATION_ERROR',
                pressureLevel,
            });
        }
    }
    async performAggressiveCleanup(config) {
        if (global.gc) {
            global.gc();
        }
        await this.gcOptimizationService.forceOptimization({
            memoryThreshold: config.maxHeapSize * 0.5,
            gcInterval: 1000,
            aggressiveThreshold: config.maxHeapSize * 0.7,
            enableHeapProfiling: true,
            customStrategies: new Map(),
        });
        await this.smartGCService.performAggressiveGarbageCollection();
    }
    async performStandardCleanup(config) {
        await this.gcOptimizationService.performOptimization({
            memoryThreshold: config.gcThreshold,
            gcInterval: 5000,
            aggressiveThreshold: config.maxHeapSize,
            enableHeapProfiling: false,
            customStrategies: new Map(),
        });
        await this.smartGCService.performSmartGarbageCollection();
    }
    async performLightCleanup(config) {
        await this.smartGCService.performSmartGarbageCollection();
    }
    scheduleCleanup(config) {
        setTimeout(async () => {
            try {
                await this.performLightCleanup(config);
            }
            catch (error) {
                this.logError('Error during scheduled cleanup', error, {
                    operation: 'SCHEDULED_CLEANUP_ERROR',
                });
            }
        }, 100);
    }
    recordMemoryMetrics(requestId, success) {
        const metrics = this.getCurrentMemoryMetrics();
        this.memoryHistory.push({
            ...metrics,
        });
        if (this.memoryHistory.length > this.maxHistorySize) {
            this.memoryHistory.shift();
        }
        if (this.memoryHistory.length > 1) {
            const previous = this.memoryHistory[this.memoryHistory.length - 2];
            const memoryChange = metrics.heapUsed - previous.heapUsed;
            const changeMB = memoryChange / (1024 * 1024);
            if (Math.abs(changeMB) > 5) {
                this.logRequest('debug', `Memory change for ${requestId}: ${changeMB > 0 ? '+' : ''}${changeMB.toFixed(1)}MB (${success ? 'success' : 'error'})`, {
                    operation: 'MEMORY_CHANGE',
                    requestId,
                    memoryChangeMB: changeMB,
                    success,
                });
            }
        }
    }
    getMemoryStats() {
        const current = this.getCurrentMemoryMetrics();
        if (this.memoryHistory.length < 2) {
            return {
                current,
                trend: 'stable',
                averageUtilization: current.heapUtilization,
                peakUtilization: current.heapUtilization,
                gcTriggerCount: 0,
            };
        }
        const recent = this.memoryHistory.slice(-10);
        const averageUtilization = recent.reduce((sum, m) => sum + m.heapUtilization, 0) / recent.length;
        const peakUtilization = Math.max(...recent.map((m) => m.heapUtilization));
        const firstRecent = recent[0];
        const lastRecent = recent[recent.length - 1];
        const utilizationDiff = lastRecent.heapUtilization - firstRecent.heapUtilization;
        let trend = 'stable';
        if (utilizationDiff > 5) {
            trend = 'increasing';
        }
        else if (utilizationDiff < -5) {
            trend = 'decreasing';
        }
        return {
            current,
            trend,
            averageUtilization,
            peakUtilization,
            gcTriggerCount: 0,
        };
    }
    isUnderMemoryPressure() {
        const metrics = this.getCurrentMemoryMetrics();
        return (metrics.memoryPressureLevel === 'high' ||
            metrics.memoryPressureLevel === 'critical');
    }
    getCurrentMemoryPressure() {
        const metrics = this.getCurrentMemoryMetrics();
        return metrics.memoryPressureLevel;
    }
    async forceMemoryCleanup() {
        this.logRequest('log', 'Forcing immediate memory cleanup', {
            operation: 'FORCE_MEMORY_CLEANUP',
        });
        const config = {
            maxHeapSize: 1000,
            gcThreshold: 500,
            priority: 'high',
            enableAutoGC: true,
            memoryMonitoring: true,
            failOnPressure: false,
        };
        await this.performAggressiveCleanup(config);
    }
    reset() {
        this.memoryHistory.length = 0;
        this.lastGCTime = 0;
        this.logRequest('log', 'Memory pressure interceptor reset', {
            operation: 'MEMORY_INTERCEPTOR_RESET',
        });
    }
};
exports.MemoryPressureInterceptor = MemoryPressureInterceptor;
exports.MemoryPressureInterceptor = MemoryPressureInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        smart_garbage_collection_service_1.SmartGarbageCollectionService,
        gc_optimization_service_1.GCOptimizationService])
], MemoryPressureInterceptor);
//# sourceMappingURL=memory-pressure.interceptor.js.map