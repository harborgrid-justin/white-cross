/**
 * @fileoverview Report Detail Types
 *
 * Type definitions for the report detail component including execution status,
 * parameters, and results.
 */

import type { Report, ReportCategory, ReportStatus, ReportFrequency } from '../ReportCard';

/**
 * Report execution status
 */
export type ExecutionStatus = 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';

/**
 * Report parameter type
 */
export interface ReportParameter {
  id: string;
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
  required: boolean;
  defaultValue?: unknown;
  options?: Array<{ value: string; label: string; }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  description?: string;
}

/**
 * Report execution result
 */
export interface ExecutionResult {
  id: string;
  startTime: Date;
  endTime?: Date;
  status: ExecutionStatus;
  recordCount?: number;
  executionTime?: number;
  error?: string;
  downloadUrl?: string;
  previewData?: unknown[];
}

/**
 * Props for the ReportDetail component
 */
export interface ReportDetailProps {
  /** Report data to display */
  report: Report;
  /** Current execution result */
  executionResult?: ExecutionResult;
  /** Report parameters */
  parameters?: ReportParameter[];
  /** Recent executions */
  recentExecutions?: ExecutionResult[];
  /** Whether user can edit report */
  canEdit?: boolean;
  /** Whether user can delete report */
  canDelete?: boolean;
  /** Whether user can run report */
  canRun?: boolean;
  /** Whether user can share report */
  canShare?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Run report handler */
  onRunReport?: (parameters: Record<string, unknown>) => void;
  /** Cancel execution handler */
  onCancelExecution?: () => void;
  /** Download result handler */
  onDownloadResult?: (resultId: string, format: 'pdf' | 'excel' | 'csv') => void;
  /** Edit report handler */
  onEditReport?: () => void;
  /** Delete report handler */
  onDeleteReport?: () => void;
  /** Share report handler */
  onShareReport?: () => void;
  /** Clone report handler */
  onCloneReport?: () => void;
  /** Bookmark toggle handler */
  onToggleBookmark?: () => void;
  /** Favorite toggle handler */
  onToggleFavorite?: () => void;
  /** Back navigation handler */
  onBack?: () => void;
}

/**
 * Tab type for navigation
 */
export type TabType = 'overview' | 'parameters' | 'history';

/**
 * Category display information
 */
export interface CategoryInfo {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  label: string;
}

/**
 * Status display information
 */
export interface StatusInfo {
  color: string;
  label: string;
}

/**
 * Execution status display information
 */
export interface ExecutionStatusInfo {
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

export type { Report, ReportCategory, ReportStatus, ReportFrequency };
