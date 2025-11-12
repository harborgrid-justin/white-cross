/**
 * WF-COMP-315 | administration-common.ts - Common Administration Type Definitions
 * Purpose: Shared type definitions used across administration modules
 * Upstream: administration-enums.ts | Dependencies: None
 * Downstream: All administration modules | Called by: All admin components
 * Related: All administration-*.ts files
 * Exports: Pagination, filters, API responses, type guards
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Shared utilities for administration features
 * LLM Context: Common type definitions and type guards for administration module
 */

import {
  ConfigCategory,
  LicenseType,
  TrainingCategory,
  UserRole,
  MetricType,
  AuditAction,
} from './administration-enums';

/**
 * Common Administration Types
 *
 * Type definitions for:
 * - Pagination and filtering
 * - API response wrappers
 * - Type guard utilities
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
}

// ==================== API RESPONSE TYPES ====================

/**
 * API error detail
 */
export interface ApiError {
  message: string;
}

/**
 * Field-specific error
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Generic API response
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  errors?: FieldError[];
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
