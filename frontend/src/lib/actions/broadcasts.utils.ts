/**
 * @fileoverview Broadcast Utility Functions
 * @module lib/actions/broadcasts/utils
 *
 * Utility functions for broadcasts including existence checks, counts,
 * and cache management.
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';

// Types
import type {
  BroadcastFilters
} from './broadcasts.types';

// Import functions from other modules
import {
  getBroadcast,
  getBroadcastTemplate,
  getBroadcasts,
  getBroadcastTemplates
} from './broadcasts.cache';

// Import constant for use
import { BROADCAST_CACHE_TAGS as CACHE_TAGS } from './broadcasts.types';

// ==========================================
// EXISTENCE CHECKS
// ==========================================

/**
 * Check if broadcast exists
 */
export async function broadcastExists(broadcastId: string): Promise<boolean> {
  const broadcast = await getBroadcast(broadcastId);
  return broadcast !== null;
}

/**
 * Check if broadcast template exists
 */
export async function broadcastTemplateExists(templateId: string): Promise<boolean> {
  const template = await getBroadcastTemplate(templateId);
  return template !== null;
}

// ==========================================
// COUNT FUNCTIONS
// ==========================================

/**
 * Get broadcast count
 */
export const getBroadcastCount = cache(async (filters?: BroadcastFilters): Promise<number> => {
  try {
    const broadcasts = await getBroadcasts(filters);
    return broadcasts.length;
  } catch {
    return 0;
  }
});

/**
 * Get broadcast template count
 */
export const getBroadcastTemplateCount = cache(async (category?: string): Promise<number> => {
  try {
    const templates = await getBroadcastTemplates(category);
    return templates.length;
  } catch {
    return 0;
  }
});

// ==========================================
// CACHE MANAGEMENT
// ==========================================

/**
 * Clear broadcast cache
 */
export async function clearBroadcastCache(resourceType?: string, resourceId?: string): Promise<void> {
  if (resourceType && resourceId) {
    revalidateTag(`${resourceType}-${resourceId}`, 'default');
  }

  // Clear all broadcast caches
  Object.values(CACHE_TAGS).forEach(tag => {
    revalidateTag(tag, 'default');
  });

  // Clear list caches
  revalidateTag('broadcast-list', 'default');
  revalidateTag('broadcast-template-list', 'default');
  revalidateTag('broadcast-stats', 'default');

  // Clear paths
  revalidatePath('/broadcasts', 'page');
  revalidatePath('/broadcasts/templates', 'page');
  revalidatePath('/broadcasts/analytics', 'page');
}
