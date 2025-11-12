/**
 * ComplianceAudit Module Barrel Exports
 *
 * Provides a clean public API for the ComplianceAudit module.
 * Import from this file to access components, types, and utilities.
 *
 * @module ComplianceAudit
 *
 * @example
 * ```typescript
 * // Import the main component
 * import ComplianceAudit from '@/components/pages/Compliance/ComplianceAudit';
 *
 * // Import types
 * import type { ComplianceAuditProps, AuditStatus } from '@/components/pages/Compliance/ComplianceAudit';
 *
 * // Import subcomponents (if needed)
 * import { AuditCard, AuditStats } from '@/components/pages/Compliance/ComplianceAudit';
 * ```
 */

// Main component (default export)
export { default, ComplianceAudit } from './ComplianceAudit';

// Subcomponents
export { AuditCard } from './AuditCard';
export { AuditStats } from './AuditStats';
export { AuditHeader } from './AuditHeader';
export { FilterPanel } from './FilterPanel';

// Configuration utilities
export {
  getStatusConfig,
  getTypeConfig,
  getPriorityConfig,
  getFindingSeverityConfig
} from './configs';

export type {
  StatusConfig,
  TypeConfig,
  PriorityConfig,
  FindingSeverityConfig
} from './configs';

// All type exports
export type {
  // Status and classification types
  AuditStatus,
  AuditType,
  AuditPriority,
  FindingSeverity,
  FindingStatus,
  FollowUpActionStatus,
  ViewMode,

  // Interface types
  Auditor,
  FollowUpAction,
  AuditDocument,
  AuditFinding,
  ComplianceAudit,
  Department,
  AuditFilters,
  AuditStatistics,

  // Component props
  ComplianceAuditProps
} from './types';
