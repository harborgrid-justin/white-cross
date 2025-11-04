/**
 * Custom hook for managing form selection state
 *
 * This hook handles the selection state for forms, allowing individual
 * and bulk selection operations.
 */

import { useState } from 'react';

/**
 * Return type for useFormSelection hook
 */
export interface UseFormSelectionReturn {
  /** Set of selected form IDs */
  selectedForms: Set<string>;

  /** Toggle selection for a specific form */
  toggleSelection: (formId: string) => void;

  /** Select all forms */
  selectAll: (formIds: string[]) => void;

  /** Clear all selections */
  clearSelection: () => void;

  /** Check if a form is selected */
  isSelected: (formId: string) => boolean;
}

/**
 * Custom hook for managing form selection
 *
 * @returns Object containing selection state and manipulation functions
 */
export function useFormSelection(): UseFormSelectionReturn {
  const [selectedForms, setSelectedForms] = useState<Set<string>>(new Set());

  /**
   * Toggles selection for a specific form
   */
  const toggleSelection = (formId: string) => {
    setSelectedForms((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(formId)) {
        newSelected.delete(formId);
      } else {
        newSelected.add(formId);
      }
      return newSelected;
    });
  };

  /**
   * Selects all provided form IDs
   */
  const selectAll = (formIds: string[]) => {
    setSelectedForms(new Set(formIds));
  };

  /**
   * Clears all selections
   */
  const clearSelection = () => {
    setSelectedForms(new Set());
  };

  /**
   * Checks if a form is currently selected
   */
  const isSelected = (formId: string): boolean => {
    return selectedForms.has(formId);
  };

  return {
    selectedForms,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
  };
}
