/**
 * WF-COMP-332 | export-reports.ts - Report export type definitions
 * Purpose: Type definitions for report export, sharing, and history tracking
 * Upstream: report-enums.ts, report-filters.ts, common.ts, custom-reports.ts | Dependencies: ReportType, ReportFormat, ReportFilters, CustomReportRequest, BaseEntity
 * Downstream: Export and sharing components | Called by: Report export services
 * Related: custom-reports.ts, analytics-reports.ts
 * Exports: Export requests, job status, sharing, history tracking
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Export request → Job processing → File generation → Distribution/Download
 * LLM Context: Healthcare report export and distribution management
 */

import type { BaseEntity } from '../common';
import type { ReportType, ReportFormat } from './report-enums';
import type { ReportFilters } from './report-filters';
import type { CustomReportRequest } from './custom-reports';

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
  filters?: ReportFilters;
  format?: ReportFormat;
  fileUrl?: string;
  fileSize?: number;
  generatedBy: string;
  viewCount?: number;
  downloadCount?: number;
  lastAccessedAt?: Date | string;
}
