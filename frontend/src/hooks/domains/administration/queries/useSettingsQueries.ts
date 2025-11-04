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

// ==========================================
// RE-EXPORTS FROM MODULAR FILES
// ==========================================

// Department management queries
export {
  useDepartments,
  useDepartmentDetails,
  useDepartmentStaff,
} from './useDepartmentQueries';

// System settings and configuration queries
export {
  useSettings,
  useSettingDetails,
  useSystemConfigurations,
  useSystemConfiguration,
} from './useSystemSettingsQueries';

// Audit log and notification queries
export {
  useAuditLogs,
  useAuditLogDetails,
  useNotifications,
  useNotificationDetails,
  useUserNotifications,
} from './useAuditNotificationQueries';
