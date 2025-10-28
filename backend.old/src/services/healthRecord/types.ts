/**
 * @fileoverview Health Record Type Definitions
 *
 * Comprehensive TypeScript type definitions for school health management system.
 * Defines data structures for student health records, allergies, vaccinations,
 * vital signs, chronic conditions, and clinical data management.
 *
 * @module services/healthRecord/types
 *
 * @remarks
 * PHI SENSITIVITY: These type definitions structure protected health information (PHI)
 * including medical records, vital signs, allergies, vaccinations, and chronic conditions.
 * All implementations using these types must include HIPAA-compliant audit logging.
 *
 * Healthcare Standards Supported:
 * - CDC Growth Charts and BMI-for-age calculations
 * - CVX (Vaccine Administered) coding system
 * - ICD-10 diagnosis codes
 * - AllergySeverity classification (mild, moderate, severe, life-threatening)
 * - ConditionStatus tracking (active, managed, resolved, monitoring)
 * - HealthRecordType standardization (checkup, vaccination, illness, injury, etc.)
 *
 * Compliance:
 * - HIPAA Privacy Rule §164.308 - Data structure for PHI
 * - HIPAA Security Rule §164.312 - Technical safeguards
 * - State immunization registries - Vaccination data format
 * - CDC reporting requirements - Vital signs and growth data
 *
 * LOC: 3F8A92C1D4
 * WC-SVC-HLT-TYPES | types.ts
 * Last Updated: 2025-10-18 | File Type: .ts
 *
 * @since 1.0.0
 */

import { HealthRecordType, AllergySeverity, ConditionStatus, ConditionSeverity } from '../../database/types/enums';
import { Student } from '../../database/models';

// Type augmentations for model associations
declare module '../../database/models' {
  interface HealthRecord {
    student?: Student;
    vital?: any;
    type: any;
    date: Date;
  }

  interface Allergy {
    student?: Student;
    allergen: string;
  }

  interface ChronicCondition {
    student?: Student;
    condition: string;
  }

  interface Vaccination {
    student?: Student;
    vaccineName: string;
    administrationDate: Date;
    expirationDate?: Date;
    doseNumber?: number;
    totalDoses?: number;
  }

  interface Student {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  }
}

/**
 * Health Record Creation Data
 *
 * Data structure for creating comprehensive health record entries including
 * vital signs, medical visits, screenings, and clinical observations.
 *
 * @property {string} studentId - Student UUID (required, must exist)
 * @property {HealthRecordType} type - Record type: CHECKUP, VACCINATION, ILLNESS, INJURY,
 *                                     SCREENING, PHYSICAL_EXAM, MENTAL_HEALTH, DENTAL, VISION, HEARING
 * @property {Date} date - Date of health record entry
 * @property {string} description - Clinical description of record (required for documentation)
 * @property {any} [vital] - Vital signs data (VitalSigns interface) - BP, HR, temp, RR, O2 sat, height, weight, BMI
 * @property {string} [provider] - Healthcare provider name or credentials
 * @property {string} [notes] - Clinical notes and observations
 * @property {string[]} [attachments] - File attachment URLs (lab results, images, documents)
 *
 * @example
 * ```typescript
 * const healthRecord: CreateHealthRecordData = {
 *   studentId: 'student-uuid',
 *   type: 'CHECKUP',
 *   date: new Date(),
 *   description: 'Annual wellness visit',
 *   vital: {
 *     temperature: 98.6,
 *     bloodPressureSystolic: 110,
 *     bloodPressureDiastolic: 70,
 *     heartRate: 72,
 *     height: 150, // cm
 *     weight: 45, // kg
 *     bmi: 20
 *   },
 *   provider: 'Dr. Sarah Johnson, MD',
 *   notes: 'Student in good health, no concerns'
 * };
 * ```
 */
export interface CreateHealthRecordData {
  studentId: string;
  type: HealthRecordType;
  date: Date;
  description: string;
  vital?: any; // JSON data for vitals
  provider?: string;
  notes?: string;
  attachments?: string[];
}

/**
 * Allergy Creation Data
 *
 * Data structure for documenting student allergies with severity classification,
 * reaction descriptions, and verification status.
 *
 * @property {string} studentId - Student UUID (required)
 * @property {string} allergen - Specific allergen name (e.g., "Peanuts", "Penicillin", "Bee stings")
 * @property {AllergySeverity} severity - Severity: mild, moderate, severe, life-threatening
 * @property {string} [reaction] - Description of allergic reaction symptoms
 * @property {string} [treatment] - Treatment protocol (e.g., "EpiPen, call 911")
 * @property {boolean} [verified] - Whether allergy has been medically verified
 * @property {string} [verifiedBy] - Healthcare provider who verified allergy
 *
 * @example
 * ```typescript
 * const allergy: CreateAllergyData = {
 *   studentId: 'student-uuid',
 *   allergen: 'Peanuts',
 *   severity: 'life-threatening',
 *   reaction: 'Anaphylaxis, difficulty breathing, hives',
 *   treatment: 'EpiPen available in nurse office, call 911 immediately',
 *   verified: true,
 *   verifiedBy: 'Dr. Jane Smith, Allergist'
 * };
 * ```
 */
export interface CreateAllergyData {
  studentId: string;
  allergen: string;
  severity: AllergySeverity;
  reaction?: string;
  treatment?: string;
  verified?: boolean;
  verifiedBy?: string;
}

/**
 * Chronic Condition Creation Data
 *
 * Data structure for managing student chronic health conditions with ICD-10 coding,
 * care plans, medication tracking, and review scheduling.
 *
 * @property {string} studentId - Student UUID (required)
 * @property {string} condition - Condition name (e.g., "Type 1 Diabetes", "Asthma")
 * @property {Date} diagnosisDate - Date of official diagnosis
 * @property {ConditionStatus} [status] - Status: active, managed, resolved, monitoring
 * @property {ConditionSeverity} [severity] - Severity: low, moderate, high, critical
 * @property {string} [notes] - Clinical notes and observations
 * @property {string} [carePlan] - Comprehensive care plan documentation
 * @property {string[]} [medications] - List of prescribed medications
 * @property {string[]} [restrictions] - Activity or dietary restrictions
 * @property {string[]} [triggers] - Known triggers that worsen condition
 * @property {string} [diagnosedBy] - Healthcare provider who diagnosed
 * @property {Date} [lastReviewDate] - Most recent care plan review date
 * @property {Date} [nextReviewDate] - Scheduled next review date
 * @property {string} [icdCode] - ICD-10 diagnosis code (e.g., "E10.9" for Type 1 Diabetes)
 *
 * @example
 * ```typescript
 * const condition: CreateChronicConditionData = {
 *   studentId: 'student-uuid',
 *   condition: 'Asthma',
 *   diagnosisDate: new Date('2022-05-15'),
 *   status: 'managed',
 *   severity: 'moderate',
 *   icdCode: 'J45.909',
 *   carePlan: 'Daily controller inhaler, rescue inhaler for symptoms',
 *   medications: ['Fluticasone (daily)', 'Albuterol (as needed)'],
 *   triggers: ['Exercise', 'Cold air', 'Pollen'],
 *   restrictions: ['Avoid strenuous outdoor activity during high pollen count'],
 *   diagnosedBy: 'Dr. Robert Lee, Pulmonologist',
 *   nextReviewDate: new Date('2024-11-15')
 * };
 * ```
 */
export interface CreateChronicConditionData {
  studentId: string;
  condition: string;
  diagnosisDate: Date;
  status?: ConditionStatus;
  severity?: ConditionSeverity;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  diagnosedBy?: string;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  icdCode?: string;
}

/**
 * Vaccination Creation Data
 *
 * Data structure for CDC-compliant vaccination records with CVX coding,
 * dose tracking, and state registry reporting support.
 *
 * @property {string} studentId - Student UUID (required)
 * @property {string} vaccineName - Vaccine name (e.g., "MMR", "COVID-19, mRNA")
 * @property {Date} administrationDate - Date vaccine was administered (required)
 * @property {string} administeredBy - Healthcare provider who administered vaccine
 * @property {string} [cvxCode] - CVX code (CDC vaccine code, e.g., "208" for COVID-19 mRNA)
 * @property {string} [ndcCode] - NDC code (National Drug Code)
 * @property {string} [lotNumber] - Vaccine lot number for recall tracking
 * @property {string} [manufacturer] - Vaccine manufacturer (e.g., "Pfizer", "Moderna")
 * @property {number} [doseNumber] - Current dose number in series (e.g., 1)
 * @property {number} [totalDoses] - Total doses in series (e.g., 2 for COVID-19 primary series)
 * @property {Date} [expirationDate] - Vaccine lot expiration date
 * @property {Date} [nextDueDate] - Next dose due date
 * @property {string} [site] - Administration site (e.g., "Left deltoid", "Right thigh")
 * @property {string} [route] - Administration route (e.g., "Intramuscular", "Subcutaneous")
 * @property {string} [dosageAmount] - Dosage amount (e.g., "0.5 mL")
 * @property {string} [reactions] - Any adverse reactions observed
 * @property {string} [notes] - Additional clinical notes
 *
 * @example
 * ```typescript
 * const vaccination: CreateVaccinationData = {
 *   studentId: 'student-uuid',
 *   vaccineName: 'COVID-19, mRNA',
 *   cvxCode: '208',
 *   administrationDate: new Date('2024-01-15'),
 *   administeredBy: 'School Nurse Sarah Johnson, RN',
 *   lotNumber: 'AB12345',
 *   manufacturer: 'Pfizer',
 *   doseNumber: 1,
 *   totalDoses: 2,
 *   expirationDate: new Date('2025-12-31'),
 *   nextDueDate: new Date('2024-02-15'),
 *   site: 'Left deltoid',
 *   route: 'Intramuscular',
 *   dosageAmount: '0.3 mL',
 *   reactions: 'None reported',
 *   notes: 'VIS provided, parent consent obtained'
 * };
 * ```
 */
export interface CreateVaccinationData {
  studentId: string;
  vaccineName: string;
  administrationDate: Date;
  administeredBy: string;
  cvxCode?: string;
  ndcCode?: string;
  lotNumber?: string;
  manufacturer?: string;
  doseNumber?: number;
  totalDoses?: number;
  expirationDate?: Date;
  nextDueDate?: Date;
  site?: string;
  route?: string;
  dosageAmount?: string;
  reactions?: string;
  notes?: string;
}

/**
 * Vital Signs Data Structure
 *
 * Comprehensive vital signs measurements following clinical standards.
 * All measurements use standard medical units.
 *
 * @property {number} [temperature] - Body temperature in Fahrenheit (normal: 97.0-99.0°F)
 * @property {number} [bloodPressureSystolic] - Systolic blood pressure in mmHg
 * @property {number} [bloodPressureDiastolic] - Diastolic blood pressure in mmHg
 * @property {number} [heartRate] - Heart rate in beats per minute (bpm)
 * @property {number} [respiratoryRate] - Respiratory rate in breaths per minute
 * @property {number} [oxygenSaturation] - Oxygen saturation percentage (normal: 95-100%)
 * @property {number} [height] - Height in centimeters (CDC standard)
 * @property {number} [weight] - Weight in kilograms (CDC standard)
 * @property {number} [bmi] - Body Mass Index (weight/height²)
 *
 * @example
 * ```typescript
 * const vitals: VitalSigns = {
 *   temperature: 98.6,
 *   bloodPressureSystolic: 110,
 *   bloodPressureDiastolic: 70,
 *   heartRate: 72,
 *   respiratoryRate: 16,
 *   oxygenSaturation: 98,
 *   height: 150, // 150 cm
 *   weight: 45,  // 45 kg
 *   bmi: 20.0
 * };
 * ```
 */
export interface VitalSigns {
  temperature?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  height?: number;
  weight?: number;
  bmi?: number;
}

/**
 * Health Record Filter Options
 */
export interface HealthRecordFilters {
  type?: 'CHECKUP' | 'VACCINATION' | 'ILLNESS' | 'INJURY' | 'SCREENING' | 'PHYSICAL_EXAM' | 'MENTAL_HEALTH' | 'DENTAL' | 'VISION' | 'HEARING';
  dateFrom?: Date;
  dateTo?: Date;
  provider?: string;
}

/**
 * Pagination Result Structure
 */
export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Paginated Health Records Response
 */
export interface PaginatedHealthRecords<T> {
  records: T[];
  pagination: PaginationResult;
}

/**
 * Growth Data Point
 */
export interface GrowthDataPoint {
  date: Date;
  height?: number;
  weight?: number;
  bmi?: number;
  recordType: any;
}

/**
 * Health Summary Response
 */
export interface HealthSummary {
  student: any;
  allergies: any[];
  recentVitals: any[];
  recentVaccinations: any[];
  recordCounts: Record<string, number>;
}

/**
 * Import Results
 */
export interface ImportResults {
  imported: number;
  skipped: number;
  errors: string[];
}

/**
 * Bulk Delete Results
 */
export interface BulkDeleteResults {
  deleted: number;
  notFound: number;
  success: boolean;
}

/**
 * Health Record Statistics
 */
export interface HealthRecordStatistics {
  totalRecords: number;
  activeAllergies: number;
  chronicConditions: number;
  vaccinationsDue: number;
  recentRecords: number;
}
