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
 * Create Chronic Condition:
 * OLD: await conditionsService.create({ studentId, condition, severity, diagnosisDate })
 * NEW: Available in health-records.crud module
 *
 * Get Student Conditions:
 * OLD: await conditionsService.getConditions(studentId)
 * NEW: Use health-records.crud actions with appropriate filters
 *
 * Update Condition:
 * OLD: await conditionsService.update(id, data)
 * NEW: Available in health-records.crud module
 *
 * @deprecated Use Server Actions from @/lib/actions/health-records.crud instead. Will be removed in v2.0.0
 * @see {@link /lib/actions/health-records.crud.ts} - CRUD operations
 * @see {@link /lib/actions/health-records.actions.ts} - Main barrel export
 * @module services/modules/healthRecordsApi/conditions
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
  ChronicCondition,
  ChronicConditionCreate,
  ChronicConditionUpdate,
  CarePlanUpdate,
  ConditionSeverity
} from './types';
import {
  ConditionStatus,
  ConditionSeverity as ConditionSeverityEnum
} from './types';

// Validation schemas
const chronicConditionCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  condition: z.string().min(1, 'Condition is required').max(255),
  icdCode: z.string().regex(/^[A-Z]\d{2}(\.\d{1,2})?$/, 'Invalid ICD code format').optional().or(z.literal('')),
  diagnosedDate: z.string().min(1, 'Diagnosed date is required'),
  status: z.nativeEnum(ConditionStatus),
  severity: z.nativeEnum(ConditionSeverityEnum),
  notes: z.string().max(2000).optional(),
  carePlan: z.string().max(10000).optional(),
  medications: z.array(z.string()).optional(),
  restrictions: z.array(z.string()).optional(),
  triggers: z.array(z.string()).optional(),
  diagnosedBy: z.string().max(255).optional(),
  nextReviewDate: z.string().optional(),
  emergencyProtocol: z.string().max(5000).optional(),
});

const chronicConditionUpdateSchema = z.object({
  condition: z.string().min(1).max(255).optional(),
  icdCode: z.string().regex(/^[A-Z]\d{2}(\.\d{1,2})?$/, 'Invalid ICD code format').optional().or(z.literal('')),
  diagnosedDate: z.string().optional(),
  status: z.nativeEnum(ConditionStatus).optional(),
  severity: z.nativeEnum(ConditionSeverityEnum).optional(),
  notes: z.string().max(2000).optional(),
  carePlan: z.string().max(10000).optional(),
  medications: z.array(z.string()).optional(),
  restrictions: z.array(z.string()).optional(),
  triggers: z.array(z.string()).optional(),
  diagnosedBy: z.string().max(255).optional(),
  lastReviewDate: z.string().optional(),
  nextReviewDate: z.string().optional(),
  emergencyProtocol: z.string().max(5000).optional(),
  isActive: z.boolean().optional(),
});

const carePlanUpdateSchema = z.object({
  carePlan: z.string().min(1, 'Care plan is required').max(10000),
  medications: z.array(z.string()).optional(),
  restrictions: z.array(z.string()).optional(),
  triggers: z.array(z.string()).optional(),
  emergencyProtocol: z.string().max(5000).optional(),
  nextReviewDate: z.string().optional(),
});

/**
 * Chronic Conditions Management Service
 */
export class ChronicConditionsService {
  private readonly baseEndpoint = `${API_ENDPOINTS.HEALTH_RECORDS.BASE}/conditions`;

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
   * Get all chronic conditions for a student
   */
  async getConditions(studentId: string): Promise<ChronicCondition[]> {
    try {
      const response = await this.client.get<ApiResponse<{ conditions: ChronicCondition[] }>>(
        `${this.baseEndpoint}/student/${studentId}`
      );

      await this.logPHIAccess(AuditAction.VIEW_CHRONIC_CONDITIONS, studentId, AuditResourceType.CHRONIC_CONDITION);

      return response.data.data!.conditions;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single chronic condition by ID
   */
  async getConditionById(id: string): Promise<ChronicCondition> {
    try {
      const response = await this.client.get<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/${id}`
      );

      const condition = response.data.data!;
      await this.logPHIAccess(AuditAction.VIEW_CHRONIC_CONDITION, condition.studentId, AuditResourceType.CHRONIC_CONDITION, id);

      return condition;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new chronic condition
   */
  async createCondition(data: ChronicConditionCreate): Promise<ChronicCondition> {
    try {
      chronicConditionCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<ChronicCondition>>(
        this.baseEndpoint,
        data
      );

      const condition = response.data.data!;
      await this.logPHIAccess(AuditAction.CREATE_CHRONIC_CONDITION, data.studentId, AuditResourceType.CHRONIC_CONDITION, condition.id);

      return condition;
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
   * Update an existing chronic condition
   */
  async updateCondition(id: string, data: ChronicConditionUpdate): Promise<ChronicCondition> {
    try {
      chronicConditionUpdateSchema.parse(data);

      const response = await this.client.put<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/${id}`,
        data
      );

      const condition = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_CHRONIC_CONDITION, condition.studentId, AuditResourceType.CHRONIC_CONDITION, id);

      return condition;
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
   * Update care plan for a chronic condition
   */
  async updateCarePlan(id: string, carePlan: CarePlanUpdate): Promise<ChronicCondition> {
    try {
      carePlanUpdateSchema.parse(carePlan);

      const response = await this.client.post<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/${id}/care-plan`,
        carePlan
      );

      const condition = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_CHRONIC_CONDITION, condition.studentId, AuditResourceType.CHRONIC_CONDITION, id);

      return condition;
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
   * Delete a chronic condition
   */
  async deleteCondition(id: string): Promise<void> {
    try {
      const condition = await this.getConditionById(id);
      await this.client.delete(`${this.baseEndpoint}/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_CHRONIC_CONDITION, condition.studentId, AuditResourceType.CHRONIC_CONDITION, id);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get active chronic conditions for a student
   */
  async getActiveConditions(studentId: string): Promise<ChronicCondition[]> {
    try {
      const response = await this.client.get<ApiResponse<{ conditions: ChronicCondition[] }>>(
        `${this.baseEndpoint}/student/${studentId}/active`
      );

      await this.logPHIAccess(AuditAction.VIEW_CHRONIC_CONDITIONS, studentId, AuditResourceType.CHRONIC_CONDITION);

      return response.data.data!.conditions;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update condition status
   */
  async updateStatus(id: string, status: ConditionStatus, notes?: string): Promise<ChronicCondition> {
    try {
      const response = await this.client.patch<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/${id}/status`,
        { status, notes }
      );

      const condition = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_CHRONIC_CONDITION, condition.studentId, AuditResourceType.CHRONIC_CONDITION, id);

      return condition;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Schedule review for a chronic condition
   */
  async scheduleReview(id: string, reviewDate: string, notes?: string): Promise<ChronicCondition> {
    try {
      const response = await this.client.patch<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/${id}/schedule-review`,
        { reviewDate, notes }
      );

      const condition = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_CHRONIC_CONDITION, condition.studentId, AuditResourceType.CHRONIC_CONDITION, id);

      return condition;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get conditions due for review
   */
  async getConditionsDueForReview(): Promise<Array<{
    condition: ChronicCondition;
    daysPastDue: number;
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{ conditions: Array<{
        condition: ChronicCondition;
        daysPastDue: number;
      }> }>>(
        `${this.baseEndpoint}/due-for-review`
      );

      return response.data.data!.conditions;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get emergency protocols for a student's conditions
   */
  async getEmergencyProtocols(studentId: string): Promise<Array<{
    condition: string;
    severity: ConditionSeverity;
    protocol: string;
    triggers: string[];
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{ protocols: Array<{
        condition: string;
        severity: ConditionSeverity;
        protocol: string;
        triggers: string[];
      }> }>>(
        `${this.baseEndpoint}/student/${studentId}/emergency-protocols`
      );

      await this.logPHIAccess(AuditAction.VIEW_CHRONIC_CONDITIONS, studentId, AuditResourceType.CHRONIC_CONDITION);

      return response.data.data!.protocols;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}

/**
 * Factory function to create ChronicConditionsService
 */
export function createChronicConditionsService(client: ApiClient): ChronicConditionsService {
  return new ChronicConditionsService(client);
}
