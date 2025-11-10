/**
 * LOC: DOC-COMP-HIPAA-001
 * File: /reuse/document/composites/document-healthcare-hipaa-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - crypto (Node.js)
 *   - ../document-healthcare-integration-kit
 *   - ../document-compliance-advanced-kit
 *   - ../document-security-kit
 *   - ../document-audit-trail-advanced-kit
 *
 * DOWNSTREAM (imported by):
 *   - HIPAA compliance controllers
 *   - Healthcare integration services
 *   - PHI protection modules
 *   - Clinical data processors
 *   - EHR integration services
 */
import { Sequelize } from 'sequelize';
/**
 * HIPAA compliance configuration
 */
export interface HipaaComplianceConfig {
    enableEncryption: boolean;
    enableAuditLogging: boolean;
    enableAccessControl: boolean;
    enableBreachNotification: boolean;
    retentionPeriodYears: number;
    minimumNecessary: boolean;
    deIdentificationLevel: 'safe-harbor' | 'expert-determination' | 'limited-dataset';
}
/**
 * PHI (Protected Health Information) data
 */
export interface PhiData {
    patientId: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    ssn?: string;
    medicalRecordNumber?: string;
    diagnosis?: string[];
    medications?: string[];
    allergies?: string[];
    procedures?: Array<{
        name: string;
        date: Date;
    }>;
}
/**
 * FHIR resource wrapper
 */
export interface FhirResourceWrapper {
    resourceType: string;
    id: string;
    resource: Record<string, any>;
    meta?: {
        versionId: string;
        lastUpdated: Date;
        security?: Array<{
            system: string;
            code: string;
        }>;
    };
}
/**
 * EHR integration configuration
 */
export interface EhrIntegrationConfig {
    vendor: 'epic' | 'cerner' | 'allscripts' | 'meditech';
    baseUrl: string;
    clientId: string;
    clientSecret: string;
    scopes: string[];
    environment: 'production' | 'sandbox';
}
/**
 * Patient matching criteria
 */
export interface PatientMatchCriteria {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    ssn?: string;
    gender?: string;
    zipCode?: string;
    phoneNumber?: string;
}
/**
 * Consent management record
 */
export interface ConsentRecord {
    patientId: string;
    consentType: 'treatment' | 'disclosure' | 'research' | 'marketing';
    granted: boolean;
    purpose: string;
    grantedBy: string;
    grantedAt: Date;
    expiresAt?: Date;
    scope?: string[];
}
/**
 * De-identification result
 */
export interface DeIdentificationResult {
    originalData: PhiData;
    deIdentifiedData: Record<string, any>;
    method: string;
    elementsRemoved: string[];
    elementsGeneralized: string[];
    safeHarborCompliant: boolean;
}
/**
 * Breach notification
 */
export interface BreachNotification {
    breachId: string;
    discoveredAt: Date;
    affectedPatients: number;
    phiCompromised: string[];
    breachType: 'unauthorized-access' | 'lost-device' | 'hacking' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    notificationRequired: boolean;
    notifiedAt?: Date;
}
/**
 * Healthcare HIPAA Compliance Composite Service
 *
 * Provides comprehensive HIPAA compliance and healthcare integration capabilities
 * including FHIR, DICOM, EHR integration, PHI protection, and audit logging.
 */
export declare class HealthcareHipaaCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Creates FHIR R4 patient resource with validation.
     *
     * @param {PhiData} patientData - Patient data
     * @returns {Promise<FhirResourceWrapper>} Created FHIR patient
     *
     * @example
     * ```typescript
     * const fhirPatient = await service.createFhirPatientResource({
     *   patientId: 'patient-123',
     *   firstName: 'John',
     *   lastName: 'Doe',
     *   dateOfBirth: new Date('1970-01-01'),
     *   medicalRecordNumber: 'MRN-456'
     * });
     * ```
     */
    createFhirPatientResource(patientData: PhiData): Promise<FhirResourceWrapper>;
    /**
     * 2. Searches FHIR resources with HIPAA compliance.
     *
     * @param {string} resourceType - FHIR resource type
     * @param {Record<string, any>} criteria - Search criteria
     * @returns {Promise<Array<FhirResourceWrapper>>} Matching resources
     *
     * @example
     * ```typescript
     * const observations = await service.searchFhirResourcesSecure('Observation', {
     *   patient: 'patient-123',
     *   date: '2024-01-01'
     * });
     * ```
     */
    searchFhirResourcesSecure(resourceType: string, criteria: Record<string, any>): Promise<Array<FhirResourceWrapper>>;
    /**
     * 3. Gets FHIR resource with access control.
     *
     * @param {string} resourceType - Resource type
     * @param {string} resourceId - Resource ID
     * @param {string} userId - Requesting user ID
     * @returns {Promise<FhirResourceWrapper>} FHIR resource
     *
     * @example
     * ```typescript
     * const patient = await service.getFhirResourceSecure('Patient', 'patient-123', 'user-456');
     * ```
     */
    getFhirResourceSecure(resourceType: string, resourceId: string, userId: string): Promise<FhirResourceWrapper>;
    /**
     * 4. Creates FHIR transaction bundle.
     *
     * @param {Array<any>} resources - Resources to bundle
     * @returns {Promise<any>} FHIR bundle
     *
     * @example
     * ```typescript
     * const bundle = await service.createFhirTransactionBundle([patient, observation]);
     * ```
     */
    createFhirTransactionBundle(resources: Array<any>): Promise<any>;
    /**
     * 5. Validates FHIR resource compliance.
     *
     * @param {any} resource - FHIR resource
     * @param {string} resourceType - Resource type
     * @returns {Promise<{valid: boolean; errors: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateFhirResourceCompliance(patient, 'Patient');
     * ```
     */
    validateFhirResourceCompliance(resource: any, resourceType: string): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    /**
     * 6. Tests FHIR server connectivity.
     *
     * @param {string} serverUrl - FHIR server URL
     * @returns {Promise<{connected: boolean; version: string}>} Connection status
     *
     * @example
     * ```typescript
     * const status = await service.testFhirServerConnectivity('https://fhir.epic.com');
     * ```
     */
    testFhirServerConnectivity(serverUrl: string): Promise<{
        connected: boolean;
        version: string;
    }>;
    /**
     * 7. Converts FHIR to CDA document.
     *
     * @param {any} fhirResource - FHIR resource
     * @returns {Promise<string>} CDA XML document
     *
     * @example
     * ```typescript
     * const cda = await service.convertFhirToCdaDocument(fhirPatient);
     * ```
     */
    convertFhirToCdaDocument(fhirResource: any): Promise<string>;
    /**
     * 8. Generates C32 continuity of care document.
     *
     * @param {string} patientId - Patient ID
     * @returns {Promise<string>} C32 CDA document
     *
     * @example
     * ```typescript
     * const c32 = await service.generateC32ContinuityOfCare('patient-123');
     * ```
     */
    generateC32ContinuityOfCare(patientId: string): Promise<string>;
    /**
     * 9. Parses DICOM study with metadata extraction.
     *
     * @param {Buffer} dicomBuffer - DICOM file buffer
     * @returns {Promise<any>} Parsed DICOM study
     *
     * @example
     * ```typescript
     * const study = await service.parseDicomStudySecure(dicomBuffer);
     * ```
     */
    parseDicomStudySecure(dicomBuffer: Buffer): Promise<any>;
    /**
     * 10. Generates WADO-RS URL for DICOM retrieval.
     *
     * @param {string} studyUid - Study UID
     * @param {string} seriesUid - Series UID
     * @param {string} instanceUid - Instance UID
     * @returns {Promise<string>} WADO-RS URL
     *
     * @example
     * ```typescript
     * const url = await service.generateDicomWadoUrl('study-123', 'series-456', 'instance-789');
     * ```
     */
    generateDicomWadoUrl(studyUid: string, seriesUid: string, instanceUid: string): Promise<string>;
    /**
     * 11. Queries DICOM studies with filters.
     *
     * @param {Record<string, any>} filters - Query filters
     * @returns {Promise<Array<any>>} Matching DICOM studies
     *
     * @example
     * ```typescript
     * const studies = await service.queryDicomStudiesSecure({
     *   patientId: 'patient-123',
     *   modality: 'CT',
     *   studyDate: '2024-01-01'
     * });
     * ```
     */
    queryDicomStudiesSecure(filters: Record<string, any>): Promise<Array<any>>;
    /**
     * 12. Converts DICOM to JPEG with quality settings.
     *
     * @param {Buffer} dicomBuffer - DICOM buffer
     * @param {number} quality - JPEG quality (0-100)
     * @returns {Promise<Buffer>} JPEG buffer
     *
     * @example
     * ```typescript
     * const jpeg = await service.convertDicomToJpegImage(dicomBuffer, 90);
     * ```
     */
    convertDicomToJpegImage(dicomBuffer: Buffer, quality: number): Promise<Buffer>;
    /**
     * 13. Anonymizes DICOM image removing PHI.
     *
     * @param {Buffer} dicomBuffer - DICOM buffer
     * @returns {Promise<Buffer>} Anonymized DICOM
     *
     * @example
     * ```typescript
     * const anonymized = await service.anonymizeDicomImage(dicomBuffer);
     * ```
     */
    anonymizeDicomImage(dicomBuffer: Buffer): Promise<Buffer>;
    /**
     * 14. Tests DICOM WADO endpoint connectivity.
     *
     * @param {string} wadoUrl - WADO endpoint URL
     * @returns {Promise<{connected: boolean; responseTime: number}>} Connection status
     *
     * @example
     * ```typescript
     * const status = await service.testDicomWadoConnectivity('https://pacs.hospital.org/wado');
     * ```
     */
    testDicomWadoConnectivity(wadoUrl: string): Promise<{
        connected: boolean;
        responseTime: number;
    }>;
    /**
     * 15. Authenticates with Epic EHR via OAuth2.
     *
     * @param {EhrIntegrationConfig} config - Epic configuration
     * @returns {Promise<{accessToken: string; expiresIn: number}>} OAuth tokens
     *
     * @example
     * ```typescript
     * const auth = await service.authenticateEpicEhr({
     *   vendor: 'epic',
     *   baseUrl: 'https://fhir.epic.com',
     *   clientId: 'client-123',
     *   clientSecret: 'secret-456',
     *   scopes: ['patient/Patient.read'],
     *   environment: 'production'
     * });
     * ```
     */
    authenticateEpicEhr(config: EhrIntegrationConfig): Promise<{
        accessToken: string;
        expiresIn: number;
    }>;
    /**
     * 16. Retrieves patient data from Epic.
     *
     * @param {string} patientId - Epic patient ID
     * @param {string} accessToken - OAuth access token
     * @returns {Promise<any>} Epic patient data
     *
     * @example
     * ```typescript
     * const patient = await service.getEpicPatientData('epic-patient-123', accessToken);
     * ```
     */
    getEpicPatientData(patientId: string, accessToken: string): Promise<any>;
    /**
     * 17. Retrieves medications from Epic.
     *
     * @param {string} patientId - Patient ID
     * @param {string} accessToken - Access token
     * @returns {Promise<Array<any>>} Medications list
     *
     * @example
     * ```typescript
     * const medications = await service.getEpicPatientMedications('patient-123', token);
     * ```
     */
    getEpicPatientMedications(patientId: string, accessToken: string): Promise<Array<any>>;
    /**
     * 18. Syncs observations from Cerner.
     *
     * @param {string} patientId - Patient ID
     * @param {Date} since - Sync from date
     * @returns {Promise<Array<any>>} Synced observations
     *
     * @example
     * ```typescript
     * const observations = await service.syncCernerPatientObservations(
     *   'patient-123',
     *   new Date('2024-01-01')
     * );
     * ```
     */
    syncCernerPatientObservations(patientId: string, since: Date): Promise<Array<any>>;
    /**
     * 19. Validates HL7 v2.x message.
     *
     * @param {string} hl7Message - HL7 message
     * @returns {Promise<{valid: boolean; errors: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateHl7MessageFormat(hl7Message);
     * ```
     */
    validateHl7MessageFormat(hl7Message: string): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    /**
     * 20. Validates IHE profile compliance.
     *
     * @param {string} profile - IHE profile name
     * @param {any} transaction - Transaction data
     * @returns {Promise<boolean>} True if compliant
     *
     * @example
     * ```typescript
     * const compliant = await service.validateIheProfileCompliance('XDS.b', transaction);
     * ```
     */
    validateIheProfileCompliance(profile: string, transaction: any): Promise<boolean>;
    /**
     * 21. Parses CDA document to FHIR.
     *
     * @param {string} cdaXml - CDA XML document
     * @returns {Promise<any>} FHIR resource
     *
     * @example
     * ```typescript
     * const fhir = await service.parseCdaDocumentToFhir(cdaXml);
     * ```
     */
    parseCdaDocumentToFhir(cdaXml: string): Promise<any>;
    /**
     * 22. Validates CDA document structure.
     *
     * @param {string} cdaXml - CDA XML
     * @returns {Promise<{valid: boolean; errors: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateCdaDocumentStructure(cdaXml);
     * ```
     */
    validateCdaDocumentStructure(cdaXml: string): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    /**
     * 23. Performs probabilistic patient matching.
     *
     * @param {PatientMatchCriteria} criteria - Matching criteria
     * @returns {Promise<Array<{patientId: string; confidence: number}>>} Matching patients
     *
     * @example
     * ```typescript
     * const matches = await service.performProbabilisticPatientMatch({
     *   firstName: 'John',
     *   lastName: 'Doe',
     *   dateOfBirth: new Date('1970-01-01'),
     *   zipCode: '02101'
     * });
     * ```
     */
    performProbabilisticPatientMatch(criteria: PatientMatchCriteria): Promise<Array<{
        patientId: string;
        confidence: number;
    }>>;
    /**
     * 24. Creates Master Patient Index entry.
     *
     * @param {PhiData} patientData - Patient data
     * @returns {Promise<string>} MPI ID
     *
     * @example
     * ```typescript
     * const mpiId = await service.createMasterPatientIndexEntry(patientData);
     * ```
     */
    createMasterPatientIndexEntry(patientData: PhiData): Promise<string>;
    /**
     * 25. Links patient records across systems.
     *
     * @param {string} mpiId - MPI ID
     * @param {Array<{system: string; patientId: string}>} records - Records to link
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.linkPatientRecordsAcrossSystems('mpi-123', [
     *   { system: 'epic', patientId: 'epic-456' },
     *   { system: 'cerner', patientId: 'cerner-789' }
     * ]);
     * ```
     */
    linkPatientRecordsAcrossSystems(mpiId: string, records: Array<{
        system: string;
        patientId: string;
    }>): Promise<void>;
    /**
     * 26. Calculates patient match confidence score.
     *
     * @param {PatientMatchCriteria} patient1 - First patient
     * @param {PatientMatchCriteria} patient2 - Second patient
     * @returns {Promise<number>} Confidence score (0-1)
     *
     * @example
     * ```typescript
     * const confidence = await service.calculatePatientMatchConfidence(patient1, patient2);
     * ```
     */
    calculatePatientMatchConfidence(patient1: PatientMatchCriteria, patient2: PatientMatchCriteria): Promise<number>;
    /**
     * 27. Resolves patient identity across EHR systems.
     *
     * @param {string} patientId - Source patient ID
     * @param {string} sourceSystem - Source EHR system
     * @returns {Promise<Array<{system: string; patientId: string}>>} Linked identities
     *
     * @example
     * ```typescript
     * const identities = await service.resolvePatientIdentityAcrossEhrs('patient-123', 'epic');
     * ```
     */
    resolvePatientIdentityAcrossEhrs(patientId: string, sourceSystem: string): Promise<Array<{
        system: string;
        patientId: string;
    }>>;
    /**
     * 28. Encrypts PHI data with AES-256.
     *
     * @param {PhiData} phiData - PHI to encrypt
     * @param {string} encryptionKey - Encryption key
     * @returns {Promise<{encrypted: string; iv: string}>} Encrypted data
     *
     * @example
     * ```typescript
     * const encrypted = await service.encryptPhiData(patientData, encryptionKey);
     * ```
     */
    encryptPhiData(phiData: PhiData, encryptionKey: string): Promise<{
        encrypted: string;
        iv: string;
    }>;
    /**
     * 29. Decrypts PHI data.
     *
     * @param {string} encryptedData - Encrypted data
     * @param {string} iv - Initialization vector
     * @param {string} encryptionKey - Decryption key
     * @returns {Promise<PhiData>} Decrypted PHI
     *
     * @example
     * ```typescript
     * const phi = await service.decryptPhiData(encrypted, iv, key);
     * ```
     */
    decryptPhiData(encryptedData: string, iv: string, encryptionKey: string): Promise<PhiData>;
    /**
     * 30. Generates encryption key for PHI.
     *
     * @returns {Promise<string>} Generated encryption key
     *
     * @example
     * ```typescript
     * const key = await service.generatePhiEncryptionKey();
     * ```
     */
    generatePhiEncryptionKey(): Promise<string>;
    /**
     * 31. Rotates encryption keys for PHI.
     *
     * @param {string} oldKey - Old encryption key
     * @param {string} newKey - New encryption key
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.rotatePhiEncryptionKeys(oldKey, newKey);
     * ```
     */
    rotatePhiEncryptionKeys(oldKey: string, newKey: string): Promise<void>;
    /**
     * 32. Validates encryption strength compliance.
     *
     * @param {string} encryptionKey - Key to validate
     * @returns {Promise<{compliant: boolean; strength: number}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validatePhiEncryptionStrength(key);
     * ```
     */
    validatePhiEncryptionStrength(encryptionKey: string): Promise<{
        compliant: boolean;
        strength: number;
    }>;
    /**
     * 33. Creates secure vault for PHI storage.
     *
     * @param {string} vaultName - Vault name
     * @returns {Promise<string>} Created vault ID
     *
     * @example
     * ```typescript
     * const vaultId = await service.createSecurePhiVault('patient-data-vault');
     * ```
     */
    createSecurePhiVault(vaultName: string): Promise<string>;
    /**
     * 34. Creates blockchain audit log entry.
     *
     * @param {Object} auditEntry - Audit entry
     * @returns {Promise<string>} Audit entry ID
     *
     * @example
     * ```typescript
     * const id = await service.createBlockchainAuditEntry({
     *   action: 'access_phi',
     *   userId: 'user-123',
     *   resourceId: 'patient-456',
     *   timestamp: new Date()
     * });
     * ```
     */
    createBlockchainAuditEntry(auditEntry: {
        action: string;
        userId: string;
        resourceId?: string;
        timestamp: Date;
    }): Promise<string>;
    /**
     * 35. Anchors audit trail to blockchain.
     *
     * @param {Array<string>} auditIds - Audit entry IDs
     * @returns {Promise<string>} Blockchain transaction hash
     *
     * @example
     * ```typescript
     * const txHash = await service.anchorAuditToBlockchain(auditIds);
     * ```
     */
    anchorAuditToBlockchain(auditIds: Array<string>): Promise<string>;
    /**
     * 36. Builds Merkle tree for audit trail.
     *
     * @param {Array<any>} auditEntries - Audit entries
     * @returns {Promise<{rootHash: string; tree: any}>} Merkle tree
     *
     * @example
     * ```typescript
     * const merkleTree = await service.buildAuditMerkleTreeStructure(entries);
     * ```
     */
    buildAuditMerkleTreeStructure(auditEntries: Array<any>): Promise<{
        rootHash: string;
        tree: any;
    }>;
    /**
     * 37. Verifies audit chain integrity.
     *
     * @param {Array<string>} auditIds - Audit IDs to verify
     * @returns {Promise<{valid: boolean; tampered: boolean}>} Verification result
     *
     * @example
     * ```typescript
     * const verification = await service.verifyAuditChainIntegrityCheck(auditIds);
     * ```
     */
    verifyAuditChainIntegrityCheck(auditIds: Array<string>): Promise<{
        valid: boolean;
        tampered: boolean;
    }>;
    /**
     * 38. Performs forensic analysis on document.
     *
     * @param {Buffer} documentBuffer - Document to analyze
     * @returns {Promise<any>} Forensic analysis result
     *
     * @example
     * ```typescript
     * const analysis = await service.performDocumentForensicAnalysis(docBuffer);
     * ```
     */
    performDocumentForensicAnalysis(documentBuffer: Buffer): Promise<any>;
    /**
     * 39. Creates digital fingerprint of PHI document.
     *
     * @param {Buffer} documentBuffer - Document buffer
     * @returns {Promise<any>} Digital fingerprint
     *
     * @example
     * ```typescript
     * const fingerprint = await service.createPhiDigitalFingerprint(docBuffer);
     * ```
     */
    createPhiDigitalFingerprint(documentBuffer: Buffer): Promise<any>;
    /**
     * 40. Detects document tampering.
     *
     * @param {Buffer} documentBuffer - Document to check
     * @param {string} originalHash - Original hash
     * @returns {Promise<{tampered: boolean; severity: string}>} Tampering detection result
     *
     * @example
     * ```typescript
     * const result = await service.detectPhiDocumentTampering(docBuffer, originalHash);
     * ```
     */
    detectPhiDocumentTampering(documentBuffer: Buffer, originalHash: string): Promise<{
        tampered: boolean;
        severity: string;
    }>;
    /**
     * 41. Initiates chain of custody for PHI.
     *
     * @param {string} documentId - Document ID
     * @param {string} custodian - Initial custodian
     * @returns {Promise<string>} Custody record ID
     *
     * @example
     * ```typescript
     * const custodyId = await service.initiatePhiChainOfCustody('doc-123', 'user-456');
     * ```
     */
    initiatePhiChainOfCustody(documentId: string, custodian: string): Promise<string>;
    /**
     * 42. Transfers PHI custody.
     *
     * @param {string} custodyId - Custody record ID
     * @param {string} fromCustodian - From custodian
     * @param {string} toCustodian - To custodian
     * @param {string} reason - Transfer reason
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.transferPhiCustody('custody-123', 'user-1', 'user-2', 'Case handoff');
     * ```
     */
    transferPhiCustody(custodyId: string, fromCustodian: string, toCustodian: string, reason: string): Promise<void>;
    /**
     * 43. Verifies chain of custody integrity.
     *
     * @param {string} custodyId - Custody record ID
     * @returns {Promise<{valid: boolean; violations: string[]}>} Verification result
     *
     * @example
     * ```typescript
     * const verification = await service.verifyPhiChainOfCustody('custody-123');
     * ```
     */
    verifyPhiChainOfCustody(custodyId: string): Promise<{
        valid: boolean;
        violations: string[];
    }>;
    /**
     * 44. Creates evidence preservation package for legal holds.
     *
     * @param {string} documentId - Document ID
     * @param {string} legalHoldId - Legal hold ID
     * @returns {Promise<string>} Preservation package ID
     *
     * @example
     * ```typescript
     * const packageId = await service.createLegalHoldPreservationPackage(
     *   'doc-123',
     *   'hold-456'
     * );
     * ```
     */
    createLegalHoldPreservationPackage(documentId: string, legalHoldId: string): Promise<string>;
    /**
     * 45. Generates forensic audit report for compliance.
     *
     * @param {Date} startDate - Report start date
     * @param {Date} endDate - Report end date
     * @returns {Promise<any>} Forensic audit report
     *
     * @example
     * ```typescript
     * const report = await service.generateHipaaForensicReport(
     *   new Date('2024-01-01'),
     *   new Date('2024-01-31')
     * );
     * ```
     */
    generateHipaaForensicReport(startDate: Date, endDate: Date): Promise<any>;
    /**
     * Checks for PHI tags in DICOM metadata.
     *
     * @private
     */
    private checkForPhiTags;
}
export default HealthcareHipaaCompositeService;
//# sourceMappingURL=document-healthcare-hipaa-composite.d.ts.map