/**
 * Incidents API - Type Definitions
 * 
 * Comprehensive type definitions for incident management system
 * 
 * @module services/modules/incidentsApi/types
 */

// Import and re-export all types from the main types module
import type {
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  CreateIncidentReportRequest,
  UpdateIncidentReportRequest,
  IncidentReportFilters,
  CreateWitnessStatementRequest,
  UpdateWitnessStatementRequest,
  CreateFollowUpActionRequest,
  UpdateFollowUpActionRequest,
  MarkParentNotifiedRequest,
  AddFollowUpNotesRequest,
  NotifyParentRequest,
  AddEvidenceRequest,
  UpdateInsuranceClaimRequest,
  UpdateComplianceStatusRequest,
  IncidentStatisticsFilters,
  IncidentSearchParams,
  IncidentReportResponse,
  IncidentReportListResponse,
  WitnessStatementResponse,
  WitnessStatementListResponse,
  FollowUpActionResponse,
  FollowUpActionListResponse,
  IncidentStatistics,
  IncidentReportDocument,
  InsuranceSubmissionResponse,
  InsuranceSubmissionsResponse,
  ActionStatus,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentResponse,
  CommentListResponse
} from '../../types';

// Re-export all types
export type {
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  CreateIncidentReportRequest,
  UpdateIncidentReportRequest,
  IncidentReportFilters,
  CreateWitnessStatementRequest,
  UpdateWitnessStatementRequest,
  CreateFollowUpActionRequest,
  UpdateFollowUpActionRequest,
  MarkParentNotifiedRequest,
  AddFollowUpNotesRequest,
  NotifyParentRequest,
  AddEvidenceRequest,
  UpdateInsuranceClaimRequest,
  UpdateComplianceStatusRequest,
  IncidentStatisticsFilters,
  IncidentSearchParams,
  IncidentReportResponse,
  IncidentReportListResponse,
  WitnessStatementResponse,
  WitnessStatementListResponse,
  FollowUpActionResponse,
  FollowUpActionListResponse,
  IncidentStatistics,
  IncidentReportDocument,
  InsuranceSubmissionResponse,
  InsuranceSubmissionsResponse,
  ActionStatus,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentResponse,
  CommentListResponse
};

// API interface
export interface IIncidentsApi {
  // Incident Report CRUD
  getAll(params?: IncidentReportFilters): Promise<IncidentReportListResponse>;
  getById(id: string): Promise<IncidentReportResponse>;
  create(data: CreateIncidentReportRequest): Promise<IncidentReportResponse>;
  update(id: string, data: UpdateIncidentReportRequest): Promise<IncidentReportResponse>;
  delete(id: string): Promise<{ success: boolean }>;

  // Search and Statistics
  search(params: IncidentSearchParams): Promise<IncidentReportListResponse>;
  getStatistics(params?: IncidentStatisticsFilters): Promise<IncidentStatistics>;
  getFollowUpRequired(): Promise<IncidentReportListResponse>;
  getStudentRecentIncidents(studentId: string, limit?: number): Promise<IncidentReportListResponse>;

  // Parent Notification
  markParentNotified(id: string, data: MarkParentNotifiedRequest): Promise<IncidentReportResponse>;
  notifyParent(id: string, data: NotifyParentRequest): Promise<IncidentReportResponse>;

  // Follow-up Notes and Actions
  addFollowUpNotes(id: string, data: AddFollowUpNotesRequest): Promise<IncidentReportResponse>;
  addFollowUpAction(data: CreateFollowUpActionRequest): Promise<FollowUpActionResponse>;
  updateFollowUpAction(id: string, data: UpdateFollowUpActionRequest): Promise<FollowUpActionResponse>;
  completeFollowUpAction(id: string, notes?: string): Promise<FollowUpActionResponse>;
  getFollowUpActions(incidentReportId: string): Promise<FollowUpActionListResponse>;
  deleteFollowUpAction(id: string): Promise<{ success: boolean }>;

  // Witness Statements
  addWitnessStatement(data: CreateWitnessStatementRequest): Promise<WitnessStatementResponse>;
  updateWitnessStatement(id: string, data: UpdateWitnessStatementRequest): Promise<WitnessStatementResponse>;
  verifyWitnessStatement(statementId: string): Promise<WitnessStatementResponse>;
  getWitnessStatements(incidentReportId: string): Promise<WitnessStatementListResponse>;
  deleteWitnessStatement(id: string): Promise<{ success: boolean }>;

  // Evidence Management
  addEvidence(id: string, data: AddEvidenceRequest): Promise<IncidentReportResponse>;
  uploadEvidence(incidentReportId: string, files: File[]): Promise<{ attachments: string[] }>;
  deleteEvidence(incidentReportId: string, fileName: string): Promise<{ success: boolean }>;

  // Insurance and Compliance
  updateInsuranceClaim(id: string, data: UpdateInsuranceClaimRequest): Promise<IncidentReportResponse>;
  submitToInsurance(id: string, insuranceData: Record<string, unknown>): Promise<InsuranceSubmissionResponse>;
  getInsuranceSubmissions(incidentReportId: string): Promise<InsuranceSubmissionsResponse>;
  updateComplianceStatus(id: string, data: UpdateComplianceStatusRequest): Promise<IncidentReportResponse>;

  // Document Generation and Export
  generateDocument(id: string): Promise<{ document: IncidentReportDocument }>;
  generateReport(id: string): Promise<Blob>;
  exportReports(params?: IncidentReportFilters): Promise<Blob>;

  // Comments
  getComments(incidentReportId: string, page?: number, limit?: number): Promise<CommentListResponse>;
  createComment(data: CreateCommentRequest): Promise<CommentResponse>;
  updateComment(commentId: string, data: UpdateCommentRequest): Promise<CommentResponse>;
  deleteComment(commentId: string): Promise<{ success: boolean }>;
}
