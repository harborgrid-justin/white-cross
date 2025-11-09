/**
 * LOC: DOC-WMARK-001
 * File: /reuse/document/document-watermarking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - pdflib
 *   - sharp
 *   - canvas
 *   - qrcode
 *
 * DOWNSTREAM (imported by):
 *   - Document processing services
 *   - PDF generation controllers
 *   - Watermark management modules
 *   - Stamp creation services
 *   - Medical records processing
 */
/**
 * File: /reuse/document/document-watermarking-kit.ts
 * Locator: WC-UTL-DOCWMARK-001
 * Purpose: Document Watermarking & Stamping Kit - Comprehensive PDF watermarking, stamps, headers, footers, and page numbering
 *
 * Upstream: @nestjs/common, sequelize v6.x, pdflib, sharp, canvas, qrcode
 * Downstream: Document services, PDF controllers, watermark modules, medical records
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, pdf-lib 1.17.x, Sharp 0.33.x
 * Exports: 40 utility functions for watermarking, stamping, headers, footers, page numbering, bates numbering, custom stamps
 *
 * LLM Context: Production-grade document watermarking utilities for White Cross healthcare platform.
 * Provides text/image watermarks, dynamic content insertion, headers/footers, page numbering, bates numbering,
 * custom stamps, watermark positioning/opacity/rotation, QR codes, digital signatures, compliance stamps,
 * and HIPAA-compliant document marking. Essential for secure medical document processing and audit trails.
 */
import { Sequelize } from 'sequelize';
/**
 * Watermark configuration options
 */
export interface WatermarkConfig {
    text?: string;
    image?: Buffer | string;
    position?: WatermarkPosition;
    opacity?: number;
    rotation?: number;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    scale?: number;
    repeat?: boolean;
    pages?: number[] | 'all' | 'odd' | 'even' | 'first' | 'last';
    layer?: 'background' | 'foreground';
}
/**
 * Watermark position type
 */
export type WatermarkPosition = 'center' | 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | {
    x: number;
    y: number;
};
/**
 * Text watermark options
 */
export interface TextWatermarkOptions {
    text: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: 'normal' | 'bold' | 'light';
    color?: string;
    opacity?: number;
    rotation?: number;
    position?: WatermarkPosition;
    outline?: boolean;
    outlineColor?: string;
    shadow?: boolean;
    shadowColor?: string;
    shadowBlur?: number;
}
/**
 * Image watermark options
 */
export interface ImageWatermarkOptions {
    image: Buffer | string;
    width?: number;
    height?: number;
    opacity?: number;
    position?: WatermarkPosition;
    maintainAspectRatio?: boolean;
    tiled?: boolean;
    tileSpacing?: number;
}
/**
 * Header/Footer configuration
 */
export interface HeaderFooterConfig {
    text?: string;
    html?: string;
    alignment?: 'left' | 'center' | 'right';
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    margin?: number;
    height?: number;
    includePageNumber?: boolean;
    includeDate?: boolean;
    includeTitle?: boolean;
    customFields?: Record<string, string>;
    pages?: number[] | 'all' | 'odd' | 'even';
}
/**
 * Page numbering configuration
 */
export interface PageNumberingConfig {
    format?: 'numeric' | 'roman' | 'alpha' | 'custom';
    customFormat?: string;
    position?: WatermarkPosition;
    prefix?: string;
    suffix?: string;
    startNumber?: number;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    includeTotal?: boolean;
    separator?: string;
    pages?: number[] | 'all' | 'odd' | 'even';
}
/**
 * Bates numbering configuration
 */
export interface BatesNumberingConfig {
    prefix: string;
    startNumber: number;
    digits: number;
    suffix?: string;
    position?: WatermarkPosition;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    includeDate?: boolean;
    dateFormat?: string;
}
/**
 * Stamp configuration
 */
export interface StampConfig {
    type: 'approval' | 'confidential' | 'draft' | 'urgent' | 'reviewed' | 'custom';
    text?: string;
    shape?: 'rectangle' | 'circle' | 'rounded' | 'hexagon';
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    opacity?: number;
    rotation?: number;
    position?: WatermarkPosition;
    size?: {
        width: number;
        height: number;
    };
    icon?: string;
    includeDate?: boolean;
    includeUser?: string;
}
/**
 * Digital signature stamp
 */
export interface DigitalSignatureStamp {
    signerName: string;
    signatureImage?: Buffer;
    timestamp: Date;
    reason?: string;
    location?: string;
    contactInfo?: string;
    certificateId?: string;
    position?: WatermarkPosition;
    size?: {
        width: number;
        height: number;
    };
    includeQR?: boolean;
}
/**
 * QR code watermark configuration
 */
export interface QRCodeWatermarkConfig {
    data: string;
    size?: number;
    position?: WatermarkPosition;
    errorCorrection?: 'L' | 'M' | 'Q' | 'H';
    margin?: number;
    color?: string;
    backgroundColor?: string;
    includeLabel?: boolean;
    labelText?: string;
}
/**
 * Dynamic content field
 */
export interface DynamicContentField {
    name: string;
    value: string | number | Date;
    format?: string;
    position?: WatermarkPosition;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
}
/**
 * Watermark template
 */
export interface WatermarkTemplate {
    id: string;
    name: string;
    type: 'text' | 'image' | 'stamp' | 'composite';
    config: WatermarkConfig | StampConfig;
    isActive: boolean;
    createdBy?: string;
    organizationId?: string;
}
/**
 * Batch watermark job
 */
export interface BatchWatermarkJob {
    jobId: string;
    documentIds: string[];
    watermarkConfig: WatermarkConfig;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    totalDocuments: number;
    processedDocuments: number;
    failedDocuments: number;
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
}
/**
 * Watermark validation result
 */
export interface WatermarkValidationResult {
    valid: boolean;
    errors: string[];
    warnings?: string[];
    suggestedAdjustments?: Record<string, any>;
}
/**
 * Watermark model attributes interface
 */
export interface WatermarkAttributes {
    id: string;
    documentId: string;
    templateId?: string;
    type: 'text' | 'image' | 'stamp' | 'header' | 'footer' | 'page_number' | 'bates';
    content?: string;
    imageData?: Buffer;
    position: string;
    opacity: number;
    rotation: number;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    pages: string;
    layer: 'background' | 'foreground';
    appliedBy?: string;
    appliedAt: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Watermark template model attributes interface
 */
export interface WatermarkTemplateAttributes {
    id: string;
    name: string;
    description?: string;
    type: 'text' | 'image' | 'stamp' | 'composite';
    configuration: Record<string, any>;
    previewImage?: Buffer;
    organizationId?: string;
    departmentId?: string;
    isActive: boolean;
    isDefault: boolean;
    usageCount: number;
    createdBy?: string;
    lastUsedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Stamp model attributes interface
 */
export interface StampAttributes {
    id: string;
    name: string;
    type: 'approval' | 'confidential' | 'draft' | 'urgent' | 'reviewed' | 'signature' | 'custom';
    text?: string;
    imageData?: Buffer;
    shape: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth: number;
    width: number;
    height: number;
    organizationId?: string;
    createdBy?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates Watermark model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<WatermarkAttributes>>} Watermark model
 *
 * @example
 * ```typescript
 * const WatermarkModel = createWatermarkModel(sequelize);
 * const watermark = await WatermarkModel.create({
 *   documentId: 'doc-123',
 *   type: 'text',
 *   content: 'CONFIDENTIAL',
 *   position: 'center',
 *   opacity: 0.3,
 *   rotation: 45,
 *   pages: 'all',
 *   layer: 'foreground'
 * });
 * ```
 */
export declare const createWatermarkModel: (sequelize: Sequelize) => any;
/**
 * Creates WatermarkTemplate model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<WatermarkTemplateAttributes>>} WatermarkTemplate model
 *
 * @example
 * ```typescript
 * const TemplateModel = createWatermarkTemplateModel(sequelize);
 * const template = await TemplateModel.create({
 *   name: 'Confidential Stamp',
 *   type: 'stamp',
 *   configuration: { text: 'CONFIDENTIAL', color: '#FF0000', opacity: 0.7 },
 *   organizationId: 'org-123',
 *   isActive: true
 * });
 * ```
 */
export declare const createWatermarkTemplateModel: (sequelize: Sequelize) => any;
/**
 * Creates Stamp model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<StampAttributes>>} Stamp model
 *
 * @example
 * ```typescript
 * const StampModel = createStampModel(sequelize);
 * const stamp = await StampModel.create({
 *   name: 'Approved Stamp',
 *   type: 'approval',
 *   text: 'APPROVED',
 *   shape: 'rounded',
 *   color: '#00FF00',
 *   width: 200,
 *   height: 80
 * });
 * ```
 */
export declare const createStampModel: (sequelize: Sequelize) => any;
/**
 * 1. Adds text watermark to PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {TextWatermarkOptions} options - Text watermark configuration
 * @returns {Promise<Buffer>} PDF with text watermark applied
 *
 * @example
 * ```typescript
 * const watermarked = await addTextWatermark(pdfBuffer, {
 *   text: 'CONFIDENTIAL',
 *   fontSize: 72,
 *   color: '#FF0000',
 *   opacity: 0.3,
 *   rotation: 45,
 *   position: 'center'
 * });
 * ```
 */
export declare const addTextWatermark: (pdfBuffer: Buffer, options: TextWatermarkOptions) => Promise<Buffer>;
/**
 * 2. Adds diagonal text watermark across entire page.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} text - Watermark text
 * @param {number} [opacity] - Opacity (0-1)
 * @returns {Promise<Buffer>} PDF with diagonal watermark
 *
 * @example
 * ```typescript
 * const watermarked = await addDiagonalTextWatermark(pdfBuffer, 'DRAFT', 0.2);
 * ```
 */
export declare const addDiagonalTextWatermark: (pdfBuffer: Buffer, text: string, opacity?: number) => Promise<Buffer>;
/**
 * 3. Adds multi-line text watermark.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string[]} lines - Array of text lines
 * @param {Partial<TextWatermarkOptions>} [options] - Watermark options
 * @returns {Promise<Buffer>} PDF with multi-line watermark
 *
 * @example
 * ```typescript
 * const watermarked = await addMultiLineTextWatermark(pdfBuffer, [
 *   'CONFIDENTIAL',
 *   'DO NOT DISTRIBUTE',
 *   'Property of Medical Center'
 * ], { fontSize: 24, opacity: 0.4 });
 * ```
 */
export declare const addMultiLineTextWatermark: (pdfBuffer: Buffer, lines: string[], options?: Partial<TextWatermarkOptions>) => Promise<Buffer>;
/**
 * 4. Adds outlined text watermark with border.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} text - Watermark text
 * @param {Object} [options] - Outline options
 * @returns {Promise<Buffer>} PDF with outlined watermark
 *
 * @example
 * ```typescript
 * const watermarked = await addOutlinedTextWatermark(pdfBuffer, 'CONFIDENTIAL', {
 *   textColor: '#FFFFFF',
 *   outlineColor: '#000000',
 *   outlineWidth: 2,
 *   fontSize: 60
 * });
 * ```
 */
export declare const addOutlinedTextWatermark: (pdfBuffer: Buffer, text: string, options?: {
    textColor?: string;
    outlineColor?: string;
    outlineWidth?: number;
    fontSize?: number;
    opacity?: number;
}) => Promise<Buffer>;
/**
 * 5. Adds shadowed text watermark for depth effect.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} text - Watermark text
 * @param {Object} [options] - Shadow options
 * @returns {Promise<Buffer>} PDF with shadowed watermark
 *
 * @example
 * ```typescript
 * const watermarked = await addShadowedTextWatermark(pdfBuffer, 'DRAFT', {
 *   shadowColor: '#333333',
 *   shadowBlur: 10,
 *   shadowOffset: { x: 3, y: 3 }
 * });
 * ```
 */
export declare const addShadowedTextWatermark: (pdfBuffer: Buffer, text: string, options?: {
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffset?: {
        x: number;
        y: number;
    };
}) => Promise<Buffer>;
/**
 * 6. Adds image watermark to PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {ImageWatermarkOptions} options - Image watermark configuration
 * @returns {Promise<Buffer>} PDF with image watermark applied
 *
 * @example
 * ```typescript
 * const watermarked = await addImageWatermark(pdfBuffer, {
 *   image: logoBuffer,
 *   width: 200,
 *   height: 100,
 *   opacity: 0.5,
 *   position: 'top-right'
 * });
 * ```
 */
export declare const addImageWatermark: (pdfBuffer: Buffer, options: ImageWatermarkOptions) => Promise<Buffer>;
/**
 * 7. Adds tiled image watermark across entire page.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {Buffer} imageBuffer - Image to tile
 * @param {Object} [options] - Tiling options
 * @returns {Promise<Buffer>} PDF with tiled watermark
 *
 * @example
 * ```typescript
 * const watermarked = await addTiledImageWatermark(pdfBuffer, logoBuffer, {
 *   spacing: 50,
 *   opacity: 0.1,
 *   rotation: 30
 * });
 * ```
 */
export declare const addTiledImageWatermark: (pdfBuffer: Buffer, imageBuffer: Buffer, options?: {
    spacing?: number;
    opacity?: number;
    rotation?: number;
}) => Promise<Buffer>;
/**
 * 8. Adds logo watermark in corner of document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {Buffer} logoBuffer - Logo image buffer
 * @param {WatermarkPosition} [position] - Corner position
 * @param {number} [size] - Logo size
 * @returns {Promise<Buffer>} PDF with logo watermark
 *
 * @example
 * ```typescript
 * const watermarked = await addLogoWatermark(pdfBuffer, logoBuffer, 'top-right', 150);
 * ```
 */
export declare const addLogoWatermark: (pdfBuffer: Buffer, logoBuffer: Buffer, position?: WatermarkPosition, size?: number) => Promise<Buffer>;
/**
 * 9. Adds QR code watermark to document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {QRCodeWatermarkConfig} config - QR code configuration
 * @returns {Promise<Buffer>} PDF with QR code watermark
 *
 * @example
 * ```typescript
 * const watermarked = await addQRCodeWatermark(pdfBuffer, {
 *   data: 'https://verify.example.com/doc/123',
 *   size: 100,
 *   position: 'bottom-right',
 *   includeLabel: true,
 *   labelText: 'Scan to verify'
 * });
 * ```
 */
export declare const addQRCodeWatermark: (pdfBuffer: Buffer, config: QRCodeWatermarkConfig) => Promise<Buffer>;
/**
 * 10. Adds barcode watermark to document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} barcodeData - Barcode data
 * @param {Object} [options] - Barcode options
 * @returns {Promise<Buffer>} PDF with barcode watermark
 *
 * @example
 * ```typescript
 * const watermarked = await addBarcodeWatermark(pdfBuffer, 'DOC-2024-001', {
 *   type: 'code128',
 *   position: 'bottom-center',
 *   height: 50
 * });
 * ```
 */
export declare const addBarcodeWatermark: (pdfBuffer: Buffer, barcodeData: string, options?: {
    type?: "code128" | "code39" | "ean13" | "qr";
    position?: WatermarkPosition;
    height?: number;
    width?: number;
}) => Promise<Buffer>;
/**
 * 11. Adds header to PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {HeaderFooterConfig} config - Header configuration
 * @returns {Promise<Buffer>} PDF with header added
 *
 * @example
 * ```typescript
 * const withHeader = await addHeader(pdfBuffer, {
 *   text: 'Medical Report - Confidential',
 *   alignment: 'center',
 *   fontSize: 12,
 *   color: '#333333',
 *   includeDate: true
 * });
 * ```
 */
export declare const addHeader: (pdfBuffer: Buffer, config: HeaderFooterConfig) => Promise<Buffer>;
/**
 * 12. Adds footer to PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {HeaderFooterConfig} config - Footer configuration
 * @returns {Promise<Buffer>} PDF with footer added
 *
 * @example
 * ```typescript
 * const withFooter = await addFooter(pdfBuffer, {
 *   text: 'Confidential - Do Not Distribute',
 *   alignment: 'center',
 *   includePageNumber: true,
 *   fontSize: 10
 * });
 * ```
 */
export declare const addFooter: (pdfBuffer: Buffer, config: HeaderFooterConfig) => Promise<Buffer>;
/**
 * 13. Adds header and footer in single operation.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {HeaderFooterConfig} headerConfig - Header configuration
 * @param {HeaderFooterConfig} footerConfig - Footer configuration
 * @returns {Promise<Buffer>} PDF with header and footer
 *
 * @example
 * ```typescript
 * const withHeaderFooter = await addHeaderAndFooter(
 *   pdfBuffer,
 *   { text: 'Medical Report', alignment: 'left' },
 *   { text: 'Confidential', alignment: 'center', includePageNumber: true }
 * );
 * ```
 */
export declare const addHeaderAndFooter: (pdfBuffer: Buffer, headerConfig: HeaderFooterConfig, footerConfig: HeaderFooterConfig) => Promise<Buffer>;
/**
 * 14. Adds dynamic header with custom fields.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {Record<string, string>} fields - Dynamic field values
 * @param {string} template - Header template with placeholders
 * @returns {Promise<Buffer>} PDF with dynamic header
 *
 * @example
 * ```typescript
 * const withHeader = await addDynamicHeader(pdfBuffer, {
 *   patientName: 'John Doe',
 *   mrn: 'MRN-12345',
 *   date: '2024-01-15'
 * }, 'Patient: {patientName} | MRN: {mrn} | Date: {date}');
 * ```
 */
export declare const addDynamicHeader: (pdfBuffer: Buffer, fields: Record<string, string>, template: string) => Promise<Buffer>;
/**
 * 15. Adds dynamic footer with custom fields.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {Record<string, string>} fields - Dynamic field values
 * @param {string} template - Footer template with placeholders
 * @returns {Promise<Buffer>} PDF with dynamic footer
 *
 * @example
 * ```typescript
 * const withFooter = await addDynamicFooter(pdfBuffer, {
 *   facility: 'City Hospital',
 *   phone: '555-0100'
 * }, '{facility} | {phone} | Page {page} of {total}');
 * ```
 */
export declare const addDynamicFooter: (pdfBuffer: Buffer, fields: Record<string, string>, template: string) => Promise<Buffer>;
/**
 * 16. Adds page numbers to PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {PageNumberingConfig} config - Page numbering configuration
 * @returns {Promise<Buffer>} PDF with page numbers
 *
 * @example
 * ```typescript
 * const numbered = await addPageNumbers(pdfBuffer, {
 *   format: 'numeric',
 *   position: 'bottom-center',
 *   includeTotal: true,
 *   prefix: 'Page ',
 *   separator: ' of '
 * });
 * ```
 */
export declare const addPageNumbers: (pdfBuffer: Buffer, config: PageNumberingConfig) => Promise<Buffer>;
/**
 * 17. Adds page numbers in Roman numeral format.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {WatermarkPosition} [position] - Number position
 * @param {boolean} [lowercase] - Use lowercase roman numerals
 * @returns {Promise<Buffer>} PDF with Roman numeral page numbers
 *
 * @example
 * ```typescript
 * const numbered = await addRomanPageNumbers(pdfBuffer, 'bottom-center', false);
 * // Results in: I, II, III, IV, etc.
 * ```
 */
export declare const addRomanPageNumbers: (pdfBuffer: Buffer, position?: WatermarkPosition, lowercase?: boolean) => Promise<Buffer>;
/**
 * 18. Adds page numbers with custom format string.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} format - Custom format (e.g., "Page {n} of {total}")
 * @param {WatermarkPosition} [position] - Number position
 * @returns {Promise<Buffer>} PDF with custom formatted page numbers
 *
 * @example
 * ```typescript
 * const numbered = await addCustomPageNumbers(
 *   pdfBuffer,
 *   'Sheet {n}/{total}',
 *   'bottom-right'
 * );
 * ```
 */
export declare const addCustomPageNumbers: (pdfBuffer: Buffer, format: string, position?: WatermarkPosition) => Promise<Buffer>;
/**
 * 19. Adds page numbers to specific page ranges only.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {number[]} pageNumbers - Page numbers to add numbering to
 * @param {Partial<PageNumberingConfig>} [config] - Numbering configuration
 * @returns {Promise<Buffer>} PDF with selective page numbers
 *
 * @example
 * ```typescript
 * const numbered = await addPageNumbersToRange(pdfBuffer, [1, 3, 5, 7], {
 *   format: 'numeric',
 *   position: 'bottom-center'
 * });
 * ```
 */
export declare const addPageNumbersToRange: (pdfBuffer: Buffer, pageNumbers: number[], config?: Partial<PageNumberingConfig>) => Promise<Buffer>;
/**
 * 20. Adds page numbers starting from custom number.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {number} startNumber - Starting page number
 * @param {Partial<PageNumberingConfig>} [config] - Numbering configuration
 * @returns {Promise<Buffer>} PDF with custom start page numbers
 *
 * @example
 * ```typescript
 * const numbered = await addPageNumbersFromStart(pdfBuffer, 5, {
 *   format: 'numeric',
 *   includeTotal: false
 * });
 * // Results in: 5, 6, 7, 8, etc.
 * ```
 */
export declare const addPageNumbersFromStart: (pdfBuffer: Buffer, startNumber: number, config?: Partial<PageNumberingConfig>) => Promise<Buffer>;
/**
 * 21. Adds Bates numbering to PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {BatesNumberingConfig} config - Bates numbering configuration
 * @returns {Promise<Buffer>} PDF with Bates numbers
 *
 * @example
 * ```typescript
 * const batesNumbered = await addBatesNumbering(pdfBuffer, {
 *   prefix: 'MED',
 *   startNumber: 1,
 *   digits: 6,
 *   suffix: '-2024',
 *   position: 'bottom-right',
 *   includeDate: true
 * });
 * // Results in: MED000001-2024, MED000002-2024, etc.
 * ```
 */
export declare const addBatesNumbering: (pdfBuffer: Buffer, config: BatesNumberingConfig) => Promise<Buffer>;
/**
 * 22. Adds Bates numbering with date stamp.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} prefix - Bates number prefix
 * @param {number} startNumber - Starting number
 * @param {number} [digits] - Number of digits
 * @returns {Promise<Buffer>} PDF with dated Bates numbers
 *
 * @example
 * ```typescript
 * const batesNumbered = await addBatesNumberingWithDate(pdfBuffer, 'DOC', 1, 6);
 * // Results in: DOC000001-20240115, DOC000002-20240115, etc.
 * ```
 */
export declare const addBatesNumberingWithDate: (pdfBuffer: Buffer, prefix: string, startNumber: number, digits?: number) => Promise<Buffer>;
/**
 * 23. Generates next Bates number in sequence.
 *
 * @param {string} prefix - Bates number prefix
 * @param {number} currentNumber - Current number in sequence
 * @param {number} [digits] - Number of digits
 * @param {string} [suffix] - Optional suffix
 * @returns {string} Next Bates number
 *
 * @example
 * ```typescript
 * const nextBates = generateNextBatesNumber('MED', 42, 6, '-2024');
 * // Returns: 'MED000043-2024'
 * ```
 */
export declare const generateNextBatesNumber: (prefix: string, currentNumber: number, digits?: number, suffix?: string) => string;
/**
 * 24. Validates Bates number format.
 *
 * @param {string} batesNumber - Bates number to validate
 * @param {string} expectedPrefix - Expected prefix
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateBatesNumber('MED000123-2024', 'MED');
 * // Returns: true
 * ```
 */
export declare const validateBatesNumber: (batesNumber: string, expectedPrefix: string) => boolean;
/**
 * 25. Extracts Bates number components.
 *
 * @param {string} batesNumber - Bates number to parse
 * @returns {Object} Parsed components
 *
 * @example
 * ```typescript
 * const components = parseBatesNumber('MED000123-2024');
 * // Returns: { prefix: 'MED', number: 123, suffix: '-2024' }
 * ```
 */
export declare const parseBatesNumber: (batesNumber: string) => {
    prefix: string;
    number: number;
    suffix?: string;
} | null;
/**
 * 26. Adds custom stamp to PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {StampConfig} config - Stamp configuration
 * @returns {Promise<Buffer>} PDF with stamp applied
 *
 * @example
 * ```typescript
 * const stamped = await addCustomStamp(pdfBuffer, {
 *   type: 'approval',
 *   text: 'APPROVED',
 *   color: '#00FF00',
 *   position: 'top-right',
 *   shape: 'rounded',
 *   includeDate: true
 * });
 * ```
 */
export declare const addCustomStamp: (pdfBuffer: Buffer, config: StampConfig) => Promise<Buffer>;
/**
 * 27. Adds confidential stamp to document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {WatermarkPosition} [position] - Stamp position
 * @returns {Promise<Buffer>} PDF with confidential stamp
 *
 * @example
 * ```typescript
 * const stamped = await addConfidentialStamp(pdfBuffer, 'top-center');
 * ```
 */
export declare const addConfidentialStamp: (pdfBuffer: Buffer, position?: WatermarkPosition) => Promise<Buffer>;
/**
 * 28. Adds draft stamp to document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {WatermarkPosition} [position] - Stamp position
 * @returns {Promise<Buffer>} PDF with draft stamp
 *
 * @example
 * ```typescript
 * const stamped = await addDraftStamp(pdfBuffer, 'center');
 * ```
 */
export declare const addDraftStamp: (pdfBuffer: Buffer, position?: WatermarkPosition) => Promise<Buffer>;
/**
 * 29. Adds urgent stamp to document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {WatermarkPosition} [position] - Stamp position
 * @returns {Promise<Buffer>} PDF with urgent stamp
 *
 * @example
 * ```typescript
 * const stamped = await addUrgentStamp(pdfBuffer, 'top-right');
 * ```
 */
export declare const addUrgentStamp: (pdfBuffer: Buffer, position?: WatermarkPosition) => Promise<Buffer>;
/**
 * 30. Adds approval stamp with signature and date.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} approverName - Name of approver
 * @param {Date} [approvalDate] - Approval date
 * @param {WatermarkPosition} [position] - Stamp position
 * @returns {Promise<Buffer>} PDF with approval stamp
 *
 * @example
 * ```typescript
 * const stamped = await addApprovalStamp(pdfBuffer, 'Dr. Smith', new Date(), 'bottom-right');
 * ```
 */
export declare const addApprovalStamp: (pdfBuffer: Buffer, approverName: string, approvalDate?: Date, position?: WatermarkPosition) => Promise<Buffer>;
/**
 * 31. Adds digital signature stamp to document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {DigitalSignatureStamp} signature - Signature configuration
 * @returns {Promise<Buffer>} PDF with digital signature stamp
 *
 * @example
 * ```typescript
 * const signed = await addDigitalSignatureStamp(pdfBuffer, {
 *   signerName: 'Dr. Jane Smith',
 *   signatureImage: signatureBuffer,
 *   timestamp: new Date(),
 *   reason: 'Approval',
 *   location: 'Medical Records Dept',
 *   position: 'bottom-left',
 *   includeQR: true
 * });
 * ```
 */
export declare const addDigitalSignatureStamp: (pdfBuffer: Buffer, signature: DigitalSignatureStamp) => Promise<Buffer>;
/**
 * 32. Adds timestamp stamp to document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {Date} [timestamp] - Timestamp to use
 * @param {WatermarkPosition} [position] - Stamp position
 * @returns {Promise<Buffer>} PDF with timestamp stamp
 *
 * @example
 * ```typescript
 * const stamped = await addTimestampStamp(pdfBuffer, new Date(), 'bottom-center');
 * ```
 */
export declare const addTimestampStamp: (pdfBuffer: Buffer, timestamp?: Date, position?: WatermarkPosition) => Promise<Buffer>;
/**
 * 33. Adds verification stamp with QR code.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} verificationUrl - URL for verification
 * @param {WatermarkPosition} [position] - Stamp position
 * @returns {Promise<Buffer>} PDF with verification stamp
 *
 * @example
 * ```typescript
 * const stamped = await addVerificationStamp(
 *   pdfBuffer,
 *   'https://verify.example.com/doc/123',
 *   'bottom-right'
 * );
 * ```
 */
export declare const addVerificationStamp: (pdfBuffer: Buffer, verificationUrl: string, position?: WatermarkPosition) => Promise<Buffer>;
/**
 * 34. Adds compliance stamp (HIPAA, FDA, etc.).
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {string} complianceType - Type of compliance
 * @param {Object} [details] - Compliance details
 * @returns {Promise<Buffer>} PDF with compliance stamp
 *
 * @example
 * ```typescript
 * const stamped = await addComplianceStamp(pdfBuffer, 'HIPAA', {
 *   certificationId: 'HIPAA-2024-001',
 *   validUntil: new Date('2025-01-01')
 * });
 * ```
 */
export declare const addComplianceStamp: (pdfBuffer: Buffer, complianceType: string, details?: {
    certificationId?: string;
    validUntil?: Date;
    position?: WatermarkPosition;
}) => Promise<Buffer>;
/**
 * 35. Adds received stamp with date and time.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {Date} [receivedDate] - Received date
 * @param {string} [receivedBy] - Name of receiver
 * @returns {Promise<Buffer>} PDF with received stamp
 *
 * @example
 * ```typescript
 * const stamped = await addReceivedStamp(pdfBuffer, new Date(), 'Records Dept');
 * ```
 */
export declare const addReceivedStamp: (pdfBuffer: Buffer, receivedDate?: Date, receivedBy?: string) => Promise<Buffer>;
/**
 * 36. Calculates watermark position coordinates.
 *
 * @param {WatermarkPosition} position - Position specification
 * @param {Object} pageSize - Page dimensions
 * @param {Object} watermarkSize - Watermark dimensions
 * @returns {Object} X and Y coordinates
 *
 * @example
 * ```typescript
 * const coords = calculateWatermarkPosition(
 *   'top-right',
 *   { width: 612, height: 792 },
 *   { width: 200, height: 100 }
 * );
 * // Returns: { x: 412, y: 692 }
 * ```
 */
export declare const calculateWatermarkPosition: (position: WatermarkPosition, pageSize: {
    width: number;
    height: number;
}, watermarkSize: {
    width: number;
    height: number;
}) => {
    x: number;
    y: number;
};
/**
 * 37. Validates watermark configuration.
 *
 * @param {WatermarkConfig} config - Watermark configuration to validate
 * @returns {WatermarkValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateWatermarkConfig({
 *   text: 'CONFIDENTIAL',
 *   opacity: 0.3,
 *   rotation: 45,
 *   position: 'center'
 * });
 * if (!validation.valid) {
 *   console.error('Errors:', validation.errors);
 * }
 * ```
 */
export declare const validateWatermarkConfig: (config: WatermarkConfig) => WatermarkValidationResult;
/**
 * 38. Applies watermark to specific pages only.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {WatermarkConfig} config - Watermark configuration
 * @param {number[]} pageNumbers - Page numbers to watermark
 * @returns {Promise<Buffer>} PDF with selective watermarking
 *
 * @example
 * ```typescript
 * const watermarked = await applyWatermarkToPages(
 *   pdfBuffer,
 *   { text: 'DRAFT', opacity: 0.3 },
 *   [1, 3, 5, 7]
 * );
 * ```
 */
export declare const applyWatermarkToPages: (pdfBuffer: Buffer, config: WatermarkConfig, pageNumbers: number[]) => Promise<Buffer>;
/**
 * 39. Removes existing watermarks from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF with watermarks removed
 *
 * @example
 * ```typescript
 * const cleaned = await removeWatermarks(watermarkedPdfBuffer);
 * ```
 */
export declare const removeWatermarks: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 40. Applies batch watermarking to multiple documents.
 *
 * @param {Buffer[]} pdfBuffers - Array of PDF buffers
 * @param {WatermarkConfig} config - Watermark configuration
 * @param {Function} [progressCallback] - Progress callback
 * @returns {Promise<Buffer[]>} Array of watermarked PDFs
 *
 * @example
 * ```typescript
 * const watermarked = await batchWatermarkDocuments(
 *   [pdf1, pdf2, pdf3],
 *   { text: 'CONFIDENTIAL', opacity: 0.3 },
 *   (progress) => console.log(`${progress}% complete`)
 * );
 * ```
 */
export declare const batchWatermarkDocuments: (pdfBuffers: Buffer[], config: WatermarkConfig, progressCallback?: (progress: number) => void) => Promise<Buffer[]>;
declare const _default: {
    addTextWatermark: (pdfBuffer: Buffer, options: TextWatermarkOptions) => Promise<Buffer>;
    addDiagonalTextWatermark: (pdfBuffer: Buffer, text: string, opacity?: number) => Promise<Buffer>;
    addMultiLineTextWatermark: (pdfBuffer: Buffer, lines: string[], options?: Partial<TextWatermarkOptions>) => Promise<Buffer>;
    addOutlinedTextWatermark: (pdfBuffer: Buffer, text: string, options?: {
        textColor?: string;
        outlineColor?: string;
        outlineWidth?: number;
        fontSize?: number;
        opacity?: number;
    }) => Promise<Buffer>;
    addShadowedTextWatermark: (pdfBuffer: Buffer, text: string, options?: {
        shadowColor?: string;
        shadowBlur?: number;
        shadowOffset?: {
            x: number;
            y: number;
        };
    }) => Promise<Buffer>;
    addImageWatermark: (pdfBuffer: Buffer, options: ImageWatermarkOptions) => Promise<Buffer>;
    addTiledImageWatermark: (pdfBuffer: Buffer, imageBuffer: Buffer, options?: {
        spacing?: number;
        opacity?: number;
        rotation?: number;
    }) => Promise<Buffer>;
    addLogoWatermark: (pdfBuffer: Buffer, logoBuffer: Buffer, position?: WatermarkPosition, size?: number) => Promise<Buffer>;
    addQRCodeWatermark: (pdfBuffer: Buffer, config: QRCodeWatermarkConfig) => Promise<Buffer>;
    addBarcodeWatermark: (pdfBuffer: Buffer, barcodeData: string, options?: {
        type?: "code128" | "code39" | "ean13" | "qr";
        position?: WatermarkPosition;
        height?: number;
        width?: number;
    }) => Promise<Buffer>;
    addHeader: (pdfBuffer: Buffer, config: HeaderFooterConfig) => Promise<Buffer>;
    addFooter: (pdfBuffer: Buffer, config: HeaderFooterConfig) => Promise<Buffer>;
    addHeaderAndFooter: (pdfBuffer: Buffer, headerConfig: HeaderFooterConfig, footerConfig: HeaderFooterConfig) => Promise<Buffer>;
    addDynamicHeader: (pdfBuffer: Buffer, fields: Record<string, string>, template: string) => Promise<Buffer>;
    addDynamicFooter: (pdfBuffer: Buffer, fields: Record<string, string>, template: string) => Promise<Buffer>;
    addPageNumbers: (pdfBuffer: Buffer, config: PageNumberingConfig) => Promise<Buffer>;
    addRomanPageNumbers: (pdfBuffer: Buffer, position?: WatermarkPosition, lowercase?: boolean) => Promise<Buffer>;
    addCustomPageNumbers: (pdfBuffer: Buffer, format: string, position?: WatermarkPosition) => Promise<Buffer>;
    addPageNumbersToRange: (pdfBuffer: Buffer, pageNumbers: number[], config?: Partial<PageNumberingConfig>) => Promise<Buffer>;
    addPageNumbersFromStart: (pdfBuffer: Buffer, startNumber: number, config?: Partial<PageNumberingConfig>) => Promise<Buffer>;
    addBatesNumbering: (pdfBuffer: Buffer, config: BatesNumberingConfig) => Promise<Buffer>;
    addBatesNumberingWithDate: (pdfBuffer: Buffer, prefix: string, startNumber: number, digits?: number) => Promise<Buffer>;
    generateNextBatesNumber: (prefix: string, currentNumber: number, digits?: number, suffix?: string) => string;
    validateBatesNumber: (batesNumber: string, expectedPrefix: string) => boolean;
    parseBatesNumber: (batesNumber: string) => {
        prefix: string;
        number: number;
        suffix?: string;
    } | null;
    addCustomStamp: (pdfBuffer: Buffer, config: StampConfig) => Promise<Buffer>;
    addConfidentialStamp: (pdfBuffer: Buffer, position?: WatermarkPosition) => Promise<Buffer>;
    addDraftStamp: (pdfBuffer: Buffer, position?: WatermarkPosition) => Promise<Buffer>;
    addUrgentStamp: (pdfBuffer: Buffer, position?: WatermarkPosition) => Promise<Buffer>;
    addApprovalStamp: (pdfBuffer: Buffer, approverName: string, approvalDate?: Date, position?: WatermarkPosition) => Promise<Buffer>;
    addDigitalSignatureStamp: (pdfBuffer: Buffer, signature: DigitalSignatureStamp) => Promise<Buffer>;
    addTimestampStamp: (pdfBuffer: Buffer, timestamp?: Date, position?: WatermarkPosition) => Promise<Buffer>;
    addVerificationStamp: (pdfBuffer: Buffer, verificationUrl: string, position?: WatermarkPosition) => Promise<Buffer>;
    addComplianceStamp: (pdfBuffer: Buffer, complianceType: string, details?: {
        certificationId?: string;
        validUntil?: Date;
        position?: WatermarkPosition;
    }) => Promise<Buffer>;
    addReceivedStamp: (pdfBuffer: Buffer, receivedDate?: Date, receivedBy?: string) => Promise<Buffer>;
    calculateWatermarkPosition: (position: WatermarkPosition, pageSize: {
        width: number;
        height: number;
    }, watermarkSize: {
        width: number;
        height: number;
    }) => {
        x: number;
        y: number;
    };
    validateWatermarkConfig: (config: WatermarkConfig) => WatermarkValidationResult;
    applyWatermarkToPages: (pdfBuffer: Buffer, config: WatermarkConfig, pageNumbers: number[]) => Promise<Buffer>;
    removeWatermarks: (pdfBuffer: Buffer) => Promise<Buffer>;
    batchWatermarkDocuments: (pdfBuffers: Buffer[], config: WatermarkConfig, progressCallback?: (progress: number) => void) => Promise<Buffer[]>;
    createWatermarkModel: (sequelize: Sequelize) => any;
    createWatermarkTemplateModel: (sequelize: Sequelize) => any;
    createStampModel: (sequelize: Sequelize) => any;
};
export default _default;
//# sourceMappingURL=document-watermarking-kit.d.ts.map