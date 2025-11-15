/**
 * MIGRATION STATUS: DEPRECATED - SCHEDULED FOR REMOVAL IN v2.0.0
 *
 * Screenings, Growth & Vital Signs API Operations
 *
 * DEPRECATION TIMELINE:
 * - Deprecated: v1.5.0 (Current)
 * - Removal: v2.0.0 (Planned Q2 2025)
 *
 * REPLACEMENT: @/lib/actions/health-records.crud
 *
 * MIGRATION GUIDE:
 * OLD: screeningsApi.create(data), growthApi.create(data), vitalsApi.create(data)
 * NEW: Available in health-records.crud module with appropriate type filters
 *
 * OLD: screeningsApi.getScreenings(studentId)
 * NEW: Use health-records.crud actions with screening type filters
 *
 * @deprecated Use Server Actions from @/lib/actions/health-records.crud instead. Will be removed in v2.0.0
 * @see {@link /lib/actions/health-records.crud.ts}
 * @see {@link /lib/actions/health-records.actions.ts}
 * @see {@link ../healthRecordsApi.ts} - Detailed migration guide
 * @module services/modules/healthRecords/screeningsGrowthVitalsApi
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../config/apiConfig';
import { z } from 'zod';
import type { ApiResponse } from '../../types';
import { auditService, AuditAction, AuditResourceType } from '../../audit';
import { createApiError, createValidationError } from '../../core/errors';
import type {
  Screening,
  ScreeningCreate,
  ScreeningUpdate,
  ScreeningsDueItem,
  GrowthMeasurement,
  GrowthMeasurementCreate,
  GrowthMeasurementUpdate,
  GrowthTrend,
  VitalSigns,
  VitalSignsCreate,
  VitalSignsUpdate,
  VitalSignsTrend,
  VitalSignsFilters
} from './types';
import {
  screeningCreateSchema,
  screeningUpdateSchema,
  growthMeasurementCreateSchema,
  growthMeasurementUpdateSchema,
  vitalSignsCreateSchema,
  vitalSignsUpdateSchema
} from './schemas';

export class ScreeningsGrowthVitalsApi {
  private readonly baseEndpoint = API_ENDPOINTS.HEALTH_RECORDS.BASE;

  constructor(private readonly client: ApiClient) {}

  private async logPHIAccess(
    action: AuditAction,
    studentId: string,
    resourceType: AuditResourceType,
    resourceId?: string
  ): Promise<void> {
    try {
      await auditService.logPHIAccess(action, studentId, resourceType, resourceId);
    } catch (error) {
      console.error('Failed to log PHI access:', error);
    }
  }

  private sanitizeError(error: unknown): Error {
    return createApiError(error, 'An error occurred');
  }

  // ==========================================
  // SCREENINGS OPERATIONS
  // ==========================================

  async getScreenings(studentId: string): Promise<Screening[]> {
    try {
      const response = await this.client.get<ApiResponse<{ screenings: Screening[] }>>(
        `${this.baseEndpoint}/screenings/student/${studentId}`
      );

      await this.logPHIAccess(
        AuditAction.VIEW_SCREENINGS,
        studentId,
        AuditResourceType.SCREENING
      );

      return response.data.data!.screenings;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  async getScreeningById(id: string): Promise<Screening> {
    try {
      const response = await this.client.get<ApiResponse<Screening>>(
        `${this.baseEndpoint}/screenings/${id}`
      );

      const screening = response.data.data!;
      await this.logPHIAccess(
        AuditAction.VIEW_SCREENING,
        screening.studentId,
        AuditResourceType.SCREENING,
        id
      );

      return screening;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  async createScreening(data: ScreeningCreate): Promise<Screening> {
    try {
      screeningCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<Screening>>(
        `${this.baseEndpoint}/screenings`,
        data
      );

      const screening = response.data.data!;
      await this.logPHIAccess(
        AuditAction.CREATE_SCREENING,
        data.studentId,
        AuditResourceType.SCREENING,
        screening.id
      );

      return screening;
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

  async updateScreening(id: string, data: ScreeningUpdate): Promise<Screening> {
    try {
      screeningUpdateSchema.parse(data);

      const response = await this.client.put<ApiResponse<Screening>>(
        `${this.baseEndpoint}/screenings/${id}`,
        data
      );

      const screening = response.data.data!;
      await this.logPHIAccess(
        AuditAction.UPDATE_SCREENING,
        screening.studentId,
        AuditResourceType.SCREENING,
        id
      );

      return screening;
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

  async deleteScreening(id: string): Promise<void> {
    try {
      const screening = await this.getScreeningById(id);
      await this.client.delete(`${this.baseEndpoint}/screenings/${id}`);
      await this.logPHIAccess(
        AuditAction.DELETE_SCREENING,
        screening.studentId,
        AuditResourceType.SCREENING,
        id
      );
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  async getScreeningsDue(): Promise<ScreeningsDueItem[]> {
    try {
      const response = await this.client.get<ApiResponse<{ screenings: ScreeningsDueItem[] }>>(
        `${this.baseEndpoint}/screenings/due`
      );

      return response.data.data!.screenings;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  // ==========================================
  // GROWTH MEASUREMENTS OPERATIONS
  // ==========================================

  async getGrowthMeasurements(studentId: string): Promise<GrowthMeasurement[]> {
    try {
      const response = await this.client.get<ApiResponse<{ measurements: GrowthMeasurement[] }>>(
        `${this.baseEndpoint}/growth/student/${studentId}`
      );

      await this.logPHIAccess(
        AuditAction.VIEW_GROWTH_MEASUREMENTS,
        studentId,
        AuditResourceType.GROWTH_MEASUREMENT
      );

      return response.data.data!.measurements;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  async getGrowthMeasurementById(id: string): Promise<GrowthMeasurement> {
    try {
      const response = await this.client.get<ApiResponse<GrowthMeasurement>>(
        `${this.baseEndpoint}/growth/${id}`
      );

      const measurement = response.data.data!;
      await this.logPHIAccess(
        AuditAction.VIEW_GROWTH_MEASUREMENT,
        measurement.studentId,
        AuditResourceType.GROWTH_MEASUREMENT,
        id
      );

      return measurement;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  async createGrowthMeasurement(data: GrowthMeasurementCreate): Promise<GrowthMeasurement> {
    try {
      growthMeasurementCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<GrowthMeasurement>>(
        `${this.baseEndpoint}/growth`,
        data
      );

      const measurement = response.data.data!;
      await this.logPHIAccess(
        AuditAction.CREATE_GROWTH_MEASUREMENT,
        data.studentId,
        AuditResourceType.GROWTH_MEASUREMENT,
        measurement.id
      );

      return measurement;
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

  async updateGrowthMeasurement(id: string, data: GrowthMeasurementUpdate): Promise<GrowthMeasurement> {
    try {
      growthMeasurementUpdateSchema.parse(data);

      const response = await this.client.put<ApiResponse<GrowthMeasurement>>(
        `${this.baseEndpoint}/growth/${id}`,
        data
      );

      const measurement = response.data.data!;
      await this.logPHIAccess(
        AuditAction.UPDATE_GROWTH_MEASUREMENT,
        measurement.studentId,
        AuditResourceType.GROWTH_MEASUREMENT,
        id
      );

      return measurement;
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

  async deleteGrowthMeasurement(id: string): Promise<void> {
    try {
      const measurement = await this.getGrowthMeasurementById(id);
      await this.client.delete(`${this.baseEndpoint}/growth/${id}`);
      await this.logPHIAccess(
        AuditAction.DELETE_GROWTH_MEASUREMENT,
        measurement.studentId,
        AuditResourceType.GROWTH_MEASUREMENT,
        id
      );
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  async getGrowthTrends(studentId: string): Promise<GrowthTrend> {
    try {
      const response = await this.client.get<ApiResponse<GrowthTrend>>(
        `${this.baseEndpoint}/growth/student/${studentId}/trends`
      );

      await this.logPHIAccess(
        AuditAction.VIEW_GROWTH_TRENDS,
        studentId,
        AuditResourceType.GROWTH_MEASUREMENT
      );

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  // ==========================================
  // VITAL SIGNS OPERATIONS
  // ==========================================

  async getVitalSigns(studentId: string, filters?: VitalSignsFilters): Promise<VitalSigns[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await this.client.get<ApiResponse<{ vitals: VitalSigns[] }>>(
        `${this.baseEndpoint}/vitals/student/${studentId}?${params.toString()}`
      );

      await this.logPHIAccess(
        AuditAction.VIEW_VITAL_SIGNS,
        studentId,
        AuditResourceType.VITAL_SIGNS
      );

      return response.data.data!.vitals;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  async getVitalSignsById(id: string): Promise<VitalSigns> {
    try {
      const response = await this.client.get<ApiResponse<VitalSigns>>(
        `${this.baseEndpoint}/vitals/${id}`
      );

      const vitals = response.data.data!;
      await this.logPHIAccess(
        AuditAction.VIEW_VITAL_SIGNS,
        vitals.studentId,
        AuditResourceType.VITAL_SIGNS,
        id
      );

      return vitals;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  async createVitalSigns(data: VitalSignsCreate): Promise<VitalSigns> {
    try {
      vitalSignsCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<VitalSigns>>(
        `${this.baseEndpoint}/vitals`,
        data
      );

      const vitals = response.data.data!;
      await this.logPHIAccess(
        AuditAction.CREATE_VITAL_SIGNS,
        data.studentId,
        AuditResourceType.VITAL_SIGNS,
        vitals.id
      );

      return vitals;
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

  async updateVitalSigns(id: string, data: VitalSignsUpdate): Promise<VitalSigns> {
    try {
      vitalSignsUpdateSchema.parse(data);

      const response = await this.client.put<ApiResponse<VitalSigns>>(
        `${this.baseEndpoint}/vitals/${id}`,
        data
      );

      const vitals = response.data.data!;
      await this.logPHIAccess(
        AuditAction.UPDATE_VITAL_SIGNS,
        vitals.studentId,
        AuditResourceType.VITAL_SIGNS,
        id
      );

      return vitals;
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

  async deleteVitalSigns(id: string): Promise<void> {
    try {
      const vitals = await this.getVitalSignsById(id);
      await this.client.delete(`${this.baseEndpoint}/vitals/${id}`);
      await this.logPHIAccess(
        AuditAction.DELETE_VITAL_SIGNS,
        vitals.studentId,
        AuditResourceType.VITAL_SIGNS,
        id
      );
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  async getVitalTrends(
    studentId: string,
    vitalType: 'temperature' | 'bloodPressure' | 'heartRate' | 'respiratoryRate' | 'oxygenSaturation',
    dateFrom?: string,
    dateTo?: string
  ): Promise<VitalSignsTrend> {
    try {
      const params = new URLSearchParams();
      params.append('type', vitalType);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const response = await this.client.get<ApiResponse<VitalSignsTrend>>(
        `${this.baseEndpoint}/vitals/student/${studentId}/trends?${params.toString()}`
      );

      await this.logPHIAccess(
        AuditAction.VIEW_VITAL_TRENDS,
        studentId,
        AuditResourceType.VITAL_SIGNS
      );

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}
