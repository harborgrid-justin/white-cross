/**
 * Base Repository Interface
 * @description Generic repository interface defining common CRUD operations
 * @template T The entity type this repository manages
 */
export interface IRepository<T> {
  /**
   * Find an entity by its unique identifier
   * @param id - The entity ID
   * @returns Promise resolving to the entity or null if not found
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find all entities matching the given filters
   * @param filters - Query filters (optional)
   * @returns Promise resolving to array of entities
   */
  findAll(filters?: any): Promise<T[]>;

  /**
   * Find a single entity matching the given filters
   * @param filters - Query filters
   * @returns Promise resolving to the entity or null if not found
   */
  findOne(filters: any): Promise<T | null>;

  /**
   * Create a new entity
   * @param data - Entity data
   * @returns Promise resolving to the created entity
   */
  create(data: Partial<T>): Promise<T>;

  /**
   * Update an existing entity
   * @param id - The entity ID
   * @param data - Updated entity data
   * @returns Promise resolving to the updated entity
   */
  update(id: string, data: Partial<T>): Promise<T>;

  /**
   * Delete an entity by ID
   * @param id - The entity ID
   * @returns Promise resolving when deletion is complete
   */
  delete(id: string): Promise<void>;

  /**
   * Count entities matching the given filters
   * @param filters - Query filters (optional)
   * @returns Promise resolving to count of matching entities
   */
  count(filters?: any): Promise<number>;

  /**
   * Find entities with pagination
   * @param page - Page number (1-indexed)
   * @param limit - Number of items per page
   * @param filters - Query filters (optional)
   * @returns Promise resolving to paginated results
   */
  findWithPagination(
    page: number,
    limit: number,
    filters?: any
  ): Promise<{ rows: T[]; count: number }>;
}

/**
 * Repository options for queries
 */
export interface RepositoryOptions {
  include?: any[];
  attributes?: string[];
  order?: any[];
  raw?: boolean;
  transaction?: any;
}

/**
 * Filter options for repository queries
 */
export interface RepositoryFilters {
  where?: any;
  include?: any[];
  attributes?: string[];
  order?: any[];
  limit?: number;
  offset?: number;
}
