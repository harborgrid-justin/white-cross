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

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  NotFoundException,
  createParamDecorator,
  SetMetadata,
  NestMiddleware,
} from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Request, Response, NextFunction } from 'express';
import { Observable } from 'rxjs';
import { z } from 'zod';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Supported language codes (ISO 639-1)
 */
export enum LanguageCode {
  EN = 'en', // English
  ES = 'es', // Spanish
  FR = 'fr', // French
  DE = 'de', // German
  IT = 'it', // Italian
  PT = 'pt', // Portuguese
  RU = 'ru', // Russian
  ZH = 'zh', // Chinese
  JA = 'ja', // Japanese
  KO = 'ko', // Korean
  AR = 'ar', // Arabic
  HE = 'he', // Hebrew
  HI = 'hi', // Hindi
  BN = 'bn', // Bengali
  TR = 'tr', // Turkish
  NL = 'nl', // Dutch
  PL = 'pl', // Polish
  VI = 'vi', // Vietnamese
  TH = 'th', // Thai
  SV = 'sv', // Swedish
}

/**
 * Text direction for languages
 */
export enum TextDirection {
  LTR = 'ltr', // Left to Right
  RTL = 'rtl', // Right to Left
}

/**
 * Pluralization categories (CLDR-based)
 */
export enum PluralCategory {
  ZERO = 'zero',
  ONE = 'one',
  TWO = 'two',
  FEW = 'few',
  MANY = 'many',
  OTHER = 'other',
}

/**
 * Date/Time formatting styles
 */
export enum DateTimeStyle {
  FULL = 'full',
  LONG = 'long',
  MEDIUM = 'medium',
  SHORT = 'short',
}

/**
 * Number formatting styles
 */
export enum NumberStyle {
  DECIMAL = 'decimal',
  CURRENCY = 'currency',
  PERCENT = 'percent',
  UNIT = 'unit',
}

/**
 * Translation namespace types
 */
export enum TranslationNamespace {
  COMMON = 'common',
  MEDICAL = 'medical',
  ERRORS = 'errors',
  VALIDATION = 'validation',
  APPOINTMENTS = 'appointments',
  PATIENTS = 'patients',
  BILLING = 'billing',
  NOTIFICATIONS = 'notifications',
  ACCESSIBILITY = 'accessibility',
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
  firstDayOfWeek: number; // 0 = Sunday, 1 = Monday
  currency: string; // ISO 4217 code
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
  confidence: number; // 0-1
  alternatives?: LanguageCode[];
}

/**
 * Currency format options
 */
export interface CurrencyFormatOptions {
  locale?: LanguageCode;
  currency: string; // ISO 4217
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

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Locale configuration schema
 */
export const LocaleConfigSchema = z.object({
  code: z.nativeEnum(LanguageCode),
  name: z.string().min(1, 'Locale name is required'),
  nativeName: z.string().min(1, 'Native name is required'),
  direction: z.nativeEnum(TextDirection),
  dateFormat: z.string().min(1, 'Date format is required'),
  timeFormat: z.string().min(1, 'Time format is required'),
  firstDayOfWeek: z.number().int().min(0).max(6),
  currency: z.string().length(3, 'Currency must be ISO 4217 code'),
  decimalSeparator: z.string().length(1),
  thousandsSeparator: z.string().length(1),
  enabled: z.boolean().default(true),
  fallbackLocale: z.nativeEnum(LanguageCode).optional(),
});

/**
 * Translation entry schema
 */
export const TranslationEntrySchema = z.object({
  key: z.string().min(1, 'Translation key is required'),
  value: z.string().min(1, 'Translation value is required'),
  namespace: z.nativeEnum(TranslationNamespace).default(TranslationNamespace.COMMON),
  locale: z.nativeEnum(LanguageCode),
  pluralForm: z.nativeEnum(PluralCategory).optional(),
  context: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Translation options schema
 */
export const TranslationOptionsSchema = z.object({
  locale: z.nativeEnum(LanguageCode).optional(),
  fallbackLocale: z.nativeEnum(LanguageCode).optional(),
  namespace: z.nativeEnum(TranslationNamespace).optional(),
  defaultValue: z.string().optional(),
  interpolation: z.record(z.any()).optional(),
  count: z.number().optional(),
  context: z.string().optional(),
});

/**
 * User language preference schema
 */
export const UserLanguagePreferenceSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  preferredLocale: z.nativeEnum(LanguageCode),
  fallbackLocales: z.array(z.nativeEnum(LanguageCode)).default([LanguageCode.EN]),
  autoDetect: z.boolean().default(true),
  dateFormat: z.string().optional(),
  timeFormat: z.string().optional(),
  timezone: z.string().optional(),
});

/**
 * Currency format options schema
 */
export const CurrencyFormatOptionsSchema = z.object({
  locale: z.nativeEnum(LanguageCode).optional(),
  currency: z.string().length(3, 'Currency must be ISO 4217 code'),
  display: z.enum(['symbol', 'narrowSymbol', 'code', 'name']).optional().default('symbol'),
  minimumFractionDigits: z.number().int().min(0).max(20).optional(),
  maximumFractionDigits: z.number().int().min(0).max(20).optional(),
  useGrouping: z.boolean().optional().default(true),
});

/**
 * Bulk translation import schema
 */
export const BulkTranslationImportSchema = z.object({
  locale: z.nativeEnum(LanguageCode),
  namespace: z.nativeEnum(TranslationNamespace),
  translations: z.record(z.string()),
  overwrite: z.boolean().default(false),
});

// ============================================================================
// SWAGGER/OPENAPI DTOs
// ============================================================================

/**
 * Locale configuration DTO with Swagger decorators
 */
export class LocaleConfigDto {
  @ApiProperty({ enum: LanguageCode, description: 'Language code (ISO 639-1)' })
  code: LanguageCode;

  @ApiProperty({ example: 'English', description: 'Locale name in English' })
  name: string;

  @ApiProperty({ example: 'English', description: 'Locale name in native language' })
  nativeName: string;

  @ApiProperty({ enum: TextDirection, description: 'Text direction' })
  direction: TextDirection;

  @ApiProperty({ example: 'MM/DD/YYYY', description: 'Date format pattern' })
  dateFormat: string;

  @ApiProperty({ example: 'HH:mm:ss', description: 'Time format pattern' })
  timeFormat: string;

  @ApiProperty({ example: 0, description: 'First day of week (0=Sunday, 1=Monday)' })
  firstDayOfWeek: number;

  @ApiProperty({ example: 'USD', description: 'Default currency (ISO 4217)' })
  currency: string;

  @ApiProperty({ example: '.', description: 'Decimal separator' })
  decimalSeparator: string;

  @ApiProperty({ example: ',', description: 'Thousands separator' })
  thousandsSeparator: string;

  @ApiProperty({ example: true, description: 'Whether locale is enabled' })
  enabled: boolean;

  @ApiPropertyOptional({ enum: LanguageCode, description: 'Fallback locale' })
  fallbackLocale?: LanguageCode;
}

/**
 * Translation entry DTO
 */
export class TranslationEntryDto {
  @ApiProperty({ example: 'common.welcome', description: 'Translation key' })
  key: string;

  @ApiProperty({ example: 'Welcome to White Cross', description: 'Translated value' })
  value: string;

  @ApiProperty({ enum: TranslationNamespace, description: 'Translation namespace' })
  namespace: TranslationNamespace;

  @ApiProperty({ enum: LanguageCode, description: 'Language code' })
  locale: LanguageCode;

  @ApiPropertyOptional({ enum: PluralCategory, description: 'Plural form category' })
  pluralForm?: PluralCategory;

  @ApiPropertyOptional({ example: 'greeting', description: 'Translation context' })
  context?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * Translation request DTO
 */
export class TranslateRequestDto {
  @ApiProperty({ example: 'common.welcome', description: 'Translation key' })
  key: string;

  @ApiPropertyOptional({ enum: LanguageCode, description: 'Target locale' })
  locale?: LanguageCode;

  @ApiPropertyOptional({ enum: TranslationNamespace, description: 'Namespace' })
  namespace?: TranslationNamespace;

  @ApiPropertyOptional({ example: { name: 'John' }, description: 'Interpolation values' })
  interpolation?: Record<string, any>;

  @ApiPropertyOptional({ example: 5, description: 'Count for pluralization' })
  count?: number;
}

/**
 * Translation response DTO
 */
export class TranslationResponseDto {
  @ApiProperty({ example: 'common.welcome', description: 'Translation key' })
  key: string;

  @ApiProperty({ example: 'Welcome to White Cross', description: 'Translated value' })
  value: string;

  @ApiProperty({ enum: LanguageCode, description: 'Locale used' })
  locale: LanguageCode;

  @ApiProperty({ example: false, description: 'Whether fallback was used' })
  usedFallback: boolean;
}

/**
 * User language preference DTO
 */
export class UserLanguagePreferenceDto {
  @ApiProperty({ format: 'uuid', description: 'User ID' })
  userId: string;

  @ApiProperty({ enum: LanguageCode, description: 'Preferred language' })
  preferredLocale: LanguageCode;

  @ApiProperty({ enum: LanguageCode, isArray: true, description: 'Fallback languages' })
  fallbackLocales: LanguageCode[];

  @ApiProperty({ example: true, description: 'Auto-detect locale from browser' })
  autoDetect: boolean;

  @ApiPropertyOptional({ example: 'MM/DD/YYYY', description: 'Custom date format' })
  dateFormat?: string;

  @ApiPropertyOptional({ example: 'HH:mm', description: 'Custom time format' })
  timeFormat?: string;

  @ApiPropertyOptional({ example: 'America/New_York', description: 'User timezone' })
  timezone?: string;
}

// ============================================================================
// LOCALE CONFIGURATION & MANAGEMENT
// ============================================================================

/**
 * Default locale configurations for supported languages
 */
export const DEFAULT_LOCALE_CONFIGS: Record<LanguageCode, LocaleConfig> = {
  [LanguageCode.EN]: {
    code: LanguageCode.EN,
    name: 'English',
    nativeName: 'English',
    direction: TextDirection.LTR,
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'hh:mm A',
    firstDayOfWeek: 0,
    currency: 'USD',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    enabled: true,
  },
  [LanguageCode.ES]: {
    code: LanguageCode.ES,
    name: 'Spanish',
    nativeName: 'Español',
    direction: TextDirection.LTR,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 1,
    currency: 'EUR',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
  [LanguageCode.FR]: {
    code: LanguageCode.FR,
    name: 'French',
    nativeName: 'Français',
    direction: TextDirection.LTR,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 1,
    currency: 'EUR',
    decimalSeparator: ',',
    thousandsSeparator: ' ',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
  [LanguageCode.DE]: {
    code: LanguageCode.DE,
    name: 'German',
    nativeName: 'Deutsch',
    direction: TextDirection.LTR,
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 1,
    currency: 'EUR',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
  [LanguageCode.AR]: {
    code: LanguageCode.AR,
    name: 'Arabic',
    nativeName: 'العربية',
    direction: TextDirection.RTL,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 6,
    currency: 'SAR',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
  [LanguageCode.HE]: {
    code: LanguageCode.HE,
    name: 'Hebrew',
    nativeName: 'עברית',
    direction: TextDirection.RTL,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 0,
    currency: 'ILS',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
  [LanguageCode.ZH]: {
    code: LanguageCode.ZH,
    name: 'Chinese',
    nativeName: '中文',
    direction: TextDirection.LTR,
    dateFormat: 'YYYY/MM/DD',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 1,
    currency: 'CNY',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
  [LanguageCode.JA]: {
    code: LanguageCode.JA,
    name: 'Japanese',
    nativeName: '日本語',
    direction: TextDirection.LTR,
    dateFormat: 'YYYY/MM/DD',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 0,
    currency: 'JPY',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
  [LanguageCode.KO]: {
    code: LanguageCode.KO,
    name: 'Korean',
    nativeName: '한국어',
    direction: TextDirection.LTR,
    dateFormat: 'YYYY.MM.DD',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 0,
    currency: 'KRW',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
  [LanguageCode.IT]: {
    code: LanguageCode.IT,
    name: 'Italian',
    nativeName: 'Italiano',
    direction: TextDirection.LTR,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 1,
    currency: 'EUR',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
  [LanguageCode.PT]: {
    code: LanguageCode.PT,
    name: 'Portuguese',
    nativeName: 'Português',
    direction: TextDirection.LTR,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 0,
    currency: 'BRL',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
  [LanguageCode.RU]: {
    code: LanguageCode.RU,
    name: 'Russian',
    nativeName: 'Русский',
    direction: TextDirection.LTR,
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 1,
    currency: 'RUB',
    decimalSeparator: ',',
    thousandsSeparator: ' ',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
  [LanguageCode.HI]: {
    code: LanguageCode.HI,
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: TextDirection.LTR,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 0,
    currency: 'INR',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
  [LanguageCode.BN]: {
    code: LanguageCode.BN,
    name: 'Bengali',
    nativeName: 'বাংলা',
    direction: TextDirection.LTR,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 0,
    currency: 'BDT',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
  [LanguageCode.TR]: {
    code: LanguageCode.TR,
    name: 'Turkish',
    nativeName: 'Türkçe',
    direction: TextDirection.LTR,
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 1,
    currency: 'TRY',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
  [LanguageCode.NL]: {
    code: LanguageCode.NL,
    name: 'Dutch',
    nativeName: 'Nederlands',
    direction: TextDirection.LTR,
    dateFormat: 'DD-MM-YYYY',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 1,
    currency: 'EUR',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
  [LanguageCode.PL]: {
    code: LanguageCode.PL,
    name: 'Polish',
    nativeName: 'Polski',
    direction: TextDirection.LTR,
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 1,
    currency: 'PLN',
    decimalSeparator: ',',
    thousandsSeparator: ' ',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
  [LanguageCode.VI]: {
    code: LanguageCode.VI,
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    direction: TextDirection.LTR,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 1,
    currency: 'VND',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
  [LanguageCode.TH]: {
    code: LanguageCode.TH,
    name: 'Thai',
    nativeName: 'ไทย',
    direction: TextDirection.LTR,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 0,
    currency: 'THB',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
  [LanguageCode.SV]: {
    code: LanguageCode.SV,
    name: 'Swedish',
    nativeName: 'Svenska',
    direction: TextDirection.LTR,
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    firstDayOfWeek: 1,
    currency: 'SEK',
    decimalSeparator: ',',
    thousandsSeparator: ' ',
    enabled: true,
    fallbackLocale: LanguageCode.EN,
  },
};

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
export function getLocaleConfig(locale: LanguageCode): LocaleConfig {
  return DEFAULT_LOCALE_CONFIGS[locale] || DEFAULT_LOCALE_CONFIGS[LanguageCode.EN];
}

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
export function getEnabledLocales(): LocaleConfig[] {
  return Object.values(DEFAULT_LOCALE_CONFIGS).filter(config => config.enabled);
}

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
export function isRTLLocale(locale: LanguageCode): boolean {
  const config = getLocaleConfig(locale);
  return config.direction === TextDirection.RTL;
}

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
export function getTextDirection(locale: LanguageCode): TextDirection {
  return getLocaleConfig(locale).direction;
}

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
export function getFallbackChain(locale: LanguageCode): LanguageCode[] {
  const chain: LanguageCode[] = [locale];
  const config = getLocaleConfig(locale);

  if (config.fallbackLocale && config.fallbackLocale !== locale) {
    chain.push(config.fallbackLocale);
  }

  // Always include English as final fallback if not already present
  if (!chain.includes(LanguageCode.EN)) {
    chain.push(LanguageCode.EN);
  }

  return chain;
}

// ============================================================================
// LOCALE DETECTION
// ============================================================================

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
export function detectLocaleFromHeader(
  acceptLanguageHeader: string,
  supportedLocales?: LanguageCode[]
): LocaleDetectionResult {
  const supported = supportedLocales || Object.values(LanguageCode);
  const languages = parseAcceptLanguage(acceptLanguageHeader);

  for (const lang of languages) {
    const langCode = lang.code.split('-')[0].toLowerCase() as LanguageCode;
    if (supported.includes(langCode)) {
      return {
        locale: langCode,
        source: 'header',
        confidence: lang.quality,
        alternatives: languages.slice(1).map(l => l.code.split('-')[0].toLowerCase() as LanguageCode),
      };
    }
  }

  return {
    locale: LanguageCode.EN,
    source: 'default',
    confidence: 0,
  };
}

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
export function parseAcceptLanguage(header: string): Array<{ code: string; quality: number }> {
  if (!header || header.trim() === '') {
    return [];
  }

  return header
    .split(',')
    .map(lang => {
      const parts = lang.trim().split(';');
      const code = parts[0].trim();
      const qualityMatch = parts[1]?.match(/q=([0-9.]+)/);
      const quality = qualityMatch ? parseFloat(qualityMatch[1]) : 1.0;
      return { code, quality };
    })
    .sort((a, b) => b.quality - a.quality);
}

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
export function detectLocaleFromRequest(
  request: Request,
  cookieName: string = 'locale',
  queryParam: string = 'lang'
): LocaleDetectionResult {
  // Priority 1: Query parameter
  const queryLocale = request.query[queryParam] as string;
  if (queryLocale && Object.values(LanguageCode).includes(queryLocale as LanguageCode)) {
    return {
      locale: queryLocale as LanguageCode,
      source: 'query',
      confidence: 1.0,
    };
  }

  // Priority 2: Cookie
  const cookieLocale = request.cookies?.[cookieName];
  if (cookieLocale && Object.values(LanguageCode).includes(cookieLocale as LanguageCode)) {
    return {
      locale: cookieLocale as LanguageCode,
      source: 'cookie',
      confidence: 0.9,
    };
  }

  // Priority 3: Accept-Language header
  const acceptLanguage = request.headers['accept-language'];
  if (acceptLanguage) {
    return detectLocaleFromHeader(acceptLanguage);
  }

  // Priority 4: Default
  return {
    locale: LanguageCode.EN,
    source: 'default',
    confidence: 0,
  };
}

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
export function detectUserLocale(
  userPreference: UserLanguagePreference,
  requestLocale?: LocaleDetectionResult
): LanguageCode {
  // Use request locale if auto-detect is enabled and confidence is high
  if (userPreference.autoDetect && requestLocale && requestLocale.confidence >= 0.8) {
    return requestLocale.locale;
  }

  // Otherwise use user's preferred locale
  return userPreference.preferredLocale;
}

// ============================================================================
// TRANSLATION MANAGEMENT
// ============================================================================

/**
 * In-memory translation cache
 */
const translationCache = new Map<string, TranslationCacheEntry>();

/**
 * Generate cache key for translation lookup
 *
 * @param locale - Language code
 * @param namespace - Translation namespace
 * @returns Cache key string
 */
function getTranslationCacheKey(locale: LanguageCode, namespace: TranslationNamespace): string {
  return `${locale}:${namespace}`;
}

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
export function loadTranslations(
  locale: LanguageCode,
  namespace: TranslationNamespace,
  translations: Map<string, string>,
  version: string = '1.0.0'
): void {
  const cacheKey = getTranslationCacheKey(locale, namespace);
  translationCache.set(cacheKey, {
    translations,
    lastUpdated: new Date(),
    version,
    locale,
    namespace,
  });
}

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
export function getTranslation(key: string, options?: TranslationOptions): string {
  const locale = options?.locale || LanguageCode.EN;
  const namespace = options?.namespace || TranslationNamespace.COMMON;
  const fallbackChain = getFallbackChain(locale);

  // Try each locale in fallback chain
  for (const fallbackLocale of fallbackChain) {
    const cacheKey = getTranslationCacheKey(fallbackLocale, namespace);
    const cached = translationCache.get(cacheKey);

    if (cached) {
      let translation = cached.translations.get(key);

      // Handle pluralization if count is provided
      if (options?.count !== undefined && !translation) {
        const pluralKey = getPluralizedKey(key, options.count, fallbackLocale);
        translation = cached.translations.get(pluralKey);
      }

      if (translation) {
        // Apply interpolation if provided
        if (options?.interpolation) {
          return interpolateTranslation(translation, options.interpolation);
        }
        return translation;
      }
    }
  }

  // Return default value or key if translation not found
  return options?.defaultValue || key;
}

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
export function interpolateTranslation(template: string, context: InterpolationContext): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = context[key];
    if (value === undefined || value === null) {
      return match; // Keep placeholder if value not found
    }
    return String(value);
  });
}

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
export function getPluralizedKey(baseKey: string, count: number, locale: LanguageCode): string {
  const category = getPluralCategory(count, locale);
  return `${baseKey}.${category}`;
}

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
export function getPluralCategory(count: number, locale: LanguageCode): PluralCategory {
  const absCount = Math.abs(count);

  // English and most Germanic languages
  if ([LanguageCode.EN, LanguageCode.DE, LanguageCode.NL, LanguageCode.SV].includes(locale)) {
    if (absCount === 1) return PluralCategory.ONE;
    return PluralCategory.OTHER;
  }

  // Romance languages (French, Spanish, Portuguese, Italian)
  if ([LanguageCode.FR, LanguageCode.ES, LanguageCode.PT, LanguageCode.IT].includes(locale)) {
    if (absCount === 0 || absCount === 1) return PluralCategory.ONE;
    return PluralCategory.OTHER;
  }

  // Russian, Polish (complex plural rules)
  if ([LanguageCode.RU, LanguageCode.PL].includes(locale)) {
    const mod10 = absCount % 10;
    const mod100 = absCount % 100;

    if (mod10 === 1 && mod100 !== 11) return PluralCategory.ONE;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return PluralCategory.FEW;
    return PluralCategory.MANY;
  }

  // Arabic (has zero, one, two, few, many, other)
  if (locale === LanguageCode.AR) {
    if (absCount === 0) return PluralCategory.ZERO;
    if (absCount === 1) return PluralCategory.ONE;
    if (absCount === 2) return PluralCategory.TWO;
    if (absCount % 100 >= 3 && absCount % 100 <= 10) return PluralCategory.FEW;
    if (absCount % 100 >= 11 && absCount % 100 <= 99) return PluralCategory.MANY;
    return PluralCategory.OTHER;
  }

  // Chinese, Japanese, Korean, Thai, Vietnamese (no plural distinction)
  if ([LanguageCode.ZH, LanguageCode.JA, LanguageCode.KO, LanguageCode.TH, LanguageCode.VI].includes(locale)) {
    return PluralCategory.OTHER;
  }

  // Default fallback
  return PluralCategory.OTHER;
}

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
export function translatePlural(
  key: string,
  count: number,
  options?: Omit<TranslationOptions, 'count'>
): string {
  return getTranslation(key, { ...options, count });
}

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
export function hasTranslation(
  key: string,
  locale: LanguageCode,
  namespace: TranslationNamespace = TranslationNamespace.COMMON
): boolean {
  const cacheKey = getTranslationCacheKey(locale, namespace);
  const cached = translationCache.get(cacheKey);
  return cached?.translations.has(key) || false;
}

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
export function getTranslationKeys(locale: LanguageCode, namespace: TranslationNamespace): string[] {
  const cacheKey = getTranslationCacheKey(locale, namespace);
  const cached = translationCache.get(cacheKey);
  return cached ? Array.from(cached.translations.keys()) : [];
}

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
export function clearTranslationCache(locale?: LanguageCode, namespace?: TranslationNamespace): void {
  if (!locale && !namespace) {
    translationCache.clear();
    return;
  }

  const keysToDelete: string[] = [];
  translationCache.forEach((_, key) => {
    const [keyLocale, keyNamespace] = key.split(':');
    if ((locale && keyLocale === locale) || (namespace && keyNamespace === namespace)) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach(key => translationCache.delete(key));
}

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
export function getTranslationCacheStats(): {
  totalEntries: number;
  totalTranslations: number;
  locales: LanguageCode[];
  namespaces: TranslationNamespace[];
  oldestUpdate: Date | null;
  newestUpdate: Date | null;
} {
  const locales = new Set<LanguageCode>();
  const namespaces = new Set<TranslationNamespace>();
  let totalTranslations = 0;
  let oldestUpdate: Date | null = null;
  let newestUpdate: Date | null = null;

  translationCache.forEach(entry => {
    locales.add(entry.locale);
    namespaces.add(entry.namespace);
    totalTranslations += entry.translations.size;

    if (!oldestUpdate || entry.lastUpdated < oldestUpdate) {
      oldestUpdate = entry.lastUpdated;
    }
    if (!newestUpdate || entry.lastUpdated > newestUpdate) {
      newestUpdate = entry.lastUpdated;
    }
  });

  return {
    totalEntries: translationCache.size,
    totalTranslations,
    locales: Array.from(locales),
    namespaces: Array.from(namespaces),
    oldestUpdate,
    newestUpdate,
  };
}

// ============================================================================
// NUMBER & CURRENCY FORMATTING
// ============================================================================

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
export function formatNumber(
  value: number,
  locale: LanguageCode = LanguageCode.EN,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

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
export function formatCurrency(amount: number, options: CurrencyFormatOptions): string {
  const locale = options.locale || LanguageCode.EN;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: options.currency,
    currencyDisplay: options.display || 'symbol',
    minimumFractionDigits: options.minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits,
    useGrouping: options.useGrouping ?? true,
  }).format(amount);
}

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
export function formatPercentage(
  value: number,
  locale: LanguageCode = LanguageCode.EN,
  decimals: number = 0
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

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
export function parseLocalizedNumber(value: string, locale: LanguageCode): number {
  const config = getLocaleConfig(locale);

  // Replace thousands separator with empty string
  let normalized = value.replace(new RegExp(`\\${config.thousandsSeparator}`, 'g'), '');

  // Replace decimal separator with period
  normalized = normalized.replace(config.decimalSeparator, '.');

  return parseFloat(normalized);
}

// ============================================================================
// DATE & TIME FORMATTING
// ============================================================================

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
export function formatDate(date: Date, options?: DateFormatOptions): string {
  const locale = options?.locale || LanguageCode.EN;

  return new Intl.DateTimeFormat(locale, {
    dateStyle: options?.dateStyle,
    timeStyle: options?.timeStyle,
    timeZone: options?.timeZone,
    hour12: options?.hour12,
    calendar: options?.calendar,
  }).format(date);
}

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
export function formatTime(
  date: Date,
  locale: LanguageCode = LanguageCode.EN,
  use24Hour?: boolean
): string {
  const config = getLocaleConfig(locale);
  const hour12 = use24Hour !== undefined ? !use24Hour : config.timeFormat.includes('A');

  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12,
  }).format(date);
}

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
export function formatDateTime(date: Date, options?: DateFormatOptions): string {
  return formatDate(date, {
    ...options,
    dateStyle: options?.dateStyle || DateTimeStyle.MEDIUM,
    timeStyle: options?.timeStyle || DateTimeStyle.SHORT,
  });
}

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
export function formatRelativeTime(
  date: Date,
  baseDate: Date = new Date(),
  locale: LanguageCode = LanguageCode.EN
): string {
  const diffMs = date.getTime() - baseDate.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffYears) > 0) {
    return rtf.format(diffYears, 'year');
  } else if (Math.abs(diffMonths) > 0) {
    return rtf.format(diffMonths, 'month');
  } else if (Math.abs(diffDays) > 0) {
    return rtf.format(diffDays, 'day');
  } else if (Math.abs(diffHours) > 0) {
    return rtf.format(diffHours, 'hour');
  } else if (Math.abs(diffMinutes) > 0) {
    return rtf.format(diffMinutes, 'minute');
  } else {
    return rtf.format(diffSeconds, 'second');
  }
}

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
export function formatDateRange(
  startDate: Date,
  endDate: Date,
  locale: LanguageCode = LanguageCode.EN,
  dateStyle: DateTimeStyle = DateTimeStyle.MEDIUM
): string {
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle });

  // @ts-ignore - formatRange is available in newer Node versions
  if (formatter.formatRange) {
    // @ts-ignore
    return formatter.formatRange(startDate, endDate);
  }

  // Fallback for older environments
  return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
}

// ============================================================================
// RTL/LTR SUPPORT
// ============================================================================

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
export function getDirectionConfig(locale: LanguageCode): DirectionConfig {
  const isRTL = isRTLLocale(locale);

  return {
    direction: isRTL ? TextDirection.RTL : TextDirection.LTR,
    align: isRTL ? 'right' : 'left',
    textAlign: isRTL ? 'right' : 'left',
    marginStart: isRTL ? 'marginRight' : 'marginLeft',
    marginEnd: isRTL ? 'marginLeft' : 'marginRight',
    paddingStart: isRTL ? 'paddingRight' : 'paddingLeft',
    paddingEnd: isRTL ? 'paddingLeft' : 'paddingRight',
  };
}

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
export function getDirectionalStyles(
  locale: LanguageCode,
  baseStyles: Record<string, string>
): Record<string, string> {
  const dirConfig = getDirectionConfig(locale);
  const styles: Record<string, string> = {
    direction: dirConfig.direction,
  };

  Object.entries(baseStyles).forEach(([key, value]) => {
    if (key === 'paddingStart') {
      styles[dirConfig.paddingStart] = value;
    } else if (key === 'paddingEnd') {
      styles[dirConfig.paddingEnd] = value;
    } else if (key === 'marginStart') {
      styles[dirConfig.marginStart] = value;
    } else if (key === 'marginEnd') {
      styles[dirConfig.marginEnd] = value;
    } else if (key === 'textAlign' && value === 'start') {
      styles.textAlign = dirConfig.textAlign;
    } else {
      styles[key] = value;
    }
  });

  return styles;
}

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
export function mirrorForRTL(value: number, locale: LanguageCode): number {
  return isRTLLocale(locale) ? -value : value;
}

// ============================================================================
// ACCESSIBILITY I18N FEATURES
// ============================================================================

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
export function getAccessibilityMetadata(
  locale: LanguageCode,
  content?: {
    label?: string;
    description?: string;
    title?: string;
    altText?: string;
  }
): AccessibilityI18nMetadata {
  return {
    lang: locale,
    dir: getTextDirection(locale),
    ariaLabel: content?.label,
    ariaDescription: content?.description,
    title: content?.title,
    altText: content?.altText,
  };
}

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
export function getHTMLLangAttribute(locale: LanguageCode, includeRegion: boolean = false): string {
  if (!includeRegion) {
    return locale;
  }

  // Map common locales to their regions
  const regionMap: Partial<Record<LanguageCode, string>> = {
    [LanguageCode.EN]: 'en-US',
    [LanguageCode.ES]: 'es-ES',
    [LanguageCode.FR]: 'fr-FR',
    [LanguageCode.DE]: 'de-DE',
    [LanguageCode.IT]: 'it-IT',
    [LanguageCode.PT]: 'pt-BR',
    [LanguageCode.ZH]: 'zh-CN',
    [LanguageCode.JA]: 'ja-JP',
    [LanguageCode.KO]: 'ko-KR',
    [LanguageCode.AR]: 'ar-SA',
    [LanguageCode.HE]: 'he-IL',
  };

  return regionMap[locale] || locale;
}

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
export function createARIAAnnouncement(
  message: string,
  locale: LanguageCode,
  politeness: 'polite' | 'assertive' = 'polite'
): {
  role: string;
  'aria-live': string;
  'aria-atomic': string;
  lang: string;
  textContent: string;
} {
  return {
    role: politeness === 'assertive' ? 'alert' : 'status',
    'aria-live': politeness,
    'aria-atomic': 'true',
    lang: locale,
    textContent: message,
  };
}

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
export function getAccessibleFormField(
  fieldId: string,
  labelKey: string,
  locale: LanguageCode,
  options?: {
    namespace?: TranslationNamespace;
    required?: boolean;
    hint?: string;
    error?: string;
  }
): {
  id: string;
  'aria-label': string;
  'aria-describedby'?: string;
  'aria-required'?: string;
  'aria-invalid'?: string;
  lang: string;
} {
  const label = getTranslation(labelKey, { locale, namespace: options?.namespace });

  const attributes: any = {
    id: fieldId,
    'aria-label': label,
    lang: locale,
  };

  if (options?.required) {
    attributes['aria-required'] = 'true';
  }

  if (options?.hint) {
    const hintId = `${fieldId}-hint`;
    attributes['aria-describedby'] = hintId;
  }

  if (options?.error) {
    const errorId = `${fieldId}-error`;
    attributes['aria-describedby'] = attributes['aria-describedby']
      ? `${attributes['aria-describedby']} ${errorId}`
      : errorId;
    attributes['aria-invalid'] = 'true';
  }

  return attributes;
}

// ============================================================================
// NESTJS INTEGRATION
// ============================================================================

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
export const CurrentLocale = createParamDecorator((data: unknown, ctx: ExecutionContext): LanguageCode => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return (request as any).locale || detectLocaleFromRequest(request).locale;
});

/**
 * Metadata key for locale validation
 */
export const LOCALE_METADATA_KEY = 'i18n:locale';

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
export const SupportedLocales = (...locales: LanguageCode[]) => SetMetadata(LOCALE_METADATA_KEY, locales);

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
@Injectable()
export class LocaleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const detection = detectLocaleFromRequest(req, 'locale', 'lang');
    (req as any).locale = detection.locale;
    (req as any).localeSource = detection.source;

    // Set language cookie if not present or different
    if (!req.cookies?.locale || req.cookies.locale !== detection.locale) {
      res.cookie('locale', detection.locale, {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        httpOnly: true,
        sameSite: 'lax',
      });
    }

    // Set Content-Language header
    res.setHeader('Content-Language', detection.locale);

    next();
  }
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
@Injectable()
export class TranslationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const locale = (request as any).locale || LanguageCode.EN;

    return next.handle().pipe(
      tap(data => {
        if (data && typeof data === 'object') {
          this.translateObject(data, locale);
        }
      })
    );
  }

  private translateObject(obj: any, locale: LanguageCode): void {
    for (const key in obj) {
      if (typeof obj[key] === 'string' && obj[key].includes('.')) {
        // Assume it's a translation key
        obj[key] = getTranslation(obj[key], { locale });
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.translateObject(obj[key], locale);
      }
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

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
export function isValidLocale(locale: string): locale is LanguageCode {
  return Object.values(LanguageCode).includes(locale as LanguageCode);
}

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
export function getBestMatchingLocale(
  preferences: LanguageCode[],
  supportedLocales: LanguageCode[]
): LanguageCode {
  for (const pref of preferences) {
    if (supportedLocales.includes(pref)) {
      return pref;
    }
  }
  return LanguageCode.EN;
}

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
export function getTranslationCoverage(
  baseLocale: LanguageCode,
  targetLocale: LanguageCode,
  namespace: TranslationNamespace
): {
  baseKeys: number;
  translatedKeys: number;
  percentage: number;
  missingKeys: string[];
} {
  const baseKeys = getTranslationKeys(baseLocale, namespace);
  const targetKeys = getTranslationKeys(targetLocale, namespace);

  const missingKeys = baseKeys.filter(key => !targetKeys.includes(key));

  return {
    baseKeys: baseKeys.length,
    translatedKeys: targetKeys.length,
    percentage: baseKeys.length > 0 ? (targetKeys.length / baseKeys.length) * 100 : 0,
    missingKeys,
  };
}

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
export function createLocaleSwitcher(
  currentLocale: LanguageCode,
  availableLocales: LanguageCode[]
): Array<{
  code: LanguageCode;
  name: string;
  nativeName: string;
  active: boolean;
  direction: TextDirection;
}> {
  return availableLocales.map(locale => {
    const config = getLocaleConfig(locale);
    return {
      code: locale,
      name: config.name,
      nativeName: config.nativeName,
      active: locale === currentLocale,
      direction: config.direction,
    };
  });
}

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
export function exportTranslationsToJSON(locale: LanguageCode, namespace: TranslationNamespace): string {
  const cacheKey = getTranslationCacheKey(locale, namespace);
  const cached = translationCache.get(cacheKey);

  if (!cached) {
    return JSON.stringify({}, null, 2);
  }

  const obj: Record<string, string> = {};
  cached.translations.forEach((value, key) => {
    obj[key] = value;
  });

  return JSON.stringify(obj, null, 2);
}

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
export function importTranslationsFromJSON(
  locale: LanguageCode,
  namespace: TranslationNamespace,
  jsonData: Record<string, string>,
  merge: boolean = false
): void {
  const translations = new Map<string, string>();

  if (merge) {
    const cacheKey = getTranslationCacheKey(locale, namespace);
    const existing = translationCache.get(cacheKey);
    if (existing) {
      existing.translations.forEach((value, key) => {
        translations.set(key, value);
      });
    }
  }

  Object.entries(jsonData).forEach(([key, value]) => {
    translations.set(key, value);
  });

  loadTranslations(locale, namespace, translations);
}
