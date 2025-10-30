/**
 * @fileoverview Message Queue Module Barrel Export
 * @module infrastructure/queue
 * @description Public API for the message queue infrastructure
 */

// Module
export { MessageQueueModule } from './message-queue.module';

// Service
export { MessageQueueService } from './message-queue.service';

// Configuration
export { QueueConfigService, QUEUE_CONFIGS } from './queue.config';

// Enums
export { QueueName, JobPriority } from './enums';

// DTOs
export {
  SendMessageJobDto,
  DeliveryConfirmationJobDto,
  NotificationJobDto,
  EncryptionJobDto,
  IndexingJobDto,
  BatchMessageJobDto,
  MessageCleanupJobDto,
  EncryptionStatus,
  DeliveryStatus,
  NotificationType,
  NotificationPriority,
  PushNotificationPayload,
  EmailNotificationPayload,
  BatchMessageItem,
} from './dtos';

// Interfaces
export type {
  BaseQueueJob,
  QueueJobOptions,
  JobResult,
  JobProgress,
  QueueStats,
  QueueMetrics,
  QueueHealth,
  FailedJobInfo,
} from './interfaces';

// Processors (for advanced usage)
export {
  MessageDeliveryProcessor,
  MessageNotificationProcessor,
  MessageEncryptionProcessor,
  MessageIndexingProcessor,
  BatchMessageProcessor,
  MessageCleanupProcessor,
} from './message-queue.processor';
