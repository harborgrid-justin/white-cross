/**
 * WF-COMP-315 | administration-audit.ts - Audit Logging Type Definitions
 * Purpose: Type definitions for audit trail and activity logging
 * Upstream: administration-enums.ts | Dependencies: None
 * Downstream: Audit log components | Called by: Admin audit log UI, compliance reporting
 * Related: All administration modules (all actions can be audited)
 * Exports: Audit log entity types, audit operation interfaces
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Audit trail for compliance and security
 * LLM Context: Type definitions for comprehensive audit logging
 */

import type { AuditAction } from './administration-enums';

/**
 * Audit Logging Types
 *
 * Type definitions for:
 * - Audit log entities
 * - Audit trail creation
 * - Change tracking
 */

// ==================== AUDIT LOG TYPES ====================

/**
 * Audit log entity
 */
export interface AuditLog {
  id: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  userId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

/**
 * Create audit log request
 */
export interface CreateAuditLogData {
  action: AuditAction;
  entityType: string;
  entityId?: string;
  userId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}
