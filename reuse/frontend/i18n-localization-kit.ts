/**
 * @fileoverview Enterprise i18n & Localization React Kit for Next.js 16
 * @module reuse/frontend/i18n-localization-kit
 * @description Production-ready internationalization hooks, components, and utilities
 * for multi-language React/Next.js applications with RTL support, formatters, and
 * advanced translation management
 *
 * @example
 * ```tsx
 * import {
 *   useTranslation,
 *   useLocale,
 *   TranslationProvider,
 *   LocaleSelector,
 *   formatCurrency,
 *   formatDate
 * } from '@/reuse/frontend/i18n-localization-kit';
 *
 * function ProductPage() {
 *   const { t, tc, tp } = useTranslation('products');
 *   const { locale, direction } = useLocale();
 *
 *   return (
 *     <div dir={direction}>
 *       <h1>{t('title')}</h1>
 *       <p>{tc('items', { count: 5 })}</p>
 *       <p>{tp('price', { amount: formatCurrency(99.99, locale) })}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @author Enterprise Development Team
 * @version 1.0.0
 * @license MIT
 */

'use client';

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  createContext,
  useContext,
  ReactNode,
  ComponentType,
} from 'react';

/* ========================================================================
   TYPE DEFINITIONS
   ======================================================================== */

/**
 * Supported locale codes (BCP 47)
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
  | 'ja-JP'
  | 'zh-CN'
  | 'zh-TW'
  | 'ko-KR'
  | 'ar-SA'
  | 'he-IL'
  | 'ru-RU'
  | 'nl-NL'
  | 'pl-PL'
  | 'tr-TR'
  | 'vi-VN'
  | 'th-TH'
  | 'id-ID'
  | 'ms-MY'
  | 'sv-SE'
  | 'da-DK'
  | 'fi-FI'
  | 'no-NO'
  | 'cs-CZ'
  | 'hu-HU'
  | 'ro-RO'
  | 'uk-UA'
  | string;

/**
 * Text direction for RTL languages
 */
export type TextDirection = 'ltr' | 'rtl';

/**
 * Translation namespace for organizing translations
 */
export type TranslationNamespace =
  | 'common'
  | 'auth'
  | 'dashboard'
  | 'forms'
  | 'errors'
  | 'navigation'
  | 'products'
  | 'checkout'
  | 'account'
  | 'settings'
  | string;

/**
 * Plural form categories
 */
export type PluralCategory = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

/**
 * Gender categories for grammatical gender
 */
export type GenderCategory = 'masculine' | 'feminine' | 'neuter' | 'neutral';

/**
 * Date format styles
 */
export type DateFormatStyle = 'full' | 'long' | 'medium' | 'short';

/**
 * Number format styles
 */
export type NumberFormatStyle = 'decimal' | 'currency' | 'percent' | 'unit';

/**
 * Currency display modes
 */
export type CurrencyDisplay = 'symbol' | 'narrowSymbol' | 'code' | 'name';

/**
 * Locale metadata
 */
export interface LocaleMetadata {
  code: LocaleCode;
  name: string;
  nativeName: string;
  direction: TextDirection;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  firstDayOfWeek: number; // 0 = Sunday, 1 = Monday
  flag?: string;
  enabled: boolean;
}

/**
 * Translation data structure
 */
export interface TranslationData {
  [key: string]: string | TranslationData | PluralTranslation | GenderTranslation;
}

/**
 * Plural translation variants
 */
export interface PluralTranslation {
  zero?: string;
  one: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

/**
 * Gender-based translation variants
 */
export interface GenderTranslation {
  masculine: string;
  feminine: string;
  neuter?: string;
  neutral?: string;
}

/**
 * Translation interpolation parameters
 */
export interface TranslationParams {
  [key: string]: string | number | boolean | Date | null | undefined;
}

/**
 * Translation options
 */
export interface TranslationOptions {
  defaultValue?: string;
  count?: number;
  gender?: GenderCategory;
  context?: string;
  interpolation?: TranslationParams;
  fallback?: boolean;
}

/**
 * Locale configuration
 */
export interface LocaleConfig {
  defaultLocale: LocaleCode;
  supportedLocales: LocaleCode[];
  fallbackLocale?: LocaleCode;
  autoDetect?: boolean;
  cookieName?: string;
  localStorageKey?: string;
  queryParamName?: string;
}

/**
 * Translation namespace bundle
 */
export interface TranslationBundle {
  locale: LocaleCode;
  namespace: TranslationNamespace;
  translations: TranslationData;
  version?: string;
  lastUpdated?: Date;
}

/**
 * Translation loader function
 */
export type TranslationLoader = (
  locale: LocaleCode,
  namespace: TranslationNamespace
) => Promise<TranslationData>;

/**
 * Translation cache entry
 */
export interface TranslationCacheEntry {
  data: TranslationData;
  timestamp: number;
  expiresAt?: number;
}

/**
 * Missing translation info
 */
export interface MissingTranslation {
  key: string;
  namespace: TranslationNamespace;
  locale: LocaleCode;
  defaultValue?: string;
  timestamp: Date;
}

/**
 * Translation validation result
 */
export interface TranslationValidation {
  isValid: boolean;
  missingKeys: string[];
  extraKeys: string[];
  invalidValues: string[];
}

/**
 * Date localization options
 */
export interface DateLocalizationOptions {
  dateStyle?: DateFormatStyle;
  timeStyle?: DateFormatStyle;
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
  timeZone?: string;
  hour12?: boolean;
}

/**
 * Number localization options
 */
export interface NumberLocalizationOptions {
  style?: NumberFormatStyle;
  currency?: string;
  currencyDisplay?: CurrencyDisplay;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  minimumIntegerDigits?: number;
  useGrouping?: boolean;
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
}

/**
 * Translation editor mode
 */
export type TranslationEditorMode = 'inline' | 'panel' | 'overlay';

/**
 * Translation change event
 */
export interface TranslationChangeEvent {
  locale: LocaleCode;
  namespace: TranslationNamespace;
  key: string;
  oldValue: string;
  newValue: string;
  timestamp: Date;
}

/* ========================================================================
   CONTEXT & PROVIDERS
   ======================================================================== */

/**
 * Locale context value
 */
interface LocaleContextValue {
  locale: LocaleCode;
  locales: LocaleMetadata[];
  direction: TextDirection;
  setLocale: (locale: LocaleCode) => void;
  isRTL: boolean;
}

/**
 * Translation context value
 */
interface TranslationContextValue {
  translations: Map<string, TranslationData>;
  loadNamespace: (namespace: TranslationNamespace) => Promise<void>;
  isLoading: boolean;
  missingTranslations: MissingTranslation[];
  addMissingTranslation: (missing: MissingTranslation) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);
const TranslationContext = createContext<TranslationContextValue | null>(null);

/**
 * Locale provider props
 */
export interface LocaleProviderProps {
  children: ReactNode;
  config: LocaleConfig;
  initialLocale?: LocaleCode;
  onLocaleChange?: (locale: LocaleCode) => void;
}

/**
 * Translation provider props
 */
export interface TranslationProviderProps {
  children: ReactNode;
  loader: TranslationLoader;
  preloadNamespaces?: TranslationNamespace[];
  cacheEnabled?: boolean;
  cacheTTL?: number;
  onMissingTranslation?: (missing: MissingTranslation) => void;
}

/**
 * LocaleProvider - Manages locale state and direction
 *
 * @example
 * ```tsx
 * <LocaleProvider config={localeConfig} initialLocale="en-US">
 *   <App />
 * </LocaleProvider>
 * ```
 */
export function LocaleProvider({
  children,
  config,
  initialLocale,
  onLocaleChange,
}: LocaleProviderProps): JSX.Element {
  const [locale, setLocaleState] = useState<LocaleCode>(
    initialLocale || config.defaultLocale
  );

  const locales = useMemo<LocaleMetadata[]>(
    () => [
      {
        code: 'en-US',
        name: 'English (US)',
        nativeName: 'English',
        direction: 'ltr',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        firstDayOfWeek: 0,
        flag: '🇺🇸',
        enabled: true,
      },
      {
        code: 'es-ES',
        name: 'Spanish (Spain)',
        nativeName: 'Español',
        direction: 'ltr',
        currency: 'EUR',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        firstDayOfWeek: 1,
        flag: '🇪🇸',
        enabled: true,
      },
      {
        code: 'fr-FR',
        name: 'French (France)',
        nativeName: 'Français',
        direction: 'ltr',
        currency: 'EUR',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        firstDayOfWeek: 1,
        flag: '🇫🇷',
        enabled: true,
      },
      {
        code: 'de-DE',
        name: 'German (Germany)',
        nativeName: 'Deutsch',
        direction: 'ltr',
        currency: 'EUR',
        dateFormat: 'DD.MM.YYYY',
        timeFormat: '24h',
        firstDayOfWeek: 1,
        flag: '🇩🇪',
        enabled: true,
      },
      {
        code: 'ja-JP',
        name: 'Japanese',
        nativeName: '日本語',
        direction: 'ltr',
        currency: 'JPY',
        dateFormat: 'YYYY/MM/DD',
        timeFormat: '24h',
        firstDayOfWeek: 0,
        flag: '🇯🇵',
        enabled: true,
      },
      {
        code: 'ar-SA',
        name: 'Arabic (Saudi Arabia)',
        nativeName: 'العربية',
        direction: 'rtl',
        currency: 'SAR',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h',
        firstDayOfWeek: 6,
        flag: '🇸🇦',
        enabled: true,
      },
      {
        code: 'he-IL',
        name: 'Hebrew (Israel)',
        nativeName: 'עברית',
        direction: 'rtl',
        currency: 'ILS',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        firstDayOfWeek: 0,
        flag: '🇮🇱',
        enabled: true,
      },
      {
        code: 'zh-CN',
        name: 'Chinese (Simplified)',
        nativeName: '简体中文',
        direction: 'ltr',
        currency: 'CNY',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: '24h',
        firstDayOfWeek: 1,
        flag: '🇨🇳',
        enabled: true,
      },
    ],
    []
  );

  const direction = useMemo<TextDirection>(() => {
    const localeData = locales.find((l) => l.code === locale);
    return localeData?.direction || 'ltr';
  }, [locale, locales]);

  const isRTL = direction === 'rtl';

  const setLocale = useCallback(
    (newLocale: LocaleCode) => {
      setLocaleState(newLocale);
      onLocaleChange?.(newLocale);

      // Persist to localStorage
      if (config.localStorageKey) {
        localStorage.setItem(config.localStorageKey, newLocale);
      }

      // Update HTML dir attribute
      document.documentElement.dir = direction;
      document.documentElement.lang = newLocale;
    },
    [config.localStorageKey, direction, onLocaleChange]
  );

  const value: LocaleContextValue = {
    locale,
    locales,
    direction,
    setLocale,
    isRTL,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/**
 * TranslationProvider - Manages translations loading and caching
 *
 * @example
 * ```tsx
 * <TranslationProvider loader={loadTranslations} preloadNamespaces={['common']}>
 *   <App />
 * </TranslationProvider>
 * ```
 */
export function TranslationProvider({
  children,
  loader,
  preloadNamespaces = [],
  cacheEnabled = true,
  cacheTTL = 3600000, // 1 hour
  onMissingTranslation,
}: TranslationProviderProps): JSX.Element {
  const [translations, setTranslations] = useState<Map<string, TranslationData>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [missingTranslations, setMissingTranslations] = useState<MissingTranslation[]>(
    []
  );

  const cacheRef = useRef<Map<string, TranslationCacheEntry>>(new Map());

  const loadNamespace = useCallback(
    async (namespace: TranslationNamespace) => {
      const localeCtx = useContext(LocaleContext);
      if (!localeCtx) return;

      const cacheKey = `${localeCtx.locale}:${namespace}`;

      // Check cache
      if (cacheEnabled) {
        const cached = cacheRef.current.get(cacheKey);
        if (cached && (!cached.expiresAt || Date.now() < cached.expiresAt)) {
          setTranslations((prev) => new Map(prev).set(cacheKey, cached.data));
          return;
        }
      }

      setIsLoading(true);
      try {
        const data = await loader(localeCtx.locale, namespace);
        const entry: TranslationCacheEntry = {
          data,
          timestamp: Date.now(),
          expiresAt: cacheTTL > 0 ? Date.now() + cacheTTL : undefined,
        };

        cacheRef.current.set(cacheKey, entry);
        setTranslations((prev) => new Map(prev).set(cacheKey, data));
      } catch (error) {
        console.error(`Failed to load namespace ${namespace}:`, error);
      } finally {
        setIsLoading(false);
      }
    },
    [loader, cacheEnabled, cacheTTL]
  );

  const addMissingTranslation = useCallback(
    (missing: MissingTranslation) => {
      setMissingTranslations((prev) => [...prev, missing]);
      onMissingTranslation?.(missing);
    },
    [onMissingTranslation]
  );

  // Preload namespaces
  useEffect(() => {
    preloadNamespaces.forEach((ns) => loadNamespace(ns));
  }, [preloadNamespaces, loadNamespace]);

  const value: TranslationContextValue = {
    translations,
    loadNamespace,
    isLoading,
    missingTranslations,
    addMissingTranslation,
  };

  return (
    <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>
  );
}

/* ========================================================================
   CORE HOOKS
   ======================================================================== */

/**
 * useLocale - Access current locale and locale utilities
 *
 * @returns Locale context with current locale, direction, and setter
 *
 * @example
 * ```tsx
 * const { locale, direction, isRTL, setLocale } = useLocale();
 * ```
 */
export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}

/**
 * useLanguage - Alias for useLocale (common naming pattern)
 *
 * @returns Locale context
 */
export function useLanguage(): LocaleContextValue {
  return useLocale();
}

/**
 * useTranslation - Core translation hook with namespace support
 *
 * @param namespace - Translation namespace to use
 * @returns Translation functions and state
 *
 * @example
 * ```tsx
 * const { t, tc, tp, ready } = useTranslation('products');
 * const title = t('title');
 * const items = tc('items', { count: 5 });
 * const price = tp('price', { amount: '$99' });
 * ```
 */
export function useTranslation(namespace: TranslationNamespace = 'common') {
  const localeCtx = useLocale();
  const translationCtx = useContext(TranslationContext);

  if (!translationCtx) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }

  const { translations, loadNamespace, isLoading, addMissingTranslation } =
    translationCtx;

  const cacheKey = `${localeCtx.locale}:${namespace}`;
  const namespaceTranslations = translations.get(cacheKey);

  // Load namespace if not loaded
  useEffect(() => {
    if (!namespaceTranslations && !isLoading) {
      loadNamespace(namespace);
    }
  }, [namespace, namespaceTranslations, isLoading, loadNamespace]);

  /**
   * Translate function - Get translation by key
   */
  const t = useCallback(
    (key: string, options?: TranslationOptions): string => {
      if (!namespaceTranslations) {
        return options?.defaultValue || key;
      }

      const value = getNestedValue(namespaceTranslations, key);

      if (!value) {
        addMissingTranslation({
          key,
          namespace,
          locale: localeCtx.locale,
          defaultValue: options?.defaultValue,
          timestamp: new Date(),
        });
        return options?.defaultValue || key;
      }

      if (typeof value === 'string') {
        return options?.interpolation
          ? interpolateString(value, options.interpolation)
          : value;
      }

      return options?.defaultValue || key;
    },
    [namespaceTranslations, namespace, localeCtx.locale, addMissingTranslation]
  );

  /**
   * Translate with count - Handles plural forms
   */
  const tc = useCallback(
    (key: string, options: TranslationOptions & { count: number }): string => {
      if (!namespaceTranslations) {
        return options?.defaultValue || key;
      }

      const value = getNestedValue(namespaceTranslations, key);

      if (!value || typeof value === 'string') {
        return t(key, options);
      }

      // Handle plural translations
      if (isPluralTranslation(value)) {
        const pluralKey = getPluralCategory(options.count, localeCtx.locale);
        const pluralValue = value[pluralKey] || value.other;

        return options?.interpolation
          ? interpolateString(pluralValue, { ...options.interpolation, count: options.count })
          : pluralValue.replace('{{count}}', String(options.count));
      }

      return options?.defaultValue || key;
    },
    [namespaceTranslations, localeCtx.locale, t]
  );

  /**
   * Translate with parameters - Interpolation shorthand
   */
  const tp = useCallback(
    (key: string, params: TranslationParams): string => {
      return t(key, { interpolation: params });
    },
    [t]
  );

  return {
    t,
    tc,
    tp,
    ready: !!namespaceTranslations,
    isLoading,
    namespace,
    locale: localeCtx.locale,
  };
}

/**
 * useTranslations - Load multiple namespaces
 *
 * @param namespaces - Array of namespaces to load
 * @returns Translation functions with multi-namespace support
 *
 * @example
 * ```tsx
 * const { t, ready } = useTranslations(['common', 'products', 'checkout']);
 * ```
 */
export function useTranslations(namespaces: TranslationNamespace[]) {
  const localeCtx = useLocale();
  const translationCtx = useContext(TranslationContext);

  if (!translationCtx) {
    throw new Error('useTranslations must be used within TranslationProvider');
  }

  const allTranslations = useMemo(() => {
    const merged: TranslationData = {};
    namespaces.forEach((ns) => {
      const cacheKey = `${localeCtx.locale}:${ns}`;
      const nsData = translationCtx.translations.get(cacheKey);
      if (nsData) {
        Object.assign(merged, nsData);
      }
    });
    return merged;
  }, [namespaces, localeCtx.locale, translationCtx.translations]);

  const t = useCallback(
    (key: string, options?: TranslationOptions): string => {
      const value = getNestedValue(allTranslations, key);
      if (!value || typeof value !== 'string') {
        return options?.defaultValue || key;
      }
      return options?.interpolation
        ? interpolateString(value, options.interpolation)
        : value;
    },
    [allTranslations]
  );

  return {
    t,
    ready: namespaces.every((ns) =>
      translationCtx.translations.has(`${localeCtx.locale}:${ns}`)
    ),
    locale: localeCtx.locale,
  };
}

/**
 * useDirection - Get text direction for current locale
 *
 * @returns Text direction ('ltr' or 'rtl') and utilities
 *
 * @example
 * ```tsx
 * const { direction, isRTL, isLTR } = useDirection();
 * ```
 */
export function useDirection() {
  const { direction, isRTL } = useLocale();

  return {
    direction,
    isRTL,
    isLTR: !isRTL,
    dir: direction,
  };
}

/**
 * useRTL - Check if current locale is RTL
 *
 * @returns Boolean indicating RTL status
 */
export function useRTL(): boolean {
  const { isRTL } = useLocale();
  return isRTL;
}

/* ========================================================================
   TRANSLATION LOADING & CACHING
   ======================================================================== */

/**
 * loadTranslations - Load translations from server
 *
 * @param locale - Locale to load
 * @param namespace - Namespace to load
 * @returns Promise with translation data
 *
 * @example
 * ```tsx
 * const data = await loadTranslations('en-US', 'common');
 * ```
 */
export async function loadTranslations(
  locale: LocaleCode,
  namespace: TranslationNamespace
): Promise<TranslationData> {
  try {
    const response = await fetch(`/api/translations/${locale}/${namespace}`);
    if (!response.ok) {
      throw new Error(`Failed to load translations: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Translation loading error:', error);
    return {};
  }
}

/**
 * fetchTranslations - Fetch translations with options
 *
 * @param locale - Locale to fetch
 * @param namespaces - Namespaces to fetch
 * @param options - Fetch options
 * @returns Promise with translation bundles
 */
export async function fetchTranslations(
  locale: LocaleCode,
  namespaces: TranslationNamespace[],
  options?: RequestInit
): Promise<TranslationBundle[]> {
  const bundles: TranslationBundle[] = [];

  await Promise.all(
    namespaces.map(async (namespace) => {
      try {
        const translations = await loadTranslations(locale, namespace);
        bundles.push({
          locale,
          namespace,
          translations,
          version: '1.0.0',
          lastUpdated: new Date(),
        });
      } catch (error) {
        console.error(`Failed to fetch ${namespace}:`, error);
      }
    })
  );

  return bundles;
}

/**
 * cacheTranslations - Cache translations in memory/storage
 *
 * @param bundles - Translation bundles to cache
 * @param storage - Storage mechanism ('memory' | 'localStorage' | 'sessionStorage')
 */
export function cacheTranslations(
  bundles: TranslationBundle[],
  storage: 'memory' | 'localStorage' | 'sessionStorage' = 'memory'
): void {
  bundles.forEach((bundle) => {
    const key = `i18n:${bundle.locale}:${bundle.namespace}`;

    if (storage === 'localStorage') {
      localStorage.setItem(key, JSON.stringify(bundle));
    } else if (storage === 'sessionStorage') {
      sessionStorage.setItem(key, JSON.stringify(bundle));
    }
    // Memory cache handled by TranslationProvider
  });
}

/**
 * clearTranslationCache - Clear cached translations
 *
 * @param locale - Optional locale to clear (clears all if omitted)
 * @param namespace - Optional namespace to clear
 */
export function clearTranslationCache(
  locale?: LocaleCode,
  namespace?: TranslationNamespace
): void {
  const prefix = 'i18n:';
  const keys: string[] = [];

  // Collect keys to remove
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(prefix)) {
      if (locale && !key.includes(locale)) continue;
      if (namespace && !key.includes(namespace)) continue;
      keys.push(key);
    }
  }

  // Remove keys
  keys.forEach((key) => localStorage.removeItem(key));
}

/**
 * preloadTranslations - Preload translations for faster rendering
 *
 * @param locale - Locale to preload
 * @param namespaces - Namespaces to preload
 * @returns Promise that resolves when preloading is complete
 */
export async function preloadTranslations(
  locale: LocaleCode,
  namespaces: TranslationNamespace[]
): Promise<void> {
  const bundles = await fetchTranslations(locale, namespaces);
  cacheTranslations(bundles, 'localStorage');
}

/**
 * lazyLoadTranslations - Lazy load translations on demand
 *
 * @param locale - Locale to load
 * @param namespace - Namespace to load
 * @returns Promise with translation data
 */
export async function lazyLoadTranslations(
  locale: LocaleCode,
  namespace: TranslationNamespace
): Promise<TranslationData> {
  // Check cache first
  const cached = localStorage.getItem(`i18n:${locale}:${namespace}`);
  if (cached) {
    const bundle: TranslationBundle = JSON.parse(cached);
    return bundle.translations;
  }

  // Load from server
  return await loadTranslations(locale, namespace);
}

/**
 * splitTranslations - Split large translation files into chunks
 *
 * @param translations - Translation data to split
 * @param chunkSize - Maximum keys per chunk
 * @returns Array of translation chunks
 */
export function splitTranslations(
  translations: TranslationData,
  chunkSize: number = 100
): TranslationData[] {
  const entries = Object.entries(translations);
  const chunks: TranslationData[] = [];

  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = Object.fromEntries(entries.slice(i, i + chunkSize));
    chunks.push(chunk);
  }

  return chunks;
}

/* ========================================================================
   FORMATTERS
   ======================================================================== */

/**
 * formatDate - Format date according to locale
 *
 * @param date - Date to format
 * @param locale - Locale code
 * @param options - Formatting options
 * @returns Formatted date string
 *
 * @example
 * ```tsx
 * formatDate(new Date(), 'en-US', { dateStyle: 'long' }); // "January 1, 2024"
 * ```
 */
export function formatDate(
  date: Date | number | string,
  locale: LocaleCode,
  options?: DateLocalizationOptions
): string {
  const dateObj = date instanceof Date ? date : new Date(date);

  try {
    return new Intl.DateTimeFormat(locale, options as Intl.DateTimeFormatOptions).format(
      dateObj
    );
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateObj.toISOString();
  }
}

/**
 * formatTime - Format time according to locale
 *
 * @param date - Date/time to format
 * @param locale - Locale code
 * @param options - Formatting options
 * @returns Formatted time string
 */
export function formatTime(
  date: Date | number | string,
  locale: LocaleCode,
  options?: DateLocalizationOptions
): string {
  const dateObj = date instanceof Date ? date : new Date(date);

  const defaultOptions: DateLocalizationOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };

  return formatDate(dateObj, locale, defaultOptions);
}

/**
 * formatDateTime - Format date and time according to locale
 *
 * @param date - Date/time to format
 * @param locale - Locale code
 * @param options - Formatting options
 * @returns Formatted date-time string
 */
export function formatDateTime(
  date: Date | number | string,
  locale: LocaleCode,
  options?: DateLocalizationOptions
): string {
  const defaultOptions: DateLocalizationOptions = {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  };

  return formatDate(date, locale, defaultOptions);
}

/**
 * formatRelativeTime - Format relative time (e.g., "2 hours ago")
 *
 * @param date - Date to compare
 * @param locale - Locale code
 * @param baseDate - Base date for comparison (defaults to now)
 * @returns Relative time string
 */
export function formatRelativeTime(
  date: Date | number | string,
  locale: LocaleCode,
  baseDate: Date = new Date()
): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const diffMs = dateObj.getTime() - baseDate.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffSec) < 60) {
    return rtf.format(diffSec, 'second');
  } else if (Math.abs(diffMin) < 60) {
    return rtf.format(diffMin, 'minute');
  } else if (Math.abs(diffHour) < 24) {
    return rtf.format(diffHour, 'hour');
  } else if (Math.abs(diffDay) < 30) {
    return rtf.format(diffDay, 'day');
  } else if (Math.abs(diffDay) < 365) {
    return rtf.format(Math.round(diffDay / 30), 'month');
  } else {
    return rtf.format(Math.round(diffDay / 365), 'year');
  }
}

/**
 * formatNumber - Format number according to locale
 *
 * @param value - Number to format
 * @param locale - Locale code
 * @param options - Formatting options
 * @returns Formatted number string
 */
export function formatNumber(
  value: number,
  locale: LocaleCode,
  options?: NumberLocalizationOptions
): string {
  try {
    return new Intl.NumberFormat(locale, options as Intl.NumberFormatOptions).format(
      value
    );
  } catch (error) {
    console.error('Number formatting error:', error);
    return String(value);
  }
}

/**
 * formatCurrency - Format currency according to locale
 *
 * @param value - Amount to format
 * @param locale - Locale code
 * @param currency - Currency code (ISO 4217)
 * @param options - Additional formatting options
 * @returns Formatted currency string
 *
 * @example
 * ```tsx
 * formatCurrency(1234.56, 'en-US', 'USD'); // "$1,234.56"
 * formatCurrency(1234.56, 'de-DE', 'EUR'); // "1.234,56 €"
 * ```
 */
export function formatCurrency(
  value: number,
  locale: LocaleCode,
  currency: string = 'USD',
  options?: Omit<NumberLocalizationOptions, 'style' | 'currency'>
): string {
  return formatNumber(value, locale, {
    style: 'currency',
    currency,
    ...options,
  });
}

/**
 * formatPercentage - Format percentage according to locale
 *
 * @param value - Value to format (0.5 = 50%)
 * @param locale - Locale code
 * @param options - Formatting options
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number,
  locale: LocaleCode,
  options?: Omit<NumberLocalizationOptions, 'style'>
): string {
  return formatNumber(value, locale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  });
}

/**
 * formatCompactNumber - Format number in compact notation
 *
 * @param value - Number to format
 * @param locale - Locale code
 * @returns Compact number string (e.g., "1.2K", "3.4M")
 */
export function formatCompactNumber(value: number, locale: LocaleCode): string {
  return formatNumber(value, locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  });
}

/**
 * formatList - Format list according to locale
 *
 * @param items - Items to format
 * @param locale - Locale code
 * @param type - List type ('conjunction' | 'disjunction' | 'unit')
 * @returns Formatted list string
 *
 * @example
 * ```tsx
 * formatList(['apples', 'oranges', 'bananas'], 'en-US'); // "apples, oranges, and bananas"
 * ```
 */
export function formatList(
  items: string[],
  locale: LocaleCode,
  type: 'conjunction' | 'disjunction' | 'unit' = 'conjunction'
): string {
  try {
    return new Intl.ListFormat(locale, { type }).format(items);
  } catch (error) {
    console.error('List formatting error:', error);
    return items.join(', ');
  }
}

/* ========================================================================
   PLURAL & GENDER RULES
   ======================================================================== */

/**
 * getPluralCategory - Get plural category for number in locale
 *
 * @param count - Number to categorize
 * @param locale - Locale code
 * @returns Plural category
 */
export function getPluralCategory(count: number, locale: LocaleCode): PluralCategory {
  const rules = new Intl.PluralRules(locale);
  const category = rules.select(count);

  switch (category) {
    case 'zero':
      return 'zero';
    case 'one':
      return 'one';
    case 'two':
      return 'two';
    case 'few':
      return 'few';
    case 'many':
      return 'many';
    default:
      return 'other';
  }
}

/**
 * getPluralRules - Get all plural rules for locale
 *
 * @param locale - Locale code
 * @returns Array of plural categories used in locale
 */
export function getPluralRules(locale: LocaleCode): PluralCategory[] {
  const rules = new Intl.PluralRules(locale);
  const categories: PluralCategory[] = ['other']; // 'other' is always present

  // Test common numbers to find categories
  const testNumbers = [0, 1, 2, 3, 5, 10, 100];
  testNumbers.forEach((num) => {
    const category = rules.select(num) as PluralCategory;
    if (!categories.includes(category)) {
      categories.push(category);
    }
  });

  return categories;
}

/**
 * selectPlural - Select correct plural form
 *
 * @param count - Number for selection
 * @param forms - Plural forms object
 * @param locale - Locale code
 * @returns Selected plural form
 */
export function selectPlural(
  count: number,
  forms: PluralTranslation,
  locale: LocaleCode
): string {
  const category = getPluralCategory(count, locale);
  return forms[category] || forms.other;
}

/**
 * selectGender - Select correct gender form
 *
 * @param gender - Gender category
 * @param forms - Gender forms object
 * @returns Selected gender form
 */
export function selectGender(gender: GenderCategory, forms: GenderTranslation): string {
  return forms[gender] || forms.neutral || forms.masculine;
}

/* ========================================================================
   RTL SUPPORT
   ======================================================================== */

/**
 * isRTLLocale - Check if locale uses RTL
 *
 * @param locale - Locale code
 * @returns Boolean indicating RTL status
 */
export function isRTLLocale(locale: LocaleCode): boolean {
  const rtlLocales = ['ar', 'he', 'fa', 'ur', 'yi'];
  const language = locale.split('-')[0];
  return rtlLocales.includes(language);
}

/**
 * getTextDirection - Get text direction for locale
 *
 * @param locale - Locale code
 * @returns Text direction
 */
export function getTextDirection(locale: LocaleCode): TextDirection {
  return isRTLLocale(locale) ? 'rtl' : 'ltr';
}

/**
 * DirectionProvider - Component to set text direction
 *
 * @example
 * ```tsx
 * <DirectionProvider>
 *   <App />
 * </DirectionProvider>
 * ```
 */
export function DirectionProvider({ children }: { children: ReactNode }): JSX.Element {
  const { direction } = useDirection();

  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

  return <>{children}</>;
}

/**
 * withDirection - HOC to add direction props
 *
 * @param Component - Component to wrap
 * @returns Wrapped component with direction props
 */
export function withDirection<P extends object>(
  Component: ComponentType<P & { direction: TextDirection; isRTL: boolean }>
): ComponentType<P> {
  return function DirectionWrapper(props: P) {
    const { direction, isRTL } = useDirection();
    return <Component {...props} direction={direction} isRTL={isRTL} />;
  };
}

/* ========================================================================
   COMPONENTS
   ======================================================================== */

/**
 * LocaleSelector - Dropdown component for locale selection
 *
 * @example
 * ```tsx
 * <LocaleSelector
 *   onChange={(locale) => console.log(locale)}
 *   className="locale-selector"
 * />
 * ```
 */
export function LocaleSelector({
  onChange,
  className = '',
  showFlags = true,
}: {
  onChange?: (locale: LocaleCode) => void;
  className?: string;
  showFlags?: boolean;
}): JSX.Element {
  const { locale, locales, setLocale } = useLocale();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as LocaleCode;
    setLocale(newLocale);
    onChange?.(newLocale);
  };

  return (
    <select value={locale} onChange={handleChange} className={className}>
      {locales
        .filter((l) => l.enabled)
        .map((l) => (
          <option key={l.code} value={l.code}>
            {showFlags && l.flag ? `${l.flag} ` : ''}
            {l.nativeName}
          </option>
        ))}
    </select>
  );
}

/**
 * LanguageSwitcher - Button-based language switcher
 *
 * @example
 * ```tsx
 * <LanguageSwitcher locales={['en-US', 'es-ES', 'fr-FR']} />
 * ```
 */
export function LanguageSwitcher({
  locales: localeList,
  className = '',
  showFlags = true,
}: {
  locales?: LocaleCode[];
  className?: string;
  showFlags?: boolean;
}): JSX.Element {
  const { locale, locales, setLocale } = useLocale();

  const availableLocales = localeList
    ? locales.filter((l) => localeList.includes(l.code))
    : locales.filter((l) => l.enabled);

  return (
    <div className={`language-switcher ${className}`}>
      {availableLocales.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className={locale === l.code ? 'active' : ''}
          aria-label={`Switch to ${l.name}`}
        >
          {showFlags && l.flag ? l.flag : l.code.split('-')[0].toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/**
 * TranslationText - Component for displaying translated text
 *
 * @example
 * ```tsx
 * <TranslationText tKey="welcome.title" namespace="home" />
 * ```
 */
export function TranslationText({
  tKey,
  namespace = 'common',
  params,
  count,
  defaultValue,
  as: Component = 'span',
}: {
  tKey: string;
  namespace?: TranslationNamespace;
  params?: TranslationParams;
  count?: number;
  defaultValue?: string;
  as?: keyof JSX.IntrinsicElements;
}): JSX.Element {
  const { t, tc, tp } = useTranslation(namespace);

  let text: string;
  if (count !== undefined) {
    text = tc(tKey, { count, interpolation: params, defaultValue });
  } else if (params) {
    text = tp(tKey, params);
  } else {
    text = t(tKey, { defaultValue });
  }

  return <Component>{text}</Component>;
}

/* ========================================================================
   TRANSLATION MANAGEMENT
   ======================================================================== */

/**
 * getTranslationKeys - Extract all translation keys from data
 *
 * @param data - Translation data
 * @param prefix - Key prefix for nested keys
 * @returns Array of all keys
 */
export function getTranslationKeys(
  data: TranslationData,
  prefix: string = ''
): string[] {
  const keys: string[] = [];

  Object.entries(data).forEach(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      keys.push(fullKey);
    } else if (typeof value === 'object' && value !== null) {
      if (isPluralTranslation(value) || isGenderTranslation(value)) {
        keys.push(fullKey);
      } else {
        keys.push(...getTranslationKeys(value as TranslationData, fullKey));
      }
    }
  });

  return keys;
}

/**
 * getMissingTranslations - Find missing translations
 *
 * @param sourceData - Source translation data
 * @param targetData - Target translation data to check
 * @returns Array of missing keys
 */
export function getMissingTranslations(
  sourceData: TranslationData,
  targetData: TranslationData
): string[] {
  const sourceKeys = getTranslationKeys(sourceData);
  const targetKeys = getTranslationKeys(targetData);

  return sourceKeys.filter((key) => !targetKeys.includes(key));
}

/**
 * validateTranslations - Validate translation data
 *
 * @param data - Translation data to validate
 * @param schema - Optional schema to validate against
 * @returns Validation result
 */
export function validateTranslations(
  data: TranslationData,
  schema?: TranslationData
): TranslationValidation {
  const keys = getTranslationKeys(data);
  const invalidValues: string[] = [];

  // Check for empty values
  keys.forEach((key) => {
    const value = getNestedValue(data, key);
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      invalidValues.push(key);
    }
  });

  let missingKeys: string[] = [];
  let extraKeys: string[] = [];

  if (schema) {
    const schemaKeys = getTranslationKeys(schema);
    missingKeys = schemaKeys.filter((key) => !keys.includes(key));
    extraKeys = keys.filter((key) => !schemaKeys.includes(key));
  }

  return {
    isValid: invalidValues.length === 0 && missingKeys.length === 0,
    missingKeys,
    extraKeys,
    invalidValues,
  };
}

/**
 * mergeTranslations - Merge multiple translation objects
 *
 * @param translations - Array of translation objects
 * @returns Merged translation object
 */
export function mergeTranslations(...translations: TranslationData[]): TranslationData {
  return translations.reduce((merged, current) => {
    return deepMerge(merged, current);
  }, {});
}

/**
 * flattenTranslations - Flatten nested translations
 *
 * @param data - Translation data to flatten
 * @param separator - Key separator (default: '.')
 * @returns Flattened translation object
 */
export function flattenTranslations(
  data: TranslationData,
  separator: string = '.'
): Record<string, string> {
  const flattened: Record<string, string> = {};

  function flatten(obj: any, prefix: string = '') {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}${separator}${key}` : key;

      if (typeof value === 'string') {
        flattened[fullKey] = value;
      } else if (typeof value === 'object' && value !== null) {
        flatten(value, fullKey);
      }
    });
  }

  flatten(data);
  return flattened;
}

/**
 * unflattenTranslations - Unflatten translations
 *
 * @param data - Flattened translation data
 * @param separator - Key separator (default: '.')
 * @returns Nested translation object
 */
export function unflattenTranslations(
  data: Record<string, string>,
  separator: string = '.'
): TranslationData {
  const unflattened: TranslationData = {};

  Object.entries(data).forEach(([key, value]) => {
    const keys = key.split(separator);
    let current: any = unflattened;

    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        current[k] = value;
      } else {
        current[k] = current[k] || {};
        current = current[k];
      }
    });
  });

  return unflattened;
}

/* ========================================================================
   HOOKS FOR FORMATTERS
   ======================================================================== */

/**
 * useDateFormatter - Hook for date formatting
 *
 * @param options - Date formatting options
 * @returns Date formatter function
 */
export function useDateFormatter(options?: DateLocalizationOptions) {
  const { locale } = useLocale();

  return useCallback(
    (date: Date | number | string) => formatDate(date, locale, options),
    [locale, options]
  );
}

/**
 * useTimeFormatter - Hook for time formatting
 *
 * @param options - Time formatting options
 * @returns Time formatter function
 */
export function useTimeFormatter(options?: DateLocalizationOptions) {
  const { locale } = useLocale();

  return useCallback(
    (date: Date | number | string) => formatTime(date, locale, options),
    [locale, options]
  );
}

/**
 * useNumberFormatter - Hook for number formatting
 *
 * @param options - Number formatting options
 * @returns Number formatter function
 */
export function useNumberFormatter(options?: NumberLocalizationOptions) {
  const { locale } = useLocale();

  return useCallback(
    (value: number) => formatNumber(value, locale, options),
    [locale, options]
  );
}

/**
 * useCurrencyFormatter - Hook for currency formatting
 *
 * @param currency - Currency code
 * @param options - Additional formatting options
 * @returns Currency formatter function
 */
export function useCurrencyFormatter(
  currency: string = 'USD',
  options?: Omit<NumberLocalizationOptions, 'style' | 'currency'>
) {
  const { locale } = useLocale();

  return useCallback(
    (value: number) => formatCurrency(value, locale, currency, options),
    [locale, currency, options]
  );
}

/**
 * useListFormatter - Hook for list formatting
 *
 * @param type - List type
 * @returns List formatter function
 */
export function useListFormatter(
  type: 'conjunction' | 'disjunction' | 'unit' = 'conjunction'
) {
  const { locale } = useLocale();

  return useCallback(
    (items: string[]) => formatList(items, locale, type),
    [locale, type]
  );
}

/* ========================================================================
   UTILITY FUNCTIONS
   ======================================================================== */

/**
 * getNestedValue - Get nested value from object by dot notation
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * interpolateString - Replace placeholders in string
 */
function interpolateString(str: string, params: TranslationParams): string {
  return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = params[key];
    return value !== undefined && value !== null ? String(value) : match;
  });
}

/**
 * isPluralTranslation - Check if object is plural translation
 */
function isPluralTranslation(obj: any): obj is PluralTranslation {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    ('one' in obj || 'other' in obj) &&
    !('masculine' in obj || 'feminine' in obj)
  );
}

/**
 * isGenderTranslation - Check if object is gender translation
 */
function isGenderTranslation(obj: any): obj is GenderTranslation {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    ('masculine' in obj || 'feminine' in obj)
  );
}

/**
 * deepMerge - Deep merge objects
 */
function deepMerge(target: any, source: any): any {
  const result = { ...target };

  Object.keys(source).forEach((key) => {
    if (source[key] instanceof Object && key in target) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  });

  return result;
}

/**
 * detectLocale - Auto-detect user locale
 *
 * @returns Detected locale code
 */
export function detectLocale(): LocaleCode {
  if (typeof navigator === 'undefined') {
    return 'en-US';
  }

  return (navigator.language || 'en-US') as LocaleCode;
}

/**
 * parseLocale - Parse locale code into components
 *
 * @param locale - Locale code to parse
 * @returns Parsed locale components
 */
export function parseLocale(locale: LocaleCode): {
  language: string;
  region?: string;
  script?: string;
} {
  const [language, region] = locale.split('-');
  return { language, region };
}

/**
 * compareLocales - Compare two locale codes
 *
 * @param locale1 - First locale
 * @param locale2 - Second locale
 * @returns Boolean indicating if locales match
 */
export function compareLocales(locale1: LocaleCode, locale2: LocaleCode): boolean {
  const parsed1 = parseLocale(locale1);
  const parsed2 = parseLocale(locale2);

  return parsed1.language === parsed2.language && parsed1.region === parsed2.region;
}

/**
 * getBrowserLocales - Get all browser locales
 *
 * @returns Array of locale codes
 */
export function getBrowserLocales(): LocaleCode[] {
  if (typeof navigator === 'undefined') {
    return ['en-US'];
  }

  const languages = navigator.languages || [navigator.language];
  return languages.map((lang) => lang as LocaleCode);
}

/**
 * matchLocale - Match locale to supported locales
 *
 * @param preferred - Preferred locale
 * @param supported - Array of supported locales
 * @returns Best matching locale or first supported locale
 */
export function matchLocale(
  preferred: LocaleCode,
  supported: LocaleCode[]
): LocaleCode {
  // Exact match
  if (supported.includes(preferred)) {
    return preferred;
  }

  // Language-only match
  const preferredLang = preferred.split('-')[0];
  const langMatch = supported.find((locale) => locale.startsWith(preferredLang));
  if (langMatch) {
    return langMatch;
  }

  // Return first supported
  return supported[0];
}

/**
 * getLocaleMetadata - Get metadata for locale
 *
 * @param locale - Locale code
 * @returns Locale metadata
 */
export function getLocaleMetadata(locale: LocaleCode): LocaleMetadata {
  // This would typically fetch from a database or config
  return {
    code: locale,
    name: locale,
    nativeName: locale,
    direction: isRTLLocale(locale) ? 'rtl' : 'ltr',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    firstDayOfWeek: 0,
    enabled: true,
  };
}

/**
 * TranslationNamespaceLoader - Component to lazy load namespace
 *
 * @example
 * ```tsx
 * <TranslationNamespaceLoader namespace="products" fallback={<Spinner />}>
 *   <ProductList />
 * </TranslationNamespaceLoader>
 * ```
 */
export function TranslationNamespaceLoader({
  namespace,
  children,
  fallback = null,
}: {
  namespace: TranslationNamespace;
  children: ReactNode;
  fallback?: ReactNode;
}): JSX.Element {
  const { ready } = useTranslation(namespace);

  if (!ready) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * withTranslation - HOC to inject translation functions
 *
 * @param namespace - Translation namespace
 * @returns HOC function
 */
export function withTranslation(namespace: TranslationNamespace = 'common') {
  return function <P extends object>(
    Component: ComponentType<P & ReturnType<typeof useTranslation>>
  ): ComponentType<P> {
    return function TranslationWrapper(props: P) {
      const translation = useTranslation(namespace);
      return <Component {...props} {...translation} />;
    };
  };
}

/**
 * exportTranslations - Export translations to JSON
 *
 * @param data - Translation data to export
 * @param pretty - Format JSON with indentation
 * @returns JSON string
 */
export function exportTranslations(data: TranslationData, pretty: boolean = true): string {
  return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
}

/**
 * importTranslations - Import translations from JSON
 *
 * @param json - JSON string to import
 * @returns Parsed translation data
 */
export function importTranslations(json: string): TranslationData {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('Failed to import translations:', error);
    return {};
  }
}
