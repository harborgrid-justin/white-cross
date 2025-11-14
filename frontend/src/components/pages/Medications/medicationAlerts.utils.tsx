/**
 * Utility functions for MedicationAlerts component
 *
 * This module contains helper functions for alert type configuration,
 * priority badges, filtering, sorting, and statistics calculation.
 */

import React from 'react';
import type {
  MedicationAlert,
  AlertFilters,
  AlertStats,
  AlertTypeConfig,
  AlertSortBy,
  SortOrder
} from './medicationAlerts.types';

/**
 * Get alert type icon and styling configuration
 */
export const getAlertTypeConfig = (type: MedicationAlert['type']): AlertTypeConfig => {
  const configs: Record<MedicationAlert['type'], AlertTypeConfig> = {
    'expiration': {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    'low-stock': {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    },
    'missed-dose': {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    'interaction': {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    'recall': {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    'allergy': {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    'critical': {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200'
    }
  };
  return configs[type] || configs['critical'];
};

/**
 * Get priority badge styling classes
 */
export const getPriorityBadge = (priority: MedicationAlert['priority']): string => {
  const badges: Record<MedicationAlert['priority'], string> = {
    'low': 'bg-gray-100 text-gray-800 border-gray-200',
    'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'high': 'bg-orange-100 text-orange-800 border-orange-200',
    'critical': 'bg-red-100 text-red-800 border-red-200'
  };
  return badges[priority] || badges['medium'];
};

/**
 * Filter alerts based on filter criteria
 */
export const filterAlerts = (
  alerts: MedicationAlert[],
  filters: AlertFilters
): MedicationAlert[] => {
  return alerts.filter(alert => {
    // Search filter
    const matchesSearch = alert.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         (alert.medicationName && alert.medicationName.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
                         (alert.studentName && alert.studentName.toLowerCase().includes(filters.searchTerm.toLowerCase()));

    // Type filter
    const matchesType = filters.type === 'all' || alert.type === filters.type;

    // Priority filter
    const matchesPriority = filters.priority === 'all' || alert.priority === filters.priority;

    // Status filter
    let matchesStatus = true;
    if (filters.status !== 'all') {
      switch (filters.status) {
        case 'acknowledged':
          matchesStatus = alert.acknowledged;
          break;
        case 'unacknowledged':
          matchesStatus = !alert.acknowledged;
          break;
        case 'action-required':
          matchesStatus = alert.actionRequired && !alert.actionTaken;
          break;
        case 'resolved':
          matchesStatus = alert.actionRequired && (alert.actionTaken ?? false);
          break;
      }
    }

    // Time range filter
    let matchesTimeRange = true;
    if (filters.timeRange !== 'all') {
      const now = new Date();
      const alertDate = new Date(alert.createdAt);
      const diffHours = (now.getTime() - alertDate.getTime()) / (1000 * 60 * 60);

      switch (filters.timeRange) {
        case '1-hour':
          matchesTimeRange = diffHours <= 1;
          break;
        case '24-hours':
          matchesTimeRange = diffHours <= 24;
          break;
        case '7-days':
          matchesTimeRange = diffHours <= 24 * 7;
          break;
        case '30-days':
          matchesTimeRange = diffHours <= 24 * 30;
          break;
      }
    }

    return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesTimeRange;
  });
};

/**
 * Sort alerts based on sort criteria
 */
export const sortAlerts = (
  alerts: MedicationAlert[],
  sortBy: AlertSortBy,
  sortOrder: SortOrder
): MedicationAlert[] => {
  const sorted = [...alerts];

  sorted.sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case 'priority':
        const priorityOrder: Record<MedicationAlert['priority'], number> = {
          'critical': 4,
          'high': 3,
          'medium': 2,
          'low': 1
        };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'created':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      case 'medication':
        aValue = a.medicationName || '';
        bValue = b.medicationName || '';
        break;
      default:
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
};

/**
 * Calculate alert statistics
 */
export const calculateAlertStats = (alerts: MedicationAlert[]): AlertStats => {
  const total = alerts.length;
  const unacknowledged = alerts.filter(alert => !alert.acknowledged).length;
  const critical = alerts.filter(alert => alert.priority === 'critical').length;
  const actionRequired = alerts.filter(alert => alert.actionRequired && !alert.actionTaken).length;

  return { total, unacknowledged, critical, actionRequired };
};
