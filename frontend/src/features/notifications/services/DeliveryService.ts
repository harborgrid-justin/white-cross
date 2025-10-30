import {
  Notification,
  NotificationStatus,
  DeliveryChannel,
} from '../types/notification';
import { NotificationPreferences } from '../types/preferences';

/**
 * Delivery status for a specific channel
 */
export interface DeliveryResult {
  channel: DeliveryChannel;
  status: NotificationStatus;
  deliveredAt?: Date;
  error?: string;
}

/**
 * Offline queue item
 */
export interface QueuedDelivery {
  id: string;
  notificationId: string;
  channel: DeliveryChannel;
  attempts: number;
  maxAttempts: number;
  nextRetryAt: Date;
  data: any;
  createdAt: Date;
}

/**
 * DeliveryService
 *
 * Handles multi-channel notification delivery with offline queue and retry logic
 */
export class DeliveryService {
  private baseUrl: string;
  private offlineQueue: QueuedDelivery[] = [];
  private retryIntervals = [1000, 5000, 15000, 60000, 300000]; // Exponential backoff

  constructor(baseUrl: string = '/notifications/delivery') {
    this.baseUrl = baseUrl;
    this.initializeOfflineQueue();
  }

  /**
   * Initialize offline queue from localStorage
   */
  private initializeOfflineQueue(): void {
    try {
      const stored = localStorage.getItem('notification_queue');
      if (stored) {
        this.offlineQueue = JSON.parse(stored, (key, value) => {
          if (key === 'nextRetryAt' || key === 'createdAt') {
            return new Date(value);
          }
          return value;
        });
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }

  /**
   * Save offline queue to localStorage
   */
  private saveOfflineQueue(): void {
    try {
      localStorage.setItem('notification_queue', JSON.stringify(this.offlineQueue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  /**
   * Deliver notification via multiple channels
   */
  async deliver(
    notification: Notification,
    preferences?: NotificationPreferences
  ): Promise<DeliveryResult[]> {
    const results: DeliveryResult[] = [];
    const channels = this.determineChannels(notification, preferences);

    // Deliver via each channel
    for (const channel of channels) {
      try {
        const result = await this.deliverViaChannel(notification, channel);
        results.push(result);
      } catch (error) {
        // Queue for retry if delivery fails
        this.queueForRetry(notification, channel);
        results.push({
          channel,
          status: NotificationStatus.FAILED,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  /**
   * Determine which channels to use based on preferences and notification type
   */
  private determineChannels(
    notification: Notification,
    preferences?: NotificationPreferences
  ): DeliveryChannel[] {
    if (!preferences) {
      return notification.channels;
    }

    // Check global preferences
    if (!preferences.enabled) {
      return [];
    }

    // Check type-specific preferences
    const typePrefs = preferences.typePreferences[notification.type];
    if (!typePrefs || !typePrefs.enabled) {
      return [];
    }

    // Check quiet hours
    if (this.isQuietHours(preferences) && !this.isEmergency(notification)) {
      return [DeliveryChannel.IN_APP]; // Only in-app during quiet hours
    }

    // Filter channels based on preferences and min priority
    const channels = notification.channels.filter((channel) => {
      if (!typePrefs.channels.enabled) {
        return false;
      }

      if (!typePrefs.channels.channels.includes(channel)) {
        return false;
      }

      // Check minimum priority for this channel
      if (typePrefs.channels.minPriority) {
        const priorityLevels = {
          low: 1,
          medium: 2,
          high: 3,
          urgent: 4,
          emergency: 5,
        };

        const notificationPriority =
          priorityLevels[notification.priority as keyof typeof priorityLevels];
        const minPriority =
          priorityLevels[typePrefs.channels.minPriority as keyof typeof priorityLevels];

        if (notificationPriority < minPriority) {
          return false;
        }
      }

      return true;
    });

    return channels;
  }

  /**
   * Check if current time is within quiet hours
   */
  private isQuietHours(preferences: NotificationPreferences): boolean {
    if (!preferences.quietHours.enabled) {
      return false;
    }

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Check if current day is in quiet hours
    if (!preferences.quietHours.daysOfWeek.includes(currentDay)) {
      return false;
    }

    // Parse start and end times
    const [startHour, startMin] = preferences.quietHours.startTime.split(':').map(Number);
    const [endHour, endMin] = preferences.quietHours.endTime.split(':').map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    // Handle overnight quiet hours
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime < endTime;
    }

    return currentTime >= startTime && currentTime < endTime;
  }

  /**
   * Check if notification is emergency
   */
  private isEmergency(notification: Notification): boolean {
    return (
      notification.priority === 'emergency' ||
      notification.type === 'emergency_alert' ||
      notification.type === 'emergency_broadcast'
    );
  }

  /**
   * Deliver notification via specific channel
   */
  private async deliverViaChannel(
    notification: Notification,
    channel: DeliveryChannel
  ): Promise<DeliveryResult> {
    const response = await fetch(`${this.baseUrl}/${channel}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notification }),
    });

    if (!response.ok) {
      throw new Error(`Failed to deliver via ${channel}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      channel,
      status: NotificationStatus.DELIVERED,
      deliveredAt: new Date(data.deliveredAt),
    };
  }

  /**
   * Queue notification for retry
   */
  private queueForRetry(notification: Notification, channel: DeliveryChannel): void {
    const queued: QueuedDelivery = {
      id: `${notification.id}-${channel}-${Date.now()}`,
      notificationId: notification.id,
      channel,
      attempts: 0,
      maxAttempts: 5,
      nextRetryAt: new Date(Date.now() + this.retryIntervals[0]),
      data: notification,
      createdAt: new Date(),
    };

    this.offlineQueue.push(queued);
    this.saveOfflineQueue();
  }

  /**
   * Process offline queue
   */
  async processQueue(): Promise<void> {
    const now = new Date();
    const toRetry = this.offlineQueue.filter((item) => item.nextRetryAt <= now);

    for (const item of toRetry) {
      try {
        await this.deliverViaChannel(item.data, item.channel);

        // Remove from queue on success
        this.offlineQueue = this.offlineQueue.filter((q) => q.id !== item.id);
      } catch (error) {
        // Increment attempts
        item.attempts++;

        if (item.attempts >= item.maxAttempts) {
          // Max attempts reached, remove from queue
          this.offlineQueue = this.offlineQueue.filter((q) => q.id !== item.id);
          console.error(`Max retry attempts reached for notification ${item.notificationId}`);
        } else {
          // Schedule next retry with exponential backoff
          const retryDelay = this.retryIntervals[Math.min(item.attempts, this.retryIntervals.length - 1)];
          item.nextRetryAt = new Date(Date.now() + retryDelay);
        }
      }
    }

    this.saveOfflineQueue();
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.offlineQueue.length;
  }

  /**
   * Clear queue
   */
  clearQueue(): void {
    this.offlineQueue = [];
    this.saveOfflineQueue();
  }

  /**
   * Send in-app notification (via WebSocket)
   */
  async sendInApp(notification: Notification): Promise<DeliveryResult> {
    // This will be handled by WebSocket connection
    return {
      channel: DeliveryChannel.IN_APP,
      status: NotificationStatus.DELIVERED,
      deliveredAt: new Date(),
    };
  }

  /**
   * Send email notification
   */
  async sendEmail(notification: Notification): Promise<DeliveryResult> {
    return this.deliverViaChannel(notification, DeliveryChannel.EMAIL);
  }

  /**
   * Send SMS notification
   */
  async sendSMS(notification: Notification): Promise<DeliveryResult> {
    return this.deliverViaChannel(notification, DeliveryChannel.SMS);
  }

  /**
   * Send push notification
   */
  async sendPush(notification: Notification): Promise<DeliveryResult> {
    // Check if browser supports push notifications
    if (!('Notification' in window)) {
      throw new Error('Browser does not support push notifications');
    }

    // Check permission
    if (Notification.permission !== 'granted') {
      throw new Error('Push notification permission not granted');
    }

    return this.deliverViaChannel(notification, DeliveryChannel.PUSH);
  }

  /**
   * Send voice notification (emergency only)
   */
  async sendVoice(notification: Notification): Promise<DeliveryResult> {
    if (!this.isEmergency(notification)) {
      throw new Error('Voice notifications are only available for emergency alerts');
    }

    return this.deliverViaChannel(notification, DeliveryChannel.VOICE);
  }

  /**
   * Request push notification permission
   */
  async requestPushPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Browser does not support push notifications');
    }

    return Notification.requestPermission();
  }
}

// Singleton instance
export const deliveryService = new DeliveryService();

// Process queue periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    deliveryService.processQueue();
  }, 60000); // Check every minute
}
