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
exports.AnalyticsAppointmentOrchestratorService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
let AnalyticsAppointmentOrchestratorService = class AnalyticsAppointmentOrchestratorService extends base_1.BaseService {
    constructor() {
        super("AnalyticsAppointmentOrchestratorService");
    }
    async getAppointmentTrends(query) {
        try {
            const trends = {
                totalAppointments: 342,
                completedAppointments: 298,
                cancelledAppointments: 23,
                noShowAppointments: 21,
                completionRate: 87.1,
                noShowRate: 6.1,
                byType: [
                    { type: 'Health Screening', count: 156, completionRate: 94.2 },
                    { type: 'Medication Check', count: 89, completionRate: 85.4 },
                    { type: 'Follow-up', count: 67, completionRate: 82.1 },
                    { type: 'Immunization', count: 30, completionRate: 96.7 },
                ],
                byMonth: [
                    { month: 'Sep', scheduled: 85, completed: 76, noShow: 5 },
                    { month: 'Oct', scheduled: 92, completed: 81, noShow: 6 },
                    { month: 'Nov', scheduled: 88, completed: 75, noShow: 7 },
                    { month: 'Dec', scheduled: 77, completed: 66, noShow: 3 },
                ],
            };
            return {
                trends,
                period: {
                    startDate: query.startDate,
                    endDate: query.endDate,
                },
                filters: {
                    schoolId: query.schoolId,
                    appointmentType: query.appointmentType,
                    status: query.status,
                    groupBy: query.groupBy || 'MONTH',
                },
            };
        }
        catch (error) {
            this.logError('Error getting appointment trends', error);
            throw error;
        }
    }
    async getNoShowRate(query) {
        try {
            const noShowAnalytics = {
                overallNoShowRate: 6.1,
                totalScheduled: 342,
                totalNoShows: 21,
                targetRate: query.compareWithTarget || 5.0,
                meetsTarget: 6.1 <= (query.compareWithTarget || 5.0),
                byType: [
                    { type: 'Health Screening', noShowRate: 3.8, count: 6 },
                    { type: 'Medication Check', noShowRate: 7.9, count: 7 },
                    { type: 'Follow-up', noShowRate: 10.4, count: 7 },
                    { type: 'Immunization', noShowRate: 3.3, count: 1 },
                ],
                reasons: query.includeReasons
                    ? [
                        { reason: 'Student absent', count: 9, percentage: 42.9 },
                        { reason: 'Parent did not consent', count: 5, percentage: 23.8 },
                        { reason: 'Scheduling conflict', count: 4, percentage: 19.0 },
                        { reason: 'Other', count: 3, percentage: 14.3 },
                    ]
                    : null,
                trend: {
                    direction: 'DECREASING',
                    changePercent: -12.5,
                },
            };
            return {
                noShowAnalytics,
                period: {
                    startDate: query.startDate,
                    endDate: query.endDate,
                },
                filters: {
                    schoolId: query.schoolId,
                    appointmentType: query.appointmentType,
                },
            };
        }
        catch (error) {
            this.logError('Error getting no-show rate', error);
            throw error;
        }
    }
};
exports.AnalyticsAppointmentOrchestratorService = AnalyticsAppointmentOrchestratorService;
exports.AnalyticsAppointmentOrchestratorService = AnalyticsAppointmentOrchestratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AnalyticsAppointmentOrchestratorService);
//# sourceMappingURL=analytics-appointment-orchestrator.service.js.map