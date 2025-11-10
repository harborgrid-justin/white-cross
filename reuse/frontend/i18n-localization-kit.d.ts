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
import { ReactNode, ComponentType } from 'react';
/**
 * Supported locale codes (BCP 47)
 */
export type LocaleCode = 'en-US' | 'en-GB' | 'es-ES' | 'es-MX' | 'fr-FR' | 'de-DE' | 'it-IT' | 'pt-BR' | 'pt-PT' | 'ja-JP' | 'zh-CN' | 'zh-TW' | 'ko-KR' | 'ar-SA' | 'he-IL' | 'ru-RU' | 'nl-NL' | 'pl-PL' | 'tr-TR' | 'vi-VN' | 'th-TH' | 'id-ID' | 'ms-MY' | 'sv-SE' | 'da-DK' | 'fi-FI' | 'no-NO' | 'cs-CZ' | 'hu-HU' | 'ro-RO' | 'uk-UA' | string;
/**
 * Text direction for RTL languages
 */
export type TextDirection = 'ltr' | 'rtl';
/**
 * Translation namespace for organizing translations
 */
export type TranslationNamespace = 'common' | 'auth' | 'dashboard' | 'forms' | 'errors' | 'navigation' | 'products' | 'checkout' | 'account' | 'settings' | string;
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
    firstDayOfWeek: number;
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
export type TranslationLoader = (locale: LocaleCode, namespace: TranslationNamespace) => Promise<TranslationData>;
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
export declare function LocaleProvider({ children, config, initialLocale, onLocaleChange, }: LocaleProviderProps): JSX.Element;
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
export declare function TranslationProvider({ children, loader, preloadNamespaces, cacheEnabled, cacheTTL, // 1 hour
onMissingTranslation, }: TranslationProviderProps): JSX.Element;
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
export declare function useLocale(): LocaleContextValue;
/**
 * useLanguage - Alias for useLocale (common naming pattern)
 *
 * @returns Locale context
 */
export declare function useLanguage(): LocaleContextValue;
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
export declare function useTranslation(namespace?: TranslationNamespace): {
    t: any;
    tc: any;
    tp: any;
    ready: boolean;
    isLoading: any;
    namespace: string;
    locale: string;
};
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
export declare function useTranslations(namespaces: TranslationNamespace[]): {
    t: any;
    ready: boolean;
    locale: string;
};
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
export declare function useDirection(): {
    direction: TextDirection;
    isRTL: boolean;
    isLTR: boolean;
    dir: TextDirection;
};
/**
 * useRTL - Check if current locale is RTL
 *
 * @returns Boolean indicating RTL status
 */
export declare function useRTL(): boolean;
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
export declare function loadTranslations(locale: LocaleCode, namespace: TranslationNamespace): Promise<TranslationData>;
/**
 * fetchTranslations - Fetch translations with options
 *
 * @param locale - Locale to fetch
 * @param namespaces - Namespaces to fetch
 * @param options - Fetch options
 * @returns Promise with translation bundles
 */
export declare function fetchTranslations(locale: LocaleCode, namespaces: TranslationNamespace[], options?: RequestInit): Promise<TranslationBundle[]>;
/**
 * cacheTranslations - Cache translations in memory/storage
 *
 * @param bundles - Translation bundles to cache
 * @param storage - Storage mechanism ('memory' | 'localStorage' | 'sessionStorage')
 */
export declare function cacheTranslations(bundles: TranslationBundle[], storage?: 'memory' | 'localStorage' | 'sessionStorage'): void;
/**
 * clearTranslationCache - Clear cached translations
 *
 * @param locale - Optional locale to clear (clears all if omitted)
 * @param namespace - Optional namespace to clear
 */
export declare function clearTranslationCache(locale?: LocaleCode, namespace?: TranslationNamespace): void;
/**
 * preloadTranslations - Preload translations for faster rendering
 *
 * @param locale - Locale to preload
 * @param namespaces - Namespaces to preload
 * @returns Promise that resolves when preloading is complete
 */
export declare function preloadTranslations(locale: LocaleCode, namespaces: TranslationNamespace[]): Promise<void>;
/**
 * lazyLoadTranslations - Lazy load translations on demand
 *
 * @param locale - Locale to load
 * @param namespace - Namespace to load
 * @returns Promise with translation data
 */
export declare function lazyLoadTranslations(locale: LocaleCode, namespace: TranslationNamespace): Promise<TranslationData>;
/**
 * splitTranslations - Split large translation files into chunks
 *
 * @param translations - Translation data to split
 * @param chunkSize - Maximum keys per chunk
 * @returns Array of translation chunks
 */
export declare function splitTranslations(translations: TranslationData, chunkSize?: number): TranslationData[];
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
export declare function formatDate(date: Date | number | string, locale: LocaleCode, options?: DateLocalizationOptions): string;
/**
 * formatTime - Format time according to locale
 *
 * @param date - Date/time to format
 * @param locale - Locale code
 * @param options - Formatting options
 * @returns Formatted time string
 */
export declare function formatTime(date: Date | number | string, locale: LocaleCode, options?: DateLocalizationOptions): string;
/**
 * formatDateTime - Format date and time according to locale
 *
 * @param date - Date/time to format
 * @param locale - Locale code
 * @param options - Formatting options
 * @returns Formatted date-time string
 */
export declare function formatDateTime(date: Date | number | string, locale: LocaleCode, options?: DateLocalizationOptions): string;
/**
 * formatRelativeTime - Format relative time (e.g., "2 hours ago")
 *
 * @param date - Date to compare
 * @param locale - Locale code
 * @param baseDate - Base date for comparison (defaults to now)
 * @returns Relative time string
 */
export declare function formatRelativeTime(date: Date | number | string, locale: LocaleCode, baseDate?: Date): string;
/**
 * formatNumber - Format number according to locale
 *
 * @param value - Number to format
 * @param locale - Locale code
 * @param options - Formatting options
 * @returns Formatted number string
 */
export declare function formatNumber(value: number, locale: LocaleCode, options?: NumberLocalizationOptions): string;
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
export declare function formatCurrency(value: number, locale: LocaleCode, currency?: string, options?: Omit<NumberLocalizationOptions, 'style' | 'currency'>): string;
/**
 * formatPercentage - Format percentage according to locale
 *
 * @param value - Value to format (0.5 = 50%)
 * @param locale - Locale code
 * @param options - Formatting options
 * @returns Formatted percentage string
 */
export declare function formatPercentage(value: number, locale: LocaleCode, options?: Omit<NumberLocalizationOptions, 'style'>): string;
/**
 * formatCompactNumber - Format number in compact notation
 *
 * @param value - Number to format
 * @param locale - Locale code
 * @returns Compact number string (e.g., "1.2K", "3.4M")
 */
export declare function formatCompactNumber(value: number, locale: LocaleCode): string;
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
export declare function formatList(items: string[], locale: LocaleCode, type?: 'conjunction' | 'disjunction' | 'unit'): string;
/**
 * getPluralCategory - Get plural category for number in locale
 *
 * @param count - Number to categorize
 * @param locale - Locale code
 * @returns Plural category
 */
export declare function getPluralCategory(count: number, locale: LocaleCode): PluralCategory;
/**
 * getPluralRules - Get all plural rules for locale
 *
 * @param locale - Locale code
 * @returns Array of plural categories used in locale
 */
export declare function getPluralRules(locale: LocaleCode): PluralCategory[];
/**
 * selectPlural - Select correct plural form
 *
 * @param count - Number for selection
 * @param forms - Plural forms object
 * @param locale - Locale code
 * @returns Selected plural form
 */
export declare function selectPlural(count: number, forms: PluralTranslation, locale: LocaleCode): string;
/**
 * selectGender - Select correct gender form
 *
 * @param gender - Gender category
 * @param forms - Gender forms object
 * @returns Selected gender form
 */
export declare function selectGender(gender: GenderCategory, forms: GenderTranslation): string;
/**
 * isRTLLocale - Check if locale uses RTL
 *
 * @param locale - Locale code
 * @returns Boolean indicating RTL status
 */
export declare function isRTLLocale(locale: LocaleCode): boolean;
/**
 * getTextDirection - Get text direction for locale
 *
 * @param locale - Locale code
 * @returns Text direction
 */
export declare function getTextDirection(locale: LocaleCode): TextDirection;
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
export declare function DirectionProvider({ children }: {
    children: ReactNode;
}): JSX.Element;
/**
 * withDirection - HOC to add direction props
 *
 * @param Component - Component to wrap
 * @returns Wrapped component with direction props
 */
export declare function withDirection<P extends object>(Component: ComponentType<P & {
    direction: TextDirection;
    isRTL: boolean;
}>): ComponentType<P>;
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
export declare function LocaleSelector({ onChange, className, showFlags, }: {
    onChange?: (locale: LocaleCode) => void;
    className?: string;
    showFlags?: boolean;
}): JSX.Element;
/**
 * LanguageSwitcher - Button-based language switcher
 *
 * @example
 * ```tsx
 * <LanguageSwitcher locales={['en-US', 'es-ES', 'fr-FR']} />
 * ```
 */
export declare function LanguageSwitcher({ locales: localeList, className, showFlags, }: {
    locales?: LocaleCode[];
    className?: string;
    showFlags?: boolean;
}): JSX.Element;
/**
 * TranslationText - Component for displaying translated text
 *
 * @example
 * ```tsx
 * <TranslationText tKey="welcome.title" namespace="home" />
 * ```
 */
export declare function TranslationText({ tKey, namespace, params, count, defaultValue, as: Component, }: {
    tKey: string;
    namespace?: TranslationNamespace;
    params?: TranslationParams;
    count?: number;
    defaultValue?: string;
    as?: keyof JSX.IntrinsicElements;
}): JSX.Element;
/**
 * getTranslationKeys - Extract all translation keys from data
 *
 * @param data - Translation data
 * @param prefix - Key prefix for nested keys
 * @returns Array of all keys
 */
export declare function getTranslationKeys(data: TranslationData, prefix?: string): string[];
/**
 * getMissingTranslations - Find missing translations
 *
 * @param sourceData - Source translation data
 * @param targetData - Target translation data to check
 * @returns Array of missing keys
 */
export declare function getMissingTranslations(sourceData: TranslationData, targetData: TranslationData): string[];
/**
 * validateTranslations - Validate translation data
 *
 * @param data - Translation data to validate
 * @param schema - Optional schema to validate against
 * @returns Validation result
 */
export declare function validateTranslations(data: TranslationData, schema?: TranslationData): TranslationValidation;
/**
 * mergeTranslations - Merge multiple translation objects
 *
 * @param translations - Array of translation objects
 * @returns Merged translation object
 */
export declare function mergeTranslations(...translations: TranslationData[]): TranslationData;
/**
 * flattenTranslations - Flatten nested translations
 *
 * @param data - Translation data to flatten
 * @param separator - Key separator (default: '.')
 * @returns Flattened translation object
 */
export declare function flattenTranslations(data: TranslationData, separator?: string): Record<string, string>;
/**
 * unflattenTranslations - Unflatten translations
 *
 * @param data - Flattened translation data
 * @param separator - Key separator (default: '.')
 * @returns Nested translation object
 */
export declare function unflattenTranslations(data: Record<string, string>, separator?: string): TranslationData;
/**
 * useDateFormatter - Hook for date formatting
 *
 * @param options - Date formatting options
 * @returns Date formatter function
 */
export declare function useDateFormatter(options?: DateLocalizationOptions): any;
/**
 * useTimeFormatter - Hook for time formatting
 *
 * @param options - Time formatting options
 * @returns Time formatter function
 */
export declare function useTimeFormatter(options?: DateLocalizationOptions): any;
/**
 * useNumberFormatter - Hook for number formatting
 *
 * @param options - Number formatting options
 * @returns Number formatter function
 */
export declare function useNumberFormatter(options?: NumberLocalizationOptions): any;
/**
 * useCurrencyFormatter - Hook for currency formatting
 *
 * @param currency - Currency code
 * @param options - Additional formatting options
 * @returns Currency formatter function
 */
export declare function useCurrencyFormatter(currency?: string, options?: Omit<NumberLocalizationOptions, 'style' | 'currency'>): any;
/**
 * useListFormatter - Hook for list formatting
 *
 * @param type - List type
 * @returns List formatter function
 */
export declare function useListFormatter(type?: 'conjunction' | 'disjunction' | 'unit'): any;
/**
 * detectLocale - Auto-detect user locale
 *
 * @returns Detected locale code
 */
export declare function detectLocale(): LocaleCode;
/**
 * parseLocale - Parse locale code into components
 *
 * @param locale - Locale code to parse
 * @returns Parsed locale components
 */
export declare function parseLocale(locale: LocaleCode): {
    language: string;
    region?: string;
    script?: string;
};
/**
 * compareLocales - Compare two locale codes
 *
 * @param locale1 - First locale
 * @param locale2 - Second locale
 * @returns Boolean indicating if locales match
 */
export declare function compareLocales(locale1: LocaleCode, locale2: LocaleCode): boolean;
/**
 * getBrowserLocales - Get all browser locales
 *
 * @returns Array of locale codes
 */
export declare function getBrowserLocales(): LocaleCode[];
/**
 * matchLocale - Match locale to supported locales
 *
 * @param preferred - Preferred locale
 * @param supported - Array of supported locales
 * @returns Best matching locale or first supported locale
 */
export declare function matchLocale(preferred: LocaleCode, supported: LocaleCode[]): LocaleCode;
/**
 * getLocaleMetadata - Get metadata for locale
 *
 * @param locale - Locale code
 * @returns Locale metadata
 */
export declare function getLocaleMetadata(locale: LocaleCode): LocaleMetadata;
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
export declare function TranslationNamespaceLoader({ namespace, children, fallback, }: {
    namespace: TranslationNamespace;
    children: ReactNode;
    fallback?: ReactNode;
}): JSX.Element;
/**
 * withTranslation - HOC to inject translation functions
 *
 * @param namespace - Translation namespace
 * @returns HOC function
 */
export declare function withTranslation(namespace?: TranslationNamespace): <P extends object>(Component: ComponentType<P & ReturnType<typeof useTranslation>>) => ComponentType<P>;
/**
 * exportTranslations - Export translations to JSON
 *
 * @param data - Translation data to export
 * @param pretty - Format JSON with indentation
 * @returns JSON string
 */
export declare function exportTranslations(data: TranslationData, pretty?: boolean): string;
/**
 * importTranslations - Import translations from JSON
 *
 * @param json - JSON string to import
 * @returns Parsed translation data
 */
export declare function importTranslations(json: string): TranslationData;
export {};
//# sourceMappingURL=i18n-localization-kit.d.ts.map