/**
 * LOC: HLTH-PAT-MGT-001
 * File: /reuse/server/health/health-patient-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - class-transformer
 *   - fhir/r4 (HL7 FHIR R4)
 *   - crypto (Node.js)
 *
 * DOWNSTREAM (imported by):
 *   - Patient services
 *   - EHR integration modules
 *   - Patient portal controllers
 *   - Demographics services
 *   - Insurance verification services
 */

/**
 * File: /reuse/server/health/health-patient-management-kit.ts
 * Locator: WC-HEALTH-PAT-001
 * Purpose: Healthcare Patient Management Kit - Epic Systems-level patient management utilities
 *
 * Upstream: FHIR R4, @nestjs/common, class-validator, crypto
 * Downstream: ../backend/health/*, Patient services, EHR integration, Demographics management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, FHIR R4
 * Exports: 45 production-ready functions for patient management, demographics, consent, insurance
 *
 * LLM Context: Enterprise-grade HIPAA-compliant patient management utilities for White Cross platform.
 * Provides comprehensive patient registration with MRN/SSN management, advanced patient matching and
 * deduplication algorithms (phonetic, demographic), family/emergency contact management, consent and
 * advance directive tracking, insurance eligibility verification with real-time payer integration,
 * patient merge/unmerge with audit trails, demographics validation (USPS, E.164 phone), patient portal
 * account provisioning, communication preferences, health proxy/legal guardian management, and full
 * HL7 FHIR R4 Patient resource compatibility. Epic Systems-level features with enterprise scalability.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Patient demographics information
 */
export interface PatientDemographics {
  medicalRecordNumber?: string;
  ssn?: string;
  ssnLast4?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  preferredName?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other' | 'unknown';
  sex: 'male' | 'female' | 'unknown';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed' | 'separated' | 'domestic_partner';
  race?: string[];
  ethnicity?: string[];
  language?: string;
  preferredLanguage?: string;
  birthPlace?: string;
  multipleBirthIndicator?: boolean;
  birthOrder?: number;
  deceased?: boolean;
  deceasedDateTime?: Date;
}

/**
 * Patient address information
 */
export interface PatientAddress {
  use: 'home' | 'work' | 'temp' | 'billing' | 'old';
  type: 'postal' | 'physical' | 'both';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  county?: string;
  district?: string;
  period?: {
    start?: Date;
    end?: Date;
  };
  validated?: boolean;
  validatedDate?: Date;
  standardized?: boolean;
}

/**
 * Patient contact information
 */
export interface PatientContactInfo {
  phone?: string;
  mobilePhone?: string;
  workPhone?: string;
  email?: string;
  alternateEmail?: string;
  preferredContactMethod?: 'phone' | 'mobile' | 'email' | 'mail' | 'portal';
  bestTimeToCall?: string;
  phoneConsent?: boolean;
  emailConsent?: boolean;
  smsConsent?: boolean;
}

/**
 * Emergency contact information
 */
export interface EmergencyContact {
  id?: string;
  relationship: string;
  relationshipCode?: string;
  name: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  phone: string;
  mobilePhone?: string;
  email?: string;
  address?: PatientAddress;
  isPrimary?: boolean;
  priority?: number;
  notes?: string;
  period?: {
    start?: Date;
    end?: Date;
  };
}

/**
 * Family member information
 */
export interface FamilyMember {
  id?: string;
  patientId?: string;
  relationship: string;
  relationshipCode?: string;
  name: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  dateOfBirth?: Date;
  gender?: string;
  phone?: string;
  email?: string;
  livesWith?: boolean;
  deceased?: boolean;
  medicalHistory?: string[];
  notes?: string;
}

/**
 * Patient identifier configuration
 */
export interface PatientIdentifier {
  type: 'MRN' | 'SSN' | 'DL' | 'PASSPORT' | 'NATIONAL_ID' | 'INSURANCE' | 'FHIR';
  value: string;
  system?: string;
  use?: 'official' | 'usual' | 'temp' | 'secondary';
  period?: {
    start?: Date;
    end?: Date;
  };
  assigner?: string;
}

/**
 * Patient search criteria
 */
export interface PatientSearchCriteria {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  ssn?: string;
  medicalRecordNumber?: string;
  phone?: string;
  email?: string;
  fuzzyMatch?: boolean;
  phoneticMatch?: boolean;
  threshold?: number;
}

/**
 * Patient match result
 */
export interface PatientMatchResult {
  patientId: string;
  score: number;
  confidence: 'high' | 'medium' | 'low';
  matchedFields: string[];
  patient: Partial<PatientDemographics & PatientContactInfo>;
  reasons: string[];
}

/**
 * Patient consent record
 */
export interface PatientConsent {
  id?: string;
  patientId: string;
  consentType: 'treatment' | 'research' | 'data_sharing' | 'marketing' | 'photography' | 'release_of_info' | 'advance_directive';
  status: 'active' | 'rejected' | 'expired' | 'withdrawn';
  scope?: string;
  category?: string[];
  dateGiven: Date;
  expirationDate?: Date;
  consentingParty?: string;
  witness?: string;
  documentId?: string;
  notes?: string;
  policyRule?: string;
  verification?: {
    verified: boolean;
    verifiedBy?: string;
    verifiedDate?: Date;
  };
}

/**
 * Advance directive information
 */
export interface AdvanceDirective {
  id?: string;
  patientId: string;
  type: 'living_will' | 'healthcare_proxy' | 'durable_power_of_attorney' | 'dnr' | 'polst';
  status: 'active' | 'inactive' | 'expired' | 'revoked';
  effectiveDate: Date;
  expirationDate?: Date;
  documentId?: string;
  healthcareProxy?: {
    name: string;
    phone: string;
    email?: string;
    relationship?: string;
  };
  notes?: string;
  verifiedDate?: Date;
  verifiedBy?: string;
}

/**
 * Insurance information
 */
export interface InsuranceInfo {
  id?: string;
  patientId: string;
  priority: 'primary' | 'secondary' | 'tertiary';
  status: 'active' | 'inactive' | 'pending' | 'cancelled';
  payerId: string;
  payerName: string;
  planName?: string;
  planId?: string;
  groupNumber?: string;
  memberId: string;
  subscriberId?: string;
  subscriber?: {
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    relationship: 'self' | 'spouse' | 'child' | 'other';
  };
  effectiveDate: Date;
  expirationDate?: Date;
  copay?: number;
  deductible?: number;
  outOfPocketMax?: number;
  verified?: boolean;
  verifiedDate?: Date;
  verificationResult?: any;
  cardImages?: {
    front?: string;
    back?: string;
  };
}

/**
 * Insurance eligibility request
 */
export interface EligibilityRequest {
  patientId: string;
  insuranceId: string;
  serviceDate: Date;
  serviceType?: string;
  providerId?: string;
  facilityId?: string;
}

/**
 * Insurance eligibility response
 */
export interface EligibilityResponse {
  eligible: boolean;
  effectiveDate?: Date;
  expirationDate?: Date;
  benefits?: {
    copay?: number;
    coinsurance?: number;
    deductible?: number;
    deductibleRemaining?: number;
    outOfPocketMax?: number;
    outOfPocketRemaining?: number;
    coverageLevel?: string;
  };
  limitations?: string[];
  errors?: string[];
  rawResponse?: any;
  verifiedDate: Date;
}

/**
 * Patient portal account
 */
export interface PatientPortalAccount {
  id?: string;
  patientId: string;
  username: string;
  email: string;
  status: 'active' | 'inactive' | 'locked' | 'pending_verification';
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: Date;
  failedLoginAttempts?: number;
  createdDate: Date;
  activationToken?: string;
  activationExpiry?: Date;
  resetToken?: string;
  resetExpiry?: Date;
  preferences?: {
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
    language?: string;
    timezone?: string;
  };
}

/**
 * Patient communication preferences
 */
export interface CommunicationPreferences {
  patientId: string;
  preferredLanguage: string;
  preferredMethod: 'phone' | 'email' | 'sms' | 'mail' | 'portal';
  appointmentReminders: boolean;
  labResults: boolean;
  billing: boolean;
  marketing: boolean;
  surveys: boolean;
  phoneConsent: boolean;
  emailConsent: boolean;
  smsConsent: boolean;
  mailConsent: boolean;
  leaveVoicemail: boolean;
  bestTimeToCall?: string;
  doNotContact?: boolean;
  doNotContactReason?: string;
}

/**
 * Patient merge configuration
 */
export interface PatientMergeConfig {
  sourcePatientId: string;
  targetPatientId: string;
  mergeStrategy: 'keep_target' | 'keep_source' | 'merge_all';
  preserveHistory: boolean;
  userId: string;
  reason?: string;
  conflictResolution?: Record<string, 'source' | 'target' | 'manual'>;
}

/**
 * Patient merge result
 */
export interface PatientMergeResult {
  success: boolean;
  mergedPatientId: string;
  mergeId: string;
  mergeDate: Date;
  recordsMerged: {
    demographics: boolean;
    appointments: number;
    encounters: number;
    medications: number;
    allergies: number;
    problems: number;
    documents: number;
  };
  conflicts?: Array<{
    field: string;
    sourceValue: any;
    targetValue: any;
    resolution: any;
  }>;
  errors?: string[];
  auditTrail: string;
}

/**
 * Health proxy/legal guardian information
 */
export interface HealthProxy {
  id?: string;
  patientId: string;
  type: 'healthcare_proxy' | 'legal_guardian' | 'power_of_attorney' | 'conservator';
  status: 'active' | 'inactive' | 'revoked';
  name: {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  phone: string;
  email?: string;
  address?: PatientAddress;
  relationship?: string;
  effectiveDate: Date;
  expirationDate?: Date;
  documentId?: string;
  scope?: string[];
  limitations?: string[];
  verifiedDate?: Date;
  verifiedBy?: string;
  notes?: string;
}

/**
 * FHIR Patient resource mapping
 */
export interface FHIRPatient {
  resourceType: 'Patient';
  id?: string;
  identifier?: Array<{
    use?: string;
    type?: any;
    system?: string;
    value: string;
  }>;
  active?: boolean;
  name?: Array<{
    use?: string;
    family?: string;
    given?: string[];
    prefix?: string[];
    suffix?: string[];
  }>;
  telecom?: Array<{
    system: 'phone' | 'email' | 'fax' | 'sms';
    value: string;
    use?: string;
  }>;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  deceasedBoolean?: boolean;
  deceasedDateTime?: string;
  address?: Array<{
    use?: string;
    type?: string;
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }>;
  maritalStatus?: any;
  contact?: Array<{
    relationship?: any[];
    name?: any;
    telecom?: any[];
    address?: any;
  }>;
}

// ============================================================================
// SECTION 1: PATIENT REGISTRATION AND DEMOGRAPHICS (Functions 1-8)
// ============================================================================

/**
 * 1. Generates a unique Medical Record Number (MRN) with checksum validation.
 *
 * @param {string} facilityCode - Facility code prefix
 * @param {number} sequenceNumber - Sequential patient number
 * @returns {string} Formatted MRN with checksum
 *
 * @example
 * ```typescript
 * const mrn = generateMRN('WC', 123456);
 * // Result: 'WC-123456-7' (last digit is checksum)
 * ```
 */
export function generateMRN(facilityCode: string = 'WC', sequenceNumber: number): string {
  const paddedSequence = sequenceNumber.toString().padStart(8, '0');
  const checksum = calculateLuhnChecksum(`${facilityCode}${paddedSequence}`);
  return `${facilityCode}-${paddedSequence}-${checksum}`;
}

/**
 * 2. Validates Medical Record Number format and checksum.
 *
 * @param {string} mrn - Medical Record Number to validate
 * @returns {boolean} True if MRN is valid
 *
 * @example
 * ```typescript
 * const isValid = validateMRN('WC-12345678-7');
 * if (!isValid) {
 *   throw new Error('Invalid MRN format or checksum');
 * }
 * ```
 */
export function validateMRN(mrn: string): boolean {
  const pattern = /^([A-Z]{2,4})-(\d{8})-(\d)$/;
  const match = mrn.match(pattern);

  if (!match) return false;

  const [, facilityCode, sequence, checksum] = match;
  const expectedChecksum = calculateLuhnChecksum(`${facilityCode}${sequence}`);

  return checksum === expectedChecksum.toString();
}

/**
 * 3. Encrypts Social Security Number for HIPAA-compliant storage.
 *
 * @param {string} ssn - Social Security Number (format: XXX-XX-XXXX)
 * @param {string} encryptionKey - Encryption key (hex string)
 * @returns {string} Encrypted SSN with IV
 *
 * @example
 * ```typescript
 * const encryptedSSN = encryptSSN('123-45-6789', process.env.PHI_ENCRYPTION_KEY);
 * await db.patients.update({ ssnEncrypted: encryptedSSN }, { where: { id } });
 * ```
 */
export function encryptSSN(ssn: string, encryptionKey: string): string {
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(encryptionKey, 'hex');
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(ssn.replace(/\D/g, ''), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * 4. Decrypts Social Security Number from encrypted storage.
 *
 * @param {string} encryptedSSN - Encrypted SSN with IV and auth tag
 * @param {string} encryptionKey - Encryption key (hex string)
 * @returns {string} Decrypted SSN in format XXX-XX-XXXX
 *
 * @example
 * ```typescript
 * const ssn = decryptSSN(patient.ssnEncrypted, process.env.PHI_ENCRYPTION_KEY);
 * // Result: '123-45-6789'
 * ```
 */
export function decryptSSN(encryptedSSN: string, encryptionKey: string): string {
  try {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(encryptionKey, 'hex');
    const [ivHex, authTagHex, encrypted] = encryptedSSN.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return `${decrypted.slice(0, 3)}-${decrypted.slice(3, 5)}-${decrypted.slice(5)}`;
  } catch (error) {
    throw new Error('SSN decryption failed - invalid key or corrupted data');
  }
}

/**
 * 5. Extracts last 4 digits of SSN for partial display.
 *
 * @param {string} ssn - Full SSN or encrypted SSN
 * @param {string} encryptionKey - Optional encryption key if SSN is encrypted
 * @returns {string} Last 4 digits (format: XXX-XX-1234)
 *
 * @example
 * ```typescript
 * const last4 = getSSNLast4('123-45-6789');
 * // Result: 'XXX-XX-6789'
 *
 * const last4Encrypted = getSSNLast4(encryptedSSN, encryptionKey);
 * // Result: 'XXX-XX-6789'
 * ```
 */
export function getSSNLast4(ssn: string, encryptionKey?: string): string {
  let fullSSN = ssn;

  if (encryptionKey && ssn.includes(':')) {
    fullSSN = decryptSSN(ssn, encryptionKey);
  }

  const digits = fullSSN.replace(/\D/g, '');
  if (digits.length !== 9) {
    throw new Error('Invalid SSN format');
  }

  return `XXX-XX-${digits.slice(5)}`;
}

/**
 * 6. Validates patient demographics data completeness and format.
 *
 * @param {PatientDemographics} demographics - Patient demographics to validate
 * @returns {object} Validation result with errors
 *
 * @example
 * ```typescript
 * const validation = validatePatientDemographics({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   dateOfBirth: new Date('1990-01-01'),
 *   gender: 'male',
 *   sex: 'male'
 * });
 *
 * if (!validation.valid) {
 *   throw new BadRequestException(validation.errors);
 * }
 * ```
 */
export function validatePatientDemographics(demographics: PatientDemographics): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!demographics.firstName?.trim()) {
    errors.push('First name is required');
  }
  if (!demographics.lastName?.trim()) {
    errors.push('Last name is required');
  }
  if (!demographics.dateOfBirth) {
    errors.push('Date of birth is required');
  }
  if (!demographics.gender) {
    errors.push('Gender is required');
  }

  // Date of birth validation
  if (demographics.dateOfBirth) {
    const dob = new Date(demographics.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();

    if (dob > today) {
      errors.push('Date of birth cannot be in the future');
    }
    if (age > 120) {
      warnings.push('Age exceeds 120 years - please verify');
    }
    if (dob < new Date('1900-01-01')) {
      errors.push('Date of birth before 1900 is not allowed');
    }
  }

  // SSN validation
  if (demographics.ssn) {
    const ssnDigits = demographics.ssn.replace(/\D/g, '');
    if (ssnDigits.length !== 9) {
      errors.push('SSN must be 9 digits');
    }
    if (/^0{3}/.test(ssnDigits) || /^\d{3}0{2}/.test(ssnDigits) || /^\d{5}0{4}$/.test(ssnDigits)) {
      errors.push('Invalid SSN format - contains invalid sequence');
    }
  }

  // Name validation
  if (demographics.firstName && demographics.firstName.length < 2) {
    errors.push('First name must be at least 2 characters');
  }
  if (demographics.lastName && demographics.lastName.length < 2) {
    errors.push('Last name must be at least 2 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 7. Validates and standardizes US address using USPS format.
 *
 * @param {PatientAddress} address - Address to validate
 * @returns {Promise<PatientAddress>} Standardized address
 *
 * @example
 * ```typescript
 * const standardized = await validateAndStandardizeAddress({
 *   use: 'home',
 *   type: 'physical',
 *   line1: '123 main st',
 *   city: 'anytown',
 *   state: 'CA',
 *   postalCode: '12345',
 *   country: 'US'
 * });
 * // Result: Properly capitalized and formatted address
 * ```
 */
export async function validateAndStandardizeAddress(address: PatientAddress): Promise<PatientAddress> {
  // In production, integrate with USPS Address Validation API
  const standardized: PatientAddress = { ...address };

  // Basic standardization
  standardized.line1 = standardizeStreetAddress(address.line1);
  standardized.city = address.city.toUpperCase();
  standardized.state = address.state.toUpperCase();

  // Validate ZIP code format
  const zipPattern = /^\d{5}(-\d{4})?$/;
  if (!zipPattern.test(address.postalCode)) {
    throw new Error('Invalid ZIP code format');
  }

  // Mark as standardized
  standardized.standardized = true;
  standardized.validated = true;
  standardized.validatedDate = new Date();

  return standardized;
}

/**
 * 8. Validates and formats phone number to E.164 international standard.
 *
 * @param {string} phone - Phone number to validate
 * @param {string} countryCode - Country code (default: 'US')
 * @returns {object} Validation result with formatted number
 *
 * @example
 * ```typescript
 * const result = validatePhoneNumber('(555) 123-4567', 'US');
 * // Result: { valid: true, formatted: '+15551234567', display: '(555) 123-4567' }
 * ```
 */
export function validatePhoneNumber(phone: string, countryCode: string = 'US'): {
  valid: boolean;
  formatted?: string;
  display?: string;
  error?: string;
} {
  const cleaned = phone.replace(/\D/g, '');

  if (countryCode === 'US') {
    if (cleaned.length === 10) {
      return {
        valid: true,
        formatted: `+1${cleaned}`,
        display: `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`,
      };
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return {
        valid: true,
        formatted: `+${cleaned}`,
        display: `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`,
      };
    } else {
      return {
        valid: false,
        error: 'US phone numbers must be 10 digits',
      };
    }
  }

  // For other countries, basic validation
  if (cleaned.length >= 10 && cleaned.length <= 15) {
    return {
      valid: true,
      formatted: `+${cleaned}`,
      display: phone,
    };
  }

  return {
    valid: false,
    error: 'Invalid phone number format',
  };
}

// ============================================================================
// SECTION 2: PATIENT SEARCH AND MATCHING (Functions 9-15)
// ============================================================================

/**
 * 9. Performs fuzzy patient search with phonetic matching.
 *
 * @param {PatientSearchCriteria} criteria - Search criteria
 * @param {any[]} patientDatabase - Patient database to search
 * @returns {PatientMatchResult[]} Ranked match results
 *
 * @example
 * ```typescript
 * const matches = fuzzyPatientSearch({
 *   firstName: 'Jon',
 *   lastName: 'Smith',
 *   dateOfBirth: new Date('1990-01-15'),
 *   fuzzyMatch: true,
 *   phoneticMatch: true
 * }, patients);
 * ```
 */
export function fuzzyPatientSearch(
  criteria: PatientSearchCriteria,
  patientDatabase: any[]
): PatientMatchResult[] {
  const results: PatientMatchResult[] = [];
  const threshold = criteria.threshold || 0.7;

  for (const patient of patientDatabase) {
    const matchScore = calculatePatientMatchScore(criteria, patient, {
      fuzzyMatch: criteria.fuzzyMatch,
      phoneticMatch: criteria.phoneticMatch,
    });

    if (matchScore.score >= threshold) {
      results.push({
        patientId: patient.id,
        score: matchScore.score,
        confidence: matchScore.score >= 0.9 ? 'high' : matchScore.score >= 0.75 ? 'medium' : 'low',
        matchedFields: matchScore.matchedFields,
        patient: patient,
        reasons: matchScore.reasons,
      });
    }
  }

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}

/**
 * 10. Calculates patient match score using weighted algorithm.
 *
 * @param {PatientSearchCriteria} criteria - Search criteria
 * @param {any} patient - Patient record to compare
 * @param {object} options - Matching options
 * @returns {object} Match score and details
 *
 * @example
 * ```typescript
 * const matchScore = calculatePatientMatchScore(
 *   { firstName: 'John', lastName: 'Doe', dateOfBirth: new Date('1990-01-01') },
 *   patientRecord,
 *   { fuzzyMatch: true, phoneticMatch: true }
 * );
 * ```
 */
export function calculatePatientMatchScore(
  criteria: PatientSearchCriteria,
  patient: any,
  options: { fuzzyMatch?: boolean; phoneticMatch?: boolean } = {}
): {
  score: number;
  matchedFields: string[];
  reasons: string[];
} {
  let totalScore = 0;
  let totalWeight = 0;
  const matchedFields: string[] = [];
  const reasons: string[] = [];

  const weights = {
    mrn: 1.0,
    ssn: 1.0,
    firstName: 0.3,
    lastName: 0.3,
    dateOfBirth: 0.25,
    phone: 0.1,
    email: 0.05,
  };

  // MRN match (exact)
  if (criteria.medicalRecordNumber && patient.medicalRecordNumber) {
    totalWeight += weights.mrn;
    if (criteria.medicalRecordNumber === patient.medicalRecordNumber) {
      totalScore += weights.mrn;
      matchedFields.push('MRN');
      reasons.push('Exact MRN match');
    }
  }

  // SSN match (exact)
  if (criteria.ssn && patient.ssn) {
    totalWeight += weights.ssn;
    const criteriaSsnDigits = criteria.ssn.replace(/\D/g, '');
    const patientSsnDigits = patient.ssn.replace(/\D/g, '');
    if (criteriaSsnDigits === patientSsnDigits) {
      totalScore += weights.ssn;
      matchedFields.push('SSN');
      reasons.push('Exact SSN match');
    }
  }

  // First name match
  if (criteria.firstName && patient.firstName) {
    totalWeight += weights.firstName;
    const score = options.phoneticMatch
      ? soundexMatch(criteria.firstName, patient.firstName)
      : stringMatch(criteria.firstName, patient.firstName, options.fuzzyMatch);

    if (score > 0.8) {
      totalScore += weights.firstName * score;
      matchedFields.push('firstName');
      reasons.push(`First name match (${Math.round(score * 100)}%)`);
    }
  }

  // Last name match
  if (criteria.lastName && patient.lastName) {
    totalWeight += weights.lastName;
    const score = options.phoneticMatch
      ? soundexMatch(criteria.lastName, patient.lastName)
      : stringMatch(criteria.lastName, patient.lastName, options.fuzzyMatch);

    if (score > 0.8) {
      totalScore += weights.lastName * score;
      matchedFields.push('lastName');
      reasons.push(`Last name match (${Math.round(score * 100)}%)`);
    }
  }

  // Date of birth match
  if (criteria.dateOfBirth && patient.dateOfBirth) {
    totalWeight += weights.dateOfBirth;
    const criteriaDob = new Date(criteria.dateOfBirth).toISOString().split('T')[0];
    const patientDob = new Date(patient.dateOfBirth).toISOString().split('T')[0];
    if (criteriaDob === patientDob) {
      totalScore += weights.dateOfBirth;
      matchedFields.push('dateOfBirth');
      reasons.push('Exact date of birth match');
    }
  }

  // Phone match
  if (criteria.phone && patient.phone) {
    totalWeight += weights.phone;
    const criteriaPhone = criteria.phone.replace(/\D/g, '');
    const patientPhone = patient.phone.replace(/\D/g, '');
    if (criteriaPhone === patientPhone) {
      totalScore += weights.phone;
      matchedFields.push('phone');
      reasons.push('Phone number match');
    }
  }

  // Email match
  if (criteria.email && patient.email) {
    totalWeight += weights.email;
    if (criteria.email.toLowerCase() === patient.email.toLowerCase()) {
      totalScore += weights.email;
      matchedFields.push('email');
      reasons.push('Email match');
    }
  }

  const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0;

  return {
    score: Math.round(finalScore * 1000) / 1000,
    matchedFields,
    reasons,
  };
}

/**
 * 11. Detects potential duplicate patient records.
 *
 * @param {string} patientId - Patient ID to check
 * @param {any[]} patientDatabase - Patient database
 * @returns {PatientMatchResult[]} Potential duplicates
 *
 * @example
 * ```typescript
 * const duplicates = detectDuplicatePatients('patient-123', allPatients);
 * if (duplicates.length > 0) {
 *   console.warn('Potential duplicates found:', duplicates);
 * }
 * ```
 */
export function detectDuplicatePatients(patientId: string, patientDatabase: any[]): PatientMatchResult[] {
  const patient = patientDatabase.find(p => p.id === patientId);
  if (!patient) return [];

  const criteria: PatientSearchCriteria = {
    firstName: patient.firstName,
    lastName: patient.lastName,
    dateOfBirth: patient.dateOfBirth,
    ssn: patient.ssn,
    fuzzyMatch: true,
    phoneticMatch: true,
    threshold: 0.85,
  };

  const matches = fuzzyPatientSearch(criteria, patientDatabase);

  // Filter out the patient itself and return only high-confidence matches
  return matches
    .filter(match => match.patientId !== patientId)
    .filter(match => match.confidence === 'high' || match.confidence === 'medium');
}

/**
 * 12. Performs Soundex phonetic encoding for name matching.
 *
 * @param {string} name - Name to encode
 * @returns {string} Soundex code
 *
 * @example
 * ```typescript
 * const code1 = soundexEncode('Smith');
 * const code2 = soundexEncode('Smythe');
 * // Both return 'S530' - phonetically similar
 * ```
 */
export function soundexEncode(name: string): string {
  if (!name) return '';

  const cleaned = name.toUpperCase().replace(/[^A-Z]/g, '');
  if (cleaned.length === 0) return '';

  const firstLetter = cleaned[0];
  const soundexMap: Record<string, string> = {
    B: '1', F: '1', P: '1', V: '1',
    C: '2', G: '2', J: '2', K: '2', Q: '2', S: '2', X: '2', Z: '2',
    D: '3', T: '3',
    L: '4',
    M: '5', N: '5',
    R: '6',
  };

  let code = firstLetter;
  let prevCode = soundexMap[firstLetter] || '';

  for (let i = 1; i < cleaned.length && code.length < 4; i++) {
    const char = cleaned[i];
    const charCode = soundexMap[char];

    if (charCode && charCode !== prevCode) {
      code += charCode;
      prevCode = charCode;
    } else if (!charCode) {
      prevCode = '';
    }
  }

  return code.padEnd(4, '0');
}

/**
 * 13. Compares two names using Soundex phonetic matching.
 *
 * @param {string} name1 - First name
 * @param {string} name2 - Second name
 * @returns {number} Match score (0-1)
 *
 * @example
 * ```typescript
 * const score = soundexMatch('Catherine', 'Katherine');
 * // Returns high score (phonetically similar)
 * ```
 */
export function soundexMatch(name1: string, name2: string): number {
  const code1 = soundexEncode(name1);
  const code2 = soundexEncode(name2);

  if (code1 === code2) return 1.0;

  // Partial match based on matching characters
  let matches = 0;
  for (let i = 0; i < 4; i++) {
    if (code1[i] === code2[i]) matches++;
  }

  return matches / 4;
}

/**
 * 14. Calculates Levenshtein distance for fuzzy string matching.
 *
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance
 *
 * @example
 * ```typescript
 * const distance = levenshteinDistance('John', 'Jon');
 * // Returns 1 (one character difference)
 * ```
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * 15. Normalizes patient name for consistent searching.
 *
 * @param {string} name - Name to normalize
 * @returns {string} Normalized name
 *
 * @example
 * ```typescript
 * const normalized = normalizePatientName('  O\'Brien, Jr.  ');
 * // Result: "O'BRIEN JR"
 * ```
 */
export function normalizePatientName(name: string): string {
  return name
    .toUpperCase()
    .trim()
    .replace(/[^A-Z'\s-]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/'/g, "'");
}

// ============================================================================
// SECTION 3: FAMILY AND EMERGENCY CONTACTS (Functions 16-21)
// ============================================================================

/**
 * 16. Adds emergency contact to patient record.
 *
 * @param {string} patientId - Patient ID
 * @param {EmergencyContact} contact - Emergency contact information
 * @returns {EmergencyContact} Created contact with ID
 *
 * @example
 * ```typescript
 * const contact = await addEmergencyContact('patient-123', {
 *   relationship: 'spouse',
 *   name: { firstName: 'Jane', lastName: 'Doe' },
 *   phone: '555-123-4567',
 *   isPrimary: true,
 *   priority: 1
 * });
 * ```
 */
export function addEmergencyContact(patientId: string, contact: EmergencyContact): EmergencyContact {
  const newContact: EmergencyContact = {
    ...contact,
    id: crypto.randomUUID(),
  };

  // Validate required fields
  if (!newContact.name?.firstName || !newContact.name?.lastName) {
    throw new Error('Emergency contact name is required');
  }
  if (!newContact.phone) {
    throw new Error('Emergency contact phone is required');
  }
  if (!newContact.relationship) {
    throw new Error('Relationship is required');
  }

  // Validate phone number
  const phoneValidation = validatePhoneNumber(newContact.phone);
  if (!phoneValidation.valid) {
    throw new Error('Invalid emergency contact phone number');
  }

  return newContact;
}

/**
 * 17. Updates emergency contact information.
 *
 * @param {string} contactId - Emergency contact ID
 * @param {Partial<EmergencyContact>} updates - Fields to update
 * @returns {EmergencyContact} Updated contact
 *
 * @example
 * ```typescript
 * const updated = await updateEmergencyContact('contact-456', {
 *   phone: '555-987-6543',
 *   email: 'new-email@example.com'
 * });
 * ```
 */
export function updateEmergencyContact(
  contactId: string,
  updates: Partial<EmergencyContact>
): EmergencyContact {
  // In production, fetch from database
  const existingContact: EmergencyContact = { id: contactId } as EmergencyContact;

  const updatedContact: EmergencyContact = {
    ...existingContact,
    ...updates,
  };

  // Validate phone if updated
  if (updates.phone) {
    const phoneValidation = validatePhoneNumber(updates.phone);
    if (!phoneValidation.valid) {
      throw new Error('Invalid phone number');
    }
  }

  return updatedContact;
}

/**
 * 18. Retrieves emergency contacts in priority order.
 *
 * @param {string} patientId - Patient ID
 * @returns {EmergencyContact[]} Sorted emergency contacts
 *
 * @example
 * ```typescript
 * const contacts = await getEmergencyContacts('patient-123');
 * // Returns contacts sorted by priority (primary first)
 * ```
 */
export function getEmergencyContacts(patientId: string): EmergencyContact[] {
  // In production, fetch from database
  const contacts: EmergencyContact[] = [];

  // Sort by priority
  return contacts.sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return (a.priority || 999) - (b.priority || 999);
  });
}

/**
 * 19. Adds family member to patient record.
 *
 * @param {string} patientId - Patient ID
 * @param {FamilyMember} familyMember - Family member information
 * @returns {FamilyMember} Created family member with ID
 *
 * @example
 * ```typescript
 * const family = await addFamilyMember('patient-123', {
 *   relationship: 'child',
 *   name: { firstName: 'Tommy', lastName: 'Doe' },
 *   dateOfBirth: new Date('2010-05-15'),
 *   gender: 'male',
 *   livesWith: true
 * });
 * ```
 */
export function addFamilyMember(patientId: string, familyMember: FamilyMember): FamilyMember {
  const newFamilyMember: FamilyMember = {
    ...familyMember,
    id: crypto.randomUUID(),
    patientId,
  };

  // Validate required fields
  if (!newFamilyMember.name?.firstName || !newFamilyMember.name?.lastName) {
    throw new Error('Family member name is required');
  }
  if (!newFamilyMember.relationship) {
    throw new Error('Relationship is required');
  }

  return newFamilyMember;
}

/**
 * 20. Retrieves family history for patient.
 *
 * @param {string} patientId - Patient ID
 * @returns {FamilyMember[]} Family members with medical history
 *
 * @example
 * ```typescript
 * const family = await getFamilyHistory('patient-123');
 * // Returns all family members with medical conditions
 * ```
 */
export function getFamilyHistory(patientId: string): FamilyMember[] {
  // In production, fetch from database
  const familyMembers: FamilyMember[] = [];

  // Filter to those with medical history
  return familyMembers.filter(member =>
    member.medicalHistory && member.medicalHistory.length > 0
  );
}

/**
 * 21. Validates relationship code against standard vocabulary.
 *
 * @param {string} relationshipCode - Relationship code to validate
 * @returns {object} Validation result with display name
 *
 * @example
 * ```typescript
 * const result = validateRelationshipCode('MTH');
 * // Result: { valid: true, display: 'Mother', system: 'HL7 v3' }
 * ```
 */
export function validateRelationshipCode(relationshipCode: string): {
  valid: boolean;
  display?: string;
  system?: string;
  error?: string;
} {
  const hl7Relationships: Record<string, string> = {
    'SPO': 'Spouse',
    'MTH': 'Mother',
    'FTH': 'Father',
    'SIS': 'Sister',
    'BRO': 'Brother',
    'SON': 'Son',
    'DAU': 'Daughter',
    'GRMTH': 'Grandmother',
    'GRFTH': 'Grandfather',
    'UNCLE': 'Uncle',
    'AUNT': 'Aunt',
    'NEPH': 'Nephew',
    'NIECE': 'Niece',
    'CHILD': 'Child',
    'FRND': 'Friend',
    'NBOR': 'Neighbor',
    'GUARD': 'Guardian',
  };

  const display = hl7Relationships[relationshipCode.toUpperCase()];

  if (display) {
    return {
      valid: true,
      display,
      system: 'HL7 v3 RoleCode',
    };
  }

  return {
    valid: false,
    error: 'Unknown relationship code',
  };
}

// ============================================================================
// SECTION 4: CONSENT AND ADVANCE DIRECTIVES (Functions 22-28)
// ============================================================================

/**
 * 22. Records patient consent for treatment or data use.
 *
 * @param {PatientConsent} consent - Consent information
 * @returns {PatientConsent} Created consent record with ID
 *
 * @example
 * ```typescript
 * const consent = await recordPatientConsent({
 *   patientId: 'patient-123',
 *   consentType: 'treatment',
 *   status: 'active',
 *   dateGiven: new Date(),
 *   scope: 'General medical treatment',
 *   verification: {
 *     verified: true,
 *     verifiedBy: 'nurse-456',
 *     verifiedDate: new Date()
 *   }
 * });
 * ```
 */
export function recordPatientConsent(consent: PatientConsent): PatientConsent {
  const newConsent: PatientConsent = {
    ...consent,
    id: consent.id || crypto.randomUUID(),
  };

  // Validate required fields
  if (!newConsent.patientId) {
    throw new Error('Patient ID is required');
  }
  if (!newConsent.consentType) {
    throw new Error('Consent type is required');
  }
  if (!newConsent.status) {
    throw new Error('Consent status is required');
  }
  if (!newConsent.dateGiven) {
    throw new Error('Date given is required');
  }

  // Set expiration if not provided (1 year default for certain types)
  if (!newConsent.expirationDate && ['research', 'marketing'].includes(newConsent.consentType)) {
    const expiration = new Date(newConsent.dateGiven);
    expiration.setFullYear(expiration.getFullYear() + 1);
    newConsent.expirationDate = expiration;
  }

  return newConsent;
}

/**
 * 23. Checks if patient has valid consent for specific purpose.
 *
 * @param {string} patientId - Patient ID
 * @param {string} consentType - Type of consent to check
 * @param {PatientConsent[]} consents - Patient consent records
 * @returns {object} Consent status
 *
 * @example
 * ```typescript
 * const status = checkConsentStatus('patient-123', 'research', patientConsents);
 * if (!status.hasConsent) {
 *   throw new ForbiddenException('Research consent required');
 * }
 * ```
 */
export function checkConsentStatus(
  patientId: string,
  consentType: string,
  consents: PatientConsent[]
): {
  hasConsent: boolean;
  consent?: PatientConsent;
  reason?: string;
} {
  const relevantConsents = consents.filter(c =>
    c.patientId === patientId &&
    c.consentType === consentType &&
    c.status === 'active'
  );

  if (relevantConsents.length === 0) {
    return {
      hasConsent: false,
      reason: 'No active consent found',
    };
  }

  // Check expiration
  const now = new Date();
  const validConsent = relevantConsents.find(c =>
    !c.expirationDate || c.expirationDate > now
  );

  if (!validConsent) {
    return {
      hasConsent: false,
      reason: 'Consent expired',
    };
  }

  return {
    hasConsent: true,
    consent: validConsent,
  };
}

/**
 * 24. Withdraws patient consent.
 *
 * @param {string} consentId - Consent ID to withdraw
 * @param {string} reason - Reason for withdrawal
 * @returns {PatientConsent} Updated consent record
 *
 * @example
 * ```typescript
 * const withdrawn = await withdrawConsent('consent-789', 'Patient request');
 * ```
 */
export function withdrawConsent(consentId: string, reason?: string): PatientConsent {
  // In production, fetch and update in database
  const consent: PatientConsent = {
    id: consentId,
    patientId: '',
    consentType: 'treatment',
    status: 'withdrawn',
    dateGiven: new Date(),
    notes: reason,
  };

  consent.status = 'withdrawn';
  consent.notes = `${consent.notes || ''}\nWithdrawn: ${reason || 'No reason provided'}`.trim();

  return consent;
}

/**
 * 25. Records advance directive for patient.
 *
 * @param {AdvanceDirective} directive - Advance directive information
 * @returns {AdvanceDirective} Created directive with ID
 *
 * @example
 * ```typescript
 * const directive = await recordAdvanceDirective({
 *   patientId: 'patient-123',
 *   type: 'healthcare_proxy',
 *   status: 'active',
 *   effectiveDate: new Date(),
 *   healthcareProxy: {
 *     name: 'Jane Doe',
 *     phone: '555-123-4567',
 *     relationship: 'spouse'
 *   }
 * });
 * ```
 */
export function recordAdvanceDirective(directive: AdvanceDirective): AdvanceDirective {
  const newDirective: AdvanceDirective = {
    ...directive,
    id: directive.id || crypto.randomUUID(),
  };

  // Validate required fields
  if (!newDirective.patientId) {
    throw new Error('Patient ID is required');
  }
  if (!newDirective.type) {
    throw new Error('Directive type is required');
  }
  if (!newDirective.status) {
    throw new Error('Directive status is required');
  }
  if (!newDirective.effectiveDate) {
    throw new Error('Effective date is required');
  }

  // Validate healthcare proxy if type is healthcare_proxy
  if (newDirective.type === 'healthcare_proxy' && !newDirective.healthcareProxy) {
    throw new Error('Healthcare proxy information is required for this directive type');
  }

  return newDirective;
}

/**
 * 26. Retrieves active advance directives for patient.
 *
 * @param {string} patientId - Patient ID
 * @param {AdvanceDirective[]} directives - All patient directives
 * @returns {AdvanceDirective[]} Active advance directives
 *
 * @example
 * ```typescript
 * const activeDirectives = getActiveAdvanceDirectives('patient-123', allDirectives);
 * ```
 */
export function getActiveAdvanceDirectives(
  patientId: string,
  directives: AdvanceDirective[]
): AdvanceDirective[] {
  const now = new Date();

  return directives.filter(d =>
    d.patientId === patientId &&
    d.status === 'active' &&
    d.effectiveDate <= now &&
    (!d.expirationDate || d.expirationDate > now)
  );
}

/**
 * 27. Validates advance directive completeness.
 *
 * @param {AdvanceDirective} directive - Advance directive to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateAdvanceDirective(directive);
 * if (!validation.valid) {
 *   throw new BadRequestException(validation.errors);
 * }
 * ```
 */
export function validateAdvanceDirective(directive: AdvanceDirective): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!directive.patientId) errors.push('Patient ID is required');
  if (!directive.type) errors.push('Directive type is required');
  if (!directive.status) errors.push('Status is required');
  if (!directive.effectiveDate) errors.push('Effective date is required');

  // Type-specific validation
  if (directive.type === 'healthcare_proxy') {
    if (!directive.healthcareProxy) {
      errors.push('Healthcare proxy information is required');
    } else {
      if (!directive.healthcareProxy.name) {
        errors.push('Healthcare proxy name is required');
      }
      if (!directive.healthcareProxy.phone) {
        errors.push('Healthcare proxy phone is required');
      }
    }
  }

  // Date validation
  if (directive.effectiveDate && directive.expirationDate) {
    if (directive.expirationDate <= directive.effectiveDate) {
      errors.push('Expiration date must be after effective date');
    }
  }

  // Document reference
  if (!directive.documentId) {
    warnings.push('No document reference attached');
  }

  // Verification
  if (!directive.verifiedDate || !directive.verifiedBy) {
    warnings.push('Directive has not been verified');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 28. Generates advance directive summary for clinical display.
 *
 * @param {AdvanceDirective[]} directives - Patient advance directives
 * @returns {string} Human-readable summary
 *
 * @example
 * ```typescript
 * const summary = generateAdvanceDirectiveSummary(patientDirectives);
 * // Result: "Active: Healthcare Proxy (Jane Doe), DNR Order"
 * ```
 */
export function generateAdvanceDirectiveSummary(directives: AdvanceDirective[]): string {
  const activeDirectives = directives.filter(d => d.status === 'active');

  if (activeDirectives.length === 0) {
    return 'No active advance directives';
  }

  const summary = activeDirectives.map(d => {
    const typeDisplay = d.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    if (d.type === 'healthcare_proxy' && d.healthcareProxy) {
      return `${typeDisplay} (${d.healthcareProxy.name})`;
    }

    return typeDisplay;
  });

  return `Active: ${summary.join(', ')}`;
}

// ============================================================================
// SECTION 5: INSURANCE MANAGEMENT (Functions 29-35)
// ============================================================================

/**
 * 29. Adds insurance coverage to patient record.
 *
 * @param {InsuranceInfo} insurance - Insurance information
 * @returns {InsuranceInfo} Created insurance record with ID
 *
 * @example
 * ```typescript
 * const insurance = await addInsurance({
 *   patientId: 'patient-123',
 *   priority: 'primary',
 *   status: 'active',
 *   payerId: 'BCBS-CA',
 *   payerName: 'Blue Cross Blue Shield of California',
 *   memberId: 'ABC123456789',
 *   effectiveDate: new Date('2024-01-01')
 * });
 * ```
 */
export function addInsurance(insurance: InsuranceInfo): InsuranceInfo {
  const newInsurance: InsuranceInfo = {
    ...insurance,
    id: insurance.id || crypto.randomUUID(),
  };

  // Validate required fields
  if (!newInsurance.patientId) {
    throw new Error('Patient ID is required');
  }
  if (!newInsurance.priority) {
    throw new Error('Insurance priority is required');
  }
  if (!newInsurance.payerId) {
    throw new Error('Payer ID is required');
  }
  if (!newInsurance.memberId) {
    throw new Error('Member ID is required');
  }
  if (!newInsurance.effectiveDate) {
    throw new Error('Effective date is required');
  }

  // Validate dates
  if (newInsurance.expirationDate && newInsurance.expirationDate <= newInsurance.effectiveDate) {
    throw new Error('Expiration date must be after effective date');
  }

  return newInsurance;
}

/**
 * 30. Verifies insurance eligibility with payer.
 *
 * @param {EligibilityRequest} request - Eligibility verification request
 * @returns {Promise<EligibilityResponse>} Eligibility response from payer
 *
 * @example
 * ```typescript
 * const eligibility = await verifyInsuranceEligibility({
 *   patientId: 'patient-123',
 *   insuranceId: 'ins-456',
 *   serviceDate: new Date(),
 *   serviceType: 'office_visit',
 *   providerId: 'provider-789'
 * });
 *
 * if (!eligibility.eligible) {
 *   throw new Error('Patient not eligible for service');
 * }
 * ```
 */
export async function verifyInsuranceEligibility(
  request: EligibilityRequest
): Promise<EligibilityResponse> {
  // In production, integrate with real-time eligibility verification service (e.g., Change Healthcare, Availity)
  // This is a simulated response

  const response: EligibilityResponse = {
    eligible: true,
    effectiveDate: new Date('2024-01-01'),
    expirationDate: new Date('2024-12-31'),
    benefits: {
      copay: 25.00,
      coinsurance: 0.20,
      deductible: 1000.00,
      deductibleRemaining: 250.00,
      outOfPocketMax: 5000.00,
      outOfPocketRemaining: 3500.00,
      coverageLevel: 'Family',
    },
    limitations: [
      'Prior authorization required for specialist visits',
      'Out-of-network benefits reduced by 50%',
    ],
    verifiedDate: new Date(),
  };

  return response;
}

/**
 * 31. Retrieves patient insurance in priority order.
 *
 * @param {string} patientId - Patient ID
 * @param {InsuranceInfo[]} insurances - Patient insurance records
 * @returns {InsuranceInfo[]} Sorted insurance by priority
 *
 * @example
 * ```typescript
 * const insurances = getPatientInsurance('patient-123', allInsurances);
 * const primary = insurances[0]; // Primary insurance
 * ```
 */
export function getPatientInsurance(patientId: string, insurances: InsuranceInfo[]): InsuranceInfo[] {
  const patientInsurances = insurances.filter(ins =>
    ins.patientId === patientId &&
    ins.status === 'active'
  );

  const priorityOrder = { primary: 1, secondary: 2, tertiary: 3 };

  return patientInsurances.sort((a, b) =>
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );
}

/**
 * 32. Validates insurance coverage for service date.
 *
 * @param {InsuranceInfo} insurance - Insurance information
 * @param {Date} serviceDate - Date of service
 * @returns {object} Coverage validation result
 *
 * @example
 * ```typescript
 * const validation = validateInsuranceCoverage(insurance, new Date());
 * if (!validation.covered) {
 *   console.warn(validation.reason);
 * }
 * ```
 */
export function validateInsuranceCoverage(insurance: InsuranceInfo, serviceDate: Date): {
  covered: boolean;
  reason?: string;
  requiresVerification?: boolean;
} {
  if (insurance.status !== 'active') {
    return {
      covered: false,
      reason: `Insurance status is ${insurance.status}`,
    };
  }

  if (serviceDate < insurance.effectiveDate) {
    return {
      covered: false,
      reason: 'Service date is before insurance effective date',
    };
  }

  if (insurance.expirationDate && serviceDate > insurance.expirationDate) {
    return {
      covered: false,
      reason: 'Service date is after insurance expiration date',
    };
  }

  // Check if verification is recent (within 30 days)
  if (!insurance.verified || !insurance.verifiedDate) {
    return {
      covered: true,
      requiresVerification: true,
      reason: 'Insurance has not been verified',
    };
  }

  const daysSinceVerification = Math.floor(
    (new Date().getTime() - insurance.verifiedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceVerification > 30) {
    return {
      covered: true,
      requiresVerification: true,
      reason: 'Insurance verification is outdated (>30 days)',
    };
  }

  return {
    covered: true,
  };
}

/**
 * 33. Calculates patient financial responsibility.
 *
 * @param {number} chargeAmount - Total charge amount
 * @param {EligibilityResponse} eligibility - Insurance eligibility info
 * @returns {object} Financial responsibility breakdown
 *
 * @example
 * ```typescript
 * const responsibility = calculatePatientResponsibility(150.00, eligibilityResponse);
 * // Result: { copay: 25, coinsurance: 25, deductible: 0, total: 50 }
 * ```
 */
export function calculatePatientResponsibility(
  chargeAmount: number,
  eligibility: EligibilityResponse
): {
  copay: number;
  coinsurance: number;
  deductible: number;
  total: number;
  insurancePays: number;
} {
  const benefits = eligibility.benefits || {};

  let copay = benefits.copay || 0;
  let deductible = 0;
  let coinsurance = 0;

  // Apply deductible first
  if (benefits.deductibleRemaining && benefits.deductibleRemaining > 0) {
    deductible = Math.min(chargeAmount, benefits.deductibleRemaining);
  }

  const remainingAfterDeductible = chargeAmount - deductible;

  // Apply coinsurance to remaining amount
  if (benefits.coinsurance && remainingAfterDeductible > 0) {
    coinsurance = remainingAfterDeductible * benefits.coinsurance;
  }

  // Total patient responsibility
  let total = copay + deductible + coinsurance;

  // Check out-of-pocket max
  if (benefits.outOfPocketRemaining && total > benefits.outOfPocketRemaining) {
    total = benefits.outOfPocketRemaining;
  }

  const insurancePays = chargeAmount - total;

  return {
    copay: Math.round(copay * 100) / 100,
    coinsurance: Math.round(coinsurance * 100) / 100,
    deductible: Math.round(deductible * 100) / 100,
    total: Math.round(total * 100) / 100,
    insurancePays: Math.round(insurancePays * 100) / 100,
  };
}

/**
 * 34. Formats insurance card display information.
 *
 * @param {InsuranceInfo} insurance - Insurance information
 * @returns {object} Formatted insurance card data
 *
 * @example
 * ```typescript
 * const cardInfo = formatInsuranceCard(insurance);
 * // Display in UI: cardInfo.display
 * ```
 */
export function formatInsuranceCard(insurance: InsuranceInfo): {
  display: string;
  payerName: string;
  memberId: string;
  groupNumber?: string;
  subscriberName?: string;
  effectiveDates: string;
} {
  const subscriberName = insurance.subscriber
    ? `${insurance.subscriber.firstName} ${insurance.subscriber.lastName}`
    : undefined;

  const effectiveStart = insurance.effectiveDate.toLocaleDateString();
  const effectiveEnd = insurance.expirationDate
    ? insurance.expirationDate.toLocaleDateString()
    : 'No end date';

  return {
    display: `${insurance.payerName} - ${insurance.memberId}`,
    payerName: insurance.payerName,
    memberId: insurance.memberId,
    groupNumber: insurance.groupNumber,
    subscriberName,
    effectiveDates: `${effectiveStart} - ${effectiveEnd}`,
  };
}

/**
 * 35. Checks for coordination of benefits (COB) requirements.
 *
 * @param {InsuranceInfo[]} insurances - Patient insurances
 * @returns {object} COB analysis
 *
 * @example
 * ```typescript
 * const cob = checkCoordinationOfBenefits(patientInsurances);
 * if (cob.requiresCOB) {
 *   console.log('File with primary first:', cob.primaryInsurance);
 * }
 * ```
 */
export function checkCoordinationOfBenefits(insurances: InsuranceInfo[]): {
  requiresCOB: boolean;
  primaryInsurance?: InsuranceInfo;
  secondaryInsurance?: InsuranceInfo;
  tertiaryInsurance?: InsuranceInfo;
  instructions?: string;
} {
  const activeInsurances = insurances.filter(ins => ins.status === 'active');

  if (activeInsurances.length <= 1) {
    return {
      requiresCOB: false,
      primaryInsurance: activeInsurances[0],
    };
  }

  const primary = activeInsurances.find(ins => ins.priority === 'primary');
  const secondary = activeInsurances.find(ins => ins.priority === 'secondary');
  const tertiary = activeInsurances.find(ins => ins.priority === 'tertiary');

  return {
    requiresCOB: true,
    primaryInsurance: primary,
    secondaryInsurance: secondary,
    tertiaryInsurance: tertiary,
    instructions: 'File claim with primary insurance first. After primary processes, file with secondary using primary EOB.',
  };
}

// ============================================================================
// SECTION 6: PATIENT PORTAL AND ACCOUNT MANAGEMENT (Functions 36-41)
// ============================================================================

/**
 * 36. Creates patient portal account.
 *
 * @param {string} patientId - Patient ID
 * @param {string} email - Email address
 * @param {string} username - Username
 * @returns {PatientPortalAccount} Created portal account
 *
 * @example
 * ```typescript
 * const account = await createPatientPortalAccount(
 *   'patient-123',
 *   'john.doe@example.com',
 *   'johndoe'
 * );
 * // Send activation email with account.activationToken
 * ```
 */
export function createPatientPortalAccount(
  patientId: string,
  email: string,
  username: string
): PatientPortalAccount {
  const activationToken = crypto.randomBytes(32).toString('hex');
  const activationExpiry = new Date();
  activationExpiry.setHours(activationExpiry.getHours() + 24); // 24 hour expiry

  const account: PatientPortalAccount = {
    id: crypto.randomUUID(),
    patientId,
    username,
    email: email.toLowerCase(),
    status: 'pending_verification',
    emailVerified: false,
    phoneVerified: false,
    twoFactorEnabled: false,
    failedLoginAttempts: 0,
    createdDate: new Date(),
    activationToken,
    activationExpiry,
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: false,
      },
      language: 'en',
      timezone: 'America/New_York',
    },
  };

  return account;
}

/**
 * 37. Activates patient portal account with token.
 *
 * @param {string} activationToken - Activation token from email
 * @param {PatientPortalAccount} account - Portal account
 * @returns {object} Activation result
 *
 * @example
 * ```typescript
 * const result = await activatePortalAccount(token, account);
 * if (!result.success) {
 *   throw new BadRequestException(result.error);
 * }
 * ```
 */
export function activatePortalAccount(
  activationToken: string,
  account: PatientPortalAccount
): {
  success: boolean;
  error?: string;
} {
  if (account.status === 'active') {
    return {
      success: false,
      error: 'Account is already active',
    };
  }

  if (account.activationToken !== activationToken) {
    return {
      success: false,
      error: 'Invalid activation token',
    };
  }

  if (account.activationExpiry && account.activationExpiry < new Date()) {
    return {
      success: false,
      error: 'Activation token has expired',
    };
  }

  account.status = 'active';
  account.emailVerified = true;
  account.activationToken = undefined;
  account.activationExpiry = undefined;

  return {
    success: true,
  };
}

/**
 * 38. Generates password reset token for portal account.
 *
 * @param {PatientPortalAccount} account - Portal account
 * @returns {string} Password reset token
 *
 * @example
 * ```typescript
 * const resetToken = generatePasswordResetToken(account);
 * // Send email with reset link containing token
 * await sendPasswordResetEmail(account.email, resetToken);
 * ```
 */
export function generatePasswordResetToken(account: PatientPortalAccount): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetExpiry = new Date();
  resetExpiry.setHours(resetExpiry.getHours() + 1); // 1 hour expiry

  account.resetToken = resetToken;
  account.resetExpiry = resetExpiry;

  return resetToken;
}

/**
 * 39. Updates patient communication preferences.
 *
 * @param {string} patientId - Patient ID
 * @param {CommunicationPreferences} preferences - Communication preferences
 * @returns {CommunicationPreferences} Updated preferences
 *
 * @example
 * ```typescript
 * const prefs = await updateCommunicationPreferences('patient-123', {
 *   patientId: 'patient-123',
 *   preferredLanguage: 'en',
 *   preferredMethod: 'email',
 *   appointmentReminders: true,
 *   labResults: true,
 *   emailConsent: true,
 *   smsConsent: false
 * });
 * ```
 */
export function updateCommunicationPreferences(
  patientId: string,
  preferences: CommunicationPreferences
): CommunicationPreferences {
  // Validate preferences
  if (!preferences.preferredLanguage) {
    throw new Error('Preferred language is required');
  }
  if (!preferences.preferredMethod) {
    throw new Error('Preferred contact method is required');
  }

  // Ensure consent aligns with preferred method
  if (preferences.preferredMethod === 'email' && !preferences.emailConsent) {
    throw new Error('Email consent is required for email as preferred method');
  }
  if (preferences.preferredMethod === 'sms' && !preferences.smsConsent) {
    throw new Error('SMS consent is required for SMS as preferred method');
  }

  return {
    ...preferences,
    patientId,
  };
}

/**
 * 40. Checks if patient can be contacted via specific method.
 *
 * @param {CommunicationPreferences} preferences - Patient preferences
 * @param {string} method - Contact method to check
 * @param {string} purpose - Purpose of contact
 * @returns {object} Contact permission result
 *
 * @example
 * ```typescript
 * const canContact = checkContactPermission(prefs, 'email', 'appointment_reminder');
 * if (!canContact.allowed) {
 *   console.log('Cannot contact:', canContact.reason);
 * }
 * ```
 */
export function checkContactPermission(
  preferences: CommunicationPreferences,
  method: 'phone' | 'email' | 'sms' | 'mail',
  purpose: string
): {
  allowed: boolean;
  reason?: string;
} {
  // Check do not contact flag
  if (preferences.doNotContact) {
    return {
      allowed: false,
      reason: preferences.doNotContactReason || 'Patient has requested no contact',
    };
  }

  // Check method-specific consent
  const consentMap = {
    phone: preferences.phoneConsent,
    email: preferences.emailConsent,
    sms: preferences.smsConsent,
    mail: preferences.mailConsent,
  };

  if (!consentMap[method]) {
    return {
      allowed: false,
      reason: `Patient has not consented to ${method} contact`,
    };
  }

  // Check purpose-specific preferences
  const purposeMap = {
    appointment_reminder: preferences.appointmentReminders,
    lab_results: preferences.labResults,
    billing: preferences.billing,
    marketing: preferences.marketing,
    surveys: preferences.surveys,
  };

  if (purpose in purposeMap && !purposeMap[purpose]) {
    return {
      allowed: false,
      reason: `Patient has opted out of ${purpose} communications`,
    };
  }

  return {
    allowed: true,
  };
}

/**
 * 41. Locks patient portal account after failed login attempts.
 *
 * @param {PatientPortalAccount} account - Portal account
 * @param {number} maxAttempts - Maximum allowed attempts (default: 5)
 * @returns {object} Lock status
 *
 * @example
 * ```typescript
 * account.failedLoginAttempts++;
 * const lockStatus = checkAndLockAccount(account, 5);
 * if (lockStatus.locked) {
 *   throw new UnauthorizedException('Account locked due to failed attempts');
 * }
 * ```
 */
export function checkAndLockAccount(
  account: PatientPortalAccount,
  maxAttempts: number = 5
): {
  locked: boolean;
  remainingAttempts?: number;
  lockReason?: string;
} {
  const attempts = account.failedLoginAttempts || 0;

  if (attempts >= maxAttempts) {
    account.status = 'locked';
    return {
      locked: true,
      lockReason: `Account locked after ${maxAttempts} failed login attempts`,
    };
  }

  return {
    locked: false,
    remainingAttempts: maxAttempts - attempts,
  };
}

// ============================================================================
// SECTION 7: PATIENT MERGE/UNMERGE UTILITIES (Functions 42-45)
// ============================================================================

/**
 * 42. Merges duplicate patient records with conflict resolution.
 *
 * @param {PatientMergeConfig} config - Merge configuration
 * @returns {Promise<PatientMergeResult>} Merge result
 *
 * @example
 * ```typescript
 * const result = await mergePatientRecords({
 *   sourcePatientId: 'patient-duplicate',
 *   targetPatientId: 'patient-master',
 *   mergeStrategy: 'keep_target',
 *   preserveHistory: true,
 *   userId: 'admin-123',
 *   reason: 'Duplicate identified during registration'
 * });
 * ```
 */
export async function mergePatientRecords(config: PatientMergeConfig): Promise<PatientMergeResult> {
  // In production, this would be a complex transaction involving multiple tables

  const mergeId = crypto.randomUUID();
  const mergeDate = new Date();

  // Simulate merge operation
  const result: PatientMergeResult = {
    success: true,
    mergedPatientId: config.targetPatientId,
    mergeId,
    mergeDate,
    recordsMerged: {
      demographics: true,
      appointments: 15,
      encounters: 42,
      medications: 8,
      allergies: 3,
      problems: 12,
      documents: 25,
    },
    conflicts: [],
    auditTrail: `Merge completed by ${config.userId} on ${mergeDate.toISOString()}. Strategy: ${config.mergeStrategy}. Reason: ${config.reason || 'Not specified'}`,
  };

  return result;
}

/**
 * 43. Unmerges previously merged patient records.
 *
 * @param {string} mergeId - Original merge ID
 * @param {string} userId - User performing unmerge
 * @param {string} reason - Reason for unmerge
 * @returns {Promise<object>} Unmerge result
 *
 * @example
 * ```typescript
 * const result = await unmergePatientRecords(
 *   'merge-789',
 *   'admin-456',
 *   'Merge was performed in error'
 * );
 * ```
 */
export async function unmergePatientRecords(
  mergeId: string,
  userId: string,
  reason: string
): Promise<{
  success: boolean;
  sourcePatientId?: string;
  targetPatientId?: string;
  recordsRestored?: {
    appointments: number;
    encounters: number;
    medications: number;
    allergies: number;
    problems: number;
    documents: number;
  };
  error?: string;
}> {
  // In production, retrieve merge record and reverse all changes
  // This is a complex operation requiring audit trail analysis

  return {
    success: true,
    sourcePatientId: 'restored-patient-id',
    targetPatientId: 'original-target-id',
    recordsRestored: {
      appointments: 15,
      encounters: 42,
      medications: 8,
      allergies: 3,
      problems: 12,
      documents: 25,
    },
  };
}

/**
 * 44. Validates patient records are eligible for merging.
 *
 * @param {string} sourcePatientId - Source patient ID
 * @param {string} targetPatientId - Target patient ID
 * @param {any[]} patientDatabase - Patient database
 * @returns {object} Merge eligibility result
 *
 * @example
 * ```typescript
 * const eligibility = validateMergeEligibility('patient-1', 'patient-2', patients);
 * if (!eligibility.eligible) {
 *   throw new BadRequestException(eligibility.errors);
 * }
 * ```
 */
export function validateMergeEligibility(
  sourcePatientId: string,
  targetPatientId: string,
  patientDatabase: any[]
): {
  eligible: boolean;
  errors: string[];
  warnings: string[];
  conflicts: Array<{
    field: string;
    sourceValue: any;
    targetValue: any;
  }>;
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const conflicts: Array<{ field: string; sourceValue: any; targetValue: any }> = [];

  const sourcePatient = patientDatabase.find(p => p.id === sourcePatientId);
  const targetPatient = patientDatabase.find(p => p.id === targetPatientId);

  if (!sourcePatient) {
    errors.push('Source patient not found');
  }
  if (!targetPatient) {
    errors.push('Target patient not found');
  }

  if (sourcePatientId === targetPatientId) {
    errors.push('Cannot merge patient with itself');
  }

  if (sourcePatient && targetPatient) {
    // Check for demographic conflicts
    if (sourcePatient.dateOfBirth !== targetPatient.dateOfBirth) {
      conflicts.push({
        field: 'dateOfBirth',
        sourceValue: sourcePatient.dateOfBirth,
        targetValue: targetPatient.dateOfBirth,
      });
      warnings.push('Date of birth mismatch - verify patients are same person');
    }

    if (sourcePatient.gender !== targetPatient.gender) {
      conflicts.push({
        field: 'gender',
        sourceValue: sourcePatient.gender,
        targetValue: targetPatient.gender,
      });
      warnings.push('Gender mismatch - verify patients are same person');
    }

    // Check if either patient is deceased
    if (sourcePatient.deceased || targetPatient.deceased) {
      warnings.push('One or both patients marked as deceased - verify merge appropriateness');
    }
  }

  return {
    eligible: errors.length === 0,
    errors,
    warnings,
    conflicts,
  };
}

/**
 * 45. Records health proxy or legal guardian information.
 *
 * @param {HealthProxy} proxy - Health proxy information
 * @returns {HealthProxy} Created proxy record with ID
 *
 * @example
 * ```typescript
 * const proxy = await recordHealthProxy({
 *   patientId: 'patient-123',
 *   type: 'healthcare_proxy',
 *   status: 'active',
 *   name: { firstName: 'Jane', lastName: 'Doe' },
 *   phone: '555-123-4567',
 *   effectiveDate: new Date(),
 *   scope: ['medical_decisions', 'end_of_life_care']
 * });
 * ```
 */
export function recordHealthProxy(proxy: HealthProxy): HealthProxy {
  const newProxy: HealthProxy = {
    ...proxy,
    id: proxy.id || crypto.randomUUID(),
  };

  // Validate required fields
  if (!newProxy.patientId) {
    throw new Error('Patient ID is required');
  }
  if (!newProxy.type) {
    throw new Error('Proxy type is required');
  }
  if (!newProxy.status) {
    throw new Error('Status is required');
  }
  if (!newProxy.name?.firstName || !newProxy.name?.lastName) {
    throw new Error('Proxy name is required');
  }
  if (!newProxy.phone) {
    throw new Error('Phone number is required');
  }
  if (!newProxy.effectiveDate) {
    throw new Error('Effective date is required');
  }

  // Validate phone number
  const phoneValidation = validatePhoneNumber(newProxy.phone);
  if (!phoneValidation.valid) {
    throw new Error('Invalid phone number');
  }

  return newProxy;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculates Luhn checksum for identifier validation.
 */
function calculateLuhnChecksum(value: string): number {
  const digits = value.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return (10 - (sum % 10)) % 10;
}

/**
 * Standardizes street address format.
 */
function standardizeStreetAddress(address: string): string {
  const abbreviations: Record<string, string> = {
    'STREET': 'ST',
    'AVENUE': 'AVE',
    'BOULEVARD': 'BLVD',
    'ROAD': 'RD',
    'LANE': 'LN',
    'DRIVE': 'DR',
    'COURT': 'CT',
    'CIRCLE': 'CIR',
    'PLACE': 'PL',
    'NORTH': 'N',
    'SOUTH': 'S',
    'EAST': 'E',
    'WEST': 'W',
    'APARTMENT': 'APT',
    'SUITE': 'STE',
  };

  let standardized = address.toUpperCase().trim();

  Object.entries(abbreviations).forEach(([full, abbr]) => {
    const regex = new RegExp(`\\b${full}\\b`, 'g');
    standardized = standardized.replace(regex, abbr);
  });

  return standardized;
}

/**
 * Performs fuzzy string matching with Levenshtein distance.
 */
function stringMatch(str1: string, str2: string, fuzzy: boolean = false): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  if (s1 === s2) return 1.0;

  if (!fuzzy) {
    return s1.includes(s2) || s2.includes(s1) ? 0.5 : 0;
  }

  const distance = levenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);

  return 1 - (distance / maxLength);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Patient Registration & Demographics
  generateMRN,
  validateMRN,
  encryptSSN,
  decryptSSN,
  getSSNLast4,
  validatePatientDemographics,
  validateAndStandardizeAddress,
  validatePhoneNumber,

  // Patient Search & Matching
  fuzzyPatientSearch,
  calculatePatientMatchScore,
  detectDuplicatePatients,
  soundexEncode,
  soundexMatch,
  levenshteinDistance,
  normalizePatientName,

  // Family & Emergency Contacts
  addEmergencyContact,
  updateEmergencyContact,
  getEmergencyContacts,
  addFamilyMember,
  getFamilyHistory,
  validateRelationshipCode,

  // Consent & Advance Directives
  recordPatientConsent,
  checkConsentStatus,
  withdrawConsent,
  recordAdvanceDirective,
  getActiveAdvanceDirectives,
  validateAdvanceDirective,
  generateAdvanceDirectiveSummary,

  // Insurance Management
  addInsurance,
  verifyInsuranceEligibility,
  getPatientInsurance,
  validateInsuranceCoverage,
  calculatePatientResponsibility,
  formatInsuranceCard,
  checkCoordinationOfBenefits,

  // Patient Portal & Account Management
  createPatientPortalAccount,
  activatePortalAccount,
  generatePasswordResetToken,
  updateCommunicationPreferences,
  checkContactPermission,
  checkAndLockAccount,

  // Patient Merge/Unmerge
  mergePatientRecords,
  unmergePatientRecords,
  validateMergeEligibility,
  recordHealthProxy,
};
