/**
 * WF-COMM-HISTORY-003 | constants.ts - Communication History Constants
 * Purpose: Shared constants and configuration for history components
 * Upstream: Communications system | Dependencies: types.ts
 * Downstream: History components | Called by: All history sub-components
 * Related: Filter options, badge variants, pagination settings
 * Exports: Filter options, constants, configuration
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Configuration constants for communication history system
 */

import type { CommunicationRecord } from './types';
import type { SelectOption } from '@/components/ui/select';

/**
 * Default pagination settings
 */
export const DEFAULT_ITEMS_PER_PAGE = 10;

/**
 * Type filter options
 */
export const TYPE_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Types' },
  { value: 'individual', label: 'Individual Messages' },
  { value: 'broadcast', label: 'Broadcast Messages' },
  { value: 'emergency', label: 'Emergency Alerts' },
];

/**
 * Status filter options
 */
export const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'sent', label: 'Sent' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'read', label: 'Read' },
  { value: 'failed', label: 'Failed' },
  { value: 'pending', label: 'Pending' },
];

/**
 * Priority filter options
 */
export const PRIORITY_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

/**
 * Mock communication history data for development
 */
export const MOCK_HISTORY_DATA: CommunicationRecord[] = [
  {
    id: '1',
    type: 'emergency',
    subject: 'URGENT: Medical Emergency',
    message: 'Your child requires immediate medical attention. Please contact the school nurse immediately at 555-0100.',
    sender: 'Nurse Sarah Johnson',
    recipients: ['John Smith (Emily Smith)'],
    deliveryMethod: ['email', 'sms', 'voice'],
    status: 'read',
    priority: 'urgent',
    sentAt: '2025-10-27T09:15:00',
    deliveredAt: '2025-10-27T09:15:30',
    readAt: '2025-10-27T09:16:45',
    readReceipts: 1,
    totalRecipients: 1,
  },
  {
    id: '2',
    type: 'broadcast',
    subject: 'Health Screening Reminder',
    message: 'Annual health screenings will be conducted next week. Please ensure all health forms are updated.',
    sender: 'Nurse Sarah Johnson',
    recipients: ['All Parents'],
    deliveryMethod: ['email', 'push'],
    status: 'delivered',
    priority: 'normal',
    sentAt: '2025-10-26T14:30:00',
    deliveredAt: '2025-10-26T14:31:00',
    readReceipts: 342,
    totalRecipients: 485,
  },
  {
    id: '3',
    type: 'individual',
    subject: 'Medication Administration Update',
    message: 'Your child received their scheduled medication today at 12:30 PM. No adverse reactions observed.',
    sender: 'Nurse Sarah Johnson',
    recipients: ['Sarah Johnson (Michael Johnson)'],
    deliveryMethod: ['email'],
    status: 'read',
    priority: 'normal',
    sentAt: '2025-10-26T12:35:00',
    deliveredAt: '2025-10-26T12:35:15',
    readAt: '2025-10-26T13:22:00',
    readReceipts: 1,
    totalRecipients: 1,
  },
  {
    id: '4',
    type: 'individual',
    subject: 'Student Injury Report',
    message: 'Your child has sustained a minor injury during recess. The injury is non-life-threatening. Please contact the school at 555-0100.',
    sender: 'Nurse Sarah Johnson',
    recipients: ['David Brown (Olivia Brown)'],
    deliveryMethod: ['email', 'sms'],
    status: 'delivered',
    priority: 'high',
    sentAt: '2025-10-25T10:45:00',
    deliveredAt: '2025-10-25T10:45:20',
    readReceipts: 0,
    totalRecipients: 1,
  },
  {
    id: '5',
    type: 'broadcast',
    subject: 'Flu Season Precautions',
    message: 'As we enter flu season, please keep sick children home and ensure students practice good hand hygiene.',
    sender: 'Nurse Sarah Johnson',
    recipients: ['All Parents'],
    deliveryMethod: ['email'],
    status: 'delivered',
    priority: 'normal',
    sentAt: '2025-10-24T08:00:00',
    deliveredAt: '2025-10-24T08:01:00',
    readReceipts: 267,
    totalRecipients: 485,
  },
];
