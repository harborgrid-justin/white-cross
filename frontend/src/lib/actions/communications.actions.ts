/**
 * Communications Server Actions - Barrel Export
 *
 * HIPAA-compliant server actions for communication management with comprehensive
 * caching, audit logging, and error handling.
 *
 * This file serves as the main entry point, re-exporting all communications
 * functionality from specialized modules for backward compatibility.
 *
 * @module communications.actions
 */

'use server';

// ============================================================================
// RE-EXPORTS - Types and Utilities
// ============================================================================

export type {
  ActionResult,
  MessageTemplate,
  CreateMessageTemplateData,
  CommunicationAnalytics
} from './communications.types';

export { COMMUNICATIONS_CACHE_TAGS } from './communications.types';
export { fetchApi } from './communications.utils';

// ============================================================================
// RE-EXPORTS - Message Actions
// ============================================================================

export {
  getMessages,
  getMessageById,
  getMessageThreads,
  createMessage,
  updateMessage,
  markMessageAsRead,
  archiveMessages,
  deleteMessages,
  uploadAttachment
} from './communications.messages';

// ============================================================================
// RE-EXPORTS - Broadcast Actions
// ============================================================================

export {
  getBroadcasts,
  getBroadcastById,
  createBroadcast,
  updateBroadcast,
  cancelBroadcast,
  acknowledgeBroadcast,
  deleteBroadcast
} from './communications.broadcasts';

// ============================================================================
// RE-EXPORTS - Notification Actions
// ============================================================================

export {
  getNotifications,
  getNotificationCount,
  markNotificationsAsRead,
  markAllNotificationsAsRead,
  archiveNotifications,
  deleteNotifications,
  getNotificationPreferences,
  updateNotificationPreferences
} from './communications.notifications';

// ============================================================================
// RE-EXPORTS - Template Actions
// ============================================================================

export {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate,
  renderTemplate
} from './communications.templates';

// ============================================================================
// BACKWARD COMPATIBILITY ALIASES
// ============================================================================

import { markMessageAsRead, archiveMessages, deleteMessages } from './communications.messages';
import { deleteBroadcast, acknowledgeBroadcast } from './communications.broadcasts';
import type { ActionResult } from './communications.types';

/**
 * Mark message as read (alias for markMessageAsRead)
 * @deprecated Use markMessageAsRead instead
 */
export async function markAsReadAction(messageId: string): Promise<ActionResult<void>> {
  return markMessageAsRead(messageId);
}

/**
 * Archive message (alias for archiveMessages)
 * @deprecated Use archiveMessages instead
 */
export async function archiveMessageAction(messageId: string): Promise<ActionResult<void>> {
  return archiveMessages([messageId]);
}

/**
 * Delete message (alias for deleteMessages)
 * @deprecated Use deleteMessages instead
 */
export async function deleteMessageAction(messageId: string, permanent = false): Promise<ActionResult<void>> {
  return deleteMessages([messageId], permanent);
}

/**
 * Delete broadcast (alias for deleteBroadcast)
 * @deprecated Use deleteBroadcast instead
 */
export async function deleteBroadcastAction(broadcastId: string): Promise<ActionResult<void>> {
  return deleteBroadcast(broadcastId);
}

/**
 * Acknowledge broadcast (alias for acknowledgeBroadcast)
 * @deprecated Use acknowledgeBroadcast instead
 */
export async function acknowledgeBroadcastAction(broadcastId: string): Promise<ActionResult<void>> {
  return acknowledgeBroadcast(broadcastId);
}
