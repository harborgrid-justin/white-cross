/**
 * Audit API Module
 * Provides frontend access to audit logging and compliance endpoints
 */

import { apiInstance } from '../config/apiConfig';
import { ApiResponse, PaginatedResponse, buildPaginationParams, buildUrlParams } from '../utils/apiUtils';

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
  /**
   * Get audit logs with filters
   */
  async getLogs(filters?: AuditFilters): Promise<PaginatedResponse<AuditLog>> {
    const params = buildPaginationParams(filters?.page, filters?.limit);
    const allParams = filters ? Object.assign({}, params, filters) : params;
    const response = await apiInstance.get<PaginatedResponse<AuditLog>>(
      '/api/v1/audit/logs',
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Get specific audit log by ID
   */
  async getLogById(logId: string): Promise<AuditLog> {
    const response = await apiInstance.get<ApiResponse<AuditLog>>(
      `/api/v1/audit/logs/${logId}`
    );
    return response.data.data!;
  }

  /**
   * Create audit log (typically done automatically by backend)
   */
  async createLog(logData: Partial<AuditLog>): Promise<AuditLog> {
    const response = await apiInstance.post<ApiResponse<AuditLog>>(
      '/api/v1/audit/logs',
      logData
    );
    return response.data.data!;
  }

  /**
   * Get PHI access logs
   */
  async getPHIAccessLogs(filters?: PHIAccessFilters): Promise<PaginatedResponse<PHIAccessLog>> {
    const params = buildPaginationParams(filters?.page, filters?.limit);
    const allParams = filters ? Object.assign({}, params, filters) : params;
    const response = await apiInstance.get<PaginatedResponse<PHIAccessLog>>(
      '/api/v1/audit/phi-access',
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Log PHI access (typically done automatically by backend)
   */
  async logPHIAccess(accessData: Partial<PHIAccessLog>): Promise<PHIAccessLog> {
    const response = await apiInstance.post<ApiResponse<PHIAccessLog>>(
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
    const response = await apiInstance.get<ApiResponse<AuditStatistics>>(
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
    const response = await apiInstance.get<ApiResponse<UserActivity>>(
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
    const response = await apiInstance.get(
      '/api/v1/audit/export',
      { 
        params,
        responseType: 'blob'
      }
    );
    return response.data;
  }

  /**
   * Get security analysis
   */
  async getSecurityAnalysis(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<SecurityAnalysis> {
    const response = await apiInstance.get<ApiResponse<SecurityAnalysis>>(
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
    const response = await apiInstance.post<ApiResponse<SecurityAnalysis>>(
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
    const response = await apiInstance.get<ApiResponse<ComplianceReport>>(
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
    const response = await apiInstance.get<ApiResponse<Anomaly[]>>(
      '/api/v1/audit/anomalies',
      { params }
    );
    return response.data.data || [];
  }

  /**
   * Get session audit data
   */
  async getSessionAudit(sessionId: string): Promise<SessionAudit> {
    const response = await apiInstance.get<ApiResponse<SessionAudit>>(
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
    const response = await apiInstance.get<ApiResponse<DataAccessLog[]>>(
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
    const response = await apiInstance.post<ApiResponse<{ success: boolean; archivedCount: number }>>(
      '/api/v1/audit/logs/archive',
      params
    );
    return response.data.data!;
  }
}

// Export singleton instance
export const auditApi = new AuditApi();
