/**
 * Bulkhead Pattern Implementation
 * Isolates critical resources through separate concurrency pools
 * Prevents resource exhaustion from cascading across the system
 */

import {
  OperationPriority,
  BulkheadConfig,
  BulkheadOperationRequest,
  BulkheadMetrics,
  ResilienceError
} from './types';

/**
 * Priority Queue
 * Manages queued operations with priority-based ordering
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
   * Enqueue item with priority
   */
  public enqueue(item: T, priority: OperationPriority): void {
    const queue = this.queues.get(priority) || [];
    queue.push(item);
    this.queues.set(priority, queue);
  }

  /**
   * Dequeue item (respects priority)
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
 * Isolates operations by priority with separate concurrency pools
 * Prevents critical operations from being starved by lower-priority work
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
   * Submit operation to bulkhead
   * Returns promise that resolves when operation completes
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
   * Get current metrics
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
