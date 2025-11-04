/**
 * @fileoverview Administration domain notification type definitions
 * @module hooks/domains/administration/administrationNotificationTypes
 * @category Hooks - Administration
 *
 * Type definitions for multi-channel notifications, delivery tracking, and user preferences.
 *
 * @remarks
 * **Multi-Channel Support:**
 * Notifications can be sent via email, SMS, push, and in-app channels.
 * Each channel has independent delivery tracking.
 *
 * **Priority Levels:**
 * - `LOW`: Informational messages
 * - `NORMAL`: Standard notifications
 * - `HIGH`: Important notifications requiring attention
 * - `URGENT`: Critical notifications requiring immediate action
 */

import { AdminUser } from './administrationUserTypes';

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ALERT';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  category: string;
  recipients: NotificationRecipient[];
  channels: NotificationChannel[];
  status: 'DRAFT' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  scheduledAt?: string;
  sentAt?: string;
  expiresAt?: string;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationRecipient {
  userId: string;
  user?: AdminUser;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  readAt?: string;
  deliveredAt?: string;
}

export interface NotificationChannel {
  type: 'email' | 'sms' | 'push' | 'in-app';
  config?: Record<string, any>;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
}

export interface NotificationAction {
  id: string;
  label: string;
  type: 'button' | 'link';
  url?: string;
  action?: string;
  style?: 'primary' | 'secondary' | 'danger';
}
