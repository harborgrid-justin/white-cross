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
exports.AnalyticsDashboardService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const metrics_service_1 = require("./services/analytics/metrics.service");
const statistics_service_1 = require("./services/analytics/statistics.service");
const compliance_service_1 = require("./services/analytics/compliance.service");
const export_service_1 = require("./services/analytics/export.service");
const base_1 = require("../common/base");
let AnalyticsDashboardService = class AnalyticsDashboardService extends base_1.BaseService {
    eventEmitter;
    metricsService;
    statisticsService;
    complianceService;
    exportService;
    constructor(eventEmitter, metricsService, statisticsService, complianceService, exportService) {
        super('AnalyticsDashboardService');
        this.eventEmitter = eventEmitter;
        this.metricsService = metricsService;
        this.statisticsService = statisticsService;
        this.complianceService = complianceService;
        this.exportService = exportService;
    }
    async getRealtimeMetrics() {
        return this.metricsService.getRealtimeMetrics();
    }
    async getHealthTrends(period) {
        return this.metricsService.getHealthTrends(period);
    }
    async getAppointmentStatistics(period) {
        return this.statisticsService.getAppointmentStatistics(period);
    }
    async getMedicationStatistics(period) {
        return this.statisticsService.getMedicationStatistics(period);
    }
    async getIncidentStatistics(period) {
        return this.statisticsService.getIncidentStatistics(period);
    }
    async getComplianceMetrics() {
        return this.complianceService.getComplianceMetrics();
    }
    async exportDashboardData(period, format) {
        return this.exportService.exportDashboardData(period, format);
    }
};
exports.AnalyticsDashboardService = AnalyticsDashboardService;
exports.AnalyticsDashboardService = AnalyticsDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2,
        metrics_service_1.MetricsService,
        statistics_service_1.StatisticsService,
        compliance_service_1.ComplianceService,
        export_service_1.ExportService])
], AnalyticsDashboardService);
//# sourceMappingURL=analytics-dashboard.service.js.map