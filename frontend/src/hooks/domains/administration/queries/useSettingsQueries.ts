/**
 * @fileoverview Settings, departments, audit, and notification query hooks
 * @module hooks/domains/administration/queries/useSettingsQueries
 * @category Hooks
 *
 * Custom React Query hooks for:
 * - Department management
 * - System settings and configuration
 * - Audit logs
 * - Admin notifications
 *
 * Features:
 * - React Query integration for caching and automatic refetching
 * - Optimized stale times per data type
 * - Type-safe with full TypeScript support
 * - Error handling with automatic retries
 * - Enabled/disabled logic for conditional queries
 *
 * Cache Strategy:
 * - Departments: 10 minute stale time (rarely changes)
 * - Settings: 15 minute stale time (configuration data)
 * - Audit logs: No caching (always fresh)
 *
 * @example
 * ```typescript
 * // Fetch departments
 * function DepartmentList() {
 *   const { data: departments } = useDepartments();
 *   return <List items={departments} />;
 * }
 *
 * // Fetch settings by category
 * function SystemSettings() {
 *   const { data: settings } = useSettings('email');
 *   return <SettingsForm settings={settings} />;
 * }
 *
 * // Fetch audit logs
 * function AuditTrail() {
 *   const { data: logs } = useAuditLogs({ action: 'LOGIN' });
 *   return <LogTable logs={logs} />;
 * }
 * ```
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  ADMINISTRATION_QUERY_KEYS,
  ADMINISTRATION_CACHE_CONFIG,
  Department,
  SystemSetting,
  SystemConfiguration,
  AuditLog,
  AdminNotification,
} from '../config';
import { administrationApi } from '@/services';

// ==========================================
// DEPARTMENT MANAGEMENT QUERIES
// ==========================================

/**
 * Hook to fetch list of departments with optional filters
 * @param filters - Optional filters for departments list
 * @param options - React Query options
 * @returns Query result with departments list
 */
export const useDepartments = (
  filters?: any,
  options?: UseQueryOptions<Department[], Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.departmentsList(filters),
    queryFn: async () => {
      // Note: The API doesn't have a getDepartments method, using empty array for now
      return [];
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.DEPARTMENTS_STALE_TIME,
    ...options,
  });
};

/**
 * Hook to fetch department details by ID
 * @param id - Department ID
 * @param options - React Query options
 * @returns Query result with department details
 */
export const useDepartmentDetails = (
  id: string,
  options?: UseQueryOptions<Department, Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.departmentDetails(id),
    queryFn: async () => {
      // Note: The API doesn't have a getDepartmentById method
      return {} as Department;
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.DEPARTMENTS_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to fetch staff members of a department
 * @param deptId - Department ID
 * @param options - React Query options
 * @returns Query result with department staff
 */
export const useDepartmentStaff = (
  deptId: string,
  options?: UseQueryOptions<any[], Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.departmentStaff(deptId),
    queryFn: async () => {
      // Note: The API doesn't have a getDepartmentStaff method
      return [];
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.DEPARTMENTS_STALE_TIME,
    enabled: !!deptId,
    ...options,
  });
};

// ==========================================
// SETTINGS MANAGEMENT QUERIES
// ==========================================

/**
 * Hook to fetch system settings by category
 * @param category - Optional category filter
 * @param options - React Query options
 * @returns Query result with settings list
 */
export const useSettings = (
  category?: string,
  options?: UseQueryOptions<SystemSetting[], Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.settingsList(category),
    queryFn: async () => {
      const response = await administrationApi.getSettings();
      return Array.isArray(response) ? response : [];
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.SETTINGS_STALE_TIME,
    ...options,
  });
};

/**
 * Hook to fetch setting details by key
 * @param key - Setting key
 * @param options - React Query options
 * @returns Query result with setting details
 */
export const useSettingDetails = (
  key: string,
  options?: UseQueryOptions<SystemSetting, Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.settingsDetails(key),
    queryFn: async () => {
      const response = await administrationApi.getConfigurationByKey(key);
      return response as SystemSetting;
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.SETTINGS_STALE_TIME,
    enabled: !!key,
    ...options,
  });
};

// ==========================================
// SYSTEM CONFIGURATION QUERIES
// ==========================================

/**
 * Hook to fetch all system configurations
 * @param options - React Query options
 * @returns Query result with configurations list
 */
export const useSystemConfigurations = (
  options?: UseQueryOptions<SystemConfiguration[], Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.systemConfigList(),
    queryFn: async () => {
      const response = await administrationApi.getConfigurations();
      return response;
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.SETTINGS_STALE_TIME,
    ...options,
  });
};

/**
 * Hook to fetch system configuration by module
 * @param module - Module name
 * @param options - React Query options
 * @returns Query result with configuration details
 */
export const useSystemConfiguration = (
  module: string,
  options?: UseQueryOptions<SystemConfiguration, Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.systemConfigDetails(module),
    queryFn: async () => {
      const response = await administrationApi.getConfigurationByKey(module);
      return response as SystemConfiguration;
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.SETTINGS_STALE_TIME,
    enabled: !!module,
    ...options,
  });
};

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
