/**
 * LOC: AEDD537A37
 * WC-GEN-013 | IAuditLogger.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - ExecutionContext.ts (database/types/ExecutionContext.ts)
 *
 * DOWNSTREAM (imported by):
 *   - BaseRepository.ts (database/repositories/base/BaseRepository.ts)
 *   - AllergyRepository.ts (database/repositories/impl/AllergyRepository.ts)
 *   - AppointmentRepository.ts (database/repositories/impl/AppointmentRepository.ts)
 *   - AuditLogRepository.ts (database/repositories/impl/AuditLogRepository.ts)
 *   - ChronicConditionRepository.ts (database/repositories/impl/ChronicConditionRepository.ts)
 *   - ... and 9 more
 */

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
 *
 * Provides comprehensive audit logging for all Protected Health Information (PHI)
 * access and modifications in compliance with HIPAA requirements. Every operation
 * on PHI entities must be logged with full context including user, timestamp,
 * IP address, and operation details.
 *
 * @interface IAuditLogger
 *
 * @example
 * ```typescript
 * import { IAuditLogger } from '@/database/audit/IAuditLogger';
 *
 * class AuditLoggerImpl implements IAuditLogger {
 *   async logCreate(entityType: string, entityId: string, context: ExecutionContext, data: any) {
 *     await AuditLog.create({
 *       action: 'CREATE',
 *       entityType,
 *       entityId,
 *       userId: context.userId,
 *       changes: data
 *     });
 *   }
 * }
 * ```
 *
 * @see {@link AuditLogEntry} for audit log entry structure
 * @see {@link PHI_ENTITY_TYPES} for list of PHI entities requiring audit logging
 */

import { ExecutionContext } from '../types/ExecutionContext';

export interface IAuditLogger {
  /**
   * Logs the creation of a new entity.
   *
   * Records entity creation with full context for audit trail. All PHI entity
   * creations must be logged per HIPAA compliance requirements.
   *
   * @param {string} entityType - Type of entity being created (e.g., 'HealthRecord', 'Student')
   * @param {string} entityId - Unique identifier of the created entity
   * @param {ExecutionContext} context - Execution context containing user, IP, timestamp
   * @param {any} data - Sanitized entity data (sensitive fields must be redacted)
   *
   * @returns {Promise<void>} Resolves when audit log entry is persisted
   *
   * @example
   * ```typescript
   * await auditLogger.logCreate(
   *   'HealthRecord',
   *   'hr-123',
   *   { userId: 'user-456', ipAddress: '192.168.1.1' },
   *   { studentId: 'student-789', diagnosis: 'Asthma' }
   * );
   * ```
   *
   * @see {@link sanitizeSensitiveData} for data sanitization
   */
  logCreate(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    data: any
  ): Promise<void>;

  /**
   * Logs read/access of an entity.
   *
   * Records entity access for audit trail. Critical for PHI access tracking
   * to maintain HIPAA compliance and identify unauthorized access patterns.
   *
   * @param {string} entityType - Type of entity being accessed
   * @param {string} entityId - Unique identifier of the accessed entity
   * @param {ExecutionContext} context - Execution context containing user, IP, timestamp
   *
   * @returns {Promise<void>} Resolves when audit log entry is persisted
   *
   * @example
   * ```typescript
   * await auditLogger.logRead(
   *   'HealthRecord',
   *   'hr-123',
   *   { userId: 'nurse-456', ipAddress: '192.168.1.1' }
   * );
   * ```
   *
   * @remarks
   * PHI read access is logged to detect:
   * - Unauthorized access attempts
   * - Suspicious access patterns
   * - Compliance with minimum necessary standard
   */
  logRead(entityType: string, entityId: string, context: ExecutionContext): Promise<void>;

  /**
   * Logs entity updates with before/after values.
   *
   * Records all field changes for audit trail with before and after values.
   * Essential for tracking PHI modifications and ensuring data integrity.
   *
   * @param {string} entityType - Type of entity being updated
   * @param {string} entityId - Unique identifier of the updated entity
   * @param {ExecutionContext} context - Execution context containing user, IP, timestamp
   * @param {Record<string, {before: any, after: any}>} changes - Object mapping field names to before/after values
   *
   * @returns {Promise<void>} Resolves when audit log entry is persisted
   *
   * @example
   * ```typescript
   * await auditLogger.logUpdate(
   *   'Student',
   *   'student-123',
   *   { userId: 'admin-456', ipAddress: '192.168.1.1' },
   *   {
   *     gradeLevel: { before: '5th', after: '6th' },
   *     homeroom: { before: 'Room 101', after: 'Room 202' }
   *   }
   * );
   * ```
   *
   * @remarks
   * Sensitive field values should be sanitized before logging.
   * The changes object provides full audit trail for compliance reviews.
   */
  logUpdate(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    changes: Record<string, { before: any; after: any }>
  ): Promise<void>;

  /**
   * Logs entity deletion with snapshot of data before deletion.
   *
   * Records entity deletion with full entity data for recovery and audit purposes.
   * PHI deletions require special scrutiny per HIPAA data retention policies.
   *
   * @param {string} entityType - Type of entity being deleted
   * @param {string} entityId - Unique identifier of the deleted entity
   * @param {ExecutionContext} context - Execution context containing user, IP, timestamp
   * @param {any} data - Sanitized snapshot of entity data before deletion
   *
   * @returns {Promise<void>} Resolves when audit log entry is persisted
   *
   * @example
   * ```typescript
   * const entityData = await HealthRecord.findByPk(recordId);
   * await auditLogger.logDelete(
   *   'HealthRecord',
   *   recordId,
   *   { userId: 'admin-456', ipAddress: '192.168.1.1' },
   *   sanitizeSensitiveData(entityData.toJSON())
   * );
   * await HealthRecord.destroy({ where: { id: recordId } });
   * ```
   *
   * @remarks
   * Always capture entity data BEFORE deletion. Sensitive fields must be
   * sanitized. PHI deletions may be restricted or require special authorization.
   */
  logDelete(
    entityType: string,
    entityId: string,
    context: ExecutionContext,
    data: any
  ): Promise<void>;

  /**
   * Logs bulk operations affecting multiple entities.
   *
   * Records operations that modify multiple entities simultaneously,
   * including bulk updates, bulk deletes, and batch imports.
   *
   * @param {string} operation - Operation name (e.g., 'BULK_UPDATE', 'BULK_DELETE', 'IMPORT')
   * @param {string} entityType - Type of entities affected
   * @param {ExecutionContext} context - Execution context containing user, IP, timestamp
   * @param {any} metadata - Operation metadata including count, filters, affected IDs
   *
   * @returns {Promise<void>} Resolves when audit log entry is persisted
   *
   * @example
   * ```typescript
   * await auditLogger.logBulkOperation(
   *   'BULK_UPDATE',
   *   'Student',
   *   { userId: 'admin-456', ipAddress: '192.168.1.1' },
   *   {
   *     count: 25,
   *     filters: { schoolId: 'school-789', gradeLevel: '5th' },
   *     changes: { promoted: true }
   *   }
   * );
   * ```
   */
  logBulkOperation(
    operation: string,
    entityType: string,
    context: ExecutionContext,
    metadata: any
  ): Promise<void>;

  /**
   * Logs data export operations for compliance tracking.
   *
   * Records all data exports, especially critical for PHI exports which
   * must be tracked per HIPAA breach notification requirements.
   *
   * @param {string} entityType - Type of entities exported
   * @param {ExecutionContext} context - Execution context containing user, IP, timestamp
   * @param {any} metadata - Export metadata including format, count, filters, destination
   *
   * @returns {Promise<void>} Resolves when audit log entry is persisted
   *
   * @example
   * ```typescript
   * await auditLogger.logExport(
   *   'HealthRecord',
   *   { userId: 'nurse-456', ipAddress: '192.168.1.1' },
   *   {
   *     format: 'PDF',
   *     count: 15,
   *     filters: { studentId: 'student-123', dateRange: '2024-01-01 to 2024-12-31' },
   *     destination: 'email'
   *   }
   * );
   * ```
   *
   * @remarks
   * PHI exports must be audited to ensure compliance with minimum necessary
   * standard and to track potential data breach incidents.
   */
  logExport(entityType: string, context: ExecutionContext, metadata: any): Promise<void>;

  /**
   * Logs database transaction operations.
   *
   * Records transaction boundaries (begin, commit, rollback) for complex
   * multi-entity operations to maintain audit trail integrity.
   *
   * @param {string} operation - Transaction operation ('BEGIN', 'COMMIT', 'ROLLBACK')
   * @param {ExecutionContext} context - Execution context containing user, IP, timestamp
   * @param {any} metadata - Transaction metadata including transaction ID, duration, operations
   *
   * @returns {Promise<void>} Resolves when audit log entry is persisted
   *
   * @example
   * ```typescript
   * await auditLogger.logTransaction(
   *   'COMMIT',
   *   { userId: 'admin-456', ipAddress: '192.168.1.1' },
   *   {
   *     transactionId: 'tx-12345',
   *     duration: 234,
   *     operations: ['UPDATE Student', 'CREATE AuditLog', 'UPDATE School']
   *   }
   * );
   * ```
   */
  logTransaction(operation: string, context: ExecutionContext, metadata: any): Promise<void>;

  /**
   * Logs cache access operations for PHI tracking.
   *
   * Records cache hits/misses for PHI entities to ensure complete audit trail
   * even when data is served from cache rather than database.
   *
   * @param {string} operation - Cache operation ('READ', 'WRITE', 'DELETE', 'INVALIDATE')
   * @param {string} cacheKey - Cache key identifying the cached data
   * @param {any} [metadata] - Optional metadata including entity type, TTL, hit/miss status
   *
   * @returns {Promise<void>} Resolves when audit log entry is persisted
   *
   * @example
   * ```typescript
   * await auditLogger.logCacheAccess(
   *   'READ',
   *   'white-cross:healthrecord:hr-123',
   *   {
   *     entityType: 'HealthRecord',
   *     entityId: 'hr-123',
   *     hit: true,
   *     ttl: 300
   *   }
   * );
   * ```
   *
   * @remarks
   * Required for PHI entities to maintain complete access audit trail.
   * Cache reads should be logged with same rigor as database reads.
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
 * Determines if an entity type contains Protected Health Information (PHI).
 *
 * Used to enforce mandatory audit logging for PHI entities per HIPAA requirements.
 * All operations on PHI entities must be logged regardless of caching or optimization.
 *
 * @param {string} entityType - Entity type name to check
 *
 * @returns {boolean} True if entity type contains PHI and requires audit logging
 *
 * @example
 * ```typescript
 * if (isPHIEntity('HealthRecord')) {
 *   await auditLogger.logRead('HealthRecord', id, context);
 * }
 *
 * if (isPHIEntity('School')) {  // false
 *   // No audit logging required for non-PHI entities
 * }
 * ```
 *
 * @see {@link PHI_ENTITY_TYPES} for complete list of PHI entities
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
 * Sanitizes data by redacting sensitive fields before logging.
 *
 * Recursively redacts fields containing passwords, SSNs, tax IDs, credit cards,
 * and bank account numbers to prevent logging of highly sensitive data even
 * in audit logs.
 *
 * @param {any} data - Data object to sanitize (supports objects, arrays, and primitives)
 *
 * @returns {any} Sanitized copy of data with sensitive fields replaced with '[REDACTED]'
 *
 * @example
 * ```typescript
 * const userData = {
 *   name: 'John Doe',
 *   password: 'secret123',
 *   ssn: '123-45-6789',
 *   email: 'john@example.com'
 * };
 *
 * const sanitized = sanitizeSensitiveData(userData);
 * // Result:
 * // {
 * //   name: 'John Doe',
 * //   password: '[REDACTED]',
 * //   ssn: '[REDACTED]',
 * //   email: 'john@example.com'
 * // }
 * ```
 *
 * @remarks
 * - Performs case-insensitive partial matching on field names
 * - Handles nested objects and arrays recursively
 * - Returns primitives unchanged
 * - Creates a new object/array (does not mutate input)
 *
 * @see {@link SENSITIVE_FIELDS} for list of redacted field patterns
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
