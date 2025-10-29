/**
 * Sequelize Type Helpers
 * Provides type-safe aliases and utilities for common Sequelize patterns
 *
 * These types replace TypeORM-specific patterns like DeepPartial, FindOptionsWhere, etc.
 * with Sequelize-compatible equivalents while maintaining strict type safety.
 */

import {
  Model,
  ModelStatic,
  Transaction,
  WhereOptions,
  FindOptions,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
  Attributes,
  CreationAttributes,
  Includeable,
  Op
} from 'sequelize';

/**
 * Partial update type for entity updates
 * Replaces TypeORM's DeepPartial<T>
 *
 * @template T - Sequelize Model type
 * @example
 * const updates: PartialUpdate<Student> = { grade: '10', isActive: true };
 */
export type PartialUpdate<T extends Model> = Partial<Attributes<T>>;

/**
 * Type-safe where clause for queries
 * Replaces TypeORM's FindOptionsWhere<T>
 *
 * @template T - Sequelize Model type
 * @example
 * const where: WhereClause<Student> = { grade: '10', isActive: true };
 */
export type WhereClause<T extends Model> = WhereOptions<Attributes<T>>;

/**
 * Include options for eager loading associations
 *
 * @template T - Sequelize Model type
 */
export type Include<T extends Model = Model> = Includeable | Includeable[];

/**
 * Transaction callback function type
 *
 * @template T - Return type of the transaction
 * @example
 * const callback: TransactionCallback<Student> = async (t) => {
 *   return await Student.create({ ... }, { transaction: t });
 * };
 */
export type TransactionCallback<T> = (transaction: Transaction) => Promise<T>;

/**
 * Query result types for common operations
 */
export type QueryResult<T> = T[];
export type SingleResult<T> = T | null;
export type CountResult = number;
export type BooleanResult = boolean;

/**
 * Bulk create options with type safety
 *
 * @template T - Sequelize Model type
 */
export interface BulkCreateOptions<T extends Model> {
  /**
   * Validate each row before insertion
   */
  validate?: boolean;

  /**
   * Specific fields to include in the insert
   */
  fields?: (keyof Attributes<T>)[];

  /**
   * Return the created instances
   */
  returning?: boolean;

  /**
   * Transaction to use for the operation
   */
  transaction?: Transaction;

  /**
   * Ignore duplicate key errors
   */
  ignoreDuplicates?: boolean;

  /**
   * Update on duplicate key
   */
  updateOnDuplicate?: (keyof Attributes<T>)[];
}

/**
 * Bulk update options with type safety
 *
 * @template T - Sequelize Model type
 */
export interface BulkUpdateOptions<T extends Model> {
  /**
   * Where clause to specify which records to update
   */
  where: WhereClause<T>;

  /**
   * Transaction to use for the operation
   */
  transaction?: Transaction;

  /**
   * Return the updated instances
   */
  returning?: boolean;

  /**
   * Silently skip records that would violate unique constraints
   */
  silent?: boolean;
}

/**
 * Repository method signature types
 * Provides consistent type signatures for common repository methods
 */

/**
 * Find by ID method signature
 */
export type FindByIdFn<T extends Model> = (
  id: string,
  options?: FindOptions<Attributes<T>>
) => Promise<T | null>;

/**
 * Find one method signature
 */
export type FindOneFn<T extends Model> = (
  options: FindOptions<Attributes<T>>
) => Promise<T | null>;

/**
 * Find all method signature
 */
export type FindAllFn<T extends Model> = (
  options?: FindOptions<Attributes<T>>
) => Promise<T[]>;

/**
 * Create method signature
 */
export type CreateFn<T extends Model> = (
  data: CreationAttributes<T>,
  options?: CreateOptions<Attributes<T>>
) => Promise<T>;

/**
 * Update method signature
 */
export type UpdateFn<T extends Model> = (
  data: Partial<Attributes<T>>,
  options: UpdateOptions<Attributes<T>>
) => Promise<[affectedCount: number, affectedRows: T[]]>;

/**
 * Delete method signature
 */
export type DeleteFn = (
  options: DestroyOptions
) => Promise<number>;

/**
 * Count method signature
 */
export type CountFn<T extends Model> = (
  options?: Omit<FindOptions<Attributes<T>>, 'limit' | 'offset'>
) => Promise<number>;

/**
 * Sequelize operator aliases for convenience
 * Re-exports common operators with descriptive names
 */
export const Operators = {
  eq: Op.eq,              // Equals
  ne: Op.ne,              // Not equals
  gt: Op.gt,              // Greater than
  gte: Op.gte,            // Greater than or equal
  lt: Op.lt,              // Less than
  lte: Op.lte,            // Less than or equal
  between: Op.between,    // Between (inclusive)
  notBetween: Op.notBetween,
  in: Op.in,              // In array
  notIn: Op.notIn,        // Not in array
  like: Op.like,          // SQL LIKE
  notLike: Op.notLike,
  iLike: Op.iLike,        // Case-insensitive LIKE (PostgreSQL)
  notILike: Op.notILike,
  startsWith: Op.startsWith,
  endsWith: Op.endsWith,
  substring: Op.substring,
  regexp: Op.regexp,      // Regular expression
  notRegexp: Op.notRegexp,
  iRegexp: Op.iRegexp,    // Case-insensitive regex (PostgreSQL)
  notIRegexp: Op.notIRegexp,
  and: Op.and,            // Logical AND
  or: Op.or,              // Logical OR
  not: Op.not,            // Logical NOT
  is: Op.is,              // IS (for NULL checks)
  isNot: Op.isNot,        // IS NOT
  col: Op.col,            // Column reference
  overlap: Op.overlap,    // Array overlap (PostgreSQL)
  contains: Op.contains,  // Array/JSON contains (PostgreSQL)
  contained: Op.contained // Array/JSON contained by (PostgreSQL)
} as const;

/**
 * Query builder helper class for type-safe query construction
 * Extends the base QueryBuilder with Sequelize-specific operators
 */
export class SequelizeQueryBuilder<T extends Model> {
  private whereConditions: WhereOptions<Attributes<T>> = {};
  private orderConditions: any[] = [];
  private limitValue?: number;
  private offsetValue?: number;
  private includeOptions?: Includeable[];
  private attributesSelect?: string[];

  /**
   * Add OR conditions to the where clause
   * @param conditions - Array of where conditions
   */
  whereOr(conditions: WhereClause<T>[]): this {
    this.whereConditions = { [Op.or]: conditions } as any;
    return this;
  }

  /**
   * Add AND conditions to the where clause
   * @param conditions - Array of where conditions
   */
  whereAnd(conditions: WhereClause<T>[]): this {
    this.whereConditions = { [Op.and]: conditions } as any;
    return this;
  }

  /**
   * Add NOT condition to the where clause
   * @param condition - Condition to negate
   */
  whereNot(condition: WhereClause<T>): this {
    this.whereConditions = { [Op.not]: condition } as any;
    return this;
  }

  /**
   * Add LIKE condition for text search
   * @param field - Field name
   * @param pattern - Search pattern (use % for wildcards)
   */
  whereLike(field: keyof Attributes<T>, pattern: string): this {
    this.whereConditions = {
      ...this.whereConditions,
      [field]: { [Op.like]: pattern }
    } as any;
    return this;
  }

  /**
   * Add case-insensitive LIKE condition (PostgreSQL)
   * @param field - Field name
   * @param pattern - Search pattern
   */
  whereILike(field: keyof Attributes<T>, pattern: string): this {
    this.whereConditions = {
      ...this.whereConditions,
      [field]: { [Op.iLike]: pattern }
    } as any;
    return this;
  }

  /**
   * Add IN condition for matching against array of values
   * @param field - Field name
   * @param values - Array of values to match
   */
  whereIn(field: keyof Attributes<T>, values: any[]): this {
    this.whereConditions = {
      ...this.whereConditions,
      [field]: { [Op.in]: values }
    } as any;
    return this;
  }

  /**
   * Add BETWEEN condition for range queries
   * @param field - Field name
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (inclusive)
   */
  whereBetween(field: keyof Attributes<T>, min: any, max: any): this {
    this.whereConditions = {
      ...this.whereConditions,
      [field]: { [Op.between]: [min, max] }
    } as any;
    return this;
  }

  /**
   * Add IS NULL condition
   * @param field - Field name
   */
  whereNull(field: keyof Attributes<T>): this {
    this.whereConditions = {
      ...this.whereConditions,
      [field]: { [Op.is]: null }
    } as any;
    return this;
  }

  /**
   * Add IS NOT NULL condition
   * @param field - Field name
   */
  whereNotNull(field: keyof Attributes<T>): this {
    this.whereConditions = {
      ...this.whereConditions,
      [field]: { [Op.isNot]: null }
    } as any;
    return this;
  }

  /**
   * Add ORDER BY clause
   * @param field - Field to sort by
   * @param direction - Sort direction ('ASC' or 'DESC')
   */
  orderBy(field: keyof Attributes<T>, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.orderConditions.push([field as string, direction]);
    return this;
  }

  /**
   * Set LIMIT clause
   * @param limit - Maximum number of results
   */
  limit(limit: number): this {
    this.limitValue = limit;
    return this;
  }

  /**
   * Set OFFSET clause
   * @param offset - Number of results to skip
   */
  offset(offset: number): this {
    this.offsetValue = offset;
    return this;
  }

  /**
   * Add associations to include in the query
   * @param include - Include options
   */
  include(include: Includeable | Includeable[]): this {
    this.includeOptions = Array.isArray(include) ? include : [include];
    return this;
  }

  /**
   * Select specific attributes
   * @param attributes - Array of attribute names
   */
  select(attributes: string[]): this {
    this.attributesSelect = attributes;
    return this;
  }

  /**
   * Build the final FindOptions object
   */
  build(): FindOptions<Attributes<T>> {
    const options: FindOptions<Attributes<T>> = {};

    if (Object.keys(this.whereConditions).length > 0) {
      options.where = this.whereConditions;
    }

    if (this.orderConditions.length > 0) {
      options.order = this.orderConditions;
    }

    if (this.limitValue !== undefined) {
      options.limit = this.limitValue;
    }

    if (this.offsetValue !== undefined) {
      options.offset = this.offsetValue;
    }

    if (this.includeOptions) {
      options.include = this.includeOptions;
    }

    if (this.attributesSelect) {
      options.attributes = this.attributesSelect;
    }

    return options;
  }
}

/**
 * Helper function to create a query builder instance
 *
 * @template T - Sequelize Model type
 * @returns New query builder instance
 *
 * @example
 * const query = createQueryBuilder<Student>()
 *   .whereLike('firstName', 'John%')
 *   .whereIn('grade', ['9', '10', '11'])
 *   .orderBy('lastName', 'ASC')
 *   .limit(20)
 *   .build();
 *
 * const students = await Student.findAll(query);
 */
export function createQueryBuilder<T extends Model>(): SequelizeQueryBuilder<T> {
  return new SequelizeQueryBuilder<T>();
}

/**
 * Type guard to check if a value is a Sequelize model instance
 *
 * @param value - Value to check
 * @returns True if value is a Model instance
 */
export function isModelInstance(value: any): value is Model {
  return value instanceof Model;
}

/**
 * Type guard to check if a value is a Sequelize model class
 *
 * @param value - Value to check
 * @returns True if value is a Model class
 */
export function isModelClass(value: any): value is ModelStatic<Model> {
  return (
    typeof value === 'function' &&
    value.prototype instanceof Model
  );
}

/**
 * Extract attributes type from a model class
 * Utility type for working with model attributes
 *
 * @template T - Model class type
 */
export type ExtractAttributes<T> = T extends ModelStatic<infer M>
  ? Attributes<M>
  : never;

/**
 * Extract creation attributes type from a model class
 *
 * @template T - Model class type
 */
export type ExtractCreationAttributes<T> = T extends ModelStatic<infer M>
  ? CreationAttributes<M>
  : never;
