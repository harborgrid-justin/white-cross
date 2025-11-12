/**
 * WF-COMP-325 | incidents/index.ts - Incident types barrel export
 * Purpose: Central export point for all incident-related types
 * Upstream: All incident type modules | Dependencies: Subdirectory modules
 * Downstream: Application code importing incident types | Called by: Components, hooks, services
 * Related: All files in incidents/ directory
 * Exports: All incident types | Key Features: Convenient single import point
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Import → Type checking → Application use
 * LLM Context: Barrel export for incident type system
 */

/**
 * Incident Reports Module - Central Export
 * Re-exports all types from the incidents module for convenient importing
 *
 * Usage:
 *   import { IncidentReport, IncidentType, CreateIncidentReportRequest } from '@/types/domain/incidents';
 *
 * Or import from subdirectory for more specific needs:
 *   import { IncidentType } from '@/types/domain/incidents/enums';
 */

// Enums and Constants
export {
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  WitnessType,
  ActionPriority,
  ActionStatus,
  InsuranceClaimStatus,
  ComplianceStatus,
  ParentNotificationMethod,
  EvidenceType,
} from './enums';

// Core Entities
export type {
  StudentReference,
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  IncidentComment,
} from './entities';

// API Request Types
export type {
  CreateIncidentReportRequest,
  UpdateIncidentReportRequest,
  IncidentReportFilters,
  CreateWitnessStatementRequest,
  UpdateWitnessStatementRequest,
  CreateFollowUpActionRequest,
  UpdateFollowUpActionRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
  MarkParentNotifiedRequest,
  NotifyParentRequest,
  AddFollowUpNotesRequest,
  AddEvidenceRequest,
  UpdateInsuranceClaimRequest,
  UpdateComplianceStatusRequest,
} from './requests';

// API Response Types
export type {
  IncidentReportResponse,
  IncidentReportListResponse,
  WitnessStatementResponse,
  WitnessStatementListResponse,
  FollowUpActionResponse,
  FollowUpActionListResponse,
  CommentResponse,
  CommentListResponse,
  IncidentStatisticsResponse,
  IncidentDocumentResponse,
  EvidenceUploadResponse,
  InsuranceSubmissionResponse,
  InsuranceSubmissionsResponse,
} from './responses';

// Statistics and Analytics
export type {
  IncidentStatistics,
  IncidentStatisticsFilters,
  IncidentSearchParams,
} from './statistics';

// Document Generation
export type { IncidentReportDocument } from './documents';

// Form Data Types
export type {
  IncidentReportFormData,
  WitnessStatementFormData,
  FollowUpActionFormData,
} from './forms';

// Utility Functions
export {
  isIncidentType,
  isIncidentSeverity,
  isWitnessType,
  isActionStatus,
  getIncidentTypeLabel,
  getIncidentSeverityLabel,
  getIncidentSeverityColor,
  getActionPriorityColor,
  getActionStatusColor,
} from './utils';
