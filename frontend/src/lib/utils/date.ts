/**
 * Date and Time Utility Functions
 *
 * Centralized date/time formatting and manipulation utilities
 * with timezone support and HIPAA-compliant logging.
 *
 * @module lib/utils/date
 */

/**
 * Formats a date to ISO 8601 string for API communication.
 *
 * @param date - Date to format (Date object, string, or number timestamp)
 * @returns ISO 8601 formatted string
 *
 * @example
 * ```typescript
 * formatDateForApi(new Date()) // '2025-10-26T14:30:00.000Z'
 * formatDateForApi('2025-10-26') // '2025-10-26T00:00:00.000Z'
 * ```
 */
export function formatDateForApi(date: Date | string | number): string {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }

    return dateObj.toISOString();
  } catch (error) {
    console.error('Error formatting date for API:', error);
    return new Date().toISOString(); // Fallback to current time
  }
}

/**
 * Parses an ISO 8601 date string to a Date object.
 *
 * @param dateString - ISO 8601 date string
 * @returns Date object
 *
 * @example
 * ```typescript
 * parseDateFromApi('2025-10-26T14:30:00.000Z') // Date object
 * ```
 */
export function parseDateFromApi(dateString: string): Date {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }

    return date;
  } catch (error) {
    console.error('Error parsing date from API:', error);
    return new Date(); // Fallback to current date
  }
}

/**
 * Formats a date for user-friendly display.
 *
 * @param date - Date to format
 * @param format - Format type ('short' | 'long' | 'time' | 'datetime')
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * formatDateForDisplay(new Date(), 'short') // 'Oct 26, 2025'
 * formatDateForDisplay(new Date(), 'long') // 'October 26, 2025'
 * formatDateForDisplay(new Date(), 'time') // '2:30 PM'
 * formatDateForDisplay(new Date(), 'datetime') // 'Oct 26, 2025 2:30 PM'
 * ```
 */
export function formatDateForDisplay(
  date: Date | string | number,
  format: 'short' | 'long' | 'time' | 'datetime' = 'short'
): string {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
      short: { year: 'numeric', month: 'short', day: 'numeric' },
      long: { year: 'numeric', month: 'long', day: 'numeric' },
      time: { hour: 'numeric', minute: '2-digit', hour12: true },
      datetime: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      },
    };

    const options = optionsMap[format];

    return new Intl.DateTimeFormat('en-US', options).format(dateObj);
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return 'Invalid Date';
  }
}

/**
 * Checks if a date has expired (is in the past).
 *
 * @param date - Date to check
 * @returns True if date is in the past
 *
 * @example
 * ```typescript
 * isDateExpired('2024-01-01') // true
 * isDateExpired('2026-01-01') // false
 * ```
 */
export function isDateExpired(date: Date | string | number): boolean {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.getTime() < Date.now();
  } catch (error) {
    console.error('Error checking if date is expired:', error);
    return false;
  }
}

/**
 * Gets the time until a future date expires.
 *
 * @param date - Future date
 * @returns Human-readable time until expiry ('2d 5h', '3h 20m', 'Expired')
 *
 * @example
 * ```typescript
 * getTimeUntilExpiry(futureDate) // '2d 5h'
 * getTimeUntilExpiry(pastDate) // 'Expired'
 * ```
 */
export function getTimeUntilExpiry(date: Date | string | number): string {
  try {
    const expiryDate = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diff = expiryDate.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  } catch (error) {
    console.error('Error calculating time until expiry:', error);
    return 'Unknown';
  }
}

/**
 * Gets the relative time from now (e.g., '2 hours ago', 'in 3 days').
 *
 * @param date - Date to compare
 * @returns Relative time string
 *
 * @example
 * ```typescript
 * getRelativeTime(pastDate) // '2 hours ago'
 * getRelativeTime(futureDate) // 'in 3 days'
 * ```
 */
export function getRelativeTime(date: Date | string | number): string {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffMs = dateObj.getTime() - now.getTime();
    const diffSec = Math.abs(diffMs / 1000);
    const diffMin = diffSec / 60;
    const diffHour = diffMin / 60;
    const diffDay = diffHour / 24;
    const diffWeek = diffDay / 7;
    const diffMonth = diffDay / 30;
    const diffYear = diffDay / 365;

    const isPast = diffMs < 0;
    const suffix = isPast ? 'ago' : 'from now';

    if (diffSec < 60) return `${Math.floor(diffSec)} seconds ${suffix}`;
    if (diffMin < 60) return `${Math.floor(diffMin)} minutes ${suffix}`;
    if (diffHour < 24) return `${Math.floor(diffHour)} hours ${suffix}`;
    if (diffDay < 7) return `${Math.floor(diffDay)} days ${suffix}`;
    if (diffWeek < 4) return `${Math.floor(diffWeek)} weeks ${suffix}`;
    if (diffMonth < 12) return `${Math.floor(diffMonth)} months ${suffix}`;
    return `${Math.floor(diffYear)} years ${suffix}`;
  } catch (error) {
    console.error('Error getting relative time:', error);
    return 'Unknown';
  }
}

/**
 * Adds days to a date.
 *
 * @param date - Base date
 * @param days - Number of days to add (can be negative)
 * @returns New date with days added
 *
 * @example
 * ```typescript
 * addDays(new Date(), 7) // Date 7 days in the future
 * addDays(new Date(), -3) // Date 3 days in the past
 * ```
 */
export function addDays(date: Date | string | number, days: number): Date {
  const dateObj = date instanceof Date ? new Date(date) : new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
}

/**
 * Adds months to a date.
 *
 * @param date - Base date
 * @param months - Number of months to add (can be negative)
 * @returns New date with months added
 *
 * @example
 * ```typescript
 * addMonths(new Date(), 3) // Date 3 months in the future
 * ```
 */
export function addMonths(date: Date | string | number, months: number): Date {
  const dateObj = date instanceof Date ? new Date(date) : new Date(date);
  dateObj.setMonth(dateObj.getMonth() + months);
  return dateObj;
}

/**
 * Gets the start of day (midnight) for a given date.
 *
 * @param date - Input date
 * @returns Date set to start of day (00:00:00.000)
 *
 * @example
 * ```typescript
 * startOfDay(new Date()) // Today at 00:00:00.000
 * ```
 */
export function startOfDay(date: Date | string | number): Date {
  const dateObj = date instanceof Date ? new Date(date) : new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
}

/**
 * Gets the end of day (just before midnight) for a given date.
 *
 * @param date - Input date
 * @returns Date set to end of day (23:59:59.999)
 *
 * @example
 * ```typescript
 * endOfDay(new Date()) // Today at 23:59:59.999
 * ```
 */
export function endOfDay(date: Date | string | number): Date {
  const dateObj = date instanceof Date ? new Date(date) : new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
}

/**
 * Checks if two dates are on the same day.
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if dates are on the same day
 *
 * @example
 * ```typescript
 * isSameDay(new Date(), new Date()) // true
 * ```
 */
export function isSameDay(date1: Date | string | number, date2: Date | string | number): boolean {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Calculates age from date of birth.
 *
 * @param dateOfBirth - Date of birth
 * @returns Age in years
 *
 * @example
 * ```typescript
 * calculateAge('2015-01-01') // 10 (in 2025)
 * ```
 */
export function calculateAge(dateOfBirth: Date | string | number): number {
  const dob = dateOfBirth instanceof Date ? dateOfBirth : new Date(dateOfBirth);
  const now = new Date();

  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}

/**
 * Formats time in 12-hour format with AM/PM.
 *
 * @param hours - Hours (0-23)
 * @param minutes - Minutes (0-59)
 * @returns Formatted time string
 *
 * @example
 * ```typescript
 * formatTime(14, 30) // '2:30 PM'
 * formatTime(9, 5) // '9:05 AM'
 * ```
 */
export function formatTime(hours: number, minutes: number): string {
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');

  return `${displayHours}:${displayMinutes} ${period}`;
}

/**
 * Validates if a string is a valid ISO 8601 date.
 *
 * @param dateString - String to validate
 * @returns True if valid ISO 8601 date
 *
 * @example
 * ```typescript
 * isValidISODate('2025-10-26T14:30:00.000Z') // true
 * isValidISODate('invalid') // false
 * ```
 */
export function isValidISODate(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date.toISOString() === dateString;
  } catch {
    return false;
  }
}

/**
 * Gets date range for common periods.
 *
 * @param period - Period type
 * @returns Object with start and end dates
 *
 * @example
 * ```typescript
 * getDateRange('today') // { start: today at 00:00, end: today at 23:59 }
 * getDateRange('thisWeek') // { start: Monday, end: Sunday }
 * ```
 */
export function getDateRange(period: 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'thisYear'): {
  start: Date;
  end: Date;
} {
  const now = new Date();

  switch (period) {
    case 'today':
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };

    case 'yesterday':
      const yesterday = addDays(now, -1);
      return {
        start: startOfDay(yesterday),
        end: endOfDay(yesterday),
      };

    case 'thisWeek': {
      const dayOfWeek = now.getDay();
      const startOfWeek = addDays(now, -dayOfWeek);
      const endOfWeek = addDays(startOfWeek, 6);
      return {
        start: startOfDay(startOfWeek),
        end: endOfDay(endOfWeek),
      };
    }

    case 'thisMonth':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
      };

    case 'thisYear':
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
      };

    default:
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };
  }
}
