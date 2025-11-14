/**
 * Performance Tracking Service
 *
 * @module infrastructure/monitoring
 * @description Service responsible for tracking and storing performance entries
 * for detailed performance analysis and monitoring.
 */

import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { PerformanceEntry } from './interfaces/metrics.interface';

/**
 * PerformanceTrackingService
 *
 * @description Tracks application performance entries for analysis and monitoring.
 * Maintains a history of performance data with configurable limits.
 *
 * @example
 * ```typescript
 * performanceTrackingService.trackPerformance({
 *   name: 'database-query',
 *   duration: 125,
 *   timestamp: new Date().toISOString(),
 *   metadata: { query: 'SELECT * FROM users' }
 * });
 * ```
 */
@Injectable()
export class PerformanceTrackingService extends BaseService {
  constructor() {
    super("PerformanceTrackingService");
  }

  // Performance tracking storage
  private performanceHistory: PerformanceEntry[] = [];
  private readonly maxPerformanceEntries = 1000;

  /**
   * Track performance entry
   *
   * @param entry Performance entry
   */
  trackPerformance(entry: PerformanceEntry): void {
    this.performanceHistory.push(entry);

    // Keep history bounded
    if (this.performanceHistory.length > this.maxPerformanceEntries) {
      this.performanceHistory.shift();
    }
  }

  /**
   * Get recent performance entries
   *
   * @param limit Maximum number of entries to return
   * @returns Recent performance entries
   */
  getRecentPerformance(limit: number = 100): PerformanceEntry[] {
    return this.performanceHistory.slice(-limit);
  }

  /**
   * Get all performance entries
   *
   * @returns All performance entries
   */
  getAllPerformance(): PerformanceEntry[] {
    return [...this.performanceHistory];
  }

  /**
   * Get performance entries by name
   *
   * @param name Performance entry name
   * @param limit Maximum number of entries to return
   * @returns Filtered performance entries
   */
  getPerformanceByName(name: string, limit?: number): PerformanceEntry[] {
    const filtered = this.performanceHistory.filter(
      (entry) => entry.name === name,
    );
    return limit ? filtered.slice(-limit) : filtered;
  }

  /**
   * Get performance entries within time range
   *
   * @param startTime Start time (ISO string or timestamp)
   * @param endTime End time (ISO string or timestamp)
   * @returns Filtered performance entries
   */
  getPerformanceByTimeRange(
    startTime: string | number,
    endTime: string | number,
  ): PerformanceEntry[] {
    const start =
      typeof startTime === 'string'
        ? new Date(startTime).getTime()
        : startTime;
    const end =
      typeof endTime === 'string' ? new Date(endTime).getTime() : endTime;

    return this.performanceHistory.filter((entry) => {
      const entryTime = new Date(entry.timestamp).getTime();
      return entryTime >= start && entryTime <= end;
    });
  }

  /**
   * Calculate average duration for a specific performance entry name
   *
   * @param name Performance entry name
   * @param limit Number of recent entries to consider
   * @returns Average duration in milliseconds
   */
  getAverageDuration(name: string, limit?: number): number {
    const entries = this.getPerformanceByName(name, limit);
    if (entries.length === 0) {
      return 0;
    }

    const totalDuration = entries.reduce(
      (sum, entry) => sum + entry.duration,
      0,
    );
    return totalDuration / entries.length;
  }

  /**
   * Get performance statistics for a specific entry name
   *
   * @param name Performance entry name
   * @param limit Number of recent entries to consider
   * @returns Performance statistics
   */
  getPerformanceStats(
    name: string,
    limit?: number,
  ): {
    count: number;
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    p50Duration: number;
    p95Duration: number;
    p99Duration: number;
  } {
    const entries = this.getPerformanceByName(name, limit);

    if (entries.length === 0) {
      return {
        count: 0,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        p50Duration: 0,
        p95Duration: 0,
        p99Duration: 0,
      };
    }

    const durations = entries.map((e) => e.duration).sort((a, b) => a - b);
    const sum = durations.reduce((a, b) => a + b, 0);

    const p50Index = Math.floor(durations.length * 0.5);
    const p95Index = Math.floor(durations.length * 0.95);
    const p99Index = Math.floor(durations.length * 0.99);

    return {
      count: entries.length,
      avgDuration: sum / entries.length,
      minDuration: durations[0],
      maxDuration: durations[durations.length - 1],
      p50Duration: durations[p50Index],
      p95Duration: durations[p95Index],
      p99Duration: durations[p99Index],
    };
  }

  /**
   * Clear all performance entries
   */
  clearPerformance(): void {
    this.performanceHistory = [];
    this.logInfo('Performance history cleared');
  }

  /**
   * Clear old performance entries (older than specified time)
   *
   * @param olderThanMs Clear entries older than this many milliseconds
   */
  clearOldPerformance(olderThanMs: number): void {
    const cutoffTime = Date.now() - olderThanMs;
    const initialLength = this.performanceHistory.length;

    this.performanceHistory = this.performanceHistory.filter((entry) => {
      const entryTime = new Date(entry.timestamp).getTime();
      return entryTime >= cutoffTime;
    });

    const removedCount = initialLength - this.performanceHistory.length;
    this.logInfo(`Cleared ${removedCount} old performance entries`);
  }

  /**
   * Get total number of performance entries
   */
  getPerformanceCount(): number {
    return this.performanceHistory.length;
  }

  /**
   * Set maximum number of performance entries to store
   *
   * @param max Maximum number of entries
   */
  setMaxPerformanceEntries(max: number): void {
    if (max < 1) {
      throw new Error('Maximum performance entries must be at least 1');
    }

    const oldMax = this.maxPerformanceEntries;
    (this as any).maxPerformanceEntries = max;

    // Trim if current history exceeds new max
    if (this.performanceHistory.length > max) {
      this.performanceHistory = this.performanceHistory.slice(-max);
    }

    this.logInfo(
      `Maximum performance entries changed from ${oldMax} to ${max}`,
    );
  }
}
