/**
 * WF-COMP-315 | administration/audit.ts - Type definitions
 * Purpose: Audit logging type definitions for administration module
 * Upstream: enums.ts | Dependencies: AuditAction
 * Downstream: Audit logging components | Called by: React components
 * Related: Other administration type files
 * Exports: Interfaces | Key Features: Type definitions
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type definitions for audit logging
 * LLM Context: Audit logging types with change tracking
 */

import type { AuditAction } from './enums';

/**
 * Audit Logging Types
 *
 * Type definitions for audit logging including:
 * - Audit log entities
 * - Create request types
 * - Change tracking
 */

// ==================== AUDIT LOGGING TYPES ====================

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
