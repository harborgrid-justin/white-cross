/**
 * @fileoverview useMedicationFilters Hook - Filter and Sort Management
 * @module app/(dashboard)/medications/_components/hooks/useMedicationFilters
 *
 * @description
 * Custom React hook for managing medication filtering, searching, and sorting.
 * Provides optimized filtering logic with memoization for performance.
 *
 * **Features:**
 * - Multi-criteria filtering (status, type, controlled substances)
 * - Real-time search with debouncing support
 * - Flexible sorting by multiple fields
 * - Performance-optimized with useMemo
 *
 * @since 1.0.0
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Medication } from './useMedications';

export interface MedicationFilters {
  status?: string[];
  type?: string[];
  isControlled?: boolean;
  searchQuery?: string;
}

export type SortField = 'name' | 'nextDue' | 'student' | 'type';
export type SortOrder = 'asc' | 'desc';

export interface UseMedicationFiltersOptions {
  medications: Medication[];
  initialFilters?: MedicationFilters;
  initialSortBy?: SortField;
  initialSortOrder?: SortOrder;
}

export interface UseMedicationFiltersReturn {
  filteredMedications: Medication[];
  filters: MedicationFilters;
  searchQuery: string;
  sortBy: SortField;
  sortOrder: SortOrder;
  setSearchQuery: (query: string) => void;
  updateFilters: (newFilters: Partial<MedicationFilters>) => void;
  clearFilters: () => void;
  setSortBy: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSortOrder: () => void;
  hasActiveFilters: boolean;
}

/**
 * Custom hook for medication filtering and sorting
 *
 * @param options - Configuration options including medications array and initial states
 * @returns Filtered medications and filter control functions
 *
 * @example
 * ```tsx
 * const {
 *   filteredMedications,
 *   searchQuery,
 *   setSearchQuery,
 *   updateFilters,
 *   clearFilters
 * } = useMedicationFilters({
 *   medications,
 *   initialFilters: { status: ['active'] }
 * });
 * ```
 */
export function useMedicationFilters(
  options: UseMedicationFiltersOptions
): UseMedicationFiltersReturn {
  const {
    medications,
    initialFilters = {},
    initialSortBy = 'name',
    initialSortOrder = 'asc'
  } = options;

  const [filters, setFilters] = useState<MedicationFilters>(initialFilters);
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery || '');
  const [sortBy, setSortBy] = useState<SortField>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);

  // Update filters with merge
  const updateFilters = useCallback((newFilters: Partial<MedicationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
  }, []);

  // Toggle sort order
  const toggleSortOrder = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      searchQuery ||
      filters.status?.length ||
      filters.type?.length ||
      filters.isControlled !== undefined
    );
  }, [searchQuery, filters]);

  // Filter and sort medications
  const filteredMedications = useMemo(() => {
    // Apply filters
    let result = medications.filter(med => {
      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(med.status)) return false;
      }

      // Type filter
      if (filters.type && filters.type.length > 0) {
        if (!filters.type.includes(med.type)) return false;
      }

      // Controlled substance filter
      if (filters.isControlled !== undefined) {
        if (med.isControlled !== filters.isControlled) return false;
      }

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = med.name.toLowerCase().includes(query);
        const matchesGeneric = med.genericName?.toLowerCase().includes(query);
        const matchesStudent = med.studentId.toLowerCase().includes(query);

        if (!matchesName && !matchesGeneric && !matchesStudent) {
          return false;
        }
      }

      return true;
    });

    // Apply sorting
    result.sort((a, b) => {
      const modifier = sortOrder === 'asc' ? 1 : -1;

      switch (sortBy) {
        case 'name':
          return modifier * a.name.localeCompare(b.name);

        case 'nextDue':
          if (!a.nextDue && !b.nextDue) return 0;
          if (!a.nextDue) return modifier;
          if (!b.nextDue) return -modifier;
          return modifier * (new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime());

        case 'student':
          return modifier * a.studentId.localeCompare(b.studentId);

        case 'type':
          return modifier * a.type.localeCompare(b.type);

        default:
          return 0;
      }
    });

    return result;
  }, [medications, filters, searchQuery, sortBy, sortOrder]);

  return {
    filteredMedications,
    filters,
    searchQuery,
    sortBy,
    sortOrder,
    setSearchQuery,
    updateFilters,
    clearFilters,
    setSortBy,
    setSortOrder,
    toggleSortOrder,
    hasActiveFilters
  };
}
