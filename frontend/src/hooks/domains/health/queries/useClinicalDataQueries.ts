/**
 * Clinical Data Query Hooks
 * TanStack Query hooks for fetching vital signs, medications, allergies, and lab results
 */

import { useQuery } from '@tanstack/react-query';
import { serverGet } from '@/lib/api/server';
import {
  VitalSigns,
  Medication,
  Allergy,
  LabResult,
  VitalType,
  MedicationStatus,
  AllergyType,
  SeverityLevel,
  healthKeys,
  healthCacheConfig
} from '../config';
import {
  VITAL_SIGNS_ENDPOINTS,
  MEDICATIONS_ENDPOINTS,
  ALLERGIES_ENDPOINTS
} from '@/constants/api/health';

// ============================================================================
// VITAL SIGNS QUERIES
// ============================================================================

export const useVitalsByPatient = (patientId: string) => {
  return useQuery({
    queryKey: healthKeys.vitalsByPatient(patientId),
    queryFn: async (): Promise<VitalSigns[]> => {
      const data = await serverGet<VitalSigns[]>(
        VITAL_SIGNS_ENDPOINTS.BY_STUDENT(patientId),
        undefined,
        {
          cache: 'force-cache',
          next: {
            revalidate: healthCacheConfig.staleTime.short,
            tags: [`vitals-${patientId}`]
          }
        }
      );
      return data || [];
    },
    enabled: !!patientId,
    staleTime: healthCacheConfig.staleTime.short,
    gcTime: healthCacheConfig.cacheTime.vitals,
    refetchInterval: healthCacheConfig.refetchInterval.vitals
  });
};

export const useVitalsByType = (patientId: string, type: VitalType) => {
  return useQuery({
    queryKey: healthKeys.vitalsByType(patientId, type),
    queryFn: async (): Promise<VitalSigns[]> => {
      const data = await serverGet<VitalSigns[]>(
        `${VITAL_SIGNS_ENDPOINTS.BY_STUDENT(patientId)}?type=${type}`,
        undefined,
        {
          cache: 'force-cache',
          next: {
            revalidate: healthCacheConfig.staleTime.short,
            tags: [`vitals-${patientId}-${type}`]
          }
        }
      );
      return data || [];
    },
    enabled: !!patientId && !!type,
    staleTime: healthCacheConfig.staleTime.short,
    gcTime: healthCacheConfig.cacheTime.vitals
  });
};

// ============================================================================
// MEDICATION QUERIES
// ============================================================================

export const useMedicationsByPatient = (patientId: string) => {
  return useQuery({
    queryKey: healthKeys.medicationsByPatient(patientId),
    queryFn: async (): Promise<Medication[]> => {
      const data = await serverGet<Medication[]>(
        MEDICATIONS_ENDPOINTS.BY_STUDENT(patientId),
        undefined,
        {
          cache: 'force-cache',
          next: {
            revalidate: healthCacheConfig.staleTime.medium,
            tags: [`medications-${patientId}`]
          }
        }
      );
      return data || [];
    },
    enabled: !!patientId,
    staleTime: healthCacheConfig.staleTime.medium,
    gcTime: healthCacheConfig.cacheTime.medications
  });
};

// ============================================================================
// ALLERGY QUERIES
// ============================================================================

export const useAllergiesByPatient = (patientId: string) => {
  return useQuery({
    queryKey: healthKeys.allergiesByPatient(patientId),
    queryFn: async (): Promise<Allergy[]> => {
      const data = await serverGet<Allergy[]>(
        ALLERGIES_ENDPOINTS.BY_STUDENT(patientId),
        undefined,
        {
          cache: 'force-cache',
          next: {
            revalidate: healthCacheConfig.staleTime.long,
            tags: [`allergies-${patientId}`]
          }
        }
      );
      return data || [];
    },
    enabled: !!patientId,
    staleTime: healthCacheConfig.staleTime.long,
    gcTime: healthCacheConfig.cacheTime.allergies
  });
};

// ============================================================================
// LAB RESULT QUERIES
// ============================================================================

export const useLabResultsByPatient = (patientId: string) => {
  return useQuery({
    queryKey: healthKeys.labResultsByPatient(patientId),
    queryFn: async (): Promise<LabResult[]> => {
      // TODO: Update endpoint when lab results API is implemented
      const data = await serverGet<LabResult[]>(
        `/api/v1/students/${patientId}/lab-results`,
        undefined,
        {
          cache: 'force-cache',
          next: {
            revalidate: healthCacheConfig.staleTime.medium,
            tags: [`lab-results-${patientId}`]
          }
        }
      );
      return data || [];
    },
    enabled: !!patientId,
    staleTime: healthCacheConfig.staleTime.medium,
    gcTime: healthCacheConfig.cacheTime.labResults
  });
};
