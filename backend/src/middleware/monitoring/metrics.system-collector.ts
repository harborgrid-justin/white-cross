/**
 * LOC: WC-MID-METRICS-SYSCOL-001
 * System metrics collector
 *
 * Collects system-level metrics including CPU usage, memory utilization,
 * and event loop lag for performance monitoring and alerting.
 */

import * as os from 'os';
import {
  MetricData,
  MetricType,
  HealthcareMetricCategory,
} from './metrics.types';

/**
 * System metrics collector
 *
 * Monitors system resources and generates metrics for CPU, memory,
 * and event loop performance. Supports threshold-based alerting.
 */
export class SystemMetricsCollector {
  private memoryThreshold: number;
  private cpuThreshold: number;
  private lastCpuUsage: NodeJS.CpuUsage;

  constructor(memoryThreshold: number, cpuThreshold: number) {
    this.memoryThreshold = memoryThreshold;
    this.cpuThreshold = cpuThreshold;
    this.lastCpuUsage = process.cpuUsage();
  }

  /**
   * Collect all system metrics
   *
   * Gathers comprehensive system resource usage metrics including
   * memory (heap and total), CPU utilization, and event loop lag.
   *
   * @param tags - Base tags to apply to all metrics
   * @returns Array of collected system metrics
   */
  public collectSystemMetrics(tags: Record<string, string>): MetricData[] {
    const metrics: MetricData[] = [];
    const now = new Date();

    // Memory metrics
    const memUsage = process.memoryUsage();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUtilization = usedMemory / totalMemory;

    metrics.push({
      name: 'system.memory.heap_used',
      type: MetricType.GAUGE,
      category: HealthcareMetricCategory.PERFORMANCE,
      value: memUsage.heapUsed,
      timestamp: now,
      tags: { ...tags, unit: 'bytes' },
      unit: 'bytes',
    });

    metrics.push({
      name: 'system.memory.heap_total',
      type: MetricType.GAUGE,
      category: HealthcareMetricCategory.PERFORMANCE,
      value: memUsage.heapTotal,
      timestamp: now,
      tags: { ...tags, unit: 'bytes' },
      unit: 'bytes',
    });

    metrics.push({
      name: 'system.memory.external',
      type: MetricType.GAUGE,
      category: HealthcareMetricCategory.PERFORMANCE,
      value: memUsage.external,
      timestamp: now,
      tags: { ...tags, unit: 'bytes' },
      unit: 'bytes',
    });

    metrics.push({
      name: 'system.memory.rss',
      type: MetricType.GAUGE,
      category: HealthcareMetricCategory.PERFORMANCE,
      value: memUsage.rss,
      timestamp: now,
      tags: { ...tags, unit: 'bytes' },
      unit: 'bytes',
    });

    metrics.push({
      name: 'system.memory.utilization',
      type: MetricType.GAUGE,
      category: HealthcareMetricCategory.PERFORMANCE,
      value: memoryUtilization,
      timestamp: now,
      tags: { ...tags, unit: 'percent' },
      unit: 'percent',
    });

    // CPU metrics
    const currentCpuUsage = process.cpuUsage(this.lastCpuUsage);
    const totalCpuTime = currentCpuUsage.user + currentCpuUsage.system;
    const cpuUtilization = totalCpuTime / 1000000; // Convert to seconds
    this.lastCpuUsage = process.cpuUsage();

    metrics.push({
      name: 'system.cpu.user',
      type: MetricType.GAUGE,
      category: HealthcareMetricCategory.PERFORMANCE,
      value: currentCpuUsage.user / 1000000,
      timestamp: now,
      tags: { ...tags, unit: 'seconds' },
      unit: 'seconds',
    });

    metrics.push({
      name: 'system.cpu.system',
      type: MetricType.GAUGE,
      category: HealthcareMetricCategory.PERFORMANCE,
      value: currentCpuUsage.system / 1000000,
      timestamp: now,
      tags: { ...tags, unit: 'seconds' },
      unit: 'seconds',
    });

    metrics.push({
      name: 'system.cpu.utilization',
      type: MetricType.GAUGE,
      category: HealthcareMetricCategory.PERFORMANCE,
      value: cpuUtilization,
      timestamp: now,
      tags: { ...tags, unit: 'seconds' },
      unit: 'seconds',
    });

    // Event loop lag (approximate using hrtime)
    const hrTime = process.hrtime();
    const eventLoopLag = hrTime[0] * 1000 + hrTime[1] / 1000000;

    metrics.push({
      name: 'system.event_loop.lag',
      type: MetricType.GAUGE,
      category: HealthcareMetricCategory.PERFORMANCE,
      value: eventLoopLag,
      timestamp: now,
      tags: { ...tags, unit: 'ms' },
      unit: 'ms',
    });

    // System load average (Unix-like systems only)
    const loadAvg = os.loadavg();
    metrics.push({
      name: 'system.load_average.1min',
      type: MetricType.GAUGE,
      category: HealthcareMetricCategory.PERFORMANCE,
      value: loadAvg[0],
      timestamp: now,
      tags,
    });

    metrics.push({
      name: 'system.load_average.5min',
      type: MetricType.GAUGE,
      category: HealthcareMetricCategory.PERFORMANCE,
      value: loadAvg[1],
      timestamp: now,
      tags,
    });

    metrics.push({
      name: 'system.load_average.15min',
      type: MetricType.GAUGE,
      category: HealthcareMetricCategory.PERFORMANCE,
      value: loadAvg[2],
      timestamp: now,
      tags,
    });

    return metrics;
  }

  /**
   * Check if system resource usage exceeds configured thresholds
   *
   * Evaluates memory and CPU utilization against configured thresholds
   * and returns alert messages for any violations.
   *
   * @param memoryUtilization - Current memory utilization (0-1 scale)
   * @param cpuUtilization - Current CPU utilization (0-1 scale)
   * @returns Array of alert messages for threshold violations
   */
  public checkThresholds(
    memoryUtilization: number,
    cpuUtilization: number,
  ): string[] {
    const alerts: string[] = [];

    if (memoryUtilization > this.memoryThreshold) {
      alerts.push(
        `Memory utilization ${(memoryUtilization * 100).toFixed(2)}% exceeds threshold ${(this.memoryThreshold * 100).toFixed(2)}%`,
      );
    }

    if (cpuUtilization > this.cpuThreshold) {
      alerts.push(
        `CPU utilization ${(cpuUtilization * 100).toFixed(2)}% exceeds threshold ${(this.cpuThreshold * 100).toFixed(2)}%`,
      );
    }

    return alerts;
  }
}
