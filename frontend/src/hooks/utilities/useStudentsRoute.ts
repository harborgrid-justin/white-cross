/**
 * WF-ROUTE-001 | useStudentsRoute.ts - Route-level hook composition
 * Purpose: Unified student management hook for the Students route
 * Upstream: @/hooks, @/services, @/pages/Students/hooks | Dependencies: React Query, custom hooks
 * Downstream: Pages/Students | Called by: Students page components
 * Related: useOptimisticStudents, useStudentManagement, useStudentsData
 * Exports: useStudentsRoute | Key Features: Route-level composition, data management
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Route load → Data fetch → User interactions → Optimistic updates
 * LLM Context: Route-level hook composition for student management
 */

import { useState } from 'react';
import { defaultState } from './useStudentsRoute.state';
import { useStudentsQuery, useStatisticsQuery } from './useStudentsRoute.queries';
import { useStudentMutations } from './useStudentsRoute.mutations';
import { useStudentsData } from './useStudentsRoute.computed';
import { useStudentActions } from './useStudentsRoute.actions';

export type { StudentsRouteState } from './useStudentsRoute.state';

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

  const [state, setState] = useState(defaultState);

  // ===============================
  // DATA FETCHING
  // ===============================

  const studentsQuery = useStudentsQuery(state);
  const statisticsQuery = useStatisticsQuery();

  // ===============================
  // OPTIMISTIC MUTATIONS
  // ===============================

  const mutations = useStudentMutations(setState);

  // ===============================
  // COMPUTED VALUES
  // ===============================

  const studentsData = useStudentsData(studentsQuery, state);

  // ===============================
  // ACTION HANDLERS
  // ===============================

  const actions = useStudentActions(state, setState, studentsQuery);

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
    isCreating: mutations.createMutation.isPending,
    isUpdating: mutations.updateMutation.isPending,
    isDeleting: mutations.deactivateMutation.isPending || mutations.deleteMutation.isPending,
    isTransferring: mutations.transferMutation.isPending,
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
      create: mutations.createMutation,
      update: mutations.updateMutation,
      deactivate: mutations.deactivateMutation,
      reactivate: mutations.reactivateMutation,
      transfer: mutations.transferMutation,
      delete: mutations.deleteMutation,
    },

    // State (for advanced usage)
    state,
    setState,
  };
}
