/**
 * @fileoverview Health Record Metadata Types
 * @module health-metadata
 * @description Type-safe metadata definitions for health records using discriminated unions.
 * Replaces unsafe Record<string, any> with structured, type-checked metadata.
 *
 * HIPAA CRITICAL - Proper typing ensures PHI is correctly tracked and validated
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 */

/**
 * Lab test result value
 */
export interface LabValue {
  test: string;
  value: string | number;
  unit?: string;
  referenceRange?: string;
  abnormalFlag?: 'L' | 'H' | 'N' | 'C'; // Low, High, Normal, Critical
}

/**
 * Vital signs measurement
 */
export interface VitalSign {
  type: 'temperature' | 'blood_pressure' | 'heart_rate' | 'respiratory_rate' | 'oxygen_saturation' | 'height' | 'weight' | 'bmi';
  value: number;
  unit: string;
  timestamp?: Date;
}

/**
 * Imaging study information
 */
export interface ImagingStudy {
  modality: 'X-RAY' | 'CT' | 'MRI' | 'ULTRASOUND' | 'PET' | 'OTHER';
  bodyPart: string;
  findings: string;
  impression?: string;
  images?: string[]; // URLs or file references
}

/**
 * Vaccination record details
 */
export interface VaccinationDetails {
  vaccineName: string;
  cvxCode?: string; // CDC vaccine code
  lotNumber?: string;
  manufacturer?: string;
  site?: string; // Injection site
  route?: string; // Administration route
  dose?: number;
  doseUnit?: string;
  seriesStatus?: 'complete' | 'incomplete';
}

/**
 * Mental health screening results
 */
export interface MentalHealthScreening {
  screeningTool: string; // e.g., "PHQ-9", "GAD-7"
  score: number;
  maxScore: number;
  severity?: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';
  questions?: Array<{
    question: string;
    response: string | number;
  }>;
}

/**
 * Vision or hearing test results
 */
export interface SensoryScreening {
  type: 'vision' | 'hearing';
  results: {
    left?: string | number;
    right?: string | number;
    binocular?: string | number;
  };
  passed: boolean;
  notes?: string;
}

/**
 * Dental examination details
 */
export interface DentalExamination {
  cavities: number;
  fillings: number;
  sealants: number;
  cleaningRecommended: boolean;
  orthodonticsNeeded: boolean;
  notes?: string;
}

/**
 * Physical exam findings
 */
export interface PhysicalExamFindings {
  generalAppearance?: string;
  cardiovascular?: string;
  respiratory?: string;
  gastrointestinal?: string;
  musculoskeletal?: string;
  neurological?: string;
  skin?: string;
  heent?: string; // Head, Eyes, Ears, Nose, Throat
}

/**
 * Medication administration details
 */
export interface MedicationAdministration {
  medicationName: string;
  dose: number;
  doseUnit: string;
  route: string;
  administeredBy: string;
  witnessedBy?: string;
  time: Date;
  reaction?: string;
}

/**
 * Emergency visit details
 */
export interface EmergencyVisitDetails {
  chiefComplaint: string;
  triageLevel?: 1 | 2 | 3 | 4 | 5;
  disposition: 'home' | 'admitted' | 'transferred' | 'left_ama' | 'deceased';
  admittingDiagnosis?: string;
}

/**
 * Growth assessment data
 */
export interface GrowthAssessment {
  height: number;
  heightUnit: 'cm' | 'in';
  weight: number;
  weightUnit: 'kg' | 'lb';
  bmi: number;
  percentiles: {
    height?: number;
    weight?: number;
    bmi?: number;
  };
  growthConcerns?: string;
}

/**
 * Allergy documentation
 */
export interface AllergyDocumentation {
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
  onsetDate?: Date;
  verifiedBy?: string;
}

/**
 * Discriminated union of all health record metadata types
 * This enables type-safe metadata with exhaustive checking
 */
export type HealthRecordMetadata =
  | { type: 'lab_result'; data: { tests: LabValue[]; labName: string; orderedBy?: string } }
  | { type: 'vital_signs'; data: { measurements: VitalSign[] } }
  | { type: 'imaging'; data: ImagingStudy }
  | { type: 'vaccination'; data: VaccinationDetails }
  | { type: 'mental_health_screening'; data: MentalHealthScreening }
  | { type: 'vision_screening'; data: SensoryScreening }
  | { type: 'hearing_screening'; data: SensoryScreening }
  | { type: 'dental_exam'; data: DentalExamination }
  | { type: 'physical_exam'; data: PhysicalExamFindings }
  | { type: 'medication_administration'; data: MedicationAdministration }
  | { type: 'emergency_visit'; data: EmergencyVisitDetails }
  | { type: 'growth_assessment'; data: GrowthAssessment }
  | { type: 'allergy_documentation'; data: AllergyDocumentation }
  | { type: 'other'; data: Record<string, unknown> }; // Fallback for unstructured data

/**
 * Type guard to check if metadata is of a specific type
 * @param metadata - Metadata to check
 * @param type - Type to check for
 * @returns True if metadata matches the specified type
 */
export function isMetadataType<T extends HealthRecordMetadata['type']>(
  metadata: HealthRecordMetadata | null | undefined,
  type: T,
): metadata is Extract<HealthRecordMetadata, { type: T }> {
  return metadata?.type === type;
}

/**
 * Type-safe metadata accessor
 * @param metadata - Health record metadata
 * @returns Typed data or null
 */
export function getMetadataData<T extends HealthRecordMetadata['type']>(
  metadata: HealthRecordMetadata | null | undefined,
  type: T,
): Extract<HealthRecordMetadata, { type: T }>['data'] | null {
  if (isMetadataType(metadata, type)) {
    return metadata.data;
  }
  return null;
}

/**
 * Helper to create lab result metadata
 */
export function createLabResultMetadata(
  tests: LabValue[],
  labName: string,
  orderedBy?: string,
): HealthRecordMetadata {
  return {
    type: 'lab_result',
    data: { tests, labName, orderedBy },
  };
}

/**
 * Helper to create vital signs metadata
 */
export function createVitalSignsMetadata(measurements: VitalSign[]): HealthRecordMetadata {
  return {
    type: 'vital_signs',
    data: { measurements },
  };
}

/**
 * Helper to create vaccination metadata
 */
export function createVaccinationMetadata(details: VaccinationDetails): HealthRecordMetadata {
  return {
    type: 'vaccination',
    data: details,
  };
}

/**
 * Helper to create imaging metadata
 */
export function createImagingMetadata(study: ImagingStudy): HealthRecordMetadata {
  return {
    type: 'imaging',
    data: study,
  };
}

/**
 * Helper to create mental health screening metadata
 */
export function createMentalHealthScreeningMetadata(
  screening: MentalHealthScreening,
): HealthRecordMetadata {
  return {
    type: 'mental_health_screening',
    data: screening,
  };
}

/**
 * Helper to create growth assessment metadata
 */
export function createGrowthAssessmentMetadata(
  assessment: GrowthAssessment,
): HealthRecordMetadata {
  return {
    type: 'growth_assessment',
    data: assessment,
  };
}
