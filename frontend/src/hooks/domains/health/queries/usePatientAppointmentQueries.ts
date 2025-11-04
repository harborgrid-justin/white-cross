/**
 * Patient and Appointment Query Hooks
 * TanStack Query hooks for fetching patient and appointment data
 */

import { useQuery } from '@tanstack/react-query';
import {
  Patient,
  Appointment,
  PatientFilters,
  AppointmentFilters,
  PatientStatus,
  AppointmentType,
  AppointmentStatus,
  healthKeys,
  healthCacheConfig
} from '../config';

// ============================================================================
// PATIENT QUERIES
// ============================================================================

export const usePatients = (filters?: PatientFilters) => {
  return useQuery({
    queryKey: filters ? healthKeys.patientsByFilters(filters) : healthKeys.patients(),
    queryFn: async (): Promise<Patient[]> => {
      // Mock implementation - replace with actual API call
      return [
        {
          id: '1',
          mrn: 'MRN001',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1985-06-15',
          gender: 'Male',
          phone: '555-0123',
          email: 'john.doe@email.com',
          address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'NY',
            zipCode: '12345',
            country: 'USA'
          },
          emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Spouse',
            phone: '555-0124'
          },
          insuranceInfo: {
            provider: 'HealthCare Plus',
            policyNumber: 'HC123456789',
            subscriberName: 'John Doe',
            effectiveDate: '2024-01-01'
          },
          status: PatientStatus.ACTIVE,
          primaryPhysician: 'Dr. Smith',
          preferredLanguage: 'English',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];
    },
    staleTime: healthCacheConfig.staleTime.medium,
    gcTime: healthCacheConfig.cacheTime.patients
  });
};

export const usePatient = (id: string) => {
  return useQuery({
    queryKey: healthKeys.patient(id),
    queryFn: async (): Promise<Patient> => {
      // Mock implementation - replace with actual API call
      return {
        id,
        mrn: 'MRN001',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1985-06-15',
        gender: 'Male',
        phone: '555-0123',
        email: 'john.doe@email.com',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'NY',
          zipCode: '12345',
          country: 'USA'
        },
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '555-0124'
        },
        insuranceInfo: {
          provider: 'HealthCare Plus',
          policyNumber: 'HC123456789',
          subscriberName: 'John Doe',
          effectiveDate: '2024-01-01'
        },
        status: PatientStatus.ACTIVE,
        primaryPhysician: 'Dr. Smith',
        preferredLanguage: 'English',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };
    },
    enabled: !!id,
    staleTime: healthCacheConfig.staleTime.medium,
    gcTime: healthCacheConfig.cacheTime.patients
  });
};

export const usePatientSearch = (query: string) => {
  return useQuery({
    queryKey: healthKeys.patientSearch(query),
    queryFn: async (): Promise<Patient[]> => {
      // Mock implementation - replace with actual API call
      return [];
    },
    enabled: query.length >= 2,
    staleTime: healthCacheConfig.staleTime.short,
    gcTime: healthCacheConfig.cacheTime.patients
  });
};

// ============================================================================
// APPOINTMENT QUERIES
// ============================================================================

export const useAppointments = (filters?: AppointmentFilters) => {
  return useQuery({
    queryKey: filters ? healthKeys.appointmentsByFilters(filters) : healthKeys.appointments(),
    queryFn: async (): Promise<Appointment[]> => {
      // Mock implementation - replace with actual API call
      return [
        {
          id: '1',
          patientId: '1',
          providerId: '1',
          facilityId: '1',
          type: AppointmentType.CONSULTATION,
          status: AppointmentStatus.SCHEDULED,
          scheduledDateTime: '2024-10-22T10:00:00Z',
          duration: 30,
          reason: 'Annual checkup',
          createdAt: '2024-10-21T00:00:00Z',
          updatedAt: '2024-10-21T00:00:00Z'
        }
      ];
    },
    staleTime: healthCacheConfig.staleTime.short,
    gcTime: healthCacheConfig.cacheTime.appointments,
    refetchInterval: healthCacheConfig.refetchInterval.appointments
  });
};

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: healthKeys.appointment(id),
    queryFn: async (): Promise<Appointment> => {
      // Mock implementation - replace with actual API call
      return {
        id,
        patientId: '1',
        providerId: '1',
        facilityId: '1',
        type: AppointmentType.CONSULTATION,
        status: AppointmentStatus.SCHEDULED,
        scheduledDateTime: '2024-10-22T10:00:00Z',
        duration: 30,
        reason: 'Annual checkup',
        createdAt: '2024-10-21T00:00:00Z',
        updatedAt: '2024-10-21T00:00:00Z'
      };
    },
    enabled: !!id,
    staleTime: healthCacheConfig.staleTime.short,
    gcTime: healthCacheConfig.cacheTime.appointments
  });
};

export const useAppointmentsByPatient = (patientId: string) => {
  return useQuery({
    queryKey: healthKeys.appointmentsByPatient(patientId),
    queryFn: async (): Promise<Appointment[]> => {
      // Mock implementation - replace with actual API call
      return [];
    },
    enabled: !!patientId,
    staleTime: healthCacheConfig.staleTime.short,
    gcTime: healthCacheConfig.cacheTime.appointments
  });
};

export const useAppointmentsByProvider = (providerId: string) => {
  return useQuery({
    queryKey: healthKeys.appointmentsByProvider(providerId),
    queryFn: async (): Promise<Appointment[]> => {
      // Mock implementation - replace with actual API call
      return [];
    },
    enabled: !!providerId,
    staleTime: healthCacheConfig.staleTime.short,
    gcTime: healthCacheConfig.cacheTime.appointments
  });
};

export const useAppointmentsToday = () => {
  return useQuery({
    queryKey: healthKeys.appointmentsToday(),
    queryFn: async (): Promise<Appointment[]> => {
      // Mock implementation - replace with actual API call
      return [];
    },
    staleTime: healthCacheConfig.staleTime.short,
    gcTime: healthCacheConfig.cacheTime.appointments,
    refetchInterval: healthCacheConfig.refetchInterval.appointments
  });
};
