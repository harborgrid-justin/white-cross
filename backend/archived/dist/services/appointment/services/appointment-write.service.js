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
exports.AppointmentWriteService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const event_emitter_1 = require("@nestjs/event-emitter");
const sequelize_2 = require("sequelize");
const uuid_1 = require("uuid");
const app_config_service_1 = require("../../../common/config/app-config.service");
const appointment_events_1 = require("../events/appointment.events");
const models_1 = require("../../../database/models");
const appointment_validation_1 = require("../validators/appointment-validation");
const status_transitions_1 = require("../validators/status-transitions");
const models_2 = require("../../../database/models");
const models_3 = require("../../../database/models");
const models_4 = require("../../../database/models");
const models_5 = require("../../../database/models");
const base_1 = require("../../../common/base");
let AppointmentWriteService = class AppointmentWriteService extends base_1.BaseService {
    sequelize;
    appointmentModel;
    reminderModel;
    waitlistModel;
    userModel;
    eventEmitter;
    configService;
    constructor(sequelize, appointmentModel, reminderModel, waitlistModel, userModel, eventEmitter, configService) {
        super('AppointmentWriteService');
        this.sequelize = sequelize;
        this.appointmentModel = appointmentModel;
        this.reminderModel = reminderModel;
        this.waitlistModel = waitlistModel;
        this.userModel = userModel;
        this.eventEmitter = eventEmitter;
        this.configService = configService;
    }
    async createAppointment(createDto) {
        this.logInfo(`Creating appointment for student: ${createDto.studentId}`);
        const transaction = await this.sequelize.transaction();
        try {
            await appointment_validation_1.AppointmentValidation.validateCreateAppointment(createDto);
            await this.checkAvailability(createDto, transaction);
            await this.validateDailyAppointmentLimit(createDto.nurseId, createDto.scheduledFor, transaction);
            const appointment = await this.appointmentModel.create({
                id: (0, uuid_1.v4)(),
                nurseId: createDto.nurseId,
                studentId: createDto.studentId,
                scheduledFor: createDto.scheduledFor,
                duration: createDto.duration,
                type: createDto.type,
                status: models_2.AppointmentStatus.SCHEDULED,
                notes: createDto.notes,
                reason: createDto.reason,
                location: createDto.location,
                createdAt: new Date(),
                updatedAt: new Date(),
            }, { transaction });
            await this.scheduleReminders(appointment, transaction);
            await this.processWaitlistForSlot(createDto.scheduledFor, createDto.nurseId, transaction);
            await transaction.commit();
            this.eventEmitter.emit('appointment.created', new appointment_events_1.AppointmentCreatedEvent(appointment.id, appointment.nurseId, appointment.studentId));
            return this.mapToEntity(appointment);
        }
        catch (error) {
            await transaction.rollback();
            this.logError(`Error creating appointment: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error.stack : undefined);
            throw error;
        }
    }
    async updateAppointment(id, updateDto) {
        this.logInfo(`Updating appointment: ${id}`);
        const transaction = await this.sequelize.transaction();
        try {
            const appointment = await this.appointmentModel.findByPk(id, { transaction });
            if (!appointment) {
                throw new common_1.NotFoundException(`Appointment with ID ${id} not found`);
            }
            if (updateDto.status && updateDto.status !== appointment.status) {
                status_transitions_1.AppointmentStatusTransitions.validateTransition(appointment.status, updateDto.status);
            }
            if (updateDto.scheduledFor && updateDto.scheduledFor !== appointment.scheduledFor) {
                await this.checkAvailability({
                    ...appointment.toJSON(),
                    scheduledFor: updateDto.scheduledFor,
                }, transaction, id);
            }
            const updatedAppointment = await appointment.update({
                ...updateDto,
                updatedAt: new Date(),
            }, { transaction });
            await transaction.commit();
            this.eventEmitter.emit('appointment.updated', new appointment_events_1.AppointmentUpdatedEvent(id, updatedAppointment.nurseId, updatedAppointment.studentId));
            return this.mapToEntity(updatedAppointment);
        }
        catch (error) {
            await transaction.rollback();
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logError(`Error updating appointment: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error.stack : undefined);
            throw error;
        }
    }
    async cancelAppointment(id, reason) {
        this.logInfo(`Cancelling appointment: ${id}`);
        const transaction = await this.sequelize.transaction();
        try {
            const appointment = await this.appointmentModel.findByPk(id, { transaction });
            if (!appointment) {
                throw new common_1.NotFoundException(`Appointment with ID ${id} not found`);
            }
            status_transitions_1.AppointmentStatusTransitions.validateTransition(appointment.status, models_2.AppointmentStatus.CANCELLED);
            const updatedAppointment = await appointment.update({
                status: models_2.AppointmentStatus.CANCELLED,
                notes: reason
                    ? `${appointment.notes || ''}\nCancellation reason: ${reason}`.trim()
                    : appointment.notes,
                updatedAt: new Date(),
            }, { transaction });
            await this.reminderModel.update({ status: models_3.ReminderStatus.CANCELLED }, {
                where: { appointmentId: id },
                transaction,
            });
            await this.processWaitlistForSlot(appointment.scheduledFor, appointment.nurseId, transaction);
            await transaction.commit();
            this.eventEmitter.emit('appointment.cancelled', new appointment_events_1.AppointmentCancelledEvent(id, appointment.nurseId, appointment.studentId, reason));
            return this.mapToEntity(updatedAppointment);
        }
        catch (error) {
            await transaction.rollback();
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logError(`Error cancelling appointment: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error.stack : undefined);
            throw error;
        }
    }
    async checkAvailability(appointmentData, transaction, excludeId) {
        const { scheduledFor, duration = 30, nurseId } = appointmentData;
        const endTime = new Date(scheduledFor.getTime() + duration * 60000);
        const conflictingAppointment = await this.appointmentModel.findOne({
            where: {
                nurseId,
                status: {
                    [sequelize_2.Op.in]: [models_2.AppointmentStatus.SCHEDULED, models_2.AppointmentStatus.CONFIRMED],
                },
                [sequelize_2.Op.or]: [
                    {
                        [sequelize_2.Op.and]: [
                            { scheduledFor: { [sequelize_2.Op.lt]: endTime } },
                            {
                                [sequelize_2.Op.and]: sequelize_2.Sequelize.where(sequelize_2.Sequelize.fn('DATE_ADD', sequelize_2.Sequelize.col('scheduledFor'), sequelize_2.Sequelize.literal('INTERVAL `Appointment`.`duration` MINUTE')), '>', scheduledFor),
                            },
                        ],
                    },
                ],
                ...(excludeId && { id: { [sequelize_2.Op.ne]: excludeId } }),
            },
            transaction,
        });
        if (conflictingAppointment) {
            throw new common_1.BadRequestException('Time slot is not available');
        }
    }
    async validateDailyAppointmentLimit(nurseId, date, transaction) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const dailyCount = await this.appointmentModel.count({
            where: {
                nurseId,
                scheduledFor: {
                    [sequelize_2.Op.between]: [startOfDay, endOfDay],
                },
                status: {
                    [sequelize_2.Op.in]: [models_2.AppointmentStatus.SCHEDULED, models_2.AppointmentStatus.CONFIRMED],
                },
            },
            transaction,
        });
        const maxDailyAppointments = this.configService.get('MAX_DAILY_APPOINTMENTS') || 8;
        if (dailyCount >= maxDailyAppointments) {
            throw new common_1.BadRequestException(`Daily appointment limit (${maxDailyAppointments}) exceeded for this nurse`);
        }
    }
    async scheduleReminders(appointment, transaction) {
        const reminderTimes = [
            { minutes: 60, type: '1_hour_before' },
            { minutes: 24 * 60, type: '1_day_before' },
        ];
        for (const { minutes, type } of reminderTimes) {
            const reminderTime = new Date(appointment.scheduledFor.getTime() - minutes * 60000);
            if (reminderTime > new Date()) {
                await this.reminderModel.create({
                    id: (0, uuid_1.v4)(),
                    appointmentId: appointment.id,
                    scheduledFor: reminderTime,
                    type,
                    status: models_3.ReminderStatus.SCHEDULED,
                    message: `Appointment reminder: ${appointment.reason || 'Scheduled appointment'}`,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }, { transaction });
            }
        }
    }
    async processWaitlistForSlot(scheduledFor, nurseId, transaction) {
        const waitlistEntries = await this.waitlistModel.findAll({
            where: {
                nurseId,
                preferredDate: scheduledFor,
                status: models_4.WaitlistStatus.WAITING,
            },
            order: [['createdAt', 'ASC']],
            transaction,
        });
        if (waitlistEntries.length > 0) {
            await waitlistEntries[0].update({ status: models_4.WaitlistStatus.NOTIFIED }, { transaction });
            this.logInfo(`Notified student ${waitlistEntries[0].studentId} about available slot`);
        }
    }
    mapToEntity(appointment) {
        return {
            id: appointment.id,
            nurseId: appointment.nurseId,
            studentId: appointment.studentId,
            scheduledFor: appointment.scheduledFor,
            duration: appointment.duration,
            type: appointment.type,
            status: appointment.status,
            notes: appointment.notes,
            reason: appointment.reason,
            location: appointment.location,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt,
        };
    }
};
exports.AppointmentWriteService = AppointmentWriteService;
exports.AppointmentWriteService = AppointmentWriteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __param(1, (0, sequelize_1.InjectModel)(models_1.Appointment)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.AppointmentReminder)),
    __param(3, (0, sequelize_1.InjectModel)(models_4.AppointmentWaitlist)),
    __param(4, (0, sequelize_1.InjectModel)(models_5.User)),
    __metadata("design:paramtypes", [sequelize_2.Sequelize, Object, Object, Object, Object, event_emitter_1.EventEmitter2,
        app_config_service_1.AppConfigService])
], AppointmentWriteService);
//# sourceMappingURL=appointment-write.service.js.map