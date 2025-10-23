/**
 * Chronic Conditions API Service Module
 *
 * Purpose: Manages long-term health conditions and care plans
 *
 * Features:
 * - Condition tracking and monitoring
 * - Care plan management
 * - Medication correlation
 * - Treatment history
 * - Specialist referrals
 *
 * @module services/modules/health/chronicConditions
 */

import { API_ENDPOINTS } from '../../config/apiConfig';
import { z } from 'zod';
import { BaseApiService } from '../../core/BaseApiService';
import type { ApiClient } from '../../core/ApiClient';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../../types';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ChronicCondition {
  id: string;
  studentId: string;
  condition: string;
  icdCode?: string;
  diagnosisDate: string;
  diagnosedBy?: string;
  severity: ConditionSeverity;
  status: ConditionStatus;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  accommodations?: string[];
  monitoringFrequency?: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  specialistName?: string;
  specialistContact?: string;
  notes?: string;
  attachments?: string[];
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ConditionSeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
export type ConditionStatus = 'ACTIVE' | 'MANAGED' | 'IN_REMISSION' | 'RESOLVED';

export interface ChronicConditionCreate {
  studentId: string;
  condition: string;
  icdCode?: string;
  diagnosisDate: string;
  diagnosedBy?: string;
  severity: ConditionSeverity;
  status: ConditionStatus;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  accommodations?: string[];
  monitoringFrequency?: string;
  nextReviewDate?: string;
  specialistName?: string;
  specialistContact?: string;
  notes?: string;
}

export interface ChronicConditionUpdate extends Partial<ChronicConditionCreate> {
  lastReviewDate?: string;
}

export interface ChronicConditionFilters extends PaginationParams {
  severity?: ConditionSeverity;
  status?: ConditionStatus;
  search?: string;
  requiresMonitoring?: boolean;
  upcomingReviews?: boolean;
}

export interface CarePlanUpdate {
  carePlan: string;
  medications?: string[];
  restrictions?: string[];
  accommodations?: string[];
  monitoringFrequency?: string;
  nextReviewDate?: string;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const chronicConditionCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  condition: z.string().min(1, 'Condition is required').max(200),
  icdCode: z.string().regex(/^[A-Z]\d{2}(\.\d{1,2})?$/, 'Invalid ICD code format').optional(),
  diagnosisDate: z.string().datetime(),
  diagnosedBy: z.string().max(100).optional(),
  severity: z.enum(['MILD', 'MODERATE', 'SEVERE', 'CRITICAL']),
  status: z.enum(['ACTIVE', 'MANAGED', 'IN_REMISSION', 'RESOLVED']),
  carePlan: z.string().max(5000).optional(),
  medications: z.array(z.string()).optional(),
  restrictions: z.array(z.string()).optional(),
  accommodations: z.array(z.string()).optional(),
  monitoringFrequency: z.string().max(100).optional(),
  nextReviewDate: z.string().datetime().optional(),
  specialistName: z.string().max(100).optional(),
  specialistContact: z.string().max(100).optional(),
  notes: z.string().max(2000).optional()
});

const chronicConditionUpdateSchema = chronicConditionCreateSchema.partial().extend({
  lastReviewDate: z.string().datetime().optional()
});

const carePlanUpdateSchema = z.object({
  carePlan: z.string().min(1, 'Care plan is required').max(5000),
  medications: z.array(z.string()).optional(),
  restrictions: z.array(z.string()).optional(),
  accommodations: z.array(z.string()).optional(),
  monitoringFrequency: z.string().max(100).optional(),
  nextReviewDate: z.string().datetime().optional()
});

// ==========================================
// API SERVICE CLASS
// ==========================================

export class ChronicConditionsApiService extends BaseApiService<
  ChronicCondition,
  ChronicConditionCreate,
  ChronicConditionUpdate
> {
  constructor(client: ApiClient) {
    super(client, `${API_ENDPOINTS.HEALTH_RECORDS}/conditions`, {
      createSchema: chronicConditionCreateSchema,
      updateSchema: chronicConditionUpdateSchema
    });
  }

  /**
   * Get conditions for a specific student
   */
  async getStudentConditions(
    studentId: string,
    filters?: Omit<ChronicConditionFilters, 'page' | 'limit'>
  ): Promise<ChronicCondition[]> {
    this.validateId(studentId);

    const params = this.buildQueryParams({
      ...filters,
      studentId
    });

    const response = await this.client.get<ApiResponse<ChronicCondition[]>>(
      `${this.baseEndpoint}/student/${studentId}${params}`
    );

    await this.logPHIAccess('VIEW_CONDITIONS', studentId);
    return this.extractData(response);
  }

  /**
   * Get active conditions requiring monitoring
   */
  async getActiveConditions(studentId: string): Promise<ChronicCondition[]> {
    this.validateId(studentId);

    const response = await this.client.get<ApiResponse<ChronicCondition[]>>(
      `${this.baseEndpoint}/student/${studentId}/active`
    );

    await this.logPHIAccess('VIEW_ACTIVE_CONDITIONS', studentId);
    return this.extractData(response);
  }

  /**
   * Update care plan for a condition
   */
  async updateCarePlan(id: string, carePlan: CarePlanUpdate): Promise<ChronicCondition> {
    this.validateId(id);
    carePlanUpdateSchema.parse(carePlan);

    const response = await this.client.put<ApiResponse<ChronicCondition>>(
      `${this.baseEndpoint}/${id}/care-plan`,
      carePlan
    );

    const condition = this.extractData(response);
    await this.logPHIAccess('UPDATE_CARE_PLAN', condition.studentId, 'CONDITION', id);
    return condition;
  }

  /**
   * Record condition review
   */
  async recordReview(
    id: string,
    review: {
      reviewDate: string;
      reviewedBy: string;
      findings: string;
      statusChange?: ConditionStatus;
      severityChange?: ConditionSeverity;
      nextReviewDate?: string;
      notes?: string;
    }
  ): Promise<ChronicCondition> {
    this.validateId(id);

    const response = await this.client.post<ApiResponse<ChronicCondition>>(
      `${this.baseEndpoint}/${id}/review`,
      review
    );

    const condition = this.extractData(response);
    await this.logPHIAccess('RECORD_CONDITION_REVIEW', condition.studentId, 'CONDITION', id);
    return condition;
  }

  /**
   * Get conditions requiring review
   */
  async getConditionsForReview(
    daysAhead: number = 30
  ): Promise<PaginatedResponse<ChronicCondition>> {
    const params = this.buildQueryParams({
      upcomingReviews: true,
      daysAhead
    });

    const response = await this.client.get<PaginatedResponse<ChronicCondition>>(
      `${this.baseEndpoint}/review-queue${params}`
    );

    return response.data;
  }

  /**
   * Link medication to condition
   */
  async linkMedication(
    conditionId: string,
    medicationId: string
  ): Promise<ChronicCondition> {
    this.validateId(conditionId);
    this.validateId(medicationId);

    const response = await this.client.post<ApiResponse<ChronicCondition>>(
      `${this.baseEndpoint}/${conditionId}/medications/${medicationId}`
    );

    const condition = this.extractData(response);
    await this.logPHIAccess('LINK_MEDICATION_TO_CONDITION', condition.studentId, 'CONDITION', conditionId);
    return condition;
  }

  /**
   * Generate condition summary report
   */
  async generateConditionReport(studentId: string): Promise<Blob> {
    this.validateId(studentId);

    const response = await this.client.get(
      `${this.baseEndpoint}/student/${studentId}/report`,
      { responseType: 'blob' }
    );

    await this.logPHIAccess('GENERATE_CONDITION_REPORT', studentId);
    return response.data as Blob;
  }

  /**
   * Get condition statistics for a school or district
   */
  async getConditionStatistics(
    scope: 'school' | 'district',
    scopeId: string
  ): Promise<{
    totalConditions: number;
    byStatus: Record<ConditionStatus, number>;
    bySeverity: Record<ConditionSeverity, number>;
    topConditions: Array<{ condition: string; count: number }>;
    requireingReview: number;
  }> {
    this.validateId(scopeId);

    const response = await this.client.get<ApiResponse<any>>(
      `${this.baseEndpoint}/statistics/${scope}/${scopeId}`
    );

    return this.extractData(response);
  }

  /**
   * Override to add PHI logging
   */
  async create(data: ChronicConditionCreate): Promise<ChronicCondition> {
    const condition = await super.create(data);
    await this.logPHIAccess('CREATE_CONDITION', data.studentId, 'CONDITION', condition.id);
    return condition;
  }

  /**
   * Override to add PHI logging
   */
  async update(id: string, data: ChronicConditionUpdate): Promise<ChronicCondition> {
    const condition = await super.update(id, data);
    await this.logPHIAccess('UPDATE_CONDITION', condition.studentId, 'CONDITION', id);
    return condition;
  }

  /**
   * Override to add PHI logging
   */
  async delete(id: string): Promise<void> {
    const condition = await this.getById(id);
    await super.delete(id);
    await this.logPHIAccess('DELETE_CONDITION', condition.studentId, 'CONDITION', id);
  }

  /**
   * Log PHI access for compliance
   */
  private async logPHIAccess(
    action: string,
    studentId: string,
    recordType: string = 'CONDITION',
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

export function createChronicConditionsApi(client: ApiClient): ChronicConditionsApiService {
  return new ChronicConditionsApiService(client);
}