/**
 * WF-COMP-324 | healthRecords.models.ts - Health Records Model Interfaces
 * Purpose: Core model interfaces for health records domain
 * Upstream: Backend models | Dependencies: healthRecords.types.ts
 * Downstream: Components, services | Called by: Health records components
 * Related: healthRecords.types.ts, healthRecords.api.ts
 * Exports: Model interfaces | Key Features: Type-safe domain models
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Model definitions → API integration → Component rendering
 * LLM Context: Domain model interfaces aligned with backend database models
 */

import type {
  HealthRecordType,
  AllergySeverity,
  AllergyType,
  ConditionStatus,
  ConditionSeverity,
  VaccinationComplianceStatus,
  ScreeningType,
  ScreeningOutcome,
} from './healthRecords.types'

// ==========================================
// SHARED STUDENT INFO
// ==========================================

/**
 * Student information subset for associations
 * Used in populated model responses
 */
export interface StudentInfo {
  id: string
  firstName: string
  lastName: string
  studentNumber: string
}

/**
 * Extended student information with demographic data
 * Used in growth measurements and analytics
 */
export interface ExtendedStudentInfo extends StudentInfo {
  dateOfBirth: string
  gender: string
}

// ==========================================
// MAIN HEALTH RECORD INTERFACE
// ==========================================

/**
 * Health Record interface
 * @aligned_with backend/src/database/models/healthcare/HealthRecord.ts
 *
 * PHI: All fields contain Protected Health Information
 * Represents a comprehensive health event or medical encounter
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
  metadata?: Record<string, unknown> // Additional structured data (JSONB) - replaced any
  isConfidential: boolean // Whether record contains sensitive information
  notes?: string // Additional notes or comments
  createdBy?: string // User ID who created the record
  updatedBy?: string // User ID who last updated the record
  createdAt: string
  updatedAt: string
  // Populated associations
  student?: StudentInfo
}

// ==========================================
// ALLERGY INTERFACE
// ==========================================

/**
 * Allergy interface
 * @aligned_with backend/src/database/models/healthcare/Allergy.ts
 *
 * PHI: All fields - critical for emergency response
 * Represents a documented allergy with emergency protocols
 */
export interface Allergy {
  id: string
  studentId: string
  allergen: string // Name of allergen (e.g., "Peanuts", "Penicillin")
  allergyType: AllergyType // Category of allergy (food, medication, environmental, etc.)
  severity: AllergySeverity // Severity level (mild, moderate, severe, life-threatening)
  symptoms?: string // Known symptoms and reactions
  reactions?: Record<string, unknown> // Structured reaction data (JSONB from backend) - replaced any
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
  student?: StudentInfo
}

// ==========================================
// CHRONIC CONDITION INTERFACE
// ==========================================

/**
 * Chronic Condition interface
 * @aligned_with backend/src/database/models/healthcare/ChronicCondition.ts
 *
 * PHI: All fields - critical for ongoing care and emergency response
 * Represents an ongoing medical condition requiring management
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
  medications?: Record<string, unknown> // Associated medications (JSONB from backend) - replaced any
  treatments?: string // Treatment protocols and therapies
  accommodationsRequired: boolean // Whether educational accommodations needed
  accommodationDetails?: string // Specific accommodation requirements (504/IEP details)
  emergencyProtocol?: string // Emergency response procedures
  actionPlan?: string // Student-specific action plan
  nextReviewDate?: string // Scheduled date for next medical review (Date from backend)
  reviewFrequency?: string // How often condition should be reviewed (e.g., "Annually")
  restrictions?: Record<string, unknown> // Activity or dietary restrictions (JSONB from backend) - replaced any
  precautions?: Record<string, unknown> // Safety precautions staff should take (JSONB from backend) - replaced any
  triggers: string[] // Known triggers that worsen condition
  notes?: string // Additional notes or observations
  carePlan?: string // Comprehensive care plan documentation
  lastReviewDate?: string // Date of most recent medical review (Date from backend)
  createdBy?: string // User ID who created the record
  updatedBy?: string // User ID who last updated the record
  createdAt: string
  updatedAt: string
  // Populated associations
  student?: StudentInfo
}

// ==========================================
// VACCINATION INTERFACE
// ==========================================

/**
 * Vaccination interface
 * @aligned_with backend/src/database/models/healthcare/Vaccination.ts
 *
 * PHI: All fields - critical for school enrollment and outbreak prevention
 * Represents a vaccination record with full tracking details
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
  adverseEvents?: Record<string, unknown> // Structured adverse event data (JSONB from backend) - replaced any
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
  student?: StudentInfo
}

// ==========================================
// GROWTH MEASUREMENT INTERFACE
// ==========================================

/**
 * Growth Measurement interface
 * @aligned_with backend/src/database/models/healthcare/GrowthMeasurement.ts
 *
 * PHI: All fields contain sensitive health measurements
 * Tracks physical growth and development metrics
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
  growthPercentiles?: Record<string, unknown> // Additional percentile data (JSONB from backend) - replaced any
  nutritionalStatus?: string // Assessment (underweight, healthy, overweight, obese)
  concerns?: string // Growth concerns or flags
  notes?: string // Additional notes or observations
  createdBy?: string // User ID who created the record
  updatedBy?: string // User ID who last updated the record
  createdAt: string
  updatedAt: string
  // Populated associations
  student?: ExtendedStudentInfo
}

// ==========================================
// SCREENING INTERFACE
// ==========================================

/**
 * Screening interface
 * @aligned_with backend/src/database/models/healthcare/Screening.ts
 *
 * PHI: All fields contain sensitive health screening results
 * Represents a health screening test and its results
 */
export interface Screening {
  id: string
  studentId: string
  healthRecordId?: string // Optional link to related health record
  screeningType: ScreeningType // Type of screening (vision, hearing, dental, scoliosis, etc.)
  screeningDate: string // Date screening was performed (Date from backend)
  screenedBy: string // Person who performed screening
  screenedByRole?: string // Role of screener (e.g., "School Nurse", "Dental Hygienist")
  results?: Record<string, unknown> // Structured screening results (JSONB from backend) - replaced any
  outcome: ScreeningOutcome // Outcome (pass, fail, refer)
  referralRequired: boolean // Whether referral needed
  referralTo?: string // Specialist or provider for referral
  referralDate?: string // Date referral was made (Date from backend)
  referralReason?: string // Reason for referral
  followUpRequired: boolean // Whether follow-up needed
  followUpDate?: string // Scheduled follow-up date (Date from backend)
  followUpStatus?: string // Status of follow-up (FollowUpStatus enum from backend)
  equipmentUsed?: string // Equipment used for screening
  testDetails?: Record<string, unknown> // Additional test details (JSONB from backend) - replaced any
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
  student?: StudentInfo
}

// ==========================================
// VITAL SIGNS INTERFACE
// ==========================================

/**
 * Vital Signs interface
 * @aligned_with backend/src/database/models/healthcare/VitalSigns.ts
 *
 * PHI: All fields contain sensitive health measurements
 * Note: Weight, height, BMI are tracked separately in GrowthMeasurement model
 * Represents vital sign measurements taken during health encounters
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
  student?: StudentInfo
}
