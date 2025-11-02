/**
 * WF-COMP-325 | incidents.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions, interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Incident Reports Module Types
 * Comprehensive type definitions for incident reporting system
 * Includes incidents, witness statements, follow-up actions, and compliance tracking
 */

import type { BaseEntity, User, Priority } from '../core/common';

// To avoid circular dependencies, define minimal reference types
type StudentReference = {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
};

// =====================
// ENUMS AND CONSTANTS
// =====================

/**
 * Incident type classification
 * @aligned_with backend/src/database/types/enums.ts:IncidentType
 */
export enum IncidentType {
  INJURY = 'INJURY',
  ILLNESS = 'ILLNESS',
  BEHAVIORAL = 'BEHAVIORAL',
  MEDICATION_ERROR = 'MEDICATION_ERROR',
  ALLERGIC_REACTION = 'ALLERGIC_REACTION',
  EMERGENCY = 'EMERGENCY',
  OTHER = 'OTHER',
}

/**
 * Incident severity levels
 * @aligned_with backend/src/database/types/enums.ts:IncidentSeverity
 */
export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Incident status tracking (UI-specific)
 * Note: Used for frontend workflow states. Backend tracks status via other fields.
 */
export enum IncidentStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

/**
 * Witness type classification
 * @aligned_with backend/src/database/types/enums.ts:WitnessType
 */
export enum WitnessType {
  STUDENT = 'STUDENT',
  STAFF = 'STAFF',
  PARENT = 'PARENT',
  OTHER = 'OTHER',
}

/**
 * Follow-up action priority levels
 * @aligned_with backend/src/database/types/enums.ts:ActionPriority
 */
export enum ActionPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

/**
 * Follow-up action status
 * @aligned_with backend/src/database/types/enums.ts:ActionStatus
 */
export enum ActionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Insurance claim status tracking
 * @aligned_with backend/src/database/types/enums.ts:InsuranceClaimStatus
 */
export enum InsuranceClaimStatus {
  NOT_FILED = 'NOT_FILED',
  FILED = 'FILED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
  CLOSED = 'CLOSED',
}

/**
 * Legal compliance status
 * @aligned_with backend/src/database/types/enums.ts:ComplianceStatus
 */
export enum ComplianceStatus {
  PENDING = 'PENDING',
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

/**
 * Parent notification methods (UI-specific)
 * Note: Used for tracking notification methods in UI. Not a backend enum.
 */
export enum ParentNotificationMethod {
  EMAIL = 'email',
  SMS = 'sms',
  VOICE = 'voice',
  IN_PERSON = 'in-person',
  AUTO_NOTIFICATION = 'auto-notification',
}

/**
 * Evidence file types (UI-specific)
 * Note: Used for UI file type classification. Not a backend enum.
 */
export enum EvidenceType {
  PHOTO = 'photo',
  VIDEO = 'video',
  DOCUMENT = 'document',
  AUDIO = 'audio',
}

// =====================
// CORE ENTITIES
// =====================

/**
 * Main Incident Report entity
 * Contains all information about a safety or health incident
 *
 * @aligned_with backend/src/database/models/incidents/IncidentReport.ts
 *
 * PHI/PII Fields:
 * - studentId: Student identifier involved in incident (PII)
 * - reportedById: User identifier who reported the incident (PII)
 * - description: Detailed incident description may contain health information (PHI)
 * - actionsTaken: Medical actions and interventions (PHI)
 * - witnesses: Array of witness identifiers (PII)
 * - parentNotifiedBy: User identifier who notified parent (PII)
 * - followUpNotes: May contain medical follow-up information (PHI)
 * - evidencePhotos/evidenceVideos: May contain images/videos of injuries (PHI)
 *
 * Note: status, discoveredAt, and reportedAt are UI-specific fields not in backend model
 */
export interface IncidentReport extends BaseEntity {
  // Student and Reporter Information
  studentId: string; // PII - Student identifier
  student?: StudentReference;
  reportedById: string; // PII - Reporter identifier
  reportedBy?: User;

  // Incident Classification
  type: IncidentType;
  severity: IncidentSeverity;
  status?: IncidentStatus; // UI-specific field (not in backend)

  // Incident Details
  description: string; // PHI - May contain health information
  location: string;
  occurredAt: string;
  discoveredAt?: string; // UI-specific field (not in backend)
  reportedAt?: string; // UI-specific field (not in backend)

  // Witness Information
  witnesses?: string[]; // PII - Witness identifiers
  witnessStatements?: WitnessStatement[];

  // Actions and Response
  actionsTaken: string; // PHI - Medical actions and interventions

  // Follow-up Tracking
  followUpRequired?: boolean;
  followUpNotes?: string; // PHI - Medical follow-up information
  followUpActions?: FollowUpAction[];

  // Parent/Guardian Notification
  parentNotified?: boolean;
  parentNotificationMethod?: string;
  parentNotifiedAt?: string;
  parentNotifiedBy?: string; // PII - User identifier

  // Evidence and Documentation
  attachments?: string[]; // May contain PHI
  evidencePhotos?: string[]; // PHI - Images of injuries
  evidenceVideos?: string[]; // PHI - Videos of incidents

  // Insurance and Compliance
  insuranceClaimNumber?: string;
  insuranceClaimStatus?: InsuranceClaimStatus;
  legalComplianceStatus?: ComplianceStatus;
}

/**
 * Witness Statement entity
 * Records statements from witnesses of an incident
 *
 * @aligned_with backend/src/database/models/incidents/WitnessStatement.ts
 *
 * PHI/PII Fields:
 * - witnessName: Full name of the witness (PII)
 * - witnessContact: Contact information (email/phone) (PII)
 * - statement: Witness testimony may contain health information (PHI)
 * - verifiedBy: User identifier who verified the statement (PII)
 */
export interface WitnessStatement extends BaseEntity {
  // Reference
  incidentReportId: string;
  incidentReport?: IncidentReport;

  // Witness Information
  witnessName: string; // PII - Witness full name
  witnessType: WitnessType;
  witnessContact?: string; // PII - Contact information

  // Statement Details
  statement: string; // May contain PHI

  // Verification
  verified: boolean;
  verifiedBy?: string; // PII - User identifier
  verifiedAt?: string;
}

/**
 * Follow-up Action entity
 * Tracks required actions and follow-up tasks for incidents
 *
 * @aligned_with backend/src/database/models/incidents/FollowUpAction.ts
 *
 * PHI/PII Fields:
 * - action: Description of follow-up action may reference medical care (PHI)
 * - assignedTo: User identifier assigned to the action (PII)
 * - completedBy: User identifier who completed the action (PII)
 * - notes: Completion notes may contain health information (PHI)
 */
export interface FollowUpAction extends BaseEntity {
  // Reference
  incidentReportId: string;
  incidentReport?: IncidentReport;

  // Action Details
  action: string; // May contain PHI
  priority: ActionPriority;
  status: ActionStatus;

  // Assignment
  assignedTo?: string; // PII - User identifier
  assignedToUser?: User;

  // Scheduling
  dueDate: string;

  // Completion
  completedAt?: string;
  completedBy?: string; // PII - User identifier
  notes?: string; // PHI - May contain health information
}

/**
 * Incident Comment entity
 * User comments on incident reports for collaboration and discussion
 *
 * PHI/PII Fields:
 * - userId: User identifier who created the comment (PII)
 * - text: Comment content may contain health information (PHI)
 * - editedBy: User identifier who edited the comment (PII)
 */
export interface IncidentComment extends BaseEntity {
  // Reference
  incidentReportId: string;
  incidentReport?: IncidentReport;

  // User Information
  userId: string; // PII - User identifier
  user?: User;

  // Comment Details
  text: string; // May contain PHI

  // Edit tracking
  isEdited: boolean;
  editedAt?: string;
  editedBy?: string; // PII - User identifier

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// =====================
// API REQUEST/RESPONSE TYPES
// =====================

/**
 * Request payload for creating a new incident report
 */
export interface CreateIncidentReportRequest {
  studentId: string;
  reportedById: string;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  location: string;
  witnesses?: string[];
  actionsTaken: string;
  occurredAt: string;
  parentNotified?: boolean;
  followUpRequired?: boolean;
  followUpNotes?: string;
  attachments?: string[];
  evidencePhotos?: string[];
  evidenceVideos?: string[];
  insuranceClaimNumber?: string;
}

/**
 * Request payload for updating an existing incident report
 */
export interface UpdateIncidentReportRequest {
  type?: IncidentType;
  severity?: IncidentSeverity;
  description?: string;
  location?: string;
  witnesses?: string[];
  actionsTaken?: string;
  occurredAt?: string;
  parentNotified?: boolean;
  followUpRequired?: boolean;
  followUpNotes?: string;
  attachments?: string[];
  evidencePhotos?: string[];
  evidenceVideos?: string[];
  insuranceClaimNumber?: string;
  insuranceClaimStatus?: InsuranceClaimStatus;
  legalComplianceStatus?: ComplianceStatus;
}

/**
 * Filter parameters for incident report queries
 */
export interface IncidentReportFilters {
  page?: number;
  limit?: number;
  studentId?: string;
  reportedById?: string;
  type?: IncidentType;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  dateFrom?: string;
  dateTo?: string;
  parentNotified?: boolean;
  followUpRequired?: boolean;
  location?: string;
}

/**
 * Request payload for creating a witness statement
 */
export interface CreateWitnessStatementRequest {
  incidentReportId: string;
  witnessName: string;
  witnessType: WitnessType;
  witnessContact?: string;
  statement: string;
}

/**
 * Request payload for updating a witness statement
 */
export interface UpdateWitnessStatementRequest {
  witnessName?: string;
  witnessType?: WitnessType;
  witnessContact?: string;
  statement?: string;
  verified?: boolean;
}

/**
 * Request payload for creating a follow-up action
 */
export interface CreateFollowUpActionRequest {
  incidentReportId: string;
  action: string;
  dueDate: string;
  priority: ActionPriority;
  assignedTo?: string;
}

/**
 * Request payload for updating a follow-up action
 */
export interface UpdateFollowUpActionRequest {
  action?: string;
  dueDate?: string;
  priority?: ActionPriority;
  status?: ActionStatus;
  assignedTo?: string;
  notes?: string;
}

/**
 * Request payload for marking parent as notified
 */
export interface MarkParentNotifiedRequest {
  notificationMethod?: string;
  notifiedBy?: string;
}

/**
 * Request payload for adding follow-up notes
 */
export interface AddFollowUpNotesRequest {
  notes: string;
}

/**
 * Request payload for parent notification
 */
export interface NotifyParentRequest {
  method: ParentNotificationMethod;
}

/**
 * Request payload for adding evidence
 */
export interface AddEvidenceRequest {
  evidenceType: 'photo' | 'video';
  evidenceUrls: string[];
}

/**
 * Request payload for updating insurance claim
 */
export interface UpdateInsuranceClaimRequest {
  claimNumber: string;
  status: InsuranceClaimStatus;
}

/**
 * Request payload for updating compliance status
 */
export interface UpdateComplianceStatusRequest {
  status: ComplianceStatus;
}

// =====================
// STATISTICS AND ANALYTICS
// =====================

/**
 * Incident statistics response
 * Provides analytics and metrics about incidents
 */
export interface IncidentStatistics {
  total: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  byLocation: Record<string, number>;
  parentNotificationRate: number;
  followUpRate: number;
  averageResponseTime: number; // in minutes
}

/**
 * Filter parameters for statistics queries
 */
export interface IncidentStatisticsFilters {
  dateFrom?: string;
  dateTo?: string;
  studentId?: string;
}

/**
 * Search parameters for incident reports
 */
export interface IncidentSearchParams {
  query: string;
  page?: number;
  limit?: number;
}

// =====================
// DOCUMENT GENERATION
// =====================

/**
 * Generated incident report document structure
 */
export interface IncidentReportDocument {
  reportNumber: string;
  generatedAt: string;
  student: {
    name: string;
    studentNumber: string;
    grade: string;
    dateOfBirth: string;
  };
  incident: {
    type: IncidentType;
    severity: IncidentSeverity;
    occurredAt: string;
    location: string;
    description: string;
    actionsTaken: string;
    witnesses?: string[];
  };
  reporter: {
    name: string;
    role: string;
    reportedAt: string;
  };
  followUp: {
    required: boolean;
    notes?: string;
    parentNotified: boolean;
    parentNotificationMethod?: string;
    parentNotifiedAt?: string;
    actions?: FollowUpAction[];
  };
  evidence: {
    attachments?: string[];
    photos?: string[];
    videos?: string[];
  };
  witnessStatements?: WitnessStatement[];
  insurance: {
    claimNumber?: string;
    claimStatus?: InsuranceClaimStatus;
  };
  compliance: {
    status?: ComplianceStatus;
  };
}

// =====================
// API RESPONSE TYPES
// =====================

/**
 * Response containing a single incident report
 */
export interface IncidentReportResponse {
  report: IncidentReport;
}

/**
 * Response containing paginated list of incident reports
 */
export interface IncidentReportListResponse {
  reports: IncidentReport[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Response containing a single witness statement
 */
export interface WitnessStatementResponse {
  statement: WitnessStatement;
}

/**
 * Response containing list of witness statements
 */
export interface WitnessStatementListResponse {
  statements: WitnessStatement[];
}

/**
 * Response containing a single follow-up action
 */
export interface FollowUpActionResponse {
  action: FollowUpAction;
}

/**
 * Response containing list of follow-up actions
 */
export interface FollowUpActionListResponse {
  actions: FollowUpAction[];
}

/**
 * Response containing incident statistics
 */
export interface IncidentStatisticsResponse {
  statistics: IncidentStatistics;
}

/**
 * Response containing generated document
 */
export interface IncidentDocumentResponse {
  document: IncidentReportDocument;
}

/**
 * Response for evidence upload
 */
export interface EvidenceUploadResponse {
  attachments: string[];
}

/**
 * Response for insurance submission
 */
export interface InsuranceSubmissionResponse {
  submission: {
    id: string;
    claimNumber: string;
    status: InsuranceClaimStatus;
    submittedAt: string;
    submittedBy: string;
  };
}

/**
 * Response containing list of insurance submissions
 */
export interface InsuranceSubmissionsResponse {
  submissions: Array<{
    id: string;
    claimNumber: string;
    status: InsuranceClaimStatus;
    submittedAt: string;
    submittedBy: string;
  }>;
}

// =====================
// FORM DATA TYPES
// =====================

/**
 * Form data for incident report creation/editing
 */
export interface IncidentReportFormData {
  studentId: string;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  location: string;
  occurredAt: string;
  actionsTaken: string;
  witnesses?: string[];
  parentNotified?: boolean;
  followUpRequired?: boolean;
  followUpNotes?: string;
}

/**
 * Form data for witness statement
 */
export interface WitnessStatementFormData {
  witnessName: string;
  witnessType: WitnessType;
  witnessContact?: string;
  statement: string;
}

/**
 * Form data for follow-up action
 */
export interface FollowUpActionFormData {
  action: string;
  dueDate: string;
  priority: ActionPriority;
  assignedTo?: string;
}

/**
 * Request payload for creating a comment
 */
export interface CreateCommentRequest {
  incidentReportId: string;
  text: string;
}

/**
 * Request payload for updating a comment
 */
export interface UpdateCommentRequest {
  text: string;
}

/**
 * Response containing a single comment
 */
export interface CommentResponse {
  comment: IncidentComment;
}

/**
 * Response containing list of comments
 */
export interface CommentListResponse {
  comments: IncidentComment[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// =====================
// UTILITY TYPES
// =====================

/**
 * Type guard for checking if value is valid IncidentType
 */
export function isIncidentType(value: string): value is IncidentType {
  return Object.values(IncidentType).includes(value as IncidentType);
}

/**
 * Type guard for checking if value is valid IncidentSeverity
 */
export function isIncidentSeverity(value: string): value is IncidentSeverity {
  return Object.values(IncidentSeverity).includes(value as IncidentSeverity);
}

/**
 * Type guard for checking if value is valid WitnessType
 */
export function isWitnessType(value: string): value is WitnessType {
  return Object.values(WitnessType).includes(value as WitnessType);
}

/**
 * Type guard for checking if value is valid ActionStatus
 */
export function isActionStatus(value: string): value is ActionStatus {
  return Object.values(ActionStatus).includes(value as ActionStatus);
}

/**
 * Helper function to get human-readable incident type label
 */
export function getIncidentTypeLabel(type: IncidentType): string {
  const labels: Record<IncidentType, string> = {
    [IncidentType.INJURY]: 'Injury',
    [IncidentType.ILLNESS]: 'Illness',
    [IncidentType.BEHAVIORAL]: 'Behavioral',
    [IncidentType.MEDICATION_ERROR]: 'Medication Error',
    [IncidentType.ALLERGIC_REACTION]: 'Allergic Reaction',
    [IncidentType.EMERGENCY]: 'Emergency',
    [IncidentType.OTHER]: 'Other',
  };
  return labels[type] || type;
}

/**
 * Helper function to get human-readable severity label
 */
export function getIncidentSeverityLabel(severity: IncidentSeverity): string {
  const labels: Record<IncidentSeverity, string> = {
    [IncidentSeverity.LOW]: 'Low',
    [IncidentSeverity.MEDIUM]: 'Medium',
    [IncidentSeverity.HIGH]: 'High',
    [IncidentSeverity.CRITICAL]: 'Critical',
  };
  return labels[severity] || severity;
}

/**
 * Helper function to get severity color class for UI
 */
export function getIncidentSeverityColor(severity: IncidentSeverity): string {
  const colors: Record<IncidentSeverity, string> = {
    [IncidentSeverity.LOW]: 'text-green-600 bg-green-100',
    [IncidentSeverity.MEDIUM]: 'text-yellow-600 bg-yellow-100',
    [IncidentSeverity.HIGH]: 'text-orange-600 bg-orange-100',
    [IncidentSeverity.CRITICAL]: 'text-red-600 bg-red-100',
  };
  return colors[severity] || 'text-gray-600 bg-gray-100';
}

/**
 * Helper function to get action priority color class for UI
 */
export function getActionPriorityColor(priority: ActionPriority): string {
  const colors: Record<ActionPriority, string> = {
    [ActionPriority.LOW]: 'text-blue-600 bg-blue-100',
    [ActionPriority.MEDIUM]: 'text-yellow-600 bg-yellow-100',
    [ActionPriority.HIGH]: 'text-orange-600 bg-orange-100',
    [ActionPriority.URGENT]: 'text-red-600 bg-red-100',
  };
  return colors[priority] || 'text-gray-600 bg-gray-100';
}

/**
 * Helper function to get action status color class for UI
 */
export function getActionStatusColor(status: ActionStatus): string {
  const colors: Record<ActionStatus, string> = {
    [ActionStatus.PENDING]: 'text-gray-600 bg-gray-100',
    [ActionStatus.IN_PROGRESS]: 'text-blue-600 bg-blue-100',
    [ActionStatus.COMPLETED]: 'text-green-600 bg-green-100',
    [ActionStatus.CANCELLED]: 'text-red-600 bg-red-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
}
