/**
 * @fileoverview Audit log repository interface for HIPAA-compliant audit trail management.
 * Provides immutable audit log storage with specialized queries for compliance reporting.
 *
 * @module database/repositories/interfaces
 *
 * @remarks
 * HIPAA Compliance Requirements:
 * - All PHI access must be logged with user, timestamp, and action
 * - Audit logs are immutable (no updates or deletes allowed)
 * - Retention period: minimum 6 years per HIPAA requirements
 * - Access to audit logs restricted to authorized personnel
 * - Supports compliance reporting and security investigations
 *
 * Immutability:
 * - UpdateAuditLogDTO is empty - no updates permitted
 * - Delete operations disabled for audit logs
 * - Only create operations allowed
 * - Supports batch inserts for performance
 *
 * @see {IRepository} Base repository interface
 * @see {IAuditLogger} Audit logger service
 * @see {AuditLogRepository} Concrete implementation
 *
 * LOC: 7A400E814A
 * WC-GEN-109 | IAuditLogRepository.ts - Audit log repository interface
 *
 * UPSTREAM (imports from):
 *   - IRepository.ts (database/repositories/interfaces/IRepository.ts)
 *   - IAuditLogger.ts (database/audit/IAuditLogger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - RepositoryFactory.ts (database/repositories/RepositoryFactory.ts)
 *   - IUnitOfWork.ts (database/uow/IUnitOfWork.ts)
 *   - SequelizeUnitOfWork.ts (database/uow/SequelizeUnitOfWork.ts)
 */

import { IRepository } from './IRepository';
import { AuditLogEntry } from '../../audit/IAuditLogger';

/**
 * Audit log entity representing a single audit trail entry.
 *
 * @interface AuditLog
 *
 * @property {string} id - Unique audit log identifier (UUID)
 * @property {string | null} userId - User who performed the action (null for system actions)
 * @property {string} action - Action type (e.g., 'CREATE_STUDENT', 'VIEW_PHI', 'DELETE_RECORD')
 * @property {string} entityType - Type of entity affected (e.g., 'Student', 'HealthRecord')
 * @property {string | null} entityId - Identifier of affected entity
 * @property {any} changes - JSON object containing changes or accessed data
 * @property {string | null} ipAddress - Client IP address
 * @property {string | null} userAgent - Client user agent string
 * @property {Date} createdAt - Timestamp of the audited action (immutable)
 */
export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  changes: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

/**
 * Data transfer object for creating audit log entries.
 *
 * @interface CreateAuditLogDTO
 *
 * @property {string | null} userId - User performing the action
 * @property {string} action - Action being audited
 * @property {string} entityType - Type of entity being accessed/modified
 * @property {string | null} entityId - Identifier of the entity
 * @property {any} changes - Changes made or data accessed (sanitized PHI)
 * @property {string | null} ipAddress - Client IP address for tracking
 * @property {string | null} userAgent - User agent for device tracking
 */
export interface CreateAuditLogDTO {
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  changes: any;
  ipAddress: string | null;
  userAgent: string | null;
}

/**
 * Empty update DTO enforcing audit log immutability.
 *
 * @interface UpdateAuditLogDTO
 *
 * @remarks
 * Audit logs are immutable per HIPAA requirements.
 * No update operations are permitted.
 * This empty interface prevents accidental updates.
 */
export interface UpdateAuditLogDTO {
  // Audit logs are immutable - no updates allowed
}

/**
 * Repository interface for audit log data access operations.
 *
 * @interface IAuditLogRepository
 * @extends {IRepository<AuditLog, CreateAuditLogDTO, UpdateAuditLogDTO>}
 *
 * @remarks
 * Query Optimization:
 * - Entity queries use composite index (entityType, entityId, createdAt)
 * - User queries use index (userId, createdAt DESC)
 * - Action queries use index (action, createdAt DESC)
 * - Date range queries use index (createdAt)
 *
 * HIPAA Compliance:
 * - All queries restricted to authorized users
 * - Access to audit logs is itself audited
 * - Supports compliance reporting requirements
 * - Date range queries support retention policy enforcement
 *
 * Performance Considerations:
 * - Batch inserts for high-volume operations
 * - Partitioning by date for large datasets
 * - Archival strategy for old records
 *
 * @example
 * ```typescript
 * // Find audit trail for a specific student record
 * const trail = await auditRepo.findByEntity('Student', 'student-123');
 *
 * // Find all actions by a user
 * const userActions = await auditRepo.findByUser('nurse-456', 100);
 *
 * // Find all PHI access events
 * const phiAccess = await auditRepo.findByAction('VIEW_PHI');
 *
 * // Compliance report for date range
 * const logs = await auditRepo.findByDateRange(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export interface IAuditLogRepository
  extends IRepository<AuditLog, CreateAuditLogDTO, UpdateAuditLogDTO> {
  /**
   * Finds all audit log entries for a specific entity.
   *
   * @param {string} entityType - Type of entity (e.g., 'Student', 'HealthRecord')
   * @param {string} entityId - Entity identifier
   *
   * @returns {Promise<AuditLog[]>} Array of audit logs sorted by timestamp (newest first)
   *
   * @remarks
   * Performance: O(log n) using composite index (entityType, entityId, createdAt)
   * Use Case: Entity audit trail, compliance investigation, change history
   * Sorting: Descending by createdAt for recent-first display
   *
   * @example
   * ```typescript
   * // Get complete audit trail for a student
   * const trail = await repository.findByEntity('Student', 'student-123');
   * trail.forEach(log => {
   *   console.log(`${log.createdAt}: ${log.action} by ${log.userId}`);
   * });
   * ```
   */
  findByEntity(entityType: string, entityId: string): Promise<AuditLog[]>;

  /**
   * Finds audit log entries for a specific user.
   *
   * @param {string} userId - User identifier
   * @param {number} [limit=100] - Maximum number of entries to return
   *
   * @returns {Promise<AuditLog[]>} Array of audit logs sorted by timestamp (newest first)
   *
   * @remarks
   * Performance: O(log n) using index (userId, createdAt DESC)
   * Use Case: User activity monitoring, compliance audits, security investigations
   * Default Limit: 100 entries to prevent excessive data retrieval
   *
   * @example
   * ```typescript
   * // Get recent actions by a nurse
   * const actions = await repository.findByUser('nurse-456', 50);
   *
   * // Check for suspicious activity
   * const recentPHIAccess = actions.filter(log =>
   *   log.action === 'VIEW_PHI' && log.createdAt > yesterday
   * );
   * ```
   */
  findByUser(userId: string, limit?: number): Promise<AuditLog[]>;

  /**
   * Finds audit log entries for a specific action type.
   *
   * @param {string} action - Action type (e.g., 'VIEW_PHI', 'DELETE_RECORD')
   * @param {number} [limit=100] - Maximum number of entries to return
   *
   * @returns {Promise<AuditLog[]>} Array of audit logs sorted by timestamp (newest first)
   *
   * @remarks
   * Performance: O(log n) using index (action, createdAt DESC)
   * Use Case: Security monitoring, compliance reporting, pattern analysis
   * Common Actions: VIEW_PHI, CREATE_*, UPDATE_*, DELETE_*, LOGIN, LOGOUT
   *
   * @example
   * ```typescript
   * // Monitor all PHI access
   * const phiAccess = await repository.findByAction('VIEW_PHI', 200);
   *
   * // Find all deletion events
   * const deletions = await repository.findByAction('DELETE_RECORD');
   * ```
   */
  findByAction(action: string, limit?: number): Promise<AuditLog[]>;

  /**
   * Finds audit log entries within a specific date range.
   *
   * @param {Date} startDate - Start of date range (inclusive)
   * @param {Date} endDate - End of date range (inclusive)
   * @param {any} [filters] - Additional filters (entityType, userId, action)
   *
   * @returns {Promise<AuditLog[]>} Array of audit logs within date range
   *
   * @remarks
   * Performance: O(log n) using index on createdAt
   * Use Case: Compliance reporting, security audits, retention policy enforcement
   * Filters: Support additional filtering by entityType, userId, action
   * Large Results: Consider pagination for date ranges with many entries
   *
   * @example
   * ```typescript
   * // Quarterly compliance report
   * const q1Logs = await repository.findByDateRange(
   *   new Date('2024-01-01'),
   *   new Date('2024-03-31')
   * );
   *
   * // Find PHI access in date range
   * const phiLogs = await repository.findByDateRange(
   *   new Date('2024-01-01'),
   *   new Date('2024-12-31'),
   *   { action: 'VIEW_PHI' }
   * );
   * ```
   */
  findByDateRange(startDate: Date, endDate: Date, filters?: any): Promise<AuditLog[]>;

  /**
   * Creates multiple audit log entries in a single transaction.
   *
   * @param {CreateAuditLogDTO[]} entries - Array of audit log entries to create
   *
   * @returns {Promise<void>} Resolves when all entries are created
   *
   * @remarks
   * Performance: Batch insert for high-volume operations
   * Transaction: All entries created atomically
   * Use Case: Bulk operations, batch processing, data migration
   * Validation: All entries validated before insert
   *
   * @example
   * ```typescript
   * // Log multiple related actions
   * await repository.createMany([
   *   { userId: 'nurse-123', action: 'EXPORT_STARTED', ... },
   *   { userId: 'nurse-123', action: 'PHI_ACCESSED', ... },
   *   { userId: 'nurse-123', action: 'EXPORT_COMPLETED', ... }
   * ]);
   * ```
   */
  createMany(entries: CreateAuditLogDTO[]): Promise<void>;
}
