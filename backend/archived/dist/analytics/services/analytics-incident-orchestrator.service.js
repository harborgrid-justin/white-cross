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
exports.AnalyticsIncidentOrchestratorService = void 0;
const common_1 = require("@nestjs/common");
const health_trend_analytics_service_1 = require("./health-trend-analytics.service");
const time_period_enum_1 = require("../enums/time-period.enum");
const base_1 = require("../../common/base");
let AnalyticsIncidentOrchestratorService = class AnalyticsIncidentOrchestratorService extends base_1.BaseService {
    healthTrendService;
    constructor(healthTrendService) {
        super("AnalyticsIncidentOrchestratorService");
        this.healthTrendService = healthTrendService;
    }
    async getIncidentTrends(query) {
        try {
            const schoolId = query.schoolId || 'default-school';
            const incidentAnalytics = await this.healthTrendService.getIncidentAnalytics(schoolId, time_period_enum_1.TimePeriod.LAST_90_DAYS);
            return {
                trends: incidentAnalytics.trends,
                byType: incidentAnalytics.byType,
                byTimeOfDay: incidentAnalytics.byTimeOfDay,
                period: {
                    startDate: query.startDate,
                    endDate: query.endDate,
                },
                filters: {
                    incidentType: query.incidentType,
                    severity: query.severity,
                    groupBy: query.groupBy || 'TYPE',
                },
            };
        }
        catch (error) {
            this.logError('Error getting incident trends', error);
            throw error;
        }
    }
    async getIncidentsByLocation(query) {
        try {
            const schoolId = query.schoolId || 'default-school';
            const incidentAnalytics = await this.healthTrendService.getIncidentAnalytics(schoolId, time_period_enum_1.TimePeriod.LAST_90_DAYS);
            return {
                byLocation: incidentAnalytics.byLocation,
                period: {
                    startDate: query.startDate,
                    endDate: query.endDate,
                },
                location: query.location,
                heatMapIncluded: query.includeHeatMap || false,
            };
        }
        catch (error) {
            this.logError('Error getting incidents by location', error);
            throw error;
        }
    }
};
exports.AnalyticsIncidentOrchestratorService = AnalyticsIncidentOrchestratorService;
exports.AnalyticsIncidentOrchestratorService = AnalyticsIncidentOrchestratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [health_trend_analytics_service_1.HealthTrendAnalyticsService])
], AnalyticsIncidentOrchestratorService);
//# sourceMappingURL=analytics-incident-orchestrator.service.js.map