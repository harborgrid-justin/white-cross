/**
 * LOC: 6606C9D55F
 * WC-GEN-366 | workerPool.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - index.ts (shared/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-366 | workerPool.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../shared | Dependencies: worker_threads, os, path
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, functions, default export | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Worker Thread Pool Manager
 *
 * Manages a pool of worker threads for CPU-intensive operations
 * Features:
 * - Dynamic pool sizing based on CPU cores
 * - Task queuing with priority support
 * - Worker health monitoring
 * - Automatic worker restart on failure
 */

import { Worker } from 'worker_threads';
import { cpus } from 'os';
import path from 'path';
import { EventEmitter } from 'events';
import { logger } from '../shared';

interface WorkerTask {
  id: string;
  type: string;
  data: any;
  priority: number;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  timeout?: NodeJS.Timeout;
}

interface WorkerInfo {
  worker: Worker;
  busy: boolean;
  taskCount: number;
  errors: number;
}

export class WorkerPool extends EventEmitter {
  private workers: WorkerInfo[] = [];
  private taskQueue: WorkerTask[] = [];
  private taskIdCounter = 0;
  private readonly poolSize: number;
  private readonly workerScript: string;
  private readonly taskTimeout: number;
  private isShuttingDown = false;

  constructor(
    workerScript: string,
    options: {
      poolSize?: number;
      taskTimeout?: number;
    } = {}
  ) {
    super();

    this.workerScript = workerScript;
    this.poolSize = options.poolSize || Math.max(2, cpus().length - 1);
    this.taskTimeout = options.taskTimeout || 30000; // 30 seconds default

    this.initializePool();
  }

  /**
   * Initialize worker pool
   */
  private initializePool(): void {
    logger.info(`Initializing worker pool with ${this.poolSize} workers`);

    for (let i = 0; i < this.poolSize; i++) {
      this.createWorker();
    }

    logger.info(`Worker pool initialized with ${this.workers.length} workers`);
  }

  /**
   * Create a new worker
   */
  private createWorker(): void {
    const worker = new Worker(this.workerScript);

    const workerInfo: WorkerInfo = {
      worker,
      busy: false,
      taskCount: 0,
      errors: 0,
    };

    worker.on('message', (message) => {
      this.handleWorkerMessage(workerInfo, message);
    });

    worker.on('error', (error) => {
      this.handleWorkerError(workerInfo, error);
    });

    worker.on('exit', (code) => {
      this.handleWorkerExit(workerInfo, code);
    });

    this.workers.push(workerInfo);
  }

  /**
   * Handle worker message
   */
  private handleWorkerMessage(workerInfo: WorkerInfo, message: any): void {
    workerInfo.busy = false;
    workerInfo.taskCount++;

    // Process next task in queue
    this.processNextTask();
  }

  /**
   * Handle worker error
   */
  private handleWorkerError(workerInfo: WorkerInfo, error: Error): void {
    workerInfo.errors++;
    logger.error('Worker error', {
      error: error.message,
      errorCount: workerInfo.errors,
    });

    // Restart worker if error count exceeds threshold
    if (workerInfo.errors > 5) {
      this.restartWorker(workerInfo);
    }
  }

  /**
   * Handle worker exit
   */
  private handleWorkerExit(workerInfo: WorkerInfo, code: number): void {
    if (code !== 0 && !this.isShuttingDown) {
      logger.warn(`Worker exited with code ${code}, restarting...`);
      this.restartWorker(workerInfo);
    }
  }

  /**
   * Restart a worker
   */
  private restartWorker(workerInfo: WorkerInfo): void {
    const index = this.workers.indexOf(workerInfo);
    if (index === -1) return;

    // Terminate old worker
    workerInfo.worker.terminate().catch((error) => {
      logger.error('Error terminating worker', error);
    });

    // Remove from pool
    this.workers.splice(index, 1);

    // Create new worker
    this.createWorker();

    logger.info('Worker restarted');
  }

  /**
   * Get available worker
   */
  private getAvailableWorker(): WorkerInfo | null {
    return this.workers.find((w) => !w.busy) || null;
  }

  /**
   * Process next task in queue
   */
  private processNextTask(): void {
    if (this.taskQueue.length === 0) return;

    const worker = this.getAvailableWorker();
    if (!worker) return;

    // Get highest priority task
    this.taskQueue.sort((a, b) => b.priority - a.priority);
    const task = this.taskQueue.shift();

    if (!task) return;

    this.executeTaskOnWorker(worker, task);
  }

  /**
   * Execute task on worker (internal implementation)
   */
  private executeTaskOnWorker(workerInfo: WorkerInfo, task: WorkerTask): void {
    workerInfo.busy = true;

    // Set timeout
    const timeoutId = setTimeout(() => {
      task.reject(new Error('Task timeout exceeded'));
      workerInfo.busy = false;
      this.processNextTask();
    }, this.taskTimeout);

    task.timeout = timeoutId;

    // Send task to worker
    workerInfo.worker.once('message', (message) => {
      clearTimeout(timeoutId);

      if (message.success) {
        task.resolve(message.result);
      } else {
        task.reject(new Error(message.error));
      }
    });

    workerInfo.worker.postMessage({
      type: task.type,
      data: task.data,
    });
  }

  /**
   * Execute task with worker pool (public API)
   */
  public async executeTask<T>(
    type: string,
    data: any,
    priority: number = 0
  ): Promise<T> {
    if (this.isShuttingDown) {
      throw new Error('Worker pool is shutting down');
    }

    return new Promise((resolve, reject) => {
      const task: WorkerTask = {
        id: `task_${++this.taskIdCounter}`,
        type,
        data,
        priority,
        resolve,
        reject,
      };

      const worker = this.getAvailableWorker();

      if (worker) {
        // Execute immediately
        this.executeTaskOnWorker(worker, task);
      } else {
        // Queue for later
        this.taskQueue.push(task);
      }
    });
  }

  /**
   * Get pool statistics
   */
  public getStats() {
    return {
      poolSize: this.poolSize,
      activeWorkers: this.workers.filter((w) => w.busy).length,
      idleWorkers: this.workers.filter((w) => !w.busy).length,
      queuedTasks: this.taskQueue.length,
      totalTasksProcessed: this.workers.reduce((sum, w) => sum + w.taskCount, 0),
      totalErrors: this.workers.reduce((sum, w) => sum + w.errors, 0),
    };
  }

  /**
   * Graceful shutdown
   */
  public async shutdown(): Promise<void> {
    this.isShuttingDown = true;

    logger.info('Shutting down worker pool...');

    // Clear task queue
    this.taskQueue.forEach((task) => {
      if (task.timeout) clearTimeout(task.timeout);
      task.reject(new Error('Worker pool shutting down'));
    });
    this.taskQueue = [];

    // Terminate all workers
    await Promise.all(
      this.workers.map(async (workerInfo) => {
        try {
          await workerInfo.worker.terminate();
        } catch (error) {
          logger.error('Error terminating worker', error);
        }
      })
    );

    this.workers = [];
    logger.info('Worker pool shutdown complete');
  }
}

// Singleton instance for health calculations
let healthCalculationPool: WorkerPool | null = null;

/**
 * Get or create health calculation worker pool
 */
export function getHealthCalculationPool(): WorkerPool {
  if (!healthCalculationPool) {
    const workerScript = path.join(__dirname, 'healthCalculations.worker.js');
    healthCalculationPool = new WorkerPool(workerScript, {
      poolSize: Math.max(2, cpus().length - 1),
      taskTimeout: 30000,
    });
  }

  return healthCalculationPool;
}

/**
 * Calculate BMI using worker pool
 */
export async function calculateBMIAsync(
  height: number,
  weight: number
): Promise<number> {
  const pool = getHealthCalculationPool();
  return pool.executeTask<number>('bmi', { height, weight });
}

/**
 * Batch BMI calculations using worker pool
 */
export async function batchCalculateBMIAsync(
  records: Array<{ height: number; weight: number }>
): Promise<number[]> {
  const pool = getHealthCalculationPool();
  return pool.executeTask<number[]>('bmi_batch', records);
}

/**
 * Analyze vital trends using worker pool
 */
export async function analyzeVitalTrendsAsync(
  vitals: Array<{ date: Date; value: number }>
): Promise<any> {
  const pool = getHealthCalculationPool();
  return pool.executeTask<any>('vital_trends', vitals);
}

/**
 * Calculate statistical aggregations using worker pool
 */
export async function calculateAggregationsAsync(values: number[]): Promise<any> {
  const pool = getHealthCalculationPool();
  return pool.executeTask<any>('aggregations', values);
}

/**
 * Shutdown all worker pools
 */
export async function shutdownWorkerPools(): Promise<void> {
  if (healthCalculationPool) {
    await healthCalculationPool.shutdown();
    healthCalculationPool = null;
  }
}

export default {
  WorkerPool,
  getHealthCalculationPool,
  calculateBMIAsync,
  batchCalculateBMIAsync,
  analyzeVitalTrendsAsync,
  calculateAggregationsAsync,
  shutdownWorkerPools,
};
