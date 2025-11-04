/**
 * WF-ROUTE-002 | useMedicationsRoute.ts - Route-level hook composition
 * Purpose: Unified medication management hook for the Medications route
 * Upstream: @/hooks, @/services, @/pages/Medications/hooks | Dependencies: React Query, custom hooks
 * Downstream: Pages/Medications | Called by: Medications page components
 * Related: useOptimisticMedications, useMedicationsData, useMedicationAdministration
 * Exports: useMedicationsRoute | Key Features: Route-level composition, medication management
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Route load → Data fetch → Medication operations → Optimistic updates
 * LLM Context: Route-level hook composition for medication management
 */

import { useRouteState } from './state';
import { useMedicationsQueries } from './queries';
import { useMedicationsMutations } from './mutations';
import {
  useMedicationsData,
  useScheduleData,
  useInventoryData,
  useUIState,
} from './computed';
import { useMedicationsActions } from './actions';
import type {
  Medication,
  MedicationLog,
  InventoryItem,
  AdverseReaction,
} from './types';

/**
 * Route-level hook for Medications management
 *
 * Combines medication CRUD, administration tracking, inventory management,
 * scheduling, and reporting into a unified API for the Medications route.
 *
 * @example
 * ```tsx
 * function MedicationsPage() {
 *   const {
 *     medications,
 *     administration,
 *     inventory,
 *     schedule,
 *     actions,
 *     ui,
 *     mutations
 *   } = useMedicationsRoute();
 *
 *   return (
 *     <MedicationTabs
 *       activeTab={ui.activeTab}
 *       medications={medications.paginated}
 *       schedule={schedule.today}
 *       onTabChange={actions.setActiveTab}
 *     />
 *   );
 * }
 * ```
 */
export function useMedicationsRoute() {
  // ===============================
  // STATE MANAGEMENT
  // ===============================

  const { state, setState, updateRouteState } = useRouteState();

  // ===============================
  // DATA FETCHING
  // ===============================

  const queries = useMedicationsQueries(state);

  // ===============================
  // OPTIMISTIC MUTATIONS
  // ===============================

  const mutations = useMedicationsMutations({
    onCreateSuccess: (medication: Medication) => {
      setState(prev => ({ ...prev, showCreateModal: false }));
    },
    onUpdateSuccess: (medication: Medication) => {
      setState(prev => ({ ...prev, showEditModal: false, selectedMedication: medication }));
    },
    onDeleteSuccess: () => {
      setState(prev => ({ ...prev, showDeleteModal: false, selectedMedication: null }));
    },
    onAdministerSuccess: (log: MedicationLog) => {
      setState(prev => ({ ...prev, showAdministrationModal: false }));
    },
    onInventoryUpdateSuccess: (inventory: InventoryItem) => {
      setState(prev => ({ ...prev, showInventoryModal: false }));
    },
    onAdverseReactionSuccess: (reaction: AdverseReaction) => {
      setState(prev => ({ ...prev, showAdverseReactionModal: false }));
    },
  });

  // ===============================
  // COMPUTED VALUES
  // ===============================

  const medicationsData = useMedicationsData(queries.medicationsQuery.data, state);
  const scheduleData = useScheduleData(queries.scheduleQuery.data);
  const inventoryData = useInventoryData(queries.inventoryQuery.data);

  // ===============================
  // ACTION HANDLERS
  // ===============================

  const actions = useMedicationsActions({
    setState,
    updateRouteState,
    state,
    queries,
  });

  // ===============================
  // UI STATE
  // ===============================

  const ui = useUIState(state, queries, mutations, medicationsData, scheduleData, inventoryData);

  // ===============================
  // RETURN API
  // ===============================

  return {
    // Data
    medications: medicationsData,
    schedule: scheduleData,
    inventory: inventoryData,
    administration: queries.administrationQuery.data,
    reminders: queries.remindersQuery.data,
    selectedMedication: state.selectedMedication,
    selectedStudentMedication: state.selectedStudentMedication,

    // Actions
    actions,

    // UI State
    ui,

    // Mutations (for advanced usage)
    mutations: {
      create: mutations.createMutation,
      update: mutations.updateMutation,
      delete: mutations.deleteMutation,
      administer: mutations.administrationMutation,
      updateInventory: mutations.inventoryMutation,
      reportAdverseReaction: mutations.adverseReactionMutation,
    },

    // State (for advanced usage)
    state,
    setState,
  };
}
