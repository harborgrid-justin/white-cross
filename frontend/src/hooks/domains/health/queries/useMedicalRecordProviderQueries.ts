/**
 * Medical Record, Provider, and Facility Query Hooks
 * TanStack Query hooks for fetching medical records, providers, and facilities
 */

import { useQuery } from '@tanstack/react-query';
import {
  MedicalRecord,
  Provider,
  Facility,
  MedicalRecordFilters,
  healthKeys,
  healthCacheConfig
} from '../config';

// ============================================================================
// MEDICAL RECORD QUERIES
// ============================================================================

export const useMedicalRecords = (filters?: MedicalRecordFilters) => {
  return useQuery({
    queryKey: filters ? healthKeys.medicalRecordsByFilters(filters) : healthKeys.medicalRecords(),
    queryFn: async (): Promise<MedicalRecord[]> => {
      // Mock implementation - replace with actual API call
      return [
        {
          id: '1',
          patientId: '1',
          providerId: '1',
          visitDate: '2024-10-21T00:00:00Z',
          visitType: 'routine',
          chiefComplaint: 'Annual physical examination',
          historyOfPresentIllness: 'Patient reports feeling well overall',
          assessment: 'Normal examination findings',
          plan: 'Continue current medications, return in 1 year',
          vitals: [],
          medications: [],
          allergies: [],
          diagnoses: [],
          procedures: [],
          labResults: [],
          notes: 'Patient is in good health',
          createdAt: '2024-10-21T00:00:00Z',
          updatedAt: '2024-10-21T00:00:00Z'
        }
      ];
    },
    staleTime: healthCacheConfig.staleTime.long,
    gcTime: healthCacheConfig.cacheTime.medicalRecords
  });
};

export const useMedicalRecord = (id: string) => {
  return useQuery({
    queryKey: healthKeys.medicalRecord(id),
    queryFn: async (): Promise<MedicalRecord> => {
      // Mock implementation - replace with actual API call
      return {
        id,
        patientId: '1',
        providerId: '1',
        visitDate: '2024-10-21T00:00:00Z',
        visitType: 'routine',
        chiefComplaint: 'Annual physical examination',
        historyOfPresentIllness: 'Patient reports feeling well overall',
        assessment: 'Normal examination findings',
        plan: 'Continue current medications, return in 1 year',
        vitals: [],
        medications: [],
        allergies: [],
        diagnoses: [],
        procedures: [],
        labResults: [],
        notes: 'Patient is in good health',
        createdAt: '2024-10-21T00:00:00Z',
        updatedAt: '2024-10-21T00:00:00Z'
      };
    },
    enabled: !!id,
    staleTime: healthCacheConfig.staleTime.long,
    gcTime: healthCacheConfig.cacheTime.medicalRecords
  });
};

export const useMedicalRecordsByPatient = (patientId: string) => {
  return useQuery({
    queryKey: healthKeys.medicalRecordsByPatient(patientId),
    queryFn: async (): Promise<MedicalRecord[]> => {
      // Mock implementation - replace with actual API call
      return [];
    },
    enabled: !!patientId,
    staleTime: healthCacheConfig.staleTime.long,
    gcTime: healthCacheConfig.cacheTime.medicalRecords
  });
};

// ============================================================================
// PROVIDER QUERIES
// ============================================================================

export const useProviders = () => {
  return useQuery({
    queryKey: healthKeys.providers(),
    queryFn: async (): Promise<Provider[]> => {
      // Mock implementation - replace with actual API call
      return [
        {
          id: '1',
          firstName: 'Dr. Sarah',
          lastName: 'Smith',
          title: 'MD',
          specialty: 'Internal Medicine',
          licenseNumber: 'MD123456',
          email: 'dr.smith@hospital.com',
          phone: '555-0100',
          department: 'Internal Medicine',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];
    },
    staleTime: healthCacheConfig.staleTime.veryLong,
    gcTime: healthCacheConfig.cacheTime.providers
  });
};

export const useProvider = (id: string) => {
  return useQuery({
    queryKey: healthKeys.provider(id),
    queryFn: async (): Promise<Provider> => {
      // Mock implementation - replace with actual API call
      return {
        id,
        firstName: 'Dr. Sarah',
        lastName: 'Smith',
        title: 'MD',
        specialty: 'Internal Medicine',
        licenseNumber: 'MD123456',
        email: 'dr.smith@hospital.com',
        phone: '555-0100',
        department: 'Internal Medicine',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };
    },
    enabled: !!id,
    staleTime: healthCacheConfig.staleTime.veryLong,
    gcTime: healthCacheConfig.cacheTime.providers
  });
};

export const useProvidersByDepartment = (department: string) => {
  return useQuery({
    queryKey: healthKeys.providersByDepartment(department),
    queryFn: async (): Promise<Provider[]> => {
      // Mock implementation - replace with actual API call
      return [];
    },
    enabled: !!department,
    staleTime: healthCacheConfig.staleTime.veryLong,
    gcTime: healthCacheConfig.cacheTime.providers
  });
};

// ============================================================================
// FACILITY QUERIES
// ============================================================================

export const useFacilities = () => {
  return useQuery({
    queryKey: healthKeys.facilities(),
    queryFn: async (): Promise<Facility[]> => {
      // Mock implementation - replace with actual API call
      return [
        {
          id: '1',
          name: 'Main Hospital',
          type: 'Hospital',
          address: {
            street: '123 Hospital Ave',
            city: 'Medical City',
            state: 'NY',
            zipCode: '12345',
            country: 'USA'
          },
          phone: '555-0200',
          email: 'info@hospital.com',
          capacity: 500,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];
    },
    staleTime: healthCacheConfig.staleTime.veryLong,
    gcTime: healthCacheConfig.cacheTime.facilities
  });
};

export const useFacility = (id: string) => {
  return useQuery({
    queryKey: healthKeys.facility(id),
    queryFn: async (): Promise<Facility> => {
      // Mock implementation - replace with actual API call
      return {
        id,
        name: 'Main Hospital',
        type: 'Hospital',
        address: {
          street: '123 Hospital Ave',
          city: 'Medical City',
          state: 'NY',
          zipCode: '12345',
          country: 'USA'
        },
        phone: '555-0200',
        email: 'info@hospital.com',
        capacity: 500,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };
    },
    enabled: !!id,
    staleTime: healthCacheConfig.staleTime.veryLong,
    gcTime: healthCacheConfig.cacheTime.facilities
  });
};
