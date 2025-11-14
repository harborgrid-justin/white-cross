"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentValidation = void 0;
const common_1 = require("@nestjs/common");
const update_appointment_dto_1 = require("../dto/update-appointment.dto");
class AppointmentValidation {
    static MIN_DURATION_MINUTES = 15;
    static MAX_DURATION_MINUTES = 120;
    static DEFAULT_DURATION_MINUTES = 30;
    static BUFFER_TIME_MINUTES = 15;
    static MIN_CANCELLATION_HOURS = 2;
    static MAX_APPOINTMENTS_PER_DAY = 16;
    static BUSINESS_HOURS_START = 8;
    static BUSINESS_HOURS_END = 17;
    static WEEKEND_DAYS = [0, 6];
    static MIN_REMINDER_HOURS_BEFORE = 0.5;
    static MAX_REMINDER_HOURS_BEFORE = 168;
    static getDefaultDuration() {
        return this.DEFAULT_DURATION_MINUTES;
    }
    static getBufferTimeMinutes() {
        return this.BUFFER_TIME_MINUTES;
    }
    static getBusinessHours() {
        return {
            start: this.BUSINESS_HOURS_START,
            end: this.BUSINESS_HOURS_END,
        };
    }
    static validateFutureDateTime(scheduledAt) {
        const now = new Date();
        if (scheduledAt <= now) {
            throw new common_1.BadRequestException('Appointment must be scheduled for a future date and time');
        }
    }
    static validateDuration(duration) {
        if (duration < this.MIN_DURATION_MINUTES) {
            throw new common_1.BadRequestException(`Appointment duration must be at least ${this.MIN_DURATION_MINUTES} minutes`);
        }
        if (duration > this.MAX_DURATION_MINUTES) {
            throw new common_1.BadRequestException(`Appointment duration cannot exceed ${this.MAX_DURATION_MINUTES} minutes`);
        }
        if (duration % 15 !== 0) {
            throw new common_1.BadRequestException('Appointment duration must be in 15-minute increments');
        }
    }
    static validateBusinessHours(scheduledAt, duration) {
        const hour = scheduledAt.getHours();
        const minutes = scheduledAt.getMinutes();
        const totalMinutes = hour * 60 + minutes;
        const startMinutes = this.BUSINESS_HOURS_START * 60;
        const endMinutes = this.BUSINESS_HOURS_END * 60;
        if (totalMinutes < startMinutes) {
            throw new common_1.BadRequestException(`Appointments must be scheduled after ${this.BUSINESS_HOURS_START}:00 AM`);
        }
        const appointmentEndMinutes = totalMinutes + duration;
        if (appointmentEndMinutes > endMinutes) {
            throw new common_1.BadRequestException(`Appointments must end by ${this.BUSINESS_HOURS_END}:00 PM`);
        }
    }
    static validateNotWeekend(scheduledAt) {
        const dayOfWeek = scheduledAt.getDay();
        if (this.WEEKEND_DAYS.includes(dayOfWeek)) {
            throw new common_1.BadRequestException('Appointments cannot be scheduled on weekends');
        }
    }
    static validateCancellationNotice(scheduledAt) {
        const now = new Date();
        const hoursUntilAppointment = (scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursUntilAppointment < this.MIN_CANCELLATION_HOURS) {
            throw new common_1.BadRequestException(`Appointments must be cancelled at least ${this.MIN_CANCELLATION_HOURS} hours in advance`);
        }
    }
    static validateStartTiming(scheduledAt) {
        const now = new Date();
        const oneHourEarly = new Date(scheduledAt.getTime() - 60 * 60 * 1000);
        if (now < oneHourEarly) {
            throw new common_1.BadRequestException('Cannot start appointment more than 1 hour before scheduled time');
        }
    }
    static validateAppointmentPassed(scheduledAt) {
        const now = new Date();
        if (scheduledAt > now) {
            throw new common_1.BadRequestException('Cannot mark future appointment as no-show');
        }
    }
    static validateNotFinalState(status) {
        if ([
            update_appointment_dto_1.AppointmentStatus.COMPLETED,
            update_appointment_dto_1.AppointmentStatus.CANCELLED,
            update_appointment_dto_1.AppointmentStatus.NO_SHOW,
        ].includes(status)) {
            throw new common_1.BadRequestException(`Cannot update appointment with status ${status}`);
        }
    }
    static validateCanBeCancelled(status) {
        if (status !== update_appointment_dto_1.AppointmentStatus.SCHEDULED &&
            status !== update_appointment_dto_1.AppointmentStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException(`Cannot cancel appointment with status ${status}`);
        }
    }
    static validateCanBeMarkedNoShow(status) {
        if (status !== update_appointment_dto_1.AppointmentStatus.SCHEDULED) {
            throw new common_1.BadRequestException(`Cannot mark appointment with status ${status} as no-show`);
        }
    }
    static validateCanBeStarted(status) {
        if (status !== update_appointment_dto_1.AppointmentStatus.SCHEDULED) {
            throw new common_1.BadRequestException(`Cannot start appointment with status ${status}`);
        }
    }
    static validateCanBeCompleted(status) {
        if (status !== update_appointment_dto_1.AppointmentStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException(`Cannot complete appointment with status ${status}. Appointment must be IN_PROGRESS`);
        }
    }
}
exports.AppointmentValidation = AppointmentValidation;
//# sourceMappingURL=appointment-validation.js.map