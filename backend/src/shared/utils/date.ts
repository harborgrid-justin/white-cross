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

import _ from 'lodash';

/**
 * Shared date utility functions
 * Provides date manipulation and validation functions
 */

/**
 * Checks if date is today
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
 * Checks if date is within last N days
 */
export const isWithinLastDays = (date: Date | string, days: number) => {
  const compareDate = new Date(date);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return compareDate >= cutoffDate;
};

/**
 * Groups dates by day/week/month
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
 * Calculates age from date of birth
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
