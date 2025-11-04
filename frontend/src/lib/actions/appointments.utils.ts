/**
 * Appointments Utility Functions
 * Convenience functions and aliases for appointment operations
 */

'use server';

import { createAppointment, updateAppointment } from './appointments.crud';
import type { CreateAppointmentData, UpdateAppointmentData } from './appointments.types';

/**
 * Schedule a new appointment
 * Alias for createAppointment with more semantic naming
 *
 * @param data - Appointment creation data
 * @returns Promise with success status, appointment ID, and optional error
 */
export async function scheduleAppointment(data: CreateAppointmentData): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  return createAppointment(data);
}

/**
 * Reschedule an existing appointment
 * Alias for updateAppointment with more semantic naming
 *
 * @param id - Appointment ID to reschedule
 * @param data - Updated appointment data
 * @returns Promise with success status and optional error
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
