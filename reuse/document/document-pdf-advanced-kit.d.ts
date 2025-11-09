/**
 * LOC: DOC-PDF-ADV-001
 * File: /reuse/document/document-pdf-advanced-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - pdf-lib (v1.17.x)
 *   - pdfjs-dist (v3.x)
 *   - sequelize (v6.x)
 *   - sharp (v0.32.x)
 *   - veraPDF (external validator)
 *
 * DOWNSTREAM (imported by):
 *   - Document processing services
 *   - Archival compliance modules
 *   - Print production controllers
 *   - Accessibility compliance services
 */
/**
 * File: /reuse/document/document-pdf-advanced-kit.ts
 * Locator: WC-UTL-PDFADV-001
 * Purpose: Advanced PDF Operations Kit - PDF/A conversion, linearization, portfolio creation, layer management, preflight validation, PDF/X standards, accessibility (PDF/UA)
 *
 * Upstream: @nestjs/common, pdf-lib, pdfjs-dist, sequelize, sharp, veraPDF
 * Downstream: Document processors, archival services, print controllers, accessibility handlers
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, pdf-lib 1.17.x, pdfjs-dist 3.x
 * Exports: 50 utility functions for advanced PDF operations exceeding Adobe Acrobat Pro
 *
 * LLM Context: Production-grade advanced PDF utilities for White Cross healthcare platform.
 * Provides PDF/A-1/2/3 conversion for long-term archival, linearization for fast web viewing,
 * PDF portfolio creation for bundled documents, layer management (OCG), preflight validation,
 * PDF/X printing standards compliance, and PDF/UA accessibility features. Essential for
 * regulatory compliance, archival storage, print production, and accessibility requirements
 * in healthcare documentation.
 */
import { Sequelize } from 'sequelize';
/**
 * PDF/A conformance levels
 */
export type PDFALevel = 'PDF/A-1a' | 'PDF/A-1b' | 'PDF/A-2a' | 'PDF/A-2b' | 'PDF/A-2u' | 'PDF/A-3a' | 'PDF/A-3b' | 'PDF/A-3u';
/**
 * PDF/X conformance levels for print production
 */
export type PDFXLevel = 'PDF/X-1a' | 'PDF/X-3' | 'PDF/X-4' | 'PDF/X-5g' | 'PDF/X-5n';
/**
 * PDF/UA conformance levels for accessibility
 */
export type PDFUALevel = 'PDF/UA-1' | 'PDF/UA-2';
/**
 * Layer visibility states
 */
export type LayerVisibility = 'visible' | 'hidden' | 'conditional';
/**
 * Portfolio layout types
 */
export type PortfolioLayout = 'tile' | 'list' | 'details' | 'cover' | 'navigator';
/**
 * Preflight severity levels
 */
export type PreflightSeverity = 'info' | 'warning' | 'error' | 'critical';
/**
 * PDF/A conversion configuration
 */
export interface PDFAConversionConfig {
    level: PDFALevel;
    embedFonts?: boolean;
    embedImages?: boolean;
    removeEncryption?: boolean;
    removeJavaScript?: boolean;
    removeExternalReferences?: boolean;
    outputIntent?: string;
    metadataXMP?: Record<string, any>;
    validateAfterConversion?: boolean;
}
/**
 * PDF/A validation result
 */
export interface PDFAValidationResult {
    valid: boolean;
    conformanceLevel: PDFALevel | null;
    errors: Array<{
        code: string;
        message: string;
        page?: number;
        severity: PreflightSeverity;
    }>;
    warnings: Array<{
        code: string;
        message: string;
        page?: number;
    }>;
    metadata?: {
        pageCount: number;
        fileSize: number;
        pdfVersion: string;
        hasEncryption: boolean;
        hasForms: boolean;
    };
}
/**
 * Linearization configuration
 */
export interface LinearizationConfig {
    optimizeForWeb?: boolean;
    compressionLevel?: number;
    objectStreams?: boolean;
    removeUnused?: boolean;
    optimizeImages?: boolean;
}
/**
 * Linearization result
 */
export interface LinearizationResult {
    success: boolean;
    originalSize: number;
    linearizedSize: number;
    compressionRatio: number;
    estimatedLoadTime: number;
    isLinearized: boolean;
}
/**
 * PDF layer (OCG) configuration
 */
export interface PDFLayer {
    id: string;
    name: string;
    visibility: LayerVisibility;
    locked?: boolean;
    printable?: boolean;
    order?: number;
    intent?: string[];
    parent?: string;
    children?: string[];
}
/**
 * Portfolio configuration
 */
export interface PortfolioConfig {
    name: string;
    description?: string;
    layout: PortfolioLayout;
    coverPage?: Buffer;
    initialDocument?: string;
    schema?: PortfolioSchema;
    colorScheme?: {
        primary: string;
        secondary: string;
        background: string;
    };
}
/**
 * Portfolio schema for custom metadata
 */
export interface PortfolioSchema {
    fields: Array<{
        name: string;
        displayName: string;
        type: 'text' | 'date' | 'number' | 'filename' | 'filesize';
        required?: boolean;
        sortable?: boolean;
        visible?: boolean;
    }>;
}
/**
 * Portfolio document entry
 */
export interface PortfolioDocument {
    id: string;
    filename: string;
    description?: string;
    data: Buffer;
    metadata?: Record<string, any>;
    folder?: string;
    order?: number;
}
/**
 * Preflight profile configuration
 */
export interface PreflightProfile {
    name: string;
    description?: string;
    checks: PreflightCheck[];
    fixups?: PreflightFixup[];
    standard?: PDFALevel | PDFXLevel | PDFUALevel;
}
/**
 * Preflight check definition
 */
export interface PreflightCheck {
    id: string;
    name: string;
    category: 'fonts' | 'colors' | 'images' | 'pages' | 'transparency' | 'accessibility' | 'metadata';
    severity: PreflightSeverity;
    description: string;
    enabled: boolean;
}
/**
 * Preflight fixup definition
 */
export interface PreflightFixup {
    id: string;
    name: string;
    description: string;
    auto: boolean;
    targetChecks: string[];
}
/**
 * Preflight report
 */
export interface PreflightReport {
    profileName: string;
    executedAt: Date;
    documentName: string;
    passed: boolean;
    errorCount: number;
    warningCount: number;
    infoCount: number;
    results: Array<{
        checkId: string;
        checkName: string;
        status: 'passed' | 'failed' | 'warning' | 'info';
        message: string;
        page?: number;
        severity: PreflightSeverity;
        fixable: boolean;
    }>;
    summary: string;
}
/**
 * PDF/X conversion configuration
 */
export interface PDFXConversionConfig {
    level: PDFXLevel;
    outputIntent: string;
    outputCondition: string;
    registryName?: string;
    trimBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    bleedBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    removeTransparency?: boolean;
    convertColors?: 'CMYK' | 'RGB' | 'Gray';
    embedFonts?: boolean;
}
/**
 * Accessibility structure
 */
export interface AccessibilityStructure {
    hasStructure: boolean;
    language?: string;
    title?: string;
    tagged: boolean;
    elementsCount: number;
    headingLevels: number[];
    hasFigures: boolean;
    hasTables: boolean;
    hasLists: boolean;
    hasLinks: boolean;
}
/**
 * Accessibility remediation options
 */
export interface AccessibilityRemediationOptions {
    autoTag?: boolean;
    detectHeadings?: boolean;
    detectTables?: boolean;
    detectLists?: boolean;
    addAltText?: boolean;
    setLanguage?: string;
    setTitle?: string;
    setReadingOrder?: boolean;
    addBookmarks?: boolean;
}
/**
 * Color profile information
 */
export interface ColorProfile {
    name: string;
    type: 'RGB' | 'CMYK' | 'Gray' | 'Lab';
    iccProfile?: Buffer;
    description?: string;
    version?: string;
}
/**
 * Output intent configuration
 */
export interface OutputIntent {
    identifier: string;
    condition: string;
    registryName: string;
    info?: string;
    profileData?: Buffer;
}
/**
 * PDF document model attributes
 */
export interface PdfDocumentAttributes {
    id: string;
    filename: string;
    originalFilename: string;
    fileSize: number;
    pageCount: number;
    pdfVersion: string;
    conformanceLevel?: string;
    isLinearized: boolean;
    hasLayers: boolean;
    isPortfolio: boolean;
    hasAccessibilityTags: boolean;
    language?: string;
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string[];
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
    encryptionLevel?: string;
    colorSpace?: string;
    outputIntent?: string;
    preflightStatus?: string;
    validationErrors?: Record<string, any>[];
    metadata?: Record<string, any>;
    storageLocation?: string;
    checksum: string;
    ownerId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * PDF layer model attributes
 */
export interface PdfLayerAttributes {
    id: string;
    documentId: string;
    name: string;
    visibility: LayerVisibility;
    locked: boolean;
    printable: boolean;
    order: number;
    intent?: string[];
    parentLayerId?: string;
    ocgId: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * PDF portfolio model attributes
 */
export interface PdfPortfolioAttributes {
    id: string;
    name: string;
    description?: string;
    layout: PortfolioLayout;
    documentCount: number;
    totalSize: number;
    schema?: Record<string, any>;
    colorScheme?: Record<string, any>;
    coverPageId?: string;
    initialDocumentId?: string;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates PdfDocument model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<PdfDocumentAttributes>>} PdfDocument model
 *
 * @example
 * ```typescript
 * const PdfDocModel = createPdfDocumentModel(sequelize);
 * const pdfDoc = await PdfDocModel.create({
 *   filename: 'medical-record-001.pdf',
 *   fileSize: 1024000,
 *   pageCount: 25,
 *   pdfVersion: '1.7',
 *   conformanceLevel: 'PDF/A-2b',
 *   isLinearized: true
 * });
 * ```
 */
export declare const createPdfDocumentModel: (sequelize: Sequelize) => any;
/**
 * Creates PdfLayer model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<PdfLayerAttributes>>} PdfLayer model
 *
 * @example
 * ```typescript
 * const LayerModel = createPdfLayerModel(sequelize);
 * const layer = await LayerModel.create({
 *   documentId: 'pdf-uuid',
 *   name: 'Annotations',
 *   visibility: 'visible',
 *   locked: false,
 *   printable: true,
 *   order: 1
 * });
 * ```
 */
export declare const createPdfLayerModel: (sequelize: Sequelize) => any;
/**
 * Creates PdfPortfolio model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<PdfPortfolioAttributes>>} PdfPortfolio model
 *
 * @example
 * ```typescript
 * const PortfolioModel = createPdfPortfolioModel(sequelize);
 * const portfolio = await PortfolioModel.create({
 *   name: 'Patient Medical Records',
 *   description: 'Complete medical history bundle',
 *   layout: 'details',
 *   documentCount: 15,
 *   totalSize: 52428800
 * });
 * ```
 */
export declare const createPdfPortfolioModel: (sequelize: Sequelize) => any;
/**
 * 1. Converts PDF to PDF/A-1b (basic archival standard).
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {Partial<PDFAConversionConfig>} [config] - Conversion options
 * @returns {Promise<Buffer>} PDF/A-1b compliant PDF
 *
 * @example
 * ```typescript
 * const pdfaBuffer = await convertToPDFA1b(pdfBuffer, {
 *   embedFonts: true,
 *   removeJavaScript: true,
 *   validateAfterConversion: true
 * });
 * ```
 */
export declare const convertToPDFA1b: (pdfBuffer: Buffer, config?: Partial<PDFAConversionConfig>) => Promise<Buffer>;
/**
 * 2. Converts PDF to PDF/A-2b (ISO 19005-2, supports JPEG2000).
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {Partial<PDFAConversionConfig>} [config] - Conversion options
 * @returns {Promise<Buffer>} PDF/A-2b compliant PDF
 *
 * @example
 * ```typescript
 * const pdfa2 = await convertToPDFA2b(pdfBuffer, {
 *   embedFonts: true,
 *   embedImages: true,
 *   outputIntent: 'sRGB IEC61966-2.1'
 * });
 * ```
 */
export declare const convertToPDFA2b: (pdfBuffer: Buffer, config?: Partial<PDFAConversionConfig>) => Promise<Buffer>;
/**
 * 3. Converts PDF to PDF/A-3b (allows embedded files).
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {Partial<PDFAConversionConfig>} [config] - Conversion options
 * @returns {Promise<Buffer>} PDF/A-3b compliant PDF
 *
 * @example
 * ```typescript
 * const pdfa3 = await convertToPDFA3b(pdfBuffer, {
 *   embedFonts: true,
 *   metadataXMP: { creator: 'WhiteCross', subject: 'Medical Records' }
 * });
 * ```
 */
export declare const convertToPDFA3b: (pdfBuffer: Buffer, config?: Partial<PDFAConversionConfig>) => Promise<Buffer>;
/**
 * 4. Validates PDF against PDF/A standard.
 *
 * @param {Buffer} pdfBuffer - PDF to validate
 * @param {PDFALevel} level - Target PDF/A level
 * @returns {Promise<PDFAValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePDFA(pdfBuffer, 'PDF/A-2b');
 * if (!validation.valid) {
 *   validation.errors.forEach(err => console.error(err.message));
 * }
 * ```
 */
export declare const validatePDFA: (pdfBuffer: Buffer, level: PDFALevel) => Promise<PDFAValidationResult>;
/**
 * 5. Embeds color profile for PDF/A compliance.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {ColorProfile} profile - Color profile to embed
 * @returns {Promise<Buffer>} PDF with embedded color profile
 *
 * @example
 * ```typescript
 * const withProfile = await embedColorProfile(pdfBuffer, {
 *   name: 'sRGB IEC61966-2.1',
 *   type: 'RGB',
 *   iccProfile: sRGBProfileBuffer
 * });
 * ```
 */
export declare const embedColorProfile: (pdfBuffer: Buffer, profile: ColorProfile) => Promise<Buffer>;
/**
 * 6. Adds output intent to PDF for archival.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {OutputIntent} intent - Output intent configuration
 * @returns {Promise<Buffer>} PDF with output intent
 *
 * @example
 * ```typescript
 * const withIntent = await addOutputIntent(pdfBuffer, {
 *   identifier: 'sRGB',
 *   condition: 'sRGB IEC61966-2.1',
 *   registryName: 'http://www.color.org'
 * });
 * ```
 */
export declare const addOutputIntent: (pdfBuffer: Buffer, intent: OutputIntent) => Promise<Buffer>;
/**
 * 7. Removes non-archival elements from PDF.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @returns {Promise<Buffer>} Cleaned PDF
 *
 * @example
 * ```typescript
 * const cleaned = await removeNonArchivalElements(pdfBuffer);
 * // Removes JavaScript, encryption, external references
 * ```
 */
export declare const removeNonArchivalElements: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 8. Converts PDF/A to different conformance level.
 *
 * @param {Buffer} pdfaBuffer - Input PDF/A document
 * @param {PDFALevel} fromLevel - Source conformance level
 * @param {PDFALevel} toLevel - Target conformance level
 * @returns {Promise<Buffer>} Converted PDF/A
 *
 * @example
 * ```typescript
 * const upgraded = await convertPDFALevel(pdfa1bBuffer, 'PDF/A-1b', 'PDF/A-3b');
 * ```
 */
export declare const convertPDFALevel: (pdfaBuffer: Buffer, fromLevel: PDFALevel, toLevel: PDFALevel) => Promise<Buffer>;
/**
 * 9. Linearizes PDF for fast web viewing.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {LinearizationConfig} [config] - Linearization options
 * @returns {Promise<{ buffer: Buffer; result: LinearizationResult }>} Linearized PDF and metrics
 *
 * @example
 * ```typescript
 * const { buffer, result } = await linearizePDF(pdfBuffer, {
 *   optimizeForWeb: true,
 *   compressionLevel: 9,
 *   optimizeImages: true
 * });
 * console.log('Load time:', result.estimatedLoadTime, 'ms');
 * ```
 */
export declare const linearizePDF: (pdfBuffer: Buffer, config?: LinearizationConfig) => Promise<{
    buffer: Buffer;
    result: LinearizationResult;
}>;
/**
 * 10. Checks if PDF is linearized.
 *
 * @param {Buffer} pdfBuffer - PDF to check
 * @returns {Promise<boolean>} True if linearized
 *
 * @example
 * ```typescript
 * const isLinear = await isLinearized(pdfBuffer);
 * if (!isLinear) {
 *   await linearizePDF(pdfBuffer);
 * }
 * ```
 */
export declare const isLinearized: (pdfBuffer: Buffer) => Promise<boolean>;
/**
 * 11. Optimizes PDF object streams for smaller size.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @returns {Promise<Buffer>} PDF with optimized object streams
 *
 * @example
 * ```typescript
 * const optimized = await optimizeObjectStreams(pdfBuffer);
 * // Reduces file size by compressing object streams
 * ```
 */
export declare const optimizeObjectStreams: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 12. Removes unused objects from PDF.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @returns {Promise<{ buffer: Buffer; removedCount: number }>} Cleaned PDF and count
 *
 * @example
 * ```typescript
 * const { buffer, removedCount } = await removeUnusedObjects(pdfBuffer);
 * console.log('Removed', removedCount, 'unused objects');
 * ```
 */
export declare const removeUnusedObjects: (pdfBuffer: Buffer) => Promise<{
    buffer: Buffer;
    removedCount: number;
}>;
/**
 * 13. Optimizes images in PDF for web viewing.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {number} [quality] - JPEG quality (0-100)
 * @param {number} [maxDPI] - Maximum DPI for images
 * @returns {Promise<Buffer>} PDF with optimized images
 *
 * @example
 * ```typescript
 * const optimized = await optimizeImages(pdfBuffer, 85, 150);
 * // Reduces image quality/resolution for faster web loading
 * ```
 */
export declare const optimizeImages: (pdfBuffer: Buffer, quality?: number, maxDPI?: number) => Promise<Buffer>;
/**
 * 14. Calculates estimated web load time.
 *
 * @param {Buffer} pdfBuffer - PDF to analyze
 * @param {number} [bandwidthMbps] - Network bandwidth in Mbps (default: 10)
 * @returns {Promise<{ firstPageMs: number; fullDocumentMs: number; isLinearized: boolean }>} Load time estimates
 *
 * @example
 * ```typescript
 * const loadTime = await estimateLoadTime(pdfBuffer, 5);
 * console.log('First page:', loadTime.firstPageMs, 'ms');
 * console.log('Full doc:', loadTime.fullDocumentMs, 'ms');
 * ```
 */
export declare const estimateLoadTime: (pdfBuffer: Buffer, bandwidthMbps?: number) => Promise<{
    firstPageMs: number;
    fullDocumentMs: number;
    isLinearized: boolean;
}>;
/**
 * 15. Creates PDF portfolio from multiple documents.
 *
 * @param {PortfolioDocument[]} documents - Documents to include
 * @param {PortfolioConfig} config - Portfolio configuration
 * @returns {Promise<Buffer>} PDF portfolio
 *
 * @example
 * ```typescript
 * const portfolio = await createPortfolio([
 *   { id: '1', filename: 'report.pdf', data: pdfBuffer1 },
 *   { id: '2', filename: 'lab-results.pdf', data: pdfBuffer2 }
 * ], {
 *   name: 'Patient Records',
 *   layout: 'details',
 *   description: 'Complete medical documentation'
 * });
 * ```
 */
export declare const createPortfolio: (documents: PortfolioDocument[], config: PortfolioConfig) => Promise<Buffer>;
/**
 * 16. Adds document to existing portfolio.
 *
 * @param {Buffer} portfolioBuffer - Existing portfolio
 * @param {PortfolioDocument} document - Document to add
 * @returns {Promise<Buffer>} Updated portfolio
 *
 * @example
 * ```typescript
 * const updated = await addDocumentToPortfolio(portfolioBuffer, {
 *   id: '3',
 *   filename: 'prescription.pdf',
 *   data: prescriptionPdf,
 *   metadata: { date: '2025-01-15', type: 'Prescription' }
 * });
 * ```
 */
export declare const addDocumentToPortfolio: (portfolioBuffer: Buffer, document: PortfolioDocument) => Promise<Buffer>;
/**
 * 17. Extracts document from portfolio.
 *
 * @param {Buffer} portfolioBuffer - Portfolio buffer
 * @param {string} documentId - Document ID to extract
 * @returns {Promise<Buffer>} Extracted document
 *
 * @example
 * ```typescript
 * const extracted = await extractFromPortfolio(portfolioBuffer, 'document-2');
 * ```
 */
export declare const extractFromPortfolio: (portfolioBuffer: Buffer, documentId: string) => Promise<Buffer>;
/**
 * 18. Lists all documents in portfolio.
 *
 * @param {Buffer} portfolioBuffer - Portfolio buffer
 * @returns {Promise<PortfolioDocument[]>} List of documents (without data)
 *
 * @example
 * ```typescript
 * const docs = await listPortfolioDocuments(portfolioBuffer);
 * docs.forEach(doc => console.log(doc.filename, doc.metadata));
 * ```
 */
export declare const listPortfolioDocuments: (portfolioBuffer: Buffer) => Promise<PortfolioDocument[]>;
/**
 * 19. Sets portfolio layout.
 *
 * @param {Buffer} portfolioBuffer - Portfolio buffer
 * @param {PortfolioLayout} layout - Layout type
 * @returns {Promise<Buffer>} Portfolio with new layout
 *
 * @example
 * ```typescript
 * const updated = await setPortfolioLayout(portfolioBuffer, 'details');
 * ```
 */
export declare const setPortfolioLayout: (portfolioBuffer: Buffer, layout: PortfolioLayout) => Promise<Buffer>;
/**
 * 20. Adds custom schema to portfolio.
 *
 * @param {Buffer} portfolioBuffer - Portfolio buffer
 * @param {PortfolioSchema} schema - Custom metadata schema
 * @returns {Promise<Buffer>} Portfolio with schema
 *
 * @example
 * ```typescript
 * const withSchema = await addPortfolioSchema(portfolioBuffer, {
 *   fields: [
 *     { name: 'documentDate', displayName: 'Date', type: 'date', sortable: true },
 *     { name: 'department', displayName: 'Department', type: 'text' }
 *   ]
 * });
 * ```
 */
export declare const addPortfolioSchema: (portfolioBuffer: Buffer, schema: PortfolioSchema) => Promise<Buffer>;
/**
 * 21. Sets portfolio cover page.
 *
 * @param {Buffer} portfolioBuffer - Portfolio buffer
 * @param {Buffer} coverPagePdf - Cover page PDF
 * @returns {Promise<Buffer>} Portfolio with cover page
 *
 * @example
 * ```typescript
 * const withCover = await setPortfolioCoverPage(portfolioBuffer, coverPdf);
 * ```
 */
export declare const setPortfolioCoverPage: (portfolioBuffer: Buffer, coverPagePdf: Buffer) => Promise<Buffer>;
/**
 * 22. Removes document from portfolio.
 *
 * @param {Buffer} portfolioBuffer - Portfolio buffer
 * @param {string} documentId - Document ID to remove
 * @returns {Promise<Buffer>} Updated portfolio
 *
 * @example
 * ```typescript
 * const updated = await removeFromPortfolio(portfolioBuffer, 'obsolete-doc-id');
 * ```
 */
export declare const removeFromPortfolio: (portfolioBuffer: Buffer, documentId: string) => Promise<Buffer>;
/**
 * 23. Creates layer in PDF.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {PDFLayer} layer - Layer configuration
 * @returns {Promise<Buffer>} PDF with new layer
 *
 * @example
 * ```typescript
 * const withLayer = await createLayer(pdfBuffer, {
 *   id: 'annotations',
 *   name: 'Medical Annotations',
 *   visibility: 'visible',
 *   printable: true,
 *   intent: ['View']
 * });
 * ```
 */
export declare const createLayer: (pdfBuffer: Buffer, layer: PDFLayer) => Promise<Buffer>;
/**
 * 24. Lists all layers in PDF.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @returns {Promise<PDFLayer[]>} Array of layers
 *
 * @example
 * ```typescript
 * const layers = await listLayers(pdfBuffer);
 * layers.forEach(layer => console.log(layer.name, layer.visibility));
 * ```
 */
export declare const listLayers: (pdfBuffer: Buffer) => Promise<PDFLayer[]>;
/**
 * 25. Sets layer visibility.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {string} layerId - Layer ID
 * @param {LayerVisibility} visibility - Visibility state
 * @returns {Promise<Buffer>} PDF with updated layer
 *
 * @example
 * ```typescript
 * const updated = await setLayerVisibility(pdfBuffer, 'annotations', 'hidden');
 * ```
 */
export declare const setLayerVisibility: (pdfBuffer: Buffer, layerId: string, visibility: LayerVisibility) => Promise<Buffer>;
/**
 * 26. Removes layer from PDF.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {string} layerId - Layer ID to remove
 * @returns {Promise<Buffer>} PDF without layer
 *
 * @example
 * ```typescript
 * const cleaned = await removeLayer(pdfBuffer, 'temp-annotations');
 * ```
 */
export declare const removeLayer: (pdfBuffer: Buffer, layerId: string) => Promise<Buffer>;
/**
 * 27. Locks layer to prevent editing.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {string} layerId - Layer ID
 * @param {boolean} locked - Lock state
 * @returns {Promise<Buffer>} PDF with locked layer
 *
 * @example
 * ```typescript
 * const locked = await lockLayer(pdfBuffer, 'approved-annotations', true);
 * ```
 */
export declare const lockLayer: (pdfBuffer: Buffer, layerId: string, locked: boolean) => Promise<Buffer>;
/**
 * 28. Flattens specific layer into page content.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {string} layerId - Layer ID to flatten
 * @returns {Promise<Buffer>} PDF with flattened layer
 *
 * @example
 * ```typescript
 * const flattened = await flattenLayer(pdfBuffer, 'annotations');
 * // Makes layer content permanent and removes layer structure
 * ```
 */
export declare const flattenLayer: (pdfBuffer: Buffer, layerId: string) => Promise<Buffer>;
/**
 * 29. Creates layer hierarchy.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {PDFLayer[]} layers - Layers with parent/child relationships
 * @returns {Promise<Buffer>} PDF with layer hierarchy
 *
 * @example
 * ```typescript
 * const hierarchical = await createLayerHierarchy(pdfBuffer, [
 *   { id: 'medical', name: 'Medical', visibility: 'visible' },
 *   { id: 'labs', name: 'Lab Results', visibility: 'visible', parent: 'medical' },
 *   { id: 'imaging', name: 'Imaging', visibility: 'visible', parent: 'medical' }
 * ]);
 * ```
 */
export declare const createLayerHierarchy: (pdfBuffer: Buffer, layers: PDFLayer[]) => Promise<Buffer>;
/**
 * 30. Runs preflight check on PDF.
 *
 * @param {Buffer} pdfBuffer - PDF to validate
 * @param {PreflightProfile} profile - Preflight profile
 * @returns {Promise<PreflightReport>} Validation report
 *
 * @example
 * ```typescript
 * const report = await runPreflightCheck(pdfBuffer, {
 *   name: 'PDF/A-2b Validation',
 *   checks: [
 *     { id: 'fonts', name: 'All fonts embedded', category: 'fonts', severity: 'error', enabled: true },
 *     { id: 'colors', name: 'Color profile present', category: 'colors', severity: 'error', enabled: true }
 *   ]
 * });
 * ```
 */
export declare const runPreflightCheck: (pdfBuffer: Buffer, profile: PreflightProfile) => Promise<PreflightReport>;
/**
 * 31. Validates font embedding.
 *
 * @param {Buffer} pdfBuffer - PDF to check
 * @returns {Promise<{ allEmbedded: boolean; unembeddedFonts: string[] }>} Font embedding status
 *
 * @example
 * ```typescript
 * const { allEmbedded, unembeddedFonts } = await validateFontEmbedding(pdfBuffer);
 * if (!allEmbedded) {
 *   console.error('Missing fonts:', unembeddedFonts);
 * }
 * ```
 */
export declare const validateFontEmbedding: (pdfBuffer: Buffer) => Promise<{
    allEmbedded: boolean;
    unembeddedFonts: string[];
}>;
/**
 * 32. Checks PDF for transparency.
 *
 * @param {Buffer} pdfBuffer - PDF to check
 * @returns {Promise<{ hasTransparency: boolean; pages: number[] }>} Transparency information
 *
 * @example
 * ```typescript
 * const { hasTransparency, pages } = await checkTransparency(pdfBuffer);
 * if (hasTransparency) {
 *   console.log('Transparency on pages:', pages);
 * }
 * ```
 */
export declare const checkTransparency: (pdfBuffer: Buffer) => Promise<{
    hasTransparency: boolean;
    pages: number[];
}>;
/**
 * 33. Validates color spaces in PDF.
 *
 * @param {Buffer} pdfBuffer - PDF to check
 * @param {Array<'RGB' | 'CMYK' | 'Gray'>} [allowedSpaces] - Allowed color spaces
 * @returns {Promise<{ valid: boolean; colorSpaces: string[]; violations: Array<{ page: number; space: string }> }>} Color validation
 *
 * @example
 * ```typescript
 * const validation = await validateColorSpaces(pdfBuffer, ['CMYK']);
 * // Ensures print-ready CMYK-only document
 * ```
 */
export declare const validateColorSpaces: (pdfBuffer: Buffer, allowedSpaces?: Array<"RGB" | "CMYK" | "Gray">) => Promise<{
    valid: boolean;
    colorSpaces: string[];
    violations: Array<{
        page: number;
        space: string;
    }>;
}>;
/**
 * 34. Checks PDF page sizes and trim boxes.
 *
 * @param {Buffer} pdfBuffer - PDF to check
 * @returns {Promise<Array<{ page: number; width: number; height: number; trimBox?: any }>>} Page size information
 *
 * @example
 * ```typescript
 * const pageSizes = await checkPageSizes(pdfBuffer);
 * pageSizes.forEach(p => console.log(`Page ${p.page}: ${p.width}x${p.height}`));
 * ```
 */
export declare const checkPageSizes: (pdfBuffer: Buffer) => Promise<Array<{
    page: number;
    width: number;
    height: number;
    trimBox?: any;
}>>;
/**
 * 35. Validates image resolution in PDF.
 *
 * @param {Buffer} pdfBuffer - PDF to check
 * @param {number} minDPI - Minimum required DPI
 * @returns {Promise<{ valid: boolean; lowResImages: Array<{ page: number; dpi: number }> }>} Image resolution validation
 *
 * @example
 * ```typescript
 * const { valid, lowResImages } = await validateImageResolution(pdfBuffer, 300);
 * // Ensures all images are at least 300 DPI for print quality
 * ```
 */
export declare const validateImageResolution: (pdfBuffer: Buffer, minDPI: number) => Promise<{
    valid: boolean;
    lowResImages: Array<{
        page: number;
        dpi: number;
    }>;
}>;
/**
 * 36. Detects and reports PDF metadata issues.
 *
 * @param {Buffer} pdfBuffer - PDF to check
 * @returns {Promise<{ issues: Array<{ field: string; issue: string; severity: PreflightSeverity }> }>} Metadata issues
 *
 * @example
 * ```typescript
 * const { issues } = await checkMetadataCompliance(pdfBuffer);
 * issues.forEach(i => console.log(`${i.field}: ${i.issue}`));
 * ```
 */
export declare const checkMetadataCompliance: (pdfBuffer: Buffer) => Promise<{
    issues: Array<{
        field: string;
        issue: string;
        severity: PreflightSeverity;
    }>;
}>;
/**
 * 37. Applies automatic fixes to common PDF issues.
 *
 * @param {Buffer} pdfBuffer - PDF to fix
 * @param {PreflightReport} report - Preflight report with issues
 * @returns {Promise<{ buffer: Buffer; fixedCount: number; unfixedCount: number }>} Fixed PDF and counts
 *
 * @example
 * ```typescript
 * const report = await runPreflightCheck(pdfBuffer, profile);
 * const { buffer, fixedCount } = await applyPreflightFixes(pdfBuffer, report);
 * console.log('Fixed', fixedCount, 'issues');
 * ```
 */
export declare const applyPreflightFixes: (pdfBuffer: Buffer, report: PreflightReport) => Promise<{
    buffer: Buffer;
    fixedCount: number;
    unfixedCount: number;
}>;
/**
 * 38. Converts PDF to PDF/X-1a (CMYK print standard).
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {Partial<PDFXConversionConfig>} config - Conversion configuration
 * @returns {Promise<Buffer>} PDF/X-1a compliant PDF
 *
 * @example
 * ```typescript
 * const printReady = await convertToPDFX1a(pdfBuffer, {
 *   outputIntent: 'CGATS TR 001',
 *   outputCondition: 'SWOP (Coated), 20%, GCR, Medium',
 *   convertColors: 'CMYK',
 *   removeTransparency: true
 * });
 * ```
 */
export declare const convertToPDFX1a: (pdfBuffer: Buffer, config: Partial<PDFXConversionConfig>) => Promise<Buffer>;
/**
 * 39. Converts PDF to PDF/X-4 (supports transparency).
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {Partial<PDFXConversionConfig>} config - Conversion configuration
 * @returns {Promise<Buffer>} PDF/X-4 compliant PDF
 *
 * @example
 * ```typescript
 * const pdfx4 = await convertToPDFX4(pdfBuffer, {
 *   outputIntent: 'Coated FOGRA39',
 *   outputCondition: 'ISO 12647-2:2004/AM 1, FOGRA39',
 *   embedFonts: true
 * });
 * ```
 */
export declare const convertToPDFX4: (pdfBuffer: Buffer, config: Partial<PDFXConversionConfig>) => Promise<Buffer>;
/**
 * 40. Sets trim box and bleed box for printing.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {PDFXConversionConfig['trimBox']} trimBox - Trim box dimensions
 * @param {PDFXConversionConfig['bleedBox']} bleedBox - Bleed box dimensions
 * @returns {Promise<Buffer>} PDF with print boxes
 *
 * @example
 * ```typescript
 * const withBoxes = await setTrimAndBleedBoxes(pdfBuffer,
 *   { x: 0, y: 0, width: 612, height: 792 }, // 8.5x11 inches
 *   { x: -9, y: -9, width: 630, height: 810 } // 0.125" bleed
 * );
 * ```
 */
export declare const setTrimAndBleedBoxes: (pdfBuffer: Buffer, trimBox: PDFXConversionConfig["trimBox"], bleedBox: PDFXConversionConfig["bleedBox"]) => Promise<Buffer>;
/**
 * 41. Converts all colors to CMYK.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {string} [iccProfile] - CMYK ICC profile
 * @returns {Promise<Buffer>} CMYK-only PDF
 *
 * @example
 * ```typescript
 * const cmyk = await convertToCMYK(pdfBuffer, 'CoatedFOGRA39.icc');
 * // Converts all RGB/Lab colors to CMYK for print
 * ```
 */
export declare const convertToCMYK: (pdfBuffer: Buffer, iccProfile?: string) => Promise<Buffer>;
/**
 * 42. Flattens transparency for print.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {number} [resolution] - Flattening resolution in DPI
 * @returns {Promise<Buffer>} PDF without transparency
 *
 * @example
 * ```typescript
 * const flattened = await flattenTransparency(pdfBuffer, 300);
 * // Required for PDF/X-1a compliance
 * ```
 */
export declare const flattenTransparency: (pdfBuffer: Buffer, resolution?: number) => Promise<Buffer>;
/**
 * 43. Validates PDF/X compliance.
 *
 * @param {Buffer} pdfBuffer - PDF to validate
 * @param {PDFXLevel} level - Target PDF/X level
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePDFX(pdfBuffer, 'PDF/X-4');
 * if (!validation.valid) {
 *   console.error('PDF/X errors:', validation.errors);
 * }
 * ```
 */
export declare const validatePDFX: (pdfBuffer: Buffer, level: PDFXLevel) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * 44. Generates print production report.
 *
 * @param {Buffer} pdfBuffer - PDF to analyze
 * @returns {Promise<{ colorSpaces: string[]; fonts: string[]; transparency: boolean; boxes: any; outputIntent?: string }>} Print report
 *
 * @example
 * ```typescript
 * const report = await generatePrintProductionReport(pdfBuffer);
 * console.log('Print production analysis:', report);
 * ```
 */
export declare const generatePrintProductionReport: (pdfBuffer: Buffer) => Promise<{
    colorSpaces: string[];
    fonts: string[];
    transparency: boolean;
    boxes: any;
    outputIntent?: string;
}>;
/**
 * 45. Converts PDF to PDF/UA (accessible PDF).
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {AccessibilityRemediationOptions} [options] - Remediation options
 * @returns {Promise<Buffer>} PDF/UA compliant PDF
 *
 * @example
 * ```typescript
 * const accessible = await convertToPDFUA(pdfBuffer, {
 *   autoTag: true,
 *   detectHeadings: true,
 *   setLanguage: 'en-US',
 *   setTitle: 'Medical Report'
 * });
 * ```
 */
export declare const convertToPDFUA: (pdfBuffer: Buffer, options?: AccessibilityRemediationOptions) => Promise<Buffer>;
/**
 * 46. Analyzes PDF accessibility structure.
 *
 * @param {Buffer} pdfBuffer - PDF to analyze
 * @returns {Promise<AccessibilityStructure>} Accessibility analysis
 *
 * @example
 * ```typescript
 * const structure = await analyzeAccessibility(pdfBuffer);
 * console.log('Tagged:', structure.tagged);
 * console.log('Language:', structure.language);
 * console.log('Elements:', structure.elementsCount);
 * ```
 */
export declare const analyzeAccessibility: (pdfBuffer: Buffer) => Promise<AccessibilityStructure>;
/**
 * 47. Adds alternative text to images.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @param {Map<number, string>} altTextMap - Map of image index to alt text
 * @returns {Promise<Buffer>} PDF with alt text
 *
 * @example
 * ```typescript
 * const withAlt = await addAltTextToImages(pdfBuffer, new Map([
 *   [0, 'Chest X-ray showing clear lungs'],
 *   [1, 'ECG results from 2025-01-15']
 * ]));
 * ```
 */
export declare const addAltTextToImages: (pdfBuffer: Buffer, altTextMap: Map<number, string>) => Promise<Buffer>;
/**
 * 48. Sets document reading order.
 *
 * @param {Buffer} pdfBuffer - Input PDF
 * @returns {Promise<Buffer>} PDF with logical reading order
 *
 * @example
 * ```typescript
 * const ordered = await setReadingOrder(pdfBuffer);
 * // Ensures correct tab order for screen readers
 * ```
 */
export declare const setReadingOrder: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 49. Validates PDF/UA compliance.
 *
 * @param {Buffer} pdfBuffer - PDF to validate
 * @returns {Promise<{ valid: boolean; issues: Array<{ type: string; message: string; severity: PreflightSeverity }> }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePDFUA(pdfBuffer);
 * if (!validation.valid) {
 *   validation.issues.forEach(i => console.error(i.message));
 * }
 * ```
 */
export declare const validatePDFUA: (pdfBuffer: Buffer) => Promise<{
    valid: boolean;
    issues: Array<{
        type: string;
        message: string;
        severity: PreflightSeverity;
    }>;
}>;
/**
 * 50. Generates accessibility compliance report.
 *
 * @param {Buffer} pdfBuffer - PDF to analyze
 * @returns {Promise<{ compliant: boolean; wcagLevel?: string; issues: string[]; structure: AccessibilityStructure }>} Accessibility report
 *
 * @example
 * ```typescript
 * const report = await generateAccessibilityReport(pdfBuffer);
 * console.log('WCAG compliance:', report.wcagLevel);
 * console.log('Issues:', report.issues.length);
 * ```
 */
export declare const generateAccessibilityReport: (pdfBuffer: Buffer) => Promise<{
    compliant: boolean;
    wcagLevel?: string;
    issues: string[];
    structure: AccessibilityStructure;
}>;
declare const _default: {
    createPdfDocumentModel: (sequelize: Sequelize) => any;
    createPdfLayerModel: (sequelize: Sequelize) => any;
    createPdfPortfolioModel: (sequelize: Sequelize) => any;
    convertToPDFA1b: (pdfBuffer: Buffer, config?: Partial<PDFAConversionConfig>) => Promise<Buffer>;
    convertToPDFA2b: (pdfBuffer: Buffer, config?: Partial<PDFAConversionConfig>) => Promise<Buffer>;
    convertToPDFA3b: (pdfBuffer: Buffer, config?: Partial<PDFAConversionConfig>) => Promise<Buffer>;
    validatePDFA: (pdfBuffer: Buffer, level: PDFALevel) => Promise<PDFAValidationResult>;
    embedColorProfile: (pdfBuffer: Buffer, profile: ColorProfile) => Promise<Buffer>;
    addOutputIntent: (pdfBuffer: Buffer, intent: OutputIntent) => Promise<Buffer>;
    removeNonArchivalElements: (pdfBuffer: Buffer) => Promise<Buffer>;
    convertPDFALevel: (pdfaBuffer: Buffer, fromLevel: PDFALevel, toLevel: PDFALevel) => Promise<Buffer>;
    linearizePDF: (pdfBuffer: Buffer, config?: LinearizationConfig) => Promise<{
        buffer: Buffer;
        result: LinearizationResult;
    }>;
    isLinearized: (pdfBuffer: Buffer) => Promise<boolean>;
    optimizeObjectStreams: (pdfBuffer: Buffer) => Promise<Buffer>;
    removeUnusedObjects: (pdfBuffer: Buffer) => Promise<{
        buffer: Buffer;
        removedCount: number;
    }>;
    optimizeImages: (pdfBuffer: Buffer, quality?: number, maxDPI?: number) => Promise<Buffer>;
    estimateLoadTime: (pdfBuffer: Buffer, bandwidthMbps?: number) => Promise<{
        firstPageMs: number;
        fullDocumentMs: number;
        isLinearized: boolean;
    }>;
    createPortfolio: (documents: PortfolioDocument[], config: PortfolioConfig) => Promise<Buffer>;
    addDocumentToPortfolio: (portfolioBuffer: Buffer, document: PortfolioDocument) => Promise<Buffer>;
    extractFromPortfolio: (portfolioBuffer: Buffer, documentId: string) => Promise<Buffer>;
    listPortfolioDocuments: (portfolioBuffer: Buffer) => Promise<PortfolioDocument[]>;
    setPortfolioLayout: (portfolioBuffer: Buffer, layout: PortfolioLayout) => Promise<Buffer>;
    addPortfolioSchema: (portfolioBuffer: Buffer, schema: PortfolioSchema) => Promise<Buffer>;
    setPortfolioCoverPage: (portfolioBuffer: Buffer, coverPagePdf: Buffer) => Promise<Buffer>;
    removeFromPortfolio: (portfolioBuffer: Buffer, documentId: string) => Promise<Buffer>;
    createLayer: (pdfBuffer: Buffer, layer: PDFLayer) => Promise<Buffer>;
    listLayers: (pdfBuffer: Buffer) => Promise<PDFLayer[]>;
    setLayerVisibility: (pdfBuffer: Buffer, layerId: string, visibility: LayerVisibility) => Promise<Buffer>;
    removeLayer: (pdfBuffer: Buffer, layerId: string) => Promise<Buffer>;
    lockLayer: (pdfBuffer: Buffer, layerId: string, locked: boolean) => Promise<Buffer>;
    flattenLayer: (pdfBuffer: Buffer, layerId: string) => Promise<Buffer>;
    createLayerHierarchy: (pdfBuffer: Buffer, layers: PDFLayer[]) => Promise<Buffer>;
    runPreflightCheck: (pdfBuffer: Buffer, profile: PreflightProfile) => Promise<PreflightReport>;
    validateFontEmbedding: (pdfBuffer: Buffer) => Promise<{
        allEmbedded: boolean;
        unembeddedFonts: string[];
    }>;
    checkTransparency: (pdfBuffer: Buffer) => Promise<{
        hasTransparency: boolean;
        pages: number[];
    }>;
    validateColorSpaces: (pdfBuffer: Buffer, allowedSpaces?: Array<"RGB" | "CMYK" | "Gray">) => Promise<{
        valid: boolean;
        colorSpaces: string[];
        violations: Array<{
            page: number;
            space: string;
        }>;
    }>;
    checkPageSizes: (pdfBuffer: Buffer) => Promise<Array<{
        page: number;
        width: number;
        height: number;
        trimBox?: any;
    }>>;
    validateImageResolution: (pdfBuffer: Buffer, minDPI: number) => Promise<{
        valid: boolean;
        lowResImages: Array<{
            page: number;
            dpi: number;
        }>;
    }>;
    checkMetadataCompliance: (pdfBuffer: Buffer) => Promise<{
        issues: Array<{
            field: string;
            issue: string;
            severity: PreflightSeverity;
        }>;
    }>;
    applyPreflightFixes: (pdfBuffer: Buffer, report: PreflightReport) => Promise<{
        buffer: Buffer;
        fixedCount: number;
        unfixedCount: number;
    }>;
    convertToPDFX1a: (pdfBuffer: Buffer, config: Partial<PDFXConversionConfig>) => Promise<Buffer>;
    convertToPDFX4: (pdfBuffer: Buffer, config: Partial<PDFXConversionConfig>) => Promise<Buffer>;
    setTrimAndBleedBoxes: (pdfBuffer: Buffer, trimBox: PDFXConversionConfig["trimBox"], bleedBox: PDFXConversionConfig["bleedBox"]) => Promise<Buffer>;
    convertToCMYK: (pdfBuffer: Buffer, iccProfile?: string) => Promise<Buffer>;
    flattenTransparency: (pdfBuffer: Buffer, resolution?: number) => Promise<Buffer>;
    validatePDFX: (pdfBuffer: Buffer, level: PDFXLevel) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    generatePrintProductionReport: (pdfBuffer: Buffer) => Promise<{
        colorSpaces: string[];
        fonts: string[];
        transparency: boolean;
        boxes: any;
        outputIntent?: string;
    }>;
    convertToPDFUA: (pdfBuffer: Buffer, options?: AccessibilityRemediationOptions) => Promise<Buffer>;
    analyzeAccessibility: (pdfBuffer: Buffer) => Promise<AccessibilityStructure>;
    addAltTextToImages: (pdfBuffer: Buffer, altTextMap: Map<number, string>) => Promise<Buffer>;
    setReadingOrder: (pdfBuffer: Buffer) => Promise<Buffer>;
    validatePDFUA: (pdfBuffer: Buffer) => Promise<{
        valid: boolean;
        issues: Array<{
            type: string;
            message: string;
            severity: PreflightSeverity;
        }>;
    }>;
    generateAccessibilityReport: (pdfBuffer: Buffer) => Promise<{
        compliant: boolean;
        wcagLevel?: string;
        issues: string[];
        structure: AccessibilityStructure;
    }>;
};
export default _default;
//# sourceMappingURL=document-pdf-advanced-kit.d.ts.map