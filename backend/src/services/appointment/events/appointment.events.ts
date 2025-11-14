/**
 * @fileoverview Appointment Domain Events
 * @module appointment/events
 * @description Event classes for appointment-related domain events to enable event-driven architecture
 * and eliminate circular dependencies. Supports audit logging, event replay, and decoupled communication.
 *
 * Architecture Pattern: Domain Events (DDD)
 * - Events represent facts that have happened in the appointment domain
 * - Immutable event payload with timestamp for audit trail
 * - Supports event sourcing and CQRS patterns
 * - HIPAA-compliant with PHI tracking in context
 *
 * @see NESTJS_SERVICES_REVIEW.md Section 9.1 - Event-Driven Architecture
 */

/**
 * Request Context for HIPAA Compliance and Audit Trail
 * Captures user, session, and security context for all appointment events
 */
export interface RequestContext {
  /** User ID performing the action */
  userId: string;
  /** User role (NURSE, ADMIN, etc.) */
  userRole: string;
  /** Session/request ID for tracing */
  requestId?: string;
  /** IP address for security audit */
  ipAddress?: string;
  /** User agent for device tracking */
  userAgent?: string;
  /** Organization/tenant ID for multi-tenancy */
  organizationId?: string;
  /** Timestamp when event was triggered */
  timestamp: Date;
}

/**
 * Base appointment data interface for events
 * Minimal PHI exposure - only essential fields
 */
export interface AppointmentEventData {
  id: string;
  studentId: string;
  nurseId: string;
  type: string;
  scheduledAt: Date;
  duration: number;
  status: string;
  reason?: string;
}

/**
 * Appointment Created Event
 *
 * Emitted when: New appointment is successfully created
 * Listeners:
 * - WebSocket listener: Broadcast real-time notification to nurse and student
 * - Email listener: Send confirmation email to student/parent
 * - Analytics listener: Track appointment creation metrics
 * - Audit listener: Log creation event for compliance
 *
 * @event appointment.created
 */
export class AppointmentCreatedEvent {
  readonly eventName = 'appointment.created';
  readonly occurredAt: Date;

  constructor(
    public readonly appointment: AppointmentEventData,
    public readonly context: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  /**
   * Get serializable event payload for audit logging
   * Excludes sensitive PHI beyond minimum required
   */
  toAuditLog(): Record<string, any> {
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

/**
 * Appointment Updated Event
 *
 * Emitted when: Appointment is modified (notes, status, etc.)
 * Listeners:
 * - WebSocket listener: Broadcast update to connected clients
 * - Email listener: Send update notification if significant changes
 * - Audit listener: Track all modifications for compliance
 *
 * @event appointment.updated
 */
export class AppointmentUpdatedEvent {
  readonly eventName = 'appointment.updated';
  readonly occurredAt: Date;

  constructor(
    public readonly appointment: AppointmentEventData,
    public readonly previousData: Partial<AppointmentEventData>,
    public readonly context: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  /**
   * Check if update requires notification
   * (status change, rescheduling, etc.)
   */
  requiresNotification(): boolean {
    return !!(
      this.previousData.scheduledAt ||
      this.previousData.status ||
      this.previousData.nurseId
    );
  }

  toAuditLog(): Record<string, any> {
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

/**
 * Appointment Cancelled Event
 *
 * Emitted when: Appointment is cancelled
 * Listeners:
 * - WebSocket listener: Real-time cancellation notification
 * - Email listener: Send cancellation email with reason
 * - Waitlist listener: Process waitlist to fill cancelled slot
 * - Reminder listener: Cancel all pending reminders
 * - Audit listener: Log cancellation for compliance
 *
 * @event appointment.cancelled
 */
export class AppointmentCancelledEvent {
  readonly eventName = 'appointment.cancelled';
  readonly occurredAt: Date;

  constructor(
    public readonly appointmentId: string,
    public readonly appointment: AppointmentEventData,
    public readonly reason: string,
    public readonly context: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
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

/**
 * Appointment Rescheduled Event
 *
 * Emitted when: Appointment time/date is changed
 * Listeners:
 * - WebSocket listener: Broadcast reschedule notification
 * - Email listener: Send rescheduling confirmation
 * - Reminder listener: Cancel old reminders, schedule new ones
 * - Audit listener: Track rescheduling history
 *
 * @event appointment.rescheduled
 */
export class AppointmentRescheduledEvent {
  readonly eventName = 'appointment.rescheduled';
  readonly occurredAt: Date;

  constructor(
    public readonly appointment: AppointmentEventData,
    public readonly oldScheduledAt: Date,
    public readonly newScheduledAt: Date,
    public readonly context: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
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

/**
 * Appointment Started Event
 *
 * Emitted when: Appointment status transitions to IN_PROGRESS
 * Listeners:
 * - WebSocket listener: Real-time status update
 * - Analytics listener: Track appointment start metrics
 * - Audit listener: Log appointment start time
 *
 * @event appointment.started
 */
export class AppointmentStartedEvent {
  readonly eventName = 'appointment.started';
  readonly occurredAt: Date;

  constructor(
    public readonly appointment: AppointmentEventData,
    public readonly context: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
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

/**
 * Appointment Completed Event
 *
 * Emitted when: Appointment is successfully completed
 * Listeners:
 * - WebSocket listener: Status update notification
 * - Email listener: Send follow-up or satisfaction survey
 * - Analytics listener: Track completion metrics, duration
 * - Health record listener: Link appointment to health record updates
 * - Audit listener: Log completion for billing/compliance
 *
 * @event appointment.completed
 */
export class AppointmentCompletedEvent {
  readonly eventName = 'appointment.completed';
  readonly occurredAt: Date;

  constructor(
    public readonly appointment: AppointmentEventData,
    public readonly completionNotes?: string,
    public readonly outcomes?: string,
    public readonly followUpRequired?: boolean,
    public readonly context?: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
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

/**
 * Appointment No-Show Event
 *
 * Emitted when: Patient doesn't show up for appointment
 * Listeners:
 * - WebSocket listener: Alert nurse of no-show
 * - Email listener: Send no-show notification to student/parent
 * - Analytics listener: Track no-show rate by student
 * - Waitlist listener: Attempt to fill slot from waitlist
 * - Policy listener: Track no-shows for cancellation policy
 * - Audit listener: Log no-show for billing/compliance
 *
 * @event appointment.no-show
 */
export class AppointmentNoShowEvent {
  readonly eventName = 'appointment.no-show';
  readonly occurredAt: Date;

  constructor(
    public readonly appointment: AppointmentEventData,
    public readonly context: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
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

/**
 * Appointment Reminder Event
 *
 * Emitted when: Automated reminder should be sent (24h, 1h before)
 * Listeners:
 * - Email listener: Send email reminder
 * - SMS listener: Send SMS reminder
 * - WebSocket listener: Push notification to mobile app
 * - Audit listener: Track reminder delivery
 *
 * @event appointment.reminder
 */
export class AppointmentReminderEvent {
  readonly eventName = 'appointment.reminder';
  readonly occurredAt: Date;

  constructor(
    public readonly appointment: AppointmentEventData,
    public readonly reminderType: 'EMAIL' | 'SMS' | 'PUSH',
    public readonly hoursBeforeAppointment: number,
    public readonly message?: string,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
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

/**
 * Waitlist Entry Added Event
 *
 * Emitted when: Student is added to waitlist
 * Listeners:
 * - Email listener: Send waitlist confirmation
 * - WebSocket listener: Notify staff of new waitlist entry
 * - Analytics listener: Track waitlist metrics
 *
 * @event appointment.waitlist.added
 */
export class WaitlistEntryAddedEvent {
  readonly eventName = 'appointment.waitlist.added';
  readonly occurredAt: Date;

  constructor(
    public readonly waitlistEntryId: string,
    public readonly studentId: string,
    public readonly preferredDate?: Date,
    public readonly priority?: string,
    public readonly context?: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
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

/**
 * Waitlist Slot Available Event
 *
 * Emitted when: Appointment is cancelled and slot becomes available
 * Listeners:
 * - Email listener: Notify waitlist students of available slot
 * - SMS listener: Send urgent notification to top priority waitlist entries
 * - WebSocket listener: Real-time notification
 *
 * @event appointment.waitlist.slot-available
 */
export class WaitlistSlotAvailableEvent {
  readonly eventName = 'appointment.waitlist.slot-available';
  readonly occurredAt: Date;

  constructor(
    public readonly nurseId: string,
    public readonly availableSlotTime: Date,
    public readonly duration: number,
    public readonly notifiedWaitlistEntryIds: string[],
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
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
