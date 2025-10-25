/**
 * @fileoverview Base repository interface defining contracts for data access operations.
 * Provides standardized CRUD operations with transaction support, audit logging, and caching.
 * This interface establishes the foundation for the repository pattern across all domain entities.
 *
 * @module database/repositories/interfaces
 *
 * @remarks
 * Repository Pattern:
 * - Abstracts data access layer from business logic
 * - Provides consistent CRUD operations across all entities
 * - Supports transaction management for atomic operations
 * - Integrates with audit logging for HIPAA compliance
 * - Implements caching strategies for performance optimization
 *
 * Transaction Support:
 * - All write operations (create, update, delete) accept execution context
 * - Context includes optional transaction for multi-entity operations
 * - Ensures atomicity and consistency across related entities
 *
 * HIPAA Compliance:
 * - All operations integrate with audit logger
 * - PHI access is tracked via execution context
 * - Supports data sanitization for audit trails
 *
 * @see {BaseRepository} Generic repository implementation
 * @see {ExecutionContext} Execution context for audit and transactions
 *
 * LOC: AA3FF826A4
 * WC-GEN-112 | IRepository.ts - Base repository interface
 *
 * UPSTREAM (imports from):
 *   - ExecutionContext.ts (database/types/ExecutionContext.ts)
 *   - QueryTypes.ts (database/types/QueryTypes.ts)
 *
 * DOWNSTREAM (imported by):
 *   - BaseRepository.ts (database/repositories/base/BaseRepository.ts)
 *   - IAllergyRepository.ts (database/repositories/interfaces/IAllergyRepository.ts)
 *   - IAuditLogRepository.ts (database/repositories/interfaces/IAuditLogRepository.ts)
 *   - IChronicConditionRepository.ts (database/repositories/interfaces/IChronicConditionRepository.ts)
 *   - IHealthRecordRepository.ts (database/repositories/interfaces/IHealthRecordRepository.ts)
 *   - ... and 1 more
 */

import { ExecutionContext } from '../../types/ExecutionContext';
import { QueryOptions, QueryCriteria, PaginatedResult } from '../../types/QueryTypes';

/**
 * Base repository interface for data access operations.
 *
 * @interface IRepository
 * @template T - Entity type returned by repository operations
 * @template CreateDTO - Data transfer object for entity creation
 * @template UpdateDTO - Data transfer object for entity updates
 *
 * @remarks
 * Design Principles:
 * - Generic interface supporting any entity type
 * - Separation of read and write DTOs for type safety
 * - Query operations return null for not found (vs throwing)
 * - Write operations throw on validation/constraint errors
 * - All operations support caching and eager loading
 *
 * Query Optimization:
 * - findById: Indexed primary key lookup, O(1) with caching
 * - findMany: Supports pagination, filtering, and sorting
 * - exists: Optimized count query without data retrieval
 *
 * Error Handling:
 * - Read operations: Return null for not found
 * - Write operations: Throw RepositoryError with error codes
 * - Validation errors: Throw before database operations
 * - Constraint errors: Mapped to domain-specific error codes
 *
 * @example
 * ```typescript
 * // Create a student repository instance
 * const studentRepo: IRepository<Student, CreateStudentDTO, UpdateStudentDTO>
 *   = new StudentRepository(auditLogger, cacheManager);
 *
 * // Find by ID with caching
 * const student = await studentRepo.findById('student-123', {
 *   cacheKey: true,
 *   cacheTTL: 1800
 * });
 *
 * // Find many with pagination and filters
 * const result = await studentRepo.findMany({
 *   where: { grade: '5', isActive: true },
 *   pagination: { page: 1, limit: 20 },
 *   orderBy: [{ lastName: 'ASC' }]
 * });
 *
 * // Create with audit context
 * const newStudent = await studentRepo.create(
 *   { firstName: 'John', lastName: 'Doe', ... },
 *   { userId: 'nurse-456', action: 'CREATE_STUDENT', ipAddress: '192.168.1.1' }
 * );
 *
 * // Update with transaction
 * const updated = await studentRepo.update(
 *   'student-123',
 *   { grade: '6' },
 *   { userId: 'nurse-456', action: 'UPDATE_STUDENT', transaction: tx }
 * );
 * ```
 */
export interface IRepository<T, CreateDTO, UpdateDTO> {
  /**
   * Finds entity by primary key identifier.
   *
   * @param {string} id - Unique entity identifier (UUID)
   * @param {QueryOptions} [options] - Query options for eager loading and caching
   * @param {Record<string, boolean>} [options.include] - Related entities to eager load
   * @param {boolean} [options.cacheKey] - Enable caching for this query
   * @param {number} [options.cacheTTL] - Cache time-to-live in seconds
   * @param {Transaction} [options.transaction] - Optional transaction for isolation
   *
   * @returns {Promise<T | null>} Entity if found, null otherwise
   *
   * @throws {RepositoryError} When database query fails
   *
   * @remarks
   * Performance: O(1) lookup using primary key index
   * Caching: Results cached with entity-specific TTL
   * Soft Delete: Excludes soft-deleted records by default
   *
   * @example
   * ```typescript
   * // Simple lookup
   * const student = await repository.findById('student-123');
   *
   * // With eager loading
   * const student = await repository.findById('student-123', {
   *   include: { healthRecords: true, allergies: true }
   * });
   *
   * // With caching
   * const student = await repository.findById('student-123', {
   *   cacheKey: true,
   *   cacheTTL: 3600
   * });
   * ```
   */
  findById(id: string, options?: QueryOptions): Promise<T | null>;

  /**
   * Finds multiple entities matching query criteria with pagination.
   *
   * @param {QueryCriteria<T>} criteria - Query criteria with filters and pagination
   * @param {Partial<T>} criteria.where - Filter conditions (AND logic)
   * @param {Array<{[K in keyof T]?: 'ASC' | 'DESC'}>} [criteria.orderBy] - Sort order
   * @param {Object} [criteria.pagination] - Pagination parameters
   * @param {number} [criteria.pagination.page] - Page number (1-indexed)
   * @param {number} [criteria.pagination.limit] - Records per page (default: 20)
   * @param {QueryOptions} [options] - Additional query options
   *
   * @returns {Promise<PaginatedResult<T>>} Paginated result set with metadata
   *
   * @throws {RepositoryError} When database query fails
   * @throws {ValidationError} When criteria is invalid
   *
   * @remarks
   * Performance: O(log n) with indexed columns, O(n) without
   * Pagination: Uses LIMIT/OFFSET for consistent results
   * Filtering: Supports complex WHERE clauses with AND/OR/NOT
   * Sorting: Multi-column sorting with ASC/DESC
   *
   * @example
   * ```typescript
   * // Find active students in grade 5
   * const result = await repository.findMany({
   *   where: { grade: '5', isActive: true },
   *   pagination: { page: 1, limit: 20 },
   *   orderBy: [{ lastName: 'ASC' }, { firstName: 'ASC' }]
   * });
   *
   * console.log(result.data); // Array of entities
   * console.log(result.pagination); // { page, limit, total, totalPages }
   * ```
   */
  findMany(criteria: QueryCriteria<T>, options?: QueryOptions): Promise<PaginatedResult<T>>;

  /**
   * Creates new entity with validation and audit logging.
   *
   * @param {CreateDTO} data - Entity creation data (validated DTO)
   * @param {ExecutionContext} context - Execution context for audit trail
   * @param {string} context.userId - ID of user performing the action
   * @param {string} context.action - Action type (e.g., 'CREATE_STUDENT')
   * @param {string} [context.ipAddress] - Client IP address
   * @param {Transaction} [context.transaction] - Optional transaction
   *
   * @returns {Promise<T>} Created entity with generated ID and timestamps
   *
   * @throws {RepositoryError} When creation fails
   * @throws {ValidationError} When data validation fails
   * @throws {ConstraintError} When unique constraints are violated
   *
   * @remarks
   * Transaction Handling:
   * - Creates internal transaction if not provided
   * - Commits on success, rolls back on error
   * - Supports multi-entity atomic operations
   *
   * Audit Logging:
   * - Logs entity creation with sanitized data
   * - Includes user ID, timestamp, and action type
   * - HIPAA-compliant audit trail
   *
   * Cache Invalidation:
   * - Invalidates related list caches
   * - Maintains cache consistency
   *
   * @example
   * ```typescript
   * // Create student with audit context
   * const student = await repository.create(
   *   {
   *     firstName: 'Jane',
   *     lastName: 'Smith',
   *     studentNumber: 'STU-2024-001',
   *     grade: '5',
   *     dateOfBirth: new Date('2014-05-15')
   *   },
   *   {
   *     userId: 'nurse-123',
   *     action: 'CREATE_STUDENT',
   *     ipAddress: '192.168.1.1'
   *   }
   * );
   * ```
   */
  create(data: CreateDTO, context: ExecutionContext): Promise<T>;

  /**
   * Updates existing entity with validation and change tracking.
   *
   * @param {string} id - Entity identifier
   * @param {UpdateDTO} data - Partial entity data to update
   * @param {ExecutionContext} context - Execution context for audit trail
   *
   * @returns {Promise<T>} Updated entity with new values
   *
   * @throws {RepositoryError} When update fails
   * @throws {NotFoundError} When entity does not exist (404)
   * @throws {ValidationError} When data validation fails
   * @throws {ConstraintError} When constraints are violated
   *
   * @remarks
   * Change Tracking:
   * - Compares before/after states
   * - Logs only changed fields in audit trail
   * - Excludes timestamp fields from change detection
   *
   * Optimistic Locking:
   * - Uses version field if available
   * - Prevents concurrent modification conflicts
   *
   * Cache Management:
   * - Invalidates entity and related caches
   * - Ensures cache consistency
   *
   * @example
   * ```typescript
   * // Update student grade
   * const student = await repository.update(
   *   'student-123',
   *   { grade: '6', nurseId: 'nurse-456' },
   *   {
   *     userId: 'nurse-456',
   *     action: 'UPDATE_STUDENT',
   *     ipAddress: '192.168.1.1'
   *   }
   * );
   * ```
   */
  update(id: string, data: UpdateDTO, context: ExecutionContext): Promise<T>;

  /**
   * Deletes entity permanently with audit logging.
   *
   * @param {string} id - Entity identifier
   * @param {ExecutionContext} context - Execution context for audit trail
   *
   * @returns {Promise<void>} Resolves when deletion is complete
   *
   * @throws {RepositoryError} When deletion fails
   * @throws {NotFoundError} When entity does not exist (404)
   * @throws {ConstraintError} When foreign key constraints prevent deletion
   *
   * @remarks
   * Hard Delete:
   * - Permanently removes record from database
   * - Consider soft delete for HIPAA compliance
   * - Cannot be undone
   *
   * Foreign Key Handling:
   * - Throws ConstraintError if related records exist
   * - Use CASCADE delete or soft delete for dependent entities
   *
   * Audit Trail:
   * - Logs entity state before deletion
   * - Maintains compliance with data retention policies
   *
   * @example
   * ```typescript
   * // Delete student record
   * await repository.delete('student-123', {
   *   userId: 'admin-789',
   *   action: 'DELETE_STUDENT',
   *   ipAddress: '192.168.1.1'
   * });
   * ```
   */
  delete(id: string, context: ExecutionContext): Promise<void>;

  /**
   * Checks if entity exists matching criteria without retrieving data.
   *
   * @param {Partial<T>} criteria - Partial entity data for matching
   *
   * @returns {Promise<boolean>} True if at least one matching entity exists
   *
   * @remarks
   * Performance: O(log n) using COUNT query without SELECT
   * Use Case: Validation, duplicate detection, relationship checks
   * Soft Delete: Respects soft delete filters
   *
   * @example
   * ```typescript
   * // Check for duplicate student number
   * const exists = await repository.exists({
   *   studentNumber: 'STU-2024-001'
   * });
   *
   * if (exists) {
   *   throw new ValidationError('Student number already exists');
   * }
   * ```
   */
  exists(criteria: Partial<T>): Promise<boolean>;
}
