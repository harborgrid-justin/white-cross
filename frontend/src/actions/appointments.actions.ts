/**
 * @fileoverview Server Actions for Appointment Management
 * @module actions/appointments
 *
 * Next.js Server Actions for appointment CRUD operations.
 * HIPAA-compliant with comprehensive audit logging.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { apiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import type { ActionResult } from './students.actions';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

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
// READ OPERATIONS
// ==========================================

/**
 * Get appointments with optional filters
 */
export async function getAppointmentsAction(filters?: {
  studentId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}): Promise<ActionResult<{ appointments: Appointment[]; total: number }>> {
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
    
    const response = await apiClient.get<{ appointments: Appointment[]; total: number }>(url);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get appointments failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch appointments',
    };
  }
}

// ==========================================
// CREATE OPERATIONS
// ==========================================

/**
 * Create new appointment
 */
export async function createAppointment(data: CreateAppointmentData): Promise<ActionResult<Appointment>> {
  try {
    const response = await apiClient.post<Appointment>(
      API_ENDPOINTS.APPOINTMENTS.BASE,
      data
    );

    // Audit logging
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_APPOINTMENT,
      resource: 'Appointment',
      resourceId: response.data.id,
      details: `Created appointment for student ${data.studentId}`,
      success: true
    });

    revalidateTag('appointments');
    revalidateTag(`student-appointments-${data.studentId}`);
    revalidatePath('/appointments', 'page');
    revalidatePath(`/students/${data.studentId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Appointment created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create appointment';

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
 * Create multiple appointments (bulk scheduling)
 */
export async function createAppointmentsBulk(
  appointments: CreateAppointmentData[]
): Promise<ActionResult<Appointment[]>> {
  try {
    const response = await apiClient.post<Appointment[]>(
      `${API_ENDPOINTS.APPOINTMENTS.BASE}/bulk`,
      { appointments }
    );

    revalidateTag('appointments');
    revalidatePath('/appointments', 'page');

    return {
      success: true,
      data: response.data,
      message: `Successfully created ${response.data.length} appointments`
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create appointments';
    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// UPDATE OPERATIONS
// ==========================================

/**
 * Update appointment details
 */
export async function updateAppointment(
  appointmentId: string,
  data: UpdateAppointmentData
): Promise<ActionResult<Appointment>> {
  try {
    const response = await apiClient.put<Appointment>(
      API_ENDPOINTS.APPOINTMENTS.BY_ID(appointmentId),
      data
    );

    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_APPOINTMENT,
      resource: 'Appointment',
      resourceId: appointmentId,
      details: 'Appointment updated',
      success: true
    });

    revalidateTag('appointments');
    revalidateTag(`appointment-${appointmentId}`);
    if (data.studentId) {
      revalidateTag(`student-appointments-${data.studentId}`);
    }
    revalidatePath('/appointments', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Appointment updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update appointment';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Reschedule appointment
 */
export async function rescheduleAppointment(
  data: RescheduleAppointmentData
): Promise<ActionResult<Appointment>> {
  try {
    const response = await apiClient.post<Appointment>(
      `${API_ENDPOINTS.APPOINTMENTS.BY_ID(data.appointmentId)}/reschedule`,
      {
        newDate: data.newDate,
        newTime: data.newTime,
        reason: data.reason
      }
    );

    await auditLog({
      action: AUDIT_ACTIONS.RESCHEDULE_APPOINTMENT,
      resource: 'Appointment',
      resourceId: data.appointmentId,
      details: `Rescheduled to ${data.newDate} ${data.newTime}`,
      success: true
    });

    revalidateTag('appointments');
    revalidateTag(`appointment-${data.appointmentId}`);
    revalidatePath('/appointments', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Appointment rescheduled successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to reschedule appointment';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Cancel appointment
 */
export async function cancelAppointment(
  appointmentId: string,
  reason: string
): Promise<ActionResult<Appointment>> {
  try {
    const response = await apiClient.post<Appointment>(
      `${API_ENDPOINTS.APPOINTMENTS.BY_ID(appointmentId)}/cancel`,
      { reason }
    );

    await auditLog({
      action: AUDIT_ACTIONS.CANCEL_APPOINTMENT,
      resource: 'Appointment',
      resourceId: appointmentId,
      details: `Cancelled: ${reason}`,
      success: true
    });

    revalidateTag('appointments');
    revalidateTag(`appointment-${appointmentId}`);
    revalidatePath('/appointments', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Appointment cancelled successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to cancel appointment';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Mark appointment as completed
 */
export async function completeAppointment(
  appointmentId: string,
  notes?: string
): Promise<ActionResult<Appointment>> {
  try {
    const response = await apiClient.post<Appointment>(
      `${API_ENDPOINTS.APPOINTMENTS.BY_ID(appointmentId)}/complete`,
      { notes }
    );

    await auditLog({
      action: AUDIT_ACTIONS.COMPLETE_APPOINTMENT,
      resource: 'Appointment',
      resourceId: appointmentId,
      details: 'Appointment marked as completed',
      success: true
    });

    revalidateTag('appointments');
    revalidateTag(`appointment-${appointmentId}`);
    revalidatePath('/appointments', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Appointment completed successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to complete appointment';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Mark appointment as no-show
 */
export async function markAppointmentNoShow(
  appointmentId: string,
  notes?: string
): Promise<ActionResult<Appointment>> {
  try {
    const response = await apiClient.post<Appointment>(
      `${API_ENDPOINTS.APPOINTMENTS.BY_ID(appointmentId)}/no-show`,
      { notes }
    );

    await auditLog({
      action: AUDIT_ACTIONS.NO_SHOW_APPOINTMENT,
      resource: 'Appointment',
      resourceId: appointmentId,
      details: 'Appointment marked as no-show',
      success: true
    });

    revalidateTag('appointments');
    revalidateTag(`appointment-${appointmentId}`);
    revalidatePath('/appointments', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Appointment marked as no-show'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to mark appointment as no-show';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Confirm appointment
 * HIPAA: Audit logs appointment confirmation
 */
export async function confirmAppointment(
  appointmentId: string
): Promise<ActionResult<Appointment>> {
  try {
    const response = await apiClient.post<Appointment>(
      `${API_ENDPOINTS.APPOINTMENTS.BY_ID(appointmentId)}/confirm`,
      {}
    );

    await auditLog({
      action: AUDIT_ACTIONS.CONFIRM_APPOINTMENT,
      resource: 'Appointment',
      resourceId: appointmentId,
      details: 'Appointment confirmed',
      success: true
    });

    revalidateTag('appointments');
    revalidateTag(`appointment-${appointmentId}`);
    revalidatePath('/appointments', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Appointment confirmed successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to confirm appointment';

    await auditLog({
      action: AUDIT_ACTIONS.CONFIRM_APPOINTMENT,
      resource: 'Appointment',
      resourceId: appointmentId,
      details: `Failed to confirm appointment: ${errorMessage}`,
      success: false,
      errorMessage
    });

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
 */
export async function deleteAppointment(appointmentId: string): Promise<ActionResult<void>> {
  try {
    await apiClient.delete(API_ENDPOINTS.APPOINTMENTS.BY_ID(appointmentId));

    await auditLog({
      action: AUDIT_ACTIONS.DELETE_APPOINTMENT,
      resource: 'Appointment',
      resourceId: appointmentId,
      details: 'Appointment deleted',
      success: true
    });

    revalidateTag('appointments');
    revalidateTag(`appointment-${appointmentId}`);
    revalidatePath('/appointments', 'page');

    return {
      success: true,
      message: 'Appointment deleted successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete appointment';
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
 * HIPAA: Audit logs reminder notifications for appointment communications tracking
 */
export async function sendAppointmentReminder(
  appointmentId: string,
  method: 'email' | 'sms' | 'both' = 'email'
): Promise<ActionResult<{ sent: boolean }>> {
  try {
    const response = await apiClient.post<{ sent: boolean }>(
      `${API_ENDPOINTS.APPOINTMENTS.BY_ID(appointmentId)}/send-reminder`,
      { method }
    );

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
    const errorMessage = error instanceof Error ? error.message : 'Failed to send reminder';

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

// ==========================================
// REPORT OPERATIONS
// ==========================================

/**
 * Generate appointment report
 */
export async function generateAppointmentReport(
  filters: {
    startDate: string;
    endDate: string;
    studentId?: string;
    appointmentType?: string;
    status?: string;
    format?: 'pdf' | 'csv' | 'excel';
  }
): Promise<ActionResult<{ reportUrl: string }>> {
  try {
    const response = await apiClient.post<{ reportUrl: string }>(
      '/appointments/reports',
      filters
    );

    return {
      success: true,
      data: response.data,
      message: 'Report generated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate report';
    return {
      success: false,
      error: errorMessage
    };
  }
}
