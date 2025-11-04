/**
 * @fileoverview Export Template Operations
 * @module app/export/templates
 *
 * HIPAA-compliant server actions for export template management.
 * Includes audit logging, cache invalidation, and error handling.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverPost, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import type { ApiResponse } from '@/types';
import type {
  ExportTemplate,
  CreateExportTemplateData,
  ActionResult
} from './export.types';
import { EXPORT_CACHE_TAGS } from './export.types';

// ==========================================
// CREATE EXPORT TEMPLATE
// ==========================================

/**
 * Create export template
 * Includes audit logging and cache invalidation
 */
export async function createExportTemplateAction(data: CreateExportTemplateData): Promise<ActionResult<ExportTemplate>> {
  try {
    // Validate required fields
    if (!data.name || !data.type || !data.format) {
      return {
        success: false,
        error: 'Missing required fields: name, type, format'
      };
    }

    const response = await serverPost<ApiResponse<ExportTemplate>>(
      `${API_ENDPOINTS.ADMIN.CONFIGURATIONS}/export/templates`,
      data,
      {
        cache: 'no-store',
        next: { tags: [EXPORT_CACHE_TAGS.TEMPLATES] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create export template');
    }

    // AUDIT LOG - Template creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'ExportTemplate',
      resourceId: response.data.id,
      details: `Created ${data.type} export template: ${data.name}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(EXPORT_CACHE_TAGS.TEMPLATES, 'default');
    revalidateTag('export-template-list', 'default');
    revalidatePath('/export/templates', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Export template created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create export template';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'ExportTemplate',
      details: `Failed to create export template: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
