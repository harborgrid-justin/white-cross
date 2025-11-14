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
var GCSchedulerGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GCSchedulerGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const smart_garbage_collection_service_1 = require("../services/smart-garbage-collection.service");
const gc_optimization_service_1 = require("../services/gc-optimization.service");
const memory_leak_detection_service_1 = require("../services/memory-leak-detection.service");
let GCSchedulerGuard = GCSchedulerGuard_1 = class GCSchedulerGuard {
    reflector;
    smartGCService;
    gcOptimizationService;
    leakDetectionService;
    logger = new common_1.Logger(GCSchedulerGuard_1.name);
    gcState = {
        requestCount: 0,
        lastGCTime: Date.now(),
        lastMemoryCheck: Date.now(),
        gcInProgress: false,
        scheduledGCCount: 0,
        preventedRequests: 0,
    };
    gcTimer;
    memoryCheckTimer;
    constructor(reflector, smartGCService, gcOptimizationService, leakDetectionService) {
        this.reflector = reflector;
        this.smartGCService = smartGCService;
        this.gcOptimizationService = gcOptimizationService;
        this.leakDetectionService = leakDetectionService;
        this.startMemoryMonitoring();
    }
    async canActivate(context) {
        const handler = context.getHandler();
        const controllerClass = context.getClass();
        const methodGCConfig = this.reflector.get('gc-scheduler', handler);
        const classGCConfig = this.reflector.get('gc-scheduler', controllerClass);
        const gcConfig = methodGCConfig || classGCConfig;
        if (!gcConfig) {
            return true;
        }
        try {
            this.gcState.requestCount++;
            const shouldPerformGC = await this.shouldTriggerGC(gcConfig);
            if (shouldPerformGC) {
                const canProceedDuringGC = await this.handleGCExecution(gcConfig, context);
                if (!canProceedDuringGC) {
                    this.gcState.preventedRequests++;
                    this.logger.warn('Request prevented due to active garbage collection');
                    return false;
                }
            }
            if (gcConfig.leakDetectionEnabled) {
                const memoryPressureAllowsRequest = await this.checkMemoryPressure(gcConfig);
                if (!memoryPressureAllowsRequest) {
                    this.gcState.preventedRequests++;
                    this.logger.warn('Request prevented due to high memory pressure');
                    return false;
                }
            }
            if (gcConfig.preventiveGC) {
                this.schedulePreventiveGC(gcConfig);
            }
            this.logger.debug(`GC scheduler check passed, request count: ${this.gcState.requestCount}`);
            return true;
        }
        catch (error) {
            this.logger.error('Error in GC scheduler guard:', error);
            return true;
        }
    }
    async shouldTriggerGC(config) {
        const currentTime = Date.now();
        const memoryUsage = process.memoryUsage();
        const heapUsedMB = memoryUsage.heapUsed / (1024 * 1024);
        if (heapUsedMB > config.aggressiveGcThreshold) {
            this.logger.warn(`Aggressive GC threshold exceeded: ${heapUsedMB.toFixed(2)}MB > ${config.aggressiveGcThreshold}MB`);
            return true;
        }
        if (heapUsedMB > config.gcTriggerThreshold) {
            this.logger.debug(`GC threshold exceeded: ${heapUsedMB.toFixed(2)}MB > ${config.gcTriggerThreshold}MB`);
            return true;
        }
        if (this.gcState.requestCount >= config.maxRequestsBeforeGC) {
            this.logger.debug(`Max requests threshold reached: ${this.gcState.requestCount} >= ${config.maxRequestsBeforeGC}`);
            return true;
        }
        if (config.timeBasedGC &&
            currentTime - this.gcState.lastGCTime > config.gcInterval) {
            this.logger.debug(`Time-based GC interval reached: ${currentTime - this.gcState.lastGCTime}ms >= ${config.gcInterval}ms`);
            return true;
        }
        if (config.leakDetectionEnabled) {
            const leakSuspects = await this.leakDetectionService.getLeakSuspects();
            if (leakSuspects.length > 0) {
                const criticalLeaks = leakSuspects.filter((s) => s.confidence > 0.8);
                if (criticalLeaks.length > 0) {
                    this.logger.warn(`Critical memory leaks detected: ${criticalLeaks.length} suspects`);
                    return true;
                }
            }
        }
        return false;
    }
    async handleGCExecution(config, context) {
        if (this.gcState.gcInProgress) {
            if (config.priority === 'critical') {
                this.logger.debug('Critical priority request allowed during GC');
                return true;
            }
            else {
                this.logger.debug(`${config.priority} priority request blocked during GC`);
                return false;
            }
        }
        this.gcState.gcInProgress = true;
        this.gcState.scheduledGCCount++;
        try {
            const memoryUsage = process.memoryUsage();
            const heapUsedMB = memoryUsage.heapUsed / (1024 * 1024);
            if (heapUsedMB > config.aggressiveGcThreshold) {
                this.logger.warn('Performing aggressive garbage collection');
                await this.performAggressiveGC(config);
            }
            else {
                this.logger.debug('Performing standard garbage collection');
                await this.performStandardGC(config);
            }
            this.gcState.requestCount = 0;
            this.gcState.lastGCTime = Date.now();
            return true;
        }
        catch (error) {
            this.logger.error('GC execution failed:', error);
            return true;
        }
        finally {
            this.gcState.gcInProgress = false;
        }
    }
    async performAggressiveGC(config) {
        const startTime = Date.now();
        await Promise.all([
            this.smartGCService.performAggressiveGarbageCollection(),
            this.gcOptimizationService.forceOptimization({
                memoryThreshold: config.gcTriggerThreshold * 0.5,
                gcInterval: 1000,
                aggressiveThreshold: config.aggressiveGcThreshold,
                enableHeapProfiling: true,
                customStrategies: new Map(),
            }),
        ]);
        const duration = Date.now() - startTime;
        this.logger.warn(`Aggressive GC completed in ${duration}ms`);
    }
    async performStandardGC(config) {
        const startTime = Date.now();
        await Promise.all([
            this.smartGCService.performSmartGarbageCollection(),
            this.gcOptimizationService.performOptimization({
                memoryThreshold: config.gcTriggerThreshold,
                gcInterval: config.gcInterval,
                aggressiveThreshold: config.aggressiveGcThreshold,
                enableHeapProfiling: false,
                customStrategies: new Map(),
            }),
        ]);
        const duration = Date.now() - startTime;
        this.logger.debug(`Standard GC completed in ${duration}ms`);
    }
    async checkMemoryPressure(config) {
        const memoryUsage = process.memoryUsage();
        const heapUsedMB = memoryUsage.heapUsed / (1024 * 1024);
        const heapUtilization = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
        if (heapUsedMB > config.aggressiveGcThreshold * 1.2) {
            this.logger.error(`Critical memory pressure: ${heapUsedMB.toFixed(2)}MB`);
            return false;
        }
        if (heapUtilization > 95) {
            this.logger.warn(`Critical heap utilization: ${heapUtilization.toFixed(1)}%`);
            return false;
        }
        if (config.leakDetectionEnabled) {
            const leakSuspects = await this.leakDetectionService.getLeakSuspects();
            const criticalLeaks = leakSuspects.filter((s) => s.confidence > 0.9);
            if (criticalLeaks.length > 3) {
                this.logger.error(`Multiple critical memory leaks detected: ${criticalLeaks.length}`);
                return false;
            }
        }
        return true;
    }
    schedulePreventiveGC(config) {
        const memoryUsage = process.memoryUsage();
        const heapUsedMB = memoryUsage.heapUsed / (1024 * 1024);
        const preventiveThreshold = config.gcTriggerThreshold * 0.8;
        if (heapUsedMB > preventiveThreshold && !this.gcTimer) {
            const delay = Math.max(1000, config.gcInterval * 0.1);
            this.gcTimer = setTimeout(async () => {
                try {
                    this.logger.debug('Executing preventive garbage collection');
                    await this.performStandardGC(config);
                }
                catch (error) {
                    this.logger.error('Preventive GC failed:', error);
                }
                finally {
                    this.gcTimer = undefined;
                }
            }, delay);
            this.logger.debug(`Scheduled preventive GC in ${delay}ms`);
        }
    }
    startMemoryMonitoring() {
        this.memoryCheckTimer = setInterval(() => {
            this.gcState.lastMemoryCheck = Date.now();
            const memoryUsage = process.memoryUsage();
            const heapUsedMB = memoryUsage.heapUsed / (1024 * 1024);
            if (heapUsedMB > 100) {
                this.logger.debug(`Memory usage: ${heapUsedMB.toFixed(2)}MB, Requests: ${this.gcState.requestCount}, GC runs: ${this.gcState.scheduledGCCount}`);
            }
        }, 30000);
    }
    onModuleDestroy() {
        if (this.gcTimer) {
            clearTimeout(this.gcTimer);
        }
        if (this.memoryCheckTimer) {
            clearInterval(this.memoryCheckTimer);
        }
        this.logger.log('GC Scheduler Guard destroyed');
    }
    getGCStats() {
        const memoryUsage = process.memoryUsage();
        const heapUsedMB = memoryUsage.heapUsed / (1024 * 1024);
        const recommendations = [];
        if (this.gcState.preventedRequests > 10) {
            recommendations.push(`High number of prevented requests (${this.gcState.preventedRequests}) - consider adjusting GC thresholds`);
        }
        if (this.gcState.scheduledGCCount > 100) {
            recommendations.push(`High GC frequency (${this.gcState.scheduledGCCount} runs) - review memory usage patterns`);
        }
        if (heapUsedMB > 500) {
            recommendations.push(`High memory usage (${heapUsedMB.toFixed(2)}MB) - consider more aggressive GC settings`);
        }
        const timeSinceLastGC = Date.now() - this.gcState.lastGCTime;
        if (timeSinceLastGC > 600000) {
            recommendations.push('Long time since last GC - consider enabling time-based GC');
        }
        return {
            state: { ...this.gcState },
            memoryUsage,
            gcMetrics: this.smartGCService.getGcMetrics(),
            recommendations,
        };
    }
    async forceGarbageCollection() {
        if (this.gcState.gcInProgress) {
            this.logger.warn('GC already in progress, skipping forced GC');
            return;
        }
        this.logger.log('Forcing immediate garbage collection');
        const config = {
            gcTriggerThreshold: 100,
            aggressiveGcThreshold: 500,
            maxRequestsBeforeGC: 1000,
            timeBasedGC: false,
            gcInterval: 300000,
            priority: 'critical',
            leakDetectionEnabled: true,
            preventiveGC: false,
        };
        await this.handleGCExecution(config, null);
    }
    resetStats() {
        this.gcState.requestCount = 0;
        this.gcState.scheduledGCCount = 0;
        this.gcState.preventedRequests = 0;
        this.gcState.lastGCTime = Date.now();
        this.gcState.lastMemoryCheck = Date.now();
        this.logger.log('GC scheduler statistics reset');
    }
    isGCInProgress() {
        return this.gcState.gcInProgress;
    }
    getCurrentMemoryPressure() {
        const memoryUsage = process.memoryUsage();
        const heapUtilization = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
        if (heapUtilization > 95) {
            return 'critical';
        }
        else if (heapUtilization > 85) {
            return 'high';
        }
        else if (heapUtilization > 70) {
            return 'medium';
        }
        else {
            return 'low';
        }
    }
    getGCHealthStatus() {
        const memoryPressure = this.getCurrentMemoryPressure();
        const uptime = Date.now() - this.gcState.lastGCTime;
        const issues = [];
        let status = 'healthy';
        if (memoryPressure === 'critical') {
            status = 'critical';
            issues.push('Critical memory pressure detected');
        }
        else if (memoryPressure === 'high') {
            status = status === 'healthy' ? 'warning' : status;
            issues.push('High memory pressure detected');
        }
        if (this.gcState.preventedRequests > 20) {
            status = status === 'healthy' ? 'warning' : status;
            issues.push(`High number of prevented requests: ${this.gcState.preventedRequests}`);
        }
        if (uptime > 900000) {
            status = status === 'healthy' ? 'warning' : status;
            issues.push('Long time since last GC execution');
        }
        if (this.gcState.gcInProgress) {
            issues.push('GC currently in progress');
        }
        const totalRequests = this.gcState.requestCount + this.gcState.preventedRequests;
        const efficiency = totalRequests > 0
            ? (this.gcState.requestCount / totalRequests) * 100
            : 100;
        return {
            status,
            issues,
            uptime,
            efficiency,
        };
    }
};
exports.GCSchedulerGuard = GCSchedulerGuard;
exports.GCSchedulerGuard = GCSchedulerGuard = GCSchedulerGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        smart_garbage_collection_service_1.SmartGarbageCollectionService,
        gc_optimization_service_1.GCOptimizationService,
        memory_leak_detection_service_1.MemoryLeakDetectionService])
], GCSchedulerGuard);
//# sourceMappingURL=gc-scheduler.guard.js.map