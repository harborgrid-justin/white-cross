/**
 * Health Records API - Response Type Definitions
 *
 * API response wrapper types and legacy type aliases for backward compatibility
 *
 * @module services/modules/healthRecordsApi/types/responses
 */

import type { Allergy } from './allergies';
import type { ChronicCondition } from './conditions';
import type { Vaccination } from './vaccinations';
import type { Screening, ScreeningsDue } from './screenings';
import type { GrowthMeasurement, VitalSigns } from './measurements';
import type {
  HealthRecordCreate,
  AllergyCreate,
  ChronicConditionCreate,
  VaccinationCreate
} from './index';

// ==========================================
// API RESPONSE TYPES
// ==========================================

/**
 * API response wrapper for allergy queries
 */
export interface AllergiesResponse {
  /** Array of allergy records */
  allergies: Allergy[];
}

/**
 * API response wrapper for chronic condition queries
 */
export interface ConditionsResponse {
  /** Array of chronic condition records */
  conditions: ChronicCondition[];
}

/**
 * API response wrapper for vaccination queries
 */
export interface VaccinationsResponse {
  /** Array of vaccination records */
  vaccinations: Vaccination[];
}

/**
 * API response wrapper for screening queries
 */
export interface ScreeningsResponse {
  /** Array of screening records */
  screenings: Screening[];
}

/**
 * API response wrapper for due screenings queries
 */
export interface ScreeningsDueResponse {
  /** Array of screenings that are due or overdue */
  screenings: ScreeningsDue[];
}

/**
 * API response wrapper for growth measurement queries
 */
export interface GrowthMeasurementsResponse {
  /** Array of growth measurement records */
  measurements: GrowthMeasurement[];
}

/**
 * API response wrapper for vital signs queries
 */
export interface VitalSignsResponse {
  /** Array of vital signs records */
  vitals: VitalSigns[];
}

// ==========================================
// LEGACY TYPE ALIASES
// ==========================================

/**
 * @deprecated Use Vaccination instead
 * Legacy alias for backward compatibility
 */
export type VaccinationRecord = Vaccination;

/**
 * @deprecated Use HealthRecordCreate instead
 * Legacy alias for backward compatibility
 */
export type CreateHealthRecordRequest = HealthRecordCreate;

/**
 * @deprecated Use AllergyCreate instead
 * Legacy alias for backward compatibility
 */
export type CreateAllergyRequest = AllergyCreate;

/**
 * @deprecated Use ChronicConditionCreate instead
 * Legacy alias for backward compatibility
 */
export type CreateChronicConditionRequest = ChronicConditionCreate;

/**
 * @deprecated Use VaccinationCreate instead
 * Legacy alias for backward compatibility
 */
export type CreateVaccinationRequest = VaccinationCreate;
