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
exports.AnalyticsMetricsCalculatorService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const cache_manager_1 = require("@nestjs/cache-manager");
const base_1 = require("../common/base");
const analytics_interfaces_1 = require("./analytics-interfaces");
const analytics_constants_1 = require("./analytics-constants");
let AnalyticsMetricsCalculatorService = class AnalyticsMetricsCalculatorService extends base_1.BaseService {
    eventEmitter;
    cacheManager;
    constructor(eventEmitter, cacheManager) {
        super("AnalyticsMetricsCalculatorService");
        this.eventEmitter = eventEmitter;
        this.cacheManager = cacheManager;
    }
    async calculateHealthKPIs(healthMetrics) {
        try {
            const kpis = {
                medicationAdherenceScore: this.calculateMedicationAdherenceScore(healthMetrics),
                immunizationComplianceScore: this.calculateImmunizationComplianceScore(healthMetrics),
                healthRecordActivityScore: this.calculateHealthRecordActivityScore(healthMetrics),
                overallHealthIndex: this.calculateOverallHealthIndex(healthMetrics),
                riskIndicators: this.identifyRiskIndicators(healthMetrics),
                improvementAreas: this.identifyImprovementAreas(healthMetrics),
            };
            const result = {
                schoolId: healthMetrics.schoolId,
                period: healthMetrics.period,
                kpis,
                calculatedAt: new Date(),
                dataPoints: {
                    totalStudents: healthMetrics.totalStudents,
                    activeHealthRecords: healthMetrics.activeHealthRecords,
                    medicationAdherence: healthMetrics.medicationAdherence,
                    immunizationCompliance: healthMetrics.immunizationCompliance,
                },
            };
            this.eventEmitter.emit('analytics.kpis.calculated', {
                schoolId: healthMetrics.schoolId,
                period: healthMetrics.period,
                kpiCount: Object.keys(kpis).length,
            });
            return this.handleSuccess('Operation completed', result);
        }
        catch (error) {
            this.logError(`Failed to calculate health KPIs for school ${healthMetrics.schoolId}`, error);
            return {
                success: false,
                error: `Failed to calculate KPIs: ${error.message}`,
            };
        }
    }
    async analyzeHealthTrends(schoolId, metricType, periods = [
        analytics_interfaces_1.AnalyticsTimePeriod.LAST_30_DAYS,
        analytics_interfaces_1.AnalyticsTimePeriod.LAST_90_DAYS,
        analytics_interfaces_1.AnalyticsTimePeriod.LAST_6_MONTHS,
    ]) {
        try {
            const cacheKey = analytics_constants_1.ANALYTICS_CACHE_KEYS.TREND_DATA(schoolId, metricType, periods.join(','));
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                return this.handleSuccess('Operation completed', cached);
            }
            const trendData = periods.map((period, index) => ({
                period,
                value: this.generateSyntheticTrendValue(metricType, index),
                change: this.generateSyntheticChange(index),
                changePercent: this.generateSyntheticChangePercent(index),
                timestamp: new Date(),
            }));
            const trendAnalysis = {
                schoolId,
                metricType,
                trend: this.determineTrendDirection(trendData),
                confidence: this.calculateTrendConfidence(trendData),
                data: trendData,
                forecast: await this.generateTrendForecast(trendData),
                analysisDate: new Date(),
            };
            await this.cacheManager.set(cacheKey, trendAnalysis, analytics_constants_1.ANALYTICS_CONSTANTS.CACHE_TTL.TREND_DATA);
            this.eventEmitter.emit('analytics.trends.analyzed', {
                schoolId,
                metricType,
                trend: trendAnalysis.trend,
            });
            return this.handleSuccess('Operation completed', trendAnalysis);
        }
        catch (error) {
            this.logError(`Failed to analyze trends for school ${schoolId}, metric ${metricType}`, error);
            return {
                success: false,
                error: `Failed to analyze trends: ${error.message}`,
            };
        }
    }
    async generateHealthForecast(schoolId, metricType, periods = analytics_constants_1.ANALYTICS_CONSTANTS.CALCULATIONS.FORECAST_PERIODS) {
        try {
            const forecastData = Array.from({ length: periods }, (_, index) => ({
                period: index + 1,
                predictedValue: this.generateSyntheticForecastValue(metricType, index),
                confidenceInterval: {
                    lower: this.generateSyntheticForecastValue(metricType, index) * 0.9,
                    upper: this.generateSyntheticForecastValue(metricType, index) * 1.1,
                },
                probability: 0.85 - (index * 0.05),
                factors: this.generateForecastFactors(metricType),
                forecastDate: new Date(Date.now() + (index + 1) * 30 * 24 * 60 * 60 * 1000),
            }));
            const forecastAnalysis = {
                schoolId,
                metricType,
                forecast: forecastData,
                overallConfidence: this.calculateOverallForecastConfidence(forecastData),
                assumptions: this.generateForecastAssumptions(metricType),
                generatedAt: new Date(),
            };
            return this.handleSuccess('Operation completed', forecastAnalysis);
        }
        catch (error) {
            this.logError(`Failed to generate forecast for school ${schoolId}, metric ${metricType}`, error);
            return {
                success: false,
                error: `Failed to generate forecast: ${error.message}`,
            };
        }
    }
    calculateAppointmentEfficiency(appointmentData) {
        const efficiencyScore = Math.max(0, Math.min(100, (appointmentData.completionRate * 0.7) +
            ((100 - appointmentData.noShowRate) * 0.3)));
        const utilizationRate = appointmentData.totalAppointments > 0
            ? (appointmentData.completedAppointments / appointmentData.totalAppointments) * 100
            : 0;
        const noShowImpact = appointmentData.noShowRate;
        const recommendations = [];
        if (appointmentData.noShowRate > analytics_constants_1.ANALYTICS_CONSTANTS.THRESHOLDS.NO_SHOW_RATE) {
            recommendations.push('Implement reminder system to reduce no-show rate');
        }
        if (appointmentData.completionRate < analytics_constants_1.ANALYTICS_CONSTANTS.THRESHOLDS.APPOINTMENT_COMPLETION) {
            recommendations.push('Review appointment scheduling process');
        }
        return {
            efficiencyScore,
            utilizationRate,
            noShowImpact,
            recommendations,
        };
    }
    calculateMedicationEffectiveness(medicationData) {
        const effectivenessScore = Math.min(100, (medicationData.uniqueStudents / Math.max(medicationData.totalAdministrations, 1)) * 100);
        const adherenceRate = analytics_constants_1.ANALYTICS_CONSTANTS.THRESHOLDS.MEDICATION_ADHERENCE;
        const diversityIndex = medicationData.topMedications.length > 0
            ? (medicationData.topMedications.length / 10) * 100
            : 0;
        const recommendations = [];
        if (medicationData.upcomingMedications > 10) {
            recommendations.push('High volume of upcoming medications - consider staffing adjustments');
        }
        if (diversityIndex < 30) {
            recommendations.push('Limited medication variety - review treatment protocols');
        }
        return {
            effectivenessScore,
            adherenceRate,
            diversityIndex,
            recommendations,
        };
    }
    calculateIncidentResponseEffectiveness(incidentData) {
        const totalIncidents = incidentData.totalIncidents;
        const criticalRate = totalIncidents > 0
            ? (incidentData.criticalIncidents / totalIncidents) * 100
            : 0;
        const responseScore = Math.max(0, 100 - (criticalRate * 2));
        const severityDistribution = incidentData.incidentsBySeverity.reduce((acc, item) => {
            acc[item.severity] = item.count;
            return acc;
        }, {});
        const recommendations = [];
        if (criticalRate > 5) {
            recommendations.push('High critical incident rate - review safety protocols');
        }
        if (totalIncidents > analytics_constants_1.ANALYTICS_CONSTANTS.THRESHOLDS.CRITICAL_INCIDENTS) {
            recommendations.push('Elevated incident volume - conduct safety assessment');
        }
        return {
            responseScore,
            severityDistribution,
            criticalIncidentRate: criticalRate,
            recommendations,
        };
    }
    calculateMedicationAdherenceScore(metrics) {
        return Math.min(100, Math.max(0, metrics.medicationAdherence));
    }
    calculateImmunizationComplianceScore(metrics) {
        return Math.min(100, Math.max(0, metrics.immunizationCompliance));
    }
    calculateHealthRecordActivityScore(metrics) {
        const recordsPerStudent = metrics.totalStudents > 0
            ? metrics.activeHealthRecords / metrics.totalStudents
            : 0;
        return Math.min(100, recordsPerStudent * 20);
    }
    calculateOverallHealthIndex(metrics) {
        const weights = {
            medication: 0.3,
            immunization: 0.3,
            activity: 0.2,
            conditions: 0.2,
        };
        const medicationScore = this.calculateMedicationAdherenceScore(metrics);
        const immunizationScore = this.calculateImmunizationComplianceScore(metrics);
        const activityScore = this.calculateHealthRecordActivityScore(metrics);
        const conditionScore = metrics.topConditions.length > 0 ? 80 : 100;
        return (medicationScore * weights.medication +
            immunizationScore * weights.immunization +
            activityScore * weights.activity +
            conditionScore * weights.conditions);
    }
    identifyRiskIndicators(metrics) {
        const indicators = [];
        if (metrics.medicationAdherence < analytics_constants_1.ANALYTICS_CONSTANTS.THRESHOLDS.MEDICATION_ADHERENCE) {
            indicators.push('Low medication adherence');
        }
        if (metrics.immunizationCompliance < analytics_constants_1.ANALYTICS_CONSTANTS.THRESHOLDS.IMMUNIZATION_COMPLIANCE) {
            indicators.push('Low immunization compliance');
        }
        if (metrics.topConditions.length > 5) {
            indicators.push('High number of reported conditions');
        }
        return indicators;
    }
    identifyImprovementAreas(metrics) {
        const areas = [];
        if (metrics.medicationAdherence < 90) {
            areas.push('Medication adherence programs');
        }
        if (metrics.immunizationCompliance < 95) {
            areas.push('Immunization tracking and reminders');
        }
        if (metrics.activeHealthRecords < metrics.totalStudents * 0.5) {
            areas.push('Health record documentation');
        }
        return areas;
    }
    generateSyntheticTrendValue(metricType, index) {
        const baseValues = {
            'medication_adherence': 85,
            'immunization_compliance': 90,
            'health_records': 150,
            'incidents': 5,
        };
        const base = baseValues[metricType] || 100;
        return base + (Math.random() - 0.5) * 20 + (index * 2);
    }
    generateSyntheticChange(index) {
        return (Math.random() - 0.5) * 10;
    }
    generateSyntheticChangePercent(index) {
        return (Math.random() - 0.5) * 20;
    }
    determineTrendDirection(data) {
        if (data.length < 2)
            return 'stable';
        const changes = data.slice(1).map((item, index) => item.value - data[index].value);
        const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
        if (avgChange > 1)
            return 'increasing';
        if (avgChange < -1)
            return 'decreasing';
        return 'stable';
    }
    calculateTrendConfidence(data) {
        if (data.length < analytics_constants_1.ANALYTICS_CONSTANTS.CALCULATIONS.MIN_DATA_POINTS) {
            return 0.5;
        }
        return Math.min(0.95, data.length / 10);
    }
    async generateTrendForecast(data) {
        const lastValue = data[data.length - 1]?.value || 0;
        return Array.from({ length: 3 }, (_, index) => ({
            period: index + 1,
            predictedValue: lastValue + (index + 1) * 5,
            confidenceInterval: {
                lower: lastValue + (index + 1) * 3,
                upper: lastValue + (index + 1) * 7,
            },
            probability: 0.8 - (index * 0.1),
            factors: ['Historical trend', 'Seasonal patterns'],
            forecastDate: new Date(Date.now() + (index + 1) * 30 * 24 * 60 * 60 * 1000),
        }));
    }
    generateSyntheticForecastValue(metricType, index) {
        const baseValues = {
            'medication_adherence': 85,
            'immunization_compliance': 90,
            'health_records': 150,
            'incidents': 5,
        };
        const base = baseValues[metricType] || 100;
        return base + (index + 1) * 3 + Math.random() * 5;
    }
    generateForecastFactors(metricType) {
        const factors = {
            'medication_adherence': ['Staff training', 'Reminder systems', 'Student engagement'],
            'immunization_compliance': ['Vaccine availability', 'Parental education', 'School policies'],
            'health_records': ['Documentation processes', 'Staff workload', 'System usability'],
            'incidents': ['Safety protocols', 'Staff training', 'Environmental factors'],
        };
        return factors[metricType] || ['General trends', 'External factors'];
    }
    calculateOverallForecastConfidence(forecast) {
        if (forecast.length === 0)
            return 0;
        const avgProbability = forecast.reduce((sum, item) => sum + item.probability, 0) / forecast.length;
        return Math.min(0.95, avgProbability);
    }
    generateForecastAssumptions(metricType) {
        return [
            'Current trends will continue',
            'No major policy changes',
            'Staffing levels remain constant',
            'External factors remain stable',
        ];
    }
};
exports.AnalyticsMetricsCalculatorService = AnalyticsMetricsCalculatorService;
exports.AnalyticsMetricsCalculatorService = AnalyticsMetricsCalculatorService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, Inject(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2, Object])
], AnalyticsMetricsCalculatorService);
//# sourceMappingURL=analytics-metrics-calculator.service.js.map