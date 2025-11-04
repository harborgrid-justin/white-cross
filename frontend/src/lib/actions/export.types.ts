/**
 * @fileoverview Export Type Definitions
 * @module app/export/types
 *
 * TypeScript interfaces, types, and constants for export operations.
 * This module contains no runtime code, only type definitions.
 */

// ==========================================
// CONFIGURATION CONSTANTS
// ==========================================

/**
 * Custom cache tags for export operations
 */
export const EXPORT_CACHE_TAGS = {
  JOBS: 'export-jobs',
  TEMPLATES: 'export-templates',
  HISTORY: 'export-history',
  FILES: 'export-files',
  SCHEDULES: 'export-schedules',
} as const;

// ==========================================
// ACTION RESULT TYPE
// ==========================================

/**
 * Standard action result wrapper for server actions
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

// ==========================================
// EXPORT JOB TYPES
// ==========================================

/**
 * Export Job entity
 * Represents a data export operation with status tracking
 */
export interface ExportJob {
  id: string;
  name: string;
  description: string;
  type: 'csv' | 'excel' | 'pdf' | 'json' | 'xml';
  format: 'students' | 'medications' | 'incidents' | 'inventory' | 'communications' | 'analytics' | 'custom';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  filters: Record<string, unknown>;
  columns: string[];
  totalRecords: number;
  processedRecords: number;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  createdBy: string;
  createdByName: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data for creating a new export job
 */
export interface CreateExportJobData {
  name: string;
  description?: string;
  type: ExportJob['type'];
  format: ExportJob['format'];
  filters?: Record<string, unknown>;
  columns?: string[];
  scheduledAt?: string;
  templateId?: string;
}

/**
 * Data for updating an export job
 */
export interface UpdateExportJobData {
  name?: string;
  description?: string;
  filters?: Record<string, unknown>;
  columns?: string[];
  scheduledAt?: string;
  status?: ExportJob['status'];
}

// ==========================================
// EXPORT TEMPLATE TYPES
// ==========================================

/**
 * Export Template entity
 * Reusable template for export configurations
 */
export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  type: ExportJob['type'];
  format: ExportJob['format'];
  defaultFilters: Record<string, unknown>;
  defaultColumns: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data for creating a new export template
 */
export interface CreateExportTemplateData {
  name: string;
  description: string;
  type: ExportJob['type'];
  format: ExportJob['format'];
  defaultFilters?: Record<string, unknown>;
  defaultColumns?: string[];
  isActive?: boolean;
}

/**
 * Data for updating an export template
 */
export interface UpdateExportTemplateData {
  name?: string;
  description?: string;
  defaultFilters?: Record<string, unknown>;
  defaultColumns?: string[];
  isActive?: boolean;
}

// ==========================================
// FILTER AND ANALYTICS TYPES
// ==========================================

/**
 * Filters for querying export jobs
 */
export interface ExportFilters {
  type?: ExportJob['type'];
  format?: ExportJob['format'];
  status?: ExportJob['status'];
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Export analytics data
 */
export interface ExportAnalytics {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  averageProcessingTime: number;
  totalDataExported: number;
  typeBreakdown: {
    type: ExportJob['type'];
    count: number;
    percentage: number;
  }[];
  formatBreakdown: {
    format: ExportJob['format'];
    count: number;
    percentage: number;
  }[];
  recentActivity: {
    date: string;
    completed: number;
    failed: number;
  }[];
}

/**
 * Export statistics for dashboard
 * Dashboard metrics for export operations overview
 */
export interface ExportStats {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  pendingJobs: number;
  runningJobs: number;
  totalDataExported: number;
  avgProcessingTime: number;
  recentExports: number;
  exportFormats: {
    csv: number;
    xlsx: number;
    pdf: number;
    json: number;
    xml: number;
    other: number;
  };
}
