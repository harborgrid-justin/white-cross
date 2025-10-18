/**
 * WC-GEN-328 | dateHelpers.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../logging/logger | Dependencies: ../logging/logger
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces, types, constants, functions, default export | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Date Utilities
 * Common date operations and formatting for healthcare applications
 */

import { logger } from '../logging/logger';

/**
 * Date formatting options for different contexts
 */
export const DATE_FORMATS = {
  US_SHORT: 'MM/dd/yyyy',           // 12/25/2024
  US_LONG: 'MMMM d, yyyy',          // December 25, 2024
  ISO_DATE: 'yyyy-MM-dd',           // 2024-12-25
  ISO_DATETIME: 'yyyy-MM-dd HH:mm:ss', // 2024-12-25 14:30:00
  MEDICAL: 'dd-MMM-yyyy',           // 25-Dec-2024 (common in medical records)
  READABLE: 'MMM d, yyyy h:mm a'    // Dec 25, 2024 2:30 PM
} as const;

export type DateFormat = keyof typeof DATE_FORMATS;

/**
 * Age calculation result
 */
export interface AgeInfo {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  ageGroup: 'infant' | 'toddler' | 'preschool' | 'elementary' | 'middle' | 'high' | 'adult';
}

/**
 * Calculate age from date of birth
 * Common in healthcare applications for pediatric care
 */
export function calculateAge(dateOfBirth: Date | string): AgeInfo {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const now = new Date();

  if (!isValidDate(dob) || dob > now) {
    logger.warn('Invalid date of birth provided', { dateOfBirth });
    return {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      ageGroup: 'infant'
    };
  }

  // Calculate age components
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();

  // Adjust for negative values
  if (days < 0) {
    months--;
    const daysInLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += daysInLastMonth;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Calculate total days
  const totalDays = Math.floor((now.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24));

  // Determine age group (useful for school health)
  let ageGroup: AgeInfo['ageGroup'] = 'adult';
  if (years < 1) ageGroup = 'infant';
  else if (years < 3) ageGroup = 'toddler';
  else if (years < 6) ageGroup = 'preschool';
  else if (years < 11) ageGroup = 'elementary';
  else if (years < 14) ageGroup = 'middle';
  else if (years < 18) ageGroup = 'high';

  return {
    years,
    months,
    days,
    totalDays,
    ageGroup
  };
}

/**
 * Validate if a value is a valid date
 */
export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string, format: DateFormat = 'US_SHORT'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (!isValidDate(d)) {
    logger.warn('Invalid date provided for formatting', { date });
    return '';
  }

  // Simple formatter - in production you might want to use a library like date-fns
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNamesShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const pad = (num: number) => num.toString().padStart(2, '0');

  switch (format) {
    case 'US_SHORT':
      return `${pad(month)}/${pad(day)}/${year}`;
    case 'US_LONG':
      return `${monthNames[month - 1]} ${day}, ${year}`;
    case 'ISO_DATE':
      return `${year}-${pad(month)}-${pad(day)}`;
    case 'ISO_DATETIME':
      return `${year}-${pad(month)}-${pad(day)} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    case 'MEDICAL':
      return `${pad(day)}-${monthNamesShort[month - 1]}-${year}`;
    case 'READABLE':
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 || 12;
      return `${monthNamesShort[month - 1]} ${day}, ${year} ${hours12}:${pad(minutes)} ${ampm}`;
    default:
      return d.toLocaleDateString();
  }
}

/**
 * Get start and end of day for a given date
 */
export function getDateRange(date: Date | string): { start: Date; end: Date } {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  
  if (!isValidDate(d)) {
    const now = new Date();
    return {
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    };
  }

  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

  return { start, end };
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  if (!isValidDate(d)) return false;

  return d.getFullYear() === today.getFullYear() &&
         d.getMonth() === today.getMonth() &&
         d.getDate() === today.getDate();
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValidDate(d)) return false;
  return d < new Date();
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValidDate(d)) return false;
  return d > new Date();
}

/**
 * Add days to a date
 */
export function addDays(date: Date | string, days: number): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  if (!isValidDate(d)) return new Date();
  
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add months to a date
 */
export function addMonths(date: Date | string, months: number): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  if (!isValidDate(d)) return new Date();
  
  const result = new Date(d);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Add years to a date
 */
export function addYears(date: Date | string, years: number): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  if (!isValidDate(d)) return new Date();
  
  const result = new Date(d);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * Get difference between two dates in days
 */
export function getDaysDifference(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  if (!isValidDate(d1) || !isValidDate(d2)) return 0;
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Convert date to ISO string safely
 */
export function toISOString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValidDate(d)) return new Date().toISOString();
  return d.toISOString();
}

/**
 * Parse date string safely
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  
  const parsed = new Date(dateString);
  return isValidDate(parsed) ? parsed : null;
}

/**
 * Get age-appropriate vaccination schedule periods
 * Used in school health for tracking immunization compliance
 */
export function getVaccinationPeriods(dateOfBirth: Date | string): {
  period: string;
  ageRange: string;
  dueDate: Date;
}[] {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  if (!isValidDate(dob)) return [];

  return [
    { period: 'Birth', ageRange: '0-2 months', dueDate: addDays(dob, 60) },
    { period: '2 months', ageRange: '2-4 months', dueDate: addDays(dob, 120) },
    { period: '4 months', ageRange: '4-6 months', dueDate: addDays(dob, 180) },
    { period: '6 months', ageRange: '6-12 months', dueDate: addDays(dob, 365) },
    { period: '12-15 months', ageRange: '12-18 months', dueDate: addMonths(dob, 18) },
    { period: '4-6 years', ageRange: 'School entry', dueDate: addYears(dob, 5) },
    { period: '11-12 years', ageRange: 'Middle school', dueDate: addYears(dob, 11) }
  ];
}

export default {
  calculateAge,
  isValidDate,
  formatDate,
  getDateRange,
  isToday,
  isPast,
  isFuture,
  addDays,
  addMonths,
  addYears,
  getDaysDifference,
  toISOString,
  parseDate,
  getVaccinationPeriods
};