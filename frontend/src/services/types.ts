/**
 * @fileoverview Services API Type Definitions
 * @module services/types
 *
 * Central type definitions for all API service modules including:
 * - API interface definitions
 * - Request/Response types
 * - Filter and query parameter types
 * - Common API types
 */

import type { BaseEntity } from '../types/common';
import type {
  IncidentReport,
  ComplianceReport,
  ReportData,
  ReportFilters,
  ReportType,
  ReportFormat,
  DateRangeFilter
} from '../types/reports';

// ==================== Communication API Types ====================

/**
 * Communication API interface
 */
export interface ICommunicationApi {
  // Message template management
  getMessageTemplates(filters?: any): Promise<any>;
  getMessageTemplate(id: string): Promise<any>;
  createMessageTemplate(data: any): Promise<any>;
  updateMessageTemplate(id: string, data: any): Promise<any>;
  deleteMessageTemplate(id: string): Promise<any>;

  // Message operations
  sendMessage(data: any): Promise<any>;
  getMessages(filters?: any): Promise<any>;
  getMessage(id: string): Promise<any>;
  markAsRead(id: string): Promise<any>;
  deleteMessage(id: string): Promise<any>;

  // Broadcast operations
  sendBroadcast(data: any): Promise<any>;
  getBroadcasts(filters?: any): Promise<any>;
  getBroadcast(id: string): Promise<any>;

  // Emergency alerts
  sendEmergencyAlert(data: any): Promise<any>;

  // Statistics and tracking
  getMessageStatus(id: string): Promise<any>;
  getStatistics(filters?: any): Promise<any>;
  processScheduledMessages(): Promise<any>;

  // Translation
  translateMessage(data: any): Promise<any>;
}

// ==================== Compliance API Types ====================

/**
 * Compliance API interface
 */
export interface IComplianceApi {
  // Compliance reports
  getReports(filters?: any): Promise<any>;
  getReport(id: string): Promise<any>;
  createReport(data: any): Promise<any>;
  updateReport(id: string, data: any): Promise<any>;
  deleteReport(id: string): Promise<any>;
  generateReport(type: string, period: string): Promise<any>;

  // Checklist items
  getChecklistItems(reportId: string): Promise<any>;
  createChecklistItem(data: any): Promise<any>;
  updateChecklistItem(id: string, data: any): Promise<any>;
  deleteChecklistItem(id: string): Promise<any>;

  // Consent forms
  getConsentForms(filters?: any): Promise<any>;
  getConsentForm(id: string): Promise<any>;
  createConsentForm(data: any): Promise<any>;
  updateConsentForm(id: string, data: any): Promise<any>;
  deleteConsentForm(id: string): Promise<any>;
  signConsentForm(data: any): Promise<any>;
  getStudentConsents(studentId: string): Promise<any>;

  // Policy documents
  getPolicyDocuments(filters?: any): Promise<any>;
  getPolicyDocument(id: string): Promise<any>;
  createPolicy(data: any): Promise<any>;
  updatePolicy(id: string, data: any): Promise<any>;
  deletePolicy(id: string): Promise<any>;
  acknowledgePolicy(id: string): Promise<any>;

  // Audit logs
  getAuditLogs(filters?: any): Promise<any>;

  // Statistics
  getStatistics(period?: string): Promise<any>;
}

/**
 * Checklist item for compliance reports
 */
export interface ChecklistItem extends BaseEntity {
  reportId: string;
  itemNumber: number;
  requirement: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL' | 'NOT_APPLICABLE';
  evidence?: string;
  notes?: string;
  assignedTo?: string;
  dueDate?: Date | string;
  completedAt?: Date | string;
}

/**
 * Consent form for HIPAA/FERPA compliance
 */
export interface ConsentForm extends BaseEntity {
  title: string;
  description?: string;
  type: 'HIPAA' | 'FERPA' | 'PHOTO_RELEASE' | 'MEDICAL_TREATMENT' | 'OTHER';
  content: string;
  version: string;
  isActive: boolean;
  requiresSignature: boolean;
  expiresAt?: Date | string;
}

/**
 * Policy document
 */
export interface PolicyDocument extends BaseEntity {
  title: string;
  description?: string;
  category: string;
  content: string;
  version: string;
  effectiveDate: Date | string;
  expiresAt?: Date | string;
  isActive: boolean;
  requiresAcknowledgment: boolean;
  approvedBy?: string;
  approvedAt?: Date | string;
}

// ==================== Incidents API Types ====================

/**
 * Incidents API interface
 */
export interface IIncidentsApi {
  // CRUD operations
  getAll(params?: IncidentReportFilters): Promise<IncidentReportListResponse>;
  getById(id: string): Promise<IncidentReportResponse>;
  create(data: CreateIncidentReportRequest): Promise<IncidentReportResponse>;
  update(id: string, data: UpdateIncidentReportRequest): Promise<IncidentReportResponse>;
  delete(id: string): Promise<{ success: boolean }>;

  // Search and statistics
  search(params: IncidentSearchParams): Promise<IncidentReportListResponse>;
  getStatistics(params?: IncidentStatisticsFilters): Promise<IncidentStatistics>;
  getFollowUpRequired(): Promise<IncidentReportListResponse>;
  getStudentRecentIncidents(studentId: string, limit?: number): Promise<IncidentReportListResponse>;

  // Parent notification
  markParentNotified(id: string, data: MarkParentNotifiedRequest): Promise<IncidentReportResponse>;
  notifyParent(id: string, data: NotifyParentRequest): Promise<IncidentReportResponse>;

  // Follow-up actions
  addFollowUpNotes(id: string, data: AddFollowUpNotesRequest): Promise<IncidentReportResponse>;
  addFollowUpAction(data: CreateFollowUpActionRequest): Promise<FollowUpActionResponse>;
  updateFollowUpAction(id: string, data: UpdateFollowUpActionRequest): Promise<FollowUpActionResponse>;
  completeFollowUpAction(id: string, notes?: string): Promise<FollowUpActionResponse>;
  getFollowUpActions(incidentReportId: string): Promise<FollowUpActionListResponse>;
  deleteFollowUpAction(id: string): Promise<{ success: boolean }>;

  // Witness statements
  addWitnessStatement(data: CreateWitnessStatementRequest): Promise<WitnessStatementResponse>;
  updateWitnessStatement(id: string, data: UpdateWitnessStatementRequest): Promise<WitnessStatementResponse>;
  verifyWitnessStatement(statementId: string): Promise<WitnessStatementResponse>;
  getWitnessStatements(incidentReportId: string): Promise<WitnessStatementListResponse>;
  deleteWitnessStatement(id: string): Promise<{ success: boolean }>;

  // Evidence
  addEvidence(id: string, data: AddEvidenceRequest): Promise<IncidentReportResponse>;
  uploadEvidence(incidentReportId: string, files: File[]): Promise<{ attachments: string[] }>;
  deleteEvidence(incidentReportId: string, fileName: string): Promise<{ success: boolean }>;

  // Insurance and compliance
  updateInsuranceClaim(id: string, data: UpdateInsuranceClaimRequest): Promise<IncidentReportResponse>;
  submitToInsurance(id: string, insuranceData: Record<string, unknown>): Promise<InsuranceSubmissionResponse>;
  getInsuranceSubmissions(incidentReportId: string): Promise<InsuranceSubmissionsResponse>;
  updateComplianceStatus(id: string, data: UpdateComplianceStatusRequest): Promise<IncidentReportResponse>;

  // Documents and export
  generateDocument(id: string): Promise<{ document: IncidentReportDocument }>;
  generateReport(id: string): Promise<Blob>;
  exportReports(params?: IncidentReportFilters): Promise<Blob>;

  // Comments
  getComments(incidentReportId: string, page?: number, limit?: number): Promise<CommentListResponse>;
  createComment(data: CreateCommentRequest): Promise<CommentResponse>;
  updateComment(commentId: string, data: UpdateCommentRequest): Promise<CommentResponse>;
  deleteComment(commentId: string): Promise<{ success: boolean }>;
}

/**
 * Witness statement for incidents
 */
export interface WitnessStatement extends BaseEntity {
  incidentReportId: string;
  witnessName: string;
  witnessType: 'STUDENT' | 'STAFF' | 'PARENT' | 'OTHER';
  witnessContact?: string;
  witnessRole?: string;
  statement: string;
  statementDate?: Date | string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date | string;
  isAnonymous?: boolean;
}

/**
 * Follow-up action for incidents
 */
export interface FollowUpAction extends BaseEntity {
  incidentReportId: string;
  action: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: ActionStatus;
  assignedTo?: string;
  assignedBy?: string;
  dueDate?: Date | string;
  completedAt?: Date | string;
  completedBy?: string;
  notes?: string;
}

/**
 * Action status enum
 */
export enum ActionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

/**
 * Incident report filters
 */
export interface IncidentReportFilters {
  page?: number;
  limit?: number;
  studentId?: string;
  reportedById?: string;
  type?: string;
  severity?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  parentNotified?: boolean;
  followUpRequired?: boolean;
  location?: string;
}

/**
 * Incident search parameters
 */
export interface IncidentSearchParams {
  query: string;
  page?: number;
  limit?: number;
}

/**
 * Incident statistics filters
 */
export interface IncidentStatisticsFilters {
  dateFrom?: string;
  dateTo?: string;
  studentId?: string;
}

/**
 * Create incident report request
 */
export interface CreateIncidentReportRequest {
  studentId: string;
  reportedById?: string;
  type: string;
  severity: string;
  description: string;
  location?: string;
  occurredAt: string | Date;
  actionsTaken?: string;
  followUpRequired?: boolean;
  injuryDescription?: string;
  parentNotified?: boolean;
  notificationMethod?: string;
  witnesses?: string[];
  injuries?: string[];
  medicalAttentionRequired?: boolean;
  medicalAttentionDetails?: string;
}

/**
 * Update incident report request
 */
export interface UpdateIncidentReportRequest {
  type?: string;
  severity?: string;
  description?: string;
  location?: string;
  occurredAt?: string | Date;
  actionsTaken?: string;
  followUpRequired?: boolean;
  followUpNotes?: string;
  injuryDescription?: string;
  parentNotified?: boolean;
  notificationMethod?: string;
  notificationTime?: string | Date;
  legalComplianceStatus?: string;
  witnesses?: string[];
  injuries?: string[];
  medicalAttentionRequired?: boolean;
  medicalAttentionDetails?: string;
  status?: string;
}

/**
 * Create witness statement request
 */
export interface CreateWitnessStatementRequest {
  incidentReportId: string;
  witnessName: string;
  witnessType: 'STUDENT' | 'STAFF' | 'PARENT' | 'OTHER';
  witnessContact?: string;
  witnessRole?: string;
  statement: string;
  statementDate?: string | Date;
  isAnonymous?: boolean;
}

/**
 * Update witness statement request
 */
export interface UpdateWitnessStatementRequest {
  witnessName?: string;
  witnessType?: 'STUDENT' | 'STAFF' | 'PARENT' | 'OTHER';
  witnessContact?: string;
  witnessRole?: string;
  statement?: string;
  statementDate?: string | Date;
  isVerified?: boolean;
}

/**
 * Create follow-up action request
 */
export interface CreateFollowUpActionRequest {
  incidentReportId: string;
  action: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo?: string;
  dueDate?: string | Date;
  notes?: string;
}

/**
 * Update follow-up action request
 */
export interface UpdateFollowUpActionRequest {
  action?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: ActionStatus;
  assignedTo?: string;
  dueDate?: string | Date;
  completedAt?: string | Date;
  notes?: string;
}

/**
 * Mark parent notified request
 */
export interface MarkParentNotifiedRequest {
  notificationMethod: string;
  notifiedBy?: string;
  notes?: string;
}

/**
 * Add follow-up notes request
 */
export interface AddFollowUpNotesRequest {
  notes: string;
}

/**
 * Notify parent request
 */
export interface NotifyParentRequest {
  method: 'EMAIL' | 'SMS' | 'PHONE' | 'IN_PERSON';
  message?: string;
}

/**
 * Add evidence request
 */
export interface AddEvidenceRequest {
  evidenceUrls: string[];
  type?: string;
  description?: string;
}

/**
 * Update insurance claim request
 */
export interface UpdateInsuranceClaimRequest {
  claimNumber: string;
  status: string;
  notes?: string;
}

/**
 * Update compliance status request
 */
export interface UpdateComplianceStatusRequest {
  status: string;
  reviewedBy?: string;
  notes?: string;
}

/**
 * Create comment request
 */
export interface CreateCommentRequest {
  incidentReportId: string;
  text: string;
}

/**
 * Update comment request
 */
export interface UpdateCommentRequest {
  text: string;
}

/**
 * Comment response
 */
export interface CommentResponse {
  comment: Comment;
}

/**
 * Comment list response
 */
export interface CommentListResponse {
  comments: Comment[];
  total: number;
  page?: number;
  limit?: number;
}

/**
 * Comment entity
 */
export interface Comment extends BaseEntity {
  incidentReportId: string;
  userId: string;
  userName?: string;
  text: string;
  isEdited?: boolean;
  editedAt?: Date | string;
}

/**
 * Incident report response
 */
export interface IncidentReportResponse {
  report: IncidentReport;
}

/**
 * Incident report list response
 */
export interface IncidentReportListResponse {
  reports: IncidentReport[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Witness statement response
 */
export interface WitnessStatementResponse {
  statement: WitnessStatement;
}

/**
 * Witness statement list response
 */
export interface WitnessStatementListResponse {
  statements: WitnessStatement[];
  total: number;
}

/**
 * Follow-up action response
 */
export interface FollowUpActionResponse {
  action: FollowUpAction;
}

/**
 * Follow-up action list response
 */
export interface FollowUpActionListResponse {
  actions: FollowUpAction[];
  total: number;
}

/**
 * Incident statistics response
 */
export interface IncidentStatistics {
  totalIncidents: number;
  byType: Array<{ type: string; count: number; percentage: number }>;
  bySeverity: Array<{ severity: string; count: number; percentage: number }>;
  byLocation: Array<{ location: string; count: number }>;
  byMonth: Array<{ month: string; count: number }>;
  parentNotificationRate: number;
  followUpCompletionRate: number;
}

/**
 * Incident report document
 */
export interface IncidentReportDocument {
  id: string;
  reportId: string;
  generatedAt: Date | string;
  format: string;
  content: Record<string, unknown>;
  fileUrl?: string;
}

/**
 * Insurance submission response
 */
export interface InsuranceSubmissionResponse {
  submission: {
    id: string;
    incidentReportId: string;
    submittedAt: Date | string;
    claimNumber?: string;
    status: string;
    data: Record<string, unknown>;
  };
}

/**
 * Insurance submissions response
 */
export interface InsuranceSubmissionsResponse {
  submissions: Array<{
    id: string;
    incidentReportId: string;
    submittedAt: Date | string;
    claimNumber?: string;
    status: string;
  }>;
  total: number;
}

// ==================== Re-export Common Types ====================

export type {
  BaseEntity,
  IncidentReport,
  ComplianceReport,
  ReportData,
  ReportFilters,
  ReportType,
  ReportFormat,
  DateRangeFilter
};
