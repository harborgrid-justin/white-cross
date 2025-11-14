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
var ResourceMetricsCollector_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceMetricsCollector = void 0;
const common_1 = require("@nestjs/common");
const cache_strategy_service_1 = require("./cache-strategy.service");
let ResourceMetricsCollector = ResourceMetricsCollector_1 = class ResourceMetricsCollector {
    cacheService;
    logger = new common_1.Logger(ResourceMetricsCollector_1.name);
    constructor(cacheService) {
        this.cacheService = cacheService;
    }
    collectResourceMetrics() {
        const memoryUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        return {
            timestamp: new Date(),
            memory: {
                heapUsed: memoryUsage.heapUsed,
                heapTotal: memoryUsage.heapTotal,
                external: memoryUsage.external,
                buffers: memoryUsage.heapTotal - memoryUsage.heapUsed,
                rss: memoryUsage.rss,
                utilization: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
            },
            cpu: {
                usage: this.calculateCPUUsage(cpuUsage),
                loadAverage: this.getLoadAverage(),
                processes: this.getProcessCount(),
            },
            network: {
                bytesIn: this.getNetworkBytesIn(),
                bytesOut: this.getNetworkBytesOut(),
                connectionsActive: this.getActiveConnections(),
                latency: this.getNetworkLatency(),
            },
            database: {
                activeConnections: this.getDatabaseActiveConnections(),
                idleConnections: this.getDatabaseIdleConnections(),
                queryQueue: this.getDatabaseQueryQueue(),
                slowQueries: this.getSlowQueryCount(),
                lockWaitTime: this.getDatabaseLockWaitTime(),
            },
            cache: {
                hitRate: this.getCacheHitRate(),
                memoryUsage: this.getCacheMemoryUsage(),
                evictionRate: this.getCacheEvictionRate(),
                responseTime: this.getCacheResponseTime(),
            },
        };
    }
    calculateCPUUsage(cpuUsage) {
        const totalTime = cpuUsage.user + cpuUsage.system;
        return Math.min((totalTime / 1000000) * 100, 100);
    }
    getLoadAverage() {
        try {
            return require('os').loadavg();
        }
        catch {
            return [0, 0, 0];
        }
    }
    getProcessCount() {
        try {
            return require('os').cpus().length;
        }
        catch {
            return 1;
        }
    }
    getNetworkBytesIn() {
        return 0;
    }
    getNetworkBytesOut() {
        return 0;
    }
    getActiveConnections() {
        return 0;
    }
    getNetworkLatency() {
        return 0;
    }
    getDatabaseActiveConnections() {
        return 5;
    }
    getDatabaseIdleConnections() {
        return 15;
    }
    getDatabaseQueryQueue() {
        return 0;
    }
    getSlowQueryCount() {
        return 0;
    }
    getDatabaseLockWaitTime() {
        return 0;
    }
    getCacheHitRate() {
        try {
            return this.cacheService.getCacheMetrics().overall.hitRate * 100;
        }
        catch {
            return 0;
        }
    }
    getCacheMemoryUsage() {
        try {
            return this.cacheService.getCacheMetrics().overall.totalMemoryUsage;
        }
        catch {
            return 0;
        }
    }
    getCacheEvictionRate() {
        return 0;
    }
    getCacheResponseTime() {
        try {
            return this.cacheService.getCacheMetrics().overall.averageResponseTime;
        }
        catch {
            return 0;
        }
    }
};
exports.ResourceMetricsCollector = ResourceMetricsCollector;
exports.ResourceMetricsCollector = ResourceMetricsCollector = ResourceMetricsCollector_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_strategy_service_1.CacheStrategyService])
], ResourceMetricsCollector);
//# sourceMappingURL=resource-metrics-collector.service.js.map