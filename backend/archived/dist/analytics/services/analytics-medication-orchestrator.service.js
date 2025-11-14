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
exports.AnalyticsMedicationOrchestratorService = void 0;
const common_1 = require("@nestjs/common");
const health_trend_analytics_service_1 = require("./health-trend-analytics.service");
const time_period_enum_1 = require("../enums/time-period.enum");
const base_1 = require("../../common/base");
let AnalyticsMedicationOrchestratorService = class AnalyticsMedicationOrchestratorService extends base_1.BaseService {
    healthTrendService;
    constructor(healthTrendService) {
        super("AnalyticsMedicationOrchestratorService");
        this.healthTrendService = healthTrendService;
    }
    async getMedicationUsage(query) {
        try {
            const schoolId = query.schoolId || 'default-school';
            const medicationTrends = await this.healthTrendService.getMedicationTrends(schoolId, time_period_enum_1.TimePeriod.LAST_30_DAYS);
            const summary = await this.healthTrendService.getPopulationSummary(schoolId, time_period_enum_1.TimePeriod.LAST_30_DAYS);
            return {
                usageChart: medicationTrends,
                topMedications: summary.topMedications,
                totalAdministrations: summary.totalMedicationAdministrations,
                period: {
                    startDate: query.startDate,
                    endDate: query.endDate,
                },
                filters: {
                    medicationName: query.medicationName,
                    category: query.category,
                    groupBy: query.groupBy || 'MEDICATION',
                },
                adherenceIncluded: query.includeAdherenceRate !== false,
            };
        }
        catch (error) {
            this.logError('Error getting medication usage', error);
            throw error;
        }
    }
    async getMedicationAdherence(query) {
        try {
            const schoolId = query.schoolId || 'default-school';
            const summary = await this.healthTrendService.getPopulationSummary(schoolId, time_period_enum_1.TimePeriod.LAST_30_DAYS);
            const threshold = query.threshold || 80;
            const adherenceData = summary.topMedications.map((med) => ({
                medicationName: med.medicationName,
                category: med.category,
                studentCount: med.studentCount,
                administrationCount: med.administrationCount,
                adherenceRate: 100 - med.sideEffectRate,
                isBelowThreshold: 100 - med.sideEffectRate < threshold,
                trend: med.trend,
            }));
            return {
                adherenceData,
                threshold,
                period: {
                    startDate: query.startDate,
                    endDate: query.endDate,
                },
                filters: {
                    studentId: query.studentId,
                    medicationId: query.medicationId,
                },
            };
        }
        catch (error) {
            this.logError('Error getting medication adherence', error);
            throw error;
        }
    }
};
exports.AnalyticsMedicationOrchestratorService = AnalyticsMedicationOrchestratorService;
exports.AnalyticsMedicationOrchestratorService = AnalyticsMedicationOrchestratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [health_trend_analytics_service_1.HealthTrendAnalyticsService])
], AnalyticsMedicationOrchestratorService);
//# sourceMappingURL=analytics-medication-orchestrator.service.js.map