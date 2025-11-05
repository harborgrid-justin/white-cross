/**
 * @fileoverview Dashboard Server Actions - Healthcare platform dashboard data management
 * @module app/dashboard/actions
 * @category Dashboard - Server Actions
 * @version 2.0.0
 *
 * HIPAA Compliance Features:
 * - PHI aggregation without individual identification
 * - Audit logging for dashboard access
 * - Secure health statistics compilation
 * - Emergency alert processing with proper authorization
 *
 * Dashboard Functions:
 * - getDashboardStats: Core dashboard statistics
 * - getHealthAlerts: Real-time health alerts and notifications
 * - getRecentActivities: System activity overview
 * - getSystemStatus: Platform health monitoring
 * - getDashboardData: Combined dashboard data for performance
 *
 * Module Organization:
 * This file serves as the main entry point for all dashboard functionality.
 * Implementation is organized into focused modules:
 * - dashboard.types.ts - TypeScript type definitions (no 'use server')
 * - dashboard.statistics.ts - Statistics fetching and processing (marked with 'use server')
 * - dashboard.alerts.ts - Health alerts management (marked with 'use server')
 * - dashboard.activities.ts - Recent activities tracking (marked with 'use server')
 * - dashboard.system.ts - System status monitoring (marked with 'use server')
 * - dashboard.aggregation.ts - Combined data fetching (marked with 'use server')
 * - dashboard.utils.ts - Utility functions (marked with 'use server')
 *
 * NOTE: This file does NOT have 'use server' at the file level to allow imports
 * from both Client and Server Components. Individual modules have their own
 * 'use server' directives to mark functions as server actions.
 */

// Re-export all types
export type {
  DashboardStats,
  HealthAlert,
  RecentActivity,
  SystemStatus,
  DashboardFilters
} from './dashboard.types';

// Re-export statistics functions
export { getDashboardStats } from './dashboard.statistics';

// Re-export alert functions
export { getHealthAlerts, acknowledgeHealthAlert } from './dashboard.alerts';

// Re-export activity functions
export { getRecentActivities } from './dashboard.activities';

// Re-export system status functions
export { getSystemStatus } from './dashboard.system';

// Re-export aggregation functions
export { getDashboardData } from './dashboard.aggregation';

// Re-export utility functions
export { refreshDashboardData } from './dashboard.utils';
