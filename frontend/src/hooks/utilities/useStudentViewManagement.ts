/**
 * Student View Management Hooks
 * 
 * Specialized Redux hooks for managing student view state including
 * view modes, filters, sorting, pagination, and UI preferences.
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  studentsActions,
  selectStudentUIState,
  selectStudentViewMode,
  selectStudentFilters,
  selectStudentSort,
  selectStudentPagination,
  selectStudentSearchQuery,
  selectShowInactiveStudents,
  selectExpandedStudentCards,
  selectFilteredAndSortedStudents,
  selectPaginatedStudents,
  selectStudentPaginationInfo,
  type StudentUIState,
} from '@/stores/slices/studentsSlice';
import type { StudentFilters } from '@/types/student.types';

/**
 * Hook for managing student view mode (grid, list, table)
 * 
 * @example
 * ```tsx
 * const { viewMode, setViewMode, isGridView, isListView, isTableView } = useStudentViewMode();
 * 
 * // Switch to grid view
 * setViewMode('grid');
 * 
 * // Check current view
 * if (isGridView) {
 *   return <StudentGridView />;
 * }
 * ```
 */
export const useStudentViewMode = () => {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector(selectStudentViewMode);

  const setViewMode = useCallback((mode: StudentUIState['viewMode']) => {
    dispatch(studentsActions.setViewMode(mode));
  }, [dispatch]);

  const setGridView = useCallback(() => setViewMode('grid'), [setViewMode]);
  const setListView = useCallback(() => setViewMode('list'), [setViewMode]);
  const setTableView = useCallback(() => setViewMode('table'), [setViewMode]);

  return {
    viewMode,
    setViewMode,
    setGridView,
    setListView,
    setTableView,
    isGridView: viewMode === 'grid',
    isListView: viewMode === 'list',
    isTableView: viewMode === 'table',
  };
};

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
 * Hook for managing student search
 * 
 * @example
 * ```tsx
 * const {
 *   searchQuery,
 *   setSearchQuery,
 *   clearSearch,
 *   hasSearch
 * } = useStudentSearch();
 * 
 * // Set search query
 * setSearchQuery('John Doe');
 * 
 * // Clear search
 * clearSearch();
 * ```
 */
export const useStudentSearch = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectStudentSearchQuery);

  const setSearchQuery = useCallback((query: string) => {
    dispatch(studentsActions.setSearchQuery(query));
  }, [dispatch]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, [setSearchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    clearSearch,
    hasSearch: searchQuery.trim().length > 0,
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

/**
 * Hook for managing student pagination
 * 
 * @example
 * ```tsx
 * const {
 *   currentPage,
 *   pageSize,
 *   totalPages,
 *   setPage,
 *   setPageSize,
 *   nextPage,
 *   previousPage,
 *   canGoNext,
 *   canGoPrevious
 * } = useStudentPagination();
 * ```
 */
export const useStudentPagination = () => {
  const dispatch = useAppDispatch();
  const { currentPage, pageSize } = useAppSelector(selectStudentPagination);
  const paginationInfo = useAppSelector(selectStudentPaginationInfo);

  const setPage = useCallback((page: number) => {
    dispatch(studentsActions.setPage(page));
  }, [dispatch]);

  const setPageSize = useCallback((size: number) => {
    dispatch(studentsActions.setPageSize(size));
  }, [dispatch]);

  const nextPage = useCallback(() => {
    dispatch(studentsActions.nextPage());
  }, [dispatch]);

  const previousPage = useCallback(() => {
    dispatch(studentsActions.previousPage());
  }, [dispatch]);

  const goToFirstPage = useCallback(() => setPage(1), [setPage]);
  const goToLastPage = useCallback(() => {
    if (paginationInfo?.totalPages) {
      setPage(paginationInfo.totalPages);
    }
  }, [setPage, paginationInfo?.totalPages]);

  return {
    currentPage,
    pageSize,
    totalPages: paginationInfo?.totalPages || 0,
    totalStudents: paginationInfo?.totalStudents || 0,
    startIndex: paginationInfo?.startIndex || 0,
    endIndex: paginationInfo?.endIndex || 0,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    canGoNext: paginationInfo?.hasNextPage || false,
    canGoPrevious: paginationInfo?.hasPreviousPage || false,
    hasMultiplePages: (paginationInfo?.totalPages || 0) > 1,
  };
};

/**
 * Hook for managing student card expansion state
 * 
 * @example
 * ```tsx
 * const {
 *   expandedCardIds,
 *   toggleCardExpansion,
 *   expandCard,
 *   collapseCard,
 *   collapseAllCards,
 *   isExpanded
 * } = useStudentCardExpansion();
 * 
 * // Toggle card expansion
 * toggleCardExpansion('student-123');
 * 
 * // Check if card is expanded
 * if (isExpanded('student-123')) {
 *   return <ExpandedStudentCard />;
 * }
 * ```
 */
export const useStudentCardExpansion = () => {
  const dispatch = useAppDispatch();
  const expandedCardIds = useAppSelector(selectExpandedStudentCards);

  const toggleCardExpansion = useCallback((studentId: string) => {
    dispatch(studentsActions.toggleCardExpansion(studentId));
  }, [dispatch]);

  const expandCard = useCallback((studentId: string) => {
    if (!expandedCardIds.includes(studentId)) {
      toggleCardExpansion(studentId);
    }
  }, [expandedCardIds, toggleCardExpansion]);

  const collapseCard = useCallback((studentId: string) => {
    if (expandedCardIds.includes(studentId)) {
      toggleCardExpansion(studentId);
    }
  }, [expandedCardIds, toggleCardExpansion]);

  const collapseAllCards = useCallback(() => {
    dispatch(studentsActions.collapseAllCards());
  }, [dispatch]);

  const isExpanded = useCallback((studentId: string) => {
    return expandedCardIds.includes(studentId);
  }, [expandedCardIds]);

  return {
    expandedCardIds,
    toggleCardExpansion,
    expandCard,
    collapseCard,
    collapseAllCards,
    isExpanded,
    expandedCount: expandedCardIds.length,
    hasExpandedCards: expandedCardIds.length > 0,
  };
};

/**
 * Hook for managing inactive student visibility
 * 
 * @example
 * ```tsx
 * const { showInactive, toggleShowInactive, showOnlyActive, showAll } = useStudentActiveFilter();
 * ```
 */
export const useStudentActiveFilter = () => {
  const dispatch = useAppDispatch();
  const showInactive = useAppSelector(selectShowInactiveStudents);

  const toggleShowInactive = useCallback(() => {
    dispatch(studentsActions.toggleShowInactive());
  }, [dispatch]);

  const showOnlyActive = useCallback(() => {
    if (showInactive) {
      toggleShowInactive();
    }
  }, [showInactive, toggleShowInactive]);

  const showAll = useCallback(() => {
    if (!showInactive) {
      toggleShowInactive();
    }
  }, [showInactive, toggleShowInactive]);

  return {
    showInactive,
    toggleShowInactive,
    showOnlyActive,
    showAll,
    showingOnlyActive: !showInactive,
  };
};

/**
 * Composite hook that combines all student view management
 * 
 * @example
 * ```tsx
 * const studentView = useStudentViewManagement();
 * 
 * // Access all view management features
 * const {
 *   viewMode,
 *   filters,
 *   sorting,
 *   pagination,
 *   search,
 *   selection,
 *   cards,
 *   activeFilter,
 *   resetAllUIState
 * } = studentView;
 * ```
 */
export const useStudentViewManagement = () => {
  const dispatch = useAppDispatch();
  const uiState = useAppSelector(selectStudentUIState);
  
  const viewMode = useStudentViewMode();
  const filters = useStudentFilters();
  const search = useStudentSearch();
  const sorting = useStudentSorting();
  const pagination = useStudentPagination();
  const cards = useStudentCardExpansion();
  const activeFilter = useStudentActiveFilter();

  const resetAllUIState = useCallback(() => {
    dispatch(studentsActions.resetUIState());
  }, [dispatch]);

  // Get filtered and paginated data
  const filteredStudents = useAppSelector(selectFilteredAndSortedStudents);
  const paginatedStudents = useAppSelector(selectPaginatedStudents);

  return {
    // Individual hook objects
    viewMode,
    filters,
    search,
    sorting,
    pagination,
    cards,
    activeFilter,
    
    // Raw UI state
    uiState,
    
    // Data
    filteredStudents,
    paginatedStudents,
    
    // Actions
    resetAllUIState,
    
    // Computed state
    hasAnyFilters: filters.hasActiveFilters || search.hasSearch,
    totalFiltered: filteredStudents.length,
  };
};
