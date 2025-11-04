/**
 * Unit Tests for Date Utility Functions
 *
 * Tests all date/time utilities including:
 * - Date formatting
 * - Date parsing
 * - Date calculations
 * - Relative time
 * - Date validation
 *
 * @module lib/utils/date.test
 */

import {
  formatDateForApi,
  parseDateFromApi,
  formatDateForDisplay,
  isDateExpired,
  getTimeUntilExpiry,
  getRelativeTime,
  addDays,
  addMonths,
  startOfDay,
  endOfDay,
  isSameDay,
  calculateAge,
  formatTime,
  isValidISODate,
  getDateRange,
} from './date';

describe('formatDateForApi', () => {
  it('should format Date object to ISO string', () => {
    const date = new Date('2025-10-26T14:30:00.000Z');
    expect(formatDateForApi(date)).toBe('2025-10-26T14:30:00.000Z');
  });

  it('should format date string to ISO string', () => {
    const result = formatDateForApi('2025-10-26');
    expect(result).toContain('2025-10-26');
  });

  it('should handle timestamp', () => {
    const timestamp = new Date('2025-10-26T14:30:00.000Z').getTime();
    expect(formatDateForApi(timestamp)).toBe('2025-10-26T14:30:00.000Z');
  });

  it('should fallback to current date on invalid input', () => {
    const result = formatDateForApi('invalid');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});

describe('parseDateFromApi', () => {
  it('should parse ISO date string', () => {
    const result = parseDateFromApi('2025-10-26T14:30:00.000Z');
    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2025);
  });

  it('should fallback to current date on invalid input', () => {
    const result = parseDateFromApi('invalid');
    expect(result).toBeInstanceOf(Date);
  });
});

describe('formatDateForDisplay', () => {
  const testDate = new Date('2025-10-26T14:30:00.000Z');

  it('should format date in short format', () => {
    const result = formatDateForDisplay(testDate, 'short');
    expect(result).toMatch(/Oct 26, 2025/);
  });

  it('should format date in long format', () => {
    const result = formatDateForDisplay(testDate, 'long');
    expect(result).toMatch(/October 26, 2025/);
  });

  it('should format time only', () => {
    const result = formatDateForDisplay(testDate, 'time');
    expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
  });

  it('should format datetime', () => {
    const result = formatDateForDisplay(testDate, 'datetime');
    expect(result).toMatch(/Oct 26, 2025.*\d{1,2}:\d{2} (AM|PM)/);
  });

  it('should handle invalid date', () => {
    expect(formatDateForDisplay('invalid')).toBe('Invalid Date');
  });
});

describe('isDateExpired', () => {
  it('should return true for past dates', () => {
    const pastDate = new Date('2020-01-01');
    expect(isDateExpired(pastDate)).toBe(true);
  });

  it('should return false for future dates', () => {
    const futureDate = new Date('2030-01-01');
    expect(isDateExpired(futureDate)).toBe(false);
  });

  it('should handle string dates', () => {
    expect(isDateExpired('2020-01-01')).toBe(true);
    expect(isDateExpired('2030-01-01')).toBe(false);
  });
});

describe('getTimeUntilExpiry', () => {
  it('should return "Expired" for past dates', () => {
    const pastDate = new Date('2020-01-01');
    expect(getTimeUntilExpiry(pastDate)).toBe('Expired');
  });

  it('should return days and hours for far future dates', () => {
    const futureDate = new Date(Date.now() + 2.5 * 24 * 60 * 60 * 1000);
    const result = getTimeUntilExpiry(futureDate);
    expect(result).toMatch(/^\d+d \d+h$/);
  });

  it('should return hours and minutes for near future dates', () => {
    const futureDate = new Date(Date.now() + 3.5 * 60 * 60 * 1000);
    const result = getTimeUntilExpiry(futureDate);
    expect(result).toMatch(/^\d+h \d+m$/);
  });

  it('should return minutes for very near future dates', () => {
    const futureDate = new Date(Date.now() + 30 * 60 * 1000);
    const result = getTimeUntilExpiry(futureDate);
    expect(result).toMatch(/^\d+m$/);
  });
});

describe('getRelativeTime', () => {
  it('should return seconds for recent times', () => {
    const recentDate = new Date(Date.now() - 30 * 1000);
    const result = getRelativeTime(recentDate);
    expect(result).toMatch(/\d+ seconds ago/);
  });

  it('should return minutes for times within an hour', () => {
    const recentDate = new Date(Date.now() - 30 * 60 * 1000);
    const result = getRelativeTime(recentDate);
    expect(result).toMatch(/\d+ minutes ago/);
  });

  it('should return hours for times within a day', () => {
    const recentDate = new Date(Date.now() - 5 * 60 * 60 * 1000);
    const result = getRelativeTime(recentDate);
    expect(result).toMatch(/\d+ hours ago/);
  });

  it('should return days for times within a week', () => {
    const recentDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const result = getRelativeTime(recentDate);
    expect(result).toMatch(/\d+ days ago/);
  });

  it('should handle future dates with "from now"', () => {
    const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const result = getRelativeTime(futureDate);
    expect(result).toMatch(/\d+ days from now/);
  });
});

describe('addDays', () => {
  it('should add days to a date', () => {
    const date = new Date('2025-10-26');
    const result = addDays(date, 7);
    expect(result.getDate()).toBe(new Date('2025-11-02').getDate());
  });

  it('should subtract days with negative number', () => {
    const date = new Date('2025-10-26');
    const result = addDays(date, -3);
    expect(result.getDate()).toBe(new Date('2025-10-23').getDate());
  });

  it('should handle month boundaries', () => {
    const date = new Date('2025-10-30');
    const result = addDays(date, 5);
    expect(result.getMonth()).toBe(10); // November (0-indexed)
  });
});

describe('addMonths', () => {
  it('should add months to a date', () => {
    const date = new Date('2025-10-26');
    const result = addMonths(date, 3);
    expect(result.getMonth()).toBe(0); // January (0-indexed)
    expect(result.getFullYear()).toBe(2026);
  });

  it('should subtract months with negative number', () => {
    const date = new Date('2025-10-26');
    const result = addMonths(date, -2);
    expect(result.getMonth()).toBe(7); // August (0-indexed)
  });
});

describe('startOfDay', () => {
  it('should set time to midnight', () => {
    const date = new Date('2025-10-26T14:30:00.000Z');
    const result = startOfDay(date);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });
});

describe('endOfDay', () => {
  it('should set time to end of day', () => {
    const date = new Date('2025-10-26T14:30:00.000Z');
    const result = endOfDay(date);
    expect(result.getHours()).toBe(23);
    expect(result.getMinutes()).toBe(59);
    expect(result.getSeconds()).toBe(59);
    expect(result.getMilliseconds()).toBe(999);
  });
});

describe('isSameDay', () => {
  it('should return true for same day', () => {
    const date1 = new Date('2025-10-26T10:00:00');
    const date2 = new Date('2025-10-26T18:00:00');
    expect(isSameDay(date1, date2)).toBe(true);
  });

  it('should return false for different days', () => {
    const date1 = new Date('2025-10-26');
    const date2 = new Date('2025-10-27');
    expect(isSameDay(date1, date2)).toBe(false);
  });

  it('should handle string dates', () => {
    expect(isSameDay('2025-10-26', '2025-10-26')).toBe(true);
    expect(isSameDay('2025-10-26', '2025-10-27')).toBe(false);
  });
});

describe('calculateAge', () => {
  beforeAll(() => {
    // Mock current date to 2025-11-04
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-11-04'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should calculate age correctly', () => {
    expect(calculateAge('2015-01-01')).toBe(10);
  });

  it('should handle birthday not yet occurred this year', () => {
    expect(calculateAge('2015-12-01')).toBe(9);
  });

  it('should handle birthday today', () => {
    expect(calculateAge('2015-11-04')).toBe(10);
  });
});

describe('formatTime', () => {
  it('should format AM time', () => {
    expect(formatTime(9, 30)).toBe('9:30 AM');
  });

  it('should format PM time', () => {
    expect(formatTime(14, 30)).toBe('2:30 PM');
  });

  it('should handle midnight', () => {
    expect(formatTime(0, 0)).toBe('12:00 AM');
  });

  it('should handle noon', () => {
    expect(formatTime(12, 0)).toBe('12:00 PM');
  });

  it('should pad single digit minutes', () => {
    expect(formatTime(9, 5)).toBe('9:05 AM');
  });
});

describe('isValidISODate', () => {
  it('should return true for valid ISO date', () => {
    expect(isValidISODate('2025-10-26T14:30:00.000Z')).toBe(true);
  });

  it('should return false for invalid date string', () => {
    expect(isValidISODate('invalid')).toBe(false);
  });

  it('should return false for non-ISO format', () => {
    expect(isValidISODate('10/26/2025')).toBe(false);
  });
});

describe('getDateRange', () => {
  beforeAll(() => {
    // Mock current date to 2025-11-04 (Tuesday)
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-11-04T12:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return today range', () => {
    const { start, end } = getDateRange('today');
    expect(start.getHours()).toBe(0);
    expect(end.getHours()).toBe(23);
    expect(isSameDay(start, end)).toBe(true);
  });

  it('should return yesterday range', () => {
    const { start, end } = getDateRange('yesterday');
    const yesterday = new Date('2025-11-03');
    expect(isSameDay(start, yesterday)).toBe(true);
    expect(isSameDay(end, yesterday)).toBe(true);
  });

  it('should return this week range', () => {
    const { start, end } = getDateRange('thisWeek');
    expect(start.getDay()).toBe(2); // Tuesday (start of week in this implementation)
    expect(end.getDay()).toBe(1); // Monday (end of week)
  });

  it('should return this month range', () => {
    const { start, end } = getDateRange('thisMonth');
    expect(start.getDate()).toBe(1);
    expect(start.getMonth()).toBe(10); // November (0-indexed)
  });

  it('should return this year range', () => {
    const { start, end } = getDateRange('thisYear');
    expect(start.getMonth()).toBe(0); // January
    expect(start.getDate()).toBe(1);
    expect(end.getMonth()).toBe(11); // December
    expect(end.getDate()).toBe(31);
  });
});
