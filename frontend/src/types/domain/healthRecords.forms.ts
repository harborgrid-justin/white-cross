/**
 * WF-COMP-324 | healthRecords.forms.ts - Health Records Form & UI Interfaces
 * Purpose: Form validation and UI-related type definitions
 * Upstream: React components | Dependencies: healthRecords.types.ts
 * Downstream: Form components, UI components | Called by: Form handlers
 * Related: healthRecords.types.ts, healthRecords.models.ts
 * Exports: Form interfaces, UI types | Key Features: Form validation, UI state
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Form input → Validation → Submission → API call
 * LLM Context: UI and form-specific types for health records components
 */

import type { AlertSeverity, HealthRecordType } from './healthRecords.types'
import type { VitalSigns } from './healthRecords.models'

// ==========================================
// FORM VALIDATION INTERFACES
// ==========================================

/**
 * Generic form errors interface
 * Maps field names to error messages
 */
export interface FormErrors {
  [key: string]: string
}

/**
 * Allergy form validation errors
 */
export interface AllergyFormErrors {
  allergen?: string
  allergyType?: string
  severity?: string
  reaction?: string
  treatment?: string
}

/**
 * Chronic condition form validation errors
 */
export interface ConditionFormErrors {
  condition?: string
  diagnosedDate?: string
  status?: string
  severity?: string
  carePlan?: string
}

/**
 * Vaccination form validation errors
 */
export interface VaccinationFormErrors {
  vaccineName?: string
  dateAdministered?: string
  administeredBy?: string
  dose?: string
}

/**
 * Growth measurement form validation errors
 */
export interface GrowthMeasurementFormErrors {
  date?: string
  height?: string
  weight?: string
  headCircumference?: string
}

// ==========================================
// ALERT & NOTIFICATION INTERFACES
// ==========================================

/**
 * Health Alert interface
 * Represents an alert or warning about a student's health
 */
export interface HealthAlert {
  id: string
  type: string
  message: string
  severity: AlertSeverity
  date?: string
}

/**
 * Vaccination Reminder interface
 * Represents a reminder for upcoming or overdue vaccinations
 */
export interface VaccinationReminder {
  id: string
  message: string
  date: string
  priority: 'High' | 'Medium' | 'Low'
  vaccinationId?: string
}

// ==========================================
// UI COMPONENT INTERFACES
// ==========================================

/**
 * Timeline Event interface
 * Represents a health event in a timeline view
 */
export interface TimelineEvent {
  id: string
  date: string
  type: string
  description: string
  provider: string
}

/**
 * Health Summary Card interface
 * Represents a summary card in the dashboard
 */
export interface HealthSummaryCard {
  label: string
  value: string | number
  icon: React.ComponentType
  color: string
}

// ==========================================
// ANALYTICS & METRICS INTERFACES
// ==========================================

/**
 * Growth Percentile interface
 * Contains percentile data for growth metrics
 */
export interface GrowthPercentile {
  height: number
  weight: number
  bmi: number
}

/**
 * Growth Velocity interface
 * Tracks rate of growth over time
 */
export interface GrowthVelocity {
  height: string
  weight: string
}

/**
 * Compliance Statistics interface
 * Tracks vaccination compliance metrics
 */
export interface ComplianceStats {
  overallCompliance: number
  missingVaccinations: number
  overdueVaccinations: number
}

/**
 * Medication Adherence interface
 * Tracks medication compliance
 */
export interface MedicationAdherence {
  percentage: number
  missedDoses: number
  onTimeDoses: number
}

/**
 * Risk Assessment interface
 * Health risk assessment results
 */
export interface RiskAssessment {
  score: number
  level: string
  factors: string[]
  recommendations: string[]
}

/**
 * Record Completeness interface
 * Tracks completeness of health records
 */
export interface RecordCompleteness {
  percentage: number
  missingItems: Array<{
    name: string
    priority: 'High' | 'Medium' | 'Low'
  }>
}

// ==========================================
// CHART DATA INTERFACES
// ==========================================

/**
 * Growth Chart Data interface
 * Data structure for rendering growth charts
 */
export interface GrowthChartData {
  date: string
  height?: number
  weight?: number
  bmi?: number
  recordType: HealthRecordType
}

/**
 * Recent Vitals interface
 * Structure for displaying recent vital signs
 */
export interface RecentVitals {
  id: string
  date: string
  vital: VitalSigns
  type: HealthRecordType
  provider?: string
}
