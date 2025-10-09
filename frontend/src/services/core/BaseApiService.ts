/**
 * Base API Service with type-safe CRUD operations
 * Provides reusable patterns for all API modules
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
   */
  public async getAll(filters?: FilterParams): Promise<PaginatedResponse<TEntity>> {
    const params = this.buildQueryParams(filters);
    const url = `${this.baseEndpoint}${params}`;

    const response = await this.client.get<PaginatedResponse<TEntity>>(url);
    return this.extractData(response);
  }

  /**
   * Get entity by ID
   */
  public async getById(id: string): Promise<TEntity> {
    this.validateId(id);
    const response = await this.client.get<TEntity>(`${this.baseEndpoint}/${id}`);
    return this.extractData(response);
  }

  /**
   * Create new entity
   */
  public async create(data: TCreateDto): Promise<TEntity> {
    this.validateCreateData(data);
    const response = await this.client.post<TEntity>(this.baseEndpoint, data);
    return this.extractData(response);
  }

  /**
   * Update existing entity
   */
  public async update(id: string, data: TUpdateDto): Promise<TEntity> {
    this.validateId(id);
    this.validateUpdateData(data);
    const response = await this.client.put<TEntity>(`${this.baseEndpoint}/${id}`, data);
    return this.extractData(response);
  }

  /**
   * Partially update entity
   */
  public async patch(id: string, data: Partial<TUpdateDto>): Promise<TEntity> {
    this.validateId(id);
    const response = await this.client.patch<TEntity>(`${this.baseEndpoint}/${id}`, data);
    return this.extractData(response);
  }

  /**
   * Delete entity
   */
  public async delete(id: string): Promise<void> {
    this.validateId(id);
    await this.client.delete(`${this.baseEndpoint}/${id}`);
  }

  // ==========================================
  // SEARCH OPERATIONS
  // ==========================================

  /**
   * Search entities
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
   * Bulk create entities
   */
  public async bulkCreate(data: TCreateDto[]): Promise<TEntity[]> {
    const response = await this.client.post<TEntity[]>(`${this.baseEndpoint}/bulk`, { items: data });
    return this.extractData(response);
  }

  /**
   * Bulk update entities
   */
  public async bulkUpdate(updates: Array<{ id: string; data: TUpdateDto }>): Promise<TEntity[]> {
    const response = await this.client.put<TEntity[]>(`${this.baseEndpoint}/bulk`, { updates });
    return this.extractData(response);
  }

  /**
   * Bulk delete entities
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
      } catch (error) {
        if (error instanceof z.ZodError) {
          const firstError = error.errors[0];
          throw new Error(`Validation error: ${firstError.message} at ${firstError.path.join('.')}`);
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
      } catch (error) {
        if (error instanceof z.ZodError) {
          const firstError = error.errors[0];
          throw new Error(`Validation error: ${firstError.message} at ${firstError.path.join('.')}`);
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
