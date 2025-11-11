/**
 * @fileoverview Degradation Detection and Alerting System
 * @module services/resilience/HealthMonitor/DegradationDetector
 * @category Resilience Services
 *
 * Monitors endpoint health metrics and detects degradation patterns based on
 * configurable thresholds. Generates alerts and manages event notifications
 * for proactive system monitoring.
 */

import type {
  EndpointHealth,
  DegradationAlert,
  HealthThresholds,
  DegradationType,
  AlertSeverity,
  HealthEventListener,
  UnsubscribeFunction
} from './types';
import { ResilienceEvent } from '../types';

/**
 * Degradation Detector Class
 *
 * @class
 * @classdesc Monitors endpoint health and detects degradation patterns using
 * configurable thresholds. Provides alerting and event notification capabilities
 * for proactive system monitoring and early intervention.
 *
 * Detection Capabilities:
 * - High failure rate monitoring (warning and critical thresholds)
 * - Slow response time detection (p95 percentile tracking)
 * - Timeout rate monitoring with configurable limits
 * - Event-driven alert system for real-time notifications
 * - Alert history management with automatic cleanup
 *
 * Healthcare Safety Features:
 * - Critical service prioritization
 * - Early warning system for patient safety
 * - Configurable thresholds for different service tiers
 * - Comprehensive audit trail for compliance
 */
export class DegradationDetector {
  private alerts: DegradationAlert[] = [];
  private eventListeners: Set<HealthEventListener> = new Set();
  private thresholds: HealthThresholds = {
    failureRateWarning: 0.1, // 10%
    failureRateCritical: 0.3, // 30%
    p95ResponseTimeWarning: 3000, // 3 seconds
    p95ResponseTimeCritical: 5000, // 5 seconds
    timeoutRateWarning: 0.05, // 5%
    timeoutRateCritical: 0.15 // 15%
  };
  private maxAlerts: number = 100;

  /**
   * Create degradation detector with optional configuration
   *
   * @param {Partial<HealthThresholds>} [initialThresholds] - Initial threshold configuration
   * @param {number} [maxAlerts=100] - Maximum number of alerts to retain
   */
  constructor(initialThresholds?: Partial<HealthThresholds>, maxAlerts: number = 100) {
    if (initialThresholds) {
      this.thresholds = { ...this.thresholds, ...initialThresholds };
    }
    this.maxAlerts = maxAlerts;
  }

  /**
   * Check endpoint health for degradation patterns
   *
   * @param {EndpointHealth} health - Endpoint health metrics to evaluate
   * @returns {DegradationAlert[]} Array of generated alerts (if any)
   *
   * @description
   * Evaluates endpoint health against configured thresholds and generates
   * degradation alerts when limits are exceeded. Checks failure rate,
   * response time, and timeout rate independently.
   *
   * Alert Generation Process:
   * 1. Evaluate failure rate against warning/critical thresholds
   * 2. Check p95 response time against configured limits
   * 3. Calculate and assess timeout rate
   * 4. Generate appropriate alerts based on severity
   * 5. Store alerts and emit events to listeners
   *
   * @example
   * ```typescript
   * const detector = new DegradationDetector();
   * const health: EndpointHealth = {
   *   endpoint: '/api/medications',
   *   totalRequests: 100,
   *   failedRequests: 15,
   *   failureRate: 0.15,
   *   p95ResponseTime: 4000,
   *   // ... other properties
   * };
   *
   * const alerts = detector.checkDegradation(health);
   * alerts.forEach(alert => {
   *   console.warn(`[${alert.severity}] ${alert.message}`);
   * });
   * ```
   */
  public checkDegradation(health: EndpointHealth): DegradationAlert[] {
    const alerts: DegradationAlert[] = [];
    const timestamp = Date.now();

    // Check failure rate degradation
    const failureAlerts = this.checkFailureRate(health, timestamp);
    alerts.push(...failureAlerts);

    // Check response time degradation
    const responseTimeAlerts = this.checkResponseTime(health, timestamp);
    alerts.push(...responseTimeAlerts);

    // Check timeout rate degradation
    const timeoutAlerts = this.checkTimeoutRate(health, timestamp);
    alerts.push(...timeoutAlerts);

    // Store alerts and emit events
    if (alerts.length > 0) {
      this.storeAlerts(alerts);
      this.emitDegradationEvents(health, alerts);
      
      // Update health record degradation status
      health.isDegraded = alerts.some(a => a.severity === 'critical' || a.severity === 'high');
      if (health.isDegraded) {
        health.degradationReason = alerts.map(a => a.message).join('; ');
      }
    }

    return alerts;
  }

  /**
   * Check failure rate against thresholds
   *
   * @param {EndpointHealth} health - Endpoint health metrics
   * @param {number} timestamp - Current timestamp
   * @returns {DegradationAlert[]} Failure rate alerts
   * @private
   */
  private checkFailureRate(health: EndpointHealth, timestamp: number): DegradationAlert[] {
    const alerts: DegradationAlert[] = [];

    if (health.failureRate >= this.thresholds.failureRateCritical) {
      alerts.push({
        endpoint: health.endpoint,
        type: 'highFailureRate',
        severity: 'critical',
        message: `Critical: ${(health.failureRate * 100).toFixed(1)}% failure rate (threshold: ${(this.thresholds.failureRateCritical * 100).toFixed(1)}%)`,
        timestamp,
        metrics: { 
          failureRate: health.failureRate,
          threshold: this.thresholds.failureRateCritical,
          totalRequests: health.totalRequests,
          failedRequests: health.failedRequests
        }
      });
    } else if (health.failureRate >= this.thresholds.failureRateWarning) {
      alerts.push({
        endpoint: health.endpoint,
        type: 'highFailureRate',
        severity: 'high',
        message: `Warning: ${(health.failureRate * 100).toFixed(1)}% failure rate (threshold: ${(this.thresholds.failureRateWarning * 100).toFixed(1)}%)`,
        timestamp,
        metrics: { 
          failureRate: health.failureRate,
          threshold: this.thresholds.failureRateWarning,
          totalRequests: health.totalRequests,
          failedRequests: health.failedRequests
        }
      });
    }

    return alerts;
  }

  /**
   * Check response time against thresholds
   *
   * @param {EndpointHealth} health - Endpoint health metrics
   * @param {number} timestamp - Current timestamp
   * @returns {DegradationAlert[]} Response time alerts
   * @private
   */
  private checkResponseTime(health: EndpointHealth, timestamp: number): DegradationAlert[] {
    const alerts: DegradationAlert[] = [];

    if (health.p95ResponseTime >= this.thresholds.p95ResponseTimeCritical) {
      alerts.push({
        endpoint: health.endpoint,
        type: 'slowResponse',
        severity: 'critical',
        message: `Critical: p95 response time ${health.p95ResponseTime.toFixed(0)}ms (threshold: ${this.thresholds.p95ResponseTimeCritical}ms)`,
        timestamp,
        metrics: { 
          p95ResponseTime: health.p95ResponseTime,
          threshold: this.thresholds.p95ResponseTimeCritical,
          avgResponseTime: health.avgResponseTime,
          p99ResponseTime: health.p99ResponseTime
        }
      });
    } else if (health.p95ResponseTime >= this.thresholds.p95ResponseTimeWarning) {
      alerts.push({
        endpoint: health.endpoint,
        type: 'slowResponse',
        severity: 'high',
        message: `Warning: p95 response time ${health.p95ResponseTime.toFixed(0)}ms (threshold: ${this.thresholds.p95ResponseTimeWarning}ms)`,
        timestamp,
        metrics: { 
          p95ResponseTime: health.p95ResponseTime,
          threshold: this.thresholds.p95ResponseTimeWarning,
          avgResponseTime: health.avgResponseTime,
          p99ResponseTime: health.p99ResponseTime
        }
      });
    }

    return alerts;
  }

  /**
   * Check timeout rate against thresholds
   *
   * @param {EndpointHealth} health - Endpoint health metrics
   * @param {number} timestamp - Current timestamp
   * @returns {DegradationAlert[]} Timeout rate alerts
   * @private
   */
  private checkTimeoutRate(health: EndpointHealth, timestamp: number): DegradationAlert[] {
    const alerts: DegradationAlert[] = [];
    const timeoutRate = health.totalRequests > 0 ? health.timeoutRequests / health.totalRequests : 0;

    if (timeoutRate >= this.thresholds.timeoutRateCritical) {
      alerts.push({
        endpoint: health.endpoint,
        type: 'highTimeout',
        severity: 'critical',
        message: `Critical: ${(timeoutRate * 100).toFixed(1)}% timeout rate (threshold: ${(this.thresholds.timeoutRateCritical * 100).toFixed(1)}%)`,
        timestamp,
        metrics: { 
          timeoutRate,
          threshold: this.thresholds.timeoutRateCritical,
          timeoutRequests: health.timeoutRequests,
          totalRequests: health.totalRequests
        }
      });
    } else if (timeoutRate >= this.thresholds.timeoutRateWarning) {
      alerts.push({
        endpoint: health.endpoint,
        type: 'highTimeout',
        severity: 'high',
        message: `Warning: ${(timeoutRate * 100).toFixed(1)}% timeout rate (threshold: ${(this.thresholds.timeoutRateWarning * 100).toFixed(1)}%)`,
        timestamp,
        metrics: { 
          timeoutRate,
          threshold: this.thresholds.timeoutRateWarning,
          timeoutRequests: health.timeoutRequests,
          totalRequests: health.totalRequests
        }
      });
    }

    return alerts;
  }

  /**
   * Store alerts with automatic cleanup
   *
   * @param {DegradationAlert[]} alerts - Alerts to store
   * @private
   */
  private storeAlerts(alerts: DegradationAlert[]): void {
    this.alerts.push(...alerts);

    // Keep only the most recent alerts within the limit
    if (this.alerts.length > this.maxAlerts) {
      this.alerts = this.alerts.slice(-this.maxAlerts);
    }
  }

  /**
   * Emit degradation events to registered listeners
   *
   * @param {EndpointHealth} health - Health record that generated alerts
   * @param {DegradationAlert[]} alerts - Generated alerts
   * @private
   */
  private emitDegradationEvents(health: EndpointHealth, alerts: DegradationAlert[]): void {
    alerts.forEach(alert => {
      const event: ResilienceEvent = {
        type: 'healthDegradation',
        endpoint: health.endpoint,
        details: { 
          alert,
          health: { ...health },
          timestamp: alert.timestamp
        },
        timestamp: alert.timestamp
      };

      this.emitEvent(event);
    });
  }

  /**
   * Safely emit event to all listeners
   *
   * @param {ResilienceEvent} event - Event to emit
   * @private
   */
  private emitEvent(event: ResilienceEvent): void {
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in degradation detector event listener:', error);
      }
    });
  }

  /**
   * Register event listener for degradation alerts
   *
   * @param {HealthEventListener} listener - Event listener function
   * @returns {UnsubscribeFunction} Function to unsubscribe the listener
   *
   * @description
   * Subscribe to degradation events to receive real-time notifications when
   * endpoints exceed configured thresholds. Events include detailed alert
   * information and health metrics.
   *
   * @example
   * ```typescript
   * const detector = new DegradationDetector();
   * 
   * const unsubscribe = detector.onEvent((event) => {
   *   if (event.type === 'healthDegradation') {
   *     const alert = event.details.alert as DegradationAlert;
   *     
   *     console.warn(`Degradation detected: ${event.endpoint}`);
   *     console.warn(`Alert: ${alert.message}`);
   *     
   *     // Send to monitoring system
   *     if (alert.severity === 'critical') {
   *       sendCriticalAlert(alert);
   *     }
   *   }
   * });
   * 
   * // Cleanup when done
   * unsubscribe();
   * ```
   */
  public onEvent(listener: HealthEventListener): UnsubscribeFunction {
    this.eventListeners.add(listener);
    return () => this.eventListeners.delete(listener);
  }

  /**
   * Update degradation detection thresholds
   *
   * @param {Partial<HealthThresholds>} newThresholds - New threshold values
   * @returns {void}
   *
   * @description
   * Updates the thresholds used for degradation detection. Only provided
   * values are updated; omitted thresholds retain their current values.
   * Emits threshold update event to notify listeners.
   */
  public updateThresholds(newThresholds: Partial<HealthThresholds>): void {
    const oldThresholds = { ...this.thresholds };
    this.thresholds = { ...this.thresholds, ...newThresholds };

    // Emit threshold update event
    const event: ResilienceEvent = {
      type: 'healthDegradation', // Using existing type for compatibility
      endpoint: 'system',
      details: {
        oldThresholds,
        newThresholds: this.thresholds,
        changes: newThresholds
      },
      timestamp: Date.now()
    };

    this.emitEvent(event);
  }

  /**
   * Get current degradation thresholds
   *
   * @returns {HealthThresholds} Current threshold configuration
   */
  public getThresholds(): HealthThresholds {
    return { ...this.thresholds };
  }

  /**
   * Get recent degradation alerts
   *
   * @param {number} [limit=10] - Maximum number of alerts to return
   * @returns {DegradationAlert[]} Recent alerts (most recent last)
   *
   * @description
   * Returns the most recent degradation alerts. Useful for dashboards,
   * debugging, and alert history analysis.
   */
  public getRecentAlerts(limit: number = 10): DegradationAlert[] {
    return this.alerts.slice(-limit);
  }

  /**
   * Get alerts for a specific endpoint
   *
   * @param {string} endpoint - Endpoint to filter alerts for
   * @param {number} [limit=10] - Maximum number of alerts to return
   * @returns {DegradationAlert[]} Endpoint-specific alerts (most recent last)
   */
  public getAlertsForEndpoint(endpoint: string, limit: number = 10): DegradationAlert[] {
    return this.alerts
      .filter(alert => alert.endpoint === endpoint)
      .slice(-limit);
  }

  /**
   * Get alerts by severity level
   *
   * @param {AlertSeverity} severity - Severity level to filter by
   * @param {number} [limit=10] - Maximum number of alerts to return
   * @returns {DegradationAlert[]} Alerts matching severity (most recent last)
   */
  public getAlertsBySeverity(severity: AlertSeverity, limit: number = 10): DegradationAlert[] {
    return this.alerts
      .filter(alert => alert.severity === severity)
      .slice(-limit);
  }

  /**
   * Get alerts by type
   *
   * @param {DegradationType} type - Alert type to filter by
   * @param {number} [limit=10] - Maximum number of alerts to return
   * @returns {DegradationAlert[]} Alerts matching type (most recent last)
   */
  public getAlertsByType(type: DegradationType, limit: number = 10): DegradationAlert[] {
    return this.alerts
      .filter(alert => alert.type === type)
      .slice(-limit);
  }

  /**
   * Clear all stored alerts
   *
   * @returns {void}
   *
   * @description
   * Removes all stored alerts from memory. Use with caution in production
   * as this removes the alert history. Primarily useful for testing or
   * after resolving systematic issues.
   */
  public clearAlerts(): void {
    this.alerts = [];
  }

  /**
   * Get alert statistics
   *
   * @returns {object} Alert statistics summary
   *
   * @description
   * Returns comprehensive statistics about alerts including counts by
   * severity, type, and time-based analysis.
   */
  public getAlertStats(): {
    total: number;
    bySeverity: Record<AlertSeverity, number>;
    byType: Record<DegradationType, number>;
    last24Hours: number;
    lastHour: number;
  } {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;

    const bySeverity: Record<AlertSeverity, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };

    const byType: Record<DegradationType, number> = {
      highFailureRate: 0,
      slowResponse: 0,
      highTimeout: 0
    };

    let last24Hours = 0;
    let lastHour = 0;

    this.alerts.forEach(alert => {
      bySeverity[alert.severity]++;
      byType[alert.type]++;

      if (alert.timestamp > now - oneDay) {
        last24Hours++;
      }
      if (alert.timestamp > now - oneHour) {
        lastHour++;
      }
    });

    return {
      total: this.alerts.length,
      bySeverity,
      byType,
      last24Hours,
      lastHour
    };
  }

  /**
   * Check if endpoint currently has active alerts
   *
   * @param {string} endpoint - Endpoint to check
   * @param {number} [timeWindowMs=300000] - Time window to check (default: 5 minutes)
   * @returns {boolean} True if endpoint has recent alerts
   */
  public hasActiveAlerts(endpoint: string, timeWindowMs: number = 300000): boolean {
    const cutoff = Date.now() - timeWindowMs;
    return this.alerts.some(alert => 
      alert.endpoint === endpoint && 
      alert.timestamp > cutoff &&
      (alert.severity === 'critical' || alert.severity === 'high')
    );
  }

  /**
   * Get endpoints with active critical alerts
   *
   * @param {number} [timeWindowMs=600000] - Time window to check (default: 10 minutes)
   * @returns {string[]} Array of endpoints with critical alerts
   */
  public getCriticalEndpoints(timeWindowMs: number = 600000): string[] {
    const cutoff = Date.now() - timeWindowMs;
    const criticalEndpoints = new Set<string>();

    this.alerts
      .filter(alert => alert.timestamp > cutoff && alert.severity === 'critical')
      .forEach(alert => criticalEndpoints.add(alert.endpoint));

    return Array.from(criticalEndpoints);
  }
}

/**
 * Create shared degradation detector instance
 */
export const degradationDetector = new DegradationDetector();
