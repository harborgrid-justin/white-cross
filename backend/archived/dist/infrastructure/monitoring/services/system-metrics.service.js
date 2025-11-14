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
exports.SystemMetricsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const base_1 = require("../../../common/base");
let SystemMetricsService = class SystemMetricsService extends base_1.BaseService {
    sequelize;
    MAX_HISTORY_POINTS = 1440;
    poolMetricsHistory = [];
    memoryMetricsHistory = [];
    constructor(sequelize) {
        super('SystemMetricsService');
        this.sequelize = sequelize;
    }
    collectSystemMetrics() {
        const memory = this.collectMemoryMetrics();
        const pool = this.collectPoolMetrics();
        return { memory, pool };
    }
    collectMemoryMetrics() {
        const memUsage = process.memoryUsage();
        const memMetrics = {
            heapUsed: memUsage.heapUsed,
            heapTotal: memUsage.heapTotal,
            external: memUsage.external,
            rss: memUsage.rss,
            utilizationPercent: (memUsage.heapUsed / memUsage.heapTotal) * 100,
            gcPauses: 0,
            avgGcDuration: 0,
        };
        this.memoryMetricsHistory.push(memMetrics);
        if (this.memoryMetricsHistory.length > this.MAX_HISTORY_POINTS) {
            this.memoryMetricsHistory.shift();
        }
        return memMetrics;
    }
    collectPoolMetrics() {
        try {
            const sequelizeAny = this.sequelize;
            const pool = sequelizeAny.connectionManager?.pool;
            if (!pool) {
                return null;
            }
            const activeConnections = pool.used?.length || 0;
            const idleConnections = pool.free?.length || 0;
            const waitingRequests = pool.pending?.length || 0;
            const maxConnections = pool.options?.max || 0;
            const totalConnections = activeConnections + idleConnections;
            const poolMetrics = {
                activeConnections,
                idleConnections,
                waitingRequests,
                totalConnections,
                maxConnections,
                utilizationPercent: 0,
                avgWaitTime: 0,
                connectionErrors: 0,
            };
            if (poolMetrics.maxConnections > 0) {
                poolMetrics.utilizationPercent =
                    (poolMetrics.totalConnections / poolMetrics.maxConnections) * 100;
            }
            this.poolMetricsHistory.push(poolMetrics);
            if (this.poolMetricsHistory.length > this.MAX_HISTORY_POINTS) {
                this.poolMetricsHistory.shift();
            }
            return poolMetrics;
        }
        catch (error) {
            this.logError('Error collecting pool metrics:', error);
            return null;
        }
    }
    getMemoryMetricsHistory(hours = 1) {
        return this.memoryMetricsHistory.filter((m, i) => this.memoryMetricsHistory.length - 1 - i < hours * 60);
    }
    getPoolMetricsHistory(hours = 1) {
        return this.poolMetricsHistory.filter((m, i) => this.poolMetricsHistory.length - 1 - i < hours * 60);
    }
    getCurrentMemoryMetrics() {
        return this.memoryMetricsHistory[this.memoryMetricsHistory.length - 1] || null;
    }
    getCurrentPoolMetrics() {
        return this.poolMetricsHistory[this.poolMetricsHistory.length - 1] || null;
    }
    reset() {
        this.poolMetricsHistory = [];
        this.memoryMetricsHistory = [];
        this.logInfo('System metrics reset');
    }
};
exports.SystemMetricsService = SystemMetricsService;
exports.SystemMetricsService = SystemMetricsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [sequelize_2.Sequelize])
], SystemMetricsService);
//# sourceMappingURL=system-metrics.service.js.map