/**
 * Screenings Type Definitions
 *
 * Types for managing health screenings including:
 * - Screening records and results
 * - Screening types and outcomes
 * - Referral tracking
 *
 * @module services/modules/healthRecords/types/screenings.types
 */

/**
 * Health screening record entity
 */
export interface Screening {
  id: string;
  studentId: string;
  screeningType: ScreeningType;
  screeningDate: string;
  performedBy: string;
  outcome: ScreeningOutcome;
  results?: string;
  measurements?: Record<string, string | number | boolean>;
  referralRequired: boolean;
  referralTo?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  notes?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Screening type enumeration
 */
export enum ScreeningType {
  VISION = 'VISION',
  HEARING = 'HEARING',
  DENTAL = 'DENTAL',
  SCOLIOSIS = 'SCOLIOSIS',
  BMI = 'BMI',
  BLOOD_PRESSURE = 'BLOOD_PRESSURE',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  DEVELOPMENTAL = 'DEVELOPMENTAL',
  OTHER = 'OTHER'
}

/**
 * Screening outcome enumeration
 */
export enum ScreeningOutcome {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  REFER = 'REFER',
  INCONCLUSIVE = 'INCONCLUSIVE',
  DECLINED = 'DECLINED'
}

/**
 * Data required to create a new screening record
 */
export interface ScreeningCreate {
  studentId: string;
  screeningType: ScreeningType;
  screeningDate: string;
  performedBy: string;
  outcome: ScreeningOutcome;
  results?: string;
  measurements?: Record<string, string | number | boolean>;
  referralRequired?: boolean;
  referralTo?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  notes?: string;
}

/**
 * Data for updating an existing screening record
 */
export interface ScreeningUpdate {
  screeningType?: ScreeningType;
  screeningDate?: string;
  performedBy?: string;
  outcome?: ScreeningOutcome;
  results?: string;
  measurements?: Record<string, string | number | boolean>;
  referralRequired?: boolean;
  referralTo?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  notes?: string;
}

/**
 * Information about screenings that are due
 */
export interface ScreeningDue {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  screeningType: ScreeningType;
  lastScreeningDate?: string;
  dueDate: string;
  daysOverdue: number;
}
