/**
 * @fileoverview Communications Broadcasts - Next.js v14+ Compatible
 *
 * Broadcast-related server actions for communications module.
 * Handles creating, updating, canceling, and acknowledging broadcasts.
 */

'use server';

import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api/server';
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

    const response = await serverGet<{ broadcasts: Broadcast[]; total: number }>(
      '/communications/broadcasts',
      validatedFilter as Record<string, string | number | boolean>
    );

    return {
      success: true,
      data: response
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
    const response = await serverGet<Broadcast>(
      `/communications/broadcasts/${broadcastId}`
    );

    return {
      success: true,
      data: response
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

    const response = await serverPost<Broadcast>(
      '/communications/broadcasts',
      validatedData
    );

    return {
      success: true,
      data: response
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

    const response = await serverPut<Broadcast>(
      `/communications/broadcasts/${validatedData.id}`,
      validatedData
    );

    return {
      success: true,
      data: response
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

    await serverPost(
      `/communications/broadcasts/${broadcastId}/cancel`,
      validatedData
    );

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

    await serverPost(
      `/communications/broadcasts/${broadcastId}/acknowledge`,
      validatedData
    );

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
    await serverDelete(
      `/communications/broadcasts/${broadcastId}`
    );

    return { success: true };
  } catch (error) {
    console.error('Error deleting broadcast:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete broadcast'
    };
  }
}
