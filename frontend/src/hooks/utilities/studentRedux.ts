/**
 * Redux Integration Hooks for Student Management
 * 
 * Hooks that bridge TanStack Query server state with Redux UI state,
 * providing seamless integration between server data and global UI state.
 * 
 * @module hooks/students/redux
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { studentQueryKeys } from './queryKeys';
import { useCacheManager } from './utils';
import type { Student } from '@/types/student.types';

/**
 * Redux state shape for student UI state
 * This would typically be defined in your Redux store structure
 */
export interface StudentUIState {
  // Selection state
  selectedStudentIds: string[];
  lastSelectedId: string | null;
  
  // UI state
  isSelectionMode: boolean;
  showInactiveStudents: boolean;
  
  // View preferences
  viewMode: 'list' | 'grid' | 'table';
  sortPreference: {
    field: string;
    direction: 'asc' | 'desc';
  };
  
  // Filters applied in UI
  appliedFilters: Record<string, any>;
  
  // Modal and form state
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  editingStudentId: string | null;
  
  // Bulk operations
  bulkOperationMode: boolean;
  selectedForBulkOperation: string[];
  
  // Recent interactions
  recentlyViewedIds: string[];
  recentSearchQueries: string[];
}

/**
 * Redux actions for student UI state
 * These would typically be defined in your Redux slice
 */
export interface StudentUIActions {
  // Selection actions
  selectStudent: (id: string) => void;
  selectMultipleStudents: (ids: string[]) => void;
  deselectStudent: (id: string) => void;
  clearSelection: () => void;
  toggleSelection: (id: string) => void;
  
  // UI state actions
  setSelectionMode: (enabled: boolean) => void;
  setShowInactiveStudents: (show: boolean) => void;
  setViewMode: (mode: 'list' | 'grid' | 'table') => void;
  setSortPreference: (field: string, direction: 'asc' | 'desc') => void;
  
  // Filter actions
  setFilters: (filters: Record<string, any>) => void;
  clearFilters: () => void;
  
  // Modal actions
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (studentId: string) => void;
  closeEditModal: () => void;
  
  // Bulk operation actions
  enterBulkMode: () => void;
  exitBulkMode: () => void;
  selectForBulkOperation: (ids: string[]) => void;
  
  // Recent items actions
  addToRecentlyViewed: (id: string) => void;
  addToRecentSearches: (query: string) => void;
}

/**
 * Mock Redux selectors and actions
 * In a real application, these would be imported from your Redux store
 */
const mockSelectors = {
  selectStudentUIState: (state: any): StudentUIState => ({
    selectedStudentIds: [],
    lastSelectedId: null,
    isSelectionMode: false,
    showInactiveStudents: false,
    viewMode: 'list' as const,
    sortPreference: { field: 'lastName', direction: 'asc' as const },
    appliedFilters: {},
    isCreateModalOpen: false,
    isEditModalOpen: false,
    editingStudentId: null,
    bulkOperationMode: false,
    selectedForBulkOperation: [],
    recentlyViewedIds: [],
    recentSearchQueries: [],
  }),
  selectSelectedStudentIds: (state: any): string[] => [],
  selectIsSelectionMode: (state: any): boolean => false,
  selectViewMode: (state: any): 'list' | 'grid' | 'table' => 'list',
  selectAppliedFilters: (state: any): Record<string, any> => ({}),
};

const mockActions: StudentUIActions = {
  selectStudent: () => {},
  selectMultipleStudents: () => {},
  deselectStudent: () => {},
  clearSelection: () => {},
  toggleSelection: () => {},
  setSelectionMode: () => {},
  setShowInactiveStudents: () => {},
  setViewMode: () => {},
  setSortPreference: () => {},
  setFilters: () => {},
  clearFilters: () => {},
  openCreateModal: () => {},
  closeCreateModal: () => {},
  openEditModal: () => {},
  closeEditModal: () => {},
  enterBulkMode: () => {},
  exitBulkMode: () => {},
  selectForBulkOperation: () => {},
  addToRecentlyViewed: () => {},
  addToRecentSearches: () => {},
};

/**
 * Hook that combines TanStack Query data with Redux UI state
 * 
 * @param filters - Additional filters for data fetching
 * @returns Combined server state and UI state with actions
 * 
 * @example
 * ```tsx
 * const {
 *   students,
 *   selectedStudents,
 *   isLoading,
 *   selectStudent,
 *   toggleSelectionMode,
 *   appliedFilters
 * } = useStudentsWithRedux();
 * 
 * return (
 *   <StudentList
 *     students={students}
 *     selectedIds={selectedStudents.map(s => s.id)}
 *     onSelect={selectStudent}
 *     loading={isLoading}
 *   />
 * );
 * ```
 */
export const useStudentsWithRedux = (filters?: Record<string, any>) => {
  // Redux state and actions
  const uiState = useSelector(mockSelectors.selectStudentUIState);
  const dispatch = useDispatch();
  
  // Combine filters from props and Redux state
  const combinedFilters = useMemo(() => ({
    ...filters,
    ...uiState.appliedFilters,
    isActive: uiState.showInactiveStudents ? undefined : true,
  }), [filters, uiState.appliedFilters, uiState.showInactiveStudents]);

  // TanStack Query for server state
  const studentsQuery = useQuery({
    queryKey: studentQueryKeys.lists.filtered(combinedFilters),
    queryFn: async () => {
      // This would use your actual API call
      return { students: [] as Student[], pagination: { total: 0, page: 1, limit: 50 } };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Memoized selected students
  const selectedStudents = useMemo(() => {
    if (!studentsQuery.data?.students || !uiState.selectedStudentIds.length) {
      return [];
    }
    
    return studentsQuery.data.students.filter(student =>
      uiState.selectedStudentIds.includes(student.id)
    );
  }, [studentsQuery.data?.students, uiState.selectedStudentIds]);

  // Enhanced action creators that dispatch Redux actions
  const actions = useMemo(() => ({
    // Selection actions
    selectStudent: (id: string) => {
      dispatch(mockActions.selectStudent(id));
      dispatch(mockActions.addToRecentlyViewed(id));
    },
    
    toggleSelection: (id: string) => {
      dispatch(mockActions.toggleSelection(id));
    },
    
    selectAll: () => {
      const allIds = studentsQuery.data?.students.map(s => s.id) || [];
      dispatch(mockActions.selectMultipleStudents(allIds));
    },
    
    clearSelection: () => {
      dispatch(mockActions.clearSelection());
    },
    
    // UI state actions
    toggleSelectionMode: () => {
      dispatch(mockActions.setSelectionMode(!uiState.isSelectionMode));
    },
    
    setViewMode: (mode: 'list' | 'grid' | 'table') => {
      dispatch(mockActions.setViewMode(mode));
    },
    
    toggleInactiveStudents: () => {
      dispatch(mockActions.setShowInactiveStudents(!uiState.showInactiveStudents));
    },
    
    // Filter actions
    updateFilters: (newFilters: Record<string, any>) => {
      dispatch(mockActions.setFilters({ ...uiState.appliedFilters, ...newFilters }));
    },
    
    clearFilters: () => {
      dispatch(mockActions.clearFilters());
    },
    
    // Modal actions
    openCreateModal: () => {
      dispatch(mockActions.openCreateModal());
    },
    
    openEditModal: (studentId: string) => {
      dispatch(mockActions.openEditModal(studentId));
    },
    
    closeModals: () => {
      dispatch(mockActions.closeCreateModal());
      dispatch(mockActions.closeEditModal());
    },
    
    // Bulk operations
    enterBulkMode: () => {
      dispatch(mockActions.enterBulkMode());
      dispatch(mockActions.setSelectionMode(true));
    },
    
    exitBulkMode: () => {
      dispatch(mockActions.exitBulkMode());
      dispatch(mockActions.clearSelection());
      dispatch(mockActions.setSelectionMode(false));
    },
  }), [dispatch, uiState, studentsQuery.data?.students]);

  return {
    // Server state from TanStack Query
    students: studentsQuery.data?.students || [],
    pagination: studentsQuery.data?.pagination,
    isLoading: studentsQuery.isLoading,
    isFetching: studentsQuery.isFetching,
    error: studentsQuery.error,
    refetch: studentsQuery.refetch,
    
    // Combined state
    selectedStudents,
    hasSelection: selectedStudents.length > 0,
    allSelected: selectedStudents.length === (studentsQuery.data?.students.length || 0),
    
    // UI state from Redux
    uiState,
    
    // Enhanced actions
    actions,
  };
};

/**
 * Hook for managing student selection with Redux integration
 * 
 * @returns Selection state and management functions
 * 
 * @example
 * ```tsx
 * const {
 *   selectedIds,
 *   isSelected,
 *   toggleSelection,
 *   selectAll,
 *   hasSelection
 * } = useStudentSelection();
 * ```
 */
export const useStudentSelection = () => {
  const selectedIds = useSelector(mockSelectors.selectSelectedStudentIds);
  const isSelectionMode = useSelector(mockSelectors.selectIsSelectionMode);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Get current students for bulk selection
  const currentStudents = useMemo(() => {
    const data = queryClient.getQueryData(studentQueryKeys.lists.active());
    return Array.isArray(data) ? data : data?.students || [];
  }, [queryClient]);

  const actions = useMemo(() => ({
    isSelected: (id: string) => selectedIds.includes(id),
    
    toggleSelection: (id: string) => {
      dispatch(mockActions.toggleSelection(id));
    },
    
    selectStudent: (id: string) => {
      if (!selectedIds.includes(id)) {
        dispatch(mockActions.selectStudent(id));
      }
    },
    
    deselectStudent: (id: string) => {
      if (selectedIds.includes(id)) {
        dispatch(mockActions.deselectStudent(id));
      }
    },
    
    selectAll: () => {
      const allIds = currentStudents.map((s: Student) => s.id);
      dispatch(mockActions.selectMultipleStudents(allIds));
    },
    
    selectNone: () => {
      dispatch(mockActions.clearSelection());
    },
    
    selectRange: (startId: string, endId: string) => {
      const startIndex = currentStudents.findIndex((s: Student) => s.id === startId);
      const endIndex = currentStudents.findIndex((s: Student) => s.id === endId);
      
      if (startIndex !== -1 && endIndex !== -1) {
        const rangeStart = Math.min(startIndex, endIndex);
        const rangeEnd = Math.max(startIndex, endIndex);
        const rangeIds = currentStudents
          .slice(rangeStart, rangeEnd + 1)
          .map((s: Student) => s.id);
        
        dispatch(mockActions.selectMultipleStudents([...selectedIds, ...rangeIds]));
      }
    },
    
    toggleSelectionMode: () => {
      dispatch(mockActions.setSelectionMode(!isSelectionMode));
      if (isSelectionMode) {
        dispatch(mockActions.clearSelection());
      }
    },
  }), [selectedIds, isSelectionMode, currentStudents, dispatch]);

  return {
    selectedIds,
    selectedCount: selectedIds.length,
    hasSelection: selectedIds.length > 0,
    isSelectionMode,
    allSelected: selectedIds.length === currentStudents.length && currentStudents.length > 0,
    ...actions,
  };
};

/**
 * Hook for synchronizing server state changes with Redux UI state
 * 
 * @returns Synchronization utilities
 * 
 * @example
 * ```tsx
 * const { syncSelectedStudents, clearInvalidSelections } = useReduxSync();
 * 
 * // Automatically clear selections for deleted students
 * useEffect(() => {
 *   clearInvalidSelections();
 * }, [clearInvalidSelections]);
 * ```
 */
export const useReduxSync = () => {
  const dispatch = useDispatch();
  const selectedIds = useSelector(mockSelectors.selectSelectedStudentIds);
  const queryClient = useQueryClient();
  const { updateStudentInCache } = useCacheManager();

  /**
   * Sync selected students when server data changes
   */
  const syncSelectedStudents = useCallback(() => {
    const currentData = queryClient.getQueryData(studentQueryKeys.lists.active());
    const currentStudents = Array.isArray(currentData) ? currentData : currentData?.students || [];
    const currentIds = currentStudents.map((s: Student) => s.id);
    
    // Remove selections for students that no longer exist
    const validSelectedIds = selectedIds.filter(id => currentIds.includes(id));
    
    if (validSelectedIds.length !== selectedIds.length) {
      dispatch(mockActions.selectMultipleStudents(validSelectedIds));
    }
  }, [queryClient, selectedIds, dispatch]);

  /**
   * Clear selections for students that no longer exist
   */
  const clearInvalidSelections = useCallback(() => {
    syncSelectedStudents();
  }, [syncSelectedStudents]);

  /**
   * Update Redux state when specific student is updated
   */
  const syncStudentUpdate = useCallback((studentId: string, updates: Partial<Student>) => {
    // Update cache first
    updateStudentInCache(studentId, updates);
    
    // Add to recently viewed if not already there
    dispatch(mockActions.addToRecentlyViewed(studentId));
  }, [updateStudentInCache, dispatch]);

  /**
   * Handle student deletion in Redux state
   */
  const syncStudentDeletion = useCallback((studentId: string) => {
    // Remove from selections
    dispatch(mockActions.deselectStudent(studentId));
    
    // Close edit modal if this student was being edited
    // This would check if the editing student ID matches
    dispatch(mockActions.closeEditModal());
  }, [dispatch]);

  // Auto-sync on mount and when selected IDs change
  useEffect(() => {
    syncSelectedStudents();
  }, [syncSelectedStudents]);

  return {
    syncSelectedStudents,
    clearInvalidSelections,
    syncStudentUpdate,
    syncStudentDeletion,
  };
};

/**
 * Hook for managing view preferences with Redux and local persistence
 * 
 * @returns View preference state and controls
 * 
 * @example
 * ```tsx
 * const {
 *   viewMode,
 *   sortPreference,
 *   setViewMode,
 *   updateSort
 * } = useViewPreferences();
 * ```
 */
export const useViewPreferences = () => {
  const viewMode = useSelector(mockSelectors.selectViewMode);
  const appliedFilters = useSelector(mockSelectors.selectAppliedFilters);
  const dispatch = useDispatch();

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('student-view-preferences');
      if (saved) {
        const preferences = JSON.parse(saved);
        if (preferences.viewMode) {
          dispatch(mockActions.setViewMode(preferences.viewMode));
        }
        if (preferences.sortPreference) {
          dispatch(mockActions.setSortPreference(
            preferences.sortPreference.field,
            preferences.sortPreference.direction
          ));
        }
      }
    } catch (error) {
      console.error('Failed to load view preferences:', error);
    }
  }, [dispatch]);

  // Save preferences to localStorage when they change
  useEffect(() => {
    try {
      const preferences = {
        viewMode,
        appliedFilters,
        timestamp: Date.now(),
      };
      localStorage.setItem('student-view-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save view preferences:', error);
    }
  }, [viewMode, appliedFilters]);

  const actions = useMemo(() => ({
    setViewMode: (mode: 'list' | 'grid' | 'table') => {
      dispatch(mockActions.setViewMode(mode));
    },
    
    updateSort: (field: string, direction: 'asc' | 'desc') => {
      dispatch(mockActions.setSortPreference(field, direction));
    },
    
    toggleSortDirection: (field: string) => {
      // This would get current sort preference and toggle direction
      dispatch(mockActions.setSortPreference(field, 'asc')); // Simplified
    },
    
    resetToDefaults: () => {
      dispatch(mockActions.setViewMode('list'));
      dispatch(mockActions.setSortPreference('lastName', 'asc'));
      dispatch(mockActions.clearFilters());
    },
  }), [dispatch]);

  return {
    viewMode,
    appliedFilters,
    ...actions,
  };
};

/**
 * Hook for managing bulk operations with Redux state
 * 
 * @returns Bulk operation state and controls
 * 
 * @example
 * ```tsx
 * const {
 *   isBulkMode,
 *   selectedForBulk,
 *   enterBulkMode,
 *   selectAllForBulk,
 *   performBulkAction
 * } = useBulkOperations();
 * ```
 */
export const useBulkOperations = () => {
  const uiState = useSelector(mockSelectors.selectStudentUIState);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const selectedStudents = useMemo(() => {
    const data = queryClient.getQueryData(studentQueryKeys.lists.active());
    const students = Array.isArray(data) ? data : data?.students || [];
    return students.filter((s: Student) => 
      uiState.selectedForBulkOperation.includes(s.id)
    );
  }, [queryClient, uiState.selectedForBulkOperation]);

  const actions = useMemo(() => ({
    enterBulkMode: () => {
      dispatch(mockActions.enterBulkMode());
    },
    
    exitBulkMode: () => {
      dispatch(mockActions.exitBulkMode());
    },
    
    selectAllForBulk: () => {
      const data = queryClient.getQueryData(studentQueryKeys.lists.active());
      const students = Array.isArray(data) ? data : data?.students || [];
      const allIds = students.map((s: Student) => s.id);
      dispatch(mockActions.selectForBulkOperation(allIds));
    },
    
    clearBulkSelection: () => {
      dispatch(mockActions.selectForBulkOperation([]));
    },
    
    toggleBulkSelection: (id: string) => {
      const current = uiState.selectedForBulkOperation;
      const newSelection = current.includes(id)
        ? current.filter(sid => sid !== id)
        : [...current, id];
      dispatch(mockActions.selectForBulkOperation(newSelection));
    },
    
    performBulkAction: async (action: string, data?: any) => {
      // This would implement actual bulk operations
      // For now, just log the action
      console.log('Bulk action:', action, 'on', uiState.selectedForBulkOperation.length, 'students');
      
      // After successful bulk action, clear selections
      dispatch(mockActions.selectForBulkOperation([]));
      dispatch(mockActions.exitBulkMode());
    },
  }), [dispatch, queryClient, uiState.selectedForBulkOperation]);

  return {
    isBulkMode: uiState.bulkOperationMode,
    selectedForBulk: uiState.selectedForBulkOperation,
    selectedStudents,
    selectedCount: uiState.selectedForBulkOperation.length,
    hasSelection: uiState.selectedForBulkOperation.length > 0,
    ...actions,
  };
};

/**
 * Export all Redux integration hooks
 */
export default {
  useStudentsWithRedux,
  useStudentSelection,
  useReduxSync,
  useViewPreferences,
  useBulkOperations,
};
