/**
 * @fileoverview Shared types for Reports components
 * @module app/(dashboard)/reports/_components/types
 * @category Reports - Types
 */

import type { LucideIcon } from 'lucide-react';

/**
 * Report category classification
 */
export type ReportCategory =
  | 'HEALTH'
  | 'COMPLIANCE'
  | 'OPERATIONAL'
  | 'FINANCIAL'
  | 'CUSTOM';

/**
 * Report generation type
 */
export type ReportType =
  | 'SCHEDULED'
  | 'ON_DEMAND'
  | 'AUTOMATED';

/**
 * Report execution status
 */
export type ReportStatus =
  | 'COMPLETED'
  | 'PROCESSING'
  | 'SCHEDULED'
  | 'FAILED'
  | 'DRAFT';

/**
 * Report priority level
 */
export type ReportPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT';

/**
 * Badge variant type
 */
export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';

/**
 * Core report interface
 */
export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  type: ReportType;
  status: ReportStatus;
  priority: ReportPriority;
  createdAt: string;
  updatedAt: string;
  generatedBy: string;
  department: string;
  size?: string;
  downloadCount: number;
  schedule?: string;
  nextRun?: string;
  recipients?: string[];
  tags: string[];
}

/**
 * Report template interface
 */
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
  parameters: number;
  lastUsed?: string;
  useCount: number;
}

/**
 * Reports summary statistics
 */
export interface ReportsSummary {
  totalReports: number;
  completedToday: number;
  scheduledReports: number;
  failedReports: number;
  totalDownloads: number;
  avgProcessingTime: number;
}

/**
 * Search parameters for reports page
 */
export interface ReportsSearchParams {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  status?: string;
  dateRange?: string;
  sortBy?: string;
  sortOrder?: string;
}

/**
 * Props for ReportsContent component
 */
export interface ReportsContentProps {
  searchParams: ReportsSearchParams;
}

/**
 * Props for ReportsSummary component
 */
export interface ReportsSummaryProps {
  summary: ReportsSummary;
  loading?: boolean;
}

/**
 * Props for ReportTemplates component
 */
export interface ReportTemplatesProps {
  templates: ReportTemplate[];
  loading?: boolean;
  onTemplateSelect?: (templateId: string) => void;
}

/**
 * Props for ReportHistory component
 */
export interface ReportHistoryProps {
  reports: Report[];
  loading?: boolean;
  selectedReports: Set<string>;
  onToggleSelection: (reportId: string) => void;
  onRefresh?: () => void;
}

/**
 * Props for ReportActions component
 */
export interface ReportActionsProps {
  selectedCount: number;
  onBulkDownload?: () => void;
  onBulkEmail?: () => void;
  onBulkDelete?: () => void;
}
