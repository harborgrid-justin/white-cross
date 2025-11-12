/**
 * Chronic Conditions API Module
 *
 * Handles chronic condition management including:
 * - CRUD operations for chronic conditions
 * - Care plan management
 * - Condition status tracking
 *
 * @module services/modules/healthRecords/api/chronicConditionsApi
 */

import type { ApiClient } from '../../../core/ApiClient';
import { API_ENDPOINTS } from '../../../config/apiConfig';
import { z, type ZodIssue } from 'zod';
import { ApiResponse } from '../../../types';
import { AuditAction, AuditResourceType } from '../../../audit';
import { createValidationError } from '../../../core/errors';
import { BaseHealthApi } from './baseHealthApi';
import type {
  ChronicCondition,
  ChronicConditionCreate,
  ChronicConditionUpdate,
  CarePlanUpdate,
} from '../types';
import {
  chronicConditionCreateSchema,
  carePlanUpdateSchema,
} from '../validation/schemas';

/**
 * Chronic Conditions API client
 * Manages chronic conditions and care plans
 */
export class ChronicConditionsApiClient extends BaseHealthApi {
  private readonly baseEndpoint = API_ENDPOINTS.HEALTH_RECORDS.BASE;

  constructor(client: ApiClient) {
    super(client);
  }

  /**
   * Get all chronic conditions for a student
   *
   * @param studentId - The student ID
   * @returns List of chronic conditions
   */
  async getConditions(studentId: string): Promise<ChronicCondition[]> {
    try {
      const response = await this.client.get<ApiResponse<{ conditions: ChronicCondition[] }>>(
        `${this.baseEndpoint}/conditions/student/${studentId}`
      );

      await this.logPHIAccess(AuditAction.VIEW_CHRONIC_CONDITIONS, studentId, AuditResourceType.CHRONIC_CONDITION);

      return response.data.data!.conditions;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single chronic condition by ID
   *
   * @param id - The condition ID
   * @returns The chronic condition record
   */
  async getConditionById(id: string): Promise<ChronicCondition> {
    try {
      const response = await this.client.get<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/conditions/${id}`
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
   *
   * @param data - The condition data
   * @returns The created chronic condition
   */
  async createCondition(data: ChronicConditionCreate): Promise<ChronicCondition> {
    try {
      chronicConditionCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/conditions`,
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
   *
   * @param id - The condition ID
   * @param data - The update data
   * @returns The updated chronic condition
   */
  async updateCondition(id: string, data: ChronicConditionUpdate): Promise<ChronicCondition> {
    try {
      const response = await this.client.put<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/conditions/${id}`,
        data
      );

      const condition = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_CHRONIC_CONDITION, condition.studentId, AuditResourceType.CHRONIC_CONDITION, id);

      return condition;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Update care plan for a chronic condition
   *
   * @param id - The condition ID
   * @param carePlan - The care plan data
   * @returns The updated chronic condition
   */
  async updateCarePlan(id: string, carePlan: CarePlanUpdate): Promise<ChronicCondition> {
    try {
      carePlanUpdateSchema.parse(carePlan);

      const response = await this.client.post<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/conditions/${id}/care-plan`,
        carePlan
      );

      const condition = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_CARE_PLAN, condition.studentId, AuditResourceType.CHRONIC_CONDITION, id);

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
   *
   * @param id - The condition ID
   */
  async deleteCondition(id: string): Promise<void> {
    try {
      const condition = await this.getConditionById(id);
      await this.client.delete(`${this.baseEndpoint}/conditions/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_CHRONIC_CONDITION, condition.studentId, AuditResourceType.CHRONIC_CONDITION, id);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}
