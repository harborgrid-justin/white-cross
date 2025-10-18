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