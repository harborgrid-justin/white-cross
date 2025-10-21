/**
 * Growth Measurements API Service Module
 *
 * Purpose: Tracks student growth metrics and developmental milestones
 *
 * Features:
 * - Height, weight, BMI tracking
 * - Growth chart generation (CDC/WHO standards)
 * - Percentile calculations
 * - Growth trend analysis
 * - Developmental milestone tracking
 *
 * @module services/modules/health/growthMeasurements
 */

import { apiInstance, API_ENDPOINTS } from '../../config/apiConfig';
import { z } from 'zod';
import { BaseApiService } from '../../core/BaseApiService';
import { ApiClient } from '../../core/ApiClient';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../../types';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface GrowthMeasurement {
  id: string;
  studentId: string;
  measurementDate: string;
  height: number;
  heightUnit: HeightUnit;
  weight: number;
  weightUnit: WeightUnit;
  bmi?: number;
  bmiPercentile?: number;
  bmiCategory?: BMICategory;
  heightPercentile?: number;
  weightPercentile?: number;
  headCircumference?: number;
  headCircumferenceUnit?: HeadUnit;
  headCircumferencePercentile?: number;
  measurementType: MeasurementType;
  measuredBy: string;
  location?: string;
  notes?: string;
  flaggedForReview?: boolean;
  reviewReason?: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'M' | 'F';
    age: number;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type HeightUnit = 'CM' | 'IN';
export type WeightUnit = 'KG' | 'LB';
export type HeadUnit = 'CM' | 'IN';
export type MeasurementType = 'ROUTINE' | 'SPORTS_PHYSICAL' | 'HEALTH_CHECK' | 'OTHER';
export type BMICategory = 'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE';
export type GrowthStandard = 'CDC' | 'WHO';

export interface GrowthMeasurementCreate {
  studentId: string;
  measurementDate: string;
  height: number;
  heightUnit: HeightUnit;
  weight: number;
  weightUnit: WeightUnit;
  headCircumference?: number;
  headCircumferenceUnit?: HeadUnit;
  measurementType: MeasurementType;
  measuredBy: string;
  location?: string;
  notes?: string;
}

export interface GrowthMeasurementUpdate extends Partial<GrowthMeasurementCreate> {
  flaggedForReview?: boolean;
  reviewReason?: string;
}

export interface GrowthMeasurementFilters extends PaginationParams {
  measurementType?: MeasurementType;
  dateFrom?: string;
  dateTo?: string;
  flaggedForReview?: boolean;
  search?: string;
}

export interface GrowthTrend {
  studentId: string;
  measurements: Array<{
    date: string;
    height: number;
    weight: number;
    bmi: number;
    heightPercentile: number;
    weightPercentile: number;
    bmiPercentile: number;
  }>;
  currentStatus: {
    bmiCategory: BMICategory;
    heightPercentile: number;
    weightPercentile: number;
    bmiPercentile: number;
    growthVelocity?: number;
  };
  alerts: Array<{
    type: 'RAPID_GAIN' | 'RAPID_LOSS' | 'PLATEAU' | 'PERCENTILE_CROSSING';
    message: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
  }>;
}

export interface GrowthChart {
  studentId: string;
  chartType: 'HEIGHT' | 'WEIGHT' | 'BMI' | 'HEAD_CIRCUMFERENCE';
  standard: GrowthStandard;
  data: Array<{
    x: number; // age in months
    y: number; // measurement value
    percentile?: number;
  }>;
  percentileLines: {
    p3: number[];
    p5: number[];
    p10: number[];
    p25: number[];
    p50: number[];
    p75: number[];
    p90: number[];
    p95: number[];
    p97: number[];
  };
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const growthMeasurementCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  measurementDate: z.string().datetime(),
  height: z.number().positive('Height must be positive'),
  heightUnit: z.enum(['CM', 'IN']),
  weight: z.number().positive('Weight must be positive'),
  weightUnit: z.enum(['KG', 'LB']),
  headCircumference: z.number().positive().optional(),
  headCircumferenceUnit: z.enum(['CM', 'IN']).optional(),
  measurementType: z.enum(['ROUTINE', 'SPORTS_PHYSICAL', 'HEALTH_CHECK', 'OTHER']),
  measuredBy: z.string().min(1, 'Measurer name is required').max(100),
  location: z.string().max(100).optional(),
  notes: z.string().max(500).optional()
});

const growthMeasurementUpdateSchema = growthMeasurementCreateSchema.partial().extend({
  flaggedForReview: z.boolean().optional(),
  reviewReason: z.string().max(500).optional()
});

// ==========================================
// API SERVICE CLASS
// ==========================================

export class GrowthMeasurementsApiService extends BaseApiService<
  GrowthMeasurement,
  GrowthMeasurementCreate,
  GrowthMeasurementUpdate
> {
  constructor() {
    const client = new ApiClient(apiInstance);
    super(client, `${API_ENDPOINTS.HEALTH_RECORDS}/growth`, {
      createSchema: growthMeasurementCreateSchema,
      updateSchema: growthMeasurementUpdateSchema
    });
  }

  /**
   * Get growth measurements for a specific student
   */
  async getStudentMeasurements(
    studentId: string,
    filters?: Omit<GrowthMeasurementFilters, 'page' | 'limit'>
  ): Promise<GrowthMeasurement[]> {
    this.validateId(studentId);

    const params = this.buildQueryParams({
      ...filters,
      studentId
    });

    const response = await this.client.get<ApiResponse<GrowthMeasurement[]>>(
      `${this.baseEndpoint}/student/${studentId}${params}`
    );

    await this.logPHIAccess('VIEW_GROWTH_MEASUREMENTS', studentId);
    return this.extractData(response);
  }

  /**
   * Get latest measurement for student
   */
  async getLatestMeasurement(studentId: string): Promise<GrowthMeasurement | null> {
    this.validateId(studentId);

    const response = await this.client.get<ApiResponse<GrowthMeasurement | null>>(
      `${this.baseEndpoint}/student/${studentId}/latest`
    );

    await this.logPHIAccess('VIEW_LATEST_MEASUREMENT', studentId);
    return this.extractData(response);
  }

  /**
   * Get growth trend analysis
   */
  async getGrowthTrend(
    studentId: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<GrowthTrend> {
    this.validateId(studentId);

    const params = this.buildQueryParams({
      dateFrom,
      dateTo
    });

    const response = await this.client.get<ApiResponse<GrowthTrend>>(
      `${this.baseEndpoint}/student/${studentId}/trend${params}`
    );

    await this.logPHIAccess('VIEW_GROWTH_TREND', studentId);
    return this.extractData(response);
  }

  /**
   * Get growth chart data
   */
  async getGrowthChart(
    studentId: string,
    chartType: 'HEIGHT' | 'WEIGHT' | 'BMI' | 'HEAD_CIRCUMFERENCE',
    standard: GrowthStandard = 'CDC'
  ): Promise<GrowthChart> {
    this.validateId(studentId);

    const params = this.buildQueryParams({
      chartType,
      standard
    });

    const response = await this.client.get<ApiResponse<GrowthChart>>(
      `${this.baseEndpoint}/student/${studentId}/chart${params}`
    );

    await this.logPHIAccess('VIEW_GROWTH_CHART', studentId);
    return this.extractData(response);
  }

  /**
   * Calculate percentiles for a measurement
   */
  async calculatePercentiles(
    measurement: {
      dateOfBirth: string;
      gender: 'M' | 'F';
      measurementDate: string;
      height: number;
      heightUnit: HeightUnit;
      weight: number;
      weightUnit: WeightUnit;
      headCircumference?: number;
      headCircumferenceUnit?: HeadUnit;
    },
    standard: GrowthStandard = 'CDC'
  ): Promise<{
    heightPercentile: number;
    weightPercentile: number;
    bmi: number;
    bmiPercentile: number;
    bmiCategory: BMICategory;
    headCircumferencePercentile?: number;
    ageInMonths: number;
  }> {
    const response = await this.client.post<ApiResponse<any>>(
      `${this.baseEndpoint}/calculate-percentiles`,
      {
        ...measurement,
        standard
      }
    );

    return this.extractData(response);
  }

  /**
   * Flag measurement for review
   */
  async flagForReview(
    id: string,
    reason: string
  ): Promise<GrowthMeasurement> {
    this.validateId(id);

    const response = await this.client.post<ApiResponse<GrowthMeasurement>>(
      `${this.baseEndpoint}/${id}/flag-review`,
      { reason }
    );

    const measurement = this.extractData(response);
    await this.logPHIAccess('FLAG_MEASUREMENT_REVIEW', measurement.studentId, 'GROWTH', id);
    return measurement;
  }

  /**
   * Get measurements flagged for review
   */
  async getFlaggedMeasurements(
    schoolId?: string
  ): Promise<PaginatedResponse<GrowthMeasurement>> {
    const params = this.buildQueryParams({
      flaggedForReview: true,
      schoolId
    });

    const response = await this.client.get<PaginatedResponse<GrowthMeasurement>>(
      `${this.baseEndpoint}/flagged${params}`
    );

    return response.data;
  }

  /**
   * Bulk import measurements
   */
  async bulkImport(
    measurements: GrowthMeasurementCreate[]
  ): Promise<{
    imported: number;
    failed: number;
    errors: Array<{ index: number; error: string }>;
  }> {
    // Validate all measurements
    measurements.forEach((measurement, index) => {
      try {
        growthMeasurementCreateSchema.parse(measurement);
      } catch (error) {
        throw new Error(`Validation error at index ${index}: ${error}`);
      }
    });

    const response = await this.client.post<ApiResponse<any>>(
      `${this.baseEndpoint}/bulk-import`,
      { measurements }
    );

    // Log PHI access for each student
    const uniqueStudentIds = [...new Set(measurements.map(m => m.studentId))];
    await Promise.all(
      uniqueStudentIds.map(studentId =>
        this.logPHIAccess('BULK_IMPORT_MEASUREMENTS', studentId)
      )
    );

    return this.extractData(response);
  }

  /**
   * Export growth data for analysis
   */
  async exportGrowthData(
    studentId: string,
    format: 'CSV' | 'JSON' | 'PDF' = 'PDF'
  ): Promise<Blob> {
    this.validateId(studentId);

    const response = await this.client.get(
      `${this.baseEndpoint}/student/${studentId}/export`,
      {
        params: { format },
        responseType: 'blob'
      }
    );

    await this.logPHIAccess('EXPORT_GROWTH_DATA', studentId);
    return response.data as Blob;
  }

  /**
   * Get growth statistics for population
   */
  async getPopulationStatistics(
    scope: 'school' | 'district',
    scopeId: string,
    ageGroup?: string,
    gender?: 'M' | 'F'
  ): Promise<{
    totalStudents: number;
    averageBMI: number;
    distribution: {
      underweight: number;
      normal: number;
      overweight: number;
      obese: number;
    };
    percentileDistribution: {
      below5th: number;
      p5to25: number;
      p25to75: number;
      p75to95: number;
      above95th: number;
    };
    trends: Array<{
      period: string;
      averageBMI: number;
      obesityRate: number;
    }>;
  }> {
    this.validateId(scopeId);

    const params = this.buildQueryParams({
      ageGroup,
      gender
    });

    const response = await this.client.get<ApiResponse<any>>(
      `${this.baseEndpoint}/statistics/${scope}/${scopeId}${params}`
    );

    return this.extractData(response);
  }

  /**
   * Identify students with concerning growth patterns
   */
  async identifyAtRiskStudents(
    schoolId: string,
    riskType: 'OBESITY' | 'UNDERWEIGHT' | 'RAPID_CHANGE'
  ): Promise<Array<{
    studentId: string;
    studentName: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    details: string;
    lastMeasurement: GrowthMeasurement;
  }>> {
    this.validateId(schoolId);

    const response = await this.client.get<ApiResponse<any>>(
      `${this.baseEndpoint}/at-risk/${schoolId}/${riskType}`
    );

    return this.extractData(response);
  }

  /**
   * Override to add PHI logging
   */
  async create(data: GrowthMeasurementCreate): Promise<GrowthMeasurement> {
    const measurement = await super.create(data);
    await this.logPHIAccess('CREATE_GROWTH_MEASUREMENT', data.studentId, 'GROWTH', measurement.id);
    return measurement;
  }

  /**
   * Override to add PHI logging
   */
  async update(id: string, data: GrowthMeasurementUpdate): Promise<GrowthMeasurement> {
    const measurement = await super.update(id, data);
    await this.logPHIAccess('UPDATE_GROWTH_MEASUREMENT', measurement.studentId, 'GROWTH', id);
    return measurement;
  }

  /**
   * Override to add PHI logging
   */
  async delete(id: string): Promise<void> {
    const measurement = await this.getById(id);
    await super.delete(id);
    await this.logPHIAccess('DELETE_GROWTH_MEASUREMENT', measurement.studentId, 'GROWTH', id);
  }

  /**
   * Log PHI access for compliance
   */
  private async logPHIAccess(
    action: string,
    studentId: string,
    recordType: string = 'GROWTH',
    recordId?: string
  ): Promise<void> {
    try {
      await this.client.post('/api/audit/phi-access', {
        action,
        studentId,
        recordType,
        recordId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log PHI access:', error);
    }
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const growthMeasurementsApi = new GrowthMeasurementsApiService();