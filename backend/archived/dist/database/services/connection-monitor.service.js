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
exports.ConnectionMonitorService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
let ConnectionMonitorService = class ConnectionMonitorService extends base_1.BaseService {
    sequelize;
    monitoringInterval = null;
    healthCheckInterval = null;
    MONITORING_INTERVAL = 30000;
    HEALTH_CHECK_INTERVAL = 60000;
    HIGH_UTILIZATION_THRESHOLD = 0.8;
    CRITICAL_UTILIZATION_THRESHOLD = 0.95;
    HIGH_WAIT_THRESHOLD = 5;
    currentMetrics = null;
    healthStatus = {
        isHealthy: true,
        lastCheckTime: new Date(),
        consecutiveFailures: 0,
        issues: [],
    };
    constructor(logger, sequelize) {
        super({
            serviceName: 'ConnectionMonitorService',
            logger,
            enableAuditLogging: false,
        });
        this.sequelize = sequelize;
    }
    async onModuleInit() {
        this.logInfo('Initializing Connection Pool Monitor');
        await this.startMonitoring();
    }
    async onModuleDestroy() {
        this.logInfo('Stopping Connection Pool Monitor');
        await this.stopMonitoring();
    }
    async startMonitoring() {
        await this.collectMetrics();
        await this.performHealthCheck();
        this.monitoringInterval = setInterval(async () => {
            await this.collectMetrics();
            this.analyzeMetrics();
        }, this.MONITORING_INTERVAL);
        this.healthCheckInterval = setInterval(async () => {
            await this.performHealthCheck();
        }, this.HEALTH_CHECK_INTERVAL);
        this.logInfo('Connection pool monitoring started');
    }
    async stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
        this.logInfo('Connection pool monitoring stopped');
    }
    async collectMetrics() {
        try {
            const pool = this.sequelize.connectionManager?.pool;
            if (!pool) {
                this.logWarning('Connection pool not available');
                return this.getEmptyMetrics();
            }
            const active = pool.used?.length || 0;
            const idle = pool.free?.length || 0;
            const waiting = pool.pending?.length || 0;
            const total = active + idle;
            const max = pool.options?.max || 0;
            const utilizationPercent = max > 0 ? (total / max) * 100 : 0;
            this.currentMetrics = {
                active,
                idle,
                waiting,
                total,
                max,
                utilizationPercent,
                timestamp: new Date(),
            };
            return this.currentMetrics;
        }
        catch (error) {
            this.logError('Failed to collect connection pool metrics', error);
            return this.getEmptyMetrics();
        }
    }
    analyzeMetrics() {
        if (!this.currentMetrics) {
            return;
        }
        const { active, waiting, max, utilizationPercent } = this.currentMetrics;
        if (utilizationPercent >= this.CRITICAL_UTILIZATION_THRESHOLD * 100) {
            this.logError(`CRITICAL: Connection pool utilization at ${utilizationPercent.toFixed(1)}% (${active}/${max} connections)`, {
                metrics: this.currentMetrics,
            });
        }
        else if (utilizationPercent >= this.HIGH_UTILIZATION_THRESHOLD * 100) {
            this.logWarning(`HIGH: Connection pool utilization at ${utilizationPercent.toFixed(1)}% (${active}/${max} connections)`, {
                metrics: this.currentMetrics,
            });
        }
        if (waiting > this.HIGH_WAIT_THRESHOLD) {
            this.logWarning(`Connection pool wait queue is high: ${waiting} requests waiting`, {
                metrics: this.currentMetrics,
            });
        }
        this.logDebug('Connection Pool Metrics', {
            active,
            idle: this.currentMetrics.idle,
            waiting,
            utilization: `${utilizationPercent.toFixed(1)}%`,
        });
    }
    async performHealthCheck() {
        const issues = [];
        try {
            await this.sequelize.authenticate();
            this.healthStatus.consecutiveFailures = 0;
            this.healthStatus.isHealthy = true;
            this.healthStatus.issues = [];
            this.logDebug('Database health check passed');
        }
        catch (error) {
            this.healthStatus.consecutiveFailures++;
            issues.push(`Database authentication failed: ${error.message}`);
            this.logError(`Database health check failed (${this.healthStatus.consecutiveFailures} consecutive failures)`, error);
            if (this.healthStatus.consecutiveFailures >= 3) {
                this.healthStatus.isHealthy = false;
                this.logError('Database marked as UNHEALTHY after 3 consecutive failures');
            }
        }
        if (this.currentMetrics) {
            if (this.currentMetrics.utilizationPercent >=
                this.CRITICAL_UTILIZATION_THRESHOLD * 100) {
                issues.push('Connection pool near exhaustion');
            }
            if (this.currentMetrics.waiting > this.HIGH_WAIT_THRESHOLD) {
                issues.push('High connection wait queue');
            }
        }
        this.healthStatus.lastCheckTime = new Date();
        this.healthStatus.issues = issues;
        return this.healthStatus;
    }
    getMetrics() {
        return this.currentMetrics;
    }
    getHealthStatus() {
        return { ...this.healthStatus };
    }
    getPrometheusMetrics() {
        if (!this.currentMetrics) {
            return '';
        }
        const { active, idle, waiting, total, max, utilizationPercent } = this.currentMetrics;
        return `
# HELP db_pool_active_connections Number of active database connections
# TYPE db_pool_active_connections gauge
db_pool_active_connections ${active}

# HELP db_pool_idle_connections Number of idle database connections
# TYPE db_pool_idle_connections gauge
db_pool_idle_connections ${idle}

# HELP db_pool_waiting_requests Number of requests waiting for connections
# TYPE db_pool_waiting_requests gauge
db_pool_waiting_requests ${waiting}

# HELP db_pool_total_connections Total number of database connections
# TYPE db_pool_total_connections gauge
db_pool_total_connections ${total}

# HELP db_pool_max_connections Maximum number of database connections
# TYPE db_pool_max_connections gauge
db_pool_max_connections ${max}

# HELP db_pool_utilization_percent Connection pool utilization percentage
# TYPE db_pool_utilization_percent gauge
db_pool_utilization_percent ${utilizationPercent}

# HELP db_health_status Database health status (1 = healthy, 0 = unhealthy)
# TYPE db_health_status gauge
db_health_status ${this.healthStatus.isHealthy ? 1 : 0}

# HELP db_health_consecutive_failures Number of consecutive health check failures
# TYPE db_health_consecutive_failures gauge
db_health_consecutive_failures ${this.healthStatus.consecutiveFailures}
    `.trim();
    }
    getEmptyMetrics() {
        return {
            active: 0,
            idle: 0,
            waiting: 0,
            total: 0,
            max: 0,
            utilizationPercent: 0,
            timestamp: new Date(),
        };
    }
    async forceMetricsCollection() {
        const metrics = await this.collectMetrics();
        this.analyzeMetrics();
        return metrics;
    }
    async forceHealthCheck() {
        return await this.performHealthCheck();
    }
};
exports.ConnectionMonitorService = ConnectionMonitorService;
exports.ConnectionMonitorService = ConnectionMonitorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __param(1, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        sequelize_typescript_1.Sequelize])
], ConnectionMonitorService);
//# sourceMappingURL=connection-monitor.service.js.map