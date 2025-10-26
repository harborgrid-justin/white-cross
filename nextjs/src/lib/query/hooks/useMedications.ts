/**
 * TanStack Query Hooks for Medications Domain
 *
 * Provides React Query hooks for:
 * - Fetching medications and prescriptions
 * - Recording medication administration
 * - Managing medication schedules
 *
 * @module lib/query/hooks/useMedications
 * @version 1.0.0
 */

'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS } from '@/lib/api-client';
import toast from 'react-hot-toast';

// ==========================================
// TYPES
// ==========================================

export interface Medication {
  id: string;
  studentId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  instructions?: string;
  isActive: boolean;
}

export interface MedicationAdministration {
  id: string;
  medicationId: string;
  studentId: string;
  administeredBy: string;
  administeredAt: string;
  dosageGiven: string;
  notes?: string;
}

export interface MedicationsQueryParams {
  studentId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface AdministerMedicationData {
  medicationId: string;
  studentId: string;
  dosageGiven: string;
  notes?: string;
}

// ==========================================
// QUERY KEYS
// ==========================================

export const medicationsKeys = {
  all: ['medications'] as const,
  lists: () => [...medicationsKeys.all, 'list'] as const,
  list: (params?: MedicationsQueryParams) => [...medicationsKeys.lists(), params] as const,
  details: () => [...medicationsKeys.all, 'detail'] as const,
  detail: (id: string) => [...medicationsKeys.details(), id] as const,
  byStudent: (studentId: string) => [...medicationsKeys.all, 'student', studentId] as const,
  administrations: (medicationId: string) => [...medicationsKeys.detail(medicationId), 'administrations'] as const,
};

// ==========================================
// QUERY HOOKS
// ==========================================

/**
 * Fetch medications with filtering
 */
export function useMedications(
  params?: MedicationsQueryParams,
  options?: Omit<UseQueryOptions<{ medications: Medication[]; pagination: any }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: medicationsKeys.list(params),
    queryFn: async () => {
      const queryParams: Record<string, string | number | boolean> = {};

      if (params?.studentId) queryParams.studentId = params.studentId;
      if (params?.isActive !== undefined) queryParams.isActive = params.isActive;
      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;

      return apiClient.get<{ medications: Medication[]; pagination: any }>(
        API_ENDPOINTS.medications,
        queryParams
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    meta: {
      cacheTags: ['medications'],
      containsPHI: true,
      auditLog: true,
      errorMessage: 'Failed to load medications',
    },
    ...options,
  });
}

/**
 * Fetch single medication
 */
export function useMedication(
  id: string,
  options?: Omit<UseQueryOptions<Medication>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: medicationsKeys.detail(id),
    queryFn: async () => {
      return apiClient.get<Medication>(API_ENDPOINTS.medicationById(id));
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    meta: {
      cacheTags: ['medications', `medication-${id}`],
      containsPHI: true,
      auditLog: true,
      errorMessage: 'Failed to load medication',
    },
    ...options,
  });
}

// ==========================================
// MUTATION HOOKS
// ==========================================

/**
 * Record medication administration
 */
export function useAdministerMedication(
  options?: UseMutationOptions<MedicationAdministration, Error, AdministerMedicationData>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AdministerMedicationData) => {
      return apiClient.post<MedicationAdministration>(
        `/medications/${data.medicationId}/administer`,
        data
      );
    },
    onSuccess: (administration, variables, context) => {
      // Invalidate medication administrations
      queryClient.invalidateQueries({
        queryKey: medicationsKeys.administrations(variables.medicationId),
      });

      // Invalidate medications list
      queryClient.invalidateQueries({ queryKey: medicationsKeys.lists() });

      toast.success('Medication administered successfully');
      options?.onSuccess?.(administration, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error('Failed to record medication administration');
      options?.onError?.(error, variables, context);
    },
    meta: {
      affectsPHI: true,
      auditAction: 'ADMINISTER_MEDICATION',
      successMessage: 'Medication administered successfully',
    },
    ...options,
  });
}

/**
 * Create new medication record
 */
export function useCreateMedication(
  options?: UseMutationOptions<Medication, Error, Partial<Medication>>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Medication>) => {
      return apiClient.post<Medication>(API_ENDPOINTS.medications, data);
    },
    onSuccess: (newMedication, variables, context) => {
      queryClient.invalidateQueries({ queryKey: medicationsKeys.lists() });
      queryClient.setQueryData(
        medicationsKeys.detail(newMedication.id),
        newMedication
      );

      toast.success('Medication added successfully');
      options?.onSuccess?.(newMedication, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error('Failed to add medication');
      options?.onError?.(error, variables, context);
    },
    meta: {
      affectsPHI: true,
      auditAction: 'CREATE_MEDICATION',
    },
    ...options,
  });
}

/**
 * Update medication record
 */
export function useUpdateMedication(
  options?: UseMutationOptions<Medication, Error, Partial<Medication> & { id: string }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Medication> & { id: string }) => {
      return apiClient.put<Medication>(API_ENDPOINTS.medicationById(id), data);
    },
    onSuccess: (updatedMedication, variables, context) => {
      queryClient.setQueryData(
        medicationsKeys.detail(updatedMedication.id),
        updatedMedication
      );
      queryClient.invalidateQueries({ queryKey: medicationsKeys.lists() });

      toast.success('Medication updated successfully');
      options?.onSuccess?.(updatedMedication, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error('Failed to update medication');
      options?.onError?.(error, variables, context);
    },
    meta: {
      affectsPHI: true,
      auditAction: 'UPDATE_MEDICATION',
    },
    ...options,
  });
}
