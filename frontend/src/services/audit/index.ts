/**
 * Audit Logging Module - Main Export
 *
 * Purpose: HIPAA-compliant audit logging system for frontend
 *
 * Exports:
 * - AuditService: Main service class
 * - auditService: Singleton instance
 * - useAudit: React hook for components
 * - All types and enums
 * - Configuration helpers
 *
 * Usage:
 * ```typescript
 * // In React components
 * import { useAudit, AuditAction, AuditResourceType } from '@/services/audit';
 *
 * const audit = useAudit();
 * await audit.logPHIAccess(
 *   AuditAction.VIEW_HEALTH_RECORD,
 *   studentId,
 *   AuditResourceType.HEALTH_RECORD,
 *   recordId
 * );
 *
 * // In non-React code
 * import { auditService, AuditAction, AuditResourceType } from '@/services/audit';
 *
 * await auditService.log({
 *   action: AuditAction.CREATE_MEDICATION,
 *   resourceType: AuditResourceType.MEDICATION,
 *   resourceId: medication.id,
 * });
 * ```
 *
 * Last Updated: 2025-10-21
 */

// Main Service
export { AuditService, auditService, initializeAuditService, cleanupAuditService } from './AuditService';

// React Hook
export { useAudit } from './useAudit';
export type { UseAuditResult } from './useAudit';

// Types and Interfaces
export type {
  AuditEvent,
  AuditLogParams,
  AuditBatch,
  AuditChange,
  AuditEventFilter,
  AuditStatistics,
  AuditConfig,
  IAuditService,
  AuditServiceStatus,
  AuditApiResponse,
  AuditQueryResponse,
} from './types';

// Enums
export {
  AuditAction,
  AuditResourceType,
  AuditSeverity,
  AuditStatus,
} from './types';

// Configuration
export {
  DEFAULT_AUDIT_CONFIG,
  ACTION_SEVERITY_MAP,
  RESOURCE_PHI_MAP,
  isCriticalAction,
  isCriticalSeverity,
  getActionSeverity,
  isResourcePHI,
  requiresImmediateFlush,
} from './config';

// Default export
export { auditService as default } from './AuditService';
