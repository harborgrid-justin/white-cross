/**
 * Health Records API - Base Type Definitions
 *
 * Foundation types used across the health records module
 *
 * @module services/modules/healthRecordsApi/types/base
 */

/**
 * Reference to a student entity with essential identifying information
 * Used as a lightweight reference in health records to avoid circular dependencies
 */
export interface StudentReference {
  /** Unique identifier for the student */
  id: string;
  /** Student's first name */
  firstName: string;
  /** Student's last name */
  lastName: string;
  /** Student's unique identification number */
  studentNumber: string;
  /** Student's date of birth (ISO 8601 format) */
  dateOfBirth?: string;
  /** Student's gender */
  gender?: string;
}

/**
 * Extended student reference with required demographic fields
 * Used in contexts where date of birth and gender are mandatory
 */
export interface StudentReferenceWithDemographics extends StudentReference {
  /** Student's date of birth (ISO 8601 format) - required */
  dateOfBirth: string;
  /** Student's gender - required */
  gender: string;
}
