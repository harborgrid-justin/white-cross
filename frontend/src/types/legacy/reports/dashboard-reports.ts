/**
 * WF-COMP-332 | dashboard-reports.ts - Dashboard metrics type definitions
 * Purpose: Type definitions for real-time dashboard data and widgets
 * Upstream: report-enums.ts, report-filters.ts, common.ts | Dependencies: ChartType, ReportFilters, BaseEntity
 * Downstream: Dashboard components | Called by: Real-time monitoring services
 * Related: performance-reports.ts, analytics-reports.ts
 * Exports: Dashboard metrics, widget configuration, alerts, recent activity
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Real-time data collection → Dashboard updates → User monitoring → Alert generation
 * LLM Context: Real-time healthcare dashboard for operational monitoring and alerts
 */

import type { BaseEntity } from '../common';
import type { ChartType } from './report-enums';
import type { ReportFilters } from './report-filters';

/**
 * Real-time dashboard metrics
 */
export interface DashboardMetrics {
  activeStudents: number;
  todaysAppointments: number;
  pendingMedications: number;
  recentIncidents: number;
  lowStockItems: number;
  activeAllergies: number;
  chronicConditions: number;
  criticalAlerts?: number;
  timestamp: Date | string;
}

/**
 * Dashboard widget data
 */
export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  data: unknown;
  config?: {
    chartType?: ChartType;
    refreshInterval?: number;
    filters?: ReportFilters;
  };
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Recent activity item
 */
export interface RecentActivity extends BaseEntity {
  type: string;
  description: string;
  userId?: string;
  userName?: string;
  priority?: string;
  status?: string;
  metadata?: Record<string, unknown>;
}

/**
 * System alert
 */
export interface SystemAlert extends BaseEntity {
  type: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  source?: string;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date | string;
  resolvedAt?: Date | string;
}

/**
 * Appointment summary for dashboard
 */
export interface DashboardAppointmentSummary {
  id: string;
  studentName: string;
  studentId: string;
  scheduledTime: Date | string;
  type: string;
  status: string;
  priority?: string;
}

/**
 * Complete dashboard data structure
 */
export interface DashboardData {
  metrics: DashboardMetrics;
  recentActivity?: RecentActivity[];
  alerts?: SystemAlert[];
  upcomingAppointments?: DashboardAppointmentSummary[];
  widgets?: DashboardWidget[];
  refreshedAt: Date | string;
}
