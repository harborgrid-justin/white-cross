/**
 * @fileoverview Calendar Integration Utilities
 * @module lib/appointments/calendar
 *
 * Utilities for transforming appointment data for calendar display.
 * Supports FullCalendar integration with custom styling and event handling.
 */

import type { EventInput } from '@fullcalendar/core/index.js';

// ==========================================
// TYPES
// ==========================================

export interface Appointment {
  id: string;
  studentId: string;
  studentName?: string;
  nurseId?: string;
  nurseName?: string;
  appointmentType: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface CalendarEvent extends EventInput {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    appointmentId: string;
    studentId: string;
    studentName?: string;
    nurseId?: string;
    nurseName?: string;
    appointmentType: string;
    status: string;
    reason: string;
    notes?: string;
    priority?: string;
    duration: number;
  };
}

export interface CalendarConfig {
  headerToolbar: {
    left: string;
    center: string;
    right: string;
  };
  initialView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
  slotMinTime: string;
  slotMaxTime: string;
  slotDuration: string;
  snapDuration: string;
  editable: boolean;
  selectable: boolean;
  selectMirror: boolean;
  dayMaxEvents: boolean | number;
  weekends: boolean;
  allDaySlot: boolean;
}

// ==========================================
// COLOR SCHEMES
// ==========================================

/**
 * Color mapping for appointment statuses
 */
const STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  scheduled: {
    bg: '#3B82F6', // blue-500
    border: '#2563EB', // blue-600
    text: '#FFFFFF',
  },
  confirmed: {
    bg: '#10B981', // green-500
    border: '#059669', // green-600
    text: '#FFFFFF',
  },
  'in-progress': {
    bg: '#F59E0B', // amber-500
    border: '#D97706', // amber-600
    text: '#FFFFFF',
  },
  completed: {
    bg: '#6B7280', // gray-500
    border: '#4B5563', // gray-600
    text: '#FFFFFF',
  },
  cancelled: {
    bg: '#EF4444', // red-500
    border: '#DC2626', // red-600
    text: '#FFFFFF',
  },
  'no-show': {
    bg: '#F97316', // orange-500
    border: '#EA580C', // orange-600
    text: '#FFFFFF',
  },
};

/**
 * Color mapping for appointment priorities
 */
const PRIORITY_COLORS: Record<string, { bg: string; border: string }> = {
  low: {
    bg: '#94A3B8', // slate-400
    border: '#64748B', // slate-500
  },
  medium: {
    bg: '#3B82F6', // blue-500
    border: '#2563EB', // blue-600
  },
  high: {
    bg: '#F59E0B', // amber-500
    border: '#D97706', // amber-600
  },
  urgent: {
    bg: '#EF4444', // red-500
    border: '#DC2626', // red-600
  },
};

// ==========================================
// EVENT TRANSFORMATION
// ==========================================

/**
 * Transform appointment to calendar event
 */
export function appointmentToCalendarEvent(appointment: Appointment): CalendarEvent {
  const {
    id,
    studentId,
    studentName,
    nurseId,
    nurseName,
    appointmentType,
    scheduledDate,
    scheduledTime,
    duration,
    status,
    reason,
    notes,
    priority,
  } = appointment;

  // Calculate end time
  const startDateTime = `${scheduledDate}T${scheduledTime}`;
  const start = new Date(startDateTime);
  const end = new Date(start.getTime() + duration * 60000);

  // Get colors based on status (primary) or priority (fallback)
  const colors = STATUS_COLORS[status] || PRIORITY_COLORS[priority || 'medium'];

  // Build event title
  const title = studentName ? `${studentName} - ${appointmentType}` : appointmentType;

  return {
    id,
    title,
    start: start.toISOString(),
    end: end.toISOString(),
    backgroundColor: colors.bg,
    borderColor: colors.border,
    textColor: colors.text || '#FFFFFF',
    extendedProps: {
      appointmentId: id,
      studentId,
      studentName,
      nurseId,
      nurseName,
      appointmentType,
      status,
      reason,
      notes,
      priority,
      duration,
    },
  };
}

/**
 * Transform multiple appointments to calendar events
 */
export function appointmentsToCalendarEvents(appointments: Appointment[]): CalendarEvent[] {
  return appointments.map(appointmentToCalendarEvent);
}

/**
 * Transform calendar event back to appointment data
 */
export function calendarEventToAppointment(event: CalendarEvent): Partial<Appointment> {
  const start = new Date(event.start);

  return {
    id: event.extendedProps.appointmentId,
    studentId: event.extendedProps.studentId,
    studentName: event.extendedProps.studentName,
    nurseId: event.extendedProps.nurseId,
    nurseName: event.extendedProps.nurseName,
    appointmentType: event.extendedProps.appointmentType,
    scheduledDate: start.toISOString().split('T')[0],
    scheduledTime: start.toTimeString().slice(0, 5),
    duration: event.extendedProps.duration,
    status: event.extendedProps.status as Appointment['status'],
    reason: event.extendedProps.reason,
    notes: event.extendedProps.notes,
    priority: event.extendedProps.priority as Appointment['priority'],
  };
}

// ==========================================
// CALENDAR CONFIGURATION
// ==========================================

/**
 * Get default calendar configuration
 */
export function getDefaultCalendarConfig(): CalendarConfig {
  return {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    initialView: 'timeGridWeek',
    slotMinTime: '07:00:00',
    slotMaxTime: '18:00:00',
    slotDuration: '00:15:00', // 15-minute slots
    snapDuration: '00:15:00', // Snap to 15-minute increments
    editable: true, // Enable drag-and-drop
    selectable: true, // Enable click-to-create
    selectMirror: true, // Show selection as it's being created
    dayMaxEvents: true, // Show "more" link when too many events
    weekends: false, // Hide weekends by default (school setting)
    allDaySlot: false, // Hide all-day slot (appointments have specific times)
  };
}

/**
 * Get calendar configuration with custom settings
 */
export function getCalendarConfig(customSettings?: Partial<CalendarConfig>): CalendarConfig {
  const defaultConfig = getDefaultCalendarConfig();
  return {
    ...defaultConfig,
    ...customSettings,
  };
}

// ==========================================
// EVENT STYLING
// ==========================================

/**
 * Get event color by status
 */
export function getEventColorByStatus(
  status: Appointment['status']
): { bg: string; border: string; text: string } {
  return STATUS_COLORS[status] || STATUS_COLORS.scheduled;
}

/**
 * Get event color by priority
 */
export function getEventColorByPriority(
  priority: Appointment['priority']
): { bg: string; border: string } {
  return PRIORITY_COLORS[priority || 'medium'];
}

/**
 * Apply custom styles to event element
 */
export function applyEventStyles(element: HTMLElement, appointment: Appointment): void {
  const colors = getEventColorByStatus(appointment.status);

  element.style.backgroundColor = colors.bg;
  element.style.borderColor = colors.border;
  element.style.color = colors.text;

  // Add priority indicator
  if (appointment.priority === 'urgent') {
    element.style.fontWeight = 'bold';
    element.style.borderWidth = '3px';
  }

  // Add status indicator class
  element.classList.add(`appointment-status-${appointment.status}`);
  if (appointment.priority) {
    element.classList.add(`appointment-priority-${appointment.priority}`);
  }
}

// ==========================================
// TIME UTILITIES
// ==========================================

/**
 * Format date for calendar display
 */
export function formatCalendarDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time for calendar display
 */
export function formatCalendarTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format date range for calendar display
 */
export function formatCalendarDateRange(start: Date, end: Date): string {
  const startStr = formatCalendarTime(start);
  const endStr = formatCalendarTime(end);
  return `${startStr} - ${endStr}`;
}

/**
 * Get business hours configuration
 */
export function getBusinessHours(customHours?: {
  start: string;
  end: string;
  daysOfWeek?: number[];
}) {
  return {
    daysOfWeek: customHours?.daysOfWeek || [1, 2, 3, 4, 5], // Monday-Friday
    startTime: customHours?.start || '08:00',
    endTime: customHours?.end || '17:00',
  };
}

// ==========================================
// EVENT FILTERING
// ==========================================

/**
 * Filter events by status
 */
export function filterEventsByStatus(
  events: CalendarEvent[],
  statuses: Appointment['status'][]
): CalendarEvent[] {
  return events.filter((event) => statuses.includes(event.extendedProps.status as Appointment['status']));
}

/**
 * Filter events by priority
 */
export function filterEventsByPriority(
  events: CalendarEvent[],
  priorities: Appointment['priority'][]
): CalendarEvent[] {
  return events.filter((event) =>
    priorities.includes(event.extendedProps.priority as Appointment['priority'])
  );
}

/**
 * Filter events by nurse
 */
export function filterEventsByNurse(events: CalendarEvent[], nurseId: string): CalendarEvent[] {
  return events.filter((event) => event.extendedProps.nurseId === nurseId);
}

/**
 * Filter events by student
 */
export function filterEventsByStudent(events: CalendarEvent[], studentId: string): CalendarEvent[] {
  return events.filter((event) => event.extendedProps.studentId === studentId);
}

/**
 * Filter events by date range
 */
export function filterEventsByDateRange(
  events: CalendarEvent[],
  startDate: Date,
  endDate: Date
): CalendarEvent[] {
  return events.filter((event) => {
    const eventStart = new Date(event.start);
    return eventStart >= startDate && eventStart <= endDate;
  });
}

// ==========================================
// EVENT GROUPING
// ==========================================

/**
 * Group events by date
 */
export function groupEventsByDate(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const grouped = new Map<string, CalendarEvent[]>();

  events.forEach((event) => {
    const date = new Date(event.start).toISOString().split('T')[0];
    const existing = grouped.get(date) || [];
    grouped.set(date, [...existing, event]);
  });

  return grouped;
}

/**
 * Group events by status
 */
export function groupEventsByStatus(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const grouped = new Map<string, CalendarEvent[]>();

  events.forEach((event) => {
    const status = event.extendedProps.status;
    const existing = grouped.get(status) || [];
    grouped.set(status, [...existing, event]);
  });

  return grouped;
}

/**
 * Group events by student
 */
export function groupEventsByStudent(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const grouped = new Map<string, CalendarEvent[]>();

  events.forEach((event) => {
    const studentId = event.extendedProps.studentId;
    const existing = grouped.get(studentId) || [];
    grouped.set(studentId, [...existing, event]);
  });

  return grouped;
}

// ==========================================
// STATISTICS
// ==========================================

/**
 * Calculate calendar statistics
 */
export function calculateCalendarStatistics(events: CalendarEvent[]): {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  totalDuration: number;
  averageDuration: number;
} {
  const byStatus: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  let totalDuration = 0;

  events.forEach((event) => {
    const status = event.extendedProps.status;
    const priority = event.extendedProps.priority || 'medium';
    const duration = event.extendedProps.duration || 0;

    byStatus[status] = (byStatus[status] || 0) + 1;
    byPriority[priority] = (byPriority[priority] || 0) + 1;
    totalDuration += duration;
  });

  const averageDuration = events.length > 0 ? totalDuration / events.length : 0;

  return {
    total: events.length,
    byStatus,
    byPriority,
    totalDuration,
    averageDuration: Math.round(averageDuration),
  };
}

// ==========================================
// EXPORT
// ==========================================

/**
 * Export calendar events to iCal format (for download)
 */
export function exportToICal(events: CalendarEvent[], title = 'Appointments'): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//White Cross//Appointments//EN',
    `X-WR-CALNAME:${title}`,
  ];

  events.forEach((event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);

    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.id}`,
      `DTSTART:${formatDateTimeICal(start)}`,
      `DTEND:${formatDateTimeICal(end)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.extendedProps.reason || ''}`,
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}

/**
 * Format date/time for iCal format
 */
function formatDateTimeICal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}
