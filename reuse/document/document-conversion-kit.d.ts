/**
 * LOC: DOC-CONV-001
 * File: /reuse/document/document-conversion-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - pdf-lib
 *   - mammoth
 *   - officegen
 *   - html-pdf
 *   - sharp
 *   - stream
 *
 * DOWNSTREAM (imported by):
 *   - Document processing services
 *   - Export controllers
 *   - Report generation modules
 *   - File conversion APIs
 */
/**
 * File: /reuse/document/document-conversion-kit.ts
 * Locator: WC-UTL-DOCCONV-001
 * Purpose: Document Format Conversion & Export Kit - Comprehensive document transformation utilities
 *
 * Upstream: @nestjs/common, sequelize, pdf-lib, mammoth, officegen, html-pdf, sharp, stream
 * Downstream: Document services, export controllers, report generation, conversion APIs
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, pdf-lib 1.17.x, mammoth 1.6.x
 * Exports: 48 utility functions for PDF conversion, Office document conversion, batch processing, quality settings
 *
 * LLM Context: Production-grade document conversion utilities for White Cross healthcare platform.
 * Provides PDF-to-Word/Excel/PowerPoint conversion, image-to-PDF, Office-to-PDF conversion, batch processing,
 * conversion queues, quality settings, layout preservation, watermarking, page manipulation, format detection,
 * metadata preservation, and multi-format export. Essential for converting medical documents, reports, and
 * records between various formats while maintaining HIPAA compliance and data integrity.
 */
import { Sequelize } from 'sequelize';
/**
 * Supported document formats
 */
export type DocumentFormat = 'pdf' | 'docx' | 'doc' | 'xlsx' | 'xls' | 'pptx' | 'ppt' | 'html' | 'txt' | 'rtf' | 'odt' | 'csv' | 'png' | 'jpg' | 'jpeg' | 'tiff' | 'bmp' | 'svg';
/**
 * Conversion job status
 */
export type ConversionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
/**
 * Conversion priority level
 */
export type ConversionPriority = 'low' | 'normal' | 'high' | 'urgent';
/**
 * Document conversion options
 */
export interface ConversionOptions {
    sourceFormat: DocumentFormat;
    targetFormat: DocumentFormat;
    quality?: 'low' | 'medium' | 'high' | 'maximum';
    preserveLayout?: boolean;
    preserveMetadata?: boolean;
    embedFonts?: boolean;
    compression?: 'none' | 'standard' | 'maximum';
    colorSpace?: 'rgb' | 'cmyk' | 'grayscale';
    dpi?: number;
    pageSize?: 'A4' | 'Letter' | 'Legal' | 'A3' | 'custom';
    customPageSize?: {
        width: number;
        height: number;
    };
    margins?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    orientation?: 'portrait' | 'landscape';
}
/**
 * PDF to Word conversion options
 */
export interface PDFToWordOptions {
    preserveImages?: boolean;
    preserveFormatting?: boolean;
    ocrEnabled?: boolean;
    language?: string;
    outputFormat?: 'docx' | 'doc';
}
/**
 * PDF to Excel conversion options
 */
export interface PDFToExcelOptions {
    detectTables?: boolean;
    allPages?: boolean;
    pageRange?: {
        start: number;
        end: number;
    };
    outputFormat?: 'xlsx' | 'xls' | 'csv';
}
/**
 * PDF to PowerPoint conversion options
 */
export interface PDFToPowerPointOptions {
    slidesPerPage?: number;
    preserveAnimations?: boolean;
    outputFormat?: 'pptx' | 'ppt';
}
/**
 * Image to PDF conversion options
 */
export interface ImageToPDFOptions {
    pageSize?: 'A4' | 'Letter' | 'fit';
    autoRotate?: boolean;
    compressImages?: boolean;
    imageQuality?: number;
    mergeMultiple?: boolean;
}
/**
 * Office to PDF conversion options
 */
export interface OfficeToPDFOptions {
    embedFonts?: boolean;
    bookmarks?: boolean;
    compression?: boolean;
    pdfVersion?: '1.4' | '1.5' | '1.6' | '1.7' | '2.0';
    pdfA?: boolean;
}
/**
 * HTML to PDF conversion options
 */
export interface HTMLToPDFOptions {
    pageSize?: 'A4' | 'Letter' | 'Legal';
    orientation?: 'portrait' | 'landscape';
    printBackground?: boolean;
    margin?: {
        top: string;
        right: string;
        bottom: string;
        left: string;
    };
    headerTemplate?: string;
    footerTemplate?: string;
    displayHeaderFooter?: boolean;
    scale?: number;
    preferCSSPageSize?: boolean;
}
/**
 * Batch conversion configuration
 */
export interface BatchConversionConfig {
    sourceFiles: string[];
    targetFormat: DocumentFormat;
    options?: ConversionOptions;
    outputDirectory?: string;
    parallelJobs?: number;
    onProgress?: (completed: number, total: number) => void;
    onError?: (file: string, error: Error) => void;
}
/**
 * Conversion queue job
 */
export interface ConversionJob {
    id: string;
    sourceFile: string;
    targetFormat: DocumentFormat;
    options?: ConversionOptions;
    status: ConversionStatus;
    priority: ConversionPriority;
    progress: number;
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
    outputFile?: string;
    userId?: string;
}
/**
 * Quality preset configuration
 */
export interface QualityPreset {
    name: string;
    dpi: number;
    compression: 'none' | 'standard' | 'maximum';
    imageQuality: number;
    colorDepth: 8 | 16 | 24 | 32;
    embedFonts: boolean;
}
/**
 * Layout preservation settings
 */
export interface LayoutPreservationSettings {
    preserveColumns?: boolean;
    preserveTables?: boolean;
    preserveImages?: boolean;
    preserveFonts?: boolean;
    preserveColors?: boolean;
    preserveHyperlinks?: boolean;
    preserveBookmarks?: boolean;
    preserveFormFields?: boolean;
}
/**
 * Watermark configuration
 */
export interface WatermarkConfig {
    text?: string;
    image?: Buffer | string;
    opacity: number;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    rotation?: number;
    position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    repeatPattern?: boolean;
}
/**
 * Page manipulation options
 */
export interface PageManipulationOptions {
    rotate?: 0 | 90 | 180 | 270;
    crop?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    scale?: number;
    extractPages?: number[];
    removePages?: number[];
    reorderPages?: number[];
}
/**
 * Document metadata
 */
export interface DocumentMetadata {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string[];
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
    pageCount?: number;
    fileSize?: number;
    format?: DocumentFormat;
    customProperties?: Record<string, any>;
}
/**
 * Conversion result
 */
export interface ConversionResult {
    success: boolean;
    outputFile?: string;
    outputBuffer?: Buffer;
    metadata?: DocumentMetadata;
    duration: number;
    error?: string;
    warnings?: string[];
}
/**
 * Batch conversion result
 */
export interface BatchConversionResult {
    totalFiles: number;
    successful: number;
    failed: number;
    results: Array<{
        sourceFile: string;
        result: ConversionResult;
    }>;
    duration: number;
}
/**
 * Conversion job model attributes
 */
export interface ConversionJobAttributes {
    id: string;
    sourceFile: string;
    sourceFormat: DocumentFormat;
    targetFormat: DocumentFormat;
    options?: Record<string, any>;
    status: ConversionStatus;
    priority: ConversionPriority;
    progress: number;
    outputFile?: string;
    error?: string;
    userId?: string;
    startedAt?: Date;
    completedAt?: Date;
    duration?: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Conversion template attributes
 */
export interface ConversionTemplateAttributes {
    id: string;
    name: string;
    description?: string;
    sourceFormat: DocumentFormat;
    targetFormat: DocumentFormat;
    options: Record<string, any>;
    isDefault: boolean;
    userId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates ConversionJob model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ConversionJobAttributes>>} ConversionJob model
 *
 * @example
 * ```typescript
 * const JobModel = createConversionJobModel(sequelize);
 * const job = await JobModel.create({
 *   sourceFile: '/uploads/document.pdf',
 *   sourceFormat: 'pdf',
 *   targetFormat: 'docx',
 *   status: 'pending',
 *   priority: 'normal',
 *   progress: 0
 * });
 * ```
 */
export declare const createConversionJobModel: (sequelize: Sequelize) => any;
/**
 * Creates ConversionTemplate model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ConversionTemplateAttributes>>} ConversionTemplate model
 *
 * @example
 * ```typescript
 * const TemplateModel = createConversionTemplateModel(sequelize);
 * const template = await TemplateModel.create({
 *   name: 'High Quality PDF to Word',
 *   sourceFormat: 'pdf',
 *   targetFormat: 'docx',
 *   options: { quality: 'high', preserveLayout: true }
 * });
 * ```
 */
export declare const createConversionTemplateModel: (sequelize: Sequelize) => any;
/**
 * 1. Converts PDF document to Word format (DOCX).
 *
 * @param {Buffer | string} pdfInput - PDF buffer or file path
 * @param {PDFToWordOptions} [options] - Conversion options
 * @returns {Promise<Buffer>} Word document buffer
 *
 * @example
 * ```typescript
 * const docxBuffer = await convertPDFToWord(pdfBuffer, {
 *   preserveImages: true,
 *   preserveFormatting: true,
 *   ocrEnabled: true,
 *   outputFormat: 'docx'
 * });
 * await fs.writeFile('output.docx', docxBuffer);
 * ```
 */
export declare const convertPDFToWord: (pdfInput: Buffer | string, options?: PDFToWordOptions) => Promise<Buffer>;
/**
 * 2. Converts PDF to Word with advanced layout preservation.
 *
 * @param {Buffer | string} pdfInput - PDF buffer or file path
 * @param {LayoutPreservationSettings} settings - Layout preservation settings
 * @returns {Promise<Buffer>} Word document with preserved layout
 *
 * @example
 * ```typescript
 * const docx = await convertPDFToWordWithLayout(pdfBuffer, {
 *   preserveColumns: true,
 *   preserveTables: true,
 *   preserveImages: true,
 *   preserveFonts: true
 * });
 * ```
 */
export declare const convertPDFToWordWithLayout: (pdfInput: Buffer | string, settings: LayoutPreservationSettings) => Promise<Buffer>;
/**
 * 3. Extracts text from PDF and creates Word document.
 *
 * @param {Buffer | string} pdfInput - PDF buffer or file path
 * @param {Object} [options] - Extraction options
 * @returns {Promise<{ buffer: Buffer; text: string }>} Word buffer and extracted text
 *
 * @example
 * ```typescript
 * const { buffer, text } = await extractPDFTextToWord(pdfBuffer, {
 *   preserveLineBreaks: true,
 *   includePageNumbers: true
 * });
 * ```
 */
export declare const extractPDFTextToWord: (pdfInput: Buffer | string, options?: {
    preserveLineBreaks?: boolean;
    includePageNumbers?: boolean;
}) => Promise<{
    buffer: Buffer;
    text: string;
}>;
/**
 * 4. Converts PDF to RTF format.
 *
 * @param {Buffer | string} pdfInput - PDF buffer or file path
 * @returns {Promise<Buffer>} RTF document buffer
 *
 * @example
 * ```typescript
 * const rtfBuffer = await convertPDFToRTF(pdfBuffer);
 * ```
 */
export declare const convertPDFToRTF: (pdfInput: Buffer | string) => Promise<Buffer>;
/**
 * 5. Converts PDF tables to Excel spreadsheet.
 *
 * @param {Buffer | string} pdfInput - PDF buffer or file path
 * @param {PDFToExcelOptions} [options] - Conversion options
 * @returns {Promise<Buffer>} Excel spreadsheet buffer
 *
 * @example
 * ```typescript
 * const xlsxBuffer = await convertPDFToExcel(pdfBuffer, {
 *   detectTables: true,
 *   allPages: false,
 *   pageRange: { start: 1, end: 5 },
 *   outputFormat: 'xlsx'
 * });
 * ```
 */
export declare const convertPDFToExcel: (pdfInput: Buffer | string, options?: PDFToExcelOptions) => Promise<Buffer>;
/**
 * 6. Extracts PDF tables to CSV format.
 *
 * @param {Buffer | string} pdfInput - PDF buffer or file path
 * @param {Object} [options] - CSV options
 * @returns {Promise<string>} CSV content
 *
 * @example
 * ```typescript
 * const csv = await extractPDFTablesToCSV(pdfBuffer, {
 *   delimiter: ',',
 *   includeHeaders: true
 * });
 * ```
 */
export declare const extractPDFTablesToCSV: (pdfInput: Buffer | string, options?: {
    delimiter?: string;
    includeHeaders?: boolean;
}) => Promise<string>;
/**
 * 7. Converts PDF data to structured Excel workbook.
 *
 * @param {Buffer | string} pdfInput - PDF buffer or file path
 * @param {Object} config - Workbook configuration
 * @returns {Promise<Buffer>} Excel workbook buffer
 *
 * @example
 * ```typescript
 * const workbook = await convertPDFToStructuredExcel(pdfBuffer, {
 *   sheetNames: ['Data', 'Summary'],
 *   autoFitColumns: true,
 *   freezeHeader: true
 * });
 * ```
 */
export declare const convertPDFToStructuredExcel: (pdfInput: Buffer | string, config: {
    sheetNames?: string[];
    autoFitColumns?: boolean;
    freezeHeader?: boolean;
}) => Promise<Buffer>;
/**
 * 8. Converts PDF to Excel with data validation.
 *
 * @param {Buffer | string} pdfInput - PDF buffer or file path
 * @param {Object} validationRules - Validation rules for cells
 * @returns {Promise<Buffer>} Excel with validation rules
 *
 * @example
 * ```typescript
 * const excel = await convertPDFToExcelWithValidation(pdfBuffer, {
 *   columnTypes: { A: 'number', B: 'date', C: 'text' }
 * });
 * ```
 */
export declare const convertPDFToExcelWithValidation: (pdfInput: Buffer | string, validationRules: {
    columnTypes?: Record<string, string>;
}) => Promise<Buffer>;
/**
 * 9. Converts PDF pages to PowerPoint slides.
 *
 * @param {Buffer | string} pdfInput - PDF buffer or file path
 * @param {PDFToPowerPointOptions} [options] - Conversion options
 * @returns {Promise<Buffer>} PowerPoint presentation buffer
 *
 * @example
 * ```typescript
 * const pptxBuffer = await convertPDFToPowerPoint(pdfBuffer, {
 *   slidesPerPage: 1,
 *   preserveAnimations: false,
 *   outputFormat: 'pptx'
 * });
 * ```
 */
export declare const convertPDFToPowerPoint: (pdfInput: Buffer | string, options?: PDFToPowerPointOptions) => Promise<Buffer>;
/**
 * 10. Converts PDF to PowerPoint with custom slide layout.
 *
 * @param {Buffer | string} pdfInput - PDF buffer or file path
 * @param {Object} layoutConfig - Slide layout configuration
 * @returns {Promise<Buffer>} PowerPoint with custom layout
 *
 * @example
 * ```typescript
 * const pptx = await convertPDFToPowerPointWithLayout(pdfBuffer, {
 *   slideSize: '16:9',
 *   templateFile: 'template.pptx',
 *   applyTheme: true
 * });
 * ```
 */
export declare const convertPDFToPowerPointWithLayout: (pdfInput: Buffer | string, layoutConfig: {
    slideSize?: string;
    templateFile?: string;
    applyTheme?: boolean;
}) => Promise<Buffer>;
/**
 * 11. Creates PowerPoint from PDF with notes.
 *
 * @param {Buffer | string} pdfInput - PDF buffer or file path
 * @param {string[]} notes - Notes for each slide
 * @returns {Promise<Buffer>} PowerPoint with speaker notes
 *
 * @example
 * ```typescript
 * const pptx = await convertPDFToPowerPointWithNotes(pdfBuffer, [
 *   'Introduction slide notes',
 *   'Content slide notes',
 *   'Conclusion notes'
 * ]);
 * ```
 */
export declare const convertPDFToPowerPointWithNotes: (pdfInput: Buffer | string, notes: string[]) => Promise<Buffer>;
/**
 * 12. Converts PDF to PowerPoint handout format.
 *
 * @param {Buffer | string} pdfInput - PDF buffer or file path
 * @param {number} slidesPerPage - Number of slides per handout page
 * @returns {Promise<Buffer>} PowerPoint handout buffer
 *
 * @example
 * ```typescript
 * const handout = await convertPDFToHandout(pdfBuffer, 6);
 * ```
 */
export declare const convertPDFToHandout: (pdfInput: Buffer | string, slidesPerPage: number) => Promise<Buffer>;
/**
 * 13. Converts PDF to HTML format.
 *
 * @param {Buffer | string} pdfInput - PDF buffer or file path
 * @param {Object} [options] - HTML conversion options
 * @returns {Promise<string>} HTML content
 *
 * @example
 * ```typescript
 * const html = await convertPDFToHTML(pdfBuffer, {
 *   includeCSS: true,
 *   preserveLayout: true,
 *   embedImages: true
 * });
 * ```
 */
export declare const convertPDFToHTML: (pdfInput: Buffer | string, options?: {
    includeCSS?: boolean;
    preserveLayout?: boolean;
    embedImages?: boolean;
}) => Promise<string>;
/**
 * 14. Converts PDF to responsive HTML.
 *
 * @param {Buffer | string} pdfInput - PDF buffer or file path
 * @param {Object} config - Responsive configuration
 * @returns {Promise<{ html: string; css: string; assets: Map<string, Buffer> }>} HTML with assets
 *
 * @example
 * ```typescript
 * const { html, css, assets } = await convertPDFToResponsiveHTML(pdfBuffer, {
 *   breakpoints: ['mobile', 'tablet', 'desktop'],
 *   optimizeImages: true
 * });
 * ```
 */
export declare const convertPDFToResponsiveHTML: (pdfInput: Buffer | string, config: {
    breakpoints?: string[];
    optimizeImages?: boolean;
}) => Promise<{
    html: string;
    css: string;
    assets: Map<string, Buffer>;
}>;
/**
 * 15. Extracts PDF content to structured HTML with semantic tags.
 *
 * @param {Buffer | string} pdfInput - PDF buffer or file path
 * @returns {Promise<string>} Semantic HTML
 *
 * @example
 * ```typescript
 * const semanticHtml = await convertPDFToSemanticHTML(pdfBuffer);
 * ```
 */
export declare const convertPDFToSemanticHTML: (pdfInput: Buffer | string) => Promise<string>;
/**
 * 16. Converts PDF to HTML with accessibility features.
 *
 * @param {Buffer | string} pdfInput - PDF buffer or file path
 * @param {Object} a11yOptions - Accessibility options
 * @returns {Promise<string>} Accessible HTML
 *
 * @example
 * ```typescript
 * const accessibleHtml = await convertPDFToAccessibleHTML(pdfBuffer, {
 *   addAriaLabels: true,
 *   includeAltText: true,
 *   semanticStructure: true
 * });
 * ```
 */
export declare const convertPDFToAccessibleHTML: (pdfInput: Buffer | string, a11yOptions: {
    addAriaLabels?: boolean;
    includeAltText?: boolean;
    semanticStructure?: boolean;
}) => Promise<string>;
/**
 * 17. Converts image file to PDF.
 *
 * @param {Buffer | string} imageInput - Image buffer or file path
 * @param {ImageToPDFOptions} [options] - Conversion options
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdfBuffer = await convertImageToPDF(imageBuffer, {
 *   pageSize: 'A4',
 *   autoRotate: true,
 *   compressImages: true,
 *   imageQuality: 85
 * });
 * ```
 */
export declare const convertImageToPDF: (imageInput: Buffer | string, options?: ImageToPDFOptions) => Promise<Buffer>;
/**
 * 18. Converts multiple images to single PDF.
 *
 * @param {Array<Buffer | string>} images - Array of image buffers or paths
 * @param {ImageToPDFOptions} [options] - Conversion options
 * @returns {Promise<Buffer>} Merged PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await convertMultipleImagesToPDF([img1, img2, img3], {
 *   pageSize: 'A4',
 *   compressImages: true
 * });
 * ```
 */
export declare const convertMultipleImagesToPDF: (images: Array<Buffer | string>, options?: ImageToPDFOptions) => Promise<Buffer>;
/**
 * 19. Converts TIFF multipage to PDF.
 *
 * @param {Buffer | string} tiffInput - TIFF buffer or file path
 * @param {Object} [options] - TIFF conversion options
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await convertTIFFToPDF(tiffBuffer, {
 *   preserveMetadata: true,
 *   compression: 'standard'
 * });
 * ```
 */
export declare const convertTIFFToPDF: (tiffInput: Buffer | string, options?: {
    preserveMetadata?: boolean;
    compression?: string;
}) => Promise<Buffer>;
/**
 * 20. Converts scanned image to searchable PDF (OCR).
 *
 * @param {Buffer | string} imageInput - Image buffer or file path
 * @param {Object} ocrOptions - OCR options
 * @returns {Promise<Buffer>} Searchable PDF buffer
 *
 * @example
 * ```typescript
 * const searchablePdf = await convertScannedImageToSearchablePDF(imageBuffer, {
 *   language: 'eng',
 *   deskew: true,
 *   autoRotate: true
 * });
 * ```
 */
export declare const convertScannedImageToSearchablePDF: (imageInput: Buffer | string, ocrOptions: {
    language?: string;
    deskew?: boolean;
    autoRotate?: boolean;
}) => Promise<Buffer>;
/**
 * 21. Converts Word document to PDF.
 *
 * @param {Buffer | string} docInput - Word document buffer or file path
 * @param {OfficeToPDFOptions} [options] - Conversion options
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await convertWordToPDF(docxBuffer, {
 *   embedFonts: true,
 *   bookmarks: true,
 *   compression: true,
 *   pdfVersion: '1.7'
 * });
 * ```
 */
export declare const convertWordToPDF: (docInput: Buffer | string, options?: OfficeToPDFOptions) => Promise<Buffer>;
/**
 * 22. Converts Excel spreadsheet to PDF.
 *
 * @param {Buffer | string} xlsInput - Excel buffer or file path
 * @param {OfficeToPDFOptions & { fitToPage?: boolean }} [options] - Conversion options
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await convertExcelToPDF(xlsxBuffer, {
 *   fitToPage: true,
 *   embedFonts: true
 * });
 * ```
 */
export declare const convertExcelToPDF: (xlsInput: Buffer | string, options?: OfficeToPDFOptions & {
    fitToPage?: boolean;
}) => Promise<Buffer>;
/**
 * 23. Converts PowerPoint presentation to PDF.
 *
 * @param {Buffer | string} pptInput - PowerPoint buffer or file path
 * @param {OfficeToPDFOptions & { includeNotes?: boolean }} [options] - Conversion options
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await convertPowerPointToPDF(pptxBuffer, {
 *   includeNotes: true,
 *   embedFonts: true
 * });
 * ```
 */
export declare const convertPowerPointToPDF: (pptInput: Buffer | string, options?: OfficeToPDFOptions & {
    includeNotes?: boolean;
}) => Promise<Buffer>;
/**
 * 24. Converts any Office document to PDF/A (archival format).
 *
 * @param {Buffer | string} officeInput - Office document buffer or file path
 * @param {string} format - Source format (docx, xlsx, pptx)
 * @returns {Promise<Buffer>} PDF/A buffer
 *
 * @example
 * ```typescript
 * const pdfA = await convertOfficeToPDFA(docxBuffer, 'docx');
 * ```
 */
export declare const convertOfficeToPDFA: (officeInput: Buffer | string, format: string) => Promise<Buffer>;
/**
 * 25. Converts HTML content to PDF.
 *
 * @param {string} html - HTML content
 * @param {HTMLToPDFOptions} [options] - Conversion options
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await convertHTMLToPDF(htmlContent, {
 *   pageSize: 'A4',
 *   printBackground: true,
 *   margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
 * });
 * ```
 */
export declare const convertHTMLToPDF: (html: string, options?: HTMLToPDFOptions) => Promise<Buffer>;
/**
 * 26. Converts HTML file to PDF with external resources.
 *
 * @param {string} htmlPath - Path to HTML file
 * @param {HTMLToPDFOptions & { baseUrl?: string }} [options] - Conversion options
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await convertHTMLFileToPDF('/path/to/file.html', {
 *   baseUrl: 'https://example.com',
 *   printBackground: true
 * });
 * ```
 */
export declare const convertHTMLFileToPDF: (htmlPath: string, options?: HTMLToPDFOptions & {
    baseUrl?: string;
}) => Promise<Buffer>;
/**
 * 27. Converts URL to PDF.
 *
 * @param {string} url - URL to convert
 * @param {HTMLToPDFOptions & { waitForSelector?: string }} [options] - Conversion options
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await convertURLToPDF('https://example.com', {
 *   waitForSelector: '#content',
 *   printBackground: true
 * });
 * ```
 */
export declare const convertURLToPDF: (url: string, options?: HTMLToPDFOptions & {
    waitForSelector?: string;
}) => Promise<Buffer>;
/**
 * 28. Generates PDF from HTML template with data.
 *
 * @param {string} template - HTML template
 * @param {Record<string, any>} data - Template data
 * @param {HTMLToPDFOptions} [options] - Conversion options
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await generatePDFFromTemplate('<h1>{{title}}</h1>', {
 *   title: 'Medical Report',
 *   patient: 'John Doe'
 * });
 * ```
 */
export declare const generatePDFFromTemplate: (template: string, data: Record<string, any>, options?: HTMLToPDFOptions) => Promise<Buffer>;
/**
 * 29. Performs batch conversion of multiple files.
 *
 * @param {BatchConversionConfig} config - Batch conversion configuration
 * @returns {Promise<BatchConversionResult>} Batch conversion results
 *
 * @example
 * ```typescript
 * const result = await batchConvertDocuments({
 *   sourceFiles: ['/docs/file1.pdf', '/docs/file2.pdf'],
 *   targetFormat: 'docx',
 *   outputDirectory: '/output',
 *   parallelJobs: 3,
 *   onProgress: (completed, total) => console.log(`${completed}/${total}`)
 * });
 * ```
 */
export declare const batchConvertDocuments: (config: BatchConversionConfig) => Promise<BatchConversionResult>;
/**
 * 30. Converts directory of documents to target format.
 *
 * @param {string} sourceDir - Source directory path
 * @param {DocumentFormat} targetFormat - Target format
 * @param {Object} [options] - Conversion options
 * @returns {Promise<BatchConversionResult>} Batch conversion results
 *
 * @example
 * ```typescript
 * const result = await convertDirectoryDocuments('/input/docs', 'pdf', {
 *   recursive: true,
 *   filePattern: '*.docx'
 * });
 * ```
 */
export declare const convertDirectoryDocuments: (sourceDir: string, targetFormat: DocumentFormat, options?: {
    recursive?: boolean;
    filePattern?: string;
}) => Promise<BatchConversionResult>;
/**
 * 31. Monitors and processes conversion queue.
 *
 * @param {number} [maxConcurrent] - Maximum concurrent conversions
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processConversionQueue(5);
 * ```
 */
export declare const processConversionQueue: (maxConcurrent?: number) => Promise<void>;
/**
 * 32. Prioritizes conversion job in queue.
 *
 * @param {string} jobId - Job ID
 * @param {ConversionPriority} priority - New priority level
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await prioritizeConversionJob('job-123', 'urgent');
 * ```
 */
export declare const prioritizeConversionJob: (jobId: string, priority: ConversionPriority) => Promise<void>;
/**
 * 33. Creates quality preset for conversions.
 *
 * @param {string} name - Preset name
 * @param {Partial<QualityPreset>} settings - Quality settings
 * @returns {QualityPreset} Complete quality preset
 *
 * @example
 * ```typescript
 * const highQuality = createQualityPreset('High Quality', {
 *   dpi: 300,
 *   compression: 'none',
 *   imageQuality: 95,
 *   embedFonts: true
 * });
 * ```
 */
export declare const createQualityPreset: (name: string, settings: Partial<QualityPreset>) => QualityPreset;
/**
 * 34. Applies quality preset to conversion options.
 *
 * @param {ConversionOptions} options - Base conversion options
 * @param {QualityPreset} preset - Quality preset to apply
 * @returns {ConversionOptions} Updated conversion options
 *
 * @example
 * ```typescript
 * const options = applyQualityPreset(baseOptions, highQualityPreset);
 * ```
 */
export declare const applyQualityPreset: (options: ConversionOptions, preset: QualityPreset) => ConversionOptions;
/**
 * 35. Gets predefined quality presets.
 *
 * @returns {Record<string, QualityPreset>} Map of preset names to presets
 *
 * @example
 * ```typescript
 * const presets = getDefaultQualityPresets();
 * const webPreset = presets['Web'];
 * ```
 */
export declare const getDefaultQualityPresets: () => Record<string, QualityPreset>;
/**
 * 36. Optimizes conversion settings for file size.
 *
 * @param {ConversionOptions} options - Original options
 * @param {number} targetSizeKB - Target file size in KB
 * @returns {ConversionOptions} Optimized options
 *
 * @example
 * ```typescript
 * const optimized = optimizeForFileSize(options, 500);
 * ```
 */
export declare const optimizeForFileSize: (options: ConversionOptions, targetSizeKB: number) => ConversionOptions;
/**
 * 37. Preserves document layout during conversion.
 *
 * @param {Buffer} sourceDoc - Source document buffer
 * @param {DocumentFormat} sourceFormat - Source format
 * @param {DocumentFormat} targetFormat - Target format
 * @param {LayoutPreservationSettings} settings - Preservation settings
 * @returns {Promise<Buffer>} Converted document with preserved layout
 *
 * @example
 * ```typescript
 * const converted = await preserveDocumentLayout(pdfBuffer, 'pdf', 'docx', {
 *   preserveColumns: true,
 *   preserveTables: true,
 *   preserveFonts: true
 * });
 * ```
 */
export declare const preserveDocumentLayout: (sourceDoc: Buffer, sourceFormat: DocumentFormat, targetFormat: DocumentFormat, settings: LayoutPreservationSettings) => Promise<Buffer>;
/**
 * 38. Maintains font embedding during conversion.
 *
 * @param {Buffer} sourceDoc - Source document buffer
 * @param {DocumentFormat} targetFormat - Target format
 * @param {string[]} [fontList] - Specific fonts to embed
 * @returns {Promise<Buffer>} Document with embedded fonts
 *
 * @example
 * ```typescript
 * const doc = await embedFontsInConversion(docBuffer, 'pdf', [
 *   'Arial', 'Times New Roman', 'Calibri'
 * ]);
 * ```
 */
export declare const embedFontsInConversion: (sourceDoc: Buffer, targetFormat: DocumentFormat, fontList?: string[]) => Promise<Buffer>;
/**
 * 39. Preserves hyperlinks during conversion.
 *
 * @param {Buffer} sourceDoc - Source document buffer
 * @param {DocumentFormat} targetFormat - Target format
 * @returns {Promise<Buffer>} Document with preserved hyperlinks
 *
 * @example
 * ```typescript
 * const doc = await preserveHyperlinks(pdfBuffer, 'docx');
 * ```
 */
export declare const preserveHyperlinks: (sourceDoc: Buffer, targetFormat: DocumentFormat) => Promise<Buffer>;
/**
 * 40. Maintains bookmarks and table of contents.
 *
 * @param {Buffer} sourceDoc - Source document buffer
 * @param {DocumentFormat} targetFormat - Target format
 * @returns {Promise<Buffer>} Document with preserved bookmarks
 *
 * @example
 * ```typescript
 * const doc = await preserveBookmarks(pdfBuffer, 'docx');
 * ```
 */
export declare const preserveBookmarks: (sourceDoc: Buffer, targetFormat: DocumentFormat) => Promise<Buffer>;
/**
 * 41. Extracts metadata from document.
 *
 * @param {Buffer | string} document - Document buffer or path
 * @param {DocumentFormat} format - Document format
 * @returns {Promise<DocumentMetadata>} Extracted metadata
 *
 * @example
 * ```typescript
 * const metadata = await extractDocumentMetadata(pdfBuffer, 'pdf');
 * console.log('Pages:', metadata.pageCount);
 * ```
 */
export declare const extractDocumentMetadata: (document: Buffer | string, format: DocumentFormat) => Promise<DocumentMetadata>;
/**
 * 42. Updates document metadata during conversion.
 *
 * @param {Buffer} sourceDoc - Source document buffer
 * @param {DocumentMetadata} metadata - New metadata
 * @param {DocumentFormat} targetFormat - Target format
 * @returns {Promise<Buffer>} Document with updated metadata
 *
 * @example
 * ```typescript
 * const doc = await updateDocumentMetadata(pdfBuffer, {
 *   title: 'Medical Report',
 *   author: 'Dr. Smith',
 *   keywords: ['medical', 'report', '2024']
 * }, 'pdf');
 * ```
 */
export declare const updateDocumentMetadata: (sourceDoc: Buffer, metadata: DocumentMetadata, targetFormat: DocumentFormat) => Promise<Buffer>;
/**
 * 43. Preserves custom properties during conversion.
 *
 * @param {Buffer} sourceDoc - Source document buffer
 * @param {DocumentFormat} targetFormat - Target format
 * @returns {Promise<Buffer>} Document with preserved properties
 *
 * @example
 * ```typescript
 * const doc = await preserveCustomProperties(docxBuffer, 'pdf');
 * ```
 */
export declare const preserveCustomProperties: (sourceDoc: Buffer, targetFormat: DocumentFormat) => Promise<Buffer>;
/**
 * 44. Strips metadata from document for privacy.
 *
 * @param {Buffer} document - Document buffer
 * @param {DocumentFormat} format - Document format
 * @returns {Promise<Buffer>} Document with stripped metadata
 *
 * @example
 * ```typescript
 * const sanitized = await stripDocumentMetadata(pdfBuffer, 'pdf');
 * ```
 */
export declare const stripDocumentMetadata: (document: Buffer, format: DocumentFormat) => Promise<Buffer>;
/**
 * 45. Adds watermark during conversion.
 *
 * @param {Buffer} sourceDoc - Source document buffer
 * @param {WatermarkConfig} watermark - Watermark configuration
 * @param {DocumentFormat} targetFormat - Target format
 * @returns {Promise<Buffer>} Document with watermark
 *
 * @example
 * ```typescript
 * const watermarked = await addWatermarkDuringConversion(pdfBuffer, {
 *   text: 'CONFIDENTIAL',
 *   opacity: 0.3,
 *   fontSize: 48,
 *   rotation: 45,
 *   position: 'center'
 * }, 'pdf');
 * ```
 */
export declare const addWatermarkDuringConversion: (sourceDoc: Buffer, watermark: WatermarkConfig, targetFormat: DocumentFormat) => Promise<Buffer>;
/**
 * 46. Merges multiple documents during conversion.
 *
 * @param {Array<{ buffer: Buffer; format: DocumentFormat }>} documents - Documents to merge
 * @param {DocumentFormat} targetFormat - Target format
 * @returns {Promise<Buffer>} Merged document
 *
 * @example
 * ```typescript
 * const merged = await mergeDocumentsDuringConversion([
 *   { buffer: pdf1, format: 'pdf' },
 *   { buffer: docx1, format: 'docx' }
 * ], 'pdf');
 * ```
 */
export declare const mergeDocumentsDuringConversion: (documents: Array<{
    buffer: Buffer;
    format: DocumentFormat;
}>, targetFormat: DocumentFormat) => Promise<Buffer>;
/**
 * 47. Splits document during conversion.
 *
 * @param {Buffer} sourceDoc - Source document buffer
 * @param {DocumentFormat} targetFormat - Target format
 * @param {Object} splitOptions - Split options
 * @returns {Promise<Buffer[]>} Array of split documents
 *
 * @example
 * ```typescript
 * const parts = await splitDocumentDuringConversion(pdfBuffer, 'pdf', {
 *   method: 'pages',
 *   pagesPerPart: 5
 * });
 * ```
 */
export declare const splitDocumentDuringConversion: (sourceDoc: Buffer, targetFormat: DocumentFormat, splitOptions: {
    method: "pages" | "size" | "bookmarks";
    pagesPerPart?: number;
    maxSizeMB?: number;
}) => Promise<Buffer[]>;
/**
 * 48. Validates conversion output quality.
 *
 * @param {Buffer} originalDoc - Original document buffer
 * @param {Buffer} convertedDoc - Converted document buffer
 * @param {Object} [validationOptions] - Validation options
 * @returns {Promise<{ valid: boolean; score: number; issues: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateConversionQuality(original, converted, {
 *   checkLayout: true,
 *   checkText: true,
 *   checkImages: true
 * });
 * console.log('Quality score:', validation.score);
 * ```
 */
export declare const validateConversionQuality: (originalDoc: Buffer, convertedDoc: Buffer, validationOptions?: {
    checkLayout?: boolean;
    checkText?: boolean;
    checkImages?: boolean;
}) => Promise<{
    valid: boolean;
    score: number;
    issues: string[];
}>;
declare const _default: {
    convertPDFToWord: (pdfInput: Buffer | string, options?: PDFToWordOptions) => Promise<Buffer>;
    convertPDFToWordWithLayout: (pdfInput: Buffer | string, settings: LayoutPreservationSettings) => Promise<Buffer>;
    extractPDFTextToWord: (pdfInput: Buffer | string, options?: {
        preserveLineBreaks?: boolean;
        includePageNumbers?: boolean;
    }) => Promise<{
        buffer: Buffer;
        text: string;
    }>;
    convertPDFToRTF: (pdfInput: Buffer | string) => Promise<Buffer>;
    convertPDFToExcel: (pdfInput: Buffer | string, options?: PDFToExcelOptions) => Promise<Buffer>;
    extractPDFTablesToCSV: (pdfInput: Buffer | string, options?: {
        delimiter?: string;
        includeHeaders?: boolean;
    }) => Promise<string>;
    convertPDFToStructuredExcel: (pdfInput: Buffer | string, config: {
        sheetNames?: string[];
        autoFitColumns?: boolean;
        freezeHeader?: boolean;
    }) => Promise<Buffer>;
    convertPDFToExcelWithValidation: (pdfInput: Buffer | string, validationRules: {
        columnTypes?: Record<string, string>;
    }) => Promise<Buffer>;
    convertPDFToPowerPoint: (pdfInput: Buffer | string, options?: PDFToPowerPointOptions) => Promise<Buffer>;
    convertPDFToPowerPointWithLayout: (pdfInput: Buffer | string, layoutConfig: {
        slideSize?: string;
        templateFile?: string;
        applyTheme?: boolean;
    }) => Promise<Buffer>;
    convertPDFToPowerPointWithNotes: (pdfInput: Buffer | string, notes: string[]) => Promise<Buffer>;
    convertPDFToHandout: (pdfInput: Buffer | string, slidesPerPage: number) => Promise<Buffer>;
    convertPDFToHTML: (pdfInput: Buffer | string, options?: {
        includeCSS?: boolean;
        preserveLayout?: boolean;
        embedImages?: boolean;
    }) => Promise<string>;
    convertPDFToResponsiveHTML: (pdfInput: Buffer | string, config: {
        breakpoints?: string[];
        optimizeImages?: boolean;
    }) => Promise<{
        html: string;
        css: string;
        assets: Map<string, Buffer>;
    }>;
    convertPDFToSemanticHTML: (pdfInput: Buffer | string) => Promise<string>;
    convertPDFToAccessibleHTML: (pdfInput: Buffer | string, a11yOptions: {
        addAriaLabels?: boolean;
        includeAltText?: boolean;
        semanticStructure?: boolean;
    }) => Promise<string>;
    convertImageToPDF: (imageInput: Buffer | string, options?: ImageToPDFOptions) => Promise<Buffer>;
    convertMultipleImagesToPDF: (images: Array<Buffer | string>, options?: ImageToPDFOptions) => Promise<Buffer>;
    convertTIFFToPDF: (tiffInput: Buffer | string, options?: {
        preserveMetadata?: boolean;
        compression?: string;
    }) => Promise<Buffer>;
    convertScannedImageToSearchablePDF: (imageInput: Buffer | string, ocrOptions: {
        language?: string;
        deskew?: boolean;
        autoRotate?: boolean;
    }) => Promise<Buffer>;
    convertWordToPDF: (docInput: Buffer | string, options?: OfficeToPDFOptions) => Promise<Buffer>;
    convertExcelToPDF: (xlsInput: Buffer | string, options?: OfficeToPDFOptions & {
        fitToPage?: boolean;
    }) => Promise<Buffer>;
    convertPowerPointToPDF: (pptInput: Buffer | string, options?: OfficeToPDFOptions & {
        includeNotes?: boolean;
    }) => Promise<Buffer>;
    convertOfficeToPDFA: (officeInput: Buffer | string, format: string) => Promise<Buffer>;
    convertHTMLToPDF: (html: string, options?: HTMLToPDFOptions) => Promise<Buffer>;
    convertHTMLFileToPDF: (htmlPath: string, options?: HTMLToPDFOptions & {
        baseUrl?: string;
    }) => Promise<Buffer>;
    convertURLToPDF: (url: string, options?: HTMLToPDFOptions & {
        waitForSelector?: string;
    }) => Promise<Buffer>;
    generatePDFFromTemplate: (template: string, data: Record<string, any>, options?: HTMLToPDFOptions) => Promise<Buffer>;
    batchConvertDocuments: (config: BatchConversionConfig) => Promise<BatchConversionResult>;
    convertDirectoryDocuments: (sourceDir: string, targetFormat: DocumentFormat, options?: {
        recursive?: boolean;
        filePattern?: string;
    }) => Promise<BatchConversionResult>;
    processConversionQueue: (maxConcurrent?: number) => Promise<void>;
    prioritizeConversionJob: (jobId: string, priority: ConversionPriority) => Promise<void>;
    createQualityPreset: (name: string, settings: Partial<QualityPreset>) => QualityPreset;
    applyQualityPreset: (options: ConversionOptions, preset: QualityPreset) => ConversionOptions;
    getDefaultQualityPresets: () => Record<string, QualityPreset>;
    optimizeForFileSize: (options: ConversionOptions, targetSizeKB: number) => ConversionOptions;
    preserveDocumentLayout: (sourceDoc: Buffer, sourceFormat: DocumentFormat, targetFormat: DocumentFormat, settings: LayoutPreservationSettings) => Promise<Buffer>;
    embedFontsInConversion: (sourceDoc: Buffer, targetFormat: DocumentFormat, fontList?: string[]) => Promise<Buffer>;
    preserveHyperlinks: (sourceDoc: Buffer, targetFormat: DocumentFormat) => Promise<Buffer>;
    preserveBookmarks: (sourceDoc: Buffer, targetFormat: DocumentFormat) => Promise<Buffer>;
    extractDocumentMetadata: (document: Buffer | string, format: DocumentFormat) => Promise<DocumentMetadata>;
    updateDocumentMetadata: (sourceDoc: Buffer, metadata: DocumentMetadata, targetFormat: DocumentFormat) => Promise<Buffer>;
    preserveCustomProperties: (sourceDoc: Buffer, targetFormat: DocumentFormat) => Promise<Buffer>;
    stripDocumentMetadata: (document: Buffer, format: DocumentFormat) => Promise<Buffer>;
    addWatermarkDuringConversion: (sourceDoc: Buffer, watermark: WatermarkConfig, targetFormat: DocumentFormat) => Promise<Buffer>;
    mergeDocumentsDuringConversion: (documents: Array<{
        buffer: Buffer;
        format: DocumentFormat;
    }>, targetFormat: DocumentFormat) => Promise<Buffer>;
    splitDocumentDuringConversion: (sourceDoc: Buffer, targetFormat: DocumentFormat, splitOptions: {
        method: "pages" | "size" | "bookmarks";
        pagesPerPart?: number;
        maxSizeMB?: number;
    }) => Promise<Buffer[]>;
    validateConversionQuality: (originalDoc: Buffer, convertedDoc: Buffer, validationOptions?: {
        checkLayout?: boolean;
        checkText?: boolean;
        checkImages?: boolean;
    }) => Promise<{
        valid: boolean;
        score: number;
        issues: string[];
    }>;
    createConversionJobModel: (sequelize: Sequelize) => any;
    createConversionTemplateModel: (sequelize: Sequelize) => any;
};
export default _default;
//# sourceMappingURL=document-conversion-kit.d.ts.map