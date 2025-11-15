/**
 * MIGRATION STATUS: DEPRECATED
 *
 * This service module has been replaced by Next.js Server Actions for improved
 * performance, security, and Next.js App Router compatibility.
 *
 * **New Implementation:**
 * - Server Components: import from '@/lib/actions/communications.*'
 * - Client Components: Use Server Actions with useActionState
 *
 * **Migration Guide:**
 *
 * OLD (This file - DEPRECATED):
 * ```typescript
 * import { createCommunicationsApi } from '@/services/modules/communicationsApi';
 * const api = createCommunicationsApi(apiClient);
 * await api.sendBroadcast(id);
 * await api.sendMessage({ subject, body, recipientId });
 * ```
 *
 * INTERMEDIATE (Refactored modules - STILL DEPRECATED):
 * ```typescript
 * import { createCommunicationsApi } from '@/services/modules/communications';
 * const api = createCommunicationsApi(apiClient);
 * await api.broadcasts.sendBroadcast(id);
 * await api.messages.sendMessage({ subject, body, recipientId });
 * ```
 *
 * NEW (Server Actions - USE THIS):
 * ```typescript
 * import {
 *   sendBroadcastAction,
 *   sendMessageAction,
 *   getTemplates
 * } from '@/lib/actions/communications.actions';
 *
 * // In Server Components
 * const templates = await getTemplates();
 * const result = await sendBroadcastAction(broadcastId);
 *
 * // In Client Components
 * 'use client';
 * import { useActionState } from 'react';
 *
 * function MessageForm() {
 *   const [state, formAction] = useActionState(sendMessageAction, {});
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 *
 * **Available Server Actions:**
 * - Broadcasts: sendBroadcastAction, getBroadcasts, scheduleBroadcastAction
 * - Messages: sendMessageAction, getInbox, markAsReadAction
 * - Templates: getTemplates, renderTemplate, createTemplateAction
 * - Notifications: sendNotificationAction, getNotificationPreferences
 * - Delivery: trackDeliveryStatus, getDeliveryReport
 *
 * **See Also:**
 * - @see {@link /lib/actions/communications.actions.ts} - Main Server Actions
 * - @see {@link /lib/actions/communications.broadcasts.ts} - Broadcast operations
 * - @see {@link /lib/actions/communications.messages.ts} - Messaging operations
 * - @see {@link /lib/actions/communications.templates.ts} - Template operations
 * - @see {@link /services/modules/communications} - Refactored intermediate modules
 *
 * @deprecated Use Server Actions from @/lib/actions/communications.* instead
 * @module services/modules/communicationsApi
 * @category Healthcare - Communications
 * @fileoverview Communications API Service - Unified communications management (DEPRECATED)
 * @version 2.0.0 - Will be removed in v3.0.0
 */

// Re-export everything from the new structure for backward compatibility
export * from './communications';
export { createCommunicationsApi } from './communications';

/**
 * Legacy CommunicationsApi class re-export
 * @deprecated Use the new module structure
 */
export { CommunicationsApi } from './communications';
