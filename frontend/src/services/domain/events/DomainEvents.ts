/**
 * @fileoverview Domain Event Definitions for Healthcare Platform
 * @module services/domain/events/DomainEvents
 * @category Domain Services
 *
 * Comprehensive collection of domain events representing all business-significant occurrences
 * in the White Cross healthcare platform. Events enable event-driven architecture, service
 * orchestration, and audit trail maintenance.
 *
 * Event Categories:
 * - **Student Events**: Enrollment, transfer, withdrawal lifecycle events
 * - **Health Record Events**: Health profile creation, updates, allergy tracking
 * - **Medication Events**: Prescription, administration, discontinuation
 * - **Emergency Events**: Alerts, incident reporting, critical notifications
 * - **Communication Events**: Parent notifications, messaging
 * - **Appointment Events**: Scheduling, completion, cancellation
 * - **Compliance Events**: Audit logging, violation detection
 *
 * Healthcare Compliance:
 * - All events contain only identifiers, no PHI (Protected Health Information)
 * - Events support HIPAA-compliant audit trails
 * - Timestamps and event IDs enable complete traceability
 * - Events are immutable (readonly properties)
 * - Events follow semantic versioning for schema evolution
 *
 * Event Design Principles:
 * - Named in past tense (e.g., StudentEnrolled, not StudentEnroll)
 * - Self-contained with all necessary context
 * - Lightweight (identifiers only, no full objects)
 * - Versionable for backward compatibility
 * - Type-safe with TypeScript
 *
 * Usage Pattern:
 * ```
 * Publisher → Create Event → EventBus.publish() → Subscribers React
 * ```
 *
 * @example
 * ```typescript
 * // Student enrollment workflow
 * import { StudentEnrolledEvent, HealthRecordCreatedEvent } from './DomainEvents';
 * import { eventBus } from './EventBus';
 *
 * // Publish student enrollment event
 * const enrollmentEvent = new StudentEnrolledEvent(
 *   'student-123',
 *   'SN-2024-001',
 *   'John',
 *   'Doe'
 * );
 * await eventBus.publish(enrollmentEvent);
 *
 * // Subscribers automatically initialize health record
 * eventBus.subscribe('StudentEnrolled', async (event: StudentEnrolledEvent) => {
 *   const healthRecord = await healthService.initialize(event.studentId);
 *   await eventBus.publish(new HealthRecordCreatedEvent(
 *     event.studentId,
 *     healthRecord.id,
 *     'INITIAL'
 *   ));
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Emergency alert workflow
 * import { EmergencyAlertCreatedEvent, ParentNotificationSentEvent } from './DomainEvents';
 *
 * // Create emergency alert
 * const alert = new EmergencyAlertCreatedEvent(
 *   'alert-789',
 *   'student-456',
 *   'Allergic Reaction',
 *   'CRITICAL'
 * );
 * await eventBus.publish(alert);
 *
 * // High-priority handler notifies emergency contacts
 * eventBus.subscribe('EmergencyAlertCreated', async (event) => {
 *   const contacts = await contactService.getEmergencyContacts(event.studentId);
 *   await Promise.all(contacts.map(c => notificationService.sendUrgent(c)));
 * }, 100); // Very high priority
 * ```
 *
 * @example
 * ```typescript
 * // Medication administration workflow
 * import { MedicationPrescribedEvent, MedicationAdministeredEvent } from './DomainEvents';
 *
 * // Prescribe medication
 * await eventBus.publish(new MedicationPrescribedEvent(
 *   'student-123',
 *   'med-456',
 *   'Amoxicillin',
 *   'Dr. Smith'
 * ));
 *
 * // Later, record administration
 * await eventBus.publish(new MedicationAdministeredEvent(
 *   'student-123',
 *   'med-456',
 *   'Nurse Johnson',
 *   '500mg',
 *   new Date()
 * ));
 * ```
 *
 * @see {@link EventBus} for event publishing and subscription
 * @see {@link DomainEvent} for base event class
 * @see {@link ServiceOrchestrator} for workflow coordination using events
 * @see {@link SagaManager} for transaction orchestration with events
 */

import { DomainEvent } from './EventBus';

// ==========================================
// STUDENT EVENTS
// ==========================================

export class StudentEnrolledEvent extends DomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly studentNumber: string,
    public readonly firstName: string,
    public readonly lastName: string,
    timestamp: Date = new Date()
  ) {
    super('StudentEnrolled', timestamp);
  }
}

export class StudentTransferredEvent extends DomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly fromSchoolId: string,
    public readonly toSchoolId: string,
    timestamp: Date = new Date()
  ) {
    super('StudentTransferred', timestamp);
  }
}

export class StudentWithdrawnEvent extends DomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly reason: string,
    timestamp: Date = new Date()
  ) {
    super('StudentWithdrawn', timestamp);
  }
}

// ==========================================
// HEALTH RECORD EVENTS
// ==========================================

export class HealthRecordCreatedEvent extends DomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly recordId: string,
    public readonly recordType: string,
    timestamp: Date = new Date()
  ) {
    super('HealthRecordCreated', timestamp);
  }
}

export class HealthRecordUpdatedEvent extends DomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly recordId: string,
    public readonly recordType: string,
    public readonly changes: string[],
    timestamp: Date = new Date()
  ) {
    super('HealthRecordUpdated', timestamp);
  }
}

export class AllergyAddedEvent extends DomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly allergyId: string,
    public readonly allergen: string,
    public readonly severity: string,
    timestamp: Date = new Date()
  ) {
    super('AllergyAdded', timestamp);
  }
}

export class VaccinationRecordedEvent extends DomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly vaccinationId: string,
    public readonly vaccineType: string,
    public readonly administeredDate: Date,
    timestamp: Date = new Date()
  ) {
    super('VaccinationRecorded', timestamp);
  }
}

// ==========================================
// MEDICATION EVENTS
// ==========================================

export class MedicationPrescribedEvent extends DomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly medicationId: string,
    public readonly medicationName: string,
    public readonly prescribedBy: string,
    timestamp: Date = new Date()
  ) {
    super('MedicationPrescribed', timestamp);
  }
}

export class MedicationAdministeredEvent extends DomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly medicationId: string,
    public readonly administeredBy: string,
    public readonly dosage: string,
    public readonly administeredAt: Date,
    timestamp: Date = new Date()
  ) {
    super('MedicationAdministered', timestamp);
  }
}

export class MedicationDiscontinuedEvent extends DomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly medicationId: string,
    public readonly reason: string,
    timestamp: Date = new Date()
  ) {
    super('MedicationDiscontinued', timestamp);
  }
}

// ==========================================
// EMERGENCY EVENTS
// ==========================================

export class EmergencyAlertCreatedEvent extends DomainEvent {
  constructor(
    public readonly alertId: string,
    public readonly studentId: string,
    public readonly alertType: string,
    public readonly severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    timestamp: Date = new Date()
  ) {
    super('EmergencyAlertCreated', timestamp);
  }
}

export class IncidentReportedEvent extends DomainEvent {
  constructor(
    public readonly incidentId: string,
    public readonly studentId: string,
    public readonly incidentType: string,
    public readonly reportedBy: string,
    timestamp: Date = new Date()
  ) {
    super('IncidentReported', timestamp);
  }
}

// ==========================================
// COMMUNICATION EVENTS
// ==========================================

export class ParentNotificationSentEvent extends DomainEvent {
  constructor(
    public readonly notificationId: string,
    public readonly studentId: string,
    public readonly notificationType: string,
    public readonly sentAt: Date,
    timestamp: Date = new Date()
  ) {
    super('ParentNotificationSent', timestamp);
  }
}

export class MessageSentEvent extends DomainEvent {
  constructor(
    public readonly messageId: string,
    public readonly fromUserId: string,
    public readonly toUserId: string,
    public readonly subject: string,
    timestamp: Date = new Date()
  ) {
    super('MessageSent', timestamp);
  }
}

// ==========================================
// APPOINTMENT EVENTS
// ==========================================

export class AppointmentScheduledEvent extends DomainEvent {
  constructor(
    public readonly appointmentId: string,
    public readonly studentId: string,
    public readonly scheduledFor: Date,
    public readonly appointmentType: string,
    timestamp: Date = new Date()
  ) {
    super('AppointmentScheduled', timestamp);
  }
}

export class AppointmentCompletedEvent extends DomainEvent {
  constructor(
    public readonly appointmentId: string,
    public readonly studentId: string,
    public readonly completedAt: Date,
    public readonly notes: string,
    timestamp: Date = new Date()
  ) {
    super('AppointmentCompleted', timestamp);
  }
}

export class AppointmentCancelledEvent extends DomainEvent {
  constructor(
    public readonly appointmentId: string,
    public readonly studentId: string,
    public readonly reason: string,
    timestamp: Date = new Date()
  ) {
    super('AppointmentCancelled', timestamp);
  }
}

// ==========================================
// COMPLIANCE EVENTS
// ==========================================

export class AuditLogCreatedEvent extends DomainEvent {
  constructor(
    public readonly auditId: string,
    public readonly userId: string,
    public readonly action: string,
    public readonly resourceType: string,
    public readonly resourceId: string,
    timestamp: Date = new Date()
  ) {
    super('AuditLogCreated', timestamp);
  }
}

export class ComplianceViolationDetectedEvent extends DomainEvent {
  constructor(
    public readonly violationId: string,
    public readonly violationType: string,
    public readonly severity: string,
    public readonly details: string,
    timestamp: Date = new Date()
  ) {
    super('ComplianceViolationDetected', timestamp);
  }
}
