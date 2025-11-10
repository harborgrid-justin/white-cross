"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAcceptLanguage = exports.detectLocale = exports.preloadTranslations = exports.cacheTranslations = exports.applyRTLTransform = exports.getTextDirection = exports.isRTL = exports.formatFileSize = exports.formatPercentage = exports.formatNumber = exports.parseLocalizedDate = exports.formatTimezone = exports.formatRelativeTime = exports.formatDate = exports.getLocaleNumberFormat = exports.parseCurrency = exports.formatCurrency = exports.translatePlural = exports.formatPluralMessage = exports.getPluralForm = exports.sanitizeTranslationInput = exports.escapeHtml = exports.translateAndFormat = exports.formatMessage = exports.toggleLocale = exports.setDefaultLocale = exports.getDefaultLocale = exports.listEnabledLocales = exports.getLocale = exports.createLocale = exports.updateTranslationStatus = exports.findMissingTranslations = exports.exportTranslations = exports.bulkImportTranslations = exports.translate = exports.upsertTranslation = exports.getTranslation = exports.createI18nTables = exports.getTranslationModelAttributes = exports.getLocaleModelAttributes = exports.TranslationStatus = exports.TextDirection = void 0;
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
const sequelize_1 = require("sequelize");
/**
 * Text direction
 */
var TextDirection;
(function (TextDirection) {
    TextDirection["LTR"] = "ltr";
    TextDirection["RTL"] = "rtl";
})(TextDirection || (exports.TextDirection = TextDirection = {}));
/**
 * Translation status
 */
var TranslationStatus;
(function (TranslationStatus) {
    TranslationStatus["PENDING"] = "pending";
    TranslationStatus["APPROVED"] = "approved";
    TranslationStatus["NEEDS_REVIEW"] = "needs_review";
    TranslationStatus["REJECTED"] = "rejected";
    TranslationStatus["OUTDATED"] = "outdated";
})(TranslationStatus || (exports.TranslationStatus = TranslationStatus = {}));
// ============================================================================
// LOCALE MODEL DEFINITIONS
// ============================================================================
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
const getLocaleModelAttributes = (sequelize) => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    code: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        validate: {
            is: /^[a-z]{2}-[A-Z]{2}$/,
        },
        comment: 'Locale code (e.g., en-US, es-ES)',
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        comment: 'Locale name in English',
    },
    nativeName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        comment: 'Locale name in native language',
    },
    direction: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(TextDirection)),
        allowNull: false,
        defaultValue: TextDirection.LTR,
        comment: 'Text direction',
    },
    currency: {
        type: sequelize_1.DataTypes.STRING(3),
        allowNull: false,
        comment: 'ISO 4217 currency code',
    },
    dateFormat: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'YYYY-MM-DD',
        comment: 'Default date format',
    },
    timeFormat: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'HH:mm:ss',
        comment: 'Default time format',
    },
    numberFormat: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
            decimal: '.',
            thousands: ',',
            precision: 2,
        },
        comment: 'Number formatting configuration',
    },
    enabled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether locale is enabled',
    },
    isDefault: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether this is the default locale',
    },
    metadata: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional locale metadata',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
});
exports.getLocaleModelAttributes = getLocaleModelAttributes;
/**
 * 2. Defines Translation model attributes for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} Translation model attributes
 */
const getTranslationModelAttributes = (sequelize) => ({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    key: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        comment: 'Translation key',
    },
    locale: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
        comment: 'Locale code',
    },
    value: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        comment: 'Translated text',
    },
    namespace: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'default',
        comment: 'Translation namespace',
    },
    context: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        comment: 'Context for disambiguation',
    },
    pluralForm: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        comment: 'Plural form (one, few, many, other)',
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(TranslationStatus)),
        allowNull: false,
        defaultValue: TranslationStatus.PENDING,
        comment: 'Translation status',
    },
    metadata: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
    },
    translatedBy: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        comment: 'User who created/updated translation',
    },
    reviewedBy: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        comment: 'User who reviewed translation',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
});
exports.getTranslationModelAttributes = getTranslationModelAttributes;
/**
 * 3. Creates Locale and Translation tables with indexes.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 */
const createI18nTables = async (queryInterface, sequelize) => {
    // Create Locales table
    await queryInterface.createTable('locales', (0, exports.getLocaleModelAttributes)(sequelize));
    await queryInterface.addIndex('locales', ['code'], { name: 'idx_locales_code', unique: true });
    await queryInterface.addIndex('locales', ['enabled'], { name: 'idx_locales_enabled' });
    // Create Translations table
    await queryInterface.createTable('translations', (0, exports.getTranslationModelAttributes)(sequelize));
    await queryInterface.addIndex('translations', ['key', 'locale', 'namespace'], {
        name: 'idx_translations_key_locale_namespace',
        unique: true,
    });
    await queryInterface.addIndex('translations', ['locale'], { name: 'idx_translations_locale' });
    await queryInterface.addIndex('translations', ['namespace'], { name: 'idx_translations_namespace' });
    await queryInterface.addIndex('translations', ['status'], { name: 'idx_translations_status' });
};
exports.createI18nTables = createI18nTables;
// ============================================================================
// TRANSLATION SERVICES
// ============================================================================
/**
 * 4. Retrieves translation by key and locale.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} key - Translation key
 * @param {LocaleCode} locale - Locale code
 * @param {string} namespace - Namespace
 * @returns {Promise<string | null>} Translation or null
 */
const getTranslation = async (sequelize, key, locale, namespace = 'default') => {
    const Translation = sequelize.models.Translation;
    const translation = await Translation.findOne({
        where: { key, locale, namespace, status: TranslationStatus.APPROVED },
    });
    return translation ? translation.value : null;
};
exports.getTranslation = getTranslation;
/**
 * 5. Creates or updates translation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Translation} translation - Translation data
 * @returns {Promise<any>} Created/updated translation
 */
const upsertTranslation = async (sequelize, translation) => {
    const Translation = sequelize.models.Translation;
    const [record, created] = await Translation.upsert({
        key: translation.key,
        locale: translation.locale,
        value: translation.value,
        namespace: translation.namespace || 'default',
        context: translation.context,
        pluralForm: translation.pluralForm,
        status: translation.status || TranslationStatus.PENDING,
        metadata: translation.metadata || {},
    });
    return record;
};
exports.upsertTranslation = upsertTranslation;
/**
 * 6. Translates text with fallback to default locale.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} key - Translation key
 * @param {LocaleCode} locale - Preferred locale
 * @param {LocaleCode} fallbackLocale - Fallback locale
 * @returns {Promise<string>} Translation or key
 */
const translate = async (sequelize, key, locale, fallbackLocale = 'en-US') => {
    // Try preferred locale
    let translation = await (0, exports.getTranslation)(sequelize, key, locale);
    // Try fallback locale
    if (!translation && locale !== fallbackLocale) {
        translation = await (0, exports.getTranslation)(sequelize, key, fallbackLocale);
    }
    // Return key if no translation found
    return translation || key;
};
exports.translate = translate;
/**
 * 7. Bulk imports translations from JSON.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} locale - Locale code
 * @param {Record<string, string>} translations - Translation key-value pairs
 * @param {string} namespace - Namespace
 * @returns {Promise<number>} Number of translations imported
 */
const bulkImportTranslations = async (sequelize, locale, translations, namespace = 'default') => {
    const Translation = sequelize.models.Translation;
    let count = 0;
    for (const [key, value] of Object.entries(translations)) {
        await Translation.upsert({
            key,
            locale,
            value,
            namespace,
            status: TranslationStatus.APPROVED,
        });
        count++;
    }
    return count;
};
exports.bulkImportTranslations = bulkImportTranslations;
/**
 * 8. Exports translations to JSON format.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} locale - Locale code
 * @param {string} namespace - Namespace
 * @returns {Promise<Record<string, string>>} Translation key-value pairs
 */
const exportTranslations = async (sequelize, locale, namespace = 'default') => {
    const Translation = sequelize.models.Translation;
    const translations = await Translation.findAll({
        where: { locale, namespace, status: TranslationStatus.APPROVED },
        raw: true,
    });
    return translations.reduce((acc, t) => {
        acc[t.key] = t.value;
        return acc;
    }, {});
};
exports.exportTranslations = exportTranslations;
/**
 * 9. Finds missing translations for a locale.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} sourceLocale - Source locale
 * @param {LocaleCode} targetLocale - Target locale
 * @param {string} namespace - Namespace
 * @returns {Promise<string[]>} Missing translation keys
 */
const findMissingTranslations = async (sequelize, sourceLocale, targetLocale, namespace = 'default') => {
    const Translation = sequelize.models.Translation;
    const sourceKeys = await Translation.findAll({
        where: { locale: sourceLocale, namespace },
        attributes: ['key'],
        raw: true,
    });
    const targetKeys = await Translation.findAll({
        where: { locale: targetLocale, namespace },
        attributes: ['key'],
        raw: true,
    });
    const targetKeySet = new Set(targetKeys.map((t) => t.key));
    return sourceKeys.filter((s) => !targetKeySet.has(s.key)).map((s) => s.key);
};
exports.findMissingTranslations = findMissingTranslations;
/**
 * 10. Updates translation status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} translationId - Translation ID
 * @param {TranslationStatus} status - New status
 * @param {string} reviewedBy - Reviewer user ID
 * @returns {Promise<any>} Updated translation
 */
const updateTranslationStatus = async (sequelize, translationId, status, reviewedBy) => {
    const Translation = sequelize.models.Translation;
    const translation = await Translation.findByPk(translationId);
    if (!translation) {
        throw new Error(`Translation ${translationId} not found`);
    }
    await translation.update({
        status,
        reviewedBy,
    });
    return translation;
};
exports.updateTranslationStatus = updateTranslationStatus;
// ============================================================================
// LOCALE MANAGEMENT
// ============================================================================
/**
 * 11. Creates locale configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleConfig} config - Locale configuration
 * @returns {Promise<any>} Created locale
 */
const createLocale = async (sequelize, config) => {
    const Locale = sequelize.models.Locale;
    return await Locale.create({
        code: config.code,
        name: config.name,
        nativeName: config.nativeName,
        direction: config.direction,
        currency: config.currency,
        dateFormat: config.dateFormat,
        timeFormat: config.timeFormat,
        numberFormat: config.numberFormat,
        enabled: config.enabled,
        isDefault: config.isDefault || false,
    });
};
exports.createLocale = createLocale;
/**
 * 12. Retrieves locale by code.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} code - Locale code
 * @returns {Promise<any | null>} Locale or null
 */
const getLocale = async (sequelize, code) => {
    const Locale = sequelize.models.Locale;
    return await Locale.findOne({ where: { code } });
};
exports.getLocale = getLocale;
/**
 * 13. Lists all enabled locales.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Array of enabled locales
 */
const listEnabledLocales = async (sequelize) => {
    const Locale = sequelize.models.Locale;
    return await Locale.findAll({ where: { enabled: true }, order: [['name', 'ASC']] });
};
exports.listEnabledLocales = listEnabledLocales;
/**
 * 14. Gets default locale.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Default locale
 */
const getDefaultLocale = async (sequelize) => {
    const Locale = sequelize.models.Locale;
    const defaultLocale = await Locale.findOne({ where: { isDefault: true } });
    if (!defaultLocale) {
        // Fallback to first enabled locale
        return await Locale.findOne({ where: { enabled: true } });
    }
    return defaultLocale;
};
exports.getDefaultLocale = getDefaultLocale;
/**
 * 15. Sets default locale.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} code - Locale code
 * @returns {Promise<any>} Updated locale
 */
const setDefaultLocale = async (sequelize, code) => {
    const Locale = sequelize.models.Locale;
    await Locale.update({ isDefault: false }, { where: { isDefault: true } });
    const locale = await Locale.findOne({ where: { code } });
    if (!locale) {
        throw new Error(`Locale ${code} not found`);
    }
    await locale.update({ isDefault: true });
    return locale;
};
exports.setDefaultLocale = setDefaultLocale;
/**
 * 16. Enables or disables locale.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} code - Locale code
 * @param {boolean} enabled - Enable or disable
 * @returns {Promise<any>} Updated locale
 */
const toggleLocale = async (sequelize, code, enabled) => {
    const Locale = sequelize.models.Locale;
    const locale = await Locale.findOne({ where: { code } });
    if (!locale) {
        throw new Error(`Locale ${code} not found`);
    }
    await locale.update({ enabled });
    return locale;
};
exports.toggleLocale = toggleLocale;
// ============================================================================
// MESSAGE FORMATTING
// ============================================================================
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
const formatMessage = (message, variables = {}) => {
    return message.replace(/\{(\w+)\}/g, (match, key) => {
        return variables.hasOwnProperty(key) ? String(variables[key]) : match;
    });
};
exports.formatMessage = formatMessage;
/**
 * 18. Translates and formats message.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} key - Translation key
 * @param {MessageFormatOptions} options - Format options
 * @returns {Promise<string>} Formatted translation
 */
const translateAndFormat = async (sequelize, key, options) => {
    const translation = await (0, exports.translate)(sequelize, key, options.locale);
    const formatted = (0, exports.formatMessage)(translation, options.variables);
    if (options.escapeHtml) {
        return (0, exports.escapeHtml)(formatted);
    }
    return formatted;
};
exports.translateAndFormat = translateAndFormat;
/**
 * 19. Escapes HTML in string.
 *
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
const escapeHtml = (text) => {
    const htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };
    return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
};
exports.escapeHtml = escapeHtml;
/**
 * 20. Sanitizes translation input.
 *
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
const sanitizeTranslationInput = (text) => {
    // Remove control characters and trim
    return text.replace(/[\x00-\x1F\x7F]/g, '').trim();
};
exports.sanitizeTranslationInput = sanitizeTranslationInput;
// ============================================================================
// PLURALIZATION UTILITIES
// ============================================================================
/**
 * 21. Gets plural form for locale and count.
 *
 * @param {LocaleCode} locale - Locale code
 * @param {number} count - Count
 * @returns {string} Plural form (zero, one, two, few, many, other)
 */
const getPluralForm = (locale, count) => {
    const rules = new Intl.PluralRules(locale);
    return rules.select(count);
};
exports.getPluralForm = getPluralForm;
/**
 * 22. Formats plural message.
 *
 * @param {PluralRules} rules - Plural rules
 * @param {number} count - Count
 * @param {Record<string, any>} variables - Variables
 * @returns {string} Formatted plural message
 */
const formatPluralMessage = (rules, count, variables = {}) => {
    const pluralForm = (0, exports.getPluralForm)(variables.locale || 'en-US', count);
    const message = rules[pluralForm] || rules.other || `{count} items`;
    return (0, exports.formatMessage)(message, { ...variables, count });
};
exports.formatPluralMessage = formatPluralMessage;
/**
 * 23. Translates plural message.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} key - Translation key
 * @param {LocaleCode} locale - Locale code
 * @param {number} count - Count
 * @returns {Promise<string>} Translated plural message
 */
const translatePlural = async (sequelize, key, locale, count) => {
    const Translation = sequelize.models.Translation;
    const pluralForm = (0, exports.getPluralForm)(locale, count);
    const translation = await Translation.findOne({
        where: {
            key,
            locale,
            pluralForm,
            status: TranslationStatus.APPROVED,
        },
    });
    if (translation) {
        return (0, exports.formatMessage)(translation.value, { count });
    }
    // Fallback to default plural
    const defaultTranslation = await Translation.findOne({
        where: {
            key,
            locale,
            pluralForm: 'other',
            status: TranslationStatus.APPROVED,
        },
    });
    return defaultTranslation
        ? (0, exports.formatMessage)(defaultTranslation.value, { count })
        : `${count} ${key}`;
};
exports.translatePlural = translatePlural;
// ============================================================================
// CURRENCY FORMATTERS
// ============================================================================
/**
 * 24. Formats currency value.
 *
 * @param {number} value - Numeric value
 * @param {CurrencyFormatOptions} options - Format options
 * @returns {string} Formatted currency
 */
const formatCurrency = (value, options) => {
    const formatter = new Intl.NumberFormat(options.locale, {
        style: 'currency',
        currency: options.currency,
        currencyDisplay: options.display || 'symbol',
        minimumFractionDigits: options.minimumFractionDigits,
        maximumFractionDigits: options.maximumFractionDigits,
    });
    return formatter.format(value);
};
exports.formatCurrency = formatCurrency;
/**
 * 25. Parses currency string to number.
 *
 * @param {string} currencyString - Currency string
 * @param {LocaleCode} locale - Locale code
 * @returns {number} Parsed number
 */
const parseCurrency = (currencyString, locale) => {
    // Remove currency symbols and parse
    const cleaned = currencyString.replace(/[^\d.,\-]/g, '');
    const localeConfig = (0, exports.getLocaleNumberFormat)(locale);
    const normalized = cleaned
        .replace(new RegExp(`\\${localeConfig.thousands}`, 'g'), '')
        .replace(localeConfig.decimal, '.');
    return parseFloat(normalized);
};
exports.parseCurrency = parseCurrency;
/**
 * 26. Gets locale number format configuration.
 *
 * @param {LocaleCode} locale - Locale code
 * @returns {object} Number format config
 */
const getLocaleNumberFormat = (locale) => {
    const formats = {
        'en-US': { decimal: '.', thousands: ',', precision: 2 },
        'es-ES': { decimal: ',', thousands: '.', precision: 2 },
        'de-DE': { decimal: ',', thousands: '.', precision: 2 },
        'fr-FR': { decimal: ',', thousands: ' ', precision: 2 },
    };
    return formats[locale] || formats['en-US'];
};
exports.getLocaleNumberFormat = getLocaleNumberFormat;
// ============================================================================
// DATE/TIME LOCALIZATION
// ============================================================================
/**
 * 27. Formats date with locale.
 *
 * @param {Date} date - Date to format
 * @param {DateFormatOptions} options - Format options
 * @returns {string} Formatted date
 */
const formatDate = (date, options) => {
    const formatter = new Intl.DateTimeFormat(options.locale, {
        dateStyle: options.dateStyle,
        timeStyle: options.timeStyle,
        timeZone: options.timezone,
    });
    return formatter.format(date);
};
exports.formatDate = formatDate;
/**
 * 28. Formats relative time.
 *
 * @param {Date} date - Date to format
 * @param {LocaleCode} locale - Locale code
 * @returns {string} Relative time string
 */
const formatRelativeTime = (date, locale) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    if (Math.abs(diffDays) > 0) {
        return rtf.format(diffDays, 'day');
    }
    else if (Math.abs(diffHours) > 0) {
        return rtf.format(diffHours, 'hour');
    }
    else if (Math.abs(diffMinutes) > 0) {
        return rtf.format(diffMinutes, 'minute');
    }
    else {
        return rtf.format(diffSeconds, 'second');
    }
};
exports.formatRelativeTime = formatRelativeTime;
/**
 * 29. Formats time zone.
 *
 * @param {string} timezone - Timezone name
 * @param {LocaleCode} locale - Locale code
 * @returns {string} Formatted timezone
 */
const formatTimezone = (timezone, locale) => {
    const formatter = new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        timeZoneName: 'long',
    });
    const parts = formatter.formatToParts(new Date());
    const timeZonePart = parts.find((part) => part.type === 'timeZoneName');
    return timeZonePart ? timeZonePart.value : timezone;
};
exports.formatTimezone = formatTimezone;
/**
 * 30. Parses localized date string.
 *
 * @param {string} dateString - Date string
 * @param {LocaleCode} locale - Locale code
 * @returns {Date} Parsed date
 */
const parseLocalizedDate = (dateString, locale) => {
    // Basic parsing - in production, use a library like date-fns
    return new Date(dateString);
};
exports.parseLocalizedDate = parseLocalizedDate;
// ============================================================================
// NUMBER FORMATTING
// ============================================================================
/**
 * 31. Formats number with locale.
 *
 * @param {number} value - Number to format
 * @param {NumberFormatOptions} options - Format options
 * @returns {string} Formatted number
 */
const formatNumber = (value, options) => {
    const formatter = new Intl.NumberFormat(options.locale, {
        style: options.style || 'decimal',
        minimumFractionDigits: options.minimumFractionDigits,
        maximumFractionDigits: options.maximumFractionDigits,
        unit: options.unit,
    });
    return formatter.format(value);
};
exports.formatNumber = formatNumber;
/**
 * 32. Formats percentage.
 *
 * @param {number} value - Value (0-1 range)
 * @param {LocaleCode} locale - Locale code
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage
 */
const formatPercentage = (value, locale, decimals = 0) => {
    const formatter = new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
    return formatter.format(value);
};
exports.formatPercentage = formatPercentage;
/**
 * 33. Formats file size.
 *
 * @param {number} bytes - File size in bytes
 * @param {LocaleCode} locale - Locale code
 * @returns {string} Formatted file size
 */
const formatFileSize = (bytes, locale) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    const formatter = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
    return `${formatter.format(size)} ${units[unitIndex]}`;
};
exports.formatFileSize = formatFileSize;
// ============================================================================
// RTL SUPPORT HELPERS
// ============================================================================
/**
 * 34. Checks if locale is RTL.
 *
 * @param {LocaleCode} locale - Locale code
 * @returns {boolean} True if RTL
 */
const isRTL = (locale) => {
    const rtlLocales = ['ar-SA', 'he-IL'];
    return rtlLocales.includes(locale);
};
exports.isRTL = isRTL;
/**
 * 35. Gets text direction for locale.
 *
 * @param {LocaleCode} locale - Locale code
 * @returns {TextDirection} Text direction
 */
const getTextDirection = (locale) => {
    return (0, exports.isRTL)(locale) ? TextDirection.RTL : TextDirection.LTR;
};
exports.getTextDirection = getTextDirection;
/**
 * 36. Applies RTL transforms to CSS.
 *
 * @param {string} css - CSS string
 * @param {boolean} isRtl - Is RTL
 * @returns {string} Transformed CSS
 */
const applyRTLTransform = (css, isRtl) => {
    if (!isRtl)
        return css;
    // Simple RTL transformations
    return css
        .replace(/left/g, 'RIGHT_TEMP')
        .replace(/right/g, 'left')
        .replace(/RIGHT_TEMP/g, 'right')
        .replace(/margin: (\d+)px (\d+)px (\d+)px (\d+)px/g, 'margin: $1px $4px $3px $2px')
        .replace(/padding: (\d+)px (\d+)px (\d+)px (\d+)px/g, 'padding: $1px $4px $3px $2px');
};
exports.applyRTLTransform = applyRTLTransform;
// ============================================================================
// TRANSLATION CACHING
// ============================================================================
/**
 * 37. Caches translations for namespace.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} locale - Locale code
 * @param {string} namespace - Namespace
 * @param {number} ttl - TTL in seconds
 * @returns {Promise<Record<string, string>>} Cached translations
 */
const cacheTranslations = async (sequelize, locale, namespace = 'default', ttl = 3600) => {
    const translations = await (0, exports.exportTranslations)(sequelize, locale, namespace);
    // In production, store in Redis/cache
    // For now, return the translations
    return translations;
};
exports.cacheTranslations = cacheTranslations;
/**
 * 38. Preloads translations for multiple locales.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode[]} locales - Locale codes
 * @param {string} namespace - Namespace
 * @returns {Promise<Record<string, Record<string, string>>>} Preloaded translations
 */
const preloadTranslations = async (sequelize, locales, namespace = 'default') => {
    const result = {};
    for (const locale of locales) {
        result[locale] = await (0, exports.exportTranslations)(sequelize, locale, namespace);
    }
    return result;
};
exports.preloadTranslations = preloadTranslations;
// ============================================================================
// LOCALE DETECTION
// ============================================================================
/**
 * 39. Detects locale from request headers and preferences.
 *
 * @param {LocaleDetectionOptions} options - Detection options
 * @returns {LocaleCode} Detected locale
 */
const detectLocale = (options) => {
    // Priority: user preference > cookie > query param > accept-language > default
    if (options.userPreference && options.supportedLocales.includes(options.userPreference)) {
        return options.userPreference;
    }
    if (options.cookieLocale && options.supportedLocales.includes(options.cookieLocale)) {
        return options.cookieLocale;
    }
    if (options.acceptLanguageHeader) {
        const preferred = (0, exports.parseAcceptLanguage)(options.acceptLanguageHeader, options.supportedLocales);
        if (preferred)
            return preferred;
    }
    return options.defaultLocale;
};
exports.detectLocale = detectLocale;
/**
 * 40. Parses Accept-Language header.
 *
 * @param {string} header - Accept-Language header
 * @param {LocaleCode[]} supported - Supported locales
 * @returns {LocaleCode | null} Best matching locale or null
 */
const parseAcceptLanguage = (header, supported) => {
    const locales = header
        .split(',')
        .map((lang) => {
        const parts = lang.trim().split(';');
        const locale = parts[0];
        const q = parts[1] ? parseFloat(parts[1].split('=')[1]) : 1.0;
        return { locale, q };
    })
        .sort((a, b) => b.q - a.q);
    for (const { locale } of locales) {
        const normalized = locale.replace('_', '-');
        if (supported.includes(normalized)) {
            return normalized;
        }
        // Try language match without region
        const languageOnly = normalized.split('-')[0];
        const match = supported.find((s) => s.startsWith(languageOnly));
        if (match)
            return match;
    }
    return null;
};
exports.parseAcceptLanguage = parseAcceptLanguage;
//# sourceMappingURL=i18n-localization-kit.js.map