/**
 * MIGRATION STATUS: DEPRECATED - SCHEDULED FOR REMOVAL IN v2.0.0
 *
 * DEPRECATION TIMELINE:
 * - Deprecated: v1.5.0 (Current)
 * - Removal: v2.0.0 (Planned Q2 2025)
 *
 * REPLACEMENT: @/lib/actions/health-records.crud
 *
 * MIGRATION EXAMPLES:
 *
 * Create Vital Signs Record:
 * OLD: await vitalsService.create({ studentId, temperature, heartRate, bloodPressure, date })
 * NEW: Available in health-records.crud module
 *
 * Get Student Vital Signs:
 * OLD: await vitalsService.getVitals(studentId)
 * NEW: Use health-records.crud actions with vitals type filters
 *
 * @deprecated Use Server Actions from @/lib/actions/health-records.crud instead. Will be removed in v2.0.0
 * @see {@link /lib/actions/health-records.crud.ts} - CRUD operations
 * @see {@link /lib/actions/health-records.actions.ts} - Main barrel export
 * @module services/modules/healthRecordsApi/vitals
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
  VitalSigns,
  VitalSignsCreate,
  VitalSignsUpdate,
  VitalSignsTrend
} from './types';

// Validation schemas
const vitalSignsCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  recordDate: z.string().min(1, 'Record date is required'),
  temperature: z.number().min(35, 'Temperature too low').max(42, 'Temperature too high').optional(),
  temperatureMethod: z.enum(['oral', 'axillary', 'tympanic', 'temporal']).optional(),
  bloodPressureSystolic: z.number().int().min(50, 'BP systolic too low').max(250, 'BP systolic too high').optional(),
  bloodPressureDiastolic: z.number().int().min(30, 'BP diastolic too low').max(150, 'BP diastolic too high').optional(),
  heartRate: z.number().int().min(30, 'Heart rate too low').max(250, 'Heart rate too high').optional(),
  respiratoryRate: z.number().int().min(8, 'Respiratory rate too low').max(60, 'Respiratory rate too high').optional(),
  oxygenSaturation: z.number().min(0).max(100, 'O2 saturation must be 0-100%').optional(),
  pain: z.number().int().min(0).max(10, 'Pain scale is 0-10').optional(),
  glucose: z.number().min(0).max(600, 'Glucose level seems unrealistic').optional(),
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  notes: z.string().max(2000).optional(),
  recordedBy: z.string().min(1, 'Recorded by is required').max(255),
});

const vitalSignsUpdateSchema = z.object({
  recordDate: z.string().optional(),
  temperature: z.number().min(35).max(42).optional(),
  temperatureMethod: z.enum(['oral', 'axillary', 'tympanic', 'temporal']).optional(),
  bloodPressureSystolic: z.number().int().min(50).max(250).optional(),
  bloodPressureDiastolic: z.number().int().min(30).max(150).optional(),
  heartRate: z.number().int().min(30).max(250).optional(),
  respiratoryRate: z.number().int().min(8).max(60).optional(),
  oxygenSaturation: z.number().min(0).max(100).optional(),
  pain: z.number().int().min(0).max(10).optional(),
  glucose: z.number().min(0).max(600).optional(),
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  notes: z.string().max(2000).optional(),
});

/**
 * Vital Signs Management Service
 */
export class VitalSignsService {
  private readonly baseEndpoint = `${API_ENDPOINTS.HEALTH_RECORDS.BASE}/vitals`;

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
   * Get vital signs for a student
   */
  async getVitalSigns(studentId: string, filters?: {
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
  }): Promise<VitalSigns[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await this.client.get<ApiResponse<{ vitals: VitalSigns[] }>>(
        `${this.baseEndpoint}/student/${studentId}?${params.toString()}`
      );

      await this.logPHIAccess(AuditAction.VIEW_VITAL_SIGNS, studentId, AuditResourceType.VITAL_SIGNS);

      return response.data.data!.vitals;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get vital signs by ID
   */
  async getVitalSignsById(id: string): Promise<VitalSigns> {
    try {
      const response = await this.client.get<ApiResponse<VitalSigns>>(
        `${this.baseEndpoint}/${id}`
      );

      const vitals = response.data.data!;
      await this.logPHIAccess(AuditAction.VIEW_VITAL_SIGNS, vitals.studentId, AuditResourceType.VITAL_SIGNS, id);

      return vitals;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create new vital signs record
   */
  async createVitalSigns(data: VitalSignsCreate): Promise<VitalSigns> {
    try {
      vitalSignsCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<VitalSigns>>(
        this.baseEndpoint,
        data
      );

      const vitals = response.data.data!;
      await this.logPHIAccess(AuditAction.CREATE_VITAL_SIGNS, data.studentId, AuditResourceType.VITAL_SIGNS, vitals.id);

      return vitals;
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
   * Update vital signs
   */
  async updateVitalSigns(id: string, data: VitalSignsUpdate): Promise<VitalSigns> {
    try {
      vitalSignsUpdateSchema.parse(data);

      const response = await this.client.put<ApiResponse<VitalSigns>>(
        `${this.baseEndpoint}/${id}`,
        data
      );

      const vitals = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_VITAL_SIGNS, vitals.studentId, AuditResourceType.VITAL_SIGNS, id);

      return vitals;
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
   * Delete vital signs
   */
  async deleteVitalSigns(id: string): Promise<void> {
    try {
      const vitals = await this.getVitalSignsById(id);
      await this.client.delete(`${this.baseEndpoint}/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_VITAL_SIGNS, vitals.studentId, AuditResourceType.VITAL_SIGNS, id);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get vital signs trends
   */
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
        `${this.baseEndpoint}/student/${studentId}/trends?${params.toString()}`
      );

      await this.logPHIAccess(AuditAction.VIEW_VITAL_TRENDS, studentId, AuditResourceType.VITAL_SIGNS);

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get latest vital signs for a student
   */
  async getLatestVitalSigns(studentId: string): Promise<VitalSigns | null> {
    try {
      const response = await this.client.get<ApiResponse<{ vitals: VitalSigns | null }>>(
        `${this.baseEndpoint}/student/${studentId}/latest`
      );

      await this.logPHIAccess(AuditAction.VIEW_VITAL_SIGNS, studentId, AuditResourceType.VITAL_SIGNS);

      return response.data.data!.vitals;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Check vital signs against normal ranges
   */
  async checkNormalRanges(studentId: string, vitalSigns: {
    temperature?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    glucose?: number;
  }): Promise<{
    alerts: Array<{
      vital: string;
      value: number;
      normalRange: { min: number; max: number };
      severity: 'low' | 'high' | 'critical';
      message: string;
    }>;
    overallStatus: 'normal' | 'concerning' | 'critical';
    recommendations: string[];
  }> {
    try {
      const response = await this.client.post<ApiResponse<{
        alerts: Array<{
          vital: string;
          value: number;
          normalRange: { min: number; max: number };
          severity: 'low' | 'high' | 'critical';
          message: string;
        }>;
        overallStatus: 'normal' | 'concerning' | 'critical';
        recommendations: string[];
      }>>(
        `${this.baseEndpoint}/student/${studentId}/check-ranges`,
        vitalSigns
      );

      await this.logPHIAccess(AuditAction.VIEW_VITAL_SIGNS, studentId, AuditResourceType.VITAL_SIGNS);

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Generate vital signs report for a student
   */
  async generateReport(studentId: string, options: {
    dateFrom?: string;
    dateTo?: string;
    includeCharts?: boolean;
    vitalTypes?: string[];
    format?: 'pdf' | 'json';
  } = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      if (options.dateFrom) params.append('dateFrom', options.dateFrom);
      if (options.dateTo) params.append('dateTo', options.dateTo);
      if (options.includeCharts) params.append('includeCharts', String(options.includeCharts));
      if (options.vitalTypes?.length) params.append('vitalTypes', options.vitalTypes.join(','));
      if (options.format) params.append('format', options.format);

      const response = await this.client.get<Blob>(
        `${this.baseEndpoint}/student/${studentId}/report?${params.toString()}`,
        { responseType: 'blob' }
      );

      await this.logPHIAccess(AuditAction.EXPORT_HEALTH_RECORDS, studentId, AuditResourceType.VITAL_SIGNS);

      return response.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get vital signs statistics for admin dashboard
   */
  async getStatistics(): Promise<{
    totalRecords: number;
    studentsWithVitals: number;
    alertsGenerated: number;
    criticalAlerts: number;
    averagesByAge: Record<string, {
      temperature: number;
      heartRate: number;
      systolic: number;
      diastolic: number;
      respiratoryRate: number;
      oxygenSaturation: number;
    }>;
    recentTrends: {
      increasing: number;
      stable: number;
      decreasing: number;
    };
  }> {
    try {
      const response = await this.client.get<ApiResponse<{
        totalRecords: number;
        studentsWithVitals: number;
        alertsGenerated: number;
        criticalAlerts: number;
        averagesByAge: Record<string, {
          temperature: number;
          heartRate: number;
          systolic: number;
          diastolic: number;
          respiratoryRate: number;
          oxygenSaturation: number;
        }>;
        recentTrends: {
          increasing: number;
          stable: number;
          decreasing: number;
        };
      }>>(
        `${this.baseEndpoint}/statistics`
      );

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get critical vital signs alerts
   */
  async getCriticalAlerts(): Promise<Array<{
    student: { id: string; firstName: string; lastName: string; studentNumber: string };
    vitals: VitalSigns;
    alerts: Array<{
      vital: string;
      value: number;
      severity: 'critical';
      message: string;
    }>;
    recordedAt: string;
    timeElapsed: string;
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{ alerts: Array<{
        student: { id: string; firstName: string; lastName: string; studentNumber: string };
        vitals: VitalSigns;
        alerts: Array<{
          vital: string;
          value: number;
          severity: 'critical';
          message: string;
        }>;
        recordedAt: string;
        timeElapsed: string;
      }> }>>(
        `${this.baseEndpoint}/critical-alerts`
      );

      return response.data.data!.alerts;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Bulk import vital signs
   */
  async bulkImport(data: {
    vitals: Array<VitalSignsCreate & { studentNumber?: string }>;
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
    imported: VitalSigns[];
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
        imported: VitalSigns[];
      }>>(
        `${this.baseEndpoint}/bulk-import`,
        data
      );

      const result = response.data.data!;

      // Log PHI access for each unique student
      const uniqueStudentIds = [...new Set(
        data.vitals
          .map(v => v.studentId)
          .filter(Boolean)
      )];
      await Promise.all(
        uniqueStudentIds.map(studentId =>
          this.logPHIAccess(AuditAction.CREATE_VITAL_SIGNS, studentId, AuditResourceType.VITAL_SIGNS)
        )
      );

      return result;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Set vital signs alert thresholds for a student
   */
  async setAlertThresholds(studentId: string, thresholds: {
    temperature?: { min: number; max: number };
    heartRate?: { min: number; max: number };
    bloodPressure?: { systolicMin: number; systolicMax: number; diastolicMin: number; diastolicMax: number };
    respiratoryRate?: { min: number; max: number };
    oxygenSaturation?: { min: number };
    glucose?: { min: number; max: number };
  }): Promise<void> {
    try {
      await this.client.post(
        `${this.baseEndpoint}/student/${studentId}/alert-thresholds`,
        thresholds
      );

      await this.logPHIAccess(AuditAction.UPDATE_VITAL_SIGNS, studentId, AuditResourceType.VITAL_SIGNS);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get alert thresholds for a student
   */
  async getAlertThresholds(studentId: string): Promise<{
    temperature?: { min: number; max: number };
    heartRate?: { min: number; max: number };
    bloodPressure?: { systolicMin: number; systolicMax: number; diastolicMin: number; diastolicMax: number };
    respiratoryRate?: { min: number; max: number };
    oxygenSaturation?: { min: number };
    glucose?: { min: number; max: number };
  }> {
    try {
      const response = await this.client.get<ApiResponse<{
        temperature?: { min: number; max: number };
        heartRate?: { min: number; max: number };
        bloodPressure?: { systolicMin: number; systolicMax: number; diastolicMin: number; diastolicMax: number };
        respiratoryRate?: { min: number; max: number };
        oxygenSaturation?: { min: number };
        glucose?: { min: number; max: number };
      }>>(
        `${this.baseEndpoint}/student/${studentId}/alert-thresholds`
      );

      await this.logPHIAccess(AuditAction.VIEW_VITAL_SIGNS, studentId, AuditResourceType.VITAL_SIGNS);

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}

/**
 * Factory function to create VitalSignsService
 */
export function createVitalSignsService(client: ApiClient): VitalSignsService {
  return new VitalSignsService(client);
}
