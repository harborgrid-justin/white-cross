/**
 * WF-COMP-190 | types.ts - React component or utility module
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
