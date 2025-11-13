/**
 * @fileoverview Alert Retry Service
 * @module alerts/services
 * @description Handles retry logic for failed alert deliveries with exponential backoff
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Alert, DeliveryLog } from '@/database';
import { AlertDeliveryService } from './alert-delivery.service';

import { BaseService } from '../../../common/base';
@Injectable()
export class AlertRetryService extends BaseService {
  constructor(
    @InjectModel(Alert)
    private readonly alertModel: typeof Alert,
    @InjectModel(DeliveryLog)
    private readonly deliveryLogModel: typeof DeliveryLog,
    private readonly deliveryService: AlertDeliveryService,
  ) {}

  /**
   * Retry failed alert deliveries with exponential backoff
   */
  async retryFailedAlerts(): Promise<void> {
    this.logInfo('Checking for failed alert deliveries to retry...');

    let retriedCount = 0;

    // Find all failed delivery logs
    const failedLogs = await this.deliveryLogModel.findAll({
      where: {
        success: false,
      },
      include: [Alert],
    });

    for (const log of failedLogs) {
      // Check if ready for retry using model method
      if (!log.isReadyForRetry()) {
        continue;
      }

      // Get the alert
      const alert = log.alert || (await this.alertModel.findByPk(log.alertId));
      if (!alert) continue;

      try {
        await this.deliveryService.retryDelivery(alert, log.channel, log.recipientId);
        retriedCount++;
      } catch (error) {
        this.logError(
          `Retry failed for alert ${log.alertId} on ${log.channel}`,
          error,
        );
      }
    }

    this.logInfo(`Retried ${retriedCount} failed alert deliveries`);
  }

  /**
   * Schedule auto-escalation
   */
  scheduleAutoEscalation(alertId: string, delayMinutes: number): void {
    this.logInfo(
      `Scheduling auto-escalation for alert ${alertId} in ${delayMinutes} minutes`,
    );

    setTimeout(
      async () => {
        const alert = await this.alertModel.findByPk(alertId);
        if (
          alert &&
          alert.status === 'ACTIVE' &&
          !alert.acknowledgedAt
        ) {
          alert.escalationLevel = (alert.escalationLevel || 0) + 1;
          await alert.save();
          this.logWarning(
            `Alert ${alertId} auto-escalated to level ${alert.escalationLevel}`,
          );
          // Note: In the refactored version, we would need to call the main service
          // to re-deliver to subscribers, or emit an event for the main service to handle
        }
      },
      delayMinutes * 60 * 1000,
    );
  }

  /**
   * Schedule alert expiration
   */
  scheduleExpiration(alertId: string, expiresAt: Date): void {
    const delay = expiresAt.getTime() - Date.now();

    if (delay <= 0) {
      return; // Already expired
    }

    setTimeout(async () => {
      const alert = await this.alertModel.findByPk(alertId);
      if (alert && alert.status === 'ACTIVE') {
        alert.status = 'EXPIRED';
        await alert.save();
        this.logInfo(`Alert ${alertId} expired`);
      }
    }, delay);
  }

  /**
   * Get retry statistics
   */
  async getRetryStatistics(): Promise<{
    totalFailedDeliveries: number;
    retriesInProgress: number;
    maxRetriesExceeded: number;
    successfulRetries: number;
  }> {
    const allFailedLogs = await this.deliveryLogModel.findAll({
      where: {
        success: false,
      },
    });

    const retriesInProgress = allFailedLogs.filter(log => log.isReadyForRetry()).length;
    const maxRetriesExceeded = allFailedLogs.filter(log => !log.isReadyForRetry()).length;

    // Count successful retries (logs that were initially failed but now successful)
    const successfulRetries = await this.deliveryLogModel.count({
      where: {
        success: true,
        attemptCount: { [Op.gt]: 1 },
      },
    });

    return {
      totalFailedDeliveries: allFailedLogs.length,
      retriesInProgress,
      maxRetriesExceeded,
      successfulRetries,
    };
  }

  /**
   * Force retry a specific alert delivery
   */
  async forceRetryAlert(alertId: string, channel?: string): Promise<void> {
    const alert = await this.alertModel.findByPk(alertId);
    if (!alert) {
      throw new Error(`Alert ${alertId} not found`);
    }

    if (channel) {
      // Retry specific channel
      const deliveryChannel = channel as any; // Type assertion for delivery channel
      await this.deliveryService.retryDelivery(alert, deliveryChannel);
      this.logInfo(`Force retried alert ${alertId} on ${channel}`);
    } else {
      // Retry all failed channels for this alert
      const failedLogs = await this.deliveryLogModel.findAll({
        where: {
          alertId,
          success: false,
        },
      });

      for (const log of failedLogs) {
        try {
          await this.deliveryService.retryDelivery(alert, log.channel, log.recipientId);
        } catch (error) {
          this.logError(
            `Force retry failed for alert ${alertId} on ${log.channel}`,
            error,
          );
        }
      }

      this.logInfo(`Force retried all failed deliveries for alert ${alertId}`);
    }
  }

  /**
   * Clean up old failed delivery logs
   */
  async cleanupOldFailedLogs(olderThanDays: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const deletedCount = await this.deliveryLogModel.destroy({
      where: {
        success: false,
        lastAttempt: {
          [Op.lt]: cutoffDate,
        },
      },
    });

    this.logInfo(`Cleaned up ${deletedCount} old failed delivery logs`);
    return deletedCount;
  }
}
