/**
 * WF-COMP-104 | appointmentOptions.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions, interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Appointment Options Constants
 * Centralized configuration for appointment types, statuses, and priorities
 * Aligned with backend validation schemas
 */

import type { AppointmentType, AppointmentStatus, Priority } from '@/types';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
}

/**
 * Appointment Type Options
 * Matches backend Joi validation schema
 */
export const APPOINTMENT_TYPE_OPTIONS: SelectOption<AppointmentType | 'all'>[] = [
  { value: 'all', label: 'All Types' },
  {
    value: 'ROUTINE_CHECKUP',
    label: 'Routine Checkup',
    description: 'Regular health checkup and wellness visit'
  },
  {
    value: 'MEDICATION_ADMINISTRATION',
    label: 'Medication Administration',
    description: 'Scheduled medication distribution'
  },
  {
    value: 'INJURY_ASSESSMENT',
    label: 'Injury Assessment',
    description: 'Evaluation of physical injuries'
  },
  {
    value: 'ILLNESS_EVALUATION',
    label: 'Illness Evaluation',
    description: 'Assessment of illness symptoms'
  },
  {
    value: 'FOLLOW_UP',
    label: 'Follow Up',
    description: 'Follow-up appointment for previous visit'
  },
  {
    value: 'SCREENING',
    label: 'Screening',
    description: 'Health screening or preventive care'
  },
  {
    value: 'EMERGENCY',
    label: 'Emergency',
    description: 'Urgent medical attention required'
  },
];

/**
 * Appointment Status Options
 * Matches backend Joi validation schema
 */
export const APPOINTMENT_STATUS_OPTIONS: SelectOption<AppointmentStatus | 'all'>[] = [
  { value: 'all', label: 'All Statuses' },
  {
    value: 'SCHEDULED',
    label: 'Scheduled',
    description: 'Appointment is scheduled and pending'
  },
  {
    value: 'IN_PROGRESS',
    label: 'In Progress',
    description: 'Currently being conducted'
  },
  {
    value: 'COMPLETED',
    label: 'Completed',
    description: 'Successfully completed'
  },
  {
    value: 'CANCELLED',
    label: 'Cancelled',
    description: 'Cancelled by nurse or parent'
  },
  {
    value: 'NO_SHOW',
    label: 'No Show',
    description: 'Student did not attend'
  },
];

/**
 * Waitlist Priority Options
 * Matches backend Joi validation schema
 */
export const WAITLIST_PRIORITY_OPTIONS: SelectOption<Priority | 'all'>[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'LOW', label: 'Low', description: 'Can wait for regular scheduling' },
  { value: 'MEDIUM', label: 'Normal', description: 'Standard priority' },
  { value: 'HIGH', label: 'High', description: 'Should be scheduled soon' },
  { value: 'URGENT', label: 'Urgent', description: 'Needs immediate attention' },
];

/**
 * Appointment Duration Options (in minutes)
 */
export const DURATION_OPTIONS: SelectOption<number>[] = [
  { value: 15, label: '15 minutes', description: 'Quick check or medication' },
  { value: 30, label: '30 minutes', description: 'Standard appointment' },
  { value: 45, label: '45 minutes', description: 'Extended consultation' },
  { value: 60, label: '1 hour', description: 'Comprehensive evaluation' },
  { value: 90, label: '1.5 hours', description: 'Complex case or screening' },
  { value: 120, label: '2 hours', description: 'Extended care session' },
];

/**
 * Helper function to get label for appointment type
 */
export function getAppointmentTypeLabel(type: string): string {
  const option = APPOINTMENT_TYPE_OPTIONS.find(opt => opt.value === type);
  return option?.label || type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Helper function to get label for appointment status
 */
export function getAppointmentStatusLabel(status: string): string {
  const option = APPOINTMENT_STATUS_OPTIONS.find(opt => opt.value === status);
  return option?.label || status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Helper function to get badge color class for status
 */
export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'SCHEDULED':
      return 'bg-blue-100 text-blue-800';
    case 'IN_PROGRESS':
      return 'bg-yellow-100 text-yellow-800';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    case 'NO_SHOW':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Helper function to get badge color class for priority
 */
export function getPriorityBadgeClass(priority: string): string {
  switch (priority) {
    case 'URGENT':
    case 'CRITICAL':
      return 'bg-red-100 text-red-800';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800';
    case 'MEDIUM':
    case 'NORMAL':
      return 'bg-blue-100 text-blue-800';
    case 'LOW':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
