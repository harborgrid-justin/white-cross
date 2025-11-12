/**
 * WF-COMP-325 | incidents/requests.ts - API request type definitions
 * Purpose: Request payload types for incident API endpoints
 * Upstream: API clients | Dependencies: Enums, entity types
 * Downstream: API hooks, form submissions | Called by: Service layer, hooks
 * Related: enums.ts, entities.ts, responses.ts
 * Exports: Request interfaces | Key Features: Type-safe API request payloads
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Form validation → Request construction → API submission
 * LLM Context: API request type definitions for incident management
 */

/**
 * Incident Reports Module - API Request Types
 * Request payload interfaces for all incident-related API operations
 */

import type {
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  WitnessType,
  ActionPriority,
  ActionStatus,
  InsuranceClaimStatus,
  ComplianceStatus,
  ParentNotificationMethod,
} from './enums';

// =====================
// INCIDENT REPORT REQUESTS
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

// =====================
// WITNESS STATEMENT REQUESTS
// =====================

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

// =====================
// FOLLOW-UP ACTION REQUESTS
// =====================

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

// =====================
// INCIDENT COMMENT REQUESTS
// =====================

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

// =====================
// PARENT NOTIFICATION REQUESTS
// =====================

/**
 * Request payload for marking parent as notified
 */
export interface MarkParentNotifiedRequest {
  notificationMethod?: string;
  notifiedBy?: string;
}

/**
 * Request payload for parent notification
 */
export interface NotifyParentRequest {
  method: ParentNotificationMethod;
}

// =====================
// FOLLOW-UP NOTES REQUESTS
// =====================

/**
 * Request payload for adding follow-up notes
 */
export interface AddFollowUpNotesRequest {
  notes: string;
}

// =====================
// EVIDENCE REQUESTS
// =====================

/**
 * Request payload for adding evidence
 */
export interface AddEvidenceRequest {
  evidenceType: 'photo' | 'video';
  evidenceUrls: string[];
}

// =====================
// INSURANCE REQUESTS
// =====================

/**
 * Request payload for updating insurance claim
 */
export interface UpdateInsuranceClaimRequest {
  claimNumber: string;
  status: InsuranceClaimStatus;
}

// =====================
// COMPLIANCE REQUESTS
// =====================

/**
 * Request payload for updating compliance status
 */
export interface UpdateComplianceStatusRequest {
  status: ComplianceStatus;
}
