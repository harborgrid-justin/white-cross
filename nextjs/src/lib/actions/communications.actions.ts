/**
 * Communications Server Actions
 *
 * Server actions for messages, broadcasts, notifications, and templates
 */

'use server';

import { z } from 'zod';
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
import { ActionResponse } from '@/types/actions';
import { fetchApi } from '@/lib/api/client';

// ============================================================================
// MESSAGE ACTIONS
// ============================================================================

/**
 * Get messages with filtering and pagination
 */
export async function getMessages(
  filter?: MessageFilter
): Promise<ActionResponse<{ messages: Message[]; total: number }>> {
  try {
    const validatedFilter = filter ? MessageFilterSchema.parse(filter) : {};

    const response = await fetchApi<{ messages: Message[]; total: number }>(
      '/api/v1/communications/messages',
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
): Promise<ActionResponse<Message>> {
  try {
    const response = await fetchApi<Message>(
      `/api/v1/communications/messages/${messageId}`,
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
): Promise<ActionResponse<{ threads: MessageThread[]; total: number }>> {
  try {
    const validatedFilter = filter ? MessageFilterSchema.parse(filter) : {};

    const response = await fetchApi<{ threads: MessageThread[]; total: number }>(
      '/api/v1/communications/messages/threads',
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
): Promise<ActionResponse<Message>> {
  try {
    const validatedData = CreateMessageSchema.parse(data);

    const response = await fetchApi<Message>(
      '/api/v1/communications/messages',
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
): Promise<ActionResponse<Message>> {
  try {
    const validatedData = UpdateMessageSchema.parse(data);

    const response = await fetchApi<Message>(
      `/api/v1/communications/messages/${validatedData.id}`,
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
): Promise<ActionResponse<void>> {
  try {
    const validatedData = MarkAsReadSchema.parse({ messageId, threadId });

    const response = await fetchApi(
      `/api/v1/communications/messages/${messageId}/read`,
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
): Promise<ActionResponse<void>> {
  try {
    const validatedData = ArchiveMessageSchema.parse({ messageIds });

    const response = await fetchApi(
      '/api/v1/communications/messages/archive',
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
): Promise<ActionResponse<void>> {
  try {
    const validatedData = DeleteMessageSchema.parse({ messageIds, permanent });

    const response = await fetchApi(
      '/api/v1/communications/messages',
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
): Promise<ActionResponse<{ id: string; fileName: string; fileUrl: string }>> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (messageId) {
      formData.append('messageId', messageId);
    }

    const response = await fetchApi<{ id: string; fileName: string; fileUrl: string }>(
      '/api/v1/communications/messages/attachments',
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

// ============================================================================
// BROADCAST ACTIONS
// ============================================================================

/**
 * Get broadcasts with filtering
 */
export async function getBroadcasts(
  filter?: BroadcastFilter
): Promise<ActionResponse<{ broadcasts: Broadcast[]; total: number }>> {
  try {
    const validatedFilter = filter ? BroadcastFilterSchema.parse(filter) : {};

    const response = await fetchApi<{ broadcasts: Broadcast[]; total: number }>(
      '/api/v1/communications/broadcasts',
      {
        method: 'GET',
        params: validatedFilter
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to fetch broadcasts'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching broadcasts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch broadcasts'
    };
  }
}

/**
 * Get broadcast by ID
 */
export async function getBroadcastById(
  broadcastId: string
): Promise<ActionResponse<Broadcast>> {
  try {
    const response = await fetchApi<Broadcast>(
      `/api/v1/communications/broadcasts/${broadcastId}`,
      { method: 'GET' }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to fetch broadcast'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching broadcast:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch broadcast'
    };
  }
}

/**
 * Create broadcast
 */
export async function createBroadcast(
  data: CreateBroadcastInput
): Promise<ActionResponse<Broadcast>> {
  try {
    const validatedData = CreateBroadcastSchema.parse(data);

    const response = await fetchApi<Broadcast>(
      '/api/v1/communications/broadcasts',
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create broadcast'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error creating broadcast:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create broadcast'
    };
  }
}

/**
 * Update broadcast (draft only)
 */
export async function updateBroadcast(
  data: UpdateBroadcastInput
): Promise<ActionResponse<Broadcast>> {
  try {
    const validatedData = UpdateBroadcastSchema.parse(data);

    const response = await fetchApi<Broadcast>(
      `/api/v1/communications/broadcasts/${validatedData.id}`,
      {
        method: 'PUT',
        body: validatedData
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to update broadcast'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating broadcast:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update broadcast'
    };
  }
}

/**
 * Cancel broadcast
 */
export async function cancelBroadcast(
  broadcastId: string,
  reason?: string
): Promise<ActionResponse<void>> {
  try {
    const validatedData = CancelBroadcastSchema.parse({ id: broadcastId, reason });

    const response = await fetchApi(
      `/api/v1/communications/broadcasts/${broadcastId}/cancel`,
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to cancel broadcast'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error cancelling broadcast:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel broadcast'
    };
  }
}

/**
 * Acknowledge broadcast
 */
export async function acknowledgeBroadcast(
  broadcastId: string
): Promise<ActionResponse<void>> {
  try {
    const validatedData = AcknowledgeBroadcastSchema.parse({ broadcastId });

    const response = await fetchApi(
      `/api/v1/communications/broadcasts/${broadcastId}/acknowledge`,
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to acknowledge broadcast'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error acknowledging broadcast:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to acknowledge broadcast'
    };
  }
}

// ============================================================================
// NOTIFICATION ACTIONS
// ============================================================================

/**
 * Get notifications with filtering
 */
export async function getNotifications(
  filter?: NotificationFilter
): Promise<ActionResponse<{ notifications: Notification[]; total: number }>> {
  try {
    const validatedFilter = filter ? NotificationFilterSchema.parse(filter) : {};

    const response = await fetchApi<{ notifications: Notification[]; total: number }>(
      '/api/v1/communications/notifications',
      {
        method: 'GET',
        params: validatedFilter
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to fetch notifications'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch notifications'
    };
  }
}

/**
 * Get notification count
 */
export async function getNotificationCount(): Promise<ActionResponse<NotificationCount>> {
  try {
    const response = await fetchApi<NotificationCount>(
      '/api/v1/communications/notifications/count',
      { method: 'GET' }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to fetch notification count'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching notification count:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch notification count'
    };
  }
}

/**
 * Mark notifications as read
 */
export async function markNotificationsAsRead(
  notificationIds: string[]
): Promise<ActionResponse<void>> {
  try {
    const validatedData = MarkNotificationAsReadSchema.parse({ notificationIds });

    const response = await fetchApi(
      '/api/v1/communications/notifications/read',
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to mark notifications as read'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark notifications as read'
    };
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<ActionResponse<void>> {
  try {
    const response = await fetchApi(
      '/api/v1/communications/notifications/read-all',
      { method: 'POST' }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to mark all notifications as read'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark all notifications as read'
    };
  }
}

/**
 * Archive notifications
 */
export async function archiveNotifications(
  notificationIds: string[]
): Promise<ActionResponse<void>> {
  try {
    const validatedData = ArchiveNotificationSchema.parse({ notificationIds });

    const response = await fetchApi(
      '/api/v1/communications/notifications/archive',
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to archive notifications'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error archiving notifications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to archive notifications'
    };
  }
}

/**
 * Delete notifications
 */
export async function deleteNotifications(
  notificationIds: string[]
): Promise<ActionResponse<void>> {
  try {
    const validatedData = DeleteNotificationSchema.parse({ notificationIds });

    const response = await fetchApi(
      '/api/v1/communications/notifications',
      {
        method: 'DELETE',
        body: validatedData
      }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to delete notifications'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting notifications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete notifications'
    };
  }
}

/**
 * Get notification preferences
 */
export async function getNotificationPreferences(): Promise<ActionResponse<NotificationPreferences>> {
  try {
    const response = await fetchApi<NotificationPreferences>(
      '/api/v1/communications/notifications/preferences',
      { method: 'GET' }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to fetch notification preferences'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch notification preferences'
    };
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  preferences: Partial<NotificationPreferences>
): Promise<ActionResponse<NotificationPreferences>> {
  try {
    const response = await fetchApi<NotificationPreferences>(
      '/api/v1/communications/notifications/preferences',
      {
        method: 'PUT',
        body: preferences
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to update notification preferences'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update notification preferences'
    };
  }
}

// ============================================================================
// TEMPLATE ACTIONS
// ============================================================================

/**
 * Get templates with filtering
 */
export async function getTemplates(
  filter?: TemplateFilter
): Promise<ActionResponse<{ templates: Template[]; total: number }>> {
  try {
    const validatedFilter = filter ? TemplateFilterSchema.parse(filter) : {};

    const response = await fetchApi<{ templates: Template[]; total: number }>(
      '/api/v1/communications/templates',
      {
        method: 'GET',
        params: validatedFilter
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to fetch templates'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching templates:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch templates'
    };
  }
}

/**
 * Get template by ID
 */
export async function getTemplateById(
  templateId: string
): Promise<ActionResponse<Template>> {
  try {
    const response = await fetchApi<Template>(
      `/api/v1/communications/templates/${templateId}`,
      { method: 'GET' }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to fetch template'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch template'
    };
  }
}

/**
 * Create template
 */
export async function createTemplate(
  data: CreateTemplateInput
): Promise<ActionResponse<Template>> {
  try {
    const validatedData = CreateTemplateSchema.parse(data);

    const response = await fetchApi<Template>(
      '/api/v1/communications/templates',
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create template'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error creating template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create template'
    };
  }
}

/**
 * Update template
 */
export async function updateTemplate(
  data: UpdateTemplateInput
): Promise<ActionResponse<Template>> {
  try {
    const validatedData = UpdateTemplateSchema.parse(data);

    const response = await fetchApi<Template>(
      `/api/v1/communications/templates/${validatedData.id}`,
      {
        method: 'PUT',
        body: validatedData
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to update template'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update template'
    };
  }
}

/**
 * Delete template
 */
export async function deleteTemplate(
  templateId: string
): Promise<ActionResponse<void>> {
  try {
    const response = await fetchApi(
      `/api/v1/communications/templates/${templateId}`,
      { method: 'DELETE' }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to delete template'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete template'
    };
  }
}

/**
 * Duplicate template
 */
export async function duplicateTemplate(
  templateId: string,
  name?: string
): Promise<ActionResponse<Template>> {
  try {
    const validatedData = DuplicateTemplateSchema.parse({ id: templateId, name });

    const response = await fetchApi<Template>(
      `/api/v1/communications/templates/${templateId}/duplicate`,
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to duplicate template'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error duplicating template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to duplicate template'
    };
  }
}

/**
 * Render template with variables
 */
export async function renderTemplate(
  templateId: string,
  variables: Record<string, unknown>
): Promise<ActionResponse<RenderedTemplate>> {
  try {
    const validatedData = RenderTemplateSchema.parse({ templateId, variables });

    const response = await fetchApi<RenderedTemplate>(
      `/api/v1/communications/templates/${templateId}/render`,
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to render template'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error rendering template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to render template'
    };
  }
}
