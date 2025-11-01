/**
 * @fileoverview Communications Management Server Actions - Next.js v14+ Compatible
 * @module app/communications/actions
 *
 * HIPAA-compliant server actions for communication management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all communication operations
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

// Custom cache tags for communications
export const COMMUNICATIONS_CACHE_TAGS = {
  MESSAGES: 'communications-messages',
  THREADS: 'communications-threads',
  TEMPLATES: 'communications-templates',
  CONTACTS: 'communications-contacts',
  ATTACHMENTS: 'communications-attachments',
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

export interface Message {
  id: string;
  threadId: string;
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'internal' | 'system';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'failed';
  senderId: string;
  senderName: string;
  senderEmail: string;
  recipientIds: string[];
  recipients: {
    id: string;
    name: string;
    email: string;
    type: 'student' | 'parent' | 'staff' | 'nurse' | 'admin';
    status: 'sent' | 'delivered' | 'read' | 'failed';
  }[];
  attachments?: {
    id: string;
    filename: string;
    size: number;
    mimeType: string;
    url: string;
  }[];
  scheduledAt?: string;
  sentAt?: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageData {
  threadId?: string;
  subject: string;
  content: string;
  type: Message['type'];
  priority?: Message['priority'];
  recipientIds: string[];
  templateId?: string;
  scheduledAt?: string;
  attachments?: string[];
}

export interface UpdateMessageData {
  subject?: string;
  content?: string;
  priority?: Message['priority'];
  recipientIds?: string[];
  scheduledAt?: string;
  status?: Message['status'];
}

export interface MessageThread {
  id: string;
  subject: string;
  participants: {
    id: string;
    name: string;
    email: string;
    type: 'student' | 'parent' | 'staff' | 'nurse' | 'admin';
    lastReadAt?: string;
  }[];
  messageCount: number;
  lastMessageAt: string;
  lastMessagePreview: string;
  isArchived: boolean;
  priority: Message['priority'];
  createdAt: string;
  updatedAt: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  content: string;
  type: Message['type'];
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
  type: Message['type'];
  category: MessageTemplate['category'];
  variables?: string[];
  isActive?: boolean;
}

export interface MessageFilters {
  type?: Message['type'];
  status?: Message['status'];
  priority?: Message['priority'];
  senderId?: string;
  recipientId?: string;
  threadId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface CommunicationAnalytics {
  totalMessages: number;
  sentMessages: number;
  failedMessages: number;
  averageResponseTime: number;
  deliveryRate: number;
  typeBreakdown: {
    type: Message['type'];
    count: number;
    percentage: number;
  }[];
  statusBreakdown: {
    status: Message['status'];
    count: number;
    percentage: number;
  }[];
  recentActivity: {
    date: string;
    sent: number;
    received: number;
  }[];
}

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get message by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getMessage = cache(async (id: string): Promise<Message | null> => {
  try {
    const response = await serverGet<ApiResponse<Message>>(
      `/api/communications/messages/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [`message-${id}`, COMMUNICATIONS_CACHE_TAGS.MESSAGES] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get message:', error);
    return null;
  }
});

/**
 * Get all messages with caching
 */
export const getMessages = cache(async (filters?: MessageFilters): Promise<Message[]> => {
  try {
    const response = await serverGet<ApiResponse<Message[]>>(
      `/api/communications/messages`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [COMMUNICATIONS_CACHE_TAGS.MESSAGES, 'message-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get messages:', error);
    return [];
  }
});

/**
 * Get message thread by ID with caching
 */
export const getMessageThread = cache(async (id: string): Promise<MessageThread | null> => {
  try {
    const response = await serverGet<ApiResponse<MessageThread>>(
      `/api/communications/threads/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [`thread-${id}`, COMMUNICATIONS_CACHE_TAGS.THREADS] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get message thread:', error);
    return null;
  }
});

/**
 * Get all message threads with caching
 */
export const getMessageThreads = cache(async (filters?: Record<string, unknown>): Promise<MessageThread[]> => {
  try {
    const response = await serverGet<ApiResponse<MessageThread[]>>(
      `/api/communications/threads`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [COMMUNICATIONS_CACHE_TAGS.THREADS, 'thread-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get message threads:', error);
    return [];
  }
});

/**
 * Get message template by ID with caching
 */
export const getMessageTemplate = cache(async (id: string): Promise<MessageTemplate | null> => {
  try {
    const response = await serverGet<ApiResponse<MessageTemplate>>(
      `/api/communications/templates/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATIC,
          tags: [`message-template-${id}`, COMMUNICATIONS_CACHE_TAGS.TEMPLATES] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get message template:', error);
    return null;
  }
});

/**
 * Get all message templates with caching
 */
export const getMessageTemplates = cache(async (category?: string): Promise<MessageTemplate[]> => {
  try {
    const params = category ? { category } : undefined;
    const response = await serverGet<ApiResponse<MessageTemplate[]>>(
      `/api/communications/templates`,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATIC,
          tags: [COMMUNICATIONS_CACHE_TAGS.TEMPLATES, 'message-template-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get message templates:', error);
    return [];
  }
});

/**
 * Get communication analytics with caching
 */
export const getCommunicationAnalytics = cache(async (filters?: Record<string, unknown>): Promise<CommunicationAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<CommunicationAnalytics>>(
      `/api/communications/analytics`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATS,
          tags: ['communication-analytics', 'communication-stats'] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get communication analytics:', error);
    return null;
  }
});

// ==========================================
// MESSAGE OPERATIONS
// ==========================================

/**
 * Create a new message
 * Includes audit logging and cache invalidation
 */
export async function createMessageAction(data: CreateMessageData): Promise<ActionResult<Message>> {
  try {
    // Validate required fields
    if (!data.subject || !data.content || !data.type || !data.recipientIds?.length) {
      return {
        success: false,
        error: 'Missing required fields: subject, content, type, recipientIds'
      };
    }

    const response = await serverPost<ApiResponse<Message>>(
      `/api/communications/messages`,
      data,
      {
        cache: 'no-store',
        next: { tags: [COMMUNICATIONS_CACHE_TAGS.MESSAGES] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create message');
    }

    // AUDIT LOG - Message creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Message',
      resourceId: response.data.id,
      details: `Created ${data.type} message: ${data.subject} to ${data.recipientIds.length} recipients`,
      success: true
    });

    // Cache invalidation
    revalidateTag(COMMUNICATIONS_CACHE_TAGS.MESSAGES, 'default');
    revalidateTag(COMMUNICATIONS_CACHE_TAGS.THREADS, 'default');
    revalidateTag('message-list', 'default');
    revalidateTag('thread-list', 'default');
    revalidatePath('/communications', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Message created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create message';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Message',
      details: `Failed to create message: ${errorMessage}`,
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
 * Update message
 * Includes audit logging and cache invalidation
 */
export async function updateMessageAction(
  messageId: string,
  data: UpdateMessageData
): Promise<ActionResult<Message>> {
  try {
    if (!messageId) {
      return {
        success: false,
        error: 'Message ID is required'
      };
    }

    const response = await serverPut<ApiResponse<Message>>(
      `/api/communications/messages/${messageId}`,
      data,
      {
        cache: 'no-store',
        next: { tags: [COMMUNICATIONS_CACHE_TAGS.MESSAGES, `message-${messageId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update message');
    }

    // AUDIT LOG - Message update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Message',
      resourceId: messageId,
      details: 'Updated message information',
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(COMMUNICATIONS_CACHE_TAGS.MESSAGES, 'default');
    revalidateTag(COMMUNICATIONS_CACHE_TAGS.THREADS, 'default');
    revalidateTag(`message-${messageId}`, 'default');
    revalidateTag('message-list', 'default');
    revalidatePath('/communications', 'page');
    revalidatePath(`/communications/messages/${messageId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Message updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update message';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Message',
      resourceId: messageId,
      details: `Failed to update message: ${errorMessage}`,
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
 * Send message immediately
 * Includes audit logging and cache invalidation
 */
export async function sendMessageAction(messageId: string): Promise<ActionResult<Message>> {
  try {
    if (!messageId) {
      return {
        success: false,
        error: 'Message ID is required'
      };
    }

    const response = await serverPost<ApiResponse<Message>>(
      `/api/communications/messages/${messageId}/send`,
      {},
      {
        cache: 'no-store',
        next: { tags: [COMMUNICATIONS_CACHE_TAGS.MESSAGES, `message-${messageId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to send message');
    }

    // AUDIT LOG - Message send
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Message',
      resourceId: messageId,
      details: `Sent message to ${response.data.recipientIds.length} recipients`,
      success: true
    });

    // Cache invalidation
    revalidateTag(COMMUNICATIONS_CACHE_TAGS.MESSAGES, 'default');
    revalidateTag(COMMUNICATIONS_CACHE_TAGS.THREADS, 'default');
    revalidateTag(`message-${messageId}`, 'default');
    revalidateTag('message-list', 'default');
    revalidateTag('communication-stats', 'default');
    revalidatePath('/communications', 'page');
    revalidatePath(`/communications/messages/${messageId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Message sent successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to send message';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Message',
      resourceId: messageId,
      details: `Failed to send message: ${errorMessage}`,
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
// MESSAGE TEMPLATE OPERATIONS
// ==========================================

/**
 * Create message template
 * Includes audit logging and cache invalidation
 */
export async function createMessageTemplateAction(data: CreateMessageTemplateData): Promise<ActionResult<MessageTemplate>> {
  try {
    // Validate required fields
    if (!data.name || !data.subject || !data.content || !data.type || !data.category) {
      return {
        success: false,
        error: 'Missing required fields: name, subject, content, type, category'
      };
    }

    const response = await serverPost<ApiResponse<MessageTemplate>>(
      `/api/communications/templates`,
      data,
      {
        cache: 'no-store',
        next: { tags: [COMMUNICATIONS_CACHE_TAGS.TEMPLATES] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create message template');
    }

    // AUDIT LOG - Template creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'MessageTemplate',
      resourceId: response.data.id,
      details: `Created ${data.type} message template: ${data.name}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(COMMUNICATIONS_CACHE_TAGS.TEMPLATES, 'default');
    revalidateTag('message-template-list', 'default');
    revalidatePath('/communications/templates', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Message template created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create message template';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'MessageTemplate',
      details: `Failed to create message template: ${errorMessage}`,
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
 * Create message from form data
 * Form-friendly wrapper for createMessageAction
 */
export async function createMessageFromForm(formData: FormData): Promise<ActionResult<Message>> {
  const recipientIdsRaw = formData.get('recipientIds') as string;
  const recipientIds = recipientIdsRaw 
    ? recipientIdsRaw.split(',').map(id => id.trim()).filter(Boolean)
    : [];

  const attachmentsRaw = formData.get('attachments') as string;
  const attachments = attachmentsRaw 
    ? attachmentsRaw.split(',').map(id => id.trim()).filter(Boolean)
    : undefined;

  const messageData: CreateMessageData = {
    threadId: formData.get('threadId') as string || undefined,
    subject: formData.get('subject') as string,
    content: formData.get('content') as string,
    type: formData.get('type') as Message['type'],
    priority: (formData.get('priority') as Message['priority']) || 'normal',
    recipientIds,
    templateId: formData.get('templateId') as string || undefined,
    scheduledAt: formData.get('scheduledAt') as string || undefined,
    attachments,
  };

  const result = await createMessageAction(messageData);
  
  if (result.success && result.data) {
    revalidatePath('/communications', 'page');
  }
  
  return result;
}

/**
 * Create message template from form data
 * Form-friendly wrapper for createMessageTemplateAction
 */
export async function createMessageTemplateFromForm(formData: FormData): Promise<ActionResult<MessageTemplate>> {
  const variablesRaw = formData.get('variables') as string;
  const variables = variablesRaw 
    ? variablesRaw.split(',').map(v => v.trim()).filter(Boolean)
    : undefined;

  const templateData: CreateMessageTemplateData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    subject: formData.get('subject') as string,
    content: formData.get('content') as string,
    type: formData.get('type') as Message['type'],
    category: formData.get('category') as MessageTemplate['category'],
    variables,
    isActive: formData.get('isActive') === 'true',
  };

  const result = await createMessageTemplateAction(templateData);
  
  if (result.success && result.data) {
    revalidatePath('/communications/templates', 'page');
  }
  
  return result;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if message exists
 */
export async function messageExists(messageId: string): Promise<boolean> {
  const message = await getMessage(messageId);
  return message !== null;
}

/**
 * Check if message template exists
 */
export async function messageTemplateExists(templateId: string): Promise<boolean> {
  const template = await getMessageTemplate(templateId);
  return template !== null;
}

/**
 * Get message count
 */
export const getMessageCount = cache(async (filters?: MessageFilters): Promise<number> => {
  try {
    const messages = await getMessages(filters);
    return messages.length;
  } catch {
    return 0;
  }
});

/**
 * Get message template count
 */
export const getMessageTemplateCount = cache(async (category?: string): Promise<number> => {
  try {
    const templates = await getMessageTemplates(category);
    return templates.length;
  } catch {
    return 0;
  }
});

/**
 * Get communication overview
 */
export async function getCommunicationOverview(): Promise<{
  totalMessages: number;
  sentMessages: number;
  draftMessages: number;
  failedMessages: number;
  averageResponseTime: number;
}> {
  try {
    const messages = await getMessages();
    const analytics = await getCommunicationAnalytics();
    
    return {
      totalMessages: messages.length,
      sentMessages: messages.filter(m => m.status === 'sent').length,
      draftMessages: messages.filter(m => m.status === 'draft').length,
      failedMessages: messages.filter(m => m.status === 'failed').length,
      averageResponseTime: analytics?.averageResponseTime || 0,
    };
  } catch {
    return {
      totalMessages: 0,
      sentMessages: 0,
      draftMessages: 0,
      failedMessages: 0,
      averageResponseTime: 0,
    };
  }
}

/**
 * Clear communication cache
 */
export async function clearCommunicationCache(resourceType?: string, resourceId?: string): Promise<void> {
  if (resourceType && resourceId) {
    revalidateTag(`${resourceType}-${resourceId}`, 'default');
  }
  
  // Clear all communication caches
  Object.values(COMMUNICATIONS_CACHE_TAGS).forEach(tag => {
    revalidateTag(tag, 'default');
  });

  // Clear list caches
  revalidateTag('message-list', 'default');
  revalidateTag('thread-list', 'default');
  revalidateTag('message-template-list', 'default');
  revalidateTag('communication-stats', 'default');

  // Clear paths
  revalidatePath('/communications', 'page');
  revalidatePath('/communications/messages', 'page');
  revalidatePath('/communications/templates', 'page');
  revalidatePath('/communications/analytics', 'page');
}
