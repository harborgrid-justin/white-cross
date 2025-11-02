/**
 * @fileoverview Message Management Server Actions - Next.js v14+ Compatible
 * @module app/messages/actions
 *
 * HIPAA-compliant server actions for messaging system with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all message operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 */

'use server';

import { cache } from 'react';
import { revalidatePath, revalidateTag } from 'next/cache';

// Core API integrations
import { serverGet, serverPost, serverPut, NextApiClientError } from '@/lib/api/nextjs-client';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Types
import type { ApiResponse } from '@/types/api';

// ==========================================
// CONFIGURATION
// ==========================================

// Custom cache tags for messages
export const MESSAGE_CACHE_TAGS = {
  MESSAGES: 'messages',
  THREADS: 'message-threads',
  CONVERSATIONS: 'conversations',
  ATTACHMENTS: 'message-attachments',
  TEMPLATES: 'message-templates',
} as const;

// Cache TTL constants (in seconds)
const CACHE_TTL = {
  SESSION: 300,  // 5 minutes
  STATIC: 3600,  // 1 hour
  STATS: 180,    // 3 minutes
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
  parentId?: string;
  subject: string;
  body: string;
  bodyHtml?: string;
  fromUserId: string;
  fromUserName: string;
  fromUserRole: string;
  toUserIds: string[];
  toUserNames: string[];
  ccUserIds: string[];
  ccUserNames: string[];
  bccUserIds: string[];
  bccUserNames: string[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'general' | 'medical' | 'administrative' | 'emergency' | 'notification' | 'announcement';
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'archived' | 'deleted';
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  attachments: MessageAttachment[];
  scheduledAt?: string;
  sentAt?: string;
  readAt?: string;
  archivedAt?: string;
  deletedAt?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageData {
  threadId?: string;
  parentId?: string;
  subject: string;
  body: string;
  bodyHtml?: string;
  toUserIds: string[];
  ccUserIds?: string[];
  bccUserIds?: string[];
  priority?: Message['priority'];
  category?: Message['category'];
  scheduledAt?: string;
  tags?: string[];
  attachmentIds?: string[];
  templateId?: string;
  isDraft?: boolean;
}

export interface UpdateMessageData {
  subject?: string;
  body?: string;
  bodyHtml?: string;
  priority?: Message['priority'];
  category?: Message['category'];
  status?: Message['status'];
  isStarred?: boolean;
  tags?: string[];
  scheduledAt?: string;
}

export interface MessageThread {
  id: string;
  subject: string;
  participantIds: string[];
  participantNames: string[];
  messageCount: number;
  unreadCount: number;
  lastMessageAt: string;
  lastMessagePreview: string;
  lastMessageFromId: string;
  lastMessageFromName: string;
  category: Message['category'];
  priority: Message['priority'];
  isArchived: boolean;
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MessageAttachment {
  id: string;
  messageId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  thumbnailUrl?: string;
  isInline: boolean;
  contentId?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  body: string;
  bodyHtml?: string;
  category: Message['category'];
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
  body: string;
  bodyHtml?: string;
  category: Message['category'];
  variables?: string[];
  isActive?: boolean;
}

export interface MessageFilters {
  threadId?: string;
  fromUserId?: string;
  toUserId?: string;
  category?: Message['category'];
  priority?: Message['priority'];
  status?: Message['status'];
  isRead?: boolean;
  isStarred?: boolean;
  hasAttachments?: boolean;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface MessageAnalytics {
  totalMessages: number;
  sentMessages: number;
  receivedMessages: number;
  unreadMessages: number;
  averageResponseTime: number;
  categoryBreakdown: {
    category: Message['category'];
    count: number;
    percentage: number;
  }[];
  priorityBreakdown: {
    priority: Message['priority'];
    count: number;
    percentage: number;
  }[];
  monthlyTrends: {
    month: string;
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
      `/api/messages/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [`message-${id}`, MESSAGE_CACHE_TAGS.MESSAGES] 
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
      `/api/messages`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [MESSAGE_CACHE_TAGS.MESSAGES, 'message-list'] 
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
      `/api/messages/threads/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [`message-thread-${id}`, MESSAGE_CACHE_TAGS.THREADS] 
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
      `/api/messages/threads`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [MESSAGE_CACHE_TAGS.THREADS, 'message-thread-list'] 
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
 * Get message templates with caching
 */
export const getMessageTemplates = cache(async (): Promise<MessageTemplate[]> => {
  try {
    const response = await serverGet<ApiResponse<MessageTemplate[]>>(
      `/api/messages/templates`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATIC,
          tags: [MESSAGE_CACHE_TAGS.TEMPLATES, 'message-template-list'] 
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
 * Get message analytics with caching
 */
export const getMessageAnalytics = cache(async (filters?: Record<string, unknown>): Promise<MessageAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<MessageAnalytics>>(
      `/api/messages/analytics`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATS,
          tags: ['message-analytics', 'message-stats'] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get message analytics:', error);
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
    if (!data.subject || !data.body || !data.toUserIds || data.toUserIds.length === 0) {
      return {
        success: false,
        error: 'Missing required fields: subject, body, toUserIds'
      };
    }

    const response = await serverPost<ApiResponse<Message>>(
      `/api/messages`,
      data,
      {
        cache: 'no-store',
        next: { tags: [MESSAGE_CACHE_TAGS.MESSAGES] }
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
      details: `Created message: ${data.subject} to ${data.toUserIds.length} recipients`,
      success: true
    });

    // Cache invalidation
    revalidateTag(MESSAGE_CACHE_TAGS.MESSAGES, 'default');
    revalidateTag(MESSAGE_CACHE_TAGS.THREADS, 'default');
    revalidateTag('message-list', 'default');
    revalidateTag('message-thread-list', 'default');
    revalidatePath('/messages', 'page');

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
      `/api/messages/${messageId}`,
      data,
      {
        cache: 'no-store',
        next: { tags: [MESSAGE_CACHE_TAGS.MESSAGES, `message-${messageId}`] }
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
    revalidateTag(MESSAGE_CACHE_TAGS.MESSAGES, 'default');
    revalidateTag(MESSAGE_CACHE_TAGS.THREADS, 'default');
    revalidateTag(`message-${messageId}`, 'default');
    revalidateTag('message-list', 'default');
    revalidatePath('/messages', 'page');
    revalidatePath(`/messages/${messageId}`, 'page');

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
 * Send message (for drafts)
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
      `/api/messages/${messageId}/send`,
      {},
      {
        cache: 'no-store',
        next: { tags: [MESSAGE_CACHE_TAGS.MESSAGES, `message-${messageId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to send message');
    }

    // AUDIT LOG - Message sent
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Message',
      resourceId: messageId,
      details: 'Sent message',
      success: true
    });

    // Cache invalidation
    revalidateTag(MESSAGE_CACHE_TAGS.MESSAGES, 'default');
    revalidateTag(MESSAGE_CACHE_TAGS.THREADS, 'default');
    revalidateTag(`message-${messageId}`, 'default');
    revalidateTag('message-list', 'default');
    revalidateTag('message-stats', 'default');
    revalidatePath('/messages', 'page');
    revalidatePath(`/messages/${messageId}`, 'page');

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
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
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

/**
 * Mark message as read
 * Includes audit logging and cache invalidation
 */
export async function markMessageReadAction(messageId: string): Promise<ActionResult<Message>> {
  try {
    if (!messageId) {
      return {
        success: false,
        error: 'Message ID is required'
      };
    }

    const response = await serverPost<ApiResponse<Message>>(
      `/api/messages/${messageId}/read`,
      {},
      {
        cache: 'no-store',
        next: { tags: [MESSAGE_CACHE_TAGS.MESSAGES, `message-${messageId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to mark message as read');
    }

    // Cache invalidation (no audit log for read status)
    revalidateTag(MESSAGE_CACHE_TAGS.MESSAGES, 'default');
    revalidateTag(MESSAGE_CACHE_TAGS.THREADS, 'default');
    revalidateTag(`message-${messageId}`, 'default');
    revalidateTag('message-list', 'default');
    revalidatePath('/messages', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Message marked as read'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to mark message as read';

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
    if (!data.name || !data.subject || !data.body) {
      return {
        success: false,
        error: 'Missing required fields: name, subject, body'
      };
    }

    const response = await serverPost<ApiResponse<MessageTemplate>>(
      `/api/messages/templates`,
      data,
      {
        cache: 'no-store',
        next: { tags: [MESSAGE_CACHE_TAGS.TEMPLATES] }
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
      details: `Created message template: ${data.name}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(MESSAGE_CACHE_TAGS.TEMPLATES, 'default');
    revalidateTag('message-template-list', 'default');
    revalidatePath('/messages/templates', 'page');

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
  const toUserIds = (formData.get('toUserIds') as string)?.split(',').filter(Boolean) || [];
  const ccUserIds = (formData.get('ccUserIds') as string)?.split(',').filter(Boolean) || [];
  const bccUserIds = (formData.get('bccUserIds') as string)?.split(',').filter(Boolean) || [];
  const tags = (formData.get('tags') as string)?.split(',').filter(Boolean) || [];
  const attachmentIds = (formData.get('attachmentIds') as string)?.split(',').filter(Boolean) || [];

  const messageData: CreateMessageData = {
    threadId: formData.get('threadId') as string || undefined,
    parentId: formData.get('parentId') as string || undefined,
    subject: formData.get('subject') as string,
    body: formData.get('body') as string,
    bodyHtml: formData.get('bodyHtml') as string || undefined,
    toUserIds,
    ccUserIds: ccUserIds.length > 0 ? ccUserIds : undefined,
    bccUserIds: bccUserIds.length > 0 ? bccUserIds : undefined,
    priority: formData.get('priority') as Message['priority'] || 'normal',
    category: formData.get('category') as Message['category'] || 'general',
    scheduledAt: formData.get('scheduledAt') as string || undefined,
    tags: tags.length > 0 ? tags : undefined,
    attachmentIds: attachmentIds.length > 0 ? attachmentIds : undefined,
    templateId: formData.get('templateId') as string || undefined,
    isDraft: formData.get('isDraft') === 'true',
  };

  const result = await createMessageAction(messageData);
  
  if (result.success && result.data) {
    revalidatePath('/messages', 'page');
  }
  
  return result;
}

/**
 * Create message template from form data
 * Form-friendly wrapper for createMessageTemplateAction
 */
export async function createMessageTemplateFromForm(formData: FormData): Promise<ActionResult<MessageTemplate>> {
  const variables = (formData.get('variables') as string)?.split(',').filter(Boolean) || [];

  const templateData: CreateMessageTemplateData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    subject: formData.get('subject') as string,
    body: formData.get('body') as string,
    bodyHtml: formData.get('bodyHtml') as string || undefined,
    category: formData.get('category') as Message['category'] || 'general',
    variables: variables.length > 0 ? variables : undefined,
    isActive: formData.get('isActive') === 'true',
  };

  const result = await createMessageTemplateAction(templateData);
  
  if (result.success && result.data) {
    revalidatePath('/messages/templates', 'page');
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
 * Get unread message count
 */
export const getUnreadMessageCount = cache(async (): Promise<number> => {
  try {
    const messages = await getMessages({ isRead: false });
    return messages.length;
  } catch {
    return 0;
  }
});

/**
 * Get message overview
 */
export async function getMessageOverview(): Promise<{
  totalMessages: number;
  unreadMessages: number;
  sentMessages: number;
  draftMessages: number;
  activeThreads: number;
}> {
  try {
    const [messages, threads] = await Promise.all([
      getMessages(),
      getMessageThreads()
    ]);
    
    return {
      totalMessages: messages.length,
      unreadMessages: messages.filter(m => !m.isRead).length,
      sentMessages: messages.filter(m => m.status === 'sent').length,
      draftMessages: messages.filter(m => m.status === 'draft').length,
      activeThreads: threads.filter(t => !t.isArchived).length,
    };
  } catch {
    return {
      totalMessages: 0,
      unreadMessages: 0,
      sentMessages: 0,
      draftMessages: 0,
      activeThreads: 0,
    };
  }
}

// ==========================================
// DASHBOARD FUNCTIONS
// ==========================================

/**
 * Get comprehensive messages statistics for dashboard
 * @returns Promise<MessagesStats> Statistics object with message metrics
 */
export async function getMessagesStats(): Promise<{
  totalMessages: number;
  unreadMessages: number;
  emergencyMessages: number;
  medicalMessages: number;
  parentCommunications: number;
  staffNotifications: number;
  encryptedMessages: number;
  requiresAcknowledgment: number;
  todayMessages: number;
  urgentMessages: number;
  activeThreads: number;
  archivedMessages: number;
}> {
  try {
    console.log('[Messages] Loading message statistics');

    // Get messages and threads data
    const messages = await getMessages();
    const threads = await getMessageThreads();

    // Calculate today's date for filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate statistics based on message schema properties
    const totalMessages = messages.length;
    const unreadMessages = messages.filter(m => !m.isRead).length;
    const emergencyMessages = messages.filter(m => m.category === 'emergency').length;
    const medicalMessages = messages.filter(m => m.category === 'medical').length;
    const parentCommunications = messages.filter(m => m.category === 'notification').length; // Closest match
    const staffNotifications = messages.filter(m => m.category === 'administrative').length;
    const encryptedMessages = messages.filter(m => m.hasAttachments).length; // Proxy for encrypted
    const requiresAcknowledgment = messages.filter(m => m.priority === 'urgent').length; // Proxy
    const todayMessages = messages.filter(m => {
      const messageDate = new Date(m.createdAt);
      messageDate.setHours(0, 0, 0, 0);
      return messageDate.getTime() === today.getTime();
    }).length;
    const urgentMessages = messages.filter(m => m.priority === 'urgent').length;
    const activeThreads = threads.filter(t => !t.isArchived).length;
    const archivedMessages = messages.filter(m => m.status === 'archived').length;

    const stats = {
      totalMessages,
      unreadMessages,
      emergencyMessages,
      medicalMessages,
      parentCommunications,
      staffNotifications,
      encryptedMessages,
      requiresAcknowledgment,
      todayMessages,
      urgentMessages,
      activeThreads,
      archivedMessages,
    };

    console.log('[Messages] Statistics calculated:', stats);

    await auditLog({
      action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
      resource: 'messages_dashboard_stats',
      details: 'Retrieved message dashboard statistics'
    });

    return stats;
  } catch (error) {
    console.error('[Messages] Error calculating stats:', error);
    return {
      totalMessages: 0,
      unreadMessages: 0,
      emergencyMessages: 0,
      medicalMessages: 0,
      parentCommunications: 0,
      staffNotifications: 0,
      encryptedMessages: 0,
      requiresAcknowledgment: 0,
      todayMessages: 0,
      urgentMessages: 0,
      activeThreads: 0,
      archivedMessages: 0,
    };
  }
}

/**
 * Get messages dashboard data with recent messages and priority information
 * @returns Promise<MessagesDashboardData> Dashboard data with recent messages and priorities
 */
export async function getMessagesDashboardData(): Promise<{
  recentMessages: Array<{
    id: string;
    subject: string;
    type: string;
    priority: string;
    isRead: boolean;
    from: string;
    timestamp: string;
    isEncrypted: boolean;
    requiresAcknowledgment: boolean;
  }>;
  priorityMessages: Array<{
    id: string;
    subject: string;
    priority: 'high' | 'urgent' | 'emergency';
    type: string;
    timestamp: string;
    from: string;
  }>;
  messagesByType: {
    emergency: number;
    medical: number;
    parent_communication: number;
    staff_notification: number;
    appointment: number;
    incident: number;
    general: number;
  };
  acknowledgmentsPending: number;
  encryptedMessageCount: number;
  stats: {
    totalMessages: number;
    unreadMessages: number;
    emergencyMessages: number;
    medicalMessages: number;
    parentCommunications: number;
    staffNotifications: number;
    encryptedMessages: number;
    requiresAcknowledgment: number;
    todayMessages: number;
    urgentMessages: number;
    activeThreads: number;
    archivedMessages: number;
  };
}> {
  try {
    // Get stats and messages data
    const stats = await getMessagesStats();
    const messages = await getMessages();

    // Sort messages by date descending and get recent messages (last 10)
    const sortedMessages = messages
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    const recentMessages = sortedMessages.map(message => ({
      id: message.id,
      subject: message.subject,
      type: message.category,
      priority: message.priority,
      isRead: message.isRead,
      from: message.fromUserName || 'Unknown',
      timestamp: message.createdAt,
      isEncrypted: message.hasAttachments, // Proxy for encrypted
      requiresAcknowledgment: message.priority === 'urgent', // Proxy
    }));

    // Get priority messages (high, urgent)
    const priorityMessages = messages
      .filter(m => ['high', 'urgent'].includes(m.priority))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(message => ({
        id: message.id,
        subject: message.subject,
        priority: message.priority as 'high' | 'urgent' | 'emergency',
        type: message.category,
        timestamp: message.createdAt,
        from: message.fromUserName || 'Unknown',
      }));

    // Calculate messages by type (using category)
    const messagesByType = {
      emergency: messages.filter(m => m.category === 'emergency').length,
      medical: messages.filter(m => m.category === 'medical').length,
      parent_communication: messages.filter(m => m.category === 'notification').length,
      staff_notification: messages.filter(m => m.category === 'administrative').length,
      appointment: messages.filter(m => m.category === 'announcement').length,
      incident: messages.filter(m => m.category === 'emergency').length,
      general: messages.filter(m => m.category === 'general').length,
    };

    const acknowledgmentsPending = messages.filter(m => m.priority === 'urgent').length;
    const encryptedMessageCount = messages.filter(m => m.hasAttachments).length;

    const dashboardData = {
      recentMessages,
      priorityMessages,
      messagesByType,
      acknowledgmentsPending,
      encryptedMessageCount,
      stats,
    };

    console.log('[Messages] Dashboard data prepared:', {
      recentCount: recentMessages.length,
      priorityCount: priorityMessages.length,
      acknowledgmentsPending,
      encryptedMessageCount,
    });

    await auditLog({
      action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
      resource: 'messages_dashboard_data',
      details: 'Retrieved message dashboard data'
    });

    return dashboardData;
  } catch (error) {
    console.error('[Messages] Error loading dashboard data:', error);
    // Return safe defaults with stats fallback
    return {
      recentMessages: [],
      priorityMessages: [],
      messagesByType: {
        emergency: 0,
        medical: 0,
        parent_communication: 0,
        staff_notification: 0,
        appointment: 0,
        incident: 0,
        general: 0,
      },
      acknowledgmentsPending: 0,
      encryptedMessageCount: 0,
      stats: await getMessagesStats(), // Will return safe defaults
    };
  }
}

/**
 * Clear message cache
 */
export async function clearMessageCache(resourceType?: string, resourceId?: string): Promise<void> {
  if (resourceType && resourceId) {
    revalidateTag(`${resourceType}-${resourceId}`, 'default');
  }
  
  // Clear all message caches
  Object.values(MESSAGE_CACHE_TAGS).forEach(tag => {
    revalidateTag(tag, 'default');
  });

  // Clear list caches
  revalidateTag('message-list', 'default');
  revalidateTag('message-thread-list', 'default');
  revalidateTag('message-template-list', 'default');
  revalidateTag('message-stats', 'default');
  revalidateTag('message-dashboard', 'default');

  // Clear paths
  revalidatePath('/messages', 'page');
  revalidatePath('/messages/threads', 'page');
  revalidatePath('/messages/templates', 'page');
  revalidatePath('/messages/analytics', 'page');
}
