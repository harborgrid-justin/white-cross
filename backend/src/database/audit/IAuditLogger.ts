/**
 * WC-GEN-013 | IAuditLogger.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../types/ExecutionContext | Dependencies: ../types/ExecutionContext
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces, types, constants, functions | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * HIPAA-Compliant Audit Logger Interface
 * Tracks all Protected Health Information (PHI) access and modifications
 */

import { ExecutionContext } from '../types/ExecutionContext';

export interface IAuditLogger {
  /**
   * Log entity creation
   * @param entityType Type of entity being created
   * @param entityId Identifier of created entity
   * @param context Execution context
   * @param data Sanitized entity data
   */
  logCreate(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    data: any
  ): Promise<void>;

  /**
   * Log entity read/access
   * @param entityType Type of entity being accessed
   * @param entityId Identifier of accessed entity
   * @param context Execution context
   */
  logRead(entityType: string, entityId: string, context: ExecutionContext): Promise<void>;

  /**
   * Log entity update
   * @param entityType Type of entity being updated
   * @param entityId Identifier of updated entity
   * @param context Execution context
   * @param changes Object containing before/after values
   */
  logUpdate(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    changes: Record<string, { before: any; after: any }>
  ): Promise<void>;

  /**
   * Log entity deletion
   * @param entityType Type of entity being deleted
   * @param entityId Identifier of deleted entity
   * @param context Execution context
   * @param data Sanitized entity data before deletion
   */
  logDelete(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    data: any
  ): Promise<void>;

  /**
   * Log bulk operations
   * @param operation Operation name
   * @param entityType Type of entities affected
   * @param context Execution context
   * @param metadata Operation metadata (count, filters, etc.)
   */
  logBulkOperation(
    operation: string,
    entityType: string,
    context: ExecutionContext,
    metadata: any
  ): Promise<void>;

  /**
   * Log data export operations
   * @param entityType Type of entities exported
   * @param context Execution context
   * @param metadata Export metadata (format, count, filters)
   */
  logExport(entityType: string, context: ExecutionContext, metadata: any): Promise<void>;

  /**
   * Log transaction operations
   * @param operation Transaction operation (commit/rollback)
   * @param context Execution context
   * @param metadata Transaction metadata
   */
  logTransaction(operation: string, context: ExecutionContext, metadata: any): Promise<void>;

  /**
   * Log cache access (for PHI tracking)
   * @param operation Cache operation (read/write/delete)
   * @param cacheKey Cache key
   * @param metadata Optional metadata
   */
  logCacheAccess(operation: string, cacheKey: string, metadata?: any): Promise<void>;
}

/**
 * Audit log entry structure
 */
export interface AuditLogEntry {
  /**
   * Audit action performed
   */
  action: AuditAction;

  /**
   * Type of entity affected
   */
  entityType: string;

  /**
   * Identifier of entity (null for bulk operations)
   */
  entityId: string | null;

  /**
   * User who performed the action
   */
  userId: string | null;

  /**
   * IP address of request origin
   */
  ipAddress: string | null;

  /**
   * User agent string
   */
  userAgent: string | null;

  /**
   * Changes made (before/after values or metadata)
   */
  changes: any;

  /**
   * Timestamp of the action
   */
  createdAt: Date;
}

/**
 * Audit actions
 */
export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  BULK_DELETE = 'BULK_DELETE',
  BULK_UPDATE = 'BULK_UPDATE',
  TRANSACTION_COMMIT = 'TRANSACTION_COMMIT',
  TRANSACTION_ROLLBACK = 'TRANSACTION_ROLLBACK',
  CACHE_READ = 'CACHE_READ',
  CACHE_WRITE = 'CACHE_WRITE',
  CACHE_DELETE = 'CACHE_DELETE'
}

/**
 * PHI (Protected Health Information) entity types
 * These require mandatory audit logging
 */
export const PHI_ENTITY_TYPES = [
  'HealthRecord',
  'Allergy',
  'ChronicCondition',
  'Student',
  'StudentMedication',
  'MedicationLog',
  'IncidentReport',
  'EmergencyContact'
] as const;

export type PHIEntityType = (typeof PHI_ENTITY_TYPES)[number];

/**
 * Check if entity type contains PHI
 */
export function isPHIEntity(entityType: string): boolean {
  return PHI_ENTITY_TYPES.includes(entityType as PHIEntityType);
}

/**
 * Sensitive field names to redact in audit logs
 */
export const SENSITIVE_FIELDS = [
  'password',
  'ssn',
  'socialSecurityNumber',
  'taxId',
  'creditCard',
  'bankAccount'
] as const;

/**
 * Sanitize data by redacting sensitive fields
 */
export function sanitizeSensitiveData(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sanitized: any = Array.isArray(data) ? [] : {};

  for (const key in data) {
    if (SENSITIVE_FIELDS.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      sanitized[key] = sanitizeSensitiveData(data[key]);
    } else {
      sanitized[key] = data[key];
    }
  }

  return sanitized;
}
