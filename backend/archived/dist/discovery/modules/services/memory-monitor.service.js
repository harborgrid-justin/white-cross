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
exports.MemoryMonitorService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const base_1 = require("../../../common/base");
let MemoryMonitorService = class MemoryMonitorService extends base_1.BaseService {
    discoveryService;
    reflector;
    monitoringInterval;
    monitoredProviders = new Map();
    memoryHistory = [];
    maxHistorySize = 100;
    constructor(discoveryService, reflector) {
        super("MemoryMonitorService");
        this.discoveryService = discoveryService;
        this.reflector = reflector;
    }
    startMonitoring(options = {
        checkInterval: 30,
        warningThreshold: 400,
        criticalThreshold: 500,
    }) {
        if (this.monitoringInterval) {
            this.logWarning('Memory monitoring already started');
            return;
        }
        this.logInfo('Starting memory monitoring', {
            interval: options.checkInterval,
            warningThreshold: options.warningThreshold,
            criticalThreshold: options.criticalThreshold,
        });
        this.monitoringInterval = setInterval(async () => {
            await this.checkMemoryUsage(options);
        }, options.checkInterval * 1000);
    }
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = undefined;
            this.logInfo('Memory monitoring stopped');
        }
    }
    addMonitoredProvider(providerName, options) {
        this.monitoredProviders.set(providerName, options);
        this.logInfo(`Added monitored provider: ${providerName}`, options);
    }
    getMemoryStats() {
        const current = process.memoryUsage();
        const currentMB = current.heapUsed / 1024 / 1024;
        let trend = 'stable';
        if (this.memoryHistory.length >= 5) {
            const recent = this.memoryHistory.slice(-5);
            const average = recent.reduce((a, b) => a + b, 0) / recent.length;
            if (currentMB > average * 1.1)
                trend = 'increasing';
            else if (currentMB < average * 0.9)
                trend = 'decreasing';
        }
        const averageUsage = this.memoryHistory.length > 0
            ? this.memoryHistory.reduce((a, b) => a + b, 0) /
                this.memoryHistory.length
            : currentMB;
        const peakUsage = Math.max(...this.memoryHistory, currentMB);
        const providerAlerts = this.checkProviderAlerts();
        return {
            current,
            trend,
            averageUsage,
            peakUsage,
            providerAlerts,
        };
    }
    async checkMemoryUsage(options) {
        const memUsage = process.memoryUsage();
        const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
        this.memoryHistory.push(heapUsedMB);
        if (this.memoryHistory.length > this.maxHistorySize) {
            this.memoryHistory.shift();
        }
        if (heapUsedMB >= options.criticalThreshold) {
            this.logError(`Critical memory usage: ${heapUsedMB.toFixed(2)}MB`);
            if (options.alertCallback) {
                options.alertCallback('critical', heapUsedMB);
            }
            await this.handleCriticalMemory();
        }
        else if (heapUsedMB >= options.warningThreshold) {
            this.logWarning(`High memory usage: ${heapUsedMB.toFixed(2)}MB`);
            if (options.alertCallback) {
                options.alertCallback('warning', heapUsedMB);
            }
            await this.handleWarningMemory();
        }
        this.logDebug(`Memory usage: ${heapUsedMB.toFixed(2)}MB (heap), ${(memUsage.external / 1024 / 1024).toFixed(2)}MB (external)`);
    }
    async handleCriticalMemory() {
        this.logError('Handling critical memory situation');
        if (global.gc) {
            global.gc();
            this.logInfo('Forced garbage collection');
        }
        await this.analyzeMemoryIntensiveProviders();
    }
    async handleWarningMemory() {
        this.logWarning('Handling warning memory situation');
        if (global.gc) {
            global.gc();
            this.logDebug('Suggested garbage collection');
        }
    }
    async analyzeMemoryIntensiveProviders() {
        const providers = this.discoveryService.getProviders();
        const memoryIntensiveProviders = [];
        for (const wrapper of providers) {
            if (!wrapper.metatype)
                continue;
            const memoryMetadata = this.reflector.get('memory-sensitive', wrapper.metatype);
            if (memoryMetadata) {
                const providerName = wrapper.name || 'unknown';
                memoryIntensiveProviders.push(providerName);
                const monitoredProvider = this.monitoredProviders.get(providerName);
                if (monitoredProvider?.maxMemory) {
                    this.logWarning(`Memory-intensive provider detected: ${providerName} (limit: ${monitoredProvider.maxMemory}MB)`);
                }
            }
            const cacheMetadata = this.reflector.get('cacheable', wrapper.metatype);
            if (cacheMetadata?.enabled) {
                const providerName = wrapper.name || 'unknown';
                this.logDebug(`Cacheable provider: ${providerName} - consider cache eviction`);
            }
        }
        if (memoryIntensiveProviders.length > 0) {
            this.logError(`Found ${memoryIntensiveProviders.length} memory-intensive providers:`, memoryIntensiveProviders);
        }
    }
    checkProviderAlerts() {
        const alerts = [];
        const currentMemoryMB = process.memoryUsage().heapUsed / 1024 / 1024;
        for (const [providerName, config] of this.monitoredProviders.entries()) {
            if (config.alertThreshold && currentMemoryMB > config.alertThreshold) {
                alerts.push(`${providerName}: Memory usage exceeded ${config.alertThreshold}MB`);
            }
        }
        return alerts;
    }
    getMemoryTrend() {
        if (this.memoryHistory.length < 10) {
            return { isIncreasing: false, rate: 0, prediction: 0 };
        }
        const recent = this.memoryHistory.slice(-10);
        const slope = this.calculateSlope(recent);
        const isIncreasing = slope > 0.1;
        const currentMemory = this.memoryHistory[this.memoryHistory.length - 1];
        const prediction = currentMemory + slope * 10;
        return {
            isIncreasing,
            rate: slope,
            prediction: Math.max(0, prediction),
        };
    }
    calculateSlope(data) {
        const n = data.length;
        const xMean = (n - 1) / 2;
        const yMean = data.reduce((a, b) => a + b, 0) / n;
        let numerator = 0;
        let denominator = 0;
        for (let i = 0; i < n; i++) {
            const xDiff = i - xMean;
            const yDiff = data[i] - yMean;
            numerator += xDiff * yDiff;
            denominator += xDiff * xDiff;
        }
        return denominator === 0 ? 0 : numerator / denominator;
    }
    getMemoryReport() {
        const stats = this.getMemoryStats();
        const trend = this.getMemoryTrend();
        const currentMB = stats.current.heapUsed / 1024 / 1024;
        let summary = `Memory Usage: ${currentMB.toFixed(2)}MB (${stats.trend})`;
        const recommendations = [];
        if (trend.isIncreasing && trend.rate > 1) {
            summary += ` - WARNING: Rapidly increasing (${trend.rate.toFixed(2)}MB/check)`;
            recommendations.push('Consider implementing cache eviction strategies');
            recommendations.push('Review memory-intensive providers');
        }
        if (currentMB > 400) {
            recommendations.push('Memory usage is high - consider scaling or optimization');
        }
        if (stats.providerAlerts.length > 0) {
            recommendations.push(`Address provider alerts: ${stats.providerAlerts.join(', ')}`);
        }
        return {
            summary,
            recommendations,
            stats,
            trend,
        };
    }
};
exports.MemoryMonitorService = MemoryMonitorService;
exports.MemoryMonitorService = MemoryMonitorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.Reflector])
], MemoryMonitorService);
//# sourceMappingURL=memory-monitor.service.js.map