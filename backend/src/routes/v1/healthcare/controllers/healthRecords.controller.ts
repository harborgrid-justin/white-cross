/**
 * Health Records Controller
 * Business logic for comprehensive health record management
 *
 * @description Controllers for health records API endpoints aligned with health_records database schema
 *
 * Database Field Alignment:
 * - recordType: Type of health record (ENUM from HealthRecordType) (REQUIRED)
 * - recordDate: Date when health event occurred (REQUIRED)
 * - diagnosis: Medical diagnosis description (optional)
 * - treatment: Treatment provided or recommended (optional)
 * - notes: Additional notes or comments (optional)
 * - provider: Healthcare provider name (optional)
 *
 * All controllers properly handle date conversions and field name mappings
 */

import { ResponseToolkit } from '@hapi/hapi';
import { HealthRecordService } from '../../../../services/healthRecordService';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse,
  paginatedResponse
} from '../../../shared/utils';
import { parsePagination, buildPaginationMeta, buildFilters } from '../../../shared/utils';

export class HealthRecordsController {
  /**
   * GENERAL HEALTH RECORDS
   */

  /**
   * List all health records for a specific student
   * @param {AuthenticatedRequest} request - Request with studentId param and optional filters
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<PaginatedResponse>} Paginated list of health records
   * @description Retrieves student health records with filtering by recordType, date range, and provider
   */
  static async listStudentRecords(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const { page, limit } = parsePagination(request.query);

    // Build filters aligned with database schema
    const filters = buildFilters(request.query, {
      recordType: { type: 'string' },
      dateFrom: { type: 'string' },
      dateTo: { type: 'string' },
      provider: { type: 'string' }
    });

    const result = await HealthRecordService.getStudentHealthRecords(studentId, page, limit, filters);

    return paginatedResponse(
      h,
      result.records || result.data,
      buildPaginationMeta(page, limit, result.total)
    );
  }

  /**
   * Get a specific health record by ID
   * @param {AuthenticatedRequest} request - Request with record ID param
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Health record details
   * @description Retrieves detailed health record including all medical information
   */
  static async getRecordById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const record = await HealthRecordService.getHealthRecordById(id);

    return successResponse(h, { record });
  }

  /**
   * Create a new health record
   * @param {AuthenticatedRequest} request - Request with health record data in payload
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Newly created health record
   * @description Creates health record with database-aligned fields (recordType, recordDate, diagnosis, treatment, notes, provider)
   */
  static async createRecord(request: AuthenticatedRequest, h: ResponseToolkit) {
    // Payload already validated with correct field names (recordType, recordDate, etc.)
    // Convert recordDate to Date object if it's a string
    const recordData = {
      ...request.payload,
      recordDate: new Date(request.payload.recordDate)
    };

    // Convert optional date fields
    if (recordData.followUpDate) {
      recordData.followUpDate = new Date(recordData.followUpDate);
    }

    const record = await HealthRecordService.createHealthRecord(recordData);

    return createdResponse(h, { record });
  }

  /**
   * Update an existing health record
   * @param {AuthenticatedRequest} request - Request with record ID param and update data in payload
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Updated health record
   * @description Updates health record with database-aligned field names
   */
  static async updateRecord(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    // Payload already validated with correct field names
    const updateData = { ...request.payload };

    // Convert date strings to Date objects if present
    if (updateData.recordDate) {
      updateData.recordDate = new Date(updateData.recordDate);
    }
    if (updateData.followUpDate) {
      updateData.followUpDate = new Date(updateData.followUpDate);
    }

    const record = await HealthRecordService.updateHealthRecord(id, updateData);

    return successResponse(h, { record });
  }

  /**
   * Delete (soft-delete/archive) a health record
   * @param {AuthenticatedRequest} request - Request with record ID param
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Deletion confirmation
   * @description Soft-deletes health record, maintaining for compliance and historical reference
   */
  static async deleteRecord(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const result = await HealthRecordService.deleteHealthRecord(id);

    return successResponse(h, result);
  }

  /**
   * ALLERGIES
   */

  /**
   * List all allergies for a student
   * @param {AuthenticatedRequest} request - Request with studentId param
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} List of student allergies
   * @description Returns all known allergies with severity levels (MILD, MODERATE, SEVERE, LIFE_THREATENING)
   */
  static async listAllergies(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const allergies = await HealthRecordService.getStudentAllergies(studentId);

    return successResponse(h, { allergies });
  }

  /**
   * Get specific allergy by ID
   * @param {AuthenticatedRequest} request - Request with allergy ID param
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Allergy details
   * @description Returns detailed allergy information including allergen, severity, reactions, and treatment
   */
  static async getAllergyById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const allergy = await HealthRecordService.getAllergyById(id);

    return successResponse(h, { allergy });
  }

  /**
   * Create new allergy record
   * @param {AuthenticatedRequest} request - Request with allergy data in payload
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Newly created allergy record
   * @description Records new allergy for a student with severity level and reaction details
   */
  static async createAllergy(request: AuthenticatedRequest, h: ResponseToolkit) {
    const allergy = await HealthRecordService.createAllergy(request.payload);

    return createdResponse(h, { allergy });
  }

  /**
   * Update allergy information
   * @param {AuthenticatedRequest} request - Request with allergy ID param and update data in payload
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Updated allergy record
   * @description Updates allergy details including severity changes, new reactions, or treatment protocols
   */
  static async updateAllergy(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const allergy = await HealthRecordService.updateAllergy(id, request.payload);

    return successResponse(h, { allergy });
  }

  /**
   * Delete (archive) allergy record
   * @param {AuthenticatedRequest} request - Request with allergy ID param
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Deletion confirmation
   * @description Removes allergy from active list (soft delete - archives for historical reference)
   */
  static async deleteAllergy(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const result = await HealthRecordService.deleteAllergy(id);

    return successResponse(h, result);
  }

  /**
   * CHRONIC CONDITIONS
   */

  /**
   * List all chronic conditions for a student
   * @param {AuthenticatedRequest} request - Request with studentId param
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} List of chronic conditions
   * @description Returns chronic/ongoing medical conditions with status, severity, and care plans
   */
  static async listConditions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const conditions = await HealthRecordService.getStudentChronicConditions(studentId);

    return successResponse(h, { conditions });
  }

  /**
   * Get specific chronic condition by ID
   * @param {AuthenticatedRequest} request - Request with condition ID param
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Chronic condition details
   * @description Returns detailed condition information including care plan, medications, and review schedule
   */
  static async getConditionById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const condition = await HealthRecordService.getChronicConditionById(id);

    return successResponse(h, { condition });
  }

  /**
   * Create new chronic condition record
   * @param {AuthenticatedRequest} request - Request with condition data in payload
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Newly created chronic condition
   * @description Records new chronic condition diagnosis with ICD-10 code, care plan, and management protocols
   */
  static async createCondition(request: AuthenticatedRequest, h: ResponseToolkit) {
    const conditionData = {
      ...request.payload,
      diagnosisDate: new Date(request.payload.diagnosisDate),
      lastReviewDate: request.payload.lastReviewDate ? new Date(request.payload.lastReviewDate) : undefined,
      nextReviewDate: request.payload.nextReviewDate ? new Date(request.payload.nextReviewDate) : undefined
    };

    const condition = await HealthRecordService.createChronicCondition(conditionData);

    return createdResponse(h, { condition });
  }

  /**
   * Update chronic condition
   * @param {AuthenticatedRequest} request - Request with condition ID param and update data in payload
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Updated chronic condition
   * @description Updates condition status, severity, care plan, or management protocols
   */
  static async updateCondition(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const updateData = { ...request.payload };
    if (updateData.diagnosisDate) updateData.diagnosisDate = new Date(updateData.diagnosisDate);
    if (updateData.lastReviewDate) updateData.lastReviewDate = new Date(updateData.lastReviewDate);
    if (updateData.nextReviewDate) updateData.nextReviewDate = new Date(updateData.nextReviewDate);

    const condition = await HealthRecordService.updateChronicCondition(id, updateData);

    return successResponse(h, { condition });
  }

  /**
   * Delete (archive) chronic condition
   * @param {AuthenticatedRequest} request - Request with condition ID param
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Deletion confirmation
   * @description Archives chronic condition (soft delete), maintaining historical record
   */
  static async deleteCondition(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const result = await HealthRecordService.deleteChronicCondition(id);

    return successResponse(h, result);
  }

  /**
   * VACCINATIONS/IMMUNIZATIONS
   */

  /**
   * List all vaccinations for a student
   * @param {AuthenticatedRequest} request - Request with studentId param
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} List of vaccinations
   * @description Returns immunization history with vaccine names, dates, lot numbers, and dose tracking
   */
  static async listVaccinations(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const vaccinations = await HealthRecordService.getStudentVaccinations(studentId);

    return successResponse(h, { vaccinations });
  }

  /**
   * Get specific vaccination by ID
   * @param {AuthenticatedRequest} request - Request with vaccination ID param
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Vaccination details
   * @description Returns detailed vaccination record including administration details, lot number, and reactions
   */
  static async getVaccinationById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const vaccination = await HealthRecordService.getVaccinationById(id);

    return successResponse(h, { vaccination });
  }

  /**
   * Create new vaccination record
   * @param {AuthenticatedRequest} request - Request with vaccination data in payload
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Newly created vaccination record
   * @description Records new vaccination with CVX code, NDC code, lot number, dose tracking, and reactions
   */
  static async createVaccination(request: AuthenticatedRequest, h: ResponseToolkit) {
    const vaccinationData = {
      ...request.payload,
      administrationDate: new Date(request.payload.administrationDate),
      expirationDate: request.payload.expirationDate ? new Date(request.payload.expirationDate) : undefined,
      nextDueDate: request.payload.nextDueDate ? new Date(request.payload.nextDueDate) : undefined
    };

    const vaccination = await HealthRecordService.createVaccination(vaccinationData);

    return createdResponse(h, { vaccination });
  }

  /**
   * Update vaccination record
   * @param {AuthenticatedRequest} request - Request with vaccination ID param and update data in payload
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Updated vaccination record
   * @description Updates vaccination details such as dose completion, next due date, or adverse reactions
   */
  static async updateVaccination(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const updateData = { ...request.payload };
    if (updateData.administrationDate) updateData.administrationDate = new Date(updateData.administrationDate);
    if (updateData.expirationDate) updateData.expirationDate = new Date(updateData.expirationDate);
    if (updateData.nextDueDate) updateData.nextDueDate = new Date(updateData.nextDueDate);

    const vaccination = await HealthRecordService.updateVaccination(id, updateData);

    return successResponse(h, { vaccination });
  }

  /**
   * Delete (archive) vaccination record
   * @param {AuthenticatedRequest} request - Request with vaccination ID param
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Deletion confirmation
   * @description Archives vaccination record (soft delete), maintaining historical record for compliance
   */
  static async deleteVaccination(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const result = await HealthRecordService.deleteVaccination(id);

    return successResponse(h, result);
  }

  /**
   * VITALS & GROWTH
   */

  /**
   * Record vital signs for a student
   * @param {AuthenticatedRequest} request - Request with vitals data in payload
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Newly created vitals record
   * @description Records vital signs including temperature, blood pressure, heart rate, respiratory rate, oxygen saturation, height, weight, and BMI
   */
  static async recordVitals(request: AuthenticatedRequest, h: ResponseToolkit) {
    const vitalsRecord = await HealthRecordService.recordVitalSigns(
      request.payload.studentId,
      request.payload.vitals,
      request.payload.recordedBy
    );

    return createdResponse(h, { record: vitalsRecord });
  }

  /**
   * Get latest vital signs for a student
   * @param {AuthenticatedRequest} request - Request with studentId param
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Most recent vital signs
   * @description Returns most recent vital signs for quick health status check and baseline comparison
   */
  static async getLatestVitals(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const vitals = await HealthRecordService.getLatestVitals(studentId);

    return successResponse(h, { vitals });
  }

  /**
   * Get vital signs history for a student
   * @param {AuthenticatedRequest} request - Request with studentId param and pagination query params
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<PaginatedResponse>} Paginated vital signs history
   * @description Returns paginated history of vital sign measurements for growth tracking and trend analysis
   */
  static async getVitalsHistory(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const { page, limit } = parsePagination(request.query);

    const result = await HealthRecordService.getVitalsHistory(studentId, page, limit);

    return paginatedResponse(
      h,
      result.records || result.data,
      buildPaginationMeta(page, limit, result.total)
    );
  }

  /**
   * MEDICAL SUMMARY & REPORTS
   */

  /**
   * Get comprehensive medical summary for a student
   * @param {AuthenticatedRequest} request - Request with studentId param
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Complete medical overview
   * @description Returns complete medical overview including active allergies, chronic conditions, current medications, immunization status, recent vitals, and care plans
   */
  static async getMedicalSummary(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const summary = await HealthRecordService.getStudentMedicalSummary(studentId);

    return successResponse(h, { summary });
  }

  /**
   * Get immunization compliance status for a student
   * @param {AuthenticatedRequest} request - Request with studentId param
   * @param {ResponseToolkit} h - Hapi response toolkit
   * @returns {Promise<Response>} Immunization compliance status
   * @description Returns immunization compliance check against state/district requirements, identifying missing or overdue vaccines
   */
  static async getImmunizationStatus(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const status = await HealthRecordService.checkImmunizationCompliance(studentId);

    return successResponse(h, { status });
  }
}
