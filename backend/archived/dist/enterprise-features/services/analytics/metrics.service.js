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
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const base_1 = require("../../../common/base");
let MetricsService = class MetricsService extends base_1.BaseService {
    eventEmitter;
    constructor(eventEmitter) {
        super('MetricsService');
        this.eventEmitter = eventEmitter;
    }
    getRealtimeMetrics() {
        try {
            const metrics = [
                {
                    name: 'Active Students',
                    value: 1250,
                    trend: 'up',
                    change: 32,
                    changePercent: 2.5,
                    unit: 'students',
                    period: 'today',
                    lastUpdated: new Date(),
                },
                {
                    name: 'Appointments Today',
                    value: 45,
                    trend: 'stable',
                    change: 0,
                    changePercent: 0,
                    unit: 'appointments',
                    period: 'today',
                    lastUpdated: new Date(),
                },
                {
                    name: 'Medications Administered',
                    value: 120,
                    trend: 'up',
                    change: 5,
                    changePercent: 4.3,
                    unit: 'doses',
                    period: 'today',
                    lastUpdated: new Date(),
                },
                {
                    name: 'Incident Reports',
                    value: 8,
                    trend: 'down',
                    change: -2,
                    changePercent: -20,
                    unit: 'reports',
                    period: 'today',
                    lastUpdated: new Date(),
                },
                {
                    name: 'Consent Forms Pending',
                    value: 15,
                    trend: 'down',
                    change: -5,
                    changePercent: -25,
                    unit: 'forms',
                    period: 'today',
                    lastUpdated: new Date(),
                },
            ];
            this.logInfo('Real-time metrics retrieved', {
                metricCount: metrics.length,
                timestamp: new Date(),
            });
            this.eventEmitter.emit('analytics.metrics.retrieved', {
                metrics: metrics.map((m) => ({ name: m.name, value: m.value })),
                timestamp: new Date(),
            });
            return metrics;
        }
        catch (error) {
            this.logError('Error getting real-time metrics', {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    getHealthTrends(period) {
        try {
            this.validatePeriod(period);
            const trendData = {
                period,
                metrics: [
                    {
                        name: 'Nurse Visits',
                        value: 450,
                        previousValue: 420,
                        change: 30,
                        changePercent: 7.1,
                    },
                    {
                        name: 'Medication Administration',
                        value: 1200,
                        previousValue: 1150,
                        change: 50,
                        changePercent: 4.3,
                    },
                    {
                        name: 'Immunization Compliance',
                        value: 95,
                        previousValue: 93,
                        change: 2,
                        changePercent: 2.2,
                    },
                    {
                        name: 'Health Screenings Completed',
                        value: 380,
                        previousValue: 350,
                        change: 30,
                        changePercent: 8.6,
                    },
                ],
                alerts: [],
            };
            if (trendData.metrics.some((m) => m.name === 'Immunization Compliance' && m.value < 90)) {
                trendData.alerts.push({
                    type: 'critical',
                    message: 'Immunization compliance below threshold',
                    metric: 'Immunization Compliance',
                });
            }
            this.logInfo('Health trends retrieved', {
                period,
                metricCount: trendData.metrics.length,
                alertCount: trendData.alerts.length,
            });
            this.eventEmitter.emit('analytics.trends.retrieved', {
                period,
                metricCount: trendData.metrics.length,
                timestamp: new Date(),
            });
            return trendData;
        }
        catch (error) {
            this.logError('Error getting health trends', {
                error: error instanceof Error ? error.message : String(error),
                period,
            });
            throw error;
        }
    }
    validatePeriod(period) {
        const validPeriods = ['day', 'week', 'month'];
        if (!validPeriods.includes(period)) {
            throw new Error(`Invalid period: ${period}. Must be one of: ${validPeriods.join(', ')}`);
        }
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map