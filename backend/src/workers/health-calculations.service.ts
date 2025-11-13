/**
 * Health Calculations Service
 *
 * Provides CPU-intensive health calculation operations using worker threads
 * Delegates to worker pool for parallel processing
 *
 * Operations:
 * - BMI calculations (single and batch)
 * - Vital sign trend analysis
 * - Statistical aggregations
 */

import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { join } from 'path';
import { WorkerPoolService } from './worker-pool.service';
import { BaseService } from '../common/base';
import { BaseService } from '../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import {
  Cleanup,
  CPUIntensive,
  ImmediateCleanup,
  LeakProne,
  MemoryIntensive,
  MemoryMonitoring,
  MemorySensitive,
  ResourcePool,
} from '@/discovery/modules';

/**
 * Input for single BMI calculation
 */
export interface BMIInput {
  height: number; // height in cm
  weight: number; // weight in kg
}

/**
 * Input for batch BMI calculations
 */
export interface BatchBMIInput {
  height: number;
  weight: number;
}

/**
 * Vital sign data point for trend analysis
 */
export interface VitalDataPoint {
  date: Date;
  value: number;
}

/**
 * Result of vital trend analysis
 */
export interface VitalTrendAnalysis {
  trend: 'increasing' | 'decreasing' | 'stable';
  changeRate: number;
  average: number;
  min?: number;
  max?: number;
}

/**
 * Statistical aggregations result
 */
export interface StatisticalAggregations {
  count: number;
  sum: number;
  average: number;
  min: number;
  max: number;
  median: number;
  stdDev: number;
}

@CPUIntensive()
@ResourcePool({
  enabled: true,
  resourceType: 'worker',
  minSize: 1,
  maxSize: 8, // Lower than worker pool since this is a wrapper service
  priority: 8,
  validationEnabled: true,
  autoScale: true,
})
@MemoryIntensive({
  enabled: true,
  threshold: 75, // 75MB threshold for health calculations
  priority: 'high',
  cleanupStrategy: 'aggressive',
  monitoring: true,
})
@MemoryMonitoring({
  enabled: true,
  interval: 20000, // 20 seconds for health calculations monitoring
  threshold: 50, // 50MB
  alerts: true,
})
@LeakProne({
  monitoring: true,
  alertThreshold: 100, // 100MB for health calculation memory leaks
})
@Injectable()
export class HealthCalculationsService
  implements OnModuleInit, OnModuleDestroy
{
  private workerPool: WorkerPoolService | null = null;

  /**
   * Initialize worker pool on module init
   */
  async onModuleInit(): Promise<void> {
    // Determine the correct worker script path based on environment
    // In development (ts-node), __dirname points to src/workers
    // In production, __dirname points to dist/workers
    let workerScript: string;

    // Check if we're in development mode (TypeScript source)
    if (__dirname.includes('src')) {
      // Development mode - use the compiled version from dist
      workerScript = join(
        __dirname.replace('src', 'dist'),
        'healthCalculations.worker.js',
      );
    } else {
      // Production mode - already in dist
      workerScript = join(__dirname, 'healthCalculations.worker.js');
    }

    this.logInfo(
      `Initializing health calculations worker pool with script: ${workerScript}`,
    );

    this.workerPool = new WorkerPoolService(workerScript, {
      poolSize: undefined, // Use default (CPU cores - 1)
      taskTimeout: 30000, // 30 seconds
    });

    // Initialize the pool
    await this.workerPool.onModuleInit();

    this.logInfo('Health calculations worker pool initialized');
  }

  /**
   * Cleanup worker pool on module destroy
   */
  @ImmediateCleanup()
  @Cleanup('high')
  async onModuleDestroy(): Promise<void> {
    if (this.workerPool) {
      this.logInfo('Shutting down health calculations worker pool');
      await this.workerPool.shutdown();
      this.workerPool = null;
    }
  }

  /**
   * Get the worker pool instance
   * @private
   */
  private getPool(): WorkerPoolService {
    if (!this.workerPool) {
      throw new Error('Health calculations worker pool not initialized');
    }
    return this.workerPool;
  }

  /**
   * Calculate BMI (Body Mass Index) asynchronously
   *
   * @param height - Height in centimeters
   * @param weight - Weight in kilograms
   * @returns Promise resolving to BMI value (rounded to 1 decimal place)
   *
   * @example
   * ```typescript
   * const bmi = await healthCalcService.calculateBMI(180, 75);
   * console.log(bmi); // e.g., 23.1
   * ```
   */
  async calculateBMI(height: number, weight: number): Promise<number> {
    const pool = this.getPool();
    return pool.executeTask<number>('bmi', { height, weight });
  }

  /**
   * Calculate BMI for multiple records in batch
   *
   * @param records - Array of height/weight pairs
   * @returns Promise resolving to array of BMI values
   *
   * @example
   * ```typescript
   * const bmis = await healthCalcService.batchCalculateBMI([
   *   { height: 180, weight: 75 },
   *   { height: 165, weight: 60 }
   * ]);
   * console.log(bmis); // [23.1, 22.0]
   * ```
   */
  @MemorySensitive(75) // 75MB threshold for batch calculations
  async batchCalculateBMI(records: BatchBMIInput[]): Promise<number[]> {
    const pool = this.getPool();
    return pool.executeTask<number[]>('bmi_batch', records);
  }

  /**
   * Analyze vital sign trends over time
   *
   * @param vitals - Array of vital sign measurements with dates
   * @returns Promise resolving to trend analysis
   *
   * @example
   * ```typescript
   * const analysis = await healthCalcService.analyzeVitalTrends([
   *   { date: new Date('2024-01-01'), value: 120 },
   *   { date: new Date('2024-01-15'), value: 125 },
   *   { date: new Date('2024-02-01'), value: 130 }
   * ]);
   * console.log(analysis.trend); // 'increasing'
   * console.log(analysis.changeRate); // 8.3
   * ```
   */
  @MemorySensitive(50) // 50MB threshold for trend analysis
  async analyzeVitalTrends(
    vitals: VitalDataPoint[],
  ): Promise<VitalTrendAnalysis> {
    const pool = this.getPool();
    return pool.executeTask<VitalTrendAnalysis>('vital_trends', vitals);
  }

  /**
   * Calculate statistical aggregations for a set of values
   *
   * @param values - Array of numeric values
   * @returns Promise resolving to statistical aggregations
   *
   * @example
   * ```typescript
   * const stats = await healthCalcService.calculateAggregations([10, 20, 30, 40, 50]);
   * console.log(stats.average); // 30
   * console.log(stats.median); // 30
   * console.log(stats.stdDev); // 14.14
   * ```
   */
  @MemorySensitive(60) // 60MB threshold for statistical calculations
  async calculateAggregations(
    values: number[],
  ): Promise<StatisticalAggregations> {
    const pool = this.getPool();
    return pool.executeTask<StatisticalAggregations>('aggregations', values);
  }

  /**
   * Get worker pool statistics
   *
   * @returns Current worker pool statistics
   */
  getPoolStats() {
    return this.getPool().getStats();
  }
}
