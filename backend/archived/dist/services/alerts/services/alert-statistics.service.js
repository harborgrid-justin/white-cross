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
exports.AlertStatisticsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const database_1 = require("../../../database");
const sequelize_2 = require("sequelize");
const base_1 = require("../../../common/base");
let AlertStatisticsService = class AlertStatisticsService extends base_1.BaseService {
    alertModel;
    constructor(alertModel) {
        super("AlertStatisticsService");
        this.alertModel = alertModel;
    }
    async getAlertStatistics(filters) {
        this.logInfo('Calculating alert statistics');
        const where = {};
        if (filters) {
            if (filters.schoolId)
                where.schoolId = filters.schoolId;
            if (filters.startDate)
                where.createdAt = { [sequelize_2.Op.gte]: filters.startDate };
            if (filters.endDate)
                where.createdAt = { ...where.createdAt, [sequelize_2.Op.lte]: filters.endDate };
        }
        const alerts = await this.alertModel.findAll({ where });
        const stats = {
            totalAlerts: alerts.length,
            bySeverity: {},
            byCategory: {},
            byStatus: {},
            averageAcknowledgmentTime: 0,
            averageResolutionTime: 0,
            unacknowledgedCritical: 0,
            escalatedAlerts: 0,
        };
        let totalAckTime = 0;
        let ackCount = 0;
        let totalResTime = 0;
        let resCount = 0;
        for (const alert of alerts) {
            stats.bySeverity[alert.severity] =
                (stats.bySeverity[alert.severity] || 0) + 1;
            stats.byCategory[alert.category] =
                (stats.byCategory[alert.category] || 0) + 1;
            stats.byStatus[alert.status] = (stats.byStatus[alert.status] || 0) + 1;
            if (alert.acknowledgedAt && alert.createdAt) {
                const ackTime = (alert.acknowledgedAt.getTime() - alert.createdAt.getTime()) / 60000;
                totalAckTime += ackTime;
                ackCount++;
            }
            if (alert.resolvedAt && alert.createdAt) {
                const resTime = (alert.resolvedAt.getTime() - alert.createdAt.getTime()) / 60000;
                totalResTime += resTime;
                resCount++;
            }
            if (!alert.acknowledgedAt &&
                (alert.severity === 'CRITICAL' || alert.severity === 'EMERGENCY')) {
                stats.unacknowledgedCritical++;
            }
            if (alert.escalationLevel && alert.escalationLevel > 0) {
                stats.escalatedAlerts++;
            }
        }
        stats.averageAcknowledgmentTime =
            ackCount > 0 ? totalAckTime / ackCount : 0;
        stats.averageResolutionTime = resCount > 0 ? totalResTime / resCount : 0;
        return stats;
    }
    async getAlertCountBySeverity(startDate, endDate, schoolId) {
        const where = {
            createdAt: {
                [sequelize_2.Op.between]: [startDate, endDate],
            },
        };
        if (schoolId) {
            where.schoolId = schoolId;
        }
        const alerts = await this.alertModel.findAll({
            where,
            attributes: ['severity'],
        });
        const counts = {};
        for (const alert of alerts) {
            counts[alert.severity] = (counts[alert.severity] || 0) + 1;
        }
        return counts;
    }
    async getAlertCountByCategory(startDate, endDate, schoolId) {
        const where = {
            createdAt: {
                [sequelize_2.Op.between]: [startDate, endDate],
            },
        };
        if (schoolId) {
            where.schoolId = schoolId;
        }
        const alerts = await this.alertModel.findAll({
            where,
            attributes: ['category'],
        });
        const counts = {};
        for (const alert of alerts) {
            counts[alert.category] = (counts[alert.category] || 0) + 1;
        }
        return counts;
    }
    async getResolutionMetrics(startDate, endDate, schoolId) {
        const where = {
            createdAt: {
                [sequelize_2.Op.between]: [startDate, endDate],
            },
        };
        if (schoolId) {
            where.schoolId = schoolId;
        }
        const alerts = await this.alertModel.findAll({ where });
        const resolvedAlerts = alerts.filter((alert) => alert.resolvedAt);
        let totalResolutionTime = 0;
        for (const alert of resolvedAlerts) {
            if (alert.resolvedAt && alert.createdAt) {
                totalResolutionTime +=
                    (alert.resolvedAt.getTime() - alert.createdAt.getTime()) / 60000;
            }
        }
        const averageResolutionTime = resolvedAlerts.length > 0 ? totalResolutionTime / resolvedAlerts.length : 0;
        const resolutionRate = alerts.length > 0 ? (resolvedAlerts.length / alerts.length) * 100 : 0;
        return {
            totalAlerts: alerts.length,
            resolvedAlerts: resolvedAlerts.length,
            averageResolutionTime,
            resolutionRate,
        };
    }
    async getEscalationStatistics(startDate, endDate, schoolId) {
        const where = {
            createdAt: {
                [sequelize_2.Op.between]: [startDate, endDate],
            },
        };
        if (schoolId) {
            where.schoolId = schoolId;
        }
        const alerts = await this.alertModel.findAll({ where });
        const escalatedAlerts = alerts.filter((alert) => alert.escalationLevel && alert.escalationLevel > 0);
        let totalEscalationLevel = 0;
        for (const alert of escalatedAlerts) {
            totalEscalationLevel += alert.escalationLevel || 0;
        }
        const averageEscalationLevel = escalatedAlerts.length > 0 ? totalEscalationLevel / escalatedAlerts.length : 0;
        const escalationRate = alerts.length > 0 ? (escalatedAlerts.length / alerts.length) * 100 : 0;
        return {
            totalAlerts: alerts.length,
            escalatedAlerts: escalatedAlerts.length,
            escalationRate,
            averageEscalationLevel,
        };
    }
    async getDailyAlertTrends(startDate, endDate, schoolId) {
        const where = {
            createdAt: {
                [sequelize_2.Op.between]: [startDate, endDate],
            },
        };
        if (schoolId) {
            where.schoolId = schoolId;
        }
        const alerts = await this.alertModel.findAll({
            where,
            attributes: ['createdAt', 'severity'],
            order: [['createdAt', 'ASC']],
        });
        const dailyData = {};
        for (const alert of alerts) {
            const date = alert.createdAt.toISOString().split('T')[0];
            if (!dailyData[date]) {
                dailyData[date] = { count: 0, severity: {} };
            }
            dailyData[date].count++;
            dailyData[date].severity[alert.severity] =
                (dailyData[date].severity[alert.severity] || 0) + 1;
        }
        return Object.entries(dailyData).map(([date, data]) => ({
            date,
            count: data.count,
            severity: data.severity,
        }));
    }
};
exports.AlertStatisticsService = AlertStatisticsService;
exports.AlertStatisticsService = AlertStatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.Alert)),
    __metadata("design:paramtypes", [Object])
], AlertStatisticsService);
//# sourceMappingURL=alert-statistics.service.js.map