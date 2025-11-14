/**
 * WF-COMP-317 | appointments/utils.ts - Validation and utility functions
 * Purpose: Validation helpers, utility functions, and type guards for appointments
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: validation functions, utilities, type guards | Key Features: Business logic validation
 * Last Updated: 2025-11-11 | File Type: .ts
 * Critical Path: User input → Validation → State updates → API calls
 * LLM Context: Utilities module for appointment system, part of modular architecture
 */

/**
 * Appointment Utilities Module
 * Validation functions, type guards, and helper utilities for appointment management
 * Ensures business rule compliance and data integrity in the White Cross healthcare platform
 */

import type {
  Appointment,
  AppointmentType,
  AppointmentWaitlist,
  APPOINTMENT_VALIDATION
} from './core';

import {
  AppointmentStatus,
  WaitlistPriority,
  WaitlistStatus
} from './core';

// =====================
// TYPE GUARDS
// =====================

/**
 * Type guard to check if an appointment is upcoming
 */
export const isUpcomingAppointment = (appointment: Appointment): boolean => {
  return (
    appointment.status === AppointmentStatus.SCHEDULED &&
    new Date(appointment.scheduledAt) > new Date()
  );
};

/**
 * Type guard to check if an appointment can be cancelled
 */
export const isCancellable = (appointment: Appointment): boolean => {
  return (
    appointment.status === AppointmentStatus.SCHEDULED ||
    appointment.status === AppointmentStatus.IN_PROGRESS
  );
};

/**
 * Type guard to check if a waitlist entry is active
 */
export const isActiveWaitlistEntry = (entry: AppointmentWaitlist): boolean => {
  return (
    entry.status === WaitlistStatus.WAITING &&
    new Date(entry.expiresAt) > new Date()
  );
};

// =====================
// HELPER FUNCTIONS
// =====================

/**
 * Get appointment duration end time
 */
export const getAppointmentEndTime = (appointment: Appointment): Date => {
  const startTime = new Date(appointment.scheduledAt);
  return new Date(startTime.getTime() + appointment.duration * 60000);
};

/**
 * Format appointment type for display
 */
export const formatAppointmentType = (type: AppointmentType): string => {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Get status color for display
 */
export const getAppointmentStatusColor = (status: AppointmentStatus): string => {
  const colorMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.SCHEDULED]: '#3b82f6', // blue
    [AppointmentStatus.IN_PROGRESS]: '#f59e0b', // amber
    [AppointmentStatus.COMPLETED]: '#10b981', // green
    [AppointmentStatus.CANCELLED]: '#6b7280', // gray
    [AppointmentStatus.NO_SHOW]: '#ef4444', // red
  };
  return colorMap[status] || '#6b7280';
};

/**
 * Get priority color for display
 */
export const getWaitlistPriorityColor = (priority: WaitlistPriority): string => {
  const colorMap: Record<WaitlistPriority, string> = {
    [WaitlistPriority.LOW]: '#10b981', // green
    [WaitlistPriority.NORMAL]: '#3b82f6', // blue
    [WaitlistPriority.HIGH]: '#f59e0b', // amber
    [WaitlistPriority.URGENT]: '#ef4444', // red
  };
  return colorMap[priority] || '#6b7280';
};

// =====================
// VALIDATION HELPERS
// =====================

/**
 * Validate appointment duration
 */
export const validateDuration = (duration: number): { valid: boolean; error?: string } => {
  // Import validation constants locally to avoid circular dependency
  const DURATION = {
    MIN: 15,
    MAX: 120,
    INCREMENT: 15,
  };

  if (duration < DURATION.MIN) {
    return {
      valid: false,
      error: `Duration must be at least ${DURATION.MIN} minutes`
    };
  }
  if (duration > DURATION.MAX) {
    return {
      valid: false,
      error: `Duration cannot exceed ${DURATION.MAX} minutes`
    };
  }
  if (duration % DURATION.INCREMENT !== 0) {
    return {
      valid: false,
      error: `Duration must be in ${DURATION.INCREMENT}-minute increments`
    };
  }
  return { valid: true };
};

/**
 * Validate appointment is in the future
 */
export const validateFutureDateTime = (scheduledAt: Date): { valid: boolean; error?: string } => {
  const now = new Date();
  if (scheduledAt <= now) {
    return {
      valid: false,
      error: 'Appointment must be scheduled for a future date and time'
    };
  }
  return { valid: true };
};

/**
 * Validate appointment is within business hours
 */
export const validateBusinessHours = (
  scheduledAt: Date,
  duration: number
): { valid: boolean; error?: string } => {
  const hour = scheduledAt.getHours();
  const minutes = scheduledAt.getMinutes();
  const totalMinutes = hour * 60 + minutes;

  // Import validation constants locally
  const BUSINESS_HOURS = {
    START: 8, // 8 AM
    END: 17,  // 5 PM
  };

  const startMinutes = BUSINESS_HOURS.START * 60;
  const endMinutes = BUSINESS_HOURS.END * 60;

  if (totalMinutes < startMinutes) {
    return {
      valid: false,
      error: `Appointments must be scheduled after ${BUSINESS_HOURS.START}:00 AM`
    };
  }

  const appointmentEndMinutes = totalMinutes + duration;
  if (appointmentEndMinutes > endMinutes) {
    return {
      valid: false,
      error: `Appointments must end by ${BUSINESS_HOURS.END}:00 PM`
    };
  }

  return { valid: true };
};

/**
 * Validate appointment is not on weekend
 */
export const validateNotWeekend = (scheduledAt: Date): { valid: boolean; error?: string } => {
  const dayOfWeek = scheduledAt.getDay();
  const WEEKEND_DAYS = [0, 6]; // Sunday and Saturday
  
  if (WEEKEND_DAYS.includes(dayOfWeek)) {
    return {
      valid: false,
      error: 'Appointments cannot be scheduled on weekends'
    };
  }
  return { valid: true };
};

/**
 * Validate status transition is allowed
 */
export const validateStatusTransition = (
  currentStatus: AppointmentStatus,
  newStatus: AppointmentStatus
): { valid: boolean; error?: string } => {
  // Import status transitions locally
  const APPOINTMENT_STATUS_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
    [AppointmentStatus.SCHEDULED]: [AppointmentStatus.IN_PROGRESS, AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW],
    [AppointmentStatus.IN_PROGRESS]: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED],
    [AppointmentStatus.COMPLETED]: [],
    [AppointmentStatus.CANCELLED]: [],
    [AppointmentStatus.NO_SHOW]: [],
  };

  const allowedTransitions = APPOINTMENT_STATUS_TRANSITIONS[currentStatus] || [];
  if (!allowedTransitions.includes(newStatus)) {
    return {
      valid: false,
      error: `Cannot transition from ${currentStatus} to ${newStatus}. Allowed: ${allowedTransitions.join(', ') || 'none'}`
    };
  }
  return { valid: true };
};

/**
 * Validate cancellation notice period
 */
export const validateCancellationNotice = (scheduledAt: Date): { valid: boolean; error?: string } => {
  const now = new Date();
  const hoursUntilAppointment = (scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60);
  const MIN_HOURS_NOTICE = 2;

  if (hoursUntilAppointment < MIN_HOURS_NOTICE) {
    return {
      valid: false,
      error: `Appointments must be cancelled at least ${MIN_HOURS_NOTICE} hours in advance`
    };
  }
  return { valid: true };
};

/**
 * Comprehensive appointment validation
 */
export const validateAppointmentData = (data: {
  scheduledAt: Date;
  duration: number;
  type: AppointmentType;
  reason: string;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate duration
  const durationResult = validateDuration(data.duration);
  if (!durationResult.valid && durationResult.error) {
    errors.push(durationResult.error);
  }

  // Validate future date
  const futureResult = validateFutureDateTime(data.scheduledAt);
  if (!futureResult.valid && futureResult.error) {
    errors.push(futureResult.error);
  }

  // Validate not weekend
  const weekendResult = validateNotWeekend(data.scheduledAt);
  if (!weekendResult.valid && weekendResult.error) {
    errors.push(weekendResult.error);
  }

  // Validate business hours
  const businessHoursResult = validateBusinessHours(data.scheduledAt, data.duration);
  if (!businessHoursResult.valid && businessHoursResult.error) {
    errors.push(businessHoursResult.error);
  }

  // Validate reason
  if (!data.reason || data.reason.trim().length < 3) {
    errors.push('Appointment reason must be at least 3 characters');
  }
  if (data.reason && data.reason.length > 500) {
    errors.push('Appointment reason cannot exceed 500 characters');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Get available duration options for dropdown
 */
export const getAvailableDurations = (): number[] => {
  const durations: number[] = [];
  const DURATION = {
    MIN: 15,
    MAX: 120,
    INCREMENT: 15,
  };
  
  for (
    let duration = DURATION.MIN;
    duration <= DURATION.MAX;
    duration += DURATION.INCREMENT
  ) {
    durations.push(duration);
  }
  return durations;
};

/**
 * Check if appointment can be cancelled
 */
export const canCancelAppointment = (appointment: Appointment): { canCancel: boolean; reason?: string } => {
  // Check status
  if (appointment.status !== AppointmentStatus.SCHEDULED &&
      appointment.status !== AppointmentStatus.IN_PROGRESS) {
    return {
      canCancel: false,
      reason: `Cannot cancel appointment with status ${appointment.status}`
    };
  }

  // Check cancellation notice
  const noticeResult = validateCancellationNotice(new Date(appointment.scheduledAt));
  if (!noticeResult.valid) {
    return {
      canCancel: false,
      reason: noticeResult.error
    };
  }

  return { canCancel: true };
};

/**
 * Check if appointment can be started
 */
export const canStartAppointment = (appointment: Appointment): { canStart: boolean; reason?: string } => {
  if (appointment.status !== AppointmentStatus.SCHEDULED) {
    return {
      canStart: false,
      reason: `Cannot start appointment with status ${appointment.status}`
    };
  }

  // Check if not more than 1 hour early
  const now = new Date();
  const scheduledTime = new Date(appointment.scheduledAt);
  const oneHourEarly = new Date(scheduledTime.getTime() - 60 * 60 * 1000);

  if (now < oneHourEarly) {
    return {
      canStart: false,
      reason: 'Cannot start appointment more than 1 hour before scheduled time'
    };
  }

  return { canStart: true };
};

/**
 * Check if appointment can be completed
 */
export const canCompleteAppointment = (appointment: Appointment): { canComplete: boolean; reason?: string } => {
  if (appointment.status !== AppointmentStatus.IN_PROGRESS) {
    return {
      canComplete: false,
      reason: `Cannot complete appointment with status ${appointment.status}. Must be IN_PROGRESS`
    };
  }

  return { canComplete: true };
};

// =====================
// TIME UTILITIES
// =====================

/**
 * Format time for display (e.g., "2:30 PM")
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Format date for display (e.g., "March 15, 2024")
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format date and time for display (e.g., "March 15, 2024 at 2:30 PM")
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return `${formatDate(dateObj)} at ${formatTime(dateObj)}`;
};

/**
 * Get relative time string (e.g., "in 2 hours", "3 days ago")
 */
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (Math.abs(diffHours) < 1) {
    const diffMinutes = diffMs / (1000 * 60);
    if (diffMinutes > 0) {
      return `in ${Math.round(diffMinutes)} minute${Math.round(diffMinutes) === 1 ? '' : 's'}`;
    } else {
      return `${Math.round(Math.abs(diffMinutes))} minute${Math.round(Math.abs(diffMinutes)) === 1 ? '' : 's'} ago`;
    }
  } else if (Math.abs(diffHours) < 24) {
    if (diffHours > 0) {
      return `in ${Math.round(diffHours)} hour${Math.round(diffHours) === 1 ? '' : 's'}`;
    } else {
      return `${Math.round(Math.abs(diffHours))} hour${Math.round(Math.abs(diffHours)) === 1 ? '' : 's'} ago`;
    }
  } else {
    if (diffDays > 0) {
      return `in ${Math.round(diffDays)} day${Math.round(diffDays) === 1 ? '' : 's'}`;
    } else {
      return `${Math.round(Math.abs(diffDays))} day${Math.round(Math.abs(diffDays)) === 1 ? '' : 's'} ago`;
    }
  }
};

/**
 * Check if two appointments overlap
 */
export const appointmentsOverlap = (appointment1: Appointment, appointment2: Appointment): boolean => {
  const start1 = new Date(appointment1.scheduledAt);
  const end1 = getAppointmentEndTime(appointment1);
  const start2 = new Date(appointment2.scheduledAt);
  const end2 = getAppointmentEndTime(appointment2);

  return start1 < end2 && start2 < end1;
};

/**
 * Get appointment duration in human-readable format
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} hour${hours === 1 ? '' : 's'}`;
    } else {
      return `${hours} hour${hours === 1 ? '' : 's'} ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}`;
    }
  }
};

/**
 * Calculate appointment end time from start time and duration
 */
export const calculateEndTime = (startTime: Date | string, durationMinutes: number): Date => {
  const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
  return new Date(start.getTime() + durationMinutes * 60000);
};

/**
 * Check if a time slot is within business hours
 */
export const isWithinBusinessHours = (date: Date): boolean => {
  const hour = date.getHours();
  const BUSINESS_HOURS = {
    START: 8, // 8 AM
    END: 17,  // 5 PM
  };
  return hour >= BUSINESS_HOURS.START && hour < BUSINESS_HOURS.END;
};

/**
 * Check if a date is a weekend
 */
export const isWeekend = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
};

/**
 * Get the next available business day
 */
export const getNextBusinessDay = (date: Date): Date => {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  while (isWeekend(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
};

// =====================
// SORTING UTILITIES
// =====================

/**
 * Sort appointments by scheduled date (ascending)
 */
export const sortAppointmentsByDate = (appointments: Appointment[]): Appointment[] => {
  return [...appointments].sort((a, b) => 
    new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );
};

/**
 * Sort appointments by priority (waitlist)
 */
export const sortWaitlistByPriority = (entries: AppointmentWaitlist[]): AppointmentWaitlist[] => {
  const priorityOrder: Record<WaitlistPriority, number> = {
    [WaitlistPriority.URGENT]: 1,
    [WaitlistPriority.HIGH]: 2,
    [WaitlistPriority.NORMAL]: 3,
    [WaitlistPriority.LOW]: 4,
  };

  return [...entries].sort((a, b) => {
    // First by priority
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Then by creation date (earliest first)
    return new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime();
  });
};

/**
 * Filter appointments by status
 */
export const filterAppointmentsByStatus = (
  appointments: Appointment[], 
  status: AppointmentStatus | AppointmentStatus[]
): Appointment[] => {
  const statuses = Array.isArray(status) ? status : [status];
  return appointments.filter(appointment => statuses.includes(appointment.status));
};

/**
 * Filter appointments by date range
 */
export const filterAppointmentsByDateRange = (
  appointments: Appointment[],
  startDate: Date | string,
  endDate: Date | string
): Appointment[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.scheduledAt);
    return appointmentDate >= start && appointmentDate <= end;
  });
};
