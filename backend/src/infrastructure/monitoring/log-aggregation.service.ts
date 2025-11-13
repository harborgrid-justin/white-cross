/**
 * Log Aggregation Service
 *
 * @module infrastructure/monitoring
 * @description Service responsible for aggregating, storing, and querying application logs.
 * Provides centralized log management with search and filtering capabilities.
 */

import { Injectable, Logger } from '@nestjs/common';
import { LogEntry, LogQueryParams } from './interfaces/metrics.interface';

import { BaseService } from '../../common/base';
/**
 * LogAggregationService
 *
 * @description Aggregates and manages application logs in memory.
 * Provides query capabilities for log analysis and troubleshooting.
 *
 * @example
 * ```typescript
 * logAggregationService.addLogEntry({
 *   level: 'error',
 *   message: 'Database connection failed',
 *   context: 'DatabaseService',
 *   timestamp: new Date().toISOString()
 * });
 *
 * const errorLogs = logAggregationService.queryLogs({ level: 'error', limit: 50 });
 * ```
 */
@Injectable()
export class LogAggregationService extends BaseService {
  // Log storage
  private logBuffer: LogEntry[] = [];
  private readonly maxLogEntries = 10000;

  /**
   * Initialize log aggregation
   */
  async initialize(): Promise<void> {
    this.logInfo('Log aggregation service initialized');
  }

  /**
   * Add log entry to aggregation buffer
   *
   * @param entry Log entry
   */
  addLogEntry(entry: LogEntry): void {
    this.logBuffer.push(entry);

    // Keep buffer bounded
    if (this.logBuffer.length > this.maxLogEntries) {
      this.logBuffer.shift();
    }
  }

  /**
   * Query log entries
   *
   * @param params Query parameters
   * @returns Filtered log entries
   */
  queryLogs(params: LogQueryParams): LogEntry[] {
    let logs = [...this.logBuffer];

    // Filter by level
    if (params.level) {
      logs = logs.filter((log) => log.level === params.level);
    }

    // Filter by context
    if (params.context) {
      logs = logs.filter((log) => log.context.includes(params.context!));
    }

    // Filter by time range
    if (params.startTime) {
      const startTime = new Date(params.startTime).getTime();
      logs = logs.filter(
        (log) => new Date(log.timestamp).getTime() >= startTime,
      );
    }

    if (params.endTime) {
      const endTime = new Date(params.endTime).getTime();
      logs = logs.filter((log) => new Date(log.timestamp).getTime() <= endTime);
    }

    // Filter by search query
    if (params.search) {
      const search = params.search.toLowerCase();
      logs = logs.filter(
        (log) =>
          log.message.toLowerCase().includes(search) ||
          log.context.toLowerCase().includes(search),
      );
    }

    // Apply limit
    if (params.limit) {
      logs = logs.slice(-params.limit);
    }

    return logs;
  }

  /**
   * Get all log entries
   *
   * @returns All log entries
   */
  getAllLogs(): LogEntry[] {
    return [...this.logBuffer];
  }

  /**
   * Get recent log entries
   *
   * @param limit Number of recent logs to return
   * @returns Recent log entries
   */
  getRecentLogs(limit: number = 100): LogEntry[] {
    return this.logBuffer.slice(-limit);
  }

  /**
   * Get logs by level
   *
   * @param level Log level
   * @param limit Optional limit
   * @returns Filtered log entries
   */
  getLogsByLevel(level: string, limit?: number): LogEntry[] {
    const filtered = this.logBuffer.filter((log) => log.level === level);
    return limit ? filtered.slice(-limit) : filtered;
  }

  /**
   * Get logs by context
   *
   * @param context Log context
   * @param limit Optional limit
   * @returns Filtered log entries
   */
  getLogsByContext(context: string, limit?: number): LogEntry[] {
    const filtered = this.logBuffer.filter((log) =>
      log.context.includes(context),
    );
    return limit ? filtered.slice(-limit) : filtered;
  }

  /**
   * Search logs by message content
   *
   * @param searchTerm Search term
   * @param limit Optional limit
   * @returns Filtered log entries
   */
  searchLogs(searchTerm: string, limit?: number): LogEntry[] {
    const search = searchTerm.toLowerCase();
    const filtered = this.logBuffer.filter(
      (log) =>
        log.message.toLowerCase().includes(search) ||
        log.context.toLowerCase().includes(search),
    );
    return limit ? filtered.slice(-limit) : filtered;
  }

  /**
   * Get log statistics
   *
   * @returns Log statistics by level
   */
  getLogStats(): Record<
    string,
    { count: number; percentage: number }
  > {
    const stats: Record<string, number> = {};
    const total = this.logBuffer.length;

    this.logBuffer.forEach((log) => {
      stats[log.level] = (stats[log.level] || 0) + 1;
    });

    const result: Record<string, { count: number; percentage: number }> = {};
    Object.entries(stats).forEach(([level, count]) => {
      result[level] = {
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      };
    });

    return result;
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logBuffer = [];
    this.logInfo('All logs cleared');
  }

  /**
   * Clear old logs (older than specified time)
   *
   * @param olderThanMs Clear logs older than this many milliseconds
   */
  clearOldLogs(olderThanMs: number): void {
    const cutoffTime = Date.now() - olderThanMs;
    const initialLength = this.logBuffer.length;

    this.logBuffer = this.logBuffer.filter((log) => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime >= cutoffTime;
    });

    const removedCount = initialLength - this.logBuffer.length;
    this.logInfo(`Cleared ${removedCount} old log entries`);
  }

  /**
   * Get total number of log entries
   */
  getLogCount(): number {
    return this.logBuffer.length;
  }

  /**
   * Get logs within time range
   *
   * @param startTime Start time (ISO string or timestamp)
   * @param endTime End time (ISO string or timestamp)
   * @returns Filtered log entries
   */
  getLogsByTimeRange(
    startTime: string | number,
    endTime: string | number,
  ): LogEntry[] {
    const start =
      typeof startTime === 'string'
        ? new Date(startTime).getTime()
        : startTime;
    const end =
      typeof endTime === 'string' ? new Date(endTime).getTime() : endTime;

    return this.logBuffer.filter((log) => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime >= start && logTime <= end;
    });
  }

  /**
   * Export logs as JSON
   *
   * @param params Optional query parameters for filtering
   * @returns JSON string of logs
   */
  exportLogsAsJson(params?: LogQueryParams): string {
    const logs = params ? this.queryLogs(params) : this.logBuffer;
    return JSON.stringify(logs, null, 2);
  }

  /**
   * Get error logs with optional limit
   *
   * @param limit Optional limit
   * @returns Error log entries
   */
  getErrorLogs(limit?: number): LogEntry[] {
    return this.getLogsByLevel('error', limit);
  }

  /**
   * Get warning logs with optional limit
   *
   * @param limit Optional limit
   * @returns Warning log entries
   */
  getWarningLogs(limit?: number): LogEntry[] {
    return this.getLogsByLevel('warn', limit);
  }
}
