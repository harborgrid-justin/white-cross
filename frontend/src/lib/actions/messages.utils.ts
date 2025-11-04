/**
 * @fileoverview Message Utility Functions
 * @module lib/actions/messages.utils
 *
 * Helper functions for message operations including existence checks,
 * counts, overviews, and cache management.
 */

'use server';

import { cache } from 'react';
import { revalidatePath, revalidateTag } from 'next/cache';
import type { MessageFilters, MESSAGE_CACHE_TAGS } from './messages.types';
import { getMessage, getMessages, getMessageThreads } from './messages.cache';
import { MESSAGE_CACHE_TAGS as CACHE_TAGS } from './messages.types';

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

/**
 * Clear message cache
 */
export async function clearMessageCache(resourceType?: string, resourceId?: string): Promise<void> {
  if (resourceType && resourceId) {
    revalidateTag(`${resourceType}-${resourceId}`, 'default');
  }

  // Clear all message caches
  Object.values(CACHE_TAGS).forEach(tag => {
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
