/**
 * LOC: DOC-COMP-ACCESS-001
 * File: /reuse/document/composites/document-accessibility-i18n-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - i18next (v23.x)
 *   - axe-core (v4.x)
 *   - ../document-pdf-advanced-kit
 *   - ../document-rendering-kit
 *   - ../document-compliance-advanced-kit
 *
 * DOWNSTREAM (imported by):
 *   - Accessibility compliance controllers
 *   - Multi-language document services
 *   - WCAG validation modules
 *   - Internationalization processors
 *   - Document rendering services
 */
import { Sequelize } from 'sequelize';
/**
 * WCAG conformance levels
 *
 * @description Defines Web Content Accessibility Guidelines compliance levels
 * @see https://www.w3.org/WAI/WCAG21/quickref/
 */
export type WcagLevel = 'A' | 'AA' | 'AAA';
/**
 * Accessibility issue severity classification
 *
 * @description Categorizes accessibility violations by their impact on users with disabilities
 */
export type AccessibilitySeverity = 'critical' | 'serious' | 'moderate' | 'minor';
/**
 * Supported languages for internationalization
 *
 * @description ISO 639-1 language codes supported by the platform
 */
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ar' | 'pt' | 'ru' | 'hi';
/**
 * Text direction for bidirectional text support
 *
 * @description Defines text flow direction for proper RTL language rendering
 */
export type TextDirection = 'ltr' | 'rtl';
/**
 * Accessibility audit result
 *
 * @property {boolean} compliant - Whether document meets target WCAG level
 * @property {WcagLevel} wcagLevel - WCAG conformance level tested against
 * @property {number} score - Accessibility score (0-100)
 * @property {Array} violations - Array of accessibility violations found
 * @property {number} passes - Count of passed accessibility checks
 * @property {number} incomplete - Count of checks requiring manual review
 * @property {string[]} recommendations - Actionable remediation suggestions
 */
export interface AccessibilityAuditResult {
    compliant: boolean;
    wcagLevel: WcagLevel;
    score: number;
    violations: Array<{
        id: string;
        impact: AccessibilitySeverity;
        description: string;
        helpUrl: string;
        nodes: number;
    }>;
    passes: number;
    incomplete: number;
    recommendations: string[];
}
/**
 * Translation configuration
 *
 * @property {SupportedLanguage} sourceLanguage - Original document language
 * @property {SupportedLanguage[]} targetLanguages - Languages to translate into
 * @property {boolean} translateMetadata - Whether to translate document metadata
 * @property {boolean} preserveFormatting - Maintain original formatting in translations
 * @property {boolean} useGlossary - Apply translation glossary for consistency
 * @property {string} [glossaryId] - Optional ID of custom glossary to use
 */
export interface TranslationConfig {
    sourceLanguage: SupportedLanguage;
    targetLanguages: SupportedLanguage[];
    translateMetadata: boolean;
    preserveFormatting: boolean;
    useGlossary: boolean;
    glossaryId?: string;
}
/**
 * Localization settings
 *
 * @property {string} locale - Full locale identifier (e.g., 'en-US', 'es-ES')
 * @property {SupportedLanguage} language - ISO 639-1 language code
 * @property {TextDirection} textDirection - Text reading direction
 * @property {string} dateFormat - Locale-specific date format pattern
 * @property {string} timeFormat - Locale-specific time format (12h/24h)
 * @property {string} numberFormat - Number formatting style (e.g., 'European', 'US')
 * @property {string} [currencyFormat] - Optional currency formatting rules
 * @property {string} [timezone] - IANA timezone identifier
 */
export interface LocalizationSettings {
    locale: string;
    language: SupportedLanguage;
    textDirection: TextDirection;
    dateFormat: string;
    timeFormat: string;
    numberFormat: string;
    currencyFormat?: string;
    timezone?: string;
}
/**
 * Screen reader configuration
 *
 * @property {boolean} ariaLabels - Enable ARIA label generation
 * @property {boolean} landmarks - Add ARIA landmark roles
 * @property {boolean} skipLinks - Include skip navigation links
 * @property {boolean} liveRegions - Implement ARIA live regions for dynamic content
 * @property {boolean} describedBy - Add aria-describedby relationships
 */
export interface ScreenReaderConfig {
    ariaLabels: boolean;
    landmarks: boolean;
    skipLinks: boolean;
    liveRegions: boolean;
    describedBy: boolean;
}
/**
 * Keyboard navigation configuration
 *
 * @property {boolean} tabOrder - Enforce logical tab order
 * @property {boolean} focusIndicators - Show visible focus indicators
 * @property {Array} shortcuts - Keyboard shortcut definitions
 * @property {boolean} trapFocus - Enable focus trapping in modals
 */
export interface KeyboardNavigationConfig {
    tabOrder: boolean;
    focusIndicators: boolean;
    shortcuts: Array<{
        key: string;
        action: string;
        description: string;
    }>;
    trapFocus: boolean;
}
/**
 * Alternative text mapping for images
 *
 * @property {string} imageId - Unique image identifier
 * @property {string} altText - Descriptive alternative text
 * @property {SupportedLanguage} language - Language of alt text
 * @property {string} [context] - Optional contextual information
 */
export interface AltTextMapping {
    imageId: string;
    altText: string;
    language: SupportedLanguage;
    context?: string;
}
/**
 * Accessibility & I18n Composite Service
 *
 * Provides comprehensive WCAG compliance, PDF/UA accessibility, multi-language support,
 * and internationalization capabilities for healthcare documents.
 */
export declare class AccessibilityI18nCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Performs comprehensive WCAG accessibility audit.
     *
     * @param {Buffer} documentBuffer - Document to audit
     * @param {WcagLevel} targetLevel - Target WCAG level
     * @returns {Promise<AccessibilityAuditResult>} Audit result
     *
     * @example
     * ```typescript
     * const audit = await service.performWcagAccessibilityAudit(docBuffer, 'AA');
     * console.log(`Compliance: ${audit.compliant}, Score: ${audit.score}`);
     * ```
     */
    performWcagAccessibilityAudit(documentBuffer: Buffer, targetLevel: WcagLevel): Promise<AccessibilityAuditResult>;
    /**
     * 2. Validates WCAG 2.1 Level AA compliance.
     *
     * @param {string} htmlContent - HTML content
     * @returns {Promise<{compliant: boolean; violations: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateWcag21LevelAA(htmlContent);
     * ```
     */
    validateWcag21LevelAA(htmlContent: string): Promise<{
        compliant: boolean;
        violations: string[];
    }>;
    /**
     * 3. Generates accessibility compliance report.
     *
     * @param {Buffer} documentBuffer - Document buffer
     * @returns {Promise<any>} Compliance report
     *
     * @example
     * ```typescript
     * const report = await service.generateAccessibilityComplianceReport(docBuffer);
     * ```
     */
    generateAccessibilityComplianceReport(documentBuffer: Buffer): Promise<{
        compliant: boolean;
        wcagLevel?: string;
        issues: string[];
        structure: any;
    }>;
    /**
     * 4. Validates PDF/UA compliance.
     *
     * @param {Buffer} pdfBuffer - PDF buffer
     * @returns {Promise<{valid: boolean; issues: Array<any>}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validatePdfUaCompliance(pdfBuffer);
     * ```
     */
    validatePdfUaCompliance(pdfBuffer: Buffer): Promise<{
        valid: boolean;
        issues: Array<{
            type: string;
            message: string;
            severity: string;
        }>;
    }>;
    /**
     * 5. Checks color contrast ratios for WCAG compliance.
     *
     * @param {string} foreground - Foreground color (hex)
     * @param {string} background - Background color (hex)
     * @param {WcagLevel} level - Target WCAG level
     * @returns {Promise<{passes: boolean; ratio: number; required: number}>} Contrast check result
     *
     * @example
     * ```typescript
     * const contrast = await service.checkColorContrastRatio('#000000', '#FFFFFF', 'AA');
     * console.log(`Ratio: ${contrast.ratio}, Passes: ${contrast.passes}`);
     * ```
     */
    checkColorContrastRatio(foreground: string, background: string, level: WcagLevel): Promise<{
        passes: boolean;
        ratio: number;
        required: number;
    }>;
    /**
     * 6. Validates heading hierarchy structure.
     *
     * @param {string} htmlContent - HTML content
     * @returns {Promise<{valid: boolean; errors: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateHeadingHierarchy(htmlContent);
     * ```
     */
    validateHeadingHierarchy(htmlContent: string): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    /**
     * 7. Validates ARIA attributes usage.
     *
     * @param {string} htmlContent - HTML content
     * @returns {Promise<{valid: boolean; errors: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateAriaAttributes(htmlContent);
     * ```
     */
    validateAriaAttributes(htmlContent: string): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    /**
     * 8. Analyzes document semantic structure.
     *
     * @param {string} htmlContent - HTML content
     * @returns {Promise<any>} Structure analysis
     *
     * @example
     * ```typescript
     * const structure = await service.analyzeDocumentSemanticStructure(htmlContent);
     * ```
     */
    analyzeDocumentSemanticStructure(htmlContent: string): Promise<{
        hasLandmarks: boolean;
        hasHeadings: boolean;
        hasLists: boolean;
        hasNav: boolean;
        hasTables: boolean;
    }>;
    /**
     * 9. Validates table accessibility.
     *
     * @param {string} htmlContent - HTML content with tables
     * @returns {Promise<{valid: boolean; errors: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateTableAccessibility(htmlContent);
     * ```
     */
    validateTableAccessibility(htmlContent: string): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    /**
     * 10. Generates accessibility remediation suggestions.
     *
     * @param {AccessibilityAuditResult} auditResult - Audit result
     * @returns {Promise<Array<{issue: string; fix: string; priority: string}>>} Remediation suggestions
     *
     * @example
     * ```typescript
     * const suggestions = await service.generateAccessibilityRemediations(auditResult);
     * ```
     */
    generateAccessibilityRemediations(auditResult: AccessibilityAuditResult): Promise<Array<{
        issue: string;
        fix: string;
        priority: string;
    }>>;
    /**
     * 11. Converts PDF to PDF/UA accessible format.
     *
     * @param {Buffer} pdfBuffer - PDF buffer
     * @param {Object} options - Conversion options
     * @returns {Promise<Buffer>} PDF/UA compliant PDF
     *
     * @example
     * ```typescript
     * const accessiblePdf = await service.convertPdfToAccessible(pdfBuffer, {
     *   autoTag: true,
     *   detectHeadings: true,
     *   setLanguage: 'en-US',
     *   setTitle: 'Medical Report'
     * });
     * ```
     */
    convertPdfToAccessible(pdfBuffer: Buffer, options: {
        autoTag?: boolean;
        detectHeadings?: boolean;
        setLanguage?: string;
        setTitle?: string;
    }): Promise<Buffer>;
    /**
     * 12. Analyzes PDF accessibility structure.
     *
     * @param {Buffer} pdfBuffer - PDF buffer
     * @returns {Promise<any>} Accessibility structure
     *
     * @example
     * ```typescript
     * const structure = await service.analyzePdfAccessibilityStructure(pdfBuffer);
     * ```
     */
    analyzePdfAccessibilityStructure(pdfBuffer: Buffer): Promise<{
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
    }>;
    /**
     * 13. Adds alternative text to PDF images.
     *
     * @param {Buffer} pdfBuffer - PDF buffer
     * @param {Map<number, string>} altTextMap - Image index to alt text mapping
     * @returns {Promise<Buffer>} PDF with alt text
     *
     * @example
     * ```typescript
     * const withAlt = await service.addAltTextToPdfImages(pdfBuffer, new Map([
     *   [0, 'Chest X-ray showing clear lungs'],
     *   [1, 'ECG results from January 15, 2024']
     * ]));
     * ```
     */
    addAltTextToPdfImages(pdfBuffer: Buffer, altTextMap: Map<number, string>): Promise<Buffer>;
    /**
     * 14. Sets PDF reading order for screen readers.
     *
     * @param {Buffer} pdfBuffer - PDF buffer
     * @returns {Promise<Buffer>} PDF with logical reading order
     *
     * @example
     * ```typescript
     * const ordered = await service.setPdfReadingOrder(pdfBuffer);
     * ```
     */
    setPdfReadingOrder(pdfBuffer: Buffer): Promise<Buffer>;
    /**
     * 15. Tags PDF structure for accessibility.
     *
     * @param {Buffer} pdfBuffer - PDF buffer
     * @returns {Promise<Buffer>} Tagged PDF
     *
     * @example
     * ```typescript
     * const tagged = await service.tagPdfStructure(pdfBuffer);
     * ```
     */
    tagPdfStructure(pdfBuffer: Buffer): Promise<Buffer>;
    /**
     * 16. Sets PDF document language.
     *
     * @param {Buffer} pdfBuffer - PDF buffer
     * @param {string} language - Language code (ISO 639)
     * @returns {Promise<Buffer>} PDF with language set
     *
     * @example
     * ```typescript
     * const withLang = await service.setPdfDocumentLanguage(pdfBuffer, 'en-US');
     * ```
     */
    setPdfDocumentLanguage(pdfBuffer: Buffer, language: string): Promise<Buffer>;
    /**
     * 17. Adds PDF document title for accessibility.
     *
     * @param {Buffer} pdfBuffer - PDF buffer
     * @param {string} title - Document title
     * @returns {Promise<Buffer>} PDF with title
     *
     * @example
     * ```typescript
     * const withTitle = await service.addPdfDocumentTitle(pdfBuffer, 'Patient Medical Record');
     * ```
     */
    addPdfDocumentTitle(pdfBuffer: Buffer, title: string): Promise<Buffer>;
    /**
     * 18. Validates PDF bookmarks structure.
     *
     * @param {Buffer} pdfBuffer - PDF buffer
     * @returns {Promise<{hasBookmarks: boolean; count: number}>} Bookmark validation
     *
     * @example
     * ```typescript
     * const validation = await service.validatePdfBookmarks(pdfBuffer);
     * ```
     */
    validatePdfBookmarks(pdfBuffer: Buffer): Promise<{
        hasBookmarks: boolean;
        count: number;
    }>;
    /**
     * 19. Generates ARIA labels for elements.
     *
     * @param {string} htmlContent - HTML content
     * @returns {Promise<string>} HTML with ARIA labels
     *
     * @example
     * ```typescript
     * const withAria = await service.generateAriaLabels(htmlContent);
     * ```
     */
    generateAriaLabels(htmlContent: string): Promise<string>;
    /**
     * 20. Adds ARIA landmarks to document.
     *
     * @param {string} htmlContent - HTML content
     * @returns {Promise<string>} HTML with landmarks
     *
     * @example
     * ```typescript
     * const withLandmarks = await service.addAriaLandmarks(htmlContent);
     * ```
     */
    addAriaLandmarks(htmlContent: string): Promise<string>;
    /**
     * 21. Creates skip navigation links.
     *
     * @param {string} htmlContent - HTML content
     * @returns {Promise<string>} HTML with skip links
     *
     * @example
     * ```typescript
     * const withSkipLinks = await service.createSkipNavigationLinks(htmlContent);
     * ```
     */
    createSkipNavigationLinks(htmlContent: string): Promise<string>;
    /**
     * 22. Implements ARIA live regions.
     *
     * @param {string} htmlContent - HTML content
     * @returns {Promise<string>} HTML with live regions
     *
     * @example
     * ```typescript
     * const withLiveRegions = await service.implementAriaLiveRegions(htmlContent);
     * ```
     */
    implementAriaLiveRegions(htmlContent: string): Promise<string>;
    /**
     * 23. Enhances form accessibility for screen readers.
     *
     * @param {string} htmlContent - HTML with forms
     * @returns {Promise<string>} Enhanced HTML
     *
     * @example
     * ```typescript
     * const enhanced = await service.enhanceFormAccessibility(htmlContent);
     * ```
     */
    enhanceFormAccessibility(htmlContent: string): Promise<string>;
    /**
     * 24. Generates screen reader announcements.
     *
     * @param {string} message - Announcement message
     * @param {string} priority - Priority level
     * @returns {Promise<string>} ARIA live region HTML
     *
     * @example
     * ```typescript
     * const announcement = await service.generateScreenReaderAnnouncement(
     *   'Document saved successfully',
     *   'polite'
     * );
     * ```
     */
    generateScreenReaderAnnouncement(message: string, priority: 'polite' | 'assertive'): Promise<string>;
    /**
     * 25. Translates document content to multiple languages.
     *
     * @param {string} content - Content to translate
     * @param {TranslationConfig} config - Translation configuration
     * @returns {Promise<Map<SupportedLanguage, string>>} Translated content
     *
     * @example
     * ```typescript
     * const translations = await service.translateDocumentContent(content, {
     *   sourceLanguage: 'en',
     *   targetLanguages: ['es', 'fr', 'de'],
     *   preserveFormatting: true,
     *   useGlossary: true
     * });
     * ```
     */
    translateDocumentContent(content: string, config: TranslationConfig): Promise<Map<SupportedLanguage, string>>;
    /**
     * 26. Applies localization settings to document.
     *
     * @param {string} content - Document content
     * @param {LocalizationSettings} settings - Localization settings
     * @returns {Promise<string>} Localized content
     *
     * @example
     * ```typescript
     * const localized = await service.applyLocalizationSettings(content, {
     *   locale: 'es-ES',
     *   language: 'es',
     *   textDirection: 'ltr',
     *   dateFormat: 'DD/MM/YYYY',
     *   timeFormat: '24h',
     *   numberFormat: 'European'
     * });
     * ```
     */
    applyLocalizationSettings(content: string, settings: LocalizationSettings): Promise<string>;
    /**
     * 27. Formats dates for specific locale.
     *
     * @param {Date} date - Date to format
     * @param {string} locale - Locale code
     * @param {string} format - Format pattern
     * @returns {Promise<string>} Formatted date
     *
     * @example
     * ```typescript
     * const formatted = await service.formatDateForLocale(
     *   new Date(),
     *   'es-ES',
     *   'DD/MM/YYYY'
     * );
     * ```
     */
    formatDateForLocale(date: Date, locale: string, format: string): Promise<string>;
    /**
     * 28. Formats numbers for specific locale.
     *
     * @param {number} value - Number to format
     * @param {string} locale - Locale code
     * @returns {Promise<string>} Formatted number
     *
     * @example
     * ```typescript
     * const formatted = await service.formatNumberForLocale(1234.56, 'de-DE');
     * // Returns: "1.234,56"
     * ```
     */
    formatNumberForLocale(value: number, locale: string): Promise<string>;
    /**
     * 29. Supports right-to-left (RTL) languages.
     *
     * @param {string} content - Content
     * @param {SupportedLanguage} language - Language
     * @returns {Promise<string>} RTL-ready content
     *
     * @example
     * ```typescript
     * const rtl = await service.supportRtlLanguages(content, 'ar');
     * ```
     */
    supportRtlLanguages(content: string, language: SupportedLanguage): Promise<string>;
    /**
     * 30. Manages translation glossaries.
     *
     * @param {string} term - Term to look up
     * @param {SupportedLanguage} targetLanguage - Target language
     * @returns {Promise<string>} Translated term
     *
     * @example
     * ```typescript
     * const translation = await service.manageTranslationGlossary('diagnosis', 'es');
     * ```
     */
    manageTranslationGlossary(term: string, targetLanguage: SupportedLanguage): Promise<string>;
    /**
     * 31. Validates locale support.
     *
     * @param {string} locale - Locale code
     * @returns {Promise<boolean>} True if supported
     *
     * @example
     * ```typescript
     * const supported = await service.validateLocaleSupport('es-ES');
     * ```
     */
    validateLocaleSupport(locale: string): Promise<boolean>;
    /**
     * 32. Generates multilingual metadata.
     *
     * @param {Record<string, any>} metadata - Base metadata
     * @param {SupportedLanguage[]} languages - Target languages
     * @returns {Promise<Map<SupportedLanguage, Record<string, any>>>} Multilingual metadata
     *
     * @example
     * ```typescript
     * const metadata = await service.generateMultilingualMetadata(
     *   { title: 'Medical Report', description: 'Patient diagnosis' },
     *   ['es', 'fr']
     * );
     * ```
     */
    generateMultilingualMetadata(metadata: Record<string, any>, languages: SupportedLanguage[]): Promise<Map<SupportedLanguage, Record<string, any>>>;
    /**
     * 33. Implements keyboard navigation support.
     *
     * @param {string} htmlContent - HTML content
     * @returns {Promise<string>} HTML with keyboard navigation
     *
     * @example
     * ```typescript
     * const enhanced = await service.implementKeyboardNavigation(htmlContent);
     * ```
     */
    implementKeyboardNavigation(htmlContent: string): Promise<string>;
    /**
     * 34. Sets proper tab order.
     *
     * @param {string} htmlContent - HTML content
     * @returns {Promise<string>} HTML with tab order
     *
     * @example
     * ```typescript
     * const ordered = await service.setProperTabOrder(htmlContent);
     * ```
     */
    setProperTabOrder(htmlContent: string): Promise<string>;
    /**
     * 35. Creates keyboard shortcuts documentation.
     *
     * @param {KeyboardNavigationConfig} config - Navigation configuration
     * @returns {Promise<string>} Shortcuts documentation HTML
     *
     * @example
     * ```typescript
     * const docs = await service.createKeyboardShortcutsDoc({
     *   shortcuts: [
     *     { key: 'Ctrl+S', action: 'save', description: 'Save document' },
     *     { key: 'Ctrl+P', action: 'print', description: 'Print document' }
     *   ]
     * });
     * ```
     */
    createKeyboardShortcutsDoc(config: KeyboardNavigationConfig): Promise<string>;
    /**
     * 36. Adds focus indicators to elements.
     *
     * @param {string} htmlContent - HTML content
     * @returns {Promise<string>} HTML with focus indicators
     *
     * @example
     * ```typescript
     * const withFocus = await service.addFocusIndicators(htmlContent);
     * ```
     */
    addFocusIndicators(htmlContent: string): Promise<string>;
    /**
     * 37. Implements focus trap for modals.
     *
     * @param {string} modalHtml - Modal HTML
     * @returns {Promise<string>} Modal with focus trap
     *
     * @example
     * ```typescript
     * const modal = await service.implementFocusTrap(modalHtml);
     * ```
     */
    implementFocusTrap(modalHtml: string): Promise<string>;
    /**
     * 38. Validates keyboard accessibility.
     *
     * @param {string} htmlContent - HTML content
     * @returns {Promise<{accessible: boolean; issues: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateKeyboardAccessibility(htmlContent);
     * ```
     */
    validateKeyboardAccessibility(htmlContent: string): Promise<{
        accessible: boolean;
        issues: string[];
    }>;
    /**
     * 39. Generates Section 508 compliance report.
     *
     * @param {Buffer} documentBuffer - Document buffer
     * @returns {Promise<any>} Section 508 report
     *
     * @example
     * ```typescript
     * const report = await service.generateSection508Report(docBuffer);
     * ```
     */
    generateSection508Report(documentBuffer: Buffer): Promise<{
        compliant: boolean;
        checklist: Array<{
            requirement: string;
            status: string;
        }>;
    }>;
    /**
     * 40. Generates WCAG 2.2 compliance report.
     *
     * @param {string} htmlContent - HTML content
     * @param {WcagLevel} level - Target WCAG level
     * @returns {Promise<any>} WCAG report
     *
     * @example
     * ```typescript
     * const report = await service.generateWcag22Report(htmlContent, 'AA');
     * ```
     */
    generateWcag22Report(htmlContent: string, level: WcagLevel): Promise<{
        compliant: boolean;
        level: WcagLevel;
        violations: string[];
    }>;
    /**
     * 41. Generates accessibility audit summary.
     *
     * @param {AccessibilityAuditResult} audit - Audit result
     * @returns {Promise<string>} Summary HTML
     *
     * @example
     * ```typescript
     * const summary = await service.generateAuditSummary(auditResult);
     * ```
     */
    generateAuditSummary(audit: AccessibilityAuditResult): Promise<string>;
    /**
     * 42. Tracks accessibility improvements over time.
     *
     * @param {string} documentId - Document ID
     * @param {AccessibilityAuditResult} currentAudit - Current audit
     * @returns {Promise<any>} Improvement tracking data
     *
     * @example
     * ```typescript
     * const tracking = await service.trackAccessibilityImprovements('doc-123', audit);
     * ```
     */
    trackAccessibilityImprovements(documentId: string, currentAudit: AccessibilityAuditResult): Promise<{
        improved: boolean;
        previousScore: number;
        currentScore: number;
    }>;
    /**
     * 43. Generates comprehensive accessibility scorecard.
     *
     * @param {Buffer} documentBuffer - Document buffer
     * @returns {Promise<any>} Accessibility scorecard
     *
     * @example
     * ```typescript
     * const scorecard = await service.generateAccessibilityScorecard(docBuffer);
     * ```
     */
    generateAccessibilityScorecard(documentBuffer: Buffer): Promise<{
        overallScore: number;
        wcagCompliance: boolean;
        section508Compliance: boolean;
        pdfUaCompliance: boolean;
        categories: Record<string, number>;
    }>;
    /**
     * 44. Validates multi-language accessibility.
     *
     * @param {Map<SupportedLanguage, string>} translations - Translations
     * @returns {Promise<Map<SupportedLanguage, AccessibilityAuditResult>>} Validation results
     *
     * @example
     * ```typescript
     * const results = await service.validateMultiLanguageAccessibility(translations);
     * ```
     */
    validateMultiLanguageAccessibility(translations: Map<SupportedLanguage, string>): Promise<Map<SupportedLanguage, AccessibilityAuditResult>>;
    /**
     * 45. Generates comprehensive accessibility and i18n report.
     *
     * @param {Buffer} documentBuffer - Document buffer
     * @param {SupportedLanguage[]} languages - Supported languages
     * @returns {Promise<any>} Comprehensive report
     *
     * @example
     * ```typescript
     * const report = await service.generateComprehensiveAccessibilityReport(
     *   docBuffer,
     *   ['en', 'es', 'fr']
     * );
     * ```
     */
    generateComprehensiveAccessibilityReport(documentBuffer: Buffer, languages: SupportedLanguage[]): Promise<{
        accessibility: AccessibilityAuditResult;
        localization: Record<SupportedLanguage, boolean>;
        wcagCompliance: boolean;
        section508Compliance: boolean;
        recommendations: string[];
    }>;
    /**
     * Calculates color contrast ratio between foreground and background colors.
     *
     * Implements WCAG 2.1 contrast ratio formula using relative luminance.
     *
     * @private
     * @param {string} foreground - Foreground color in hex format
     * @param {string} background - Background color in hex format
     * @returns {number} Contrast ratio (1-21)
     *
     * @throws {Error} If color format is invalid
     *
     * @example
     * ```typescript
     * const ratio = this.calculateContrastRatio('#000000', '#FFFFFF');
     * // Returns: 21 (maximum contrast)
     * ```
     */
    private calculateContrastRatio;
    /**
     * Generates actionable accessibility recommendations from violations.
     *
     * @private
     * @param {Array<any>} violations - Array of accessibility violations
     * @returns {string[]} Array of prioritized remediation recommendations
     *
     * @example
     * ```typescript
     * const recommendations = this.generateRecommendations(violations);
     * // Returns: [
     * //   "Critical: Add document language attribute to improve screen reader support",
     * //   "High: Ensure all images have descriptive alt text",
     * //   ...
     * // ]
     * ```
     */
    private generateRecommendations;
    /**
     * Gets detailed remediation recommendation for specific violation.
     *
     * @private
     * @param {string} violationId - Violation identifier
     * @returns {string} Detailed recommendation text
     */
    private getDetailedRecommendation;
}
export default AccessibilityI18nCompositeService;
//# sourceMappingURL=document-accessibility-i18n-composite.d.ts.map