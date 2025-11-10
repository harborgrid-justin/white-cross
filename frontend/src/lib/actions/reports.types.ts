/**
 * @fileoverview Report Type Definitions
 * @module lib/actions/reports/types
 *
 * TypeScript type definitions and interfaces for the report management system.
 * Includes report models, DTOs, filters, and analytics types.
 *
 * Note: Runtime values (constants) are in reports.constants.ts
 */

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

export interface Report {
  id: string;
  name: string;
  description: string;
  type: 'compliance' | 'health' | 'immunization' | 'incident' | 'medication' | 'student' | 'analytics' | 'custom';
  category: 'regulatory' | 'operational' | 'financial' | 'clinical' | 'administrative';
  status: 'draft' | 'generating' | 'completed' | 'failed' | 'scheduled';
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'html';
  parameters: Record<string, unknown>;
  filters: Record<string, unknown>;
  createdBy: string;
  createdByName: string;
  generatedAt?: string;
  completedAt?: string;
  downloadUrl?: string;
  fileSize?: number;
  recordCount?: number;
  isScheduled: boolean;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
    timezone: string;
    isActive: boolean;
    nextRun?: string;
  };
  recipients: string[];
  tags: string[];
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: Report['type'];
  category: Report['category'];
  defaultFormat: Report['format'];
  parameters: {
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'select';
    label: string;
    required: boolean;
    defaultValue?: unknown;
    options?: { value: string; label: string }[];
  }[];
  filters: {
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
    label: string;
    required: boolean;
    defaultValue?: unknown;
    options?: { value: string; label: string }[];
  }[];
  sqlQuery?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportData {
  name: string;
  description?: string;
  templateId?: string;
  type: Report['type'];
  category?: Report['category'];
  format?: Report['format'];
  parameters?: Record<string, unknown>;
  filters?: Record<string, unknown>;
  recipients?: string[];
  tags?: string[];
  isScheduled?: boolean;
  schedule?: Report['schedule'];
  expiresAt?: string;
}

export interface UpdateReportData {
  name?: string;
  description?: string;
  parameters?: Record<string, unknown>;
  filters?: Record<string, unknown>;
  recipients?: string[];
  tags?: string[];
  schedule?: Report['schedule'];
  expiresAt?: string;
}

export interface ReportFilters {
  type?: Report['type'];
  category?: Report['category'];
  status?: Report['status'];
  format?: Report['format'];
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  isScheduled?: boolean;
}

export interface ReportAnalytics {
  totalReports: number;
  completedReports: number;
  failedReports: number;
  scheduledReports: number;
  totalDownloads: number;
  averageGenerationTime: number;
  typeBreakdown: {
    type: Report['type'];
    count: number;
    percentage: number;
  }[];
  categoryBreakdown: {
    category: Report['category'];
    count: number;
    percentage: number;
  }[];
  formatBreakdown: {
    format: Report['format'];
    count: number;
    percentage: number;
  }[];
  monthlyTrends: {
    month: string;
    generated: number;
    completed: number;
    failed: number;
  }[];
}
