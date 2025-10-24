/**
 * WF-COMP-324 | healthRecords.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces, types | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Health Records Type Definitions
 * Aligned with backend enums and service interfaces
 */

import type { AllergySeverity as ServiceAllergySeverity } from '../services/modules/healthRecordsApi'

// Tab Navigation Types
export type TabType = 'overview' | 'records' | 'allergies' | 'chronic' | 'vaccinations' | 'growth' | 'screenings' | 'vitals' | 'analytics'

// Health Record Type Enum - matches backend HealthRecordType
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

// Allergy Severity Levels - use service API enum to ensure compatibility
export type AllergySeverity = ServiceAllergySeverity

// Allergy Type Enum - matches backend AllergyType
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

// Chronic Condition Status - matches backend ConditionStatus
export type ConditionStatus = 'ACTIVE' | 'MANAGED' | 'RESOLVED' | 'MONITORING' | 'INACTIVE'

// Chronic Condition Severity - matches backend ConditionSeverity
export type ConditionSeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL'

// Vaccination Compliance Status - matches backend VaccineComplianceStatus
export type VaccinationComplianceStatus = 'COMPLIANT' | 'OVERDUE' | 'PARTIALLY_COMPLIANT' | 'EXEMPT' | 'NON_COMPLIANT'

// Screening Type - matches backend ScreeningType
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

// Screening Outcome - matches backend ScreeningOutcome
export type ScreeningOutcome = 'PASS' | 'REFER' | 'FAIL' | 'INCONCLUSIVE' | 'INCOMPLETE'

// Alert Severity
export type AlertSeverity = 'low' | 'medium' | 'high'

// Reminder Method
export type ReminderMethod = 'Email' | 'SMS' | 'Both'

// Report Type
export type ReportType = 'Summary' | 'Comprehensive' | 'Compliance'

// Export Format
export type ExportFormat = 'CSV' | 'PDF' | 'Excel'

// ==========================================
// MAIN HEALTH RECORD INTERFACES
// ==========================================

/**
 * Health Record interface
 * @aligned_with backend/src/database/models/healthcare/HealthRecord.ts
 *
 * PHI: All fields contain Protected Health Information
 */
export interface HealthRecord {
  id: string
  studentId: string
  recordType: HealthRecordType // Type of health record (medical, dental, vision, etc.)
  title: string // Brief title/summary of the health record
  description: string // Detailed description of the health event
  recordDate: string // Date when the health event occurred (Date from backend)
  provider?: string // Healthcare provider name
  providerNpi?: string // National Provider Identifier (10-digit)
  facility?: string // Healthcare facility name
  facilityNpi?: string // Facility National Provider Identifier
  diagnosis?: string // Medical diagnosis description
  diagnosisCode?: string // ICD-10 diagnosis code
  treatment?: string // Treatment provided or recommended
  followUpRequired: boolean // Whether follow-up care is needed
  followUpDate?: string // Scheduled date for follow-up (Date from backend)
  followUpCompleted: boolean // Whether follow-up has been completed
  attachments: string[] // Array of file paths/URLs for supporting documents
  metadata?: any // Additional structured data (JSONB)
  isConfidential: boolean // Whether record contains sensitive information
  notes?: string // Additional notes or comments
  createdBy?: string // User ID who created the record
  updatedBy?: string // User ID who last updated the record
  createdAt: string
  updatedAt: string
  // Populated associations
  student?: {
    id: string
    firstName: string
    lastName: string
    studentNumber: string
  }
}

// ==========================================
// ALLERGY INTERFACES
// ==========================================

/**
 * Allergy interface
 * @aligned_with backend/src/database/models/healthcare/Allergy.ts
 *
 * PHI: All fields - critical for emergency response
 */
export interface Allergy {
  id: string
  studentId: string
  allergen: string // Name of allergen (e.g., "Peanuts", "Penicillin")
  allergyType: AllergyType // Category of allergy (food, medication, environmental, etc.)
  severity: AllergySeverity // Severity level (mild, moderate, severe, life-threatening)
  symptoms?: string // Known symptoms and reactions
  reactions?: any // Structured reaction data (JSONB from backend)
  treatment?: string // Standard treatment protocol
  emergencyProtocol?: string // Emergency response procedures
  onsetDate?: string // Date when allergy first appeared (Date from backend)
  diagnosedDate?: string // Date of medical diagnosis (Date from backend)
  diagnosedBy?: string // Healthcare provider who diagnosed
  verified: boolean // Whether allergy has been medically verified
  verifiedBy?: string // User ID who verified the allergy
  verificationDate?: string // Date of verification (Date from backend)
  active: boolean // Whether allergy is currently active
  notes?: string // Additional notes or comments
  epiPenRequired: boolean // Whether student needs EpiPen access
  epiPenLocation?: string // Where EpiPen is stored (e.g., "Nurse's office")
  epiPenExpiration?: string // EpiPen expiration date (Date from backend)
  healthRecordId?: string // Optional link to related health record
  createdBy?: string // User ID who created the record
  updatedBy?: string // User ID who last updated the record
  createdAt: string
  updatedAt: string
  // Populated associations
  student?: {
    id: string
    firstName: string
    lastName: string
    studentNumber: string
  }
}

// ==========================================
// CHRONIC CONDITION INTERFACES
// ==========================================

/**
 * Chronic Condition interface
 * @aligned_with backend/src/database/models/healthcare/ChronicCondition.ts
 *
 * PHI: All fields - critical for ongoing care and emergency response
 */
export interface ChronicCondition {
  id: string
  studentId: string
  healthRecordId?: string // Optional link to related health record
  condition: string // Name of chronic condition (e.g., "Type 1 Diabetes", "Asthma")
  icdCode?: string // ICD-10 diagnosis code
  diagnosisDate: string // Date of initial diagnosis (Date from backend)
  diagnosedBy?: string // Healthcare provider who made diagnosis
  severity: ConditionSeverity // Severity level (mild, moderate, severe)
  status: ConditionStatus // Current status (active, controlled, in_remission, resolved)
  medications?: any // Associated medications (JSONB from backend)
  treatments?: string // Treatment protocols and therapies
  accommodationsRequired: boolean // Whether educational accommodations needed
  accommodationDetails?: string // Specific accommodation requirements (504/IEP details)
  emergencyProtocol?: string // Emergency response procedures
  actionPlan?: string // Student-specific action plan
  nextReviewDate?: string // Scheduled date for next medical review (Date from backend)
  reviewFrequency?: string // How often condition should be reviewed (e.g., "Annually")
  restrictions?: any // Activity or dietary restrictions (JSONB from backend)
  precautions?: any // Safety precautions staff should take (JSONB from backend)
  triggers: string[] // Known triggers that worsen condition
  notes?: string // Additional notes or observations
  carePlan?: string // Comprehensive care plan documentation
  lastReviewDate?: string // Date of most recent medical review (Date from backend)
  createdBy?: string // User ID who created the record
  updatedBy?: string // User ID who last updated the record
  createdAt: string
  updatedAt: string
  // Populated associations
  student?: {
    id: string
    firstName: string
    lastName: string
    studentNumber: string
  }
}

// ==========================================
// VACCINATION INTERFACES
// ==========================================

/**
 * Vaccination interface
 * @aligned_with backend/src/database/models/healthcare/Vaccination.ts
 *
 * PHI: All fields - critical for school enrollment and outbreak prevention
 */
export interface Vaccination {
  id: string
  studentId: string
  healthRecordId?: string // Optional link to related health record
  vaccineName: string // Vaccine name (e.g., "MMR", "DTaP")
  vaccineType?: string // Category of vaccine (VaccineType enum from backend)
  manufacturer?: string // Vaccine manufacturer (e.g., "Pfizer", "Moderna")
  lotNumber?: string // Vaccine lot number for tracking and recalls
  cvxCode?: string // CVX code (CDC vaccine identifier)
  ndcCode?: string // NDC code (National Drug Code)
  doseNumber?: number // Dose number in series (e.g., 1 of 3)
  totalDoses?: number // Total doses in series
  seriesComplete: boolean // Whether vaccination series is complete
  administrationDate: string // Date vaccine was administered (Date from backend)
  administeredBy: string // Person who administered vaccine
  administeredByRole?: string // Role of administrator (e.g., "RN", "MD")
  facility?: string // Facility where vaccine was given
  siteOfAdministration?: string // Body site (e.g., left arm) - AdministrationSite enum
  routeOfAdministration?: string // Route (e.g., intramuscular) - AdministrationRoute enum
  dosageAmount?: string // Dosage given (e.g., "0.5mL")
  expirationDate?: string // Vaccine expiration date (Date from backend)
  nextDueDate?: string // Next dose due date (Date from backend)
  reactions?: string // Immediate reactions observed (text field)
  adverseEvents?: any // Structured adverse event data (JSONB from backend)
  exemptionStatus: boolean // Whether student has exemption
  exemptionReason?: string // Reason for exemption (medical/religious)
  exemptionDocument?: string // Path to exemption documentation
  complianceStatus: VaccinationComplianceStatus // Compliance status (compliant, overdue, exempt, non-compliant)
  vfcEligibility: boolean // VFC program eligibility
  visProvided: boolean // Whether VIS was provided
  visDate?: string // Date VIS was provided to parent/guardian (Date from backend)
  consentObtained: boolean // Whether consent was obtained
  consentBy?: string // Who provided consent (parent/guardian name)
  notes?: string // Additional notes or comments
  createdBy?: string // User ID who created the record
  updatedBy?: string // User ID who last updated the record
  createdAt: string
  updatedAt: string
  // Populated associations
  student?: {
    id: string
    firstName: string
    lastName: string
    studentNumber: string
  }
}

// ==========================================
// GROWTH MEASUREMENT INTERFACES
// ==========================================

/**
 * Growth Measurement interface
 * @aligned_with backend/src/database/models/healthcare/GrowthMeasurement.ts
 *
 * PHI: All fields contain sensitive health measurements
 */
export interface GrowthMeasurement {
  id: string
  studentId: string
  healthRecordId?: string // Optional link to related health record
  measurementDate: string // Date of measurement (Date from backend)
  measuredBy: string // Person who took measurements
  measuredByRole?: string // Role (e.g., "School Nurse", "MA")
  height?: number // Height measurement
  heightUnit: string // Unit for height (cm, in) - defaults to "cm"
  weight?: number // Weight measurement
  weightUnit: string // Unit for weight (kg, lb) - defaults to "kg"
  bmi?: number // Body Mass Index (calculated)
  bmiPercentile?: number // BMI percentile per CDC growth charts (0-100)
  headCircumference?: number // Head circumference for infants/toddlers (cm)
  heightPercentile?: number // Height percentile per CDC charts (0-100)
  weightPercentile?: number // Weight percentile per CDC charts (0-100)
  growthPercentiles?: any // Additional percentile data (JSONB from backend)
  nutritionalStatus?: string // Assessment (underweight, healthy, overweight, obese)
  concerns?: string // Growth concerns or flags
  notes?: string // Additional notes or observations
  createdBy?: string // User ID who created the record
  updatedBy?: string // User ID who last updated the record
  createdAt: string
  updatedAt: string
  // Populated associations
  student?: {
    id: string
    firstName: string
    lastName: string
    studentNumber: string
    dateOfBirth: string
    gender: string
  }
}

// ==========================================
// SCREENING INTERFACES
// ==========================================

/**
 * Screening interface
 * @aligned_with backend/src/database/models/healthcare/Screening.ts
 *
 * PHI: All fields contain sensitive health screening results
 */
export interface Screening {
  id: string
  studentId: string
  healthRecordId?: string // Optional link to related health record
  screeningType: ScreeningType // Type of screening (vision, hearing, dental, scoliosis, etc.)
  screeningDate: string // Date screening was performed (Date from backend)
  screenedBy: string // Person who performed screening
  screenedByRole?: string // Role of screener (e.g., "School Nurse", "Dental Hygienist")
  results?: any // Structured screening results (JSONB from backend)
  outcome: ScreeningOutcome // Outcome (pass, fail, refer)
  referralRequired: boolean // Whether referral needed
  referralTo?: string // Specialist or provider for referral
  referralDate?: string // Date referral was made (Date from backend)
  referralReason?: string // Reason for referral
  followUpRequired: boolean // Whether follow-up needed
  followUpDate?: string // Scheduled follow-up date (Date from backend)
  followUpStatus?: string // Status of follow-up (FollowUpStatus enum from backend)
  equipmentUsed?: string // Equipment used for screening
  testDetails?: any // Additional test details (JSONB from backend)
  rightEye?: string // Right eye test result (for vision screening)
  leftEye?: string // Left eye test result (for vision screening)
  rightEar?: string // Right ear test result (for hearing screening)
  leftEar?: string // Left ear test result (for hearing screening)
  passedCriteria?: boolean // Whether passed screening criteria
  notes?: string // Additional notes or observations
  createdBy?: string // User ID who created the record
  updatedBy?: string // User ID who last updated the record
  createdAt: string
  updatedAt: string
  // Populated associations
  student?: {
    id: string
    firstName: string
    lastName: string
    studentNumber: string
  }
}

// ==========================================
// VITAL SIGNS INTERFACES
// ==========================================

/**
 * Vital Signs interface
 * @aligned_with backend/src/database/models/healthcare/VitalSigns.ts
 *
 * PHI: All fields contain sensitive health measurements
 * Note: Weight, height, BMI are tracked separately in GrowthMeasurement model
 */
export interface VitalSigns {
  id?: string
  studentId?: string
  healthRecordId?: string // Optional link to related health record
  appointmentId?: string // Optional link to related appointment
  measurementDate?: string // Date of vital signs measurement (Date from backend)
  measuredBy?: string // Person who measured vital signs
  measuredByRole?: string // Role of measurer (e.g., "School Nurse", "MA")
  temperature?: number // Temperature measurement
  temperatureUnit?: string // Unit for temperature (F, C) - defaults to 'F'
  temperatureSite?: string // Site where temperature was taken (oral, axillary, tympanic, temporal)
  bloodPressureSystolic?: number // Systolic blood pressure (mmHg)
  bloodPressureDiastolic?: number // Diastolic blood pressure (mmHg)
  bloodPressurePosition?: string // Position during measurement (sitting, standing, lying)
  heartRate?: number // Heart rate in beats per minute
  heartRhythm?: string // Heart rhythm description (regular, irregular)
  respiratoryRate?: number // Respiratory rate in breaths per minute
  oxygenSaturation?: number // Oxygen saturation percentage (SpO2)
  oxygenSupplemental?: boolean // Whether on supplemental oxygen
  painLevel?: number // Pain level (0-10 scale)
  painLocation?: string // Location of pain
  consciousness?: string // Consciousness level (ConsciousnessLevel enum from backend)
  glucoseLevel?: number // Blood glucose level (mg/dL)
  peakFlow?: number // Peak expiratory flow (L/min) for asthma patients
  notes?: string // Additional notes or observations
  createdBy?: string // User ID who created the record
  updatedBy?: string // User ID who last updated the record
  createdAt?: string
  updatedAt?: string
  // Populated associations
  student?: {
    id: string
    firstName: string
    lastName: string
    studentNumber: string
  }
}

// ==========================================
// FORM VALIDATION INTERFACES
// ==========================================

export interface FormErrors {
  [key: string]: string
}

export interface AllergyFormErrors {
  allergen?: string
  severity?: string
  reaction?: string
  treatment?: string
}

export interface ConditionFormErrors {
  condition?: string
  diagnosedDate?: string
  status?: string
  severity?: string
  carePlan?: string
}

export interface VaccinationFormErrors {
  vaccineName?: string
  dateAdministered?: string
  administeredBy?: string
  dose?: string
}

export interface GrowthMeasurementFormErrors {
  date?: string
  height?: string
  weight?: string
  headCircumference?: string
}

export interface HealthAlert {
  id: string
  type: string
  message: string
  severity: AlertSeverity
  date?: string
}

export interface VaccinationReminder {
  id: string
  message: string
  date: string
  priority: 'High' | 'Medium' | 'Low'
  vaccinationId?: string
}

export interface TimelineEvent {
  id: string
  date: string
  type: string
  description: string
  provider: string
}

export interface HealthSummaryCard {
  label: string
  value: string | number
  icon: React.ComponentType
  color: string
}

export interface GrowthPercentile {
  height: number
  weight: number
  bmi: number
}

export interface GrowthVelocity {
  height: string
  weight: string
}

export interface ComplianceStats {
  overallCompliance: number
  missingVaccinations: number
  overdueVaccinations: number
}

export interface MedicationAdherence {
  percentage: number
  missedDoses: number
  onTimeDoses: number
}

export interface RiskAssessment {
  score: number
  level: string
  factors: string[]
  recommendations: string[]
}

export interface RecordCompleteness {
  percentage: number
  missingItems: Array<{
    name: string
    priority: 'High' | 'Medium' | 'Low'
  }>
}

// ==========================================
// API RESPONSE INTERFACES
// ==========================================

export interface HealthRecordFilters {
  type?: HealthRecordType
  dateFrom?: string
  dateTo?: string
  provider?: string
  page?: number
  limit?: number
}

export interface PaginatedHealthRecords {
  records: HealthRecord[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface HealthSummary {
  student: {
    id: string
    firstName: string
    lastName: string
    studentNumber: string
    dateOfBirth: string
    gender: string
  }
  allergies: Allergy[]
  recentVitals: Array<{
    id: string
    date: string
    vital: VitalSigns
    type: HealthRecordType
    provider?: string
  }>
  recentVaccinations: HealthRecord[]
  recordCounts: Record<string, number>
}

export interface GrowthChartData {
  date: string
  height?: number
  weight?: number
  bmi?: number
  recordType: HealthRecordType
}

// ==========================================
// CREATE/UPDATE INTERFACES
// ==========================================

export interface CreateHealthRecordData {
  studentId: string
  type: HealthRecordType
  date: string
  description: string
  vital?: VitalSigns
  provider?: string
  notes?: string
  attachments?: string[]
}

export interface UpdateHealthRecordData {
  type?: HealthRecordType
  date?: string
  description?: string
  vital?: VitalSigns
  provider?: string
  notes?: string
  attachments?: string[]
}

export interface CreateAllergyData {
  studentId: string
  allergen: string
  allergyType: AllergyType
  severity: AllergySeverity
  reaction?: string
  symptoms?: string[]
  treatment?: string
  onsetDate?: string
  diagnosedBy?: string
  verified?: boolean
  isCritical?: boolean
  notes?: string
}

export interface UpdateAllergyData {
  allergen?: string
  allergyType?: AllergyType
  severity?: AllergySeverity
  reaction?: string
  symptoms?: string[]
  treatment?: string
  onsetDate?: string
  diagnosedBy?: string
  verified?: boolean
  isCritical?: boolean
  notes?: string
}

export interface CreateChronicConditionData {
  studentId: string
  condition: string
  icdCode?: string
  diagnosisDate: string
  status: ConditionStatus
  severity: ConditionSeverity
  notes?: string
  carePlan?: string
  medications?: string[]
  restrictions?: string[]
  triggers?: string[]
  diagnosedBy?: string
  nextReviewDate?: string
}

export interface UpdateChronicConditionData {
  condition?: string
  icdCode?: string
  diagnosisDate?: string
  status?: ConditionStatus
  severity?: ConditionSeverity
  notes?: string
  carePlan?: string
  medications?: string[]
  restrictions?: string[]
  triggers?: string[]
  diagnosedBy?: string
  lastReviewDate?: string
  nextReviewDate?: string
  isActive?: boolean
}

export interface CreateVaccinationData {
  studentId: string
  vaccineName: string
  vaccineType: string
  cvxCode?: string
  doseNumber?: number
  totalDoses?: number
  administeredDate: string
  expirationDate?: string
  lotNumber?: string
  manufacturer?: string
  administeredBy?: string
  administeredByNPI?: string
  site?: string
  route?: string
  dosage?: string
  status?: VaccinationComplianceStatus
  reactions?: string[]
  notes?: string
  nextDueDate?: string
}

export interface UpdateVaccinationData {
  vaccineName?: string
  vaccineType?: string
  cvxCode?: string
  doseNumber?: number
  totalDoses?: number
  administeredDate?: string
  expirationDate?: string
  lotNumber?: string
  manufacturer?: string
  administeredBy?: string
  administeredByNPI?: string
  site?: string
  route?: string
  dosage?: string
  status?: VaccinationComplianceStatus
  reactions?: string[]
  notes?: string
  nextDueDate?: string
}

export interface CreateScreeningData {
  studentId: string
  screeningType: ScreeningType
  screeningDate: string
  performedBy: string
  outcome: ScreeningOutcome
  results?: string
  measurements?: Record<string, any>
  referralRequired?: boolean
  referralTo?: string
  followUpRequired?: boolean
  followUpDate?: string
  notes?: string
}

export interface UpdateScreeningData {
  screeningType?: ScreeningType
  screeningDate?: string
  performedBy?: string
  outcome?: ScreeningOutcome
  results?: string
  measurements?: Record<string, any>
  referralRequired?: boolean
  referralTo?: string
  followUpRequired?: boolean
  followUpDate?: string
  notes?: string
}

export interface CreateGrowthMeasurementData {
  studentId: string
  measurementDate: string
  height?: number
  weight?: number
  headCircumference?: number
  measuredBy: string
  notes?: string
}

export interface UpdateGrowthMeasurementData {
  measurementDate?: string
  height?: number
  weight?: number
  headCircumference?: number
  measuredBy?: string
  notes?: string
}

export interface CreateVitalSignsData {
  studentId: string
  recordDate: string
  temperature?: number
  temperatureMethod?: 'oral' | 'axillary' | 'tympanic' | 'temporal'
  bloodPressureSystolic?: number
  bloodPressureDiastolic?: number
  heartRate?: number
  respiratoryRate?: number
  oxygenSaturation?: number
  pain?: number
  glucose?: number
  weight?: number
  height?: number
  notes?: string
  recordedBy: string
}

export interface UpdateVitalSignsData {
  recordDate?: string
  temperature?: number
  temperatureMethod?: 'oral' | 'axillary' | 'tympanic' | 'temporal'
  bloodPressureSystolic?: number
  bloodPressureDiastolic?: number
  heartRate?: number
  respiratoryRate?: number
  oxygenSaturation?: number
  pain?: number
  glucose?: number
  weight?: number
  height?: number
  notes?: string
}