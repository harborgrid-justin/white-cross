import { Injectable } from '@nestjs/common';
import { TrendDirection } from '../enums/trend-direction.enum';
import { TimeSeriesDataPoint } from '../interfaces/health-analytics.interfaces';
import { HealthRecord } from '../../database/models/health-record.model';
import { DateRangeService } from './date-range.service';

import { BaseService } from '@/common/base';
/**
 * Trend Calculation Service
 * Provides statistical analysis and trend calculation methods
 *
 * Responsibilities:
 * - Calculate trend directions and percent changes
 * - Apply moving averages (SMA, EMA)
 * - Aggregate time series data
 * - Statistical utilities and calculations
 */
@Injectable()
export class TrendCalculationService extends BaseService {
  constructor(private readonly dateRangeService: DateRangeService) {}

  /**
   * Calculate trend direction based on previous and current values
   */
  calculateTrend(previous: number, current: number): TrendDirection {
    if (previous === 0) return TrendDirection.STABLE;
    const percentChange = ((current - previous) / previous) * 100;

    if (percentChange > 5) return TrendDirection.INCREASING;
    if (percentChange < -5) return TrendDirection.DECREASING;
    return TrendDirection.STABLE;
  }

  /**
   * Apply simple moving average for smoothing
   */
  applyMovingAverage(
    data: TimeSeriesDataPoint[],
    window: number,
  ): TimeSeriesDataPoint[] {
    return data.map((point, index) => {
      const start = Math.max(0, index - Math.floor(window / 2));
      const end = Math.min(data.length, index + Math.ceil(window / 2));
      const subset = data.slice(start, end);
      const avg = subset.reduce((sum, p) => sum + p.value, 0) / subset.length;

      return { ...point, value: Number(avg.toFixed(2)) };
    });
  }

  /**
   * Calculate exponential moving average
   */
  calculateExponentialMovingAverage(
    values: number[],
    alpha: number,
  ): number[] {
    if (values.length === 0) return [];

    const ema: number[] = [values[0]];
    for (let i = 1; i < values.length; i++) {
      ema.push(alpha * values[i] + (1 - alpha) * ema[i - 1]);
    }

    return ema;
  }

  /**
   * Aggregate records by week
   */
  aggregateByWeek(records: HealthRecord[]): number[] {
    const weekMap = new Map<number, number>();

    for (const record of records) {
      const weekNum = this.dateRangeService.getWeekNumber(record.recordDate);
      weekMap.set(weekNum, (weekMap.get(weekNum) || 0) + 1);
    }

    return Array.from(weekMap.values());
  }

  /**
   * Calculate percentage change between two values
   */
  calculatePercentageChange(previous: number, current: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  }

  /**
   * Calculate mean of an array of numbers
   */
  calculateMean(values: number[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return Number((sum / values.length).toFixed(2));
  }

  /**
   * Calculate standard deviation
   */
  calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = this.calculateMean(values);
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
    const variance = this.calculateMean(squaredDiffs);
    return Number(Math.sqrt(variance).toFixed(2));
  }

  /**
   * Detect if current value is an outlier using standard deviation
   */
  isOutlier(value: number, values: number[], threshold: number = 2): boolean {
    const mean = this.calculateMean(values);
    const stdDev = this.calculateStandardDeviation(values);
    return Math.abs(value - mean) > threshold * stdDev;
  }
}
