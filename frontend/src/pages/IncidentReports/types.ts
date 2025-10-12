/**
 * Incident Reports Page Type Definitions
 *
 * Page-specific types for the incident reports module
 */

import type {
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
} from '../../types/incidents';

/**
 * Filter form state interface
 */
export interface IncidentFiltersForm {
  search: string;
  type: IncidentType | '';
  severity: IncidentSeverity | '';
  status: IncidentStatus | '';
  dateFrom: string;
  dateTo: string;
  parentNotified: string; // 'all' | 'true' | 'false'
  followUpRequired: string; // 'all' | 'true' | 'false'
}

/**
 * Sort columns available for incident reports
 */
export type IncidentSortColumn = 'occurredAt' | 'severity' | 'type' | 'status' | 'reportedAt';
