/**
 * @fileoverview Batch Message Processor
 * @description Handles batch message sending operations to multiple recipients
 * @module infrastructure/queue
 */

import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Inject, Logger, forwardRef } from '@nestjs/common';
import type { Job } from 'bull';
import type { JobProgress, JobResult } from './interfaces';
import { QueueName } from './enums';
import { BatchMessageJobDto } from './dtos';
import { Message   } from "../../database/models";
import { WebSocketService } from '@/infrastructure/websocket';

/**
 * Batch Message Queue Processor
 * Handles batch message sending operations
 */
@Processor(QueueName.BATCH_MESSAGE_SENDING)
export class BatchMessageProcessor {
  private readonly logger = new Logger(BatchMessageProcessor.name);

  constructor(
    @Inject(forwardRef(() => WebSocketService))
    private readonly websocketService: WebSocketService,
    @Inject(Message)
    private readonly messageModel: typeof Message,
  ) {}

  /**
   * Process batch message job
   * Sends messages to multiple recipients in chunks
   */
  @Process('batch-send')
  async processBatchMessage(job: Job<BatchMessageJobDto>): Promise<JobResult> {
    const startTime = Date.now();
    const totalRecipients = job.data.recipientIds.length;
    this.logger.log(`Processing batch message job ${job.id} for ${totalRecipients} recipients`);

    try {
      const chunkSize = job.data.chunkSize || 10;
      const chunkDelay = job.data.chunkDelay || 100;
      let processedCount = 0;
      let successCount = 0;
      let failureCount = 0;

      // Process recipients in chunks
      for (let i = 0; i < totalRecipients; i += chunkSize) {
        const chunk = job.data.recipientIds.slice(i, i + chunkSize);

        const results = await this.sendToRecipients(chunk, job.data);
        successCount += results.success;
        failureCount += results.failure;

        processedCount += chunk.length;
        const percentage = Math.floor((processedCount / totalRecipients) * 100);

        await job.progress({
          percentage,
          step: 'Sending messages',
          currentStep: processedCount,
          totalSteps: totalRecipients,
        } as JobProgress);

        // Delay between chunks to avoid overwhelming the system
        if (i + chunkSize < totalRecipients) {
          await this.delay(chunkDelay);
        }
      }

      const processingTime = Date.now() - startTime;
      this.logger.log(
        `Batch message sent to ${totalRecipients} recipients: ${successCount} success, ${failureCount} failed (${processingTime}ms)`,
      );

      return {
        success: true,
        data: {
          batchId: job.data.batchId,
          recipientCount: totalRecipients,
          processedCount,
          successCount,
          failureCount,
          sentAt: new Date(),
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
      this.logger.error(`Batch message failed: ${err.message}`, err.stack);

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

  private async sendToRecipients(
    recipientIds: string[],
    jobData: BatchMessageJobDto,
  ): Promise<{ success: number; failure: number }> {
    let success = 0;
    let failure = 0;

    await Promise.all(
      recipientIds.map(async (recipientId) => {
        try {
          // Create message for each recipient
          const message = await this.messageModel.create({
            senderId: jobData.senderId,
            recipientId,
            conversationId: jobData.conversationIds?.[0] || `batch-${jobData.batchId}`,
            content: jobData.content,
            type: 'TEXT',
            status: 'PENDING',
            metadata: {
              batchId: jobData.batchId,
            },
          });

          await this.websocketService.sendMessageToUsers([recipientId], {
            messageId: message.id,
            senderId: jobData.senderId,
            content: jobData.content,
            conversationId: message.conversationId || `batch-${jobData.batchId}`,
            timestamp: new Date().toISOString(),
            recipientIds: [recipientId],
            organizationId: 'default',
            type: 'send',
            validateSender: () => true,
            validateOrganization: () => true,
            isDirectMessage: () => false,
            toPayload: () => ({
              messageId: message.id,
              senderId: jobData.senderId,
              content: jobData.content,
              conversationId: message.conversationId || `batch-${jobData.batchId}`,
              timestamp: new Date().toISOString(),
            }),
            metadata: {},
          });

          success++;
        } catch (error) {
          const err = error as Error;
          this.logger.error(`Failed to send to ${recipientId}: ${err.message}`);
          failure++;
        }
      }),
    );

    return { success, failure };
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`Processing batch message job ${job.id}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log(`Batch message job ${job.id} completed`);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(`Batch message job ${job.id} failed: ${error.message}`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}