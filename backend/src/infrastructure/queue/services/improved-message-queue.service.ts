/**
 * @fileoverview Improved Message Queue Service
 * @module infrastructure/queue/services
 * @description Service for managing message-related queues using the base queue service
 */

import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Job, Queue } from 'bull';
import { QueueName } from '../enums';
import { QueueConfigService } from '../queue.config';
import {
  BatchMessageJobDto,
  DeliveryConfirmationJobDto,
  EncryptionJobDto,
  IndexingJobDto,
  MessageCleanupJobDto,
  NotificationJobDto,
  SendMessageJobDto,
} from '../dtos';
import { QueueJobOptions } from '../interfaces';
import { BaseQueueService } from './base-queue.service';

import { BaseService } from '../../../common/base';
import { BaseService } from '../../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
/**
 * Improved Message Queue Service
 * Extends BaseQueueService to eliminate code duplication
 */
@Injectable()
export class ImprovedMessageQueueService extends BaseQueueService {
  constructor(
    @InjectQueue(QueueName.MESSAGE_DELIVERY)
    private readonly messageDeliveryQueue: Queue,

    @InjectQueue(QueueName.MESSAGE_NOTIFICATION)
    private readonly notificationQueue: Queue,

    @InjectQueue(QueueName.MESSAGE_INDEXING)
    private readonly indexingQueue: Queue,

    @InjectQueue(QueueName.MESSAGE_ENCRYPTION)
    private readonly encryptionQueue: Queue,

    @InjectQueue(QueueName.BATCH_MESSAGE_SENDING)
    private readonly batchMessageQueue: Queue,

    @InjectQueue(QueueName.MESSAGE_CLEANUP)
    private readonly cleanupQueue: Queue,

    queueConfig: QueueConfigService,
  ) {
    super(queueConfig, 'ImprovedMessageQueueService');

    // Register all queues with the base service
    this.registerQueue(QueueName.MESSAGE_DELIVERY, messageDeliveryQueue);
    this.registerQueue(QueueName.MESSAGE_NOTIFICATION, notificationQueue);
    this.registerQueue(QueueName.MESSAGE_INDEXING, indexingQueue);
    this.registerQueue(QueueName.MESSAGE_ENCRYPTION, encryptionQueue);
    this.registerQueue(QueueName.BATCH_MESSAGE_SENDING, batchMessageQueue);
    this.registerQueue(QueueName.MESSAGE_CLEANUP, cleanupQueue);
  }

  /**
   * Add a message delivery job
   */
  async addMessageDeliveryJob(
    data: SendMessageJobDto,
    options?: QueueJobOptions,
  ): Promise<Job<SendMessageJobDto>> {
    const job = await this.addJobToQueue(QueueName.MESSAGE_DELIVERY, 'send-message', data, options);

    this.logInfo(`Message delivery job added for messageId: ${data.messageId}`);
    return job;
  }

  /**
   * Add a delivery confirmation job
   */
  async addDeliveryConfirmationJob(
    data: DeliveryConfirmationJobDto,
    options?: QueueJobOptions,
  ): Promise<Job<DeliveryConfirmationJobDto>> {
    const job = await this.addJobToQueue(
      QueueName.MESSAGE_DELIVERY,
      'delivery-confirmation',
      data,
      options,
    );

    this.logInfo(
      `Delivery confirmation job added for messageId: ${data.messageId}, status: ${data.status}`,
    );
    return job;
  }

  /**
   * Add a notification job
   */
  async addNotificationJob(
    data: NotificationJobDto,
    options?: QueueJobOptions,
  ): Promise<Job<NotificationJobDto>> {
    const job = await this.addJobToQueue(
      QueueName.MESSAGE_NOTIFICATION,
      'send-notification',
      data,
      options,
    );

    this.logInfo(`Notification job added: type=${data.type}, recipientId=${data.recipientId}`);
    return job;
  }

  /**
   * Add an encryption job
   */
  async addEncryptionJob(
    data: EncryptionJobDto,
    options?: QueueJobOptions,
  ): Promise<Job<EncryptionJobDto>> {
    const job = await this.addJobToQueue(
      QueueName.MESSAGE_ENCRYPTION,
      'encrypt-decrypt',
      data,
      options,
    );

    this.logInfo(
      `Encryption job added: operation=${data.operation}, messageId=${data.messageId}`,
    );
    return job;
  }

  /**
   * Add an indexing job
   */
  async addIndexingJob(
    data: IndexingJobDto,
    options?: QueueJobOptions,
  ): Promise<Job<IndexingJobDto>> {
    const job = await this.addJobToQueue(
      QueueName.MESSAGE_INDEXING,
      'index-message',
      data,
      options,
    );

    this.logInfo(`Indexing job added: operation=${data.operation}, messageId=${data.messageId}`);
    return job;
  }

  /**
   * Add a batch message job
   */
  async addBatchMessageJob(
    data: BatchMessageJobDto,
    options?: QueueJobOptions,
  ): Promise<Job<BatchMessageJobDto>> {
    const job = await this.addJobToQueue(
      QueueName.BATCH_MESSAGE_SENDING,
      'batch-send',
      data,
      options,
    );

    this.logInfo(`Batch message job added with ${data.recipientIds.length} recipients`);
    return job;
  }

  /**
   * Add a cleanup job
   */
  async addCleanupJob(
    data: MessageCleanupJobDto,
    options?: QueueJobOptions,
  ): Promise<Job<MessageCleanupJobDto>> {
    const job = await this.addJobToQueue(
      QueueName.MESSAGE_CLEANUP,
      'cleanup-messages',
      data,
      options,
    );

    this.logInfo(`Cleanup job added: type=${data.cleanupType}`);
    return job;
  }

  /**
   * Add multiple message delivery jobs in batch
   */
  async addBatchMessageDeliveryJobs(
    jobs: Array<{ data: SendMessageJobDto; options?: QueueJobOptions }>,
  ): Promise<Job<SendMessageJobDto>[]> {
    const batchJobs = jobs.map(({ data, options }) => ({
      name: 'send-message',
      data,
      options,
    }));

    const createdJobs = await this.addBatchJobsToQueue(QueueName.MESSAGE_DELIVERY, batchJobs);

    this.logInfo(`Batch message delivery jobs added: ${createdJobs.length} jobs`);

    return createdJobs;
  }

  /**
   * Add multiple notification jobs in batch
   */
  async addBatchNotificationJobs(
    jobs: Array<{ data: NotificationJobDto; options?: QueueJobOptions }>,
  ): Promise<Job<NotificationJobDto>[]> {
    const batchJobs = jobs.map(({ data, options }) => ({
      name: 'send-notification',
      data,
      options,
    }));

    const createdJobs = await this.addBatchJobsToQueue(QueueName.MESSAGE_NOTIFICATION, batchJobs);

    this.logInfo(`Batch notification jobs added: ${createdJobs.length} jobs`);

    return createdJobs;
  }

  /**
   * Get message delivery queue health
   */
  async getMessageDeliveryHealth() {
    return this.getQueueHealth(QueueName.MESSAGE_DELIVERY);
  }

  /**
   * Get notification queue health
   */
  async getNotificationHealth() {
    return this.getQueueHealth(QueueName.MESSAGE_NOTIFICATION);
  }

  /**
   * Get all message queue metrics
   */
  async getAllMessageQueueMetrics() {
    return this.getQueueMetrics();
  }

  /**
   * Clean all message queues
   */
  async cleanAllMessageQueues(grace: number = 86400000): Promise<void> {
    const queueNames = this.getRegisteredQueueNames();

    await Promise.all(queueNames.map((queueName) => this.cleanQueue(queueName, grace)));

    this.logInfo('All message queues cleaned');
  }

  /**
   * Pause all message queues
   */
  async pauseAllMessageQueues(): Promise<void> {
    const queueNames = this.getRegisteredQueueNames();

    await Promise.all(queueNames.map((queueName) => this.pauseQueue(queueName)));

    this.logWarning('All message queues paused');
  }

  /**
   * Resume all message queues
   */
  async resumeAllMessageQueues(): Promise<void> {
    const queueNames = this.getRegisteredQueueNames();

    await Promise.all(queueNames.map((queueName) => this.resumeQueue(queueName)));

    this.logInfo('All message queues resumed');
  }
}
