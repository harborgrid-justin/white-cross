/**
 * Performance Monitoring Infrastructure
 *
 * Provides comprehensive performance monitoring, metrics collection, and APM integration
 * for the White Cross healthcare platform with healthcare-specific metrics and alerting.
 */

import { Injectable, Logger } from '@nestjs/common';

/**
 * Metric types for healthcare platform
 */
export enum MetricType {
  COUNTER = 'counter',
  GAUGE = 'gauge',
  HISTOGRAM = 'histogram',
  SUMMARY = 'summary'
}

/**
 * Healthcare-specific metric definitions
 */
export enum HealthcareMetrics {
  // Request metrics
  HTTP_REQUEST_DURATION = 'http_request_duration_seconds',
  HTTP_REQUEST_TOTAL = 'http_request_total',
  HTTP_REQUEST_ERRORS = 'http_request_errors_total',

  // Database metrics
  DB_QUERY_DURATION = 'db_query_duration_seconds',
  DB_CONNECTION_POOL_SIZE = 'db_connection_pool_size',
  DB_CONNECTION_ACTIVE = 'db_connection_active',

  // Business metrics
  PATIENT_RECORDS_ACCESSED = 'patient_records_accessed_total',
  MEDICATIONS_ADMINISTERED = 'medications_administered_total',
  APPOINTMENTS_SCHEDULED = 'appointments_scheduled_total',
  INCIDENTS_REPORTED = 'incidents_reported_total',

  // Performance metrics
  MEMORY_USAGE_BYTES = 'memory_usage_bytes',
  CPU_USAGE_PERCENT = 'cpu_usage_percent',
  RESPONSE_TIME_P50 = 'response_time_p50',
  RESPONSE_TIME_P95 = 'response_time_p95',
  RESPONSE_TIME_P99 = 'response_time_p99',

  // Security metrics
  AUTH_ATTEMPTS_TOTAL = 'auth_attempts_total',
  AUTH_FAILURES_TOTAL = 'auth_failures_total',
  PHI_ACCESS_TOTAL = 'phi_access_total',
  AUDIT_EVENTS_TOTAL = 'audit_events_total'
}

/**
 * Metric data structure
 */
export interface MetricData {
  name: string;
  type: MetricType;
  value: number;
  labels: Record<string, string>;
  timestamp: Date;
  description?: string;
}

/**
 * Alert configuration
 */
export interface AlertConfig {
  metric: string;
  condition: 'gt' | 'lt' | 'eq' | 'ne';
  threshold: number;
  duration: number; // seconds
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  labels?: Record<string, string>;
}

/**
 * APM provider interface
 */
export interface IAPMetricsProvider {
  recordMetric(metric: MetricData): Promise<void>;
  recordHistogram(name: string, value: number, labels?: Record<string, string>): Promise<void>;
  recordCounter(name: string, value?: number, labels?: Record<string, string>): Promise<void>;
  recordGauge(name: string, value: number, labels?: Record<string, string>): Promise<void>;
  incrementCounter(name: string, labels?: Record<string, string>): Promise<void>;
  decrementGauge(name: string, labels?: Record<string, string>): Promise<void>;
  startTimer(name: string, labels?: Record<string, string>): () => Promise<void>;
}

/**
 * Prometheus metrics provider
 */
@Injectable()
export class PrometheusMetricsProvider implements IAPMetricsProvider {
  private metrics: Map<string, MetricData[]> = new Map();

  async recordMetric(metric: MetricData): Promise<void> {
    const existing = this.metrics.get(metric.name) || [];
    existing.push(metric);

    // Keep only recent metrics (last 1000 per metric)
    if (existing.length > 1000) {
      existing.shift();
    }

    this.metrics.set(metric.name, existing);
  }

  async recordHistogram(name: string, value: number, labels: Record<string, string> = {}): Promise<void> {
    await this.recordMetric({
      name,
      type: MetricType.HISTOGRAM,
      value,
      labels,
      timestamp: new Date(),
      description: `Histogram for ${name}`
    });
  }

  async recordCounter(name: string, value: number = 1, labels: Record<string, string> = {}): Promise<void> {
    await this.recordMetric({
      name,
      type: MetricType.COUNTER,
      value,
      labels,
      timestamp: new Date(),
      description: `Counter for ${name}`
    });
  }

  async recordGauge(name: string, value: number, labels: Record<string, string> = {}): Promise<void> {
    await this.recordMetric({
      name,
      type: MetricType.GAUGE,
      value,
      labels,
      timestamp: new Date(),
      description: `Gauge for ${name}`
    });
  }

  async incrementCounter(name: string, labels: Record<string, string> = {}): Promise<void> {
    await this.recordCounter(name, 1, labels);
  }

  async decrementGauge(name: string, labels: Record<string, string> = {}): Promise<void> {
    await this.recordGauge(name, -1, labels);
  }

  startTimer(name: string, labels: Record<string, string> = {}): () => Promise<void> {
    const startTime = Date.now();
    return async () => {
      const duration = (Date.now() - startTime) / 1000; // Convert to seconds
      await this.recordHistogram(`${name}_duration_seconds`, duration, labels);
    };
  }

  /**
   * Get metrics in Prometheus format
   */
  getPrometheusMetrics(): string {
    let output = '';

    for (const [metricName, metrics] of this.metrics.entries()) {
      if (metrics.length === 0) continue;

      const latestMetric = metrics[metrics.length - 1];
      output += `# HELP ${metricName} ${latestMetric.description || 'Metric for ' + metricName}\n`;
      output += `# TYPE ${metricName} ${latestMetric.type}\n`;

      const labels = Object.entries(latestMetric.labels)
        .map(([key, value]) => `${key}="${value}"`)
        .join(',');

      output += `${metricName}${labels ? `{${labels}}` : ''} ${latestMetric.value}\n\n`;
    }

    return output;
  }
}

/**
 * DataDog APM provider
 */
@Injectable()
export class DataDogMetricsProvider implements IAPMetricsProvider {
  constructor(private readonly apiKey?: string) {}

  async recordMetric(metric: MetricData): Promise<void> {
    // In a real implementation, this would send to DataDog API
    console.log(`[DataDog] Recording metric: ${metric.name} = ${metric.value}`);
  }

  async recordHistogram(name: string, value: number, labels: Record<string, string> = {}): Promise<void> {
    await this.recordMetric({
      name,
      type: MetricType.HISTOGRAM,
      value,
      labels,
      timestamp: new Date()
    });
  }

  async recordCounter(name: string, value: number = 1, labels: Record<string, string> = {}): Promise<void> {
    await this.recordMetric({
      name,
      type: MetricType.COUNTER,
      value,
      labels,
      timestamp: new Date()
    });
  }

  async recordGauge(name: string, value: number, labels: Record<string, string> = {}): Promise<void> {
    await this.recordMetric({
      name,
      type: MetricType.GAUGE,
      value,
      labels,
      timestamp: new Date()
    });
  }

  async incrementCounter(name: string, labels: Record<string, string> = {}): Promise<void> {
    await this.recordCounter(name, 1, labels);
  }

  async decrementGauge(name: string, labels: Record<string, string> = {}): Promise<void> {
    await this.recordGauge(name, -1, labels);
  }

  startTimer(name: string, labels: Record<string, string> = {}): () => Promise<void> {
    const startTime = Date.now();
    return async () => {
      const duration = (Date.now() - startTime) / 1000;
      await this.recordHistogram(`${name}_duration`, duration, labels);
    };
  }
}