/**
 * WF-TYPES-260 | types.ts - BaseApiService Type Definitions
 *
 * @module services/core/base-api/types
 * @description
 * Centralized type definitions for the BaseApiService architecture.
 * Provides type-safe contracts for entities, operations, and API responses.
 *
 * @purpose
 * - Define base entity structure with timestamp tracking
 * - Provide pagination and filtering type contracts
 * - Define CRUD operation interfaces
 * - Ensure type safety across all API services
 *
 * @upstream ../ApiClient.types (for PaginatedResponse)
 * @dependencies ApiClient.types
 * @downstream All BaseApiService consumers
 * @exports BaseEntity, PaginationParams, FilterParams, CrudOperations, PaginatedResponse
 *
 * @keyFeatures
 * - Generic type parameters for extensibility
 * - Pagination support with sorting
 * - Flexible filtering with index signatures
 * - Type-safe CRUD interface contracts
 *
 * @lastUpdated 2025-11-04
 * @fileType TypeScript Type Definitions
 * @architecture Core type layer for service architecture
 */

import type { PaginatedResponse } from '../ApiClient.types';

// ==========================================
// BASE ENTITY TYPES
// ==========================================

/**
 * Base entity interface that all API entities must extend
 *
 * @description
 * Provides foundational fields that every entity in the system possesses.
 * Ensures consistent ID tracking and timestamp management across all entities.
 *
 * @property {string} id - Unique identifier for the entity
 * @property {string} [createdAt] - ISO 8601 timestamp of entity creation
 * @property {string} [updatedAt] - ISO 8601 timestamp of last update
 *
 * @example
 * ```typescript
 * interface Student extends BaseEntity {
 *   name: string;
 *   grade: number;
 *   email: string;
 * }
 * ```
 */
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// PAGINATION & FILTERING TYPES
// ==========================================

/**
 * Pagination parameters for list queries
 *
 * @description
 * Standard pagination interface supporting page-based navigation,
 * result limiting, and sorting with configurable order.
 *
 * @property {number} [page] - Page number (1-indexed)
 * @property {number} [limit] - Number of items per page
 * @property {string} [sort] - Field name to sort by
 * @property {'asc' | 'desc'} [order] - Sort order direction
 *
 * @example
 * ```typescript
 * const params: PaginationParams = {
 *   page: 1,
 *   limit: 20,
 *   sort: 'createdAt',
 *   order: 'desc'
 * };
 * ```
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Extended filter parameters with pagination
 *
 * @description
 * Combines pagination capabilities with arbitrary filtering.
 * The index signature allows type-safe custom filters while
 * maintaining pagination and sorting functionality.
 *
 * @extends PaginationParams
 * @property {unknown} [key: string] - Custom filter fields
 *
 * @example
 * ```typescript
 * const filters: FilterParams = {
 *   page: 1,
 *   limit: 10,
 *   sort: 'name',
 *   order: 'asc',
 *   grade: 5,  // Custom filter
 *   active: true  // Custom filter
 * };
 * ```
 */
export interface FilterParams extends PaginationParams {
  [key: string]: unknown;
}

// ==========================================
// CRUD OPERATION INTERFACES
// ==========================================

/**
 * CRUD operation interface for type-safe API services
 *
 * @description
 * Defines the contract that all API services must implement.
 * Provides type-safe generic operations with separate DTOs
 * for create and update operations.
 *
 * @typeParam T - The entity type (must extend BaseEntity)
 * @typeParam TCreate - The data transfer object for creating entities
 * @typeParam TUpdate - The data transfer object for updating entities (defaults to Partial<TCreate>)
 *
 * @example
 * ```typescript
 * class StudentApi implements CrudOperations<Student, CreateStudentDto> {
 *   async getAll(filters?: FilterParams): Promise<PaginatedResponse<Student>> {
 *     // Implementation
 *   }
 *   // ... other methods
 * }
 * ```
 */
export interface CrudOperations<T extends BaseEntity, TCreate, TUpdate = Partial<TCreate>> {
  /**
   * Retrieve all entities with optional filtering and pagination
   *
   * @param {FilterParams} [filters] - Optional filters and pagination params
   * @returns {Promise<PaginatedResponse<T>>} Paginated list of entities
   */
  getAll(filters?: FilterParams): Promise<PaginatedResponse<T>>;

  /**
   * Retrieve single entity by ID
   *
   * @param {string} id - Entity identifier
   * @returns {Promise<T>} The requested entity
   * @throws {Error} When entity not found
   */
  getById(id: string): Promise<T>;

  /**
   * Create new entity
   *
   * @param {TCreate} data - Entity creation data
   * @returns {Promise<T>} The created entity with server-assigned fields
   * @throws {Error} When validation fails
   */
  create(data: TCreate): Promise<T>;

  /**
   * Update existing entity
   *
   * @param {string} id - Entity identifier
   * @param {TUpdate} data - Entity update data
   * @returns {Promise<T>} The updated entity
   * @throws {Error} When entity not found or validation fails
   */
  update(id: string, data: TUpdate): Promise<T>;

  /**
   * Delete entity permanently
   *
   * @param {string} id - Entity identifier
   * @returns {Promise<void>} Resolves when deletion complete
   * @throws {Error} When entity not found or deletion fails
   */
  delete(id: string): Promise<void>;
}

// ==========================================
// RE-EXPORTED TYPES FROM API CLIENT
// ==========================================

/**
 * Re-export PaginatedResponse from ApiClient for consistency
 *
 * @description
 * We re-export the canonical PaginatedResponse type from ApiClient
 * to ensure type compatibility across the entire API service layer.
 * This prevents duplicate type definitions and ensures all services
 * use the same pagination response structure.
 *
 * @see ApiClient.types.PaginatedResponse for full documentation
 */
export type { PaginatedResponse };
