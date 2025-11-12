/**
 * @fileoverview Report Detail Helper Functions
 *
 * Utility functions for displaying report category, status, and execution information.
 */

import {
  Activity,
  FileText,
  BarChart3,
  CheckCircle,
  Star,
  Clock,
  Loader,
  AlertCircle
} from 'lucide-react';
import type {
  ReportCategory,
  ReportStatus,
  ExecutionStatus,
  CategoryInfo,
  StatusInfo,
  ExecutionStatusInfo
} from './types';

/**
 * Gets category display info
 */
export const getCategoryInfo = (category: ReportCategory): CategoryInfo => {
  const categoryInfo: Record<ReportCategory, CategoryInfo> = {
    clinical: { icon: Activity, color: 'text-blue-600 bg-blue-100', label: 'Clinical' },
    financial: { icon: FileText, color: 'text-green-600 bg-green-100', label: 'Financial' },
    operational: { icon: BarChart3, color: 'text-purple-600 bg-purple-100', label: 'Operational' },
    compliance: { icon: CheckCircle, color: 'text-orange-600 bg-orange-100', label: 'Compliance' },
    'patient-satisfaction': { icon: Star, color: 'text-yellow-600 bg-yellow-100', label: 'Patient Satisfaction' },
    custom: { icon: FileText, color: 'text-gray-600 bg-gray-100', label: 'Custom' }
  };
  return categoryInfo[category];
};

/**
 * Gets status display info
 */
export const getStatusInfo = (status: ReportStatus): StatusInfo => {
  const statusInfo: Record<ReportStatus, StatusInfo> = {
    draft: { color: 'text-gray-600 bg-gray-100', label: 'Draft' },
    published: { color: 'text-green-600 bg-green-100', label: 'Published' },
    archived: { color: 'text-red-600 bg-red-100', label: 'Archived' },
    scheduled: { color: 'text-blue-600 bg-blue-100', label: 'Scheduled' }
  };
  return statusInfo[status];
};

/**
 * Gets execution status display info
 */
export const getExecutionStatusInfo = (status: ExecutionStatus): ExecutionStatusInfo => {
  const statusInfo: Record<ExecutionStatus, ExecutionStatusInfo> = {
    idle: { color: 'text-gray-600 bg-gray-100', icon: Clock, label: 'Ready' },
    running: { color: 'text-blue-600 bg-blue-100', icon: Loader, label: 'Running' },
    completed: { color: 'text-green-600 bg-green-100', icon: CheckCircle, label: 'Completed' },
    failed: { color: 'text-red-600 bg-red-100', icon: AlertCircle, label: 'Failed' },
    cancelled: { color: 'text-orange-600 bg-orange-100', icon: AlertCircle, label: 'Cancelled' }
  };
  return statusInfo[status];
};
