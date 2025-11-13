import { Injectable } from '@nestjs/common';
import { TimePeriod } from '../enums/time-period.enum';

import { BaseService } from '@/common/base';
/**
 * Date Range Service
 * Handles all date and time period calculations for analytics
 *
 * Responsibilities:
 * - Convert time period enums to date ranges
 * - Calculate previous periods for comparison
 * - Generate date arrays for time series
 * - Calculate week numbers and date utilities
 */
@Injectable()
export class DateRangeService extends BaseService {
  /**
   * Get date range from period enum
   */
  getDateRange(
    period: TimePeriod,
    customRange?: { start: Date; end: Date },
  ): { start: Date; end: Date } {
    const end = new Date();
    let start = new Date();

    switch (period) {
      case TimePeriod.LAST_7_DAYS:
        start.setDate(end.getDate() - 7);
        break;
      case TimePeriod.LAST_30_DAYS:
        start.setDate(end.getDate() - 30);
        break;
      case TimePeriod.LAST_90_DAYS:
        start.setDate(end.getDate() - 90);
        break;
      case TimePeriod.LAST_6_MONTHS:
        start.setMonth(end.getMonth() - 6);
        break;
      case TimePeriod.LAST_YEAR:
        start.setFullYear(end.getFullYear() - 1);
        break;
      case TimePeriod.CURRENT_SCHOOL_YEAR:
        const currentYear = end.getFullYear();
        const schoolYearStart =
          end.getMonth() >= 8 ? currentYear : currentYear - 1;
        start = new Date(schoolYearStart, 8, 1);
        break;
      case TimePeriod.CUSTOM:
        if (customRange) return customRange;
        break;
    }

    return { start, end };
  }

  /**
   * Get previous period for comparison
   */
  getPreviousPeriod(
    start: Date,
    end: Date,
  ): { start: Date; end: Date } {
    const duration = end.getTime() - start.getTime();
    return {
      start: new Date(start.getTime() - duration),
      end: new Date(start.getTime()),
    };
  }

  /**
   * Generate array of dates in range
   */
  generateDateRange(start: Date, end: Date): Date[] {
    const dates: Date[] = [];
    const current = new Date(start);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  /**
   * Get week number of year
   */
  getWeekNumber(date: Date): number {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  /**
   * Get period duration in days
   */
  getPeriodDays(period: TimePeriod): number {
    switch (period) {
      case TimePeriod.LAST_7_DAYS:
        return 7;
      case TimePeriod.LAST_30_DAYS:
        return 30;
      case TimePeriod.LAST_90_DAYS:
        return 90;
      case TimePeriod.LAST_6_MONTHS:
        return 180;
      case TimePeriod.LAST_YEAR:
        return 365;
      default:
        return 30;
    }
  }
}
