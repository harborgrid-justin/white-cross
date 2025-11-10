/**
 * LOC: I18N-KIT-001
 * File: /reuse/i18n-localization-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/node (v18.x)
 *
 * DOWNSTREAM (imported by):
 *   - Translation services
 *   - Locale management controllers
 *   - Internationalization middleware
 *   - Healthcare content localization
 *   - Patient communication services
 */
/**
 * File: /reuse/i18n-localization-kit.ts
 * Locator: WC-I18N-KIT-001
 * Purpose: Internationalization & Localization Kit - Comprehensive i18n utilities for Sequelize
 *
 * Upstream: sequelize v6.x, Intl API
 * Downstream: Translation services, locale providers, content management, patient communications
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x, NestJS 10.x
 * Exports: 40 functions for translations, locales, formatting, pluralization, RTL support, caching
 *
 * LLM Context: Enterprise-grade internationalization utilities for White Cross healthcare platform.
 * Provides comprehensive translation management, locale detection, message formatting, pluralization,
 * currency and number formatting, date/time localization, RTL support, translation caching,
 * and HIPAA-compliant multilingual patient communications with healthcare terminology support.
 */
import { Sequelize, ModelAttributes, QueryInterface } from 'sequelize';
/**
 * Supported locale codes (ISO 639-1 + ISO 3166-1)
 */
export type LocaleCode = 'en-US' | 'en-GB' | 'es-ES' | 'es-MX' | 'fr-FR' | 'de-DE' | 'it-IT' | 'pt-BR' | 'pt-PT' | 'zh-CN' | 'zh-TW' | 'ja-JP' | 'ko-KR' | 'ar-SA' | 'he-IL' | 'hi-IN' | 'ru-RU' | 'pl-PL' | 'nl-NL' | 'sv-SE' | 'da-DK' | 'fi-FI' | 'no-NO' | 'tr-TR' | 'th-TH' | 'vi-VN';
/**
 * Text direction
 */
export declare enum TextDirection {
    LTR = "ltr",
    RTL = "rtl"
}
/**
 * Translation status
 */
export declare enum TranslationStatus {
    PENDING = "pending",
    APPROVED = "approved",
    NEEDS_REVIEW = "needs_review",
    REJECTED = "rejected",
    OUTDATED = "outdated"
}
/**
 * Locale configuration
 */
export interface LocaleConfig {
    code: LocaleCode;
    name: string;
    nativeName: string;
    direction: TextDirection;
    currency: string;
    dateFormat: string;
    timeFormat: string;
    numberFormat: {
        decimal: string;
        thousands: string;
        precision: number;
    };
    enabled: boolean;
    isDefault?: boolean;
}
/**
 * Translation entry
 */
export interface Translation {
    id?: string;
    key: string;
    locale: LocaleCode;
    value: string;
    namespace?: string;
    context?: string;
    pluralForm?: string;
    status: TranslationStatus;
    metadata?: Record<string, any>;
}
/**
 * Plural rules
 */
export interface PluralRules {
    zero?: string;
    one?: string;
    two?: string;
    few?: string;
    many?: string;
    other: string;
}
/**
 * Message formatting options
 */
export interface MessageFormatOptions {
    locale: LocaleCode;
    variables?: Record<string, any>;
    defaultValue?: string;
    escapeHtml?: boolean;
}
/**
 * Currency format options
 */
export interface CurrencyFormatOptions {
    locale: LocaleCode;
    currency: string;
    display?: 'symbol' | 'code' | 'name';
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
}
/**
 * Date format options
 */
export interface DateFormatOptions {
    locale: LocaleCode;
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    timeStyle?: 'full' | 'long' | 'medium' | 'short';
    timezone?: string;
    format?: string;
}
/**
 * Number format options
 */
export interface NumberFormatOptions {
    locale: LocaleCode;
    style?: 'decimal' | 'percent' | 'unit';
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    unit?: string;
}
/**
 * Locale detection options
 */
export interface LocaleDetectionOptions {
    acceptLanguageHeader?: string;
    userPreference?: LocaleCode;
    cookieLocale?: LocaleCode;
    queryParam?: string;
    defaultLocale: LocaleCode;
    supportedLocales: LocaleCode[];
}
/**
 * Translation cache entry
 */
export interface TranslationCacheEntry {
    locale: LocaleCode;
    namespace: string;
    translations: Record<string, string>;
    expiresAt: Date;
}
/**
 * 1. Defines Locale model attributes for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} Locale model attributes
 *
 * @example
 * ```typescript
 * const Locale = sequelize.define('Locale', getLocaleModelAttributes(sequelize));
 * ```
 */
export declare const getLocaleModelAttributes: (sequelize: Sequelize) => ModelAttributes;
/**
 * 2. Defines Translation model attributes for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} Translation model attributes
 */
export declare const getTranslationModelAttributes: (sequelize: Sequelize) => ModelAttributes;
/**
 * 3. Creates Locale and Translation tables with indexes.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 */
export declare const createI18nTables: (queryInterface: QueryInterface, sequelize: Sequelize) => Promise<void>;
/**
 * 4. Retrieves translation by key and locale.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} key - Translation key
 * @param {LocaleCode} locale - Locale code
 * @param {string} namespace - Namespace
 * @returns {Promise<string | null>} Translation or null
 */
export declare const getTranslation: (sequelize: Sequelize, key: string, locale: LocaleCode, namespace?: string) => Promise<string | null>;
/**
 * 5. Creates or updates translation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Translation} translation - Translation data
 * @returns {Promise<any>} Created/updated translation
 */
export declare const upsertTranslation: (sequelize: Sequelize, translation: Translation) => Promise<any>;
/**
 * 6. Translates text with fallback to default locale.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} key - Translation key
 * @param {LocaleCode} locale - Preferred locale
 * @param {LocaleCode} fallbackLocale - Fallback locale
 * @returns {Promise<string>} Translation or key
 */
export declare const translate: (sequelize: Sequelize, key: string, locale: LocaleCode, fallbackLocale?: LocaleCode) => Promise<string>;
/**
 * 7. Bulk imports translations from JSON.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} locale - Locale code
 * @param {Record<string, string>} translations - Translation key-value pairs
 * @param {string} namespace - Namespace
 * @returns {Promise<number>} Number of translations imported
 */
export declare const bulkImportTranslations: (sequelize: Sequelize, locale: LocaleCode, translations: Record<string, string>, namespace?: string) => Promise<number>;
/**
 * 8. Exports translations to JSON format.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} locale - Locale code
 * @param {string} namespace - Namespace
 * @returns {Promise<Record<string, string>>} Translation key-value pairs
 */
export declare const exportTranslations: (sequelize: Sequelize, locale: LocaleCode, namespace?: string) => Promise<Record<string, string>>;
/**
 * 9. Finds missing translations for a locale.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} sourceLocale - Source locale
 * @param {LocaleCode} targetLocale - Target locale
 * @param {string} namespace - Namespace
 * @returns {Promise<string[]>} Missing translation keys
 */
export declare const findMissingTranslations: (sequelize: Sequelize, sourceLocale: LocaleCode, targetLocale: LocaleCode, namespace?: string) => Promise<string[]>;
/**
 * 10. Updates translation status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} translationId - Translation ID
 * @param {TranslationStatus} status - New status
 * @param {string} reviewedBy - Reviewer user ID
 * @returns {Promise<any>} Updated translation
 */
export declare const updateTranslationStatus: (sequelize: Sequelize, translationId: string, status: TranslationStatus, reviewedBy?: string) => Promise<any>;
/**
 * 11. Creates locale configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleConfig} config - Locale configuration
 * @returns {Promise<any>} Created locale
 */
export declare const createLocale: (sequelize: Sequelize, config: LocaleConfig) => Promise<any>;
/**
 * 12. Retrieves locale by code.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} code - Locale code
 * @returns {Promise<any | null>} Locale or null
 */
export declare const getLocale: (sequelize: Sequelize, code: LocaleCode) => Promise<any | null>;
/**
 * 13. Lists all enabled locales.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Array of enabled locales
 */
export declare const listEnabledLocales: (sequelize: Sequelize) => Promise<any[]>;
/**
 * 14. Gets default locale.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Default locale
 */
export declare const getDefaultLocale: (sequelize: Sequelize) => Promise<any>;
/**
 * 15. Sets default locale.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} code - Locale code
 * @returns {Promise<any>} Updated locale
 */
export declare const setDefaultLocale: (sequelize: Sequelize, code: LocaleCode) => Promise<any>;
/**
 * 16. Enables or disables locale.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} code - Locale code
 * @param {boolean} enabled - Enable or disable
 * @returns {Promise<any>} Updated locale
 */
export declare const toggleLocale: (sequelize: Sequelize, code: LocaleCode, enabled: boolean) => Promise<any>;
/**
 * 17. Formats message with variable interpolation.
 *
 * @param {string} message - Message template
 * @param {Record<string, any>} variables - Variables to interpolate
 * @returns {string} Formatted message
 *
 * @example
 * formatMessage('Hello {name}!', { name: 'John' }) // 'Hello John!'
 */
export declare const formatMessage: (message: string, variables?: Record<string, any>) => string;
/**
 * 18. Translates and formats message.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} key - Translation key
 * @param {MessageFormatOptions} options - Format options
 * @returns {Promise<string>} Formatted translation
 */
export declare const translateAndFormat: (sequelize: Sequelize, key: string, options: MessageFormatOptions) => Promise<string>;
/**
 * 19. Escapes HTML in string.
 *
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export declare const escapeHtml: (text: string) => string;
/**
 * 20. Sanitizes translation input.
 *
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export declare const sanitizeTranslationInput: (text: string) => string;
/**
 * 21. Gets plural form for locale and count.
 *
 * @param {LocaleCode} locale - Locale code
 * @param {number} count - Count
 * @returns {string} Plural form (zero, one, two, few, many, other)
 */
export declare const getPluralForm: (locale: LocaleCode, count: number) => string;
/**
 * 22. Formats plural message.
 *
 * @param {PluralRules} rules - Plural rules
 * @param {number} count - Count
 * @param {Record<string, any>} variables - Variables
 * @returns {string} Formatted plural message
 */
export declare const formatPluralMessage: (rules: PluralRules, count: number, variables?: Record<string, any>) => string;
/**
 * 23. Translates plural message.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} key - Translation key
 * @param {LocaleCode} locale - Locale code
 * @param {number} count - Count
 * @returns {Promise<string>} Translated plural message
 */
export declare const translatePlural: (sequelize: Sequelize, key: string, locale: LocaleCode, count: number) => Promise<string>;
/**
 * 24. Formats currency value.
 *
 * @param {number} value - Numeric value
 * @param {CurrencyFormatOptions} options - Format options
 * @returns {string} Formatted currency
 */
export declare const formatCurrency: (value: number, options: CurrencyFormatOptions) => string;
/**
 * 25. Parses currency string to number.
 *
 * @param {string} currencyString - Currency string
 * @param {LocaleCode} locale - Locale code
 * @returns {number} Parsed number
 */
export declare const parseCurrency: (currencyString: string, locale: LocaleCode) => number;
/**
 * 26. Gets locale number format configuration.
 *
 * @param {LocaleCode} locale - Locale code
 * @returns {object} Number format config
 */
export declare const getLocaleNumberFormat: (locale: LocaleCode) => {
    decimal: string;
    thousands: string;
    precision: number;
};
/**
 * 27. Formats date with locale.
 *
 * @param {Date} date - Date to format
 * @param {DateFormatOptions} options - Format options
 * @returns {string} Formatted date
 */
export declare const formatDate: (date: Date, options: DateFormatOptions) => string;
/**
 * 28. Formats relative time.
 *
 * @param {Date} date - Date to format
 * @param {LocaleCode} locale - Locale code
 * @returns {string} Relative time string
 */
export declare const formatRelativeTime: (date: Date, locale: LocaleCode) => string;
/**
 * 29. Formats time zone.
 *
 * @param {string} timezone - Timezone name
 * @param {LocaleCode} locale - Locale code
 * @returns {string} Formatted timezone
 */
export declare const formatTimezone: (timezone: string, locale: LocaleCode) => string;
/**
 * 30. Parses localized date string.
 *
 * @param {string} dateString - Date string
 * @param {LocaleCode} locale - Locale code
 * @returns {Date} Parsed date
 */
export declare const parseLocalizedDate: (dateString: string, locale: LocaleCode) => Date;
/**
 * 31. Formats number with locale.
 *
 * @param {number} value - Number to format
 * @param {NumberFormatOptions} options - Format options
 * @returns {string} Formatted number
 */
export declare const formatNumber: (value: number, options: NumberFormatOptions) => string;
/**
 * 32. Formats percentage.
 *
 * @param {number} value - Value (0-1 range)
 * @param {LocaleCode} locale - Locale code
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage
 */
export declare const formatPercentage: (value: number, locale: LocaleCode, decimals?: number) => string;
/**
 * 33. Formats file size.
 *
 * @param {number} bytes - File size in bytes
 * @param {LocaleCode} locale - Locale code
 * @returns {string} Formatted file size
 */
export declare const formatFileSize: (bytes: number, locale: LocaleCode) => string;
/**
 * 34. Checks if locale is RTL.
 *
 * @param {LocaleCode} locale - Locale code
 * @returns {boolean} True if RTL
 */
export declare const isRTL: (locale: LocaleCode) => boolean;
/**
 * 35. Gets text direction for locale.
 *
 * @param {LocaleCode} locale - Locale code
 * @returns {TextDirection} Text direction
 */
export declare const getTextDirection: (locale: LocaleCode) => TextDirection;
/**
 * 36. Applies RTL transforms to CSS.
 *
 * @param {string} css - CSS string
 * @param {boolean} isRtl - Is RTL
 * @returns {string} Transformed CSS
 */
export declare const applyRTLTransform: (css: string, isRtl: boolean) => string;
/**
 * 37. Caches translations for namespace.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} locale - Locale code
 * @param {string} namespace - Namespace
 * @param {number} ttl - TTL in seconds
 * @returns {Promise<Record<string, string>>} Cached translations
 */
export declare const cacheTranslations: (sequelize: Sequelize, locale: LocaleCode, namespace?: string, ttl?: number) => Promise<Record<string, string>>;
/**
 * 38. Preloads translations for multiple locales.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode[]} locales - Locale codes
 * @param {string} namespace - Namespace
 * @returns {Promise<Record<string, Record<string, string>>>} Preloaded translations
 */
export declare const preloadTranslations: (sequelize: Sequelize, locales: LocaleCode[], namespace?: string) => Promise<Record<string, Record<string, string>>>;
/**
 * 39. Detects locale from request headers and preferences.
 *
 * @param {LocaleDetectionOptions} options - Detection options
 * @returns {LocaleCode} Detected locale
 */
export declare const detectLocale: (options: LocaleDetectionOptions) => LocaleCode;
/**
 * 40. Parses Accept-Language header.
 *
 * @param {string} header - Accept-Language header
 * @param {LocaleCode[]} supported - Supported locales
 * @returns {LocaleCode | null} Best matching locale or null
 */
export declare const parseAcceptLanguage: (header: string, supported: LocaleCode[]) => LocaleCode | null;
//# sourceMappingURL=i18n-localization-kit.d.ts.map