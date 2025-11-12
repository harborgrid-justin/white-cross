/**
 * WF-COMP-320 | communication-preferences.ts - Communication preference types
 * Purpose: Types for user/contact communication preferences and in-app notifications
 * Dependencies: communication-enums, core/common
 * Exports: CommunicationPreferences, Notification, and related types
 * Last Updated: 2025-11-12 | File Type: .ts
 */

import type { BaseEntity, PaginationParams } from '../../core/common';
import { MessageType, RecipientType, MessageCategory, MessagePriority } from './communication-enums';

// =====================
// COMMUNICATION PREFERENCES
// =====================

/**
 * User Communication Preferences
 */
export interface CommunicationPreferences {
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  voiceEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  preferredLanguage?: string;
  emailAddress?: string;
  phoneNumber?: string;
  pushToken?: string;
}

/**
 * Contact Communication Preferences
 */
export interface ContactCommunicationPreferences {
  contactId: string;
  contactType: RecipientType;
  channels: MessageType[];
  preferredLanguage?: string;
  doNotDisturb: boolean;
  emergencyOnly: boolean;
}

// =====================
// NOTIFICATION TYPES
// =====================

/**
 * In-app notification
 */
export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  message: string;
  type: MessageCategory;
  priority: MessagePriority;
  isRead: boolean;
  readAt?: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Notification filters
 */
export interface NotificationFilters extends PaginationParams {
  isRead?: boolean;
  type?: MessageCategory;
  priority?: MessagePriority;
}
