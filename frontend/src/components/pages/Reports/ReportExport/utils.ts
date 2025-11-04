import {
  FileText,
  File,
  FileSpreadsheet,
  FileImage,
  Clock,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  LucideIcon
} from 'lucide-react';
import type { ExportFormat, ExportStatus, ExportPriority } from './types';

/**
 * Status display configuration
 */
interface StatusDisplay {
  color: string;
  icon: LucideIcon;
}

/**
 * Gets the appropriate icon for an export format
 */
export const getFormatIcon = (format: ExportFormat): LucideIcon => {
  const icons: Record<ExportFormat, LucideIcon> = {
    pdf: FileText,
    csv: File,
    xlsx: FileSpreadsheet,
    json: File,
    xml: File,
    png: FileImage,
    jpeg: FileImage,
    svg: FileImage
  };
  return icons[format] || FileText;
};

/**
 * Gets status display configuration (color and icon)
 */
export const getStatusDisplay = (status: ExportStatus): StatusDisplay => {
  const config: Record<ExportStatus, StatusDisplay> = {
    pending: { color: 'text-yellow-600 bg-yellow-100', icon: Clock },
    processing: { color: 'text-blue-600 bg-blue-100', icon: Loader2 },
    completed: { color: 'text-green-600 bg-green-100', icon: CheckCircle },
    failed: { color: 'text-red-600 bg-red-100', icon: AlertCircle },
    cancelled: { color: 'text-gray-600 bg-gray-100', icon: X }
  };
  return config[status];
};

/**
 * Gets priority color classes
 */
export const getPriorityColor = (priority: ExportPriority): string => {
  const colors: Record<ExportPriority, string> = {
    low: 'text-gray-600 bg-gray-100',
    normal: 'text-blue-600 bg-blue-100',
    high: 'text-orange-600 bg-orange-100',
    urgent: 'text-red-600 bg-red-100'
  };
  return colors[priority];
};

/**
 * Formats file size in bytes to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
