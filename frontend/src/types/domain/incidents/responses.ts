/**
 * WF-COMP-325 | incidents/responses.ts - API response type definitions
 * Purpose: Response payload types for incident API endpoints
 * Upstream: API endpoints | Dependencies: Entities, enums
 * Downstream: API hooks, data displays | Called by: Service layer, hooks
 * Related: entities.ts, enums.ts, requests.ts
 * Exports: Response interfaces | Key Features: Type-safe API response payloads
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: API response → Data parsing → Component rendering
 * LLM Context: API response type definitions for incident management
 */

/**
 * Incident Reports Module - API Response Types
 * Response payload interfaces for all incident-related API operations
 */

import type {
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  IncidentComment,
} from './entities';
import type { IncidentStatistics } from './statistics';
import type { IncidentReportDocument } from './documents';
import type { InsuranceClaimStatus } from './enums';

// =====================
// INCIDENT REPORT RESPONSES
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

// =====================
// WITNESS STATEMENT RESPONSES
// =====================

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

// =====================
// FOLLOW-UP ACTION RESPONSES
// =====================

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

// =====================
// COMMENT RESPONSES
// =====================

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
// STATISTICS RESPONSES
// =====================

/**
 * Response containing incident statistics
 */
export interface IncidentStatisticsResponse {
  statistics: IncidentStatistics;
}

// =====================
// DOCUMENT RESPONSES
// =====================

/**
 * Response containing generated document
 */
export interface IncidentDocumentResponse {
  document: IncidentReportDocument;
}

// =====================
// EVIDENCE RESPONSES
// =====================

/**
 * Response for evidence upload
 */
export interface EvidenceUploadResponse {
  attachments: string[];
}

// =====================
// INSURANCE RESPONSES
// =====================

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
