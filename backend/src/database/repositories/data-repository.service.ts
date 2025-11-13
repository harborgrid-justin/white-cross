/**
 * @fileoverview Advanced Repository Pattern for Sequelize + NestJS
 * @module reuse/data/data-repository
 * @description Production-ready repository pattern with generic base classes,
 * unit of work, specification pattern, and advanced data access abstractions
 *
 * @version 1.0.0
 * @requires sequelize ^6.x
 * @requires @nestjs/common ^10.x
 * @requires sequelize-typescript ^2.x
 *
 * ## Repository Pattern Best Practices
 *
 * ### Repository Types and When to Use Them
 *
 * #### 1. BaseRepository
 * - **Use for**: Standard CRUD operations
 * - **Scope**: Singleton (DEFAULT)
 * - **Features**: Full CRUD, pagination, specifications
 * - **Example**: UserRepository, PatientRepository
 *
 * #### 2. ReadOnlyRepository
 * - **Use for**: Query-only operations (CQRS read side)
 * - **Scope**: Singleton (DEFAULT)
 * - **Features**: Read operations only, no mutations
 * - **Example**: ReportingRepository, AnalyticsRepository
 *
 * #### 3. CachedRepository
 * - **Use for**: Frequently accessed, rarely changed data
 * - **Scope**: Singleton (DEFAULT)
 * - **Features**: In-memory cache layer, TTL support
 * - **Example**: ConfigRepository, ReferenceDataRepository
 *
 * #### 4. TransactionalRepository
 * - **Use for**: Multi-step operations requiring atomicity
 * - **Scope**: Singleton (DEFAULT)
 * - **Features**: Automatic transaction management
 * - **Example**: OrderRepository, PaymentRepository
 *
 * #### 5. AuditRepository
 * - **Use for**: HIPAA/compliance-sensitive data
 * - **Scope**: Singleton (DEFAULT)
 * - **Features**: Comprehensive audit logging
 * - **Example**: MedicalRecordRepository, FinancialRepository
 *
 * #### 6. SoftDeleteRepository
 * - **Use for**: Data that should be recoverable
 * - **Scope**: Singleton (DEFAULT)
 * - **Features**: Soft delete, restore capabilities
 * - **Example**: PatientRepository, DocumentRepository
 *
 * #### 7. MultiTenantRepository
 * - **Use for**: Multi-tenant applications
 * - **Scope**: Singleton (DEFAULT)
 * - **Features**: Automatic tenant filtering
 * - **Example**: SchoolDataRepository, OrganizationRepository
 *
 * ## Dependency Injection Best Practices
 *
 * ### Repository Registration
 * ```typescript
 * @Module({
 *   providers: [
 *     {
 *       provide: 'PatientRepository',
 *       useClass: PatientRepository,
 *       scope: Scope.DEFAULT // Singleton
 *     },
 *     UnitOfWork,
 *   ],
 *   exports: ['PatientRepository', UnitOfWork]
 * })
 * export class DataModule {}
 * ```
 *
 * ### Repository Usage in Services
 * ```typescript
 * @Injectable()
 * export class PatientService extends BaseService {
 *   constructor(
 *     @Inject('PatientRepository')
 *     private readonly patientRepo: PatientRepository,
 *     private readonly unitOfWork: UnitOfWork
 *   ) {}
 * }
 * ```
 *
 * ## Transaction Management
 *
 * ### Using Unit of Work Pattern
 * ```typescript
 * async transferPatient(patientId: string, newSchoolId: string): Promise<void> {
 *   await this.unitOfWork.begin();
 *   try {
 *     const tx = this.unitOfWork.getTransaction();
 *     await this.patientRepo.update(patientId, { schoolId: newSchoolId }, audit, tx);
 *     await this.enrollmentRepo.create({ patientId, schoolId: newSchoolId }, audit, tx);
 *     await this.unitOfWork.commit();
 *   } catch (error) {
 *     await this.unitOfWork.rollback();
 *     throw error;
 *   }
 * }
 * ```
 *
 * ## Circular Dependency Prevention
 *
 * 1. **Repositories should NOT inject services** - only other repositories or utilities
 * 2. **Services inject repositories** - never the reverse
 * 3. **Use events** for cross-repository communication
 * 4. **Extract shared queries** to specification objects
 *
 * ## Performance Optimization
 *
 * 1. **Use eager loading** for known associations
 * 2. **Implement caching** for reference data
 * 3. **Use specifications** to reuse complex queries
 * 4. **Batch operations** when processing multiple records
 * 5. **Index frequently queried fields**
 */

import { Logger, Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../common/base';
import {
  Model,
  ModelCtor,
  Transaction,
  FindOptions,
  WhereOptions,
  Sequelize,
  Op,
  Attributes,
  CreationAttributes,
} from 'sequelize';
import {
  PaginatedResult,
  QueryBuilderConfig,
  buildPaginatedQuery,
  buildOptimizedQuery,
  PaginationOptions,
} from './query-builder';
import {
  AuditMetadata,
  createWithAudit,
  updateWithAudit,
  softDelete,
} from '../services/database-operations.service';

/**
 * Specification interface for query specifications
 * @template T Entity type
 * @description Defines the contract for reusable query specifications.
 * Specifications encapsulate query logic and can be composed using combinators.
 *
 * @remarks
 * - **Pattern**: Specification pattern for query composition
 * - **Use Case**: Reusable complex queries, business rule enforcement
 * - **Benefits**: Testable, composable, maintainable queries
 *
 * @example
 * ```typescript
 * // Define specifications
 * class ActivePatientSpec extends Specification<Patient> {
 *   toQuery(): WhereOptions<any> {
 *     return { deletedAt: null, status: 'active' };
 *   }
 * }
 *
 * class SchoolPatientSpec extends Specification<Patient> {
 *   constructor(private schoolId: string) { super(); }
 *   toQuery(): WhereOptions<any> {
 *     return { schoolId: this.schoolId };
 *   }
 * }
 *
 * // Compose specifications
 * const activeSchoolPatients = new ActivePatientSpec()
 *   .and(new SchoolPatientSpec('school-123'));
 *
 * // Use in repository
 * const patients = await patientRepo.findBySpecification(activeSchoolPatients);
 * ```
 */
export interface ISpecification<T> {
  /**
   * Converts specification to Sequelize where clause
   * @returns Sequelize where options
   */
  toQuery(): WhereOptions<any>;

  /**
   * Combines this specification with another using AND logic
   * @param spec Specification to combine
   * @returns Combined specification
   */
  and(spec: ISpecification<T>): ISpecification<T>;

  /**
   * Combines this specification with another using OR logic
   * @param spec Specification to combine
   * @returns Combined specification
   */
  or(spec: ISpecification<T>): ISpecification<T>;

  /**
   * Negates this specification
   * @returns Negated specification
   */
  not(): ISpecification<T>;
}

/**
 * Base specification implementation
 * @template T Entity type
 * @description Abstract base class for creating reusable query specifications.
 *
 * @example
 * ```typescript
 * class PatientAgeSpec extends Specification<Patient> {
 *   constructor(private minAge: number, private maxAge: number) {
 *     super();
 *   }
 *
 *   toQuery(): WhereOptions<any> {
 *     return {
 *       age: {
 *         [Op.gte]: this.minAge,
 *         [Op.lte]: this.maxAge
 *       }
 *     };
 *   }
 * }
 *
 * // Usage
 * const teenagerSpec = new PatientAgeSpec(13, 19);
 * const teenagers = await patientRepo.findBySpecification(teenagerSpec);
 * ```
 */
export abstract class Specification<T> implements ISpecification<T> {
  /**
   * Converts specification to Sequelize where clause
   * @returns Sequelize where options
   * @abstract Must be implemented by derived classes
   */
  abstract toQuery(): WhereOptions<any>;

  /**
   * Combines this specification with another using AND logic
   * @param spec Specification to combine
   * @returns Combined AND specification
   */
  and(spec: ISpecification<T>): ISpecification<T> {
    return new AndSpecification(this, spec);
  }

  /**
   * Combines this specification with another using OR logic
   * @param spec Specification to combine
   * @returns Combined OR specification
   */
  or(spec: ISpecification<T>): ISpecification<T> {
    return new OrSpecification(this, spec);
  }

  /**
   * Negates this specification
   * @returns Negated specification
   */
  not(): ISpecification<T> {
    return new NotSpecification(this);
  }
}

/**
 * AND specification combinator
 */
class AndSpecification<T> extends Specification<T> {
  constructor(
    private left: ISpecification<T>,
    private right: ISpecification<T>
  ) {
    super();
  }

  toQuery(): WhereOptions<any> {
    return {
      [Op.and]: [this.left.toQuery(), this.right.toQuery()],
    };
  }
}

/**
 * OR specification combinator
 */
class OrSpecification<T> extends Specification<T> {
  constructor(
    private left: ISpecification<T>,
    private right: ISpecification<T>
  ) {
    super();
  }

  toQuery(): WhereOptions<any> {
    return {
      [Op.or]: [this.left.toQuery(), this.right.toQuery()],
    };
  }
}

/**
 * NOT specification combinator
 */
class NotSpecification<T> extends Specification<T> {
  constructor(private spec: ISpecification<T>) {
    super();
  }

  toQuery(): WhereOptions<any> {
    return {
      [Op.not]: this.spec.toQuery(),
    };
  }
}

/**
 * Unit of Work interface for managing transactions
 * @description Defines the contract for managing database transactions across repositories
 */
export interface IUnitOfWork {
  /**
   * Begins a new database transaction
   * @returns Promise resolving to the transaction instance
   * @throws {Error} If a transaction is already active
   */
  begin(): Promise<Transaction>;

  /**
   * Commits the active transaction
   * @returns Promise that resolves when commit is complete
   * @throws {Error} If no active transaction exists
   */
  commit(): Promise<void>;

  /**
   * Rolls back the active transaction
   * @returns Promise that resolves when rollback is complete
   * @throws {Error} If no active transaction exists
   */
  rollback(): Promise<void>;

  /**
   * Gets the current active transaction if any
   * @returns Active transaction or undefined
   */
  getTransaction(): Transaction | undefined;

  /**
   * Checks if a transaction is currently active
   * @returns True if transaction is active
   */
  isActive(): boolean;
}

/**
 * Unit of Work implementation for Sequelize
 * @description Manages database transactions across multiple repository operations.
 * This class ensures ACID properties for complex multi-repository operations.
 *
 * @remarks
 * - **Scope**: Singleton (DEFAULT) - one instance per application
 * - **Pattern**: Unit of Work pattern for transaction management
 * - **Thread Safety**: Request-scoped for concurrent operations
 * - **Use Case**: Multi-repository operations requiring atomicity
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class TransferService {
 *   constructor(
 *     private readonly unitOfWork: UnitOfWork,
 *     private readonly accountRepo: AccountRepository,
 *     private readonly auditRepo: AuditRepository
 *   ) {}
 *
 *   async transferFunds(fromId: string, toId: string, amount: number): Promise<void> {
 *     await this.unitOfWork.begin();
 *
 *     try {
 *       const transaction = this.unitOfWork.getTransaction();
 *       await this.accountRepo.debit(fromId, amount, transaction);
 *       await this.accountRepo.credit(toId, amount, transaction);
 *       await this.auditRepo.log('TRANSFER', { fromId, toId, amount }, transaction);
 *       await this.unitOfWork.commit();
 *     } catch (error) {
 *       await this.unitOfWork.rollback();
 *       throw error;
 *     }
 *   }
 * }
 * ```
 */
@Injectable()
export class UnitOfWork implements IUnitOfWork {
  private logger = new Logger(UnitOfWork.name);
  private transaction?: Transaction;

  /**
   * Creates a new Unit of Work instance
   * @param sequelize Sequelize instance for transaction management
   */
  constructor(private sequelize: Sequelize) {}

  /**
   * Begins a new database transaction
   * @returns Promise resolving to the transaction instance
   * @throws {Error} If a transaction is already active
   */
  async begin(): Promise<Transaction> {
    if (this.transaction) {
      throw new Error('Transaction already active');
    }

    this.transaction = await this.sequelize.transaction();
    this.logInfo('Transaction started');
    return this.transaction;
  }

  /**
   * Commits the active transaction
   * @returns Promise that resolves when commit is complete
   * @throws {Error} If no active transaction exists
   */
  async commit(): Promise<void> {
    if (!this.transaction) {
      throw new Error('No active transaction');
    }

    await this.transaction.commit();
    this.logInfo('Transaction committed');
    this.transaction = undefined;
  }

  /**
   * Rolls back the active transaction
   * @returns Promise that resolves when rollback is complete
   * @throws {Error} If no active transaction exists
   */
  async rollback(): Promise<void> {
    if (!this.transaction) {
      throw new Error('No active transaction');
    }

    await this.transaction.rollback();
    this.logInfo('Transaction rolled back');
    this.transaction = undefined;
  }

  /**
   * Gets the current active transaction if any
   * @returns Active transaction or undefined
   */
  getTransaction(): Transaction | undefined {
    return this.transaction;
  }

  /**
   * Checks if a transaction is currently active
   * @returns True if transaction is active
   */
  isActive(): boolean {
    return this.transaction !== undefined;
  }
}

/**
 * Repository interface defining standard operations
 * @template T Model type extending Sequelize Model
 * @description Contract for all repository implementations
 */
export interface IRepository<T extends Model> {
  /**
   * Find a record by primary key
   * @param id Primary key value
   * @param options Optional query options
   * @returns Promise resolving to record or null
   */
  findById(id: string, options?: FindOptions<Attributes<T>>): Promise<T | null>;

  /**
   * Find all records matching criteria
   * @param options Optional query options
   * @returns Promise resolving to array of records
   */
  findAll(options?: FindOptions<Attributes<T>>): Promise<T[]>;

  /**
   * Find one record matching criteria
   * @param options Query options
   * @returns Promise resolving to record or null
   */
  findOne(options: FindOptions<Attributes<T>>): Promise<T | null>;

  /**
   * Find and count all records
   * @param options Query options
   * @returns Promise resolving to rows and count
   */
  findAndCountAll(options: FindOptions<Attributes<T>>): Promise<{ rows: T[]; count: number }>;

  /**
   * Create a new record with audit metadata
   * @param data Record data
   * @param audit Audit metadata (userId, timestamp, etc.)
   * @param transaction Optional transaction
   * @returns Promise resolving to created record
   */
  create(data: any, audit: AuditMetadata, transaction?: Transaction): Promise<T>;

  /**
   * Update an existing record with audit metadata
   * @param id Record identifier
   * @param data Partial record data
   * @param audit Audit metadata
   * @param transaction Optional transaction
   * @returns Promise resolving to updated record
   */
  update(id: string, data: Partial<any>, audit: AuditMetadata, transaction?: Transaction): Promise<T>;

  /**
   * Soft delete a record
   * @param id Record identifier
   * @param audit Audit metadata
   * @param transaction Optional transaction
   * @returns Promise resolving to success status
   */
  delete(id: string, audit: AuditMetadata, transaction?: Transaction): Promise<boolean>;

  /**
   * Count records matching criteria
   * @param where Optional where conditions
   * @param transaction Optional transaction
   * @returns Promise resolving to count
   */
  count(where?: WhereOptions<any>, transaction?: Transaction): Promise<number>;

  /**
   * Check if records exist matching criteria
   * @param where Where conditions
   * @param transaction Optional transaction
   * @returns Promise resolving to existence status
   */
  exists(where: WhereOptions<any>, transaction?: Transaction): Promise<boolean>;
}

/**
 * Generic base repository implementation
 * @template T Model type extending Sequelize Model
 * @description Base class for all repositories providing standard CRUD operations.
 * This class implements the Repository pattern for data access abstraction.
 *
 * @remarks
 * - **Scope**: Singleton (DEFAULT) - one repository instance per model
 * - **Pattern**: Repository pattern for data access layer
 * - **Dependencies**: Requires Sequelize model injected via constructor
 * - **Circular Dependencies**: Avoid injecting services that depend on this repository
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class PatientRepository extends BaseRepository<Patient> {
 *   constructor(@InjectModel(Patient) patientModel: typeof Patient) {
 *     super(patientModel);
 *   }
 *
 *   // Custom query methods
 *   async findByStudentId(studentId: string): Promise<Patient[]> {
 *     return this.findAll({ where: { studentId } });
 *   }
 *
 *   async findActivePatients(): Promise<Patient[]> {
 *     return this.findAll({
 *       where: { deletedAt: null, status: 'active' }
 *     });
 *   }
 * }
 * ```
 */
export abstract class BaseRepository<T extends Model> implements IRepository<T> {
  protected logger: Logger;

  /**
   * Creates a new repository instance
   * @param model Sequelize model class
   */
  constructor(protected model: ModelCtor<T>) {
    this.logger = new Logger(`${model.name}Repository`);
  }

  /**
   * Find record by ID
   */
  async findById(id: string, options?: FindOptions<Attributes<T>>): Promise<T | null> {
    try {
      return await this.model.findByPk(id, options);
    } catch (error) {
      this.logError(`Failed to find ${this.model.name} by ID ${id}`, error);
      throw error;
    }
  }

  /**
   * Find record by ID or throw
   */
  async findByIdOrFail(id: string, options?: FindOptions<Attributes<T>>): Promise<T> {
    const record = await this.findById(id, options);

    if (!record) {
      throw new NotFoundException(`${this.model.name} with ID ${id} not found`);
    }

    return record;
  }

  /**
   * Find all records
   */
  async findAll(options?: FindOptions<Attributes<T>>): Promise<T[]> {
    try {
      return await this.model.findAll(options);
    } catch (error) {
      this.logError(`Failed to find all ${this.model.name} records`, error);
      throw error;
    }
  }

  /**
   * Find one record
   */
  async findOne(options: FindOptions<Attributes<T>>): Promise<T | null> {
    try {
      return await this.model.findOne(options);
    } catch (error) {
      this.logError(`Failed to find one ${this.model.name} record`, error);
      throw error;
    }
  }

  /**
   * Find one record or throw
   */
  async findOneOrFail(options: FindOptions<Attributes<T>>): Promise<T> {
    const record = await this.findOne(options);

    if (!record) {
      throw new NotFoundException(`${this.model.name} record not found`);
    }

    return record;
  }

  /**
   * Find and count all records
   */
  async findAndCountAll(
    options: FindOptions<Attributes<T>>
  ): Promise<{ rows: T[]; count: number }> {
    try {
      return await this.model.findAndCountAll(options);
    } catch (error) {
      this.logError(`Failed to find and count ${this.model.name} records`, error);
      throw error;
    }
  }

  /**
   * Create a new record
   */
  async create(data: any, audit: AuditMetadata, transaction?: Transaction): Promise<T> {
    try {
      return await createWithAudit(this.model, data, audit, { transaction });
    } catch (error) {
      this.logError(`Failed to create ${this.model.name} record`, error);
      throw error;
    }
  }

  /**
   * Update a record
   */
  async update(
    id: string,
    data: Partial<any>,
    audit: AuditMetadata,
    transaction?: Transaction
  ): Promise<T> {
    try {
      return await updateWithAudit(this.model, id, data, audit, { transaction });
    } catch (error) {
      this.logError(`Failed to update ${this.model.name} record ${id}`, error);
      throw error;
    }
  }

  /**
   * Soft delete a record
   */
  async delete(id: string, audit: AuditMetadata, transaction?: Transaction): Promise<boolean> {
    try {
      await softDelete(this.model, id, {
        deletedBy: audit.userId,
        transaction,
      });
      return true;
    } catch (error) {
      this.logError(`Failed to delete ${this.model.name} record ${id}`, error);
      throw error;
    }
  }

  /**
   * Count records
   */
  async count(where?: WhereOptions<any>, transaction?: Transaction): Promise<number> {
    try {
      return await this.model.count({ where, transaction } as any);
    } catch (error) {
      this.logError(`Failed to count ${this.model.name} records`, error);
      throw error;
    }
  }

  /**
   * Check if record exists
   */
  async exists(where: WhereOptions<any>, transaction?: Transaction): Promise<boolean> {
    try {
      const count = await this.count(where, transaction);
      return count > 0;
    } catch (error) {
      this.logError(`Failed to check existence for ${this.model.name}`, error);
      throw error;
    }
  }

  /**
   * Find by specification
   */
  async findBySpecification(
    spec: ISpecification<T>,
    options?: Omit<FindOptions<Attributes<T>>, 'where'>
  ): Promise<T[]> {
    try {
      return await this.model.findAll({
        ...options,
        where: spec.toQuery(),
      });
    } catch (error) {
      this.logError(`Failed to find ${this.model.name} by specification`, error);
      throw error;
    }
  }

  /**
   * Find paginated records
   */
  async findPaginated(
    options: Omit<FindOptions<Attributes<T>>, 'limit' | 'offset'>,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    try {
      return await buildPaginatedQuery(this.model, options, pagination);
    } catch (error) {
      this.logError(`Failed to find paginated ${this.model.name} records`, error);
      throw error;
    }
  }

  /**
   * Find with optimized query
   */
  async findOptimized(config: QueryBuilderConfig<T>): Promise<T[]> {
    try {
      const options = buildOptimizedQuery(config);
      return await this.model.findAll(options);
    } catch (error) {
      this.logError(`Failed to find optimized ${this.model.name} records`, error);
      throw error;
    }
  }

  /**
   * Batch find by IDs
   */
  async findByIds(
    ids: string[],
    options?: Omit<FindOptions<Attributes<T>>, 'where'>
  ): Promise<T[]> {
    try {
      return await this.model.findAll({
        ...options,
        where: { id: { [Op.in]: ids } } as any,
      });
    } catch (error) {
      this.logError(`Failed to batch find ${this.model.name} records`, error);
      throw error;
    }
  }

  /**
   * Batch find by IDs as map
   */
  async findByIdsAsMap(
    ids: string[],
    options?: Omit<FindOptions<Attributes<T>>, 'where'>
  ): Promise<Map<string, T>> {
    const records = await this.findByIds(ids, options);
    const map = new Map<string, T>();

    records.forEach(record => {
      map.set((record as any).id, record);
    });

    return map;
  }

  /**
   * Find first record
   */
  async findFirst(options?: FindOptions<Attributes<T>>): Promise<T | null> {
    try {
      return await this.model.findOne({
        ...options,
        limit: 1,
      });
    } catch (error) {
      this.logError(`Failed to find first ${this.model.name} record`, error);
      throw error;
    }
  }

  /**
   * Find last record
   */
  async findLast(
    orderField: string = 'createdAt',
    options?: Omit<FindOptions<Attributes<T>>, 'order' | 'limit'>
  ): Promise<T | null> {
    try {
      return await this.model.findOne({
        ...options,
        order: [[orderField, 'DESC']],
        limit: 1,
      });
    } catch (error) {
      this.logError(`Failed to find last ${this.model.name} record`, error);
      throw error;
    }
  }

  /**
   * Get model instance
   */
  getModel(): ModelCtor<T> {
    return this.model;
  }
}

/**
 * Read-only repository (queries only, no mutations)
 */
export abstract class ReadOnlyRepository<T extends Model> {
  protected logger: Logger;

  constructor(protected model: ModelCtor<T>) {
    this.logger = new Logger(`${model.name}ReadOnlyRepository`);
  }

  async findById(id: string, options?: FindOptions<Attributes<T>>): Promise<T | null> {
    return await this.model.findByPk(id, options);
  }

  async findAll(options?: FindOptions<Attributes<T>>): Promise<T[]> {
    return await this.model.findAll(options);
  }

  async findOne(options: FindOptions<Attributes<T>>): Promise<T | null> {
    return await this.model.findOne(options);
  }

  async count(where?: WhereOptions<any>): Promise<number> {
    return await this.model.count({ where } as any);
  }

  async exists(where: WhereOptions<any>): Promise<boolean> {
    const count = await this.count(where);
    return count > 0;
  }
}

/**
 * Cached repository with caching layer
 */
export abstract class CachedRepository<T extends Model> extends BaseRepository<T> {
  private cache: Map<string, { data: T; timestamp: number }> = new Map();
  private readonly cacheTTL: number;

  constructor(
    model: ModelCtor<T>,
    cacheTTL: number = 300000 // 5 minutes default
  ) {
    super(model);
    this.cacheTTL = cacheTTL;
  }

  async findById(id: string, options?: FindOptions<Attributes<T>>): Promise<T | null> {
    const cacheKey = `findById:${id}`;
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      this.logDebug(`Cache hit for ${this.model.name} ${id}`);
      return cached;
    }

    const record = await super.findById(id, options);

    if (record) {
      this.setCache(cacheKey, record);
    }

    return record;
  }

  async create(data: any, audit: AuditMetadata, transaction?: Transaction): Promise<T> {
    const record = await super.create(data, audit, transaction);
    this.invalidateCache();
    return record;
  }

  async update(
    id: string,
    data: Partial<any>,
    audit: AuditMetadata,
    transaction?: Transaction
  ): Promise<T> {
    const record = await super.update(id, data, audit, transaction);
    this.invalidateCache(`findById:${id}`);
    return record;
  }

  async delete(id: string, audit: AuditMetadata, transaction?: Transaction): Promise<boolean> {
    const result = await super.delete(id, audit, transaction);
    this.invalidateCache(`findById:${id}`);
    return result;
  }

  protected getFromCache(key: string): T | null {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    const age = Date.now() - cached.timestamp;

    if (age > this.cacheTTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  protected setCache(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  protected invalidateCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  clearCache(): void {
    this.cache.clear();
    this.logInfo(`Cache cleared for ${this.model.name}`);
  }
}

/**
 * Transactional repository with automatic transaction management
 */
export abstract class TransactionalRepository<T extends Model> extends BaseRepository<T> {
  constructor(
    model: ModelCtor<T>,
    protected unitOfWork: UnitOfWork
  ) {
    super(model);
  }

  async executeInTransaction<R>(
    operation: (transaction: Transaction) => Promise<R>
  ): Promise<R> {
    let transaction: Transaction;
    const shouldManageTransaction = !this.unitOfWork.isActive();

    try {
      if (shouldManageTransaction) {
        transaction = await this.unitOfWork.begin();
      } else {
        transaction = this.unitOfWork.getTransaction()!;
      }

      const result = await operation(transaction);

      if (shouldManageTransaction) {
        await this.unitOfWork.commit();
      }

      return result;
    } catch (error) {
      if (shouldManageTransaction) {
        await this.unitOfWork.rollback();
      }

      this.logError('Transaction failed', error);
      throw error;
    }
  }

  async createInTransaction(data: any, audit: AuditMetadata): Promise<T> {
    return await this.executeInTransaction(async transaction => {
      return await this.create(data, audit, transaction);
    });
  }

  async updateInTransaction(id: string, data: Partial<any>, audit: AuditMetadata): Promise<T> {
    return await this.executeInTransaction(async transaction => {
      return await this.update(id, data, audit, transaction);
    });
  }

  async deleteInTransaction(id: string, audit: AuditMetadata): Promise<boolean> {
    return await this.executeInTransaction(async transaction => {
      return await this.delete(id, audit, transaction);
    });
  }
}

/**
 * Soft delete repository with restore capabilities
 */
export abstract class SoftDeleteRepository<T extends Model> extends BaseRepository<T> {
  async findAllIncludingDeleted(options?: FindOptions<Attributes<T>>): Promise<T[]> {
    return await this.model.findAll({
      ...options,
      paranoid: false,
    });
  }

  async findByIdIncludingDeleted(
    id: string,
    options?: FindOptions<Attributes<T>>
  ): Promise<T | null> {
    return await this.model.findByPk(id, {
      ...options,
      paranoid: false,
    });
  }

  async restore(id: string, audit: AuditMetadata, transaction?: Transaction): Promise<T> {
    const record = await this.findByIdIncludingDeleted(id, { transaction });

    if (!record) {
      throw new NotFoundException(`${this.model.name} with ID ${id} not found`);
    }

    if (!(record as any).deletedAt) {
      throw new Error(`${this.model.name} ${id} is not deleted`);
    }

    await record.update(
      {
        deletedAt: null,
        restoredBy: audit.userId,
        restoredAt: audit.timestamp,
      },
      { transaction }
    );

    this.logInfo(`Restored ${this.model.name} ${id}`);

    return record;
  }

  async findDeleted(options?: Omit<FindOptions<Attributes<T>>, 'where'>): Promise<T[]> {
    return await this.model.findAll({
      ...options,
      where: {
        ...(options?.where || {}),
        deletedAt: { [Op.not]: null },
      } as any,
      paranoid: false,
    });
  }

  async countDeleted(where?: WhereOptions<any>): Promise<number> {
    return await this.model.count({
      where: {
        ...where,
        deletedAt: { [Op.not]: null },
      } as any,
      paranoid: false,
    });
  }
}

/**
 * Multi-tenant repository with tenant isolation
 */
export abstract class MultiTenantRepository<T extends Model> extends BaseRepository<T> {
  constructor(
    model: ModelCtor<T>,
    private tenantIdField: string = 'tenantId'
  ) {
    super(model);
  }

  private addTenantFilter(
    options: FindOptions<Attributes<T>>,
    tenantId: string
  ): FindOptions<Attributes<T>> {
    return {
      ...options,
      where: {
        ...(options.where || {}),
        [this.tenantIdField]: tenantId,
      } as any,
    };
  }

  async findAllForTenant(tenantId: string, options?: FindOptions<Attributes<T>>): Promise<T[]> {
    return await this.findAll(this.addTenantFilter(options || {}, tenantId));
  }

  async findOneForTenant(
    tenantId: string,
    options: FindOptions<Attributes<T>>
  ): Promise<T | null> {
    return await this.findOne(this.addTenantFilter(options, tenantId));
  }

  async countForTenant(tenantId: string, where?: WhereOptions<any>): Promise<number> {
    return await this.count({
      ...where,
      [this.tenantIdField]: tenantId,
    });
  }

  async createForTenant(
    tenantId: string,
    data: any,
    audit: AuditMetadata,
    transaction?: Transaction
  ): Promise<T> {
    return await this.create(
      {
        ...data,
        [this.tenantIdField]: tenantId,
      },
      audit,
      transaction
    );
  }
}

/**
 * Repository factory for creating repository instances
 */
@Injectable()
export class RepositoryFactory {
  private logger = new Logger(RepositoryFactory.name);
  private repositories: Map<string, BaseRepository<any>> = new Map();

  createRepository<T extends Model>(
    model: ModelCtor<T>,
    type: 'base' | 'cached' | 'readonly' = 'base'
  ): BaseRepository<T> | ReadOnlyRepository<T> {
    const key = `${model.name}:${type}`;

    if (this.repositories.has(key)) {
      return this.repositories.get(key)!;
    }

    let repository: any;

    switch (type) {
      case 'cached':
        repository = new (class extends CachedRepository<T> {
          constructor() {
            super(model);
          }
        })();
        break;

      case 'readonly':
        repository = new (class extends ReadOnlyRepository<T> {
          constructor() {
            super(model);
          }
        })();
        break;

      case 'base':
      default:
        repository = new (class extends BaseRepository<T> {
          constructor() {
            super(model);
          }
        })();
        break;
    }

    this.repositories.set(key, repository);
    this.logInfo(`Created ${type} repository for ${model.name}`);

    return repository;
  }

  getRepository<T extends Model>(model: ModelCtor<T>): BaseRepository<T> | undefined {
    return this.repositories.get(`${model.name}:base`);
  }

  clearRepositories(): void {
    this.repositories.clear();
    this.logInfo('All repositories cleared');
  }
}

/**
 * Export all repository classes and interfaces
 */
export const DataRepository = {
  BaseRepository,
  ReadOnlyRepository,
  CachedRepository,
  TransactionalRepository,
  SoftDeleteRepository,
  MultiTenantRepository,
  RepositoryFactory,
  UnitOfWork,
  Specification,
  AndSpecification,
  OrSpecification,
  NotSpecification,
};
