/**
 * @fileoverview Administration domain query keys for TanStack Query
 * @module hooks/domains/administration/administrationQueryKeys
 * @category Hooks - Administration
 *
 * Hierarchical query keys for TanStack Query cache management.
 *
 * Provides factory functions for generating consistent query keys across
 * the administration domain. The hierarchical structure enables efficient
 * cache invalidation at any level of specificity.
 *
 * @remarks
 * - All keys start with ['administration'] for domain isolation
 * - List keys include filters for cache differentiation
 * - Detail keys include entity IDs for specific cache entries
 * - Related entity keys (e.g., userRoles) are nested under parent
 *
 * **Query Key Hierarchy:**
 * Query keys follow a hierarchical structure enabling precise cache invalidation:
 * - `['administration', 'users']` - All user queries
 * - `['administration', 'users', 'list', filters]` - Filtered lists
 * - `['administration', 'users', 'detail', id]` - Specific entities
 *
 * @example
 * ```typescript
 * import { ADMINISTRATION_QUERY_KEYS } from './administrationQueryKeys';
 *
 * // Generate query keys
 * const allUsersKey = ADMINISTRATION_QUERY_KEYS.users;
 * const filteredUsersKey = ADMINISTRATION_QUERY_KEYS.usersList({ role: 'NURSE', isActive: true });
 * const userDetailKey = ADMINISTRATION_QUERY_KEYS.userDetails('user-123');
 * const userRolesKey = ADMINISTRATION_QUERY_KEYS.userRoles('user-123');
 *
 * // Use in query
 * useQuery({
 *   queryKey: filteredUsersKey,
 *   queryFn: () => fetchUsers({ role: 'NURSE', isActive: true })
 * });
 * ```
 */

/**
 * Hierarchical query keys for TanStack Query cache management.
 *
 * Provides factory functions for generating consistent query keys across
 * the administration domain. The hierarchical structure enables efficient
 * cache invalidation at any level of specificity.
 *
 * @remarks
 * - All keys start with ['administration'] for domain isolation
 * - List keys include filters for cache differentiation
 * - Detail keys include entity IDs for specific cache entries
 * - Related entity keys (e.g., userRoles) are nested under parent
 *
 * @example
 * ```typescript
 * // Generate query keys
 * const allUsersKey = ADMINISTRATION_QUERY_KEYS.users;
 * const filteredUsersKey = ADMINISTRATION_QUERY_KEYS.usersList({ role: 'NURSE', isActive: true });
 * const userDetailKey = ADMINISTRATION_QUERY_KEYS.userDetails('user-123');
 * const userRolesKey = ADMINISTRATION_QUERY_KEYS.userRoles('user-123');
 *
 * // Use in query
 * useQuery({
 *   queryKey: filteredUsersKey,
 *   queryFn: () => fetchUsers({ role: 'NURSE', isActive: true })
 * });
 * ```
 */
export const ADMINISTRATION_QUERY_KEYS = {
  // Users
  users: ['administration', 'users'] as const,
  usersList: (filters?: any) => [...ADMINISTRATION_QUERY_KEYS.users, 'list', filters] as const,
  userDetails: (id: string) => [...ADMINISTRATION_QUERY_KEYS.users, 'detail', id] as const,
  userRoles: (userId: string) => [...ADMINISTRATION_QUERY_KEYS.users, userId, 'roles'] as const,
  userPermissions: (userId: string) => [...ADMINISTRATION_QUERY_KEYS.users, userId, 'permissions'] as const,

  // Departments
  departments: ['administration', 'departments'] as const,
  departmentsList: (filters?: any) => [...ADMINISTRATION_QUERY_KEYS.departments, 'list', filters] as const,
  departmentDetails: (id: string) => [...ADMINISTRATION_QUERY_KEYS.departments, 'detail', id] as const,
  departmentStaff: (deptId: string) => [...ADMINISTRATION_QUERY_KEYS.departments, deptId, 'staff'] as const,

  // Settings
  settings: ['administration', 'settings'] as const,
  settingsList: (category?: string) => [...ADMINISTRATION_QUERY_KEYS.settings, 'list', category] as const,
  settingsDetails: (key: string) => [...ADMINISTRATION_QUERY_KEYS.settings, 'detail', key] as const,

  // System Configuration
  systemConfig: ['administration', 'system-config'] as const,
  systemConfigList: () => [...ADMINISTRATION_QUERY_KEYS.systemConfig, 'list'] as const,
  systemConfigDetails: (module: string) => [...ADMINISTRATION_QUERY_KEYS.systemConfig, 'detail', module] as const,

  // Audit Logs
  auditLogs: ['administration', 'audit-logs'] as const,
  auditLogsList: (filters?: any) => [...ADMINISTRATION_QUERY_KEYS.auditLogs, 'list', filters] as const,
  auditLogDetails: (id: string) => [...ADMINISTRATION_QUERY_KEYS.auditLogs, 'detail', id] as const,

  // Notifications
  notifications: ['administration', 'notifications'] as const,
  notificationsList: (filters?: any) => [...ADMINISTRATION_QUERY_KEYS.notifications, 'list', filters] as const,
  notificationDetails: (id: string) => [...ADMINISTRATION_QUERY_KEYS.notifications, 'detail', id] as const,
  userNotifications: (userId: string) => [...ADMINISTRATION_QUERY_KEYS.notifications, 'user', userId] as const,
} as const;
