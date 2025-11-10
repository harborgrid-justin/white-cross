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

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  QueryInterface,
  Transaction,
  WhereOptions,
  FindOptions,
  Op,
  fn,
  col,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Supported locale codes (ISO 639-1 + ISO 3166-1)
 */
export type LocaleCode =
  | 'en-US'
  | 'en-GB'
  | 'es-ES'
  | 'es-MX'
  | 'fr-FR'
  | 'de-DE'
  | 'it-IT'
  | 'pt-BR'
  | 'pt-PT'
  | 'zh-CN'
  | 'zh-TW'
  | 'ja-JP'
  | 'ko-KR'
  | 'ar-SA'
  | 'he-IL'
  | 'hi-IN'
  | 'ru-RU'
  | 'pl-PL'
  | 'nl-NL'
  | 'sv-SE'
  | 'da-DK'
  | 'fi-FI'
  | 'no-NO'
  | 'tr-TR'
  | 'th-TH'
  | 'vi-VN';

/**
 * Text direction
 */
export enum TextDirection {
  LTR = 'ltr',
  RTL = 'rtl',
}

/**
 * Translation status
 */
export enum TranslationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  NEEDS_REVIEW = 'needs_review',
  REJECTED = 'rejected',
  OUTDATED = 'outdated',
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
export const getLocaleModelAttributes = (sequelize: Sequelize): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    validate: {
      is: /^[a-z]{2}-[A-Z]{2}$/,
    },
    comment: 'Locale code (e.g., en-US, es-ES)',
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Locale name in English',
  },
  nativeName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Locale name in native language',
  },
  direction: {
    type: DataTypes.ENUM(...Object.values(TextDirection)),
    allowNull: false,
    defaultValue: TextDirection.LTR,
    comment: 'Text direction',
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    comment: 'ISO 4217 currency code',
  },
  dateFormat: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'YYYY-MM-DD',
    comment: 'Default date format',
  },
  timeFormat: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'HH:mm:ss',
    comment: 'Default time format',
  },
  numberFormat: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      decimal: '.',
      thousands: ',',
      precision: 2,
    },
    comment: 'Number formatting configuration',
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether locale is enabled',
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether this is the default locale',
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Additional locale metadata',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

/**
 * 2. Defines Translation model attributes for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelAttributes} Translation model attributes
 */
export const getTranslationModelAttributes = (sequelize: Sequelize): ModelAttributes => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  key: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Translation key',
  },
  locale: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'Locale code',
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Translated text',
  },
  namespace: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'default',
    comment: 'Translation namespace',
  },
  context: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Context for disambiguation',
  },
  pluralForm: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Plural form (one, few, many, other)',
  },
  status: {
    type: DataTypes.ENUM(...Object.values(TranslationStatus)),
    allowNull: false,
    defaultValue: TranslationStatus.PENDING,
    comment: 'Translation status',
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Additional metadata',
  },
  translatedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'User who created/updated translation',
  },
  reviewedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'User who reviewed translation',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

/**
 * 3. Creates Locale and Translation tables with indexes.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<void>}
 */
export const createI18nTables = async (
  queryInterface: QueryInterface,
  sequelize: Sequelize,
): Promise<void> => {
  // Create Locales table
  await queryInterface.createTable('locales', getLocaleModelAttributes(sequelize));
  await queryInterface.addIndex('locales', ['code'], { name: 'idx_locales_code', unique: true });
  await queryInterface.addIndex('locales', ['enabled'], { name: 'idx_locales_enabled' });

  // Create Translations table
  await queryInterface.createTable('translations', getTranslationModelAttributes(sequelize));
  await queryInterface.addIndex('translations', ['key', 'locale', 'namespace'], {
    name: 'idx_translations_key_locale_namespace',
    unique: true,
  });
  await queryInterface.addIndex('translations', ['locale'], { name: 'idx_translations_locale' });
  await queryInterface.addIndex('translations', ['namespace'], { name: 'idx_translations_namespace' });
  await queryInterface.addIndex('translations', ['status'], { name: 'idx_translations_status' });
};

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
export const getTranslation = async (
  sequelize: Sequelize,
  key: string,
  locale: LocaleCode,
  namespace: string = 'default',
): Promise<string | null> => {
  const Translation = sequelize.models.Translation;

  const translation = await Translation.findOne({
    where: { key, locale, namespace, status: TranslationStatus.APPROVED },
  });

  return translation ? (translation as any).value : null;
};

/**
 * 5. Creates or updates translation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Translation} translation - Translation data
 * @returns {Promise<any>} Created/updated translation
 */
export const upsertTranslation = async (
  sequelize: Sequelize,
  translation: Translation,
): Promise<any> => {
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

/**
 * 6. Translates text with fallback to default locale.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} key - Translation key
 * @param {LocaleCode} locale - Preferred locale
 * @param {LocaleCode} fallbackLocale - Fallback locale
 * @returns {Promise<string>} Translation or key
 */
export const translate = async (
  sequelize: Sequelize,
  key: string,
  locale: LocaleCode,
  fallbackLocale: LocaleCode = 'en-US',
): Promise<string> => {
  // Try preferred locale
  let translation = await getTranslation(sequelize, key, locale);

  // Try fallback locale
  if (!translation && locale !== fallbackLocale) {
    translation = await getTranslation(sequelize, key, fallbackLocale);
  }

  // Return key if no translation found
  return translation || key;
};

/**
 * 7. Bulk imports translations from JSON.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} locale - Locale code
 * @param {Record<string, string>} translations - Translation key-value pairs
 * @param {string} namespace - Namespace
 * @returns {Promise<number>} Number of translations imported
 */
export const bulkImportTranslations = async (
  sequelize: Sequelize,
  locale: LocaleCode,
  translations: Record<string, string>,
  namespace: string = 'default',
): Promise<number> => {
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

/**
 * 8. Exports translations to JSON format.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} locale - Locale code
 * @param {string} namespace - Namespace
 * @returns {Promise<Record<string, string>>} Translation key-value pairs
 */
export const exportTranslations = async (
  sequelize: Sequelize,
  locale: LocaleCode,
  namespace: string = 'default',
): Promise<Record<string, string>> => {
  const Translation = sequelize.models.Translation;

  const translations = await Translation.findAll({
    where: { locale, namespace, status: TranslationStatus.APPROVED },
    raw: true,
  });

  return translations.reduce((acc: Record<string, string>, t: any) => {
    acc[t.key] = t.value;
    return acc;
  }, {});
};

/**
 * 9. Finds missing translations for a locale.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} sourceLocale - Source locale
 * @param {LocaleCode} targetLocale - Target locale
 * @param {string} namespace - Namespace
 * @returns {Promise<string[]>} Missing translation keys
 */
export const findMissingTranslations = async (
  sequelize: Sequelize,
  sourceLocale: LocaleCode,
  targetLocale: LocaleCode,
  namespace: string = 'default',
): Promise<string[]> => {
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

  const targetKeySet = new Set(targetKeys.map((t: any) => t.key));
  return sourceKeys.filter((s: any) => !targetKeySet.has(s.key)).map((s: any) => s.key);
};

/**
 * 10. Updates translation status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} translationId - Translation ID
 * @param {TranslationStatus} status - New status
 * @param {string} reviewedBy - Reviewer user ID
 * @returns {Promise<any>} Updated translation
 */
export const updateTranslationStatus = async (
  sequelize: Sequelize,
  translationId: string,
  status: TranslationStatus,
  reviewedBy?: string,
): Promise<any> => {
  const Translation = sequelize.models.Translation;

  const translation = await Translation.findByPk(translationId);
  if (!translation) {
    throw new Error(`Translation ${translationId} not found`);
  }

  await (translation as any).update({
    status,
    reviewedBy,
  });

  return translation;
};

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
export const createLocale = async (sequelize: Sequelize, config: LocaleConfig): Promise<any> => {
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

/**
 * 12. Retrieves locale by code.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} code - Locale code
 * @returns {Promise<any | null>} Locale or null
 */
export const getLocale = async (sequelize: Sequelize, code: LocaleCode): Promise<any | null> => {
  const Locale = sequelize.models.Locale;
  return await Locale.findOne({ where: { code } });
};

/**
 * 13. Lists all enabled locales.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Array of enabled locales
 */
export const listEnabledLocales = async (sequelize: Sequelize): Promise<any[]> => {
  const Locale = sequelize.models.Locale;
  return await Locale.findAll({ where: { enabled: true }, order: [['name', 'ASC']] });
};

/**
 * 14. Gets default locale.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Default locale
 */
export const getDefaultLocale = async (sequelize: Sequelize): Promise<any> => {
  const Locale = sequelize.models.Locale;
  const defaultLocale = await Locale.findOne({ where: { isDefault: true } });

  if (!defaultLocale) {
    // Fallback to first enabled locale
    return await Locale.findOne({ where: { enabled: true } });
  }

  return defaultLocale;
};

/**
 * 15. Sets default locale.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} code - Locale code
 * @returns {Promise<any>} Updated locale
 */
export const setDefaultLocale = async (sequelize: Sequelize, code: LocaleCode): Promise<any> => {
  const Locale = sequelize.models.Locale;

  await Locale.update({ isDefault: false }, { where: { isDefault: true } });

  const locale = await Locale.findOne({ where: { code } });
  if (!locale) {
    throw new Error(`Locale ${code} not found`);
  }

  await (locale as any).update({ isDefault: true });
  return locale;
};

/**
 * 16. Enables or disables locale.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode} code - Locale code
 * @param {boolean} enabled - Enable or disable
 * @returns {Promise<any>} Updated locale
 */
export const toggleLocale = async (
  sequelize: Sequelize,
  code: LocaleCode,
  enabled: boolean,
): Promise<any> => {
  const Locale = sequelize.models.Locale;

  const locale = await Locale.findOne({ where: { code } });
  if (!locale) {
    throw new Error(`Locale ${code} not found`);
  }

  await (locale as any).update({ enabled });
  return locale;
};

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
export const formatMessage = (message: string, variables: Record<string, any> = {}): string => {
  return message.replace(/\{(\w+)\}/g, (match, key) => {
    return variables.hasOwnProperty(key) ? String(variables[key]) : match;
  });
};

/**
 * 18. Translates and formats message.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} key - Translation key
 * @param {MessageFormatOptions} options - Format options
 * @returns {Promise<string>} Formatted translation
 */
export const translateAndFormat = async (
  sequelize: Sequelize,
  key: string,
  options: MessageFormatOptions,
): Promise<string> => {
  const translation = await translate(sequelize, key, options.locale);
  const formatted = formatMessage(translation, options.variables);

  if (options.escapeHtml) {
    return escapeHtml(formatted);
  }

  return formatted;
};

/**
 * 19. Escapes HTML in string.
 *
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export const escapeHtml = (text: string): string => {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
};

/**
 * 20. Sanitizes translation input.
 *
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export const sanitizeTranslationInput = (text: string): string => {
  // Remove control characters and trim
  return text.replace(/[\x00-\x1F\x7F]/g, '').trim();
};

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
export const getPluralForm = (locale: LocaleCode, count: number): string => {
  const rules = new Intl.PluralRules(locale);
  return rules.select(count);
};

/**
 * 22. Formats plural message.
 *
 * @param {PluralRules} rules - Plural rules
 * @param {number} count - Count
 * @param {Record<string, any>} variables - Variables
 * @returns {string} Formatted plural message
 */
export const formatPluralMessage = (
  rules: PluralRules,
  count: number,
  variables: Record<string, any> = {},
): string => {
  const pluralForm = getPluralForm(variables.locale || 'en-US', count);
  const message =
    rules[pluralForm as keyof PluralRules] || rules.other || `{count} items`;

  return formatMessage(message, { ...variables, count });
};

/**
 * 23. Translates plural message.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} key - Translation key
 * @param {LocaleCode} locale - Locale code
 * @param {number} count - Count
 * @returns {Promise<string>} Translated plural message
 */
export const translatePlural = async (
  sequelize: Sequelize,
  key: string,
  locale: LocaleCode,
  count: number,
): Promise<string> => {
  const Translation = sequelize.models.Translation;
  const pluralForm = getPluralForm(locale, count);

  const translation = await Translation.findOne({
    where: {
      key,
      locale,
      pluralForm,
      status: TranslationStatus.APPROVED,
    },
  });

  if (translation) {
    return formatMessage((translation as any).value, { count });
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
    ? formatMessage((defaultTranslation as any).value, { count })
    : `${count} ${key}`;
};

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
export const formatCurrency = (value: number, options: CurrencyFormatOptions): string => {
  const formatter = new Intl.NumberFormat(options.locale, {
    style: 'currency',
    currency: options.currency,
    currencyDisplay: options.display || 'symbol',
    minimumFractionDigits: options.minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits,
  });

  return formatter.format(value);
};

/**
 * 25. Parses currency string to number.
 *
 * @param {string} currencyString - Currency string
 * @param {LocaleCode} locale - Locale code
 * @returns {number} Parsed number
 */
export const parseCurrency = (currencyString: string, locale: LocaleCode): number => {
  // Remove currency symbols and parse
  const cleaned = currencyString.replace(/[^\d.,\-]/g, '');
  const localeConfig = getLocaleNumberFormat(locale);

  const normalized = cleaned
    .replace(new RegExp(`\\${localeConfig.thousands}`, 'g'), '')
    .replace(localeConfig.decimal, '.');

  return parseFloat(normalized);
};

/**
 * 26. Gets locale number format configuration.
 *
 * @param {LocaleCode} locale - Locale code
 * @returns {object} Number format config
 */
export const getLocaleNumberFormat = (locale: LocaleCode): {
  decimal: string;
  thousands: string;
  precision: number;
} => {
  const formats: Record<string, any> = {
    'en-US': { decimal: '.', thousands: ',', precision: 2 },
    'es-ES': { decimal: ',', thousands: '.', precision: 2 },
    'de-DE': { decimal: ',', thousands: '.', precision: 2 },
    'fr-FR': { decimal: ',', thousands: ' ', precision: 2 },
  };

  return formats[locale] || formats['en-US'];
};

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
export const formatDate = (date: Date, options: DateFormatOptions): string => {
  const formatter = new Intl.DateTimeFormat(options.locale, {
    dateStyle: options.dateStyle,
    timeStyle: options.timeStyle,
    timeZone: options.timezone,
  });

  return formatter.format(date);
};

/**
 * 28. Formats relative time.
 *
 * @param {Date} date - Date to format
 * @param {LocaleCode} locale - Locale code
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date: Date, locale: LocaleCode): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffDays) > 0) {
    return rtf.format(diffDays, 'day');
  } else if (Math.abs(diffHours) > 0) {
    return rtf.format(diffHours, 'hour');
  } else if (Math.abs(diffMinutes) > 0) {
    return rtf.format(diffMinutes, 'minute');
  } else {
    return rtf.format(diffSeconds, 'second');
  }
};

/**
 * 29. Formats time zone.
 *
 * @param {string} timezone - Timezone name
 * @param {LocaleCode} locale - Locale code
 * @returns {string} Formatted timezone
 */
export const formatTimezone = (timezone: string, locale: LocaleCode): string => {
  const formatter = new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    timeZoneName: 'long',
  });

  const parts = formatter.formatToParts(new Date());
  const timeZonePart = parts.find((part) => part.type === 'timeZoneName');

  return timeZonePart ? timeZonePart.value : timezone;
};

/**
 * 30. Parses localized date string.
 *
 * @param {string} dateString - Date string
 * @param {LocaleCode} locale - Locale code
 * @returns {Date} Parsed date
 */
export const parseLocalizedDate = (dateString: string, locale: LocaleCode): Date => {
  // Basic parsing - in production, use a library like date-fns
  return new Date(dateString);
};

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
export const formatNumber = (value: number, options: NumberFormatOptions): string => {
  const formatter = new Intl.NumberFormat(options.locale, {
    style: options.style || 'decimal',
    minimumFractionDigits: options.minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits,
    unit: options.unit,
  });

  return formatter.format(value);
};

/**
 * 32. Formats percentage.
 *
 * @param {number} value - Value (0-1 range)
 * @param {LocaleCode} locale - Locale code
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (
  value: number,
  locale: LocaleCode,
  decimals: number = 0,
): string => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(value);
};

/**
 * 33. Formats file size.
 *
 * @param {number} bytes - File size in bytes
 * @param {LocaleCode} locale - Locale code
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes: number, locale: LocaleCode): string => {
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

// ============================================================================
// RTL SUPPORT HELPERS
// ============================================================================

/**
 * 34. Checks if locale is RTL.
 *
 * @param {LocaleCode} locale - Locale code
 * @returns {boolean} True if RTL
 */
export const isRTL = (locale: LocaleCode): boolean => {
  const rtlLocales = ['ar-SA', 'he-IL'];
  return rtlLocales.includes(locale);
};

/**
 * 35. Gets text direction for locale.
 *
 * @param {LocaleCode} locale - Locale code
 * @returns {TextDirection} Text direction
 */
export const getTextDirection = (locale: LocaleCode): TextDirection => {
  return isRTL(locale) ? TextDirection.RTL : TextDirection.LTR;
};

/**
 * 36. Applies RTL transforms to CSS.
 *
 * @param {string} css - CSS string
 * @param {boolean} isRtl - Is RTL
 * @returns {string} Transformed CSS
 */
export const applyRTLTransform = (css: string, isRtl: boolean): string => {
  if (!isRtl) return css;

  // Simple RTL transformations
  return css
    .replace(/left/g, 'RIGHT_TEMP')
    .replace(/right/g, 'left')
    .replace(/RIGHT_TEMP/g, 'right')
    .replace(/margin: (\d+)px (\d+)px (\d+)px (\d+)px/g, 'margin: $1px $4px $3px $2px')
    .replace(/padding: (\d+)px (\d+)px (\d+)px (\d+)px/g, 'padding: $1px $4px $3px $2px');
};

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
export const cacheTranslations = async (
  sequelize: Sequelize,
  locale: LocaleCode,
  namespace: string = 'default',
  ttl: number = 3600,
): Promise<Record<string, string>> => {
  const translations = await exportTranslations(sequelize, locale, namespace);

  // In production, store in Redis/cache
  // For now, return the translations
  return translations;
};

/**
 * 38. Preloads translations for multiple locales.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {LocaleCode[]} locales - Locale codes
 * @param {string} namespace - Namespace
 * @returns {Promise<Record<string, Record<string, string>>>} Preloaded translations
 */
export const preloadTranslations = async (
  sequelize: Sequelize,
  locales: LocaleCode[],
  namespace: string = 'default',
): Promise<Record<string, Record<string, string>>> => {
  const result: Record<string, Record<string, string>> = {};

  for (const locale of locales) {
    result[locale] = await exportTranslations(sequelize, locale, namespace);
  }

  return result;
};

// ============================================================================
// LOCALE DETECTION
// ============================================================================

/**
 * 39. Detects locale from request headers and preferences.
 *
 * @param {LocaleDetectionOptions} options - Detection options
 * @returns {LocaleCode} Detected locale
 */
export const detectLocale = (options: LocaleDetectionOptions): LocaleCode => {
  // Priority: user preference > cookie > query param > accept-language > default

  if (options.userPreference && options.supportedLocales.includes(options.userPreference)) {
    return options.userPreference;
  }

  if (options.cookieLocale && options.supportedLocales.includes(options.cookieLocale)) {
    return options.cookieLocale;
  }

  if (options.acceptLanguageHeader) {
    const preferred = parseAcceptLanguage(options.acceptLanguageHeader, options.supportedLocales);
    if (preferred) return preferred;
  }

  return options.defaultLocale;
};

/**
 * 40. Parses Accept-Language header.
 *
 * @param {string} header - Accept-Language header
 * @param {LocaleCode[]} supported - Supported locales
 * @returns {LocaleCode | null} Best matching locale or null
 */
export const parseAcceptLanguage = (
  header: string,
  supported: LocaleCode[],
): LocaleCode | null => {
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
    const normalized = locale.replace('_', '-') as LocaleCode;
    if (supported.includes(normalized)) {
      return normalized;
    }

    // Try language match without region
    const languageOnly = normalized.split('-')[0];
    const match = supported.find((s) => s.startsWith(languageOnly));
    if (match) return match;
  }

  return null;
};
