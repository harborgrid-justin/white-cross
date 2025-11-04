/**
 * @fileoverview Broadcast Template Operations
 * @module lib/actions/broadcasts/templates
 *
 * CRUD operations for broadcast templates with audit logging
 * and cache invalidation.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

// Core API integrations
import { serverPost, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';

// Types
import type { ApiResponse } from '@/types';
import type {
  BroadcastTemplate,
  CreateBroadcastTemplateData,
  ActionResult
} from './broadcasts.types';

// Import constant for use
import { BROADCAST_CACHE_TAGS as CACHE_TAGS } from './broadcasts.types';

// ==========================================
// TEMPLATE OPERATIONS
// ==========================================

/**
 * Create broadcast template
 * Includes audit logging and cache invalidation
 */
export async function createBroadcastTemplateAction(data: CreateBroadcastTemplateData): Promise<ActionResult<BroadcastTemplate>> {
  try {
    // Validate required fields
    if (!data.name || !data.subject || !data.content || !data.type || !data.category) {
      return {
        success: false,
        error: 'Missing required fields: name, subject, content, type, category'
      };
    }

    const response = await serverPost<ApiResponse<BroadcastTemplate>>(
      `${API_ENDPOINTS.BROADCASTS.BASE}/templates`,
      data,
      {
        cache: 'no-store',
        next: { tags: [CACHE_TAGS.TEMPLATES] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create broadcast template');
    }

    // AUDIT LOG - Template creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'BroadcastTemplate',
      resourceId: response.data.id,
      details: `Created ${data.type} broadcast template: ${data.name}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(CACHE_TAGS.TEMPLATES, 'default');
    revalidateTag('broadcast-template-list', 'default');
    revalidatePath('/broadcasts/templates', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Broadcast template created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create broadcast template';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'BroadcastTemplate',
      details: `Failed to create broadcast template: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
