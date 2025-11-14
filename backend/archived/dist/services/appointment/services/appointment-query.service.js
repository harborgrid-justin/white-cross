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
exports.AppointmentQueryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const models_1 = require("../../../database/models");
const models_2 = require("../../../database/models");
const models_3 = require("../../../database/models");
const appointment_scheduling_service_1 = require("./appointment-scheduling.service");
const base_1 = require("../../../common/base");
let AppointmentQueryService = class AppointmentQueryService extends base_1.BaseService {
    appointmentModel;
    userModel;
    schedulingService;
    constructor(appointmentModel, userModel, schedulingService) {
        super('AppointmentQueryService');
        this.appointmentModel = appointmentModel;
        this.userModel = userModel;
        this.schedulingService = schedulingService;
    }
    async getAppointmentsByDate(dateStr) {
        this.logInfo(`Fetching appointments for date: ${dateStr}`);
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
                throw new common_1.BadRequestException('Invalid date format. Expected YYYY-MM-DD');
            }
            const dayStart = new Date(date);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);
            const appointments = await this.appointmentModel.findAll({
                where: {
                    scheduledAt: {
                        [sequelize_2.Op.gte]: dayStart,
                        [sequelize_2.Op.lte]: dayEnd,
                    },
                },
                order: [['scheduledAt', 'ASC']],
                include: [
                    {
                        model: models_3.User,
                        as: 'nurse',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
                    },
                ],
            });
            const data = appointments.map((apt) => this.mapToEntity(apt));
            return { data };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logError(`Error fetching appointments by date: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to fetch appointments by date');
        }
    }
    async getUpcomingAppointments(nurseId, limit = 10) {
        this.logInfo(`Fetching upcoming appointments for nurse: ${nurseId}`);
        try {
            const now = new Date();
            const appointments = await this.appointmentModel.findAll({
                where: {
                    nurseId,
                    scheduledAt: {
                        [sequelize_2.Op.gte]: now,
                    },
                    status: {
                        [sequelize_2.Op.in]: [models_2.AppointmentStatus.SCHEDULED, models_2.AppointmentStatus.IN_PROGRESS],
                    },
                },
                order: [['scheduledAt', 'ASC']],
                limit,
                include: [
                    {
                        model: models_3.User,
                        as: 'nurse',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
                    },
                ],
            });
            return appointments.map((apt) => this.mapToEntity(apt));
        }
        catch (error) {
            this.logError(`Error fetching upcoming appointments: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to fetch upcoming appointments');
        }
    }
    async getGeneralUpcomingAppointments(limit = 50) {
        this.logInfo(`Fetching general upcoming appointments`);
        try {
            const now = new Date();
            const futureDate = new Date();
            futureDate.setDate(now.getDate() + 7);
            const appointments = await this.appointmentModel.findAll({
                where: {
                    scheduledAt: {
                        [sequelize_2.Op.gte]: now,
                        [sequelize_2.Op.lte]: futureDate,
                    },
                    status: {
                        [sequelize_2.Op.in]: [models_2.AppointmentStatus.SCHEDULED, models_2.AppointmentStatus.IN_PROGRESS],
                    },
                },
                order: [['scheduledAt', 'ASC']],
                limit,
                include: [
                    {
                        model: models_3.User,
                        as: 'nurse',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
                    },
                ],
            });
            const data = appointments.map((apt) => this.mapToEntity(apt));
            return { data };
        }
        catch (error) {
            this.logError(`Error fetching general upcoming appointments: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to fetch upcoming appointments');
        }
    }
    async checkAvailability(nurseId, startTime, duration, excludeAppointmentId) {
        return this.schedulingService.checkAvailability(nurseId, startTime, duration, excludeAppointmentId);
    }
    async getAvailableSlots(nurseId, dateFrom, dateTo, duration = 30) {
        this.logInfo(`Getting available slots for nurse: ${nurseId}`);
        try {
            const startDate = dateFrom ? new Date(dateFrom) : new Date();
            const endDate = dateTo ? new Date(dateTo) : new Date(startDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (startDate < today) {
                startDate.setTime(today.getTime());
            }
            const allSlots = [];
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                const daySlots = await this.schedulingService.getAvailableSlots(nurseId, currentDate, duration);
                allSlots.push(...daySlots);
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return allSlots;
        }
        catch (error) {
            this.logError(`Error getting available slots: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to get available slots');
        }
    }
};
exports.AppointmentQueryService = AppointmentQueryService;
exports.AppointmentQueryService = AppointmentQueryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Appointment)),
    __param(1, (0, sequelize_1.InjectModel)(models_3.User)),
    __metadata("design:paramtypes", [Object, Object, appointment_scheduling_service_1.AppointmentSchedulingService])
], AppointmentQueryService);
//# sourceMappingURL=appointment-query.service.js.map