import { Test, TestingModule } from '@nestjs/testing';
import { DateRangeService } from './date-range.service';
import { TimePeriod } from '../enums/time-period.enum';

describe('DateRangeService', () => {
  let service: DateRangeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateRangeService],
    }).compile();

    service = module.get<DateRangeService>(DateRangeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDateRange', () => {
    let currentDate: Date;

    beforeEach(() => {
      currentDate = new Date();
    });

    it('should return last 7 days range', () => {
      const result = service.getDateRange(TimePeriod.LAST_7_DAYS);

      const expectedStart = new Date(currentDate);
      expectedStart.setDate(currentDate.getDate() - 7);

      expect(result.start.getDate()).toBe(expectedStart.getDate());
      expect(result.end.getDate()).toBe(currentDate.getDate());
    });

    it('should return last 30 days range', () => {
      const result = service.getDateRange(TimePeriod.LAST_30_DAYS);

      const expectedStart = new Date(currentDate);
      expectedStart.setDate(currentDate.getDate() - 30);

      expect(result.start.getDate()).toBe(expectedStart.getDate());
    });

    it('should return last 90 days range', () => {
      const result = service.getDateRange(TimePeriod.LAST_90_DAYS);

      const expectedStart = new Date(currentDate);
      expectedStart.setDate(currentDate.getDate() - 90);

      expect(result.start.getDate()).toBe(expectedStart.getDate());
    });

    it('should return last 6 months range', () => {
      const result = service.getDateRange(TimePeriod.LAST_6_MONTHS);

      const expectedStart = new Date(currentDate);
      expectedStart.setMonth(currentDate.getMonth() - 6);

      expect(result.start.getMonth()).toBe(expectedStart.getMonth());
    });

    it('should return last year range', () => {
      const result = service.getDateRange(TimePeriod.LAST_YEAR);

      const expectedStart = new Date(currentDate);
      expectedStart.setFullYear(currentDate.getFullYear() - 1);

      expect(result.start.getFullYear()).toBe(expectedStart.getFullYear());
    });

    it('should return current school year range when after September', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-10-15'));

      const result = service.getDateRange(TimePeriod.CURRENT_SCHOOL_YEAR);

      expect(result.start.getFullYear()).toBe(2024);
      expect(result.start.getMonth()).toBe(8); // September (0-indexed)
      expect(result.start.getDate()).toBe(1);

      jest.useRealTimers();
    });

    it('should return current school year range when before September', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-05-15'));

      const result = service.getDateRange(TimePeriod.CURRENT_SCHOOL_YEAR);

      expect(result.start.getFullYear()).toBe(2023);
      expect(result.start.getMonth()).toBe(8); // September

      jest.useRealTimers();
    });

    it('should return custom range when provided', () => {
      const customRange = {
        start: new Date('2024-01-01'),
        end: new Date('2024-03-31'),
      };

      const result = service.getDateRange(TimePeriod.CUSTOM, customRange);

      expect(result.start).toEqual(customRange.start);
      expect(result.end).toEqual(customRange.end);
    });

    it('should handle custom period without custom range', () => {
      const result = service.getDateRange(TimePeriod.CUSTOM);

      expect(result.start).toBeInstanceOf(Date);
      expect(result.end).toBeInstanceOf(Date);
    });
  });

  describe('getPreviousPeriod', () => {
    it('should calculate previous period correctly', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');

      const result = service.getPreviousPeriod(start, end);

      expect(result.end.getTime()).toBe(start.getTime());
      expect(result.start.getTime()).toBe(
        start.getTime() - (end.getTime() - start.getTime()),
      );
    });

    it('should handle single day period', () => {
      const start = new Date('2024-01-15T00:00:00');
      const end = new Date('2024-01-15T23:59:59');

      const result = service.getPreviousPeriod(start, end);

      expect(result.end.getTime()).toBe(start.getTime());
    });

    it('should handle year-long period', () => {
      const start = new Date('2023-01-01');
      const end = new Date('2024-01-01');

      const result = service.getPreviousPeriod(start, end);

      const expectedStart = new Date('2022-01-01');
      expect(result.start.getFullYear()).toBe(expectedStart.getFullYear());
      expect(result.end.getTime()).toBe(start.getTime());
    });
  });

  describe('generateDateRange', () => {
    it('should generate array of dates for range', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-05');

      const result = service.generateDateRange(start, end);

      expect(result.length).toBe(5);
      expect(result[0].toDateString()).toBe(start.toDateString());
      expect(result[4].toDateString()).toBe(end.toDateString());
    });

    it('should handle single day range', () => {
      const date = new Date('2024-01-15');

      const result = service.generateDateRange(date, date);

      expect(result.length).toBe(1);
      expect(result[0].toDateString()).toBe(date.toDateString());
    });

    it('should handle month-long range', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');

      const result = service.generateDateRange(start, end);

      expect(result.length).toBe(31);
    });

    it('should not modify original dates', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-05');
      const originalStart = new Date(start);
      const originalEnd = new Date(end);

      service.generateDateRange(start, end);

      expect(start.getTime()).toBe(originalStart.getTime());
      expect(end.getTime()).toBe(originalEnd.getTime());
    });

    it('should handle cross-month range', () => {
      const start = new Date('2024-01-30');
      const end = new Date('2024-02-02');

      const result = service.generateDateRange(start, end);

      expect(result.length).toBe(4);
      expect(result[0].getMonth()).toBe(0); // January
      expect(result[3].getMonth()).toBe(1); // February
    });
  });

  describe('getWeekNumber', () => {
    it('should return correct week number for January 1st', () => {
      const date = new Date('2024-01-01');
      const weekNumber = service.getWeekNumber(date);

      expect(weekNumber).toBeGreaterThan(0);
      expect(weekNumber).toBeLessThan(54);
    });

    it('should return correct week number for middle of year', () => {
      const date = new Date('2024-07-01');
      const weekNumber = service.getWeekNumber(date);

      expect(weekNumber).toBeGreaterThan(20);
      expect(weekNumber).toBeLessThan(35);
    });

    it('should return correct week number for end of year', () => {
      const date = new Date('2024-12-31');
      const weekNumber = service.getWeekNumber(date);

      expect(weekNumber).toBeGreaterThan(50);
    });

    it('should handle leap year correctly', () => {
      const date = new Date('2024-02-29');
      const weekNumber = service.getWeekNumber(date);

      expect(weekNumber).toBeGreaterThan(0);
      expect(weekNumber).toBeLessThan(54);
    });

    it('should return same week number for dates in same week', () => {
      const monday = new Date('2024-01-08');
      const friday = new Date('2024-01-12');

      const mondayWeek = service.getWeekNumber(monday);
      const fridayWeek = service.getWeekNumber(friday);

      expect(mondayWeek).toBe(fridayWeek);
    });
  });

  describe('getPeriodDays', () => {
    it('should return 7 for LAST_7_DAYS', () => {
      const days = service.getPeriodDays(TimePeriod.LAST_7_DAYS);
      expect(days).toBe(7);
    });

    it('should return 30 for LAST_30_DAYS', () => {
      const days = service.getPeriodDays(TimePeriod.LAST_30_DAYS);
      expect(days).toBe(30);
    });

    it('should return 90 for LAST_90_DAYS', () => {
      const days = service.getPeriodDays(TimePeriod.LAST_90_DAYS);
      expect(days).toBe(90);
    });

    it('should return 180 for LAST_6_MONTHS', () => {
      const days = service.getPeriodDays(TimePeriod.LAST_6_MONTHS);
      expect(days).toBe(180);
    });

    it('should return 365 for LAST_YEAR', () => {
      const days = service.getPeriodDays(TimePeriod.LAST_YEAR);
      expect(days).toBe(365);
    });

    it('should return 30 for unknown period', () => {
      const days = service.getPeriodDays('UNKNOWN_PERIOD' as TimePeriod);
      expect(days).toBe(30);
    });

    it('should return 30 for CUSTOM period', () => {
      const days = service.getPeriodDays(TimePeriod.CUSTOM);
      expect(days).toBe(30);
    });
  });
});
