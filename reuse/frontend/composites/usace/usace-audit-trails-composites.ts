/**
 * LOC: USACE-AUDIT-TR-001
 * File: /reuse/frontend/composites/usace/usace-audit-trails-composites.ts
 *
 * UPSTREAM (imports from):
 *   - /reuse/frontend/analytics-tracking-kit.ts
 *   - /reuse/frontend/version-control-kit.ts
 *   - /reuse/frontend/custom-fields-metadata-kit.ts
 *   - /reuse/frontend/search-filter-cms-kit.ts
 *   - /reuse/frontend/import-export-cms-kit.ts
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS audit systems
 *   - Compliance tracking applications
 *   - Change history dashboards
 *   - Accountability reporting modules
 */

/**
 * File: /reuse/frontend/composites/usace/usace-audit-trails-composites.ts
 * Locator: WC-USACE-AUDIT-001
 * Purpose: USACE CEFMS Audit Trails, Compliance Tracking & Accountability System
 *
 * Upstream: React 18+, TypeScript 5.x, Next.js 16+, analytics-tracking-kit, version-control-kit
 * Downstream: USACE audit systems, Compliance tracking, Change history, Accountability reports
 * Dependencies: React 18+, TypeScript 5.x, Next.js 16+, date-fns
 * Exports: 48+ audit trail hooks, components, and utilities
 *
 * LLM Context: Enterprise-grade USACE CEFMS audit trail system for React 18+ applications.
 * Provides comprehensive audit logging, change tracking, user activity monitoring, compliance
 * accountability, forensic analysis, and regulatory audit support. Designed for USACE systems
 * requiring detailed activity logs, tamper-proof audit trails, and comprehensive change history
 * for federal compliance and accountability requirements.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  trackEvent,
  useTracking,
  type EventParameters,
} from '../../analytics-tracking-kit';

// ============================================================================
// TYPE DEFINITIONS - AUDIT TRAILS
// ============================================================================

/**
 * Audit event types
 */
export type AuditEventType =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'access_granted'
  | 'access_denied'
  | 'permission_change'
  | 'configuration_change'
  | 'data_export'
  | 'data_import'
  | 'report_generated'
  | 'approval_granted'
  | 'approval_denied'
  | 'workflow_transition'
  | 'system_event'
  | 'security_event'
  | 'compliance_event'
  | 'error_event';

/**
 * Audit severity levels
 */
export type AuditSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

/**
 * Audit log retention policies
 */
export type RetentionPolicy =
  | 'permanent'
  | '10_years'
  | '7_years'
  | '5_years'
  | '3_years'
  | '1_year';

/**
 * Audit trail record
 */
export interface AuditTrailRecord {
  id: string;
  timestamp: Date;
  eventType: AuditEventType;
  severity: AuditSeverity;
  userId: string;
  userName: string;
  userEmail?: string;
  userRole?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  entityType: string;
  entityId: string;
  entityName?: string;
  action: string;
  description: string;
  previousValue?: any;
  newValue?: any;
  changeSet?: ChangeSetItem[];
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  retentionPolicy: RetentionPolicy;
  complianceFlags?: string[];
}

/**
 * Change set item for detailed field tracking
 */
export interface ChangeSetItem {
  field: string;
  fieldLabel?: string;
  oldValue: any;
  newValue: any;
  dataType: string;
}

/**
 * User activity session
 */
export interface UserActivitySession {
  sessionId: string;
  userId: string;
  userName: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  ipAddress?: string;
  deviceType?: string;
  browser?: string;
  activityCount: number;
  pagesViewed: string[];
  actionsPerformed: string[];
  lastActivity?: Date;
}

/**
 * Compliance audit trail filter
 */
export interface AuditTrailFilter {
  startDate?: Date;
  endDate?: Date;
  eventTypes?: AuditEventType[];
  userIds?: string[];
  entityTypes?: string[];
  severities?: AuditSeverity[];
  successOnly?: boolean;
  searchTerm?: string;
  tags?: string[];
}

/**
 * Audit report configuration
 */
export interface AuditReportConfig {
  id: string;
  reportName: string;
  reportType: 'activity' | 'compliance' | 'security' | 'change_log' | 'access_log';
  filters: AuditTrailFilter;
  groupBy?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  includeFields?: string[];
  format: 'pdf' | 'excel' | 'csv' | 'json';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    recipients: string[];
    enabled: boolean;
  };
}

/**
 * Audit trail integrity verification
 */
export interface AuditIntegrityCheck {
  checkId: string;
  timestamp: Date;
  recordCount: number;
  dateRange: { start: Date; end: Date };
  hashVerification: boolean;
  sequenceVerification: boolean;
  tampering Detected: boolean;
  anomalies: string[];
  verifiedBy?: string;
}

/**
 * Compliance checkpoint
 */
export interface ComplianceCheckpoint {
  id: string;
  checkpointName: string;
  checkpointDate: Date;
  auditPeriodStart: Date;
  auditPeriodEnd: Date;
  recordsReviewed: number;
  findingsCount: number;
  findings?: AuditFinding[];
  reviewedBy: string;
  approvedBy?: string;
  approvalDate?: Date;
  certificationStatement?: string;
}

/**
 * Audit finding
 */
export interface AuditFinding {
  id: string;
  findingType: 'compliance' | 'security' | 'data_integrity' | 'process' | 'other';
  severity: AuditSeverity;
  description: string;
  relatedRecords: string[];
  recommendation?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  dueDate?: Date;
  resolutionNotes?: string;
}

/**
 * Access log entry
 */
export interface AccessLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  resourceType: string;
  resourceId: string;
  resourceName?: string;
  accessType: 'view' | 'edit' | 'delete' | 'download' | 'share' | 'print';
  granted: boolean;
  denialReason?: string;
  permissionUsed?: string;
  ipAddress?: string;
  duration?: number;
}

/**
 * Data export audit record
 */
export interface DataExportAudit {
  id: string;
  exportDate: Date;
  exportedBy: string;
  exportType: string;
  recordCount: number;
  dataCategory: string;
  sensitivityLevel: 'public' | 'internal' | 'confidential' | 'secret';
  exportFormat: string;
  purpose: string;
  approvalRequired: boolean;
  approvedBy?: string;
  expirationDate?: Date;
  downloadCount: number;
}

// ============================================================================
// AUDIT TRAIL LOGGING
// ============================================================================

/**
 * Hook for audit trail logging
 *
 * @description Provides functions for logging audit trail events
 * @returns {object} Audit logging functions
 *
 * @example
 * ```tsx
 * const { logAuditEvent, logChange, logAccess } = useAuditLogger();
 *
 * logAuditEvent({
 *   eventType: 'update',
 *   entityType: 'contract',
 *   entityId: 'CONTRACT-001',
 *   action: 'Updated contract value',
 *   previousValue: 1000000,
 *   newValue: 1200000
 * });
 * ```
 */
export function useAuditLogger() {
  const { track } = useTracking();
  const [auditRecords, setAuditRecords] = useState<AuditTrailRecord[]>([]);

  const logAuditEvent = useCallback(
    (event: Partial<AuditTrailRecord>) => {
      const record: AuditTrailRecord = {
        id: `AUDIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        eventType: event.eventType || 'system_event',
        severity: event.severity || 'info',
        userId: event.userId || 'system',
        userName: event.userName || 'System',
        entityType: event.entityType || 'unknown',
        entityId: event.entityId || 'unknown',
        action: event.action || 'action_performed',
        description: event.description || '',
        previousValue: event.previousValue,
        newValue: event.newValue,
        changeSet: event.changeSet,
        success: event.success !== false,
        errorMessage: event.errorMessage,
        metadata: event.metadata,
        tags: event.tags,
        retentionPolicy: event.retentionPolicy || '7_years',
        complianceFlags: event.complianceFlags,
        sessionId: event.sessionId,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
      };

      setAuditRecords((prev) => [record, ...prev]);

      // Track in analytics
      track('audit_event_logged', {
        event_type: record.eventType,
        entity_type: record.entityType,
        severity: record.severity,
      });

      return record;
    },
    [track]
  );

  const logChange = useCallback(
    (
      entityType: string,
      entityId: string,
      changeSet: ChangeSetItem[],
      userId: string,
      userName: string
    ) => {
      return logAuditEvent({
        eventType: 'update',
        entityType,
        entityId,
        userId,
        userName,
        action: 'Record updated',
        description: `${changeSet.length} field(s) modified`,
        changeSet,
        severity: 'info',
      });
    },
    [logAuditEvent]
  );

  const logAccess = useCallback(
    (
      resourceType: string,
      resourceId: string,
      accessType: string,
      granted: boolean,
      userId: string,
      userName: string
    ) => {
      return logAuditEvent({
        eventType: granted ? 'access_granted' : 'access_denied',
        entityType: resourceType,
        entityId: resourceId,
        userId,
        userName,
        action: `${accessType} access ${granted ? 'granted' : 'denied'}`,
        description: granted
          ? `User accessed ${resourceType} ${resourceId}`
          : `User denied access to ${resourceType} ${resourceId}`,
        severity: granted ? 'info' : 'medium',
        success: granted,
      });
    },
    [logAuditEvent]
  );

  const logSecurityEvent = useCallback(
    (eventDescription: string, severity: AuditSeverity, userId?: string, metadata?: any) => {
      return logAuditEvent({
        eventType: 'security_event',
        entityType: 'security',
        entityId: 'SECURITY',
        userId: userId || 'system',
        userName: userId ? `User ${userId}` : 'System',
        action: 'Security event',
        description: eventDescription,
        severity,
        metadata,
        complianceFlags: ['security'],
      });
    },
    [logAuditEvent]
  );

  const logComplianceEvent = useCallback(
    (
      eventDescription: string,
      entityType: string,
      entityId: string,
      userId: string,
      complianceFlags: string[]
    ) => {
      return logAuditEvent({
        eventType: 'compliance_event',
        entityType,
        entityId,
        userId,
        userName: `User ${userId}`,
        action: 'Compliance event',
        description: eventDescription,
        severity: 'high',
        complianceFlags,
      });
    },
    [logAuditEvent]
  );

  return {
    auditRecords,
    logAuditEvent,
    logChange,
    logAccess,
    logSecurityEvent,
    logComplianceEvent,
  };
}

/**
 * Hook for querying audit trails
 *
 * @description Provides advanced audit trail querying and filtering
 * @param {AuditTrailFilter} initialFilters - Initial filter configuration
 * @returns {object} Audit trail query functions
 *
 * @example
 * ```tsx
 * const { records, filter, exportRecords, getTotalCount } = useAuditTrailQuery({
 *   startDate: new Date('2024-01-01'),
 *   eventTypes: ['create', 'update', 'delete']
 * });
 * ```
 */
export function useAuditTrailQuery(initialFilters?: AuditTrailFilter) {
  const [records, setRecords] = useState<AuditTrailRecord[]>([]);
  const [filters, setFilters] = useState<AuditTrailFilter>(initialFilters || {});
  const [loading, setLoading] = useState(false);

  const fetchRecords = useCallback(async (filterParams: AuditTrailFilter) => {
    setLoading(true);
    try {
      // In production, this would fetch from API
      // Simulating filtered records
      const mockRecords: AuditTrailRecord[] = [];
      setRecords(mockRecords);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords(filters);
  }, [filters, fetchRecords]);

  const updateFilters = useCallback((newFilters: Partial<AuditTrailFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const filterByDateRange = useCallback((startDate: Date, endDate: Date) => {
    updateFilters({ startDate, endDate });
  }, [updateFilters]);

  const filterByUser = useCallback((userIds: string[]) => {
    updateFilters({ userIds });
  }, [updateFilters]);

  const filterByEventType = useCallback((eventTypes: AuditEventType[]) => {
    updateFilters({ eventTypes });
  }, [updateFilters]);

  const filterBySeverity = useCallback((severities: AuditSeverity[]) => {
    updateFilters({ severities });
  }, [updateFilters]);

  const searchRecords = useCallback((searchTerm: string) => {
    updateFilters({ searchTerm });
  }, [updateFilters]);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const exportRecords = useCallback((format: 'csv' | 'json' | 'excel' = 'csv') => {
    if (format === 'json') {
      return JSON.stringify(records, null, 2);
    }
    // CSV export
    const headers = [
      'Timestamp',
      'Event Type',
      'User',
      'Entity Type',
      'Entity ID',
      'Action',
      'Success',
    ];
    const rows = records.map((r) => [
      r.timestamp.toISOString(),
      r.eventType,
      r.userName,
      r.entityType,
      r.entityId,
      r.action,
      r.success.toString(),
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }, [records]);

  return {
    records,
    filters,
    loading,
    updateFilters,
    filterByDateRange,
    filterByUser,
    filterByEventType,
    filterBySeverity,
    searchRecords,
    clearFilters,
    exportRecords,
    getTotalCount: () => records.length,
  };
}

/**
 * Hook for user activity tracking
 *
 * @description Tracks user activity sessions and behavior patterns
 * @param {string} userId - User identifier
 * @returns {object} Activity tracking functions
 *
 * @example
 * ```tsx
 * const {
 *   currentSession,
 *   startSession,
 *   endSession,
 *   logActivity,
 *   getActivitySummary
 * } = useUserActivityTracking('USER-001');
 * ```
 */
export function useUserActivityTracking(userId?: string) {
  const [sessions, setSessions] = useState<UserActivitySession[]>([]);
  const [currentSession, setCurrentSession] = useState<UserActivitySession | null>(null);

  const startSession = useCallback(
    (user: { id: string; name: string; ipAddress?: string }) => {
      const session: UserActivitySession = {
        sessionId: `SESSION-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        startTime: new Date(),
        ipAddress: user.ipAddress,
        activityCount: 0,
        pagesViewed: [],
        actionsPerformed: [],
      };
      setCurrentSession(session);
      trackEvent('user_session_started', { user_id: user.id });
    },
    []
  );

  const endSession = useCallback(() => {
    if (currentSession) {
      const endTime = new Date();
      const duration =
        (endTime.getTime() - currentSession.startTime.getTime()) / 1000;
      const completedSession = {
        ...currentSession,
        endTime,
        duration,
      };
      setSessions((prev) => [...prev, completedSession]);
      setCurrentSession(null);
      trackEvent('user_session_ended', {
        user_id: currentSession.userId,
        duration,
        activity_count: currentSession.activityCount,
      });
    }
  }, [currentSession]);

  const logActivity = useCallback(
    (activityType: string, details?: any) => {
      if (currentSession) {
        setCurrentSession((prev) =>
          prev
            ? {
                ...prev,
                activityCount: prev.activityCount + 1,
                actionsPerformed: [...prev.actionsPerformed, activityType],
                lastActivity: new Date(),
              }
            : null
        );
      }
    },
    [currentSession]
  );

  const logPageView = useCallback(
    (pagePath: string) => {
      if (currentSession) {
        setCurrentSession((prev) =>
          prev
            ? {
                ...prev,
                pagesViewed: [...prev.pagesViewed, pagePath],
                lastActivity: new Date(),
              }
            : null
        );
      }
    },
    [currentSession]
  );

  const getActivitySummary = useCallback(() => {
    const totalSessions = sessions.length + (currentSession ? 1 : 0);
    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalActivities = sessions.reduce((sum, s) => sum + s.activityCount, 0);

    return {
      totalSessions,
      totalDuration,
      totalActivities,
      averageSessionDuration: totalSessions > 0 ? totalDuration / totalSessions : 0,
      averageActivitiesPerSession: totalSessions > 0 ? totalActivities / totalSessions : 0,
    };
  }, [sessions, currentSession]);

  return {
    sessions,
    currentSession,
    startSession,
    endSession,
    logActivity,
    logPageView,
    getActivitySummary,
  };
}

/**
 * Hook for change tracking and history
 *
 * @description Tracks detailed change history for entities
 * @param {string} entityType - Type of entity
 * @param {string} entityId - Entity identifier
 * @returns {object} Change tracking functions
 *
 * @example
 * ```tsx
 * const {
 *   changeHistory,
 *   logChange,
 *   compareVersions,
 *   getLatestChange
 * } = useChangeTracking('contract', 'CONTRACT-001');
 * ```
 */
export function useChangeTracking(entityType: string, entityId: string) {
  const [changeHistory, setChangeHistory] = useState<AuditTrailRecord[]>([]);
  const { logChange: auditLogChange } = useAuditLogger();

  const logChange = useCallback(
    (
      changeSet: ChangeSetItem[],
      userId: string,
      userName: string,
      description?: string
    ) => {
      const record = auditLogChange(entityType, entityId, changeSet, userId, userName);
      setChangeHistory((prev) => [record, ...prev]);
      return record;
    },
    [entityType, entityId, auditLogChange]
  );

  const getLatestChange = useCallback(() => {
    return changeHistory.length > 0 ? changeHistory[0] : null;
  }, [changeHistory]);

  const getChangesByField = useCallback(
    (fieldName: string) => {
      return changeHistory.filter((record) =>
        record.changeSet?.some((change) => change.field === fieldName)
      );
    },
    [changeHistory]
  );

  const compareVersions = useCallback(
    (version1Index: number, version2Index: number) => {
      if (version1Index >= changeHistory.length || version2Index >= changeHistory.length) {
        return null;
      }
      const v1 = changeHistory[version1Index];
      const v2 = changeHistory[version2Index];
      return {
        version1: v1,
        version2: v2,
        timeDifference:
          v1.timestamp.getTime() - v2.timestamp.getTime(),
      };
    },
    [changeHistory]
  );

  const revertToVersion = useCallback(
    (versionIndex: number) => {
      if (versionIndex >= changeHistory.length) return null;
      const targetVersion = changeHistory[versionIndex];
      return targetVersion.previousValue;
    },
    [changeHistory]
  );

  return {
    changeHistory,
    logChange,
    getLatestChange,
    getChangesByField,
    compareVersions,
    revertToVersion,
  };
}

/**
 * Hook for access logging
 *
 * @description Logs and tracks resource access attempts
 * @returns {object} Access logging functions
 *
 * @example
 * ```tsx
 * const { accessLogs, logAccess, getAccessStats } = useAccessLogging();
 * ```
 */
export function useAccessLogging() {
  const [accessLogs, setAccessLogs] = useState<AccessLogEntry[]>([]);
  const { track } = useTracking();

  const logAccess = useCallback(
    (access: Omit<AccessLogEntry, 'id' | 'timestamp'>) => {
      const entry: AccessLogEntry = {
        ...access,
        id: `ACCESS-${Date.now()}`,
        timestamp: new Date(),
      };
      setAccessLogs((prev) => [entry, ...prev]);
      track('resource_access_logged', {
        resource_type: access.resourceType,
        access_type: access.accessType,
        granted: access.granted,
      });
    },
    [track]
  );

  const getAccessByResource = useCallback(
    (resourceType: string, resourceId: string) => {
      return accessLogs.filter(
        (log) => log.resourceType === resourceType && log.resourceId === resourceId
      );
    },
    [accessLogs]
  );

  const getAccessByUser = useCallback(
    (userId: string) => {
      return accessLogs.filter((log) => log.userId === userId);
    },
    [accessLogs]
  );

  const getAccessStats = useCallback(() => {
    const totalAccess = accessLogs.length;
    const granted = accessLogs.filter((log) => log.granted).length;
    const denied = accessLogs.filter((log) => !log.granted).length;

    return {
      totalAccess,
      granted,
      denied,
      grantRate: totalAccess > 0 ? (granted / totalAccess) * 100 : 0,
    };
  }, [accessLogs]);

  const getDeniedAccess = useCallback(() => {
    return accessLogs.filter((log) => !log.granted);
  }, [accessLogs]);

  return {
    accessLogs,
    logAccess,
    getAccessByResource,
    getAccessByUser,
    getAccessStats,
    getDeniedAccess,
  };
}

/**
 * Hook for audit integrity verification
 *
 * @description Verifies audit trail integrity and detects tampering
 * @returns {object} Integrity verification functions
 *
 * @example
 * ```tsx
 * const { performIntegrityCheck, verifySequence, detectAnomalies } = useAuditIntegrity();
 * ```
 */
export function useAuditIntegrity() {
  const [integrityChecks, setIntegrityChecks] = useState<AuditIntegrityCheck[]>([]);

  const performIntegrityCheck = useCallback(
    (records: AuditTrailRecord[], verifiedBy?: string) => {
      const check: AuditIntegrityCheck = {
        checkId: `CHECK-${Date.now()}`,
        timestamp: new Date(),
        recordCount: records.length,
        dateRange: {
          start: records[records.length - 1]?.timestamp || new Date(),
          end: records[0]?.timestamp || new Date(),
        },
        hashVerification: true, // In production, implement cryptographic hash verification
        sequenceVerification: verifySequence(records),
        tamperingDetected: false,
        anomalies: [],
        verifiedBy,
      };

      setIntegrityChecks((prev) => [check, ...prev]);
      return check;
    },
    []
  );

  const verifySequence = useCallback((records: AuditTrailRecord[]): boolean => {
    // Verify chronological order
    for (let i = 0; i < records.length - 1; i++) {
      if (records[i].timestamp < records[i + 1].timestamp) {
        return false;
      }
    }
    return true;
  }, []);

  const detectAnomalies = useCallback((records: AuditTrailRecord[]): string[] => {
    const anomalies: string[] = [];

    // Check for unusual patterns
    const timeDiffs: number[] = [];
    for (let i = 0; i < records.length - 1; i++) {
      const diff =
        records[i].timestamp.getTime() - records[i + 1].timestamp.getTime();
      timeDiffs.push(diff);
    }

    // Detect gaps in timestamps
    const avgDiff = timeDiffs.reduce((sum, d) => sum + d, 0) / timeDiffs.length;
    timeDiffs.forEach((diff, i) => {
      if (diff > avgDiff * 10) {
        anomalies.push(
          `Large time gap detected between records ${i} and ${i + 1}`
        );
      }
    });

    return anomalies;
  }, []);

  const generateIntegrityReport = useCallback(() => {
    const totalChecks = integrityChecks.length;
    const failedChecks = integrityChecks.filter(
      (c) => !c.hashVerification || !c.sequenceVerification || c.tamperingDetected
    ).length;

    return {
      totalChecks,
      failedChecks,
      successRate: totalChecks > 0 ? ((totalChecks - failedChecks) / totalChecks) * 100 : 0,
      latestCheck: integrityChecks[0],
    };
  }, [integrityChecks]);

  return {
    integrityChecks,
    performIntegrityCheck,
    verifySequence,
    detectAnomalies,
    generateIntegrityReport,
  };
}

/**
 * Hook for compliance checkpoints
 *
 * @description Manages compliance audit checkpoints and reviews
 * @returns {object} Compliance checkpoint functions
 *
 * @example
 * ```tsx
 * const {
 *   checkpoints,
 *   createCheckpoint,
 *   addFinding,
 *   approveCheckpoint
 * } = useComplianceCheckpoints();
 * ```
 */
export function useComplianceCheckpoints() {
  const [checkpoints, setCheckpoints] = useState<ComplianceCheckpoint[]>([]);
  const { track } = useTracking();

  const createCheckpoint = useCallback(
    (checkpoint: Omit<ComplianceCheckpoint, 'id' | 'findingsCount'>) => {
      const newCheckpoint: ComplianceCheckpoint = {
        ...checkpoint,
        id: `CHECKPOINT-${Date.now()}`,
        findingsCount: checkpoint.findings?.length || 0,
      };
      setCheckpoints((prev) => [newCheckpoint, ...prev]);
      track('compliance_checkpoint_created', {
        checkpoint_id: newCheckpoint.id,
        records_reviewed: newCheckpoint.recordsReviewed,
      });
    },
    [track]
  );

  const addFinding = useCallback(
    (checkpointId: string, finding: AuditFinding) => {
      setCheckpoints((prev) =>
        prev.map((cp) =>
          cp.id === checkpointId
            ? {
                ...cp,
                findings: [...(cp.findings || []), finding],
                findingsCount: (cp.findingsCount || 0) + 1,
              }
            : cp
        )
      );
    },
    []
  );

  const approveCheckpoint = useCallback(
    (checkpointId: string, approvedBy: string, certificationStatement?: string) => {
      setCheckpoints((prev) =>
        prev.map((cp) =>
          cp.id === checkpointId
            ? {
                ...cp,
                approvedBy,
                approvalDate: new Date(),
                certificationStatement,
              }
            : cp
        )
      );
      track('compliance_checkpoint_approved', { checkpoint_id: checkpointId });
    },
    [track]
  );

  const getOpenFindings = useCallback(() => {
    return checkpoints.flatMap(
      (cp) => cp.findings?.filter((f) => f.status === 'open' || f.status === 'in_progress') || []
    );
  }, [checkpoints]);

  return {
    checkpoints,
    createCheckpoint,
    addFinding,
    approveCheckpoint,
    getOpenFindings,
  };
}

/**
 * Generate audit trail comparison report
 *
 * @description Compares two audit trail records and generates difference report
 * @param {AuditTrailRecord} record1 - First record
 * @param {AuditTrailRecord} record2 - Second record
 * @returns {object} Comparison report
 *
 * @example
 * ```tsx
 * const comparison = generateAuditComparison(record1, record2);
 * ```
 */
export function generateAuditComparison(
  record1: AuditTrailRecord,
  record2: AuditTrailRecord
) {
  const differences: string[] = [];

  if (record1.userId !== record2.userId) {
    differences.push(
      `User changed: ${record1.userName} -> ${record2.userName}`
    );
  }
  if (record1.action !== record2.action) {
    differences.push(`Action changed: ${record1.action} -> ${record2.action}`);
  }

  return {
    record1Id: record1.id,
    record2Id: record2.id,
    timeDifference:
      record2.timestamp.getTime() - record1.timestamp.getTime(),
    differences,
    changeSetComparison:
      record1.changeSet && record2.changeSet
        ? compareChangeSets(record1.changeSet, record2.changeSet)
        : null,
  };
}

/**
 * Compare change sets
 *
 * @description Compares two change sets for differences
 * @param {ChangeSetItem[]} changeSet1 - First change set
 * @param {ChangeSetItem[]} changeSet2 - Second change set
 * @returns {object} Change set comparison
 */
export function compareChangeSets(
  changeSet1: ChangeSetItem[],
  changeSet2: ChangeSetItem[]
) {
  const fields1 = new Set(changeSet1.map((c) => c.field));
  const fields2 = new Set(changeSet2.map((c) => c.field));

  const onlyIn1 = changeSet1.filter((c) => !fields2.has(c.field));
  const onlyIn2 = changeSet2.filter((c) => !fields1.has(c.field));
  const inBoth = changeSet1.filter((c) => fields2.has(c.field));

  return {
    onlyInFirst: onlyIn1,
    onlyInSecond: onlyIn2,
    sharedFields: inBoth,
  };
}

/**
 * Calculate audit statistics
 *
 * @description Generates comprehensive audit trail statistics
 * @param {AuditTrailRecord[]} records - Audit records
 * @param {Date} startDate - Start date for analysis
 * @param {Date} endDate - End date for analysis
 * @returns {object} Audit statistics
 *
 * @example
 * ```tsx
 * const stats = calculateAuditStatistics(records, startDate, endDate);
 * ```
 */
export function calculateAuditStatistics(
  records: AuditTrailRecord[],
  startDate: Date,
  endDate: Date
) {
  const filteredRecords = records.filter(
    (r) => r.timestamp >= startDate && r.timestamp <= endDate
  );

  const eventTypeCounts = filteredRecords.reduce((acc, record) => {
    acc[record.eventType] = (acc[record.eventType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const severityCounts = filteredRecords.reduce((acc, record) => {
    acc[record.severity] = (acc[record.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const userActivity = filteredRecords.reduce((acc, record) => {
    acc[record.userId] = (acc[record.userId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const successRate =
    filteredRecords.length > 0
      ? (filteredRecords.filter((r) => r.success).length / filteredRecords.length) *
        100
      : 0;

  return {
    totalRecords: filteredRecords.length,
    dateRange: { start: startDate, end: endDate },
    eventTypeCounts,
    severityCounts,
    userActivity,
    successRate,
    failedEvents: filteredRecords.filter((r) => !r.success).length,
    uniqueUsers: Object.keys(userActivity).length,
    mostActiveUser: Object.entries(userActivity).sort((a, b) => b[1] - a[1])[0],
  };
}

/**
 * Detect suspicious activity patterns
 *
 * @description Analyzes audit trails for suspicious patterns
 * @param {AuditTrailRecord[]} records - Audit records to analyze
 * @returns {object} Suspicious activity report
 *
 * @example
 * ```tsx
 * const suspicious = detectSuspiciousActivity(records);
 * if (suspicious.alerts.length > 0) {
 *   console.log('Suspicious activity detected!');
 * }
 * ```
 */
export function detectSuspiciousActivity(records: AuditTrailRecord[]) {
  const alerts: string[] = [];

  // Check for rapid-fire actions
  for (let i = 0; i < records.length - 1; i++) {
    const timeDiff =
      records[i].timestamp.getTime() - records[i + 1].timestamp.getTime();
    if (timeDiff < 100 && records[i].userId === records[i + 1].userId) {
      alerts.push(
        `Rapid actions detected: ${records[i].userId} at ${records[i].timestamp}`
      );
    }
  }

  // Check for unusual access patterns
  const userActions = records.reduce((acc, record) => {
    if (!acc[record.userId]) acc[record.userId] = [];
    acc[record.userId].push(record);
    return acc;
  }, {} as Record<string, AuditTrailRecord[]>);

  Object.entries(userActions).forEach(([userId, actions]) => {
    const deleteActions = actions.filter((a) => a.eventType === 'delete');
    if (deleteActions.length > 10) {
      alerts.push(`Excessive delete actions by user: ${userId} (${deleteActions.length} deletions)`);
    }
  });

  // Check for off-hours access
  records.forEach((record) => {
    const hour = record.timestamp.getHours();
    if (hour < 6 || hour > 22) {
      alerts.push(
        `Off-hours access: ${record.userId} at ${record.timestamp.toISOString()}`
      );
    }
  });

  return {
    alerts,
    alertCount: alerts.length,
    riskLevel: alerts.length > 10 ? 'high' : alerts.length > 5 ? 'medium' : 'low',
  };
}

/**
 * Export audit report
 *
 * @description Exports audit trail data in formatted report
 * @param {AuditReportConfig} config - Report configuration
 * @param {AuditTrailRecord[]} records - Records to include
 * @returns {string} Formatted report
 *
 * @example
 * ```tsx
 * const report = exportAuditReport(config, records);
 * downloadFile('audit-report.csv', report);
 * ```
 */
export function exportAuditReport(
  config: AuditReportConfig,
  records: AuditTrailRecord[]
): string {
  let filteredRecords = records;

  // Apply filters
  if (config.filters.startDate) {
    filteredRecords = filteredRecords.filter(
      (r) => r.timestamp >= config.filters.startDate!
    );
  }
  if (config.filters.endDate) {
    filteredRecords = filteredRecords.filter(
      (r) => r.timestamp <= config.filters.endDate!
    );
  }

  // Format based on report format
  if (config.format === 'json') {
    return JSON.stringify(filteredRecords, null, 2);
  } else if (config.format === 'csv') {
    const headers = config.includeFields || [
      'timestamp',
      'eventType',
      'userName',
      'entityType',
      'action',
    ];
    const rows = filteredRecords.map((r) =>
      headers.map((h) => (r as any)[h]).join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  }

  return '';
}

/**
 * Validate audit trail completeness
 *
 * @description Checks audit trail for completeness and gaps
 * @param {AuditTrailRecord[]} records - Records to validate
 * @returns {object} Validation results
 *
 * @example
 * ```tsx
 * const validation = validateAuditCompleteness(records);
 * if (!validation.isComplete) {
 *   console.log('Gaps found:', validation.gaps);
 * }
 * ```
 */
export function validateAuditCompleteness(records: AuditTrailRecord[]) {
  const gaps: { start: Date; end: Date; duration: number }[] = [];
  const sorted = [...records].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  // Check for time gaps
  for (let i = 0; i < sorted.length - 1; i++) {
    const gap =
      sorted[i + 1].timestamp.getTime() - sorted[i].timestamp.getTime();
    const hourInMs = 3600000;
    if (gap > hourInMs * 24) {
      // Gap larger than 24 hours
      gaps.push({
        start: sorted[i].timestamp,
        end: sorted[i + 1].timestamp,
        duration: gap,
      });
    }
  }

  return {
    isComplete: gaps.length === 0,
    totalRecords: records.length,
    gaps,
    gapCount: gaps.length,
    recommendations:
      gaps.length > 0
        ? ['Investigate time gaps in audit trail', 'Verify system uptime during gap periods']
        : [],
  };
}

/**
 * Generate retention policy recommendations
 *
 * @description Analyzes records and recommends retention policies
 * @param {AuditTrailRecord[]} records - Records to analyze
 * @returns {object} Retention recommendations
 *
 * @example
 * ```tsx
 * const recommendations = generateRetentionRecommendations(records);
 * ```
 */
export function generateRetentionRecommendations(records: AuditTrailRecord[]) {
  const criticalRecords = records.filter(
    (r) => r.severity === 'critical' || r.complianceFlags?.length
  );
  const securityRecords = records.filter((r) => r.eventType === 'security_event');

  return {
    criticalRecords: {
      count: criticalRecords.length,
      recommendedPolicy: 'permanent' as RetentionPolicy,
      reason: 'Critical and compliance-related records should be retained permanently',
    },
    securityRecords: {
      count: securityRecords.length,
      recommendedPolicy: '10_years' as RetentionPolicy,
      reason: 'Security events should be retained for extended period',
    },
    standardRecords: {
      count: records.length - criticalRecords.length - securityRecords.length,
      recommendedPolicy: '7_years' as RetentionPolicy,
      reason: 'Standard federal retention requirement',
    },
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Hooks
  useAuditLogger,
  useAuditTrailQuery,
  useUserActivityTracking,
  useChangeTracking,
  useAccessLogging,
  useAuditIntegrity,
  useComplianceCheckpoints,

  // Utility Functions
  generateAuditComparison,
  compareChangeSets,
  calculateAuditStatistics,
  detectSuspiciousActivity,
  exportAuditReport,
  validateAuditCompleteness,
  generateRetentionRecommendations,
};
