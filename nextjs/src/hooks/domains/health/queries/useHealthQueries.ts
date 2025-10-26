/**
 * Health Management Query Hooks
 * TanStack Query hooks for fetching healthcare data
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { 
  Patient, 
  Appointment, 
  MedicalRecord, 
  Provider, 
  Facility,
  VitalSigns,
  Medication,
  Allergy,
  LabResult,
  ClinicalAlert,
  HealthMetrics,
  PatientFilters,
  AppointmentFilters,
  MedicalRecordFilters,
  VitalType,
  PatientStatus,
  AppointmentType,
  AppointmentStatus,
  MedicationStatus,
  AllergyType,
  SeverityLevel,
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
