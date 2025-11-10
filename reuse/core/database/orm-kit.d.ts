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
    create(data: Partial<T>, options?: {
        transaction?: Transaction;
    }): Promise<T>;
    update(id: any, data: Partial<T>, options?: {
        transaction?: Transaction;
    }): Promise<T | null>;
    delete(id: any, options?: {
        transaction?: Transaction;
        force?: boolean;
    }): Promise<boolean>;
    count(options?: QueryOptions): Promise<number>;
    exists(id: any): Promise<boolean>;
}
/**
 * Generic Repository Implementation
 *
 * Provides CRUD operations and common query patterns for any model.
 */
export declare class Repository<T = any> implements IRepository<T> {
    protected model: Model;
    constructor(model: Model);
    /**
     * Find all records
     */
    findAll(options?: QueryOptions): Promise<T[]>;
    /**
     * Find one record
     */
    findOne(options: QueryOptions): Promise<T | null>;
    /**
     * Find by ID
     */
    findById(id: any, options?: QueryOptions): Promise<T | null>;
    /**
     * Create a new record
     */
    create(data: Partial<T>, options?: {
        transaction?: Transaction;
    }): Promise<T>;
    /**
     * Update a record
     */
    update(id: any, data: Partial<T>, options?: {
        transaction?: Transaction;
    }): Promise<T | null>;
    /**
     * Delete a record
     */
    delete(id: any, options?: {
        transaction?: Transaction;
        force?: boolean;
    }): Promise<boolean>;
    /**
     * Count records
     */
    count(options?: QueryOptions): Promise<number>;
    /**
     * Check if record exists
     */
    exists(id: any): Promise<boolean>;
    /**
     * Find or create record
     */
    findOrCreate(where: Record<string, any>, defaults: Partial<T>, options?: {
        transaction?: Transaction;
    }): Promise<{
        record: T;
        created: boolean;
    }>;
    /**
     * Bulk create records
     */
    bulkCreate(records: Partial<T>[], options?: {
        transaction?: Transaction;
        validate?: boolean;
    }): Promise<T[]>;
    /**
     * Bulk update records
     */
    bulkUpdate(data: Partial<T>, where: Record<string, any>, options?: {
        transaction?: Transaction;
    }): Promise<number>;
    /**
     * Bulk delete records
     */
    bulkDelete(where: Record<string, any>, options?: {
        transaction?: Transaction;
        force?: boolean;
    }): Promise<number>;
    /**
     * Paginate results
     */
    paginate(page?: number, pageSize?: number, options?: QueryOptions): Promise<{
        data: T[];
        pagination: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    /**
     * Build query options
     */
    protected buildQueryOptions(options: QueryOptions): any;
    /**
     * Get the underlying model
     */
    getModel(): Model;
}
/**
 * ORM Kit
 *
 * Provides unified interface for managing repositories and models.
 */
export default class OrmKit {
    private repositories;
    private models;
    /**
     * Register a model
     */
    registerModel(name: string, model: Model): void;
    /**
     * Register multiple models
     */
    registerModels(models: Record<string, Model>): void;
    /**
     * Get or create repository for a model
     */
    getRepository<T = any>(modelName: string): Repository<T>;
    /**
     * Get a model
     */
    getModel(name: string): Model | undefined;
    /**
     * Get all model names
     */
    getModelNames(): string[];
    /**
     * Clear all repositories and models
     */
    clear(): void;
}
/**
 * Query builder for complex queries
 */
export declare class QueryBuilderKit {
    private queryOptions;
    /**
     * Add where clause
     */
    where(conditions: Record<string, any>): this;
    /**
     * Select specific attributes
     */
    select(...attributes: string[]): this;
    /**
     * Add include for eager loading
     */
    include(relations: any[]): this;
    /**
     * Add ordering
     */
    orderBy(field: string, direction?: 'ASC' | 'DESC'): this;
    /**
     * Add limit
     */
    limit(limit: number): this;
    /**
     * Add offset
     */
    offset(offset: number): this;
    /**
     * Add transaction
     */
    transaction(transaction: Transaction): this;
    /**
     * Get built query options
     */
    build(): QueryOptions;
    /**
     * Reset query builder
     */
    reset(): this;
}
/**
 * Active Record base class
 *
 * Provides instance methods for CRUD operations.
 */
export declare abstract class ActiveRecord<T = any> {
    protected model: Model;
    protected data: Partial<T>;
    constructor(model: Model, data?: Partial<T>);
    /**
     * Save the record
     */
    save(options?: {
        transaction?: Transaction;
    }): Promise<this>;
    /**
     * Delete the record
     */
    delete(options?: {
        transaction?: Transaction;
        force?: boolean;
    }): Promise<boolean>;
    /**
     * Reload the record from database
     */
    reload(options?: {
        transaction?: Transaction;
    }): Promise<this>;
    /**
     * Check if record is new (not persisted)
     */
    isNew(): boolean;
    /**
     * Get record ID
     */
    getId(): any;
    /**
     * Get record data
     */
    getData(): Partial<T>;
    /**
     * Set record data
     */
    setData(data: Partial<T>): void;
    /**
     * Get a specific attribute
     */
    get(key: keyof T): any;
    /**
     * Set a specific attribute
     */
    set(key: keyof T, value: any): void;
    /**
     * Convert to JSON
     */
    toJSON(): Partial<T>;
}
/**
 * Model registry for managing all models
 */
export declare class ModelRegistry {
    private static instance;
    private models;
    private constructor();
    /**
     * Get singleton instance
     */
    static getInstance(): ModelRegistry;
    /**
     * Register a model
     */
    register(name: string, model: Model): void;
    /**
     * Get a model
     */
    get(name: string): Model | undefined;
    /**
     * Get all models
     */
    getAll(): Map<string, Model>;
    /**
     * Check if model exists
     */
    has(name: string): boolean;
    /**
     * Remove a model
     */
    remove(name: string): boolean;
    /**
     * Clear all models
     */
    clear(): void;
}
/**
 * Create repository instance
 */
export declare function createRepository<T = any>(model: Model): Repository<T>;
/**
 * Create ORM kit instance
 */
export declare function createOrmKit(): OrmKit;
export { OrmKit };
//# sourceMappingURL=orm-kit.d.ts.map