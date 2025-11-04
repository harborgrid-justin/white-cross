/**
 * @fileoverview Communications Templates - Next.js v14+ Compatible
 *
 * Template-related server actions for communications module.
 * Handles template CRUD operations, duplication, and rendering.
 */

'use server';

import { fetchApi } from './communications.utils';
import type { ActionResult } from './communications.types';
import {
  CreateTemplateSchema,
  UpdateTemplateSchema,
  TemplateFilterSchema,
  RenderTemplateSchema,
  DeleteTemplateSchema,
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

    const response = await fetchApi<{ templates: Template[]; total: number }>(
      '/communications/templates',
      {
        method: 'GET',
        params: validatedFilter
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to fetch templates'
      };
    }

    return {
      success: true,
      data: response.data
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
    const response = await fetchApi<Template>(
      `/communications/templates/${templateId}`,
      { method: 'GET' }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to fetch template'
      };
    }

    return {
      success: true,
      data: response.data
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

    const response = await fetchApi<Template>(
      '/communications/templates',
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create template'
      };
    }

    return {
      success: true,
      data: response.data
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

    const response = await fetchApi<Template>(
      `/communications/templates/${validatedData.id}`,
      {
        method: 'PUT',
        body: validatedData
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to update template'
      };
    }

    return {
      success: true,
      data: response.data
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
    const response = await fetchApi(
      `/communications/templates/${templateId}`,
      { method: 'DELETE' }
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to delete template'
      };
    }

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

    const response = await fetchApi<Template>(
      `/communications/templates/${templateId}/duplicate`,
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to duplicate template'
      };
    }

    return {
      success: true,
      data: response.data
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

    const response = await fetchApi<RenderedTemplate>(
      `/communications/templates/${templateId}/render`,
      {
        method: 'POST',
        body: validatedData
      }
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to render template'
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error rendering template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to render template'
    };
  }
}
