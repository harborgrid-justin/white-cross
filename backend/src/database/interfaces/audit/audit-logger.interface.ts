/**
 * HIPAA-Compliant Audit Logger Interface
 *
 * Provides comprehensive audit logging for all Protected Health Information (PHI)
 * access and modifications in compliance with HIPAA requirements.
 */

import { ExecutionContext } from '../../types';
import { AuditAction, SENSITIVE_FIELDS } from '../../types/database.enums';

export interface IAuditLogger {
  /**
   * Logs the creation of a new entity
   */
  logCreate(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    data: Record<string, unknown>,
    transaction?: any
  ): Promise<void>;

  /**
   * Logs read/access of an entity
   */
  logRead(entityType: string, entityId: string, context: ExecutionContext, transaction?: any): Promise<void>;

  /**
   * Logs entity updates with before/after values
   */
  logUpdate(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    changes: Record<string, { before: unknown; after: unknown }>,
    transaction?: any
  ): Promise<void>;

  /**
   * Logs entity deletion with snapshot of data before deletion
   */
  logDelete(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    data: Record<string, unknown>,
    transaction?: any
  ): Promise<void>;

  /**
   * Logs bulk operations affecting multiple entities
   */
  logBulkOperation(
    operation: string,
    entityType: string,
    context: ExecutionContext,
    metadata: Record<string, unknown>,
    transaction?: any
  ): Promise<void>;

  /**
   * Logs data export operations for compliance tracking
   */
  logExport(entityType: string, context: ExecutionContext, metadata: Record<string, unknown>): Promise<void>;

  /**
   * Logs database transaction operations
   */
  logTransaction(operation: string, context: ExecutionContext, metadata: Record<string, unknown>): Promise<void>;

  /**
   * Logs cache access operations for PHI tracking
   */
  logCacheAccess(operation: string, cacheKey: string, metadata?: Record<string, unknown>): Promise<void>;

  /**
   * Logs PHI access for HIPAA compliance
   * Used by model hooks to track PHI field modifications
   */
  logPHIAccess?(
    options: {
      entityType: string;
      entityId: string;
      action: 'CREATE' | 'UPDATE' | 'READ' | 'DELETE';
      changedFields?: string[];
      userId?: string;
      userName?: string;
      ipAddress?: string;
      userAgent?: string;
      metadata?: Record<string, unknown>;
    },
    transaction?: any
  ): Promise<void>;
}

/**
 * Audit log entry structure
 */
export interface AuditLogEntry {
  action: AuditAction;
  entityType: string;
  entityId: string | null;
  userId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  changes: Record<string, unknown> | Record<string, { before: unknown; after: unknown }> | null;
  createdAt: Date;
}

/**
 * Sanitizes data by redacting sensitive fields before logging
 */
export function sanitizeSensitiveData(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sanitized: Record<string, unknown> | unknown[] = Array.isArray(data) ? [] : {};

  for (const key in data as Record<string, unknown>) {
    const value = (data as Record<string, unknown>)[key];
    if (SENSITIVE_FIELDS.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
      (sanitized as Record<string, unknown>)[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      (sanitized as Record<string, unknown>)[key] = sanitizeSensitiveData(value);
    } else {
      (sanitized as Record<string, unknown>)[key] = value;
    }
  }

  return sanitized;
}
