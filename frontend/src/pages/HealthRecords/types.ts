/**
 * Health Records Page Type Definitions
 *
 * Page-specific types for the health records module
 */

import type {
  TabType,
  Allergy,
  ChronicCondition,
  Vaccination,
} from '../../types/healthRecords';

/**
 * Re-export types from shared health records types
 */
export type { TabType, Allergy, ChronicCondition, Vaccination };

/**
 * Filter form state interface
 */
export interface HealthRecordFilters {
  searchQuery: string;
  recordType: string;
  dateFrom: string;
  dateTo: string;
  vaccinationFilter: string;
  vaccinationSort: string;
}

/**
 * Export format types
 */
export type ExportFormat = 'pdf' | 'json';
