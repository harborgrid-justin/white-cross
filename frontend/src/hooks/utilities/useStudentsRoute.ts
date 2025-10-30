/**
 * WF-ROUTE-001 | useStudentsRoute.ts - Route-level hook composition
 * Purpose: Unified student management hook for the Students route
 * Upstream: @/hooks, @/services, @/pages/Students/hooks | Dependencies: React Query, custom hooks
 * Downstream: Pages/Students | Called by: Students page components
 * Related: useOptimisticStudents, useStudentManagement, useStudentsData
 * Exports: useStudentsRoute | Key Features: Route-level composition, data management
 * Last Updated: 2025-10-20 | File Type: .ts
 * Critical Path: Route load → Data fetch → User interactions → Optimistic updates
 * LLM Context: Route-level hook composition for student management
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  useOptimisticStudentCreate,
  useOptimisticStudentUpdate,
  useOptimisticStudentDeactivate,
  useOptimisticStudentReactivate,
  useOptimisticStudentTransfer,
  useOptimisticStudentPermanentDelete,
  studentKeys,
} from '@/hooks/useOptimisticStudents';
import { useRouteState } from '@/hooks/useRouteState';
import { useToast } from '@/hooks/useToast';
import { studentsApi } from '@/services/modules/studentsApi';
import type { 
  Student, 
  CreateStudentData, 
  UpdateStudentData,
  TransferStudentRequest,
  StudentFilters,
  StudentSortColumn 
} from '@/types/student.types';

/**
 * Students route state interface
 */
interface StudentsRouteState {
  // View state
  selectedStudent: Student | null;
  showCreateModal: boolean;
  showEditModal: boolean;
  showTransferModal: boolean;
  showDeleteModal: boolean;
  
  // Filter and pagination state
  filters: StudentFilters;
  sortColumn: StudentSortColumn | null;
  sortDirection: 'asc' | 'desc';
  page: number;
  pageSize: number;
  
  // UI state
  loading: boolean;
  searchTerm: string;
}

/**
 * Default route state
 */
const defaultState: StudentsRouteState = {
  selectedStudent: null,
  showCreateModal: false,
  showEditModal: false,
  showTransferModal: false,
  showDeleteModal: false,
  filters: {
    searchTerm: '',
    gradeFilter: '',
    genderFilter: undefined,
    statusFilter: '',
    showArchived: false,
  },
  sortColumn: null,
  sortDirection: 'asc',
  page: 1,
  pageSize: 20,
  loading: false,
  searchTerm: '',
};

/**
 * Route-level hook for Students management
 * 
 * Combines data fetching, optimistic updates, filtering, pagination,
 * and UI state management into a single cohesive API for the Students route.
 * 
 * @example
 * ```tsx
 * function StudentsPage() {
 *   const {
 *     students,
 *     filteredStudents,
 *     selectedStudent,
 *     actions,
 *     ui,
 *     mutations
 *   } = useStudentsRoute();
 * 
 *   return (
 *     <div>
 *       <StudentsTable students={filteredStudents} onSelect={actions.selectStudent} />
 *       <StudentModal 
 *         open={ui.showCreateModal} 
 *         onSubmit={mutations.create.mutate}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useStudentsRoute() {
  // ===============================
  // STATE MANAGEMENT
  // ===============================
  
  const [state, setState] = useState<StudentsRouteState>(defaultState);
  const { toast } = useToast();
  
  // Persist certain state to URL/localStorage
  const { routeState, updateRouteState } = useRouteState('students', {
    page: state.page,
    pageSize: state.pageSize,
    filters: state.filters,
    sortColumn: state.sortColumn,
    sortDirection: state.sortDirection,
  });

  // ===============================
  // DATA FETCHING
  // ===============================
  
  /**
   * Main students query with caching and error handling
   */
  const studentsQuery = useQuery({
    queryKey: studentKeys.list(state.filters),
    queryFn: () => studentsApi.getAll({
      page: state.page,
      limit: state.pageSize,
      ...state.filters,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  /**
   * Student statistics query
   */
  const statisticsQuery = useQuery({
    queryKey: [...studentKeys.all, 'statistics'],
    queryFn: () => studentsApi.getStatistics(),
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  });

  // ===============================
  // OPTIMISTIC MUTATIONS
  // ===============================
  
  const createMutation = useOptimisticStudentCreate({
    onSuccess: (student) => {
      toast.success(`Student ${student.firstName} ${student.lastName} created successfully`);
      setState(prev => ({ ...prev, showCreateModal: false }));
    },
    onError: (error) => {
      toast.error(`Failed to create student: ${error.message}`);
    },
  });

  const updateMutation = useOptimisticStudentUpdate({
    onSuccess: (student) => {
      toast.success(`Student ${student.firstName} ${student.lastName} updated successfully`);
      setState(prev => ({ ...prev, showEditModal: false, selectedStudent: student }));
    },
    onError: (error) => {
      toast.error(`Failed to update student: ${error.message}`);
    },
  });

  const deactivateMutation = useOptimisticStudentDeactivate({
    onSuccess: (student) => {
      toast.success(`Student ${student.firstName} ${student.lastName} deactivated`);
      setState(prev => ({ ...prev, showDeleteModal: false, selectedStudent: null }));
    },
    onError: (error) => {
      toast.error(`Failed to deactivate student: ${error.message}`);
    },
  });

  const reactivateMutation = useOptimisticStudentReactivate({
    onSuccess: (student) => {
      toast.success(`Student ${student.firstName} ${student.lastName} reactivated`);
    },
    onError: (error) => {
      toast.error(`Failed to reactivate student: ${error.message}`);
    },
  });

  const transferMutation = useOptimisticStudentTransfer({
    onSuccess: (student) => {
      toast.success(`Student ${student.firstName} ${student.lastName} transferred successfully`);
      setState(prev => ({ ...prev, showTransferModal: false, selectedStudent: null }));
    },
    onError: (error) => {
      toast.error(`Failed to transfer student: ${error.message}`);
    },
  });

  const deleteMutation = useOptimisticStudentPermanentDelete({
    onSuccess: () => {
      toast.success('Student permanently deleted');
      setState(prev => ({ ...prev, showDeleteModal: false, selectedStudent: null }));
    },
    onError: (error) => {
      toast.error(`Failed to delete student: ${error.message}`);
    },
  });

  // ===============================
  // COMPUTED VALUES
  // ===============================
  
  /**
   * Students data with filtering, sorting, and pagination applied
   */
  const studentsData = useMemo(() => {
    const students = studentsQuery.data?.data?.students || [];
    
    // Apply search filter
    let filtered = students.filter((student) => {
      const searchLower = state.filters.searchTerm.toLowerCase();
      return (
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        student.studentNumber.toLowerCase().includes(searchLower)
      );
    });

    // Apply other filters
    if (state.filters.gradeFilter) {
      filtered = filtered.filter(s => s.grade === state.filters.gradeFilter);
    }
    if (state.filters.genderFilter) {
      filtered = filtered.filter(s => s.gender === state.filters.genderFilter);
    }
    if (state.filters.statusFilter) {
      filtered = filtered.filter(s => 
        state.filters.statusFilter === 'active' ? s.isActive : !s.isActive
      );
    }
    if (!state.filters.showArchived) {
      filtered = filtered.filter(s => s.isActive);
    }

    // Apply sorting
    if (state.sortColumn) {
      filtered.sort((a, b) => {
        const valueA = a[state.sortColumn!];
        const valueB = b[state.sortColumn!];
        
        let comparison = 0;
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          comparison = valueA.localeCompare(valueB);
        } else {
          comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        }
        
        return state.sortDirection === 'desc' ? -comparison : comparison;
      });
    }

    // Calculate pagination
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / state.pageSize);
    const startIndex = (state.page - 1) * state.pageSize;
    const paginatedStudents = filtered.slice(startIndex, startIndex + state.pageSize);

    return {
      allStudents: students,
      filteredStudents: filtered,
      paginatedStudents,
      totalCount,
      totalPages,
      currentPage: state.page,
      pageSize: state.pageSize,
    };
  }, [studentsQuery.data, state.filters, state.sortColumn, state.sortDirection, state.page, state.pageSize]);

  // ===============================
  // ACTION HANDLERS
  // ===============================
  
  const actions = {
    // Student selection
    selectStudent: useCallback((student: Student | null) => {
      setState(prev => ({ ...prev, selectedStudent: student }));
    }, []),

    // Modal controls
    openCreateModal: useCallback(() => {
      setState(prev => ({ ...prev, showCreateModal: true }));
    }, []),
    
    closeCreateModal: useCallback(() => {
      setState(prev => ({ ...prev, showCreateModal: false }));
    }, []),
    
    openEditModal: useCallback((student: Student) => {
      setState(prev => ({ ...prev, selectedStudent: student, showEditModal: true }));
    }, []),
    
    closeEditModal: useCallback(() => {
      setState(prev => ({ ...prev, showEditModal: false }));
    }, []),
    
    openTransferModal: useCallback((student: Student) => {
      setState(prev => ({ ...prev, selectedStudent: student, showTransferModal: true }));
    }, []),
    
    closeTransferModal: useCallback(() => {
      setState(prev => ({ ...prev, showTransferModal: false }));
    }, []),
    
    openDeleteModal: useCallback((student: Student) => {
      setState(prev => ({ ...prev, selectedStudent: student, showDeleteModal: true }));
    }, []),
    
    closeDeleteModal: useCallback(() => {
      setState(prev => ({ ...prev, showDeleteModal: false }));
    }, []),

    // Filters and search
    updateFilters: useCallback((newFilters: Partial<StudentFilters>) => {
      setState(prev => ({ 
        ...prev, 
        filters: { ...prev.filters, ...newFilters },
        page: 1 // Reset to first page when filtering
      }));
      updateRouteState({ filters: { ...state.filters, ...newFilters }, page: 1 });
    }, [state.filters, updateRouteState]),

    setSearchTerm: useCallback((searchTerm: string) => {
      setState(prev => ({ 
        ...prev, 
        filters: { ...prev.filters, searchTerm },
        page: 1 
      }));
      updateRouteState({ filters: { ...state.filters, searchTerm }, page: 1 });
    }, [state.filters, updateRouteState]),

    // Sorting
    updateSort: useCallback((column: StudentSortColumn) => {
      setState(prev => ({
        ...prev,
        sortColumn: column,
        sortDirection: prev.sortColumn === column && prev.sortDirection === 'asc' ? 'desc' : 'asc',
      }));
    }, []),

    // Pagination
    goToPage: useCallback((page: number) => {
      setState(prev => ({ ...prev, page }));
      updateRouteState({ page });
    }, [updateRouteState]),
    
    setPageSize: useCallback((pageSize: number) => {
      setState(prev => ({ ...prev, pageSize, page: 1 }));
      updateRouteState({ pageSize, page: 1 });
    }, [updateRouteState]),

    // Data refresh
    refetchStudents: useCallback(() => {
      studentsQuery.refetch();
    }, [studentsQuery]),
  };

  // ===============================
  // UI STATE
  // ===============================
  
  const ui = {
    // Loading states
    loading: studentsQuery.isLoading || studentsQuery.isFetching,
    loadingStatistics: statisticsQuery.isLoading,
    
    // Error states
    error: studentsQuery.error,
    
    // Modal states
    showCreateModal: state.showCreateModal,
    showEditModal: state.showEditModal,
    showTransferModal: state.showTransferModal,
    showDeleteModal: state.showDeleteModal,
    
    // Data states
    hasStudents: (studentsData.allStudents?.length || 0) > 0,
    hasFilteredStudents: (studentsData.filteredStudents?.length || 0) > 0,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deactivateMutation.isPending || deleteMutation.isPending,
    isTransferring: transferMutation.isPending,
  };

  // ===============================
  // RETURN API
  // ===============================
  
  return {
    // Data
    students: studentsData,
    statistics: statisticsQuery.data,
    selectedStudent: state.selectedStudent,
    
    // Actions
    actions,
    
    // UI State
    ui,
    
    // Mutations (for advanced usage)
    mutations: {
      create: createMutation,
      update: updateMutation,
      deactivate: deactivateMutation,
      reactivate: reactivateMutation,
      transfer: transferMutation,
      delete: deleteMutation,
    },
    
    // State (for advanced usage)
    state,
    setState,
  };
}
