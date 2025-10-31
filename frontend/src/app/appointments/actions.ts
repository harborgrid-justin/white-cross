/**
 * @fileoverview Appointment Management Server Actions - Next.js v16
 * @module app/appointments/actions
 *
 * Enhanced server actions using Next.js v16 features:
 * - cacheLife for automatic cache expiration
 * - cacheTag for granular cache invalidation
 * - Enhanced fetch with built-in caching
 * - HIPAA-compliant audit logging
 */

'use server';

import { cache } from 'react';
import { cacheTag, cacheLife, revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { serverGet, serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS } from '@/lib/cache/constants';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CreateAppointmentData {
  studentId: string;
  appointmentType: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  reason: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  reminderEnabled?: boolean;
}

export interface UpdateAppointmentData extends Partial<CreateAppointmentData> {}

export interface RescheduleAppointmentData {
  appointmentId: string;
  newDate: string;
  newTime: string;
  reason: string;
}

export interface Appointment {
  id: string;
  studentId: string;
  appointmentType: string;
  scheduledDate: string;
  scheduledTime?: string;
  duration?: number;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  reason?: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// NEXT.JS v16 CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get appointments with caching
 * Uses standard Next.js caching with 5-minute expiration
 */
export const getAppointments = cache(async (filters?: {
  studentId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}): Promise<{ appointments: Appointment[]; total: number }> => {
  try {
    const params = new URLSearchParams();
    if (filters?.studentId) params.append('studentId', filters.studentId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const queryString = params.toString();
    const url = `${API_ENDPOINTS.APPOINTMENTS.BASE}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      next: { 
        revalidate: 300, // 5 minutes
        tags: ['appointments', 'calendar-appointments'] 
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get appointments:', error);
    return { appointments: [], total: 0 };
  }
});

/**
 * Get appointment by ID with caching
 * Uses Next.js v16 cacheLife with 10-minute expiration
 */
export const getAppointment = cache(async (id: string): Promise<Appointment | null> => {
  'use cache';
  cacheLife(600); // 10 minutes
  cacheTag(`appointment-${id}`, 'appointments', CACHE_TAGS.PHI);
  
  try {
    const response = await serverGet<{ data: Appointment }>(
      API_ENDPOINTS.APPOINTMENTS.BY_ID(id),
      undefined,
      {
        next: { tags: [`appointment-${id}`, 'appointments', CACHE_TAGS.PHI] }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get appointment:', error);
    return null;
  }
});

/**
 * Get upcoming appointments with caching
 * Uses Next.js v16 cacheLife with 2-minute expiration for real-time updates
 */
export const getUpcomingAppointments = cache(async (limit = 10): Promise<Appointment[]> => {
  'use cache';
  cacheLife(120); // 2 minutes for upcoming appointments
  cacheTag('upcoming-appointments', 'appointments');
  
  try {
    const response = await fetch(`${API_ENDPOINTS.APPOINTMENTS.BASE}/upcoming?limit=${limit}`, {
      next: { 
        revalidate: 120,
        tags: ['upcoming-appointments', 'appointments'] 
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch upcoming appointments');
    }

    const data = await response.json();
    return data.appointments || [];
  } catch (error) {
    console.error('Failed to get upcoming appointments:', error);
    return [];
  }
});

// ==========================================
// CREATE OPERATIONS
// ==========================================

/**
 * Create new appointment
 * Uses Next.js v16 cache invalidation
 */
export async function createAppointment(data: CreateAppointmentData): Promise<ActionResult<Appointment>> {
  'use server';
  
  try {
    const response = await serverPost<{ data: Appointment }>(
      API_ENDPOINTS.APPOINTMENTS.BASE,
      data,
      {
        cache: 'no-store',
        next: { tags: ['appointments', CACHE_TAGS.PHI] }
      }
    );

    // HIPAA AUDIT LOG - Mandatory for appointment creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_APPOINTMENT,
      resource: 'Appointment',
      resourceId: response.data.id,
      details: `Created appointment for student ${data.studentId}`,
      success: true
    });

    // Next.js v16 cache invalidation
    revalidateTag('appointments');
    revalidateTag('calendar-appointments');
    revalidateTag('upcoming-appointments');
    revalidateTag(`student-appointments-${data.studentId}`);
    revalidatePath('/dashboard/appointments');
    revalidatePath(`/dashboard/students/${data.studentId}`);

    return {
      success: true,
      data: response.data,
      message: 'Appointment created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create appointment';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_APPOINTMENT,
      resource: 'Appointment',
      details: `Failed to create appointment: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Create appointment from form data
 * Form-friendly wrapper for createAppointment
 */
export async function createAppointmentFromForm(formData: FormData): Promise<ActionResult<Appointment>> {
  'use server';
  
  const appointmentData: CreateAppointmentData = {
    studentId: formData.get('studentId') as string,
    appointmentType: formData.get('appointmentType') as string,
    scheduledDate: formData.get('scheduledDate') as string,
    scheduledTime: formData.get('scheduledTime') as string,
    duration: Number(formData.get('duration')) || 30,
    reason: formData.get('reason') as string,
    notes: formData.get('notes') as string || undefined,
    priority: (formData.get('priority') as 'low' | 'medium' | 'high' | 'urgent') || 'medium',
    reminderEnabled: formData.get('reminderEnabled') === 'true',
  };

  const result = await createAppointment(appointmentData);
  
  if (result.success && result.data) {
    redirect(`/dashboard/appointments/${result.data.id}`);
  }
  
  return result;
}

// ==========================================
// UPDATE OPERATIONS
// ==========================================

/**
 * Update appointment details
 * Uses Next.js v16 cache invalidation
 */
export async function updateAppointment(
  appointmentId: string,
  data: UpdateAppointmentData
): Promise<ActionResult<Appointment>> {
  'use server';
  
  try {
    const response = await serverPut<{ data: Appointment }>(
      API_ENDPOINTS.APPOINTMENTS.BY_ID(appointmentId),
      data,
      {
        cache: 'no-store',
        next: { tags: ['appointments', `appointment-${appointmentId}`, CACHE_TAGS.PHI] }
      }
    );

    // HIPAA AUDIT LOG - Mandatory for appointment modification
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_APPOINTMENT,
      resource: 'Appointment',
      resourceId: appointmentId,
      details: 'Appointment updated',
      changes: data,
      success: true
    });

    // Next.js v16 cache invalidation
    revalidateTag('appointments');
    revalidateTag('calendar-appointments');
    revalidateTag(`appointment-${appointmentId}`);
    if (data.studentId) {
      revalidateTag(`student-appointments-${data.studentId}`);
    }
    revalidatePath('/dashboard/appointments');
    revalidatePath(`/dashboard/appointments/${appointmentId}`);

    return {
      success: true,
      data: response.data,
      message: 'Appointment updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update appointment';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_APPOINTMENT,
      resource: 'Appointment',
      resourceId: appointmentId,
      details: `Failed to update appointment: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Reschedule appointment
 * Uses Next.js v16 cache invalidation
 */
export async function rescheduleAppointment(
  data: RescheduleAppointmentData
): Promise<ActionResult<Appointment>> {
  'use server';
  
  try {
    const response = await serverPost<{ data: Appointment }>(
      `${API_ENDPOINTS.APPOINTMENTS.BY_ID(data.appointmentId)}/reschedule`,
      {
        newDate: data.newDate,
        newTime: data.newTime,
        reason: data.reason
      },
      {
        cache: 'no-store',
        next: { tags: ['appointments', `appointment-${data.appointmentId}`, CACHE_TAGS.PHI] }
      }
    );

    // HIPAA AUDIT LOG
    await auditLog({
      action: AUDIT_ACTIONS.RESCHEDULE_APPOINTMENT,
      resource: 'Appointment',
      resourceId: data.appointmentId,
      details: `Rescheduled to ${data.newDate} ${data.newTime}`,
      success: true
    });

    // Next.js v16 cache invalidation
    revalidateTag('appointments');
    revalidateTag('calendar-appointments');
    revalidateTag(`appointment-${data.appointmentId}`);
    revalidatePath('/dashboard/appointments');

    return {
      success: true,
      data: response.data,
      message: 'Appointment rescheduled successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to reschedule appointment';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Cancel appointment
 * Uses Next.js v16 cache invalidation
 */
export async function cancelAppointment(
  appointmentId: string,
  reason: string
): Promise<ActionResult<Appointment>> {
  'use server';
  
  try {
    const response = await serverPost<{ data: Appointment }>(
      `${API_ENDPOINTS.APPOINTMENTS.BY_ID(appointmentId)}/cancel`,
      { reason },
      {
        cache: 'no-store',
        next: { tags: ['appointments', `appointment-${appointmentId}`, CACHE_TAGS.PHI] }
      }
    );

    // HIPAA AUDIT LOG
    await auditLog({
      action: AUDIT_ACTIONS.CANCEL_APPOINTMENT,
      resource: 'Appointment',
      resourceId: appointmentId,
      details: `Cancelled: ${reason}`,
      success: true
    });

    // Next.js v16 cache invalidation
    revalidateTag('appointments');
    revalidateTag('calendar-appointments');
    revalidateTag(`appointment-${appointmentId}`);
    revalidatePath('/dashboard/appointments');

    return {
      success: true,
      data: response.data,
      message: 'Appointment cancelled successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to cancel appointment';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Complete appointment
 * Uses Next.js v16 cache invalidation
 */
export async function completeAppointment(
  appointmentId: string,
  notes?: string
): Promise<ActionResult<Appointment>> {
  'use server';
  
  try {
    const response = await serverPost<{ data: Appointment }>(
      `${API_ENDPOINTS.APPOINTMENTS.BY_ID(appointmentId)}/complete`,
      { notes },
      {
        cache: 'no-store',
        next: { tags: ['appointments', `appointment-${appointmentId}`, CACHE_TAGS.PHI] }
      }
    );

    // HIPAA AUDIT LOG
    await auditLog({
      action: AUDIT_ACTIONS.COMPLETE_APPOINTMENT,
      resource: 'Appointment',
      resourceId: appointmentId,
      details: 'Appointment marked as completed',
      success: true
    });

    // Next.js v16 cache invalidation
    revalidateTag('appointments');
    revalidateTag('calendar-appointments');
    revalidateTag(`appointment-${appointmentId}`);
    revalidatePath('/dashboard/appointments');

    return {
      success: true,
      data: response.data,
      message: 'Appointment completed successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to complete appointment';

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// DELETE OPERATIONS
// ==========================================

/**
 * Delete appointment
 * Uses Next.js v16 cache invalidation
 */
export async function deleteAppointment(appointmentId: string): Promise<ActionResult<void>> {
  'use server';
  
  try {
    await serverDelete(
      API_ENDPOINTS.APPOINTMENTS.BY_ID(appointmentId),
      {
        cache: 'no-store',
        next: { tags: ['appointments', `appointment-${appointmentId}`, CACHE_TAGS.PHI] }
      }
    );

    // HIPAA AUDIT LOG
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_APPOINTMENT,
      resource: 'Appointment',
      resourceId: appointmentId,
      details: 'Appointment deleted',
      success: true
    });

    // Next.js v16 cache invalidation
    revalidateTag('appointments');
    revalidateTag('calendar-appointments');
    revalidateTag(`appointment-${appointmentId}`);
    revalidatePath('/dashboard/appointments');

    return {
      success: true,
      message: 'Appointment deleted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to delete appointment';

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// REMINDER OPERATIONS
// ==========================================

/**
 * Send appointment reminder
 * Uses Next.js v16 enhanced error handling
 */
export async function sendAppointmentReminder(
  appointmentId: string,
  method: 'email' | 'sms' | 'both' = 'email'
): Promise<ActionResult<{ sent: boolean }>> {
  'use server';
  
  try {
    const response = await serverPost<{ data: { sent: boolean } }>(
      `${API_ENDPOINTS.APPOINTMENTS.BY_ID(appointmentId)}/send-reminder`,
      { method },
      {
        cache: 'no-store',
        next: { tags: [`appointment-${appointmentId}`, CACHE_TAGS.PHI] }
      }
    );

    // HIPAA AUDIT LOG
    await auditLog({
      action: AUDIT_ACTIONS.SEND_APPOINTMENT_REMINDER,
      resource: 'Appointment',
      resourceId: appointmentId,
      details: `Reminder sent via ${method}`,
      success: true
    });

    return {
      success: true,
      data: response.data,
      message: 'Reminder sent successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to send reminder';

    // HIPAA AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.SEND_APPOINTMENT_REMINDER,
      resource: 'Appointment',
      resourceId: appointmentId,
      details: `Failed to send reminder: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
