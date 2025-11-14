"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitlistSlotAvailableEvent = exports.WaitlistEntryAddedEvent = exports.AppointmentReminderEvent = exports.AppointmentNoShowEvent = exports.AppointmentCompletedEvent = exports.AppointmentStartedEvent = exports.AppointmentRescheduledEvent = exports.AppointmentCancelledEvent = exports.AppointmentUpdatedEvent = exports.AppointmentCreatedEvent = void 0;
class AppointmentCreatedEvent {
    appointment;
    context;
    eventName = 'appointment.created';
    occurredAt;
    constructor(appointment, context) {
        this.appointment = appointment;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            appointmentId: this.appointment.id,
            studentId: this.appointment.studentId,
            nurseId: this.appointment.nurseId,
            scheduledAt: this.appointment.scheduledAt.toISOString(),
            userId: this.context.userId,
            userRole: this.context.userRole,
            requestId: this.context.requestId,
        };
    }
}
exports.AppointmentCreatedEvent = AppointmentCreatedEvent;
class AppointmentUpdatedEvent {
    appointment;
    previousData;
    context;
    eventName = 'appointment.updated';
    occurredAt;
    constructor(appointment, previousData, context) {
        this.appointment = appointment;
        this.previousData = previousData;
        this.context = context;
        this.occurredAt = new Date();
    }
    requiresNotification() {
        return !!(this.previousData.scheduledAt ||
            this.previousData.status ||
            this.previousData.nurseId);
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            appointmentId: this.appointment.id,
            changes: this.previousData,
            userId: this.context.userId,
            userRole: this.context.userRole,
            requestId: this.context.requestId,
        };
    }
}
exports.AppointmentUpdatedEvent = AppointmentUpdatedEvent;
class AppointmentCancelledEvent {
    appointmentId;
    appointment;
    reason;
    context;
    eventName = 'appointment.cancelled';
    occurredAt;
    constructor(appointmentId, appointment, reason, context) {
        this.appointmentId = appointmentId;
        this.appointment = appointment;
        this.reason = reason;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            appointmentId: this.appointmentId,
            cancellationReason: this.reason,
            scheduledAt: this.appointment.scheduledAt.toISOString(),
            userId: this.context.userId,
            userRole: this.context.userRole,
            requestId: this.context.requestId,
        };
    }
}
exports.AppointmentCancelledEvent = AppointmentCancelledEvent;
class AppointmentRescheduledEvent {
    appointment;
    oldScheduledAt;
    newScheduledAt;
    context;
    eventName = 'appointment.rescheduled';
    occurredAt;
    constructor(appointment, oldScheduledAt, newScheduledAt, context) {
        this.appointment = appointment;
        this.oldScheduledAt = oldScheduledAt;
        this.newScheduledAt = newScheduledAt;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            appointmentId: this.appointment.id,
            oldScheduledAt: this.oldScheduledAt.toISOString(),
            newScheduledAt: this.newScheduledAt.toISOString(),
            userId: this.context.userId,
            userRole: this.context.userRole,
            requestId: this.context.requestId,
        };
    }
}
exports.AppointmentRescheduledEvent = AppointmentRescheduledEvent;
class AppointmentStartedEvent {
    appointment;
    context;
    eventName = 'appointment.started';
    occurredAt;
    constructor(appointment, context) {
        this.appointment = appointment;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            appointmentId: this.appointment.id,
            scheduledAt: this.appointment.scheduledAt.toISOString(),
            actualStartTime: this.occurredAt.toISOString(),
            userId: this.context.userId,
            userRole: this.context.userRole,
        };
    }
}
exports.AppointmentStartedEvent = AppointmentStartedEvent;
class AppointmentCompletedEvent {
    appointment;
    completionNotes;
    outcomes;
    followUpRequired;
    context;
    eventName = 'appointment.completed';
    occurredAt;
    constructor(appointment, completionNotes, outcomes, followUpRequired, context) {
        this.appointment = appointment;
        this.completionNotes = completionNotes;
        this.outcomes = outcomes;
        this.followUpRequired = followUpRequired;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            appointmentId: this.appointment.id,
            scheduledAt: this.appointment.scheduledAt.toISOString(),
            completedAt: this.occurredAt.toISOString(),
            followUpRequired: this.followUpRequired,
            userId: this.context?.userId,
            userRole: this.context?.userRole,
        };
    }
}
exports.AppointmentCompletedEvent = AppointmentCompletedEvent;
class AppointmentNoShowEvent {
    appointment;
    context;
    eventName = 'appointment.no-show';
    occurredAt;
    constructor(appointment, context) {
        this.appointment = appointment;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            appointmentId: this.appointment.id,
            studentId: this.appointment.studentId,
            scheduledAt: this.appointment.scheduledAt.toISOString(),
            userId: this.context.userId,
            userRole: this.context.userRole,
        };
    }
}
exports.AppointmentNoShowEvent = AppointmentNoShowEvent;
class AppointmentReminderEvent {
    appointment;
    reminderType;
    hoursBeforeAppointment;
    message;
    eventName = 'appointment.reminder';
    occurredAt;
    constructor(appointment, reminderType, hoursBeforeAppointment, message) {
        this.appointment = appointment;
        this.reminderType = reminderType;
        this.hoursBeforeAppointment = hoursBeforeAppointment;
        this.message = message;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            appointmentId: this.appointment.id,
            reminderType: this.reminderType,
            hoursBeforeAppointment: this.hoursBeforeAppointment,
            scheduledAt: this.appointment.scheduledAt.toISOString(),
        };
    }
}
exports.AppointmentReminderEvent = AppointmentReminderEvent;
class WaitlistEntryAddedEvent {
    waitlistEntryId;
    studentId;
    preferredDate;
    priority;
    context;
    eventName = 'appointment.waitlist.added';
    occurredAt;
    constructor(waitlistEntryId, studentId, preferredDate, priority, context) {
        this.waitlistEntryId = waitlistEntryId;
        this.studentId = studentId;
        this.preferredDate = preferredDate;
        this.priority = priority;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            waitlistEntryId: this.waitlistEntryId,
            studentId: this.studentId,
            preferredDate: this.preferredDate?.toISOString(),
            priority: this.priority,
        };
    }
}
exports.WaitlistEntryAddedEvent = WaitlistEntryAddedEvent;
class WaitlistSlotAvailableEvent {
    nurseId;
    availableSlotTime;
    duration;
    notifiedWaitlistEntryIds;
    eventName = 'appointment.waitlist.slot-available';
    occurredAt;
    constructor(nurseId, availableSlotTime, duration, notifiedWaitlistEntryIds) {
        this.nurseId = nurseId;
        this.availableSlotTime = availableSlotTime;
        this.duration = duration;
        this.notifiedWaitlistEntryIds = notifiedWaitlistEntryIds;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            nurseId: this.nurseId,
            availableSlotTime: this.availableSlotTime.toISOString(),
            duration: this.duration,
            notifiedCount: this.notifiedWaitlistEntryIds.length,
        };
    }
}
exports.WaitlistSlotAvailableEvent = WaitlistSlotAvailableEvent;
//# sourceMappingURL=appointment.events.js.map