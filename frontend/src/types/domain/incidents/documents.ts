/**
 * WF-COMP-325 | incidents/documents.ts - Document generation types
 * Purpose: Type definitions for generated incident report documents
 * Upstream: Document generation service | Dependencies: Entities, enums
 * Downstream: PDF generators, report exports | Called by: Document generation hooks
 * Related: entities.ts, enums.ts
 * Exports: Document interfaces | Key Features: Structured document generation
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Data collection → Document generation → Export/Print
 * LLM Context: Incident report document generation type definitions
 */

/**
 * Incident Reports Module - Document Generation Types
 * Defines structure for generated incident report documents
 */

import type { FollowUpAction, WitnessStatement } from './entities';
import type {
  IncidentType,
  IncidentSeverity,
  InsuranceClaimStatus,
  ComplianceStatus,
} from './enums';

// =====================
// DOCUMENT GENERATION
// =====================

/**
 * Generated incident report document structure
 * Represents a complete formatted incident report for export/printing
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
