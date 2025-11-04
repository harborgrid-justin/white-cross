/**
 * @fileoverview Administration domain cache configuration and utilities
 * @module hooks/domains/administration/administrationCacheConfig
 * @category Hooks - Administration
 *
 * Cache configuration constants for TanStack Query and cache invalidation utilities.
 *
 * Defines stale times (in milliseconds) for different data types based on
 * their update frequency and importance. Longer stale times reduce API calls
 * for stable data, while shorter times ensure freshness for dynamic data.
 *
 * @remarks
 * **Stale Time Strategy:**
 * - **Users (15 min):** User data changes moderately through admin actions
 * - **Departments (30 min):** Organizational structure is very stable
 * - **Settings (60 min):** System configuration rarely changes
 * - **Audit Logs (2 min):** Must stay fresh for compliance and security monitoring
 * - **Notifications (1 min):** Users expect near real-time notification updates
 *
 * **Cache vs Stale Time:**
 * - `staleTime`: How long data is considered fresh (no refetch on mount)
 * - `cacheTime`: How long unused data stays in memory (default: 5 minutes)
 *
 * **Performance Impact:**
 * - Longer stale times reduce server load and improve perceived performance
 * - Shorter stale times ensure data accuracy for critical operations
 * - Balance between freshness and performance based on use case
 *
 * @example
 * ```typescript
 * import { ADMINISTRATION_CACHE_CONFIG, invalidateUserQueries } from './administrationCacheConfig';
 * import { useQueryClient } from '@tanstack/react-query';
 *
 * // Use in custom query
 * useQuery({
 *   queryKey: ['custom-admin-query'],
 *   queryFn: fetchData,
 *   staleTime: ADMINISTRATION_CACHE_CONFIG.DEFAULT_STALE_TIME
 * });
 *
 * // Invalidate after mutation
 * const queryClient = useQueryClient();
 * invalidateUserQueries(queryClient);
 * ```
 */

import { QueryClient } from '@tanstack/react-query';
import { ADMINISTRATION_QUERY_KEYS } from './administrationQueryKeys';

/**
 * Cache configuration constants for TanStack Query.
 *
 * Defines stale times (in milliseconds) for different data types based on
 * their update frequency and importance. Longer stale times reduce API calls
 * for stable data, while shorter times ensure freshness for dynamic data.
 *
 * @remarks
 * **Stale Time Strategy:**
 * - **Users (15 min):** User data changes moderately through admin actions
 * - **Departments (30 min):** Organizational structure is very stable
 * - **Settings (60 min):** System configuration rarely changes
 * - **Audit Logs (2 min):** Must stay fresh for compliance and security monitoring
 * - **Notifications (1 min):** Users expect near real-time notification updates
 *
 * **Cache vs Stale Time:**
 * - `staleTime`: How long data is considered fresh (no refetch on mount)
 * - `cacheTime`: How long unused data stays in memory (default: 5 minutes)
 *
 * **Performance Impact:**
 * - Longer stale times reduce server load and improve perceived performance
 * - Shorter stale times ensure data accuracy for critical operations
 * - Balance between freshness and performance based on use case
 *
 * @example
 * ```typescript
 * import { ADMINISTRATION_CACHE_CONFIG } from './administrationCacheConfig';
 *
 * // Use in custom query
 * useQuery({
 *   queryKey: ['custom-admin-query'],
 *   queryFn: fetchData,
 *   staleTime: ADMINISTRATION_CACHE_CONFIG.DEFAULT_STALE_TIME
 * });
 *
 * // Override for specific needs
 * useQuery({
 *   queryKey: ['realtime-data'],
 *   queryFn: fetchRealtimeData,
 *   staleTime: 0, // Always fetch fresh
 *   cacheTime: ADMINISTRATION_CACHE_CONFIG.DEFAULT_CACHE_TIME
 * });
 * ```
 */
export const ADMINISTRATION_CACHE_CONFIG = {
  // Standard cache times
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  DEFAULT_CACHE_TIME: 10 * 60 * 1000, // 10 minutes

  // Specific configurations
  USERS_STALE_TIME: 15 * 60 * 1000, // 15 minutes
  DEPARTMENTS_STALE_TIME: 30 * 60 * 1000, // 30 minutes
  SETTINGS_STALE_TIME: 60 * 60 * 1000, // 1 hour
  AUDIT_LOGS_STALE_TIME: 2 * 60 * 1000, // 2 minutes (more dynamic)
  NOTIFICATIONS_STALE_TIME: 1 * 60 * 1000, // 1 minute
} as const;

// ===========================================
// CACHE INVALIDATION UTILITIES
// ===========================================

/**
 * Invalidates all administration domain queries.
 *
 * Triggers refetch for all queries under the 'administration' domain.
 * Use this after bulk operations or when you need to refresh all admin data.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * This is a broad invalidation that affects all admin queries including
 * users, departments, settings, audit logs, and notifications. Use more
 * specific invalidation functions when possible for better performance.
 *
 * @example
 * ```typescript
 * import { useQueryClient } from '@tanstack/react-query';
 * import { invalidateAdministrationQueries } from './administrationCacheConfig';
 *
 * function BulkAdminOperation() {
 *   const queryClient = useQueryClient();
 *
 *   const handleBulkUpdate = async () => {
 *     await performBulkOperation();
 *     // Invalidate all admin data
 *     invalidateAdministrationQueries(queryClient);
 *   };
 * }
 * ```
 *
 * @see {@link invalidateUserQueries} for user-specific invalidation
 * @see {@link invalidateDepartmentQueries} for department-specific invalidation
 */
export const invalidateAdministrationQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['administration'] });
};

/**
 * Invalidates all user-related queries.
 *
 * Triggers refetch for user lists, user details, roles, and permissions.
 * Call this after user CRUD operations to ensure UI reflects latest data.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Invalidates queries with keys starting with ['administration', 'users'].
 * This includes user lists with various filters, individual user details,
 * user roles, and user permissions.
 *
 * @example
 * ```typescript
 * const { mutate: updateUser } = useUpdateUser({
 *   onSuccess: (data) => {
 *     invalidateUserQueries(queryClient);
 *     toast.success('User updated successfully');
 *   }
 * });
 * ```
 *
 * @see {@link useUsers} for user list queries
 * @see {@link useUserDetails} for individual user queries
 */
export const invalidateUserQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.users });
};

/**
 * Invalidates all department-related queries.
 *
 * Triggers refetch for department lists, department details, and staff assignments.
 * Call this after department CRUD operations or staff changes.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Invalidates queries with keys starting with ['administration', 'departments'].
 * This includes filtered department lists, individual department details,
 * and department staff assignments.
 *
 * @example
 * ```typescript
 * const { mutate: updateDepartment } = useUpdateDepartment({
 *   onSuccess: () => {
 *     invalidateDepartmentQueries(queryClient);
 *   }
 * });
 * ```
 *
 * @see {@link useDepartments} for department list queries
 * @see {@link useDepartmentDetails} for individual department queries
 */
export const invalidateDepartmentQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.departments });
};

/**
 * Invalidates all settings and configuration queries.
 *
 * Triggers refetch for system settings and module configurations.
 * Call this after updating settings to ensure UI reflects changes.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Invalidates queries with keys starting with ['administration', 'settings'].
 * This includes settings lists by category, individual settings by key,
 * and system configurations by module.
 *
 * @example
 * ```typescript
 * const { mutate: updateSetting } = useUpdateSetting({
 *   onSuccess: () => {
 *     invalidateSettingsQueries(queryClient);
 *   }
 * });
 * ```
 *
 * @see {@link useSettings} for settings list queries
 * @see {@link useSettingDetails} for individual setting queries
 */
export const invalidateSettingsQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.settings });
};

/**
 * Invalidates all audit log queries.
 *
 * Triggers refetch for audit log lists and details. Generally not needed
 * as audit logs are append-only, but useful after bulk operations or
 * when needing to ensure latest compliance data is visible.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Audit logs have a short stale time (2 minutes) by default for compliance.
 * This function is rarely needed as queries auto-refetch frequently.
 *
 * @example
 * ```typescript
 * // Refresh audit logs after security event
 * const handleSecurityEvent = async () => {
 *   await logSecurityEvent();
 *   invalidateAuditLogQueries(queryClient);
 * };
 * ```
 *
 * @see {@link useAuditLogs} for audit log queries
 */
export const invalidateAuditLogQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.auditLogs });
};

/**
 * Invalidates all notification queries.
 *
 * Triggers refetch for notification lists and user-specific notifications.
 * Call this after creating, updating, or sending notifications.
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Notifications have a short stale time (1 minute) for freshness.
 * Invalidate after notification mutations to immediately reflect changes.
 *
 * @example
 * ```typescript
 * const { mutate: sendNotification } = useSendNotification({
 *   onSuccess: () => {
 *     invalidateNotificationQueries(queryClient);
 *     toast.success('Notification sent successfully');
 *   }
 * });
 * ```
 *
 * @see {@link useNotifications} for notification list queries
 * @see {@link useUserNotifications} for user-specific notifications
 */
export const invalidateNotificationQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.notifications });
};
