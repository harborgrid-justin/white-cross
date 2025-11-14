import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { PushNotification } from '@/database/models/push-notification.model';
import { NotificationCategory, NotificationStatus } from '../enums';

import { BaseService } from '@/common/base';
/**
 * Notification Analytics Service
 *
 * @description
 * Provides analytics, statistics, and interaction tracking for notifications.
 * Tracks delivery metrics, user engagement, and category-based insights.
 *
 * This service provides:
 * - Notification interaction tracking (clicks, dismissals)
 * - Delivery analytics and success rates
 * - User-specific notification statistics
 * - Category-based reporting
 * - Historical notification retrieval
 *
 * @example
 * ```typescript
 * // Track user interaction
 * await analyticsService.trackInteraction(notificationId, 'CLICKED');
 *
 * // Get analytics for a period
 * const analytics = await analyticsService.getAnalytics({
 *   start: new Date('2025-01-01'),
 *   end: new Date('2025-01-31')
 * });
 *
 * // Get user statistics
 * const userStats = await analyticsService.getUserNotificationStats(userId);
 * ```
 */
@Injectable()
export class NotificationAnalyticsService extends BaseService {
  constructor(
    @InjectModel(PushNotification)
    private readonly notificationModel: typeof PushNotification,
  ) {
    super("NotificationAnalyticsService");
  }

  /**
   * Track notification interaction
   *
   * @param notificationId - The notification ID
   * @param action - The interaction action (CLICKED or DISMISSED)
   * @throws NotFoundException if notification not found
   *
   * @description
   * Records user interactions with notifications for engagement tracking.
   * Increments the appropriate counter based on the action type.
   */
  async trackInteraction(
    notificationId: string,
    action: 'CLICKED' | 'DISMISSED',
  ): Promise<void> {
    const notification = await this.notificationModel.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (action === 'CLICKED') {
      notification.clickedCount++;
    } else if (action === 'DISMISSED') {
      notification.dismissedCount++;
    }

    await notification.save();

    this.logInfo(`Interaction tracked: ${notificationId} - ${action}`);
  }

  /**
   * Get notification analytics for a period
   *
   * @param period - Time period for analytics
   * @returns Analytics summary with delivery and engagement metrics
   *
   * @example
   * ```typescript
   * const analytics = await analyticsService.getAnalytics({
   *   start: new Date('2025-01-01'),
   *   end: new Date('2025-01-31')
   * });
   * // Returns: { totalSent: 1000, totalDelivered: 950, deliveryRate: 95.00, ... }
   * ```
   */
  async getAnalytics(period: {
    start: Date;
    end: Date;
  }): Promise<{
    period: { start: Date; end: Date };
    totalSent: number;
    totalDelivered: number;
    totalFailed: number;
    totalClicked: number;
    totalDismissed: number;
    deliveryRate: number;
    clickRate: number;
    dismissalRate: number;
  }> {
    const notifications = await this.notificationModel.findAll({
      where: {
        createdAt: {
          [Op.gte]: period.start,
          [Op.lte]: period.end,
        },
      },
    });

    const totalSent = notifications.length;
    const totalDelivered = notifications.filter(
      (n) => n.status === NotificationStatus.DELIVERED,
    ).length;
    const totalFailed = notifications.filter(
      (n) => n.status === NotificationStatus.FAILED,
    ).length;
    const totalClicked = notifications.reduce(
      (sum, n) => sum + n.clickedCount,
      0,
    );
    const totalDismissed = notifications.reduce(
      (sum, n) => sum + n.dismissedCount,
      0,
    );

    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
    const clickRate =
      totalDelivered > 0 ? (totalClicked / totalDelivered) * 100 : 0;
    const dismissalRate =
      totalDelivered > 0 ? (totalDismissed / totalDelivered) * 100 : 0;

    return {
      period,
      totalSent,
      totalDelivered,
      totalFailed,
      totalClicked,
      totalDismissed,
      deliveryRate: Number(deliveryRate.toFixed(2)),
      clickRate: Number(clickRate.toFixed(2)),
      dismissalRate: Number(dismissalRate.toFixed(2)),
    };
  }

  /**
   * Get notification history for a user
   *
   * @param userId - The user ID
   * @param options - Query options (limit, offset, status filter, category filter)
   * @returns Array of notifications for the user
   *
   * @example
   * ```typescript
   * // Get recent notifications
   * const history = await analyticsService.getNotificationHistory(userId, {
   *   limit: 20,
   *   offset: 0
   * });
   *
   * // Get only delivered medication reminders
   * const medHistory = await analyticsService.getNotificationHistory(userId, {
   *   status: NotificationStatus.DELIVERED,
   *   category: NotificationCategory.MEDICATION
   * });
   * ```
   */
  async getNotificationHistory(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      status?: NotificationStatus;
      category?: NotificationCategory;
    },
  ): Promise<PushNotification[]> {
    const where: any = {
      userIds: {
        [Op.contains]: [userId],
      },
    };

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.category) {
      where.category = options.category;
    }

    return this.notificationModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: options?.limit,
      offset: options?.offset,
    });
  }

  /**
   * Get notification statistics for a user
   *
   * @param userId - The user ID
   * @param period - Optional time period
   * @returns Notification statistics for the user
   *
   * @example
   * ```typescript
   * // Get all-time stats
   * const stats = await analyticsService.getUserNotificationStats(userId);
   *
   * // Get stats for specific period
   * const monthlyStats = await analyticsService.getUserNotificationStats(userId, {
   *   start: new Date('2025-01-01'),
   *   end: new Date('2025-01-31')
   * });
   * ```
   */
  async getUserNotificationStats(
    userId: string,
    period?: { start: Date; end: Date },
  ): Promise<{
    total: number;
    delivered: number;
    clicked: number;
    dismissed: number;
    byCategory: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    const where: any = {
      userIds: {
        [Op.contains]: [userId],
      },
    };

    if (period) {
      where.createdAt = {
        [Op.gte]: period.start,
        [Op.lte]: period.end,
      };
    }

    const notifications = await this.notificationModel.findAll({
      where,
    });

    const total = notifications.length;
    const delivered = notifications.filter(
      (n) => n.status === NotificationStatus.DELIVERED,
    ).length;
    const clicked = notifications.reduce((sum, n) => sum + n.clickedCount, 0);
    const dismissed = notifications.reduce(
      (sum, n) => sum + n.dismissedCount,
      0,
    );

    const byCategory: Record<string, number> = {};
    const byPriority: Record<string, number> = {};

    for (const notification of notifications) {
      byCategory[notification.category] =
        (byCategory[notification.category] || 0) + 1;
      byPriority[notification.priority] =
        (byPriority[notification.priority] || 0) + 1;
    }

    return {
      total,
      delivered,
      clicked,
      dismissed,
      byCategory,
      byPriority,
    };
  }

  /**
   * Get category analytics for a period
   *
   * @param period - Time period for analytics
   * @returns Analytics broken down by notification category
   *
   * @example
   * ```typescript
   * const categoryAnalytics = await analyticsService.getCategoryAnalytics({
   *   start: new Date('2025-01-01'),
   *   end: new Date('2025-01-31')
   * });
   * ```
   */
  async getCategoryAnalytics(period: {
    start: Date;
    end: Date;
  }): Promise<
    Array<{
      category: NotificationCategory;
      count: number;
      delivered: number;
      clicked: number;
      deliveryRate: number;
      clickRate: number;
    }>
  > {
    const notifications = await this.notificationModel.findAll({
      where: {
        createdAt: {
          [Op.gte]: period.start,
          [Op.lte]: period.end,
        },
      },
    });

    const categoryMap = new Map<
      NotificationCategory,
      {
        count: number;
        delivered: number;
        clicked: number;
      }
    >();

    for (const notification of notifications) {
      const existing = categoryMap.get(notification.category) || {
        count: 0,
        delivered: 0,
        clicked: 0,
      };

      existing.count++;
      if (notification.status === NotificationStatus.DELIVERED) {
        existing.delivered++;
      }
      existing.clicked += notification.clickedCount;

      categoryMap.set(notification.category, existing);
    }

    return Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      count: stats.count,
      delivered: stats.delivered,
      clicked: stats.clicked,
      deliveryRate:
        stats.count > 0
          ? Number(((stats.delivered / stats.count) * 100).toFixed(2))
          : 0,
      clickRate:
        stats.delivered > 0
          ? Number(((stats.clicked / stats.delivered) * 100).toFixed(2))
          : 0,
    }));
  }

  /**
   * Get engagement trends over time
   *
   * @param period - Time period for analysis
   * @param groupBy - Grouping interval ('day', 'week', 'month')
   * @returns Daily/weekly/monthly engagement metrics
   */
  async getEngagementTrends(
    period: { start: Date; end: Date },
    groupBy: 'day' | 'week' | 'month' = 'day',
  ): Promise<
    Array<{
      date: string;
      sent: number;
      delivered: number;
      clicked: number;
      dismissed: number;
    }>
  > {
    const notifications = await this.notificationModel.findAll({
      where: {
        createdAt: {
          [Op.gte]: period.start,
          [Op.lte]: period.end,
        },
      },
      order: [['createdAt', 'ASC']],
    });

    const trends = new Map<
      string,
      {
        sent: number;
        delivered: number;
        clicked: number;
        dismissed: number;
      }
    >();

    for (const notification of notifications) {
      const date = this.formatDateByGroup(notification.createdAt, groupBy);
      const existing = trends.get(date) || {
        sent: 0,
        delivered: 0,
        clicked: 0,
        dismissed: 0,
      };

      existing.sent++;
      if (notification.status === NotificationStatus.DELIVERED) {
        existing.delivered++;
      }
      existing.clicked += notification.clickedCount;
      existing.dismissed += notification.dismissedCount;

      trends.set(date, existing);
    }

    return Array.from(trends.entries())
      .map(([date, stats]) => ({
        date,
        ...stats,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Format date based on grouping interval
   */
  private formatDateByGroup(date: Date, groupBy: 'day' | 'week' | 'month'): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    switch (groupBy) {
      case 'day':
        return `${year}-${month}-${day}`;
      case 'week':
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        return `${weekStart.getFullYear()}-W${String(this.getWeekNumber(weekStart)).padStart(2, '0')}`;
      case 'month':
        return `${year}-${month}`;
      default:
        return `${year}-${month}-${day}`;
    }
  }

  /**
   * Get ISO week number
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
}
