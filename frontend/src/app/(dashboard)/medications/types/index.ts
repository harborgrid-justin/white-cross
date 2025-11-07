/**
 * Medications Types Module
 *
 * @description Comprehensive type definitions for medication management system
 *
 * @module medications/types
 */

// Core Types and Enums
export type {
  MedicationType,
  MedicationStatus,
  AdministrationRoute,
  MedicationFrequency,
  AlertLevel,
  InteractionType,
  MedicationInteraction,
  Medication,
  MedicationAlert,
  MedicationInventory,
} from './core.types';

export { MedicationSchema } from './core.schemas';

// Administration Types
export type {
  AdministrationStatus,
  MedicationAdministration,
} from './administration.types';

export {
  MedicationAdministrationSchema,
  administrationUtils,
} from './administration.types';

// API and Query Types
export type {
  DateRangeFilter,
  MedicationFilters,
  PaginationInfo,
  MedicationSummary,
  MedicationSearchResult,
} from './api.types';

export {
  MedicationFiltersSchema,
  queryUtils,
} from './api.types';

// Display Utilities
export { displayUtils } from './display.utils';

// Mock Data (for development)
export {
  mockMedications,
  mockMedicationAdministrations,
} from './mock.types';
