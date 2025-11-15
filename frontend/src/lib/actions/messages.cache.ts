/**
 * @fileoverview Message Cache Functions
 * @module lib/actions/messages.cache
 *
 * Cached data fetching functions for messages using Next.js cache() and React cache.
 * All functions use force-cache strategy with appropriate revalidation times.
 */

'use server';

import { cache } from 'react';
import { serverGet } from '@/lib/api/server';
import type {
  Message,
  MessageThread,
  MessageTemplate,
  MessageAnalytics,
  MessageFilters,
} from './messages.types';

// Import constants
import { MESSAGE_CACHE_TAGS as CACHE_TAGS, CACHE_TTL as TTL } from './messages.types';

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get message by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getMessage = cache(async (id: string): Promise<Message | null> => {
  try {
    const response = await serverGet<{ success: boolean; data: Message }>(
      `/api/messages/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: TTL.SESSION,
          tags: [`message-${id}`, CACHE_TAGS.MESSAGES]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get message:', error);
    return null;
  }
});

/**
 * Get all messages with caching
 */
export const getMessages = cache(async (filters?: MessageFilters): Promise<Message[]> => {
  try {
    const response = await serverGet<{ success: boolean; data: Message[] }>(
      `/api/messages`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: TTL.SESSION,
          tags: [CACHE_TAGS.MESSAGES, 'message-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get messages:', error);
    return [];
  }
});

/**
 * Get message thread by ID with caching
 */
export const getMessageThread = cache(async (id: string): Promise<MessageThread | null> => {
  try {
    const response = await serverGet<{ success: boolean; data: MessageThread }>(
      `/api/messages/threads/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: TTL.SESSION,
          tags: [`message-thread-${id}`, CACHE_TAGS.THREADS]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get message thread:', error);
    return null;
  }
});

/**
 * Get all message threads with caching
 */
export const getMessageThreads = cache(async (filters?: Record<string, unknown>): Promise<MessageThread[]> => {
  try {
    const response = await serverGet<{ success: boolean; data: MessageThread[] }>(
      `/api/messages/threads`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: TTL.SESSION,
          tags: [CACHE_TAGS.THREADS, 'message-thread-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get message threads:', error);
    return [];
  }
});

/**
 * Get message templates with caching
 */
export const getMessageTemplates = cache(async (): Promise<MessageTemplate[]> => {
  try {
    const response = await serverGet<{ success: boolean; data: MessageTemplate[] }>(
      `/api/messages/templates`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: TTL.STATIC,
          tags: [CACHE_TAGS.TEMPLATES, 'message-template-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get message templates:', error);
    return [];
  }
});

/**
 * Get message analytics with caching
 */
export const getMessageAnalytics = cache(async (filters?: Record<string, unknown>): Promise<MessageAnalytics | null> => {
  try {
    const response = await serverGet<{ success: boolean; data: MessageAnalytics }>(
      `/api/messages/analytics`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: TTL.STATS,
          tags: ['message-analytics', 'message-stats']
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get message analytics:', error);
    return null;
  }
});
