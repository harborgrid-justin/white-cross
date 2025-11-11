/**
 * Health Records API - Health Screenings Management
 * 
 * Comprehensive health screenings management including:
 * - Health screening CRUD operations
 * - Screening schedule management
 * - Referral tracking
 * - Due date monitoring
 * - PHI access logging for HIPAA compliance
 * 
 * @module services/modules/healthRecordsApi/screenings
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
  Screening,
  ScreeningCreate,
  ScreeningUpdate
} from './types';
import {
  ScreeningType,
  ScreeningOutcome
} from './types';

// Validation schemas
const screeningCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  screeningType: z.nativeEnum(ScreeningType),
  screeningDate: z.string().min(1, 'Screening date is required'),
  performedBy: z.string().min(1, 'Performed by is required').max(255),
  outcome: z.nativeEnum(ScreeningOutcome),
  results: z.string().max(5000).optional(),
  measurements: z.record(z.string(), z.any()).optional(),
  referralRequired: z.boolean().optional(),
  referralTo: z.string().max(255).optional(),
  followUpRequired: z.boolean().optional(),
  followUpDate: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

const screeningUpdateSchema = z.object({
  screeningType: z.nativeEnum(ScreeningType).optional(),
  screeningDate: z.string().optional(),
  performedBy: z.string().min(1).max(255).optional(),
  outcome: z.nativeEnum(ScreeningOutcome).optional(),
  results: z.string().max(5000).optional(),
  measurements: z.record(z.string(), z.any()).optional(),
  referralRequired: z.boolean().optional(),
  referralTo: z.string().max(255).optional(),
  followUpRequired: z.boolean().optional(),
  followUpDate: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

/**
 * Health Screenings Management Service
 */
export class ScreeningsService {
  private readonly baseEndpoint = `${API_ENDPOINTS.HEALTH_RECORDS.BASE}/screenings`;

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
   * Get all screenings for a student
   */
  async getScreenings(studentId: string): Promise<Screening[]> {
    try {
      const response = await this.client.get<ApiResponse<{ screenings: Screening[] }>>(
        `${this.baseEndpoint}/student/${studentId}`
      );

      await this.logPHIAccess(AuditAction.VIEW_SCREENINGS, studentId, AuditResourceType.SCREENING);

      return response.data.data!.screenings;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single screening by ID
   */
  async getScreeningById(id: string): Promise<Screening> {
    try {
      const response = await this.client.get<ApiResponse<Screening>>(
        `${this.baseEndpoint}/${id}`
      );

      const screening = response.data.data!;
      await this.logPHIAccess(AuditAction.VIEW_SCREENING, screening.studentId, AuditResourceType.SCREENING, id);

      return screening;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new screening
   */
  async createScreening(data: ScreeningCreate): Promise<Screening> {
    try {
      screeningCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<Screening>>(
        this.baseEndpoint,
        data
      );

      const screening = response.data.data!;
      await this.logPHIAccess(AuditAction.CREATE_SCREENING, data.studentId, AuditResourceType.SCREENING, screening.id);

      return screening;
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
   * Update an existing screening
   */
  async updateScreening(id: string, data: ScreeningUpdate): Promise<Screening> {
    try {
      screeningUpdateSchema.parse(data);

      const response = await this.client.put<ApiResponse<Screening>>(
        `${this.baseEndpoint}/${id}`,
        data
      );

      const screening = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_SCREENING, screening.studentId, AuditResourceType.SCREENING, id);

      return screening;
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
   * Delete a screening
   */
  async deleteScreening(id: string): Promise<void> {
    try {
      const screening = await this.getScreeningById(id);
      await this.client.delete(`${this.baseEndpoint}/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_SCREENING, screening.studentId, AuditResourceType.SCREENING, id);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get screenings that are due for review
   */
  async getScreeningsDue(): Promise<Array<{
    student: { id: string; firstName: string; lastName: string; studentNumber: string };
    screeningType: ScreeningType;
    lastScreeningDate?: string;
    dueDate: string;
    daysOverdue: number;
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{ screenings: Array<{
        student: { id: string; firstName: string; lastName: string; studentNumber: string };
        screeningType: ScreeningType;
        lastScreeningDate?: string;
        dueDate: string;
        daysOverdue: number;
      }> }>>(
        `${this.baseEndpoint}/due`
      );

      return response.data.data!.screenings;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get screening schedule for a student based on age and requirements
   */
  async getSchedule(studentId: string): Promise<Array<{
    screeningType: ScreeningType;
    dueDate: string;
    ageAtDue: string;
    frequency: string;
    required: boolean;
    lastCompleted?: string;
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{ schedule: Array<{
        screeningType: ScreeningType;
        dueDate: string;
        ageAtDue: string;
        frequency: string;
        required: boolean;
        lastCompleted?: string;
      }> }>>(
        `${this.baseEndpoint}/student/${studentId}/schedule`
      );

      await this.logPHIAccess(AuditAction.VIEW_SCREENINGS, studentId, AuditResourceType.SCREENING);

      return response.data.data!.schedule;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get screenings by type for a student
   */
  async getScreeningsByType(studentId: string, screeningType: ScreeningType): Promise<Screening[]> {
    try {
      const response = await this.client.get<ApiResponse<{ screenings: Screening[] }>>(
        `${this.baseEndpoint}/student/${studentId}/type/${screeningType}`
      );

      await this.logPHIAccess(AuditAction.VIEW_SCREENINGS, studentId, AuditResourceType.SCREENING);

      return response.data.data!.screenings;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get screening statistics for admin dashboard
   */
  async getStatistics(): Promise<{
    totalScreenings: number;
    byType: Record<ScreeningType, number>;
    byOutcome: Record<ScreeningOutcome, number>;
    referralsRequired: number;
    followUpsRequired: number;
    overdueScreenings: number;
    upcomingDue: number;
    complianceRate: number;
  }> {
    try {
      const response = await this.client.get<ApiResponse<{
        totalScreenings: number;
        byType: Record<ScreeningType, number>;
        byOutcome: Record<ScreeningOutcome, number>;
        referralsRequired: number;
        followUpsRequired: number;
        overdueScreenings: number;
        upcomingDue: number;
        complianceRate: number;
      }>>(
        `${this.baseEndpoint}/statistics`
      );

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Generate screening report for a student
   */
  async generateReport(studentId: string, options: {
    screeningTypes?: ScreeningType[];
    dateFrom?: string;
    dateTo?: string;
    format?: 'pdf' | 'json';
  } = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      if (options.screeningTypes?.length) {
        params.append('types', options.screeningTypes.join(','));
      }
      if (options.dateFrom) params.append('dateFrom', options.dateFrom);
      if (options.dateTo) params.append('dateTo', options.dateTo);
      if (options.format) params.append('format', options.format);

      const response = await this.client.get<Blob>(
        `${this.baseEndpoint}/student/${studentId}/report?${params.toString()}`,
        { responseType: 'blob' }
      );

      await this.logPHIAccess(AuditAction.EXPORT_HEALTH_RECORDS, studentId, AuditResourceType.SCREENING);

      return response.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Track referral for a screening
   */
  async trackReferral(screeningId: string, referralData: {
    referralTo: string;
    referralDate: string;
    reason: string;
    urgency: 'routine' | 'urgent' | 'stat';
    contactInfo?: string;
    expectedFollowUp?: string;
    notes?: string;
  }): Promise<void> {
    try {
      await this.client.post(
        `${this.baseEndpoint}/${screeningId}/referrals`,
        referralData
      );

      const screening = await this.getScreeningById(screeningId);
      await this.logPHIAccess(AuditAction.UPDATE_SCREENING, screening.studentId, AuditResourceType.SCREENING, screeningId);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get referrals for a student
   */
  async getReferrals(studentId: string): Promise<Array<{
    screeningId: string;
    screeningType: ScreeningType;
    referralTo: string;
    referralDate: string;
    reason: string;
    urgency: 'routine' | 'urgent' | 'stat';
    status: 'pending' | 'completed' | 'cancelled';
    followUpDate?: string;
    outcome?: string;
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{ referrals: Array<{
        screeningId: string;
        screeningType: ScreeningType;
        referralTo: string;
        referralDate: string;
        reason: string;
        urgency: 'routine' | 'urgent' | 'stat';
        status: 'pending' | 'completed' | 'cancelled';
        followUpDate?: string;
        outcome?: string;
      }> }>>(
        `${this.baseEndpoint}/student/${studentId}/referrals`
      );

      await this.logPHIAccess(AuditAction.VIEW_SCREENINGS, studentId, AuditResourceType.SCREENING);

      return response.data.data!.referrals;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Schedule follow-up for a screening
   */
  async scheduleFollowUp(screeningId: string, followUpData: {
    followUpDate: string;
    followUpType: 'rescreen' | 'assessment' | 'consultation';
    assignedTo?: string;
    priority: 'low' | 'medium' | 'high';
    instructions?: string;
    notes?: string;
  }): Promise<void> {
    try {
      await this.client.post(
        `${this.baseEndpoint}/${screeningId}/follow-ups`,
        followUpData
      );

      const screening = await this.getScreeningById(screeningId);
      await this.logPHIAccess(AuditAction.UPDATE_SCREENING, screening.studentId, AuditResourceType.SCREENING, screeningId);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get pending follow-ups
   */
  async getPendingFollowUps(): Promise<Array<{
    screeningId: string;
    student: { id: string; firstName: string; lastName: string; studentNumber: string };
    screeningType: ScreeningType;
    followUpDate: string;
    followUpType: 'rescreen' | 'assessment' | 'consultation';
    priority: 'low' | 'medium' | 'high';
    daysOverdue?: number;
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{ followUps: Array<{
        screeningId: string;
        student: { id: string; firstName: string; lastName: string; studentNumber: string };
        screeningType: ScreeningType;
        followUpDate: string;
        followUpType: 'rescreen' | 'assessment' | 'consultation';
        priority: 'low' | 'medium' | 'high';
        daysOverdue?: number;
      }> }>>(
        `${this.baseEndpoint}/follow-ups/pending`
      );

      return response.data.data!.followUps;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}

/**
 * Factory function to create ScreeningsService
 */
export function createScreeningsService(client: ApiClient): ScreeningsService {
  return new ScreeningsService(client);
}
