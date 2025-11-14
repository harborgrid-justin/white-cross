/**
 * Health Records API - Vaccinations Management
 * 
 * Comprehensive vaccinations management including:
 * - Vaccination CRUD operations
 * - Compliance tracking and reporting
 * - Vaccination schedule management
 * - Exemption handling
 * - PHI access logging for HIPAA compliance
 * 
 * @module services/modules/healthRecordsApi/vaccinations
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
  Vaccination,
  VaccinationCreate,
  VaccinationUpdate,
  VaccinationCompliance
} from './types';
import {
  VaccinationStatus
} from './types';

// Validation schemas
const vaccinationCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  vaccineName: z.string().min(1, 'Vaccine name is required').max(255),
  vaccineType: z.string().min(1, 'Vaccine type is required').max(100),
  cvxCode: z.string().max(10).optional(),
  doseNumber: z.number().int().min(1).optional(),
  totalDoses: z.number().int().min(1).optional(),
  administeredDate: z.string().min(1, 'Administered date is required'),
  expirationDate: z.string().optional(),
  lotNumber: z.string().max(50).optional(),
  manufacturer: z.string().max(255).optional(),
  administeredBy: z.string().max(255).optional(),
  administeredByNPI: z.string().regex(/^\d{10}$/, 'NPI must be 10 digits').optional().or(z.literal('')),
  site: z.string().max(50).optional(),
  route: z.string().max(50).optional(),
  dosage: z.string().max(50).optional(),
  status: z.nativeEnum(VaccinationStatus).optional(),
  reactions: z.array(z.string()).optional(),
  notes: z.string().max(2000).optional(),
  nextDueDate: z.string().optional(),
});

const vaccinationUpdateSchema = z.object({
  vaccineName: z.string().min(1).max(255).optional(),
  vaccineType: z.string().min(1).max(100).optional(),
  cvxCode: z.string().max(10).optional(),
  doseNumber: z.number().int().min(1).optional(),
  totalDoses: z.number().int().min(1).optional(),
  administeredDate: z.string().optional(),
  expirationDate: z.string().optional(),
  lotNumber: z.string().max(50).optional(),
  manufacturer: z.string().max(255).optional(),
  administeredBy: z.string().max(255).optional(),
  administeredByNPI: z.string().regex(/^\d{10}$/, 'NPI must be 10 digits').optional().or(z.literal('')),
  site: z.string().max(50).optional(),
  route: z.string().max(50).optional(),
  dosage: z.string().max(50).optional(),
  status: z.nativeEnum(VaccinationStatus).optional(),
  reactions: z.array(z.string()).optional(),
  notes: z.string().max(2000).optional(),
  nextDueDate: z.string().optional(),
});

/**
 * Vaccinations Management Service
 */
export class VaccinationsService {
  private readonly baseEndpoint = `${API_ENDPOINTS.HEALTH_RECORDS.BASE}/vaccinations`;

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
   * Get all vaccinations for a student
   */
  async getVaccinations(studentId: string): Promise<Vaccination[]> {
    try {
      const response = await this.client.get<ApiResponse<{ vaccinations: Vaccination[] }>>(
        `${this.baseEndpoint}/student/${studentId}`
      );

      await this.logPHIAccess(AuditAction.VIEW_VACCINATIONS, studentId, AuditResourceType.VACCINATION);

      return response.data.data!.vaccinations;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get a single vaccination by ID
   */
  async getVaccinationById(id: string): Promise<Vaccination> {
    try {
      const response = await this.client.get<ApiResponse<Vaccination>>(
        `${this.baseEndpoint}/${id}`
      );

      const vaccination = response.data.data!;
      await this.logPHIAccess(AuditAction.VIEW_VACCINATION, vaccination.studentId, AuditResourceType.VACCINATION, id);

      return vaccination;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Create a new vaccination record
   */
  async createVaccination(data: VaccinationCreate): Promise<Vaccination> {
    try {
      vaccinationCreateSchema.parse(data);

      const response = await this.client.post<ApiResponse<Vaccination>>(
        this.baseEndpoint,
        data
      );

      const vaccination = response.data.data!;
      await this.logPHIAccess(AuditAction.CREATE_VACCINATION, data.studentId, AuditResourceType.VACCINATION, vaccination.id);

      return vaccination;
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
   * Update an existing vaccination
   */
  async updateVaccination(id: string, data: VaccinationUpdate): Promise<Vaccination> {
    try {
      vaccinationUpdateSchema.parse(data);

      const response = await this.client.put<ApiResponse<Vaccination>>(
        `${this.baseEndpoint}/${id}`,
        data
      );

      const vaccination = response.data.data!;
      await this.logPHIAccess(AuditAction.UPDATE_VACCINATION, vaccination.studentId, AuditResourceType.VACCINATION, id);

      return vaccination;
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
   * Delete a vaccination record
   */
  async deleteVaccination(id: string): Promise<void> {
    try {
      const vaccination = await this.getVaccinationById(id);
      await this.client.delete(`${this.baseEndpoint}/${id}`);
      await this.logPHIAccess(AuditAction.DELETE_VACCINATION, vaccination.studentId, AuditResourceType.VACCINATION, id);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Check vaccination compliance for a student
   */
  async checkCompliance(studentId: string): Promise<VaccinationCompliance> {
    try {
      const response = await this.client.get<ApiResponse<VaccinationCompliance>>(
        `${this.baseEndpoint}/student/${studentId}/compliance`
      );

      await this.logPHIAccess(AuditAction.CHECK_VACCINATION_COMPLIANCE, studentId, AuditResourceType.VACCINATION);

      return response.data.data!;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get vaccination schedule for a student based on age and requirements
   */
  async getSchedule(studentId: string): Promise<Array<{
    vaccineName: string;
    dueDate: string;
    ageAtDue: string;
    priority: 'high' | 'medium' | 'low';
    required: boolean;
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{ schedule: Array<{
        vaccineName: string;
        dueDate: string;
        ageAtDue: string;
        priority: 'high' | 'medium' | 'low';
        required: boolean;
      }> }>>(
        `${this.baseEndpoint}/student/${studentId}/schedule`
      );

      await this.logPHIAccess(AuditAction.VIEW_VACCINATIONS, studentId, AuditResourceType.VACCINATION);

      return response.data.data!.schedule;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get overdue vaccinations for a student
   */
  async getOverdueVaccinations(studentId: string): Promise<Array<{
    vaccineName: string;
    dueDate: string;
    daysPastDue: number;
    priority: 'high' | 'medium' | 'low';
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{ overdue: Array<{
        vaccineName: string;
        dueDate: string;
        daysPastDue: number;
        priority: 'high' | 'medium' | 'low';
      }> }>>(
        `${this.baseEndpoint}/student/${studentId}/overdue`
      );

      await this.logPHIAccess(AuditAction.VIEW_VACCINATIONS, studentId, AuditResourceType.VACCINATION);

      return response.data.data!.overdue;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Record an exemption for a vaccination
   */
  async recordExemption(studentId: string, data: {
    vaccineName: string;
    exemptionType: 'medical' | 'religious' | 'philosophical';
    reason?: string;
    exemptionDate: string;
    expirationDate?: string;
    providedBy?: string;
    documentationPath?: string;
  }): Promise<void> {
    try {
      await this.client.post(
        `${this.baseEndpoint}/student/${studentId}/exemptions`,
        data
      );

      await this.logPHIAccess(AuditAction.CREATE_VACCINATION, studentId, AuditResourceType.VACCINATION);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get exemptions for a student
   */
  async getExemptions(studentId: string): Promise<Array<{
    vaccineName: string;
    exemptionType: 'medical' | 'religious' | 'philosophical';
    reason?: string;
    exemptionDate: string;
    expirationDate?: string;
    providedBy?: string;
    isActive: boolean;
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{ exemptions: Array<{
        vaccineName: string;
        exemptionType: 'medical' | 'religious' | 'philosophical';
        reason?: string;
        exemptionDate: string;
        expirationDate?: string;
        providedBy?: string;
        isActive: boolean;
      }> }>>(
        `${this.baseEndpoint}/student/${studentId}/exemptions`
      );

      await this.logPHIAccess(AuditAction.VIEW_VACCINATIONS, studentId, AuditResourceType.VACCINATION);

      return response.data.data!.exemptions;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Generate vaccination report for a student
   */
  async generateReport(studentId: string, format: 'pdf' | 'json' = 'pdf'): Promise<Blob> {
    try {
      const response = await this.client.get<Blob>(
        `${this.baseEndpoint}/student/${studentId}/report?format=${format}`,
        { responseType: 'blob' }
      );

      await this.logPHIAccess(AuditAction.EXPORT_HEALTH_RECORDS, studentId, AuditResourceType.VACCINATION);

      return response.data;
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }

  /**
   * Get vaccination statistics for admin dashboard
   */
  async getStatistics(): Promise<{
    totalStudents: number;
    compliantStudents: number;
    complianceRate: number;
    overdueVaccinations: number;
    upcomingDue: number;
    exemptions: number;
    byVaccine: Array<{
      vaccineName: string;
      compliantCount: number;
      totalRequired: number;
      complianceRate: number;
    }>;
  }> {
    try {
      const response = await this.client.get<ApiResponse<{
        totalStudents: number;
        compliantStudents: number;
        complianceRate: number;
        overdueVaccinations: number;
        upcomingDue: number;
        exemptions: number;
        byVaccine: Array<{
          vaccineName: string;
          compliantCount: number;
          totalRequired: number;
          complianceRate: number;
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
   * Record adverse reaction to vaccination
   */
  async recordAdverseReaction(vaccinationId: string, reaction: {
    reactionType: string;
    severity: 'mild' | 'moderate' | 'severe';
    onsetTime: string;
    duration?: string;
    symptoms: string[];
    treatment?: string;
    reportedBy: string;
    reportedDate: string;
    notes?: string;
  }): Promise<void> {
    try {
      await this.client.post(
        `${this.baseEndpoint}/${vaccinationId}/adverse-reactions`,
        reaction
      );

      const vaccination = await this.getVaccinationById(vaccinationId);
      await this.logPHIAccess(AuditAction.UPDATE_VACCINATION, vaccination.studentId, AuditResourceType.VACCINATION, vaccinationId);
    } catch (error) {
      throw this.sanitizeError(error);
    }
  }
}

/**
 * Factory function to create VaccinationsService
 */
export function createVaccinationsService(client: ApiClient): VaccinationsService {
  return new VaccinationsService(client);
}
