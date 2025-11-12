/**
 * ComplianceAudit - Re-export for Backward Compatibility
 *
 * This file maintains backward compatibility for existing imports.
 * The original 787 LOC component has been refactored into smaller,
 * maintainable components in the ComplianceAudit/ subdirectory.
 *
 * All imports from this file will continue to work as expected.
 *
 * @module pages/Compliance/ComplianceAudit
 *
 * @example
 * ```typescript
 * // Old imports still work
 * import ComplianceAudit from './ComplianceAudit';
 * import type { AuditStatus, ComplianceAudit as AuditData } from './ComplianceAudit';
 * ```
 */

// Re-export main component (default and named)
export { default, ComplianceAudit } from './ComplianceAudit';

// Re-export all types for backward compatibility
export type {
  AuditStatus,
  AuditType,
  AuditPriority,
  FindingSeverity,
  FindingStatus,
  FollowUpActionStatus,
  ViewMode,
  Auditor,
  FollowUpAction,
  AuditDocument,
  AuditFinding,
  ComplianceAudit as ComplianceAuditData,
  Department,
  AuditFilters,
  AuditStatistics,
  ComplianceAuditProps
} from './ComplianceAudit/types';

// Re-export configuration utilities
export {
  getStatusConfig,
  getTypeConfig,
  getPriorityConfig,
  getFindingSeverityConfig
} from './ComplianceAudit/configs';

// Re-export subcomponents for advanced use cases
export {
  AuditCard,
  AuditStats,
  AuditHeader,
  FilterPanel
} from './ComplianceAudit';
