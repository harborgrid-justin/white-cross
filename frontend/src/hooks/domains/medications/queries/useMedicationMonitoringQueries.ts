/**
 * Medication Monitoring & Inventory Query Hooks
 *
 * Query hooks for medication inventory, alerts, adverse reactions, and statistics.
 * Safety-critical monitoring with appropriate cache and refetch strategies.
 *
 * @module hooks/domains/medications/queries/useMedicationMonitoringQueries
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { medicationsApi } from '@/services/api';
import { useApiError } from '../../../shared/useApiError';
import { useHealthcareCompliance } from '../../../shared/useHealthcareCompliance';
import {
  medicationQueryKeys,
  MEDICATION_CACHE_CONFIG,
} from '../config';
import type {
  MedicationInventory,
  AdverseReaction,
  MedicationAlert,
  MedicationStatsResponse,
} from '@/types/api';

/**
 * Get medication inventory
 */
export function useMedicationInventory(
  filters?: any,
  options?: Omit<UseQueryOptions<{ inventory: MedicationInventory[] }>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();

  return useQuery({
    queryKey: medicationQueryKeys.inventory.all(filters),
    queryFn: async () => {
      try {
        return await medicationsApi.getInventory(filters);
      } catch (error: any) {
        throw handleApiError(error, 'fetch_medication_inventory');
      }
    },
    staleTime: MEDICATION_CACHE_CONFIG.inventory.staleTime,
    gcTime: MEDICATION_CACHE_CONFIG.inventory.gcTime,
    ...options,
  });
}

/**
 * Get adverse reactions
 */
export function useAdverseReactions(
  filters?: any,
  options?: Omit<UseQueryOptions<{ reactions: AdverseReaction[] }>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useQuery({
    queryKey: medicationQueryKeys.reactions.all(filters),
    queryFn: async () => {
      try {
        await logCompliantAccess(
          'view_adverse_reactions',
          'medication',
          'critical',
          { filters }
        );

        return await medicationsApi.getAdverseReactions(filters);
      } catch (error: any) {
        throw handleApiError(error, 'fetch_adverse_reactions');
      }
    },
    staleTime: MEDICATION_CACHE_CONFIG.adverseReactions.staleTime,
    gcTime: MEDICATION_CACHE_CONFIG.adverseReactions.gcTime,
    ...options,
  });
}

/**
 * Get medication alerts
 */
export function useMedicationAlerts(
  options?: Omit<UseQueryOptions<{ alerts: MedicationAlert[] }>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  return useQuery({
    queryKey: medicationQueryKeys.alerts.all(),
    queryFn: async () => {
      try {
        await logCompliantAccess(
          'view_medication_alerts',
          'medication',
          'confidential'
        );

        return await medicationsApi.getAlerts();
      } catch (error: any) {
        throw handleApiError(error, 'fetch_medication_alerts');
      }
    },
    staleTime: MEDICATION_CACHE_CONFIG.alerts.staleTime,
    gcTime: MEDICATION_CACHE_CONFIG.alerts.gcTime,
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    ...options,
  });
}

/**
 * Get medication statistics
 */
export function useMedicationStatistics(
  filters?: any,
  options?: Omit<UseQueryOptions<MedicationStatsResponse>, 'queryKey' | 'queryFn'>
) {
  const { handleApiError } = useApiError();

  return useQuery({
    queryKey: medicationQueryKeys.statistics.overview(filters),
    queryFn: async () => {
      try {
        return await medicationsApi.getStatistics(filters);
      } catch (error: any) {
        throw handleApiError(error, 'fetch_medication_statistics');
      }
    },
    staleTime: MEDICATION_CACHE_CONFIG.statistics.staleTime,
    gcTime: MEDICATION_CACHE_CONFIG.statistics.gcTime,
    ...options,
  });
}
