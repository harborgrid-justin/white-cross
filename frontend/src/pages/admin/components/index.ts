/**
 * WF-COMP-276 | index.ts - Admin Module Components Exports
 * Purpose: Centralized exports for admin functionality components
 * Last Updated: 2025-10-24 | File Type: .ts
 */

// =====================================================
// CORE ADMIN COMPONENTS
// =====================================================

export { default as AdminDashboard } from './AdminDashboard';
export { default as SystemSettings } from './SystemSettings';
export { default as UserManagement } from './UserManagement';
export { default as UsersList } from './UsersList';
export { default as UserCard } from './UserCard';
export { default as CreateUserForm } from './CreateUserForm';
export { default as EditUserForm } from './EditUserForm';
export { default as UserDetails } from './UserDetails';
export { default as UserProfile } from './UserProfile';
export { default as UserActivity } from './UserActivity';

// =====================================================
// SCHOOL & DISTRICT MANAGEMENT
// =====================================================

export { default as SchoolManagement } from './SchoolManagement';
export { default as SchoolsList } from './SchoolsList';
export { default as SchoolCard } from './SchoolCard';
export { default as SchoolForm } from './SchoolForm';
export { default as SchoolDetails } from './SchoolDetails';
export { default as DistrictManagement } from './DistrictManagement';
export { default as DistrictsList } from './DistrictsList';
export { default as DistrictCard } from './DistrictCard';
export { default as DistrictForm } from './DistrictForm';
export { default as DistrictDetails } from './DistrictDetails';

// =====================================================
// SYSTEM MONITORING & LOGS
// =====================================================

export { default as SystemLogs } from './SystemLogs';
export { default as AuditLogs } from './AuditLogs';
export { default as ErrorLogs } from './ErrorLogs';
export { default as ActivityMonitor } from './ActivityMonitor';
export { default as SystemHealth } from './SystemHealth';

// =====================================================
// DATABASE & MAINTENANCE
// =====================================================

export { default as DatabaseManagement } from './DatabaseManagement';
export { default as BackupRestore } from './BackupRestore';
export { default as DataMigration } from './DataMigration';
export { default as SystemMaintenance } from './SystemMaintenance';

// =====================================================
// CONFIGURATION & SETTINGS
// =====================================================

export { default as ConfigurationManager } from './ConfigurationManager';
export { default as FeatureFlags } from './FeatureFlags';
export { default as APIManagement } from './APIManagement';
export { default as IntegrationSettings } from './IntegrationSettings';

// =====================================================
// NOTIFICATIONS & COMMUNICATION
// =====================================================

export { default as NotificationSettings } from './NotificationSettings';
export { default as EmailTemplates } from './EmailTemplates';
export { default as SMSTemplates } from './SMSTemplates';
export { default as AlertConfiguration } from './AlertConfiguration';

// =====================================================
// SECURITY & ACCESS CONTROL
// =====================================================

export { default as SecuritySettings } from './SecuritySettings';
export { default as PasswordPolicies } from './PasswordPolicies';
export { default as SessionManagement } from './SessionManagement';
export { default as IPWhitelist } from './IPWhitelist';

// =====================================================
// ANALYTICS & REPORTING
// =====================================================

export { default as SystemStatistics } from './SystemStatistics';
export { default as UsageAnalytics } from './UsageAnalytics';
export { default as PerformanceMetrics } from './PerformanceMetrics';
export { default as SystemReports } from './SystemReports';

// =====================================================
// INVENTORY COMPONENTS
// =====================================================

export { default as InventoryAlerts } from './InventoryAlerts';
export { default as InventoryTabs } from './InventoryTabs';
export { default as InventoryStatistics } from './InventoryStatistics';
export { default as InventoryLoadingState } from './InventoryLoadingState';
export { default as InventoryHeader } from './InventoryHeader';

// =====================================================
// MAIN PAGE COMPONENT RE-EXPORTS
// These exports reference the main page components from the parent directory
// and make them available for route imports
// =====================================================

/**
 * AdminUsers - Re-export of Users page component
 * Used in admin routes for user management page
 */
export { default as AdminUsers } from '../Users';

/**
 * AdminRoles - Re-export of Roles page component
 * Used in admin routes for roles management page
 */
export { default as AdminRoles } from '../Roles';

/**
 * AdminPermissions - Re-export of Permissions page component
 * Used in admin routes for permissions management page
 */
export { default as AdminPermissions } from '../Permissions';

/**
 * AdminSettings - Re-export of Settings page component
 * Used in admin routes for admin settings page
 */
export { default as AdminSettings } from '../Settings';

/**
 * AdminInventory - Re-export of Inventory page component
 * Used in admin routes for inventory management page
 */
export { default as AdminInventory } from '../Inventory';

/**
 * AdminReports - Re-export of Reports page component
 * Used in admin routes for reports page
 */
export { default as AdminReports } from '../Reports';
