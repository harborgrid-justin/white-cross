/**
 * @fileoverview CRUD Operations Kit
 * @module core/database/crud-kit
 *
 * Production-ready CRUD (Create, Read, Update, Delete) operations with
 * validation, error handling, and advanced querying capabilities.
 *
 * @example Basic CRUD operations
 * ```typescript
 * const crud = new CrudKit(User);
 *
 * // Create
 * const user = await crud.create({ name: 'John', email: 'john@example.com' });
 *
 * // Read
 * const foundUser = await crud.findById(user.id);
 *
 * // Update
 * await crud.update(user.id, { name: 'Jane' });
 *
 * // Delete
 * await crud.delete(user.id);
 * ```
 */

import type { Model, Transaction } from './sequelize';

/**
 * CRUD operation options
 */
export interface CrudOptions {
  transaction?: Transaction;
  validate?: boolean;
  hooks?: boolean;
  returning?: boolean;
}

/**
 * Find options
 */
export interface FindOptions {
  where?: Record<string, any>;
  attributes?: string[];
  include?: any[];
  order?: Array<[string, 'ASC' | 'DESC']>;
  limit?: number;
  offset?: number;
  transaction?: Transaction;
}

/**
 * Pagination result
 */
export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Bulk operation result
 */
export interface BulkOperationResult {
  success: number;
  failed: number;
  errors: Array<{ index: number; error: string }>;
}

/**
 * CRUD Kit
 *
 * Provides comprehensive CRUD operations with validation and error handling.
 */
export default class CrudKit<T = any> {
  private model: Model;
  private hooks: {
    beforeCreate?: (data: Partial<T>) => Promise<Partial<T>>;
    afterCreate?: (record: T) => Promise<void>;
    beforeUpdate?: (id: any, data: Partial<T>) => Promise<Partial<T>>;
    afterUpdate?: (record: T) => Promise<void>;
    beforeDelete?: (id: any) => Promise<void>;
    afterDelete?: (id: any) => Promise<void>;
  } = {};

  constructor(model: Model) {
    this.model = model;
  }

  /**
   * Create a new record
   */
  async create(
    data: Partial<T>,
    options: CrudOptions = {}
  ): Promise<T> {
    try {
      let processedData = data;

      // Execute before hook
      if (this.hooks.beforeCreate) {
        processedData = await this.hooks.beforeCreate(data);
      }

      const record = await this.model.create(processedData, {
        transaction: options.transaction,
        validate: options.validate !== false,
      });

      // Execute after hook
      if (this.hooks.afterCreate) {
        await this.hooks.afterCreate(record);
      }

      return record;
    } catch (error) {
      console.error('CRUD create error:', error);
      throw this.handleError(error, 'create');
    }
  }

  /**
   * Find record by ID
   */
  async findById(
    id: any,
    options: FindOptions = {}
  ): Promise<T | null> {
    try {
      return await this.model.findByPk(id, {
        attributes: options.attributes,
        include: options.include,
        transaction: options.transaction,
      });
    } catch (error) {
      console.error('CRUD findById error:', error);
      throw this.handleError(error, 'findById');
    }
  }

  /**
   * Find one record
   */
  async findOne(options: FindOptions): Promise<T | null> {
    try {
      return await this.model.findOne({
        where: options.where,
        attributes: options.attributes,
        include: options.include,
        order: options.order,
        transaction: options.transaction,
      });
    } catch (error) {
      console.error('CRUD findOne error:', error);
      throw this.handleError(error, 'findOne');
    }
  }

  /**
   * Find all records
   */
  async findAll(options: FindOptions = {}): Promise<T[]> {
    try {
      return await this.model.findAll({
        where: options.where,
        attributes: options.attributes,
        include: options.include,
        order: options.order,
        limit: options.limit,
        offset: options.offset,
        transaction: options.transaction,
      });
    } catch (error) {
      console.error('CRUD findAll error:', error);
      throw this.handleError(error, 'findAll');
    }
  }

  /**
   * Update a record
   */
  async update(
    id: any,
    data: Partial<T>,
    options: CrudOptions = {}
  ): Promise<T | null> {
    try {
      let processedData = data;

      // Execute before hook
      if (this.hooks.beforeUpdate) {
        processedData = await this.hooks.beforeUpdate(id, data);
      }

      const [affectedCount] = await this.model.update(processedData, {
        where: { id },
        transaction: options.transaction,
      });

      if (affectedCount === 0) {
        return null;
      }

      const updated = await this.findById(id, { transaction: options.transaction });

      // Execute after hook
      if (updated && this.hooks.afterUpdate) {
        await this.hooks.afterUpdate(updated);
      }

      return updated;
    } catch (error) {
      console.error('CRUD update error:', error);
      throw this.handleError(error, 'update');
    }
  }

  /**
   * Delete a record
   */
  async delete(
    id: any,
    options: CrudOptions & { force?: boolean } = {}
  ): Promise<boolean> {
    try {
      // Execute before hook
      if (this.hooks.beforeDelete) {
        await this.hooks.beforeDelete(id);
      }

      const count = await this.model.destroy({
        where: { id },
        transaction: options.transaction,
        force: options.force,
      });

      const deleted = count > 0;

      // Execute after hook
      if (deleted && this.hooks.afterDelete) {
        await this.hooks.afterDelete(id);
      }

      return deleted;
    } catch (error) {
      console.error('CRUD delete error:', error);
      throw this.handleError(error, 'delete');
    }
  }

  /**
   * Count records
   */
  async count(where?: Record<string, any>): Promise<number> {
    try {
      return await this.model.count({ where });
    } catch (error) {
      console.error('CRUD count error:', error);
      throw this.handleError(error, 'count');
    }
  }

  /**
   * Check if record exists
   */
  async exists(id: any): Promise<boolean> {
    try {
      const record = await this.findById(id);
      return record !== null;
    } catch (error) {
      console.error('CRUD exists error:', error);
      return false;
    }
  }

  /**
   * Find or create record
   */
  async findOrCreate(
    where: Record<string, any>,
    defaults: Partial<T>,
    options: CrudOptions = {}
  ): Promise<{ record: T; created: boolean }> {
    try {
      const existing = await this.findOne({ where, transaction: options.transaction });

      if (existing) {
        return { record: existing, created: false };
      }

      const record = await this.create(
        { ...where, ...defaults },
        options
      );

      return { record, created: true };
    } catch (error) {
      console.error('CRUD findOrCreate error:', error);
      throw this.handleError(error, 'findOrCreate');
    }
  }

  /**
   * Update or create record
   */
  async upsert(
    data: Partial<T> & { id?: any },
    options: CrudOptions = {}
  ): Promise<T> {
    try {
      if (data.id) {
        const existing = await this.findById(data.id, { transaction: options.transaction });
        if (existing) {
          const updated = await this.update(data.id, data, options);
          return updated!;
        }
      }

      return await this.create(data, options);
    } catch (error) {
      console.error('CRUD upsert error:', error);
      throw this.handleError(error, 'upsert');
    }
  }

  /**
   * Bulk create records
   */
  async bulkCreate(
    records: Partial<T>[],
    options: CrudOptions = {}
  ): Promise<BulkOperationResult> {
    let success = 0;
    let failed = 0;
    const errors: Array<{ index: number; error: string }> = [];

    for (let i = 0; i < records.length; i++) {
      try {
        await this.create(records[i], options);
        success++;
      } catch (error) {
        failed++;
        errors.push({
          index: i,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return { success, failed, errors };
  }

  /**
   * Bulk update records
   */
  async bulkUpdate(
    updates: Array<{ id: any; data: Partial<T> }>,
    options: CrudOptions = {}
  ): Promise<BulkOperationResult> {
    let success = 0;
    let failed = 0;
    const errors: Array<{ index: number; error: string }> = [];

    for (let i = 0; i < updates.length; i++) {
      try {
        const result = await this.update(updates[i].id, updates[i].data, options);
        if (result) {
          success++;
        } else {
          failed++;
          errors.push({ index: i, error: 'Record not found' });
        }
      } catch (error) {
        failed++;
        errors.push({
          index: i,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return { success, failed, errors };
  }

  /**
   * Bulk delete records
   */
  async bulkDelete(
    ids: any[],
    options: CrudOptions & { force?: boolean } = {}
  ): Promise<BulkOperationResult> {
    let success = 0;
    let failed = 0;
    const errors: Array<{ index: number; error: string }> = [];

    for (let i = 0; i < ids.length; i++) {
      try {
        const deleted = await this.delete(ids[i], options);
        if (deleted) {
          success++;
        } else {
          failed++;
          errors.push({ index: i, error: 'Record not found' });
        }
      } catch (error) {
        failed++;
        errors.push({
          index: i,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return { success, failed, errors };
  }

  /**
   * Paginate results
   */
  async paginate(
    page: number = 1,
    pageSize: number = 10,
    options: FindOptions = {}
  ): Promise<PaginationResult<T>> {
    try {
      const limit = Math.max(1, Math.min(pageSize, 100));
      const offset = (Math.max(1, page) - 1) * limit;

      const [data, total] = await Promise.all([
        this.findAll({ ...options, limit, offset }),
        this.count(options.where),
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
    } catch (error) {
      console.error('CRUD paginate error:', error);
      throw this.handleError(error, 'paginate');
    }
  }

  /**
   * Search records
   */
  async search(
    searchTerm: string,
    searchFields: string[],
    options: FindOptions = {}
  ): Promise<T[]> {
    try {
      const where: any = {
        $or: searchFields.map(field => ({
          [field]: { $iLike: `%${searchTerm}%` },
        })),
      };

      return await this.findAll({
        ...options,
        where: { ...options.where, ...where },
      });
    } catch (error) {
      console.error('CRUD search error:', error);
      throw this.handleError(error, 'search');
    }
  }

  /**
   * Restore soft-deleted record
   */
  async restore(id: any, options: CrudOptions = {}): Promise<boolean> {
    try {
      // This would use Sequelize's restore method for paranoid models
      // For now, we'll just return false
      return false;
    } catch (error) {
      console.error('CRUD restore error:', error);
      throw this.handleError(error, 'restore');
    }
  }

  /**
   * Register lifecycle hooks
   */
  registerHooks(hooks: typeof this.hooks): void {
    this.hooks = { ...this.hooks, ...hooks };
  }

  /**
   * Handle and format errors
   */
  private handleError(error: any, operation: string): Error {
    const message = error instanceof Error ? error.message : String(error);
    return new Error(`CRUD ${operation} failed: ${message}`);
  }

  /**
   * Get the underlying model
   */
  getModel(): Model {
    return this.model;
  }
}

/**
 * CRUD operations factory
 */
export class CrudFactory {
  /**
   * Create CRUD kit for a model
   */
  static create<T = any>(model: Model): CrudKit<T> {
    return new CrudKit<T>(model);
  }

  /**
   * Create multiple CRUD kits
   */
  static createMany(models: Record<string, Model>): Record<string, CrudKit> {
    const kits: Record<string, CrudKit> = {};

    for (const [name, model] of Object.entries(models)) {
      kits[name] = new CrudKit(model);
    }

    return kits;
  }
}

/**
 * Advanced query builder for CRUD operations
 */
export class CrudQueryBuilder<T = any> {
  private crud: CrudKit<T>;
  private findOptions: FindOptions = {};

  constructor(crud: CrudKit<T>) {
    this.crud = crud;
  }

  /**
   * Add where clause
   */
  where(conditions: Record<string, any>): this {
    this.findOptions.where = {
      ...this.findOptions.where,
      ...conditions,
    };
    return this;
  }

  /**
   * Select attributes
   */
  select(...attributes: string[]): this {
    this.findOptions.attributes = attributes;
    return this;
  }

  /**
   * Include relations
   */
  include(relations: any[]): this {
    this.findOptions.include = relations;
    return this;
  }

  /**
   * Order by
   */
  orderBy(field: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    if (!this.findOptions.order) {
      this.findOptions.order = [];
    }
    this.findOptions.order.push([field, direction]);
    return this;
  }

  /**
   * Limit results
   */
  limit(limit: number): this {
    this.findOptions.limit = limit;
    return this;
  }

  /**
   * Offset results
   */
  offset(offset: number): this {
    this.findOptions.offset = offset;
    return this;
  }

  /**
   * Execute find all
   */
  async findAll(): Promise<T[]> {
    return await this.crud.findAll(this.findOptions);
  }

  /**
   * Execute find one
   */
  async findOne(): Promise<T | null> {
    return await this.crud.findOne(this.findOptions);
  }

  /**
   * Execute count
   */
  async count(): Promise<number> {
    return await this.crud.count(this.findOptions.where);
  }

  /**
   * Reset query builder
   */
  reset(): this {
    this.findOptions = {};
    return this;
  }
}

/**
 * Validation utilities for CRUD operations
 */
export class CrudValidator {
  /**
   * Validate required fields
   */
  static validateRequired<T>(
    data: Partial<T>,
    requiredFields: (keyof T)[]
  ): { valid: boolean; missing: string[] } {
    const missing: string[] = [];

    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null) {
        missing.push(String(field));
      }
    }

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  /**
   * Validate field types
   */
  static validateTypes<T>(
    data: Partial<T>,
    schema: Record<string, string>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [field, expectedType] of Object.entries(schema)) {
      const value = (data as any)[field];
      if (value !== undefined && typeof value !== expectedType) {
        errors.push(`Field ${field} must be of type ${expectedType}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sanitize data
   */
  static sanitize<T>(data: Partial<T>, allowedFields: (keyof T)[]): Partial<T> {
    const sanitized: Partial<T> = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        sanitized[field] = data[field];
      }
    }

    return sanitized;
  }
}

/**
 * Create CRUD kit instance
 */
export function createCrudKit<T = any>(model: Model): CrudKit<T> {
  return new CrudKit<T>(model);
}

/**
 * Create CRUD query builder
 */
export function createCrudQueryBuilder<T = any>(crud: CrudKit<T>): CrudQueryBuilder<T> {
  return new CrudQueryBuilder<T>(crud);
}

export { CrudKit };
