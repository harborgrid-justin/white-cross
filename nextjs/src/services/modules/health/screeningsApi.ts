/**
 * Health Screenings API Service Module
 *
 * Purpose: Manages health screening records and follow-up tracking
 *
 * Features:
 * - Vision, hearing, and other health screenings
 * - Screening schedule management
 * - Follow-up tracking and referrals
 * - State-mandated screening compliance
 * - Screening result trends
 *
 * @module services/modules/health/screenings
 */

import { API_ENDPOINTS } from '@/services/config/apiConfig';
import { z } from 'zod';
import { BaseApiService } from '@/services/core/BaseApiService';
import type { ApiClient } from '@/services/core/ApiClient';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/services/types';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface Screening {
  id: string;
  studentId: string;
  type: ScreeningType;
  date: string;
  result: ScreeningResult;
  details?: ScreeningDetails;
  performedBy: string;
  performerTitle?: string;
  location?: string;
  referralNeeded: boolean;
  referralMade?: boolean;
  referralDate?: string;
  referralTo?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  followUpCompleted?: boolean;
  parentNotified: boolean;
  parentNotificationDate?: string;
  notes?: string;
  attachments?: string[];
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    grade: string;
    age: number;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ScreeningType =
  | 'VISION'
  | 'HEARING'
  | 'DENTAL'
  | 'SCOLIOSIS'
  | 'BMI'
  | 'BLOOD_PRESSURE'
  | 'DEVELOPMENTAL'
  | 'BEHAVIORAL'
  | 'OTHER';

export type ScreeningResult = 'PASS' | 'FAIL' | 'BORDERLINE' | 'REFER' | 'UNABLE_TO_TEST';

export interface ScreeningDetails {
  // Vision screening details
  visualAcuity?: {
    rightEye: string;
    leftEye: string;
    bothEyes: string;
    withCorrection: boolean;
  };
  // Hearing screening details
  hearingThresholds?: {
    rightEar: Record<string, number>;
    leftEar: Record<string, number>;
    frequencies: number[];
  };
  // BMI screening details
  bmiData?: {
    height: number;
    weight: number;
    bmi: number;
    percentile: number;
    category: 'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE';
  };
  // Scoliosis screening details
  scoliosisData?: {
    adamsTestResult: 'NEGATIVE' | 'POSITIVE' | 'QUESTIONABLE';
    degreesRotation?: number;
    location?: string;
  };
  // Blood pressure details
  bloodPressureData?: {
    systolic: number;
    diastolic: number;
    percentile: number;
    category: 'NORMAL' | 'ELEVATED' | 'STAGE_1' | 'STAGE_2';
  };
  // Additional measurements
  additionalMeasurements?: Record<string, any>;
}

export interface ScreeningCreate {
  studentId: string;
  type: ScreeningType;
  date: string;
  result: ScreeningResult;
  details?: ScreeningDetails;
  performedBy: string;
  performerTitle?: string;
  location?: string;
  referralNeeded: boolean;
  referralMade?: boolean;
  referralDate?: string;
  referralTo?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  parentNotified: boolean;
  parentNotificationDate?: string;
  notes?: string;
}

export interface ScreeningUpdate extends Partial<ScreeningCreate> {
  followUpCompleted?: boolean;
}

export interface ScreeningFilters extends PaginationParams {
  type?: ScreeningType;
  result?: ScreeningResult;
  referralNeeded?: boolean;
  followUpRequired?: boolean;
  dateFrom?: string;
  dateTo?: string;
  grade?: string;
  search?: string;
}

export interface ScreeningSchedule {
  type: ScreeningType;
  grades: string[];
  frequency: 'ANNUAL' | 'BIENNIAL' | 'ONCE' | 'AS_NEEDED';
  mandated: boolean;
  nextDueDate?: string;
  description: string;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const screeningDetailsSchema = z.object({
  visualAcuity: z.object({
    rightEye: z.string(),
    leftEye: z.string(),
    bothEyes: z.string(),
    withCorrection: z.boolean()
  }).optional(),
  hearingThresholds: z.object({
    rightEar: z.record(z.number()),
    leftEar: z.record(z.number()),
    frequencies: z.array(z.number())
  }).optional(),
  bmiData: z.object({
    height: z.number().positive(),
    weight: z.number().positive(),
    bmi: z.number().positive(),
    percentile: z.number().min(0).max(100),
    category: z.enum(['UNDERWEIGHT', 'NORMAL', 'OVERWEIGHT', 'OBESE'])
  }).optional(),
  scoliosisData: z.object({
    adamsTestResult: z.enum(['NEGATIVE', 'POSITIVE', 'QUESTIONABLE']),
    degreesRotation: z.number().optional(),
    location: z.string().optional()
  }).optional(),
  bloodPressureData: z.object({
    systolic: z.number().positive(),
    diastolic: z.number().positive(),
    percentile: z.number().min(0).max(100),
    category: z.enum(['NORMAL', 'ELEVATED', 'STAGE_1', 'STAGE_2'])
  }).optional(),
  additionalMeasurements: z.record(z.any()).optional()
});

const screeningCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  type: z.enum(['VISION', 'HEARING', 'DENTAL', 'SCOLIOSIS', 'BMI', 'BLOOD_PRESSURE', 'DEVELOPMENTAL', 'BEHAVIORAL', 'OTHER']),
  date: z.string().datetime(),
  result: z.enum(['PASS', 'FAIL', 'BORDERLINE', 'REFER', 'UNABLE_TO_TEST']),
  details: screeningDetailsSchema.optional(),
  performedBy: z.string().min(1, 'Performer name is required').max(100),
  performerTitle: z.string().max(50).optional(),
  location: z.string().max(100).optional(),
  referralNeeded: z.boolean(),
  referralMade: z.boolean().optional(),
  referralDate: z.string().datetime().optional(),
  referralTo: z.string().max(100).optional(),
  followUpRequired: z.boolean(),
  followUpDate: z.string().datetime().optional(),
  parentNotified: z.boolean(),
  parentNotificationDate: z.string().datetime().optional(),
  notes: z.string().max(1000).optional()
});

const screeningUpdateSchema = screeningCreateSchema.partial().extend({
  followUpCompleted: z.boolean().optional()
});

// ==========================================
// API SERVICE CLASS
// ==========================================

export class ScreeningsApiService extends BaseApiService<
  Screening,
  ScreeningCreate,
  ScreeningUpdate
> {
  constructor(client: ApiClient) {
    super(client, `${API_ENDPOINTS.HEALTH_RECORDS}/screenings`, {
      createSchema: screeningCreateSchema,
      updateSchema: screeningUpdateSchema
    });
  }

  /**
   * Get screenings for a specific student
   */
  async getStudentScreenings(
    studentId: string,
    filters?: Omit<ScreeningFilters, 'page' | 'limit'>
  ): Promise<Screening[]> {
    this.validateId(studentId);

    const params = this.buildQueryParams({
      ...filters,
      studentId
    });

    const response = await this.client.get<ApiResponse<Screening[]>>(
      `${this.baseEndpoint}/student/${studentId}${params}`
    );

    await this.logPHIAccess('VIEW_SCREENINGS', studentId);
    return this.extractData(response);
  }

  /**
   * Get latest screening by type
   */
  async getLatestScreening(
    studentId: string,
    type: ScreeningType
  ): Promise<Screening | null> {
    this.validateId(studentId);

    const response = await this.client.get<ApiResponse<Screening | null>>(
      `${this.baseEndpoint}/student/${studentId}/latest/${type}`
    );

    await this.logPHIAccess('VIEW_LATEST_SCREENING', studentId);
    return this.extractData(response);
  }

  /**
   * Get screenings requiring follow-up
   */
  async getScreeningsRequiringFollowUp(
    schoolId?: string,
    overdue?: boolean
  ): Promise<PaginatedResponse<Screening>> {
    const params = this.buildQueryParams({
      schoolId,
      followUpRequired: true,
      followUpCompleted: false,
      overdue
    });

    const response = await this.client.get<PaginatedResponse<Screening>>(
      `${this.baseEndpoint}/follow-up-required${params}`
    );

    return response.data;
  }

  /**
   * Record follow-up completion
   */
  async completeFollowUp(
    id: string,
    followUpData: {
      completedDate: string;
      outcome: string;
      furtherActionRequired?: boolean;
      notes?: string;
    }
  ): Promise<Screening> {
    this.validateId(id);

    const response = await this.client.post<ApiResponse<Screening>>(
      `${this.baseEndpoint}/${id}/complete-follow-up`,
      followUpData
    );

    const screening = this.extractData(response);
    await this.logPHIAccess('COMPLETE_FOLLOW_UP', screening.studentId, 'SCREENING', id);
    return screening;
  }

  /**
   * Get screening schedule for grade level
   */
  async getScreeningSchedule(grade: string): Promise<ScreeningSchedule[]> {
    const response = await this.client.get<ApiResponse<ScreeningSchedule[]>>(
      `${this.baseEndpoint}/schedule/grade/${grade}`
    );

    return this.extractData(response);
  }

  /**
   * Get students due for screening
   */
  async getStudentsDueForScreening(
    type: ScreeningType,
    schoolId?: string,
    grade?: string
  ): Promise<PaginatedResponse<{
    student: {
      id: string;
      name: string;
      grade: string;
      lastScreeningDate?: string;
    };
    dueDate: string;
    daysPastDue?: number;
  }>> {
    const params = this.buildQueryParams({
      type,
      schoolId,
      grade
    });

    const response = await this.client.get<PaginatedResponse<any>>(
      `${this.baseEndpoint}/due-for-screening${params}`
    );

    return response.data;
  }

  /**
   * Bulk create screenings (for mass screening events)
   */
  async bulkCreate(
    screenings: ScreeningCreate[]
  ): Promise<{
    created: number;
    failed: number;
    errors: Array<{ index: number; error: string }>;
  }> {
    // Validate all screenings
    screenings.forEach((screening, index) => {
      try {
        screeningCreateSchema.parse(screening);
      } catch (error) {
        throw new Error(`Validation error at index ${index}: ${error}`);
      }
    });

    const response = await this.client.post<ApiResponse<any>>(
      `${this.baseEndpoint}/bulk-create`,
      { screenings }
    );

    // Log PHI access for each student
    const uniqueStudentIds = [...new Set(screenings.map(s => s.studentId))];
    await Promise.all(
      uniqueStudentIds.map(studentId =>
        this.logPHIAccess('BULK_CREATE_SCREENINGS', studentId)
      )
    );

    return this.extractData(response);
  }

  /**
   * Generate screening report
   */
  async generateScreeningReport(
    studentId: string,
    type?: ScreeningType,
    dateFrom?: string,
    dateTo?: string
  ): Promise<Blob> {
    this.validateId(studentId);

    const params = this.buildQueryParams({
      type,
      dateFrom,
      dateTo
    });

    const response = await this.client.get(
      `${this.baseEndpoint}/student/${studentId}/report${params}`,
      { responseType: 'blob' }
    );

    await this.logPHIAccess('GENERATE_SCREENING_REPORT', studentId);
    return response.data as Blob;
  }

  /**
   * Get screening statistics
   */
  async getScreeningStatistics(
    scope: 'school' | 'district',
    scopeId: string,
    type?: ScreeningType,
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    totalScreenings: number;
    byType: Record<ScreeningType, number>;
    byResult: Record<ScreeningResult, number>;
    referralRate: number;
    followUpCompletionRate: number;
    trends: Array<{
      date: string;
      count: number;
      referralRate: number;
    }>;
  }> {
    this.validateId(scopeId);

    const params = this.buildQueryParams({
      type,
      dateFrom,
      dateTo
    });

    const response = await this.client.get<ApiResponse<any>>(
      `${this.baseEndpoint}/statistics/${scope}/${scopeId}${params}`
    );

    return this.extractData(response);
  }

  /**
   * Send parent notification
   */
  async sendParentNotification(
    screeningId: string,
    notificationMethod: 'EMAIL' | 'SMS' | 'LETTER'
  ): Promise<{
    sent: boolean;
    method: string;
    timestamp: string;
  }> {
    this.validateId(screeningId);

    const response = await this.client.post<ApiResponse<any>>(
      `${this.baseEndpoint}/${screeningId}/notify-parent`,
      { method: notificationMethod }
    );

    const screening = await this.getById(screeningId);
    await this.logPHIAccess('SEND_PARENT_NOTIFICATION', screening.studentId, 'SCREENING', screeningId);

    return this.extractData(response);
  }

  /**
   * Override to add PHI logging
   */
  async create(data: ScreeningCreate): Promise<Screening> {
    const screening = await super.create(data);
    await this.logPHIAccess('CREATE_SCREENING', data.studentId, 'SCREENING', screening.id);
    return screening;
  }

  /**
   * Override to add PHI logging
   */
  async update(id: string, data: ScreeningUpdate): Promise<Screening> {
    const screening = await super.update(id, data);
    await this.logPHIAccess('UPDATE_SCREENING', screening.studentId, 'SCREENING', id);
    return screening;
  }

  /**
   * Override to add PHI logging
   */
  async delete(id: string): Promise<void> {
    const screening = await this.getById(id);
    await super.delete(id);
    await this.logPHIAccess('DELETE_SCREENING', screening.studentId, 'SCREENING', id);
  }

  /**
   * Log PHI access for compliance
   */
  private async logPHIAccess(
    action: string,
    studentId: string,
    recordType: string = 'SCREENING',
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
// FACTORY FUNCTION
// ==========================================

export function createScreeningsApi(client: ApiClient): ScreeningsApiService {
  return new ScreeningsApiService(client);
}