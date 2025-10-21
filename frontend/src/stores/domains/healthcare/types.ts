/**
 * Healthcare Domain Types
 * 
 * Type definitions specific to the healthcare domain including medical records,
 * medications, appointments, incidents, and health monitoring.
 */

// ==========================================
// STUDENT HEALTH TYPES
// ==========================================

/**
 * Student health overview
 */
export interface StudentHealthOverview {
  studentId: string;
  hasActiveConditions: boolean;
  medicationCount: number;
  upcomingAppointments: number;
  recentIncidents: number;
  lastHealthCheckup: Date | null;
}

/**
 * Health condition severity
 */
export type HealthConditionSeverity = 'low' | 'moderate' | 'high' | 'critical';

/**
 * Health condition category
 */
export type HealthConditionCategory = 
  | 'allergy'
  | 'chronic_condition'
  | 'medication_dependency'
  | 'mobility_limitation'
  | 'dietary_restriction'
  | 'other';

/**
 * Health condition definition
 */
export interface HealthCondition {
  id: string;
  studentId: string;
  category: HealthConditionCategory;
  name: string;
  description?: string;
  severity: HealthConditionSeverity;
  isActive: boolean;
  diagnosedDate?: Date;
  notes?: string;
}

// ==========================================
// MEDICATION TYPES
// ==========================================

/**
 * Medication administration frequency
 */
export type MedicationFrequency = 
  | 'as_needed'
  | 'once_daily'
  | 'twice_daily'
  | 'three_times_daily'
  | 'four_times_daily'
  | 'every_other_day'
  | 'weekly'
  | 'monthly'
  | 'custom';

/**
 * Medication administration route
 */
export type MedicationRoute = 
  | 'oral'
  | 'topical'
  | 'injection'
  | 'inhalation'
  | 'eye_drops'
  | 'nasal'
  | 'other';

/**
 * Medication administration status
 */
export type MedicationAdministrationStatus = 
  | 'pending'
  | 'administered'
  | 'missed'
  | 'refused'
  | 'not_needed';

/**
 * Medication administration record
 */
export interface MedicationAdministration {
  id: string;
  studentMedicationId: string;
  scheduledTime: Date;
  administeredTime?: Date;
  status: MedicationAdministrationStatus;
  dosageGiven?: string;
  administeredBy?: string;
  notes?: string;
  sideEffectsObserved?: string[];
}

/**
 * Medication adherence statistics
 */
export interface MedicationAdherenceStats {
  totalMedications: number;
  onSchedule: number;
  overdue: number;
  adherenceRate: number;
}

// ==========================================
// APPOINTMENT TYPES
// ==========================================

/**
 * Appointment type
 */
export type AppointmentType = 
  | 'routine_checkup'
  | 'sick_visit'
  | 'injury_followup'
  | 'medication_review'
  | 'screening'
  | 'vaccination'
  | 'emergency'
  | 'other';

/**
 * Appointment status
 */
export type AppointmentStatus = 
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled';

/**
 * Appointment priority
 */
export type AppointmentPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Appointment statistics
 */
export interface AppointmentStats {
  total: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  noShows: number;
}

// ==========================================
// INCIDENT REPORT TYPES
// ==========================================

/**
 * Incident type
 */
export type IncidentType = 
  | 'injury'
  | 'illness'
  | 'allergic_reaction'
  | 'medication_error'
  | 'behavioral'
  | 'environmental'
  | 'other';

/**
 * Incident severity
 */
export type IncidentSeverity = 'minor' | 'moderate' | 'severe' | 'critical';

/**
 * Incident status
 */
export type IncidentStatus = 
  | 'reported'
  | 'under_investigation'
  | 'action_required'
  | 'resolved'
  | 'closed';

/**
 * Incident trends data
 */
export interface IncidentTrends {
  thisMonth: number;
  lastMonth: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
}

// ==========================================
// HEALTH MONITORING TYPES
// ==========================================

/**
 * Vital signs
 */
export interface VitalSigns {
  temperature?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
}

/**
 * Health measurement type
 */
export type HealthMeasurementType = 
  | 'vital_signs'
  | 'growth_tracking'
  | 'vision_screening'
  | 'hearing_screening'
  | 'dental_checkup'
  | 'immunization_status';

/**
 * Health assessment
 */
export interface HealthAssessment {
  id: string;
  studentId: string;
  assessmentType: HealthMeasurementType;
  assessmentDate: Date;
  performedBy: string;
  findings: Record<string, any>;
  recommendations?: string[];
  followUpRequired: boolean;
  followUpDate?: Date;
}

// ==========================================
// HEALTH ALERTS TYPES
// ==========================================

/**
 * Health alert type
 */
export type HealthAlertType = 
  | 'critical_medication'
  | 'missed_appointment'
  | 'severe_incident'
  | 'expiring_medication'
  | 'allergy_warning'
  | 'compliance_issue';

/**
 * Health alert priority
 */
export type HealthAlertPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Health alert
 */
export interface HealthAlert {
  id: string;
  type: HealthAlertType;
  priority: HealthAlertPriority;
  studentId: string;
  title: string;
  message: string;
  actionRequired?: string;
  createdAt: Date;
  resolvedAt?: Date;
  isResolved: boolean;
}

/**
 * Health alerts summary
 */
export interface HealthAlerts {
  criticalMedications: HealthAlert[];
  missedAppointments: HealthAlert[];
  severeIncidents: HealthAlert[];
  expiringMedications: HealthAlert[];
}

// ==========================================
// DASHBOARD TYPES
// ==========================================

/**
 * Healthcare dashboard overview
 */
export interface HealthcareDashboardOverview {
  studentsWithMedications: number;
  appointmentsToday: number;
  recentIncidents: number;
  alertsCount: number;
}

/**
 * Healthcare dashboard data
 */
export interface HealthcareDashboard {
  medicationsToday: any[];
  adherence: MedicationAdherenceStats;
  appointments: AppointmentStats;
  trends: IncidentTrends;
  alerts: HealthAlerts;
  overview: HealthcareDashboardOverview;
}

// ==========================================
// COMPLIANCE TYPES
// ==========================================

/**
 * HIPAA compliance status
 */
export interface HIPAACompliance {
  accessLogged: boolean;
  dataEncrypted: boolean;
  consentFormsUpToDate: boolean;
  privacySettingsConfigured: boolean;
  complianceScore: number;
}

/**
 * Data quality metrics
 */
export interface DataQualityMetrics {
  completedProfiles: number;
  missingHealthRecords: number;
  outdatedInformation: number;
  qualityScore: number;
}

// ==========================================
// HOOK RETURN TYPES
// ==========================================

/**
 * Student health hook return type
 */
export interface UseStudentHealthReturn {
  overview: StudentHealthOverview;
  hasActiveConditions: boolean;
  medicationCount: number;
  upcomingAppointments: number;
  recentIncidents: number;
}

/**
 * Medications hook return type
 */
export interface UseMedicationsReturn {
  medicationsDueToday: any[];
  adherenceStats: MedicationAdherenceStats;
}

/**
 * Health alerts hook return type
 */
export interface UseHealthAlertsReturn {
  alerts: HealthAlerts;
  alertCount: number;
  hasCriticalAlerts: boolean;
  hasAnyAlerts: boolean;
  criticalCount: number;
}

/**
 * Healthcare dashboard hook return type
 */
export interface UseHealthcareDashboardReturn {
  dashboard: HealthcareDashboard;
  overview: HealthcareDashboardOverview;
  needsAttention: boolean;
}

/**
 * HIPAA compliance hook return type
 */
export interface UseHIPAAComplianceReturn {
  compliance: HIPAACompliance;
  isCompliant: boolean;
  complianceScore: number;
  needsAttention: boolean;
}