/**
 * @fileoverview User query, search, and bulk operation validation schemas
 * @module schemas/user.query
 *
 * Zod validation schemas for searching, filtering, querying user data,
 * and performing bulk operations and exports.
 */

import { z } from 'zod';
import { userRoleEnum, userStatusEnum } from './user.base.schemas';

// ==========================================
// USER SEARCH/FILTER SCHEMAS
// ==========================================

/**
 * Sort field enum for user queries
 *
 * Defines fields that can be used for sorting user results.
 */
export const userSortFieldEnum = z.enum([
  'email',
  'firstName',
  'lastName',
  'createdAt',
  'lastLoginAt'
]);

/**
 * Sort order enum
 *
 * Defines sort direction for query results.
 */
export const sortOrderEnum = z.enum(['asc', 'desc']);

/**
 * Schema for searching and filtering users
 *
 * Comprehensive search with multiple filter criteria:
 * - Full-text search query
 * - Filter by role, status, MFA
 * - Date range filtering for last login
 * - Pagination support
 * - Configurable sorting
 *
 * @example
 * const searchParams = {
 *   query: 'john',
 *   role: 'nurse',
 *   status: 'active',
 *   mfaEnabled: true,
 *   lastLoginAfter: '2024-01-01T00:00:00Z',
 *   page: 1,
 *   limit: 50,
 *   sortBy: 'lastLoginAt',
 *   sortOrder: 'desc'
 * };
 * searchUsersSchema.parse(searchParams);
 */
export const searchUsersSchema = z.object({
  /**
   * Full-text search query (optional)
   * Searches across name, email, and other text fields
   */
  query: z.string().optional(),

  /**
   * Filter by user role (optional)
   */
  role: userRoleEnum.optional(),

  /**
   * Filter by user status (optional)
   */
  status: userStatusEnum.optional(),

  /**
   * Filter by MFA enabled status (optional)
   */
  mfaEnabled: z.boolean().optional(),

  /**
   * Filter users who last logged in before this date (optional)
   */
  lastLoginBefore: z.string().datetime().optional(),

  /**
   * Filter users who last logged in after this date (optional)
   */
  lastLoginAfter: z.string().datetime().optional(),

  /**
   * Page number for pagination
   * Default: 1 (first page)
   */
  page: z.number().int().min(1).default(1),

  /**
   * Number of results per page
   * Min: 1, Max: 100, Default: 50
   */
  limit: z.number().int().min(1).max(100).default(50),

  /**
   * Field to sort by
   * Default: 'createdAt'
   */
  sortBy: userSortFieldEnum.default('createdAt'),

  /**
   * Sort direction (ascending or descending)
   * Default: 'desc' (newest first)
   */
  sortOrder: sortOrderEnum.default('desc'),
});

/**
 * TypeScript type for user search input
 */
export type SearchUsersInput = z.infer<typeof searchUsersSchema>;

// ==========================================
// USER ACTIVITY LOG SCHEMA
// ==========================================

/**
 * Schema for querying user activity logs
 *
 * Retrieves audit trail of user actions with filtering options:
 * - Date range filtering
 * - Action type filtering
 * - Resource filtering
 * - Pagination support
 *
 * @example
 * const activityQuery = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   startDate: '2024-01-01T00:00:00Z',
 *   endDate: '2024-12-31T23:59:59Z',
 *   actionType: 'login',
 *   resource: 'students',
 *   page: 1,
 *   limit: 50
 * };
 * getUserActivitySchema.parse(activityQuery);
 */
export const getUserActivitySchema = z.object({
  /**
   * UUID of the user to get activity for
   */
  userId: z.string().uuid('Invalid user ID'),

  /**
   * Start date for activity range (optional)
   * If not provided, retrieves from earliest activity
   */
  startDate: z.string().datetime().optional(),

  /**
   * End date for activity range (optional)
   * If not provided, retrieves up to current date
   */
  endDate: z.string().datetime().optional(),

  /**
   * Filter by action type (optional)
   * Examples: 'login', 'create', 'update', 'delete'
   */
  actionType: z.string().optional(),

  /**
   * Filter by resource accessed (optional)
   * Examples: 'students', 'health_records'
   */
  resource: z.string().optional(),

  /**
   * Page number for pagination
   * Default: 1 (first page)
   */
  page: z.number().int().min(1).default(1),

  /**
   * Number of results per page
   * Min: 1, Max: 100, Default: 50
   */
  limit: z.number().int().min(1).max(100).default(50),
});

/**
 * TypeScript type for getting user activity input
 */
export type GetUserActivityInput = z.infer<typeof getUserActivitySchema>;

// ==========================================
// USER EXPORT SCHEMAS
// ==========================================

/**
 * Export format enum
 *
 * Defines supported export formats for user data.
 */
export const exportFormatEnum = z.enum(['csv', 'json', 'xlsx']);

/**
 * Schema for exporting user data
 *
 * Exports user data with:
 * - Multiple format options (CSV, JSON, Excel)
 * - Optional search filters
 * - Control over inactive user inclusion
 * - Control over metadata inclusion
 *
 * @example
 * const exportParams = {
 *   format: 'xlsx',
 *   filters: {
 *     role: 'nurse',
 *     status: 'active',
 *     sortBy: 'lastName',
 *     sortOrder: 'asc'
 *   },
 *   includeInactive: false,
 *   includeMetadata: false
 * };
 * exportUsersSchema.parse(exportParams);
 */
export const exportUsersSchema = z.object({
  /**
   * Export file format
   * Default: 'csv'
   */
  format: exportFormatEnum.default('csv'),

  /**
   * Optional filters to apply (uses search schema without pagination)
   */
  filters: searchUsersSchema.omit({ page: true, limit: true }).optional(),

  /**
   * Whether to include inactive users in export
   * Default: false (only active users)
   */
  includeInactive: z.boolean().default(false),

  /**
   * Whether to include metadata fields in export
   * Default: false (exclude for cleaner exports)
   */
  includeMetadata: z.boolean().default(false),
});

/**
 * TypeScript type for user export input
 */
export type ExportUsersInput = z.infer<typeof exportUsersSchema>;

// ==========================================
// TYPE EXPORTS
// ==========================================

/**
 * TypeScript type inference exports for type-safe usage
 */
export type UserSortField = z.infer<typeof userSortFieldEnum>;
export type SortOrder = z.infer<typeof sortOrderEnum>;
export type ExportFormat = z.infer<typeof exportFormatEnum>;
