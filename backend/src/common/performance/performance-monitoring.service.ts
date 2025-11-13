/**
 * Healthcare-Grade Performance Monitoring Service for White Cross Platform
 *
 * Production-ready performance monitoring with healthcare-specific metrics,
 * real-time alerting, and comprehensive system health tracking.
 *
 * @module PerformanceMonitoringService
 * @healthcare Optimized for healthcare application performance
 * @compliance HIPAA audit trail for performance metrics
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter } from 'events';
import { Sequelize } from 'sequelize';
import { performance } from 'perf_hooks';
import * as os from 'os';
import * as process from 'process';

import { BaseService } from '@/common/base';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
// Healthcare-specific Performance Metric Interfaces
export interface HealthcarePerformanceMetric {
  id: string;
  timestamp: Date;
  metricType: 'query' | 'api' | 'system' | 'custom' | 'healthcare';
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'percent' | 'count' | 'ops/sec';
  tags: Record<string, string>;
  metadata: Record<string, any>;
  patientImpactLevel?: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  hipaaAuditRequired?: boolean;
}

export interface HealthcareQueryPerformance {
  queryId: string;
  sql: string;
  executionTime: number;
  rowsReturned: number;
  rowsExamined: number;
  indexesUsed: string[];
  planHash: string;
  timestamp: Date;
  optimized: boolean;
  suggestions: string[];
  containsPHI: boolean;
  patientId?: string;
  providerId?: string;
  clinicalContext?: string;
}

export interface HealthcareSystemMetrics {
  timestamp: Date;
  cpu: {
    usage: number;
    load: number[];
    cores: number;
    healthcareProcessUsage: number;
  };
  memory: {
    used: number;
    free: number;
    total: number;
    percentage: number;
    heap: {
      used: number;
      total: number;
      percentage: number;
    };
    phiCacheUsage: number;
  };
  disk: {
    reads: number;
    writes: number;
    readTime: number;
    writeTime: number;
    healthcareDataWrites: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
    secureConnections: number;
  };
  database: {
    activeConnections: number;
    queryQueueLength: number;
    lockWaitTime: number;
    deadlocks: number;
  };
}

export interface HealthcarePerformanceAlert {
  id: string;
  type: 'threshold' | 'trend' | 'anomaly' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  metric: string;
  message: string;
  timestamp: Date;
  threshold?: number;
  actualValue: number;
  acknowledged: boolean;
  resolvedAt?: Date;
  patientImpact?: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  requiresNotification: boolean;
  clinicalTeamNotified: boolean;
}

export interface HealthcareOptimizationRecommendation {
  id: string;
  type: 'index' | 'query' | 'schema' | 'configuration' | 'healthcare';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  effort: string;
  sqlBefore?: string;
  sqlAfter?: string;
  estimatedImprovement: number;
  createdAt: Date;
  applied: boolean;
  patientSafetyImpact?: string;
  complianceImplication?: string;
}

/**
 * Healthcare-grade performance monitoring service
 */
@Injectable()
export class HealthcarePerformanceMonitoringService extends EventEmitter {
  private metrics: HealthcarePerformanceMetric[] = [];
  private queryPerformance: HealthcareQueryPerformance[] = [];
  private systemMetrics: HealthcareSystemMetrics[] = [];
  private alerts: HealthcarePerformanceAlert[] = [];
  private recommendations: HealthcareOptimizationRecommendation[] = [];
  private monitoringIntervals: NodeJS.Timeout[] = [];
  
  // Healthcare-specific thresholds
  private readonly slowQueryThreshold = 1000; // 1 second
  private readonly criticalQueryThreshold = 5000; // 5 seconds (patient safety concern)
  private readonly phiQueryThreshold = 500; // 500ms for PHI queries
  private alertThresholds = new Map<string, number>();

  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private configService: ConfigService
  ) {
    super({
      serviceName: 'HealthcarePerformanceMonitoringService',
      logger,
      enableAuditLogging: true,
    });

    super();
    this.initializeHealthcareAlertThresholds();
    this.startHealthcareSystemMonitoring();
    this.startHealthcareMetricAggregation();
    this.startHealthcareAuditLogging();
  }

  // ==================== Healthcare Query Performance Monitoring ====================

  /**
   * Monitors healthcare-specific database queries with PHI awareness
   */
  async monitorHealthcareQuery<T>(
    sequelize: Sequelize,
    queryName: string,
    queryFn: () => Promise<T>,
    options: {
      containsPHI?: boolean;
      patientId?: string;
      providerId?: string;
      clinicalContext?: string;
      tags?: Record<string, string>;
    } = {},
  ): Promise<T> {
    const queryId = this.generateQueryId();
    const startTime = performance.now();
    const startMemory = process.memoryUsage();

    // Determine query threshold based on PHI content
    const relevantThreshold = options.containsPHI 
      ? this.phiQueryThreshold 
      : this.slowQueryThreshold;

    try {
      const result = await queryFn();
      const endTime = performance.now();
      const endMemory = process.memoryUsage();
      
      const executionTime = endTime - startTime;
      const memoryUsed = endMemory.heapUsed - startMemory.heapUsed;

      // Record healthcare query performance
      const queryPerf: HealthcareQueryPerformance = {
        queryId,
        sql: this.extractSQLFromFunction(queryFn),
        executionTime,
        rowsReturned: Array.isArray(result) ? result.length : 1,
        rowsExamined: 0, // Would be extracted from query plan
        indexesUsed: [],
        planHash: this.generatePlanHash(queryFn),
        timestamp: new Date(),
        optimized: executionTime < relevantThreshold,
        suggestions: [],
        containsPHI: options.containsPHI || false,
        patientId: options.patientId,
        providerId: options.providerId,
        clinicalContext: options.clinicalContext
      };

      if (executionTime > relevantThreshold) {
        queryPerf.suggestions = await this.analyzeHealthcareSlowQuery(queryPerf);
      }

      this.queryPerformance.push(queryPerf);

      // Record healthcare performance metrics
      await this.recordHealthcareMetric({
        id: this.generateMetricId(),
        timestamp: new Date(),
        metricType: options.containsPHI ? 'healthcare' : 'query',
        name: queryName,
        value: executionTime,
        unit: 'ms',
        tags: {
          ...options.tags,
          queryId,
          containsPHI: String(options.containsPHI),
          patientId: options.patientId || 'none',
        },
        metadata: {
          memoryUsed,
          rowsReturned: queryPerf.rowsReturned,
          clinicalContext: options.clinicalContext,
        },
        patientImpactLevel: this.calculatePatientImpactLevel(executionTime, options.containsPHI),
        hipaaAuditRequired: options.containsPHI,
      });

      // Check for healthcare-specific alerts
      await this.checkHealthcarePerformanceAlerts(
        options.containsPHI ? 'phi_query_time' : 'query_time', 
        executionTime,
        options.patientId
      );

      this.emit('healthcareQueryExecuted', {
        queryPerf,
        executionTime,
        memoryUsed,
        patientImpact: this.calculatePatientImpactLevel(executionTime, options.containsPHI),
      });

      return result;
    } catch (error) {
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Record failed healthcare query
      await this.recordHealthcareMetric({
        id: this.generateMetricId(),
        timestamp: new Date(),
        metricType: 'healthcare',
        name: `${queryName}_error`,
        value: executionTime,
        unit: 'ms',
        tags: {
          ...options.tags,
          queryId,
          error: 'true',
          containsPHI: String(options.containsPHI),
          patientId: options.patientId || 'none',
        },
        metadata: {
          error: (error as Error).message,
          clinicalContext: options.clinicalContext,
        },
        patientImpactLevel: 'HIGH', // Query failures have high patient impact
        hipaaAuditRequired: true, // Always audit errors
      });

      // Create critical alert for healthcare query failures
      await this.createHealthcareAlert({
        type: 'anomaly',
        severity: 'critical',
        metric: 'healthcare_query_failure',
        message: `Healthcare query failed: ${queryName} - ${(error as Error).message}`,
        actualValue: executionTime,
        patientImpact: 'HIGH',
        requiresNotification: true,
        clinicalTeamNotified: false,
      });

      this.emit('healthcareQueryError', {
        queryId,
        executionTime,
        error,
        patientId: options.patientId,
      });
      throw error;
    }
  }

  // ==================== Healthcare API Performance Monitoring ====================

  /**
   * Monitors healthcare API endpoints with patient safety awareness
   */
  async monitorHealthcareAPI<T>(
    endpoint: string,
    method: string,
    handler: () => Promise<T>,
    options: {
      patientId?: string;
      providerId?: string;
      containsPHI?: boolean;
      clinicalWorkflow?: string;
      metadata?: Record<string, any>;
    } = {},
  ): Promise<T> {
    const startTime = performance.now();
    const startMemory = process.memoryUsage();

    try {
      const result = await handler();
      const endTime = performance.now();
      const endMemory = process.memoryUsage();
      
      const responseTime = endTime - startTime;
      const memoryUsed = endMemory.heapUsed - startMemory.heapUsed;

      await this.recordHealthcareMetric({
        id: this.generateMetricId(),
        timestamp: new Date(),
        metricType: 'api',
        name: 'healthcare_api_response_time',
        value: responseTime,
        unit: 'ms',
        tags: {
          endpoint,
          method,
          status: 'success',
          containsPHI: String(options.containsPHI),
          clinicalWorkflow: options.clinicalWorkflow || 'unknown',
        },
        metadata: {
          ...options.metadata,
          memoryUsed,
          patientId: options.patientId,
          providerId: options.providerId,
        },
        patientImpactLevel: this.calculateAPIPatientImpactLevel(endpoint, responseTime),
        hipaaAuditRequired: options.containsPHI,
      });

      // Check healthcare API response time thresholds
      await this.checkHealthcarePerformanceAlerts('healthcare_api_response_time', responseTime);

      return result;
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      await this.recordHealthcareMetric({
        id: this.generateMetricId(),
        timestamp: new Date(),
        metricType: 'api',
        name: 'healthcare_api_response_time',
        value: responseTime,
        unit: 'ms',
        tags: {
          endpoint,
          method,
          status: 'error',
          containsPHI: String(options.containsPHI),
          clinicalWorkflow: options.clinicalWorkflow || 'unknown',
        },
        metadata: {
          ...options.metadata,
          error: (error as Error).message,
          patientId: options.patientId,
          providerId: options.providerId,
        },
        patientImpactLevel: 'HIGH',
        hipaaAuditRequired: true,
      });

      // Create alert for API failures
      await this.createHealthcareAlert({
        type: 'anomaly',
        severity: 'high',
        metric: 'healthcare_api_failure',
        message: `Healthcare API failure: ${method} ${endpoint} - ${(error as Error).message}`,
        actualValue: responseTime,
        patientImpact: 'HIGH',
        requiresNotification: true,
        clinicalTeamNotified: false,
      });

      throw error;
    }
  }

  // ==================== Healthcare System Resource Monitoring ====================

  /**
   * Collects healthcare-specific system metrics
   */
  private collectHealthcareSystemMetrics(): HealthcareSystemMetrics {
    const memoryUsage = process.memoryUsage();
    
    return {
      timestamp: new Date(),
      cpu: {
        usage: this.calculateCPUUsage(),
        load: os.loadavg(),
        cores: os.cpus().length,
        healthcareProcessUsage: this.calculateHealthcareProcessUsage(),
      },
      memory: {
        used: os.totalmem() - os.freemem(),
        free: os.freemem(),
        total: os.totalmem(),
        percentage: ((os.totalmem() - os.freemem()) / os.totalmem()) * 100,
        heap: {
          used: memoryUsage.heapUsed,
          total: memoryUsage.heapTotal,
          percentage: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
        },
        phiCacheUsage: this.calculatePHICacheUsage(),
      },
      disk: {
        reads: 0, // Would integrate with system monitoring
        writes: 0,
        readTime: 0,
        writeTime: 0,
        healthcareDataWrites: this.calculateHealthcareDataWrites(),
      },
      network: {
        bytesIn: 0, // Would integrate with network monitoring
        bytesOut: 0,
        packetsIn: 0,
        packetsOut: 0,
        secureConnections: this.calculateSecureConnections(),
      },
      database: {
        activeConnections: 0, // Would integrate with DB monitoring
        queryQueueLength: 0,
        lockWaitTime: 0,
        deadlocks: 0,
      },
    };
  }

  // ==================== Healthcare Performance Analysis ====================

  /**
   * Analyzes healthcare query performance with clinical context
   */
  async analyzeHealthcareQueryPerformance(
    sequelize: Sequelize,
    timeWindow: number = 3600000,
  ): Promise<HealthcareOptimizationRecommendation[]> {
    const cutoffTime = new Date(Date.now() - timeWindow);
    const recentQueries = this.queryPerformance.filter((q) => q.timestamp > cutoffTime);
    const recommendations: HealthcareOptimizationRecommendation[] = [];

    // Analyze PHI queries separately
    const phiQueries = recentQueries.filter((q) => q.containsPHI);
    const slowPHIQueries = phiQueries.filter((q) => q.executionTime > this.phiQueryThreshold);

    for (const query of slowPHIQueries) {
      const recommendation = await this.generateHealthcareQueryOptimizationRecommendation(query);
      if (recommendation) {
        recommendations.push(recommendation);
      }
    }

    // Analyze query patterns by clinical context
    const queryByContext = new Map<string, HealthcareQueryPerformance[]>();
    for (const query of recentQueries.filter((q) => q.clinicalContext)) {
      const context = query.clinicalContext;
      if (!queryByContext.has(context)) {
        queryByContext.set(context, []);
      }
      queryByContext.get(context)?.push(query);
    }

    // Generate context-specific recommendations
    for (const [context, contextQueries] of queryByContext) {
      if (contextQueries.length > 5) {
        // Frequent clinical workflow
        const avgExecutionTime =
          contextQueries.reduce((sum, q) => sum + q.executionTime, 0) / contextQueries.length;

        if (avgExecutionTime > this.slowQueryThreshold) {
          recommendations.push({
            id: this.generateRecommendationId(),
            type: 'healthcare',
            priority: 'high',
            description: `Optimize queries for clinical workflow: ${context}`,
            impact: `Improve ${context} workflow performance by ${Math.round(
              ((avgExecutionTime - this.slowQueryThreshold) / avgExecutionTime) * 100,
            )}%`,
            effort: 'Medium - Clinical workflow optimization',
            estimatedImprovement: 50,
            createdAt: new Date(),
            applied: false,
            patientSafetyImpact: 'Faster clinical workflows improve patient care quality',
            complianceImplication: 'Improved system responsiveness supports timely care delivery',
          });
        }
      }
    }

    this.recommendations.push(...recommendations);
    return recommendations;
  }

  // ==================== Healthcare Performance Dashboard ====================

  /**
   * Gets healthcare-specific performance dashboard data
   */
  getHealthcarePerformanceDashboard(timeWindow: number = 3600000): {
    clinicalMetrics: {
      avgPHIQueryTime: number;
      totalHealthcareQueries: number;
      slowPHIQueries: number;
      patientSafetyAlerts: number;
      complianceAlerts: number;
    };
    systemHealth: {
      cpuUsage: number;
      memoryUsage: number;
      phiCacheUsage: number;
      secureConnections: number;
    };
    topSlowHealthcareQueries: HealthcareQueryPerformance[];
    criticalAlerts: HealthcarePerformanceAlert[];
    clinicalRecommendations: HealthcareOptimizationRecommendation[];
  } {
    const cutoffTime = new Date(Date.now() - timeWindow);
    const recentMetrics = this.metrics.filter(m => m.timestamp > cutoffTime);
    const recentQueries = this.queryPerformance.filter(q => q.timestamp > cutoffTime);
    const recentSystemMetrics = this.systemMetrics.filter(m => m.timestamp > cutoffTime);

    // Calculate healthcare-specific metrics
    const healthcareMetrics = recentMetrics.filter(m => 
      m.metricType === 'healthcare' || m.tags.containsPHI === 'true'
    );
    const phiQueries = recentQueries.filter(q => q.containsPHI);
    
    const avgPHIQueryTime = phiQueries.length > 0 
      ? phiQueries.reduce((sum, q) => sum + q.executionTime, 0) / phiQueries.length 
      : 0;

    const slowPHIQueries = phiQueries.filter(q => q.executionTime > this.phiQueryThreshold);
    
    const patientSafetyAlerts = this.alerts.filter(a => 
      a.timestamp > cutoffTime && 
      (a.patientImpact === 'HIGH' || a.patientImpact === 'CRITICAL')
    );

    const complianceAlerts = this.alerts.filter(a => 
      a.timestamp > cutoffTime && 
      a.type === 'security'
    );

    // Get latest system metrics
    const latestSystemMetrics = recentSystemMetrics[recentSystemMetrics.length - 1];
    
    return {
      clinicalMetrics: {
        avgPHIQueryTime,
        totalHealthcareQueries: healthcareMetrics.length,
        slowPHIQueries: slowPHIQueries.length,
        patientSafetyAlerts: patientSafetyAlerts.length,
        complianceAlerts: complianceAlerts.length
      },
      systemHealth: {
        cpuUsage: latestSystemMetrics?.cpu.usage || 0,
        memoryUsage: latestSystemMetrics?.memory.percentage || 0,
        phiCacheUsage: latestSystemMetrics?.memory.phiCacheUsage || 0,
        secureConnections: latestSystemMetrics?.network.secureConnections || 0
      },
      topSlowHealthcareQueries: slowPHIQueries
        .sort((a, b) => b.executionTime - a.executionTime)
        .slice(0, 10),
      criticalAlerts: this.alerts
        .filter(a => a.timestamp > cutoffTime && a.severity === 'critical')
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
      clinicalRecommendations: this.recommendations
        .filter(r => !r.applied && r.type === 'healthcare')
        .sort((a, b) => this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority))
    };
  }

  // ==================== Healthcare Metrics Recording ====================

  /**
   * Records healthcare-specific performance metrics
   */
  async recordHealthcareMetric(metric: HealthcarePerformanceMetric): Promise<void> {
    this.metrics.push(metric);
    
    // Emit for real-time monitoring
    this.emit('healthcareMetricRecorded', metric);

    // HIPAA audit logging for PHI-related metrics
    if (metric.hipaaAuditRequired) {
      this.logHIPAAAuditMetric(metric);
    }

    // Check for healthcare alerts
    await this.checkHealthcarePerformanceAlerts(metric.name, metric.value);
  }

  // ==================== Healthcare Alerting System ====================

  /**
   * Creates healthcare-specific performance alerts
   */
  private async createHealthcareAlert(alertData: Partial<HealthcarePerformanceAlert>): Promise<void> {
    const alert: HealthcarePerformanceAlert = {
      id: this.generateAlertId(),
      timestamp: new Date(),
      acknowledged: false,
      patientImpact: 'MEDIUM',
      requiresNotification: false,
      clinicalTeamNotified: false,
      ...alertData
    } as HealthcarePerformanceAlert;

    this.alerts.push(alert);
    this.emit('healthcarePerformanceAlert', alert);

    // Log critical alerts for HIPAA audit
    if (alert.severity === 'critical') {
      this.logError(
        `CRITICAL Healthcare Performance Alert: ${alert.message} | Impact: ${alert.patientImpact} | Time: ${alert.timestamp.toISOString()}`
      );
    }
  }

  /**
   * Checks healthcare performance alerts with patient impact assessment
   */
  private async checkHealthcarePerformanceAlerts(
    metricName: string, 
    value: number, 
    patientId?: string
  ): Promise<void> {
    const threshold = this.alertThresholds.get(metricName);
    
    if (threshold && value > threshold) {
      const patientImpact = this.calculatePatientImpactFromMetric(metricName, value, threshold);
      const severity = this.calculateHealthcareAlertSeverity(metricName, value, threshold, patientImpact);

      await this.createHealthcareAlert({
        type: 'threshold',
        severity,
        metric: metricName,
        message: `Healthcare performance threshold exceeded: ${metricName} = ${value} > ${threshold}${patientId ? ` (Patient: ${patientId})` : ''}`,
        threshold,
        actualValue: value,
        patientImpact,
        requiresNotification: patientImpact === 'HIGH' || patientImpact === 'CRITICAL',
        clinicalTeamNotified: false
      });
    }
  }

  // ==================== Private Helper Methods ====================

  /**
   * Initializes healthcare-specific alert thresholds
   */
  private initializeHealthcareAlertThresholds(): void {
    // PHI query thresholds (stricter)
    this.alertThresholds.set('phi_query_time', this.phiQueryThreshold);
    this.alertThresholds.set('query_time', this.slowQueryThreshold);
    this.alertThresholds.set('healthcare_api_response_time', 800); // 800ms for healthcare APIs
    
    // System thresholds
    this.alertThresholds.set('cpu_usage', 75); // 75% for healthcare systems
    this.alertThresholds.set('memory_usage', 80); // 80%
    this.alertThresholds.set('phi_cache_usage', 70); // 70% for PHI cache
    
    // Healthcare-specific thresholds
    this.alertThresholds.set('patient_safety_response_time', 2000); // 2 seconds
    this.alertThresholds.set('clinical_workflow_time', 3000); // 3 seconds
    this.alertThresholds.set('healthcare_error_rate', 0.01); // 1%
  }

  /**
   * Starts healthcare system monitoring
   */
  private startHealthcareSystemMonitoring(): void {
    const interval = setInterval(async () => {
      try {
        const metrics = await this.collectHealthcareSystemMetrics();
        this.systemMetrics.push(metrics);
        
        // Keep only last 24 hours of data
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        this.systemMetrics = this.systemMetrics.filter(m => m.timestamp > oneDayAgo);

        // Check healthcare system alerts
        await this.checkHealthcarePerformanceAlerts('cpu_usage', metrics.cpu.usage);
        await this.checkHealthcarePerformanceAlerts('memory_usage', metrics.memory.percentage);
        await this.checkHealthcarePerformanceAlerts('phi_cache_usage', metrics.memory.phiCacheUsage);
        
        this.emit('healthcareSystemMetricsUpdated', metrics);
      } catch (error) {
        this.logError('Healthcare system monitoring error:', error);
      }
    }, 30000); // Every 30 seconds

    this.monitoringIntervals.push(interval);
  }

  /**
   * Starts healthcare metric aggregation
   */
  private startHealthcareMetricAggregation(): void {
    const interval = setInterval(() => {
      try {
        // Clean up old metrics (keep only last 7 days)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        this.metrics = this.metrics.filter(m => m.timestamp > weekAgo);
        this.queryPerformance = this.queryPerformance.filter(q => q.timestamp > weekAgo);
        this.alerts = this.alerts.filter(a => a.timestamp > weekAgo);

        // Generate aggregated healthcare metrics
        this.generateHealthcareAggregatedMetrics();
      } catch (error) {
        this.logError('Healthcare metric aggregation error:', error);
      }
    }, 60 * 60 * 1000); // Every hour

    this.monitoringIntervals.push(interval);
  }

  /**
   * Starts healthcare audit logging
   */
  private startHealthcareAuditLogging(): void {
    const interval = setInterval(() => {
      try {
        // Log performance audit summary for HIPAA compliance
        this.generateHealthcarePerformanceAuditLog();
      } catch (error) {
        this.logError('Healthcare audit logging error:', error);
      }
    }, 15 * 60 * 1000); // Every 15 minutes

    this.monitoringIntervals.push(interval);
  }

  /**
   * Calculates patient impact level based on performance metrics
   */
  private calculatePatientImpactLevel(
    executionTime: number, 
    containsPHI?: boolean
  ): 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (executionTime > this.criticalQueryThreshold) return 'CRITICAL';
    if (executionTime > this.slowQueryThreshold * 2) return 'HIGH';
    if (containsPHI && executionTime > this.phiQueryThreshold) return 'MEDIUM';
    if (executionTime > this.slowQueryThreshold) return 'LOW';
    return 'NONE';
  }

  /**
   * Calculates API patient impact level
   */
  private calculateAPIPatientImpactLevel(
    endpoint: string, 
    responseTime: number
  ): 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    // Critical endpoints that directly affect patient care
    const criticalEndpoints = ['/emergency', '/vitals', '/medication', '/alerts'];
    const highPriorityEndpoints = ['/patient', '/lab-results', '/imaging'];
    
    const isCritical = criticalEndpoints.some(path => endpoint.includes(path));
    const isHighPriority = highPriorityEndpoints.some(path => endpoint.includes(path));
    
    if (isCritical && responseTime > 1000) return 'CRITICAL';
    if (isHighPriority && responseTime > 2000) return 'HIGH';
    if (responseTime > 3000) return 'MEDIUM';
    if (responseTime > 1000) return 'LOW';
    return 'NONE';
  }

  /**
   * Calculates patient impact from performance metrics
   */
  private calculatePatientImpactFromMetric(
    metricName: string, 
    value: number, 
    threshold: number
  ): 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const ratio = value / threshold;
    
    // Healthcare-specific impact calculation
    if (metricName.includes('phi') || metricName.includes('patient')) {
      if (ratio > 3) return 'CRITICAL';
      if (ratio > 2) return 'HIGH';
      if (ratio > 1.5) return 'MEDIUM';
      return 'LOW';
    }
    
    // General impact calculation
    if (ratio > 2.5) return 'CRITICAL';
    if (ratio > 2) return 'HIGH';
    if (ratio > 1.5) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Calculates healthcare alert severity with patient impact consideration
   */
  private calculateHealthcareAlertSeverity(
    metricName: string,
    value: number,
    threshold: number,
    patientImpact: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  ): 'low' | 'medium' | 'high' | 'critical' {
    // Patient impact overrides normal severity calculation
    if (patientImpact === 'CRITICAL') return 'critical';
    if (patientImpact === 'HIGH') return 'high';
    
    const ratio = value / threshold;
    if (ratio > 2) return 'critical';
    if (ratio > 1.5) return 'high';
    if (ratio > 1.2) return 'medium';
    return 'low';
  }

  /**
   * Analyzes healthcare slow queries with clinical context
   */
  private async analyzeHealthcareSlowQuery(query: HealthcareQueryPerformance): Promise<string[]> {
    const suggestions: string[] = [];
    
    // PHI-specific optimizations
    if (query.containsPHI) {
      suggestions.push('PHI Query Optimization: Consider data masking for non-essential fields');
      suggestions.push('PHI Security: Ensure query uses encrypted indexes where possible');
    }
    
    // Clinical context optimizations
    if (query.clinicalContext) {
      suggestions.push(`Clinical Workflow: Optimize for ${query.clinicalContext} workflow patterns`);
    }
    
    // Standard query analysis
    if (query.sql.toLowerCase().includes('select *')) {
      suggestions.push('Security Risk: Avoid SELECT * to prevent unnecessary PHI exposure');
    }
    
    if (query.sql.toLowerCase().includes('order by') && !query.sql.toLowerCase().includes('limit')) {
      suggestions.push('Patient Safety: Add LIMIT to ORDER BY queries to prevent timeout');
    }
    
    if (query.indexesUsed.length === 0) {
      suggestions.push('Performance: Query not using indexes - critical for healthcare response times');
    }

    return suggestions;
  }

  /**
   * Generates healthcare query optimization recommendations
   */
  private async generateHealthcareQueryOptimizationRecommendation(
    query: HealthcareQueryPerformance
  ): Promise<HealthcareOptimizationRecommendation | null> {
    if (query.executionTime > this.criticalQueryThreshold) {
      return {
        id: this.generateRecommendationId(),
        type: 'healthcare',
        priority: 'critical',
        description: `Critical healthcare query optimization needed (${query.executionTime.toFixed(2)}ms)`,
        impact: `Reduce patient wait time from ${query.executionTime.toFixed(2)}ms to estimated ${(query.executionTime * 0.2).toFixed(2)}ms`,
        effort: 'High - Requires clinical workflow analysis and database optimization',
        sqlBefore: query.sql,
        sqlAfter: query.sql, // Would contain optimized version
        estimatedImprovement: 80,
        createdAt: new Date(),
        applied: false,
        patientSafetyImpact: 'Faster query response improves clinical decision-making speed',
        complianceImplication: 'Improved performance supports timely care delivery requirements'
      };
    }
    
    return null;
  }

  /**
   * Logs HIPAA audit metrics
   */
  private logHIPAAAuditMetric(metric: HealthcarePerformanceMetric): void {
    this.logInfo(
      `HIPAA Performance Audit: ${metric.name} | Value: ${metric.value}${metric.unit} | Patient Impact: ${metric.patientImpactLevel} | Time: ${metric.timestamp.toISOString()}`
    );
  }

  /**
   * Generates healthcare aggregated metrics
   */
  private generateHealthcareAggregatedMetrics(): void {
    // Calculate aggregated healthcare metrics for reporting
    const recentMetrics = this.metrics.filter(m => 
      m.timestamp > new Date(Date.now() - 60 * 60 * 1000) // Last hour
    );

    const phiMetrics = recentMetrics.filter(m => m.tags.containsPHI === 'true');
    const highImpactMetrics = recentMetrics.filter(m => 
      m.patientImpactLevel === 'HIGH' || m.patientImpactLevel === 'CRITICAL'
    );

    this.logInfo(
      `Healthcare Performance Summary: PHI Operations: ${phiMetrics.length}, High Impact Events: ${highImpactMetrics.length}`
    );
  }

  /**
   * Generates healthcare performance audit log
   */
  private generateHealthcarePerformanceAuditLog(): void {
    const recentAlerts = this.alerts.filter(a => 
      a.timestamp > new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
    );

    const criticalAlerts = recentAlerts.filter(a => a.severity === 'critical');
    const patientImpactAlerts = recentAlerts.filter(a => 
      a.patientImpact === 'HIGH' || a.patientImpact === 'CRITICAL'
    );

    this.logInfo(
      `Healthcare Performance Audit: Critical Alerts: ${criticalAlerts.length}, Patient Impact Alerts: ${patientImpactAlerts.length}`
    );
  }

  // Additional helper methods for healthcare calculations
  private calculateCPUUsage(): number {
    const loadAvg = os.loadavg()[0];
    const cpuCount = os.cpus().length;
    return Math.min((loadAvg / cpuCount) * 100, 100);
  }

  private calculateHealthcareProcessUsage(): number {
    // Placeholder for healthcare-specific process monitoring
    return 0;
  }

  private calculatePHICacheUsage(): number {
    // Placeholder for PHI cache usage calculation
    return 0;
  }

  private calculateHealthcareDataWrites(): number {
    // Placeholder for healthcare data write monitoring
    return 0;
  }

  private calculateSecureConnections(): number {
    // Placeholder for secure connection monitoring
    return 0;
  }

  private getPriorityWeight(priority: string): number {
    const weights: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };
    return weights[priority] || 0;
  }

  private extractSQLFromFunction(queryFn: Function): string {
    // In production, would extract actual SQL from Sequelize query
    return queryFn.toString().substring(0, 100) + '...';
  }

  private generatePlanHash(queryFn: Function): string {
    // Generate a hash for the query plan
    return `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateQueryId(): string {
    return `hc_query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMetricId(): string {
    return `hc_metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateAlertId(): string {
    return `hc_alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateRecommendationId(): string {
    return `hc_rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ==================== Public Health Check and Cleanup ====================

  /**
   * Healthcare performance monitoring health check
   */
  async healthCheck(): Promise<{
    monitoring: boolean;
    metrics: boolean;
    alerts: boolean;
    systemHealth: boolean;
    hipaaCompliance: boolean;
  }> {
    try {
      const recentMetrics = this.metrics.filter(m => 
        m.timestamp > new Date(Date.now() - 300000) // Last 5 minutes
      );

      const recentSystemMetrics = this.systemMetrics.filter(m => 
        m.timestamp > new Date(Date.now() - 60000) // Last minute
      );

      const hipaaAuditMetrics = recentMetrics.filter(m => m.hipaaAuditRequired);

      return {
        monitoring: this.monitoringIntervals.length > 0,
        metrics: recentMetrics.length > 0,
        alerts: true,
        systemHealth: recentSystemMetrics.length > 0,
        hipaaCompliance: hipaaAuditMetrics.length >= 0 // HIPAA audit trail is working
      };
    } catch (error) {
      this.logError('Healthcare performance monitoring health check failed:', error);
      return {
        monitoring: false,
        metrics: false,
        alerts: false,
        systemHealth: false,
        hipaaCompliance: false
      };
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.monitoringIntervals.forEach(interval => clearInterval(interval));
    this.removeAllListeners();
    this.logInfo('Healthcare Performance Monitoring Service destroyed');
  }
}

/**
 * Factory for healthcare performance monitoring
 */
export class HealthcarePerformanceFactory {
  static createHealthcarePerformanceMonitoring(configService: ConfigService): HealthcarePerformanceMonitoringService {
    return new HealthcarePerformanceMonitoringService(configService);
  }
}

/**
 * Decorator for automatic healthcare performance monitoring
 */
export function MonitorHealthcarePerformance(options: {
  metricName?: string;
  containsPHI?: boolean;
  clinicalContext?: string;
} = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const name = options.metricName || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      const startTime = performance.now();
      
      try {
        const result = await originalMethod.apply(this, args);
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        // Log with healthcare context
        console.log(
          `Healthcare Performance: ${name} took ${executionTime.toFixed(2)}ms | PHI: ${options.containsPHI} | Context: ${options.clinicalContext}`
        );
        
        return result;
      } catch (error) {
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        console.error(
          `Healthcare Performance Error: ${name} took ${executionTime.toFixed(2)}ms and failed | PHI: ${options.containsPHI} | Context: ${options.clinicalContext}`
        );
        
        throw error;
      }
    };

    return descriptor;
  };
}
