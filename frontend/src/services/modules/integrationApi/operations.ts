/**
 * @fileoverview Integration API CRUD Operations
 * @module services/modules/integrationApi/operations
 * @category Services - System Integration & External APIs
 *
 * @deprecated This module is deprecated and will be removed on 2026-06-30.
 * Please migrate to @/lib/actions/admin.integrations instead.
 *
 * MIGRATION GUIDE:
 * ```typescript
 * // OLD: Integration CRUD
 * import { getAll, getById, create, update } from '@/services/modules/integrationApi/operations';
 * const integrations = await getAll(client, 'SIS');
 * const integration = await getById(client, 'id');
 * await create(client, data);
 * await update(client, 'id', data);
 *
 * // NEW: Server Actions
 * import { getIntegrations, getIntegration, createIntegration, updateIntegration } from '@/lib/actions/admin.integrations';
 * const integrations = await getIntegrations(); // filter in action if needed
 * const integration = await getIntegration('id');
 * await createIntegration(data);
 * await updateIntegration('id', data);
 * ```
 *
 * Core Create, Read, Update, Delete operations for integration management.
 * Provides type-safe methods for managing integration configurations with
 * comprehensive validation and error handling.
 *
 * Operations:
 * - getAll: Fetch all integrations with optional type filtering
 * - getById: Fetch single integration by ID
 * - create: Create new integration with validation
 * - update: Update existing integration with validation
 * - delete: Remove integration configuration
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '../../utils/apiUtils';
import {
  createIntegrationSchema,
  updateIntegrationSchema,
  createApiError
} from './validation';
import type {
  IntegrationType,
  IntegrationListResponse,
  IntegrationResponse,
  CreateIntegrationRequest,
  UpdateIntegrationRequest,
} from '@/types/domain/integrations';

/**
 * Get all integrations with optional type filtering
 *
 * @param client - API client instance
 * @param type - Optional integration type filter
 * @returns Promise resolving to list of integrations
 * @throws Error if fetch fails
 *
 * @example
 * ```typescript
 * const sisIntegrations = await getAll(client, 'SIS');
 * console.log(`Found ${sisIntegrations.integrations.length} SIS integrations`);
 * ```
 */
export async function getAll(
  client: ApiClient,
  type?: IntegrationType
): Promise<IntegrationListResponse> {
  try {
    const params = type ? `?type=${encodeURIComponent(type)}` : '';
    const response = await client.get<ApiResponse<IntegrationListResponse>>(
      `${API_ENDPOINTS.INTEGRATIONS.BASE}${params}`
    );

    return response.data.data;
  } catch (error) {
    throw createApiError(error, 'Failed to fetch integrations');
  }
}

/**
 * Get single integration by ID
 *
 * @param client - API client instance
 * @param id - Integration unique identifier
 * @returns Promise resolving to integration details
 * @throws Error if ID is missing or fetch fails
 *
 * @example
 * ```typescript
 * const integration = await getById(client, 'uuid-123');
 * console.log(`Integration: ${integration.integration.name}`);
 * ```
 */
export async function getById(
  client: ApiClient,
  id: string
): Promise<IntegrationResponse> {
  try {
    if (!id) throw new Error('Integration ID is required');

    const response = await client.get<ApiResponse<IntegrationResponse>>(
      `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}`
    );

    return response.data.data;
  } catch (error) {
    throw createApiError(error, 'Failed to fetch integration');
  }
}

/**
 * Create new integration configuration
 *
 * Validates the request data using Zod schema before submission.
 * Ensures all required fields are present and properly formatted.
 *
 * @param client - API client instance
 * @param data - Integration configuration data
 * @returns Promise resolving to created integration
 * @throws Error if validation fails or creation fails
 *
 * @example
 * ```typescript
 * const newIntegration = await create(client, {
 *   name: 'PowerSchool SIS',
 *   type: 'SIS',
 *   endpoint: 'https://api.powerschool.com/v1',
 *   apiKey: 'your-api-key',
 *   settings: {
 *     syncDirection: 'inbound',
 *     autoSync: true
 *   }
 * });
 * ```
 */
export async function create(
  client: ApiClient,
  data: CreateIntegrationRequest
): Promise<IntegrationResponse> {
  try {
    // Validate request data
    createIntegrationSchema.parse(data);

    const response = await client.post<ApiResponse<IntegrationResponse>>(
      API_ENDPOINTS.INTEGRATIONS.BASE,
      data
    );

    return response.data.data;
  } catch (error) {
    // Check for Zod validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      const zodError = error as { errors: Array<{ message: string }> };
      throw new Error(`Validation error: ${zodError.errors[0].message}`);
    }
    throw createApiError(error, 'Failed to create integration');
  }
}

/**
 * Update existing integration
 *
 * Validates the update data using Zod schema before submission.
 * Supports partial updates - only provided fields are updated.
 *
 * @param client - API client instance
 * @param id - Integration unique identifier
 * @param data - Partial integration update data
 * @returns Promise resolving to updated integration
 * @throws Error if ID is missing, validation fails, or update fails
 *
 * @example
 * ```typescript
 * const updated = await update(client, 'uuid-123', {
 *   isActive: false,
 *   settings: { autoSync: false }
 * });
 * ```
 */
export async function update(
  client: ApiClient,
  id: string,
  data: UpdateIntegrationRequest
): Promise<IntegrationResponse> {
  try {
    if (!id) throw new Error('Integration ID is required');

    // Validate update data
    updateIntegrationSchema.parse(data);

    const response = await client.put<ApiResponse<IntegrationResponse>>(
      `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}`,
      data
    );

    return response.data.data;
  } catch (error) {
    // Check for Zod validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      const zodError = error as { errors: Array<{ message: string }> };
      throw new Error(`Validation error: ${zodError.errors[0].message}`);
    }
    throw createApiError(error, 'Failed to update integration');
  }
}

/**
 * Delete integration configuration
 *
 * Permanently removes the integration from the system.
 * This operation cannot be undone.
 *
 * @param client - API client instance
 * @param id - Integration unique identifier
 * @returns Promise resolving to success message
 * @throws Error if ID is missing or deletion fails
 *
 * @example
 * ```typescript
 * const result = await deleteIntegration(client, 'uuid-123');
 * console.log(result.message); // "Integration deleted successfully"
 * ```
 */
export async function deleteIntegration(
  client: ApiClient,
  id: string
): Promise<{ message: string }> {
  try {
    if (!id) throw new Error('Integration ID is required');

    const response = await client.delete<ApiResponse<{ message: string }>>(
      `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}`
    );

    return response.data.data;
  } catch (error) {
    throw createApiError(error, 'Failed to delete integration');
  }
}
