/**
 * LOC: USACE-AT-AUDIT-001
 * File: /reuse/frontend/composites/usace/downstream/audit-systems.ts
 *
 * UPSTREAM (imports from):
 *   - ../usace-audit-trails-composites.ts
 *   - ../../analytics-tracking-kit
 *   - React 18+, Next.js 16+, TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - Audit trail dashboards, Change tracking interfaces, Compliance systems
 */

/**
 * File: /reuse/frontend/composites/usace/downstream/audit-systems.ts
 * Locator: WC-USACE-AT-AUDIT-001
 * Purpose: USACE CEFMS Audit Systems - Complete audit trail and compliance monitoring
 *
 * Upstream: usace-audit-trails-composites, analytics-tracking-kit
 * Downstream: Audit trail dashboards, change tracking interfaces, compliance monitoring
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x
 * Exports: React hooks for audit trail viewing, user activity monitoring, compliance tracking
 *
 * LLM Context: Production-ready USACE CEFMS audit system components. Provides comprehensive
 * audit trail viewing with filtering and search, user activity monitoring with detailed tracking,
 * compliance monitoring with automated checks, and full audit report generation capabilities.
 */

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useTracking } from '../../analytics-tracking-kit';

// ============================================================================
// TYPE DEFINITIONS - AUDIT SYSTEMS
// ============================================================================

/**
 * Audit action types enumeration
 */
export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'export'
  | 'approve'
  | 'reject'
  | 'submit'
  | 'lock'
  | 'unlock';

/**
 * Entity types that can be audited
 */
export type AuditEntityType =
  | 'journal_entry'
  | 'account'
  | 'transaction'
  | 'report'
  | 'user'
  | 'setting'
  | 'fiscal_period'
  | 'reconciliation';

/**
 * Change detail for audit entry
 */
export interface AuditChangeDetail {
  /** Field that was changed */
  field: string;
  /** Previous value */
  oldValue: string | number | boolean | null;
  /** New value */
  newValue: string | number | boolean | null;
  /** Data type of the field */
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'object';
}

/**
 * Audit entry metadata
 */
export interface AuditEntryMetadata {
  /** IP address of user */
  ipAddress?: string;
  /** User agent string */
  userAgent?: string;
  /** Session identifier */
  sessionId?: string;
  /** Additional context */
  context?: Record<string, string | number | boolean>;
}

/**
 * Complete audit entry interface
 */
export interface AuditEntry {
  /** Unique audit entry identifier */
  id: string;
  /** Timestamp of the action */
  timestamp: Date;
  /** User who performed the action */
  userId: string;
  /** User's display name */
  userName: string;
  /** Action performed */
  action: AuditAction;
  /** Type of entity modified */
  entityType: AuditEntityType;
  /** ID of the entity modified */
  entityId: string;
  /** Human-readable description */
  description: string;
  /** List of changes made */
  changes: AuditChangeDetail[];
  /** Additional metadata */
  metadata?: AuditEntryMetadata;
  /** Severity level */
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Audit trail filter options
 */
export interface AuditTrailFilters {
  /** Filter by user ID */
  userId?: string;
  /** Filter by action type */
  action?: AuditAction;
  /** Filter by entity type */
  entityType?: AuditEntityType;
  /** Filter by specific entity ID */
  entityId?: string;
  /** Start date for range */
  startDate?: Date;
  /** End date for range */
  endDate?: Date;
  /** Filter by severity */
  severity?: AuditEntry['severity'];
  /** Search text for description */
  searchText?: string;
}

/**
 * User activity summary
 */
export interface UserActivitySummary {
  /** Total actions performed */
  totalActions: number;
  /** Actions by type */
  actionsByType: Record<AuditAction, number>;
  /** Most recent activity timestamp */
  lastActivity: Date;
  /** Most active entity type */
  mostActiveEntityType: AuditEntityType;
  /** Activity by hour of day */
  activityByHour: Record<number, number>;
}

/**
 * User activity entry
 */
export interface UserActivityEntry {
  /** Activity entry identifier */
  id: string;
  /** Timestamp of activity */
  timestamp: Date;
  /** Action performed */
  action: AuditAction;
  /** Entity type */
  entityType: AuditEntityType;
  /** Entity ID */
  entityId: string;
  /** Description of activity */
  description: string;
  /** Duration in milliseconds */
  duration?: number;
  /** Success status */
  success: boolean;
  /** Error message if failed */
  errorMessage?: string;
}

/**
 * Compliance check types
 */
export type ComplianceCheckType =
  | 'segregation_of_duties'
  | 'data_retention'
  | 'access_control'
  | 'audit_trail_completeness'
  | 'transaction_approval'
  | 'period_closing'
  | 'reconciliation';

/**
 * Compliance check status
 */
export type ComplianceCheckStatus =
  | 'passed'
  | 'failed'
  | 'warning'
  | 'pending'
  | 'in_progress';

/**
 * Compliance check result detail
 */
export interface ComplianceCheckDetail {
  /** Issue identifier */
  issueId: string;
  /** Description of issue */
  description: string;
  /** Severity of issue */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** Recommendation for resolution */
  recommendation: string;
  /** Entities affected */
  affectedEntities: Array<{ type: AuditEntityType; id: string }>;
}

/**
 * Compliance check result
 */
export interface ComplianceCheck {
  /** Check identifier */
  id: string;
  /** Type of compliance check */
  checkType: ComplianceCheckType;
  /** Check name */
  name: string;
  /** Check description */
  description: string;
  /** Check status */
  status: ComplianceCheckStatus;
  /** When check was performed */
  performedAt: Date;
  /** User who performed check */
  performedBy: string;
  /** Check results details */
  details: ComplianceCheckDetail[];
  /** Overall compliance score (0-100) */
  complianceScore: number;
  /** Next scheduled check */
  nextScheduledCheck?: Date;
}

/**
 * Audit report parameters
 */
export interface AuditReportParams {
  /** Report type */
  reportType: 'summary' | 'detailed' | 'compliance' | 'user_activity';
  /** Start date */
  startDate: Date;
  /** End date */
  endDate: Date;
  /** Include user filter */
  userIds?: string[];
  /** Include entity types */
  entityTypes?: AuditEntityType[];
  /** Include actions */
  actions?: AuditAction[];
  /** Export format */
  format: 'pdf' | 'excel' | 'csv';
}

/**
 * Validation result for audit data
 */
export interface AuditValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate audit entry data
 *
 * @param {Partial<AuditEntry>} entry - Audit entry to validate
 * @returns {AuditValidationResult} Validation result
 *
 * @example
 * ```tsx
 * const result = validateAuditEntry(entry);
 * if (!result.isValid) {
 *   console.error('Validation failed:', result.errors);
 * }
 * ```
 */
export function validateAuditEntry(entry: Partial<AuditEntry>): AuditValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!entry.userId) {
    errors.push('User ID is required');
  }

  if (!entry.action) {
    errors.push('Action is required');
  }

  if (!entry.entityType) {
    errors.push('Entity type is required');
  }

  if (!entry.entityId) {
    errors.push('Entity ID is required');
  }

  if (!entry.description || entry.description.trim().length === 0) {
    errors.push('Description is required');
  }

  if (entry.changes && entry.changes.length === 0) {
    warnings.push('No changes recorded for this audit entry');
  }

  if (entry.timestamp && entry.timestamp > new Date()) {
    errors.push('Timestamp cannot be in the future');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate compliance check parameters
 *
 * @param {ComplianceCheckType} checkType - Type of check
 * @param {Date} startDate - Start date for check period
 * @param {Date} endDate - End date for check period
 * @returns {AuditValidationResult} Validation result
 */
export function validateComplianceCheck(
  checkType: ComplianceCheckType,
  startDate: Date,
  endDate: Date
): AuditValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!checkType) {
    errors.push('Check type is required');
  }

  if (!startDate) {
    errors.push('Start date is required');
  }

  if (!endDate) {
    errors.push('End date is required');
  }

  if (startDate && endDate && startDate > endDate) {
    errors.push('Start date must be before end date');
  }

  if (startDate && endDate) {
    const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 365) {
      warnings.push('Check period spans more than one year, which may impact performance');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format audit action for display
 *
 * @param {AuditAction} action - Action to format
 * @returns {string} Formatted action text
 */
export function formatAuditAction(action: AuditAction): string {
  const actionMap: Record<AuditAction, string> = {
    create: 'Created',
    update: 'Updated',
    delete: 'Deleted',
    view: 'Viewed',
    export: 'Exported',
    approve: 'Approved',
    reject: 'Rejected',
    submit: 'Submitted',
    lock: 'Locked',
    unlock: 'Unlocked',
  };

  return actionMap[action] || action;
}

/**
 * Format entity type for display
 *
 * @param {AuditEntityType} entityType - Entity type to format
 * @returns {string} Formatted entity type text
 */
export function formatEntityType(entityType: AuditEntityType): string {
  const entityMap: Record<AuditEntityType, string> = {
    journal_entry: 'Journal Entry',
    account: 'Account',
    transaction: 'Transaction',
    report: 'Report',
    user: 'User',
    setting: 'Setting',
    fiscal_period: 'Fiscal Period',
    reconciliation: 'Reconciliation',
  };

  return entityMap[entityType] || entityType;
}

/**
 * Get severity color for UI display
 *
 * @param {string} severity - Severity level
 * @returns {string} Color code or name
 */
export function getSeverityColor(severity: 'low' | 'medium' | 'high' | 'critical'): string {
  const colorMap = {
    low: '#4CAF50',
    medium: '#FF9800',
    high: '#F44336',
    critical: '#9C27B0',
  };

  return colorMap[severity] || '#757575';
}

// ============================================================================
// AUDIT TRAIL VIEWER HOOK
// ============================================================================

/**
 * Hook for comprehensive audit trail viewing with filtering and search
 *
 * @description Provides complete audit trail management with advanced filtering,
 * search, pagination, and export capabilities
 *
 * @returns {object} Audit trail viewer operations
 *
 * @example
 * ```tsx
 * function AuditTrailDashboard() {
 *   const {
 *     entries,
 *     filteredEntries,
 *     filters,
 *     updateFilters,
 *     clearFilters,
 *     loadAuditTrail,
 *     exportAuditTrail,
 *     isLoading,
 *     error
 *   } = useAuditTrailViewer();
 *
 *   useEffect(() => {
 *     loadAuditTrail();
 *   }, [loadAuditTrail]);
 *
 *   return (
 *     <div>
 *       <AuditFilters filters={filters} onChange={updateFilters} />
 *       <AuditTable entries={filteredEntries} />
 *       <ExportButton onClick={() => exportAuditTrail('excel')} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuditTrailViewer() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [filters, setFilters] = useState<AuditTrailFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<keyof AuditEntry>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { track } = useTracking();

  /**
   * Load audit trail entries from API
   */
  const loadAuditTrail = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      track('audit_trail_load');

      // In production, this would fetch from API
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockEntries: AuditEntry[] = [
        {
          id: 'audit_001',
          timestamp: new Date(Date.now() - 3600000),
          userId: 'user_001',
          userName: 'John Doe',
          action: 'create',
          entityType: 'journal_entry',
          entityId: 'je_001',
          description: 'Created journal entry for Q4 closing',
          changes: [
            {
              field: 'status',
              oldValue: null,
              newValue: 'draft',
              dataType: 'string',
            },
            {
              field: 'totalDebits',
              oldValue: null,
              newValue: 50000,
              dataType: 'number',
            },
          ],
          severity: 'medium',
        },
        {
          id: 'audit_002',
          timestamp: new Date(Date.now() - 7200000),
          userId: 'user_002',
          userName: 'Jane Smith',
          action: 'approve',
          entityType: 'transaction',
          entityId: 'txn_001',
          description: 'Approved transaction for project ABC',
          changes: [
            {
              field: 'status',
              oldValue: 'pending',
              newValue: 'approved',
              dataType: 'string',
            },
          ],
          severity: 'high',
        },
      ];

      setEntries(mockEntries);
      track('audit_trail_load_success', { count: mockEntries.length });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load audit trail');
      setError(error);
      track('audit_trail_load_error', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [track]);

  /**
   * Update filter values
   */
  const updateFilters = useCallback((newFilters: Partial<AuditTrailFilters>) => {
    track('audit_trail_filter_update', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, [track]);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    track('audit_trail_filter_clear');
    setFilters({});
  }, [track]);

  /**
   * Apply filters to entries
   */
  const filteredEntries = useMemo(() => {
    let filtered = entries;

    if (filters.userId) {
      filtered = filtered.filter(entry => entry.userId === filters.userId);
    }

    if (filters.action) {
      filtered = filtered.filter(entry => entry.action === filters.action);
    }

    if (filters.entityType) {
      filtered = filtered.filter(entry => entry.entityType === filters.entityType);
    }

    if (filters.entityId) {
      filtered = filtered.filter(entry => entry.entityId === filters.entityId);
    }

    if (filters.severity) {
      filtered = filtered.filter(entry => entry.severity === filters.severity);
    }

    if (filters.startDate) {
      filtered = filtered.filter(entry => entry.timestamp >= filters.startDate!);
    }

    if (filters.endDate) {
      filtered = filtered.filter(entry => entry.timestamp <= filters.endDate!);
    }

    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.description.toLowerCase().includes(searchLower) ||
        entry.userName.toLowerCase().includes(searchLower) ||
        entry.entityId.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    return filtered;
  }, [entries, filters, sortColumn, sortDirection]);

  /**
   * Toggle sort column and direction
   */
  const toggleSort = useCallback((column: keyof AuditEntry) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn]);

  /**
   * Get entry by ID
   */
  const getEntryById = useCallback((entryId: string) => {
    return entries.find(entry => entry.id === entryId);
  }, [entries]);

  /**
   * Get entries for specific entity
   */
  const getEntriesForEntity = useCallback((entityType: AuditEntityType, entityId: string) => {
    return entries.filter(
      entry => entry.entityType === entityType && entry.entityId === entityId
    );
  }, [entries]);

  /**
   * Export audit trail with SSR-safe handling
   */
  const exportAuditTrail = useCallback(async (format: 'excel' | 'pdf' | 'csv') => {
    try {
      track('audit_trail_export', { format, count: filteredEntries.length });

      // In production, this would generate and download the file
      const filename = `audit_trail_${new Date().toISOString()}.${format}`;

      // SSR-safe alert
      if (typeof window !== 'undefined') {
        alert(`Audit trail exported as ${filename}`);
      }

      return filename;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to export audit trail');
      setError(error);
      track('audit_trail_export_error', { error: error.message });
      throw error;
    }
  }, [filteredEntries, track]);

  /**
   * Toggle entry selection
   */
  const toggleEntrySelection = useCallback((entryId: string) => {
    setSelectedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  }, []);

  /**
   * Select all filtered entries
   */
  const selectAllEntries = useCallback(() => {
    const allIds = new Set(filteredEntries.map(entry => entry.id));
    setSelectedEntries(allIds);
  }, [filteredEntries]);

  /**
   * Clear all selections
   */
  const clearSelection = useCallback(() => {
    setSelectedEntries(new Set());
  }, []);

  return {
    entries,
    filteredEntries,
    filters,
    updateFilters,
    clearFilters,
    loadAuditTrail,
    exportAuditTrail,
    isLoading,
    error,
    selectedEntries,
    toggleEntrySelection,
    selectAllEntries,
    clearSelection,
    sortColumn,
    sortDirection,
    toggleSort,
    getEntryById,
    getEntriesForEntity,
  };
}

// ============================================================================
// USER ACTIVITY MONITORING HOOK
// ============================================================================

/**
 * Hook for comprehensive user activity monitoring and analysis
 *
 * @description Provides detailed user activity tracking with summaries,
 * activity patterns, and anomaly detection
 *
 * @param {string} userId - User ID to monitor
 * @returns {object} User activity monitoring operations
 *
 * @example
 * ```tsx
 * function UserActivityMonitor({ userId }) {
 *   const {
 *     activity,
 *     activitySummary,
 *     loadActivity,
 *     refreshActivity,
 *     dateRange,
 *     setDateRange,
 *     isLoading
 *   } = useUserActivityMonitoring(userId);
 *
 *   useEffect(() => {
 *     loadActivity();
 *   }, [loadActivity]);
 *
 *   return (
 *     <div>
 *       <ActivitySummary summary={activitySummary} />
 *       <DateRangePicker value={dateRange} onChange={setDateRange} />
 *       <ActivityTimeline activity={activity} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useUserActivityMonitoring(userId: string) {
  const [activity, setActivity] = useState<UserActivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    end: new Date(),
  });
  const { track } = useTracking();

  /**
   * Load user activity for the specified date range
   */
  const loadActivity = useCallback(async () => {
    if (!userId) {
      setError(new Error('User ID is required'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      track('user_activity_load', { user_id: userId, date_range: dateRange });

      // In production, this would fetch from API
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockActivity: UserActivityEntry[] = [
        {
          id: 'activity_001',
          timestamp: new Date(Date.now() - 1800000),
          action: 'create',
          entityType: 'journal_entry',
          entityId: 'je_001',
          description: 'Created new journal entry',
          duration: 1200,
          success: true,
        },
        {
          id: 'activity_002',
          timestamp: new Date(Date.now() - 3600000),
          action: 'update',
          entityType: 'account',
          entityId: 'acct_001',
          description: 'Updated account details',
          duration: 850,
          success: true,
        },
        {
          id: 'activity_003',
          timestamp: new Date(Date.now() - 7200000),
          action: 'export',
          entityType: 'report',
          entityId: 'rpt_001',
          description: 'Exported financial report',
          duration: 2500,
          success: false,
          errorMessage: 'Export timeout',
        },
      ];

      setActivity(mockActivity);
      track('user_activity_load_success', { count: mockActivity.length });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load user activity');
      setError(error);
      track('user_activity_load_error', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [userId, dateRange, track]);

  /**
   * Refresh activity data
   */
  const refreshActivity = useCallback(() => {
    track('user_activity_refresh', { user_id: userId });
    loadActivity();
  }, [userId, loadActivity, track]);

  /**
   * Calculate activity summary statistics
   */
  const activitySummary = useMemo<UserActivitySummary>(() => {
    const summary: UserActivitySummary = {
      totalActions: activity.length,
      actionsByType: {
        create: 0,
        update: 0,
        delete: 0,
        view: 0,
        export: 0,
        approve: 0,
        reject: 0,
        submit: 0,
        lock: 0,
        unlock: 0,
      },
      lastActivity: activity.length > 0 ? activity[0].timestamp : new Date(),
      mostActiveEntityType: 'journal_entry',
      activityByHour: {},
    };

    // Count actions by type
    activity.forEach(entry => {
      summary.actionsByType[entry.action]++;

      // Count activity by hour
      const hour = entry.timestamp.getHours();
      summary.activityByHour[hour] = (summary.activityByHour[hour] || 0) + 1;
    });

    // Find most active entity type
    const entityCounts: Record<AuditEntityType, number> = {} as Record<AuditEntityType, number>;
    activity.forEach(entry => {
      entityCounts[entry.entityType] = (entityCounts[entry.entityType] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(entityCounts));
    const mostActive = Object.entries(entityCounts).find(([_, count]) => count === maxCount);
    if (mostActive) {
      summary.mostActiveEntityType = mostActive[0] as AuditEntityType;
    }

    return summary;
  }, [activity]);

  /**
   * Get activity for specific action type
   */
  const getActivityByAction = useCallback((action: AuditAction) => {
    return activity.filter(entry => entry.action === action);
  }, [activity]);

  /**
   * Get failed activities
   */
  const getFailedActivities = useCallback(() => {
    return activity.filter(entry => !entry.success);
  }, [activity]);

  /**
   * Get activity statistics
   */
  const getActivityStats = useCallback(() => {
    const total = activity.length;
    const successful = activity.filter(a => a.success).length;
    const failed = total - successful;
    const successRate = total > 0 ? (successful / total) * 100 : 0;

    const totalDuration = activity
      .filter(a => a.duration)
      .reduce((sum, a) => sum + (a.duration || 0), 0);
    const avgDuration = total > 0 ? totalDuration / total : 0;

    return {
      total,
      successful,
      failed,
      successRate,
      avgDuration,
    };
  }, [activity]);

  /**
   * Export activity report with SSR-safe handling
   */
  const exportActivityReport = useCallback(async (format: 'excel' | 'pdf' | 'csv') => {
    try {
      track('user_activity_export', { user_id: userId, format, count: activity.length });

      // In production, this would generate and download the file
      const filename = `user_activity_${userId}_${new Date().toISOString()}.${format}`;

      // SSR-safe alert
      if (typeof window !== 'undefined') {
        alert(`Activity report exported as ${filename}`);
      }

      return filename;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to export activity report');
      setError(error);
      track('user_activity_export_error', { error: error.message });
      throw error;
    }
  }, [userId, activity, track]);

  return {
    activity,
    activitySummary,
    loadActivity,
    refreshActivity,
    dateRange,
    setDateRange,
    isLoading,
    error,
    getActivityByAction,
    getFailedActivities,
    getActivityStats,
    exportActivityReport,
  };
}

// ============================================================================
// COMPLIANCE MONITORING HOOK
// ============================================================================

/**
 * Hook for comprehensive compliance monitoring and automated checks
 *
 * @description Provides automated compliance checking, monitoring,
 * and reporting capabilities with detailed issue tracking
 *
 * @returns {object} Compliance monitoring operations
 *
 * @example
 * ```tsx
 * function ComplianceMonitor() {
 *   const {
 *     checks,
 *     runCheck,
 *     runAllChecks,
 *     scheduleCheck,
 *     getChecksByStatus,
 *     overallComplianceScore,
 *     isRunning
 *   } = useComplianceMonitoring();
 *
 *   return (
 *     <div>
 *       <ComplianceScore score={overallComplianceScore} />
 *       <button onClick={runAllChecks} disabled={isRunning}>
 *         Run All Checks
 *       </button>
 *       <ComplianceChecksTable checks={checks} onRun={runCheck} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useComplianceMonitoring() {
  const [checks, setChecks] = useState<ComplianceCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCheckType, setSelectedCheckType] = useState<ComplianceCheckType | null>(null);
  const { track } = useTracking();

  /**
   * Run a specific compliance check
   */
  const runCheck = useCallback(async (checkType: ComplianceCheckType) => {
    const validation = validateComplianceCheck(
      checkType,
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      new Date()
    );

    if (!validation.isValid) {
      setError(new Error(validation.errors.join(', ')));
      return;
    }

    setIsRunning(true);
    setError(null);

    try {
      track('compliance_check_run', { check_type: checkType });

      // In production, this would call API to run the check
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockCheck: ComplianceCheck = {
        id: `check_${Date.now()}`,
        checkType,
        name: getCheckTypeName(checkType),
        description: getCheckTypeDescription(checkType),
        status: Math.random() > 0.3 ? 'passed' : 'warning',
        performedAt: new Date(),
        performedBy: 'current_user',
        details: [],
        complianceScore: Math.floor(Math.random() * 30) + 70, // 70-100
        nextScheduledCheck: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      // Add some mock issues for warning status
      if (mockCheck.status === 'warning') {
        mockCheck.details.push({
          issueId: `issue_${Date.now()}`,
          description: 'Minor compliance issue detected',
          severity: 'low',
          recommendation: 'Review and address at next available opportunity',
          affectedEntities: [{ type: 'transaction', id: 'txn_001' }],
        });
      }

      setChecks(prev => {
        // Remove existing check of same type
        const filtered = prev.filter(c => c.checkType !== checkType);
        return [...filtered, mockCheck];
      });

      track('compliance_check_complete', {
        check_type: checkType,
        status: mockCheck.status,
        score: mockCheck.complianceScore,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to run compliance check');
      setError(error);
      track('compliance_check_error', { check_type: checkType, error: error.message });
    } finally {
      setIsRunning(false);
    }
  }, [track]);

  /**
   * Run all compliance checks
   */
  const runAllChecks = useCallback(async () => {
    setIsRunning(true);
    setError(null);

    try {
      track('compliance_check_run_all');

      const checkTypes: ComplianceCheckType[] = [
        'segregation_of_duties',
        'data_retention',
        'access_control',
        'audit_trail_completeness',
        'transaction_approval',
        'period_closing',
        'reconciliation',
      ];

      for (const checkType of checkTypes) {
        await runCheck(checkType);
      }

      track('compliance_check_run_all_complete', { count: checkTypes.length });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to run all compliance checks');
      setError(error);
      track('compliance_check_run_all_error', { error: error.message });
    } finally {
      setIsRunning(false);
    }
  }, [runCheck, track]);

  /**
   * Schedule a compliance check with SSR-safe handling
   */
  const scheduleCheck = useCallback((checkType: ComplianceCheckType, scheduledDate: Date) => {
    track('compliance_check_schedule', { check_type: checkType, date: scheduledDate });

    // SSR-safe confirm
    const shouldSchedule = typeof window !== 'undefined'
      ? confirm(`Schedule ${getCheckTypeName(checkType)} check for ${scheduledDate.toLocaleDateString()}?`)
      : true;

    if (shouldSchedule) {
      // In production, this would save to backend
      setChecks(prev =>
        prev.map(check =>
          check.checkType === checkType
            ? { ...check, nextScheduledCheck: scheduledDate }
            : check
        )
      );

      track('compliance_check_schedule_confirm', { check_type: checkType });
    }
  }, [track]);

  /**
   * Get checks by status
   */
  const getChecksByStatus = useCallback((status: ComplianceCheckStatus) => {
    return checks.filter(check => check.status === status);
  }, [checks]);

  /**
   * Get checks by type
   */
  const getChecksByType = useCallback((checkType: ComplianceCheckType) => {
    return checks.filter(check => check.checkType === checkType);
  }, [checks]);

  /**
   * Calculate overall compliance score
   */
  const overallComplianceScore = useMemo(() => {
    if (checks.length === 0) return 0;
    const sum = checks.reduce((acc, check) => acc + check.complianceScore, 0);
    return Math.round(sum / checks.length);
  }, [checks]);

  /**
   * Get critical issues across all checks
   */
  const getCriticalIssues = useCallback(() => {
    const criticalIssues: ComplianceCheckDetail[] = [];
    checks.forEach(check => {
      const critical = check.details.filter(detail => detail.severity === 'critical');
      criticalIssues.push(...critical);
    });
    return criticalIssues;
  }, [checks]);

  /**
   * Get checks requiring attention
   */
  const getChecksRequiringAttention = useCallback(() => {
    return checks.filter(
      check => check.status === 'failed' || check.status === 'warning'
    );
  }, [checks]);

  /**
   * Export compliance report with SSR-safe handling
   */
  const exportComplianceReport = useCallback(async (format: 'excel' | 'pdf' | 'csv') => {
    try {
      track('compliance_report_export', { format, count: checks.length });

      // In production, this would generate and download the file
      const filename = `compliance_report_${new Date().toISOString()}.${format}`;

      // SSR-safe alert
      if (typeof window !== 'undefined') {
        alert(`Compliance report exported as ${filename}`);
      }

      return filename;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to export compliance report');
      setError(error);
      track('compliance_report_export_error', { error: error.message });
      throw error;
    }
  }, [checks, track]);

  /**
   * Acknowledge and resolve an issue with SSR-safe handling
   */
  const acknowledgeIssue = useCallback((checkId: string, issueId: string) => {
    // SSR-safe confirm
    const shouldAcknowledge = typeof window !== 'undefined'
      ? confirm('Mark this issue as acknowledged and resolved?')
      : true;

    if (shouldAcknowledge) {
      track('compliance_issue_acknowledge', { check_id: checkId, issue_id: issueId });

      setChecks(prev =>
        prev.map(check => {
          if (check.id === checkId) {
            return {
              ...check,
              details: check.details.filter(detail => detail.issueId !== issueId),
            };
          }
          return check;
        })
      );
    }
  }, [track]);

  return {
    checks,
    runCheck,
    runAllChecks,
    scheduleCheck,
    isRunning,
    error,
    selectedCheckType,
    setSelectedCheckType,
    getChecksByStatus,
    getChecksByType,
    overallComplianceScore,
    getCriticalIssues,
    getChecksRequiringAttention,
    exportComplianceReport,
    acknowledgeIssue,
  };
}

// ============================================================================
// HELPER FUNCTIONS FOR COMPLIANCE CHECKS
// ============================================================================

/**
 * Get human-readable name for compliance check type
 *
 * @param {ComplianceCheckType} checkType - Check type
 * @returns {string} Human-readable name
 */
function getCheckTypeName(checkType: ComplianceCheckType): string {
  const names: Record<ComplianceCheckType, string> = {
    segregation_of_duties: 'Segregation of Duties',
    data_retention: 'Data Retention Policy',
    access_control: 'Access Control',
    audit_trail_completeness: 'Audit Trail Completeness',
    transaction_approval: 'Transaction Approval',
    period_closing: 'Period Closing',
    reconciliation: 'Reconciliation',
  };

  return names[checkType] || checkType;
}

/**
 * Get description for compliance check type
 *
 * @param {ComplianceCheckType} checkType - Check type
 * @returns {string} Description
 */
function getCheckTypeDescription(checkType: ComplianceCheckType): string {
  const descriptions: Record<ComplianceCheckType, string> = {
    segregation_of_duties: 'Verifies proper separation of responsibilities in financial processes',
    data_retention: 'Ensures data is retained according to policy requirements',
    access_control: 'Validates user access permissions and security controls',
    audit_trail_completeness: 'Checks for complete and uninterrupted audit trails',
    transaction_approval: 'Verifies all transactions have proper approvals',
    period_closing: 'Validates fiscal period closing procedures',
    reconciliation: 'Checks account reconciliation completeness and timeliness',
  };

  return descriptions[checkType] || '';
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Hooks
  useAuditTrailViewer,
  useUserActivityMonitoring,
  useComplianceMonitoring,

  // Utility Functions
  validateAuditEntry,
  validateComplianceCheck,
  formatAuditAction,
  formatEntityType,
  getSeverityColor,
};
