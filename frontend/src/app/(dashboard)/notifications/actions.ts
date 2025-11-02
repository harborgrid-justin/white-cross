/**
 * @fileoverview Notification Management Server Actions - Next.js v14+ Compatible
 * @module app/notifications/actions
 *
 * HIPAA-compliant server actions for notification system with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all notification operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Core API integrations
import { serverGet, serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types/api';

// Utils
import { formatDate } from '@/utils/dateUtils';
import { validateEmail, validatePhone } from '@/utils/validation/userValidation';
import { generateId } from '@/utils/generators';
import { formatName, formatPhone } from '@/utils/formatters';

// ==========================================
// CONFIGURATION
// ==========================================

// Custom cache tags for notifications
export const NOTIFICATION_CACHE_TAGS = {
  NOTIFICATIONS: 'notifications',
  PREFERENCES: 'notification-preferences',
  TEMPLATES: 'notification-templates',
  SUBSCRIPTIONS: 'notification-subscriptions',
  CHANNELS: 'notification-channels',
} as const;

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

export interface Notification {
  id: string;
  userId: string;
  userName: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder' | 'announcement' | 'emergency';
  category: 'system' | 'medication' | 'appointment' | 'incident' | 'compliance' | 'communication' | 'security';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  channel: 'in-app' | 'email' | 'sms' | 'push' | 'desktop';
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed' | 'expired';
  isRead: boolean;
  isArchived: boolean;
  isPinned: boolean;
  actionUrl?: string;
  actionLabel?: string;
  imageUrl?: string;
  data: Record<string, unknown>;
  resourceType?: string;
  resourceId?: string;
  scheduledAt?: string;
  sentAt?: string;
  readAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationData {
  userId?: string;
  userIds?: string[];
  title: string;
  message: string;
  type?: Notification['type'];
  category?: Notification['category'];
  priority?: Notification['priority'];
  channels?: Notification['channel'][];
  actionUrl?: string;
  actionLabel?: string;
  imageUrl?: string;
  data?: Record<string, unknown>;
  resourceType?: string;
  resourceId?: string;
  scheduledAt?: string;
  expiresAt?: string;
  templateId?: string;
}

export interface UpdateNotificationData {
  isRead?: boolean;
  isArchived?: boolean;
  isPinned?: boolean;
  status?: Notification['status'];
  readAt?: string;
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  desktopEnabled: boolean;
  categories: {
    system: boolean;
    medication: boolean;
    appointment: boolean;
    incident: boolean;
    compliance: boolean;
    communication: boolean;
    security: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNotificationPreferencesData {
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  pushEnabled?: boolean;
  desktopEnabled?: boolean;
  categories?: Partial<NotificationPreferences['categories']>;
  quietHours?: Partial<NotificationPreferences['quietHours']>;
  frequency?: NotificationPreferences['frequency'];
}

export interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  type: Notification['type'];
  category: Notification['category'];
  title: string;
  message: string;
  variables: string[];
  defaultChannels: Notification['channel'][];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationTemplateData {
  name: string;
  description: string;
  type: Notification['type'];
  category: Notification['category'];
  title: string;
  message: string;
  variables?: string[];
  defaultChannels?: Notification['channel'][];
  isActive?: boolean;
}

export interface NotificationFilters {
  userId?: string;
  type?: Notification['type'];
  category?: Notification['category'];
  priority?: Notification['priority'];
  channel?: Notification['channel'];
  status?: Notification['status'];
  isRead?: boolean;
  isArchived?: boolean;
  isPinned?: boolean;
  resourceType?: string;
  resourceId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface NotificationAnalytics {
  totalNotifications: number;
  sentNotifications: number;
  deliveredNotifications: number;
  readNotifications: number;
  failedNotifications: number;
  readRate: number;
  deliveryRate: number;
  typeBreakdown: {
    type: Notification['type'];
    count: number;
    percentage: number;
  }[];
  categoryBreakdown: {
    category: Notification['category'];
    count: number;
    percentage: number;
  }[];
  channelBreakdown: {
    channel: Notification['channel'];
    count: number;
    percentage: number;
  }[];
  hourlyTrends: {
    hour: number;
    sent: number;
    delivered: number;
    read: number;
  }[];
}

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get notification by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getNotification = cache(async (id: string): Promise<Notification | null> => {
  try {
    const response = await serverGet<ApiResponse<Notification>>(
      `/api/notifications/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [`notification-${id}`, NOTIFICATION_CACHE_TAGS.NOTIFICATIONS] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get notification:', error);
    return null;
  }
});

/**
 * Get all notifications with caching
 */
export const getNotifications = cache(async (filters?: NotificationFilters): Promise<Notification[]> => {
  try {
    const response = await serverGet<ApiResponse<Notification[]>>(
      `/api/notifications`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [NOTIFICATION_CACHE_TAGS.NOTIFICATIONS, 'notification-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get notifications:', error);
    return [];
  }
});

/**
 * Get user notification preferences with caching
 */
export const getNotificationPreferences = cache(async (userId: string): Promise<NotificationPreferences | null> => {
  try {
    const response = await serverGet<ApiResponse<NotificationPreferences>>(
      `/api/users/${userId}/notification-preferences`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [`notification-preferences-${userId}`, NOTIFICATION_CACHE_TAGS.PREFERENCES] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get notification preferences:', error);
    return null;
  }
});

/**
 * Get notification templates with caching
 */
export const getNotificationTemplates = cache(async (): Promise<NotificationTemplate[]> => {
  try {
    const response = await serverGet<ApiResponse<NotificationTemplate[]>>(
      `/api/notifications/templates`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATIC,
          tags: [NOTIFICATION_CACHE_TAGS.TEMPLATES, 'notification-template-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get notification templates:', error);
    return [];
  }
});

/**
 * Get notification analytics with caching
 */
export const getNotificationAnalytics = cache(async (filters?: Record<string, unknown>): Promise<NotificationAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<NotificationAnalytics>>(
      `/api/notifications/analytics`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATS,
          tags: ['notification-analytics', 'notification-stats'] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get notification analytics:', error);
    return null;
  }
});

// ==========================================
// NOTIFICATION OPERATIONS
// ==========================================

/**
 * Create a new notification
 * Includes audit logging and cache invalidation
 */
export async function createNotificationAction(data: CreateNotificationData): Promise<ActionResult<Notification>> {
  try {
    // Validate required fields
    if (!data.title || !data.message) {
      return {
        success: false,
        error: 'Missing required fields: title, message'
      };
    }

    const response = await serverPost<ApiResponse<Notification>>(
      `/api/notifications`,
      data,
      {
        cache: 'no-store',
        next: { tags: [NOTIFICATION_CACHE_TAGS.NOTIFICATIONS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create notification');
    }

    // AUDIT LOG - Notification creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Notification',
      resourceId: response.data.id,
      details: `Created notification: ${data.title}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(NOTIFICATION_CACHE_TAGS.NOTIFICATIONS);
    revalidateTag('notification-list');
    revalidatePath('/notifications', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Notification created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create notification';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Notification',
      details: `Failed to create notification: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Update notification
 * Includes audit logging and cache invalidation
 */
export async function updateNotificationAction(
  notificationId: string,
  data: UpdateNotificationData
): Promise<ActionResult<Notification>> {
  try {
    if (!notificationId) {
      return {
        success: false,
        error: 'Notification ID is required'
      };
    }

    const response = await serverPut<ApiResponse<Notification>>(
      `/api/notifications/${notificationId}`,
      data,
      {
        cache: 'no-store',
        next: { tags: [NOTIFICATION_CACHE_TAGS.NOTIFICATIONS, `notification-${notificationId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update notification');
    }

    // Cache invalidation (minimal audit logging for read status)
    revalidateTag(NOTIFICATION_CACHE_TAGS.NOTIFICATIONS);
    revalidateTag(`notification-${notificationId}`);
    revalidateTag('notification-list');
    revalidatePath('/notifications', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Notification updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update notification';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Mark notification as read
 * Includes cache invalidation
 */
export async function markNotificationReadAction(notificationId: string): Promise<ActionResult<Notification>> {
  try {
    if (!notificationId) {
      return {
        success: false,
        error: 'Notification ID is required'
      };
    }

    const response = await serverPost<ApiResponse<Notification>>(
      `/api/notifications/${notificationId}/read`,
      {},
      {
        cache: 'no-store',
        next: { tags: [NOTIFICATION_CACHE_TAGS.NOTIFICATIONS, `notification-${notificationId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to mark notification as read');
    }

    // Cache invalidation (no audit log for read status)
    revalidateTag(NOTIFICATION_CACHE_TAGS.NOTIFICATIONS);
    revalidateTag(`notification-${notificationId}`);
    revalidateTag('notification-list');
    revalidatePath('/notifications', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Notification marked as read'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to mark notification as read';

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Mark all notifications as read
 * Includes cache invalidation
 */
export async function markAllNotificationsReadAction(userId: string): Promise<ActionResult<void>> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const response = await serverPost<ApiResponse<void>>(
      `/api/users/${userId}/notifications/mark-all-read`,
      {},
      {
        cache: 'no-store',
        next: { tags: [NOTIFICATION_CACHE_TAGS.NOTIFICATIONS] }
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to mark all notifications as read');
    }

    // Cache invalidation
    revalidateTag(NOTIFICATION_CACHE_TAGS.NOTIFICATIONS);
    revalidateTag('notification-list');
    revalidatePath('/notifications', 'page');

    return {
      success: true,
      message: 'All notifications marked as read'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to mark all notifications as read';

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// NOTIFICATION PREFERENCES OPERATIONS
// ==========================================

/**
 * Update notification preferences
 * Includes audit logging and cache invalidation
 */
export async function updateNotificationPreferencesAction(
  userId: string,
  data: UpdateNotificationPreferencesData
): Promise<ActionResult<NotificationPreferences>> {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required'
      };
    }

    const response = await serverPut<ApiResponse<NotificationPreferences>>(
      `/api/users/${userId}/notification-preferences`,
      data,
      {
        cache: 'no-store',
        next: { tags: [NOTIFICATION_CACHE_TAGS.PREFERENCES, `notification-preferences-${userId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update notification preferences');
    }

    // AUDIT LOG - Preferences update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'NotificationPreferences',
      resourceId: userId,
      details: 'Updated notification preferences',
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(NOTIFICATION_CACHE_TAGS.PREFERENCES);
    revalidateTag(`notification-preferences-${userId}`);
    revalidatePath('/notifications/preferences', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Notification preferences updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update notification preferences';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'NotificationPreferences',
      resourceId: userId,
      details: `Failed to update notification preferences: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// NOTIFICATION TEMPLATE OPERATIONS
// ==========================================

/**
 * Create notification template
 * Includes audit logging and cache invalidation
 */
export async function createNotificationTemplateAction(data: CreateNotificationTemplateData): Promise<ActionResult<NotificationTemplate>> {
  try {
    // Validate required fields
    if (!data.name || !data.title || !data.message) {
      return {
        success: false,
        error: 'Missing required fields: name, title, message'
      };
    }

    const response = await serverPost<ApiResponse<NotificationTemplate>>(
      `/api/notifications/templates`,
      data,
      {
        cache: 'no-store',
        next: { tags: [NOTIFICATION_CACHE_TAGS.TEMPLATES] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create notification template');
    }

    // AUDIT LOG - Template creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'NotificationTemplate',
      resourceId: response.data.id,
      details: `Created notification template: ${data.name}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(NOTIFICATION_CACHE_TAGS.TEMPLATES);
    revalidateTag('notification-template-list');
    revalidatePath('/notifications/templates', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Notification template created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create notification template';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'NotificationTemplate',
      details: `Failed to create notification template: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Create notification from form data
 * Form-friendly wrapper for createNotificationAction
 */
export async function createNotificationFromForm(formData: FormData): Promise<ActionResult<Notification>> {
  const userIds = (formData.get('userIds') as string)?.split(',').filter(Boolean) || [];
  const channels = (formData.get('channels') as string)?.split(',').filter(Boolean) as Notification['channel'][] || [];

  const notificationData: CreateNotificationData = {
    userId: formData.get('userId') as string || undefined,
    userIds: userIds.length > 0 ? userIds : undefined,
    title: formData.get('title') as string,
    message: formData.get('message') as string,
    type: formData.get('type') as Notification['type'] || 'info',
    category: formData.get('category') as Notification['category'] || 'system',
    priority: formData.get('priority') as Notification['priority'] || 'normal',
    channels: channels.length > 0 ? channels : undefined,
    actionUrl: formData.get('actionUrl') as string || undefined,
    actionLabel: formData.get('actionLabel') as string || undefined,
    imageUrl: formData.get('imageUrl') as string || undefined,
    resourceType: formData.get('resourceType') as string || undefined,
    resourceId: formData.get('resourceId') as string || undefined,
    scheduledAt: formData.get('scheduledAt') as string || undefined,
    expiresAt: formData.get('expiresAt') as string || undefined,
    templateId: formData.get('templateId') as string || undefined,
  };

  const result = await createNotificationAction(notificationData);
  
  if (result.success && result.data) {
    revalidatePath('/notifications', 'page');
  }
  
  return result;
}

/**
 * Update notification preferences from form data
 * Form-friendly wrapper for updateNotificationPreferencesAction
 */
export async function updateNotificationPreferencesFromForm(
  userId: string,
  formData: FormData
): Promise<ActionResult<NotificationPreferences>> {
  const preferencesData: UpdateNotificationPreferencesData = {
    emailEnabled: formData.get('emailEnabled') === 'true',
    smsEnabled: formData.get('smsEnabled') === 'true',
    pushEnabled: formData.get('pushEnabled') === 'true',
    desktopEnabled: formData.get('desktopEnabled') === 'true',
    categories: {
      system: formData.get('categories.system') === 'true',
      medication: formData.get('categories.medication') === 'true',
      appointment: formData.get('categories.appointment') === 'true',
      incident: formData.get('categories.incident') === 'true',
      compliance: formData.get('categories.compliance') === 'true',
      communication: formData.get('categories.communication') === 'true',
      security: formData.get('categories.security') === 'true',
    },
    quietHours: {
      enabled: formData.get('quietHours.enabled') === 'true',
      startTime: formData.get('quietHours.startTime') as string || '22:00',
      endTime: formData.get('quietHours.endTime') as string || '08:00',
    },
    frequency: formData.get('frequency') as NotificationPreferences['frequency'] || 'immediate',
  };

  const result = await updateNotificationPreferencesAction(userId, preferencesData);
  
  if (result.success && result.data) {
    revalidatePath('/notifications/preferences', 'page');
  }
  
  return result;
}

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
      in_app: notifications.filter(n => n.channels?.includes('in_app')).length,
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
        sent: notifications.filter(n => n.channels?.includes('in_app')).length,
        delivered: notifications.filter(n => n.channels?.includes('in_app') && n.status === 'delivered').length,
        failed: notifications.filter(n => n.channels?.includes('in_app') && n.status === 'failed').length,
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
    revalidateTag(`${resourceType}-${resourceId}`);
  }
  
  // Clear all notification caches
  Object.values(NOTIFICATION_CACHE_TAGS).forEach(tag => {
    revalidateTag(tag);
  });

  // Clear list caches
  revalidateTag('notification-list');
  revalidateTag('notification-template-list');
  revalidateTag('notification-stats');
  revalidateTag('notification-dashboard');

  // Clear paths
  revalidatePath('/notifications', 'page');
  revalidatePath('/notifications/preferences', 'page');
  revalidatePath('/notifications/templates', 'page');
  revalidatePath('/notifications/analytics', 'page');
}
