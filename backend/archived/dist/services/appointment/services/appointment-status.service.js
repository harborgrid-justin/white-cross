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
exports.AppointmentStatusService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const event_emitter_1 = require("@nestjs/event-emitter");
const models_1 = require("../../../database/models");
const appointment_events_1 = require("../events/appointment.events");
const models_2 = require("../../../database/models");
const appointment_validation_1 = require("../validators/appointment-validation");
const base_1 = require("../../../common/base");
const models_3 = require("../../../database/models");
let AppointmentStatusService = class AppointmentStatusService extends base_1.BaseService {
    appointmentModel;
    eventEmitter;
    constructor(appointmentModel, eventEmitter) {
        super('AppointmentStatusService');
        this.appointmentModel = appointmentModel;
        this.eventEmitter = eventEmitter;
    }
    async startAppointment(id) {
        this.logInfo(`Starting appointment: ${id}`);
        const appointment = await this.appointmentModel.findByPk(id);
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with ID ${id} not found`);
        }
        appointment_validation_1.AppointmentValidation.validateCanBeStarted(appointment.status);
        appointment_validation_1.AppointmentValidation.validateStartTiming(appointment.scheduledAt);
        await appointment.update({
            status: models_3.AppointmentStatus.IN_PROGRESS,
        });
        const updatedAppointment = await this.getAppointmentById(id);
        this.eventEmitter.emit('appointment.started', new appointment_events_1.AppointmentStartedEvent({
            id: updatedAppointment.id,
            studentId: updatedAppointment.studentId,
            nurseId: updatedAppointment.nurseId,
            type: updatedAppointment.type,
            scheduledAt: updatedAppointment.scheduledAt,
            duration: updatedAppointment.duration,
            status: updatedAppointment.status,
        }, {
            userId: updatedAppointment.nurseId,
            userRole: 'NURSE',
            timestamp: new Date(),
        }));
        return updatedAppointment;
    }
    async completeAppointment(id, completionData) {
        this.logInfo(`Completing appointment: ${id}`);
        const appointment = await this.appointmentModel.findByPk(id);
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with ID ${id} not found`);
        }
        appointment_validation_1.AppointmentValidation.validateCanBeCompleted(appointment.status);
        let notes = appointment.notes || '';
        if (completionData?.notes) {
            notes = `${notes}\nCompletion: ${completionData.notes}`;
        }
        if (completionData?.outcomes) {
            notes = `${notes}\nOutcomes: ${completionData.outcomes}`;
        }
        if (completionData?.followUpRequired) {
            notes = `${notes}\nFollow-up required: ${completionData.followUpDate ? completionData.followUpDate.toISOString() : 'Yes'}`;
        }
        await appointment.update({
            status: models_3.AppointmentStatus.COMPLETED,
            notes,
        });
        const completedAppointment = await this.getAppointmentById(id);
        this.eventEmitter.emit('appointment.completed', new appointment_events_1.AppointmentCompletedEvent({
            id: completedAppointment.id,
            studentId: completedAppointment.studentId,
            nurseId: completedAppointment.nurseId,
            type: completedAppointment.type,
            scheduledAt: completedAppointment.scheduledAt,
            duration: completedAppointment.duration,
            status: completedAppointment.status,
        }, completionData?.notes, completionData?.outcomes, completionData?.followUpRequired, {
            userId: completedAppointment.nurseId,
            userRole: 'NURSE',
            timestamp: new Date(),
        }));
        return completedAppointment;
    }
    async markNoShow(id) {
        this.logInfo(`Marking appointment as no-show: ${id}`);
        const appointment = await this.appointmentModel.findByPk(id);
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with ID ${id} not found`);
        }
        appointment_validation_1.AppointmentValidation.validateCanBeMarkedNoShow(appointment.status);
        appointment_validation_1.AppointmentValidation.validateAppointmentPassed(appointment.scheduledAt);
        await appointment.update({
            status: models_3.AppointmentStatus.NO_SHOW,
        });
        const noShowAppointment = await this.getAppointmentById(id);
        this.eventEmitter.emit('appointment.no-show', new appointment_events_1.AppointmentNoShowEvent({
            id: noShowAppointment.id,
            studentId: noShowAppointment.studentId,
            nurseId: noShowAppointment.nurseId,
            type: noShowAppointment.type,
            scheduledAt: noShowAppointment.scheduledAt,
            duration: noShowAppointment.duration,
            status: noShowAppointment.status,
        }, {
            userId: noShowAppointment.nurseId,
            userRole: 'NURSE',
            timestamp: new Date(),
        }));
        return noShowAppointment;
    }
    async getAppointmentById(id) {
        const appointment = await this.appointmentModel.findByPk(id, {
            include: [
                {
                    model: models_1.User,
                    as: 'nurse',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'phone'],
                },
            ],
        });
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with ID ${id} not found`);
        }
        return this.mapToEntity(appointment);
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
exports.AppointmentStatusService = AppointmentStatusService;
exports.AppointmentStatusService = AppointmentStatusService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_2.Appointment)),
    __metadata("design:paramtypes", [Object, event_emitter_1.EventEmitter2])
], AppointmentStatusService);
//# sourceMappingURL=appointment-status.service.js.map