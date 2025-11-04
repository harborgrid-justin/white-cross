/**
 * @fileoverview Analytics Helper Functions
 * @module app/(dashboard)/analytics/_components/utils/analytics.helpers
 * @category Analytics - Utilities
 */

import {
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  Shield,
  CheckCircle,
  Target,
  AlertTriangle,
  Pill,
  FileText,
  BarChart3
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TrendDirection, MetricCategory, ReportStatus, ReportType } from './analytics.types';

/**
 * Get the appropriate icon component for a trend direction
 */
export function getTrendIcon(trend: TrendDirection): LucideIcon {
  switch (trend) {
    case 'up':
      return TrendingUp;
    case 'down':
      return TrendingDown;
    default:
      return Activity;
  }
}

/**
 * Get the CSS color class for a trend direction
 */
export function getTrendColor(trend: TrendDirection): string {
  switch (trend) {
    case 'up':
      return 'text-green-600';
    case 'down':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Get the appropriate icon component for a metric category
 */
export function getCategoryIcon(category: MetricCategory): LucideIcon {
  switch (category) {
    case 'HEALTH':
      return Heart;
    case 'SAFETY':
      return Shield;
    case 'COMPLIANCE':
      return CheckCircle;
    case 'OPERATIONAL':
      return Target;
    default:
      return Activity;
  }
}

/**
 * Get the CSS color class for a metric category
 */
export function getCategoryColor(category: MetricCategory): string {
  switch (category) {
    case 'HEALTH':
      return 'text-red-600';
    case 'SAFETY':
      return 'text-blue-600';
    case 'COMPLIANCE':
      return 'text-green-600';
    case 'OPERATIONAL':
      return 'text-purple-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Get the badge variant for a report status
 */
export function getStatusBadgeVariant(status: ReportStatus): string {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'PROCESSING':
      return 'warning';
    case 'SCHEDULED':
      return 'info';
    case 'FAILED':
      return 'danger';
    default:
      return 'secondary';
  }
}

/**
 * Get the appropriate icon component for a report type
 */
export function getTypeIcon(type: ReportType): LucideIcon {
  switch (type) {
    case 'HEALTH_METRICS':
      return Heart;
    case 'COMPLIANCE':
      return Shield;
    case 'INCIDENT_ANALYSIS':
      return AlertTriangle;
    case 'MEDICATION_REPORT':
      return Pill;
    case 'CUSTOM':
      return FileText;
    default:
      return BarChart3;
  }
}

/**
 * Format a number with locale-specific thousand separators
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format a date string into a human-readable format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
