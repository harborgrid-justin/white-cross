/**
 * @fileoverview Message Send and CRUD Operations
 * @module lib/actions/messages.send
 *
 * Server actions for creating, updating, and sending messages.
 * Includes HIPAA audit logging and cache invalidation.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { serverPost, serverPut, NextApiClientError } from '@/lib/api/nextjs-client';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import type {
  ActionResult,
  Message,
  CreateMessageData,
  UpdateMessageData,
} from './messages.types';

// Import constants
import { MESSAGE_CACHE_TAGS as CACHE_TAGS } from './messages.types';

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

    const response = await serverPost<{ success: boolean; data: Message; message?: string }>(
      `/api/messages`,
      data,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.MESSAGES] }
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
    revalidateTag(CACHE_TAGS.MESSAGES, 'default');
    revalidateTag(CACHE_TAGS.THREADS, 'default');
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

    const response = await serverPut<{ success: boolean; data: Message; message?: string }>(
      `/api/messages/${messageId}`,
      data,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.MESSAGES, `message-${messageId}`] }
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
    revalidateTag(CACHE_TAGS.MESSAGES, 'default');
    revalidateTag(CACHE_TAGS.THREADS, 'default');
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

    const response = await serverPost<{ success: boolean; data: Message; message?: string }>(
      `/api/messages/${messageId}/send`,
      {},
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.MESSAGES, `message-${messageId}`] }
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
    revalidateTag(CACHE_TAGS.MESSAGES, 'default');
    revalidateTag(CACHE_TAGS.THREADS, 'default');
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

    const response = await serverPost<{ success: boolean; data: Message; message?: string }>(
      `/api/messages/${messageId}/read`,
      {},
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.MESSAGES, `message-${messageId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to mark message as read');
    }

    // Cache invalidation (no audit log for read status)
    revalidateTag(CACHE_TAGS.MESSAGES, 'default');
    revalidateTag(CACHE_TAGS.THREADS, 'default');
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
