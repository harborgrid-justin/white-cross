/**
 * WF-COMP-332 | custom-reports.ts - Custom report configuration type definitions
 * Purpose: Type definitions for custom report templates and scheduled reports
 * Upstream: report-enums.ts, report-filters.ts, common.ts | Dependencies: ReportType, ReportFormat, ChartType, CustomReportFilters, BaseEntity
 * Downstream: Report builder components | Called by: Custom report generation services
 * Related: export-reports.ts, analytics-reports.ts
 * Exports: Report templates, scheduled reports, custom report requests
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Template creation → Report configuration → Schedule setup → Automated generation
 * LLM Context: Custom and scheduled healthcare report generation and management
 */

import type { BaseEntity } from '../common';
import type { ReportType, ReportFormat, ChartType } from './report-enums';
import type { ReportFilters, CustomReportFilters } from './report-filters';

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
  filters?: ReportFilters;
  generatedAt: Date | string;
  generatedBy?: string;
  expiresAt?: Date | string;
}
