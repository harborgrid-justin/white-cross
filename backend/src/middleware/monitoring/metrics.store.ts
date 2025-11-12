/**
 * LOC: WC-MID-METRICS-STORE-001
 * In-memory metrics store with batching
 *
 * Provides efficient in-memory storage for metrics with automatic
 * batching and periodic flushing to external systems.
 */

import type { MetricData } from './metrics.types';

/**
 * In-memory metrics store for batching
 *
 * Collects metrics in memory and flushes them in batches to reduce
 * I/O operations and improve performance. Supports automatic periodic
 * flushing and manual force flush operations.
 */
export class MetricsStore {
  private metrics: MetricData[] = [];
  private flushTimer?: NodeJS.Timeout;

  constructor(
    private batchSize: number,
    private flushInterval: number,
    private onFlush: (metrics: MetricData[]) => Promise<void>,
  ) {
    this.startFlushTimer();
  }

  /**
   * Add a metric to the store
   *
   * If the batch size is reached, triggers an immediate flush.
   */
  public add(metric: MetricData): void {
    this.metrics.push(metric);

    if (this.metrics.length >= this.batchSize) {
      this.flush();
    }
  }

  /**
   * Start the periodic flush timer
   */
  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      if (this.metrics.length > 0) {
        this.flush();
      }
    }, this.flushInterval);
  }

  /**
   * Flush all pending metrics
   *
   * Sends all accumulated metrics to the flush handler and clears
   * the internal buffer. If the flush fails, metrics are re-added
   * for retry.
   */
  private async flush(): Promise<void> {
    if (this.metrics.length === 0) return;

    const metricsToFlush = [...this.metrics];
    this.metrics = [];

    try {
      await this.onFlush(metricsToFlush);
    } catch (error) {
      console.error('[MetricsStore] Error flushing metrics:', error);
      // Re-add metrics for retry (simple strategy)
      this.metrics.unshift(...metricsToFlush);
    }
  }

  /**
   * Force an immediate flush of all pending metrics
   *
   * Useful for graceful shutdown or testing scenarios.
   */
  public async forceFlush(): Promise<void> {
    await this.flush();
  }

  /**
   * Clean up resources and perform final flush
   *
   * Should be called before application shutdown to ensure
   * all metrics are persisted.
   */
  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush(); // Final flush
  }
}
