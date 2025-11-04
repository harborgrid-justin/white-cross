/**
 * @fileoverview Immunization Filters Hook
 * @module app/immunizations/components/hooks
 *
 * Custom hook for managing immunization filtering and search.
 * Handles filter state and applies filters to immunization data.
 */

import { useState, useMemo } from 'react';
import type {
  Immunization,
  ImmunizationStatus,
  ImmunizationType,
  ImmunizationFilterState,
} from '../types/immunization.types';

/**
 * Hook return type
 */
interface UseImmunizationFiltersReturn {
  filteredImmunizations: Immunization[];
  filterState: ImmunizationFilterState;
  setStatusFilter: (status: ImmunizationStatus | 'all') => void;
  setTypeFilter: (type: ImmunizationType | 'all') => void;
  setSearchQuery: (query: string) => void;
  setSelectedDate: (date: Date) => void;
  clearFilters: () => void;
}

/**
 * Custom hook for filtering and searching immunizations
 * @param immunizations - Array of immunizations to filter
 * @returns Filtered immunizations and filter control functions
 */
export const useImmunizationFilters = (
  immunizations: Immunization[]
): UseImmunizationFiltersReturn => {
  const [statusFilter, setStatusFilter] = useState<ImmunizationStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ImmunizationType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Filter immunizations based on current filters
  const filteredImmunizations = useMemo(() => {
    let filtered = immunizations;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((imm) => imm.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((imm) => imm.immunizationType === typeFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (imm) =>
          imm.vaccineName.toLowerCase().includes(query) ||
          imm.studentName?.toLowerCase().includes(query) ||
          imm.studentId.toLowerCase().includes(query) ||
          imm.immunizationType.toLowerCase().includes(query) ||
          imm.notes?.toLowerCase().includes(query)
      );
    }

    // Sort by priority and due date
    return filtered.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const priorityCompare = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityCompare !== 0) return priorityCompare;

      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [immunizations, statusFilter, typeFilter, searchQuery]);

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setSearchQuery('');
    setSelectedDate(new Date());
  };

  const filterState: ImmunizationFilterState = {
    statusFilter,
    typeFilter,
    searchQuery,
    selectedDate,
  };

  return {
    filteredImmunizations,
    filterState,
    setStatusFilter,
    setTypeFilter,
    setSearchQuery,
    setSelectedDate,
    clearFilters,
  };
};
