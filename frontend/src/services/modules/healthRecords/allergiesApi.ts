/**
 * Allergies API Operations
 * 
 * Comprehensive allergy management operations:
 * - CRUD operations for allergies
 * - Critical allergies tracking
 * - Safety checks and alerts
 * - PHI access logging and compliance
 *
 * @module services/modules/healthRecords/allergiesApi
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../config/apiConfig';
import { z } from 'zod';
import type { ApiResponse } from '../../types';
import { auditService, AuditAction, AuditResourceType } from '../../audit';
import { createApiError, createValidationError } from '../../core/errors';
import type {
  Allergy,
  AllergyCreate,
  AllergyUpdate
} from './types';
import {
  allergyCreateSchema,
  allergyUpdateSchema
} from './schemas';

export class AllergiesApi {
  private readonly baseEndpoint = API_ENDPOINTS.HEALTH_RECORDS.BASE;

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
        `${this.baseEndpoint}/allergies/student/${studentId}`
      );

      await this.logPHIAccess(
        AuditAction.VIEW_ALLERGIES,
        studentId,
        AuditResourceType.ALLERGY
      );

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
        `${this.baseEndpoint}/allergies/${id}`
      );

      const allergy = response.data.data!;
      await this.logPHIAccess(
        AuditAction.VIEW_ALLERGY,
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
   * Create a new allergy record
   */
  async createAllergy(data: AllergyCreate): Promise<Allergy> {
    try {
      allergyCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<Allergy>>(
        `${this.baseEndpoint}/allergies`,
        data
      );

      const allergy = response.data.data!;
      await this.logPHIAccess(
        AuditAction.CREATE_ALLERGY,
        data.studentId,
        AuditResourceType.ALLERGY,
        allergy.id
      );

      return allergy;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err) => {
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
        `${this.baseEndpoint}/allergies/${id}`,
        data
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
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err) => {
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
      await this.client.delete(`${this.baseEndpoint}/allergies/${id}`);
      await this.logPHIAccess(
        AuditAction.DELETE_ALLERGY,
        allergy.studentId,
        AuditResourceType.ALLERGY,
        id
      );
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
        `${this.baseEndpoint}/allergies/student/${studentId}/critical`
      );

      await this.logPHIAccess(
        AuditAction.VIEW_CRITICAL_ALLERGIES,
        studentId,
        AuditResourceType.ALLERGY
      );

      return response.data.data!.allergies;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Verify an allergy (mark as medically verified)
   */
  async verifyAllergy(id: string, verifiedBy: string): Promise<Allergy> {
    try {
      const response = await this.client.post<ApiResponse<Allergy>>(
        `${this.baseEndpoint}/allergies/${id}/verify`,
        { verifiedBy }
      );

      const allergy = response.data.data!;
      await this.logPHIAccess(
        AuditAction.VERIFY_ALLERGY,
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
   * Mark an allergy as critical
   */
  async markCritical(id: string, isCritical: boolean): Promise<Allergy> {
    try {
      const response = await this.client.patch<ApiResponse<Allergy>>(
        `${this.baseEndpoint}/allergies/${id}/critical`,
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
   * Get allergy statistics for a student
   */
  async getAllergyStats(studentId: string): Promise<{
    total: number;
    critical: number;
    verified: number;
    unverified: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
  }> {
    try {
      const response = await this.client.get<ApiResponse<{
        total: number;
        critical: number;
        verified: number;
        unverified: number;
        byType: Record<string, number>;
        bySeverity: Record<string, number>;
      }>>(
        `${this.baseEndpoint}/allergies/student/${studentId}/stats`
      );

      await this.logPHIAccess(
        AuditAction.VIEW_ALLERGIES,
        studentId,
        AuditResourceType.ALLERGY
      );

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}
