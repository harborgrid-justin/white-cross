/**
 * Utility functions for the ReportScheduler component system
 * Provides formatting, status display, and calculation helpers
 */

import React from 'react';
import type { ScheduleStatus, ScheduleConfig, ReportSchedule } from '../types';

/**
 * Status badge configuration type
 */
interface StatusBadgeConfig {
  bg: string;
  text: string;
  label: string;
}

/**
 * Gets status badge styling configuration
 *
 * @param status - The schedule status
 * @returns Badge configuration with background, text color, and label
 */
export const getStatusBadgeConfig = (status: ScheduleStatus): StatusBadgeConfig => {
  const statusConfig: Record<ScheduleStatus, StatusBadgeConfig> = {
    active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
    paused: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Paused' },
    stopped: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Stopped' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' },
    failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
    pending: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Pending' }
  };

  return statusConfig[status];
};

/**
 * Renders a status badge component
 *
 * @param status - The schedule status
 * @returns JSX element for the status badge
 */
export const getStatusBadge = (status: ScheduleStatus): JSX.Element => {
  const config = getStatusBadgeConfig(status);
  return React.createElement(
    'span',
    {
      className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`
    },
    config.label
  );
};

/**
 * Gets human-readable frequency display text
 *
 * @param config - The schedule configuration
 * @returns Formatted frequency string
 */
export const getFrequencyText = (config: ScheduleConfig): string => {
  switch (config.frequency) {
    case 'once':
      return 'One time';
    case 'hourly':
      return 'Every hour';
    case 'daily':
      return `Daily at ${config.time}`;
    case 'weekly':
      return `Weekly on ${config.daysOfWeek?.join(', ') || 'weekdays'} at ${config.time}`;
    case 'monthly':
      return `Monthly on day ${config.dayOfMonth || 1} at ${config.time}`;
    case 'quarterly':
      return `Quarterly at ${config.time}`;
    case 'yearly':
      return `Yearly in ${config.month || 'January'} at ${config.time}`;
    default:
      return 'Custom';
  }
};

/**
 * Formats a date string to a localized format
 *
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Jan 15, 2024, 09:30 AM")
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculates the success rate percentage for a schedule
 *
 * @param schedule - The report schedule
 * @returns Success rate as a percentage (0-100)
 */
export const getSuccessRate = (schedule: ReportSchedule): number => {
  if (schedule.executionCount === 0) return 0;
  return Math.round((schedule.successCount / schedule.executionCount) * 100);
};

/**
 * Filters schedules based on search term and status
 *
 * @param schedules - Array of schedules to filter
 * @param searchTerm - Search string to match against
 * @param statusFilter - Status filter ('all' or specific status)
 * @returns Filtered array of schedules
 */
export const filterSchedules = (
  schedules: ReportSchedule[],
  searchTerm: string,
  statusFilter: ScheduleStatus | 'all'
): ReportSchedule[] => {
  return schedules.filter(schedule => {
    const matchesSearch =
      schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.reportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
};
