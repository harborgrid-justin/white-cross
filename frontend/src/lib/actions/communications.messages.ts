/**
 * @fileoverview Communications Messages - Next.js v14+ Compatible
 *
 * Message-related server actions for communications module.
 */

'use server';

import { fetchApi } from './communications.utils';
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

    const response = await fetchApi<{ messages: Message[]; total: number }>(
      '/communications/messages',
      {
        method: 'GET',
        params: validatedFilter
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to fetch messages'
      };
    }

    return {
      success: true,
      data: response.data
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
    const response = await fetchApi<Message>(
      `/communications/messages/${messageId}`,
      { method: 'GET' }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to fetch message'
      };
    }

    return {
      success: true,
      data: response.data
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

    const response = await fetchApi<{ threads: MessageThread[]; total: number }>(
      '/communications/messages/threads',
      {
        method: 'GET',
        params: validatedFilter
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to fetch threads'
      };
    }

    return {
      success: true,
      data: response.data
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

    const response = await fetchApi<Message>(
      '/communications/messages',
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create message'
      };
    }

    return {
      success: true,
      data: response.data
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

    const response = await fetchApi<Message>(
      `/communications/messages/${validatedData.id}`,
      {
        method: 'PUT',
        body: validatedData
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to update message'
      };
    }

    return {
      success: true,
      data: response.data
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

    const response = await fetchApi(
      `/communications/messages/${messageId}/read`,
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to mark message as read'
      };
    }

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

    const response = await fetchApi(
      '/communications/messages/archive',
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to archive messages'
      };
    }

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

    const response = await fetchApi(
      '/communications/messages',
      {
        method: 'DELETE',
        body: validatedData
      }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to delete messages'
      };
    }

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

    const response = await fetchApi<{ id: string; fileName: string; fileUrl: string }>(
      '/communications/messages/attachments',
      {
        method: 'POST',
        body: formData,
        headers: {
          // Let browser set Content-Type for multipart/form-data
        }
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to upload file'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload file'
    };
  }
}