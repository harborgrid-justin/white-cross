/**
 * Dashboard and Custom Report Types
 * 
 * Type definitions for dashboard metrics and custom report generation including:
 * - Real-time dashboard widgets
 * - Report templates and scheduling
 * - Export functionality
 * - Analytics and insights
 */

import type { BaseEntity } from '../../core/common';
import type { ReportType, ReportFormat, ChartType } from './enums';
import type { CustomReportFilters, DateRangeFilter } from './filters';

// ==================== Dashboard Types ====================

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
    filters?: CustomReportFilters;
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
 * Complete dashboard data structure
 */
export interface DashboardData {
  metrics: DashboardMetrics;
  recentActivity?: RecentActivity[];
  alerts?: SystemAlert[];
  upcomingAppointments?: unknown[];
  widgets?: DashboardWidget[];
  refreshedAt: Date | string;
}

// ==================== Custom Report Types ====================

/**
 * Report template definition
 */
export interface ReportTemplate extends BaseEntity {
  name: string;
  description?: string;
  reportType: ReportType | string;
  category?: string;
  filters?: CustomReportFilters;
  columns?: Array<{
    field: string;
    label: string;
    type?: string;
    format?: string;
  }>;
  charts?: Array<{
    type: ChartType;
    title: string;
    dataSource: string;
    config?: Record<string, unknown>;
  }>;
  isPublic: boolean;
  isDefault?: boolean;
  createdBy: string;
  lastUsedAt?: Date | string;
  usageCount?: number;
}

/**
 * Scheduled report configuration
 */
export interface ScheduledReport extends BaseEntity {
  templateId?: string;
  template?: ReportTemplate;
  name: string;
  description?: string;
  reportType: ReportType | string;
  filters?: CustomReportFilters;
  schedule: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
    timezone?: string;
  };
  recipients: Array<{
    email: string;
    name?: string;
    type?: string;
  }>;
  format: ReportFormat;
  isActive: boolean;
  lastRun?: Date | string;
  nextRun?: Date | string;
  createdBy: string;
}

/**
 * Custom report request payload
 */
export interface CustomReportRequest {
  reportType: ReportType | string;
  title?: string;
  description?: string;
  filters?: CustomReportFilters;
  parameters?: Record<string, unknown>;
  schedule?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    time?: string;
    recipients?: string[];
  };
}

/**
 * Report generation result
 */
export interface ReportData {
  id: string;
  reportType: ReportType | string;
  title: string;
  description?: string;
  data: unknown;
  summary?: {
    totalRecords: number;
    recordsFiltered?: number;
    aggregations?: Record<string, unknown>;
  };
  filters?: CustomReportFilters;
  generatedAt: Date | string;
  generatedBy?: string;
  expiresAt?: Date | string;
}

// ==================== Export and Sharing ====================

/**
 * Export request payload
 */
export interface ExportRequest extends CustomReportRequest {
  format: ReportFormat;
  includeCharts?: boolean;
  includeMetadata?: boolean;
  template?: string;
  pageSize?: 'A4' | 'LETTER' | 'LEGAL';
  orientation?: 'PORTRAIT' | 'LANDSCAPE';
  compression?: boolean;
}

/**
 * Export job status
 */
export interface ExportJob extends BaseEntity {
  reportType: ReportType | string;
  format: ReportFormat;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress?: number;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
  requestedBy: string;
  completedAt?: Date | string;
  expiresAt?: Date | string;
}

/**
 * Report share payload
 */
export interface ReportShareRequest {
  recipients: string[];
  message?: string;
  expiryDays?: number;
  allowDownload?: boolean;
  requireAuthentication?: boolean;
}

/**
 * Report history entry
 */
export interface ReportHistory extends BaseEntity {
  reportType: ReportType | string;
  title: string;
  filters?: CustomReportFilters;
  format?: ReportFormat;
  fileUrl?: string;
  fileSize?: number;
  generatedBy: string;
  viewCount?: number;
  downloadCount?: number;
  lastAccessedAt?: Date | string;
}
