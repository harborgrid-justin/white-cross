/**
 * @fileoverview ORM Kit
 * @module core/database/orm-kit
 *
 * Production-ready ORM utilities providing a unified interface for working with
 * database models, including repository pattern, active record, and query builders.
 *
 * @example Use repository pattern
 * ```typescript
 * const userRepo = new Repository(User);
 * const users = await userRepo.findAll({ where: { active: true } });
 * const user = await userRepo.create({ name: 'John', email: 'john@example.com' });
 * ```
 */

import type { Model, Transaction } from './sequelize';

/**
 * Query options
 */
export interface QueryOptions {
  where?: Record<string, any>;
  attributes?: string[];
  include?: any[];
  order?: Array<[string, 'ASC' | 'DESC']>;
  limit?: number;
  offset?: number;
  transaction?: Transaction;
  raw?: boolean;
  paranoid?: boolean;
}

/**
 * Repository interface
 */
export interface IRepository<T> {
  findAll(options?: QueryOptions): Promise<T[]>;
  findOne(options: QueryOptions): Promise<T | null>;
  findById(id: any, options?: QueryOptions): Promise<T | null>;
  create(data: Partial<T>, options?: { transaction?: Transaction }): Promise<T>;
  update(id: any, data: Partial<T>, options?: { transaction?: Transaction }): Promise<T | null>;
  delete(id: any, options?: { transaction?: Transaction; force?: boolean }): Promise<boolean>;
  count(options?: QueryOptions): Promise<number>;
  exists(id: any): Promise<boolean>;
}

/**
 * Generic Repository Implementation
 *
 * Provides CRUD operations and common query patterns for any model.
 */
export class Repository<T = any> implements IRepository<T> {
  protected model: Model;

  constructor(model: Model) {
    this.model = model;
  }

  /**
   * Find all records
   */
  async findAll(options: QueryOptions = {}): Promise<T[]> {
    try {
      return await this.model.findAll(this.buildQueryOptions(options));
    } catch (error) {
      console.error('Repository findAll error:', error);
      throw error;
    }
  }

  /**
   * Find one record
   */
  async findOne(options: QueryOptions): Promise<T | null> {
    try {
      return await this.model.findOne(this.buildQueryOptions(options));
    } catch (error) {
      console.error('Repository findOne error:', error);
      throw error;
    }
  }

  /**
   * Find by ID
   */
  async findById(id: any, options: QueryOptions = {}): Promise<T | null> {
    try {
      return await this.model.findByPk(id, this.buildQueryOptions(options));
    } catch (error) {
      console.error('Repository findById error:', error);
      throw error;
    }
  }

  /**
   * Create a new record
   */
  async create(
    data: Partial<T>,
    options: { transaction?: Transaction } = {}
  ): Promise<T> {
    try {
      return await this.model.create(data, options);
    } catch (error) {
      console.error('Repository create error:', error);
      throw error;
    }
  }

  /**
   * Update a record
   */
  async update(
    id: any,
    data: Partial<T>,
    options: { transaction?: Transaction } = {}
  ): Promise<T | null> {
    try {
      const record = await this.findById(id, options);
      if (!record) {
        return null;
      }

      await this.model.update(data, {
        where: { id },
        ...options,
      });

      return await this.findById(id, options);
    } catch (error) {
      console.error('Repository update error:', error);
      throw error;
    }
  }

  /**
   * Delete a record
   */
  async delete(
    id: any,
    options: { transaction?: Transaction; force?: boolean } = {}
  ): Promise<boolean> {
    try {
      const count = await this.model.destroy({
        where: { id },
        ...options,
      });

      return count > 0;
    } catch (error) {
      console.error('Repository delete error:', error);
      throw error;
    }
  }

  /**
   * Count records
   */
  async count(options: QueryOptions = {}): Promise<number> {
    try {
      return await this.model.count(this.buildQueryOptions(options));
    } catch (error) {
      console.error('Repository count error:', error);
      throw error;
    }
  }

  /**
   * Check if record exists
   */
  async exists(id: any): Promise<boolean> {
    const record = await this.findById(id);
    return record !== null;
  }

  /**
   * Find or create record
   */
  async findOrCreate(
    where: Record<string, any>,
    defaults: Partial<T>,
    options: { transaction?: Transaction } = {}
  ): Promise<{ record: T; created: boolean }> {
    try {
      const existing = await this.findOne({ where, ...options });

      if (existing) {
        return { record: existing, created: false };
      }

      const record = await this.create({ ...where, ...defaults }, options);
      return { record, created: true };
    } catch (error) {
      console.error('Repository findOrCreate error:', error);
      throw error;
    }
  }

  /**
   * Bulk create records
   */
  async bulkCreate(
    records: Partial<T>[],
    options: { transaction?: Transaction; validate?: boolean } = {}
  ): Promise<T[]> {
    try {
      return await this.model.bulkCreate(records, {
        validate: true,
        ...options,
      });
    } catch (error) {
      console.error('Repository bulkCreate error:', error);
      throw error;
    }
  }

  /**
   * Bulk update records
   */
  async bulkUpdate(
    data: Partial<T>,
    where: Record<string, any>,
    options: { transaction?: Transaction } = {}
  ): Promise<number> {
    try {
      const [count] = await this.model.update(data, {
        where,
        ...options,
      });
      return count;
    } catch (error) {
      console.error('Repository bulkUpdate error:', error);
      throw error;
    }
  }

  /**
   * Bulk delete records
   */
  async bulkDelete(
    where: Record<string, any>,
    options: { transaction?: Transaction; force?: boolean } = {}
  ): Promise<number> {
    try {
      return await this.model.destroy({
        where,
        ...options,
      });
    } catch (error) {
      console.error('Repository bulkDelete error:', error);
      throw error;
    }
  }

  /**
   * Paginate results
   */
  async paginate(
    page: number = 1,
    pageSize: number = 10,
    options: QueryOptions = {}
  ): Promise<{
    data: T[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const limit = Math.max(1, Math.min(pageSize, 100));
    const offset = (Math.max(1, page) - 1) * limit;

    const [data, total] = await Promise.all([
      this.findAll({ ...options, limit, offset }),
      this.count({ where: options.where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        pageSize: limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Build query options
   */
  protected buildQueryOptions(options: QueryOptions): any {
    const queryOptions: any = {};

    if (options.where) {
      queryOptions.where = options.where;
    }

    if (options.attributes) {
      queryOptions.attributes = options.attributes;
    }

    if (options.include) {
      queryOptions.include = options.include;
    }

    if (options.order) {
      queryOptions.order = options.order;
    }

    if (options.limit !== undefined) {
      queryOptions.limit = options.limit;
    }

    if (options.offset !== undefined) {
      queryOptions.offset = options.offset;
    }

    if (options.transaction) {
      queryOptions.transaction = options.transaction;
    }

    if (options.raw !== undefined) {
      queryOptions.raw = options.raw;
    }

    if (options.paranoid !== undefined) {
      queryOptions.paranoid = options.paranoid;
    }

    return queryOptions;
  }

  /**
   * Get the underlying model
   */
  getModel(): Model {
    return this.model;
  }
}

/**
 * ORM Kit
 *
 * Provides unified interface for managing repositories and models.
 */
export default class OrmKit {
  private repositories: Map<string, Repository> = new Map();
  private models: Map<string, Model> = new Map();

  /**
   * Register a model
   */
  registerModel(name: string, model: Model): void {
    this.models.set(name, model);
  }

  /**
   * Register multiple models
   */
  registerModels(models: Record<string, Model>): void {
    for (const [name, model] of Object.entries(models)) {
      this.registerModel(name, model);
    }
  }

  /**
   * Get or create repository for a model
   */
  getRepository<T = any>(modelName: string): Repository<T> {
    const existing = this.repositories.get(modelName);
    if (existing) {
      return existing as Repository<T>;
    }

    const model = this.models.get(modelName);
    if (!model) {
      throw new Error(`Model ${modelName} not registered`);
    }

    const repository = new Repository<T>(model);
    this.repositories.set(modelName, repository);
    return repository;
  }

  /**
   * Get a model
   */
  getModel(name: string): Model | undefined {
    return this.models.get(name);
  }

  /**
   * Get all model names
   */
  getModelNames(): string[] {
    return Array.from(this.models.keys());
  }

  /**
   * Clear all repositories and models
   */
  clear(): void {
    this.repositories.clear();
    this.models.clear();
  }
}

/**
 * Query builder for complex queries
 */
export class QueryBuilderKit {
  private queryOptions: QueryOptions = {};

  /**
   * Add where clause
   */
  where(conditions: Record<string, any>): this {
    this.queryOptions.where = {
      ...this.queryOptions.where,
      ...conditions,
    };
    return this;
  }

  /**
   * Select specific attributes
   */
  select(...attributes: string[]): this {
    this.queryOptions.attributes = attributes;
    return this;
  }

  /**
   * Add include for eager loading
   */
  include(relations: any[]): this {
    this.queryOptions.include = relations;
    return this;
  }

  /**
   * Add ordering
   */
  orderBy(field: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    if (!this.queryOptions.order) {
      this.queryOptions.order = [];
    }
    this.queryOptions.order.push([field, direction]);
    return this;
  }

  /**
   * Add limit
   */
  limit(limit: number): this {
    this.queryOptions.limit = limit;
    return this;
  }

  /**
   * Add offset
   */
  offset(offset: number): this {
    this.queryOptions.offset = offset;
    return this;
  }

  /**
   * Add transaction
   */
  transaction(transaction: Transaction): this {
    this.queryOptions.transaction = transaction;
    return this;
  }

  /**
   * Get built query options
   */
  build(): QueryOptions {
    return { ...this.queryOptions };
  }

  /**
   * Reset query builder
   */
  reset(): this {
    this.queryOptions = {};
    return this;
  }
}

/**
 * Active Record base class
 *
 * Provides instance methods for CRUD operations.
 */
export abstract class ActiveRecord<T = any> {
  protected model: Model;
  protected data: Partial<T>;

  constructor(model: Model, data: Partial<T> = {}) {
    this.model = model;
    this.data = data;
  }

  /**
   * Save the record
   */
  async save(options: { transaction?: Transaction } = {}): Promise<this> {
    try {
      if (this.isNew()) {
        const created = await this.model.create(this.data, options);
        this.data = created;
      } else {
        await this.model.update(this.data, {
          where: { id: this.getId() },
          ...options,
        });
      }
      return this;
    } catch (error) {
      console.error('ActiveRecord save error:', error);
      throw error;
    }
  }

  /**
   * Delete the record
   */
  async delete(options: { transaction?: Transaction; force?: boolean } = {}): Promise<boolean> {
    try {
      const count = await this.model.destroy({
        where: { id: this.getId() },
        ...options,
      });
      return count > 0;
    } catch (error) {
      console.error('ActiveRecord delete error:', error);
      throw error;
    }
  }

  /**
   * Reload the record from database
   */
  async reload(options: { transaction?: Transaction } = {}): Promise<this> {
    try {
      const fresh = await this.model.findByPk(this.getId(), options);
      if (fresh) {
        this.data = fresh;
      }
      return this;
    } catch (error) {
      console.error('ActiveRecord reload error:', error);
      throw error;
    }
  }

  /**
   * Check if record is new (not persisted)
   */
  isNew(): boolean {
    return !this.getId();
  }

  /**
   * Get record ID
   */
  getId(): any {
    return (this.data as any).id;
  }

  /**
   * Get record data
   */
  getData(): Partial<T> {
    return { ...this.data };
  }

  /**
   * Set record data
   */
  setData(data: Partial<T>): void {
    this.data = { ...this.data, ...data };
  }

  /**
   * Get a specific attribute
   */
  get(key: keyof T): any {
    return this.data[key];
  }

  /**
   * Set a specific attribute
   */
  set(key: keyof T, value: any): void {
    this.data[key] = value;
  }

  /**
   * Convert to JSON
   */
  toJSON(): Partial<T> {
    return this.getData();
  }
}

/**
 * Model registry for managing all models
 */
export class ModelRegistry {
  private static instance: ModelRegistry;
  private models: Map<string, Model> = new Map();

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): ModelRegistry {
    if (!ModelRegistry.instance) {
      ModelRegistry.instance = new ModelRegistry();
    }
    return ModelRegistry.instance;
  }

  /**
   * Register a model
   */
  register(name: string, model: Model): void {
    this.models.set(name, model);
  }

  /**
   * Get a model
   */
  get(name: string): Model | undefined {
    return this.models.get(name);
  }

  /**
   * Get all models
   */
  getAll(): Map<string, Model> {
    return new Map(this.models);
  }

  /**
   * Check if model exists
   */
  has(name: string): boolean {
    return this.models.has(name);
  }

  /**
   * Remove a model
   */
  remove(name: string): boolean {
    return this.models.delete(name);
  }

  /**
   * Clear all models
   */
  clear(): void {
    this.models.clear();
  }
}

/**
 * Create repository instance
 */
export function createRepository<T = any>(model: Model): Repository<T> {
  return new Repository<T>(model);
}

/**
 * Create ORM kit instance
 */
export function createOrmKit(): OrmKit {
  return new OrmKit();
}

export { OrmKit };
