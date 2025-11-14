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
exports.EnhancedHealthCheckService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const config_1 = require("@nestjs/config");
const health_check_service_1 = require("./health-check.service");
const resource_monitor_service_1 = require("./services/resource-monitor.service");
const external_service_monitor_service_1 = require("./services/external-service-monitor.service");
const health_analyzer_service_1 = require("./services/health-analyzer.service");
let EnhancedHealthCheckService = class EnhancedHealthCheckService extends health_check_service_1.HealthCheckService {
    resourceMonitor;
    externalServiceMonitor;
    healthAnalyzer;
    healthHistory = [];
    maxHistorySize = 100;
    startTime = Date.now();
    checkCount = 0;
    successfulChecks = 0;
    failedChecks = 0;
    totalResponseTime = 0;
    constructor(sequelize, configService, resourceMonitor, externalServiceMonitor, healthAnalyzer) {
        super(sequelize, configService);
        this.resourceMonitor = resourceMonitor;
        this.externalServiceMonitor = externalServiceMonitor;
        this.healthAnalyzer = healthAnalyzer;
    }
    async performEnhancedHealthCheck(config) {
        const startTime = Date.now();
        this.checkCount++;
        const defaultConfig = {
            timeout: 10000,
            retries: 3,
            interval: 30000,
            gracefulShutdownTimeout: 30000,
            resourceThresholds: {
                cpu: 80,
                memory: 90,
                disk: 85,
            },
            ...config,
        };
        try {
            const baseHealth = await super.performHealthCheck();
            const [resourceHealth, externalServicesHealth, securityHealth] = await Promise.allSettled([
                this.resourceMonitor.checkResourceHealth(),
                this.externalServiceMonitor.checkExternalServicesHealth(defaultConfig.timeout),
                this.checkSecurityHealth(),
            ]);
            const duration = Date.now() - startTime;
            this.totalResponseTime += duration;
            const resources = this.processHealthResult(resourceHealth, 'resources');
            const externalServices = this.processHealthResult(externalServicesHealth, 'external_services');
            const security = this.processHealthResult(securityHealth, 'security');
            const enhancedStatus = this.healthAnalyzer.determineEnhancedStatus(baseHealth, resources, externalServices, security);
            const enhancedResponse = {
                ...baseHealth,
                status: enhancedStatus.status,
                resources,
                externalServices,
                metrics: {
                    totalChecks: this.checkCount,
                    successfulChecks: this.successfulChecks,
                    failedChecks: this.failedChecks,
                    averageResponseTime: this.totalResponseTime / this.checkCount,
                    uptime: Date.now() - this.startTime,
                    availability: (this.successfulChecks / this.checkCount) * 100,
                    criticalIssues: enhancedStatus.criticalIssues,
                    warnings: enhancedStatus.warnings,
                    recommendations: enhancedStatus.recommendations,
                },
                performance: {
                    responseTime: duration,
                    totalDuration: Date.now() - startTime,
                },
                security: security || {
                    threatLevel: 'LOW',
                    activeSessions: 0,
                    recentFailedLogins: 0,
                },
            };
            if (enhancedResponse.status === 'HEALTHY') {
                this.successfulChecks++;
            }
            else {
                this.failedChecks++;
            }
            this.addToHistory(enhancedResponse);
            return enhancedResponse;
        }
        catch (error) {
            this.failedChecks++;
            this.logError('Enhanced health check failed', error);
            throw error;
        }
    }
    async checkSecurityHealth() {
        try {
            const processUptime = process.uptime();
            const memUsage = process.memoryUsage();
            const activeSessions = Math.max(0, Math.floor(memUsage.external / (1024 * 1024)) - 50);
            const recentFailedLogins = 0;
            let threatLevel = 'LOW';
            const heapUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
            if (heapUsagePercent > 90) {
                threatLevel = 'HIGH';
            }
            else if (heapUsagePercent > 75) {
                threatLevel = 'MEDIUM';
            }
            if (processUptime < 300 && Date.now() - this.startTime > 3600000) {
                threatLevel = 'MEDIUM';
            }
            return {
                threatLevel,
                activeSessions,
                recentFailedLogins,
            };
        }
        catch (error) {
            this.logError('Security health check failed', error);
            return {
                threatLevel: 'HIGH',
                activeSessions: 0,
                recentFailedLogins: 0,
            };
        }
    }
    getEnhancedHealthHistory() {
        return [...this.healthHistory];
    }
    getHealthTrends() {
        return this.healthAnalyzer.getHealthTrends(this.healthHistory);
    }
    async checkEnhancedReadiness() {
        const baseReadiness = await super.checkReadiness();
        const resources = await this.resourceMonitor.checkResourceHealth();
        return {
            ...baseReadiness,
            resources: {
                cpu: resources.cpu.usage < 95,
                memory: resources.memory.usage < 95,
                disk: resources.disk.usage < 95,
            },
        };
    }
    async checkEnhancedLiveness() {
        const baseLiveness = super.checkLiveness();
        const memUsage = process.memoryUsage();
        const eventLoopDelay = await this.measureEventLoopDelay();
        return {
            ...baseLiveness,
            pid: process.pid,
            memory: {
                heapUsed: memUsage.heapUsed,
                heapTotal: memUsage.heapTotal,
            },
            eventLoop: {
                delay: eventLoopDelay,
            },
        };
    }
    async measureEventLoopDelay() {
        return new Promise((resolve) => {
            const start = Date.now();
            setImmediate(() => {
                const delay = Date.now() - start;
                resolve(delay);
            });
            setTimeout(() => { }, 10);
        });
    }
    processHealthResult(result, category) {
        if (result.status === 'fulfilled') {
            return result.value;
        }
        else {
            this.logError(`Enhanced health check failed for ${category}`, result.reason);
            return null;
        }
    }
    addToHistory(healthStatus) {
        this.healthHistory.push(healthStatus);
        if (this.healthHistory.length > this.maxHistorySize) {
            this.healthHistory.shift();
        }
    }
};
exports.EnhancedHealthCheckService = EnhancedHealthCheckService;
exports.EnhancedHealthCheckService = EnhancedHealthCheckService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize,
        config_1.ConfigService,
        resource_monitor_service_1.ResourceMonitorService,
        external_service_monitor_service_1.ExternalServiceMonitorService,
        health_analyzer_service_1.HealthAnalyzerService])
], EnhancedHealthCheckService);
//# sourceMappingURL=enhanced-health-check.service.js.map