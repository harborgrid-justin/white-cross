/**
 * @fileoverview Medication Domain Events
 * @module medication/events
 * @description Event classes for medication-related domain events to enable event-driven architecture
 * and eliminate circular dependencies between Medication, Student, HealthRecord, and Alert services.
 *
 * Architecture Pattern: Domain Events (DDD)
 * - Events represent facts that have happened in the medication domain
 * - Immutable event payload with timestamp for audit trail
 * - HIPAA-compliant with PHI tracking
 * - Critical for medication safety and compliance
 *
 * Safety Features:
 * - Drug interaction detection
 * - Allergy checking
 * - Dosage validation
 * - Expiration tracking
 * - Administration verification
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
 * Medication event data
 */
export interface MedicationEventData {
  id: string;
  studentId: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy?: string;
  isActive: boolean;
}

/**
 * Medication Prescribed Event
 *
 * Emitted when: New medication is prescribed to student
 * Listeners:
 * - Interaction checker: Check for drug-drug and drug-allergy interactions
 * - Alert listener: Create alerts for critical medications
 * - Email listener: Notify parent/guardian of new prescription
 * - Inventory listener: Check medication stock levels
 * - Audit listener: Log prescription for compliance
 *
 * @event medication.prescribed
 */
export class MedicationPrescribedEvent {
  readonly eventName = 'medication.prescribed';
  readonly occurredAt: Date;

  constructor(
    public readonly medication: MedicationEventData,
    public readonly prescribedBy: string,
    public readonly indication: string,
    public readonly context: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
    return {
      eventName: this.eventName,
      eventTime: this.occurredAt.toISOString(),
      medicationId: this.medication.id,
      studentId: this.medication.studentId,
      medicationName: this.medication.name,
      dosage: this.medication.dosage,
      prescribedBy: this.prescribedBy,
      indication: this.indication,
      userId: this.context.userId,
      userRole: this.context.userRole,
      requestId: this.context.requestId,
    };
  }
}

/**
 * Medication Administered Event
 *
 * Emitted when: Medication is given to student
 * Listeners:
 * - Health record listener: Update medication administration log
 * - Alert listener: Check for adverse reactions or missed doses
 * - Parent notification listener: Send administration confirmation
 * - Analytics listener: Track medication adherence
 * - Audit listener: HIPAA compliance logging
 *
 * @event medication.administered
 */
export class MedicationAdministeredEvent {
  readonly eventName = 'medication.administered';
  readonly occurredAt: Date;

  constructor(
    public readonly medicationId: string,
    public readonly studentId: string,
    public readonly administeredBy: string,
    public readonly dosageGiven: string,
    public readonly administrationTime: Date,
    public readonly route: string,
    public readonly notes?: string,
    public readonly witnessedBy?: string,
    public readonly context?: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
    return {
      eventName: this.eventName,
      eventTime: this.occurredAt.toISOString(),
      medicationId: this.medicationId,
      studentId: this.studentId,
      administeredBy: this.administeredBy,
      dosageGiven: this.dosageGiven,
      administrationTime: this.administrationTime.toISOString(),
      route: this.route,
      witnessedBy: this.witnessedBy,
      userId: this.context?.userId,
      userRole: this.context?.userRole,
    };
  }
}

/**
 * Medication Refused Event
 *
 * Emitted when: Student refuses to take medication
 * Listeners:
 * - Alert listener: Create high-priority alert for critical medications
 * - Email listener: Immediate notification to parent and prescriber
 * - Health record listener: Document refusal
 * - Audit listener: Compliance logging
 *
 * @event medication.refused
 */
export class MedicationRefusedEvent {
  readonly eventName = 'medication.refused';
  readonly occurredAt: Date;

  constructor(
    public readonly medicationId: string,
    public readonly studentId: string,
    public readonly scheduledTime: Date,
    public readonly refusalReason?: string,
    public readonly attemptedBy?: string,
    public readonly isCriticalMedication?: boolean,
    public readonly context?: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
    return {
      eventName: this.eventName,
      eventTime: this.occurredAt.toISOString(),
      medicationId: this.medicationId,
      studentId: this.studentId,
      scheduledTime: this.scheduledTime.toISOString(),
      refusalReason: this.refusalReason,
      attemptedBy: this.attemptedBy,
      isCriticalMedication: this.isCriticalMedication,
      userId: this.context?.userId,
      userRole: this.context?.userRole,
    };
  }
}

/**
 * Medication Interaction Detected Event
 *
 * Emitted when: Potential drug interaction is identified
 * Listeners:
 * - Alert listener: Create CRITICAL alert for dangerous interactions
 * - Email listener: Immediate notification to nurse and prescriber
 * - Medication review listener: Flag for pharmacist review
 * - Audit listener: Safety incident logging
 *
 * @event medication.interaction-detected
 */
export class MedicationInteractionDetectedEvent {
  readonly eventName = 'medication.interaction-detected';
  readonly occurredAt: Date;

  constructor(
    public readonly studentId: string,
    public readonly medication1Id: string,
    public readonly medication2Id: string,
    public readonly medication1Name: string,
    public readonly medication2Name: string,
    public readonly interactionSeverity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'SEVERE',
    public readonly interactionDescription: string,
    public readonly recommendedAction: string,
    public readonly context?: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  isCritical(): boolean {
    return this.interactionSeverity === 'MAJOR' || this.interactionSeverity === 'SEVERE';
  }

  toAuditLog(): Record<string, any> {
    return {
      eventName: this.eventName,
      eventTime: this.occurredAt.toISOString(),
      studentId: this.studentId,
      medication1Id: this.medication1Id,
      medication2Id: this.medication2Id,
      medication1Name: this.medication1Name,
      medication2Name: this.medication2Name,
      interactionSeverity: this.interactionSeverity,
      interactionDescription: this.interactionDescription,
      recommendedAction: this.recommendedAction,
      userId: this.context?.userId,
      userRole: this.context?.userRole,
    };
  }
}

/**
 * Medication Expiring Soon Event
 *
 * Emitted when: Medication is approaching expiration date
 * Listeners:
 * - Alert listener: Create notification for medication replacement
 * - Email listener: Notify nurse and parent about renewal
 * - Inventory listener: Flag for replacement order
 * - Audit listener: Track medication lifecycle
 *
 * @event medication.expiring-soon
 */
export class MedicationExpiringSoonEvent {
  readonly eventName = 'medication.expiring-soon';
  readonly occurredAt: Date;

  constructor(
    public readonly medicationId: string,
    public readonly studentId: string,
    public readonly medicationName: string,
    public readonly expirationDate: Date,
    public readonly daysUntilExpiration: number,
    public readonly requiresRenewal: boolean,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
    return {
      eventName: this.eventName,
      eventTime: this.occurredAt.toISOString(),
      medicationId: this.medicationId,
      studentId: this.studentId,
      medicationName: this.medicationName,
      expirationDate: this.expirationDate.toISOString(),
      daysUntilExpiration: this.daysUntilExpiration,
      requiresRenewal: this.requiresRenewal,
    };
  }
}

/**
 * Medication Discontinued Event
 *
 * Emitted when: Medication is discontinued/stopped
 * Listeners:
 * - Health record listener: Update medication list
 * - Alert listener: Cancel medication-related alerts
 * - Email listener: Notify parent/guardian of discontinuation
 * - Audit listener: Log discontinuation
 *
 * @event medication.discontinued
 */
export class MedicationDiscontinuedEvent {
  readonly eventName = 'medication.discontinued';
  readonly occurredAt: Date;

  constructor(
    public readonly medicationId: string,
    public readonly studentId: string,
    public readonly discontinuedBy: string,
    public readonly reason: string,
    public readonly discontinuationDate: Date,
    public readonly context?: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
    return {
      eventName: this.eventName,
      eventTime: this.occurredAt.toISOString(),
      medicationId: this.medicationId,
      studentId: this.studentId,
      discontinuedBy: this.discontinuedBy,
      reason: this.reason,
      discontinuationDate: this.discontinuationDate.toISOString(),
      userId: this.context?.userId,
      userRole: this.context?.userRole,
    };
  }
}

/**
 * Medication Dosage Changed Event
 *
 * Emitted when: Medication dosage is modified
 * Listeners:
 * - Alert listener: Notify nurse of dosage change
 * - Email listener: Inform parent/guardian
 * - Health record listener: Update medication record
 * - Audit listener: Track dosage modifications
 *
 * @event medication.dosage-changed
 */
export class MedicationDosageChangedEvent {
  readonly eventName = 'medication.dosage-changed';
  readonly occurredAt: Date;

  constructor(
    public readonly medicationId: string,
    public readonly studentId: string,
    public readonly oldDosage: string,
    public readonly newDosage: string,
    public readonly changedBy: string,
    public readonly reason: string,
    public readonly effectiveDate: Date,
    public readonly context?: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
    return {
      eventName: this.eventName,
      eventTime: this.occurredAt.toISOString(),
      medicationId: this.medicationId,
      studentId: this.studentId,
      oldDosage: this.oldDosage,
      newDosage: this.newDosage,
      changedBy: this.changedBy,
      reason: this.reason,
      effectiveDate: this.effectiveDate.toISOString(),
      userId: this.context?.userId,
      userRole: this.context?.userRole,
    };
  }
}

/**
 * Medication Allergy Conflict Event
 *
 * Emitted when: Prescribed medication conflicts with known allergy
 * Listeners:
 * - Alert listener: Create CRITICAL alert to block administration
 * - Email listener: Immediate notification to prescriber and nurse
 * - Safety listener: Trigger medication safety protocol
 * - Audit listener: Critical safety incident logging
 *
 * @event medication.allergy-conflict
 */
export class MedicationAllergyConflictEvent {
  readonly eventName = 'medication.allergy-conflict';
  readonly occurredAt: Date;

  constructor(
    public readonly studentId: string,
    public readonly medicationId: string,
    public readonly medicationName: string,
    public readonly allergyId: string,
    public readonly allergenName: string,
    public readonly allergySeverity: string,
    public readonly blockedAdministration: boolean,
    public readonly context?: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
    return {
      eventName: this.eventName,
      eventTime: this.occurredAt.toISOString(),
      studentId: this.studentId,
      medicationId: this.medicationId,
      medicationName: this.medicationName,
      allergyId: this.allergyId,
      allergenName: this.allergenName,
      allergySeverity: this.allergySeverity,
      blockedAdministration: this.blockedAdministration,
      userId: this.context?.userId,
      userRole: this.context?.userRole,
    };
  }
}

/**
 * Medication Missed Dose Event
 *
 * Emitted when: Scheduled medication dose is missed
 * Listeners:
 * - Alert listener: Create alert for critical medications
 * - Email listener: Notify parent/guardian
 * - Health record listener: Log missed dose
 * - Analytics listener: Track medication adherence
 *
 * @event medication.missed-dose
 */
export class MedicationMissedDoseEvent {
  readonly eventName = 'medication.missed-dose';
  readonly occurredAt: Date;

  constructor(
    public readonly medicationId: string,
    public readonly studentId: string,
    public readonly scheduledTime: Date,
    public readonly isCritical: boolean,
    public readonly reason?: string,
    public readonly context?: RequestContext,
  ) {
    this.occurredAt = new Date();
  }

  toAuditLog(): Record<string, any> {
    return {
      eventName: this.eventName,
      eventTime: this.occurredAt.toISOString(),
      medicationId: this.medicationId,
      studentId: this.studentId,
      scheduledTime: this.scheduledTime.toISOString(),
      isCritical: this.isCritical,
      reason: this.reason,
      userId: this.context?.userId,
      userRole: this.context?.userRole,
    };
  }
}
