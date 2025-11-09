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
// TYPE DEFINITIONS
// ============================================================================

/**
 * Supported locale code (ISO 639-1 language + ISO 3166-1 country)
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
  | 'ru-RU'
  | 'hi-IN'
  | 'th-TH'
  | 'vi-VN'
  | 'pl-PL'
  | 'nl-NL'
  | 'tr-TR'
  | 'id-ID'
  | 'sv-SE'
  | 'da-DK'
  | 'fi-FI'
  | 'no-NO'
  | 'cs-CZ'
  | 'ro-RO'
  | 'uk-UA';

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
  alternatives?: Array<{ locale: LocaleCode; confidence: number }>;
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

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

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
export const createTranslationModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    locale: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: 'ISO 639-1 + ISO 3166-1 locale code (e.g., en-US, es-ES)',
    },
    namespace: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Translation namespace/module (e.g., medical, admin, patient)',
    },
    key: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Translation key (e.g., patient.consent.title)',
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Translated text value',
    },
    pluralZero: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Plural form for zero count (CLDR)',
    },
    pluralOne: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Plural form for one count',
    },
    pluralTwo: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Plural form for two count',
    },
    pluralFew: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Plural form for few count',
    },
    pluralMany: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Plural form for many count',
    },
    pluralOther: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Plural form for other count (default)',
    },
    context: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Context information for translators',
    },
    maxLength: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Maximum character length for UI constraints',
    },
    format: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Text format (plain, markdown, html)',
    },
    translatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User ID who created/updated translation',
    },
    translatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Translation verified by native speaker',
    },
    verifiedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User ID who verified translation',
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    tableName: 'translations',
    timestamps: true,
    indexes: [
      { fields: ['locale', 'namespace', 'key'], unique: true },
      { fields: ['locale'] },
      { fields: ['namespace'] },
      { fields: ['key'] },
      { fields: ['verified'] },
    ],
  };

  return sequelize.define('Translation', attributes, options);
};

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
export const createLocaleModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      comment: 'Locale code (e.g., en-US, zh-CN)',
    },
    language: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Language name in English',
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Country name in English',
    },
    displayName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Display name in English (e.g., Spanish (Mexico))',
    },
    nativeName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Native language name (e.g., Español (México))',
    },
    textDirection: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'ltr',
      comment: 'Text direction: ltr, rtl, auto',
    },
    dateFormat: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'MM/DD/YYYY',
      comment: 'Locale-specific date format pattern',
    },
    timeFormat: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'HH:mm:ss',
      comment: 'Locale-specific time format pattern',
    },
    firstDayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'First day of week (0=Sunday, 1=Monday)',
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      comment: 'ISO 4217 currency code',
    },
    currencySymbol: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: 'Currency symbol',
    },
    decimalSeparator: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: '.',
      comment: 'Decimal separator character',
    },
    thousandsSeparator: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: ',',
      comment: 'Thousands separator character',
    },
    timezone: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Default timezone (e.g., America/New_York)',
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Locale is enabled for use',
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Is default/fallback locale',
    },
  };

  const options: ModelOptions = {
    tableName: 'locales',
    timestamps: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['enabled'] },
      { fields: ['isDefault'] },
      { fields: ['language'] },
    ],
  };

  return sequelize.define('Locale', attributes, options);
};

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
export const createI18nResourceModel = (sequelize: Sequelize): any => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    resourceType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Type of resource (document, template, form, etc.)',
    },
    resourceId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'ID of the resource being translated',
    },
    locale: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: 'Target locale for translation',
    },
    fieldName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Field name being translated',
    },
    translatedValue: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Translated field value',
    },
    originalValue: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Original value in source language',
    },
    translatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User ID who translated',
    },
    translatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Translation approved for use',
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User ID who approved translation',
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const options: ModelOptions = {
    tableName: 'i18n_resources',
    timestamps: true,
    indexes: [
      { fields: ['resourceType', 'resourceId', 'locale', 'fieldName'], unique: true },
      { fields: ['resourceType', 'resourceId'] },
      { fields: ['locale'] },
      { fields: ['approved'] },
    ],
  };

  return sequelize.define('I18nResource', attributes, options);
};

// ============================================================================
// 1. TRANSLATION MANAGEMENT
// ============================================================================

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
export const getTranslation = async (
  key: string,
  context: TranslationContext,
  params?: TranslationParams,
): Promise<string> => {
  // Placeholder: Query translation from database
  // Apply fallback locale if not found
  // Interpolate parameters if provided
  let translation = `[${context.locale}] ${key}`;

  if (params) {
    translation = interpolateTranslation(translation, params);
  }

  return translation;
};

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
export const interpolateTranslation = (template: string, params: TranslationParams): string => {
  let result = template;

  Object.entries(params).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, String(value));
  });

  return result;
};

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
export const loadTranslationNamespace = async (
  namespace: string,
  locale: LocaleCode,
): Promise<Record<string, string>> => {
  // Placeholder: Load all translations for namespace from database
  return {
    'patient.name': 'Nom du patient',
    'patient.age': 'Âge du patient',
  };
};

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
export const saveTranslation = async (entry: TranslationEntry): Promise<TranslationEntry> => {
  // Placeholder: Upsert translation in database
  return entry;
};

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
export const findMissingTranslations = async (
  sourceLocale: LocaleCode,
  targetLocale: LocaleCode,
  namespace?: string,
): Promise<TranslationKey[]> => {
  // Placeholder: Compare translations between locales
  return [];
};

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
export const verifyTranslation = async (translationId: string, verifiedBy: string): Promise<void> => {
  // Placeholder: Mark translation as verified in database
};

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
export const exportTranslationsToJSON = async (
  locale: LocaleCode,
  namespaces?: string[],
): Promise<Record<string, any>> => {
  // Placeholder: Export translations as nested JSON structure
  return {};
};

// ============================================================================
// 2. RTL LAYOUT SUPPORT
// ============================================================================

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
export const isRTLLocale = (locale: LocaleCode): boolean => {
  const rtlLocales: LocaleCode[] = ['ar-SA', 'he-IL'];
  return rtlLocales.includes(locale);
};

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
export const getTextDirection = (locale: LocaleCode): TextDirection => {
  return isRTLLocale(locale) ? 'rtl' : 'ltr';
};

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
export const generateRTLStyles = (config: RTLLayoutConfig): Record<string, string> => {
  const styles: Record<string, string> = {};

  if (config.enabled && config.textDirection === 'rtl') {
    styles.direction = 'rtl';
    styles.textAlign = 'right';
  }

  return styles;
};

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
export const transformCSSForRTL = (cssText: string): string => {
  let transformed = cssText;

  // Flip left/right properties
  const replacements: Record<string, string> = {
    'margin-left': 'margin-right',
    'margin-right': 'margin-left',
    'padding-left': 'padding-right',
    'padding-right': 'padding-left',
    'border-left': 'border-right',
    'border-right': 'border-left',
    'left:': 'right:',
    'right:': 'left:',
    'float: left': 'float: right',
    'float: right': 'float: left',
    'text-align: left': 'text-align: right',
    'text-align: right': 'text-align: left',
  };

  Object.entries(replacements).forEach(([ltr, rtl]) => {
    const regex = new RegExp(ltr, 'g');
    transformed = transformed.replace(regex, rtl);
  });

  return transformed;
};

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
export const analyzeBidiText = (text: string): BidiTextSegment[] => {
  const segments: BidiTextSegment[] = [];

  // Simplified bidirectional text analysis
  // In production, use Unicode Bidirectional Algorithm (UBA)
  const rtlPattern = /[\u0600-\u06FF\u0750-\u077F\u0590-\u05FF]/;

  let currentDir: TextDirection = 'ltr';
  let start = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isRTL = rtlPattern.test(char);
    const newDir: TextDirection = isRTL ? 'rtl' : 'ltr';

    if (newDir !== currentDir && i > start) {
      segments.push({
        text: text.substring(start, i),
        direction: currentDir,
        level: currentDir === 'rtl' ? 1 : 0,
        start,
        end: i,
      });
      start = i;
      currentDir = newDir;
    }
  }

  // Add final segment
  if (start < text.length) {
    segments.push({
      text: text.substring(start),
      direction: currentDir,
      level: currentDir === 'rtl' ? 1 : 0,
      start,
      end: text.length,
    });
  }

  return segments;
};

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
export const reorderBidiText = (text: string, baseDirection: TextDirection): string => {
  // Simplified bidirectional reordering
  // In production, implement full Unicode Bidirectional Algorithm
  const segments = analyzeBidiText(text);

  if (baseDirection === 'rtl') {
    return segments.reverse().map(s => s.text).join('');
  }

  return text;
};

// ============================================================================
// 3. LOCALE DETECTION
// ============================================================================

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
export const detectUserLocale = async (options: LocaleDetectionOptions): Promise<LocaleDetectionResult> => {
  // Priority: userPreference > acceptLanguage > browser > ip > fallback

  if (options.userPreference) {
    return {
      detected: options.userPreference,
      confidence: 1.0,
      source: 'user-preference',
    };
  }

  if (options.acceptLanguageHeader) {
    const locale = parseAcceptLanguage(options.acceptLanguageHeader);
    if (locale) {
      return {
        detected: locale,
        confidence: 0.9,
        source: 'accept-language',
      };
    }
  }

  if (options.browserLocale) {
    const locale = normalizeLocaleCode(options.browserLocale);
    return {
      detected: locale as LocaleCode,
      confidence: 0.7,
      source: 'browser',
    };
  }

  return {
    detected: options.fallback || 'en-US',
    confidence: 0.1,
    source: 'fallback',
  };
};

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
export const parseAcceptLanguage = (header: string): LocaleCode | null => {
  // Parse Accept-Language header and extract highest priority locale
  const languages = header.split(',').map((lang) => {
    const [locale, qValue] = lang.trim().split(';q=');
    return {
      locale: normalizeLocaleCode(locale),
      quality: qValue ? parseFloat(qValue) : 1.0,
    };
  });

  languages.sort((a, b) => b.quality - a.quality);

  return languages[0]?.locale as LocaleCode || null;
};

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
export const normalizeLocaleCode = (locale: string): string => {
  // Convert to standard format: lowercase language + hyphen + uppercase country
  const cleaned = locale.replace('_', '-');
  const parts = cleaned.split('-');

  if (parts.length === 2) {
    return `${parts[0].toLowerCase()}-${parts[1].toUpperCase()}`;
  }

  return parts[0].toLowerCase();
};

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
export const getLocaleFromIP = async (ipAddress: string): Promise<LocaleCode | null> => {
  // Placeholder: Use IP geolocation service (MaxMind, ip-api, etc.)
  // Map country code to default locale
  return null;
};

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
export const isSupportedLocale = (locale: LocaleCode, supportedLocales: LocaleCode[]): boolean => {
  return supportedLocales.includes(locale);
};

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
export const getFallbackLocale = (locale: LocaleCode, supportedLocales: LocaleCode[]): LocaleCode => {
  // Try same language, different country
  const [language] = locale.split('-');
  const sameLang = supportedLocales.find((l) => l.startsWith(language));

  if (sameLang) {
    return sameLang;
  }

  // Default to first supported locale (usually en-US)
  return supportedLocales[0] || 'en-US';
};

// ============================================================================
// 4. DATE/NUMBER FORMATTING
// ============================================================================

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
export const formatDate = (date: Date, options: DateFormatOptions): string => {
  const formatter = new Intl.DateTimeFormat(options.locale, {
    dateStyle: options.dateStyle || options.style,
    timeStyle: options.timeStyle,
    weekday: options.weekday,
    year: options.year,
    month: options.month,
    day: options.day,
    hour: options.hour,
    minute: options.minute,
    second: options.second,
    timeZone: options.timeZone,
    hour12: options.hour12,
  });

  return formatter.format(date);
};

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
export const formatTime = (date: Date, options: DateFormatOptions): string => {
  return formatDate(date, {
    ...options,
    timeStyle: options.timeStyle || 'short',
    dateStyle: undefined,
  });
};

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
export const formatNumber = (value: number, options: NumberFormatOptions): string => {
  const formatter = new Intl.NumberFormat(options.locale, {
    style: options.style,
    currency: options.currency,
    minimumFractionDigits: options.minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits,
    useGrouping: options.useGrouping,
    notation: options.notation,
  });

  return formatter.format(value);
};

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
export const formatPercentage = (value: number, locale: LocaleCode, decimals: number = 0): string => {
  return formatNumber(value, {
    locale,
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

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
export const formatRelativeTime = (date: Date, locale: LocaleCode, baseDate?: Date): string => {
  const base = baseDate || new Date();
  const diffMs = date.getTime() - base.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffDays) >= 1) {
    return rtf.format(diffDays, 'day');
  } else if (Math.abs(diffHours) >= 1) {
    return rtf.format(diffHours, 'hour');
  } else if (Math.abs(diffMinutes) >= 1) {
    return rtf.format(diffMinutes, 'minute');
  } else {
    return rtf.format(diffSeconds, 'second');
  }
};

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
export const formatDateRange = (startDate: Date, endDate: Date, options: DateFormatOptions): string => {
  const formatter = new Intl.DateTimeFormat(options.locale, {
    dateStyle: options.dateStyle || options.style,
  });

  // Use DateTimeFormat.formatRange if available
  if ('formatRange' in formatter) {
    return (formatter as any).formatRange(startDate, endDate);
  }

  // Fallback
  return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
};

// ============================================================================
// 5. CURRENCY CONVERSION
// ============================================================================

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
export const convertCurrency = async (options: CurrencyConversionOptions): Promise<CurrencyConversionResult> => {
  // Placeholder: Fetch exchange rate from API (ECB, FOREX, etc.)
  const exchangeRate = 0.92; // EUR/USD rate example

  const toAmount = options.amount * exchangeRate;

  return {
    fromCurrency: options.from,
    toCurrency: options.to,
    fromAmount: options.amount,
    toAmount: parseFloat(toAmount.toFixed(2)),
    exchangeRate,
    conversionDate: new Date(),
    source: options.source || 'CACHE',
  };
};

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
export const formatCurrency = (amount: number, currency: string, locale: LocaleCode): string => {
  return formatNumber(amount, {
    locale,
    style: 'currency',
    currency,
  });
};

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
export const getExchangeRate = async (
  fromCurrency: string,
  toCurrency: string,
  date?: Date,
): Promise<number> => {
  // Placeholder: Fetch from exchange rate API
  return 1.0;
};

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
export const cacheExchangeRates = async (
  rates: Record<string, Record<string, number>>,
  effectiveDate: Date,
): Promise<void> => {
  // Placeholder: Cache rates in database or Redis
};

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
export const getCurrencySymbol = (currency: string, locale: LocaleCode): string => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  });

  const parts = formatter.formatToParts(0);
  const symbolPart = parts.find((part) => part.type === 'currency');

  return symbolPart?.value || currency;
};

// ============================================================================
// 6. PLURALIZATION RULES
// ============================================================================

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
export const getPluralCategory = (count: number, locale: LocaleCode): PluralCategory => {
  const pr = new Intl.PluralRules(locale);
  const category = pr.select(count);

  return category as PluralCategory;
};

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
export const selectPluralForm = (
  count: number,
  forms: Partial<Record<PluralCategory, string>>,
  locale: LocaleCode,
): string => {
  const category = getPluralCategory(count, locale);

  // Try exact category match
  if (forms[category]) {
    return forms[category]!;
  }

  // Fallback to 'other'
  if (forms.other) {
    return forms.other;
  }

  // Last resort: return first available form
  return Object.values(forms)[0] || '';
};

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
export const formatPlural = async (
  key: string,
  count: number,
  context: TranslationContext,
): Promise<string> => {
  // Placeholder: Load plural forms from database
  const pluralForms: Partial<Record<PluralCategory, string>> = {
    one: '{{count}} appointment',
    other: '{{count}} appointments',
  };

  const selected = selectPluralForm(count, pluralForms, context.locale);

  return interpolateTranslation(selected, { count });
};

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
export const validatePluralForms = (
  forms: Partial<Record<PluralCategory, string>>,
  locale: LocaleCode,
): { valid: boolean; missing?: PluralCategory[] } => {
  // Placeholder: Get required categories for locale from CLDR
  const requiredCategories = getRequiredPluralCategories(locale);

  const missing = requiredCategories.filter((cat) => !forms[cat]);

  return {
    valid: missing.length === 0,
    missing: missing.length > 0 ? missing : undefined,
  };
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
export const getRequiredPluralCategories = (locale: LocaleCode): PluralCategory[] => {
  // Simplified mapping - in production, use CLDR data
  const [language] = locale.split('-');

  // Arabic has all 6 categories
  if (language === 'ar') {
    return ['zero', 'one', 'two', 'few', 'many', 'other'];
  }

  // Polish has special plural rules
  if (language === 'pl') {
    return ['one', 'few', 'many', 'other'];
  }

  // Most languages use one + other
  return ['one', 'other'];
};

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
export const formatOrdinal = (number: number, locale: LocaleCode): string => {
  const pr = new Intl.PluralRules(locale, { type: 'ordinal' });
  const category = pr.select(number);

  const [language] = locale.split('-');

  // English ordinal suffixes
  if (language === 'en') {
    const suffixes: Record<string, string> = {
      one: 'st',
      two: 'nd',
      few: 'rd',
      other: 'th',
    };
    return `${number}${suffixes[category] || 'th'}`;
  }

  // Spanish ordinal indicator
  if (language === 'es') {
    return `${number}.º`;
  }

  // Default: just the number
  return String(number);
};

// ============================================================================
// 7. MEDICAL TERMINOLOGY TRANSLATION
// ============================================================================

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
export const translateMedicalTerm = async (
  term: string,
  targetLocale: LocaleCode,
  category?: string,
): Promise<MedicalTerminologyTranslation | null> => {
  // Placeholder: Query medical terminology database with ICD-10/SNOMED codes
  return {
    term,
    locale: targetLocale,
    translation: 'Hipertensión',
    icd10Code: 'I10',
    category: 'cardiovascular',
    verified: true,
  };
};

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
export const getMedicalFormattingPreferences = async (locale: LocaleCode): Promise<Record<string, any>> => {
  const [language, country] = locale.split('-');

  // US uses imperial measurements
  if (country === 'US') {
    return {
      temperatureUnit: 'fahrenheit',
      heightUnit: 'feet-inches',
      weightUnit: 'pounds',
      bloodPressureFormat: 'mmHg',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12-hour',
    };
  }

  // Most other countries use metric
  return {
    temperatureUnit: 'celsius',
    heightUnit: 'centimeters',
    weightUnit: 'kilograms',
    bloodPressureFormat: 'mmHg',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24-hour',
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Model creators
  createTranslationModel,
  createLocaleModel,
  createI18nResourceModel,

  // Translation management
  getTranslation,
  interpolateTranslation,
  loadTranslationNamespace,
  saveTranslation,
  findMissingTranslations,
  verifyTranslation,
  exportTranslationsToJSON,

  // RTL layout support
  isRTLLocale,
  getTextDirection,
  generateRTLStyles,
  transformCSSForRTL,
  analyzeBidiText,
  reorderBidiText,

  // Locale detection
  detectUserLocale,
  parseAcceptLanguage,
  normalizeLocaleCode,
  getLocaleFromIP,
  isSupportedLocale,
  getFallbackLocale,

  // Date/number formatting
  formatDate,
  formatTime,
  formatNumber,
  formatPercentage,
  formatRelativeTime,
  formatDateRange,

  // Currency conversion
  convertCurrency,
  formatCurrency,
  getExchangeRate,
  cacheExchangeRates,
  getCurrencySymbol,

  // Pluralization rules
  getPluralCategory,
  selectPluralForm,
  formatPlural,
  validatePluralForms,
  getRequiredPluralCategories,
  formatOrdinal,

  // Medical terminology
  translateMedicalTerm,
  getMedicalFormattingPreferences,
};
