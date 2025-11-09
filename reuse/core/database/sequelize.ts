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
  sync(options?: { force?: boolean; alter?: boolean }): Promise<void>;
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
export function createModel(
  sequelize: SequelizeInstance,
  definition: ModelDefinition
): Model {
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
export function defineAssociations(
  models: Record<string, Model>,
  associations: AssociationDefinition[]
): void {
  for (const assoc of associations) {
    const sourceModel = models[assoc.source];
    const targetModel = models[assoc.target];

    if (!sourceModel || !targetModel) {
      console.error(
        `Cannot define association: Model ${assoc.source} or ${assoc.target} not found`
      );
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
export class TransactionManager {
  private sequelize: SequelizeInstance;

  constructor(sequelize: SequelizeInstance) {
    this.sequelize = sequelize;
  }

  /**
   * Execute function within a transaction
   */
  async execute<T>(
    fn: (transaction: Transaction) => Promise<T>
  ): Promise<T> {
    return await this.sequelize.transaction(async (transaction) => {
      try {
        return await fn(transaction);
      } catch (error) {
        console.error('Transaction error:', error);
        throw error;
      }
    });
  }

  /**
   * Execute multiple operations in a transaction
   */
  async executeMany<T>(
    operations: Array<(transaction: Transaction) => Promise<T>>
  ): Promise<T[]> {
    return await this.sequelize.transaction(async (transaction) => {
      const results: T[] = [];

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
  async executeWithRetry<T>(
    fn: (transaction: Transaction) => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.execute(fn);
      } catch (error) {
        lastError = error as Error;
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
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Query builder utilities
 */
export class QueryBuilder {
  /**
   * Build where clause with operators
   */
  static buildWhere(conditions: Record<string, any>): any {
    const where: any = {};

    for (const [key, value] of Object.entries(conditions)) {
      if (value === null || value === undefined) {
        where[key] = null;
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        where[key] = value;
      } else if (Array.isArray(value)) {
        where[key] = { $in: value };
      } else {
        where[key] = value;
      }
    }

    return where;
  }

  /**
   * Build include clause for eager loading
   */
  static buildInclude(
    models: Record<string, Model>,
    includes: Array<string | { model: string; as?: string; include?: any[] }>
  ): any[] {
    return includes.map(inc => {
      if (typeof inc === 'string') {
        return { model: models[inc] };
      }

      const includeObj: any = {
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
  static buildPagination(
    page: number = 1,
    pageSize: number = 10
  ): { limit: number; offset: number } {
    const limit = Math.max(1, Math.min(pageSize, 100)); // Cap at 100
    const offset = (Math.max(1, page) - 1) * limit;

    return { limit, offset };
  }

  /**
   * Build order clause
   */
  static buildOrder(
    orderBy?: string | Array<[string, 'ASC' | 'DESC']>
  ): any[] | undefined {
    if (!orderBy) {
      return undefined;
    }

    if (typeof orderBy === 'string') {
      return [[orderBy, 'ASC']];
    }

    return orderBy;
  }
}

/**
 * Connection pool manager
 */
export class ConnectionPoolManager {
  private sequelize: SequelizeInstance;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor(sequelize: SequelizeInstance) {
    this.sequelize = sequelize;
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Start health check interval
   */
  startHealthCheck(intervalMs: number = 30000): void {
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
  stopHealthCheck(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  /**
   * Close connection
   */
  async close(): Promise<void> {
    this.stopHealthCheck();
    await this.sequelize.close();
  }
}

/**
 * Model synchronization utilities
 */
export class ModelSynchronizer {
  private sequelize: SequelizeInstance;

  constructor(sequelize: SequelizeInstance) {
    this.sequelize = sequelize;
  }

  /**
   * Sync all models (development only)
   */
  async syncAll(options: { force?: boolean; alter?: boolean } = {}): Promise<void> {
    try {
      await this.sequelize.sync(options);
      console.log('Models synchronized successfully');
    } catch (error) {
      console.error('Model sync failed:', error);
      throw error;
    }
  }

  /**
   * Sync with safety checks
   */
  async syncSafe(): Promise<void> {
    const nodeEnv = process.env.NODE_ENV || 'development';

    if (nodeEnv === 'production') {
      console.warn('Skipping model sync in production. Use migrations instead.');
      return;
    }

    await this.syncAll({ alter: true });
  }
}

/**
 * Bulk operations utilities
 */
export class BulkOperations {
  /**
   * Bulk create with batching
   */
  static async bulkCreate(
    model: Model,
    records: any[],
    options: {
      batchSize?: number;
      transaction?: Transaction;
      validate?: boolean;
    } = {}
  ): Promise<any[]> {
    const { batchSize = 100, transaction, validate = true } = options;
    const results: any[] = [];

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
  static async bulkUpdate(
    model: Model,
    updates: any,
    where: any,
    options: {
      transaction?: Transaction;
    } = {}
  ): Promise<number> {
    const [affectedCount] = await model.update(updates, {
      where,
      transaction: options.transaction,
    });

    return affectedCount;
  }

  /**
   * Bulk delete with conditions
   */
  static async bulkDelete(
    model: Model,
    where: any,
    options: {
      transaction?: Transaction;
      force?: boolean;
    } = {}
  ): Promise<number> {
    return await model.destroy({
      where,
      transaction: options.transaction,
      force: options.force,
    });
  }
}

/**
 * Query optimizer
 */
export class QueryOptimizer {
  /**
   * Optimize find all query
   */
  static optimizeFindAll(options: any): any {
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
  static addQueryHints(options: any, hints: string[]): any {
    return {
      ...options,
      benchmark: true,
      logging: (sql: string, timing?: number) => {
        if (timing && timing > 1000) {
          console.warn(`Slow query detected (${timing}ms):`, sql);
        }
      },
    };
  }
}

/**
 * Helper to execute raw SQL safely
 */
export async function executeRawQuery(
  sequelize: SequelizeInstance,
  sql: string,
  replacements: Record<string, any> = {},
  options: { transaction?: Transaction; type?: string } = {}
): Promise<any> {
  try {
    return await sequelize.query(sql, {
      replacements,
      ...options,
    });
  } catch (error) {
    console.error('Raw query failed:', error);
    throw error;
  }
}

/**
 * Helper to get table information
 */
export async function getTableInfo(
  sequelize: SequelizeInstance,
  tableName: string
): Promise<any> {
  const queryInterface = sequelize.getQueryInterface();
  // Note: This would need actual implementation based on dialect
  return {
    tableName,
    // columns, indexes, etc. would be retrieved here
  };
}
