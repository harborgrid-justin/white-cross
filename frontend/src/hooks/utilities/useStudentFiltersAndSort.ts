/**
 * Student Filters and Sorting Hooks
 *
 * Hooks for managing student filters and sorting state
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  studentsActions,
  selectStudentFilters,
  selectStudentSort,
  type StudentUIState,
} from '@/stores/slices/studentsSlice';
import type { StudentFilters } from '@/types/student.types';

/**
 * Hook for managing student filters
 *
 * @example
 * ```tsx
 * const {
 *   filters,
 *   setFilters,
 *   clearFilters,
 *   setGradeFilter,
 *   setNurseFilter,
 *   toggleAllergyFilter,
 *   hasActiveFilters
 * } = useStudentFilters();
 *
 * // Set grade filter
 * setGradeFilter('5');
 *
 * // Toggle allergy filter
 * toggleAllergyFilter();
 * ```
 */
export const useStudentFilters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectStudentFilters);

  const setFilters = useCallback((newFilters: Partial<StudentFilters>) => {
    dispatch(studentsActions.setFilters(newFilters));
  }, [dispatch]);

  const clearFilters = useCallback(() => {
    dispatch(studentsActions.clearFilters());
  }, [dispatch]);

  const setGradeFilter = useCallback((grade: string | undefined) => {
    setFilters({ grade });
  }, [setFilters]);

  const setNurseFilter = useCallback((nurseId: string | undefined) => {
    setFilters({ nurseId });
  }, [setFilters]);

  const setGenderFilter = useCallback((gender: StudentFilters['gender']) => {
    setFilters({ gender });
  }, [setFilters]);

  const toggleAllergyFilter = useCallback(() => {
    const newValue = filters.hasAllergies === true ? undefined : true;
    setFilters({ hasAllergies: newValue });
  }, [filters.hasAllergies, setFilters]);

  const toggleMedicationFilter = useCallback(() => {
    const newValue = filters.hasMedications === true ? undefined : true;
    setFilters({ hasMedications: newValue });
  }, [filters.hasMedications, setFilters]);

  const setActiveFilter = useCallback((isActive: boolean | undefined) => {
    setFilters({ isActive });
  }, [setFilters]);

  // Computed values
  const hasActiveFilters = Object.keys(filters).some(key =>
    filters[key as keyof StudentFilters] !== undefined &&
    filters[key as keyof StudentFilters] !== ''
  );

  const filterCount = Object.keys(filters).filter(key =>
    filters[key as keyof StudentFilters] !== undefined &&
    filters[key as keyof StudentFilters] !== ''
  ).length;

  return {
    filters,
    setFilters,
    clearFilters,
    setGradeFilter,
    setNurseFilter,
    setGenderFilter,
    toggleAllergyFilter,
    toggleMedicationFilter,
    setActiveFilter,
    hasActiveFilters,
    filterCount,
  };
};

/**
 * Hook for managing student sorting
 *
 * @example
 * ```tsx
 * const {
 *   sortBy,
 *   sortOrder,
 *   setSorting,
 *   toggleSortOrder,
 *   sortByName,
 *   sortByGrade,
 *   isSortedBy
 * } = useStudentSorting();
 *
 * // Sort by name
 * sortByName();
 *
 * // Toggle current sort order
 * toggleSortOrder();
 * ```
 */
export const useStudentSorting = () => {
  const dispatch = useAppDispatch();
  const { sortBy, sortOrder } = useAppSelector(selectStudentSort);

  const setSorting = useCallback((config: {
    sortBy: StudentUIState['sortBy'];
    sortOrder: StudentUIState['sortOrder']
  }) => {
    dispatch(studentsActions.setSorting(config));
  }, [dispatch]);

  const toggleSortOrder = useCallback(() => {
    dispatch(studentsActions.toggleSortOrder());
  }, [dispatch]);

  const setSortBy = useCallback((newSortBy: StudentUIState['sortBy']) => {
    // If clicking same column, toggle order; otherwise set ascending
    if (sortBy === newSortBy) {
      toggleSortOrder();
    } else {
      setSorting({ sortBy: newSortBy, sortOrder: 'asc' });
    }
  }, [sortBy, setSorting, toggleSortOrder]);

  const sortByName = useCallback(() => setSortBy('name'), [setSortBy]);
  const sortByGrade = useCallback(() => setSortBy('grade'), [setSortBy]);
  const sortByEnrollmentDate = useCallback(() => setSortBy('enrollmentDate'), [setSortBy]);
  const sortByLastVisit = useCallback(() => setSortBy('lastVisit'), [setSortBy]);

  const isSortedBy = useCallback((field: StudentUIState['sortBy']) => {
    return sortBy === field;
  }, [sortBy]);

  return {
    sortBy,
    sortOrder,
    setSorting,
    toggleSortOrder,
    setSortBy,
    sortByName,
    sortByGrade,
    sortByEnrollmentDate,
    sortByLastVisit,
    isSortedBy,
    isAscending: sortOrder === 'asc',
    isDescending: sortOrder === 'desc',
  };
};
