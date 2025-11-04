/**
 * Clinical Alert and Analytics Query Hooks
 * TanStack Query hooks for fetching clinical alerts and health analytics data
 */

import { useQuery } from '@tanstack/react-query';
import {
  ClinicalAlert,
  HealthMetrics,
  healthKeys,
  healthCacheConfig
} from '../config';

// ============================================================================
// CLINICAL ALERT QUERIES
// ============================================================================

export const useClinicalAlertsByPatient = (patientId: string) => {
  return useQuery({
    queryKey: healthKeys.clinicalAlertsByPatient(patientId),
    queryFn: async (): Promise<ClinicalAlert[]> => {
      // Mock implementation - replace with actual API call
      return [];
    },
    enabled: !!patientId,
    staleTime: healthCacheConfig.staleTime.short,
    gcTime: healthCacheConfig.cacheTime.clinicalAlerts,
    refetchInterval: healthCacheConfig.refetchInterval.clinicalAlerts
  });
};

export const useActiveClinicalAlerts = () => {
  return useQuery({
    queryKey: healthKeys.activeClinicalAlerts(),
    queryFn: async (): Promise<ClinicalAlert[]> => {
      // Mock implementation - replace with actual API call
      return [];
    },
    staleTime: healthCacheConfig.staleTime.short,
    gcTime: healthCacheConfig.cacheTime.clinicalAlerts,
    refetchInterval: healthCacheConfig.refetchInterval.clinicalAlerts
  });
};

export const useCriticalAlerts = () => {
  return useQuery({
    queryKey: healthKeys.criticalAlerts(),
    queryFn: async (): Promise<ClinicalAlert[]> => {
      // Mock implementation - replace with actual API call
      return [];
    },
    staleTime: healthCacheConfig.staleTime.short,
    gcTime: healthCacheConfig.cacheTime.clinicalAlerts,
    refetchInterval: healthCacheConfig.refetchInterval.clinicalAlerts
  });
};

// ============================================================================
// ANALYTICS QUERIES
// ============================================================================

export const useHealthMetrics = () => {
  return useQuery({
    queryKey: healthKeys.metrics(),
    queryFn: async (): Promise<HealthMetrics> => {
      // Mock implementation - replace with actual API call
      return {
        totalPatients: 1250,
        activePatients: 1180,
        appointmentsToday: 45,
        criticalAlerts: 3,
        avgAppointmentDuration: 32,
        patientSatisfactionScore: 4.6,
        noShowRate: 0.08,
        departmentUtilization: {
          'Internal Medicine': 0.85,
          'Cardiology': 0.92,
          'Emergency': 0.78
        },
        providerWorkload: {
          'Dr. Smith': 0.88,
          'Dr. Johnson': 0.91,
          'Dr. Williams': 0.79
        }
      };
    },
    staleTime: healthCacheConfig.staleTime.medium,
    gcTime: healthCacheConfig.cacheTime.metrics,
    refetchInterval: healthCacheConfig.refetchInterval.metrics
  });
};

export const usePatientAnalytics = () => {
  return useQuery({
    queryKey: healthKeys.patientAnalytics(),
    queryFn: async () => {
      // Mock implementation - replace with actual API call
      return {
        totalPatients: 1250,
        newPatients: 45,
        activePatients: 1180,
        patientsByAge: {
          '0-18': 125,
          '19-35': 280,
          '36-50': 325,
          '51-65': 310,
          '65+': 210
        },
        patientsByGender: {
          'Male': 580,
          'Female': 650,
          'Other': 20
        }
      };
    },
    staleTime: healthCacheConfig.staleTime.long,
    gcTime: healthCacheConfig.cacheTime.metrics
  });
};

export const useAppointmentAnalytics = () => {
  return useQuery({
    queryKey: healthKeys.appointmentAnalytics(),
    queryFn: async () => {
      // Mock implementation - replace with actual API call
      return {
        totalAppointments: 450,
        completedAppointments: 380,
        cancelledAppointments: 35,
        noShows: 35,
        averageDuration: 32,
        appointmentsByType: {
          'consultation': 180,
          'follow_up': 150,
          'procedure': 80,
          'diagnostic': 40
        }
      };
    },
    staleTime: healthCacheConfig.staleTime.long,
    gcTime: healthCacheConfig.cacheTime.metrics
  });
};

export const useProviderAnalytics = () => {
  return useQuery({
    queryKey: healthKeys.providerAnalytics(),
    queryFn: async () => {
      // Mock implementation - replace with actual API call
      return {
        totalProviders: 25,
        activeProviders: 23,
        averagePatientLoad: 47,
        providerUtilization: 0.86,
        providersByDepartment: {
          'Internal Medicine': 8,
          'Cardiology': 5,
          'Emergency': 6,
          'Surgery': 4,
          'Pediatrics': 2
        }
      };
    },
    staleTime: healthCacheConfig.staleTime.long,
    gcTime: healthCacheConfig.cacheTime.metrics
  });
};
