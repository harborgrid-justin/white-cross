/**
 * Allergies Type Definitions
 *
 * Types for managing student allergies including:
 * - Allergy entities and metadata
 * - Allergy types and severity levels
 * - CRUD operation interfaces
 *
 * @module services/modules/healthRecords/types/allergies.types
 */

/**
 * Allergy record entity
 */
export interface Allergy {
  id: string;
  studentId: string;
  allergen: string;
  allergyType: AllergyType;
  severity: AllergySeverity;
  reaction?: string;
  symptoms?: string[];
  treatment?: string;
  onsetDate?: string;
  diagnosedBy?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  isCritical: boolean;
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
 * Allergy type enumeration
 */
export enum AllergyType {
  MEDICATION = 'MEDICATION',
  FOOD = 'FOOD',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  INSECT = 'INSECT',
  LATEX = 'LATEX',
  OTHER = 'OTHER'
}

/**
 * Allergy severity levels
 */
export enum AllergySeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  LIFE_THREATENING = 'LIFE_THREATENING'
}

/**
 * Data required to create a new allergy record
 */
export interface AllergyCreate {
  studentId: string;
  allergen: string;
  allergyType: AllergyType;
  severity: AllergySeverity;
  reaction?: string;
  symptoms?: string[];
  treatment?: string;
  onsetDate?: string;
  diagnosedBy?: string;
  verified?: boolean;
  isCritical?: boolean;
  notes?: string;
}

/**
 * Data for updating an existing allergy record
 */
export interface AllergyUpdate {
  allergen?: string;
  allergyType?: AllergyType;
  severity?: AllergySeverity;
  reaction?: string;
  symptoms?: string[];
  treatment?: string;
  onsetDate?: string;
  diagnosedBy?: string;
  verified?: boolean;
  isCritical?: boolean;
  notes?: string;
}

/**
 * Type alias for backward compatibility
 */
export type CreateAllergyRequest = AllergyCreate;
