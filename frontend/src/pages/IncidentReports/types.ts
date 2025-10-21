/**
 * WF-COMP-210 | types.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces, types | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

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
