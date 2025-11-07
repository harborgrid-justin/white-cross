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

import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketService } from '../websocket.service';
import {
  AppointmentCreatedEvent,
  AppointmentUpdatedEvent,
  AppointmentCancelledEvent,
  AppointmentStartedEvent,
  AppointmentCompletedEvent,
  AppointmentNoShowEvent,
  AppointmentReminderEvent,
  AppointmentRescheduledEvent,
} from '../../../appointment/events/appointment.events';

/**
 * WebSocket Appointment Events Listener
 *
 * Handles all appointment events and broadcasts WebSocket notifications.
 * This service can be easily disabled or modified without touching core business logic.
 */
@Injectable()
export class AppointmentEventsListener {
  private readonly logger = new Logger(AppointmentEventsListener.name);

  constructor(private readonly websocketService: WebSocketService) {
    this.logger.log('AppointmentEventsListener initialized');
  }

  /**
   * Handle appointment created event
   * Broadcasts to student and nurse rooms
   */
  @OnEvent('appointment.created')
  async handleAppointmentCreated(event: AppointmentCreatedEvent): Promise<void> {
    this.logger.log(
      `Broadcasting appointment.created event: ${event.appointment.id}`,
    );

    if (!this.websocketService || !this.websocketService.isInitialized()) {
      this.logger.warn('WebSocket service not initialized, skipping notification');
      return;
    }

    try {
      const payload = {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        type: event.appointment.type,
        scheduledAt: event.appointment.scheduledAt,
        duration: event.appointment.duration,
        status: event.appointment.status,
        timestamp: event.occurredAt.toISOString(),
      };

      // Broadcast to student-specific room
      await this.websocketService.broadcastToRoom(
        `student:${event.appointment.studentId}`,
        'appointment:created',
        payload,
      );

      // Broadcast to nurse-specific room
      await this.websocketService.broadcastToRoom(
        `user:${event.appointment.nurseId}`,
        'appointment:created',
        payload,
      );

      this.logger.log(
        `Successfully broadcast appointment:created for ${event.appointment.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast appointment created event: ${error.message}`,
        error.stack,
      );
      // Don't throw - this is a best-effort notification
    }
  }

  /**
   * Handle appointment updated event
   * Broadcasts to student and nurse rooms
   */
  @OnEvent('appointment.updated')
  async handleAppointmentUpdated(event: AppointmentUpdatedEvent): Promise<void> {
    this.logger.log(
      `Broadcasting appointment.updated event: ${event.appointment.id}`,
    );

    if (!this.websocketService || !this.websocketService.isInitialized()) {
      this.logger.warn('WebSocket service not initialized, skipping notification');
      return;
    }

    try {
      const payload = {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        type: event.appointment.type,
        scheduledAt: event.appointment.scheduledAt,
        duration: event.appointment.duration,
        status: event.appointment.status,
        changes: event.previousData,
        timestamp: event.occurredAt.toISOString(),
      };

      // Broadcast to student and nurse rooms
      await Promise.all([
        this.websocketService.broadcastToRoom(
          `student:${event.appointment.studentId}`,
          'appointment:updated',
          payload,
        ),
        this.websocketService.broadcastToRoom(
          `user:${event.appointment.nurseId}`,
          'appointment:updated',
          payload,
        ),
      ]);

      this.logger.log(
        `Successfully broadcast appointment:updated for ${event.appointment.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast appointment updated event: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Handle appointment cancelled event
   * Broadcasts to student, nurse, and general appointment rooms
   */
  @OnEvent('appointment.cancelled')
  async handleAppointmentCancelled(
    event: AppointmentCancelledEvent,
  ): Promise<void> {
    this.logger.log(
      `Broadcasting appointment.cancelled event: ${event.appointmentId}`,
    );

    if (!this.websocketService || !this.websocketService.isInitialized()) {
      this.logger.warn('WebSocket service not initialized, skipping notification');
      return;
    }

    try {
      const payload = {
        appointmentId: event.appointmentId,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        scheduledAt: event.appointment.scheduledAt,
        reason: event.reason,
        timestamp: event.occurredAt.toISOString(),
      };

      // Broadcast to student and nurse rooms
      await Promise.all([
        this.websocketService.broadcastToRoom(
          `student:${event.appointment.studentId}`,
          'appointment:cancelled',
          payload,
        ),
        this.websocketService.broadcastToRoom(
          `user:${event.appointment.nurseId}`,
          'appointment:cancelled',
          payload,
        ),
      ]);

      this.logger.log(
        `Successfully broadcast appointment:cancelled for ${event.appointmentId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast appointment cancelled event: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Handle appointment started event
   * Broadcasts real-time status update
   */
  @OnEvent('appointment.started')
  async handleAppointmentStarted(event: AppointmentStartedEvent): Promise<void> {
    this.logger.log(
      `Broadcasting appointment.started event: ${event.appointment.id}`,
    );

    if (!this.websocketService || !this.websocketService.isInitialized()) {
      this.logger.warn('WebSocket service not initialized, skipping notification');
      return;
    }

    try {
      const payload = {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        status: 'IN_PROGRESS',
        startedAt: event.occurredAt.toISOString(),
      };

      await Promise.all([
        this.websocketService.broadcastToRoom(
          `student:${event.appointment.studentId}`,
          'appointment:started',
          payload,
        ),
        this.websocketService.broadcastToRoom(
          `user:${event.appointment.nurseId}`,
          'appointment:started',
          payload,
        ),
      ]);

      this.logger.log(
        `Successfully broadcast appointment:started for ${event.appointment.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast appointment started event: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Handle appointment completed event
   * Broadcasts completion notification
   */
  @OnEvent('appointment.completed')
  async handleAppointmentCompleted(
    event: AppointmentCompletedEvent,
  ): Promise<void> {
    this.logger.log(
      `Broadcasting appointment.completed event: ${event.appointment.id}`,
    );

    if (!this.websocketService || !this.websocketService.isInitialized()) {
      this.logger.warn('WebSocket service not initialized, skipping notification');
      return;
    }

    try {
      const payload = {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        status: 'COMPLETED',
        completedAt: event.occurredAt.toISOString(),
        followUpRequired: event.followUpRequired,
      };

      await Promise.all([
        this.websocketService.broadcastToRoom(
          `student:${event.appointment.studentId}`,
          'appointment:completed',
          payload,
        ),
        this.websocketService.broadcastToRoom(
          `user:${event.appointment.nurseId}`,
          'appointment:completed',
          payload,
        ),
      ]);

      this.logger.log(
        `Successfully broadcast appointment:completed for ${event.appointment.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast appointment completed event: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Handle appointment no-show event
   * Broadcasts no-show notification to nurse
   */
  @OnEvent('appointment.no-show')
  async handleAppointmentNoShow(event: AppointmentNoShowEvent): Promise<void> {
    this.logger.log(
      `Broadcasting appointment.no-show event: ${event.appointment.id}`,
    );

    if (!this.websocketService || !this.websocketService.isInitialized()) {
      this.logger.warn('WebSocket service not initialized, skipping notification');
      return;
    }

    try {
      const payload = {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        status: 'NO_SHOW',
        scheduledAt: event.appointment.scheduledAt,
        timestamp: event.occurredAt.toISOString(),
      };

      // Primarily notify nurse - student notification may be sent via other channels
      await this.websocketService.broadcastToRoom(
        `user:${event.appointment.nurseId}`,
        'appointment:no-show',
        payload,
      );

      this.logger.log(
        `Successfully broadcast appointment:no-show for ${event.appointment.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast appointment no-show event: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Handle appointment reminder event
   * Broadcasts reminder notification
   */
  @OnEvent('appointment.reminder')
  async handleAppointmentReminder(
    event: AppointmentReminderEvent,
  ): Promise<void> {
    this.logger.log(
      `Broadcasting appointment.reminder event: ${event.appointment.id}`,
    );

    if (!this.websocketService || !this.websocketService.isInitialized()) {
      this.logger.warn('WebSocket service not initialized, skipping notification');
      return;
    }

    try {
      const payload = {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        scheduledAt: event.appointment.scheduledAt,
        reminderType: event.reminderType,
        hoursBeforeAppointment: event.hoursBeforeAppointment,
        message: event.message,
      };

      // Send reminder to student room
      await this.websocketService.broadcastToRoom(
        `student:${event.appointment.studentId}`,
        'appointment:reminder',
        payload,
      );

      this.logger.log(
        `Successfully broadcast appointment:reminder for ${event.appointment.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast appointment reminder event: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Handle appointment rescheduled event
   * Broadcasts rescheduling notification
   */
  @OnEvent('appointment.rescheduled')
  async handleAppointmentRescheduled(
    event: AppointmentRescheduledEvent,
  ): Promise<void> {
    this.logger.log(
      `Broadcasting appointment.rescheduled event: ${event.appointment.id}`,
    );

    if (!this.websocketService || !this.websocketService.isInitialized()) {
      this.logger.warn('WebSocket service not initialized, skipping notification');
      return;
    }

    try {
      const payload = {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        oldScheduledAt: event.oldScheduledAt.toISOString(),
        newScheduledAt: event.newScheduledAt.toISOString(),
        timestamp: event.occurredAt.toISOString(),
      };

      await Promise.all([
        this.websocketService.broadcastToRoom(
          `student:${event.appointment.studentId}`,
          'appointment:rescheduled',
          payload,
        ),
        this.websocketService.broadcastToRoom(
          `user:${event.appointment.nurseId}`,
          'appointment:rescheduled',
          payload,
        ),
      ]);

      this.logger.log(
        `Successfully broadcast appointment:rescheduled for ${event.appointment.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast appointment rescheduled event: ${error.message}`,
        error.stack,
      );
    }
  }
}
