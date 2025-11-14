/**
 * @fileoverview Query Monitor Service
 * @module infrastructure/monitoring
 * @description Main service orchestrating all query performance monitoring
 */

import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import {
  PerformanceReport,
  QueryMetrics,
  SlowQuery,
  N1QueryDetection,
  PerformanceAlert,
} from './types/query-monitor.types';
import { QueryAnalyzerService } from '@/infrastructure/monitoring/services/query-analyzer.service';
import { SlowQueryDetectorService } from '@/infrastructure/monitoring/services/slow-query-detector.service';
import { N1QueryDetectorService } from '@/infrastructure/monitoring/services/n1-query-detector.service';
import { PerformanceReporterService } from '@/infrastructure/monitoring/services/performance-reporter.service';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';

@Injectable()
export class QueryMonitorService extends BaseService implements OnModuleInit, OnModuleDestroy {
  // Monitoring state
  private isMonitoring = false;
  private reportInterval: NodeJS.Timeout | null = null;

  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly queryAnalyzer: QueryAnalyzerService,
    private readonly slowQueryDetector: SlowQueryDetectorService,
    private readonly n1Detector: N1QueryDetectorService,
    private readonly performanceReporter: PerformanceReporterService,
  ) {
    super("QueryMonitorService");
  }

  async onModuleInit(): Promise<void> {
    this.logInfo('Initializing Query Monitor Service');
    this.startMonitoring();
  }

  /**
   * Start query performance monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) {
      this.logWarning('Query monitoring already started');
      return;
    }

    this.isMonitoring = true;

    // Hook into Sequelize query lifecycle
    this.sequelize.addHook('beforeQuery', (options: unknown, query: unknown) => {
      (query as any).startTime = Date.now();
      (query as any).model = (options as any).model?.name;
    });

    this.sequelize.addHook('afterQuery', (options: unknown, query: unknown) => {
      const duration = Date.now() - (query as any).startTime;
      this.recordQuery((options as any).sql, duration, (query as any).model);
    });

    // Start periodic reporting
    this.reportInterval = setInterval(() => {
      this.performanceReporter.generatePeriodicReport();
    }, 60000); // Every minute

    this.logInfo('Query performance monitoring started');
  }

  /**
   * Record query execution and analyze performance
   */
  private recordQuery(sql: string, duration: number, model?: string): void {
    // Record in analyzer
    this.queryAnalyzer.recordQuery(sql, duration, model);

    // Check for slow queries
    this.slowQueryDetector.checkAndRecordSlowQuery(sql, duration, model);

    // Analyze for N+1 patterns
    this.n1Detector.analyzeForN1Queries(this.queryAnalyzer.getRecentExecutions(100), model);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;

    if (this.reportInterval) {
      clearInterval(this.reportInterval);
      this.reportInterval = null;
    }

    this.logInfo('Query performance monitoring stopped');
  }

  /**
   * Cleanup on module destroy
   */
  async onModuleDestroy(): Promise<void> {
    this.stopMonitoring();
  }

  // Public API methods

  /**
   * Get comprehensive performance report
   */
  getPerformanceReport(): PerformanceReport {
    return this.performanceReporter.getPerformanceReport();
  }

  /**
   * Get metrics for specific query pattern
   */
  getQueryMetrics(signature: string): QueryMetrics | undefined {
    return this.queryAnalyzer.getQueryMetrics(signature);
  }

  /**
   * Get all slow queries
   */
  getSlowQueries(limit: number = 20): SlowQuery[] {
    return this.slowQueryDetector.getSlowQueries(limit);
  }

  /**
   * Get N+1 query detections
   */
  getN1Detections(limit: number = 10): N1QueryDetection[] {
    return this.n1Detector.getN1Detections(limit);
  }

  /**
   * Get recent alerts
   */
  getAlerts(limit: number = 20): PerformanceAlert[] {
    return this.performanceReporter.getRecentAlerts(limit);
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    return this.performanceReporter.getPerformanceSummary();
  }

  /**
   * Get performance health score
   */
  getPerformanceHealthScore(): number {
    return this.performanceReporter.getPerformanceHealthScore();
  }

  /**
   * Reset all metrics and statistics
   */
  resetMetrics(): void {
    this.queryAnalyzer.resetMetrics();
    this.slowQueryDetector.reset();
    this.n1Detector.reset();
    this.performanceReporter.reset();
    this.logInfo('Query monitor metrics reset');
  }

  /**
   * Check if monitoring is active
   */
  isMonitoringActive(): boolean {
    return this.isMonitoring;
  }
}
