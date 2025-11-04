/**
 * @fileoverview Notification Utility Functions
 * @module app/notifications/utils
 *
 * Utility functions, statistics, and dashboard data retrieval for notifications.
 * Includes helper functions and comprehensive analytics.
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import {
  getNotification,
  getNotifications,
  NOTIFICATION_CACHE_TAGS,
} from './notifications.cache';
import type {
  NotificationFilters,
} from './notifications.types';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if notification exists
 */
export async function notificationExists(notificationId: string): Promise<boolean> {
  const notification = await getNotification(notificationId);
  return notification !== null;
}

/**
 * Get notification count
 */
export const getNotificationCount = cache(async (filters?: NotificationFilters): Promise<number> => {
  try {
    const notifications = await getNotifications(filters);
    return notifications.length;
  } catch {
    return 0;
  }
});

/**
 * Get unread notification count
 */
export const getUnreadNotificationCount = cache(async (userId?: string): Promise<number> => {
  try {
    const filters: NotificationFilters = { isRead: false };
    if (userId) filters.userId = userId;

    const notifications = await getNotifications(filters);
    return notifications.length;
  } catch {
    return 0;
  }
});

/**
 * Get notification overview
 */
export async function getNotificationOverview(userId?: string): Promise<{
  totalNotifications: number;
  unreadNotifications: number;
  readNotifications: number;
  pinnedNotifications: number;
  urgentNotifications: number;
}> {
  try {
    const filters: NotificationFilters = {};
    if (userId) filters.userId = userId;

    const notifications = await getNotifications(filters);

    return {
      totalNotifications: notifications.length,
      unreadNotifications: notifications.filter(n => !n.isRead).length,
      readNotifications: notifications.filter(n => n.isRead).length,
      pinnedNotifications: notifications.filter(n => n.isPinned).length,
      urgentNotifications: notifications.filter(n => n.priority === 'urgent').length,
    };
  } catch {
    return {
      totalNotifications: 0,
      unreadNotifications: 0,
      readNotifications: 0,
      pinnedNotifications: 0,
      urgentNotifications: 0,
    };
  }
}

// ==========================================
// DASHBOARD FUNCTIONS
// ==========================================

/**
 * Get comprehensive notifications statistics for dashboard
 * @returns Promise<NotificationsStats> Statistics object with notification metrics
 */
export async function getNotificationsStats(): Promise<{
  totalNotifications: number;
  unreadNotifications: number;
  systemAlerts: number;
  userNotifications: number;
  emergencyAlerts: number;
  scheduledNotifications: number;
  deliveredNotifications: number;
  failedNotifications: number;
  todayNotifications: number;
  priorityNotifications: number;
  channelStats: {
    email: number;
    sms: number;
    push: number;
    in_app: number;
  };
}> {
  try {
    console.log('[Notifications] Loading notification statistics');

    // Get notifications data
    const notifications = await getNotifications();

    // Calculate today's date for filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate statistics based on notification schema properties
    const totalNotifications = notifications.length;
    const unreadNotifications = notifications.filter(n => !n.isRead).length;
    const systemAlerts = notifications.filter(n => n.type === 'system').length;
    const userNotifications = notifications.filter(n => n.type === 'user').length;
    const emergencyAlerts = notifications.filter(n => n.priority === 'urgent').length;
    const scheduledNotifications = notifications.filter(n => n.scheduledAt).length;
    const deliveredNotifications = notifications.filter(n => n.status === 'delivered').length;
    const failedNotifications = notifications.filter(n => n.status === 'failed').length;
    const todayNotifications = notifications.filter(n => {
      const notificationDate = new Date(n.createdAt);
      notificationDate.setHours(0, 0, 0, 0);
      return notificationDate.getTime() === today.getTime();
    }).length;
    const priorityNotifications = notifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length;

    // Calculate channel statistics
    const channelStats = {
      email: notifications.filter(n => n.channels?.includes('email')).length,
      sms: notifications.filter(n => n.channels?.includes('sms')).length,
      push: notifications.filter(n => n.channels?.includes('push')).length,
      in_app: notifications.filter(n => n.channels?.includes('in-app')).length,
    };

    const stats = {
      totalNotifications,
      unreadNotifications,
      systemAlerts,
      userNotifications,
      emergencyAlerts,
      scheduledNotifications,
      deliveredNotifications,
      failedNotifications,
      todayNotifications,
      priorityNotifications,
      channelStats,
    };

    console.log('[Notifications] Statistics calculated:', stats);

    await auditLog({
      action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
      resource: 'notifications_dashboard_stats',
      details: 'Retrieved notification dashboard statistics'
    });

    return stats;
  } catch (error) {
    console.error('[Notifications] Error calculating stats:', error);
    return {
      totalNotifications: 0,
      unreadNotifications: 0,
      systemAlerts: 0,
      userNotifications: 0,
      emergencyAlerts: 0,
      scheduledNotifications: 0,
      deliveredNotifications: 0,
      failedNotifications: 0,
      todayNotifications: 0,
      priorityNotifications: 0,
      channelStats: {
        email: 0,
        sms: 0,
        push: 0,
        in_app: 0,
      },
    };
  }
}

/**
 * Get notifications dashboard data with recent notifications and delivery status
 * @returns Promise<NotificationsDashboardData> Dashboard data with recent notifications and metrics
 */
export async function getNotificationsDashboardData(): Promise<{
  recentNotifications: Array<{
    id: string;
    title: string;
    type: string;
    priority: string;
    isRead: boolean;
    status: string;
    timestamp: string;
    channels: string[];
  }>;
  priorityNotifications: Array<{
    id: string;
    title: string;
    priority: 'high' | 'urgent';
    type: string;
    timestamp: string;
    status: string;
  }>;
  notificationsByType: {
    system: number;
    user: number;
    emergency: number;
    reminder: number;
    announcement: number;
  };
  deliveryStats: {
    delivered: number;
    pending: number;
    failed: number;
    scheduled: number;
  };
  channelPerformance: {
    email: { sent: number; delivered: number; failed: number; };
    sms: { sent: number; delivered: number; failed: number; };
    push: { sent: number; delivered: number; failed: number; };
    in_app: { sent: number; delivered: number; failed: number; };
  };
  stats: {
    totalNotifications: number;
    unreadNotifications: number;
    systemAlerts: number;
    userNotifications: number;
    emergencyAlerts: number;
    scheduledNotifications: number;
    deliveredNotifications: number;
    failedNotifications: number;
    todayNotifications: number;
    priorityNotifications: number;
    channelStats: {
      email: number;
      sms: number;
      push: number;
      in_app: number;
    };
  };
}> {
  try {
    // Get stats and notifications data
    const stats = await getNotificationsStats();
    const notifications = await getNotifications();

    // Sort notifications by date descending and get recent notifications (last 10)
    const sortedNotifications = notifications
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    const recentNotifications = sortedNotifications.map(notification => ({
      id: notification.id,
      title: notification.title,
      type: notification.type,
      priority: notification.priority,
      isRead: notification.isRead,
      status: notification.status,
      timestamp: notification.createdAt,
      channels: notification.channels || [],
    }));

    // Get priority notifications (high, urgent)
    const priorityNotifications = notifications
      .filter(n => ['high', 'urgent'].includes(n.priority))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(notification => ({
        id: notification.id,
        title: notification.title,
        priority: notification.priority as 'high' | 'urgent',
        type: notification.type,
        timestamp: notification.createdAt,
        status: notification.status,
      }));

    // Calculate notifications by type
    const notificationsByType = {
      system: notifications.filter(n => n.type === 'system').length,
      user: notifications.filter(n => n.type === 'user').length,
      emergency: notifications.filter(n => n.priority === 'urgent').length,
      reminder: notifications.filter(n => n.type === 'reminder').length,
      announcement: notifications.filter(n => n.type === 'announcement').length,
    };

    // Calculate delivery statistics
    const deliveryStats = {
      delivered: notifications.filter(n => n.status === 'delivered').length,
      pending: notifications.filter(n => n.status === 'pending').length,
      failed: notifications.filter(n => n.status === 'failed').length,
      scheduled: notifications.filter(n => n.scheduledAt && new Date(n.scheduledAt) > new Date()).length,
    };

    // Calculate channel performance
    const channelPerformance = {
      email: {
        sent: notifications.filter(n => n.channels?.includes('email')).length,
        delivered: notifications.filter(n => n.channels?.includes('email') && n.status === 'delivered').length,
        failed: notifications.filter(n => n.channels?.includes('email') && n.status === 'failed').length,
      },
      sms: {
        sent: notifications.filter(n => n.channels?.includes('sms')).length,
        delivered: notifications.filter(n => n.channels?.includes('sms') && n.status === 'delivered').length,
        failed: notifications.filter(n => n.channels?.includes('sms') && n.status === 'failed').length,
      },
      push: {
        sent: notifications.filter(n => n.channels?.includes('push')).length,
        delivered: notifications.filter(n => n.channels?.includes('push') && n.status === 'delivered').length,
        failed: notifications.filter(n => n.channels?.includes('push') && n.status === 'failed').length,
      },
      in_app: {
        sent: notifications.filter(n => n.channels?.includes('in-app')).length,
        delivered: notifications.filter(n => n.channels?.includes('in-app') && n.status === 'delivered').length,
        failed: notifications.filter(n => n.channels?.includes('in-app') && n.status === 'failed').length,
      },
    };

    const dashboardData = {
      recentNotifications,
      priorityNotifications,
      notificationsByType,
      deliveryStats,
      channelPerformance,
      stats,
    };

    console.log('[Notifications] Dashboard data prepared:', {
      recentCount: recentNotifications.length,
      priorityCount: priorityNotifications.length,
      deliveryStats,
    });

    await auditLog({
      action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
      resource: 'notifications_dashboard_data',
      details: 'Retrieved notification dashboard data'
    });

    return dashboardData;
  } catch (error) {
    console.error('[Notifications] Error loading dashboard data:', error);
    // Return safe defaults with stats fallback
    return {
      recentNotifications: [],
      priorityNotifications: [],
      notificationsByType: {
        system: 0,
        user: 0,
        emergency: 0,
        reminder: 0,
        announcement: 0,
      },
      deliveryStats: {
        delivered: 0,
        pending: 0,
        failed: 0,
        scheduled: 0,
      },
      channelPerformance: {
        email: { sent: 0, delivered: 0, failed: 0 },
        sms: { sent: 0, delivered: 0, failed: 0 },
        push: { sent: 0, delivered: 0, failed: 0 },
        in_app: { sent: 0, delivered: 0, failed: 0 },
      },
      stats: await getNotificationsStats(), // Will return safe defaults
    };
  }
}

/**
 * Clear notification cache
 */
export async function clearNotificationCache(resourceType?: string, resourceId?: string): Promise<void> {
  if (resourceType && resourceId) {
    revalidateTag(`${resourceType}-${resourceId}`, 'default');
  }

  // Clear all notification caches
  Object.values(NOTIFICATION_CACHE_TAGS).forEach(tag => {
    revalidateTag(tag, 'default');
  });

  // Clear list caches
  revalidateTag('notification-list', 'default');
  revalidateTag('notification-template-list', 'default');
  revalidateTag('notification-stats', 'default');
  revalidateTag('notification-dashboard', 'default');

  // Clear paths
  revalidatePath('/notifications', 'page');
  revalidatePath('/notifications/preferences', 'page');
  revalidatePath('/notifications/templates', 'page');
  revalidatePath('/notifications/analytics', 'page');
}
