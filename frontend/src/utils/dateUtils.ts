/**
 * @fileoverview Date utility functions
 * @module utils/dateUtils
 */

/**
 * Format a date to various formats
 */
export function formatDate(
  date: string | Date | number,
  format: 'short' | 'long' | 'full' | 'iso' | 'time' | 'datetime' = 'short'
): string {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-US');
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'full':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'iso':
      return dateObj.toISOString();
    case 'time':
      return dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    case 'datetime':
      return dateObj.toLocaleString('en-US');
    default:
      return dateObj.toLocaleDateString('en-US');
  }
}

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 */
export function getRelativeTime(date: string | Date | number): string {
  if (!date) return '';
  
  const dateObj = new Date(date);
  const now = new Date();
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (Math.abs(diffSeconds) < 60) {
    return 'just now';
  } else if (Math.abs(diffMinutes) < 60) {
    return diffMinutes > 0 
      ? `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`
      : `in ${Math.abs(diffMinutes)} minute${Math.abs(diffMinutes) === 1 ? '' : 's'}`;
  } else if (Math.abs(diffHours) < 24) {
    return diffHours > 0
      ? `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
      : `in ${Math.abs(diffHours)} hour${Math.abs(diffHours) === 1 ? '' : 's'}`;
  } else if (Math.abs(diffDays) < 7) {
    return diffDays > 0
      ? `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
      : `in ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'}`;
  } else if (Math.abs(diffWeeks) < 4) {
    return diffWeeks > 0
      ? `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`
      : `in ${Math.abs(diffWeeks)} week${Math.abs(diffWeeks) === 1 ? '' : 's'}`;
  } else if (Math.abs(diffMonths) < 12) {
    return diffMonths > 0
      ? `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`
      : `in ${Math.abs(diffMonths)} month${Math.abs(diffMonths) === 1 ? '' : 's'}`;
  } else {
    return diffYears > 0
      ? `${diffYears} year${diffYears === 1 ? '' : 's'} ago`
      : `in ${Math.abs(diffYears)} year${Math.abs(diffYears) === 1 ? '' : 's'}`;
  }
}

/**
 * Check if a date is today
 */
export function isToday(date: string | Date | number): boolean {
  if (!date) return false;
  
  const dateObj = new Date(date);
  const today = new Date();
  
  return dateObj.toDateString() === today.toDateString();
}

/**
 * Check if a date is yesterday
 */
export function isYesterday(date: string | Date | number): boolean {
  if (!date) return false;
  
  const dateObj = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return dateObj.toDateString() === yesterday.toDateString();
}

/**
 * Check if a date is tomorrow
 */
export function isTomorrow(date: string | Date | number): boolean {
  if (!date) return false;
  
  const dateObj = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return dateObj.toDateString() === tomorrow.toDateString();
}

/**
 * Add days to a date
 */
export function addDays(date: string | Date | number, days: number): Date {
  const dateObj = new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
}

/**
 * Subtract days from a date
 */
export function subtractDays(date: string | Date | number, days: number): Date {
  return addDays(date, -days);
}

/**
 * Add months to a date
 */
export function addMonths(date: string | Date | number, months: number): Date {
  const dateObj = new Date(date);
  dateObj.setMonth(dateObj.getMonth() + months);
  return dateObj;
}

/**
 * Add years to a date
 */
export function addYears(date: string | Date | number, years: number): Date {
  const dateObj = new Date(date);
  dateObj.setFullYear(dateObj.getFullYear() + years);
  return dateObj;
}

/**
 * Get the start of day for a date
 */
export function startOfDay(date: string | Date | number): Date {
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
}

/**
 * Get the end of day for a date
 */
export function endOfDay(date: string | Date | number): Date {
  const dateObj = new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
}

/**
 * Get the start of week for a date
 */
export function startOfWeek(date: string | Date | number): Date {
  const dateObj = new Date(date);
  const day = dateObj.getDay();
  const diff = dateObj.getDate() - day;
  return new Date(dateObj.setDate(diff));
}

/**
 * Get the end of week for a date
 */
export function endOfWeek(date: string | Date | number): Date {
  const dateObj = new Date(date);
  const day = dateObj.getDay();
  const diff = dateObj.getDate() - day + 6;
  return endOfDay(new Date(dateObj.setDate(diff)));
}

/**
 * Get the start of month for a date
 */
export function startOfMonth(date: string | Date | number): Date {
  const dateObj = new Date(date);
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
}

/**
 * Get the end of month for a date
 */
export function endOfMonth(date: string | Date | number): Date {
  const dateObj = new Date(date);
  return endOfDay(new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0));
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: string | Date | number): number {
  if (!dateOfBirth) return 0;
  
  const dob = new Date(dateOfBirth);
  const today = new Date();
  
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return Math.max(0, age);
}

/**
 * Check if date is in the past
 */
export function isPast(date: string | Date | number): boolean {
  if (!date) return false;
  return new Date(date) < new Date();
}

/**
 * Check if date is in the future
 */
export function isFuture(date: string | Date | number): boolean {
  if (!date) return false;
  return new Date(date) > new Date();
}

/**
 * Get days between two dates
 */
export function daysBetween(date1: string | Date | number, date2: string | Date | number): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format duration in milliseconds to human readable string
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Check if date is valid
 */
export function isValidDate(date: any): boolean {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}
