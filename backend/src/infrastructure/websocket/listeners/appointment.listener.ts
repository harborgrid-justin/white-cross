/**
 * @fileoverview Appointment WebSocket Event Listener
 * @module infrastructure/websocket/listeners
 * @description Handles appointment domain events and broadcasts real-time updates via WebSockets.
 * Eliminates circular dependency between AppointmentService and WebSocketService.
 *
 * Architecture Pattern: Event Listener (Event-Driven Architecture)
 * - Subscribes to appointment events via EventEmitter2
 * - Broadcasts updates to relevant WebSocket rooms
 * - Supports multi-tenant room isolation
 * - HIPAA-compliant event payload filtering
 *
 * Event Flow:
 * AppointmentService → EventEmitter2 → AppointmentWebSocketListener → WebSocketService → Clients
 *
 * @see NESTJS_SERVICES_REVIEW.md Section 9.1 - Event-Driven Architecture
 */

import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketService } from '../websocket.service';
import {
  AppointmentCreatedEvent,
  AppointmentUpdatedEvent,
  AppointmentCancelledEvent,
  AppointmentRescheduledEvent,
  AppointmentStartedEvent,
  AppointmentCompletedEvent,
  AppointmentNoShowEvent,
  AppointmentReminderEvent,
  WaitlistEntryAddedEvent,
  WaitlistSlotAvailableEvent,
} from '@/appointment/events';

/**
 * WebSocket payload for appointment events
 * Minimal PHI exposure for real-time updates
 */
interface AppointmentWebSocketPayload {
  appointmentId: string;
  studentId: string;
  nurseId: string;
  type: string;
  scheduledAt: string;
  duration: number;
  status: string;
  reason?: string;
  timestamp: string;
  eventType: string;
}

/**
 * Appointment WebSocket Listener
 *
 * Listens to appointment domain events and broadcasts them to WebSocket clients.
 * Handles room-based broadcasting for user-specific and global notifications.
 *
 * Room Structure:
 * - `user:{nurseId}` - Nurse-specific room for appointments
 * - `student:{studentId}` - Student-specific room for their appointments
 * - `organization:{orgId}` - Organization-wide room for admin monitoring
 * - `waitlist` - Global waitlist updates
 *
 * Security:
 * - Events filtered to remove sensitive PHI
 * - Room-based access control enforced by WebSocket gateway
 * - Audit logging of all broadcasts
 */
@Injectable()
export class AppointmentWebSocketListener {
  private readonly logger = new Logger(AppointmentWebSocketListener.name);

  constructor(private readonly websocketService: WebSocketService) {}

  /**
   * Handle Appointment Created Event
   *
   * Broadcasts to:
   * - Nurse's room: New appointment notification
   * - Student's room: Appointment confirmation
   * - Organization room: Admin monitoring
   *
   * @event appointment.created
   */
  @OnEvent('appointment.created')
  async handleAppointmentCreated(
    event: AppointmentCreatedEvent,
  ): Promise<void> {
    this.logger.log(
      `Broadcasting appointment created: ${event.appointment.id}`,
    );

    try {
      const payload: AppointmentWebSocketPayload = {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        type: event.appointment.type,
        scheduledAt: event.appointment.scheduledAt.toISOString(),
        duration: event.appointment.duration,
        status: event.appointment.status,
        reason: event.appointment.reason,
        timestamp: event.occurredAt.toISOString(),
        eventType: 'appointment:created',
      };

      // Broadcast to nurse's room
      await this.websocketService.broadcastToRoom(
        `user:${event.appointment.nurseId}`,
        'appointment:created',
        payload,
      );

      // Broadcast to student's room
      await this.websocketService.broadcastToRoom(
        `student:${event.appointment.studentId}`,
        'appointment:created',
        payload,
      );

      // Broadcast to organization room if multi-tenant
      if (event.context.organizationId) {
        await this.websocketService.broadcastToRoom(
          `organization:${event.context.organizationId}`,
          'appointment:created',
          payload,
        );
      }

      this.logger.log(
        `Successfully broadcasted appointment created: ${event.appointment.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast appointment created event: ${error.message}`,
        error.stack,
      );
      // Don't throw - event listeners should not fail the main operation
    }
  }

  /**
   * Handle Appointment Updated Event
   *
   * Broadcasts to relevant rooms only if update requires notification
   * (e.g., status change, rescheduling)
   *
   * @event appointment.updated
   */
  @OnEvent('appointment.updated')
  async handleAppointmentUpdated(
    event: AppointmentUpdatedEvent,
  ): Promise<void> {
    // Only broadcast significant updates
    if (!event.requiresNotification()) {
      this.logger.debug(
        `Skipping broadcast for minor update: ${event.appointment.id}`,
      );
      return;
    }

    this.logger.log(
      `Broadcasting appointment updated: ${event.appointment.id}`,
    );

    try {
      const payload: AppointmentWebSocketPayload = {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        type: event.appointment.type,
        scheduledAt: event.appointment.scheduledAt.toISOString(),
        duration: event.appointment.duration,
        status: event.appointment.status,
        reason: event.appointment.reason,
        timestamp: event.occurredAt.toISOString(),
        eventType: 'appointment:updated',
      };

      await this.websocketService.broadcastToRoom(
        `user:${event.appointment.nurseId}`,
        'appointment:updated',
        payload,
      );

      await this.websocketService.broadcastToRoom(
        `student:${event.appointment.studentId}`,
        'appointment:updated',
        payload,
      );

      this.logger.log(
        `Successfully broadcasted appointment updated: ${event.appointment.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast appointment updated event: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Handle Appointment Cancelled Event
   *
   * High-priority notification to both nurse and student
   *
   * @event appointment.cancelled
   */
  @OnEvent('appointment.cancelled')
  async handleAppointmentCancelled(
    event: AppointmentCancelledEvent,
  ): Promise<void> {
    this.logger.log(
      `Broadcasting appointment cancelled: ${event.appointmentId}`,
    );

    try {
      const payload = {
        appointmentId: event.appointmentId,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        scheduledAt: event.appointment.scheduledAt.toISOString(),
        reason: event.reason,
        timestamp: event.occurredAt.toISOString(),
        eventType: 'appointment:cancelled',
      };

      await this.websocketService.broadcastToRoom(
        `user:${event.appointment.nurseId}`,
        'appointment:cancelled',
        payload,
      );

      await this.websocketService.broadcastToRoom(
        `student:${event.appointment.studentId}`,
        'appointment:cancelled',
        payload,
      );

      this.logger.log(
        `Successfully broadcasted appointment cancelled: ${event.appointmentId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast appointment cancelled event: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Handle Appointment Rescheduled Event
   *
   * Notifies all parties of time change
   *
   * @event appointment.rescheduled
   */
  @OnEvent('appointment.rescheduled')
  async handleAppointmentRescheduled(
    event: AppointmentRescheduledEvent,
  ): Promise<void> {
    this.logger.log(
      `Broadcasting appointment rescheduled: ${event.appointment.id}`,
    );

    try {
      const payload = {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        oldScheduledAt: event.oldScheduledAt.toISOString(),
        newScheduledAt: event.newScheduledAt.toISOString(),
        duration: event.appointment.duration,
        timestamp: event.occurredAt.toISOString(),
        eventType: 'appointment:rescheduled',
      };

      await this.websocketService.broadcastToRoom(
        `user:${event.appointment.nurseId}`,
        'appointment:rescheduled',
        payload,
      );

      await this.websocketService.broadcastToRoom(
        `student:${event.appointment.studentId}`,
        'appointment:rescheduled',
        payload,
      );

      this.logger.log(
        `Successfully broadcasted appointment rescheduled: ${event.appointment.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast appointment rescheduled event: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Handle Appointment Started Event
   *
   * Real-time status update when appointment begins
   *
   * @event appointment.started
   */
  @OnEvent('appointment.started')
  async handleAppointmentStarted(
    event: AppointmentStartedEvent,
  ): Promise<void> {
    this.logger.log(
      `Broadcasting appointment started: ${event.appointment.id}`,
    );

    try {
      const payload: AppointmentWebSocketPayload = {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        type: event.appointment.type,
        scheduledAt: event.appointment.scheduledAt.toISOString(),
        duration: event.appointment.duration,
        status: 'IN_PROGRESS',
        timestamp: event.occurredAt.toISOString(),
        eventType: 'appointment:started',
      };

      await this.websocketService.broadcastToRoom(
        `user:${event.appointment.nurseId}`,
        'appointment:started',
        payload,
      );

      await this.websocketService.broadcastToRoom(
        `student:${event.appointment.studentId}`,
        'appointment:started',
        payload,
      );

      this.logger.log(
        `Successfully broadcasted appointment started: ${event.appointment.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast appointment started event: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Handle Appointment Completed Event
   *
   * Final status notification with completion details
   *
   * @event appointment.completed
   */
  @OnEvent('appointment.completed')
  async handleAppointmentCompleted(
    event: AppointmentCompletedEvent,
  ): Promise<void> {
    this.logger.log(
      `Broadcasting appointment completed: ${event.appointment.id}`,
    );

    try {
      const payload = {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        scheduledAt: event.appointment.scheduledAt.toISOString(),
        completedAt: event.occurredAt.toISOString(),
        followUpRequired: event.followUpRequired,
        timestamp: event.occurredAt.toISOString(),
        eventType: 'appointment:completed',
      };

      await this.websocketService.broadcastToRoom(
        `user:${event.appointment.nurseId}`,
        'appointment:completed',
        payload,
      );

      await this.websocketService.broadcastToRoom(
        `student:${event.appointment.studentId}`,
        'appointment:completed',
        payload,
      );

      this.logger.log(
        `Successfully broadcasted appointment completed: ${event.appointment.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast appointment completed event: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Handle Appointment No-Show Event
   *
   * Alert nurse and track no-show metrics
   *
   * @event appointment.no-show
   */
  @OnEvent('appointment.no-show')
  async handleAppointmentNoShow(event: AppointmentNoShowEvent): Promise<void> {
    this.logger.log(
      `Broadcasting appointment no-show: ${event.appointment.id}`,
    );

    try {
      const payload = {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        scheduledAt: event.appointment.scheduledAt.toISOString(),
        timestamp: event.occurredAt.toISOString(),
        eventType: 'appointment:no-show',
      };

      // Primarily notify nurse
      await this.websocketService.broadcastToRoom(
        `user:${event.appointment.nurseId}`,
        'appointment:no-show',
        payload,
      );

      this.logger.log(
        `Successfully broadcasted appointment no-show: ${event.appointment.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast appointment no-show event: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Handle Appointment Reminder Event
   *
   * Push notification for upcoming appointments
   *
   * @event appointment.reminder
   */
  @OnEvent('appointment.reminder')
  async handleAppointmentReminder(
    event: AppointmentReminderEvent,
  ): Promise<void> {
    this.logger.log(
      `Broadcasting appointment reminder: ${event.appointment.id}`,
    );

    try {
      const payload = {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        scheduledAt: event.appointment.scheduledAt.toISOString(),
        hoursBeforeAppointment: event.hoursBeforeAppointment,
        message: event.message,
        timestamp: event.occurredAt.toISOString(),
        eventType: 'appointment:reminder',
      };

      // Send push notification to student
      await this.websocketService.broadcastToRoom(
        `student:${event.appointment.studentId}`,
        'appointment:reminder',
        payload,
      );

      this.logger.log(
        `Successfully broadcasted appointment reminder: ${event.appointment.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast appointment reminder event: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Handle Waitlist Entry Added Event
   *
   * Notify staff of new waitlist entries
   *
   * @event appointment.waitlist.added
   */
  @OnEvent('appointment.waitlist.added')
  async handleWaitlistEntryAdded(
    event: WaitlistEntryAddedEvent,
  ): Promise<void> {
    this.logger.log(`Broadcasting waitlist entry added: ${event.studentId}`);

    try {
      const payload = {
        waitlistEntryId: event.waitlistEntryId,
        studentId: event.studentId,
        preferredDate: event.preferredDate?.toISOString(),
        priority: event.priority,
        timestamp: event.occurredAt.toISOString(),
        eventType: 'waitlist:added',
      };

      // Broadcast to global waitlist room for staff monitoring
      await this.websocketService.broadcastToRoom(
        'waitlist',
        'waitlist:added',
        payload,
      );

      // Notify student
      await this.websocketService.broadcastToRoom(
        `student:${event.studentId}`,
        'waitlist:added',
        payload,
      );

      this.logger.log(
        `Successfully broadcasted waitlist entry added: ${event.waitlistEntryId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast waitlist entry added event: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Handle Waitlist Slot Available Event
   *
   * Urgent notification to waitlist students of open slots
   *
   * @event appointment.waitlist.slot-available
   */
  @OnEvent('appointment.waitlist.slot-available')
  async handleWaitlistSlotAvailable(
    event: WaitlistSlotAvailableEvent,
  ): Promise<void> {
    this.logger.log(
      `Broadcasting waitlist slot available at ${event.availableSlotTime}`,
    );

    try {
      const payload = {
        nurseId: event.nurseId,
        availableSlotTime: event.availableSlotTime.toISOString(),
        duration: event.duration,
        notifiedWaitlistEntryIds: event.notifiedWaitlistEntryIds,
        timestamp: event.occurredAt.toISOString(),
        eventType: 'waitlist:slot-available',
      };

      // Broadcast to waitlist room
      await this.websocketService.broadcastToRoom(
        'waitlist',
        'waitlist:slot-available',
        payload,
      );

      this.logger.log(
        `Successfully broadcasted waitlist slot available, notified ${event.notifiedWaitlistEntryIds.length} entries`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to broadcast waitlist slot available event: ${error.message}`,
        error.stack,
      );
    }
  }
}
