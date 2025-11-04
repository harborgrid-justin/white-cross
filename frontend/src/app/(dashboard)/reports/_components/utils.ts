/**
 * @fileoverview Utility functions for Reports components
 * @module app/(dashboard)/reports/_components/utils
 * @category Reports - Utilities
 */

import type {
  ReportCategory,
  ReportStatus,
  ReportPriority,
  BadgeVariant
} from './types';

/**
 * Get badge variant for report category
 */
export function getCategoryBadgeVariant(category: ReportCategory): BadgeVariant {
  const variants: Record<ReportCategory, BadgeVariant> = {
    HEALTH: 'danger',
    COMPLIANCE: 'success',
    OPERATIONAL: 'info',
    FINANCIAL: 'secondary',
    CUSTOM: 'warning'
  };
  return variants[category] || 'default';
}

/**
 * Get badge variant for report status
 */
export function getStatusBadgeVariant(status: ReportStatus): BadgeVariant {
  const variants: Record<ReportStatus, BadgeVariant> = {
    COMPLETED: 'success',
    PROCESSING: 'info',
    SCHEDULED: 'warning',
    FAILED: 'danger',
    DRAFT: 'secondary'
  };
  return variants[status] || 'default';
}

/**
 * Get badge variant for report priority
 */
export function getPriorityBadgeVariant(priority: ReportPriority): BadgeVariant {
  const variants: Record<ReportPriority, BadgeVariant> = {
    LOW: 'secondary',
    MEDIUM: 'info',
    HIGH: 'warning',
    URGENT: 'danger'
  };
  return variants[priority] || 'default';
}

/**
 * Format date string to localized format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format number with locale-specific thousand separators
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format file size from bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format duration in seconds to human-readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateString);
  }
}

/**
 * Pluralize a word based on count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) {
    return singular;
  }
  return plural || `${singular}s`;
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Sort reports by specified field and order
 */
export function sortReports<T extends Record<string, any>>(
  reports: T[],
  sortBy: keyof T,
  sortOrder: 'asc' | 'desc' = 'asc'
): T[] {
  return [...reports].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue === bValue) return 0;

    const comparison = aValue < bValue ? -1 : 1;
    return sortOrder === 'asc' ? comparison : -comparison;
  });
}

/**
 * Filter reports by search term
 */
export function filterReportsBySearch<T extends { title: string; description: string }>(
  reports: T[],
  searchTerm: string
): T[] {
  if (!searchTerm) return reports;

  const lowerSearch = searchTerm.toLowerCase();
  return reports.filter(
    (report) =>
      report.title.toLowerCase().includes(lowerSearch) ||
      report.description.toLowerCase().includes(lowerSearch)
  );
}

/**
 * Group reports by specified field
 */
export function groupReportsBy<T extends Record<string, any>>(
  reports: T[],
  groupBy: keyof T
): Record<string, T[]> {
  return reports.reduce((acc, report) => {
    const key = String(report[groupBy]);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(report);
    return acc;
  }, {} as Record<string, T[]>);
}
