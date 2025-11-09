/**
 * LOC: DOC-HEALTH-INT-001
 * File: /reuse/document/document-healthcare-integration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - fhir (v4.x)
 *   - dicom-parser
 *   - hl7-standard
 *   - node-fetch
 *   - xml2js
 *   - crypto (Node.js)
 *
 * DOWNSTREAM (imported by):
 *   - Healthcare integration controllers
 *   - EHR synchronization services
 *   - FHIR API handlers
 *   - Medical imaging modules
 *   - Patient matching services
 *   - Interoperability testing suites
 */
/**
 * File: /reuse/document/document-healthcare-integration-kit.ts
 * Locator: WC-UTL-HEALTH-INT-001
 * Purpose: Healthcare System Integration Kit - HL7 FHIR R4, DICOM, Epic/Cerner EHR, CDA conversion, patient matching, interoperability
 *
 * Upstream: @nestjs/common, sequelize, fhir, dicom-parser, hl7-standard, node-fetch, xml2js, crypto
 * Downstream: Healthcare integration controllers, EHR sync services, FHIR handlers, imaging modules, patient matching, interoperability testing
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, FHIR 4.0.1, DICOM PS3.x
 * Exports: 42 utility functions for FHIR resources, DICOM imaging, EHR integration, CDA conversion, patient matching, HL7 messaging
 *
 * LLM Context: Production-grade healthcare interoperability utilities for White Cross platform.
 * Provides HL7 FHIR R4 resource management, DICOM medical imaging integration, Epic/Cerner/Allscripts
 * EHR connectivity, CDA document conversion (C32/C62/CCR), probabilistic patient matching with MPI,
 * HL7 v2.x message parsing, SMART on FHIR authorization, bulk FHIR data export, IHE profile compliance,
 * and comprehensive interoperability testing. Essential for hospital system integration, care coordination,
 * health information exchange (HIE), medical imaging workflows, and regulatory compliance (ONC, CMS).
 */
import { Sequelize } from 'sequelize';
/**
 * FHIR resource types (subset of R4 resources)
 */
export type FhirResourceType = 'Patient' | 'Practitioner' | 'Organization' | 'Observation' | 'Condition' | 'Procedure' | 'MedicationRequest' | 'AllergyIntolerance' | 'DiagnosticReport' | 'DocumentReference' | 'Encounter' | 'Immunization' | 'CarePlan' | 'Bundle';
/**
 * HL7 v2.x message types
 */
export type HL7MessageType = 'ADT^A01' | 'ADT^A08' | 'ORM^O01' | 'ORU^R01' | 'SIU^S12' | 'MDM^T02' | 'DFT^P03';
/**
 * DICOM transfer syntax UIDs
 */
export type DicomTransferSyntax = '1.2.840.10008.1.2' | '1.2.840.10008.1.2.1' | '1.2.840.10008.1.2.2' | '1.2.840.10008.1.2.4.50' | '1.2.840.10008.1.2.4.90' | '1.2.840.10008.1.2.5';
/**
 * EHR vendor types
 */
export type EHRVendor = 'Epic' | 'Cerner' | 'Allscripts' | 'Meditech' | 'Athenahealth' | 'eClinicalWorks';
/**
 * Patient matching algorithm types
 */
export type MatchingAlgorithm = 'Deterministic' | 'Probabilistic' | 'MachineLearning' | 'Hybrid';
/**
 * FHIR bundle types
 */
export type FhirBundleType = 'document' | 'message' | 'transaction' | 'batch' | 'searchset' | 'collection';
/**
 * FHIR resource configuration
 */
export interface FhirResourceConfig {
    baseUrl: string;
    resourceType: FhirResourceType;
    headers?: Record<string, string>;
    authToken?: string;
    version?: string;
    format?: 'json' | 'xml';
}
/**
 * FHIR search parameters
 */
export interface FhirSearchParams {
    resourceType: FhirResourceType;
    params?: Record<string, string | number | boolean>;
    count?: number;
    page?: number;
    sort?: string;
    include?: string[];
    revinclude?: string[];
}
/**
 * DICOM study metadata
 */
export interface DicomStudyMetadata {
    studyInstanceUID: string;
    patientID: string;
    patientName: string;
    studyDate: Date;
    studyDescription?: string;
    modality: string;
    accessionNumber?: string;
    studyID?: string;
    numberOfSeries: number;
    numberOfInstances: number;
    institutionName?: string;
    referringPhysicianName?: string;
}
/**
 * DICOM series information
 */
export interface DicomSeriesInfo {
    seriesInstanceUID: string;
    seriesNumber: number;
    modality: string;
    seriesDescription?: string;
    numberOfInstances: number;
    bodyPartExamined?: string;
    protocolName?: string;
}
/**
 * EHR integration configuration
 */
export interface EHRIntegrationConfig {
    vendor: EHRVendor;
    baseUrl: string;
    clientId: string;
    clientSecret?: string;
    apiKey?: string;
    environment: 'production' | 'sandbox' | 'staging';
    fhirEndpoint?: string;
    hl7Endpoint?: string;
    authType: 'OAuth2' | 'APIKey' | 'SAML' | 'Basic';
    scopes?: string[];
}
/**
 * CDA document type
 */
export type CDADocumentType = 'C32' | 'C62' | 'CCR' | 'CCD' | 'Referral' | 'DischargeSummary' | 'ProgressNote';
/**
 * CDA document structure
 */
export interface CDADocument {
    type: CDADocumentType;
    documentId: string;
    patientId: string;
    authorId: string;
    createdAt: Date;
    title: string;
    sections: CDASection[];
    metadata?: Record<string, any>;
    xmlContent: string;
}
/**
 * CDA document section
 */
export interface CDASection {
    code: string;
    codeSystem: string;
    title: string;
    text?: string;
    entries?: any[];
}
/**
 * Patient demographic data
 */
export interface PatientDemographics {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other' | 'unknown';
    ssn?: string;
    mrn?: string;
    address?: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        zip: string;
        country?: string;
    };
    phone?: string;
    email?: string;
}
/**
 * Patient matching result
 */
export interface PatientMatchResult {
    matchScore: number;
    matchType: 'exact' | 'probable' | 'possible';
    patientId: string;
    confidence: number;
    matchedFields: string[];
    demographics: PatientDemographics;
    algorithm: MatchingAlgorithm;
}
/**
 * Master Patient Index (MPI) entry
 */
export interface MPIEntry {
    mpiId: string;
    localPatientIds: Array<{
        system: string;
        value: string;
    }>;
    demographics: PatientDemographics;
    lastUpdated: Date;
    trustScore: number;
}
/**
 * HL7 v2 message
 */
export interface HL7Message {
    messageType: HL7MessageType;
    messageControlId: string;
    sendingApplication: string;
    sendingFacility: string;
    receivingApplication: string;
    receivingFacility: string;
    timestamp: Date;
    segments: HL7Segment[];
    rawMessage: string;
}
/**
 * HL7 v2 segment
 */
export interface HL7Segment {
    segmentType: string;
    fields: string[];
}
/**
 * SMART on FHIR authorization
 */
export interface SMARTAuthConfig {
    authorizationUrl: string;
    tokenUrl: string;
    clientId: string;
    clientSecret?: string;
    redirectUri: string;
    scopes: string[];
    iss: string;
    launch?: string;
}
/**
 * FHIR bulk export request
 */
export interface FhirBulkExportRequest {
    resourceTypes?: FhirResourceType[];
    since?: Date;
    outputFormat?: string;
    typeFilter?: string[];
    patient?: string[];
    includeAssociatedData?: string[];
}
/**
 * FHIR bulk export status
 */
export interface FhirBulkExportStatus {
    transactionTime: Date;
    request: string;
    requiresAccessToken: boolean;
    output: Array<{
        type: FhirResourceType;
        url: string;
        count?: number;
    }>;
    error?: Array<{
        type: string;
        url: string;
    }>;
}
/**
 * Interoperability test result
 */
export interface InteropTestResult {
    testId: string;
    testName: string;
    category: 'FHIR' | 'DICOM' | 'HL7' | 'CDA' | 'IHE';
    status: 'passed' | 'failed' | 'warning' | 'skipped';
    duration: number;
    errors?: string[];
    warnings?: string[];
    assertions: Array<{
        description: string;
        passed: boolean;
        details?: string;
    }>;
    timestamp: Date;
}
/**
 * IHE profile types
 */
export type IHEProfile = 'PIX' | 'PDQ' | 'XDS' | 'XCA' | 'XDR' | 'XDS-I' | 'MHD' | 'ATNA';
/**
 * FHIR resource model attributes
 */
export interface FhirResourceAttributes {
    id: string;
    resourceType: string;
    resourceId: string;
    versionId?: string;
    lastUpdated: Date;
    sourceSystem?: string;
    sourceUrl?: string;
    patientId?: string;
    organizationId?: string;
    content: Record<string, any>;
    contentHash: string;
    status: string;
    syncStatus?: 'pending' | 'synced' | 'failed' | 'conflict';
    syncedAt?: Date;
    syncError?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * DICOM study model attributes
 */
export interface DicomStudyAttributes {
    id: string;
    studyInstanceUID: string;
    patientId: string;
    accessionNumber?: string;
    studyDate: Date;
    studyTime?: string;
    studyDescription?: string;
    modality: string;
    modalitiesInStudy?: string[];
    numberOfSeries: number;
    numberOfInstances: number;
    institutionName?: string;
    referringPhysicianName?: string;
    studyID?: string;
    patientName?: string;
    patientBirthDate?: Date;
    patientSex?: string;
    storageLocation?: string;
    storageSize?: number;
    dicomMetadata?: Record<string, any>;
    wadoUrl?: string;
    qidoUrl?: string;
    status: 'received' | 'processing' | 'available' | 'archived' | 'error';
    createdAt: Date;
    updatedAt: Date;
}
/**
 * EHR integration model attributes
 */
export interface EhrIntegrationAttributes {
    id: string;
    vendor: string;
    facilityId?: string;
    baseUrl: string;
    fhirEndpoint?: string;
    hl7Endpoint?: string;
    environment: string;
    authType: string;
    clientId?: string;
    apiKey?: string;
    isActive: boolean;
    lastSyncAt?: Date;
    lastSyncStatus?: 'success' | 'failure' | 'partial';
    lastSyncError?: string;
    syncedResourceCount?: number;
    configuration?: Record<string, any>;
    capabilities?: string[];
    supportedProfiles?: string[];
    rateLimitPerHour?: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates FhirResource model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<FhirResourceAttributes>>} FhirResource model
 *
 * @example
 * ```typescript
 * const FhirResourceModel = createFhirResourceModel(sequelize);
 * const patient = await FhirResourceModel.create({
 *   resourceType: 'Patient',
 *   resourceId: 'patient-123',
 *   content: { resourceType: 'Patient', id: 'patient-123', name: [...] },
 *   contentHash: 'abc123...',
 *   status: 'active'
 * });
 * ```
 */
export declare const createFhirResourceModel: (sequelize: Sequelize) => any;
/**
 * Creates DicomStudy model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DicomStudyAttributes>>} DicomStudy model
 *
 * @example
 * ```typescript
 * const DicomStudyModel = createDicomStudyModel(sequelize);
 * const study = await DicomStudyModel.create({
 *   studyInstanceUID: '1.2.840.113619.2.55.3...',
 *   patientId: 'patient-123',
 *   studyDate: new Date(),
 *   modality: 'CT',
 *   numberOfSeries: 3,
 *   numberOfInstances: 150
 * });
 * ```
 */
export declare const createDicomStudyModel: (sequelize: Sequelize) => any;
/**
 * Creates EhrIntegration model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<EhrIntegrationAttributes>>} EhrIntegration model
 *
 * @example
 * ```typescript
 * const EhrIntegrationModel = createEhrIntegrationModel(sequelize);
 * const integration = await EhrIntegrationModel.create({
 *   vendor: 'Epic',
 *   baseUrl: 'https://fhir.epic.com',
 *   fhirEndpoint: 'https://fhir.epic.com/api/FHIR/R4',
 *   environment: 'production',
 *   authType: 'OAuth2',
 *   isActive: true
 * });
 * ```
 */
export declare const createEhrIntegrationModel: (sequelize: Sequelize) => any;
/**
 * 1. Creates FHIR Patient resource.
 *
 * @param {PatientDemographics} demographics - Patient demographic data
 * @param {string} [identifier] - Patient identifier
 * @returns {Promise<Record<string, any>>} FHIR Patient resource
 *
 * @example
 * ```typescript
 * const patient = await createFhirPatient({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   dateOfBirth: new Date('1980-01-01'),
 *   gender: 'male',
 *   mrn: 'MRN123456'
 * });
 * console.log('FHIR Patient ID:', patient.id);
 * ```
 */
export declare const createFhirPatient: (demographics: PatientDemographics, identifier?: string) => Promise<Record<string, any>>;
/**
 * 2. Searches FHIR resources via REST API.
 *
 * @param {FhirSearchParams} searchParams - FHIR search parameters
 * @param {FhirResourceConfig} config - FHIR server configuration
 * @returns {Promise<Record<string, any>>} FHIR Bundle with search results
 *
 * @example
 * ```typescript
 * const results = await searchFhirResources(
 *   {
 *     resourceType: 'Observation',
 *     params: { patient: 'Patient/123', code: '8867-4' },
 *     count: 10
 *   },
 *   { baseUrl: 'https://fhir.server.com/api/R4', authToken: 'Bearer token' }
 * );
 * console.log('Found observations:', results.total);
 * ```
 */
export declare const searchFhirResources: (searchParams: FhirSearchParams, config: FhirResourceConfig) => Promise<Record<string, any>>;
/**
 * 3. Retrieves FHIR resource by ID.
 *
 * @param {FhirResourceType} resourceType - Resource type
 * @param {string} resourceId - Resource ID
 * @param {FhirResourceConfig} config - FHIR server configuration
 * @returns {Promise<Record<string, any>>} FHIR resource
 *
 * @example
 * ```typescript
 * const patient = await getFhirResource('Patient', 'patient-123', config);
 * console.log('Patient name:', patient.name[0].family);
 * ```
 */
export declare const getFhirResource: (resourceType: FhirResourceType, resourceId: string, config: FhirResourceConfig) => Promise<Record<string, any>>;
/**
 * 4. Creates or updates FHIR resource.
 *
 * @param {Record<string, any>} resource - FHIR resource
 * @param {FhirResourceConfig} config - FHIR server configuration
 * @returns {Promise<Record<string, any>>} Created/updated resource
 *
 * @example
 * ```typescript
 * const observation = {
 *   resourceType: 'Observation',
 *   status: 'final',
 *   code: { coding: [{ system: 'http://loinc.org', code: '8867-4' }] },
 *   subject: { reference: 'Patient/123' },
 *   valueQuantity: { value: 98, unit: 'bpm' }
 * };
 * const created = await createOrUpdateFhirResource(observation, config);
 * ```
 */
export declare const createOrUpdateFhirResource: (resource: Record<string, any>, config: FhirResourceConfig) => Promise<Record<string, any>>;
/**
 * 5. Creates FHIR Bundle for batch/transaction operations.
 *
 * @param {Record<string, any>[]} resources - Array of FHIR resources
 * @param {FhirBundleType} bundleType - Bundle type
 * @returns {Record<string, any>} FHIR Bundle
 *
 * @example
 * ```typescript
 * const bundle = createFhirBundle([patient, observation1, observation2], 'transaction');
 * const response = await submitFhirBundle(bundle, config);
 * ```
 */
export declare const createFhirBundle: (resources: Record<string, any>[], bundleType?: FhirBundleType) => Record<string, any>;
/**
 * 6. Validates FHIR resource against profile.
 *
 * @param {Record<string, any>} resource - FHIR resource
 * @param {string} [profileUrl] - FHIR profile URL
 * @returns {Promise<{ valid: boolean; errors?: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateFhirResource(patient, 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient');
 * if (!validation.valid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateFhirResource: (resource: Record<string, any>, profileUrl?: string) => Promise<{
    valid: boolean;
    errors?: string[];
}>;
/**
 * 7. Converts FHIR resource to hash for deduplication.
 *
 * @param {Record<string, any>} resource - FHIR resource
 * @returns {string} SHA-256 hash of resource content
 *
 * @example
 * ```typescript
 * const hash = hashFhirResource(patient);
 * // Use hash to check for duplicates in database
 * ```
 */
export declare const hashFhirResource: (resource: Record<string, any>) => string;
/**
 * 8. Parses DICOM study metadata.
 *
 * @param {Buffer} dicomBuffer - DICOM file buffer
 * @returns {Promise<DicomStudyMetadata>} Parsed study metadata
 *
 * @example
 * ```typescript
 * const metadata = await parseDicomStudy(dicomFileBuffer);
 * console.log('Study UID:', metadata.studyInstanceUID);
 * console.log('Modality:', metadata.modality);
 * ```
 */
export declare const parseDicomStudy: (dicomBuffer: Buffer) => Promise<DicomStudyMetadata>;
/**
 * 9. Generates WADO-RS URL for DICOM retrieval.
 *
 * @param {string} studyInstanceUID - Study Instance UID
 * @param {string} [seriesInstanceUID] - Series Instance UID
 * @param {string} [sopInstanceUID] - SOP Instance UID
 * @param {string} baseUrl - WADO-RS base URL
 * @returns {string} WADO-RS URL
 *
 * @example
 * ```typescript
 * const url = generateWadoUrl(
 *   '1.2.840.113619.2.55.3.123',
 *   '1.2.840.113619.2.55.3.456',
 *   null,
 *   'https://pacs.hospital.com/wado-rs'
 * );
 * // Returns: https://pacs.hospital.com/wado-rs/studies/1.2.840.113619.2.55.3.123/series/1.2.840.113619.2.55.3.456
 * ```
 */
export declare const generateWadoUrl: (studyInstanceUID: string, seriesInstanceUID?: string, sopInstanceUID?: string, baseUrl?: string) => string;
/**
 * 10. Queries DICOM studies via QIDO-RS.
 *
 * @param {Record<string, string>} queryParams - QIDO-RS query parameters
 * @param {string} baseUrl - QIDO-RS base URL
 * @returns {Promise<DicomStudyMetadata[]>} Array of study metadata
 *
 * @example
 * ```typescript
 * const studies = await queryDicomStudies(
 *   { PatientID: 'PATIENT123', StudyDate: '20240101-20240131' },
 *   'https://pacs.hospital.com/qido-rs'
 * );
 * console.log('Found studies:', studies.length);
 * ```
 */
export declare const queryDicomStudies: (queryParams: Record<string, string>, baseUrl: string) => Promise<DicomStudyMetadata[]>;
/**
 * 11. Converts DICOM to JPEG for preview.
 *
 * @param {Buffer} dicomBuffer - DICOM file buffer
 * @param {number} [frameNumber] - Frame number for multi-frame images
 * @returns {Promise<Buffer>} JPEG image buffer
 *
 * @example
 * ```typescript
 * const jpegBuffer = await convertDicomToJpeg(dicomFileBuffer, 1);
 * await fs.writeFile('preview.jpg', jpegBuffer);
 * ```
 */
export declare const convertDicomToJpeg: (dicomBuffer: Buffer, frameNumber?: number) => Promise<Buffer>;
/**
 * 12. Anonymizes DICOM file (removes PHI).
 *
 * @param {Buffer} dicomBuffer - DICOM file buffer
 * @param {Record<string, any>} [replacementValues] - Replacement values for anonymization
 * @returns {Promise<Buffer>} Anonymized DICOM buffer
 *
 * @example
 * ```typescript
 * const anonymized = await anonymizeDicom(dicomFileBuffer, {
 *   PatientID: 'ANON123',
 *   PatientName: 'ANONYMOUS'
 * });
 * ```
 */
export declare const anonymizeDicom: (dicomBuffer: Buffer, replacementValues?: Record<string, any>) => Promise<Buffer>;
/**
 * 13. Validates DICOM conformance.
 *
 * @param {Buffer} dicomBuffer - DICOM file buffer
 * @returns {Promise<{ valid: boolean; errors?: string[]; warnings?: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateDicomConformance(dicomFileBuffer);
 * if (!validation.valid) {
 *   console.error('DICOM validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateDicomConformance: (dicomBuffer: Buffer) => Promise<{
    valid: boolean;
    errors?: string[];
    warnings?: string[];
}>;
/**
 * 14. Extracts DICOM series information.
 *
 * @param {Buffer} dicomBuffer - DICOM file buffer
 * @returns {Promise<DicomSeriesInfo>} Series information
 *
 * @example
 * ```typescript
 * const seriesInfo = await extractDicomSeriesInfo(dicomFileBuffer);
 * console.log('Series description:', seriesInfo.seriesDescription);
 * ```
 */
export declare const extractDicomSeriesInfo: (dicomBuffer: Buffer) => Promise<DicomSeriesInfo>;
/**
 * 15. Authenticates with Epic FHIR server via OAuth2.
 *
 * @param {SMARTAuthConfig} authConfig - SMART on FHIR auth configuration
 * @returns {Promise<{ accessToken: string; expiresIn: number; scope: string }>} Access token
 *
 * @example
 * ```typescript
 * const auth = await authenticateEpicOAuth({
 *   authorizationUrl: 'https://fhir.epic.com/oauth2/authorize',
 *   tokenUrl: 'https://fhir.epic.com/oauth2/token',
 *   clientId: 'client-id',
 *   clientSecret: 'secret',
 *   redirectUri: 'https://app.com/callback',
 *   scopes: ['patient/*.read'],
 *   iss: 'https://fhir.epic.com'
 * });
 * console.log('Access token:', auth.accessToken);
 * ```
 */
export declare const authenticateEpicOAuth: (authConfig: SMARTAuthConfig) => Promise<{
    accessToken: string;
    expiresIn: number;
    scope: string;
}>;
/**
 * 16. Retrieves Epic patient demographics.
 *
 * @param {string} patientId - Epic patient ID
 * @param {EHRIntegrationConfig} config - EHR configuration
 * @returns {Promise<PatientDemographics>} Patient demographics
 *
 * @example
 * ```typescript
 * const demographics = await getEpicPatient('epic-patient-123', epicConfig);
 * console.log('Patient:', demographics.firstName, demographics.lastName);
 * ```
 */
export declare const getEpicPatient: (patientId: string, config: EHRIntegrationConfig) => Promise<PatientDemographics>;
/**
 * 17. Syncs Cerner observations to local database.
 *
 * @param {string} patientId - Cerner patient ID
 * @param {EHRIntegrationConfig} config - EHR configuration
 * @param {Date} [since] - Sync observations since date
 * @returns {Promise<{ synced: number; errors: string[] }>} Sync result
 *
 * @example
 * ```typescript
 * const result = await syncCernerObservations('cerner-patient-456', cernerConfig, new Date('2024-01-01'));
 * console.log('Synced observations:', result.synced);
 * ```
 */
export declare const syncCernerObservations: (patientId: string, config: EHRIntegrationConfig, since?: Date) => Promise<{
    synced: number;
    errors: string[];
}>;
/**
 * 18. Retrieves Epic medication list.
 *
 * @param {string} patientId - Epic patient ID
 * @param {EHRIntegrationConfig} config - EHR configuration
 * @returns {Promise<Record<string, any>[]>} Array of FHIR MedicationRequest resources
 *
 * @example
 * ```typescript
 * const medications = await getEpicMedications('epic-patient-123', epicConfig);
 * medications.forEach(med => {
 *   console.log('Medication:', med.medicationCodeableConcept?.text);
 * });
 * ```
 */
export declare const getEpicMedications: (patientId: string, config: EHRIntegrationConfig) => Promise<Record<string, any>[]>;
/**
 * 19. Queries Cerner diagnostic reports.
 *
 * @param {string} patientId - Cerner patient ID
 * @param {EHRIntegrationConfig} config - EHR configuration
 * @param {string} [category] - Report category (LAB, RAD, etc.)
 * @returns {Promise<Record<string, any>[]>} Array of DiagnosticReport resources
 *
 * @example
 * ```typescript
 * const labReports = await queryCernerDiagnosticReports('cerner-patient-456', cernerConfig, 'LAB');
 * ```
 */
export declare const queryCernerDiagnosticReports: (patientId: string, config: EHRIntegrationConfig, category?: string) => Promise<Record<string, any>[]>;
/**
 * 20. Retrieves EHR capability statement.
 *
 * @param {EHRIntegrationConfig} config - EHR configuration
 * @returns {Promise<Record<string, any>>} FHIR CapabilityStatement
 *
 * @example
 * ```typescript
 * const capabilities = await getEhrCapabilities(epicConfig);
 * console.log('Supported resources:', capabilities.rest[0].resource.map(r => r.type));
 * ```
 */
export declare const getEhrCapabilities: (config: EHRIntegrationConfig) => Promise<Record<string, any>>;
/**
 * 21. Creates appointment in EHR system.
 *
 * @param {Record<string, any>} appointment - FHIR Appointment resource
 * @param {EHRIntegrationConfig} config - EHR configuration
 * @returns {Promise<Record<string, any>>} Created appointment
 *
 * @example
 * ```typescript
 * const appointment = await createEhrAppointment({
 *   resourceType: 'Appointment',
 *   status: 'booked',
 *   participant: [{ actor: { reference: 'Patient/123' } }],
 *   start: '2024-12-01T10:00:00Z',
 *   end: '2024-12-01T10:30:00Z'
 * }, epicConfig);
 * ```
 */
export declare const createEhrAppointment: (appointment: Record<string, any>, config: EHRIntegrationConfig) => Promise<Record<string, any>>;
/**
 * 22. Converts FHIR Bundle to CDA document.
 *
 * @param {Record<string, any>} fhirBundle - FHIR Bundle
 * @param {CDADocumentType} documentType - CDA document type
 * @returns {Promise<CDADocument>} CDA document
 *
 * @example
 * ```typescript
 * const cdaDoc = await convertFhirToCda(patientBundle, 'C32');
 * console.log('CDA XML:', cdaDoc.xmlContent);
 * ```
 */
export declare const convertFhirToCda: (fhirBundle: Record<string, any>, documentType: CDADocumentType) => Promise<CDADocument>;
/**
 * 23. Parses CDA document to FHIR Bundle.
 *
 * @param {string} cdaXml - CDA XML content
 * @returns {Promise<Record<string, any>>} FHIR Bundle
 *
 * @example
 * ```typescript
 * const bundle = await parseCdaToFhir(cdaXmlContent);
 * console.log('Parsed resources:', bundle.entry.length);
 * ```
 */
export declare const parseCdaToFhir: (cdaXml: string) => Promise<Record<string, any>>;
/**
 * 24. Extracts CDA document sections.
 *
 * @param {string} cdaXml - CDA XML content
 * @returns {Promise<CDASection[]>} Array of CDA sections
 *
 * @example
 * ```typescript
 * const sections = await extractCdaSections(cdaXmlContent);
 * sections.forEach(section => {
 *   console.log('Section:', section.title);
 * });
 * ```
 */
export declare const extractCdaSections: (cdaXml: string) => Promise<CDASection[]>;
/**
 * 25. Validates CDA document conformance.
 *
 * @param {string} cdaXml - CDA XML content
 * @param {CDADocumentType} documentType - Expected document type
 * @returns {Promise<{ valid: boolean; errors?: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateCdaDocument(cdaXml, 'C32');
 * if (!validation.valid) {
 *   console.error('CDA validation errors:', validation.errors);
 * }
 * ```
 */
export declare const validateCdaDocument: (cdaXml: string, documentType: CDADocumentType) => Promise<{
    valid: boolean;
    errors?: string[];
}>;
/**
 * 26. Generates C32 (Continuity of Care Document).
 *
 * @param {string} patientId - Patient identifier
 * @param {Record<string, any>} clinicalData - Clinical data
 * @returns {Promise<CDADocument>} C32 document
 *
 * @example
 * ```typescript
 * const c32 = await generateC32Document('patient-123', {
 *   medications: [...],
 *   allergies: [...],
 *   problems: [...]
 * });
 * ```
 */
export declare const generateC32Document: (patientId: string, clinicalData: Record<string, any>) => Promise<CDADocument>;
/**
 * 27. Converts CCR to CDA format.
 *
 * @param {string} ccrXml - CCR XML content
 * @returns {Promise<CDADocument>} CDA document
 *
 * @example
 * ```typescript
 * const cda = await convertCcrToCda(ccrXmlContent);
 * ```
 */
export declare const convertCcrToCda: (ccrXml: string) => Promise<CDADocument>;
/**
 * 28. Extracts patient summary from CDA.
 *
 * @param {string} cdaXml - CDA XML content
 * @returns {Promise<Record<string, any>>} Patient summary
 *
 * @example
 * ```typescript
 * const summary = await extractPatientSummaryFromCda(cdaXml);
 * console.log('Allergies:', summary.allergies);
 * console.log('Medications:', summary.medications);
 * ```
 */
export declare const extractPatientSummaryFromCda: (cdaXml: string) => Promise<Record<string, any>>;
/**
 * 29. Performs probabilistic patient matching.
 *
 * @param {PatientDemographics} queryPatient - Patient to match
 * @param {PatientDemographics[]} candidates - Candidate patients
 * @returns {PatientMatchResult[]} Array of match results sorted by score
 *
 * @example
 * ```typescript
 * const matches = performPatientMatching(newPatient, existingPatients);
 * const bestMatch = matches[0];
 * if (bestMatch.matchScore > 0.9) {
 *   console.log('High confidence match:', bestMatch.patientId);
 * }
 * ```
 */
export declare const performPatientMatching: (queryPatient: PatientDemographics, candidates: PatientDemographics[]) => PatientMatchResult[];
/**
 * 30. Creates Master Patient Index (MPI) entry.
 *
 * @param {PatientDemographics} demographics - Patient demographics
 * @param {string} localPatientId - Local patient identifier
 * @param {string} system - Source system identifier
 * @returns {Promise<MPIEntry>} MPI entry
 *
 * @example
 * ```typescript
 * const mpiEntry = await createMpiEntry(demographics, 'MRN123', 'Epic');
 * console.log('MPI ID:', mpiEntry.mpiId);
 * ```
 */
export declare const createMpiEntry: (demographics: PatientDemographics, localPatientId: string, system: string) => Promise<MPIEntry>;
/**
 * 31. Links patient records across systems.
 *
 * @param {string} mpiId - Master patient index ID
 * @param {string} localPatientId - Local patient ID to link
 * @param {string} system - Source system
 * @returns {Promise<MPIEntry>} Updated MPI entry
 *
 * @example
 * ```typescript
 * const updated = await linkPatientRecords('mpi-123', 'CERNER456', 'Cerner');
 * console.log('Linked systems:', updated.localPatientIds.map(id => id.system));
 * ```
 */
export declare const linkPatientRecords: (mpiId: string, localPatientId: string, system: string) => Promise<MPIEntry>;
/**
 * 32. Calculates patient match confidence score.
 *
 * @param {PatientDemographics} patient1 - First patient
 * @param {PatientDemographics} patient2 - Second patient
 * @returns {number} Match confidence (0.0 to 1.0)
 *
 * @example
 * ```typescript
 * const confidence = calculateMatchConfidence(patientA, patientB);
 * if (confidence > 0.95) {
 *   console.log('Very high confidence match');
 * }
 * ```
 */
export declare const calculateMatchConfidence: (patient1: PatientDemographics, patient2: PatientDemographics) => number;
/**
 * 33. Searches MPI for patient.
 *
 * @param {Partial<PatientDemographics>} searchCriteria - Search criteria
 * @returns {Promise<MPIEntry[]>} Matching MPI entries
 *
 * @example
 * ```typescript
 * const results = await searchMpi({ lastName: 'Doe', dateOfBirth: new Date('1980-01-01') });
 * console.log('Found patients:', results.length);
 * ```
 */
export declare const searchMpi: (searchCriteria: Partial<PatientDemographics>) => Promise<MPIEntry[]>;
/**
 * 34. Resolves patient duplicates in MPI.
 *
 * @param {string} mpiId1 - First MPI ID
 * @param {string} mpiId2 - Second MPI ID (duplicate)
 * @returns {Promise<MPIEntry>} Merged MPI entry
 *
 * @example
 * ```typescript
 * const merged = await resolvePatientDuplicates('mpi-123', 'mpi-456');
 * console.log('Merged MPI ID:', merged.mpiId);
 * ```
 */
export declare const resolvePatientDuplicates: (mpiId1: string, mpiId2: string) => Promise<MPIEntry>;
/**
 * 35. Validates patient identity.
 *
 * @param {PatientDemographics} demographics - Patient demographics
 * @param {string[]} requiredFields - Required fields for validation
 * @returns {{ valid: boolean; missingFields?: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validatePatientIdentity(demographics, ['firstName', 'lastName', 'dateOfBirth', 'ssn']);
 * if (!validation.valid) {
 *   console.error('Missing fields:', validation.missingFields);
 * }
 * ```
 */
export declare const validatePatientIdentity: (demographics: PatientDemographics, requiredFields: string[]) => {
    valid: boolean;
    missingFields?: string[];
};
/**
 * 36. Tests FHIR server connectivity.
 *
 * @param {string} fhirBaseUrl - FHIR server base URL
 * @returns {Promise<InteropTestResult>} Test result
 *
 * @example
 * ```typescript
 * const result = await testFhirConnectivity('https://fhir.epic.com/api/FHIR/R4');
 * console.log('Test status:', result.status);
 * ```
 */
export declare const testFhirConnectivity: (fhirBaseUrl: string) => Promise<InteropTestResult>;
/**
 * 37. Validates HL7 v2 message format.
 *
 * @param {string} hl7Message - HL7 v2 message
 * @returns {Promise<InteropTestResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateHl7Message(hl7MessageContent);
 * if (result.status === 'passed') {
 *   console.log('HL7 message is valid');
 * }
 * ```
 */
export declare const validateHl7Message: (hl7Message: string) => Promise<InteropTestResult>;
/**
 * 38. Tests DICOM WADO-RS endpoint.
 *
 * @param {string} wadoBaseUrl - WADO-RS base URL
 * @param {string} studyInstanceUID - Test study UID
 * @returns {Promise<InteropTestResult>} Test result
 *
 * @example
 * ```typescript
 * const result = await testDicomWadoEndpoint('https://pacs.hospital.com/wado-rs', 'study-uid');
 * ```
 */
export declare const testDicomWadoEndpoint: (wadoBaseUrl: string, studyInstanceUID: string) => Promise<InteropTestResult>;
/**
 * 39. Validates IHE profile compliance.
 *
 * @param {IHEProfile} profile - IHE profile type
 * @param {Record<string, any>} implementation - Implementation to test
 * @returns {Promise<InteropTestResult>} Compliance test result
 *
 * @example
 * ```typescript
 * const result = await validateIheProfile('PIX', pixImplementation);
 * console.log('IHE compliance:', result.status);
 * ```
 */
export declare const validateIheProfile: (profile: IHEProfile, implementation: Record<string, any>) => Promise<InteropTestResult>;
/**
 * 40. Tests CDA document exchange.
 *
 * @param {string} cdaXml - CDA document XML
 * @param {CDADocumentType} expectedType - Expected document type
 * @returns {Promise<InteropTestResult>} Test result
 *
 * @example
 * ```typescript
 * const result = await testCdaExchange(cdaXmlContent, 'C32');
 * ```
 */
export declare const testCdaExchange: (cdaXml: string, expectedType: CDADocumentType) => Promise<InteropTestResult>;
/**
 * 41. Performs end-to-end interoperability test.
 *
 * @param {EHRIntegrationConfig} config - EHR configuration
 * @returns {Promise<InteropTestResult[]>} Array of test results
 *
 * @example
 * ```typescript
 * const results = await performE2eInteropTest(epicConfig);
 * const passed = results.filter(r => r.status === 'passed').length;
 * console.log(`${passed}/${results.length} tests passed`);
 * ```
 */
export declare const performE2eInteropTest: (config: EHRIntegrationConfig) => Promise<InteropTestResult[]>;
/**
 * 42. Generates interoperability test report.
 *
 * @param {InteropTestResult[]} testResults - Array of test results
 * @returns {string} Test report (JSON)
 *
 * @example
 * ```typescript
 * const report = generateInteropTestReport(testResults);
 * await fs.writeFile('interop-report.json', report);
 * ```
 */
export declare const generateInteropTestReport: (testResults: InteropTestResult[]) => string;
declare const _default: {
    createFhirResourceModel: (sequelize: Sequelize) => any;
    createDicomStudyModel: (sequelize: Sequelize) => any;
    createEhrIntegrationModel: (sequelize: Sequelize) => any;
    createFhirPatient: (demographics: PatientDemographics, identifier?: string) => Promise<Record<string, any>>;
    searchFhirResources: (searchParams: FhirSearchParams, config: FhirResourceConfig) => Promise<Record<string, any>>;
    getFhirResource: (resourceType: FhirResourceType, resourceId: string, config: FhirResourceConfig) => Promise<Record<string, any>>;
    createOrUpdateFhirResource: (resource: Record<string, any>, config: FhirResourceConfig) => Promise<Record<string, any>>;
    createFhirBundle: (resources: Record<string, any>[], bundleType?: FhirBundleType) => Record<string, any>;
    validateFhirResource: (resource: Record<string, any>, profileUrl?: string) => Promise<{
        valid: boolean;
        errors?: string[];
    }>;
    hashFhirResource: (resource: Record<string, any>) => string;
    parseDicomStudy: (dicomBuffer: Buffer) => Promise<DicomStudyMetadata>;
    generateWadoUrl: (studyInstanceUID: string, seriesInstanceUID?: string, sopInstanceUID?: string, baseUrl?: string) => string;
    queryDicomStudies: (queryParams: Record<string, string>, baseUrl: string) => Promise<DicomStudyMetadata[]>;
    convertDicomToJpeg: (dicomBuffer: Buffer, frameNumber?: number) => Promise<Buffer>;
    anonymizeDicom: (dicomBuffer: Buffer, replacementValues?: Record<string, any>) => Promise<Buffer>;
    validateDicomConformance: (dicomBuffer: Buffer) => Promise<{
        valid: boolean;
        errors?: string[];
        warnings?: string[];
    }>;
    extractDicomSeriesInfo: (dicomBuffer: Buffer) => Promise<DicomSeriesInfo>;
    authenticateEpicOAuth: (authConfig: SMARTAuthConfig) => Promise<{
        accessToken: string;
        expiresIn: number;
        scope: string;
    }>;
    getEpicPatient: (patientId: string, config: EHRIntegrationConfig) => Promise<PatientDemographics>;
    syncCernerObservations: (patientId: string, config: EHRIntegrationConfig, since?: Date) => Promise<{
        synced: number;
        errors: string[];
    }>;
    getEpicMedications: (patientId: string, config: EHRIntegrationConfig) => Promise<Record<string, any>[]>;
    queryCernerDiagnosticReports: (patientId: string, config: EHRIntegrationConfig, category?: string) => Promise<Record<string, any>[]>;
    getEhrCapabilities: (config: EHRIntegrationConfig) => Promise<Record<string, any>>;
    createEhrAppointment: (appointment: Record<string, any>, config: EHRIntegrationConfig) => Promise<Record<string, any>>;
    convertFhirToCda: (fhirBundle: Record<string, any>, documentType: CDADocumentType) => Promise<CDADocument>;
    parseCdaToFhir: (cdaXml: string) => Promise<Record<string, any>>;
    extractCdaSections: (cdaXml: string) => Promise<CDASection[]>;
    validateCdaDocument: (cdaXml: string, documentType: CDADocumentType) => Promise<{
        valid: boolean;
        errors?: string[];
    }>;
    generateC32Document: (patientId: string, clinicalData: Record<string, any>) => Promise<CDADocument>;
    convertCcrToCda: (ccrXml: string) => Promise<CDADocument>;
    extractPatientSummaryFromCda: (cdaXml: string) => Promise<Record<string, any>>;
    performPatientMatching: (queryPatient: PatientDemographics, candidates: PatientDemographics[]) => PatientMatchResult[];
    createMpiEntry: (demographics: PatientDemographics, localPatientId: string, system: string) => Promise<MPIEntry>;
    linkPatientRecords: (mpiId: string, localPatientId: string, system: string) => Promise<MPIEntry>;
    calculateMatchConfidence: (patient1: PatientDemographics, patient2: PatientDemographics) => number;
    searchMpi: (searchCriteria: Partial<PatientDemographics>) => Promise<MPIEntry[]>;
    resolvePatientDuplicates: (mpiId1: string, mpiId2: string) => Promise<MPIEntry>;
    validatePatientIdentity: (demographics: PatientDemographics, requiredFields: string[]) => {
        valid: boolean;
        missingFields?: string[];
    };
    testFhirConnectivity: (fhirBaseUrl: string) => Promise<InteropTestResult>;
    validateHl7Message: (hl7Message: string) => Promise<InteropTestResult>;
    testDicomWadoEndpoint: (wadoBaseUrl: string, studyInstanceUID: string) => Promise<InteropTestResult>;
    validateIheProfile: (profile: IHEProfile, implementation: Record<string, any>) => Promise<InteropTestResult>;
    testCdaExchange: (cdaXml: string, expectedType: CDADocumentType) => Promise<InteropTestResult>;
    performE2eInteropTest: (config: EHRIntegrationConfig) => Promise<InteropTestResult[]>;
    generateInteropTestReport: (testResults: InteropTestResult[]) => string;
};
export default _default;
//# sourceMappingURL=document-healthcare-integration-kit.d.ts.map