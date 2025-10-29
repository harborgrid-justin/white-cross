import {
  Notification,
  NotificationStatus,
  NotificationType,
  NotificationPriority,
  NotificationFilters,
  NotificationGroup,
  NotificationStats,
  DeliveryChannel,
  CreateNotificationInput,
  CreateNotificationSchema,
} from '../types/notification';

/**
 * NotificationService
 *
 * Manages notification lifecycle: creation, delivery, status updates, grouping
 */
export class NotificationService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/v1/notifications') {
    this.baseUrl = baseUrl;
  }

  /**
   * Create a new notification
   */
  async create(input: CreateNotificationInput): Promise<Notification> {
    // Validate input
    const validated = CreateNotificationSchema.parse(input);

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validated),
    });

    if (!response.ok) {
      throw new Error(`Failed to create notification: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get notifications for a user with optional filters
   */
  async getNotifications(
    userId: string,
    filters?: NotificationFilters
  ): Promise<Notification[]> {
    const params = new URLSearchParams();
    params.append('userId', userId);

    if (filters) {
      if (filters.types?.length) {
        params.append('types', filters.types.join(','));
      }
      if (filters.priorities?.length) {
        params.append('priorities', filters.priorities.join(','));
      }
      if (filters.statuses?.length) {
        params.append('statuses', filters.statuses.join(','));
      }
      if (filters.channels?.length) {
        params.append('channels', filters.channels.join(','));
      }
      if (filters.startDate) {
        params.append('startDate', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        params.append('endDate', filters.endDate.toISOString());
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
    }

    const response = await fetch(`${this.baseUrl}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get a single notification by ID
   */
  async getById(id: string): Promise<Notification> {
    const response = await fetch(`${this.baseUrl}/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch notification: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<Notification> {
    const response = await fetch(`${this.baseUrl}/${id}/read`, {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error(`Failed to mark notification as read: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Mark multiple notifications as read
   */
  async markMultipleAsRead(ids: string[]): Promise<void> {
    const response = await fetch(`${this.baseUrl}/read-multiple`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      throw new Error(`Failed to mark notifications as read: ${response.statusText}`);
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/read-all`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to mark all notifications as read: ${response.statusText}`);
    }
  }

  /**
   * Snooze a notification
   */
  async snooze(id: string, snoozedUntil: Date): Promise<Notification> {
    const response = await fetch(`${this.baseUrl}/${id}/snooze`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ snoozedUntil }),
    });

    if (!response.ok) {
      throw new Error(`Failed to snooze notification: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Archive a notification
   */
  async archive(id: string): Promise<Notification> {
    const response = await fetch(`${this.baseUrl}/${id}/archive`, {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error(`Failed to archive notification: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Delete a notification
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete notification: ${response.statusText}`);
    }
  }

  /**
   * Get grouped notifications
   */
  async getGrouped(
    userId: string,
    filters?: NotificationFilters
  ): Promise<NotificationGroup[]> {
    const params = new URLSearchParams();
    params.append('userId', userId);
    params.append('grouped', 'true');

    if (filters) {
      if (filters.types?.length) {
        params.append('types', filters.types.join(','));
      }
      if (filters.statuses?.length) {
        params.append('statuses', filters.statuses.join(','));
      }
    }

    const response = await fetch(`${this.baseUrl}/grouped?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch grouped notifications: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get notification statistics
   */
  async getStats(userId: string): Promise<NotificationStats> {
    const response = await fetch(`${this.baseUrl}/stats?userId=${userId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch notification stats: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    const response = await fetch(`${this.baseUrl}/unread-count?userId=${userId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch unread count: ${response.statusText}`);
    }

    const data = await response.json();
    return data.count;
  }

  /**
   * Execute a notification action
   */
  async executeAction(
    notificationId: string,
    actionId: string
  ): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/${notificationId}/actions/${actionId}`,
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to execute notification action: ${response.statusText}`);
    }
  }

  /**
   * Retry failed delivery
   */
  async retryDelivery(
    notificationId: string,
    channel: DeliveryChannel
  ): Promise<Notification> {
    const response = await fetch(
      `${this.baseUrl}/${notificationId}/retry`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channel }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to retry notification delivery: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Group notifications by type or key
   */
  groupNotifications(notifications: Notification[]): NotificationGroup[] {
    const groups = new Map<string, Notification[]>();

    notifications.forEach((notification) => {
      const key = notification.groupKey || notification.type;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(notification);
    });

    return Array.from(groups.entries()).map(([key, notifs]) => {
      const sortedNotifs = notifs.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      const latest = sortedNotifs[0];

      return {
        key,
        type: latest.type,
        count: notifs.length,
        notifications: sortedNotifs,
        latestTimestamp: latest.createdAt,
        summary: this.generateGroupSummary(key, notifs),
      };
    });
  }

  /**
   * Generate summary for a notification group
   */
  private generateGroupSummary(key: string, notifications: Notification[]): string {
    const count = notifications.length;
    const type = notifications[0].type;

    if (count === 1) {
      return notifications[0].title;
    }

    const typeLabels: Record<string, string> = {
      [NotificationType.MEDICATION_REMINDER]: 'medication reminders',
      [NotificationType.APPOINTMENT_REMINDER]: 'appointment reminders',
      [NotificationType.IMMUNIZATION_DUE]: 'immunization notices',
      [NotificationType.INCIDENT_FOLLOW_UP]: 'incident follow-ups',
      [NotificationType.DOCUMENT_EXPIRING]: 'document expirations',
    };

    const label = typeLabels[type] || 'notifications';
    return `${count} ${label}`;
  }
}

// Singleton instance
export const notificationService = new NotificationService();
