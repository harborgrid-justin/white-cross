/**
 * @fileoverview Broadcast Caching Functions
 * @module lib/actions/broadcasts/cache
 *
 * Cached data fetching functions for broadcasts using Next.js cache integration.
 * All functions use React cache() for automatic memoization and Next.js revalidation.
 */

'use server';

import { cache } from 'react';

// Core API integrations
import { serverGet } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import { CACHE_TTL } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types';
import type {
  Broadcast,
  BroadcastTemplate,
  BroadcastFilters,
  BroadcastAnalytics
} from './broadcasts.types';

// Import constant for use
import { BROADCAST_CACHE_TAGS as CACHE_TAGS } from './broadcasts.types';

// ==========================================
// CACHED BROADCAST FUNCTIONS
// ==========================================

/**
 * Get broadcast by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getBroadcast = cache(async (id: string): Promise<Broadcast | null> => {
  try {
    const response = await serverGet<ApiResponse<Broadcast>>(
      API_ENDPOINTS.BROADCASTS.BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [`broadcast-${id}`, CACHE_TAGS.BROADCASTS]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get broadcast:', error);
    return null;
  }
});

/**
 * Get all broadcasts with caching
 */
export const getBroadcasts = cache(async (filters?: BroadcastFilters): Promise<Broadcast[]> => {
  try {
    const response = await serverGet<ApiResponse<Broadcast[]>>(
      API_ENDPOINTS.BROADCASTS.BASE,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [CACHE_TAGS.BROADCASTS, 'broadcast-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get broadcasts:', error);
    return [];
  }
});

// ==========================================
// CACHED TEMPLATE FUNCTIONS
// ==========================================

/**
 * Get broadcast template by ID with caching
 */
export const getBroadcastTemplate = cache(async (id: string): Promise<BroadcastTemplate | null> => {
  try {
    const response = await serverGet<ApiResponse<BroadcastTemplate>>(
      `${API_ENDPOINTS.BROADCASTS.BASE}/templates/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: [`broadcast-template-${id}`, CACHE_TAGS.TEMPLATES]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get broadcast template:', error);
    return null;
  }
});

/**
 * Get all broadcast templates with caching
 */
export const getBroadcastTemplates = cache(async (category?: string): Promise<BroadcastTemplate[]> => {
  try {
    const params = category ? { category } : undefined;
    const response = await serverGet<ApiResponse<BroadcastTemplate[]>>(
      `${API_ENDPOINTS.BROADCASTS.BASE}/templates`,
      params as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATIC,
          tags: [CACHE_TAGS.TEMPLATES, 'broadcast-template-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get broadcast templates:', error);
    return [];
  }
});

// ==========================================
// CACHED ANALYTICS FUNCTIONS
// ==========================================

/**
 * Get broadcast analytics with caching
 */
export const getBroadcastAnalytics = cache(async (filters?: Record<string, unknown>): Promise<BroadcastAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<BroadcastAnalytics>>(
      `${API_ENDPOINTS.BROADCASTS.BASE}/analytics`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATS,
          tags: [CACHE_TAGS.ANALYTICS, 'broadcast-stats']
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get broadcast analytics:', error);
    return null;
  }
});
