/**
 * @fileoverview Student Domain Events
 * @module student/events
 * @description Event classes for student-related domain events to enable event-driven architecture
 * and eliminate circular dependencies between Student, Appointment, HealthRecord, and other services.
 *
 * Architecture Pattern: Domain Events (DDD)
 * - Events represent facts that have happened in the student domain
 * - Immutable event payload with timestamp for audit trail
 * - HIPAA-compliant with minimal PHI exposure
 * - Supports event sourcing and compliance audit
 *
 * @see NESTJS_SERVICES_REVIEW.md Section 9.1 - Event-Driven Architecture
 */

/**
 * Request Context for audit trail and security
 */
export interface RequestContext {
  userId: string;
  userRole: string;
  requestId?: string;
  ipAddress?: string;
  organizationId?: string;
  timestamp: Date;
}

/**
 * Student event data (minimal PHI)
 */
export interface StudentEventData {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gradeLevel?: string;
  schoolId?: string;
  isActive: boolean;
}

/**
 * Student Created Event
 *
 * Emitted when: New student is enrolled in the system
 * Listeners:
 * - Email listener: Send welcome email to parent/guardian
 * - Health record listener: Initialize health record
 * - Analytics listener: Track enrollment metrics
 * - Audit listener: Log student creation for compliance
 *
 * @event student.created
 */
export class StudentCreatedEvent {
  readonly eventName = 'student.created';
  readonly occurredAt: Date;

  constructor(
    public readonly student: StudentEventData,
    public readonly context: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
    return {
      eventName: this.eventName,
      eventTime: this.occurredAt.toISOString(),
      studentId: this.student.id,
      gradeLevel: this.student.gradeLevel,
      schoolId: this.student.schoolId,
      userId: this.context.userId,
      userRole: this.context.userRole,
      requestId: this.context.requestId,
    };
  }
}

/**
 * Student Updated Event
 *
 * Emitted when: Student profile information is modified
 * Listeners:
 * - Appointment listener: Update related appointments if necessary
 * - Email listener: Notify parent/guardian of changes
 * - Audit listener: Track all student data modifications
 *
 * @event student.updated
 */
export class StudentUpdatedEvent {
  readonly eventName = 'student.updated';
  readonly occurredAt: Date;

  constructor(
    public readonly student: StudentEventData,
    public readonly previousData: Partial<StudentEventData>,
    public readonly context: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
    return {
      eventName: this.eventName,
      eventTime: this.occurredAt.toISOString(),
      studentId: this.student.id,
      changes: this.previousData,
      userId: this.context.userId,
      userRole: this.context.userRole,
      requestId: this.context.requestId,
    };
  }
}

/**
 * Student Transferred Event
 *
 * Emitted when: Student transfers to different school or grade
 * Listeners:
 * - Appointment listener: Update or cancel future appointments
 * - Health record listener: Transfer health records
 * - Email listener: Send transfer confirmation
 * - Analytics listener: Track student mobility metrics
 *
 * @event student.transferred
 */
export class StudentTransferredEvent {
  readonly eventName = 'student.transferred';
  readonly occurredAt: Date;

  constructor(
    public readonly studentId: string,
    public readonly fromSchoolId: string,
    public readonly toSchoolId: string,
    public readonly fromGrade?: string,
    public readonly toGrade?: string,
    public readonly transferDate?: Date,
    public readonly context?: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
    return {
      eventName: this.eventName,
      eventTime: this.occurredAt.toISOString(),
      studentId: this.studentId,
      fromSchoolId: this.fromSchoolId,
      toSchoolId: this.toSchoolId,
      fromGrade: this.fromGrade,
      toGrade: this.toGrade,
      transferDate: this.transferDate?.toISOString(),
      userId: this.context?.userId,
      userRole: this.context?.userRole,
    };
  }
}

/**
 * Student Graduated Event
 *
 * Emitted when: Student graduates or leaves school system
 * Listeners:
 * - Appointment listener: Cancel future appointments
 * - Health record listener: Archive health records
 * - Email listener: Send graduation/exit notification
 * - Analytics listener: Track graduation metrics
 *
 * @event student.graduated
 */
export class StudentGraduatedEvent {
  readonly eventName = 'student.graduated';
  readonly occurredAt: Date;

  constructor(
    public readonly studentId: string,
    public readonly graduationDate: Date,
    public readonly finalGrade?: string,
    public readonly context?: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
    return {
      eventName: this.eventName,
      eventTime: this.occurredAt.toISOString(),
      studentId: this.studentId,
      graduationDate: this.graduationDate.toISOString(),
      finalGrade: this.finalGrade,
      userId: this.context?.userId,
      userRole: this.context?.userRole,
    };
  }
}

/**
 * Student Health Record Updated Event
 *
 * Emitted when: Student's health record is modified
 * Listeners:
 * - Alert listener: Check for critical health changes requiring alerts
 * - Appointment listener: Adjust appointment scheduling based on health status
 * - Email listener: Notify parent/guardian of health record updates
 * - Audit listener: HIPAA audit trail
 *
 * @event student.health-record-updated
 */
export class StudentHealthRecordUpdatedEvent {
  readonly eventName = 'student.health-record-updated';
  readonly occurredAt: Date;

  constructor(
    public readonly studentId: string,
    public readonly healthRecordId: string,
    public readonly updateType:
      | 'allergy'
      | 'medication'
      | 'condition'
      | 'immunization'
      | 'vital-signs'
      | 'general',
    public readonly requiresAlert: boolean,
    public readonly context?: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
    return {
      eventName: this.eventName,
      eventTime: this.occurredAt.toISOString(),
      studentId: this.studentId,
      healthRecordId: this.healthRecordId,
      updateType: this.updateType,
      requiresAlert: this.requiresAlert,
      userId: this.context?.userId,
      userRole: this.context?.userRole,
    };
  }
}

/**
 * Student Emergency Contact Updated Event
 *
 * Emitted when: Emergency contact information is changed
 * Listeners:
 * - Email listener: Send verification email to new contacts
 * - Audit listener: Track emergency contact changes for compliance
 *
 * @event student.emergency-contact-updated
 */
export class StudentEmergencyContactUpdatedEvent {
  readonly eventName = 'student.emergency-contact-updated';
  readonly occurredAt: Date;

  constructor(
    public readonly studentId: string,
    public readonly contactId: string,
    public readonly changeType: 'added' | 'updated' | 'removed',
    public readonly context?: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
    return {
      eventName: this.eventName,
      eventTime: this.occurredAt.toISOString(),
      studentId: this.studentId,
      contactId: this.contactId,
      changeType: this.changeType,
      userId: this.context?.userId,
      userRole: this.context?.userRole,
    };
  }
}

/**
 * Student Immunization Record Updated Event
 *
 * Emitted when: Immunization records are added or updated
 * Listeners:
 * - Compliance listener: Check immunization compliance status
 * - Email listener: Send compliance notifications if needed
 * - Alert listener: Create alerts for missing/overdue immunizations
 *
 * @event student.immunization-updated
 */
export class StudentImmunizationUpdatedEvent {
  readonly eventName = 'student.immunization-updated';
  readonly occurredAt: Date;

  constructor(
    public readonly studentId: string,
    public readonly immunizationType: string,
    public readonly isCompliant: boolean,
    public readonly dueDate?: Date,
    public readonly context?: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
    return {
      eventName: this.eventName,
      eventTime: this.occurredAt.toISOString(),
      studentId: this.studentId,
      immunizationType: this.immunizationType,
      isCompliant: this.isCompliant,
      dueDate: this.dueDate?.toISOString(),
      userId: this.context?.userId,
      userRole: this.context?.userRole,
    };
  }
}

/**
 * Student Deactivated Event
 *
 * Emitted when: Student account is deactivated
 * Listeners:
 * - Appointment listener: Cancel all future appointments
 * - Access control listener: Revoke portal access
 * - Email listener: Send deactivation notification
 * - Audit listener: Log deactivation
 *
 * @event student.deactivated
 */
export class StudentDeactivatedEvent {
  readonly eventName = 'student.deactivated';
  readonly occurredAt: Date;

  constructor(
    public readonly studentId: string,
    public readonly reason: string,
    public readonly context?: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
    return {
      eventName: this.eventName,
      eventTime: this.occurredAt.toISOString(),
      studentId: this.studentId,
      reason: this.reason,
      userId: this.context?.userId,
      userRole: this.context?.userRole,
    };
  }
}
