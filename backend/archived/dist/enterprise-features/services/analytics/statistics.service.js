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
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
let StatisticsService = class StatisticsService extends base_1.BaseService {
    constructor() {
        super('StatisticsService');
    }
    getAppointmentStatistics(period) {
        try {
            this.validatePeriod(period);
            const stats = {
                totalAppointments: 450,
                completedAppointments: 380,
                cancelledAppointments: 50,
                noShowAppointments: 20,
                averageWaitTime: 15,
                peakHours: ['09:00-10:00', '13:00-14:00'],
            };
            this.logInfo('Appointment statistics retrieved', {
                period,
                totalAppointments: stats.totalAppointments,
            });
            return stats;
        }
        catch (error) {
            this.logError('Error getting appointment statistics', {
                error: error instanceof Error ? error.message : String(error),
                period,
            });
            throw error;
        }
    }
    getMedicationStatistics(period) {
        try {
            this.validatePeriod(period);
            const stats = {
                totalDoses: 1200,
                uniqueStudents: 450,
                mostCommonMedications: [
                    { name: 'Albuterol Inhaler', count: 180 },
                    { name: 'EpiPen', count: 45 },
                    { name: 'Insulin', count: 120 },
                ],
                adherenceRate: 96.5,
                missedDoses: 42,
            };
            this.logInfo('Medication statistics retrieved', {
                period,
                totalDoses: stats.totalDoses,
                adherenceRate: stats.adherenceRate,
            });
            return stats;
        }
        catch (error) {
            this.logError('Error getting medication statistics', {
                error: error instanceof Error ? error.message : String(error),
                period,
            });
            throw error;
        }
    }
    getIncidentStatistics(period) {
        try {
            this.validatePeriod(period);
            const stats = {
                totalIncidents: 85,
                byType: {
                    injury: 45,
                    illness: 25,
                    behavioral: 10,
                    other: 5,
                },
                bySeverity: {
                    minor: 65,
                    moderate: 15,
                    severe: 5,
                },
                resolutionTime: {
                    average: 3.5,
                    median: 2.0,
                },
                pendingReports: 8,
            };
            this.logInfo('Incident statistics retrieved', {
                period,
                totalIncidents: stats.totalIncidents,
                pendingReports: stats.pendingReports,
            });
            return stats;
        }
        catch (error) {
            this.logError('Error getting incident statistics', {
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
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map