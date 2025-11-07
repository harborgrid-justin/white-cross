/**
 * @fileoverview Queue Integration Helper
 * @module communication/helpers
 * @description Helper utilities for integrating message service with queue system
 *
 * Provides high-level abstractions for:
 * - Queuing messages with all related jobs (delivery, notification, indexing, encryption)
 * - Job chaining and dependency tracking
 * - Job result aggregation
 * - Failure handling and retries
 */

import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MessageQueueService } from '../../infrastructure/queue/message-queue.service';
import { JobPriority } from '../../infrastructure/queue/enums';
import {
  SendMessageJobDto,
  NotificationJobDto,
  EncryptionJobDto,
  IndexingJobDto,
  DeliveryConfirmationJobDto,
  NotificationType,
  NotificationPriority,
} from '../../infrastructure/queue/dtos';

/**
 * Job chain step configuration
 */
export interface JobChainStep {
  /** Job type identifier */
  type:
    | 'delivery'
    | 'notification'
    | 'encryption'
    | 'indexing'
    | 'confirmation';

  /** Job data */
  data: any;

  /** Job options (priority, delay, etc.) */
  options?: {
    priority?: JobPriority;
    delay?: number;
    dependsOn?: string[]; // Job IDs this job depends on
  };

  /** Whether this step is optional (can fail without affecting chain) */
  optional?: boolean;
}

/**
 * Result of a job chain execution
 */
export interface JobChainResult {
  /** Whether the entire chain completed successfully */
  success: boolean;

  /** Job IDs for all jobs in the chain */
  jobIds: {
    delivery?: string;
    notification?: string;
    encryption?: string;
    indexing?: string;
    confirmation?: string;
  };

  /** Jobs that were created */
  jobs: {
    delivery?: Job<SendMessageJobDto>;
    notification?: Job<NotificationJobDto>;
    encryption?: Job<EncryptionJobDto>;
    indexing?: Job<IndexingJobDto>;
    confirmation?: Job<DeliveryConfirmationJobDto>;
  };

  /** Any errors that occurred */
  errors?: Array<{
    step: string;
    error: Error;
  }>;

  /** Timestamp when chain was initiated */
  initiatedAt: Date;
}

/**
 * Message context for queue operations
 */
export interface MessageQueueContext {
  messageId: string;
  senderId: string;
  recipientId?: string;
  recipientIds?: string[];
  conversationId: string;
  content: string;
  encrypted?: boolean;
  attachments?: string[];
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  metadata?: Record<string, any>;
}

/**
 * Queue Integration Helper
 * Provides high-level queue operations for message service
 */
@Injectable()
export class QueueIntegrationHelper {
  private readonly logger = new Logger(QueueIntegrationHelper.name);

  constructor(private readonly queueService: MessageQueueService) {}

  /**
   * Queue a complete message workflow
   * Creates jobs for delivery, notification, and indexing in sequence
   *
   * @param context - Message context
   * @returns Job chain result with all job IDs
   */
  async queueMessageWorkflow(
    context: MessageQueueContext,
  ): Promise<JobChainResult> {
    this.logger.log(
      `Queueing message workflow for message ${context.messageId}`,
    );

    const result: JobChainResult = {
      success: true,
      jobIds: {},
      jobs: {},
      initiatedAt: new Date(),
    };

    const errors: Array<{ step: string; error: Error }> = [];

    try {
      // Step 1: Queue encryption if needed
      if (context.encrypted) {
        try {
          const encryptionJob = await this.queueEncryption(context);
          result.jobs.encryption = encryptionJob;
          result.jobIds.encryption = encryptionJob.id as string;
        } catch (error) {
          this.logger.error(
            `Encryption queuing failed: ${error.message}`,
            error.stack,
          );
          errors.push({ step: 'encryption', error: error as Error });
          result.success = false;
          // Encryption failure is critical - abort workflow
          result.errors = errors;
          return result;
        }
      }

      // Step 2: Queue message delivery
      try {
        const deliveryJob = await this.queueDelivery(context);
        result.jobs.delivery = deliveryJob;
        result.jobIds.delivery = deliveryJob.id as string;
      } catch (error) {
        this.logger.error(
          `Delivery queuing failed: ${error.message}`,
          error.stack,
        );
        errors.push({ step: 'delivery', error: error as Error });
        result.success = false;
        // Delivery failure is critical - abort workflow
        result.errors = errors;
        return result;
      }

      // Step 3: Queue notification (optional - failures don't abort workflow)
      try {
        const notificationJob = await this.queueNotification(context);
        result.jobs.notification = notificationJob;
        result.jobIds.notification = notificationJob.id as string;
      } catch (error) {
        this.logger.warn(
          `Notification queuing failed (non-critical): ${error.message}`,
        );
        errors.push({ step: 'notification', error: error as Error });
        // Notification failure is non-critical
      }

      // Step 4: Queue indexing (optional - failures don't abort workflow)
      try {
        const indexingJob = await this.queueIndexing(context);
        result.jobs.indexing = indexingJob;
        result.jobIds.indexing = indexingJob.id as string;
      } catch (error) {
        this.logger.warn(
          `Indexing queuing failed (non-critical): ${error.message}`,
        );
        errors.push({ step: 'indexing', error: error as Error });
        // Indexing failure is non-critical
      }

      if (errors.length > 0) {
        result.errors = errors;
      }

      this.logger.log(
        `Message workflow queued successfully. ` +
          `Jobs created: ${Object.keys(result.jobIds).length}, ` +
          `Errors: ${errors.length}`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Unexpected error in message workflow: ${error.message}`,
        error.stack,
      );
      result.success = false;
      result.errors = [{ step: 'workflow', error: error as Error }];
      return result;
    }
  }

  /**
   * Queue message delivery
   *
   * @param context - Message context
   * @returns Delivery job
   */
  async queueDelivery(
    context: MessageQueueContext,
  ): Promise<Job<SendMessageJobDto>> {
    const priority = this.mapPriorityToJobPriority(context.priority);

    const jobData: SendMessageJobDto = {
      messageId: context.messageId,
      senderId: context.senderId,
      recipientId: context.recipientId!,
      content: context.content,
      conversationId: context.conversationId,
      requiresEncryption: context.encrypted,
      attachments: context.attachments,
      createdAt: new Date(),
      initiatedBy: context.senderId,
      metadata: context.metadata,
    };

    return this.queueService.addMessageDeliveryJob(jobData, {
      priority,
      delay: 0,
    });
  }

  /**
   * Queue notification for message
   *
   * @param context - Message context
   * @returns Notification job
   */
  async queueNotification(
    context: MessageQueueContext,
  ): Promise<Job<NotificationJobDto>> {
    const priority = this.mapPriorityToNotificationPriority(context.priority);
    const jobPriority = this.mapPriorityToJobPriority(context.priority);

    const jobData: NotificationJobDto = {
      messageId: context.messageId,
      recipientId: context.recipientId!,
      type: NotificationType.IN_APP,
      priority,
      title: 'New Message',
      message: this.truncateContent(context.content, 100),
      createdAt: new Date(),
      initiatedBy: context.senderId,
      metadata: {
        conversationId: context.conversationId,
        senderId: context.senderId,
      },
    };

    return this.queueService.addNotificationJob(jobData, {
      priority: jobPriority,
      delay: 100, // Small delay to ensure message is delivered first
    });
  }

  /**
   * Queue message encryption
   *
   * @param context - Message context
   * @returns Encryption job
   */
  async queueEncryption(
    context: MessageQueueContext,
  ): Promise<Job<EncryptionJobDto>> {
    const priority = JobPriority.HIGH; // Encryption is high priority

    const jobData: EncryptionJobDto = {
      messageId: context.messageId,
      operation: 'encrypt',
      content: context.content,
      createdAt: new Date(),
      initiatedBy: context.senderId,
      metadata: context.metadata,
    };

    return this.queueService.addEncryptionJob(jobData, {
      priority,
      delay: 0,
    });
  }

  /**
   * Queue message indexing for search
   *
   * @param context - Message context
   * @returns Indexing job
   */
  async queueIndexing(
    context: MessageQueueContext,
  ): Promise<Job<IndexingJobDto>> {
    const jobData: IndexingJobDto = {
      messageId: context.messageId,
      operation: 'index',
      content: context.content,
      senderId: context.senderId,
      conversationId: context.conversationId,
      messageTimestamp: new Date(),
      createdAt: new Date(),
      initiatedBy: context.senderId,
      metadata: context.metadata,
    };

    return this.queueService.addIndexingJob(jobData, {
      priority: JobPriority.LOW, // Indexing is lower priority
      delay: 500, // Delay to allow message to be saved first
    });
  }

  /**
   * Queue delivery confirmation
   *
   * @param messageId - Message ID
   * @param recipientId - Recipient ID
   * @param status - Delivery status
   * @returns Confirmation job
   */
  async queueDeliveryConfirmation(
    messageId: string,
    recipientId: string,
    status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED',
    failureReason?: string,
  ): Promise<Job<DeliveryConfirmationJobDto>> {
    const jobData: DeliveryConfirmationJobDto = {
      messageId,
      recipientId,
      status: status as any,
      deliveredAt:
        status === 'DELIVERED' || status === 'READ' ? new Date() : undefined,
      readAt: status === 'READ' ? new Date() : undefined,
      failureReason,
      createdAt: new Date(),
    };

    return this.queueService.addDeliveryConfirmationJob(jobData, {
      priority: JobPriority.NORMAL,
    });
  }

  /**
   * Check job status by ID
   *
   * @param queueName - Queue name
   * @param jobId - Job ID
   * @returns Job status information
   */
  async getJobStatus(
    queueName: any,
    jobId: string,
  ): Promise<{
    id: string;
    state: string;
    progress: number;
    attempts: number;
    data: any;
    returnvalue?: any;
    failedReason?: string;
    finishedOn?: number;
    processedOn?: number;
  } | null> {
    try {
      // This would need to be implemented in MessageQueueService
      // For now, return a placeholder
      this.logger.debug(
        `Getting status for job ${jobId} in queue ${queueName}`,
      );
      return null;
    } catch (error) {
      this.logger.error(
        `Error getting job status: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Aggregate results from multiple jobs
   *
   * @param jobIds - Array of job IDs to aggregate
   * @returns Aggregated results
   */
  async aggregateJobResults(jobIds: string[]): Promise<{
    total: number;
    completed: number;
    failed: number;
    pending: number;
    results: Array<{
      jobId: string;
      status: string;
      result?: any;
      error?: string;
    }>;
  }> {
    const results: Array<{
      jobId: string;
      status: string;
      result?: any;
      error?: string;
    }> = [];

    const completed = 0;
    const failed = 0;
    let pending = 0;

    for (const jobId of jobIds) {
      // This would need to fetch actual job status
      // For now, return placeholder - all jobs are pending
      const status = 'pending';
      results.push({
        jobId,
        status,
      });

      // Since all jobs are currently pending in this placeholder implementation
      pending++;
    }

    return {
      total: jobIds.length,
      completed,
      failed,
      pending,
      results,
    };
  }

  /**
   * Retry a failed job
   *
   * @param queueName - Queue name
   * @param jobId - Job ID to retry
   */
  async retryFailedJob(queueName: any, jobId: string): Promise<void> {
    await this.queueService.retryFailedJob(queueName, jobId);
    this.logger.log(`Retried job ${jobId} in queue ${queueName}`);
  }

  /**
   * Map message priority to job priority
   */
  private mapPriorityToJobPriority(
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
  ): JobPriority {
    switch (priority) {
      case 'URGENT':
        return JobPriority.CRITICAL;
      case 'HIGH':
        return JobPriority.HIGH;
      case 'MEDIUM':
        return JobPriority.NORMAL;
      case 'LOW':
      default:
        return JobPriority.LOW;
    }
  }

  /**
   * Map message priority to notification priority
   */
  private mapPriorityToNotificationPriority(
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
  ): NotificationPriority {
    switch (priority) {
      case 'URGENT':
        return NotificationPriority.URGENT;
      case 'HIGH':
        return NotificationPriority.HIGH;
      case 'MEDIUM':
        return NotificationPriority.NORMAL;
      case 'LOW':
      default:
        return NotificationPriority.LOW;
    }
  }

  /**
   * Truncate content to specified length
   */
  private truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength - 3) + '...';
  }
}
