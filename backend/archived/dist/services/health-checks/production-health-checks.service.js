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
var HealthMonitoringService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthMonitoringService = exports.HealthController = exports.ProductionHealthCheckService = exports.ApplicationHealthIndicator = exports.ResourceHealthIndicator = exports.ExternalServiceHealthIndicator = exports.DatabaseHealthIndicator = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
let DatabaseHealthIndicator = class DatabaseHealthIndicator {
    lastHealthInfo = null;
    connectionStartTime = Date.now();
    async check(timeout = 5000) {
        const startTime = Date.now();
        const key = 'database';
        try {
            const healthInfo = await this.performDatabaseHealthCheck(timeout);
            this.lastHealthInfo = healthInfo;
            const responseTime = Date.now() - startTime;
            return {
                [key]: {
                    status: healthInfo.connected ? 'up' : 'down',
                    ...healthInfo,
                    responseTime,
                },
            };
        }
        catch (error) {
            this.logError('Database health check failed', error);
            return {
                [key]: {
                    status: 'down',
                    connected: false,
                    responseTime: Date.now() - startTime,
                    lastError: error instanceof Error ? error.message : 'Unknown error',
                    uptime: 0,
                },
            };
        }
    }
    async getDetailedHealthInfo() {
        if (!this.lastHealthInfo) {
            return await this.performDatabaseHealthCheck();
        }
        return this.lastHealthInfo;
    }
    async performDatabaseHealthCheck(timeout = 5000) {
        const startTime = Date.now();
        const connected = await this.checkDatabaseConnection(timeout);
        const responseTime = Date.now() - startTime;
        if (!connected) {
            throw new Error('Database connection failed');
        }
        const connectionStats = await this.getConnectionPoolStats();
        const queryStats = await this.getQueryStats();
        return {
            connected: true,
            responseTime,
            connectionCount: connectionStats.active,
            maxConnections: connectionStats.max,
            queryCount: queryStats.total,
            uptime: Date.now() - this.connectionStartTime,
        };
    }
    async checkDatabaseConnection(timeout) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(true), Math.random() * 100);
        });
    }
    async getConnectionPoolStats() {
        return {
            active: Math.floor(Math.random() * 10),
            max: 100,
        };
    }
    async getQueryStats() {
        return {
            total: Math.floor(Math.random() * 1000),
        };
    }
};
exports.DatabaseHealthIndicator = DatabaseHealthIndicator;
exports.DatabaseHealthIndicator = DatabaseHealthIndicator = __decorate([
    (0, common_1.Injectable)()
], DatabaseHealthIndicator);
let ExternalServiceHealthIndicator = class ExternalServiceHealthIndicator {
    serviceHealthCache = new Map();
    async checkServices(services, timeout = 5000) {
        const results = {};
        for (const service of services) {
            try {
                const healthInfo = await this.checkSingleService(service.name, service.url, service.timeout || timeout);
                this.serviceHealthCache.set(service.name, healthInfo);
                results[`service_${service.name}`] = {
                    status: healthInfo.status.toLowerCase(),
                    ...healthInfo,
                };
            }
            catch (error) {
                this.logError(`Health check failed for service ${service.name}`, error);
                const failedInfo = {
                    name: service.name,
                    url: service.url,
                    status: 'DOWN',
                    responseTime: timeout,
                    lastChecked: new Date(),
                    lastError: error instanceof Error ? error.message : 'Unknown error',
                    consecutiveFailures: this.incrementFailureCount(service.name),
                };
                this.serviceHealthCache.set(service.name, failedInfo);
                results[`service_${service.name}`] = {
                    status: 'down',
                    ...failedInfo,
                };
            }
        }
        return results;
    }
    getAllServiceHealth() {
        return Array.from(this.serviceHealthCache.values());
    }
    async checkSingleService(name, url, timeout) {
        const startTime = Date.now();
        try {
            const response = await this.performHttpCheck(url, timeout);
            const responseTime = Date.now() - startTime;
            const healthInfo = {
                name,
                url,
                status: response.ok ? 'UP' : 'DEGRADED',
                responseTime,
                lastChecked: new Date(),
                consecutiveFailures: 0,
            };
            return healthInfo;
        }
        catch (error) {
            const responseTime = Date.now() - startTime;
            throw new Error(`Service ${name} health check failed: ${error}`);
        }
    }
    async performHttpCheck(url, timeout) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve({ ok: true });
                }
                else {
                    reject(new Error('Service unavailable'));
                }
            }, Math.random() * 200);
        });
    }
    incrementFailureCount(serviceName) {
        const cached = this.serviceHealthCache.get(serviceName);
        return cached ? cached.consecutiveFailures + 1 : 1;
    }
};
exports.ExternalServiceHealthIndicator = ExternalServiceHealthIndicator;
exports.ExternalServiceHealthIndicator = ExternalServiceHealthIndicator = __decorate([
    (0, common_1.Injectable)()
], ExternalServiceHealthIndicator);
let ResourceHealthIndicator = class ResourceHealthIndicator {
    async check(thresholds) {
        const defaultThresholds = {
            cpu: 80,
            memory: 90,
            disk: 85,
            ...thresholds,
        };
        const resourceInfo = await this.getResourceInfo();
        const issues = [];
        if (resourceInfo.cpu.usage > defaultThresholds.cpu) {
            issues.push(`High CPU usage: ${resourceInfo.cpu.usage}%`);
        }
        if (resourceInfo.memory.usage > defaultThresholds.memory) {
            issues.push(`High memory usage: ${resourceInfo.memory.usage}%`);
        }
        if (resourceInfo.disk.usage > defaultThresholds.disk) {
            issues.push(`High disk usage: ${resourceInfo.disk.usage}%`);
        }
        const status = issues.length === 0 ? 'up' : 'down';
        return {
            resources: {
                status,
                ...resourceInfo,
                issues,
                thresholds: defaultThresholds,
            },
        };
    }
    async getResourceInfo() {
        const cpuInfo = this.getCpuInfo();
        const memoryInfo = this.getMemoryInfo();
        const diskInfo = await this.getDiskInfo();
        const networkInfo = this.getNetworkInfo();
        return {
            cpu: cpuInfo,
            memory: memoryInfo,
            disk: diskInfo,
            network: networkInfo,
        };
    }
    getCpuInfo() {
        const usage = Math.random() * 100;
        const load = [Math.random(), Math.random(), Math.random()];
        return {
            usage: Math.round(usage * 100) / 100,
            load,
            cores: 4,
        };
    }
    getMemoryInfo() {
        const total = 8 * 1024 * 1024 * 1024;
        const used = Math.random() * total;
        const usage = (used / total) * 100;
        const heapUsed = Math.random() * 100 * 1024 * 1024;
        const heapTotal = 200 * 1024 * 1024;
        return {
            used: Math.round(used),
            total,
            usage: Math.round(usage * 100) / 100,
            heap: {
                used: Math.round(heapUsed),
                total: heapTotal,
            },
        };
    }
    async getDiskInfo() {
        const total = 100 * 1024 * 1024 * 1024;
        const used = Math.random() * total;
        const usage = (used / total) * 100;
        return {
            used: Math.round(used),
            total,
            usage: Math.round(usage * 100) / 100,
            path: '/',
        };
    }
    getNetworkInfo() {
        return {
            connections: Math.floor(Math.random() * 100),
            bytesIn: Math.floor(Math.random() * 1024 * 1024),
            bytesOut: Math.floor(Math.random() * 1024 * 1024),
        };
    }
};
exports.ResourceHealthIndicator = ResourceHealthIndicator;
exports.ResourceHealthIndicator = ResourceHealthIndicator = __decorate([
    (0, common_1.Injectable)()
], ResourceHealthIndicator);
let ApplicationHealthIndicator = class ApplicationHealthIndicator {
    startTime = new Date();
    async check() {
        const applicationInfo = this.getApplicationInfo();
        const issues = await this.checkApplicationIssues();
        const status = issues.length === 0 ? 'up' : 'down';
        return {
            application: {
                status,
                ...applicationInfo,
                issues,
            },
        };
    }
    getApplicationInfo() {
        return {
            version: process.env.APP_VERSION || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            startTime: this.startTime,
            uptime: Date.now() - this.startTime.getTime(),
            nodeVersion: process.version,
            pid: process.pid,
            instanceId: process.env.INSTANCE_ID || 'unknown',
        };
    }
    async checkApplicationIssues() {
        const issues = [];
        if (!process.env.NODE_ENV) {
            issues.push('NODE_ENV not set');
        }
        const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
        for (const envVar of requiredEnvVars) {
            if (!process.env[envVar]) {
                issues.push(`Missing required environment variable: ${envVar}`);
            }
        }
        const nodeVersion = process.version;
        if (nodeVersion < 'v18.0.0') {
            issues.push(`Node.js version ${nodeVersion} is below recommended minimum v18.0.0`);
        }
        const memoryUsage = process.memoryUsage();
        const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
        if (heapUsedMB > 500) {
            issues.push(`High heap usage detected: ${heapUsedMB.toFixed(2)}MB`);
        }
        return issues;
    }
};
exports.ApplicationHealthIndicator = ApplicationHealthIndicator;
exports.ApplicationHealthIndicator = ApplicationHealthIndicator = __decorate([
    (0, common_1.Injectable)()
], ApplicationHealthIndicator);
let ProductionHealthCheckService = class ProductionHealthCheckService extends base_1.BaseService {
    healthCheckService;
    databaseHealth;
    externalServiceHealth;
    resourceHealth;
    applicationHealth;
    memoryHealth;
    diskHealth;
    healthHistory = [];
    maxHistorySize = 100;
    isShuttingDown = false;
    constructor(logger, healthCheckService, databaseHealth, externalServiceHealth, resourceHealth, applicationHealth, memoryHealth, diskHealth) {
        super({
            serviceName: 'ProductionHealthCheckService',
            logger,
            enableAuditLogging: true,
        });
        this.healthCheckService = healthCheckService;
        this.databaseHealth = databaseHealth;
        this.externalServiceHealth = externalServiceHealth;
        this.resourceHealth = resourceHealth;
        this.applicationHealth = applicationHealth;
        this.memoryHealth = memoryHealth;
        this.diskHealth = diskHealth;
    }
    async performHealthCheck(config) {
        const startTime = Date.now();
        const defaultConfig = {
            timeout: 10000,
            retries: 3,
            interval: 30000,
            gracefulShutdownTimeout: 30000,
            ...config,
        };
        try {
            const [databaseResult, externalServicesResult, resourceResult, applicationResult, memoryResult, diskResult,] = await Promise.allSettled([
                this.checkDatabaseHealth(defaultConfig.timeout),
                this.checkExternalServicesHealth(defaultConfig.timeout),
                this.checkResourceHealth(),
                this.checkApplicationHealth(),
                this.checkMemoryHealth(),
                this.checkDiskHealth(),
            ]);
            const duration = Date.now() - startTime;
            const checks = [];
            const issues = [];
            const recommendations = [];
            const databaseHealth = this.processHealthResult(databaseResult, 'database');
            if (databaseHealth) {
                checks.push(databaseHealth);
                if (databaseHealth.database?.status !== 'up') {
                    issues.push('Database connectivity issues detected');
                    recommendations.push('Check database server status and network connectivity');
                }
            }
            const externalServicesHealth = this.processHealthResult(externalServicesResult, 'external_services');
            if (externalServicesHealth) {
                checks.push(externalServicesHealth);
            }
            const resourceHealthResult = this.processHealthResult(resourceResult, 'resources');
            if (resourceHealthResult) {
                checks.push(resourceHealthResult);
                if (resourceHealthResult.resources?.status !== 'up') {
                    issues.push('Resource utilization is above recommended thresholds');
                    recommendations.push('Consider scaling resources or optimizing application performance');
                }
            }
            const applicationHealthResult = this.processHealthResult(applicationResult, 'application');
            if (applicationHealthResult) {
                checks.push(applicationHealthResult);
                if (applicationHealthResult.application?.status !== 'up') {
                    issues.push('Application configuration issues detected');
                    recommendations.push('Review application configuration and environment variables');
                }
            }
            const memoryHealthResult = this.processHealthResult(memoryResult, 'memory');
            if (memoryHealthResult) {
                checks.push(memoryHealthResult);
            }
            const diskHealthResult = this.processHealthResult(diskResult, 'disk');
            if (diskHealthResult) {
                checks.push(diskHealthResult);
            }
            const overallStatus = this.determineOverallStatus(checks);
            const healthStatus = {
                status: overallStatus,
                timestamp: new Date(),
                duration,
                application: this.applicationHealth.getApplicationInfo(),
                database: await this.databaseHealth.getDetailedHealthInfo(),
                externalServices: this.externalServiceHealth.getAllServiceHealth(),
                resources: await this.resourceHealth.getResourceInfo(),
                checks,
                issues,
                recommendations,
            };
            this.addToHistory(healthStatus);
            return healthStatus;
        }
        catch (error) {
            this.logError('Health check failed', error);
            const errorStatus = {
                status: 'DOWN',
                timestamp: new Date(),
                duration: Date.now() - startTime,
                application: this.applicationHealth.getApplicationInfo(),
                database: { connected: false, responseTime: 0, connectionCount: 0, maxConnections: 0, queryCount: 0, uptime: 0 },
                externalServices: [],
                resources: {
                    cpu: { usage: 0, load: [], cores: 0 },
                    memory: { used: 0, total: 0, usage: 0, heap: { used: 0, total: 0 } },
                    disk: { used: 0, total: 0, usage: 0, path: '' },
                    network: { connections: 0, bytesIn: 0, bytesOut: 0 },
                },
                checks: [],
                issues: [error instanceof Error ? error.message : 'Unknown health check error'],
                recommendations: ['Check application logs and restart service if necessary'],
            };
            this.addToHistory(errorStatus);
            return errorStatus;
        }
    }
    getHealthMetrics() {
        if (this.healthHistory.length === 0) {
            return {
                totalChecks: 0,
                successfulChecks: 0,
                failedChecks: 0,
                averageResponseTime: 0,
                uptime: 0,
                availability: 0,
            };
        }
        const totalChecks = this.healthHistory.length;
        const successfulChecks = this.healthHistory.filter(h => h.status === 'UP').length;
        const failedChecks = totalChecks - successfulChecks;
        const averageResponseTime = this.healthHistory.reduce((sum, h) => sum + h.duration, 0) / totalChecks;
        const availability = (successfulChecks / totalChecks) * 100;
        const appInfo = this.applicationHealth.getApplicationInfo();
        const uptime = appInfo.uptime;
        return {
            totalChecks,
            successfulChecks,
            failedChecks,
            averageResponseTime: Math.round(averageResponseTime),
            uptime,
            availability: Math.round(availability * 100) / 100,
        };
    }
    getHealthHistory() {
        return [...this.healthHistory];
    }
    async gracefulShutdown(timeout = 30000) {
        this.logInfo('Initiating graceful shutdown...');
        this.isShuttingDown = true;
        const startTime = Date.now();
        try {
            const finalHealth = await this.performHealthCheck();
            this.logInfo('Final health check completed', { status: finalHealth.status });
            await this.waitForOngoingRequests(timeout);
            await this.closeConnections();
            const shutdownDuration = Date.now() - startTime;
            this.logInfo(`Graceful shutdown completed in ${shutdownDuration}ms`);
        }
        catch (error) {
            this.logError('Error during graceful shutdown', error);
            throw error;
        }
    }
    async isReady() {
        try {
            const health = await this.performHealthCheck({ timeout: 5000 });
            return health.status !== 'DOWN';
        }
        catch (error) {
            this.logError('Readiness check failed', error);
            return false;
        }
    }
    async isAlive() {
        if (this.isShuttingDown) {
            return false;
        }
        try {
            const basicChecks = await Promise.allSettled([
                this.applicationHealth.check(),
                this.memoryHealth.checkHeap('memory', 150 * 1024 * 1024),
            ]);
            return basicChecks.every(result => result.status === 'fulfilled');
        }
        catch (error) {
            this.logError('Liveness check failed', error);
            return false;
        }
    }
    async checkDatabaseHealth(timeout) {
        return this.databaseHealth.check(timeout);
    }
    async checkExternalServicesHealth(timeout) {
        const services = [
            { name: 'auth_service', url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001/health' },
            { name: 'notification_service', url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3002/health' },
        ];
        return this.externalServiceHealth.checkServices(services, timeout);
    }
    async checkResourceHealth() {
        return this.resourceHealth.check();
    }
    async checkApplicationHealth() {
        return this.applicationHealth.check();
    }
    async checkMemoryHealth() {
        return this.memoryHealth.checkHeap('memory', 150 * 1024 * 1024);
    }
    async checkDiskHealth() {
        return this.diskHealth.checkStorage('disk', { threshold: 0.85, path: '/' });
    }
    processHealthResult(result, category) {
        if (result.status === 'fulfilled') {
            return result.value;
        }
        else {
            this.logError(`Health check failed for ${category}`, result.reason);
            return {
                [category]: {
                    status: 'down',
                    error: result.reason instanceof Error ? result.reason.message : 'Unknown error',
                },
            };
        }
    }
    determineOverallStatus(checks) {
        if (checks.length === 0) {
            return 'DOWN';
        }
        let upCount = 0;
        let downCount = 0;
        for (const check of checks) {
            for (const [key, value] of Object.entries(check)) {
                if (value.status === 'up') {
                    upCount++;
                }
                else if (value.status === 'down') {
                    downCount++;
                }
            }
        }
        if (downCount === 0) {
            return 'UP';
        }
        else if (upCount > downCount) {
            return 'DEGRADED';
        }
        else {
            return 'DOWN';
        }
    }
    addToHistory(healthStatus) {
        this.healthHistory.push(healthStatus);
        if (this.healthHistory.length > this.maxHistorySize) {
            this.healthHistory.shift();
        }
    }
    async waitForOngoingRequests(timeout) {
        return new Promise((resolve) => {
            setTimeout(resolve, Math.min(timeout, 5000));
        });
    }
    async closeConnections() {
        this.logInfo('Closing database connections...');
    }
};
exports.ProductionHealthCheckService = ProductionHealthCheckService;
exports.ProductionHealthCheckService = ProductionHealthCheckService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        terminus_1.HealthCheckService,
        DatabaseHealthIndicator,
        ExternalServiceHealthIndicator,
        ResourceHealthIndicator,
        ApplicationHealthIndicator,
        terminus_1.MemoryHealthIndicator,
        terminus_1.DiskHealthIndicator])
], ProductionHealthCheckService);
let HealthController = class HealthController extends base_1.BaseController {
    healthCheckService;
    constructor(logger, healthCheckService) {
        super();
        this.healthCheckService = healthCheckService;
    }
    async check() {
        try {
            return await this.healthCheckService.performHealthCheck();
        }
        catch (error) {
            this.logError('Health check endpoint failed', error);
            throw new common_1.HttpException('Health check failed', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    async liveness() {
        const isAlive = await this.healthCheckService.isAlive();
        if (!isAlive) {
            throw new common_1.HttpException('Service is not alive', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        return { status: 'alive' };
    }
    async readiness() {
        const isReady = await this.healthCheckService.isReady();
        if (!isReady) {
            throw new common_1.HttpException('Service is not ready', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        return { status: 'ready' };
    }
    async metrics() {
        return this.healthCheckService.getHealthMetrics();
    }
    async history() {
        return this.healthCheckService.getHealthHistory();
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, terminus_1.HealthCheck)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('live'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "liveness", null);
__decorate([
    (0, common_1.Get)('ready'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "readiness", null);
__decorate([
    (0, common_1.Get)('metrics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "metrics", null);
__decorate([
    (0, common_1.Get)('history'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "history", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health'),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        ProductionHealthCheckService])
], HealthController);
let HealthMonitoringService = HealthMonitoringService_1 = class HealthMonitoringService {
    healthCheckService;
    logger = new common_1.Logger(HealthMonitoringService_1.name);
    monitoringInterval = null;
    alertThresholds = {
        consecutiveFailures: 3,
        responseTimeMs: 10000,
        availabilityPercent: 95,
    };
    constructor(logger, healthCheckService) {
        super({
            serviceName: 'ExternalService',
            logger,
            enableAuditLogging: true,
        });
        this.healthCheckService = healthCheckService;
    }
    startMonitoring(intervalMs = 30000) {
        if (this.monitoringInterval) {
            this.stopMonitoring();
        }
        this.logInfo(`Starting health monitoring with ${intervalMs}ms interval`);
        this.monitoringInterval = setInterval(async () => {
            await this.performMonitoringCheck();
        }, intervalMs);
    }
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
            this.logInfo('Health monitoring stopped');
        }
    }
    setAlertThresholds(thresholds) {
        this.alertThresholds = { ...this.alertThresholds, ...thresholds };
        this.logInfo('Alert thresholds updated', this.alertThresholds);
    }
    async performMonitoringCheck() {
        try {
            const health = await this.healthCheckService.performHealthCheck();
            const metrics = this.healthCheckService.getHealthMetrics();
            await this.checkAlertConditions(health, metrics);
            this.logDebug('Health monitoring check completed', {
                status: health.status,
                duration: health.duration,
                issues: health.issues.length,
            });
        }
        catch (error) {
            this.logError('Health monitoring check failed', error);
            await this.sendAlert('CRITICAL', 'Health monitoring check failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    async checkAlertConditions(health, metrics) {
        if (health.status === 'DOWN') {
            await this.sendAlert('CRITICAL', 'Service is DOWN', {
                issues: health.issues,
                duration: health.duration,
            });
        }
        else if (health.status === 'DEGRADED') {
            await this.sendAlert('WARNING', 'Service is DEGRADED', {
                issues: health.issues,
                duration: health.duration,
            });
        }
        if (health.duration > this.alertThresholds.responseTimeMs) {
            await this.sendAlert('WARNING', 'High response time detected', {
                responseTime: health.duration,
                threshold: this.alertThresholds.responseTimeMs,
            });
        }
        if (metrics.availability < this.alertThresholds.availabilityPercent) {
            await this.sendAlert('WARNING', 'Low availability detected', {
                availability: metrics.availability,
                threshold: this.alertThresholds.availabilityPercent,
            });
        }
        const recentHistory = this.healthCheckService.getHealthHistory().slice(-this.alertThresholds.consecutiveFailures);
        if (recentHistory.length === this.alertThresholds.consecutiveFailures &&
            recentHistory.every(h => h.status !== 'UP')) {
            await this.sendAlert('CRITICAL', 'Multiple consecutive health check failures', {
                consecutiveFailures: this.alertThresholds.consecutiveFailures,
                recentStatuses: recentHistory.map(h => h.status),
            });
        }
    }
    async sendAlert(level, message, metadata) {
        this.logWarning(`[${level}] HEALTH ALERT: ${message}`, metadata);
    }
};
exports.HealthMonitoringService = HealthMonitoringService;
exports.HealthMonitoringService = HealthMonitoringService = HealthMonitoringService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        ProductionHealthCheckService])
], HealthMonitoringService);
//# sourceMappingURL=production-health-checks.service.js.map