/**
 * @fileoverview Import Type Definitions
 * @module lib/actions/import.types
 *
 * TypeScript type definitions for import management system.
 * Includes interfaces for jobs, templates, validations, and analytics.
 */

// ==========================================
// ACTION RESULT TYPE
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

// ==========================================
// IMPORT JOB TYPES
// ==========================================

export interface ImportJob {
  id: string;
  name: string;
  description: string;
  type: 'csv' | 'excel' | 'json' | 'xml' | 'text';
  format: 'students' | 'medications' | 'inventory' | 'staff' | 'immunizations' | 'incidents' | 'custom';
  status: 'pending' | 'validating' | 'processing' | 'completed' | 'failed' | 'cancelled';
  fileName: string;
  fileSize: number;
  fileUrl: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  processedRecords: number;
  importedRecords: number;
  skippedRecords: number;
  errorRecords: number;
  mapping: Record<string, string>;
  validationRules: ImportValidationRule[];
  errors: ImportError[];
  warnings: ImportWarning[];
  createdBy: string;
  createdByName: string;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  templateId?: string;
  isDryRun: boolean;
  rollbackSupported: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateImportJobData {
  name: string;
  description?: string;
  type: ImportJob['type'];
  format: ImportJob['format'];
  fileName: string;
  fileSize: number;
  fileUrl: string;
  mapping?: Record<string, string>;
  validationRules?: ImportValidationRule[];
  templateId?: string;
  isDryRun?: boolean;
}

export interface UpdateImportJobData {
  name?: string;
  description?: string;
  mapping?: Record<string, string>;
  validationRules?: ImportValidationRule[];
  isDryRun?: boolean;
  status?: ImportJob['status'];
}

// ==========================================
// IMPORT TEMPLATE TYPES
// ==========================================

export interface ImportTemplate {
  id: string;
  name: string;
  description: string;
  type: ImportJob['type'];
  format: ImportJob['format'];
  defaultMapping: Record<string, string>;
  defaultValidationRules: ImportValidationRule[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateImportTemplateData {
  name: string;
  description: string;
  type: ImportJob['type'];
  format: ImportJob['format'];
  defaultMapping?: Record<string, string>;
  defaultValidationRules?: ImportValidationRule[];
  isActive?: boolean;
}

export interface UpdateImportTemplateData {
  name?: string;
  description?: string;
  defaultMapping?: Record<string, string>;
  defaultValidationRules?: ImportValidationRule[];
  isActive?: boolean;
}

// ==========================================
// VALIDATION TYPES
// ==========================================

export interface ImportValidationRule {
  field: string;
  rule: 'required' | 'unique' | 'email' | 'phone' | 'date' | 'number' | 'length' | 'regex' | 'exists';
  value?: string | number;
  message: string;
  severity: 'error' | 'warning';
}

export interface ImportError {
  row: number;
  field: string;
  value: string;
  message: string;
  code: string;
  severity: 'error' | 'warning';
}

export interface ImportWarning {
  row: number;
  field: string;
  value: string;
  message: string;
  code: string;
}

// ==========================================
// FILTER AND ANALYTICS TYPES
// ==========================================

export interface ImportFilters {
  type?: ImportJob['type'];
  format?: ImportJob['format'];
  status?: ImportJob['status'];
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
  isDryRun?: boolean;
}

export interface ImportAnalytics {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  totalRecordsImported: number;
  averageProcessingTime: number;
  successRate: number;
  typeBreakdown: {
    type: ImportJob['type'];
    count: number;
    percentage: number;
  }[];
  formatBreakdown: {
    format: ImportJob['format'];
    count: number;
    percentage: number;
  }[];
  recentActivity: {
    date: string;
    completed: number;
    failed: number;
    imported: number;
  }[];
}
