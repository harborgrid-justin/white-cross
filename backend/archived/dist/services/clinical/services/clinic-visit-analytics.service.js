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
exports.ClinicVisitAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../../database/models");
const base_1 = require("../../../common/base");
let ClinicVisitAnalyticsService = class ClinicVisitAnalyticsService extends base_1.BaseService {
    clinicVisitModel;
    constructor(clinicVisitModel) {
        super("ClinicVisitAnalyticsService");
        this.clinicVisitModel = clinicVisitModel;
    }
    async getStatistics(startDate, endDate) {
        const visits = await this.clinicVisitModel.findAll({
            where: {
                checkInTime: {
                    [sequelize_2.Op.between]: [startDate, endDate],
                },
            },
        });
        const stats = {
            totalVisits: visits.length,
            averageVisitDuration: 0,
            byReason: {},
            byDisposition: {},
            totalMinutesMissed: 0,
            averageMinutesMissed: 0,
            activeVisits: 0,
            mostCommonSymptoms: [],
        };
        let totalDuration = 0;
        let durationCount = 0;
        const symptomCounts = {};
        for (const visit of visits) {
            const duration = visit.getDuration();
            if (duration !== null) {
                totalDuration += duration;
                durationCount++;
            }
            else {
                stats.activeVisits++;
            }
            for (const reason of visit.reasonForVisit) {
                stats.byReason[reason] = (stats.byReason[reason] || 0) + 1;
            }
            stats.byDisposition[visit.disposition] =
                (stats.byDisposition[visit.disposition] || 0) + 1;
            if (visit.minutesMissed) {
                stats.totalMinutesMissed += visit.minutesMissed;
            }
            if (visit.symptoms) {
                for (const symptom of visit.symptoms) {
                    symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
                }
            }
        }
        stats.averageVisitDuration =
            durationCount > 0 ? totalDuration / durationCount : 0;
        stats.averageMinutesMissed =
            visits.length > 0 ? stats.totalMinutesMissed / visits.length : 0;
        stats.mostCommonSymptoms = Object.entries(symptomCounts)
            .map(([symptom, count]) => ({ symptom, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        return stats;
    }
    async getStudentVisitSummary(studentId, startDate, endDate) {
        const whereClause = { studentId };
        if (startDate && endDate) {
            whereClause.checkInTime = {
                [sequelize_2.Op.between]: [startDate, endDate],
            };
        }
        const visits = await this.clinicVisitModel.findAll({
            where: whereClause,
            order: [['checkInTime', 'DESC']],
        });
        const summary = {
            studentId,
            totalVisits: visits.length,
            averageDuration: 0,
            totalMinutesMissed: 0,
            mostCommonReasons: [],
            lastVisitDate: visits[0]?.checkInTime || new Date(),
            visitFrequency: 0,
        };
        if (visits.length === 0) {
            return summary;
        }
        let totalDuration = 0;
        let durationCount = 0;
        const reasonCounts = {};
        for (const visit of visits) {
            const duration = visit.getDuration();
            if (duration !== null) {
                totalDuration += duration;
                durationCount++;
            }
            if (visit.minutesMissed) {
                summary.totalMinutesMissed += visit.minutesMissed;
            }
            for (const reason of visit.reasonForVisit) {
                reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
            }
        }
        summary.averageDuration =
            durationCount > 0 ? totalDuration / durationCount : 0;
        summary.mostCommonReasons = Object.entries(reasonCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([reason]) => reason);
        if (startDate && endDate) {
            const months = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
            summary.visitFrequency = visits.length / (months || 1);
        }
        else if (visits.length > 1) {
            const oldestVisit = visits[visits.length - 1].checkInTime;
            const newestVisit = visits[0].checkInTime;
            const months = (newestVisit.getTime() - oldestVisit.getTime()) /
                (1000 * 60 * 60 * 24 * 30);
            summary.visitFrequency = visits.length / (months || 1);
        }
        return summary;
    }
    async getFrequentVisitors(startDate, endDate, limit = 10) {
        const visits = await this.clinicVisitModel.findAll({
            where: {
                checkInTime: {
                    [sequelize_2.Op.between]: [startDate, endDate],
                },
            },
            order: [['checkInTime', 'DESC']],
        });
        const studentVisits = new Map();
        for (const visit of visits) {
            const existing = studentVisits.get(visit.studentId) || [];
            existing.push(visit);
            studentVisits.set(visit.studentId, existing);
        }
        const summaries = [];
        for (const [studentId, studentVisitList] of studentVisits.entries()) {
            const summary = {
                studentId,
                totalVisits: studentVisitList.length,
                averageDuration: 0,
                totalMinutesMissed: 0,
                mostCommonReasons: [],
                lastVisitDate: studentVisitList[0]?.checkInTime || new Date(),
                visitFrequency: 0,
            };
            let totalDuration = 0;
            let durationCount = 0;
            const reasonCounts = {};
            for (const visit of studentVisitList) {
                const duration = visit.getDuration();
                if (duration !== null) {
                    totalDuration += duration;
                    durationCount++;
                }
                if (visit.minutesMissed) {
                    summary.totalMinutesMissed += visit.minutesMissed;
                }
                for (const reason of visit.reasonForVisit) {
                    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
                }
            }
            summary.averageDuration =
                durationCount > 0 ? totalDuration / durationCount : 0;
            summary.mostCommonReasons = Object.entries(reasonCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([reason]) => reason);
            const months = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
            summary.visitFrequency = studentVisitList.length / (months || 1);
            summaries.push(summary);
        }
        return summaries
            .sort((a, b) => b.totalVisits - a.totalVisits)
            .slice(0, limit);
    }
    async getVisitsByTimeOfDay(startDate, endDate) {
        const visits = await this.clinicVisitModel.findAll({
            where: {
                checkInTime: {
                    [sequelize_2.Op.between]: [startDate, endDate],
                },
            },
        });
        const distribution = {
            'Morning (6-9am)': 0,
            'Mid-Morning (9am-12pm)': 0,
            'Afternoon (12-3pm)': 0,
            'Late Afternoon (3-6pm)': 0,
            'Evening (6pm+)': 0,
        };
        for (const visit of visits) {
            const hour = visit.checkInTime.getHours();
            if (hour >= 6 && hour < 9) {
                distribution['Morning (6-9am)']++;
            }
            else if (hour >= 9 && hour < 12) {
                distribution['Mid-Morning (9am-12pm)']++;
            }
            else if (hour >= 12 && hour < 15) {
                distribution['Afternoon (12-3pm)']++;
            }
            else if (hour >= 15 && hour < 18) {
                distribution['Late Afternoon (3-6pm)']++;
            }
            else {
                distribution['Evening (6pm+)']++;
            }
        }
        return distribution;
    }
};
exports.ClinicVisitAnalyticsService = ClinicVisitAnalyticsService;
exports.ClinicVisitAnalyticsService = ClinicVisitAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.ClinicVisit)),
    __metadata("design:paramtypes", [Object])
], ClinicVisitAnalyticsService);
//# sourceMappingURL=clinic-visit-analytics.service.js.map