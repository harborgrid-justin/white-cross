/**
 * @fileoverview Domain Events for White Cross Healthcare Platform
 * @module services/domain/events/DomainEvents
 * @category Domain Services
 * 
 * Defines all domain events that can occur in the system.
 * Used for event-driven architecture and service orchestration.
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
