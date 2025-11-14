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
exports.QueueMonitoringService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const base_1 = require("../../../common/base");
let QueueMonitoringService = class QueueMonitoringService extends base_1.BaseService {
    alertConfig = {
        maxFailureRate: 0.15,
        maxWaitingJobs: 1000,
        maxFailedJobs: 500,
        maxProcessingTimeMinutes: 30,
    };
    queueServices = [];
    lastHealthCheck = null;
    healthHistory = new Map();
    constructor() {
        super("QueueMonitoringService");
        this.logInfo('Queue Monitoring Service initialized');
    }
    registerQueueService(service) {
        this.queueServices.push(service);
        this.logInfo(`Queue service registered: ${service.constructor.name}`);
    }
    async getOverallHealth() {
        const allHealthChecks = [];
        for (const service of this.queueServices) {
            const metrics = await service.getQueueMetrics();
            for (const queueName of Object.keys(metrics.queues)) {
                const health = await service.getQueueHealth(queueName);
                allHealthChecks.push(health);
                this.recordHealthHistory(queueName, health);
            }
        }
        const healthyCount = allHealthChecks.filter((h) => h.status === 'healthy').length;
        const degradedCount = allHealthChecks.filter((h) => h.status === 'degraded').length;
        const unhealthyCount = allHealthChecks.filter((h) => h.status === 'unhealthy').length;
        let overallStatus = 'healthy';
        if (unhealthyCount > 0) {
            overallStatus = 'unhealthy';
        }
        else if (degradedCount > 0) {
            overallStatus = 'degraded';
        }
        this.lastHealthCheck = new Date();
        return {
            totalQueues: allHealthChecks.length,
            healthyQueues: healthyCount,
            degradedQueues: degradedCount,
            unhealthyQueues: unhealthyCount,
            overallStatus,
            checkedAt: this.lastHealthCheck,
        };
    }
    async getComprehensiveMetrics() {
        const serviceMetrics = {};
        let totalQueues = 0;
        const totalJobs = {
            waiting: 0,
            active: 0,
            completed: 0,
            failed: 0,
            delayed: 0,
            paused: 0,
        };
        for (const service of this.queueServices) {
            const metrics = await service.getQueueMetrics();
            serviceMetrics[service.constructor.name] = metrics;
            totalQueues += Object.keys(metrics.queues).length;
            totalJobs.waiting += metrics.totals.waiting;
            totalJobs.active += metrics.totals.active;
            totalJobs.completed += metrics.totals.completed;
            totalJobs.failed += metrics.totals.failed;
            totalJobs.delayed += metrics.totals.delayed;
            totalJobs.paused += metrics.totals.paused;
        }
        const totalProcessed = totalJobs.completed + totalJobs.failed;
        const averageFailureRate = totalProcessed > 0 ? totalJobs.failed / totalProcessed : 0;
        return {
            services: serviceMetrics,
            summary: {
                totalJobs,
                averageFailureRate,
                servicesCount: this.queueServices.length,
                queuesCount: totalQueues,
            },
            timestamp: new Date(),
        };
    }
    async getAllFailedJobs(limit = 500) {
        const allFailedJobs = [];
        for (const service of this.queueServices) {
            const metrics = await service.getQueueMetrics();
            for (const queueName of Object.keys(metrics.queues)) {
                const failedJobs = await service.getFailedJobs(queueName, Math.min(limit, 100));
                allFailedJobs.push(...failedJobs);
            }
        }
        return allFailedJobs
            .sort((a, b) => b.failedAt.getTime() - a.failedAt.getTime())
            .slice(0, limit);
    }
    getHealthHistory(queueName, limit = 100) {
        const history = this.healthHistory.get(queueName) || [];
        return history.slice(-limit);
    }
    async checkAlerts() {
        const alerts = [];
        for (const service of this.queueServices) {
            const metrics = await service.getQueueMetrics();
            const serviceName = service.constructor.name;
            for (const [queueName, stats] of Object.entries(metrics.queues)) {
                const queueNameTyped = queueName;
                const health = await service.getQueueHealth(queueNameTyped);
                if (health.failureRate > this.alertConfig.maxFailureRate) {
                    alerts.push({
                        type: 'high_failure_rate',
                        queueName: queueNameTyped,
                        serviceName,
                        message: `High failure rate: ${(health.failureRate * 100).toFixed(1)}%`,
                        severity: health.failureRate > 0.3 ? 'critical' : 'warning',
                        value: health.failureRate,
                        threshold: this.alertConfig.maxFailureRate,
                    });
                }
                if (stats.waiting > this.alertConfig.maxWaitingJobs) {
                    alerts.push({
                        type: 'too_many_waiting',
                        queueName: queueNameTyped,
                        serviceName,
                        message: `Too many waiting jobs: ${stats.waiting}`,
                        severity: stats.waiting > this.alertConfig.maxWaitingJobs * 2 ? 'critical' : 'warning',
                        value: stats.waiting,
                        threshold: this.alertConfig.maxWaitingJobs,
                    });
                }
                if (stats.failed > this.alertConfig.maxFailedJobs) {
                    alerts.push({
                        type: 'too_many_failed',
                        queueName: queueNameTyped,
                        serviceName,
                        message: `Too many failed jobs: ${stats.failed}`,
                        severity: stats.failed > this.alertConfig.maxFailedJobs * 2 ? 'critical' : 'warning',
                        value: stats.failed,
                        threshold: this.alertConfig.maxFailedJobs,
                    });
                }
                if (health.status === 'unhealthy') {
                    alerts.push({
                        type: 'queue_unhealthy',
                        queueName: queueNameTyped,
                        serviceName,
                        message: `Queue is unhealthy`,
                        severity: 'critical',
                        value: 1,
                        threshold: 0,
                    });
                }
            }
        }
        return {
            alerts,
            alertsTriggered: alerts.length > 0,
        };
    }
    async cleanAllQueues(grace = 86400000) {
        this.logInfo('Starting cleanup of all queues...');
        for (const service of this.queueServices) {
            const metrics = await service.getQueueMetrics();
            for (const queueName of Object.keys(metrics.queues)) {
                try {
                    await service.cleanQueue(queueName, grace);
                }
                catch (error) {
                    this.logError(`Failed to clean queue ${queueName}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
        }
        this.logInfo('Queue cleanup completed');
    }
    recordHealthHistory(queueName, health) {
        if (!this.healthHistory.has(queueName)) {
            this.healthHistory.set(queueName, []);
        }
        const history = this.healthHistory.get(queueName);
        history.push(health);
        if (history.length > 1000) {
            history.splice(0, history.length - 1000);
        }
    }
    async scheduledHealthCheck() {
        try {
            this.logDebug('Running scheduled health check...');
            const healthSummary = await this.getOverallHealth();
            const alerts = await this.checkAlerts();
            if (healthSummary.overallStatus !== 'healthy') {
                this.logWarning(`Queue health status: ${healthSummary.overallStatus} ` +
                    `(${healthSummary.unhealthyQueues} unhealthy, ${healthSummary.degradedQueues} degraded)`);
            }
            if (alerts.alertsTriggered) {
                this.logWarning(`${alerts.alerts.length} queue alerts triggered`);
                const criticalAlerts = alerts.alerts.filter((a) => a.severity === 'critical');
                if (criticalAlerts.length > 0) {
                    this.logError(`${criticalAlerts.length} critical queue alerts!`);
                }
            }
        }
        catch (error) {
            this.logError(`Scheduled health check failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async scheduledCleanup() {
        try {
            await this.cleanAllQueues();
        }
        catch (error) {
            this.logError(`Scheduled cleanup failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    getServiceInfo() {
        return {
            registeredServices: this.queueServices.map((s) => s.constructor.name),
            lastHealthCheck: this.lastHealthCheck,
            alertConfig: this.alertConfig,
        };
    }
};
exports.QueueMonitoringService = QueueMonitoringService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueueMonitoringService.prototype, "scheduledHealthCheck", null);
__decorate([
    (0, schedule_1.Cron)('0 2 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueueMonitoringService.prototype, "scheduledCleanup", null);
exports.QueueMonitoringService = QueueMonitoringService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], QueueMonitoringService);
//# sourceMappingURL=queue-monitoring.service.js.map