/**
 * @fileoverview Message Management Server Actions - Barrel Export
 * @module app/messages/actions
 *
 * HIPAA-compliant server actions for messaging system with comprehensive
 * caching, audit logging, and error handling.
 *
 * This file serves as the main entry point, re-exporting all message-related
 * functionality from specialized modules for backward compatibility.
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

// ==========================================
// TYPE DEFINITIONS & CONSTANTS
// ==========================================

export type {
  ActionResult,
  Message,
  CreateMessageData,
  UpdateMessageData,
  MessageThread,
  MessageAttachment,
  MessageTemplate,
  CreateMessageTemplateData,
  MessageFilters,
  MessageAnalytics,
} from './messages.types';

export {
  MESSAGE_CACHE_TAGS,
  CACHE_TTL,
} from './messages.types';

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

export {
  getMessage,
  getMessages,
  getMessageThread,
  getMessageThreads,
  getMessageTemplates,
  getMessageAnalytics,
} from './messages.cache';

// ==========================================
// MESSAGE CRUD OPERATIONS
// ==========================================

export {
  createMessageAction,
  updateMessageAction,
  sendMessageAction,
  markMessageReadAction,
} from './messages.send';

// ==========================================
// TEMPLATE OPERATIONS
// ==========================================

export {
  createMessageTemplateAction,
} from './messages.templates';

// ==========================================
// FORM HANDLERS
// ==========================================

export {
  createMessageFromForm,
  createMessageTemplateFromForm,
} from './messages.forms';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export {
  messageExists,
  getMessageCount,
  getUnreadMessageCount,
  getMessageOverview,
  clearMessageCache,
} from './messages.utils';

// ==========================================
// DASHBOARD FUNCTIONS
// ==========================================

export {
  getMessagesStats,
  getMessagesDashboardData,
} from './messages.dashboard';
