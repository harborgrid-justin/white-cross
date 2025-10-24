/**
 * useMedicationsData Hook
 * Purpose: Custom hook for medication data management with Redux integration
 * Features: Data fetching, filtering, pagination, real-time updates
 *
 * This hook provides a unified interface for accessing and managing medication
 * data throughout the application, with automatic Redux state synchronization.
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../stores/reduxStore';
import {
  medicationsThunks,
  medicationsSelectors,
  selectActiveMedications,
  selectActiveMedicationsByStudent,
  selectExpiringMedications,
  selectMedicationsRequiringConsent
} from '../store/medicationsSlice';
import { MedicationFilters } from '../types';
import { StudentMedication } from '../../../types/student.types';

/**
 * Hook options interface
 */
export interface UseMedicationsDataOptions {
  /**
   * Filter medications by student ID
   */
  studentId?: string;

  /**
   * Only fetch active medications
   */
  activeOnly?: boolean;

  /**
   * Auto-fetch data on mount
   */
  autoFetch?: boolean;

  /**
   * Polling interval in milliseconds (0 to disable)
   */
  pollingInterval?: number;

  /**
   * Additional filters to apply
   */
  filters?: Partial<MedicationFilters>;
}

/**
 * Hook return value interface
 */
export interface UseMedicationsDataReturn {
  // Data
  medications: StudentMedication[];
  allMedications: StudentMedication[];
  activeMedications: StudentMedication[];
  expiringMedications: StudentMedication[];
  medicationsRequiringConsent: StudentMedication[];

  // State
  isLoading: boolean;
  error: string | null;

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  fetchMedications: (filters?: Partial<MedicationFilters>) => Promise<void>;
  fetchMedicationById: (id: string) => Promise<void>;
  createMedication: (data: any) => Promise<void>;
  updateMedication: (id: string, data: any) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  refetch: () => Promise<void>;

  // Utilities
  getMedicationsByStudent: (studentId: string) => StudentMedication[];
  getActiveMedicationsByStudent: (studentId: string) => StudentMedication[];
  getExpiringMedications: (days?: number) => StudentMedication[];
}

/**
 * Custom hook for medication data management
 *
 * Provides comprehensive access to medication data with automatic state management,
 * real-time updates, and convenient utility functions.
 *
 * @param options - Configuration options for the hook
 * @returns Medication data and management functions
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { medications, isLoading, fetchMedications } = useMedicationsData();
 *
 * // Filter by student
 * const { medications } = useMedicationsData({ studentId: '123', activeOnly: true });
 *
 * // With auto-polling
 * const { medications } = useMedicationsData({
 *   autoFetch: true,
 *   pollingInterval: 30000 // Poll every 30 seconds
 * });
 * ```
 */
export const useMedicationsData = (
  options: UseMedicationsDataOptions = {}
): UseMedicationsDataReturn => {
  const {
    studentId,
    activeOnly = false,
    autoFetch = true,
    pollingInterval = 0,
    filters = {}
  } = options;

  const dispatch = useDispatch<AppDispatch>();

  // Select data from Redux store
  const medicationsState = useSelector((state: RootState) => state.medications);
  const allMedications = useSelector((state: RootState) =>
    medicationsSelectors.selectAll(state)
  );
  const activeMedications = useSelector((state: RootState) =>
    selectActiveMedications(state)
  );

  // Build filters
  const combinedFilters = useMemo(() => {
    return {
      ...filters,
      studentId,
      isActive: activeOnly ? true : filters.isActive,
    };
  }, [filters, studentId, activeOnly]);

  /**
   * Fetch medications with current filters
   */
  const fetchMedications = useCallback(async (additionalFilters?: Partial<MedicationFilters>) => {
    const finalFilters = { ...combinedFilters, ...additionalFilters };
    await dispatch(medicationsThunks.fetchAll(finalFilters)).unwrap();
  }, [dispatch, combinedFilters]);

  /**
   * Fetch single medication by ID
   */
  const fetchMedicationById = useCallback(async (id: string) => {
    await dispatch(medicationsThunks.fetchById(id)).unwrap();
  }, [dispatch]);

  /**
   * Create new medication
   */
  const createMedication = useCallback(async (data: any) => {
    await dispatch(medicationsThunks.create(data)).unwrap();
    // Refetch to ensure consistency
    await fetchMedications();
  }, [dispatch, fetchMedications]);

  /**
   * Update existing medication
   */
  const updateMedication = useCallback(async (id: string, data: any) => {
    await dispatch(medicationsThunks.update({ id, data })).unwrap();
    // Refetch to ensure consistency
    await fetchMedications();
  }, [dispatch, fetchMedications]);

  /**
   * Delete medication
   */
  const deleteMedication = useCallback(async (id: string) => {
    await dispatch(medicationsThunks.delete(id)).unwrap();
    // Refetch to ensure consistency
    await fetchMedications();
  }, [dispatch, fetchMedications]);

  /**
   * Refetch with current filters
   */
  const refetch = useCallback(async () => {
    await fetchMedications();
  }, [fetchMedications]);

  /**
   * Get medications for specific student
   */
  const getMedicationsByStudent = useCallback((studentIdParam: string): StudentMedication[] => {
    return allMedications.filter(med => med.studentId === studentIdParam);
  }, [allMedications]);

  /**
   * Get active medications for specific student
   */
  const getActiveMedicationsByStudent = useCallback((studentIdParam: string): StudentMedication[] => {
    return useSelector((state: RootState) =>
      selectActiveMedicationsByStudent(state, studentIdParam)
    );
  }, []);

  /**
   * Get medications expiring within specified days
   */
  const getExpiringMedications = useCallback((days: number = 30): StudentMedication[] => {
    return useSelector((state: RootState) =>
      selectExpiringMedications(state, days)
    );
  }, []);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchMedications();
    }
  }, [autoFetch, fetchMedications]);

  // Set up polling if interval is specified
  useEffect(() => {
    if (pollingInterval > 0) {
      const intervalId = setInterval(() => {
        fetchMedications();
      }, pollingInterval);

      return () => clearInterval(intervalId);
    }
  }, [pollingInterval, fetchMedications]);

  // Filter medications based on current options
  const filteredMedications = useMemo(() => {
    let result = allMedications;

    // Filter by student if specified
    if (studentId) {
      result = result.filter(med => med.studentId === studentId);
    }

    // Filter by active status if specified
    if (activeOnly) {
      result = result.filter(med => med.isActive);
    }

    return result;
  }, [allMedications, studentId, activeOnly]);

  // Get medications requiring consent
  const medicationsRequiringConsent = useSelector((state: RootState) =>
    selectMedicationsRequiringConsent(state)
  );

  // Get expiring medications (default 30 days)
  const expiringMedications = useSelector((state: RootState) =>
    selectExpiringMedications(state, 30)
  );

  return {
    // Data
    medications: filteredMedications,
    allMedications,
    activeMedications,
    expiringMedications,
    medicationsRequiringConsent,

    // State
    isLoading: medicationsState.loading,
    error: medicationsState.error,

    // Pagination
    pagination: {
      page: medicationsState.pagination?.page || 1,
      limit: medicationsState.pagination?.limit || 20,
      total: medicationsState.pagination?.total || 0,
      totalPages: medicationsState.pagination?.totalPages || 0,
    },

    // Actions
    fetchMedications,
    fetchMedicationById,
    createMedication,
    updateMedication,
    deleteMedication,
    refetch,

    // Utilities
    getMedicationsByStudent,
    getActiveMedicationsByStudent,
    getExpiringMedications,
  };
};

/**
 * Default export for convenience
 */
export default useMedicationsData;
