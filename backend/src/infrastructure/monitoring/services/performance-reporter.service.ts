/**
 * @fileoverview Performance Reporter Service
 * @module infrastructure/monitoring/services
 * @description Service for generating performance reports and checking targets
 */

import { Injectable, Logger } from '@nestjs/common';
import {
  PerformanceReport,
  PerformanceAlert,
  QueryMetrics,
  SlowQuery,
  N1QueryDetection,
} from '../types/query-monitor.types';
import { QueryAnalyzerService } from './query-analyzer.service';
import { SlowQueryDetectorService } from './slow-query-detector.service';
import { N1QueryDetectorService } from './n1-query-detector.service';

import { BaseService } from '@/common/base';
@Injectable()
export class PerformanceReporterService extends BaseService {
  // Performance targets
  private readonly PERFORMANCE_TARGETS = {
    p50: 100, // ms
    p95: 500, // ms
    p99: 1000, // ms
  };

  // Storage
  private alerts: PerformanceAlert[] = [];

  constructor(
    private readonly queryAnalyzer: QueryAnalyzerService,
    private readonly slowQueryDetector: SlowQueryDetectorService,
    private readonly n1Detector: N1QueryDetectorService,
  ) {}

  /**
   * Generate comprehensive performance report
   */
  getPerformanceReport(): PerformanceReport {
    const allDurations = this.queryAnalyzer
      .getRecentExecutions()
      .map(exec => exec.duration)
      .sort((a, b) => a - b);

    const p50 = this.calculatePercentile(allDurations, 50);
    const p95 = this.calculatePercentile(allDurations, 95);
    const p99 = this.calculatePercentile(allDurations, 99);

    const avgDuration =
      allDurations.length > 0
        ? allDurations.reduce((sum, d) => sum + d, 0) / allDurations.length
        : 0;

    // Get top slow queries
    const topSlowQueries = this.slowQueryDetector.getTopSlowQueries(10);

    // Get top frequent queries
    const topFrequentQueries = this.queryAnalyzer.getTopFrequentQueries(10);

    // Check performance targets and create alerts
    this.checkPerformanceTargets(p50, p95, p99);

    return {
      totalQueries: this.queryAnalyzer.getTotalQueries(),
      slowQueries: this.slowQueryDetector.getSlowQueryCount(),
      avgQueryTime: avgDuration,
      p50QueryTime: p50,
      p95QueryTime: p95,
      p99QueryTime: p99,
      queryDistribution: this.queryAnalyzer.getQueryDistribution(),
      topSlowQueries,
      topFrequentQueries,
      n1Detections: this.n1Detector.getN1Detections(10),
      alerts: this.getRecentAlerts(20),
      periodStart: this.queryAnalyzer.getRecentExecutions(1)[0]?.timestamp || new Date(),
      periodEnd: new Date(),
    };
  }

  /**
   * Generate periodic performance report and log summary
   */
  generatePeriodicReport(): void {
    const report = this.getPerformanceReport();

    // Log summary
    this.logInfo('Query Performance Summary:', {
      totalQueries: report.totalQueries,
      slowQueries: report.slowQueries,
      avgQueryTime: `${report.avgQueryTime.toFixed(2)}ms`,
      p50: `${report.p50QueryTime.toFixed(2)}ms`,
      p95: `${report.p95QueryTime.toFixed(2)}ms`,
      p99: `${report.p99QueryTime.toFixed(2)}ms`,
    });

    // Check for critical issues
    this.checkForCriticalIssues(report);
  }

  /**
   * Check if performance targets are met
   */
  private checkPerformanceTargets(p50: number, p95: number, p99: number): void {
    const targets = this.PERFORMANCE_TARGETS;

    if (p50 > targets.p50) {
      this.createAlert({
        type: 'performance_degradation',
        severity: 'warning',
        message: `P50 query time ${p50.toFixed(2)}ms exceeds target of ${targets.p50}ms`,
        details: { current: p50, target: targets.p50 },
        timestamp: new Date(),
      });
    }

    if (p95 > targets.p95) {
      this.createAlert({
        type: 'performance_degradation',
        severity: 'warning',
        message: `P95 query time ${p95.toFixed(2)}ms exceeds target of ${targets.p95}ms`,
        details: { current: p95, target: targets.p95 },
        timestamp: new Date(),
      });
    }

    if (p99 > targets.p99) {
      this.createAlert({
        type: 'performance_degradation',
        severity: 'critical',
        message: `P99 query time ${p99.toFixed(2)}ms exceeds target of ${targets.p99}ms`,
        details: { current: p99, target: targets.p99 },
        timestamp: new Date(),
      });
    }
  }

  /**
   * Check for critical performance issues
   */
  private checkForCriticalIssues(report: PerformanceReport): void {
    // Check for high query rate
    if (report.totalQueries > 10000) {
      this.createAlert({
        type: 'high_query_rate',
        severity: 'warning',
        message: `High query rate detected: ${report.totalQueries} queries`,
        details: { queryCount: report.totalQueries },
        timestamp: new Date(),
      });
    }

    // Check for excessive slow queries
    if (report.slowQueries > report.totalQueries * 0.1) {
      this.createAlert({
        type: 'performance_degradation',
        severity: 'critical',
        message: `Excessive slow queries: ${report.slowQueries} out of ${report.totalQueries}`,
        details: {
          slowQueryCount: report.slowQueries,
          totalQueries: report.totalQueries,
          percentage: (report.slowQueries / report.totalQueries) * 100,
        },
        timestamp: new Date(),
      });
    }
  }

  /**
   * Create performance alert
   */
  private createAlert(alert: PerformanceAlert): void {
    this.alerts.push(alert);

    // Trim alert history
    if (this.alerts.length > 100) {
      this.alerts.shift();
    }
  }

  /**
   * Calculate percentile from sorted array
   */
  private calculatePercentile(sortedArray: number[], percentile: number): number {
    if (sortedArray.length === 0) return 0;

    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[Math.max(0, index)];
  }

  /**
   * Get recent alerts
   */
  getRecentAlerts(limit: number = 20): PerformanceAlert[] {
    return [...this.alerts].slice(-limit);
  }

  /**
   * Get all alerts
   */
  getAllAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  /**
   * Get alerts by type
   */
  getAlertsByType(type: PerformanceAlert['type']): PerformanceAlert[] {
    return this.alerts.filter(alert => alert.type === type);
  }

  /**
   * Get alerts by severity
   */
  getAlertsBySeverity(severity: PerformanceAlert['severity']): PerformanceAlert[] {
    return this.alerts.filter(alert => alert.severity === severity);
  }

  /**
   * Get critical alerts count
   */
  getCriticalAlertsCount(): number {
    return this.alerts.filter(alert => alert.severity === 'critical').length;
  }

  /**
   * Get performance health score (0-100)
   */
  getPerformanceHealthScore(): number {
    const report = this.getPerformanceReport();
    let score = 100;

    // Deduct points for performance issues
    if (report.p99QueryTime > this.PERFORMANCE_TARGETS.p99) {
      score -= 30;
    } else if (report.p95QueryTime > this.PERFORMANCE_TARGETS.p95) {
      score -= 20;
    } else if (report.p50QueryTime > this.PERFORMANCE_TARGETS.p50) {
      score -= 10;
    }

    // Deduct points for slow queries
    const slowQueryPercentage = report.totalQueries > 0 ? report.slowQueries / report.totalQueries : 0;
    if (slowQueryPercentage > 0.1) {
      score -= 20;
    } else if (slowQueryPercentage > 0.05) {
      score -= 10;
    }

    // Deduct points for N+1 detections
    if (this.n1Detector.hasActiveN1Patterns()) {
      score -= 15;
    }

    return Math.max(0, score);
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const report = this.getPerformanceReport();
    const healthScore = this.getPerformanceHealthScore();

    return {
      healthScore,
      totalQueries: report.totalQueries,
      slowQueries: report.slowQueries,
      n1Detections: this.n1Detector.getN1DetectionCount(),
      criticalAlerts: this.getCriticalAlertsCount(),
      p50: report.p50QueryTime,
      p95: report.p95QueryTime,
      p99: report.p99QueryTime,
      targets: this.PERFORMANCE_TARGETS,
    };
  }

  /**
   * Reset reporter data
   */
  reset(): void {
    this.alerts = [];
    this.logInfo('Performance reporter reset');
  }
}
