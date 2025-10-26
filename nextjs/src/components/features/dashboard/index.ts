/**
 * Dashboard Components Index
 *
 * Export all dashboard widget and layout components
 */

// Widget Components
export { ChartWidget } from './ChartWidget';
export type { ChartWidgetProps, TimeRange } from './ChartWidget';

export { ActivityFeedWidget } from './ActivityFeedWidget';
export type {
  ActivityFeedWidgetProps,
  ActivityItem,
  ActivityType
} from './ActivityFeedWidget';

export { AlertsWidget } from './AlertsWidget';
export type { AlertsWidgetProps, Alert, AlertSeverity } from './AlertsWidget';

export { ProgressWidget } from './ProgressWidget';
export type {
  ProgressWidgetProps,
  ProgressItem,
  ProgressStatus
} from './ProgressWidget';

export { QuickActionsWidget } from './QuickActionsWidget';
export type { QuickActionsWidgetProps, QuickAction } from './QuickActionsWidget';

// Layout Components
export { DashboardCard } from './DashboardCard';
export type { DashboardCardProps } from './DashboardCard';

export { DashboardGrid } from './DashboardGrid';
export type { DashboardGridProps } from './DashboardGrid';

// Re-export StatsWidget if it exists
export { StatsWidget } from '../../../pages/dashboard/components/StatsWidget';
