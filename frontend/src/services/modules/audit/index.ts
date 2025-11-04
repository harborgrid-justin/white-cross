/**
 * @fileoverview Audit API Module - Main Entry Point
 * @module services/modules/audit
 * @category Services - Audit & Security Monitoring
 *
 * Provides comprehensive audit logging, security monitoring, and compliance reporting
 * capabilities for the White Cross healthcare platform. Implements HIPAA-compliant
 * audit trails, PHI access tracking, security analysis, and anomaly detection.
 *
 * This module has been refactored into specialized sub-services while maintaining
 * full backward compatibility with the original monolithic API.
 *
 * Key Features:
 * - Comprehensive audit log retrieval and filtering
 * - PHI (Protected Health Information) access logging
 * - Security incident analysis and monitoring
 * - Anomaly detection and alerting
 * - User activity tracking and reporting
 * - Session-based audit trail analysis
 * - Compliance report generation
 * - Data access logs for specific resources
 * - Audit log export (CSV, PDF, JSON)
 * - Log archival and retention management
 *
 * HIPAA Audit Requirements:
 * - All PHI access must be logged (who, what, when, why)
 * - Minimum 6-year audit trail retention
 * - Access logs must include IP address and user agent
 * - Automatic audit log backup and protection
 * - Tamper-evident logging mechanisms
 * - Regular audit log review workflows
 * - Breach notification support with audit evidence
 *
 * @example Query PHI access logs
 * ```typescript
 * import { auditApi } from '@/services/modules/audit';
 *
 * const phiLogs = await auditApi.getPHIAccessLogs({
 *   studentId: 'student-uuid-123',
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31',
 *   page: 1,
 *   limit: 50
 * });
 * console.log(`PHI accessed ${phiLogs.total} times this month`);
 * ```
 *
 * @example Run security analysis
 * ```typescript
 * const analysis = await auditApi.runSecurityAnalysis({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 * console.log(`Anomalies detected: ${analysis.anomalies.length}`);
 * ```
 *
 * @see {@link complianceApi} for compliance report management
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations HIPAA Security Rule}
 */

import type { ApiClient } from '../../core/ApiClient';
import { AuditLoggingService } from './logging';
import { PHIAccessService } from './phi-access';
import { SecurityAnalysisService } from './security';
import { ComplianceReportingService } from './compliance';
import { AuditQueryService } from './queries';
import { AuditExportService } from './exports';

// Re-export all types
export * from './types';

/**
 * Unified Audit API
 * Aggregates all audit-related services into a single API interface
 * Maintains backward compatibility with the original monolithic API
 */
export class AuditApi {
  private readonly loggingService: AuditLoggingService;
  private readonly phiAccessService: PHIAccessService;
  private readonly securityService: SecurityAnalysisService;
  private readonly complianceService: ComplianceReportingService;
  private readonly queryService: AuditQueryService;
  private readonly exportService: AuditExportService;

  constructor(client: ApiClient) {
    this.loggingService = new AuditLoggingService(client);
    this.phiAccessService = new PHIAccessService(client);
    this.securityService = new SecurityAnalysisService(client);
    this.complianceService = new ComplianceReportingService(client);
    this.queryService = new AuditQueryService(client);
    this.exportService = new AuditExportService(client);
  }

  // ==========================================
  // Audit Logging Operations
  // ==========================================

  /**
   * Get audit logs with filters
   * @see AuditLoggingService.getLogs
   */
  async getLogs(...args: Parameters<typeof this.loggingService.getLogs>) {
    return this.loggingService.getLogs(...args);
  }

  /**
   * Get specific audit log by ID
   * @see AuditLoggingService.getLogById
   */
  async getLogById(...args: Parameters<typeof this.loggingService.getLogById>) {
    return this.loggingService.getLogById(...args);
  }

  /**
   * Create audit log (typically done automatically by backend)
   * @see AuditLoggingService.createLog
   */
  async createLog(...args: Parameters<typeof this.loggingService.createLog>) {
    return this.loggingService.createLog(...args);
  }

  // ==========================================
  // PHI Access Logging Operations
  // ==========================================

  /**
   * Get PHI access logs
   * @see PHIAccessService.getPHIAccessLogs
   */
  async getPHIAccessLogs(...args: Parameters<typeof this.phiAccessService.getPHIAccessLogs>) {
    return this.phiAccessService.getPHIAccessLogs(...args);
  }

  /**
   * Log PHI access (typically done automatically by backend)
   * @see PHIAccessService.logPHIAccess
   */
  async logPHIAccess(...args: Parameters<typeof this.phiAccessService.logPHIAccess>) {
    return this.phiAccessService.logPHIAccess(...args);
  }

  // ==========================================
  // Security Analysis Operations
  // ==========================================

  /**
   * Get security analysis
   * @see SecurityAnalysisService.getSecurityAnalysis
   */
  async getSecurityAnalysis(...args: Parameters<typeof this.securityService.getSecurityAnalysis>) {
    return this.securityService.getSecurityAnalysis(...args);
  }

  /**
   * Run security analysis
   * @see SecurityAnalysisService.runSecurityAnalysis
   */
  async runSecurityAnalysis(...args: Parameters<typeof this.securityService.runSecurityAnalysis>) {
    return this.securityService.runSecurityAnalysis(...args);
  }

  /**
   * Get anomalies
   * @see SecurityAnalysisService.getAnomalies
   */
  async getAnomalies(...args: Parameters<typeof this.securityService.getAnomalies>) {
    return this.securityService.getAnomalies(...args);
  }

  // ==========================================
  // Compliance Reporting Operations
  // ==========================================

  /**
   * Get compliance report
   * @see ComplianceReportingService.getComplianceReport
   */
  async getComplianceReport(...args: Parameters<typeof this.complianceService.getComplianceReport>) {
    return this.complianceService.getComplianceReport(...args);
  }

  // ==========================================
  // Query Operations
  // ==========================================

  /**
   * Get audit statistics
   * @see AuditQueryService.getStatistics
   */
  async getStatistics(...args: Parameters<typeof this.queryService.getStatistics>) {
    return this.queryService.getStatistics(...args);
  }

  /**
   * Get user activity logs
   * @see AuditQueryService.getUserActivity
   */
  async getUserActivity(...args: Parameters<typeof this.queryService.getUserActivity>) {
    return this.queryService.getUserActivity(...args);
  }

  /**
   * Get session audit data
   * @see AuditQueryService.getSessionAudit
   */
  async getSessionAudit(...args: Parameters<typeof this.queryService.getSessionAudit>) {
    return this.queryService.getSessionAudit(...args);
  }

  /**
   * Get data access logs for a specific resource
   * @see AuditQueryService.getDataAccessLogs
   */
  async getDataAccessLogs(...args: Parameters<typeof this.queryService.getDataAccessLogs>) {
    return this.queryService.getDataAccessLogs(...args);
  }

  // ==========================================
  // Export and Archive Operations
  // ==========================================

  /**
   * Export audit logs
   * @see AuditExportService.exportLogs
   */
  async exportLogs(...args: Parameters<typeof this.exportService.exportLogs>) {
    return this.exportService.exportLogs(...args);
  }

  /**
   * Archive old logs
   * @see AuditExportService.archiveLogs
   */
  async archiveLogs(...args: Parameters<typeof this.exportService.archiveLogs>) {
    return this.exportService.archiveLogs(...args);
  }
}

/**
 * Factory function to create Audit API instance
 * @param client - ApiClient instance with authentication and resilience patterns
 * @returns Configured AuditApi instance
 */
export function createAuditApi(client: ApiClient): AuditApi {
  return new AuditApi(client);
}

// Export singleton instance for backward compatibility
import { apiClient } from '../../core/ApiClient';
export const auditApi = createAuditApi(apiClient);
