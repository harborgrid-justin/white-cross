/**
 * LOC: DOC-COMP-BRAND-001
 * File: /reuse/document/composites/document-watermarking-branding-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - pdfkit (v0.14.x)
 *   - sharp (v0.32.x)
 *   - ../document-pdf-advanced-kit
 *   - ../document-templates-kit
 *   - ../document-rendering-kit
 *   - ../document-security-kit
 *
 * DOWNSTREAM (imported by):
 *   - Document branding controllers
 *   - Watermark application services
 *   - Template customization modules
 *   - Corporate identity processors
 *   - Document styling services
 */
import { Sequelize } from 'sequelize';
/**
 * Watermark types
 */
export type WatermarkType = 'text' | 'image' | 'qrcode' | 'barcode' | 'diagonal';
/**
 * Watermark position
 */
export type WatermarkPosition = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'header' | 'footer';
/**
 * Confidentiality level
 */
export type ConfidentialityLevel = 'public' | 'internal' | 'confidential' | 'restricted' | 'secret';
/**
 * Brand theme
 */
export type BrandTheme = 'corporate' | 'medical' | 'professional' | 'minimal' | 'custom';
/**
 * Watermark configuration
 */
export interface WatermarkConfig {
    type: WatermarkType;
    content: string | Buffer;
    position: WatermarkPosition;
    opacity: number;
    rotation?: number;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    repeat?: boolean;
    layer?: boolean;
}
/**
 * Header/Footer configuration
 */
export interface HeaderFooterConfig {
    header?: {
        content: string;
        height: number;
        alignment: 'left' | 'center' | 'right';
        includePageNumbers?: boolean;
        includeDate?: boolean;
        logo?: Buffer;
    };
    footer?: {
        content: string;
        height: number;
        alignment: 'left' | 'center' | 'right';
        includePageNumbers?: boolean;
        includeDate?: boolean;
        disclaimer?: string;
    };
}
/**
 * Branding configuration
 */
export interface BrandingConfig {
    organizationName: string;
    logo: Buffer;
    logoPosition: 'header' | 'footer' | 'watermark';
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    theme: BrandTheme;
    tagline?: string;
    contactInfo?: {
        phone?: string;
        email?: string;
        website?: string;
        address?: string;
    };
}
/**
 * Logo configuration
 */
export interface LogoConfig {
    image: Buffer;
    width: number;
    height: number;
    position: {
        x: number;
        y: number;
    };
    opacity?: number;
    link?: string;
    altText?: string;
}
/**
 * QR code configuration
 */
export interface QRCodeConfig {
    data: string;
    size: number;
    errorCorrection: 'L' | 'M' | 'Q' | 'H';
    position: WatermarkPosition;
    includeText?: boolean;
}
/**
 * Security marking configuration
 */
export interface SecurityMarkingConfig {
    level: ConfidentialityLevel;
    color: string;
    fontSize: number;
    position: WatermarkPosition;
    includeDateTime?: boolean;
    includeUser?: boolean;
}
/**
 * Style configuration
 */
export interface StyleConfig {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    textColor: string;
    backgroundColor?: string;
    margins: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    padding?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
}
/**
 * Watermarking & Branding Composite Service
 *
 * Provides comprehensive watermarking, branding, and document styling capabilities
 * for professional healthcare document presentation.
 */
export declare class WatermarkingBrandingCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Applies text watermark to document.
     *
     * @param {Buffer} documentBuffer - Document buffer
     * @param {WatermarkConfig} config - Watermark configuration
     * @returns {Promise<Buffer>} Document with watermark
     *
     * @example
     * ```typescript
     * const watermarked = await service.applyTextWatermark(docBuffer, {
     *   type: 'text',
     *   content: 'CONFIDENTIAL',
     *   position: 'diagonal',
     *   opacity: 0.3,
     *   fontSize: 48,
     *   color: '#FF0000',
     *   rotation: -45
     * });
     * ```
     */
    applyTextWatermark(documentBuffer: Buffer, config: WatermarkConfig): Promise<Buffer>;
    /**
     * 2. Applies image watermark to document.
     *
     * @param {Buffer} documentBuffer - Document buffer
     * @param {Buffer} watermarkImage - Watermark image
     * @param {WatermarkConfig} config - Configuration
     * @returns {Promise<Buffer>} Document with watermark
     *
     * @example
     * ```typescript
     * const watermarked = await service.applyImageWatermark(
     *   docBuffer,
     *   logoBuffer,
     *   { type: 'image', position: 'center', opacity: 0.2 }
     * );
     * ```
     */
    applyImageWatermark(documentBuffer: Buffer, watermarkImage: Buffer, config: WatermarkConfig): Promise<Buffer>;
    /**
     * 3. Applies diagonal watermark across pages.
     *
     * @param {Buffer} documentBuffer - Document buffer
     * @param {string} text - Watermark text
     * @param {number} opacity - Opacity (0-1)
     * @returns {Promise<Buffer>} Document with diagonal watermark
     *
     * @example
     * ```typescript
     * const watermarked = await service.applyDiagonalWatermark(
     *   docBuffer,
     *   'DRAFT',
     *   0.25
     * );
     * ```
     */
    applyDiagonalWatermark(documentBuffer: Buffer, text: string, opacity: number): Promise<Buffer>;
    /**
     * 4. Applies repeating watermark pattern.
     *
     * @param {Buffer} documentBuffer - Document buffer
     * @param {string} text - Watermark text
     * @param {number} spacing - Spacing between repetitions
     * @returns {Promise<Buffer>} Document with repeating watermark
     *
     * @example
     * ```typescript
     * const watermarked = await service.applyRepeatingWatermark(
     *   docBuffer,
     *   'CONFIDENTIAL',
     *   100
     * );
     * ```
     */
    applyRepeatingWatermark(documentBuffer: Buffer, text: string, spacing: number): Promise<Buffer>;
    /**
     * 5. Generates QR code watermark.
     *
     * @param {Buffer} documentBuffer - Document buffer
     * @param {QRCodeConfig} config - QR code configuration
     * @returns {Promise<Buffer>} Document with QR code
     *
     * @example
     * ```typescript
     * const withQR = await service.generateQrCodeWatermark(docBuffer, {
     *   data: 'https://whitecross.health/verify/doc-123',
     *   size: 100,
     *   errorCorrection: 'H',
     *   position: 'bottom-right'
     * });
     * ```
     */
    generateQrCodeWatermark(documentBuffer: Buffer, config: QRCodeConfig): Promise<Buffer>;
    /**
     * 6. Applies security classification watermark.
     *
     * @param {Buffer} documentBuffer - Document buffer
     * @param {SecurityMarkingConfig} config - Security marking configuration
     * @returns {Promise<Buffer>} Document with security marking
     *
     * @example
     * ```typescript
     * const marked = await service.applySecurityClassification(docBuffer, {
     *   level: 'confidential',
     *   color: '#FF0000',
     *   fontSize: 24,
     *   position: 'header',
     *   includeDateTime: true
     * });
     * ```
     */
    applySecurityClassification(documentBuffer: Buffer, config: SecurityMarkingConfig): Promise<Buffer>;
    /**
     * 7. Applies timestamp watermark.
     *
     * @param {Buffer} documentBuffer - Document buffer
     * @param {Date} timestamp - Timestamp
     * @param {WatermarkPosition} position - Position
     * @returns {Promise<Buffer>} Document with timestamp
     *
     * @example
     * ```typescript
     * const timestamped = await service.applyTimestampWatermark(
     *   docBuffer,
     *   new Date(),
     *   'footer'
     * );
     * ```
     */
    applyTimestampWatermark(documentBuffer: Buffer, timestamp: Date, position: WatermarkPosition): Promise<Buffer>;
    /**
     * 8. Applies user identification watermark.
     *
     * @param {Buffer} documentBuffer - Document buffer
     * @param {string} userId - User ID
     * @param {string} userName - User name
     * @returns {Promise<Buffer>} Document with user watermark
     *
     * @example
     * ```typescript
     * const withUser = await service.applyUserWatermark(
     *   docBuffer,
     *   'user-123',
     *   'Dr. Smith'
     * );
     * ```
     */
    applyUserWatermark(documentBuffer: Buffer, userId: string, userName: string): Promise<Buffer>;
    /**
     * 9. Removes watermark from document.
     *
     * @param {Buffer} documentBuffer - Document buffer
     * @param {string} watermarkId - Watermark layer ID
     * @returns {Promise<Buffer>} Document without watermark
     *
     * @example
     * ```typescript
     * const cleaned = await service.removeWatermark(docBuffer, 'watermark');
     * ```
     */
    removeWatermark(documentBuffer: Buffer, watermarkId: string): Promise<Buffer>;
    /**
     * 10. Flattens watermark into document.
     *
     * @param {Buffer} documentBuffer - Document buffer
     * @param {string} watermarkId - Watermark layer ID
     * @returns {Promise<Buffer>} Document with flattened watermark
     *
     * @example
     * ```typescript
     * const flattened = await service.flattenWatermark(docBuffer, 'watermark');
     * ```
     */
    flattenWatermark(documentBuffer: Buffer, watermarkId: string): Promise<Buffer>;
    /**
     * 11. Adds custom header to document.
     *
     * @param {string} content - Document content
     * @param {string} headerContent - Header content
     * @returns {Promise<string>} Document with header
     *
     * @example
     * ```typescript
     * const withHeader = await service.addCustomHeader(
     *   docContent,
     *   '<div>White Cross Healthcare</div>'
     * );
     * ```
     */
    addCustomHeader(content: string, headerContent: string): Promise<string>;
    /**
     * 12. Adds custom footer to document.
     *
     * @param {string} content - Document content
     * @param {string} footerContent - Footer content
     * @returns {Promise<string>} Document with footer
     *
     * @example
     * ```typescript
     * const withFooter = await service.addCustomFooter(
     *   docContent,
     *   '<div>Page {{page}} of {{totalPages}}</div>'
     * );
     * ```
     */
    addCustomFooter(content: string, footerContent: string): Promise<string>;
    /**
     * 13. Adds header and footer to document.
     *
     * @param {string} content - Document content
     * @param {HeaderFooterConfig} config - Configuration
     * @returns {Promise<string>} Document with header and footer
     *
     * @example
     * ```typescript
     * const formatted = await service.addHeaderAndFooter(content, {
     *   header: {
     *     content: 'Medical Report',
     *     height: 60,
     *     alignment: 'center',
     *     includeDate: true
     *   },
     *   footer: {
     *     content: 'Confidential Patient Information',
     *     height: 40,
     *     alignment: 'center',
     *     includePageNumbers: true
     *   }
     * });
     * ```
     */
    addHeaderAndFooter(content: string, config: HeaderFooterConfig): Promise<string>;
    /**
     * 14. Adds page numbers to document.
     *
     * @param {string} content - Document content
     * @param {string} format - Page number format
     * @param {WatermarkPosition} position - Position
     * @returns {Promise<string>} Document with page numbers
     *
     * @example
     * ```typescript
     * const numbered = await service.addPageNumbers(
     *   content,
     *   'Page {{page}} of {{totalPages}}',
     *   'footer'
     * );
     * ```
     */
    addPageNumbers(content: string, format: string, position: WatermarkPosition): Promise<string>;
    /**
     * 15. Adds date/time stamp to header or footer.
     *
     * @param {string} content - Document content
     * @param {Date} date - Date to display
     * @param {WatermarkPosition} position - Position
     * @returns {Promise<string>} Document with date stamp
     *
     * @example
     * ```typescript
     * const stamped = await service.addDateTimeStamp(
     *   content,
     *   new Date(),
     *   'header'
     * );
     * ```
     */
    addDateTimeStamp(content: string, date: Date, position: WatermarkPosition): Promise<string>;
    /**
     * 16. Adds disclaimer to footer.
     *
     * @param {string} content - Document content
     * @param {string} disclaimer - Disclaimer text
     * @returns {Promise<string>} Document with disclaimer
     *
     * @example
     * ```typescript
     * const withDisclaimer = await service.addDisclaimerFooter(
     *   content,
     *   'This document contains confidential patient information protected by HIPAA'
     * );
     * ```
     */
    addDisclaimerFooter(content: string, disclaimer: string): Promise<string>;
    /**
     * 17. Customizes header/footer per page.
     *
     * @param {string} content - Document content
     * @param {Map<number, HeaderFooterConfig>} pageConfigs - Per-page configurations
     * @returns {Promise<string>} Document with customized headers/footers
     *
     * @example
     * ```typescript
     * const customized = await service.customizeHeaderFooterPerPage(content, new Map([
     *   [1, { header: { content: 'Cover Page' } }],
     *   [2, { header: { content: 'Table of Contents' } }]
     * ]));
     * ```
     */
    customizeHeaderFooterPerPage(content: string, pageConfigs: Map<number, HeaderFooterConfig>): Promise<string>;
    /**
     * 18. Removes headers and footers from document.
     *
     * @param {string} content - Document content
     * @returns {Promise<string>} Document without headers/footers
     *
     * @example
     * ```typescript
     * const clean = await service.removeHeadersFooters(content);
     * ```
     */
    removeHeadersFooters(content: string): Promise<string>;
    /**
     * 19. Applies corporate branding to document.
     *
     * @param {string} content - Document content
     * @param {BrandingConfig} config - Branding configuration
     * @returns {Promise<string>} Branded document
     *
     * @example
     * ```typescript
     * const branded = await service.applyCorporateBranding(content, {
     *   organizationName: 'White Cross Healthcare',
     *   logo: logoBuffer,
     *   logoPosition: 'header',
     *   primaryColor: '#0066CC',
     *   secondaryColor: '#00AA66',
     *   fontFamily: 'Arial, sans-serif',
     *   theme: 'medical'
     * });
     * ```
     */
    applyCorporateBranding(content: string, config: BrandingConfig): Promise<string>;
    /**
     * 20. Adds organization logo to document.
     *
     * @param {Buffer} documentBuffer - Document buffer
     * @param {LogoConfig} config - Logo configuration
     * @returns {Promise<Buffer>} Document with logo
     *
     * @example
     * ```typescript
     * const withLogo = await service.addOrganizationLogo(docBuffer, {
     *   image: logoBuffer,
     *   width: 150,
     *   height: 50,
     *   position: { x: 50, y: 20 },
     *   opacity: 1.0
     * });
     * ```
     */
    addOrganizationLogo(documentBuffer: Buffer, config: LogoConfig): Promise<Buffer>;
    /**
     * 21. Positions logo in header.
     *
     * @param {string} content - Document content
     * @param {Buffer} logo - Logo image
     * @param {string} alignment - Alignment
     * @returns {Promise<string>} Document with logo in header
     *
     * @example
     * ```typescript
     * const withLogo = await service.positionLogoInHeader(content, logoBuffer, 'left');
     * ```
     */
    positionLogoInHeader(content: string, logo: Buffer, alignment: 'left' | 'center' | 'right'): Promise<string>;
    /**
     * 22. Applies brand color scheme.
     *
     * @param {string} content - Document content
     * @param {Object} colors - Color scheme
     * @returns {Promise<string>} Document with brand colors
     *
     * @example
     * ```typescript
     * const colored = await service.applyBrandColorScheme(content, {
     *   primary: '#0066CC',
     *   secondary: '#00AA66',
     *   accent: '#FF6600'
     * });
     * ```
     */
    applyBrandColorScheme(content: string, colors: {
        primary: string;
        secondary: string;
        accent?: string;
    }): Promise<string>;
    /**
     * 23. Applies brand typography.
     *
     * @param {string} content - Document content
     * @param {Object} typography - Typography settings
     * @returns {Promise<string>} Document with brand typography
     *
     * @example
     * ```typescript
     * const styled = await service.applyBrandTypography(content, {
     *   headingFont: 'Helvetica',
     *   bodyFont: 'Arial',
     *   fontSize: 12
     * });
     * ```
     */
    applyBrandTypography(content: string, typography: {
        headingFont: string;
        bodyFont: string;
        fontSize: number;
    }): Promise<string>;
    /**
     * 24. Adds organization tagline.
     *
     * @param {string} content - Document content
     * @param {string} tagline - Tagline text
     * @param {WatermarkPosition} position - Position
     * @returns {Promise<string>} Document with tagline
     *
     * @example
     * ```typescript
     * const withTagline = await service.addOrganizationTagline(
     *   content,
     *   'Excellence in Healthcare',
     *   'header'
     * );
     * ```
     */
    addOrganizationTagline(content: string, tagline: string, position: WatermarkPosition): Promise<string>;
    /**
     * 25. Adds contact information footer.
     *
     * @param {string} content - Document content
     * @param {Object} contactInfo - Contact information
     * @returns {Promise<string>} Document with contact info
     *
     * @example
     * ```typescript
     * const withContact = await service.addContactInformationFooter(content, {
     *   phone: '1-800-HEALTH',
     *   email: 'info@whitecross.health',
     *   website: 'www.whitecross.health',
     *   address: '123 Medical Center Dr, Boston, MA'
     * });
     * ```
     */
    addContactInformationFooter(content: string, contactInfo: {
        phone?: string;
        email?: string;
        website?: string;
        address?: string;
    }): Promise<string>;
    /**
     * 26. Validates brand compliance.
     *
     * @param {string} content - Document content
     * @param {BrandingConfig} brandGuidelines - Brand guidelines
     * @returns {Promise<{compliant: boolean; violations: string[]}>} Compliance check
     *
     * @example
     * ```typescript
     * const compliance = await service.validateBrandCompliance(content, brandGuidelines);
     * ```
     */
    validateBrandCompliance(content: string, brandGuidelines: BrandingConfig): Promise<{
        compliant: boolean;
        violations: string[];
    }>;
    /**
     * 27. Generates branded template.
     *
     * @param {BrandingConfig} branding - Branding configuration
     * @returns {Promise<string>} Template ID
     *
     * @example
     * ```typescript
     * const templateId = await service.generateBrandedTemplate(brandingConfig);
     * ```
     */
    generateBrandedTemplate(branding: BrandingConfig): Promise<string>;
    /**
     * 28. Applies responsive branding for different formats.
     *
     * @param {string} content - Document content
     * @param {BrandingConfig} branding - Branding configuration
     * @param {string} format - Output format
     * @returns {Promise<string>} Formatted content
     *
     * @example
     * ```typescript
     * const responsive = await service.applyResponsiveBranding(content, branding, 'pdf');
     * ```
     */
    applyResponsiveBranding(content: string, branding: BrandingConfig, format: 'html' | 'pdf' | 'email'): Promise<string>;
    /**
     * 29. Applies custom CSS styles to document.
     *
     * @param {string} content - Document content
     * @param {string} cssStyles - CSS styles
     * @returns {Promise<string>} Styled document
     *
     * @example
     * ```typescript
     * const styled = await service.applyCustomCssStyles(content, `
     *   body { font-family: Arial; line-height: 1.6; }
     *   h1 { color: #0066CC; }
     * `);
     * ```
     */
    applyCustomCssStyles(content: string, cssStyles: string): Promise<string>;
    /**
     * 30. Applies professional document theme.
     *
     * @param {string} content - Document content
     * @param {BrandTheme} theme - Theme name
     * @returns {Promise<string>} Themed document
     *
     * @example
     * ```typescript
     * const themed = await service.applyProfessionalTheme(content, 'medical');
     * ```
     */
    applyProfessionalTheme(content: string, theme: BrandTheme): Promise<string>;
    /**
     * 31. Sets document margins and padding.
     *
     * @param {string} content - Document content
     * @param {StyleConfig} config - Style configuration
     * @returns {Promise<string>} Formatted document
     *
     * @example
     * ```typescript
     * const formatted = await service.setDocumentMarginsPadding(content, {
     *   margins: { top: 72, right: 72, bottom: 72, left: 72 }
     * });
     * ```
     */
    setDocumentMarginsPadding(content: string, config: StyleConfig): Promise<string>;
    /**
     * 32. Applies font styling to document.
     *
     * @param {string} content - Document content
     * @param {Object} fontConfig - Font configuration
     * @returns {Promise<string>} Styled document
     *
     * @example
     * ```typescript
     * const styled = await service.applyFontStyling(content, {
     *   family: 'Arial',
     *   size: 11,
     *   lineHeight: 1.5
     * });
     * ```
     */
    applyFontStyling(content: string, fontConfig: {
        family: string;
        size: number;
        lineHeight: number;
    }): Promise<string>;
    /**
     * 33. Sets background color or image.
     *
     * @param {string} content - Document content
     * @param {string | Buffer} background - Background color or image
     * @returns {Promise<string>} Document with background
     *
     * @example
     * ```typescript
     * const withBg = await service.setBackgroundColorImage(content, '#F5F5F5');
     * ```
     */
    setBackgroundColorImage(content: string, background: string | Buffer): Promise<string>;
    /**
     * 34. Applies border styling.
     *
     * @param {string} content - Document content
     * @param {Object} borderConfig - Border configuration
     * @returns {Promise<string>} Document with borders
     *
     * @example
     * ```typescript
     * const bordered = await service.applyBorderStyling(content, {
     *   width: 2,
     *   color: '#0066CC',
     *   style: 'solid',
     *   position: 'top'
     * });
     * ```
     */
    applyBorderStyling(content: string, borderConfig: {
        width: number;
        color: string;
        style: string;
        position?: string;
    }): Promise<string>;
    /**
     * 35. Formats document for print.
     *
     * @param {string} content - Document content
     * @returns {Promise<string>} Print-formatted document
     *
     * @example
     * ```typescript
     * const printReady = await service.formatForPrintOutput(content);
     * ```
     */
    formatForPrintOutput(content: string): Promise<string>;
    /**
     * 36. Optimizes document styling for PDF export.
     *
     * @param {string} content - Document content
     * @returns {Promise<Buffer>} PDF-optimized document
     *
     * @example
     * ```typescript
     * const pdfOptimized = await service.optimizeForPdfExport(content);
     * ```
     */
    optimizeForPdfExport(content: string): Promise<Buffer>;
    /**
     * 37. Creates custom branded template.
     *
     * @param {string} templateName - Template name
     * @param {BrandingConfig} branding - Branding configuration
     * @param {string} content - Template content
     * @returns {Promise<string>} Created template ID
     *
     * @example
     * ```typescript
     * const templateId = await service.createCustomBrandedTemplate(
     *   'Medical Report Template',
     *   brandingConfig,
     *   templateContent
     * );
     * ```
     */
    createCustomBrandedTemplate(templateName: string, branding: BrandingConfig, content: string): Promise<string>;
    /**
     * 38. Customizes template header.
     *
     * @param {string} templateId - Template ID
     * @param {string} headerContent - Header content
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.customizeTemplateHeader('template-123', headerHtml);
     * ```
     */
    customizeTemplateHeader(templateId: string, headerContent: string): Promise<void>;
    /**
     * 39. Customizes template footer.
     *
     * @param {string} templateId - Template ID
     * @param {string} footerContent - Footer content
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.customizeTemplateFooter('template-123', footerHtml);
     * ```
     */
    customizeTemplateFooter(templateId: string, footerContent: string): Promise<void>;
    /**
     * 40. Applies template variables.
     *
     * @param {string} templateContent - Template content
     * @param {Record<string, any>} variables - Variables
     * @returns {Promise<string>} Rendered content
     *
     * @example
     * ```typescript
     * const rendered = await service.applyTemplateVariables(template, {
     *   patientName: 'John Doe',
     *   reportDate: '2024-01-15'
     * });
     * ```
     */
    applyTemplateVariables(templateContent: string, variables: Record<string, any>): Promise<string>;
    /**
     * 41. Generates document from branded template.
     *
     * @param {string} templateId - Template ID
     * @param {Record<string, any>} data - Template data
     * @returns {Promise<Buffer>} Generated document
     *
     * @example
     * ```typescript
     * const document = await service.generateFromBrandedTemplate('template-123', data);
     * ```
     */
    generateFromBrandedTemplate(templateId: string, data: Record<string, any>): Promise<Buffer>;
    /**
     * 42. Creates multi-page branded document.
     *
     * @param {Array<{templateId: string; data: Record<string, any>}>} pages - Pages configuration
     * @param {BrandingConfig} branding - Branding
     * @returns {Promise<Buffer>} Multi-page document
     *
     * @example
     * ```typescript
     * const document = await service.createMultiPageBrandedDocument([
     *   { templateId: 'cover-page', data: coverData },
     *   { templateId: 'content-page', data: contentData }
     * ], branding);
     * ```
     */
    createMultiPageBrandedDocument(pages: Array<{
        templateId: string;
        data: Record<string, any>;
    }>, branding: BrandingConfig): Promise<Buffer>;
    /**
     * 43. Exports branded template as PDF.
     *
     * @param {string} templateId - Template ID
     * @param {Record<string, any>} data - Data
     * @returns {Promise<Buffer>} PDF buffer
     *
     * @example
     * ```typescript
     * const pdf = await service.exportBrandedTemplateAsPdf('template-123', data);
     * ```
     */
    exportBrandedTemplateAsPdf(templateId: string, data: Record<string, any>): Promise<Buffer>;
    /**
     * 44. Clones template with customizations.
     *
     * @param {string} sourceTemplateId - Source template ID
     * @param {string} newName - New template name
     * @param {Partial<BrandingConfig>} customizations - Customizations
     * @returns {Promise<string>} New template ID
     *
     * @example
     * ```typescript
     * const newTemplateId = await service.cloneTemplateWithCustomizations(
     *   'template-123',
     *   'Custom Medical Report',
     *   { primaryColor: '#FF6600' }
     * );
     * ```
     */
    cloneTemplateWithCustomizations(sourceTemplateId: string, newName: string, customizations: Partial<BrandingConfig>): Promise<string>;
    /**
     * 45. Validates template branding consistency.
     *
     * @param {string} templateId - Template ID
     * @param {BrandingConfig} brandGuidelines - Brand guidelines
     * @returns {Promise<{consistent: boolean; issues: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateTemplateBrandingConsistency(
     *   'template-123',
     *   brandGuidelines
     * );
     * ```
     */
    validateTemplateBrandingConsistency(templateId: string, brandGuidelines: BrandingConfig): Promise<{
        consistent: boolean;
        issues: string[];
    }>;
    /**
     * Builds header HTML.
     *
     * @private
     */
    private buildHeaderHtml;
    /**
     * Builds footer HTML.
     *
     * @private
     */
    private buildFooterHtml;
    /**
     * Generates brand styles.
     *
     * @private
     */
    private generateBrandStyles;
    /**
     * Gets theme styles.
     *
     * @private
     */
    private getThemeStyles;
    /**
     * Generates branded template content.
     *
     * @private
     */
    private generateBrandedTemplateContent;
}
export default WatermarkingBrandingCompositeService;
//# sourceMappingURL=document-watermarking-branding-composite.d.ts.map