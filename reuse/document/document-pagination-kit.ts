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

import {
  Model,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  Transaction,
  Op,
  WhereOptions,
} from 'sequelize';

// ============================================================================
// CONFIGURATION MANAGEMENT
// ============================================================================

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
export const loadPaginationConfig = (): PaginationConfig => {
  return {
    defaultPageSize: process.env.DEFAULT_PAGE_SIZE || 'LETTER',
    margins: {
      top: parseInt(process.env.DEFAULT_MARGIN_TOP || '72', 10),
      bottom: parseInt(process.env.DEFAULT_MARGIN_BOTTOM || '72', 10),
      left: parseInt(process.env.DEFAULT_MARGIN_LEFT || '72', 10),
      right: parseInt(process.env.DEFAULT_MARGIN_RIGHT || '72', 10),
    },
    enableBatesNumbering: process.env.ENABLE_BATES_NUMBERING === 'true',
    batesPrefix: process.env.BATES_PREFIX || 'WC',
    batesStartNumber: parseInt(process.env.BATES_START_NUMBER || '1', 10),
    batesDigitCount: parseInt(process.env.BATES_DIGIT_COUNT || '7', 10),
    headerFontSize: parseInt(process.env.HEADER_FONT_SIZE || '10', 10),
    footerFontSize: parseInt(process.env.FOOTER_FONT_SIZE || '9', 10),
    pageNumberFormat: process.env.PAGE_NUMBER_FORMAT || 'Page {page} of {total}',
    enablePageWatermark: process.env.ENABLE_PAGE_WATERMARK === 'true',
    maxPagesPerDocument: parseInt(process.env.MAX_PAGES_PER_DOCUMENT || '1000', 10),
  };
};

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
export const validatePaginationConfig = (config: PaginationConfig): string[] => {
  const errors: string[] = [];

  if (config.margins.top < 0 || config.margins.top > 200) {
    errors.push('Top margin must be between 0 and 200 points');
  }
  if (config.margins.bottom < 0 || config.margins.bottom > 200) {
    errors.push('Bottom margin must be between 0 and 200 points');
  }
  if (config.batesDigitCount < 1 || config.batesDigitCount > 15) {
    errors.push('Bates digit count must be between 1 and 15');
  }
  if (config.maxPagesPerDocument < 1 || config.maxPagesPerDocument > 10000) {
    errors.push('Max pages per document must be between 1 and 10000');
  }

  return errors;
};

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export type PageNumberStyle =
  | 'arabic' // 1, 2, 3
  | 'roman' // i, ii, iii
  | 'roman-upper' // I, II, III
  | 'alpha' // a, b, c
  | 'alpha-upper' // A, B, C
  | 'custom';

/**
 * Page number position
 */
export type PageNumberPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

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
  format?: string; // e.g., "Page {page} of {total}"
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

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

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
export const createDocumentPaginationModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'documents',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    totalPages: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    pageSize: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'LETTER',
    },
    orientation: {
      type: DataTypes.ENUM('portrait', 'landscape'),
      allowNull: false,
      defaultValue: 'portrait',
    },
    margins: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        top: 72,
        bottom: 72,
        left: 72,
        right: 72,
      },
    },
    numberingStyle: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'arabic',
    },
    batesEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    batesPrefix: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    batesStartNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    hasHeaders: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hasFooters: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hasSections: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sectionCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
  };

  const options: ModelOptions = {
    tableName: 'document_pagination',
    timestamps: true,
    indexes: [
      { fields: ['documentId'] },
      { fields: ['totalPages'] },
      { fields: ['batesEnabled'] },
    ],
  };

  return sequelize.define('DocumentPagination', attributes, options);
};

// ============================================================================
// 1. PAGE NUMBERING STYLES
// ============================================================================

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
export const formatArabicNumber = (pageNum: number, options?: PageNumberOptions): string => {
  const prefix = options?.prefix || '';
  const suffix = options?.suffix || '';
  return `${prefix}${pageNum}${suffix}`;
};

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
export const formatRomanNumber = (pageNum: number, options?: PageNumberOptions): string => {
  const romanNumerals: [number, string][] = [
    [1000, 'm'],
    [900, 'cm'],
    [500, 'd'],
    [400, 'cd'],
    [100, 'c'],
    [90, 'xc'],
    [50, 'l'],
    [40, 'xl'],
    [10, 'x'],
    [9, 'ix'],
    [5, 'v'],
    [4, 'iv'],
    [1, 'i'],
  ];

  let result = '';
  let num = pageNum;

  for (const [value, numeral] of romanNumerals) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }

  const prefix = options?.prefix || '';
  const suffix = options?.suffix || '';
  return `${prefix}${result}${suffix}`;
};

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
export const formatRomanNumberUpper = (pageNum: number, options?: PageNumberOptions): string => {
  return formatRomanNumber(pageNum, options).toUpperCase();
};

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
export const formatAlphaNumber = (pageNum: number, options?: PageNumberOptions): string => {
  let result = '';
  let num = pageNum;

  while (num > 0) {
    num--;
    result = String.fromCharCode(97 + (num % 26)) + result;
    num = Math.floor(num / 26);
  }

  const prefix = options?.prefix || '';
  const suffix = options?.suffix || '';
  return `${prefix}${result}${suffix}`;
};

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
export const formatAlphaNumberUpper = (pageNum: number, options?: PageNumberOptions): string => {
  return formatAlphaNumber(pageNum, options).toUpperCase();
};

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
export const formatCustomNumber = (pageNum: number, totalPages: number, format: string): string => {
  return format.replace('{page}', pageNum.toString()).replace('{total}', totalPages.toString());
};

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
export const applyPageNumberStyle = (
  pageNum: number,
  style: PageNumberStyle,
  options?: PageNumberOptions,
): string => {
  switch (style) {
    case 'arabic':
      return formatArabicNumber(pageNum, options);
    case 'roman':
      return formatRomanNumber(pageNum, options);
    case 'roman-upper':
      return formatRomanNumberUpper(pageNum, options);
    case 'alpha':
      return formatAlphaNumber(pageNum, options);
    case 'alpha-upper':
      return formatAlphaNumberUpper(pageNum, options);
    default:
      return formatArabicNumber(pageNum, options);
  }
};

// ============================================================================
// 2. PAGE NUMBER POSITIONING
// ============================================================================

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
export const calculatePageNumberPosition = (
  position: PageNumberPosition,
  pageWidth: number,
  pageHeight: number,
  margins: PageMargins,
): { x: number; y: number } => {
  const positions: Record<PageNumberPosition, { x: number; y: number }> = {
    'top-left': { x: margins.left, y: margins.top / 2 },
    'top-center': { x: pageWidth / 2, y: margins.top / 2 },
    'top-right': { x: pageWidth - margins.right, y: margins.top / 2 },
    'bottom-left': { x: margins.left, y: pageHeight - margins.bottom / 2 },
    'bottom-center': { x: pageWidth / 2, y: pageHeight - margins.bottom / 2 },
    'bottom-right': { x: pageWidth - margins.right, y: pageHeight - margins.bottom / 2 },
  };

  return positions[position];
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
export const alignPageNumberText = (
  text: string,
  x: number,
  alignment: 'left' | 'center' | 'right',
  textWidth?: number,
): number => {
  if (alignment === 'center') {
    return x - (textWidth || text.length * 6) / 2;
  } else if (alignment === 'right') {
    return x - (textWidth || text.length * 6);
  }
  return x;
};

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
export const createPageNumberConfig = (options: PageNumberOptions): Record<string, any> => {
  return {
    style: options.style,
    position: options.position,
    format: options.format || 'Page {page} of {total}',
    startPage: options.startPage || 1,
    prefix: options.prefix || '',
    suffix: options.suffix || '',
    fontFamily: options.fontFamily || 'Helvetica',
    fontSize: options.fontSize || 10,
    color: options.color || '#000000',
    alignment: options.alignment || 'center',
  };
};

// ============================================================================
// 3. HEADERS AND FOOTERS
// ============================================================================

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
export const createHeaderConfig = (config: Partial<HeaderConfig>): HeaderConfig => {
  return {
    content: config.content || '',
    height: config.height || 50,
    fontFamily: config.fontFamily || 'Helvetica',
    fontSize: config.fontSize || 10,
    color: config.color || '#000000',
    alignment: config.alignment || 'center',
    showOnFirstPage: config.showOnFirstPage ?? true,
    sections: config.sections || [],
  };
};

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
export const createFooterConfig = (config: Partial<FooterConfig>): FooterConfig => {
  return {
    content: config.content || '',
    height: config.height || 40,
    fontFamily: config.fontFamily || 'Helvetica',
    fontSize: config.fontSize || 9,
    color: config.color || '#000000',
    alignment: config.alignment || 'center',
    showOnFirstPage: config.showOnFirstPage ?? true,
    sections: config.sections || [],
  };
};

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
export const renderHeaderContent = (
  config: HeaderConfig,
  pageNum: number,
  totalPages: number,
): string => {
  if (typeof config.content === 'function') {
    return config.content(pageNum, totalPages);
  }
  return config.content;
};

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
export const renderFooterContent = (
  config: FooterConfig,
  pageNum: number,
  totalPages: number,
): string => {
  if (typeof config.content === 'function') {
    return config.content(pageNum, totalPages);
  }
  return config.content;
};

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
export const getSectionHeader = (
  config: HeaderConfig,
  pageNum: number,
): SectionHeaderConfig | null => {
  if (!config.sections || config.sections.length === 0) {
    return null;
  }

  for (const section of config.sections) {
    if (pageNum >= section.startPage && (!section.endPage || pageNum <= section.endPage)) {
      return section;
    }
  }

  return null;
};

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
export const getSectionFooter = (
  config: FooterConfig,
  pageNum: number,
): SectionFooterConfig | null => {
  if (!config.sections || config.sections.length === 0) {
    return null;
  }

  for (const section of config.sections) {
    if (pageNum >= section.startPage && (!section.endPage || pageNum <= section.endPage)) {
      return section;
    }
  }

  return null;
};

// ============================================================================
// 4. BATES NUMBERING
// ============================================================================

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
export const formatBatesNumber = (number: number, config: BatesNumberingConfig): string => {
  const paddedNumber = number.toString().padStart(config.digitCount, '0');
  return `${config.prefix}${paddedNumber}`;
};

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
export const generateBatesSequence = (
  startNumber: number,
  pageCount: number,
  config: BatesNumberingConfig,
): string[] => {
  const sequence: string[] = [];

  for (let i = 0; i < pageCount; i++) {
    sequence.push(formatBatesNumber(startNumber + i, config));
  }

  return sequence;
};

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
export const parseBatesNumber = (batesNumber: string): { prefix: string; number: number } | null => {
  const match = batesNumber.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    return null;
  }

  return {
    prefix: match[1],
    number: parseInt(match[2], 10),
  };
};

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
export const validateBatesNumber = (batesNumber: string, config: BatesNumberingConfig): boolean => {
  const parsed = parseBatesNumber(batesNumber);
  if (!parsed) {
    return false;
  }

  return (
    parsed.prefix === config.prefix &&
    batesNumber.length === config.prefix.length + config.digitCount
  );
};

// ============================================================================
// 5. MULTI-SECTION NUMBERING
// ============================================================================

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
export const createDocumentSection = (config: Partial<DocumentSection>): DocumentSection => {
  return {
    id: config.id || crypto.randomUUID(),
    name: config.name || 'Untitled Section',
    startPage: config.startPage || 1,
    endPage: config.endPage,
    numberingStyle: config.numberingStyle || 'arabic',
    restartNumbering: config.restartNumbering ?? false,
    header: config.header,
    footer: config.footer,
  };
};

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
export const getSectionForPage = (
  sections: DocumentSection[],
  pageNum: number,
): DocumentSection | null => {
  for (const section of sections) {
    if (pageNum >= section.startPage && (!section.endPage || pageNum <= section.endPage)) {
      return section;
    }
  }
  return null;
};

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
export const calculateSectionPageNumber = (absolutePage: number, section: DocumentSection): number => {
  if (section.restartNumbering) {
    return absolutePage - section.startPage + 1;
  }
  return absolutePage;
};

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
export const formatSectionPageNumber = (
  pageNum: number,
  section: DocumentSection,
  totalPages: number,
): string => {
  const sectionPage = calculateSectionPageNumber(pageNum, section);
  return applyPageNumberStyle(sectionPage, section.numberingStyle || 'arabic');
};

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
export const validateSections = (sections: DocumentSection[]): string[] => {
  const errors: string[] = [];

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    if (section.startPage < 1) {
      errors.push(`Section ${section.id}: start page must be >= 1`);
    }

    if (section.endPage && section.endPage < section.startPage) {
      errors.push(`Section ${section.id}: end page must be >= start page`);
    }

    // Check for overlapping sections
    for (let j = i + 1; j < sections.length; j++) {
      const otherSection = sections[j];
      const overlap =
        (section.startPage >= otherSection.startPage &&
          section.startPage <= (otherSection.endPage || Infinity)) ||
        (otherSection.startPage >= section.startPage &&
          otherSection.startPage <= (section.endPage || Infinity));

      if (overlap) {
        errors.push(`Sections ${section.id} and ${otherSection.id} overlap`);
      }
    }
  }

  return errors;
};

// ============================================================================
// 6. CUSTOM FORMATS AND PAGE RANGES
// ============================================================================

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
export const parsePageRange = (rangeString: string): PageRange[] => {
  const ranges: PageRange[] = [];
  const parts = rangeString.split(',').map((p) => p.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map((n) => parseInt(n.trim(), 10));
      ranges.push({ start, end });
    } else {
      const page = parseInt(part, 10);
      ranges.push({ start: page, end: page });
    }
  }

  return ranges;
};

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
export const isPageInRange = (pageNum: number, ranges: PageRange[]): boolean => {
  for (const range of ranges) {
    if (pageNum >= range.start && pageNum <= range.end) {
      return true;
    }
  }
  return false;
};

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
export const expandPageRanges = (ranges: PageRange[]): number[] => {
  const pages: number[] = [];

  for (const range of ranges) {
    for (let i = range.start; i <= range.end; i++) {
      pages.push(i);
    }
  }

  return Array.from(new Set(pages)).sort((a, b) => a - b);
};

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
export const compressPageRanges = (pages: number[]): string => {
  if (pages.length === 0) return '';

  const sorted = [...pages].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = sorted[i];
      end = sorted[i];
    }
  }

  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join(', ');
};

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
export const createCustomFormat = (template: string, data: Record<string, any>): string => {
  let result = template;

  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }

  return result;
};

// ============================================================================
// 7. PAGE WATERMARKS AND UTILITIES
// ============================================================================

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
export const createPageWatermark = (config: Partial<PageWatermarkConfig>): PageWatermarkConfig => {
  return {
    text: config.text || 'DRAFT',
    opacity: config.opacity ?? 0.3,
    rotation: config.rotation ?? 45,
    fontSize: config.fontSize || 72,
    color: config.color || '#CCCCCC',
    position: config.position || 'diagonal',
    pages: config.pages || [],
  };
};

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
export const shouldApplyWatermark = (config: PageWatermarkConfig, pageNum: number): boolean => {
  if (!config.pages || config.pages.length === 0) {
    return true; // Apply to all pages
  }

  return isPageInRange(pageNum, config.pages);
};

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
export const calculateTotalPages = (sections: DocumentSection[]): number => {
  if (sections.length === 0) return 0;

  const lastSection = sections.reduce((prev, current) => {
    const prevEnd = prev.endPage || prev.startPage;
    const currentEnd = current.endPage || current.startPage;
    return currentEnd > prevEnd ? current : prev;
  });

  return lastSection.endPage || lastSection.startPage;
};

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
export const getPageDimensions = (
  size: PageSize | string,
  orientation: PageOrientation = 'portrait',
): { width: number; height: number } => {
  const sizes: Record<string, { width: number; height: number }> = {
    LETTER: { width: 612, height: 792 },
    A4: { width: 595, height: 842 },
    LEGAL: { width: 612, height: 1008 },
    TABLOID: { width: 792, height: 1224 },
    A3: { width: 842, height: 1191 },
    A5: { width: 420, height: 595 },
  };

  const dimensions = sizes[size.toUpperCase()] || sizes.LETTER;

  if (orientation === 'landscape') {
    return { width: dimensions.height, height: dimensions.width };
  }

  return dimensions;
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
export const createPageBreak = (config: Partial<PageBreakConfig>): PageBreakConfig => {
  return {
    type: config.type || 'soft',
    beforeElement: config.beforeElement ?? false,
    afterElement: config.afterElement ?? false,
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Configuration
  loadPaginationConfig,
  validatePaginationConfig,

  // Models
  createDocumentPaginationModel,

  // Page Numbering Styles
  formatArabicNumber,
  formatRomanNumber,
  formatRomanNumberUpper,
  formatAlphaNumber,
  formatAlphaNumberUpper,
  formatCustomNumber,
  applyPageNumberStyle,

  // Page Number Positioning
  calculatePageNumberPosition,
  alignPageNumberText,
  createPageNumberConfig,

  // Headers and Footers
  createHeaderConfig,
  createFooterConfig,
  renderHeaderContent,
  renderFooterContent,
  getSectionHeader,
  getSectionFooter,

  // Bates Numbering
  formatBatesNumber,
  generateBatesSequence,
  parseBatesNumber,
  validateBatesNumber,

  // Multi-Section Numbering
  createDocumentSection,
  getSectionForPage,
  calculateSectionPageNumber,
  formatSectionPageNumber,
  validateSections,

  // Custom Formats and Page Ranges
  parsePageRange,
  isPageInRange,
  expandPageRanges,
  compressPageRanges,
  createCustomFormat,

  // Watermarks and Utilities
  createPageWatermark,
  shouldApplyWatermark,
  calculateTotalPages,
  getPageDimensions,
  createPageBreak,
};
