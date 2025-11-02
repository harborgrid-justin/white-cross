/**
 * Appointments Actions
 * Server actions for appointment management with React cache() and proper data fetching
 *
 * Next.js 16 Best Practices:
 * - Use React cache() for request memoization
 * - Server-side data fetching with proper cache options
 * - TypeScript types for all data
 * - Proper error handling
 */

'use server';

import { cache } from 'react';
import { revalidatePath, revalidateTag } from 'next/cache';
import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/server/api-client';
import { API_ENDPOINTS } from '@/constants/api';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';
import type {
  Appointment,
  AppointmentFilters,
  CreateAppointmentData,
  UpdateAppointmentData,
} from '@/types/appointments';
import type { ApiResponse } from '@/types/api';

/**
 * Get appointments with optional filters
 * Uses React cache() for automatic request memoization
 */
export const getAppointments = cache(async (filters?: AppointmentFilters): Promise<{
  appointments: Appointment[];
  total: number;
}> => {
  try {
    const response = await serverGet<ApiResponse<{ data: Appointment[]; total: number }>>(
      API_ENDPOINTS.APPOINTMENTS?.BASE || '/appointments',
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL?.PHI_STANDARD || 300,
          tags: [CACHE_TAGS?.APPOINTMENTS || 'appointments', CACHE_TAGS?.PHI || 'phi'],
        },
      }
    );

    return {
      appointments: response?.data?.data || [],
      total: response?.data?.total || 0,
    };
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return { appointments: [], total: 0 };
  }
});

/**
 * Get a single appointment by ID
 * Uses React cache() for automatic request memoization
 */
export const getAppointment = cache(async (id: string): Promise<Appointment | null> => {
  try {
    const response = await serverGet<ApiResponse<Appointment>>(
      API_ENDPOINTS.APPOINTMENTS?.BY_ID?.(id) || `/appointments/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL?.PHI_STANDARD || 300,
          tags: [`appointment-${id}`, CACHE_TAGS?.APPOINTMENTS || 'appointments', CACHE_TAGS?.PHI || 'phi'],
        },
      }
    );

    return response?.data || null;
  } catch (error) {
    console.error(`Failed to fetch appointment ${id}:`, error);
    return null;
  }
});

/**
 * Create a new appointment
 */
export async function createAppointment(data: CreateAppointmentData): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  try {
    const response = await serverPost<ApiResponse<Appointment>>(
      API_ENDPOINTS.APPOINTMENTS?.BASE || '/appointments',
      data,
      {
        cache: 'no-store',
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create appointment');
    }

    // Cache invalidation
    revalidateTag(CACHE_TAGS?.APPOINTMENTS || 'appointments');
    revalidatePath('/appointments');
    revalidatePath('/dashboard');

    return {
      success: true,
      id: response.data.id,
    };
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create appointment',
    };
  }
}

/**
 * Update an existing appointment
 */
export async function updateAppointment(
  id: string,
  data: UpdateAppointmentData
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await serverPut<ApiResponse<Appointment>>(
      API_ENDPOINTS.APPOINTMENTS?.BY_ID?.(id) || `/appointments/${id}`,
      data,
      {
        cache: 'no-store',
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to update appointment');
    }

    // Cache invalidation
    revalidateTag(CACHE_TAGS?.APPOINTMENTS || 'appointments');
    revalidateTag(`appointment-${id}`);
    revalidatePath('/appointments');
    revalidatePath(`/appointments/${id}`);

    return { success: true };
  } catch (error) {
    console.error(`Failed to update appointment ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update appointment',
    };
  }
}

/**
 * Delete an appointment
 */
export async function deleteAppointment(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await serverDelete<ApiResponse<void>>(
      API_ENDPOINTS.APPOINTMENTS?.BY_ID?.(id) || `/appointments/${id}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete appointment');
    }

    // Cache invalidation
    revalidateTag(CACHE_TAGS?.APPOINTMENTS || 'appointments');
    revalidateTag(`appointment-${id}`);
    revalidatePath('/appointments');

    return { success: true };
  } catch (error) {
    console.error(`Failed to delete appointment ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete appointment',
    };
  }
}

/**
 * Schedule a new appointment (alias for createAppointment)
 */
export async function scheduleAppointment(data: CreateAppointmentData): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  return createAppointment(data);
}

/**
 * Reschedule an existing appointment (alias for updateAppointment)
 */
export async function rescheduleAppointment(
  id: string,
  data: UpdateAppointmentData
): Promise<{
  success: boolean;
  error?: string;
}> {
  return updateAppointment(id, data);
}
