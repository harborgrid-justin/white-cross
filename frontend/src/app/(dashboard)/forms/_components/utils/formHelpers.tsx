/**
 * Utility functions for healthcare forms management
 *
 * This file contains pure utility functions for rendering badges, icons,
 * and formatting data related to healthcare forms.
 */

import React from 'react';
import {
  FileText,
  Users,
  Shield,
  AlertCircle,
  FileCheck,
  Lock,
  Phone,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FormStatus, FormPriority, FormType } from '../types/formTypes';

/**
 * Renders a status badge with appropriate styling
 *
 * @param status - The form status
 * @returns JSX element with styled badge
 */
export function getStatusBadge(status: FormStatus): React.ReactNode {
  switch (status) {
    case 'published':
      return <Badge className="bg-green-100 text-green-800">Published</Badge>;
    case 'draft':
      return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
    case 'paused':
      return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
    case 'archived':
      return <Badge className="bg-red-100 text-red-800">Archived</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
  }
}

/**
 * Renders a priority badge with appropriate styling
 *
 * @param priority - The form priority level
 * @returns JSX element with styled badge
 */
export function getPriorityBadge(priority: FormPriority): React.ReactNode {
  switch (priority) {
    case 'critical':
      return <Badge className="bg-red-100 text-red-800 border-red-200">Critical</Badge>;
    case 'high':
      return <Badge className="bg-orange-100 text-orange-800 border-orange-200">High</Badge>;
    case 'normal':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Normal</Badge>;
    case 'low':
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Low</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Normal</Badge>;
  }
}

/**
 * Returns an icon component for a given form type
 *
 * @param type - The form type
 * @returns JSX element with appropriate icon
 */
export function getTypeIcon(type: FormType): React.ReactNode {
  switch (type) {
    case 'enrollment':
      return <Users className="h-4 w-4 text-blue-500" />;
    case 'health_screening':
      return <Shield className="h-4 w-4 text-green-500" />;
    case 'incident_report':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'permission_slip':
      return <FileCheck className="h-4 w-4 text-indigo-500" />;
    case 'medical_consent':
      return <Lock className="h-4 w-4 text-purple-500" />;
    case 'emergency_contact':
      return <Phone className="h-4 w-4 text-orange-500" />;
    case 'assessment':
      return <BarChart3 className="h-4 w-4 text-cyan-500" />;
    case 'survey':
      return <TrendingUp className="h-4 w-4 text-pink-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
}

/**
 * Formats a date object to a readable string
 *
 * @param date - The date to format
 * @returns Formatted date string (e.g., "Nov 4, 2024")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a completion rate as a percentage string
 *
 * @param rate - The completion rate (0-100)
 * @returns Formatted percentage string (e.g., "85.3%")
 */
export function formatCompletionRate(rate: number): string {
  return `${rate.toFixed(1)}%`;
}

/**
 * Gets a human-readable label for a form type
 *
 * @param type - The form type
 * @returns Human-readable label
 */
export function getFormTypeLabel(type: FormType): string {
  switch (type) {
    case 'enrollment':
      return 'Enrollment';
    case 'health_screening':
      return 'Health Screening';
    case 'incident_report':
      return 'Incident Report';
    case 'permission_slip':
      return 'Permission Slip';
    case 'medical_consent':
      return 'Medical Consent';
    case 'emergency_contact':
      return 'Emergency Contact';
    case 'allergy_form':
      return 'Allergy Form';
    case 'medication_authorization':
      return 'Medication Authorization';
    case 'assessment':
      return 'Assessment';
    case 'survey':
      return 'Survey';
    case 'other':
      return 'Other';
    default:
      return 'Unknown';
  }
}

/**
 * Calculates whether a form is expiring soon (within 7 days)
 *
 * @param expiresAt - Optional expiration date
 * @returns True if form expires within 7 days
 */
export function isExpiringSoon(expiresAt?: Date): boolean {
  if (!expiresAt) return false;

  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

  return expiresAt < oneWeekFromNow;
}

/**
 * Calculates whether a submission was made today
 *
 * @param submissionDate - Optional submission date
 * @returns True if submission was today
 */
export function isSubmittedToday(submissionDate?: Date): boolean {
  if (!submissionDate) return false;

  const today = new Date().toDateString();
  return submissionDate.toDateString() === today;
}
