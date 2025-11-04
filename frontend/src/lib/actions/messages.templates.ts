/**
 * @fileoverview Message Template Operations
 * @module lib/actions/messages.templates
 *
 * Server actions for creating and managing message templates.
 * Includes HIPAA audit logging and cache invalidation.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { serverPost, NextApiClientError } from '@/lib/api/nextjs-client';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import type {
  ActionResult,
  MessageTemplate,
  CreateMessageTemplateData,
} from './messages.types';

// Import constants
import { MESSAGE_CACHE_TAGS as CACHE_TAGS } from './messages.types';

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

    const response = await serverPost<{ success: boolean; data: MessageTemplate; message?: string }>(
      `/api/messages/templates`,
      data,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.TEMPLATES] }
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
    revalidateTag(CACHE_TAGS.TEMPLATES, 'default');
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
