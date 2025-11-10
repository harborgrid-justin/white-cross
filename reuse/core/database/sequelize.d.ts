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
/**
 * Sequelize interfaces (abstract to avoid dependency)
 */
export interface SequelizeInstance {
    define(modelName: string, attributes: any, options?: any): any;
    transaction<T>(fn: (transaction: Transaction) => Promise<T>): Promise<T>;
    authenticate(): Promise<void>;
    sync(options?: {
        force?: boolean;
        alter?: boolean;
    }): Promise<void>;
    close(): Promise<void>;
    query(sql: string, options?: any): Promise<any>;
    getQueryInterface(): QueryInterface;
}
export interface Transaction {
    commit(): Promise<void>;
    rollback(): Promise<void>;
    LOCK: any;
}
export interface Model {
    findAll(options?: any): Promise<any[]>;
    findOne(options?: any): Promise<any | null>;
    findByPk(id: any, options?: any): Promise<any | null>;
    create(values: any, options?: any): Promise<any>;
    update(values: any, options: any): Promise<[number, any[]]>;
    destroy(options: any): Promise<number>;
    count(options?: any): Promise<number>;
    bulkCreate(records: any[], options?: any): Promise<any[]>;
    hasMany(target: any, options?: any): void;
    belongsTo(target: any, options?: any): void;
    hasOne(target: any, options?: any): void;
    belongsToMany(target: any, options: any): void;
}
export interface QueryInterface {
    createTable(tableName: string, attributes: any, options?: any): Promise<void>;
    dropTable(tableName: string, options?: any): Promise<void>;
    addColumn(tableName: string, columnName: string, dataType: any, options?: any): Promise<void>;
    removeColumn(tableName: string, columnName: string, options?: any): Promise<void>;
    changeColumn(tableName: string, columnName: string, dataType: any, options?: any): Promise<void>;
    renameColumn(tableName: string, oldName: string, newName: string, options?: any): Promise<void>;
    addIndex(tableName: string, attributes: string[], options?: any): Promise<void>;
    removeIndex(tableName: string, indexName: string, options?: any): Promise<void>;
}
/**
 * Model definition options
 */
export interface ModelDefinition {
    tableName: string;
    fields: Record<string, any>;
    options?: {
        timestamps?: boolean;
        paranoid?: boolean;
        underscored?: boolean;
        indexes?: any[];
        hooks?: Record<string, Function>;
    };
}
/**
 * Association types
 */
export type AssociationType = 'hasMany' | 'belongsTo' | 'hasOne' | 'belongsToMany';
/**
 * Association definition
 */
export interface AssociationDefinition {
    type: AssociationType;
    source: string;
    target: string;
    options?: {
        as?: string;
        foreignKey?: string;
        through?: string | any;
        onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
        onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    };
}
/**
 * Create a Sequelize model
 */
export declare function createModel(sequelize: SequelizeInstance, definition: ModelDefinition): Model;
/**
 * Define associations between models
 */
export declare function defineAssociations(models: Record<string, Model>, associations: AssociationDefinition[]): void;
/**
 * Transaction utilities
 */
export declare class TransactionManager {
    private sequelize;
    constructor(sequelize: SequelizeInstance);
    /**
     * Execute function within a transaction
     */
    execute<T>(fn: (transaction: Transaction) => Promise<T>): Promise<T>;
    /**
     * Execute multiple operations in a transaction
     */
    executeMany<T>(operations: Array<(transaction: Transaction) => Promise<T>>): Promise<T[]>;
    /**
     * Execute with retry logic
     */
    executeWithRetry<T>(fn: (transaction: Transaction) => Promise<T>, maxRetries?: number): Promise<T>;
    /**
     * Delay utility
     */
    private delay;
}
/**
 * Query builder utilities
 */
export declare class QueryBuilder {
    /**
     * Build where clause with operators
     */
    static buildWhere(conditions: Record<string, any>): any;
    /**
     * Build include clause for eager loading
     */
    static buildInclude(models: Record<string, Model>, includes: Array<string | {
        model: string;
        as?: string;
        include?: any[];
    }>): any[];
    /**
     * Build pagination options
     */
    static buildPagination(page?: number, pageSize?: number): {
        limit: number;
        offset: number;
    };
    /**
     * Build order clause
     */
    static buildOrder(orderBy?: string | Array<[string, 'ASC' | 'DESC']>): any[] | undefined;
}
/**
 * Connection pool manager
 */
export declare class ConnectionPoolManager {
    private sequelize;
    private healthCheckInterval;
    constructor(sequelize: SequelizeInstance);
    /**
     * Test database connection
     */
    testConnection(): Promise<boolean>;
    /**
     * Start health check interval
     */
    startHealthCheck(intervalMs?: number): void;
    /**
     * Stop health check
     */
    stopHealthCheck(): void;
    /**
     * Close connection
     */
    close(): Promise<void>;
}
/**
 * Model synchronization utilities
 */
export declare class ModelSynchronizer {
    private sequelize;
    constructor(sequelize: SequelizeInstance);
    /**
     * Sync all models (development only)
     */
    syncAll(options?: {
        force?: boolean;
        alter?: boolean;
    }): Promise<void>;
    /**
     * Sync with safety checks
     */
    syncSafe(): Promise<void>;
}
/**
 * Bulk operations utilities
 */
export declare class BulkOperations {
    /**
     * Bulk create with batching
     */
    static bulkCreate(model: Model, records: any[], options?: {
        batchSize?: number;
        transaction?: Transaction;
        validate?: boolean;
    }): Promise<any[]>;
    /**
     * Bulk update with conditions
     */
    static bulkUpdate(model: Model, updates: any, where: any, options?: {
        transaction?: Transaction;
    }): Promise<number>;
    /**
     * Bulk delete with conditions
     */
    static bulkDelete(model: Model, where: any, options?: {
        transaction?: Transaction;
        force?: boolean;
    }): Promise<number>;
}
/**
 * Query optimizer
 */
export declare class QueryOptimizer {
    /**
     * Optimize find all query
     */
    static optimizeFindAll(options: any): any;
    /**
     * Add query hints for performance
     */
    static addQueryHints(options: any, hints: string[]): any;
}
/**
 * Helper to execute raw SQL safely
 */
export declare function executeRawQuery(sequelize: SequelizeInstance, sql: string, replacements?: Record<string, any>, options?: {
    transaction?: Transaction;
    type?: string;
}): Promise<any>;
/**
 * Helper to get table information
 */
export declare function getTableInfo(sequelize: SequelizeInstance, tableName: string): Promise<any>;
//# sourceMappingURL=sequelize.d.ts.map