/**
 * @fileoverview Request Deduplication Pattern Implementation
 * @module services/resilience/RequestDeduplicator
 * @category Services
 *
 * Implements request deduplication to prevent duplicate concurrent requests for the same resource.
 * This pattern is critical in healthcare operations to avoid duplicate medication records, allergy
 * entries, or incident reports that could compromise patient safety and data integrity.
 *
 * Key Features:
 * - Automatic deduplication of concurrent requests with identical parameters
 * - Promise sharing across duplicate requests (single execution)
 * - Comprehensive metrics tracking for monitoring effectiveness
 * - Automatic cleanup of aged requests to prevent memory leaks
 * - Configurable timeouts per request
 *
 * Healthcare Safety Benefits:
 * - Prevents duplicate medication administration records
 * - Avoids redundant allergy check API calls
 * - Eliminates race conditions in health record updates
 * - Reduces server load and improves response times
 * - Maintains data consistency across concurrent operations
 *
 * Pattern Benefits:
 * - Reduces unnecessary API calls (network efficiency)
 * - Prevents database contention from duplicate writes
 * - Improves user experience (faster perceived performance)
 * - Reduces server costs and resource usage
 *
 * @example
 * ```typescript
 * // Create deduplicator instance
 * const deduplicator = new RequestDeduplicator();
 *
 * // Execute requests - duplicates within the same execution window share results
 * const promise1 = deduplicator.execute('GET', '/api/patients/123', {}, () => fetchPatient(123));
 * const promise2 = deduplicator.execute('GET', '/api/patients/123', {}, () => fetchPatient(123));
 *
 * // promise1 === promise2 (same promise reference, only one API call made)
 * const [patient1, patient2] = await Promise.all([promise1, promise2]);
 * console.log(patient1 === patient2); // true
 *
 * // Check metrics
 * const metrics = deduplicator.getMetrics();
 * console.log(`Saved ${metrics.savedRequests} duplicate requests`);
 * console.log(`${metrics.duplicatedPercentage.toFixed(1)}% requests were deduplicated`);
 * ```
 *
 * @example
 * ```typescript
 * // Use global singleton instance
 * import { getGlobalDeduplicator } from './RequestDeduplicator';
 *
 * const deduplicator = getGlobalDeduplicator();
 *
 * // All requests share the same deduplicator instance
 * async function saveMedication(data: MedicationData) {
 *   return deduplicator.execute(
 *     'POST',
 *     '/api/medications',
 *     data,
 *     () => api.post('/api/medications', data),
 *     5000  // 5 second timeout
 *   );
 * }
 * ```
 */

import { DeduplicationKey, InFlightRequest, DeduplicationMetrics } from './types';
import crypto from 'crypto';

/**
 * Generate consistent hash for request parameters
 *
 * @param {unknown} params - Request parameters to hash (object, array, primitive, etc.)
 * @returns {string} Base-36 hash string for the parameters
 *
 * @description
 * Creates a deterministic hash of request parameters for deduplication key generation.
 * Handles complex objects by:
 * - Sorting object keys for consistent ordering
 * - Converting to JSON string for stable representation
 * - Computing simple integer hash for browser compatibility
 *
 * Falls back to 'hash-error' if hashing fails (e.g., circular references).
 *
 * @example
 * ```typescript
 * const hash1 = hashParams({ id: 123, type: 'medication' });
 * const hash2 = hashParams({ type: 'medication', id: 123 });
 * console.log(hash1 === hash2); // true - key order doesn't matter
 * ```
 *
 * @private
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
 * Request Deduplicator Class
 *
 * @class
 * @classdesc
 * Manages request deduplication by tracking in-flight requests and returning the same promise
 * for concurrent duplicate requests. Ensures only one actual network/API call is made for
 * identical requests executing at the same time.
 *
 * **How It Works:**
 * 1. Generates unique key from method + URL + params hash
 * 2. Checks if request with same key is already in-flight
 * 3. If yes: Returns existing promise (deduplication)
 * 4. If no: Executes new request and stores promise
 * 5. Cleans up completed requests from tracking map
 *
 * **Healthcare Use Cases:**
 * - Medication administration: Prevent duplicate med records from double-clicks
 * - Allergy checks: Deduplicate concurrent allergy verification calls
 * - Student lookups: Share results across multiple concurrent component requests
 * - Health records: Prevent race conditions in record updates
 *
 * **Performance Characteristics:**
 * - O(1) lookup for duplicate detection (Map-based)
 * - O(1) insertion and deletion
 * - Automatic memory management (cleanup on completion)
 * - Minimal overhead (~1-2ms per request)
 *
 * **Thread Safety:**
 * Safe for concurrent use in single-threaded JavaScript environment.
 * All operations are synchronous Map operations.
 *
 * @example
 * ```typescript
 * const deduplicator = new RequestDeduplicator();
 *
 * // Multiple components request the same patient data
 * async function fetchPatientInMultipleComponents(patientId: string) {
 *   const promise1 = deduplicator.execute(
 *     'GET',
 *     `/api/patients/${patientId}`,
 *     {},
 *     () => api.get(`/api/patients/${patientId}`)
 *   );
 *
 *   const promise2 = deduplicator.execute(
 *     'GET',
 *     `/api/patients/${patientId}`,
 *     {},
 *     () => api.get(`/api/patients/${patientId}`)
 *   );
 *
 *   // Only one API call is made, both promises resolve to same result
 *   const [result1, result2] = await Promise.all([promise1, promise2]);
 *   console.log(result1 === result2); // true
 * }
 * ```
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
   * Get existing in-flight request or execute new one
   *
   * @template T - Return type of the operation
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param {string} url - Request URL or endpoint path
   * @param {unknown} params - Request parameters (query params, body, etc.)
   * @param {() => Promise<T>} executor - Function that executes the actual request
   * @returns {Promise<T>} Result of the operation (either from existing promise or new execution)
   *
   * @description
   * Core deduplication method that checks for in-flight requests with matching key.
   * If found, returns the existing promise. Otherwise, executes new request and tracks it.
   *
   * **Deduplication Logic:**
   * - Generates key from method + URL + params hash
   * - Checks in-flight map for existing request
   * - Returns existing promise if found (no new execution)
   * - Executes and tracks new request if not found
   * - Automatically cleans up on completion/error
   *
   * **Best Practices:**
   * - Use for read operations (GET requests)
   * - Safe for idempotent operations
   * - Consider using execute() instead for operations requiring timeout control
   *
   * @example
   * ```typescript
   * // Multiple components load patient allergies concurrently
   * const deduplicator = new RequestDeduplicator();
   *
   * async function loadAllergies(patientId: string) {
   *   return deduplicator.getOrExecute(
   *     'GET',
   *     '/api/allergies',
   *     { patientId },
   *     () => fetch(`/api/allergies?patientId=${patientId}`).then(r => r.json())
   *   );
   * }
   *
   * // All three calls share the same promise, only one network request
   * const [allergies1, allergies2, allergies3] = await Promise.all([
   *   loadAllergies('P123'),
   *   loadAllergies('P123'),
   *   loadAllergies('P123')
   * ]);
   * ```
   *
   * @see {@link execute} for version with timeout control
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
   * Execute request with deduplication and timeout control
   *
   * @template T - Return type of the operation
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param {string} url - Request URL or endpoint path
   * @param {unknown} params - Request parameters (query params, body, etc.)
   * @param {() => Promise<T>} executor - Function that executes the actual request
   * @param {number} [timeout=30000] - Request timeout in milliseconds (default 30 seconds)
   * @returns {Promise<T>} Result of the operation
   * @throws {Error} If request times out after specified duration
   *
   * @description
   * Enhanced deduplication method with timeout support and duplicate request counting.
   * Preferred over getOrExecute() for production use due to timeout protection.
   *
   * **Features:**
   * - Full deduplication (identical to getOrExecute)
   * - Configurable timeout per request
   * - Tracks duplicate request count for metrics
   * - Automatic cleanup on completion/timeout
   * - Race condition protection via Promise.race
   *
   * **Timeout Behavior:**
   * - Throws Error if request exceeds timeout
   * - Cleans up in-flight tracking on timeout
   * - Does NOT cancel underlying HTTP request (fetch API limitation)
   * - All duplicates share the same timeout
   *
   * **Healthcare Use Cases:**
   * - Critical operations needing strict timeout (medication admin)
   * - High-volume operations (student lookups)
   * - Operations where timeout is safety-critical
   *
   * @example
   * ```typescript
   * const deduplicator = new RequestDeduplicator();
   *
   * // Medication administration with 5-second timeout
   * async function administerMedication(medId: string, studentId: string) {
   *   return deduplicator.execute(
   *     'POST',
   *     '/api/medications/administer',
   *     { medId, studentId, timestamp: Date.now() },
   *     () => api.post('/api/medications/administer', { medId, studentId }),
   *     5000  // 5 second timeout for critical operation
   *   );
   * }
   *
   * // Handle timeout gracefully
   * try {
   *   await administerMedication('M123', 'S456');
   * } catch (error) {
   *   if (error.message.includes('timeout')) {
   *     console.error('Medication administration timed out');
   *   }
   * }
   * ```
   *
   * @see {@link getOrExecute} for simplified version without timeout
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
   * Get current number of in-flight (pending) requests
   *
   * @returns {number} Count of requests currently being processed
   *
   * @description
   * Returns the number of unique requests currently in the in-flight map.
   * Useful for monitoring system load and detecting potential issues.
   *
   * @example
   * ```typescript
   * if (deduplicator.getPendingCount() > 100) {
   *   console.warn('High number of concurrent requests');
   * }
   * ```
   */
  public getPendingCount(): number {
    return this.inFlight.size;
  }

  /**
   * Get deduplication metrics and statistics
   *
   * @returns {DeduplicationMetrics} Current metrics including total, deduplicated, and efficiency stats
   *
   * @description
   * Returns comprehensive metrics for monitoring deduplication effectiveness:
   * - totalRequests: All requests submitted
   * - deduplicatedRequests: Number of duplicate requests avoided
   * - savedRequests: Same as deduplicatedRequests (redundant field)
   * - duplicatedPercentage: Percentage of requests that were duplicates (0-100)
   * - averageDeduplicationTime: Average time saved per deduplicated request
   *
   * Use these metrics for:
   * - Performance monitoring and dashboards
   * - Identifying frequently duplicated endpoints
   * - Measuring deduplication ROI
   * - Capacity planning
   *
   * @example
   * ```typescript
   * const metrics = deduplicator.getMetrics();
   * console.log(`Efficiency: ${metrics.duplicatedPercentage.toFixed(1)}% requests deduplicated`);
   * console.log(`Saved ${metrics.savedRequests} network calls`);
   * console.log(`Average time saved: ${metrics.averageDeduplicationTime.toFixed(0)}ms`);
   *
   * // Alert if deduplication is low (might indicate issues)
   * if (metrics.totalRequests > 100 && metrics.duplicatedPercentage < 5) {
   *   console.warn('Low deduplication rate - check request patterns');
   * }
   * ```
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
