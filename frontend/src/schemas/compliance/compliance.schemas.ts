/**
 * HIPAA Compliance Schemas - Backward Compatibility Re-export
 *
 * This file maintains backward compatibility for existing imports.
 * All schemas have been refactored into modular files:
 * - audit.schemas.ts - Audit log related schemas
 * - violations.schemas.ts - Compliance violations and alerts
 * - metrics.schemas.ts - Compliance metrics and reporting
 * - retention.schemas.ts - Data retention policies
 * - policy.schemas.ts - Policy and acknowledgment schemas
 *
 * @deprecated Import from '@/schemas/compliance' (barrel export) instead
 */

export {
  // Audit Log Schemas
  AuditActionType,
  AuditSeverity,
  ResourceType,
  AuditLogSchema,
  AuditLogFilterSchema,
  AuditLogExportSchema,
  type AuditActionTypeEnum,
  type AuditSeverityEnum,
  type ResourceTypeEnum,
  type AuditLog,
  type AuditLogFilter,
  type AuditLogExport,

  // Violation and Alert Schemas
  ComplianceViolationSchema,
  ComplianceAlertSchema,
  type ComplianceViolation,
  type ComplianceAlert,

  // Metrics and Reporting Schemas
  ComplianceMetricsSchema,
  HIPAAReportSchema,
  type ComplianceMetrics,
  type HIPAAReport,

  // Data Retention Schemas
  DataRetentionPolicySchema,
  type DataRetentionPolicy,

  // Policy Schemas (re-exported for convenience)
  PolicyType,
  PolicyStatus,
  PolicySchema,
  PolicyAcknowledgmentSchema,
  type PolicyTypeEnum,
  type PolicyStatusEnum,
  type Policy,
  type PolicyAcknowledgment,

  // Backward compatibility aliases
  type Policy as PolicyDocument,
} from './index';
