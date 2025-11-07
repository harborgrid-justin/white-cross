/**
 * @fileoverview Communications Types - Next.js v14+ Compatible
 *
 * Type definitions and interfaces for communications module.
 *
 * Note: Runtime values (constants) are in communications.constants.ts
 */

import {
  CreateMessageSchema,
  UpdateMessageSchema,
  MessageFilterSchema,
  MarkAsReadSchema,
  ArchiveMessageSchema,
  DeleteMessageSchema,
  FileUploadSchema,
  type Message,
  type MessageThread,
  type CreateMessageInput,
  type UpdateMessageInput,
  type MessageFilter
} from '@/lib/validations/message.schemas';
import {
  CreateBroadcastSchema,
  UpdateBroadcastSchema,
  BroadcastFilterSchema,
  CancelBroadcastSchema,
  AcknowledgeBroadcastSchema,
  type Broadcast,
  type CreateBroadcastInput,
  type UpdateBroadcastInput,
  type BroadcastFilter
} from '@/lib/validations/broadcast.schemas';
import {
  CreateNotificationSchema,
  NotificationFilterSchema,
  MarkNotificationAsReadSchema,
  MarkAllAsReadSchema,
  ArchiveNotificationSchema,
  DeleteNotificationSchema,
  UpdateNotificationPreferencesSchema,
  type Notification,
  type NotificationFilter,
  type NotificationPreferences,
  type NotificationCount
} from '@/lib/validations/notification.schemas';
import {
  CreateTemplateSchema,
  UpdateTemplateSchema,
  TemplateFilterSchema,
  RenderTemplateSchema,
  DeleteTemplateSchema,
  DuplicateTemplateSchema,
  type Template,
  type TemplateFilter,
  type RenderedTemplate
} from '@/lib/validations/template.schemas';

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

export interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'internal' | 'system';
  category: 'general' | 'medical' | 'academic' | 'emergency' | 'reminder' | 'notification';
  variables: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageTemplateData {
  name: string;
  description: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'internal' | 'system';
  category: 'general' | 'medical' | 'academic' | 'emergency' | 'reminder' | 'notification';
  variables?: string[];
  isActive?: boolean;
}

export interface CommunicationAnalytics {
  totalMessages: number;
  sentMessages: number;
  failedMessages: number;
  averageResponseTime: number;
  deliveryRate: number;
  typeBreakdown: {
    type: 'email' | 'sms' | 'internal' | 'system';
    count: number;
    percentage: number;
  }[];
  statusBreakdown: {
    status: 'draft' | 'sent' | 'delivered' | 'read' | 'archived' | 'deleted';
    count: number;
    percentage: number;
  }[];
  recentActivity: {
    date: string;
    sent: number;
    received: number;
  }[];
}

// Re-export validation schemas for convenience
export {
  CreateMessageSchema,
  UpdateMessageSchema,
  MessageFilterSchema,
  MarkAsReadSchema,
  ArchiveMessageSchema,
  DeleteMessageSchema,
  FileUploadSchema,
  CreateBroadcastSchema,
  UpdateBroadcastSchema,
  BroadcastFilterSchema,
  CancelBroadcastSchema,
  AcknowledgeBroadcastSchema,
  CreateNotificationSchema,
  NotificationFilterSchema,
  MarkNotificationAsReadSchema,
  MarkAllAsReadSchema,
  ArchiveNotificationSchema,
  DeleteNotificationSchema,
  UpdateNotificationPreferencesSchema,
  CreateTemplateSchema,
  UpdateTemplateSchema,
  TemplateFilterSchema,
  RenderTemplateSchema,
  DeleteTemplateSchema,
  DuplicateTemplateSchema,
};

// Re-export types from validation schemas
export type {
  Message,
  MessageThread,
  CreateMessageInput,
  UpdateMessageInput,
  MessageFilter,
  Broadcast,
  CreateBroadcastInput,
  UpdateBroadcastInput,
  BroadcastFilter,
  Notification,
  NotificationFilter,
  NotificationPreferences,
  NotificationCount,
  Template,
  TemplateFilter,
  RenderedTemplate,
};