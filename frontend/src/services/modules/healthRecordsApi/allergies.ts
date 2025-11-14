/**
 * Health Records API - Allergies Management
 * 
 * Comprehensive allergies management including:
 * - Allergy CRUD operations
 * - Critical allergies identification
 * - Safety checks and verification
 * - PHI access logging for HIPAA compliance
 * 
 * @module services/modules/healthRecordsApi/allergies
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../config/apiConfig';
import { z, type ZodIssue } from 'zod';
import {
  ApiResponse,
} from '../../types';
import { auditService, AuditAction, AuditResourceType } from '../../audit';
import { createApiError, createValidationError } from '../../core/errors';
import type {
  Allergy,
  AllergyCreate,
  AllergyUpdate,
  AllergySeverity
} from './types';
import {
  AllergyType,
  AllergySeverity as AllergySeverityEnum
} from './types';

// Validation schemas
const allergyCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  allergen: z.string().min(1, 'Allergen is required').max(255),
  allergyType: z.nativeEnum(AllergyType),
  severity: z.nativeEnum(AllergySeverityEnum),
  reaction: z.string().max(1000).optional(),
  symptoms: z.array(z.string()).optional(),
  treatment: z.string().max(1000).optional(),
  onsetDate: z.string().optional(),
  diagnosedBy: z.string().max(255).optional(),
  verified: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  notes: z.string().max(2000).optional(),
});

const allergyUpdateSchema = z.object({
  allergen: z.string().min(1).max(255).optional(),
  allergyType: z.nativeEnum(AllergyType).optional(),
  severity: z.nativeEnum(AllergySeverityEnum).optional(),
  reaction: z.string().max(1000).optional(),
  symptoms: z.array(z.string()).optional(),
  treatment: z.string().max(1000).optional(),
  onsetDate: z.string().optional(),
  diagnosedBy: z.string().max(255).optional(),
  verified: z.boolean().optional(),
  isCritical: z.boolean().optional(),
  notes: z.string().max(2000).optional(),
});

/**
 * Allergies Management Service
 */
export class AllergiesService {
  private readonly baseEndpoint = `${API_ENDPOINTS.HEALTH_RECORDS.BASE}/allergies`;

  constructor(private readonly client: ApiClient) {}

  /**
   * Log PHI access for HIPAA compliance
   */
  private async logPHIAccess(
    action: AuditAction,
    studentId: string,
    resourceType: AuditResourceType,
    resourceId?: string
  ): Promise<void> {
    try {
      await auditService.logPHIAccess(action, studentId, resourceType, resourceId);
    } catch (error) {
      // Never fail main operation due to audit logging
      console.error('Failed to log PHI access:', error);
    }
  }

  /**
   * Sanitize error messages to prevent PHI exposure
   */
  private sanitizeError(error: unknown): Error {
    return createApiError(error, 'An error occurred');
  }

  /**
   * Get all allergies for a student
   */
  async getAllergies(studentId: string): Promise<Allergy[]> {
    try {
      const response = await this.client.get<ApiResponse<{ allergies: Allergy[] }>>(
        `${this.baseEndpoint}/student/${studentId}`
      );

      await this.logPHIAccess(AuditAction.VIEW_ALLERGIES, studentId, AuditResourceType.ALLERGY);

      return response.data.data!.allergies;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single allergy by ID
   */
  async getAllergyById(id: string): Promise<Allergy> {
    try {
      const response = await this.client.get<ApiResponse<Allergy>>(
        `${this.baseEndpoint}/${id}`
      );

      const allergy = response.data.data!;
      await this.logPHIAccess(AuditAction.VIEW_ALLERGY, allergy.studentId, AuditResourceType.ALLERGY, id);

      return allergy;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new allergy record
   */
  async createAllergy(data: AllergyCreate): Promise<Allergy> {
    try {
      allergyCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<Allergy>>(
        this.baseEndpoint,
        data
      );

      const allergy = response.data.data!;
      await this.logPHIAccess(AuditAction.CREATE_ALLERGY, data.studentId, AuditResourceType.ALLERGY, allergy.id);

      return allergy;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update an existing allergy
   */
  async updateAllergy(id: string, data: AllergyUpdate): Promise<Allergy> {
    try {
      allergyUpdateSchema.parse(data);

      const response = await this.client.put<ApiResponse<Allergy>>(
        `${this.baseEndpoint}/${id}`,
        data
      );

      const allergy = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_ALLERGY, allergy.studentId, AuditResourceType.ALLERGY, id);

      return allergy;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete an allergy
   */
  async deleteAllergy(id: string): Promise<void> {
    try {
      const allergy = await this.getAllergyById(id);
      await this.client.delete(`${this.baseEndpoint}/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_ALLERGY, allergy.studentId, AuditResourceType.ALLERGY, id);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get critical/life-threatening allergies for a student
   */
  async getCriticalAllergies(studentId: string): Promise<Allergy[]> {
    try {
      const response = await this.client.get<ApiResponse<{ allergies: Allergy[] }>>(
        `${this.baseEndpoint}/student/${studentId}/critical`
      );

      await this.logPHIAccess(AuditAction.VIEW_CRITICAL_ALLERGIES, studentId, AuditResourceType.ALLERGY);

      return response.data.data!.allergies;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Verify an allergy record
   */
  async verifyAllergy(id: string, verifiedBy?: string): Promise<Allergy> {
    try {
      const response = await this.client.post<ApiResponse<Allergy>>(
        `${this.baseEndpoint}/${id}/verify`,
        { verifiedBy }
      );

      const allergy = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_ALLERGY, allergy.studentId, AuditResourceType.ALLERGY, id);

      return allergy;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Mark an allergy as critical
   */
  async markAsCritical(id: string, isCritical: boolean): Promise<Allergy> {
    try {
      const response = await this.client.patch<ApiResponse<Allergy>>(
        `${this.baseEndpoint}/${id}/critical`,
        { isCritical }
      );

      const allergy = response.data.data!;
      await this.logPHIAccess(
        AuditAction.UPDATE_ALLERGY,
        allergy.studentId,
        AuditResourceType.ALLERGY,
        id
      );

      return allergy;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Check for drug interactions with known allergies
   */
  async checkDrugInteractions(studentId: string, medications: string[]): Promise<{
    hasInteractions: boolean;
    interactions: Array<{
      allergen: string;
      medication: string;
      severity: AllergySeverity;
      warning: string;
    }>;
  }> {
    try {
      const response = await this.client.post<ApiResponse<{
        hasInteractions: boolean;
        interactions: Array<{
          allergen: string;
          medication: string;
          severity: AllergySeverity;
          warning: string;
        }>;
      }>>(
        `${this.baseEndpoint}/student/${studentId}/check-interactions`,
        { medications }
      );

      await this.logPHIAccess(AuditAction.VIEW_ALLERGIES, studentId, AuditResourceType.ALLERGY);

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}

/**
 * Factory function to create AllergiesService
 */
export function createAllergiesService(client: ApiClient): AllergiesService {
  return new AllergiesService(client);
}
