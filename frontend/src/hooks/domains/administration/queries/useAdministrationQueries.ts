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

// Re-export all user query hooks
export {
  useUsers,
  useUserDetails,
  useUserRoles,
  useUserPermissions,
} from './useUserQueries';

// Re-export all settings, department, audit, and notification query hooks
export {
  useDepartments,
  useDepartmentDetails,
  useDepartmentStaff,
  useSettings,
  useSettingDetails,
  useSystemConfigurations,
  useSystemConfiguration,
  useAuditLogs,
  useAuditLogDetails,
  useNotifications,
  useNotificationDetails,
  useUserNotifications,
} from './useSettingsQueries';

// Re-export all system query hooks
export {
  useSystemHealth,
  useUserActivity,
  useAdministrationDashboard,
  useAdministrationStats,
  useAdministrationReports,
} from './useSystemQueries';
