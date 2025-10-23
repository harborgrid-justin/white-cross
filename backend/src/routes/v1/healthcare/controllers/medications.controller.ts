/**
 * Medications Controller
 * Business logic for medication management, administration, and inventory
 */

import { ResponseToolkit } from '@hapi/hapi';
import { MedicationService } from '../../../../services/medication';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse,
  paginatedResponse
} from '../../../shared/utils';
import { parsePagination, buildPaginationMeta } from '../../../shared/utils';

export class MedicationsController {
  /**
   * Get all medications with pagination and search
   */
  static async list(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page, limit } = parsePagination(request.query);
    const search = request.query.search as string | undefined;

    const result = await MedicationService.getMedications(page, limit, search);

    return paginatedResponse(
      h,
      result.medications || result.data,
      buildPaginationMeta(page, limit, result.total)
    );
  }

  /**
   * Create a new medication
   */
  static async create(request: AuthenticatedRequest, h: ResponseToolkit) {
    const medication = await MedicationService.createMedication(request.payload);
    return createdResponse(h, { medication });
  }

  /**
   * Get medication by ID
   */
  static async getById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const medication = await MedicationService.getMedicationById(id);
    return successResponse(h, { medication });
  }

  /**
   * Get medications by student ID
   */
  static async getByStudent(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const { page, limit } = parsePagination(request.query);

    const result = await MedicationService.getMedicationsByStudent(studentId, page, limit);

    return paginatedResponse(
      h,
      result.medications || result.data,
      buildPaginationMeta(page, limit, result.total)
    );
  }

  /**
   * Update a medication
   */
  static async update(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const medication = await MedicationService.updateMedication(id, request.payload);
    return successResponse(h, { medication });
  }

  /**
   * Deactivate a medication
   */
  static async deactivate(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { reason, deactivationType } = request.payload;
    const medication = await MedicationService.deactivateMedication(id, reason, deactivationType);
    return successResponse(h, { medication });
  }

  /**
   * Assign medication to a student
   */
  static async assignToStudent(request: AuthenticatedRequest, h: ResponseToolkit) {
    const studentMedication = await MedicationService.assignMedicationToStudent({
      ...request.payload,
      startDate: new Date(request.payload.startDate),
      endDate: request.payload.endDate ? new Date(request.payload.endDate) : undefined
    });

    return createdResponse(h, { studentMedication });
  }

  /**
   * Log medication administration
   */
  static async logAdministration(request: AuthenticatedRequest, h: ResponseToolkit) {
    const nurseId = request.auth.credentials.userId;

    const medicationLog = await MedicationService.logMedicationAdministration({
      ...request.payload,
      nurseId,
      timeGiven: new Date(request.payload.timeGiven)
    });

    return createdResponse(h, { medicationLog });
  }

  /**
   * Get medication administration logs for a student
   */
  static async getStudentLogs(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const { page, limit } = parsePagination(request.query);

    const result = await MedicationService.getStudentMedicationLogs(studentId, page, limit);

    return paginatedResponse(
      h,
      result.logs || result.data,
      buildPaginationMeta(page, limit, result.total)
    );
  }

  /**
   * Get medication inventory with alerts
   */
  static async getInventory(request: AuthenticatedRequest, h: ResponseToolkit) {
    const result = await MedicationService.getInventoryWithAlerts();
    return successResponse(h, result);
  }

  /**
   * Add medication to inventory
   */
  static async addToInventory(request: AuthenticatedRequest, h: ResponseToolkit) {
    const inventory = await MedicationService.addToInventory({
      ...request.payload,
      expirationDate: new Date(request.payload.expirationDate),
      costPerUnit: request.payload.costPerUnit
        ? parseFloat(request.payload.costPerUnit)
        : undefined
    });

    return createdResponse(h, { inventory });
  }

  /**
   * Get medication administration schedule
   */
  static async getSchedule(request: AuthenticatedRequest, h: ResponseToolkit) {
    const startDate = request.query.startDate
      ? new Date(request.query.startDate as string)
      : new Date();
    const endDate = request.query.endDate
      ? new Date(request.query.endDate as string)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days ahead
    const nurseId = request.query.nurseId as string | undefined;

    const schedule = await MedicationService.getMedicationSchedule(
      startDate,
      endDate,
      nurseId
    );

    return successResponse(h, { schedule });
  }

  /**
   * Update medication inventory quantity
   */
  static async updateInventoryQuantity(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { quantity, reason } = request.payload;

    const inventory = await MedicationService.updateInventoryQuantity(
      id,
      quantity,
      reason
    );

    return successResponse(h, { inventory });
  }

  /**
   * Deactivate student medication assignment
   */
  static async deactivateStudentMedication(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { reason } = request.payload;

    const studentMedication = await MedicationService.deactivateStudentMedication(
      id,
      reason
    );

    return successResponse(h, { studentMedication });
  }

  /**
   * Get medication reminders for a specific date
   */
  static async getReminders(request: AuthenticatedRequest, h: ResponseToolkit) {
    const date = request.query.date
      ? new Date(request.query.date as string)
      : new Date();

    const reminders = await MedicationService.getMedicationReminders(date);

    return successResponse(h, { reminders });
  }

  /**
   * Report an adverse medication reaction
   */
  static async reportAdverseReaction(request: AuthenticatedRequest, h: ResponseToolkit) {
    const reportedBy = request.auth.credentials.userId;

    const report = await MedicationService.reportAdverseReaction({
      ...request.payload,
      reportedBy,
      reportedAt: new Date(request.payload.reportedAt)
    });

    return createdResponse(h, { report });
  }

  /**
   * Get adverse reaction reports
   */
  static async getAdverseReactions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const medicationId = request.query.medicationId as string | undefined;
    const studentId = request.query.studentId as string | undefined;

    const reactions = await MedicationService.getAdverseReactions(
      medicationId,
      studentId
    );

    return successResponse(h, { reactions });
  }

  /**
   * Get medication statistics
   */
  static async getStatistics(request: AuthenticatedRequest, h: ResponseToolkit) {
    const statistics = await MedicationService.getMedicationStats();
    return successResponse(h, statistics);
  }

  /**
   * Get medication alerts
   */
  static async getAlerts(request: AuthenticatedRequest, h: ResponseToolkit) {
    const alerts = await MedicationService.getMedicationAlerts();
    return successResponse(h, alerts);
  }

  /**
   * Get medication form options
   */
  static async getFormOptions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const formOptions = await MedicationService.getMedicationFormOptions();
    return successResponse(h, formOptions);
  }
}
