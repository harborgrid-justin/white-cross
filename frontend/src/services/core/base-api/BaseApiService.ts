/**
 * WF-COMP-267 | BaseApiService.ts - Refactored Base API Service Module
 *
 * @module services/core/base-api/BaseApiService
 * @description
 * Provides a type-safe, reusable base class for implementing CRUD operations
 * across all API endpoints in the White Cross Healthcare Platform. Refactored
 * using composition and single responsibility principle for better maintainability.
 *
 * @purpose
 * - Standardize CRUD operations across all API services
 * - Provide type-safe generic patterns for entity management
 * - Support bulk operations for efficient data management
 * - Enable validation with Zod schemas
 * - Simplify service implementation with inheritance
 *
 * @upstream ./crud-operations, ./bulk-operations, ./export-import, ./custom-requests
 * @dependencies ApiClient, ZodSchema, all operation mixins
 * @downstream All module-specific API services (medication, student, staff, etc.)
 * @exports BaseApiService class, createApiService helper
 *
 * @keyFeatures
 * - Composition-based architecture for separation of concerns
 * - Generic type-safe CRUD operations
 * - Bulk create, update, delete operations
 * - Export/import functionality
 * - Custom request methods for extensions
 * - Optional Zod schema validation
 *
 * @lastUpdated 2025-11-04
 * @fileType TypeScript Service Module
 * @architecture Core service layer using composition pattern
 */

import type { ApiClient } from '../ApiClient';
import type { PaginatedResponse } from '../ApiClient.types';
import type { ZodSchema } from 'zod';
import type { BaseEntity, FilterParams, CrudOperations } from './types';
import { CrudOperationsMixin } from './crud-operations';
import { BulkOperationsMixin } from './bulk-operations';
import { ExportImportMixin } from './export-import';
import { CustomRequestsMixin } from './custom-requests';

// ==========================================
// BASE API SERVICE CLASS
// ==========================================

/**
 * Base API Service Class
 *
 * @description
 * Abstract base class providing type-safe CRUD operations for all API endpoints.
 * Uses composition pattern to separate concerns into focused operation modules.
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
export abstract class BaseApiService<
  TEntity extends BaseEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TCreateDto>
> implements CrudOperations<TEntity, TCreateDto, TUpdateDto> {
  protected client: ApiClient;
  protected baseEndpoint: string;
  protected createSchema?: ZodSchema<TCreateDto>;
  protected updateSchema?: ZodSchema<TUpdateDto>;

  // Composition: Delegate to specialized operation modules
  private crudOps: CrudOperationsMixin<TEntity, TCreateDto, TUpdateDto>;
  private bulkOps: BulkOperationsMixin<TEntity, TCreateDto, TUpdateDto>;
  private exportImportOps: ExportImportMixin;
  private customRequestsOps: CustomRequestsMixin;

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

    // Initialize operation modules with composition
    this.crudOps = new CrudOperationsMixin<TEntity, TCreateDto, TUpdateDto>(
      client,
      baseEndpoint,
      this.createSchema,
      this.updateSchema
    );
    this.bulkOps = new BulkOperationsMixin<TEntity, TCreateDto, TUpdateDto>(
      client,
      baseEndpoint
    );
    this.exportImportOps = new ExportImportMixin(client, baseEndpoint);
    this.customRequestsOps = new CustomRequestsMixin(client, baseEndpoint);
  }

  // ==========================================
  // CRUD OPERATIONS (delegated)
  // ==========================================

  /**
   * Get all entities with optional filtering and pagination
   * @see CrudOperationsMixin.getAll
   */
  public async getAll(filters?: FilterParams): Promise<PaginatedResponse<TEntity>> {
    return this.crudOps.getAll(filters);
  }

  /**
   * Get entity by ID
   * @see CrudOperationsMixin.getById
   */
  public async getById(id: string): Promise<TEntity> {
    return this.crudOps.getById(id);
  }

  /**
   * Create new entity
   * @see CrudOperationsMixin.create
   */
  public async create(data: TCreateDto): Promise<TEntity> {
    return this.crudOps.create(data);
  }

  /**
   * Update existing entity (full update)
   * @see CrudOperationsMixin.update
   */
  public async update(id: string, data: TUpdateDto): Promise<TEntity> {
    return this.crudOps.update(id, data);
  }

  /**
   * Partially update entity (only specified fields)
   * @see CrudOperationsMixin.patch
   */
  public async patch(id: string, data: Partial<TUpdateDto>): Promise<TEntity> {
    return this.crudOps.patch(id, data);
  }

  /**
   * Delete entity permanently
   * @see CrudOperationsMixin.delete
   */
  public async delete(id: string): Promise<void> {
    return this.crudOps.delete(id);
  }

  /**
   * Search entities by query string
   * @see CrudOperationsMixin.search
   */
  public async search(query: string, filters?: FilterParams): Promise<PaginatedResponse<TEntity>> {
    return this.crudOps.search(query, filters);
  }

  // ==========================================
  // BULK OPERATIONS (delegated)
  // ==========================================

  /**
   * Create multiple entities in a single request
   * @see BulkOperationsMixin.bulkCreate
   */
  public async bulkCreate(data: TCreateDto[]): Promise<TEntity[]> {
    return this.bulkOps.bulkCreate(data);
  }

  /**
   * Update multiple entities in a single request
   * @see BulkOperationsMixin.bulkUpdate
   */
  public async bulkUpdate(updates: Array<{ id: string; data: TUpdateDto }>): Promise<TEntity[]> {
    return this.bulkOps.bulkUpdate(updates);
  }

  /**
   * Delete multiple entities in a single request
   * @see BulkOperationsMixin.bulkDelete
   */
  public async bulkDelete(ids: string[]): Promise<void> {
    return this.bulkOps.bulkDelete(ids);
  }

  // ==========================================
  // EXPORT/IMPORT OPERATIONS (delegated)
  // ==========================================

  /**
   * Export entities to specified format
   * @see ExportImportMixin.export
   */
  public async export(format: 'csv' | 'json' | 'pdf' = 'json', filters?: FilterParams): Promise<Blob> {
    return this.exportImportOps.export(format, filters);
  }

  /**
   * Import entities from file
   * @see ExportImportMixin.import
   */
  public async import(file: File): Promise<{ imported: number; errors: unknown[] }> {
    return this.exportImportOps.import(file);
  }

  // ==========================================
  // UTILITY METHODS (protected, for subclass access)
  // ==========================================

  /**
   * Validate entity ID
   * @see validation.validateId
   */
  protected validateId(id: string): void {
    const { validateId: validate } = require('./validation');
    validate(id);
  }

  /**
   * Build query parameters string
   * @see utils.buildQueryParams
   */
  protected buildQueryParams(params?: FilterParams): string {
    const { buildQueryParams: build } = require('./utils');
    return build(params);
  }

  /**
   * Extract data from API response
   * @see utils.extractData
   */
  protected extractData<T>(response: import('../ApiClient').ApiResponse<T>): T {
    const { extractData: extract } = require('./utils');
    return extract(response);
  }

  // ==========================================
  // CUSTOM REQUEST METHODS (protected, delegated)
  // ==========================================

  /**
   * Build full endpoint URL
   * @see CustomRequestsMixin.buildEndpointUrl
   */
  protected buildEndpoint(path: string): string {
    return this.customRequestsOps['buildEndpointUrl'](path);
  }

  /**
   * Execute custom GET request
   * @see CustomRequestsMixin.get
   */
  protected async get<T>(endpoint: string, params?: FilterParams): Promise<T> {
    return this.customRequestsOps['get']<T>(endpoint, params);
  }

  /**
   * Execute custom POST request
   * @see CustomRequestsMixin.post
   */
  protected async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.customRequestsOps['post']<T>(endpoint, data);
  }

  /**
   * Execute custom PUT request
   * @see CustomRequestsMixin.put
   */
  protected async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.customRequestsOps['put']<T>(endpoint, data);
  }

  /**
   * Execute custom PATCH request
   * @see CustomRequestsMixin.patchRequest
   */
  protected async patchRequest<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.customRequestsOps['patchRequest']<T>(endpoint, data);
  }

  /**
   * Execute custom DELETE request
   * @see CustomRequestsMixin.deleteRequest
   */
  protected async deleteRequest<T>(endpoint: string): Promise<T> {
    return this.customRequestsOps['deleteRequest']<T>(endpoint);
  }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Create a typed API service instance
 *
 * @description
 * Factory function to create anonymous BaseApiService instances without
 * explicit class definition. Useful for simple services without custom methods.
 *
 * @typeParam TEntity - The entity type (must extend BaseEntity)
 * @typeParam TCreateDto - The create DTO type (defaults to Partial<TEntity>)
 * @typeParam TUpdateDto - The update DTO type (defaults to Partial<TCreateDto>)
 *
 * @param {ApiClient} client - The API client instance
 * @param {string} baseEndpoint - The base endpoint URL
 * @param {object} [options] - Optional configuration with Zod schemas
 * @returns {BaseApiService<TEntity, TCreateDto, TUpdateDto>} A configured service instance
 *
 * @example
 * ```typescript
 * const studentApi = createApiService<Student, CreateStudentDto>(
 *   apiClient,
 *   '/api/students',
 *   {
 *     createSchema: createStudentSchema,
 *     updateSchema: updateStudentSchema
 *   }
 * );
 *
 * // Use like any BaseApiService
 * const students = await studentApi.getAll();
 * ```
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
