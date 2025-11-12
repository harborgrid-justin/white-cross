/**
 * Health Records API - Allergy Type Definitions
 *
 * Types for managing student allergies and sensitivities
 *
 * @module services/modules/healthRecordsApi/types/allergies
 */

import type { StudentReference } from './base';

/**
 * Categories of allergens
 * Classifies allergies by the type of substance causing the reaction
 */
export enum AllergyType {
  /** Allergies to medications or drugs */
  MEDICATION = 'MEDICATION',
  /** Allergies to food items */
  FOOD = 'FOOD',
  /** Allergies to environmental factors (pollen, dust, etc.) */
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  /** Allergies to insect bites or stings */
  INSECT = 'INSECT',
  /** Latex allergies */
  LATEX = 'LATEX',
  /** Other or unclassified allergies */
  OTHER = 'OTHER'
}

/**
 * Severity levels for allergic reactions
 * Indicates the potential impact of exposure to the allergen
 */
export enum AllergySeverity {
  /** Mild reactions that may not require treatment */
  MILD = 'MILD',
  /** Moderate reactions requiring medical attention */
  MODERATE = 'MODERATE',
  /** Severe reactions requiring immediate medical care */
  SEVERE = 'SEVERE',
  /** Life-threatening reactions requiring emergency intervention */
  LIFE_THREATENING = 'LIFE_THREATENING'
}

/**
 * Complete allergy record entity
 * Represents a documented allergy for a student
 */
export interface Allergy {
  /** Unique identifier for the allergy record */
  id: string;
  /** ID of the student with this allergy */
  studentId: string;
  /** Name or description of the allergen */
  allergen: string;
  /** Category of the allergen */
  allergyType: AllergyType;
  /** Severity level of allergic reactions */
  severity: AllergySeverity;
  /** Description of typical allergic reaction */
  reaction?: string;
  /** List of symptoms experienced during reactions */
  symptoms?: string[];
  /** Recommended treatment for reactions */
  treatment?: string;
  /** Date when allergy first manifested (ISO 8601 format) */
  onsetDate?: string;
  /** Name of healthcare provider who diagnosed the allergy */
  diagnosedBy?: string;
  /** Whether the allergy has been medically verified */
  verified: boolean;
  /** Name of person who verified the allergy */
  verifiedBy?: string;
  /** Timestamp when allergy was verified (ISO 8601 format) */
  verifiedAt?: string;
  /** Whether this is a critical/life-threatening allergy requiring immediate attention */
  isCritical: boolean;
  /** Additional notes about the allergy */
  notes?: string;
  /** Reference to the student */
  student: StudentReference;
  /** Timestamp when record was created (ISO 8601 format) */
  createdAt: string;
  /** Timestamp when record was last updated (ISO 8601 format) */
  updatedAt: string;
}

/**
 * Data required to create a new allergy record
 * Excludes system-generated fields like id, timestamps, and student reference
 */
export interface AllergyCreate {
  /** ID of the student with this allergy */
  studentId: string;
  /** Name or description of the allergen */
  allergen: string;
  /** Category of the allergen */
  allergyType: AllergyType;
  /** Severity level of allergic reactions */
  severity: AllergySeverity;
  /** Description of typical allergic reaction */
  reaction?: string;
  /** List of symptoms experienced during reactions */
  symptoms?: string[];
  /** Recommended treatment for reactions */
  treatment?: string;
  /** Date when allergy first manifested (ISO 8601 format) */
  onsetDate?: string;
  /** Name of healthcare provider who diagnosed the allergy */
  diagnosedBy?: string;
  /** Whether the allergy has been medically verified (default: false) */
  verified?: boolean;
  /** Whether this is a critical/life-threatening allergy (default: false) */
  isCritical?: boolean;
  /** Additional notes about the allergy */
  notes?: string;
}

/**
 * Fields that can be updated on an existing allergy record
 * All fields are optional to support partial updates
 */
export interface AllergyUpdate {
  /** Name or description of the allergen */
  allergen?: string;
  /** Category of the allergen */
  allergyType?: AllergyType;
  /** Severity level of allergic reactions */
  severity?: AllergySeverity;
  /** Description of typical allergic reaction */
  reaction?: string;
  /** List of symptoms experienced during reactions */
  symptoms?: string[];
  /** Recommended treatment for reactions */
  treatment?: string;
  /** Date when allergy first manifested (ISO 8601 format) */
  onsetDate?: string;
  /** Name of healthcare provider who diagnosed the allergy */
  diagnosedBy?: string;
  /** Whether the allergy has been medically verified */
  verified?: boolean;
  /** Whether this is a critical/life-threatening allergy */
  isCritical?: boolean;
  /** Additional notes about the allergy */
  notes?: string;
}
