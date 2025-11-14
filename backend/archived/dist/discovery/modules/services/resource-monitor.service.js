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
exports.ResourceMonitorService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const base_1 = require("../../../common/base");
let ResourceMonitorService = class ResourceMonitorService extends base_1.BaseService {
    discoveryService;
    reflector;
    monitoringInterval;
    resourceHistory = [];
    systemHistory = [];
    maxHistorySize = 1000;
    isMonitoring = false;
    constructor(discoveryService, reflector) {
        super("ResourceMonitorService");
        this.discoveryService = discoveryService;
        this.reflector = reflector;
    }
    startMonitoring(intervalMs = 10000) {
        if (this.isMonitoring) {
            this.logWarning('Resource monitoring already started');
            return;
        }
        this.isMonitoring = true;
        this.logInfo(`Starting resource monitoring with ${intervalMs}ms interval`);
        this.monitoringInterval = setInterval(async () => {
            await this.collectResourceStats();
        }, intervalMs);
    }
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = undefined;
        }
        this.isMonitoring = false;
        this.logInfo('Resource monitoring stopped');
    }
    getResourceStats() {
        const system = this.getCurrentSystemStats();
        const resources = this.resourceHistory.slice(-10);
        return {
            system,
            resources,
            trends: this.calculateTrends(),
        };
    }
    getResourceAlerts() {
        const alerts = [];
        const system = this.getCurrentSystemStats();
        const memoryUsedMB = system.memoryUsage.heapUsed / 1024 / 1024;
        if (memoryUsedMB > 450) {
            alerts.push({
                type: 'critical',
                resource: 'memory',
                message: 'Critical memory usage detected',
                value: memoryUsedMB,
                threshold: 450,
            });
        }
        else if (memoryUsedMB > 350) {
            alerts.push({
                type: 'warning',
                resource: 'memory',
                message: 'High memory usage detected',
                value: memoryUsedMB,
                threshold: 350,
            });
        }
        for (const resource of this.resourceHistory.slice(-5)) {
            if (resource.utilization > 0.9) {
                alerts.push({
                    type: 'warning',
                    resource: resource.poolName,
                    message: `High resource utilization in pool: ${resource.poolName}`,
                    value: resource.utilization,
                    threshold: 0.9,
                });
            }
        }
        return alerts;
    }
    getDetailedReport() {
        const system = this.getCurrentSystemStats();
        const memoryUsedMB = system.memoryUsage.heapUsed / 1024 / 1024;
        const alerts = this.getResourceAlerts();
        const recommendations = [];
        if (memoryUsedMB > 400) {
            recommendations.push('Consider scaling down resource pools to reduce memory usage');
            recommendations.push('Review and optimize memory-intensive operations');
        }
        const highUtilizationPools = this.resourceHistory
            .slice(-5)
            .filter((r) => r.utilization > 0.8);
        if (highUtilizationPools.length > 0) {
            recommendations.push(`Consider scaling up pools: ${highUtilizationPools.map((p) => p.poolName).join(', ')}`);
        }
        const lowUtilizationPools = this.resourceHistory
            .slice(-5)
            .filter((r) => r.utilization < 0.2 && r.totalResources > 1);
        if (lowUtilizationPools.length > 0) {
            recommendations.push(`Consider scaling down underutilized pools: ${lowUtilizationPools.map((p) => p.poolName).join(', ')}`);
        }
        const summary = `System Memory: ${memoryUsedMB.toFixed(2)}MB | Active Pools: ${this.resourceHistory.length} | Alerts: ${alerts.length}`;
        return {
            summary,
            systemStats: system,
            poolStats: this.resourceHistory.slice(-10),
            recommendations,
            alerts,
        };
    }
    async collectResourceStats() {
        try {
            const systemStats = this.getCurrentSystemStats();
            this.systemHistory.push(systemStats);
            if (this.systemHistory.length > this.maxHistorySize) {
                this.systemHistory.shift();
            }
            await this.discoverAndMonitorProviders();
            this.logDebug('Resource stats collected', {
                memoryMB: Math.round(systemStats.memoryUsage.heapUsed / 1024 / 1024),
                activePools: this.resourceHistory.length,
            });
        }
        catch (error) {
            this.logError('Failed to collect resource stats:', error);
        }
    }
    async discoverAndMonitorProviders() {
        const providers = this.discoveryService.getProviders();
        const currentTime = Date.now();
        for (const wrapper of providers) {
            if (!wrapper.metatype)
                continue;
            const poolMetadata = this.reflector.get('resource-pool', wrapper.metatype);
            if (poolMetadata?.enabled) {
                const resourceStats = {
                    poolName: wrapper.name || 'unknown',
                    totalResources: poolMetadata.maxSize || 10,
                    activeResources: Math.floor(Math.random() * (poolMetadata.maxSize || 10)),
                    idleResources: 0,
                    utilization: 0,
                    memoryUsage: this.estimateMemoryUsage(poolMetadata.type),
                    lastActivity: currentTime,
                };
                resourceStats.idleResources =
                    resourceStats.totalResources - resourceStats.activeResources;
                resourceStats.utilization =
                    resourceStats.totalResources > 0
                        ? resourceStats.activeResources / resourceStats.totalResources
                        : 0;
                this.resourceHistory.push(resourceStats);
            }
            const dbMetadata = this.reflector.get('database', wrapper.metatype);
            if (dbMetadata) {
                const dbStats = {
                    poolName: `db_${wrapper.name || 'unknown'}`,
                    totalResources: dbMetadata.maxConnections || 20,
                    activeResources: Math.floor(Math.random() * (dbMetadata.maxConnections || 20)),
                    idleResources: 0,
                    utilization: 0,
                    memoryUsage: this.estimateMemoryUsage('connection'),
                    lastActivity: currentTime,
                };
                dbStats.idleResources =
                    dbStats.totalResources - dbStats.activeResources;
                dbStats.utilization =
                    dbStats.totalResources > 0
                        ? dbStats.activeResources / dbStats.totalResources
                        : 0;
                this.resourceHistory.push(dbStats);
            }
        }
        if (this.resourceHistory.length > this.maxHistorySize) {
            this.resourceHistory = this.resourceHistory.slice(-this.maxHistorySize);
        }
    }
    getCurrentSystemStats() {
        const memoryUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        return {
            memoryUsage,
            cpuUsage,
            uptime: process.uptime(),
            loadAverage: process.platform !== 'win32' ? require('os').loadavg() : [0, 0, 0],
            activeHandles: process._getActiveHandles?.()?.length || 0,
            activeRequests: process._getActiveRequests?.()?.length || 0,
        };
    }
    calculateTrends() {
        let memoryTrend = 'stable';
        let utilizationTrend = 'stable';
        if (this.systemHistory.length >= 5) {
            const recent = this.systemHistory.slice(-5);
            const memoryValues = recent.map((s) => s.memoryUsage.heapUsed);
            const memorySlope = this.calculateSlope(memoryValues);
            if (memorySlope > 1024 * 1024) {
                memoryTrend = 'increasing';
            }
            else if (memorySlope < -1024 * 1024) {
                memoryTrend = 'decreasing';
            }
        }
        if (this.resourceHistory.length >= 5) {
            const recent = this.resourceHistory.slice(-5);
            const utilizationValues = recent.map((r) => r.utilization);
            const utilizationSlope = this.calculateSlope(utilizationValues);
            if (utilizationSlope > 0.1) {
                utilizationTrend = 'increasing';
            }
            else if (utilizationSlope < -0.1) {
                utilizationTrend = 'decreasing';
            }
        }
        return { memoryTrend, utilizationTrend };
    }
    calculateSlope(values) {
        if (values.length < 2)
            return 0;
        const n = values.length;
        const xMean = (n - 1) / 2;
        const yMean = values.reduce((a, b) => a + b, 0) / n;
        let numerator = 0;
        let denominator = 0;
        for (let i = 0; i < n; i++) {
            const xDiff = i - xMean;
            const yDiff = values[i] - yMean;
            numerator += xDiff * yDiff;
            denominator += xDiff * xDiff;
        }
        return denominator === 0 ? 0 : numerator / denominator;
    }
    estimateMemoryUsage(resourceType) {
        switch (resourceType) {
            case 'connection':
                return 1024 * 100;
            case 'worker':
                return 1024 * 1024 * 5;
            case 'cache':
                return 1024 * 1024 * 2;
            default:
                return 1024 * 50;
        }
    }
    getMemoryEfficiency() {
        const systemStats = this.getCurrentSystemStats();
        const totalAllocated = systemStats.memoryUsage.heapTotal;
        const activeUsed = systemStats.memoryUsage.heapUsed;
        const wasted = totalAllocated - activeUsed;
        const efficiency = totalAllocated > 0 ? activeUsed / totalAllocated : 0;
        return {
            totalMemoryAllocated: totalAllocated,
            activeMemoryUsed: activeUsed,
            wastedMemory: wasted,
            efficiency,
        };
    }
};
exports.ResourceMonitorService = ResourceMonitorService;
exports.ResourceMonitorService = ResourceMonitorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.Reflector])
], ResourceMonitorService);
//# sourceMappingURL=resource-monitor.service.js.map