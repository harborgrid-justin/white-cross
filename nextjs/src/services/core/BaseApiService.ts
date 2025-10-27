/**
 * WF-COMP-257 | BaseApiService.ts - Base API Service Module
 *
 * @module BaseApiService
 * @description
 * Provides a type-safe, reusable base class for implementing CRUD operations
 * across all API endpoints in the White Cross Healthcare Platform. This module
 * establishes consistent patterns for entity management, reducing code duplication
 * and improving maintainability.
 *
 * @purpose
 * - Standardize CRUD operations across all API services
 * - Provide type-safe generic patterns for entity management
 * - Support bulk operations for efficient data management
 * - Enable validation with Zod schemas
 * - Simplify service implementation with inheritance
 *
 * @upstream ./ApiClient - HTTP client for making API requests
 * @dependencies ./ApiClient, zod
 * @downstream All module-specific API services (medication, student, staff, etc.)
 * @exports BaseApiService class, BaseEntity interface, CRUD interfaces
 *
 * @keyFeatures
 * - Generic type-safe CRUD operations
 * - Bulk create, update, delete operations
 * - Query parameter building with filtering and pagination
 * - Optional Zod schema validation
 * - Search functionality
 * - Consistent error handling
 *
 * @lastUpdated 2025-10-23
 * @fileType TypeScript Service Module
 * @architecture Core service layer providing reusable patterns
 */

/**
 * Base API Service Class
 *
 * @description
 * Abstract base class providing type-safe CRUD operations for all API endpoints.
 * Extend this class to quickly implement API services with consistent patterns.
 *
 * @typeParam TEntity - The entity type returned from API (must extend BaseEntity)
 * @typeParam TCreateDto - The data transfer object for creating entities (defaults to Partial<TEntity>)
 * @typeParam TUpdateDto - The data transfer object for updating entities (defaults to Partial<TCreateDto>)
 *
 * @example
 * ```typescript
 * // Define your entity types
 * interface Student extends BaseEntity {
 *   name: string;
 *   grade: number;
 *   email: string;
 * }
 *
 * interface CreateStudentDto {
 *   name: string;
 *   grade: number;
 *   email: string;
 * }
 *
 * // Create your API service by extending BaseApiService
 * class StudentApi extends BaseApiService<Student, CreateStudentDto> {
 *   constructor(client: ApiClient) {
 *     super(client, '/api/students', {
 *       createSchema: createStudentSchema,
 *       updateSchema: updateStudentSchema
 *     });
 *   }
 *
 *   // Add custom methods specific to students
 *   async getByGrade(grade: number): Promise<Student[]> {
 *     return this.search('', { grade });
 *   }
 * }
 *
 * // Use the service
 * const studentApi = new StudentApi(apiClient);
 * const students = await studentApi.getAll();
 * const student = await studentApi.create({ name: 'Alice', grade: 5, email: 'alice@example.com' });
 * ```
 */

import { ApiClient, ApiResponse, PaginatedResponse } from './ApiClient';
import { z, ZodSchema } from 'zod';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface FilterParams extends PaginationParams {
  [key: string]: unknown;
}

export interface CrudOperations<T extends BaseEntity, TCreate, TUpdate = Partial<TCreate>> {
  getAll(filters?: FilterParams): Promise<PaginatedResponse<T>>;
  getById(id: string): Promise<T>;
  create(data: TCreate): Promise<T>;
  update(id: string, data: TUpdate): Promise<T>;
  delete(id: string): Promise<void>;
}

// ==========================================
// BASE API SERVICE CLASS
// ==========================================

export abstract class BaseApiService<
  TEntity extends BaseEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TCreateDto>
> implements CrudOperations<TEntity, TCreateDto, TUpdateDto> {
  protected client: ApiClient;
  protected baseEndpoint: string;
  protected createSchema?: ZodSchema<TCreateDto>;
  protected updateSchema?: ZodSchema<TUpdateDto>;

  constructor(
    client: ApiClient,
    baseEndpoint: string,
    options?: {
      createSchema?: ZodSchema<TCreateDto>;
      updateSchema?: ZodSchema<TUpdateDto>;
    }
  ) {
    this.client = client;
    this.baseEndpoint = baseEndpoint;
    this.createSchema = options?.createSchema;
    this.updateSchema = options?.updateSchema;
  }

  // ==========================================
  // CRUD OPERATIONS
  // ==========================================

  /**
   * Get all entities with optional filtering and pagination
   *
   * @param {FilterParams} [filters] - Optional filters including pagination, sorting, and custom filters
   * @returns {Promise<PaginatedResponse<TEntity>>} Paginated list of entities
   * @throws {Error} When the API request fails or returns an error
   *
   * @example
   * ```typescript
   * // Get all entities with pagination
   * const response = await studentApi.getAll({ page: 1, limit: 20 });
   *
   * // Get with filtering and sorting
   * const filtered = await studentApi.getAll({
   *   page: 1,
   *   limit: 10,
   *   sort: 'name',
   *   order: 'asc',
   *   grade: 5  // custom filter
   * });
   * ```
   */
  public async getAll(filters?: FilterParams): Promise<PaginatedResponse<TEntity>> {
    const params = this.buildQueryParams(filters);
    const url = `${this.baseEndpoint}${params}`;

    const response = await this.client.get<PaginatedResponse<TEntity>>(url);
    return this.extractData(response);
  }

  /**
   * Get entity by ID
   *
   * @param {string} id - The entity ID
   * @returns {Promise<TEntity>} The requested entity
   * @throws {Error} When ID is invalid or entity not found
   *
   * @example
   * ```typescript
   * const student = await studentApi.getById('abc-123');
   * console.log(student.name);
   * ```
   */
  public async getById(id: string): Promise<TEntity> {
    this.validateId(id);
    const response = await this.client.get<TEntity>(`${this.baseEndpoint}/${id}`);
    return this.extractData(response);
  }

  /**
   * Create new entity
   *
   * @param {TCreateDto} data - The entity data to create
   * @returns {Promise<TEntity>} The created entity with server-assigned fields
   * @throws {Error} When validation fails or creation is rejected by server
   *
   * @example
   * ```typescript
   * const newStudent = await studentApi.create({
   *   name: 'Alice Johnson',
   *   grade: 5,
   *   email: 'alice@example.com'
   * });
   * console.log(newStudent.id); // Server-assigned ID
   * ```
   */
  public async create(data: TCreateDto): Promise<TEntity> {
    this.validateCreateData(data);
    const response = await this.client.post<TEntity>(this.baseEndpoint, data);
    return this.extractData(response);
  }

  /**
   * Update existing entity (full update)
   *
   * @param {string} id - The entity ID
   * @param {TUpdateDto} data - The complete update data
   * @returns {Promise<TEntity>} The updated entity
   * @throws {Error} When ID is invalid, entity not found, or validation fails
   *
   * @example
   * ```typescript
   * const updated = await studentApi.update('abc-123', {
   *   name: 'Alice Johnson',
   *   grade: 6,
   *   email: 'alice@example.com'
   * });
   * ```
   */
  public async update(id: string, data: TUpdateDto): Promise<TEntity> {
    this.validateId(id);
    this.validateUpdateData(data);
    const response = await this.client.put<TEntity>(`${this.baseEndpoint}/${id}`, data);
    return this.extractData(response);
  }

  /**
   * Partially update entity (only specified fields)
   *
   * @param {string} id - The entity ID
   * @param {Partial<TUpdateDto>} data - The partial update data
   * @returns {Promise<TEntity>} The updated entity
   * @throws {Error} When ID is invalid, entity not found, or validation fails
   *
   * @example
   * ```typescript
   * // Only update the grade field
   * const updated = await studentApi.patch('abc-123', { grade: 6 });
   * ```
   */
  public async patch(id: string, data: Partial<TUpdateDto>): Promise<TEntity> {
    this.validateId(id);
    const response = await this.client.patch<TEntity>(`${this.baseEndpoint}/${id}`, data);
    return this.extractData(response);
  }

  /**
   * Delete entity permanently
   *
   * @param {string} id - The entity ID
   * @returns {Promise<void>} Resolves when entity is deleted
   * @throws {Error} When ID is invalid, entity not found, or deletion fails
   *
   * @example
   * ```typescript
   * await studentApi.delete('abc-123');
   * console.log('Student deleted successfully');
   * ```
   */
  public async delete(id: string): Promise<void> {
    this.validateId(id);
    await this.client.delete(`${this.baseEndpoint}/${id}`);
  }

  // ==========================================
  // SEARCH OPERATIONS
  // ==========================================

  /**
   * Search entities by query string
   *
   * @param {string} query - The search query string
   * @param {FilterParams} [filters] - Optional additional filters
   * @returns {Promise<PaginatedResponse<TEntity>>} Paginated search results
   * @throws {Error} When the search request fails
   *
   * @example
   * ```typescript
   * // Search for students by name
   * const results = await studentApi.search('Alice');
   *
   * // Search with filters
   * const filtered = await studentApi.search('John', {
   *   grade: 5,
   *   page: 1,
   *   limit: 10
   * });
   * ```
   */
  public async search(query: string, filters?: FilterParams): Promise<PaginatedResponse<TEntity>> {
    const params = this.buildQueryParams({ ...filters, search: query });
    const url = `${this.baseEndpoint}/search${params}`;

    const response = await this.client.get<PaginatedResponse<TEntity>>(url);
    return this.extractData(response);
  }

  // ==========================================
  // BULK OPERATIONS
  // ==========================================

  /**
   * Create multiple entities in a single request
   *
   * @param {TCreateDto[]} data - Array of entity data to create
   * @returns {Promise<TEntity[]>} Array of created entities with server-assigned fields
   * @throws {Error} When array is empty or validation fails
   *
   * @description
   * Efficiently creates multiple entities in one API call. This is significantly
   * faster than creating entities one at a time for bulk imports or migrations.
   *
   * The server processes all creates in a transaction, so either all succeed
   * or all fail (atomic operation).
   *
   * @example
   * ```typescript
   * const newStudents = await studentApi.bulkCreate([
   *   { name: 'Alice Johnson', grade: 5 },
   *   { name: 'Bob Smith', grade: 6 },
   *   { name: 'Charlie Brown', grade: 5 }
   * ]);
   *
   * console.log(`Created ${newStudents.length} students`);
   * ```
   */
  public async bulkCreate(data: TCreateDto[]): Promise<TEntity[]> {
    const response = await this.client.post<TEntity[]>(`${this.baseEndpoint}/bulk`, { items: data });
    return this.extractData(response);
  }

  /**
   * Update multiple entities in a single request
   *
   * @param {Array<{ id: string; data: TUpdateDto }>} updates - Array of entity updates with IDs and data
   * @returns {Promise<TEntity[]>} Array of updated entities
   * @throws {Error} When any ID is invalid or validation fails
   *
   * @description
   * Efficiently updates multiple entities in one API call. Each update requires
   * the entity ID and the data to update.
   *
   * Like bulkCreate, this operation is atomic - either all updates succeed or all fail.
   *
   * @example
   * ```typescript
   * const updatedStudents = await studentApi.bulkUpdate([
   *   { id: '123', data: { grade: 6 } },
   *   { id: '456', data: { grade: 7 } },
   *   { id: '789', data: { grade: 6 } }
   * ]);
   *
   * console.log(`Updated ${updatedStudents.length} students`);
   * ```
   */
  public async bulkUpdate(updates: Array<{ id: string; data: TUpdateDto }>): Promise<TEntity[]> {
    const response = await this.client.put<TEntity[]>(`${this.baseEndpoint}/bulk`, { updates });
    return this.extractData(response);
  }

  /**
   * Delete multiple entities in a single request
   *
   * @param {string[]} ids - Array of entity IDs to delete
   * @returns {Promise<void>} Resolves when all entities are deleted
   * @throws {Error} When any ID is invalid or deletion fails
   *
   * @description
   * Efficiently deletes multiple entities in one API call. This operation is
   * atomic - either all deletions succeed or all fail.
   *
   * Use with caution as this operation is permanent and cannot be undone.
   *
   * @example
   * ```typescript
   * await studentApi.bulkDelete(['123', '456', '789']);
   * console.log('Successfully deleted 3 students');
   * ```
   */
  public async bulkDelete(ids: string[]): Promise<void> {
    await this.client.post(`${this.baseEndpoint}/bulk-delete`, { ids });
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  /**
   * Extract data from API response
   */
  protected extractData<T>(response: ApiResponse<T>): T {
    if (response.success && response.data !== undefined) {
      return response.data;
    }
    throw new Error(response.message || 'API request failed');
  }

  /**
   * Build query parameters string
   */
  protected buildQueryParams(params?: FilterParams): string {
    if (!params || Object.keys(params).length === 0) {
      return '';
    }

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Validate entity ID
   */
  protected validateId(id: string): void {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid ID provided');
    }
  }

  /**
   * Validate create data with Zod schema
   */
  protected validateCreateData(data: TCreateDto): void {
    if (this.createSchema) {
      try {
        this.createSchema.parse(data);
      } catch (error: unknown) {
        if (error instanceof z.ZodError) {
          const issues = error.issues || [];
          const firstError = issues[0];
          if (firstError) {
            throw new Error(`Validation error: ${firstError.message} at ${firstError.path.join('.')}`);
          }
        }
        throw error;
      }
    }
  }

  /**
   * Validate update data with Zod schema
   */
  protected validateUpdateData(data: TUpdateDto): void {
    if (this.updateSchema) {
      try {
        this.updateSchema.parse(data);
      } catch (error: unknown) {
        if (error instanceof z.ZodError) {
          const issues = error.issues || [];
          const firstError = issues[0];
          if (firstError) {
            throw new Error(`Validation error: ${firstError.message} at ${firstError.path.join('.')}`);
          }
        }
        throw error;
      }
    }
  }

  /**
   * Build full endpoint URL
   */
  protected buildEndpoint(path: string): string {
    return `${this.baseEndpoint}${path}`;
  }

  /**
   * Execute custom GET request
   */
  protected async get<T>(endpoint: string, params?: FilterParams): Promise<T> {
    const queryString = this.buildQueryParams(params);
    const response = await this.client.get<T>(`${endpoint}${queryString}`);
    return this.extractData(response);
  }

  /**
   * Execute custom POST request
   */
  protected async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(endpoint, data);
    return this.extractData(response);
  }

  /**
   * Execute custom PUT request
   */
  protected async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(endpoint, data);
    return this.extractData(response);
  }

  /**
   * Execute custom PATCH request
   */
  protected async patchRequest<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.patch<T>(endpoint, data);
    return this.extractData(response);
  }

  /**
   * Execute custom DELETE request
   */
  protected async deleteRequest<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint);
    return this.extractData(response);
  }

  // ==========================================
  // EXPORT OPERATIONS
  // ==========================================

  /**
   * Export entities to specified format
   */
  public async export(format: 'csv' | 'json' | 'pdf' = 'json', filters?: FilterParams): Promise<Blob> {
    const params = this.buildQueryParams({ ...filters, format });
    const response = await this.client.getAxiosInstance().get(
      `${this.baseEndpoint}/export${params}`,
      { responseType: 'blob' }
    );
    return response.data;
  }

  /**
   * Import entities from file
   */
  public async import(file: File): Promise<{ imported: number; errors: unknown[] }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<{ imported: number; errors: unknown[] }>(
      `${this.baseEndpoint}/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      } as never
    );

    return this.extractData(response);
  }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Create a typed API service instance
 */
export function createApiService<
  TEntity extends BaseEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TCreateDto>
>(
  client: ApiClient,
  baseEndpoint: string,
  options?: {
    createSchema?: ZodSchema<TCreateDto>;
    updateSchema?: ZodSchema<TUpdateDto>;
  }
): BaseApiService<TEntity, TCreateDto, TUpdateDto> {
  return new (class extends BaseApiService<TEntity, TCreateDto, TUpdateDto> {})(
    client,
    baseEndpoint,
    options
  );
}
