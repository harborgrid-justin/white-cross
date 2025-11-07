/**
 * @fileoverview Healthcare Domain Exception
 * @module common/exceptions/exceptions/healthcare
 * @description Custom exception for healthcare-specific errors
 */

import { HttpException, HttpStatus } from '@nestjs/common';
import { HealthcareErrorCodes, ErrorCode } from '../constants/error-codes';

/**
 * Healthcare domain type
 */
export type HealthcareDomain =
  | 'clinical'
  | 'medication'
  | 'allergy'
  | 'vaccination'
  | 'appointment'
  | 'consent'
  | 'incident';

/**
 * Safety level for healthcare errors
 */
export type SafetyLevel = 'critical' | 'warning' | 'info';

/**
 * Healthcare Exception
 *
 * @class HealthcareException
 * @extends {HttpException}
 *
 * @description Exception thrown for healthcare-specific errors
 *
 * @example
 * throw new HealthcareException(
 *   'Drug interaction detected',
 *   HealthcareErrorCodes.DRUG_INTERACTION_DETECTED,
 *   'medication',
 *   'critical',
 *   { medications: ['Aspirin', 'Warfarin'] }
 * );
 */
export class HealthcareException extends HttpException {
  public readonly errorCode: ErrorCode;
  public readonly domain: HealthcareDomain;
  public readonly safetyLevel: SafetyLevel;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    errorCode: ErrorCode = HealthcareErrorCodes.OPERATION_NOT_ALLOWED,
    domain: HealthcareDomain = 'clinical',
    safetyLevel: SafetyLevel = 'warning',
    context?: Record<string, any>,
  ) {
    const response = {
      success: false,
      error: 'Healthcare Error',
      message,
      errorCode,
      domain,
      safetyLevel,
      context,
    };

    // Critical errors should return 400, others can be 422
    const status =
      safetyLevel === 'critical'
        ? HttpStatus.BAD_REQUEST
        : HttpStatus.UNPROCESSABLE_ENTITY;

    super(response, status);

    this.errorCode = errorCode;
    this.domain = domain;
    this.safetyLevel = safetyLevel;
    this.context = context;
    this.name = 'HealthcareException';
  }

  /**
   * Create exception for drug interaction
   */
  static drugInteraction(
    medications: string[],
    severity: 'critical' | 'moderate' | 'minor',
    details?: string,
  ): HealthcareException {
    const safetyLevel: SafetyLevel =
      severity === 'critical' ? 'critical' : 'warning';

    return new HealthcareException(
      `Drug interaction detected: ${details || 'Please review medication list'}`,
      HealthcareErrorCodes.DRUG_INTERACTION_DETECTED,
      'medication',
      safetyLevel,
      { medications, severity, details },
    );
  }

  /**
   * Create exception for allergy conflict
   */
  static allergyConflict(
    medication: string,
    allergen: string,
    reactionType?: string,
  ): HealthcareException {
    return new HealthcareException(
      `Medication ${medication} conflicts with known allergy to ${allergen}`,
      HealthcareErrorCodes.ALLERGY_CONFLICT,
      'allergy',
      'critical',
      { medication, allergen, reactionType },
    );
  }

  /**
   * Create exception for consent required
   */
  static consentRequired(
    action: string,
    studentId?: string,
  ): HealthcareException {
    return new HealthcareException(
      `Parental consent required for: ${action}`,
      HealthcareErrorCodes.CONSENT_REQUIRED,
      'consent',
      'warning',
      { action, studentId },
    );
  }

  /**
   * Create exception for consent expired
   */
  static consentExpired(
    consentType: string,
    expiryDate: Date,
  ): HealthcareException {
    return new HealthcareException(
      `${consentType} consent expired on ${expiryDate.toISOString().split('T')[0]}`,
      HealthcareErrorCodes.CONSENT_EXPIRED,
      'consent',
      'warning',
      { consentType, expiryDate },
    );
  }

  /**
   * Create exception for dosage out of range
   */
  static dosageOutOfRange(
    medication: string,
    dosage: string,
    minDosage: string,
    maxDosage: string,
  ): HealthcareException {
    return new HealthcareException(
      `Dosage ${dosage} for ${medication} is outside recommended range (${minDosage}-${maxDosage})`,
      HealthcareErrorCodes.DOSAGE_OUT_OF_RANGE,
      'medication',
      'critical',
      { medication, dosage, minDosage, maxDosage },
    );
  }

  /**
   * Create exception for contraindication
   */
  static contraindication(
    medication: string,
    condition: string,
    reason: string,
  ): HealthcareException {
    return new HealthcareException(
      `${medication} is contraindicated for ${condition}: ${reason}`,
      HealthcareErrorCodes.CONTRAINDICATION_DETECTED,
      'medication',
      'critical',
      { medication, condition, reason },
    );
  }

  /**
   * Create exception for age restriction
   */
  static ageRestriction(
    medication: string,
    age: number,
    minAge: number,
  ): HealthcareException {
    return new HealthcareException(
      `${medication} is not approved for ages under ${minAge}. Patient age: ${age}`,
      HealthcareErrorCodes.AGE_RESTRICTION_VIOLATED,
      'medication',
      'critical',
      { medication, age, minAge },
    );
  }

  /**
   * Create exception for vaccination overdue
   */
  static vaccinationOverdue(
    vaccination: string,
    dueDate: Date,
    daysPastDue: number,
  ): HealthcareException {
    return new HealthcareException(
      `${vaccination} vaccination is ${daysPastDue} days overdue`,
      HealthcareErrorCodes.VACCINATION_OVERDUE,
      'vaccination',
      'warning',
      { vaccination, dueDate, daysPastDue },
    );
  }

  /**
   * Create exception for vaccination too soon
   */
  static vaccinationTooSoon(
    vaccination: string,
    nextDueDate: Date,
  ): HealthcareException {
    return new HealthcareException(
      `${vaccination} cannot be administered until ${nextDueDate.toISOString().split('T')[0]}`,
      HealthcareErrorCodes.VACCINATION_TOO_SOON,
      'vaccination',
      'warning',
      { vaccination, nextDueDate },
    );
  }

  /**
   * Create exception for appointment conflict
   */
  static appointmentConflict(
    proposedTime: Date,
    conflictingAppointmentId: string,
  ): HealthcareException {
    return new HealthcareException(
      `Appointment time conflicts with existing appointment`,
      HealthcareErrorCodes.APPOINTMENT_CONFLICT,
      'appointment',
      'info',
      { proposedTime, conflictingAppointmentId },
    );
  }

  /**
   * Create exception for vital signs out of range
   */
  static vitalSignsOutOfRange(
    vitalSign: string,
    value: number,
    minNormal: number,
    maxNormal: number,
  ): HealthcareException {
    return new HealthcareException(
      `${vitalSign} (${value}) is outside normal range (${minNormal}-${maxNormal})`,
      HealthcareErrorCodes.VITAL_SIGNS_OUT_OF_RANGE,
      'clinical',
      'warning',
      { vitalSign, value, minNormal, maxNormal },
    );
  }
}
