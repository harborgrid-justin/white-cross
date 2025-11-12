/**
 * @fileoverview Main Health Records API Service Module - Core Orchestrator for Student Health Data
 * @module services/modules/health/healthRecords
 * @category Services
 *
 * Comprehensive health records management system serving as the primary orchestration point
 * for all student health data. Coordinates with specialized health modules (allergies, vaccinations,
 * vital signs, etc.) to provide unified health record management and reporting.
 *
 * Core Features:
 * - Complete CRUD operations for general health records
 * - Comprehensive health summary aggregation across all health domains
 * - Advanced search and filtering with multi-criteria support
 * - Export/import functionality supporting PDF, JSON, CSV, and CCD formats (delegated to export service)
 * - Follow-up tracking and completion workflows (delegated to follow-up service)
 * - Document attachment management (delegated to follow-up service)
 * - Confidential record flagging and access control (delegated to follow-up service)
 * - Statistics and analytics (delegated to statistics service)
 * - Cross-module data coordination and integration
 *
 * Healthcare Safety Features:
 * - Automatic PHI (Protected Health Information) access logging for HIPAA compliance
 * - Confidential record isolation with enhanced access controls
 * - Emergency record flagging for critical care coordination
 * - Follow-up requirement tracking to prevent missed care
 * - Comprehensive audit trail for all record modifications
 * - Multi-level data export with sensitivity filtering
 *
 * HIPAA Compliance:
 * - All PHI access automatically logged with action, user, timestamp
 * - Confidential records require explicit access authorization
 * - Audit logs maintain 7-year retention per HIPAA requirements
 * - Export operations include only authorized data per user permissions
 * - Encryption in transit and at rest for all health data
 * - Patient consent tracking for data disclosure
 *
 * Integration Points:
 * - Coordinates with allergies module for safety alerts
 * - Links to chronic conditions for care plan coordination
 * - Integrates vaccinations for compliance reporting
 * - Connects to vital signs for critical value monitoring
 * - Aggregates screenings for compliance tracking
 * - Pulls growth data for developmental assessments
 *
 * @example
 * ```typescript
 * import { createHealthRecordsApi } from '@/services/modules/health';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * // Initialize health records API
 * const healthApi = createHealthRecordsApi(apiClient);
 *
 * // Get comprehensive health summary for a student
 * const summary = await healthApi.getHealthSummary('student-uuid');
 * console.log(`Total Records: ${summary.overview.totalRecords}`);
 * console.log(`Active Conditions: ${summary.overview.activeConditions}`);
 * console.log(`Vaccination Status: ${summary.complianceStatus.vaccinations}`);
 *
 * // Create new health record with follow-up
 * const newRecord = await healthApi.create({
 *   studentId: 'student-uuid',
 *   type: 'ILLNESS',
 *   date: new Date().toISOString(),
 *   description: 'Student reported persistent headache',
 *   diagnosis: 'Tension headache',
 *   treatment: 'Rest, hydration, acetaminophen as needed',
 *   provider: 'School Nurse Johnson',
 *   isConfidential: false,
 *   followUpRequired: true,
 *   followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
 * });
 *
 * // Export comprehensive health records
 * const pdfReport = await healthApi.exportRecords({
 *   studentId: 'student-uuid',
 *   format: 'PDF',
 *   dateFrom: '2024-01-01T00:00:00Z',
 *   dateTo: new Date().toISOString(),
 *   includeAllergies: true,
 *   includeConditions: true,
 *   includeVaccinations: true,
 *   includeSummary: true
 * });
 * // pdfReport is a Blob ready for download or printing
 * ```
 */

import { API_ENDPOINTS } from '@/constants/api';
import { BaseApiService } from '@/services/core/BaseApiService';
import type { ApiClient } from '@/services/core/ApiClient';
import type { ApiResponse, PaginatedResponse } from '@/services/types';

// Import types from separate type definitions file
import type {
  HealthRecord,
  HealthRecordCreate,
  HealthRecordUpdate,
  HealthRecordFilters,
  HealthSummary,
  HealthRecordSearchParams,
  ExportOptions,
  ImportResult,
  FollowUpCompletionData,
  DocumentAttachmentResult,
  HealthStatistics
} from './healthRecordsTypes';

// Import validation schemas from separate schemas file
import {
  healthRecordCreateSchema,
  healthRecordUpdateSchema
} from './healthRecordsSchemas';

// Import specialized service modules
import {
  createHealthRecordsPHILogger,
  type HealthRecordsPHILogger
} from './healthRecordsPHI';
import {
  createHealthRecordsExportService,
  type HealthRecordsExportService
} from './healthRecordsExport';
import {
  createHealthRecordsFollowUpService,
  type HealthRecordsFollowUpService
} from './healthRecordsFollowUp';
import {
  createHealthRecordsStatisticsService,
  type HealthRecordsStatisticsService
} from './healthRecordsStatistics';

/**
 * Health Records API Service
 *
 * @class
 * @extends BaseApiService<HealthRecord, HealthRecordCreate, HealthRecordUpdate>
 * @description
 * Main orchestration service for health records management. Provides CRUD operations,
 * advanced search, and delegates specialized operations to focused service modules.
 *
 * Specialized Service Delegation:
 * - Export/Import: HealthRecordsExportService
 * - Follow-Up: HealthRecordsFollowUpService
 * - Statistics: HealthRecordsStatisticsService
 * - PHI Logging: HealthRecordsPHILogger
 */
export class HealthRecordsApiService extends BaseApiService<
  HealthRecord,
  HealthRecordCreate,
  HealthRecordUpdate
> {
  private phiLogger: HealthRecordsPHILogger;
  private exportService: HealthRecordsExportService;
  private followUpService: HealthRecordsFollowUpService;
  private statisticsService: HealthRecordsStatisticsService;

  constructor(client: ApiClient) {
    super(client, API_ENDPOINTS.HEALTH_RECORDS.BASE, {
      createSchema: healthRecordCreateSchema,
      updateSchema: healthRecordUpdateSchema
    });

    // Initialize specialized service modules
    this.phiLogger = createHealthRecordsPHILogger(client);
    this.exportService = createHealthRecordsExportService(client);
    this.followUpService = createHealthRecordsFollowUpService(client);
    this.statisticsService = createHealthRecordsStatisticsService(client);
  }

  // ==========================================
  // CORE HEALTH RECORDS OPERATIONS
  // ==========================================

  /**
   * Get health records for a specific student with filtering and pagination
   * Automatically logs PHI access for HIPAA compliance.
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

    await this.phiLogger.logPHIAccess('VIEW_HEALTH_RECORDS', studentId);
    return response.data;
  }

  /**
   * Get comprehensive health summary for a student across all health domains
   * Automatically logs PHI access for HIPAA compliance.
   */
  async getHealthSummary(studentId: string): Promise<HealthSummary> {
    this.validateId(studentId);

    const response = await this.client.get<ApiResponse<HealthSummary>>(
      `${this.baseEndpoint}/student/${studentId}/summary`
    );

    await this.phiLogger.logPHIAccess('VIEW_HEALTH_SUMMARY', studentId);
    return this.extractData(response);
  }

  /**
   * Search health records across students
   * Performs full-text search with optional filtering. Automatically logs PHI access.
   */
  async searchRecords(
    searchParams: HealthRecordSearchParams
  ): Promise<PaginatedResponse<HealthRecord>> {
    if (!searchParams.query || searchParams.query.length < 3) {
      throw new Error('Search query must be at least 3 characters');
    }

    const params = this.buildQueryParams(searchParams);
    const response = await this.client.get<PaginatedResponse<HealthRecord>>(
      `${this.baseEndpoint}/search${params}`
    );

    // Log search access
    await this.phiLogger.logPHIAccess('SEARCH_HEALTH_RECORDS', 'MULTIPLE');

    return response.data;
  }

  // ==========================================
  // CRUD OPERATION OVERRIDES WITH PHI LOGGING
  // ==========================================

  /**
   * Create new health record with automatic PHI logging
   * @override
   */
  async create(data: HealthRecordCreate): Promise<HealthRecord> {
    const record = await super.create(data);
    await this.phiLogger.logPHIAccess(
      'CREATE_HEALTH_RECORD',
      data.studentId,
      'HEALTH_RECORD',
      record.id
    );
    return record;
  }

  /**
   * Update health record with automatic PHI logging
   * @override
   */
  async update(id: string, data: HealthRecordUpdate): Promise<HealthRecord> {
    const record = await super.update(id, data);
    await this.phiLogger.logPHIAccess(
      'UPDATE_HEALTH_RECORD',
      record.studentId,
      'HEALTH_RECORD',
      id
    );
    return record;
  }

  /**
   * Delete health record with automatic PHI logging
   * @override
   */
  async delete(id: string): Promise<void> {
    const record = await this.getById(id);
    await super.delete(id);
    await this.phiLogger.logPHIAccess(
      'DELETE_HEALTH_RECORD',
      record.studentId,
      'HEALTH_RECORD',
      id
    );
  }

  /**
   * Get health record by ID with automatic PHI logging
   * @override
   */
  async getById(id: string): Promise<HealthRecord> {
    const record = await super.getById(id);
    await this.phiLogger.logPHIAccess(
      'VIEW_HEALTH_RECORD',
      record.studentId,
      'HEALTH_RECORD',
      id
    );
    return record;
  }

  // ==========================================
  // DELEGATED OPERATIONS (Specialized Services)
  // ==========================================

  /**
   * Export health records (delegated to export service)
   * @see {@link HealthRecordsExportService.exportRecords}
   */
  exportRecords = this.exportService.exportRecords.bind(this.exportService);

  /**
   * Import health records (delegated to export service)
   * @see {@link HealthRecordsExportService.importRecords}
   */
  importRecords = this.exportService.importRecords.bind(this.exportService);

  /**
   * Get follow-up required records (delegated to follow-up service)
   * @see {@link HealthRecordsFollowUpService.getFollowUpRequired}
   */
  getFollowUpRequired = this.followUpService.getFollowUpRequired.bind(
    this.followUpService
  );

  /**
   * Complete follow-up (delegated to follow-up service)
   * @see {@link HealthRecordsFollowUpService.completeFollowUp}
   */
  completeFollowUp = this.followUpService.completeFollowUp.bind(
    this.followUpService
  );

  /**
   * Attach document to health record (delegated to follow-up service)
   * @see {@link HealthRecordsFollowUpService.attachDocument}
   */
  attachDocument = this.followUpService.attachDocument.bind(this.followUpService);

  /**
   * Mark record as confidential (delegated to follow-up service)
   * @see {@link HealthRecordsFollowUpService.markConfidential}
   */
  markConfidential = this.followUpService.markConfidential.bind(
    this.followUpService
  );

  /**
   * Get health statistics (delegated to statistics service)
   * @see {@link HealthRecordsStatisticsService.getHealthStatistics}
   */
  getHealthStatistics = this.statisticsService.getHealthStatistics.bind(
    this.statisticsService
  );

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
// FACTORY FUNCTION
// ==========================================

/**
 * Factory function to create Health Records API service instance
 *
 * @param {ApiClient} client - API client instance
 * @returns {HealthRecordsApiService} Configured health records API service
 *
 * @example
 * ```typescript
 * import { createHealthRecordsApi } from '@/services/modules/health';
 * import { apiClient } from '@/services/core/ApiClient';
 *
 * const healthApi = createHealthRecordsApi(apiClient);
 * ```
 */
export function createHealthRecordsApi(client: ApiClient): HealthRecordsApiService {
  return new HealthRecordsApiService(client);
}
