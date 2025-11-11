/**
 * Chronic Conditions & Vaccinations API Operations
 * 
 * Combined operations for:
 * - Chronic conditions management and care plans
 * - Vaccinations and compliance tracking
 * - PHI access logging and compliance
 *
 * @module services/modules/healthRecords/conditionsVaccinationsApi
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '../../config/apiConfig';
import { z } from 'zod';
import type { ApiResponse } from '../../types';
import { auditService, AuditAction, AuditResourceType } from '../../audit';
import { createApiError, createValidationError } from '../../core/errors';
import type {
  ChronicCondition,
  ChronicConditionCreate,
  ChronicConditionUpdate,
  CarePlanUpdate,
  Vaccination,
  VaccinationCreate,
  VaccinationUpdate,
  VaccinationCompliance
} from './types';
import {
  chronicConditionCreateSchema,
  chronicConditionUpdateSchema,
  carePlanUpdateSchema,
  vaccinationCreateSchema,
  vaccinationUpdateSchema
} from './schemas';

export class ConditionsVaccinationsApi {
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
  // CHRONIC CONDITIONS OPERATIONS
  // ==========================================

  async getConditions(studentId: string): Promise<ChronicCondition[]> {
    try {
      const response = await this.client.get<ApiResponse<{ conditions: ChronicCondition[] }>>(
        `${this.baseEndpoint}/conditions/student/${studentId}`
      );

      await this.logPHIAccess(
        AuditAction.VIEW_CHRONIC_CONDITIONS,
        studentId,
        AuditResourceType.CHRONIC_CONDITION
      );

      return response.data.data!.conditions;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  async getConditionById(id: string): Promise<ChronicCondition> {
    try {
      const response = await this.client.get<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/conditions/${id}`
      );

      const condition = response.data.data!;
      await this.logPHIAccess(
        AuditAction.VIEW_CHRONIC_CONDITION,
        condition.studentId,
        AuditResourceType.CHRONIC_CONDITION,
        id
      );

      return condition;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  async createCondition(data: ChronicConditionCreate): Promise<ChronicCondition> {
    try {
      chronicConditionCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/conditions`,
        data
      );

      const condition = response.data.data!;
      await this.logPHIAccess(
        AuditAction.CREATE_CHRONIC_CONDITION,
        data.studentId,
        AuditResourceType.CHRONIC_CONDITION,
        condition.id
      );

      return condition;
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

  async updateCondition(id: string, data: ChronicConditionUpdate): Promise<ChronicCondition> {
    try {
      chronicConditionUpdateSchema.parse(data);

      const response = await this.client.put<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/conditions/${id}`,
        data
      );

      const condition = response.data.data!;
      await this.logPHIAccess(
        AuditAction.UPDATE_CHRONIC_CONDITION,
        condition.studentId,
        AuditResourceType.CHRONIC_CONDITION,
        id
      );

      return condition;
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

  async updateCarePlan(id: string, carePlan: CarePlanUpdate): Promise<ChronicCondition> {
    try {
      carePlanUpdateSchema.parse(carePlan);

      const response = await this.client.post<ApiResponse<ChronicCondition>>(
        `${this.baseEndpoint}/conditions/${id}/care-plan`,
        carePlan
      );

      const condition = response.data.data!;
      await this.logPHIAccess(
        AuditAction.UPDATE_CHRONIC_CONDITION,
        condition.studentId,
        AuditResourceType.CHRONIC_CONDITION,
        id
      );

      return condition;
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

  async deleteCondition(id: string): Promise<void> {
    try {
      const condition = await this.getConditionById(id);
      await this.client.delete(`${this.baseEndpoint}/conditions/${id}`);
      await this.logPHIAccess(
        AuditAction.DELETE_CHRONIC_CONDITION,
        condition.studentId,
        AuditResourceType.CHRONIC_CONDITION,
        id
      );
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  // ==========================================
  // VACCINATIONS OPERATIONS
  // ==========================================

  async getVaccinations(studentId: string): Promise<Vaccination[]> {
    try {
      const response = await this.client.get<ApiResponse<{ vaccinations: Vaccination[] }>>(
        `${this.baseEndpoint}/vaccinations/student/${studentId}`
      );

      await this.logPHIAccess(
        AuditAction.VIEW_VACCINATIONS,
        studentId,
        AuditResourceType.VACCINATION
      );

      return response.data.data!.vaccinations;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  async getVaccinationById(id: string): Promise<Vaccination> {
    try {
      const response = await this.client.get<ApiResponse<Vaccination>>(
        `${this.baseEndpoint}/vaccinations/${id}`
      );

      const vaccination = response.data.data!;
      await this.logPHIAccess(
        AuditAction.VIEW_VACCINATION,
        vaccination.studentId,
        AuditResourceType.VACCINATION,
        id
      );

      return vaccination;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  async createVaccination(data: VaccinationCreate): Promise<Vaccination> {
    try {
      vaccinationCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<Vaccination>>(
        `${this.baseEndpoint}/vaccinations`,
        data
      );

      const vaccination = response.data.data!;
      await this.logPHIAccess(
        AuditAction.CREATE_VACCINATION,
        data.studentId,
        AuditResourceType.VACCINATION,
        vaccination.id
      );

      return vaccination;
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

  async updateVaccination(id: string, data: VaccinationUpdate): Promise<Vaccination> {
    try {
      vaccinationUpdateSchema.parse(data);

      const response = await this.client.put<ApiResponse<Vaccination>>(
        `${this.baseEndpoint}/vaccinations/${id}`,
        data
      );

      const vaccination = response.data.data!;
      await this.logPHIAccess(
        AuditAction.UPDATE_VACCINATION,
        vaccination.studentId,
        AuditResourceType.VACCINATION,
        id
      );

      return vaccination;
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

  async deleteVaccination(id: string): Promise<void> {
    try {
      const vaccination = await this.getVaccinationById(id);
      await this.client.delete(`${this.baseEndpoint}/vaccinations/${id}`);
      await this.logPHIAccess(
        AuditAction.DELETE_VACCINATION,
        vaccination.studentId,
        AuditResourceType.VACCINATION,
        id
      );
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  async checkCompliance(studentId: string): Promise<VaccinationCompliance> {
    try {
      const response = await this.client.get<ApiResponse<VaccinationCompliance>>(
        `${this.baseEndpoint}/vaccinations/student/${studentId}/compliance`
      );

      await this.logPHIAccess(
        AuditAction.CHECK_VACCINATION_COMPLIANCE,
        studentId,
        AuditResourceType.VACCINATION
      );

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}
