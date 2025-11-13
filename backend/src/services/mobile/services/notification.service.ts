import { Injectable, Logger } from '@nestjs/common';
import { MobileUpdatePreferencesDto, RegisterDeviceDto, SendNotificationDto } from '../dto';
import { DeviceToken } from '@/database/models/device-token.model';
import { PushNotification } from '@/database/models/push-notification.model';
import { NotificationCategory, NotificationStatus } from '../enums';
import { DeviceTokenService } from './device-token.service';
import { NotificationAnalyticsService } from './notification-analytics.service';
import { NotificationDeliveryService } from './notification-delivery.service';
import { NotificationSchedulerService } from './notification-scheduler.service';
import { BaseService } from '@/common/base';
import {
  NotificationTemplate,
  NotificationTemplateService,
} from './notification-template.service';

/**
 * Notification Service
 *
 * @description
 * Main notification service that provides a unified API for push notification functionality.
 * This service orchestrates multiple specialized services:
 * - Device token management (DeviceTokenService)
 * - Notification delivery (NotificationDeliveryService)
 * - Scheduling and retries (NotificationSchedulerService)
 * - Analytics and tracking (NotificationAnalyticsService)
 * - Template management (NotificationTemplateService)
 *
 * @example
 * ```typescript
 * // Register a device
 * const token = await notificationService.registerDeviceToken(userId, {
 *   deviceId: 'device-123',
 *   platform: NotificationPlatform.FCM,
 *   token: 'fcm-token-...',
 *   deviceName: 'iPhone 13'
 * });
 *
 * // Send notification
 * const notification = await notificationService.sendNotification(userId, {
 *   userIds: ['user1', 'user2'],
 *   title: 'Medication Reminder',
 *   body: 'Time to take your medication',
 *   category: NotificationCategory.MEDICATION,
 *   priority: NotificationPriority.HIGH
 * });
 *
 * // Send from template
 * const templatedNotification = await notificationService.sendFromTemplate(
 *   userId,
 *   'medication-reminder',
 *   { medicationName: 'Aspirin', dosage: '100mg' },
 *   ['user1', 'user2']
 * );
 * ```
 */
@Injectable()
export class NotificationService extends BaseService {
  constructor(
    private readonly deviceTokenService: DeviceTokenService,
    private readonly deliveryService: NotificationDeliveryService,
    private readonly schedulerService: NotificationSchedulerService,
    private readonly analyticsService: NotificationAnalyticsService,
    private readonly templateService: NotificationTemplateService,
  ) {}

  // ==================== Device Token Management ====================

  /**
   * Register a device token for push notifications
   *
   * @param userId - The user ID
   * @param dto - Device registration data
   * @returns The created device token
   */
  async registerDeviceToken(
    userId: string,
    dto: RegisterDeviceDto,
  ): Promise<DeviceToken> {
    return this.deviceTokenService.registerDeviceToken(userId, dto);
  }

  /**
   * Unregister a device token
   *
   * @param userId - The user ID
   * @param tokenId - The token ID to unregister
   */
  async unregisterDeviceToken(userId: string, tokenId: string): Promise<void> {
    return this.deviceTokenService.unregisterDeviceToken(userId, tokenId);
  }

  /**
   * Get user's registered devices
   *
   * @param userId - The user ID
   * @returns Array of active and valid device tokens
   */
  async getUserDevices(userId: string): Promise<DeviceToken[]> {
    return this.deviceTokenService.getUserDevices(userId);
  }

  /**
   * Update notification preferences for a device
   *
   * @param userId - The user ID
   * @param tokenId - The device token ID
   * @param dto - Preference update data
   * @returns Updated device token
   */
  async updatePreferences(
    userId: string,
    tokenId: string,
    dto: MobileUpdatePreferencesDto,
  ): Promise<DeviceToken> {
    return this.deviceTokenService.updatePreferences(userId, tokenId, dto);
  }

  // ==================== Notification Delivery ====================

  /**
   * Send push notification to users
   *
   * @param userId - The user ID creating the notification
   * @param dto - Notification data
   * @returns Created notification record
   */
  async sendNotification(
    userId: string,
    dto: SendNotificationDto,
  ): Promise<PushNotification> {
    return this.deliveryService.sendNotification(userId, dto);
  }

  /**
   * Get notification by ID
   *
   * @param notificationId - The notification ID
   * @returns The notification
   */
  async getNotification(notificationId: string): Promise<PushNotification> {
    return this.deliveryService.getNotification(notificationId);
  }

  // ==================== Template Management ====================

  /**
   * Get a notification template by ID
   *
   * @param templateId - The template ID
   * @returns The notification template
   */
  getTemplate(templateId: string): NotificationTemplate {
    return this.templateService.getTemplate(templateId);
  }

  /**
   * Get all available templates
   *
   * @returns Array of all notification templates
   */
  getAllTemplates(): NotificationTemplate[] {
    return this.templateService.getAllTemplates();
  }

  /**
   * Get templates by category
   *
   * @param category - The notification category
   * @returns Array of templates for the specified category
   */
  getTemplatesByCategory(category: NotificationCategory): NotificationTemplate[] {
    return this.templateService.getTemplatesByCategory(category);
  }

  /**
   * Render a template with variables
   *
   * @param templateId - The template ID
   * @param variables - Variable values for substitution
   * @returns Rendered title and body
   */
  renderTemplate(
    templateId: string,
    variables: Record<string, string>,
  ): { title: string; body: string } {
    return this.templateService.renderTemplate(templateId, variables);
  }

  /**
   * Send notification from template
   *
   * @param userId - The user ID
   * @param templateId - The template ID
   * @param variables - Template variables
   * @param userIds - Target user IDs
   * @param options - Additional notification options
   * @returns The created notification
   */
  async sendFromTemplate(
    userId: string,
    templateId: string,
    variables: Record<string, string>,
    userIds: string[],
    options?: Partial<SendNotificationDto>,
  ): Promise<PushNotification> {
    const template = this.templateService.getTemplate(templateId);
    const { title, body } = this.templateService.renderTemplate(templateId, variables);

    return this.deliveryService.sendNotification(userId, {
      userIds,
      title,
      body,
      category: template.category,
      priority: template.priority,
      sound: template.sound,
      actions: template.actions,
      ...options,
    });
  }

  // ==================== Scheduling & Lifecycle ====================

  /**
   * Process scheduled notifications
   *
   * @returns Number of notifications processed
   */
  async processScheduledNotifications(): Promise<number> {
    return this.schedulerService.processScheduledNotifications();
  }

  /**
   * Retry failed notifications
   *
   * @returns Number of notifications retried
   */
  async retryFailedNotifications(): Promise<number> {
    return this.schedulerService.retryFailedNotifications();
  }

  /**
   * Clean up old notifications
   *
   * @param retentionDays - Number of days to retain notification records
   * @returns Number of notifications deleted
   */
  async cleanupOldNotifications(retentionDays: number = 90): Promise<number> {
    return this.schedulerService.cleanupOldNotifications(retentionDays);
  }

  /**
   * Mark expired notifications
   *
   * @returns Number of notifications marked as expired
   */
  async markExpiredNotifications(): Promise<number> {
    return this.schedulerService.markExpiredNotifications();
  }

  // ==================== Analytics & Tracking ====================

  /**
   * Track notification interaction
   *
   * @param notificationId - The notification ID
   * @param action - The interaction action (CLICKED or DISMISSED)
   */
  async trackInteraction(
    notificationId: string,
    action: 'CLICKED' | 'DISMISSED',
  ): Promise<void> {
    return this.analyticsService.trackInteraction(notificationId, action);
  }

  /**
   * Get notification analytics for a period
   *
   * @param period - Time period for analytics
   * @returns Analytics summary
   */
  async getAnalytics(period: { start: Date; end: Date }): Promise<any> {
    return this.analyticsService.getAnalytics(period);
  }

  /**
   * Get notification history for a user
   *
   * @param userId - The user ID
   * @param options - Query options
   * @returns Array of notifications
   */
  async getNotificationHistory(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      status?: NotificationStatus;
      category?: NotificationCategory;
    },
  ): Promise<PushNotification[]> {
    return this.analyticsService.getNotificationHistory(userId, options);
  }

  /**
   * Get notification statistics for a user
   *
   * @param userId - The user ID
   * @param period - Optional time period
   * @returns Notification statistics
   */
  async getUserNotificationStats(
    userId: string,
    period?: { start: Date; end: Date },
  ): Promise<any> {
    return this.analyticsService.getUserNotificationStats(userId, period);
  }

  /**
   * Get category analytics for a period
   *
   * @param period - Time period for analytics
   * @returns Analytics broken down by category
   */
  async getCategoryAnalytics(period: { start: Date; end: Date }): Promise<any> {
    return this.analyticsService.getCategoryAnalytics(period);
  }

  /**
   * Get engagement trends over time
   *
   * @param period - Time period for analysis
   * @param groupBy - Grouping interval
   * @returns Engagement metrics over time
   */
  async getEngagementTrends(
    period: { start: Date; end: Date },
    groupBy: 'day' | 'week' | 'month' = 'day',
  ): Promise<any> {
    return this.analyticsService.getEngagementTrends(period, groupBy);
  }
}
