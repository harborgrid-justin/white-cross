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
exports.HealthTrendAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const cache_manager_1 = require("@nestjs/cache-manager");
const time_period_enum_1 = require("../enums/time-period.enum");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const date_range_service_1 = require("./date-range.service");
const trend_calculation_service_1 = require("./trend-calculation.service");
const condition_analytics_service_1 = require("./condition-analytics.service");
const health_metrics_analyzer_service_1 = require("./health-metrics-analyzer.service");
const incident_analytics_service_1 = require("./incident-analytics.service");
const predictive_insights_service_1 = require("./predictive-insights.service");
const base_1 = require("../../common/base");
let HealthTrendAnalyticsService = class HealthTrendAnalyticsService extends base_1.BaseService {
    studentModel;
    healthRecordModel;
    cacheManager;
    dateRangeService;
    trendCalculationService;
    conditionAnalyticsService;
    healthMetricsAnalyzerService;
    incidentAnalyticsService;
    predictiveInsightsService;
    constructor(studentModel, healthRecordModel, cacheManager, dateRangeService, trendCalculationService, conditionAnalyticsService, healthMetricsAnalyzerService, incidentAnalyticsService, predictiveInsightsService) {
        super("HealthTrendAnalyticsService");
        this.studentModel = studentModel;
        this.healthRecordModel = healthRecordModel;
        this.cacheManager = cacheManager;
        this.dateRangeService = dateRangeService;
        this.trendCalculationService = trendCalculationService;
        this.conditionAnalyticsService = conditionAnalyticsService;
        this.healthMetricsAnalyzerService = healthMetricsAnalyzerService;
        this.incidentAnalyticsService = incidentAnalyticsService;
        this.predictiveInsightsService = predictiveInsightsService;
    }
    async getPopulationSummary(schoolId, period, customRange) {
        return this.healthMetricsAnalyzerService.getPopulationSummary(schoolId, period, customRange);
    }
    async getConditionTrends(schoolId, conditions, period = time_period_enum_1.TimePeriod.LAST_90_DAYS) {
        try {
            const dateRange = this.dateRangeService.getDateRange(period);
            const { start, end } = dateRange;
            const healthRecords = await this.healthRecordModel.findAll({
                where: {
                    recordDate: { [sequelize_2.Op.between]: [start, end] },
                },
                order: [['recordDate', 'ASC']],
            });
            const conditionDataMap = new Map();
            for (const record of healthRecords) {
                if (!record.diagnosis)
                    continue;
                const condition = this.conditionAnalyticsService.normalizeCondition(record.diagnosis);
                if (conditions &&
                    conditions.length > 0 &&
                    !conditions.includes(condition)) {
                    continue;
                }
                const dateKey = record.recordDate.toISOString().split('T')[0];
                if (!conditionDataMap.has(condition)) {
                    conditionDataMap.set(condition, new Map());
                }
                const dateMap = conditionDataMap.get(condition);
                dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
            }
            const datasets = Array.from(conditionDataMap.entries())
                .slice(0, 5)
                .map(([condition, dateMap]) => {
                const data = [];
                const dates = this.dateRangeService.generateDateRange(start, end);
                for (const date of dates) {
                    const dateKey = date.toISOString().split('T')[0];
                    data.push({
                        date,
                        value: dateMap.get(dateKey) || 0,
                    });
                }
                const smoothedData = this.trendCalculationService.applyMovingAverage(data, 7);
                return {
                    label: condition,
                    data: smoothedData,
                    color: this.conditionAnalyticsService.getConditionColor(condition),
                };
            });
            return {
                chartType: 'LINE',
                title: 'Health Condition Trends',
                description: `Daily cases from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`,
                xAxisLabel: 'Date',
                yAxisLabel: 'Number of Cases',
                datasets,
            };
        }
        catch (error) {
            this.logError('Error getting condition trends', error.stack);
            throw error;
        }
    }
    async getMedicationTrends(schoolId, period = time_period_enum_1.TimePeriod.LAST_30_DAYS) {
        try {
            const medicationData = [
                { label: 'Albuterol Inhaler', value: 456 },
                { label: 'Methylphenidate', value: 394 },
                { label: 'Ibuprofen', value: 287 },
                { label: 'Acetaminophen', value: 234 },
                { label: 'Diphenhydramine', value: 189 },
            ];
            return {
                chartType: 'BAR',
                title: 'Top Medications Administered',
                description: `Last ${this.dateRangeService.getPeriodDays(period)} days`,
                xAxisLabel: 'Medication',
                yAxisLabel: 'Administrations',
                datasets: [
                    { label: 'Administrations', data: medicationData, color: '#06B6D4' },
                ],
            };
        }
        catch (error) {
            this.logError('Error getting medication trends', error.stack);
            throw error;
        }
    }
    async getIncidentAnalytics(schoolId, period = time_period_enum_1.TimePeriod.LAST_90_DAYS) {
        return this.incidentAnalyticsService.getIncidentAnalytics(schoolId, period);
    }
    async getImmunizationDashboard(schoolId) {
        try {
            return {
                overallCompliance: 94.3,
                byVaccine: {
                    chartType: 'BAR',
                    title: 'Compliance by Vaccine',
                    datasets: [
                        {
                            label: 'Compliance Rate (%)',
                            data: [
                                { label: 'MMR', value: 96.2 },
                                { label: 'DTaP', value: 95.8 },
                                { label: 'Varicella', value: 94.1 },
                                { label: 'HPV', value: 87.3 },
                            ],
                        },
                    ],
                },
                byGradeLevel: {
                    chartType: 'BAR',
                    title: 'Compliance by Grade',
                    datasets: [
                        {
                            label: 'Compliance Rate (%)',
                            data: [
                                { label: 'K', value: 97.5 },
                                { label: '1-5', value: 95.2 },
                                { label: '6-8', value: 92.8 },
                                { label: '9-12', value: 90.3 },
                            ],
                        },
                    ],
                },
                upcomingDue: 28,
                overdue: 20,
            };
        }
        catch (error) {
            this.logError('Error getting immunization dashboard', error.stack);
            throw error;
        }
    }
    async getAbsenceCorrelation(schoolId, period = time_period_enum_1.TimePeriod.LAST_30_DAYS) {
        try {
            const dateRange = this.dateRangeService.getDateRange(period);
            const { start, end } = dateRange;
            const data = [];
            const dates = this.dateRangeService.generateDateRange(start, end);
            for (const date of dates) {
                const baseRate = 3.5;
                const variance = Math.random() * 2 - 1;
                const seasonalEffect = Math.sin((date.getMonth() / 12) * Math.PI * 2) * 0.5;
                data.push({
                    date,
                    value: Math.max(0, baseRate + variance + seasonalEffect),
                });
            }
            return {
                chartType: 'AREA',
                title: 'Absence Rate vs Health Visits',
                description: 'Correlation between student absences and health office visits',
                xAxisLabel: 'Date',
                yAxisLabel: 'Percentage',
                datasets: [{ label: 'Absence Rate', data, color: '#EF4444' }],
            };
        }
        catch (error) {
            this.logError('Error getting absence correlation', error.stack);
            throw error;
        }
    }
    async getPredictiveInsights(schoolId) {
        return this.predictiveInsightsService.getPredictiveInsights(schoolId);
    }
    async compareCohorts(schoolId, cohortDefinitions) {
        try {
            const cohorts = await Promise.all(cohortDefinitions.map(async (def) => {
                const students = await this.studentModel.findAll({
                    where: { schoolId, ...def.filter, isActive: true },
                });
                const studentIds = students.map((s) => s.id);
                const healthVisits = await this.healthRecordModel.count({
                    where: {
                        studentId: { [sequelize_2.Op.in]: studentIds },
                    },
                });
                const avgVisits = students.length > 0 ? healthVisits / students.length : 0;
                return {
                    name: def.name,
                    filter: def.filter,
                    metrics: [
                        {
                            metricName: 'Average Health Visits',
                            value: Number(avgVisits.toFixed(2)),
                            unit: 'visits/month',
                        },
                        {
                            metricName: 'Cohort Size',
                            value: students.length,
                            unit: 'students',
                        },
                    ],
                };
            }));
            return { cohorts };
        }
        catch (error) {
            this.logError('Error comparing cohorts', error.stack);
            throw error;
        }
    }
    async getHealthMetrics(schoolId, period) {
        return this.healthMetricsAnalyzerService.getHealthMetrics(schoolId, period);
    }
};
exports.HealthTrendAnalyticsService = HealthTrendAnalyticsService;
exports.HealthTrendAnalyticsService = HealthTrendAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Student)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.HealthRecord)),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, Object, Object, date_range_service_1.DateRangeService,
        trend_calculation_service_1.TrendCalculationService,
        condition_analytics_service_1.ConditionAnalyticsService,
        health_metrics_analyzer_service_1.HealthMetricsAnalyzerService,
        incident_analytics_service_1.IncidentAnalyticsService,
        predictive_insights_service_1.PredictiveInsightsService])
], HealthTrendAnalyticsService);
//# sourceMappingURL=health-trend-analytics.service.js.map