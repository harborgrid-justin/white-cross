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
exports.ResourceOptimizationService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const event_emitter_1 = require("@nestjs/event-emitter");
const resource_metrics_collector_service_1 = require("./resource-metrics-collector.service");
const resource_monitor_service_1 = require("./resource-monitor.service");
const resource_optimization_engine_service_1 = require("./resource-optimization-engine.service");
const resource_reporter_service_1 = require("./resource-reporter.service");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
let ResourceOptimizationService = class ResourceOptimizationService extends base_1.BaseService {
    metricsCollector;
    resourceMonitor;
    optimizationEngine;
    resourceReporter;
    eventEmitter;
    resourceHistory = [];
    alerts = new Map();
    recommendations = new Map();
    optimizationPlans = new Map();
    predictiveModels = new Map();
    constructor(logger, metricsCollector, resourceMonitor, optimizationEngine, resourceReporter, eventEmitter) {
        super({
            serviceName: 'ResourceOptimizationService',
            logger,
            enableAuditLogging: true,
        });
        this.metricsCollector = metricsCollector;
        this.resourceMonitor = resourceMonitor;
        this.optimizationEngine = optimizationEngine;
        this.resourceReporter = resourceReporter;
        this.eventEmitter = eventEmitter;
    }
    async getCurrentResourceMetrics() {
        return this.metricsCollector.collectResourceMetrics();
    }
    getActiveAlerts() {
        return this.resourceMonitor.getActiveAlerts();
    }
    async generateResourceReport() {
        const currentMetrics = await this.getCurrentResourceMetrics();
        const activeAlerts = this.getActiveAlerts();
        const recommendations = this.optimizationEngine.getOptimizationRecommendations();
        return this.resourceReporter.generateResourceReport(currentMetrics, activeAlerts, recommendations, this.resourceHistory);
    }
    async executeOptimization(recommendationId) {
        return this.optimizationEngine.executeOptimization(recommendationId);
    }
    async analyzeForOptimizations() {
        const currentMetrics = await this.getCurrentResourceMetrics();
        return this.optimizationEngine.analyzeForOptimizations(currentMetrics, this.resourceHistory);
    }
    getOptimizationRecommendations() {
        return this.optimizationEngine.getOptimizationRecommendations();
    }
    async createOptimizationPlan(recommendations) {
        const plan = {
            planId: `plan-${Date.now()}`,
            name: 'Resource Optimization Plan',
            description: 'Automated resource optimization recommendations',
            targetResources: recommendations.map(r => r.type),
            recommendations,
            estimatedBenefits: {},
            implementationPhases: [],
            complianceImpact: {},
            createdAt: new Date(),
            status: 'PENDING'
        };
        this.optimizationPlans.set(plan.planId, plan);
        return plan;
    }
    getPredictiveInsights() {
        return [];
    }
    calculateResourceTrends() {
        return {};
    }
    async collectMetricsAndMonitor() {
        try {
            const metrics = await this.getCurrentResourceMetrics();
            this.resourceHistory.push(metrics);
            if (this.resourceHistory.length > 100) {
                this.resourceHistory = this.resourceHistory.slice(-100);
            }
            this.resourceMonitor.checkForAlerts(metrics);
        }
        catch (error) {
            this.logError('Failed to collect metrics and monitor', error);
        }
    }
    async analyzeAndOptimize() {
        try {
            const recommendations = await this.analyzeForOptimizations();
            if (recommendations.length > 0) {
                await this.createOptimizationPlan(recommendations);
            }
        }
        catch (error) {
            this.logError('Failed to analyze and optimize', error);
        }
    }
    async performMaintenance() {
        try {
            this.cleanupOldData();
        }
        catch (error) {
            this.logError('Failed to perform maintenance', error);
        }
    }
    cleanupOldData() {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        for (const [id, alert] of Array.from(this.alerts.entries())) {
            if (alert.timestamp < oneWeekAgo) {
                this.alerts.delete(id);
            }
        }
    }
    onModuleDestroy() {
        this.resourceHistory.length = 0;
        this.alerts.clear();
        this.recommendations.clear();
        this.optimizationPlans.clear();
        this.predictiveModels.clear();
        this.logInfo('Resource Optimization Service destroyed');
    }
};
exports.ResourceOptimizationService = ResourceOptimizationService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ResourceOptimizationService.prototype, "collectMetricsAndMonitor", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ResourceOptimizationService.prototype, "analyzeAndOptimize", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ResourceOptimizationService.prototype, "performMaintenance", null);
exports.ResourceOptimizationService = ResourceOptimizationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        resource_metrics_collector_service_1.ResourceMetricsCollector,
        resource_monitor_service_1.ResourceMonitor,
        resource_optimization_engine_service_1.ResourceOptimizationEngine,
        resource_reporter_service_1.ResourceReporter,
        event_emitter_1.EventEmitter2])
], ResourceOptimizationService);
//# sourceMappingURL=resource-optimization.service.js.map