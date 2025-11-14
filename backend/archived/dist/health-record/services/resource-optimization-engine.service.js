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
var ResourceOptimizationEngine_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceOptimizationEngine = exports.ResourceOptimizationType = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const cache_strategy_service_1 = require("./cache-strategy.service");
var ResourceOptimizationType;
(function (ResourceOptimizationType) {
    ResourceOptimizationType["MEMORY_OPTIMIZATION"] = "MEMORY_OPTIMIZATION";
    ResourceOptimizationType["CPU_OPTIMIZATION"] = "CPU_OPTIMIZATION";
    ResourceOptimizationType["NETWORK_OPTIMIZATION"] = "NETWORK_OPTIMIZATION";
    ResourceOptimizationType["DATABASE_OPTIMIZATION"] = "DATABASE_OPTIMIZATION";
    ResourceOptimizationType["CACHE_OPTIMIZATION"] = "CACHE_OPTIMIZATION";
    ResourceOptimizationType["CONNECTION_POOLING"] = "CONNECTION_POOLING";
    ResourceOptimizationType["QUERY_OPTIMIZATION"] = "QUERY_OPTIMIZATION";
    ResourceOptimizationType["BATCH_PROCESSING"] = "BATCH_PROCESSING";
    ResourceOptimizationType["COMPRESSION"] = "COMPRESSION";
    ResourceOptimizationType["PREFETCHING"] = "PREFETCHING";
})(ResourceOptimizationType || (exports.ResourceOptimizationType = ResourceOptimizationType = {}));
let ResourceOptimizationEngine = ResourceOptimizationEngine_1 = class ResourceOptimizationEngine {
    cacheService;
    eventEmitter;
    logger = new common_1.Logger(ResourceOptimizationEngine_1.name);
    recommendations = new Map();
    constructor(cacheService, eventEmitter) {
        this.cacheService = cacheService;
        this.eventEmitter = eventEmitter;
    }
    getOptimizationRecommendations(limit = 50) {
        return Array.from(this.recommendations.values())
            .sort((a, b) => this.getPriorityWeight(b.priority) -
            this.getPriorityWeight(a.priority))
            .slice(0, limit);
    }
    async executeOptimization(recommendationId) {
        const recommendation = this.recommendations.get(recommendationId);
        if (!recommendation) {
            return { success: false, message: 'Recommendation not found' };
        }
        this.logger.log(`Executing optimization: ${recommendation.title}`);
        try {
            const result = await this.executeOptimizationByType(recommendation);
            if (result.success) {
                this.recordOptimizationSuccess(recommendation);
                this.recommendations.delete(recommendationId);
                return {
                    success: true,
                    message: `Optimization completed successfully: ${recommendation.title}`,
                };
            }
            else {
                this.recordOptimizationFailure(recommendation, result.message);
                return result;
            }
        }
        catch (error) {
            const errorMessage = `Optimization failed: ${error.message}`;
            this.logger.error(errorMessage, error.stack);
            this.recordOptimizationFailure(recommendation, errorMessage);
            return { success: false, message: errorMessage };
        }
    }
    async performMemoryOptimization() {
        const beforeMemory = process.memoryUsage();
        const optimizationsApplied = [];
        try {
            if (global.gc) {
                global.gc();
                optimizationsApplied.push('Forced garbage collection');
            }
            const cacheMetrics = this.cacheService.getCacheMetrics();
            if (cacheMetrics.overall.totalMemoryUsage > 10 * 1024 * 1024) {
                await this.cacheService.invalidate('*:expired:*', 'memory optimization');
                optimizationsApplied.push('Cleared expired cache entries');
            }
            const afterMemory = process.memoryUsage();
            const memoryFreed = beforeMemory.heapUsed - afterMemory.heapUsed;
            this.logger.log(`Memory optimization completed: freed ${(memoryFreed / 1024 / 1024).toFixed(2)}MB`);
            return {
                success: true,
                memoryFreed: Math.max(0, memoryFreed),
                optimizationsApplied,
            };
        }
        catch (error) {
            this.logger.error('Memory optimization failed:', error);
            return {
                success: false,
                memoryFreed: 0,
                optimizationsApplied,
            };
        }
    }
    async analyzeForOptimizations(currentMetrics, recentHistory) {
        const recommendations = [];
        if (currentMetrics.memory.utilization > 80) {
            recommendations.push({
                id: `memory_opt_${Date.now()}`,
                type: ResourceOptimizationType.MEMORY_OPTIMIZATION,
                priority: currentMetrics.memory.utilization > 90 ? 'CRITICAL' : 'HIGH',
                title: 'Memory Usage Optimization',
                description: 'High memory usage detected. Implement memory optimization strategies.',
                impact: 'Reduce memory usage and prevent out-of-memory errors',
                implementation: 'Force garbage collection, clear expired cache entries, optimize data structures',
                estimatedSavings: {
                    memory: Math.floor(currentMetrics.memory.heapUsed * 0.2),
                },
                riskLevel: 'LOW',
                implementationTime: 0.5,
                prerequisites: [],
                complianceImpact: false,
            });
        }
        if (currentMetrics.cache.hitRate < 60) {
            recommendations.push({
                id: `cache_opt_${Date.now()}`,
                type: ResourceOptimizationType.CACHE_OPTIMIZATION,
                priority: currentMetrics.cache.hitRate < 40 ? 'HIGH' : 'MEDIUM',
                title: 'Cache Performance Optimization',
                description: 'Low cache hit rate detected. Optimize cache strategy.',
                impact: 'Improve response times and reduce database load',
                implementation: 'Implement cache warming, adjust TTL policies, optimize cache keys',
                estimatedSavings: {
                    responseTime: 100,
                },
                riskLevel: 'LOW',
                implementationTime: 1,
                prerequisites: [],
                complianceImpact: false,
            });
        }
        if (currentMetrics.database.activeConnections > 80) {
            recommendations.push({
                id: `db_conn_opt_${Date.now()}`,
                type: ResourceOptimizationType.CONNECTION_POOLING,
                priority: 'HIGH',
                title: 'Database Connection Pool Optimization',
                description: 'High database connection usage detected.',
                impact: 'Prevent connection pool exhaustion and improve database performance',
                implementation: 'Optimize connection pool settings, implement connection pooling',
                estimatedSavings: {
                    responseTime: 50,
                },
                riskLevel: 'MEDIUM',
                implementationTime: 2,
                prerequisites: ['Database administrator access'],
                complianceImpact: false,
            });
        }
        return recommendations;
    }
    cleanupCompletedRecommendations() {
        return 0;
    }
    cleanupOldRecommendations() {
        const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        let cleanedCount = 0;
        for (const [id, recommendation] of this.recommendations.entries()) {
            if (Math.random() < 0.1) {
                this.recommendations.delete(id);
                cleanedCount++;
            }
        }
        return cleanedCount;
    }
    async executeOptimizationByType(recommendation) {
        switch (recommendation.type) {
            case ResourceOptimizationType.MEMORY_OPTIMIZATION:
                const result = await this.performMemoryOptimization();
                return {
                    success: result.success,
                    message: result.success
                        ? `Memory optimization completed, freed ${result.memoryFreed} bytes`
                        : 'Memory optimization failed',
                };
            case ResourceOptimizationType.CACHE_OPTIMIZATION:
                try {
                    await this.cacheService.performCacheWarming();
                    return { success: true, message: 'Cache optimization completed' };
                }
                catch (error) {
                    return { success: false, message: `Cache optimization failed: ${error.message}` };
                }
                ;
            default:
                return { success: false, message: `Unsupported optimization type: ${recommendation.type}` };
        }
    }
    recordOptimizationSuccess(recommendation) {
        this.logger.log(`Optimization completed successfully: ${recommendation.title}`);
        this.eventEmitter.emit('optimization.success', {
            recommendation,
            timestamp: new Date(),
        });
    }
    recordOptimizationFailure(recommendation, error) {
        this.logger.error(`Optimization failed: ${recommendation.title} - ${error}`);
        this.eventEmitter.emit('optimization.failure', {
            recommendation,
            error,
            timestamp: new Date(),
        });
    }
    getPriorityWeight(priority) {
        switch (priority) {
            case 'CRITICAL':
                return 4;
            case 'HIGH':
                return 3;
            case 'MEDIUM':
                return 2;
            case 'LOW':
                return 1;
            default:
                return 0;
        }
    }
};
exports.ResourceOptimizationEngine = ResourceOptimizationEngine;
exports.ResourceOptimizationEngine = ResourceOptimizationEngine = ResourceOptimizationEngine_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_strategy_service_1.CacheStrategyService,
        event_emitter_1.EventEmitter2])
], ResourceOptimizationEngine);
//# sourceMappingURL=resource-optimization-engine.service.js.map