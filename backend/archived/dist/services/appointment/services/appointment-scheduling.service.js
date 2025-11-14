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
exports.AppointmentSchedulingService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const appointment_validation_1 = require("../validators/appointment-validation");
const models_1 = require("../../../database/models");
const models_2 = require("../../../database/models");
const base_1 = require("../../../common/base");
let AppointmentSchedulingService = class AppointmentSchedulingService extends base_1.BaseService {
    appointmentModel;
    userModel;
    constructor(appointmentModel, userModel) {
        super('AppointmentSchedulingService');
        this.appointmentModel = appointmentModel;
        this.userModel = userModel;
    }
    async checkAvailability(nurseId, startTime, duration, excludeAppointmentId) {
        this.logInfo(`Checking availability for nurse: ${nurseId}`);
        const bufferMinutes = appointment_validation_1.AppointmentValidation.BUFFER_TIME_MINUTES;
        const slotStart = new Date(startTime.getTime() - bufferMinutes * 60000);
        const slotEnd = new Date(startTime.getTime() + (duration + bufferMinutes) * 60000);
        try {
            const whereClause = {
                nurseId,
                status: {
                    [sequelize_2.Op.in]: [models_1.AppointmentStatus.SCHEDULED, models_1.AppointmentStatus.IN_PROGRESS],
                },
                [sequelize_2.Op.or]: [
                    {
                        scheduledAt: {
                            [sequelize_2.Op.gte]: slotStart,
                            [sequelize_2.Op.lt]: slotEnd,
                        },
                    },
                    {
                        [sequelize_2.Op.and]: [
                            sequelize_2.Sequelize.where(sequelize_2.Sequelize.fn('DATE_ADD', sequelize_2.Sequelize.col('scheduled_at'), sequelize_2.Sequelize.literal('INTERVAL duration MINUTE')), sequelize_2.Op.gt, slotStart),
                            sequelize_2.Sequelize.where(sequelize_2.Sequelize.col('scheduled_at'), sequelize_2.Op.lt, slotEnd),
                        ],
                    },
                ],
            };
            if (excludeAppointmentId) {
                whereClause.id = { [sequelize_2.Op.ne]: excludeAppointmentId };
            }
            const conflicts = await this.appointmentModel.findAll({
                where: whereClause,
                include: [
                    {
                        model: models_2.User,
                        as: 'nurse',
                        attributes: ['id', 'firstName', 'lastName'],
                    },
                ],
            });
            return conflicts.map((apt) => this.mapToEntity(apt));
        }
        catch (error) {
            this.logError(`Error checking availability: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to check availability');
        }
    }
    async getAvailableSlots(nurseId, date, slotDuration = 30) {
        this.logInfo(`Getting available slots for nurse: ${nurseId} on ${date}`);
        const businessHours = appointment_validation_1.AppointmentValidation.getBusinessHours();
        const slots = [];
        const dayStart = new Date(date);
        dayStart.setHours(businessHours.start, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(businessHours.end, 0, 0, 0);
        let currentSlotStart = new Date(dayStart);
        while (currentSlotStart < dayEnd) {
            const currentSlotEnd = new Date(currentSlotStart.getTime() + slotDuration * 60000);
            if (currentSlotEnd > dayEnd) {
                break;
            }
            const conflicts = await this.checkAvailability(nurseId, currentSlotStart, slotDuration);
            slots.push({
                startTime: new Date(currentSlotStart),
                endTime: currentSlotEnd,
                nurseId,
                isAvailable: conflicts.length === 0,
                duration: slotDuration,
                unavailabilityReason: conflicts.length > 0
                    ? `Conflicting appointment: ${conflicts[0].reason || 'Scheduled'}`
                    : undefined,
            });
            currentSlotStart = new Date(currentSlotStart.getTime() + slotDuration * 60000);
        }
        return slots;
    }
    async checkConflicts(nurseId, startTime, duration, excludeAppointmentId) {
        this.logInfo('Checking scheduling conflicts');
        try {
            const startDateTime = new Date(startTime);
            const conflicts = await this.checkAvailability(nurseId, startDateTime, duration, excludeAppointmentId);
            const availableSlots = await this.getAvailableSlots(nurseId, startDateTime, duration);
            return {
                hasConflict: conflicts.length > 0,
                conflicts,
                availableSlots: availableSlots.filter((slot) => slot.isAvailable),
            };
        }
        catch (error) {
            this.logError(`Error checking conflicts: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to check conflicts');
        }
    }
    async validateDailyAppointmentLimit(nurseId, date) {
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);
        const count = await this.appointmentModel.count({
            where: {
                nurseId,
                scheduledAt: {
                    [sequelize_2.Op.gte]: dayStart,
                    [sequelize_2.Op.lte]: dayEnd,
                },
                status: {
                    [sequelize_2.Op.in]: [models_1.AppointmentStatus.SCHEDULED, models_1.AppointmentStatus.IN_PROGRESS],
                },
            },
        });
        if (count >= 20) {
            throw new common_1.BadRequestException('Nurse has reached maximum daily appointment limit (20)');
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
exports.AppointmentSchedulingService = AppointmentSchedulingService;
exports.AppointmentSchedulingService = AppointmentSchedulingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Appointment)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.User)),
    __metadata("design:paramtypes", [Object, Object])
], AppointmentSchedulingService);
//# sourceMappingURL=appointment-scheduling.service.js.map