/**
 * @fileoverview Health Record Metrics Service
 * @module health-record/services
 * @description Health-specific metrics collection integrating with Enterprise Metrics and database persistence
 *
 * HIPAA CRITICAL - This service tracks PHI access patterns for compliance monitoring with persistent storage
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { EnterpriseMetricsService } from '../../shared/enterprise/services/enterprise-metrics.service';
import { ComplianceLevel, HealthRecordOperation } from '../interfaces/health-record-types';
import { HealthMetricSnapshot   } from "../../database/models";

import { BaseService } from '../../common/base';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
export interface HealthRecordMetricSnapshot {
  timestamp: Date;
  phiOperations: {
    reads: number;
    writes: number;
    deletes: number;
    exports: number;
    searches: number;
  };
  complianceLevels: {
    phi: number;
    sensitivePhi: number;
    internal: number;
    public: number;
  };
  dataTypes: {
    healthRecords: number;
    allergies: number;
    vaccinations: number;
    chronicConditions: number;
    vitalSigns: number;
  };
  performanceMetrics: {
    averageResponseTime: number;
    errorRate: number;
    cacheHitRate: number;
  };
  securityMetrics: {
    securityIncidents: number;
    suspiciousActivity: number;
    accessViolations: number;
  };
}

/**
 * Health Record Metrics Service
 *
 * Provides specialized metrics collection for health record operations
 * with HIPAA compliance tracking and persistent database storage
 */
@Injectable()
export class HealthRecordMetricsService implements OnModuleDestroy {
  private readonly enterpriseMetrics: EnterpriseMetricsService;

  constructor(
    @InjectModel(HealthMetricSnapshot)
    private readonly healthMetricSnapshotModel: typeof HealthMetricSnapshot,
  ) {
    this.enterpriseMetrics = new EnterpriseMetricsService('health-record');
    this.logInfo(
      'Health Record Metrics Service initialized with database persistence',
    );
  }

  /**
   * Record PHI access operation with compliance tracking
   */
  recordPHIAccess(
    operation: HealthRecordOperation,
    complianceLevel: ComplianceLevel,
    dataTypes: string[],
    responseTime: number,
    success: boolean,
    recordCount: number = 1,
  ): void {
    // Record operation-specific metrics
    this.enterpriseMetrics.incrementCounter(
      `phi_operation_${operation.toLowerCase()}`,
      1,
      {
        compliance_level: complianceLevel,
        success: success.toString(),
      },
    );

    // Record compliance level metrics
    this.enterpriseMetrics.incrementCounter(
      'phi_access_by_compliance',
      recordCount,
      {
        level: complianceLevel,
      },
    );

    // Record data type access
    dataTypes.forEach((dataType) => {
      this.enterpriseMetrics.incrementCounter(
        'phi_access_by_datatype',
        recordCount,
        {
          data_type: dataType,
          compliance_level: complianceLevel,
        },
      );
    });

    // Record performance metrics
    this.enterpriseMetrics.recordHistogram('phi_response_time', responseTime, {
      operation,
      compliance_level: complianceLevel,
    });

    // Record PHI-specific compliance metrics
    this.enterpriseMetrics.recordComplianceMetrics({
      phiAccesses: recordCount,
      auditLogEntries: 1,
    });

    // Log high-volume access for monitoring
    if (recordCount > 50) {
      this.logWarning(
        `High-volume PHI access detected: ${recordCount} records, operation: ${operation}, compliance: ${complianceLevel}`,
      );
      this.recordSecurityMetric('bulk_phi_access', 1);
    }

    // Track errors for compliance
    if (!success) {
      this.recordSecurityMetric('phi_access_failure', 1);
    }
  }

  /**
   * Record health record operation metrics
   */
  recordHealthRecordOperation(
    operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE',
    responseTime: number,
    success: boolean,
    cached: boolean = false,
  ): void {
    // Record operation count
    this.enterpriseMetrics.incrementCounter(
      `health_record_${operation.toLowerCase()}`,
      1,
      {
        success: success.toString(),
        cached: cached.toString(),
      },
    );

    // Record performance
    this.enterpriseMetrics.recordHistogram(
      `health_record_${operation.toLowerCase()}_time`,
      responseTime,
      {
        success: success.toString(),
      },
    );

    // Update cache metrics if applicable
    if (operation === 'READ') {
      if (cached) {
        this.enterpriseMetrics.incrementCounter('health_record_cache_hits');
      } else {
        this.enterpriseMetrics.incrementCounter('health_record_cache_misses');
      }
    }

    // Record performance metrics for enterprise monitoring
    this.enterpriseMetrics.recordPerformanceMetrics({
      requestCount: 1,
      averageResponseTime: responseTime,
      errorRate: success ? 0 : 1,
      cacheHitRate: cached ? 1 : 0,
    });
  }

  /**
   * Record search operation metrics
   */
  recordSearchOperation(
    searchType: 'BASIC' | 'ADVANCED' | 'EXPORT',
    resultsCount: number,
    responseTime: number,
    success: boolean,
  ): void {
    this.enterpriseMetrics.incrementCounter('health_record_search', 1, {
      search_type: searchType,
      success: success.toString(),
    });

    this.enterpriseMetrics.recordGauge('search_results_count', resultsCount, {
      search_type: searchType,
    });

    this.enterpriseMetrics.recordHistogram(
      'search_response_time',
      responseTime,
      {
        search_type: searchType,
      },
    );

    // Track large result sets for performance monitoring
    if (resultsCount > 100) {
      this.logDebug(
        `Large search result set: ${resultsCount} records, type: ${searchType}`,
      );
    }
  }

  /**
   * Record allergy-related metrics
   */
  recordAllergyOperation(
    operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE',
    severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING',
    responseTime: number,
    success: boolean,
  ): void {
    this.enterpriseMetrics.incrementCounter(
      `allergy_${operation.toLowerCase()}`,
      1,
      {
        severity: severity.toLowerCase(),
        success: success.toString(),
      },
    );

    this.enterpriseMetrics.recordHistogram(
      `allergy_${operation.toLowerCase()}_time`,
      responseTime,
      {
        severity: severity.toLowerCase(),
      },
    );

    // Track severe allergy operations for compliance
    if (severity === 'LIFE_THREATENING') {
      this.recordSecurityMetric('life_threatening_allergy_operation', 1);
    }
  }

  /**
   * Record vaccination-related metrics
   */
  recordVaccinationOperation(
    operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE',
    vaccineType: string,
    responseTime: number,
    success: boolean,
  ): void {
    this.enterpriseMetrics.incrementCounter(
      `vaccination_${operation.toLowerCase()}`,
      1,
      {
        vaccine_type: vaccineType,
        success: success.toString(),
      },
    );

    this.enterpriseMetrics.recordHistogram(
      `vaccination_${operation.toLowerCase()}_time`,
      responseTime,
      {
        vaccine_type: vaccineType,
      },
    );
  }

  /**
   * Record chronic condition metrics
   */
  recordChronicConditionOperation(
    operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE',
    conditionType: string,
    responseTime: number,
    success: boolean,
  ): void {
    this.enterpriseMetrics.incrementCounter(
      `chronic_condition_${operation.toLowerCase()}`,
      1,
      {
        condition_type: conditionType,
        success: success.toString(),
      },
    );

    this.enterpriseMetrics.recordHistogram(
      `chronic_condition_${operation.toLowerCase()}_time`,
      responseTime,
      {
        condition_type: conditionType,
      },
    );
  }

  /**
   * Record vital signs metrics
   */
  recordVitalSignsOperation(
    operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE',
    vitalType: string,
    responseTime: number,
    success: boolean,
    abnormal: boolean = false,
  ): void {
    this.enterpriseMetrics.incrementCounter(
      `vital_signs_${operation.toLowerCase()}`,
      1,
      {
        vital_type: vitalType,
        success: success.toString(),
        abnormal: abnormal.toString(),
      },
    );

    this.enterpriseMetrics.recordHistogram(
      `vital_signs_${operation.toLowerCase()}_time`,
      responseTime,
      {
        vital_type: vitalType,
      },
    );

    // Track abnormal vital signs for clinical monitoring
    if (abnormal && operation === 'CREATE') {
      this.recordSecurityMetric('abnormal_vital_signs_recorded', 1);
    }
  }

  /**
   * Record security-related metrics
   */
  recordSecurityMetric(
    metricName: string,
    value: number,
    tags?: Record<string, string>,
  ): void {
    this.enterpriseMetrics.incrementCounter(
      `security_${metricName}`,
      value,
      tags,
    );
  }

  /**
   * Store health metrics snapshot to database (runs daily)
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async storeMetricsSnapshot(): Promise<void> {
    try {
      const snapshot = this.getHealthRecordMetricsSnapshot();
      const schoolId = 'system'; // Default system-wide metrics, could be parameterized

      // Store key metrics as database snapshots
      const metricsToStore = [
        {
          metricName: 'phi_reads',
          value: snapshot.phiOperations.reads,
          unit: 'count',
          category: 'phi_operations',
        },
        {
          metricName: 'phi_writes',
          value: snapshot.phiOperations.writes,
          unit: 'count',
          category: 'phi_operations',
        },
        {
          metricName: 'phi_deletes',
          value: snapshot.phiOperations.deletes,
          unit: 'count',
          category: 'phi_operations',
        },
        {
          metricName: 'phi_exports',
          value: snapshot.phiOperations.exports,
          unit: 'count',
          category: 'phi_operations',
        },
        {
          metricName: 'phi_searches',
          value: snapshot.phiOperations.searches,
          unit: 'count',
          category: 'phi_operations',
        },
        {
          metricName: 'average_response_time',
          value: snapshot.performanceMetrics.averageResponseTime,
          unit: 'ms',
          category: 'performance',
        },
        {
          metricName: 'error_rate',
          value: snapshot.performanceMetrics.errorRate * 100, // Convert to percentage
          unit: 'percent',
          category: 'performance',
        },
        {
          metricName: 'cache_hit_rate',
          value: snapshot.performanceMetrics.cacheHitRate * 100, // Convert to percentage
          unit: 'percent',
          category: 'performance',
        },
        {
          metricName: 'security_incidents',
          value: snapshot.securityMetrics.securityIncidents,
          unit: 'count',
          category: 'security',
        },
      ];

      // Bulk create metric snapshots
      const snapshotRecords = metricsToStore.map((metric) => ({
        id: uuidv4(),
        schoolId,
        metricName: metric.metricName,
        value: metric.value,
        unit: metric.unit,
        category: metric.category,
        snapshotDate: snapshot.timestamp,
        metadata: {
          complianceLevels: snapshot.complianceLevels,
          dataTypes: snapshot.dataTypes,
        },
      }));

      await this.healthMetricSnapshotModel.bulkCreate(snapshotRecords);

      this.logInfo(
        `Stored ${snapshotRecords.length} health metrics snapshots for ${snapshot.timestamp.toISOString()}`,
      );
    } catch (error) {
      this.logError('Failed to store health metrics snapshot:', error);
    }
  }

  /**
   * Get historical metrics for a specific school and date range
   */
  async getHistoricalMetrics(
    schoolId: string,
    startDate: Date,
    endDate: Date,
    metricNames?: string[],
  ): Promise<HealthMetricSnapshot[]> {
    try {
      const whereClause: any = {
        schoolId,
        snapshotDate: {
          [Op.between]: [startDate, endDate],
        },
      };

      if (metricNames && metricNames.length > 0) {
        whereClause.metricName = {
          [Op.in]: metricNames,
        };
      }

      const snapshots = await this.healthMetricSnapshotModel.findAll({
        where: whereClause,
        order: [
          ['snapshotDate', 'ASC'],
          ['metricName', 'ASC'],
        ],
      });

      return snapshots;
    } catch (error) {
      this.logError('Failed to retrieve historical metrics:', error);
      return [];
    }
  }

  /**
   * Helper method to get metric value from snapshots array
   */
  private getMetricValue(
    snapshots: HealthMetricSnapshot[],
    metricName: string,
    date: Date,
  ): number {
    const snapshot = snapshots.find(
      (s) =>
        s.metricName === metricName &&
        s.snapshotDate.toISOString() === date.toISOString(),
    );
    return snapshot ? snapshot.value : 0;
  }

  /**
   * Get comprehensive health record metrics snapshot
   */
  getHealthRecordMetricsSnapshot(): HealthRecordMetricSnapshot {
    return {
      timestamp: new Date(),
      phiOperations: {
        reads: this.enterpriseMetrics.getCounter('phi_operation_read') || 0,
        writes:
          this.enterpriseMetrics.getCounter('phi_operation_create') ||
          0 + this.enterpriseMetrics.getCounter('phi_operation_update') ||
          0,
        deletes: this.enterpriseMetrics.getCounter('phi_operation_delete') || 0,
        exports: this.enterpriseMetrics.getCounter('phi_operation_export') || 0,
        searches:
          this.enterpriseMetrics.getCounter('health_record_search') || 0,
      },
      complianceLevels: {
        phi: this.enterpriseMetrics.getCounter('phi_access_phi') || 0,
        sensitivePhi:
          this.enterpriseMetrics.getCounter('phi_access_sensitive_phi') || 0,
        internal: this.enterpriseMetrics.getCounter('phi_access_internal') || 0,
        public: this.enterpriseMetrics.getCounter('phi_access_public') || 0,
      },
      dataTypes: {
        healthRecords:
          this.enterpriseMetrics.getCounter('datatype_health_records') || 0,
        allergies: this.enterpriseMetrics.getCounter('datatype_allergies') || 0,
        vaccinations:
          this.enterpriseMetrics.getCounter('datatype_vaccinations') || 0,
        chronicConditions:
          this.enterpriseMetrics.getCounter('datatype_chronic_conditions') || 0,
        vitalSigns:
          this.enterpriseMetrics.getCounter('datatype_vital_signs') || 0,
      },
      performanceMetrics: {
        averageResponseTime:
          this.enterpriseMetrics.getHistogram('phi_response_time')?.avg || 0,
        errorRate: this.calculateErrorRate(),
        cacheHitRate: this.calculateCacheHitRate(),
      },
      securityMetrics: {
        securityIncidents:
          this.enterpriseMetrics.getCounter(
            'security_incident_unauthorized_access',
          ) || 0,
        suspiciousActivity:
          this.enterpriseMetrics.getCounter('security_bulk_phi_access') ||
          0 +
            this.enterpriseMetrics.getCounter(
              'security_life_threatening_allergy_operation',
            ) ||
          0,
        accessViolations:
          this.enterpriseMetrics.getCounter('security_phi_access_failure') || 0,
      },
    };
  }

  /**
   * Calculate error rate from enterprise metrics
   */
  private calculateErrorRate(): number {
    const totalOperations = this.getTotalOperations();
    const errorOperations =
      this.enterpriseMetrics.getCounter('phi_access_failure') || 0;
    return totalOperations > 0 ? errorOperations / totalOperations : 0;
  }

  /**
   * Calculate cache hit rate
   */
  private calculateCacheHitRate(): number {
    const cacheHits =
      this.enterpriseMetrics.getCounter('health_record_cache_hits') || 0;
    const cacheMisses =
      this.enterpriseMetrics.getCounter('health_record_cache_misses') || 0;
    const totalCacheRequests = cacheHits + cacheMisses;
    return totalCacheRequests > 0 ? cacheHits / totalCacheRequests : 0;
  }

  /**
   * Get total operations count
   */
  private getTotalOperations(): number {
    return (
      (this.enterpriseMetrics.getCounter('phi_operation_read') || 0) +
      (this.enterpriseMetrics.getCounter('phi_operation_create') || 0) +
      (this.enterpriseMetrics.getCounter('phi_operation_update') || 0) +
      (this.enterpriseMetrics.getCounter('phi_operation_delete') || 0) +
      (this.enterpriseMetrics.getCounter('health_record_search') || 0)
    );
  }

  /**
   * Get health record health status
   */
  getHealthStatus(): {
    healthy: boolean;
    issues: string[];
    metrics: HealthRecordMetricSnapshot;
  } {
    const issues: string[] = [];
    const snapshot = this.getHealthRecordMetricsSnapshot();

    // Check error rate
    if (snapshot.performanceMetrics.errorRate > 0.05) {
      // 5% error rate
      issues.push(
        `High error rate: ${(snapshot.performanceMetrics.errorRate * 100).toFixed(2)}%`,
      );
    }

    // Check cache hit rate
    if (snapshot.performanceMetrics.cacheHitRate < 0.7) {
      // 70% cache hit rate
      issues.push(
        `Low cache hit rate: ${(snapshot.performanceMetrics.cacheHitRate * 100).toFixed(2)}%`,
      );
    }

    // Check response time
    if (snapshot.performanceMetrics.averageResponseTime > 2000) {
      // 2 seconds
      issues.push(
        `High average response time: ${snapshot.performanceMetrics.averageResponseTime.toFixed(2)}ms`,
      );
    }

    // Check security incidents
    if (snapshot.securityMetrics.securityIncidents > 10) {
      issues.push(
        `High security incidents: ${snapshot.securityMetrics.securityIncidents}`,
      );
    }

    return {
      healthy: issues.length === 0,
      issues,
      metrics: snapshot,
    };
  }

  /**
   * Reset all metrics (use with caution, mainly for testing)
   */
  resetMetrics(): void {
    this.enterpriseMetrics.reset();
    this.logWarning('Health record metrics have been reset');
  }

  /**
   * Get detailed compliance report
   */
  getComplianceReport(): {
    phiAccessCount: number;
    sensitivePhiAccessCount: number;
    auditLogEntries: number;
    securityIncidents: number;
    complianceScore: number;
  } {
    const phiAccessCount =
      this.enterpriseMetrics.getCounter('phi_access_phi') || 0;
    const sensitivePhiAccessCount =
      this.enterpriseMetrics.getCounter('phi_access_sensitive_phi') || 0;
    const auditLogEntries =
      this.enterpriseMetrics.getCounter('compliance_audit_entries') || 0;
    const securityIncidents =
      this.enterpriseMetrics.getCounter(
        'security_incident_unauthorized_access',
      ) || 0;

    // Calculate compliance score (simplified)
    let complianceScore = 100;
    if (securityIncidents > 0)
      complianceScore -= Math.min(securityIncidents * 5, 50);
    if (auditLogEntries === 0 && phiAccessCount + sensitivePhiAccessCount > 0)
      complianceScore -= 30;

    return {
      phiAccessCount,
      sensitivePhiAccessCount,
      auditLogEntries,
      securityIncidents,
      complianceScore: Math.max(complianceScore, 0),
    };
  }

  /**
   * Cleanup resources when service is destroyed
   */
  onModuleDestroy(): void {
    this.logInfo('Health Record Metrics Service destroyed');
  }

  /**
   * Record cache operation metrics
   */
  recordCacheMetrics(
    operation: 'HIT' | 'MISS' | 'SET',
    cacheType: string,
    responseTime: number,
  ): void {
    const metricKey = operation === 'HIT' ? 'cache_hits' : 'cache_misses';

    this.enterpriseMetrics.incrementCounter(metricKey, 1, {
      cache_type: cacheType,
    });
    this.enterpriseMetrics.recordHistogram(
      'cache_response_time',
      responseTime,
      {
        cache_type: cacheType,
        operation: operation.toLowerCase(),
      },
    );

    this.logDebug(
      `Cache ${operation.toLowerCase()} recorded for type: ${cacheType}, response time: ${responseTime}ms`,
    );
  }

  /**
   * Get Prometheus-formatted metrics for external monitoring
   */
  getPrometheusMetrics(): string {
    return this.enterpriseMetrics.getPrometheusMetrics();
  }
}
