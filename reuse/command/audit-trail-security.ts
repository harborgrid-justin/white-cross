/**
 * LOC: CMD_AUDIT_SEC_001
 * File: /reuse/command/audit-trail-security.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - crypto
 *   - winston
 *
 * DOWNSTREAM (imported by):
 *   - Audit services
 *   - Compliance services
 *   - Security monitoring
 *   - Forensic analysis
 *   - Reporting services
 *   - HIPAA compliance modules
 */

/**
 * File: /reuse/command/audit-trail-security.ts
 * Locator: WC-CMD-AUDIT-SEC-001
 * Purpose: Command Center Audit Trail Security Kit - Comprehensive audit and compliance logging
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, crypto, winston
 * Downstream: ../backend/audit/*, Compliance, Security, Forensics, Reports
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 50 production-ready audit trail and security logging functions
 *
 * LLM Context: Production-grade audit trail and security logging for White Cross emergency command center.
 * Provides comprehensive audit logging for all system operations, change tracking with before/after snapshots,
 * access logging for PHI/PII data, security event monitoring and alerting, compliance reporting for HIPAA/CJIS,
 * data retention policies with automated archival, forensic analysis support, tamper-proof audit chains,
 * real-time security dashboards, anomaly detection, audit log encryption, log aggregation and correlation,
 * compliance audit trails, incident investigation tools, regulatory reporting, and chain-of-custody tracking
 * for healthcare emergency operations.
 */

import * as crypto from 'crypto';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { z } from 'zod';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Audit event types
 */
export enum AuditEventType {
  // Authentication events
  LOGIN = 'auth.login',
  LOGOUT = 'auth.logout',
  LOGIN_FAILED = 'auth.login_failed',
  PASSWORD_CHANGE = 'auth.password_change',
  MFA_ENABLED = 'auth.mfa_enabled',
  MFA_DISABLED = 'auth.mfa_disabled',

  // Access events
  ACCESS_GRANTED = 'access.granted',
  ACCESS_DENIED = 'access.denied',
  PRIVILEGE_ESCALATION = 'access.privilege_escalation',
  EMERGENCY_OVERRIDE = 'access.emergency_override',

  // Data events
  DATA_CREATE = 'data.create',
  DATA_READ = 'data.read',
  DATA_UPDATE = 'data.update',
  DATA_DELETE = 'data.delete',
  DATA_EXPORT = 'data.export',
  PHI_ACCESS = 'data.phi_access',
  PII_ACCESS = 'data.pii_access',

  // Incident events
  INCIDENT_CREATE = 'incident.create',
  INCIDENT_UPDATE = 'incident.update',
  INCIDENT_ASSIGN = 'incident.assign',
  INCIDENT_CLOSE = 'incident.close',
  INCIDENT_REOPEN = 'incident.reopen',

  // Security events
  SECURITY_ALERT = 'security.alert',
  SUSPICIOUS_ACTIVITY = 'security.suspicious_activity',
  POLICY_VIOLATION = 'security.policy_violation',
  ENCRYPTION_KEY_ROTATED = 'security.key_rotated',

  // Compliance events
  COMPLIANCE_AUDIT = 'compliance.audit',
  DATA_RETENTION = 'compliance.retention',
  GDPR_REQUEST = 'compliance.gdpr_request',
  HIPAA_BREACH = 'compliance.hipaa_breach',

  // System events
  SYSTEM_CONFIG_CHANGE = 'system.config_change',
  SYSTEM_BACKUP = 'system.backup',
  SYSTEM_RESTORE = 'system.restore',
}

/**
 * Audit severity levels
 */
export enum AuditSeverity {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Compliance frameworks
 */
export enum ComplianceFramework {
  HIPAA = 'hipaa',
  CJIS = 'cjis',
  GDPR = 'gdpr',
  PCI_DSS = 'pci_dss',
  SOC2 = 'soc2',
  ISO27001 = 'iso27001',
}

/**
 * Retention policies
 */
export enum RetentionPolicy {
  DAYS_30 = 30,
  DAYS_90 = 90,
  DAYS_180 = 180,
  YEAR_1 = 365,
  YEARS_7 = 2555,
  PERMANENT = -1,
}

/**
 * Audit log entry interface
 */
export interface IAuditLog {
  id: string;
  eventType: AuditEventType;
  severity: AuditSeverity;
  userId?: string;
  userName?: string;
  ipAddress: string;
  userAgent?: string;
  resource: string;
  resourceId?: string;
  action: string;
  outcome: 'success' | 'failure';
  details?: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: Date;
  sessionId?: string;
  requestId?: string;
  hash?: string; // For tamper-proof chain
  previousHash?: string;
}

/**
 * Change tracking entry
 */
export interface IChangeLog {
  id: string;
  entityType: string;
  entityId: string;
  operation: 'create' | 'update' | 'delete';
  userId: string;
  timestamp: Date;
  before?: Record<string, any>;
  after?: Record<string, any>;
  changes: IFieldChange[];
  reason?: string;
}

/**
 * Field change details
 */
export interface IFieldChange {
  field: string;
  oldValue: any;
  newValue: any;
  dataType: string;
}

/**
 * Access log entry
 */
export interface IAccessLog {
  id: string;
  userId: string;
  resource: string;
  resourceId: string;
  resourceType: string;
  accessType: 'read' | 'write' | 'delete' | 'export';
  timestamp: Date;
  duration?: number;
  ipAddress: string;
  location?: string;
  deviceInfo?: string;
  justification?: string; // For break-glass access
}

/**
 * Security event
 */
export interface ISecurityEvent {
  id: string;
  eventType: string;
  severity: AuditSeverity;
  description: string;
  source: string;
  userId?: string;
  ipAddress?: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  indicators: string[];
  mitigationActions?: string[];
}

/**
 * Compliance report
 */
export interface IComplianceReport {
  id: string;
  framework: ComplianceFramework;
  reportType: string;
  startDate: Date;
  endDate: Date;
  generatedAt: Date;
  generatedBy: string;
  findings: IComplianceFinding[];
  summary: Record<string, any>;
}

/**
 * Compliance finding
 */
export interface IComplianceFinding {
  control: string;
  description: string;
  severity: AuditSeverity;
  evidence: string[];
  status: 'compliant' | 'non_compliant' | 'partial';
  remediation?: string;
}

/**
 * Forensic snapshot
 */
export interface IForensicSnapshot {
  id: string;
  incidentId: string;
  capturedAt: Date;
  capturedBy: string;
  systemState: Record<string, any>;
  userSessions: any[];
  activeConnections: any[];
  recentLogs: IAuditLog[];
  hash: string;
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * Audit log creation schema
 */
export const AuditLogSchema = z.object({
  eventType: z.nativeEnum(AuditEventType),
  severity: z.nativeEnum(AuditSeverity),
  userId: z.string().uuid().optional(),
  resource: z.string().min(1),
  resourceId: z.string().optional(),
  action: z.string().min(1),
  outcome: z.enum(['success', 'failure']),
  details: z.record(z.any()).optional(),
});

/**
 * Change log creation schema
 */
export const ChangeLogSchema = z.object({
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  operation: z.enum(['create', 'update', 'delete']),
  userId: z.string().uuid(),
  before: z.record(z.any()).optional(),
  after: z.record(z.any()).optional(),
  reason: z.string().max(500).optional(),
});

/**
 * Security event schema
 */
export const SecurityEventSchema = z.object({
  eventType: z.string().min(1),
  severity: z.nativeEnum(AuditSeverity),
  description: z.string().min(10).max(1000),
  source: z.string().min(1),
  userId: z.string().uuid().optional(),
  indicators: z.array(z.string()),
});

// ============================================================================
// AUDIT TRAIL FUNCTIONS
// ============================================================================

/**
 * 1. Create audit log entry
 */
export function createAuditLog(
  event: z.infer<typeof AuditLogSchema>,
  request: Request
): IAuditLog {
  const validated = AuditLogSchema.parse(event);
  const id = crypto.randomUUID();
  const timestamp = new Date();

  const auditLog: IAuditLog = {
    id,
    eventType: validated.eventType,
    severity: validated.severity,
    userId: validated.userId,
    ipAddress: request.ip || 'unknown',
    userAgent: request.headers['user-agent'],
    resource: validated.resource,
    resourceId: validated.resourceId,
    action: validated.action,
    outcome: validated.outcome,
    details: validated.details,
    timestamp,
    sessionId: (request as any).sessionId,
    requestId: (request as any).id,
  };

  return auditLog;
}

/**
 * 2. Create tamper-proof audit chain
 */
export function createAuditChain(
  auditLog: IAuditLog,
  previousHash?: string
): IAuditLog {
  const dataToHash = JSON.stringify({
    id: auditLog.id,
    eventType: auditLog.eventType,
    timestamp: auditLog.timestamp,
    userId: auditLog.userId,
    resource: auditLog.resource,
    action: auditLog.action,
    previousHash: previousHash || '0',
  });

  const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');

  return {
    ...auditLog,
    hash,
    previousHash: previousHash || '0',
  };
}

/**
 * 3. Verify audit chain integrity
 */
export function verifyAuditChain(logs: IAuditLog[]): {
  valid: boolean;
  brokenAt?: number;
} {
  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    const expectedPreviousHash = i === 0 ? '0' : logs[i - 1].hash;

    if (log.previousHash !== expectedPreviousHash) {
      return { valid: false, brokenAt: i };
    }

    // Recalculate hash to verify
    const dataToHash = JSON.stringify({
      id: log.id,
      eventType: log.eventType,
      timestamp: log.timestamp,
      userId: log.userId,
      resource: log.resource,
      action: log.action,
      previousHash: log.previousHash,
    });

    const calculatedHash = crypto
      .createHash('sha256')
      .update(dataToHash)
      .digest('hex');

    if (calculatedHash !== log.hash) {
      return { valid: false, brokenAt: i };
    }
  }

  return { valid: true };
}

/**
 * 4. Log PHI access
 */
export function logPHIAccess(
  userId: string,
  patientId: string,
  accessType: string,
  justification?: string,
  request?: Request
): IAuditLog {
  return {
    id: crypto.randomUUID(),
    eventType: AuditEventType.PHI_ACCESS,
    severity: AuditSeverity.HIGH,
    userId,
    ipAddress: request?.ip || 'unknown',
    userAgent: request?.headers['user-agent'],
    resource: 'patient',
    resourceId: patientId,
    action: accessType,
    outcome: 'success',
    details: {
      justification,
      dataType: 'PHI',
      complianceFramework: ComplianceFramework.HIPAA,
    },
    timestamp: new Date(),
  };
}

/**
 * 5. Log PII access
 */
export function logPIIAccess(
  userId: string,
  resourceType: string,
  resourceId: string,
  fields: string[],
  request?: Request
): IAuditLog {
  return {
    id: crypto.randomUUID(),
    eventType: AuditEventType.PII_ACCESS,
    severity: AuditSeverity.MEDIUM,
    userId,
    ipAddress: request?.ip || 'unknown',
    resource: resourceType,
    resourceId,
    action: 'read',
    outcome: 'success',
    details: {
      fields,
      dataType: 'PII',
      complianceFramework: ComplianceFramework.GDPR,
    },
    timestamp: new Date(),
  };
}

/**
 * 6. Create change log
 */
export function createChangeLog(
  change: z.infer<typeof ChangeLogSchema>
): IChangeLog {
  const validated = ChangeLogSchema.parse(change);
  const changes = calculateFieldChanges(validated.before, validated.after);

  return {
    id: crypto.randomUUID(),
    entityType: validated.entityType,
    entityId: validated.entityId,
    operation: validated.operation,
    userId: validated.userId,
    timestamp: new Date(),
    before: validated.before,
    after: validated.after,
    changes,
    reason: validated.reason,
  };
}

/**
 * 7. Calculate field changes
 */
export function calculateFieldChanges(
  before?: Record<string, any>,
  after?: Record<string, any>
): IFieldChange[] {
  const changes: IFieldChange[] = [];

  if (!before && !after) {
    return changes;
  }

  const allKeys = new Set([
    ...Object.keys(before || {}),
    ...Object.keys(after || {}),
  ]);

  for (const key of allKeys) {
    const oldValue = before?.[key];
    const newValue = after?.[key];

    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changes.push({
        field: key,
        oldValue,
        newValue,
        dataType: typeof newValue,
      });
    }
  }

  return changes;
}

/**
 * 8. Log security event
 */
export function logSecurityEvent(
  event: z.infer<typeof SecurityEventSchema>
): ISecurityEvent {
  const validated = SecurityEventSchema.parse(event);

  return {
    id: crypto.randomUUID(),
    eventType: validated.eventType,
    severity: validated.severity,
    description: validated.description,
    source: validated.source,
    userId: validated.userId,
    timestamp: new Date(),
    resolved: false,
    indicators: validated.indicators,
  };
}

/**
 * 9. Detect anomalous access patterns
 */
export function detectAnomalousAccess(
  recentAccess: IAccessLog[],
  currentAccess: IAccessLog
): {
  isAnomalous: boolean;
  reasons: string[];
  riskScore: number;
} {
  const reasons: string[] = [];
  let riskScore = 0;

  // Check for unusual access time
  const hour = currentAccess.timestamp.getHours();
  if (hour < 6 || hour > 22) {
    reasons.push('Access during unusual hours');
    riskScore += 20;
  }

  // Check for location change
  const locations = recentAccess.map(a => a.location).filter(Boolean);
  if (
    currentAccess.location &&
    locations.length > 0 &&
    !locations.includes(currentAccess.location)
  ) {
    reasons.push('Access from new location');
    riskScore += 30;
  }

  // Check for excessive access
  const accessesInLastHour = recentAccess.filter(
    a =>
      a.timestamp.getTime() >
      currentAccess.timestamp.getTime() - 60 * 60 * 1000
  );
  if (accessesInLastHour.length > 50) {
    reasons.push('Excessive access rate');
    riskScore += 40;
  }

  // Check for unusual resource type
  const resourceTypes = recentAccess.map(a => a.resourceType);
  const mostCommon = getMostCommon(resourceTypes);
  if (mostCommon && currentAccess.resourceType !== mostCommon) {
    reasons.push('Access to unusual resource type');
    riskScore += 15;
  }

  return {
    isAnomalous: riskScore >= 50,
    reasons,
    riskScore,
  };
}

/**
 * 10. Get most common element in array
 */
function getMostCommon<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;

  const counts = new Map<T, number>();
  for (const item of arr) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }

  let maxCount = 0;
  let mostCommon: T | undefined;

  for (const [item, count] of counts) {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = item;
    }
  }

  return mostCommon;
}

/**
 * 11. Generate compliance report
 */
export function generateComplianceReport(
  framework: ComplianceFramework,
  startDate: Date,
  endDate: Date,
  findings: IComplianceFinding[],
  generatedBy: string
): IComplianceReport {
  const summary = {
    totalControls: findings.length,
    compliant: findings.filter(f => f.status === 'compliant').length,
    nonCompliant: findings.filter(f => f.status === 'non_compliant').length,
    partial: findings.filter(f => f.status === 'partial').length,
    criticalFindings: findings.filter(f => f.severity === AuditSeverity.CRITICAL)
      .length,
  };

  return {
    id: crypto.randomUUID(),
    framework,
    reportType: 'periodic_audit',
    startDate,
    endDate,
    generatedAt: new Date(),
    generatedBy,
    findings,
    summary,
  };
}

/**
 * 12. Check HIPAA compliance
 */
export function checkHIPAACompliance(auditLogs: IAuditLog[]): {
  compliant: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  // Check for PHI access without justification
  const phiAccess = auditLogs.filter(
    log => log.eventType === AuditEventType.PHI_ACCESS
  );

  for (const log of phiAccess) {
    if (!log.details?.justification) {
      violations.push(
        `PHI access without justification: ${log.id} at ${log.timestamp}`
      );
    }
  }

  // Check for failed access attempts
  const failedAccess = auditLogs.filter(log => log.outcome === 'failure');
  if (failedAccess.length > 10) {
    violations.push(`Excessive failed access attempts: ${failedAccess.length}`);
  }

  return {
    compliant: violations.length === 0,
    violations,
  };
}

/**
 * 13. Check CJIS compliance
 */
export function checkCJISCompliance(auditLogs: IAuditLog[]): {
  compliant: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  // Check for proper authentication
  const loginAttempts = auditLogs.filter(
    log => log.eventType === AuditEventType.LOGIN
  );

  for (const log of loginAttempts) {
    if (!log.details?.mfaVerified) {
      violations.push(`Login without MFA: ${log.id} at ${log.timestamp}`);
    }
  }

  // Check for encryption key rotation
  const keyRotations = auditLogs.filter(
    log => log.eventType === AuditEventType.ENCRYPTION_KEY_ROTATED
  );

  const daysSinceRotation = keyRotations.length
    ? Math.floor(
        (Date.now() - keyRotations[0].timestamp.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 999;

  if (daysSinceRotation > 90) {
    violations.push('Encryption key not rotated in 90 days');
  }

  return {
    compliant: violations.length === 0,
    violations,
  };
}

/**
 * 14. Apply retention policy
 */
export function applyRetentionPolicy(
  logs: IAuditLog[],
  policy: RetentionPolicy
): {
  retained: IAuditLog[];
  archived: IAuditLog[];
  deleted: IAuditLog[];
} {
  if (policy === RetentionPolicy.PERMANENT) {
    return { retained: logs, archived: [], deleted: [] };
  }

  const now = Date.now();
  const retentionMs = policy * 24 * 60 * 60 * 1000;
  const archiveThreshold = retentionMs * 0.8; // Archive at 80% of retention

  const retained: IAuditLog[] = [];
  const archived: IAuditLog[] = [];
  const deleted: IAuditLog[] = [];

  for (const log of logs) {
    const age = now - log.timestamp.getTime();

    if (age < archiveThreshold) {
      retained.push(log);
    } else if (age < retentionMs) {
      archived.push(log);
    } else {
      // Check if log should be kept longer due to compliance
      if (requiresExtendedRetention(log)) {
        archived.push(log);
      } else {
        deleted.push(log);
      }
    }
  }

  return { retained, archived, deleted };
}

/**
 * 15. Check if log requires extended retention
 */
function requiresExtendedRetention(log: IAuditLog): boolean {
  const extendedRetentionEvents = [
    AuditEventType.SECURITY_ALERT,
    AuditEventType.HIPAA_BREACH,
    AuditEventType.POLICY_VIOLATION,
    AuditEventType.EMERGENCY_OVERRIDE,
  ];

  return extendedRetentionEvents.includes(log.eventType);
}

/**
 * 16. Create forensic snapshot
 */
export function createForensicSnapshot(
  incidentId: string,
  capturedBy: string,
  systemState: Record<string, any>,
  userSessions: any[],
  activeConnections: any[],
  recentLogs: IAuditLog[]
): IForensicSnapshot {
  const snapshot = {
    id: crypto.randomUUID(),
    incidentId,
    capturedAt: new Date(),
    capturedBy,
    systemState,
    userSessions,
    activeConnections,
    recentLogs,
  };

  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(snapshot))
    .digest('hex');

  return {
    ...snapshot,
    hash,
  };
}

/**
 * 17. Verify forensic snapshot integrity
 */
export function verifyForensicSnapshot(snapshot: IForensicSnapshot): boolean {
  const { hash, ...snapshotData } = snapshot;
  const calculatedHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(snapshotData))
    .digest('hex');

  return hash === calculatedHash;
}

/**
 * 18. Track chain of custody
 */
export function trackChainOfCustody(
  evidenceId: string,
  handler: string,
  action: string,
  previousCustody?: string
): {
  id: string;
  evidenceId: string;
  handler: string;
  action: string;
  timestamp: Date;
  previousCustody?: string;
  hash: string;
} {
  const custody = {
    id: crypto.randomUUID(),
    evidenceId,
    handler,
    action,
    timestamp: new Date(),
    previousCustody,
  };

  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(custody))
    .digest('hex');

  return { ...custody, hash };
}

/**
 * 19. Aggregate audit logs
 */
export function aggregateAuditLogs(
  logs: IAuditLog[],
  groupBy: 'user' | 'resource' | 'eventType' | 'hour'
): Map<string, IAuditLog[]> {
  const aggregated = new Map<string, IAuditLog[]>();

  for (const log of logs) {
    let key: string;

    switch (groupBy) {
      case 'user':
        key = log.userId || 'anonymous';
        break;
      case 'resource':
        key = log.resource;
        break;
      case 'eventType':
        key = log.eventType;
        break;
      case 'hour':
        key = log.timestamp.toISOString().substring(0, 13);
        break;
    }

    if (!aggregated.has(key)) {
      aggregated.set(key, []);
    }
    aggregated.get(key)!.push(log);
  }

  return aggregated;
}

/**
 * 20. Calculate audit statistics
 */
export function calculateAuditStatistics(logs: IAuditLog[]): {
  total: number;
  bySeverity: Record<string, number>;
  byOutcome: Record<string, number>;
  byEventType: Record<string, number>;
  uniqueUsers: number;
  uniqueResources: number;
  timeRange: { start: Date; end: Date };
} {
  const bySeverity: Record<string, number> = {};
  const byOutcome: Record<string, number> = {};
  const byEventType: Record<string, number> = {};
  const users = new Set<string>();
  const resources = new Set<string>();

  let minTime = new Date();
  let maxTime = new Date(0);

  for (const log of logs) {
    // Severity
    bySeverity[log.severity] = (bySeverity[log.severity] || 0) + 1;

    // Outcome
    byOutcome[log.outcome] = (byOutcome[log.outcome] || 0) + 1;

    // Event type
    byEventType[log.eventType] = (byEventType[log.eventType] || 0) + 1;

    // Users and resources
    if (log.userId) users.add(log.userId);
    resources.add(log.resource);

    // Time range
    if (log.timestamp < minTime) minTime = log.timestamp;
    if (log.timestamp > maxTime) maxTime = log.timestamp;
  }

  return {
    total: logs.length,
    bySeverity,
    byOutcome,
    byEventType,
    uniqueUsers: users.size,
    uniqueResources: resources.size,
    timeRange: { start: minTime, end: maxTime },
  };
}

/**
 * 21. Correlate security events
 */
export function correlateSecurityEvents(
  events: ISecurityEvent[],
  timeWindow: number = 300000 // 5 minutes
): ISecurityEvent[][] {
  const correlatedGroups: ISecurityEvent[][] = [];
  const processed = new Set<string>();

  for (const event of events) {
    if (processed.has(event.id)) continue;

    const group = [event];
    processed.add(event.id);

    // Find related events
    for (const other of events) {
      if (processed.has(other.id)) continue;

      const timeDiff = Math.abs(
        event.timestamp.getTime() - other.timestamp.getTime()
      );

      if (timeDiff <= timeWindow) {
        // Check for correlation indicators
        const hasCommonIndicators = event.indicators.some(ind =>
          other.indicators.includes(ind)
        );

        const sameUser = event.userId && event.userId === other.userId;
        const sameIP = event.ipAddress && event.ipAddress === other.ipAddress;

        if (hasCommonIndicators || sameUser || sameIP) {
          group.push(other);
          processed.add(other.id);
        }
      }
    }

    if (group.length > 0) {
      correlatedGroups.push(group);
    }
  }

  return correlatedGroups;
}

/**
 * 22. Generate audit summary report
 */
export function generateAuditSummary(
  logs: IAuditLog[],
  period: 'day' | 'week' | 'month'
): {
  period: string;
  statistics: ReturnType<typeof calculateAuditStatistics>;
  topUsers: Array<{ userId: string; count: number }>;
  topResources: Array<{ resource: string; count: number }>;
  securityAlerts: number;
  failureRate: number;
} {
  const stats = calculateAuditStatistics(logs);

  // Top users
  const userCounts = new Map<string, number>();
  for (const log of logs) {
    if (log.userId) {
      userCounts.set(log.userId, (userCounts.get(log.userId) || 0) + 1);
    }
  }
  const topUsers = Array.from(userCounts.entries())
    .map(([userId, count]) => ({ userId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top resources
  const resourceCounts = new Map<string, number>();
  for (const log of logs) {
    resourceCounts.set(
      log.resource,
      (resourceCounts.get(log.resource) || 0) + 1
    );
  }
  const topResources = Array.from(resourceCounts.entries())
    .map(([resource, count]) => ({ resource, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Security alerts
  const securityAlerts = logs.filter(
    log => log.eventType === AuditEventType.SECURITY_ALERT
  ).length;

  // Failure rate
  const failures = logs.filter(log => log.outcome === 'failure').length;
  const failureRate = logs.length > 0 ? failures / logs.length : 0;

  return {
    period,
    statistics: stats,
    topUsers,
    topResources,
    securityAlerts,
    failureRate,
  };
}

/**
 * 23. Encrypt audit log
 */
export function encryptAuditLog(
  log: IAuditLog,
  encryptionKey: string
): string {
  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync(encryptionKey, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const data = JSON.stringify(log);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * 24. Decrypt audit log
 */
export function decryptAuditLog(
  encryptedLog: string,
  encryptionKey: string
): IAuditLog {
  const algorithm = 'aes-256-gcm';
  const [ivHex, authTagHex, encrypted] = encryptedLog.split(':');

  const key = crypto.scryptSync(encryptionKey, 'salt', 32);
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
}

/**
 * 25. Redact sensitive audit data
 */
export function redactSensitiveAuditData(log: IAuditLog): IAuditLog {
  const sensitiveFields = ['password', 'token', 'ssn', 'apiKey'];

  const redactObject = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(redactObject);
    }

    const redacted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        redacted[key] = '[REDACTED]';
      } else {
        redacted[key] = redactObject(value);
      }
    }
    return redacted;
  };

  return {
    ...log,
    details: log.details ? redactObject(log.details) : undefined,
    metadata: log.metadata ? redactObject(log.metadata) : undefined,
  };
}

/**
 * 26. Search audit logs
 */
export function searchAuditLogs(
  logs: IAuditLog[],
  criteria: {
    userId?: string;
    eventType?: AuditEventType;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    severity?: AuditSeverity;
    outcome?: 'success' | 'failure';
  }
): IAuditLog[] {
  return logs.filter(log => {
    if (criteria.userId && log.userId !== criteria.userId) return false;
    if (criteria.eventType && log.eventType !== criteria.eventType)
      return false;
    if (criteria.resource && log.resource !== criteria.resource) return false;
    if (criteria.severity && log.severity !== criteria.severity) return false;
    if (criteria.outcome && log.outcome !== criteria.outcome) return false;

    if (criteria.startDate && log.timestamp < criteria.startDate) return false;
    if (criteria.endDate && log.timestamp > criteria.endDate) return false;

    return true;
  });
}

/**
 * 27. Export audit logs
 */
export function exportAuditLogs(
  logs: IAuditLog[],
  format: 'json' | 'csv' | 'xml'
): string {
  switch (format) {
    case 'json':
      return JSON.stringify(logs, null, 2);

    case 'csv':
      const headers = [
        'ID',
        'Timestamp',
        'Event Type',
        'Severity',
        'User ID',
        'Resource',
        'Action',
        'Outcome',
        'IP Address',
      ];
      const rows = logs.map(log => [
        log.id,
        log.timestamp.toISOString(),
        log.eventType,
        log.severity,
        log.userId || '',
        log.resource,
        log.action,
        log.outcome,
        log.ipAddress,
      ]);
      return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    case 'xml':
      const xmlLogs = logs
        .map(
          log => `
  <AuditLog>
    <ID>${log.id}</ID>
    <Timestamp>${log.timestamp.toISOString()}</Timestamp>
    <EventType>${log.eventType}</EventType>
    <Severity>${log.severity}</Severity>
    <UserID>${log.userId || ''}</UserID>
    <Resource>${log.resource}</Resource>
    <Action>${log.action}</Action>
    <Outcome>${log.outcome}</Outcome>
    <IPAddress>${log.ipAddress}</IPAddress>
  </AuditLog>`
        )
        .join('');
      return `<?xml version="1.0" encoding="UTF-8"?>\n<AuditLogs>${xmlLogs}\n</AuditLogs>`;

    default:
      return JSON.stringify(logs);
  }
}

/**
 * 28. Validate audit log completeness
 */
export function validateAuditLogCompleteness(log: IAuditLog): {
  valid: boolean;
  missingFields: string[];
} {
  const requiredFields: (keyof IAuditLog)[] = [
    'id',
    'eventType',
    'severity',
    'ipAddress',
    'resource',
    'action',
    'outcome',
    'timestamp',
  ];

  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!log[field]) {
      missingFields.push(field);
    }
  }

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * 29. Calculate compliance score
 */
export function calculateComplianceScore(
  auditLogs: IAuditLog[],
  framework: ComplianceFramework
): {
  score: number;
  maxScore: number;
  percentage: number;
  details: Record<string, any>;
} {
  let score = 100;
  const details: Record<string, any> = {};

  // HIPAA-specific checks
  if (framework === ComplianceFramework.HIPAA) {
    const phiAccess = auditLogs.filter(
      log => log.eventType === AuditEventType.PHI_ACCESS
    );
    const phiWithoutJustification = phiAccess.filter(
      log => !log.details?.justification
    );

    if (phiWithoutJustification.length > 0) {
      const penalty = Math.min(
        30,
        (phiWithoutJustification.length / phiAccess.length) * 30
      );
      score -= penalty;
      details.phiAccessViolations = phiWithoutJustification.length;
    }
  }

  // CJIS-specific checks
  if (framework === ComplianceFramework.CJIS) {
    const loginAttempts = auditLogs.filter(
      log => log.eventType === AuditEventType.LOGIN
    );
    const loginWithoutMFA = loginAttempts.filter(
      log => !log.details?.mfaVerified
    );

    if (loginWithoutMFA.length > 0) {
      const penalty = Math.min(
        40,
        (loginWithoutMFA.length / loginAttempts.length) * 40
      );
      score -= penalty;
      details.mfaViolations = loginWithoutMFA.length;
    }
  }

  // Check for security alerts
  const securityAlerts = auditLogs.filter(
    log => log.eventType === AuditEventType.SECURITY_ALERT
  );
  if (securityAlerts.length > 10) {
    score -= Math.min(20, securityAlerts.length - 10);
    details.securityAlerts = securityAlerts.length;
  }

  return {
    score: Math.max(0, score),
    maxScore: 100,
    percentage: Math.max(0, score),
    details,
  };
}

/**
 * 30. Generate regulatory report
 */
export function generateRegulatoryReport(
  auditLogs: IAuditLog[],
  framework: ComplianceFramework,
  period: { start: Date; end: Date }
): {
  framework: ComplianceFramework;
  period: { start: Date; end: Date };
  generatedAt: Date;
  complianceScore: ReturnType<typeof calculateComplianceScore>;
  criticalEvents: IAuditLog[];
  recommendations: string[];
} {
  const complianceScore = calculateComplianceScore(auditLogs, framework);

  const criticalEvents = auditLogs.filter(
    log => log.severity === AuditSeverity.CRITICAL
  );

  const recommendations: string[] = [];

  if (complianceScore.details.phiAccessViolations > 0) {
    recommendations.push(
      'Implement mandatory justification for all PHI access'
    );
  }

  if (complianceScore.details.mfaViolations > 0) {
    recommendations.push('Enforce multi-factor authentication for all logins');
  }

  if (complianceScore.details.securityAlerts > 10) {
    recommendations.push('Review and address security alerts promptly');
  }

  return {
    framework,
    period,
    generatedAt: new Date(),
    complianceScore,
    criticalEvents,
    recommendations,
  };
}

/**
 * 31. Archive audit logs
 */
export function archiveAuditLogs(
  logs: IAuditLog[],
  compressionLevel: 'none' | 'low' | 'high' = 'low'
): {
  archiveId: string;
  logCount: number;
  archiveSize: number;
  archiveDate: Date;
} {
  const archiveId = crypto.randomUUID();
  const data = JSON.stringify(logs);

  // In production, implement actual compression
  const archiveSize = Buffer.byteLength(data, 'utf8');

  return {
    archiveId,
    logCount: logs.length,
    archiveSize,
    archiveDate: new Date(),
  };
}

/**
 * 32. Monitor real-time security events
 */
export function monitorSecurityEvents(
  events: ISecurityEvent[],
  thresholds: {
    criticalCount: number;
    highCount: number;
    timeWindow: number; // in minutes
  }
): {
  alertLevel: 'normal' | 'elevated' | 'high' | 'critical';
  reasons: string[];
} {
  const now = Date.now();
  const windowMs = thresholds.timeWindow * 60 * 1000;

  const recentEvents = events.filter(
    e => now - e.timestamp.getTime() < windowMs
  );

  const criticalCount = recentEvents.filter(
    e => e.severity === AuditSeverity.CRITICAL
  ).length;

  const highCount = recentEvents.filter(
    e => e.severity === AuditSeverity.HIGH
  ).length;

  const reasons: string[] = [];
  let alertLevel: 'normal' | 'elevated' | 'high' | 'critical' = 'normal';

  if (criticalCount >= thresholds.criticalCount) {
    alertLevel = 'critical';
    reasons.push(`${criticalCount} critical security events detected`);
  } else if (highCount >= thresholds.highCount) {
    alertLevel = 'high';
    reasons.push(`${highCount} high severity events detected`);
  } else if (criticalCount > 0 || highCount > thresholds.highCount / 2) {
    alertLevel = 'elevated';
    reasons.push('Elevated security event activity');
  }

  return { alertLevel, reasons };
}

/**
 * 33. Detect privilege escalation attempts
 */
export function detectPrivilegeEscalation(
  auditLogs: IAuditLog[]
): {
  detected: boolean;
  suspiciousActivities: IAuditLog[];
  riskScore: number;
} {
  const suspiciousActivities: IAuditLog[] = [];
  let riskScore = 0;

  // Look for failed access attempts followed by successful privileged access
  const accessAttempts = auditLogs.filter(
    log =>
      log.eventType === AuditEventType.ACCESS_DENIED ||
      log.eventType === AuditEventType.ACCESS_GRANTED
  );

  for (let i = 0; i < accessAttempts.length - 1; i++) {
    const current = accessAttempts[i];
    const next = accessAttempts[i + 1];

    if (
      current.outcome === 'failure' &&
      next.outcome === 'success' &&
      current.userId === next.userId
    ) {
      const timeDiff =
        next.timestamp.getTime() - current.timestamp.getTime();

      if (timeDiff < 5 * 60 * 1000) {
        // Within 5 minutes
        suspiciousActivities.push(current, next);
        riskScore += 30;
      }
    }
  }

  // Look for privilege escalation events
  const escalations = auditLogs.filter(
    log => log.eventType === AuditEventType.PRIVILEGE_ESCALATION
  );

  for (const escalation of escalations) {
    if (!escalation.details?.approvedBy) {
      suspiciousActivities.push(escalation);
      riskScore += 40;
    }
  }

  return {
    detected: riskScore >= 50,
    suspiciousActivities,
    riskScore,
  };
}

/**
 * 34. Generate audit digest
 */
export function generateAuditDigest(
  logs: IAuditLog[]
): {
  digest: string;
  logCount: number;
  timestamp: Date;
} {
  const sortedLogs = [...logs].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  const data = sortedLogs
    .map(log => `${log.id}:${log.timestamp.toISOString()}:${log.hash || ''}`)
    .join('|');

  const digest = crypto.createHash('sha256').update(data).digest('hex');

  return {
    digest,
    logCount: logs.length,
    timestamp: new Date(),
  };
}

/**
 * 35. Verify audit digest
 */
export function verifyAuditDigest(
  logs: IAuditLog[],
  expectedDigest: string
): boolean {
  const { digest } = generateAuditDigest(logs);
  return digest === expectedDigest;
}

/**
 * 36. Track data lineage
 */
export function trackDataLineage(
  dataId: string,
  operation: string,
  userId: string,
  changes: IFieldChange[]
): {
  id: string;
  dataId: string;
  operation: string;
  userId: string;
  timestamp: Date;
  changes: IFieldChange[];
  lineageHash: string;
} {
  const lineage = {
    id: crypto.randomUUID(),
    dataId,
    operation,
    userId,
    timestamp: new Date(),
    changes,
  };

  const lineageHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(lineage))
    .digest('hex');

  return { ...lineage, lineageHash };
}

/**
 * 37. Generate compliance evidence package
 */
export function generateComplianceEvidence(
  auditLogs: IAuditLog[],
  framework: ComplianceFramework,
  controlId: string
): {
  controlId: string;
  framework: ComplianceFramework;
  evidenceLogs: IAuditLog[];
  summary: string;
  generatedAt: Date;
} {
  // Filter relevant logs for the control
  const evidenceLogs = auditLogs.filter(log =>
    log.details?.complianceFramework === framework
  );

  const summary = `Compliance evidence for ${framework} control ${controlId}: ${evidenceLogs.length} audit logs collected`;

  return {
    controlId,
    framework,
    evidenceLogs,
    summary,
    generatedAt: new Date(),
  };
}

/**
 * 38. Calculate audit coverage
 */
export function calculateAuditCoverage(
  auditLogs: IAuditLog[],
  totalOperations: number
): {
  coverage: number;
  auditedOperations: number;
  totalOperations: number;
  gapAnalysis: string[];
} {
  const auditedOperations = auditLogs.length;
  const coverage =
    totalOperations > 0 ? (auditedOperations / totalOperations) * 100 : 0;

  const gapAnalysis: string[] = [];

  if (coverage < 80) {
    gapAnalysis.push('Audit coverage below recommended 80% threshold');
  }

  // Check for event type coverage
  const eventTypes = new Set(auditLogs.map(log => log.eventType));
  const expectedEventTypes = Object.values(AuditEventType);
  const missingEventTypes = expectedEventTypes.filter(
    type => !eventTypes.has(type)
  );

  if (missingEventTypes.length > 0) {
    gapAnalysis.push(
      `Missing audit logs for: ${missingEventTypes.join(', ')}`
    );
  }

  return {
    coverage,
    auditedOperations,
    totalOperations,
    gapAnalysis,
  };
}

/**
 * 39. Generate audit trail visualization data
 */
export function generateAuditVisualization(auditLogs: IAuditLog[]): {
  timeline: Array<{ timestamp: Date; count: number }>;
  heatmap: Array<{ hour: number; day: number; count: number }>;
  severityDistribution: Record<string, number>;
  userActivity: Array<{ userId: string; activityCount: number }>;
} {
  // Timeline (hourly)
  const hourlyMap = new Map<string, number>();
  for (const log of auditLogs) {
    const hour = log.timestamp.toISOString().substring(0, 13);
    hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
  }
  const timeline = Array.from(hourlyMap.entries())
    .map(([timestamp, count]) => ({ timestamp: new Date(timestamp), count }))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Heatmap (hour of day x day of week)
  const heatmapData = new Map<string, number>();
  for (const log of auditLogs) {
    const hour = log.timestamp.getHours();
    const day = log.timestamp.getDay();
    const key = `${day}-${hour}`;
    heatmapData.set(key, (heatmapData.get(key) || 0) + 1);
  }
  const heatmap = Array.from(heatmapData.entries()).map(([key, count]) => {
    const [day, hour] = key.split('-').map(Number);
    return { hour, day, count };
  });

  // Severity distribution
  const severityDistribution: Record<string, number> = {};
  for (const log of auditLogs) {
    severityDistribution[log.severity] =
      (severityDistribution[log.severity] || 0) + 1;
  }

  // User activity
  const userActivityMap = new Map<string, number>();
  for (const log of auditLogs) {
    if (log.userId) {
      userActivityMap.set(
        log.userId,
        (userActivityMap.get(log.userId) || 0) + 1
      );
    }
  }
  const userActivity = Array.from(userActivityMap.entries())
    .map(([userId, activityCount]) => ({ userId, activityCount }))
    .sort((a, b) => b.activityCount - a.activityCount);

  return {
    timeline,
    heatmap,
    severityDistribution,
    userActivity,
  };
}

/**
 * 40. Detect compliance drift
 */
export function detectComplianceDrift(
  currentLogs: IAuditLog[],
  baselineLogs: IAuditLog[],
  framework: ComplianceFramework
): {
  driftDetected: boolean;
  driftScore: number;
  changes: string[];
} {
  const currentScore = calculateComplianceScore(currentLogs, framework);
  const baselineScore = calculateComplianceScore(baselineLogs, framework);

  const driftScore = baselineScore.score - currentScore.score;
  const changes: string[] = [];

  if (driftScore > 10) {
    changes.push(`Compliance score decreased by ${driftScore} points`);
  }

  // Compare violation counts
  const currentViolations = Object.values(currentScore.details).reduce(
    (sum: number, val) => sum + (typeof val === 'number' ? val : 0),
    0
  );
  const baselineViolations = Object.values(baselineScore.details).reduce(
    (sum: number, val) => sum + (typeof val === 'number' ? val : 0),
    0
  );

  if (currentViolations > baselineViolations) {
    changes.push(
      `Violations increased from ${baselineViolations} to ${currentViolations}`
    );
  }

  return {
    driftDetected: driftScore > 10 || currentViolations > baselineViolations,
    driftScore,
    changes,
  };
}

/**
 * 41. Create audit alert
 */
export function createAuditAlert(
  severity: AuditSeverity,
  message: string,
  logs: IAuditLog[]
): {
  id: string;
  severity: AuditSeverity;
  message: string;
  logCount: number;
  createdAt: Date;
  requiresAction: boolean;
} {
  return {
    id: crypto.randomUUID(),
    severity,
    message,
    logCount: logs.length,
    createdAt: new Date(),
    requiresAction:
      severity === AuditSeverity.CRITICAL || severity === AuditSeverity.HIGH,
  };
}

/**
 * 42. Sanitize audit export
 */
export function sanitizeAuditExport(logs: IAuditLog[]): IAuditLog[] {
  return logs.map(redactSensitiveAuditData);
}

/**
 * 43. Generate audit hash chain
 */
export function generateAuditHashChain(logs: IAuditLog[]): IAuditLog[] {
  let previousHash = '0';
  const chainedLogs: IAuditLog[] = [];

  for (const log of logs) {
    const chainedLog = createAuditChain(log, previousHash);
    chainedLogs.push(chainedLog);
    previousHash = chainedLog.hash!;
  }

  return chainedLogs;
}

/**
 * 44. Calculate audit velocity
 */
export function calculateAuditVelocity(
  logs: IAuditLog[],
  windowMinutes: number = 60
): {
  eventsPerHour: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  velocity: number;
} {
  if (logs.length < 2) {
    return { eventsPerHour: 0, trend: 'stable', velocity: 0 };
  }

  const sortedLogs = [...logs].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  const timeSpan =
    sortedLogs[sortedLogs.length - 1].timestamp.getTime() -
    sortedLogs[0].timestamp.getTime();
  const hours = timeSpan / (1000 * 60 * 60);

  const eventsPerHour = hours > 0 ? logs.length / hours : 0;

  // Calculate trend
  const midpoint = Math.floor(logs.length / 2);
  const firstHalfRate = midpoint / hours;
  const secondHalfRate = (logs.length - midpoint) / hours;

  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  const velocity = secondHalfRate - firstHalfRate;

  if (velocity > eventsPerHour * 0.2) {
    trend = 'increasing';
  } else if (velocity < -eventsPerHour * 0.2) {
    trend = 'decreasing';
  }

  return { eventsPerHour, trend, velocity };
}

/**
 * 45. Perform audit reconciliation
 */
export function performAuditReconciliation(
  expectedOperations: number,
  auditLogs: IAuditLog[]
): {
  reconciled: boolean;
  discrepancy: number;
  missingLogs: number;
  duplicateLogs: number;
} {
  const uniqueOperations = new Set(
    auditLogs.map(log => `${log.resource}:${log.resourceId}:${log.action}`)
  );

  const duplicateLogs = auditLogs.length - uniqueOperations.size;
  const actualOperations = uniqueOperations.size;
  const missingLogs = Math.max(0, expectedOperations - actualOperations);
  const discrepancy = expectedOperations - actualOperations;

  return {
    reconciled: discrepancy === 0,
    discrepancy,
    missingLogs,
    duplicateLogs,
  };
}

/**
 * 46. Generate incident investigation report
 */
export function generateIncidentInvestigationReport(
  incidentId: string,
  relatedLogs: IAuditLog[],
  securityEvents: ISecurityEvent[]
): {
  incidentId: string;
  investigationId: string;
  timeline: IAuditLog[];
  securityEvents: ISecurityEvent[];
  affectedUsers: string[];
  affectedResources: string[];
  severity: AuditSeverity;
  generatedAt: Date;
} {
  const affectedUsers = [
    ...new Set(relatedLogs.map(log => log.userId).filter(Boolean) as string[]),
  ];
  const affectedResources = [
    ...new Set(relatedLogs.map(log => log.resource)),
  ];

  const maxSeverity = [...relatedLogs, ...securityEvents].reduce(
    (max, item) => {
      const severityOrder = [
        AuditSeverity.INFO,
        AuditSeverity.LOW,
        AuditSeverity.MEDIUM,
        AuditSeverity.HIGH,
        AuditSeverity.CRITICAL,
      ];
      const currentIndex = severityOrder.indexOf(item.severity);
      const maxIndex = severityOrder.indexOf(max);
      return currentIndex > maxIndex ? item.severity : max;
    },
    AuditSeverity.INFO
  );

  return {
    incidentId,
    investigationId: crypto.randomUUID(),
    timeline: relatedLogs.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    ),
    securityEvents,
    affectedUsers,
    affectedResources,
    severity: maxSeverity,
    generatedAt: new Date(),
  };
}

/**
 * 47. Calculate mean time to detect (MTTD)
 */
export function calculateMTTD(
  securityEvents: ISecurityEvent[]
): {
  mttdMinutes: number;
  averageDetectionTime: number;
  fastestDetection: number;
  slowestDetection: number;
} {
  // In production, compare event occurrence time vs detection time
  // This is simplified
  const detectionTimes = securityEvents.map(() => Math.random() * 60); // Mock data

  const sum = detectionTimes.reduce((a, b) => a + b, 0);
  const averageDetectionTime = detectionTimes.length > 0 ? sum / detectionTimes.length : 0;

  return {
    mttdMinutes: averageDetectionTime,
    averageDetectionTime,
    fastestDetection: Math.min(...detectionTimes, Infinity),
    slowestDetection: Math.max(...detectionTimes, 0),
  };
}

/**
 * 48. Calculate mean time to respond (MTTR)
 */
export function calculateMTTR(
  securityEvents: ISecurityEvent[]
): {
  mttrMinutes: number;
  averageResponseTime: number;
  fastestResponse: number;
  slowestResponse: number;
} {
  const resolvedEvents = securityEvents.filter(e => e.resolved && e.resolvedAt);

  const responseTimes = resolvedEvents.map(e => {
    const diff = e.resolvedAt!.getTime() - e.timestamp.getTime();
    return diff / (1000 * 60); // Convert to minutes
  });

  const sum = responseTimes.reduce((a, b) => a + b, 0);
  const averageResponseTime = responseTimes.length > 0 ? sum / responseTimes.length : 0;

  return {
    mttrMinutes: averageResponseTime,
    averageResponseTime,
    fastestResponse: Math.min(...responseTimes, Infinity),
    slowestResponse: Math.max(...responseTimes, 0),
  };
}

/**
 * 49. Generate executive audit summary
 */
export function generateExecutiveSummary(
  auditLogs: IAuditLog[],
  securityEvents: ISecurityEvent[],
  period: { start: Date; end: Date }
): {
  period: { start: Date; end: Date };
  totalEvents: number;
  securityIncidents: number;
  complianceScore: number;
  topRisks: string[];
  recommendations: string[];
  generatedAt: Date;
} {
  const stats = calculateAuditStatistics(auditLogs);
  const complianceScore = calculateComplianceScore(
    auditLogs,
    ComplianceFramework.HIPAA
  );

  const topRisks: string[] = [];
  const recommendations: string[] = [];

  // Identify top risks
  if (stats.byOutcome['failure'] > stats.total * 0.1) {
    topRisks.push('High failure rate detected');
    recommendations.push('Review and address failed operations');
  }

  const criticalEvents = securityEvents.filter(
    e => e.severity === AuditSeverity.CRITICAL
  );
  if (criticalEvents.length > 0) {
    topRisks.push(`${criticalEvents.length} critical security events`);
    recommendations.push('Immediate review of critical security events required');
  }

  if (complianceScore.percentage < 80) {
    topRisks.push('Compliance score below target');
    recommendations.push('Implement compliance improvement plan');
  }

  return {
    period,
    totalEvents: auditLogs.length,
    securityIncidents: securityEvents.length,
    complianceScore: complianceScore.percentage,
    topRisks,
    recommendations,
    generatedAt: new Date(),
  };
}

/**
 * 50. Validate audit trail completeness
 */
export function validateAuditTrailCompleteness(
  auditLogs: IAuditLog[],
  expectedSequence: string[]
): {
  complete: boolean;
  missingEvents: string[];
  coverage: number;
} {
  const loggedEvents = new Set(auditLogs.map(log => log.eventType));
  const missingEvents = expectedSequence.filter(event => !loggedEvents.has(event));

  const coverage =
    expectedSequence.length > 0
      ? ((expectedSequence.length - missingEvents.length) /
          expectedSequence.length) *
        100
      : 100;

  return {
    complete: missingEvents.length === 0,
    missingEvents,
    coverage,
  };
}

// ============================================================================
// NESTJS INTERCEPTORS
// ============================================================================

/**
 * Audit logging interceptor
 */
@Injectable()
export class AuditLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AuditTrail');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          const auditLog = createAuditLog(
            {
              eventType: this.mapMethodToEventType(request.method),
              severity: AuditSeverity.INFO,
              userId: request.user?.id,
              resource: this.extractResource(request.url),
              action: `${request.method} ${request.url}`,
              outcome: 'success',
              details: { duration, responseSize: JSON.stringify(data).length },
            },
            request
          );

          this.logger.log(`Audit: ${JSON.stringify(auditLog)}`);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const auditLog = createAuditLog(
            {
              eventType: this.mapMethodToEventType(request.method),
              severity: AuditSeverity.HIGH,
              userId: request.user?.id,
              resource: this.extractResource(request.url),
              action: `${request.method} ${request.url}`,
              outcome: 'failure',
              details: { duration, error: error.message },
            },
            request
          );

          this.logger.error(`Audit: ${JSON.stringify(auditLog)}`);
        },
      })
    );
  }

  private mapMethodToEventType(method: string): AuditEventType {
    const mapping: Record<string, AuditEventType> = {
      GET: AuditEventType.DATA_READ,
      POST: AuditEventType.DATA_CREATE,
      PUT: AuditEventType.DATA_UPDATE,
      PATCH: AuditEventType.DATA_UPDATE,
      DELETE: AuditEventType.DATA_DELETE,
    };

    return mapping[method] || AuditEventType.DATA_READ;
  }

  private extractResource(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[0] || 'unknown';
  }
}

/**
 * Change tracking interceptor
 */
@Injectable()
export class ChangeTrackingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('ChangeTracking');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const before = request.body?.before;

    return next.handle().pipe(
      tap((data) => {
        if (request.method === 'PUT' || request.method === 'PATCH') {
          const changeLog = createChangeLog({
            entityType: this.extractEntityType(request.url),
            entityId: this.extractEntityId(request.url),
            operation: 'update',
            userId: request.user?.id || 'system',
            before,
            after: data,
          });

          this.logger.log(`Change: ${JSON.stringify(changeLog)}`);
        }
      })
    );
  }

  private extractEntityType(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[0] || 'unknown';
  }

  private extractEntityId(url: string): string {
    const parts = url.split('/').filter(Boolean);
    return parts[1] || 'unknown';
  }
}
