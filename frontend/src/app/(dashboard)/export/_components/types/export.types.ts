/**
 * Type definitions for data export system
 */

export type ExportType = 'health-records' | 'medications' | 'appointments' | 'incidents' | 'compliance';
export type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json';
export type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ExportJob {
  id: string;
  name: string;
  type: ExportType;
  format: ExportFormat;
  status: ExportStatus;
  created: string;
  completed?: string;
  fileSize?: string;
  recordCount: number;
  requestedBy: string;
  hipaaApproved: boolean;
}

export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  type: ExportType;
  fields: string[];
  lastUsed: string;
  usage: number;
}

export interface ExportStats {
  totalExports: number;
  pendingExports: number;
  completedToday: number;
  failedToday: number;
  totalDataSize: string;
  avgProcessingTime: string;
}

export interface ExportContentProps {
  initialJobs?: ExportJob[];
  initialTemplates?: ExportTemplate[];
}

export interface ExportFiltersProps {
  statusFilter: ExportStatus | 'all';
  typeFilter: ExportType | 'all';
  formatFilter: ExportFormat | 'all';
  searchQuery: string;
  onStatusFilterChange: (status: ExportStatus | 'all') => void;
  onTypeFilterChange: (type: ExportType | 'all') => void;
  onFormatFilterChange: (format: ExportFormat | 'all') => void;
  onSearchQueryChange: (query: string) => void;
}

export interface ExportStatsProps {
  stats: ExportStats;
}

export interface ExportJobListProps {
  jobs: ExportJob[];
  onDownload: (jobId: string) => void;
  onRetry: (jobId: string) => void;
  onDelete: (jobId: string) => void;
}

export interface ExportJobCardProps {
  job: ExportJob;
  onDownload: (jobId: string) => void;
  onRetry: (jobId: string) => void;
  onDelete: (jobId: string) => void;
}

export interface ExportTemplateListProps {
  templates: ExportTemplate[];
  onUseTemplate: (templateId: string) => void;
  onEditTemplate: (templateId: string) => void;
  onDeleteTemplate: (templateId: string) => void;
}

export interface CreateExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExportFormData) => Promise<void>;
  templates: ExportTemplate[];
}

export interface ExportFormData {
  name: string;
  type: ExportType;
  format: ExportFormat;
  dateRange: {
    start: string;
    end: string;
  };
  fields: string[];
  includeArchived: boolean;
  hipaaCompliant: boolean;
}
