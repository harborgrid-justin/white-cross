/**
 * Vital Signs API Service Module
 *
 * Purpose: Records and tracks student vital signs measurements
 *
 * Features:
 * - Temperature, blood pressure, pulse tracking
 * - Respiratory rate and oxygen saturation
 * - Pain assessment and monitoring
 * - Abnormal value alerts
 * - Trend analysis and reporting
 *
 * @module services/modules/health/vitalSigns
 */

import { apiInstance, API_ENDPOINTS } from '../../config/apiConfig';
import { z } from 'zod';
import { BaseApiService } from '../../core/BaseApiService';
import { ApiClient } from '../../core/ApiClient';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../../types';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface VitalSigns {
  id: string;
  studentId: string;
  measurementDate: string;
  measurementTime: string;
  temperature?: number;
  temperatureUnit: TemperatureUnit;
  temperatureMethod?: TemperatureMethod;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodPressurePosition?: BPPosition;
  pulseRate?: number;
  pulseMethod?: PulseMethod;
  pulseRhythm?: 'REGULAR' | 'IRREGULAR';
  respiratoryRate?: number;
  oxygenSaturation?: number;
  oxygenDelivery?: string;
  painLevel?: number;
  painLocation?: string;
  painDescription?: string;
  bloodGlucose?: number;
  bloodGlucoseUnit?: GlucoseUnit;
  bloodGlucoseType?: 'FASTING' | 'RANDOM' | 'POSTPRANDIAL';
  peakFlow?: number;
  reasonForMeasurement: string;
  symptoms?: string[];
  interventions?: string[];
  outcomeNotes?: string;
  criticalValues?: boolean;
  parentNotified?: boolean;
  emergencyResponse?: boolean;
  measuredBy: string;
  location?: string;
  notes?: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    grade: string;
    age: number;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type TemperatureUnit = 'F' | 'C';
export type TemperatureMethod = 'ORAL' | 'TYMPANIC' | 'TEMPORAL' | 'AXILLARY' | 'RECTAL';
export type BPPosition = 'SITTING' | 'STANDING' | 'LYING';
export type PulseMethod = 'RADIAL' | 'APICAL' | 'CAROTID' | 'BRACHIAL';
export type GlucoseUnit = 'MG_DL' | 'MMOL_L';

export interface VitalSignsCreate {
  studentId: string;
  measurementDate: string;
  measurementTime: string;
  temperature?: number;
  temperatureUnit: TemperatureUnit;
  temperatureMethod?: TemperatureMethod;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodPressurePosition?: BPPosition;
  pulseRate?: number;
  pulseMethod?: PulseMethod;
  pulseRhythm?: 'REGULAR' | 'IRREGULAR';
  respiratoryRate?: number;
  oxygenSaturation?: number;
  oxygenDelivery?: string;
  painLevel?: number;
  painLocation?: string;
  painDescription?: string;
  bloodGlucose?: number;
  bloodGlucoseUnit?: GlucoseUnit;
  bloodGlucoseType?: 'FASTING' | 'RANDOM' | 'POSTPRANDIAL';
  peakFlow?: number;
  reasonForMeasurement: string;
  symptoms?: string[];
  interventions?: string[];
  outcomeNotes?: string;
  measuredBy: string;
  location?: string;
  notes?: string;
}

export interface VitalSignsUpdate extends Partial<VitalSignsCreate> {
  criticalValues?: boolean;
  parentNotified?: boolean;
  emergencyResponse?: boolean;
}

export interface VitalSignsFilters extends PaginationParams {
  dateFrom?: string;
  dateTo?: string;
  criticalValues?: boolean;
  search?: string;
}

export interface VitalSignsTrend {
  studentId: string;
  vitalType: string;
  period: string;
  measurements: Array<{
    date: string;
    value: number;
    normalRange: { min: number; max: number };
  }>;
  average: number;
  trend: 'STABLE' | 'INCREASING' | 'DECREASING' | 'FLUCTUATING';
  alerts: Array<{
    date: string;
    type: 'HIGH' | 'LOW' | 'CRITICAL';
    value: number;
    message: string;
  }>;
}

export interface VitalSignsAlert {
  id: string;
  studentId: string;
  vitalSignsId: string;
  alertType: 'CRITICAL_HIGH' | 'CRITICAL_LOW' | 'ABNORMAL' | 'PATTERN';
  parameter: string;
  value: number;
  normalRange: { min: number; max: number };
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  actionTaken?: string;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const vitalSignsCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  measurementDate: z.string().datetime(),
  measurementTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  temperature: z.number().min(90).max(110).optional(),
  temperatureUnit: z.enum(['F', 'C']),
  temperatureMethod: z.enum(['ORAL', 'TYMPANIC', 'TEMPORAL', 'AXILLARY', 'RECTAL']).optional(),
  bloodPressureSystolic: z.number().min(50).max(250).optional(),
  bloodPressureDiastolic: z.number().min(30).max(150).optional(),
  bloodPressurePosition: z.enum(['SITTING', 'STANDING', 'LYING']).optional(),
  pulseRate: z.number().min(30).max(250).optional(),
  pulseMethod: z.enum(['RADIAL', 'APICAL', 'CAROTID', 'BRACHIAL']).optional(),
  pulseRhythm: z.enum(['REGULAR', 'IRREGULAR']).optional(),
  respiratoryRate: z.number().min(5).max(60).optional(),
  oxygenSaturation: z.number().min(50).max(100).optional(),
  oxygenDelivery: z.string().max(100).optional(),
  painLevel: z.number().min(0).max(10).optional(),
  painLocation: z.string().max(100).optional(),
  painDescription: z.string().max(500).optional(),
  bloodGlucose: z.number().min(20).max(800).optional(),
  bloodGlucoseUnit: z.enum(['MG_DL', 'MMOL_L']).optional(),
  bloodGlucoseType: z.enum(['FASTING', 'RANDOM', 'POSTPRANDIAL']).optional(),
  peakFlow: z.number().min(50).max(800).optional(),
  reasonForMeasurement: z.string().min(1, 'Reason is required').max(500),
  symptoms: z.array(z.string()).optional(),
  interventions: z.array(z.string()).optional(),
  outcomeNotes: z.string().max(1000).optional(),
  measuredBy: z.string().min(1, 'Measurer name is required').max(100),
  location: z.string().max(100).optional(),
  notes: z.string().max(1000).optional()
});

const vitalSignsUpdateSchema = vitalSignsCreateSchema.partial().extend({
  criticalValues: z.boolean().optional(),
  parentNotified: z.boolean().optional(),
  emergencyResponse: z.boolean().optional()
});

// ==========================================
// API SERVICE CLASS
// ==========================================

export class VitalSignsApiService extends BaseApiService<
  VitalSigns,
  VitalSignsCreate,
  VitalSignsUpdate
> {
  constructor() {
    const client = new ApiClient(apiInstance);
    super(client, `${API_ENDPOINTS.HEALTH_RECORDS}/vitals`, {
      createSchema: vitalSignsCreateSchema,
      updateSchema: vitalSignsUpdateSchema
    });
  }

  /**
   * Get vital signs for a specific student
   */
  async getStudentVitalSigns(
    studentId: string,
    filters?: Omit<VitalSignsFilters, 'page' | 'limit'>,
    limit?: number
  ): Promise<VitalSigns[]> {
    this.validateId(studentId);

    const params = this.buildQueryParams({
      ...filters,
      studentId,
      limit: limit || 20
    });

    const response = await this.client.get<ApiResponse<VitalSigns[]>>(
      `${this.baseEndpoint}/student/${studentId}${params}`
    );

    await this.logPHIAccess('VIEW_VITAL_SIGNS', studentId);
    return this.extractData(response);
  }

  /**
   * Get latest vital signs
   */
  async getLatestVitalSigns(studentId: string): Promise<VitalSigns | null> {
    this.validateId(studentId);

    const response = await this.client.get<ApiResponse<VitalSigns | null>>(
      `${this.baseEndpoint}/student/${studentId}/latest`
    );

    await this.logPHIAccess('VIEW_LATEST_VITALS', studentId);
    return this.extractData(response);
  }

  /**
   * Get vital sign trends
   */
  async getVitalTrends(
    studentId: string,
    vitalType: 'temperature' | 'bloodPressure' | 'pulseRate' | 'respiratoryRate' | 'oxygenSaturation' | 'bloodGlucose',
    dateFrom?: string,
    dateTo?: string
  ): Promise<VitalSignsTrend> {
    this.validateId(studentId);

    const params = this.buildQueryParams({
      vitalType,
      dateFrom,
      dateTo
    });

    const response = await this.client.get<ApiResponse<VitalSignsTrend>>(
      `${this.baseEndpoint}/student/${studentId}/trends${params}`
    );

    await this.logPHIAccess('VIEW_VITAL_TRENDS', studentId);
    return this.extractData(response);
  }

  /**
   * Check for critical values and create alerts
   */
  async checkCriticalValues(vitalSignsId: string): Promise<VitalSignsAlert[]> {
    this.validateId(vitalSignsId);

    const response = await this.client.post<ApiResponse<VitalSignsAlert[]>>(
      `${this.baseEndpoint}/${vitalSignsId}/check-critical`
    );

    const alerts = this.extractData(response);
    if (alerts.length > 0) {
      await this.logPHIAccess('CRITICAL_VALUES_DETECTED', alerts[0].studentId, 'VITALS', vitalSignsId);
    }

    return alerts;
  }

  /**
   * Acknowledge vital signs alert
   */
  async acknowledgeAlert(
    alertId: string,
    acknowledgement: {
      acknowledgedBy: string;
      actionTaken: string;
      notes?: string;
    }
  ): Promise<VitalSignsAlert> {
    this.validateId(alertId);

    const response = await this.client.post<ApiResponse<VitalSignsAlert>>(
      `${this.baseEndpoint}/alerts/${alertId}/acknowledge`,
      acknowledgement
    );

    const alert = this.extractData(response);
    await this.logPHIAccess('ACKNOWLEDGE_VITAL_ALERT', alert.studentId, 'ALERT', alertId);
    return alert;
  }

  /**
   * Get unacknowledged alerts
   */
  async getUnacknowledgedAlerts(
    schoolId?: string
  ): Promise<VitalSignsAlert[]> {
    const params = this.buildQueryParams({
      schoolId,
      acknowledged: false
    });

    const response = await this.client.get<ApiResponse<VitalSignsAlert[]>>(
      `${this.baseEndpoint}/alerts/unacknowledged${params}`
    );

    return this.extractData(response);
  }

  /**
   * Record emergency response
   */
  async recordEmergencyResponse(
    vitalSignsId: string,
    response: {
      responseTime: string;
      actions: string[];
      outcome: string;
      transportedTo?: string;
      parentContacted: boolean;
      emergencyContactUsed?: string;
    }
  ): Promise<VitalSigns> {
    this.validateId(vitalSignsId);

    const apiResponse = await this.client.post<ApiResponse<VitalSigns>>(
      `${this.baseEndpoint}/${vitalSignsId}/emergency-response`,
      response
    );

    const vitalSigns = this.extractData(apiResponse);
    await this.logPHIAccess('RECORD_EMERGENCY_RESPONSE', vitalSigns.studentId, 'VITALS', vitalSignsId);
    return vitalSigns;
  }

  /**
   * Generate vital signs report
   */
  async generateVitalSignsReport(
    studentId: string,
    dateFrom?: string,
    dateTo?: string,
    includeCharts: boolean = true
  ): Promise<Blob> {
    this.validateId(studentId);

    const params = this.buildQueryParams({
      dateFrom,
      dateTo,
      includeCharts
    });

    const response = await this.client.get(
      `${this.baseEndpoint}/student/${studentId}/report${params}`,
      { responseType: 'blob' }
    );

    await this.logPHIAccess('GENERATE_VITALS_REPORT', studentId);
    return response.data as Blob;
  }

  /**
   * Get normal ranges for age
   */
  async getNormalRanges(
    ageInYears: number,
    gender?: 'M' | 'F'
  ): Promise<{
    temperature: { min: number; max: number; unit: TemperatureUnit };
    bloodPressure: {
      systolic: { min: number; max: number };
      diastolic: { min: number; max: number };
    };
    pulseRate: { min: number; max: number };
    respiratoryRate: { min: number; max: number };
    oxygenSaturation: { min: number; max: number };
    bloodGlucose: {
      fasting: { min: number; max: number; unit: GlucoseUnit };
      random: { min: number; max: number; unit: GlucoseUnit };
    };
  }> {
    const params = this.buildQueryParams({
      age: ageInYears,
      gender
    });

    const response = await this.client.get<ApiResponse<any>>(
      `${this.baseEndpoint}/normal-ranges${params}`
    );

    return this.extractData(response);
  }

  /**
   * Bulk record vital signs (for screening events)
   */
  async bulkCreate(
    vitalSigns: VitalSignsCreate[]
  ): Promise<{
    created: number;
    failed: number;
    errors: Array<{ index: number; error: string }>;
    criticalAlerts: VitalSignsAlert[];
  }> {
    // Validate all vital signs
    vitalSigns.forEach((vitals, index) => {
      try {
        vitalSignsCreateSchema.parse(vitals);
      } catch (error) {
        throw new Error(`Validation error at index ${index}: ${error}`);
      }
    });

    const response = await this.client.post<ApiResponse<any>>(
      `${this.baseEndpoint}/bulk-create`,
      { vitalSigns }
    );

    // Log PHI access for each student
    const uniqueStudentIds = [...new Set(vitalSigns.map(v => v.studentId))];
    await Promise.all(
      uniqueStudentIds.map(studentId =>
        this.logPHIAccess('BULK_CREATE_VITALS', studentId)
      )
    );

    return this.extractData(response);
  }

  /**
   * Get statistics for vital signs
   */
  async getVitalStatistics(
    scope: 'school' | 'district',
    scopeId: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    totalMeasurements: number;
    criticalValues: number;
    averages: {
      temperature: number;
      bloodPressureSystolic: number;
      bloodPressureDiastolic: number;
      pulseRate: number;
      respiratoryRate: number;
      oxygenSaturation: number;
    };
    abnormalRates: {
      fever: number;
      hypertension: number;
      hypotension: number;
      tachycardia: number;
      bradycardia: number;
      hypoxia: number;
    };
    emergencyResponses: number;
  }> {
    this.validateId(scopeId);

    const params = this.buildQueryParams({
      dateFrom,
      dateTo
    });

    const response = await this.client.get<ApiResponse<any>>(
      `${this.baseEndpoint}/statistics/${scope}/${scopeId}${params}`
    );

    return this.extractData(response);
  }

  /**
   * Override to add PHI logging
   */
  async create(data: VitalSignsCreate): Promise<VitalSigns> {
    const vitalSigns = await super.create(data);

    // Check for critical values automatically
    await this.checkCriticalValues(vitalSigns.id);

    await this.logPHIAccess('CREATE_VITAL_SIGNS', data.studentId, 'VITALS', vitalSigns.id);
    return vitalSigns;
  }

  /**
   * Override to add PHI logging
   */
  async update(id: string, data: VitalSignsUpdate): Promise<VitalSigns> {
    const vitalSigns = await super.update(id, data);
    await this.logPHIAccess('UPDATE_VITAL_SIGNS', vitalSigns.studentId, 'VITALS', id);
    return vitalSigns;
  }

  /**
   * Override to add PHI logging
   */
  async delete(id: string): Promise<void> {
    const vitalSigns = await this.getById(id);
    await super.delete(id);
    await this.logPHIAccess('DELETE_VITAL_SIGNS', vitalSigns.studentId, 'VITALS', id);
  }

  /**
   * Log PHI access for compliance
   */
  private async logPHIAccess(
    action: string,
    studentId: string,
    recordType: string = 'VITALS',
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

export const vitalSignsApi = new VitalSignsApiService();