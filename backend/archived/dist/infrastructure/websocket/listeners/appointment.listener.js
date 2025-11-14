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
var AppointmentWebSocketListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentWebSocketListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const core_1 = require("@nestjs/core");
const websocket_service_1 = require("../websocket.service");
const base_websocket_event_listener_1 = require("./base-websocket-event.listener");
const events_1 = require("../../../services/appointment/events");
let AppointmentWebSocketListener = AppointmentWebSocketListener_1 = class AppointmentWebSocketListener extends base_websocket_event_listener_1.BaseWebSocketEventListener {
    websocketService;
    constructor(moduleRef, websocketService) {
        super(moduleRef, AppointmentWebSocketListener_1.name);
        this.websocketService = websocketService;
    }
    async handleAppointmentCreated(event) {
        const payload = this.createPayload({
            appointmentId: event.appointment.id,
            studentId: event.appointment.studentId,
            nurseId: event.appointment.nurseId,
            type: event.appointment.type,
            scheduledAt: event.appointment.scheduledAt.toISOString(),
            duration: event.appointment.duration,
            status: event.appointment.status,
            reason: event.appointment.reason,
        }, event.occurredAt.toISOString(), 'appointment:created');
        const rooms = [
            `user:${event.appointment.nurseId}`,
            `student:${event.appointment.studentId}`,
        ];
        if (event.context.organizationId) {
            rooms.push(`organization:${event.context.organizationId}`);
        }
        await this.broadcastEvent('appointment:created', event.appointment.id, payload, rooms);
    }
    async handleAppointmentUpdated(event) {
        if (!event.requiresNotification()) {
            this.logger.debug(`Skipping broadcast for minor update: ${event.appointment.id}`);
            return;
        }
        const payload = this.createPayload({
            appointmentId: event.appointment.id,
            studentId: event.appointment.studentId,
            nurseId: event.appointment.nurseId,
            type: event.appointment.type,
            scheduledAt: event.appointment.scheduledAt.toISOString(),
            duration: event.appointment.duration,
            status: event.appointment.status,
            reason: event.appointment.reason,
        }, event.occurredAt.toISOString(), 'appointment:updated');
        const rooms = [
            `user:${event.appointment.nurseId}`,
            `student:${event.appointment.studentId}`,
        ];
        await this.broadcastEvent('appointment:updated', event.appointment.id, payload, rooms);
    }
    async handleAppointmentCancelled(event) {
        const payload = this.createPayload({
            appointmentId: event.appointmentId,
            studentId: event.appointment.studentId,
            nurseId: event.appointment.nurseId,
            scheduledAt: event.appointment.scheduledAt.toISOString(),
            reason: event.reason,
        }, event.occurredAt.toISOString(), 'appointment:cancelled');
        const rooms = [
            `user:${event.appointment.nurseId}`,
            `student:${event.appointment.studentId}`,
        ];
        await this.broadcastEvent('appointment:cancelled', event.appointmentId, payload, rooms);
    }
    async handleAppointmentRescheduled(event) {
        const payload = this.createPayload({
            appointmentId: event.appointment.id,
            studentId: event.appointment.studentId,
            nurseId: event.appointment.nurseId,
            oldScheduledAt: event.oldScheduledAt.toISOString(),
            newScheduledAt: event.newScheduledAt.toISOString(),
            duration: event.appointment.duration,
        }, event.occurredAt.toISOString(), 'appointment:rescheduled');
        const rooms = [
            `user:${event.appointment.nurseId}`,
            `student:${event.appointment.studentId}`,
        ];
        await this.broadcastEvent('appointment:rescheduled', event.appointment.id, payload, rooms);
    }
    async handleAppointmentStarted(event) {
        const payload = this.createPayload({
            appointmentId: event.appointment.id,
            studentId: event.appointment.studentId,
            nurseId: event.appointment.nurseId,
            type: event.appointment.type,
            scheduledAt: event.appointment.scheduledAt.toISOString(),
            duration: event.appointment.duration,
            status: 'IN_PROGRESS',
        }, event.occurredAt.toISOString(), 'appointment:started');
        const rooms = [
            `user:${event.appointment.nurseId}`,
            `student:${event.appointment.studentId}`,
        ];
        await this.broadcastEvent('appointment:started', event.appointment.id, payload, rooms);
    }
    async handleAppointmentCompleted(event) {
        const payload = this.createPayload({
            appointmentId: event.appointment.id,
            studentId: event.appointment.studentId,
            nurseId: event.appointment.nurseId,
            scheduledAt: event.appointment.scheduledAt.toISOString(),
            completedAt: event.occurredAt.toISOString(),
            followUpRequired: event.followUpRequired,
        }, event.occurredAt.toISOString(), 'appointment:completed');
        const rooms = [
            `user:${event.appointment.nurseId}`,
            `student:${event.appointment.studentId}`,
        ];
        await this.broadcastEvent('appointment:completed', event.appointment.id, payload, rooms);
    }
    async handleAppointmentNoShow(event) {
        const payload = this.createPayload({
            appointmentId: event.appointment.id,
            studentId: event.appointment.studentId,
            nurseId: event.appointment.nurseId,
            scheduledAt: event.appointment.scheduledAt.toISOString(),
        }, event.occurredAt.toISOString(), 'appointment:no-show');
        const rooms = [`user:${event.appointment.nurseId}`];
        await this.broadcastEvent('appointment:no-show', event.appointment.id, payload, rooms);
    }
    async handleAppointmentReminder(event) {
        const payload = this.createPayload({
            appointmentId: event.appointment.id,
            studentId: event.appointment.studentId,
            scheduledAt: event.appointment.scheduledAt.toISOString(),
            hoursBeforeAppointment: event.hoursBeforeAppointment,
            message: event.message,
        }, event.occurredAt.toISOString(), 'appointment:reminder');
        const rooms = [`student:${event.appointment.studentId}`];
        await this.broadcastEvent('appointment:reminder', event.appointment.id, payload, rooms);
    }
    async handleWaitlistEntryAdded(event) {
        const payload = this.createPayload({
            waitlistEntryId: event.waitlistEntryId,
            studentId: event.studentId,
            preferredDate: event.preferredDate?.toISOString(),
            priority: event.priority,
        }, event.occurredAt.toISOString(), 'waitlist:added');
        const rooms = ['waitlist', `student:${event.studentId}`];
        await this.broadcastEvent('waitlist:added', event.waitlistEntryId, payload, rooms);
    }
    async handleWaitlistSlotAvailable(event) {
        const payload = this.createPayload({
            nurseId: event.nurseId,
            availableSlotTime: event.availableSlotTime.toISOString(),
            duration: event.duration,
            notifiedWaitlistEntryIds: event.notifiedWaitlistEntryIds,
        }, event.occurredAt.toISOString(), 'waitlist:slot-available');
        const rooms = ['waitlist'];
        await this.broadcastEvent('waitlist:slot-available', event.availableSlotTime.toISOString(), payload, rooms);
    }
};
exports.AppointmentWebSocketListener = AppointmentWebSocketListener;
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentCreatedEvent]),
    __metadata("design:returntype", Promise)
], AppointmentWebSocketListener.prototype, "handleAppointmentCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.updated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentUpdatedEvent]),
    __metadata("design:returntype", Promise)
], AppointmentWebSocketListener.prototype, "handleAppointmentUpdated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.cancelled'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentCancelledEvent]),
    __metadata("design:returntype", Promise)
], AppointmentWebSocketListener.prototype, "handleAppointmentCancelled", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.rescheduled'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentRescheduledEvent]),
    __metadata("design:returntype", Promise)
], AppointmentWebSocketListener.prototype, "handleAppointmentRescheduled", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.started'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentStartedEvent]),
    __metadata("design:returntype", Promise)
], AppointmentWebSocketListener.prototype, "handleAppointmentStarted", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentCompletedEvent]),
    __metadata("design:returntype", Promise)
], AppointmentWebSocketListener.prototype, "handleAppointmentCompleted", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.no-show'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentNoShowEvent]),
    __metadata("design:returntype", Promise)
], AppointmentWebSocketListener.prototype, "handleAppointmentNoShow", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.reminder'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.AppointmentReminderEvent]),
    __metadata("design:returntype", Promise)
], AppointmentWebSocketListener.prototype, "handleAppointmentReminder", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.waitlist.added'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.WaitlistEntryAddedEvent]),
    __metadata("design:returntype", Promise)
], AppointmentWebSocketListener.prototype, "handleWaitlistEntryAdded", null);
__decorate([
    (0, event_emitter_1.OnEvent)('appointment.waitlist.slot-available'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_1.WaitlistSlotAvailableEvent]),
    __metadata("design:returntype", Promise)
], AppointmentWebSocketListener.prototype, "handleWaitlistSlotAvailable", null);
exports.AppointmentWebSocketListener = AppointmentWebSocketListener = AppointmentWebSocketListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.ModuleRef,
        websocket_service_1.WebSocketService])
], AppointmentWebSocketListener);
//# sourceMappingURL=appointment.listener.js.map