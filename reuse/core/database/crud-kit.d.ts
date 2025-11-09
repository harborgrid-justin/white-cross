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
    errors: Array<{
        index: number;
        error: string;
    }>;
}
/**
 * CRUD Kit
 *
 * Provides comprehensive CRUD operations with validation and error handling.
 */
export default class CrudKit<T = any> {
    private model;
    private hooks;
    constructor(model: Model);
    /**
     * Create a new record
     */
    create(data: Partial<T>, options?: CrudOptions): Promise<T>;
    /**
     * Find record by ID
     */
    findById(id: any, options?: FindOptions): Promise<T | null>;
    /**
     * Find one record
     */
    findOne(options: FindOptions): Promise<T | null>;
    /**
     * Find all records
     */
    findAll(options?: FindOptions): Promise<T[]>;
    /**
     * Update a record
     */
    update(id: any, data: Partial<T>, options?: CrudOptions): Promise<T | null>;
    /**
     * Delete a record
     */
    delete(id: any, options?: CrudOptions & {
        force?: boolean;
    }): Promise<boolean>;
    /**
     * Count records
     */
    count(where?: Record<string, any>): Promise<number>;
    /**
     * Check if record exists
     */
    exists(id: any): Promise<boolean>;
    /**
     * Find or create record
     */
    findOrCreate(where: Record<string, any>, defaults: Partial<T>, options?: CrudOptions): Promise<{
        record: T;
        created: boolean;
    }>;
    /**
     * Update or create record
     */
    upsert(data: Partial<T> & {
        id?: any;
    }, options?: CrudOptions): Promise<T>;
    /**
     * Bulk create records
     */
    bulkCreate(records: Partial<T>[], options?: CrudOptions): Promise<BulkOperationResult>;
    /**
     * Bulk update records
     */
    bulkUpdate(updates: Array<{
        id: any;
        data: Partial<T>;
    }>, options?: CrudOptions): Promise<BulkOperationResult>;
    /**
     * Bulk delete records
     */
    bulkDelete(ids: any[], options?: CrudOptions & {
        force?: boolean;
    }): Promise<BulkOperationResult>;
    /**
     * Paginate results
     */
    paginate(page?: number, pageSize?: number, options?: FindOptions): Promise<PaginationResult<T>>;
    /**
     * Search records
     */
    search(searchTerm: string, searchFields: string[], options?: FindOptions): Promise<T[]>;
    /**
     * Restore soft-deleted record
     */
    restore(id: any, options?: CrudOptions): Promise<boolean>;
    /**
     * Register lifecycle hooks
     */
    registerHooks(hooks: typeof this.hooks): void;
    /**
     * Handle and format errors
     */
    private handleError;
    /**
     * Get the underlying model
     */
    getModel(): Model;
}
/**
 * CRUD operations factory
 */
export declare class CrudFactory {
    /**
     * Create CRUD kit for a model
     */
    static create<T = any>(model: Model): CrudKit<T>;
    /**
     * Create multiple CRUD kits
     */
    static createMany(models: Record<string, Model>): Record<string, CrudKit>;
}
/**
 * Advanced query builder for CRUD operations
 */
export declare class CrudQueryBuilder<T = any> {
    private crud;
    private findOptions;
    constructor(crud: CrudKit<T>);
    /**
     * Add where clause
     */
    where(conditions: Record<string, any>): this;
    /**
     * Select attributes
     */
    select(...attributes: string[]): this;
    /**
     * Include relations
     */
    include(relations: any[]): this;
    /**
     * Order by
     */
    orderBy(field: string, direction?: 'ASC' | 'DESC'): this;
    /**
     * Limit results
     */
    limit(limit: number): this;
    /**
     * Offset results
     */
    offset(offset: number): this;
    /**
     * Execute find all
     */
    findAll(): Promise<T[]>;
    /**
     * Execute find one
     */
    findOne(): Promise<T | null>;
    /**
     * Execute count
     */
    count(): Promise<number>;
    /**
     * Reset query builder
     */
    reset(): this;
}
/**
 * Validation utilities for CRUD operations
 */
export declare class CrudValidator {
    /**
     * Validate required fields
     */
    static validateRequired<T>(data: Partial<T>, requiredFields: (keyof T)[]): {
        valid: boolean;
        missing: string[];
    };
    /**
     * Validate field types
     */
    static validateTypes<T>(data: Partial<T>, schema: Record<string, string>): {
        valid: boolean;
        errors: string[];
    };
    /**
     * Sanitize data
     */
    static sanitize<T>(data: Partial<T>, allowedFields: (keyof T)[]): Partial<T>;
}
/**
 * Create CRUD kit instance
 */
export declare function createCrudKit<T = any>(model: Model): CrudKit<T>;
/**
 * Create CRUD query builder
 */
export declare function createCrudQueryBuilder<T = any>(crud: CrudKit<T>): CrudQueryBuilder<T>;
export { CrudKit };
//# sourceMappingURL=crud-kit.d.ts.map