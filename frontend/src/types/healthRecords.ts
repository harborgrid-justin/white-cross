/**
 * @fileoverview Health Records Type Definitions
 * @module types/healthRecords
 *
 * @description
 * TypeScript type definitions for health records management.
 * Provides type safety for health record data structures.
 *
 * @since 1.0.0
 */

export interface Allergy {
  id: string | number
  studentId: string | number
  allergen: string
  allergyType: 'food' | 'medication' | 'environmental' | 'other'
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening'
  symptoms?: string[]
  treatment?: string
  onsetDate?: string | Date
  notes?: string
  verifiedBy?: string
  verifiedDate?: string | Date
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface AllergyFormErrors {
  allergen?: string
  allergyType?: string
  severity?: string
  symptoms?: string
  treatment?: string
}

export interface Vaccination {
  id: string | number
  studentId: string | number
  vaccineName: string
  vaccineCode?: string
  dateAdministered: string | Date
  dosageNumber?: number
  totalDoses?: number
  administeredBy?: string
  location?: string
  lotNumber?: string
  manufacturer?: string
  expirationDate?: string | Date
  nextDueDate?: string | Date
  reactions?: string
  notes?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface VaccinationFormErrors {
  vaccineName?: string
  dateAdministered?: string
  dosageNumber?: string
  administeredBy?: string
}

export interface ChronicCondition {
  id: string | number
  studentId: string | number
  conditionName: string
  icdCode?: string
  diagnosisDate?: string | Date
  severity: 'mild' | 'moderate' | 'severe'
  status: 'active' | 'inactive' | 'resolved'
  symptoms?: string[]
  treatment?: string
  managementPlan?: string
  diagnosedBy?: string
  notes?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface ConditionFormErrors {
  conditionName?: string
  severity?: string
  status?: string
  diagnosisDate?: string
}

export interface GrowthMeasurement {
  id: string | number
  studentId: string | number
  measurementDate: string | Date
  height?: number
  heightUnit?: 'cm' | 'in'
  weight?: number
  weightUnit?: 'kg' | 'lb'
  bmi?: number
  headCircumference?: number
  percentiles?: {
    height?: number
    weight?: number
    bmi?: number
  }
  measuredBy?: string
  notes?: string
  createdAt?: string | Date
}

export interface MeasurementFormErrors {
  measurementDate?: string
  height?: string
  weight?: string
  measuredBy?: string
}

export interface Screening {
  id: string | number
  studentId: string | number
  screeningType: 'vision' | 'hearing' | 'dental' | 'scoliosis' | 'other'
  screeningDate: string | Date
  result: 'pass' | 'fail' | 'refer' | 'pending'
  details?: string
  performedBy?: string
  followUpRequired?: boolean
  followUpDate?: string | Date
  notes?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface CarePlan {
  id: string | number
  studentId: string | number
  planName: string
  planType: 'medication' | 'allergy' | 'chronic-condition' | 'general' | 'other'
  status: 'active' | 'inactive' | 'completed'
  startDate: string | Date
  endDate?: string | Date
  goals?: string[]
  interventions?: string[]
  medications?: string[]
  emergencyProcedures?: string
  createdBy?: string
  reviewDate?: string | Date
  notes?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface CarePlanFormErrors {
  planName?: string
  planType?: string
  startDate?: string
  goals?: string
}

export interface HealthRecord {
  id: string | number
  studentId: string | number
  allergies?: Allergy[]
  vaccinations?: Vaccination[]
  chronicConditions?: ChronicCondition[]
  growthMeasurements?: GrowthMeasurement[]
  screenings?: Screening[]
  carePlans?: CarePlan[]
  lastUpdated?: string | Date
}

export interface TabNavItem {
  id: string
  label: string
  icon?: React.ComponentType
  count?: number
}

export type TabType = 'overview' | 'allergies' | 'vaccinations' | 'conditions' | 'measurements' | 'screenings' | 'care-plans'
