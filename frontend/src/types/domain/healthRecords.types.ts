/**
 * WF-COMP-324 | healthRecords.types.ts - Health Records Type Definitions
 * Purpose: Type definitions and enums for health records system
 * Upstream: Backend enums, service interfaces | Dependencies: Service API types
 * Downstream: Models, forms, API modules | Called by: Health records components
 * Related: healthRecords.models.ts, healthRecords.forms.ts, healthRecords.api.ts
 * Exports: Type definitions, enums | Key Features: Type-safe enum definitions
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type definitions → Model interfaces → Component usage
 * LLM Context: Core type definitions for health records domain, aligned with backend
 */

/**
 * Health Records Type Definitions
 * Aligned with backend enums and service interfaces
 */

import type { AllergySeverity } from '@/types/core/enums'

// ==========================================
// NAVIGATION & UI TYPES
// ==========================================

/**
 * Tab navigation types for health records interface
 */
export type TabType = 'overview' | 'records' | 'allergies' | 'chronic' | 'vaccinations' | 'growth' | 'screenings' | 'vitals' | 'analytics'

// ==========================================
// HEALTH RECORD ENUMS
// ==========================================

/**
 * Health Record Type Enum
 * @aligned_with backend HealthRecordType enum
 * Defines the category/type of health record
 */
export type HealthRecordType =
  | 'CHECKUP'
  | 'VACCINATION'
  | 'ILLNESS'
  | 'INJURY'
  | 'SCREENING'
  | 'PHYSICAL_EXAM'
  | 'MENTAL_HEALTH'
  | 'DENTAL'
  | 'VISION'
  | 'HEARING'
  | 'EXAMINATION'
  | 'ALLERGY_DOCUMENTATION'
  | 'CHRONIC_CONDITION_REVIEW'
  | 'GROWTH_ASSESSMENT'
  | 'VITAL_SIGNS_CHECK'
  | 'EMERGENCY_VISIT'
  | 'FOLLOW_UP'
  | 'CONSULTATION'
  | 'DIAGNOSTIC_TEST'
  | 'PROCEDURE'
  | 'HOSPITALIZATION'
  | 'SURGERY'
  | 'COUNSELING'
  | 'THERAPY'
  | 'NUTRITION'
  | 'MEDICATION_REVIEW'
  | 'IMMUNIZATION'
  | 'LAB_RESULT'
  | 'RADIOLOGY'
  | 'OTHER'

// ==========================================
// ALLERGY ENUMS
// ==========================================

/**
 * Allergy Severity Levels
 * @aligned_with backend AllergySeverity enum
 * Re-exported from canonical type location
 */
export type { AllergySeverity }

/**
 * Allergy Type Enum
 * @aligned_with backend AllergyType enum
 * Categorizes allergens by type
 */
export type AllergyType =
  | 'FOOD'
  | 'MEDICATION'
  | 'ENVIRONMENTAL'
  | 'INSECT'
  | 'LATEX'
  | 'ANIMAL'
  | 'CHEMICAL'
  | 'SEASONAL'
  | 'OTHER'

// ==========================================
// CHRONIC CONDITION ENUMS
// ==========================================

/**
 * Chronic Condition Status
 * @aligned_with backend ConditionStatus enum
 * Tracks the current state of a chronic condition
 */
export type ConditionStatus = 'ACTIVE' | 'MANAGED' | 'RESOLVED' | 'MONITORING' | 'INACTIVE'

/**
 * Chronic Condition Severity
 * @aligned_with backend ConditionSeverity enum
 * Indicates the severity level of a condition
 */
export type ConditionSeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL'

// ==========================================
// VACCINATION ENUMS
// ==========================================

/**
 * Vaccination Compliance Status
 * @aligned_with backend VaccineComplianceStatus enum
 * Tracks compliance with vaccination requirements
 */
export type VaccinationComplianceStatus = 'COMPLIANT' | 'OVERDUE' | 'PARTIALLY_COMPLIANT' | 'EXEMPT' | 'NON_COMPLIANT'

// ==========================================
// SCREENING ENUMS
// ==========================================

/**
 * Screening Type
 * @aligned_with backend ScreeningType enum
 * Defines the type of health screening performed
 */
export type ScreeningType =
  | 'VISION'
  | 'HEARING'
  | 'SCOLIOSIS'
  | 'DENTAL'
  | 'BMI'
  | 'BLOOD_PRESSURE'
  | 'DEVELOPMENTAL'
  | 'SPEECH'
  | 'MENTAL_HEALTH'
  | 'TUBERCULOSIS'
  | 'LEAD'
  | 'ANEMIA'
  | 'OTHER'

/**
 * Screening Outcome
 * @aligned_with backend ScreeningOutcome enum
 * Result/outcome of a screening test
 */
export type ScreeningOutcome = 'PASS' | 'REFER' | 'FAIL' | 'INCONCLUSIVE' | 'INCOMPLETE'

// ==========================================
// ALERT & NOTIFICATION ENUMS
// ==========================================

/**
 * Alert Severity Level
 * Used for health alerts and notifications
 */
export type AlertSeverity = 'low' | 'medium' | 'high'

/**
 * Reminder Method
 * Communication method for reminders
 */
export type ReminderMethod = 'Email' | 'SMS' | 'Both'

// ==========================================
// REPORT & EXPORT ENUMS
// ==========================================

/**
 * Report Type
 * Defines the type of health report to generate
 */
export type ReportType = 'Summary' | 'Comprehensive' | 'Compliance'

/**
 * Export Format
 * Supported formats for data export
 */
export type ExportFormat = 'CSV' | 'PDF' | 'Excel'
