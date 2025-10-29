/**
 * @fileoverview Appointment Conflict Detection Utility
 * @module lib/appointments/conflicts
 *
 * Provides conflict detection and available slot finding for appointments.
 * Prevents double-booking of students, nurses, and resources.
 */

import { apiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';

// ==========================================
// TYPES
// ==========================================

export interface Appointment {
  id: string;
  studentId: string;
  nurseId?: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // minutes
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
}

export interface ConflictCheck {
  appointmentId?: string; // Exclude this appointment (for reschedule)
  studentId: string;
  nurseId?: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
}

export interface TimeSlot {
  start: string; // HH:MM format
  end: string; // HH:MM format
  available: boolean;
  conflicts?: Appointment[];
}

export interface ConflictResult {
  hasConflict: boolean;
  conflicts: Appointment[];
  conflictTypes: {
    student: boolean;
    nurse: boolean;
  };
  message?: string;
}

export interface AvailableSlots {
  date: string;
  slots: TimeSlot[];
  totalAvailable: number;
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Convert time string (HH:MM) to minutes since midnight
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes since midnight to time string (HH:MM)
 */
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Check if two time ranges overlap
 */
function timeRangesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const start1Min = timeToMinutes(start1);
  const end1Min = timeToMinutes(end1);
  const start2Min = timeToMinutes(start2);
  const end2Min = timeToMinutes(end2);

  // Ranges overlap if one starts before the other ends
  return start1Min < end2Min && start2Min < end1Min;
}

/**
 * Calculate end time from start time and duration
 */
function calculateEndTime(startTime: string, duration: number): string {
  const startMin = timeToMinutes(startTime);
  const endMin = startMin + duration;
  return minutesToTime(endMin);
}

/**
 * Parse appointment to get time range
 */
function getAppointmentTimeRange(appointment: Appointment): { start: string; end: string } {
  const start = appointment.scheduledTime;
  const end = calculateEndTime(appointment.scheduledTime, appointment.duration);
  return { start, end };
}

// ==========================================
// CONFLICT DETECTION
// ==========================================

/**
 * Check for appointment conflicts
 */
export async function checkConflict(check: ConflictCheck): Promise<ConflictResult> {
  try {
    // Fetch appointments for the same date
    const response = await apiClient.get<Appointment[]>(API_ENDPOINTS.APPOINTMENTS.BASE, {
      params: {
        scheduledDate: check.scheduledDate,
        status: ['scheduled', 'confirmed', 'in-progress'].join(','),
      },
    });

    const appointments = response.data;

    // Filter out the current appointment if rescheduling
    const relevantAppointments = check.appointmentId
      ? appointments.filter((apt) => apt.id !== check.appointmentId)
      : appointments;

    // Calculate time range for the new appointment
    const newStart = check.scheduledTime;
    const newEnd = calculateEndTime(check.scheduledTime, check.duration);

    // Find conflicts
    const conflicts: Appointment[] = [];
    let studentConflict = false;
    let nurseConflict = false;

    for (const appointment of relevantAppointments) {
      const { start: aptStart, end: aptEnd } = getAppointmentTimeRange(appointment);

      // Check if time ranges overlap
      if (timeRangesOverlap(newStart, newEnd, aptStart, aptEnd)) {
        // Check if same student
        if (appointment.studentId === check.studentId) {
          conflicts.push(appointment);
          studentConflict = true;
        }

        // Check if same nurse
        if (check.nurseId && appointment.nurseId === check.nurseId) {
          conflicts.push(appointment);
          nurseConflict = true;
        }
      }
    }

    // Generate conflict message
    let message: string | undefined;
    if (conflicts.length > 0) {
      const messages: string[] = [];
      if (studentConflict) {
        messages.push('Student has another appointment at this time');
      }
      if (nurseConflict) {
        messages.push('Nurse has another appointment at this time');
      }
      message = messages.join('. ');
    }

    return {
      hasConflict: conflicts.length > 0,
      conflicts,
      conflictTypes: {
        student: studentConflict,
        nurse: nurseConflict,
      },
      message,
    };
  } catch (error) {
    console.error('Error checking conflicts:', error);
    throw new Error('Failed to check appointment conflicts');
  }
}

/**
 * Find available time slots for a given date
 */
export async function findAvailableSlots(params: {
  studentId: string;
  nurseId?: string;
  date: string;
  duration: number;
  startTime?: string;
  endTime?: string;
}): Promise<AvailableSlots> {
  try {
    const { studentId, nurseId, date, duration, startTime = '08:00', endTime = '17:00' } = params;

    // Fetch existing appointments for the date
    const response = await apiClient.get<Appointment[]>(API_ENDPOINTS.APPOINTMENTS.BASE, {
      params: {
        scheduledDate: date,
        status: ['scheduled', 'confirmed', 'in-progress'].join(','),
      },
    });

    const appointments = response.data;

    // Filter appointments for the student or nurse
    const relevantAppointments = appointments.filter(
      (apt) => apt.studentId === studentId || (nurseId && apt.nurseId === nurseId)
    );

    // Generate all possible slots (15-minute increments)
    const slots: TimeSlot[] = [];
    const startMin = timeToMinutes(startTime);
    const endMin = timeToMinutes(endTime);

    for (let currentMin = startMin; currentMin + duration <= endMin; currentMin += 15) {
      const slotStart = minutesToTime(currentMin);
      const slotEnd = calculateEndTime(slotStart, duration);

      // Check if this slot conflicts with any appointment
      let hasConflict = false;
      const conflictingAppointments: Appointment[] = [];

      for (const appointment of relevantAppointments) {
        const { start: aptStart, end: aptEnd } = getAppointmentTimeRange(appointment);

        if (timeRangesOverlap(slotStart, slotEnd, aptStart, aptEnd)) {
          hasConflict = true;
          conflictingAppointments.push(appointment);
        }
      }

      slots.push({
        start: slotStart,
        end: slotEnd,
        available: !hasConflict,
        conflicts: hasConflict ? conflictingAppointments : undefined,
      });
    }

    const totalAvailable = slots.filter((slot) => slot.available).length;

    return {
      date,
      slots,
      totalAvailable,
    };
  } catch (error) {
    console.error('Error finding available slots:', error);
    throw new Error('Failed to find available time slots');
  }
}

/**
 * Suggest alternative time slots when a conflict is detected
 */
export async function suggestAlternativeSlots(params: {
  studentId: string;
  nurseId?: string;
  date: string;
  duration: number;
  preferredTime?: string;
  maxSuggestions?: number;
}): Promise<TimeSlot[]> {
  const { preferredTime, maxSuggestions = 5, ...slotParams } = params;

  const { slots } = await findAvailableSlots(slotParams);

  // Filter to available slots only
  const availableSlots = slots.filter((slot) => slot.available);

  if (availableSlots.length === 0) {
    return [];
  }

  // If no preferred time, return first N available slots
  if (!preferredTime) {
    return availableSlots.slice(0, maxSuggestions);
  }

  // Sort by proximity to preferred time
  const preferredMin = timeToMinutes(preferredTime);

  const sortedSlots = [...availableSlots].sort((a, b) => {
    const aMin = timeToMinutes(a.start);
    const bMin = timeToMinutes(b.start);
    const aDiff = Math.abs(aMin - preferredMin);
    const bDiff = Math.abs(bMin - preferredMin);
    return aDiff - bDiff;
  });

  return sortedSlots.slice(0, maxSuggestions);
}

/**
 * Validate if a time slot is within working hours
 */
export function validateWorkingHours(
  time: string,
  workingHours: { start: string; end: string }
): boolean {
  return time >= workingHours.start && time <= workingHours.end;
}

/**
 * Check if date is a working day
 */
export function isWorkingDay(
  date: Date,
  workingDays: string[]
): boolean {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[date.getDay()];
  return workingDays.includes(dayName);
}

/**
 * Get next available working day
 */
export function getNextWorkingDay(
  startDate: Date,
  workingDays: string[]
): Date {
  const date = new Date(startDate);
  let daysChecked = 0;

  while (daysChecked < 14) { // Check up to 2 weeks ahead
    date.setDate(date.getDate() + 1);
    if (isWorkingDay(date, workingDays)) {
      return date;
    }
    daysChecked++;
  }

  // If no working day found in 2 weeks, return the original date
  return startDate;
}

/**
 * Calculate appointment buffer time
 * Adds buffer between appointments for cleanup/preparation
 */
export function addBufferTime(endTime: string, bufferMinutes: number): string {
  const endMin = timeToMinutes(endTime);
  const bufferedEnd = endMin + bufferMinutes;
  return minutesToTime(bufferedEnd);
}

/**
 * Batch conflict check for multiple appointments
 */
export async function checkMultipleConflicts(
  checks: ConflictCheck[]
): Promise<Map<number, ConflictResult>> {
  const results = new Map<number, ConflictResult>();

  // Process all checks in parallel
  const promises = checks.map((check, index) =>
    checkConflict(check).then((result) => ({ index, result }))
  );

  const settled = await Promise.allSettled(promises);

  settled.forEach((outcome) => {
    if (outcome.status === 'fulfilled') {
      results.set(outcome.value.index, outcome.value.result);
    } else {
      // Set error result for failed checks
      results.set(0, {
        hasConflict: true,
        conflicts: [],
        conflictTypes: { student: false, nurse: false },
        message: 'Failed to check conflicts',
      });
    }
  });

  return results;
}
