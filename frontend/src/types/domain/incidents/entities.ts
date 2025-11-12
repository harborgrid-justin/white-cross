/**
 * WF-COMP-325 | incidents/entities.ts - Incident entity interfaces
 * Purpose: Core entity type definitions for incident reporting
 * Upstream: Backend models | Dependencies: BaseEntity, User, enums
 * Downstream: All incident components | Called by: API hooks, forms, displays
 * Related: enums.ts, requests.ts, responses.ts
 * Exports: Entity interfaces | Key Features: PHI/PII annotated entity definitions
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Entity creation → API persistence → Data display
 * LLM Context: Incident entity definitions with PHI/PII compliance annotations
 */

/**
 * Incident Reports Module - Core Entity Definitions
 * Entity interfaces aligned with backend database models
 * Includes PHI/PII field annotations for compliance tracking
 */

import type { BaseEntity, User } from '../../core/common';
import type {
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  WitnessType,
  ActionPriority,
  ActionStatus,
  InsuranceClaimStatus,
  ComplianceStatus,
} from './enums';

// =====================
// HELPER TYPES
// =====================

/**
 * Minimal student reference to avoid circular dependencies
 * Used in incident reports to reference student information
 */
export type StudentReference = {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
};

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
