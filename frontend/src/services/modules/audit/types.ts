/**
 * @fileoverview Audit API Type Definitions
 * @module services/modules/audit/types
 * @category Services - Audit Types
 *
 * Comprehensive type definitions for audit logging, PHI access tracking,
 * security monitoring, and compliance reporting in the White Cross healthcare platform.
 *
 * These types ensure type safety across all audit-related operations and provide
 * clear contracts for HIPAA-compliant audit logging.
 */

/**
 * Core audit log entry
 * Records all system actions for compliance and security monitoring
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

/**
 * PHI (Protected Health Information) access log
 * HIPAA-compliant tracking of all PHI access events
 */
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

/**
 * Aggregated audit statistics
 * Provides summary metrics for audit activity
 */
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

/**
 * User activity summary
 * Tracks all actions performed by a specific user
 */
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

/**
 * Security analysis results
 * Contains detected anomalies and security recommendations
 */
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

/**
 * Compliance report
 * Comprehensive compliance assessment with metrics and violations
 */
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

/**
 * Security anomaly
 * Detected unusual activity requiring investigation
 */
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

/**
 * Session-based audit trail
 * All actions and PHI access within a single user session
 */
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

/**
 * Data access log
 * Records access to specific data resources
 */
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

/**
 * Audit log filters
 * Query parameters for filtering audit logs
 */
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

/**
 * PHI access log filters
 * Query parameters for filtering PHI access logs
 */
export interface PHIAccessFilters {
  userId?: string;
  studentId?: string;
  accessType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
