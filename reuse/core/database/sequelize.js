"use strict";
/**
 * @fileoverview Sequelize ORM Utilities
 * @module core/database/sequelize
 *
 * Production-ready Sequelize utilities including model definitions, associations,
 * transactions, queries, and connection management.
 *
 * @example Create a model
 * ```typescript
 * import { createModel } from '@reuse/core/database';
 *
 * const User = createModel(sequelize, {
 *   tableName: 'users',
 *   fields: {
 *     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
 *     email: { type: DataTypes.STRING, unique: true, allowNull: false },
 *     name: { type: DataTypes.STRING }
 *   }
 * });
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryOptimizer = exports.BulkOperations = exports.ModelSynchronizer = exports.ConnectionPoolManager = exports.QueryBuilder = exports.TransactionManager = void 0;
exports.createModel = createModel;
exports.defineAssociations = defineAssociations;
exports.executeRawQuery = executeRawQuery;
exports.getTableInfo = getTableInfo;
/**
 * Create a Sequelize model
 */
function createModel(sequelize, definition) {
    const { tableName, fields, options = {} } = definition;
    const defaultOptions = {
        timestamps: true,
        paranoid: false,
        underscored: true,
        ...options,
    };
    return sequelize.define(tableName, fields, {
        tableName,
        ...defaultOptions,
    });
}
/**
 * Define associations between models
 */
function defineAssociations(models, associations) {
    for (const assoc of associations) {
        const sourceModel = models[assoc.source];
        const targetModel = models[assoc.target];
        if (!sourceModel || !targetModel) {
            console.error(`Cannot define association: Model ${assoc.source} or ${assoc.target} not found`);
            continue;
        }
        switch (assoc.type) {
            case 'hasMany':
                sourceModel.hasMany(targetModel, assoc.options);
                break;
            case 'belongsTo':
                sourceModel.belongsTo(targetModel, assoc.options);
                break;
            case 'hasOne':
                sourceModel.hasOne(targetModel, assoc.options);
                break;
            case 'belongsToMany':
                if (!assoc.options?.through) {
                    console.error('belongsToMany requires a "through" option');
                    continue;
                }
                sourceModel.belongsToMany(targetModel, assoc.options);
                break;
        }
    }
}
/**
 * Transaction utilities
 */
class TransactionManager {
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    /**
     * Execute function within a transaction
     */
    async execute(fn) {
        return await this.sequelize.transaction(async (transaction) => {
            try {
                return await fn(transaction);
            }
            catch (error) {
                console.error('Transaction error:', error);
                throw error;
            }
        });
    }
    /**
     * Execute multiple operations in a transaction
     */
    async executeMany(operations) {
        return await this.sequelize.transaction(async (transaction) => {
            const results = [];
            for (const operation of operations) {
                const result = await operation(transaction);
                results.push(result);
            }
            return results;
        });
    }
    /**
     * Execute with retry logic
     */
    async executeWithRetry(fn, maxRetries = 3) {
        let lastError = null;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                return await this.execute(fn);
            }
            catch (error) {
                lastError = error;
                console.error(`Transaction attempt ${attempt + 1} failed:`, error);
                if (attempt < maxRetries - 1) {
                    // Wait before retry (exponential backoff)
                    await this.delay(Math.pow(2, attempt) * 1000);
                }
            }
        }
        throw lastError || new Error('Transaction failed after retries');
    }
    /**
     * Delay utility
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.TransactionManager = TransactionManager;
/**
 * Query builder utilities
 */
class QueryBuilder {
    /**
     * Build where clause with operators
     */
    static buildWhere(conditions) {
        const where = {};
        for (const [key, value] of Object.entries(conditions)) {
            if (value === null || value === undefined) {
                where[key] = null;
            }
            else if (typeof value === 'object' && !Array.isArray(value)) {
                where[key] = value;
            }
            else if (Array.isArray(value)) {
                where[key] = { $in: value };
            }
            else {
                where[key] = value;
            }
        }
        return where;
    }
    /**
     * Build include clause for eager loading
     */
    static buildInclude(models, includes) {
        return includes.map(inc => {
            if (typeof inc === 'string') {
                return { model: models[inc] };
            }
            const includeObj = {
                model: models[inc.model],
            };
            if (inc.as) {
                includeObj.as = inc.as;
            }
            if (inc.include) {
                includeObj.include = this.buildInclude(models, inc.include);
            }
            return includeObj;
        });
    }
    /**
     * Build pagination options
     */
    static buildPagination(page = 1, pageSize = 10) {
        const limit = Math.max(1, Math.min(pageSize, 100)); // Cap at 100
        const offset = (Math.max(1, page) - 1) * limit;
        return { limit, offset };
    }
    /**
     * Build order clause
     */
    static buildOrder(orderBy) {
        if (!orderBy) {
            return undefined;
        }
        if (typeof orderBy === 'string') {
            return [[orderBy, 'ASC']];
        }
        return orderBy;
    }
}
exports.QueryBuilder = QueryBuilder;
/**
 * Connection pool manager
 */
class ConnectionPoolManager {
    constructor(sequelize) {
        this.healthCheckInterval = null;
        this.sequelize = sequelize;
    }
    /**
     * Test database connection
     */
    async testConnection() {
        try {
            await this.sequelize.authenticate();
            return true;
        }
        catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    }
    /**
     * Start health check interval
     */
    startHealthCheck(intervalMs = 30000) {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
        }
        this.healthCheckInterval = setInterval(async () => {
            const isHealthy = await this.testConnection();
            if (!isHealthy) {
                console.error('Database connection unhealthy');
            }
        }, intervalMs);
    }
    /**
     * Stop health check
     */
    stopHealthCheck() {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
    }
    /**
     * Close connection
     */
    async close() {
        this.stopHealthCheck();
        await this.sequelize.close();
    }
}
exports.ConnectionPoolManager = ConnectionPoolManager;
/**
 * Model synchronization utilities
 */
class ModelSynchronizer {
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    /**
     * Sync all models (development only)
     */
    async syncAll(options = {}) {
        try {
            await this.sequelize.sync(options);
            console.log('Models synchronized successfully');
        }
        catch (error) {
            console.error('Model sync failed:', error);
            throw error;
        }
    }
    /**
     * Sync with safety checks
     */
    async syncSafe() {
        const nodeEnv = process.env.NODE_ENV || 'development';
        if (nodeEnv === 'production') {
            console.warn('Skipping model sync in production. Use migrations instead.');
            return;
        }
        await this.syncAll({ alter: true });
    }
}
exports.ModelSynchronizer = ModelSynchronizer;
/**
 * Bulk operations utilities
 */
class BulkOperations {
    /**
     * Bulk create with batching
     */
    static async bulkCreate(model, records, options = {}) {
        const { batchSize = 100, transaction, validate = true } = options;
        const results = [];
        for (let i = 0; i < records.length; i += batchSize) {
            const batch = records.slice(i, i + batchSize);
            const batchResults = await model.bulkCreate(batch, {
                transaction,
                validate,
            });
            results.push(...batchResults);
        }
        return results;
    }
    /**
     * Bulk update with conditions
     */
    static async bulkUpdate(model, updates, where, options = {}) {
        const [affectedCount] = await model.update(updates, {
            where,
            transaction: options.transaction,
        });
        return affectedCount;
    }
    /**
     * Bulk delete with conditions
     */
    static async bulkDelete(model, where, options = {}) {
        return await model.destroy({
            where,
            transaction: options.transaction,
            force: options.force,
        });
    }
}
exports.BulkOperations = BulkOperations;
/**
 * Query optimizer
 */
class QueryOptimizer {
    /**
     * Optimize find all query
     */
    static optimizeFindAll(options) {
        const optimized = { ...options };
        // Add default limit if not specified
        if (!optimized.limit) {
            optimized.limit = 100;
        }
        // Ensure attributes are selected efficiently
        if (!optimized.attributes) {
            optimized.attributes = { exclude: [] };
        }
        return optimized;
    }
    /**
     * Add query hints for performance
     */
    static addQueryHints(options, hints) {
        return {
            ...options,
            benchmark: true,
            logging: (sql, timing) => {
                if (timing && timing > 1000) {
                    console.warn(`Slow query detected (${timing}ms):`, sql);
                }
            },
        };
    }
}
exports.QueryOptimizer = QueryOptimizer;
/**
 * Helper to execute raw SQL safely
 */
async function executeRawQuery(sequelize, sql, replacements = {}, options = {}) {
    try {
        return await sequelize.query(sql, {
            replacements,
            ...options,
        });
    }
    catch (error) {
        console.error('Raw query failed:', error);
        throw error;
    }
}
/**
 * Helper to get table information
 */
async function getTableInfo(sequelize, tableName) {
    const queryInterface = sequelize.getQueryInterface();
    // Note: This would need actual implementation based on dialect
    return {
        tableName,
        // columns, indexes, etc. would be retrieved here
    };
}
//# sourceMappingURL=sequelize.js.map