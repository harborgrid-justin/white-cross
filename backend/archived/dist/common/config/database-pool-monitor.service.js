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
exports.DatabasePoolMonitorService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const schedule_1 = require("@nestjs/schedule");
const base_1 = require("../base");
const logger_service_1 = require("../logging/logger.service");
let DatabasePoolMonitorService = class DatabasePoolMonitorService extends base_1.BaseService {
    sequelize;
    metrics = [];
    alerts = [];
    MAX_METRICS_HISTORY = 100;
    MAX_ALERTS_HISTORY = 50;
    HIGH_UTILIZATION_THRESHOLD = 0.8;
    CRITICAL_UTILIZATION_THRESHOLD = 0.9;
    MAX_WAITING_REQUESTS = 5;
    constructor(logger, sequelize) {
        super({
            serviceName: 'DatabasePoolMonitorService',
            logger,
            enableAuditLogging: false,
        });
        this.sequelize = sequelize;
    }
    async onModuleInit() {
        this.logInfo('Database Pool Monitor initialized');
        await this.checkPoolHealth();
    }
    async collectMetrics() {
        try {
            const pool = this.getConnectionPool();
            if (!pool) {
                this.logWarning('Connection pool not available');
                return null;
            }
            const metrics = {
                activeConnections: pool.used?.length || 0,
                idleConnections: pool.free?.length || 0,
                waitingRequests: pool.pending?.length || 0,
                totalConnections: (pool.used?.length || 0) + (pool.free?.length || 0),
                maxConnections: pool.options?.max || 0,
                utilizationPercent: 0,
                timestamp: new Date(),
            };
            if (metrics.maxConnections > 0) {
                metrics.utilizationPercent =
                    (metrics.totalConnections / metrics.maxConnections) * 100;
            }
            this.metrics.push(metrics);
            if (this.metrics.length > this.MAX_METRICS_HISTORY) {
                this.metrics.shift();
            }
            this.checkForAlerts(metrics);
            if (metrics.utilizationPercent > 70 || metrics.waitingRequests > 0) {
                this.logWarning('Pool Metrics:', {
                    active: metrics.activeConnections,
                    idle: metrics.idleConnections,
                    waiting: metrics.waitingRequests,
                    utilization: `${metrics.utilizationPercent.toFixed(1)}%`,
                });
            }
            return metrics;
        }
        catch (error) {
            this.logError('Error collecting pool metrics:', error);
            return null;
        }
    }
    async checkPoolHealth() {
        try {
            await this.sequelize.authenticate();
            const metrics = await this.collectMetrics();
            if (!metrics) {
                return false;
            }
            const isHealthy = metrics.utilizationPercent <
                this.CRITICAL_UTILIZATION_THRESHOLD * 100 &&
                metrics.waitingRequests < this.MAX_WAITING_REQUESTS;
            if (!isHealthy) {
                this.logError('Pool health check failed:', {
                    utilization: `${metrics.utilizationPercent.toFixed(1)}%`,
                    waiting: metrics.waitingRequests,
                });
            }
            else {
                this.logDebug('Pool health check passed');
            }
            return isHealthy;
        }
        catch (error) {
            this.logError('Database connection health check failed:', error);
            this.recordAlert({
                type: 'connection_error',
                severity: 'critical',
                message: `Database connection failed: ${error.message}`,
                metrics: null,
                timestamp: new Date(),
            });
            return false;
        }
    }
    getCurrentMetrics() {
        return this.metrics[this.metrics.length - 1] || null;
    }
    getMetricsHistory(limit = 20) {
        return this.metrics.slice(-limit);
    }
    getAlerts(limit = 10) {
        return this.alerts.slice(-limit);
    }
    getPoolStatistics() {
        if (this.metrics.length === 0) {
            return null;
        }
        const avgUtilization = this.metrics.reduce((sum, m) => sum + m.utilizationPercent, 0) /
            this.metrics.length;
        const maxUtilization = Math.max(...this.metrics.map((m) => m.utilizationPercent));
        const avgWaiting = this.metrics.reduce((sum, m) => sum + m.waitingRequests, 0) /
            this.metrics.length;
        const maxWaiting = Math.max(...this.metrics.map((m) => m.waitingRequests));
        return {
            current: this.getCurrentMetrics(),
            averages: {
                utilizationPercent: avgUtilization,
                waitingRequests: avgWaiting,
            },
            peaks: {
                utilizationPercent: maxUtilization,
                waitingRequests: maxWaiting,
            },
            alertCount: this.alerts.length,
            criticalAlertCount: this.alerts.filter((a) => a.severity === 'critical')
                .length,
        };
    }
    clearHistory() {
        this.metrics = [];
        this.alerts = [];
        this.logInfo('Pool monitor history cleared');
    }
    getConnectionPool() {
        try {
            return this.sequelize.connectionManager?.pool;
        }
        catch (error) {
            this.logError('Error accessing connection pool:', error);
            return null;
        }
    }
    checkForAlerts(metrics) {
        if (metrics.utilizationPercent >=
            this.CRITICAL_UTILIZATION_THRESHOLD * 100) {
            this.recordAlert({
                type: 'pool_exhaustion',
                severity: 'critical',
                message: `Critical pool utilization: ${metrics.utilizationPercent.toFixed(1)}% (${metrics.totalConnections}/${metrics.maxConnections})`,
                metrics,
                timestamp: new Date(),
            });
        }
        else if (metrics.utilizationPercent >=
            this.HIGH_UTILIZATION_THRESHOLD * 100) {
            this.recordAlert({
                type: 'high_utilization',
                severity: 'warning',
                message: `High pool utilization: ${metrics.utilizationPercent.toFixed(1)}% (${metrics.totalConnections}/${metrics.maxConnections})`,
                metrics,
                timestamp: new Date(),
            });
        }
        if (metrics.waitingRequests > this.MAX_WAITING_REQUESTS) {
            this.recordAlert({
                type: 'connection_wait',
                severity: metrics.waitingRequests > 10 ? 'critical' : 'warning',
                message: `${metrics.waitingRequests} requests waiting for database connections`,
                metrics,
                timestamp: new Date(),
            });
        }
    }
    recordAlert(alert) {
        this.alerts.push(alert);
        if (this.alerts.length > this.MAX_ALERTS_HISTORY) {
            this.alerts.shift();
        }
        const logMethod = alert.severity === 'critical' ? 'error' : 'warn';
        this.logger[logMethod](`[${alert.type.toUpperCase()}] ${alert.message}`);
    }
};
exports.DatabasePoolMonitorService = DatabasePoolMonitorService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DatabasePoolMonitorService.prototype, "collectMetrics", null);
exports.DatabasePoolMonitorService = DatabasePoolMonitorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __param(1, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        sequelize_2.Sequelize])
], DatabasePoolMonitorService);
//# sourceMappingURL=database-pool-monitor.service.js.map