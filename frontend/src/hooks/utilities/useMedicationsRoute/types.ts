/**
 * WF-ROUTE-002 | types.ts - Type definitions for useMedicationsRoute
 * Purpose: Centralized type definitions for medication route management
 * Upstream: @/types/medications | Dependencies: None
 * Downstream: useMedicationsRoute modules | Called by: All useMedicationsRoute modules
 * Related: medications types
 * Exports: MedicationFilters, MedicationSortColumn, MedicationsRouteState
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Type definitions for medication route state and filters
 */

import type {
  Medication,
  StudentMedication,
  MedicationLog,
  InventoryItem,
  AdverseReaction,
} from '@/types/medications';

// Temporary types until they're added to medications types
export type CreateMedicationData = any;
export type UpdateMedicationData = any;

/**
 * Medication filters interface
 */
export type MedicationFilters = {
  searchTerm: string;
  categoryFilter: string;
  statusFilter: string;
  studentFilter: string;
  nurseFilter: string;
  urgencyFilter: string;
};

/**
 * Sortable columns for medications
 */
export type MedicationSortColumn = 'name' | 'genericName' | 'category' | 'createdAt' | 'updatedAt';

/**
 * Medications route state interface
 */
export interface MedicationsRouteState {
  // View state
  selectedMedication: Medication | null;
  selectedStudentMedication: StudentMedication | null;
  activeTab: 'medications' | 'administration' | 'inventory' | 'schedule' | 'reports';

  // Modal states
  showCreateModal: boolean;
  showEditModal: boolean;
  showDeleteModal: boolean;
  showAdministrationModal: boolean;
  showInventoryModal: boolean;
  showAdverseReactionModal: boolean;

  // Filter and pagination state
  filters: MedicationFilters;
  sortColumn: MedicationSortColumn | null;
  sortDirection: 'asc' | 'desc';
  page: number;
  pageSize: number;

  // Date range for schedule/reports
  dateRange: {
    startDate: string;
    endDate: string;
  };

  // UI state
  loading: boolean;
  searchTerm: string;
}

/**
 * Re-export medication types for convenience
 */
export type {
  Medication,
  StudentMedication,
  MedicationLog,
  InventoryItem,
  AdverseReaction,
} from '@/types/medications';
