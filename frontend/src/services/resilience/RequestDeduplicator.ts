/**
 * Request Deduplication Pattern Implementation
 * Prevents duplicate concurrent requests for the same resource
 * Critical for healthcare operations to avoid duplicate medication records or allergy entries
 */

import { DeduplicationKey, InFlightRequest, DeduplicationMetrics } from './types';
import crypto from 'crypto';

/**
 * Hash function for parameters
 * Creates consistent hash for request parameters
 */
function hashParams(params: unknown): string {
  try {
    const jsonString = JSON.stringify(params || {}, Object.keys(params || {}).sort());
    // Use simple string hash for browser compatibility
    let hash = 0;
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  } catch (error) {
    console.warn('Error hashing params:', error);
    return 'hash-error';
  }
}

/**
 * Request Deduplicator
 * Tracks in-flight requests and returns same promise for duplicates
 * Critical for preventing duplicate medication administration records
 */
export class RequestDeduplicator {
  private inFlight: Map<string, InFlightRequest> = new Map();
  private metrics: DeduplicationMetrics = {
    totalRequests: 0,
    deduplicatedRequests: 0,
    savedRequests: 0,
    duplicatedPercentage: 0,
    averageDeduplicationTime: 0
  };
  private deduplicationTimings: number[] = [];

  /**
   * Get or execute request
   * Returns same promise for duplicate concurrent requests
   */
  public async getOrExecute<T>(
    method: string,
    url: string,
    params: unknown,
    executor: () => Promise<T>
  ): Promise<T> {
    const key = this.createKey(method, url, params);
    this.metrics.totalRequests++;

    // Check if request is already in flight
    const existing = this.inFlight.get(key);
    if (existing) {
      this.metrics.deduplicatedRequests++;
      this.metrics.savedRequests++;
      return existing.promise as Promise<T>;
    }

    // Execute new request
    const startTime = performance.now();
    const promise = executor()
      .then(result => {
        this.recordDeduplicationTiming(performance.now() - startTime);
        this.inFlight.delete(key);
        return result;
      })
      .catch(error => {
        this.inFlight.delete(key);
        throw error;
      });

    // Store in-flight request
    const inFlightRequest: InFlightRequest<T> = {
      key,
      promise,
      startTime: Date.now(),
      count: 1
    };

    this.inFlight.set(key, inFlightRequest as InFlightRequest);
    return promise;
  }

  /**
   * Execute with deduplication
   * Allows custom timeout and cleanup
   */
  public async execute<T>(
    method: string,
    url: string,
    params: unknown,
    executor: () => Promise<T>,
    timeout: number = 30000
  ): Promise<T> {
    const key = this.createKey(method, url, params);

    // Check existing request
    const existing = this.inFlight.get(key);
    if (existing) {
      // Increment request count for metrics
      existing.count++;
      this.metrics.deduplicatedRequests++;
      return existing.promise as Promise<T>;
    }

    // Execute with timeout
    const startTime = performance.now();
    const promise = Promise.race([
      executor(),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Request timeout after ${timeout}ms`)), timeout)
      )
    ])
      .then(result => {
        this.recordDeduplicationTiming(performance.now() - startTime);
        this.cleanup(key);
        return result;
      })
      .catch(error => {
        this.cleanup(key);
        throw error;
      });

    // Store in-flight request
    const inFlightRequest: InFlightRequest<T> = {
      key,
      promise,
      startTime: Date.now(),
      count: 1
    };

    this.inFlight.set(key, inFlightRequest as InFlightRequest);
    this.metrics.totalRequests++;

    return promise;
  }

  /**
   * Create deduplication key
   */
  private createKey(method: string, url: string, params: unknown): string {
    const paramsHash = hashParams(params);
    // Normalize URL by removing trailing slash
    const normalizedUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    return `${method}:${normalizedUrl}:${paramsHash}`;
  }

  /**
   * Record deduplication timing
   */
  private recordDeduplicationTiming(duration: number): void {
    this.deduplicationTimings.push(duration);

    // Keep only last 100 timings
    if (this.deduplicationTimings.length > 100) {
      this.deduplicationTimings.shift();
    }

    // Update average
    if (this.deduplicationTimings.length > 0) {
      this.metrics.averageDeduplicationTime =
        this.deduplicationTimings.reduce((a, b) => a + b, 0) / this.deduplicationTimings.length;
    }
  }

  /**
   * Cleanup request from in-flight map
   */
  private cleanup(key: string): void {
    this.inFlight.delete(key);
  }

  /**
   * Get current in-flight requests
   */
  public getInFlight(): Map<string, InFlightRequest> {
    return new Map(this.inFlight);
  }

  /**
   * Get pending request count
   */
  public getPendingCount(): number {
    return this.inFlight.size;
  }

  /**
   * Get metrics
   */
  public getMetrics(): DeduplicationMetrics {
    const total = this.metrics.totalRequests;
    const duplicatedPercentage = total > 0
      ? (this.metrics.deduplicatedRequests / total) * 100
      : 0;

    return {
      totalRequests: this.metrics.totalRequests,
      deduplicatedRequests: this.metrics.deduplicatedRequests,
      savedRequests: this.metrics.savedRequests,
      duplicatedPercentage,
      averageDeduplicationTime: this.metrics.averageDeduplicationTime
    };
  }

  /**
   * Force cleanup of specific request
   */
  public forceCleanup(method: string, url: string, params: unknown): void {
    const key = this.createKey(method, url, params);
    this.cleanup(key);
  }

  /**
   * Clear all in-flight requests
   */
  public clearAll(): void {
    this.inFlight.clear();
  }

  /**
   * Reset metrics
   */
  public resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      deduplicatedRequests: 0,
      savedRequests: 0,
      duplicatedPercentage: 0,
      averageDeduplicationTime: 0
    };
    this.deduplicationTimings = [];
  }

  /**
   * Get detailed metrics for debugging
   */
  public getDetailedMetrics(): {
    metrics: DeduplicationMetrics;
    inFlightCount: number;
    inFlightRequests: Array<{ key: string; elapsed: number; count: number }>;
  } {
    const inFlightRequests: Array<{ key: string; elapsed: number; count: number }> = [];
    this.inFlight.forEach((request, key) => {
      inFlightRequests.push({
        key,
        elapsed: Date.now() - request.startTime,
        count: request.count
      });
    });

    return {
      metrics: this.getMetrics(),
      inFlightCount: this.inFlight.size,
      inFlightRequests
    };
  }

  /**
   * Cleanup aged requests
   * Removes requests that have been in-flight longer than timeout
   */
  public cleanupAgedRequests(maxAge: number = 60000): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.inFlight.forEach((request, key) => {
      if (now - request.startTime > maxAge) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.inFlight.delete(key));
  }
}

/**
 * Singleton instance for global deduplication
 */
let deduplicatorInstance: RequestDeduplicator | null = null;

/**
 * Get global deduplicator instance
 */
export function getGlobalDeduplicator(): RequestDeduplicator {
  if (!deduplicatorInstance) {
    deduplicatorInstance = new RequestDeduplicator();

    // Cleanup aged requests periodically
    setInterval(() => {
      deduplicatorInstance?.cleanupAgedRequests(60000);
    }, 30000);
  }
  return deduplicatorInstance;
}

/**
 * Reset global deduplicator (for testing)
 */
export function resetGlobalDeduplicator(): void {
  if (deduplicatorInstance) {
    deduplicatorInstance.clearAll();
    deduplicatorInstance.resetMetrics();
  }
}
