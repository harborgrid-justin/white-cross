/**
 * LOC: DF38C6FE72
 * File: /backend/src/shared/utils/date.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - lodashUtils.ts (utils/lodashUtils.ts)
 */

/**
 * File: /backend/src/shared/utils/date.ts
 * Locator: WC-UTL-DAT-073
 * Purpose: Healthcare Date Utilities - Medical timeline and age calculations
 * 
 * Upstream: lodash library, independent utility module
 * Downstream: ../services/*, appointment scheduling, medication timing, age validation
 * Dependencies: lodash, Date API, healthcare business logic
 * Exports: isToday, isWithinLastDays, groupByPeriod, calculateAge
 * 
 * LLM Context: Date manipulation utilities for White Cross healthcare system.
 * Handles age calculations, appointment grouping, medication schedules, timeline analysis.
 * Critical for HIPAA compliance date tracking and healthcare business rules.
 */

import * as _ from 'lodash';

/**
 * Shared date utility functions
 * Provides date manipulation and validation functions
 */

/**
 * Checks if a given date is today (ignoring time component).
 * Compares only year, month, and day values.
 *
 * @param {Date | string} date - Date to check (Date object or ISO string)
 * @returns {boolean} True if date is today, false otherwise
 *
 * @example
 * ```typescript
 * isToday(new Date());                    // true
 * isToday('2024-10-25');                  // true (if today is 2024-10-25)
 * isToday('2024-10-24');                  // false (if today is 2024-10-25)
 * isToday(new Date('2024-10-25T23:59')); // true (time ignored)
 * ```
 */
export const isToday = (date: Date | string) => {
  const today = new Date();
  const compareDate = new Date(date);
  return _.isEqual(
    { year: today.getFullYear(), month: today.getMonth(), date: today.getDate() },
    { year: compareDate.getFullYear(), month: compareDate.getMonth(), date: compareDate.getDate() }
  );
};

/**
 * Checks if a date falls within the last N days from today.
 * Useful for filtering recent health records, appointments, or medication administrations.
 *
 * @param {Date | string} date - Date to check (Date object or ISO string)
 * @param {number} days - Number of days to look back (must be positive)
 * @returns {boolean} True if date is within the last N days (inclusive), false otherwise
 *
 * @example
 * ```typescript
 * // If today is 2024-10-25
 * isWithinLastDays('2024-10-24', 7);  // true (yesterday)
 * isWithinLastDays('2024-10-20', 7);  // true (5 days ago)
 * isWithinLastDays('2024-10-15', 7);  // false (10 days ago)
 * isWithinLastDays('2024-10-25', 1);  // true (today)
 *
 * // Healthcare use case: Recent medication administrations
 * const recentMeds = medications.filter(med =>
 *   isWithinLastDays(med.administeredAt, 30)
 * );
 * ```
 */
export const isWithinLastDays = (date: Date | string, days: number) => {
  const compareDate = new Date(date);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return compareDate >= cutoffDate;
};

/**
 * Groups items by date period (day, week, or month).
 * Useful for analytics, reporting, and timeline visualization.
 *
 * Week calculation: Uses Sunday as the first day of the week (US standard).
 *
 * @template T - Item type that extends object with date property
 * @param {T[]} items - Array of items with date properties
 * @param {'day' | 'week' | 'month'} period - Period to group by
 * @returns {Record<string, T[]>} Object mapping period identifiers to arrays of items
 *
 * @example
 * ```typescript
 * interface Visit { date: Date; studentId: string; reason: string }
 * const visits: Visit[] = [
 *   { date: new Date('2024-10-21'), studentId: 'S1', reason: 'Checkup' },
 *   { date: new Date('2024-10-22'), studentId: 'S2', reason: 'Injury' },
 *   { date: new Date('2024-10-28'), studentId: 'S3', reason: 'Medication' }
 * ];
 *
 * // Group by day
 * const byDay = groupByPeriod(visits, 'day');
 * // Result: { 'Mon Oct 21 2024': [visit1], 'Tue Oct 22 2024': [visit2], ... }
 *
 * // Group by week (Sunday start)
 * const byWeek = groupByPeriod(visits, 'week');
 * // Result: { 'Sun Oct 20 2024': [visit1, visit2], 'Sun Oct 27 2024': [visit3] }
 *
 * // Group by month
 * const byMonth = groupByPeriod(visits, 'month');
 * // Result: { '2024-9': [all October visits] } (month is 0-indexed)
 * ```
 */
export const groupByPeriod = <T extends { date: Date | string }>(
  items: T[],
  period: 'day' | 'week' | 'month'
) => {
  return _.groupBy(items, (item: T) => {
    const date = new Date(item.date);
    switch (period) {
      case 'day':
        return date.toDateString();
      case 'week': {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return weekStart.toDateString();
      }
      case 'month':
        return `${date.getFullYear()}-${date.getMonth()}`;
      default:
        return date.toDateString();
    }
  });
};

/**
 * Calculates age in years from date of birth.
 * Accounts for whether birthday has occurred this year.
 * Critical for pediatric healthcare age-based protocols and dosing calculations.
 *
 * @param {Date | string} dateOfBirth - Date of birth (Date object or ISO string)
 * @returns {number} Age in completed years
 *
 * @example
 * ```typescript
 * // If today is 2024-10-25
 * calculateAge('2010-05-15');  // 14 (birthday passed this year)
 * calculateAge('2010-11-20');  // 13 (birthday hasn't occurred yet)
 * calculateAge(new Date('2015-10-25')); // 9 (birthday is today)
 *
 * // Healthcare use case: Age-appropriate medication dosing
 * const patient = { dob: '2010-05-15', weight: 50 };
 * const age = calculateAge(patient.dob);
 * const dosage = age < 12 ? pediatricDose : adultDose;
 * ```
 *
 * @remarks
 * Returns integer years only. For precise age calculations requiring months/days,
 * consider using a dedicated date library like date-fns or moment.js.
 */
export const calculateAge = (dateOfBirth: Date | string) => {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

export default {
  isToday,
  isWithinLastDays,
  groupByPeriod,
  calculateAge
};
