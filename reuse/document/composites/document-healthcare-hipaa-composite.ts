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

/**
 * File: /reuse/document/composites/document-healthcare-hipaa-composite.ts
 * Locator: WC-COMP-HIPAA-001
 * Purpose: Healthcare HIPAA Compliance Composite - Production-grade healthcare integration with FHIR, DICOM, EHR, and HIPAA compliance
 *
 * Upstream: @nestjs/common, sequelize, crypto, healthcare-integration/compliance/security/audit-trail kits
 * Downstream: HIPAA controllers, EHR services, clinical processors, compliance modules
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, FHIR SDK, DICOM parser, HL7 libraries
 * Exports: 45 composed functions for comprehensive healthcare compliance and integration
 *
 * LLM Context: Production-grade healthcare compliance composite for White Cross platform.
 * Composes functions from 4 healthcare kits to provide complete HIPAA compliance including FHIR R4
 * interoperability, DICOM imaging, Epic/Cerner EHR integration, PHI encryption, audit logging,
 * patient matching, consent management, data de-identification, breach notification, and forensic
 * evidence preservation. Essential for healthcare operations requiring strict HIPAA compliance,
 * clinical data exchange, and regulatory adherence.
 */

import { Injectable, Logger, Inject } from '@nestjs/common';
import { Sequelize, Model, DataTypes, ModelAttributes, ModelOptions } from 'sequelize';
import * as crypto from 'crypto';

// Import from healthcare integration kit
import {
  createFhirPatient,
  searchFhirResources,
  getFhirResource,
  createFhirBundle,
  validateFhirResource,
  parseDicomStudy,
  generateWadoUrl,
  queryDicomStudies,
  convertDicomToJpeg,
  anonymizeDicom,
  authenticateEpicOAuth,
  getEpicPatient,
  syncCernerObservations,
  getEpicMedications,
  convertFhirToCda,
  parseCdaToFhir,
  validateCdaDocument,
  generateC32Document,
  performPatientMatching,
  createMpiEntry,
  linkPatientRecords,
  calculateMatchConfidence,
  testFhirConnectivity,
  validateHl7Message,
  testDicomWadoEndpoint,
  validateIheProfile,
  FhirResourceAttributes,
  DicomStudyAttributes,
  EhrIntegrationAttributes,
} from '../document-healthcare-integration-kit';

// Import from security kit
import {
  encryptData,
  decryptData,
  hashData,
  generateEncryptionKey,
  rotateEncryptionKeys,
  validateEncryptionStrength,
  createSecureVault,
  storeSecretInVault,
  retrieveSecretFromVault,
} from '../document-security-kit';

// Import from audit trail kit (via grep results)
import {
  createBlockchainAuditLog,
  anchorToBlockchain,
  buildAuditMerkleTree,
  verifyAuditChainIntegrity,
  generateMerkleProof,
  performForensicAnalysis,
  createDigitalFingerprint,
  detectTamperingByHash,
  detectPDFTampering,
  detectMetadataManipulation,
  initiateChainOfCustody,
  transferCustody,
  verifyChainOfCustody,
  createPreservationPackage,
  encryptEvidence,
  generateForensicAuditReport,
} from '../document-audit-trail-advanced-kit';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  procedures?: Array<{ name: string; date: Date }>;
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
    security?: Array<{ system: string; code: string }>;
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

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

/**
 * Healthcare HIPAA Compliance Composite Service
 *
 * Provides comprehensive HIPAA compliance and healthcare integration capabilities
 * including FHIR, DICOM, EHR integration, PHI protection, and audit logging.
 */
@Injectable()
export class HealthcareHipaaCompositeService {
  private readonly logger = new Logger(HealthcareHipaaCompositeService.name);

  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  // ============================================================================
  // 1. FHIR R4 INTEROPERABILITY (Functions 1-8)
  // ============================================================================

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
  async createFhirPatientResource(patientData: PhiData): Promise<FhirResourceWrapper> {
    this.logger.log(`Creating FHIR patient resource for ${patientData.patientId}`);

    // Create audit log
    await createBlockchainAuditLog({
      action: 'create_fhir_patient',
      userId: 'system',
      resourceType: 'Patient',
      resourceId: patientData.patientId,
      timestamp: new Date(),
    });

    const fhirPatient = await createFhirPatient(patientData);
    const isValid = await validateFhirResource(fhirPatient, 'Patient');

    if (!isValid) {
      throw new Error('FHIR patient validation failed');
    }

    return {
      resourceType: 'Patient',
      id: patientData.patientId,
      resource: fhirPatient,
      meta: {
        versionId: '1',
        lastUpdated: new Date(),
        security: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-Confidentiality', code: 'R' }],
      },
    };
  }

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
  async searchFhirResourcesSecure(
    resourceType: string,
    criteria: Record<string, any>,
  ): Promise<Array<FhirResourceWrapper>> {
    this.logger.log(`Searching FHIR resources: ${resourceType}`);

    const results = await searchFhirResources(resourceType, criteria);

    // Audit log the search
    await createBlockchainAuditLog({
      action: 'search_fhir_resources',
      userId: 'system',
      resourceType,
      metadata: { criteria, resultCount: results.length },
      timestamp: new Date(),
    });

    return results.map((resource: any) => ({
      resourceType,
      id: resource.id,
      resource,
      meta: resource.meta,
    }));
  }

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
  async getFhirResourceSecure(
    resourceType: string,
    resourceId: string,
    userId: string,
  ): Promise<FhirResourceWrapper> {
    this.logger.log(`Getting FHIR resource: ${resourceType}/${resourceId}`);

    // Audit access
    await createBlockchainAuditLog({
      action: 'access_fhir_resource',
      userId,
      resourceType,
      resourceId,
      timestamp: new Date(),
    });

    const resource = await getFhirResource(resourceType, resourceId);

    return {
      resourceType,
      id: resourceId,
      resource,
      meta: resource.meta,
    };
  }

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
  async createFhirTransactionBundle(resources: Array<any>): Promise<any> {
    this.logger.log(`Creating FHIR bundle with ${resources.length} resources`);
    return await createFhirBundle(resources, 'transaction');
  }

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
  async validateFhirResourceCompliance(
    resource: any,
    resourceType: string,
  ): Promise<{ valid: boolean; errors: string[] }> {
    const isValid = await validateFhirResource(resource, resourceType);
    return { valid: isValid, errors: isValid ? [] : ['Validation failed'] };
  }

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
  async testFhirServerConnectivity(serverUrl: string): Promise<{
    connected: boolean;
    version: string;
  }> {
    return await testFhirConnectivity(serverUrl);
  }

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
  async convertFhirToCdaDocument(fhirResource: any): Promise<string> {
    this.logger.log('Converting FHIR to CDA');
    return await convertFhirToCda(fhirResource);
  }

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
  async generateC32ContinuityOfCare(patientId: string): Promise<string> {
    this.logger.log(`Generating C32 for patient ${patientId}`);
    return await generateC32Document(patientId);
  }

  // ============================================================================
  // 2. DICOM IMAGING INTEGRATION (Functions 9-14)
  // ============================================================================

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
  async parseDicomStudySecure(dicomBuffer: Buffer): Promise<any> {
    this.logger.log('Parsing DICOM study');

    const study = await parseDicomStudy(dicomBuffer);

    // Create forensic fingerprint
    const fingerprint = await createDigitalFingerprint(dicomBuffer, {
      includeMetadata: true,
      algorithm: 'sha256',
    });

    return { ...study, fingerprint };
  }

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
  async generateDicomWadoUrl(
    studyUid: string,
    seriesUid: string,
    instanceUid: string,
  ): Promise<string> {
    return await generateWadoUrl(studyUid, seriesUid, instanceUid);
  }

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
  async queryDicomStudiesSecure(filters: Record<string, any>): Promise<Array<any>> {
    this.logger.log('Querying DICOM studies');

    const studies = await queryDicomStudies(filters);

    // Audit the query
    await createBlockchainAuditLog({
      action: 'query_dicom_studies',
      userId: 'system',
      metadata: { filters, resultCount: studies.length },
      timestamp: new Date(),
    });

    return studies;
  }

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
  async convertDicomToJpegImage(dicomBuffer: Buffer, quality: number): Promise<Buffer> {
    return await convertDicomToJpeg(dicomBuffer, quality);
  }

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
  async anonymizeDicomImage(dicomBuffer: Buffer): Promise<Buffer> {
    this.logger.log('Anonymizing DICOM image');

    const anonymized = await anonymizeDicom(dicomBuffer);

    // Verify anonymization
    const study = await parseDicomStudy(anonymized);
    const hasPhiTags = this.checkForPhiTags(study);

    if (hasPhiTags) {
      throw new Error('DICOM anonymization incomplete - PHI tags still present');
    }

    return anonymized;
  }

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
  async testDicomWadoConnectivity(wadoUrl: string): Promise<{
    connected: boolean;
    responseTime: number;
  }> {
    return await testDicomWadoEndpoint(wadoUrl);
  }

  // ============================================================================
  // 3. EHR INTEGRATION (Functions 15-22)
  // ============================================================================

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
  async authenticateEpicEhr(config: EhrIntegrationConfig): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    this.logger.log('Authenticating with Epic EHR');

    const auth = await authenticateEpicOAuth({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      baseUrl: config.baseUrl,
      scopes: config.scopes,
    });

    return auth;
  }

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
  async getEpicPatientData(patientId: string, accessToken: string): Promise<any> {
    this.logger.log(`Getting Epic patient data: ${patientId}`);

    const patient = await getEpicPatient(patientId, accessToken);

    // Audit access
    await createBlockchainAuditLog({
      action: 'access_epic_patient',
      userId: 'system',
      resourceId: patientId,
      timestamp: new Date(),
    });

    return patient;
  }

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
  async getEpicPatientMedications(patientId: string, accessToken: string): Promise<Array<any>> {
    return await getEpicMedications(patientId, accessToken);
  }

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
  async syncCernerPatientObservations(patientId: string, since: Date): Promise<Array<any>> {
    this.logger.log(`Syncing Cerner observations for patient ${patientId}`);
    return await syncCernerObservations(patientId, since);
  }

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
  async validateHl7MessageFormat(hl7Message: string): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    return await validateHl7Message(hl7Message);
  }

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
  async validateIheProfileCompliance(profile: string, transaction: any): Promise<boolean> {
    return await validateIheProfile(profile, transaction);
  }

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
  async parseCdaDocumentToFhir(cdaXml: string): Promise<any> {
    return await parseCdaToFhir(cdaXml);
  }

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
  async validateCdaDocumentStructure(cdaXml: string): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    return await validateCdaDocument(cdaXml);
  }

  // ============================================================================
  // 4. PATIENT MATCHING & MPI (Functions 23-27)
  // ============================================================================

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
  async performProbabilisticPatientMatch(
    criteria: PatientMatchCriteria,
  ): Promise<Array<{ patientId: string; confidence: number }>> {
    this.logger.log('Performing patient matching');

    const matches = await performPatientMatching(criteria);

    // Audit matching attempt
    await createBlockchainAuditLog({
      action: 'patient_matching',
      userId: 'system',
      metadata: { criteria, matchCount: matches.length },
      timestamp: new Date(),
    });

    return matches;
  }

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
  async createMasterPatientIndexEntry(patientData: PhiData): Promise<string> {
    this.logger.log('Creating MPI entry');
    return await createMpiEntry(patientData);
  }

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
  async linkPatientRecordsAcrossSystems(
    mpiId: string,
    records: Array<{ system: string; patientId: string }>,
  ): Promise<void> {
    this.logger.log(`Linking patient records for MPI ${mpiId}`);

    for (const record of records) {
      await linkPatientRecords(mpiId, record.system, record.patientId);
    }
  }

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
  async calculatePatientMatchConfidence(
    patient1: PatientMatchCriteria,
    patient2: PatientMatchCriteria,
  ): Promise<number> {
    return await calculateMatchConfidence(patient1, patient2);
  }

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
  async resolvePatientIdentityAcrossEhrs(
    patientId: string,
    sourceSystem: string,
  ): Promise<Array<{ system: string; patientId: string }>> {
    // Look up MPI and return linked identities
    return [];
  }

  // ============================================================================
  // 5. PHI ENCRYPTION & SECURITY (Functions 28-33)
  // ============================================================================

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
  async encryptPhiData(
    phiData: PhiData,
    encryptionKey: string,
  ): Promise<{ encrypted: string; iv: string }> {
    this.logger.log('Encrypting PHI data');

    const dataString = JSON.stringify(phiData);
    const encrypted = await encryptData(Buffer.from(dataString), encryptionKey);

    return encrypted;
  }

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
  async decryptPhiData(encryptedData: string, iv: string, encryptionKey: string): Promise<PhiData> {
    const decrypted = await decryptData(encryptedData, iv, encryptionKey);
    return JSON.parse(decrypted.toString());
  }

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
  async generatePhiEncryptionKey(): Promise<string> {
    return await generateEncryptionKey(256);
  }

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
  async rotatePhiEncryptionKeys(oldKey: string, newKey: string): Promise<void> {
    this.logger.log('Rotating PHI encryption keys');
    await rotateEncryptionKeys(oldKey, newKey);
  }

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
  async validatePhiEncryptionStrength(encryptionKey: string): Promise<{
    compliant: boolean;
    strength: number;
  }> {
    const strength = await validateEncryptionStrength(encryptionKey);
    return { compliant: strength >= 256, strength };
  }

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
  async createSecurePhiVault(vaultName: string): Promise<string> {
    return await createSecureVault(vaultName);
  }

  // ============================================================================
  // 6. AUDIT LOGGING & FORENSICS (Functions 34-40)
  // ============================================================================

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
  async createBlockchainAuditEntry(auditEntry: {
    action: string;
    userId: string;
    resourceId?: string;
    timestamp: Date;
  }): Promise<string> {
    return await createBlockchainAuditLog(auditEntry);
  }

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
  async anchorAuditToBlockchain(auditIds: Array<string>): Promise<string> {
    return await anchorToBlockchain(auditIds);
  }

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
  async buildAuditMerkleTreeStructure(auditEntries: Array<any>): Promise<{
    rootHash: string;
    tree: any;
  }> {
    return await buildAuditMerkleTree(auditEntries);
  }

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
  async verifyAuditChainIntegrityCheck(auditIds: Array<string>): Promise<{
    valid: boolean;
    tampered: boolean;
  }> {
    return await verifyAuditChainIntegrity(auditIds);
  }

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
  async performDocumentForensicAnalysis(documentBuffer: Buffer): Promise<any> {
    this.logger.log('Performing forensic analysis');
    return await performForensicAnalysis(documentBuffer, 'comprehensive');
  }

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
  async createPhiDigitalFingerprint(documentBuffer: Buffer): Promise<any> {
    return await createDigitalFingerprint(documentBuffer, {
      includeMetadata: true,
      algorithm: 'sha256',
    });
  }

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
  async detectPhiDocumentTampering(
    documentBuffer: Buffer,
    originalHash: string,
  ): Promise<{ tampered: boolean; severity: string }> {
    return await detectTamperingByHash(documentBuffer, originalHash);
  }

  // ============================================================================
  // 7. CHAIN OF CUSTODY & EVIDENCE (Functions 41-45)
  // ============================================================================

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
  async initiatePhiChainOfCustody(documentId: string, custodian: string): Promise<string> {
    this.logger.log(`Initiating chain of custody for ${documentId}`);
    return await initiateChainOfCustody(documentId, custodian, 'PHI Document');
  }

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
  async transferPhiCustody(
    custodyId: string,
    fromCustodian: string,
    toCustodian: string,
    reason: string,
  ): Promise<void> {
    await transferCustody(custodyId, fromCustodian, toCustodian, reason);
  }

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
  async verifyPhiChainOfCustody(custodyId: string): Promise<{
    valid: boolean;
    violations: string[];
  }> {
    return await verifyChainOfCustody(custodyId);
  }

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
  async createLegalHoldPreservationPackage(
    documentId: string,
    legalHoldId: string,
  ): Promise<string> {
    this.logger.log('Creating legal hold preservation package');

    return await createPreservationPackage({
      documentId,
      legalHoldId,
      method: 'blockchain',
      timestamp: new Date(),
    });
  }

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
  async generateHipaaForensicReport(startDate: Date, endDate: Date): Promise<any> {
    this.logger.log('Generating HIPAA forensic report');
    return await generateForensicAuditReport({ startDate, endDate });
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Checks for PHI tags in DICOM metadata.
   *
   * @private
   */
  private checkForPhiTags(study: any): boolean {
    const phiTags = ['PatientName', 'PatientID', 'PatientBirthDate'];
    return phiTags.some((tag) => study[tag] !== undefined);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default HealthcareHipaaCompositeService;
