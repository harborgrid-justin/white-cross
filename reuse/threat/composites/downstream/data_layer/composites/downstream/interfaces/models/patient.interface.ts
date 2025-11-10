/**
 * @fileoverview Patient and Healthcare Interfaces
 * @module interfaces/models/patient
 * @description HIPAA-compliant patient data model for healthcare integration
 */

import { IBaseEntity, IAuditableEntity } from './base-entity.interface';

/**
 * Patient interface (HIPAA-compliant PHI)
 */
export interface IPatient extends IBaseEntity, IAuditableEntity {
  /** Medical Record Number (MRN) - unique identifier */
  mrn: string;

  /** Patient first name (encrypted) */
  firstName: string;

  /** Patient last name (encrypted) */
  lastName: string;

  /** Full name (computed, encrypted) */
  fullName?: string;

  /** Date of birth (encrypted) */
  dateOfBirth: Date;

  /** Age (computed) */
  age?: number;

  /** Gender */
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN' | 'PREFER_NOT_TO_SAY';

  /** Social Security Number (encrypted, optional) */
  ssn?: string;

  /** Email (encrypted) */
  email?: string;

  /** Phone number (encrypted) */
  phone?: string;

  /** Address (encrypted) */
  address?: IAddress;

  /** Emergency contact (encrypted) */
  emergencyContact?: IEmergencyContact;

  /** Insurance information */
  insurance?: IInsuranceInfo[];

  /** Primary care provider */
  primaryCareProvider?: string;

  /** Referring physician */
  referringPhysician?: string;

  /** Medical history */
  medicalHistory?: IMedicalHistory;

  /** Allergies */
  allergies?: IAllergy[];

  /** Medications */
  medications?: IMedication[];

  /** Diagnoses */
  diagnoses?: IDiagnosis[];

  /** Lab results */
  labResults?: ILabResult[];

  /** Visits/encounters */
  visits?: IVisit[];

  /** Immunizations */
  immunizations?: IImmunization[];

  /** Vital signs (latest) */
  vitalSigns?: IVitalSigns;

  /** Patient status */
  status: 'ACTIVE' | 'INACTIVE' | 'DECEASED' | 'UNKNOWN';

  /** Deceased date */
  deceasedDate?: Date;

  /** Language preference */
  language?: string;

  /** Race/ethnicity (for statistics) */
  race?: string;

  /** Ethnicity */
  ethnicity?: string;

  /** Marital status */
  maritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'SEPARATED' | 'UNKNOWN';

  /** Consent for treatment */
  consentForTreatment?: boolean;

  /** Consent for data sharing */
  consentForDataSharing?: boolean;

  /** HIPAA authorization */
  hipaaAuthorization?: boolean;

  /** Privacy preferences */
  privacyPreferences?: IPrivacyPreferences;

  /** PHI access log IDs */
  phiAccessLog?: string[];

  /** Data minimization indicator */
  dataMinimized?: boolean;

  /** De-identified indicator */
  deIdentified?: boolean;

  /** Encryption status */
  encrypted?: boolean;
}

/**
 * Address (PHI)
 */
export interface IAddress {
  /** Street address line 1 */
  street1: string;

  /** Street address line 2 */
  street2?: string;

  /** City */
  city: string;

  /** State/province */
  state: string;

  /** ZIP/postal code */
  zipCode: string;

  /** Country */
  country: string;

  /** Address type */
  type?: 'HOME' | 'WORK' | 'TEMPORARY' | 'OTHER';
}

/**
 * Emergency contact (PHI)
 */
export interface IEmergencyContact {
  /** Contact name */
  name: string;

  /** Relationship to patient */
  relationship: string;

  /** Phone number */
  phone: string;

  /** Email */
  email?: string;

  /** Address */
  address?: IAddress;
}

/**
 * Insurance information
 */
export interface IInsuranceInfo {
  /** Insurance provider */
  provider: string;

  /** Policy number */
  policyNumber: string;

  /** Group number */
  groupNumber?: string;

  /** Subscriber name */
  subscriberName?: string;

  /** Subscriber relationship */
  subscriberRelationship?: 'SELF' | 'SPOUSE' | 'CHILD' | 'OTHER';

  /** Coverage type */
  coverageType?: 'PRIMARY' | 'SECONDARY' | 'TERTIARY';

  /** Effective date */
  effectiveDate?: Date;

  /** Expiration date */
  expirationDate?: Date;

  /** Is active */
  active: boolean;
}

/**
 * Medical history
 */
export interface IMedicalHistory {
  /** Chronic conditions */
  chronicConditions?: string[];

  /** Past surgeries */
  pastSurgeries?: ISurgery[];

  /** Family history */
  familyHistory?: IFamilyHistory[];

  /** Lifestyle factors */
  lifestyleFactors?: ILifestyleFactors;

  /** Notes */
  notes?: string;
}

/**
 * Surgery record
 */
export interface ISurgery {
  /** Surgery type */
  type: string;

  /** Surgery date */
  date: Date;

  /** Surgeon */
  surgeon?: string;

  /** Hospital/facility */
  facility?: string;

  /** Notes */
  notes?: string;
}

/**
 * Family history
 */
export interface IFamilyHistory {
  /** Relation */
  relation: string;

  /** Condition */
  condition: string;

  /** Age of onset */
  ageOfOnset?: number;

  /** Notes */
  notes?: string;
}

/**
 * Lifestyle factors
 */
export interface ILifestyleFactors {
  /** Smoking status */
  smoking?: 'NEVER' | 'FORMER' | 'CURRENT' | 'UNKNOWN';

  /** Alcohol use */
  alcohol?: 'NONE' | 'OCCASIONAL' | 'MODERATE' | 'HEAVY' | 'UNKNOWN';

  /** Exercise frequency */
  exercise?: 'NONE' | 'LIGHT' | 'MODERATE' | 'VIGOROUS' | 'UNKNOWN';

  /** Diet type */
  diet?: string;
}

/**
 * Allergy
 */
export interface IAllergy {
  /** Allergen */
  allergen: string;

  /** Reaction */
  reaction: string;

  /** Severity */
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';

  /** Onset date */
  onsetDate?: Date;

  /** Notes */
  notes?: string;
}

/**
 * Medication
 */
export interface IMedication {
  /** Medication name */
  name: string;

  /** Dosage */
  dosage: string;

  /** Frequency */
  frequency: string;

  /** Route */
  route?: string;

  /** Start date */
  startDate: Date;

  /** End date */
  endDate?: Date;

  /** Prescriber */
  prescriber?: string;

  /** Reason */
  reason?: string;

  /** Is active */
  active: boolean;
}

/**
 * Diagnosis
 */
export interface IDiagnosis {
  /** ICD-10 code */
  icd10Code: string;

  /** Diagnosis description */
  description: string;

  /** Diagnosis date */
  diagnosisDate: Date;

  /** Diagnosing provider */
  provider?: string;

  /** Status */
  status: 'ACTIVE' | 'RESOLVED' | 'CHRONIC';

  /** Notes */
  notes?: string;
}

/**
 * Lab result
 */
export interface ILabResult {
  /** Test name */
  testName: string;

  /** Test code (LOINC) */
  testCode?: string;

  /** Result value */
  value: string;

  /** Unit */
  unit?: string;

  /** Reference range */
  referenceRange?: string;

  /** Abnormal flag */
  abnormal?: boolean;

  /** Test date */
  testDate: Date;

  /** Ordering provider */
  orderingProvider?: string;

  /** Lab facility */
  labFacility?: string;

  /** Notes */
  notes?: string;
}

/**
 * Visit/encounter
 */
export interface IVisit {
  /** Visit ID */
  id: string;

  /** Visit type */
  type: 'OFFICE' | 'EMERGENCY' | 'INPATIENT' | 'OUTPATIENT' | 'TELEHEALTH' | 'OTHER';

  /** Visit date */
  date: Date;

  /** Provider */
  provider: string;

  /** Chief complaint */
  chiefComplaint?: string;

  /** Diagnoses */
  diagnoses?: string[];

  /** Procedures */
  procedures?: string[];

  /** Notes */
  notes?: string;

  /** Follow-up required */
  followUpRequired?: boolean;

  /** Follow-up date */
  followUpDate?: Date;
}

/**
 * Immunization
 */
export interface IImmunization {
  /** Vaccine name */
  vaccine: string;

  /** CVX code */
  cvxCode?: string;

  /** Administration date */
  date: Date;

  /** Dose number */
  doseNumber?: number;

  /** Administering provider */
  provider?: string;

  /** Lot number */
  lotNumber?: string;

  /** Manufacturer */
  manufacturer?: string;

  /** Expiration date */
  expirationDate?: Date;

  /** Site */
  site?: string;

  /** Route */
  route?: string;
}

/**
 * Vital signs
 */
export interface IVitalSigns {
  /** Measurement date */
  measuredAt: Date;

  /** Blood pressure systolic */
  bloodPressureSystolic?: number;

  /** Blood pressure diastolic */
  bloodPressureDiastolic?: number;

  /** Heart rate (bpm) */
  heartRate?: number;

  /** Respiratory rate */
  respiratoryRate?: number;

  /** Temperature (Fahrenheit) */
  temperature?: number;

  /** Oxygen saturation (%) */
  oxygenSaturation?: number;

  /** Weight (lbs) */
  weight?: number;

  /** Height (inches) */
  height?: number;

  /** BMI (calculated) */
  bmi?: number;
}

/**
 * Privacy preferences
 */
export interface IPrivacyPreferences {
  /** Share with family */
  shareWithFamily?: boolean;

  /** Share with providers */
  shareWithProviders?: boolean;

  /** Allow research use */
  allowResearch?: boolean;

  /** Marketing communications */
  allowMarketing?: boolean;

  /** Preferred contact method */
  preferredContactMethod?: 'EMAIL' | 'PHONE' | 'MAIL' | 'NONE';

  /** Best time to contact */
  bestTimeToContact?: string;
}
