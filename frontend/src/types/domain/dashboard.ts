/**
 * WF-COMP-322 | dashboard.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./common | Dependencies: ./common
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Dashboard Module Types
 *
 * Type definitions for the dashboard module matching backend DashboardService.
 * These types support real-time healthcare dashboard statistics, activity feeds,
 * and data visualizations for school nurses.
 *
 * Aligned with backend: backend/src/services/dashboardService.ts
 */

import { BaseEntity } from '../core/common';

/**
 * Trend indicator for dashboard metrics
 * Represents change direction and percentage over time period (typically month-over-month)
 */
export interface TrendData {
  /** Current value as string */
  value: string;

  /** Percentage change with +/- prefix (e.g., "+12.5%", "-3.2%") */
  change: string;

  /** Visual indicator type for UI rendering */
  changeType: 'positive' | 'negative' | 'neutral';
}

/**
 * Main dashboard statistics with trend analysis
 *
 * Provides comprehensive overview of platform metrics including:
 * - Student enrollment and active count
 * - Medication management statistics
 * - Appointment scheduling metrics
 * - Incident reporting data
 * - Health alerts and notifications
 *
 * Matches backend: DashboardService.getDashboardStats()
 */
export interface DashboardStats {
  /** Total number of active students in the system */
  totalStudents: number;

  /** Count of currently active medication prescriptions */
  activeMedications: number;

  /** Number of appointments scheduled for today */
  todaysAppointments: number;

  /** Count of incident reports requiring follow-up */
  pendingIncidents: number;

  /** Number of medication doses due for administration today */
  medicationsDueToday: number;

  /** Critical health alerts requiring immediate attention (severe/life-threatening allergies) */
  healthAlerts: number;

  /** Count of recent activities in last 24 hours */
  recentActivityCount: number;

  /** Student enrollment trend with month-over-month comparison */
  studentTrend: TrendData;

  /** Active medications trend with month-over-month comparison */
  medicationTrend: TrendData;

  /** Appointments trend with month-over-month comparison */
  appointmentTrend: TrendData;
}

/**
 * Activity feed item for recent platform activity
 *
 * Displays real-time feed of:
 * - Medication administrations
 * - Incident reports
 * - Upcoming appointments
 *
 * Matches backend: DashboardService.getRecentActivities()
 */
export interface DashboardRecentActivity {
  /** Unique identifier for the activity */
  id: string;

  /** Activity type for categorization and icon display */
  type: 'medication' | 'incident' | 'appointment';

  /** Human-readable message describing the activity */
  message: string;

  /** Relative time string (e.g., "2 hours ago", "Just now") */
  time: string;

  /** Activity status for visual indicators */
  status: 'completed' | 'pending' | 'warning' | 'upcoming';
}

/**
 * Upcoming appointment widget data
 *
 * Displays prioritized list of scheduled appointments with:
 * - Student information
 * - Appointment timing
 * - Type classification
 * - Priority level for visual emphasis
 *
 * Matches backend: DashboardService.getUpcomingAppointments()
 */
export interface DashboardUpcomingAppointment {
  /** Appointment unique identifier */
  id: string;

  /** Student full name for display */
  student: string;

  /** Student ID for navigation links */
  studentId: string;

  /** Formatted time string (e.g., "2:30 PM") */
  time: string;

  /** Formatted appointment type (e.g., "Medication Administration") */
  type: string;

  /** Priority level for visual emphasis and sorting */
  priority: 'high' | 'medium' | 'low';
}

/**
 * Chart data point for time-series visualizations
 *
 * Represents a single data point in trend charts with:
 * - Temporal dimension (date)
 * - Quantitative measure (value)
 * - Optional label for tooltips
 */
export interface ChartDataPoint {
  /** Date string for x-axis positioning */
  date: string;

  /** Numeric value for y-axis plotting */
  value: number;

  /** Optional label for tooltip display */
  label?: string;
}

/**
 * Complete chart data set for dashboard visualizations
 *
 * Provides time-series data for multiple chart widgets:
 * - Student enrollment trends over time
 * - Medication administration frequency
 * - Incident report patterns
 * - Appointment scheduling trends
 *
 * Supports customizable time periods: week, month, year
 *
 * Matches backend: DashboardService.getChartData()
 */
export interface DashboardChartData {
  /** Student enrollment trend data points */
  enrollmentTrend: ChartDataPoint[];

  /** Medication administration frequency data points */
  medicationAdministration: ChartDataPoint[];

  /** Incident report frequency data points */
  incidentFrequency: ChartDataPoint[];

  /** Appointment scheduling trend data points */
  appointmentTrends: ChartDataPoint[];
}

/**
 * Health alert notification for dashboard
 *
 * Critical health information requiring nurse attention:
 * - Severe allergies
 * - Life-threatening conditions
 * - Medication interactions
 * - Overdue health requirements
 */
export interface HealthAlert extends BaseEntity {
  /** Alert type for categorization */
  type: 'allergy' | 'condition' | 'medication' | 'compliance';

  /** Severity level for visual priority */
  severity: 'low' | 'medium' | 'high' | 'critical';

  /** Student ID related to the alert */
  studentId: string;

  /** Student full name for display */
  studentName: string;

  /** Alert title/headline */
  title: string;

  /** Detailed alert message */
  message: string;

  /** Whether action is required from nurse */
  actionRequired: boolean;

  /** Whether alert has been acknowledged */
  acknowledged: boolean;

  /** Optional due date for action items */
  dueDate?: string;
}

/**
 * Quick action item for dashboard shortcuts
 *
 * Provides one-click access to common nurse workflows:
 * - Administer medication
 * - Create incident report
 * - Schedule appointment
 * - View health alerts
 */
export interface QuickAction {
  /** Unique action identifier */
  id: string;

  /** Action label for button display */
  label: string;

  /** Icon name for visual representation */
  icon: string;

  /** Route path for navigation */
  route: string;

  /** Optional badge count for pending items */
  badgeCount?: number;

  /** Action category for grouping */
  category: 'medication' | 'appointment' | 'incident' | 'health';
}

/**
 * API Request Types
 */

/**
 * Query parameters for recent activities endpoint
 */
export interface RecentActivitiesParams {
  /** Maximum number of activities to return (1-20) */
  limit?: number;
}

/**
 * Query parameters for upcoming appointments endpoint
 */
export interface UpcomingAppointmentsParams {
  /** Maximum number of appointments to return (1-20) */
  limit?: number;
}

/**
 * Query parameters for chart data endpoint
 */
export interface ChartDataParams {
  /** Time period for data aggregation */
  period?: 'week' | 'month' | 'year';
}

/**
 * API Response Types
 *
 * These wrap the backend response structure matching Hapi's response format
 */

/**
 * Dashboard statistics API response
 * Matches: GET /api/dashboard/stats
 */
export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
}

/**
 * Recent activities API response
 * Matches: GET /api/dashboard/recent-activities
 */
export interface RecentActivitiesResponse {
  success: boolean;
  data: {
    activities: DashboardRecentActivity[];
  };
}

/**
 * Upcoming appointments API response
 * Matches: GET /api/dashboard/upcoming-appointments
 */
export interface UpcomingAppointmentsResponse {
  success: boolean;
  data: {
    appointments: DashboardUpcomingAppointment[];
  };
}

/**
 * Chart data API response
 * Matches: GET /api/dashboard/chart-data
 */
export interface ChartDataResponse {
  success: boolean;
  data: DashboardChartData;
}

/**
 * Error response structure
 */
export interface DashboardErrorResponse {
  success: false;
  error: {
    message: string;
  };
}

/**
 * Widget configuration for customizable dashboard
 * Future enhancement for user-customizable widget layouts
 */
export interface DashboardWidgetConfig {
  id: string;
  type: 'stats' | 'chart' | 'activities' | 'appointments' | 'alerts';
  title: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  visible: boolean;
  refreshInterval?: number; // in seconds
}

/**
 * Complete dashboard data aggregation
 * Used for single API call to fetch all dashboard data
 */
export interface CompleteDashboardData {
  stats: DashboardStats;
  recentActivities: DashboardRecentActivity[];
  upcomingAppointments: DashboardUpcomingAppointment[];
  healthAlerts: HealthAlert[];
  quickActions: QuickAction[];
}

/**
 * Real-time update payload for WebSocket/Socket.io
 * Future enhancement for real-time dashboard updates
 */
export interface DashboardRealtimeUpdate {
  type: 'stats' | 'activity' | 'appointment' | 'alert';
  action: 'create' | 'update' | 'delete';
  data: DashboardStats | DashboardRecentActivity | DashboardUpcomingAppointment | HealthAlert;
  timestamp: string;
}
