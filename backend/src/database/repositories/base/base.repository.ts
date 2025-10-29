/**
 * Base Repository Implementation for Sequelize ORM
 *
 * Provides enterprise-grade data access abstraction with comprehensive NestJS integration.
 * This abstract class serves as the foundation for all repository implementations in the
 * White Cross Health Management System, ensuring consistent data access patterns,
 * HIPAA compliance, and optimal performance across the application.
 *
 * Core Features:
 * - Transaction support with automatic rollback on errors
 * - Comprehensive audit logging for HIPAA compliance (all CRUD operations)
 * - Redis-based caching with automatic invalidation
 * - Query optimization with eager loading support
 * - Soft delete support for data retention compliance
 * - Type-safe operations with full TypeScript generics
 * - Automatic error handling with custom error types
 * - Pagination support with metadata
 * - Bulk operations with validation
 *
 * Architecture:
 * - Implements Repository Pattern for clean separation of concerns
 * - Uses Dependency Injection for audit logger and cache manager
 * - Provides template methods for custom validation and sanitization
 * - Supports complex query criteria with AND/OR/NOT operators
 *
 * @template TModel - Sequelize model type extending Model with required id field
 * @template TAttributes - Model attributes type with id field (defaults to model attributes)
 * @template TCreationAttributes - Model creation attributes type (defaults to creation attributes)
 *
 * @example Basic Repository Implementation
 * ```typescript
 * @Injectable()
 * export class UserRepository extends BaseRepository<
 *   User,
 *   UserAttributes,
 *   CreateUserDTO
 * > {
 *   constructor(
 *     @InjectModel(User) model: ModelStatic<User>,
 *     auditLogger: IAuditLogger,
 *     cacheManager: ICacheManager
 *   ) {
 *     super(model, auditLogger, cacheManager, 'User');
 *   }
 *
 *   protected async invalidateCaches(entity: User): Promise<void> {
 *     await this.cacheManager.delete(
 *       this.cacheKeyBuilder.entity(this.entityName, entity.id)
 *     );
 *   }
 *
 *   protected sanitizeForAudit(data: any): any {
 *     const { password, ...safe } = data;
 *     return safe;
 *   }
 * }
 * ```
 *
 * @example Using Repository in Service
 * ```typescript
 * @Injectable()
 * export class UserService {
 *   constructor(private readonly userRepository: UserRepository) {}
 *
 *   async createUser(dto: CreateUserDTO, context: ExecutionContext) {
 *     return await this.userRepository.create(dto, context);
 *   }
 *
 *   async findUsers(criteria: QueryCriteria<UserAttributes>) {
 *     return await this.userRepository.findMany(criteria);
 *   }
 * }
 * ```
 *
 * @remarks
 * - All CRUD operations automatically log audit trails for HIPAA compliance
 * - Cache invalidation occurs automatically on create/update/delete
 * - Transactions are managed automatically with rollback on error
 * - Concrete repositories must implement `invalidateCaches` and `sanitizeForAudit`
 *
 * @see {@link IRepository} for the repository interface
 * @see {@link IAuditLogger} for audit logging functionality
 * @see {@link ICacheManager} for caching functionality
 *
 * @since 1.0.0
 */

import { Logger } from '@nestjs/common';
import {
  Model,
  ModelStatic,
  Transaction,
  FindOptions,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
  WhereOptions,
  Attributes,
  CreationAttributes,
  Op
} from 'sequelize';
import { IRepository, RepositoryError } from '../interfaces/repository.interface';
import { ExecutionContext, QueryOptions, QueryCriteria, PaginatedResult, createPaginationMetadata, calculateSkip } from '../../types';
import { IAuditLogger, sanitizeSensitiveData } from '../../interfaces/audit/audit-logger.interface';
import { ICacheManager, CacheKeyBuilder } from '../../interfaces/cache/cache-manager.interface';
import { getCacheTTL } from '../../types/database.enums';

/**
 * Abstract base repository for Sequelize models
 *
 * Implements common CRUD operations with enterprise patterns including
 * caching, auditing, transactions, and validation.
 */
export abstract class BaseRepository<
  TModel extends Model & { id: string },
  TAttributes extends { id: string } = Attributes<TModel>,
  TCreationAttributes = CreationAttributes<TModel>
> implements IRepository<TAttributes, TCreationAttributes, Partial<TAttributes>> {

  /** NestJS logger instance for repository operations */
  protected readonly logger: Logger;

  /** Sequelize model class for database operations */
  protected readonly model: ModelStatic<TModel>;

  /** Audit logger for HIPAA compliance tracking */
  protected readonly auditLogger: IAuditLogger;

  /** Cache manager for Redis-based caching */
  protected readonly cacheManager: ICacheManager;

  /** Entity name for logging and cache keys */
  protected readonly entityName: string;

  /** Cache key builder utility for consistent key generation */
  protected readonly cacheKeyBuilder: CacheKeyBuilder;

  /**
   * Creates a new repository instance with injected dependencies
   *
   * @param {ModelStatic<TModel>} model - Sequelize model class to operate on
   * @param {IAuditLogger} auditLogger - Audit logger for compliance tracking
   * @param {ICacheManager} cacheManager - Cache manager for Redis operations
   * @param {string} entityName - Human-readable entity name for logging
   *
   * @example
   * ```typescript
   * constructor(
   *   @InjectModel(User) model: ModelStatic<User>,
   *   auditLogger: IAuditLogger,
   *   cacheManager: ICacheManager
   * ) {
   *   super(model, auditLogger, cacheManager, 'User');
   * }
   * ```
   */
  constructor(
    model: ModelStatic<TModel>,
    auditLogger: IAuditLogger,
    cacheManager: ICacheManager,
    entityName: string
  ) {
    this.model = model;
    this.auditLogger = auditLogger;
    this.cacheManager = cacheManager;
    this.entityName = entityName;
    this.cacheKeyBuilder = new CacheKeyBuilder();
    this.logger = new Logger(`${entityName}Repository`);
  }

  /**
   * Find entity by primary key with caching support
   *
   * Retrieves a single entity by its unique identifier. Results are cached
   * in Redis for improved performance on subsequent reads. Cache is automatically
   * invalidated on entity updates or deletes.
   *
   * @param {string} id - Entity UUID to find
   * @param {QueryOptions} [options] - Optional query options for eager loading and caching
   * @param {Object} [options.include] - Relations to eager load
   * @param {Object} [options.select] - Specific fields to select
   * @param {string} [options.cacheKey] - Custom cache key (overrides default)
   * @param {number} [options.cacheTTL] - Cache time-to-live in seconds
   * @returns {Promise<TAttributes | null>} Entity attributes or null if not found
   * @throws {RepositoryError} When database operation fails
   *
   * @example Basic Usage
   * ```typescript
   * const user = await userRepository.findById('123e4567-e89b-12d3-a456-426614174000');
   * if (user) {
   *   console.log(user.email);
   * }
   * ```
   *
   * @example With Relations
   * ```typescript
   * const appointment = await appointmentRepository.findById(
   *   appointmentId,
   *   { include: { nurse: true, student: true } }
   * );
   * ```
   *
   * @remarks
   * - Cache hit logs are written at debug level
   * - Cache misses trigger database query and cache population
   * - Default cache TTL is determined by entity type
   * - Returns null for non-existent entities (does not throw)
   */
  async findById(
    id: string,
    options?: QueryOptions
  ): Promise<TAttributes | null> {
    try {
      // Check cache first if enabled
      const cacheKey = this.cacheKeyBuilder.entity(this.entityName, id);
      if (options?.cacheKey || this.shouldCache()) {
        const cached = await this.cacheManager.get<TAttributes>(cacheKey);
        if (cached) {
          this.logger.debug(`Cache hit for ${this.entityName}:${id}`);
          return cached;
        }
      }

      const findOptions = this.buildFindOptions(options);
      const result = await this.model.findByPk(id, findOptions);

      if (!result) {
        return null;
      }

      const entity = this.mapToEntity(result);

      // Cache result if enabled
      if (this.shouldCache()) {
        const ttl = options?.cacheTTL || getCacheTTL(this.entityName);
        await this.cacheManager.set(cacheKey, entity, ttl);
      }

      return entity;
    } catch (error) {
      this.logger.error(`Error finding ${this.entityName} by ID:`, error);
      throw new RepositoryError(
        `Failed to find ${this.entityName}`,
        'FIND_ERROR',
        500,
        { id, error: (error as Error).message }
      );
    }
  }

  /**
   * Find multiple entities with pagination and filtering
   *
   * Executes a complex query with support for filtering, sorting, pagination,
   * and eager loading of relations. Returns paginated results with metadata
   * for building data tables and infinite scrolling interfaces.
   *
   * @param {QueryCriteria<TAttributes>} criteria - Query criteria object
   * @param {Object} criteria.where - Filter conditions (supports AND/OR/NOT)
   * @param {Object} [criteria.pagination] - Pagination settings
   * @param {number} [criteria.pagination.page=1] - Page number (1-indexed)
   * @param {number} [criteria.pagination.limit=20] - Records per page
   * @param {Array} [criteria.orderBy] - Sort order specifications
   * @param {QueryOptions} [options] - Additional query options
   * @returns {Promise<PaginatedResult<TAttributes>>} Paginated results with metadata
   * @throws {RepositoryError} When query execution fails
   *
   * @example Basic Pagination
   * ```typescript
   * const result = await userRepository.findMany({
   *   where: { isActive: true },
   *   pagination: { page: 1, limit: 10 },
   *   orderBy: [{ createdAt: 'DESC' }]
   * });
   * console.log(result.data); // Array of users
   * console.log(result.pagination); // { page, limit, total, pages }
   * ```
   *
   * @example Complex Filtering
   * ```typescript
   * const result = await appointmentRepository.findMany({
   *   where: {
   *     AND: [
   *       { status: 'SCHEDULED' },
   *       { scheduledAt: { [Op.gte]: new Date() } }
   *     ]
   *   },
   *   pagination: { page: 1, limit: 20 }
   * }, {
   *   include: { nurse: true, student: true }
   * });
   * ```
   *
   * @remarks
   * - Default page size is 20 records
   * - Pagination metadata includes total count and page count
   * - Supports complex where clauses with AND/OR/NOT operators
   * - Results are not cached (use for dynamic queries)
   */
  async findMany(
    criteria: QueryCriteria<TAttributes>,
    options?: QueryOptions
  ): Promise<PaginatedResult<TAttributes>> {
    try {
      const page = criteria.pagination?.page || 1;
      const limit = criteria.pagination?.limit || 20;
      const offset = calculateSkip(page, limit);

      const whereClause = this.buildWhereClause(criteria.where);
      const orderClause = this.buildOrderClause(criteria.orderBy || options?.orderBy);

      const findOptions: FindOptions = {
        where: whereClause,
        order: orderClause,
        limit,
        offset,
        ...this.buildFindOptions(options)
      };

      const { rows, count } = await this.model.findAndCountAll(findOptions);

      const entities = rows.map((row) => this.mapToEntity(row));

      return {
        data: entities,
        pagination: createPaginationMetadata(page, limit, count)
      };
    } catch (error) {
      this.logger.error(`Error finding ${this.entityName} records:`, error);
      throw new RepositoryError(
        `Failed to find ${this.entityName} records`,
        'FIND_MANY_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  /**
   * Create new entity with validation, audit logging, and cache invalidation
   *
   * Creates a new entity in the database with full transaction support.
   * All create operations are audited for HIPAA compliance, and related
   * caches are automatically invalidated.
   *
   * @param {TCreationAttributes} data - Entity creation data
   * @param {ExecutionContext} context - Execution context with user information
   * @param {string} context.userId - ID of user creating the entity
   * @param {string} [context.ipAddress] - IP address of the request
   * @param {string} [context.userAgent] - User agent of the request
   * @returns {Promise<TAttributes>} Created entity attributes
   * @throws {RepositoryError} When creation fails or validation fails
   *
   * @example Basic Creation
   * ```typescript
   * const user = await userRepository.create(
   *   {
   *     email: 'nurse@school.edu',
   *     password: 'hashedPassword',
   *     firstName: 'Jane',
   *     lastName: 'Doe',
   *     role: UserRole.NURSE
   *   },
   *   { userId: 'admin-id', ipAddress: '192.168.1.1' }
   * );
   * ```
   *
   * @remarks
   * - Automatically starts and commits database transaction
   * - Calls `validateCreate` template method for custom validation
   * - Logs create operation to audit log with sanitized data
   * - Invalidates related caches via `invalidateCaches` template method
   * - Rolls back transaction automatically on any error
   * - All sensitive data should be removed in `sanitizeForAudit`
   */
  async create(
    data: TCreationAttributes,
    context: ExecutionContext
  ): Promise<TAttributes> {
    let transaction: Transaction | undefined;

    try {
      // Validate before creation
      await this.validateCreate(data);

      // Start transaction if not provided
      transaction = await this.model.sequelize!.transaction();

      const createOptions: CreateOptions = {
        transaction
      };

      const result = await this.model.create(data as any, createOptions);

      // Audit log
      await this.auditLogger.logCreate(
        this.entityName,
        result.id as string,
        context,
        this.sanitizeForAudit(result.get())
      );

      // Invalidate related caches
      await this.invalidateCaches(result);

      await transaction.commit();

      this.logger.log(`Created ${this.entityName}:${result.id} by user ${context.userId}`);

      return this.mapToEntity(result);
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      this.logger.error(`Error creating ${this.entityName}:`, error);

      if (error instanceof RepositoryError) {
        throw error;
      }

      throw new RepositoryError(
        `Failed to create ${this.entityName}`,
        'CREATE_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  /**
   * Update existing entity with change tracking and audit logging
   *
   * Updates an existing entity with automatic change detection, audit logging,
   * and cache invalidation. Only changed fields are logged in the audit trail
   * for HIPAA compliance and forensic analysis.
   *
   * @param {string} id - Entity UUID to update
   * @param {Partial<TAttributes>} data - Partial entity data to update
   * @param {ExecutionContext} context - Execution context with user information
   * @returns {Promise<TAttributes>} Updated entity attributes
   * @throws {RepositoryError} When entity not found (404) or update fails
   *
   * @example Basic Update
   * ```typescript
   * const updatedUser = await userRepository.update(
   *   userId,
   *   { isActive: false, lastLogin: new Date() },
   *   { userId: 'admin-id' }
   * );
   * ```
   *
   * @example Partial Update
   * ```typescript
   * await appointmentRepository.update(
   *   appointmentId,
   *   { status: AppointmentStatus.COMPLETED, notes: 'Visit completed successfully' },
   *   { userId: nurseId }
   * );
   * ```
   *
   * @remarks
   * - Retrieves existing entity for change detection
   * - Calls `validateUpdate` template method for custom validation
   * - Calculates field-level changes (before/after values)
   * - Only logs changes (ignores updatedAt, createdAt timestamps)
   * - Throws RepositoryError with 404 status if entity not found
   * - Automatically invalidates related caches
   * - Rolls back transaction on error
   */
  async update(
    id: string,
    data: Partial<TAttributes>,
    context: ExecutionContext
  ): Promise<TAttributes> {
    let transaction: Transaction | undefined;

    try {
      // Get existing record for audit trail
      const existing = await this.model.findByPk(id);

      if (!existing) {
        throw new RepositoryError(
          `${this.entityName} not found`,
          'NOT_FOUND',
          404,
          { id }
        );
      }

      // Validate before update
      await this.validateUpdate(id, data);

      // Start transaction
      transaction = await this.model.sequelize!.transaction();

      const updateOptions: UpdateOptions = {
        where: { id } as any,
        transaction,
        returning: true
      };

      await this.model.update(data as any, updateOptions);

      // Fetch updated record
      const updated = await this.model.findByPk(id, { transaction });

      if (!updated) {
        throw new RepositoryError(
          `${this.entityName} not found after update`,
          'UPDATE_ERROR',
          500,
          { id }
        );
      }

      // Calculate changes for audit
      const changes = this.calculateChanges(
        existing.get(),
        updated.get()
      );

      // Audit log with changes
      if (Object.keys(changes).length > 0) {
        await this.auditLogger.logUpdate(
          this.entityName,
          id,
          context,
          changes
        );
      }

      // Invalidate related caches
      await this.invalidateCaches(updated);

      await transaction.commit();

      this.logger.log(`Updated ${this.entityName}:${id} by user ${context.userId}`);

      return this.mapToEntity(updated);
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      this.logger.error(`Error updating ${this.entityName}:`, error);

      if (error instanceof RepositoryError) {
        throw error;
      }

      throw new RepositoryError(
        `Failed to update ${this.entityName}`,
        'UPDATE_ERROR',
        500,
        { id, error: (error as Error).message }
      );
    }
  }

  /**
   * Delete entity permanently (hard delete)
   *
   * Permanently removes an entity from the database. This is a hard delete
   * operation that cannot be reversed. For HIPAA compliance and data retention,
   * consider using soft delete instead by implementing a `deletedAt` field.
   *
   * @param {string} id - Entity UUID to delete
   * @param {ExecutionContext} context - Execution context with user information
   * @returns {Promise<void>}
   * @throws {RepositoryError} When entity not found (404) or deletion fails
   *
   * @example Delete Entity
   * ```typescript
   * await userRepository.delete(userId, { userId: 'admin-id' });
   * ```
   *
   * @remarks
   * - This is a permanent deletion operation
   * - Audit log records the deletion with sanitized entity data
   * - Related caches are automatically invalidated
   * - Throws RepositoryError with 404 if entity not found
   * - For HIPAA compliance, consider soft delete patterns
   * - Transaction is rolled back on error
   *
   * @see Consider implementing soft delete for data retention compliance
   */
  async delete(id: string, context: ExecutionContext): Promise<void> {
    let transaction: Transaction | undefined;

    try {
      const existing = await this.model.findByPk(id);

      if (!existing) {
        throw new RepositoryError(
          `${this.entityName} not found`,
          'NOT_FOUND',
          404,
          { id }
        );
      }

      transaction = await this.model.sequelize!.transaction();

      const destroyOptions: DestroyOptions = {
        where: { id } as any,
        transaction
      };

      await this.model.destroy(destroyOptions);

      // Audit log
      await this.auditLogger.logDelete(
        this.entityName,
        id,
        context,
        this.sanitizeForAudit(existing.get())
      );

      // Invalidate related caches
      await this.invalidateCaches(existing);

      await transaction.commit();

      this.logger.log(`Deleted ${this.entityName}:${id} by user ${context.userId}`);
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      this.logger.error(`Error deleting ${this.entityName}:`, error);

      if (error instanceof RepositoryError) {
        throw error;
      }

      throw new RepositoryError(
        `Failed to delete ${this.entityName}`,
        'DELETE_ERROR',
        500,
        { id, error: (error as Error).message }
      );
    }
  }

  /**
   * Check if entity exists matching given criteria
   *
   * Performs a lightweight existence check without retrieving full entity data.
   * Useful for validation before creating related entities or checking uniqueness.
   *
   * @param {Partial<TAttributes>} criteria - Criteria to match against
   * @returns {Promise<boolean>} True if at least one matching entity exists
   *
   * @example Check Email Exists
   * ```typescript
   * const emailExists = await userRepository.exists({ email: 'test@example.com' });
   * if (emailExists) {
   *   throw new Error('Email already in use');
   * }
   * ```
   *
   * @example Check Multiple Criteria
   * ```typescript
   * const exists = await appointmentRepository.exists({
   *   studentId: studentId,
   *   scheduledAt: appointmentDate,
   *   status: 'SCHEDULED'
   * });
   * ```
   *
   * @remarks
   * - More efficient than findOne when you only need existence check
   * - Returns false on query errors (logs error for debugging)
   * - Does not throw RepositoryError on failure
   */
  async exists(criteria: Partial<TAttributes>): Promise<boolean> {
    try {
      const count = await this.model.count({
        where: criteria as WhereOptions
      });
      return count > 0;
    } catch (error) {
      this.logger.error(`Error checking ${this.entityName} existence:`, error);
      return false;
    }
  }

  /**
   * Bulk create multiple entities in a single transaction
   *
   * Creates multiple entities efficiently in a single database transaction.
   * Validates all entities before insertion and rolls back on any failure.
   * Ideal for importing data, seeding databases, or batch operations.
   *
   * @param {TCreationAttributes[]} data - Array of entity creation data
   * @param {ExecutionContext} context - Execution context with user information
   * @returns {Promise<TAttributes[]>} Array of created entity attributes
   * @throws {RepositoryError} When any entity fails validation or creation
   *
   * @example Bulk Import Users
   * ```typescript
   * const users = await userRepository.bulkCreate([
   *   { email: 'user1@example.com', firstName: 'John', lastName: 'Doe', role: UserRole.NURSE },
   *   { email: 'user2@example.com', firstName: 'Jane', lastName: 'Smith', role: UserRole.NURSE }
   * ], { userId: 'admin-id' });
   * console.log(`Created ${users.length} users`);
   * ```
   *
   * @remarks
   * - All entities created in single transaction (all-or-nothing)
   * - Validates each entity before insertion
   * - Audit log records bulk operation count (not individual entities)
   * - More efficient than multiple create() calls
   * - Rolls back entire operation on any failure
   * - Does not trigger individual cache invalidation (clear entire cache)
   */
  async bulkCreate(
    data: TCreationAttributes[],
    context: ExecutionContext
  ): Promise<TAttributes[]> {
    let transaction: Transaction | undefined;

    try {
      transaction = await this.model.sequelize!.transaction();

      const results = await this.model.bulkCreate(data as any[], {
        transaction,
        validate: true,
        returning: true
      });

      // Audit log bulk operation
      await this.auditLogger.logBulkOperation(
        'BULK_CREATE',
        this.entityName,
        context,
        { count: results.length }
      );

      await transaction.commit();

      this.logger.log(`Bulk created ${results.length} ${this.entityName} records`);

      return results.map((r) => this.mapToEntity(r));
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      this.logger.error(`Error bulk creating ${this.entityName}:`, error);
      throw new RepositoryError(
        `Failed to bulk create ${this.entityName}`,
        'BULK_CREATE_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  /**
   * Count entities matching optional criteria
   *
   * Performs an efficient count query without retrieving entity data.
   * Useful for statistics, pagination metadata, and dashboard metrics.
   *
   * @param {Partial<TAttributes>} [criteria] - Optional filter criteria
   * @returns {Promise<number>} Count of matching entities
   * @throws {RepositoryError} When count query fails
   *
   * @example Count All
   * ```typescript
   * const totalUsers = await userRepository.count();
   * ```
   *
   * @example Count with Filter
   * ```typescript
   * const activeNurses = await userRepository.count({
   *   role: UserRole.NURSE,
   *   isActive: true
   * });
   * ```
   *
   * @remarks
   * - Database-level count operation (very efficient)
   * - Returns 0 for no matches
   * - Does not load entity data into memory
   */
  async count(criteria?: Partial<TAttributes>): Promise<number> {
    try {
      return await this.model.count({
        where: criteria as WhereOptions
      });
    } catch (error) {
      this.logger.error(`Error counting ${this.entityName}:`, error);
      throw new RepositoryError(
        `Failed to count ${this.entityName}`,
        'COUNT_ERROR',
        500,
        { error: (error as Error).message }
      );
    }
  }

  // ============ Protected Helper Methods ============

  /**
   * Map Sequelize model instance to entity attributes
   *
   * Converts a Sequelize model instance to a plain JavaScript object with
   * entity attributes. Override this method to implement custom mapping logic,
   * computed properties, or data transformation.
   *
   * @param {TModel} model - Sequelize model instance to map
   * @returns {TAttributes} Plain object with entity attributes
   *
   * @example Custom Mapping with Computed Properties
   * ```typescript
   * protected mapToEntity(model: User): UserAttributes {
   *   const attributes = super.mapToEntity(model);
   *   return {
   *     ...attributes,
   *     fullName: `${attributes.firstName} ${attributes.lastName}`,
   *     isLocked: attributes.lockoutUntil ? attributes.lockoutUntil > new Date() : false
   *   };
   * }
   * ```
   *
   * @remarks
   * - Default implementation returns plain object from model.get()
   * - Override to add computed properties or transform data
   * - Called for all query results before returning to caller
   */
  protected mapToEntity(model: TModel): TAttributes {
    return model.get({ plain: true }) as TAttributes;
  }

  /**
   * Build Sequelize find options from query options
   */
  protected buildFindOptions(options?: QueryOptions): FindOptions {
    const findOptions: FindOptions = {};

    if (options?.include) {
      findOptions.include = this.buildIncludeClause(options.include);
    }

    if (options?.select) {
      findOptions.attributes = this.buildAttributesClause(options.select);
    }

    return findOptions;
  }

  /**
   * Build include clause for relations
   */
  protected buildIncludeClause(include: QueryOptions['include']): any[] {
    if (!include) return [];
    return Object.keys(include).filter((key) => include[key]);
  }

  /**
   * Build attributes clause for field selection
   */
  protected buildAttributesClause(select: QueryOptions['select']): string[] {
    if (!select) return [];
    return Object.keys(select).filter((key) => select[key]);
  }

  /**
   * Build where clause from criteria
   */
  protected buildWhereClause(where: any): WhereOptions {
    if (!where) return {};

    // Handle complex where clauses (AND, OR, NOT)
    if (where.AND || where.OR || where.NOT) {
      const clause: any = {};

      if (where.AND) {
        clause[Op.and] = where.AND;
      }

      if (where.OR) {
        clause[Op.or] = where.OR;
      }

      if (where.NOT) {
        clause[Op.not] = where.NOT;
      }

      return clause;
    }

    return where as WhereOptions;
  }

  /**
   * Build order clause from criteria
   */
  protected buildOrderClause(orderBy: any): any {
    if (!orderBy) return [];

    if (Array.isArray(orderBy)) {
      return orderBy.map((order) => {
        const key = Object.keys(order)[0];
        return [key, order[key].toUpperCase()];
      });
    }

    return Object.entries(orderBy).map(([key, direction]) => [
      key,
      (direction as string).toUpperCase()
    ]);
  }

  /**
   * Calculate changes between before and after states
   */
  protected calculateChanges(
    before: any,
    after: any
  ): Record<string, { before: any; after: any }> {
    const changes: Record<string, { before: any; after: any }> = {};

    for (const key in after) {
      if (
        before[key] !== after[key] &&
        key !== 'updatedAt' &&
        key !== 'createdAt'
      ) {
        changes[key] = {
          before: before[key],
          after: after[key]
        };
      }
    }

    return changes;
  }

  /**
   * Validate data before entity creation
   *
   * Template method called before creating a new entity. Override to implement
   * custom validation logic, business rules, or constraint checks. Throw
   * RepositoryError for validation failures.
   *
   * @param {TCreationAttributes} data - Entity creation data to validate
   * @returns {Promise<void>}
   * @throws {RepositoryError} When validation fails
   *
   * @example Email Uniqueness Validation
   * ```typescript
   * protected async validateCreate(data: CreateUserDTO): Promise<void> {
   *   const emailExists = await this.exists({ email: data.email });
   *   if (emailExists) {
   *     throw new RepositoryError(
   *       'Email already in use',
   *       'VALIDATION_ERROR',
   *       400,
   *       { email: data.email }
   *     );
   *   }
   * }
   * ```
   *
   * @remarks
   * - Called within create transaction (before database insert)
   * - Validation errors roll back the transaction
   * - Use for business logic validation, not database constraints
   * - Default implementation performs no validation
   */
  protected async validateCreate(data: TCreationAttributes): Promise<void> {
    // Default: no validation
  }

  /**
   * Validate data before entity update
   *
   * Template method called before updating an entity. Override to implement
   * custom validation logic, business rules, or constraint checks specific
   * to update operations.
   *
   * @param {string} id - ID of entity being updated
   * @param {Partial<TAttributes>} data - Entity update data to validate
   * @returns {Promise<void>}
   * @throws {RepositoryError} When validation fails
   *
   * @example Prevent Role Downgrade
   * ```typescript
   * protected async validateUpdate(id: string, data: Partial<UserAttributes>): Promise<void> {
   *   if (data.role) {
   *     const existing = await this.findById(id);
   *     if (existing?.role === UserRole.ADMIN && data.role !== UserRole.ADMIN) {
   *       throw new RepositoryError(
   *         'Cannot downgrade admin role',
   *         'VALIDATION_ERROR',
   *         400
   *       );
   *     }
   *   }
   * }
   * ```
   *
   * @remarks
   * - Called within update transaction (before database update)
   * - Has access to entity ID for querying current state
   * - Validation errors roll back the transaction
   * - Default implementation performs no validation
   */
  protected async validateUpdate(id: string, data: Partial<TAttributes>): Promise<void> {
    // Default: no validation
  }

  /**
   * Determine if caching should be enabled for this entity type
   *
   * Template method to control caching behavior per repository.
   * Override to disable caching for entities that change frequently
   * or contain sensitive data.
   *
   * @returns {boolean} True if caching enabled (default), false otherwise
   *
   * @example Disable Caching for Audit Logs
   * ```typescript
   * protected shouldCache(): boolean {
   *   return false; // Audit logs change too frequently
   * }
   * ```
   *
   * @remarks
   * - Default implementation enables caching
   * - Consider disabling for high-write entities
   * - Caching improves read performance but adds memory overhead
   */
  protected shouldCache(): boolean {
    return true;
  }

  /**
   * Invalidate related caches after entity mutation
   *
   * Template method called after create, update, or delete operations.
   * Concrete repositories MUST implement this to invalidate relevant cache keys.
   * Invalidate both entity-specific and list/query caches.
   *
   * @param {TModel} entity - Entity that was created, updated, or deleted
   * @returns {Promise<void>}
   *
   * @example Basic Cache Invalidation
   * ```typescript
   * protected async invalidateCaches(entity: User): Promise<void> {
   *   const entityData = entity.get();
   *   // Invalidate specific entity cache
   *   await this.cacheManager.delete(
   *     this.cacheKeyBuilder.entity(this.entityName, entityData.id)
   *   );
   *   // Invalidate all list queries for this entity type
   *   await this.cacheManager.deletePattern(`white-cross:user:*`);
   * }
   * ```
   *
   * @remarks
   * - Called within transaction (after database operation)
   * - Should not throw errors (log warnings instead)
   * - Invalidate both entity and list caches
   * - Use pattern matching for query result caches
   */
  protected abstract invalidateCaches(entity: TModel): Promise<void>;

  /**
   * Sanitize entity data for audit logging
   *
   * Template method to remove sensitive fields before writing to audit log.
   * Concrete repositories MUST implement this to ensure HIPAA compliance
   * and prevent logging of passwords, tokens, or other sensitive data.
   *
   * @param {any} data - Raw entity data to sanitize
   * @returns {any} Sanitized data safe for audit logging
   *
   * @example Remove Sensitive Fields
   * ```typescript
   * protected sanitizeForAudit(data: any): any {
   *   const {
   *     password,
   *     passwordResetToken,
   *     twoFactorSecret,
   *     emailVerificationToken,
   *     ...safeData
   *   } = data;
   *   return safeData;
   * }
   * ```
   *
   * @example Use Utility Function
   * ```typescript
   * protected sanitizeForAudit(data: any): any {
   *   return sanitizeSensitiveData(data);
   * }
   * ```
   *
   * @remarks
   * - Remove passwords, tokens, secrets, and PHI
   * - Audit logs are retained for compliance (be careful!)
   * - Use sanitizeSensitiveData utility for common fields
   * - Consider what data is needed for forensic analysis
   */
  protected abstract sanitizeForAudit(data: any): any;
}

// Export RepositoryError for use by concrete repositories
export { RepositoryError } from '../interfaces/repository.interface';
