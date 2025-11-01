/**
 * WF-ROUTE-002 | useMedicationsRoute.ts - Route-level hook composition
 * Purpose: Unified medication management hook for the Medications route
 * Upstream: @/hooks, @/services, @/pages/Medications/hooks | Dependencies: React Query, custom hooks
 * Downstream: Pages/Medications | Called by: Medications page components
 * Related: useOptimisticMedications, useMedicationsData, useMedicationAdministration
 * Exports: useMedicationsRoute | Key Features: Route-level composition, medication management
 * Last Updated: 2025-10-20 | File Type: .ts
 * Critical Path: Route load → Data fetch → Medication operations → Optimistic updates
 * LLM Context: Route-level hook composition for medication management
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  useOptimisticMedicationCreate,
  useOptimisticMedicationUpdate,
  useOptimisticMedicationDelete,
  useOptimisticPrescriptionCreate,
  useOptimisticPrescriptionDeactivate,
  useOptimisticMedicationAdministration,
  useOptimisticInventoryAdd,
  useOptimisticInventoryUpdate,
  useOptimisticAdverseReactionReport,
  medicationKeys,
} from '@/hooks/domains/medications/mutations/useOptimisticMedications';
import { useToast } from '@/hooks/useToast';
import { useMedicationToast } from '@/hooks/utilities/useMedicationToast';
import { apiActions } from '@/lib/api';
import type {
  Medication,
  StudentMedication,
  MedicationLog,
  InventoryItem,
  AdverseReaction,
  MedicationAdministrationData,
} from '@/types/medications';

// Temporary types until they're added to medications types
type CreateMedicationData = any;
type UpdateMedicationData = any;
type MedicationFilters = {
  searchTerm: string;
  categoryFilter: string;
  statusFilter: string;
  studentFilter: string;
  nurseFilter: string;
  urgencyFilter: string;
};
type MedicationSortColumn = 'name' | 'genericName' | 'category' | 'createdAt' | 'updatedAt';

/**
 * Medications route state interface
 */
interface MedicationsRouteState {
  // View state
  selectedMedication: Medication | null;
  selectedStudentMedication: StudentMedication | null;
  activeTab: 'medications' | 'administration' | 'inventory' | 'schedule' | 'reports';
  
  // Modal states
  showCreateModal: boolean;
  showEditModal: boolean;
  showDeleteModal: boolean;
  showAdministrationModal: boolean;
  showInventoryModal: boolean;
  showAdverseReactionModal: boolean;
  
  // Filter and pagination state
  filters: MedicationFilters;
  sortColumn: MedicationSortColumn | null;
  sortDirection: 'asc' | 'desc';
  page: number;
  pageSize: number;
  
  // Date range for schedule/reports
  dateRange: {
    startDate: string;
    endDate: string;
  };
  
  // UI state
  loading: boolean;
  searchTerm: string;
}

/**
 * Default route state
 */
const defaultState: MedicationsRouteState = {
  selectedMedication: null,
  selectedStudentMedication: null,
  activeTab: 'medications',
  showCreateModal: false,
  showEditModal: false,
  showDeleteModal: false,
  showAdministrationModal: false,
  showInventoryModal: false,
  showAdverseReactionModal: false,
  filters: {
    searchTerm: '',
    categoryFilter: '',
    statusFilter: 'active',
    studentFilter: '',
    nurseFilter: '',
    urgencyFilter: '',
  },
  sortColumn: null,
  sortDirection: 'asc',
  page: 1,
  pageSize: 20,
  dateRange: {
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
  },
  loading: false,
  searchTerm: '',
};

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
  
  const [state, setState] = useState<MedicationsRouteState>(defaultState);
  const toast = useToast();
  const medicationToast = useMedicationToast();

  // Simple state update function (URL persistence could be added later with Next.js router)
  const updateRouteState = useCallback((updates: Partial<typeof defaultState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // ===============================
  // DATA FETCHING
  // ===============================
  
  /**
   * Main medications query
   */
  const medicationsQuery = useQuery<any, Error>({
    queryKey: medicationKeys.list(state.filters),
    queryFn: async () => {
      const response = await apiActions.medications.getAll({
        page: state.page,
        limit: state.pageSize,
        ...state.filters,
      });
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // Replaced deprecated cacheTime
  });

  /**
   * Medication schedule query
   */
  const scheduleQuery = useQuery<any, Error>({
    queryKey: medicationKeys.schedule(state.dateRange.startDate, state.dateRange.endDate),
    queryFn: async () => {
      const response = await apiActions.medications.getSchedule(
        state.dateRange.startDate,
        state.dateRange.endDate
      );
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (schedule changes frequently)
  });

  /**
   * Medication inventory query
   */
  const inventoryQuery = useQuery<any, Error>({
    queryKey: medicationKeys.inventory(),
    queryFn: async () => {
      const response = await apiActions.medications.getInventory();
      return response;
    },
    staleTime: 10 * 60 * 1000,
  });

  /**
   * Administration logs query
   */
  const administrationQuery = useQuery<{ data: any[] }, Error>({
    queryKey: medicationKeys.administrationLogs(state.dateRange.startDate),
    queryFn: async () => {
      // Use logAdministration or another method since getAdministrationLogs doesn't exist
      return { data: [] }; // Placeholder - would need proper API method
    },
    enabled: state.activeTab === 'administration',
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  /**
   * Medication reminders query
   */
  const remindersQuery = useQuery<any, Error>({
    queryKey: medicationKeys.reminders(new Date().toISOString().split('T')[0]),
    queryFn: async () => {
      const response = await apiActions.medications.getReminders(new Date().toISOString().split('T')[0]);
      return response;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 1 * 60 * 1000,
  });

  // ===============================
  // OPTIMISTIC MUTATIONS
  // ===============================
  
  const createMutation = useOptimisticMedicationCreate({
    onSuccess: (medication: Medication) => {
      medicationToast.showSuccess(`Medication "${medication.name}" created successfully`);
      setState(prev => ({ ...prev, showCreateModal: false }));
    },
    onError: (error: Error) => {
      medicationToast.showError(`Failed to create medication: ${error.message}`);
    },
  });

  const updateMutation = useOptimisticMedicationUpdate({
    onSuccess: (medication: Medication) => {
      medicationToast.showSuccess(`Medication "${medication.name}" updated successfully`);
      setState(prev => ({ ...prev, showEditModal: false, selectedMedication: medication }));
    },
    onError: (error: Error) => {
      medicationToast.showError(`Failed to update medication: ${error.message}`);
    },
  });

  const deleteMutation = useOptimisticMedicationDelete({
    onSuccess: () => {
      medicationToast.showSuccess('Medication deleted successfully');
      setState(prev => ({ ...prev, showDeleteModal: false, selectedMedication: null }));
    },
    onError: (error: Error) => {
      medicationToast.showError(`Failed to delete medication: ${error.message}`);
    },
  });

  const administrationMutation = useOptimisticMedicationAdministration({
    onSuccess: (log: MedicationLog) => {
      medicationToast.showSuccess('Medication administered successfully');
      setState(prev => ({ ...prev, showAdministrationModal: false }));
    },
    onError: (error: Error) => {
      medicationToast.showError(`Failed to log administration: ${error.message}`);
    },
  });

  const inventoryMutation = useOptimisticInventoryUpdate({
    onSuccess: (inventory: InventoryItem) => {
      medicationToast.showSuccess(`Inventory updated successfully`);
      setState(prev => ({ ...prev, showInventoryModal: false }));
    },
    onError: (error: Error) => {
      medicationToast.showError(`Failed to update inventory: ${error.message}`);
    },
  });

  const adverseReactionMutation = useOptimisticAdverseReactionReport({
    onSuccess: (reaction: AdverseReaction) => {
      medicationToast.showWarning('Adverse reaction reported');
      setState(prev => ({ ...prev, showAdverseReactionModal: false }));
    },
    onError: (error: Error) => {
      medicationToast.showError(`Failed to report adverse reaction: ${error.message}`);
    },
  });

  // ===============================
  // COMPUTED VALUES
  // ===============================
  
  /**
   * Processed medications data
   */
  const medicationsData = useMemo(() => {
    const apiResponse = medicationsQuery.data as any;
    const medications: Medication[] = apiResponse?.data?.medications || apiResponse?.medications || [];

    // Apply search filter
    let filtered = medications.filter((medication: Medication) => {
      const searchLower = state.filters.searchTerm.toLowerCase();
      const medAny = medication as any;
      return (
        medication.name.toLowerCase().includes(searchLower) ||
        (medication.genericName && medication.genericName.toLowerCase().includes(searchLower)) ||
        (medAny.brandName && medAny.brandName.toLowerCase().includes(searchLower))
      );
    });

    // Apply other filters
    if (state.filters.categoryFilter) {
      filtered = filtered.filter((m: Medication) => (m as any).category === state.filters.categoryFilter);
    }
    if (state.filters.statusFilter) {
      filtered = filtered.filter((m: Medication) =>
        state.filters.statusFilter === 'active' ? (m as any).isActive : !(m as any).isActive
      );
    }

    // Apply sorting
    if (state.sortColumn) {
      filtered.sort((a: Medication, b: Medication) => {
        const valueA = (a as any)[state.sortColumn!];
        const valueB = (b as any)[state.sortColumn!];

        let comparison = 0;
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          comparison = valueA.localeCompare(valueB);
        } else {
          comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        }

        return state.sortDirection === 'desc' ? -comparison : comparison;
      });
    }

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / state.pageSize);
    const startIndex = (state.page - 1) * state.pageSize;
    const paginatedMedications = filtered.slice(startIndex, startIndex + state.pageSize);

    return {
      all: medications,
      filtered,
      paginated: paginatedMedications,
      totalCount,
      totalPages,
      currentPage: state.page,
      pageSize: state.pageSize,
    };
  }, [medicationsQuery.data, state.filters, state.sortColumn, state.sortDirection, state.page, state.pageSize]);

  /**
   * Schedule data processing
   */
  const scheduleData = useMemo(() => {
    const apiResponse = scheduleQuery.data as any;
    const schedule: any[] = apiResponse?.data || apiResponse?.schedule || [];
    const today = new Date().toISOString().split('T')[0];

    return {
      all: schedule,
      today: schedule.filter((item: any) =>
        item.scheduledTime && item.scheduledTime.startsWith(today)
      ),
      upcoming: schedule.filter((item: any) =>
        item.scheduledTime && item.scheduledTime > new Date().toISOString()
      ),
      overdue: schedule.filter((item: any) =>
        item.scheduledTime && item.scheduledTime < new Date().toISOString() && !item.administered
      ),
    };
  }, [scheduleQuery.data]);

  /**
   * Inventory data with alerts
   */
  const inventoryData = useMemo(() => {
    const apiResponse = inventoryQuery.data as any;
    const inventory: InventoryItem[] = apiResponse?.data || apiResponse?.inventory || [];

    return {
      all: inventory,
      lowStock: inventory.filter((item: InventoryItem) =>
        (item as any).currentStock <= (item as any).minimumStock
      ),
      expiringSoon: inventory.filter((item: InventoryItem) => {
        const expiryDate = new Date((item as any).expiryDate);
        const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        return expiryDate <= thirtyDaysFromNow;
      }),
      expired: inventory.filter((item: InventoryItem) =>
        new Date((item as any).expiryDate) <= new Date()
      ),
    };
  }, [inventoryQuery.data]);

  // ===============================
  // ACTION HANDLERS
  // ===============================
  
  const actions = {
    // Tab management
    setActiveTab: useCallback((tab: MedicationsRouteState['activeTab']) => {
      setState(prev => ({ ...prev, activeTab: tab }));
      updateRouteState({ activeTab: tab });
    }, [updateRouteState]),

    // Medication selection
    selectMedication: useCallback((medication: Medication | null) => {
      setState(prev => ({ ...prev, selectedMedication: medication }));
    }, []),

    selectStudentMedication: useCallback((studentMedication: StudentMedication | null) => {
      setState(prev => ({ ...prev, selectedStudentMedication: studentMedication }));
    }, []),

    // Modal controls
    openCreateModal: useCallback(() => {
      setState(prev => ({ ...prev, showCreateModal: true }));
    }, []),
    
    closeCreateModal: useCallback(() => {
      setState(prev => ({ ...prev, showCreateModal: false }));
    }, []),
    
    openEditModal: useCallback((medication: Medication) => {
      setState(prev => ({ ...prev, selectedMedication: medication, showEditModal: true }));
    }, []),
    
    closeEditModal: useCallback(() => {
      setState(prev => ({ ...prev, showEditModal: false }));
    }, []),
    
    openDeleteModal: useCallback((medication: Medication) => {
      setState(prev => ({ ...prev, selectedMedication: medication, showDeleteModal: true }));
    }, []),
    
    closeDeleteModal: useCallback(() => {
      setState(prev => ({ ...prev, showDeleteModal: false }));
    }, []),

    openAdministrationModal: useCallback((studentMedication: StudentMedication) => {
      setState(prev => ({ 
        ...prev, 
        selectedStudentMedication: studentMedication, 
        showAdministrationModal: true 
      }));
    }, []),
    
    closeAdministrationModal: useCallback(() => {
      setState(prev => ({ ...prev, showAdministrationModal: false }));
    }, []),

    openInventoryModal: useCallback((medication: Medication) => {
      setState(prev => ({ ...prev, selectedMedication: medication, showInventoryModal: true }));
    }, []),
    
    closeInventoryModal: useCallback(() => {
      setState(prev => ({ ...prev, showInventoryModal: false }));
    }, []),

    openAdverseReactionModal: useCallback((studentMedication: StudentMedication) => {
      setState(prev => ({ 
        ...prev, 
        selectedStudentMedication: studentMedication, 
        showAdverseReactionModal: true 
      }));
    }, []),
    
    closeAdverseReactionModal: useCallback(() => {
      setState(prev => ({ ...prev, showAdverseReactionModal: false }));
    }, []),

    // Filters and search
    updateFilters: useCallback((newFilters: Partial<MedicationFilters>) => {
      setState(prev => ({ 
        ...prev, 
        filters: { ...prev.filters, ...newFilters },
        page: 1 
      }));
      updateRouteState({ filters: { ...state.filters, ...newFilters }, page: 1 });
    }, [state.filters, updateRouteState]),

    setSearchTerm: useCallback((searchTerm: string) => {
      setState(prev => ({ 
        ...prev, 
        filters: { ...prev.filters, searchTerm },
        page: 1 
      }));
    }, []),

    // Date range
    setDateRange: useCallback((startDate: string, endDate: string) => {
      setState(prev => ({ ...prev, dateRange: { startDate, endDate } }));
      updateRouteState({ dateRange: { startDate, endDate } });
    }, [updateRouteState]),

    // Sorting
    updateSort: useCallback((column: MedicationSortColumn) => {
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
    refetchData: useCallback(() => {
      medicationsQuery.refetch();
      scheduleQuery.refetch();
      inventoryQuery.refetch();
      remindersQuery.refetch();
    }, [medicationsQuery, scheduleQuery, inventoryQuery, remindersQuery]),
  };

  // ===============================
  // UI STATE
  // ===============================
  
  const ui = {
    // Loading states
    loading: medicationsQuery.isLoading || medicationsQuery.isFetching,
    loadingSchedule: scheduleQuery.isLoading,
    loadingInventory: inventoryQuery.isLoading,
    loadingAdministration: administrationQuery.isLoading,
    
    // Error states
    error: medicationsQuery.error || scheduleQuery.error || inventoryQuery.error,
    
    // Modal states
    showCreateModal: state.showCreateModal,
    showEditModal: state.showEditModal,
    showDeleteModal: state.showDeleteModal,
    showAdministrationModal: state.showAdministrationModal,
    showInventoryModal: state.showInventoryModal,
    showAdverseReactionModal: state.showAdverseReactionModal,
    
    // Tab state
    activeTab: state.activeTab,
    
    // Data states
    hasMedications: (medicationsData.all?.length || 0) > 0,
    hasSchedule: (scheduleData.today?.length || 0) > 0,
    hasOverdue: (scheduleData.overdue?.length || 0) > 0,
    hasLowStock: (inventoryData.lowStock?.length || 0) > 0,
    hasExpiring: (inventoryData.expiringSoon?.length || 0) > 0,
    
    // Alert counts
    alertCounts: {
      overdue: scheduleData.overdue?.length || 0,
      lowStock: inventoryData.lowStock?.length || 0,
      expiring: inventoryData.expiringSoon?.length || 0,
      expired: inventoryData.expired?.length || 0,
    },
    
    // Mutation states
    isCreating: (createMutation as any).isPending || (createMutation as any).isLoading || false,
    isUpdating: (updateMutation as any).isPending || (updateMutation as any).isLoading || false,
    isDeleting: (deleteMutation as any).isPending || (deleteMutation as any).isLoading || false,
    isAdministering: (administrationMutation as any).isPending || (administrationMutation as any).isLoading || false,
    isUpdatingInventory: (inventoryMutation as any).isPending || (inventoryMutation as any).isLoading || false,
  };

  // ===============================
  // RETURN API
  // ===============================
  
  return {
    // Data
    medications: medicationsData,
    schedule: scheduleData,
    inventory: inventoryData,
    administration: administrationQuery.data,
    reminders: remindersQuery.data,
    selectedMedication: state.selectedMedication,
    selectedStudentMedication: state.selectedStudentMedication,
    
    // Actions
    actions,
    
    // UI State
    ui,
    
    // Mutations (for advanced usage)
    mutations: {
      create: createMutation,
      update: updateMutation,
      delete: deleteMutation,
      administer: administrationMutation,
      updateInventory: inventoryMutation,
      reportAdverseReaction: adverseReactionMutation,
    },
    
    // State (for advanced usage)
    state,
    setState,
  };
}
