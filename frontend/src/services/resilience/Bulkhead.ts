/**
 * @fileoverview Bulkhead Pattern Implementation for Resource Isolation
 * @module services/resilience/Bulkhead
 * @category Services
 *
 * Implements the Bulkhead pattern to isolate critical resources through separate concurrency pools,
 * preventing resource exhaustion and cascading failures across the healthcare system.
 *
 * Key Concepts:
 * - **Resource Isolation**: Separate pools for different priority levels
 * - **Priority-Based Queueing**: Critical operations get priority access
 * - **Concurrency Control**: Limits concurrent operations per priority
 * - **Queue Management**: Bounded queues with configurable limits
 *
 * Healthcare Application:
 * - CRITICAL: Emergency medical data access, life-threatening alerts
 * - HIGH: Urgent care operations, medication administration
 * - NORMAL: Standard patient care, routine appointments
 * - LOW: Analytics, reporting, background tasks
 *
 * Pattern Benefits:
 * - Prevents low-priority work from starving critical operations
 * - Isolates failures to specific resource pools
 * - Ensures critical healthcare operations always have capacity
 * - Provides predictable performance under load
 *
 * @example
 * ```typescript
 * // Configure bulkhead with priority-based pools
 * const bulkhead = new Bulkhead({
 *   criticalMaxConcurrent: 10,    // Max concurrent critical ops
 *   highMaxConcurrent: 5,          // Max concurrent high priority ops
 *   normalMaxConcurrent: 3,        // Max concurrent normal ops
 *   lowMaxConcurrent: 1,           // Max concurrent low priority ops
 *   maxQueuedPerPriority: 100,     // Max queued per priority
 *   operationTimeout: 30000,       // 30 second timeout
 *   rejectWhenFull: true           // Reject if queue full
 * });
 *
 * // Submit critical healthcare operation
 * const patientData = await bulkhead.submit(
 *   () => fetchEmergencyPatientData(id),
 *   OperationPriority.CRITICAL
 * );
 *
 * // Submit normal priority operation
 * const report = await bulkhead.submit(
 *   () => generateReport(),
 *   OperationPriority.NORMAL
 * );
 *
 * // Monitor resource usage
 * const metrics = bulkhead.getMetrics();
 * console.log(`Critical active: ${metrics.activeByCriticality.CRITICAL}`);
 * ```
 */

import {
  OperationPriority,
  BulkheadConfig,
  BulkheadOperationRequest,
  BulkheadMetrics,
  ResilienceError
} from './types';

/**
 * Priority Queue for Bulkhead Operations
 *
 * @class
 * @classdesc Manages queued operations with strict priority-based ordering.
 * Higher priority operations are always dequeued before lower priority ones.
 *
 * Priority Order (highest to lowest):
 * 1. CRITICAL - Emergency, life-threatening operations
 * 2. HIGH - Urgent care operations
 * 3. NORMAL - Standard operations
 * 4. LOW - Background tasks, analytics
 *
 * @template T - Type of items in the queue
 * @private
 */
class PriorityQueue<T> {
  private queues: Map<OperationPriority, T[]> = new Map();

  constructor() {
    this.queues.set(OperationPriority.CRITICAL, []);
    this.queues.set(OperationPriority.HIGH, []);
    this.queues.set(OperationPriority.NORMAL, []);
    this.queues.set(OperationPriority.LOW, []);
  }

  /**
   * Add item to priority queue
   *
   * @param {T} item - Item to enqueue
   * @param {OperationPriority} priority - Priority level for the item
   */
  public enqueue(item: T, priority: OperationPriority): void {
    const queue = this.queues.get(priority) || [];
    queue.push(item);
    this.queues.set(priority, queue);
  }

  /**
   * Remove and return highest priority item from queue
   *
   * @returns {T | undefined} Next item to process, or undefined if queue empty
   * @description
   * Always returns items from higher priority queues first. Within a priority level,
   * items are processed FIFO (first in, first out).
   */
  public dequeue(): T | undefined {
    const priorities = [
      OperationPriority.CRITICAL,
      OperationPriority.HIGH,
      OperationPriority.NORMAL,
      OperationPriority.LOW
    ];

    for (const priority of priorities) {
      const queue = this.queues.get(priority) || [];
      if (queue.length > 0) {
        return queue.shift();
      }
    }

    return undefined;
  }

  /**
   * Peek at next item
   */
  public peek(): T | undefined {
    const priorities = [
      OperationPriority.CRITICAL,
      OperationPriority.HIGH,
      OperationPriority.NORMAL,
      OperationPriority.LOW
    ];

    for (const priority of priorities) {
      const queue = this.queues.get(priority) || [];
      if (queue.length > 0) {
        return queue[0];
      }
    }

    return undefined;
  }

  /**
   * Get queue size for priority
   */
  public sizeByPriority(priority: OperationPriority): number {
    return (this.queues.get(priority) || []).length;
  }

  /**
   * Get total queue size
   */
  public totalSize(): number {
    let total = 0;
    this.queues.forEach(queue => {
      total += queue.length;
    });
    return total;
  }

  /**
   * Clear all queues
   */
  public clear(): void {
    this.queues.forEach(queue => queue.length = 0);
  }
}

/**
 * Bulkhead Class
 *
 * @class
 * @classdesc Isolates operations by priority with separate concurrency pools,
 * preventing critical operations from being starved by lower-priority work.
 *
 * Architecture:
 * - Separate concurrency limits per priority level
 * - Priority-based queue for operations waiting for capacity
 * - Automatic timeout handling for queued and executing operations
 * - Comprehensive metrics for monitoring resource usage
 *
 * Healthcare Safety:
 * - Ensures critical medical operations always have capacity
 * - Prevents non-critical work from blocking urgent care
 * - Provides predictable latency for high-priority operations
 * - Maintains system responsiveness under heavy load
 *
 * Resource Management:
 * - Tracks active operations per priority level
 * - Monitors queue depth and wait times
 * - Provides rejection when resources exhausted (configurable)
 * - Automatically processes queue as capacity becomes available
 *
 * Performance Characteristics:
 * - O(1) submission and capacity checking
 * - O(p) queue processing where p = number of priority levels
 * - Minimal overhead for operations that execute immediately
 *
 * @example
 * ```typescript
 * const bulkhead = new Bulkhead({
 *   criticalMaxConcurrent: 10,
 *   highMaxConcurrent: 5,
 *   normalMaxConcurrent: 3,
 *   lowMaxConcurrent: 1,
 *   maxQueuedPerPriority: 100,
 *   operationTimeout: 30000,
 *   rejectWhenFull: true
 * });
 *
 * // Critical healthcare operation - gets priority
 * try {
 *   const data = await bulkhead.submit(
 *     async () => await fetchPatientEmergencyData(id),
 *     OperationPriority.CRITICAL,
 *     5000  // 5 second timeout
 *   );
 * } catch (error) {
 *   if (error.type === 'bulkheadRejected') {
 *     console.error('No capacity available');
 *   }
 * }
 * ```
 */
export class Bulkhead {
  private config: Required<BulkheadConfig>;
  private activeByPriority: Map<OperationPriority, number> = new Map();
  private queue: PriorityQueue<BulkheadOperationRequest> = new PriorityQueue();
  private totalRejected: number = 0;
  private totalProcessed: number = 0;
  private queueWaitTimes: number[] = [];
  private peakConcurrent: number = 0;

  constructor(config: BulkheadConfig) {
    this.config = {
      criticalMaxConcurrent: config.criticalMaxConcurrent,
      highMaxConcurrent: config.highMaxConcurrent,
      normalMaxConcurrent: config.normalMaxConcurrent,
      lowMaxConcurrent: config.lowMaxConcurrent,
      maxQueuedPerPriority: config.maxQueuedPerPriority,
      operationTimeout: config.operationTimeout,
      rejectWhenFull: config.rejectWhenFull
    };

    this.activeByPriority.set(OperationPriority.CRITICAL, 0);
    this.activeByPriority.set(OperationPriority.HIGH, 0);
    this.activeByPriority.set(OperationPriority.NORMAL, 0);
    this.activeByPriority.set(OperationPriority.LOW, 0);
  }

  /**
   * Submit operation to bulkhead with priority and timeout
   *
   * @template T - Return type of the operation
   * @param {() => Promise<T>} operation - Async operation to execute
   * @param {OperationPriority} [priority=OperationPriority.NORMAL] - Priority level for the operation
   * @param {number} [timeout] - Operation timeout in milliseconds (defaults to config value)
   * @returns {Promise<T>} Result of the operation when executed
   * @throws {ResilienceError} If bulkhead rejects operation (queue full) or operation times out
   *
   * @description
   * Submits an operation to the bulkhead with specified priority. The operation will:
   * 1. Execute immediately if capacity available for its priority level
   * 2. Queue if capacity exhausted but queue not full
   * 3. Reject if queue is full (when rejectWhenFull=true)
   *
   * Higher priority operations are always processed before lower priority ones.
   * Critical operations should be used sparingly for truly life-critical scenarios.
   *
   * **Priority Guidelines**:
   * - CRITICAL: Emergency care, life-threatening alerts, critical medication admin
   * - HIGH: Urgent care, medication orders, immediate patient needs
   * - NORMAL: Standard patient care, appointments, routine operations
   * - LOW: Reports, analytics, background sync, non-urgent tasks
   *
   * @example
   * ```typescript
   * // Submit critical operation with short timeout
   * const emergencyData = await bulkhead.submit(
   *   () => fetchEmergencyMedicalData(patientId),
   *   OperationPriority.CRITICAL,
   *   5000  // 5 second timeout
   * );
   *
   * // Submit normal operation with default timeout
   * const report = await bulkhead.submit(
   *   () => generateMonthlyReport(),
   *   OperationPriority.NORMAL
   * );
   *
   * // Handle rejection
   * try {
   *   await bulkhead.submit(() => heavyComputation(), OperationPriority.LOW);
   * } catch (error) {
   *   if (error.type === 'bulkheadRejected') {
   *     console.log('System at capacity, retry later');
   *   }
   * }
   * ```
   */
  public async submit<T>(
    operation: () => Promise<T>,
    priority: OperationPriority = OperationPriority.NORMAL,
    timeout: number = this.config.operationTimeout
  ): Promise<T> {
    // Check if we can execute immediately
    if (this.canExecute(priority)) {
      return this.executeOperation(operation, priority, timeout);
    }

    // Check if we can queue
    if (!this.canQueue(priority)) {
      this.totalRejected++;
      throw this.createBulkheadError(
        `Bulkhead rejected operation - queue full for ${priority} priority`
      );
    }

    // Queue the operation
    const request: BulkheadOperationRequest<T> = {
      id: this.generateId(),
      priority,
      operation,
      timeout,
      timestamp: Date.now()
    };

    this.queue.enqueue(request, priority);

    // Wait for slot to become available
    return this.waitForExecution(request);
  }

  /**
   * Check if operation can execute immediately
   */
  private canExecute(priority: OperationPriority): boolean {
    const active = this.activeByPriority.get(priority) || 0;
    const maxConcurrent = this.getMaxConcurrent(priority);
    return active < maxConcurrent;
  }

  /**
   * Check if operation can be queued
   */
  private canQueue(priority: OperationPriority): boolean {
    if (!this.config.rejectWhenFull) {
      return true;
    }

    const queued = this.queue.sizeByPriority(priority);
    return queued < this.config.maxQueuedPerPriority;
  }

  /**
   * Execute operation immediately
   */
  private async executeOperation<T>(
    operation: () => Promise<T>,
    priority: OperationPriority,
    timeout: number
  ): Promise<T> {
    const active = this.activeByPriority.get(priority) || 0;
    this.activeByPriority.set(priority, active + 1);

    // Track peak concurrent requests
    const totalActive = Array.from(this.activeByPriority.values()).reduce((a, b) => a + b, 0);
    if (totalActive > this.peakConcurrent) {
      this.peakConcurrent = totalActive;
    }

    try {
      return await this.withTimeout(operation, timeout);
    } finally {
      const newActive = (this.activeByPriority.get(priority) || 0) - 1;
      this.activeByPriority.set(priority, Math.max(0, newActive));
      this.totalProcessed++;

      // Process next queued operation if available
      this.processQueue();
    }
  }

  /**
   * Wait for execution slot
   */
  private waitForExecution<T>(request: BulkheadOperationRequest<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (this.canExecute(request.priority)) {
          clearInterval(checkInterval);
          const waitTime = Date.now() - request.timestamp;
          this.queueWaitTimes.push(waitTime);

          this.executeOperation(request.operation, request.priority, request.timeout)
            .then(resolve)
            .catch(reject);
        }
      }, 10);

      // Timeout waiting in queue
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(this.createBulkheadError('Timeout waiting for bulkhead slot'));
      }, request.timeout * 2);
    });
  }

  /**
   * Process next queued operation
   */
  private processQueue(): void {
    const nextRequest = this.queue.dequeue();

    if (nextRequest && this.canExecute(nextRequest.priority)) {
      const waitTime = Date.now() - nextRequest.timestamp;
      this.queueWaitTimes.push(waitTime);

      this.executeOperation(
        nextRequest.operation,
        nextRequest.priority,
        nextRequest.timeout
      ).catch(error => {
        console.error('Error processing queued operation:', error);
      });
    }
  }

  /**
   * Execute operation with timeout
   */
  private withTimeout<T>(operation: () => Promise<T>, timeout: number): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(this.createBulkheadError(`Operation timeout after ${timeout}ms`)),
          timeout
        )
      )
    ]);
  }

  /**
   * Get maximum concurrent operations for priority
   */
  private getMaxConcurrent(priority: OperationPriority): number {
    switch (priority) {
      case OperationPriority.CRITICAL:
        return this.config.criticalMaxConcurrent;
      case OperationPriority.HIGH:
        return this.config.highMaxConcurrent;
      case OperationPriority.NORMAL:
        return this.config.normalMaxConcurrent;
      case OperationPriority.LOW:
        return this.config.lowMaxConcurrent;
    }
  }

  /**
   * Create bulkhead error
   */
  private createBulkheadError(message: string): ResilienceError {
    return new Error(message) as ResilienceError & {
      type: 'bulkheadRejected';
      endpoint: string;
      timestamp: number;
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current bulkhead metrics and statistics
   *
   * @returns {BulkheadMetrics} Current metrics including active/queued operations and performance stats
   *
   * @description
   * Returns comprehensive metrics for monitoring bulkhead health and resource usage:
   * - Active operations count per priority level
   * - Queued operations count per priority level
   * - Total rejected operations
   * - Average queue wait time
   * - Peak concurrent requests
   *
   * Use this for dashboards, capacity planning, and performance monitoring.
   *
   * @example
   * ```typescript
   * const metrics = bulkhead.getMetrics();
   *
   * console.log('Active Operations:');
   * console.log(`  Critical: ${metrics.activeByCriticality.CRITICAL}`);
   * console.log(`  High: ${metrics.activeByCriticality.HIGH}`);
   * console.log(`  Normal: ${metrics.activeByCriticality.NORMAL}`);
   *
   * console.log(`\nQueued: ${Object.values(metrics.queuedByCriticality).reduce((a,b) => a+b, 0)}`);
   * console.log(`Rejected: ${metrics.totalRejected}`);
   * console.log(`Avg Wait: ${metrics.averageQueueWaitTime.toFixed(0)}ms`);
   *
   * if (metrics.totalRejected > 100) {
   *   console.warn('High rejection rate - consider increasing capacity');
   * }
   * ```
   */
  public getMetrics(): BulkheadMetrics {
    const activeByCriticality = {
      CRITICAL: this.activeByPriority.get(OperationPriority.CRITICAL) || 0,
      HIGH: this.activeByPriority.get(OperationPriority.HIGH) || 0,
      NORMAL: this.activeByPriority.get(OperationPriority.NORMAL) || 0,
      LOW: this.activeByPriority.get(OperationPriority.LOW) || 0
    };

    const queuedByCriticality = {
      CRITICAL: this.queue.sizeByPriority(OperationPriority.CRITICAL),
      HIGH: this.queue.sizeByPriority(OperationPriority.HIGH),
      NORMAL: this.queue.sizeByPriority(OperationPriority.NORMAL),
      LOW: this.queue.sizeByPriority(OperationPriority.LOW)
    };

    const averageQueueWaitTime = this.queueWaitTimes.length > 0
      ? this.queueWaitTimes.reduce((a, b) => a + b, 0) / this.queueWaitTimes.length
      : 0;

    return {
      activeByCriticality,
      queuedByCriticality,
      totalRejected: this.totalRejected,
      averageQueueWaitTime,
      peakConcurrentRequests: this.peakConcurrent
    };
  }

  /**
   * Get current active count
   */
  public getActiveCount(): number {
    return Array.from(this.activeByPriority.values()).reduce((a, b) => a + b, 0);
  }

  /**
   * Get queued count
   */
  public getQueuedCount(): number {
    return this.queue.totalSize();
  }

  /**
   * Reset metrics
   */
  public resetMetrics(): void {
    this.totalRejected = 0;
    this.totalProcessed = 0;
    this.queueWaitTimes = [];
    this.peakConcurrent = Array.from(this.activeByPriority.values()).reduce((a, b) => a + b, 0);
  }

  /**
   * Shutdown bulkhead
   */
  public shutdown(): void {
    this.queue.clear();
    this.activeByPriority.forEach((_, priority) => {
      this.activeByPriority.set(priority, 0);
    });
  }
}
