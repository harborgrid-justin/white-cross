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
export declare function generateMRN(facilityCode: string | undefined, sequenceNumber: number): string;
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
export declare function validateMRN(mrn: string): boolean;
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
export declare function encryptSSN(ssn: string, encryptionKey: string): string;
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
export declare function decryptSSN(encryptedSSN: string, encryptionKey: string): string;
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
export declare function getSSNLast4(ssn: string, encryptionKey?: string): string;
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
export declare function validatePatientDemographics(demographics: PatientDemographics): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
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
export declare function validateAndStandardizeAddress(address: PatientAddress): Promise<PatientAddress>;
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
export declare function validatePhoneNumber(phone: string, countryCode?: string): {
    valid: boolean;
    formatted?: string;
    display?: string;
    error?: string;
};
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
export declare function fuzzyPatientSearch(criteria: PatientSearchCriteria, patientDatabase: any[]): PatientMatchResult[];
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
export declare function calculatePatientMatchScore(criteria: PatientSearchCriteria, patient: any, options?: {
    fuzzyMatch?: boolean;
    phoneticMatch?: boolean;
}): {
    score: number;
    matchedFields: string[];
    reasons: string[];
};
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
export declare function detectDuplicatePatients(patientId: string, patientDatabase: any[]): PatientMatchResult[];
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
export declare function soundexEncode(name: string): string;
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
export declare function soundexMatch(name1: string, name2: string): number;
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
export declare function levenshteinDistance(str1: string, str2: string): number;
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
export declare function normalizePatientName(name: string): string;
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
export declare function addEmergencyContact(patientId: string, contact: EmergencyContact): EmergencyContact;
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
export declare function updateEmergencyContact(contactId: string, updates: Partial<EmergencyContact>): EmergencyContact;
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
export declare function getEmergencyContacts(patientId: string): EmergencyContact[];
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
export declare function addFamilyMember(patientId: string, familyMember: FamilyMember): FamilyMember;
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
export declare function getFamilyHistory(patientId: string): FamilyMember[];
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
export declare function validateRelationshipCode(relationshipCode: string): {
    valid: boolean;
    display?: string;
    system?: string;
    error?: string;
};
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
export declare function recordPatientConsent(consent: PatientConsent): PatientConsent;
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
export declare function checkConsentStatus(patientId: string, consentType: string, consents: PatientConsent[]): {
    hasConsent: boolean;
    consent?: PatientConsent;
    reason?: string;
};
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
export declare function withdrawConsent(consentId: string, reason?: string): PatientConsent;
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
export declare function recordAdvanceDirective(directive: AdvanceDirective): AdvanceDirective;
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
export declare function getActiveAdvanceDirectives(patientId: string, directives: AdvanceDirective[]): AdvanceDirective[];
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
export declare function validateAdvanceDirective(directive: AdvanceDirective): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
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
export declare function generateAdvanceDirectiveSummary(directives: AdvanceDirective[]): string;
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
export declare function addInsurance(insurance: InsuranceInfo): InsuranceInfo;
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
export declare function verifyInsuranceEligibility(request: EligibilityRequest): Promise<EligibilityResponse>;
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
export declare function getPatientInsurance(patientId: string, insurances: InsuranceInfo[]): InsuranceInfo[];
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
export declare function validateInsuranceCoverage(insurance: InsuranceInfo, serviceDate: Date): {
    covered: boolean;
    reason?: string;
    requiresVerification?: boolean;
};
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
export declare function calculatePatientResponsibility(chargeAmount: number, eligibility: EligibilityResponse): {
    copay: number;
    coinsurance: number;
    deductible: number;
    total: number;
    insurancePays: number;
};
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
export declare function formatInsuranceCard(insurance: InsuranceInfo): {
    display: string;
    payerName: string;
    memberId: string;
    groupNumber?: string;
    subscriberName?: string;
    effectiveDates: string;
};
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
export declare function checkCoordinationOfBenefits(insurances: InsuranceInfo[]): {
    requiresCOB: boolean;
    primaryInsurance?: InsuranceInfo;
    secondaryInsurance?: InsuranceInfo;
    tertiaryInsurance?: InsuranceInfo;
    instructions?: string;
};
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
export declare function createPatientPortalAccount(patientId: string, email: string, username: string): PatientPortalAccount;
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
export declare function activatePortalAccount(activationToken: string, account: PatientPortalAccount): {
    success: boolean;
    error?: string;
};
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
export declare function generatePasswordResetToken(account: PatientPortalAccount): string;
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
export declare function updateCommunicationPreferences(patientId: string, preferences: CommunicationPreferences): CommunicationPreferences;
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
export declare function checkContactPermission(preferences: CommunicationPreferences, method: 'phone' | 'email' | 'sms' | 'mail', purpose: string): {
    allowed: boolean;
    reason?: string;
};
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
export declare function checkAndLockAccount(account: PatientPortalAccount, maxAttempts?: number): {
    locked: boolean;
    remainingAttempts?: number;
    lockReason?: string;
};
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
export declare function mergePatientRecords(config: PatientMergeConfig): Promise<PatientMergeResult>;
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
export declare function unmergePatientRecords(mergeId: string, userId: string, reason: string): Promise<{
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
}>;
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
export declare function validateMergeEligibility(sourcePatientId: string, targetPatientId: string, patientDatabase: any[]): {
    eligible: boolean;
    errors: string[];
    warnings: string[];
    conflicts: Array<{
        field: string;
        sourceValue: any;
        targetValue: any;
    }>;
};
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
export declare function recordHealthProxy(proxy: HealthProxy): HealthProxy;
declare const _default: {
    generateMRN: typeof generateMRN;
    validateMRN: typeof validateMRN;
    encryptSSN: typeof encryptSSN;
    decryptSSN: typeof decryptSSN;
    getSSNLast4: typeof getSSNLast4;
    validatePatientDemographics: typeof validatePatientDemographics;
    validateAndStandardizeAddress: typeof validateAndStandardizeAddress;
    validatePhoneNumber: typeof validatePhoneNumber;
    fuzzyPatientSearch: typeof fuzzyPatientSearch;
    calculatePatientMatchScore: typeof calculatePatientMatchScore;
    detectDuplicatePatients: typeof detectDuplicatePatients;
    soundexEncode: typeof soundexEncode;
    soundexMatch: typeof soundexMatch;
    levenshteinDistance: typeof levenshteinDistance;
    normalizePatientName: typeof normalizePatientName;
    addEmergencyContact: typeof addEmergencyContact;
    updateEmergencyContact: typeof updateEmergencyContact;
    getEmergencyContacts: typeof getEmergencyContacts;
    addFamilyMember: typeof addFamilyMember;
    getFamilyHistory: typeof getFamilyHistory;
    validateRelationshipCode: typeof validateRelationshipCode;
    recordPatientConsent: typeof recordPatientConsent;
    checkConsentStatus: typeof checkConsentStatus;
    withdrawConsent: typeof withdrawConsent;
    recordAdvanceDirective: typeof recordAdvanceDirective;
    getActiveAdvanceDirectives: typeof getActiveAdvanceDirectives;
    validateAdvanceDirective: typeof validateAdvanceDirective;
    generateAdvanceDirectiveSummary: typeof generateAdvanceDirectiveSummary;
    addInsurance: typeof addInsurance;
    verifyInsuranceEligibility: typeof verifyInsuranceEligibility;
    getPatientInsurance: typeof getPatientInsurance;
    validateInsuranceCoverage: typeof validateInsuranceCoverage;
    calculatePatientResponsibility: typeof calculatePatientResponsibility;
    formatInsuranceCard: typeof formatInsuranceCard;
    checkCoordinationOfBenefits: typeof checkCoordinationOfBenefits;
    createPatientPortalAccount: typeof createPatientPortalAccount;
    activatePortalAccount: typeof activatePortalAccount;
    generatePasswordResetToken: typeof generatePasswordResetToken;
    updateCommunicationPreferences: typeof updateCommunicationPreferences;
    checkContactPermission: typeof checkContactPermission;
    checkAndLockAccount: typeof checkAndLockAccount;
    mergePatientRecords: typeof mergePatientRecords;
    unmergePatientRecords: typeof unmergePatientRecords;
    validateMergeEligibility: typeof validateMergeEligibility;
    recordHealthProxy: typeof recordHealthProxy;
};
export default _default;
//# sourceMappingURL=health-patient-management-kit.d.ts.map