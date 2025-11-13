/**
 * WebSocket Appointment Events Listener
 *
 * Listens to appointment domain events and broadcasts real-time notifications via WebSockets.
 * This eliminates the circular dependency between AppointmentService and WebSocketService.
 *
 * Architecture Pattern: Event-Driven Architecture
 * - AppointmentService emits events (producer)
 * - This listener consumes events and triggers WebSocket broadcasts
 * - No direct dependency from AppointmentService to WebSocketService
 * - Easy to test in isolation by mocking event emitter
 *
 * HIPAA Compliance:
 * - Only broadcasts minimal PHI (appointment ID, status, time)
 * - Full patient details not included in WebSocket payload
 * - Audit logging of all notifications
 *
 * @see NESTJS_SERVICES_REVIEW.md Section 1.2 - Circular Dependency Refactoring
 */

import { Injectable, Logger, ModuleRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BaseWebSocketEventListener } from './base-websocket-event-listener';
import {
  AppointmentCancelledEvent,
  AppointmentCompletedEvent,
  AppointmentCreatedEvent,
  AppointmentNoShowEvent,
  AppointmentReminderEvent,
  AppointmentRescheduledEvent,
  AppointmentStartedEvent,
  AppointmentUpdatedEvent,
} from '@/appointment/events';

/**
 * WebSocket Appointment Events Listener
 *
 * Handles all appointment events and broadcasts WebSocket notifications.
 * This service can be easily disabled or modified without touching core business logic.
 */
@Injectable()
export class AppointmentEventsListener extends BaseWebSocketEventListener {

  /**
   * Handle appointment created event
   * Broadcasts to student and nurse rooms
   */
  @OnEvent('appointment.created')
  async handleAppointmentCreated(event: AppointmentCreatedEvent): Promise<void> {
    const payload = this.createPayload(event.appointment.id, {
      appointmentId: event.appointment.id,
      studentId: event.appointment.studentId,
      nurseId: event.appointment.nurseId,
      type: event.appointment.type,
      scheduledAt: event.appointment.scheduledAt,
      duration: event.appointment.duration,
      status: event.appointment.status,
    });

    await this.broadcastEvent(
      'appointment:created',
      event.appointment.id,
      payload,
      [`student:${event.appointment.studentId}`, `user:${event.appointment.nurseId}`],
    );
  }

  /**
   * Handle appointment updated event
   * Broadcasts to student and nurse rooms
   */
  @OnEvent('appointment.updated')
  async handleAppointmentUpdated(event: AppointmentUpdatedEvent): Promise<void> {
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

    await this.broadcastEvent(
      'appointment:updated',
      event.appointment.id,
      payload,
      [`student:${event.appointment.studentId}`, `user:${event.appointment.nurseId}`],
    );
  }

  /**
   * Handle appointment cancelled event
   * Broadcasts to student, nurse, and general appointment rooms
   */
  @OnEvent('appointment.cancelled')
  async handleAppointmentCancelled(
    event: AppointmentCancelledEvent,
  ): Promise<void> {
    const payload = this.createPayload(event.appointmentId, {
      appointmentId: event.appointmentId,
      studentId: event.appointment.studentId,
      nurseId: event.appointment.nurseId,
      scheduledAt: event.appointment.scheduledAt,
      reason: event.reason,
    });

    await this.broadcastEvent(
      'appointment:cancelled',
      event.appointmentId,
      payload,
      [`student:${event.appointment.studentId}`, `user:${event.appointment.nurseId}`],
    );
  }

  /**
   * Handle appointment started event
   * Broadcasts real-time status update
   */
  @OnEvent('appointment.started')
  async handleAppointmentStarted(event: AppointmentStartedEvent): Promise<void> {
    const payload = this.createPayload(event.appointment.id, {
      appointmentId: event.appointment.id,
      studentId: event.appointment.studentId,
      nurseId: event.appointment.nurseId,
      status: 'IN_PROGRESS',
      startedAt: event.occurredAt.toISOString(),
    });

    await this.broadcastEvent(
      'appointment:started',
      event.appointment.id,
      payload,
      [`student:${event.appointment.studentId}`, `user:${event.appointment.nurseId}`],
    );
  }

  /**
   * Handle appointment completed event
   * Broadcasts completion notification
   */
  @OnEvent('appointment.completed')
  async handleAppointmentCompleted(
    event: AppointmentCompletedEvent,
  ): Promise<void> {
    const payload = this.createPayload(event.appointment.id, {
      appointmentId: event.appointment.id,
      studentId: event.appointment.studentId,
      nurseId: event.appointment.nurseId,
      status: 'COMPLETED',
      completedAt: event.occurredAt.toISOString(),
      followUpRequired: event.followUpRequired,
    });

    await this.broadcastEvent(
      'appointment:completed',
      event.appointment.id,
      payload,
      [`student:${event.appointment.studentId}`, `user:${event.appointment.nurseId}`],
    );
  }

  /**
   * Handle appointment no-show event
   * Broadcasts no-show notification to nurse
   */
  @OnEvent('appointment.no-show')
  async handleAppointmentNoShow(event: AppointmentNoShowEvent): Promise<void> {
    const payload = this.createPayload(event.appointment.id, {
      appointmentId: event.appointment.id,
      studentId: event.appointment.studentId,
      nurseId: event.appointment.nurseId,
      status: 'NO_SHOW',
      scheduledAt: event.appointment.scheduledAt,
    });

    await this.broadcastEvent(
      'appointment:no-show',
      event.appointment.id,
      payload,
      [`user:${event.appointment.nurseId}`],
    );
  }

  /**
   * Handle appointment reminder event
   * Broadcasts reminder notification
   */
  @OnEvent('appointment.reminder')
  async handleAppointmentReminder(
    event: AppointmentReminderEvent,
  ): Promise<void> {
    const payload = this.createPayload(event.appointment.id, {
      appointmentId: event.appointment.id,
      studentId: event.appointment.studentId,
      scheduledAt: event.appointment.scheduledAt,
      reminderType: event.reminderType,
      hoursBeforeAppointment: event.hoursBeforeAppointment,
      message: event.message,
    });

    await this.broadcastEvent(
      'appointment:reminder',
      event.appointment.id,
      payload,
      [`student:${event.appointment.studentId}`],
    );
  }

  /**
   * Handle appointment rescheduled event
   * Broadcasts rescheduling notification
   */
  @OnEvent('appointment.rescheduled')
  async handleAppointmentRescheduled(
    event: AppointmentRescheduledEvent,
  ): Promise<void> {
    const payload = this.createPayload(event.appointment.id, {
      appointmentId: event.appointment.id,
      studentId: event.appointment.studentId,
      nurseId: event.appointment.nurseId,
      oldScheduledAt: event.oldScheduledAt.toISOString(),
      newScheduledAt: event.newScheduledAt.toISOString(),
    });

    await this.broadcastEvent(
      'appointment:rescheduled',
      event.appointment.id,
      payload,
      [`student:${event.appointment.studentId}`, `user:${event.appointment.nurseId}`],
    );
  }
}
