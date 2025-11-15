/**
 * MIGRATION STATUS: DEPRECATED - SCHEDULED FOR REMOVAL IN v2.0.0
 *
 * Vaccinations API Service Module
 *
 * DEPRECATION TIMELINE:
 * - Deprecated: v1.5.0 (Current)
 * - Removal: v2.0.0 (Planned Q2 2025)
 *
 * REPLACEMENT: @/lib/actions/health-records.immunizations
 *
 * @deprecated Use Server Actions from @/lib/actions/health-records.immunizations instead. Will be removed in v2.0.0
 * @see {@link /lib/actions/health-records.immunizations.ts}
 * @see {@link ../healthRecordsApi.ts} - Complete migration guide
 *
 * Purpose: Manages immunization records and compliance tracking
 *
 * Features (now available in Server Actions):
 * - Vaccination record management
 * - Immunization schedule tracking
 * - Compliance monitoring
 * - State requirements validation
 * - Exemption documentation
 *
 * @module services/modules/health/vaccinations
 */

import { API_ENDPOINTS } from '@/constants/api';
import { z } from 'zod';
import { BaseApiService } from '@/services/core/BaseApiService';
import type { ApiClient } from '@/services/core/ApiClient';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/services/types';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface Vaccination {
  id: string;
  studentId: string;
  vaccine: string;
  vaccineCode?: string;
  manufacturer?: string;
  lotNumber?: string;
  doseNumber: number;
  seriesComplete: boolean;
  dateAdministered: string;
  expirationDate?: string;
  site?: string;
  route?: VaccineRoute;
  administeredBy?: string;
  providerName?: string;
  providerLicense?: string;
  nextDueDate?: string;
  isRequired: boolean;
  exemptionType?: ExemptionType;
  exemptionReason?: string;
  exemptionExpiration?: string;
  sideEffects?: string;
  notes?: string;
  documentUrl?: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    grade: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type VaccineRoute = 'IM' | 'SC' | 'PO' | 'IN' | 'ID' | 'OTHER';
export type ExemptionType = 'MEDICAL' | 'RELIGIOUS' | 'PHILOSOPHICAL' | 'OTHER';
export type ComplianceStatus = 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT' | 'EXEMPT';

export interface VaccinationCreate {
  studentId: string;
  vaccine: string;
  vaccineCode?: string;
  manufacturer?: string;
  lotNumber?: string;
  doseNumber: number;
  seriesComplete: boolean;
  dateAdministered: string;
  expirationDate?: string;
  site?: string;
  route?: VaccineRoute;
  administeredBy?: string;
  providerName?: string;
  providerLicense?: string;
  nextDueDate?: string;
  isRequired: boolean;
  sideEffects?: string;
  notes?: string;
}

export interface VaccinationUpdate extends Partial<VaccinationCreate> {
  exemptionType?: ExemptionType;
  exemptionReason?: string;
  exemptionExpiration?: string;
  documentUrl?: string;
}

export interface VaccinationFilters extends PaginationParams {
  vaccine?: string;
  isRequired?: boolean;
  seriesComplete?: boolean;
  overdue?: boolean;
  upcoming?: boolean;
  search?: string;
}

export interface VaccinationSchedule {
  vaccine: string;
  requiredDoses: number;
  recommendedAges: string[];
  minimumIntervals: string[];
  catchUpSchedule?: string;
  contraindications?: string[];
  stateRequired: boolean;
}

export interface ComplianceReport {
  studentId: string;
  complianceStatus: ComplianceStatus;
  requiredVaccines: Array<{
    vaccine: string;
    status: 'COMPLETE' | 'PARTIAL' | 'MISSING' | 'EXEMPT';
    dosesReceived: number;
    dosesRequired: number;
    nextDueDate?: string;
    exemption?: ExemptionType;
  }>;
  overallCompliance: number;
  missingVaccines: string[];
  upcomingVaccines: Array<{
    vaccine: string;
    dueDate: string;
  }>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const vaccinationCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  vaccine: z.string().min(1, 'Vaccine name is required').max(100),
  vaccineCode: z.string().max(20).optional(),
  manufacturer: z.string().max(100).optional(),
  lotNumber: z.string().max(50).optional(),
  doseNumber: z.number().int().positive(),
  seriesComplete: z.boolean(),
  dateAdministered: z.string().datetime(),
  expirationDate: z.string().datetime().optional(),
  site: z.string().max(50).optional(),
  route: z.enum(['IM', 'SC', 'PO', 'IN', 'ID', 'OTHER']).optional(),
  administeredBy: z.string().max(100).optional(),
  providerName: z.string().max(100).optional(),
  providerLicense: z.string().max(50).optional(),
  nextDueDate: z.string().datetime().optional(),
  isRequired: z.boolean(),
  sideEffects: z.string().max(500).optional(),
  notes: z.string().max(1000).optional()
});

const vaccinationUpdateSchema = vaccinationCreateSchema.partial().extend({
  exemptionType: z.enum(['MEDICAL', 'RELIGIOUS', 'PHILOSOPHICAL', 'OTHER']).optional(),
  exemptionReason: z.string().max(500).optional(),
  exemptionExpiration: z.string().datetime().optional(),
  documentUrl: z.string().url().optional()
});

// ==========================================
// API SERVICE CLASS
// ==========================================

export class VaccinationsApiService extends BaseApiService<
  Vaccination,
  VaccinationCreate,
  VaccinationUpdate
> {
  constructor(client: ApiClient) {
    super(client, `${API_ENDPOINTS.HEALTH_RECORDS}/vaccinations`, {
      createSchema: vaccinationCreateSchema,
      updateSchema: vaccinationUpdateSchema
    });
  }

  /**
   * Get vaccinations for a specific student
   */
  async getStudentVaccinations(
    studentId: string,
    filters?: Omit<VaccinationFilters, 'page' | 'limit'>
  ): Promise<Vaccination[]> {
    this.validateId(studentId);

    const params = this.buildQueryParams({
      ...filters,
      studentId
    });

    const response = await this.client.get<ApiResponse<Vaccination[]>>(
      `${this.baseEndpoint}/student/${studentId}${params}`
    );

    await this.logPHIAccess('VIEW_VACCINATIONS', studentId);
    return this.extractData(response);
  }

  /**
   * Get vaccination compliance report for student
   */
  async getComplianceReport(studentId: string): Promise<ComplianceReport> {
    this.validateId(studentId);

    const response = await this.client.get<ApiResponse<ComplianceReport>>(
      `${this.baseEndpoint}/student/${studentId}/compliance`
    );

    await this.logPHIAccess('VIEW_VACCINATION_COMPLIANCE', studentId);
    return this.extractData(response);
  }

  /**
   * Check if student is compliant with state requirements
   */
  async checkStateCompliance(
    studentId: string,
    stateCode: string = 'DEFAULT'
  ): Promise<{
    isCompliant: boolean;
    missingVaccines: string[];
    exemptions: Array<{ vaccine: string; type: ExemptionType }>;
  }> {
    this.validateId(studentId);

    const response = await this.client.get<ApiResponse<any>>(
      `${this.baseEndpoint}/student/${studentId}/state-compliance/${stateCode}`
    );

    await this.logPHIAccess('CHECK_STATE_COMPLIANCE', studentId);
    return this.extractData(response);
  }

  /**
   * Get vaccination schedule for age/grade
   */
  async getVaccinationSchedule(
    ageOrGrade: string
  ): Promise<VaccinationSchedule[]> {
    const response = await this.client.get<ApiResponse<VaccinationSchedule[]>>(
      `${this.baseEndpoint}/schedule/${ageOrGrade}`
    );

    return this.extractData(response);
  }

  /**
   * Record vaccine exemption
   */
  async recordExemption(
    studentId: string,
    exemption: {
      vaccine: string;
      type: ExemptionType;
      reason: string;
      expirationDate?: string;
      documentUrl?: string;
    }
  ): Promise<Vaccination> {
    this.validateId(studentId);

    const response = await this.client.post<ApiResponse<Vaccination>>(
      `${this.baseEndpoint}/exemptions`,
      {
        studentId,
        ...exemption
      }
    );

    const vaccination = this.extractData(response);
    await this.logPHIAccess('RECORD_EXEMPTION', studentId, 'VACCINATION', vaccination.id);
    return vaccination;
  }

  /**
   * Get overdue vaccinations
   */
  async getOverdueVaccinations(
    schoolId?: string,
    gradeLevel?: string
  ): Promise<PaginatedResponse<{
    student: {
      id: string;
      name: string;
      grade: string;
    };
    overdueVaccines: Array<{
      vaccine: string;
      dueDate: string;
      daysOverdue: number;
    }>;
  }>> {
    const params = this.buildQueryParams({
      schoolId,
      gradeLevel,
      overdue: true
    });

    const response = await this.client.get<PaginatedResponse<any>>(
      `${this.baseEndpoint}/overdue${params}`
    );

    return response.data;
  }

  /**
   * Bulk import vaccination records
   */
  async bulkImport(
    studentId: string,
    vaccinations: VaccinationCreate[]
  ): Promise<{
    imported: number;
    failed: number;
    errors: string[];
  }> {
    this.validateId(studentId);

    // Validate all vaccinations
    vaccinations.forEach(vaccination => {
      vaccinationCreateSchema.parse(vaccination);
    });

    const response = await this.client.post<ApiResponse<any>>(
      `${this.baseEndpoint}/bulk-import`,
      {
        studentId,
        vaccinations
      }
    );

    await this.logPHIAccess('BULK_IMPORT_VACCINATIONS', studentId);
    return this.extractData(response);
  }

  /**
   * Generate vaccination certificate
   */
  async generateCertificate(
    studentId: string,
    format: 'PDF' | 'DOCX' = 'PDF'
  ): Promise<Blob> {
    this.validateId(studentId);

    const response = await this.client.get(
      `${this.baseEndpoint}/student/${studentId}/certificate`,
      {
        params: { format },
        responseType: 'blob'
      }
    );

    await this.logPHIAccess('GENERATE_VACCINATION_CERTIFICATE', studentId);
    return response.data as Blob;
  }

  /**
   * Get district-wide compliance statistics
   */
  async getDistrictComplianceStats(
    districtId: string
  ): Promise<{
    totalStudents: number;
    compliant: number;
    partial: number;
    nonCompliant: number;
    exempt: number;
    complianceRate: number;
    bySchool: Array<{
      schoolId: string;
      schoolName: string;
      complianceRate: number;
    }>;
    byGrade: Array<{
      grade: string;
      complianceRate: number;
    }>;
    byVaccine: Array<{
      vaccine: string;
      coverageRate: number;
    }>;
  }> {
    this.validateId(districtId);

    const response = await this.client.get<ApiResponse<any>>(
      `${this.baseEndpoint}/statistics/district/${districtId}`
    );

    return this.extractData(response);
  }

  /**
   * Override to add PHI logging
   */
  async create(data: VaccinationCreate): Promise<Vaccination> {
    const vaccination = await super.create(data);
    await this.logPHIAccess('CREATE_VACCINATION', data.studentId, 'VACCINATION', vaccination.id);
    return vaccination;
  }

  /**
   * Override to add PHI logging
   */
  async update(id: string, data: VaccinationUpdate): Promise<Vaccination> {
    const vaccination = await super.update(id, data);
    await this.logPHIAccess('UPDATE_VACCINATION', vaccination.studentId, 'VACCINATION', id);
    return vaccination;
  }

  /**
   * Override to add PHI logging
   */
  async delete(id: string): Promise<void> {
    const vaccination = await this.getById(id);
    await super.delete(id);
    await this.logPHIAccess('DELETE_VACCINATION', vaccination.studentId, 'VACCINATION', id);
  }

  /**
   * Log PHI access for compliance
   */
  private async logPHIAccess(
    action: string,
    studentId: string,
    recordType: string = 'VACCINATION',
    recordId?: string
  ): Promise<void> {
    try {
      await this.client.post(API_ENDPOINTS.AUDIT.PHI_ACCESS_LOG, {
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

export function createVaccinationsApi(client: ApiClient): VaccinationsApiService {
  return new VaccinationsApiService(client);
}
