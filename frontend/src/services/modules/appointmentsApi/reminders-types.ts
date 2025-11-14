/**
 * Appointments API - Reminder Type Definitions
 *
 * Type definitions specific to reminder management functionality.
 * These types extend the base reminder types from the main types module.
 *
 * @module services/modules/appointmentsApi/reminders-types
 */

import { MessageType, ReminderStatus } from './types';

/**
 * Reminder Query Parameters
 * Used for filtering and paginating reminder lists
 */
export interface ReminderQuery {
  appointmentId?: string;
  status?: ReminderStatus;
  type?: MessageType;
  scheduledFrom?: string;
  scheduledTo?: string;
  page?: number;
  limit?: number;
  sortBy?: 'scheduledFor' | 'createdAt' | 'sentAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Reminder Statistics by Message Type
 */
export interface ReminderTypeStatistics {
  count: number;
  deliveryRate: number;
  failureRate: number;
}

/**
 * Recent Reminder Activity
 */
export interface ReminderActivity {
  date: string;
  sent: number;
  delivered: number;
  failed: number;
}

/**
 * Comprehensive Reminder Statistics
 * Provides analytics and metrics for reminder delivery
 */
export interface ReminderStatistics {
  totalReminders: number;
  pendingReminders: number;
  sentReminders: number;
  deliveredReminders: number;
  failedReminders: number;
  cancelledReminders: number;
  deliveryRate: number; // Percentage
  failureRate: number; // Percentage

  // Statistics by message type
  byType: Record<MessageType, ReminderTypeStatistics>;

  // Recent activity timeline
  recentActivity: ReminderActivity[];
}

/**
 * Bulk Reminder Operation Failure
 */
export interface BulkReminderFailure {
  data: {
    appointmentId: string;
    type: MessageType;
    scheduledFor: string;
    message?: string;
    recipient?: string;
  };
  error: string;
}

/**
 * Bulk Reminder Operation Summary
 */
export interface BulkReminderSummary {
  total: number;
  successful: number;
  failed: number;
}

/**
 * Bulk Reminder Operation Result
 * Returned when scheduling multiple reminders at once
 */
export interface BulkReminderResult {
  successful: Array<{
    id: string;
    appointmentId: string;
    type: MessageType;
    status: ReminderStatus;
    scheduledFor: string;
    message: string;
    recipient: string;
    createdAt: string;
    updatedAt: string;
    sentAt?: string;
    deliveredAt?: string;
    failedAt?: string;
    metadata?: Record<string, unknown>;
  }>;
  failed: BulkReminderFailure[];
  summary: BulkReminderSummary;
}

/**
 * Reminder Schedule Configuration
 * Used when scheduling multiple reminders for an appointment
 */
export interface ReminderScheduleConfig {
  type: MessageType;
  hoursBeforeAppointment: number;
  recipient?: string;
  message?: string;
}

/**
 * Paginated Reminders Response
 */
export interface PaginatedRemindersResponse {
  reminders: Array<{
    id: string;
    appointmentId: string;
    type: MessageType;
    status: ReminderStatus;
    scheduledFor: string;
    message: string;
    recipient: string;
    createdAt: string;
    updatedAt: string;
    sentAt?: string;
    deliveredAt?: string;
    failedAt?: string;
    metadata?: Record<string, unknown>;
  }>;
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Reminder Metadata
 * Additional information stored with reminders
 */
export interface ReminderMetadata {
  cancellationReason?: string;
  rescheduled?: boolean;
  originalScheduleTime?: string;
  retryCount?: number;
  failureReason?: string;
  deliveryInfo?: Record<string, unknown>;
  [key: string]: unknown;
}
