/**
 * PHI (Protected Health Information) Constants
 *
 * Constants, patterns, and field names for PHI detection.
 *
 * @module lib/phi-constants
 */

import type { PHIPatternType } from './phi-types';

/**
 * Common PHI field names (semantic detection)
 *
 * These field names typically contain PHI regardless of content.
 */
export const PHI_FIELD_NAMES = new Set([
  // Personal identifiers
  'ssn',
  'socialSecurityNumber',
  'social_security_number',
  'dateOfBirth',
  'dob',
  'date_of_birth',
  'birthDate',
  'birth_date',
  'patientId',
  'patient_id',
  'medicalRecordNumber',
  'medical_record_number',
  'mrn',
  'healthRecordNumber',
  'health_record_number',

  // Contact information
  'email',
  'emailAddress',
  'email_address',
  'phoneNumber',
  'phone_number',
  'phone',
  'mobilePhone',
  'mobile_phone',
  'homePhone',
  'home_phone',
  'address',
  'streetAddress',
  'street_address',
  'homeAddress',
  'home_address',
  'mailingAddress',
  'mailing_address',
  'zip',
  'zipCode',
  'zip_code',
  'postalCode',
  'postal_code',

  // Medical information
  'diagnosis',
  'diagnoses',
  'condition',
  'conditions',
  'medication',
  'medications',
  'prescription',
  'prescriptions',
  'treatment',
  'treatments',
  'procedure',
  'procedures',
  'allergy',
  'allergies',
  'immunization',
  'immunizations',
  'vaccination',
  'vaccinations',
  'labResult',
  'lab_result',
  'testResult',
  'test_result',
  'vitalSigns',
  'vital_signs',
  'bloodPressure',
  'blood_pressure',
  'heartRate',
  'heart_rate',
  'temperature',
  'weight',
  'height',
  'bmi',

  // Insurance and financial
  'insuranceNumber',
  'insurance_number',
  'policyNumber',
  'policy_number',
  'subscriberId',
  'subscriber_id',
  'groupNumber',
  'group_number',
  'memberId',
  'member_id',

  // Healthcare provider information
  'providerId',
  'provider_id',
  'npi',
  'licenseNumber',
  'license_number',
  'deaNumber',
  'dea_number',

  // Sensitive notes and observations
  'clinicalNotes',
  'clinical_notes',
  'progressNotes',
  'progress_notes',
  'nurseNotes',
  'nurse_notes',
  'observations',
  'symptoms',
  'complaint',
  'chiefComplaint',
  'chief_complaint',
]);

/**
 * Regex patterns for PHI detection
 */
export const PHI_PATTERNS: Record<PHIPatternType, RegExp> = {
  // SSN: 123-45-6789 or 123456789
  ssn: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,

  // Date of birth: MM/DD/YYYY, MM-DD-YYYY, YYYY-MM-DD
  dob: /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b|\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b/g,

  // Phone: (123) 456-7890, 123-456-7890, 1234567890
  phone: /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,

  // Email: user@example.com
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,

  // Address: Basic pattern for street addresses
  address: /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Circle|Cir)\b/gi,

  // Medical Record Number: MRN followed by digits
  mrn: /\b(MRN|mrn|medical\s*record\s*number|medical\s*record\s*#)\s*:?\s*\d+\b/gi,

  // Credit card: 1234-5678-9012-3456 or 1234567890123456
  'credit-card': /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,

  // Bank account: 8-17 digits
  'bank-account': /\b\d{8,17}\b/g,

  // Driver's license (generic pattern)
  license: /\b[A-Z]{1,2}\d{5,8}\b/g,

  // Medical terms (partial list)
  'medical-term': /\b(diabetes|hypertension|asthma|cancer|heart\s*disease|pneumonia|flu|covid|infection|fever|pain|injury|fracture|sprain|concussion)\b/gi,

  // Custom pattern (placeholder)
  custom: /CUSTOM_PATTERN/g,
};

/**
 * Medical terminology keywords
 */
export const MEDICAL_KEYWORDS = new Set([
  'diagnosis',
  'diagnosed',
  'treatment',
  'treated',
  'medication',
  'prescribed',
  'surgery',
  'procedure',
  'condition',
  'disease',
  'illness',
  'injury',
  'symptom',
  'pain',
  'fever',
  'infection',
  'allergy',
  'allergic',
  'vaccine',
  'immunization',
  'hospital',
  'emergency',
  'admitted',
  'discharged',
  'patient',
  'doctor',
  'physician',
  'nurse',
  'healthcare',
  'medical',
  'clinical',
]);
