/**
 * @fileoverview Health Domain Events
 * @module health-domain/events
 * @description Event classes for health domain operations
 *
 * This module defines events for decoupling health domain services
 * and avoiding circular dependencies using event-driven architecture.
 */

/**
 * Base Health Domain Event
 */
export abstract class HealthDomainEvent {
  constructor(
    public readonly timestamp: Date = new Date(),
    public readonly userId?: string,
  ) {}
}

/**
 * Health Record Events
 */
export class HealthRecordCreatedEvent extends HealthDomainEvent {
  constructor(
    public readonly healthRecordId: string,
    public readonly studentId: string,
    public readonly data: any,
    userId?: string,
  ) {
    super(new Date(), userId);
  }
}

export class HealthRecordUpdatedEvent extends HealthDomainEvent {
  constructor(
    public readonly healthRecordId: string,
    public readonly studentId: string,
    public readonly data: any,
    userId?: string,
  ) {
    super(new Date(), userId);
  }
}

export class HealthRecordDeletedEvent extends HealthDomainEvent {
  constructor(
    public readonly healthRecordId: string,
    public readonly studentId: string,
    userId?: string,
  ) {
    super(new Date(), userId);
  }
}

/**
 * Allergy Events
 */
export class AllergyCreatedEvent extends HealthDomainEvent {
  constructor(
    public readonly allergyId: string,
    public readonly studentId: string,
    public readonly data: any,
    userId?: string,
  ) {
    super(new Date(), userId);
  }
}

export class AllergyUpdatedEvent extends HealthDomainEvent {
  constructor(
    public readonly allergyId: string,
    public readonly studentId: string,
    public readonly data: any,
    userId?: string,
  ) {
    super(new Date(), userId);
  }
}

/**
 * Immunization Events
 */
export class ImmunizationCreatedEvent extends HealthDomainEvent {
  constructor(
    public readonly immunizationId: string,
    public readonly studentId: string,
    public readonly data: any,
    userId?: string,
  ) {
    super(new Date(), userId);
  }
}

export class ImmunizationUpdatedEvent extends HealthDomainEvent {
  constructor(
    public readonly immunizationId: string,
    public readonly studentId: string,
    public readonly data: any,
    userId?: string,
  ) {
    super(new Date(), userId);
  }
}

/**
 * Chronic Condition Events
 */
export class ChronicConditionCreatedEvent extends HealthDomainEvent {
  constructor(
    public readonly conditionId: string,
    public readonly studentId: string,
    public readonly data: any,
    userId?: string,
  ) {
    super(new Date(), userId);
  }
}

export class ChronicConditionUpdatedEvent extends HealthDomainEvent {
  constructor(
    public readonly conditionId: string,
    public readonly studentId: string,
    public readonly data: any,
    userId?: string,
  ) {
    super(new Date(), userId);
  }
}

/**
 * Vital Signs Events
 */
export class VitalSignsRecordedEvent extends HealthDomainEvent {
  constructor(
    public readonly vitalSignsId: string,
    public readonly studentId: string,
    public readonly vitals: any,
    userId?: string,
  ) {
    super(new Date(), userId);
  }
}

export class AbnormalVitalsDetectedEvent extends HealthDomainEvent {
  constructor(
    public readonly studentId: string,
    public readonly vitals: any,
    public readonly anomalies: any[],
    userId?: string,
  ) {
    super(new Date(), userId);
  }
}
