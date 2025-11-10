/**
 * LOC: DOC-RED-001
 * File: /reuse/document/document-redaction-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - pdf-lib
 *   - pdfjs-dist
 *   - node-exiftool
 *   - sanitize-filename
 *
 * DOWNSTREAM (imported by):
 *   - Document redaction controllers
 *   - Privacy compliance services
 *   - HIPAA sanitization modules
 *   - Sensitive data removal workflows
 */
/**
 * File: /reuse/document/document-redaction-kit.ts
 * Locator: WC-UTL-DOCRED-001
 * Purpose: Document Redaction & Sanitization Kit - Content redaction, metadata removal, permanent sanitization
 *
 * Upstream: sequelize, pdf-lib, pdfjs-dist, node-exiftool, sanitize-filename
 * Downstream: Redaction controllers, privacy services, HIPAA compliance, sensitive data workflows
 * Dependencies: Sequelize 6.x, TypeScript 5.x, pdf-lib 1.17.x, Node 18+
 * Exports: 38 utility functions for content redaction, search & redact, metadata sanitization, permanent removal
 *
 * LLM Context: Production-grade document redaction utilities for White Cross healthcare platform.
 * Provides content redaction, search and redact patterns, metadata sanitization, permanent content removal,
 * verification of redactions, redaction templates, pattern matching, PHI removal, audit logging,
 * and HIPAA-compliant sanitization. Essential for protecting patient privacy, removing sensitive
 * information, and ensuring compliance with healthcare regulations.
 */
import { Sequelize } from 'sequelize';
/**
 * Redaction area coordinates
 */
export interface RedactionArea {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
    text?: string;
}
/**
 * Redaction pattern for search and redact
 */
export interface RedactionPattern {
    pattern: string | RegExp;
    type: 'text' | 'regex' | 'ssn' | 'phone' | 'email' | 'date' | 'mrn' | 'custom';
    replacement?: string;
    caseSensitive?: boolean;
    wholeWord?: boolean;
    color?: string;
}
/**
 * Redaction result
 */
export interface RedactionResult {
    success: boolean;
    redactedCount: number;
    areas: RedactionArea[];
    outputBuffer?: Buffer;
    auditLog?: RedactionAuditEntry[];
    timestamp: Date;
}
/**
 * Search and redact result
 */
export interface SearchRedactResult {
    matches: number;
    redacted: number;
    areas: RedactionArea[];
    patterns: RedactionPattern[];
    outputBuffer?: Buffer;
}
/**
 * Metadata sanitization result
 */
export interface MetadataSanitizationResult {
    success: boolean;
    removedFields: string[];
    sanitizedFields: string[];
    outputBuffer?: Buffer;
}
/**
 * Redaction verification result
 */
export interface RedactionVerificationResult {
    verified: boolean;
    issues: RedactionIssue[];
    compliant: boolean;
    timestamp: Date;
}
/**
 * Redaction issue found during verification
 */
export interface RedactionIssue {
    type: 'incomplete' | 'visible_text' | 'metadata_leak' | 'annotation_leak' | 'hidden_content';
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    location?: {
        page?: number;
        area?: RedactionArea;
    };
    remediation: string;
}
/**
 * Redaction template
 */
export interface RedactionTemplate {
    id: string;
    name: string;
    description?: string;
    patterns: RedactionPattern[];
    areas?: RedactionArea[];
    metadataFields?: string[];
    removeAnnotations?: boolean;
    removeBookmarks?: boolean;
    removeAttachments?: boolean;
}
/**
 * Redaction audit entry
 */
export interface RedactionAuditEntry {
    timestamp: Date;
    action: 'redact' | 'sanitize' | 'verify' | 'remove';
    target: string;
    page?: number;
    user?: string;
    pattern?: string;
    reason?: string;
}
/**
 * PHI (Protected Health Information) detection result
 */
export interface PHIDetectionResult {
    found: boolean;
    types: PHIType[];
    locations: PHILocation[];
    confidence: number;
}
/**
 * PHI type detected
 */
export type PHIType = 'name' | 'ssn' | 'mrn' | 'dob' | 'phone' | 'email' | 'address' | 'insurance';
/**
 * PHI location in document
 */
export interface PHILocation {
    type: PHIType;
    value: string;
    page: number;
    bounds: RedactionArea;
    confidence: number;
}
/**
 * Permanent removal options
 */
export interface PermanentRemovalOptions {
    removeMetadata?: boolean;
    removeAnnotations?: boolean;
    removeBookmarks?: boolean;
    removeAttachments?: boolean;
    removeJavaScript?: boolean;
    removeForms?: boolean;
    removeHiddenText?: boolean;
    overwriteCount?: number;
}
/**
 * Redaction session model attributes
 */
export interface RedactionSessionAttributes {
    id: string;
    documentId?: string;
    fileHash: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'verified';
    redactionCount: number;
    templateId?: string;
    performedBy?: string;
    verified: boolean;
    verifiedAt?: Date;
    verifiedBy?: string;
    auditTrail: RedactionAuditEntry[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Redacted area model attributes
 */
export interface RedactedAreaAttributes {
    id: string;
    sessionId: string;
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
    redactionType: 'text' | 'image' | 'annotation' | 'form';
    pattern?: string;
    reason?: string;
    permanent: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Redaction template model attributes
 */
export interface RedactionTemplateAttributes {
    id: string;
    name: string;
    description?: string;
    patterns: Record<string, any>;
    areas?: Record<string, any>;
    settings: Record<string, any>;
    active: boolean;
    createdBy?: string;
    usageCount: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates RedactionSession model with associations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} RedactionSession model
 *
 * @example
 * ```typescript
 * const RedactionSession = createRedactionSessionModel(sequelize);
 * const session = await RedactionSession.create({
 *   fileHash: 'abc123...',
 *   status: 'pending',
 *   performedBy: 'user-123'
 * });
 * ```
 */
export declare const createRedactionSessionModel: (sequelize: Sequelize) => any;
/**
 * Creates RedactedArea model with associations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} RedactedArea model
 *
 * @example
 * ```typescript
 * const RedactedArea = createRedactedAreaModel(sequelize);
 * const area = await RedactedArea.create({
 *   sessionId: 'session-uuid',
 *   page: 1,
 *   x: 100,
 *   y: 200,
 *   width: 300,
 *   height: 50,
 *   redactionType: 'text'
 * });
 * ```
 */
export declare const createRedactedAreaModel: (sequelize: Sequelize) => any;
/**
 * Creates RedactionTemplate model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} RedactionTemplate model
 *
 * @example
 * ```typescript
 * const RedactionTemplate = createRedactionTemplateModel(sequelize);
 * const template = await RedactionTemplate.create({
 *   name: 'HIPAA PHI Redaction',
 *   patterns: { ssn: true, mrn: true },
 *   active: true
 * });
 * ```
 */
export declare const createRedactionTemplateModel: (sequelize: Sequelize) => any;
/**
 * Sets up associations between redaction models.
 *
 * @param {any} RedactionSession - RedactionSession model
 * @param {any} RedactedArea - RedactedArea model
 * @param {any} RedactionTemplate - RedactionTemplate model
 *
 * @example
 * ```typescript
 * setupRedactionAssociations(RedactionSession, RedactedArea, RedactionTemplate);
 * // Now you can use: session.getRedactedAreas(), session.addRedactedArea(), etc.
 * ```
 */
export declare const setupRedactionAssociations: (RedactionSession: any, RedactedArea: any, RedactionTemplate: any) => void;
/**
 * 1. Redacts specific areas in PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {RedactionArea[]} areas - Areas to redact
 * @param {Object} [options] - Redaction options
 * @returns {Promise<RedactionResult>} Redaction result
 *
 * @example
 * ```typescript
 * const result = await redactAreas(pdfBuffer, [
 *   { page: 1, x: 100, y: 200, width: 300, height: 50 },
 *   { page: 2, x: 50, y: 150, width: 200, height: 30 }
 * ]);
 * await fs.writeFile('redacted.pdf', result.outputBuffer);
 * ```
 */
export declare const redactAreas: (pdfBuffer: Buffer, areas: RedactionArea[], options?: {
    color?: string;
    permanent?: boolean;
    auditLog?: boolean;
}) => Promise<RedactionResult>;
/**
 * 2. Redacts text matching specific pattern.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {string | RegExp} pattern - Text pattern to redact
 * @param {Object} [options] - Redaction options
 * @returns {Promise<RedactionResult>} Redaction result
 *
 * @example
 * ```typescript
 * const result = await redactText(pdfBuffer, /\d{3}-\d{2}-\d{4}/, {
 *   color: '#000000',
 *   caseSensitive: false
 * });
 * console.log('Redacted', result.redactedCount, 'instances');
 * ```
 */
export declare const redactText: (pdfBuffer: Buffer, pattern: string | RegExp, options?: {
    color?: string;
    caseSensitive?: boolean;
    wholeWord?: boolean;
}) => Promise<RedactionResult>;
/**
 * 3. Redacts images in PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number[]} [pages] - Specific pages to redact images (all pages if not specified)
 * @returns {Promise<RedactionResult>} Redaction result
 *
 * @example
 * ```typescript
 * const result = await redactImages(pdfBuffer, [1, 2, 3]);
 * ```
 */
export declare const redactImages: (pdfBuffer: Buffer, pages?: number[]) => Promise<RedactionResult>;
/**
 * 4. Redacts annotations and comments.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<RedactionResult>} Redaction result
 *
 * @example
 * ```typescript
 * const result = await redactAnnotations(pdfBuffer);
 * ```
 */
export declare const redactAnnotations: (pdfBuffer: Buffer) => Promise<RedactionResult>;
/**
 * 5. Redacts form fields and data.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {string[]} [fieldNames] - Specific fields to redact (all if not specified)
 * @returns {Promise<RedactionResult>} Redaction result
 *
 * @example
 * ```typescript
 * const result = await redactFormFields(pdfBuffer, ['ssn', 'dob', 'medicalRecordNumber']);
 * ```
 */
export declare const redactFormFields: (pdfBuffer: Buffer, fieldNames?: string[]) => Promise<RedactionResult>;
/**
 * 6. Searches for text pattern in PDF.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {string | RegExp} pattern - Search pattern
 * @param {Object} [options] - Search options
 * @returns {Promise<Array>} Array of matches with locations
 *
 * @example
 * ```typescript
 * const matches = await searchTextPattern(pdfBuffer, /\d{3}-\d{2}-\d{4}/);
 * console.log('Found', matches.length, 'SSN matches');
 * ```
 */
export declare const searchTextPattern: (pdfBuffer: Buffer, pattern: string | RegExp, options?: {
    caseSensitive?: boolean;
    wholeWord?: boolean;
}) => Promise<Array<{
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
}>>;
/**
 * 7. Searches and redacts in single operation.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {RedactionPattern[]} patterns - Patterns to search and redact
 * @returns {Promise<SearchRedactResult>} Search and redact result
 *
 * @example
 * ```typescript
 * const result = await searchAndRedact(pdfBuffer, [
 *   { pattern: /\d{3}-\d{2}-\d{4}/, type: 'ssn' },
 *   { pattern: /\(\d{3}\)\s*\d{3}-\d{4}/, type: 'phone' }
 * ]);
 * ```
 */
export declare const searchAndRedact: (pdfBuffer: Buffer, patterns: RedactionPattern[]) => Promise<SearchRedactResult>;
/**
 * 8. Redacts Social Security Numbers.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<RedactionResult>} Redaction result
 *
 * @example
 * ```typescript
 * const result = await redactSSN(pdfBuffer);
 * console.log('Redacted', result.redactedCount, 'SSNs');
 * ```
 */
export declare const redactSSN: (pdfBuffer: Buffer) => Promise<RedactionResult>;
/**
 * 9. Redacts phone numbers.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<RedactionResult>} Redaction result
 *
 * @example
 * ```typescript
 * const result = await redactPhoneNumbers(pdfBuffer);
 * ```
 */
export declare const redactPhoneNumbers: (pdfBuffer: Buffer) => Promise<RedactionResult>;
/**
 * 10. Redacts email addresses.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<RedactionResult>} Redaction result
 *
 * @example
 * ```typescript
 * const result = await redactEmailAddresses(pdfBuffer);
 * ```
 */
export declare const redactEmailAddresses: (pdfBuffer: Buffer) => Promise<RedactionResult>;
/**
 * 11. Redacts dates in various formats.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<RedactionResult>} Redaction result
 *
 * @example
 * ```typescript
 * const result = await redactDates(pdfBuffer);
 * ```
 */
export declare const redactDates: (pdfBuffer: Buffer) => Promise<RedactionResult>;
/**
 * 12. Redacts Medical Record Numbers.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {RegExp} [customPattern] - Custom MRN pattern
 * @returns {Promise<RedactionResult>} Redaction result
 *
 * @example
 * ```typescript
 * const result = await redactMRN(pdfBuffer, /MRN[-:\s]*\d{6,10}/g);
 * ```
 */
export declare const redactMRN: (pdfBuffer: Buffer, customPattern?: RegExp) => Promise<RedactionResult>;
/**
 * 13. Removes all metadata from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<MetadataSanitizationResult>} Sanitization result
 *
 * @example
 * ```typescript
 * const result = await removeAllMetadata(pdfBuffer);
 * console.log('Removed fields:', result.removedFields);
 * ```
 */
export declare const removeAllMetadata: (pdfBuffer: Buffer) => Promise<MetadataSanitizationResult>;
/**
 * 14. Sanitizes specific metadata fields.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {string[]} fields - Fields to sanitize
 * @param {string} [replacement] - Replacement value
 * @returns {Promise<MetadataSanitizationResult>} Sanitization result
 *
 * @example
 * ```typescript
 * const result = await sanitizeMetadataFields(pdfBuffer, ['Author', 'Creator'], 'Redacted');
 * ```
 */
export declare const sanitizeMetadataFields: (pdfBuffer: Buffer, fields: string[], replacement?: string) => Promise<MetadataSanitizationResult>;
/**
 * 15. Removes XMP metadata.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<MetadataSanitizationResult>} Sanitization result
 *
 * @example
 * ```typescript
 * const result = await removeXMPMetadata(pdfBuffer);
 * ```
 */
export declare const removeXMPMetadata: (pdfBuffer: Buffer) => Promise<MetadataSanitizationResult>;
/**
 * 16. Removes EXIF data from embedded images.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<MetadataSanitizationResult>} Sanitization result
 *
 * @example
 * ```typescript
 * const result = await removeEXIFData(pdfBuffer);
 * ```
 */
export declare const removeEXIFData: (pdfBuffer: Buffer) => Promise<MetadataSanitizationResult>;
/**
 * 17. Removes document properties.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<MetadataSanitizationResult>} Sanitization result
 *
 * @example
 * ```typescript
 * const result = await removeDocumentProperties(pdfBuffer);
 * ```
 */
export declare const removeDocumentProperties: (pdfBuffer: Buffer) => Promise<MetadataSanitizationResult>;
/**
 * 18. Sanitizes file name metadata.
 *
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeFileName('patient_john_doe_ssn_123456789.pdf');
 * // Result: 'document_redacted_2024.pdf'
 * ```
 */
export declare const sanitizeFileName: (filename: string) => string;
/**
 * 19. Permanently removes content (unrecoverable).
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {RedactionArea[]} areas - Areas to permanently remove
 * @param {PermanentRemovalOptions} [options] - Removal options
 * @returns {Promise<RedactionResult>} Removal result
 *
 * @example
 * ```typescript
 * const result = await permanentlyRemoveContent(pdfBuffer, redactionAreas, {
 *   overwriteCount: 7,
 *   removeMetadata: true
 * });
 * ```
 */
export declare const permanentlyRemoveContent: (pdfBuffer: Buffer, areas: RedactionArea[], options?: PermanentRemovalOptions) => Promise<RedactionResult>;
/**
 * 20. Removes hidden text and layers.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Buffer>} PDF without hidden content
 *
 * @example
 * ```typescript
 * const sanitized = await removeHiddenContent(pdfBuffer);
 * ```
 */
export declare const removeHiddenContent: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 21. Removes JavaScript and active content.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Buffer>} PDF without JavaScript
 *
 * @example
 * ```typescript
 * const sanitized = await removeJavaScript(pdfBuffer);
 * ```
 */
export declare const removeJavaScript: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 22. Removes embedded files and attachments.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Buffer>} PDF without attachments
 *
 * @example
 * ```typescript
 * const sanitized = await removeAttachments(pdfBuffer);
 * ```
 */
export declare const removeAttachments: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 23. Removes bookmarks and navigation.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Buffer>} PDF without bookmarks
 *
 * @example
 * ```typescript
 * const sanitized = await removeBookmarks(pdfBuffer);
 * ```
 */
export declare const removeBookmarks: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 24. Flattens PDF to remove layers.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Buffer>} Flattened PDF
 *
 * @example
 * ```typescript
 * const flattened = await flattenPDF(pdfBuffer);
 * ```
 */
export declare const flattenPDF: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 25. Verifies redaction completeness.
 *
 * @param {Buffer} redactedPdf - Redacted PDF buffer
 * @param {Buffer} [originalPdf] - Original PDF for comparison
 * @returns {Promise<RedactionVerificationResult>} Verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyRedaction(redactedPdf, originalPdf);
 * if (!verification.verified) {
 *   console.error('Redaction issues:', verification.issues);
 * }
 * ```
 */
export declare const verifyRedaction: (redactedPdf: Buffer, originalPdf?: Buffer) => Promise<RedactionVerificationResult>;
/**
 * 26. Checks for metadata leaks.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<RedactionIssue[]>} Metadata leak issues
 *
 * @example
 * ```typescript
 * const leaks = await checkMetadataLeaks(pdfBuffer);
 * ```
 */
export declare const checkMetadataLeaks: (pdfBuffer: Buffer) => Promise<RedactionIssue[]>;
/**
 * 27. Checks for hidden or recoverable content.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<RedactionIssue[]>} Hidden content issues
 *
 * @example
 * ```typescript
 * const hiddenIssues = await checkHiddenContent(pdfBuffer);
 * ```
 */
export declare const checkHiddenContent: (pdfBuffer: Buffer) => Promise<RedactionIssue[]>;
/**
 * 28. Validates redaction against template.
 *
 * @param {Buffer} pdfBuffer - Redacted PDF buffer
 * @param {RedactionTemplate} template - Template to validate against
 * @returns {Promise<boolean>} True if compliant
 *
 * @example
 * ```typescript
 * const compliant = await validateAgainstTemplate(redactedPdf, template);
 * ```
 */
export declare const validateAgainstTemplate: (pdfBuffer: Buffer, template: RedactionTemplate) => Promise<boolean>;
/**
 * 29. Creates redaction pattern for common PHI.
 *
 * @param {PHIType} type - Type of PHI
 * @returns {RedactionPattern} Redaction pattern
 *
 * @example
 * ```typescript
 * const ssnPattern = createPHIPattern('ssn');
 * const result = await searchAndRedact(pdfBuffer, [ssnPattern]);
 * ```
 */
export declare const createPHIPattern: (type: PHIType) => RedactionPattern;
/**
 * 30. Creates custom redaction template.
 *
 * @param {string} name - Template name
 * @param {RedactionPattern[]} patterns - Redaction patterns
 * @param {Object} [options] - Template options
 * @returns {RedactionTemplate} Created template
 *
 * @example
 * ```typescript
 * const template = createRedactionTemplate('HIPAA Full', [
 *   createPHIPattern('ssn'),
 *   createPHIPattern('mrn'),
 *   createPHIPattern('dob')
 * ]);
 * ```
 */
export declare const createRedactionTemplate: (name: string, patterns: RedactionPattern[], options?: {
    description?: string;
    metadataFields?: string[];
}) => RedactionTemplate;
/**
 * 31. Applies redaction template to PDF.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {RedactionTemplate} template - Redaction template
 * @returns {Promise<RedactionResult>} Redaction result
 *
 * @example
 * ```typescript
 * const result = await applyRedactionTemplate(pdfBuffer, hipaaTemplate);
 * ```
 */
export declare const applyRedactionTemplate: (pdfBuffer: Buffer, template: RedactionTemplate) => Promise<RedactionResult>;
/**
 * 32. Detects Protected Health Information in PDF.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<PHIDetectionResult>} Detection result
 *
 * @example
 * ```typescript
 * const detection = await detectPHI(pdfBuffer);
 * if (detection.found) {
 *   console.log('PHI types found:', detection.types);
 * }
 * ```
 */
export declare const detectPHI: (pdfBuffer: Buffer) => Promise<PHIDetectionResult>;
/**
 * 33. Auto-redacts all detected PHI.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {PHIType[]} [types] - PHI types to redact (all if not specified)
 * @returns {Promise<RedactionResult>} Redaction result
 *
 * @example
 * ```typescript
 * const result = await autoRedactPHI(pdfBuffer, ['ssn', 'mrn', 'dob']);
 * ```
 */
export declare const autoRedactPHI: (pdfBuffer: Buffer, types?: PHIType[]) => Promise<RedactionResult>;
/**
 * 34. Creates audit log entry for redaction.
 *
 * @param {string} action - Action performed
 * @param {Object} details - Action details
 * @returns {RedactionAuditEntry} Audit entry
 *
 * @example
 * ```typescript
 * const entry = createAuditLogEntry('redact', {
 *   target: 'ssn',
 *   page: 1,
 *   user: 'user-123'
 * });
 * ```
 */
export declare const createAuditLogEntry: (action: "redact" | "sanitize" | "verify" | "remove", details: {
    target: string;
    page?: number;
    user?: string;
    pattern?: string;
    reason?: string;
}) => RedactionAuditEntry;
/**
 * 35. Exports audit trail to JSON.
 *
 * @param {RedactionAuditEntry[]} auditTrail - Audit trail entries
 * @returns {string} JSON audit trail
 *
 * @example
 * ```typescript
 * const json = exportAuditTrail(session.auditTrail);
 * await fs.writeFile('audit.json', json);
 * ```
 */
export declare const exportAuditTrail: (auditTrail: RedactionAuditEntry[]) => string;
/**
 * 36. Generates compliance report.
 *
 * @param {RedactionVerificationResult} verification - Verification result
 * @param {RedactionAuditEntry[]} auditTrail - Audit trail
 * @returns {string} Compliance report
 *
 * @example
 * ```typescript
 * const report = generateComplianceReport(verification, auditTrail);
 * ```
 */
export declare const generateComplianceReport: (verification: RedactionVerificationResult, auditTrail: RedactionAuditEntry[]) => string;
/**
 * 37. Finds image locations in PDF.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number[]} [pages] - Specific pages to search
 * @returns {Promise<Array>} Image locations
 *
 * @example
 * ```typescript
 * const images = await findImageLocations(pdfBuffer);
 * ```
 */
export declare const findImageLocations: (pdfBuffer: Buffer, pages?: number[]) => Promise<Array<{
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
}>>;
/**
 * 38. Calculates redaction coverage percentage.
 *
 * @param {RedactionArea[]} areas - Redacted areas
 * @param {number} totalPages - Total pages in document
 * @returns {number} Coverage percentage
 *
 * @example
 * ```typescript
 * const coverage = calculateRedactionCoverage(redactedAreas, 10);
 * console.log(`${coverage}% of document redacted`);
 * ```
 */
export declare const calculateRedactionCoverage: (areas: RedactionArea[], totalPages: number) => number;
declare const _default: {
    createRedactionSessionModel: (sequelize: Sequelize) => any;
    createRedactedAreaModel: (sequelize: Sequelize) => any;
    createRedactionTemplateModel: (sequelize: Sequelize) => any;
    setupRedactionAssociations: (RedactionSession: any, RedactedArea: any, RedactionTemplate: any) => void;
    redactAreas: (pdfBuffer: Buffer, areas: RedactionArea[], options?: {
        color?: string;
        permanent?: boolean;
        auditLog?: boolean;
    }) => Promise<RedactionResult>;
    redactText: (pdfBuffer: Buffer, pattern: string | RegExp, options?: {
        color?: string;
        caseSensitive?: boolean;
        wholeWord?: boolean;
    }) => Promise<RedactionResult>;
    redactImages: (pdfBuffer: Buffer, pages?: number[]) => Promise<RedactionResult>;
    redactAnnotations: (pdfBuffer: Buffer) => Promise<RedactionResult>;
    redactFormFields: (pdfBuffer: Buffer, fieldNames?: string[]) => Promise<RedactionResult>;
    searchTextPattern: (pdfBuffer: Buffer, pattern: string | RegExp, options?: {
        caseSensitive?: boolean;
        wholeWord?: boolean;
    }) => Promise<Array<{
        page: number;
        x: number;
        y: number;
        width: number;
        height: number;
        text: string;
    }>>;
    searchAndRedact: (pdfBuffer: Buffer, patterns: RedactionPattern[]) => Promise<SearchRedactResult>;
    redactSSN: (pdfBuffer: Buffer) => Promise<RedactionResult>;
    redactPhoneNumbers: (pdfBuffer: Buffer) => Promise<RedactionResult>;
    redactEmailAddresses: (pdfBuffer: Buffer) => Promise<RedactionResult>;
    redactDates: (pdfBuffer: Buffer) => Promise<RedactionResult>;
    redactMRN: (pdfBuffer: Buffer, customPattern?: RegExp) => Promise<RedactionResult>;
    removeAllMetadata: (pdfBuffer: Buffer) => Promise<MetadataSanitizationResult>;
    sanitizeMetadataFields: (pdfBuffer: Buffer, fields: string[], replacement?: string) => Promise<MetadataSanitizationResult>;
    removeXMPMetadata: (pdfBuffer: Buffer) => Promise<MetadataSanitizationResult>;
    removeEXIFData: (pdfBuffer: Buffer) => Promise<MetadataSanitizationResult>;
    removeDocumentProperties: (pdfBuffer: Buffer) => Promise<MetadataSanitizationResult>;
    sanitizeFileName: (filename: string) => string;
    permanentlyRemoveContent: (pdfBuffer: Buffer, areas: RedactionArea[], options?: PermanentRemovalOptions) => Promise<RedactionResult>;
    removeHiddenContent: (pdfBuffer: Buffer) => Promise<Buffer>;
    removeJavaScript: (pdfBuffer: Buffer) => Promise<Buffer>;
    removeAttachments: (pdfBuffer: Buffer) => Promise<Buffer>;
    removeBookmarks: (pdfBuffer: Buffer) => Promise<Buffer>;
    flattenPDF: (pdfBuffer: Buffer) => Promise<Buffer>;
    verifyRedaction: (redactedPdf: Buffer, originalPdf?: Buffer) => Promise<RedactionVerificationResult>;
    checkMetadataLeaks: (pdfBuffer: Buffer) => Promise<RedactionIssue[]>;
    checkHiddenContent: (pdfBuffer: Buffer) => Promise<RedactionIssue[]>;
    validateAgainstTemplate: (pdfBuffer: Buffer, template: RedactionTemplate) => Promise<boolean>;
    createPHIPattern: (type: PHIType) => RedactionPattern;
    createRedactionTemplate: (name: string, patterns: RedactionPattern[], options?: {
        description?: string;
        metadataFields?: string[];
    }) => RedactionTemplate;
    applyRedactionTemplate: (pdfBuffer: Buffer, template: RedactionTemplate) => Promise<RedactionResult>;
    detectPHI: (pdfBuffer: Buffer) => Promise<PHIDetectionResult>;
    autoRedactPHI: (pdfBuffer: Buffer, types?: PHIType[]) => Promise<RedactionResult>;
    createAuditLogEntry: (action: "redact" | "sanitize" | "verify" | "remove", details: {
        target: string;
        page?: number;
        user?: string;
        pattern?: string;
        reason?: string;
    }) => RedactionAuditEntry;
    exportAuditTrail: (auditTrail: RedactionAuditEntry[]) => string;
    generateComplianceReport: (verification: RedactionVerificationResult, auditTrail: RedactionAuditEntry[]) => string;
    findImageLocations: (pdfBuffer: Buffer, pages?: number[]) => Promise<Array<{
        page: number;
        x: number;
        y: number;
        width: number;
        height: number;
    }>>;
    calculateRedactionCoverage: (areas: RedactionArea[], totalPages: number) => number;
};
export default _default;
//# sourceMappingURL=document-redaction-kit.d.ts.map