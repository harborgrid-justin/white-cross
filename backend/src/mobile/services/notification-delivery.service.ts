import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DeviceToken, PushNotification } from '../entities';
import { SendNotificationDto } from '../dto';
import {
  DeliveryStatus,
  NotificationPlatform,
  NotificationPriority,
  NotificationStatus,
} from '../enums';
import { NotificationPlatformService } from './notification-platform.service';
import { DeviceTokenService } from './device-token.service';

import { BaseService } from '@/common/base';
/**
 * Notification Delivery Service
 *
 * @description
 * Handles the core notification delivery logic.
 * Manages notification creation, platform-specific delivery, and delivery tracking.
 *
 * This service provides:
 * - Notification record creation
 * - Multi-platform delivery orchestration
 * - Delivery status tracking
 * - Token validation during delivery
 * - Retry time calculation
 *
 * @example
 * ```typescript
 * // Send a notification
 * const notification = await deliveryService.sendNotification(userId, {
 *   userIds: ['user1', 'user2'],
 *   title: 'Medication Reminder',
 *   body: 'Time to take your medication',
 *   category: NotificationCategory.MEDICATION,
 *   priority: NotificationPriority.HIGH
 * });
 * ```
 */
@Injectable()
export class NotificationDeliveryService extends BaseService {
  constructor(
    @InjectModel(PushNotification)
    private readonly notificationModel: typeof PushNotification,
    @InjectModel(DeviceToken)
    private readonly deviceTokenModel: typeof DeviceToken,
    private readonly platformService: NotificationPlatformService,
    private readonly deviceTokenService: DeviceTokenService,
  ) {}

  /**
   * Send push notification to users
   *
   * @param userId - The user ID creating the notification
   * @param dto - Notification data
   * @returns Created notification record
   *
   * @description
   * Creates a notification record and either sends it immediately or schedules it.
   * If scheduledFor is not provided, the notification is delivered immediately.
   */
  async sendNotification(
    userId: string,
    dto: SendNotificationDto,
  ): Promise<PushNotification> {
    try {
      // Get active device tokens for target users
      const deviceTokens = await this.deviceTokenService.getActiveTokensForUsers(
        dto.userIds,
      );

      // Create notification record
      const notification = await this.notificationModel.create({
        userIds: dto.userIds,
        deviceTokens: deviceTokens.map((t) => t.token),
        title: dto.title,
        body: dto.body,
        category: dto.category,
        priority: dto.priority || NotificationPriority.NORMAL,
        data: dto.data,
        actions: dto.actions,
        imageUrl: dto.imageUrl,
        sound: dto.sound,
        badge: dto.badge,
        scheduledFor: dto.scheduledFor,
        status: dto.scheduledFor
          ? NotificationStatus.SCHEDULED
          : NotificationStatus.PENDING,
        totalRecipients: deviceTokens.length,
        successfulDeliveries: 0,
        failedDeliveries: 0,
        deliveryResults: [],
        createdBy: userId,
        silent: false,
        requireInteraction: false,
        clickedCount: 0,
        dismissedCount: 0,
        retryCount: 0,
        maxRetries: 3,
      });

      // Send immediately if not scheduled
      if (!dto.scheduledFor && notification.id) {
        await this.deliverNotification(notification.id);
      }

      this.logInfo(
        `Notification created: ${notification.id} for ${deviceTokens.length} recipients`,
      );

      return notification;
    } catch (error) {
      this.logError('Error sending notification', error);
      throw error;
    }
  }

  /**
   * Deliver notification to devices
   *
   * @param notificationId - The notification ID to deliver
   *
   * @description
   * Orchestrates the delivery process:
   * 1. Groups tokens by platform
   * 2. Sends to each platform
   * 3. Tracks delivery results
   * 4. Updates token validity
   * 5. Calculates retry time if needed
   */
  async deliverNotification(notificationId: string): Promise<void> {
    try {
      const notification = await this.notificationModel.findOne({
        where: { id: notificationId },
      });

      if (!notification) {
        throw new NotFoundException('Notification not found');
      }

      notification.status = NotificationStatus.SENDING;
      notification.sentAt = new Date();
      await notification.save();

      // Get device tokens
      const tokens = await this.deviceTokenModel.findAll({
        where: {
          token: notification.deviceTokens,
          isActive: true,
          isValid: true,
        },
      });

      // Group by platform
      const byPlatform = new Map<NotificationPlatform, DeviceToken[]>();
      for (const token of tokens) {
        if (!byPlatform.has(token.platform)) {
          byPlatform.set(token.platform, []);
        }
        byPlatform.get(token.platform)!.push(token);
      }

      // Send to each platform
      for (const [platform, platformTokens] of byPlatform) {
        for (const token of platformTokens) {
          if (!token.allowNotifications) continue;

          try {
            const result = await this.platformService.sendToPlatform(
              platform,
              token,
              notification,
            );

            notification.deliveryResults.push({
              platform,
              deviceToken: token.token,
              status: result.success
                ? DeliveryStatus.SUCCESS
                : DeliveryStatus.FAILED,
              response: result.response,
              error: result.error,
              deliveredAt: result.success ? new Date() : undefined,
            });

            if (result.success) {
              notification.successfulDeliveries++;
              await this.deviceTokenService.updateLastUsed(token.id!);
            } else {
              notification.failedDeliveries++;

              // Mark token as invalid if permanently failed
              if (result.invalidToken) {
                await this.deviceTokenService.markTokenAsInvalid(
                  token.id!,
                  result.error || 'Unknown error',
                );
              }
            }
          } catch (error) {
            notification.deliveryResults.push({
              platform,
              deviceToken: token.token,
              status: DeliveryStatus.FAILED,
              error: String(error),
            });
            notification.failedDeliveries++;
          }
        }
      }

      // Update final status
      if (notification.successfulDeliveries > 0) {
        notification.status = NotificationStatus.DELIVERED;
        notification.deliveredAt = new Date();
      } else {
        notification.status = NotificationStatus.FAILED;
        notification.failedAt = new Date();

        // Schedule retry if under max retries
        if (notification.retryCount < notification.maxRetries) {
          notification.nextRetryAt = this.calculateRetryTime(
            notification.retryCount,
          );
        }
      }

      await notification.save();

      this.logInfo(
        `Notification delivered: ${notificationId} - ${notification.successfulDeliveries} success, ${notification.failedDeliveries} failed`,
      );
    } catch (error) {
      this.logError('Error delivering notification', error);
      throw error;
    }
  }

  /**
   * Get notification by ID
   *
   * @param notificationId - The notification ID
   * @returns The notification
   * @throws NotFoundException if not found
   */
  async getNotification(notificationId: string): Promise<PushNotification> {
    const notification = await this.notificationModel.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  /**
   * Calculate retry time based on retry count
   *
   * @param retryCount - Current retry count
   * @returns Date for next retry attempt
   *
   * @description
   * Uses exponential backoff: 5 minutes, 15 minutes, 30 minutes.
   */
  private calculateRetryTime(retryCount: number): Date {
    const delays = [5, 15, 30]; // minutes
    const delayMinutes = delays[Math.min(retryCount, delays.length - 1)]!;
    const nextRetry = new Date();
    nextRetry.setMinutes(nextRetry.getMinutes() + delayMinutes);
    return nextRetry;
  }
}
