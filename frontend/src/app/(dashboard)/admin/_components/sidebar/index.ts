/**
 * @fileoverview Admin Sidebar Components - Barrel export file
 * @module app/(dashboard)/admin/_components/sidebar
 * @category Admin - Components
 */

export { AdminNavigationMenu } from './AdminNavigationMenu';
export { SystemStatusWidget } from './SystemStatusWidget';
export { SystemAlertsPanel } from './SystemAlertsPanel';
export { AdminActivityLog } from './AdminActivityLog';
export { QuickActionsPanel } from './QuickActionsPanel';
export { SystemToolsPanel } from './SystemToolsPanel';
export { useAdminSidebar } from './useAdminSidebar';

export type {
  AdminModule,
  SystemMetric,
  QuickAction,
  SystemAlert,
  ActivityLogEntry,
  SystemTool
} from './types';

export {
  adminModules,
  systemMetrics,
  quickActions,
  systemAlerts,
  recentActivity,
  systemTools
} from './data';

export {
  getStatusColor,
  getStatusBadgeVariant,
  getMetricStatusColor,
  getAlertBackgroundColor,
  getAlertTextColor,
  getAlertIconColor,
  getActivityBackgroundColor,
  getActivityTextColor,
  getActivityIconColor
} from './utils';
