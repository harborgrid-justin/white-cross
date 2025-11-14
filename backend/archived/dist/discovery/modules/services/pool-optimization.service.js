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
exports.PoolOptimizationService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const dynamic_resource_pool_service_1 = require("./dynamic-resource-pool.service");
const resource_monitor_service_1 = require("./resource-monitor.service");
const base_1 = require("../../../common/base");
let PoolOptimizationService = class PoolOptimizationService extends base_1.BaseService {
    discoveryService;
    reflector;
    poolService;
    monitorService;
    strategies = [];
    optimizationHistory = [];
    constructor(discoveryService, reflector, poolService, monitorService) {
        super("PoolOptimizationService");
        this.discoveryService = discoveryService;
        this.reflector = reflector;
        this.poolService = poolService;
        this.monitorService = monitorService;
        this.initializeStrategies();
    }
    async optimizePools() {
        this.logInfo('Starting pool optimization cycle');
        try {
            const poolStats = this.poolService.getPoolStats();
            const context = await this.buildOptimizationContext();
            let optimizationsApplied = 0;
            for (const [poolName, stats] of Object.entries(poolStats)) {
                const result = await this.optimizePool(poolName, stats, context);
                if (result.action !== 'no_action') {
                    await this.applyOptimization(poolName, result);
                    optimizationsApplied++;
                    this.optimizationHistory.push({
                        timestamp: Date.now(),
                        poolName,
                        action: result.action,
                        result,
                    });
                }
            }
            if (this.optimizationHistory.length > 1000) {
                this.optimizationHistory = this.optimizationHistory.slice(-1000);
            }
            this.logInfo(`Pool optimization complete: ${optimizationsApplied} pools optimized`);
        }
        catch (error) {
            this.logError('Pool optimization failed:', error);
        }
    }
    async optimizePool(poolName, stats, context) {
        let bestResult = {
            action: 'no_action',
            reason: 'No optimization needed',
            confidence: 0,
        };
        for (const strategy of this.strategies.sort((a, b) => b.priority - a.priority)) {
            try {
                const result = await strategy.execute(poolName, stats, context);
                if (result.confidence > bestResult.confidence) {
                    bestResult = result;
                }
            }
            catch (error) {
                this.logError(`Strategy ${strategy.name} failed for pool ${poolName}:`, error);
            }
        }
        return bestResult;
    }
    getOptimizationRecommendations() {
        const recommendations = [];
        const poolStats = this.poolService.getPoolStats();
        for (const [poolName, stats] of Object.entries(poolStats)) {
            if (stats.poolUtilization > 0.8) {
                recommendations.push({
                    poolName,
                    currentSize: stats.totalResources,
                    recommendedSize: Math.ceil(stats.totalResources * 1.3),
                    reason: `High utilization (${(stats.poolUtilization * 100).toFixed(1)}%) - consider scaling up`,
                    priority: 'high',
                    memoryImpact: this.estimateMemoryImpact(poolName, Math.ceil(stats.totalResources * 0.3)),
                });
            }
            if (stats.poolUtilization < 0.2 && stats.totalResources > 2) {
                recommendations.push({
                    poolName,
                    currentSize: stats.totalResources,
                    recommendedSize: Math.max(2, Math.floor(stats.totalResources * 0.7)),
                    reason: `Low utilization (${(stats.poolUtilization * 100).toFixed(1)}%) - consider scaling down`,
                    priority: 'medium',
                    memoryImpact: -this.estimateMemoryImpact(poolName, Math.floor(stats.totalResources * 0.3)),
                });
            }
            if (stats.averageWaitTime > 1000) {
                recommendations.push({
                    poolName,
                    currentSize: stats.totalResources,
                    recommendedSize: stats.totalResources + 2,
                    reason: `High average wait time (${stats.averageWaitTime.toFixed(0)}ms) - add resources`,
                    priority: 'high',
                    memoryImpact: this.estimateMemoryImpact(poolName, 2),
                });
            }
        }
        return recommendations.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }
    getOptimizationStats() {
        const recent = this.optimizationHistory.slice(-50);
        const successful = recent.filter((h) => h.result.confidence > 0.7);
        const memoryReduction = recent
            .filter((h) => h.result.memoryImpact && h.result.memoryImpact < 0)
            .reduce((sum, h) => sum + Math.abs(h.result.memoryImpact || 0), 0) /
            (1024 * 1024);
        const performanceImprovements = recent.filter((h) => h.action === 'scale_up' || h.action === 'rebalance').length;
        return {
            totalOptimizations: this.optimizationHistory.length,
            successfulOptimizations: successful.length,
            memoryReductionMB: memoryReduction,
            performanceImprovements,
            recentOptimizations: recent.slice(-10),
        };
    }
    initializeStrategies() {
        this.strategies.push({
            name: 'UTILIZATION_OPTIMIZER',
            priority: 10,
            execute: async (poolName, stats, context) => {
                if (stats.poolUtilization > 0.9) {
                    return {
                        action: 'scale_up',
                        reason: `High utilization: ${(stats.poolUtilization * 100).toFixed(1)}%`,
                        suggestedSize: Math.ceil(stats.totalResources * 1.2),
                        memoryImpact: this.estimateMemoryImpact(poolName, Math.ceil(stats.totalResources * 0.2)),
                        confidence: 0.9,
                    };
                }
                if (stats.poolUtilization < 0.1 && stats.totalResources > 2) {
                    return {
                        action: 'scale_down',
                        reason: `Low utilization: ${(stats.poolUtilization * 100).toFixed(1)}%`,
                        suggestedSize: Math.max(2, Math.floor(stats.totalResources * 0.8)),
                        memoryImpact: -this.estimateMemoryImpact(poolName, Math.floor(stats.totalResources * 0.2)),
                        confidence: 0.8,
                    };
                }
                return {
                    action: 'no_action',
                    reason: 'Utilization within acceptable range',
                    confidence: 0.5,
                };
            },
        });
        this.strategies.push({
            name: 'MEMORY_PRESSURE_OPTIMIZER',
            priority: 9,
            execute: async (poolName, stats, context) => {
                if (context.systemMemoryUsage > 400 * 1024 * 1024) {
                    return {
                        action: 'scale_down',
                        reason: `High system memory usage: ${(context.systemMemoryUsage / 1024 / 1024).toFixed(1)}MB`,
                        suggestedSize: Math.max(1, Math.floor(stats.totalResources * 0.7)),
                        memoryImpact: -this.estimateMemoryImpact(poolName, Math.floor(stats.totalResources * 0.3)),
                        confidence: 0.8,
                    };
                }
                return {
                    action: 'no_action',
                    reason: 'Memory usage acceptable',
                    confidence: 0.3,
                };
            },
        });
        this.strategies.push({
            name: 'WAIT_TIME_OPTIMIZER',
            priority: 8,
            execute: async (poolName, stats, context) => {
                if (stats.averageWaitTime > 2000) {
                    return {
                        action: 'scale_up',
                        reason: `High wait time: ${stats.averageWaitTime.toFixed(0)}ms`,
                        suggestedSize: stats.totalResources + Math.ceil(stats.waitingRequests / 2),
                        memoryImpact: this.estimateMemoryImpact(poolName, Math.ceil(stats.waitingRequests / 2)),
                        confidence: 0.85,
                    };
                }
                return {
                    action: 'no_action',
                    reason: 'Wait times acceptable',
                    confidence: 0.4,
                };
            },
        });
        this.strategies.push({
            name: 'DISCOVERY_METADATA_OPTIMIZER',
            priority: 7,
            execute: async (poolName, stats, context) => {
                const providers = this.discoveryService.getProviders();
                for (const wrapper of providers) {
                    if (!wrapper.metatype)
                        continue;
                    const poolMetadata = this.reflector.get('resource-pool', wrapper.metatype);
                    if (poolMetadata?.enabled &&
                        (wrapper.name === poolName || `db_${wrapper.name}` === poolName)) {
                        const optimalSize = poolMetadata.optimalSize;
                        if (optimalSize && optimalSize !== stats.totalResources) {
                            return {
                                action: optimalSize > stats.totalResources
                                    ? 'scale_up'
                                    : 'scale_down',
                                reason: `Metadata suggests optimal size: ${optimalSize}`,
                                suggestedSize: optimalSize,
                                memoryImpact: this.estimateMemoryImpact(poolName, optimalSize - stats.totalResources),
                                confidence: 0.7,
                            };
                        }
                    }
                }
                return {
                    action: 'no_action',
                    reason: 'No metadata optimization hints found',
                    confidence: 0.2,
                };
            },
        });
    }
    async buildOptimizationContext() {
        const resourceStats = this.monitorService.getResourceStats();
        const poolStats = this.poolService.getPoolStats();
        const totalPools = Object.keys(poolStats).length;
        const averageUtilization = totalPools > 0
            ? Object.values(poolStats).reduce((sum, stats) => sum + stats.poolUtilization, 0) / totalPools
            : 0;
        return {
            systemMemoryUsage: resourceStats.system.memoryUsage.heapUsed,
            totalPools,
            averageUtilization,
            timeOfDay: new Date().getHours(),
            trend: resourceStats.trends.memoryTrend,
        };
    }
    async applyOptimization(poolName, result) {
        this.logInfo(`Applying optimization to ${poolName}:`, {
            action: result.action,
            reason: result.reason,
            suggestedSize: result.suggestedSize,
            confidence: result.confidence,
        });
        switch (result.action) {
            case 'scale_down':
                await this.poolService.scaleDownPools(`optimization: ${result.reason}`);
                break;
            case 'scale_up':
                this.logInfo(`Would scale up ${poolName} to ${result.suggestedSize} resources`);
                break;
            case 'rebalance':
                this.logInfo(`Would rebalance resources for ${poolName}`);
                break;
        }
    }
    estimateMemoryImpact(poolName, resourceChange) {
        let memoryPerResource = 1024 * 100;
        if (poolName.startsWith('db_')) {
            memoryPerResource = 1024 * 200;
        }
        else if (poolName.includes('worker')) {
            memoryPerResource = 1024 * 1024 * 5;
        }
        else if (poolName.includes('cache')) {
            memoryPerResource = 1024 * 1024 * 2;
        }
        return resourceChange * memoryPerResource;
    }
};
exports.PoolOptimizationService = PoolOptimizationService;
exports.PoolOptimizationService = PoolOptimizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.Reflector,
        dynamic_resource_pool_service_1.DynamicResourcePoolService,
        resource_monitor_service_1.ResourceMonitorService])
], PoolOptimizationService);
//# sourceMappingURL=pool-optimization.service.js.map