/**
 * Allergies API Module
 *
 * Handles allergy management operations including:
 * - CRUD operations for allergy records
 * - Critical allergy tracking
 * - Safety checks and verification
 *
 * @module services/modules/healthRecords/api/allergiesApi
 */

import type { ApiClient } from '../../../core/ApiClient';
import { API_ENDPOINTS } from '../../../config/apiConfig';
import { z, type ZodIssue } from 'zod';
import { ApiResponse } from '../../../types';
import { AuditAction, AuditResourceType } from '../../../audit';
import { createValidationError } from '../../../core/errors';
import { BaseHealthApi } from './baseHealthApi';
import type {
  Allergy,
  AllergyCreate,
  AllergyUpdate,
} from '../types';
import { allergyCreateSchema } from '../validation/schemas';

/**
 * Allergies API client
 * Manages allergy records and safety tracking
 */
export class AllergiesApiClient extends BaseHealthApi {
  private readonly baseEndpoint = API_ENDPOINTS.HEALTH_RECORDS.BASE;

  constructor(client: ApiClient) {
    super(client);
  }

  /**
   * Get all allergies for a student
   *
   * @param studentId - The student ID
   * @returns List of allergies
   */
  async getAllergies(studentId: string): Promise<Allergy[]> {
    try {
      const response = await this.client.get<ApiResponse<{ allergies: Allergy[] }>>(
        `${this.baseEndpoint}/allergies/student/${studentId}`
      );

      await this.logPHIAccess(AuditAction.VIEW_ALLERGIES, studentId, AuditResourceType.ALLERGY);

      return response.data.data!.allergies;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single allergy by ID
   *
   * @param id - The allergy ID
   * @returns The allergy record
   */
  async getAllergyById(id: string): Promise<Allergy> {
    try {
      const response = await this.client.get<ApiResponse<Allergy>>(
        `${this.baseEndpoint}/allergies/${id}`
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
   *
   * @param data - The allergy data
   * @returns The created allergy record
   */
  async createAllergy(data: AllergyCreate): Promise<Allergy> {
    try {
      allergyCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<Allergy>>(
        `${this.baseEndpoint}/allergies`,
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
   *
   * @param id - The allergy ID
   * @param data - The update data
   * @returns The updated allergy record
   */
  async updateAllergy(id: string, data: AllergyUpdate): Promise<Allergy> {
    try {
      const response = await this.client.put<ApiResponse<Allergy>>(
        `${this.baseEndpoint}/allergies/${id}`,
        data
      );

      const allergy = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_ALLERGY, allergy.studentId, AuditResourceType.ALLERGY, id);

      return allergy;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete an allergy
   *
   * @param id - The allergy ID
   */
  async deleteAllergy(id: string): Promise<void> {
    try {
      const allergy = await this.getAllergyById(id);
      await this.client.delete(`${this.baseEndpoint}/allergies/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_ALLERGY, allergy.studentId, AuditResourceType.ALLERGY, id);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get critical/life-threatening allergies for a student
   *
   * @param studentId - The student ID
   * @returns List of critical allergies
   */
  async getCriticalAllergies(studentId: string): Promise<Allergy[]> {
    try {
      const response = await this.client.get<ApiResponse<{ allergies: Allergy[] }>>(
        `${this.baseEndpoint}/allergies/student/${studentId}/critical`
      );

      await this.logPHIAccess(AuditAction.VIEW_CRITICAL_ALLERGIES, studentId, AuditResourceType.ALLERGY);

      return response.data.data!.allergies;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}
