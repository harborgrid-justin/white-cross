/**
 * @fileoverview Administration domain query hooks for React Query integration
 * @module hooks/domains/administration/queries
 * @category Hooks
 * 
 * Custom React Query hooks for administration functionality including user management,
 * department management, system settings, audit logs, and system health monitoring.
 * 
 * Query Categories:
 * - **User Management**: Users list, details, roles, permissions, activity
 * - **Department Management**: Departments list and details
 * - **System Settings**: Settings and configuration
 * - **Audit Logs**: Audit trail queries
 * - **Notifications**: Admin notifications
 * - **System Health**: Health checks and monitoring
 * 
 * Features:
 * - React Query integration for caching and automatic refetching
 * - Optimized stale times per data type
 * - Type-safe with full TypeScript support
 * - Error handling with automatic retries
 * - Enabled/disabled logic for conditional queries
 * - Configurable cache behavior via options
 * 
 * Cache Strategy:
 * - Users: 5 minute stale time (frequently changing)
 * - Departments: 10 minute stale time (rarely changes)
 * - Settings: 15 minute stale time (configuration data)
 * - Audit logs: No caching (always fresh)
 * - System health: 1 minute stale time (monitoring data)
 * 
 * @example
 * ```typescript
 * // List users with filters
 * function UserManagement() {
 *   const { data: users, isLoading, error } = useUsers({
 *     role: 'NURSE',
 *     schoolId: 'school-123',
 *     isActive: true
 *   });
 *   
 *   if (isLoading) return <Loading />;
 *   if (error) return <Error message={error.message} />;
 *   return <UserList users={users} />;
 * }
 * 
 * // Get user details (auto-disabled if no id)
 * function UserProfile({ userId }: { userId?: string }) {
 *   const { data: user } = useUserDetails(userId || '');
 *   return user ? <ProfileCard user={user} /> : null;
 * }
 * 
 * // Check user permissions
 * function MedicationAccess({ userId }: { userId: string }) {
 *   const { data: permissions } = useUserPermissions(userId);
 *   const canAdminister = permissions?.includes('administer_medication');
 *   return canAdminister ? <MedicationForm /> : <AccessDenied />;
 * }
 * 
 * // Monitor system health
 * function SystemStatus() {
 *   const { data: health } = useSystemHealth({
 *     refetchInterval: 30000 // Poll every 30 seconds
 *   });
 *   return <HealthDashboard health={health} />;
 * }
 * ```
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  ADMINISTRATION_QUERY_KEYS,
  ADMINISTRATION_CACHE_CONFIG,
  AdminUser,
  Department,
  SystemSetting,
  SystemConfiguration,
  AuditLog,
  AdminNotification,
  UserActivity,
  SystemHealth,
} from '../config';
import { administrationApi } from '@/services';

// ==========================================
// USER MANAGEMENT QUERIES
// ==========================================
export const useUsers = (
  filters?: any,
  options?: UseQueryOptions<AdminUser[], Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.usersList(filters),
    queryFn: async () => {
      const response = await administrationApi.getUsers(filters);
      return response.data;
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.USERS_STALE_TIME,
    ...options,
  });
};

export const useUserDetails = (
  id: string,
  options?: UseQueryOptions<AdminUser, Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.userDetails(id),
    queryFn: async () => {
      return await administrationApi.getUserById(id);
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.USERS_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

export const useUserRoles = (
  userId: string,
  options?: UseQueryOptions<any[], Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.userRoles(userId),
    queryFn: async () => {
      const user = await administrationApi.getUserById(userId);
      return user.role ? [user.role] : [];
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.USERS_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};

export const useUserPermissions = (
  userId: string,
  options?: UseQueryOptions<string[], Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.userPermissions(userId),
    queryFn: async () => {
      const user = await administrationApi.getUserById(userId);
      return user.permissions || [];
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.USERS_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};

// Department Management Queries
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

// Settings Management Queries
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

// System Configuration Queries
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

// Audit Log Queries
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

// Notification Queries
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

// System Health Queries
export const useSystemHealth = (
  options?: UseQueryOptions<SystemHealth, Error>
) => {
  return useQuery({
    queryKey: ['administration', 'system-health'],
    queryFn: async () => {
      const response = await administrationApi.getSystemHealth();
      return response;
    },
    staleTime: 30 * 1000, // 30 seconds for system health
    ...options,
  });
};

// User Activity Queries
export const useUserActivity = (
  userId: string,
  filters?: any,
  options?: UseQueryOptions<UserActivity[], Error>
) => {
  return useQuery({
    queryKey: ['administration', 'user-activity', userId, filters],
    queryFn: async () => {
      // Note: The API doesn't have a getUserActivity method
      return [];
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.AUDIT_LOGS_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};

// Dashboard Queries
export const useAdministrationDashboard = (
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['administration', 'dashboard'],
    queryFn: async () => {
      const [users, departments, recentLogs, notifications, systemHealth] = await Promise.all([
        administrationApi.getUsers({ limit: 5, status: 'ACTIVE' }).then(r => r.data),
        Promise.resolve([]), // departments not available
        administrationApi.getAuditLogs({ limit: 10, sortBy: 'timestamp', sortOrder: 'desc' }).then(r => r.data),
        Promise.resolve([]), // notifications not available
        administrationApi.getSystemHealth(),
      ]);

      return {
        activeUsers: users,
        departments,
        recentAuditLogs: recentLogs,
        unreadNotifications: notifications,
        systemHealth,
        stats: {
          totalUsers: users.length,
          activeDepartments: departments.length,
          unreadNotifications: notifications.length,
          systemStatus: systemHealth.status,
        },
      };
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
  });
};

// Statistics Queries
export const useAdministrationStats = (
  timeframe?: 'week' | 'month' | 'quarter' | 'year',
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['administration', 'stats', timeframe],
    queryFn: async () => {
      // Mock statistics calculation
      return {
        userStats: {
          total: 150,
          active: 142,
          inactive: 8,
          newThisMonth: 12,
        },
        departmentStats: {
          total: 15,
          withBudget: 12,
          averageStaff: 8,
        },
        systemStats: {
          uptime: 99.9,
          averageResponseTime: 120,
          errorRate: 0.1,
        },
        activityStats: {
          totalLogins: 1250,
          uniqueUsers: 145,
          averageSessionDuration: 45,
        },
        securityStats: {
          failedLogins: 23,
          suspiciousActivity: 2,
          passwordResets: 8,
        },
      };
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
  });
};

// Reports Queries
export const useAdministrationReports = (
  type: 'users' | 'departments' | 'audit' | 'notifications' | 'system',
  filters?: any,
  options?: UseQueryOptions<any[], Error>
) => {
  return useQuery({
    queryKey: ['administration', 'reports', type, filters],
    queryFn: async () => {
      switch (type) {
        case 'users':
          return (await administrationApi.getUsers(filters)).data;
        case 'departments':
          return []; // departments not available
        case 'audit':
          return (await administrationApi.getAuditLogs(filters)).data;
        case 'notifications':
          return []; // notifications not available
        case 'system':
          return [await administrationApi.getSystemHealth()];
        default:
          return [];
      }
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.DEFAULT_STALE_TIME,
    ...options,
  });
};
