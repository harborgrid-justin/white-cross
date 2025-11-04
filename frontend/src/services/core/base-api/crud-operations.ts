/**
 * WF-CRUD-263 | crud-operations.ts - BaseApiService CRUD Operations
 *
 * @module services/core/base-api/crud-operations
 * @description
 * Standard CRUD operation implementations for BaseApiService.
 * Provides type-safe create, read, update, delete, and search operations.
 *
 * @purpose
 * - Implement standard CRUD operations (getAll, getById, create, update, delete)
 * - Provide partial update (patch) functionality
 * - Enable search operations with filtering
 * - Integrate validation and response extraction
 *
 * @upstream ./types, ./validation, ./utils, ../ApiClient
 * @dependencies BaseEntity, FilterParams, ApiClient, validation, utils
 * @downstream BaseApiService
 * @exports CrudOperationsMixin class
 *
 * @keyFeatures
 * - Type-safe generic CRUD operations
 * - Automatic validation integration
 * - Pagination and filtering support
 * - Search functionality
 * - Full and partial update operations
 *
 * @lastUpdated 2025-11-04
 * @fileType TypeScript Operations Module
 * @architecture Core operations layer for service architecture
 */

import type { ApiClient } from '../ApiClient';
import type { PaginatedResponse } from '../ApiClient.types';
import type { ZodSchema } from 'zod';
import type { BaseEntity, FilterParams } from './types';
import { validateId, validateCreateData, validateUpdateData } from './validation';
import { extractData, buildQueryParams } from './utils';

// ==========================================
// CRUD OPERATIONS MIXIN
// ==========================================

/**
 * CRUD operations mixin providing standard entity operations
 *
 * @description
 * Implements all standard CRUD operations with type safety and validation.
 * Designed to be composed into BaseApiService for reusability and separation of concerns.
 *
 * @typeParam TEntity - The entity type (must extend BaseEntity)
 * @typeParam TCreateDto - The data transfer object for creating entities
 * @typeParam TUpdateDto - The data transfer object for updating entities
 */
export class CrudOperationsMixin<
  TEntity extends BaseEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TCreateDto>
> {
  constructor(
    protected client: ApiClient,
    protected baseEndpoint: string,
    protected createSchema?: ZodSchema<TCreateDto>,
    protected updateSchema?: ZodSchema<TUpdateDto>
  ) {}

  // ==========================================
  // READ OPERATIONS
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
   * const response = await operations.getAll({ page: 1, limit: 20 });
   *
   * // Get with filtering and sorting
   * const filtered = await operations.getAll({
   *   page: 1,
   *   limit: 10,
   *   sort: 'name',
   *   order: 'asc',
   *   grade: 5  // custom filter
   * });
   * ```
   */
  public async getAll(filters?: FilterParams): Promise<PaginatedResponse<TEntity>> {
    const params = buildQueryParams(filters);
    const url = `${this.baseEndpoint}${params}`;

    const response = await this.client.get<PaginatedResponse<TEntity>>(url);
    return extractData(response);
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
   * const student = await operations.getById('abc-123');
   * console.log(student.name);
   * ```
   */
  public async getById(id: string): Promise<TEntity> {
    validateId(id);
    const response = await this.client.get<TEntity>(`${this.baseEndpoint}/${id}`);
    return extractData(response);
  }

  // ==========================================
  // CREATE OPERATIONS
  // ==========================================

  /**
   * Create new entity
   *
   * @param {TCreateDto} data - The entity data to create
   * @returns {Promise<TEntity>} The created entity with server-assigned fields
   * @throws {Error} When validation fails or creation is rejected by server
   *
   * @example
   * ```typescript
   * const newStudent = await operations.create({
   *   name: 'Alice Johnson',
   *   grade: 5,
   *   email: 'alice@example.com'
   * });
   * console.log(newStudent.id); // Server-assigned ID
   * ```
   */
  public async create(data: TCreateDto): Promise<TEntity> {
    validateCreateData(data, this.createSchema);
    const response = await this.client.post<TEntity>(this.baseEndpoint, data);
    return extractData(response);
  }

  // ==========================================
  // UPDATE OPERATIONS
  // ==========================================

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
   * const updated = await operations.update('abc-123', {
   *   name: 'Alice Johnson',
   *   grade: 6,
   *   email: 'alice@example.com'
   * });
   * ```
   */
  public async update(id: string, data: TUpdateDto): Promise<TEntity> {
    validateId(id);
    validateUpdateData(data, this.updateSchema);
    const response = await this.client.put<TEntity>(`${this.baseEndpoint}/${id}`, data);
    return extractData(response);
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
   * const updated = await operations.patch('abc-123', { grade: 6 });
   * ```
   */
  public async patch(id: string, data: Partial<TUpdateDto>): Promise<TEntity> {
    validateId(id);
    const response = await this.client.patch<TEntity>(`${this.baseEndpoint}/${id}`, data);
    return extractData(response);
  }

  // ==========================================
  // DELETE OPERATIONS
  // ==========================================

  /**
   * Delete entity permanently
   *
   * @param {string} id - The entity ID
   * @returns {Promise<void>} Resolves when entity is deleted
   * @throws {Error} When ID is invalid, entity not found, or deletion fails
   *
   * @example
   * ```typescript
   * await operations.delete('abc-123');
   * console.log('Student deleted successfully');
   * ```
   */
  public async delete(id: string): Promise<void> {
    validateId(id);
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
   * const results = await operations.search('Alice');
   *
   * // Search with filters
   * const filtered = await operations.search('John', {
   *   grade: 5,
   *   page: 1,
   *   limit: 10
   * });
   * ```
   */
  public async search(query: string, filters?: FilterParams): Promise<PaginatedResponse<TEntity>> {
    const params = buildQueryParams({ ...filters, search: query });
    const url = `${this.baseEndpoint}/search${params}`;

    const response = await this.client.get<PaginatedResponse<TEntity>>(url);
    return extractData(response);
  }
}
