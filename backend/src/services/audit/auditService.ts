/**
 * LOC: 0F2B68D86D
 * WC-SVC-AUD-015 | auditService.ts - Audit Service Legacy Re-export Module (DEPRECATED)
 *
 * UPSTREAM (imports from):
 *   - auditService.ts (services/auditService.ts)
 *   - index.ts (services/audit/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - permissionOperations.ts (services/accessControl/permissionOperations.ts)
 *   - rbacOperations.ts (services/accessControl/rbacOperations.ts)
 *   - roleOperations.ts (services/accessControl/roleOperations.ts)
 *   - auditService.ts (services/auditService.ts)
 */

/**
 * WC-SVC-AUD-015 | auditService.ts - Audit Service Legacy Re-export Module (DEPRECATED)
 * Purpose: Backward compatibility re-exports for deprecated monolithic audit service, redirects to modular audit/*
 * Upstream: ./audit/index.ts, ./audit/* modules | Dependencies: Modular audit services from ./audit directory
 * Downstream: Legacy routes, old service imports | Called by: Routes using deprecated imports, legacy code
 * Related: audit/auditLogService.ts, audit/phiAccessService.ts, audit/complianceService.ts, audit/securityService.ts
 * Exports: Re-exported audit services, types, constants | Key Services: DEPRECATED - use ./audit instead
 * Last Updated: 2025-10-18 | File Type: .ts | HIPAA: Audit trail compliance for PHI access tracking
 * Critical Path: Legacy import → Module re-export → Forward to new modular services
 * LLM Context: DEPRECATED file for backward compatibility - direct developers to use ./audit/* modular services instead
 */

/**
 * @deprecated This file has been refactored into modular services.
 * Import from './audit' directory instead.
 * 
 * @example
 * // Old import:
 * import { AuditService } from './auditService';
 * 
 * // New import:
 * import { AuditService } from './audit';
 * 
 * // Or import specific services:
 * import { 
 *   AuditLogService, 
 *   PHIAccessService, 
 *   ComplianceReportingService 
 * } from './audit';
 */

// Re-export the new modular audit services for backward compatibility
export {
  AuditService,
  AuditLogService,
  PHIAccessService,
  AuditQueryService,
  ComplianceReportingService,
  AuditStatisticsService,
  SecurityAnalysisService,
  AuditUtilsService,
  AUDIT_CONSTANTS,
  AUDIT_ERRORS,
  // Types
  AuditLogEntry,
  PHIAccessLog,
  AuditLogFilters,
  PHIAccessLogFilters,
  PaginatedResult,
  ComplianceReport,
  AuditStatistics,
  EnrichedAuditLog,
  AuditLogSearchCriteria,
  PHIAccessType,
  PHIDataCategory,
  auditService
} from './audit';
