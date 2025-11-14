/**
 * WF-COMP-IMM | immunizations.ts - Immunization Management Types
 * Purpose: Comprehensive type definitions for vaccine administration and compliance tracking
 * Upstream: React, CDC ACIP Guidelines, VIS | Dependencies: Healthcare regulatory standards
 * Downstream: Components, pages, app routing | Called by: Immunization management system
 * Related: Students, health records, compliance reporting
 * Exports: interfaces, types, enums | Key Features: CDC-compliant vaccine tracking
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Vaccine administration → Compliance tracking → State reporting
 * LLM Context: HIPAA-compliant immunization records, CDC vaccine schedules, state requirements
 */

/**
 * HIPAA NOTICE: All immunization data is considered Protected Health Information (PHI)
 * All access and modifications must be audit logged per HIPAA requirements
 */

// ==========================================
// CDC VACCINE CODES & CLASSIFICATIONS
// ==========================================

export type {
  VaccineCode,
  VaccineType,
  VaccineCategory,
} from './immunizations.codes';

// ==========================================
// ENUMS & STATUS TYPES
// ==========================================

export type {
  ImmunizationStatus,
  ComplianceLevel,
  AdministrationRoute,
  InjectionSite,
  ReactionSeverity,
  ExemptionType,
  ExemptionStatus,
  ReactionOutcome,
  ExemptionApprovalStatus,
  InventoryStatus,
  InventoryAlertLevel,
  InventoryUnitOfMeasure,
  TrendDirection,
  AdministrationTrend,
} from './immunizations.enums';

// ==========================================
// CORE RECORD INTERFACES
// ==========================================

export type {
  StudentImmunization,
  VaccineReaction,
  ImmunizationSchedule,
} from './immunizations.records';

// ==========================================
// COMPLIANCE & EXEMPTIONS
// ==========================================

export type {
  ImmunizationExemption,
  StudentComplianceSummary,
  VaccineInventory,
} from './immunizations.compliance';

// ==========================================
// STATISTICS & DASHBOARD
// ==========================================

export type {
  ImmunizationDashboardStats,
  VaccineStatistics,
} from './immunizations.statistics';

// ==========================================
// FORM DATA INTERFACES
// ==========================================

export type {
  VaccineAdministrationFormData,
  ReactionReportFormData,
  ExemptionRequestFormData,
} from './immunizations.forms';

// ==========================================
// API RESPONSES & ACTION RESULTS
// ==========================================

export type {
  ActionResult,
  PaginationMeta,
  PaginatedImmunizationsResponse,
  ComplianceReportResponse,
} from './immunizations.responses';

// ==========================================
// CONVENIENCE TYPE ALIASES
// ==========================================

// Re-export convenience aliases for backward compatibility
export type { StudentImmunization as Immunization } from './immunizations.records';
export type { StudentImmunization as ImmunizationRecord } from './immunizations.records';
