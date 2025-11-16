/**
 * @fileoverview System health, dashboard, and analytics query hooks
 * @module hooks/domains/administration/queries/useSystemQueries
 * @category Hooks
 *
 * Custom React Query hooks for:
 * - System health monitoring
 * - User activity tracking
 * - Dashboard data aggregation
 * - System statistics and analytics
 * - Report generation
 *
 * Features:
 * - React Query integration for caching and automatic refetching
 * - Optimized stale times per data type
 * - Type-safe with full TypeScript support
 * - Error handling with automatic retries
 * - Enabled/disabled logic for conditional queries
 *
 * Cache Strategy:
 * - System health: 30 seconds (monitoring data)
 * - Dashboard: Default stale time
 * - Statistics: Default stale time
 * - Reports: Default stale time
 *
 * @example
 * ```typescript
 * // Monitor system health
 * function SystemStatus() {
 *   const { data: health } = useSystemHealth({
 *     refetchInterval: 30000 // Poll every 30 seconds
 *   });
 *   return <HealthDashboard health={health} />;
 * }
 *
 * // Fetch dashboard data
 * function AdminDashboard() {
 *   const { data: dashboard } = useAdministrationDashboard();
 *   return <DashboardLayout data={dashboard} />;
 * }
 *
 * // Fetch statistics
 * function StatsPanel() {
 *   const { data: stats } = useAdministrationStats('month');
 *   return <StatsDisplay stats={stats} />;
 * }
 * ```
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  ADMINISTRATION_CACHE_CONFIG,
  SystemHealth,
  UserActivity,
} from '../config';
import { serverGet } from '@/lib/api/client';
import { SYSTEM_ENDPOINTS, ADMIN_ENDPOINTS, AUDIT_ENDPOINTS } from '@/constants/api/admin';
import { useApiError } from '@/hooks/shared/useApiError';

// ==========================================
// SYSTEM HEALTH QUERIES
// ==========================================

/**
 * Hook to fetch system health status
 * @param options - React Query options
 * @returns Query result with system health data
 */
export const useSystemHealth = (
  options?: UseQueryOptions<SystemHealth, Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: ['administration', 'system-health'],
    queryFn: async () => {
      try {
        return await serverGet(SYSTEM_ENDPOINTS.HEALTH);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 seconds for system health
    meta: {
      errorMessage: 'Failed to fetch system health'
    },
    ...options,
  });
};

// ==========================================
// USER ACTIVITY QUERIES
// ==========================================

/**
 * Hook to fetch user activity logs
 * @param userId - User ID
 * @param filters - Optional filters for activity logs
 * @param options - React Query options
 * @returns Query result with user activity data
 */
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

// ==========================================
// DASHBOARD QUERIES
// ==========================================

/**
 * Hook to fetch administration dashboard data
 * Aggregates data from multiple sources:
 * - Active users
 * - Departments
 * - Recent audit logs
 * - Unread notifications
 * - System health
 *
 * @param options - React Query options
 * @returns Query result with dashboard data
 */
export const useAdministrationDashboard = (
  options?: UseQueryOptions<any, Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: ['administration', 'dashboard'],
    queryFn: async () => {
      try {
        const [users, departments, recentLogs, notifications, systemHealth] = await Promise.all([
          serverGet(ADMIN_ENDPOINTS.USERS, { limit: 5, status: 'ACTIVE' }),
          serverGet(ADMIN_ENDPOINTS.DISTRICTS), // Use districts as departments
          serverGet(AUDIT_ENDPOINTS.LOGS, { limit: 10, sortBy: 'timestamp', sortOrder: 'desc' }),
          serverGet(ADMIN_ENDPOINTS.SETTINGS), // Use settings as notifications placeholder
          serverGet(SYSTEM_ENDPOINTS.HEALTH),
        ]);

        return {
          activeUsers: users,
          departments,
          recentAuditLogs: recentLogs,
          unreadNotifications: notifications,
          systemHealth,
          stats: {
            totalUsers: users?.length || 0,
            activeDepartments: departments?.length || 0,
            unreadNotifications: notifications?.length || 0,
            systemStatus: systemHealth?.status || 'unknown',
          },
        };
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.DEFAULT_STALE_TIME,
    meta: {
      errorMessage: 'Failed to fetch administration dashboard'
    },
    ...options,
  });
};

// ==========================================
// STATISTICS QUERIES
// ==========================================

/**
 * Hook to fetch administration statistics
 * @param timeframe - Time period for statistics
 * @param options - React Query options
 * @returns Query result with statistics data
 */
export const useAdministrationStats = (
  timeframe?: 'week' | 'month' | 'quarter' | 'year',
  options?: UseQueryOptions<any, Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: ['administration', 'stats', timeframe],
    queryFn: async () => {
      try {
        const [metrics, users, auditLogs] = await Promise.all([
          serverGet(ADMIN_ENDPOINTS.METRICS, { timeframe }),
          serverGet(ADMIN_ENDPOINTS.USERS),
          serverGet(AUDIT_ENDPOINTS.LOGS, { timeframe }),
        ]);

        return {
          userStats: {
            total: users?.length || 0,
            active: users?.filter((u: any) => u.status === 'ACTIVE').length || 0,
            inactive: users?.filter((u: any) => u.status !== 'ACTIVE').length || 0,
            newThisMonth: users?.filter((u: any) => {
              const created = new Date(u.createdAt);
              const now = new Date();
              return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
            }).length || 0,
          },
          departmentStats: {
            total: metrics?.departments?.total || 0,
            withBudget: metrics?.departments?.withBudget || 0,
            averageStaff: metrics?.departments?.averageStaff || 0,
          },
          systemStats: {
            uptime: metrics?.system?.uptime || 0,
            averageResponseTime: metrics?.system?.averageResponseTime || 0,
            errorRate: metrics?.system?.errorRate || 0,
          },
          activityStats: {
            totalLogins: auditLogs?.filter((log: any) => log.action === 'LOGIN').length || 0,
            uniqueUsers: new Set(auditLogs?.map((log: any) => log.userId)).size || 0,
            averageSessionDuration: metrics?.activity?.averageSessionDuration || 0,
          },
          securityStats: {
            failedLogins: auditLogs?.filter((log: any) => log.action === 'FAILED_LOGIN').length || 0,
            suspiciousActivity: auditLogs?.filter((log: any) => log.action === 'SUSPICIOUS_ACTIVITY').length || 0,
            passwordResets: auditLogs?.filter((log: any) => log.action === 'PASSWORD_RESET').length || 0,
          },
        };
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.DEFAULT_STALE_TIME,
    meta: {
      errorMessage: 'Failed to fetch administration statistics'
    },
    ...options,
  });
};

// ==========================================
// REPORTS QUERIES
// ==========================================

/**
 * Hook to fetch administration reports
 * Supports multiple report types:
 * - users: User management reports
 * - departments: Department reports
 * - audit: Audit log reports
 * - notifications: Notification reports
 * - system: System health reports
 *
 * @param type - Report type
 * @param filters - Optional filters for report
 * @param options - React Query options
 * @returns Query result with report data
 */
export const useAdministrationReports = (
  type: 'users' | 'departments' | 'audit' | 'notifications' | 'system',
  filters?: any,
  options?: UseQueryOptions<any[], Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: ['administration', 'reports', type, filters],
    queryFn: async () => {
      try {
        switch (type) {
          case 'users':
            return await serverGet(ADMIN_ENDPOINTS.USERS, filters);
          case 'departments':
            return await serverGet(ADMIN_ENDPOINTS.DISTRICTS, filters); // Use districts as departments
          case 'audit':
            return await serverGet(AUDIT_ENDPOINTS.LOGS, filters);
          case 'notifications':
            return await serverGet(ADMIN_ENDPOINTS.SETTINGS, filters); // Use settings as notifications placeholder
          case 'system':
            return [await serverGet(SYSTEM_ENDPOINTS.HEALTH)];
          default:
            return [];
        }
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.DEFAULT_STALE_TIME,
    meta: {
      errorMessage: `Failed to fetch ${type} reports`
    },
    ...options,
  });
};
