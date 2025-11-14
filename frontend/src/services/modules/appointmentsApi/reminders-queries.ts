/**
 * Appointments API - Reminder Queries
 *
 * Handles querying, filtering, and statistics for appointment reminders.
 * Provides methods for retrieving reminder data and generating analytics.
 *
 * @module services/modules/appointmentsApi/reminders-queries
 */

import { AppointmentReminder, MessageType, ReminderStatus } from './types';
import {
  ReminderQuery,
  ReminderStatistics,
  PaginatedRemindersResponse
} from './reminders-types';

/**
 * Reminder Query Service Class
 *
 * Manages querying, filtering, pagination, and statistics for appointment reminders.
 * Provides analytics and data retrieval methods.
 */
export class ReminderQueryService {
  private readonly endpoint = '/api/reminders';

  /**
   * Get reminders with filtering and pagination
   *
   * Retrieves reminders based on query parameters with support for
   * filtering by appointment, status, type, and date ranges.
   *
   * @param query - Query parameters for filtering and pagination
   * @returns Promise resolving to paginated reminders with metadata
   * @throws Error if query execution fails
   */
  async getReminders(query: ReminderQuery = {}): Promise<PaginatedRemindersResponse> {
    try {
      const {
        appointmentId,
        status,
        type,
        scheduledFrom,
        scheduledTo,
        page = 1,
        limit = 20,
        sortBy = 'scheduledFor',
        sortOrder = 'asc'
      } = query;

      // Validate pagination parameters
      if (page < 1) {
        throw new Error('Page must be at least 1');
      }
      if (limit < 1 || limit > 100) {
        throw new Error('Limit must be between 1 and 100');
      }

      // This would typically make an API call with query parameters
      // For now, return mock data that respects the filters
      const mockReminders: AppointmentReminder[] = this.generateMockReminders(
        appointmentId,
        status,
        type
      );

      // Apply date range filtering if provided
      let filteredReminders = mockReminders;
      if (scheduledFrom) {
        const fromDate = new Date(scheduledFrom);
        filteredReminders = filteredReminders.filter(
          r => new Date(r.scheduledFor) >= fromDate
        );
      }
      if (scheduledTo) {
        const toDate = new Date(scheduledTo);
        filteredReminders = filteredReminders.filter(
          r => new Date(r.scheduledFor) <= toDate
        );
      }

      // Apply sorting
      filteredReminders = this.sortReminders(filteredReminders, sortBy, sortOrder);

      // Apply pagination
      const totalCount = filteredReminders.length;
      const totalPages = Math.ceil(totalCount / limit);
      const startIndex = (page - 1) * limit;
      const paginatedReminders = filteredReminders.slice(startIndex, startIndex + limit);

      return {
        reminders: paginatedReminders,
        totalCount,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to get reminders: ${errorMessage}`);
    }
  }

  /**
   * Get reminder statistics
   *
   * Retrieves comprehensive statistics about reminder delivery, including
   * success rates, failure rates, and breakdown by message type.
   *
   * @param dateFrom - Optional start date for statistics period
   * @param dateTo - Optional end date for statistics period
   * @returns Promise resolving to reminder statistics
   * @throws Error if statistics retrieval fails
   */
  async getReminderStatistics(
    dateFrom?: string,
    dateTo?: string
  ): Promise<ReminderStatistics> {
    try {
      // Validate date range if provided
      if (dateFrom && dateTo) {
        const from = new Date(dateFrom);
        const to = new Date(dateTo);
        if (from > to) {
          throw new Error('Start date must be before end date');
        }
      }

      // This would typically make an API call to get statistics
      // For now, return mock statistics
      const stats: ReminderStatistics = {
        totalReminders: 150,
        pendingReminders: 25,
        sentReminders: 100,
        deliveredReminders: 95,
        failedReminders: 20,
        cancelledReminders: 5,
        deliveryRate: 95.0,
        failureRate: 13.3,

        byType: {
          [MessageType.EMAIL]: {
            count: 80,
            deliveryRate: 97.5,
            failureRate: 2.5
          },
          [MessageType.SMS]: {
            count: 40,
            deliveryRate: 90.0,
            failureRate: 10.0
          },
          [MessageType.PUSH]: {
            count: 20,
            deliveryRate: 95.0,
            failureRate: 5.0
          },
          [MessageType.IN_APP]: {
            count: 10,
            deliveryRate: 100.0,
            failureRate: 0.0
          }
        },

        recentActivity: [
          { date: '2023-11-01', sent: 15, delivered: 14, failed: 1 },
          { date: '2023-11-02', sent: 18, delivered: 17, failed: 1 },
          { date: '2023-11-03', sent: 12, delivered: 11, failed: 1 },
          { date: '2023-11-04', sent: 20, delivered: 19, failed: 1 },
          { date: '2023-11-05', sent: 16, delivered: 15, failed: 1 }
        ]
      };

      return stats;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to get reminder statistics: ${errorMessage}`);
    }
  }

  /**
   * Delete old reminders
   *
   * Removes reminders older than the specified number of days.
   * Useful for maintaining database hygiene and complying with data retention policies.
   *
   * @param olderThanDays - Delete reminders older than this many days
   * @returns Promise resolving to count of deleted reminders
   * @throws Error if deletion fails or parameters are invalid
   */
  async deleteOldReminders(olderThanDays: number = 90): Promise<number> {
    if (olderThanDays < 1) {
      throw new Error('Days must be at least 1');
    }

    if (olderThanDays < 30) {
      console.warn(
        'Warning: Deleting reminders less than 30 days old. Consider using a longer retention period.'
      );
    }

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      // This would typically make an API call to delete old reminders
      // The API would return the count of deleted records
      // Example: const result = await this.client.delete(`${this.endpoint}/old`, { olderThan: cutoffDate })

      // Mock deletion count based on the time period
      const mockDeletedCount = Math.floor(olderThanDays / 10);
      return mockDeletedCount;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to delete old reminders: ${errorMessage}`);
    }
  }

  /**
   * Get reminder by ID
   *
   * Retrieves a specific reminder by its unique identifier.
   *
   * @param reminderId - Reminder ID to retrieve
   * @returns Promise resolving to the reminder
   * @throws Error if reminder not found or retrieval fails
   */
  async getReminderById(reminderId: string): Promise<AppointmentReminder> {
    if (!reminderId?.trim()) {
      throw new Error('Reminder ID is required');
    }

    try {
      // This would typically make an API call
      // For now, return mock data
      const mockReminder: AppointmentReminder = {
        id: reminderId,
        appointmentId: 'appointment_1',
        type: MessageType.EMAIL,
        status: ReminderStatus.PENDING,
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        message: 'Your appointment is tomorrow',
        recipient: 'student@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return mockReminder;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to get reminder: ${errorMessage}`);
    }
  }

  /**
   * Get reminders for a specific appointment
   *
   * Retrieves all reminders associated with a given appointment.
   *
   * @param appointmentId - Appointment ID
   * @returns Promise resolving to array of reminders
   * @throws Error if retrieval fails
   */
  async getRemindersForAppointment(appointmentId: string): Promise<AppointmentReminder[]> {
    if (!appointmentId?.trim()) {
      throw new Error('Appointment ID is required');
    }

    try {
      const result = await this.getReminders({
        appointmentId,
        limit: 100 // Get all reminders for the appointment
      });

      return result.reminders;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to get reminders for appointment: ${errorMessage}`);
    }
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================

  /**
   * Generate mock reminders for testing
   */
  private generateMockReminders(
    appointmentId?: string,
    status?: ReminderStatus,
    type?: MessageType
  ): AppointmentReminder[] {
    const mockReminders: AppointmentReminder[] = [
      {
        id: 'reminder_1',
        appointmentId: appointmentId || 'appointment_1',
        type: type || MessageType.EMAIL,
        status: status || ReminderStatus.PENDING,
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        message: 'Your appointment is tomorrow',
        recipient: 'student@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'reminder_2',
        appointmentId: appointmentId || 'appointment_1',
        type: type || MessageType.SMS,
        status: status || ReminderStatus.SENT,
        scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        message: 'Reminder: appointment in 2 hours',
        recipient: '+1234567890',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sentAt: new Date().toISOString()
      }
    ];

    return mockReminders;
  }

  /**
   * Sort reminders by specified field
   */
  private sortReminders(
    reminders: AppointmentReminder[],
    sortBy: 'scheduledFor' | 'createdAt' | 'sentAt',
    sortOrder: 'asc' | 'desc'
  ): AppointmentReminder[] {
    return reminders.sort((a, b) => {
      let aValue: string;
      let bValue: string;

      switch (sortBy) {
        case 'scheduledFor':
          aValue = a.scheduledFor;
          bValue = b.scheduledFor;
          break;
        case 'createdAt':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        case 'sentAt':
          aValue = a.sentAt || '';
          bValue = b.sentAt || '';
          break;
      }

      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }
}

/**
 * Create Reminder Query Service instance
 *
 * Factory function for creating a configured query service.
 *
 * @returns Configured reminder query service
 */
export function createReminderQueryService(): ReminderQueryService {
  return new ReminderQueryService();
}
