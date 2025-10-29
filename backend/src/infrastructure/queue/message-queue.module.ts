/**
 * @fileoverview Message Queue Module
 * @module infrastructure/queue
 * @description NestJS module for message queue management with Bull and Redis
 *
 * This module provides asynchronous message processing capabilities including:
 * - Message delivery
 * - Push notifications and emails
 * - Message encryption/decryption
 * - Search indexing
 * - Batch message sending
 * - Message cleanup and maintenance
 *
 * Features:
 * - Redis-backed job persistence
 * - Retry logic with exponential backoff
 * - Job priority and delayed jobs
 * - Comprehensive job monitoring and metrics
 * - Dead letter queue for failed jobs
 * - Horizontal scalability
 *
 * @example
 * ```typescript
 * // Import the module
 * import { MessageQueueModule } from './infrastructure/queue/message-queue.module';
 *
 * @Module({
 *   imports: [MessageQueueModule],
 * })
 * export class AppModule {}
 *
 * // Use the service
 * constructor(private readonly messageQueue: MessageQueueService) {}
 *
 * async sendMessage(data: SendMessageJobDto) {
 *   await this.messageQueue.addMessageDeliveryJob(data, {
 *     priority: JobPriority.HIGH,
 *   });
 * }
 * ```
 */

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { QueueName } from './enums';
import { QueueConfigService, QUEUE_CONFIGS } from './queue.config';
import { MessageQueueService } from './message-queue.service';
import {
  MessageDeliveryProcessor,
  MessageNotificationProcessor,
  MessageEncryptionProcessor,
  MessageIndexingProcessor,
  BatchMessageProcessor,
  MessageCleanupProcessor,
} from './message-queue.processor.complete';
import { EncryptionModule } from '../encryption/encryption.module';
import { WebSocketModule } from '../websocket/websocket.module';
import { Message } from '../../database/models/message.model';
import { MessageDelivery } from '../../database/models/message-delivery.model';

@Module({
  imports: [
    ConfigModule,
    EncryptionModule,
    WebSocketModule,
    SequelizeModule.forFeature([Message, MessageDelivery]),

    /**
     * Configure Bull with Redis connection
     * Uses SharedBullConfigurationFactory for centralized config
     */
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useClass: QueueConfigService,
    }),

    /**
     * Register all message queue types
     * Each queue is configured with specific options from QUEUE_CONFIGS
     */
    BullModule.registerQueue(
      {
        name: QueueName.MESSAGE_DELIVERY,
        processors: [],
        defaultJobOptions: {
          attempts: QUEUE_CONFIGS[QueueName.MESSAGE_DELIVERY].maxAttempts,
          backoff: {
            type: QUEUE_CONFIGS[QueueName.MESSAGE_DELIVERY].backoffType,
            delay: QUEUE_CONFIGS[QueueName.MESSAGE_DELIVERY].backoffDelay,
          },
          timeout: QUEUE_CONFIGS[QueueName.MESSAGE_DELIVERY].timeout,
          removeOnComplete: {
            count: QUEUE_CONFIGS[QueueName.MESSAGE_DELIVERY].removeOnCompleteCount,
            age: QUEUE_CONFIGS[QueueName.MESSAGE_DELIVERY].removeOnCompleteAge,
          },
          removeOnFail: {
            count: QUEUE_CONFIGS[QueueName.MESSAGE_DELIVERY].removeOnFailCount,
            age: QUEUE_CONFIGS[QueueName.MESSAGE_DELIVERY].removeOnFailAge,
          },
        },
      },
      {
        name: QueueName.MESSAGE_NOTIFICATION,
        defaultJobOptions: {
          attempts: QUEUE_CONFIGS[QueueName.MESSAGE_NOTIFICATION].maxAttempts,
          backoff: {
            type: QUEUE_CONFIGS[QueueName.MESSAGE_NOTIFICATION].backoffType,
            delay: QUEUE_CONFIGS[QueueName.MESSAGE_NOTIFICATION].backoffDelay,
          },
          timeout: QUEUE_CONFIGS[QueueName.MESSAGE_NOTIFICATION].timeout,
          removeOnComplete: {
            count: QUEUE_CONFIGS[QueueName.MESSAGE_NOTIFICATION].removeOnCompleteCount,
            age: QUEUE_CONFIGS[QueueName.MESSAGE_NOTIFICATION].removeOnCompleteAge,
          },
          removeOnFail: {
            count: QUEUE_CONFIGS[QueueName.MESSAGE_NOTIFICATION].removeOnFailCount,
            age: QUEUE_CONFIGS[QueueName.MESSAGE_NOTIFICATION].removeOnFailAge,
          },
        },
      },
      {
        name: QueueName.MESSAGE_INDEXING,
        defaultJobOptions: {
          attempts: QUEUE_CONFIGS[QueueName.MESSAGE_INDEXING].maxAttempts,
          backoff: {
            type: QUEUE_CONFIGS[QueueName.MESSAGE_INDEXING].backoffType,
            delay: QUEUE_CONFIGS[QueueName.MESSAGE_INDEXING].backoffDelay,
          },
          timeout: QUEUE_CONFIGS[QueueName.MESSAGE_INDEXING].timeout,
          removeOnComplete: {
            count: QUEUE_CONFIGS[QueueName.MESSAGE_INDEXING].removeOnCompleteCount,
            age: QUEUE_CONFIGS[QueueName.MESSAGE_INDEXING].removeOnCompleteAge,
          },
          removeOnFail: {
            count: QUEUE_CONFIGS[QueueName.MESSAGE_INDEXING].removeOnFailCount,
            age: QUEUE_CONFIGS[QueueName.MESSAGE_INDEXING].removeOnFailAge,
          },
        },
      },
      {
        name: QueueName.MESSAGE_ENCRYPTION,
        defaultJobOptions: {
          attempts: QUEUE_CONFIGS[QueueName.MESSAGE_ENCRYPTION].maxAttempts,
          backoff: {
            type: QUEUE_CONFIGS[QueueName.MESSAGE_ENCRYPTION].backoffType,
            delay: QUEUE_CONFIGS[QueueName.MESSAGE_ENCRYPTION].backoffDelay,
          },
          timeout: QUEUE_CONFIGS[QueueName.MESSAGE_ENCRYPTION].timeout,
          removeOnComplete: {
            count: QUEUE_CONFIGS[QueueName.MESSAGE_ENCRYPTION].removeOnCompleteCount,
            age: QUEUE_CONFIGS[QueueName.MESSAGE_ENCRYPTION].removeOnCompleteAge,
          },
          removeOnFail: {
            count: QUEUE_CONFIGS[QueueName.MESSAGE_ENCRYPTION].removeOnFailCount,
            age: QUEUE_CONFIGS[QueueName.MESSAGE_ENCRYPTION].removeOnFailAge,
          },
        },
      },
      {
        name: QueueName.BATCH_MESSAGE_SENDING,
        defaultJobOptions: {
          attempts: QUEUE_CONFIGS[QueueName.BATCH_MESSAGE_SENDING].maxAttempts,
          backoff: {
            type: QUEUE_CONFIGS[QueueName.BATCH_MESSAGE_SENDING].backoffType,
            delay: QUEUE_CONFIGS[QueueName.BATCH_MESSAGE_SENDING].backoffDelay,
          },
          timeout: QUEUE_CONFIGS[QueueName.BATCH_MESSAGE_SENDING].timeout,
          removeOnComplete: {
            count: QUEUE_CONFIGS[QueueName.BATCH_MESSAGE_SENDING].removeOnCompleteCount,
            age: QUEUE_CONFIGS[QueueName.BATCH_MESSAGE_SENDING].removeOnCompleteAge,
          },
          removeOnFail: {
            count: QUEUE_CONFIGS[QueueName.BATCH_MESSAGE_SENDING].removeOnFailCount,
            age: QUEUE_CONFIGS[QueueName.BATCH_MESSAGE_SENDING].removeOnFailAge,
          },
        },
      },
      {
        name: QueueName.MESSAGE_CLEANUP,
        defaultJobOptions: {
          attempts: QUEUE_CONFIGS[QueueName.MESSAGE_CLEANUP].maxAttempts,
          backoff: {
            type: QUEUE_CONFIGS[QueueName.MESSAGE_CLEANUP].backoffType,
            delay: QUEUE_CONFIGS[QueueName.MESSAGE_CLEANUP].backoffDelay,
          },
          timeout: QUEUE_CONFIGS[QueueName.MESSAGE_CLEANUP].timeout,
          removeOnComplete: {
            count: QUEUE_CONFIGS[QueueName.MESSAGE_CLEANUP].removeOnCompleteCount,
            age: QUEUE_CONFIGS[QueueName.MESSAGE_CLEANUP].removeOnCompleteAge,
          },
          removeOnFail: {
            count: QUEUE_CONFIGS[QueueName.MESSAGE_CLEANUP].removeOnFailCount,
            age: QUEUE_CONFIGS[QueueName.MESSAGE_CLEANUP].removeOnFailAge,
          },
        },
      },
    ),
  ],

  /**
   * Providers
   * - QueueConfigService: Configuration management
   * - MessageQueueService: Main queue management service
   * - All processors: Handle job processing for each queue
   */
  providers: [
    QueueConfigService,
    MessageQueueService,
    MessageDeliveryProcessor,
    MessageNotificationProcessor,
    MessageEncryptionProcessor,
    MessageIndexingProcessor,
    BatchMessageProcessor,
    MessageCleanupProcessor,
  ],

  /**
   * Exports
   * - MessageQueueService: For use in other modules
   * - BullModule: Allow other modules to inject queues if needed
   */
  exports: [MessageQueueService, BullModule],
})
export class MessageQueueModule {}
