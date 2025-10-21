/**
 * WF-COMP-229 | types.ts - React component or utility module
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
 * Medications Page Type Definitions
 *
 * Page-specific types for the medications module
 */

/**
 * Tab type for medication management sections
 */
export type MedicationTab = 'overview' | 'medications' | 'inventory' | 'reminders' | 'adverse-reactions';

/**
 * Filter form state interface for medication filters
 */
export interface MedicationFilters {
  searchTerm: string;
  dosageForm: string;
  controlledStatus: string;
}

/**
 * Medication form data for creating/editing medications
 */
export interface MedicationFormData {
  name: string;
  genericName: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  ndc: string;
  isControlled: boolean;
}

/**
 * Form validation errors
 */
export interface MedicationFormErrors {
  name?: string;
  genericName?: string;
  dosageForm?: string;
  strength?: string;
  manufacturer?: string;
  ndc?: string;
}

/**
 * Medication data structure
 */
export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  ndc: string;
  isControlled: boolean;
  _count?: {
    studentMedications?: number;
  };
}

/**
 * Props for medication modal components
 */
export interface MedicationModalProps {
  show: boolean;
  onClose: () => void;
}
