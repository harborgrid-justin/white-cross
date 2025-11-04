/**
 * @fileoverview Communications Broadcasts - Next.js v14+ Compatible
 *
 * Broadcast-related server actions for communications module.
 * Handles creating, updating, canceling, and acknowledging broadcasts.
 */

'use server';

import { fetchApi } from './communications.utils';
import type { ActionResult } from './communications.types';
import {
  CreateBroadcastSchema,
  UpdateBroadcastSchema,
  BroadcastFilterSchema,
  CancelBroadcastSchema,
  AcknowledgeBroadcastSchema,
  type Broadcast,
  type CreateBroadcastInput,
  type UpdateBroadcastInput,
  type BroadcastFilter
} from '@/lib/validations/broadcast.schemas';

// ============================================================================
// BROADCAST ACTIONS
// ============================================================================

/**
 * Get broadcasts with filtering and pagination
 */
export async function getBroadcasts(
  filter?: BroadcastFilter
): Promise<ActionResult<{ broadcasts: Broadcast[]; total: number }>> {
  try {
    const validatedFilter = filter ? BroadcastFilterSchema.parse(filter) : {};

    const response = await fetchApi<{ broadcasts: Broadcast[]; total: number }>(
      '/communications/broadcasts',
      {
        method: 'GET',
        params: validatedFilter
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to fetch broadcasts'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching broadcasts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch broadcasts'
    };
  }
}

/**
 * Get broadcast by ID
 */
export async function getBroadcastById(
  broadcastId: string
): Promise<ActionResult<Broadcast>> {
  try {
    const response = await fetchApi<Broadcast>(
      `/communications/broadcasts/${broadcastId}`,
      { method: 'GET' }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to fetch broadcast'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching broadcast:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch broadcast'
    };
  }
}

/**
 * Create broadcast
 */
export async function createBroadcast(
  data: CreateBroadcastInput
): Promise<ActionResult<Broadcast>> {
  try {
    const validatedData = CreateBroadcastSchema.parse(data);

    const response = await fetchApi<Broadcast>(
      '/communications/broadcasts',
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create broadcast'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error creating broadcast:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create broadcast'
    };
  }
}

/**
 * Update broadcast (draft only)
 */
export async function updateBroadcast(
  data: UpdateBroadcastInput
): Promise<ActionResult<Broadcast>> {
  try {
    const validatedData = UpdateBroadcastSchema.parse(data);

    const response = await fetchApi<Broadcast>(
      `/communications/broadcasts/${validatedData.id}`,
      {
        method: 'PUT',
        body: validatedData
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to update broadcast'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating broadcast:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update broadcast'
    };
  }
}

/**
 * Cancel broadcast
 */
export async function cancelBroadcast(
  broadcastId: string,
  reason?: string
): Promise<ActionResult<void>> {
  try {
    const validatedData = CancelBroadcastSchema.parse({ id: broadcastId, reason });

    const response = await fetchApi(
      `/communications/broadcasts/${broadcastId}/cancel`,
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to cancel broadcast'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error cancelling broadcast:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel broadcast'
    };
  }
}

/**
 * Acknowledge broadcast
 */
export async function acknowledgeBroadcast(
  broadcastId: string
): Promise<ActionResult<void>> {
  try {
    const validatedData = AcknowledgeBroadcastSchema.parse({ broadcastId });

    const response = await fetchApi(
      `/communications/broadcasts/${broadcastId}/acknowledge`,
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to acknowledge broadcast'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error acknowledging broadcast:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to acknowledge broadcast'
    };
  }
}

/**
 * Delete broadcast
 */
export async function deleteBroadcast(
  broadcastId: string
): Promise<ActionResult<void>> {
  try {
    const response = await fetchApi(
      `/communications/broadcasts/${broadcastId}`,
      { method: 'DELETE' }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to delete broadcast'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting broadcast:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete broadcast'
    };
  }
}
