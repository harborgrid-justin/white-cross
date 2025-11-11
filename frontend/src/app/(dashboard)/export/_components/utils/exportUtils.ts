/**
 * Utility functions for export management
 */

import type { ExportJob, ExportStatus, ExportType, ExportFormat } from '../types/export.types';

/**
 * Get status badge color classes
 */
export const getStatusColor = (status: ExportStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Get type badge color classes
 */
export const getTypeColor = (type: ExportType): string => {
  switch (type) {
    case 'health-records':
      return 'bg-blue-100 text-blue-800';
    case 'medications':
      return 'bg-purple-100 text-purple-800';
    case 'appointments':
      return 'bg-green-100 text-green-800';
    case 'incidents':
      return 'bg-orange-100 text-orange-800';
    case 'compliance':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get format display name
 */
export const getFormatDisplayName = (format: ExportFormat): string => {
  switch (format) {
    case 'csv':
      return 'CSV';
    case 'xlsx':
      return 'Excel';
    case 'pdf':
      return 'PDF';
    case 'json':
      return 'JSON';
    default:
      return format.toUpperCase();
  }
};

/**
 * Get type display name
 */
export const getTypeDisplayName = (type: ExportType): string => {
  switch (type) {
    case 'health-records':
      return 'Health Records';
    case 'medications':
      return 'Medications';
    case 'appointments':
      return 'Appointments';
    case 'incidents':
      return 'Incidents';
    case 'compliance':
      return 'Compliance';
    default:
      return type;
  }
};

/**
 * Format file size for display
 */
export const formatFileSize = (sizeStr: string): string => {
  // If already formatted, return as is
  if (sizeStr.match(/^\d+(\.\d+)?\s?(B|KB|MB|GB)$/i)) {
    return sizeStr;
  }
  
  // Otherwise assume bytes and convert
  const bytes = parseInt(sizeStr, 10);
  if (isNaN(bytes)) return sizeStr;
  
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format date for display
 */
export const formatExportDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

/**
 * Calculate time ago
 */
export const getTimeAgo = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return formatExportDate(dateStr);
};

/**
 * Filter exports by status
 */
export const filterByStatus = (
  jobs: ExportJob[],
  status: ExportStatus | 'all'
): ExportJob[] => {
  if (status === 'all') return jobs;
  return jobs.filter(job => job.status === status);
};

/**
 * Filter exports by type
 */
export const filterByType = (
  jobs: ExportJob[],
  type: ExportType | 'all'
): ExportJob[] => {
  if (type === 'all') return jobs;
  return jobs.filter(job => job.type === type);
};

/**
 * Filter exports by format
 */
export const filterByFormat = (
  jobs: ExportJob[],
  format: ExportFormat | 'all'
): ExportJob[] => {
  if (format === 'all') return jobs;
  return jobs.filter(job => job.format === format);
};

/**
 * Search exports by query
 */
export const searchExports = (
  jobs: ExportJob[],
  query: string
): ExportJob[] => {
  if (!query.trim()) return jobs;
  
  const lowerQuery = query.toLowerCase();
  return jobs.filter(job =>
    job.name.toLowerCase().includes(lowerQuery) ||
    job.type.toLowerCase().includes(lowerQuery) ||
    job.requestedBy.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Sort exports by date
 */
export const sortByDate = (
  jobs: ExportJob[],
  order: 'asc' | 'desc' = 'desc'
): ExportJob[] => {
  return [...jobs].sort((a, b) => {
    const dateA = new Date(a.created).getTime();
    const dateB = new Date(b.created).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Validate export form data
 */
export const validateExportForm = (data: {
  name?: string;
  type?: string;
  format?: string;
  dateRange?: { start?: string; end?: string };
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Export name is required';
  }
  
  if (!data.type) {
    errors.type = 'Export type is required';
  }
  
  if (!data.format) {
    errors.format = 'Export format is required';
  }
  
  if (data.dateRange) {
    if (!data.dateRange.start) {
      errors.dateStart = 'Start date is required';
    }
    if (!data.dateRange.end) {
      errors.dateEnd = 'End date is required';
    }
    if (data.dateRange.start && data.dateRange.end) {
      const start = new Date(data.dateRange.start);
      const end = new Date(data.dateRange.end);
      if (start > end) {
        errors.dateRange = 'Start date must be before end date';
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Generate export filename
 */
export const generateExportFilename = (
  type: ExportType,
  format: ExportFormat,
  date: Date = new Date()
): string => {
  const typeSlug = type.replace(/-/g, '_');
  const dateStr = date.toISOString().split('T')[0];
  return `${typeSlug}_export_${dateStr}.${format}`;
};

/**
 * Check if export is HIPAA compliant
 */
export const isHIPAACompliant = (job: ExportJob): boolean => {
  return job.hipaaApproved && job.type !== 'compliance';
};

/**
 * Calculate estimated file size
 */
export const estimateFileSize = (recordCount: number, format: ExportFormat): string => {
  // Rough estimates in KB per record
  const sizesPerRecord: Record<ExportFormat, number> = {
    csv: 2,
    xlsx: 3,
    pdf: 10,
    json: 4
  };
  
  const estimatedKB = recordCount * sizesPerRecord[format];
  
  if (estimatedKB < 1024) {
    return `${estimatedKB.toFixed(0)} KB`;
  } else {
    return `${(estimatedKB / 1024).toFixed(1)} MB`;
  }
};
