"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrmKit = exports.ModelRegistry = exports.ActiveRecord = exports.QueryBuilderKit = exports.Repository = void 0;
exports.createRepository = createRepository;
exports.createOrmKit = createOrmKit;
/**
 * Generic Repository Implementation
 *
 * Provides CRUD operations and common query patterns for any model.
 */
class Repository {
    constructor(model) {
        this.model = model;
    }
    /**
     * Find all records
     */
    async findAll(options = {}) {
        try {
            return await this.model.findAll(this.buildQueryOptions(options));
        }
        catch (error) {
            console.error('Repository findAll error:', error);
            throw error;
        }
    }
    /**
     * Find one record
     */
    async findOne(options) {
        try {
            return await this.model.findOne(this.buildQueryOptions(options));
        }
        catch (error) {
            console.error('Repository findOne error:', error);
            throw error;
        }
    }
    /**
     * Find by ID
     */
    async findById(id, options = {}) {
        try {
            return await this.model.findByPk(id, this.buildQueryOptions(options));
        }
        catch (error) {
            console.error('Repository findById error:', error);
            throw error;
        }
    }
    /**
     * Create a new record
     */
    async create(data, options = {}) {
        try {
            return await this.model.create(data, options);
        }
        catch (error) {
            console.error('Repository create error:', error);
            throw error;
        }
    }
    /**
     * Update a record
     */
    async update(id, data, options = {}) {
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
        }
        catch (error) {
            console.error('Repository update error:', error);
            throw error;
        }
    }
    /**
     * Delete a record
     */
    async delete(id, options = {}) {
        try {
            const count = await this.model.destroy({
                where: { id },
                ...options,
            });
            return count > 0;
        }
        catch (error) {
            console.error('Repository delete error:', error);
            throw error;
        }
    }
    /**
     * Count records
     */
    async count(options = {}) {
        try {
            return await this.model.count(this.buildQueryOptions(options));
        }
        catch (error) {
            console.error('Repository count error:', error);
            throw error;
        }
    }
    /**
     * Check if record exists
     */
    async exists(id) {
        const record = await this.findById(id);
        return record !== null;
    }
    /**
     * Find or create record
     */
    async findOrCreate(where, defaults, options = {}) {
        try {
            const existing = await this.findOne({ where, ...options });
            if (existing) {
                return { record: existing, created: false };
            }
            const record = await this.create({ ...where, ...defaults }, options);
            return { record, created: true };
        }
        catch (error) {
            console.error('Repository findOrCreate error:', error);
            throw error;
        }
    }
    /**
     * Bulk create records
     */
    async bulkCreate(records, options = {}) {
        try {
            return await this.model.bulkCreate(records, {
                validate: true,
                ...options,
            });
        }
        catch (error) {
            console.error('Repository bulkCreate error:', error);
            throw error;
        }
    }
    /**
     * Bulk update records
     */
    async bulkUpdate(data, where, options = {}) {
        try {
            const [count] = await this.model.update(data, {
                where,
                ...options,
            });
            return count;
        }
        catch (error) {
            console.error('Repository bulkUpdate error:', error);
            throw error;
        }
    }
    /**
     * Bulk delete records
     */
    async bulkDelete(where, options = {}) {
        try {
            return await this.model.destroy({
                where,
                ...options,
            });
        }
        catch (error) {
            console.error('Repository bulkDelete error:', error);
            throw error;
        }
    }
    /**
     * Paginate results
     */
    async paginate(page = 1, pageSize = 10, options = {}) {
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
    buildQueryOptions(options) {
        const queryOptions = {};
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
    getModel() {
        return this.model;
    }
}
exports.Repository = Repository;
/**
 * ORM Kit
 *
 * Provides unified interface for managing repositories and models.
 */
class OrmKit {
    constructor() {
        this.repositories = new Map();
        this.models = new Map();
    }
    /**
     * Register a model
     */
    registerModel(name, model) {
        this.models.set(name, model);
    }
    /**
     * Register multiple models
     */
    registerModels(models) {
        for (const [name, model] of Object.entries(models)) {
            this.registerModel(name, model);
        }
    }
    /**
     * Get or create repository for a model
     */
    getRepository(modelName) {
        const existing = this.repositories.get(modelName);
        if (existing) {
            return existing;
        }
        const model = this.models.get(modelName);
        if (!model) {
            throw new Error(`Model ${modelName} not registered`);
        }
        const repository = new Repository(model);
        this.repositories.set(modelName, repository);
        return repository;
    }
    /**
     * Get a model
     */
    getModel(name) {
        return this.models.get(name);
    }
    /**
     * Get all model names
     */
    getModelNames() {
        return Array.from(this.models.keys());
    }
    /**
     * Clear all repositories and models
     */
    clear() {
        this.repositories.clear();
        this.models.clear();
    }
}
exports.default = OrmKit;
exports.OrmKit = OrmKit;
/**
 * Query builder for complex queries
 */
class QueryBuilderKit {
    constructor() {
        this.queryOptions = {};
    }
    /**
     * Add where clause
     */
    where(conditions) {
        this.queryOptions.where = {
            ...this.queryOptions.where,
            ...conditions,
        };
        return this;
    }
    /**
     * Select specific attributes
     */
    select(...attributes) {
        this.queryOptions.attributes = attributes;
        return this;
    }
    /**
     * Add include for eager loading
     */
    include(relations) {
        this.queryOptions.include = relations;
        return this;
    }
    /**
     * Add ordering
     */
    orderBy(field, direction = 'ASC') {
        if (!this.queryOptions.order) {
            this.queryOptions.order = [];
        }
        this.queryOptions.order.push([field, direction]);
        return this;
    }
    /**
     * Add limit
     */
    limit(limit) {
        this.queryOptions.limit = limit;
        return this;
    }
    /**
     * Add offset
     */
    offset(offset) {
        this.queryOptions.offset = offset;
        return this;
    }
    /**
     * Add transaction
     */
    transaction(transaction) {
        this.queryOptions.transaction = transaction;
        return this;
    }
    /**
     * Get built query options
     */
    build() {
        return { ...this.queryOptions };
    }
    /**
     * Reset query builder
     */
    reset() {
        this.queryOptions = {};
        return this;
    }
}
exports.QueryBuilderKit = QueryBuilderKit;
/**
 * Active Record base class
 *
 * Provides instance methods for CRUD operations.
 */
class ActiveRecord {
    constructor(model, data = {}) {
        this.model = model;
        this.data = data;
    }
    /**
     * Save the record
     */
    async save(options = {}) {
        try {
            if (this.isNew()) {
                const created = await this.model.create(this.data, options);
                this.data = created;
            }
            else {
                await this.model.update(this.data, {
                    where: { id: this.getId() },
                    ...options,
                });
            }
            return this;
        }
        catch (error) {
            console.error('ActiveRecord save error:', error);
            throw error;
        }
    }
    /**
     * Delete the record
     */
    async delete(options = {}) {
        try {
            const count = await this.model.destroy({
                where: { id: this.getId() },
                ...options,
            });
            return count > 0;
        }
        catch (error) {
            console.error('ActiveRecord delete error:', error);
            throw error;
        }
    }
    /**
     * Reload the record from database
     */
    async reload(options = {}) {
        try {
            const fresh = await this.model.findByPk(this.getId(), options);
            if (fresh) {
                this.data = fresh;
            }
            return this;
        }
        catch (error) {
            console.error('ActiveRecord reload error:', error);
            throw error;
        }
    }
    /**
     * Check if record is new (not persisted)
     */
    isNew() {
        return !this.getId();
    }
    /**
     * Get record ID
     */
    getId() {
        return this.data.id;
    }
    /**
     * Get record data
     */
    getData() {
        return { ...this.data };
    }
    /**
     * Set record data
     */
    setData(data) {
        this.data = { ...this.data, ...data };
    }
    /**
     * Get a specific attribute
     */
    get(key) {
        return this.data[key];
    }
    /**
     * Set a specific attribute
     */
    set(key, value) {
        this.data[key] = value;
    }
    /**
     * Convert to JSON
     */
    toJSON() {
        return this.getData();
    }
}
exports.ActiveRecord = ActiveRecord;
/**
 * Model registry for managing all models
 */
class ModelRegistry {
    constructor() {
        this.models = new Map();
    }
    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!ModelRegistry.instance) {
            ModelRegistry.instance = new ModelRegistry();
        }
        return ModelRegistry.instance;
    }
    /**
     * Register a model
     */
    register(name, model) {
        this.models.set(name, model);
    }
    /**
     * Get a model
     */
    get(name) {
        return this.models.get(name);
    }
    /**
     * Get all models
     */
    getAll() {
        return new Map(this.models);
    }
    /**
     * Check if model exists
     */
    has(name) {
        return this.models.has(name);
    }
    /**
     * Remove a model
     */
    remove(name) {
        return this.models.delete(name);
    }
    /**
     * Clear all models
     */
    clear() {
        this.models.clear();
    }
}
exports.ModelRegistry = ModelRegistry;
/**
 * Create repository instance
 */
function createRepository(model) {
    return new Repository(model);
}
/**
 * Create ORM kit instance
 */
function createOrmKit() {
    return new OrmKit();
}
//# sourceMappingURL=orm-kit.js.map