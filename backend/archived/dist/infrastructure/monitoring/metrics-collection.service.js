"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsCollectionService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const os = __importStar(require("os"));
const v8 = __importStar(require("v8"));
let MetricsCollectionService = class MetricsCollectionService extends base_1.BaseService {
    sequelize;
    cacheService;
    websocketService;
    queueManagerService;
    requestMetrics = {
        total: 0,
        failed: 0,
        responseTimes: [],
        lastSecondRequests: [],
    };
    queryMetrics = {
        totalQueries: 0,
        queryTimes: [],
        slowQueries: 0,
        slowQueryThreshold: 1000,
    };
    wsMetrics = {
        messagesSent: 0,
        messagesReceived: 0,
        lastMinuteMessages: [],
    };
    jobMetrics = {
        totalJobs: 0,
        processingTimes: [],
    };
    constructor(sequelize) {
        super("MetricsCollectionService");
        this.sequelize = sequelize;
    }
    setCacheService(cacheService) {
        this.cacheService = cacheService;
    }
    setWebSocketService(websocketService) {
        this.websocketService = websocketService;
    }
    setQueueManagerService(queueManagerService) {
        this.queueManagerService = queueManagerService;
    }
    setSlowQueryThreshold(thresholdMs) {
        this.queryMetrics.slowQueryThreshold = thresholdMs;
    }
    getRequestMetrics() {
        return this.requestMetrics;
    }
    getQueryMetrics() {
        return this.queryMetrics;
    }
    getWebSocketMetrics() {
        return this.wsMetrics;
    }
    getJobMetrics() {
        return this.jobMetrics;
    }
    async collectSystemMetrics() {
        const cpus = os.cpus();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memUsagePercent = (usedMem / totalMem) * 100;
        let totalIdle = 0;
        let totalTick = 0;
        cpus.forEach((cpu) => {
            for (const type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        });
        const idle = totalIdle / cpus.length;
        const total = totalTick / cpus.length;
        const cpuUsage = 100 - (100 * idle) / total;
        const heapStats = v8.getHeapStatistics();
        const memUsage = process.memoryUsage();
        return {
            cpu: {
                usage: Math.round(cpuUsage * 100) / 100,
                system: Math.round(cpuUsage * 100) / 100,
                user: Math.round(cpuUsage * 100) / 100,
                cores: cpus.length,
                loadAverage: os.loadavg(),
            },
            memory: {
                total: totalMem,
                used: usedMem,
                free: freeMem,
                usagePercent: Math.round(memUsagePercent * 100) / 100,
                heapUsed: memUsage.heapUsed,
                heapTotal: memUsage.heapTotal,
                external: memUsage.external,
                rss: memUsage.rss,
            },
            process: {
                uptime: process.uptime(),
                pid: process.pid,
                nodeVersion: process.version,
                platform: process.platform,
            },
        };
    }
    async collectPerformanceMetrics() {
        const responseTimes = this.requestMetrics.responseTimes.slice(-100);
        const avgResponseTime = responseTimes.length > 0
            ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
            : 0;
        const sortedTimes = [...responseTimes].sort((a, b) => a - b);
        const p95Index = Math.floor(sortedTimes.length * 0.95);
        const p99Index = Math.floor(sortedTimes.length * 0.99);
        const p95ResponseTime = sortedTimes[p95Index] || 0;
        const p99ResponseTime = sortedTimes[p99Index] || 0;
        const successRate = this.requestMetrics.total > 0
            ? ((this.requestMetrics.total - this.requestMetrics.failed) /
                this.requestMetrics.total) *
                100
            : 100;
        const now = Date.now();
        const recentRequests = this.requestMetrics.lastSecondRequests.filter((timestamp) => now - timestamp < 60000);
        const requestsPerSecond = recentRequests.length / 60;
        const pool = this.sequelize.connectionManager.pool;
        const poolSize = pool?.size || pool?.max || 10;
        const idleConnections = pool?.available || pool?.idle || 0;
        const activeConnections = pool?.using || poolSize - idleConnections;
        const queryTimes = this.queryMetrics.queryTimes;
        const avgQueryTime = queryTimes.length > 0
            ? queryTimes.reduce((a, b) => a + b, 0) / queryTimes.length
            : 0;
        let cacheStats = {
            hitRate: 0,
            hits: 0,
            misses: 0,
            size: 0,
            memoryUsage: 0,
        };
        if (this.cacheService?.getStats) {
            try {
                const stats = await this.cacheService.getStats();
                cacheStats = {
                    hitRate: stats.hitRate || 0,
                    hits: stats.hits || 0,
                    misses: stats.misses || 0,
                    size: stats.size || 0,
                    memoryUsage: stats.memoryUsage || 0,
                };
            }
            catch (error) {
                this.logWarning('Failed to get cache stats', error);
            }
        }
        const wsConnectedClients = this.websocketService?.getConnectedSocketsCount() || 0;
        const queueMetrics = {
            waitingJobs: 0,
            activeJobs: 0,
            completedJobs: 0,
            failedJobs: 0,
        };
        if (this.queueManagerService) {
            try {
                const allStats = await this.queueManagerService.getAllQueueStats();
                Object.values(allStats).forEach((stats) => {
                    queueMetrics.waitingJobs += stats.waiting || 0;
                    queueMetrics.activeJobs += stats.active || 0;
                    queueMetrics.completedJobs += stats.completed || 0;
                    queueMetrics.failedJobs += stats.failed || 0;
                });
            }
            catch (error) {
                this.logWarning('Failed to collect queue metrics', error);
            }
        }
        return {
            requests: {
                requestsPerSecond: Math.round(requestsPerSecond * 100) / 100,
                averageResponseTime: Math.round(avgResponseTime * 100) / 100,
                p95ResponseTime: Math.round(p95ResponseTime * 100) / 100,
                p99ResponseTime: Math.round(p99ResponseTime * 100) / 100,
                totalRequests: this.requestMetrics.total,
                failedRequests: this.requestMetrics.failed,
                successRate: Math.round(successRate * 100) / 100,
            },
            database: {
                activeConnections,
                idleConnections,
                averageQueryTime: Math.round(avgQueryTime * 100) / 100,
                slowQueries: this.queryMetrics.slowQueries,
            },
            cache: {
                hitRate: cacheStats.hitRate,
                hits: cacheStats.hits,
                misses: cacheStats.misses,
                size: cacheStats.size,
                memoryUsage: cacheStats.memoryUsage,
            },
            websocket: {
                connectedClients: wsConnectedClients,
                messagesPerSecond: Math.round((this.wsMetrics.lastMinuteMessages.length / 60) * 100) /
                    100,
                totalMessages: this.wsMetrics.messagesSent + this.wsMetrics.messagesReceived,
            },
            queue: {
                ...queueMetrics,
                averageProcessingTime: this.jobMetrics.processingTimes.length > 0
                    ? Math.round((this.jobMetrics.processingTimes.reduce((a, b) => a + b, 0) /
                        this.jobMetrics.processingTimes.length) *
                        100) / 100
                    : 0,
            },
        };
    }
    async collectMetrics() {
        const [system, performance] = await Promise.all([
            this.collectSystemMetrics(),
            this.collectPerformanceMetrics(),
        ]);
        const snapshot = {
            timestamp: new Date().toISOString(),
            system,
            performance,
        };
        return snapshot;
    }
    trackRequest(responseTime, success = true) {
        this.requestMetrics.total++;
        if (!success) {
            this.requestMetrics.failed++;
        }
        this.requestMetrics.responseTimes.push(responseTime);
        this.requestMetrics.lastSecondRequests.push(Date.now());
        if (this.requestMetrics.responseTimes.length > 1000) {
            this.requestMetrics.responseTimes.shift();
        }
        if (this.requestMetrics.lastSecondRequests.length > 1000) {
            this.requestMetrics.lastSecondRequests.shift();
        }
    }
    trackQuery(queryTime) {
        this.queryMetrics.totalQueries++;
        this.queryMetrics.queryTimes.push(queryTime);
        if (queryTime > this.queryMetrics.slowQueryThreshold) {
            this.queryMetrics.slowQueries++;
            this.logWarning(`Slow query detected: ${queryTime}ms (threshold: ${this.queryMetrics.slowQueryThreshold}ms)`);
        }
        if (this.queryMetrics.queryTimes.length > 1000) {
            this.queryMetrics.queryTimes.shift();
        }
    }
    trackWebSocketMessage(direction) {
        if (direction === 'sent') {
            this.wsMetrics.messagesSent++;
        }
        else {
            this.wsMetrics.messagesReceived++;
        }
        this.wsMetrics.lastMinuteMessages.push(Date.now());
        const oneMinuteAgo = Date.now() - 60000;
        this.wsMetrics.lastMinuteMessages =
            this.wsMetrics.lastMinuteMessages.filter((timestamp) => timestamp > oneMinuteAgo);
    }
    trackJobProcessing(processingTime, jobType) {
        this.jobMetrics.totalJobs++;
        this.jobMetrics.processingTimes.push(processingTime);
        if (processingTime > 30000) {
            this.logWarning(`Slow job detected: ${jobType || 'unknown'} took ${processingTime}ms`);
        }
        if (this.jobMetrics.processingTimes.length > 1000) {
            this.jobMetrics.processingTimes.shift();
        }
    }
};
exports.MetricsCollectionService = MetricsCollectionService;
exports.MetricsCollectionService = MetricsCollectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize])
], MetricsCollectionService);
//# sourceMappingURL=metrics-collection.service.js.map