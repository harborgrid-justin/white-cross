/**
 * WF-COMM-HISTORY-004 | utils.ts - Communication History Utility Functions
 * Purpose: Shared utility functions for formatting and data manipulation
 * Upstream: Communications system | Dependencies: types.ts
 * Downstream: History components | Called by: All history sub-components
 * Related: Date formatting, badge variants, filtering logic
 * Exports: Utility functions for history system
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Utility functions for communication history display and processing
 */

import type { CommunicationRecord, HistoryFilters } from './types';

/**
 * Formats a date string for display
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Formats a time duration between two dates
 * @param startDate - Start date string
 * @param endDate - End date string
 * @returns Human-readable duration string
 */
export const formatDuration = (startDate: string, endDate: string): string => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const diffMs = end - start;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Gets the appropriate badge variant for a status
 * @param status - Communication status
 * @returns Badge variant string
 */
export const getStatusBadgeVariant = (status: string): string => {
  switch (status) {
    case 'sent':
      return 'info';
    case 'delivered':
      return 'primary';
    case 'read':
      return 'success';
    case 'failed':
      return 'danger';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
};

/**
 * Gets the appropriate badge variant for a message type
 * @param type - Communication type
 * @returns Badge variant string
 */
export const getTypeBadgeVariant = (type: string): string => {
  switch (type) {
    case 'emergency':
      return 'danger';
    case 'broadcast':
      return 'primary';
    case 'individual':
      return 'secondary';
    default:
      return 'default';
  }
};

/**
 * Gets the appropriate badge variant for a priority level
 * @param priority - Priority level
 * @returns Badge variant string
 */
export const getPriorityBadgeVariant = (priority: string): string => {
  switch (priority) {
    case 'urgent':
      return 'danger';
    case 'high':
      return 'warning';
    case 'normal':
      return 'default';
    default:
      return 'default';
  }
};

/**
 * Formats a message type for display
 * @param type - Communication type
 * @returns Formatted type string
 */
export const formatMessageType = (type: string): string => {
  switch (type) {
    case 'individual':
      return 'Individual';
    case 'broadcast':
      return 'Broadcast';
    case 'emergency':
      return 'Emergency';
    default:
      return type;
  }
};

/**
 * Filters communication history based on search term and filters
 * @param records - Array of communication records
 * @param filters - Filter criteria
 * @returns Filtered array of communication records
 */
export const filterHistory = (
  records: CommunicationRecord[],
  filters: HistoryFilters
): CommunicationRecord[] => {
  return records.filter((record) => {
    const matchesSearch =
      record.subject.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.message.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.recipients.some((r) =>
        r.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );

    const matchesType =
      filters.filterType === 'all' || record.type === filters.filterType;
    const matchesStatus =
      filters.filterStatus === 'all' || record.status === filters.filterStatus;
    const matchesPriority =
      filters.filterPriority === 'all' ||
      record.priority === filters.filterPriority;

    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });
};

/**
 * Calculates delivery rate percentage
 * @param readReceipts - Number of read receipts
 * @param totalRecipients - Total number of recipients
 * @returns Delivery rate as percentage
 */
export const calculateDeliveryRate = (
  readReceipts: number,
  totalRecipients: number
): number => {
  if (totalRecipients === 0) return 0;
  return Math.round((readReceipts / totalRecipients) * 100);
};

/**
 * Checks if any filters are active
 * @param filters - Filter state
 * @returns True if any filter is active
 */
export const hasActiveFilters = (filters: HistoryFilters): boolean => {
  return (
    filters.searchTerm !== '' ||
    filters.filterType !== 'all' ||
    filters.filterStatus !== 'all' ||
    filters.filterPriority !== 'all'
  );
};

/**
 * Exports communication history to CSV format
 * @param records - Array of communication records to export
 * @returns CSV string
 */
export const exportToCSV = (records: CommunicationRecord[]): string => {
  const headers = [
    'ID',
    'Type',
    'Subject',
    'Message',
    'Sender',
    'Recipients',
    'Delivery Method',
    'Status',
    'Priority',
    'Sent At',
    'Delivered At',
    'Read At',
    'Read Receipts',
    'Total Recipients',
  ];

  const rows = records.map((record) => [
    record.id,
    record.type,
    record.subject,
    record.message.replace(/\n/g, ' '),
    record.sender,
    record.recipients.join('; '),
    record.deliveryMethod.join(', '),
    record.status,
    record.priority,
    record.sentAt,
    record.deliveredAt || '',
    record.readAt || '',
    record.readReceipts || 0,
    record.totalRecipients,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  return csvContent;
};

/**
 * Triggers a download of the exported data
 * @param csvContent - CSV content string
 * @param filename - Name for the downloaded file
 */
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
