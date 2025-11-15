/**
 * @fileoverview Broadcast Delivery Operations
 * @module lib/actions/broadcasts/delivery
 *
 * Functions for sending and delivering broadcasts with audit logging
 * and cache invalidation.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverPost, NextApiClientError } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Types
import type { ApiResponse } from '@/types';
import type {
  Broadcast,
  ActionResult
} from './broadcasts.types';

// Import constant for use
import { BROADCAST_CACHE_TAGS as CACHE_TAGS } from './broadcasts.types';

// ==========================================
// DELIVERY OPERATIONS
// ==========================================

/**
 * Send broadcast immediately
 * Includes audit logging and cache invalidation
 */
export async function sendBroadcastAction(broadcastId: string): Promise<ActionResult<Broadcast>> {
  try {
    if (!broadcastId) {
      return {
        success: false,
        error: 'Broadcast ID is required'
      };
    }

    const response = await serverPost<ApiResponse<Broadcast>>(
      `${API_ENDPOINTS.BROADCASTS.BASE}/${broadcastId}/send`,
      {},
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.BROADCASTS, `broadcast-${broadcastId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to send broadcast');
    }

    // AUDIT LOG - Broadcast send
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Broadcast',
      resourceId: broadcastId,
      details: `Sent broadcast to ${response.data.totalRecipients} recipients`,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.BROADCASTS, 'default');
    revalidateTag(CACHE_TAGS.ANALYTICS, 'default');
    revalidateTag(`broadcast-${broadcastId}`, 'default');
    revalidateTag('broadcast-list', 'default');
    revalidateTag('broadcast-stats', 'default');
    revalidatePath('/broadcasts', 'page');
    revalidatePath(`/broadcasts/${broadcastId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Broadcast sent successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to send broadcast';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Broadcast',
      resourceId: broadcastId,
      details: `Failed to send broadcast: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
