/**
 * @fileoverview Health Record Metrics Service
 * @module health-record/services
 * @description Health-specific metrics collection integrating with Enterprise Metrics
 * 
 * HIPAA CRITICAL - This service tracks PHI access patterns for compliance monitoring
 * 
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

import { Injectable, Logger } from '@nestjs/common';
import { EnterpriseMetricsService } from '../../shared/enterprise/services/enterprise-metrics.service';
import { 
  HealthRecordMetrics, 
  HealthRecordOperation, 
  ComplianceLevel 
} from '../interfaces/health-record-types';

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
 * with HIPAA compliance tracking and performance monitoring
 */
@Injectable()
export class HealthRecordMetricsService {
  private readonly logger = new Logger(HealthRecordMetricsService.name);
  private readonly enterpriseMetrics: EnterpriseMetricsService;

  constructor() {
    this.enterpriseMetrics = new EnterpriseMetricsService('health-record');
    this.logger.log('Health Record Metrics Service initialized');
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
    recordCount: number = 1
  ): void {
    // Record operation-specific metrics
    this.enterpriseMetrics.incrementCounter(`phi_operation_${operation.toLowerCase()}`, 1, {
      compliance_level: complianceLevel,
      success: success.toString(),
    });

    // Record compliance level metrics
    this.enterpriseMetrics.incrementCounter('phi_access_by_compliance', recordCount, {
      level: complianceLevel,
    });

    // Record data type access
    dataTypes.forEach(dataType => {
      this.enterpriseMetrics.incrementCounter('phi_access_by_datatype', recordCount, {
        data_type: dataType,
        compliance_level: complianceLevel,
      });
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
      this.logger.warn(
        `High-volume PHI access detected: ${recordCount} records, operation: ${operation}, compliance: ${complianceLevel}`
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
    cached: boolean = false
  ): void {
    // Record operation count
    this.enterpriseMetrics.incrementCounter(`health_record_${operation.toLowerCase()}`, 1, {
      success: success.toString(),
      cached: cached.toString(),
    });

    // Record performance
    this.enterpriseMetrics.recordHistogram(`health_record_${operation.toLowerCase()}_time`, responseTime, {
      success: success.toString(),
    });

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
    success: boolean
  ): void {
    this.enterpriseMetrics.incrementCounter('health_record_search', 1, {
      search_type: searchType,
      success: success.toString(),
    });

    this.enterpriseMetrics.recordGauge('search_results_count', resultsCount, {
      search_type: searchType,
    });

    this.enterpriseMetrics.recordHistogram('search_response_time', responseTime, {
      search_type: searchType,
    });

    // Track large result sets for performance monitoring
    if (resultsCount > 100) {
      this.logger.debug(`Large search result set: ${resultsCount} records, type: ${searchType}`);
    }
  }

  /**
   * Record allergy-related metrics
   */
  recordAllergyOperation(
    operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE',
    severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING',
    responseTime: number,
    success: boolean
  ): void {
    this.enterpriseMetrics.incrementCounter(`allergy_${operation.toLowerCase()}`, 1, {
      severity,
      success: success.toString(),
    });

    // Track critical allergies for safety monitoring
    if (severity === 'LIFE_THREATENING' || severity === 'SEVERE') {
      this.enterpriseMetrics.incrementCounter('critical_allergy_operations', 1, {
        operation,
        severity,
      });

      this.logger.warn(`Critical allergy operation: ${operation} - Severity: ${severity}`);
    }

    this.enterpriseMetrics.recordHistogram(`allergy_${operation.toLowerCase()}_time`, responseTime);
  }

  /**
   * Record vaccination tracking metrics
   */
  recordVaccinationOperation(
    operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE',
    vaccinationType: string,
    seriesComplete: boolean,
    responseTime: number,
    success: boolean
  ): void {
    this.enterpriseMetrics.incrementCounter(`vaccination_${operation.toLowerCase()}`, 1, {
      vaccine_type: vaccinationType,
      series_complete: seriesComplete.toString(),
      success: success.toString(),
    });

    // Track vaccination completion rates
    if (operation === 'CREATE' || operation === 'UPDATE') {
      this.enterpriseMetrics.recordGauge('vaccination_completion_rate', seriesComplete ? 1 : 0, {
        vaccine_type: vaccinationType,
      });
    }

    this.enterpriseMetrics.recordHistogram(`vaccination_${operation.toLowerCase()}_time`, responseTime);
  }

  /**
   * Record security-related metrics
   */
  recordSecurityMetric(
    incidentType: 'unauthorized_access' | 'bulk_phi_access' | 'phi_access_failure' | 'suspicious_pattern',
    count: number = 1,
    additionalLabels?: Record<string, string>
  ): void {
    this.enterpriseMetrics.incrementCounter(`security_incident_${incidentType}`, count, additionalLabels);

    this.enterpriseMetrics.recordSecurityMetrics({
      suspiciousActivities: incidentType.includes('suspicious') ? count : 0,
      blockedRequests: incidentType.includes('unauthorized') ? count : 0,
    });

    // Record compliance violations separately
    if (incidentType.includes('unauthorized')) {
      this.enterpriseMetrics.recordComplianceMetrics({
        accessViolations: count,
      });
    }

    this.logger.warn(`Security metric recorded: ${incidentType}, count: ${count}`);
  }

  /**
   * Record cache performance metrics
   */
  recordCacheMetrics(
    operation: 'HIT' | 'MISS' | 'SET' | 'EVICT',
    cacheType: 'PHI' | 'AGGREGATE' | 'SEARCH',
    responseTime?: number
  ): void {
    this.enterpriseMetrics.incrementCounter(`cache_${operation.toLowerCase()}`, 1, {
      cache_type: cacheType,
    });

    if (responseTime) {
      this.enterpriseMetrics.recordHistogram(`cache_${operation.toLowerCase()}_time`, responseTime, {
        cache_type: cacheType,
      });
    }

    // Update overall cache hit rate for performance metrics
    const hits = this.enterpriseMetrics.getCounter(`cache_hit`);
    const misses = this.enterpriseMetrics.getCounter(`cache_miss`);
    const total = hits + misses;
    
    if (total > 0) {
      const hitRate = hits / total;
      this.enterpriseMetrics.recordPerformanceMetrics({
        cacheHitRate: hitRate,
      });
    }
  }

  /**
   * Get comprehensive health record metrics snapshot
   */
  getHealthRecordMetricsSnapshot(): HealthRecordMetricSnapshot {
    const timestamp = new Date();

    // Calculate PHI operations
    const phiOperations = {
      reads: this.enterpriseMetrics.getCounter('phi_operation_read_health_record') +
             this.enterpriseMetrics.getCounter('phi_operation_get_health_summary'),
      writes: this.enterpriseMetrics.getCounter('phi_operation_create_health_record') +
              this.enterpriseMetrics.getCounter('phi_operation_update_health_record'),
      deletes: this.enterpriseMetrics.getCounter('phi_operation_delete_health_record'),
      exports: this.enterpriseMetrics.getCounter('phi_operation_export_health_data'),
      searches: this.enterpriseMetrics.getCounter('phi_operation_search_health_records'),
    };

    // Calculate compliance levels
    const complianceLevels = {
      phi: this.enterpriseMetrics.getCounter('phi_access_by_compliance') || 0,
      sensitivePhi: this.enterpriseMetrics.getCounter('phi_access_by_compliance') || 0,
      internal: this.enterpriseMetrics.getCounter('phi_access_by_compliance') || 0,
      public: this.enterpriseMetrics.getCounter('phi_access_by_compliance') || 0,
    };

    // Calculate data type access
    const dataTypes = {
      healthRecords: this.enterpriseMetrics.getCounter('phi_access_by_datatype') || 0,
      allergies: this.enterpriseMetrics.getCounter('allergy_read') || 0,
      vaccinations: this.enterpriseMetrics.getCounter('vaccination_read') || 0,
      chronicConditions: this.enterpriseMetrics.getCounter('phi_operation_get_chronic_condition_data') || 0,
      vitalSigns: this.enterpriseMetrics.getCounter('phi_operation_get_vital_signs_data') || 0,
    };

    // Calculate performance metrics
    const responseTimeHist = this.enterpriseMetrics.getHistogram('phi_response_time');
    const cacheHits = this.enterpriseMetrics.getCounter('cache_hit') || 0;
    const cacheMisses = this.enterpriseMetrics.getCounter('cache_miss') || 0;
    const totalRequests = cacheHits + cacheMisses;
    
    const performanceMetrics = {
      averageResponseTime: responseTimeHist?.avg || 0,
      errorRate: this.enterpriseMetrics.getGauge('health_record_error_rate') || 0,
      cacheHitRate: totalRequests > 0 ? cacheHits / totalRequests : 0,
    };

    // Calculate security metrics
    const securityMetrics = {
      securityIncidents: this.enterpriseMetrics.getCounter('security_incident_unauthorized_access') +
                        this.enterpriseMetrics.getCounter('security_incident_bulk_phi_access') || 0,
      suspiciousActivity: this.enterpriseMetrics.getCounter('security_incident_suspicious_pattern') || 0,
      accessViolations: this.enterpriseMetrics.getCounter('security_incident_unauthorized_access') || 0,
    };

    return {
      timestamp,
      phiOperations,
      complianceLevels,
      dataTypes,
      performanceMetrics,
      securityMetrics,
    };
  }

  /**
   * Get Prometheus-formatted metrics for monitoring systems
   */
  getPrometheusMetrics(): string {
    return this.enterpriseMetrics.getPrometheusMetrics();
  }

  /**
   * Get health check status including health record specific checks
   */
  getHealthStatus(): {
    healthy: boolean;
    issues: string[];
    metrics: HealthRecordMetricSnapshot;
  } {
    const enterpriseHealth = this.enterpriseMetrics.getHealthCheck();
    const snapshot = this.getHealthRecordMetricsSnapshot();
    const issues: string[] = [...(enterpriseHealth.status.errors || [])];

    // Health record specific health checks
    if (snapshot.securityMetrics.securityIncidents > 10) {
      issues.push('High number of security incidents detected');
    }

    if (snapshot.performanceMetrics.errorRate > 0.05) { // 5% error rate
      issues.push('High error rate in health record operations');
    }

    if (snapshot.performanceMetrics.cacheHitRate < 0.7) { // 70% cache hit rate
      issues.push('Low cache hit rate affecting performance');
    }

    if (snapshot.performanceMetrics.averageResponseTime > 2000) { // 2 seconds
      issues.push('High average response time for health record operations');
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
    this.logger.warn('Health record metrics have been reset');
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
    const phiAccessCount = this.enterpriseMetrics.getCounter('phi_access_by_compliance') || 0;
    const sensitivePhiAccessCount = this.enterpriseMetrics.getCounter('phi_access_by_compliance') || 0;
    const auditLogEntries = this.enterpriseMetrics.getCounter('compliance_audit_entries') || 0;
    const securityIncidents = this.enterpriseMetrics.getCounter('security_incident_unauthorized_access') || 0;

    // Calculate compliance score (simplified)
    let complianceScore = 100;
    if (securityIncidents > 0) complianceScore -= Math.min(securityIncidents * 5, 50);
    if (auditLogEntries === 0 && phiAccessCount > 0) complianceScore -= 30;

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
    this.logger.log('Health Record Metrics Service destroyed');
  }
}
