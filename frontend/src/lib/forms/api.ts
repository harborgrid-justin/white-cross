/**
 * Form API integration layer
 * Handles backend communication for form operations
 *
 * @module lib/forms/api
 */

import apiClient from '../api-client';
import type { FormField } from './types';

/**
 * Form definition interface for API operations
 */
export interface FormDefinition {
  id?: string;
  name: string;
  description?: string;
  fields: FormField[];
  zodSchema?: string;
  createdBy?: string;
  metadata?: {
    category?: string;
    isPHI?: boolean;
    isPublic?: boolean;
    version?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Form response interface
 */
export interface FormResponse {
  id?: string;
  formId: string;
  data: Record<string, any>;
  submittedBy?: string;
  ipAddress?: string;
  userAgent?: string;
  phiFields?: string[];
  createdAt?: string;
}

/**
 * API endpoints for forms
 */
export const FORM_API_ENDPOINTS = {
  forms: '/forms',
  formById: (id: string) => `/forms/${id}`,
  formResponses: (formId: string) => `/forms/${formId}/responses`,
  formResponseCount: (formId: string) => `/forms/${formId}/responses/count`,
  formVersions: (formId: string) => `/forms/${formId}/versions`
};

/**
 * Get form definition by ID
 *
 * @param formId - Form ID
 * @returns Form definition
 * @throws Error if form not found
 */
export async function getForm(formId: string): Promise<FormDefinition> {
  try {
    const form = await apiClient.get<FormDefinition>(
      FORM_API_ENDPOINTS.formById(formId)
    );
    return form;
  } catch (error: any) {
    throw new Error(`Failed to fetch form: ${error.message}`);
  }
}

/**
 * Store new form definition
 *
 * @param form - Form definition to store
 * @returns Created form with ID
 * @throws Error if storage fails
 */
export async function storeForm(form: FormDefinition): Promise<FormDefinition> {
  try {
    const created = await apiClient.post<FormDefinition>(
      FORM_API_ENDPOINTS.forms,
      form
    );
    return created;
  } catch (error: any) {
    throw new Error(`Failed to create form: ${error.message}`);
  }
}

/**
 * Update existing form definition
 *
 * @param formId - Form ID to update
 * @param updates - Partial form data to update
 * @returns Updated form
 * @throws Error if update fails
 */
export async function updateForm(
  formId: string,
  updates: Partial<FormDefinition>
): Promise<FormDefinition> {
  try {
    const updated = await apiClient.put<FormDefinition>(
      FORM_API_ENDPOINTS.formById(formId),
      updates
    );
    return updated;
  } catch (error: any) {
    throw new Error(`Failed to update form: ${error.message}`);
  }
}

/**
 * Soft delete form (archive)
 *
 * @param formId - Form ID to delete
 * @returns Success status
 * @throws Error if deletion fails
 */
export async function softDeleteForm(formId: string): Promise<{ success: boolean }> {
  try {
    // Soft delete by marking as archived
    const result = await apiClient.delete<{ success: boolean }>(
      FORM_API_ENDPOINTS.formById(formId)
    );
    return result;
  } catch (error: any) {
    throw new Error(`Failed to delete form: ${error.message}`);
  }
}

/**
 * Create new version of form
 * Stores current form state as a version before updates
 *
 * @param formId - Form ID to version
 * @returns Version information
 * @throws Error if versioning fails
 */
export async function createFormVersion(formId: string): Promise<{ versionId: string; version: number }> {
  try {
    const version = await apiClient.post<{ versionId: string; version: number }>(
      FORM_API_ENDPOINTS.formVersions(formId),
      {}
    );
    return version;
  } catch (error: any) {
    throw new Error(`Failed to create form version: ${error.message}`);
  }
}

/**
 * Get form responses
 *
 * @param formId - Form ID
 * @param options - Query options (limit, offset, filters)
 * @returns Array of form responses
 * @throws Error if fetch fails
 */
export async function getFormResponses(
  formId: string,
  options?: {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  }
): Promise<FormResponse[]> {
  try {
    const params: Record<string, string | number> = {};

    if (options?.limit) params.limit = options.limit;
    if (options?.offset) params.offset = options.offset;
    if (options?.startDate) params.startDate = options.startDate;
    if (options?.endDate) params.endDate = options.endDate;

    const responses = await apiClient.get<FormResponse[]>(
      FORM_API_ENDPOINTS.formResponses(formId),
      params
    );

    return responses;
  } catch (error: any) {
    throw new Error(`Failed to fetch form responses: ${error.message}`);
  }
}

/**
 * Store form response
 *
 * @param response - Form response data
 * @returns Created response with ID
 * @throws Error if storage fails
 */
export async function storeFormResponse(response: FormResponse): Promise<FormResponse> {
  try {
    const created = await apiClient.post<FormResponse>(
      FORM_API_ENDPOINTS.formResponses(response.formId),
      response
    );
    return created;
  } catch (error: any) {
    throw new Error(`Failed to store form response: ${error.message}`);
  }
}

/**
 * Get form response count
 *
 * @param formId - Form ID
 * @returns Number of responses
 * @throws Error if fetch fails
 */
export async function getFormResponseCount(formId: string): Promise<number> {
  try {
    const result = await apiClient.get<{ count: number }>(
      FORM_API_ENDPOINTS.formResponseCount(formId)
    );
    return result.count;
  } catch (error: any) {
    throw new Error(`Failed to get response count: ${error.message}`);
  }
}

/**
 * List all forms
 *
 * @param options - Query options
 * @returns Array of forms
 */
export async function listForms(options?: {
  limit?: number;
  offset?: number;
  category?: string;
  createdBy?: string;
}): Promise<FormDefinition[]> {
  try {
    const params: Record<string, string | number> = {};

    if (options?.limit) params.limit = options.limit;
    if (options?.offset) params.offset = options.offset;
    if (options?.category) params.category = options.category;
    if (options?.createdBy) params.createdBy = options.createdBy;

    const forms = await apiClient.get<FormDefinition[]>(
      FORM_API_ENDPOINTS.forms,
      params
    );

    return forms;
  } catch (error: any) {
    throw new Error(`Failed to list forms: ${error.message}`);
  }
}
