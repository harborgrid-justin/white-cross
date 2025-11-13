/**
 * @fileoverview System Metrics Service
 * @module infrastructure/monitoring/services
 * @description Service for collecting system-level metrics (memory, database pools)
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { MemoryMetrics, PoolMetrics } from '../types/metrics.types';

import { BaseService } from '@/common/base';
@Injectable()
export class SystemMetricsService extends BaseService {
  private readonly MAX_HISTORY_POINTS = 1440; // 24 hours at 1 min intervals
  private poolMetricsHistory: PoolMetrics[] = [];
  private memoryMetricsHistory: MemoryMetrics[] = [];

  constructor(@InjectConnection() private readonly sequelize: Sequelize) {
    super('SystemMetricsService');
  }

  /**
   * Collect system-level metrics
   */
  collectSystemMetrics(): {
    memory: MemoryMetrics;
    pool: PoolMetrics | null;
  } {
    const memory = this.collectMemoryMetrics();
    const pool = this.collectPoolMetrics();

    return { memory, pool };
  }

  /**
   * Collect memory metrics
   */
  private collectMemoryMetrics(): MemoryMetrics {
    const memUsage = process.memoryUsage();
    const memMetrics: MemoryMetrics = {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss,
      utilizationPercent: (memUsage.heapUsed / memUsage.heapTotal) * 100,
      gcPauses: 0, // Would need gc-stats library
      avgGcDuration: 0,
    };

    this.memoryMetricsHistory.push(memMetrics);
    if (this.memoryMetricsHistory.length > this.MAX_HISTORY_POINTS) {
      this.memoryMetricsHistory.shift();
    }

    return memMetrics;
  }

  /**
   * Collect connection pool metrics
   */
  private collectPoolMetrics(): PoolMetrics | null {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sequelizeAny = this.sequelize as any;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const pool = sequelizeAny.connectionManager?.pool;
      if (!pool) {
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const activeConnections = pool.used?.length || 0;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const idleConnections = pool.free?.length || 0;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const waitingRequests = pool.pending?.length || 0;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const maxConnections = pool.options?.max || 0;

      const totalConnections = activeConnections + idleConnections;

      const poolMetrics: PoolMetrics = {
        activeConnections,
        idleConnections,
        waitingRequests,
        totalConnections,
        maxConnections,
        utilizationPercent: 0,
        avgWaitTime: 0,
        connectionErrors: 0,
      };

      if (poolMetrics.maxConnections > 0) {
        poolMetrics.utilizationPercent =
          (poolMetrics.totalConnections / poolMetrics.maxConnections) * 100;
      }

      this.poolMetricsHistory.push(poolMetrics);
      if (this.poolMetricsHistory.length > this.MAX_HISTORY_POINTS) {
        this.poolMetricsHistory.shift();
      }

      return poolMetrics;
    } catch (error) {
      this.logError('Error collecting pool metrics:', error);
      return null;
    }
  }

  /**
   * Get memory metrics history
   */
  getMemoryMetricsHistory(hours: number = 1): MemoryMetrics[] {
    return this.memoryMetricsHistory.filter(
      (m, i) => this.memoryMetricsHistory.length - 1 - i < hours * 60,
    );
  }

  /**
   * Get pool metrics history
   */
  getPoolMetricsHistory(hours: number = 1): PoolMetrics[] {
    return this.poolMetricsHistory.filter(
      (m, i) => this.poolMetricsHistory.length - 1 - i < hours * 60,
    );
  }

  /**
   * Get current memory metrics
   */
  getCurrentMemoryMetrics(): MemoryMetrics | null {
    return this.memoryMetricsHistory[this.memoryMetricsHistory.length - 1] || null;
  }

  /**
   * Get current pool metrics
   */
  getCurrentPoolMetrics(): PoolMetrics | null {
    return this.poolMetricsHistory[this.poolMetricsHistory.length - 1] || null;
  }

  /**
   * Reset system metrics history
   */
  reset(): void {
    this.poolMetricsHistory = [];
    this.memoryMetricsHistory = [];
    this.logInfo('System metrics reset');
  }
}
