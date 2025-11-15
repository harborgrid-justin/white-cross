/**
 * Appointments CRUD Operations
 * Create, update, and delete operations with cache invalidation
 *
 * Features:
 * - Full CRUD operations for appointments
 * - HIPAA audit logging for all PHI modifications
 * - Automatic cache invalidation with revalidateTag/revalidatePath
 * - Comprehensive error handling
 * - Type-safe return values
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { serverPost, serverPut, serverDelete } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import { CACHE_TAGS } from '@/lib/cache/constants';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { getServerAuth } from '@/identity-access/lib/session';
import { headers } from 'next/headers';
import type { Appointment, CreateAppointmentData, UpdateAppointmentData } from './appointments.types';

/**
 * Create a new appointment
 * HIPAA: Logs all appointment creation with audit trail
 *
 * @param data - Appointment creation data
 * @returns Promise with success status, appointment ID, and optional error
 */
export async function createAppointment(data: CreateAppointmentData): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  const session = await getServerAuth();
  const headersList = await headers();

  try {
    // serverPost returns ApiResponse<T>, so response itself is ApiResponse
    const response = await serverPost<Appointment>(
      API_ENDPOINTS.APPOINTMENTS?.BASE || '/appointments',
      data,
      {
        cache: 'no-store',
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create appointment');
    }

    // HIPAA Audit Log: Track appointment creation
    await auditLog({
      userId: session?.user?.id,
      action: AUDIT_ACTIONS.CREATE_APPOINTMENT,
      resource: 'appointment',
      resourceId: response.data.id,
      details: `Created appointment for student ${data.studentId}`,
      ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
      userAgent: headersList.get('user-agent') || undefined,
      success: true,
      changes: { created: data },
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS?.APPOINTMENTS || 'appointments', 'default');
    revalidatePath('/appointments');
    revalidatePath('/dashboard');

    // response.data has type Appointment
    return {
      success: true,
      id: response.data.id,
    };
  } catch (error) {
    // HIPAA Audit Log: Track failed creation
    await auditLog({
      userId: session?.user?.id,
      action: AUDIT_ACTIONS.CREATE_APPOINTMENT,
      resource: 'appointment',
      details: `Failed to create appointment for student ${data.studentId}`,
      ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
      userAgent: headersList.get('user-agent') || undefined,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });

    console.error('Failed to create appointment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create appointment',
    };
  }
}

/**
 * Update an existing appointment
 * HIPAA: Logs all appointment modifications with change tracking
 *
 * @param id - Appointment ID to update
 * @param data - Updated appointment data
 * @returns Promise with success status and optional error
 */
export async function updateAppointment(
  id: string,
  data: UpdateAppointmentData
): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getServerAuth();
  const headersList = await headers();

  try {
    // serverPut returns ApiResponse<T>, so response itself is ApiResponse
    const response = await serverPut<Appointment>(
      API_ENDPOINTS.APPOINTMENTS?.BY_ID?.(id) || `/appointments/${id}`,
      data,
      {
        cache: 'no-store',
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to update appointment');
    }

    // HIPAA Audit Log: Track appointment update
    await auditLog({
      userId: session?.user?.id,
      action: AUDIT_ACTIONS.UPDATE_APPOINTMENT,
      resource: 'appointment',
      resourceId: id,
      details: 'Updated appointment details',
      ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
      userAgent: headersList.get('user-agent') || undefined,
      success: true,
      changes: { updated: data },
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS?.APPOINTMENTS || 'appointments', 'default');
    revalidateTag(`appointment-${id}`, 'default');
    revalidatePath('/appointments');
    revalidatePath(`/appointments/${id}`);

    return { success: true };
  } catch (error) {
    // HIPAA Audit Log: Track failed update
    await auditLog({
      userId: session?.user?.id,
      action: AUDIT_ACTIONS.UPDATE_APPOINTMENT,
      resource: 'appointment',
      resourceId: id,
      details: 'Failed to update appointment',
      ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
      userAgent: headersList.get('user-agent') || undefined,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });

    console.error(`Failed to update appointment ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update appointment',
    };
  }
}

/**
 * Delete an appointment
 * HIPAA: Logs all appointment deletions for compliance
 *
 * @param id - Appointment ID to delete
 * @returns Promise with success status and optional error
 */
export async function deleteAppointment(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getServerAuth();
  const headersList = await headers();

  try {
    // serverDelete returns ApiResponse<T>, so response itself is ApiResponse
    const response = await serverDelete<void>(
      API_ENDPOINTS.APPOINTMENTS?.BY_ID?.(id) || `/appointments/${id}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete appointment');
    }

    // HIPAA Audit Log: Track appointment deletion
    await auditLog({
      userId: session?.user?.id,
      action: AUDIT_ACTIONS.DELETE_APPOINTMENT,
      resource: 'appointment',
      resourceId: id,
      details: 'Deleted appointment',
      ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
      userAgent: headersList.get('user-agent') || undefined,
      success: true,
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS?.APPOINTMENTS || 'appointments', 'default');
    revalidateTag(`appointment-${id}`, 'default');
    revalidatePath('/appointments');

    return { success: true };
  } catch (error) {
    // HIPAA Audit Log: Track failed deletion
    await auditLog({
      userId: session?.user?.id,
      action: AUDIT_ACTIONS.DELETE_APPOINTMENT,
      resource: 'appointment',
      resourceId: id,
      details: 'Failed to delete appointment',
      ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined,
      userAgent: headersList.get('user-agent') || undefined,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });

    console.error(`Failed to delete appointment ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete appointment',
    };
  }
}
