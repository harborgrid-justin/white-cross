/**
 * WF-COMP-IMM | immunizations.enums.ts - Immunization Status and Classification Enums
 * Purpose: Type definitions for immunization status, compliance, administration details
 * Upstream: CDC ACIP Guidelines, VAERS reporting guidelines
 * Downstream: Immunization records, compliance tracking, reporting
 * Related: immunizations.records.ts, immunizations.compliance.ts
 * Exports: Status types, administration types, reaction types, exemption types
 * Last Updated: 2025-11-12 | File Type: .ts
 * LLM Context: Standardized enums for immunization management and compliance tracking
 */

// ==========================================
// ADMINISTRATION & COMPLIANCE
// ==========================================

/**
 * Immunization status for tracking compliance
 */
export type ImmunizationStatus =
  | 'complete'         // All required doses administered
  | 'in_progress'      // Series started but not complete
  | 'overdue'          // Past due date for next dose
  | 'due_soon'         // Due within next 30 days
  | 'scheduled'        // Future appointment scheduled
  | 'contraindicated'  // Medical contraindication exists
  | 'exempted'         // Exemption granted
  | 'not_started'      // No doses administered
  | 'refused';         // Parent/guardian refused

/**
 * Immunization compliance level
 */
export type ComplianceLevel =
  | 'compliant'        // 100% up-to-date
  | 'partially_compliant' // Some required vaccines missing
  | 'non_compliant'    // Multiple required vaccines missing
  | 'exempt'           // Valid exemption on file
  | 'pending_review';  // Awaiting compliance review

/**
 * Administration route for vaccine delivery
 * @aligned_with CDC ACIP guidelines
 */
export type AdministrationRoute =
  | 'INTRAMUSCULAR'    // IM - Most common for vaccines
  | 'SUBCUTANEOUS'     // SubQ - Some live vaccines
  | 'INTRADERMAL'      // ID - BCG, some allergy tests
  | 'ORAL'             // PO - Rotavirus, typhoid
  | 'INTRANASAL';      // IN - FluMist

/**
 * Injection site for intramuscular vaccines
 */
export type InjectionSite =
  | 'LEFT_DELTOID'     // Left upper arm (deltoid)
  | 'RIGHT_DELTOID'    // Right upper arm (deltoid)
  | 'LEFT_THIGH'       // Left thigh (vastus lateralis)
  | 'RIGHT_THIGH'      // Right thigh (vastus lateralis)
  | 'LEFT_GLUTEAL'     // Left buttock (not recommended)
  | 'RIGHT_GLUTEAL';   // Right buttock (not recommended)

/**
 * Vaccine reaction severity
 * @aligned_with VAERS reporting guidelines
 */
export type ReactionSeverity =
  | 'NONE'             // No reaction
  | 'MILD'             // Minor local reaction
  | 'MODERATE'         // Notable but not severe
  | 'SEVERE'           // Significant medical attention needed
  | 'LIFE_THREATENING' // Anaphylaxis or similar
  | 'DEATH';           // Fatal outcome (requires immediate VAERS report)

/**
 * Exemption types for immunization requirements
 */
export type ExemptionType =
  | 'medical'          // Medical contraindication
  | 'religious'        // Religious beliefs
  | 'philosophical'    // Personal/philosophical beliefs
  | 'temporary_medical'; // Temporary medical delay

/**
 * Exemption status
 */
export type ExemptionStatus =
  | 'active'
  | 'expired'
  | 'pending_review'
  | 'denied'
  | 'revoked';

/**
 * Vaccine reaction outcome
 */
export type ReactionOutcome =
  | 'resolved'
  | 'ongoing'
  | 'permanent_injury'
  | 'death';

/**
 * Exemption approval status
 */
export type ExemptionApprovalStatus =
  | 'pending'
  | 'approved'
  | 'denied'
  | 'revoked';

/**
 * Vaccine inventory status
 */
export type InventoryStatus =
  | 'active'
  | 'expired'
  | 'recalled'
  | 'quarantined';

/**
 * Vaccine inventory alert level
 */
export type InventoryAlertLevel =
  | 'normal'
  | 'low'
  | 'critical'
  | 'expired';

/**
 * Unit of measure for vaccine inventory
 */
export type InventoryUnitOfMeasure =
  | 'doses'
  | 'vials';

/**
 * Compliance trend direction
 */
export type TrendDirection =
  | 'improving'
  | 'declining'
  | 'stable';

/**
 * Administration trend direction
 */
export type AdministrationTrend =
  | 'increasing'
  | 'decreasing'
  | 'stable';
