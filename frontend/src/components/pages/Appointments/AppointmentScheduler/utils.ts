/**
 * AppointmentScheduler Utilities
 *
 * Date/time formatting and manipulation utilities for the scheduling interface.
 */

/**
 * Formats a date for display
 *
 * @param date - Date to format
 * @returns Formatted date string (e.g., "Monday, January 1, 2024")
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formats a time string for display
 *
 * @param timeString - Time in HH:MM format
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export const formatTime = (timeString: string): string => {
  const time = new Date(`2000-01-01T${timeString}`);
  return time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Gets an array of dates for the current week (Sunday - Saturday)
 *
 * @param currentWeek - Any date within the desired week
 * @returns Array of 7 Date objects representing the week
 */
export const getWeekDays = (currentWeek: Date): Date[] => {
  const start = new Date(currentWeek);
  const diff = start.getDate() - start.getDay();
  start.setDate(diff);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }
  return days;
};

/**
 * Checks if a date is today
 *
 * @param date - Date to check
 * @returns True if the date is today
 */
export const isToday = (date: Date): boolean => {
  return date.toDateString() === new Date().toDateString();
};

/**
 * Checks if a date is in the past
 *
 * @param date - Date to check
 * @returns True if the date is before today (start of day)
 */
export const isPast = (date: Date): boolean => {
  return date < new Date(new Date().setHours(0, 0, 0, 0));
};
