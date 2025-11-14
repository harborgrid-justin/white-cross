/**
 * Vaccinations API Module
 *
 * Handles vaccination management including:
 * - CRUD operations for vaccination records
 * - Compliance tracking
 * - Due date monitoring
 *
 * @module services/modules/healthRecords/api/vaccinationsApi
 */

import type { ApiClient } from '../../../core/ApiClient';
import { API_ENDPOINTS } from '../../../config/apiConfig';
import { z, type ZodIssue } from 'zod';
import { ApiResponse } from '../../../types';
import { AuditAction, AuditResourceType } from '../../../audit';
import { createValidationError } from '../../../core/errors';
import { BaseHealthApi } from './baseHealthApi';
import type {
  Vaccination,
  VaccinationCreate,
  VaccinationUpdate,
  VaccinationCompliance,
} from '../types';
import { vaccinationCreateSchema } from '../validation/schemas';

/**
 * Vaccinations API client
 * Manages vaccination records and compliance
 */
export class VaccinationsApiClient extends BaseHealthApi {
  private readonly baseEndpoint = API_ENDPOINTS.HEALTH_RECORDS.BASE;

  constructor(client: ApiClient) {
    super(client);
  }

  /**
   * Get all vaccinations for a student
   *
   * @param studentId - The student ID
   * @returns List of vaccinations
   */
  async getVaccinations(studentId: string): Promise<Vaccination[]> {
    try {
      const response = await this.client.get<ApiResponse<{ vaccinations: Vaccination[] }>>(
        `${this.baseEndpoint}/vaccinations/student/${studentId}`
      );

      await this.logPHIAccess(AuditAction.VIEW_VACCINATIONS, studentId, AuditResourceType.VACCINATION);

      return response.data.data!.vaccinations;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single vaccination by ID
   *
   * @param id - The vaccination ID
   * @returns The vaccination record
   */
  async getVaccinationById(id: string): Promise<Vaccination> {
    try {
      const response = await this.client.get<ApiResponse<Vaccination>>(
        `${this.baseEndpoint}/vaccinations/${id}`
      );

      const vaccination = response.data.data!;
      await this.logPHIAccess(AuditAction.VIEW_VACCINATION, vaccination.studentId, AuditResourceType.VACCINATION, id);

      return vaccination;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new vaccination record
   *
   * @param data - The vaccination data
   * @returns The created vaccination record
   */
  async createVaccination(data: VaccinationCreate): Promise<Vaccination> {
    try {
      vaccinationCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<Vaccination>>(
        `${this.baseEndpoint}/vaccinations`,
        data
      );

      const vaccination = response.data.data!;
      await this.logPHIAccess(AuditAction.CREATE_VACCINATION, data.studentId, AuditResourceType.VACCINATION, vaccination.id);

      return vaccination;
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
   * Update an existing vaccination
   *
   * @param id - The vaccination ID
   * @param data - The update data
   * @returns The updated vaccination record
   */
  async updateVaccination(id: string, data: VaccinationUpdate): Promise<Vaccination> {
    try {
      const response = await this.client.put<ApiResponse<Vaccination>>(
        `${this.baseEndpoint}/vaccinations/${id}`,
        data
      );

      const vaccination = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_VACCINATION, vaccination.studentId, AuditResourceType.VACCINATION, id);

      return vaccination;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete a vaccination record
   *
   * @param id - The vaccination ID
   */
  async deleteVaccination(id: string): Promise<void> {
    try {
      const vaccination = await this.getVaccinationById(id);
      await this.client.delete(`${this.baseEndpoint}/vaccinations/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_VACCINATION, vaccination.studentId, AuditResourceType.VACCINATION, id);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Check vaccination compliance for a student
   *
   * @param studentId - The student ID
   * @returns Vaccination compliance information
   */
  async checkCompliance(studentId: string): Promise<VaccinationCompliance> {
    try {
      const response = await this.client.get<ApiResponse<VaccinationCompliance>>(
        `${this.baseEndpoint}/vaccinations/student/${studentId}/compliance`
      );

      await this.logPHIAccess(AuditAction.CHECK_VACCINATION_COMPLIANCE, studentId, AuditResourceType.VACCINATION);

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}
