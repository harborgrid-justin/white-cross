/**
 * LOC: C6BF3D5EA9-STAT
 * WC-SVC-COM-017-STAT | statisticsOperations.ts - Communication Statistics and Analytics
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - database/models
 *   - types.ts
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (main service aggregator)
 */

/**
 * WC-SVC-COM-017-STAT | statisticsOperations.ts - Communication Statistics and Analytics
 * Purpose: Aggregated communication statistics and analytics for reporting
 * Upstream: database models | Dependencies: sequelize
 * Downstream: index.ts | Called by: CommunicationService, reporting systems
 * Related: messageOperations, deliveryOperations
 * Exports: Statistics and analytics functions
 * Last Updated: 2025-10-18 | File Type: .ts | HIPAA: No PHI - aggregated data only
 * Critical Path: Query filters → Data aggregation → Statistics calculation → Response formatting
 * LLM Context: Communication analytics - provides insights into message volume, channels, and delivery success
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { Message, MessageDelivery, sequelize } from '../../database/models';
import { CommunicationStatistics } from './types';

/**
 * Get communication statistics with optional date filtering
 * @param dateFrom - Start date for statistics
 * @param dateTo - End date for statistics
 * @returns Aggregated statistics
 */
export async function getCommunicationStatistics(
  dateFrom?: Date,
  dateTo?: Date
): Promise<CommunicationStatistics> {
  try {
    const whereClause: any = {};

    if (dateFrom || dateTo) {
      whereClause.createdAt = {};
      if (dateFrom) {
        whereClause.createdAt[Op.gte] = dateFrom;
      }
      if (dateTo) {
        whereClause.createdAt[Op.lte] = dateTo;
      }
    }

    // Get total messages count
    const totalMessages = await Message.count({ where: whereClause });

    // Get statistics by category
    const categoryStats = await Message.findAll({
      where: whereClause,
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('category')), 'count']
      ],
      group: ['category'],
      raw: true
    });

    // Get statistics by priority
    const priorityStats = await Message.findAll({
      where: whereClause,
      attributes: [
        'priority',
        [sequelize.fn('COUNT', sequelize.col('priority')), 'count']
      ],
      group: ['priority'],
      raw: true
    });

    // Get statistics by channel (from deliveries)
    const channelStats = await MessageDelivery.findAll({
      attributes: [
        'channel',
        [sequelize.fn('COUNT', sequelize.col('channel')), 'count']
      ],
      include: [
        {
          model: Message,
          as: 'message',
          where: whereClause,
          attributes: []
        }
      ],
      group: ['channel'],
      raw: true
    });

    // Get delivery status statistics
    const deliveryStats = await MessageDelivery.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      include: [
        {
          model: Message,
          as: 'message',
          where: whereClause,
          attributes: []
        }
      ],
      group: ['status'],
      raw: true
    });

    return {
      totalMessages,
      byCategory: categoryStats.reduce((acc: Record<string, number>, curr: any) => {
        acc[curr.category] = parseInt(curr.count, 10);
        return acc;
      }, {}),
      byPriority: priorityStats.reduce((acc: Record<string, number>, curr: any) => {
        acc[curr.priority] = parseInt(curr.count, 10);
        return acc;
      }, {}),
      byChannel: channelStats.reduce((acc: Record<string, number>, curr: any) => {
        acc[curr.channel] = parseInt(curr.count, 10);
        return acc;
      }, {}),
      deliveryStatus: deliveryStats.reduce((acc: Record<string, number>, curr: any) => {
        acc[curr.status] = parseInt(curr.count, 10);
        return acc;
      }, {})
    };
  } catch (error) {
    logger.error('Error fetching communication statistics:', error);
    throw error;
  }
}

/**
 * Get statistics for a specific sender
 * @param senderId - Sender user ID
 * @param dateFrom - Start date for statistics
 * @param dateTo - End date for statistics
 * @returns Sender-specific statistics
 */
export async function getSenderStatistics(
  senderId: string,
  dateFrom?: Date,
  dateTo?: Date
): Promise<{
  totalMessagesSent: number;
  totalRecipients: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  deliverySuccessRate: number;
}> {
  try {
    const whereClause: any = { senderId };

    if (dateFrom || dateTo) {
      whereClause.createdAt = {};
      if (dateFrom) {
        whereClause.createdAt[Op.gte] = dateFrom;
      }
      if (dateTo) {
        whereClause.createdAt[Op.lte] = dateTo;
      }
    }

    // Get total messages sent
    const totalMessagesSent = await Message.count({ where: whereClause });

    // Get total recipients
    const recipientSum = await Message.sum('recipientCount', { where: whereClause });
    const totalRecipients = recipientSum || 0;

    // Get statistics by category
    const categoryStats = await Message.findAll({
      where: whereClause,
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('category')), 'count']
      ],
      group: ['category'],
      raw: true
    });

    // Get statistics by priority
    const priorityStats = await Message.findAll({
      where: whereClause,
      attributes: [
        'priority',
        [sequelize.fn('COUNT', sequelize.col('priority')), 'count']
      ],
      group: ['priority'],
      raw: true
    });

    // Calculate delivery success rate
    const deliveryStats = await MessageDelivery.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      include: [
        {
          model: Message,
          as: 'message',
          where: whereClause,
          attributes: []
        }
      ],
      group: ['status'],
      raw: true
    });

    const totalDeliveries = deliveryStats.reduce((sum: number, curr: any) => {
      return sum + parseInt(curr.count, 10);
    }, 0);

    const successfulDeliveries = deliveryStats
      .filter((stat: any) => stat.status === 'DELIVERED')
      .reduce((sum: number, curr: any) => sum + parseInt(curr.count, 10), 0);

    const deliverySuccessRate = totalDeliveries > 0
      ? (successfulDeliveries / totalDeliveries) * 100
      : 0;

    return {
      totalMessagesSent,
      totalRecipients,
      byCategory: categoryStats.reduce((acc: Record<string, number>, curr: any) => {
        acc[curr.category] = parseInt(curr.count, 10);
        return acc;
      }, {}),
      byPriority: priorityStats.reduce((acc: Record<string, number>, curr: any) => {
        acc[curr.priority] = parseInt(curr.count, 10);
        return acc;
      }, {}),
      deliverySuccessRate: Math.round(deliverySuccessRate * 100) / 100
    };
  } catch (error) {
    logger.error('Error fetching sender statistics:', error);
    throw error;
  }
}

/**
 * Get recent activity summary
 * @param hours - Number of hours to look back (default: 24)
 * @returns Recent activity summary
 */
export async function getRecentActivitySummary(hours: number = 24): Promise<{
  messagesSent: number;
  recipientsReached: number;
  deliveryRate: number;
  failureRate: number;
  topCategories: Array<{ category: string; count: number }>;
}> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);

    const whereClause = {
      createdAt: {
        [Op.gte]: cutoffDate
      }
    };

    // Get messages sent in time period
    const messagesSent = await Message.count({ where: whereClause });

    // Get total recipients
    const recipientSum = await Message.sum('recipientCount', { where: whereClause });
    const recipientsReached = recipientSum || 0;

    // Get delivery statistics
    const deliveryStats = await MessageDelivery.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      include: [
        {
          model: Message,
          as: 'message',
          where: whereClause,
          attributes: []
        }
      ],
      group: ['status'],
      raw: true
    });

    const totalDeliveries = deliveryStats.reduce((sum: number, curr: any) => {
      return sum + parseInt(curr.count, 10);
    }, 0);

    const successfulDeliveries = deliveryStats
      .filter((stat: any) => stat.status === 'DELIVERED')
      .reduce((sum: number, curr: any) => sum + parseInt(curr.count, 10), 0);

    const failedDeliveries = deliveryStats
      .filter((stat: any) => stat.status === 'FAILED' || stat.status === 'BOUNCED')
      .reduce((sum: number, curr: any) => sum + parseInt(curr.count, 10), 0);

    const deliveryRate = totalDeliveries > 0
      ? (successfulDeliveries / totalDeliveries) * 100
      : 0;

    const failureRate = totalDeliveries > 0
      ? (failedDeliveries / totalDeliveries) * 100
      : 0;

    // Get top categories
    const categoryStats = await Message.findAll({
      where: whereClause,
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('category')), 'count']
      ],
      group: ['category'],
      order: [[sequelize.fn('COUNT', sequelize.col('category')), 'DESC']],
      limit: 5,
      raw: true
    });

    const topCategories = categoryStats.map((stat: any) => ({
      category: stat.category,
      count: parseInt(stat.count, 10)
    }));

    return {
      messagesSent,
      recipientsReached,
      deliveryRate: Math.round(deliveryRate * 100) / 100,
      failureRate: Math.round(failureRate * 100) / 100,
      topCategories
    };
  } catch (error) {
    logger.error('Error fetching recent activity summary:', error);
    throw error;
  }
}
