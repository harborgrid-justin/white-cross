/**
 * Calendar Utility Functions
 *
 * Helper functions for calendar calculations, date manipulation,
 * and appointment status styling.
 */

import type { Appointment, AppointmentStatus } from '../AppointmentCard';
import type { CalendarCell } from '../types/calendarTypes';

/**
 * Gets the start of the week for a given date (Sunday)
 */
export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

/**
 * Gets calendar cells for month view
 */
export const getMonthCells = (
  currentDate: Date,
  appointments: Appointment[],
  selectedDate: Date | null
): CalendarCell[] => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = getWeekStart(firstDay);
  const cells: CalendarCell[] = [];
  const today = new Date();

  // Generate 42 cells (6 weeks * 7 days)
  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + i);

    const dayAppointments = appointments.filter(
      (apt) => new Date(apt.dateTime).toDateString() === cellDate.toDateString()
    );

    cells.push({
      date: cellDate,
      isCurrentMonth: cellDate.getMonth() === month,
      isToday: cellDate.toDateString() === today.toDateString(),
      isSelected: selectedDate?.toDateString() === cellDate.toDateString(),
      appointments: dayAppointments,
    });
  }

  return cells;
};

/**
 * Gets appointments for a specific week
 */
export const getWeekAppointments = (
  currentDate: Date,
  appointments: Appointment[]
): Appointment[] => {
  const weekStart = getWeekStart(currentDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return appointments.filter((apt) => {
    const aptDate = new Date(apt.dateTime);
    return aptDate >= weekStart && aptDate <= weekEnd;
  });
};

/**
 * Gets appointments for a specific day
 */
export const getDayAppointments = (
  currentDate: Date,
  appointments: Appointment[]
): Appointment[] => {
  return appointments.filter(
    (apt) => new Date(apt.dateTime).toDateString() === currentDate.toDateString()
  );
};

/**
 * Gets the current month name with year
 */
export const getCurrentMonthName = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Gets appointment status color classes
 */
export const getAppointmentStatusColor = (status: AppointmentStatus): string => {
  const colors: Record<AppointmentStatus, string> = {
    scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
    confirmed: 'bg-green-100 text-green-700 border-green-200',
    'checked-in': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'in-progress': 'bg-purple-100 text-purple-700 border-purple-200',
    completed: 'bg-gray-100 text-gray-700 border-gray-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    'no-show': 'bg-orange-100 text-orange-700 border-orange-200',
    rescheduled: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  };
  return colors[status] || colors.scheduled;
};

/**
 * Generates an array of week days starting from a given date
 */
export const getWeekDays = (currentDate: Date): Date[] => {
  const weekStart = getWeekStart(currentDate);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });
};

/**
 * Generates time slots for a day (24 hours)
 */
export const generateTimeSlots = (): string[] => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });
};

/**
 * Filters appointments by hour for a given time slot
 */
export const getAppointmentsByHour = (
  appointments: Appointment[],
  date: Date,
  hour: number
): Appointment[] => {
  return appointments.filter((apt) => {
    const aptDate = new Date(apt.dateTime);
    return (
      aptDate.toDateString() === date.toDateString() &&
      aptDate.getHours() === hour
    );
  });
};
