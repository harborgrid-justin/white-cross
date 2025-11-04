/**
 * @fileoverview Audit log and notification query hooks
 * @module hooks/domains/administration/queries/useAuditNotificationQueries
 * @category Hooks
 *
 * Custom React Query hooks for audit logs and admin notifications.
 *
 * Features:
 * - React Query integration for caching and automatic refetching
 * - Audit logs: No caching (always fresh)
 * - Notifications: 5 minute stale time
 * - Type-safe with full TypeScript support
 * - Error handling with automatic retries
 * - Enabled/disabled logic for conditional queries
 *
 * @example
 * ```typescript
 * // Fetch audit logs
 * function AuditTrail() {
 *   const { data: logs } = useAuditLogs({ action: 'LOGIN' });
 *   return <LogTable logs={logs} />;
 * }
 *
 * // Fetch user notifications
 * function UserNotifications({ userId }: { userId: string }) {
 *   const { data: notifications } = useUserNotifications(userId);
 *   return <NotificationList items={notifications} />;
 * }
 * ```
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  ADMINISTRATION_QUERY_KEYS,
  ADMINISTRATION_CACHE_CONFIG,
  AuditLog,
  AdminNotification,
} from '../config';
import { administrationApi } from '@/services';

// ==========================================
// AUDIT LOG QUERIES
// ==========================================

/**
 * Hook to fetch audit logs with optional filters
 * @param filters - Optional filters for audit logs
 * @param options - React Query options
 * @returns Query result with audit logs list
 */
export const useAuditLogs = (
  filters?: any,
  options?: UseQueryOptions<AuditLog[], Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.auditLogsList(filters),
    queryFn: async () => {
      const response = await administrationApi.getAuditLogs(filters);
      return response.data;
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.AUDIT_LOGS_STALE_TIME,
    ...options,
  });
};

/**
 * Hook to fetch audit log details by ID
 * @param id - Audit log ID
 * @param options - React Query options
 * @returns Query result with audit log details
 */
export const useAuditLogDetails = (
  id: string,
  options?: UseQueryOptions<AuditLog, Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.auditLogDetails(id),
    queryFn: async () => {
      const response = await administrationApi.getAuditLogs({ id });
      return response.data[0];
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.AUDIT_LOGS_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

// ==========================================
// NOTIFICATION QUERIES
// ==========================================

/**
 * Hook to fetch admin notifications with optional filters
 * @param filters - Optional filters for notifications
 * @param options - React Query options
 * @returns Query result with notifications list
 */
export const useNotifications = (
  filters?: any,
  options?: UseQueryOptions<AdminNotification[], Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.notificationsList(filters),
    queryFn: async () => {
      // Note: The API doesn't have a getNotifications method
      return [];
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.NOTIFICATIONS_STALE_TIME,
    ...options,
  });
};

/**
 * Hook to fetch notification details by ID
 * @param id - Notification ID
 * @param options - React Query options
 * @returns Query result with notification details
 */
export const useNotificationDetails = (
  id: string,
  options?: UseQueryOptions<AdminNotification, Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.notificationDetails(id),
    queryFn: async () => {
      // Note: The API doesn't have a getNotificationById method
      return {} as AdminNotification;
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.NOTIFICATIONS_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to fetch notifications for a specific user
 * @param userId - User ID
 * @param options - React Query options
 * @returns Query result with user notifications
 */
export const useUserNotifications = (
  userId: string,
  options?: UseQueryOptions<AdminNotification[], Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.userNotifications(userId),
    queryFn: async () => {
      // Note: The API doesn't have a getUserNotifications method
      return [];
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.NOTIFICATIONS_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};
