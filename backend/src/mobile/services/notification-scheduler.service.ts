import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { PushNotification } from '../entities';
import { NotificationStatus } from '../enums';
import { NotificationDeliveryService } from './notification-delivery.service';

import { BaseService } from '../../common/base';
/**
 * Notification Scheduler Service
 *
 * @description
 * Manages scheduled notifications, retries, and notification lifecycle.
 * Handles time-based notification processing and cleanup.
 *
 * This service provides:
 * - Scheduled notification processing
 * - Failed notification retry logic
 * - Notification expiration handling
 * - Old notification cleanup
 *
 * @example
 * Process scheduled notifications (typically called by a cron job):
 * - Every minute cron job to process scheduled notifications
 * - Every 5 minutes to retry failed notifications
 * - Daily at 2 AM to clean up old notifications
 */
@Injectable()
export class NotificationSchedulerService extends BaseService {
  constructor(
    @InjectModel(PushNotification)
    private readonly notificationModel: typeof PushNotification,
    private readonly deliveryService: NotificationDeliveryService,
  ) {}

  /**
   * Process scheduled notifications
   *
   * @description
   * This method should be called periodically (e.g., every minute) by a cron job
   * or background worker to process notifications scheduled for delivery.
   *
   * @returns Number of notifications processed
   *
   * @example
   * This method is typically called by a cron job that runs every minute
   * to check for and process notifications that are due for delivery.
   */
  async processScheduledNotifications(): Promise<number> {
    try {
      const now = new Date();

      // Find scheduled notifications that are due for delivery
      const scheduledNotifications = await this.notificationModel.findAll({
        where: {
          status: NotificationStatus.SCHEDULED,
          scheduledFor: {
            [Op.lte]: now,
          },
        },
        order: [['scheduledFor', 'ASC']],
        limit: 100, // Process in batches
      });

      this.logInfo(
        `Processing ${scheduledNotifications.length} scheduled notifications`,
      );

      for (const notification of scheduledNotifications) {
        try {
          // Check if notification has expired
          if (notification.expiresAt && notification.expiresAt < now) {
            notification.status = NotificationStatus.EXPIRED;
            await notification.save();
            this.logWarning(`Notification ${notification.id} expired`);
            continue;
          }

          // Deliver the notification
          if (notification.id) {
            await this.deliveryService.deliverNotification(notification.id);
          }
        } catch (error) {
          this.logError(
            `Failed to deliver scheduled notification ${notification.id}`,
            error,
          );
        }
      }

      return scheduledNotifications.length;
    } catch (error) {
      this.logError('Error processing scheduled notifications', error);
      return 0;
    }
  }

  /**
   * Retry failed notifications
   *
   * @description
   * Attempts to retry notifications that failed delivery but haven't exceeded
   * their maximum retry count.
   *
   * @returns Number of notifications retried
   *
   * @example
   * This method is typically called by a cron job that runs every 5 minutes
   * to retry notifications that previously failed delivery.
   */
  async retryFailedNotifications(): Promise<number> {
    try {
      const now = new Date();

      // Find failed notifications eligible for retry
      const failedNotifications = await this.notificationModel.findAll({
        where: {
          status: NotificationStatus.FAILED,
        },
        order: [['nextRetryAt', 'ASC']],
        limit: 50, // Process in batches
      });

      // Filter notifications that haven't exceeded max retries and are due for retry
      const eligibleNotifications = failedNotifications.filter(
        (n) =>
          n.retryCount < n.maxRetries &&
          (!n.nextRetryAt || n.nextRetryAt <= now),
      );

      this.logInfo(
        `Retrying ${eligibleNotifications.length} failed notifications`,
      );

      for (const notification of eligibleNotifications) {
        try {
          notification.retryCount++;
          notification.status = NotificationStatus.PENDING;
          notification.nextRetryAt = undefined;
          await notification.save();

          if (notification.id) {
            await this.deliveryService.deliverNotification(notification.id);
          }
        } catch (error) {
          this.logError(
            `Failed to retry notification ${notification.id}`,
            error,
          );
        }
      }

      return eligibleNotifications.length;
    } catch (error) {
      this.logError('Error retrying failed notifications', error);
      return 0;
    }
  }

  /**
   * Clean up old notifications
   *
   * @param retentionDays - Number of days to retain notification records
   * @returns Number of notifications deleted
   *
   * @description
   * Removes old notification records to prevent database growth.
   * Should be run periodically (e.g., daily).
   *
   * @example
   * This method is typically called by a daily cron job (e.g., at 2 AM)
   * to remove old notification records and prevent database bloat.
   */
  async cleanupOldNotifications(retentionDays: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const deletedCount = await this.notificationModel.destroy({
        where: {
          createdAt: {
            [Op.lt]: cutoffDate,
          },
          status: {
            [Op.in]: [NotificationStatus.DELIVERED, NotificationStatus.EXPIRED],
          },
        },
      });

      this.logInfo(
        `Cleaned up ${deletedCount} old notifications (older than ${retentionDays} days)`,
      );

      return deletedCount;
    } catch (error) {
      this.logError('Error cleaning up old notifications', error);
      return 0;
    }
  }

  /**
   * Mark expired notifications
   *
   * @description
   * Finds notifications that have passed their expiration time and marks them as expired.
   * This prevents delivery of time-sensitive notifications after they're no longer relevant.
   *
   * @returns Number of notifications marked as expired
   */
  async markExpiredNotifications(): Promise<number> {
    try {
      const now = new Date();

      const [updatedCount] = await this.notificationModel.update(
        { status: NotificationStatus.EXPIRED },
        {
          where: {
            status: {
              [Op.in]: [NotificationStatus.SCHEDULED, NotificationStatus.PENDING],
            },
            expiresAt: {
              [Op.lt]: now,
            },
          },
        },
      );

      if (updatedCount > 0) {
        this.logInfo(`Marked ${updatedCount} notifications as expired`);
      }

      return updatedCount;
    } catch (error) {
      this.logError('Error marking expired notifications', error);
      return 0;
    }
  }

  /**
   * Get scheduler statistics
   *
   * @returns Statistics about scheduled and failed notifications
   */
  async getSchedulerStats(): Promise<{
    scheduled: number;
    pendingRetry: number;
    expired: number;
  }> {
    const now = new Date();

    const [scheduled, pendingRetry, expired] = await Promise.all([
      this.notificationModel.count({
        where: {
          status: NotificationStatus.SCHEDULED,
          scheduledFor: {
            [Op.gt]: now,
          },
        },
      }),
      this.notificationModel.count({
        where: {
          status: NotificationStatus.FAILED,
          retryCount: {
            [Op.lt]: this.notificationModel.sequelize!.col('maxRetries'),
          },
        },
      }),
      this.notificationModel.count({
        where: {
          status: NotificationStatus.EXPIRED,
        },
      }),
    ]);

    return {
      scheduled,
      pendingRetry,
      expired,
    };
  }
}
