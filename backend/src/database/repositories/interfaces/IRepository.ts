/**
 * Base Repository Interface
 * Defines standard CRUD operations for all repositories
 */

import { ExecutionContext } from '../../types/ExecutionContext';
import { QueryOptions, QueryCriteria, PaginatedResult } from '../../types/QueryTypes';

export interface IRepository<T, CreateDTO, UpdateDTO> {
  /**
   * Find entity by ID
   * @param id Entity identifier
   * @param options Query options (include relations, caching)
   * @returns Entity or null if not found
   */
  findById(id: string, options?: QueryOptions): Promise<T | null>;

  /**
   * Find multiple entities matching criteria
   * @param criteria Query criteria with filters and pagination
   * @param options Query options
   * @returns Paginated result set
   */
  findMany(criteria: QueryCriteria<T>, options?: QueryOptions): Promise<PaginatedResult<T>>;

  /**
   * Create new entity
   * @param data Entity data
   * @param context Execution context for audit logging
   * @returns Created entity
   */
  create(data: CreateDTO, context: ExecutionContext): Promise<T>;

  /**
   * Update existing entity
   * @param id Entity identifier
   * @param data Partial entity data to update
   * @param context Execution context for audit logging
   * @returns Updated entity
   */
  update(id: string, data: UpdateDTO, context: ExecutionContext): Promise<T>;

  /**
   * Delete entity
   * @param id Entity identifier
   * @param context Execution context for audit logging
   */
  delete(id: string, context: ExecutionContext): Promise<void>;

  /**
   * Check if entity exists matching criteria
   * @param criteria Partial entity data
   * @returns True if entity exists
   */
  exists(criteria: Partial<T>): Promise<boolean>;
}
