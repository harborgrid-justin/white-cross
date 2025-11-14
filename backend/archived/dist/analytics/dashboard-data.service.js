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
exports.DashboardDataService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const cache_manager_1 = require("@nestjs/cache-manager");
const base_1 = require("../common/base");
const analytics_interfaces_1 = require("./analytics-interfaces");
const analytics_constants_1 = require("./analytics-constants");
let DashboardDataService = class DashboardDataService extends base_1.BaseService {
    eventEmitter;
    cacheManager;
    constructor(eventEmitter, cacheManager) {
        super("DashboardDataService");
        this.eventEmitter = eventEmitter;
        this.cacheManager = cacheManager;
    }
    async prepareDashboardData(schoolId, userType, timeRange = analytics_interfaces_1.AnalyticsTimePeriod.LAST_30_DAYS) {
        try {
            const cacheKey = analytics_constants_1.ANALYTICS_CACHE_KEYS.DASHBOARD_DATA(schoolId, userType, timeRange);
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                return this.handleSuccess('Operation completed', cached);
            }
            const [alerts, keyMetrics, recommendations, summaryData] = await Promise.all([
                this.collectDashboardAlerts(schoolId, userType),
                this.collectKeyMetrics(schoolId, timeRange),
                this.generateRecommendations(schoolId, userType),
                this.collectSummaryData(schoolId, timeRange),
            ]);
            const dashboardData = {
                schoolId,
                userType,
                timeRange,
                alerts,
                keyMetrics,
                recommendations,
                ...summaryData,
                lastUpdated: new Date(),
            };
            await this.cacheManager.set(cacheKey, dashboardData, analytics_constants_1.ANALYTICS_CONSTANTS.CACHE_TTL.DASHBOARD_DATA);
            this.eventEmitter.emit(analytics_constants_1.ANALYTICS_EVENTS.DASHBOARD_UPDATED, {
                schoolId,
                userType,
                timeRange,
            });
            return this.handleSuccess('Operation completed', dashboardData);
        }
        catch (error) {
            this.logError(`Failed to prepare dashboard data for school ${schoolId}`, error);
            return {
                success: false,
                error: `Failed to prepare dashboard: ${error.message}`,
            };
        }
    }
    async getRealtimeUpdates(schoolId, userType, lastUpdate) {
        try {
            const [newAlerts, updatedMetrics, newRecommendations] = await Promise.all([
                this.getNewAlerts(schoolId, userType, lastUpdate),
                this.getUpdatedMetrics(schoolId, lastUpdate),
                this.getNewRecommendations(schoolId, userType, lastUpdate),
            ]);
            return {
                success: true,
                data: {
                    alerts: newAlerts,
                    metrics: updatedMetrics,
                    recommendations: newRecommendations,
                },
            };
        }
        catch (error) {
            this.logError(`Failed to get realtime updates for school ${schoolId}`, error);
            return {
                success: false,
                error: `Failed to get updates: ${error.message}`,
            };
        }
    }
    async collectDashboardAlerts(schoolId, userType) {
        const alerts = [];
        const criticalHealthAlerts = await this.getCriticalHealthAlerts(schoolId);
        alerts.push(...criticalHealthAlerts);
        const medicationAlerts = await this.getMedicationAlerts(schoolId);
        alerts.push(...medicationAlerts);
        const appointmentAlerts = await this.getAppointmentAlerts(schoolId);
        alerts.push(...appointmentAlerts);
        return this.filterAlertsByUserType(alerts, userType);
    }
    async collectKeyMetrics(schoolId, timeRange) {
        const metrics = [];
        const healthMetrics = await this.calculateHealthMetrics(schoolId, timeRange);
        metrics.push({
            id: 'health_overview',
            name: 'Health Overview',
            value: healthMetrics.overallScore,
            unit: 'score',
            trend: healthMetrics.trend,
            change: healthMetrics.change,
            category: 'health',
        });
        const medicationMetrics = await this.calculateMedicationMetrics(schoolId, timeRange);
        metrics.push({
            id: 'medication_adherence',
            name: 'Medication Adherence',
            value: medicationMetrics.adherenceRate,
            unit: '%',
            trend: medicationMetrics.trend,
            change: medicationMetrics.change,
            category: 'medication',
        });
        const appointmentMetrics = await this.calculateAppointmentMetrics(schoolId, timeRange);
        metrics.push({
            id: 'appointment_completion',
            name: 'Appointment Completion',
            value: appointmentMetrics.completionRate,
            unit: '%',
            trend: appointmentMetrics.trend,
            change: appointmentMetrics.change,
            category: 'appointments',
        });
        return metrics;
    }
    async generateRecommendations(schoolId, userType) {
        const recommendations = [];
        const metrics = await this.collectKeyMetrics(schoolId, analytics_interfaces_1.AnalyticsTimePeriod.LAST_30_DAYS);
        for (const metric of metrics) {
            if (metric.value < 80) {
                recommendations.push({
                    id: `rec_${metric.id}`,
                    title: `Improve ${metric.name}`,
                    description: `Current ${metric.name.toLowerCase()} is ${metric.value}${metric.unit}. Consider implementing improvement measures.`,
                    priority: metric.value < 70 ? 'HIGH' : 'MEDIUM',
                    category: metric.category,
                    actionable: true,
                    estimatedImpact: 'MODERATE',
                });
            }
        }
        return this.filterRecommendationsByUserType(recommendations, userType);
    }
    async collectSummaryData(schoolId, timeRange) {
        return {
            totalStudents: 500,
            activeStudents: 485,
            upcomingAppointments: 23,
            pendingTasks: 12,
        };
    }
    async getNewAlerts(schoolId, userType, since) {
        return [];
    }
    async getUpdatedMetrics(schoolId, since) {
        return [];
    }
    async getNewRecommendations(schoolId, userType, since) {
        return [];
    }
    async getCriticalHealthAlerts(schoolId) {
        return [
            {
                id: 'alert_1',
                type: 'CRITICAL',
                severity: 'CRITICAL',
                title: 'Student with Severe Allergy',
                message: 'Student requires immediate attention for allergic reaction',
                timestamp: new Date(),
                acknowledged: false,
                category: 'health',
            },
        ];
    }
    async getMedicationAlerts(schoolId) {
        return [
            {
                id: 'alert_2',
                type: 'WARNING',
                severity: 'HIGH',
                title: 'Medication Due',
                message: '5 students have medications due within the next hour',
                timestamp: new Date(),
                acknowledged: false,
                category: 'medication',
            },
        ];
    }
    async getAppointmentAlerts(schoolId) {
        return [];
    }
    filterAlertsByUserType(alerts, userType) {
        switch (userType) {
            case 'nurse':
                return alerts.filter(alert => ['health', 'medication', 'appointments'].includes(alert.category));
            case 'admin':
                return alerts;
            default:
                return alerts.filter(alert => alert.severity === 'CRITICAL');
        }
    }
    filterRecommendationsByUserType(recommendations, userType) {
        return recommendations;
    }
    async calculateHealthMetrics(schoolId, timeRange) {
        return {
            overallScore: 87.5,
            trend: 'UP',
            change: 2.3,
        };
    }
    async calculateMedicationMetrics(schoolId, timeRange) {
        return {
            adherenceRate: 92.1,
            trend: 'STABLE',
            change: 0.5,
        };
    }
    async calculateAppointmentMetrics(schoolId, timeRange) {
        return {
            completionRate: 88.7,
            trend: 'UP',
            change: 1.8,
        };
    }
};
exports.DashboardDataService = DashboardDataService;
exports.DashboardDataService = DashboardDataService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, Inject(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2, Object])
], DashboardDataService);
//# sourceMappingURL=dashboard-data.service.js.map