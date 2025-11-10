/**
 * @fileoverview Audit Log Interface
 * @module interfaces/models/audit-log
 * @description Comprehensive audit trail and compliance logging
 */

import { IBaseEntity } from './base-entity.interface';
import { AuditAction } from '../enums/common-types.enum';

/**
 * Audit log interface for compliance and security tracking
 */
export interface IAuditLog extends IBaseEntity {
  /** Action performed */
  action: AuditAction;

  /** Resource type affected */
  resourceType: string;

  /** Resource ID affected */
  resourceId?: string;

  /** Resource name/identifier (for display) */
  resourceName?: string;

  /** User who performed action */
  userId: string;

  /** User name (denormalized for reporting) */
  userName?: string;

  /** User email (denormalized) */
  userEmail?: string;

  /** User role at time of action */
  userRole?: string;

  /** IP address */
  ipAddress: string;

  /** User agent */
  userAgent?: string;

  /** Session ID */
  sessionId?: string;

  /** Request ID (for tracing) */
  requestId?: string;

  /** HTTP method */
  httpMethod?: string;

  /** URL/endpoint */
  url?: string;

  /** Action result */
  result: 'SUCCESS' | 'FAILURE' | 'PARTIAL';

  /** Error message (if failed) */
  errorMessage?: string;

  /** Status code */
  statusCode?: number;

  /** Duration in milliseconds */
  durationMs?: number;

  /** Old values (before change) */
  oldValues?: Record<string, any>;

  /** New values (after change) */
  newValues?: Record<string, any>;

  /** Changed fields */
  changedFields?: string[];

  /** Reason for action (for sensitive operations) */
  reason?: string;

  /** Additional context */
  context?: IAuditContext;

  /** Compliance framework */
  complianceFramework?: ('HIPAA' | 'GDPR' | 'SOC2' | 'PCI_DSS' | 'ISO27001')[];

  /** Risk level of action */
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  /** Severity */
  severity?: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

  /** Is sensitive operation */
  isSensitive?: boolean;

  /** Approval required */
  approvalRequired?: boolean;

  /** Approved by */
  approvedBy?: string;

  /** Approval timestamp */
  approvedAt?: Date;

  /** Tags for categorization */
  tags?: string[];

  /** Correlation ID (for related actions) */
  correlationId?: string;

  /** Parent audit log ID (for nested operations) */
  parentId?: string;

  /** Geographic location */
  geoLocation?: IGeoLocation;

  /** Device information */
  device?: IDeviceInfo;

  /** Retention period (days) */
  retentionDays?: number;

  /** Archived */
  archived?: boolean;

  /** Archive date */
  archivedAt?: Date;
}

/**
 * Audit context information
 */
export interface IAuditContext {
  /** Business context */
  businessContext?: string;

  /** Application name */
  application?: string;

  /** Module/feature */
  module?: string;

  /** Tenant ID (multi-tenancy) */
  tenantId?: string;

  /** Organization ID */
  organizationId?: string;

  /** Department */
  department?: string;

  /** Environment */
  environment?: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT' | 'TEST';

  /** API version */
  apiVersion?: string;

  /** Client application */
  clientApp?: string;

  /** Client version */
  clientVersion?: string;

  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Geographic location
 */
export interface IGeoLocation {
  /** Country code */
  countryCode?: string;

  /** Country name */
  country?: string;

  /** Region/state */
  region?: string;

  /** City */
  city?: string;

  /** Latitude */
  latitude?: number;

  /** Longitude */
  longitude?: number;

  /** Timezone */
  timezone?: string;
}

/**
 * Device information
 */
export interface IDeviceInfo {
  /** Device type */
  type: 'DESKTOP' | 'MOBILE' | 'TABLET' | 'SERVER' | 'IOT' | 'OTHER';

  /** Operating system */
  os?: string;

  /** OS version */
  osVersion?: string;

  /** Browser */
  browser?: string;

  /** Browser version */
  browserVersion?: string;

  /** Device model */
  model?: string;

  /** Device fingerprint */
  fingerprint?: string;

  /** Is trusted device */
  isTrusted?: boolean;
}

/**
 * Audit log query filters
 */
export interface IAuditLogFilters {
  /** User ID filter */
  userId?: string;

  /** Resource type filter */
  resourceType?: string;

  /** Resource ID filter */
  resourceId?: string;

  /** Action filter */
  action?: AuditAction[];

  /** Result filter */
  result?: ('SUCCESS' | 'FAILURE' | 'PARTIAL')[];

  /** Date range - start */
  startDate?: Date;

  /** Date range - end */
  endDate?: Date;

  /** IP address filter */
  ipAddress?: string;

  /** Risk level filter */
  riskLevel?: ('LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL')[];

  /** Compliance framework filter */
  complianceFramework?: ('HIPAA' | 'GDPR' | 'SOC2' | 'PCI_DSS' | 'ISO27001')[];

  /** Tags filter */
  tags?: string[];

  /** Search term */
  searchTerm?: string;
}

/**
 * Audit log statistics
 */
export interface IAuditLogStatistics {
  /** Total logs */
  totalLogs: number;

  /** Logs by action */
  byAction: Record<string, number>;

  /** Logs by result */
  byResult: Record<string, number>;

  /** Logs by user */
  byUser: Record<string, number>;

  /** Logs by resource type */
  byResourceType: Record<string, number>;

  /** Logs by risk level */
  byRiskLevel: Record<string, number>;

  /** Top users */
  topUsers: Array<{ userId: string; count: number }>;

  /** Top actions */
  topActions: Array<{ action: string; count: number }>;

  /** Failed actions */
  failedActions: number;

  /** Suspicious activities */
  suspiciousActivities: number;

  /** Time range */
  timeRange: {
    start: Date;
    end: Date;
  };
}
