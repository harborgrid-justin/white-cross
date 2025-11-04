/**
 * Type definitions for Report Export functionality
 */

/**
 * Export format types
 */
export type ExportFormat = 'pdf' | 'csv' | 'xlsx' | 'json' | 'xml' | 'png' | 'jpeg' | 'svg';

/**
 * Export destination types
 */
export type ExportDestination = 'download' | 'email' | 'cloud' | 'ftp' | 'api';

/**
 * Export status types
 */
export type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

/**
 * Export priority levels
 */
export type ExportPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Export settings interface
 */
export interface ExportSettings {
  includeCharts: boolean;
  includeData: boolean;
  includeHeaders: boolean;
  includeFooters: boolean;
  pageOrientation?: 'portrait' | 'landscape';
  pageSize?: 'A4' | 'A3' | 'Letter' | 'Legal';
  quality?: 'low' | 'medium' | 'high';
  compression?: boolean;
}

/**
 * Export schedule interface
 */
export interface ExportSchedule {
  enabled: boolean;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  time: string;
  timezone: string;
}

/**
 * Export configuration interface
 */
export interface ExportConfig {
  id: string;
  name: string;
  reportId: string;
  reportName: string;
  format: ExportFormat;
  destination: ExportDestination;
  settings: ExportSettings;
  filters: Record<string, unknown>;
  schedule?: ExportSchedule;
  recipients?: string[];
  cloudPath?: string;
  createdAt: string;
  createdBy: string;
}

/**
 * Export job interface
 */
export interface ExportJob {
  id: string;
  configId: string;
  configName: string;
  reportName: string;
  format: ExportFormat;
  status: ExportStatus;
  priority: ExportPriority;
  progress: number;
  startedAt: string;
  completedAt?: string;
  fileSize?: number;
  downloadUrl?: string;
  errorMessage?: string;
  estimatedCompletion?: string;
}

/**
 * Export template interface
 */
export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  format: ExportFormat;
  settings: ExportSettings;
  isDefault: boolean;
  usageCount: number;
  createdAt: string;
}

/**
 * Report reference interface
 */
export interface ReportReference {
  id: string;
  name: string;
  category: string;
}

/**
 * Export filter state
 */
export interface ExportFilters {
  status: ExportStatus | 'all';
  format: ExportFormat | 'all';
  priority: ExportPriority | 'all';
}
