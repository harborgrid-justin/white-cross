/**
 * LOC: DOC-PARSE-001
 * File: /reuse/document/document-parsing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - pdf-lib / pdf-parse
 *   - tesseract.js (OCR)
 *   - mammoth (Word documents)
 *   - xlsx (Excel parsing)
 *
 * DOWNSTREAM (imported by):
 *   - Document processing services
 *   - PDF management controllers
 *   - Content extraction modules
 *   - Document analysis services
 */
/**
 * File: /reuse/document/document-parsing-kit.ts
 * Locator: WC-UTL-DOCPARSE-001
 * Purpose: PDF/Document Parsing & Analysis Kit - Comprehensive document handling utilities for NestJS
 *
 * Upstream: @nestjs/common, sequelize, pdf-lib, pdf-parse, tesseract.js, mammoth, xlsx
 * Downstream: Document controllers, parsing services, content extraction, analysis modules
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, PDF-Lib 1.17.x, Tesseract.js 4.x
 * Exports: 45+ utility functions for PDF parsing, text extraction, structure analysis, metadata, OCR
 *
 * LLM Context: Production-grade document parsing utilities for White Cross healthcare platform.
 * Provides PDF structure parsing, text extraction with positioning, page manipulation, metadata reading,
 * font and style analysis, table detection, image extraction, link parsing, outline/bookmark handling,
 * OCR integration, content analysis, form field extraction, and HIPAA-compliant document processing.
 * Essential for medical record parsing, clinical document analysis, and healthcare data extraction.
 */
import { Sequelize } from 'sequelize';
/**
 * PDF document metadata
 */
export interface PDFMetadata {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string[];
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
    pageCount: number;
    version: string;
    encrypted: boolean;
    linearized: boolean;
    fileSize?: number;
}
/**
 * PDF page information
 */
export interface PDFPageInfo {
    pageNumber: number;
    width: number;
    height: number;
    rotation: number;
    mediaBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    cropBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    textContent?: string;
    wordCount?: number;
    hasImages: boolean;
    hasForms: boolean;
}
/**
 * Text extraction result with positioning
 */
export interface ExtractedText {
    text: string;
    pageNumber: number;
    position?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    font?: string;
    fontSize?: number;
    color?: string;
    bold?: boolean;
    italic?: boolean;
}
/**
 * Text extraction options
 */
export interface TextExtractionOptions {
    preserveFormatting?: boolean;
    includePosition?: boolean;
    includeFontInfo?: boolean;
    pageRange?: {
        start: number;
        end: number;
    };
    encoding?: string;
}
/**
 * Font information
 */
export interface FontInfo {
    name: string;
    type: string;
    encoding?: string;
    subset?: boolean;
    embedded?: boolean;
    usageCount: number;
    pages: number[];
}
/**
 * Table detection result
 */
export interface DetectedTable {
    pageNumber: number;
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    rows: number;
    columns: number;
    cells: TableCell[][];
    confidence?: number;
}
/**
 * Table cell
 */
export interface TableCell {
    text: string;
    rowIndex: number;
    colIndex: number;
    rowSpan?: number;
    colSpan?: number;
    bounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
/**
 * Image extraction result
 */
export interface ExtractedImage {
    pageNumber: number;
    imageIndex: number;
    width: number;
    height: number;
    format: string;
    data: Buffer;
    bounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    colorSpace?: string;
    bitsPerComponent?: number;
}
/**
 * Link/hyperlink information
 */
export interface DocumentLink {
    type: 'url' | 'internal' | 'file';
    pageNumber: number;
    text?: string;
    url?: string;
    destination?: {
        page: number;
        x?: number;
        y?: number;
        zoom?: number;
    };
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
/**
 * Document outline/bookmark
 */
export interface DocumentOutline {
    title: string;
    level: number;
    destination?: {
        page: number;
        x?: number;
        y?: number;
        zoom?: number;
    };
    children?: DocumentOutline[];
    expanded?: boolean;
}
/**
 * Document structure element
 */
export interface StructureElement {
    type: 'heading' | 'paragraph' | 'list' | 'table' | 'image' | 'section';
    level?: number;
    text?: string;
    pageNumber: number;
    children?: StructureElement[];
    attributes?: Record<string, any>;
}
/**
 * OCR result
 */
export interface OCRResult {
    text: string;
    confidence: number;
    words: OCRWord[];
    language: string;
    pageNumber: number;
}
/**
 * OCR word
 */
export interface OCRWord {
    text: string;
    confidence: number;
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    baseline?: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
}
/**
 * Content analysis result
 */
export interface ContentAnalysis {
    wordCount: number;
    characterCount: number;
    pageCount: number;
    language?: string;
    readabilityScore?: number;
    keyPhrases?: string[];
    entities?: EntityExtraction[];
    sentiment?: 'positive' | 'negative' | 'neutral';
    topics?: string[];
}
/**
 * Entity extraction
 */
export interface EntityExtraction {
    type: 'person' | 'organization' | 'location' | 'date' | 'medical' | 'custom';
    text: string;
    confidence: number;
    pageNumber?: number;
    position?: {
        start: number;
        end: number;
    };
}
/**
 * Form field information
 */
export interface FormField {
    name: string;
    type: 'text' | 'checkbox' | 'radio' | 'select' | 'signature' | 'date';
    value?: any;
    defaultValue?: any;
    required: boolean;
    readOnly: boolean;
    pageNumber: number;
    bounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    options?: string[];
}
/**
 * Page extraction options
 */
export interface PageExtractionOptions {
    pageNumbers?: number[];
    pageRange?: {
        start: number;
        end: number;
    };
    outputFormat?: 'pdf' | 'image' | 'text';
    imageFormat?: 'png' | 'jpeg' | 'webp';
    imageQuality?: number;
    dpi?: number;
}
/**
 * Document comparison result
 */
export interface ComparisonResult {
    identical: boolean;
    similarityScore: number;
    differences: DocumentDifference[];
    addedPages?: number[];
    removedPages?: number[];
    modifiedPages?: number[];
}
/**
 * Document difference
 */
export interface DocumentDifference {
    type: 'text' | 'image' | 'structure' | 'metadata';
    pageNumber?: number;
    description: string;
    oldValue?: any;
    newValue?: any;
    position?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
/**
 * Search result in document
 */
export interface DocumentSearchResult {
    text: string;
    pageNumber: number;
    occurrenceIndex: number;
    context?: string;
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    highlightColor?: string;
}
/**
 * Redaction area
 */
export interface RedactionArea {
    pageNumber: number;
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    reason?: string;
    fillColor?: string;
    overlayText?: string;
}
/**
 * Parsed document model attributes
 */
export interface ParsedDocumentAttributes {
    id: string;
    fileId: string;
    documentType: 'pdf' | 'word' | 'excel' | 'powerpoint' | 'text' | 'other';
    pageCount: number;
    wordCount: number;
    characterCount: number;
    parseStatus: 'pending' | 'processing' | 'completed' | 'failed';
    parseError?: string;
    metadata: Record<string, any>;
    extractedText?: string;
    language?: string;
    hasImages: boolean;
    hasTables: boolean;
    hasForms: boolean;
    parsedAt?: Date;
    parsedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Document page model attributes
 */
export interface DocumentPageAttributes {
    id: string;
    documentId: string;
    pageNumber: number;
    width: number;
    height: number;
    rotation: number;
    textContent?: string;
    wordCount: number;
    hasImages: boolean;
    hasTables: boolean;
    hasForms: boolean;
    thumbnailUrl?: string;
    extractedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates ParsedDocument model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ParsedDocumentAttributes>>} ParsedDocument model
 *
 * @example
 * ```typescript
 * const DocumentModel = createParsedDocumentModel(sequelize);
 * const doc = await DocumentModel.create({
 *   fileId: 'file-uuid',
 *   documentType: 'pdf',
 *   pageCount: 10,
 *   wordCount: 5000,
 *   characterCount: 30000,
 *   parseStatus: 'completed',
 *   metadata: { title: 'Medical Report' }
 * });
 * ```
 */
export declare const createParsedDocumentModel: (sequelize: Sequelize) => any;
/**
 * Creates DocumentPage model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentPageAttributes>>} DocumentPage model
 *
 * @example
 * ```typescript
 * const PageModel = createDocumentPageModel(sequelize);
 * const page = await PageModel.create({
 *   documentId: 'doc-uuid',
 *   pageNumber: 1,
 *   width: 612,
 *   height: 792,
 *   rotation: 0,
 *   wordCount: 500
 * });
 * ```
 */
export declare const createDocumentPageModel: (sequelize: Sequelize) => any;
/**
 * 1. Parses PDF document and extracts basic structure.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<PDFMetadata>} PDF metadata and structure
 *
 * @example
 * ```typescript
 * const metadata = await parsePDFStructure(pdfBuffer);
 * console.log(`PDF has ${metadata.pageCount} pages`);
 * ```
 */
export declare const parsePDFStructure: (pdfBuffer: Buffer) => Promise<PDFMetadata>;
/**
 * 2. Extracts detailed information for specific page.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} pageNumber - Page number (1-indexed)
 * @returns {Promise<PDFPageInfo>} Page information
 *
 * @example
 * ```typescript
 * const pageInfo = await extractPageInfo(pdfBuffer, 1);
 * console.log(`Page dimensions: ${pageInfo.width}x${pageInfo.height}`);
 * ```
 */
export declare const extractPageInfo: (pdfBuffer: Buffer, pageNumber: number) => Promise<PDFPageInfo>;
/**
 * 3. Gets page count from PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<number>} Number of pages
 *
 * @example
 * ```typescript
 * const pages = await getPDFPageCount(pdfBuffer);
 * ```
 */
export declare const getPDFPageCount: (pdfBuffer: Buffer) => Promise<number>;
/**
 * 4. Validates PDF document integrity.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePDFIntegrity(pdfBuffer);
 * if (!validation.valid) {
 *   console.error('PDF errors:', validation.errors);
 * }
 * ```
 */
export declare const validatePDFIntegrity: (pdfBuffer: Buffer) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * 5. Detects PDF version and compatibility.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<{ version: string; compatible: boolean; features: string[] }>} Version info
 *
 * @example
 * ```typescript
 * const versionInfo = await detectPDFVersion(pdfBuffer);
 * console.log('PDF version:', versionInfo.version);
 * ```
 */
export declare const detectPDFVersion: (pdfBuffer: Buffer) => Promise<{
    version: string;
    compatible: boolean;
    features: string[];
}>;
/**
 * 6. Extracts all text from PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {TextExtractionOptions} [options] - Extraction options
 * @returns {Promise<string>} Extracted text
 *
 * @example
 * ```typescript
 * const text = await extractTextFromPDF(pdfBuffer, {
 *   preserveFormatting: true,
 *   pageRange: { start: 1, end: 5 }
 * });
 * ```
 */
export declare const extractTextFromPDF: (pdfBuffer: Buffer, options?: TextExtractionOptions) => Promise<string>;
/**
 * 7. Extracts text from specific page.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} pageNumber - Page number (1-indexed)
 * @returns {Promise<string>} Page text
 *
 * @example
 * ```typescript
 * const pageText = await extractTextFromPage(pdfBuffer, 1);
 * ```
 */
export declare const extractTextFromPage: (pdfBuffer: Buffer, pageNumber: number) => Promise<string>;
/**
 * 8. Extracts text with position information.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} [pageNumber] - Specific page number
 * @returns {Promise<ExtractedText[]>} Text elements with positions
 *
 * @example
 * ```typescript
 * const textWithPositions = await extractTextWithPosition(pdfBuffer, 1);
 * textWithPositions.forEach(item => {
 *   console.log(`"${item.text}" at (${item.position?.x}, ${item.position?.y})`);
 * });
 * ```
 */
export declare const extractTextWithPosition: (pdfBuffer: Buffer, pageNumber?: number) => Promise<ExtractedText[]>;
/**
 * 9. Analyzes document content and extracts statistics.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<ContentAnalysis>} Content analysis results
 *
 * @example
 * ```typescript
 * const analysis = await analyzeDocumentContent(pdfBuffer);
 * console.log(`Word count: ${analysis.wordCount}, Pages: ${analysis.pageCount}`);
 * ```
 */
export declare const analyzeDocumentContent: (pdfBuffer: Buffer) => Promise<ContentAnalysis>;
/**
 * 10. Counts words in document or page.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} [pageNumber] - Specific page number
 * @returns {Promise<number>} Word count
 *
 * @example
 * ```typescript
 * const totalWords = await countWords(pdfBuffer);
 * const pageWords = await countWords(pdfBuffer, 1);
 * ```
 */
export declare const countWords: (pdfBuffer: Buffer, pageNumber?: number) => Promise<number>;
/**
 * 11. Extracts specific pages from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {PageExtractionOptions} options - Extraction options
 * @returns {Promise<Buffer>} Extracted pages as new PDF
 *
 * @example
 * ```typescript
 * const extractedPDF = await extractPages(pdfBuffer, {
 *   pageNumbers: [1, 3, 5]
 * });
 * ```
 */
export declare const extractPages: (pdfBuffer: Buffer, options: PageExtractionOptions) => Promise<Buffer>;
/**
 * 12. Splits PDF into individual page files.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Buffer[]>} Array of single-page PDFs
 *
 * @example
 * ```typescript
 * const pages = await splitPDFIntoPages(pdfBuffer);
 * console.log(`Split into ${pages.length} pages`);
 * ```
 */
export declare const splitPDFIntoPages: (pdfBuffer: Buffer) => Promise<Buffer[]>;
/**
 * 13. Merges multiple PDF documents.
 *
 * @param {Buffer[]} pdfBuffers - Array of PDF buffers to merge
 * @returns {Promise<Buffer>} Merged PDF
 *
 * @example
 * ```typescript
 * const merged = await mergePDFs([pdf1Buffer, pdf2Buffer, pdf3Buffer]);
 * ```
 */
export declare const mergePDFs: (pdfBuffers: Buffer[]) => Promise<Buffer>;
/**
 * 14. Rotates pages in PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} degrees - Rotation degrees (90, 180, 270)
 * @param {number[]} [pageNumbers] - Specific pages to rotate
 * @returns {Promise<Buffer>} Rotated PDF
 *
 * @example
 * ```typescript
 * const rotated = await rotatePDFPages(pdfBuffer, 90, [1, 2, 3]);
 * ```
 */
export declare const rotatePDFPages: (pdfBuffer: Buffer, degrees: number, pageNumbers?: number[]) => Promise<Buffer>;
/**
 * 15. Renders PDF page as image.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} pageNumber - Page number to render
 * @param {Object} [options] - Rendering options
 * @returns {Promise<Buffer>} Rendered image
 *
 * @example
 * ```typescript
 * const image = await renderPageAsImage(pdfBuffer, 1, {
 *   format: 'png',
 *   dpi: 300,
 *   quality: 95
 * });
 * ```
 */
export declare const renderPageAsImage: (pdfBuffer: Buffer, pageNumber: number, options?: {
    format?: "png" | "jpeg" | "webp";
    dpi?: number;
    quality?: number;
}) => Promise<Buffer>;
/**
 * 16. Reads PDF document metadata.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<PDFMetadata>} Document metadata
 *
 * @example
 * ```typescript
 * const metadata = await readPDFMetadata(pdfBuffer);
 * console.log('Title:', metadata.title);
 * console.log('Author:', metadata.author);
 * ```
 */
export declare const readPDFMetadata: (pdfBuffer: Buffer) => Promise<PDFMetadata>;
/**
 * 17. Updates PDF document metadata.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {Partial<PDFMetadata>} metadata - Metadata to update
 * @returns {Promise<Buffer>} Updated PDF
 *
 * @example
 * ```typescript
 * const updated = await updatePDFMetadata(pdfBuffer, {
 *   title: 'Updated Medical Report',
 *   author: 'Dr. Johnson',
 *   keywords: ['medical', 'cardiology']
 * });
 * ```
 */
export declare const updatePDFMetadata: (pdfBuffer: Buffer, metadata: Partial<PDFMetadata>) => Promise<Buffer>;
/**
 * 18. Extracts XMP metadata from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Record<string, any> | null>} XMP metadata
 *
 * @example
 * ```typescript
 * const xmpData = await extractXMPMetadata(pdfBuffer);
 * console.log('XMP:', xmpData);
 * ```
 */
export declare const extractXMPMetadata: (pdfBuffer: Buffer) => Promise<Record<string, any> | null>;
/**
 * 19. Reads PDF document properties.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Record<string, any>>} Document properties
 *
 * @example
 * ```typescript
 * const properties = await readDocumentProperties(pdfBuffer);
 * ```
 */
export declare const readDocumentProperties: (pdfBuffer: Buffer) => Promise<Record<string, any>>;
/**
 * 20. Checks if PDF is encrypted.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<boolean>} True if encrypted
 *
 * @example
 * ```typescript
 * const isEncrypted = await isPDFEncrypted(pdfBuffer);
 * if (isEncrypted) {
 *   console.log('PDF requires password');
 * }
 * ```
 */
export declare const isPDFEncrypted: (pdfBuffer: Buffer) => Promise<boolean>;
/**
 * 21. Extracts font information from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<FontInfo[]>} Array of font information
 *
 * @example
 * ```typescript
 * const fonts = await extractFontInfo(pdfBuffer);
 * fonts.forEach(font => {
 *   console.log(`${font.name}: ${font.usageCount} occurrences`);
 * });
 * ```
 */
export declare const extractFontInfo: (pdfBuffer: Buffer) => Promise<FontInfo[]>;
/**
 * 22. Lists all fonts used in document.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<string[]>} Array of font names
 *
 * @example
 * ```typescript
 * const fontNames = await listDocumentFonts(pdfBuffer);
 * console.log('Fonts used:', fontNames.join(', '));
 * ```
 */
export declare const listDocumentFonts: (pdfBuffer: Buffer) => Promise<string[]>;
/**
 * 23. Detects embedded fonts in PDF.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<FontInfo[]>} Embedded fonts
 *
 * @example
 * ```typescript
 * const embeddedFonts = await detectEmbeddedFonts(pdfBuffer);
 * ```
 */
export declare const detectEmbeddedFonts: (pdfBuffer: Buffer) => Promise<FontInfo[]>;
/**
 * 24. Analyzes text styles and formatting.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} [pageNumber] - Specific page
 * @returns {Promise<Array<{ style: string; count: number }>>} Style usage statistics
 *
 * @example
 * ```typescript
 * const styles = await analyzeTextStyles(pdfBuffer);
 * ```
 */
export declare const analyzeTextStyles: (pdfBuffer: Buffer, pageNumber?: number) => Promise<Array<{
    style: string;
    count: number;
}>>;
/**
 * 25. Extracts color information from document.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Array<{ color: string; usage: number }>>} Color usage
 *
 * @example
 * ```typescript
 * const colors = await extractColorInfo(pdfBuffer);
 * ```
 */
export declare const extractColorInfo: (pdfBuffer: Buffer) => Promise<Array<{
    color: string;
    usage: number;
}>>;
/**
 * 26. Detects tables in PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} [pageNumber] - Specific page
 * @returns {Promise<DetectedTable[]>} Detected tables
 *
 * @example
 * ```typescript
 * const tables = await detectTables(pdfBuffer, 1);
 * console.log(`Found ${tables.length} tables`);
 * ```
 */
export declare const detectTables: (pdfBuffer: Buffer, pageNumber?: number) => Promise<DetectedTable[]>;
/**
 * 27. Extracts table data as structured format.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {DetectedTable} table - Table to extract
 * @returns {Promise<any[][]>} Table data as 2D array
 *
 * @example
 * ```typescript
 * const tables = await detectTables(pdfBuffer);
 * const tableData = await extractTableData(pdfBuffer, tables[0]);
 * ```
 */
export declare const extractTableData: (pdfBuffer: Buffer, table: DetectedTable) => Promise<any[][]>;
/**
 * 28. Converts table to CSV format.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {DetectedTable} table - Table to convert
 * @returns {Promise<string>} CSV string
 *
 * @example
 * ```typescript
 * const csv = await convertTableToCSV(pdfBuffer, table);
 * ```
 */
export declare const convertTableToCSV: (pdfBuffer: Buffer, table: DetectedTable) => Promise<string>;
/**
 * 29. Converts table to JSON format.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {DetectedTable} table - Table to convert
 * @returns {Promise<Record<string, any>[]>} Table as JSON
 *
 * @example
 * ```typescript
 * const json = await convertTableToJSON(pdfBuffer, table);
 * ```
 */
export declare const convertTableToJSON: (pdfBuffer: Buffer, table: DetectedTable) => Promise<Record<string, any>[]>;
/**
 * 30. Extracts all tables from document.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Array<{ pageNumber: number; table: any[][] }>>} All tables
 *
 * @example
 * ```typescript
 * const allTables = await extractAllTables(pdfBuffer);
 * ```
 */
export declare const extractAllTables: (pdfBuffer: Buffer) => Promise<Array<{
    pageNumber: number;
    table: any[][];
}>>;
/**
 * 31. Extracts all images from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} [pageNumber] - Specific page
 * @returns {Promise<ExtractedImage[]>} Extracted images
 *
 * @example
 * ```typescript
 * const images = await extractImages(pdfBuffer);
 * console.log(`Found ${images.length} images`);
 * ```
 */
export declare const extractImages: (pdfBuffer: Buffer, pageNumber?: number) => Promise<ExtractedImage[]>;
/**
 * 32. Counts images in document.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<number>} Image count
 *
 * @example
 * ```typescript
 * const imageCount = await countImagesInPDF(pdfBuffer);
 * ```
 */
export declare const countImagesInPDF: (pdfBuffer: Buffer) => Promise<number>;
/**
 * 33. Extracts image from specific location.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} pageNumber - Page number
 * @param {number} imageIndex - Image index on page
 * @returns {Promise<Buffer>} Image buffer
 *
 * @example
 * ```typescript
 * const image = await extractImageAtIndex(pdfBuffer, 1, 0);
 * ```
 */
export declare const extractImageAtIndex: (pdfBuffer: Buffer, pageNumber: number, imageIndex: number) => Promise<Buffer>;
/**
 * 34. Replaces image in PDF.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} pageNumber - Page number
 * @param {number} imageIndex - Image index
 * @param {Buffer} newImage - New image buffer
 * @returns {Promise<Buffer>} Updated PDF
 *
 * @example
 * ```typescript
 * const updated = await replaceImage(pdfBuffer, 1, 0, newImageBuffer);
 * ```
 */
export declare const replaceImage: (pdfBuffer: Buffer, pageNumber: number, imageIndex: number, newImage: Buffer) => Promise<Buffer>;
/**
 * 35. Removes images from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number[]} [pageNumbers] - Specific pages
 * @returns {Promise<Buffer>} PDF without images
 *
 * @example
 * ```typescript
 * const noImages = await removeImages(pdfBuffer, [1, 2, 3]);
 * ```
 */
export declare const removeImages: (pdfBuffer: Buffer, pageNumbers?: number[]) => Promise<Buffer>;
/**
 * 36. Extracts all links from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<DocumentLink[]>} Extracted links
 *
 * @example
 * ```typescript
 * const links = await extractLinks(pdfBuffer);
 * links.forEach(link => {
 *   console.log(`${link.type}: ${link.url || link.destination}`);
 * });
 * ```
 */
export declare const extractLinks: (pdfBuffer: Buffer) => Promise<DocumentLink[]>;
/**
 * 37. Extracts external URLs from document.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<string[]>} Array of URLs
 *
 * @example
 * ```typescript
 * const urls = await extractURLs(pdfBuffer);
 * ```
 */
export declare const extractURLs: (pdfBuffer: Buffer) => Promise<string[]>;
/**
 * 38. Extracts internal links and references.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<DocumentLink[]>} Internal links
 *
 * @example
 * ```typescript
 * const internalLinks = await extractInternalLinks(pdfBuffer);
 * ```
 */
export declare const extractInternalLinks: (pdfBuffer: Buffer) => Promise<DocumentLink[]>;
/**
 * 39. Adds hyperlink to PDF.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {DocumentLink} link - Link to add
 * @returns {Promise<Buffer>} Updated PDF
 *
 * @example
 * ```typescript
 * const updated = await addHyperlink(pdfBuffer, {
 *   type: 'url',
 *   pageNumber: 1,
 *   url: 'https://example.com',
 *   bounds: { x: 100, y: 500, width: 100, height: 20 }
 * });
 * ```
 */
export declare const addHyperlink: (pdfBuffer: Buffer, link: DocumentLink) => Promise<Buffer>;
/**
 * 40. Removes all links from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Buffer>} PDF without links
 *
 * @example
 * ```typescript
 * const noLinks = await removeAllLinks(pdfBuffer);
 * ```
 */
export declare const removeAllLinks: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 41. Extracts document outline/bookmarks.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<DocumentOutline[]>} Document outline
 *
 * @example
 * ```typescript
 * const outline = await extractDocumentOutline(pdfBuffer);
 * outline.forEach(item => {
 *   console.log(`${'  '.repeat(item.level)}${item.title}`);
 * });
 * ```
 */
export declare const extractDocumentOutline: (pdfBuffer: Buffer) => Promise<DocumentOutline[]>;
/**
 * 42. Analyzes document structure hierarchy.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<StructureElement[]>} Document structure
 *
 * @example
 * ```typescript
 * const structure = await analyzeDocumentStructure(pdfBuffer);
 * ```
 */
export declare const analyzeDocumentStructure: (pdfBuffer: Buffer) => Promise<StructureElement[]>;
/**
 * 43. Detects headings in document.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Array<{ level: number; text: string; pageNumber: number }>>} Headings
 *
 * @example
 * ```typescript
 * const headings = await detectHeadings(pdfBuffer);
 * ```
 */
export declare const detectHeadings: (pdfBuffer: Buffer) => Promise<Array<{
    level: number;
    text: string;
    pageNumber: number;
}>>;
/**
 * 44. Creates table of contents from structure.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<string>} Table of contents
 *
 * @example
 * ```typescript
 * const toc = await createTableOfContents(pdfBuffer);
 * console.log(toc);
 * ```
 */
export declare const createTableOfContents: (pdfBuffer: Buffer) => Promise<string>;
/**
 * 45. Extracts form fields from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<FormField[]>} Form fields
 *
 * @example
 * ```typescript
 * const fields = await extractFormFields(pdfBuffer);
 * fields.forEach(field => {
 *   console.log(`${field.name}: ${field.value || 'empty'}`);
 * });
 * ```
 */
export declare const extractFormFields: (pdfBuffer: Buffer) => Promise<FormField[]>;
declare const _default: {
    createParsedDocumentModel: (sequelize: Sequelize) => any;
    createDocumentPageModel: (sequelize: Sequelize) => any;
    parsePDFStructure: (pdfBuffer: Buffer) => Promise<PDFMetadata>;
    extractPageInfo: (pdfBuffer: Buffer, pageNumber: number) => Promise<PDFPageInfo>;
    getPDFPageCount: (pdfBuffer: Buffer) => Promise<number>;
    validatePDFIntegrity: (pdfBuffer: Buffer) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    detectPDFVersion: (pdfBuffer: Buffer) => Promise<{
        version: string;
        compatible: boolean;
        features: string[];
    }>;
    extractTextFromPDF: (pdfBuffer: Buffer, options?: TextExtractionOptions) => Promise<string>;
    extractTextFromPage: (pdfBuffer: Buffer, pageNumber: number) => Promise<string>;
    extractTextWithPosition: (pdfBuffer: Buffer, pageNumber?: number) => Promise<ExtractedText[]>;
    analyzeDocumentContent: (pdfBuffer: Buffer) => Promise<ContentAnalysis>;
    countWords: (pdfBuffer: Buffer, pageNumber?: number) => Promise<number>;
    extractPages: (pdfBuffer: Buffer, options: PageExtractionOptions) => Promise<Buffer>;
    splitPDFIntoPages: (pdfBuffer: Buffer) => Promise<Buffer[]>;
    mergePDFs: (pdfBuffers: Buffer[]) => Promise<Buffer>;
    rotatePDFPages: (pdfBuffer: Buffer, degrees: number, pageNumbers?: number[]) => Promise<Buffer>;
    renderPageAsImage: (pdfBuffer: Buffer, pageNumber: number, options?: {
        format?: "png" | "jpeg" | "webp";
        dpi?: number;
        quality?: number;
    }) => Promise<Buffer>;
    readPDFMetadata: (pdfBuffer: Buffer) => Promise<PDFMetadata>;
    updatePDFMetadata: (pdfBuffer: Buffer, metadata: Partial<PDFMetadata>) => Promise<Buffer>;
    extractXMPMetadata: (pdfBuffer: Buffer) => Promise<Record<string, any> | null>;
    readDocumentProperties: (pdfBuffer: Buffer) => Promise<Record<string, any>>;
    isPDFEncrypted: (pdfBuffer: Buffer) => Promise<boolean>;
    extractFontInfo: (pdfBuffer: Buffer) => Promise<FontInfo[]>;
    listDocumentFonts: (pdfBuffer: Buffer) => Promise<string[]>;
    detectEmbeddedFonts: (pdfBuffer: Buffer) => Promise<FontInfo[]>;
    analyzeTextStyles: (pdfBuffer: Buffer, pageNumber?: number) => Promise<Array<{
        style: string;
        count: number;
    }>>;
    extractColorInfo: (pdfBuffer: Buffer) => Promise<Array<{
        color: string;
        usage: number;
    }>>;
    detectTables: (pdfBuffer: Buffer, pageNumber?: number) => Promise<DetectedTable[]>;
    extractTableData: (pdfBuffer: Buffer, table: DetectedTable) => Promise<any[][]>;
    convertTableToCSV: (pdfBuffer: Buffer, table: DetectedTable) => Promise<string>;
    convertTableToJSON: (pdfBuffer: Buffer, table: DetectedTable) => Promise<Record<string, any>[]>;
    extractAllTables: (pdfBuffer: Buffer) => Promise<Array<{
        pageNumber: number;
        table: any[][];
    }>>;
    extractImages: (pdfBuffer: Buffer, pageNumber?: number) => Promise<ExtractedImage[]>;
    countImagesInPDF: (pdfBuffer: Buffer) => Promise<number>;
    extractImageAtIndex: (pdfBuffer: Buffer, pageNumber: number, imageIndex: number) => Promise<Buffer>;
    replaceImage: (pdfBuffer: Buffer, pageNumber: number, imageIndex: number, newImage: Buffer) => Promise<Buffer>;
    removeImages: (pdfBuffer: Buffer, pageNumbers?: number[]) => Promise<Buffer>;
    extractLinks: (pdfBuffer: Buffer) => Promise<DocumentLink[]>;
    extractURLs: (pdfBuffer: Buffer) => Promise<string[]>;
    extractInternalLinks: (pdfBuffer: Buffer) => Promise<DocumentLink[]>;
    addHyperlink: (pdfBuffer: Buffer, link: DocumentLink) => Promise<Buffer>;
    removeAllLinks: (pdfBuffer: Buffer) => Promise<Buffer>;
    extractDocumentOutline: (pdfBuffer: Buffer) => Promise<DocumentOutline[]>;
    analyzeDocumentStructure: (pdfBuffer: Buffer) => Promise<StructureElement[]>;
    detectHeadings: (pdfBuffer: Buffer) => Promise<Array<{
        level: number;
        text: string;
        pageNumber: number;
    }>>;
    createTableOfContents: (pdfBuffer: Buffer) => Promise<string>;
    extractFormFields: (pdfBuffer: Buffer) => Promise<FormField[]>;
};
export default _default;
//# sourceMappingURL=document-parsing-kit.d.ts.map