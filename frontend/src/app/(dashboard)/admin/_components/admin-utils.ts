/**
 * @fileoverview Admin Dashboard Utility Functions
 * @module app/(dashboard)/admin/_components/admin-utils
 * @category Admin - Utilities
 */

import {
  Activity,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import type {
  BadgeVariant,
  ActivityStatus,
  AlertLevel,
  TrendDirection
} from './admin-types';

/**
 * Maps activity status to badge variant for UI display
 * @param status - The activity status
 * @returns The corresponding badge variant
 */
export function getStatusBadgeVariant(status: string): BadgeVariant {
  switch (status) {
    case 'SUCCESS': return 'success';
    case 'WARNING': return 'warning';
    case 'ERROR': return 'danger';
    case 'INFO': return 'info';
    default: return 'secondary';
  }
}

/**
 * Maps alert level to badge variant for UI display
 * @param level - The alert level
 * @returns The corresponding badge variant
 */
export function getAlertLevelBadgeVariant(level: string): BadgeVariant {
  switch (level) {
    case 'CRITICAL': return 'danger';
    case 'HIGH': return 'warning';
    case 'MEDIUM': return 'info';
    case 'LOW': return 'success';
    default: return 'secondary';
  }
}

/**
 * Gets the appropriate icon component for a trend direction
 * @param trend - The trend direction
 * @returns The corresponding Lucide icon component
 */
export function getTrendIcon(trend: string) {
  switch (trend) {
    case 'up': return TrendingUp;
    case 'down': return TrendingDown;
    default: return Activity;
  }
}

/**
 * Gets the color class for a trend direction
 * @param trend - The trend direction
 * @returns The Tailwind color class
 */
export function getTrendColor(trend: string): string {
  switch (trend) {
    case 'up': return 'text-green-600';
    case 'down': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

/**
 * Formats a number with locale-specific thousand separators
 * @param num - The number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Formats an ISO date string to human-readable format
 * @param dateString - ISO 8601 date string
 * @returns Formatted date string (e.g., "Oct 31, 10:30 AM")
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
 * Formats bytes to human-readable file size
 * @param bytes - Number of bytes
 * @returns Formatted size string (e.g., "1.5 GB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
