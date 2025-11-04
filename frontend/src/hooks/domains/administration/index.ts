/**
 * @fileoverview Administration domain hooks aggregation and exports
 * @module hooks/domains/administration
 * @category Hooks - Administration
 *
 * Central export point for all administration domain functionality including:
 * - Configuration (types, query keys, cache config, utility functions)
 * - Query hooks (users, departments, settings, audit logs, notifications, system health)
 * - Mutation hooks (CRUD operations, user lifecycle, bulk operations)
 *
 * This module provides comprehensive administration capabilities for:
 * - User management and RBAC
 * - Department and organizational structure
 * - System configuration and settings
 * - HIPAA-compliant audit logging
 * - System health monitoring
 * - Multi-channel notifications
 *
 * @example
 * ```typescript
 * import {
 *   // Configuration
 *   ADMINISTRATION_QUERY_KEYS,
 *   ADMINISTRATION_CACHE_CONFIG,
 *   AdminUser,
 *   invalidateUserQueries,
 *
 *   // Queries
 *   useUsers,
 *   useUserDetails,
 *   useSettings,
 *   useAuditLogs,
 *   useSystemHealth,
 *
 *   // Mutations
 *   useCreateUser,
 *   useUpdateUser,
 *   useActivateUser,
 *   useDeactivateUser
 * } from '@/hooks/domains/administration';
 * ```
 *
 * @see {@link ./config} for types and configuration
 * @see {@link ./queries/useAdministrationQueries} for query hooks
 * @see {@link ./mutations/useAdministrationMutations} for mutation hooks
 */

// Configuration, Types, and Utilities
// Re-export from modularized config files for backward compatibility
export * from './administrationQueryKeys';
export * from './administrationCacheConfig';
export * from './administrationUserTypes';
export * from './administrationDepartmentTypes';
export * from './administrationSettingsTypes';
export * from './administrationAuditTypes';
export * from './administrationNotificationTypes';
export * from './administrationSystemTypes';

// Legacy export (for backward compatibility if anything imports from ./config directly)
export * from './config';

// Query Hooks - Data Fetching
export * from './queries/useAdministrationQueries';

// Mutation Hooks - Data Modification
// Re-export from modular mutation files via mutations/index.ts
export * from './mutations';
