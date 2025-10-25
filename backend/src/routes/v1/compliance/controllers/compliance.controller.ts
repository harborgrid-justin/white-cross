/**
 * Compliance Controller
 * Business logic for HIPAA/FERPA compliance and regulatory management
 * Implements comprehensive compliance reporting, consent tracking, and policy management
 */

import { ResponseToolkit } from '@hapi/hapi';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse,
  paginatedResponse
} from '../../../shared/utils';
import { parsePagination, buildPaginationMeta, buildFilters } from '../../../shared/utils';

// Import compliance services
import { ComplianceReportService } from '../../../../services/compliance/complianceReportService';
import { ConsentService } from '../../../../services/compliance/consentService';
import { ChecklistService } from '../../../../services/compliance/checklistService';
import { PolicyService } from '../../../../services/compliance/policyService';
import { ComplianceStatisticsService } from '../../../../services/compliance/statisticsService';

export class ComplianceController {
  /**
   * COMPLIANCE REPORTS
   */

  /**
   * List compliance reports
   * GET /api/v1/compliance/reports
   */
  static async listComplianceReports(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page, limit } = parsePagination(request.query);

    const filters = buildFilters(request.query, {
      reportType: { type: 'string' },
      status: { type: 'string' },
      period: { type: 'string' }
    });

    const result = await ComplianceReportService.getComplianceReports(page, limit, filters);

    return paginatedResponse(
      h,
      result.reports,
      buildPaginationMeta(page, limit, result.pagination.total)
    );
  }

  /**
   * Get compliance report by ID
   * GET /api/v1/compliance/reports/{id}
   */
  static async getComplianceReportById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const report = await ComplianceReportService.getComplianceReportById(id);

    return successResponse(h, { report });
  }

  /**
   * Create compliance report
   * POST /api/v1/compliance/reports
   */
  static async createComplianceReport(request: AuthenticatedRequest, h: ResponseToolkit) {
    const reportData = {
      ...request.payload,
      createdById: request.auth.credentials.userId,
      dueDate: request.payload.dueDate ? new Date(request.payload.dueDate) : undefined
    };

    const report = await ComplianceReportService.createComplianceReport(reportData);

    return createdResponse(h, { report });
  }

  /**
   * Update compliance report
   * PUT /api/v1/compliance/reports/{id}
   */
  static async updateComplianceReport(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const report = await ComplianceReportService.updateComplianceReport(id, request.payload);

    return successResponse(h, { report });
  }

  /**
   * Delete compliance report
   * DELETE /api/v1/compliance/reports/{id}
   */
  /**
   * Delete compliance report - REST standard: 204 No Content
   * Successful DELETE operations should return 204 with empty body
   */
  static async deleteComplianceReport(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    await ComplianceReportService.deleteComplianceReport(id);

    return h.response().code(204);
  }

  /**
   * Generate compliance report
   * POST /api/v1/compliance/reports/generate
   */
  static async generateComplianceReport(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { reportType, period, startDate, endDate, includeRecommendations = true } = request.payload;

    // Note: This would use a report generation service
    // For now, create a placeholder report
    const report = await ComplianceReportService.createComplianceReport({
      reportType,
      title: `${reportType} Compliance Report - ${period}`,
      description: `Auto-generated compliance report for ${period} period`,
      period,
      createdById: request.auth.credentials.userId
    });

    return createdResponse(h, {
      report,
      generatedAt: new Date().toISOString(),
      includeRecommendations
    });
  }

  /**
   * COMPLIANCE CHECKLISTS
   */

  /**
   * List compliance checklists
   * GET /api/v1/compliance/checklists
   */
  static async listChecklists(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page, limit } = parsePagination(request.query);

    const filters = buildFilters(request.query, {
      reportId: { type: 'string' },
      category: { type: 'string' },
      status: { type: 'string' }
    });

    // Note: Would need a getChecklists method in ChecklistService
    // For now, return placeholder
    return paginatedResponse(
      h,
      [],
      buildPaginationMeta(page, limit, 0)
    );
  }

  /**
   * Get checklist by ID
   * GET /api/v1/compliance/checklists/{id}
   */
  static async getChecklistById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const checklist = await ChecklistService.getChecklistItemById(id);

    return successResponse(h, { checklist });
  }

  /**
   * Create checklist
   * POST /api/v1/compliance/checklists
   */
  static async createChecklist(request: AuthenticatedRequest, h: ResponseToolkit) {
    const checklistData = {
      ...request.payload,
      dueDate: request.payload.dueDate ? new Date(request.payload.dueDate) : undefined
    };

    const checklist = await ChecklistService.addChecklistItem(checklistData);

    return createdResponse(h, { checklist });
  }

  /**
   * Update checklist
   * PUT /api/v1/compliance/checklists/{id}
   */
  static async updateChecklist(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const updateData = {
      ...request.payload,
      completedBy: request.payload.completedBy || request.auth.credentials.userId
    };

    const checklist = await ChecklistService.updateChecklistItem(id, updateData);

    return successResponse(h, { checklist });
  }

  /**
   * Delete checklist
   * DELETE /api/v1/compliance/checklists/{id}
   */
  /**
   * Delete checklist - REST standard: 204 No Content
   * Successful DELETE operations should return 204 with empty body
   */
  static async deleteChecklist(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    await ChecklistService.deleteChecklistItem(id);

    return h.response().code(204);
  }

  /**
   * POLICY MANAGEMENT
   */

  /**
   * List policies
   * GET /api/v1/compliance/policies
   */
  static async listPolicies(request: AuthenticatedRequest, h: ResponseToolkit) {
    const filters = buildFilters(request.query, {
      category: { type: 'string' },
      status: { type: 'string' }
    });

    const policies = await PolicyService.getPolicies(filters);

    return successResponse(h, { policies });
  }

  /**
   * Get policy by ID
   * GET /api/v1/compliance/policies/{id}
   */
  static async getPolicyById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { policyId } = request.params;
    const policy = await PolicyService.getPolicyById(policyId);

    return successResponse(h, { policy });
  }

  /**
   * Create policy
   * POST /api/v1/compliance/policies
   */
  static async createPolicy(request: AuthenticatedRequest, h: ResponseToolkit) {
    const policyData = {
      ...request.payload,
      effectiveDate: new Date(request.payload.effectiveDate),
      reviewDate: request.payload.reviewDate ? new Date(request.payload.reviewDate) : undefined
    };

    const policy = await PolicyService.createPolicy(policyData);

    return createdResponse(h, { policy });
  }

  /**
   * Update policy
   * PUT /api/v1/compliance/policies/{id}
   */
  static async updatePolicy(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { policyId } = request.params;

    const updateData = {
      ...request.payload,
      approvedBy: request.payload.approvedBy || request.auth.credentials.userId,
      reviewDate: request.payload.reviewDate ? new Date(request.payload.reviewDate) : undefined
    };

    const policy = await PolicyService.updatePolicy(policyId, updateData);

    return successResponse(h, { policy });
  }

  /**
   * Delete policy
   * DELETE /api/v1/compliance/policies/{id}
   */
  static async deletePolicy(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { policyId } = request.params;
    const result = await PolicyService.deletePolicy(policyId);

    return successResponse(h, result);
  }

  /**
   * Acknowledge policy
   * POST /api/v1/compliance/policies/{policyId}/acknowledge
   */
  static async acknowledgePolicy(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { policyId } = request.params;
    const userId = request.auth.credentials.userId;
    const ipAddress = request.info.remoteAddress || request.headers['x-forwarded-for'] as string;

    const acknowledgment = await PolicyService.acknowledgePolicy(policyId, userId, ipAddress);

    return createdResponse(h, { acknowledgment });
  }

  /**
   * CONSENT MANAGEMENT
   */

  /**
   * List consent forms
   * GET /api/v1/compliance/consents/forms
   */
  static async listConsentForms(request: AuthenticatedRequest, h: ResponseToolkit) {
    const filters = buildFilters(request.query, {
      isActive: { type: 'boolean' }
    });

    const forms = await ConsentService.getConsentForms(filters);

    return successResponse(h, { forms });
  }

  /**
   * Get consent form by ID
   * GET /api/v1/compliance/consents/forms/{id}
   */
  static async getConsentFormById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const form = await ConsentService.getConsentFormById(id);

    return successResponse(h, { form });
  }

  /**
   * Create consent form
   * POST /api/v1/compliance/consents/forms
   */
  static async createConsentForm(request: AuthenticatedRequest, h: ResponseToolkit) {
    const formData = {
      ...request.payload,
      expiresAt: request.payload.expiresAt ? new Date(request.payload.expiresAt) : undefined
    };

    const form = await ConsentService.createConsentForm(formData);

    return createdResponse(h, { form });
  }

  /**
   * Record consent
   * POST /api/v1/compliance/consents
   */
  static async recordConsent(request: AuthenticatedRequest, h: ResponseToolkit) {
    const ipAddress = request.info.remoteAddress || request.headers['x-forwarded-for'] as string;

    const consentData = {
      ...request.payload,
      ipAddress
    };

    const signature = await ConsentService.signConsentForm(consentData);

    return createdResponse(h, { signature });
  }

  /**
   * Get student consents
   * GET /api/v1/compliance/consents/student/{studentId}
   */
  static async getStudentConsents(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const consents = await ConsentService.getStudentConsents(studentId);

    return successResponse(h, { consents });
  }

  /**
   * Withdraw consent
   * PUT /api/v1/compliance/consents/{signatureId}/withdraw
   */
  static async withdrawConsent(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { signatureId } = request.params;
    const withdrawnBy = request.auth.credentials.userId;

    const signature = await ConsentService.withdrawConsent(signatureId, withdrawnBy);

    return successResponse(h, { signature });
  }

  /**
   * COMPLIANCE STATISTICS
   */

  /**
   * Get compliance statistics
   * GET /api/v1/compliance/statistics
   */
  static async getComplianceStatistics(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { period = 'MONTHLY', startDate, endDate } = request.query;

    // Note: Would need ComplianceStatisticsService implementation
    // For now, return placeholder statistics
    const statistics = {
      period,
      totalReports: 0,
      compliantReports: 0,
      pendingReports: 0,
      nonCompliantReports: 0,
      complianceRate: 0,
      activePolicies: 0,
      acknowledgedPolicies: 0,
      activeConsents: 0,
      withdrawnConsents: 0,
      checklistCompletion: 0
    };

    return successResponse(h, { statistics });
  }
}
