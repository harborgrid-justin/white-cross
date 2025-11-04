/**
 * @fileoverview Message Templates API Service - Communication template management
 * @module services/modules/communications/templatesApi
 * @version 2.0.0
 * @category Services
 *
 * Provides message template management for standardized communications.
 * Supports variable substitution, category-based organization, and usage tracking.
 *
 * ## Key Features
 *
 * **Template Management** (7 methods):
 * - Pre-defined templates for common communications
 * - Variable substitution support
 * - Category-based organization (appointment, medication, incident, etc.)
 * - Template usage tracking
 * - Active/inactive status management
 *
 * @example
 * ```typescript
 * // Create appointment reminder template
 * const template = await templatesApi.createTemplate({
 *   name: 'Appointment Reminder',
 *   subject: 'Upcoming Appointment for {{studentName}}',
 *   body: 'Your child {{studentName}} has an appointment on {{appointmentDate}}.',
 *   category: 'APPOINTMENT'
 * });
 * ```
 */

import type { ApiClient, ApiResponse, PaginatedResponse } from '../../core/ApiClient';
import { buildUrlParams } from '../../utils/apiUtils';
import { z } from 'zod';
import { createApiError, createValidationError } from '../../core/errors';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export type TemplateCategory = 'APPOINTMENT' | 'MEDICATION' | 'INCIDENT' | 'GENERAL' | 'EMERGENCY';

export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[]; // e.g., ['studentName', 'appointmentDate']
  category: TemplateCategory;
  isActive: boolean;
  usageCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateRequest {
  name: string;
  subject: string;
  body: string;
  category: TemplateCategory;
  isActive?: boolean;
}

export interface UpdateTemplateRequest {
  name?: string;
  subject?: string;
  body?: string;
  category?: TemplateCategory;
  isActive?: boolean;
}

export interface TemplateFilters extends Record<string, unknown> {
  category?: TemplateCategory;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Template body is required'),
  category: z.enum(['APPOINTMENT', 'MEDICATION', 'INCIDENT', 'GENERAL', 'EMERGENCY']),
});

// ==========================================
// TEMPLATES API SERVICE
// ==========================================

/**
 * Message Templates API Service
 *
 * Provides comprehensive template management including creation, updating,
 * categorization, and usage tracking.
 */
export class TemplatesApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get all message templates
   * @endpoint GET /communications/templates
   */
  async getTemplates(filters?: TemplateFilters): Promise<PaginatedResponse<MessageTemplate>> {
    try {
      const params = filters ? buildUrlParams(filters) : '';
      const response = await this.client.get<PaginatedResponse<MessageTemplate>>(
        `/communications/templates${params ? `?${params}` : ''}`
      );
      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch templates');
    }
  }

  /**
   * Get single template by ID
   * @endpoint GET /communications/templates/{id}
   */
  async getTemplate(id: string): Promise<MessageTemplate> {
    try {
      const response = await this.client.get<ApiResponse<MessageTemplate>>(
        `/communications/templates/${id}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch template');
    }
  }

  /**
   * Create message template
   * @endpoint POST /communications/templates
   */
  async createTemplate(data: CreateTemplateRequest): Promise<MessageTemplate> {
    try {
      templateSchema.parse(data);
      const response = await this.client.post<ApiResponse<MessageTemplate>>(
        '/communications/templates',
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError('Template validation failed', 'template', {}, error);
      }
      throw createApiError(error, 'Failed to create template');
    }
  }

  /**
   * Update message template
   * @endpoint PUT /communications/templates/{id}
   */
  async updateTemplate(id: string, data: UpdateTemplateRequest): Promise<MessageTemplate> {
    try {
      const response = await this.client.put<ApiResponse<MessageTemplate>>(
        `/communications/templates/${id}`,
        data
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update template');
    }
  }

  /**
   * Delete message template
   * @endpoint DELETE /communications/templates/{id}
   */
  async deleteTemplate(id: string): Promise<void> {
    try {
      await this.client.delete(`/communications/templates/${id}`);
    } catch (error) {
      throw createApiError(error, 'Failed to delete template');
    }
  }

  /**
   * Get templates by category
   * @helper Convenience filter method
   */
  async getTemplatesByCategory(category: TemplateCategory): Promise<PaginatedResponse<MessageTemplate>> {
    return this.getTemplates({ category });
  }

  /**
   * Get active templates only
   * @helper Convenience filter method
   */
  async getActiveTemplates(): Promise<PaginatedResponse<MessageTemplate>> {
    return this.getTemplates({ isActive: true });
  }
}

/**
 * Factory function to create Templates API instance
 */
export function createTemplatesApi(client: ApiClient): TemplatesApi {
  return new TemplatesApi(client);
}
