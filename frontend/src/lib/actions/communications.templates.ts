/**
 * @fileoverview Communications Templates - Next.js v14+ Compatible
 *
 * Template-related server actions for communications module.
 * Handles template CRUD operations, duplication, and rendering.
 */

'use server';

import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/api/server';
import type { ActionResult } from './communications.types';
import {
  CreateTemplateSchema,
  UpdateTemplateSchema,
  TemplateFilterSchema,
  RenderTemplateSchema,
  DuplicateTemplateSchema,
  type Template,
  type TemplateFilter,
  type RenderedTemplate
} from '@/lib/validations/template.schemas';

// ============================================================================
// TEMPLATE ACTIONS
// ============================================================================

/**
 * Get templates with filtering and pagination
 */
export async function getTemplates(
  filter?: TemplateFilter
): Promise<ActionResult<{ templates: Template[]; total: number }>> {
  try {
    const validatedFilter = filter ? TemplateFilterSchema.parse(filter) : {};

    // Convert filter to query params format
    const params = Object.entries(validatedFilter).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>);

    const data = await serverGet<{ templates: Template[]; total: number }>(
      '/communications/templates',
      params
    );

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error fetching templates:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch templates'
    };
  }
}

/**
 * Get template by ID
 */
export async function getTemplateById(
  templateId: string
): Promise<ActionResult<Template>> {
  try {
    const data = await serverGet<Template>(
      `/communications/templates/${templateId}`
    );

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error fetching template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch template'
    };
  }
}

/**
 * Create template
 */
export async function createTemplate(
  data: any
): Promise<ActionResult<Template>> {
  try {
    const validatedData = CreateTemplateSchema.parse(data);

    const responseData = await serverPost<Template>(
      '/communications/templates',
      validatedData
    );

    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error('Error creating template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create template'
    };
  }
}

/**
 * Update template
 */
export async function updateTemplate(
  data: any
): Promise<ActionResult<Template>> {
  try {
    const validatedData = UpdateTemplateSchema.parse(data);

    const responseData = await serverPut<Template>(
      `/communications/templates/${validatedData.id}`,
      validatedData
    );

    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error('Error updating template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update template'
    };
  }
}

/**
 * Delete template
 */
export async function deleteTemplate(
  templateId: string
): Promise<ActionResult<void>> {
  try {
    await serverDelete<void>(
      `/communications/templates/${templateId}`
    );

    return { success: true };
  } catch (error) {
    console.error('Error deleting template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete template'
    };
  }
}

/**
 * Duplicate template
 */
export async function duplicateTemplate(
  templateId: string,
  name?: string
): Promise<ActionResult<Template>> {
  try {
    const validatedData = DuplicateTemplateSchema.parse({ id: templateId, name });

    const responseData = await serverPost<Template>(
      `/communications/templates/${templateId}/duplicate`,
      validatedData
    );

    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error('Error duplicating template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to duplicate template'
    };
  }
}

/**
 * Render template with variables
 */
export async function renderTemplate(
  templateId: string,
  variables: Record<string, unknown>
): Promise<ActionResult<RenderedTemplate>> {
  try {
    const validatedData = RenderTemplateSchema.parse({ templateId, variables });

    const responseData = await serverPost<RenderedTemplate>(
      `/communications/templates/${templateId}/render`,
      validatedData
    );

    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error('Error rendering template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to render template'
    };
  }
}
