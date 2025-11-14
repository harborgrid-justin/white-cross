/**
 * Health Records API - Growth Measurements Management
 * 
 * Comprehensive growth measurements management including:
 * - Growth measurement CRUD operations
 * - Growth trend analysis
 * - Percentile calculations
 * - Developmental milestone tracking
 * - PHI access logging for HIPAA compliance
 * 
 * @module services/modules/healthRecordsApi/growth
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
  GrowthMeasurement,
  GrowthMeasurementCreate,
  GrowthMeasurementUpdate,
  GrowthTrend
} from './types';

// Validation schemas
const growthMeasurementCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  measurementDate: z.string().min(1, 'Measurement date is required'),
  height: z.number().positive('Height must be positive').max(300, 'Height seems unrealistic').optional(),
  weight: z.number().positive('Weight must be positive').max(500, 'Weight seems unrealistic').optional(),
  headCircumference: z.number().positive().max(100, 'Head circumference seems unrealistic').optional(),
  measuredBy: z.string().min(1, 'Measured by is required').max(255),
  notes: z.string().max(2000).optional(),
});

const growthMeasurementUpdateSchema = z.object({
  measurementDate: z.string().optional(),
  height: z.number().positive().max(300).optional(),
  weight: z.number().positive().max(500).optional(),
  headCircumference: z.number().positive().max(100).optional(),
  measuredBy: z.string().min(1).max(255).optional(),
  notes: z.string().max(2000).optional(),
});

/**
 * Growth Measurements Management Service
 */
export class GrowthService {
  private readonly baseEndpoint = `${API_ENDPOINTS.HEALTH_RECORDS.BASE}/growth`;

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
   * Get all growth measurements for a student
   */
  async getGrowthMeasurements(studentId: string): Promise<GrowthMeasurement[]> {
    try {
      const response = await this.client.get<ApiResponse<{ measurements: GrowthMeasurement[] }>>(
        `${this.baseEndpoint}/student/${studentId}`
      );

      await this.logPHIAccess(AuditAction.VIEW_GROWTH_MEASUREMENTS, studentId, AuditResourceType.GROWTH_MEASUREMENT);

      return response.data.data!.measurements;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single growth measurement by ID
   */
  async getGrowthMeasurementById(id: string): Promise<GrowthMeasurement> {
    try {
      const response = await this.client.get<ApiResponse<GrowthMeasurement>>(
        `${this.baseEndpoint}/${id}`
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
   */
  async createGrowthMeasurement(data: GrowthMeasurementCreate): Promise<GrowthMeasurement> {
    try {
      growthMeasurementCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<GrowthMeasurement>>(
        this.baseEndpoint,
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
   */
  async updateGrowthMeasurement(id: string, data: GrowthMeasurementUpdate): Promise<GrowthMeasurement> {
    try {
      growthMeasurementUpdateSchema.parse(data);

      const response = await this.client.put<ApiResponse<GrowthMeasurement>>(
        `${this.baseEndpoint}/${id}`,
        data
      );

      const measurement = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_GROWTH_MEASUREMENT, measurement.studentId, AuditResourceType.GROWTH_MEASUREMENT, id);

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
   * Delete a growth measurement
   */
  async deleteGrowthMeasurement(id: string): Promise<void> {
    try {
      const measurement = await this.getGrowthMeasurementById(id);
      await this.client.delete(`${this.baseEndpoint}/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_GROWTH_MEASUREMENT, measurement.studentId, AuditResourceType.GROWTH_MEASUREMENT, id);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get growth trends for a student
   */
  async getGrowthTrends(studentId: string): Promise<GrowthTrend> {
    try {
      const response = await this.client.get<ApiResponse<GrowthTrend>>(
        `${this.baseEndpoint}/student/${studentId}/trends`
      );

      await this.logPHIAccess(AuditAction.VIEW_GROWTH_TRENDS, studentId, AuditResourceType.GROWTH_MEASUREMENT);

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get latest growth measurement for a student
   */
  async getLatestMeasurement(studentId: string): Promise<GrowthMeasurement | null> {
    try {
      const response = await this.client.get<ApiResponse<{ measurement: GrowthMeasurement | null }>>(
        `${this.baseEndpoint}/student/${studentId}/latest`
      );

      await this.logPHIAccess(AuditAction.VIEW_GROWTH_MEASUREMENTS, studentId, AuditResourceType.GROWTH_MEASUREMENT);

      return response.data.data!.measurement;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get growth chart data for visualization
   */
  async getGrowthChart(studentId: string, chartType: 'height' | 'weight' | 'bmi' | 'headCircumference'): Promise<{
    chartData: Array<{
      date: string;
      value: number;
      percentile?: number;
      ageInMonths: number;
    }>;
    referenceData: {
      percentiles: Array<{
        ageInMonths: number;
        p3: number;
        p5: number;
        p10: number;
        p25: number;
        p50: number;
        p75: number;
        p90: number;
        p95: number;
        p97: number;
      }>;
    };
    studentInfo: {
      dateOfBirth: string;
      gender: 'male' | 'female';
      currentAge: string;
    };
  }> {
    try {
      const response = await this.client.get<ApiResponse<{
        chartData: Array<{
          date: string;
          value: number;
          percentile?: number;
          ageInMonths: number;
        }>;
        referenceData: {
          percentiles: Array<{
            ageInMonths: number;
            p3: number;
            p5: number;
            p10: number;
            p25: number;
            p50: number;
            p75: number;
            p90: number;
            p95: number;
            p97: number;
          }>;
        };
        studentInfo: {
          dateOfBirth: string;
          gender: 'male' | 'female';
          currentAge: string;
        };
      }>>(
        `${this.baseEndpoint}/student/${studentId}/chart/${chartType}`
      );

      await this.logPHIAccess(AuditAction.VIEW_GROWTH_MEASUREMENTS, studentId, AuditResourceType.GROWTH_MEASUREMENT);

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Calculate BMI and percentiles for a measurement
   */
  async calculateBMI(studentId: string, height: number, weight: number, measurementDate: string): Promise<{
    bmi: number;
    bmiPercentile: number;
    bmiCategory: 'underweight' | 'healthy' | 'overweight' | 'obese';
    heightPercentile?: number;
    weightPercentile?: number;
  }> {
    try {
      const response = await this.client.post<ApiResponse<{
        bmi: number;
        bmiPercentile: number;
        bmiCategory: 'underweight' | 'healthy' | 'overweight' | 'obese';
        heightPercentile?: number;
        weightPercentile?: number;
      }>>(
        `${this.baseEndpoint}/student/${studentId}/calculate-bmi`,
        { height, weight, measurementDate }
      );

      await this.logPHIAccess(AuditAction.VIEW_GROWTH_MEASUREMENTS, studentId, AuditResourceType.GROWTH_MEASUREMENT);

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Generate growth report for a student
   */
  async generateReport(studentId: string, options: {
    dateFrom?: string;
    dateTo?: string;
    includeCharts?: boolean;
    format?: 'pdf' | 'json';
  } = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      if (options.dateFrom) params.append('dateFrom', options.dateFrom);
      if (options.dateTo) params.append('dateTo', options.dateTo);
      if (options.includeCharts) params.append('includeCharts', String(options.includeCharts));
      if (options.format) params.append('format', options.format);

      const response = await this.client.get<Blob>(
        `${this.baseEndpoint}/student/${studentId}/report?${params.toString()}`,
        { responseType: 'blob' }
      );

      await this.logPHIAccess(AuditAction.EXPORT_HEALTH_RECORDS, studentId, AuditResourceType.GROWTH_MEASUREMENT);

      return response.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get growth statistics for admin dashboard
   */
  async getStatistics(): Promise<{
    totalMeasurements: number;
    studentsWithMeasurements: number;
    averageAge: number;
    concerningTrends: number;
    recentMeasurements: number;
    percentileDistribution: {
      underweight: number;
      healthy: number;
      overweight: number;
      obese: number;
    };
    byGrade: Record<string, {
      count: number;
      averageHeight: number;
      averageWeight: number;
      averageBMI: number;
    }>;
  }> {
    try {
      const response = await this.client.get<ApiResponse<{
        totalMeasurements: number;
        studentsWithMeasurements: number;
        averageAge: number;
        concerningTrends: number;
        recentMeasurements: number;
        percentileDistribution: {
          underweight: number;
          healthy: number;
          overweight: number;
          obese: number;
        };
        byGrade: Record<string, {
          count: number;
          averageHeight: number;
          averageWeight: number;
          averageBMI: number;
        }>;
      }>>(
        `${this.baseEndpoint}/statistics`
      );

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get students with concerning growth patterns
   */
  async getConcerningGrowthPatterns(): Promise<Array<{
    student: { id: string; firstName: string; lastName: string; studentNumber: string };
    concerns: string[];
    lastMeasurement: {
      date: string;
      height?: number;
      weight?: number;
      bmi?: number;
      bmiPercentile?: number;
    };
    trends: {
      heightTrend: 'increasing' | 'stable' | 'decreasing';
      weightTrend: 'increasing' | 'stable' | 'decreasing';
      bmiTrend: 'increasing' | 'stable' | 'decreasing';
    };
    recommendations: string[];
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{ students: Array<{
        student: { id: string; firstName: string; lastName: string; studentNumber: string };
        concerns: string[];
        lastMeasurement: {
          date: string;
          height?: number;
          weight?: number;
          bmi?: number;
          bmiPercentile?: number;
        };
        trends: {
          heightTrend: 'increasing' | 'stable' | 'decreasing';
          weightTrend: 'increasing' | 'stable' | 'decreasing';
          bmiTrend: 'increasing' | 'stable' | 'decreasing';
        };
        recommendations: string[];
      }> }>>(
        `${this.baseEndpoint}/concerning-patterns`
      );

      return response.data.data!.students;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Bulk import growth measurements
   */
  async bulkImport(data: {
    measurements: Array<GrowthMeasurementCreate & { studentNumber?: string }>;
    validateOnly?: boolean;
    continueOnError?: boolean;
  }): Promise<{
    totalRecords: number;
    successCount: number;
    failureCount: number;
    errors: Array<{
      index: number;
      error: string;
      studentNumber?: string;
    }>;
    imported: GrowthMeasurement[];
  }> {
    try {
      const response = await this.client.post<ApiResponse<{
        totalRecords: number;
        successCount: number;
        failureCount: number;
        errors: Array<{
          index: number;
          error: string;
          studentNumber?: string;
        }>;
        imported: GrowthMeasurement[];
      }>>(
        `${this.baseEndpoint}/bulk-import`,
        data
      );

      const result = response.data.data!;

      // Log PHI access for each unique student
      const uniqueStudentIds = [...new Set(
        data.measurements
          .map(m => m.studentId)
          .filter(Boolean)
      )];
      await Promise.all(
        uniqueStudentIds.map(studentId =>
          this.logPHIAccess(AuditAction.CREATE_GROWTH_MEASUREMENT, studentId, AuditResourceType.GROWTH_MEASUREMENT)
        )
      );

      return result;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}

/**
 * Factory function to create GrowthService
 */
export function createGrowthService(client: ApiClient): GrowthService {
  return new GrowthService(client);
}
