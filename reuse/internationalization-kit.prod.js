"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationInterceptor = exports.LocaleMiddleware = exports.SupportedLocales = exports.LOCALE_METADATA_KEY = exports.CurrentLocale = exports.DEFAULT_LOCALE_CONFIGS = exports.UserLanguagePreferenceDto = exports.TranslationResponseDto = exports.TranslateRequestDto = exports.TranslationEntryDto = exports.LocaleConfigDto = exports.BulkTranslationImportSchema = exports.CurrencyFormatOptionsSchema = exports.UserLanguagePreferenceSchema = exports.TranslationOptionsSchema = exports.TranslationEntrySchema = exports.LocaleConfigSchema = exports.TranslationNamespace = exports.NumberStyle = exports.DateTimeStyle = exports.PluralCategory = exports.TextDirection = exports.LanguageCode = void 0;
exports.getLocaleConfig = getLocaleConfig;
exports.getEnabledLocales = getEnabledLocales;
exports.isRTLLocale = isRTLLocale;
exports.getTextDirection = getTextDirection;
exports.getFallbackChain = getFallbackChain;
exports.detectLocaleFromHeader = detectLocaleFromHeader;
exports.parseAcceptLanguage = parseAcceptLanguage;
exports.detectLocaleFromRequest = detectLocaleFromRequest;
exports.detectUserLocale = detectUserLocale;
exports.loadTranslations = loadTranslations;
exports.getTranslation = getTranslation;
exports.interpolateTranslation = interpolateTranslation;
exports.getPluralizedKey = getPluralizedKey;
exports.getPluralCategory = getPluralCategory;
exports.translatePlural = translatePlural;
exports.hasTranslation = hasTranslation;
exports.getTranslationKeys = getTranslationKeys;
exports.clearTranslationCache = clearTranslationCache;
exports.getTranslationCacheStats = getTranslationCacheStats;
exports.formatNumber = formatNumber;
exports.formatCurrency = formatCurrency;
exports.formatPercentage = formatPercentage;
exports.parseLocalizedNumber = parseLocalizedNumber;
exports.formatDate = formatDate;
exports.formatTime = formatTime;
exports.formatDateTime = formatDateTime;
exports.formatRelativeTime = formatRelativeTime;
exports.formatDateRange = formatDateRange;
exports.getDirectionConfig = getDirectionConfig;
exports.getDirectionalStyles = getDirectionalStyles;
exports.mirrorForRTL = mirrorForRTL;
exports.getAccessibilityMetadata = getAccessibilityMetadata;
exports.getHTMLLangAttribute = getHTMLLangAttribute;
exports.createARIAAnnouncement = createARIAAnnouncement;
exports.getAccessibleFormField = getAccessibleFormField;
exports.isValidLocale = isValidLocale;
exports.getBestMatchingLocale = getBestMatchingLocale;
exports.getTranslationCoverage = getTranslationCoverage;
exports.createLocaleSwitcher = createLocaleSwitcher;
exports.exportTranslationsToJSON = exportTranslationsToJSON;
exports.importTranslationsFromJSON = importTranslationsFromJSON;
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
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Supported language codes (ISO 639-1)
 */
var LanguageCode;
(function (LanguageCode) {
    LanguageCode["EN"] = "en";
    LanguageCode["ES"] = "es";
    LanguageCode["FR"] = "fr";
    LanguageCode["DE"] = "de";
    LanguageCode["IT"] = "it";
    LanguageCode["PT"] = "pt";
    LanguageCode["RU"] = "ru";
    LanguageCode["ZH"] = "zh";
    LanguageCode["JA"] = "ja";
    LanguageCode["KO"] = "ko";
    LanguageCode["AR"] = "ar";
    LanguageCode["HE"] = "he";
    LanguageCode["HI"] = "hi";
    LanguageCode["BN"] = "bn";
    LanguageCode["TR"] = "tr";
    LanguageCode["NL"] = "nl";
    LanguageCode["PL"] = "pl";
    LanguageCode["VI"] = "vi";
    LanguageCode["TH"] = "th";
    LanguageCode["SV"] = "sv";
})(LanguageCode || (exports.LanguageCode = LanguageCode = {}));
/**
 * Text direction for languages
 */
var TextDirection;
(function (TextDirection) {
    TextDirection["LTR"] = "ltr";
    TextDirection["RTL"] = "rtl";
})(TextDirection || (exports.TextDirection = TextDirection = {}));
/**
 * Pluralization categories (CLDR-based)
 */
var PluralCategory;
(function (PluralCategory) {
    PluralCategory["ZERO"] = "zero";
    PluralCategory["ONE"] = "one";
    PluralCategory["TWO"] = "two";
    PluralCategory["FEW"] = "few";
    PluralCategory["MANY"] = "many";
    PluralCategory["OTHER"] = "other";
})(PluralCategory || (exports.PluralCategory = PluralCategory = {}));
/**
 * Date/Time formatting styles
 */
var DateTimeStyle;
(function (DateTimeStyle) {
    DateTimeStyle["FULL"] = "full";
    DateTimeStyle["LONG"] = "long";
    DateTimeStyle["MEDIUM"] = "medium";
    DateTimeStyle["SHORT"] = "short";
})(DateTimeStyle || (exports.DateTimeStyle = DateTimeStyle = {}));
/**
 * Number formatting styles
 */
var NumberStyle;
(function (NumberStyle) {
    NumberStyle["DECIMAL"] = "decimal";
    NumberStyle["CURRENCY"] = "currency";
    NumberStyle["PERCENT"] = "percent";
    NumberStyle["UNIT"] = "unit";
})(NumberStyle || (exports.NumberStyle = NumberStyle = {}));
/**
 * Translation namespace types
 */
var TranslationNamespace;
(function (TranslationNamespace) {
    TranslationNamespace["COMMON"] = "common";
    TranslationNamespace["MEDICAL"] = "medical";
    TranslationNamespace["ERRORS"] = "errors";
    TranslationNamespace["VALIDATION"] = "validation";
    TranslationNamespace["APPOINTMENTS"] = "appointments";
    TranslationNamespace["PATIENTS"] = "patients";
    TranslationNamespace["BILLING"] = "billing";
    TranslationNamespace["NOTIFICATIONS"] = "notifications";
    TranslationNamespace["ACCESSIBILITY"] = "accessibility";
})(TranslationNamespace || (exports.TranslationNamespace = TranslationNamespace = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
/**
 * Locale configuration schema
 */
exports.LocaleConfigSchema = zod_1.z.object({
    code: zod_1.z.nativeEnum(LanguageCode),
    name: zod_1.z.string().min(1, 'Locale name is required'),
    nativeName: zod_1.z.string().min(1, 'Native name is required'),
    direction: zod_1.z.nativeEnum(TextDirection),
    dateFormat: zod_1.z.string().min(1, 'Date format is required'),
    timeFormat: zod_1.z.string().min(1, 'Time format is required'),
    firstDayOfWeek: zod_1.z.number().int().min(0).max(6),
    currency: zod_1.z.string().length(3, 'Currency must be ISO 4217 code'),
    decimalSeparator: zod_1.z.string().length(1),
    thousandsSeparator: zod_1.z.string().length(1),
    enabled: zod_1.z.boolean().default(true),
    fallbackLocale: zod_1.z.nativeEnum(LanguageCode).optional(),
});
/**
 * Translation entry schema
 */
exports.TranslationEntrySchema = zod_1.z.object({
    key: zod_1.z.string().min(1, 'Translation key is required'),
    value: zod_1.z.string().min(1, 'Translation value is required'),
    namespace: zod_1.z.nativeEnum(TranslationNamespace).default(TranslationNamespace.COMMON),
    locale: zod_1.z.nativeEnum(LanguageCode),
    pluralForm: zod_1.z.nativeEnum(PluralCategory).optional(),
    context: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Translation options schema
 */
exports.TranslationOptionsSchema = zod_1.z.object({
    locale: zod_1.z.nativeEnum(LanguageCode).optional(),
    fallbackLocale: zod_1.z.nativeEnum(LanguageCode).optional(),
    namespace: zod_1.z.nativeEnum(TranslationNamespace).optional(),
    defaultValue: zod_1.z.string().optional(),
    interpolation: zod_1.z.record(zod_1.z.any()).optional(),
    count: zod_1.z.number().optional(),
    context: zod_1.z.string().optional(),
});
/**
 * User language preference schema
 */
exports.UserLanguagePreferenceSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('Invalid user ID'),
    preferredLocale: zod_1.z.nativeEnum(LanguageCode),
    fallbackLocales: zod_1.z.array(zod_1.z.nativeEnum(LanguageCode)).default([LanguageCode.EN]),
    autoDetect: zod_1.z.boolean().default(true),
    dateFormat: zod_1.z.string().optional(),
    timeFormat: zod_1.z.string().optional(),
    timezone: zod_1.z.string().optional(),
});
/**
 * Currency format options schema
 */
exports.CurrencyFormatOptionsSchema = zod_1.z.object({
    locale: zod_1.z.nativeEnum(LanguageCode).optional(),
    currency: zod_1.z.string().length(3, 'Currency must be ISO 4217 code'),
    display: zod_1.z.enum(['symbol', 'narrowSymbol', 'code', 'name']).optional().default('symbol'),
    minimumFractionDigits: zod_1.z.number().int().min(0).max(20).optional(),
    maximumFractionDigits: zod_1.z.number().int().min(0).max(20).optional(),
    useGrouping: zod_1.z.boolean().optional().default(true),
});
/**
 * Bulk translation import schema
 */
exports.BulkTranslationImportSchema = zod_1.z.object({
    locale: zod_1.z.nativeEnum(LanguageCode),
    namespace: zod_1.z.nativeEnum(TranslationNamespace),
    translations: zod_1.z.record(zod_1.z.string()),
    overwrite: zod_1.z.boolean().default(false),
});
// ============================================================================
// SWAGGER/OPENAPI DTOs
// ============================================================================
/**
 * Locale configuration DTO with Swagger decorators
 */
let LocaleConfigDto = (() => {
    var _a;
    let _code_decorators;
    let _code_initializers = [];
    let _code_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _nativeName_decorators;
    let _nativeName_initializers = [];
    let _nativeName_extraInitializers = [];
    let _direction_decorators;
    let _direction_initializers = [];
    let _direction_extraInitializers = [];
    let _dateFormat_decorators;
    let _dateFormat_initializers = [];
    let _dateFormat_extraInitializers = [];
    let _timeFormat_decorators;
    let _timeFormat_initializers = [];
    let _timeFormat_extraInitializers = [];
    let _firstDayOfWeek_decorators;
    let _firstDayOfWeek_initializers = [];
    let _firstDayOfWeek_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _decimalSeparator_decorators;
    let _decimalSeparator_initializers = [];
    let _decimalSeparator_extraInitializers = [];
    let _thousandsSeparator_decorators;
    let _thousandsSeparator_initializers = [];
    let _thousandsSeparator_extraInitializers = [];
    let _enabled_decorators;
    let _enabled_initializers = [];
    let _enabled_extraInitializers = [];
    let _fallbackLocale_decorators;
    let _fallbackLocale_initializers = [];
    let _fallbackLocale_extraInitializers = [];
    return _a = class LocaleConfigDto {
            constructor() {
                this.code = __runInitializers(this, _code_initializers, void 0);
                this.name = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.nativeName = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _nativeName_initializers, void 0));
                this.direction = (__runInitializers(this, _nativeName_extraInitializers), __runInitializers(this, _direction_initializers, void 0));
                this.dateFormat = (__runInitializers(this, _direction_extraInitializers), __runInitializers(this, _dateFormat_initializers, void 0));
                this.timeFormat = (__runInitializers(this, _dateFormat_extraInitializers), __runInitializers(this, _timeFormat_initializers, void 0));
                this.firstDayOfWeek = (__runInitializers(this, _timeFormat_extraInitializers), __runInitializers(this, _firstDayOfWeek_initializers, void 0));
                this.currency = (__runInitializers(this, _firstDayOfWeek_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.decimalSeparator = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _decimalSeparator_initializers, void 0));
                this.thousandsSeparator = (__runInitializers(this, _decimalSeparator_extraInitializers), __runInitializers(this, _thousandsSeparator_initializers, void 0));
                this.enabled = (__runInitializers(this, _thousandsSeparator_extraInitializers), __runInitializers(this, _enabled_initializers, void 0));
                this.fallbackLocale = (__runInitializers(this, _enabled_extraInitializers), __runInitializers(this, _fallbackLocale_initializers, void 0));
                __runInitializers(this, _fallbackLocale_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _code_decorators = [(0, swagger_1.ApiProperty)({ enum: LanguageCode, description: 'Language code (ISO 639-1)' })];
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'English', description: 'Locale name in English' })];
            _nativeName_decorators = [(0, swagger_1.ApiProperty)({ example: 'English', description: 'Locale name in native language' })];
            _direction_decorators = [(0, swagger_1.ApiProperty)({ enum: TextDirection, description: 'Text direction' })];
            _dateFormat_decorators = [(0, swagger_1.ApiProperty)({ example: 'MM/DD/YYYY', description: 'Date format pattern' })];
            _timeFormat_decorators = [(0, swagger_1.ApiProperty)({ example: 'HH:mm:ss', description: 'Time format pattern' })];
            _firstDayOfWeek_decorators = [(0, swagger_1.ApiProperty)({ example: 0, description: 'First day of week (0=Sunday, 1=Monday)' })];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ example: 'USD', description: 'Default currency (ISO 4217)' })];
            _decimalSeparator_decorators = [(0, swagger_1.ApiProperty)({ example: '.', description: 'Decimal separator' })];
            _thousandsSeparator_decorators = [(0, swagger_1.ApiProperty)({ example: ',', description: 'Thousands separator' })];
            _enabled_decorators = [(0, swagger_1.ApiProperty)({ example: true, description: 'Whether locale is enabled' })];
            _fallbackLocale_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: LanguageCode, description: 'Fallback locale' })];
            __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: obj => "code" in obj, get: obj => obj.code, set: (obj, value) => { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _nativeName_decorators, { kind: "field", name: "nativeName", static: false, private: false, access: { has: obj => "nativeName" in obj, get: obj => obj.nativeName, set: (obj, value) => { obj.nativeName = value; } }, metadata: _metadata }, _nativeName_initializers, _nativeName_extraInitializers);
            __esDecorate(null, null, _direction_decorators, { kind: "field", name: "direction", static: false, private: false, access: { has: obj => "direction" in obj, get: obj => obj.direction, set: (obj, value) => { obj.direction = value; } }, metadata: _metadata }, _direction_initializers, _direction_extraInitializers);
            __esDecorate(null, null, _dateFormat_decorators, { kind: "field", name: "dateFormat", static: false, private: false, access: { has: obj => "dateFormat" in obj, get: obj => obj.dateFormat, set: (obj, value) => { obj.dateFormat = value; } }, metadata: _metadata }, _dateFormat_initializers, _dateFormat_extraInitializers);
            __esDecorate(null, null, _timeFormat_decorators, { kind: "field", name: "timeFormat", static: false, private: false, access: { has: obj => "timeFormat" in obj, get: obj => obj.timeFormat, set: (obj, value) => { obj.timeFormat = value; } }, metadata: _metadata }, _timeFormat_initializers, _timeFormat_extraInitializers);
            __esDecorate(null, null, _firstDayOfWeek_decorators, { kind: "field", name: "firstDayOfWeek", static: false, private: false, access: { has: obj => "firstDayOfWeek" in obj, get: obj => obj.firstDayOfWeek, set: (obj, value) => { obj.firstDayOfWeek = value; } }, metadata: _metadata }, _firstDayOfWeek_initializers, _firstDayOfWeek_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _decimalSeparator_decorators, { kind: "field", name: "decimalSeparator", static: false, private: false, access: { has: obj => "decimalSeparator" in obj, get: obj => obj.decimalSeparator, set: (obj, value) => { obj.decimalSeparator = value; } }, metadata: _metadata }, _decimalSeparator_initializers, _decimalSeparator_extraInitializers);
            __esDecorate(null, null, _thousandsSeparator_decorators, { kind: "field", name: "thousandsSeparator", static: false, private: false, access: { has: obj => "thousandsSeparator" in obj, get: obj => obj.thousandsSeparator, set: (obj, value) => { obj.thousandsSeparator = value; } }, metadata: _metadata }, _thousandsSeparator_initializers, _thousandsSeparator_extraInitializers);
            __esDecorate(null, null, _enabled_decorators, { kind: "field", name: "enabled", static: false, private: false, access: { has: obj => "enabled" in obj, get: obj => obj.enabled, set: (obj, value) => { obj.enabled = value; } }, metadata: _metadata }, _enabled_initializers, _enabled_extraInitializers);
            __esDecorate(null, null, _fallbackLocale_decorators, { kind: "field", name: "fallbackLocale", static: false, private: false, access: { has: obj => "fallbackLocale" in obj, get: obj => obj.fallbackLocale, set: (obj, value) => { obj.fallbackLocale = value; } }, metadata: _metadata }, _fallbackLocale_initializers, _fallbackLocale_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.LocaleConfigDto = LocaleConfigDto;
/**
 * Translation entry DTO
 */
let TranslationEntryDto = (() => {
    var _a;
    let _key_decorators;
    let _key_initializers = [];
    let _key_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _namespace_decorators;
    let _namespace_initializers = [];
    let _namespace_extraInitializers = [];
    let _locale_decorators;
    let _locale_initializers = [];
    let _locale_extraInitializers = [];
    let _pluralForm_decorators;
    let _pluralForm_initializers = [];
    let _pluralForm_extraInitializers = [];
    let _context_decorators;
    let _context_initializers = [];
    let _context_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class TranslationEntryDto {
            constructor() {
                this.key = __runInitializers(this, _key_initializers, void 0);
                this.value = (__runInitializers(this, _key_extraInitializers), __runInitializers(this, _value_initializers, void 0));
                this.namespace = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _namespace_initializers, void 0));
                this.locale = (__runInitializers(this, _namespace_extraInitializers), __runInitializers(this, _locale_initializers, void 0));
                this.pluralForm = (__runInitializers(this, _locale_extraInitializers), __runInitializers(this, _pluralForm_initializers, void 0));
                this.context = (__runInitializers(this, _pluralForm_extraInitializers), __runInitializers(this, _context_initializers, void 0));
                this.metadata = (__runInitializers(this, _context_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _key_decorators = [(0, swagger_1.ApiProperty)({ example: 'common.welcome', description: 'Translation key' })];
            _value_decorators = [(0, swagger_1.ApiProperty)({ example: 'Welcome to White Cross', description: 'Translated value' })];
            _namespace_decorators = [(0, swagger_1.ApiProperty)({ enum: TranslationNamespace, description: 'Translation namespace' })];
            _locale_decorators = [(0, swagger_1.ApiProperty)({ enum: LanguageCode, description: 'Language code' })];
            _pluralForm_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: PluralCategory, description: 'Plural form category' })];
            _context_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'greeting', description: 'Translation context' })];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
            __esDecorate(null, null, _key_decorators, { kind: "field", name: "key", static: false, private: false, access: { has: obj => "key" in obj, get: obj => obj.key, set: (obj, value) => { obj.key = value; } }, metadata: _metadata }, _key_initializers, _key_extraInitializers);
            __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(null, null, _namespace_decorators, { kind: "field", name: "namespace", static: false, private: false, access: { has: obj => "namespace" in obj, get: obj => obj.namespace, set: (obj, value) => { obj.namespace = value; } }, metadata: _metadata }, _namespace_initializers, _namespace_extraInitializers);
            __esDecorate(null, null, _locale_decorators, { kind: "field", name: "locale", static: false, private: false, access: { has: obj => "locale" in obj, get: obj => obj.locale, set: (obj, value) => { obj.locale = value; } }, metadata: _metadata }, _locale_initializers, _locale_extraInitializers);
            __esDecorate(null, null, _pluralForm_decorators, { kind: "field", name: "pluralForm", static: false, private: false, access: { has: obj => "pluralForm" in obj, get: obj => obj.pluralForm, set: (obj, value) => { obj.pluralForm = value; } }, metadata: _metadata }, _pluralForm_initializers, _pluralForm_extraInitializers);
            __esDecorate(null, null, _context_decorators, { kind: "field", name: "context", static: false, private: false, access: { has: obj => "context" in obj, get: obj => obj.context, set: (obj, value) => { obj.context = value; } }, metadata: _metadata }, _context_initializers, _context_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TranslationEntryDto = TranslationEntryDto;
/**
 * Translation request DTO
 */
let TranslateRequestDto = (() => {
    var _a;
    let _key_decorators;
    let _key_initializers = [];
    let _key_extraInitializers = [];
    let _locale_decorators;
    let _locale_initializers = [];
    let _locale_extraInitializers = [];
    let _namespace_decorators;
    let _namespace_initializers = [];
    let _namespace_extraInitializers = [];
    let _interpolation_decorators;
    let _interpolation_initializers = [];
    let _interpolation_extraInitializers = [];
    let _count_decorators;
    let _count_initializers = [];
    let _count_extraInitializers = [];
    return _a = class TranslateRequestDto {
            constructor() {
                this.key = __runInitializers(this, _key_initializers, void 0);
                this.locale = (__runInitializers(this, _key_extraInitializers), __runInitializers(this, _locale_initializers, void 0));
                this.namespace = (__runInitializers(this, _locale_extraInitializers), __runInitializers(this, _namespace_initializers, void 0));
                this.interpolation = (__runInitializers(this, _namespace_extraInitializers), __runInitializers(this, _interpolation_initializers, void 0));
                this.count = (__runInitializers(this, _interpolation_extraInitializers), __runInitializers(this, _count_initializers, void 0));
                __runInitializers(this, _count_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _key_decorators = [(0, swagger_1.ApiProperty)({ example: 'common.welcome', description: 'Translation key' })];
            _locale_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: LanguageCode, description: 'Target locale' })];
            _namespace_decorators = [(0, swagger_1.ApiPropertyOptional)({ enum: TranslationNamespace, description: 'Namespace' })];
            _interpolation_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: { name: 'John' }, description: 'Interpolation values' })];
            _count_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 5, description: 'Count for pluralization' })];
            __esDecorate(null, null, _key_decorators, { kind: "field", name: "key", static: false, private: false, access: { has: obj => "key" in obj, get: obj => obj.key, set: (obj, value) => { obj.key = value; } }, metadata: _metadata }, _key_initializers, _key_extraInitializers);
            __esDecorate(null, null, _locale_decorators, { kind: "field", name: "locale", static: false, private: false, access: { has: obj => "locale" in obj, get: obj => obj.locale, set: (obj, value) => { obj.locale = value; } }, metadata: _metadata }, _locale_initializers, _locale_extraInitializers);
            __esDecorate(null, null, _namespace_decorators, { kind: "field", name: "namespace", static: false, private: false, access: { has: obj => "namespace" in obj, get: obj => obj.namespace, set: (obj, value) => { obj.namespace = value; } }, metadata: _metadata }, _namespace_initializers, _namespace_extraInitializers);
            __esDecorate(null, null, _interpolation_decorators, { kind: "field", name: "interpolation", static: false, private: false, access: { has: obj => "interpolation" in obj, get: obj => obj.interpolation, set: (obj, value) => { obj.interpolation = value; } }, metadata: _metadata }, _interpolation_initializers, _interpolation_extraInitializers);
            __esDecorate(null, null, _count_decorators, { kind: "field", name: "count", static: false, private: false, access: { has: obj => "count" in obj, get: obj => obj.count, set: (obj, value) => { obj.count = value; } }, metadata: _metadata }, _count_initializers, _count_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TranslateRequestDto = TranslateRequestDto;
/**
 * Translation response DTO
 */
let TranslationResponseDto = (() => {
    var _a;
    let _key_decorators;
    let _key_initializers = [];
    let _key_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _locale_decorators;
    let _locale_initializers = [];
    let _locale_extraInitializers = [];
    let _usedFallback_decorators;
    let _usedFallback_initializers = [];
    let _usedFallback_extraInitializers = [];
    return _a = class TranslationResponseDto {
            constructor() {
                this.key = __runInitializers(this, _key_initializers, void 0);
                this.value = (__runInitializers(this, _key_extraInitializers), __runInitializers(this, _value_initializers, void 0));
                this.locale = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _locale_initializers, void 0));
                this.usedFallback = (__runInitializers(this, _locale_extraInitializers), __runInitializers(this, _usedFallback_initializers, void 0));
                __runInitializers(this, _usedFallback_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _key_decorators = [(0, swagger_1.ApiProperty)({ example: 'common.welcome', description: 'Translation key' })];
            _value_decorators = [(0, swagger_1.ApiProperty)({ example: 'Welcome to White Cross', description: 'Translated value' })];
            _locale_decorators = [(0, swagger_1.ApiProperty)({ enum: LanguageCode, description: 'Locale used' })];
            _usedFallback_decorators = [(0, swagger_1.ApiProperty)({ example: false, description: 'Whether fallback was used' })];
            __esDecorate(null, null, _key_decorators, { kind: "field", name: "key", static: false, private: false, access: { has: obj => "key" in obj, get: obj => obj.key, set: (obj, value) => { obj.key = value; } }, metadata: _metadata }, _key_initializers, _key_extraInitializers);
            __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(null, null, _locale_decorators, { kind: "field", name: "locale", static: false, private: false, access: { has: obj => "locale" in obj, get: obj => obj.locale, set: (obj, value) => { obj.locale = value; } }, metadata: _metadata }, _locale_initializers, _locale_extraInitializers);
            __esDecorate(null, null, _usedFallback_decorators, { kind: "field", name: "usedFallback", static: false, private: false, access: { has: obj => "usedFallback" in obj, get: obj => obj.usedFallback, set: (obj, value) => { obj.usedFallback = value; } }, metadata: _metadata }, _usedFallback_initializers, _usedFallback_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TranslationResponseDto = TranslationResponseDto;
/**
 * User language preference DTO
 */
let UserLanguagePreferenceDto = (() => {
    var _a;
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _preferredLocale_decorators;
    let _preferredLocale_initializers = [];
    let _preferredLocale_extraInitializers = [];
    let _fallbackLocales_decorators;
    let _fallbackLocales_initializers = [];
    let _fallbackLocales_extraInitializers = [];
    let _autoDetect_decorators;
    let _autoDetect_initializers = [];
    let _autoDetect_extraInitializers = [];
    let _dateFormat_decorators;
    let _dateFormat_initializers = [];
    let _dateFormat_extraInitializers = [];
    let _timeFormat_decorators;
    let _timeFormat_initializers = [];
    let _timeFormat_extraInitializers = [];
    let _timezone_decorators;
    let _timezone_initializers = [];
    let _timezone_extraInitializers = [];
    return _a = class UserLanguagePreferenceDto {
            constructor() {
                this.userId = __runInitializers(this, _userId_initializers, void 0);
                this.preferredLocale = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _preferredLocale_initializers, void 0));
                this.fallbackLocales = (__runInitializers(this, _preferredLocale_extraInitializers), __runInitializers(this, _fallbackLocales_initializers, void 0));
                this.autoDetect = (__runInitializers(this, _fallbackLocales_extraInitializers), __runInitializers(this, _autoDetect_initializers, void 0));
                this.dateFormat = (__runInitializers(this, _autoDetect_extraInitializers), __runInitializers(this, _dateFormat_initializers, void 0));
                this.timeFormat = (__runInitializers(this, _dateFormat_extraInitializers), __runInitializers(this, _timeFormat_initializers, void 0));
                this.timezone = (__runInitializers(this, _timeFormat_extraInitializers), __runInitializers(this, _timezone_initializers, void 0));
                __runInitializers(this, _timezone_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userId_decorators = [(0, swagger_1.ApiProperty)({ format: 'uuid', description: 'User ID' })];
            _preferredLocale_decorators = [(0, swagger_1.ApiProperty)({ enum: LanguageCode, description: 'Preferred language' })];
            _fallbackLocales_decorators = [(0, swagger_1.ApiProperty)({ enum: LanguageCode, isArray: true, description: 'Fallback languages' })];
            _autoDetect_decorators = [(0, swagger_1.ApiProperty)({ example: true, description: 'Auto-detect locale from browser' })];
            _dateFormat_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'MM/DD/YYYY', description: 'Custom date format' })];
            _timeFormat_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'HH:mm', description: 'Custom time format' })];
            _timezone_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'America/New_York', description: 'User timezone' })];
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _preferredLocale_decorators, { kind: "field", name: "preferredLocale", static: false, private: false, access: { has: obj => "preferredLocale" in obj, get: obj => obj.preferredLocale, set: (obj, value) => { obj.preferredLocale = value; } }, metadata: _metadata }, _preferredLocale_initializers, _preferredLocale_extraInitializers);
            __esDecorate(null, null, _fallbackLocales_decorators, { kind: "field", name: "fallbackLocales", static: false, private: false, access: { has: obj => "fallbackLocales" in obj, get: obj => obj.fallbackLocales, set: (obj, value) => { obj.fallbackLocales = value; } }, metadata: _metadata }, _fallbackLocales_initializers, _fallbackLocales_extraInitializers);
            __esDecorate(null, null, _autoDetect_decorators, { kind: "field", name: "autoDetect", static: false, private: false, access: { has: obj => "autoDetect" in obj, get: obj => obj.autoDetect, set: (obj, value) => { obj.autoDetect = value; } }, metadata: _metadata }, _autoDetect_initializers, _autoDetect_extraInitializers);
            __esDecorate(null, null, _dateFormat_decorators, { kind: "field", name: "dateFormat", static: false, private: false, access: { has: obj => "dateFormat" in obj, get: obj => obj.dateFormat, set: (obj, value) => { obj.dateFormat = value; } }, metadata: _metadata }, _dateFormat_initializers, _dateFormat_extraInitializers);
            __esDecorate(null, null, _timeFormat_decorators, { kind: "field", name: "timeFormat", static: false, private: false, access: { has: obj => "timeFormat" in obj, get: obj => obj.timeFormat, set: (obj, value) => { obj.timeFormat = value; } }, metadata: _metadata }, _timeFormat_initializers, _timeFormat_extraInitializers);
            __esDecorate(null, null, _timezone_decorators, { kind: "field", name: "timezone", static: false, private: false, access: { has: obj => "timezone" in obj, get: obj => obj.timezone, set: (obj, value) => { obj.timezone = value; } }, metadata: _metadata }, _timezone_initializers, _timezone_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UserLanguagePreferenceDto = UserLanguagePreferenceDto;
// ============================================================================
// LOCALE CONFIGURATION & MANAGEMENT
// ============================================================================
/**
 * Default locale configurations for supported languages
 */
exports.DEFAULT_LOCALE_CONFIGS = {
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
function getLocaleConfig(locale) {
    return exports.DEFAULT_LOCALE_CONFIGS[locale] || exports.DEFAULT_LOCALE_CONFIGS[LanguageCode.EN];
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
function getEnabledLocales() {
    return Object.values(exports.DEFAULT_LOCALE_CONFIGS).filter(config => config.enabled);
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
function isRTLLocale(locale) {
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
function getTextDirection(locale) {
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
function getFallbackChain(locale) {
    const chain = [locale];
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
function detectLocaleFromHeader(acceptLanguageHeader, supportedLocales) {
    const supported = supportedLocales || Object.values(LanguageCode);
    const languages = parseAcceptLanguage(acceptLanguageHeader);
    for (const lang of languages) {
        const langCode = lang.code.split('-')[0].toLowerCase();
        if (supported.includes(langCode)) {
            return {
                locale: langCode,
                source: 'header',
                confidence: lang.quality,
                alternatives: languages.slice(1).map(l => l.code.split('-')[0].toLowerCase()),
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
function parseAcceptLanguage(header) {
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
function detectLocaleFromRequest(request, cookieName = 'locale', queryParam = 'lang') {
    // Priority 1: Query parameter
    const queryLocale = request.query[queryParam];
    if (queryLocale && Object.values(LanguageCode).includes(queryLocale)) {
        return {
            locale: queryLocale,
            source: 'query',
            confidence: 1.0,
        };
    }
    // Priority 2: Cookie
    const cookieLocale = request.cookies?.[cookieName];
    if (cookieLocale && Object.values(LanguageCode).includes(cookieLocale)) {
        return {
            locale: cookieLocale,
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
function detectUserLocale(userPreference, requestLocale) {
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
const translationCache = new Map();
/**
 * Generate cache key for translation lookup
 *
 * @param locale - Language code
 * @param namespace - Translation namespace
 * @returns Cache key string
 */
function getTranslationCacheKey(locale, namespace) {
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
function loadTranslations(locale, namespace, translations, version = '1.0.0') {
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
function getTranslation(key, options) {
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
function interpolateTranslation(template, context) {
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
function getPluralizedKey(baseKey, count, locale) {
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
function getPluralCategory(count, locale) {
    const absCount = Math.abs(count);
    // English and most Germanic languages
    if ([LanguageCode.EN, LanguageCode.DE, LanguageCode.NL, LanguageCode.SV].includes(locale)) {
        if (absCount === 1)
            return PluralCategory.ONE;
        return PluralCategory.OTHER;
    }
    // Romance languages (French, Spanish, Portuguese, Italian)
    if ([LanguageCode.FR, LanguageCode.ES, LanguageCode.PT, LanguageCode.IT].includes(locale)) {
        if (absCount === 0 || absCount === 1)
            return PluralCategory.ONE;
        return PluralCategory.OTHER;
    }
    // Russian, Polish (complex plural rules)
    if ([LanguageCode.RU, LanguageCode.PL].includes(locale)) {
        const mod10 = absCount % 10;
        const mod100 = absCount % 100;
        if (mod10 === 1 && mod100 !== 11)
            return PluralCategory.ONE;
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14))
            return PluralCategory.FEW;
        return PluralCategory.MANY;
    }
    // Arabic (has zero, one, two, few, many, other)
    if (locale === LanguageCode.AR) {
        if (absCount === 0)
            return PluralCategory.ZERO;
        if (absCount === 1)
            return PluralCategory.ONE;
        if (absCount === 2)
            return PluralCategory.TWO;
        if (absCount % 100 >= 3 && absCount % 100 <= 10)
            return PluralCategory.FEW;
        if (absCount % 100 >= 11 && absCount % 100 <= 99)
            return PluralCategory.MANY;
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
function translatePlural(key, count, options) {
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
function hasTranslation(key, locale, namespace = TranslationNamespace.COMMON) {
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
function getTranslationKeys(locale, namespace) {
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
function clearTranslationCache(locale, namespace) {
    if (!locale && !namespace) {
        translationCache.clear();
        return;
    }
    const keysToDelete = [];
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
function getTranslationCacheStats() {
    const locales = new Set();
    const namespaces = new Set();
    let totalTranslations = 0;
    let oldestUpdate = null;
    let newestUpdate = null;
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
function formatNumber(value, locale = LanguageCode.EN, options) {
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
function formatCurrency(amount, options) {
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
function formatPercentage(value, locale = LanguageCode.EN, decimals = 0) {
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
function parseLocalizedNumber(value, locale) {
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
function formatDate(date, options) {
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
function formatTime(date, locale = LanguageCode.EN, use24Hour) {
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
function formatDateTime(date, options) {
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
function formatRelativeTime(date, baseDate = new Date(), locale = LanguageCode.EN) {
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
    }
    else if (Math.abs(diffMonths) > 0) {
        return rtf.format(diffMonths, 'month');
    }
    else if (Math.abs(diffDays) > 0) {
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
function formatDateRange(startDate, endDate, locale = LanguageCode.EN, dateStyle = DateTimeStyle.MEDIUM) {
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
function getDirectionConfig(locale) {
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
function getDirectionalStyles(locale, baseStyles) {
    const dirConfig = getDirectionConfig(locale);
    const styles = {
        direction: dirConfig.direction,
    };
    Object.entries(baseStyles).forEach(([key, value]) => {
        if (key === 'paddingStart') {
            styles[dirConfig.paddingStart] = value;
        }
        else if (key === 'paddingEnd') {
            styles[dirConfig.paddingEnd] = value;
        }
        else if (key === 'marginStart') {
            styles[dirConfig.marginStart] = value;
        }
        else if (key === 'marginEnd') {
            styles[dirConfig.marginEnd] = value;
        }
        else if (key === 'textAlign' && value === 'start') {
            styles.textAlign = dirConfig.textAlign;
        }
        else {
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
function mirrorForRTL(value, locale) {
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
function getAccessibilityMetadata(locale, content) {
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
function getHTMLLangAttribute(locale, includeRegion = false) {
    if (!includeRegion) {
        return locale;
    }
    // Map common locales to their regions
    const regionMap = {
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
function createARIAAnnouncement(message, locale, politeness = 'polite') {
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
function getAccessibleFormField(fieldId, labelKey, locale, options) {
    const label = getTranslation(labelKey, { locale, namespace: options?.namespace });
    const attributes = {
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
exports.CurrentLocale = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.locale || detectLocaleFromRequest(request).locale;
});
/**
 * Metadata key for locale validation
 */
exports.LOCALE_METADATA_KEY = 'i18n:locale';
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
const SupportedLocales = (...locales) => (0, common_1.SetMetadata)(exports.LOCALE_METADATA_KEY, locales);
exports.SupportedLocales = SupportedLocales;
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
let LocaleMiddleware = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LocaleMiddleware = _classThis = class {
        use(req, res, next) {
            const detection = detectLocaleFromRequest(req, 'locale', 'lang');
            req.locale = detection.locale;
            req.localeSource = detection.source;
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
    };
    __setFunctionName(_classThis, "LocaleMiddleware");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LocaleMiddleware = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LocaleMiddleware = _classThis;
})();
exports.LocaleMiddleware = LocaleMiddleware;
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
let TranslationInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TranslationInterceptor = _classThis = class {
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const locale = request.locale || LanguageCode.EN;
            return next.handle().pipe(tap(data => {
                if (data && typeof data === 'object') {
                    this.translateObject(data, locale);
                }
            }));
        }
        translateObject(obj, locale) {
            for (const key in obj) {
                if (typeof obj[key] === 'string' && obj[key].includes('.')) {
                    // Assume it's a translation key
                    obj[key] = getTranslation(obj[key], { locale });
                }
                else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    this.translateObject(obj[key], locale);
                }
            }
        }
    };
    __setFunctionName(_classThis, "TranslationInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TranslationInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TranslationInterceptor = _classThis;
})();
exports.TranslationInterceptor = TranslationInterceptor;
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
function isValidLocale(locale) {
    return Object.values(LanguageCode).includes(locale);
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
function getBestMatchingLocale(preferences, supportedLocales) {
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
function getTranslationCoverage(baseLocale, targetLocale, namespace) {
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
function createLocaleSwitcher(currentLocale, availableLocales) {
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
function exportTranslationsToJSON(locale, namespace) {
    const cacheKey = getTranslationCacheKey(locale, namespace);
    const cached = translationCache.get(cacheKey);
    if (!cached) {
        return JSON.stringify({}, null, 2);
    }
    const obj = {};
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
function importTranslationsFromJSON(locale, namespace, jsonData, merge = false) {
    const translations = new Map();
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
//# sourceMappingURL=internationalization-kit.prod.js.map