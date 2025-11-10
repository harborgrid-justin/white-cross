/**
 * LOC: INS-DOC-001
 * File: /reuse/insurance/document-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - pdfkit
 *   - handlebars
 *   - docusign-esign
 *   - aws-sdk (S3)
 *
 * DOWNSTREAM (imported by):
 *   - Policy document controllers
 *   - Claims document services
 *   - Compliance document modules
 *   - Document delivery services
 */
/**
 * File: /reuse/insurance/document-management-kit.ts
 * Locator: WC-UTL-INSDOC-001
 * Purpose: Insurance Document Management Kit - Comprehensive document lifecycle utilities for insurance operations
 *
 * Upstream: @nestjs/common, sequelize, pdfkit, handlebars, docusign-esign, aws-sdk
 * Downstream: Policy controllers, claims services, compliance modules, delivery handlers, archival workflows
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, PDFKit 0.14.x, Handlebars 4.x, DocuSign 6.x
 * Exports: 40 utility functions for policy document generation, claims document management, template management,
 *          version control, e-signature integration, document delivery tracking, retention policy enforcement,
 *          certificate generation, evidence of coverage, regulatory filing, document archival and retrieval,
 *          indexing and search, OCR and data extraction, compliance document management, audit trails
 *
 * LLM Context: Production-grade insurance document management utilities for White Cross platform.
 * Provides complete document lifecycle management for policy documents (declarations, contracts, endorsements),
 * claims documentation, certificates of insurance, evidence of coverage documents, regulatory filings,
 * and compliance documentation. Features include template-based generation, electronic signature workflows,
 * delivery tracking, OCR/data extraction, version control, retention management, and comprehensive audit trails.
 * Essential for regulatory compliance, customer communication, claims processing, and records management.
 */
import { Sequelize } from 'sequelize';
/**
 * Document type categories
 */
export type DocumentType = 'policy_declaration' | 'policy_contract' | 'endorsement' | 'certificate_of_insurance' | 'evidence_of_coverage' | 'claims_form' | 'claims_evidence' | 'regulatory_filing' | 'compliance_document' | 'customer_communication' | 'underwriting_document';
/**
 * Document status
 */
export type DocumentStatus = 'draft' | 'pending_review' | 'approved' | 'pending_signature' | 'signed' | 'delivered' | 'archived' | 'expired' | 'cancelled';
/**
 * Template category
 */
export type TemplateCategory = 'policy' | 'claims' | 'certificate' | 'regulatory' | 'communication' | 'legal';
/**
 * Signature method
 */
export type SignatureMethod = 'wet_signature' | 'electronic' | 'digital' | 'biometric' | 'click_to_sign';
/**
 * Delivery channel
 */
export type DeliveryChannel = 'email' | 'postal_mail' | 'portal' | 'mobile_app' | 'secure_link' | 'fax';
/**
 * Retention policy action
 */
export type RetentionAction = 'archive' | 'delete' | 'review' | 'migrate';
/**
 * OCR engine
 */
export type OCREngine = 'tesseract' | 'aws_textract' | 'google_vision' | 'azure_ocr' | 'abbyy';
/**
 * Policy document configuration
 */
export interface PolicyDocumentConfig {
    policyId: string;
    documentType: DocumentType;
    templateId: string;
    policyholderName: string;
    policyNumber: string;
    effectiveDate: Date;
    expirationDate: Date;
    coverageDetails: Record<string, any>;
    premiumAmount: number;
    additionalData?: Record<string, any>;
    generatePDF?: boolean;
}
/**
 * Claims document configuration
 */
export interface ClaimsDocumentConfig {
    claimId: string;
    claimNumber: string;
    documentType: DocumentType;
    claimantName: string;
    policyNumber: string;
    incidentDate: Date;
    claimAmount: number;
    attachments?: string[];
    metadata?: Record<string, any>;
}
/**
 * Document template configuration
 */
export interface DocumentTemplateConfig {
    name: string;
    category: TemplateCategory;
    documentType: DocumentType;
    version: string;
    content: string;
    variables: TemplateVariable[];
    regulations?: string[];
    requiredSignatures?: number;
    retentionYears?: number;
    metadata?: Record<string, any>;
}
/**
 * Template variable definition
 */
export interface TemplateVariable {
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'currency' | 'address';
    required: boolean;
    defaultValue?: any;
    validation?: Record<string, any>;
    description?: string;
}
/**
 * Document version information
 */
export interface DocumentVersion {
    versionId: string;
    documentId: string;
    versionNumber: number;
    content: string | Buffer;
    changes: string;
    createdBy: string;
    createdAt: Date;
    checksum: string;
    fileSize: number;
}
/**
 * E-signature request
 */
export interface ESignatureRequest {
    documentId: string;
    signers: SignerInfo[];
    signatureMethod: SignatureMethod;
    expirationDate?: Date;
    reminderSchedule?: number[];
    completionCallback?: string;
    metadata?: Record<string, any>;
}
/**
 * Signer information
 */
export interface SignerInfo {
    name: string;
    email: string;
    role: string;
    order?: number;
    authenticationMethod?: string;
    signatureFields?: SignatureField[];
}
/**
 * Signature field placement
 */
export interface SignatureField {
    page: number;
    x: number;
    y: number;
    width?: number;
    height?: number;
    required: boolean;
    type: 'signature' | 'initial' | 'date' | 'text';
}
/**
 * Document delivery request
 */
export interface DocumentDeliveryRequest {
    documentId: string;
    recipients: RecipientInfo[];
    channels: DeliveryChannel[];
    priority: 'urgent' | 'normal' | 'low';
    scheduledDate?: Date;
    trackingEnabled?: boolean;
    readReceiptRequired?: boolean;
    expirationDate?: Date;
}
/**
 * Recipient information
 */
export interface RecipientInfo {
    name: string;
    email?: string;
    phone?: string;
    address?: Record<string, any>;
    preferredChannel?: DeliveryChannel;
}
/**
 * Delivery tracking information
 */
export interface DeliveryTracking {
    deliveryId: string;
    documentId: string;
    recipient: string;
    channel: DeliveryChannel;
    sentAt: Date;
    deliveredAt?: Date;
    openedAt?: Date;
    downloadedAt?: Date;
    status: 'pending' | 'sent' | 'delivered' | 'opened' | 'failed';
    attempts: number;
    errorMessage?: string;
}
/**
 * Retention policy configuration
 */
export interface RetentionPolicyConfig {
    documentType: DocumentType;
    retentionYears: number;
    trigger: 'creation_date' | 'policy_expiration' | 'claim_closure' | 'custom';
    action: RetentionAction;
    automaticExecution: boolean;
    notifyBeforeDays?: number;
    regulatoryBasis?: string;
}
/**
 * Certificate of insurance request
 */
export interface CertificateRequest {
    policyId: string;
    certificateHolderName: string;
    certificateHolderAddress: Record<string, any>;
    coverageTypes: string[];
    effectiveDate: Date;
    expirationDate: Date;
    additionalInsureds?: string[];
    specialProvisions?: string[];
}
/**
 * Evidence of coverage request
 */
export interface EvidenceOfCoverageRequest {
    policyId: string;
    memberId: string;
    planName: string;
    coverageYear: number;
    benefitSummary: Record<string, any>;
    networkProviders?: string[];
    prescriptionCoverage?: Record<string, any>;
}
/**
 * Regulatory filing configuration
 */
export interface RegulatoryFilingConfig {
    filingType: string;
    jurisdiction: string;
    regulatoryBody: string;
    filingDeadline: Date;
    documentIds: string[];
    submittedBy: string;
    confirmationNumber?: string;
    metadata?: Record<string, any>;
}
/**
 * Document archival request
 */
export interface DocumentArchivalRequest {
    documentIds: string[];
    archivalDate?: Date;
    archivalTier: 'hot' | 'warm' | 'cold' | 'glacier';
    compressionEnabled?: boolean;
    encryptionEnabled?: boolean;
    retentionEndDate?: Date;
    reason?: string;
}
/**
 * Document search query
 */
export interface DocumentSearchQuery {
    searchTerm?: string;
    documentType?: DocumentType;
    status?: DocumentStatus;
    policyNumber?: string;
    claimNumber?: string;
    createdAfter?: Date;
    createdBefore?: Date;
    tags?: string[];
    fullTextSearch?: boolean;
}
/**
 * OCR extraction request
 */
export interface OCRExtractionRequest {
    documentId: string;
    engine: OCREngine;
    languageHints?: string[];
    extractTables?: boolean;
    extractForms?: boolean;
    confidenceThreshold?: number;
}
/**
 * OCR extraction result
 */
export interface OCRExtractionResult {
    documentId: string;
    text: string;
    confidence: number;
    fields?: Record<string, any>;
    tables?: Array<Array<string>>;
    pages: number;
    processingTime: number;
    metadata?: Record<string, any>;
}
/**
 * Document audit entry
 */
export interface DocumentAuditEntry {
    documentId: string;
    action: string;
    performedBy: string;
    performedAt: Date;
    ipAddress?: string;
    changes?: Record<string, any>;
    previousState?: Record<string, any>;
    newState?: Record<string, any>;
}
/**
 * Pagination parameters
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
    offset?: number;
}
/**
 * Sort parameters
 */
export interface SortParams {
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
    _links?: {
        self: string;
        first: string;
        last: string;
        next?: string;
        previous?: string;
    };
}
/**
 * Insurance document model attributes
 */
export interface InsuranceDocumentAttributes {
    id: string;
    documentNumber: string;
    documentType: DocumentType;
    status: DocumentStatus;
    templateId?: string;
    policyId?: string;
    claimId?: string;
    title: string;
    description?: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    checksum: string;
    version: number;
    effectiveDate?: Date;
    expirationDate?: Date;
    retentionEndDate?: Date;
    tags: string[];
    metadata?: Record<string, any>;
    createdBy: string;
    approvedBy?: string;
    approvedAt?: Date;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Document template model attributes
 */
export interface DocumentTemplateAttributes {
    id: string;
    name: string;
    category: TemplateCategory;
    documentType: DocumentType;
    version: string;
    content: string;
    variables: Record<string, any>[];
    regulations: string[];
    requiredSignatures: number;
    retentionYears: number;
    isActive: boolean;
    metadata?: Record<string, any>;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates InsuranceDocument model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} InsuranceDocument model
 *
 * @example
 * ```typescript
 * const DocumentModel = createInsuranceDocumentModel(sequelize);
 * const document = await DocumentModel.create({
 *   documentType: 'policy_declaration',
 *   policyId: 'policy-uuid',
 *   title: 'Auto Insurance Policy Declaration',
 *   status: 'approved'
 * });
 * ```
 */
export declare const createInsuranceDocumentModel: (sequelize: Sequelize) => any;
/**
 * Creates DocumentTemplate model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} DocumentTemplate model
 *
 * @example
 * ```typescript
 * const TemplateModel = createDocumentTemplateModel(sequelize);
 * const template = await TemplateModel.create({
 *   name: 'Auto Policy Declaration',
 *   category: 'policy',
 *   documentType: 'policy_declaration',
 *   version: '1.0',
 *   content: '<template content>',
 *   retentionYears: 7
 * });
 * ```
 */
export declare const createDocumentTemplateModel: (sequelize: Sequelize) => any;
/**
 * 1. Generates policy declaration document.
 *
 * @param {PolicyDocumentConfig} config - Policy document configuration
 * @returns {Promise<{documentId: string; documentNumber: string; filePath: string}>} Generated document
 *
 * @example
 * ```typescript
 * const document = await generatePolicyDeclaration({
 *   policyId: 'policy-uuid',
 *   documentType: 'policy_declaration',
 *   templateId: 'template-uuid',
 *   policyholderName: 'John Doe',
 *   policyNumber: 'POL-2025-12345',
 *   effectiveDate: new Date('2025-01-01'),
 *   expirationDate: new Date('2026-01-01'),
 *   coverageDetails: { liability: 100000, collision: 50000 },
 *   premiumAmount: 1200,
 *   generatePDF: true
 * });
 * ```
 */
export declare const generatePolicyDeclaration: (config: PolicyDocumentConfig) => Promise<{
    documentId: string;
    documentNumber: string;
    filePath: string;
}>;
/**
 * 22. Tracks e-signature status.
 *
 * @param {string} envelopeId - Envelope ID
 * @returns {Promise<{status: string; signedBy: string[]; pendingSigners: string[]; completedAt?: Date}>} Signature status
 *
 * @example
 * ```typescript
 * const status = await trackESignatureStatus('ENV-123');
 * console.log('Status:', status.status, 'Pending:', status.pendingSigners);
 * ```
 */
export declare const trackESignatureStatus: (envelopeId: string) => Promise<{
    status: string;
    signedBy: string[];
    pendingSigners: string[];
    completedAt?: Date;
}>;
/**
 * 23. Sends signature reminder.
 *
 * @param {string} envelopeId - Envelope ID
 * @param {string[]} signerEmails - Signer emails to remind
 * @returns {Promise<{sent: number}>} Reminder result
 *
 * @example
 * ```typescript
 * const result = await sendSignatureReminder('ENV-123', ['john@example.com']);
 * ```
 */
export declare const sendSignatureReminder: (envelopeId: string, signerEmails: string[]) => Promise<{
    sent: number;
}>;
/**
 * 24. Cancels e-signature request.
 *
 * @param {string} envelopeId - Envelope ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<{cancelled: boolean}>} Cancellation result
 *
 * @example
 * ```typescript
 * await cancelESignature('ENV-123', 'Policy cancelled before signature completion');
 * ```
 */
export declare const cancelESignature: (envelopeId: string, reason: string) => Promise<{
    cancelled: boolean;
}>;
/**
 * 25. Downloads signed document.
 *
 * @param {string} envelopeId - Envelope ID
 * @returns {Promise<{documentPath: string; certificatePath: string; fileSize: number}>} Download information
 *
 * @example
 * ```typescript
 * const download = await downloadSignedDocument('ENV-123');
 * console.log('Signed document:', download.documentPath);
 * ```
 */
export declare const downloadSignedDocument: (envelopeId: string) => Promise<{
    documentPath: string;
    certificatePath: string;
    fileSize: number;
}>;
/**
 * 26. Delivers document to recipients.
 *
 * @param {DocumentDeliveryRequest} request - Delivery request
 * @returns {Promise<{deliveryId: string; sent: number; scheduled: number}>} Delivery result
 *
 * @example
 * ```typescript
 * const delivery = await deliverDocument({
 *   documentId: 'doc-uuid',
 *   recipients: [
 *     { name: 'John Doe', email: 'john@example.com', preferredChannel: 'email' }
 *   ],
 *   channels: ['email', 'portal'],
 *   priority: 'normal',
 *   trackingEnabled: true,
 *   readReceiptRequired: true
 * });
 * ```
 */
export declare const deliverDocument: (request: DocumentDeliveryRequest) => Promise<{
    deliveryId: string;
    sent: number;
    scheduled: number;
}>;
/**
 * 27. Tracks document delivery status.
 *
 * @param {string} deliveryId - Delivery ID
 * @returns {Promise<DeliveryTracking[]>} Delivery tracking information
 *
 * @example
 * ```typescript
 * const tracking = await trackDocumentDelivery('DEL-123');
 * tracking.forEach(t => console.log(`${t.recipient}: ${t.status}`));
 * ```
 */
export declare const trackDocumentDelivery: (deliveryId: string) => Promise<DeliveryTracking[]>;
/**
 * 28. Sends document via secure link.
 *
 * @param {string} documentId - Document ID
 * @param {string} recipientEmail - Recipient email
 * @param {Date} [expirationDate] - Link expiration date
 * @returns {Promise<{linkId: string; secureUrl: string; expiresAt: Date}>} Secure link information
 *
 * @example
 * ```typescript
 * const link = await sendDocumentSecureLink('doc-uuid', 'john@example.com',
 *   new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 * );
 * ```
 */
export declare const sendDocumentSecureLink: (documentId: string, recipientEmail: string, expirationDate?: Date) => Promise<{
    linkId: string;
    secureUrl: string;
    expiresAt: Date;
}>;
/**
 * 29. Records document access event.
 *
 * @param {string} documentId - Document ID
 * @param {string} userId - User accessing document
 * @param {string} action - Access action
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recordDocumentAccess('doc-uuid', 'user-uuid', 'viewed');
 * ```
 */
export declare const recordDocumentAccess: (documentId: string, userId: string, action: string) => Promise<void>;
/**
 * 30. Generates delivery report.
 *
 * @param {Date} startDate - Report period start
 * @param {Date} endDate - Report period end
 * @returns {Promise<{totalDeliveries: number; byChannel: Record<string, number>; successRate: number}>} Delivery report
 *
 * @example
 * ```typescript
 * const report = await generateDeliveryReport(
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31')
 * );
 * console.log('Success rate:', report.successRate);
 * ```
 */
export declare const generateDeliveryReport: (startDate: Date, endDate: Date) => Promise<{
    totalDeliveries: number;
    byChannel: Record<string, number>;
    successRate: number;
}>;
/**
 * 31. Generates certificate of insurance.
 *
 * @param {CertificateRequest} request - Certificate request
 * @returns {Promise<{certificateId: string; documentId: string; certificateNumber: string}>} Generated certificate
 *
 * @example
 * ```typescript
 * const certificate = await generateCertificateOfInsurance({
 *   policyId: 'policy-uuid',
 *   certificateHolderName: 'ABC Corporation',
 *   certificateHolderAddress: { street: '123 Business Ave', city: 'Boston', state: 'MA', postalCode: '02101', country: 'USA' },
 *   coverageTypes: ['general_liability', 'auto_liability'],
 *   effectiveDate: new Date('2025-01-01'),
 *   expirationDate: new Date('2026-01-01')
 * });
 * ```
 */
export declare const generateCertificateOfInsurance: (request: CertificateRequest) => Promise<{
    certificateId: string;
    documentId: string;
    certificateNumber: string;
}>;
/**
 * 32. Generates evidence of coverage document.
 *
 * @param {EvidenceOfCoverageRequest} request - Evidence of coverage request
 * @returns {Promise<{documentId: string; pageCount: number; sections: string[]}>} Generated evidence document
 *
 * @example
 * ```typescript
 * const evidence = await generateEvidenceOfCoverage({
 *   policyId: 'policy-uuid',
 *   memberId: 'member-uuid',
 *   planName: 'Premium Health Plan',
 *   coverageYear: 2025,
 *   benefitSummary: { deductible: 1000, oopMax: 5000 }
 * });
 * ```
 */
export declare const generateEvidenceOfCoverage: (request: EvidenceOfCoverageRequest) => Promise<{
    documentId: string;
    pageCount: number;
    sections: string[];
}>;
/**
 * 33. Creates regulatory filing document.
 *
 * @param {RegulatoryFilingConfig} config - Filing configuration
 * @returns {Promise<{filingId: string; submissionDeadline: Date; status: string}>} Filing information
 *
 * @example
 * ```typescript
 * const filing = await createRegulatoryFiling({
 *   filingType: 'annual_report',
 *   jurisdiction: 'MA',
 *   regulatoryBody: 'Division of Insurance',
 *   filingDeadline: new Date('2025-03-31'),
 *   documentIds: ['doc1', 'doc2', 'doc3'],
 *   submittedBy: 'user-uuid'
 * });
 * ```
 */
export declare const createRegulatoryFiling: (config: RegulatoryFilingConfig) => Promise<{
    filingId: string;
    submissionDeadline: Date;
    status: string;
}>;
/**
 * 34. Validates regulatory compliance.
 *
 * @param {string} documentId - Document ID
 * @param {string[]} regulations - Regulations to check
 * @returns {Promise<{compliant: boolean; violations: string[]; warnings: string[]}>} Compliance validation
 *
 * @example
 * ```typescript
 * const compliance = await validateRegulatoryCompliance('doc-uuid', [
 *   'HIPAA', 'STATE_INSURANCE_REG_214', 'NAIC_MODEL_ACT'
 * ]);
 * ```
 */
export declare const validateRegulatoryCompliance: (documentId: string, regulations: string[]) => Promise<{
    compliant: boolean;
    violations: string[];
    warnings: string[];
}>;
/**
 * 35. Archives regulatory documents.
 *
 * @param {DocumentArchivalRequest} request - Archival request
 * @returns {Promise<{archived: number; archivalPath: string}>} Archival result
 *
 * @example
 * ```typescript
 * const result = await archiveRegulatoryDocuments({
 *   documentIds: ['doc1', 'doc2'],
 *   archivalTier: 'cold',
 *   compressionEnabled: true,
 *   encryptionEnabled: true,
 *   retentionEndDate: new Date('2032-12-31')
 * });
 * ```
 */
export declare const archiveRegulatoryDocuments: (request: DocumentArchivalRequest) => Promise<{
    archived: number;
    archivalPath: string;
}>;
/**
 * 36. Searches documents with full-text search.
 *
 * @param {DocumentSearchQuery} query - Search query
 * @param {PaginationParams} [pagination] - Pagination parameters
 * @returns {Promise<PaginatedResponse<Partial<InsuranceDocumentAttributes>>>} Search results
 *
 * @example
 * ```typescript
 * const results = await searchDocuments({
 *   searchTerm: 'auto insurance',
 *   documentType: 'policy_declaration',
 *   status: 'approved',
 *   createdAfter: new Date('2025-01-01'),
 *   fullTextSearch: true
 * }, { page: 1, limit: 20 });
 * ```
 */
export declare const searchDocuments: (query: DocumentSearchQuery, pagination?: PaginationParams) => Promise<PaginatedResponse<Partial<InsuranceDocumentAttributes>>>;
/**
 * 37. Extracts data from document using OCR.
 *
 * @param {OCRExtractionRequest} request - OCR extraction request
 * @returns {Promise<OCRExtractionResult>} Extraction result
 *
 * @example
 * ```typescript
 * const extracted = await extractDocumentData({
 *   documentId: 'doc-uuid',
 *   engine: 'aws_textract',
 *   extractTables: true,
 *   extractForms: true,
 *   confidenceThreshold: 0.85
 * });
 * console.log('Extracted text:', extracted.text);
 * console.log('Confidence:', extracted.confidence);
 * ```
 */
export declare const extractDocumentData: (request: OCRExtractionRequest) => Promise<OCRExtractionResult>;
/**
 * 38. Indexes document for full-text search.
 *
 * @param {string} documentId - Document ID
 * @param {Record<string, any>} [metadata] - Additional indexing metadata
 * @returns {Promise<{indexed: boolean; indexId: string}>} Indexing result
 *
 * @example
 * ```typescript
 * const result = await indexDocument('doc-uuid', {
 *   keywords: ['auto', 'insurance', 'liability'],
 *   category: 'policy_documents'
 * });
 * ```
 */
export declare const indexDocument: (documentId: string, metadata?: Record<string, any>) => Promise<{
    indexed: boolean;
    indexId: string;
}>;
/**
 * 39. Retrieves document audit trail.
 *
 * @param {string} documentId - Document ID
 * @param {Date} [startDate] - Filter start date
 * @param {Date} [endDate] - Filter end date
 * @returns {Promise<DocumentAuditEntry[]>} Audit trail
 *
 * @example
 * ```typescript
 * const audit = await getDocumentAuditTrail('doc-uuid',
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31')
 * );
 * audit.forEach(entry => console.log(`${entry.action} by ${entry.performedBy} at ${entry.performedAt}`));
 * ```
 */
export declare const getDocumentAuditTrail: (documentId: string, startDate?: Date, endDate?: Date) => Promise<DocumentAuditEntry[]>;
/**
 * 40. Generates document compliance report.
 *
 * @param {Date} startDate - Report period start
 * @param {Date} endDate - Report period end
 * @param {DocumentType[]} [documentTypes] - Document types to include
 * @returns {Promise<{totalDocuments: number; compliant: number; violations: Array<{documentId: string; issue: string}>}>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateDocumentComplianceReport(
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31'),
 *   ['policy_declaration', 'policy_contract']
 * );
 * console.log(`Compliance rate: ${(report.compliant / report.totalDocuments * 100).toFixed(2)}%`);
 * ```
 */
export declare const generateDocumentComplianceReport: (startDate: Date, endDate: Date, documentTypes?: DocumentType[]) => Promise<{
    totalDocuments: number;
    compliant: number;
    violations: Array<{
        documentId: string;
        issue: string;
    }>;
}>;
declare const _default: {
    createInsuranceDocumentModel: (sequelize: Sequelize) => any;
    createDocumentTemplateModel: (sequelize: Sequelize) => any;
    generatePolicyDeclaration: (config: PolicyDocumentConfig) => Promise<{
        documentId: string;
        documentNumber: string;
        filePath: string;
    }>;
    generatePolicyContract: any;
    generatePolicyEndorsement: any;
    generateRenewalNotice: any;
    generateCancellationNotice: any;
    batchGeneratePolicyDocuments: any;
    createClaimsForm: any;
    attachClaimEvidence: any;
    generateClaimSettlement: any;
    generateClaimDenial: any;
    getClaimDocumentPackage: any;
    createDocumentTemplate: any;
    updateDocumentTemplate: any;
    validateTemplateVariables: any;
    renderTemplate: any;
    listTemplatesByCategory: any;
    createDocumentVersion: any;
    getDocumentVersionHistory: any;
    revertToDocumentVersion: any;
    compareDocumentVersions: any;
    initiateESignature: any;
    trackESignatureStatus: (envelopeId: string) => Promise<{
        status: string;
        signedBy: string[];
        pendingSigners: string[];
        completedAt?: Date;
    }>;
    sendSignatureReminder: (envelopeId: string, signerEmails: string[]) => Promise<{
        sent: number;
    }>;
    cancelESignature: (envelopeId: string, reason: string) => Promise<{
        cancelled: boolean;
    }>;
    downloadSignedDocument: (envelopeId: string) => Promise<{
        documentPath: string;
        certificatePath: string;
        fileSize: number;
    }>;
    deliverDocument: (request: DocumentDeliveryRequest) => Promise<{
        deliveryId: string;
        sent: number;
        scheduled: number;
    }>;
    trackDocumentDelivery: (deliveryId: string) => Promise<DeliveryTracking[]>;
    sendDocumentSecureLink: (documentId: string, recipientEmail: string, expirationDate?: Date) => Promise<{
        linkId: string;
        secureUrl: string;
        expiresAt: Date;
    }>;
    recordDocumentAccess: (documentId: string, userId: string, action: string) => Promise<void>;
    generateDeliveryReport: (startDate: Date, endDate: Date) => Promise<{
        totalDeliveries: number;
        byChannel: Record<string, number>;
        successRate: number;
    }>;
    generateCertificateOfInsurance: (request: CertificateRequest) => Promise<{
        certificateId: string;
        documentId: string;
        certificateNumber: string;
    }>;
    generateEvidenceOfCoverage: (request: EvidenceOfCoverageRequest) => Promise<{
        documentId: string;
        pageCount: number;
        sections: string[];
    }>;
    createRegulatoryFiling: (config: RegulatoryFilingConfig) => Promise<{
        filingId: string;
        submissionDeadline: Date;
        status: string;
    }>;
    validateRegulatoryCompliance: (documentId: string, regulations: string[]) => Promise<{
        compliant: boolean;
        violations: string[];
        warnings: string[];
    }>;
    archiveRegulatoryDocuments: (request: DocumentArchivalRequest) => Promise<{
        archived: number;
        archivalPath: string;
    }>;
    searchDocuments: (query: DocumentSearchQuery, pagination?: PaginationParams) => Promise<PaginatedResponse<Partial<InsuranceDocumentAttributes>>>;
    extractDocumentData: (request: OCRExtractionRequest) => Promise<OCRExtractionResult>;
    indexDocument: (documentId: string, metadata?: Record<string, any>) => Promise<{
        indexed: boolean;
        indexId: string;
    }>;
    getDocumentAuditTrail: (documentId: string, startDate?: Date, endDate?: Date) => Promise<DocumentAuditEntry[]>;
    generateDocumentComplianceReport: (startDate: Date, endDate: Date, documentTypes?: DocumentType[]) => Promise<{
        totalDocuments: number;
        compliant: number;
        violations: Array<{
            documentId: string;
            issue: string;
        }>;
    }>;
};
export default _default;
//# sourceMappingURL=document-management-kit.d.ts.map