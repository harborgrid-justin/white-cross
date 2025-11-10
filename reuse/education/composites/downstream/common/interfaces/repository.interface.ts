/**
 * Repository Pattern Interfaces
 *
 * Base interfaces for repository pattern implementation.
 */

import { Transaction } from 'sequelize';

/**
 * Pagination parameters
 */
export interface PaginationDto {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Base Repository Interface
 */
export interface IBaseRepository<T, CreateDto, UpdateDto> {
  findById(id: string, transaction?: Transaction): Promise<T | null>;
  findAll(pagination: PaginationDto, transaction?: Transaction): Promise<PaginatedResponse<T>>;
  create(data: CreateDto, transaction?: Transaction): Promise<T>;
  update(id: string, data: UpdateDto, transaction?: Transaction): Promise<T>;
  delete(id: string, transaction?: Transaction): Promise<boolean>;
  exists(id: string, transaction?: Transaction): Promise<boolean>;
}

/**
 * Query options for flexible queries
 */
export interface QueryOptions {
  where?: any;
  order?: any[];
  include?: any[];
  attributes?: string[];
  limit?: number;
  offset?: number;
  transaction?: Transaction;
}

/**
 * Audit metadata for tracking
 */
export interface AuditMetadata {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Soft delete support
 */
export interface ISoftDeletable {
  deletedAt?: Date;
  deletedBy?: string;
}

/**
 * Search criteria interface
 */
export interface SearchCriteria {
  query?: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  pagination: PaginationDto;
}
