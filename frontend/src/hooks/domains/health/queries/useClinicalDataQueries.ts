/**
 * Clinical Data Query Hooks
 * TanStack Query hooks for fetching vital signs, medications, allergies, and lab results
 */

import { useQuery } from '@tanstack/react-query';
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

// ============================================================================
// VITAL SIGNS QUERIES
// ============================================================================

export const useVitalsByPatient = (patientId: string) => {
  return useQuery({
    queryKey: healthKeys.vitalsByPatient(patientId),
    queryFn: async (): Promise<VitalSigns[]> => {
      // Mock implementation - replace with actual API call
      return [
        {
          id: '1',
          patientId,
          type: 'blood_pressure' as VitalType,
          value: 120,
          unit: 'mmHg',
          recordedAt: '2024-10-21T10:00:00Z',
          recordedBy: 'nurse1',
          notes: 'Normal blood pressure'
        }
      ];
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
      // Mock implementation - replace with actual API call
      return [];
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
      // Mock implementation - replace with actual API call
      return [
        {
          id: '1',
          patientId,
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          route: 'Oral',
          startDate: '2024-01-01',
          status: MedicationStatus.ACTIVE,
          prescribedBy: 'Dr. Smith',
          instructions: 'Take with food',
          refillsRemaining: 5,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];
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
      // Mock implementation - replace with actual API call
      return [
        {
          id: '1',
          patientId,
          allergen: 'Penicillin',
          type: AllergyType.DRUG,
          severity: SeverityLevel.MODERATE,
          reaction: 'Rash and itching',
          verifiedBy: 'Dr. Smith',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];
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
      // Mock implementation - replace with actual API call
      return [
        {
          id: '1',
          patientId,
          testName: 'Complete Blood Count',
          testCode: 'CBC',
          result: 'Normal',
          referenceRange: '4.5-11.0',
          status: 'completed',
          orderedDate: '2024-10-20T00:00:00Z',
          resultDate: '2024-10-21T00:00:00Z',
          orderedBy: 'Dr. Smith',
          labFacility: 'Main Lab',
          isAbnormal: false,
          isCritical: false,
          createdAt: '2024-10-21T00:00:00Z',
          updatedAt: '2024-10-21T00:00:00Z'
        }
      ];
    },
    enabled: !!patientId,
    staleTime: healthCacheConfig.staleTime.medium,
    gcTime: healthCacheConfig.cacheTime.labResults
  });
};
