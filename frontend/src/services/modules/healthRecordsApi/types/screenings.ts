/**
 * Health Records API - Screening Type Definitions
 *
 * Types for managing health screenings and assessment outcomes
 *
 * @module services/modules/healthRecordsApi/types/screenings
 */

import type { StudentReference } from './base';

/**
 * Types of health screenings conducted
 * Categorizes different screening assessments
 */
export enum ScreeningType {
  /** Visual acuity and eye health screening */
  VISION = 'VISION',
  /** Auditory acuity and hearing health screening */
  HEARING = 'HEARING',
  /** Dental health screening */
  DENTAL = 'DENTAL',
  /** Spinal curvature screening */
  SCOLIOSIS = 'SCOLIOSIS',
  /** Body Mass Index calculation and assessment */
  BMI = 'BMI',
  /** Blood pressure measurement and assessment */
  BLOOD_PRESSURE = 'BLOOD_PRESSURE',
  /** Mental health and wellness screening */
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  /** Developmental milestone assessment */
  DEVELOPMENTAL = 'DEVELOPMENTAL',
  /** Other or specialized screening types */
  OTHER = 'OTHER'
}

/**
 * Outcome of a screening assessment
 * Indicates the result and any required follow-up actions
 */
export enum ScreeningOutcome {
  /** Screening results are within normal/acceptable range */
  PASSED = 'PASSED',
  /** Screening results indicate a concern or out-of-range values */
  FAILED = 'FAILED',
  /** Screening results warrant referral to specialist or further evaluation */
  REFER = 'REFER',
  /** Screening could not be completed or results are unclear */
  INCONCLUSIVE = 'INCONCLUSIVE',
  /** Student or parent declined the screening */
  DECLINED = 'DECLINED'
}

/**
 * Specific measurement types for screenings
 * Provides type-safe structure for common screening measurements
 */
export interface ScreeningMeasurements {
  /** Visual acuity measurements (e.g., "20/20") */
  visualAcuity?: string;
  /** Right eye visual acuity */
  rightEyeAcuity?: string;
  /** Left eye visual acuity */
  leftEyeAcuity?: string;
  /** Hearing threshold in decibels */
  hearingThreshold?: number;
  /** Right ear hearing threshold */
  rightEarThreshold?: number;
  /** Left ear hearing threshold */
  leftEarThreshold?: number;
  /** Blood pressure systolic reading */
  systolic?: number;
  /** Blood pressure diastolic reading */
  diastolic?: number;
  /** Body Mass Index value */
  bmi?: number;
  /** BMI percentile for age and gender */
  bmiPercentile?: number;
  /** Scoliosis angle measurement in degrees */
  scoliosisAngle?: number;
  /** Any additional measurements as key-value pairs */
  [key: string]: string | number | boolean | undefined;
}

/**
 * Complete screening record entity
 * Represents a health screening assessment performed on a student
 */
export interface Screening {
  /** Unique identifier for the screening record */
  id: string;
  /** ID of the student who was screened */
  studentId: string;
  /** Type of screening performed */
  screeningType: ScreeningType;
  /** Date screening was performed (ISO 8601 format) */
  screeningDate: string;
  /** Name of person who performed the screening */
  performedBy: string;
  /** Outcome/result of the screening */
  outcome: ScreeningOutcome;
  /** Detailed results or findings from the screening */
  results?: string;
  /** Structured measurements from the screening */
  measurements?: ScreeningMeasurements;
  /** Whether referral to specialist is required */
  referralRequired: boolean;
  /** Specialist or provider to refer to */
  referralTo?: string;
  /** Whether follow-up screening or assessment is needed */
  followUpRequired: boolean;
  /** Scheduled date for follow-up (ISO 8601 format) */
  followUpDate?: string;
  /** Additional notes about the screening */
  notes?: string;
  /** Reference to the student */
  student: StudentReference;
  /** Timestamp when record was created (ISO 8601 format) */
  createdAt: string;
  /** Timestamp when record was last updated (ISO 8601 format) */
  updatedAt: string;
}

/**
 * Data required to create a new screening record
 * Excludes system-generated fields like id, timestamps, and student reference
 */
export interface ScreeningCreate {
  /** ID of the student who was screened */
  studentId: string;
  /** Type of screening performed */
  screeningType: ScreeningType;
  /** Date screening was performed (ISO 8601 format) */
  screeningDate: string;
  /** Name of person who performed the screening */
  performedBy: string;
  /** Outcome/result of the screening */
  outcome: ScreeningOutcome;
  /** Detailed results or findings from the screening */
  results?: string;
  /** Structured measurements from the screening */
  measurements?: ScreeningMeasurements;
  /** Whether referral to specialist is required (default: false) */
  referralRequired?: boolean;
  /** Specialist or provider to refer to */
  referralTo?: string;
  /** Whether follow-up screening or assessment is needed (default: false) */
  followUpRequired?: boolean;
  /** Scheduled date for follow-up (ISO 8601 format) */
  followUpDate?: string;
  /** Additional notes about the screening */
  notes?: string;
}

/**
 * Fields that can be updated on an existing screening record
 * All fields are optional to support partial updates
 */
export interface ScreeningUpdate {
  /** Type of screening performed */
  screeningType?: ScreeningType;
  /** Date screening was performed (ISO 8601 format) */
  screeningDate?: string;
  /** Name of person who performed the screening */
  performedBy?: string;
  /** Outcome/result of the screening */
  outcome?: ScreeningOutcome;
  /** Detailed results or findings from the screening */
  results?: string;
  /** Structured measurements from the screening */
  measurements?: ScreeningMeasurements;
  /** Whether referral to specialist is required */
  referralRequired?: boolean;
  /** Specialist or provider to refer to */
  referralTo?: string;
  /** Whether follow-up screening or assessment is needed */
  followUpRequired?: boolean;
  /** Scheduled date for follow-up (ISO 8601 format) */
  followUpDate?: string;
  /** Additional notes about the screening */
  notes?: string;
}

/**
 * Information about screenings that are due or overdue
 * Used for compliance tracking and scheduling
 */
export interface ScreeningsDue {
  /** Reference to the student requiring screening */
  student: StudentReference;
  /** Type of screening that is due */
  screeningType: ScreeningType;
  /** Date of most recent screening of this type (ISO 8601 format) */
  lastScreeningDate?: string;
  /** Date when screening is/was due (ISO 8601 format) */
  dueDate: string;
  /** Number of days past the due date (negative if not yet due) */
  daysOverdue: number;
}
