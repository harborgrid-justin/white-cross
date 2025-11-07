/**
 * Worker Pool Service
 *
 * Manages a pool of worker threads for CPU-intensive operations
 * Integrates with NestJS lifecycle for proper initialization and cleanup
 * Enhanced with Discovery Service memory optimization patterns
 *
 * Features:
 * - Dynamic pool sizing based on CPU cores
 * - Task queuing with priority support
 * - Worker health monitoring
 * - Automatic worker restart on failure
 * - Graceful shutdown with task cleanup
 * - Memory optimization and leak detection
 * - Resource pool management
 * - CPU-intensive task optimization
 */

import {
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  Injectable,
} from '@nestjs/common';
import { Worker } from 'worker_threads';
import { cpus } from 'os';
import { EventEmitter } from 'events';
import type {
  WorkerTask,
  WorkerInfo,
  WorkerPoolOptions,
  WorkerPoolStats,
} from './worker-pool.interfaces';
import {
  CPUIntensive,
  ResourcePool,
  MemoryIntensive,
  MemoryMonitoring,
  Cleanup,
  MemorySensitive,
  ImmediateCleanup,
  LeakProne,
} from '@/discovery/modules';

@CPUIntensive()
@ResourcePool({
  enabled: true,
  resourceType: 'worker',
  minSize: 2,
  maxSize: 16, // Based on typical CPU core counts
  priority: 10,
  validationEnabled: true,
  autoScale: true,
})
@MemoryIntensive({
  enabled: true,
  threshold: 150, // 150MB threshold for worker threads
  priority: 'high',
  cleanupStrategy: 'aggressive',
  monitoring: true,
})
@MemoryMonitoring({
  enabled: true,
  interval: 15000, // 15 seconds - more frequent for worker monitoring
  threshold: 100, // 100MB
  alerts: true,
})
@LeakProne({
  monitoring: true,
  alertThreshold: 200, // 200MB for worker memory leaks
})
@Injectable()
export class WorkerPoolService
  extends EventEmitter
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(WorkerPoolService.name);
  private workers: WorkerInfo[] = [];
  private taskQueue: WorkerTask[] = [];
  private taskIdCounter = 0;
  private readonly poolSize: number;
  private readonly workerScript: string;
  private readonly taskTimeout: number;
  private isShuttingDown = false;
  private isInitialized = false;

  /**
   * Creates a worker pool service
   *
   * @param workerScript - Absolute path to the compiled worker script (.js file)
   * @param options - Pool configuration options
   */
  constructor(workerScript: string, options: WorkerPoolOptions = {}) {
    super();

    this.workerScript = workerScript;
    this.poolSize = options.poolSize || Math.max(2, cpus().length - 1);
    this.taskTimeout = options.taskTimeout || 30000; // 30 seconds default
  }

  /**
   * NestJS lifecycle hook - initialize worker pool on module init
   */
  async onModuleInit(): Promise<void> {
    this.initializePool();
  }

  /**
   * NestJS lifecycle hook - cleanup worker pool on module destroy
   */
  async onModuleDestroy(): Promise<void> {
    await this.shutdown();
  }

  /**
   * Initialize worker pool
   * @private
   */
  private initializePool(): void {
    if (this.isInitialized) {
      this.logger.warn('Worker pool already initialized');
      return;
    }

    this.logger.log(`Initializing worker pool with ${this.poolSize} workers`);

    for (let i = 0; i < this.poolSize; i++) {
      this.createWorker();
    }

    this.isInitialized = true;
    this.logger.log(
      `Worker pool initialized with ${this.workers.length} workers`,
    );
  }

  /**
   * Create a new worker thread
   * @private
   */
  private createWorker(): void {
    const worker = new Worker(this.workerScript);

    const workerInfo: WorkerInfo = {
      worker,
      busy: false,
      taskCount: 0,
      errors: 0,
    };

    worker.on('message', (message: any) => {
      this.handleWorkerMessage(workerInfo, message);
    });

    worker.on('error', (error: Error) => {
      this.handleWorkerError(workerInfo, error);
    });

    worker.on('exit', (code: number) => {
      this.handleWorkerExit(workerInfo, code);
    });

    this.workers.push(workerInfo);
  }

  /**
   * Handle message from worker thread
   * @private
   */
  private handleWorkerMessage(workerInfo: WorkerInfo, message: any): void {
    workerInfo.busy = false;
    workerInfo.taskCount++;

    // Process next task in queue
    this.processNextTask();
  }

  /**
   * Handle error from worker thread
   * @private
   */
  private handleWorkerError(workerInfo: WorkerInfo, error: Error): void {
    workerInfo.errors++;
    this.logger.error('Worker error', {
      error: error.message,
      errorCount: workerInfo.errors,
      stack: error.stack,
    });

    // Restart worker if error count exceeds threshold
    if (workerInfo.errors > 5) {
      this.logger.warn(`Worker error threshold exceeded, restarting worker`);
      this.restartWorker(workerInfo);
    }
  }

  /**
   * Handle worker thread exit
   * @private
   */
  private handleWorkerExit(workerInfo: WorkerInfo, code: number): void {
    if (code !== 0 && !this.isShuttingDown) {
      this.logger.warn(`Worker exited with code ${code}, restarting...`);
      this.restartWorker(workerInfo);
    }
  }

  /**
   * Restart a failed worker
   * @private
   */
  private restartWorker(workerInfo: WorkerInfo): void {
    const index = this.workers.indexOf(workerInfo);
    if (index === -1) return;

    // Terminate old worker
    workerInfo.worker.terminate().catch((error: Error) => {
      this.logger.error('Error terminating worker', error);
    });

    // Remove from pool
    this.workers.splice(index, 1);

    // Create new worker
    this.createWorker();

    this.logger.log('Worker restarted successfully');
  }

  /**
   * Get an available worker from the pool
   * @private
   */
  private getAvailableWorker(): WorkerInfo | null {
    return this.workers.find((w) => !w.busy) || null;
  }

  /**
   * Process next task in the queue
   * @private
   */
  private processNextTask(): void {
    if (this.taskQueue.length === 0) return;

    const worker = this.getAvailableWorker();
    if (!worker) return;

    // Sort by priority (highest first) and get the next task
    this.taskQueue.sort((a, b) => b.priority - a.priority);
    const task = this.taskQueue.shift();

    if (!task) return;

    this.executeTaskOnWorker(worker, task);
  }

  /**
   * Execute a task on a specific worker
   * @private
   */
  private executeTaskOnWorker(workerInfo: WorkerInfo, task: WorkerTask): void {
    workerInfo.busy = true;

    // Set timeout for the task
    const timeoutId = setTimeout(() => {
      task.reject(new Error('Task timeout exceeded'));
      workerInfo.busy = false;
      this.processNextTask();
    }, this.taskTimeout);

    task.timeout = timeoutId;

    // Listen for response from worker (one-time listener)
    workerInfo.worker.once('message', (message: any) => {
      clearTimeout(timeoutId);

      if (message.success) {
        task.resolve(message.result);
      } else {
        task.reject(new Error(message.error));
      }
    });

    // Send task to worker
    workerInfo.worker.postMessage({
      type: task.type,
      data: task.data,
    });
  }

  /**
   * Execute a task using the worker pool
   *
   * @template T - Expected return type
   * @param type - Task type identifier
   * @param data - Input data for the task
   * @param priority - Task priority (default: 0, higher = more urgent)
   * @returns Promise resolving to the task result
   * @throws Error if pool is shutting down or task times out
   *
   * @example
   * ```typescript
   * const result = await workerPool.executeTask<number>('bmi', { height: 180, weight: 75 });
   * ```
   */
  @MemorySensitive(100) // 100MB threshold for CPU-intensive tasks
  public async executeTask<T>(
    type: string,
    data: any,
    priority: number = 0,
  ): Promise<T> {
    if (this.isShuttingDown) {
      throw new Error('Worker pool is shutting down');
    }

    if (!this.isInitialized) {
      throw new Error('Worker pool not initialized');
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
        // Execute immediately if worker is available
        this.executeTaskOnWorker(worker, task);
      } else {
        // Queue for later execution
        this.taskQueue.push(task);
      }
    });
  }

  /**
   * Get current pool statistics
   *
   * @returns Statistics object with pool metrics
   */
  public getStats(): WorkerPoolStats {
    return {
      poolSize: this.poolSize,
      activeWorkers: this.workers.filter((w) => w.busy).length,
      idleWorkers: this.workers.filter((w) => !w.busy).length,
      queuedTasks: this.taskQueue.length,
      totalTasksProcessed: this.workers.reduce(
        (sum, w) => sum + w.taskCount,
        0,
      ),
      totalErrors: this.workers.reduce((sum, w) => sum + w.errors, 0),
    };
  }

  /**
   * Gracefully shutdown the worker pool
   * Clears task queue and terminates all workers
   *
   * @returns Promise that resolves when shutdown is complete
   */
  @ImmediateCleanup()
  @Cleanup('high')
  public async shutdown(): Promise<void> {
    if (this.isShuttingDown) {
      this.logger.warn('Worker pool already shutting down');
      return;
    }

    this.isShuttingDown = true;
    this.logger.log('Shutting down worker pool...');

    // Clear task queue and reject pending tasks
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
          this.logger.error('Error terminating worker', error);
        }
      }),
    );

    this.workers = [];
    this.isInitialized = false;
    this.logger.log('Worker pool shutdown complete');
  }
}
