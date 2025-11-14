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
var MedicationReminderProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationReminderProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const bullmq_1 = require("bullmq");
const job_type_enum_1 = require("../enums/job-type.enum");
const base_processor_1 = require("../base/base.processor");
const reminder_generator_service_1 = require("../services/reminder-generator.service");
const reminder_cache_service_1 = require("../services/reminder-cache.service");
const reminder_notification_service_1 = require("../services/reminder-notification.service");
let MedicationReminderProcessor = MedicationReminderProcessor_1 = class MedicationReminderProcessor extends base_processor_1.BaseJobProcessor {
    reminderGenerator;
    reminderCache;
    reminderNotification;
    constructor(reminderGenerator, reminderCache, reminderNotification) {
        super(MedicationReminderProcessor_1.name);
        this.reminderGenerator = reminderGenerator;
        this.reminderCache = reminderCache;
        this.reminderNotification = reminderNotification;
    }
    async processMedicationReminder(job) {
        const { organizationId, medicationId, studentId } = job.data;
        this.logger.log('Processing medication reminder job', {
            jobId: job.id,
            organizationId,
            medicationId,
            studentId,
        });
        try {
            this.logger.log('Starting medication reminder generation job');
            const startTime = Date.now();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const reminders = await this.reminderGenerator.generateRemindersOptimized(today, organizationId, studentId, medicationId);
            this.reminderCache.cacheReminders(reminders, today, organizationId, studentId);
            const notificationResults = await this.reminderNotification.sendReminderNotifications(reminders, job.id?.toString());
            const duration = Date.now() - startTime;
            this.logger.log(`Medication reminder job completed: ${reminders.length} reminders generated, ${notificationResults.sent} notifications sent in ${duration}ms`);
            return {
                processed: reminders.length,
                reminders,
                notificationsSent: notificationResults.sent,
                notificationsFailed: notificationResults.failed,
                duration,
            };
        }
        catch (error) {
            this.logger.error('Error processing medication reminder job', error);
            throw error;
        }
    }
    async generateForStudent(studentId, date) {
        return this.reminderGenerator.generateForStudent(studentId, date);
    }
    async getMedicationReminders(date = new Date(), organizationId, studentId) {
        const cached = this.reminderCache.getCachedReminders(date, organizationId, studentId);
        if (cached) {
            return cached;
        }
        this.logger.debug(`Cache miss, generating reminders`);
        const reminders = await this.reminderGenerator.generateRemindersOptimized(date, organizationId, studentId);
        this.reminderCache.cacheReminders(reminders, date, organizationId, studentId);
        return reminders;
    }
    async invalidateStudentReminders(studentId) {
        await this.reminderCache.invalidateStudentReminders(studentId);
    }
    async invalidateOrganizationReminders(organizationId) {
        await this.reminderCache.invalidateOrganizationReminders(organizationId);
    }
    async retryFailedReminders(date = new Date()) {
        this.logger.log('Retrying failed reminder notifications');
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            const reminders = await this.getMedicationReminders(date);
            const results = await this.reminderNotification.sendReminderNotifications(reminders);
            this.logger.log(`Retry complete: ${results.sent} notifications resent`);
            return results.sent;
        }
        catch (error) {
            this.logger.error('Failed to retry reminder notifications', error);
            throw error;
        }
    }
};
exports.MedicationReminderProcessor = MedicationReminderProcessor;
__decorate([
    (0, bull_1.Process)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_1.Job]),
    __metadata("design:returntype", Promise)
], MedicationReminderProcessor.prototype, "processMedicationReminder", null);
exports.MedicationReminderProcessor = MedicationReminderProcessor = MedicationReminderProcessor_1 = __decorate([
    (0, bull_1.Processor)(job_type_enum_1.JobType.MEDICATION_REMINDER),
    __metadata("design:paramtypes", [reminder_generator_service_1.ReminderGeneratorService,
        reminder_cache_service_1.ReminderCacheService,
        reminder_notification_service_1.ReminderNotificationService])
], MedicationReminderProcessor);
//# sourceMappingURL=medication-reminder.processor.js.map