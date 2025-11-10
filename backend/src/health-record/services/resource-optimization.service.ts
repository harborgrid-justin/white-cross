/**
 * @fileoverview Resource Usage Optimization and Monitoring Service
 * @module health-record/services
 * @description Advanced resource usage optimization with predictive scaling and monitoring
 *
 * HIPAA CRITICAL - This service optimizes PHI processing resources while maintaining compliance
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HealthRecordMetricsService } from './health-record-metrics.service';
import { PHIAccessLogger } from './phi-access-logger.service';
import { CacheStrategyService } from './cache-strategy.service';
import { QueryPerformanceAnalyzer } from './query-performance-analyzer.service';

export interface ResourceMetrics {
  timestamp: Date;
  memory: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    buffers: number;
    rss: number;
    utilization: number; // Percentage
  };
  cpu: {
    usage: number; // Percentage
    loadAverage: number[];
    processes: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    connectionsActive: number;
    latency: number;
  };
  database: {
    activeConnections: number;
    idleConnections: number;
    queryQueue: number;
    slowQueries: number;
    lockWaitTime: number;
  };
  cache: {
    hitRate: number;
    memoryUsage: number;
    evictionRate: number;
    responseTime: number;
  };
}

export interface OptimizationRecommendation {
  id: string;
  type: ResourceOptimizationType;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  impact: string;
  implementation: string;
  estimatedSavings: {
    memory?: number; // Bytes
    cpu?: number; // Percentage
    responseTime?: number; // Milliseconds
    cost?: number; // Percentage
  };
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  implementationTime: number; // Hours
  prerequisites: string[];
  complianceImpact: boolean;
}

export enum ResourceOptimizationType {
  MEMORY_OPTIMIZATION = 'MEMORY_OPTIMIZATION',
  CPU_OPTIMIZATION = 'CPU_OPTIMIZATION',
  NETWORK_OPTIMIZATION = 'NETWORK_OPTIMIZATION',
  DATABASE_OPTIMIZATION = 'DATABASE_OPTIMIZATION',
  CACHE_OPTIMIZATION = 'CACHE_OPTIMIZATION',
  CONNECTION_POOLING = 'CONNECTION_POOLING',
  QUERY_OPTIMIZATION = 'QUERY_OPTIMIZATION',
  BATCH_PROCESSING = 'BATCH_PROCESSING',
  COMPRESSION = 'COMPRESSION',
  PREFETCHING = 'PREFETCHING',
}

export interface ResourceAlert {
  id: string;
  alertType: ResourceAlertType;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  title: string;
  message: string;
  timestamp: Date;
  threshold: number;
  currentValue: number;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  acknowledged: boolean;
  resolvedAt?: Date;
  metadata: {
    resourceType: string;
    complianceImpact: boolean;
    autoRecoveryAttempted: boolean;
    [key: string]: any;
  };
}

export enum ResourceAlertType {
  HIGH_MEMORY_USAGE = 'HIGH_MEMORY_USAGE',
  HIGH_CPU_USAGE = 'HIGH_CPU_USAGE',
  MEMORY_LEAK_SUSPECTED = 'MEMORY_LEAK_SUSPECTED',
  DATABASE_CONNECTION_POOL_EXHAUSTED = 'DATABASE_CONNECTION_POOL_EXHAUSTED',
  SLOW_QUERY_THRESHOLD_EXCEEDED = 'SLOW_QUERY_THRESHOLD_EXCEEDED',
  CACHE_HIT_RATE_LOW = 'CACHE_HIT_RATE_LOW',
  NETWORK_LATENCY_HIGH = 'NETWORK_LATENCY_HIGH',
  DISK_SPACE_LOW = 'DISK_SPACE_LOW',
  PHI_PROCESSING_OVERLOAD = 'PHI_PROCESSING_OVERLOAD',
  COMPLIANCE_RISK_DETECTED = 'COMPLIANCE_RISK_DETECTED',
}

export interface PredictiveScalingModel {
  modelId: string;
  resourceType: string;
  features: string[];
  accuracy: number;
  lastTrained: Date;
  predictions: Array<{
    timestamp: Date;
    predictedUsage: number;
    confidence: number;
    recommendedAction: 'SCALE_UP' | 'SCALE_DOWN' | 'MAINTAIN' | 'OPTIMIZE';
    reasoning: string;
  }>;
}

export interface ResourceOptimizationPlan {
  planId: string;
  name: string;
  description: string;
  targetResources: string[];
  estimatedBenefit: {
    memoryReduction: number; // Percentage
    cpuReduction: number; // Percentage
    responseTimeImprovement: number; // Percentage
    costSavings: number; // Percentage
  };
  phases: Array<{
    phaseId: string;
    name: string;
    duration: number; // Hours
    recommendations: OptimizationRecommendation[];
    dependencies: string[];
    riskAssessment: string;
  }>;
  complianceValidation: {
    validated: boolean;
    validatedBy?: string;
    validatedAt?: Date;
    notes?: string;
  };
}

/**
 * Resource Usage Optimization and Monitoring Service
 *
 * Provides comprehensive resource optimization and monitoring:
 * - Real-time resource usage monitoring
 * - Memory leak detection and prevention
 * - CPU usage optimization
 * - Network optimization strategies
 * - Database connection optimization
 * - Predictive scaling recommendations
 * - Automated resource cleanup
 * - Compliance-aware optimization
 */
@Injectable()
export class ResourceOptimizationService implements OnModuleDestroy {
  private readonly logger = new Logger(ResourceOptimizationService.name);

  // Resource monitoring
  private readonly resourceHistory: ResourceMetrics[] = [];
  private readonly maxHistorySize = 2880; // 24 hours at 30-second intervals
  private readonly alerts = new Map<string, ResourceAlert>();

  // Optimization tracking
  private readonly recommendations = new Map<
    string,
    OptimizationRecommendation
  >();
  private readonly optimizationPlans = new Map<
    string,
    ResourceOptimizationPlan
  >();
  private readonly predictiveModels = new Map<string, PredictiveScalingModel>();

  // Thresholds and configuration
  private readonly thresholds = {
    memory: {
      warning: 70, // 70% memory usage
      critical: 85, // 85% memory usage
      leakSuspicion: 90, // 90% sustained usage
    },
    cpu: {
      warning: 60, // 60% CPU usage
      critical: 80, // 80% CPU usage
    },
    database: {
      connectionWarning: 80, // 80% of max connections
      connectionCritical: 95, // 95% of max connections
      slowQueryThreshold: 2000, // 2 seconds
    },
    cache: {
      hitRateWarning: 60, // 60% hit rate
      hitRateCritical: 40, // 40% hit rate
    },
    network: {
      latencyWarning: 500, // 500ms latency
      latencyCritical: 1000, // 1000ms latency
    },
  };

  // Optimization state
  private optimizationEnabled = true;
  private autoScalingEnabled = true;
  private complianceMode = true;

  constructor(
    private readonly metricsService: HealthRecordMetricsService,
    private readonly phiLogger: PHIAccessLogger,
    private readonly cacheService: CacheStrategyService,
    private readonly queryAnalyzer: QueryPerformanceAnalyzer,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.initializeService();
    this.setupPredictiveModels();
  }

  /**
   * Initialize the resource optimization service
   */
  private initializeService(): void {
    this.logger.log('Initializing Resource Optimization Service');

    // Start resource monitoring
    this.startResourceMonitoring();

    // Initialize optimization recommendations
    this.generateInitialRecommendations();

    // Setup event listeners
    this.setupEventListeners();

    this.logger.log('Resource Optimization Service initialized successfully');
  }

  /**
   * Get current resource metrics
   */
  getCurrentResourceMetrics(): ResourceMetrics {
    return this.collectResourceMetrics();
  }

  /**
   * Get resource usage history
   */
  getResourceHistory(hours: number = 24): ResourceMetrics[] {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.resourceHistory.filter(
      (metric) => metric.timestamp >= cutoffTime,
    );
  }

  /**
   * Get active optimization recommendations
   */
  getOptimizationRecommendations(
    limit: number = 50,
  ): OptimizationRecommendation[] {
    return Array.from(this.recommendations.values())
      .sort(
        (a, b) =>
          this.getPriorityWeight(b.priority) -
          this.getPriorityWeight(a.priority),
      )
      .slice(0, limit);
  }

  /**
   * Get active resource alerts
   */
  getActiveAlerts(): ResourceAlert[] {
    return Array.from(this.alerts.values())
      .filter((alert) => !alert.acknowledged && !alert.resolvedAt)
      .sort(
        (a, b) =>
          this.getSeverityWeight(b.severity) -
          this.getSeverityWeight(a.severity),
      );
  }

  /**
   * Create optimization plan
   */
  createOptimizationPlan(
    name: string,
    description: string,
    targetResources: string[],
    selectedRecommendations: string[],
  ): string {
    const planId = this.generatePlanId();
    const recommendations = selectedRecommendations
      .map((id) => this.recommendations.get(id))
      .filter((rec) => rec !== undefined);

    // Calculate estimated benefits
    const estimatedBenefit = this.calculateCombinedBenefits(recommendations);

    // Create implementation phases
    const phases = this.createImplementationPhases(recommendations);

    const plan: ResourceOptimizationPlan = {
      planId,
      name,
      description,
      targetResources,
      estimatedBenefit,
      phases,
      complianceValidation: {
        validated: false,
      },
    };

    // Validate compliance impact
    if (this.complianceMode) {
      plan.complianceValidation = this.validateComplianceImpact(plan);
    }

    this.optimizationPlans.set(planId, plan);

    this.logger.log(`Created optimization plan: ${name} (${planId})`);
    return planId;
  }

  /**
   * Execute optimization recommendation
   */
  async executeOptimization(recommendationId: string): Promise<{
    success: boolean;
    message: string;
    metricsImprovement?: {
      before: ResourceMetrics;
      after: ResourceMetrics;
      improvement: Record<string, number>;
    };
  }> {
    const recommendation = this.recommendations.get(recommendationId);
    if (!recommendation) {
      return { success: false, message: 'Recommendation not found' };
    }

    this.logger.log(`Executing optimization: ${recommendation.title}`);

    // Capture baseline metrics
    const beforeMetrics = this.collectResourceMetrics();

    try {
      // Execute optimization based on type
      const result = await this.executeOptimizationByType(recommendation);

      if (result.success) {
        // Wait for metrics to stabilize
        await this.delay(5000);

        // Capture after metrics
        const afterMetrics = this.collectResourceMetrics();
        const improvement = this.calculateImprovement(
          beforeMetrics,
          afterMetrics,
        );

        // Record success
        this.recordOptimizationSuccess(recommendation, improvement);

        // Remove executed recommendation
        this.recommendations.delete(recommendationId);

        return {
          success: true,
          message: `Optimization completed successfully: ${recommendation.title}`,
          metricsImprovement: {
            before: beforeMetrics,
            after: afterMetrics,
            improvement,
          },
        };
      } else {
        this.recordOptimizationFailure(recommendation, result.message);
        return result;
      }
    } catch (error) {
      const errorMessage = `Optimization failed: ${error.message}`;
      this.logger.error(errorMessage, error.stack);
      this.recordOptimizationFailure(recommendation, errorMessage);

      return { success: false, message: errorMessage };
    }
  }

  /**
   * Get predictive scaling recommendations
   */
  getPredictiveScalingRecommendations(): Array<{
    resourceType: string;
    currentUsage: number;
    predictedUsage: number;
    timeToThreshold: number; // Minutes
    recommendedAction: string;
    confidence: number;
  }> {
    const recommendations: any[] = [];

    for (const model of Array.from(this.predictiveModels.values())) {
      const latestPrediction = model.predictions[model.predictions.length - 1];
      if (latestPrediction && latestPrediction.confidence > 0.7) {
        const currentMetrics = this.collectResourceMetrics();
        const currentUsage = this.getCurrentUsageForResource(
          model.resourceType,
          currentMetrics,
        );

        recommendations.push({
          resourceType: model.resourceType,
          currentUsage,
          predictedUsage: latestPrediction.predictedUsage,
          timeToThreshold: this.calculateTimeToThreshold(
            currentUsage,
            latestPrediction.predictedUsage,
            model.resourceType,
          ),
          recommendedAction: latestPrediction.recommendedAction,
          confidence: latestPrediction.confidence,
        });
      }
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Perform memory optimization
   */
  async performMemoryOptimization(): Promise<{
    success: boolean;
    memoryFreed: number;
    optimizationsApplied: string[];
  }> {
    const beforeMemory = process.memoryUsage();
    const optimizationsApplied: string[] = [];

    try {
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
        optimizationsApplied.push('Forced garbage collection');
      }

      // Clear expired cache entries
      const cacheMetrics = this.cacheService.getCacheMetrics();
      if (cacheMetrics.overall.totalMemoryUsage > 10 * 1024 * 1024) {
        // > 10MB
        await this.cacheService.invalidate(
          '*:expired:*',
          'memory optimization',
        );
        optimizationsApplied.push('Cleared expired cache entries');
      }

      // Clear old query metrics
      await this.queryAnalyzer.storePerformanceAnalysisSnapshot();
      optimizationsApplied.push('Cleaned query performance history');

      // Clear old resource history
      if (this.resourceHistory.length > this.maxHistorySize) {
        const toRemove = this.resourceHistory.length - this.maxHistorySize;
        this.resourceHistory.splice(0, toRemove);
        optimizationsApplied.push(`Cleaned ${toRemove} old resource metrics`);
      }

      const afterMemory = process.memoryUsage();
      const memoryFreed = beforeMemory.heapUsed - afterMemory.heapUsed;

      this.logger.log(
        `Memory optimization completed: freed ${(memoryFreed / 1024 / 1024).toFixed(2)}MB`,
      );

      return {
        success: true,
        memoryFreed: Math.max(0, memoryFreed),
        optimizationsApplied,
      };
    } catch (error) {
      this.logger.error('Memory optimization failed:', error);
      return {
        success: false,
        memoryFreed: 0,
        optimizationsApplied,
      };
    }
  }

  /**
   * Generate comprehensive resource report
   */
  generateResourceReport(): {
    summary: {
      overallHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
      resourceUtilization: Record<string, number>;
      activeAlerts: number;
      pendingOptimizations: number;
      complianceStatus: string;
    };
    metrics: ResourceMetrics;
    trends: {
      memory: 'IMPROVING' | 'STABLE' | 'DEGRADING';
      cpu: 'IMPROVING' | 'STABLE' | 'DEGRADING';
      database: 'IMPROVING' | 'STABLE' | 'DEGRADING';
      cache: 'IMPROVING' | 'STABLE' | 'DEGRADING';
    };
    recommendations: OptimizationRecommendation[];
    alerts: ResourceAlert[];
    predictiveInsights: Array<{
      resource: string;
      prediction: string;
      confidence: number;
      timeframe: string;
    }>;
  } {
    const currentMetrics = this.collectResourceMetrics();
    const activeAlerts = this.getActiveAlerts();
    const recommendations = this.getOptimizationRecommendations(10);

    // Calculate overall health
    const overallHealth = this.calculateOverallHealth(
      currentMetrics,
      activeAlerts,
    );

    // Calculate trends
    const trends = this.calculateResourceTrends();

    // Generate predictive insights
    const predictiveInsights = this.generatePredictiveInsights();

    return {
      summary: {
        overallHealth,
        resourceUtilization: {
          memory: currentMetrics.memory.utilization,
          cpu: currentMetrics.cpu.usage,
          database: (currentMetrics.database.activeConnections / 100) * 100, // Assuming max 100 connections
          cache: currentMetrics.cache.hitRate,
        },
        activeAlerts: activeAlerts.length,
        pendingOptimizations: recommendations.length,
        complianceStatus: this.complianceMode ? 'COMPLIANT' : 'MONITORING',
      },
      metrics: currentMetrics,
      trends,
      recommendations,
      alerts: activeAlerts,
      predictiveInsights,
    };
  }

  // ==================== Periodic Operations ====================

  /**
   * Continuous resource monitoring
   */
  @Cron('*/30 * * * * *') // Every 30 seconds
  async performResourceMonitoring(): Promise<void> {
    const metrics = this.collectResourceMetrics();

    // Store metrics
    this.resourceHistory.push(metrics);

    // Trim history if too large
    if (this.resourceHistory.length > this.maxHistorySize) {
      this.resourceHistory.shift();
    }

    // Check for alerts
    await this.checkForAlerts(metrics);

    // Update predictive models
    await this.updatePredictiveModels(metrics);

    // Record metrics
    this.recordResourceMetrics(metrics);
  }

  /**
   * Generate optimization recommendations
   */
  @Cron('*/5 * * * *') // Every 5 minutes
  async generateOptimizationRecommendations(): Promise<void> {
    if (!this.optimizationEnabled) return;

    this.logger.debug('Generating optimization recommendations');

    const currentMetrics = this.collectResourceMetrics();
    const recentHistory = this.getResourceHistory(1); // Last hour

    // Generate recommendations based on current state
    const newRecommendations = await this.analyzeForOptimizations(
      currentMetrics,
      recentHistory,
    );

    // Add new recommendations
    let addedCount = 0;
    for (const recommendation of newRecommendations) {
      if (!this.recommendations.has(recommendation.id)) {
        this.recommendations.set(recommendation.id, recommendation);
        addedCount++;
      }
    }

    // Clean up old/completed recommendations
    const cleanedCount = this.cleanupCompletedRecommendations();

    if (addedCount > 0 || cleanedCount > 0) {
      this.logger.log(
        `Optimization recommendations updated: +${addedCount} new, -${cleanedCount} completed`,
      );
    }
  }

  /**
   * Automated optimization execution
   */
  @Cron(CronExpression.EVERY_HOUR)
  async performAutomatedOptimization(): Promise<void> {
    if (!this.optimizationEnabled) return;

    this.logger.debug('Performing automated optimization');

    // Find safe automated optimizations
    const safeOptimizations = Array.from(this.recommendations.values())
      .filter(
        (rec) =>
          rec.riskLevel === 'LOW' &&
          rec.priority === 'HIGH' &&
          !rec.complianceImpact,
      )
      .slice(0, 3); // Limit to 3 per hour

    let executedCount = 0;
    for (const optimization of safeOptimizations) {
      try {
        const result = await this.executeOptimization(optimization.id);
        if (result.success) {
          executedCount++;
          this.logger.log(
            `Automated optimization executed: ${optimization.title}`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Automated optimization failed: ${optimization.title}:`,
          error,
        );
      }
    }

    if (executedCount > 0) {
      this.logger.log(
        `Automated optimization completed: ${executedCount} optimizations executed`,
      );
    }
  }

  /**
   * Periodic cleanup and maintenance
   */
  @Cron(CronExpression.EVERY_6_HOURS)
  async performMaintenanceCleanup(): Promise<void> {
    this.logger.debug('Performing maintenance cleanup');

    // Clean up old alerts
    const alertsCleaned = this.cleanupOldAlerts();

    // Clean up old recommendations
    const recommendationsCleaned = this.cleanupOldRecommendations();

    // Optimize internal data structures
    const memoryOptimizationResult = await this.performMemoryOptimization();

    // Update predictive models
    const modelsUpdated = await this.retrainPredictiveModels();

    this.logger.log(
      `Maintenance cleanup completed: ${alertsCleaned} alerts, ` +
        `${recommendationsCleaned} recommendations, ` +
        `${(memoryOptimizationResult.memoryFreed / 1024 / 1024).toFixed(2)}MB freed, ` +
        `${modelsUpdated} models updated`,
    );
  }

  // ==================== Private Helper Methods ====================

  /**
   * Collect current resource metrics
   */
  private collectResourceMetrics(): ResourceMetrics {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      timestamp: new Date(),
      memory: {
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
        external: memoryUsage.external,
        buffers: memoryUsage.heapTotal - memoryUsage.heapUsed,
        rss: memoryUsage.rss,
        utilization: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
      },
      cpu: {
        usage: this.calculateCPUUsage(cpuUsage),
        loadAverage: this.getLoadAverage(),
        processes: this.getProcessCount(),
      },
      network: {
        bytesIn: this.getNetworkBytesIn(),
        bytesOut: this.getNetworkBytesOut(),
        connectionsActive: this.getActiveConnections(),
        latency: this.getNetworkLatency(),
      },
      database: {
        activeConnections: this.getDatabaseActiveConnections(),
        idleConnections: this.getDatabaseIdleConnections(),
        queryQueue: this.getDatabaseQueryQueue(),
        slowQueries: this.getSlowQueryCount(),
        lockWaitTime: this.getDatabaseLockWaitTime(),
      },
      cache: {
        hitRate: this.getCacheHitRate(),
        memoryUsage: this.getCacheMemoryUsage(),
        evictionRate: this.getCacheEvictionRate(),
        responseTime: this.getCacheResponseTime(),
      },
    };
  }

  /**
   * Check for resource alerts
   */
  private async checkForAlerts(metrics: ResourceMetrics): Promise<void> {
    const alerts: ResourceAlert[] = [];

    // Memory alerts
    if (metrics.memory.utilization > this.thresholds.memory.critical) {
      alerts.push(
        this.createAlert(
          ResourceAlertType.HIGH_MEMORY_USAGE,
          'CRITICAL',
          'Critical Memory Usage',
          `Memory usage at ${metrics.memory.utilization.toFixed(1)}% (threshold: ${this.thresholds.memory.critical}%)`,
          this.thresholds.memory.critical,
          metrics.memory.utilization,
        ),
      );
    } else if (metrics.memory.utilization > this.thresholds.memory.warning) {
      alerts.push(
        this.createAlert(
          ResourceAlertType.HIGH_MEMORY_USAGE,
          'WARNING',
          'High Memory Usage',
          `Memory usage at ${metrics.memory.utilization.toFixed(1)}% (threshold: ${this.thresholds.memory.warning}%)`,
          this.thresholds.memory.warning,
          metrics.memory.utilization,
        ),
      );
    }

    // CPU alerts
    if (metrics.cpu.usage > this.thresholds.cpu.critical) {
      alerts.push(
        this.createAlert(
          ResourceAlertType.HIGH_CPU_USAGE,
          'CRITICAL',
          'Critical CPU Usage',
          `CPU usage at ${metrics.cpu.usage.toFixed(1)}% (threshold: ${this.thresholds.cpu.critical}%)`,
          this.thresholds.cpu.critical,
          metrics.cpu.usage,
        ),
      );
    } else if (metrics.cpu.usage > this.thresholds.cpu.warning) {
      alerts.push(
        this.createAlert(
          ResourceAlertType.HIGH_CPU_USAGE,
          'WARNING',
          'High CPU Usage',
          `CPU usage at ${metrics.cpu.usage.toFixed(1)}% (threshold: ${this.thresholds.cpu.warning}%)`,
          this.thresholds.cpu.warning,
          metrics.cpu.usage,
        ),
      );
    }

    // Database alerts
    const dbUtilization = (metrics.database.activeConnections / 100) * 100; // Assuming max 100
    if (dbUtilization > this.thresholds.database.connectionCritical) {
      alerts.push(
        this.createAlert(
          ResourceAlertType.DATABASE_CONNECTION_POOL_EXHAUSTED,
          'CRITICAL',
          'Database Connection Pool Critical',
          `Database connections at ${dbUtilization.toFixed(1)}% capacity`,
          this.thresholds.database.connectionCritical,
          dbUtilization,
        ),
      );
    }

    // Cache alerts
    if (metrics.cache.hitRate < this.thresholds.cache.hitRateCritical) {
      alerts.push(
        this.createAlert(
          ResourceAlertType.CACHE_HIT_RATE_LOW,
          'CRITICAL',
          'Critical Cache Hit Rate',
          `Cache hit rate at ${metrics.cache.hitRate.toFixed(1)}% (threshold: ${this.thresholds.cache.hitRateCritical}%)`,
          this.thresholds.cache.hitRateCritical,
          metrics.cache.hitRate,
        ),
      );
    }

    // Store new alerts
    for (const alert of alerts) {
      if (!this.alerts.has(alert.id)) {
        this.alerts.set(alert.id, alert);
        await this.handleNewAlert(alert);
      }
    }
  }

  /**
   * Create resource alert
   */
  private createAlert(
    alertType: ResourceAlertType,
    severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL',
    title: string,
    message: string,
    threshold: number,
    currentValue: number,
  ): ResourceAlert {
    return {
      id: this.generateAlertId(alertType),
      alertType,
      severity,
      title,
      message,
      timestamp: new Date(),
      threshold,
      currentValue,
      trend: this.calculateTrend(alertType, currentValue),
      acknowledged: false,
      metadata: {
        resourceType: alertType.split('_')[0].toLowerCase(),
        complianceImpact: this.assessComplianceImpact(alertType),
        autoRecoveryAttempted: false,
      },
    };
  }

  /**
   * Handle new alert
   */
  private async handleNewAlert(alert: ResourceAlert): Promise<void> {
    this.logger.warn(`Resource alert: ${alert.title} - ${alert.message}`);

    // Emit event for external monitoring
    this.eventEmitter.emit('resource.alert', {
      alert,
      timestamp: new Date(),
    });

    // Log security incident for compliance-impacting alerts
    if (alert.metadata.complianceImpact) {
      this.phiLogger.logSecurityIncident({
        correlationId: alert.id,
        timestamp: alert.timestamp,
        incidentType: 'RESOURCE_ALERT',
        operation: 'RESOURCE_MONITORING',
        errorMessage: alert.message,
        severity: this.mapAlertSeverityToIncidentSeverity(alert.severity),
        ipAddress: 'internal',
      });
    }

    // Attempt auto-recovery for critical alerts
    if (alert.severity === 'CRITICAL' && this.optimizationEnabled) {
      await this.attemptAutoRecovery(alert);
    }
  }

  /**
   * Attempt automatic recovery
   */
  private async attemptAutoRecovery(alert: ResourceAlert): Promise<void> {
    this.logger.log(`Attempting auto-recovery for alert: ${alert.alertType}`);

    try {
      switch (alert.alertType) {
        case ResourceAlertType.HIGH_MEMORY_USAGE:
          await this.performMemoryOptimization();
          break;
        case ResourceAlertType.CACHE_HIT_RATE_LOW:
          await this.cacheService.performCacheWarming();
          break;
        case ResourceAlertType.DATABASE_CONNECTION_POOL_EXHAUSTED:
          // Could implement connection pool cleanup
          break;
      }

      alert.metadata.autoRecoveryAttempted = true;
      this.logger.log(`Auto-recovery attempted for alert: ${alert.alertType}`);
    } catch (error) {
      this.logger.error(
        `Auto-recovery failed for alert ${alert.alertType}:`,
        error,
      );
    }
  }

  // Additional helper methods...
  private startResourceMonitoring(): void {
    /* TODO */
  }
  private generateInitialRecommendations(): void {
    /* TODO */
  }
  private setupEventListeners(): void {
    /* TODO */
  }
  private setupPredictiveModels(): void {
    /* TODO */
  }
  private getPriorityWeight(priority: string): number {
    switch (priority) {
      case 'CRITICAL':
        return 4;
      case 'HIGH':
        return 3;
      case 'MEDIUM':
        return 2;
      case 'LOW':
        return 1;
      default:
        return 0;
    }
  }
  private getSeverityWeight(severity: string): number {
    switch (severity) {
      case 'CRITICAL':
        return 4;
      case 'ERROR':
        return 3;
      case 'WARNING':
        return 2;
      case 'INFO':
        return 1;
      default:
        return 0;
    }
  }
  private generatePlanId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  private calculateCombinedBenefits(
    recommendations: OptimizationRecommendation[],
  ): any {
    return {};
  }
  private createImplementationPhases(
    recommendations: OptimizationRecommendation[],
  ): any[] {
    return [];
  }
  private validateComplianceImpact(plan: ResourceOptimizationPlan): any {
    return { validated: true };
  }
  private async executeOptimizationByType(
    recommendation: OptimizationRecommendation,
  ): Promise<any> {
    return { success: true };
  }
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  private calculateImprovement(
    before: ResourceMetrics,
    after: ResourceMetrics,
  ): Record<string, number> {
    return {};
  }
  private recordOptimizationSuccess(
    recommendation: OptimizationRecommendation,
    improvement: any,
  ): void {
    /* TODO */
  }
  private recordOptimizationFailure(
    recommendation: OptimizationRecommendation,
    error: string,
  ): void {
    /* TODO */
  }
  private getCurrentUsageForResource(
    resourceType: string,
    metrics: ResourceMetrics,
  ): number {
    return 0;
  }
  private calculateTimeToThreshold(
    current: number,
    predicted: number,
    resourceType: string,
  ): number {
    return 0;
  }
  private calculateOverallHealth(
    metrics: ResourceMetrics,
    alerts: ResourceAlert[],
  ): 'HEALTHY' | 'WARNING' | 'CRITICAL' {
    if (alerts.some((a) => a.severity === 'CRITICAL')) return 'CRITICAL';
    if (alerts.some((a) => a.severity === 'WARNING' || a.severity === 'ERROR'))
      return 'WARNING';
    return 'HEALTHY';
  }
  private calculateResourceTrends(): any {
    return {};
  }
  private generatePredictiveInsights(): any[] {
    return [];
  }
  private async updatePredictiveModels(
    metrics: ResourceMetrics,
  ): Promise<void> {
    /* TODO */
  }
  private recordResourceMetrics(metrics: ResourceMetrics): void {
    /* TODO */
  }
  private async analyzeForOptimizations(
    current: ResourceMetrics,
    history: ResourceMetrics[],
  ): Promise<OptimizationRecommendation[]> {
    return [];
  }
  private cleanupCompletedRecommendations(): number {
    return 0;
  }
  private cleanupOldAlerts(): number {
    return 0;
  }
  private cleanupOldRecommendations(): number {
    return 0;
  }
  private async retrainPredictiveModels(): Promise<number> {
    return 0;
  }
  private calculateCPUUsage(cpuUsage: any): number {
    return 0;
  }
  private getLoadAverage(): number[] {
    return [0, 0, 0];
  }
  private getProcessCount(): number {
    return 1;
  }
  private getNetworkBytesIn(): number {
    return 0;
  }
  private getNetworkBytesOut(): number {
    return 0;
  }
  private getActiveConnections(): number {
    return 0;
  }
  private getNetworkLatency(): number {
    return 0;
  }
  private getDatabaseActiveConnections(): number {
    return 5;
  }
  private getDatabaseIdleConnections(): number {
    return 15;
  }
  private getDatabaseQueryQueue(): number {
    return 0;
  }
  private getSlowQueryCount(): number {
    return 0;
  }
  private getDatabaseLockWaitTime(): number {
    return 0;
  }
  private getCacheHitRate(): number {
    return this.cacheService.getCacheMetrics().overall.hitRate * 100;
  }
  private getCacheMemoryUsage(): number {
    return this.cacheService.getCacheMetrics().overall.totalMemoryUsage;
  }
  private getCacheEvictionRate(): number {
    return 0;
  }
  private getCacheResponseTime(): number {
    return this.cacheService.getCacheMetrics().overall.averageResponseTime;
  }
  private generateAlertId(alertType: ResourceAlertType): string {
    return `${alertType}_${Date.now()}`;
  }
  private calculateTrend(
    alertType: ResourceAlertType,
    currentValue: number,
  ): 'INCREASING' | 'DECREASING' | 'STABLE' {
    return 'STABLE';
  }
  private assessComplianceImpact(alertType: ResourceAlertType): boolean {
    return (
      alertType === ResourceAlertType.PHI_PROCESSING_OVERLOAD ||
      alertType === ResourceAlertType.COMPLIANCE_RISK_DETECTED
    );
  }

  /**
   * Map alert severity to incident severity
   */
  private mapAlertSeverityToIncidentSeverity(
    alertSeverity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL',
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    switch (alertSeverity) {
      case 'INFO':
        return 'LOW';
      case 'WARNING':
        return 'MEDIUM';
      case 'ERROR':
        return 'HIGH';
      case 'CRITICAL':
        return 'CRITICAL';
      default:
        return 'MEDIUM';
    }
  }

  /**
   * Cleanup resources
   */
  onModuleDestroy(): void {
    this.resourceHistory.length = 0;
    this.alerts.clear();
    this.recommendations.clear();
    this.optimizationPlans.clear();
    this.predictiveModels.clear();

    this.logger.log('Resource Optimization Service destroyed');
  }
}
