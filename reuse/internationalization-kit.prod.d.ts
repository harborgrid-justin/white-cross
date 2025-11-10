/**
 * LOC: I18N_L10N_PROD_001
 * File: /reuse/internationalization-kit.prod.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - nestjs-i18n
 *   - sequelize-typescript
 *   - zod
 *   - intl
 *   - accept-language-parser
 *
 * DOWNSTREAM (imported by):
 *   - Translation services
 *   - Locale middleware
 *   - I18n controllers
 *   - Multi-language APIs
 *   - Localization services
 */
/**
 * File: /reuse/internationalization-kit.prod.ts
 * Locator: WC-I18N-L10N-PROD-001
 * Purpose: Production-Grade Internationalization & Localization Kit - Enterprise i18n/l10n toolkit
 *
 * Upstream: NestJS, nestjs-i18n, Sequelize, Zod, Intl, accept-language-parser
 * Downstream: ../backend/i18n/*, Controllers, Services, Middleware, Translation modules
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, nestjs-i18n, sequelize-typescript
 * Exports: 47+ production-ready i18n/l10n functions covering translations, locales, formatting, RTL support
 *
 * LLM Context: Production-grade internationalization and localization utilities for White Cross healthcare platform.
 * Provides comprehensive translation management (loading, caching, fallbacks), locale detection (browser, user preferences,
 * geographic), pluralization rules (CLDR-based), currency formatting (multi-currency support), date/time formatting
 * (timezone-aware), RTL/LTR support (bidirectional text), translation key management, missing translation handling,
 * translation caching strategies, language fallback chains, dynamic locale switching, NestJS i18n module integration,
 * accessibility features (lang attributes, ARIA labels, screen reader optimization), number formatting, relative time
 * formatting, message interpolation, and WCAG-compliant multilingual interfaces.
 * Includes Sequelize models for translations, locales, translation namespaces, and user language preferences.
 */
import { NestInterceptor, ExecutionContext, CallHandler, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Observable } from 'rxjs';
/**
 * Supported language codes (ISO 639-1)
 */
export declare enum LanguageCode {
    EN = "en",// English
    ES = "es",// Spanish
    FR = "fr",// French
    DE = "de",// German
    IT = "it",// Italian
    PT = "pt",// Portuguese
    RU = "ru",// Russian
    ZH = "zh",// Chinese
    JA = "ja",// Japanese
    KO = "ko",// Korean
    AR = "ar",// Arabic
    HE = "he",// Hebrew
    HI = "hi",// Hindi
    BN = "bn",// Bengali
    TR = "tr",// Turkish
    NL = "nl",// Dutch
    PL = "pl",// Polish
    VI = "vi",// Vietnamese
    TH = "th",// Thai
    SV = "sv"
}
/**
 * Text direction for languages
 */
export declare enum TextDirection {
    LTR = "ltr",// Left to Right
    RTL = "rtl"
}
/**
 * Pluralization categories (CLDR-based)
 */
export declare enum PluralCategory {
    ZERO = "zero",
    ONE = "one",
    TWO = "two",
    FEW = "few",
    MANY = "many",
    OTHER = "other"
}
/**
 * Date/Time formatting styles
 */
export declare enum DateTimeStyle {
    FULL = "full",
    LONG = "long",
    MEDIUM = "medium",
    SHORT = "short"
}
/**
 * Number formatting styles
 */
export declare enum NumberStyle {
    DECIMAL = "decimal",
    CURRENCY = "currency",
    PERCENT = "percent",
    UNIT = "unit"
}
/**
 * Translation namespace types
 */
export declare enum TranslationNamespace {
    COMMON = "common",
    MEDICAL = "medical",
    ERRORS = "errors",
    VALIDATION = "validation",
    APPOINTMENTS = "appointments",
    PATIENTS = "patients",
    BILLING = "billing",
    NOTIFICATIONS = "notifications",
    ACCESSIBILITY = "accessibility"
}
/**
 * Locale configuration interface
 */
export interface LocaleConfig {
    code: LanguageCode;
    name: string;
    nativeName: string;
    direction: TextDirection;
    dateFormat: string;
    timeFormat: string;
    firstDayOfWeek: number;
    currency: string;
    decimalSeparator: string;
    thousandsSeparator: string;
    enabled: boolean;
    fallbackLocale?: LanguageCode;
}
/**
 * Translation entry interface
 */
export interface TranslationEntry {
    key: string;
    value: string;
    namespace: TranslationNamespace;
    locale: LanguageCode;
    pluralForm?: PluralCategory;
    context?: string;
    metadata?: Record<string, any>;
}
/**
 * Translation options
 */
export interface TranslationOptions {
    locale?: LanguageCode;
    fallbackLocale?: LanguageCode;
    namespace?: TranslationNamespace;
    defaultValue?: string;
    interpolation?: Record<string, any>;
    count?: number;
    context?: string;
}
/**
 * Locale detection result
 */
export interface LocaleDetectionResult {
    locale: LanguageCode;
    source: 'header' | 'cookie' | 'query' | 'user' | 'geo' | 'default';
    confidence: number;
    alternatives?: LanguageCode[];
}
/**
 * Currency format options
 */
export interface CurrencyFormatOptions {
    locale?: LanguageCode;
    currency: string;
    display?: 'symbol' | 'narrowSymbol' | 'code' | 'name';
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    useGrouping?: boolean;
}
/**
 * Date format options
 */
export interface DateFormatOptions {
    locale?: LanguageCode;
    dateStyle?: DateTimeStyle;
    timeStyle?: DateTimeStyle;
    timeZone?: string;
    hour12?: boolean;
    calendar?: string;
}
/**
 * Plural rules function type
 */
export type PluralRuleFunction = (count: number, locale: LanguageCode) => PluralCategory;
/**
 * Translation cache entry
 */
export interface TranslationCacheEntry {
    translations: Map<string, string>;
    lastUpdated: Date;
    version: string;
    locale: LanguageCode;
    namespace: TranslationNamespace;
}
/**
 * User language preference
 */
export interface UserLanguagePreference {
    userId: string;
    preferredLocale: LanguageCode;
    fallbackLocales: LanguageCode[];
    autoDetect: boolean;
    dateFormat?: string;
    timeFormat?: string;
    timezone?: string;
}
/**
 * Interpolation context for translations
 */
export interface InterpolationContext {
    [key: string]: string | number | boolean | Date;
}
/**
 * RTL/LTR configuration
 */
export interface DirectionConfig {
    direction: TextDirection;
    align: 'left' | 'right';
    textAlign: 'left' | 'right' | 'start' | 'end';
    marginStart: string;
    marginEnd: string;
    paddingStart: string;
    paddingEnd: string;
}
/**
 * Accessibility i18n metadata
 */
export interface AccessibilityI18nMetadata {
    lang: string;
    dir: TextDirection;
    ariaLabel?: string;
    ariaDescription?: string;
    title?: string;
    altText?: string;
}
/**
 * Locale configuration schema
 */
export declare const LocaleConfigSchema: any;
/**
 * Translation entry schema
 */
export declare const TranslationEntrySchema: any;
/**
 * Translation options schema
 */
export declare const TranslationOptionsSchema: any;
/**
 * User language preference schema
 */
export declare const UserLanguagePreferenceSchema: any;
/**
 * Currency format options schema
 */
export declare const CurrencyFormatOptionsSchema: any;
/**
 * Bulk translation import schema
 */
export declare const BulkTranslationImportSchema: any;
/**
 * Locale configuration DTO with Swagger decorators
 */
export declare class LocaleConfigDto {
    code: LanguageCode;
    name: string;
    nativeName: string;
    direction: TextDirection;
    dateFormat: string;
    timeFormat: string;
    firstDayOfWeek: number;
    currency: string;
    decimalSeparator: string;
    thousandsSeparator: string;
    enabled: boolean;
    fallbackLocale?: LanguageCode;
}
/**
 * Translation entry DTO
 */
export declare class TranslationEntryDto {
    key: string;
    value: string;
    namespace: TranslationNamespace;
    locale: LanguageCode;
    pluralForm?: PluralCategory;
    context?: string;
    metadata?: Record<string, any>;
}
/**
 * Translation request DTO
 */
export declare class TranslateRequestDto {
    key: string;
    locale?: LanguageCode;
    namespace?: TranslationNamespace;
    interpolation?: Record<string, any>;
    count?: number;
}
/**
 * Translation response DTO
 */
export declare class TranslationResponseDto {
    key: string;
    value: string;
    locale: LanguageCode;
    usedFallback: boolean;
}
/**
 * User language preference DTO
 */
export declare class UserLanguagePreferenceDto {
    userId: string;
    preferredLocale: LanguageCode;
    fallbackLocales: LanguageCode[];
    autoDetect: boolean;
    dateFormat?: string;
    timeFormat?: string;
    timezone?: string;
}
/**
 * Default locale configurations for supported languages
 */
export declare const DEFAULT_LOCALE_CONFIGS: Record<LanguageCode, LocaleConfig>;
/**
 * Get locale configuration by language code
 *
 * @param locale - Language code
 * @returns Locale configuration
 *
 * @example
 * ```typescript
 * const config = getLocaleConfig(LanguageCode.FR);
 * console.log(config.nativeName); // "Français"
 * console.log(config.direction); // TextDirection.LTR
 * ```
 */
export declare function getLocaleConfig(locale: LanguageCode): LocaleConfig;
/**
 * Get all enabled locales
 *
 * @returns Array of enabled locale configurations
 *
 * @example
 * ```typescript
 * const enabledLocales = getEnabledLocales();
 * enabledLocales.forEach(locale => {
 *   console.log(`${locale.name}: ${locale.nativeName}`);
 * });
 * ```
 */
export declare function getEnabledLocales(): LocaleConfig[];
/**
 * Check if locale is RTL (Right-to-Left)
 *
 * @param locale - Language code
 * @returns True if RTL, false if LTR
 *
 * @example
 * ```typescript
 * const isRTL = isRTLLocale(LanguageCode.AR); // true
 * const isLTR = isRTLLocale(LanguageCode.EN); // false
 * ```
 */
export declare function isRTLLocale(locale: LanguageCode): boolean;
/**
 * Get text direction for locale
 *
 * @param locale - Language code
 * @returns Text direction (ltr or rtl)
 *
 * @example
 * ```typescript
 * const direction = getTextDirection(LanguageCode.HE); // TextDirection.RTL
 * ```
 */
export declare function getTextDirection(locale: LanguageCode): TextDirection;
/**
 * Get fallback locale chain for a given locale
 *
 * @param locale - Primary language code
 * @returns Array of locales in fallback order
 *
 * @example
 * ```typescript
 * const fallbacks = getFallbackChain(LanguageCode.ES);
 * // Returns: [LanguageCode.ES, LanguageCode.EN]
 * ```
 */
export declare function getFallbackChain(locale: LanguageCode): LanguageCode[];
/**
 * Detect locale from Accept-Language header
 *
 * @param acceptLanguageHeader - Accept-Language HTTP header value
 * @param supportedLocales - Optional array of supported locales
 * @returns Detected locale detection result
 *
 * @example
 * ```typescript
 * const result = detectLocaleFromHeader('en-US,en;q=0.9,es;q=0.8');
 * console.log(result.locale); // LanguageCode.EN
 * console.log(result.source); // 'header'
 * ```
 */
export declare function detectLocaleFromHeader(acceptLanguageHeader: string, supportedLocales?: LanguageCode[]): LocaleDetectionResult;
/**
 * Parse Accept-Language header into structured data
 *
 * @param header - Accept-Language header value
 * @returns Array of language preferences with quality scores
 *
 * @example
 * ```typescript
 * const languages = parseAcceptLanguage('en-US,en;q=0.9,fr;q=0.8');
 * // Returns: [
 * //   { code: 'en-US', quality: 1.0 },
 * //   { code: 'en', quality: 0.9 },
 * //   { code: 'fr', quality: 0.8 }
 * // ]
 * ```
 */
export declare function parseAcceptLanguage(header: string): Array<{
    code: string;
    quality: number;
}>;
/**
 * Detect locale from request (header, cookie, query params)
 *
 * @param request - Express request object
 * @param cookieName - Optional cookie name for locale storage
 * @param queryParam - Optional query parameter name for locale
 * @returns Locale detection result
 *
 * @example
 * ```typescript
 * const result = detectLocaleFromRequest(req, 'locale', 'lang');
 * console.log(`Detected ${result.locale} from ${result.source}`);
 * ```
 */
export declare function detectLocaleFromRequest(request: Request, cookieName?: string, queryParam?: string): LocaleDetectionResult;
/**
 * Detect user's locale from user preferences
 *
 * @param userPreference - User language preference
 * @param requestLocale - Optional locale from request
 * @returns Selected locale
 *
 * @example
 * ```typescript
 * const locale = detectUserLocale(userPref, requestResult);
 * ```
 */
export declare function detectUserLocale(userPreference: UserLanguagePreference, requestLocale?: LocaleDetectionResult): LanguageCode;
/**
 * Load translations into cache
 *
 * @param locale - Language code
 * @param namespace - Translation namespace
 * @param translations - Map of translation key-value pairs
 * @param version - Optional version identifier
 *
 * @example
 * ```typescript
 * const translations = new Map([
 *   ['common.welcome', 'Welcome to White Cross'],
 *   ['common.goodbye', 'Goodbye'],
 * ]);
 * loadTranslations(LanguageCode.EN, TranslationNamespace.COMMON, translations, 'v1.0');
 * ```
 */
export declare function loadTranslations(locale: LanguageCode, namespace: TranslationNamespace, translations: Map<string, string>, version?: string): void;
/**
 * Get translation from cache or return key/default value
 *
 * @param key - Translation key
 * @param options - Translation options
 * @returns Translated string
 *
 * @example
 * ```typescript
 * const translated = getTranslation('common.welcome', {
 *   locale: LanguageCode.ES,
 *   defaultValue: 'Welcome',
 *   interpolation: { name: 'John' },
 * });
 * ```
 */
export declare function getTranslation(key: string, options?: TranslationOptions): string;
/**
 * Interpolate variables into translation string
 *
 * @param template - Translation template with {{variable}} placeholders
 * @param context - Interpolation context with variable values
 * @returns Interpolated string
 *
 * @example
 * ```typescript
 * const result = interpolateTranslation(
 *   'Hello {{name}}, you have {{count}} messages',
 *   { name: 'John', count: 5 }
 * );
 * // Returns: "Hello John, you have 5 messages"
 * ```
 */
export declare function interpolateTranslation(template: string, context: InterpolationContext): string;
/**
 * Get pluralized translation key based on count
 *
 * @param baseKey - Base translation key
 * @param count - Count for pluralization
 * @param locale - Language code
 * @returns Pluralized key
 *
 * @example
 * ```typescript
 * const key = getPluralizedKey('items', 0, LanguageCode.EN);
 * // Returns: "items.zero" or "items.other"
 * ```
 */
export declare function getPluralizedKey(baseKey: string, count: number, locale: LanguageCode): string;
/**
 * Determine plural category for count and locale (CLDR-based)
 *
 * @param count - Number to categorize
 * @param locale - Language code
 * @returns Plural category
 *
 * @example
 * ```typescript
 * const category = getPluralCategory(1, LanguageCode.EN);
 * // Returns: PluralCategory.ONE
 *
 * const category2 = getPluralCategory(5, LanguageCode.EN);
 * // Returns: PluralCategory.OTHER
 * ```
 */
export declare function getPluralCategory(count: number, locale: LanguageCode): PluralCategory;
/**
 * Translate with automatic pluralization
 *
 * @param key - Translation key base
 * @param count - Count for pluralization
 * @param options - Additional translation options
 * @returns Pluralized translation
 *
 * @example
 * ```typescript
 * const text = translatePlural('messages', 5, {
 *   locale: LanguageCode.EN,
 *   interpolation: { count: 5 },
 * });
 * // Returns translation for "messages.other" with count interpolated
 * ```
 */
export declare function translatePlural(key: string, count: number, options?: Omit<TranslationOptions, 'count'>): string;
/**
 * Check if translation exists for key
 *
 * @param key - Translation key
 * @param locale - Language code
 * @param namespace - Translation namespace
 * @returns True if translation exists
 *
 * @example
 * ```typescript
 * if (hasTranslation('common.welcome', LanguageCode.FR)) {
 *   console.log('French translation available');
 * }
 * ```
 */
export declare function hasTranslation(key: string, locale: LanguageCode, namespace?: TranslationNamespace): boolean;
/**
 * Get all translation keys for a namespace and locale
 *
 * @param locale - Language code
 * @param namespace - Translation namespace
 * @returns Array of translation keys
 *
 * @example
 * ```typescript
 * const keys = getTranslationKeys(LanguageCode.EN, TranslationNamespace.COMMON);
 * console.log(keys); // ['common.welcome', 'common.goodbye', ...]
 * ```
 */
export declare function getTranslationKeys(locale: LanguageCode, namespace: TranslationNamespace): string[];
/**
 * Clear translation cache for locale and/or namespace
 *
 * @param locale - Optional language code to clear
 * @param namespace - Optional namespace to clear
 *
 * @example
 * ```typescript
 * // Clear all translations
 * clearTranslationCache();
 *
 * // Clear specific locale
 * clearTranslationCache(LanguageCode.FR);
 *
 * // Clear specific namespace
 * clearTranslationCache(undefined, TranslationNamespace.MEDICAL);
 * ```
 */
export declare function clearTranslationCache(locale?: LanguageCode, namespace?: TranslationNamespace): void;
/**
 * Get translation cache statistics
 *
 * @returns Cache statistics
 *
 * @example
 * ```typescript
 * const stats = getTranslationCacheStats();
 * console.log(`Cache size: ${stats.totalEntries} entries`);
 * console.log(`Total translations: ${stats.totalTranslations}`);
 * ```
 */
export declare function getTranslationCacheStats(): {
    totalEntries: number;
    totalTranslations: number;
    locales: LanguageCode[];
    namespaces: TranslationNamespace[];
    oldestUpdate: Date | null;
    newestUpdate: Date | null;
};
/**
 * Format number according to locale
 *
 * @param value - Number to format
 * @param locale - Language code
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string
 *
 * @example
 * ```typescript
 * const formatted = formatNumber(1234.56, LanguageCode.EN);
 * // Returns: "1,234.56"
 *
 * const formatted2 = formatNumber(1234.56, LanguageCode.DE);
 * // Returns: "1.234,56"
 * ```
 */
export declare function formatNumber(value: number, locale?: LanguageCode, options?: Intl.NumberFormatOptions): string;
/**
 * Format currency with locale-specific formatting
 *
 * @param amount - Amount to format
 * @param options - Currency format options
 * @returns Formatted currency string
 *
 * @example
 * ```typescript
 * const formatted = formatCurrency(1234.56, {
 *   currency: 'USD',
 *   locale: LanguageCode.EN,
 * });
 * // Returns: "$1,234.56"
 *
 * const formatted2 = formatCurrency(1234.56, {
 *   currency: 'EUR',
 *   locale: LanguageCode.FR,
 * });
 * // Returns: "1 234,56 €"
 * ```
 */
export declare function formatCurrency(amount: number, options: CurrencyFormatOptions): string;
/**
 * Format percentage with locale-specific formatting
 *
 * @param value - Decimal value (0.15 for 15%)
 * @param locale - Language code
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 *
 * @example
 * ```typescript
 * const formatted = formatPercentage(0.1567, LanguageCode.EN, 2);
 * // Returns: "15.67%"
 * ```
 */
export declare function formatPercentage(value: number, locale?: LanguageCode, decimals?: number): string;
/**
 * Parse localized number string to number
 *
 * @param value - Localized number string
 * @param locale - Language code
 * @returns Parsed number
 *
 * @example
 * ```typescript
 * const num = parseLocalizedNumber('1.234,56', LanguageCode.DE);
 * // Returns: 1234.56
 * ```
 */
export declare function parseLocalizedNumber(value: string, locale: LanguageCode): number;
/**
 * Format date according to locale
 *
 * @param date - Date to format
 * @param options - Date format options
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * const formatted = formatDate(new Date(), {
 *   locale: LanguageCode.EN,
 *   dateStyle: DateTimeStyle.LONG,
 * });
 * // Returns: "January 15, 2024"
 *
 * const formatted2 = formatDate(new Date(), {
 *   locale: LanguageCode.FR,
 *   dateStyle: DateTimeStyle.LONG,
 * });
 * // Returns: "15 janvier 2024"
 * ```
 */
export declare function formatDate(date: Date, options?: DateFormatOptions): string;
/**
 * Format time according to locale
 *
 * @param date - Date object with time
 * @param locale - Language code
 * @param use24Hour - Use 24-hour format
 * @returns Formatted time string
 *
 * @example
 * ```typescript
 * const formatted = formatTime(new Date(), LanguageCode.EN, false);
 * // Returns: "3:45 PM"
 *
 * const formatted2 = formatTime(new Date(), LanguageCode.FR, true);
 * // Returns: "15:45"
 * ```
 */
export declare function formatTime(date: Date, locale?: LanguageCode, use24Hour?: boolean): string;
/**
 * Format date and time together
 *
 * @param date - Date to format
 * @param options - Date format options
 * @returns Formatted date-time string
 *
 * @example
 * ```typescript
 * const formatted = formatDateTime(new Date(), {
 *   locale: LanguageCode.EN,
 *   dateStyle: DateTimeStyle.MEDIUM,
 *   timeStyle: DateTimeStyle.SHORT,
 * });
 * // Returns: "Jan 15, 2024, 3:45 PM"
 * ```
 */
export declare function formatDateTime(date: Date, options?: DateFormatOptions): string;
/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 *
 * @param date - Date to compare
 * @param baseDate - Base date for comparison (defaults to now)
 * @param locale - Language code
 * @returns Relative time string
 *
 * @example
 * ```typescript
 * const past = new Date(Date.now() - 2 * 60 * 60 * 1000);
 * const formatted = formatRelativeTime(past, undefined, LanguageCode.EN);
 * // Returns: "2 hours ago"
 *
 * const future = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
 * const formatted2 = formatRelativeTime(future, undefined, LanguageCode.FR);
 * // Returns: "dans 3 jours"
 * ```
 */
export declare function formatRelativeTime(date: Date, baseDate?: Date, locale?: LanguageCode): string;
/**
 * Format date range with locale-specific formatting
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @param locale - Language code
 * @param dateStyle - Date formatting style
 * @returns Formatted date range string
 *
 * @example
 * ```typescript
 * const start = new Date('2024-01-15');
 * const end = new Date('2024-01-20');
 * const formatted = formatDateRange(start, end, LanguageCode.EN, DateTimeStyle.MEDIUM);
 * // Returns: "Jan 15 – 20, 2024"
 * ```
 */
export declare function formatDateRange(startDate: Date, endDate: Date, locale?: LanguageCode, dateStyle?: DateTimeStyle): string;
/**
 * Get direction-aware CSS configuration
 *
 * @param locale - Language code
 * @returns Direction configuration object
 *
 * @example
 * ```typescript
 * const dirConfig = getDirectionConfig(LanguageCode.AR);
 * console.log(dirConfig.direction); // TextDirection.RTL
 * console.log(dirConfig.align); // 'right'
 * console.log(dirConfig.textAlign); // 'right'
 * ```
 */
export declare function getDirectionConfig(locale: LanguageCode): DirectionConfig;
/**
 * Generate RTL/LTR-aware inline styles
 *
 * @param locale - Language code
 * @param baseStyles - Base CSS styles
 * @returns Direction-aware styles object
 *
 * @example
 * ```typescript
 * const styles = getDirectionalStyles(LanguageCode.AR, {
 *   paddingStart: '20px',
 *   marginEnd: '10px',
 * });
 * // Returns: { paddingRight: '20px', marginLeft: '10px', direction: 'rtl' }
 * ```
 */
export declare function getDirectionalStyles(locale: LanguageCode, baseStyles: Record<string, string>): Record<string, string>;
/**
 * Mirror RTL-aware value (useful for positioning, transforms)
 *
 * @param value - Numeric value to mirror
 * @param locale - Language code
 * @returns Original value for LTR, negated value for RTL
 *
 * @example
 * ```typescript
 * const position = mirrorForRTL(100, LanguageCode.AR);
 * // Returns: -100 for RTL locale
 *
 * const position2 = mirrorForRTL(100, LanguageCode.EN);
 * // Returns: 100 for LTR locale
 * ```
 */
export declare function mirrorForRTL(value: number, locale: LanguageCode): number;
/**
 * Generate accessibility metadata for multilingual content
 *
 * @param locale - Language code
 * @param content - Optional content for ARIA labels
 * @returns Accessibility i18n metadata
 *
 * @example
 * ```typescript
 * const a11y = getAccessibilityMetadata(LanguageCode.FR, {
 *   label: 'Envoyer le formulaire',
 *   description: 'Soumettre vos informations',
 * });
 * // Returns: { lang: 'fr', dir: 'ltr', ariaLabel: '...', ... }
 * ```
 */
export declare function getAccessibilityMetadata(locale: LanguageCode, content?: {
    label?: string;
    description?: string;
    title?: string;
    altText?: string;
}): AccessibilityI18nMetadata;
/**
 * Generate lang attribute for HTML elements
 *
 * @param locale - Language code
 * @param includeRegion - Include region code (e.g., en-US vs en)
 * @returns HTML lang attribute value
 *
 * @example
 * ```typescript
 * const lang = getHTMLLangAttribute(LanguageCode.EN, true);
 * // Returns: "en-US"
 *
 * const lang2 = getHTMLLangAttribute(LanguageCode.FR, false);
 * // Returns: "fr"
 * ```
 */
export declare function getHTMLLangAttribute(locale: LanguageCode, includeRegion?: boolean): string;
/**
 * Generate ARIA live region announcement
 *
 * @param message - Message to announce
 * @param locale - Language code
 * @param politeness - ARIA live politeness level
 * @returns ARIA live region attributes
 *
 * @example
 * ```typescript
 * const announcement = createARIAAnnouncement(
 *   'Form submitted successfully',
 *   LanguageCode.EN,
 *   'polite'
 * );
 * // Returns: { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true', lang: 'en' }
 * ```
 */
export declare function createARIAAnnouncement(message: string, locale: LanguageCode, politeness?: 'polite' | 'assertive'): {
    role: string;
    'aria-live': string;
    'aria-atomic': string;
    lang: string;
    textContent: string;
};
/**
 * Validate accessible multilingual form field
 *
 * @param fieldId - Form field ID
 * @param labelKey - Translation key for label
 * @param locale - Language code
 * @param options - Additional options
 * @returns Accessible form field attributes
 *
 * @example
 * ```typescript
 * const field = getAccessibleFormField('email', 'form.email', LanguageCode.EN, {
 *   required: true,
 *   hint: 'form.email.hint',
 *   error: 'form.email.error',
 * });
 * ```
 */
export declare function getAccessibleFormField(fieldId: string, labelKey: string, locale: LanguageCode, options?: {
    namespace?: TranslationNamespace;
    required?: boolean;
    hint?: string;
    error?: string;
}): {
    id: string;
    'aria-label': string;
    'aria-describedby'?: string;
    'aria-required'?: string;
    'aria-invalid'?: string;
    lang: string;
};
/**
 * Custom decorator to extract locale from request
 *
 * @example
 * ```typescript
 * @Get('profile')
 * getProfile(@CurrentLocale() locale: LanguageCode) {
 *   return this.userService.getProfile(locale);
 * }
 * ```
 */
export declare const CurrentLocale: any;
/**
 * Metadata key for locale validation
 */
export declare const LOCALE_METADATA_KEY = "i18n:locale";
/**
 * Decorator to set supported locales for endpoint
 *
 * @param locales - Supported language codes
 *
 * @example
 * ```typescript
 * @SupportedLocales(LanguageCode.EN, LanguageCode.ES, LanguageCode.FR)
 * @Get('content')
 * getContent(@CurrentLocale() locale: LanguageCode) {
 *   return this.contentService.get(locale);
 * }
 * ```
 */
export declare const SupportedLocales: (...locales: LanguageCode[]) => any;
/**
 * NestJS middleware for locale detection and injection
 *
 * @example
 * ```typescript
 * // In app.module.ts
 * export class AppModule implements NestModule {
 *   configure(consumer: MiddlewareConsumer) {
 *     consumer.apply(LocaleMiddleware).forRoutes('*');
 *   }
 * }
 * ```
 */
export declare class LocaleMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
}
/**
 * NestJS interceptor for automatic translation of responses
 *
 * @example
 * ```typescript
 * @UseInterceptors(TranslationInterceptor)
 * @Get('messages')
 * getMessages() {
 *   return {
 *     welcome: 'common.welcome',
 *     goodbye: 'common.goodbye',
 *   };
 * }
 * ```
 */
export declare class TranslationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private translateObject;
}
/**
 * Validate locale code
 *
 * @param locale - Language code to validate
 * @returns True if valid locale
 *
 * @example
 * ```typescript
 * const isValid = isValidLocale('en'); // true
 * const isInvalid = isValidLocale('xx'); // false
 * ```
 */
export declare function isValidLocale(locale: string): locale is LanguageCode;
/**
 * Get best matching locale from array of preferences
 *
 * @param preferences - Array of preferred locales
 * @param supportedLocales - Array of supported locales
 * @returns Best matching locale or default
 *
 * @example
 * ```typescript
 * const best = getBestMatchingLocale(
 *   [LanguageCode.FR, LanguageCode.DE, LanguageCode.EN],
 *   [LanguageCode.EN, LanguageCode.ES]
 * );
 * // Returns: LanguageCode.EN
 * ```
 */
export declare function getBestMatchingLocale(preferences: LanguageCode[], supportedLocales: LanguageCode[]): LanguageCode;
/**
 * Generate translation coverage report
 *
 * @param baseLocale - Base locale for comparison
 * @param targetLocale - Target locale to check coverage
 * @param namespace - Translation namespace
 * @returns Coverage statistics
 *
 * @example
 * ```typescript
 * const report = getTranslationCoverage(
 *   LanguageCode.EN,
 *   LanguageCode.FR,
 *   TranslationNamespace.COMMON
 * );
 * console.log(`Coverage: ${report.percentage}%`);
 * console.log(`Missing keys: ${report.missingKeys.join(', ')}`);
 * ```
 */
export declare function getTranslationCoverage(baseLocale: LanguageCode, targetLocale: LanguageCode, namespace: TranslationNamespace): {
    baseKeys: number;
    translatedKeys: number;
    percentage: number;
    missingKeys: string[];
};
/**
 * Create locale switcher metadata
 *
 * @param currentLocale - Currently active locale
 * @param availableLocales - Array of available locales
 * @returns Locale switcher data
 *
 * @example
 * ```typescript
 * const switcher = createLocaleSwitcher(LanguageCode.EN, [
 *   LanguageCode.EN,
 *   LanguageCode.ES,
 *   LanguageCode.FR,
 * ]);
 * ```
 */
export declare function createLocaleSwitcher(currentLocale: LanguageCode, availableLocales: LanguageCode[]): Array<{
    code: LanguageCode;
    name: string;
    nativeName: string;
    active: boolean;
    direction: TextDirection;
}>;
/**
 * Export translations to JSON format
 *
 * @param locale - Language code
 * @param namespace - Translation namespace
 * @returns JSON string of translations
 *
 * @example
 * ```typescript
 * const json = exportTranslationsToJSON(LanguageCode.EN, TranslationNamespace.COMMON);
 * fs.writeFileSync('translations/en/common.json', json);
 * ```
 */
export declare function exportTranslationsToJSON(locale: LanguageCode, namespace: TranslationNamespace): string;
/**
 * Import translations from JSON object
 *
 * @param locale - Language code
 * @param namespace - Translation namespace
 * @param jsonData - Translation data as object
 * @param merge - Whether to merge with existing translations
 *
 * @example
 * ```typescript
 * const data = { 'common.welcome': 'Welcome', 'common.goodbye': 'Goodbye' };
 * importTranslationsFromJSON(LanguageCode.EN, TranslationNamespace.COMMON, data);
 * ```
 */
export declare function importTranslationsFromJSON(locale: LanguageCode, namespace: TranslationNamespace, jsonData: Record<string, string>, merge?: boolean): void;
//# sourceMappingURL=internationalization-kit.prod.d.ts.map