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
exports.AppointmentEventsListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const base_websocket_event_listener_1 = require("./base-websocket-event-listener");
const events_1 = require("../../../services/appointment/events");
let AppointmentEventsListener = class AppointmentEventsListener extends base_websocket_event_listener_1.BaseWebSocketEventListener {
    async handleAppointmentCreated(event) {
        const payload = this.createPayload(event.appointment.id, {
            appointmentId: event.appointment.id,
            studentId: event.appointment.studentId,
            nurseId: event.appointment.nurseId,
            type: event.appointment.type,
            scheduledAt: event.appointment.scheduledAt,
            duration: event.appointment.duration,
            status: event.appointment.status,
        });
        await this.broadcastEvent('appointment:created', event.appointment.id, payload, [`student:${event.appointment.studentId}`, `user:${event.appointment.nurseId}`]);
    }
    async handleAppointmentUpdated(event) {
        const payload = this.createPayload(event.appointment.id, {
            appointmentId: event.appointment.id,
            studentId: event.appointment.studentId,
            nurseId: event.appointment.nurseId,
            type: event.appointment.type,
            scheduledAt: event.appointment.scheduledAt,
            duration: event.appointment.duration,
            status: event.appointment.status,
            changes: event.previousData,
        });
        await this.broadcastEvent('appointment:updated', event.appointment.id, payload, [`student:${event.appointment.studentId}`, `user:${event.appointment.nurseId}`]);
    }
    async handleAppointmentCancelled(event) {
        const payload = this.createPayload(event.appointmentId, {
            appointmentId: event.appointmentId,
            studentId: event.appointment.studentId,
            nurseId: event.appointment.nurseId,
            scheduledAt: event.appointment.scheduledAt,
            reason: event.reason,
        });
        await this.broadcastEvent('appointment:cancelled', event.appointmentId, payload, [`student:${event.appointment.studentId}`, `user:${event.appointment.nurseId}`]);
    }
    async handleAppointmentStarted(event) {
        const payload = this.createPayload(event.appointment.id, {
            appointmentId: event.appointment.id,
            studentId: event.appointment.studentId,
            nurseId: event.appointment.nurseId,
            status: 'IN_PROGRESS',
            startedAt: event.occurredAt.toISOString(),
        });
        await this.broadcastEvent('appointment:started', event.appointment.id, payload, [`student:${event.appointment.studentId}`, `user:${event.appointment.nurseId}`]);
    }
    async handleAppointmentCompleted(event) {
        const payload = this.createPayload(event.appointment.id, {
            appointmentId: event.appointment.id,
            studentId: event.appointment.studentId,
            nurseId: event.appointment.nurseId,
            status: 'COMPLETED',
            completedAt: event.occurredAt.toISOString(),
            followUpRequired: event.followUpRequired,
        });
        await this.broadcastEvent('appointment:completed', event.appointment.id, payload, [`student:${event.appointment.studentId}`, `user:${event.appointment.nurseId}`]);
    }
    async handleAppointmentNoShow(event) {
        const payload = this.createPayload(event.appointment.id, {
            appointmentId: event.appointment.id,
            studentId: event.appointment.studentId,
            nurseId: event.appointment.nurseId,
            status: 'NO_SHOW',
            scheduledAt: event.appointment.scheduledAt,
        });
        await this.broadcastEvent('appointment:no-show', event.appointment.id, payload, [`user:${event.appointment.nurseId}`]);
    }
    async handleAppointmentReminder(event) {
        const payload = this.createPayload(event.appointment.id, {
            appointmentId: event.appointment.id,
            studentId: event.appointment.studentId,
            scheduledAt: event.appointment.scheduledAt,
            reminderType: event.reminderType,
            hoursBeforeAppointment: event.hoursBeforeAppointment,
            message: event.message,
        });
        await this.broadcastEvent('appointment:reminder', event.appointment.id, payload, [`student:${event.appointment.studentId}`]);
    }
    async handleAppointmentRescheduled(event) {
        const payload = this.createPayload(event.appointment.id, {
            appointmentId: event.appointment.id,
            studentId: event.appointment.studentId,
            nurseId: event.appointment.nurseId,
            oldScheduledAt: event.oldScheduledAt.toISOString(),
            newScheduledAt: event.newScheduledAt.toISOString(),
        });
        await this.broadcastEvent('appointment:rescheduled', event.appointment.id, payload, [`student:${event.appointment.studentId}`, `user:${event.appointment.nurseId}`]);
    }
};
exports.AppointmentEventsListener = AppointmentEventsListener;
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentCreatedEvent]),
    __metadata("design:returntype", Promise)
], AppointmentEventsListener.prototype, "handleAppointmentCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.updated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentUpdatedEvent]),
    __metadata("design:returntype", Promise)
], AppointmentEventsListener.prototype, "handleAppointmentUpdated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.cancelled'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentCancelledEvent]),
    __metadata("design:returntype", Promise)
], AppointmentEventsListener.prototype, "handleAppointmentCancelled", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.started'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentStartedEvent]),
    __metadata("design:returntype", Promise)
], AppointmentEventsListener.prototype, "handleAppointmentStarted", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentCompletedEvent]),
    __metadata("design:returntype", Promise)
], AppointmentEventsListener.prototype, "handleAppointmentCompleted", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.no-show'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentNoShowEvent]),
    __metadata("design:returntype", Promise)
], AppointmentEventsListener.prototype, "handleAppointmentNoShow", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.reminder'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentReminderEvent]),
    __metadata("design:returntype", Promise)
], AppointmentEventsListener.prototype, "handleAppointmentReminder", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.rescheduled'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentRescheduledEvent]),
    __metadata("design:returntype", Promise)
], AppointmentEventsListener.prototype, "handleAppointmentRescheduled", null);
exports.AppointmentEventsListener = AppointmentEventsListener = __decorate([
    (0, common_1.Injectable)()
], AppointmentEventsListener);
//# sourceMappingURL=appointment-events.listener.js.map