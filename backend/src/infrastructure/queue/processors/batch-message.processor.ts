/**
 * @fileoverview Batch Message Queue Processor
 * @module infrastructure/queue/processors
 * @description Handles batch message sending operations
 */

import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { QueueName } from '../enums';
import { BatchMessageJobDto } from '../dtos';
import type { JobProgress, JobResult } from '../interfaces';
import { BaseQueueProcessor } from '../base.processor';

/**
 * Batch Message Queue Processor
 * Handles batch message sending operations
 */
@Processor(QueueName.BATCH_MESSAGE_SENDING)
export class BatchMessageProcessor extends BaseQueueProcessor {
  constructor() {
    super(BatchMessageProcessor.name);
  }

  /**
   * Process batch message job
   * Sends messages to multiple recipients
   */
  @Process('batch-send')
  async processBatchMessage(job: Job<BatchMessageJobDto>): Promise<JobResult> {
    const totalRecipients = job.data.recipientIds.length;

    return this.executeJobWithCommonHandling(
      job,
      { messageId: job.data.batchId, operation: 'batch-send' },
      async () => {
        const chunkSize = job.data.chunkSize || 10;
        const chunkDelay = job.data.chunkDelay || 100;
        let processedCount = 0;

        // Process recipients in chunks
        for (let i = 0; i < totalRecipients; i += chunkSize) {
          const chunk = job.data.recipientIds.slice(i, i + chunkSize);

          // TODO: Send messages to chunk of recipients
          await this.sendToRecipients(chunk, job.data);

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

        return {
          batchId: job.data.batchId,
          recipientCount: totalRecipients,
          processedCount,
          sentAt: new Date(),
        };
      },
    );
  }

  private async sendToRecipients(recipientIds: string[], data: BatchMessageJobDto): Promise<void> {
    // TODO: Create and send messages to recipients
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _data = data; // Will be used in actual implementation
    await this.delay(recipientIds.length * 10);
  }
}
