/**
 * WF-COMP-324 | healthRecords.api.ts - Health Records API Interfaces
 * Purpose: API request/response and mutation interfaces
 * Upstream: Backend API endpoints | Dependencies: healthRecords.types.ts, healthRecords.models.ts
 * Downstream: API services, hooks | Called by: Service layer
 * Related: healthRecords.types.ts, healthRecords.models.ts
 * Exports: API interfaces, mutation DTOs | Key Features: Type-safe API contracts
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: API request → Backend → Response validation → State update
 * LLM Context: API contracts and data transfer objects for health records
 */

import type {
  HealthRecordType,
  AllergyType,
  AllergySeverity,
  ConditionStatus,
  ConditionSeverity,
  VaccinationComplianceStatus,
  ScreeningType,
  ScreeningOutcome,
} from './healthRecords.types'
import type {
  HealthRecord,
  Allergy,
  VitalSigns,
  StudentInfo,
} from './healthRecords.models'
import type { RecentVitals } from './healthRecords.forms'

// ==========================================
// API FILTER & QUERY INTERFACES
// ==========================================

/**
 * Health Record Filters interface
 * Query parameters for filtering health records
 */
export interface HealthRecordFilters {
  type?: HealthRecordType
  dateFrom?: string
  dateTo?: string
  provider?: string
  page?: number
  limit?: number
}

// ==========================================
// API RESPONSE INTERFACES
// ==========================================

/**
 * Paginated Health Records Response
 * Standard pagination wrapper for health records
 */
export interface PaginatedHealthRecords {
  records: HealthRecord[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

/**
 * Health Summary Response
 * Comprehensive health overview for a student
 */
export interface HealthSummary {
  student: StudentInfo & {
    dateOfBirth: string
    gender: string
  }
  allergies: Allergy[]
  recentVitals: RecentVitals[]
  recentVaccinations: HealthRecord[]
  recordCounts: Record<string, number>
}

// ==========================================
// CREATE/UPDATE DATA INTERFACES
// ==========================================

/**
 * Create Health Record Data
 * Data required to create a new health record
 */
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

/**
 * Update Health Record Data
 * Data for updating an existing health record
 */
export interface UpdateHealthRecordData {
  type?: HealthRecordType
  date?: string
  description?: string
  vital?: VitalSigns
  provider?: string
  notes?: string
  attachments?: string[]
}

/**
 * Create Allergy Data
 * Data required to create a new allergy record
 */
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

/**
 * Update Allergy Data
 * Data for updating an existing allergy record
 */
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

/**
 * Create Chronic Condition Data
 * Data required to create a new chronic condition record
 */
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

/**
 * Update Chronic Condition Data
 * Data for updating an existing chronic condition record
 */
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

/**
 * Create Vaccination Data
 * Data required to create a new vaccination record
 */
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

/**
 * Update Vaccination Data
 * Data for updating an existing vaccination record
 */
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

/**
 * Create Screening Data
 * Data required to create a new screening record
 */
export interface CreateScreeningData {
  studentId: string
  screeningType: ScreeningType
  screeningDate: string
  performedBy: string
  outcome: ScreeningOutcome
  results?: string
  measurements?: Record<string, unknown> // Replaced any with unknown
  referralRequired?: boolean
  referralTo?: string
  followUpRequired?: boolean
  followUpDate?: string
  notes?: string
}

/**
 * Update Screening Data
 * Data for updating an existing screening record
 */
export interface UpdateScreeningData {
  screeningType?: ScreeningType
  screeningDate?: string
  performedBy?: string
  outcome?: ScreeningOutcome
  results?: string
  measurements?: Record<string, unknown> // Replaced any with unknown
  referralRequired?: boolean
  referralTo?: string
  followUpRequired?: boolean
  followUpDate?: string
  notes?: string
}

/**
 * Create Growth Measurement Data
 * Data required to create a new growth measurement record
 */
export interface CreateGrowthMeasurementData {
  studentId: string
  measurementDate: string
  height?: number
  weight?: number
  headCircumference?: number
  measuredBy: string
  notes?: string
}

/**
 * Update Growth Measurement Data
 * Data for updating an existing growth measurement record
 */
export interface UpdateGrowthMeasurementData {
  measurementDate?: string
  height?: number
  weight?: number
  headCircumference?: number
  measuredBy?: string
  notes?: string
}

/**
 * Create Vital Signs Data
 * Data required to create a new vital signs record
 */
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

/**
 * Update Vital Signs Data
 * Data for updating an existing vital signs record
 */
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
