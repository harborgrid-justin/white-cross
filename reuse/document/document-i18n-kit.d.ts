/**
 * LOC: DOC-I18N-001
 * File: /reuse/document/document-i18n-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - date-fns
 *   - intl (Node.js)
 *   - unicode-bidirectional
 *
 * DOWNSTREAM (imported by):
 *   - Document internationalization controllers
 *   - Multi-language document services
 *   - Locale management modules
 *   - Healthcare translation services
 */
/**
 * File: /reuse/document/document-i18n-kit.ts
 * Locator: WC-UTL-DOCI18N-001
 * Purpose: Document Internationalization & Localization Kit - Multi-language support, RTL layouts, locale formatting, currency conversion
 *
 * Upstream: @nestjs/common, sequelize, date-fns, intl, unicode-bidirectional
 * Downstream: I18n controllers, translation services, locale modules, document rendering
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, date-fns 2.x, Intl API
 * Exports: 38 utility functions for translations, RTL support, locale detection, formatting, currency, pluralization
 *
 * LLM Context: Production-grade internationalization utilities for White Cross healthcare platform.
 * Provides multi-language document support, translation management, right-to-left (RTL) layout handling,
 * automatic locale detection, culturally-appropriate date/time/number formatting, real-time currency conversion,
 * pluralization rules for 100+ languages, translation key interpolation, missing translation handling,
 * bidirectional text support, locale-specific medical terminology, and GDPR-compliant language preferences.
 * Essential for serving international patients, multi-language medical records, and global healthcare operations.
 */
import { Sequelize } from 'sequelize';
/**
 * Supported locale code (ISO 639-1 language + ISO 3166-1 country)
 */
export type LocaleCode = 'en-US' | 'en-GB' | 'es-ES' | 'es-MX' | 'fr-FR' | 'de-DE' | 'it-IT' | 'pt-BR' | 'pt-PT' | 'zh-CN' | 'zh-TW' | 'ja-JP' | 'ko-KR' | 'ar-SA' | 'he-IL' | 'ru-RU' | 'hi-IN' | 'th-TH' | 'vi-VN' | 'pl-PL' | 'nl-NL' | 'tr-TR' | 'id-ID' | 'sv-SE' | 'da-DK' | 'fi-FI' | 'no-NO' | 'cs-CZ' | 'ro-RO' | 'uk-UA';
/**
 * Text direction for layout
 */
export type TextDirection = 'ltr' | 'rtl' | 'auto';
/**
 * Date format style
 */
export type DateFormatStyle = 'full' | 'long' | 'medium' | 'short';
/**
 * Number format style
 */
export type NumberFormatStyle = 'decimal' | 'currency' | 'percent' | 'unit';
/**
 * Pluralization category (CLDR)
 */
export type PluralCategory = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';
/**
 * Translation interpolation parameters
 */
export interface TranslationParams {
    [key: string]: string | number | Date | boolean;
}
/**
 * Translation key with namespace
 */
export interface TranslationKey {
    namespace: string;
    key: string;
    defaultValue?: string;
}
/**
 * Translation entry
 */
export interface TranslationEntry {
    id: string;
    locale: LocaleCode;
    namespace: string;
    key: string;
    value: string;
    pluralForms?: Partial<Record<PluralCategory, string>>;
    metadata?: {
        context?: string;
        maxLength?: number;
        format?: string;
        translatedBy?: string;
        translatedAt?: Date;
        verified?: boolean;
    };
}
/**
 * Locale information
 */
export interface LocaleInfo {
    code: LocaleCode;
    language: string;
    country: string;
    displayName: string;
    nativeName: string;
    textDirection: TextDirection;
    dateFormat: string;
    timeFormat: string;
    firstDayOfWeek: number;
    currency: string;
    currencySymbol: string;
    decimalSeparator: string;
    thousandsSeparator: string;
    timezone?: string;
}
/**
 * Translation context for interpolation
 */
export interface TranslationContext {
    locale: LocaleCode;
    namespace?: string;
    fallbackLocale?: LocaleCode;
    strict?: boolean;
    logMissing?: boolean;
}
/**
 * Date formatting options
 */
export interface DateFormatOptions {
    locale: LocaleCode;
    style?: DateFormatStyle;
    dateStyle?: DateFormatStyle;
    timeStyle?: DateFormatStyle;
    weekday?: 'long' | 'short' | 'narrow';
    year?: 'numeric' | '2-digit';
    month?: 'long' | 'short' | 'narrow' | 'numeric' | '2-digit';
    day?: 'numeric' | '2-digit';
    hour?: 'numeric' | '2-digit';
    minute?: 'numeric' | '2-digit';
    second?: 'numeric' | '2-digit';
    timeZone?: string;
    hour12?: boolean;
}
/**
 * Number formatting options
 */
export interface NumberFormatOptions {
    locale: LocaleCode;
    style?: NumberFormatStyle;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    useGrouping?: boolean;
    notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
}
/**
 * Currency conversion options
 */
export interface CurrencyConversionOptions {
    from: string;
    to: string;
    amount: number;
    date?: Date;
    source?: 'ECB' | 'FOREX' | 'CACHE';
}
/**
 * Currency conversion result
 */
export interface CurrencyConversionResult {
    fromCurrency: string;
    toCurrency: string;
    fromAmount: number;
    toAmount: number;
    exchangeRate: number;
    conversionDate: Date;
    source: string;
}
/**
 * RTL layout configuration
 */
export interface RTLLayoutConfig {
    enabled: boolean;
    textDirection: TextDirection;
    flipMargins?: boolean;
    flipPadding?: boolean;
    flipPositions?: boolean;
    transformCSS?: boolean;
}
/**
 * Locale detection options
 */
export interface LocaleDetectionOptions {
    acceptLanguageHeader?: string;
    userPreference?: LocaleCode;
    browserLocale?: string;
    ipAddress?: string;
    fallback?: LocaleCode;
    supportedLocales?: LocaleCode[];
}
/**
 * Locale detection result
 */
export interface LocaleDetectionResult {
    detected: LocaleCode;
    confidence: number;
    source: 'user-preference' | 'accept-language' | 'browser' | 'ip-geolocation' | 'fallback';
    alternatives?: Array<{
        locale: LocaleCode;
        confidence: number;
    }>;
}
/**
 * Pluralization rule function
 */
export type PluralizationRuleFn = (count: number, locale: LocaleCode) => PluralCategory;
/**
 * Translation missing handler
 */
export interface TranslationMissingHandler {
    onMissing: (key: string, locale: LocaleCode, namespace?: string) => string;
    logMissing?: boolean;
    returnKey?: boolean;
}
/**
 * Bidirectional text segment
 */
export interface BidiTextSegment {
    text: string;
    direction: TextDirection;
    level: number;
    start: number;
    end: number;
}
/**
 * Medical terminology translation
 */
export interface MedicalTerminologyTranslation {
    term: string;
    locale: LocaleCode;
    translation: string;
    icd10Code?: string;
    snomedCode?: string;
    category?: string;
    verified?: boolean;
}
/**
 * Translation model attributes
 */
export interface TranslationAttributes {
    id: string;
    locale: string;
    namespace: string;
    key: string;
    value: string;
    pluralZero?: string;
    pluralOne?: string;
    pluralTwo?: string;
    pluralFew?: string;
    pluralMany?: string;
    pluralOther?: string;
    context?: string;
    maxLength?: number;
    format?: string;
    translatedBy?: string;
    translatedAt?: Date;
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Locale model attributes
 */
export interface LocaleAttributes {
    id: string;
    code: string;
    language: string;
    country: string;
    displayName: string;
    nativeName: string;
    textDirection: string;
    dateFormat: string;
    timeFormat: string;
    firstDayOfWeek: number;
    currency: string;
    currencySymbol: string;
    decimalSeparator: string;
    thousandsSeparator: string;
    timezone?: string;
    enabled: boolean;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * I18n resource model attributes
 */
export interface I18nResourceAttributes {
    id: string;
    resourceType: string;
    resourceId: string;
    locale: string;
    fieldName: string;
    translatedValue: string;
    originalValue?: string;
    translatedBy?: string;
    translatedAt?: Date;
    approved: boolean;
    approvedBy?: string;
    approvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates Translation model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<TranslationAttributes>>} Translation model
 *
 * @example
 * ```typescript
 * const TranslationModel = createTranslationModel(sequelize);
 * const translation = await TranslationModel.create({
 *   locale: 'es-ES',
 *   namespace: 'medical',
 *   key: 'patient.consent.title',
 *   value: 'Formulario de Consentimiento del Paciente',
 *   verified: true
 * });
 * ```
 */
export declare const createTranslationModel: (sequelize: Sequelize) => any;
/**
 * Creates Locale model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<LocaleAttributes>>} Locale model
 *
 * @example
 * ```typescript
 * const LocaleModel = createLocaleModel(sequelize);
 * const locale = await LocaleModel.create({
 *   code: 'es-ES',
 *   language: 'Spanish',
 *   country: 'Spain',
 *   displayName: 'Spanish (Spain)',
 *   nativeName: 'Español (España)',
 *   textDirection: 'ltr',
 *   currency: 'EUR',
 *   enabled: true
 * });
 * ```
 */
export declare const createLocaleModel: (sequelize: Sequelize) => any;
/**
 * Creates I18nResource model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<I18nResourceAttributes>>} I18nResource model
 *
 * @example
 * ```typescript
 * const I18nResourceModel = createI18nResourceModel(sequelize);
 * const resource = await I18nResourceModel.create({
 *   resourceType: 'document',
 *   resourceId: 'doc-uuid-123',
 *   locale: 'fr-FR',
 *   fieldName: 'title',
 *   translatedValue: 'Dossier Médical du Patient',
 *   approved: true
 * });
 * ```
 */
export declare const createI18nResourceModel: (sequelize: Sequelize) => any;
/**
 * 1. Retrieves translation for key and locale.
 *
 * @param {string} key - Translation key
 * @param {TranslationContext} context - Translation context
 * @param {TranslationParams} [params] - Interpolation parameters
 * @returns {Promise<string>} Translated text
 *
 * @example
 * ```typescript
 * const text = await getTranslation('patient.consent.title', {
 *   locale: 'es-ES',
 *   namespace: 'medical'
 * });
 * console.log(text); // "Formulario de Consentimiento del Paciente"
 * ```
 */
export declare const getTranslation: (key: string, context: TranslationContext, params?: TranslationParams) => Promise<string>;
/**
 * 2. Interpolates parameters into translation template.
 *
 * @param {string} template - Translation template with {{param}} placeholders
 * @param {TranslationParams} params - Parameters to interpolate
 * @returns {string} Interpolated text
 *
 * @example
 * ```typescript
 * const text = interpolateTranslation('Hello {{name}}, you have {{count}} messages', {
 *   name: 'Dr. Smith',
 *   count: 5
 * });
 * // Returns: "Hello Dr. Smith, you have 5 messages"
 * ```
 */
export declare const interpolateTranslation: (template: string, params: TranslationParams) => string;
/**
 * 3. Batch loads translations for namespace.
 *
 * @param {string} namespace - Translation namespace
 * @param {LocaleCode} locale - Target locale
 * @returns {Promise<Record<string, string>>} Key-value translation map
 *
 * @example
 * ```typescript
 * const translations = await loadTranslationNamespace('medical', 'fr-FR');
 * console.log(translations['patient.name']); // "Nom du patient"
 * ```
 */
export declare const loadTranslationNamespace: (namespace: string, locale: LocaleCode) => Promise<Record<string, string>>;
/**
 * 4. Creates or updates translation entry.
 *
 * @param {TranslationEntry} entry - Translation entry to save
 * @returns {Promise<TranslationEntry>} Saved translation
 *
 * @example
 * ```typescript
 * const translation = await saveTranslation({
 *   id: 'uuid',
 *   locale: 'de-DE',
 *   namespace: 'medical',
 *   key: 'diagnosis.title',
 *   value: 'Medizinische Diagnose'
 * });
 * ```
 */
export declare const saveTranslation: (entry: TranslationEntry) => Promise<TranslationEntry>;
/**
 * 5. Finds missing translations for locale.
 *
 * @param {LocaleCode} sourceLocale - Source locale with complete translations
 * @param {LocaleCode} targetLocale - Target locale to check
 * @param {string} [namespace] - Optional namespace filter
 * @returns {Promise<TranslationKey[]>} Missing translation keys
 *
 * @example
 * ```typescript
 * const missing = await findMissingTranslations('en-US', 'ja-JP', 'medical');
 * console.log(`${missing.length} translations missing for Japanese`);
 * ```
 */
export declare const findMissingTranslations: (sourceLocale: LocaleCode, targetLocale: LocaleCode, namespace?: string) => Promise<TranslationKey[]>;
/**
 * 6. Verifies translation accuracy and completeness.
 *
 * @param {string} translationId - Translation ID to verify
 * @param {string} verifiedBy - User ID of verifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await verifyTranslation('translation-uuid', 'user-uuid');
 * ```
 */
export declare const verifyTranslation: (translationId: string, verifiedBy: string) => Promise<void>;
/**
 * 7. Exports translations to JSON format.
 *
 * @param {LocaleCode} locale - Locale to export
 * @param {string[]} [namespaces] - Optional namespace filter
 * @returns {Promise<Record<string, any>>} Nested translation object
 *
 * @example
 * ```typescript
 * const json = await exportTranslationsToJSON('zh-CN', ['medical', 'admin']);
 * // Returns: { medical: { patient: { name: "患者姓名" } }, admin: { ... } }
 * ```
 */
export declare const exportTranslationsToJSON: (locale: LocaleCode, namespaces?: string[]) => Promise<Record<string, any>>;
/**
 * 8. Detects if locale requires RTL layout.
 *
 * @param {LocaleCode} locale - Locale to check
 * @returns {boolean} True if RTL layout required
 *
 * @example
 * ```typescript
 * const isRTL = isRTLLocale('ar-SA'); // true
 * const isLTR = isRTLLocale('en-US'); // false
 * ```
 */
export declare const isRTLLocale: (locale: LocaleCode) => boolean;
/**
 * 9. Gets text direction for locale.
 *
 * @param {LocaleCode} locale - Locale code
 * @returns {TextDirection} Text direction (ltr, rtl, auto)
 *
 * @example
 * ```typescript
 * const direction = getTextDirection('he-IL'); // "rtl"
 * ```
 */
export declare const getTextDirection: (locale: LocaleCode) => TextDirection;
/**
 * 10. Generates RTL-compatible CSS properties.
 *
 * @param {RTLLayoutConfig} config - RTL configuration
 * @returns {Record<string, string>} CSS properties object
 *
 * @example
 * ```typescript
 * const css = generateRTLStyles({
 *   enabled: true,
 *   textDirection: 'rtl',
 *   flipMargins: true
 * });
 * console.log(css); // { direction: 'rtl', marginLeft: '0', marginRight: '16px' }
 * ```
 */
export declare const generateRTLStyles: (config: RTLLayoutConfig) => Record<string, string>;
/**
 * 11. Transforms LTR CSS to RTL.
 *
 * @param {string} cssText - LTR CSS text
 * @returns {string} RTL-transformed CSS
 *
 * @example
 * ```typescript
 * const rtlCss = transformCSSForRTL('margin-left: 16px; float: left;');
 * // Returns: "margin-right: 16px; float: right;"
 * ```
 */
export declare const transformCSSForRTL: (cssText: string) => string;
/**
 * 12. Analyzes bidirectional text segments.
 *
 * @param {string} text - Text containing mixed LTR/RTL content
 * @returns {BidiTextSegment[]} Text segments with direction
 *
 * @example
 * ```typescript
 * const segments = analyzeBidiText('Hello مرحبا World');
 * // Returns segments with text direction metadata
 * ```
 */
export declare const analyzeBidiText: (text: string) => BidiTextSegment[];
/**
 * 13. Reorders bidirectional text for display.
 *
 * @param {string} text - Text to reorder
 * @param {TextDirection} baseDirection - Base text direction
 * @returns {string} Reordered text for display
 *
 * @example
 * ```typescript
 * const display = reorderBidiText('Hello مرحبا 123', 'ltr');
 * ```
 */
export declare const reorderBidiText: (text: string, baseDirection: TextDirection) => string;
/**
 * 14. Detects user locale from multiple sources.
 *
 * @param {LocaleDetectionOptions} options - Detection options
 * @returns {Promise<LocaleDetectionResult>} Detected locale with confidence
 *
 * @example
 * ```typescript
 * const result = await detectUserLocale({
 *   acceptLanguageHeader: 'es-MX,es;q=0.9,en;q=0.8',
 *   ipAddress: '201.141.32.10',
 *   fallback: 'en-US'
 * });
 * console.log(result.detected); // "es-MX"
 * console.log(result.confidence); // 0.95
 * ```
 */
export declare const detectUserLocale: (options: LocaleDetectionOptions) => Promise<LocaleDetectionResult>;
/**
 * 15. Parses Accept-Language HTTP header.
 *
 * @param {string} header - Accept-Language header value
 * @returns {LocaleCode | null} Preferred locale from header
 *
 * @example
 * ```typescript
 * const locale = parseAcceptLanguage('fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7');
 * console.log(locale); // "fr-FR"
 * ```
 */
export declare const parseAcceptLanguage: (header: string) => LocaleCode | null;
/**
 * 16. Normalizes locale code to standard format.
 *
 * @param {string} locale - Locale code in any format
 * @returns {string} Normalized locale (e.g., en-US)
 *
 * @example
 * ```typescript
 * const normalized = normalizeLocaleCode('en_us'); // "en-US"
 * const normalized2 = normalizeLocaleCode('EN-gb'); // "en-GB"
 * ```
 */
export declare const normalizeLocaleCode: (locale: string) => string;
/**
 * 17. Gets locale from IP geolocation.
 *
 * @param {string} ipAddress - IP address
 * @returns {Promise<LocaleCode | null>} Detected locale from IP
 *
 * @example
 * ```typescript
 * const locale = await getLocaleFromIP('203.0.113.0');
 * console.log(locale); // "ja-JP"
 * ```
 */
export declare const getLocaleFromIP: (ipAddress: string) => Promise<LocaleCode | null>;
/**
 * 18. Validates if locale is supported.
 *
 * @param {LocaleCode} locale - Locale to validate
 * @param {LocaleCode[]} supportedLocales - List of supported locales
 * @returns {boolean} True if locale is supported
 *
 * @example
 * ```typescript
 * const isSupported = isSupportedLocale('ko-KR', ['en-US', 'es-ES', 'ko-KR']);
 * console.log(isSupported); // true
 * ```
 */
export declare const isSupportedLocale: (locale: LocaleCode, supportedLocales: LocaleCode[]) => boolean;
/**
 * 19. Gets fallback locale for unsupported locale.
 *
 * @param {LocaleCode} locale - Requested locale
 * @param {LocaleCode[]} supportedLocales - Available locales
 * @returns {LocaleCode} Best fallback locale
 *
 * @example
 * ```typescript
 * const fallback = getFallbackLocale('pt-PT', ['en-US', 'es-ES', 'pt-BR']);
 * console.log(fallback); // "pt-BR" (same language family)
 * ```
 */
export declare const getFallbackLocale: (locale: LocaleCode, supportedLocales: LocaleCode[]) => LocaleCode;
/**
 * 20. Formats date according to locale.
 *
 * @param {Date} date - Date to format
 * @param {DateFormatOptions} options - Formatting options
 * @returns {string} Formatted date string
 *
 * @example
 * ```typescript
 * const formatted = formatDate(new Date('2024-03-15'), {
 *   locale: 'de-DE',
 *   style: 'long'
 * });
 * console.log(formatted); // "15. März 2024"
 * ```
 */
export declare const formatDate: (date: Date, options: DateFormatOptions) => string;
/**
 * 21. Formats time according to locale.
 *
 * @param {Date} date - Date with time to format
 * @param {DateFormatOptions} options - Formatting options
 * @returns {string} Formatted time string
 *
 * @example
 * ```typescript
 * const time = formatTime(new Date(), {
 *   locale: 'en-US',
 *   hour12: true
 * });
 * console.log(time); // "3:45 PM"
 * ```
 */
export declare const formatTime: (date: Date, options: DateFormatOptions) => string;
/**
 * 22. Formats number according to locale.
 *
 * @param {number} value - Number to format
 * @param {NumberFormatOptions} options - Formatting options
 * @returns {string} Formatted number string
 *
 * @example
 * ```typescript
 * const formatted = formatNumber(1234567.89, {
 *   locale: 'de-DE',
 *   style: 'decimal'
 * });
 * console.log(formatted); // "1.234.567,89"
 * ```
 */
export declare const formatNumber: (value: number, options: NumberFormatOptions) => string;
/**
 * 23. Formats percentage according to locale.
 *
 * @param {number} value - Decimal value (0.15 = 15%)
 * @param {LocaleCode} locale - Target locale
 * @param {number} [decimals] - Decimal places
 * @returns {string} Formatted percentage
 *
 * @example
 * ```typescript
 * const percent = formatPercentage(0.8567, 'fr-FR', 2);
 * console.log(percent); // "85,67 %"
 * ```
 */
export declare const formatPercentage: (value: number, locale: LocaleCode, decimals?: number) => string;
/**
 * 24. Formats relative time (e.g., "2 hours ago").
 *
 * @param {Date} date - Date to format
 * @param {LocaleCode} locale - Target locale
 * @param {Date} [baseDate] - Base date for comparison (default: now)
 * @returns {string} Relative time string
 *
 * @example
 * ```typescript
 * const relative = formatRelativeTime(new Date(Date.now() - 2 * 60 * 60 * 1000), 'es-ES');
 * console.log(relative); // "hace 2 horas"
 * ```
 */
export declare const formatRelativeTime: (date: Date, locale: LocaleCode, baseDate?: Date) => string;
/**
 * 25. Formats date range according to locale.
 *
 * @param {Date} startDate - Range start date
 * @param {Date} endDate - Range end date
 * @param {DateFormatOptions} options - Formatting options
 * @returns {string} Formatted date range
 *
 * @example
 * ```typescript
 * const range = formatDateRange(
 *   new Date('2024-03-01'),
 *   new Date('2024-03-15'),
 *   { locale: 'en-US', style: 'medium' }
 * );
 * console.log(range); // "Mar 1 – 15, 2024"
 * ```
 */
export declare const formatDateRange: (startDate: Date, endDate: Date, options: DateFormatOptions) => string;
/**
 * 26. Converts currency amount with exchange rate.
 *
 * @param {CurrencyConversionOptions} options - Conversion options
 * @returns {Promise<CurrencyConversionResult>} Conversion result
 *
 * @example
 * ```typescript
 * const result = await convertCurrency({
 *   from: 'USD',
 *   to: 'EUR',
 *   amount: 100.00
 * });
 * console.log(result.toAmount); // 92.45
 * console.log(result.exchangeRate); // 0.9245
 * ```
 */
export declare const convertCurrency: (options: CurrencyConversionOptions) => Promise<CurrencyConversionResult>;
/**
 * 27. Formats currency amount according to locale.
 *
 * @param {number} amount - Amount to format
 * @param {string} currency - ISO 4217 currency code
 * @param {LocaleCode} locale - Target locale
 * @returns {string} Formatted currency string
 *
 * @example
 * ```typescript
 * const formatted = formatCurrency(1234.56, 'JPY', 'ja-JP');
 * console.log(formatted); // "¥1,235"
 * ```
 */
export declare const formatCurrency: (amount: number, currency: string, locale: LocaleCode) => string;
/**
 * 28. Gets exchange rate between currencies.
 *
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @param {Date} [date] - Historical date (default: current)
 * @returns {Promise<number>} Exchange rate
 *
 * @example
 * ```typescript
 * const rate = await getExchangeRate('GBP', 'USD');
 * console.log(rate); // 1.27
 * ```
 */
export declare const getExchangeRate: (fromCurrency: string, toCurrency: string, date?: Date) => Promise<number>;
/**
 * 29. Caches exchange rates for offline use.
 *
 * @param {Record<string, Record<string, number>>} rates - Currency rate matrix
 * @param {Date} effectiveDate - Rates effective date
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cacheExchangeRates({
 *   'USD': { 'EUR': 0.92, 'GBP': 0.79, 'JPY': 149.50 },
 *   'EUR': { 'USD': 1.09, 'GBP': 0.86, 'JPY': 162.30 }
 * }, new Date());
 * ```
 */
export declare const cacheExchangeRates: (rates: Record<string, Record<string, number>>, effectiveDate: Date) => Promise<void>;
/**
 * 30. Gets currency symbol for locale.
 *
 * @param {string} currency - ISO 4217 currency code
 * @param {LocaleCode} locale - Target locale
 * @returns {string} Currency symbol
 *
 * @example
 * ```typescript
 * const symbol = getCurrencySymbol('USD', 'en-US'); // "$"
 * const symbol2 = getCurrencySymbol('EUR', 'de-DE'); // "€"
 * ```
 */
export declare const getCurrencySymbol: (currency: string, locale: LocaleCode) => string;
/**
 * 31. Gets plural category for count and locale.
 *
 * @param {number} count - Count value
 * @param {LocaleCode} locale - Target locale
 * @returns {PluralCategory} CLDR plural category
 *
 * @example
 * ```typescript
 * const category = getPluralCategory(1, 'en-US'); // "one"
 * const category2 = getPluralCategory(2, 'en-US'); // "other"
 * const category3 = getPluralCategory(2, 'pl-PL'); // "few"
 * ```
 */
export declare const getPluralCategory: (count: number, locale: LocaleCode) => PluralCategory;
/**
 * 32. Selects plural form for translation.
 *
 * @param {number} count - Count value
 * @param {Partial<Record<PluralCategory, string>>} forms - Plural forms
 * @param {LocaleCode} locale - Target locale
 * @returns {string} Selected plural form
 *
 * @example
 * ```typescript
 * const text = selectPluralForm(3, {
 *   one: '{{count}} patient',
 *   other: '{{count}} patients'
 * }, 'en-US');
 * console.log(interpolateTranslation(text, { count: 3 })); // "3 patients"
 * ```
 */
export declare const selectPluralForm: (count: number, forms: Partial<Record<PluralCategory, string>>, locale: LocaleCode) => string;
/**
 * 33. Formats plural translation with count.
 *
 * @param {string} key - Translation key
 * @param {number} count - Count value
 * @param {TranslationContext} context - Translation context
 * @returns {Promise<string>} Formatted plural text
 *
 * @example
 * ```typescript
 * const text = await formatPlural('medical.appointments.count', 5, {
 *   locale: 'fr-FR',
 *   namespace: 'medical'
 * });
 * console.log(text); // "5 rendez-vous"
 * ```
 */
export declare const formatPlural: (key: string, count: number, context: TranslationContext) => Promise<string>;
/**
 * 34. Validates plural forms completeness.
 *
 * @param {Partial<Record<PluralCategory, string>>} forms - Plural forms
 * @param {LocaleCode} locale - Target locale
 * @returns {{ valid: boolean; missing?: PluralCategory[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validatePluralForms({
 *   one: 'message',
 *   other: 'messages'
 * }, 'ar-SA');
 * // Arabic requires: zero, one, two, few, many, other
 * console.log(validation.missing); // ['zero', 'two', 'few', 'many']
 * ```
 */
export declare const validatePluralForms: (forms: Partial<Record<PluralCategory, string>>, locale: LocaleCode) => {
    valid: boolean;
    missing?: PluralCategory[];
};
/**
 * 35. Gets required plural categories for locale.
 *
 * @param {LocaleCode} locale - Target locale
 * @returns {PluralCategory[]} Required plural categories (CLDR)
 *
 * @example
 * ```typescript
 * const categories = getRequiredPluralCategories('ar-SA');
 * console.log(categories); // ['zero', 'one', 'two', 'few', 'many', 'other']
 * ```
 */
export declare const getRequiredPluralCategories: (locale: LocaleCode) => PluralCategory[];
/**
 * 36. Creates ordinal number string (1st, 2nd, 3rd).
 *
 * @param {number} number - Number to ordinalize
 * @param {LocaleCode} locale - Target locale
 * @returns {string} Ordinal number string
 *
 * @example
 * ```typescript
 * const ordinal = formatOrdinal(3, 'en-US'); // "3rd"
 * const ordinal2 = formatOrdinal(21, 'en-US'); // "21st"
 * const ordinal3 = formatOrdinal(2, 'es-ES'); // "2.º"
 * ```
 */
export declare const formatOrdinal: (number: number, locale: LocaleCode) => string;
/**
 * 37. Translates medical terminology with verification.
 *
 * @param {string} term - Medical term in source language
 * @param {LocaleCode} targetLocale - Target locale
 * @param {string} [category] - Medical category filter
 * @returns {Promise<MedicalTerminologyTranslation | null>} Translation result
 *
 * @example
 * ```typescript
 * const translation = await translateMedicalTerm('Hypertension', 'es-ES');
 * console.log(translation?.translation); // "Hipertensión"
 * console.log(translation?.icd10Code); // "I10"
 * ```
 */
export declare const translateMedicalTerm: (term: string, targetLocale: LocaleCode, category?: string) => Promise<MedicalTerminologyTranslation | null>;
/**
 * 38. Gets locale-specific medical formatting preferences.
 *
 * @param {LocaleCode} locale - Target locale
 * @returns {Promise<Record<string, any>>} Medical formatting preferences
 *
 * @example
 * ```typescript
 * const prefs = await getMedicalFormattingPreferences('en-US');
 * console.log(prefs.temperatureUnit); // "fahrenheit"
 * console.log(prefs.heightUnit); // "feet-inches"
 * console.log(prefs.weightUnit); // "pounds"
 *
 * const prefs2 = await getMedicalFormattingPreferences('de-DE');
 * console.log(prefs2.temperatureUnit); // "celsius"
 * console.log(prefs2.heightUnit); // "centimeters"
 * console.log(prefs2.weightUnit); // "kilograms"
 * ```
 */
export declare const getMedicalFormattingPreferences: (locale: LocaleCode) => Promise<Record<string, any>>;
declare const _default: {
    createTranslationModel: (sequelize: Sequelize) => any;
    createLocaleModel: (sequelize: Sequelize) => any;
    createI18nResourceModel: (sequelize: Sequelize) => any;
    getTranslation: (key: string, context: TranslationContext, params?: TranslationParams) => Promise<string>;
    interpolateTranslation: (template: string, params: TranslationParams) => string;
    loadTranslationNamespace: (namespace: string, locale: LocaleCode) => Promise<Record<string, string>>;
    saveTranslation: (entry: TranslationEntry) => Promise<TranslationEntry>;
    findMissingTranslations: (sourceLocale: LocaleCode, targetLocale: LocaleCode, namespace?: string) => Promise<TranslationKey[]>;
    verifyTranslation: (translationId: string, verifiedBy: string) => Promise<void>;
    exportTranslationsToJSON: (locale: LocaleCode, namespaces?: string[]) => Promise<Record<string, any>>;
    isRTLLocale: (locale: LocaleCode) => boolean;
    getTextDirection: (locale: LocaleCode) => TextDirection;
    generateRTLStyles: (config: RTLLayoutConfig) => Record<string, string>;
    transformCSSForRTL: (cssText: string) => string;
    analyzeBidiText: (text: string) => BidiTextSegment[];
    reorderBidiText: (text: string, baseDirection: TextDirection) => string;
    detectUserLocale: (options: LocaleDetectionOptions) => Promise<LocaleDetectionResult>;
    parseAcceptLanguage: (header: string) => LocaleCode | null;
    normalizeLocaleCode: (locale: string) => string;
    getLocaleFromIP: (ipAddress: string) => Promise<LocaleCode | null>;
    isSupportedLocale: (locale: LocaleCode, supportedLocales: LocaleCode[]) => boolean;
    getFallbackLocale: (locale: LocaleCode, supportedLocales: LocaleCode[]) => LocaleCode;
    formatDate: (date: Date, options: DateFormatOptions) => string;
    formatTime: (date: Date, options: DateFormatOptions) => string;
    formatNumber: (value: number, options: NumberFormatOptions) => string;
    formatPercentage: (value: number, locale: LocaleCode, decimals?: number) => string;
    formatRelativeTime: (date: Date, locale: LocaleCode, baseDate?: Date) => string;
    formatDateRange: (startDate: Date, endDate: Date, options: DateFormatOptions) => string;
    convertCurrency: (options: CurrencyConversionOptions) => Promise<CurrencyConversionResult>;
    formatCurrency: (amount: number, currency: string, locale: LocaleCode) => string;
    getExchangeRate: (fromCurrency: string, toCurrency: string, date?: Date) => Promise<number>;
    cacheExchangeRates: (rates: Record<string, Record<string, number>>, effectiveDate: Date) => Promise<void>;
    getCurrencySymbol: (currency: string, locale: LocaleCode) => string;
    getPluralCategory: (count: number, locale: LocaleCode) => PluralCategory;
    selectPluralForm: (count: number, forms: Partial<Record<PluralCategory, string>>, locale: LocaleCode) => string;
    formatPlural: (key: string, count: number, context: TranslationContext) => Promise<string>;
    validatePluralForms: (forms: Partial<Record<PluralCategory, string>>, locale: LocaleCode) => {
        valid: boolean;
        missing?: PluralCategory[];
    };
    getRequiredPluralCategories: (locale: LocaleCode) => PluralCategory[];
    formatOrdinal: (number: number, locale: LocaleCode) => string;
    translateMedicalTerm: (term: string, targetLocale: LocaleCode, category?: string) => Promise<MedicalTerminologyTranslation | null>;
    getMedicalFormattingPreferences: (locale: LocaleCode) => Promise<Record<string, any>>;
};
export default _default;
//# sourceMappingURL=document-i18n-kit.d.ts.map