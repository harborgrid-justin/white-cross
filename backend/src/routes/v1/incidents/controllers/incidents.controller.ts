/**
 * Incidents Controller
 * Business logic for comprehensive incident report management
 */

import { ResponseToolkit } from '@hapi/hapi';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse,
  paginatedResponse
} from '../../../shared/utils';
import { parsePagination, buildPaginationMeta, buildFilters } from '../../../shared/utils';

// Import incident services
import { IncidentCoreService } from '../../../../services/incidentReport/coreService';
import { EvidenceService } from '../../../../services/incidentReport/evidenceService';
import { WitnessService } from '../../../../services/incidentReport/witnessService';
import { FollowUpService } from '../../../../services/incidentReport/followUpService';
import { NotificationService } from '../../../../services/incidentReport/notificationService';
import { StatisticsService } from '../../../../services/incidentReport/statisticsService';
import { SearchService } from '../../../../services/incidentReport/searchService';
import { InsuranceService } from '../../../../services/incidentReport/insuranceService';

export class IncidentsController {
  /**
   * INCIDENT CRUD OPERATIONS
   */

  static async list(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page, limit } = parsePagination(request.query);

    const filters = buildFilters(request.query, {
      studentId: { type: 'string' },
      reportedById: { type: 'string' },
      type: { type: 'string' },
      severity: { type: 'string' },
      status: { type: 'string' },
      dateFrom: { type: 'date' },
      dateTo: { type: 'date' },
      parentNotified: { type: 'boolean' },
      followUpRequired: { type: 'boolean' },
      location: { type: 'string' }
    });

    const result = await IncidentCoreService.getIncidentReports(page, limit, filters);

    return paginatedResponse(
      h,
      result.reports,
      buildPaginationMeta(page, limit, result.pagination.total)
    );
  }

  static async getById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const incident = await IncidentCoreService.getIncidentReportById(id);

    return successResponse(h, { incident });
  }

  static async create(request: AuthenticatedRequest, h: ResponseToolkit) {
    const reportedById = request.auth.credentials?.userId;

    const incidentData = {
      ...request.payload,
      reportedById,
      occurredAt: new Date(request.payload.occurredAt)
    };

    const incident = await IncidentCoreService.createIncidentReport(incidentData);

    return createdResponse(h, { incident });
  }

  static async update(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const updateData = { ...request.payload };
    if (updateData.occurredAt) {
      updateData.occurredAt = new Date(updateData.occurredAt);
    }

    const incident = await IncidentCoreService.updateIncidentReport(id, updateData);

    return successResponse(h, { incident });
  }

  /**
   * Delete (archive) incident - REST standard: 204 No Content
   * Successful DELETE operations should return 204 with empty body
   */
  static async delete(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    // Soft delete by updating status to ARCHIVED
    await IncidentCoreService.updateIncidentReport(id, {
      status: 'ARCHIVED'
    });

    return h.response().code(204);
  }

  /**
   * STUDENT-SPECIFIC INCIDENTS
   */

  static async getStudentIncidents(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const { page, limit } = parsePagination(request.query);

    const result = await IncidentCoreService.getIncidentReports(page, limit, { studentId });

    return paginatedResponse(
      h,
      result.reports,
      buildPaginationMeta(page, limit, result.pagination.total)
    );
  }

  static async getStudentRecentIncidents(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const limit = parseInt(request.query?.limit as string) || 5;

    const incidents = await IncidentCoreService.getStudentRecentIncidents(studentId, limit);

    return successResponse(h, { incidents });
  }

  /**
   * EVIDENCE MANAGEMENT
   */

  static async addEvidence(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { evidenceType, evidenceUrls } = request.payload;

    const incident = await EvidenceService.addEvidence(id, evidenceType, evidenceUrls);

    return successResponse(h, {
      message: 'Evidence added successfully',
      incident
    });
  }

  static async getEvidence(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const evidence = await EvidenceService.getIncidentEvidence(id);

    return successResponse(h, { evidence });
  }

  static async removeEvidence(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { evidenceType, evidenceUrl } = request.payload;

    const incident = await EvidenceService.removeEvidence(id, evidenceType, evidenceUrl);

    return successResponse(h, {
      message: 'Evidence removed successfully',
      incident
    });
  }

  /**
   * WITNESS STATEMENTS
   */

  static async addWitnessStatement(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const statement = await WitnessService.addWitnessStatement(id, request.payload);

    return createdResponse(h, { statement });
  }

  static async getWitnessStatements(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const statements = await WitnessService.getWitnessStatements(id);

    return successResponse(h, { statements });
  }

  static async updateWitnessStatement(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { witnessId } = request.params;

    const statement = await WitnessService.updateWitnessStatement(witnessId, request.payload);

    return successResponse(h, { statement });
  }

  static async verifyWitnessStatement(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { witnessId } = request.params;
    const verifiedBy = `${request.auth.credentials?.firstName} ${request.auth.credentials?.lastName}`;

    const statement = await WitnessService.verifyWitnessStatement(witnessId, verifiedBy);

    return successResponse(h, {
      message: 'Witness statement verified successfully',
      statement
    });
  }

  static async deleteWitnessStatement(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { witnessId } = request.params;

    await WitnessService.deleteWitnessStatement(witnessId);

    return successResponse(h, {
      message: 'Witness statement deleted successfully'
    });
  }

  /**
   * FOLLOW-UP ACTIONS
   */

  static async addFollowUpAction(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const actionData = {
      ...request.payload,
      dueDate: new Date(request.payload.dueDate)
    };

    const action = await FollowUpService.addFollowUpAction(id, actionData);

    return createdResponse(h, { action });
  }

  static async getFollowUpActions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const actions = await FollowUpService.getFollowUpActions(id);

    return successResponse(h, { actions });
  }

  static async updateFollowUpAction(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { followUpId } = request.params;
    const { status, notes } = request.payload;

    const completedBy = request.payload.completedBy ||
      `${request.auth.credentials?.firstName} ${request.auth.credentials?.lastName}`;

    const action = await FollowUpService.updateFollowUpAction(
      followUpId,
      status,
      completedBy,
      notes
    );

    return successResponse(h, { action });
  }

  static async deleteFollowUpAction(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { followUpId } = request.params;

    await FollowUpService.deleteFollowUpAction(followUpId);

    return successResponse(h, {
      message: 'Follow-up action deleted successfully'
    });
  }

  static async getOverdueActions(request: AuthenticatedRequest, h: ResponseToolkit) {
    const actions = await FollowUpService.getOverdueActions();

    return successResponse(h, { actions });
  }

  /**
   * NOTIFICATIONS
   */

  static async notifyParent(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { method } = request.payload;
    const notifiedBy = `${request.auth.credentials?.firstName} ${request.auth.credentials?.lastName}`;

    const incident = await NotificationService.notifyParent(id, method, notifiedBy);

    return successResponse(h, {
      message: 'Parent notification sent successfully',
      incident
    });
  }

  static async markParentNotified(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { notificationMethod, notifiedBy } = request.payload;

    const incident = await NotificationService.markParentNotified(
      id,
      notificationMethod,
      notifiedBy
    );

    return successResponse(h, {
      message: 'Parent marked as notified',
      incident
    });
  }

  /**
   * STATISTICS & REPORTS
   */

  static async getStatistics(request: AuthenticatedRequest, h: ResponseToolkit) {
    const dateFrom = request.query?.dateFrom ? new Date(request.query.dateFrom as string) : undefined;
    const dateTo = request.query?.dateTo ? new Date(request.query.dateTo as string) : undefined;
    const studentId = request.query?.studentId as string | undefined;

    const statistics = await StatisticsService.getIncidentStatistics(dateFrom, dateTo, studentId);

    return successResponse(h, { statistics });
  }

  static async getDashboardStatistics(request: AuthenticatedRequest, h: ResponseToolkit) {
    const statistics = await StatisticsService.getDashboardStatistics();

    return successResponse(h, { statistics });
  }

  static async getTrends(request: AuthenticatedRequest, h: ResponseToolkit) {
    const days = parseInt(request.query?.days as string) || 30;

    const trends = await StatisticsService.getIncidentTrends(days);

    return successResponse(h, { trends });
  }

  /**
   * SEARCH
   */

  static async search(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { query } = request.query;
    const { page, limit } = parsePagination(request.query);

    const result = await SearchService.searchIncidentReports(query as string, page, limit);

    return paginatedResponse(
      h,
      result.reports,
      buildPaginationMeta(page, limit, result.pagination.total)
    );
  }

  /**
   * INSURANCE & COMPLIANCE
   */

  static async updateInsuranceClaim(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { claimNumber, claimStatus } = request.payload;

    const incident = await InsuranceService.updateInsuranceClaim(id, claimNumber, claimStatus);

    return successResponse(h, {
      message: 'Insurance claim updated successfully',
      incident
    });
  }

  static async updateComplianceStatus(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { status } = request.payload;

    const incident = await IncidentCoreService.updateIncidentReport(id, {
      legalComplianceStatus: status
    });

    return successResponse(h, {
      message: 'Compliance status updated successfully',
      incident
    });
  }

  /**
   * SPECIAL QUERIES
   */

  static async getIncidentsRequiringFollowUp(request: AuthenticatedRequest, h: ResponseToolkit) {
    const incidents = await IncidentCoreService.getIncidentsRequiringFollowUp();

    return successResponse(h, { incidents });
  }
}
