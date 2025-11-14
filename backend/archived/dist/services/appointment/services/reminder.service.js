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
exports.ReminderService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const uuid_1 = require("uuid");
const models_1 = require("../../../database/models");
const models_2 = require("../../../database/models");
const base_1 = require("../../../common/base");
let ReminderService = class ReminderService extends base_1.BaseService {
    reminderModel;
    appointmentModel;
    constructor(reminderModel, appointmentModel) {
        super('ReminderService');
        this.reminderModel = reminderModel;
        this.appointmentModel = appointmentModel;
    }
    async processPendingReminders() {
        this.logInfo('Processing pending reminders');
        try {
            const now = new Date();
            const cutoffTime = new Date(now.getTime() + 5 * 60000);
            const pendingReminders = await this.reminderModel.findAll({
                where: {
                    status: models_1.ReminderStatus.SCHEDULED,
                    scheduledFor: {
                        [sequelize_2.Op.lte]: cutoffTime,
                    },
                },
            });
            let sent = 0;
            let failed = 0;
            const errors = [];
            for (const reminder of pendingReminders) {
                try {
                    await reminder.update({
                        status: models_1.ReminderStatus.SENT,
                        sentAt: new Date(),
                    });
                    sent++;
                }
                catch (error) {
                    await reminder.update({
                        status: models_1.ReminderStatus.FAILED,
                    });
                    failed++;
                    errors.push({
                        reminderId: reminder.id,
                        error: error instanceof Error ? error.message : 'Unknown error',
                    });
                }
            }
            return {
                total: pendingReminders.length,
                sent,
                failed,
                errors: errors.length > 0 ? errors : undefined,
            };
        }
        catch (error) {
            this.logError(`Error processing reminders: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error.stack : undefined);
            throw new common_1.BadRequestException('Failed to process reminders');
        }
    }
    async getAppointmentReminders(appointmentId) {
        this.logInfo(`Getting reminders for appointment: ${appointmentId}`);
        try {
            const reminders = await this.reminderModel.findAll({
                where: { appointmentId },
                order: [['scheduledFor', 'ASC']],
            });
            return { reminders };
        }
        catch (error) {
            this.logError(`Error getting appointment reminders: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error.stack : undefined);
            throw new common_1.BadRequestException('Failed to get appointment reminders');
        }
    }
    async createAppointmentReminder(appointmentId, createDto) {
        this.logInfo(`Creating reminder for appointment: ${appointmentId}`);
        try {
            const appointment = await this.appointmentModel.findByPk(appointmentId);
            if (!appointment) {
                throw new common_1.NotFoundException(`Appointment with ID ${appointmentId} not found`);
            }
            const reminder = await this.reminderModel.create({
                id: (0, uuid_1.v4)(),
                appointmentId,
                scheduledFor: createDto.scheduledFor,
                type: createDto.type,
                status: models_1.ReminderStatus.SCHEDULED,
                message: createDto.message,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return { reminder };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logError(`Error creating reminder: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error.stack : undefined);
            throw new common_1.BadRequestException('Failed to create reminder');
        }
    }
};
exports.ReminderService = ReminderService;
exports.ReminderService = ReminderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.AppointmentReminder)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.Appointment)),
    __metadata("design:paramtypes", [Object, Object])
], ReminderService);
//# sourceMappingURL=reminder.service.js.map