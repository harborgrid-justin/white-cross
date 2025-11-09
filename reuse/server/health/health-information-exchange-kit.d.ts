/**
 * LOC: HLTH-HIE-001
 * File: /reuse/server/health/health-information-exchange-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - class-transformer
 *   - fhir/r4 (HL7 FHIR R4)
 *   - crypto (Node.js)
 *   - nodemailer (SMTP/S)
 *   - xml2js
 *
 * DOWNSTREAM (imported by):
 *   - HIE integration services
 *   - Care coordination modules
 *   - Document exchange services
 *   - Provider directory services
 *   - Patient matching services
 */
/**
 * HL7 v2 message types
 */
export type HL7MessageType = 'ADT' | 'ORU' | 'ORM' | 'SIU' | 'MDM' | 'DFT' | 'BAR';
/**
 * HL7 v2 ADT event types
 */
export type ADTEventType = 'A01' | 'A02' | 'A03' | 'A04' | 'A05' | 'A08' | 'A11' | 'A12' | 'A13';
/**
 * Parsed HL7 v2 message structure
 */
export interface HL7Message {
    messageType: HL7MessageType;
    eventType: string;
    messageControlId: string;
    timestamp: Date;
    sendingApplication: string;
    sendingFacility: string;
    receivingApplication: string;
    receivingFacility: string;
    versionId: string;
    segments: HL7Segment[];
    pid?: PatientIdentificationSegment;
    pv1?: PatientVisitSegment;
    obr?: ObservationRequestSegment[];
    obx?: ObservationResultSegment[];
    orc?: OrderControlSegment[];
}
/**
 * HL7 v2 segment
 */
export interface HL7Segment {
    type: string;
    fields: string[];
    rawSegment: string;
}
/**
 * HL7 PID segment (Patient Identification)
 */
export interface PatientIdentificationSegment {
    patientId: string;
    patientIdentifierList: Array<{
        id: string;
        checkDigit?: string;
        idType: string;
        assigningAuthority?: string;
    }>;
    patientName: {
        familyName: string;
        givenName: string;
        middleName?: string;
        suffix?: string;
        prefix?: string;
    };
    dateOfBirth?: Date;
    sex?: string;
    patientAddress?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country?: string;
    };
    phoneHome?: string;
    phoneWork?: string;
    maritalStatus?: string;
    race?: string;
    ssn?: string;
    driversLicense?: string;
}
/**
 * HL7 PV1 segment (Patient Visit)
 */
export interface PatientVisitSegment {
    setId: string;
    patientClass: string;
    assignedPatientLocation?: {
        pointOfCare?: string;
        room?: string;
        bed?: string;
        facility?: string;
        building?: string;
        floor?: string;
    };
    admissionType?: string;
    attendingDoctor?: {
        id: string;
        familyName: string;
        givenName: string;
        idType?: string;
    };
    referringDoctor?: any;
    consultingDoctor?: any;
    hospitalService?: string;
    admitDateTime?: Date;
    dischargeDateTime?: Date;
    visitNumber?: string;
}
/**
 * HL7 OBR segment (Observation Request)
 */
export interface ObservationRequestSegment {
    setId: string;
    placerOrderNumber?: string;
    fillerOrderNumber?: string;
    universalServiceId: {
        identifier: string;
        text: string;
        codingSystem: string;
    };
    observationDateTime?: Date;
    specimenReceivedDateTime?: Date;
    orderingProvider?: any;
    resultStatus?: string;
}
/**
 * HL7 OBX segment (Observation Result)
 */
export interface ObservationResultSegment {
    setId: string;
    valueType: string;
    observationIdentifier: {
        identifier: string;
        text: string;
        codingSystem: string;
    };
    observationSubId?: string;
    observationValue: any;
    units?: string;
    referenceRange?: string;
    abnormalFlags?: string[];
    observationResultStatus: string;
    observationDateTime?: Date;
}
/**
 * HL7 ORC segment (Order Control)
 */
export interface OrderControlSegment {
    orderControl: string;
    placerOrderNumber?: string;
    fillerOrderNumber?: string;
    orderStatus?: string;
    orderDateTime?: Date;
    orderingProvider?: any;
}
/**
 * FHIR resource types for conversion
 */
export type FHIRResourceType = 'Patient' | 'Observation' | 'DiagnosticReport' | 'MedicationRequest' | 'Encounter' | 'Practitioner' | 'Organization' | 'DocumentReference';
/**
 * FHIR Bundle structure
 */
export interface FHIRBundle {
    resourceType: 'Bundle';
    type: 'transaction' | 'batch' | 'collection' | 'document' | 'searchset';
    timestamp?: string;
    total?: number;
    entry: Array<{
        fullUrl?: string;
        resource: any;
        request?: {
            method: 'GET' | 'POST' | 'PUT' | 'DELETE';
            url: string;
        };
    }>;
}
/**
 * Continuity of Care Document (CCD) structure
 */
export interface ContinuityOfCareDocument {
    patientId: string;
    documentId: string;
    documentDate: Date;
    author: {
        id: string;
        name: string;
        organization?: string;
    };
    custodian: {
        id: string;
        name: string;
        address?: string;
    };
    sections: {
        allergies?: CCDAllergy[];
        medications?: CCDMedication[];
        problems?: CCDProblem[];
        procedures?: CCDProcedure[];
        vitalSigns?: CCDVitalSign[];
        immunizations?: CCDImmunization[];
        socialHistory?: CCDSocialHistory;
        familyHistory?: CCDFamilyHistory[];
        results?: CCDResult[];
    };
    encounterId?: string;
    reasonForVisit?: string;
}
/**
 * CCD Allergy entry
 */
export interface CCDAllergy {
    substance: string;
    substanceCode?: string;
    reaction?: string;
    severity?: 'mild' | 'moderate' | 'severe';
    status: 'active' | 'inactive' | 'resolved';
    onsetDate?: Date;
    notes?: string;
}
/**
 * CCD Medication entry
 */
export interface CCDMedication {
    name: string;
    code?: string;
    dose?: string;
    route?: string;
    frequency?: string;
    startDate?: Date;
    endDate?: Date;
    status: 'active' | 'completed' | 'discontinued';
    prescriber?: string;
    instructions?: string;
}
/**
 * CCD Problem entry
 */
export interface CCDProblem {
    description: string;
    code?: string;
    codeSystem?: string;
    status: 'active' | 'inactive' | 'resolved';
    onsetDate?: Date;
    resolutionDate?: Date;
    severity?: string;
}
/**
 * CCD Procedure entry
 */
export interface CCDProcedure {
    description: string;
    code?: string;
    codeSystem?: string;
    performedDate: Date;
    performer?: string;
    location?: string;
    status: 'completed' | 'in-progress' | 'cancelled';
}
/**
 * CCD Vital Sign entry
 */
export interface CCDVitalSign {
    type: string;
    value: number;
    unit: string;
    date: Date;
    method?: string;
}
/**
 * CCD Immunization entry
 */
export interface CCDImmunization {
    vaccine: string;
    vaccineCode?: string;
    administeredDate: Date;
    doseNumber?: number;
    route?: string;
    site?: string;
    lotNumber?: string;
    expirationDate?: Date;
    performer?: string;
}
/**
 * CCD Social History
 */
export interface CCDSocialHistory {
    smokingStatus?: 'current' | 'former' | 'never' | 'unknown';
    alcoholUse?: string;
    occupation?: string;
    educationLevel?: string;
}
/**
 * CCD Family History entry
 */
export interface CCDFamilyHistory {
    relationship: string;
    condition: string;
    onsetAge?: number;
    deceased?: boolean;
}
/**
 * CCD Lab Result entry
 */
export interface CCDResult {
    testName: string;
    testCode?: string;
    value: string;
    unit?: string;
    referenceRange?: string;
    interpretation?: string;
    date: Date;
    status: 'final' | 'preliminary' | 'corrected';
}
/**
 * Patient consent for HIE
 */
export interface HIEConsent {
    id?: string;
    patientId: string;
    consentType: 'opt-in' | 'opt-out' | 'break-glass';
    scope: 'full' | 'limited' | 'emergency-only';
    status: 'active' | 'inactive' | 'revoked' | 'expired';
    effectiveDate: Date;
    expirationDate?: Date;
    authorizedOrganizations?: string[];
    authorizedProviders?: string[];
    dataCategories?: string[];
    restrictions?: string[];
    signedBy?: string;
    signatureDate?: Date;
    witnessedBy?: string;
    documentId?: string;
    revokedDate?: Date;
    revokedBy?: string;
    revokedReason?: string;
}
/**
 * Master Patient Index entry
 */
export interface MPIEntry {
    mpiId: string;
    sourceSystem: string;
    sourcePatientId: string;
    demographics: {
        firstName: string;
        middleName?: string;
        lastName: string;
        dateOfBirth: Date;
        sex: 'M' | 'F' | 'U';
        ssn?: string;
        mrn?: string;
    };
    addresses?: Array<{
        street: string;
        city: string;
        state: string;
        zip: string;
    }>;
    phones?: string[];
    emails?: string[];
    identifiers?: Array<{
        type: string;
        value: string;
        system?: string;
    }>;
    matchConfidence?: number;
    linkages?: Array<{
        linkedMpiId: string;
        linkType: 'certain' | 'probable' | 'possible';
        linkScore: number;
    }>;
    lastUpdated: Date;
    active: boolean;
}
/**
 * Patient matching criteria
 */
export interface PatientMatchCriteria {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    sex?: string;
    ssn?: string;
    phone?: string;
    email?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
    };
    fuzzyMatch?: boolean;
    threshold?: number;
}
/**
 * Patient match result
 */
export interface PatientMatchResult {
    mpiId: string;
    matchScore: number;
    confidence: 'certain' | 'probable' | 'possible' | 'unlikely';
    matchedFields: string[];
    demographics: any;
    sourceRecords: Array<{
        system: string;
        patientId: string;
    }>;
}
/**
 * Document metadata for XDS
 */
export interface DocumentMetadata {
    documentId: string;
    repositoryUniqueId: string;
    title: string;
    mimeType: string;
    classCode: string;
    typeCode: string;
    formatCode: string;
    creationTime: Date;
    serviceStartTime?: Date;
    serviceStopTime?: Date;
    patientId: string;
    sourcePatientId?: string;
    authorPerson?: string;
    authorInstitution?: string;
    confidentialityCode?: string;
    languageCode?: string;
    size?: number;
    hash?: string;
    uri?: string;
}
/**
 * Document query parameters
 */
export interface DocumentQuery {
    patientId: string;
    classCode?: string[];
    typeCode?: string[];
    creationTimeFrom?: Date;
    creationTimeTo?: Date;
    serviceStartTimeFrom?: Date;
    serviceStartTimeTo?: Date;
    status?: string[];
    authorPerson?: string;
    facilityCode?: string[];
}
/**
 * Direct message structure (SMTP/S)
 */
export interface DirectMessage {
    messageId: string;
    from: string;
    to: string[];
    cc?: string[];
    subject: string;
    body: string;
    attachments?: Array<{
        filename: string;
        contentType: string;
        content: Buffer;
        size: number;
    }>;
    headers?: Record<string, string>;
    encrypted?: boolean;
    signed?: boolean;
    timestamp: Date;
    patientId?: string;
}
/**
 * Provider directory entry
 */
export interface ProviderDirectoryEntry {
    npi: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    suffix?: string;
    credentials?: string[];
    specialty?: string;
    subspecialty?: string[];
    taxonomyCode?: string;
    organizationName?: string;
    organizationNPI?: string;
    addresses: Array<{
        type: 'practice' | 'mailing' | 'primary' | 'secondary';
        street1: string;
        street2?: string;
        city: string;
        state: string;
        zip: string;
        country?: string;
        phone?: string;
        fax?: string;
    }>;
    phoneNumbers?: string[];
    faxNumbers?: string[];
    email?: string;
    licenseNumber?: string;
    licenseState?: string;
    deaNumber?: string;
    acceptingNewPatients?: boolean;
    languages?: string[];
    hospitalAffiliations?: string[];
    lastUpdated?: Date;
}
/**
 * Audit trail entry for HIE
 */
export interface HIEAuditEntry {
    id?: string;
    timestamp: Date;
    action: 'access' | 'create' | 'update' | 'delete' | 'query' | 'send' | 'receive' | 'disclosure';
    userId: string;
    userRole?: string;
    patientId: string;
    documentId?: string;
    resourceType?: string;
    organizationId: string;
    facilityId?: string;
    purpose: 'treatment' | 'payment' | 'operations' | 'research' | 'public-health' | 'emergency';
    sourceSystem: string;
    destinationSystem?: string;
    ipAddress: string;
    userAgent?: string;
    success: boolean;
    errorMessage?: string;
    dataAccessed?: string[];
    consentId?: string;
    legalBasis?: string;
}
/**
 * 1. Parses HL7 v2 message into structured format.
 *
 * @param {string} hl7Message - Raw HL7 v2 message with segment separators
 * @returns {HL7Message} Parsed message structure
 *
 * @example
 * ```typescript
 * const message = parseHL7Message(rawHL7);
 * console.log(`${message.messageType}^${message.eventType}`);
 * // Access patient data
 * const patientName = message.pid?.patientName;
 * ```
 */
export declare function parseHL7Message(hl7Message: string): HL7Message;
/**
 * 2. Parses HL7 ADT (Admit, Discharge, Transfer) message.
 *
 * @param {string} adtMessage - Raw ADT message
 * @returns {HL7Message} Parsed ADT message with patient and visit data
 *
 * @example
 * ```typescript
 * const adt = parseADTMessage(rawADT);
 * if (adt.eventType === 'A01') {
 *   console.log(`Patient admitted: ${adt.pid?.patientName.familyName}`);
 *   console.log(`Room: ${adt.pv1?.assignedPatientLocation?.room}`);
 * }
 * ```
 */
export declare function parseADTMessage(adtMessage: string): HL7Message;
/**
 * 3. Parses HL7 ORU (Observation Result) message for lab results.
 *
 * @param {string} oruMessage - Raw ORU message
 * @returns {HL7Message} Parsed ORU message with observation results
 *
 * @example
 * ```typescript
 * const oru = parseORUMessage(rawORU);
 * oru.obx?.forEach(obs => {
 *   console.log(`${obs.observationIdentifier.text}: ${obs.observationValue}`);
 * });
 * ```
 */
export declare function parseORUMessage(oruMessage: string): HL7Message;
/**
 * 4. Parses HL7 ORM (Order) message for medication/procedure orders.
 *
 * @param {string} ormMessage - Raw ORM message
 * @returns {HL7Message} Parsed ORM message with order data
 *
 * @example
 * ```typescript
 * const orm = parseORMMessage(rawORM);
 * const orderControl = orm.orc?.[0]?.orderControl;
 * console.log(`Order control: ${orderControl}`);
 * ```
 */
export declare function parseORMMessage(ormMessage: string): HL7Message;
/**
 * 5. Builds HL7 v2 message from structured data.
 *
 * @param {HL7Message} message - Structured HL7 message
 * @returns {string} HL7 v2 formatted string
 *
 * @example
 * ```typescript
 * const hl7String = buildHL7Message({
 *   messageType: 'ADT',
 *   eventType: 'A04',
 *   messageControlId: '12345',
 *   sendingApplication: 'WhiteCross',
 *   // ... other fields
 * });
 * ```
 */
export declare function buildHL7Message(message: HL7Message): string;
/**
 * 6. Validates HL7 message structure and required fields.
 *
 * @param {HL7Message} message - Parsed HL7 message
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateHL7Message(parsedMessage);
 * if (!validation.valid) {
 *   console.error('HL7 validation errors:', validation.errors);
 * }
 * ```
 */
export declare function validateHL7Message(message: HL7Message): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 7. Extracts patient demographics from HL7 message.
 *
 * @param {HL7Message} message - Parsed HL7 message
 * @returns {PatientIdentificationSegment | null} Patient demographics
 *
 * @example
 * ```typescript
 * const patient = extractPatientFromHL7(message);
 * if (patient) {
 *   console.log(`${patient.patientName.givenName} ${patient.patientName.familyName}`);
 * }
 * ```
 */
export declare function extractPatientFromHL7(message: HL7Message): PatientIdentificationSegment | null;
/**
 * 8. Converts HL7 v2 message to FHIR Bundle.
 *
 * @param {HL7Message} hl7Message - Parsed HL7 message
 * @returns {FHIRBundle} FHIR Bundle with converted resources
 *
 * @example
 * ```typescript
 * const bundle = convertHL7ToFHIR(parsedHL7);
 * bundle.entry.forEach(entry => {
 *   console.log(`Resource: ${entry.resource.resourceType}`);
 * });
 * ```
 */
export declare function convertHL7ToFHIR(hl7Message: HL7Message): FHIRBundle;
/**
 * 9. Converts HL7 PID segment to FHIR Patient resource.
 *
 * @param {PatientIdentificationSegment} pid - HL7 PID segment
 * @returns {any} FHIR Patient resource
 *
 * @example
 * ```typescript
 * const fhirPatient = convertPIDToFHIRPatient(hl7Message.pid);
 * console.log(`Patient ID: ${fhirPatient.id}`);
 * ```
 */
export declare function convertPIDToFHIRPatient(pid: PatientIdentificationSegment): any;
/**
 * 10. Converts HL7 OBX segment to FHIR Observation resource.
 *
 * @param {ObservationResultSegment} obx - HL7 OBX segment
 * @param {string} patientId - Patient identifier
 * @returns {any} FHIR Observation resource
 *
 * @example
 * ```typescript
 * const observation = convertOBXToFHIRObservation(obx, 'patient-123');
 * console.log(`Observation: ${observation.code.coding[0].display}`);
 * ```
 */
export declare function convertOBXToFHIRObservation(obx: ObservationResultSegment, patientId?: string): any;
/**
 * 11. Converts FHIR Patient resource to HL7 PID segment.
 *
 * @param {any} fhirPatient - FHIR Patient resource
 * @returns {PatientIdentificationSegment} HL7 PID segment
 *
 * @example
 * ```typescript
 * const pid = convertFHIRPatientToPID(fhirPatient);
 * const hl7Message = buildHL7MessageWithPID(pid);
 * ```
 */
export declare function convertFHIRPatientToPID(fhirPatient: any): PatientIdentificationSegment;
/**
 * 12. Creates FHIR Bundle from multiple resources.
 *
 * @param {any[]} resources - Array of FHIR resources
 * @param {string} bundleType - Bundle type
 * @returns {FHIRBundle} FHIR Bundle
 *
 * @example
 * ```typescript
 * const bundle = createFHIRBundle([patient, encounter, observation], 'transaction');
 * await fhirClient.create(bundle);
 * ```
 */
export declare function createFHIRBundle(resources: any[], bundleType?: 'transaction' | 'batch' | 'collection' | 'document'): FHIRBundle;
/**
 * 13. Extracts resources from FHIR Bundle by type.
 *
 * @param {FHIRBundle} bundle - FHIR Bundle
 * @param {FHIRResourceType} resourceType - Resource type to extract
 * @returns {any[]} Array of matching resources
 *
 * @example
 * ```typescript
 * const patients = extractResourcesFromBundle(bundle, 'Patient');
 * const observations = extractResourcesFromBundle(bundle, 'Observation');
 * ```
 */
export declare function extractResourcesFromBundle(bundle: FHIRBundle, resourceType: FHIRResourceType): any[];
/**
 * 14. Validates FHIR resource against schema.
 *
 * @param {any} resource - FHIR resource
 * @param {FHIRResourceType} expectedType - Expected resource type
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateFHIRResource(patient, 'Patient');
 * if (!validation.valid) {
 *   console.error('FHIR validation errors:', validation.errors);
 * }
 * ```
 */
export declare function validateFHIRResource(resource: any, expectedType: FHIRResourceType): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 15. Generates Continuity of Care Document (CCD) in C-CDA format.
 *
 * @param {ContinuityOfCareDocument} ccd - CCD data
 * @returns {string} XML formatted CCD
 *
 * @example
 * ```typescript
 * const ccdXml = generateCCD({
 *   patientId: 'patient-123',
 *   documentId: 'doc-456',
 *   documentDate: new Date(),
 *   author: { id: 'dr-789', name: 'Dr. Smith' },
 *   custodian: { id: 'org-001', name: 'White Cross Hospital' },
 *   sections: { allergies, medications, problems }
 * });
 * ```
 */
export declare function generateCCD(ccd: ContinuityOfCareDocument): string;
/**
 * 16. Parses C-CDA document to structured CCD format.
 *
 * @param {string} ccda - C-CDA XML document
 * @returns {ContinuityOfCareDocument} Parsed CCD structure
 *
 * @example
 * ```typescript
 * const ccd = parseCCDA(ccdaXml);
 * console.log(`Patient: ${ccd.patientId}`);
 * console.log(`Allergies: ${ccd.sections.allergies?.length}`);
 * ```
 */
export declare function parseCCDA(ccda: string): ContinuityOfCareDocument;
/**
 * 17. Converts CCD to FHIR Composition resource.
 *
 * @param {ContinuityOfCareDocument} ccd - CCD data
 * @returns {any} FHIR Composition resource
 *
 * @example
 * ```typescript
 * const composition = convertCCDToFHIRComposition(ccd);
 * const bundle = createFHIRBundle([composition, ...otherResources], 'document');
 * ```
 */
export declare function convertCCDToFHIRComposition(ccd: ContinuityOfCareDocument): any;
/**
 * 18. Validates CCD structure and required sections.
 *
 * @param {ContinuityOfCareDocument} ccd - CCD to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateCCD(ccd);
 * if (!validation.valid) {
 *   throw new Error(`CCD validation failed: ${validation.errors.join(', ')}`);
 * }
 * ```
 */
export declare function validateCCD(ccd: ContinuityOfCareDocument): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * 19. Creates Direct secure message (SMTP/S) for healthcare data exchange.
 *
 * @param {Partial<DirectMessage>} message - Direct message data
 * @returns {DirectMessage} Complete Direct message
 *
 * @example
 * ```typescript
 * const directMsg = createDirectMessage({
 *   from: 'provider@whitecross.direct',
 *   to: ['specialist@hospital.direct'],
 *   subject: 'Patient Referral',
 *   body: 'Referring patient for evaluation',
 *   attachments: [{ filename: 'ccd.xml', content: ccdBuffer }]
 * });
 * ```
 */
export declare function createDirectMessage(message: Partial<DirectMessage>): DirectMessage;
/**
 * 20. Signs Direct message with S/MIME certificate.
 *
 * @param {DirectMessage} message - Direct message to sign
 * @param {string} privateKey - PEM private key
 * @param {string} certificate - PEM certificate
 * @returns {string} Signed message
 *
 * @example
 * ```typescript
 * const signedMsg = signDirectMessage(
 *   directMsg,
 *   process.env.DIRECT_PRIVATE_KEY,
 *   process.env.DIRECT_CERTIFICATE
 * );
 * await smtpTransport.sendMail(signedMsg);
 * ```
 */
export declare function signDirectMessage(message: DirectMessage, privateKey: string, certificate: string): string;
/**
 * 21. Encrypts Direct message with recipient's public certificate.
 *
 * @param {DirectMessage} message - Direct message to encrypt
 * @param {string} recipientCertificate - Recipient's public certificate
 * @returns {string} Encrypted message
 *
 * @example
 * ```typescript
 * const encryptedMsg = encryptDirectMessage(
 *   directMsg,
 *   recipientPublicCert
 * );
 * ```
 */
export declare function encryptDirectMessage(message: DirectMessage, recipientCertificate: string): string;
/**
 * 22. Validates Direct address format (RFC 5322).
 *
 * @param {string} address - Direct address to validate
 * @returns {boolean} True if valid Direct address
 *
 * @example
 * ```typescript
 * if (!validateDirectAddress(recipientAddress)) {
 *   throw new Error('Invalid Direct address');
 * }
 * ```
 */
export declare function validateDirectAddress(address: string): boolean;
/**
 * 23. Records patient consent for health information exchange.
 *
 * @param {HIEConsent} consent - Consent details
 * @returns {HIEConsent} Consent record with ID
 *
 * @example
 * ```typescript
 * const consent = recordHIEConsent({
 *   patientId: 'patient-123',
 *   consentType: 'opt-in',
 *   scope: 'full',
 *   status: 'active',
 *   effectiveDate: new Date(),
 *   signedBy: 'patient-123',
 *   signatureDate: new Date()
 * });
 * ```
 */
export declare function recordHIEConsent(consent: HIEConsent): HIEConsent;
/**
 * 24. Checks if patient has consented to data sharing.
 *
 * @param {string} patientId - Patient identifier
 * @param {HIEConsent[]} consents - Patient consent records
 * @param {string} organizationId - Requesting organization
 * @returns {boolean} True if consent granted
 *
 * @example
 * ```typescript
 * const hasConsent = checkHIEConsent(
 *   'patient-123',
 *   patientConsents,
 *   'org-456'
 * );
 * if (!hasConsent) {
 *   throw new ForbiddenException('Patient has not consented to data sharing');
 * }
 * ```
 */
export declare function checkHIEConsent(patientId: string, consents: HIEConsent[], organizationId?: string): boolean;
/**
 * 25. Revokes patient consent for HIE.
 *
 * @param {string} consentId - Consent record ID
 * @param {string} revokedBy - User revoking consent
 * @param {string} reason - Reason for revocation
 * @returns {HIEConsent} Updated consent record
 *
 * @example
 * ```typescript
 * const revokedConsent = revokeHIEConsent(
 *   'consent-123',
 *   'patient-456',
 *   'Patient requested removal'
 * );
 * ```
 */
export declare function revokeHIEConsent(consentId: string, revokedBy: string, reason?: string): Partial<HIEConsent>;
/**
 * 26. Generates patient consent form for signature.
 *
 * @param {string} patientId - Patient identifier
 * @param {string} scope - Consent scope
 * @returns {string} HTML consent form
 *
 * @example
 * ```typescript
 * const consentForm = generateConsentForm('patient-123', 'full');
 * // Display form for patient signature
 * ```
 */
export declare function generateConsentForm(patientId: string, scope: string): string;
/**
 * 27. Checks break-glass emergency access authorization.
 *
 * @param {string} userId - User requesting access
 * @param {string} patientId - Patient ID
 * @param {string} justification - Emergency justification
 * @returns {boolean} True if emergency access granted
 *
 * @example
 * ```typescript
 * const emergencyAccess = checkBreakGlassAccess(
 *   'dr-123',
 *   'patient-456',
 *   'Life-threatening emergency - cardiac arrest'
 * );
 * ```
 */
export declare function checkBreakGlassAccess(userId: string, patientId: string, justification: string): boolean;
/**
 * 28. Creates Master Patient Index entry.
 *
 * @param {Partial<MPIEntry>} entry - MPI entry data
 * @returns {MPIEntry} Complete MPI entry
 *
 * @example
 * ```typescript
 * const mpiEntry = createMPIEntry({
 *   sourceSystem: 'epic',
 *   sourcePatientId: 'epic-12345',
 *   demographics: { firstName: 'John', lastName: 'Doe', dateOfBirth: dob, sex: 'M' }
 * });
 * ```
 */
export declare function createMPIEntry(entry: Partial<MPIEntry>): MPIEntry;
/**
 * 29. Performs probabilistic patient matching across systems.
 *
 * @param {PatientMatchCriteria} criteria - Search criteria
 * @param {MPIEntry[]} mpiEntries - Existing MPI entries
 * @returns {PatientMatchResult[]} Sorted match results
 *
 * @example
 * ```typescript
 * const matches = performPatientMatching({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   dateOfBirth: new Date('1990-01-01'),
 *   sex: 'M'
 * }, mpiDatabase);
 *
 * const bestMatch = matches[0];
 * if (bestMatch.confidence === 'certain') {
 *   // Use existing MPI ID
 * }
 * ```
 */
export declare function performPatientMatching(criteria: PatientMatchCriteria, mpiEntries: MPIEntry[]): PatientMatchResult[];
/**
 * 30. Links patient records across different healthcare systems.
 *
 * @param {string} primaryMpiId - Primary MPI ID
 * @param {string} secondaryMpiId - Secondary MPI ID to link
 * @param {string} linkType - Type of linkage
 * @param {number} linkScore - Confidence score
 * @returns {MPIEntry} Updated primary MPI entry
 *
 * @example
 * ```typescript
 * const linkedEntry = linkPatientRecords(
 *   'mpi-123',
 *   'mpi-456',
 *   'probable',
 *   85
 * );
 * ```
 */
export declare function linkPatientRecords(primaryMpiId: string, secondaryMpiId: string, linkType: 'certain' | 'probable' | 'possible', linkScore: number): Partial<MPIEntry>;
/**
 * 31. Retrieves patient's enterprise medical record number (EMRN).
 *
 * @param {string} mpiId - MPI identifier
 * @param {MPIEntry[]} mpiEntries - MPI database
 * @returns {string | null} Enterprise MRN
 *
 * @example
 * ```typescript
 * const emrn = getEnterpriseEMRN('mpi-123', mpiDatabase);
 * console.log(`Enterprise MRN: ${emrn}`);
 * ```
 */
export declare function getEnterpriseEMRN(mpiId: string, mpiEntries: MPIEntry[]): string | null;
/**
 * 32. Merges duplicate MPI entries.
 *
 * @param {string} survivorMpiId - MPI ID to keep
 * @param {string[]} duplicateMpiIds - MPI IDs to merge
 * @returns {MPIEntry} Merged MPI entry
 *
 * @example
 * ```typescript
 * const mergedEntry = mergeMPIEntries(
 *   'mpi-primary',
 *   ['mpi-dup1', 'mpi-dup2']
 * );
 * ```
 */
export declare function mergeMPIEntries(survivorMpiId: string, duplicateMpiIds: string[]): Partial<MPIEntry>;
/**
 * 33. Queries National Provider Directory (NPPES).
 *
 * @param {string} npi - National Provider Identifier
 * @returns {ProviderDirectoryEntry | null} Provider details
 *
 * @example
 * ```typescript
 * const provider = queryProviderDirectory('1234567890');
 * if (provider) {
 *   console.log(`${provider.firstName} ${provider.lastName}, ${provider.specialty}`);
 * }
 * ```
 */
export declare function queryProviderDirectory(npi: string): ProviderDirectoryEntry | null;
/**
 * 34. Searches providers by specialty and location.
 *
 * @param {string} specialty - Provider specialty
 * @param {string} zipCode - ZIP code
 * @param {number} radiusMiles - Search radius
 * @returns {ProviderDirectoryEntry[]} Matching providers
 *
 * @example
 * ```typescript
 * const cardiologists = searchProvidersBySpecialty(
 *   'Cardiology',
 *   '94102',
 *   25
 * );
 * ```
 */
export declare function searchProvidersBySpecialty(specialty: string, zipCode: string, radiusMiles?: number): ProviderDirectoryEntry[];
/**
 * 35. Validates National Provider Identifier (NPI).
 *
 * @param {string} npi - NPI to validate
 * @returns {boolean} True if valid NPI
 *
 * @example
 * ```typescript
 * if (!validateNPI(providerNPI)) {
 *   throw new Error('Invalid NPI');
 * }
 * ```
 */
export declare function validateNPI(npi: string): boolean;
/**
 * 36. Creates XDS document metadata for registry.
 *
 * @param {Partial<DocumentMetadata>} metadata - Document metadata
 * @returns {DocumentMetadata} Complete document metadata
 *
 * @example
 * ```typescript
 * const metadata = createDocumentMetadata({
 *   title: 'Discharge Summary',
 *   patientId: 'patient-123',
 *   classCode: '11490-0',
 *   typeCode: '18842-5',
 *   mimeType: 'application/pdf'
 * });
 * ```
 */
export declare function createDocumentMetadata(metadata: Partial<DocumentMetadata>): DocumentMetadata;
/**
 * 37. Queries document registry (XDS ITI-18).
 *
 * @param {DocumentQuery} query - Document query parameters
 * @param {DocumentMetadata[]} registry - Document registry
 * @returns {DocumentMetadata[]} Matching documents
 *
 * @example
 * ```typescript
 * const documents = queryDocumentRegistry({
 *   patientId: 'patient-123',
 *   classCode: ['11490-0', '18842-5'],
 *   creationTimeFrom: new Date('2024-01-01')
 * }, documentRegistry);
 * ```
 */
export declare function queryDocumentRegistry(query: DocumentQuery, registry: DocumentMetadata[]): DocumentMetadata[];
/**
 * 38. Retrieves document from repository (XDS ITI-43).
 *
 * @param {string} documentId - Document unique ID
 * @param {string} repositoryId - Repository unique ID
 * @returns {Promise<Buffer>} Document content
 *
 * @example
 * ```typescript
 * const document = await retrieveDocument(
 *   'doc-123',
 *   'repo-456'
 * );
 * res.setHeader('Content-Type', 'application/pdf');
 * res.send(document);
 * ```
 */
export declare function retrieveDocument(documentId: string, repositoryId: string): Promise<Buffer>;
/**
 * 39. Submits document to repository (XDS ITI-41).
 *
 * @param {DocumentMetadata} metadata - Document metadata
 * @param {Buffer} content - Document content
 * @returns {string} Document ID
 *
 * @example
 * ```typescript
 * const docId = await submitDocument(
 *   documentMetadata,
 *   pdfBuffer
 * );
 * console.log(`Document submitted: ${docId}`);
 * ```
 */
export declare function submitDocument(metadata: DocumentMetadata, content: Buffer): Promise<string>;
/**
 * 40. Records audit trail entry for HIE data access.
 *
 * @param {HIEAuditEntry} entry - Audit entry details
 * @returns {HIEAuditEntry} Audit entry with ID
 *
 * @example
 * ```typescript
 * recordHIEAudit({
 *   timestamp: new Date(),
 *   action: 'access',
 *   userId: 'dr-123',
 *   patientId: 'patient-456',
 *   organizationId: 'org-789',
 *   purpose: 'treatment',
 *   sourceSystem: 'EHR',
 *   ipAddress: req.ip,
 *   success: true
 * });
 * ```
 */
export declare function recordHIEAudit(entry: HIEAuditEntry): HIEAuditEntry;
/**
 * 41. Generates disclosure accounting report for patient.
 *
 * @param {string} patientId - Patient ID
 * @param {HIEAuditEntry[]} auditLog - Audit log entries
 * @param {Date} fromDate - Start date
 * @param {Date} toDate - End date
 * @returns {object} Disclosure accounting report
 *
 * @example
 * ```typescript
 * const report = generateDisclosureReport(
 *   'patient-123',
 *   auditEntries,
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * console.log(`Total disclosures: ${report.totalDisclosures}`);
 * ```
 */
export declare function generateDisclosureReport(patientId: string, auditLog: HIEAuditEntry[], fromDate: Date, toDate: Date): {
    patientId: string;
    fromDate: Date;
    toDate: Date;
    totalDisclosures: number;
    disclosures: Array<{
        date: Date;
        recipientOrganization: string;
        purpose: string;
        dataAccessed: string[];
        userId: string;
    }>;
};
/**
 * 42. Validates HIPAA compliance for HIE transaction.
 *
 * @param {HIEAuditEntry} transaction - Transaction to validate
 * @param {HIEConsent[]} consents - Patient consent records
 * @returns {object} Compliance validation result
 *
 * @example
 * ```typescript
 * const validation = validateHIPAACompliance(
 *   auditEntry,
 *   patientConsents
 * );
 * if (!validation.compliant) {
 *   throw new ForbiddenException(validation.violations.join(', '));
 * }
 * ```
 */
export declare function validateHIPAACompliance(transaction: HIEAuditEntry, consents: HIEConsent[]): {
    compliant: boolean;
    violations: string[];
    warnings: string[];
};
declare const _default: {
    parseHL7Message: typeof parseHL7Message;
    parseADTMessage: typeof parseADTMessage;
    parseORUMessage: typeof parseORUMessage;
    parseORMMessage: typeof parseORMMessage;
    buildHL7Message: typeof buildHL7Message;
    validateHL7Message: typeof validateHL7Message;
    extractPatientFromHL7: typeof extractPatientFromHL7;
    convertHL7ToFHIR: typeof convertHL7ToFHIR;
    convertPIDToFHIRPatient: typeof convertPIDToFHIRPatient;
    convertOBXToFHIRObservation: typeof convertOBXToFHIRObservation;
    convertFHIRPatientToPID: typeof convertFHIRPatientToPID;
    createFHIRBundle: typeof createFHIRBundle;
    extractResourcesFromBundle: typeof extractResourcesFromBundle;
    validateFHIRResource: typeof validateFHIRResource;
    generateCCD: typeof generateCCD;
    parseCCDA: typeof parseCCDA;
    convertCCDToFHIRComposition: typeof convertCCDToFHIRComposition;
    validateCCD: typeof validateCCD;
    createDirectMessage: typeof createDirectMessage;
    signDirectMessage: typeof signDirectMessage;
    encryptDirectMessage: typeof encryptDirectMessage;
    validateDirectAddress: typeof validateDirectAddress;
    recordHIEConsent: typeof recordHIEConsent;
    checkHIEConsent: typeof checkHIEConsent;
    revokeHIEConsent: typeof revokeHIEConsent;
    generateConsentForm: typeof generateConsentForm;
    checkBreakGlassAccess: typeof checkBreakGlassAccess;
    createMPIEntry: typeof createMPIEntry;
    performPatientMatching: typeof performPatientMatching;
    linkPatientRecords: typeof linkPatientRecords;
    getEnterpriseEMRN: typeof getEnterpriseEMRN;
    mergeMPIEntries: typeof mergeMPIEntries;
    queryProviderDirectory: typeof queryProviderDirectory;
    searchProvidersBySpecialty: typeof searchProvidersBySpecialty;
    validateNPI: typeof validateNPI;
    createDocumentMetadata: typeof createDocumentMetadata;
    queryDocumentRegistry: typeof queryDocumentRegistry;
    retrieveDocument: typeof retrieveDocument;
    submitDocument: typeof submitDocument;
    recordHIEAudit: typeof recordHIEAudit;
    generateDisclosureReport: typeof generateDisclosureReport;
    validateHIPAACompliance: typeof validateHIPAACompliance;
};
export default _default;
//# sourceMappingURL=health-information-exchange-kit.d.ts.map