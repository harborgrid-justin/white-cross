/**
 * Health Records Controller
 * Business logic for comprehensive health record management
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

  static async listStudentRecords(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const { page, limit } = parsePagination(request.query);

    const filters = buildFilters(request.query, {
      type: { type: 'string' },
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

  static async getRecordById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const record = await HealthRecordService.getHealthRecordById(id);

    return successResponse(h, { record });
  }

  static async createRecord(request: AuthenticatedRequest, h: ResponseToolkit) {
    const recordData = {
      ...request.payload,
      date: new Date(request.payload.date)
    };

    const record = await HealthRecordService.createHealthRecord(recordData);

    return createdResponse(h, { record });
  }

  static async updateRecord(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const updateData = { ...request.payload };
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const record = await HealthRecordService.updateHealthRecord(id, updateData);

    return successResponse(h, { record });
  }

  static async deleteRecord(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const result = await HealthRecordService.deleteHealthRecord(id);

    return successResponse(h, result);
  }

  /**
   * ALLERGIES
   */

  static async listAllergies(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const allergies = await HealthRecordService.getStudentAllergies(studentId);

    return successResponse(h, { allergies });
  }

  static async getAllergyById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const allergy = await HealthRecordService.getAllergyById(id);

    return successResponse(h, { allergy });
  }

  static async createAllergy(request: AuthenticatedRequest, h: ResponseToolkit) {
    const allergy = await HealthRecordService.createAllergy(request.payload);

    return createdResponse(h, { allergy });
  }

  static async updateAllergy(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const allergy = await HealthRecordService.updateAllergy(id, request.payload);

    return successResponse(h, { allergy });
  }

  static async deleteAllergy(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const result = await HealthRecordService.deleteAllergy(id);

    return successResponse(h, result);
  }

  /**
   * CHRONIC CONDITIONS
   */

  static async listConditions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const conditions = await HealthRecordService.getStudentChronicConditions(studentId);

    return successResponse(h, { conditions });
  }

  static async getConditionById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const condition = await HealthRecordService.getChronicConditionById(id);

    return successResponse(h, { condition });
  }

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

  static async updateCondition(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const updateData = { ...request.payload };
    if (updateData.diagnosisDate) updateData.diagnosisDate = new Date(updateData.diagnosisDate);
    if (updateData.lastReviewDate) updateData.lastReviewDate = new Date(updateData.lastReviewDate);
    if (updateData.nextReviewDate) updateData.nextReviewDate = new Date(updateData.nextReviewDate);

    const condition = await HealthRecordService.updateChronicCondition(id, updateData);

    return successResponse(h, { condition });
  }

  static async deleteCondition(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const result = await HealthRecordService.deleteChronicCondition(id);

    return successResponse(h, result);
  }

  /**
   * VACCINATIONS/IMMUNIZATIONS
   */

  static async listVaccinations(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const vaccinations = await HealthRecordService.getStudentVaccinations(studentId);

    return successResponse(h, { vaccinations });
  }

  static async getVaccinationById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const vaccination = await HealthRecordService.getVaccinationById(id);

    return successResponse(h, { vaccination });
  }

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

  static async updateVaccination(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const updateData = { ...request.payload };
    if (updateData.administrationDate) updateData.administrationDate = new Date(updateData.administrationDate);
    if (updateData.expirationDate) updateData.expirationDate = new Date(updateData.expirationDate);
    if (updateData.nextDueDate) updateData.nextDueDate = new Date(updateData.nextDueDate);

    const vaccination = await HealthRecordService.updateVaccination(id, updateData);

    return successResponse(h, { vaccination });
  }

  static async deleteVaccination(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const result = await HealthRecordService.deleteVaccination(id);

    return successResponse(h, result );
  }

  /**
   * VITALS & GROWTH
   */

  static async recordVitals(request: AuthenticatedRequest, h: ResponseToolkit) {
    const vitalsRecord = await HealthRecordService.recordVitalSigns(
      request.payload.studentId,
      request.payload.vitals,
      request.payload.recordedBy
    );

    return createdResponse(h, { record: vitalsRecord });
  }

  static async getLatestVitals(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const vitals = await HealthRecordService.getLatestVitals(studentId);

    return successResponse(h, { vitals });
  }

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

  static async getMedicalSummary(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const summary = await HealthRecordService.getStudentMedicalSummary(studentId);

    return successResponse(h, { summary });
  }

  static async getImmunizationStatus(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const status = await HealthRecordService.checkImmunizationCompliance(studentId);

    return successResponse(h, { status });
  }
}
