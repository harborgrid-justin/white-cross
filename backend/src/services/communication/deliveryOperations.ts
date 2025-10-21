/**
 * LOC: C6BF3D5EA9-DELV
 * WC-SVC-COM-017-DELV | deliveryOperations.ts - Delivery Tracking and Status Management
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - database/models
 *   - types.ts
 *   - channelService.ts
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (main service aggregator)
 */

/**
 * WC-SVC-COM-017-DELV | deliveryOperations.ts - Delivery Tracking and Status Management
 * Purpose: Track message delivery status across channels and process scheduled messages
 * Upstream: database models, channel service | Dependencies: sequelize
 * Downstream: index.ts | Called by: CommunicationService, scheduled jobs
 * Related: messageOperations, channelService
 * Exports: Delivery status tracking and scheduled message processing functions
 * Last Updated: 2025-10-18 | File Type: .ts | HIPAA: No PHI - delivery metadata only
 * Critical Path: Status retrieval → Scheduled message processing → Channel delivery → Status update
 * LLM Context: Delivery tracking - monitors message delivery across channels and processes scheduled sends
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { Message, MessageDelivery } from '../../database/models';
import { DeliveryStatus } from '../../database/types/enums';
import { DeliverySummary } from './types';
import { sendViaChannel } from './channelService';

/**
 * Get message delivery status for a specific message
 * @param messageId - Message ID
 * @returns Delivery records and summary statistics
 */
export async function getMessageDeliveryStatus(messageId: string): Promise<{
  deliveries: MessageDelivery[];
  summary: DeliverySummary;
}> {
  try {
    const deliveries = await MessageDelivery.findAll({
      where: { messageId },
      order: [
        ['recipientType', 'ASC'],
        ['channel', 'ASC']
      ]
    });

    const summary: DeliverySummary = {
      total: deliveries.length,
      pending: deliveries.filter((d) => d.status === DeliveryStatus.PENDING).length,
      sent: deliveries.filter((d) => d.status === DeliveryStatus.SENT).length,
      delivered: deliveries.filter((d) => d.status === DeliveryStatus.DELIVERED).length,
      failed: deliveries.filter((d) => d.status === DeliveryStatus.FAILED).length,
      bounced: deliveries.filter((d) => d.status === DeliveryStatus.BOUNCED).length
    };

    return {
      deliveries,
      summary
    };
  } catch (error) {
    logger.error('Error fetching message delivery status:', error);
    throw error;
  }
}

/**
 * Process scheduled messages that are due for delivery
 * Should be called by a cron job or scheduled task
 * @returns Number of messages processed
 */
export async function processScheduledMessages(): Promise<number> {
  try {
    const now = new Date();

    // Find messages with scheduled time in the past and pending deliveries
    const pendingMessages = await Message.findAll({
      where: {
        scheduledAt: {
          [Op.lte]: now
        }
      },
      include: [
        {
          model: MessageDelivery,
          as: 'deliveries',
          where: {
            status: DeliveryStatus.PENDING
          },
          required: true
        }
      ]
    });

    let processedCount = 0;

    for (const message of pendingMessages) {
      const messageWithDeliveries = message as any;
      if (messageWithDeliveries.deliveries && Array.isArray(messageWithDeliveries.deliveries)) {
        for (const delivery of messageWithDeliveries.deliveries) {
          try {
            const result = await sendViaChannel(delivery.channel, {
              to: delivery.contactInfo!,
              subject: message.subject || undefined,
              content: message.content,
              priority: message.priority
            });

            await delivery.update({
              status: DeliveryStatus.DELIVERED,
              sentAt: new Date(),
              deliveredAt: new Date(),
              externalId: result.externalId
            });

            processedCount++;
          } catch (error) {
            await delivery.update({
              status: DeliveryStatus.FAILED,
              failureReason: (error as Error).message
            });
          }
        }
      }
    }

    logger.info(`Processed ${processedCount} scheduled messages`);
    return processedCount;
  } catch (error) {
    logger.error('Error processing scheduled messages:', error);
    throw error;
  }
}

/**
 * Update delivery status for a specific delivery
 * Used for webhook callbacks from external services
 * @param deliveryId - Delivery ID
 * @param status - New delivery status
 * @param metadata - Additional metadata (delivered time, failure reason, etc.)
 * @returns Updated delivery record
 */
export async function updateDeliveryStatus(
  deliveryId: string,
  status: DeliveryStatus,
  metadata?: {
    deliveredAt?: Date;
    failureReason?: string;
    externalId?: string;
  }
): Promise<MessageDelivery> {
  try {
    const delivery = await MessageDelivery.findByPk(deliveryId);

    if (!delivery) {
      throw new Error('Delivery record not found');
    }

    await delivery.update({
      status,
      deliveredAt: metadata?.deliveredAt,
      failureReason: metadata?.failureReason,
      externalId: metadata?.externalId
    });

    logger.info(`Delivery status updated: ${deliveryId} -> ${status}`);
    return delivery;
  } catch (error) {
    logger.error('Error updating delivery status:', error);
    throw error;
  }
}

/**
 * Get all deliveries for a specific recipient
 * @param recipientId - Recipient ID
 * @param limit - Maximum number of deliveries to return
 * @returns Array of delivery records
 */
export async function getRecipientDeliveries(
  recipientId: string,
  limit: number = 50
): Promise<MessageDelivery[]> {
  try {
    const deliveries = await MessageDelivery.findAll({
      where: { recipientId },
      include: [
        {
          model: Message,
          as: 'message',
          attributes: ['id', 'subject', 'content', 'priority', 'category', 'createdAt']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit
    });

    return deliveries;
  } catch (error) {
    logger.error('Error fetching recipient deliveries:', error);
    throw error;
  }
}

/**
 * Retry failed message delivery
 * @param deliveryId - Delivery ID to retry
 * @returns Updated delivery record
 */
export async function retryFailedDelivery(deliveryId: string): Promise<MessageDelivery> {
  try {
    const delivery = await MessageDelivery.findByPk(deliveryId, {
      include: [
        {
          model: Message,
          as: 'message'
        }
      ]
    });

    if (!delivery) {
      throw new Error('Delivery record not found');
    }

    if (delivery.status !== DeliveryStatus.FAILED && delivery.status !== DeliveryStatus.BOUNCED) {
      throw new Error(`Cannot retry delivery with status: ${delivery.status}`);
    }

    const deliveryWithMessage = delivery as any;
    if (!deliveryWithMessage.message) {
      throw new Error('Message not found for delivery');
    }

    const message = deliveryWithMessage.message;

    try {
      const result = await sendViaChannel(delivery.channel, {
        to: delivery.contactInfo!,
        subject: message.subject || undefined,
        content: message.content,
        priority: message.priority
      });

      await delivery.update({
        status: DeliveryStatus.DELIVERED,
        sentAt: new Date(),
        deliveredAt: new Date(),
        externalId: result.externalId,
        failureReason: null
      });

      logger.info(`Successfully retried delivery: ${deliveryId}`);
    } catch (error) {
      await delivery.update({
        status: DeliveryStatus.FAILED,
        failureReason: (error as Error).message
      });

      logger.error(`Failed to retry delivery ${deliveryId}:`, error);
      throw error;
    }

    return delivery;
  } catch (error) {
    logger.error('Error retrying failed delivery:', error);
    throw error;
  }
}
