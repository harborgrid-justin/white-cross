/**
 * Appointments Cache Operations
 * Cached GET operations with React cache() for appointment data fetching
 *
 * Features:
 * - React cache() for request memoization
 * - Next.js cache integration with proper TTL
 * - PHI-compliant cache tags
 * - HIPAA audit logging for all PHI access
 * - Comprehensive error handling
 */

'use server';

import { cache } from 'react';
import { serverGet } from '@/lib/server/api-client';
import { API_ENDPOINTS } from '@/constants/api';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import type { Appointment, AppointmentFilters } from './appointments.types';

/**
 * Get appointments with optional filters
 * Uses React cache() for automatic request memoization
 * HIPAA: Logs all appointment list access
 *
 * @param filters - Optional filters for appointment list
 * @returns Promise with appointments array and total count
 */
export const getAppointments = cache(async (filters?: AppointmentFilters): Promise<{
  appointments: Appointment[];
  total: number;
}> => {
  const session = await auth();
  const headersList = await headers();

  try {
    // Build query string from filters
    const queryString = filters
      ? '?' + new URLSearchParams(
          Object.entries(filters).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';

    // serverGet returns ApiResponse<T>, so response itself is ApiResponse
    const response = await serverGet<{ appointments: Appointment[]; total: number }>(
      `${API_ENDPOINTS.APPOINTMENTS?.BASE || '/appointments'}${queryString}`,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL?.PHI_STANDARD || 300,
          tags: [CACHE_TAGS?.APPOINTMENTS || 'appointments', CACHE_TAGS?.PHI || 'phi'],
        },
      }
    );

    // HIPAA Audit Log: Track appointment list access
    await auditLog({
      userId: session?.user?.id,
      action: AUDIT_ACTIONS.LIST_APPOINTMENTS,
      resource: 'appointments',
      details: filters ? `Filters: ${JSON.stringify(filters)}` : 'No filters',
      ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
      userAgent: headersList.get('user-agent') || undefined,
      success: response?.success || false,
    });

    // response.data has type { appointments: Appointment[]; total: number }
    const result = response?.data;
    return {
      appointments: result?.appointments || [],
      total: result?.total || 0,
    };
  } catch (error) {
    // HIPAA Audit Log: Track failed access
    await auditLog({
      userId: session?.user?.id,
      action: AUDIT_ACTIONS.LIST_APPOINTMENTS,
      resource: 'appointments',
      details: filters ? `Filters: ${JSON.stringify(filters)}` : 'No filters',
      ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
      userAgent: headersList.get('user-agent') || undefined,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });

    console.error('Failed to fetch appointments:', error);
    return { appointments: [], total: 0 };
  }
});

/**
 * Get a single appointment by ID
 * Uses React cache() for automatic request memoization
 * HIPAA: Logs all individual appointment access
 *
 * @param id - Appointment ID
 * @returns Promise with appointment data or null if not found
 */
export const getAppointment = cache(async (id: string): Promise<Appointment | null> => {
  const session = await auth();
  const headersList = await headers();

  try {
    // serverGet returns ApiResponse<T>, so response itself is ApiResponse
    const response = await serverGet<Appointment>(
      API_ENDPOINTS.APPOINTMENTS?.BY_ID?.(id) || `/appointments/${id}`,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL?.PHI_STANDARD || 300,
          tags: [`appointment-${id}`, CACHE_TAGS?.APPOINTMENTS || 'appointments', CACHE_TAGS?.PHI || 'phi'],
        },
      }
    );

    // HIPAA Audit Log: Track appointment access
    await auditLog({
      userId: session?.user?.id,
      action: AUDIT_ACTIONS.VIEW_APPOINTMENT,
      resource: 'appointment',
      resourceId: id,
      ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
      userAgent: headersList.get('user-agent') || undefined,
      success: response?.success || false,
    });

    // response.data has type Appointment
    if (!response?.success || !response?.data) {
      return null;
    }
    return response.data;
  } catch (error) {
    // HIPAA Audit Log: Track failed access
    await auditLog({
      userId: session?.user?.id,
      action: AUDIT_ACTIONS.VIEW_APPOINTMENT,
      resource: 'appointment',
      resourceId: id,
      ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
      userAgent: headersList.get('user-agent') || undefined,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });

    console.error(`Failed to fetch appointment ${id}:`, error);
    return null;
  }
});
