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
exports.ReminderSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const base_1 = require("../common/base");
const enterprise_features_interfaces_1 = require("./enterprise-features-interfaces");
let ReminderSchedulerService = class ReminderSchedulerService extends base_1.BaseService {
    eventEmitter;
    reminderSchedules = [];
    reminderPreferences = new Map();
    constructor(eventEmitter) {
        super('ReminderSchedulerService');
        this.eventEmitter = eventEmitter;
    }
    scheduleReminders(appointmentId) {
        try {
            const schedule = {
                appointmentId,
                reminders: [
                    { timing: enterprise_features_interfaces_1.ReminderTiming.HOURS_24, channel: enterprise_features_interfaces_1.CommunicationChannel.EMAIL, sent: false },
                    { timing: enterprise_features_interfaces_1.ReminderTiming.HOURS_1, channel: enterprise_features_interfaces_1.CommunicationChannel.SMS, sent: false },
                    { timing: enterprise_features_interfaces_1.ReminderTiming.MINUTES_15, channel: enterprise_features_interfaces_1.CommunicationChannel.PUSH, sent: false },
                ],
            };
            this.reminderSchedules.push(schedule);
            this.logInfo('Reminders scheduled for appointment', {
                appointmentId,
                reminderCount: schedule.reminders.length,
            });
            this.eventEmitter.emit('reminders.scheduled', {
                appointmentId,
                schedule,
                timestamp: new Date(),
            });
            return Promise.resolve(schedule);
        }
        catch (error) {
            this.logError('Error scheduling reminders', {
                error: error instanceof Error ? error.message : String(error),
                appointmentId,
            });
            throw error;
        }
    }
    sendDueReminders() {
        try {
            let sentCount = 0;
            const now = new Date();
            for (const schedule of this.reminderSchedules) {
                for (const reminder of schedule.reminders) {
                    if (!reminder.sent) {
                        reminder.sent = true;
                        reminder.sentAt = now;
                        sentCount++;
                        this.logInfo('Reminder sent', {
                            appointmentId: schedule.appointmentId,
                            timing: reminder.timing,
                            channel: reminder.channel,
                        });
                    }
                }
            }
            this.logInfo('Due reminders sent', { sentCount });
            this.eventEmitter.emit('reminders.sent', {
                sentCount,
                timestamp: new Date(),
            });
            return Promise.resolve(sentCount);
        }
        catch (error) {
            this.logError('Error sending due reminders', {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    customizeReminderPreferences(studentId, preferences) {
        try {
            this.validateReminderPreferences(preferences);
            this.reminderPreferences.set(studentId, preferences);
            this.logInfo('Reminder preferences updated', {
                studentId,
                preferences: {
                    emailEnabled: preferences.emailEnabled,
                    smsEnabled: preferences.smsEnabled,
                    pushEnabled: preferences.pushEnabled,
                    advanceNotice: preferences.advanceNotice,
                },
            });
            this.eventEmitter.emit('reminder-preferences.updated', {
                studentId,
                preferences,
                timestamp: new Date(),
            });
            return Promise.resolve(true);
        }
        catch (error) {
            this.logError('Error customizing reminder preferences', {
                error: error instanceof Error ? error.message : String(error),
                studentId,
            });
            throw error;
        }
    }
    getReminderPreferences(studentId) {
        try {
            const preferences = this.reminderPreferences.get(studentId);
            if (preferences) {
                this.logInfo('Reminder preferences retrieved', { studentId });
            }
            else {
                this.logInfo('No reminder preferences found for student', { studentId });
            }
            return preferences || null;
        }
        catch (error) {
            this.logError('Error getting reminder preferences', {
                error: error instanceof Error ? error.message : String(error),
                studentId,
            });
            throw error;
        }
    }
    getReminderSchedule(appointmentId) {
        try {
            const schedule = this.reminderSchedules.find((s) => s.appointmentId === appointmentId);
            if (schedule) {
                this.logInfo('Reminder schedule retrieved', { appointmentId });
            }
            else {
                this.logInfo('No reminder schedule found for appointment', { appointmentId });
            }
            return schedule || null;
        }
        catch (error) {
            this.logError('Error getting reminder schedule', {
                error: error instanceof Error ? error.message : String(error),
                appointmentId,
            });
            throw error;
        }
    }
    getReminderStatistics() {
        try {
            const stats = {
                totalSchedules: this.reminderSchedules.length,
                totalReminders: this.reminderSchedules.reduce((sum, schedule) => sum + schedule.reminders.length, 0),
                sentReminders: this.reminderSchedules.reduce((sum, schedule) => sum + schedule.reminders.filter((r) => r.sent).length, 0),
                pendingReminders: this.reminderSchedules.reduce((sum, schedule) => sum + schedule.reminders.filter((r) => !r.sent).length, 0),
                preferencesSet: this.reminderPreferences.size,
            };
            this.logInfo('Reminder statistics retrieved', stats);
            return stats;
        }
        catch (error) {
            this.logError('Error getting reminder statistics', {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    validateReminderPreferences(preferences) {
        if (preferences.quietHours) {
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(preferences.quietHours.start)) {
                throw new Error('Invalid quiet hours start time format. Use HH:MM format.');
            }
            if (!timeRegex.test(preferences.quietHours.end)) {
                throw new Error('Invalid quiet hours end time format. Use HH:MM format.');
            }
        }
    }
};
exports.ReminderSchedulerService = ReminderSchedulerService;
exports.ReminderSchedulerService = ReminderSchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], ReminderSchedulerService);
//# sourceMappingURL=reminder-scheduler.service.js.map