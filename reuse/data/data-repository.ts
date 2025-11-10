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
 */

import { Logger, Injectable, NotFoundException } from '@nestjs/common';
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
} from './crud-operations';

/**
 * Specification interface for query specifications
 */
export interface ISpecification<T> {
  toQuery(): WhereOptions<any>;
  and(spec: ISpecification<T>): ISpecification<T>;
  or(spec: ISpecification<T>): ISpecification<T>;
  not(): ISpecification<T>;
}

/**
 * Base specification implementation
 */
export abstract class Specification<T> implements ISpecification<T> {
  abstract toQuery(): WhereOptions<any>;

  and(spec: ISpecification<T>): ISpecification<T> {
    return new AndSpecification(this, spec);
  }

  or(spec: ISpecification<T>): ISpecification<T> {
    return new OrSpecification(this, spec);
  }

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
 */
export interface IUnitOfWork {
  begin(): Promise<Transaction>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getTransaction(): Transaction | undefined;
  isActive(): boolean;
}

/**
 * Unit of Work implementation
 */
@Injectable()
export class UnitOfWork implements IUnitOfWork {
  private logger = new Logger(UnitOfWork.name);
  private transaction?: Transaction;

  constructor(private sequelize: Sequelize) {}

  async begin(): Promise<Transaction> {
    if (this.transaction) {
      throw new Error('Transaction already active');
    }

    this.transaction = await this.sequelize.transaction();
    this.logger.log('Transaction started');
    return this.transaction;
  }

  async commit(): Promise<void> {
    if (!this.transaction) {
      throw new Error('No active transaction');
    }

    await this.transaction.commit();
    this.logger.log('Transaction committed');
    this.transaction = undefined;
  }

  async rollback(): Promise<void> {
    if (!this.transaction) {
      throw new Error('No active transaction');
    }

    await this.transaction.rollback();
    this.logger.log('Transaction rolled back');
    this.transaction = undefined;
  }

  getTransaction(): Transaction | undefined {
    return this.transaction;
  }

  isActive(): boolean {
    return this.transaction !== undefined;
  }
}

/**
 * Repository interface defining standard operations
 */
export interface IRepository<T extends Model> {
  findById(id: string, options?: FindOptions<Attributes<T>>): Promise<T | null>;
  findAll(options?: FindOptions<Attributes<T>>): Promise<T[]>;
  findOne(options: FindOptions<Attributes<T>>): Promise<T | null>;
  findAndCountAll(options: FindOptions<Attributes<T>>): Promise<{ rows: T[]; count: number }>;
  create(data: any, audit: AuditMetadata, transaction?: Transaction): Promise<T>;
  update(id: string, data: Partial<any>, audit: AuditMetadata, transaction?: Transaction): Promise<T>;
  delete(id: string, audit: AuditMetadata, transaction?: Transaction): Promise<boolean>;
  count(where?: WhereOptions<any>, transaction?: Transaction): Promise<number>;
  exists(where: WhereOptions<any>, transaction?: Transaction): Promise<boolean>;
}

/**
 * Generic base repository implementation
 */
export abstract class BaseRepository<T extends Model> implements IRepository<T> {
  protected logger: Logger;

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
      this.logger.error(`Failed to find ${this.model.name} by ID ${id}`, error);
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
      this.logger.error(`Failed to find all ${this.model.name} records`, error);
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
      this.logger.error(`Failed to find one ${this.model.name} record`, error);
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
      this.logger.error(`Failed to find and count ${this.model.name} records`, error);
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
      this.logger.error(`Failed to create ${this.model.name} record`, error);
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
      this.logger.error(`Failed to update ${this.model.name} record ${id}`, error);
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
      this.logger.error(`Failed to delete ${this.model.name} record ${id}`, error);
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
      this.logger.error(`Failed to count ${this.model.name} records`, error);
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
      this.logger.error(`Failed to check existence for ${this.model.name}`, error);
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
      this.logger.error(`Failed to find ${this.model.name} by specification`, error);
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
      this.logger.error(`Failed to find paginated ${this.model.name} records`, error);
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
      this.logger.error(`Failed to find optimized ${this.model.name} records`, error);
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
      this.logger.error(`Failed to batch find ${this.model.name} records`, error);
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
      this.logger.error(`Failed to find first ${this.model.name} record`, error);
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
      this.logger.error(`Failed to find last ${this.model.name} record`, error);
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
      this.logger.debug(`Cache hit for ${this.model.name} ${id}`);
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
    this.logger.log(`Cache cleared for ${this.model.name}`);
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

      this.logger.error('Transaction failed', error);
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
 * Audit repository with comprehensive audit trail
 */
export abstract class AuditRepository<T extends Model> extends BaseRepository<T> {
  constructor(
    model: ModelCtor<T>,
    private auditModel?: ModelCtor<any>
  ) {
    super(model);
  }

  async create(data: any, audit: AuditMetadata, transaction?: Transaction): Promise<T> {
    const record = await super.create(data, audit, transaction);

    if (this.auditModel) {
      await this.createAuditLog('CREATE', record, audit, transaction);
    }

    return record;
  }

  async update(
    id: string,
    data: Partial<any>,
    audit: AuditMetadata,
    transaction?: Transaction
  ): Promise<T> {
    const before = await this.findById(id);
    const record = await super.update(id, data, audit, transaction);

    if (this.auditModel && before) {
      await this.createAuditLog('UPDATE', record, audit, transaction, before);
    }

    return record;
  }

  async delete(id: string, audit: AuditMetadata, transaction?: Transaction): Promise<boolean> {
    const before = await this.findById(id);
    const result = await super.delete(id, audit, transaction);

    if (this.auditModel && before) {
      await this.createAuditLog('DELETE', before, audit, transaction);
    }

    return result;
  }

  private async createAuditLog(
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    record: T,
    audit: AuditMetadata,
    transaction?: Transaction,
    before?: T
  ): Promise<void> {
    if (!this.auditModel) return;

    try {
      await this.auditModel.create(
        {
          entityType: this.model.name,
          entityId: (record as any).id,
          action,
          userId: audit.userId,
          timestamp: audit.timestamp,
          ipAddress: audit.ipAddress,
          userAgent: audit.userAgent,
          before: before ? before.toJSON() : null,
          after: record.toJSON(),
          metadata: audit.metadata,
        },
        { transaction }
      );
    } catch (error) {
      this.logger.error('Failed to create audit log', error);
      // Don't throw - audit logging failure shouldn't break the operation
    }
  }

  async getAuditHistory(
    entityId: string,
    options?: {
      limit?: number;
      offset?: number;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<any[]> {
    if (!this.auditModel) {
      return [];
    }

    const where: any = {
      entityType: this.model.name,
      entityId,
    };

    if (options?.startDate || options?.endDate) {
      where.timestamp = {};

      if (options.startDate) {
        where.timestamp[Op.gte] = options.startDate;
      }

      if (options.endDate) {
        where.timestamp[Op.lte] = options.endDate;
      }
    }

    return await this.auditModel.findAll({
      where,
      order: [['timestamp', 'DESC']],
      limit: options?.limit || 100,
      offset: options?.offset || 0,
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

    this.logger.log(`Restored ${this.model.name} ${id}`);

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
    this.logger.log(`Created ${type} repository for ${model.name}`);

    return repository;
  }

  getRepository<T extends Model>(model: ModelCtor<T>): BaseRepository<T> | undefined {
    return this.repositories.get(`${model.name}:base`);
  }

  clearRepositories(): void {
    this.repositories.clear();
    this.logger.log('All repositories cleared');
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
  AuditRepository,
  SoftDeleteRepository,
  MultiTenantRepository,
  RepositoryFactory,
  UnitOfWork,
  Specification,
  AndSpecification,
  OrSpecification,
  NotSpecification,
};
