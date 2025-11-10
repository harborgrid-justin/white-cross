/**
 * Patient Types and Interfaces
 *
 * Comprehensive type definitions for patient demographics, medical records,
 * and patient-related healthcare data structures.
 *
 * @module patient.types
 * @since 1.0.0
 */

import {
  Identifier,
  Address,
  PhoneNumber,
  Email,
  CommunicationPreferences,
  Gender,
  Race,
  Ethnicity,
  MaritalStatus,
  EntityStatus,
} from './common.types';

/**
 * Complete patient demographic information
 *
 * @example
 * ```typescript
 * const patient: PatientDemographics = {
 *   patientId: 'PAT-123456',
 *   identifiers: [{ type: 'MRN', value: 'MRN-789' }],
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   dateOfBirth: new Date('1980-05-15'),
 *   gender: 'male',
 *   status: 'active'
 * };
 * ```
 */
export interface PatientDemographics {
  /** Unique patient identifier (system UUID) */
  patientId: string;

  /** External identifiers (MRN, SSN, etc.) */
  identifiers: Identifier[];

  /** First name */
  firstName: string;

  /** Middle name */
  middleName?: string;

  /** Last name */
  lastName: string;

  /** Suffix (Jr., Sr., III, etc.) */
  suffix?: string;

  /** Preferred name / nickname */
  preferredName?: string;

  /** Date of birth */
  dateOfBirth: Date;

  /** Age (calculated from DOB) */
  age?: number;

  /** Gender */
  gender: Gender;

  /** Gender identity (may differ from biological gender) */
  genderIdentity?: string;

  /** Pronouns (he/him, she/her, they/them, etc.) */
  pronouns?: string;

  /** Race */
  race?: Race;

  /** Ethnicity */
  ethnicity?: Ethnicity;

  /** Marital status */
  maritalStatus?: MaritalStatus;

  /** Primary language (ISO 639-1 code) */
  primaryLanguage?: string;

  /** Whether patient requires interpreter */
  requiresInterpreter?: boolean;

  /** Patient status */
  status: EntityStatus;

  /** Date of death (if deceased) */
  dateOfDeath?: Date;

  /** Whether patient is deceased */
  isDeceased?: boolean;

  /** Social Security Number (encrypted) */
  ssn?: string;

  /** Photo URL */
  photoUrl?: string;
}

/**
 * Patient contact information
 *
 * @example
 * ```typescript
 * const contact: PatientContact = {
 *   patientId: 'PAT-123',
 *   addresses: [{
 *     line1: '123 Main St',
 *     city: 'Boston',
 *     state: 'MA',
 *     postalCode: '02101',
 *     country: 'USA'
 *   }],
 *   phoneNumbers: [{
 *     number: '+1-617-555-0123',
 *     type: 'mobile',
 *     isPrimary: true
 *   }],
 *   emails: [{
 *     address: 'john@example.com',
 *     type: 'personal',
 *     isPrimary: true
 *   }]
 * };
 * ```
 */
export interface PatientContact {
  /** Patient ID */
  patientId: string;

  /** Addresses */
  addresses: Address[];

  /** Phone numbers */
  phoneNumbers: PhoneNumber[];

  /** Email addresses */
  emails: Email[];

  /** Communication preferences */
  communicationPreferences?: CommunicationPreferences;
}

/**
 * Emergency contact information
 *
 * @example
 * ```typescript
 * const emergencyContact: EmergencyContact = {
 *   name: 'Jane Doe',
 *   relationship: 'spouse',
 *   phoneNumber: '+1-617-555-0124',
 *   isPrimary: true
 * };
 * ```
 */
export interface EmergencyContact {
  /** Contact's full name */
  name: string;

  /** Relationship to patient */
  relationship: string;

  /** Phone number */
  phoneNumber: string;

  /** Email address */
  email?: string;

  /** Address */
  address?: Address;

  /** Whether this is the primary emergency contact */
  isPrimary: boolean;

  /** Order of contact (1 = first, 2 = second, etc.) */
  contactOrder?: number;

  /** Additional notes */
  notes?: string;
}

/**
 * Patient insurance information
 *
 * @example
 * ```typescript
 * const insurance: PatientInsurance = {
 *   insuranceId: 'INS-123',
 *   patientId: 'PAT-456',
 *   payerName: 'Blue Cross Blue Shield',
 *   policyNumber: 'POL-789',
 *   groupNumber: 'GRP-012',
 *   coverageType: 'primary',
 *   effectiveDate: new Date('2025-01-01'),
 *   status: 'active'
 * };
 * ```
 */
export interface PatientInsurance {
  /** Insurance record ID */
  insuranceId: string;

  /** Patient ID */
  patientId: string;

  /** Payer/insurance company name */
  payerName: string;

  /** Payer ID */
  payerId?: string;

  /** Policy/member ID number */
  policyNumber: string;

  /** Group number */
  groupNumber?: string;

  /** Coverage type */
  coverageType: 'primary' | 'secondary' | 'tertiary';

  /** Plan name */
  planName?: string;

  /** Subscriber's relationship to patient */
  subscriberRelationship?: 'self' | 'spouse' | 'child' | 'other';

  /** Subscriber information (if not self) */
  subscriber?: {
    name: string;
    dateOfBirth: Date;
    address?: Address;
  };

  /** Effective date */
  effectiveDate: Date;

  /** Termination date */
  terminationDate?: Date;

  /** Coverage status */
  status: EntityStatus;

  /** Co-pay amount */
  copayAmount?: number;

  /** Deductible amount */
  deductible?: number;

  /** Deductible remaining */
  deductibleRemaining?: number;

  /** Out-of-pocket maximum */
  outOfPocketMax?: number;

  /** Out-of-pocket remaining */
  outOfPocketRemaining?: number;

  /** Last verification date */
  lastVerificationDate?: Date;

  /** Verification status */
  verificationStatus?: 'verified' | 'pending' | 'failed' | 'expired';
}

/**
 * Patient allergy information
 *
 * @example
 * ```typescript
 * const allergy: PatientAllergy = {
 *   allergyId: 'ALG-123',
 *   patientId: 'PAT-456',
 *   allergen: 'Penicillin',
 *   allergenType: 'medication',
 *   reaction: 'Hives and difficulty breathing',
 *   severity: 'severe',
 *   status: 'active',
 *   onsetDate: new Date('2020-03-15')
 * };
 * ```
 */
export interface PatientAllergy {
  /** Allergy record ID */
  allergyId: string;

  /** Patient ID */
  patientId: string;

  /** Allergen name */
  allergen: string;

  /** Allergen type */
  allergenType: 'medication' | 'food' | 'environmental' | 'other';

  /** Allergic reaction description */
  reaction: string;

  /** Severity level */
  severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';

  /** Current status */
  status: 'active' | 'inactive' | 'resolved';

  /** When the allergy was first identified */
  onsetDate?: Date;

  /** Who documented the allergy */
  documentedBy?: string;

  /** When it was documented */
  documentedDate?: Date;

  /** Additional notes */
  notes?: string;

  /** Related allergens (cross-sensitivities) */
  relatedAllergens?: string[];
}

/**
 * Patient medical history entry
 *
 * @example
 * ```typescript
 * const condition: MedicalHistoryEntry = {
 *   conditionId: 'COND-123',
 *   patientId: 'PAT-456',
 *   condition: 'Type 2 Diabetes Mellitus',
 *   icdCode: 'E11.9',
 *   onsetDate: new Date('2018-06-20'),
 *   status: 'active'
 * };
 * ```
 */
export interface MedicalHistoryEntry {
  /** Condition record ID */
  conditionId: string;

  /** Patient ID */
  patientId: string;

  /** Condition/diagnosis name */
  condition: string;

  /** ICD-10 code */
  icdCode?: string;

  /** SNOMED CT code */
  snomedCode?: string;

  /** When the condition started */
  onsetDate?: Date;

  /** When the condition resolved */
  resolutionDate?: Date;

  /** Current status */
  status: 'active' | 'inactive' | 'resolved' | 'remission';

  /** Severity */
  severity?: 'mild' | 'moderate' | 'severe';

  /** Who diagnosed the condition */
  diagnosedBy?: string;

  /** When it was diagnosed */
  diagnosedDate?: Date;

  /** Treatment notes */
  treatment?: string;

  /** Additional notes */
  notes?: string;

  /** Whether this is a chronic condition */
  isChronic?: boolean;
}

/**
 * Patient registration request data
 *
 * @example
 * ```typescript
 * const registration: PatientRegistrationRequest = {
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   dateOfBirth: new Date('1980-05-15'),
 *   gender: 'male',
 *   phoneNumber: '+1-617-555-0123',
 *   email: 'john@example.com'
 * };
 * ```
 */
export interface PatientRegistrationRequest {
  /** First name */
  firstName: string;

  /** Middle name */
  middleName?: string;

  /** Last name */
  lastName: string;

  /** Suffix */
  suffix?: string;

  /** Date of birth */
  dateOfBirth: Date;

  /** Gender */
  gender: Gender;

  /** Phone number */
  phoneNumber: string;

  /** Email address */
  email?: string;

  /** Address */
  address?: Address;

  /** SSN (encrypted) */
  ssn?: string;

  /** Emergency contact */
  emergencyContact?: EmergencyContact;

  /** Insurance information */
  insurance?: Partial<PatientInsurance>;

  /** Primary care provider */
  primaryCareProvider?: string;

  /** Referring physician */
  referringPhysician?: string;
}

/**
 * Patient registration result
 *
 * @example
 * ```typescript
 * const result: PatientRegistrationResult = {
 *   patientId: 'PAT-123456',
 *   mrn: 'MRN-789012',
 *   registeredDate: new Date(),
 *   status: 'active',
 *   portalAccessEnabled: true
 * };
 * ```
 */
export interface PatientRegistrationResult {
  /** Assigned patient ID */
  patientId: string;

  /** Assigned medical record number */
  mrn: string;

  /** When the patient was registered */
  registeredDate: Date;

  /** Account status */
  status: EntityStatus;

  /** Whether patient portal access is enabled */
  portalAccessEnabled: boolean;

  /** Portal activation link (if applicable) */
  portalActivationLink?: string;

  /** Any warnings during registration */
  warnings?: string[];
}

/**
 * Patient search criteria
 *
 * @example
 * ```typescript
 * const criteria: PatientSearchCriteria = {
 *   lastName: 'Doe',
 *   dateOfBirth: new Date('1980-05-15'),
 *   phoneNumber: '+1-617-555-0123'
 * };
 * ```
 */
export interface PatientSearchCriteria {
  /** Patient ID */
  patientId?: string;

  /** Medical record number */
  mrn?: string;

  /** First name */
  firstName?: string;

  /** Last name */
  lastName?: string;

  /** Date of birth */
  dateOfBirth?: Date;

  /** Phone number */
  phoneNumber?: string;

  /** Email */
  email?: string;

  /** SSN (last 4 digits) */
  ssnLast4?: string;

  /** Gender */
  gender?: Gender;

  /** Minimum age */
  minAge?: number;

  /** Maximum age */
  maxAge?: number;

  /** Status */
  status?: EntityStatus;
}

/**
 * Patient search result
 *
 * @example
 * ```typescript
 * const results: PatientSearchResult = {
 *   patientId: 'PAT-123',
 *   mrn: 'MRN-456',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   dateOfBirth: new Date('1980-05-15'),
 *   gender: 'male',
 *   matchScore: 95
 * };
 * ```
 */
export interface PatientSearchResult {
  /** Patient ID */
  patientId: string;

  /** Medical record number */
  mrn: string;

  /** First name */
  firstName: string;

  /** Last name */
  lastName: string;

  /** Date of birth */
  dateOfBirth: Date;

  /** Age */
  age: number;

  /** Gender */
  gender: Gender;

  /** Phone number */
  phoneNumber?: string;

  /** Email */
  email?: string;

  /** Address (first line only for privacy) */
  addressLine1?: string;

  /** City */
  city?: string;

  /** State */
  state?: string;

  /** Last visit date */
  lastVisitDate?: Date;

  /** Match score (0-100) for fuzzy searches */
  matchScore?: number;

  /** Patient status */
  status: EntityStatus;
}

/**
 * Patient vital signs
 *
 * @example
 * ```typescript
 * const vitals: PatientVitals = {
 *   patientId: 'PAT-123',
 *   recordedDate: new Date(),
 *   bloodPressureSystolic: 120,
 *   bloodPressureDiastolic: 80,
 *   heartRate: 72,
 *   temperature: 98.6,
 *   respiratoryRate: 16,
 *   oxygenSaturation: 98
 * };
 * ```
 */
export interface PatientVitals {
  /** Patient ID */
  patientId: string;

  /** When vitals were recorded */
  recordedDate: Date;

  /** Systolic blood pressure (mmHg) */
  bloodPressureSystolic?: number;

  /** Diastolic blood pressure (mmHg) */
  bloodPressureDiastolic?: number;

  /** Heart rate (beats per minute) */
  heartRate?: number;

  /** Temperature (Fahrenheit) */
  temperature?: number;

  /** Temperature method (oral, tympanic, rectal, axillary) */
  temperatureMethod?: 'oral' | 'tympanic' | 'rectal' | 'axillary';

  /** Respiratory rate (breaths per minute) */
  respiratoryRate?: number;

  /** Oxygen saturation (percentage) */
  oxygenSaturation?: number;

  /** Weight (pounds or kilograms) */
  weight?: number;

  /** Weight unit */
  weightUnit?: 'lb' | 'kg';

  /** Height (inches or centimeters) */
  height?: number;

  /** Height unit */
  heightUnit?: 'in' | 'cm';

  /** BMI (calculated) */
  bmi?: number;

  /** Pain level (0-10 scale) */
  painLevel?: number;

  /** Who recorded the vitals */
  recordedBy?: string;

  /** Additional notes */
  notes?: string;
}
