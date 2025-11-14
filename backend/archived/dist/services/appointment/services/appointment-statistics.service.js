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
exports.AppointmentStatisticsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const appointment_validation_1 = require("../validators/appointment-validation");
const models_1 = require("../../../database/models");
const models_2 = require("../../../database/models");
const base_1 = require("../../../common/base");
let AppointmentStatisticsService = class AppointmentStatisticsService extends base_1.BaseService {
    appointmentModel;
    userModel;
    constructor(appointmentModel, userModel) {
        super('AppointmentStatisticsService');
        this.appointmentModel = appointmentModel;
        this.userModel = userModel;
    }
    async getStatistics(filters = {}) {
        this.logInfo('Getting appointment statistics');
        try {
            const whereClause = {};
            if (filters.nurseId) {
                whereClause.nurseId = filters.nurseId;
            }
            if (filters.dateFrom || filters.dateTo) {
                whereClause.scheduledAt = {};
                if (filters.dateFrom) {
                    whereClause.scheduledAt[sequelize_2.Op.gte] = filters.dateFrom;
                }
                if (filters.dateTo) {
                    whereClause.scheduledAt[sequelize_2.Op.lte] = filters.dateTo;
                }
            }
            const total = await this.appointmentModel.count({ where: whereClause });
            const byStatus = await this.appointmentModel.findAll({
                where: whereClause,
                attributes: ['status', [sequelize_2.Sequelize.fn('COUNT', sequelize_2.Sequelize.col('id')), 'count']],
                group: ['status'],
                raw: true,
            });
            const byType = await this.appointmentModel.findAll({
                where: whereClause,
                attributes: ['type', [sequelize_2.Sequelize.fn('COUNT', sequelize_2.Sequelize.col('id')), 'count']],
                group: ['type'],
                raw: true,
            });
            const noShowCount = await this.appointmentModel.count({
                where: { ...whereClause, status: models_1.AppointmentStatus.NO_SHOW },
            });
            const completedCount = await this.appointmentModel.count({
                where: { ...whereClause, status: models_1.AppointmentStatus.COMPLETED },
            });
            return {
                total,
                byStatus: byStatus.reduce((acc, item) => {
                    acc[item.status] = parseInt(item.count);
                    return acc;
                }, {}),
                byType: byType.reduce((acc, item) => {
                    acc[item.type] = parseInt(item.count);
                    return acc;
                }, {}),
                noShowRate: total > 0 ? (noShowCount / total) * 100 : 0,
                completionRate: total > 0 ? (completedCount / total) * 100 : 0,
            };
        }
        catch (error) {
            this.logError(`Error getting statistics: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to get statistics');
        }
    }
    async getAppointmentTrends(dateFrom, dateTo, groupBy = 'day') {
        this.logInfo('Getting appointment trends');
        try {
            const fromDate = new Date(dateFrom);
            const toDate = new Date(dateTo);
            const trends = [];
            const current = new Date(fromDate);
            while (current <= toDate) {
                const count = await this.appointmentModel.count({
                    where: {
                        scheduledAt: {
                            [sequelize_2.Op.gte]: current,
                            [sequelize_2.Op.lt]: new Date(current.getTime() + 24 * 60 * 60 * 1000),
                        },
                    },
                });
                trends.push({
                    date: current.toISOString().split('T')[0],
                    count,
                });
                current.setDate(current.getDate() + 1);
            }
            return { trends };
        }
        catch (error) {
            this.logError(`Error getting appointment trends: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to get appointment trends');
        }
    }
    async getNoShowStats(nurseId, dateFrom, dateTo) {
        this.logInfo('Getting no-show statistics');
        try {
            const whereClause = {};
            if (nurseId) {
                whereClause.nurseId = nurseId;
            }
            if (dateFrom || dateTo) {
                whereClause.scheduledAt = {};
                if (dateFrom) {
                    whereClause.scheduledAt[sequelize_2.Op.gte] = new Date(dateFrom);
                }
                if (dateTo) {
                    whereClause.scheduledAt[sequelize_2.Op.lte] = new Date(dateTo);
                }
            }
            const total = await this.appointmentModel.count({ where: whereClause });
            const noShows = await this.appointmentModel.count({
                where: { ...whereClause, status: models_1.AppointmentStatus.NO_SHOW },
            });
            const rate = total > 0 ? (noShows / total) * 100 : 0;
            return {
                rate,
                total,
                noShows,
                byStudent: [],
            };
        }
        catch (error) {
            this.logError(`Error getting no-show stats: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to get no-show statistics');
        }
    }
    async getNoShowCount(studentId, daysBack = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysBack);
        return await this.appointmentModel.count({
            where: {
                studentId,
                status: models_1.AppointmentStatus.NO_SHOW,
                scheduledAt: {
                    [sequelize_2.Op.gte]: cutoffDate,
                },
            },
        });
    }
    async getUtilizationStats(nurseId, dateFrom, dateTo) {
        this.logInfo('Getting utilization statistics');
        try {
            const fromDate = new Date(dateFrom);
            const toDate = new Date(dateTo);
            const totalAppointments = await this.appointmentModel.count({
                where: {
                    nurseId,
                    scheduledAt: {
                        [sequelize_2.Op.gte]: fromDate,
                        [sequelize_2.Op.lte]: toDate,
                    },
                },
            });
            const bookedSlots = await this.appointmentModel.count({
                where: {
                    nurseId,
                    scheduledAt: {
                        [sequelize_2.Op.gte]: fromDate,
                        [sequelize_2.Op.lte]: toDate,
                    },
                    status: {
                        [sequelize_2.Op.in]: [
                            models_1.AppointmentStatus.SCHEDULED,
                            models_1.AppointmentStatus.IN_PROGRESS,
                            models_1.AppointmentStatus.COMPLETED,
                        ],
                    },
                },
            });
            const businessDays = this.calculateBusinessDays(fromDate, toDate);
            const businessHours = appointment_validation_1.AppointmentValidation.getBusinessHours();
            const hoursPerDay = businessHours.end - businessHours.start;
            const slotsPerDay = (hoursPerDay * 60) / 30;
            const totalSlots = businessDays * slotsPerDay;
            const availableSlots = totalSlots - bookedSlots;
            const utilizationRate = totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;
            return {
                utilizationRate,
                totalSlots,
                bookedSlots,
                availableSlots,
                byDay: [],
            };
        }
        catch (error) {
            this.logError(`Error getting utilization stats: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to get utilization statistics');
        }
    }
    async exportCalendar(nurseId, dateFrom, dateTo) {
        this.logInfo('Exporting calendar');
        try {
            const whereClause = { nurseId };
            if (dateFrom || dateTo) {
                whereClause.scheduledAt = {};
                if (dateFrom) {
                    whereClause.scheduledAt[sequelize_2.Op.gte] = new Date(dateFrom);
                }
                if (dateTo) {
                    whereClause.scheduledAt[sequelize_2.Op.lte] = new Date(dateTo);
                }
            }
            const appointments = await this.appointmentModel.findAll({
                where: whereClause,
                order: [['scheduledAt', 'ASC']],
            });
            let icalContent = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//White Cross//Appointments//EN\r\n';
            for (const appointment of appointments) {
                const startTime = appointment.scheduledAt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                const endTime = new Date(appointment.scheduledAt.getTime() + appointment.duration * 60000)
                    .toISOString()
                    .replace(/[-:]/g, '')
                    .split('.')[0] + 'Z';
                icalContent += 'BEGIN:VEVENT\r\n';
                icalContent += `UID:${appointment.id}@whitecross.edu\r\n`;
                icalContent += `DTSTART:${startTime}\r\n`;
                icalContent += `DTEND:${endTime}\r\n`;
                icalContent += `SUMMARY:${appointment.reason || 'Appointment'}\r\n`;
                icalContent += `DESCRIPTION:${appointment.notes || ''}\r\n`;
                icalContent += 'END:VEVENT\r\n';
            }
            icalContent += 'END:VCALENDAR\r\n';
            return icalContent;
        }
        catch (error) {
            this.logError(`Error exporting calendar: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to export calendar');
        }
    }
    calculateBusinessDays(startDate, endDate) {
        let businessDays = 0;
        const current = new Date(startDate);
        while (current <= endDate) {
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                businessDays++;
            }
            current.setDate(current.getDate() + 1);
        }
        return businessDays;
    }
    mapToEntity(appointment) {
        return {
            id: appointment.id,
            studentId: appointment.studentId,
            nurseId: appointment.nurseId,
            type: appointment.type,
            appointmentType: appointment.type,
            scheduledAt: appointment.scheduledAt,
            duration: appointment.duration,
            reason: appointment.reason,
            notes: appointment.notes,
            status: appointment.status,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt,
            nurse: appointment.nurse
                ? {
                    id: appointment.nurse.id,
                    firstName: appointment.nurse.firstName,
                    lastName: appointment.nurse.lastName,
                    email: appointment.nurse.email,
                    role: appointment.nurse.role || 'NURSE',
                }
                : undefined,
        };
    }
};
exports.AppointmentStatisticsService = AppointmentStatisticsService;
exports.AppointmentStatisticsService = AppointmentStatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Appointment)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.User)),
    __metadata("design:paramtypes", [Object, Object])
], AppointmentStatisticsService);
//# sourceMappingURL=appointment-statistics.service.js.map