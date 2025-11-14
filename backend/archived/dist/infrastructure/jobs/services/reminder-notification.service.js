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
exports.ReminderNotificationService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const email_1 = require("../../email");
const models_1 = require("../../../database/models");
let ReminderNotificationService = class ReminderNotificationService extends base_1.BaseService {
    sequelize;
    emailService;
    constructor(sequelize, emailService) {
        super("ReminderNotificationService");
        this.sequelize = sequelize;
        this.emailService = emailService;
    }
    async sendReminderNotifications(reminders, jobId) {
        const now = new Date();
        let sent = 0;
        let failed = 0;
        const dueReminders = reminders.filter((reminder) => {
            const hourDiff = Math.abs(now.getHours() - reminder.scheduledTime.getHours());
            return (reminder.status === 'PENDING' &&
                reminder.scheduledTime.getDate() === now.getDate() &&
                hourDiff === 0);
        });
        if (dueReminders.length === 0) {
            this.logDebug('No reminders due for notification at this time');
            return { sent, failed };
        }
        this.logInfo(`Sending notifications for ${dueReminders.length} due reminders`);
        const remindersByStudent = this.groupRemindersByStudent(dueReminders);
        for (const [studentId, studentReminders] of Object.entries(remindersByStudent)) {
            try {
                const contacts = await this.getStudentContacts(studentId);
                if (contacts.length === 0) {
                    this.logWarning(`No contact information found for student ${studentId}`);
                    failed += studentReminders.length;
                    continue;
                }
                for (const contact of contacts) {
                    if (contact.email) {
                        try {
                            await this.sendEmailReminder(contact, studentReminders, jobId);
                            sent++;
                        }
                        catch (error) {
                            this.logError(`Failed to send email reminder to ${contact.email}`, error);
                            failed++;
                        }
                    }
                    if (contact.phone) {
                        this.logDebug(`SMS reminder would be sent to ${contact.phone} (not implemented)`);
                    }
                }
            }
            catch (error) {
                this.logError(`Failed to send notifications for student ${studentId}`, error);
                failed += studentReminders.length;
            }
        }
        this.logInfo(`Notification delivery complete: ${sent} sent, ${failed} failed`);
        return { sent, failed };
    }
    async sendEmailReminder(contact, reminders, jobId) {
        const subject = `Medication Reminder for ${contact.studentName}`;
        const body = this.buildReminderEmailBody(contact, reminders);
        const html = this.buildReminderEmailHtml(contact, reminders);
        const delivery = await models_1.MessageDelivery.create({
            recipientType: contact.recipientType,
            recipientId: contact.studentId,
            channel: models_1.DeliveryChannelType.EMAIL,
            status: models_1.DeliveryStatus.PENDING,
            contactInfo: contact.email,
            messageId: jobId || `reminder-${Date.now()}`,
        });
        try {
            const result = await this.emailService.sendEmail(contact.email, {
                subject,
                body,
                html,
            });
            await delivery.update({
                status: result.success ? models_1.DeliveryStatus.SENT : models_1.DeliveryStatus.FAILED,
                sentAt: new Date(),
                deliveredAt: result.success ? new Date() : undefined,
                externalId: result.messageId,
                failureReason: result.error,
            });
            this.logInfo(`Email reminder sent to ${contact.email}`);
        }
        catch (error) {
            await delivery.update({
                status: models_1.DeliveryStatus.FAILED,
                failureReason: error instanceof Error ? error.message : 'Unknown error',
            });
            throw error;
        }
    }
    buildReminderEmailBody(contact, reminders) {
        let body = `Hello${contact.guardianName ? ' ' + contact.guardianName : ''},\n\n`;
        body += `This is a reminder about medication(s) for ${contact.studentName}:\n\n`;
        reminders.forEach((reminder) => {
            body += `- ${reminder.medicationName} (${reminder.dosage})\n`;
            body += `  Time: ${reminder.scheduledTime.toLocaleTimeString()}\n`;
            body += `  Frequency: ${reminder.frequency}\n\n`;
        });
        body += `Please ensure the medication is administered as scheduled.\n\n`;
        body += `If you have any questions, please contact the school nurse.\n\n`;
        body += `---\n`;
        body += `This is an automated message from White Cross Healthcare Platform.`;
        return body;
    }
    buildReminderEmailHtml(contact, reminders) {
        let html = `<html><body>`;
        html += `<h2>Medication Reminder</h2>`;
        html += `<p>Hello${contact.guardianName ? ' ' + contact.guardianName : ''},</p>`;
        html += `<p>This is a reminder about medication(s) for <strong>${contact.studentName}</strong>:</p>`;
        html += `<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">`;
        html += `<tr style="background-color: #f0f0f0;">`;
        html += `<th>Medication</th><th>Dosage</th><th>Time</th><th>Frequency</th>`;
        html += `</tr>`;
        reminders.forEach((reminder) => {
            html += `<tr>`;
            html += `<td>${reminder.medicationName}</td>`;
            html += `<td>${reminder.dosage}</td>`;
            html += `<td>${reminder.scheduledTime.toLocaleTimeString()}</td>`;
            html += `<td>${reminder.frequency}</td>`;
            html += `</tr>`;
        });
        html += `</table>`;
        html += `<p>Please ensure the medication is administered as scheduled.</p>`;
        html += `<p>If you have any questions, please contact the school nurse.</p>`;
        html += `<hr>`;
        html += `<p style="font-size: 0.9em; color: #666;">This is an automated message from White Cross Healthcare Platform.</p>`;
        html += `</body></html>`;
        return html;
    }
    groupRemindersByStudent(reminders) {
        return reminders.reduce((acc, reminder) => {
            if (!acc[reminder.studentId]) {
                acc[reminder.studentId] = [];
            }
            acc[reminder.studentId].push(reminder);
            return acc;
        }, {});
    }
    async getStudentContacts(studentId) {
        try {
            const contacts = await this.sequelize.query(`
        SELECT
          s.id as student_id,
          s.first_name || ' ' || s.last_name as student_name,
          'PARENT' as recipient_type,
          s.parent_email as email,
          s.parent_phone as phone,
          s.parent_name as guardian_name
        FROM students s
        WHERE s.id = :studentId
          AND s.parent_email IS NOT NULL
        UNION
        SELECT
          s.id as student_id,
          s.first_name || ' ' || s.last_name as student_name,
          'GUARDIAN' as recipient_type,
          s.guardian_email as email,
          s.guardian_phone as phone,
          s.guardian_name
        FROM students s
        WHERE s.id = :studentId
          AND s.guardian_email IS NOT NULL
      `, {
                replacements: { studentId },
                type: sequelize_2.QueryTypes.SELECT,
            });
            return contacts.map((c) => ({
                studentId: c.student_id,
                studentName: c.student_name,
                recipientType: c.recipient_type,
                email: c.email,
                phone: c.phone,
                guardianName: c.guardian_name,
            }));
        }
        catch (error) {
            this.logError(`Failed to get contacts for student ${studentId}`, error);
            return [];
        }
    }
};
exports.ReminderNotificationService = ReminderNotificationService;
exports.ReminderNotificationService = ReminderNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [sequelize_2.Sequelize,
        email_1.EmailService])
], ReminderNotificationService);
//# sourceMappingURL=reminder-notification.service.js.map