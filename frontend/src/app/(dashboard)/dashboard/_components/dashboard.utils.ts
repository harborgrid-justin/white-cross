/**
 * Dashboard Utilities
 *
 * Shared utility functions for dashboard components including:
 * - Icon selection based on alert/activity types
 * - Color styling helpers for severity levels
 * - Status badge styling
 * - Time formatting helpers
 */

import {
  Users,
  Activity,
  AlertTriangle,
  Calendar,
  Pill,
  FileText,
  Bell,
  Shield,
  Heart,
  Download,
  type LucideIcon,
} from 'lucide-react';
import type { HealthAlert, RecentActivity } from '@/lib/actions/dashboard.actions';

/**
 * Get the appropriate icon component for a health alert type
 */
export function getAlertIcon(type: HealthAlert['type']): LucideIcon {
  switch (type) {
    case 'medication':
      return Pill;
    case 'allergy':
      return AlertTriangle;
    case 'condition':
      return Heart;
    case 'emergency':
      return Shield;
    case 'immunization':
      return Shield;
    default:
      return Bell;
  }
}

/**
 * Get color classes for alert severity styling
 */
export function getAlertColor(severity: HealthAlert['severity']): string {
  switch (severity) {
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Get the appropriate icon component for an activity type
 */
export function getActivityIcon(type: RecentActivity['type']): LucideIcon {
  switch (type) {
    case 'student_enrollment':
      return Users;
    case 'health_record_update':
      return FileText;
    case 'medication_administered':
      return Pill;
    case 'appointment_scheduled':
      return Calendar;
    case 'emergency_contact':
      return Shield;
    case 'document_upload':
      return Download;
    case 'system_alert':
      return Bell;
    default:
      return Activity;
  }
}

/**
 * Get background and text color classes for activity status
 */
export function getActivityStatusColor(status: RecentActivity['status']): {
  bgColor: string;
  textColor: string;
} {
  switch (status) {
    case 'completed':
      return { bgColor: 'bg-green-100', textColor: 'text-green-600' };
    case 'pending':
      return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' };
    case 'failed':
      return { bgColor: 'bg-red-100', textColor: 'text-red-600' };
    default:
      return { bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
  }
}

/**
 * Get badge variant for activity status
 */
export function getActivityBadgeVariant(
  status: RecentActivity['status']
): 'success' | 'warning' | 'error' | 'default' {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
}

/**
 * Format timestamp to localized time string
 */
export function formatActivityTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString();
}

/**
 * Format timestamp to localized date and time string
 */
export function formatAlertTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}
