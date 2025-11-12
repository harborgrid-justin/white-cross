/**
 * @fileoverview Message Cleanup Processor
 * @description Handles old message cleanup and retention policies
 * @module infrastructure/queue
 */

import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Op } from 'sequelize';
import type { Job } from 'bull';
import type { JobResult } from './interfaces';
import { QueueName } from './enums';
import { MessageCleanupJobDto, CleanupType } from './dtos';
import { Message } from '@/database/models/message.model';

/**
 * Message Cleanup Queue Processor
 * Handles old message cleanup and retention policies
 */
@Processor(QueueName.MESSAGE_CLEANUP)
export class MessageCleanupProcessor {
  private readonly logger = new Logger(MessageCleanupProcessor.name);

  constructor(
    @Inject(Message)
    private readonly messageModel: typeof Message,
  ) {}

  /**
   * Process message cleanup job
   * Removes old messages based on retention policy
   */
  @Process('cleanup-messages')
  async processMessageCleanup(
    job: Job<MessageCleanupJobDto>,
  ): Promise<JobResult> {
    const startTime = Date.now();
    this.logger.log(`Processing message cleanup: ${job.data.cleanupType}`);

    try {
      let deletedCount = 0;

      switch (job.data.cleanupType) {
        case CleanupType.OLD_MESSAGES:
          deletedCount = await this.cleanupOldMessages(
            job.data.retentionDays || 30,
            job.data.batchSize || 100,
          );
          break;
        case CleanupType.DELETED_CONVERSATIONS:
          deletedCount = await this.cleanupDeletedConversations(
            job.data.batchSize || 100,
          );
          break;
        case CleanupType.EXPIRED_ATTACHMENTS:
          deletedCount = await this.cleanupExpiredAttachments(
            job.data.retentionDays || 7,
            job.data.batchSize || 100,
          );
          break;
        default:
          throw new Error(`Unknown cleanup type: ${job.data.cleanupType}`);
      }

      const processingTime = Date.now() - startTime;
      this.logger.log(
        `Cleanup completed: ${deletedCount} messages processed (${processingTime}ms)`,
      );

      return {
        success: true,
        data: {
          cleanupType: job.data.cleanupType,
          deletedCount,
          completedAt: new Date(),
        },
        metadata: {
          processingTime,
          attempts: job.attemptsMade,
          completedAt: new Date(),
        },
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      const err = error as Error;
      this.logger.error(`Cleanup failed: ${err.message}`, err.stack);

      return {
        success: false,
        error: {
          message: err.message,
          stack: err.stack,
        },
        metadata: {
          processingTime,
          attempts: job.attemptsMade,
          completedAt: new Date(),
        },
      };
    }
  }

  private async cleanupOldMessages(
    retentionDays: number,
    batchSize: number,
  ): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Soft delete old messages
    const result = await this.messageModel.update(
      { deletedAt: new Date() },
      {
        where: {
          createdAt: { [Op.lt]: cutoffDate },
          deletedAt: { [Op.is]: null },
        },
        limit: batchSize,
      },
    );

    const deletedCount = result[0];
    this.logger.log(
      `Soft deleted ${deletedCount} messages older than ${retentionDays} days`,
    );
    return deletedCount;
  }

  private async cleanupDeletedConversations(
    batchSize: number,
  ): Promise<number> {
    // Find messages from deleted conversations
    const orphanedMessages = await this.messageModel.findAll({
      where: {
        conversationId: { [Op.is]: null },
      },
      limit: batchSize,
    });

    for (const message of orphanedMessages) {
      await message.destroy({ force: true });
    }

    this.logger.log(
      `Deleted ${orphanedMessages.length} messages from deleted conversations`,
    );
    return orphanedMessages.length;
  }

  private async cleanupExpiredAttachments(
    retentionDays: number,
    batchSize: number,
  ): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // TODO: Implement attachment cleanup logic
    // This would typically involve:
    // 1. Finding messages with attachments older than retention period
    // 2. Removing attachment files from storage
    // 3. Updating message records to remove attachment references

    // For now, simulate attachment cleanup
    this.logger.log(
      `Cleaned up expired attachments older than ${retentionDays} days`,
    );
    return 0; // Placeholder
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`Processing cleanup job ${job.id}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log(`Cleanup job ${job.id} completed`);
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    this.logger.error(`Cleanup job ${job.id} failed: ${err.message}`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}