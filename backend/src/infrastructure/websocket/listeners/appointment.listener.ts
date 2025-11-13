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
import { ModuleRef } from '@nestjs/core';
import { WebSocketService } from '../websocket.service';
import { BaseWebSocketEventListener } from './base-websocket-event.listener';
import {
  AppointmentCancelledEvent,
  AppointmentCompletedEvent,
  AppointmentCreatedEvent,
  AppointmentNoShowEvent,
  AppointmentReminderEvent,
  AppointmentRescheduledEvent,
  AppointmentStartedEvent,
  AppointmentUpdatedEvent,
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
export class AppointmentWebSocketListener extends BaseWebSocketEventListener {
  constructor(
    moduleRef: ModuleRef,
    private readonly websocketService: WebSocketService,
  ) {
    super(moduleRef, AppointmentWebSocketListener.name);
  }

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
    const payload = this.createPayload(
      {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        type: event.appointment.type,
        scheduledAt: event.appointment.scheduledAt.toISOString(),
        duration: event.appointment.duration,
        status: event.appointment.status,
        reason: event.appointment.reason,
      },
      event.occurredAt.toISOString(),
      'appointment:created',
    );

    const rooms = [
      `user:${event.appointment.nurseId}`,
      `student:${event.appointment.studentId}`,
    ];

    // Add organization room if multi-tenant
    if (event.context.organizationId) {
      rooms.push(`organization:${event.context.organizationId}`);
    }

    await this.broadcastEvent('appointment:created', event.appointment.id, payload, rooms);
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

    const payload = this.createPayload(
      {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        type: event.appointment.type,
        scheduledAt: event.appointment.scheduledAt.toISOString(),
        duration: event.appointment.duration,
        status: event.appointment.status,
        reason: event.appointment.reason,
      },
      event.occurredAt.toISOString(),
      'appointment:updated',
    );

    const rooms = [
      `user:${event.appointment.nurseId}`,
      `student:${event.appointment.studentId}`,
    ];

    await this.broadcastEvent('appointment:updated', event.appointment.id, payload, rooms);
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
    const payload = this.createPayload(
      {
        appointmentId: event.appointmentId,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        scheduledAt: event.appointment.scheduledAt.toISOString(),
        reason: event.reason,
      },
      event.occurredAt.toISOString(),
      'appointment:cancelled',
    );

    const rooms = [
      `user:${event.appointment.nurseId}`,
      `student:${event.appointment.studentId}`,
    ];

    await this.broadcastEvent('appointment:cancelled', event.appointmentId, payload, rooms);
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
    const payload = this.createPayload(
      {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        oldScheduledAt: event.oldScheduledAt.toISOString(),
        newScheduledAt: event.newScheduledAt.toISOString(),
        duration: event.appointment.duration,
      },
      event.occurredAt.toISOString(),
      'appointment:rescheduled',
    );

    const rooms = [
      `user:${event.appointment.nurseId}`,
      `student:${event.appointment.studentId}`,
    ];

    await this.broadcastEvent('appointment:rescheduled', event.appointment.id, payload, rooms);
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
    const payload = this.createPayload(
      {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        type: event.appointment.type,
        scheduledAt: event.appointment.scheduledAt.toISOString(),
        duration: event.appointment.duration,
        status: 'IN_PROGRESS',
      },
      event.occurredAt.toISOString(),
      'appointment:started',
    );

    const rooms = [
      `user:${event.appointment.nurseId}`,
      `student:${event.appointment.studentId}`,
    ];

    await this.broadcastEvent('appointment:started', event.appointment.id, payload, rooms);
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
    const payload = this.createPayload(
      {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        scheduledAt: event.appointment.scheduledAt.toISOString(),
        completedAt: event.occurredAt.toISOString(),
        followUpRequired: event.followUpRequired,
      },
      event.occurredAt.toISOString(),
      'appointment:completed',
    );

    const rooms = [
      `user:${event.appointment.nurseId}`,
      `student:${event.appointment.studentId}`,
    ];

    await this.broadcastEvent('appointment:completed', event.appointment.id, payload, rooms);
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
    const payload = this.createPayload(
      {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        nurseId: event.appointment.nurseId,
        scheduledAt: event.appointment.scheduledAt.toISOString(),
      },
      event.occurredAt.toISOString(),
      'appointment:no-show',
    );

    const rooms = [`user:${event.appointment.nurseId}`];

    await this.broadcastEvent('appointment:no-show', event.appointment.id, payload, rooms);
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
    const payload = this.createPayload(
      {
        appointmentId: event.appointment.id,
        studentId: event.appointment.studentId,
        scheduledAt: event.appointment.scheduledAt.toISOString(),
        hoursBeforeAppointment: event.hoursBeforeAppointment,
        message: event.message,
      },
      event.occurredAt.toISOString(),
      'appointment:reminder',
    );

    const rooms = [`student:${event.appointment.studentId}`];

    await this.broadcastEvent('appointment:reminder', event.appointment.id, payload, rooms);
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
    const payload = this.createPayload(
      {
        waitlistEntryId: event.waitlistEntryId,
        studentId: event.studentId,
        preferredDate: event.preferredDate?.toISOString(),
        priority: event.priority,
      },
      event.occurredAt.toISOString(),
      'waitlist:added',
    );

    const rooms = ['waitlist', `student:${event.studentId}`];

    await this.broadcastEvent('waitlist:added', event.waitlistEntryId, payload, rooms);
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
    const payload = this.createPayload(
      {
        nurseId: event.nurseId,
        availableSlotTime: event.availableSlotTime.toISOString(),
        duration: event.duration,
        notifiedWaitlistEntryIds: event.notifiedWaitlistEntryIds,
      },
      event.occurredAt.toISOString(),
      'waitlist:slot-available',
    );

    const rooms = ['waitlist'];

    await this.broadcastEvent(
      'waitlist:slot-available',
      event.availableSlotTime.toISOString(),
      payload,
      rooms,
    );
  }
}
