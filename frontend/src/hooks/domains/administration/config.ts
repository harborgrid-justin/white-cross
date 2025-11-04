/**
 * @fileoverview Administration domain configuration, types, query keys, and cache management
 * @module hooks/domains/administration/config
 * @category Hooks - Administration
 *
 * @deprecated This file has been split into smaller modules for better maintainability.
 * Please import from the specific modules or from the main index file instead:
 * - `administrationQueryKeys.ts` - Query key factory
 * - `administrationCacheConfig.ts` - Cache configuration and utilities
 * - `administrationUserTypes.ts` - User-related type definitions
 * - `administrationDepartmentTypes.ts` - Department-related type definitions
 * - `administrationSettingsTypes.ts` - Settings-related type definitions
 * - `administrationAuditTypes.ts` - Audit log type definitions
 * - `administrationNotificationTypes.ts` - Notification type definitions
 * - `administrationSystemTypes.ts` - System health type definitions
 *
 * This file now serves as a re-export for backward compatibility.
 *
 * Comprehensive configuration for the administration domain including:
 * - Type definitions for users, departments, settings, audit logs, notifications, and system health
 * - TanStack Query key factories for hierarchical cache management
 * - Cache configuration with optimized stale times per data type
 * - Utility functions for cache invalidation
 *
 * This configuration supports enterprise-grade administration features:
 * - User lifecycle management (CRUD, activation, deactivation)
 * - Role-Based Access Control (RBAC) with permissions
 * - Department and organizational hierarchy management
 * - System-wide configuration and settings
 * - HIPAA-compliant audit logging
 * - Multi-channel notification system
 * - Real-time system health monitoring
 *
 * @remarks
 * **Cache Strategy:**
 * - Users: 15 minute stale time - moderately dynamic data
 * - Departments: 30 minute stale time - rarely changes
 * - Settings: 60 minute stale time - very stable configuration
 * - Audit Logs: 2 minute stale time - highly dynamic for compliance
 * - Notifications: 1 minute stale time - needs freshness
 *
 * **RBAC Considerations:**
 * - Most operations require admin-level permissions
 * - Permission checks should use access-control domain hooks
 * - Audit logging is mandatory for HIPAA compliance
 *
 * **Query Key Hierarchy:**
 * Query keys follow a hierarchical structure enabling precise cache invalidation:
 * - `['administration', 'users']` - All user queries
 * - `['administration', 'users', 'list', filters]` - Filtered lists
 * - `['administration', 'users', 'detail', id]` - Specific entities
 *
 * @example
 * ```typescript
 * // Recommended: Import from main index
 * import {
 *   ADMINISTRATION_QUERY_KEYS,
 *   ADMINISTRATION_CACHE_CONFIG,
 *   AdminUser,
 *   invalidateUserQueries
 * } from '@/hooks/domains/administration';
 *
 * // Alternative: Import from specific modules
 * import { ADMINISTRATION_QUERY_KEYS } from '@/hooks/domains/administration/administrationQueryKeys';
 * import { AdminUser } from '@/hooks/domains/administration/administrationUserTypes';
 *
 * // Use query keys in hooks
 * const queryKey = ADMINISTRATION_QUERY_KEYS.usersList({ role: 'NURSE' });
 *
 * // Use cache config for custom stale times
 * const staleTime = ADMINISTRATION_CACHE_CONFIG.USERS_STALE_TIME;
 *
 * // Invalidate after mutation
 * invalidateUserQueries(queryClient);
 * ```
 *
 * @see {@link administrationQueryKeys} for query key definitions
 * @see {@link administrationCacheConfig} for cache configuration
 * @see {@link administrationUserTypes} for user type definitions
 * @see {@link administrationDepartmentTypes} for department type definitions
 * @see {@link administrationSettingsTypes} for settings type definitions
 * @see {@link administrationAuditTypes} for audit type definitions
 * @see {@link administrationNotificationTypes} for notification type definitions
 * @see {@link administrationSystemTypes} for system health type definitions
 */

// Re-export everything from modularized files for backward compatibility
export * from './administrationQueryKeys';
export * from './administrationCacheConfig';
export * from './administrationUserTypes';
export * from './administrationDepartmentTypes';
export * from './administrationSettingsTypes';
export * from './administrationAuditTypes';
export * from './administrationNotificationTypes';
export * from './administrationSystemTypes';
