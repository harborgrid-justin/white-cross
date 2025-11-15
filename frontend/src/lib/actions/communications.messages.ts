/**
 * @fileoverview Communications Messages - Next.js v14+ Compatible
 *
 * Message-related server actions for communications module.
 */

'use server';

import { serverGet, serverPost, serverPut, serverDelete, nextFetch } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import type { ActionResult } from './communications.types';
import {
  CreateMessageSchema,
  UpdateMessageSchema,
  MessageFilterSchema,
  MarkAsReadSchema,
  ArchiveMessageSchema,
  DeleteMessageSchema,
  type Message,
  type MessageThread,
  type CreateMessageInput,
  type UpdateMessageInput,
  type MessageFilter
} from '@/lib/validations/message.schemas';

// ============================================================================
// MESSAGE ACTIONS
// ============================================================================

export async function getMessages(
  filter?: MessageFilter
): Promise<ActionResult<{ messages: Message[]; total: number }>> {
  try {
    const validatedFilter = filter ? MessageFilterSchema.parse(filter) : {};

    const response = await serverGet<{ messages: Message[]; total: number }>(
      API_ENDPOINTS.MESSAGES.BASE,
      validatedFilter as Record<string, string | number | boolean>
    );

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Error fetching messages:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch messages'
    };
  }
}

/**
 * Get message by ID
 */
export async function getMessageById(
  messageId: string
): Promise<ActionResult<Message>> {
  try {
    const response = await serverGet<Message>(
      API_ENDPOINTS.MESSAGES.BY_ID(messageId)
    );

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Error fetching message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch message'
    };
  }
}

/**
 * Get message threads
 */
export async function getMessageThreads(
  filter?: MessageFilter
): Promise<ActionResult<{ threads: MessageThread[]; total: number }>> {
  try {
    const validatedFilter = filter ? MessageFilterSchema.parse(filter) : {};

    const response = await serverGet<{ threads: MessageThread[]; total: number }>(
      API_ENDPOINTS.MESSAGES.BASE + '/threads',
      validatedFilter as Record<string, string | number | boolean>
    );

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Error fetching threads:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch threads'
    };
  }
}

/**
 * Create new message
 */
export async function createMessage(
  data: CreateMessageInput
): Promise<ActionResult<Message>> {
  try {
    const validatedData = CreateMessageSchema.parse(data);

    const response = await serverPost<Message>(
      API_ENDPOINTS.MESSAGES.BASE,
      validatedData
    );

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Error creating message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create message'
    };
  }
}

/**
 * Update message (draft only)
 */
export async function updateMessage(
  data: UpdateMessageInput
): Promise<ActionResult<Message>> {
  try {
    const validatedData = UpdateMessageSchema.parse(data);

    const response = await serverPut<Message>(
      API_ENDPOINTS.MESSAGES.BY_ID(validatedData.id),
      validatedData
    );

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Error updating message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update message'
    };
  }
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(
  messageId: string,
  threadId?: string
): Promise<ActionResult<void>> {
  try {
    const validatedData = MarkAsReadSchema.parse({ messageId, threadId });

    await serverPost(
      API_ENDPOINTS.MESSAGES.BY_ID(messageId) + '/read',
      validatedData
    );

    return { success: true };
  } catch (error) {
    console.error('Error marking message as read:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark message as read'
    };
  }
}

/**
 * Archive messages
 */
export async function archiveMessages(
  messageIds: string[]
): Promise<ActionResult<void>> {
  try {
    const validatedData = ArchiveMessageSchema.parse({ messageIds });

    await serverPost(
      API_ENDPOINTS.MESSAGES.BASE + '/archive',
      validatedData
    );

    return { success: true };
  } catch (error) {
    console.error('Error archiving messages:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to archive messages'
    };
  }
}

/**
 * Delete messages
 */
export async function deleteMessages(
  messageIds: string[],
  permanent = false
): Promise<ActionResult<void>> {
  try {
    const validatedData = DeleteMessageSchema.parse({ messageIds, permanent });

    await serverDelete(
      API_ENDPOINTS.MESSAGES.BASE,
      validatedData
    );

    return { success: true };
  } catch (error) {
    console.error('Error deleting messages:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete messages'
    };
  }
}

/**
 * Upload file attachment
 */
export async function uploadAttachment(
  file: File,
  messageId?: string
): Promise<ActionResult<{ id: string; fileName: string; fileUrl: string }>> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (messageId) {
      formData.append('messageId', messageId);
    }

    const response = await nextFetch<{ id: string; fileName: string; fileUrl: string }>(
      API_ENDPOINTS.MESSAGES.BASE + '/attachments',
      {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type - let browser set it for multipart/form-data
        },
        cache: 'no-store'
      }
    );

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file'
    };
  }
}