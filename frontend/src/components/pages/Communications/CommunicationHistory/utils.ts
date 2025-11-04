/**
 * Utility functions for Communication History components
 */

import React from 'react';
import {
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import type { CommunicationRecord, HistoryFilters } from './types';

/**
 * Get icon component for communication type
 */
export const getTypeIcon = (type: CommunicationRecord['type']): React.ReactElement => {
  switch (type) {
    case 'email':
      return React.createElement(EnvelopeIcon, { className: 'h-4 w-4' });
    case 'sms':
      return React.createElement(DevicePhoneMobileIcon, { className: 'h-4 w-4' });
    case 'phone':
      return React.createElement(PhoneIcon, { className: 'h-4 w-4' });
    case 'chat':
      return React.createElement(ChatBubbleLeftRightIcon, { className: 'h-4 w-4' });
    default:
      return React.createElement(EnvelopeIcon, { className: 'h-4 w-4' });
  }
};

/**
 * Get status badge component
 */
export const getStatusBadge = (status: CommunicationRecord['status']): React.ReactElement | null => {
  switch (status) {
    case 'sent':
      return React.createElement(
        'span',
        { className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800' },
        React.createElement(ClockIcon, { className: 'h-3 w-3 mr-1' }),
        'Sent'
      );
    case 'delivered':
      return React.createElement(
        'span',
        { className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800' },
        React.createElement(CheckCircleIcon, { className: 'h-3 w-3 mr-1' }),
        'Delivered'
      );
    case 'read':
      return React.createElement(
        'span',
        { className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800' },
        React.createElement(EyeIcon, { className: 'h-3 w-3 mr-1' }),
        'Read'
      );
    case 'failed':
      return React.createElement(
        'span',
        { className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800' },
        React.createElement(XCircleIcon, { className: 'h-3 w-3 mr-1' }),
        'Failed'
      );
    case 'pending':
      return React.createElement(
        'span',
        { className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800' },
        React.createElement(ClockIcon, { className: 'h-3 w-3 mr-1' }),
        'Pending'
      );
    default:
      return null;
  }
};

/**
 * Get priority badge component
 */
export const getPriorityBadge = (priority: CommunicationRecord['priority']): React.ReactElement | null => {
  switch (priority) {
    case 'urgent':
      return React.createElement(
        'span',
        { className: 'inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200' },
        React.createElement(ExclamationTriangleIcon, { className: 'h-3 w-3 mr-1' }),
        'Urgent'
      );
    case 'high':
      return React.createElement(
        'span',
        { className: 'inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200' },
        'High'
      );
    case 'medium':
      return React.createElement(
        'span',
        { className: 'inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200' },
        'Medium'
      );
    case 'low':
      return React.createElement(
        'span',
        { className: 'inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200' },
        'Low'
      );
    default:
      return null;
  }
};

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Filter communications based on filter criteria
 */
export const filterCommunications = (
  communications: CommunicationRecord[],
  filters: HistoryFilters
): CommunicationRecord[] => {
  let result = [...communications];

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(comm =>
      comm.content.toLowerCase().includes(searchLower) ||
      (comm.subject && comm.subject.toLowerCase().includes(searchLower)) ||
      comm.sender.name.toLowerCase().includes(searchLower) ||
      comm.recipients.some(r => r.name.toLowerCase().includes(searchLower)) ||
      (comm.metadata.student_name && comm.metadata.student_name.toLowerCase().includes(searchLower))
    );
  }

  // Apply type filter
  if (filters.type) {
    result = result.filter(comm => comm.type === filters.type);
  }

  // Apply status filter
  if (filters.status) {
    result = result.filter(comm => comm.status === filters.status);
  }

  // Apply priority filter
  if (filters.priority) {
    result = result.filter(comm => comm.priority === filters.priority);
  }

  // Apply category filter
  if (filters.category) {
    result = result.filter(comm => comm.category === filters.category);
  }

  // Apply sender filter
  if (filters.sender) {
    result = result.filter(comm => comm.sender.id === filters.sender);
  }

  // Apply student filter
  if (filters.student) {
    result = result.filter(comm => comm.metadata.student_id === filters.student);
  }

  // Apply date range filter
  if (filters.dateRange.start) {
    const startDate = new Date(filters.dateRange.start);
    result = result.filter(comm => new Date(comm.created_at) >= startDate);
  }
  if (filters.dateRange.end) {
    const endDate = new Date(filters.dateRange.end);
    result = result.filter(comm => new Date(comm.created_at) <= endDate);
  }

  return result;
};

/**
 * Sort communications based on sort criteria
 */
export const sortCommunications = (
  communications: CommunicationRecord[],
  sortBy: HistoryFilters['sortBy'],
  sortOrder: HistoryFilters['sortOrder']
): CommunicationRecord[] => {
  const result = [...communications];

  result.sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case 'created_at':
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      case 'updated_at':
        aValue = new Date(a.updated_at).getTime();
        bValue = new Date(b.updated_at).getTime();
        break;
      case 'priority':
        const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }
  });

  return result;
};

/**
 * Apply both filtering and sorting to communications
 */
export const filterAndSortCommunications = (
  communications: CommunicationRecord[],
  filters: HistoryFilters
): CommunicationRecord[] => {
  const filtered = filterCommunications(communications, filters);
  return sortCommunications(filtered, filters.sortBy, filters.sortOrder);
};
