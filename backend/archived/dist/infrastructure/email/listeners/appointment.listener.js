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
var AppointmentEmailListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentEmailListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const email_service_1 = require("../email.service");
const events_1 = require("../../../services/appointment/events");
let AppointmentEmailListener = AppointmentEmailListener_1 = class AppointmentEmailListener {
    emailService;
    logger = new common_1.Logger(AppointmentEmailListener_1.name);
    constructor(emailService) {
        this.emailService = emailService;
    }
    async handleAppointmentCreated(event) {
        this.logger.log(`Sending appointment confirmation email for: ${event.appointment.id}`);
        try {
            const recipientEmail = 'student@example.com';
            const emailData = {
                to: [recipientEmail],
                subject: 'Appointment Confirmation - White Cross Health',
                body: this.buildConfirmationEmailBody(event),
            };
            await this.emailService.sendTemplatedEmail(emailData);
            this.logger.log(`Successfully queued appointment confirmation email for: ${event.appointment.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to send appointment confirmation email: ${error.message}`, error.stack);
        }
    }
    async handleAppointmentCancelled(event) {
        this.logger.log(`Sending appointment cancellation email for: ${event.appointmentId}`);
        try {
            const recipientEmail = 'student@example.com';
            const emailData = {
                to: [recipientEmail],
                subject: 'Appointment Cancelled - White Cross Health',
                body: this.buildCancellationEmailBody(event),
            };
            await this.emailService.sendTemplatedEmail(emailData);
            this.logger.log(`Successfully queued appointment cancellation email for: ${event.appointmentId}`);
        }
        catch (error) {
            this.logger.error(`Failed to send appointment cancellation email: ${error.message}`, error.stack);
        }
    }
    async handleAppointmentRescheduled(event) {
        this.logger.log(`Sending appointment rescheduled email for: ${event.appointment.id}`);
        try {
            const recipientEmail = 'student@example.com';
            const emailData = {
                to: [recipientEmail],
                subject: 'Appointment Rescheduled - White Cross Health',
                body: this.buildRescheduledEmailBody(event),
            };
            await this.emailService.sendTemplatedEmail(emailData);
            this.logger.log(`Successfully queued appointment rescheduled email for: ${event.appointment.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to send appointment rescheduled email: ${error.message}`, error.stack);
        }
    }
    async handleAppointmentReminder(event) {
        if (event.reminderType !== 'EMAIL') {
            return;
        }
        this.logger.log(`Sending appointment reminder email for: ${event.appointment.id}`);
        try {
            const recipientEmail = 'student@example.com';
            const emailData = {
                to: [recipientEmail],
                subject: `Appointment Reminder - ${event.hoursBeforeAppointment}h - White Cross Health`,
                body: this.buildReminderEmailBody(event),
            };
            await this.emailService.sendTemplatedEmail(emailData);
            this.logger.log(`Successfully queued appointment reminder email for: ${event.appointment.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to send appointment reminder email: ${error.message}`, error.stack);
        }
    }
    async handleAppointmentCompleted(event) {
        this.logger.log(`Sending appointment completion email for: ${event.appointment.id}`);
        try {
            const recipientEmail = 'student@example.com';
            const emailData = {
                to: [recipientEmail],
                subject: 'Appointment Follow-up - White Cross Health',
                body: this.buildCompletionEmailBody(event),
            };
            await this.emailService.sendTemplatedEmail(emailData);
            this.logger.log(`Successfully queued appointment completion email for: ${event.appointment.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to send appointment completion email: ${error.message}`, error.stack);
        }
    }
    async handleAppointmentNoShow(event) {
        this.logger.log(`Sending appointment no-show email for: ${event.appointment.id}`);
        try {
            const recipientEmail = 'student@example.com';
            const emailData = {
                to: [recipientEmail],
                subject: 'Missed Appointment - White Cross Health',
                body: this.buildNoShowEmailBody(event),
            };
            await this.emailService.sendTemplatedEmail(emailData);
            this.logger.log(`Successfully queued appointment no-show email for: ${event.appointment.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to send appointment no-show email: ${error.message}`, error.stack);
        }
    }
    async handleWaitlistEntryAdded(event) {
        this.logger.log(`Sending waitlist confirmation email for: ${event.waitlistEntryId}`);
        try {
            const recipientEmail = 'student@example.com';
            const emailData = {
                to: [recipientEmail],
                subject: 'Waitlist Confirmation - White Cross Health',
                body: this.buildWaitlistConfirmationEmailBody(event),
            };
            await this.emailService.sendTemplatedEmail(emailData);
            this.logger.log(`Successfully queued waitlist confirmation email for: ${event.waitlistEntryId}`);
        }
        catch (error) {
            this.logger.error(`Failed to send waitlist confirmation email: ${error.message}`, error.stack);
        }
    }
    async handleWaitlistSlotAvailable(event) {
        this.logger.log(`Sending waitlist slot available emails to ${event.notifiedWaitlistEntryIds.length} recipients`);
        try {
            const recipients = ['student@example.com'];
            const emailData = {
                to: recipients,
                subject: 'URGENT: Appointment Slot Available - White Cross Health',
                body: this.buildSlotAvailableEmailBody(event),
            };
            await this.emailService.sendTemplatedEmail(emailData);
            this.logger.log(`Successfully queued waitlist slot available emails to ${recipients.length} recipients`);
        }
        catch (error) {
            this.logger.error(`Failed to send waitlist slot available emails: ${error.message}`, error.stack);
        }
    }
    buildConfirmationEmailBody(event) {
        const { appointment } = event;
        return `
      <h2>Appointment Confirmation</h2>
      <p>Your appointment has been successfully scheduled.</p>

      <h3>Appointment Details:</h3>
      <ul>
        <li><strong>Date & Time:</strong> ${appointment.scheduledAt.toLocaleString()}</li>
        <li><strong>Duration:</strong> ${appointment.duration} minutes</li>
        <li><strong>Reason:</strong> ${appointment.reason || 'General consultation'}</li>
        <li><strong>Type:</strong> ${appointment.type}</li>
      </ul>

      <h3>Important Information:</h3>
      <p>Please arrive 5 minutes early to complete any necessary paperwork.</p>
      <p>If you need to cancel or reschedule, please do so at least 2 hours in advance.</p>

      <p>Questions? Contact the health office.</p>
    `;
    }
    buildCancellationEmailBody(event) {
        return `
      <h2>Appointment Cancellation</h2>
      <p>Your appointment scheduled for ${event.appointment.scheduledAt.toLocaleString()} has been cancelled.</p>

      ${event.reason ? `<p><strong>Reason:</strong> ${event.reason}</p>` : ''}

      <p>Would you like to schedule a new appointment? Contact the health office or use our online booking system.</p>
    `;
    }
    buildRescheduledEmailBody(event) {
        return `
      <h2>Appointment Rescheduled</h2>
      <p>Your appointment has been rescheduled.</p>

      <p><strong>Previous Time:</strong> ${event.oldScheduledAt.toLocaleString()}</p>
      <p><strong>New Time:</strong> ${event.newScheduledAt.toLocaleString()}</p>
      <p><strong>Duration:</strong> ${event.appointment.duration} minutes</p>

      <p>Please confirm you can make this new time. If not, contact us to reschedule.</p>
    `;
    }
    buildReminderEmailBody(event) {
        const timeUntil = event.hoursBeforeAppointment === 24 ? 'tomorrow' : 'in 1 hour';
        return `
      <h2>Appointment Reminder</h2>
      <p>This is a reminder that you have an appointment ${timeUntil}.</p>

      <h3>Appointment Details:</h3>
      <ul>
        <li><strong>Date & Time:</strong> ${event.appointment.scheduledAt.toLocaleString()}</li>
        <li><strong>Duration:</strong> ${event.appointment.duration} minutes</li>
        <li><strong>Reason:</strong> ${event.appointment.reason || 'General consultation'}</li>
      </ul>

      <p>Please arrive 5 minutes early.</p>
      ${event.message ? `<p>${event.message}</p>` : ''}
    `;
    }
    buildCompletionEmailBody(event) {
        return `
      <h2>Thank You</h2>
      <p>Thank you for attending your appointment on ${event.appointment.scheduledAt.toLocaleDateString()}.</p>

      ${event.followUpRequired ? '<p><strong>Follow-up Required:</strong> Please schedule a follow-up appointment.</p>' : ''}
      ${event.outcomes ? `<p><strong>Notes:</strong> ${event.outcomes}</p>` : ''}

      <p>We value your feedback. Please take a moment to complete our brief satisfaction survey.</p>
    `;
    }
    buildNoShowEmailBody(event) {
        return `
      <h2>Missed Appointment</h2>
      <p>We noticed you missed your appointment on ${event.appointment.scheduledAt.toLocaleString()}.</p>

      <p>If you're still experiencing health concerns, please reschedule at your earliest convenience.</p>

      <p><strong>Please Note:</strong> Multiple missed appointments may affect your ability to schedule future appointments.</p>

      <p>If you have any questions or need assistance, please contact the health office.</p>
    `;
    }
    buildWaitlistConfirmationEmailBody(event) {
        return `
      <h2>Waitlist Confirmation</h2>
      <p>You have been successfully added to the appointment waitlist.</p>

      ${event.preferredDate ? `<p><strong>Preferred Date:</strong> ${event.preferredDate.toLocaleDateString()}</p>` : ''}
      ${event.priority ? `<p><strong>Priority:</strong> ${event.priority}</p>` : ''}

      <p>We will notify you immediately when a slot becomes available.</p>
      <p>You can check your waitlist position at any time through the patient portal.</p>
    `;
    }
    buildSlotAvailableEmailBody(event) {
        return `
      <h2>URGENT: Appointment Slot Available</h2>
      <p>Good news! An appointment slot has become available.</p>

      <h3>Available Slot:</h3>
      <ul>
        <li><strong>Date & Time:</strong> ${event.availableSlotTime.toLocaleString()}</li>
        <li><strong>Duration:</strong> ${event.duration} minutes</li>
      </ul>

      <p><strong>Act Fast!</strong> This slot is being offered to a limited number of waitlist entries.</p>
      <p>Click below to claim this appointment (offer expires in 2 hours):</p>

      <p>[Book Now Button - Link to booking confirmation]</p>

      <p>If this time doesn't work for you, we'll continue to notify you of other available slots.</p>
    `;
    }
};
exports.AppointmentEmailListener = AppointmentEmailListener;
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentCreatedEvent]),
    __metadata("design:returntype", Promise)
], AppointmentEmailListener.prototype, "handleAppointmentCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.cancelled'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentCancelledEvent]),
    __metadata("design:returntype", Promise)
], AppointmentEmailListener.prototype, "handleAppointmentCancelled", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.rescheduled'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentRescheduledEvent]),
    __metadata("design:returntype", Promise)
], AppointmentEmailListener.prototype, "handleAppointmentRescheduled", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.reminder'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentReminderEvent]),
    __metadata("design:returntype", Promise)
], AppointmentEmailListener.prototype, "handleAppointmentReminder", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentCompletedEvent]),
    __metadata("design:returntype", Promise)
], AppointmentEmailListener.prototype, "handleAppointmentCompleted", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.no-show'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentNoShowEvent]),
    __metadata("design:returntype", Promise)
], AppointmentEmailListener.prototype, "handleAppointmentNoShow", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.waitlist.added'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.WaitlistEntryAddedEvent]),
    __metadata("design:returntype", Promise)
], AppointmentEmailListener.prototype, "handleWaitlistEntryAdded", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.waitlist.slot-available'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.WaitlistSlotAvailableEvent]),
    __metadata("design:returntype", Promise)
], AppointmentEmailListener.prototype, "handleWaitlistSlotAvailable", null);
exports.AppointmentEmailListener = AppointmentEmailListener = AppointmentEmailListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], AppointmentEmailListener);
//# sourceMappingURL=appointment.listener.js.map