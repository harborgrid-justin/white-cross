/**
 * Growth Measurements API Module
 *
 * Handles growth tracking operations including:
 * - CRUD operations for growth measurements
 * - Trend analysis
 * - BMI and percentile calculations
 *
 * @module services/modules/healthRecords/api/growthMeasurementsApi
 */

import type { ApiClient } from '../../../core/ApiClient';
import { API_ENDPOINTS } from '../../../config/apiConfig';
import { z, type ZodIssue } from 'zod';
import { ApiResponse } from '../../../types';
import { AuditAction, AuditResourceType } from '../../../audit';
import { createValidationError } from '../../../core/errors';
import { BaseHealthApi } from './baseHealthApi';
import type {
  GrowthMeasurement,
  GrowthMeasurementCreate,
  GrowthMeasurementUpdate,
  GrowthTrend,
} from '../types';
import { growthMeasurementCreateSchema } from '../validation/schemas';

/**
 * Growth Measurements API client
 * Manages student growth tracking
 */
export class GrowthMeasurementsApiClient extends BaseHealthApi {
  private readonly baseEndpoint = API_ENDPOINTS.HEALTH_RECORDS.BASE;

  constructor(client: ApiClient) {
    super(client);
  }

  /**
   * Get all growth measurements for a student
   *
   * @param studentId - The student ID
   * @returns List of growth measurements
   */
  async getGrowthMeasurements(studentId: string): Promise<GrowthMeasurement[]> {
    try {
      const response = await this.client.get<ApiResponse<{ measurements: GrowthMeasurement[] }>>(
        `${this.baseEndpoint}/growth/student/${studentId}`
      );

      await this.logPHIAccess(AuditAction.VIEW_GROWTH_MEASUREMENTS, studentId, AuditResourceType.GROWTH_MEASUREMENT);

      return response.data.data!.measurements;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single growth measurement by ID
   *
   * @param id - The measurement ID
   * @returns The growth measurement record
   */
  async getGrowthMeasurementById(id: string): Promise<GrowthMeasurement> {
    try {
      const response = await this.client.get<ApiResponse<GrowthMeasurement>>(
        `${this.baseEndpoint}/growth/${id}`
      );

      const measurement = response.data.data!;
      await this.logPHIAccess(AuditAction.VIEW_GROWTH_MEASUREMENT, measurement.studentId, AuditResourceType.GROWTH_MEASUREMENT, id);

      return measurement;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new growth measurement
   *
   * @param data - The measurement data
   * @returns The created growth measurement
   */
  async createGrowthMeasurement(data: GrowthMeasurementCreate): Promise<GrowthMeasurement> {
    try {
      growthMeasurementCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<GrowthMeasurement>>(
        `${this.baseEndpoint}/growth`,
        data
      );

      const measurement = response.data.data!;
      await this.logPHIAccess(AuditAction.CREATE_GROWTH_MEASUREMENT, data.studentId, AuditResourceType.GROWTH_MEASUREMENT, measurement.id);

      return measurement;
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
   * Update an existing growth measurement
   *
   * @param id - The measurement ID
   * @param data - The update data
   * @returns The updated growth measurement
   */
  async updateGrowthMeasurement(id: string, data: GrowthMeasurementUpdate): Promise<GrowthMeasurement> {
    try {
      const response = await this.client.put<ApiResponse<GrowthMeasurement>>(
        `${this.baseEndpoint}/growth/${id}`,
        data
      );

      const measurement = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_GROWTH_MEASUREMENT, measurement.studentId, AuditResourceType.GROWTH_MEASUREMENT, id);

      return measurement;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Delete a growth measurement
   *
   * @param id - The measurement ID
   */
  async deleteGrowthMeasurement(id: string): Promise<void> {
    try {
      const measurement = await this.getGrowthMeasurementById(id);
      await this.client.delete(`${this.baseEndpoint}/growth/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_GROWTH_MEASUREMENT, measurement.studentId, AuditResourceType.GROWTH_MEASUREMENT, id);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get growth trends for a student
   *
   * @param studentId - The student ID
   * @returns Growth trend analysis
   */
  async getGrowthTrends(studentId: string): Promise<GrowthTrend> {
    try {
      const response = await this.client.get<ApiResponse<GrowthTrend>>(
        `${this.baseEndpoint}/growth/student/${studentId}/trends`
      );

      await this.logPHIAccess(AuditAction.VIEW_GROWTH_TRENDS, studentId, AuditResourceType.GROWTH_MEASUREMENT);

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}
