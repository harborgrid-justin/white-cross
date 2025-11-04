/**
 * @fileoverview useMedications Hook - Medication Data Management
 * @module app/(dashboard)/medications/_components/hooks/useMedications
 *
 * @description
 * Custom React hook for managing medication data fetching, state management,
 * and real-time updates. Handles loading states, error handling, and automatic
 * data refresh for due and overdue medications.
 *
 * **Healthcare Features:**
 * - Automatic polling for due medications
 * - HIPAA-compliant data handling
 * - Error recovery with fallback states
 * - Optimized data fetching with React hooks patterns
 *
 * @since 1.0.0
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getMedications,
  getDueMedications,
  getOverdueMedications,
  type MedicationFilters as ServerMedicationFilters
} from '@/lib/actions/medications.actions';

// Type definitions
export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  type: 'prescription' | 'over_the_counter' | 'supplement' | 'emergency' | 'inhaler' | 'epipen' | 'insulin' | 'controlled_substance';
  status: 'active' | 'discontinued' | 'expired' | 'on_hold' | 'completed' | 'cancelled';
  strength: string;
  administrationRoute: string;
  frequency: string;
  studentId: string;
  lastAdministered?: string;
  nextDue?: string;
  isControlled: boolean;
  warnings?: string[];
}

export interface MedicationFilters {
  status?: string;
  type?: string;
  studentId?: string;
  searchQuery?: string;
}

export interface UseMedicationsOptions {
  initialFilters?: MedicationFilters;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseMedicationsReturn {
  medications: Medication[];
  dueMedications: Medication[];
  overdueMedications: Medication[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing medication data
 *
 * @param options - Configuration options for the hook
 * @returns Medication data and control functions
 *
 * @example
 * ```tsx
 * const { medications, dueMedications, isLoading, refetch } = useMedications({
 *   initialFilters: { status: 'active' },
 *   autoRefresh: true,
 *   refreshInterval: 30000
 * });
 * ```
 */
export function useMedications(
  options: UseMedicationsOptions = {}
): UseMedicationsReturn {
  const {
    initialFilters = {},
    autoRefresh = false,
    refreshInterval = 60000 // 1 minute default
  } = options;

  const [medications, setMedications] = useState<Medication[]>([]);
  const [dueMedications, setDueMedications] = useState<Medication[]>([]);
  const [overdueMedications, setOverdueMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMedications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build filters for server action
      const medicationFilters: ServerMedicationFilters = {
        status: initialFilters.status,
        type: initialFilters.type,
        studentId: initialFilters.studentId,
        searchQuery: initialFilters.searchQuery,
      };

      // Fetch all data in parallel
      const [medicationsData, dueData, overdueData] = await Promise.all([
        getMedications(medicationFilters),
        getDueMedications(),
        getOverdueMedications()
      ]);

      setMedications(medicationsData);
      setDueMedications(dueData);
      setOverdueMedications(overdueData);
    } catch (err) {
      console.error('Failed to fetch medications:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch medications'));

      // Fallback to empty arrays on error
      setMedications([]);
      setDueMedications([]);
      setOverdueMedications([]);
    } finally {
      setIsLoading(false);
    }
  }, [initialFilters]);

  // Initial fetch
  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  // Auto-refresh for critical medication alerts
  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      fetchMedications();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, fetchMedications]);

  return {
    medications,
    dueMedications,
    overdueMedications,
    isLoading,
    error,
    refetch: fetchMedications
  };
}
