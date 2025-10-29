/**
 * TanStack Query Hooks for Appointments Domain
 *
 * Provides React Query hooks for:
 * - Fetching appointments with filtering
 * - Creating, updating, and canceling appointments
 * - Checking appointment availability
 *
 * @module lib/query/hooks/useAppointments
 * @version 1.0.0
 */

'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS } from '@/lib/api-client';
import toast from 'react-hot-toast';

// ==========================================
// TYPES
// ==========================================

export interface Appointment {
  id: string;
  studentId: string;
  appointmentType: string;
  scheduledTime: string;
  duration: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentsQueryParams {
  page?: number;
  limit?: number;
  studentId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface CreateAppointmentData {
  studentId: string;
  appointmentType: string;
  scheduledTime: string;
  duration: number;
  notes?: string;
}

export interface UpdateAppointmentData extends Partial<CreateAppointmentData> {
  id: string;
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
}

// ==========================================
// QUERY KEYS
// ==========================================

export const appointmentsKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentsKeys.all, 'list'] as const,
  list: (params?: AppointmentsQueryParams) => [...appointmentsKeys.lists(), params] as const,
  details: () => [...appointmentsKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentsKeys.details(), id] as const,
  byStudent: (studentId: string) => [...appointmentsKeys.all, 'student', studentId] as const,
};

// ==========================================
// QUERY HOOKS
// ==========================================

/**
 * Fetch appointments with filtering
 */
export function useAppointments(
  params?: AppointmentsQueryParams,
  options?: Omit<UseQueryOptions<{ appointments: Appointment[]; pagination: any }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: appointmentsKeys.list(params),
    queryFn: async () => {
      const queryParams: Record<string, string | number | boolean> = {};

      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.studentId) queryParams.studentId = params.studentId;
      if (params?.startDate) queryParams.startDate = params.startDate;
      if (params?.endDate) queryParams.endDate = params.endDate;
      if (params?.status) queryParams.status = params.status;

      return apiClient.get<{ appointments: Appointment[]; pagination: any }>(
        API_ENDPOINTS.appointments,
        queryParams
      );
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    meta: {
      cacheTags: ['appointments'],
      errorMessage: 'Failed to load appointments',
    },
    ...options,
  });
}

/**
 * Fetch single appointment
 */
export function useAppointment(
  id: string,
  options?: Omit<UseQueryOptions<Appointment>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: appointmentsKeys.detail(id),
    queryFn: async () => {
      return apiClient.get<Appointment>(API_ENDPOINTS.appointmentById(id));
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    meta: {
      cacheTags: ['appointments', `appointment-${id}`],
      containsPHI: true,
      auditLog: true,
      errorMessage: 'Failed to load appointment',
    },
    ...options,
  });
}

// ==========================================
// MUTATION HOOKS
// ==========================================

/**
 * Create new appointment
 */
export function useCreateAppointment(
  options?: UseMutationOptions<Appointment, Error, CreateAppointmentData>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAppointmentData) => {
      return apiClient.post<Appointment>(API_ENDPOINTS.appointments, data);
    },
    onSuccess: (newAppointment, variables, context) => {
      // Invalidate appointments lists
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.lists() });

      // Add to cache
      queryClient.setQueryData(
        appointmentsKeys.detail(newAppointment.id),
        newAppointment
      );

      toast.success('Appointment scheduled successfully');
      options?.onSuccess?.(newAppointment, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error('Failed to schedule appointment');
      options?.onError?.(error, variables, context);
    },
    meta: {
      affectsPHI: true,
      auditAction: 'CREATE_APPOINTMENT',
      successMessage: 'Appointment scheduled successfully',
    },
    ...options,
  });
}

/**
 * Update appointment
 */
export function useUpdateAppointment(
  options?: UseMutationOptions<Appointment, Error, UpdateAppointmentData>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateAppointmentData) => {
      return apiClient.put<Appointment>(API_ENDPOINTS.appointmentById(id), data);
    },
    onSuccess: (updatedAppointment, variables, context) => {
      queryClient.setQueryData(
        appointmentsKeys.detail(updatedAppointment.id),
        updatedAppointment
      );
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.lists() });

      toast.success('Appointment updated successfully');
      options?.onSuccess?.(updatedAppointment, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error('Failed to update appointment');
      options?.onError?.(error, variables, context);
    },
    meta: {
      affectsPHI: true,
      auditAction: 'UPDATE_APPOINTMENT',
    },
    ...options,
  });
}

/**
 * Cancel appointment
 */
export function useCancelAppointment(
  options?: UseMutationOptions<void, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.put(API_ENDPOINTS.appointmentById(id), {
        status: 'CANCELLED',
      });
    },
    onSuccess: (data, id, context) => {
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.detail(id) });

      toast.success('Appointment cancelled successfully');
      options?.onSuccess?.(data, id, context);
    },
    onError: (error, variables, context) => {
      toast.error('Failed to cancel appointment');
      options?.onError?.(error, variables, context);
    },
    meta: {
      affectsPHI: true,
      auditAction: 'CANCEL_APPOINTMENT',
    },
    ...options,
  });
}
