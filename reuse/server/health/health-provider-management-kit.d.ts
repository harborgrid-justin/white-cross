/**
 * LOC: HLTH-PRV-MGT-001
 * File: /reuse/server/health/health-provider-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - class-transformer
 *   - fhir/r4 (HL7 FHIR R4)
 *   - crypto (Node.js)
 *   - axios (NPI Registry API)
 *
 * DOWNSTREAM (imported by):
 *   - Provider services
 *   - Credentialing modules
 *   - Provider directory controllers
 *   - Scheduling services
 *   - Referral management services
 */
/**
 * Provider demographics information
 */
export interface ProviderDemographics {
    npi: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    suffix?: string;
    credentials?: string[];
    gender?: 'male' | 'female' | 'other' | 'unknown';
    dateOfBirth?: Date;
    ssn?: string;
    ssnLast4?: string;
    taxonomy?: string;
    taxonomyDescription?: string;
    deaNumber?: string;
    medicalLicenseNumber?: string;
    medicalLicenseState?: string;
}
/**
 * Provider contact information
 */
export interface ProviderContactInfo {
    email: string;
    phone: string;
    mobilePhone?: string;
    fax?: string;
    pager?: string;
    preferredContactMethod?: 'email' | 'phone' | 'mobile' | 'pager';
    officeAddress?: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    mailingAddress?: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
}
/**
 * Provider credentialing status
 */
export interface ProviderCredentialing {
    providerId: string;
    status: 'not_started' | 'in_progress' | 'pending_verification' | 'approved' | 'denied' | 'expired' | 'suspended';
    credentialingDate?: Date;
    recredentialingDate?: Date;
    expirationDate?: Date;
    credentialingCommittee?: string;
    approvedBy?: string;
    primarySourceVerification: {
        education: boolean;
        training: boolean;
        boardCertification: boolean;
        medicalLicense: boolean;
        deaRegistration: boolean;
        malpracticeInsurance: boolean;
        hospitalPrivileges: boolean;
    };
    documents: Array<{
        type: string;
        documentId: string;
        uploadDate: Date;
        verifiedDate?: Date;
        verifiedBy?: string;
        status: 'pending' | 'approved' | 'rejected';
    }>;
    notes?: string;
}
/**
 * Medical education and training
 */
export interface ProviderEducation {
    type: 'medical_school' | 'residency' | 'fellowship' | 'internship' | 'continuing_education';
    institution: string;
    degree?: string;
    specialty?: string;
    startDate: Date;
    endDate: Date;
    location?: {
        city: string;
        state: string;
        country: string;
    };
    verified?: boolean;
    verifiedDate?: Date;
    verificationSource?: string;
}
/**
 * Board certification information
 */
export interface BoardCertification {
    id?: string;
    providerId: string;
    boardName: string;
    specialty: string;
    subspecialty?: string;
    certificationNumber: string;
    certificationDate: Date;
    expirationDate?: Date;
    recertificationDate?: Date;
    status: 'active' | 'expired' | 'inactive' | 'revoked';
    verified?: boolean;
    verifiedDate?: Date;
    verificationSource?: string;
}
/**
 * Medical license information
 */
export interface MedicalLicense {
    id?: string;
    providerId: string;
    licenseNumber: string;
    state: string;
    licenseType: 'full' | 'limited' | 'temporary' | 'training';
    issueDate: Date;
    expirationDate: Date;
    renewalDate?: Date;
    status: 'active' | 'expired' | 'suspended' | 'revoked' | 'inactive';
    restrictions?: string[];
    disciplinaryActions?: Array<{
        date: Date;
        action: string;
        description: string;
        resolution?: string;
    }>;
    verified?: boolean;
    verifiedDate?: Date;
}
/**
 * DEA registration information
 */
export interface DEARegistration {
    id?: string;
    providerId: string;
    deaNumber: string;
    schedules: Array<'II' | 'II-N' | 'III' | 'III-N' | 'IV' | 'V'>;
    issueDate: Date;
    expirationDate: Date;
    renewalDate?: Date;
    status: 'active' | 'expired' | 'suspended' | 'revoked';
    businessActivity: string;
    drugSchedules?: string[];
    verified?: boolean;
    verifiedDate?: Date;
}
/**
 * Provider specialty information
 */
export interface ProviderSpecialty {
    id?: string;
    providerId: string;
    specialty: string;
    specialtyCode?: string;
    subspecialty?: string;
    isPrimary: boolean;
    boardCertified: boolean;
    yearsOfExperience?: number;
    taxonomyCode?: string;
}
/**
 * Provider schedule configuration
 */
export interface ProviderSchedule {
    providerId: string;
    facilityId?: string;
    dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    startTime: string;
    endTime: string;
    slotDuration?: number;
    breakTimes?: Array<{
        startTime: string;
        endTime: string;
        reason?: string;
    }>;
    maxPatients?: number;
    appointmentTypes?: string[];
    effectiveDate: Date;
    endDate?: Date;
    status: 'active' | 'inactive' | 'temporary';
}
/**
 * Provider availability slot
 */
export interface AvailabilitySlot {
    providerId: string;
    facilityId?: string;
    startDateTime: Date;
    endDateTime: Date;
    slotType: 'appointment' | 'procedure' | 'surgery' | 'consultation' | 'telemedicine';
    status: 'available' | 'booked' | 'blocked' | 'tentative';
    appointmentId?: string;
    notes?: string;
}
/**
 * Hospital privileges information
 */
export interface HospitalPrivileges {
    id?: string;
    providerId: string;
    facilityId: string;
    facilityName: string;
    privilegeType: 'admitting' | 'consulting' | 'courtesy' | 'temporary' | 'emergency';
    departments: string[];
    specialProcedures?: string[];
    restrictions?: string[];
    grantedDate: Date;
    expirationDate?: Date;
    renewalDate?: Date;
    status: 'active' | 'provisional' | 'expired' | 'suspended' | 'revoked';
    medicalStaffCategory?: 'active' | 'associate' | 'courtesy' | 'consulting' | 'honorary';
    credentialingCommittee?: string;
    approvedBy?: string;
    notes?: string;
}
/**
 * Provider peer review information
 */
export interface PeerReview {
    id?: string;
    providerId: string;
    reviewType: 'clinical_quality' | 'professionalism' | 'case_review' | 'privileging' | 'credentialing';
    reviewDate: Date;
    reviewPeriod?: {
        start: Date;
        end: Date;
    };
    reviewers?: string[];
    outcome: 'satisfactory' | 'needs_improvement' | 'unsatisfactory' | 'exceptional';
    findings?: string;
    recommendations?: string[];
    actionItems?: Array<{
        action: string;
        dueDate?: Date;
        status: 'pending' | 'completed' | 'overdue';
    }>;
    confidential: boolean;
}
/**
 * Referral network configuration
 */
export interface ReferralNetwork {
    id?: string;
    providerId: string;
    networkName?: string;
    referralType: 'accepting' | 'sending' | 'bidirectional';
    specialties: string[];
    acceptedInsurances?: string[];
    preferredFacilities?: string[];
    maxReferralsPerMonth?: number;
    currentReferrals?: number;
    qualityMetrics?: {
        averageWaitTime?: number;
        patientSatisfaction?: number;
        outcomeQuality?: number;
    };
    status: 'active' | 'inactive' | 'full';
}
/**
 * Provider performance metrics
 */
export interface ProviderPerformance {
    providerId: string;
    period: {
        start: Date;
        end: Date;
    };
    clinicalMetrics: {
        patientsSeen?: number;
        averageVisitDuration?: number;
        noShowRate?: number;
        cancellationRate?: number;
    };
    qualityMetrics: {
        patientSatisfactionScore?: number;
        clinicalQualityScore?: number;
        safetyIncidents?: number;
        complaintRate?: number;
    };
    productivityMetrics: {
        rvuTotal?: number;
        encountersPerDay?: number;
        utilizationRate?: number;
    };
    financialMetrics?: {
        collections?: number;
        denialRate?: number;
        averageReimbursement?: number;
    };
}
/**
 * NPI Registry lookup result
 */
export interface NPIRegistryResult {
    npi: string;
    name: {
        firstName: string;
        middleName?: string;
        lastName: string;
        prefix?: string;
        suffix?: string;
        credential?: string;
    };
    taxonomy: string;
    taxonomyDescription: string;
    gender?: string;
    soloProvider: boolean;
    addresses: Array<{
        addressType: 'DOM' | 'MAIL' | 'LOCATION' | 'OTHER';
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        telephone?: string;
        fax?: string;
    }>;
    authorized_official?: {
        firstName: string;
        lastName: string;
        title: string;
        telephone: string;
    };
    lastUpdated?: Date;
}
/**
 * Provider search criteria
 */
export interface ProviderSearchCriteria {
    name?: string;
    npi?: string;
    specialty?: string;
    location?: {
        city?: string;
        state?: string;
        postalCode?: string;
        radius?: number;
    };
    acceptingNewPatients?: boolean;
    insurance?: string[];
    facilityAffiliation?: string;
    language?: string[];
    gender?: string;
}
/**
 * Provider directory listing
 */
export interface ProviderDirectoryListing {
    providerId: string;
    npi: string;
    displayName: string;
    specialties: string[];
    primaryLocation: {
        address: string;
        city: string;
        state: string;
        phone: string;
    };
    acceptingNewPatients: boolean;
    acceptedInsurances: string[];
    languages?: string[];
    rating?: number;
    education?: string[];
    yearsOfExperience?: number;
    hospitalAffiliations?: string[];
    officeHours?: Array<{
        day: string;
        hours: string;
    }>;
}
/**
 * FHIR Practitioner resource mapping
 */
export interface FHIRPractitioner {
    resourceType: 'Practitioner';
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
        system: 'phone' | 'email' | 'fax' | 'pager';
        value: string;
        use?: string;
    }>;
    gender?: 'male' | 'female' | 'other' | 'unknown';
    birthDate?: string;
    address?: Array<{
        use?: string;
        type?: string;
        line?: string[];
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    }>;
    qualification?: Array<{
        identifier?: any[];
        code: any;
        period?: {
            start?: string;
            end?: string;
        };
        issuer?: any;
    }>;
}
/**
 * 1. Validates National Provider Identifier (NPI) format and checksum.
 *
 * @param {string} npi - NPI to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateNPI('1234567893');
 * if (!result.valid) {
 *   throw new BadRequestException('Invalid NPI: ' + result.error);
 * }
 * ```
 */
export declare function validateNPI(npi: string): {
    valid: boolean;
    error?: string;
};
/**
 * 2. Looks up provider information from NPPES NPI Registry.
 *
 * @param {string} npi - National Provider Identifier
 * @returns {Promise<NPIRegistryResult>} Provider information from registry
 *
 * @example
 * ```typescript
 * const providerInfo = await lookupNPIRegistry('1234567893');
 * console.log('Provider:', providerInfo.name);
 * console.log('Specialty:', providerInfo.taxonomyDescription);
 * ```
 */
export declare function lookupNPIRegistry(npi: string): Promise<NPIRegistryResult>;
/**
 * 3. Registers new provider with comprehensive validation.
 *
 * @param {ProviderDemographics} demographics - Provider demographics
 * @param {ProviderContactInfo} contactInfo - Contact information
 * @returns {Promise<string>} Provider ID
 *
 * @example
 * ```typescript
 * const providerId = await registerProvider({
 *   npi: '1234567893',
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   credentials: ['MD', 'FACP'],
 *   taxonomy: '207Q00000X',
 *   deaNumber: 'AS1234563'
 * }, {
 *   email: 'dr.smith@hospital.com',
 *   phone: '415-555-1234'
 * });
 * ```
 */
export declare function registerProvider(demographics: ProviderDemographics, contactInfo: ProviderContactInfo): Promise<string>;
/**
 * 4. Initiates provider credentialing workflow.
 *
 * @param {string} providerId - Provider ID
 * @returns {ProviderCredentialing} Credentialing record
 *
 * @example
 * ```typescript
 * const credentialing = await initiateCredentialing('provider-123');
 * // Credentialing status: 'in_progress'
 * // Next step: Upload required documents
 * ```
 */
export declare function initiateCredentialing(providerId: string): ProviderCredentialing;
/**
 * 5. Performs primary source verification for credentials.
 *
 * @param {string} providerId - Provider ID
 * @param {string} verificationType - Type of verification
 * @param {any} verificationData - Verification data
 * @returns {Promise<object>} Verification result
 *
 * @example
 * ```typescript
 * const result = await verifyPrimarySource('provider-123', 'medical_license', {
 *   licenseNumber: 'A12345',
 *   state: 'CA'
 * });
 *
 * if (result.verified) {
 *   console.log('License verified:', result.details);
 * }
 * ```
 */
export declare function verifyPrimarySource(providerId: string, verificationType: string, verificationData: any): Promise<{
    verified: boolean;
    verificationDate: Date;
    source: string;
    details?: any;
    errors?: string[];
}>;
/**
 * 6. Updates provider credentialing status.
 *
 * @param {string} providerId - Provider ID
 * @param {string} status - New credentialing status
 * @param {string} notes - Status change notes
 * @returns {ProviderCredentialing} Updated credentialing record
 *
 * @example
 * ```typescript
 * const updated = await updateCredentialingStatus(
 *   'provider-123',
 *   'approved',
 *   'All verifications completed. Approved by credentialing committee.'
 * );
 * ```
 */
export declare function updateCredentialingStatus(providerId: string, status: ProviderCredentialing['status'], notes?: string): ProviderCredentialing;
/**
 * 7. Checks if provider needs recredentialing.
 *
 * @param {ProviderCredentialing} credentialing - Credentialing record
 * @param {number} warningDays - Days before expiration to warn (default: 90)
 * @returns {object} Recredentialing status
 *
 * @example
 * ```typescript
 * const status = checkRecredentialingStatus(credentialing, 90);
 * if (status.requiresRecredentialing) {
 *   console.log('Recredentialing due:', status.daysUntilExpiration);
 * }
 * ```
 */
export declare function checkRecredentialingStatus(credentialing: ProviderCredentialing, warningDays?: number): {
    requiresRecredentialing: boolean;
    isExpired: boolean;
    daysUntilExpiration?: number;
    warning?: boolean;
};
/**
 * 8. Validates DEA number format and checksum.
 *
 * @param {string} deaNumber - DEA registration number
 * @returns {object} Validation result with details
 *
 * @example
 * ```typescript
 * const result = validateDEANumber('AS1234563');
 * if (result.valid) {
 *   console.log('Registrant type:', result.registrantType);
 * }
 * ```
 */
export declare function validateDEANumber(deaNumber: string): {
    valid: boolean;
    registrantType?: string;
    error?: string;
};
/**
 * 9. Validates medical license number against state registry.
 *
 * @param {string} licenseNumber - Medical license number
 * @param {string} state - State of licensure
 * @returns {Promise<object>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateMedicalLicense('A12345', 'CA');
 * if (result.valid) {
 *   console.log('License status:', result.status);
 *   console.log('Expiration:', result.expirationDate);
 * }
 * ```
 */
export declare function validateMedicalLicense(licenseNumber: string, state: string): Promise<{
    valid: boolean;
    status?: string;
    expirationDate?: Date;
    disciplinaryActions?: any[];
    error?: string;
}>;
/**
 * 10. Adds medical license to provider record.
 *
 * @param {MedicalLicense} license - Medical license information
 * @returns {MedicalLicense} Created license record with ID
 *
 * @example
 * ```typescript
 * const license = await addMedicalLicense({
 *   providerId: 'provider-123',
 *   licenseNumber: 'A12345',
 *   state: 'CA',
 *   licenseType: 'full',
 *   issueDate: new Date('2020-01-01'),
 *   expirationDate: new Date('2025-12-31'),
 *   status: 'active'
 * });
 * ```
 */
export declare function addMedicalLicense(license: MedicalLicense): MedicalLicense;
/**
 * 11. Adds DEA registration to provider record.
 *
 * @param {DEARegistration} dea - DEA registration information
 * @returns {DEARegistration} Created DEA record with ID
 *
 * @example
 * ```typescript
 * const dea = await addDEARegistration({
 *   providerId: 'provider-123',
 *   deaNumber: 'AS1234563',
 *   schedules: ['II', 'III', 'IV', 'V'],
 *   issueDate: new Date('2022-01-01'),
 *   expirationDate: new Date('2025-01-31'),
 *   status: 'active',
 *   businessActivity: 'Practitioner'
 * });
 * ```
 */
export declare function addDEARegistration(dea: DEARegistration): DEARegistration;
/**
 * 12. Checks license expiration and generates renewal alerts.
 *
 * @param {MedicalLicense[]} licenses - Provider licenses
 * @param {number} warningDays - Days before expiration to warn
 * @returns {Array} Expiration alerts
 *
 * @example
 * ```typescript
 * const alerts = checkLicenseExpiration(providerLicenses, 60);
 * alerts.forEach(alert => {
 *   if (alert.urgent) {
 *     sendRenewalNotification(alert);
 *   }
 * });
 * ```
 */
export declare function checkLicenseExpiration(licenses: MedicalLicense[], warningDays?: number): Array<{
    licenseId: string;
    state: string;
    daysUntilExpiration: number;
    urgent: boolean;
    expired: boolean;
}>;
/**
 * 13. Validates provider taxonomy code against NUCC standard.
 *
 * @param {string} taxonomyCode - Healthcare Provider Taxonomy Code
 * @returns {object} Taxonomy validation and description
 *
 * @example
 * ```typescript
 * const result = validateTaxonomyCode('207Q00000X');
 * // Result: { valid: true, description: 'Family Medicine', specialty: 'Allopathic & Osteopathic Physicians' }
 * ```
 */
export declare function validateTaxonomyCode(taxonomyCode: string): {
    valid: boolean;
    description?: string;
    specialty?: string;
    error?: string;
};
/**
 * 14. Searches provider directory with multiple criteria.
 *
 * @param {ProviderSearchCriteria} criteria - Search criteria
 * @param {any[]} providerDatabase - Provider database
 * @returns {ProviderDirectoryListing[]} Matching providers
 *
 * @example
 * ```typescript
 * const providers = searchProviderDirectory({
 *   specialty: 'Family Medicine',
 *   location: { city: 'San Francisco', state: 'CA', radius: 10 },
 *   acceptingNewPatients: true,
 *   insurance: ['Blue Cross', 'Aetna']
 * }, allProviders);
 * ```
 */
export declare function searchProviderDirectory(criteria: ProviderSearchCriteria, providerDatabase: any[]): ProviderDirectoryListing[];
/**
 * 15. Creates provider directory listing for public display.
 *
 * @param {string} providerId - Provider ID
 * @param {any} providerData - Provider data
 * @returns {ProviderDirectoryListing} Directory listing
 *
 * @example
 * ```typescript
 * const listing = createDirectoryListing('provider-123', providerData);
 * // Public-facing provider information for directory
 * ```
 */
export declare function createDirectoryListing(providerId: string, providerData: any): ProviderDirectoryListing;
/**
 * 16. Formats provider display name with credentials.
 *
 * @param {any} provider - Provider data
 * @returns {string} Formatted display name
 *
 * @example
 * ```typescript
 * const name = formatProviderDisplayName({
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   credentials: ['MD', 'FACP']
 * });
 * // Result: "Jane Smith, MD, FACP"
 * ```
 */
export declare function formatProviderDisplayName(provider: any): string;
/**
 * 17. Calculates distance between provider and patient location.
 *
 * @param {object} providerLocation - Provider location
 * @param {object} patientLocation - Patient location
 * @returns {number} Distance in miles
 *
 * @example
 * ```typescript
 * const distance = calculateProviderDistance(
 *   { latitude: 37.7749, longitude: -122.4194 },
 *   { latitude: 37.8044, longitude: -122.2712 }
 * );
 * // Result: ~10.5 miles
 * ```
 */
export declare function calculateProviderDistance(providerLocation: {
    latitude: number;
    longitude: number;
}, patientLocation: {
    latitude: number;
    longitude: number;
}): number;
/**
 * 18. Filters providers within radius of location.
 *
 * @param {any[]} providers - Provider list
 * @param {object} location - Center location
 * @param {number} radiusMiles - Search radius in miles
 * @returns {Array} Providers with distance
 *
 * @example
 * ```typescript
 * const nearby = filterProvidersByRadius(
 *   allProviders,
 *   { latitude: 37.7749, longitude: -122.4194 },
 *   25
 * );
 * ```
 */
export declare function filterProvidersByRadius(providers: any[], location: {
    latitude: number;
    longitude: number;
}, radiusMiles: number): Array<{
    provider: any;
    distance: number;
}>;
/**
 * 19. Generates provider profile summary for display.
 *
 * @param {string} providerId - Provider ID
 * @param {any} providerData - Full provider data
 * @returns {object} Profile summary
 *
 * @example
 * ```typescript
 * const profile = generateProviderProfileSummary('provider-123', fullData);
 * // Complete provider profile for patient-facing display
 * ```
 */
export declare function generateProviderProfileSummary(providerId: string, providerData: any): {
    basicInfo: {
        name: string;
        credentials: string[];
        specialties: string[];
        yearsOfExperience: number;
    };
    contact: {
        phone: string;
        address: string;
    };
    education: any[];
    certifications: any[];
    languages: string[];
    acceptingNewPatients: boolean;
    rating?: number;
};
/**
 * 20. Adds specialty to provider profile.
 *
 * @param {ProviderSpecialty} specialty - Specialty information
 * @returns {ProviderSpecialty} Created specialty record
 *
 * @example
 * ```typescript
 * const specialty = await addProviderSpecialty({
 *   providerId: 'provider-123',
 *   specialty: 'Family Medicine',
 *   specialtyCode: '207Q00000X',
 *   isPrimary: true,
 *   boardCertified: true,
 *   yearsOfExperience: 15
 * });
 * ```
 */
export declare function addProviderSpecialty(specialty: ProviderSpecialty): ProviderSpecialty;
/**
 * 21. Adds board certification to provider record.
 *
 * @param {BoardCertification} certification - Board certification info
 * @returns {BoardCertification} Created certification record
 *
 * @example
 * ```typescript
 * const cert = await addBoardCertification({
 *   providerId: 'provider-123',
 *   boardName: 'American Board of Family Medicine',
 *   specialty: 'Family Medicine',
 *   certificationNumber: 'ABFM-123456',
 *   certificationDate: new Date('2015-01-01'),
 *   expirationDate: new Date('2025-12-31'),
 *   status: 'active'
 * });
 * ```
 */
export declare function addBoardCertification(certification: BoardCertification): BoardCertification;
/**
 * 22. Verifies board certification with ABMS.
 *
 * @param {BoardCertification} certification - Certification to verify
 * @returns {Promise<object>} Verification result
 *
 * @example
 * ```typescript
 * const result = await verifyBoardCertification(certification);
 * if (result.verified) {
 *   console.log('Certification verified via ABMS');
 * }
 * ```
 */
export declare function verifyBoardCertification(certification: BoardCertification): Promise<{
    verified: boolean;
    verificationDate: Date;
    source: string;
    status?: string;
    expirationDate?: Date;
}>;
/**
 * 23. Checks board certification expiration status.
 *
 * @param {BoardCertification[]} certifications - Provider certifications
 * @returns {Array} Expiration alerts
 *
 * @example
 * ```typescript
 * const alerts = checkCertificationExpiration(providerCerts);
 * alerts.forEach(alert => {
 *   if (alert.expiresWithin90Days) {
 *     sendRecertificationReminder(alert);
 *   }
 * });
 * ```
 */
export declare function checkCertificationExpiration(certifications: BoardCertification[]): Array<{
    certificationId: string;
    specialty: string;
    daysUntilExpiration?: number;
    expired: boolean;
    expiresWithin90Days: boolean;
}>;
/**
 * 24. Retrieves provider certifications and specialties.
 *
 * @param {string} providerId - Provider ID
 * @param {any} database - Data source
 * @returns {object} Certifications and specialties
 *
 * @example
 * ```typescript
 * const credentials = await getProviderCredentials('provider-123', db);
 * console.log('Specialties:', credentials.specialties);
 * console.log('Board Certifications:', credentials.certifications);
 * ```
 */
export declare function getProviderCredentials(providerId: string, database: any): {
    specialties: ProviderSpecialty[];
    certifications: BoardCertification[];
    licenses: MedicalLicense[];
    deaRegistrations: DEARegistration[];
};
/**
 * 25. Validates provider specialty against accepted list.
 *
 * @param {string} specialty - Specialty name
 * @returns {object} Validation result with standard code
 *
 * @example
 * ```typescript
 * const result = validateSpecialty('Family Medicine');
 * // Result: { valid: true, standardName: 'Family Medicine', code: '207Q00000X' }
 * ```
 */
export declare function validateSpecialty(specialty: string): {
    valid: boolean;
    standardName?: string;
    code?: string;
    error?: string;
};
/**
 * 26. Creates provider schedule template.
 *
 * @param {ProviderSchedule} schedule - Schedule configuration
 * @returns {ProviderSchedule} Created schedule
 *
 * @example
 * ```typescript
 * const schedule = await createProviderSchedule({
 *   providerId: 'provider-123',
 *   facilityId: 'facility-456',
 *   dayOfWeek: 1, // Monday
 *   startTime: '09:00',
 *   endTime: '17:00',
 *   slotDuration: 15,
 *   maxPatients: 32,
 *   effectiveDate: new Date(),
 *   status: 'active'
 * });
 * ```
 */
export declare function createProviderSchedule(schedule: ProviderSchedule): ProviderSchedule;
/**
 * 27. Generates available time slots for provider.
 *
 * @param {ProviderSchedule} schedule - Provider schedule
 * @param {Date} date - Target date
 * @param {AvailabilitySlot[]} existingSlots - Existing bookings
 * @returns {AvailabilitySlot[]} Available time slots
 *
 * @example
 * ```typescript
 * const slots = generateAvailableSlots(
 *   providerSchedule,
 *   new Date('2024-01-15'),
 *   existingBookings
 * );
 * // Returns all available 15-minute slots
 * ```
 */
export declare function generateAvailableSlots(schedule: ProviderSchedule, date: Date, existingSlots: AvailabilitySlot[]): AvailabilitySlot[];
/**
 * 28. Checks provider availability for specific time range.
 *
 * @param {string} providerId - Provider ID
 * @param {Date} startDateTime - Start date/time
 * @param {Date} endDateTime - End date/time
 * @param {AvailabilitySlot[]} existingSlots - Existing bookings
 * @returns {object} Availability status
 *
 * @example
 * ```typescript
 * const available = checkProviderAvailability(
 *   'provider-123',
 *   new Date('2024-01-15T10:00:00'),
 *   new Date('2024-01-15T10:30:00'),
 *   existingSlots
 * );
 * ```
 */
export declare function checkProviderAvailability(providerId: string, startDateTime: Date, endDateTime: Date, existingSlots: AvailabilitySlot[]): {
    available: boolean;
    conflicts?: AvailabilitySlot[];
};
/**
 * 29. Blocks provider time slot (PTO, meetings, etc.).
 *
 * @param {string} providerId - Provider ID
 * @param {Date} startDateTime - Start date/time
 * @param {Date} endDateTime - End date/time
 * @param {string} reason - Reason for blocking
 * @returns {AvailabilitySlot} Blocked time slot
 *
 * @example
 * ```typescript
 * const blocked = await blockProviderTime(
 *   'provider-123',
 *   new Date('2024-01-15T09:00:00'),
 *   new Date('2024-01-15T17:00:00'),
 *   'Vacation - PTO'
 * );
 * ```
 */
export declare function blockProviderTime(providerId: string, startDateTime: Date, endDateTime: Date, reason: string): AvailabilitySlot;
/**
 * 30. Finds next available appointment slot for provider.
 *
 * @param {string} providerId - Provider ID
 * @param {ProviderSchedule[]} schedules - Provider schedules
 * @param {AvailabilitySlot[]} existingSlots - Existing bookings
 * @param {number} daysToSearch - Days to search ahead (default: 30)
 * @returns {AvailabilitySlot | null} Next available slot
 *
 * @example
 * ```typescript
 * const nextSlot = findNextAvailableSlot(
 *   'provider-123',
 *   providerSchedules,
 *   existingBookings,
 *   30
 * );
 *
 * if (nextSlot) {
 *   console.log('Next available:', nextSlot.startDateTime);
 * }
 * ```
 */
export declare function findNextAvailableSlot(providerId: string, schedules: ProviderSchedule[], existingSlots: AvailabilitySlot[], daysToSearch?: number): AvailabilitySlot | null;
/**
 * 31. Calculates provider schedule utilization rate.
 *
 * @param {string} providerId - Provider ID
 * @param {ProviderSchedule[]} schedules - Provider schedules
 * @param {AvailabilitySlot[]} bookedSlots - Booked appointments
 * @param {Date} periodStart - Analysis period start
 * @param {Date} periodEnd - Analysis period end
 * @returns {object} Utilization metrics
 *
 * @example
 * ```typescript
 * const utilization = calculateScheduleUtilization(
 *   'provider-123',
 *   schedules,
 *   bookedSlots,
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * // Result: { utilizationRate: 0.85, totalSlots: 320, bookedSlots: 272 }
 * ```
 */
export declare function calculateScheduleUtilization(providerId: string, schedules: ProviderSchedule[], bookedSlots: AvailabilitySlot[], periodStart: Date, periodEnd: Date): {
    utilizationRate: number;
    totalSlots: number;
    bookedSlots: number;
    availableSlots: number;
};
/**
 * 32. Grants hospital privileges to provider.
 *
 * @param {HospitalPrivileges} privileges - Privilege information
 * @returns {HospitalPrivileges} Created privilege record
 *
 * @example
 * ```typescript
 * const privileges = await grantHospitalPrivileges({
 *   providerId: 'provider-123',
 *   facilityId: 'hospital-456',
 *   facilityName: 'White Cross Medical Center',
 *   privilegeType: 'admitting',
 *   departments: ['Internal Medicine', 'ICU'],
 *   grantedDate: new Date(),
 *   expirationDate: new Date('2026-12-31'),
 *   status: 'active',
 *   medicalStaffCategory: 'active'
 * });
 * ```
 */
export declare function grantHospitalPrivileges(privileges: HospitalPrivileges): HospitalPrivileges;
/**
 * 33. Checks privilege expiration and renewal requirements.
 *
 * @param {HospitalPrivileges[]} privileges - Provider privileges
 * @returns {Array} Privilege renewal alerts
 *
 * @example
 * ```typescript
 * const alerts = checkPrivilegeRenewal(providerPrivileges);
 * alerts.forEach(alert => {
 *   if (alert.requiresRenewal) {
 *     initiatePrivilegeRenewal(alert);
 *   }
 * });
 * ```
 */
export declare function checkPrivilegeRenewal(privileges: HospitalPrivileges[]): Array<{
    privilegeId: string;
    facilityName: string;
    daysUntilExpiration?: number;
    requiresRenewal: boolean;
    expired: boolean;
}>;
/**
 * 34. Retrieves provider hospital affiliations.
 *
 * @param {string} providerId - Provider ID
 * @param {HospitalPrivileges[]} allPrivileges - All privilege records
 * @returns {Array} Active hospital affiliations
 *
 * @example
 * ```typescript
 * const affiliations = getProviderAffiliations('provider-123', allPrivileges);
 * // Returns list of hospitals where provider has active privileges
 * ```
 */
export declare function getProviderAffiliations(providerId: string, allPrivileges: HospitalPrivileges[]): Array<{
    facilityId: string;
    facilityName: string;
    privilegeTypes: string[];
    departments: string[];
    status: string;
}>;
/**
 * 35. Validates provider has required privileges for procedure.
 *
 * @param {string} providerId - Provider ID
 * @param {string} facilityId - Facility ID
 * @param {string} procedure - Procedure name
 * @param {HospitalPrivileges[]} privileges - Provider privileges
 * @returns {object} Privilege validation result
 *
 * @example
 * ```typescript
 * const result = validateProviderPrivileges(
 *   'provider-123',
 *   'hospital-456',
 *   'Appendectomy',
 *   providerPrivileges
 * );
 *
 * if (!result.authorized) {
 *   throw new ForbiddenException(result.reason);
 * }
 * ```
 */
export declare function validateProviderPrivileges(providerId: string, facilityId: string, procedure: string, privileges: HospitalPrivileges[]): {
    authorized: boolean;
    reason?: string;
    privilegeType?: string;
};
/**
 * 36. Records peer review for provider.
 *
 * @param {PeerReview} review - Peer review information
 * @returns {PeerReview} Created review record
 *
 * @example
 * ```typescript
 * const review = await recordPeerReview({
 *   providerId: 'provider-123',
 *   reviewType: 'clinical_quality',
 *   reviewDate: new Date(),
 *   reviewPeriod: {
 *     start: new Date('2024-01-01'),
 *     end: new Date('2024-03-31')
 *   },
 *   outcome: 'satisfactory',
 *   findings: 'Quality of care meets standards',
 *   confidential: true
 * });
 * ```
 */
export declare function recordPeerReview(review: PeerReview): PeerReview;
/**
 * 37. Adds provider to referral network.
 *
 * @param {ReferralNetwork} network - Referral network configuration
 * @returns {ReferralNetwork} Created network record
 *
 * @example
 * ```typescript
 * const network = await addToReferralNetwork({
 *   providerId: 'provider-123',
 *   networkName: 'Cardiology Referral Network',
 *   referralType: 'accepting',
 *   specialties: ['Cardiology', 'Interventional Cardiology'],
 *   maxReferralsPerMonth: 50,
 *   status: 'active'
 * });
 * ```
 */
export declare function addToReferralNetwork(network: ReferralNetwork): ReferralNetwork;
/**
 * 38. Finds providers in referral network by specialty.
 *
 * @param {string} specialty - Specialty to search
 * @param {ReferralNetwork[]} networks - All referral networks
 * @param {any[]} providers - Provider database
 * @returns {Array} Matching providers with network info
 *
 * @example
 * ```typescript
 * const specialists = findReferralProviders(
 *   'Cardiology',
 *   referralNetworks,
 *   allProviders
 * );
 *
 * specialists.forEach(spec => {
 *   console.log(`${spec.name} - Accepting: ${spec.acceptingReferrals}`);
 * });
 * ```
 */
export declare function findReferralProviders(specialty: string, networks: ReferralNetwork[], providers: any[]): Array<{
    providerId: string;
    name: string;
    specialty: string;
    acceptingReferrals: boolean;
    maxReferrals?: number;
    currentReferrals?: number;
    qualityMetrics?: any;
}>;
/**
 * 39. Tracks referral and updates network metrics.
 *
 * @param {string} networkId - Referral network ID
 * @param {string} referralId - Referral ID
 * @returns {ReferralNetwork} Updated network
 *
 * @example
 * ```typescript
 * const updated = await trackReferral('network-123', 'referral-456');
 * // Increments currentReferrals counter
 * ```
 */
export declare function trackReferral(networkId: string, referralId: string): ReferralNetwork;
/**
 * 40. Generates provider performance report.
 *
 * @param {string} providerId - Provider ID
 * @param {Date} periodStart - Report period start
 * @param {Date} periodEnd - Report period end
 * @param {any} performanceData - Performance data
 * @returns {ProviderPerformance} Performance metrics
 *
 * @example
 * ```typescript
 * const report = generateProviderPerformance(
 *   'provider-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-03-31'),
 *   performanceData
 * );
 *
 * console.log('Patient Satisfaction:', report.qualityMetrics.patientSatisfactionScore);
 * console.log('Utilization Rate:', report.productivityMetrics.utilizationRate);
 * ```
 */
export declare function generateProviderPerformance(providerId: string, periodStart: Date, periodEnd: Date, performanceData: any): ProviderPerformance;
declare const _default: {
    validateNPI: typeof validateNPI;
    lookupNPIRegistry: typeof lookupNPIRegistry;
    registerProvider: typeof registerProvider;
    initiateCredentialing: typeof initiateCredentialing;
    verifyPrimarySource: typeof verifyPrimarySource;
    updateCredentialingStatus: typeof updateCredentialingStatus;
    checkRecredentialingStatus: typeof checkRecredentialingStatus;
    validateDEANumber: typeof validateDEANumber;
    validateMedicalLicense: typeof validateMedicalLicense;
    addMedicalLicense: typeof addMedicalLicense;
    addDEARegistration: typeof addDEARegistration;
    checkLicenseExpiration: typeof checkLicenseExpiration;
    validateTaxonomyCode: typeof validateTaxonomyCode;
    searchProviderDirectory: typeof searchProviderDirectory;
    createDirectoryListing: typeof createDirectoryListing;
    formatProviderDisplayName: typeof formatProviderDisplayName;
    calculateProviderDistance: typeof calculateProviderDistance;
    filterProvidersByRadius: typeof filterProvidersByRadius;
    generateProviderProfileSummary: typeof generateProviderProfileSummary;
    addProviderSpecialty: typeof addProviderSpecialty;
    addBoardCertification: typeof addBoardCertification;
    verifyBoardCertification: typeof verifyBoardCertification;
    checkCertificationExpiration: typeof checkCertificationExpiration;
    getProviderCredentials: typeof getProviderCredentials;
    validateSpecialty: typeof validateSpecialty;
    createProviderSchedule: typeof createProviderSchedule;
    generateAvailableSlots: typeof generateAvailableSlots;
    checkProviderAvailability: typeof checkProviderAvailability;
    blockProviderTime: typeof blockProviderTime;
    findNextAvailableSlot: typeof findNextAvailableSlot;
    calculateScheduleUtilization: typeof calculateScheduleUtilization;
    grantHospitalPrivileges: typeof grantHospitalPrivileges;
    checkPrivilegeRenewal: typeof checkPrivilegeRenewal;
    getProviderAffiliations: typeof getProviderAffiliations;
    validateProviderPrivileges: typeof validateProviderPrivileges;
    recordPeerReview: typeof recordPeerReview;
    addToReferralNetwork: typeof addToReferralNetwork;
    findReferralProviders: typeof findReferralProviders;
    trackReferral: typeof trackReferral;
    generateProviderPerformance: typeof generateProviderPerformance;
};
export default _default;
//# sourceMappingURL=health-provider-management-kit.d.ts.map