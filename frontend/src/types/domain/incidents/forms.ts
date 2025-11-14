/**
 * WF-COMP-325 | incidents/forms.ts - Form data types
 * Purpose: Type definitions for incident-related form data
 * Upstream: Form components | Dependencies: Enums
 * Downstream: Form validation, submission handlers | Called by: Form components, hooks
 * Related: entities.ts, requests.ts, enums.ts
 * Exports: Form data interfaces | Key Features: Type-safe form state management
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Form input → Validation → Data transformation → API submission
 * LLM Context: Form data type definitions for incident management
 */

/**
 * Incident Reports Module - Form Data Types
 * Form data interfaces for incident-related forms
 * Used for form state management and validation
 */

import type {
  IncidentType,
  IncidentSeverity,
  WitnessType,
  ActionPriority,
} from './enums';

// =====================
// FORM DATA TYPES
// =====================

/**
 * Form data for incident report creation/editing
 * Used in incident report forms for state management
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
 * Used in witness statement forms for state management
 */
export interface WitnessStatementFormData {
  witnessName: string;
  witnessType: WitnessType;
  witnessContact?: string;
  statement: string;
}

/**
 * Form data for follow-up action
 * Used in follow-up action forms for state management
 */
export interface FollowUpActionFormData {
  action: string;
  dueDate: string;
  priority: ActionPriority;
  assignedTo?: string;
}
