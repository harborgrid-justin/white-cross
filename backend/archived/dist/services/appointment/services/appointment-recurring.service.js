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
exports.AppointmentRecurringService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const recurring_dto_1 = require("../dto/recurring.dto");
const models_1 = require("../../../database/models");
const appointment_validation_1 = require("../validators/appointment-validation");
const base_1 = require("../../../common/base");
const models_2 = require("../../../database/models");
const models_3 = require("../../../database/models");
let AppointmentRecurringService = class AppointmentRecurringService extends base_1.BaseService {
    appointmentModel;
    reminderModel;
    sequelize;
    constructor(appointmentModel, reminderModel, sequelize) {
        super('AppointmentRecurringService');
        this.appointmentModel = appointmentModel;
        this.reminderModel = reminderModel;
        this.sequelize = sequelize;
    }
    async createRecurringAppointments(createDto, createAppointmentFn) {
        this.logInfo('Creating recurring appointments');
        try {
            const appointments = [];
            const startDate = new Date(createDto.scheduledAt);
            const endDate = new Date(createDto.recurrence.endDate);
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                let shouldCreate = false;
                switch (createDto.recurrence.frequency) {
                    case recurring_dto_1.RecurrenceFrequency.DAILY:
                        shouldCreate = true;
                        break;
                    case recurring_dto_1.RecurrenceFrequency.WEEKLY:
                        if (!createDto.recurrence.daysOfWeek ||
                            createDto.recurrence.daysOfWeek.includes(currentDate.getDay())) {
                            shouldCreate = true;
                        }
                        break;
                    case recurring_dto_1.RecurrenceFrequency.MONTHLY:
                        if (currentDate.getDate() === startDate.getDate()) {
                            shouldCreate = true;
                        }
                        break;
                }
                if (shouldCreate) {
                    try {
                        const appointmentDto = {
                            studentId: createDto.studentId,
                            nurseId: createDto.nurseId,
                            appointmentType: createDto.type,
                            scheduledDate: new Date(currentDate),
                            duration: createDto.duration,
                            reason: createDto.reason,
                            notes: createDto.notes,
                        };
                        const appointment = await createAppointmentFn(appointmentDto);
                        appointments.push(appointment);
                    }
                    catch (error) {
                        this.logWarning(`Failed to create recurring appointment for ${currentDate.toISOString()}: ${error.message}`);
                    }
                }
                switch (createDto.recurrence.frequency) {
                    case recurring_dto_1.RecurrenceFrequency.DAILY:
                        currentDate.setDate(currentDate.getDate() + createDto.recurrence.interval);
                        break;
                    case recurring_dto_1.RecurrenceFrequency.WEEKLY:
                        currentDate.setDate(currentDate.getDate() + 7 * createDto.recurrence.interval);
                        break;
                    case recurring_dto_1.RecurrenceFrequency.MONTHLY:
                        currentDate.setMonth(currentDate.getMonth() + createDto.recurrence.interval);
                        break;
                }
            }
            return { appointments, count: appointments.length };
        }
        catch (error) {
            this.logError(`Error creating recurring appointments: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to create recurring appointments');
        }
    }
    async bulkCancelAppointments(bulkCancelDto) {
        this.logInfo('Bulk cancelling appointments');
        try {
            const result = await this.sequelize.transaction(async (transaction) => {
                const appointments = await this.appointmentModel.findAll({
                    where: this.sequelize.where(this.sequelize.col('id'), sequelize_2.Op.in, bulkCancelDto.appointmentIds),
                    transaction,
                });
                const validAppointments = [];
                const invalidAppointments = [];
                for (const appointment of appointments) {
                    try {
                        appointment_validation_1.AppointmentValidation.validateCanBeCancelled(appointment.status);
                        appointment_validation_1.AppointmentValidation.validateCancellationNotice(appointment.scheduledAt);
                        validAppointments.push(appointment.id);
                    }
                    catch (error) {
                        this.logWarning(`Cannot cancel appointment ${appointment.id}: ${error.message}`);
                        invalidAppointments.push(appointment.id);
                    }
                }
                if (validAppointments.length === 0) {
                    return { cancelled: 0, failed: bulkCancelDto.appointmentIds.length };
                }
                const [affectedCount] = await this.appointmentModel.update({
                    status: models_2.AppointmentStatus.CANCELLED,
                    notes: this.sequelize.fn('CONCAT', this.sequelize.col('notes'), bulkCancelDto.reason
                        ? `\nCancellation reason: ${bulkCancelDto.reason}`
                        : '\nBulk cancelled'),
                }, {
                    where: this.sequelize.where(this.sequelize.col('id'), sequelize_2.Op.in, validAppointments),
                    transaction,
                });
                if (validAppointments.length > 0) {
                    await this.reminderModel.update({ status: models_3.ReminderStatus.CANCELLED }, {
                        where: this.sequelize.and(this.sequelize.where(this.sequelize.col('appointment_id'), sequelize_2.Op.in, validAppointments), { status: models_3.ReminderStatus.SCHEDULED }),
                        transaction,
                    });
                }
                return {
                    cancelled: affectedCount,
                    failed: bulkCancelDto.appointmentIds.length - affectedCount,
                };
            });
            this.logInfo(`Bulk cancellation completed: ${result.cancelled} cancelled, ${result.failed} failed`);
            return result;
        }
        catch (error) {
            this.logError(`Error in bulk cancellation: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Failed to bulk cancel appointments');
        }
    }
};
exports.AppointmentRecurringService = AppointmentRecurringService;
exports.AppointmentRecurringService = AppointmentRecurringService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Appointment)),
    __param(1, (0, sequelize_1.InjectModel)(models_3.AppointmentReminder)),
    __param(2, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [Object, Object, sequelize_2.Sequelize])
], AppointmentRecurringService);
//# sourceMappingURL=appointment-recurring.service.js.map