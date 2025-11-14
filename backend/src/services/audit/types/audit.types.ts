import { AuditAction } from '../enums/audit-action.enum';
import { PHIAccessType } from '../enums/phi-access-type.enum';
import { PHIDataCategory } from '../enums/phi-data-category.enum';

/**
 * Type-safe request object interface for audit operations
 * Represents HTTP request with relevant properties for audit logging
 */
export interface AuditRequest {
  ip?: string;
  connection?: {
    remoteAddress?: string;
  };
  socket?: {
    remoteAddress?: string;
  };
  headers?: {
    'x-forwarded-for'?: string;
    'x-real-ip'?: string;
    'user-agent'?: string;
  };
  userAgent?: string;
}

/**
 * Filters for querying audit logs
 */
export interface AuditLogFilters {
  userId?: string;
  entityType?: string;
  action?: AuditAction | string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

/**
 * Search criteria for audit logs
 */
export interface AuditLogSearchCriteria {
  keyword: string;
  page?: number;
  limit?: number;
}

/**
 * Filters for PHI access logs
 */
export interface PHIAccessLogFilters {
  userId?: string;
  studentId?: string;
  accessType?: PHIAccessType | string;
  dataCategory?: PHIDataCategory | string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

/**
 * Sequelize where clause type for audit queries
 */
export interface AuditWhereClause {
  userId?: string;
  entityType?: string;
  action?: AuditAction | string;
  createdAt?: {
    [key: symbol]: [Date, Date];
  };
}

/**
 * Statistics for audit actions
 */
export interface ActionStatistic {
  action: string;
  count: number;
}

/**
 * Statistics for entity types
 */
export interface EntityTypeStatistic {
  entityType: string;
  count: number;
}

/**
 * Statistics period
 */
export interface StatisticsPeriod {
  start: Date;
  end: Date;
}

/**
 * Comprehensive audit statistics
 */
export interface AuditStatistics {
  period: StatisticsPeriod;
  totalLogs: number;
  uniqueUsers: number;
  actionDistribution: ActionStatistic[];
  entityTypeDistribution: EntityTypeStatistic[];
}

/**
 * Audit dashboard data
 */
export interface AuditDashboard {
  period: StatisticsPeriod;
  overview: {
    totalLogs: number;
    uniqueUsers: number;
  };
  distributions: {
    actions: ActionStatistic[];
    entityTypes: EntityTypeStatistic[];
  };
}

/**
 * Suspicious IP address information
 */
export interface SuspiciousIP {
  ipAddress: string;
  failedAttempts: number;
}

/**
 * Risk level enumeration
 */
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Suspicious login detection result
 */
export interface SuspiciousLoginDetection {
  period: StatisticsPeriod;
  totalFailedLogins: number;
  suspiciousIPs: SuspiciousIP[];
  riskLevel: RiskLevel;
}

/**
 * Security report findings
 */
export interface SecurityReportFindings {
  suspiciousLogins: SuspiciousLoginDetection;
}

/**
 * Security report summary
 */
export interface SecurityReportSummary {
  totalSecurityEvents: number;
}

/**
 * Comprehensive security report
 */
export interface SecurityReport {
  period: StatisticsPeriod;
  overallRiskLevel: RiskLevel;
  overallRiskScore: number;
  findings: SecurityReportFindings;
  summary: SecurityReportSummary;
}

/**
 * Access statistics by type
 */
export interface AccessByType {
  type: string;
  count: number;
}

/**
 * Access statistics by category
 */
export interface AccessByCategory {
  category: string;
  count: number;
}

/**
 * Compliance report summary
 */
export interface ComplianceReportSummary {
  totalAccess: number;
  failedAccess: number;
  successRate: number;
}

/**
 * HIPAA compliance report
 */
export interface ComplianceReport {
  period: StatisticsPeriod;
  summary: ComplianceReportSummary;
  accessByType: AccessByType[];
  accessByCategory: AccessByCategory[];
}

/**
 * PHI access summary
 */
export interface PHIAccessSummary {
  period: StatisticsPeriod;
  totalAccess: number;
  successfulAccess: number;
  failedAccess: number;
  successRate: number;
}

/**
 * Sequelize query result for action distribution
 */
export interface ActionDistributionQueryResult {
  action: string;
  count: string | number;
}

/**
 * Sequelize query result for entity type distribution
 */
export interface EntityTypeDistributionQueryResult {
  entityType: string;
  count: string | number;
}

/**
 * Sequelize query result for unique users
 */
export interface UniqueUsersQueryResult {
  count: string | number;
}

/**
 * Validation result for audit entries
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Sanitizable data type - represents any object that can be sanitized
 */
export type SanitizableData = Record<string, unknown>;
