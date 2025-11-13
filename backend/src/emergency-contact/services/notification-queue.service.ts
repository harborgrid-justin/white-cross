/**
 * Notification Queue Service
 *
 * Handles background notification queue processing including:
 * - Queue initialization and lifecycle management
 * - Batched notification processing
 * - Graceful shutdown handling
 * - Queue monitoring and logging
 *
 * This service manages asynchronous notification delivery to avoid
 * overwhelming external services and provides resilience through queuing.
 */
import { Injectable, Logger, OnModuleDestroy, Optional } from '@nestjs/common';
import { AppConfigService } from '../../config/app-config.service';

import { BaseService } from '@/common/base';
import { BaseService } from '@/common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
export interface QueuedNotification {
  id: string;
  timestamp: Date;
  type: string;
  payload?: any;
}

@Injectable()
export class NotificationQueueService implements OnModuleDestroy {
  private notificationQueue: QueuedNotification[] = [];
  private queueProcessingInterval?: NodeJS.Timeout;

  constructor(@Optional() private readonly config?: AppConfigService) {
    // Initialize notification queue processing in production only
    if (this.config?.isProduction) {
      this.initializeQueueProcessing();
    }
  }

  /**
   * Initialize queue processing
   * Sets up periodic queue processing interval
   */
  private initializeQueueProcessing(): void {
    this.queueProcessingInterval = setInterval(
      () => this.processNotificationQueue(),
      60 * 1000, // Process queue every minute
    );
    this.logInfo(
      'Notification queue service initialized with periodic processing',
    );
  }

  /**
   * Add notification to queue
   * Queues notification for later processing
   *
   * @param notification - Notification to queue
   */
  async enqueueNotification(notification: QueuedNotification): Promise<void> {
    this.notificationQueue.push(notification);
    this.logDebug(
      `Notification queued: ${notification.id} (Queue size: ${this.notificationQueue.length})`,
    );
  }

  /**
   * Process notification queue
   * Handles batched notification sending to avoid overwhelming external services
   */
  async processNotificationQueue(): Promise<void> {
    if (this.notificationQueue.length === 0) {
      return;
    }

    const batchSize = this.config?.get<number>('notification.batchSize', 10);
    const batch = this.notificationQueue.splice(0, batchSize);

    this.logInfo(`Processing notification batch: ${batch.length} notifications`);

    for (const notification of batch) {
      try {
        // Process notification based on type
        await this.processNotification(notification);
        this.logDebug(
          `Processed notification ${notification.id} (${notification.type})`,
        );
      } catch (error) {
        this.logError(
          `Failed to process notification ${notification.id}: ${error.message}`,
        );
        // In production, could re-queue failed notifications or send to dead letter queue
      }
    }
  }

  /**
   * Process individual notification
   * Placeholder for actual notification processing logic
   *
   * @param notification - Notification to process
   */
  private async processNotification(
    notification: QueuedNotification,
  ): Promise<void> {
    // Actual notification processing logic would go here
    // This could integrate with NotificationDeliveryService
    this.logDebug(
      `Processing notification: ${notification.id} - ${notification.type}`,
    );
  }

  /**
   * Get queue size
   * Returns current number of queued notifications
   *
   * @returns Queue size
   */
  getQueueSize(): number {
    return this.notificationQueue.length;
  }

  /**
   * Clear queue
   * Removes all pending notifications from queue
   * Use with caution - should only be used in testing or emergency situations
   */
  clearQueue(): void {
    const size = this.notificationQueue.length;
    this.notificationQueue = [];
    this.logWarning(`Queue cleared: ${size} notifications removed`);
  }

  /**
   * Get queue statistics
   * Returns queue metrics for monitoring
   *
   * @returns Queue statistics
   */
  getQueueStatistics(): {
    size: number;
    oldestTimestamp?: Date;
    newestTimestamp?: Date;
  } {
    const stats = {
      size: this.notificationQueue.length,
      oldestTimestamp: undefined as Date | undefined,
      newestTimestamp: undefined as Date | undefined,
    };

    if (this.notificationQueue.length > 0) {
      stats.oldestTimestamp = this.notificationQueue[0].timestamp;
      stats.newestTimestamp =
        this.notificationQueue[this.notificationQueue.length - 1].timestamp;
    }

    return stats;
  }

  /**
   * Cleanup resources on module destroy
   * Implements graceful shutdown for notification queues and intervals
   */
  async onModuleDestroy() {
    this.logInfo(
      'NotificationQueueService shutting down - cleaning up resources',
    );

    // Clear intervals
    if (this.queueProcessingInterval) {
      clearInterval(this.queueProcessingInterval);
      this.logInfo('Queue processing interval cleared');
    }

    // Process remaining notifications in queue
    if (this.notificationQueue.length > 0) {
      this.logInfo(
        `Processing ${this.notificationQueue.length} remaining notifications before shutdown`,
      );
      try {
        await this.processNotificationQueue();
      } catch (error) {
        this.logWarning(
          `Error processing notification queue during shutdown: ${error.message}`,
        );
      }
    }

    this.logInfo(
      'NotificationQueueService destroyed, resources cleaned up',
    );
  }
}
