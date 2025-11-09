/**
 * LOC: DOC-VAL-001
 * File: /reuse/document/document-validation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - pdf-lib
 *   - node-pdfa-validator
 *   - pdf.js
 *   - pdfx-validator
 *
 * DOWNSTREAM (imported by):
 *   - Document validation controllers
 *   - Compliance services
 *   - PDF processing modules
 *   - Healthcare document workflows
 */
/**
 * File: /reuse/document/document-validation-kit.ts
 * Locator: WC-UTL-DOCVAL-001
 * Purpose: Document Validation & Compliance Kit - PDF/A, PDF/X, PDF/E validation and compliance
 *
 * Upstream: sequelize, pdf-lib, node-pdfa-validator, pdf.js, pdfx-validator
 * Downstream: Validation controllers, compliance services, document workflows, archival systems
 * Dependencies: Sequelize 6.x, TypeScript 5.x, pdf-lib 1.17.x, Node 18+
 * Exports: 42 utility functions for PDF validation, compliance checking, auto-remediation, format conversion
 *
 * LLM Context: Production-grade document validation utilities for White Cross healthcare platform.
 * Provides PDF/A validation (1a, 1b, 2a, 2b, 3a, 3b), PDF/X validation, PDF/E validation, compliance
 * checking, error reporting, auto-remediation, format conversion, HIPAA compliance validation,
 * archival suitability, metadata validation, and accessibility compliance. Essential for healthcare
 * document management, long-term preservation, and regulatory compliance.
 */
import { Sequelize } from 'sequelize';
/**
 * PDF/A standard versions
 */
export type PDFAVersion = '1a' | '1b' | '2a' | '2b' | '3a' | '3b';
/**
 * PDF/X standard versions
 */
export type PDFXVersion = '1a:2001' | '1a:2003' | '3:2002' | '3:2003' | '4' | '4p' | '5g' | '5n' | '5pg';
/**
 * PDF/E standard versions
 */
export type PDFEVersion = '1';
/**
 * Validation severity levels
 */
export type ValidationSeverity = 'error' | 'warning' | 'info';
/**
 * PDF validation result
 */
export interface PDFValidationResult {
    valid: boolean;
    compliant: boolean;
    version?: string;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    metadata: PDFMetadata;
    timestamp: Date;
}
/**
 * Validation error details
 */
export interface ValidationError {
    code: string;
    message: string;
    severity: ValidationSeverity;
    location?: {
        page?: number;
        object?: string;
        position?: {
            x: number;
            y: number;
        };
    };
    specification?: string;
    remediation?: string;
}
/**
 * Validation warning details
 */
export interface ValidationWarning {
    code: string;
    message: string;
    recommendation?: string;
    impact?: string;
}
/**
 * PDF metadata extracted during validation
 */
export interface PDFMetadata {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
    pdfVersion?: string;
    pageCount?: number;
    fileSize?: number;
    encrypted?: boolean;
    linearized?: boolean;
    tagged?: boolean;
}
/**
 * Compliance check configuration
 */
export interface ComplianceCheckConfig {
    standard: 'pdfa' | 'pdfx' | 'pdfe' | 'hipaa' | 'custom';
    version?: string;
    strict?: boolean;
    checkAccessibility?: boolean;
    checkMetadata?: boolean;
    checkStructure?: boolean;
    checkFonts?: boolean;
    checkImages?: boolean;
    checkColors?: boolean;
}
/**
 * Auto-remediation options
 */
export interface RemediationOptions {
    fixFonts?: boolean;
    fixImages?: boolean;
    fixMetadata?: boolean;
    fixStructure?: boolean;
    fixColors?: boolean;
    embedFonts?: boolean;
    flattenTransparency?: boolean;
    convertColorSpace?: 'RGB' | 'CMYK' | 'Grayscale';
    removeScripts?: boolean;
    removeAnnotations?: boolean;
    addMetadata?: Record<string, string>;
}
/**
 * Remediation result
 */
export interface RemediationResult {
    success: boolean;
    fixedErrors: number;
    remainingErrors: number;
    actions: RemediationAction[];
    outputBuffer?: Buffer;
}
/**
 * Remediation action taken
 */
export interface RemediationAction {
    action: string;
    description: string;
    errorCode?: string;
    timestamp: Date;
}
/**
 * Format conversion options
 */
export interface FormatConversionOptions {
    targetFormat: PDFAVersion | PDFXVersion | PDFEVersion;
    profile?: string;
    intent?: string;
    preserveAnnotations?: boolean;
    preserveBookmarks?: boolean;
    preserveFormFields?: boolean;
    optimizeForPrint?: boolean;
    optimizeForArchival?: boolean;
}
/**
 * Accessibility compliance result
 */
export interface AccessibilityComplianceResult {
    compliant: boolean;
    wcagLevel?: 'A' | 'AA' | 'AAA';
    issues: AccessibilityIssue[];
    score: number;
}
/**
 * Accessibility issue
 */
export interface AccessibilityIssue {
    type: string;
    severity: ValidationSeverity;
    description: string;
    remediation: string;
    wcagCriteria?: string;
}
/**
 * Validation session model attributes
 */
export interface ValidationSessionAttributes {
    id: string;
    documentId?: string;
    fileHash: string;
    standard: string;
    version?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    result?: PDFValidationResult;
    errorCount: number;
    warningCount: number;
    validatedAt?: Date;
    validatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Validation error model attributes
 */
export interface ValidationErrorAttributes {
    id: string;
    sessionId: string;
    errorCode: string;
    message: string;
    severity: ValidationSeverity;
    page?: number;
    objectRef?: string;
    specification?: string;
    remediation?: string;
    resolved: boolean;
    resolvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Compliance profile model attributes
 */
export interface ComplianceProfileAttributes {
    id: string;
    name: string;
    description?: string;
    standard: string;
    version?: string;
    rules: Record<string, any>;
    active: boolean;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates ValidationSession model with associations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} ValidationSession model
 *
 * @example
 * ```typescript
 * const ValidationSession = createValidationSessionModel(sequelize);
 * const session = await ValidationSession.create({
 *   fileHash: 'abc123...',
 *   standard: 'pdfa',
 *   version: '2b',
 *   status: 'pending'
 * });
 * ```
 */
export declare const createValidationSessionModel: (sequelize: Sequelize) => any;
/**
 * Creates ValidationError model with associations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} ValidationError model
 *
 * @example
 * ```typescript
 * const ValidationError = createValidationErrorModel(sequelize);
 * const error = await ValidationError.create({
 *   sessionId: 'session-uuid',
 *   errorCode: 'PDFA-001',
 *   message: 'Font not embedded',
 *   severity: 'error'
 * });
 * ```
 */
export declare const createValidationErrorModel: (sequelize: Sequelize) => any;
/**
 * Creates ComplianceProfile model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} ComplianceProfile model
 *
 * @example
 * ```typescript
 * const ComplianceProfile = createComplianceProfileModel(sequelize);
 * const profile = await ComplianceProfile.create({
 *   name: 'Healthcare PDF/A-2b',
 *   standard: 'pdfa',
 *   version: '2b',
 *   rules: { embedFonts: true, taggedPDF: true }
 * });
 * ```
 */
export declare const createComplianceProfileModel: (sequelize: Sequelize) => any;
/**
 * Sets up associations between validation models.
 *
 * @param {any} ValidationSession - ValidationSession model
 * @param {any} ValidationError - ValidationError model
 * @param {any} ComplianceProfile - ComplianceProfile model
 *
 * @example
 * ```typescript
 * setupValidationAssociations(ValidationSession, ValidationError, ComplianceProfile);
 * // Now you can use: session.getValidationErrors(), session.addValidationError(), etc.
 * ```
 */
export declare const setupValidationAssociations: (ValidationSession: any, ValidationError: any, ComplianceProfile: any) => void;
/**
 * 1. Validates PDF against PDF/A-1a standard (accessible archive).
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<PDFValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validatePDFA1a(pdfBuffer);
 * if (!result.compliant) {
 *   console.error('PDF/A-1a validation failed:', result.errors);
 * }
 * ```
 */
export declare const validatePDFA1a: (pdfBuffer: Buffer) => Promise<PDFValidationResult>;
/**
 * 2. Validates PDF against PDF/A-1b standard (basic archive).
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<PDFValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validatePDFA1b(pdfBuffer);
 * console.log('Compliant:', result.compliant);
 * ```
 */
export declare const validatePDFA1b: (pdfBuffer: Buffer) => Promise<PDFValidationResult>;
/**
 * 3. Validates PDF against PDF/A-2a standard (accessible archive, Unicode support).
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<PDFValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validatePDFA2a(pdfBuffer);
 * ```
 */
export declare const validatePDFA2a: (pdfBuffer: Buffer) => Promise<PDFValidationResult>;
/**
 * 4. Validates PDF against PDF/A-2b standard (basic archive, Unicode support).
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<PDFValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validatePDFA2b(pdfBuffer);
 * ```
 */
export declare const validatePDFA2b: (pdfBuffer: Buffer) => Promise<PDFValidationResult>;
/**
 * 5. Validates PDF against PDF/A-3a standard (accessible archive with embedded files).
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<PDFValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validatePDFA3a(pdfBuffer);
 * ```
 */
export declare const validatePDFA3a: (pdfBuffer: Buffer) => Promise<PDFValidationResult>;
/**
 * 6. Validates PDF against PDF/A-3b standard (basic archive with embedded files).
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<PDFValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validatePDFA3b(pdfBuffer);
 * ```
 */
export declare const validatePDFA3b: (pdfBuffer: Buffer) => Promise<PDFValidationResult>;
/**
 * 7. Generic PDF/A validation for any version.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {PDFAVersion} version - PDF/A version to validate against
 * @returns {Promise<PDFValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validatePDFA(pdfBuffer, '2b');
 * ```
 */
export declare const validatePDFA: (pdfBuffer: Buffer, version: PDFAVersion) => Promise<PDFValidationResult>;
/**
 * 8. Validates PDF against PDF/X-1a standard (print production).
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<PDFValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validatePDFX1a(pdfBuffer);
 * if (result.compliant) console.log('Ready for print production');
 * ```
 */
export declare const validatePDFX1a: (pdfBuffer: Buffer) => Promise<PDFValidationResult>;
/**
 * 9. Validates PDF against PDF/X-3 standard (color-managed print).
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<PDFValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validatePDFX3(pdfBuffer);
 * ```
 */
export declare const validatePDFX3: (pdfBuffer: Buffer) => Promise<PDFValidationResult>;
/**
 * 10. Validates PDF against PDF/X-4 standard (modern print with transparency).
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<PDFValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validatePDFX4(pdfBuffer);
 * ```
 */
export declare const validatePDFX4: (pdfBuffer: Buffer) => Promise<PDFValidationResult>;
/**
 * 11. Validates PDF against PDF/E-1 standard (engineering documents).
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<PDFValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validatePDFE1(pdfBuffer);
 * if (result.compliant) console.log('Suitable for engineering workflows');
 * ```
 */
export declare const validatePDFE1: (pdfBuffer: Buffer) => Promise<PDFValidationResult>;
/**
 * 12. Performs comprehensive compliance check with custom configuration.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {ComplianceCheckConfig} config - Compliance check configuration
 * @returns {Promise<PDFValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await checkCompliance(pdfBuffer, {
 *   standard: 'pdfa',
 *   version: '2b',
 *   strict: true,
 *   checkAccessibility: true
 * });
 * ```
 */
export declare const checkCompliance: (pdfBuffer: Buffer, config: ComplianceCheckConfig) => Promise<PDFValidationResult>;
/**
 * 13. Checks fonts are properly embedded.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<ValidationError[]>} Font-related errors
 *
 * @example
 * ```typescript
 * const fontErrors = await checkFontsEmbedded(pdfBuffer);
 * if (fontErrors.length > 0) console.error('Missing embedded fonts');
 * ```
 */
export declare const checkFontsEmbedded: (pdfBuffer: Buffer) => Promise<ValidationError[]>;
/**
 * 14. Validates color spaces against standard requirements.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {string} standard - Standard to check against
 * @returns {Promise<ValidationError[]>} Color space errors
 *
 * @example
 * ```typescript
 * const colorErrors = await checkColorSpaces(pdfBuffer, '2b');
 * ```
 */
export declare const checkColorSpaces: (pdfBuffer: Buffer, standard: string) => Promise<ValidationError[]>;
/**
 * 15. Validates PDF metadata requirements.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {string} standard - Standard to check against
 * @returns {Promise<ValidationError[]>} Metadata errors
 *
 * @example
 * ```typescript
 * const metadataErrors = await checkMetadataRequirements(pdfBuffer, '2b');
 * ```
 */
export declare const checkMetadataRequirements: (pdfBuffer: Buffer, standard: string) => Promise<ValidationError[]>;
/**
 * 16. Checks PDF logical structure and tagging.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<ValidationError[]>} Structure errors
 *
 * @example
 * ```typescript
 * const structureErrors = await checkPDFStructure(pdfBuffer);
 * ```
 */
export declare const checkPDFStructure: (pdfBuffer: Buffer) => Promise<ValidationError[]>;
/**
 * 17. Validates CMYK color compliance for print production.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<ValidationError[]>} CMYK compliance errors
 *
 * @example
 * ```typescript
 * const cmykErrors = await checkCMYKCompliance(pdfBuffer);
 * ```
 */
export declare const checkCMYKCompliance: (pdfBuffer: Buffer) => Promise<ValidationError[]>;
/**
 * 18. Checks print boxes (bleed, trim, art).
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<ValidationError[]>} Print box errors
 *
 * @example
 * ```typescript
 * const boxErrors = await checkPrintBoxes(pdfBuffer);
 * ```
 */
export declare const checkPrintBoxes: (pdfBuffer: Buffer) => Promise<ValidationError[]>;
/**
 * 19. Validates ICC color profiles.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<ValidationError[]>} ICC profile errors
 *
 * @example
 * ```typescript
 * const iccErrors = await checkICCProfiles(pdfBuffer);
 * ```
 */
export declare const checkICCProfiles: (pdfBuffer: Buffer) => Promise<ValidationError[]>;
/**
 * 20. Validates transparency compliance.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<ValidationError[]>} Transparency errors
 *
 * @example
 * ```typescript
 * const transparencyErrors = await checkTransparencyCompliance(pdfBuffer);
 * ```
 */
export declare const checkTransparencyCompliance: (pdfBuffer: Buffer) => Promise<ValidationError[]>;
/**
 * 21. Validates 3D content for engineering PDFs.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<ValidationError[]>} 3D content errors
 *
 * @example
 * ```typescript
 * const threeDErrors = await check3DContentCompliance(pdfBuffer);
 * ```
 */
export declare const check3DContentCompliance: (pdfBuffer: Buffer) => Promise<ValidationError[]>;
/**
 * 22. Checks HIPAA compliance for healthcare documents.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<PDFValidationResult>} HIPAA compliance result
 *
 * @example
 * ```typescript
 * const result = await checkHIPAACompliance(pdfBuffer);
 * if (!result.compliant) console.error('HIPAA violations found');
 * ```
 */
export declare const checkHIPAACompliance: (pdfBuffer: Buffer) => Promise<PDFValidationResult>;
/**
 * 23. Generates detailed validation error report.
 *
 * @param {PDFValidationResult} result - Validation result
 * @param {Object} [options] - Report options
 * @returns {string} Formatted error report
 *
 * @example
 * ```typescript
 * const report = generateErrorReport(validationResult, { format: 'text' });
 * console.log(report);
 * ```
 */
export declare const generateErrorReport: (result: PDFValidationResult, options?: {
    format?: "text" | "html" | "json";
}) => string;
/**
 * 24. Generates HTML error report with styling.
 *
 * @param {PDFValidationResult} result - Validation result
 * @returns {string} HTML error report
 *
 * @example
 * ```typescript
 * const htmlReport = generateHTMLErrorReport(validationResult);
 * await fs.writeFile('report.html', htmlReport);
 * ```
 */
export declare const generateHTMLErrorReport: (result: PDFValidationResult) => string;
/**
 * 25. Exports validation errors to CSV format.
 *
 * @param {PDFValidationResult} result - Validation result
 * @returns {string} CSV formatted errors
 *
 * @example
 * ```typescript
 * const csv = exportErrorsToCSV(validationResult);
 * await fs.writeFile('errors.csv', csv);
 * ```
 */
export declare const exportErrorsToCSV: (result: PDFValidationResult) => string;
//# sourceMappingURL=document-validation-kit.d.ts.map