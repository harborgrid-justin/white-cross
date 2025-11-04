/**
 * @fileoverview Notification Type Definitions
 * @module app/notifications/types
 *
 * TypeScript interfaces and type definitions for the notification system.
 * This module contains all type definitions used across notification modules.
 */

// ==========================================
// ACTION RESULT TYPES
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

// ==========================================
// NOTIFICATION TYPES
// ==========================================

export interface Notification {
  id: string;
  userId: string;
  userName: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder' | 'announcement' | 'emergency' | 'system' | 'user';
  category: 'system' | 'medication' | 'appointment' | 'incident' | 'compliance' | 'communication' | 'security';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  channel: 'in-app' | 'email' | 'sms' | 'push' | 'desktop';
  channels?: ('in-app' | 'email' | 'sms' | 'push' | 'desktop')[];
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

// ==========================================
// NOTIFICATION PREFERENCES TYPES
// ==========================================

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

// ==========================================
// NOTIFICATION TEMPLATE TYPES
// ==========================================

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

// ==========================================
// NOTIFICATION ANALYTICS TYPES
// ==========================================

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
