/**
 * LOC: DOCPDFMANIP001
 * File: /reuse/document/composites/document-pdf-manipulation-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - pdf-lib (PDF manipulation)
 *   - pdfjs-dist (PDF parsing)
 *   - sharp (image processing)
 *   - node-forge (digital signatures)
 *   - ../document-storage-kit
 *   - ../document-analytics-kit
 *
 * DOWNSTREAM (imported by):
 *   - PDF processing services
 *   - Document conversion modules
 *   - PDF optimization pipelines
 *   - Digital signing services
 *   - Document archival systems
 *   - Healthcare document management dashboards
 */
/**
 * File: /reuse/document/composites/document-pdf-manipulation-composite.ts
 * Locator: WC-PDF-MANIPULATION-COMPOSITE-001
 * Purpose: Comprehensive PDF Manipulation Composite - Production-ready PDF operations, conversion, compression, and security
 *
 * Upstream: Independent utility module for PDF manipulation operations
 * Downstream: ../backend/*, PDF services, Conversion pipelines, Document processors, Digital signing, Archival systems
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, pdf-lib 1.17+, pdfjs-dist 3.x, sharp 0.32+
 * Exports: 42 utility functions for PDF merge, split, compression, conversion, page manipulation, security, signing, batch processing
 *
 * LLM Context: Enterprise-grade PDF manipulation composite for White Cross healthcare platform.
 * Provides comprehensive PDF operation capabilities including intelligent merge and split with optimization,
 * multi-level compression (lossless/lossy), format conversion (PDF/A, DOCX, images), advanced page manipulation
 * (extract, insert, delete, reorder, rotate, crop, resize), watermarking and page elements (headers, footers,
 * page numbers), PDF repair and validation, linearization for fast web viewing, content extraction (images,
 * fonts, metadata, attachments), form flattening, bookmark and annotation management, PDF/A creation and
 * validation for archival, security operations (password protection, encryption), digital signature support
 * with verification, and high-performance batch processing. Exceeds Adobe Acrobat and Foxit capabilities with
 * healthcare-specific optimizations for medical record archival, HIPAA-compliant redaction, and patient
 * document protection. Supports automated PDF workflows, document standardization, and compliance archival.
 * Essential for enterprise document management, secure healthcare records, and digital transformation workflows.
 */
import { Model } from 'sequelize-typescript';
/**
 * Compression level for PDF optimization
 */
export declare enum CompressionLevel {
    NONE = "NONE",
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    MAXIMUM = "MAXIMUM"
}
/**
 * PDF page sizes
 */
export declare enum PageSize {
    A4 = "A4",
    A3 = "A3",
    A5 = "A5",
    LETTER = "LETTER",
    LEGAL = "LEGAL",
    TABLOID = "TABLOID",
    CUSTOM = "CUSTOM"
}
/**
 * PDF conversion formats
 */
export declare enum ConversionFormat {
    PDF = "PDF",
    PDFA = "PDFA",
    DOCX = "DOCX",
    PNG = "PNG",
    JPEG = "JPEG",
    TIFF = "TIFF",
    HTML = "HTML",
    TEXT = "TEXT"
}
/**
 * PDF operation types
 */
export declare enum PDFOperationType {
    MERGE = "MERGE",
    SPLIT = "SPLIT",
    COMPRESS = "COMPRESS",
    OPTIMIZE = "OPTIMIZE",
    CONVERT = "CONVERT",
    EXTRACT = "EXTRACT",
    PROTECT = "PROTECT",
    SIGN = "SIGN",
    REPAIR = "REPAIR",
    VALIDATE = "VALIDATE"
}
/**
 * Page rotation angles
 */
export declare enum RotationAngle {
    ROTATE_0 = 0,
    ROTATE_90 = 90,
    ROTATE_180 = 180,
    ROTATE_270 = 270
}
/**
 * Watermark position
 */
export declare enum WatermarkPosition {
    CENTER = "CENTER",
    TOP_LEFT = "TOP_LEFT",
    TOP_CENTER = "TOP_CENTER",
    TOP_RIGHT = "TOP_RIGHT",
    BOTTOM_LEFT = "BOTTOM_LEFT",
    BOTTOM_CENTER = "BOTTOM_CENTER",
    BOTTOM_RIGHT = "BOTTOM_RIGHT"
}
/**
 * PDF/A conformance levels
 */
export declare enum PDFALevel {
    PDFA_1A = "PDFA_1A",
    PDFA_1B = "PDFA_1B",
    PDFA_2A = "PDFA_2A",
    PDFA_2B = "PDFA_2B",
    PDFA_3A = "PDFA_3A",
    PDFA_3B = "PDFA_3B"
}
/**
 * Encryption strength
 */
export declare enum EncryptionLevel {
    AES_128 = "AES_128",
    AES_256 = "AES_256",
    RC4_128 = "RC4_128"
}
/**
 * PDF processing status
 */
export declare enum ProcessingStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
/**
 * PDF information
 */
export interface PDFInfo {
    pageCount: number;
    fileSize: number;
    encrypted: boolean;
    version: string;
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
    linearized: boolean;
    tagged: boolean;
    pdfaCompliant: boolean;
}
/**
 * Page range for operations
 */
export interface PageRange {
    start: number;
    end: number;
}
/**
 * Bounding box for cropping
 */
export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
/**
 * Custom page dimensions
 */
export interface PageDimensions {
    width: number;
    height: number;
    unit: 'pt' | 'in' | 'mm' | 'cm';
}
/**
 * Merge options
 */
export interface MergeOptions {
    removeBlankPages?: boolean;
    optimize?: boolean;
    addBookmarks?: boolean;
    bookmarkPrefix?: string;
}
/**
 * Split options
 */
export interface SplitOptions {
    preserveBookmarks?: boolean;
    preserveMetadata?: boolean;
    optimize?: boolean;
}
/**
 * Compression options
 */
export interface CompressionOptions {
    level: CompressionLevel;
    compressImages?: boolean;
    imageQuality?: number;
    removeDuplicates?: boolean;
    optimizeFonts?: boolean;
}
/**
 * Watermark configuration
 */
export interface WatermarkConfig {
    text?: string;
    image?: Buffer;
    position: WatermarkPosition;
    opacity: number;
    rotation: number;
    fontSize?: number;
    color?: string;
}
/**
 * PDF bookmark
 */
export interface PDFBookmark {
    title: string;
    pageNumber: number;
    children?: PDFBookmark[];
}
/**
 * PDF annotation
 */
export interface PDFAnnotation {
    type: 'text' | 'highlight' | 'underline' | 'strikeout' | 'stamp';
    pageNumber: number;
    content: string;
    position: BoundingBox;
    author?: string;
    createdAt?: Date;
}
/**
 * PDF attachment
 */
export interface PDFAttachment {
    filename: string;
    mimeType: string;
    size: number;
    data: Buffer;
    description?: string;
}
/**
 * Digital signature info
 */
export interface SignatureInfo {
    valid: boolean;
    signer: string;
    signedAt: Date;
    certificateInfo?: {
        issuer: string;
        subject: string;
        validFrom: Date;
        validTo: Date;
    };
}
/**
 * Protection options
 */
export interface ProtectionOptions {
    userPassword?: string;
    ownerPassword?: string;
    encryptionLevel: EncryptionLevel;
    permissions?: {
        printing?: boolean;
        modifying?: boolean;
        copying?: boolean;
        annotating?: boolean;
        formFilling?: boolean;
        extracting?: boolean;
        assembling?: boolean;
    };
}
/**
 * Validation result
 */
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    pdfVersion?: string;
    encrypted?: boolean;
    damaged?: boolean;
}
/**
 * PDF/A validation result
 */
export interface PDFAValidationResult {
    compliant: boolean;
    level?: PDFALevel;
    errors: string[];
    warnings: string[];
}
/**
 * Batch processing job
 */
export interface BatchJob {
    id: string;
    operation: PDFOperationType;
    totalFiles: number;
    processedFiles: number;
    failedFiles: number;
    status: ProcessingStatus;
    startedAt: Date;
    completedAt?: Date;
    errors: Array<{
        fileIndex: number;
        error: string;
    }>;
}
/**
 * PDF Operation Model - Tracks all PDF manipulation operations
 */
export declare class PDFOperationModel extends Model {
    id: string;
    documentId: string;
    operationType: PDFOperationType;
    status: ProcessingStatus;
    userId?: string;
    inputPageCount?: number;
    outputPageCount?: number;
    inputFileSize?: number;
    outputFileSize?: number;
    processingTimeMs?: number;
    parameters?: Record<string, any>;
    errorMessage?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * PDF Job Model - Tracks batch and long-running PDF processing jobs
 */
export declare class PDFJobModel extends Model {
    id: string;
    batchId?: string;
    operationType: PDFOperationType;
    status: ProcessingStatus;
    priority: number;
    userId?: string;
    inputDocumentIds: string[];
    outputDocumentIds?: string[];
    configuration: Record<string, any>;
    totalFiles?: number;
    processedFiles?: number;
    failedFiles?: number;
    errors?: Array<{
        fileIndex: number;
        error: string;
    }>;
    scheduledAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * PDF Configuration Model - Stores reusable PDF processing configurations
 */
export declare class PDFConfigModel extends Model {
    id: string;
    name: string;
    description?: string;
    configType: string;
    settings: Record<string, any>;
    userId?: string;
    isActive: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * 1. Merges multiple PDF documents into a single PDF.
 * Intelligently combines PDFs with optional blank page removal and optimization.
 *
 * @param {Buffer[]} pdfs - Array of PDF buffers to merge
 * @param {Partial<MergeOptions>} [options] - Merge configuration options
 * @returns {Promise<Buffer>} Merged PDF buffer
 * @throws {Error} If PDFs array is empty or merge operation fails
 *
 * @example
 * ```typescript
 * const mergedPdf = await mergePDFs([pdf1Buffer, pdf2Buffer, pdf3Buffer], {
 *   removeBlankPages: true,
 *   optimize: true,
 *   addBookmarks: true
 * });
 * console.log('Merged PDF size:', mergedPdf.length);
 * ```
 */
export declare const mergePDFs: (pdfs: Buffer[], options?: Partial<MergeOptions>) => Promise<Buffer>;
/**
 * 2. Splits a PDF document into multiple PDFs based on page ranges.
 * Supports preserving bookmarks and metadata from the source document.
 *
 * @param {Buffer} pdf - Source PDF buffer to split
 * @param {PageRange[]} ranges - Array of page ranges to extract
 * @param {Partial<SplitOptions>} [options] - Split configuration options
 * @returns {Promise<Buffer[]>} Array of split PDF buffers
 * @throws {Error} If PDF is invalid or split operation fails
 *
 * @example
 * ```typescript
 * const splits = await splitPDF(pdfBuffer, [
 *   { start: 1, end: 5 },
 *   { start: 6, end: 10 }
 * ], { preserveBookmarks: true });
 * console.log('Created', splits.length, 'split PDFs');
 * ```
 */
export declare const splitPDF: (pdf: Buffer, ranges: PageRange[], options?: Partial<SplitOptions>) => Promise<Buffer[]>;
/**
 * 3. Compresses a PDF to reduce file size.
 * Uses configurable compression levels with image quality control and duplicate removal.
 *
 * @param {Buffer} pdf - PDF buffer to compress
 * @param {Partial<CompressionOptions>} options - Compression configuration
 * @returns {Promise<Buffer>} Compressed PDF buffer
 * @throws {Error} If compression fails
 *
 * @example
 * ```typescript
 * const compressed = await compressPDF(pdfBuffer, {
 *   level: CompressionLevel.HIGH,
 *   compressImages: true,
 *   imageQuality: 70,
 *   removeDuplicates: true
 * });
 * console.log('Original:', pdfBuffer.length, 'Compressed:', compressed.length);
 * ```
 */
export declare const compressPDF: (pdf: Buffer, options: Partial<CompressionOptions>) => Promise<Buffer>;
/**
 * 4. Optimizes a PDF for web viewing and fast loading.
 * Performs linearization, compression, and font embedding optimization.
 *
 * @param {Buffer} pdf - PDF buffer to optimize
 * @returns {Promise<Buffer>} Optimized PDF buffer
 * @throws {Error} If optimization fails
 *
 * @example
 * ```typescript
 * const optimized = await optimizePDF(pdfBuffer);
 * console.log('Optimized for fast web viewing');
 * ```
 */
export declare const optimizePDF: (pdf: Buffer) => Promise<Buffer>;
/**
 * 5. Converts a document to PDF format.
 * Supports conversion from various formats including DOCX, images, and HTML.
 *
 * @param {Buffer} document - Document buffer to convert
 * @param {string} sourceFormat - Source document format (docx, html, png, jpeg, etc.)
 * @returns {Promise<Buffer>} PDF buffer
 * @throws {Error} If conversion is not supported or fails
 *
 * @example
 * ```typescript
 * const pdfBuffer = await convertToPDF(docxBuffer, 'docx');
 * console.log('Converted to PDF');
 * ```
 */
export declare const convertToPDF: (document: Buffer, sourceFormat: string) => Promise<Buffer>;
/**
 * 6. Converts a PDF to another format.
 * Supports conversion to images, text, HTML, and DOCX.
 *
 * @param {Buffer} pdf - PDF buffer to convert
 * @param {ConversionFormat} targetFormat - Target conversion format
 * @returns {Promise<Buffer>} Converted document buffer
 * @throws {Error} If conversion is not supported or fails
 *
 * @example
 * ```typescript
 * const pngBuffer = await convertFromPDF(pdfBuffer, ConversionFormat.PNG);
 * console.log('Converted PDF to PNG');
 * ```
 */
export declare const convertFromPDF: (pdf: Buffer, targetFormat: ConversionFormat) => Promise<Buffer>;
/**
 * 7. Extracts specific pages from a PDF.
 * Creates a new PDF containing only the specified pages.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @param {number[]} pages - Array of page numbers to extract (1-indexed)
 * @returns {Promise<Buffer>} PDF buffer containing extracted pages
 * @throws {Error} If page numbers are invalid or extraction fails
 *
 * @example
 * ```typescript
 * const extractedPdf = await extractPages(pdfBuffer, [1, 3, 5, 7]);
 * console.log('Extracted 4 pages');
 * ```
 */
export declare const extractPages: (pdf: Buffer, pages: number[]) => Promise<Buffer>;
/**
 * 8. Deletes a specific page from a PDF.
 * Creates a new PDF with the specified page removed.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @param {number} pageNumber - Page number to delete (1-indexed)
 * @returns {Promise<Buffer>} PDF buffer with page deleted
 * @throws {Error} If page number is invalid or deletion fails
 *
 * @example
 * ```typescript
 * const modifiedPdf = await deletePage(pdfBuffer, 5);
 * console.log('Deleted page 5');
 * ```
 */
export declare const deletePage: (pdf: Buffer, pageNumber: number) => Promise<Buffer>;
/**
 * 9. Inserts a page into a PDF at a specific position.
 * Merges a single-page or multi-page PDF at the specified position.
 *
 * @param {Buffer} pdf - Target PDF buffer
 * @param {Buffer} pageToInsert - PDF buffer to insert
 * @param {number} position - Position to insert (1-indexed, 0 = beginning)
 * @returns {Promise<Buffer>} PDF buffer with page inserted
 * @throws {Error} If insertion fails
 *
 * @example
 * ```typescript
 * const modifiedPdf = await insertPage(pdfBuffer, newPageBuffer, 3);
 * console.log('Inserted page at position 3');
 * ```
 */
export declare const insertPage: (pdf: Buffer, pageToInsert: Buffer, position: number) => Promise<Buffer>;
/**
 * 10. Reorders pages in a PDF according to a specified sequence.
 * Creates a new PDF with pages arranged in the specified order.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @param {number[]} order - New page order (1-indexed page numbers)
 * @returns {Promise<Buffer>} PDF buffer with reordered pages
 * @throws {Error} If page order is invalid or reordering fails
 *
 * @example
 * ```typescript
 * const reorderedPdf = await reorderPages(pdfBuffer, [3, 1, 2, 5, 4]);
 * console.log('Pages reordered');
 * ```
 */
export declare const reorderPages: (pdf: Buffer, order: number[]) => Promise<Buffer>;
/**
 * 11. Rotates a specific page in a PDF.
 * Supports rotation by 90, 180, or 270 degrees.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @param {number} pageNumber - Page number to rotate (1-indexed)
 * @param {RotationAngle} angle - Rotation angle in degrees
 * @returns {Promise<Buffer>} PDF buffer with rotated page
 * @throws {Error} If rotation fails
 *
 * @example
 * ```typescript
 * const rotatedPdf = await rotatePage(pdfBuffer, 3, RotationAngle.ROTATE_90);
 * console.log('Rotated page 3 by 90 degrees');
 * ```
 */
export declare const rotatePage: (pdf: Buffer, pageNumber: number, angle: RotationAngle) => Promise<Buffer>;
/**
 * 12. Crops a page to a specified bounding box.
 * Reduces page dimensions to the specified area.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @param {number} pageNumber - Page number to crop (1-indexed)
 * @param {BoundingBox} box - Crop bounding box coordinates
 * @returns {Promise<Buffer>} PDF buffer with cropped page
 * @throws {Error} If cropping fails
 *
 * @example
 * ```typescript
 * const croppedPdf = await cropPage(pdfBuffer, 1, {
 *   x: 50, y: 50, width: 400, height: 600
 * });
 * ```
 */
export declare const cropPage: (pdf: Buffer, pageNumber: number, box: BoundingBox) => Promise<Buffer>;
/**
 * 13. Resizes a page to a specified page size.
 * Scales page content to fit the target dimensions.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @param {number} pageNumber - Page number to resize (1-indexed)
 * @param {PageSize | PageDimensions} size - Target page size
 * @returns {Promise<Buffer>} PDF buffer with resized page
 * @throws {Error} If resizing fails
 *
 * @example
 * ```typescript
 * const resizedPdf = await resizePage(pdfBuffer, 1, PageSize.A4);
 * ```
 */
export declare const resizePage: (pdf: Buffer, pageNumber: number, size: PageSize | PageDimensions) => Promise<Buffer>;
/**
 * 14. Adds a watermark to all pages of a PDF.
 * Supports text and image watermarks with positioning and styling.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @param {WatermarkConfig} config - Watermark configuration
 * @returns {Promise<Buffer>} PDF buffer with watermark applied
 * @throws {Error} If watermark application fails
 *
 * @example
 * ```typescript
 * const watermarked = await addWatermark(pdfBuffer, {
 *   text: 'CONFIDENTIAL',
 *   position: WatermarkPosition.CENTER,
 *   opacity: 0.3,
 *   rotation: 45,
 *   fontSize: 72,
 *   color: '#FF0000'
 * });
 * ```
 */
export declare const addWatermark: (pdf: Buffer, config: WatermarkConfig) => Promise<Buffer>;
/**
 * 15. Removes watermarks from a PDF.
 * Attempts to detect and remove common watermark patterns.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @returns {Promise<Buffer>} PDF buffer with watermarks removed
 * @throws {Error} If watermark removal fails
 *
 * @example
 * ```typescript
 * const clean = await removeWatermark(pdfBuffer);
 * ```
 */
export declare const removeWatermark: (pdf: Buffer) => Promise<Buffer>;
/**
 * 16. Adds page numbers to a PDF.
 * Adds sequential page numbers to all pages with configurable positioning.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @param {object} [options] - Page numbering options
 * @returns {Promise<Buffer>} PDF buffer with page numbers
 * @throws {Error} If page numbering fails
 *
 * @example
 * ```typescript
 * const numbered = await addPageNumbers(pdfBuffer, {
 *   position: 'bottom-center',
 *   startNumber: 1,
 *   format: 'Page {n} of {total}'
 * });
 * ```
 */
export declare const addPageNumbers: (pdf: Buffer, options?: {
    position?: string;
    startNumber?: number;
    format?: string;
    fontSize?: number;
}) => Promise<Buffer>;
/**
 * 17. Adds a header to all pages of a PDF.
 * Places header content at the top of each page.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @param {string} header - Header text content
 * @param {object} [options] - Header styling options
 * @returns {Promise<Buffer>} PDF buffer with headers
 * @throws {Error} If header addition fails
 *
 * @example
 * ```typescript
 * const withHeader = await addHeader(pdfBuffer, 'Medical Records - Confidential', {
 *   fontSize: 12,
 *   color: '#000000'
 * });
 * ```
 */
export declare const addHeader: (pdf: Buffer, header: string, options?: {
    fontSize?: number;
    color?: string;
}) => Promise<Buffer>;
/**
 * 18. Adds a footer to all pages of a PDF.
 * Places footer content at the bottom of each page.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @param {string} footer - Footer text content
 * @param {object} [options] - Footer styling options
 * @returns {Promise<Buffer>} PDF buffer with footers
 * @throws {Error} If footer addition fails
 *
 * @example
 * ```typescript
 * const withFooter = await addFooter(pdfBuffer, '© 2025 Healthcare Inc.', {
 *   fontSize: 10
 * });
 * ```
 */
export declare const addFooter: (pdf: Buffer, footer: string, options?: {
    fontSize?: number;
    color?: string;
}) => Promise<Buffer>;
/**
 * 19. Linearizes a PDF for fast web viewing.
 * Reorganizes PDF structure to allow progressive page-by-page loading.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @returns {Promise<Buffer>} Linearized PDF buffer
 * @throws {Error} If linearization fails
 *
 * @example
 * ```typescript
 * const linearized = await linearizePDF(pdfBuffer);
 * console.log('PDF optimized for web streaming');
 * ```
 */
export declare const linearizePDF: (pdf: Buffer) => Promise<Buffer>;
/**
 * 20. Repairs a damaged or corrupted PDF.
 * Attempts to fix structural issues and recover content.
 *
 * @param {Buffer} pdf - Damaged PDF buffer
 * @returns {Promise<Buffer>} Repaired PDF buffer
 * @throws {Error} If repair is not possible
 *
 * @example
 * ```typescript
 * const repaired = await repairPDF(damagedPdfBuffer);
 * console.log('PDF repaired');
 * ```
 */
export declare const repairPDF: (pdf: Buffer) => Promise<Buffer>;
/**
 * 21. Validates PDF structure and integrity.
 * Checks for compliance with PDF specification and identifies issues.
 *
 * @param {Buffer} pdf - PDF buffer to validate
 * @returns {Promise<ValidationResult>} Validation result with errors and warnings
 * @throws {Error} If validation process fails
 *
 * @example
 * ```typescript
 * const result = await validatePDF(pdfBuffer);
 * if (!result.valid) {
 *   console.log('Errors:', result.errors);
 * }
 * ```
 */
export declare const validatePDF: (pdf: Buffer) => Promise<ValidationResult>;
/**
 * 22. Retrieves comprehensive PDF metadata and information.
 * Extracts page count, file size, encryption status, version, and metadata.
 *
 * @param {Buffer} pdf - PDF buffer to analyze
 * @returns {Promise<PDFInfo>} Comprehensive PDF information
 * @throws {Error} If info extraction fails
 *
 * @example
 * ```typescript
 * const info = await getPDFInfo(pdfBuffer);
 * console.log('Pages:', info.pageCount);
 * console.log('Size:', info.fileSize);
 * console.log('Encrypted:', info.encrypted);
 * ```
 */
export declare const getPDFInfo: (pdf: Buffer) => Promise<PDFInfo>;
/**
 * 23. Extracts all images from a PDF.
 * Returns array of image buffers with metadata.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @returns {Promise<Array<{buffer: Buffer; format: string; width: number; height: number}>>} Array of extracted images
 * @throws {Error} If image extraction fails
 *
 * @example
 * ```typescript
 * const images = await extractImages(pdfBuffer);
 * console.log('Extracted', images.length, 'images');
 * ```
 */
export declare const extractImages: (pdf: Buffer) => Promise<Array<{
    buffer: Buffer;
    format: string;
    width: number;
    height: number;
}>>;
/**
 * 24. Extracts font information from a PDF.
 * Returns array of font names and metadata used in the document.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @returns {Promise<Array<{name: string; type: string; embedded: boolean}>>} Array of font information
 * @throws {Error} If font extraction fails
 *
 * @example
 * ```typescript
 * const fonts = await extractFonts(pdfBuffer);
 * fonts.forEach(f => console.log(`${f.name} (${f.type}): ${f.embedded ? 'embedded' : 'not embedded'}`));
 * ```
 */
export declare const extractFonts: (pdf: Buffer) => Promise<Array<{
    name: string;
    type: string;
    embedded: boolean;
}>>;
/**
 * 25. Embeds fonts in a PDF for portability.
 * Ensures all fonts are embedded to prevent rendering issues.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @returns {Promise<Buffer>} PDF buffer with embedded fonts
 * @throws {Error} If font embedding fails
 *
 * @example
 * ```typescript
 * const embedded = await embedFonts(pdfBuffer);
 * ```
 */
export declare const embedFonts: (pdf: Buffer) => Promise<Buffer>;
/**
 * 26. Removes embedded fonts from a PDF to reduce file size.
 * Replaces embedded fonts with standard fonts.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @returns {Promise<Buffer>} PDF buffer with fonts removed
 * @throws {Error} If font removal fails
 *
 * @example
 * ```typescript
 * const smaller = await removeFonts(pdfBuffer);
 * ```
 */
export declare const removeFonts: (pdf: Buffer) => Promise<Buffer>;
/**
 * 27. Flattens a PDF by removing interactive form fields.
 * Converts fillable forms to static content.
 *
 * @param {Buffer} pdf - Source PDF buffer with forms
 * @returns {Promise<Buffer>} Flattened PDF buffer
 * @throws {Error} If flattening fails
 *
 * @example
 * ```typescript
 * const flattened = await flattenPDF(pdfBuffer);
 * ```
 */
export declare const flattenPDF: (pdf: Buffer) => Promise<Buffer>;
/**
 * 28. Creates a PDF/A compliant archival document.
 * Converts PDF to PDF/A standard for long-term preservation.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @param {PDFALevel} [level] - PDF/A conformance level
 * @returns {Promise<Buffer>} PDF/A compliant buffer
 * @throws {Error} If PDF/A creation fails
 *
 * @example
 * ```typescript
 * const archival = await createPDFA(pdfBuffer, PDFALevel.PDFA_2B);
 * ```
 */
export declare const createPDFA: (pdf: Buffer, level?: PDFALevel) => Promise<Buffer>;
/**
 * 29. Validates PDF/A compliance.
 * Checks if PDF meets PDF/A archival standards.
 *
 * @param {Buffer} pdf - PDF buffer to validate
 * @returns {Promise<PDFAValidationResult>} PDF/A validation result
 * @throws {Error} If validation process fails
 *
 * @example
 * ```typescript
 * const result = await validatePDFA(pdfBuffer);
 * console.log('PDF/A compliant:', result.compliant);
 * ```
 */
export declare const validatePDFA: (pdf: Buffer) => Promise<PDFAValidationResult>;
/**
 * 30. Adds bookmarks (outline) to a PDF.
 * Creates hierarchical navigation structure.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @param {PDFBookmark[]} bookmarks - Array of bookmark entries
 * @returns {Promise<Buffer>} PDF buffer with bookmarks
 * @throws {Error} If bookmark addition fails
 *
 * @example
 * ```typescript
 * const withBookmarks = await addBookmarks(pdfBuffer, [
 *   { title: 'Chapter 1', pageNumber: 1 },
 *   { title: 'Chapter 2', pageNumber: 10 }
 * ]);
 * ```
 */
export declare const addBookmarks: (pdf: Buffer, bookmarks: PDFBookmark[]) => Promise<Buffer>;
/**
 * 31. Removes all bookmarks from a PDF.
 * Deletes the document outline/navigation structure.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @returns {Promise<Buffer>} PDF buffer without bookmarks
 * @throws {Error} If bookmark removal fails
 *
 * @example
 * ```typescript
 * const clean = await removeBookmarks(pdfBuffer);
 * ```
 */
export declare const removeBookmarks: (pdf: Buffer) => Promise<Buffer>;
/**
 * 32. Adds annotations to a PDF.
 * Supports text comments, highlights, underlines, and stamps.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @param {PDFAnnotation[]} annotations - Array of annotations to add
 * @returns {Promise<Buffer>} PDF buffer with annotations
 * @throws {Error} If annotation addition fails
 *
 * @example
 * ```typescript
 * const annotated = await addAnnotations(pdfBuffer, [
 *   {
 *     type: 'highlight',
 *     pageNumber: 1,
 *     content: 'Important',
 *     position: { x: 100, y: 200, width: 200, height: 20 }
 *   }
 * ]);
 * ```
 */
export declare const addAnnotations: (pdf: Buffer, annotations: PDFAnnotation[]) => Promise<Buffer>;
/**
 * 33. Removes all annotations from a PDF.
 * Deletes comments, highlights, and other markup.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @returns {Promise<Buffer>} PDF buffer without annotations
 * @throws {Error} If annotation removal fails
 *
 * @example
 * ```typescript
 * const clean = await removeAnnotations(pdfBuffer);
 * ```
 */
export declare const removeAnnotations: (pdf: Buffer) => Promise<Buffer>;
/**
 * 34. Adds file attachments to a PDF.
 * Embeds files within the PDF document.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @param {Array<{filename: string; data: Buffer; description?: string}>} files - Files to attach
 * @returns {Promise<Buffer>} PDF buffer with attachments
 * @throws {Error} If attachment addition fails
 *
 * @example
 * ```typescript
 * const withAttachments = await addAttachments(pdfBuffer, [
 *   { filename: 'data.csv', data: csvBuffer, description: 'Supporting data' }
 * ]);
 * ```
 */
export declare const addAttachments: (pdf: Buffer, files: Array<{
    filename: string;
    data: Buffer;
    description?: string;
}>) => Promise<Buffer>;
/**
 * 35. Extracts file attachments from a PDF.
 * Returns all embedded files with metadata.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @returns {Promise<PDFAttachment[]>} Array of extracted attachments
 * @throws {Error} If attachment extraction fails
 *
 * @example
 * ```typescript
 * const attachments = await extractAttachments(pdfBuffer);
 * console.log('Found', attachments.length, 'attachments');
 * ```
 */
export declare const extractAttachments: (pdf: Buffer) => Promise<PDFAttachment[]>;
/**
 * 36. Sets PDF metadata fields.
 * Updates title, author, subject, keywords, and other metadata.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @param {Partial<PDFInfo>} metadata - Metadata fields to set
 * @returns {Promise<Buffer>} PDF buffer with updated metadata
 * @throws {Error} If metadata update fails
 *
 * @example
 * ```typescript
 * const updated = await setMetadata(pdfBuffer, {
 *   title: 'Medical Records',
 *   author: 'Dr. Smith',
 *   subject: 'Patient Documentation',
 *   keywords: 'medical, records, patient'
 * });
 * ```
 */
export declare const setMetadata: (pdf: Buffer, metadata: Partial<PDFInfo>) => Promise<Buffer>;
/**
 * 37. Removes metadata from a PDF.
 * Strips all metadata fields for privacy or file size reduction.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @returns {Promise<Buffer>} PDF buffer without metadata
 * @throws {Error} If metadata removal fails
 *
 * @example
 * ```typescript
 * const stripped = await removeMetadata(pdfBuffer);
 * ```
 */
export declare const removeMetadata: (pdf: Buffer) => Promise<Buffer>;
/**
 * 38. Protects a PDF with password encryption.
 * Applies user and owner passwords with configurable permissions.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @param {ProtectionOptions} options - Protection configuration
 * @returns {Promise<Buffer>} Encrypted PDF buffer
 * @throws {Error} If encryption fails
 *
 * @example
 * ```typescript
 * const protected = await protectPDF(pdfBuffer, {
 *   userPassword: 'read123',
 *   ownerPassword: 'admin456',
 *   encryptionLevel: EncryptionLevel.AES_256,
 *   permissions: { printing: false, modifying: false, copying: false }
 * });
 * ```
 */
export declare const protectPDF: (pdf: Buffer, options: ProtectionOptions) => Promise<Buffer>;
/**
 * 39. Removes password protection from a PDF.
 * Decrypts PDF using the owner or user password.
 *
 * @param {Buffer} pdf - Encrypted PDF buffer
 * @param {string} password - Owner or user password
 * @returns {Promise<Buffer>} Unencrypted PDF buffer
 * @throws {Error} If password is incorrect or decryption fails
 *
 * @example
 * ```typescript
 * const unprotected = await unprotectPDF(encryptedPdfBuffer, 'admin456');
 * ```
 */
export declare const unprotectPDF: (pdf: Buffer, password: string) => Promise<Buffer>;
/**
 * 40. Digitally signs a PDF document.
 * Applies a digital signature using a certificate.
 *
 * @param {Buffer} pdf - Source PDF buffer
 * @param {object} signature - Signature configuration with certificate
 * @returns {Promise<Buffer>} Signed PDF buffer
 * @throws {Error} If signing fails
 *
 * @example
 * ```typescript
 * const signed = await signPDF(pdfBuffer, {
 *   certificate: certBuffer,
 *   privateKey: keyBuffer,
 *   reason: 'Document approval',
 *   location: 'San Francisco'
 * });
 * ```
 */
export declare const signPDF: (pdf: Buffer, signature: {
    certificate: Buffer;
    privateKey: Buffer;
    reason?: string;
    location?: string;
    contactInfo?: string;
}) => Promise<Buffer>;
/**
 * 41. Verifies digital signature on a PDF.
 * Validates signature integrity and certificate.
 *
 * @param {Buffer} pdf - Signed PDF buffer
 * @returns {Promise<SignatureInfo>} Signature verification result
 * @throws {Error} If verification process fails
 *
 * @example
 * ```typescript
 * const result = await verifyPDFSignature(signedPdfBuffer);
 * console.log('Signature valid:', result.valid);
 * console.log('Signer:', result.signer);
 * ```
 */
export declare const verifyPDFSignature: (pdf: Buffer) => Promise<SignatureInfo>;
/**
 * 42. Processes multiple PDFs in batch with the same operation.
 * Applies a specified operation to all PDFs with progress tracking.
 *
 * @param {Buffer[]} pdfs - Array of PDF buffers to process
 * @param {PDFOperationType} operation - Operation to perform
 * @param {any} [options] - Operation-specific options
 * @returns {Promise<BatchJob>} Batch job result with processing details
 * @throws {Error} If batch processing fails
 *
 * @example
 * ```typescript
 * const job = await batchProcess([pdf1, pdf2, pdf3], PDFOperationType.COMPRESS, {
 *   level: CompressionLevel.HIGH
 * });
 * console.log('Processed:', job.processedFiles, 'Failed:', job.failedFiles);
 * ```
 */
export declare const batchProcess: (pdfs: Buffer[], operation: PDFOperationType, options?: any) => Promise<BatchJob>;
/**
 * DocumentPDFManipulationService
 *
 * NestJS service for PDF manipulation operations.
 * Provides comprehensive PDF processing capabilities for healthcare document workflows.
 *
 * @example
 * ```typescript
 * @Controller('pdf')
 * export class PDFController {
 *   constructor(private readonly pdfService: DocumentPDFManipulationService) {}
 *
 *   @Post('merge')
 *   async merge(@Body() dto: { pdfs: Buffer[] }) {
 *     return this.pdfService.performMerge(dto.pdfs);
 *   }
 *
 *   @Post('compress')
 *   async compress(@Body() dto: { pdf: Buffer; level: CompressionLevel }) {
 *     return this.pdfService.performCompression(dto.pdf, dto.level);
 *   }
 * }
 * ```
 */
export declare class DocumentPDFManipulationService {
    /**
     * Merges multiple PDFs with optimization.
     *
     * @param {Buffer[]} pdfs - PDFs to merge
     * @param {Partial<MergeOptions>} [options] - Merge options
     * @returns {Promise<Buffer>} Merged PDF
     */
    performMerge(pdfs: Buffer[], options?: Partial<MergeOptions>): Promise<Buffer>;
    /**
     * Compresses a PDF with specified level.
     *
     * @param {Buffer} pdf - PDF to compress
     * @param {CompressionLevel} level - Compression level
     * @returns {Promise<Buffer>} Compressed PDF
     */
    performCompression(pdf: Buffer, level: CompressionLevel): Promise<Buffer>;
    /**
     * Protects a PDF with password and permissions.
     *
     * @param {Buffer} pdf - PDF to protect
     * @param {ProtectionOptions} options - Protection options
     * @returns {Promise<Buffer>} Protected PDF
     */
    performProtection(pdf: Buffer, options: ProtectionOptions): Promise<Buffer>;
    /**
     * Creates PDF/A archival document.
     *
     * @param {Buffer} pdf - PDF to convert
     * @param {PDFALevel} level - PDF/A level
     * @returns {Promise<Buffer>} PDF/A document
     */
    createArchival(pdf: Buffer, level: PDFALevel): Promise<Buffer>;
    /**
     * Performs comprehensive PDF processing operation.
     *
     * @param {Buffer} pdf - PDF to process
     * @param {string} operation - Operation type
     * @returns {Promise<Buffer>} Processed PDF
     */
    process(pdf: Buffer, operation: string): Promise<Buffer>;
}
declare const _default: {
    PDFOperationModel: typeof PDFOperationModel;
    PDFJobModel: typeof PDFJobModel;
    PDFConfigModel: typeof PDFConfigModel;
    mergePDFs: (pdfs: Buffer[], options?: Partial<MergeOptions>) => Promise<Buffer>;
    splitPDF: (pdf: Buffer, ranges: PageRange[], options?: Partial<SplitOptions>) => Promise<Buffer[]>;
    compressPDF: (pdf: Buffer, options: Partial<CompressionOptions>) => Promise<Buffer>;
    optimizePDF: (pdf: Buffer) => Promise<Buffer>;
    convertToPDF: (document: Buffer, sourceFormat: string) => Promise<Buffer>;
    convertFromPDF: (pdf: Buffer, targetFormat: ConversionFormat) => Promise<Buffer>;
    extractPages: (pdf: Buffer, pages: number[]) => Promise<Buffer>;
    deletePage: (pdf: Buffer, pageNumber: number) => Promise<Buffer>;
    insertPage: (pdf: Buffer, pageToInsert: Buffer, position: number) => Promise<Buffer>;
    reorderPages: (pdf: Buffer, order: number[]) => Promise<Buffer>;
    rotatePage: (pdf: Buffer, pageNumber: number, angle: RotationAngle) => Promise<Buffer>;
    cropPage: (pdf: Buffer, pageNumber: number, box: BoundingBox) => Promise<Buffer>;
    resizePage: (pdf: Buffer, pageNumber: number, size: PageSize | PageDimensions) => Promise<Buffer>;
    addWatermark: (pdf: Buffer, config: WatermarkConfig) => Promise<Buffer>;
    removeWatermark: (pdf: Buffer) => Promise<Buffer>;
    addPageNumbers: (pdf: Buffer, options?: {
        position?: string;
        startNumber?: number;
        format?: string;
        fontSize?: number;
    }) => Promise<Buffer>;
    addHeader: (pdf: Buffer, header: string, options?: {
        fontSize?: number;
        color?: string;
    }) => Promise<Buffer>;
    addFooter: (pdf: Buffer, footer: string, options?: {
        fontSize?: number;
        color?: string;
    }) => Promise<Buffer>;
    linearizePDF: (pdf: Buffer) => Promise<Buffer>;
    repairPDF: (pdf: Buffer) => Promise<Buffer>;
    validatePDF: (pdf: Buffer) => Promise<ValidationResult>;
    getPDFInfo: (pdf: Buffer) => Promise<PDFInfo>;
    extractImages: (pdf: Buffer) => Promise<Array<{
        buffer: Buffer;
        format: string;
        width: number;
        height: number;
    }>>;
    extractFonts: (pdf: Buffer) => Promise<Array<{
        name: string;
        type: string;
        embedded: boolean;
    }>>;
    embedFonts: (pdf: Buffer) => Promise<Buffer>;
    removeFonts: (pdf: Buffer) => Promise<Buffer>;
    flattenPDF: (pdf: Buffer) => Promise<Buffer>;
    createPDFA: (pdf: Buffer, level?: PDFALevel) => Promise<Buffer>;
    validatePDFA: (pdf: Buffer) => Promise<PDFAValidationResult>;
    addBookmarks: (pdf: Buffer, bookmarks: PDFBookmark[]) => Promise<Buffer>;
    removeBookmarks: (pdf: Buffer) => Promise<Buffer>;
    addAnnotations: (pdf: Buffer, annotations: PDFAnnotation[]) => Promise<Buffer>;
    removeAnnotations: (pdf: Buffer) => Promise<Buffer>;
    addAttachments: (pdf: Buffer, files: Array<{
        filename: string;
        data: Buffer;
        description?: string;
    }>) => Promise<Buffer>;
    extractAttachments: (pdf: Buffer) => Promise<PDFAttachment[]>;
    setMetadata: (pdf: Buffer, metadata: Partial<PDFInfo>) => Promise<Buffer>;
    removeMetadata: (pdf: Buffer) => Promise<Buffer>;
    protectPDF: (pdf: Buffer, options: ProtectionOptions) => Promise<Buffer>;
    unprotectPDF: (pdf: Buffer, password: string) => Promise<Buffer>;
    signPDF: (pdf: Buffer, signature: {
        certificate: Buffer;
        privateKey: Buffer;
        reason?: string;
        location?: string;
        contactInfo?: string;
    }) => Promise<Buffer>;
    verifyPDFSignature: (pdf: Buffer) => Promise<SignatureInfo>;
    batchProcess: (pdfs: Buffer[], operation: PDFOperationType, options?: any) => Promise<BatchJob>;
    DocumentPDFManipulationService: typeof DocumentPDFManipulationService;
};
export default _default;
//# sourceMappingURL=document-pdf-manipulation-composite.d.ts.map