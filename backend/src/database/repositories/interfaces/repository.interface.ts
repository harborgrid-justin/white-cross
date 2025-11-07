/**
 * Base Repository Interface
 * Defines contracts for data access operations with transaction support,
 * audit logging, and caching
 */

import {
  ExecutionContext,
  QueryOptions,
  QueryCriteria,
  PaginatedResult,
} from '../../types';

/**
 * Base repository interface for data access operations
 *
 * @template T - Entity type returned by repository operations
 * @template CreateDTO - Data transfer object for entity creation
 * @template UpdateDTO - Data transfer object for entity updates
 */
export interface IRepository<T, CreateDTO, UpdateDTO> {
  /**
   * Finds entity by primary key identifier
   */
  findById(id: string, options?: QueryOptions): Promise<T | null>;

  /**
   * Finds multiple entities matching query criteria with pagination
   */
  findMany(
    criteria: QueryCriteria<T>,
    options?: QueryOptions,
  ): Promise<PaginatedResult<T>>;

  /**
   * Creates new entity with validation and audit logging
   */
  create(data: CreateDTO, context: ExecutionContext): Promise<T>;

  /**
   * Updates existing entity with validation and change tracking
   */
  update(id: string, data: UpdateDTO, context: ExecutionContext): Promise<T>;

  /**
   * Deletes entity permanently with audit logging
   */
  delete(id: string, context: ExecutionContext): Promise<void>;

  /**
   * Checks if entity exists matching criteria without retrieving data
   */
  exists(criteria: Partial<T>): Promise<boolean>;
}

/**
 * Repository error for domain-specific errors
 */
export class RepositoryError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'RepositoryError';
    Error.captureStackTrace(this, this.constructor);
  }
}
