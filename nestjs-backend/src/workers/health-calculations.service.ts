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

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { join } from 'path';
import { WorkerPoolService } from './worker-pool.service';

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

@Injectable()
export class HealthCalculationsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(HealthCalculationsService.name);
  private workerPool: WorkerPoolService | null = null;

  /**
   * Initialize worker pool on module init
   */
  async onModuleInit(): Promise<void> {
    const workerScript = join(__dirname, 'healthCalculations.worker.js');

    this.logger.log(`Initializing health calculations worker pool with script: ${workerScript}`);

    this.workerPool = new WorkerPoolService(workerScript, {
      poolSize: undefined, // Use default (CPU cores - 1)
      taskTimeout: 30000, // 30 seconds
    });

    // Initialize the pool
    await this.workerPool.onModuleInit();

    this.logger.log('Health calculations worker pool initialized');
  }

  /**
   * Cleanup worker pool on module destroy
   */
  async onModuleDestroy(): Promise<void> {
    if (this.workerPool) {
      this.logger.log('Shutting down health calculations worker pool');
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
  async analyzeVitalTrends(vitals: VitalDataPoint[]): Promise<VitalTrendAnalysis> {
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
  async calculateAggregations(values: number[]): Promise<StatisticalAggregations> {
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
