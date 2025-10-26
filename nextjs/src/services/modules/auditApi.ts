/**
 * @fileoverview Audit Logging and Security Monitoring API service
 * @module services/modules/auditApi
 * @category Services - Audit & Security Monitoring
 *
 * Provides comprehensive audit logging, security monitoring, and compliance reporting
 * capabilities for the White Cross healthcare platform. Implements HIPAA-compliant
 * audit trails, PHI access tracking, security analysis, and anomaly detection.
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
 * PHI Access Logging:
 * - Automatic logging of all PHI read operations
 * - Access reason documentation (emergency, treatment, administrative)
 * - Data fields accessed tracking
 * - Student-level access aggregation
 * - Unauthorized access attempt detection
 * - Access pattern analysis for anomalies
 *
 * Security Monitoring:
 * - Real-time security incident detection
 * - Failed authentication attempt tracking
 * - Suspicious activity pattern recognition
 * - Privilege escalation detection
 * - Data exfiltration monitoring
 * - Geographic access anomaly detection
 *
 * Audit Log Types:
 * - Authentication events (login, logout, MFA)
 * - Authorization events (permission checks, role changes)
 * - Data access events (read, create, update, delete)
 * - PHI access events (detailed health information access)
 * - Administrative events (user management, configuration changes)
 * - Security events (failed attempts, anomalies, incidents)
 *
 * Compliance Reporting:
 * - HIPAA compliance reports with audit evidence
 * - Access frequency analysis by user and resource
 * - Compliance score calculation based on audit data
 * - Violation detection and reporting
 * - Regulatory audit support with exportable evidence
 *
 * Anomaly Detection:
 * - Unusual access patterns (time, volume, location)
 * - Unauthorized resource access attempts
 * - Privilege abuse detection
 * - Data download anomalies
 * - Session hijacking indicators
 * - Multi-severity classification (LOW, MEDIUM, HIGH, CRITICAL)
 *
 * @example Query PHI access logs
 * ```typescript
 * import { auditApi } from '@/services/modules/auditApi';
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
 * analysis.anomalies.forEach(anomaly => {
 *   console.log(`${anomaly.severity}: ${anomaly.description}`);
 * });
 * ```
 *
 * @example Export audit logs for compliance
 * ```typescript
 * const blob = await auditApi.exportLogs({
 *   startDate: '2024-01-01',
 *   endDate: '2024-12-31',
 *   format: 'PDF',
 *   filters: { resourceType: 'PHI' }
 * });
 * // Download blob as PDF file for regulatory audit
 * ```
 *
 * @example Track user activity
 * ```typescript
 * const activity = await auditApi.getUserActivity('user-uuid-456', {
 *   startDate: '2025-01-15',
 *   endDate: '2025-01-16'
 * });
 * console.log(`User performed ${activity.totalActions} actions`);
 * ```
 *
 * @see {@link complianceApi} for compliance report management
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations HIPAA Security Rule}
 */

import type { ApiClient } from '../core/ApiClient';
import { ApiResponse, PaginatedResponse } from '../utils/apiUtils';

/**
 * Audit API interfaces
 */
export interface AuditLog {
  id: string;
  userId: string;
  userName?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'SUCCESS' | 'FAILURE' | 'PENDING';
  details?: Record<string, any>;
  timestamp: string;
  sessionId?: string;
}

export interface PHIAccessLog {
  id: string;
  userId: string;
  userName?: string;
  studentId: string;
  studentName?: string;
  accessType: string;
  accessReason?: string;
  dataAccessed: string[];
  ipAddress?: string;
  timestamp: string;
  sessionId?: string;
}

export interface AuditStatistics {
  totalLogs: number;
  successCount: number;
  failureCount: number;
  phiAccessCount: number;
  uniqueUsers: number;
  recentActivity: Array<{
    action: string;
    count: number;
  }>;
}

export interface UserActivity {
  userId: string;
  userName?: string;
  actions: Array<{
    action: string;
    timestamp: string;
    status: string;
    details?: string;
  }>;
  totalActions: number;
}

export interface SecurityAnalysis {
  id: string;
  analysisDate: string;
  anomalies: Array<{
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    userId?: string;
    timestamp: string;
  }>;
  suspiciousActivities: Array<any>;
  recommendations: string[];
}

export interface ComplianceReport {
  reportId: string;
  generatedDate: string;
  period: {
    startDate: string;
    endDate: string;
  };
  complianceScore: number;
  violations: Array<{
    type: string;
    severity: string;
    count: number;
  }>;
  phiAccessSummary: {
    totalAccess: number;
    unauthorizedAttempts: number;
    accessByType: Record<string, number>;
  };
  recommendations: string[];
}

export interface Anomaly {
  id: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  userId?: string;
  userName?: string;
  detectedAt: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface SessionAudit {
  sessionId: string;
  userId: string;
  userName?: string;
  startTime: string;
  endTime?: string;
  ipAddress?: string;
  userAgent?: string;
  actions: AuditLog[];
  phiAccess: PHIAccessLog[];
}

export interface DataAccessLog {
  id: string;
  resourceType: string;
  resourceId: string;
  userId: string;
  userName?: string;
  accessType: 'READ' | 'WRITE' | 'DELETE';
  timestamp: string;
  dataFields: string[];
}

export interface AuditFilters {
  userId?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  status?: 'SUCCESS' | 'FAILURE' | 'PENDING';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PHIAccessFilters {
  userId?: string;
  studentId?: string;
  accessType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Audit API Service
 * Handles all audit logging and compliance related API calls
 */
export class AuditApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get audit logs with filters
   */
  async getLogs(filters?: AuditFilters): Promise<PaginatedResponse<AuditLog>> {
    const paginationParams = {
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 10,
    };
    const allParams = filters ? { ...paginationParams, ...filters } : paginationParams;
    const response = await this.client.get<PaginatedResponse<AuditLog>>(
      '/api/v1/audit/logs',
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Get specific audit log by ID
   */
  async getLogById(logId: string): Promise<AuditLog> {
    const response = await this.client.get<ApiResponse<AuditLog>>(
      `/api/v1/audit/logs/${logId}`
    );
    return response.data.data!;
  }

  /**
   * Create audit log (typically done automatically by backend)
   */
  async createLog(logData: Partial<AuditLog>): Promise<AuditLog> {
    const response = await this.client.post<ApiResponse<AuditLog>>(
      '/api/v1/audit/logs',
      logData
    );
    return response.data.data!;
  }

  /**
   * Get PHI access logs
   */
  async getPHIAccessLogs(filters?: PHIAccessFilters): Promise<PaginatedResponse<PHIAccessLog>> {
    const paginationParams = {
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 10,
    };
    const allParams = filters ? { ...paginationParams, ...filters } : paginationParams;
    const response = await this.client.get<PaginatedResponse<PHIAccessLog>>(
      '/api/v1/audit/phi-access',
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Log PHI access (typically done automatically by backend)
   */
  async logPHIAccess(accessData: Partial<PHIAccessLog>): Promise<PHIAccessLog> {
    const response = await this.client.post<ApiResponse<PHIAccessLog>>(
      '/api/v1/audit/phi-access',
      accessData
    );
    return response.data.data!;
  }

  /**
   * Get audit statistics
   */
  async getStatistics(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<AuditStatistics> {
    const response = await this.client.get<ApiResponse<AuditStatistics>>(
      '/api/v1/audit/statistics',
      { params }
    );
    return response.data.data!;
  }

  /**
   * Get user activity logs
   */
  async getUserActivity(userId: string, params?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<UserActivity> {
    const response = await this.client.get<ApiResponse<UserActivity>>(
      `/api/v1/audit/user/${userId}/activity`,
      { params }
    );
    return response.data.data!;
  }

  /**
   * Export audit logs
   */
  async exportLogs(params?: {
    startDate?: string;
    endDate?: string;
    format?: 'CSV' | 'PDF' | 'JSON';
    filters?: AuditFilters;
  }): Promise<Blob> {
    const response = await this.client.get<Blob>(
      '/api/v1/audit/export',
      {
        params,
        responseType: 'blob'
      }
    );
    // When responseType is 'blob', the response.data contains the Blob directly
    // However, ApiClient wraps it in ApiResponse, so we need to extract it
    return response.data as unknown as Blob;
  }

  /**
   * Get security analysis
   */
  async getSecurityAnalysis(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<SecurityAnalysis> {
    const response = await this.client.get<ApiResponse<SecurityAnalysis>>(
      '/api/v1/audit/security-analysis',
      { params }
    );
    return response.data.data!;
  }

  /**
   * Run security analysis
   */
  async runSecurityAnalysis(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<SecurityAnalysis> {
    const response = await this.client.post<ApiResponse<SecurityAnalysis>>(
      '/api/v1/audit/security-analysis/run',
      params
    );
    return response.data.data!;
  }

  /**
   * Get compliance report
   */
  async getComplianceReport(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ComplianceReport> {
    const response = await this.client.get<ApiResponse<ComplianceReport>>(
      '/api/v1/audit/compliance-report',
      { params }
    );
    return response.data.data!;
  }

  /**
   * Get anomalies
   */
  async getAnomalies(params?: {
    resolved?: boolean;
    severity?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Anomaly[]> {
    const response = await this.client.get<ApiResponse<Anomaly[]>>(
      '/api/v1/audit/anomalies',
      { params }
    );
    return response.data.data || [];
  }

  /**
   * Get session audit data
   */
  async getSessionAudit(sessionId: string): Promise<SessionAudit> {
    const response = await this.client.get<ApiResponse<SessionAudit>>(
      `/api/v1/audit/session/${sessionId}`
    );
    return response.data.data!;
  }

  /**
   * Get data access logs for a specific resource
   */
  async getDataAccessLogs(
    resourceType: string,
    resourceId: string,
    params?: {
      startDate?: string;
      endDate?: string;
    }
  ): Promise<DataAccessLog[]> {
    const response = await this.client.get<ApiResponse<DataAccessLog[]>>(
      `/api/v1/audit/data-access/${resourceType}/${resourceId}`,
      { params }
    );
    return response.data.data || [];
  }

  /**
   * Archive old logs
   */
  async archiveLogs(params: {
    beforeDate: string;
  }): Promise<{ success: boolean; archivedCount: number }> {
    const response = await this.client.post<ApiResponse<{ success: boolean; archivedCount: number }>>(
      '/api/v1/audit/logs/archive',
      params
    );
    return response.data.data!;
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

// Export singleton instance
import { apiClient } from '../core/ApiClient';
export const auditApi = createAuditApi(apiClient);
