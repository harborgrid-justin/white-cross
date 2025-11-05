/**
 * @fileoverview Health Monitor Implementation for Proactive Degradation Detection
 * @module services/resilience/HealthMonitor
 * @category Services
 *
 * Implements continuous health monitoring for API endpoints with proactive degradation detection.
 * Tracks success rates, response times, and timeout patterns to identify issues before circuit
 * breakers trip, enabling early intervention and improved system reliability.
 *
 * Key Features:
 * - **Real-time Metrics**: Tracks success/failure rates, response times (avg, p95, p99)
 * - **Degradation Detection**: Automatic alerts for high failure rates, slow responses, timeouts
 * - **Configurable Thresholds**: Separate warning and critical thresholds for different metrics
 * - **Event System**: Subscribe to degradation alerts for logging and monitoring
 * - **Healthcare Safety**: Early detection of service issues before they impact patient care
 *
 * Monitoring Metrics:
 * - Success rate and failure rate per endpoint
 * - Average, p95, and p99 response times
 * - Timeout rate tracking
 * - Request volume and patterns
 *
 * Healthcare Application:
 * - Early warning system for medication administration services
 * - Proactive monitoring of critical health record access
 * - Performance tracking for allergy check systems
 * - Degradation alerts before service disruption
 *
 * Integration with Resilience Patterns:
 * - Works alongside Circuit Breaker for comprehensive fault detection
 * - Provides metrics for Bulkhead capacity planning
 * - Feeds health data to monitoring dashboards
 *
 * @example
 * ```typescript
 * // Create and configure health monitor
 * const monitor = new HealthMonitor();
 *
 * // Update thresholds for stricter monitoring
 * monitor.updateThresholds({
 *   failureRateWarning: 0.05,    // Warn at 5% failure rate
 *   failureRateCritical: 0.15,   // Critical at 15%
 *   p95ResponseTimeWarning: 2000, // Warn at 2s
 *   p95ResponseTimeCritical: 4000 // Critical at 4s
 * });
 *
 * // Subscribe to degradation alerts
 * monitor.onEvent((event) => {
 *   if (event.type === 'healthDegradation') {
 *     console.warn('Endpoint degraded:', event.details);
 *     alertOps(event.details);
 *   }
 * });
 *
 * // Record successful requests
 * monitor.recordSuccess('/api/patients', 145); // 145ms response time
 *
 * // Record failures
 * monitor.recordFailure('/api/medications', 3000); // Failed after 3s
 *
 * // Check endpoint health
 * const health = monitor.getHealth('/api/patients');
 * if (health?.isDegraded) {
 *   console.warn('Endpoint degraded:', health.degradationReason);
 * }
 *
 * // Get comprehensive health report
 * const report = monitor.getHealthReport();
 * console.log(`Overall health score: ${report.overallHealthScore}/100`);
 * console.log(`Degraded endpoints: ${report.degradedCount}/${report.totalEndpoints}`);
 * ```
 *
 * @example
 * ```typescript
 * // Use global singleton instance
 * import { getGlobalHealthMonitor } from './HealthMonitor';
 *
 * const monitor = getGlobalHealthMonitor();
 *
 * // Perform health check with custom validation
 * const result = await monitor.healthCheck(
 *   '/api/medications',
 *   async () => {
 *     const response = await fetch('/api/medications/health');
 *     if (!response.ok) throw new Error('Health check failed');
 *   }
 * );
 *
 * if (!result.healthy) {
 *   console.error('Medication service unhealthy:', result.error);
 * }
 * ```
 */

import {
  EndpointHealth,
  DegradationAlert,
  HealthCheckResult,
  ResilienceEvent
} from './types';

/**
 * Health Monitor Class
 *
 * @class
 * @classdesc Continuously monitors endpoint health metrics and detects degradation patterns
 * before they trigger circuit breakers or impact users. Provides proactive alerting and
 * comprehensive health tracking across all monitored endpoints.
 *
 * Monitoring Strategy:
 * - Tracks per-endpoint success/failure rates
 * - Calculates response time percentiles (avg, p95, p99)
 * - Monitors timeout frequencies
 * - Maintains sliding window of recent requests (last 1000)
 * - Generates alerts based on configurable thresholds
 *
 * Healthcare Safety Features:
 * - Early detection of service degradation before patient care impact
 * - Proactive alerts for critical healthcare services
 * - Comprehensive metrics for compliance and audit requirements
 * - Real-time visibility into system health
 *
 * Degradation Detection:
 * - Failure Rate: Warning at 10%, Critical at 30%
 * - Response Time (p95): Warning at 3s, Critical at 5s
 * - Timeout Rate: Warning at 5%, Critical at 15%
 * - Automatic status updates and event emission
 *
 * Performance Characteristics:
 * - O(1) metric recording
 * - O(n log n) percentile calculation (n = last 1000 requests)
 * - Minimal memory footprint per endpoint (~8KB)
 * - Event-driven architecture for efficient alerting
 *
 * @example
 * ```typescript
 * const monitor = new HealthMonitor();
 *
 * // Configure custom thresholds for critical service
 * monitor.updateThresholds({
 *   failureRateWarning: 0.02,     // 2% failure rate triggers warning
 *   failureRateCritical: 0.05,    // 5% triggers critical alert
 *   p95ResponseTimeWarning: 1000, // 1 second warning threshold
 *   p95ResponseTimeCritical: 2000 // 2 second critical threshold
 * });
 *
 * // Subscribe to all health events
 * const unsubscribe = monitor.onEvent((event) => {
 *   console.log(`Health event: ${event.type}`, event.details);
 * });
 *
 * // Later: cleanup subscription
 * unsubscribe();
 * ```
 *
 * @see {@link CircuitBreaker} for automatic failure protection
 * @see {@link Bulkhead} for capacity isolation
 */
export class HealthMonitor {
  private endpointHealth: Map<string, EndpointHealth> = new Map();
  private responseTimes: Map<string, number[]> = new Map();
  private degradationAlerts: DegradationAlert[] = [];
  private eventListeners: Set<(event: ResilienceEvent) => void> = new Set();

  // Thresholds for degradation detection
  private thresholds = {
    failureRateWarning: 0.1, // 10%
    failureRateCritical: 0.3, // 30%
    p95ResponseTimeWarning: 3000, // 3 seconds
    p95ResponseTimeCritical: 5000, // 5 seconds
    timeoutRateWarning: 0.05, // 5%
    timeoutRateCritical: 0.15 // 15%
  };

  /**
   * Record a successful request for endpoint health tracking
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @param {number} responseTime - Response time in milliseconds
   * @returns {void}
   *
   * @description
   * Records a successful request completion, updating success metrics and response time
   * statistics. This data feeds into health calculations and degradation detection.
   *
   * Updates the following metrics:
   * - Total requests count
   * - Successful requests count
   * - Last request timestamp
   * - Response time percentiles (avg, p95, p99)
   * - Success rate
   *
   * @example
   * ```typescript
   * const monitor = new HealthMonitor();
   *
   * // Record successful API call
   * const startTime = performance.now();
   * const data = await fetchPatientData(patientId);
   * const duration = performance.now() - startTime;
   *
   * monitor.recordSuccess('/api/patients', duration);
   *
   * // Check if endpoint is healthy after recording
   * const health = monitor.getHealth('/api/patients');
   * console.log(`Success rate: ${(health.successRate * 100).toFixed(1)}%`);
   * ```
   */
  public recordSuccess(endpoint: string, responseTime: number): void {
    const health = this.getOrCreateHealth(endpoint);
    health.totalRequests++;
    health.successfulRequests++;
    health.lastRequestTime = Date.now();
    this.updateResponseTimes(endpoint, responseTime);
    this.updateMetrics(endpoint, health);
  }

  /**
   * Record a failed request for endpoint health tracking
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @param {number} [responseTime] - Optional response time in milliseconds (if request completed before failing)
   * @returns {void}
   *
   * @description
   * Records a failed request, updating failure metrics and checking for degradation patterns.
   * Triggers degradation detection which may generate alerts if thresholds are exceeded.
   *
   * Updates the following metrics:
   * - Total requests count
   * - Failed requests count
   * - Last request timestamp
   * - Response time (if provided)
   * - Failure rate
   *
   * Triggers degradation check which evaluates:
   * - Failure rate against warning/critical thresholds
   * - Response time percentiles
   * - Timeout rates
   *
   * @example
   * ```typescript
   * const monitor = new HealthMonitor();
   *
   * try {
   *   const startTime = performance.now();
   *   await fetchMedicationData(medId);
   *   monitor.recordSuccess('/api/medications', performance.now() - startTime);
   * } catch (error) {
   *   const duration = performance.now() - startTime;
   *   monitor.recordFailure('/api/medications', duration);
   *
   *   // Check if endpoint has degraded
   *   const health = monitor.getHealth('/api/medications');
   *   if (health?.isDegraded) {
   *     console.error('Service degraded:', health.degradationReason);
   *     // Use cached data or fallback service
   *   }
   * }
   * ```
   *
   * @remarks
   * Failure recording automatically triggers degradation detection. Subscribe to events
   * via `onEvent()` to receive real-time alerts when thresholds are exceeded.
   */
  public recordFailure(endpoint: string, responseTime?: number): void {
    const health = this.getOrCreateHealth(endpoint);
    health.totalRequests++;
    health.failedRequests++;
    health.lastRequestTime = Date.now();

    if (responseTime !== undefined) {
      this.updateResponseTimes(endpoint, responseTime);
    }

    this.updateMetrics(endpoint, health);
    this.checkDegradation(endpoint, health);
  }

  /**
   * Record a timeout request for endpoint health tracking
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @param {number} timeoutMs - Timeout duration in milliseconds
   * @returns {void}
   *
   * @description
   * Records a request that timed out, updating both timeout and failure metrics.
   * Timeouts are tracked separately to identify network or service latency issues.
   *
   * Timeouts are counted as failures and trigger degradation detection with special
   * emphasis on timeout rate thresholds.
   *
   * @example
   * ```typescript
   * const monitor = new HealthMonitor();
   *
   * async function fetchWithTimeout(endpoint: string, timeoutMs: number) {
   *   const controller = new AbortController();
   *   const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
   *
   *   try {
   *     const response = await fetch(endpoint, { signal: controller.signal });
   *     monitor.recordSuccess(endpoint, performance.now());
   *     return response;
   *   } catch (error) {
   *     if (error.name === 'AbortError') {
   *       monitor.recordTimeout(endpoint, timeoutMs);
   *       throw new Error(`Request timed out after ${timeoutMs}ms`);
   *     }
   *     monitor.recordFailure(endpoint);
   *     throw error;
   *   } finally {
   *     clearTimeout(timeoutId);
   *   }
   * }
   * ```
   *
   * @remarks
   * High timeout rates often indicate network issues, service overload, or improperly
   * configured timeout values. Critical healthcare services should have strict timeout
   * monitoring to ensure timely responses.
   */
  public recordTimeout(endpoint: string, timeoutMs: number): void {
    const health = this.getOrCreateHealth(endpoint);
    health.totalRequests++;
    health.timeoutRequests++;
    health.failedRequests++;
    health.lastRequestTime = Date.now();
    this.updateResponseTimes(endpoint, timeoutMs);
    this.updateMetrics(endpoint, health);
    this.checkDegradation(endpoint, health);
  }

  /**
   * Get or create health record for endpoint
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @returns {EndpointHealth} Health record for the endpoint
   * @private
   */
  private getOrCreateHealth(endpoint: string): EndpointHealth {
    if (!this.endpointHealth.has(endpoint)) {
      this.endpointHealth.set(endpoint, {
        endpoint,
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        timeoutRequests: 0,
        successRate: 1.0,
        failureRate: 0,
        lastRequestTime: Date.now(),
        avgResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        isDegraded: false
      });

      this.responseTimes.set(endpoint, []);
    }

    return this.endpointHealth.get(endpoint)!;
  }

  /**
   * Update response times for endpoint
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @param {number} responseTime - Response time in milliseconds
   * @returns {void}
   * @private
   *
   * @description
   * Maintains a sliding window of the last 1000 response times for percentile calculation.
   */
  private updateResponseTimes(endpoint: string, responseTime: number): void {
    let times = this.responseTimes.get(endpoint) || [];

    if (!times) {
      times = [];
      this.responseTimes.set(endpoint, times);
    }

    times.push(responseTime);

    // Keep only last 1000 response times for percentile calculation
    if (times.length > 1000) {
      times.shift();
    }
  }

  /**
   * Update computed metrics for endpoint
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @param {EndpointHealth} health - Health record to update
   * @returns {void}
   * @private
   *
   * @description
   * Recalculates derived metrics including success rate, failure rate, and response time
   * percentiles (avg, p95, p99).
   */
  private updateMetrics(endpoint: string, health: EndpointHealth): void {
    const total = health.totalRequests;

    if (total === 0) {
      health.successRate = 1.0;
      health.failureRate = 0;
      return;
    }

    health.successRate = health.successfulRequests / total;
    health.failureRate = health.failedRequests / total;

    // Calculate response time percentiles
    const times = this.responseTimes.get(endpoint) || [];
    if (times.length > 0) {
      const sorted = [...times].sort((a, b) => a - b);
      health.avgResponseTime = sorted.reduce((a, b) => a + b, 0) / sorted.length;
      health.p95ResponseTime = sorted[Math.floor(sorted.length * 0.95)] || 0;
      health.p99ResponseTime = sorted[Math.floor(sorted.length * 0.99)] || 0;
    }

    this.endpointHealth.set(endpoint, health);
  }

  /**
   * Check for degradation patterns and generate alerts
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @param {EndpointHealth} health - Health record to check
   * @returns {void}
   * @private
   *
   * @description
   * Evaluates current metrics against configured thresholds and generates degradation
   * alerts when limits are exceeded. Checks failure rate, response time, and timeout rate.
   */
  private checkDegradation(endpoint: string, health: EndpointHealth): void {
    const alerts: DegradationAlert[] = [];

    // Check failure rate
    if (health.failureRate >= this.thresholds.failureRateCritical) {
      alerts.push({
        endpoint,
        type: 'highFailureRate',
        severity: 'critical',
        message: `Critical: ${(health.failureRate * 100).toFixed(1)}% failure rate`,
        timestamp: Date.now(),
        metrics: { failureRate: health.failureRate }
      });
    } else if (health.failureRate >= this.thresholds.failureRateWarning) {
      alerts.push({
        endpoint,
        type: 'highFailureRate',
        severity: 'high',
        message: `Warning: ${(health.failureRate * 100).toFixed(1)}% failure rate`,
        timestamp: Date.now(),
        metrics: { failureRate: health.failureRate }
      });
    }

    // Check response time
    if (health.p95ResponseTime >= this.thresholds.p95ResponseTimeCritical) {
      alerts.push({
        endpoint,
        type: 'slowResponse',
        severity: 'critical',
        message: `Critical: p95 response time ${health.p95ResponseTime.toFixed(0)}ms`,
        timestamp: Date.now(),
        metrics: { p95ResponseTime: health.p95ResponseTime }
      });
    } else if (health.p95ResponseTime >= this.thresholds.p95ResponseTimeWarning) {
      alerts.push({
        endpoint,
        type: 'slowResponse',
        severity: 'high',
        message: `Warning: p95 response time ${health.p95ResponseTime.toFixed(0)}ms`,
        timestamp: Date.now(),
        metrics: { p95ResponseTime: health.p95ResponseTime }
      });
    }

    // Check timeout rate
    const timeoutRate = health.totalRequests > 0 ? health.timeoutRequests / health.totalRequests : 0;
    if (timeoutRate >= this.thresholds.timeoutRateCritical) {
      alerts.push({
        endpoint,
        type: 'highTimeout',
        severity: 'critical',
        message: `Critical: ${(timeoutRate * 100).toFixed(1)}% timeout rate`,
        timestamp: Date.now(),
        metrics: { timeoutRequests: health.timeoutRequests }
      });
    } else if (timeoutRate >= this.thresholds.timeoutRateWarning) {
      alerts.push({
        endpoint,
        type: 'highTimeout',
        severity: 'high',
        message: `Warning: ${(timeoutRate * 100).toFixed(1)}% timeout rate`,
        timestamp: Date.now(),
        metrics: { timeoutRequests: health.timeoutRequests }
      });
    }

    // Update degradation status
    const isDegraded = alerts.some(a => a.severity === 'critical' || a.severity === 'high');
    health.isDegraded = isDegraded;
    if (isDegraded) {
      health.degradationReason = alerts.map(a => a.message).join('; ');
    }

    // Store and emit alerts
    alerts.forEach(alert => {
      this.degradationAlerts.push(alert);
      this.emitEvent({
        type: 'healthDegradation',
        endpoint,
        details: { ...alert } as Record<string, unknown>,
        timestamp: Date.now()
      });
    });

    // Keep only last 100 alerts
    if (this.degradationAlerts.length > 100) {
      this.degradationAlerts = this.degradationAlerts.slice(-100);
    }
  }

  /**
   * Emit event to all registered listeners
   *
   * @param {ResilienceEvent} event - Event to emit
   * @returns {void}
   * @private
   *
   * @description
   * Safely invokes all event listeners, catching and logging any errors that occur
   * during event handling to prevent listener failures from impacting monitoring.
   */
  private emitEvent(event: ResilienceEvent): void {
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in health monitor event listener:', error);
      }
    });
  }

  /**
   * Register event listener for health monitoring events
   *
   * @param {(event: ResilienceEvent) => void} listener - Event listener callback function
   * @returns {() => void} Unsubscribe function to remove the listener
   *
   * @description
   * Subscribe to health monitoring events to receive real-time notifications when
   * endpoints degrade or health thresholds are exceeded. Listeners receive events
   * of type 'healthDegradation' with detailed alert information.
   *
   * The returned unsubscribe function should be called to prevent memory leaks when
   * the listener is no longer needed.
   *
   * @example
   * ```typescript
   * const monitor = new HealthMonitor();
   *
   * // Subscribe to all health events
   * const unsubscribe = monitor.onEvent((event) => {
   *   if (event.type === 'healthDegradation') {
   *     const alert = event.details as DegradationAlert;
   *     console.warn(`Endpoint ${event.endpoint} degraded:`, alert.message);
   *
   *     // Send to monitoring system
   *     if (alert.severity === 'critical') {
   *       alertOps('Critical endpoint degradation', alert);
   *     }
   *   }
   * });
   *
   * // Later: cleanup when component unmounts
   * unsubscribe();
   * ```
   *
   * @example
   * ```typescript
   * // Healthcare-specific alerting
   * monitor.onEvent((event) => {
   *   if (event.type === 'healthDegradation') {
   *     const alert = event.details as DegradationAlert;
   *
   *     // Alert for critical healthcare services
   *     if (event.endpoint.includes('/medications') && alert.severity === 'critical') {
   *       notifyHealthcareOps({
   *         service: 'Medication Administration',
   *         severity: 'CRITICAL',
   *         message: alert.message,
   *         patientSafetyImpact: true
   *       });
   *     }
   *   }
   * });
   * ```
   */
  public onEvent(listener: (event: ResilienceEvent) => void): () => void {
    this.eventListeners.add(listener);
    return () => this.eventListeners.delete(listener);
  }

  /**
   * Get health status for a specific endpoint
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @returns {EndpointHealth | undefined} Health status for the endpoint, or undefined if not tracked
   *
   * @description
   * Returns the current health metrics for a specific endpoint including success rate,
   * failure rate, response times, and degradation status.
   *
   * @example
   * ```typescript
   * const health = monitor.getHealth('/api/patients');
   *
   * if (health) {
   *   console.log(`Success rate: ${(health.successRate * 100).toFixed(1)}%`);
   *   console.log(`Avg response: ${health.avgResponseTime.toFixed(0)}ms`);
   *   console.log(`p95 response: ${health.p95ResponseTime.toFixed(0)}ms`);
   *
   *   if (health.isDegraded) {
   *     console.warn('Endpoint degraded:', health.degradationReason);
   *   }
   * }
   * ```
   */
  public getHealth(endpoint: string): EndpointHealth | undefined {
    return this.endpointHealth.get(endpoint);
  }

  /**
   * Get all endpoint health statuses
   *
   * @returns {Map<string, EndpointHealth>} Map of endpoint to health status
   *
   * @description
   * Returns health metrics for all monitored endpoints. Useful for dashboards
   * and comprehensive health reporting.
   *
   * @example
   * ```typescript
   * const allHealth = monitor.getAllHealth();
   *
   * allHealth.forEach((health, endpoint) => {
   *   console.log(`${endpoint}: ${health.isDegraded ? '🔴' : '🟢'}`);
   *   console.log(`  Success rate: ${(health.successRate * 100).toFixed(1)}%`);
   *   console.log(`  Avg response: ${health.avgResponseTime.toFixed(0)}ms`);
   * });
   * ```
   */
  public getAllHealth(): Map<string, EndpointHealth> {
    return new Map(this.endpointHealth);
  }

  /**
   * Get list of degraded endpoints
   *
   * @returns {EndpointHealth[]} Array of health records for degraded endpoints
   *
   * @description
   * Returns only endpoints that are currently marked as degraded (isDegraded = true).
   * Useful for alerting and prioritized monitoring.
   *
   * @example
   * ```typescript
   * const degraded = monitor.getDegradedEndpoints();
   *
   * if (degraded.length > 0) {
   *   console.warn(`${degraded.length} endpoints degraded:`);
   *   degraded.forEach(health => {
   *     console.warn(`  ${health.endpoint}: ${health.degradationReason}`);
   *   });
   *
   *   // Alert operations team
   *   alertOps('Multiple endpoints degraded', { count: degraded.length });
   * }
   * ```
   */
  public getDegradedEndpoints(): EndpointHealth[] {
    const degraded: EndpointHealth[] = [];
    this.endpointHealth.forEach(health => {
      if (health.isDegraded) {
        degraded.push(health);
      }
    });
    return degraded;
  }

  /**
   * Get recent degradation alerts
   *
   * @param {number} [limit=10] - Maximum number of alerts to return
   * @returns {DegradationAlert[]} Array of recent alerts (most recent last)
   *
   * @description
   * Returns the most recent degradation alerts. Alerts are stored in chronological
   * order with a maximum of 100 total alerts retained.
   *
   * @example
   * ```typescript
   * const recentAlerts = monitor.getRecentAlerts(5);
   *
   * recentAlerts.forEach(alert => {
   *   console.log(`[${alert.severity}] ${alert.endpoint}: ${alert.message}`);
   * });
   * ```
   */
  public getRecentAlerts(limit: number = 10): DegradationAlert[] {
    return this.degradationAlerts.slice(-limit);
  }

  /**
   * Get alerts for a specific endpoint
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @param {number} [limit=10] - Maximum number of alerts to return
   * @returns {DegradationAlert[]} Array of alerts for the endpoint (most recent last)
   *
   * @description
   * Returns degradation alerts filtered to a specific endpoint. Useful for
   * endpoint-specific debugging and analysis.
   *
   * @example
   * ```typescript
   * const medicationAlerts = monitor.getAlertsForEndpoint('/api/medications', 20);
   *
   * console.log(`Medication service alerts: ${medicationAlerts.length}`);
   * medicationAlerts.forEach(alert => {
   *   console.log(`  [${new Date(alert.timestamp).toISOString()}] ${alert.message}`);
   * });
   * ```
   */
  public getAlertsForEndpoint(endpoint: string, limit: number = 10): DegradationAlert[] {
    return this.degradationAlerts
      .filter(alert => alert.endpoint === endpoint)
      .slice(-limit);
  }

  /**
   * Update degradation detection thresholds
   *
   * @param {Partial<typeof this.thresholds>} thresholds - New threshold values to merge with existing thresholds
   * @returns {void}
   *
   * @description
   * Updates the thresholds used for degradation detection. Only provided values are updated;
   * omitted thresholds retain their current values.
   *
   * Available thresholds:
   * - `failureRateWarning`: Failure rate (0-1) for warning alerts
   * - `failureRateCritical`: Failure rate (0-1) for critical alerts
   * - `p95ResponseTimeWarning`: P95 response time (ms) for warning alerts
   * - `p95ResponseTimeCritical`: P95 response time (ms) for critical alerts
   * - `timeoutRateWarning`: Timeout rate (0-1) for warning alerts
   * - `timeoutRateCritical`: Timeout rate (0-1) for critical alerts
   *
   * @example
   * ```typescript
   * // Stricter thresholds for critical healthcare service
   * monitor.updateThresholds({
   *   failureRateWarning: 0.02,     // Warn at 2% failures
   *   failureRateCritical: 0.05,    // Critical at 5% failures
   *   p95ResponseTimeWarning: 1000, // Warn at 1 second
   *   p95ResponseTimeCritical: 2000 // Critical at 2 seconds
   * });
   * ```
   */
  public updateThresholds(thresholds: Partial<typeof this.thresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  /**
   * Reset health metrics for a specific endpoint
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @returns {void}
   *
   * @description
   * Clears all health metrics and response time data for a specific endpoint.
   * Useful after maintenance windows or when resetting monitoring after fixing issues.
   *
   * @example
   * ```typescript
   * // After maintenance window
   * monitor.resetEndpoint('/api/medications');
   * console.log('Medication service metrics reset after maintenance');
   * ```
   */
  public resetEndpoint(endpoint: string): void {
    this.endpointHealth.delete(endpoint);
    this.responseTimes.delete(endpoint);
  }

  /**
   * Reset all health metrics
   *
   * @returns {void}
   *
   * @description
   * Clears all health metrics, response times, and alerts for all endpoints.
   * Use with caution in production; primarily for testing or after major system changes.
   *
   * @example
   * ```typescript
   * // In tests
   * afterEach(() => {
   *   monitor.resetAll();
   * });
   * ```
   */
  public resetAll(): void {
    this.endpointHealth.clear();
    this.responseTimes.clear();
    this.degradationAlerts = [];
  }

  /**
   * Get comprehensive health report for all monitored endpoints
   *
   * @returns {object} Comprehensive health report
   * @property {number} totalEndpoints - Total number of monitored endpoints
   * @property {number} degradedCount - Number of currently degraded endpoints
   * @property {EndpointHealth[]} endpoints - Health data for all endpoints
   * @property {DegradationAlert[]} recentAlerts - Last 20 degradation alerts
   * @property {number} overallHealthScore - Overall health score (0-100)
   *
   * @description
   * Generates a comprehensive health report including all endpoint metrics, degraded
   * endpoint count, recent alerts, and an overall health score based on average
   * success rates across all endpoints.
   *
   * The overall health score is calculated as:
   * `Math.round(average_success_rate * 100)`
   *
   * @example
   * ```typescript
   * const report = monitor.getHealthReport();
   *
   * console.log('System Health Report');
   * console.log('===================');
   * console.log(`Overall Score: ${report.overallHealthScore}/100`);
   * console.log(`Endpoints: ${report.totalEndpoints}`);
   * console.log(`Degraded: ${report.degradedCount}`);
   * console.log(`Recent Alerts: ${report.recentAlerts.length}`);
   *
   * if (report.overallHealthScore < 90) {
   *   console.warn('System health below threshold');
   * }
   *
   * // Show degraded endpoints
   * report.endpoints
   *   .filter(e => e.isDegraded)
   *   .forEach(e => {
   *     console.warn(`${e.endpoint}: ${e.degradationReason}`);
   *   });
   * ```
   */
  public getHealthReport(): {
    totalEndpoints: number;
    degradedCount: number;
    endpoints: EndpointHealth[];
    recentAlerts: DegradationAlert[];
    overallHealthScore: number;
  } {
    const endpoints = Array.from(this.endpointHealth.values());
    const degradedCount = endpoints.filter(e => e.isDegraded).length;

    // Calculate overall health score (0-100)
    // Based on average success rate across all endpoints
    const avgSuccessRate = endpoints.length > 0
      ? endpoints.reduce((sum, e) => sum + e.successRate, 0) / endpoints.length
      : 1;

    const overallHealthScore = Math.round(avgSuccessRate * 100);

    return {
      totalEndpoints: endpoints.length,
      degradedCount,
      endpoints,
      recentAlerts: this.degradationAlerts.slice(-20),
      overallHealthScore
    };
  }

  /**
   * Perform active health check on an endpoint
   *
   * @param {string} endpoint - The endpoint URL or identifier
   * @param {() => Promise<void>} checkFn - Async function that performs the health check (should throw on failure)
   * @returns {Promise<HealthCheckResult>} Result of the health check
   *
   * @description
   * Performs an active health check by executing the provided check function with a 5-second
   * timeout. Records the result (success or failure) in health metrics and returns detailed
   * health check results including response time and health status.
   *
   * The check function should throw an error if the health check fails. Successful completion
   * indicates the endpoint is healthy.
   *
   * @example
   * ```typescript
   * // Perform health check with custom validation
   * const result = await monitor.healthCheck(
   *   '/api/medications',
   *   async () => {
   *     const response = await fetch('/api/medications/health');
   *     if (!response.ok) {
   *       throw new Error(`Health check failed: ${response.status}`);
   *     }
   *     const data = await response.json();
   *     if (!data.healthy) {
   *       throw new Error('Service reports unhealthy status');
   *     }
   *   }
   * );
   *
   * if (!result.healthy) {
   *   console.error('Medication service unhealthy:', result.error);
   *   // Switch to fallback service or cached data
   * } else {
   *   console.log(`Service healthy, response time: ${result.responseTime}ms`);
   * }
   * ```
   *
   * @remarks
   * Health checks automatically record success/failure in monitoring metrics, contributing
   * to the overall health score and degradation detection for the endpoint.
   */
  public async healthCheck(endpoint: string, checkFn: () => Promise<void>): Promise<HealthCheckResult> {
    const startTime = performance.now();

    try {
      await Promise.race([
        checkFn(),
        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error('Health check timeout')), 5000)
        )
      ]);

      const responseTime = performance.now() - startTime;
      this.recordSuccess(endpoint, responseTime);

      return {
        endpoint,
        healthy: true,
        responseTime,
        timestamp: Date.now()
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      this.recordFailure(endpoint, responseTime);

      return {
        endpoint,
        healthy: false,
        responseTime,
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

/**
 * Singleton instance for global health monitoring
 */
let monitorInstance: HealthMonitor | null = null;

/**
 * Get global health monitor instance
 *
 * @returns {HealthMonitor} Shared health monitor instance
 *
 * @description
 * Returns the global singleton health monitor instance. Creates the instance on first access.
 * Use this for application-wide health monitoring to ensure consistent metrics across all code.
 *
 * @example
 * ```typescript
 * import { getGlobalHealthMonitor } from './HealthMonitor';
 *
 * const monitor = getGlobalHealthMonitor();
 *
 * // All code shares the same monitor instance
 * monitor.recordSuccess('/api/patients', 150);
 * ```
 */
export function getGlobalHealthMonitor(): HealthMonitor {
  if (!monitorInstance) {
    monitorInstance = new HealthMonitor();
  }
  return monitorInstance;
}

/**
 * Reset global health monitor (for testing)
 *
 * @returns {void}
 *
 * @description
 * Resets all metrics in the global health monitor instance. Primarily for use in tests
 * to ensure clean state between test runs.
 *
 * **Warning**: Do not use in production code as it clears all monitoring history.
 *
 * @example
 * ```typescript
 * // In test cleanup
 * afterEach(() => {
 *   resetGlobalHealthMonitor();
 * });
 * ```
 */
export function resetGlobalHealthMonitor(): void {
  if (monitorInstance) {
    monitorInstance.resetAll();
  }
}
