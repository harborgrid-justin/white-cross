/**
 * @fileoverview Message Encryption Processor
 * @description Handles encryption and decryption operations for messages
 * @module infrastructure/queue
 */

import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Inject, Logger, forwardRef } from '@nestjs/common';
import type { Job } from 'bull';
import type { JobProgress, JobResult } from './interfaces';
import { QueueName } from './enums';
import { EncryptionJobDto } from './dtos';
import { Message   } from "../../database/models";
import { EncryptionService } from '@/infrastructure/encryption';

/**
 * Message Encryption Queue Processor
 * Handles encryption and decryption operations
 */
@Processor(QueueName.MESSAGE_ENCRYPTION)
export class MessageEncryptionProcessor {
  private readonly logger = new Logger(MessageEncryptionProcessor.name);

  constructor(
    @Inject(forwardRef(() => EncryptionService))
    private readonly encryptionService: EncryptionService,
    @Inject(Message)
    private readonly messageModel: typeof Message,
  ) {}

  /**
   * Process encryption/decryption job
   * CPU-intensive cryptographic operations using EncryptionService
   */
  @Process('encrypt-decrypt')
  async processEncryption(job: Job<EncryptionJobDto>): Promise<JobResult> {
    const startTime = Date.now();
    this.logger.log(`Processing ${job.data.operation} for message ${job.data.messageId}`);

    try {
      await job.progress({
        percentage: 25,
        step: `Starting ${job.data.operation}`,
      } as JobProgress);

      const message = await this.messageModel.findByPk(job.data.messageId);
      if (!message) {
        throw new Error(`Message ${job.data.messageId} not found`);
      }

      let result: string;
      if (job.data.operation === 'encrypt') {
        result = await this.encryptContent(job.data.content, message);

        // Update message with encrypted content
        await message.update({
          encryptedContent: result,
          isEncrypted: true,
          encryptionMetadata: job.data.metadata,
        });
      } else {
        result = await this.decryptContent(job.data.content, message);
      }

      await job.progress({
        percentage: 100,
        step: `${job.data.operation} completed`,
      } as JobProgress);

      const processingTime = Date.now() - startTime;
      this.logger.log(
        `${job.data.operation} completed for message ${job.data.messageId} (${processingTime}ms)`,
      );

      return {
        success: true,
        data: {
          messageId: job.data.messageId,
          operation: job.data.operation,
          result,
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
      this.logger.error(
        `${job.data.operation} failed for message ${job.data.messageId}: ${err.message}`,
        err.stack,
      );

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

  private async encryptContent(content: string, message: Message): Promise<string> {
    const encryptionResult = await this.encryptionService.encrypt(content, {
      conversationId: message.conversationId,
      aad: `${message.senderId}:${message.conversationId}`,
    });

    if (!encryptionResult.success) {
      throw new Error(`Encryption failed: ${encryptionResult.error}`);
    }

    return encryptionResult.data;
  }

  private async decryptContent(encryptedContent: string, message: Message): Promise<string> {
    if (!message.encryptionMetadata) {
      throw new Error('Message encryption metadata not found');
    }

    const decryptionResult = await this.encryptionService.decrypt(
      encryptedContent,
      message.encryptionMetadata,
      {
        conversationId: message.conversationId,
      },
    );

    if (!decryptionResult.success) {
      throw new Error(`Decryption failed: ${decryptionResult.error}`);
    }

    return decryptionResult.data;
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`Processing encryption job ${job.id}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log(`Encryption job ${job.id} completed`);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(`Encryption job ${job.id} failed: ${error.message}`);
  }
}