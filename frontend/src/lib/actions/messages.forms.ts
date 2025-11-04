/**
 * @fileoverview Message Form Handlers
 * @module lib/actions/messages.forms
 *
 * Form-friendly wrappers for message server actions.
 * Handles FormData parsing and transformation.
 */

'use server';

import { revalidatePath } from 'next/cache';
import type {
  ActionResult,
  Message,
  MessageTemplate,
  CreateMessageData,
  CreateMessageTemplateData,
} from './messages.types';
import { createMessageAction } from './messages.send';
import { createMessageTemplateAction } from './messages.templates';

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
    priority: formData.get('priority') as CreateMessageData['priority'] || 'normal',
    category: formData.get('category') as CreateMessageData['category'] || 'general',
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
    category: formData.get('category') as CreateMessageTemplateData['category'] || 'general',
    variables: variables.length > 0 ? variables : undefined,
    isActive: formData.get('isActive') === 'true',
  };

  const result = await createMessageTemplateAction(templateData);

  if (result.success && result.data) {
    revalidatePath('/messages/templates', 'page');
  }

  return result;
}
