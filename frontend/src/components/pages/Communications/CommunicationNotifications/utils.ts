/**
 * Utility functions for CommunicationNotifications
 */

import React from 'react';
import {
  ExclamationTriangleIcon,
  CheckIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  BellIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import type {
  NotificationType,
  NotificationPriority,
  NotificationChannelType,
  CommunicationNotification,
  NotificationSortBy,
  SortOrder
} from './types';

/**
 * Get icon component for notification type
 */
export const getTypeIcon = (type: NotificationType): React.ReactElement => {
  switch (type) {
    case 'error':
      return React.createElement(ExclamationTriangleIcon, { className: "h-5 w-5 text-red-500" });
    case 'warning':
      return React.createElement(ExclamationTriangleIcon, { className: "h-5 w-5 text-yellow-500" });
    case 'success':
      return React.createElement(CheckIcon, { className: "h-5 w-5 text-green-500" });
    case 'info':
    default:
      return React.createElement(InformationCircleIcon, { className: "h-5 w-5 text-blue-500" });
  }
};

/**
 * Get CSS classes for priority badge
 */
export const getPriorityColor = (priority: NotificationPriority): string => {
  switch (priority) {
    case 'urgent':
      return 'text-red-600 bg-red-100';
    case 'high':
      return 'text-orange-600 bg-orange-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'low':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

/**
 * Get icon component for channel type
 */
export const getChannelIcon = (channel: NotificationChannelType): React.ReactElement => {
  switch (channel) {
    case 'email':
      return React.createElement(EnvelopeIcon, { className: "h-4 w-4" });
    case 'sms':
      return React.createElement(DevicePhoneMobileIcon, { className: "h-4 w-4" });
    case 'push':
      return React.createElement(BellIcon, { className: "h-4 w-4" });
    case 'in_app':
      return React.createElement(ComputerDesktopIcon, { className: "h-4 w-4" });
    default:
      return React.createElement(BellIcon, { className: "h-4 w-4" });
  }
};

/**
 * Filter notifications by search query
 */
export const filterBySearch = (
  notifications: CommunicationNotification[],
  searchQuery: string
): CommunicationNotification[] => {
  if (!searchQuery) return notifications;

  const searchLower = searchQuery.toLowerCase();
  return notifications.filter(notif =>
    notif.title.toLowerCase().includes(searchLower) ||
    notif.message.toLowerCase().includes(searchLower) ||
    (notif.metadata.student_name && notif.metadata.student_name.toLowerCase().includes(searchLower)) ||
    (notif.metadata.sender_name && notif.metadata.sender_name.toLowerCase().includes(searchLower))
  );
};

/**
 * Filter notifications by category
 */
export const filterByCategory = (
  notifications: CommunicationNotification[],
  category: string
): CommunicationNotification[] => {
  if (category === 'all') return notifications;
  return notifications.filter(notif => notif.category === category);
};

/**
 * Filter notifications by priority
 */
export const filterByPriority = (
  notifications: CommunicationNotification[],
  priority: string
): CommunicationNotification[] => {
  if (priority === 'all') return notifications;
  return notifications.filter(notif => notif.priority === priority);
};

/**
 * Filter notifications by status
 */
export const filterByStatus = (
  notifications: CommunicationNotification[],
  status: string
): CommunicationNotification[] => {
  if (status === 'all') return notifications;
  return notifications.filter(notif => notif.status === status);
};

/**
 * Sort notifications based on criteria
 */
export const sortNotifications = (
  notifications: CommunicationNotification[],
  sortBy: NotificationSortBy,
  sortOrder: SortOrder
): CommunicationNotification[] => {
  const sorted = [...notifications];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'priority': {
        const priorityOrder: Record<NotificationPriority, number> = {
          low: 1,
          medium: 2,
          high: 3,
          urgent: 4
        };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      }
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return sorted;
};

/**
 * Apply all filters and sorting to notifications
 */
export const applyFiltersAndSort = (
  notifications: CommunicationNotification[],
  filters: {
    searchQuery: string;
    category: string;
    priority: string;
    status: string;
    sortBy: NotificationSortBy;
    sortOrder: SortOrder;
  }
): CommunicationNotification[] => {
  let filtered = filterBySearch(notifications, filters.searchQuery);
  filtered = filterByCategory(filtered, filters.category);
  filtered = filterByPriority(filtered, filters.priority);
  filtered = filterByStatus(filtered, filters.status);
  filtered = sortNotifications(filtered, filters.sortBy, filters.sortOrder);

  return filtered;
};
