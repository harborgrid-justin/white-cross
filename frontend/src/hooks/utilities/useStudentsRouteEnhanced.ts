/**
 * WF-ROUTE-003 | useStudentsRouteEnhanced.ts - Enhanced route hook with stores integration
 * Purpose: Comprehensive student management with Redux stores, React Query, and services integration
 * Upstream: @/hooks, @/services, @/stores | Dependencies: React Query, Redux, custom hooks
 * Downstream: Pages/Students | Called by: Students page components
 * Related: useOptimisticStudents, studentsSlice, studentsApi
 * Exports: useStudentsRouteEnhanced | Key Features: Redux + React Query hybrid
 * Last Updated: 2025-10-20 | File Type: .ts
 * Critical Path: Route load → Redux state → React Query cache → User interactions → Optimistic updates
 * LLM Context: Enhanced route-level hook with full stores integration
 */

import { useCallback, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  useAppDispatch, 
  useAppSelector,
  studentsActions,
  studentsThunks,
  studentsSelectors,
  selectActiveStudents,
  selectStudentsByGrade,
  selectStudentsByNurse,
  selectStudentsWithAllergies,
  selectStudentsWithMedications,
  selectStudentByNumber,
} from '@/stores';
import { 
  useOptimisticStudentCreate,
  useOptimisticStudentUpdate,
  useOptimisticStudentDeactivate,
  useOptimisticStudentReactivate,
  useOptimisticStudentTransfer,
  useOptimisticStudentPermanentDelete,
  studentKeys,
} from '@/hooks/useOptimisticStudents';
import { usePersistedFilters, usePageState, useSortState } from '@/hooks/useRouteState';
import { useToast } from '@/hooks/useToast';
import { apiActions } from '@/lib/api';
import type { 
  Student, 
  CreateStudentData, 
  UpdateStudentData,
  TransferStudentRequest,
  StudentFilters,
} from '@/types/student.types';

/**
 * Student sort columns
 */
type StudentSortColumn = 'firstName' | 'lastName' | 'grade' | 'enrollmentDate' | 'lastVisit';

/**
 * Enhanced Students route hook with Redux stores integration
 * 
 * This hook combines:
 * - Redux store for UI state, filters, selections, view modes
 * - React Query for server state, optimistic updates, caching
 * - Services for API communication
 * - Route state persistence
 * 
 * Provides a unified, comprehensive API for student management that handles
 * both UI concerns and data fetching/mutations efficiently.
 * 
 * @example
 * ```tsx
 * function StudentsPage() {
 *   const {
 *     // Data from multiple sources
 *     students,
 *     ui,
 *     
 *     // Unified actions
 *     actions,
 *     
 *     // Advanced features
 *     bulkOperations,
 *     analytics,
 *     
 *     // Low-level access
 *     store,
 *     queries,
 *     mutations
 *   } = useStudentsRouteEnhanced();
 * 
 *   return (
 *     <StudentsLayout>
 *       <StudentsFilters 
 *         filters={ui.filters} 
 *         onFiltersChange={actions.updateFilters}
 *       />
 *       <StudentsTable 
 *         students={students.paginated} 
 *         selectedIds={ui.selectedIds}
 *         onSelect={actions.selectStudent}
 *         onBulkSelect={bulkOperations.selectMultiple}
 *       />
 *     </StudentsLayout>
 *   );
 * }
 * ```
 */
export function useStudentsRouteEnhanced() {
  // ===============================
  // REDUX STORE INTEGRATION
  // ===============================
  
  const dispatch = useAppDispatch();
  
  // Core state from Redux
  const studentsState = useAppSelector(state => state.students);
  const studentsUI = useAppSelector(state => state.studentUI);
  
  // Computed selectors
  const activeStudents = useAppSelector(selectActiveStudents);
  const studentsByGrade = useAppSelector(selectStudentsByGrade);
  const studentsWithAllergies = useAppSelector(selectStudentsWithAllergies);
  const studentsWithMedications = useAppSelector(selectStudentsWithMedications);
  
  // Toast notifications
  const { showSuccess, showError } = useToast();

  // ===============================
  // ROUTE STATE PERSISTENCE
  // ===============================
  
  // Persisted filters with localStorage and URL sync
  const {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    isRestored: filtersRestored
  } = usePersistedFilters<StudentFilters>({
    storageKey: 'student-filters',
    defaultFilters: {
      searchTerm: '',
      gradeFilter: '',
      genderFilter: undefined,
      statusFilter: 'active',
      showArchived: false,
    },
    syncWithUrl: true,
    validate: (filters): filters is StudentFilters => {
      return typeof filters === 'object' && 'searchTerm' in filters;
    },
  });

  // Pagination state with URL sync
  const {
    page,
    pageSize,
    setPage,
    setPageSize,
    resetPage,
  } = usePageState({
    defaultPage: 1,
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    resetOnFilterChange: true,
  });

  // Sort state with preferences
  const {
    column: sortColumn,
    direction: sortDirection,
    sortBy,
    toggleSort,
    clearSort,
    getSortIndicator,
  } = useSortState<StudentSortColumn>({
    validColumns: ['firstName', 'lastName', 'grade', 'enrollmentDate', 'lastVisit'],
    defaultColumn: 'lastName',
    defaultDirection: 'asc',
    persistPreference: true,
    storageKey: 'student-sort-preference',
  });

  // ===============================
  // REACT QUERY INTEGRATION
  // ===============================
  
  /**
   * Main students query with cache coordination
   */
  const studentsQuery = useQuery({
    queryKey: studentKeys.list(filters),
    queryFn: () => apiActions.students.getAll({
      page,
      limit: pageSize,
      ...filters,
    }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      // Sync successful data with Redux store
      if (data?.data?.students) {
        dispatch(studentsThunks.syncFromQuery(data.data.students));
      }
    },
  });

  /**
   * Student statistics query
   */
  const statisticsQuery = useQuery({
    queryKey: [...studentKeys.all, 'statistics'],
    queryFn: () => apiActions.students.getStatistics(),
    staleTime: 15 * 60 * 1000,
  });

  // ===============================
  // OPTIMISTIC MUTATIONS WITH REDUX SYNC
  // ===============================
  
  const createMutation = useOptimisticStudentCreate({
    onSuccess: (student) => {
      showSuccess(`Student ${student.firstName} ${student.lastName} created successfully`);
      // Sync with Redux store
      dispatch(studentsActions.addEntity(student));
      // Clear selections
      dispatch(studentsActions.clearSelection());
    },
    onError: (error) => {
      showError(`Failed to create student: ${error.message}`);
    },
  });

  const updateMutation = useOptimisticStudentUpdate({
    onSuccess: (student) => {
      showSuccess(`Student ${student.firstName} ${student.lastName} updated successfully`);
      // Update Redux store
      dispatch(studentsActions.updateEntity({ id: student.id, changes: student }));
    },
    onError: (error) => {
      showError(`Failed to update student: ${error.message}`);
    },
  });

  const deactivateMutation = useOptimisticStudentDeactivate({
    onSuccess: (student) => {
      showSuccess(`Student ${student.firstName} ${student.lastName} deactivated`);
      // Update Redux store
      dispatch(studentsActions.updateEntity({ 
        id: student.id, 
        changes: { isActive: false } 
      }));
      // Clear from selection if selected
      dispatch(studentsActions.deselectStudent(student.id));
    },
    onError: (error) => {
      showError(`Failed to deactivate student: ${error.message}`);
    },
  });

  const reactivateMutation = useOptimisticStudentReactivate({
    onSuccess: (student) => {
      showSuccess(`Student ${student.firstName} ${student.lastName} reactivated`);
      dispatch(studentsActions.updateEntity({ 
        id: student.id, 
        changes: { isActive: true } 
      }));
    },
    onError: (error) => {
      showError(`Failed to reactivate student: ${error.message}`);
    },
  });

  const transferMutation = useOptimisticStudentTransfer({
    onSuccess: (student) => {
      showSuccess(`Student ${student.firstName} ${student.lastName} transferred successfully`);
      // Remove from current store or update with transfer status
      dispatch(studentsActions.removeEntity(student.id));
    },
    onError: (error) => {
      showError(`Failed to transfer student: ${error.message}`);
    },
  });

  const deleteMutation = useOptimisticStudentPermanentDelete({
    onSuccess: (student) => {
      showSuccess('Student permanently deleted');
      dispatch(studentsActions.removeEntity(student.id));
      dispatch(studentsActions.deselectStudent(student.id));
    },
    onError: (error) => {
      showError(`Failed to delete student: ${error.message}`);
    },
  });

  // ===============================
  // COMPUTED DATA WITH REDUX + REACT QUERY
  // ===============================
  
  /**
   * Combined student data from React Query and Redux store
   */
  const studentsData = useMemo(() => {
    // Primary data source: React Query (fresh server data)
    const queryStudents = studentsQuery.data?.data?.students || [];
    
    // Secondary data source: Redux store (UI state, selections, local updates)
    const storeStudents = studentsState.entities ? Object.values(studentsState.entities) : [];
    
    // Merge strategy: Use React Query data as source of truth, apply Redux UI state
    let students = queryStudents.length > 0 ? queryStudents : storeStudents;
    
    // Apply filters (from persisted route state)
    let filtered = students.filter((student) => {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = !filters.searchTerm || (
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        student.studentNumber.toLowerCase().includes(searchLower)
      );

      const matchesGrade = !filters.gradeFilter || student.grade === filters.gradeFilter;
      const matchesGender = !filters.genderFilter || student.gender === filters.genderFilter;
      const matchesStatus = !filters.statusFilter || (
        (filters.statusFilter === 'active' && student.isActive) ||
        (filters.statusFilter === 'inactive' && !student.isActive)
      );
      const matchesArchived = filters.showArchived || student.isActive;

      return matchesSearch && matchesGrade && matchesGender && matchesStatus && matchesArchived;
    });

    // Apply sorting (from persisted route state)
    if (sortColumn) {
      filtered.sort((a, b) => {
        let valueA = a[sortColumn];
        let valueB = b[sortColumn];
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }
        
        let comparison = 0;
        if (valueA < valueB) comparison = -1;
        if (valueA > valueB) comparison = 1;
        
        return sortDirection === 'desc' ? -comparison : comparison;
      });
    }

    // Apply pagination
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedStudents = filtered.slice(startIndex, startIndex + pageSize);

    return {
      all: students,
      filtered,
      paginated: paginatedStudents,
      totalCount,
      totalPages,
      currentPage: page,
      pageSize,
    };
  }, [
    studentsQuery.data, 
    studentsState.entities, 
    filters, 
    sortColumn, 
    sortDirection, 
    page, 
    pageSize
  ]);

  // ===============================
  // UNIFIED ACTIONS
  // ===============================
  
  const actions = {
    // Student selection (Redux-based)
    selectStudent: useCallback((studentId: string) => {
      dispatch(studentsActions.selectStudent(studentId));
    }, [dispatch]),

    deselectStudent: useCallback((studentId: string) => {
      dispatch(studentsActions.deselectStudent(studentId));
    }, [dispatch]),

    toggleStudentSelection: useCallback((studentId: string) => {
      if (studentsUI.selectedIds.includes(studentId)) {
        dispatch(studentsActions.deselectStudent(studentId));
      } else {
        dispatch(studentsActions.selectStudent(studentId));
      }
    }, [dispatch, studentsUI.selectedIds]),

    clearSelection: useCallback(() => {
      dispatch(studentsActions.clearSelection());
    }, [dispatch]),

    // View mode (Redux-based)
    setViewMode: useCallback((mode: 'grid' | 'list' | 'table') => {
      dispatch(studentsActions.setViewMode(mode));
    }, [dispatch]),

    // Filters (Route state + Redux sync)
    updateFilters: useCallback((newFilters: Partial<StudentFilters>) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
      resetPage(); // Reset pagination when filtering
      
      // Sync with Redux for UI state
      dispatch(studentsActions.setFilters({ ...filters, ...newFilters }));
    }, [setFilters, filters, resetPage, dispatch]),

    setSearchTerm: useCallback((searchTerm: string) => {
      updateFilter('searchTerm', searchTerm);
      dispatch(studentsActions.setSearchQuery(searchTerm));
    }, [updateFilter, dispatch]),

    clearFilters: useCallback(() => {
      clearFilters();
      dispatch(studentsActions.clearFilters());
    }, [clearFilters, dispatch]),

    // Sorting (Route state)
    updateSort: useCallback((column: StudentSortColumn) => {
      toggleSort(column);
    }, [toggleSort]),

    clearSort: useCallback(() => {
      clearSort();
    }, [clearSort]),

    // Pagination (Route state)
    goToPage: useCallback((newPage: number) => {
      setPage(newPage);
    }, [setPage]),

    setPageSize: useCallback((newPageSize: number) => {
      setPageSize(newPageSize);
    }, [setPageSize]),

    // Data refresh
    refetchStudents: useCallback(() => {
      studentsQuery.refetch();
      dispatch(studentsThunks.fetchStudents(filters));
    }, [studentsQuery, dispatch, filters]),

    // CRUD operations (React Query + Redux sync)
    createStudent: useCallback((data: CreateStudentData) => {
      createMutation.mutate(data);
    }, [createMutation]),

    updateStudent: useCallback((id: string, data: UpdateStudentData) => {
      updateMutation.mutate({ id, data });
    }, [updateMutation]),

    deactivateStudent: useCallback((id: string) => {
      deactivateMutation.mutate(id);
    }, [deactivateMutation]),

    reactivateStudent: useCallback((id: string) => {
      reactivateMutation.mutate(id);
    }, [reactivateMutation]),

    transferStudent: useCallback((id: string, data: TransferStudentRequest) => {
      transferMutation.mutate({ id, ...data });
    }, [transferMutation]),

    deleteStudent: useCallback((id: string) => {
      deleteMutation.mutate(id);
    }, [deleteMutation]),
  };

  // ===============================
  // BULK OPERATIONS
  // ===============================
  
  const bulkOperations = {
    selectMultiple: useCallback((studentIds: string[]) => {
      dispatch(studentsActions.selectMultipleStudents(studentIds));
    }, [dispatch]),

    selectAll: useCallback(() => {
      const allIds = studentsData.filtered.map(s => s.id);
      dispatch(studentsActions.selectAllStudents(allIds));
    }, [dispatch, studentsData.filtered]),

    selectNone: useCallback(() => {
      dispatch(studentsActions.clearSelection());
    }, [dispatch]),

    bulkDeactivate: useCallback(async () => {
      const selectedIds = studentsUI.selectedIds;
      // Implement bulk deactivation logic
      for (const id of selectedIds) {
        await deactivateMutation.mutateAsync(id);
      }
      dispatch(studentsActions.clearSelection());
    }, [studentsUI.selectedIds, deactivateMutation, dispatch]),

    bulkReactivate: useCallback(async () => {
      const selectedIds = studentsUI.selectedIds;
      for (const id of selectedIds) {
        await reactivateMutation.mutateAsync(id);
      }
      dispatch(studentsActions.clearSelection());
    }, [studentsUI.selectedIds, reactivateMutation, dispatch]),

    toggleBulkMode: useCallback(() => {
      dispatch(studentsActions.toggleBulkSelectMode());
    }, [dispatch]),
  };

  // ===============================
  // ANALYTICS & INSIGHTS
  // ===============================
  
  const analytics = useMemo(() => ({
    totalStudents: studentsData.all.length,
    activeStudents: activeStudents.length,
    inactiveStudents: studentsData.all.length - activeStudents.length,
    selectedCount: studentsUI.selectedIds.length,
    filteredCount: studentsData.filtered.length,
    
    byGrade: studentsByGrade,
    withAllergies: studentsWithAllergies.length,
    withMedications: studentsWithMedications.length,
    
    pagination: {
      currentPage: page,
      totalPages: studentsData.totalPages,
      pageSize,
      totalResults: studentsData.totalCount,
    },
    
    performance: {
      queryLoading: studentsQuery.isLoading,
      queryError: studentsQuery.error,
      lastFetch: studentsQuery.dataUpdatedAt,
      cacheHit: !studentsQuery.isFetching && studentsQuery.data,
    },
  }), [
    studentsData, 
    activeStudents, 
    studentsUI, 
    studentsByGrade, 
    studentsWithAllergies, 
    studentsWithMedications,
    page,
    pageSize,
    studentsQuery
  ]);

  // ===============================
  // UI STATE
  // ===============================
  
  const ui = {
    // Loading states
    loading: studentsQuery.isLoading || studentsQuery.isFetching,
    loadingStatistics: statisticsQuery.isLoading,
    
    // Error states
    error: studentsQuery.error,
    
    // Selection state
    selectedIds: studentsUI.selectedIds,
    hasSelection: studentsUI.selectedIds.length > 0,
    selectionCount: studentsUI.selectedIds.length,
    
    // View state
    viewMode: studentsUI.viewMode,
    bulkSelectMode: studentsUI.bulkSelectMode,
    
    // Filter/search state
    filters,
    hasActiveFilters: Object.values(filters).some(v => v && v !== ''),
    filtersRestored,
    
    // Sort state
    sortColumn,
    sortDirection,
    getSortIndicator,
    
    // Pagination state
    currentPage: page,
    pageSize,
    totalPages: studentsData.totalPages,
    
    // Data states
    hasStudents: studentsData.all.length > 0,
    hasFilteredStudents: studentsData.filtered.length > 0,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deactivateMutation.isPending || deleteMutation.isPending,
    isTransferring: transferMutation.isPending,
  };

  // ===============================
  // SYNC EFFECTS
  // ===============================
  
  // Sync persisted filters with Redux when restored
  useEffect(() => {
    if (filtersRestored) {
      dispatch(studentsActions.setFilters(filters));
    }
  }, [filtersRestored, filters, dispatch]);

  // Sync page state changes with Redux
  useEffect(() => {
    dispatch(studentsActions.setCurrentPage(page));
    dispatch(studentsActions.setPageSize(pageSize));
  }, [page, pageSize, dispatch]);

  // ===============================
  // RETURN COMPREHENSIVE API
  // ===============================
  
  return {
    // Primary data interface
    students: studentsData,
    statistics: statisticsQuery.data,
    
    // Unified actions
    actions,
    
    // Bulk operations
    bulkOperations,
    
    // Analytics and insights
    analytics,
    
    // UI state
    ui,
    
    // Advanced/low-level access
    store: {
      state: studentsState,
      uiState: studentsUI,
      dispatch,
      selectors: {
        activeStudents,
        studentsByGrade,
        studentsWithAllergies,
        studentsWithMedications,
      },
    },
    
    queries: {
      students: studentsQuery,
      statistics: statisticsQuery,
    },
    
    mutations: {
      create: createMutation,
      update: updateMutation,
      deactivate: deactivateMutation,
      reactivate: reactivateMutation,
      transfer: transferMutation,
      delete: deleteMutation,
    },
  };
}
