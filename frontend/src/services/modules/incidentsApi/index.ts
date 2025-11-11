/**
 * Incidents API - Unified Interface
 * 
 * Provides a unified API interface that combines all incident management modules
 * 
 * @module services/modules/incidentsApi
 */

import type { ApiClient } from '../../core/ApiClient';
import type { IIncidentsApi } from './types';
import { IncidentsCore } from './incidents';
import { WitnessStatements } from './witnesses';
import { FollowUps } from './followUps';
import { Evidence } from './evidence';
import { Reports } from './reports';
import type {
  IncidentReportFilters,
  IncidentReportListResponse,
  IncidentReportResponse,
  CreateIncidentReportRequest,
  UpdateIncidentReportRequest,
  IncidentSearchParams,
  IncidentStatisticsFilters,
  IncidentStatistics,
  MarkParentNotifiedRequest,
  AddFollowUpNotesRequest,
  NotifyParentRequest,
  CreateFollowUpActionRequest,
  UpdateFollowUpActionRequest,
  FollowUpActionResponse,
  FollowUpActionListResponse,
  CreateWitnessStatementRequest,
  UpdateWitnessStatementRequest,
  WitnessStatementResponse,
  WitnessStatementListResponse,
  AddEvidenceRequest,
  UpdateInsuranceClaimRequest,
  UpdateComplianceStatusRequest,
  InsuranceSubmissionResponse,
  InsuranceSubmissionsResponse,
  IncidentReportDocument,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentResponse,
  CommentListResponse
} from './types';

/**
 * Unified Incidents API implementation
 * 
 * Combines all modular components into a single, cohesive API interface
 */
export class IncidentsApi implements IIncidentsApi {
  private readonly incidents: IncidentsCore;
  private readonly witnesses: WitnessStatements;
  private readonly followUps: FollowUps;
  private readonly evidence: Evidence;
  private readonly reports: Reports;

  constructor(client: ApiClient) {
    this.incidents = new IncidentsCore(client);
    this.witnesses = new WitnessStatements(client);
    this.followUps = new FollowUps(client);
    this.evidence = new Evidence(client);
    this.reports = new Reports(client);
  }

  // =====================
  // INCIDENT REPORT CRUD
  // =====================

  async getAll(params?: IncidentReportFilters): Promise<IncidentReportListResponse> {
    return this.incidents.getAll(params);
  }

  async getById(id: string): Promise<IncidentReportResponse> {
    return this.incidents.getById(id);
  }

  async create(data: CreateIncidentReportRequest): Promise<IncidentReportResponse> {
    return this.incidents.create(data);
  }

  async update(id: string, data: UpdateIncidentReportRequest): Promise<IncidentReportResponse> {
    return this.incidents.update(id, data);
  }

  async delete(id: string): Promise<{ success: boolean }> {
    return this.incidents.delete(id);
  }

  // =====================
  // SEARCH AND STATISTICS
  // =====================

  async search(params: IncidentSearchParams): Promise<IncidentReportListResponse> {
    return this.incidents.search(params);
  }

  async getStatistics(params?: IncidentStatisticsFilters): Promise<IncidentStatistics> {
    return this.incidents.getStatistics(params);
  }

  async getFollowUpRequired(): Promise<IncidentReportListResponse> {
    return this.incidents.getFollowUpRequired();
  }

  async getStudentRecentIncidents(studentId: string, limit?: number): Promise<IncidentReportListResponse> {
    return this.incidents.getStudentRecentIncidents(studentId, limit);
  }

  // =====================
  // PARENT NOTIFICATION
  // =====================

  async markParentNotified(id: string, data: MarkParentNotifiedRequest): Promise<IncidentReportResponse> {
    return this.followUps.markParentNotified(id, data);
  }

  async notifyParent(id: string, data: NotifyParentRequest): Promise<IncidentReportResponse> {
    return this.followUps.notifyParent(id, data);
  }

  // =====================
  // FOLLOW-UP NOTES AND ACTIONS
  // =====================

  async addFollowUpNotes(id: string, data: AddFollowUpNotesRequest): Promise<IncidentReportResponse> {
    return this.followUps.addNotes(id, data);
  }

  async addFollowUpAction(data: CreateFollowUpActionRequest): Promise<FollowUpActionResponse> {
    return this.followUps.addAction(data);
  }

  async updateFollowUpAction(id: string, data: UpdateFollowUpActionRequest): Promise<FollowUpActionResponse> {
    return this.followUps.updateAction(id, data);
  }

  async completeFollowUpAction(id: string, notes?: string): Promise<FollowUpActionResponse> {
    return this.followUps.completeAction(id, notes);
  }

  async getFollowUpActions(incidentReportId: string): Promise<FollowUpActionListResponse> {
    return this.followUps.getActions(incidentReportId);
  }

  async deleteFollowUpAction(id: string): Promise<{ success: boolean }> {
    return this.followUps.deleteAction(id);
  }

  // =====================
  // WITNESS STATEMENTS
  // =====================

  async addWitnessStatement(data: CreateWitnessStatementRequest): Promise<WitnessStatementResponse> {
    return this.witnesses.add(data);
  }

  async updateWitnessStatement(id: string, data: UpdateWitnessStatementRequest): Promise<WitnessStatementResponse> {
    return this.witnesses.update(id, data);
  }

  async verifyWitnessStatement(statementId: string): Promise<WitnessStatementResponse> {
    return this.witnesses.verify(statementId);
  }

  async getWitnessStatements(incidentReportId: string): Promise<WitnessStatementListResponse> {
    return this.witnesses.getAll(incidentReportId);
  }

  async deleteWitnessStatement(id: string): Promise<{ success: boolean }> {
    return this.witnesses.delete(id);
  }

  // =====================
  // EVIDENCE MANAGEMENT
  // =====================

  async addEvidence(id: string, data: AddEvidenceRequest): Promise<IncidentReportResponse> {
    return this.evidence.add(id, data);
  }

  async uploadEvidence(incidentReportId: string, files: File[]): Promise<{ attachments: string[] }> {
    return this.evidence.uploadFiles(incidentReportId, files);
  }

  async deleteEvidence(incidentReportId: string, fileName: string): Promise<{ success: boolean }> {
    return this.evidence.deleteFile(incidentReportId, fileName);
  }

  // =====================
  // INSURANCE AND COMPLIANCE
  // =====================

  async updateInsuranceClaim(id: string, data: UpdateInsuranceClaimRequest): Promise<IncidentReportResponse> {
    return this.evidence.updateInsuranceClaim(id, data);
  }

  async submitToInsurance(id: string, insuranceData: Record<string, unknown>): Promise<InsuranceSubmissionResponse> {
    return this.evidence.submitToInsurance(id, insuranceData);
  }

  async getInsuranceSubmissions(incidentReportId: string): Promise<InsuranceSubmissionsResponse> {
    return this.evidence.getInsuranceSubmissions(incidentReportId);
  }

  async updateComplianceStatus(id: string, data: UpdateComplianceStatusRequest): Promise<IncidentReportResponse> {
    return this.evidence.updateComplianceStatus(id, data);
  }

  // =====================
  // DOCUMENT GENERATION AND EXPORT
  // =====================

  async generateDocument(id: string): Promise<{ document: IncidentReportDocument }> {
    return this.reports.generateDocument(id);
  }

  async generateReport(id: string): Promise<Blob> {
    return this.reports.generatePDF(id);
  }

  async exportReports(params?: IncidentReportFilters): Promise<Blob> {
    return this.reports.export(params);
  }

  // =====================
  // COMMENTS
  // =====================

  async getComments(incidentReportId: string, page?: number, limit?: number): Promise<CommentListResponse> {
    return this.evidence.getComments(incidentReportId, page, limit);
  }

  async createComment(data: CreateCommentRequest): Promise<CommentResponse> {
    return this.evidence.createComment(data);
  }

  async updateComment(commentId: string, data: UpdateCommentRequest): Promise<CommentResponse> {
    return this.evidence.updateComment(commentId, data);
  }

  async deleteComment(commentId: string): Promise<{ success: boolean }> {
    return this.evidence.deleteComment(commentId);
  }
}

/**
 * Factory function to create IncidentsApi instance
 * 
 * @param client - Configured API client
 * @returns IncidentsApi implementation
 */
export function createIncidentsApi(client: ApiClient): IIncidentsApi {
  return new IncidentsApi(client);
}

// Re-export all types for convenience
export type * from './types';
