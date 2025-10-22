# Frontend Services Structure Template

This template provides instructions for creating consistent service layer structures in the White Cross application. Use the existing services in `/frontend/src/services/` as reference implementations.

## Overview

The services layer follows a modular architecture with:
- **Core infrastructure** (ApiClient, BaseApiService, configurations)
- **Domain-specific APIs** (authApi, studentsApi, appointmentsApi, etc.)
- **Utility services** (error handling, caching, security)
- **Type safety** throughout with Zod validation
- **Monitoring and resilience** patterns

## Directory Structure

```
services/
├── index.ts                           # Main service exports
├── config/
│   └── apiConfig.ts                  # Axios configuration and interceptors
├── core/
│   ├── index.ts                      # Core service exports
│   ├── BaseApiService.ts             # Abstract base class for CRUD operations
│   ├── ApiClient.ts                  # Core HTTP client wrapper
│   ├── ResilientApiClient.ts         # Retry/circuit breaker patterns
│   ├── ServiceRegistry.ts            # Service locator pattern
│   ├── QueryHooksFactory.ts          # React Query integration
│   └── ApiMonitoring.ts              # Performance monitoring
├── modules/
│   ├── authApi.ts                    # Authentication service
│   ├── {domain}Api.ts                # Domain-specific services
│   └── {domain}/                     # Complex domain subfolder (optional)
│       ├── index.ts                  # Domain service exports
│       ├── {domain}Api.ts            # Main domain API
│       ├── {domain}Types.ts          # Domain-specific types
│       └── {domain}Validators.ts     # Zod validation schemas
├── utils/
│   ├── apiUtils.ts                   # HTTP utility functions
│   ├── errorHandlers.ts              # Error handling utilities
│   ├── validators.ts                 # Common validation schemas
│   └── transformers.ts               # Data transformation utilities
├── types/
│   └── index.ts                      # Service type re-exports
├── security/
│   ├── SecureTokenManager.ts         # Token management
│   ├── CsrfProtection.ts             # CSRF protection
│   └── PermissionChecker.ts          # Permission validation
├── cache/
│   ├── ApiCache.ts                   # Response caching
│   └── CacheStrategies.ts            # Caching strategies
├── monitoring/
│   ├── ApiMetrics.ts                 # Performance metrics
│   └── ErrorReporting.ts             # Error tracking
└── resilience/
    ├── RetryStrategies.ts            # Retry logic
    └── CircuitBreaker.ts             # Circuit breaker pattern
```

## File Templates

### 1. Main Service Index (`index.ts`)

```typescript
/**
 * WF-IDX-XXX | index.ts - Services module exports
 * Purpose: Centralized exports for all service modules
 * Last Updated: {date} | File Type: .ts
 */

// Core infrastructure exports
export {
  apiInstance,
  tokenUtils,
  API_CONFIG,
  API_ENDPOINTS
} from './config/apiConfig';

// Utility exports
export {
  handleApiError,
  extractApiData,
  extractApiDataOptional,
  buildUrlParams,
  buildPaginationParams,
  formatDateForApi,
  parseDateFromApi,
  withRetry,
  createFormData,
  isApiResponse,
  isPaginatedResponse,
  apiCache,
  withCache,
  debounce
} from './utils/apiUtils';

// Type exports
export type { ApiError } from './utils/apiUtils';
export * from './types';

// Core service exports
export * from './core';

// Authentication service
export { authApi } from './modules/authApi';
export type { LoginCredentials, RegisterData, AuthApi } from './modules/authApi';

// Domain-specific API exports
export { {domain}Api } from './modules/{domain}Api';
export type { {Domain}Api, {Domain}Filters, Create{Domain}Data, Update{Domain}Data } from './modules/{domain}Api';

// Legacy compatibility (if needed)
export { administrationApi } from './modules/administrationApi';

// Security exports
export { secureTokenManager } from './security/SecureTokenManager';

// Monitoring exports
export { apiMetrics } from './monitoring/ApiMetrics';
```

### 2. Domain API Service (`modules/{domain}Api.ts`)

```typescript
/**
 * WF-COMP-XXX | {domain}Api.ts - {Domain} API service module
 * Purpose: {Domain} domain API operations with type safety and validation
 * Upstream: ../config/apiConfig, ../utils/apiUtils, ../types | Dependencies: axios, zod
 * Downstream: Components, Redux stores | Called by: Domain components and stores
 * Related: {Domain} types, {domain} Redux slice
 * Exports: {domain}Api instance, types | Key Features: CRUD operations, validation, error handling
 * Last Updated: {date} | File Type: .ts
 * Critical Path: Component request → API call → Backend → Response transformation → Component update
 * LLM Context: Domain-specific API service with comprehensive type safety and validation
 */

import { apiInstance, API_ENDPOINTS } from '../config/apiConfig';
import { 
  ApiResponse, 
  PaginatedResponse, 
  buildPaginationParams, 
  buildUrlParams,
  handleApiError,
  extractApiData,
  withRetry
} from '../utils/apiUtils';
import { z } from 'zod';
import { auditService, AuditAction, AuditResourceType, AuditStatus } from '../audit';
import {
  {Domain},
  Create{Domain}Data,
  Update{Domain}Data,
  {Domain}Filters,
  Paginated{Domain}Response,
  {Domain}Statistics,
} from '../../types/{domain}.types';

// ==========================================
// INTERFACES & TYPES
// ==========================================

export interface {Domain}Api {
  // Basic CRUD operations
  getAll(filters?: {Domain}Filters): Promise<Paginated{Domain}Response>;
  getById(id: string): Promise<{Domain}>;
  create(data: Create{Domain}Data): Promise<{Domain}>;
  update(id: string, data: Update{Domain}Data): Promise<{Domain}>;
  delete(id: string): Promise<void>;
  
  // Advanced operations
  getStatistics(filters?: {Domain}Filters): Promise<{Domain}Statistics>;
  bulkUpdate(ids: string[], data: Partial<Update{Domain}Data>): Promise<{Domain}[]>;
  export(filters?: {Domain}Filters): Promise<Blob>;
  import(file: File): Promise<{ success: number; errors: string[] }>;
  
  // Search and filtering
  search(query: string, filters?: {Domain}Filters): Promise<{Domain}[]>;
  getFilters(): Promise<{ [key: string]: string[] }>;
}

/**
 * Backend API response wrapper for type safety
 */
interface BackendApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  message?: string;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

/**
 * Validation schemas using Zod for runtime type checking
 * These should match backend model constraints
 */

// Common validation patterns
const ID_REGEX = /^[a-zA-Z0-9-_]{1,50}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

/**
 * Create {domain} validation schema
 */
const create{Domain}Schema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
    
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
    
  status: z
    .enum(['active', 'inactive', 'pending'], {
      errorMap: () => ({ message: 'Status must be active, inactive, or pending' })
    })
    .default('active'),
    
  // Add domain-specific fields
  // Example: email, phone, dates, etc.
  
}).strict(); // Prevent additional properties

/**
 * Update {domain} validation schema (partial of create)
 */
const update{Domain}Schema = create{Domain}Schema.partial();

/**
 * Filter validation schema
 */
const {domain}FiltersSchema = z.object({
  status: z.array(z.enum(['active', 'inactive', 'pending'])).optional(),
  search: z.string().max(100).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  // Pagination
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sort: z.string().max(50).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
}).strict();

// ==========================================
// API IMPLEMENTATION CLASS
// ==========================================

class {Domain}ApiImpl implements {Domain}Api {
  private readonly baseEndpoint = '/api/{domain-kebab}';
  private readonly auditResource: AuditResourceType = '{DOMAIN}' as AuditResourceType;

  /**
   * Get all {domain} items with filtering and pagination
   */
  async getAll(filters?: {Domain}Filters): Promise<Paginated{Domain}Response> {
    try {
      // Validate filters
      const validatedFilters = filters ? {domain}FiltersSchema.parse(filters) : {};
      
      // Build query parameters
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;
      
      // Make request with retry logic
      const response = await withRetry(() => apiInstance.get(url), {
        maxRetries: 3,
        backoffMs: 1000
      });
      
      // Extract and validate response
      const data = extractApiData<Paginated{Domain}Response>(response);
      
      // Audit the operation
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: 'multiple',
        status: AuditStatus.SUCCESS,
        details: { filters: validatedFilters, count: data.data?.length || 0 }
      });
      
      return data;
    } catch (error) {
      // Audit the failure
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: 'multiple',
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw handleApiError(error);
    }
  }

  /**
   * Get a single {domain} item by ID
   */
  async getById(id: string): Promise<{Domain}> {
    try {
      // Validate ID format
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }
      
      const response = await apiInstance.get(`${this.baseEndpoint}/${id}`);
      const data = extractApiData<{Domain}>(response);
      
      // Audit successful read
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS
      });
      
      return data;
    } catch (error) {
      // Audit failed read
      await auditService.logAction({
        action: AuditAction.READ,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw handleApiError(error);
    }
  }

  /**
   * Create a new {domain} item
   */
  async create(data: Create{Domain}Data): Promise<{Domain}> {
    try {
      // Validate input data
      const validatedData = create{Domain}Schema.parse(data);
      
      const response = await apiInstance.post(this.baseEndpoint, validatedData);
      const createdItem = extractApiData<{Domain}>(response);
      
      // Audit successful creation
      await auditService.logAction({
        action: AuditAction.CREATE,
        resourceType: this.auditResource,
        resourceId: createdItem.id,
        status: AuditStatus.SUCCESS,
        details: { created: validatedData }
      });
      
      return createdItem;
    } catch (error) {
      // Audit failed creation
      await auditService.logAction({
        action: AuditAction.CREATE,
        resourceType: this.auditResource,
        resourceId: 'new',
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: { attempted: data }
      });
      
      throw handleApiError(error);
    }
  }

  /**
   * Update an existing {domain} item
   */
  async update(id: string, data: Update{Domain}Data): Promise<{Domain}> {
    try {
      // Validate ID and input data
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }
      
      const validatedData = update{Domain}Schema.parse(data);
      
      const response = await apiInstance.put(`${this.baseEndpoint}/${id}`, validatedData);
      const updatedItem = extractApiData<{Domain}>(response);
      
      // Audit successful update
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS,
        details: { updated: validatedData }
      });
      
      return updatedItem;
    } catch (error) {
      // Audit failed update
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: { attempted: data }
      });
      
      throw handleApiError(error);
    }
  }

  /**
   * Delete a {domain} item
   */
  async delete(id: string): Promise<void> {
    try {
      // Validate ID format
      if (!ID_REGEX.test(id)) {
        throw new Error('Invalid ID format');
      }
      
      await apiInstance.delete(`${this.baseEndpoint}/${id}`);
      
      // Audit successful deletion
      await auditService.logAction({
        action: AuditAction.DELETE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.SUCCESS
      });
    } catch (error) {
      // Audit failed deletion
      await auditService.logAction({
        action: AuditAction.DELETE,
        resourceType: this.auditResource,
        resourceId: id,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw handleApiError(error);
    }
  }

  /**
   * Get statistics for {domain} items
   */
  async getStatistics(filters?: {Domain}Filters): Promise<{Domain}Statistics> {
    try {
      const validatedFilters = filters ? {domain}FiltersSchema.parse(filters) : {};
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}/statistics${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await apiInstance.get(url);
      return extractApiData<{Domain}Statistics>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Bulk update multiple {domain} items
   */
  async bulkUpdate(ids: string[], data: Partial<Update{Domain}Data>): Promise<{Domain}[]> {
    try {
      // Validate IDs
      ids.forEach(id => {
        if (!ID_REGEX.test(id)) {
          throw new Error(`Invalid ID format: ${id}`);
        }
      });
      
      const validatedData = update{Domain}Schema.partial().parse(data);
      
      const response = await apiInstance.patch(`${this.baseEndpoint}/bulk`, {
        ids,
        data: validatedData
      });
      
      const updatedItems = extractApiData<{Domain}[]>(response);
      
      // Audit bulk update
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: `bulk-${ids.length}`,
        status: AuditStatus.SUCCESS,
        details: { ids, updated: validatedData }
      });
      
      return updatedItems;
    } catch (error) {
      await auditService.logAction({
        action: AuditAction.UPDATE,
        resourceType: this.auditResource,
        resourceId: `bulk-${ids.length}`,
        status: AuditStatus.FAILURE,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw handleApiError(error);
    }
  }

  /**
   * Export {domain} data
   */
  async export(filters?: {Domain}Filters): Promise<Blob> {
    try {
      const validatedFilters = filters ? {domain}FiltersSchema.parse(filters) : {};
      const params = buildUrlParams(validatedFilters);
      const url = `${this.baseEndpoint}/export${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await apiInstance.get(url, {
        responseType: 'blob',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Import {domain} data from file
   */
  async import(file: File): Promise<{ success: number; errors: string[] }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiInstance.post(`${this.baseEndpoint}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return extractApiData<{ success: number; errors: string[] }>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Search {domain} items
   */
  async search(query: string, filters?: {Domain}Filters): Promise<{Domain}[]> {
    try {
      const validatedFilters = filters ? {domain}FiltersSchema.parse(filters) : {};
      const searchParams = { ...validatedFilters, q: query };
      const params = buildUrlParams(searchParams);
      
      const response = await apiInstance.get(`${this.baseEndpoint}/search?${params.toString()}`);
      return extractApiData<{Domain}[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get available filter options
   */
  async getFilters(): Promise<{ [key: string]: string[] }> {
    try {
      const response = await apiInstance.get(`${this.baseEndpoint}/filters`);
      return extractApiData<{ [key: string]: string[] }>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

/**
 * Singleton instance of {Domain}Api
 * Use this throughout the application
 */
export const {domain}Api: {Domain}Api = new {Domain}ApiImpl();

// ==========================================
// TYPE EXPORTS
// ==========================================

export type { {Domain}Api };
```

### 3. Base API Service (`core/BaseApiService.ts`)

```typescript
/**
 * WF-COMP-XXX | BaseApiService.ts - Base API service abstract class
 * Purpose: Provides reusable CRUD patterns for all API modules
 * Dependencies: ./ApiClient, zod
 * Exports: BaseApiService class, interfaces
 * Last Updated: {date} | File Type: .ts
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

  async getAll(filters?: FilterParams): Promise<PaginatedResponse<TEntity>> {
    try {
      const response = await this.client.get(this.baseEndpoint, { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<TEntity> {
    try {
      const response = await this.client.get(`${this.baseEndpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(data: TCreateDto): Promise<TEntity> {
    try {
      // Validate input if schema provided
      const validatedData = this.createSchema ? this.createSchema.parse(data) : data;
      
      const response = await this.client.post(this.baseEndpoint, validatedData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: string, data: TUpdateDto): Promise<TEntity> {
    try {
      // Validate input if schema provided
      const validatedData = this.updateSchema ? this.updateSchema.parse(data) : data;
      
      const response = await this.client.put(`${this.baseEndpoint}/${id}`, validatedData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.client.delete(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  protected handleError(error: unknown): never {
    // Transform and re-throw errors in a consistent format
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.message}`);
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('An unknown error occurred');
  }

  protected buildUrl(path: string): string {
    return `${this.baseEndpoint}${path.startsWith('/') ? path : `/${path}`}`;
  }
}
```

### 4. API Configuration (`config/apiConfig.ts`)

```typescript
/**
 * WF-COMP-XXX | apiConfig.ts - API configuration and Axios setup
 * Purpose: Central API configuration with authentication and interceptors
 * Dependencies: axios, API constants, security modules
 * Last Updated: {date} | File Type: .ts
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '../../constants/config';
import {
  API_ENDPOINTS,
  HTTP_STATUS,
  CONTENT_TYPES,
  REQUEST_CONFIG
} from '../../constants/api';
import { secureTokenManager } from '../security/SecureTokenManager';
import { setupCsrfProtection } from '../security/CsrfProtection';
import { apiMetrics } from '../monitoring/ApiMetrics';

// ==========================================
// API INSTANCE CREATION
// ==========================================

export const apiInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': CONTENT_TYPES.JSON,
    'Accept': CONTENT_TYPES.JSON,
  },
  withCredentials: true,
});

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

apiInstance.interceptors.request.use(
  (config) => {
    // Start performance tracking
    config.metadata = { startTime: performance.now() };
    
    // Add authentication token
    const token = secureTokenManager.getToken();
    if (token && secureTokenManager.isTokenValid()) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token) {
      // Token expired, clear it
      console.warn('[apiConfig] Token expired, clearing tokens');
      secureTokenManager.clearTokens();
    }
    
    // Add CSRF protection if enabled
    const csrfToken = secureTokenManager.getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    // Add request ID for tracing
    config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return config;
  },
  (error: AxiosError) => {
    apiMetrics.recordError(error);
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

apiInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Record performance metrics
    const startTime = response.config.metadata?.startTime;
    if (startTime) {
      const duration = performance.now() - startTime;
      apiMetrics.recordRequest(response.config.url || '', response.status, duration);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Record error metrics
    apiMetrics.recordError(error);
    
    // Handle token refresh for 401 errors
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = secureTokenManager.getRefreshToken();
        if (refreshToken && secureTokenManager.isRefreshTokenValid()) {
          const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { token, refreshToken: newRefreshToken, expiresIn } = response.data;
          
          // Update tokens
          secureTokenManager.setTokens(token, newRefreshToken, expiresIn);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        secureTokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('[apiConfig] Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// ==========================================
// SETUP SECURITY FEATURES
// ==========================================

// Initialize CSRF protection
setupCsrfProtection(apiInstance);

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export const tokenUtils = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return secureTokenManager.hasValidToken();
  },
  
  /**
   * Get current user token
   */
  getToken(): string | null {
    return secureTokenManager.getToken();
  },
  
  /**
   * Clear all authentication data
   */
  clearAuth(): void {
    secureTokenManager.clearTokens();
  },
  
  /**
   * Set authentication tokens
   */
  setTokens(token: string, refreshToken: string, expiresIn: number): void {
    secureTokenManager.setTokens(token, refreshToken, expiresIn);
  }
};

// ==========================================
// EXPORTS
// ==========================================

export { API_CONFIG, API_ENDPOINTS };
export default apiInstance;
```

### 5. API Utilities (`utils/apiUtils.ts`)

```typescript
/**
 * WF-COMP-XXX | apiUtils.ts - API utility functions
 * Purpose: Common utility functions for API operations
 * Dependencies: axios, moment
 * Last Updated: {date} | File Type: .ts
 */

import { AxiosResponse, AxiosError } from 'axios';
import moment from 'moment';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export interface RetryOptions {
  maxRetries?: number;
  backoffMs?: number;
  retryCondition?: (error: any) => boolean;
}

// ==========================================
// ERROR HANDLING
// ==========================================

export function handleApiError(error: AxiosError | any): ApiError {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    return {
      message: data?.message || data?.error || `Request failed with status ${status}`,
      code: data?.code,
      status,
      details: data?.errors || data?.details,
    };
  } else if (error.request) {
    // Network error
    return {
      message: 'Network error - please check your connection',
      code: 'NETWORK_ERROR',
      details: error.request,
    };
  } else {
    // Other error
    return {
      message: error.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      details: error,
    };
  }
}

// ==========================================
// DATA EXTRACTION
// ==========================================

export function extractApiData<T>(response: AxiosResponse): T {
  // Handle different response structures
  if (response.data?.data !== undefined) {
    return response.data.data;
  }
  
  if (response.data?.success && response.data?.result !== undefined) {
    return response.data.result;
  }
  
  return response.data;
}

export function extractApiDataOptional<T>(response: AxiosResponse): T | null {
  try {
    return extractApiData<T>(response);
  } catch {
    return null;
  }
}

// ==========================================
// URL BUILDING
// ==========================================

export function buildUrlParams(params: Record<string, any>): URLSearchParams {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else if (typeof value === 'object') {
        searchParams.append(key, JSON.stringify(value));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams;
}

export function buildPaginationParams(pagination: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}): URLSearchParams {
  return buildUrlParams({
    page: pagination.page || 1,
    limit: pagination.limit || 10,
    sort: pagination.sort,
    order: pagination.order || 'desc'
  });
}

// ==========================================
// DATE FORMATTING
// ==========================================

export function formatDateForApi(date: Date | string): string {
  return moment(date).utc().toISOString();
}

export function parseDateFromApi(dateString: string): Date {
  return moment.utc(dateString).toDate();
}

// ==========================================
// RETRY LOGIC
// ==========================================

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    backoffMs = 1000,
    retryCondition = (error) => error?.response?.status >= 500
  } = options;
  
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry if this is the last attempt or if retry condition is not met
      if (attempt === maxRetries || !retryCondition(error)) {
        break;
      }
      
      // Wait before retrying with exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, backoffMs * Math.pow(2, attempt))
      );
    }
  }
  
  throw lastError;
}

// ==========================================
// FORM DATA HANDLING
// ==========================================

export function createFormData(data: Record<string, any>): FormData {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, String(item));
        });
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  return formData;
}

// ==========================================
// TYPE GUARDS
// ==========================================

export function isApiResponse<T>(obj: any): obj is ApiResponse<T> {
  return obj && typeof obj === 'object' && 'success' in obj;
}

export function isPaginatedResponse<T>(obj: any): obj is PaginatedResponse<T> {
  return obj && typeof obj === 'object' && 'data' in obj && 'pagination' in obj;
}

// ==========================================
// CACHING
// ==========================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
}

export const apiCache = new ApiCache();

export function withCache<T>(
  key: string,
  operation: () => Promise<T>,
  ttlMs: number = 5 * 60 * 1000
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    // Try to get from cache first
    const cached = apiCache.get<T>(key);
    if (cached) {
      resolve(cached);
      return;
    }
    
    try {
      // Perform operation and cache result
      const result = await operation();
      apiCache.set(key, result, ttlMs);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

// ==========================================
// DEBOUNCING
// ==========================================

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), waitMs);
  };
}
```

## Implementation Guidelines

### 1. Service Naming Conventions
- **API Files**: Use `{domain}Api.ts` format (camelCase)
- **Interfaces**: Use `{Domain}Api` for service interfaces (PascalCase)
- **Endpoints**: Use kebab-case in URLs (`/api/user-management`)
- **Methods**: Use descriptive action names (`getAll`, `getById`, `create`, `update`, `delete`)

### 2. Validation Strategy
- **Zod Schemas**: Create comprehensive validation schemas for all inputs
- **Runtime Validation**: Validate both client input and server responses
- **Error Messages**: Provide user-friendly validation error messages
- **Type Safety**: Ensure validation schemas match TypeScript interfaces

### 3. Error Handling
- **Consistent Format**: Use `ApiError` interface throughout
- **Status Codes**: Handle different HTTP status codes appropriately
- **Retry Logic**: Implement retry for transient failures (5xx errors)
- **User Messages**: Provide meaningful error messages to users

### 4. Authentication & Security
- **Token Management**: Use `SecureTokenManager` for token storage
- **Automatic Refresh**: Implement transparent token refresh
- **CSRF Protection**: Include CSRF tokens when required
- **Permission Checks**: Validate permissions before API calls

### 5. Monitoring & Logging
- **Performance Metrics**: Track API call duration and success rates
- **Error Tracking**: Log errors with context for debugging
- **Audit Trails**: Record important operations for compliance
- **Request Tracing**: Include request IDs for distributed tracing

### 6. Caching Strategy
- **Response Caching**: Cache frequently requested, rarely changed data
- **Cache Invalidation**: Clear cache on data mutations
- **TTL Management**: Set appropriate cache expiration times
- **Memory Management**: Limit cache size to prevent memory leaks

## Service Integration Patterns

### 1. Redux Store Integration
```typescript
// In Redux slice
import { {domain}Api } from '../../../services';

export const fetch{Domain}Items = createAsyncThunk(
  '{domain}/fetchItems',
  async (filters?: {Domain}Filters) => {
    return await {domain}Api.getAll(filters);
  }
);
```

### 2. React Component Usage
```typescript
// In React component
import { {domain}Api } from '../../services';

const {Domain}Component: React.FC = () => {
  const [items, setItems] = useState<{Domain}[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const response = await {domain}Api.getAll();
        setItems(response.data);
      } catch (error) {
        console.error('Failed to load items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadItems();
  }, []);
  
  return (
    // Component JSX
  );
};
```

### 3. React Query Integration
```typescript
// Custom hook with React Query
export function use{Domain}Items(filters?: {Domain}Filters) {
  return useQuery({
    queryKey: ['{domain}', 'items', filters],
    queryFn: () => {domain}Api.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

## Replacement Placeholders

When creating a new domain service, replace these placeholders:
- `{domain}` → lowercase domain name (e.g., `appointments`, `inventory`)
- `{Domain}` → PascalCase domain name (e.g., `Appointments`, `Inventory`)
- `{DOMAIN}` → UPPERCASE domain name (e.g., `APPOINTMENTS`, `INVENTORY`)
- `{domain-kebab}` → kebab-case domain name (e.g., `appointments`, `user-management`)
- `{date}` → current date in YYYY-MM-DD format
- `WF-COMP-XXX` → actual work item/ticket number

## Integration Checklist

- [ ] Service follows the established naming conventions
- [ ] Validation schemas are comprehensive and match backend constraints
- [ ] Error handling follows the consistent `ApiError` format
- [ ] Authentication and security measures are implemented
- [ ] Audit logging is included for all CRUD operations
- [ ] Performance monitoring is integrated
- [ ] Caching strategy is appropriate for data access patterns
- [ ] Service is properly exported in main services index
- [ ] TypeScript types are comprehensive and exported
- [ ] Unit tests cover all service methods
- [ ] Integration tests verify API contract compliance
- [ ] Documentation includes usage examples

This template ensures all services follow consistent patterns while maintaining flexibility for domain-specific requirements and integrating seamlessly with the White Cross application architecture.