/**
 * @fileoverview Admin Sidebar Utilities - Helper functions for sidebar components
 * @module app/(dashboard)/admin/_components/sidebar/utils
 * @category Admin - Utils
 */

/**
 * Get color class for status indicator
 */
export function getStatusColor(status: string | undefined): string {
  switch (status) {
    case 'success': return 'text-green-600';
    case 'warning': return 'text-yellow-600';
    case 'error': return 'text-red-600';
    case 'active': return 'text-blue-600';
    default: return 'text-gray-600';
  }
}

/**
 * Get badge variant for status
 */
export function getStatusBadgeVariant(status: string | undefined): "default" | "secondary" | "success" | "error" | "warning" | "info" {
  switch (status) {
    case 'success': return 'success';
    case 'warning': return 'warning';
    case 'error': return 'error';
    case 'active': return 'info';
    default: return 'secondary';
  }
}

/**
 * Get color class for metric status
 */
export function getMetricStatusColor(status: string): string {
  switch (status) {
    case 'normal': return 'text-green-600';
    case 'warning': return 'text-yellow-600';
    case 'critical': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

/**
 * Get background color for alert type
 */
export function getAlertBackgroundColor(type: 'error' | 'warning' | 'info'): string {
  switch (type) {
    case 'error': return 'bg-red-50';
    case 'warning': return 'bg-yellow-50';
    case 'info': return 'bg-blue-50';
    default: return 'bg-gray-50';
  }
}

/**
 * Get text color for alert type
 */
export function getAlertTextColor(type: 'error' | 'warning' | 'info'): string {
  switch (type) {
    case 'error': return 'text-red-900';
    case 'warning': return 'text-yellow-900';
    case 'info': return 'text-blue-900';
    default: return 'text-gray-900';
  }
}

/**
 * Get icon color for alert type
 */
export function getAlertIconColor(type: 'error' | 'warning' | 'info'): string {
  switch (type) {
    case 'error': return 'text-red-600';
    case 'warning': return 'text-yellow-600';
    case 'info': return 'text-blue-600';
    default: return 'text-gray-600';
  }
}

/**
 * Get background color for activity type
 */
export function getActivityBackgroundColor(type: 'success' | 'info' | 'warning'): string {
  switch (type) {
    case 'success': return 'bg-green-50';
    case 'info': return 'bg-blue-50';
    case 'warning': return 'bg-purple-50';
    default: return 'bg-gray-50';
  }
}

/**
 * Get text color for activity type
 */
export function getActivityTextColor(type: 'success' | 'info' | 'warning'): string {
  switch (type) {
    case 'success': return 'text-green-900';
    case 'info': return 'text-blue-900';
    case 'warning': return 'text-purple-900';
    default: return 'text-gray-900';
  }
}

/**
 * Get icon color for activity type
 */
export function getActivityIconColor(type: 'success' | 'info' | 'warning'): string {
  switch (type) {
    case 'success': return 'text-green-600';
    case 'info': return 'text-blue-600';
    case 'warning': return 'text-purple-600';
    default: return 'text-gray-600';
  }
}
