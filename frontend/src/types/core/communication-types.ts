/**
 * WF-COMP-319 | communication-types.ts - Communication Type Definitions
 * Purpose: Communication, notification, and messaging types
 * Upstream: Backend messaging models | Dependencies: base-entities, enumerations
 * Downstream: Messaging, notifications, alerts | Called by: Communication services
 * Related: Base entities, enumerations
 * Exports: NotificationPreferences, CommunicationLog | Key Features: Message delivery tracking
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Event trigger → Message creation → Delivery → Status tracking
 * LLM Context: Communication and notification types, part of type system refactoring
 */

/**
 * Communication Types Module
 *
 * Defines types for communication, notifications, and message delivery
 * tracking. Used across the messaging and alert systems.
 *
 * @module types/core/communication-types
 * @category Types
 */

import type { BaseEntity } from './base-entities';
import type { NotificationMethod } from './enumerations';

/**
 * Notification preferences for a user or contact.
 *
 * Defines which communication channels a person wants to receive
 * notifications through. Used for both system users and emergency contacts.
 *
 * @property {boolean} email - Receive email notifications
 * @property {boolean} sms - Receive SMS/text notifications
 * @property {boolean} push - Receive push notifications (mobile/web)
 * @property {boolean} inApp - Receive in-app notifications
 * @property {boolean} [emergencyOnly] - Only notify for emergency situations
 *
 * @example
 * ```typescript
 * const preferences: NotificationPreferences = {
 *   email: true,
 *   sms: true,
 *   push: false,
 *   inApp: true,
 *   emergencyOnly: false
 * };
 * ```
 */
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  emergencyOnly?: boolean;
}

/**
 * Communication log entry tracking sent messages.
 *
 * Records all communication attempts with delivery status tracking.
 * Used for audit trails and delivery verification.
 *
 * @extends {BaseEntity}
 * @property {NotificationMethod} type - Communication channel used
 * @property {string} to - Recipient identifier (email, phone, user ID)
 * @property {string} [subject] - Message subject (for email)
 * @property {string} message - Message content/body
 * @property {'SENT' | 'DELIVERED' | 'FAILED' | 'PENDING'} status - Delivery status
 * @property {string} [sentAt] - ISO 8601 timestamp when message was sent
 * @property {string} [deliveredAt] - ISO 8601 timestamp when message was delivered
 * @property {string} [errorMessage] - Error description if delivery failed
 *
 * @example
 * ```typescript
 * const log: CommunicationLog = {
 *   id: 'log-uuid',
 *   type: 'SMS',
 *   to: '+1-555-0123',
 *   message: 'Your child has been checked in to the health office.',
 *   status: 'DELIVERED',
 *   sentAt: '2025-11-12T10:00:00Z',
 *   deliveredAt: '2025-11-12T10:00:05Z',
 *   createdAt: '2025-11-12T10:00:00Z',
 *   updatedAt: '2025-11-12T10:00:05Z'
 * };
 * ```
 */
export interface CommunicationLog extends BaseEntity {
  type: NotificationMethod;
  to: string;
  subject?: string;
  message: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED' | 'PENDING';
  sentAt?: string;
  deliveredAt?: string;
  errorMessage?: string;
}
