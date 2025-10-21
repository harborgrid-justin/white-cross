/**
 * Main Health Records API Service Module
 *
 * Purpose: Core health records management and orchestration
 *
 * Features:
 * - General health record CRUD operations
 * - Health summary and overview
 * - Cross-module coordination
 * - Export/import functionality
 * - Search and filtering
 *
 * @module services/modules/health/healthRecords
 */

import { apiInstance, API_ENDPOINTS } from '../../config/apiConfig';
import { z } from 'zod';
import { BaseApiService } from '../../core/BaseApiService';
import { ApiClient } from '../../core/ApiClient';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../../types';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface HealthRecord {
  id: string;
  studentId: string;
  type: HealthRecordType;
  date: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  provider?: string;
  providerNPI?: string;
  location?: string;
  notes?: string;
  attachments?: string[];
  isConfidential: boolean;
  followUpRequired: boolean;
  followUpDate?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type HealthRecordType =
  | 'GENERAL_VISIT'
  | 'INJURY'
  | 'ILLNESS'
  | 'MEDICATION'
  | 'VACCINATION'
  | 'SCREENING'
  | 'PHYSICAL_EXAM'
  | 'EMERGENCY'
  | 'MENTAL_HEALTH'
  | 'DENTAL'
  | 'VISION'
  | 'HEARING'
  | 'OTHER';

export interface HealthRecordCreate {
  studentId: string;
  type: HealthRecordType;
  date: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  provider?: string;
  providerNPI?: string;
  location?: string;
  notes?: string;
  attachments?: string[];
  isConfidential: boolean;
  followUpRequired: boolean;
  followUpDate?: string;
}

export interface HealthRecordUpdate extends Partial<HealthRecordCreate> {}

export interface HealthRecordFilters extends PaginationParams {
  studentId?: string;
  type?: HealthRecordType;
  dateFrom?: string;
  dateTo?: string;
  isConfidential?: boolean;
  followUpRequired?: boolean;
  search?: string;
}

export interface HealthSummary {
  studentId: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    grade: string;
    studentNumber: string;
  };
  overview: {
    totalRecords: number;
    lastVisit?: string;
    nextScheduledVisit?: string;
    activeConditions: number;
    activeAllergies: number;
    currentMedications: number;
  };
  recentActivity: Array<{
    date: string;
    type: string;
    description: string;
  }>;
  upcomingAppointments: Array<{
    date: string;
    type: string;
    provider?: string;
  }>;
  alerts: Array<{
    type: 'ALLERGY' | 'CONDITION' | 'MEDICATION' | 'VACCINATION' | 'FOLLOW_UP';
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    message: string;
  }>;
  complianceStatus: {
    vaccinations: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT';
    screenings: 'UP_TO_DATE' | 'DUE' | 'OVERDUE';
    physicalExam: 'CURRENT' | 'DUE' | 'EXPIRED';
  };
}

export interface ExportOptions {
  studentId: string;
  format: 'PDF' | 'JSON' | 'CSV' | 'CCD';
  includeTypes?: HealthRecordType[];
  dateFrom?: string;
  dateTo?: string;
  includeConfidential?: boolean;
  includeSummary?: boolean;
  includeAllergies?: boolean;
  includeConditions?: boolean;
  includeVaccinations?: boolean;
  includeVitals?: boolean;
  includeMedications?: boolean;
}

export interface ImportResult {
  success: boolean;
  recordsImported: number;
  recordsFailed: number;
  errors: string[];
  warnings: string[];
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const healthRecordCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  type: z.enum([
    'GENERAL_VISIT', 'INJURY', 'ILLNESS', 'MEDICATION', 'VACCINATION',
    'SCREENING', 'PHYSICAL_EXAM', 'EMERGENCY', 'MENTAL_HEALTH',
    'DENTAL', 'VISION', 'HEARING', 'OTHER'
  ]),
  date: z.string().datetime(),
  description: z.string().min(1, 'Description is required').max(500),
  diagnosis: z.string().max(200).optional(),
  treatment: z.string().max(500).optional(),
  provider: z.string().max(100).optional(),
  providerNPI: z.string().regex(/^\d{10}$/, 'Invalid NPI format').optional(),
  location: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),
  attachments: z.array(z.string().url()).optional(),
  isConfidential: z.boolean(),
  followUpRequired: z.boolean(),
  followUpDate: z.string().datetime().optional()
});

const healthRecordUpdateSchema = healthRecordCreateSchema.partial();

// ==========================================
// API SERVICE CLASS
// ==========================================

export class HealthRecordsApiService extends BaseApiService<
  HealthRecord,
  HealthRecordCreate,
  HealthRecordUpdate
> {
  constructor() {
    const client = new ApiClient(apiInstance);
    super(client, API_ENDPOINTS.HEALTH_RECORDS, {
      createSchema: healthRecordCreateSchema,
      updateSchema: healthRecordUpdateSchema
    });
  }

  /**
   * Get health records for a specific student
   */
  async getStudentRecords(
    studentId: string,
    filters?: Omit<HealthRecordFilters, 'studentId'>
  ): Promise<PaginatedResponse<HealthRecord>> {
    this.validateId(studentId);

    const params = this.buildQueryParams({
      ...filters,
      studentId
    });

    const response = await this.client.get<PaginatedResponse<HealthRecord>>(
      `${this.baseEndpoint}/student/${studentId}${params}`
    );

    await this.logPHIAccess('VIEW_HEALTH_RECORDS', studentId);
    return response.data;
  }

  /**
   * Get health summary for a student
   */
  async getHealthSummary(studentId: string): Promise<HealthSummary> {
    this.validateId(studentId);

    const response = await this.client.get<ApiResponse<HealthSummary>>(
      `${this.baseEndpoint}/student/${studentId}/summary`
    );

    await this.logPHIAccess('VIEW_HEALTH_SUMMARY', studentId);
    return this.extractData(response);
  }

  /**
   * Search health records across students
   */
  async searchRecords(
    searchParams: {
      query: string;
      type?: HealthRecordType;
      dateFrom?: string;
      dateTo?: string;
      schoolId?: string;
      includeConfidential?: boolean;
    } & PaginationParams
  ): Promise<PaginatedResponse<HealthRecord>> {
    if (!searchParams.query || searchParams.query.length < 3) {
      throw new Error('Search query must be at least 3 characters');
    }

    const params = this.buildQueryParams(searchParams);
    const response = await this.client.get<PaginatedResponse<HealthRecord>>(
      `${this.baseEndpoint}/search${params}`
    );

    // Log search access
    await this.logPHIAccess('SEARCH_HEALTH_RECORDS', 'MULTIPLE');

    return response.data;
  }

  /**
   * Export health records
   */
  async exportRecords(options: ExportOptions): Promise<Blob> {
    this.validateId(options.studentId);

    const response = await this.client.post(
      `${this.baseEndpoint}/export`,
      options,
      { responseType: 'blob' }
    );

    await this.logPHIAccess('EXPORT_HEALTH_RECORDS', options.studentId);
    return response.data as Blob;
  }

  /**
   * Import health records
   */
  async importRecords(
    studentId: string,
    file: File,
    format: 'JSON' | 'CSV' | 'CCD'
  ): Promise<ImportResult> {
    this.validateId(studentId);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('studentId', studentId);
    formData.append('format', format);

    const response = await this.client.post<ApiResponse<ImportResult>>(
      `${this.baseEndpoint}/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    await this.logPHIAccess('IMPORT_HEALTH_RECORDS', studentId);
    return this.extractData(response);
  }

  /**
   * Get follow-up required records
   */
  async getFollowUpRequired(
    schoolId?: string,
    overdue?: boolean
  ): Promise<PaginatedResponse<HealthRecord>> {
    const params = this.buildQueryParams({
      followUpRequired: true,
      schoolId,
      overdue
    });

    const response = await this.client.get<PaginatedResponse<HealthRecord>>(
      `${this.baseEndpoint}/follow-up-required${params}`
    );

    return response.data;
  }

  /**
   * Complete follow-up for a record
   */
  async completeFollowUp(
    recordId: string,
    followUpData: {
      completionDate: string;
      notes: string;
      nextFollowUpDate?: string;
    }
  ): Promise<HealthRecord> {
    this.validateId(recordId);

    const response = await this.client.post<ApiResponse<HealthRecord>>(
      `${this.baseEndpoint}/${recordId}/complete-follow-up`,
      followUpData
    );

    const record = this.extractData(response);
    await this.logPHIAccess('COMPLETE_FOLLOW_UP', record.studentId, 'HEALTH_RECORD', recordId);
    return record;
  }

  /**
   * Attach document to health record
   */
  async attachDocument(
    recordId: string,
    file: File,
    description?: string
  ): Promise<{ url: string; id: string }> {
    this.validateId(recordId);

    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }

    const response = await this.client.post<ApiResponse<{ url: string; id: string }>>(
      `${this.baseEndpoint}/${recordId}/attachments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    const record = await this.getById(recordId);
    await this.logPHIAccess('ATTACH_DOCUMENT', record.studentId, 'HEALTH_RECORD', recordId);
    return this.extractData(response);
  }

  /**
   * Get health statistics
   */
  async getHealthStatistics(
    scope: 'school' | 'district',
    scopeId: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    totalRecords: number;
    byType: Record<HealthRecordType, number>;
    topDiagnoses: Array<{ diagnosis: string; count: number }>;
    visitTrends: Array<{ date: string; count: number }>;
    emergencyRate: number;
    followUpCompletionRate: number;
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
   * Mark record as confidential
   */
  async markConfidential(
    recordId: string,
    reason: string
  ): Promise<HealthRecord> {
    this.validateId(recordId);

    const response = await this.client.post<ApiResponse<HealthRecord>>(
      `${this.baseEndpoint}/${recordId}/mark-confidential`,
      { reason }
    );

    const record = this.extractData(response);
    await this.logPHIAccess('MARK_CONFIDENTIAL', record.studentId, 'HEALTH_RECORD', recordId);
    return record;
  }

  /**
   * Override to add PHI logging
   */
  async create(data: HealthRecordCreate): Promise<HealthRecord> {
    const record = await super.create(data);
    await this.logPHIAccess('CREATE_HEALTH_RECORD', data.studentId, 'HEALTH_RECORD', record.id);
    return record;
  }

  /**
   * Override to add PHI logging
   */
  async update(id: string, data: HealthRecordUpdate): Promise<HealthRecord> {
    const record = await super.update(id, data);
    await this.logPHIAccess('UPDATE_HEALTH_RECORD', record.studentId, 'HEALTH_RECORD', id);
    return record;
  }

  /**
   * Override to add PHI logging
   */
  async delete(id: string): Promise<void> {
    const record = await this.getById(id);
    await super.delete(id);
    await this.logPHIAccess('DELETE_HEALTH_RECORD', record.studentId, 'HEALTH_RECORD', id);
  }

  /**
   * Override to add PHI logging
   */
  async getById(id: string): Promise<HealthRecord> {
    const record = await super.getById(id);
    await this.logPHIAccess('VIEW_HEALTH_RECORD', record.studentId, 'HEALTH_RECORD', id);
    return record;
  }

  /**
   * Log PHI access for compliance
   */
  private async logPHIAccess(
    action: string,
    studentId: string,
    recordType: string = 'HEALTH_RECORD',
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

  // ==========================================
  // BACKWARD COMPATIBILITY ALIASES
  // ==========================================

  getRecords = this.getStudentRecords.bind(this);
  getSummary = this.getHealthSummary.bind(this);
  getRecordById = this.getById.bind(this);
  createRecord = this.create.bind(this);
  updateRecord = this.update.bind(this);
  deleteRecord = this.delete.bind(this);
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const healthRecordsApi = new HealthRecordsApiService();