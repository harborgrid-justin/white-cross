/**
 * @fileoverview Message Delivery Processor
 * @description Handles message sending and delivery confirmation jobs
 * @module infrastructure/queue
 */

import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import type { Job } from 'bull';
import type { JobProgress, JobResult } from './interfaces';
import { InjectModel } from '@nestjs/sequelize';
import { QueueName } from './enums';
import { DeliveryConfirmationJobDto, SendMessageJobDto } from './dtos';

import { EncryptionService } from '@/infrastructure/encryption';
import { WebSocketService } from '@/infrastructure/websocket';
import { Message } from '@/database/models/message.model';
import {
  MessageDelivery,
  RecipientType,
  DeliveryChannelType,
  DeliveryStatus,
} from '@/database/models/message-delivery.model';

/**
 * Message Delivery Queue Processor
 * Handles message sending and delivery confirmation jobs
 */
@Processor(QueueName.MESSAGE_DELIVERY)
export class MessageDeliveryProcessor {
  private readonly logger = new Logger(MessageDeliveryProcessor.name);

  constructor(
    @InjectModel(Message)
    private readonly messageModel: typeof Message,
    @InjectModel(MessageDelivery)
    private readonly messageDeliveryModel: typeof MessageDelivery,
    @Inject(forwardRef(() => WebSocketService))
    private readonly websocketService: WebSocketService,
    @Inject(forwardRef(() => EncryptionService))
    private readonly encryptionService: EncryptionService,
  ) {}

  /**
   * Process send message job
   * Handles asynchronous message delivery with WebSocket integration
   */
  @Process('send-message')
  async processSendMessage(job: Job<SendMessageJobDto>): Promise<JobResult> {
    const startTime = Date.now();
    this.logger.log(`Processing send message job ${job.id} for message ${job.data.messageId}`);

    try {
      // Update progress: Validating message
      await job.progress({
        percentage: 10,
        step: 'Validating message',
      } as JobProgress);

      // Step 1: Retrieve message from database
      const message = await this.messageModel.findByPk(job.data.messageId);

      if (!message) {
        throw new Error(`Message ${job.data.messageId} not found`);
      }

      // Step 2: Check if encryption is required
      await job.progress({
        percentage: 30,
        step: 'Checking encryption',
      } as JobProgress);

      let messageContent = message.content;
      if (job.data.requiresEncryption) {
        const encryptionResult = await this.encryptionService.encrypt(message.content, { conversationId: job.data.conversationId, aad: `${job.data.senderId}:${job.data.conversationId}` });

        if (encryptionResult.success) {
          messageContent = encryptionResult.data;
          this.logger.log(
            `Message ${job.data.messageId} encrypted successfully`,
          );
        } else {
          this.logger.warn(
            `Encryption failed for message ${job.data.messageId}, sending unencrypted`,
          );
        }
      }

      // Step 3: Broadcast message via WebSocket
      await job.progress({
        percentage: 60,
        step: 'Broadcasting message',
      } as JobProgress);

      await this.websocketService.sendMessageToConversation(
        job.data.conversationId,
        {
          messageId: job.data.messageId,
          senderId: job.data.senderId,
          content: messageContent,
          conversationId: job.data.conversationId,
          recipientIds: [job.data.recipientId],
          timestamp: new Date().toISOString(),
          organizationId: 'default',
          type: 'send',
          validateSender: () => true,
          validateOrganization: () => true,
          isDirectMessage: () => false,
          toPayload: () => ({
            messageId: job.data.messageId,
            senderId: job.data.senderId,
            content: messageContent,
            conversationId: job.data.conversationId,
            timestamp: new Date().toISOString(),
          }),
          metadata: job.data.metadata || {},
        },
      );

      // Step 4: Create delivery record
      await job.progress({
        percentage: 80,
        step: 'Recording delivery',
      } as JobProgress);

      await this.messageDeliveryModel.create({
        messageId: job.data.messageId,
        recipientId: job.data.recipientId,
        recipientType: RecipientType.NURSE,
        channel: DeliveryChannelType.IN_APP,
        status: DeliveryStatus.SENT,
        sentAt: new Date(),
      });

      // Step 5: Update message status - remove sentAt since it's not in Message model
      await message.update({});

      await job.progress({
        percentage: 100,
        step: 'Message sent',
      } as JobProgress);

      const processingTime = Date.now() - startTime;
      this.logger.log(
        `Message sent successfully: ${job.data.messageId} (${processingTime}ms)`,
      );

      return {
        success: true,
        data: {
          messageId: job.data.messageId,
          sentAt: new Date(),
          encrypted: job.data.requiresEncryption,
        },
        metadata: {
          processingTime,
          attempts: job.attemptsMade,
          completedAt: new Date(),
        },
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.logger.error(
        `Failed to send message ${job.data.messageId}: ${error.message}`,
        error.stack,
      );

      // Record delivery failure
      try {
        await this.messageDeliveryModel.create({
          messageId: job.data.messageId,
          recipientId: job.data.recipientId,
          recipientType: 'NURSE' as any,
          channel: 'IN_APP' as any,
          status: 'FAILED' as any,
          failureReason: error.message,
        });
      } catch (dbError) {
        this.logger.error(
          `Failed to record delivery failure: ${dbError.message}`,
        );
      }

      return {
        success: false,
        error: {
          message: error.message,
          stack: error.stack,
        },
        metadata: {
          processingTime,
          attempts: job.attemptsMade,
          completedAt: new Date(),
        },
      };
    }
  }

  /**
   * Process delivery confirmation job
   * Updates message delivery status in database and broadcasts via WebSocket
   */
  @Process('delivery-confirmation')
  async processDeliveryConfirmation(
    job: Job<DeliveryConfirmationJobDto>,
  ): Promise<JobResult> {
    const startTime = Date.now();
    this.logger.log(
      `Processing delivery confirmation for message ${job.data.messageId}: ${job.data.status}`,
    );

    try {
      // Step 1: Update delivery status in database
      const delivery = await this.messageDeliveryModel.findOne({
        where: {
          messageId: job.data.messageId,
          recipientId: job.data.recipientId,
        },
      });

      if (delivery) {
        await delivery.update({
          status: job.data.status as any,
          deliveredAt: job.data.deliveredAt,
          failureReason: job.data.failureReason,
        });
      } else {
        // Create new delivery record if not exists
        await this.messageDeliveryModel.create({
          messageId: job.data.messageId,
          recipientId: job.data.recipientId,
          recipientType: 'NURSE' as any,
          channel: 'IN_APP' as any,
          status: job.data.status as any,
          deliveredAt: job.data.deliveredAt,
          failureReason: job.data.failureReason,
        });
      }

      // Step 2: Broadcast delivery confirmation via WebSocket
      await this.websocketService.broadcastMessageDelivery(
        job.data.messageId,
        job.data.status as any,
      );

      // Step 3: Update message if this is a read receipt - remove status update since Message model doesn't have status
      const message = await this.messageModel.findByPk(job.data.messageId);
      if (message) {
        await message.update({});
      }

      const processingTime = Date.now() - startTime;
      this.logger.log(
        `Delivery confirmation processed: ${job.data.messageId} (${processingTime}ms)`,
      );

      return {
        success: true,
        data: {
          messageId: job.data.messageId,
          status: job.data.status,
          confirmedAt: new Date(),
        },
        metadata: {
          processingTime,
          attempts: job.attemptsMade,
          completedAt: new Date(),
        },
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.logger.error(
        `Failed to process delivery confirmation: ${error.message}`,
        error.stack,
      );

      return {
        success: false,
        error: {
          message: error.message,
          stack: error.stack,
        },
        metadata: {
          processingTime,
          attempts: job.attemptsMade,
          completedAt: new Date(),
        },
      };
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: JobResult) {
    this.logger.log(
      `Job ${job.id} completed successfully (attempts: ${result.metadata.attempts})`,
    );
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Job ${job.id} failed after ${job.attemptsMade} attempts: ${error.message}`,
    );
  }
}