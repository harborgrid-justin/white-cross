export type TabType = 'overview' | 'records' | 'allergies' | 'chronic' | 'vaccinations' | 'growth' | 'screenings'

export type RecordType = 'CHECKUP' | 'VACCINATION' | 'ILLNESS' | 'INJURY' | 'SCREENING' | 'VISION' | 'HEARING' | 'PHYSICAL_EXAM'

export type SeverityLevel = 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING'

export type ConditionStatus = 'ACTIVE' | 'MANAGED' | 'RESOLVED'

export type VaccinationStatus = 'Completed' | 'Overdue' | 'Scheduled'

export type AlertSeverity = 'low' | 'medium' | 'high'

export type ReminderMethod = 'Email' | 'SMS' | 'Both'

export type ReportType = 'Summary' | 'Comprehensive' | 'Compliance'

export type ExportFormat = 'CSV' | 'PDF' | 'Excel'

export interface HealthRecord {
  id: string
  type: RecordType
  title: string
  description: string
  provider: string
  date: string
  vitals?: {
    height?: string
    weight?: string
    bloodPressure?: string
    pulse?: string
  }
}

export interface Allergy {
  id: string
  allergen: string
  severity: SeverityLevel
  verified: boolean
  reaction?: string
  treatment?: string
  dateIdentified?: string
  providerName?: string
}

export interface ChronicCondition {
  id: string
  condition: string
  status: ConditionStatus
  severity: SeverityLevel
  diagnosedDate?: string
  carePlan?: string
  nextReview?: string
}

export interface Vaccination {
  id: string
  vaccineName: string
  dateAdministered?: string
  administeredBy?: string
  dose?: string
  lotNumber?: string
  notes?: string
  compliant: boolean
  dueDate?: string
  priority?: 'High' | 'Medium' | 'Low'
}

export interface GrowthMeasurement {
  id: string
  date: string
  height: string
  weight: string
  bmi: string
  headCircumference?: string
  notes?: string
}

export interface Screening {
  id: string
  type: 'Vision' | 'Hearing'
  date: string
  result: 'Pass' | 'Refer'
  provider: string
  notes?: string
}

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