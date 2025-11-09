/**
 * LOC: DOC-ACCESS-001
 * File: /reuse/document/document-accessibility-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Document processing services
 *   - PDF generation modules
 *   - Accessibility compliance checkers
 *   - Document remediation services
 */
/**
 * File: /reuse/document/document-accessibility-kit.ts
 * Locator: WC-UTL-DOCACCESS-001
 * Purpose: Document Accessibility & WCAG Compliance Kit - Comprehensive accessibility utilities for documents
 *
 * Upstream: Independent utility module for document accessibility operations
 * Downstream: ../backend/*, Document services, PDF processors, Compliance checkers, Remediation tools
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, pdf-lib, axe-core
 * Exports: 42 utility functions for PDF/UA compliance, tag structure, screen reader support, alt text, reading order, WCAG validation
 *
 * LLM Context: Production-ready document accessibility utilities for White Cross healthcare platform.
 * Provides PDF/UA compliance checking, accessibility tag structure creation, screen reader optimization,
 * alt text management, reading order validation, language tags, accessibility remediation, WCAG 2.1 AA/AAA
 * compliance, and HIPAA-compliant accessible document generation. Essential for meeting healthcare accessibility
 * requirements and ensuring documents are usable by all patients regardless of disability.
 */
import { Sequelize } from 'sequelize';
/**
 * Accessibility compliance level
 */
export type ComplianceLevel = 'A' | 'AA' | 'AAA';
/**
 * WCAG version
 */
export type WCAGVersion = '2.0' | '2.1' | '2.2';
/**
 * PDF/UA compliance result
 */
export interface PDFUAComplianceResult {
    compliant: boolean;
    version: string;
    errors: AccessibilityError[];
    warnings: AccessibilityWarning[];
    suggestions: AccessibilitySuggestion[];
    score?: number;
    testedAt: Date;
}
/**
 * Accessibility error
 */
export interface AccessibilityError {
    code: string;
    message: string;
    severity: 'critical' | 'major' | 'minor';
    wcagCriteria?: string;
    location?: DocumentLocation;
    impact: 'severe' | 'serious' | 'moderate' | 'minor';
    remediation?: string;
}
/**
 * Accessibility warning
 */
export interface AccessibilityWarning {
    code: string;
    message: string;
    wcagCriteria?: string;
    location?: DocumentLocation;
    suggestion?: string;
}
/**
 * Accessibility suggestion
 */
export interface AccessibilitySuggestion {
    code: string;
    message: string;
    benefit: string;
    effort: 'low' | 'medium' | 'high';
}
/**
 * Document location
 */
export interface DocumentLocation {
    page?: number;
    element?: string;
    xpath?: string;
    coordinates?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
/**
 * Tag structure element
 */
export interface TagStructureElement {
    type: StructureType;
    title?: string;
    lang?: string;
    alt?: string;
    actualText?: string;
    children?: TagStructureElement[];
    attributes?: Record<string, any>;
    id?: string;
}
/**
 * Structure types (PDF/UA tags)
 */
export type StructureType = 'Document' | 'Part' | 'Art' | 'Sect' | 'Div' | 'BlockQuote' | 'Caption' | 'TOC' | 'TOCI' | 'Index' | 'NonStruct' | 'Private' | 'P' | 'H' | 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6' | 'L' | 'LI' | 'Lbl' | 'LBody' | 'Table' | 'TR' | 'TH' | 'TD' | 'THead' | 'TBody' | 'TFoot' | 'Span' | 'Quote' | 'Note' | 'Reference' | 'BibEntry' | 'Code' | 'Link' | 'Annot' | 'Ruby' | 'RB' | 'RT' | 'RP' | 'Warichu' | 'WT' | 'WP' | 'Figure' | 'Formula' | 'Form';
/**
 * Screen reader optimization options
 */
export interface ScreenReaderOptions {
    enhanceHeadings?: boolean;
    addLandmarks?: boolean;
    optimizeTableHeaders?: boolean;
    addSkipLinks?: boolean;
    enhanceListStructure?: boolean;
    addImageDescriptions?: boolean;
}
/**
 * Alt text configuration
 */
export interface AltTextConfig {
    maxLength?: number;
    includeContext?: boolean;
    describeColor?: boolean;
    describePosition?: boolean;
    includeText?: boolean;
    format?: 'simple' | 'detailed' | 'technical';
}
/**
 * Alt text result
 */
export interface AltTextResult {
    imageId: string;
    altText: string;
    longDescription?: string;
    confidence?: number;
    source: 'manual' | 'ai' | 'ocr' | 'metadata';
    generatedAt: Date;
}
/**
 * Reading order element
 */
export interface ReadingOrderElement {
    id: string;
    type: string;
    order: number;
    content?: string;
    bounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    children?: ReadingOrderElement[];
}
/**
 * Reading order validation result
 */
export interface ReadingOrderValidation {
    valid: boolean;
    errors: Array<{
        element: string;
        issue: string;
        suggestion: string;
    }>;
    logicalOrder: string[];
    visualOrder: string[];
    divergences: number;
}
/**
 * Language tag
 */
export interface LanguageTag {
    code: string;
    region?: string;
    script?: string;
    variant?: string;
    primary: boolean;
}
/**
 * Document language info
 */
export interface DocumentLanguageInfo {
    primaryLanguage: string;
    languages: LanguageTag[];
    languageChanges: Array<{
        location: DocumentLocation;
        language: string;
    }>;
    detectedLanguages?: Record<string, number>;
}
/**
 * Accessibility checker options
 */
export interface AccessibilityCheckerOptions {
    wcagVersion: WCAGVersion;
    level: ComplianceLevel;
    checkPDFUA?: boolean;
    checkColorContrast?: boolean;
    checkKeyboardAccess?: boolean;
    checkSemanticStructure?: boolean;
    checkFormLabels?: boolean;
    checkAlternativeText?: boolean;
    checkHeadingOrder?: boolean;
    checkLanguage?: boolean;
    checkLinkText?: boolean;
    checkTableStructure?: boolean;
}
/**
 * Accessibility audit result
 */
export interface AccessibilityAuditResult {
    overallScore: number;
    level: ComplianceLevel;
    compliant: boolean;
    errors: AccessibilityError[];
    warnings: AccessibilityWarning[];
    passed: number;
    failed: number;
    incomplete: number;
    inapplicable: number;
    categories: {
        perceivable: AccessibilityCategoryResult;
        operable: AccessibilityCategoryResult;
        understandable: AccessibilityCategoryResult;
        robust: AccessibilityCategoryResult;
    };
    auditedAt: Date;
}
/**
 * Accessibility category result
 */
export interface AccessibilityCategoryResult {
    score: number;
    passed: number;
    failed: number;
    criteria: AccessibilityCriteriaResult[];
}
/**
 * Accessibility criteria result
 */
export interface AccessibilityCriteriaResult {
    id: string;
    level: ComplianceLevel;
    passed: boolean;
    description: string;
    impact?: string;
    techniques?: string[];
}
/**
 * Remediation action
 */
export interface RemediationAction {
    id: string;
    type: 'add' | 'modify' | 'remove';
    target: string;
    description: string;
    automated: boolean;
    priority: 'critical' | 'high' | 'medium' | 'low';
    wcagCriteria?: string;
    beforeValue?: any;
    afterValue?: any;
}
/**
 * Remediation plan
 */
export interface RemediationPlan {
    documentId: string;
    actions: RemediationAction[];
    estimatedEffort: number;
    automatedCount: number;
    manualCount: number;
    createdAt: Date;
}
/**
 * Color contrast check
 */
export interface ColorContrastCheck {
    foreground: string;
    background: string;
    ratio: number;
    passesAA: boolean;
    passesAAA: boolean;
    fontSize?: number;
    isBold?: boolean;
    location?: DocumentLocation;
}
/**
 * Keyboard accessibility check
 */
export interface KeyboardAccessibilityCheck {
    focusable: boolean;
    tabOrder?: number;
    hasKeyboardTrap?: boolean;
    hasVisibleFocus?: boolean;
    hasSkipLinks?: boolean;
    issues: string[];
}
/**
 * Form field accessibility
 */
export interface FormFieldAccessibility {
    fieldId: string;
    hasLabel: boolean;
    labelText?: string;
    hasDescription?: boolean;
    hasError?: boolean;
    errorMessage?: string;
    required?: boolean;
    tabIndex?: number;
    accessible: boolean;
    issues: string[];
}
/**
 * Table accessibility
 */
export interface TableAccessibility {
    hasHeaders: boolean;
    hasHeaderIds: boolean;
    hasScope: boolean;
    hasCaption: boolean;
    hasColgroup: boolean;
    headerCells: number;
    dataCells: number;
    accessible: boolean;
    issues: string[];
}
/**
 * Document accessibility audit model attributes
 */
export interface DocumentAccessibilityAuditAttributes {
    id: string;
    documentId: string;
    wcagVersion: string;
    complianceLevel: string;
    overallScore: number;
    compliant: boolean;
    errors: any;
    warnings: any;
    passed: number;
    failed: number;
    incomplete: number;
    pdfuaCompliant?: boolean;
    colorContrastIssues?: number;
    missingAltText?: number;
    headingOrderIssues?: number;
    languageIssues?: number;
    auditedAt: Date;
    auditedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates DocumentAccessibilityAudit model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentAccessibilityAuditAttributes>>} DocumentAccessibilityAudit model
 *
 * @example
 * ```typescript
 * const AuditModel = createDocumentAccessibilityAuditModel(sequelize);
 * const audit = await AuditModel.create({
 *   documentId: 'doc-123',
 *   wcagVersion: '2.1',
 *   complianceLevel: 'AA',
 *   overallScore: 85,
 *   compliant: true
 * });
 * ```
 */
export declare const createDocumentAccessibilityAuditModel: (sequelize: Sequelize) => any;
/**
 * Alt text registry model attributes
 */
export interface AltTextRegistryAttributes {
    id: string;
    documentId: string;
    imageId: string;
    altText: string;
    longDescription?: string;
    confidence?: number;
    source: string;
    reviewedBy?: string;
    reviewedAt?: Date;
    approved: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates AltTextRegistry model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<AltTextRegistryAttributes>>} AltTextRegistry model
 *
 * @example
 * ```typescript
 * const AltTextModel = createAltTextRegistryModel(sequelize);
 * const altText = await AltTextModel.create({
 *   documentId: 'doc-123',
 *   imageId: 'img-456',
 *   altText: 'Chest X-ray showing clear lungs',
 *   source: 'ai',
 *   confidence: 0.95
 * });
 * ```
 */
export declare const createAltTextRegistryModel: (sequelize: Sequelize) => any;
/**
 * 1. Checks PDF/UA compliance of document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<PDFUAComplianceResult>} Compliance check result
 *
 * @example
 * ```typescript
 * const result = await checkPDFUACompliance(pdfBuffer);
 * console.log('PDF/UA Compliant:', result.compliant);
 * console.log('Errors:', result.errors);
 * ```
 */
export declare const checkPDFUACompliance: (pdfBuffer: Buffer) => Promise<PDFUAComplianceResult>;
/**
 * 2. Validates PDF tag structure.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<{ valid: boolean; issues: string[] }>} Tag structure validation
 *
 * @example
 * ```typescript
 * const validation = await validatePDFTagStructure(pdfBuffer);
 * if (!validation.valid) {
 *   console.error('Tag structure issues:', validation.issues);
 * }
 * ```
 */
export declare const validatePDFTagStructure: (pdfBuffer: Buffer) => Promise<{
    valid: boolean;
    issues: string[];
}>;
/**
 * 3. Extracts tag structure from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<TagStructureElement[]>} Tag structure tree
 *
 * @example
 * ```typescript
 * const structure = await extractPDFTagStructure(pdfBuffer);
 * console.log('Root elements:', structure.length);
 * ```
 */
export declare const extractPDFTagStructure: (pdfBuffer: Buffer) => Promise<TagStructureElement[]>;
/**
 * 4. Creates accessible tag structure for PDF.
 *
 * @param {any[]} contentElements - Document content elements
 * @returns {TagStructureElement[]} Generated tag structure
 *
 * @example
 * ```typescript
 * const tags = createAccessibleTagStructure([
 *   { type: 'heading', level: 1, text: 'Medical Report' },
 *   { type: 'paragraph', text: 'Patient information...' }
 * ]);
 * ```
 */
export declare const createAccessibleTagStructure: (contentElements: any[]) => TagStructureElement[];
/**
 * 5. Embeds tag structure in PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {TagStructureElement[]} tagStructure - Tag structure to embed
 * @returns {Promise<Buffer>} PDF with embedded tags
 *
 * @example
 * ```typescript
 * const taggedPDF = await embedTagStructure(pdfBuffer, accessibleTags);
 * ```
 */
export declare const embedTagStructure: (pdfBuffer: Buffer, tagStructure: TagStructureElement[]) => Promise<Buffer>;
/**
 * 6. Optimizes document for screen readers.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @param {ScreenReaderOptions} [options] - Optimization options
 * @returns {Promise<Buffer>} Optimized document
 *
 * @example
 * ```typescript
 * const optimized = await optimizeForScreenReaders(pdfBuffer, {
 *   enhanceHeadings: true,
 *   addLandmarks: true,
 *   optimizeTableHeaders: true
 * });
 * ```
 */
export declare const optimizeForScreenReaders: (documentBuffer: Buffer, options?: ScreenReaderOptions) => Promise<Buffer>;
/**
 * 7. Adds ARIA landmarks to document structure.
 *
 * @param {TagStructureElement[]} structure - Document structure
 * @returns {TagStructureElement[]} Structure with landmarks
 *
 * @example
 * ```typescript
 * const withLandmarks = addARIALandmarks(documentStructure);
 * ```
 */
export declare const addARIALandmarks: (structure: TagStructureElement[]) => TagStructureElement[];
/**
 * 8. Enhances heading hierarchy for screen readers.
 *
 * @param {TagStructureElement[]} structure - Document structure
 * @returns {TagStructureElement[]} Structure with enhanced headings
 *
 * @example
 * ```typescript
 * const enhanced = enhanceHeadingHierarchy(structure);
 * ```
 */
export declare const enhanceHeadingHierarchy: (structure: TagStructureElement[]) => TagStructureElement[];
/**
 * 9. Validates heading order and hierarchy.
 *
 * @param {TagStructureElement[]} structure - Document structure
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const result = validateHeadingOrder(structure);
 * if (!result.valid) {
 *   console.error('Heading issues:', result.issues);
 * }
 * ```
 */
export declare const validateHeadingOrder: (structure: TagStructureElement[]) => {
    valid: boolean;
    issues: string[];
    headings: Array<{
        level: number;
        text?: string;
    }>;
};
/**
 * 10. Adds skip links to document navigation.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @param {Array<{ text: string; target: string }>} skipLinks - Skip link definitions
 * @returns {Promise<Buffer>} Document with skip links
 *
 * @example
 * ```typescript
 * const withSkipLinks = await addSkipLinks(pdfBuffer, [
 *   { text: 'Skip to main content', target: '#main' },
 *   { text: 'Skip to navigation', target: '#nav' }
 * ]);
 * ```
 */
export declare const addSkipLinks: (documentBuffer: Buffer, skipLinks: Array<{
    text: string;
    target: string;
}>) => Promise<Buffer>;
/**
 * 11. Generates alt text for image using AI.
 *
 * @param {Buffer} imageBuffer - Image buffer
 * @param {AltTextConfig} [config] - Alt text configuration
 * @returns {Promise<AltTextResult>} Generated alt text
 *
 * @example
 * ```typescript
 * const altText = await generateAltText(imageBuffer, {
 *   format: 'detailed',
 *   includeContext: true,
 *   maxLength: 125
 * });
 * console.log(altText.altText);
 * ```
 */
export declare const generateAltText: (imageBuffer: Buffer, config?: AltTextConfig) => Promise<AltTextResult>;
/**
 * 12. Validates alt text quality and compliance.
 *
 * @param {string} altText - Alt text to validate
 * @param {AltTextConfig} [config] - Validation configuration
 * @returns {Object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateAltText('Image of chest x-ray', { maxLength: 125 });
 * if (!validation.valid) {
 *   console.error(validation.issues);
 * }
 * ```
 */
export declare const validateAltText: (altText: string, config?: AltTextConfig) => {
    valid: boolean;
    issues: string[];
    suggestions: string[];
};
/**
 * 13. Extracts existing alt text from document.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @returns {Promise<Array<{ imageId: string; altText?: string; hasAlt: boolean }>>} Alt text inventory
 *
 * @example
 * ```typescript
 * const altTexts = await extractAltText(pdfBuffer);
 * const missing = altTexts.filter(img => !img.hasAlt);
 * console.log(`${missing.length} images missing alt text`);
 * ```
 */
export declare const extractAltText: (documentBuffer: Buffer) => Promise<Array<{
    imageId: string;
    altText?: string;
    hasAlt: boolean;
}>>;
/**
 * 14. Adds or updates alt text in document.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @param {Record<string, string>} altTextMap - Map of image IDs to alt text
 * @returns {Promise<Buffer>} Updated document
 *
 * @example
 * ```typescript
 * const updated = await setAltText(pdfBuffer, {
 *   'img1': 'Chest X-ray showing clear lungs',
 *   'img2': 'CT scan of brain showing normal anatomy'
 * });
 * ```
 */
export declare const setAltText: (documentBuffer: Buffer, altTextMap: Record<string, string>) => Promise<Buffer>;
/**
 * 15. Generates long descriptions for complex images.
 *
 * @param {Buffer} imageBuffer - Image buffer
 * @param {string} context - Image context
 * @returns {Promise<string>} Long description
 *
 * @example
 * ```typescript
 * const longDesc = await generateLongDescription(chartBuffer, 'Blood pressure chart');
 * ```
 */
export declare const generateLongDescription: (imageBuffer: Buffer, context: string) => Promise<string>;
/**
 * 16. Validates decorative vs informative image classification.
 *
 * @param {Buffer} imageBuffer - Image buffer
 * @param {string} [altText] - Existing alt text
 * @returns {Promise<{ decorative: boolean; confidence: number; reasoning: string }>} Classification
 *
 * @example
 * ```typescript
 * const classification = await classifyImageType(imageBuffer, altText);
 * if (classification.decorative) {
 *   // Use empty alt text
 * }
 * ```
 */
export declare const classifyImageType: (imageBuffer: Buffer, altText?: string) => Promise<{
    decorative: boolean;
    confidence: number;
    reasoning: string;
}>;
/**
 * 17. Extracts reading order from document.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @returns {Promise<ReadingOrderElement[]>} Reading order elements
 *
 * @example
 * ```typescript
 * const readingOrder = await extractReadingOrder(pdfBuffer);
 * console.log('Reading order:', readingOrder.map(e => e.type));
 * ```
 */
export declare const extractReadingOrder: (documentBuffer: Buffer) => Promise<ReadingOrderElement[]>;
/**
 * 18. Validates logical reading order.
 *
 * @param {ReadingOrderElement[]} elements - Reading order elements
 * @returns {ReadingOrderValidation} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateReadingOrder(elements);
 * if (!validation.valid) {
 *   console.error('Reading order issues:', validation.errors);
 * }
 * ```
 */
export declare const validateReadingOrder: (elements: ReadingOrderElement[]) => ReadingOrderValidation;
/**
 * 19. Corrects reading order based on visual layout.
 *
 * @param {ReadingOrderElement[]} elements - Current reading order
 * @returns {ReadingOrderElement[]} Corrected reading order
 *
 * @example
 * ```typescript
 * const corrected = correctReadingOrder(elements);
 * ```
 */
export declare const correctReadingOrder: (elements: ReadingOrderElement[]) => ReadingOrderElement[];
/**
 * 20. Adds logical reading order to PDF.
 *
 * @param {Buffer} pdfBuffer - PDF buffer
 * @param {ReadingOrderElement[]} readingOrder - Reading order definition
 * @returns {Promise<Buffer>} PDF with reading order
 *
 * @example
 * ```typescript
 * const ordered = await setReadingOrder(pdfBuffer, correctedOrder);
 * ```
 */
export declare const setReadingOrder: (pdfBuffer: Buffer, readingOrder: ReadingOrderElement[]) => Promise<Buffer>;
/**
 * 21. Detects document language.
 *
 * @param {Buffer | string} content - Document buffer or text
 * @returns {Promise<DocumentLanguageInfo>} Language information
 *
 * @example
 * ```typescript
 * const langInfo = await detectDocumentLanguage(pdfBuffer);
 * console.log('Primary language:', langInfo.primaryLanguage);
 * ```
 */
export declare const detectDocumentLanguage: (content: Buffer | string) => Promise<DocumentLanguageInfo>;
/**
 * 22. Sets document language metadata.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @param {string} languageCode - ISO 639-1 language code
 * @returns {Promise<Buffer>} Document with language set
 *
 * @example
 * ```typescript
 * const withLang = await setDocumentLanguage(pdfBuffer, 'en-US');
 * ```
 */
export declare const setDocumentLanguage: (documentBuffer: Buffer, languageCode: string) => Promise<Buffer>;
/**
 * 23. Adds language tags to text sections.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @param {Array<{ start: number; end: number; lang: string }>} languageRanges - Language range definitions
 * @returns {Promise<Buffer>} Document with language tags
 *
 * @example
 * ```typescript
 * const tagged = await addLanguageTags(pdfBuffer, [
 *   { start: 0, end: 100, lang: 'en' },
 *   { start: 101, end: 200, lang: 'es' }
 * ]);
 * ```
 */
export declare const addLanguageTags: (documentBuffer: Buffer, languageRanges: Array<{
    start: number;
    end: number;
    lang: string;
}>) => Promise<Buffer>;
/**
 * 24. Validates language tags completeness.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @returns {Promise<{ complete: boolean; missingTags: DocumentLocation[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateLanguageTags(pdfBuffer);
 * if (!validation.complete) {
 *   console.log('Missing language tags at:', validation.missingTags);
 * }
 * ```
 */
export declare const validateLanguageTags: (documentBuffer: Buffer) => Promise<{
    complete: boolean;
    missingTags: DocumentLocation[];
}>;
/**
 * 25. Runs comprehensive accessibility audit.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @param {AccessibilityCheckerOptions} options - Checker options
 * @returns {Promise<AccessibilityAuditResult>} Audit result
 *
 * @example
 * ```typescript
 * const audit = await runAccessibilityAudit(pdfBuffer, {
 *   wcagVersion: '2.1',
 *   level: 'AA',
 *   checkPDFUA: true,
 *   checkColorContrast: true
 * });
 * console.log('Overall score:', audit.overallScore);
 * ```
 */
export declare const runAccessibilityAudit: (documentBuffer: Buffer, options: AccessibilityCheckerOptions) => Promise<AccessibilityAuditResult>;
/**
 * 26. Checks WCAG 2.1 Level AA compliance.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @returns {Promise<AccessibilityAuditResult>} WCAG AA audit result
 *
 * @example
 * ```typescript
 * const wcagAudit = await checkWCAGCompliance(pdfBuffer);
 * if (!wcagAudit.compliant) {
 *   console.error('WCAG violations:', wcagAudit.errors);
 * }
 * ```
 */
export declare const checkWCAGCompliance: (documentBuffer: Buffer) => Promise<AccessibilityAuditResult>;
/**
 * 27. Checks color contrast ratios.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @param {number} [threshold] - Minimum contrast ratio (default: 4.5 for AA)
 * @returns {Promise<ColorContrastCheck[]>} Contrast check results
 *
 * @example
 * ```typescript
 * const contrastIssues = await checkColorContrast(pdfBuffer, 4.5);
 * const failing = contrastIssues.filter(c => !c.passesAA);
 * ```
 */
export declare const checkColorContrast: (documentBuffer: Buffer, threshold?: number) => Promise<ColorContrastCheck[]>;
/**
 * 28. Validates keyboard accessibility.
 *
 * @param {Buffer} documentBuffer - Document buffer (for interactive PDFs/forms)
 * @returns {Promise<KeyboardAccessibilityCheck>} Keyboard accessibility result
 *
 * @example
 * ```typescript
 * const keyboardCheck = await validateKeyboardAccessibility(pdfBuffer);
 * if (keyboardCheck.hasKeyboardTrap) {
 *   console.error('Keyboard trap detected!');
 * }
 * ```
 */
export declare const validateKeyboardAccessibility: (documentBuffer: Buffer) => Promise<KeyboardAccessibilityCheck>;
/**
 * 29. Validates form field accessibility.
 *
 * @param {Buffer} documentBuffer - Document buffer with forms
 * @returns {Promise<FormFieldAccessibility[]>} Form field accessibility results
 *
 * @example
 * ```typescript
 * const formChecks = await validateFormAccessibility(pdfBuffer);
 * const unlabeled = formChecks.filter(f => !f.hasLabel);
 * ```
 */
export declare const validateFormAccessibility: (documentBuffer: Buffer) => Promise<FormFieldAccessibility[]>;
/**
 * 30. Validates table accessibility.
 *
 * @param {Buffer} documentBuffer - Document buffer with tables
 * @returns {Promise<TableAccessibility[]>} Table accessibility results
 *
 * @example
 * ```typescript
 * const tableChecks = await validateTableAccessibility(pdfBuffer);
 * tableChecks.forEach(table => {
 *   if (!table.hasHeaders) {
 *     console.error('Table missing headers');
 *   }
 * });
 * ```
 */
export declare const validateTableAccessibility: (documentBuffer: Buffer) => Promise<TableAccessibility[]>;
/**
 * 31. Generates remediation plan for accessibility issues.
 *
 * @param {AccessibilityAuditResult} auditResult - Audit result
 * @param {string} documentId - Document identifier
 * @returns {RemediationPlan} Remediation plan
 *
 * @example
 * ```typescript
 * const plan = generateRemediationPlan(auditResult, 'doc-123');
 * console.log(`${plan.automatedCount} automated, ${plan.manualCount} manual fixes`);
 * ```
 */
export declare const generateRemediationPlan: (auditResult: AccessibilityAuditResult, documentId: string) => RemediationPlan;
/**
 * 32. Applies automated remediation fixes.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @param {RemediationPlan} plan - Remediation plan
 * @returns {Promise<{ buffer: Buffer; appliedActions: string[]; failedActions: string[] }>} Remediation result
 *
 * @example
 * ```typescript
 * const result = await applyAutomatedRemediation(pdfBuffer, plan);
 * console.log('Applied fixes:', result.appliedActions);
 * ```
 */
export declare const applyAutomatedRemediation: (documentBuffer: Buffer, plan: RemediationPlan) => Promise<{
    buffer: Buffer;
    appliedActions: string[];
    failedActions: string[];
}>;
/**
 * 33. Adds missing alt text to all images.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @param {boolean} [useAI] - Use AI to generate alt text
 * @returns {Promise<Buffer>} Document with alt text added
 *
 * @example
 * ```typescript
 * const remediated = await remediateAltText(pdfBuffer, true);
 * ```
 */
export declare const remediateAltText: (documentBuffer: Buffer, useAI?: boolean) => Promise<Buffer>;
/**
 * 34. Fixes heading hierarchy issues.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @returns {Promise<Buffer>} Document with corrected headings
 *
 * @example
 * ```typescript
 * const fixed = await fixHeadingHierarchy(pdfBuffer);
 * ```
 */
export declare const fixHeadingHierarchy: (documentBuffer: Buffer) => Promise<Buffer>;
/**
 * 35. Adds proper table structure and headers.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @returns {Promise<Buffer>} Document with accessible tables
 *
 * @example
 * ```typescript
 * const withTables = await remediateTableStructure(pdfBuffer);
 * ```
 */
export declare const remediateTableStructure: (documentBuffer: Buffer) => Promise<Buffer>;
/**
 * 36. Ensures proper document title.
 *
 * @param {Buffer} documentBuffer - Document buffer
 * @param {string} [title] - Document title (auto-detect if not provided)
 * @returns {Promise<Buffer>} Document with proper title
 *
 * @example
 * ```typescript
 * const titled = await ensureDocumentTitle(pdfBuffer, 'Medical Report - Patient #12345');
 * ```
 */
export declare const ensureDocumentTitle: (documentBuffer: Buffer, title?: string) => Promise<Buffer>;
/**
 * 37. Creates mock accessibility audit result.
 *
 * @param {Partial<AccessibilityAuditResult>} [overrides] - Property overrides
 * @returns {AccessibilityAuditResult} Mock audit result
 *
 * @example
 * ```typescript
 * const mockAudit = createMockAuditResult({
 *   overallScore: 85,
 *   compliant: true
 * });
 * ```
 */
export declare const createMockAuditResult: (overrides?: Partial<AccessibilityAuditResult>) => AccessibilityAuditResult;
/**
 * 38. Creates mock tag structure for testing.
 *
 * @param {number} [depth] - Structure depth
 * @returns {TagStructureElement[]} Mock tag structure
 */
export declare const createMockTagStructure: (depth?: number) => TagStructureElement[];
/**
 * 39. Creates mock remediation plan for testing.
 *
 * @param {number} [actionCount] - Number of actions
 * @returns {RemediationPlan} Mock remediation plan
 */
export declare const createMockRemediationPlan: (actionCount?: number) => RemediationPlan;
/**
 * 40. Validates accessibility error severity classification.
 *
 * @param {AccessibilityError[]} errors - Errors to validate
 * @returns {Object} Severity distribution
 *
 * @example
 * ```typescript
 * const distribution = validateErrorSeverity(auditResult.errors);
 * console.log('Critical:', distribution.critical);
 * ```
 */
export declare const validateErrorSeverity: (errors: AccessibilityError[]) => {
    critical: number;
    major: number;
    minor: number;
};
/**
 * 41. Generates accessibility compliance report.
 *
 * @param {AccessibilityAuditResult} auditResult - Audit result
 * @param {string} [format] - Report format
 * @returns {string} Formatted compliance report
 *
 * @example
 * ```typescript
 * const report = generateComplianceReport(auditResult, 'html');
 * ```
 */
export declare const generateComplianceReport: (auditResult: AccessibilityAuditResult, format?: string) => string;
/**
 * 42. Exports accessibility audit to various formats.
 *
 * @param {AccessibilityAuditResult} auditResult - Audit result
 * @param {string} format - Export format (json, csv, html, pdf)
 * @returns {Promise<Buffer | string>} Exported audit data
 *
 * @example
 * ```typescript
 * const csvReport = await exportAccessibilityAudit(auditResult, 'csv');
 * const htmlReport = await exportAccessibilityAudit(auditResult, 'html');
 * ```
 */
export declare const exportAccessibilityAudit: (auditResult: AccessibilityAuditResult, format: string) => Promise<Buffer | string>;
declare const _default: {
    checkPDFUACompliance: (pdfBuffer: Buffer) => Promise<PDFUAComplianceResult>;
    validatePDFTagStructure: (pdfBuffer: Buffer) => Promise<{
        valid: boolean;
        issues: string[];
    }>;
    extractPDFTagStructure: (pdfBuffer: Buffer) => Promise<TagStructureElement[]>;
    createAccessibleTagStructure: (contentElements: any[]) => TagStructureElement[];
    embedTagStructure: (pdfBuffer: Buffer, tagStructure: TagStructureElement[]) => Promise<Buffer>;
    optimizeForScreenReaders: (documentBuffer: Buffer, options?: ScreenReaderOptions) => Promise<Buffer>;
    addARIALandmarks: (structure: TagStructureElement[]) => TagStructureElement[];
    enhanceHeadingHierarchy: (structure: TagStructureElement[]) => TagStructureElement[];
    validateHeadingOrder: (structure: TagStructureElement[]) => {
        valid: boolean;
        issues: string[];
        headings: Array<{
            level: number;
            text?: string;
        }>;
    };
    addSkipLinks: (documentBuffer: Buffer, skipLinks: Array<{
        text: string;
        target: string;
    }>) => Promise<Buffer>;
    generateAltText: (imageBuffer: Buffer, config?: AltTextConfig) => Promise<AltTextResult>;
    validateAltText: (altText: string, config?: AltTextConfig) => {
        valid: boolean;
        issues: string[];
        suggestions: string[];
    };
    extractAltText: (documentBuffer: Buffer) => Promise<Array<{
        imageId: string;
        altText?: string;
        hasAlt: boolean;
    }>>;
    setAltText: (documentBuffer: Buffer, altTextMap: Record<string, string>) => Promise<Buffer>;
    generateLongDescription: (imageBuffer: Buffer, context: string) => Promise<string>;
    classifyImageType: (imageBuffer: Buffer, altText?: string) => Promise<{
        decorative: boolean;
        confidence: number;
        reasoning: string;
    }>;
    extractReadingOrder: (documentBuffer: Buffer) => Promise<ReadingOrderElement[]>;
    validateReadingOrder: (elements: ReadingOrderElement[]) => ReadingOrderValidation;
    correctReadingOrder: (elements: ReadingOrderElement[]) => ReadingOrderElement[];
    setReadingOrder: (pdfBuffer: Buffer, readingOrder: ReadingOrderElement[]) => Promise<Buffer>;
    detectDocumentLanguage: (content: Buffer | string) => Promise<DocumentLanguageInfo>;
    setDocumentLanguage: (documentBuffer: Buffer, languageCode: string) => Promise<Buffer>;
    addLanguageTags: (documentBuffer: Buffer, languageRanges: Array<{
        start: number;
        end: number;
        lang: string;
    }>) => Promise<Buffer>;
    validateLanguageTags: (documentBuffer: Buffer) => Promise<{
        complete: boolean;
        missingTags: DocumentLocation[];
    }>;
    runAccessibilityAudit: (documentBuffer: Buffer, options: AccessibilityCheckerOptions) => Promise<AccessibilityAuditResult>;
    checkWCAGCompliance: (documentBuffer: Buffer) => Promise<AccessibilityAuditResult>;
    checkColorContrast: (documentBuffer: Buffer, threshold?: number) => Promise<ColorContrastCheck[]>;
    validateKeyboardAccessibility: (documentBuffer: Buffer) => Promise<KeyboardAccessibilityCheck>;
    validateFormAccessibility: (documentBuffer: Buffer) => Promise<FormFieldAccessibility[]>;
    validateTableAccessibility: (documentBuffer: Buffer) => Promise<TableAccessibility[]>;
    generateRemediationPlan: (auditResult: AccessibilityAuditResult, documentId: string) => RemediationPlan;
    applyAutomatedRemediation: (documentBuffer: Buffer, plan: RemediationPlan) => Promise<{
        buffer: Buffer;
        appliedActions: string[];
        failedActions: string[];
    }>;
    remediateAltText: (documentBuffer: Buffer, useAI?: boolean) => Promise<Buffer>;
    fixHeadingHierarchy: (documentBuffer: Buffer) => Promise<Buffer>;
    remediateTableStructure: (documentBuffer: Buffer) => Promise<Buffer>;
    ensureDocumentTitle: (documentBuffer: Buffer, title?: string) => Promise<Buffer>;
    createMockAuditResult: (overrides?: Partial<AccessibilityAuditResult>) => AccessibilityAuditResult;
    createMockTagStructure: (depth?: number) => TagStructureElement[];
    createMockRemediationPlan: (actionCount?: number) => RemediationPlan;
    validateErrorSeverity: (errors: AccessibilityError[]) => {
        critical: number;
        major: number;
        minor: number;
    };
    generateComplianceReport: (auditResult: AccessibilityAuditResult, format?: string) => string;
    exportAccessibilityAudit: (auditResult: AccessibilityAuditResult, format: string) => Promise<Buffer | string>;
    createDocumentAccessibilityAuditModel: (sequelize: Sequelize) => any;
    createAltTextRegistryModel: (sequelize: Sequelize) => any;
};
export default _default;
//# sourceMappingURL=document-accessibility-kit.d.ts.map