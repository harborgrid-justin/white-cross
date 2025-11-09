"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudKit = exports.CrudValidator = exports.CrudQueryBuilder = exports.CrudFactory = void 0;
exports.createCrudKit = createCrudKit;
exports.createCrudQueryBuilder = createCrudQueryBuilder;
/**
 * CRUD Kit
 *
 * Provides comprehensive CRUD operations with validation and error handling.
 */
class CrudKit {
    constructor(model) {
        this.hooks = {};
        this.model = model;
    }
    /**
     * Create a new record
     */
    async create(data, options = {}) {
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
        }
        catch (error) {
            console.error('CRUD create error:', error);
            throw this.handleError(error, 'create');
        }
    }
    /**
     * Find record by ID
     */
    async findById(id, options = {}) {
        try {
            return await this.model.findByPk(id, {
                attributes: options.attributes,
                include: options.include,
                transaction: options.transaction,
            });
        }
        catch (error) {
            console.error('CRUD findById error:', error);
            throw this.handleError(error, 'findById');
        }
    }
    /**
     * Find one record
     */
    async findOne(options) {
        try {
            return await this.model.findOne({
                where: options.where,
                attributes: options.attributes,
                include: options.include,
                order: options.order,
                transaction: options.transaction,
            });
        }
        catch (error) {
            console.error('CRUD findOne error:', error);
            throw this.handleError(error, 'findOne');
        }
    }
    /**
     * Find all records
     */
    async findAll(options = {}) {
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
        }
        catch (error) {
            console.error('CRUD findAll error:', error);
            throw this.handleError(error, 'findAll');
        }
    }
    /**
     * Update a record
     */
    async update(id, data, options = {}) {
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
        }
        catch (error) {
            console.error('CRUD update error:', error);
            throw this.handleError(error, 'update');
        }
    }
    /**
     * Delete a record
     */
    async delete(id, options = {}) {
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
        }
        catch (error) {
            console.error('CRUD delete error:', error);
            throw this.handleError(error, 'delete');
        }
    }
    /**
     * Count records
     */
    async count(where) {
        try {
            return await this.model.count({ where });
        }
        catch (error) {
            console.error('CRUD count error:', error);
            throw this.handleError(error, 'count');
        }
    }
    /**
     * Check if record exists
     */
    async exists(id) {
        try {
            const record = await this.findById(id);
            return record !== null;
        }
        catch (error) {
            console.error('CRUD exists error:', error);
            return false;
        }
    }
    /**
     * Find or create record
     */
    async findOrCreate(where, defaults, options = {}) {
        try {
            const existing = await this.findOne({ where, transaction: options.transaction });
            if (existing) {
                return { record: existing, created: false };
            }
            const record = await this.create({ ...where, ...defaults }, options);
            return { record, created: true };
        }
        catch (error) {
            console.error('CRUD findOrCreate error:', error);
            throw this.handleError(error, 'findOrCreate');
        }
    }
    /**
     * Update or create record
     */
    async upsert(data, options = {}) {
        try {
            if (data.id) {
                const existing = await this.findById(data.id, { transaction: options.transaction });
                if (existing) {
                    const updated = await this.update(data.id, data, options);
                    return updated;
                }
            }
            return await this.create(data, options);
        }
        catch (error) {
            console.error('CRUD upsert error:', error);
            throw this.handleError(error, 'upsert');
        }
    }
    /**
     * Bulk create records
     */
    async bulkCreate(records, options = {}) {
        let success = 0;
        let failed = 0;
        const errors = [];
        for (let i = 0; i < records.length; i++) {
            try {
                await this.create(records[i], options);
                success++;
            }
            catch (error) {
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
    async bulkUpdate(updates, options = {}) {
        let success = 0;
        let failed = 0;
        const errors = [];
        for (let i = 0; i < updates.length; i++) {
            try {
                const result = await this.update(updates[i].id, updates[i].data, options);
                if (result) {
                    success++;
                }
                else {
                    failed++;
                    errors.push({ index: i, error: 'Record not found' });
                }
            }
            catch (error) {
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
    async bulkDelete(ids, options = {}) {
        let success = 0;
        let failed = 0;
        const errors = [];
        for (let i = 0; i < ids.length; i++) {
            try {
                const deleted = await this.delete(ids[i], options);
                if (deleted) {
                    success++;
                }
                else {
                    failed++;
                    errors.push({ index: i, error: 'Record not found' });
                }
            }
            catch (error) {
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
    async paginate(page = 1, pageSize = 10, options = {}) {
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
        }
        catch (error) {
            console.error('CRUD paginate error:', error);
            throw this.handleError(error, 'paginate');
        }
    }
    /**
     * Search records
     */
    async search(searchTerm, searchFields, options = {}) {
        try {
            const where = {
                $or: searchFields.map(field => ({
                    [field]: { $iLike: `%${searchTerm}%` },
                })),
            };
            return await this.findAll({
                ...options,
                where: { ...options.where, ...where },
            });
        }
        catch (error) {
            console.error('CRUD search error:', error);
            throw this.handleError(error, 'search');
        }
    }
    /**
     * Restore soft-deleted record
     */
    async restore(id, options = {}) {
        try {
            // This would use Sequelize's restore method for paranoid models
            // For now, we'll just return false
            return false;
        }
        catch (error) {
            console.error('CRUD restore error:', error);
            throw this.handleError(error, 'restore');
        }
    }
    /**
     * Register lifecycle hooks
     */
    registerHooks(hooks) {
        this.hooks = { ...this.hooks, ...hooks };
    }
    /**
     * Handle and format errors
     */
    handleError(error, operation) {
        const message = error instanceof Error ? error.message : String(error);
        return new Error(`CRUD ${operation} failed: ${message}`);
    }
    /**
     * Get the underlying model
     */
    getModel() {
        return this.model;
    }
}
exports.default = CrudKit;
exports.CrudKit = CrudKit;
/**
 * CRUD operations factory
 */
class CrudFactory {
    /**
     * Create CRUD kit for a model
     */
    static create(model) {
        return new CrudKit(model);
    }
    /**
     * Create multiple CRUD kits
     */
    static createMany(models) {
        const kits = {};
        for (const [name, model] of Object.entries(models)) {
            kits[name] = new CrudKit(model);
        }
        return kits;
    }
}
exports.CrudFactory = CrudFactory;
/**
 * Advanced query builder for CRUD operations
 */
class CrudQueryBuilder {
    constructor(crud) {
        this.findOptions = {};
        this.crud = crud;
    }
    /**
     * Add where clause
     */
    where(conditions) {
        this.findOptions.where = {
            ...this.findOptions.where,
            ...conditions,
        };
        return this;
    }
    /**
     * Select attributes
     */
    select(...attributes) {
        this.findOptions.attributes = attributes;
        return this;
    }
    /**
     * Include relations
     */
    include(relations) {
        this.findOptions.include = relations;
        return this;
    }
    /**
     * Order by
     */
    orderBy(field, direction = 'ASC') {
        if (!this.findOptions.order) {
            this.findOptions.order = [];
        }
        this.findOptions.order.push([field, direction]);
        return this;
    }
    /**
     * Limit results
     */
    limit(limit) {
        this.findOptions.limit = limit;
        return this;
    }
    /**
     * Offset results
     */
    offset(offset) {
        this.findOptions.offset = offset;
        return this;
    }
    /**
     * Execute find all
     */
    async findAll() {
        return await this.crud.findAll(this.findOptions);
    }
    /**
     * Execute find one
     */
    async findOne() {
        return await this.crud.findOne(this.findOptions);
    }
    /**
     * Execute count
     */
    async count() {
        return await this.crud.count(this.findOptions.where);
    }
    /**
     * Reset query builder
     */
    reset() {
        this.findOptions = {};
        return this;
    }
}
exports.CrudQueryBuilder = CrudQueryBuilder;
/**
 * Validation utilities for CRUD operations
 */
class CrudValidator {
    /**
     * Validate required fields
     */
    static validateRequired(data, requiredFields) {
        const missing = [];
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
    static validateTypes(data, schema) {
        const errors = [];
        for (const [field, expectedType] of Object.entries(schema)) {
            const value = data[field];
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
    static sanitize(data, allowedFields) {
        const sanitized = {};
        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                sanitized[field] = data[field];
            }
        }
        return sanitized;
    }
}
exports.CrudValidator = CrudValidator;
/**
 * Create CRUD kit instance
 */
function createCrudKit(model) {
    return new CrudKit(model);
}
/**
 * Create CRUD query builder
 */
function createCrudQueryBuilder(crud) {
    return new CrudQueryBuilder(crud);
}
//# sourceMappingURL=crud-kit.js.map