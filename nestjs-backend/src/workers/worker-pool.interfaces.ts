/**
 * Worker Pool Type Definitions
 *
 * Core interfaces for worker thread management and task execution
 */

import { Worker } from 'worker_threads';

/**
 * Represents a task to be executed by a worker thread
 */
export interface WorkerTask {
  /** Unique identifier for the task */
  id: string;

  /** Type of task to execute (e.g., 'bmi', 'vital_trends') */
  type: string;

  /** Input data for the task */
  data: any;

  /** Priority level (higher = more urgent) */
  priority: number;

  /** Promise resolve function */
  resolve: (value: any) => void;

  /** Promise reject function */
  reject: (reason: any) => void;

  /** Optional timeout handle */
  timeout?: NodeJS.Timeout;
}

/**
 * Represents a worker thread and its metadata
 */
export interface WorkerInfo {
  /** The actual worker thread instance */
  worker: Worker;

  /** Whether the worker is currently processing a task */
  busy: boolean;

  /** Total number of tasks processed by this worker */
  taskCount: number;

  /** Number of errors encountered by this worker */
  errors: number;
}

/**
 * Configuration options for worker pool
 */
export interface WorkerPoolOptions {
  /** Number of workers in the pool (defaults to CPU cores - 1, minimum 2) */
  poolSize?: number;

  /** Maximum time (ms) a task can run before timing out (default: 30000) */
  taskTimeout?: number;
}

/**
 * Statistics about the worker pool
 */
export interface WorkerPoolStats {
  /** Total number of workers in the pool */
  poolSize: number;

  /** Number of workers currently processing tasks */
  activeWorkers: number;

  /** Number of workers available for new tasks */
  idleWorkers: number;

  /** Number of tasks waiting in the queue */
  queuedTasks: number;

  /** Total tasks processed since pool creation */
  totalTasksProcessed: number;

  /** Total errors encountered across all workers */
  totalErrors: number;
}
