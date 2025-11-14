/**
 * WF-COMP-315 | administration/shared.ts - Type definitions
 * Purpose: Shared utility type definitions for administration module
 * Upstream: enums.ts | Dependencies: UserRole, AuditAction, MetricType
 * Downstream: All administration components | Called by: React components
 * Related: Other administration type files
 * Exports: Interfaces, type guards | Key Features: Type definitions, runtime validation
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Shared utilities for administration domain
 * LLM Context: Pagination, filtering, API response types, and type guards
 */

import type {
  ConfigCategory,
  LicenseType,
  TrainingCategory,
  UserRole,
  MetricType,
  AuditAction,
} from './enums';

/**
 * Shared Administration Types
 *
 * Shared type definitions including:
 * - Pagination and filtering
 * - API response wrappers
 * - Type guard functions for runtime validation
 */

// ==================== PAGINATION & FILTER TYPES ====================

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Pagination result metadata
 */
export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationResult;
}

/**
 * User filter parameters
 */
export interface UserFilters extends PaginationParams {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}

/**
 * Audit log filter parameters
 */
export interface AuditLogFilters extends PaginationParams {
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: AuditAction;
  startDate?: Date | string;
  endDate?: Date | string;
}

/**
 * Metric filter parameters
 */
export interface MetricFilters {
  metricType?: MetricType;
  startDate?: Date | string;
  endDate?: Date | string;
  limit?: number;
  tags?: string[];
}

// ==================== API RESPONSE TYPES ====================

/**
 * Generic API response
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Success response with message
 */
export interface SuccessResponse {
  success: boolean;
  message: string;
}

// ==================== TYPE GUARDS ====================

/**
 * Check if value is a valid ConfigCategory
 */
export function isConfigCategory(value: unknown): value is ConfigCategory {
  return Object.values(ConfigCategory).includes(value as ConfigCategory);
}

/**
 * Check if value is a valid LicenseType
 */
export function isLicenseType(value: unknown): value is LicenseType {
  return Object.values(LicenseType).includes(value as LicenseType);
}

/**
 * Check if value is a valid TrainingCategory
 */
export function isTrainingCategory(value: unknown): value is TrainingCategory {
  return Object.values(TrainingCategory).includes(value as TrainingCategory);
}

/**
 * Check if value is a valid UserRole
 */
export function isUserRole(value: unknown): value is UserRole {
  return Object.values(UserRole).includes(value as UserRole);
}

/**
 * Check if value is a valid MetricType
 */
export function isMetricType(value: unknown): value is MetricType {
  return Object.values(MetricType).includes(value as MetricType);
}

/**
 * Check if value is a valid AuditAction
 */
export function isAuditAction(value: unknown): value is AuditAction {
  return Object.values(AuditAction).includes(value as AuditAction);
}
