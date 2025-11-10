/**
 * LOC: DOC-COMP-ADV-001
 * File: /reuse/document/document-compliance-advanced-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - crypto (Node.js)
 *   - node-forge
 *
 * DOWNSTREAM (imported by):
 *   - Compliance controllers
 *   - Regulatory services
 *   - Audit modules
 */
/**
 * File: /reuse/document/document-compliance-advanced-kit.ts
 * Locator: WC-UTL-COMPADV-001
 * Purpose: Advanced Compliance & Regulatory Kit - FDA 21 CFR Part 11, eIDAS, GDPR, CCPA, HIPAA, SOX, audit reports
 *
 * Upstream: @nestjs/common, sequelize, crypto, node-forge
 * Downstream: Compliance controllers, regulatory services, audit modules
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, node-forge 1.3.x
 * Exports: 45 utility functions for compliance frameworks, regulatory audits, data protection, privacy controls
 *
 * LLM Context: Production-grade compliance framework utilities for White Cross healthcare platform.
 * Provides FDA 21 CFR Part 11 electronic record validation, eIDAS qualified signature support, GDPR data protection,
 * CCPA privacy rights enforcement, HIPAA safeguards, SOX controls, comprehensive audit reporting, compliance gap
 * identification, remediation tracking, compliance posture assessment, and executive summaries. Essential for meeting
 * regulatory requirements across multiple jurisdictions and frameworks.
 */
import { Sequelize } from 'sequelize';
/**
 * Compliance framework types
 */
export type ComplianceFramework = 'FDA_21CFR11' | 'eIDAS' | 'GDPR' | 'CCPA' | 'HIPAA' | 'SOX' | 'HIPAA_PRIVACY' | 'HIPAA_SECURITY' | 'HIPAA_BREACH';
/**
 * Severity levels for compliance findings
 */
export type ComplianceSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
/**
 * Compliance violation status
 */
export type ViolationStatus = 'OPEN' | 'IN_REMEDIATION' | 'RESOLVED' | 'ACCEPTED_RISK';
/**
 * Data processing basis for GDPR
 */
export type LawfulBasis = 'CONSENT' | 'CONTRACT' | 'LEGAL_OBLIGATION' | 'VITAL_INTERESTS' | 'PUBLIC_TASK' | 'LEGITIMATE_INTERESTS';
/**
 * Compliance finding details
 */
export interface ComplianceFinding {
    id: string;
    framework: ComplianceFramework;
    category: string;
    severity: ComplianceSeverity;
    finding: string;
    remediation?: string;
    dueDate?: Date;
    evidenceRef?: string;
}
/**
 * Compliance policy configuration
 */
export interface CompliancePolicyConfig {
    framework: ComplianceFramework;
    requirements: string[];
    controls: string[];
    autoEnforcement: boolean;
    notificationThreshold?: ComplianceSeverity;
}
/**
 * Data protection impact assessment
 */
export interface DataProtectionImpactAssessment {
    id: string;
    dataCategory: string;
    processingPurpose: string;
    lawfulBasis: LawfulBasis;
    thirdParties: string[];
    risks: Array<{
        risk: string;
        severity: ComplianceSeverity;
    }>;
    mitigations: string[];
    approved: boolean;
}
/**
 * PHI access audit record
 */
export interface PHIAccessAudit {
    timestamp: Date;
    userId: string;
    dataElementsAccessed: string[];
    purpose: string;
    minimumNecessary: boolean;
    location?: string;
}
/**
 * Compliance violation with tracking
 */
export interface ComplianceViolationRecord {
    id: string;
    framework: ComplianceFramework;
    violationType: string;
    severity: ComplianceSeverity;
    affectedRecords: number;
    discoveredAt: Date;
    reportedAt?: Date;
    resolvedAt?: Date;
    remediationPlan?: string;
}
/**
 * Audit evidence item
 */
export interface AuditEvidence {
    id: string;
    type: 'SCREENSHOT' | 'LOG' | 'REPORT' | 'DOCUMENT' | 'TEST_RESULT';
    sourceSystem: string;
    collectedAt: Date;
    dataHash: string;
    description: string;
    relatedFinding?: string;
}
/**
 * CompliancePolicy model attributes
 */
export interface CompliancePolicyAttributes {
    id: string;
    framework: string;
    policyName: string;
    description?: string;
    requirements: Record<string, any>;
    controls: string[];
    autoEnforcement: boolean;
    notificationThreshold?: string;
    effectiveDate: Date;
    reviewDate?: Date;
    approvedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * ComplianceAudit model attributes
 */
export interface ComplianceAuditAttributes {
    id: string;
    framework: string;
    auditType: string;
    status: string;
    findings: Record<string, any>;
    findingCount: number;
    criticalCount: number;
    highCount: number;
    startDate: Date;
    endDate?: Date;
    auditedBy?: string;
    nextAuditDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * ComplianceViolation model attributes
 */
export interface ComplianceViolationAttributes {
    id: string;
    framework: string;
    violationType: string;
    severity: string;
    status: string;
    affectedRecordCount: number;
    discoveredAt: Date;
    reportedAt?: Date;
    resolvedAt?: Date;
    remediationPlan?: string;
    remediationDueDate?: Date;
    regulatoryNotificationRequired: boolean;
    notifiedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates CompliancePolicy model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<CompliancePolicyAttributes>>} CompliancePolicy model
 *
 * @example
 * ```typescript
 * const PolicyModel = createCompliancePolicyModel(sequelize);
 * const policy = await PolicyModel.create({
 *   framework: 'HIPAA',
 *   policyName: 'Patient Privacy Policy',
 *   requirements: { minEncryptionLevel: 'AES-256' },
 *   controls: ['access-control', 'encryption', 'audit-logging'],
 *   autoEnforcement: true,
 *   effectiveDate: new Date()
 * });
 * ```
 */
export declare const createCompliancePolicyModel: (sequelize: Sequelize) => any;
/**
 * Creates ComplianceAudit model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ComplianceAuditAttributes>>} ComplianceAudit model
 *
 * @example
 * ```typescript
 * const AuditModel = createComplianceAuditModel(sequelize);
 * const audit = await AuditModel.create({
 *   framework: 'HIPAA',
 *   auditType: 'ANNUAL',
 *   status: 'IN_PROGRESS',
 *   findings: {},
 *   findingCount: 0,
 *   criticalCount: 0,
 *   highCount: 0,
 *   startDate: new Date()
 * });
 * ```
 */
export declare const createComplianceAuditModel: (sequelize: Sequelize) => any;
/**
 * Creates ComplianceViolation model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ComplianceViolationAttributes>>} ComplianceViolation model
 *
 * @example
 * ```typescript
 * const ViolationModel = createComplianceViolationModel(sequelize);
 * const violation = await ViolationModel.create({
 *   framework: 'HIPAA',
 *   violationType: 'UNAUTHORIZED_ACCESS',
 *   severity: 'HIGH',
 *   status: 'OPEN',
 *   affectedRecordCount: 150,
 *   discoveredAt: new Date(),
 *   regulatoryNotificationRequired: true
 * });
 * ```
 */
export declare const createComplianceViolationModel: (sequelize: Sequelize) => any;
/**
 * 1. Validates electronic records compliance with FDA 21 CFR Part 11.
 *
 * @param {Record<string, any>} record - Electronic record to validate
 * @param {string} systemId - System identifier
 * @returns {Promise<{ compliant: boolean; issues?: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateElectronicRecords(patientRecord, 'ehr-system-01');
 * if (!result.compliant) console.error('FDA violations:', result.issues);
 * ```
 */
export declare const validateElectronicRecords: (record: Record<string, any>, systemId: string) => Promise<{
    compliant: boolean;
    issues?: string[];
}>;
/**
 * 2. Enforces complete and accurate audit trail per FDA 21 CFR Part 11.
 *
 * @param {string} recordId - Record identifier
 * @param {string} action - Action performed
 * @param {string} userId - User performing action
 * @param {Record<string, any>} changes - Changes made
 * @returns {Promise<string>} Audit trail entry identifier
 *
 * @example
 * ```typescript
 * const auditId = await enforceAuditTrail('rec-123', 'MODIFY', 'user-456', {
 *   field: 'patientName',
 *   oldValue: 'John Doe',
 *   newValue: 'Jane Doe'
 * });
 * ```
 */
export declare const enforceAuditTrail: (recordId: string, action: string, userId: string, changes: Record<string, any>) => Promise<string>;
/**
 * 3. Validates electronic signatures meet FDA 21 CFR Part 11 requirements.
 *
 * @param {Record<string, any>} signatureRecord - Signature record to validate
 * @returns {Promise<boolean>} True if signature meets requirements
 *
 * @example
 * ```typescript
 * const isValid = await validateElectronicSignatures(signatureData);
 * ```
 */
export declare const validateElectronicSignatures: (signatureRecord: Record<string, any>) => Promise<boolean>;
/**
 * 4. Checks system validation per FDA 21 CFR Part 11 requirements.
 *
 * @param {string} systemId - System identifier
 * @param {Record<string, any>} validationData - System validation evidence
 * @returns {Promise<{ validated: boolean; documentation?: string }>} Validation status
 *
 * @example
 * ```typescript
 * const result = await checkSystemValidation('ehr-01', {
 *   performanceQualification: true,
 *   installationQualification: true,
 *   operationalQualification: true
 * });
 * ```
 */
export declare const checkSystemValidation: (systemId: string, validationData: Record<string, any>) => Promise<{
    validated: boolean;
    documentation?: string;
}>;
/**
 * 5. Enforces access controls per FDA 21 CFR Part 11.
 *
 * @param {string} userId - User identifier
 * @param {string} recordId - Record identifier
 * @param {string} action - Requested action
 * @returns {Promise<boolean>} True if access is permitted
 *
 * @example
 * ```typescript
 * const allowed = await enforceAccessControls('user-123', 'rec-456', 'VIEW');
 * ```
 */
export declare const enforceAccessControls: (userId: string, recordId: string, action: string) => Promise<boolean>;
/**
 * 6. Validates timestamps on electronic records meet FDA requirements.
 *
 * @param {Date} recordTimestamp - Timestamp to validate
 * @param {Date} systemTime - System time for validation
 * @returns {Promise<{ valid: boolean; deviation?: number }>} Timestamp validation
 *
 * @example
 * ```typescript
 * const result = await validateTimestamps(recordDate, new Date());
 * ```
 */
export declare const validateTimestamps: (recordTimestamp: Date, systemTime: Date) => Promise<{
    valid: boolean;
    deviation?: number;
}>;
/**
 * 7. Generates FDA 21 CFR Part 11 compliance report.
 *
 * @param {string} systemId - System identifier
 * @param {Date} startDate - Audit period start
 * @param {Date} endDate - Audit period end
 * @returns {Promise<string>} Compliance report (JSON)
 *
 * @example
 * ```typescript
 * const report = await generateFDAComplianceReport('ehr-01', startDate, endDate);
 * ```
 */
export declare const generateFDAComplianceReport: (systemId: string, startDate: Date, endDate: Date) => Promise<string>;
/**
 * 8. Creates qualified electronic signature per eIDAS requirements.
 *
 * @param {Buffer} document - Document to sign
 * @param {string} certificate - Qualified certificate (PEM)
 * @param {string} privateKey - Private key (PEM)
 * @returns {Promise<Buffer>} Signed document with qualified signature
 *
 * @example
 * ```typescript
 * const qes = await createQualifiedSignature(docBuffer, qualifiedCert, privKey);
 * ```
 */
export declare const createQualifiedSignature: (document: Buffer, certificate: string, privateKey: string) => Promise<Buffer>;
/**
 * 9. Validates qualified electronic signature (QES).
 *
 * @param {Buffer} signedDocument - Document with signature to validate
 * @returns {Promise<{ valid: boolean; qes: boolean; tsp?: string }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateQES(signedDocBuffer);
 * console.log('Qualified signature:', result.qes);
 * ```
 */
export declare const validateQES: (signedDocument: Buffer) => Promise<{
    valid: boolean;
    qes: boolean;
    tsp?: string;
}>;
/**
 * 10. Gets qualified trust service provider (TSP) information.
 *
 * @param {string} tspId - TSP identifier
 * @returns {Promise<Record<string, any>>} TSP information
 *
 * @example
 * ```typescript
 * const tsp = await getQualifiedTSP('tsp-eu-001');
 * ```
 */
export declare const getQualifiedTSP: (tspId: string) => Promise<Record<string, any>>;
/**
 * 11. Verifies eIDAS certificate validity.
 *
 * @param {string} certificate - Certificate to verify (PEM)
 * @returns {Promise<{ valid: boolean; qualified: boolean; issues?: string[] }>} Verification result
 *
 * @example
 * ```typescript
 * const result = await verifyeIDASCertificate(certPem);
 * ```
 */
export declare const verifyeIDASCertificate: (certificate: string) => Promise<{
    valid: boolean;
    qualified: boolean;
    issues?: string[];
}>;
/**
 * 12. Creates advanced signature (AdES/CAdES/XAdES).
 *
 * @param {Buffer} document - Document to sign
 * @param {string} signatureType - Signature type (AdES/CAdES/XAdES)
 * @param {Record<string, any>} config - Signature configuration
 * @returns {Promise<Buffer>} Signed document with advanced signature
 *
 * @example
 * ```typescript
 * const signed = await createAdvancedSignature(docBuffer, 'XAdES', {
 *   certificate: certPem,
 *   privateKey: keyPem,
 *   timestamp: true
 * });
 * ```
 */
export declare const createAdvancedSignature: (document: Buffer, signatureType: string, config: Record<string, any>) => Promise<Buffer>;
/**
 * 13. Validates PAdES (PDF Advanced Electronic Signature).
 *
 * @param {Buffer} pdfDocument - PDF with potential PAdES signature
 * @returns {Promise<{ valid: boolean; signatureType?: string }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validatePAdES(pdfBuffer);
 * ```
 */
export declare const validatePAdES: (pdfDocument: Buffer) => Promise<{
    valid: boolean;
    signatureType?: string;
}>;
/**
 * 14. Generates eIDAS compliance report.
 *
 * @param {string} documentId - Document identifier
 * @param {Record<string, any>} signatureData - Signature information
 * @returns {Promise<string>} eIDAS compliance report (JSON)
 *
 * @example
 * ```typescript
 * const report = await generateeIDASComplianceReport('doc-123', sigData);
 * ```
 */
export declare const generateeIDASComplianceReport: (documentId: string, signatureData: Record<string, any>) => Promise<string>;
/**
 * 15. Assesses data processing for GDPR compliance.
 *
 * @param {Record<string, any>} processingActivity - Data processing details
 * @returns {Promise<DataProtectionImpactAssessment>} DPIA result
 *
 * @example
 * ```typescript
 * const dpia = await assessDataProcessing({
 *   dataCategory: 'HEALTH',
 *   processingPurpose: 'TREATMENT',
 *   lawfulBasis: 'CONSENT',
 *   thirdParties: []
 * });
 * ```
 */
export declare const assessDataProcessing: (processingActivity: Record<string, any>) => Promise<DataProtectionImpactAssessment>;
/**
 * 16. Enforces right to access (data subject access request).
 *
 * @param {string} dataSubjectId - Data subject identifier
 * @param {Date} requestDate - Request date
 * @returns {Promise<{ grantDate: Date; dueDate: Date; format?: string }>} Access response schedule
 *
 * @example
 * ```typescript
 * const response = await enforceRightToAccess('subject-123', new Date());
 * console.log('Due date:', response.dueDate);
 * ```
 */
export declare const enforceRightToAccess: (dataSubjectId: string, requestDate: Date) => Promise<{
    grantDate: Date;
    dueDate: Date;
    format?: string;
}>;
/**
 * 17. Enforces right to erasure (right to be forgotten).
 *
 * @param {string} dataSubjectId - Data subject identifier
 * @returns {Promise<{ erasureId: string; status: string; completionDate?: Date }>} Erasure tracking
 *
 * @example
 * ```typescript
 * const result = await enforceRightToErasure('subject-456');
 * ```
 */
export declare const enforceRightToErasure: (dataSubjectId: string) => Promise<{
    erasureId: string;
    status: string;
    completionDate?: Date;
}>;
/**
 * 18. Enforces right to data portability.
 *
 * @param {string} dataSubjectId - Data subject identifier
 * @returns {Promise<{ portabilityPackageId: string; format: string; expiresAt: Date }>} Portability result
 *
 * @example
 * ```typescript
 * const pkg = await enforceDataPortability('subject-789');
 * ```
 */
export declare const enforceDataPortability: (dataSubjectId: string) => Promise<{
    portabilityPackageId: string;
    format: string;
    expiresAt: Date;
}>;
/**
 * 19. Validates lawful basis for data processing.
 *
 * @param {LawfulBasis} basis - Claimed lawful basis
 * @param {Record<string, any>} documentation - Supporting documentation
 * @returns {Promise<{ valid: boolean; evidenceRequired?: string[] }>} Basis validation
 *
 * @example
 * ```typescript
 * const result = await validateLawfulBasis('CONSENT', {
 * consent_timestamp: new Date(),
 * consent_version: '1.0'
 * });
 * ```
 */
export declare const validateLawfulBasis: (basis: LawfulBasis, documentation: Record<string, any>) => Promise<{
    valid: boolean;
    evidenceRequired?: string[];
}>;
/**
 * 20. Conducts Data Protection Impact Assessment (DPIA).
 *
 * @param {string} processingDescription - Description of processing activity
 * @returns {Promise<{ dpiaRequired: boolean; riskLevel: string }>} DPIA requirement assessment
 *
 * @example
 * ```typescript
 * const result = await conductDPIA('Large-scale biometric processing');
 * ```
 */
export declare const conductDPIA: (processingDescription: string) => Promise<{
    dpiaRequired: boolean;
    riskLevel: string;
}>;
/**
 * 21. Generates GDPR compliance report.
 *
 * @param {Date} reportDate - Report date
 * @param {Record<string, any>} metrics - Compliance metrics
 * @returns {Promise<string>} GDPR compliance report (JSON)
 *
 * @example
 * ```typescript
 * const report = await generateGDPRComplianceReport(new Date(), {
 *   dataSubjects: 50000,
 *   dpiasCompleted: 12
 * });
 * ```
 */
export declare const generateGDPRComplianceReport: (reportDate: Date, metrics: Record<string, any>) => Promise<string>;
/**
 * 22. Handles consumer access request (CCPA Section 1798.100).
 *
 * @param {string} consumerId - Consumer identifier
 * @param {Date} requestDate - Request date
 * @returns {Promise<{ requestId: string; dueDate: Date; verificationRequired: boolean }>} Request tracking
 *
 * @example
 * ```typescript
 * const result = await handleAccessRequest('consumer-123', new Date());
 * ```
 */
export declare const handleAccessRequest: (consumerId: string, requestDate: Date) => Promise<{
    requestId: string;
    dueDate: Date;
    verificationRequired: boolean;
}>;
/**
 * 23. Handles deletion request (CCPA Section 1798.105).
 *
 * @param {string} consumerId - Consumer identifier
 * @returns {Promise<{ deletionId: string; status: string; exceptions?: string[] }>} Deletion status
 *
 * @example
 * ```typescript
 * const result = await handleDeletionRequest('consumer-456');
 * ```
 */
export declare const handleDeletionRequest: (consumerId: string) => Promise<{
    deletionId: string;
    status: string;
    exceptions?: string[];
}>;
/**
 * 24. Handles opt-out of sale/sharing (CCPA Section 1798.120).
 *
 * @param {string} consumerId - Consumer identifier
 * @returns {Promise<{ optOutId: string; effectiveDate: Date }>} Opt-out confirmation
 *
 * @example
 * ```typescript
 * const result = await handleOptOut('consumer-789');
 * ```
 */
export declare const handleOptOut: (consumerId: string) => Promise<{
    optOutId: string;
    effectiveDate: Date;
}>;
/**
 * 25. Tracks privacy disclosures and data sales.
 *
 * @param {string} consumerId - Consumer identifier
 * @param {Record<string, any>} disclosureData - Disclosure information
 * @returns {Promise<string>} Disclosure tracking identifier
 *
 * @example
 * ```typescript
 * const trackingId = await disclosureTracking('consumer-101', {
 *   dataSoldTo: 'marketing-partner',
 *   categories: ['NAME', 'EMAIL']
 * });
 * ```
 */
export declare const disclosureTracking: (consumerId: string, disclosureData: Record<string, any>) => Promise<string>;
/**
 * 26. Validates consumer consent for data use.
 *
 * @param {string} consumerId - Consumer identifier
 * @param {string} purpose - Purpose of data use
 * @returns {Promise<{ consentValid: boolean; lastConsentDate?: Date }>} Consent validation
 *
 * @example
 * ```typescript
 * const result = await validateConsent('consumer-202', 'MARKETING');
 * ```
 */
export declare const validateConsent: (consumerId: string, purpose: string) => Promise<{
    consentValid: boolean;
    lastConsentDate?: Date;
}>;
/**
 * 27. Generates CCPA compliance report.
 *
 * @param {Date} reportDate - Report date
 * @param {Record<string, any>} metrics - CCPA metrics
 * @returns {Promise<string>} CCPA compliance report (JSON)
 *
 * @example
 * ```typescript
 * const report = await generateCCPAComplianceReport(new Date(), {
 *   accessRequests: 120,
 *   deletionRequests: 45
 * });
 * ```
 */
export declare const generateCCPAComplianceReport: (reportDate: Date, metrics: Record<string, any>) => Promise<string>;
/**
 * 28. Validates protected health information (PHI) for HIPAA compliance.
 *
 * @param {Record<string, any>} dataElement - Data element to validate
 * @returns {Promise<boolean>} True if PHI handling is compliant
 *
 * @example
 * ```typescript
 * const isCompliant = await validatePHI(patientData);
 * ```
 */
export declare const validatePHI: (dataElement: Record<string, any>) => Promise<boolean>;
/**
 * 29. Enforces minimum necessary standard for PHI use.
 *
 * @param {string} purpose - Purpose for PHI access
 * @param {string[]} requestedFields - Fields being requested
 * @returns {Promise<{ approved: boolean; allowedFields?: string[] }>} Fields approval
 *
 * @example
 * ```typescript
 * const result = await enforceMinimumNecessary('TREATMENT', [
 *   'patientName', 'medicalHistory', 'socialSecurityNumber'
 * ]);
 * ```
 */
export declare const enforceMinimumNecessary: (purpose: string, requestedFields: string[]) => Promise<{
    approved: boolean;
    allowedFields?: string[];
}>;
/**
 * 30. Audits PHI access for compliance.
 *
 * @param {string} userId - Accessing user
 * @param {string[]} dataElements - Data elements accessed
 * @returns {Promise<{ auditLogId: string; compliant: boolean }>} Audit result
 *
 * @example
 * ```typescript
 * const result = await auditPHIAccess('user-123', ['patientName', 'diagnosis']);
 * ```
 */
export declare const auditPHIAccess: (userId: string, dataElements: string[]) => Promise<{
    auditLogId: string;
    compliant: boolean;
}>;
/**
 * 31. Validates Business Associate Agreement (BAA) requirements.
 *
 * @param {string} baaId - BAA identifier
 * @returns {Promise<{ valid: boolean; requiresUpdate?: boolean }>} BAA validation
 *
 * @example
 * ```typescript
 * const result = await validateBAA('baa-vendor-001');
 * ```
 */
export declare const validateBAA: (baaId: string) => Promise<{
    valid: boolean;
    requiresUpdate?: boolean;
}>;
/**
 * 32. Enforces encryption for PHI storage and transmission.
 *
 * @param {Buffer} phiData - PHI data to protect
 * @param {string} [algorithm] - Encryption algorithm (default: AES-256)
 * @returns {Promise<{ encryptedData: Buffer; keyId: string }>} Encrypted PHI
 *
 * @example
 * ```typescript
 * const result = await enforceEncryption(phiBuffer, 'AES-256-GCM');
 * ```
 */
export declare const enforceEncryption: (phiData: Buffer, algorithm?: string) => Promise<{
    encryptedData: Buffer;
    keyId: string;
}>;
/**
 * 33. Generates HIPAA compliance report.
 *
 * @param {Date} reportDate - Report date
 * @param {Record<string, any>} auditData - Audit metrics
 * @returns {Promise<string>} HIPAA compliance report (JSON)
 *
 * @example
 * ```typescript
 * const report = await generateHIPAAComplianceReport(new Date(), {
 *   phiAccessEvents: 50000,
 *   unauthorizedAccess: 0
 * });
 * ```
 */
export declare const generateHIPAAComplianceReport: (reportDate: Date, auditData: Record<string, any>) => Promise<string>;
/**
 * 34. Enforces segregation of duties (SoD) per SOX requirements.
 *
 * @param {string} userId - User identifier
 * @param {string} proposedRole - Proposed role/permission
 * @returns {Promise<{ allowed: boolean; conflict?: string }>} SoD validation
 *
 * @example
 * ```typescript
 * const result = await enforceSegregationOfDuties('user-123', 'FINANCIAL_APPROVER');
 * ```
 */
export declare const enforceSegregationOfDuties: (userId: string, proposedRole: string) => Promise<{
    allowed: boolean;
    conflict?: string;
}>;
/**
 * 35. Validates IT General Controls (ITGC) for SOX.
 *
 * @param {string} systemId - System identifier
 * @returns {Promise<{ compliant: boolean; findings?: string[] }>} ITGC compliance
 *
 * @example
 * ```typescript
 * const result = await validateITGC('financial-system-01');
 * ```
 */
export declare const validateITGC: (systemId: string) => Promise<{
    compliant: boolean;
    findings?: string[];
}>;
/**
 * 36. Audits financial records for SOX compliance.
 *
 * @param {Date} startDate - Audit period start
 * @param {Date} endDate - Audit period end
 * @returns {Promise<{ auditId: string; status: string; completionDate?: Date }>} Audit tracking
 *
 * @example
 * ```typescript
 * const audit = await auditFinancialRecords(q1Start, q1End);
 * ```
 */
export declare const auditFinancialRecords: (startDate: Date, endDate: Date) => Promise<{
    auditId: string;
    status: string;
    completionDate?: Date;
}>;
/**
 * 37. Enforces change management controls.
 *
 * @param {Record<string, any>} changeRequest - Change details
 * @returns {Promise<{ changeId: string; approved: boolean }>} Change approval
 *
 * @example
 * ```typescript
 * const result = await enforceChangeManagement({
 *   system: 'financial-app',
 *   changeType: 'DATABASE_SCHEMA',
 *   requester: 'user-123'
 * });
 * ```
 */
export declare const enforceChangeManagement: (changeRequest: Record<string, any>) => Promise<{
    changeId: string;
    approved: boolean;
}>;
/**
 * 38. Validates access review completeness.
 *
 * @param {Date} reviewDate - Access review date
 * @param {number} userCount - Total users reviewed
 * @returns {Promise<{ compliant: boolean; nextReviewDate: Date }>} Review compliance
 *
 * @example
 * ```typescript
 * const result = await validateAccessReview(new Date(), 500);
 * ```
 */
export declare const validateAccessReview: (reviewDate: Date, userCount: number) => Promise<{
    compliant: boolean;
    nextReviewDate: Date;
}>;
/**
 * 39. Generates SOX compliance report.
 *
 * @param {string} period - Reporting period (e.g., 'Q4_2024')
 * @returns {Promise<string>} SOX compliance report (JSON)
 *
 * @example
 * ```typescript
 * const report = await generateSOXComplianceReport('Q4_2024');
 * ```
 */
export declare const generateSOXComplianceReport: (period: string) => Promise<string>;
/**
 * 40. Generates comprehensive compliance audit report.
 *
 * @param {string[]} frameworks - Frameworks to audit
 * @param {Date} startDate - Audit period start
 * @param {Date} endDate - Audit period end
 * @returns {Promise<string>} Comprehensive audit report (JSON)
 *
 * @example
 * ```typescript
 * const report = await generateComprehensiveAuditReport(
 *   ['HIPAA', 'GDPR', 'SOX'],
 *   startDate,
 *   endDate
 * );
 * ```
 */
export declare const generateComprehensiveAuditReport: (frameworks: string[], startDate: Date, endDate: Date) => Promise<string>;
/**
 * 41. Assesses current compliance posture across frameworks.
 *
 * @returns {Promise<{ overallScore: number; byFramework: Record<string, number> }>} Compliance scores
 *
 * @example
 * ```typescript
 * const posture = await assessCompliancePosture();
 * console.log('Overall score:', posture.overallScore);
 * ```
 */
export declare const assessCompliancePosture: () => Promise<{
    overallScore: number;
    byFramework: Record<string, number>;
}>;
/**
 * 42. Identifies compliance gaps and remediation priorities.
 *
 * @param {string[]} frameworks - Frameworks to analyze
 * @returns {Promise<ComplianceFinding[]>} Identified gaps
 *
 * @example
 * ```typescript
 * const gaps = await identifyComplianceGaps(['HIPAA', 'GDPR']);
 * ```
 */
export declare const identifyComplianceGaps: (frameworks: string[]) => Promise<ComplianceFinding[]>;
/**
 * 43. Tracks remediation progress toward compliance.
 *
 * @param {string} violationId - Violation identifier
 * @returns {Promise<{ progress: number; status: string; estimatedCompletion: Date }>} Progress tracking
 *
 * @example
 * ```typescript
 * const progress = await trackRemediationProgress('viol-123');
 * ```
 */
export declare const trackRemediationProgress: (violationId: string) => Promise<{
    progress: number;
    status: string;
    estimatedCompletion: Date;
}>;
/**
 * 44. Generates executive summary of compliance status.
 *
 * @returns {Promise<string>} Executive summary (JSON)
 *
 * @example
 * ```typescript
 * const summary = await generateExecutiveSummary();
 * ```
 */
export declare const generateExecutiveSummary: () => Promise<string>;
/**
 * 45. Exports compliance evidence for auditor review.
 *
 * @param {string} auditId - Audit identifier
 * @param {string[]} evidenceTypes - Types of evidence to export
 * @returns {Promise<{ exportId: string; evidenceCount: number; packageSize: string }>} Export summary
 *
 * @example
 * ```typescript
 * const export_ = await exportComplianceEvidence('audit-456', [
 *   'AUDIT_LOGS',
 *   'POLICIES',
 *   'TRAINING_RECORDS'
 * ]);
 * ```
 */
export declare const exportComplianceEvidence: (auditId: string, evidenceTypes: string[]) => Promise<{
    exportId: string;
    evidenceCount: number;
    packageSize: string;
}>;
declare const _default: {
    createCompliancePolicyModel: (sequelize: Sequelize) => any;
    createComplianceAuditModel: (sequelize: Sequelize) => any;
    createComplianceViolationModel: (sequelize: Sequelize) => any;
    validateElectronicRecords: (record: Record<string, any>, systemId: string) => Promise<{
        compliant: boolean;
        issues?: string[];
    }>;
    enforceAuditTrail: (recordId: string, action: string, userId: string, changes: Record<string, any>) => Promise<string>;
    validateElectronicSignatures: (signatureRecord: Record<string, any>) => Promise<boolean>;
    checkSystemValidation: (systemId: string, validationData: Record<string, any>) => Promise<{
        validated: boolean;
        documentation?: string;
    }>;
    enforceAccessControls: (userId: string, recordId: string, action: string) => Promise<boolean>;
    validateTimestamps: (recordTimestamp: Date, systemTime: Date) => Promise<{
        valid: boolean;
        deviation?: number;
    }>;
    generateFDAComplianceReport: (systemId: string, startDate: Date, endDate: Date) => Promise<string>;
    createQualifiedSignature: (document: Buffer, certificate: string, privateKey: string) => Promise<Buffer>;
    validateQES: (signedDocument: Buffer) => Promise<{
        valid: boolean;
        qes: boolean;
        tsp?: string;
    }>;
    getQualifiedTSP: (tspId: string) => Promise<Record<string, any>>;
    verifyeIDASCertificate: (certificate: string) => Promise<{
        valid: boolean;
        qualified: boolean;
        issues?: string[];
    }>;
    createAdvancedSignature: (document: Buffer, signatureType: string, config: Record<string, any>) => Promise<Buffer>;
    validatePAdES: (pdfDocument: Buffer) => Promise<{
        valid: boolean;
        signatureType?: string;
    }>;
    generateeIDASComplianceReport: (documentId: string, signatureData: Record<string, any>) => Promise<string>;
    assessDataProcessing: (processingActivity: Record<string, any>) => Promise<DataProtectionImpactAssessment>;
    enforceRightToAccess: (dataSubjectId: string, requestDate: Date) => Promise<{
        grantDate: Date;
        dueDate: Date;
        format?: string;
    }>;
    enforceRightToErasure: (dataSubjectId: string) => Promise<{
        erasureId: string;
        status: string;
        completionDate?: Date;
    }>;
    enforceDataPortability: (dataSubjectId: string) => Promise<{
        portabilityPackageId: string;
        format: string;
        expiresAt: Date;
    }>;
    validateLawfulBasis: (basis: LawfulBasis, documentation: Record<string, any>) => Promise<{
        valid: boolean;
        evidenceRequired?: string[];
    }>;
    conductDPIA: (processingDescription: string) => Promise<{
        dpiaRequired: boolean;
        riskLevel: string;
    }>;
    generateGDPRComplianceReport: (reportDate: Date, metrics: Record<string, any>) => Promise<string>;
    handleAccessRequest: (consumerId: string, requestDate: Date) => Promise<{
        requestId: string;
        dueDate: Date;
        verificationRequired: boolean;
    }>;
    handleDeletionRequest: (consumerId: string) => Promise<{
        deletionId: string;
        status: string;
        exceptions?: string[];
    }>;
    handleOptOut: (consumerId: string) => Promise<{
        optOutId: string;
        effectiveDate: Date;
    }>;
    disclosureTracking: (consumerId: string, disclosureData: Record<string, any>) => Promise<string>;
    validateConsent: (consumerId: string, purpose: string) => Promise<{
        consentValid: boolean;
        lastConsentDate?: Date;
    }>;
    generateCCPAComplianceReport: (reportDate: Date, metrics: Record<string, any>) => Promise<string>;
    validatePHI: (dataElement: Record<string, any>) => Promise<boolean>;
    enforceMinimumNecessary: (purpose: string, requestedFields: string[]) => Promise<{
        approved: boolean;
        allowedFields?: string[];
    }>;
    auditPHIAccess: (userId: string, dataElements: string[]) => Promise<{
        auditLogId: string;
        compliant: boolean;
    }>;
    validateBAA: (baaId: string) => Promise<{
        valid: boolean;
        requiresUpdate?: boolean;
    }>;
    enforceEncryption: (phiData: Buffer, algorithm?: string) => Promise<{
        encryptedData: Buffer;
        keyId: string;
    }>;
    generateHIPAAComplianceReport: (reportDate: Date, auditData: Record<string, any>) => Promise<string>;
    enforceSegregationOfDuties: (userId: string, proposedRole: string) => Promise<{
        allowed: boolean;
        conflict?: string;
    }>;
    validateITGC: (systemId: string) => Promise<{
        compliant: boolean;
        findings?: string[];
    }>;
    auditFinancialRecords: (startDate: Date, endDate: Date) => Promise<{
        auditId: string;
        status: string;
        completionDate?: Date;
    }>;
    enforceChangeManagement: (changeRequest: Record<string, any>) => Promise<{
        changeId: string;
        approved: boolean;
    }>;
    validateAccessReview: (reviewDate: Date, userCount: number) => Promise<{
        compliant: boolean;
        nextReviewDate: Date;
    }>;
    generateSOXComplianceReport: (period: string) => Promise<string>;
    generateComprehensiveAuditReport: (frameworks: string[], startDate: Date, endDate: Date) => Promise<string>;
    assessCompliancePosture: () => Promise<{
        overallScore: number;
        byFramework: Record<string, number>;
    }>;
    identifyComplianceGaps: (frameworks: string[]) => Promise<ComplianceFinding[]>;
    trackRemediationProgress: (violationId: string) => Promise<{
        progress: number;
        status: string;
        estimatedCompletion: Date;
    }>;
    generateExecutiveSummary: () => Promise<string>;
    exportComplianceEvidence: (auditId: string, evidenceTypes: string[]) => Promise<{
        exportId: string;
        evidenceCount: number;
        packageSize: string;
    }>;
};
export default _default;
//# sourceMappingURL=document-compliance-advanced-kit.d.ts.map