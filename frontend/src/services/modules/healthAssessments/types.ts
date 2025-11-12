/**
 * Health Assessments Type Definitions
 *
 * Comprehensive TypeScript interfaces and types for health assessment features including:
 * - Health Risk Assessments
 * - Health Screenings (Vision, Hearing, Dental, Scoliosis, BMI)
 * - Growth Tracking and Analysis
 * - Immunization Forecasting
 * - Emergency Notifications
 * - Medication Interaction Checking
 *
 * @module HealthAssessments/Types
 * @version 2.0.0
 * @since 2025-10-24
 */

// ============================================================================
// HEALTH RISK ASSESSMENT TYPES
// ============================================================================

/**
 * Risk level classification for health assessments
 */
export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

/**
 * Individual risk factor with severity and impact assessment
 */
export interface RiskFactor {
  factor: string;
  severity: RiskLevel;
  impact: number;
}

/**
 * Comprehensive health risk assessment for a student
 *
 * Calculates risk score based on chronic conditions, allergies,
 * medications, and recent incidents.
 */
export interface HealthRiskAssessment {
  studentId: string;
  studentName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  riskFactors: RiskFactor[];
  activeConditions: number;
  severeAllergies: number;
  medicationCount: number;
  recentIncidents: number;
  recommendations: string[];
  lastAssessmentDate: string;
  nextReviewDate?: string;
}

/**
 * High-risk student requiring proactive monitoring
 */
export interface HighRiskStudent {
  studentId: string;
  studentName: string;
  riskScore: number;
  riskLevel: 'HIGH' | 'CRITICAL';
  primaryRisks: string[];
  lastAssessmentDate: string;
  assignedNurse?: string;
  urgentActions: string[];
}

// ============================================================================
// HEALTH SCREENING TYPES
// ============================================================================

/**
 * Types of health screenings conducted
 */
export type ScreeningType =
  | 'VISION'
  | 'HEARING'
  | 'DENTAL'
  | 'SCOLIOSIS'
  | 'BMI'
  | 'BLOOD_PRESSURE'
  | 'DEVELOPMENTAL';

/**
 * Possible screening result outcomes
 */
export type ScreeningResult = 'PASS' | 'FAIL' | 'REFER' | 'INCOMPLETE';

/**
 * Type-safe screening results using discriminated unions
 */
export interface VisionScreeningResults {
  leftEye: string;
  rightEye: string;
  colorVision?: string;
  notes?: string;
}

export interface HearingScreeningResults {
  leftEar: number; // dB
  rightEar: number; // dB
  frequencies?: Record<string, number>;
  notes?: string;
}

export interface DentalScreeningResults {
  cavities: number;
  missingTeeth: number;
  orthodonticNeeds: boolean;
  hygiene: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  notes?: string;
}

export interface ScoliosisScreeningResults {
  spinalCurvature: boolean;
  degreesIfMeasured?: number;
  referralRequired: boolean;
  notes?: string;
}

export interface BMIScreeningResults {
  height: number; // cm
  weight: number; // kg
  bmi: number;
  percentile: number;
  category: 'UNDERWEIGHT' | 'HEALTHY' | 'OVERWEIGHT' | 'OBESE';
  notes?: string;
}

/**
 * Discriminated union for type-safe detailed results
 */
export type ScreeningDetailedResults =
  | { type: 'VISION'; data: VisionScreeningResults }
  | { type: 'HEARING'; data: HearingScreeningResults }
  | { type: 'DENTAL'; data: DentalScreeningResults }
  | { type: 'SCOLIOSIS'; data: ScoliosisScreeningResults }
  | { type: 'BMI'; data: BMIScreeningResults }
  | { type: 'BLOOD_PRESSURE' | 'DEVELOPMENTAL'; data: Record<string, string | number | boolean> };

/**
 * Health screening record
 */
export interface HealthScreening {
  id: string;
  studentId: string;
  screeningType: ScreeningType;
  screeningDate: string;
  result: ScreeningResult;
  detailedResults?: ScreeningDetailedResults;
  followUpRequired: boolean;
  followUpNotes?: string;
  parentNotified: boolean;
  screenedBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request payload for creating a health screening
 */
export interface CreateScreeningRequest {
  studentId: string;
  screeningType: ScreeningType;
  screeningDate?: string;
  result: ScreeningResult;
  detailedResults?: ScreeningDetailedResults;
  followUpRequired?: boolean;
  followUpNotes?: string;
  parentNotified?: boolean;
}

// ============================================================================
// GROWTH TRACKING TYPES
// ============================================================================

/**
 * Single growth measurement record
 */
export interface GrowthMeasurement {
  id: string;
  studentId: string;
  measurementDate: string;
  height: number; // in cm
  weight: number; // in kg
  bmi: number;
  heightPercentile?: number;
  weightPercentile?: number;
  bmiPercentile?: number;
  headCircumference?: number;
  measuredBy: string;
  notes?: string;
  createdAt: string;
}

/**
 * Request payload for creating a growth measurement
 */
export interface CreateGrowthMeasurementRequest {
  height: number;
  weight: number;
  measurementDate?: string;
  headCircumference?: number;
  notes?: string;
}

/**
 * Current measurements snapshot
 */
export interface CurrentMeasurements {
  height: number;
  weight: number;
  bmi: number;
  measurementDate: string;
}

/**
 * Percentile values for growth metrics
 */
export interface GrowthPercentiles {
  heightPercentile: number;
  weightPercentile: number;
  bmiPercentile: number;
}

/**
 * Growth trends and concerns
 */
export interface GrowthTrends {
  heightVelocity: string;
  weightTrend: string;
  concerns: string[];
}

/**
 * Historical measurement data point
 */
export interface MeasurementHistoryPoint {
  date: string;
  height: number;
  weight: number;
  bmi: number;
}

/**
 * Comprehensive growth analysis with trends and recommendations
 */
export interface GrowthAnalysis {
  studentId: string;
  studentName: string;
  ageYears: number;
  currentMeasurements: CurrentMeasurements;
  percentiles: GrowthPercentiles;
  trends: GrowthTrends;
  clinicalInterpretation: string;
  recommendations: string[];
  measurementHistory: MeasurementHistoryPoint[];
}

// ============================================================================
// IMMUNIZATION FORECAST TYPES
// ============================================================================

/**
 * Immunization status for a specific vaccine dose
 */
export type ImmunizationStatus = 'DUE' | 'OVERDUE' | 'UP_TO_DATE' | 'NOT_DUE';

/**
 * Individual vaccine forecast entry
 */
export interface VaccineForecast {
  vaccineName: string;
  doseNumber: number;
  dueDate: string;
  earliestDate: string;
  status: ImmunizationStatus;
  notes?: string;
}

/**
 * Complete immunization forecast for a student
 */
export interface ImmunizationForecast {
  studentId: string;
  studentName: string;
  dateOfBirth: string;
  forecasts: VaccineForecast[];
  upToDate: boolean;
  generatedAt: string;
  nextDueDate?: string;
  overdueCount: number;
}

// ============================================================================
// EMERGENCY NOTIFICATION TYPES
// ============================================================================

/**
 * Types of medical emergencies
 */
export type EmergencyType =
  | 'MEDICAL_EMERGENCY'
  | 'ALLERGIC_REACTION'
  | 'INJURY'
  | 'SEIZURE'
  | 'CARDIAC'
  | 'RESPIRATORY'
  | 'OTHER';

/**
 * Emergency severity classification
 */
export type EmergencySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Type of contact relationship
 */
export type ContactType = 'PARENT' | 'GUARDIAN' | 'EMERGENCY_CONTACT' | 'MEDICAL_STAFF';

/**
 * Method of notification
 */
export type NotificationMethod = 'PHONE' | 'SMS' | 'EMAIL';

/**
 * Notified contact record
 */
export interface NotifiedContact {
  contactName: string;
  contactType: ContactType;
  notifiedAt: string;
  method: NotificationMethod;
}

/**
 * Vital signs measurements during emergency
 */
export interface VitalSigns {
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
}

/**
 * Emergency notification record
 */
export interface EmergencyNotification {
  id: string;
  studentId: string;
  studentName: string;
  emergencyType: EmergencyType;
  severity: EmergencySeverity;
  description: string;
  location: string;
  actionsTaken: string[];
  notifiedContacts: NotifiedContact[];
  incidentReportId?: string;
  resolvedAt?: string;
  reportedBy: string;
  createdAt: string;
}

/**
 * Request payload for creating an emergency notification
 */
export interface CreateEmergencyNotificationRequest {
  studentId: string;
  emergencyType: EmergencyType;
  severity: EmergencySeverity;
  description: string;
  location: string;
  actionsTaken?: string[];
  vitalSigns?: VitalSigns;
}

// ============================================================================
// MEDICATION INTERACTION TYPES
// ============================================================================

/**
 * Type of medication interaction
 */
export type InteractionType = 'DRUG_DRUG' | 'DRUG_FOOD' | 'DRUG_CONDITION';

/**
 * Severity of medication interaction
 */
export type InteractionSeverity = 'MINOR' | 'MODERATE' | 'MAJOR' | 'CONTRAINDICATED';

/**
 * Detailed medication interaction information
 */
export interface MedicationInteraction {
  medicationA: string;
  medicationB: string;
  interactionType: InteractionType;
  severity: InteractionSeverity;
  description: string;
  clinicalSignificance: string;
  managementRecommendations: string[];
}

/**
 * Complete medication interaction check result
 */
export interface MedicationInteractionCheck {
  studentId: string;
  studentName: string;
  currentMedications: string[];
  interactions: MedicationInteraction[];
  highSeverityCount: number;
  requiresReview: boolean;
  checkedAt: string;
}

/**
 * Request payload for checking a new medication
 */
export interface CheckNewMedicationRequest {
  medicationName: string;
  dosage?: string;
  frequency?: string;
}
