/**
 * LOC: DOC-PAG-001
 * File: /reuse/document/document-pagination-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize (v6.x)
 *   - pdfkit
 *   - pdf-lib
 *
 * DOWNSTREAM (imported by):
 *   - Document generation services
 *   - PDF rendering controllers
 *   - Report generation modules
 *   - Document layout services
 */
/**
 * File: /reuse/document/document-pagination-kit.ts
 * Locator: WC-UTL-DOCPAG-001
 * Purpose: Document Pagination & Page Numbers Kit - Comprehensive pagination utilities for NestJS
 *
 * Upstream: @nestjs/common, @nestjs/config, sequelize, pdfkit, pdf-lib
 * Downstream: Document services, PDF controllers, report modules, layout services
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, PDFKit 0.14.x, pdf-lib 1.17.x
 * Exports: 35 utility functions for page numbering, headers/footers, Bates numbering, multi-section pagination
 *
 * LLM Context: Production-grade document pagination utilities for White Cross healthcare platform.
 * Provides page numbering styles, positioning control, section-based headers/footers, Bates numbering,
 * custom formats, page ranges, watermarks per page, dynamic content, multi-section numbering, TOC generation,
 * index page handling, and HIPAA-compliant page tracking. Essential for medical document generation,
 * reports, patient records, and regulatory compliance documentation.
 */
import { Sequelize } from 'sequelize';
/**
 * Document pagination configuration from environment
 */
export interface PaginationConfigEnv {
    DEFAULT_PAGE_SIZE: string;
    DEFAULT_MARGIN_TOP: string;
    DEFAULT_MARGIN_BOTTOM: string;
    DEFAULT_MARGIN_LEFT: string;
    DEFAULT_MARGIN_RIGHT: string;
    ENABLE_BATES_NUMBERING: string;
    BATES_PREFIX: string;
    BATES_START_NUMBER: string;
    BATES_DIGIT_COUNT: string;
    HEADER_FONT_SIZE: string;
    FOOTER_FONT_SIZE: string;
    PAGE_NUMBER_FORMAT: string;
    ENABLE_PAGE_WATERMARK: string;
    MAX_PAGES_PER_DOCUMENT: string;
}
/**
 * Loads pagination configuration from environment variables.
 *
 * @returns {PaginationConfig} Pagination configuration object
 *
 * @example
 * ```typescript
 * const config = loadPaginationConfig();
 * console.log('Default page size:', config.defaultPageSize);
 * ```
 */
export declare const loadPaginationConfig: () => PaginationConfig;
/**
 * Validates pagination configuration.
 *
 * @param {PaginationConfig} config - Configuration to validate
 * @returns {string[]} Array of validation errors (empty if valid)
 *
 * @example
 * ```typescript
 * const errors = validatePaginationConfig(config);
 * if (errors.length > 0) {
 *   throw new Error(`Invalid config: ${errors.join(', ')}`);
 * }
 * ```
 */
export declare const validatePaginationConfig: (config: PaginationConfig) => string[];
/**
 * Page size configuration
 */
export type PageSize = 'LETTER' | 'A4' | 'LEGAL' | 'TABLOID' | 'A3' | 'A5';
/**
 * Page orientation
 */
export type PageOrientation = 'portrait' | 'landscape';
/**
 * Page numbering style
 */
export type PageNumberStyle = 'arabic' | 'roman' | 'roman-upper' | 'alpha' | 'alpha-upper' | 'custom';
/**
 * Page number position
 */
export type PageNumberPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
/**
 * Pagination configuration
 */
export interface PaginationConfig {
    defaultPageSize: PageSize | string;
    margins: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
    enableBatesNumbering: boolean;
    batesPrefix: string;
    batesStartNumber: number;
    batesDigitCount: number;
    headerFontSize: number;
    footerFontSize: number;
    pageNumberFormat: string;
    enablePageWatermark: boolean;
    maxPagesPerDocument: number;
}
/**
 * Page margins
 */
export interface PageMargins {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
/**
 * Page number options
 */
export interface PageNumberOptions {
    style: PageNumberStyle;
    position: PageNumberPosition;
    format?: string;
    startPage?: number;
    prefix?: string;
    suffix?: string;
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    alignment?: 'left' | 'center' | 'right';
}
/**
 * Header configuration
 */
export interface HeaderConfig {
    content: string | ((pageNum: number, totalPages: number) => string);
    height: number;
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    alignment?: 'left' | 'center' | 'right';
    showOnFirstPage?: boolean;
    sections?: SectionHeaderConfig[];
}
/**
 * Footer configuration
 */
export interface FooterConfig {
    content: string | ((pageNum: number, totalPages: number) => string);
    height: number;
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    alignment?: 'left' | 'center' | 'right';
    showOnFirstPage?: boolean;
    sections?: SectionFooterConfig[];
}
/**
 * Section-specific header configuration
 */
export interface SectionHeaderConfig {
    sectionId: string;
    startPage: number;
    endPage?: number;
    content: string | ((pageNum: number, totalPages: number, sectionNum: number) => string);
    fontFamily?: string;
    fontSize?: number;
    color?: string;
}
/**
 * Section-specific footer configuration
 */
export interface SectionFooterConfig {
    sectionId: string;
    startPage: number;
    endPage?: number;
    content: string | ((pageNum: number, totalPages: number, sectionNum: number) => string);
    fontFamily?: string;
    fontSize?: number;
    color?: string;
}
/**
 * Bates numbering configuration
 */
export interface BatesNumberingConfig {
    prefix: string;
    startNumber: number;
    digitCount: number;
    position: PageNumberPosition;
    fontSize?: number;
    color?: string;
    includePageNumbers?: boolean;
}
/**
 * Page range specification
 */
export interface PageRange {
    start: number;
    end: number;
    section?: string;
}
/**
 * Document section
 */
export interface DocumentSection {
    id: string;
    name: string;
    startPage: number;
    endPage?: number;
    numberingStyle?: PageNumberStyle;
    restartNumbering?: boolean;
    header?: SectionHeaderConfig;
    footer?: SectionFooterConfig;
}
/**
 * Page watermark configuration
 */
export interface PageWatermarkConfig {
    text: string;
    opacity: number;
    rotation: number;
    fontSize: number;
    color?: string;
    position?: 'center' | 'diagonal';
    pages?: PageRange[];
}
/**
 * Page break configuration
 */
export interface PageBreakConfig {
    type: 'soft' | 'hard';
    beforeElement?: boolean;
    afterElement?: boolean;
}
/**
 * Document pagination model attributes
 */
export interface DocumentPaginationAttributes {
    id: string;
    documentId: string;
    totalPages: number;
    pageSize: string;
    orientation: string;
    margins: Record<string, number>;
    numberingStyle: string;
    batesEnabled: boolean;
    batesPrefix?: string;
    batesStartNumber?: number;
    hasHeaders: boolean;
    hasFooters: boolean;
    hasSections: boolean;
    sectionCount?: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates DocumentPagination model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentPaginationAttributes>>} DocumentPagination model
 *
 * @example
 * ```typescript
 * const PaginationModel = createDocumentPaginationModel(sequelize);
 * const pagination = await PaginationModel.create({
 *   documentId: 'doc-123',
 *   totalPages: 25,
 *   pageSize: 'LETTER',
 *   orientation: 'portrait'
 * });
 * ```
 */
export declare const createDocumentPaginationModel: (sequelize: Sequelize) => any;
/**
 * 1. Formats page number in Arabic numerals (1, 2, 3...).
 *
 * @param {number} pageNum - Page number
 * @param {PageNumberOptions} [options] - Formatting options
 * @returns {string} Formatted page number
 *
 * @example
 * ```typescript
 * const formatted = formatArabicNumber(5, { prefix: 'Page ', suffix: '' });
 * // Result: "Page 5"
 * ```
 */
export declare const formatArabicNumber: (pageNum: number, options?: PageNumberOptions) => string;
/**
 * 2. Formats page number in lowercase Roman numerals (i, ii, iii...).
 *
 * @param {number} pageNum - Page number
 * @param {PageNumberOptions} [options] - Formatting options
 * @returns {string} Formatted page number
 *
 * @example
 * ```typescript
 * const formatted = formatRomanNumber(5);
 * // Result: "v"
 * ```
 */
export declare const formatRomanNumber: (pageNum: number, options?: PageNumberOptions) => string;
/**
 * 3. Formats page number in uppercase Roman numerals (I, II, III...).
 *
 * @param {number} pageNum - Page number
 * @param {PageNumberOptions} [options] - Formatting options
 * @returns {string} Formatted page number
 *
 * @example
 * ```typescript
 * const formatted = formatRomanNumberUpper(5);
 * // Result: "V"
 * ```
 */
export declare const formatRomanNumberUpper: (pageNum: number, options?: PageNumberOptions) => string;
/**
 * 4. Formats page number in lowercase alphabetic (a, b, c...).
 *
 * @param {number} pageNum - Page number
 * @param {PageNumberOptions} [options] - Formatting options
 * @returns {string} Formatted page number
 *
 * @example
 * ```typescript
 * const formatted = formatAlphaNumber(3);
 * // Result: "c"
 * ```
 */
export declare const formatAlphaNumber: (pageNum: number, options?: PageNumberOptions) => string;
/**
 * 5. Formats page number in uppercase alphabetic (A, B, C...).
 *
 * @param {number} pageNum - Page number
 * @param {PageNumberOptions} [options] - Formatting options
 * @returns {string} Formatted page number
 *
 * @example
 * ```typescript
 * const formatted = formatAlphaNumberUpper(3);
 * // Result: "C"
 * ```
 */
export declare const formatAlphaNumberUpper: (pageNum: number, options?: PageNumberOptions) => string;
/**
 * 6. Formats page number using custom format string.
 *
 * @param {number} pageNum - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {string} format - Format string (e.g., "Page {page} of {total}")
 * @returns {string} Formatted page number
 *
 * @example
 * ```typescript
 * const formatted = formatCustomNumber(5, 10, 'Page {page} of {total}');
 * // Result: "Page 5 of 10"
 * ```
 */
export declare const formatCustomNumber: (pageNum: number, totalPages: number, format: string) => string;
/**
 * 7. Applies page numbering style to a page number.
 *
 * @param {number} pageNum - Page number
 * @param {PageNumberStyle} style - Numbering style
 * @param {PageNumberOptions} [options] - Additional options
 * @returns {string} Formatted page number
 *
 * @example
 * ```typescript
 * const formatted = applyPageNumberStyle(5, 'roman-upper', { prefix: 'Page ' });
 * // Result: "Page V"
 * ```
 */
export declare const applyPageNumberStyle: (pageNum: number, style: PageNumberStyle, options?: PageNumberOptions) => string;
/**
 * 8. Calculates position coordinates for page number placement.
 *
 * @param {PageNumberPosition} position - Desired position
 * @param {number} pageWidth - Page width in points
 * @param {number} pageHeight - Page height in points
 * @param {PageMargins} margins - Page margins
 * @returns {{ x: number; y: number }} Position coordinates
 *
 * @example
 * ```typescript
 * const coords = calculatePageNumberPosition('bottom-center', 612, 792, margins);
 * console.log('Position:', coords.x, coords.y);
 * ```
 */
export declare const calculatePageNumberPosition: (position: PageNumberPosition, pageWidth: number, pageHeight: number, margins: PageMargins) => {
    x: number;
    y: number;
};
/**
 * 9. Aligns page number text at position.
 *
 * @param {string} text - Page number text
 * @param {number} x - X coordinate
 * @param {string} alignment - Text alignment
 * @param {number} [textWidth] - Estimated text width
 * @returns {number} Adjusted X coordinate
 *
 * @example
 * ```typescript
 * const adjustedX = alignPageNumberText('Page 5', 300, 'center', 50);
 * ```
 */
export declare const alignPageNumberText: (text: string, x: number, alignment: "left" | "center" | "right", textWidth?: number) => number;
/**
 * 10. Creates page number configuration for PDF generation.
 *
 * @param {PageNumberOptions} options - Page number options
 * @returns {Record<string, any>} PDF page number configuration
 *
 * @example
 * ```typescript
 * const config = createPageNumberConfig({
 *   style: 'arabic',
 *   position: 'bottom-center',
 *   format: 'Page {page} of {total}'
 * });
 * ```
 */
export declare const createPageNumberConfig: (options: PageNumberOptions) => Record<string, any>;
/**
 * 11. Creates header configuration for document.
 *
 * @param {Partial<HeaderConfig>} config - Header configuration
 * @returns {HeaderConfig} Complete header configuration
 *
 * @example
 * ```typescript
 * const header = createHeaderConfig({
 *   content: 'White Cross Healthcare',
 *   height: 50,
 *   fontSize: 12
 * });
 * ```
 */
export declare const createHeaderConfig: (config: Partial<HeaderConfig>) => HeaderConfig;
/**
 * 12. Creates footer configuration for document.
 *
 * @param {Partial<FooterConfig>} config - Footer configuration
 * @returns {FooterConfig} Complete footer configuration
 *
 * @example
 * ```typescript
 * const footer = createFooterConfig({
 *   content: (page, total) => `Page ${page} of ${total}`,
 *   height: 40
 * });
 * ```
 */
export declare const createFooterConfig: (config: Partial<FooterConfig>) => FooterConfig;
/**
 * 13. Renders header content for specific page.
 *
 * @param {HeaderConfig} config - Header configuration
 * @param {number} pageNum - Current page number
 * @param {number} totalPages - Total number of pages
 * @returns {string} Rendered header content
 *
 * @example
 * ```typescript
 * const headerText = renderHeaderContent(headerConfig, 5, 10);
 * console.log('Header:', headerText);
 * ```
 */
export declare const renderHeaderContent: (config: HeaderConfig, pageNum: number, totalPages: number) => string;
/**
 * 14. Renders footer content for specific page.
 *
 * @param {FooterConfig} config - Footer configuration
 * @param {number} pageNum - Current page number
 * @param {number} totalPages - Total number of pages
 * @returns {string} Rendered footer content
 *
 * @example
 * ```typescript
 * const footerText = renderFooterContent(footerConfig, 5, 10);
 * console.log('Footer:', footerText);
 * ```
 */
export declare const renderFooterContent: (config: FooterConfig, pageNum: number, totalPages: number) => string;
/**
 * 15. Gets section-specific header for page.
 *
 * @param {HeaderConfig} config - Header configuration
 * @param {number} pageNum - Current page number
 * @returns {SectionHeaderConfig | null} Section header config or null
 *
 * @example
 * ```typescript
 * const sectionHeader = getSectionHeader(headerConfig, 15);
 * if (sectionHeader) {
 *   console.log('Section:', sectionHeader.sectionId);
 * }
 * ```
 */
export declare const getSectionHeader: (config: HeaderConfig, pageNum: number) => SectionHeaderConfig | null;
/**
 * 16. Gets section-specific footer for page.
 *
 * @param {FooterConfig} config - Footer configuration
 * @param {number} pageNum - Current page number
 * @returns {SectionFooterConfig | null} Section footer config or null
 *
 * @example
 * ```typescript
 * const sectionFooter = getSectionFooter(footerConfig, 15);
 * ```
 */
export declare const getSectionFooter: (config: FooterConfig, pageNum: number) => SectionFooterConfig | null;
/**
 * 17. Formats Bates number with prefix and padding.
 *
 * @param {number} number - Sequential number
 * @param {BatesNumberingConfig} config - Bates configuration
 * @returns {string} Formatted Bates number
 *
 * @example
 * ```typescript
 * const bates = formatBatesNumber(42, {
 *   prefix: 'WC',
 *   startNumber: 1,
 *   digitCount: 7,
 *   position: 'bottom-right'
 * });
 * // Result: "WC0000042"
 * ```
 */
export declare const formatBatesNumber: (number: number, config: BatesNumberingConfig) => string;
/**
 * 18. Generates Bates number sequence for document.
 *
 * @param {number} startNumber - Starting number
 * @param {number} pageCount - Number of pages
 * @param {BatesNumberingConfig} config - Bates configuration
 * @returns {string[]} Array of Bates numbers
 *
 * @example
 * ```typescript
 * const sequence = generateBatesSequence(1, 25, config);
 * console.log('First:', sequence[0], 'Last:', sequence[24]);
 * ```
 */
export declare const generateBatesSequence: (startNumber: number, pageCount: number, config: BatesNumberingConfig) => string[];
/**
 * 19. Parses Bates number to extract components.
 *
 * @param {string} batesNumber - Bates number to parse
 * @returns {{ prefix: string; number: number } | null} Parsed components
 *
 * @example
 * ```typescript
 * const parsed = parseBatesNumber('WC0000042');
 * console.log('Prefix:', parsed.prefix, 'Number:', parsed.number);
 * ```
 */
export declare const parseBatesNumber: (batesNumber: string) => {
    prefix: string;
    number: number;
} | null;
/**
 * 20. Validates Bates number format.
 *
 * @param {string} batesNumber - Bates number to validate
 * @param {BatesNumberingConfig} config - Expected configuration
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateBatesNumber('WC0000042', config);
 * if (!isValid) throw new Error('Invalid Bates number');
 * ```
 */
export declare const validateBatesNumber: (batesNumber: string, config: BatesNumberingConfig) => boolean;
/**
 * 21. Creates document section configuration.
 *
 * @param {Partial<DocumentSection>} config - Section configuration
 * @returns {DocumentSection} Complete section configuration
 *
 * @example
 * ```typescript
 * const section = createDocumentSection({
 *   id: 'intro',
 *   name: 'Introduction',
 *   startPage: 1,
 *   endPage: 5,
 *   numberingStyle: 'roman'
 * });
 * ```
 */
export declare const createDocumentSection: (config: Partial<DocumentSection>) => DocumentSection;
/**
 * 22. Gets section for specific page number.
 *
 * @param {DocumentSection[]} sections - Array of sections
 * @param {number} pageNum - Page number
 * @returns {DocumentSection | null} Matching section or null
 *
 * @example
 * ```typescript
 * const section = getSectionForPage(sections, 15);
 * console.log('Current section:', section?.name);
 * ```
 */
export declare const getSectionForPage: (sections: DocumentSection[], pageNum: number) => DocumentSection | null;
/**
 * 23. Calculates page number within section.
 *
 * @param {number} absolutePage - Absolute page number
 * @param {DocumentSection} section - Document section
 * @returns {number} Page number within section
 *
 * @example
 * ```typescript
 * const sectionPage = calculateSectionPageNumber(15, section);
 * console.log('Page within section:', sectionPage);
 * ```
 */
export declare const calculateSectionPageNumber: (absolutePage: number, section: DocumentSection) => number;
/**
 * 24. Formats page number for section.
 *
 * @param {number} pageNum - Page number
 * @param {DocumentSection} section - Document section
 * @param {number} totalPages - Total pages in document
 * @returns {string} Formatted page number
 *
 * @example
 * ```typescript
 * const formatted = formatSectionPageNumber(3, section, 100);
 * // If section uses roman numerals: "iii"
 * ```
 */
export declare const formatSectionPageNumber: (pageNum: number, section: DocumentSection, totalPages: number) => string;
/**
 * 25. Validates section configuration.
 *
 * @param {DocumentSection[]} sections - Array of sections
 * @returns {string[]} Array of validation errors
 *
 * @example
 * ```typescript
 * const errors = validateSections(sections);
 * if (errors.length > 0) {
 *   console.error('Section errors:', errors);
 * }
 * ```
 */
export declare const validateSections: (sections: DocumentSection[]) => string[];
/**
 * 26. Parses page range string (e.g., "1-5, 10, 15-20").
 *
 * @param {string} rangeString - Page range string
 * @returns {PageRange[]} Array of page ranges
 *
 * @example
 * ```typescript
 * const ranges = parsePageRange('1-5, 10, 15-20');
 * // Result: [{ start: 1, end: 5 }, { start: 10, end: 10 }, { start: 15, end: 20 }]
 * ```
 */
export declare const parsePageRange: (rangeString: string) => PageRange[];
/**
 * 27. Checks if page is within any range.
 *
 * @param {number} pageNum - Page number to check
 * @param {PageRange[]} ranges - Array of page ranges
 * @returns {boolean} True if page is in range
 *
 * @example
 * ```typescript
 * const inRange = isPageInRange(7, ranges);
 * console.log('In range:', inRange);
 * ```
 */
export declare const isPageInRange: (pageNum: number, ranges: PageRange[]) => boolean;
/**
 * 28. Expands page ranges to individual page numbers.
 *
 * @param {PageRange[]} ranges - Array of page ranges
 * @returns {number[]} Array of individual page numbers
 *
 * @example
 * ```typescript
 * const pages = expandPageRanges([{ start: 1, end: 3 }, { start: 5, end: 5 }]);
 * // Result: [1, 2, 3, 5]
 * ```
 */
export declare const expandPageRanges: (ranges: PageRange[]) => number[];
/**
 * 29. Compresses page numbers into range string.
 *
 * @param {number[]} pages - Array of page numbers
 * @returns {string} Compressed range string
 *
 * @example
 * ```typescript
 * const rangeString = compressPageRanges([1, 2, 3, 5, 7, 8, 9]);
 * // Result: "1-3, 5, 7-9"
 * ```
 */
export declare const compressPageRanges: (pages: number[]) => string;
/**
 * 30. Creates custom page format with placeholders.
 *
 * @param {string} template - Format template
 * @param {Record<string, any>} data - Placeholder data
 * @returns {string} Formatted string
 *
 * @example
 * ```typescript
 * const formatted = createCustomFormat(
 *   '{docName} - Page {page} of {total}',
 *   { docName: 'Report', page: 5, total: 10 }
 * );
 * // Result: "Report - Page 5 of 10"
 * ```
 */
export declare const createCustomFormat: (template: string, data: Record<string, any>) => string;
/**
 * 31. Creates page watermark configuration.
 *
 * @param {Partial<PageWatermarkConfig>} config - Watermark configuration
 * @returns {PageWatermarkConfig} Complete watermark configuration
 *
 * @example
 * ```typescript
 * const watermark = createPageWatermark({
 *   text: 'CONFIDENTIAL',
 *   opacity: 0.3,
 *   rotation: 45,
 *   fontSize: 72
 * });
 * ```
 */
export declare const createPageWatermark: (config: Partial<PageWatermarkConfig>) => PageWatermarkConfig;
/**
 * 32. Checks if watermark should be applied to page.
 *
 * @param {PageWatermarkConfig} config - Watermark configuration
 * @param {number} pageNum - Page number
 * @returns {boolean} True if watermark should be applied
 *
 * @example
 * ```typescript
 * const shouldApply = shouldApplyWatermark(watermarkConfig, 5);
 * if (shouldApply) {
 *   applyWatermarkToPage(page, watermarkConfig);
 * }
 * ```
 */
export declare const shouldApplyWatermark: (config: PageWatermarkConfig, pageNum: number) => boolean;
/**
 * 33. Calculates total pages from sections.
 *
 * @param {DocumentSection[]} sections - Array of sections
 * @returns {number} Total number of pages
 *
 * @example
 * ```typescript
 * const total = calculateTotalPages(sections);
 * console.log('Total pages:', total);
 * ```
 */
export declare const calculateTotalPages: (sections: DocumentSection[]) => number;
/**
 * 34. Converts page size name to dimensions in points.
 *
 * @param {PageSize | string} size - Page size name
 * @param {PageOrientation} [orientation] - Page orientation
 * @returns {{ width: number; height: number }} Page dimensions
 *
 * @example
 * ```typescript
 * const dimensions = getPageDimensions('LETTER', 'portrait');
 * console.log('Width:', dimensions.width, 'Height:', dimensions.height);
 * ```
 */
export declare const getPageDimensions: (size: PageSize | string, orientation?: PageOrientation) => {
    width: number;
    height: number;
};
/**
 * 35. Creates page break configuration.
 *
 * @param {Partial<PageBreakConfig>} config - Page break configuration
 * @returns {PageBreakConfig} Complete page break configuration
 *
 * @example
 * ```typescript
 * const pageBreak = createPageBreak({
 *   type: 'hard',
 *   beforeElement: true
 * });
 * ```
 */
export declare const createPageBreak: (config: Partial<PageBreakConfig>) => PageBreakConfig;
declare const _default: {
    loadPaginationConfig: () => PaginationConfig;
    validatePaginationConfig: (config: PaginationConfig) => string[];
    createDocumentPaginationModel: (sequelize: Sequelize) => any;
    formatArabicNumber: (pageNum: number, options?: PageNumberOptions) => string;
    formatRomanNumber: (pageNum: number, options?: PageNumberOptions) => string;
    formatRomanNumberUpper: (pageNum: number, options?: PageNumberOptions) => string;
    formatAlphaNumber: (pageNum: number, options?: PageNumberOptions) => string;
    formatAlphaNumberUpper: (pageNum: number, options?: PageNumberOptions) => string;
    formatCustomNumber: (pageNum: number, totalPages: number, format: string) => string;
    applyPageNumberStyle: (pageNum: number, style: PageNumberStyle, options?: PageNumberOptions) => string;
    calculatePageNumberPosition: (position: PageNumberPosition, pageWidth: number, pageHeight: number, margins: PageMargins) => {
        x: number;
        y: number;
    };
    alignPageNumberText: (text: string, x: number, alignment: "left" | "center" | "right", textWidth?: number) => number;
    createPageNumberConfig: (options: PageNumberOptions) => Record<string, any>;
    createHeaderConfig: (config: Partial<HeaderConfig>) => HeaderConfig;
    createFooterConfig: (config: Partial<FooterConfig>) => FooterConfig;
    renderHeaderContent: (config: HeaderConfig, pageNum: number, totalPages: number) => string;
    renderFooterContent: (config: FooterConfig, pageNum: number, totalPages: number) => string;
    getSectionHeader: (config: HeaderConfig, pageNum: number) => SectionHeaderConfig | null;
    getSectionFooter: (config: FooterConfig, pageNum: number) => SectionFooterConfig | null;
    formatBatesNumber: (number: number, config: BatesNumberingConfig) => string;
    generateBatesSequence: (startNumber: number, pageCount: number, config: BatesNumberingConfig) => string[];
    parseBatesNumber: (batesNumber: string) => {
        prefix: string;
        number: number;
    } | null;
    validateBatesNumber: (batesNumber: string, config: BatesNumberingConfig) => boolean;
    createDocumentSection: (config: Partial<DocumentSection>) => DocumentSection;
    getSectionForPage: (sections: DocumentSection[], pageNum: number) => DocumentSection | null;
    calculateSectionPageNumber: (absolutePage: number, section: DocumentSection) => number;
    formatSectionPageNumber: (pageNum: number, section: DocumentSection, totalPages: number) => string;
    validateSections: (sections: DocumentSection[]) => string[];
    parsePageRange: (rangeString: string) => PageRange[];
    isPageInRange: (pageNum: number, ranges: PageRange[]) => boolean;
    expandPageRanges: (ranges: PageRange[]) => number[];
    compressPageRanges: (pages: number[]) => string;
    createCustomFormat: (template: string, data: Record<string, any>) => string;
    createPageWatermark: (config: Partial<PageWatermarkConfig>) => PageWatermarkConfig;
    shouldApplyWatermark: (config: PageWatermarkConfig, pageNum: number) => boolean;
    calculateTotalPages: (sections: DocumentSection[]) => number;
    getPageDimensions: (size: PageSize | string, orientation?: PageOrientation) => {
        width: number;
        height: number;
    };
    createPageBreak: (config: Partial<PageBreakConfig>) => PageBreakConfig;
};
export default _default;
//# sourceMappingURL=document-pagination-kit.d.ts.map