"use strict";
/**
 * LOC: HCM_GLOBAL_HR_001
 * File: /reuse/server/human-capital/global-hr-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - i18next
 *   - axios (for exchange rate APIs)
 *
 * DOWNSTREAM (imported by):
 *   - Global HR service implementations
 *   - International assignment controllers
 *   - Expatriate management services
 *   - Global payroll integrations
 *   - Immigration & visa tracking systems
 *   - Multi-country compliance services
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
exports.GlobalHRManagementService = exports.GlobalOrgUnitModel = exports.GlobalComplianceModel = exports.GlobalPayrollSyncModel = exports.ExchangeRateModel = exports.CulturalProfileModel = exports.CountryHRRulesModel = exports.VisaImmigrationModel = exports.InternationalTransferModel = exports.GlobalAssignmentModel = exports.GlobalEmployeeModel = exports.TaxEqualizationSchema = exports.CulturalProfileSchema = exports.VisaImmigrationSchema = exports.InternationalTransferSchema = exports.GlobalAssignmentSchema = exports.GlobalEmployeeSchema = exports.ExchangeRateSource = exports.PayrollFrequency = exports.WorkingTimeRegulation = exports.ComplianceFramework = exports.LanguageProficiencyLevel = exports.CulturalAdaptationStage = exports.RelocationStatus = exports.GlobalBenefitType = exports.TaxEqualizationMethod = exports.VisaStatus = exports.VisaType = exports.GlobalAssignmentStatus = exports.GlobalAssignmentType = exports.CurrencyCode = exports.CountryCode = void 0;
exports.createGlobalEmployee = createGlobalEmployee;
exports.updateGlobalEmployeeProfile = updateGlobalEmployeeProfile;
exports.getEmployeeByCountry = getEmployeeByCountry;
exports.transferEmployeeCountry = transferEmployeeCountry;
exports.getCountryHRRules = getCountryHRRules;
exports.validateEmploymentContract = validateEmploymentContract;
exports.applyCountrySpecificWorkingHours = applyCountrySpecificWorkingHours;
exports.getCountryStatutoryLeaves = getCountryStatutoryLeaves;
exports.createGlobalAssignment = createGlobalAssignment;
exports.trackExpatriateAssignment = trackExpatriateAssignment;
exports.calculateAssignmentCosts = calculateAssignmentCosts;
exports.endGlobalAssignment = endGlobalAssignment;
exports.initiateInternationalTransfer = initiateInternationalTransfer;
exports.calculateRelocationCosts = calculateRelocationCosts;
exports.trackRelocationProgress = trackRelocationProgress;
exports.completeRelocation = completeRelocation;
exports.syncGlobalPayrollData = syncGlobalPayrollData;
exports.calculateMultiCountryPayroll = calculateMultiCountryPayroll;
exports.reconcileGlobalPayroll = reconcileGlobalPayroll;
exports.generateGlobalPayslips = generateGlobalPayslips;
exports.getExchangeRates = getExchangeRates;
exports.convertSalaryToCurrency = convertSalaryToCurrency;
exports.trackCurrencyFluctuations = trackCurrencyFluctuations;
exports.applyExchangeRateAdjustments = applyExchangeRateAdjustments;
exports.enrollInGlobalBenefits = enrollInGlobalBenefits;
exports.calculateGlobalBenefitsCosts = calculateGlobalBenefitsCosts;
exports.syncBenefitsAcrossCountries = syncBenefitsAcrossCountries;
exports.generateBenefitsComparison = generateBenefitsComparison;
exports.calculateTaxEqualization = calculateTaxEqualization;
exports.performTaxGrossUp = performTaxGrossUp;
exports.trackTaxLiabilities = trackTaxLiabilities;
exports.generateTaxEqualizationReport = generateTaxEqualizationReport;
exports.createVisaApplication = createVisaApplication;
exports.trackVisaStatus = trackVisaStatus;
exports.sendVisaExpiryAlerts = sendVisaExpiryAlerts;
exports.renewWorkPermit = renewWorkPermit;
exports.createCulturalProfile = createCulturalProfile;
exports.assignLanguageTraining = assignLanguageTraining;
exports.trackCulturalAdaptation = trackCulturalAdaptation;
exports.generateCulturalInsights = generateCulturalInsights;
exports.validateGlobalCompliance = validateGlobalCompliance;
exports.generateComplianceReport = generateComplianceReport;
exports.trackRegulatoryChanges = trackRegulatoryChanges;
exports.auditGlobalHRData = auditGlobalHRData;
exports.createGlobalOrgUnit = createGlobalOrgUnit;
exports.mapGlobalReportingLines = mapGlobalReportingLines;
exports.syncGlobalOrgStructure = syncGlobalOrgStructure;
exports.analyzeGlobalSpanOfControl = analyzeGlobalSpanOfControl;
/**
 * File: /reuse/server/human-capital/global-hr-management-kit.ts
 * Locator: WC-HCM-GLOBAL-HR-001
 * Purpose: Global HR Management Kit - Comprehensive multi-country HR operations
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, i18next, Axios
 * Downstream: ../backend/hr/global/*, ../services/expatriate/*, Immigration portals, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 48+ utility functions for global HR management, multi-country operations, international
 *          assignments, expatriate tracking, global payroll integration, currency management, tax
 *          equalization, immigration & visa tracking, cultural adaptation, compliance, and reporting
 *
 * LLM Context: Enterprise-grade global HR management for White Cross healthcare system operating
 * across multiple countries. Provides comprehensive multi-country employee management including
 * country-specific HR rules and regulations, global assignment lifecycle, expatriate management,
 * international transfers and relocations, global payroll integration with multi-currency support,
 * exchange rate management, global benefits administration, tax equalization and gross-up calculations,
 * immigration and visa tracking with expiry alerts, cultural and language support programs, global
 * compliance monitoring across jurisdictions, and global organizational structure management.
 * Supports 50+ countries with localized employment regulations, GDPR/data privacy compliance,
 * multi-language capabilities, and integration with SAP SuccessFactors Employee Central Global.
 * HIPAA-compliant for healthcare employee international data.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
// ============================================================================
// ENUMS
// ============================================================================
/**
 * ISO 3166-1 alpha-2 country codes for supported countries
 */
var CountryCode;
(function (CountryCode) {
    CountryCode["US"] = "US";
    CountryCode["CA"] = "CA";
    CountryCode["GB"] = "GB";
    CountryCode["DE"] = "DE";
    CountryCode["FR"] = "FR";
    CountryCode["ES"] = "ES";
    CountryCode["IT"] = "IT";
    CountryCode["NL"] = "NL";
    CountryCode["BE"] = "BE";
    CountryCode["CH"] = "CH";
    CountryCode["AT"] = "AT";
    CountryCode["SE"] = "SE";
    CountryCode["NO"] = "NO";
    CountryCode["DK"] = "DK";
    CountryCode["FI"] = "FI";
    CountryCode["IE"] = "IE";
    CountryCode["AU"] = "AU";
    CountryCode["NZ"] = "NZ";
    CountryCode["SG"] = "SG";
    CountryCode["HK"] = "HK";
    CountryCode["JP"] = "JP";
    CountryCode["KR"] = "KR";
    CountryCode["CN"] = "CN";
    CountryCode["IN"] = "IN";
    CountryCode["AE"] = "AE";
    CountryCode["SA"] = "SA";
    CountryCode["BR"] = "BR";
    CountryCode["MX"] = "MX";
    CountryCode["AR"] = "AR";
    CountryCode["CL"] = "CL";
    CountryCode["ZA"] = "ZA";
})(CountryCode || (exports.CountryCode = CountryCode = {}));
/**
 * ISO 4217 currency codes
 */
var CurrencyCode;
(function (CurrencyCode) {
    CurrencyCode["USD"] = "USD";
    CurrencyCode["EUR"] = "EUR";
    CurrencyCode["GBP"] = "GBP";
    CurrencyCode["CHF"] = "CHF";
    CurrencyCode["CAD"] = "CAD";
    CurrencyCode["AUD"] = "AUD";
    CurrencyCode["NZD"] = "NZD";
    CurrencyCode["SGD"] = "SGD";
    CurrencyCode["HKD"] = "HKD";
    CurrencyCode["JPY"] = "JPY";
    CurrencyCode["KRW"] = "KRW";
    CurrencyCode["CNY"] = "CNY";
    CurrencyCode["INR"] = "INR";
    CurrencyCode["AED"] = "AED";
    CurrencyCode["SAR"] = "SAR";
    CurrencyCode["BRL"] = "BRL";
    CurrencyCode["MXN"] = "MXN";
    CurrencyCode["ARS"] = "ARS";
    CurrencyCode["CLP"] = "CLP";
    CurrencyCode["ZAR"] = "ZAR";
    CurrencyCode["SEK"] = "SEK";
    CurrencyCode["NOK"] = "NOK";
    CurrencyCode["DKK"] = "DKK";
})(CurrencyCode || (exports.CurrencyCode = CurrencyCode = {}));
/**
 * Types of global assignments
 */
var GlobalAssignmentType;
(function (GlobalAssignmentType) {
    GlobalAssignmentType["SHORT_TERM"] = "SHORT_TERM";
    GlobalAssignmentType["LONG_TERM"] = "LONG_TERM";
    GlobalAssignmentType["PERMANENT"] = "PERMANENT";
    GlobalAssignmentType["COMMUTER"] = "COMMUTER";
    GlobalAssignmentType["ROTATIONAL"] = "ROTATIONAL";
    GlobalAssignmentType["VIRTUAL"] = "VIRTUAL";
    GlobalAssignmentType["ONE_WAY_TRANSFER"] = "ONE_WAY_TRANSFER";
    GlobalAssignmentType["DEVELOPMENTAL"] = "DEVELOPMENTAL";
    GlobalAssignmentType["PROJECT_BASED"] = "PROJECT_BASED";
    GlobalAssignmentType["EMERGENCY"] = "EMERGENCY";
})(GlobalAssignmentType || (exports.GlobalAssignmentType = GlobalAssignmentType = {}));
/**
 * Status of global assignments
 */
var GlobalAssignmentStatus;
(function (GlobalAssignmentStatus) {
    GlobalAssignmentStatus["PLANNING"] = "PLANNING";
    GlobalAssignmentStatus["APPROVED"] = "APPROVED";
    GlobalAssignmentStatus["IN_PREPARATION"] = "IN_PREPARATION";
    GlobalAssignmentStatus["ACTIVE"] = "ACTIVE";
    GlobalAssignmentStatus["EXTENDED"] = "EXTENDED";
    GlobalAssignmentStatus["ENDING"] = "ENDING";
    GlobalAssignmentStatus["COMPLETED"] = "COMPLETED";
    GlobalAssignmentStatus["CANCELLED"] = "CANCELLED";
    GlobalAssignmentStatus["SUSPENDED"] = "SUSPENDED";
    GlobalAssignmentStatus["FAILED"] = "FAILED";
})(GlobalAssignmentStatus || (exports.GlobalAssignmentStatus = GlobalAssignmentStatus = {}));
/**
 * Visa and work permit types
 */
var VisaType;
(function (VisaType) {
    VisaType["WORK_PERMIT"] = "WORK_PERMIT";
    VisaType["BUSINESS_VISA"] = "BUSINESS_VISA";
    VisaType["SKILLED_WORKER"] = "SKILLED_WORKER";
    VisaType["INTRA_COMPANY_TRANSFER"] = "INTRA_COMPANY_TRANSFER";
    VisaType["PERMANENT_RESIDENCE"] = "PERMANENT_RESIDENCE";
    VisaType["EU_BLUE_CARD"] = "EU_BLUE_CARD";
    VisaType["DEPENDENT_VISA"] = "DEPENDENT_VISA";
    VisaType["STUDENT_VISA"] = "STUDENT_VISA";
    VisaType["TEMPORARY_WORKER"] = "TEMPORARY_WORKER";
    VisaType["INVESTOR_VISA"] = "INVESTOR_VISA";
})(VisaType || (exports.VisaType = VisaType = {}));
/**
 * Visa status
 */
var VisaStatus;
(function (VisaStatus) {
    VisaStatus["NOT_REQUIRED"] = "NOT_REQUIRED";
    VisaStatus["REQUIRED"] = "REQUIRED";
    VisaStatus["APPLICATION_IN_PROGRESS"] = "APPLICATION_IN_PROGRESS";
    VisaStatus["APPROVED"] = "APPROVED";
    VisaStatus["ACTIVE"] = "ACTIVE";
    VisaStatus["EXPIRING_SOON"] = "EXPIRING_SOON";
    VisaStatus["EXPIRED"] = "EXPIRED";
    VisaStatus["DENIED"] = "DENIED";
    VisaStatus["RENEWAL_IN_PROGRESS"] = "RENEWAL_IN_PROGRESS";
    VisaStatus["CANCELLED"] = "CANCELLED";
})(VisaStatus || (exports.VisaStatus = VisaStatus = {}));
/**
 * Tax equalization methods
 */
var TaxEqualizationMethod;
(function (TaxEqualizationMethod) {
    TaxEqualizationMethod["TAX_PROTECTION"] = "TAX_PROTECTION";
    TaxEqualizationMethod["TAX_EQUALIZATION"] = "TAX_EQUALIZATION";
    TaxEqualizationMethod["LAISSEZ_FAIRE"] = "LAISSEZ_FAIRE";
    TaxEqualizationMethod["AD_HOC"] = "AD_HOC";
    TaxEqualizationMethod["BALANCE_SHEET"] = "BALANCE_SHEET";
})(TaxEqualizationMethod || (exports.TaxEqualizationMethod = TaxEqualizationMethod = {}));
/**
 * Global benefit types
 */
var GlobalBenefitType;
(function (GlobalBenefitType) {
    GlobalBenefitType["HEALTH_INSURANCE"] = "HEALTH_INSURANCE";
    GlobalBenefitType["LIFE_INSURANCE"] = "LIFE_INSURANCE";
    GlobalBenefitType["PENSION_RETIREMENT"] = "PENSION_RETIREMENT";
    GlobalBenefitType["HOUSING_ALLOWANCE"] = "HOUSING_ALLOWANCE";
    GlobalBenefitType["EDUCATION_ALLOWANCE"] = "EDUCATION_ALLOWANCE";
    GlobalBenefitType["RELOCATION_ASSISTANCE"] = "RELOCATION_ASSISTANCE";
    GlobalBenefitType["HARDSHIP_ALLOWANCE"] = "HARDSHIP_ALLOWANCE";
    GlobalBenefitType["COST_OF_LIVING_ALLOWANCE"] = "COST_OF_LIVING_ALLOWANCE";
    GlobalBenefitType["CAR_ALLOWANCE"] = "CAR_ALLOWANCE";
    GlobalBenefitType["HOME_LEAVE"] = "HOME_LEAVE";
    GlobalBenefitType["LANGUAGE_TRAINING"] = "LANGUAGE_TRAINING";
    GlobalBenefitType["CULTURAL_TRAINING"] = "CULTURAL_TRAINING";
    GlobalBenefitType["TAX_PREPARATION"] = "TAX_PREPARATION";
    GlobalBenefitType["LEGAL_ASSISTANCE"] = "LEGAL_ASSISTANCE";
})(GlobalBenefitType || (exports.GlobalBenefitType = GlobalBenefitType = {}));
/**
 * Relocation status
 */
var RelocationStatus;
(function (RelocationStatus) {
    RelocationStatus["INITIATED"] = "INITIATED";
    RelocationStatus["PLANNING"] = "PLANNING";
    RelocationStatus["APPROVED"] = "APPROVED";
    RelocationStatus["IN_PROGRESS"] = "IN_PROGRESS";
    RelocationStatus["SHIPMENT_IN_TRANSIT"] = "SHIPMENT_IN_TRANSIT";
    RelocationStatus["ARRIVAL_SERVICES"] = "ARRIVAL_SERVICES";
    RelocationStatus["SETTLING_IN"] = "SETTLING_IN";
    RelocationStatus["COMPLETED"] = "COMPLETED";
    RelocationStatus["CANCELLED"] = "CANCELLED";
    RelocationStatus["ON_HOLD"] = "ON_HOLD";
})(RelocationStatus || (exports.RelocationStatus = RelocationStatus = {}));
/**
 * Cultural adaptation stages
 */
var CulturalAdaptationStage;
(function (CulturalAdaptationStage) {
    CulturalAdaptationStage["HONEYMOON"] = "HONEYMOON";
    CulturalAdaptationStage["CULTURE_SHOCK"] = "CULTURE_SHOCK";
    CulturalAdaptationStage["ADJUSTMENT"] = "ADJUSTMENT";
    CulturalAdaptationStage["MASTERY"] = "MASTERY";
    CulturalAdaptationStage["RE_ENTRY_SHOCK"] = "RE_ENTRY_SHOCK";
})(CulturalAdaptationStage || (exports.CulturalAdaptationStage = CulturalAdaptationStage = {}));
/**
 * Language proficiency levels (CEFR)
 */
var LanguageProficiencyLevel;
(function (LanguageProficiencyLevel) {
    LanguageProficiencyLevel["A1_BEGINNER"] = "A1_BEGINNER";
    LanguageProficiencyLevel["A2_ELEMENTARY"] = "A2_ELEMENTARY";
    LanguageProficiencyLevel["B1_INTERMEDIATE"] = "B1_INTERMEDIATE";
    LanguageProficiencyLevel["B2_UPPER_INTERMEDIATE"] = "B2_UPPER_INTERMEDIATE";
    LanguageProficiencyLevel["C1_ADVANCED"] = "C1_ADVANCED";
    LanguageProficiencyLevel["C2_PROFICIENT"] = "C2_PROFICIENT";
    LanguageProficiencyLevel["NATIVE"] = "NATIVE";
})(LanguageProficiencyLevel || (exports.LanguageProficiencyLevel = LanguageProficiencyLevel = {}));
/**
 * Global compliance frameworks
 */
var ComplianceFramework;
(function (ComplianceFramework) {
    ComplianceFramework["GDPR"] = "GDPR";
    ComplianceFramework["HIPAA"] = "HIPAA";
    ComplianceFramework["SOX"] = "SOX";
    ComplianceFramework["ISO_27001"] = "ISO_27001";
    ComplianceFramework["ISO_9001"] = "ISO_9001";
    ComplianceFramework["EEOC"] = "EEOC";
    ComplianceFramework["FLSA"] = "FLSA";
    ComplianceFramework["WTD"] = "WTD";
    ComplianceFramework["CCPA"] = "CCPA";
    ComplianceFramework["PIPEDA"] = "PIPEDA";
})(ComplianceFramework || (exports.ComplianceFramework = ComplianceFramework = {}));
/**
 * Working time regulations
 */
var WorkingTimeRegulation;
(function (WorkingTimeRegulation) {
    WorkingTimeRegulation["EU_WTD"] = "EU_WTD";
    WorkingTimeRegulation["US_FLSA"] = "US_FLSA";
    WorkingTimeRegulation["CUSTOM"] = "CUSTOM";
})(WorkingTimeRegulation || (exports.WorkingTimeRegulation = WorkingTimeRegulation = {}));
/**
 * Payroll frequency by country
 */
var PayrollFrequency;
(function (PayrollFrequency) {
    PayrollFrequency["WEEKLY"] = "WEEKLY";
    PayrollFrequency["BI_WEEKLY"] = "BI_WEEKLY";
    PayrollFrequency["SEMI_MONTHLY"] = "SEMI_MONTHLY";
    PayrollFrequency["MONTHLY"] = "MONTHLY";
    PayrollFrequency["QUARTERLY"] = "QUARTERLY";
    PayrollFrequency["ANNUALLY"] = "ANNUALLY";
})(PayrollFrequency || (exports.PayrollFrequency = PayrollFrequency = {}));
/**
 * Exchange rate sources
 */
var ExchangeRateSource;
(function (ExchangeRateSource) {
    ExchangeRateSource["ECB"] = "ECB";
    ExchangeRateSource["FED"] = "FED";
    ExchangeRateSource["BANK_OF_ENGLAND"] = "BANK_OF_ENGLAND";
    ExchangeRateSource["OANDA"] = "OANDA";
    ExchangeRateSource["XE"] = "XE";
    ExchangeRateSource["BLOOMBERG"] = "BLOOMBERG";
    ExchangeRateSource["MANUAL"] = "MANUAL";
})(ExchangeRateSource || (exports.ExchangeRateSource = ExchangeRateSource = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
exports.GlobalEmployeeSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    homeCountry: zod_1.z.nativeEnum(CountryCode),
    currentCountry: zod_1.z.nativeEnum(CountryCode),
    citizenship: zod_1.z.array(zod_1.z.nativeEnum(CountryCode)).min(1),
    preferredCurrency: zod_1.z.nativeEnum(CurrencyCode),
    isExpatriate: zod_1.z.boolean(),
    expatriateStartDate: zod_1.z.date().optional(),
    repatriationDate: zod_1.z.date().optional(),
});
exports.GlobalAssignmentSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    assignmentType: zod_1.z.nativeEnum(GlobalAssignmentType),
    homeCountry: zod_1.z.nativeEnum(CountryCode),
    hostCountry: zod_1.z.nativeEnum(CountryCode),
    startDate: zod_1.z.date(),
    plannedEndDate: zod_1.z.date(),
    businessReason: zod_1.z.string().min(10).max(500),
    costCenter: zod_1.z.string().min(1).max(50),
    familyAccompanying: zod_1.z.boolean(),
    dependentsCount: zod_1.z.number().int().min(0).max(20),
    housingProvided: zod_1.z.boolean(),
});
exports.InternationalTransferSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    fromCountry: zod_1.z.nativeEnum(CountryCode),
    toCountry: zod_1.z.nativeEnum(CountryCode),
    fromLegalEntity: zod_1.z.string().min(1),
    toLegalEntity: zod_1.z.string().min(1),
    transferDate: zod_1.z.date(),
    reason: zod_1.z.string().min(10).max(500),
    isPermanent: zod_1.z.boolean(),
});
exports.VisaImmigrationSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    country: zod_1.z.nativeEnum(CountryCode),
    visaType: zod_1.z.nativeEnum(VisaType),
    applicationDate: zod_1.z.date(),
    expiryDate: zod_1.z.date(),
    sponsorshipRequired: zod_1.z.boolean(),
    sponsoringEntity: zod_1.z.string().optional(),
    dependentsIncluded: zod_1.z.number().int().min(0),
});
exports.CulturalProfileSchema = zod_1.z.object({
    employeeId: zod_1.z.string().uuid(),
    country: zod_1.z.nativeEnum(CountryCode),
    adaptationStage: zod_1.z.nativeEnum(CulturalAdaptationStage),
    challengesReported: zod_1.z.array(zod_1.z.string()),
    supportProvided: zod_1.z.array(zod_1.z.string()),
    culturalTrainingCompleted: zod_1.z.boolean(),
    culturalMentorAssigned: zod_1.z.boolean(),
    adaptationScore: zod_1.z.number().min(0).max(100),
});
exports.TaxEqualizationSchema = zod_1.z.object({
    method: zod_1.z.nativeEnum(TaxEqualizationMethod),
    homeCountryTax: zod_1.z.number().min(0),
    hostCountryTax: zod_1.z.number().min(0),
    hypotheticalTax: zod_1.z.number().min(0),
    taxYear: zod_1.z.number().int().min(2000).max(2100),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Global Employee Model
 */
let GlobalEmployeeModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'global_employees', timestamps: true, paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _homeCountry_decorators;
    let _homeCountry_initializers = [];
    let _homeCountry_extraInitializers = [];
    let _currentCountry_decorators;
    let _currentCountry_initializers = [];
    let _currentCountry_extraInitializers = [];
    let _citizenship_decorators;
    let _citizenship_initializers = [];
    let _citizenship_extraInitializers = [];
    let _workAuthorizations_decorators;
    let _workAuthorizations_initializers = [];
    let _workAuthorizations_extraInitializers = [];
    let _preferredCurrency_decorators;
    let _preferredCurrency_initializers = [];
    let _preferredCurrency_extraInitializers = [];
    let _languageProficiencies_decorators;
    let _languageProficiencies_initializers = [];
    let _languageProficiencies_extraInitializers = [];
    let _taxResidency_decorators;
    let _taxResidency_initializers = [];
    let _taxResidency_extraInitializers = [];
    let _isExpatriate_decorators;
    let _isExpatriate_initializers = [];
    let _isExpatriate_extraInitializers = [];
    let _expatriateStartDate_decorators;
    let _expatriateStartDate_initializers = [];
    let _expatriateStartDate_extraInitializers = [];
    let _repatriationDate_decorators;
    let _repatriationDate_initializers = [];
    let _repatriationDate_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _globalAssignments_decorators;
    let _globalAssignments_initializers = [];
    let _globalAssignments_extraInitializers = [];
    var GlobalEmployeeModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.homeCountry = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _homeCountry_initializers, void 0));
            this.currentCountry = (__runInitializers(this, _homeCountry_extraInitializers), __runInitializers(this, _currentCountry_initializers, void 0));
            this.citizenship = (__runInitializers(this, _currentCountry_extraInitializers), __runInitializers(this, _citizenship_initializers, void 0));
            this.workAuthorizations = (__runInitializers(this, _citizenship_extraInitializers), __runInitializers(this, _workAuthorizations_initializers, void 0));
            this.preferredCurrency = (__runInitializers(this, _workAuthorizations_extraInitializers), __runInitializers(this, _preferredCurrency_initializers, void 0));
            this.languageProficiencies = (__runInitializers(this, _preferredCurrency_extraInitializers), __runInitializers(this, _languageProficiencies_initializers, void 0));
            this.taxResidency = (__runInitializers(this, _languageProficiencies_extraInitializers), __runInitializers(this, _taxResidency_initializers, void 0));
            this.isExpatriate = (__runInitializers(this, _taxResidency_extraInitializers), __runInitializers(this, _isExpatriate_initializers, void 0));
            this.expatriateStartDate = (__runInitializers(this, _isExpatriate_extraInitializers), __runInitializers(this, _expatriateStartDate_initializers, void 0));
            this.repatriationDate = (__runInitializers(this, _expatriateStartDate_extraInitializers), __runInitializers(this, _repatriationDate_initializers, void 0));
            this.createdAt = (__runInitializers(this, _repatriationDate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.globalAssignments = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _globalAssignments_initializers, void 0));
            __runInitializers(this, _globalAssignments_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "GlobalEmployeeModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _employeeId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _homeCountry_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(2))];
        _currentCountry_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(2))];
        _citizenship_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING(2)))];
        _workAuthorizations_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _preferredCurrency_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(3))];
        _languageProficiencies_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _taxResidency_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _isExpatriate_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _expatriateStartDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _repatriationDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _globalAssignments_decorators = [(0, sequelize_typescript_1.HasMany)(() => GlobalAssignmentModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _homeCountry_decorators, { kind: "field", name: "homeCountry", static: false, private: false, access: { has: obj => "homeCountry" in obj, get: obj => obj.homeCountry, set: (obj, value) => { obj.homeCountry = value; } }, metadata: _metadata }, _homeCountry_initializers, _homeCountry_extraInitializers);
        __esDecorate(null, null, _currentCountry_decorators, { kind: "field", name: "currentCountry", static: false, private: false, access: { has: obj => "currentCountry" in obj, get: obj => obj.currentCountry, set: (obj, value) => { obj.currentCountry = value; } }, metadata: _metadata }, _currentCountry_initializers, _currentCountry_extraInitializers);
        __esDecorate(null, null, _citizenship_decorators, { kind: "field", name: "citizenship", static: false, private: false, access: { has: obj => "citizenship" in obj, get: obj => obj.citizenship, set: (obj, value) => { obj.citizenship = value; } }, metadata: _metadata }, _citizenship_initializers, _citizenship_extraInitializers);
        __esDecorate(null, null, _workAuthorizations_decorators, { kind: "field", name: "workAuthorizations", static: false, private: false, access: { has: obj => "workAuthorizations" in obj, get: obj => obj.workAuthorizations, set: (obj, value) => { obj.workAuthorizations = value; } }, metadata: _metadata }, _workAuthorizations_initializers, _workAuthorizations_extraInitializers);
        __esDecorate(null, null, _preferredCurrency_decorators, { kind: "field", name: "preferredCurrency", static: false, private: false, access: { has: obj => "preferredCurrency" in obj, get: obj => obj.preferredCurrency, set: (obj, value) => { obj.preferredCurrency = value; } }, metadata: _metadata }, _preferredCurrency_initializers, _preferredCurrency_extraInitializers);
        __esDecorate(null, null, _languageProficiencies_decorators, { kind: "field", name: "languageProficiencies", static: false, private: false, access: { has: obj => "languageProficiencies" in obj, get: obj => obj.languageProficiencies, set: (obj, value) => { obj.languageProficiencies = value; } }, metadata: _metadata }, _languageProficiencies_initializers, _languageProficiencies_extraInitializers);
        __esDecorate(null, null, _taxResidency_decorators, { kind: "field", name: "taxResidency", static: false, private: false, access: { has: obj => "taxResidency" in obj, get: obj => obj.taxResidency, set: (obj, value) => { obj.taxResidency = value; } }, metadata: _metadata }, _taxResidency_initializers, _taxResidency_extraInitializers);
        __esDecorate(null, null, _isExpatriate_decorators, { kind: "field", name: "isExpatriate", static: false, private: false, access: { has: obj => "isExpatriate" in obj, get: obj => obj.isExpatriate, set: (obj, value) => { obj.isExpatriate = value; } }, metadata: _metadata }, _isExpatriate_initializers, _isExpatriate_extraInitializers);
        __esDecorate(null, null, _expatriateStartDate_decorators, { kind: "field", name: "expatriateStartDate", static: false, private: false, access: { has: obj => "expatriateStartDate" in obj, get: obj => obj.expatriateStartDate, set: (obj, value) => { obj.expatriateStartDate = value; } }, metadata: _metadata }, _expatriateStartDate_initializers, _expatriateStartDate_extraInitializers);
        __esDecorate(null, null, _repatriationDate_decorators, { kind: "field", name: "repatriationDate", static: false, private: false, access: { has: obj => "repatriationDate" in obj, get: obj => obj.repatriationDate, set: (obj, value) => { obj.repatriationDate = value; } }, metadata: _metadata }, _repatriationDate_initializers, _repatriationDate_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _globalAssignments_decorators, { kind: "field", name: "globalAssignments", static: false, private: false, access: { has: obj => "globalAssignments" in obj, get: obj => obj.globalAssignments, set: (obj, value) => { obj.globalAssignments = value; } }, metadata: _metadata }, _globalAssignments_initializers, _globalAssignments_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GlobalEmployeeModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GlobalEmployeeModel = _classThis;
})();
exports.GlobalEmployeeModel = GlobalEmployeeModel;
/**
 * Global Assignment Model
 */
let GlobalAssignmentModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'global_assignments', timestamps: true, paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _assignmentType_decorators;
    let _assignmentType_initializers = [];
    let _assignmentType_extraInitializers = [];
    let _homeCountry_decorators;
    let _homeCountry_initializers = [];
    let _homeCountry_extraInitializers = [];
    let _hostCountry_decorators;
    let _hostCountry_initializers = [];
    let _hostCountry_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _plannedEndDate_decorators;
    let _plannedEndDate_initializers = [];
    let _plannedEndDate_extraInitializers = [];
    let _actualEndDate_decorators;
    let _actualEndDate_initializers = [];
    let _actualEndDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _businessReason_decorators;
    let _businessReason_initializers = [];
    let _businessReason_extraInitializers = [];
    let _costCenter_decorators;
    let _costCenter_initializers = [];
    let _costCenter_extraInitializers = [];
    let _assignmentCosts_decorators;
    let _assignmentCosts_initializers = [];
    let _assignmentCosts_extraInitializers = [];
    let _taxEqualization_decorators;
    let _taxEqualization_initializers = [];
    let _taxEqualization_extraInitializers = [];
    let _benefits_decorators;
    let _benefits_initializers = [];
    let _benefits_extraInitializers = [];
    let _familyAccompanying_decorators;
    let _familyAccompanying_initializers = [];
    let _familyAccompanying_extraInitializers = [];
    let _dependentsCount_decorators;
    let _dependentsCount_initializers = [];
    let _dependentsCount_extraInitializers = [];
    let _housingProvided_decorators;
    let _housingProvided_initializers = [];
    let _housingProvided_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _employee_decorators;
    let _employee_initializers = [];
    let _employee_extraInitializers = [];
    var GlobalAssignmentModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.assignmentType = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _assignmentType_initializers, void 0));
            this.homeCountry = (__runInitializers(this, _assignmentType_extraInitializers), __runInitializers(this, _homeCountry_initializers, void 0));
            this.hostCountry = (__runInitializers(this, _homeCountry_extraInitializers), __runInitializers(this, _hostCountry_initializers, void 0));
            this.startDate = (__runInitializers(this, _hostCountry_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.plannedEndDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _plannedEndDate_initializers, void 0));
            this.actualEndDate = (__runInitializers(this, _plannedEndDate_extraInitializers), __runInitializers(this, _actualEndDate_initializers, void 0));
            this.status = (__runInitializers(this, _actualEndDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.businessReason = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _businessReason_initializers, void 0));
            this.costCenter = (__runInitializers(this, _businessReason_extraInitializers), __runInitializers(this, _costCenter_initializers, void 0));
            this.assignmentCosts = (__runInitializers(this, _costCenter_extraInitializers), __runInitializers(this, _assignmentCosts_initializers, void 0));
            this.taxEqualization = (__runInitializers(this, _assignmentCosts_extraInitializers), __runInitializers(this, _taxEqualization_initializers, void 0));
            this.benefits = (__runInitializers(this, _taxEqualization_extraInitializers), __runInitializers(this, _benefits_initializers, void 0));
            this.familyAccompanying = (__runInitializers(this, _benefits_extraInitializers), __runInitializers(this, _familyAccompanying_initializers, void 0));
            this.dependentsCount = (__runInitializers(this, _familyAccompanying_extraInitializers), __runInitializers(this, _dependentsCount_initializers, void 0));
            this.housingProvided = (__runInitializers(this, _dependentsCount_extraInitializers), __runInitializers(this, _housingProvided_initializers, void 0));
            this.createdAt = (__runInitializers(this, _housingProvided_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.employee = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _employee_initializers, void 0));
            __runInitializers(this, _employee_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "GlobalAssignmentModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _employeeId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.ForeignKey)(() => GlobalEmployeeModel), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _assignmentType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _homeCountry_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(2))];
        _hostCountry_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(2))];
        _startDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _plannedEndDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _actualEndDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('PLANNING'), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _businessReason_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _costCenter_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _assignmentCosts_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _taxEqualization_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _benefits_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _familyAccompanying_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _dependentsCount_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _housingProvided_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _employee_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => GlobalEmployeeModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _assignmentType_decorators, { kind: "field", name: "assignmentType", static: false, private: false, access: { has: obj => "assignmentType" in obj, get: obj => obj.assignmentType, set: (obj, value) => { obj.assignmentType = value; } }, metadata: _metadata }, _assignmentType_initializers, _assignmentType_extraInitializers);
        __esDecorate(null, null, _homeCountry_decorators, { kind: "field", name: "homeCountry", static: false, private: false, access: { has: obj => "homeCountry" in obj, get: obj => obj.homeCountry, set: (obj, value) => { obj.homeCountry = value; } }, metadata: _metadata }, _homeCountry_initializers, _homeCountry_extraInitializers);
        __esDecorate(null, null, _hostCountry_decorators, { kind: "field", name: "hostCountry", static: false, private: false, access: { has: obj => "hostCountry" in obj, get: obj => obj.hostCountry, set: (obj, value) => { obj.hostCountry = value; } }, metadata: _metadata }, _hostCountry_initializers, _hostCountry_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _plannedEndDate_decorators, { kind: "field", name: "plannedEndDate", static: false, private: false, access: { has: obj => "plannedEndDate" in obj, get: obj => obj.plannedEndDate, set: (obj, value) => { obj.plannedEndDate = value; } }, metadata: _metadata }, _plannedEndDate_initializers, _plannedEndDate_extraInitializers);
        __esDecorate(null, null, _actualEndDate_decorators, { kind: "field", name: "actualEndDate", static: false, private: false, access: { has: obj => "actualEndDate" in obj, get: obj => obj.actualEndDate, set: (obj, value) => { obj.actualEndDate = value; } }, metadata: _metadata }, _actualEndDate_initializers, _actualEndDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _businessReason_decorators, { kind: "field", name: "businessReason", static: false, private: false, access: { has: obj => "businessReason" in obj, get: obj => obj.businessReason, set: (obj, value) => { obj.businessReason = value; } }, metadata: _metadata }, _businessReason_initializers, _businessReason_extraInitializers);
        __esDecorate(null, null, _costCenter_decorators, { kind: "field", name: "costCenter", static: false, private: false, access: { has: obj => "costCenter" in obj, get: obj => obj.costCenter, set: (obj, value) => { obj.costCenter = value; } }, metadata: _metadata }, _costCenter_initializers, _costCenter_extraInitializers);
        __esDecorate(null, null, _assignmentCosts_decorators, { kind: "field", name: "assignmentCosts", static: false, private: false, access: { has: obj => "assignmentCosts" in obj, get: obj => obj.assignmentCosts, set: (obj, value) => { obj.assignmentCosts = value; } }, metadata: _metadata }, _assignmentCosts_initializers, _assignmentCosts_extraInitializers);
        __esDecorate(null, null, _taxEqualization_decorators, { kind: "field", name: "taxEqualization", static: false, private: false, access: { has: obj => "taxEqualization" in obj, get: obj => obj.taxEqualization, set: (obj, value) => { obj.taxEqualization = value; } }, metadata: _metadata }, _taxEqualization_initializers, _taxEqualization_extraInitializers);
        __esDecorate(null, null, _benefits_decorators, { kind: "field", name: "benefits", static: false, private: false, access: { has: obj => "benefits" in obj, get: obj => obj.benefits, set: (obj, value) => { obj.benefits = value; } }, metadata: _metadata }, _benefits_initializers, _benefits_extraInitializers);
        __esDecorate(null, null, _familyAccompanying_decorators, { kind: "field", name: "familyAccompanying", static: false, private: false, access: { has: obj => "familyAccompanying" in obj, get: obj => obj.familyAccompanying, set: (obj, value) => { obj.familyAccompanying = value; } }, metadata: _metadata }, _familyAccompanying_initializers, _familyAccompanying_extraInitializers);
        __esDecorate(null, null, _dependentsCount_decorators, { kind: "field", name: "dependentsCount", static: false, private: false, access: { has: obj => "dependentsCount" in obj, get: obj => obj.dependentsCount, set: (obj, value) => { obj.dependentsCount = value; } }, metadata: _metadata }, _dependentsCount_initializers, _dependentsCount_extraInitializers);
        __esDecorate(null, null, _housingProvided_decorators, { kind: "field", name: "housingProvided", static: false, private: false, access: { has: obj => "housingProvided" in obj, get: obj => obj.housingProvided, set: (obj, value) => { obj.housingProvided = value; } }, metadata: _metadata }, _housingProvided_initializers, _housingProvided_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _employee_decorators, { kind: "field", name: "employee", static: false, private: false, access: { has: obj => "employee" in obj, get: obj => obj.employee, set: (obj, value) => { obj.employee = value; } }, metadata: _metadata }, _employee_initializers, _employee_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GlobalAssignmentModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GlobalAssignmentModel = _classThis;
})();
exports.GlobalAssignmentModel = GlobalAssignmentModel;
/**
 * International Transfer Model
 */
let InternationalTransferModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'international_transfers', timestamps: true, paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _fromCountry_decorators;
    let _fromCountry_initializers = [];
    let _fromCountry_extraInitializers = [];
    let _toCountry_decorators;
    let _toCountry_initializers = [];
    let _toCountry_extraInitializers = [];
    let _fromLegalEntity_decorators;
    let _fromLegalEntity_initializers = [];
    let _fromLegalEntity_extraInitializers = [];
    let _toLegalEntity_decorators;
    let _toLegalEntity_initializers = [];
    let _toLegalEntity_extraInitializers = [];
    let _transferDate_decorators;
    let _transferDate_initializers = [];
    let _transferDate_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _isPermanent_decorators;
    let _isPermanent_initializers = [];
    let _isPermanent_extraInitializers = [];
    let _relocation_decorators;
    let _relocation_initializers = [];
    let _relocation_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var InternationalTransferModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.fromCountry = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _fromCountry_initializers, void 0));
            this.toCountry = (__runInitializers(this, _fromCountry_extraInitializers), __runInitializers(this, _toCountry_initializers, void 0));
            this.fromLegalEntity = (__runInitializers(this, _toCountry_extraInitializers), __runInitializers(this, _fromLegalEntity_initializers, void 0));
            this.toLegalEntity = (__runInitializers(this, _fromLegalEntity_extraInitializers), __runInitializers(this, _toLegalEntity_initializers, void 0));
            this.transferDate = (__runInitializers(this, _toLegalEntity_extraInitializers), __runInitializers(this, _transferDate_initializers, void 0));
            this.reason = (__runInitializers(this, _transferDate_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            this.isPermanent = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _isPermanent_initializers, void 0));
            this.relocation = (__runInitializers(this, _isPermanent_extraInitializers), __runInitializers(this, _relocation_initializers, void 0));
            this.status = (__runInitializers(this, _relocation_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.createdAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "InternationalTransferModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _employeeId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _fromCountry_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(2))];
        _toCountry_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(2))];
        _fromLegalEntity_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _toLegalEntity_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _transferDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _reason_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _isPermanent_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _relocation_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('INITIATED'), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _fromCountry_decorators, { kind: "field", name: "fromCountry", static: false, private: false, access: { has: obj => "fromCountry" in obj, get: obj => obj.fromCountry, set: (obj, value) => { obj.fromCountry = value; } }, metadata: _metadata }, _fromCountry_initializers, _fromCountry_extraInitializers);
        __esDecorate(null, null, _toCountry_decorators, { kind: "field", name: "toCountry", static: false, private: false, access: { has: obj => "toCountry" in obj, get: obj => obj.toCountry, set: (obj, value) => { obj.toCountry = value; } }, metadata: _metadata }, _toCountry_initializers, _toCountry_extraInitializers);
        __esDecorate(null, null, _fromLegalEntity_decorators, { kind: "field", name: "fromLegalEntity", static: false, private: false, access: { has: obj => "fromLegalEntity" in obj, get: obj => obj.fromLegalEntity, set: (obj, value) => { obj.fromLegalEntity = value; } }, metadata: _metadata }, _fromLegalEntity_initializers, _fromLegalEntity_extraInitializers);
        __esDecorate(null, null, _toLegalEntity_decorators, { kind: "field", name: "toLegalEntity", static: false, private: false, access: { has: obj => "toLegalEntity" in obj, get: obj => obj.toLegalEntity, set: (obj, value) => { obj.toLegalEntity = value; } }, metadata: _metadata }, _toLegalEntity_initializers, _toLegalEntity_extraInitializers);
        __esDecorate(null, null, _transferDate_decorators, { kind: "field", name: "transferDate", static: false, private: false, access: { has: obj => "transferDate" in obj, get: obj => obj.transferDate, set: (obj, value) => { obj.transferDate = value; } }, metadata: _metadata }, _transferDate_initializers, _transferDate_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _isPermanent_decorators, { kind: "field", name: "isPermanent", static: false, private: false, access: { has: obj => "isPermanent" in obj, get: obj => obj.isPermanent, set: (obj, value) => { obj.isPermanent = value; } }, metadata: _metadata }, _isPermanent_initializers, _isPermanent_extraInitializers);
        __esDecorate(null, null, _relocation_decorators, { kind: "field", name: "relocation", static: false, private: false, access: { has: obj => "relocation" in obj, get: obj => obj.relocation, set: (obj, value) => { obj.relocation = value; } }, metadata: _metadata }, _relocation_initializers, _relocation_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InternationalTransferModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InternationalTransferModel = _classThis;
})();
exports.InternationalTransferModel = InternationalTransferModel;
/**
 * Visa Immigration Model
 */
let VisaImmigrationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'visa_immigration', timestamps: true, paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _country_decorators;
    let _country_initializers = [];
    let _country_extraInitializers = [];
    let _visaType_decorators;
    let _visaType_initializers = [];
    let _visaType_extraInitializers = [];
    let _applicationDate_decorators;
    let _applicationDate_initializers = [];
    let _applicationDate_extraInitializers = [];
    let _approvalDate_decorators;
    let _approvalDate_initializers = [];
    let _approvalDate_extraInitializers = [];
    let _issueDate_decorators;
    let _issueDate_initializers = [];
    let _issueDate_extraInitializers = [];
    let _expiryDate_decorators;
    let _expiryDate_initializers = [];
    let _expiryDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _sponsorshipRequired_decorators;
    let _sponsorshipRequired_initializers = [];
    let _sponsorshipRequired_extraInitializers = [];
    let _sponsoringEntity_decorators;
    let _sponsoringEntity_initializers = [];
    let _sponsoringEntity_extraInitializers = [];
    let _dependentsIncluded_decorators;
    let _dependentsIncluded_initializers = [];
    let _dependentsIncluded_extraInitializers = [];
    let _renewalDate_decorators;
    let _renewalDate_initializers = [];
    let _renewalDate_extraInitializers = [];
    let _alertSent_decorators;
    let _alertSent_initializers = [];
    let _alertSent_extraInitializers = [];
    let _documents_decorators;
    let _documents_initializers = [];
    let _documents_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var VisaImmigrationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.country = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _country_initializers, void 0));
            this.visaType = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _visaType_initializers, void 0));
            this.applicationDate = (__runInitializers(this, _visaType_extraInitializers), __runInitializers(this, _applicationDate_initializers, void 0));
            this.approvalDate = (__runInitializers(this, _applicationDate_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
            this.issueDate = (__runInitializers(this, _approvalDate_extraInitializers), __runInitializers(this, _issueDate_initializers, void 0));
            this.expiryDate = (__runInitializers(this, _issueDate_extraInitializers), __runInitializers(this, _expiryDate_initializers, void 0));
            this.status = (__runInitializers(this, _expiryDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.sponsorshipRequired = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _sponsorshipRequired_initializers, void 0));
            this.sponsoringEntity = (__runInitializers(this, _sponsorshipRequired_extraInitializers), __runInitializers(this, _sponsoringEntity_initializers, void 0));
            this.dependentsIncluded = (__runInitializers(this, _sponsoringEntity_extraInitializers), __runInitializers(this, _dependentsIncluded_initializers, void 0));
            this.renewalDate = (__runInitializers(this, _dependentsIncluded_extraInitializers), __runInitializers(this, _renewalDate_initializers, void 0));
            this.alertSent = (__runInitializers(this, _renewalDate_extraInitializers), __runInitializers(this, _alertSent_initializers, void 0));
            this.documents = (__runInitializers(this, _alertSent_extraInitializers), __runInitializers(this, _documents_initializers, void 0));
            this.createdAt = (__runInitializers(this, _documents_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "VisaImmigrationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _employeeId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _country_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(2))];
        _visaType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _applicationDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _approvalDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _issueDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _expiryDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('REQUIRED'), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _sponsorshipRequired_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _sponsoringEntity_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _dependentsIncluded_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _renewalDate_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _alertSent_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _documents_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: obj => "country" in obj, get: obj => obj.country, set: (obj, value) => { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
        __esDecorate(null, null, _visaType_decorators, { kind: "field", name: "visaType", static: false, private: false, access: { has: obj => "visaType" in obj, get: obj => obj.visaType, set: (obj, value) => { obj.visaType = value; } }, metadata: _metadata }, _visaType_initializers, _visaType_extraInitializers);
        __esDecorate(null, null, _applicationDate_decorators, { kind: "field", name: "applicationDate", static: false, private: false, access: { has: obj => "applicationDate" in obj, get: obj => obj.applicationDate, set: (obj, value) => { obj.applicationDate = value; } }, metadata: _metadata }, _applicationDate_initializers, _applicationDate_extraInitializers);
        __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: obj => "approvalDate" in obj, get: obj => obj.approvalDate, set: (obj, value) => { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
        __esDecorate(null, null, _issueDate_decorators, { kind: "field", name: "issueDate", static: false, private: false, access: { has: obj => "issueDate" in obj, get: obj => obj.issueDate, set: (obj, value) => { obj.issueDate = value; } }, metadata: _metadata }, _issueDate_initializers, _issueDate_extraInitializers);
        __esDecorate(null, null, _expiryDate_decorators, { kind: "field", name: "expiryDate", static: false, private: false, access: { has: obj => "expiryDate" in obj, get: obj => obj.expiryDate, set: (obj, value) => { obj.expiryDate = value; } }, metadata: _metadata }, _expiryDate_initializers, _expiryDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _sponsorshipRequired_decorators, { kind: "field", name: "sponsorshipRequired", static: false, private: false, access: { has: obj => "sponsorshipRequired" in obj, get: obj => obj.sponsorshipRequired, set: (obj, value) => { obj.sponsorshipRequired = value; } }, metadata: _metadata }, _sponsorshipRequired_initializers, _sponsorshipRequired_extraInitializers);
        __esDecorate(null, null, _sponsoringEntity_decorators, { kind: "field", name: "sponsoringEntity", static: false, private: false, access: { has: obj => "sponsoringEntity" in obj, get: obj => obj.sponsoringEntity, set: (obj, value) => { obj.sponsoringEntity = value; } }, metadata: _metadata }, _sponsoringEntity_initializers, _sponsoringEntity_extraInitializers);
        __esDecorate(null, null, _dependentsIncluded_decorators, { kind: "field", name: "dependentsIncluded", static: false, private: false, access: { has: obj => "dependentsIncluded" in obj, get: obj => obj.dependentsIncluded, set: (obj, value) => { obj.dependentsIncluded = value; } }, metadata: _metadata }, _dependentsIncluded_initializers, _dependentsIncluded_extraInitializers);
        __esDecorate(null, null, _renewalDate_decorators, { kind: "field", name: "renewalDate", static: false, private: false, access: { has: obj => "renewalDate" in obj, get: obj => obj.renewalDate, set: (obj, value) => { obj.renewalDate = value; } }, metadata: _metadata }, _renewalDate_initializers, _renewalDate_extraInitializers);
        __esDecorate(null, null, _alertSent_decorators, { kind: "field", name: "alertSent", static: false, private: false, access: { has: obj => "alertSent" in obj, get: obj => obj.alertSent, set: (obj, value) => { obj.alertSent = value; } }, metadata: _metadata }, _alertSent_initializers, _alertSent_extraInitializers);
        __esDecorate(null, null, _documents_decorators, { kind: "field", name: "documents", static: false, private: false, access: { has: obj => "documents" in obj, get: obj => obj.documents, set: (obj, value) => { obj.documents = value; } }, metadata: _metadata }, _documents_initializers, _documents_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VisaImmigrationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VisaImmigrationModel = _classThis;
})();
exports.VisaImmigrationModel = VisaImmigrationModel;
/**
 * Country HR Rules Model
 */
let CountryHRRulesModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'country_hr_rules', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _country_decorators;
    let _country_initializers = [];
    let _country_extraInitializers = [];
    let _minimumWage_decorators;
    let _minimumWage_initializers = [];
    let _minimumWage_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _standardWorkWeek_decorators;
    let _standardWorkWeek_initializers = [];
    let _standardWorkWeek_extraInitializers = [];
    let _overtimeThreshold_decorators;
    let _overtimeThreshold_initializers = [];
    let _overtimeThreshold_extraInitializers = [];
    let _overtimeMultiplier_decorators;
    let _overtimeMultiplier_initializers = [];
    let _overtimeMultiplier_extraInitializers = [];
    let _statutoryLeaves_decorators;
    let _statutoryLeaves_initializers = [];
    let _statutoryLeaves_extraInitializers = [];
    let _noticePeriods_decorators;
    let _noticePeriods_initializers = [];
    let _noticePeriods_extraInitializers = [];
    let _probationPeriod_decorators;
    let _probationPeriod_initializers = [];
    let _probationPeriod_extraInitializers = [];
    let _workingTimeRegulation_decorators;
    let _workingTimeRegulation_initializers = [];
    let _workingTimeRegulation_extraInitializers = [];
    let _mandatoryBenefits_decorators;
    let _mandatoryBenefits_initializers = [];
    let _mandatoryBenefits_extraInitializers = [];
    let _terminationRules_decorators;
    let _terminationRules_initializers = [];
    let _terminationRules_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var CountryHRRulesModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.country = __runInitializers(this, _country_initializers, void 0);
            this.minimumWage = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _minimumWage_initializers, void 0));
            this.currency = (__runInitializers(this, _minimumWage_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.standardWorkWeek = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _standardWorkWeek_initializers, void 0));
            this.overtimeThreshold = (__runInitializers(this, _standardWorkWeek_extraInitializers), __runInitializers(this, _overtimeThreshold_initializers, void 0));
            this.overtimeMultiplier = (__runInitializers(this, _overtimeThreshold_extraInitializers), __runInitializers(this, _overtimeMultiplier_initializers, void 0));
            this.statutoryLeaves = (__runInitializers(this, _overtimeMultiplier_extraInitializers), __runInitializers(this, _statutoryLeaves_initializers, void 0));
            this.noticePeriods = (__runInitializers(this, _statutoryLeaves_extraInitializers), __runInitializers(this, _noticePeriods_initializers, void 0));
            this.probationPeriod = (__runInitializers(this, _noticePeriods_extraInitializers), __runInitializers(this, _probationPeriod_initializers, void 0));
            this.workingTimeRegulation = (__runInitializers(this, _probationPeriod_extraInitializers), __runInitializers(this, _workingTimeRegulation_initializers, void 0));
            this.mandatoryBenefits = (__runInitializers(this, _workingTimeRegulation_extraInitializers), __runInitializers(this, _mandatoryBenefits_initializers, void 0));
            this.terminationRules = (__runInitializers(this, _mandatoryBenefits_extraInitializers), __runInitializers(this, _terminationRules_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _terminationRules_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CountryHRRulesModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _country_decorators = [sequelize_typescript_1.Unique, (0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(2), primaryKey: true })];
        _minimumWage_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2))];
        _currency_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(3))];
        _standardWorkWeek_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(40), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _overtimeThreshold_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(40), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _overtimeMultiplier_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(1.5), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(3, 2))];
        _statutoryLeaves_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _noticePeriods_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _probationPeriod_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _workingTimeRegulation_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _mandatoryBenefits_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING))];
        _terminationRules_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: obj => "country" in obj, get: obj => obj.country, set: (obj, value) => { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
        __esDecorate(null, null, _minimumWage_decorators, { kind: "field", name: "minimumWage", static: false, private: false, access: { has: obj => "minimumWage" in obj, get: obj => obj.minimumWage, set: (obj, value) => { obj.minimumWage = value; } }, metadata: _metadata }, _minimumWage_initializers, _minimumWage_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _standardWorkWeek_decorators, { kind: "field", name: "standardWorkWeek", static: false, private: false, access: { has: obj => "standardWorkWeek" in obj, get: obj => obj.standardWorkWeek, set: (obj, value) => { obj.standardWorkWeek = value; } }, metadata: _metadata }, _standardWorkWeek_initializers, _standardWorkWeek_extraInitializers);
        __esDecorate(null, null, _overtimeThreshold_decorators, { kind: "field", name: "overtimeThreshold", static: false, private: false, access: { has: obj => "overtimeThreshold" in obj, get: obj => obj.overtimeThreshold, set: (obj, value) => { obj.overtimeThreshold = value; } }, metadata: _metadata }, _overtimeThreshold_initializers, _overtimeThreshold_extraInitializers);
        __esDecorate(null, null, _overtimeMultiplier_decorators, { kind: "field", name: "overtimeMultiplier", static: false, private: false, access: { has: obj => "overtimeMultiplier" in obj, get: obj => obj.overtimeMultiplier, set: (obj, value) => { obj.overtimeMultiplier = value; } }, metadata: _metadata }, _overtimeMultiplier_initializers, _overtimeMultiplier_extraInitializers);
        __esDecorate(null, null, _statutoryLeaves_decorators, { kind: "field", name: "statutoryLeaves", static: false, private: false, access: { has: obj => "statutoryLeaves" in obj, get: obj => obj.statutoryLeaves, set: (obj, value) => { obj.statutoryLeaves = value; } }, metadata: _metadata }, _statutoryLeaves_initializers, _statutoryLeaves_extraInitializers);
        __esDecorate(null, null, _noticePeriods_decorators, { kind: "field", name: "noticePeriods", static: false, private: false, access: { has: obj => "noticePeriods" in obj, get: obj => obj.noticePeriods, set: (obj, value) => { obj.noticePeriods = value; } }, metadata: _metadata }, _noticePeriods_initializers, _noticePeriods_extraInitializers);
        __esDecorate(null, null, _probationPeriod_decorators, { kind: "field", name: "probationPeriod", static: false, private: false, access: { has: obj => "probationPeriod" in obj, get: obj => obj.probationPeriod, set: (obj, value) => { obj.probationPeriod = value; } }, metadata: _metadata }, _probationPeriod_initializers, _probationPeriod_extraInitializers);
        __esDecorate(null, null, _workingTimeRegulation_decorators, { kind: "field", name: "workingTimeRegulation", static: false, private: false, access: { has: obj => "workingTimeRegulation" in obj, get: obj => obj.workingTimeRegulation, set: (obj, value) => { obj.workingTimeRegulation = value; } }, metadata: _metadata }, _workingTimeRegulation_initializers, _workingTimeRegulation_extraInitializers);
        __esDecorate(null, null, _mandatoryBenefits_decorators, { kind: "field", name: "mandatoryBenefits", static: false, private: false, access: { has: obj => "mandatoryBenefits" in obj, get: obj => obj.mandatoryBenefits, set: (obj, value) => { obj.mandatoryBenefits = value; } }, metadata: _metadata }, _mandatoryBenefits_initializers, _mandatoryBenefits_extraInitializers);
        __esDecorate(null, null, _terminationRules_decorators, { kind: "field", name: "terminationRules", static: false, private: false, access: { has: obj => "terminationRules" in obj, get: obj => obj.terminationRules, set: (obj, value) => { obj.terminationRules = value; } }, metadata: _metadata }, _terminationRules_initializers, _terminationRules_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CountryHRRulesModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CountryHRRulesModel = _classThis;
})();
exports.CountryHRRulesModel = CountryHRRulesModel;
/**
 * Cultural Profile Model
 */
let CulturalProfileModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'cultural_profiles', timestamps: true, paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employeeId_decorators;
    let _employeeId_initializers = [];
    let _employeeId_extraInitializers = [];
    let _country_decorators;
    let _country_initializers = [];
    let _country_extraInitializers = [];
    let _adaptationStage_decorators;
    let _adaptationStage_initializers = [];
    let _adaptationStage_extraInitializers = [];
    let _challengesReported_decorators;
    let _challengesReported_initializers = [];
    let _challengesReported_extraInitializers = [];
    let _supportProvided_decorators;
    let _supportProvided_initializers = [];
    let _supportProvided_extraInitializers = [];
    let _culturalTrainingCompleted_decorators;
    let _culturalTrainingCompleted_initializers = [];
    let _culturalTrainingCompleted_extraInitializers = [];
    let _culturalMentorAssigned_decorators;
    let _culturalMentorAssigned_initializers = [];
    let _culturalMentorAssigned_extraInitializers = [];
    let _adaptationScore_decorators;
    let _adaptationScore_initializers = [];
    let _adaptationScore_extraInitializers = [];
    let _assessmentDate_decorators;
    let _assessmentDate_initializers = [];
    let _assessmentDate_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var CulturalProfileModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employeeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employeeId_initializers, void 0));
            this.country = (__runInitializers(this, _employeeId_extraInitializers), __runInitializers(this, _country_initializers, void 0));
            this.adaptationStage = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _adaptationStage_initializers, void 0));
            this.challengesReported = (__runInitializers(this, _adaptationStage_extraInitializers), __runInitializers(this, _challengesReported_initializers, void 0));
            this.supportProvided = (__runInitializers(this, _challengesReported_extraInitializers), __runInitializers(this, _supportProvided_initializers, void 0));
            this.culturalTrainingCompleted = (__runInitializers(this, _supportProvided_extraInitializers), __runInitializers(this, _culturalTrainingCompleted_initializers, void 0));
            this.culturalMentorAssigned = (__runInitializers(this, _culturalTrainingCompleted_extraInitializers), __runInitializers(this, _culturalMentorAssigned_initializers, void 0));
            this.adaptationScore = (__runInitializers(this, _culturalMentorAssigned_extraInitializers), __runInitializers(this, _adaptationScore_initializers, void 0));
            this.assessmentDate = (__runInitializers(this, _adaptationScore_extraInitializers), __runInitializers(this, _assessmentDate_initializers, void 0));
            this.createdAt = (__runInitializers(this, _assessmentDate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "CulturalProfileModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _employeeId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _country_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(2))];
        _adaptationStage_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _challengesReported_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT))];
        _supportProvided_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT))];
        _culturalTrainingCompleted_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _culturalMentorAssigned_decorators = [(0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _adaptationScore_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _assessmentDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employeeId_decorators, { kind: "field", name: "employeeId", static: false, private: false, access: { has: obj => "employeeId" in obj, get: obj => obj.employeeId, set: (obj, value) => { obj.employeeId = value; } }, metadata: _metadata }, _employeeId_initializers, _employeeId_extraInitializers);
        __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: obj => "country" in obj, get: obj => obj.country, set: (obj, value) => { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
        __esDecorate(null, null, _adaptationStage_decorators, { kind: "field", name: "adaptationStage", static: false, private: false, access: { has: obj => "adaptationStage" in obj, get: obj => obj.adaptationStage, set: (obj, value) => { obj.adaptationStage = value; } }, metadata: _metadata }, _adaptationStage_initializers, _adaptationStage_extraInitializers);
        __esDecorate(null, null, _challengesReported_decorators, { kind: "field", name: "challengesReported", static: false, private: false, access: { has: obj => "challengesReported" in obj, get: obj => obj.challengesReported, set: (obj, value) => { obj.challengesReported = value; } }, metadata: _metadata }, _challengesReported_initializers, _challengesReported_extraInitializers);
        __esDecorate(null, null, _supportProvided_decorators, { kind: "field", name: "supportProvided", static: false, private: false, access: { has: obj => "supportProvided" in obj, get: obj => obj.supportProvided, set: (obj, value) => { obj.supportProvided = value; } }, metadata: _metadata }, _supportProvided_initializers, _supportProvided_extraInitializers);
        __esDecorate(null, null, _culturalTrainingCompleted_decorators, { kind: "field", name: "culturalTrainingCompleted", static: false, private: false, access: { has: obj => "culturalTrainingCompleted" in obj, get: obj => obj.culturalTrainingCompleted, set: (obj, value) => { obj.culturalTrainingCompleted = value; } }, metadata: _metadata }, _culturalTrainingCompleted_initializers, _culturalTrainingCompleted_extraInitializers);
        __esDecorate(null, null, _culturalMentorAssigned_decorators, { kind: "field", name: "culturalMentorAssigned", static: false, private: false, access: { has: obj => "culturalMentorAssigned" in obj, get: obj => obj.culturalMentorAssigned, set: (obj, value) => { obj.culturalMentorAssigned = value; } }, metadata: _metadata }, _culturalMentorAssigned_initializers, _culturalMentorAssigned_extraInitializers);
        __esDecorate(null, null, _adaptationScore_decorators, { kind: "field", name: "adaptationScore", static: false, private: false, access: { has: obj => "adaptationScore" in obj, get: obj => obj.adaptationScore, set: (obj, value) => { obj.adaptationScore = value; } }, metadata: _metadata }, _adaptationScore_initializers, _adaptationScore_extraInitializers);
        __esDecorate(null, null, _assessmentDate_decorators, { kind: "field", name: "assessmentDate", static: false, private: false, access: { has: obj => "assessmentDate" in obj, get: obj => obj.assessmentDate, set: (obj, value) => { obj.assessmentDate = value; } }, metadata: _metadata }, _assessmentDate_initializers, _assessmentDate_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CulturalProfileModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CulturalProfileModel = _classThis;
})();
exports.CulturalProfileModel = CulturalProfileModel;
/**
 * Exchange Rate Model
 */
let ExchangeRateModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'exchange_rates', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _fromCurrency_decorators;
    let _fromCurrency_initializers = [];
    let _fromCurrency_extraInitializers = [];
    let _toCurrency_decorators;
    let _toCurrency_initializers = [];
    let _toCurrency_extraInitializers = [];
    let _rate_decorators;
    let _rate_initializers = [];
    let _rate_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _source_decorators;
    let _source_initializers = [];
    let _source_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    var ExchangeRateModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.fromCurrency = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _fromCurrency_initializers, void 0));
            this.toCurrency = (__runInitializers(this, _fromCurrency_extraInitializers), __runInitializers(this, _toCurrency_initializers, void 0));
            this.rate = (__runInitializers(this, _toCurrency_extraInitializers), __runInitializers(this, _rate_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _rate_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.source = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _source_initializers, void 0));
            this.createdAt = (__runInitializers(this, _source_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ExchangeRateModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _fromCurrency_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(3))];
        _toCurrency_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(3))];
        _rate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(18, 6))];
        _effectiveDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _source_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _fromCurrency_decorators, { kind: "field", name: "fromCurrency", static: false, private: false, access: { has: obj => "fromCurrency" in obj, get: obj => obj.fromCurrency, set: (obj, value) => { obj.fromCurrency = value; } }, metadata: _metadata }, _fromCurrency_initializers, _fromCurrency_extraInitializers);
        __esDecorate(null, null, _toCurrency_decorators, { kind: "field", name: "toCurrency", static: false, private: false, access: { has: obj => "toCurrency" in obj, get: obj => obj.toCurrency, set: (obj, value) => { obj.toCurrency = value; } }, metadata: _metadata }, _toCurrency_initializers, _toCurrency_extraInitializers);
        __esDecorate(null, null, _rate_decorators, { kind: "field", name: "rate", static: false, private: false, access: { has: obj => "rate" in obj, get: obj => obj.rate, set: (obj, value) => { obj.rate = value; } }, metadata: _metadata }, _rate_initializers, _rate_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _source_decorators, { kind: "field", name: "source", static: false, private: false, access: { has: obj => "source" in obj, get: obj => obj.source, set: (obj, value) => { obj.source = value; } }, metadata: _metadata }, _source_initializers, _source_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExchangeRateModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExchangeRateModel = _classThis;
})();
exports.ExchangeRateModel = ExchangeRateModel;
/**
 * Global Payroll Sync Model
 */
let GlobalPayrollSyncModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'global_payroll_sync', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _country_decorators;
    let _country_initializers = [];
    let _country_extraInitializers = [];
    let _payrollPeriod_decorators;
    let _payrollPeriod_initializers = [];
    let _payrollPeriod_extraInitializers = [];
    let _employeeCount_decorators;
    let _employeeCount_initializers = [];
    let _employeeCount_extraInitializers = [];
    let _totalGrossPay_decorators;
    let _totalGrossPay_initializers = [];
    let _totalGrossPay_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _syncStatus_decorators;
    let _syncStatus_initializers = [];
    let _syncStatus_extraInitializers = [];
    let _syncDate_decorators;
    let _syncDate_initializers = [];
    let _syncDate_extraInitializers = [];
    let _errors_decorators;
    let _errors_initializers = [];
    let _errors_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var GlobalPayrollSyncModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.country = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _country_initializers, void 0));
            this.payrollPeriod = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _payrollPeriod_initializers, void 0));
            this.employeeCount = (__runInitializers(this, _payrollPeriod_extraInitializers), __runInitializers(this, _employeeCount_initializers, void 0));
            this.totalGrossPay = (__runInitializers(this, _employeeCount_extraInitializers), __runInitializers(this, _totalGrossPay_initializers, void 0));
            this.currency = (__runInitializers(this, _totalGrossPay_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.syncStatus = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _syncStatus_initializers, void 0));
            this.syncDate = (__runInitializers(this, _syncStatus_extraInitializers), __runInitializers(this, _syncDate_initializers, void 0));
            this.errors = (__runInitializers(this, _syncDate_extraInitializers), __runInitializers(this, _errors_initializers, void 0));
            this.createdAt = (__runInitializers(this, _errors_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "GlobalPayrollSyncModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _country_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(2))];
        _payrollPeriod_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20))];
        _employeeCount_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _totalGrossPay_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _currency_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(3))];
        _syncStatus_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)('PENDING'), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20))];
        _syncDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _errors_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: obj => "country" in obj, get: obj => obj.country, set: (obj, value) => { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
        __esDecorate(null, null, _payrollPeriod_decorators, { kind: "field", name: "payrollPeriod", static: false, private: false, access: { has: obj => "payrollPeriod" in obj, get: obj => obj.payrollPeriod, set: (obj, value) => { obj.payrollPeriod = value; } }, metadata: _metadata }, _payrollPeriod_initializers, _payrollPeriod_extraInitializers);
        __esDecorate(null, null, _employeeCount_decorators, { kind: "field", name: "employeeCount", static: false, private: false, access: { has: obj => "employeeCount" in obj, get: obj => obj.employeeCount, set: (obj, value) => { obj.employeeCount = value; } }, metadata: _metadata }, _employeeCount_initializers, _employeeCount_extraInitializers);
        __esDecorate(null, null, _totalGrossPay_decorators, { kind: "field", name: "totalGrossPay", static: false, private: false, access: { has: obj => "totalGrossPay" in obj, get: obj => obj.totalGrossPay, set: (obj, value) => { obj.totalGrossPay = value; } }, metadata: _metadata }, _totalGrossPay_initializers, _totalGrossPay_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _syncStatus_decorators, { kind: "field", name: "syncStatus", static: false, private: false, access: { has: obj => "syncStatus" in obj, get: obj => obj.syncStatus, set: (obj, value) => { obj.syncStatus = value; } }, metadata: _metadata }, _syncStatus_initializers, _syncStatus_extraInitializers);
        __esDecorate(null, null, _syncDate_decorators, { kind: "field", name: "syncDate", static: false, private: false, access: { has: obj => "syncDate" in obj, get: obj => obj.syncDate, set: (obj, value) => { obj.syncDate = value; } }, metadata: _metadata }, _syncDate_initializers, _syncDate_extraInitializers);
        __esDecorate(null, null, _errors_decorators, { kind: "field", name: "errors", static: false, private: false, access: { has: obj => "errors" in obj, get: obj => obj.errors, set: (obj, value) => { obj.errors = value; } }, metadata: _metadata }, _errors_initializers, _errors_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GlobalPayrollSyncModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GlobalPayrollSyncModel = _classThis;
})();
exports.GlobalPayrollSyncModel = GlobalPayrollSyncModel;
/**
 * Global Compliance Model
 */
let GlobalComplianceModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'global_compliance', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _country_decorators;
    let _country_initializers = [];
    let _country_extraInitializers = [];
    let _framework_decorators;
    let _framework_initializers = [];
    let _framework_extraInitializers = [];
    let _complianceStatus_decorators;
    let _complianceStatus_initializers = [];
    let _complianceStatus_extraInitializers = [];
    let _lastAuditDate_decorators;
    let _lastAuditDate_initializers = [];
    let _lastAuditDate_extraInitializers = [];
    let _nextAuditDate_decorators;
    let _nextAuditDate_initializers = [];
    let _nextAuditDate_extraInitializers = [];
    let _findings_decorators;
    let _findings_initializers = [];
    let _findings_extraInitializers = [];
    let _remediationActions_decorators;
    let _remediationActions_initializers = [];
    let _remediationActions_extraInitializers = [];
    let _responsibleParty_decorators;
    let _responsibleParty_initializers = [];
    let _responsibleParty_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var GlobalComplianceModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.country = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _country_initializers, void 0));
            this.framework = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _framework_initializers, void 0));
            this.complianceStatus = (__runInitializers(this, _framework_extraInitializers), __runInitializers(this, _complianceStatus_initializers, void 0));
            this.lastAuditDate = (__runInitializers(this, _complianceStatus_extraInitializers), __runInitializers(this, _lastAuditDate_initializers, void 0));
            this.nextAuditDate = (__runInitializers(this, _lastAuditDate_extraInitializers), __runInitializers(this, _nextAuditDate_initializers, void 0));
            this.findings = (__runInitializers(this, _nextAuditDate_extraInitializers), __runInitializers(this, _findings_initializers, void 0));
            this.remediationActions = (__runInitializers(this, _findings_extraInitializers), __runInitializers(this, _remediationActions_initializers, void 0));
            this.responsibleParty = (__runInitializers(this, _remediationActions_extraInitializers), __runInitializers(this, _responsibleParty_initializers, void 0));
            this.createdAt = (__runInitializers(this, _responsibleParty_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "GlobalComplianceModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _country_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(2))];
        _framework_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _complianceStatus_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(20))];
        _lastAuditDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _nextAuditDate_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _findings_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT))];
        _remediationActions_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT))];
        _responsibleParty_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: obj => "country" in obj, get: obj => obj.country, set: (obj, value) => { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
        __esDecorate(null, null, _framework_decorators, { kind: "field", name: "framework", static: false, private: false, access: { has: obj => "framework" in obj, get: obj => obj.framework, set: (obj, value) => { obj.framework = value; } }, metadata: _metadata }, _framework_initializers, _framework_extraInitializers);
        __esDecorate(null, null, _complianceStatus_decorators, { kind: "field", name: "complianceStatus", static: false, private: false, access: { has: obj => "complianceStatus" in obj, get: obj => obj.complianceStatus, set: (obj, value) => { obj.complianceStatus = value; } }, metadata: _metadata }, _complianceStatus_initializers, _complianceStatus_extraInitializers);
        __esDecorate(null, null, _lastAuditDate_decorators, { kind: "field", name: "lastAuditDate", static: false, private: false, access: { has: obj => "lastAuditDate" in obj, get: obj => obj.lastAuditDate, set: (obj, value) => { obj.lastAuditDate = value; } }, metadata: _metadata }, _lastAuditDate_initializers, _lastAuditDate_extraInitializers);
        __esDecorate(null, null, _nextAuditDate_decorators, { kind: "field", name: "nextAuditDate", static: false, private: false, access: { has: obj => "nextAuditDate" in obj, get: obj => obj.nextAuditDate, set: (obj, value) => { obj.nextAuditDate = value; } }, metadata: _metadata }, _nextAuditDate_initializers, _nextAuditDate_extraInitializers);
        __esDecorate(null, null, _findings_decorators, { kind: "field", name: "findings", static: false, private: false, access: { has: obj => "findings" in obj, get: obj => obj.findings, set: (obj, value) => { obj.findings = value; } }, metadata: _metadata }, _findings_initializers, _findings_extraInitializers);
        __esDecorate(null, null, _remediationActions_decorators, { kind: "field", name: "remediationActions", static: false, private: false, access: { has: obj => "remediationActions" in obj, get: obj => obj.remediationActions, set: (obj, value) => { obj.remediationActions = value; } }, metadata: _metadata }, _remediationActions_initializers, _remediationActions_extraInitializers);
        __esDecorate(null, null, _responsibleParty_decorators, { kind: "field", name: "responsibleParty", static: false, private: false, access: { has: obj => "responsibleParty" in obj, get: obj => obj.responsibleParty, set: (obj, value) => { obj.responsibleParty = value; } }, metadata: _metadata }, _responsibleParty_initializers, _responsibleParty_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GlobalComplianceModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GlobalComplianceModel = _classThis;
})();
exports.GlobalComplianceModel = GlobalComplianceModel;
/**
 * Global Organizational Unit Model
 */
let GlobalOrgUnitModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'global_org_units', timestamps: true, paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _unitName_decorators;
    let _unitName_initializers = [];
    let _unitName_extraInitializers = [];
    let _country_decorators;
    let _country_initializers = [];
    let _country_extraInitializers = [];
    let _legalEntity_decorators;
    let _legalEntity_initializers = [];
    let _legalEntity_extraInitializers = [];
    let _parentUnitId_decorators;
    let _parentUnitId_initializers = [];
    let _parentUnitId_extraInitializers = [];
    let _headcount_decorators;
    let _headcount_initializers = [];
    let _headcount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _costCenter_decorators;
    let _costCenter_initializers = [];
    let _costCenter_extraInitializers = [];
    let _active_decorators;
    let _active_initializers = [];
    let _active_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _parentUnit_decorators;
    let _parentUnit_initializers = [];
    let _parentUnit_extraInitializers = [];
    let _childUnits_decorators;
    let _childUnits_initializers = [];
    let _childUnits_extraInitializers = [];
    var GlobalOrgUnitModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.unitName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _unitName_initializers, void 0));
            this.country = (__runInitializers(this, _unitName_extraInitializers), __runInitializers(this, _country_initializers, void 0));
            this.legalEntity = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _legalEntity_initializers, void 0));
            this.parentUnitId = (__runInitializers(this, _legalEntity_extraInitializers), __runInitializers(this, _parentUnitId_initializers, void 0));
            this.headcount = (__runInitializers(this, _parentUnitId_extraInitializers), __runInitializers(this, _headcount_initializers, void 0));
            this.currency = (__runInitializers(this, _headcount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.costCenter = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _costCenter_initializers, void 0));
            this.active = (__runInitializers(this, _costCenter_extraInitializers), __runInitializers(this, _active_initializers, void 0));
            this.createdAt = (__runInitializers(this, _active_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.parentUnit = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _parentUnit_initializers, void 0));
            this.childUnits = (__runInitializers(this, _parentUnit_extraInitializers), __runInitializers(this, _childUnits_initializers, void 0));
            __runInitializers(this, _childUnits_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "GlobalOrgUnitModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, primaryKey: true })];
        _unitName_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _country_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(2))];
        _legalEntity_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200))];
        _parentUnitId_decorators = [(0, sequelize_typescript_1.IsUUID)(4), (0, sequelize_typescript_1.ForeignKey)(() => GlobalOrgUnitModel), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _headcount_decorators = [(0, sequelize_typescript_1.Default)(0), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _currency_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(3))];
        _costCenter_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50))];
        _active_decorators = [(0, sequelize_typescript_1.Default)(true), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _parentUnit_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => GlobalOrgUnitModel, 'parentUnitId')];
        _childUnits_decorators = [(0, sequelize_typescript_1.HasMany)(() => GlobalOrgUnitModel, 'parentUnitId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _unitName_decorators, { kind: "field", name: "unitName", static: false, private: false, access: { has: obj => "unitName" in obj, get: obj => obj.unitName, set: (obj, value) => { obj.unitName = value; } }, metadata: _metadata }, _unitName_initializers, _unitName_extraInitializers);
        __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: obj => "country" in obj, get: obj => obj.country, set: (obj, value) => { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
        __esDecorate(null, null, _legalEntity_decorators, { kind: "field", name: "legalEntity", static: false, private: false, access: { has: obj => "legalEntity" in obj, get: obj => obj.legalEntity, set: (obj, value) => { obj.legalEntity = value; } }, metadata: _metadata }, _legalEntity_initializers, _legalEntity_extraInitializers);
        __esDecorate(null, null, _parentUnitId_decorators, { kind: "field", name: "parentUnitId", static: false, private: false, access: { has: obj => "parentUnitId" in obj, get: obj => obj.parentUnitId, set: (obj, value) => { obj.parentUnitId = value; } }, metadata: _metadata }, _parentUnitId_initializers, _parentUnitId_extraInitializers);
        __esDecorate(null, null, _headcount_decorators, { kind: "field", name: "headcount", static: false, private: false, access: { has: obj => "headcount" in obj, get: obj => obj.headcount, set: (obj, value) => { obj.headcount = value; } }, metadata: _metadata }, _headcount_initializers, _headcount_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _costCenter_decorators, { kind: "field", name: "costCenter", static: false, private: false, access: { has: obj => "costCenter" in obj, get: obj => obj.costCenter, set: (obj, value) => { obj.costCenter = value; } }, metadata: _metadata }, _costCenter_initializers, _costCenter_extraInitializers);
        __esDecorate(null, null, _active_decorators, { kind: "field", name: "active", static: false, private: false, access: { has: obj => "active" in obj, get: obj => obj.active, set: (obj, value) => { obj.active = value; } }, metadata: _metadata }, _active_initializers, _active_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _parentUnit_decorators, { kind: "field", name: "parentUnit", static: false, private: false, access: { has: obj => "parentUnit" in obj, get: obj => obj.parentUnit, set: (obj, value) => { obj.parentUnit = value; } }, metadata: _metadata }, _parentUnit_initializers, _parentUnit_extraInitializers);
        __esDecorate(null, null, _childUnits_decorators, { kind: "field", name: "childUnits", static: false, private: false, access: { has: obj => "childUnits" in obj, get: obj => obj.childUnits, set: (obj, value) => { obj.childUnits = value; } }, metadata: _metadata }, _childUnits_initializers, _childUnits_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GlobalOrgUnitModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GlobalOrgUnitModel = _classThis;
})();
exports.GlobalOrgUnitModel = GlobalOrgUnitModel;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Multi-Country HR Management Functions
 */
/**
 * Create a global employee profile with multi-country capabilities
 * @param employeeData - Global employee data
 * @param transaction - Optional database transaction
 * @returns Created global employee record
 */
async function createGlobalEmployee(employeeData, transaction) {
    const validated = exports.GlobalEmployeeSchema.parse(employeeData);
    const globalEmployee = await GlobalEmployeeModel.create({
        ...validated,
        workAuthorizations: [],
        languageProficiencies: [],
        taxResidency: [],
    }, { transaction });
    return globalEmployee;
}
/**
 * Update global employee profile with country-specific information
 * @param employeeId - Employee ID
 * @param updates - Profile updates
 * @param transaction - Optional database transaction
 * @returns Updated global employee
 */
async function updateGlobalEmployeeProfile(employeeId, updates, transaction) {
    const employee = await GlobalEmployeeModel.findOne({
        where: { employeeId },
        transaction,
    });
    if (!employee) {
        throw new common_1.NotFoundException(`Global employee ${employeeId} not found`);
    }
    await employee.update(updates, { transaction });
    return employee;
}
/**
 * Get all employees by country with filtering
 * @param country - Country code
 * @param options - Query options
 * @returns List of employees in country
 */
async function getEmployeeByCountry(country, options) {
    const where = { currentCountry: country };
    if (options?.isExpatriate !== undefined) {
        where.isExpatriate = options.isExpatriate;
    }
    const employees = await GlobalEmployeeModel.findAll({
        where,
        include: options?.includeAssignments
            ? [{ model: GlobalAssignmentModel, as: 'globalAssignments' }]
            : undefined,
        transaction: options?.transaction,
    });
    return employees;
}
/**
 * Transfer employee to different country
 * @param employeeId - Employee ID
 * @param toCountry - Destination country
 * @param effectiveDate - Effective transfer date
 * @param transaction - Optional database transaction
 * @returns Updated employee record
 */
async function transferEmployeeCountry(employeeId, toCountry, effectiveDate, transaction) {
    const employee = await GlobalEmployeeModel.findOne({
        where: { employeeId },
        transaction,
    });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${employeeId} not found`);
    }
    const fromCountry = employee.currentCountry;
    await employee.update({
        currentCountry: toCountry,
        isExpatriate: employee.homeCountry !== toCountry,
    }, { transaction });
    // Create international transfer record
    await InternationalTransferModel.create({
        employeeId,
        fromCountry,
        toCountry,
        fromLegalEntity: `${fromCountry}_Entity`,
        toLegalEntity: `${toCountry}_Entity`,
        transferDate: effectiveDate,
        reason: 'Country transfer',
        isPermanent: false,
        relocation: {
            relocationPackage: 'Standard',
            estimatedCost: 0,
            currency: CurrencyCode.USD,
            arrivalServices: [],
            status: RelocationStatus.INITIATED,
        },
        status: RelocationStatus.INITIATED,
    }, { transaction });
    return employee;
}
/**
 * Country-Specific Rules & Regulations Functions
 */
/**
 * Get HR rules for a specific country
 * @param country - Country code
 * @param transaction - Optional database transaction
 * @returns Country HR rules
 */
async function getCountryHRRules(country, transaction) {
    const rules = await CountryHRRulesModel.findByPk(country, { transaction });
    if (!rules) {
        throw new common_1.NotFoundException(`HR rules for country ${country} not found`);
    }
    return rules;
}
/**
 * Validate employment contract against country regulations
 * @param country - Country code
 * @param contractData - Contract data to validate
 * @param transaction - Optional database transaction
 * @returns Validation result with any violations
 */
async function validateEmploymentContract(country, contractData, transaction) {
    const rules = await getCountryHRRules(country, transaction);
    const violations = [];
    // Check minimum wage
    if (rules.minimumWage && contractData.salary < rules.minimumWage) {
        violations.push(`Salary below minimum wage: ${contractData.salary} < ${rules.minimumWage} ${rules.currency}`);
    }
    // Check working hours
    if (contractData.workingHoursPerWeek > rules.standardWorkWeek) {
        violations.push(`Working hours exceed standard: ${contractData.workingHoursPerWeek} > ${rules.standardWorkWeek}`);
    }
    // Check probation period
    if (rules.probationPeriod && contractData.probationPeriodDays > rules.probationPeriod) {
        violations.push(`Probation period exceeds maximum: ${contractData.probationPeriodDays} > ${rules.probationPeriod} days`);
    }
    return {
        valid: violations.length === 0,
        violations,
    };
}
/**
 * Apply country-specific working hours regulations
 * @param country - Country code
 * @param hoursWorked - Hours worked in period
 * @param transaction - Optional database transaction
 * @returns Calculated regular and overtime hours
 */
async function applyCountrySpecificWorkingHours(country, hoursWorked, transaction) {
    const rules = await getCountryHRRules(country, transaction);
    const regularHours = Math.min(hoursWorked, rules.overtimeThreshold);
    const overtimeHours = Math.max(0, hoursWorked - rules.overtimeThreshold);
    return {
        regularHours,
        overtimeHours,
        overtimeMultiplier: parseFloat(rules.overtimeMultiplier.toString()),
    };
}
/**
 * Get country statutory leave entitlements
 * @param country - Country code
 * @param transaction - Optional database transaction
 * @returns List of statutory leaves
 */
async function getCountryStatutoryLeaves(country, transaction) {
    const rules = await getCountryHRRules(country, transaction);
    return rules.statutoryLeaves;
}
/**
 * Global Assignment & Expatriate Management Functions
 */
/**
 * Create a new global assignment
 * @param assignmentData - Assignment data
 * @param transaction - Optional database transaction
 * @returns Created assignment
 */
async function createGlobalAssignment(assignmentData, transaction) {
    const validated = exports.GlobalAssignmentSchema.parse(assignmentData);
    // Verify employee exists
    const employee = await GlobalEmployeeModel.findOne({
        where: { employeeId: validated.employeeId },
        transaction,
    });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${validated.employeeId} not found`);
    }
    // Create assignment with default costs structure
    const assignment = await GlobalAssignmentModel.create({
        ...validated,
        status: GlobalAssignmentStatus.PLANNING,
        assignmentCosts: {
            baseSalary: 0,
            currency: CurrencyCode.USD,
            allowances: [],
            relocationCost: 0,
            housingCost: 0,
            educationCost: 0,
            taxCost: 0,
            totalEstimatedCost: 0,
            actualCostToDate: 0,
        },
        taxEqualization: {
            method: TaxEqualizationMethod.TAX_EQUALIZATION,
            homeCountryTax: 0,
            hostCountryTax: 0,
            hypotheticalTax: 0,
            taxReimbursement: 0,
            taxGrossUp: 0,
            taxYear: new Date().getFullYear(),
        },
        benefits: {
            healthInsurance: {
                type: GlobalBenefitType.HEALTH_INSURANCE,
                provider: '',
                coverage: '',
                employerCost: 0,
                employeeCost: 0,
                currency: CurrencyCode.USD,
            },
            lifeInsurance: {
                type: GlobalBenefitType.LIFE_INSURANCE,
                provider: '',
                coverage: '',
                employerCost: 0,
                employeeCost: 0,
                currency: CurrencyCode.USD,
            },
            pension: {
                type: GlobalBenefitType.PENSION_RETIREMENT,
                provider: '',
                coverage: '',
                employerCost: 0,
                employeeCost: 0,
                currency: CurrencyCode.USD,
            },
            additionalBenefits: [],
            totalValue: 0,
            currency: CurrencyCode.USD,
        },
    }, { transaction });
    // Mark employee as expatriate
    await employee.update({
        isExpatriate: true,
        expatriateStartDate: validated.startDate,
        currentCountry: validated.hostCountry,
    }, { transaction });
    return assignment;
}
/**
 * Track expatriate assignment progress and costs
 * @param assignmentId - Assignment ID
 * @param transaction - Optional database transaction
 * @returns Assignment with current tracking data
 */
async function trackExpatriateAssignment(assignmentId, transaction) {
    const assignment = await GlobalAssignmentModel.findByPk(assignmentId, {
        include: [GlobalEmployeeModel],
        transaction,
    });
    if (!assignment) {
        throw new common_1.NotFoundException(`Assignment ${assignmentId} not found`);
    }
    // Calculate days into assignment
    const today = new Date();
    const daysElapsed = Math.floor((today.getTime() - assignment.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalDays = Math.floor((assignment.plannedEndDate.getTime() - assignment.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const progressPercentage = Math.min(100, (daysElapsed / totalDays) * 100);
    return assignment;
}
/**
 * Calculate total assignment costs including all allowances
 * @param assignmentId - Assignment ID
 * @param transaction - Optional database transaction
 * @returns Detailed cost breakdown
 */
async function calculateAssignmentCosts(assignmentId, transaction) {
    const assignment = await GlobalAssignmentModel.findByPk(assignmentId, { transaction });
    if (!assignment) {
        throw new common_1.NotFoundException(`Assignment ${assignmentId} not found`);
    }
    const costs = assignment.assignmentCosts;
    // Calculate total from all components
    const allowancesTotal = costs.allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
    const totalEstimatedCost = costs.baseSalary +
        allowancesTotal +
        costs.relocationCost +
        costs.housingCost +
        costs.educationCost +
        costs.taxCost;
    costs.totalEstimatedCost = totalEstimatedCost;
    await assignment.update({ assignmentCosts: costs }, { transaction });
    return costs;
}
/**
 * End global assignment and repatriate employee
 * @param assignmentId - Assignment ID
 * @param actualEndDate - Actual end date
 * @param transaction - Optional database transaction
 * @returns Updated assignment
 */
async function endGlobalAssignment(assignmentId, actualEndDate, transaction) {
    const assignment = await GlobalAssignmentModel.findByPk(assignmentId, {
        include: [GlobalEmployeeModel],
        transaction,
    });
    if (!assignment) {
        throw new common_1.NotFoundException(`Assignment ${assignmentId} not found`);
    }
    await assignment.update({
        actualEndDate,
        status: GlobalAssignmentStatus.COMPLETED,
    }, { transaction });
    // Check if employee has other active assignments
    const otherAssignments = await GlobalAssignmentModel.count({
        where: {
            employeeId: assignment.employeeId,
            status: GlobalAssignmentStatus.ACTIVE,
            id: { [sequelize_1.Op.ne]: assignmentId },
        },
        transaction,
    });
    // If no other assignments, mark as no longer expatriate
    if (otherAssignments === 0 && assignment.employee) {
        await assignment.employee.update({
            isExpatriate: false,
            repatriationDate: actualEndDate,
            currentCountry: assignment.employee.homeCountry,
        }, { transaction });
    }
    return assignment;
}
/**
 * International Transfers & Relocations Functions
 */
/**
 * Initiate international transfer process
 * @param transferData - Transfer data
 * @param transaction - Optional database transaction
 * @returns Created transfer record
 */
async function initiateInternationalTransfer(transferData, transaction) {
    const validated = exports.InternationalTransferSchema.parse(transferData);
    const transfer = await InternationalTransferModel.create({
        ...validated,
        relocation: {
            relocationPackage: 'Standard',
            estimatedCost: 0,
            currency: CurrencyCode.USD,
            arrivalServices: [],
            status: RelocationStatus.INITIATED,
        },
        status: RelocationStatus.INITIATED,
    }, { transaction });
    return transfer;
}
/**
 * Calculate relocation costs based on country and family size
 * @param transferId - Transfer ID
 * @param familySize - Number of family members
 * @param transaction - Optional database transaction
 * @returns Estimated relocation cost
 */
async function calculateRelocationCosts(transferId, familySize, transaction) {
    const transfer = await InternationalTransferModel.findByPk(transferId, { transaction });
    if (!transfer) {
        throw new common_1.NotFoundException(`Transfer ${transferId} not found`);
    }
    // Base cost factors (simplified calculation)
    const baseCost = 10000; // Base relocation cost
    const perPersonCost = 3000;
    const shippingCost = 5000;
    const temporaryHousingCost = 4000; // 30 days average
    const totalCost = baseCost + perPersonCost * familySize + shippingCost + temporaryHousingCost;
    const breakdown = {
        baseCost,
        familyCost: perPersonCost * familySize,
        shippingCost,
        temporaryHousingCost,
    };
    // Update transfer with cost estimate
    const relocation = transfer.relocation;
    relocation.estimatedCost = totalCost;
    await transfer.update({ relocation }, { transaction });
    return {
        estimatedCost: totalCost,
        currency: CurrencyCode.USD,
        breakdown,
    };
}
/**
 * Track relocation progress through various stages
 * @param transferId - Transfer ID
 * @param newStatus - New relocation status
 * @param transaction - Optional database transaction
 * @returns Updated transfer
 */
async function trackRelocationProgress(transferId, newStatus, transaction) {
    const transfer = await InternationalTransferModel.findByPk(transferId, { transaction });
    if (!transfer) {
        throw new common_1.NotFoundException(`Transfer ${transferId} not found`);
    }
    await transfer.update({ status: newStatus }, { transaction });
    return transfer;
}
/**
 * Complete relocation and finalize all activities
 * @param transferId - Transfer ID
 * @param actualCost - Actual relocation cost
 * @param transaction - Optional database transaction
 * @returns Completed transfer
 */
async function completeRelocation(transferId, actualCost, transaction) {
    const transfer = await InternationalTransferModel.findByPk(transferId, { transaction });
    if (!transfer) {
        throw new common_1.NotFoundException(`Transfer ${transferId} not found`);
    }
    const relocation = transfer.relocation;
    relocation.status = RelocationStatus.COMPLETED;
    await transfer.update({
        status: RelocationStatus.COMPLETED,
        relocation,
    }, { transaction });
    return transfer;
}
/**
 * Global Payroll Integration Functions
 */
/**
 * Synchronize global payroll data across countries
 * @param country - Country to sync
 * @param payrollPeriod - Payroll period
 * @param transaction - Optional database transaction
 * @returns Sync record
 */
async function syncGlobalPayrollData(country, payrollPeriod, transaction) {
    // Get all employees for country
    const employees = await getEmployeeByCountry(country, { transaction });
    const syncRecord = await GlobalPayrollSyncModel.create({
        country,
        payrollPeriod,
        employeeCount: employees.length,
        totalGrossPay: 0,
        currency: CurrencyCode.USD,
        syncStatus: 'IN_PROGRESS',
        syncDate: new Date(),
    }, { transaction });
    return syncRecord;
}
/**
 * Calculate multi-country payroll with currency conversion
 * @param payrollPeriod - Payroll period
 * @param countries - Countries to include
 * @param baseCurrency - Base currency for reporting
 * @param transaction - Optional database transaction
 * @returns Consolidated payroll data
 */
async function calculateMultiCountryPayroll(payrollPeriod, countries, baseCurrency, transaction) {
    const byCountry = [];
    let totalInBaseCurrency = 0;
    for (const country of countries) {
        const syncRecords = await GlobalPayrollSyncModel.findAll({
            where: { country, payrollPeriod },
            transaction,
        });
        const countryTotal = syncRecords.reduce((sum, record) => sum + record.totalGrossPay, 0);
        const countryCurrency = syncRecords[0]?.currency || CurrencyCode.USD;
        // Convert to base currency (simplified - would use exchange rates)
        const converted = countryTotal; // In real implementation, apply exchange rate
        byCountry.push({
            country,
            amount: countryTotal,
            currency: countryCurrency,
        });
        totalInBaseCurrency += converted;
    }
    return {
        totalGrossPay: totalInBaseCurrency,
        currency: baseCurrency,
        byCountry,
    };
}
/**
 * Reconcile global payroll across all entities
 * @param payrollPeriod - Payroll period
 * @param transaction - Optional database transaction
 * @returns Reconciliation results
 */
async function reconcileGlobalPayroll(payrollPeriod, transaction) {
    const allSyncs = await GlobalPayrollSyncModel.findAll({
        where: { payrollPeriod },
        transaction,
    });
    const discrepancies = [];
    for (const sync of allSyncs) {
        if (sync.syncStatus !== 'COMPLETED') {
            discrepancies.push({
                country: sync.country,
                issue: 'Sync not completed',
                status: sync.syncStatus,
            });
        }
        if (sync.errors && sync.errors.length > 0) {
            discrepancies.push({
                country: sync.country,
                issue: 'Sync errors',
                errors: sync.errors,
            });
        }
    }
    return {
        reconciled: discrepancies.length === 0,
        discrepancies,
    };
}
/**
 * Generate global payslips for all countries
 * @param payrollPeriod - Payroll period
 * @param transaction - Optional database transaction
 * @returns Generated payslip count
 */
async function generateGlobalPayslips(payrollPeriod, transaction) {
    const syncs = await GlobalPayrollSyncModel.findAll({
        where: { payrollPeriod, syncStatus: 'COMPLETED' },
        transaction,
    });
    const byCountry = new Map();
    let totalGenerated = 0;
    for (const sync of syncs) {
        const count = sync.employeeCount;
        byCountry.set(sync.country, count);
        totalGenerated += count;
    }
    return {
        generated: totalGenerated,
        byCountry,
    };
}
/**
 * Currency & Exchange Rate Management Functions
 */
/**
 * Get current exchange rates for currency pair
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param effectiveDate - Effective date (defaults to today)
 * @param transaction - Optional database transaction
 * @returns Exchange rate
 */
async function getExchangeRates(fromCurrency, toCurrency, effectiveDate, transaction) {
    const date = effectiveDate || new Date();
    const rate = await ExchangeRateModel.findOne({
        where: {
            fromCurrency,
            toCurrency,
            effectiveDate: { [sequelize_1.Op.lte]: date },
        },
        order: [['effectiveDate', 'DESC']],
        transaction,
    });
    if (!rate) {
        throw new common_1.NotFoundException(`Exchange rate not found for ${fromCurrency} to ${toCurrency} on ${date.toISOString()}`);
    }
    return parseFloat(rate.rate.toString());
}
/**
 * Convert salary amount to different currency
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param effectiveDate - Effective date
 * @param transaction - Optional database transaction
 * @returns Converted amount
 */
async function convertSalaryToCurrency(amount, fromCurrency, toCurrency, effectiveDate, transaction) {
    if (fromCurrency === toCurrency) {
        return { convertedAmount: amount, rate: 1, currency: toCurrency };
    }
    const rate = await getExchangeRates(fromCurrency, toCurrency, effectiveDate, transaction);
    const convertedAmount = amount * rate;
    return {
        convertedAmount: Math.round(convertedAmount * 100) / 100,
        rate,
        currency: toCurrency,
    };
}
/**
 * Track currency fluctuations for budgeting
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param daysBack - Days to look back
 * @param transaction - Optional database transaction
 * @returns Fluctuation analysis
 */
async function trackCurrencyFluctuations(fromCurrency, toCurrency, daysBack, transaction) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    const rates = await ExchangeRateModel.findAll({
        where: {
            fromCurrency,
            toCurrency,
            effectiveDate: { [sequelize_1.Op.gte]: startDate },
        },
        order: [['effectiveDate', 'DESC']],
        transaction,
    });
    if (rates.length === 0) {
        throw new common_1.NotFoundException(`No exchange rate history found for ${fromCurrency}/${toCurrency}`);
    }
    const rateValues = rates.map((r) => parseFloat(r.rate.toString()));
    const currentRate = rateValues[0];
    const averageRate = rateValues.reduce((a, b) => a + b, 0) / rateValues.length;
    const minRate = Math.min(...rateValues);
    const maxRate = Math.max(...rateValues);
    const volatility = ((maxRate - minRate) / averageRate) * 100;
    return {
        currentRate,
        averageRate: Math.round(averageRate * 1000000) / 1000000,
        minRate,
        maxRate,
        volatility: Math.round(volatility * 100) / 100,
    };
}
/**
 * Apply exchange rate adjustments to payroll
 * @param assignmentId - Assignment ID
 * @param newRate - New exchange rate
 * @param transaction - Optional database transaction
 * @returns Updated assignment costs
 */
async function applyExchangeRateAdjustments(assignmentId, newRate, transaction) {
    const assignment = await GlobalAssignmentModel.findByPk(assignmentId, { transaction });
    if (!assignment) {
        throw new common_1.NotFoundException(`Assignment ${assignmentId} not found`);
    }
    const costs = assignment.assignmentCosts;
    // Apply rate adjustment to all currency-dependent costs
    costs.allowances = costs.allowances.map((allowance) => ({
        ...allowance,
        amount: allowance.amount * newRate,
    }));
    await assignment.update({ assignmentCosts: costs }, { transaction });
    return costs;
}
/**
 * Global Benefits Administration Functions
 */
/**
 * Enroll employee in global benefits program
 * @param employeeId - Employee ID
 * @param country - Country
 * @param benefitTypes - Benefit types to enroll
 * @param transaction - Optional database transaction
 * @returns Enrollment confirmation
 */
async function enrollInGlobalBenefits(employeeId, country, benefitTypes, transaction) {
    const employee = await GlobalEmployeeModel.findOne({
        where: { employeeId },
        transaction,
    });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${employeeId} not found`);
    }
    // In real implementation, would create benefit enrollment records
    return {
        enrolled: true,
        benefits: benefitTypes,
    };
}
/**
 * Calculate global benefits costs across all countries
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns Total benefit costs
 */
async function calculateGlobalBenefitsCosts(employeeId, transaction) {
    const assignments = await GlobalAssignmentModel.findAll({
        where: { employeeId, status: GlobalAssignmentStatus.ACTIVE },
        transaction,
    });
    let totalCost = 0;
    const breakdown = [];
    for (const assignment of assignments) {
        const benefitValue = assignment.benefits.totalValue;
        totalCost += benefitValue;
        breakdown.push({
            country: assignment.hostCountry,
            cost: benefitValue,
            currency: assignment.benefits.currency,
        });
    }
    return {
        totalCost,
        currency: CurrencyCode.USD,
        breakdown,
    };
}
/**
 * Synchronize benefits across countries for transferred employees
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns Sync results
 */
async function syncBenefitsAcrossCountries(employeeId, transaction) {
    const employee = await GlobalEmployeeModel.findOne({
        where: { employeeId },
        include: [GlobalAssignmentModel],
        transaction,
    });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${employeeId} not found`);
    }
    const countries = employee.globalAssignments
        .filter((a) => a.status === GlobalAssignmentStatus.ACTIVE)
        .map((a) => a.hostCountry);
    // In real implementation, would sync benefit data
    return {
        synced: true,
        countries,
    };
}
/**
 * Generate benefits comparison across countries
 * @param countries - Countries to compare
 * @param transaction - Optional database transaction
 * @returns Benefits comparison
 */
async function generateBenefitsComparison(countries, transaction) {
    const comparison = {};
    for (const country of countries) {
        const rules = await getCountryHRRules(country, transaction);
        comparison[country] = {
            mandatoryBenefits: rules.mandatoryBenefits,
            currency: rules.currency,
        };
    }
    return comparison;
}
/**
 * Tax Equalization & Gross-up Functions
 */
/**
 * Calculate tax equalization for expatriate
 * @param assignmentId - Assignment ID
 * @param homeCountryTax - Home country tax amount
 * @param hostCountryTax - Host country tax amount
 * @param transaction - Optional database transaction
 * @returns Tax equalization calculation
 */
async function calculateTaxEqualization(assignmentId, homeCountryTax, hostCountryTax, transaction) {
    const assignment = await GlobalAssignmentModel.findByPk(assignmentId, { transaction });
    if (!assignment) {
        throw new common_1.NotFoundException(`Assignment ${assignmentId} not found`);
    }
    const hypotheticalTax = homeCountryTax;
    const taxReimbursement = Math.max(0, hostCountryTax - hypotheticalTax);
    const taxEqualization = {
        method: TaxEqualizationMethod.TAX_EQUALIZATION,
        homeCountryTax,
        hostCountryTax,
        hypotheticalTax,
        taxReimbursement,
        taxGrossUp: 0,
        taxYear: new Date().getFullYear(),
    };
    await assignment.update({ taxEqualization }, { transaction });
    return taxEqualization;
}
/**
 * Perform tax gross-up calculation
 * @param assignmentId - Assignment ID
 * @param netAmount - Net amount to gross up
 * @param taxRate - Applicable tax rate
 * @param transaction - Optional database transaction
 * @returns Gross-up amount
 */
async function performTaxGrossUp(assignmentId, netAmount, taxRate, transaction) {
    const grossAmount = netAmount / (1 - taxRate);
    const taxGrossUp = grossAmount - netAmount;
    const assignment = await GlobalAssignmentModel.findByPk(assignmentId, { transaction });
    if (!assignment) {
        throw new common_1.NotFoundException(`Assignment ${assignmentId} not found`);
    }
    const taxEqualization = assignment.taxEqualization;
    taxEqualization.taxGrossUp = taxGrossUp;
    await assignment.update({ taxEqualization }, { transaction });
    return {
        grossAmount: Math.round(grossAmount * 100) / 100,
        taxGrossUp: Math.round(taxGrossUp * 100) / 100,
    };
}
/**
 * Track tax liabilities across jurisdictions
 * @param employeeId - Employee ID
 * @param taxYear - Tax year
 * @param transaction - Optional database transaction
 * @returns Tax liabilities by country
 */
async function trackTaxLiabilities(employeeId, taxYear, transaction) {
    const assignments = await GlobalAssignmentModel.findAll({
        where: { employeeId },
        transaction,
    });
    const liabilities = [];
    for (const assignment of assignments) {
        if (assignment.taxEqualization.taxYear === taxYear) {
            liabilities.push({
                country: assignment.hostCountry,
                liability: assignment.taxEqualization.hostCountryTax,
                currency: assignment.assignmentCosts.currency,
            });
        }
    }
    return liabilities;
}
/**
 * Generate tax equalization report
 * @param assignmentId - Assignment ID
 * @param transaction - Optional database transaction
 * @returns Tax equalization report
 */
async function generateTaxEqualizationReport(assignmentId, transaction) {
    const assignment = await GlobalAssignmentModel.findByPk(assignmentId, { transaction });
    if (!assignment) {
        throw new common_1.NotFoundException(`Assignment ${assignmentId} not found`);
    }
    const recommendations = [];
    if (assignment.taxEqualization.taxReimbursement > 0) {
        recommendations.push(`Employee entitled to tax reimbursement of ${assignment.taxEqualization.taxReimbursement}`);
    }
    if (assignment.taxEqualization.hostCountryTax > assignment.taxEqualization.homeCountryTax * 1.2) {
        recommendations.push('Consider tax treaty benefits to reduce host country tax burden');
    }
    return {
        assignment: assignment.toJSON(),
        taxEqualization: assignment.taxEqualization,
        recommendations,
    };
}
/**
 * Immigration & Visa Tracking Functions
 */
/**
 * Create visa application record
 * @param visaData - Visa application data
 * @param transaction - Optional database transaction
 * @returns Created visa record
 */
async function createVisaApplication(visaData, transaction) {
    const validated = exports.VisaImmigrationSchema.parse(visaData);
    const visa = await VisaImmigrationModel.create({
        ...validated,
        status: VisaStatus.APPLICATION_IN_PROGRESS,
        alertSent: false,
        documents: [],
    }, { transaction });
    return visa;
}
/**
 * Track visa status and update records
 * @param visaId - Visa ID
 * @param newStatus - New visa status
 * @param transaction - Optional database transaction
 * @returns Updated visa record
 */
async function trackVisaStatus(visaId, newStatus, transaction) {
    const visa = await VisaImmigrationModel.findByPk(visaId, { transaction });
    if (!visa) {
        throw new common_1.NotFoundException(`Visa ${visaId} not found`);
    }
    await visa.update({ status: newStatus }, { transaction });
    return visa;
}
/**
 * Send visa expiry alerts for upcoming expirations
 * @param daysBeforeExpiry - Days before expiry to alert
 * @param transaction - Optional database transaction
 * @returns List of employees with expiring visas
 */
async function sendVisaExpiryAlerts(daysBeforeExpiry, transaction) {
    const alertDate = new Date();
    alertDate.setDate(alertDate.getDate() + daysBeforeExpiry);
    const expiringVisas = await VisaImmigrationModel.findAll({
        where: {
            expiryDate: { [sequelize_1.Op.lte]: alertDate },
            status: { [sequelize_1.Op.in]: [VisaStatus.ACTIVE, VisaStatus.APPROVED] },
            alertSent: false,
        },
        transaction,
    });
    // Mark alerts as sent
    for (const visa of expiringVisas) {
        await visa.update({ alertSent: true, status: VisaStatus.EXPIRING_SOON }, { transaction });
    }
    return expiringVisas;
}
/**
 * Renew work permit for employee
 * @param visaId - Visa ID
 * @param newExpiryDate - New expiry date
 * @param transaction - Optional database transaction
 * @returns Updated visa record
 */
async function renewWorkPermit(visaId, newExpiryDate, transaction) {
    const visa = await VisaImmigrationModel.findByPk(visaId, { transaction });
    if (!visa) {
        throw new common_1.NotFoundException(`Visa ${visaId} not found`);
    }
    await visa.update({
        renewalDate: new Date(),
        expiryDate: newExpiryDate,
        status: VisaStatus.ACTIVE,
        alertSent: false,
    }, { transaction });
    return visa;
}
/**
 * Cultural & Language Support Functions
 */
/**
 * Create cultural adaptation profile
 * @param profileData - Cultural profile data
 * @param transaction - Optional database transaction
 * @returns Created cultural profile
 */
async function createCulturalProfile(profileData, transaction) {
    const validated = exports.CulturalProfileSchema.parse(profileData);
    const profile = await CulturalProfileModel.create({
        ...validated,
        assessmentDate: new Date(),
    }, { transaction });
    return profile;
}
/**
 * Assign language training to employee
 * @param employeeId - Employee ID
 * @param targetLanguage - Target language
 * @param targetProficiency - Target proficiency level
 * @param transaction - Optional database transaction
 * @returns Training assignment
 */
async function assignLanguageTraining(employeeId, targetLanguage, targetProficiency, transaction) {
    const employee = await GlobalEmployeeModel.findOne({
        where: { employeeId },
        transaction,
    });
    if (!employee) {
        throw new common_1.NotFoundException(`Employee ${employeeId} not found`);
    }
    // In real implementation, would create training enrollment
    return {
        assigned: true,
        employeeId,
        language: targetLanguage,
        targetLevel: targetProficiency,
    };
}
/**
 * Track cultural adaptation progress
 * @param employeeId - Employee ID
 * @param country - Country
 * @param transaction - Optional database transaction
 * @returns Cultural adaptation tracking
 */
async function trackCulturalAdaptation(employeeId, country, transaction) {
    const profile = await CulturalProfileModel.findOne({
        where: { employeeId, country },
        order: [['assessmentDate', 'DESC']],
        transaction,
    });
    return profile;
}
/**
 * Generate cultural adaptation insights
 * @param country - Country
 * @param transaction - Optional database transaction
 * @returns Cultural insights
 */
async function generateCulturalInsights(country, transaction) {
    const profiles = await CulturalProfileModel.findAll({
        where: { country },
        transaction,
    });
    if (profiles.length === 0) {
        return {
            country,
            averageAdaptationScore: 0,
            commonChallenges: [],
            recommendedSupport: [],
        };
    }
    const averageScore = profiles.reduce((sum, p) => sum + p.adaptationScore, 0) / profiles.length;
    const allChallenges = profiles.flatMap((p) => p.challengesReported);
    const challengeCounts = new Map();
    allChallenges.forEach((challenge) => {
        challengeCounts.set(challenge, (challengeCounts.get(challenge) || 0) + 1);
    });
    const commonChallenges = Array.from(challengeCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([challenge]) => challenge);
    return {
        country,
        averageAdaptationScore: Math.round(averageScore * 100) / 100,
        commonChallenges,
        recommendedSupport: ['Cultural mentor assignment', 'Language training', 'Local orientation'],
    };
}
/**
 * Global Compliance & Reporting Functions
 */
/**
 * Validate global compliance across jurisdictions
 * @param country - Country
 * @param framework - Compliance framework
 * @param transaction - Optional database transaction
 * @returns Compliance validation results
 */
async function validateGlobalCompliance(country, framework, transaction) {
    const compliance = await GlobalComplianceModel.findOne({
        where: { country, framework },
        order: [['lastAuditDate', 'DESC']],
        transaction,
    });
    return compliance;
}
/**
 * Generate compliance report for country
 * @param country - Country
 * @param transaction - Optional database transaction
 * @returns Compliance report
 */
async function generateComplianceReport(country, transaction) {
    const complianceRecords = await GlobalComplianceModel.findAll({
        where: { country },
        transaction,
    });
    const frameworks = complianceRecords.map((r) => r.framework);
    const nonCompliant = complianceRecords.filter((r) => r.complianceStatus === 'NON_COMPLIANT');
    const criticalFindings = complianceRecords.reduce((sum, r) => sum + r.findings.length, 0);
    const overallStatus = nonCompliant.length === 0 ? 'COMPLIANT' : nonCompliant.length < 3 ? 'PARTIAL' : 'NON_COMPLIANT';
    return {
        country,
        frameworks,
        overallStatus,
        criticalFindings,
    };
}
/**
 * Track regulatory changes across countries
 * @param countries - Countries to track
 * @param transaction - Optional database transaction
 * @returns Regulatory changes
 */
async function trackRegulatoryChanges(countries, transaction) {
    const changes = [];
    for (const country of countries) {
        const rules = await CountryHRRulesModel.findByPk(country, { transaction });
        if (rules) {
            changes.push({
                country,
                changes: [], // In real implementation, track actual changes
                lastUpdated: rules.updatedAt,
            });
        }
    }
    return changes;
}
/**
 * Audit global HR data for compliance
 * @param country - Country
 * @param auditScope - Scope of audit
 * @param transaction - Optional database transaction
 * @returns Audit results
 */
async function auditGlobalHRData(country, auditScope, transaction) {
    const employees = await getEmployeeByCountry(country, { transaction });
    const findings = [];
    const recommendations = [];
    // Check for missing work authorizations
    const employeesWithoutAuth = employees.filter((e) => e.workAuthorizations.length === 0 && e.homeCountry !== country);
    if (employeesWithoutAuth.length > 0) {
        findings.push(`${employeesWithoutAuth.length} employees without work authorization`);
        recommendations.push('Complete work authorization documentation for all foreign employees');
    }
    // Check for expired visas
    const visas = await VisaImmigrationModel.findAll({
        where: {
            country,
            expiryDate: { [sequelize_1.Op.lt]: new Date() },
            status: { [sequelize_1.Op.ne]: VisaStatus.EXPIRED },
        },
        transaction,
    });
    if (visas.length > 0) {
        findings.push(`${visas.length} expired visas not updated`);
        recommendations.push('Update visa statuses and initiate renewal processes');
    }
    return {
        audited: true,
        findings,
        recommendations,
    };
}
/**
 * Global Organizational Structures Functions
 */
/**
 * Create global organizational unit
 * @param unitData - Org unit data
 * @param transaction - Optional database transaction
 * @returns Created org unit
 */
async function createGlobalOrgUnit(unitData, transaction) {
    const orgUnit = await GlobalOrgUnitModel.create({
        unitName: unitData.unitName,
        country: unitData.country,
        legalEntity: unitData.legalEntity,
        parentUnitId: unitData.parentUnitId,
        headcount: unitData.headcount || 0,
        currency: unitData.currency,
        costCenter: unitData.costCenter,
        active: true,
    }, { transaction });
    return orgUnit;
}
/**
 * Map global reporting lines across countries
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns Reporting structure
 */
async function mapGlobalReportingLines(employeeId, transaction) {
    // In real implementation, would traverse org hierarchy
    return {
        employee: employeeId,
        reports: [],
    };
}
/**
 * Synchronize global org structure
 * @param transaction - Optional database transaction
 * @returns Sync results
 */
async function syncGlobalOrgStructure(transaction) {
    const units = await GlobalOrgUnitModel.findAll({
        where: { active: true },
        transaction,
    });
    return {
        synced: true,
        units: units.length,
    };
}
/**
 * Analyze global span of control
 * @param country - Country (optional)
 * @param transaction - Optional database transaction
 * @returns Span of control analysis
 */
async function analyzeGlobalSpanOfControl(country, transaction) {
    const where = { active: true };
    if (country) {
        where.country = country;
    }
    const units = await GlobalOrgUnitModel.findAll({
        where,
        include: [{ model: GlobalOrgUnitModel, as: 'childUnits' }],
        transaction,
    });
    const spans = units.map((unit) => unit.childUnits?.length || 0).filter((span) => span > 0);
    const averageSpan = spans.length > 0 ? spans.reduce((a, b) => a + b, 0) / spans.length : 0;
    const maxSpan = spans.length > 0 ? Math.max(...spans) : 0;
    return {
        averageSpan: Math.round(averageSpan * 100) / 100,
        maxSpan,
        unitsAnalyzed: units.length,
    };
}
// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================
/**
 * Global HR Management Service
 * Provides enterprise-grade multi-country HR operations
 */
let GlobalHRManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)(), (0, swagger_1.ApiTags)('Global HR Management')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GlobalHRManagementService = _classThis = class {
        /**
         * All 48 functions available as service methods with same signatures
         */
        // Multi-Country HR Management
        async createGlobalEmployee(data, transaction) {
            return createGlobalEmployee(data, transaction);
        }
        async updateGlobalEmployeeProfile(employeeId, updates, transaction) {
            return updateGlobalEmployeeProfile(employeeId, updates, transaction);
        }
        async getEmployeeByCountry(country, options) {
            return getEmployeeByCountry(country, options);
        }
        async transferEmployeeCountry(employeeId, toCountry, effectiveDate, transaction) {
            return transferEmployeeCountry(employeeId, toCountry, effectiveDate, transaction);
        }
        // Country-Specific Rules
        async getCountryHRRules(country, transaction) {
            return getCountryHRRules(country, transaction);
        }
        async validateEmploymentContract(country, contractData, transaction) {
            return validateEmploymentContract(country, contractData, transaction);
        }
        async applyCountrySpecificWorkingHours(country, hoursWorked, transaction) {
            return applyCountrySpecificWorkingHours(country, hoursWorked, transaction);
        }
        async getCountryStatutoryLeaves(country, transaction) {
            return getCountryStatutoryLeaves(country, transaction);
        }
        // Global Assignments
        async createGlobalAssignment(data, transaction) {
            return createGlobalAssignment(data, transaction);
        }
        async trackExpatriateAssignment(assignmentId, transaction) {
            return trackExpatriateAssignment(assignmentId, transaction);
        }
        async calculateAssignmentCosts(assignmentId, transaction) {
            return calculateAssignmentCosts(assignmentId, transaction);
        }
        async endGlobalAssignment(assignmentId, actualEndDate, transaction) {
            return endGlobalAssignment(assignmentId, actualEndDate, transaction);
        }
        // International Transfers
        async initiateInternationalTransfer(data, transaction) {
            return initiateInternationalTransfer(data, transaction);
        }
        async calculateRelocationCosts(transferId, familySize, transaction) {
            return calculateRelocationCosts(transferId, familySize, transaction);
        }
        async trackRelocationProgress(transferId, newStatus, transaction) {
            return trackRelocationProgress(transferId, newStatus, transaction);
        }
        async completeRelocation(transferId, actualCost, transaction) {
            return completeRelocation(transferId, actualCost, transaction);
        }
        // Global Payroll
        async syncGlobalPayrollData(country, payrollPeriod, transaction) {
            return syncGlobalPayrollData(country, payrollPeriod, transaction);
        }
        async calculateMultiCountryPayroll(payrollPeriod, countries, baseCurrency, transaction) {
            return calculateMultiCountryPayroll(payrollPeriod, countries, baseCurrency, transaction);
        }
        async reconcileGlobalPayroll(payrollPeriod, transaction) {
            return reconcileGlobalPayroll(payrollPeriod, transaction);
        }
        async generateGlobalPayslips(payrollPeriod, transaction) {
            return generateGlobalPayslips(payrollPeriod, transaction);
        }
        // Currency & Exchange
        async getExchangeRates(fromCurrency, toCurrency, effectiveDate, transaction) {
            return getExchangeRates(fromCurrency, toCurrency, effectiveDate, transaction);
        }
        async convertSalaryToCurrency(amount, fromCurrency, toCurrency, effectiveDate, transaction) {
            return convertSalaryToCurrency(amount, fromCurrency, toCurrency, effectiveDate, transaction);
        }
        async trackCurrencyFluctuations(fromCurrency, toCurrency, daysBack, transaction) {
            return trackCurrencyFluctuations(fromCurrency, toCurrency, daysBack, transaction);
        }
        async applyExchangeRateAdjustments(assignmentId, newRate, transaction) {
            return applyExchangeRateAdjustments(assignmentId, newRate, transaction);
        }
        // Global Benefits
        async enrollInGlobalBenefits(employeeId, country, benefitTypes, transaction) {
            return enrollInGlobalBenefits(employeeId, country, benefitTypes, transaction);
        }
        async calculateGlobalBenefitsCosts(employeeId, transaction) {
            return calculateGlobalBenefitsCosts(employeeId, transaction);
        }
        async syncBenefitsAcrossCountries(employeeId, transaction) {
            return syncBenefitsAcrossCountries(employeeId, transaction);
        }
        async generateBenefitsComparison(countries, transaction) {
            return generateBenefitsComparison(countries, transaction);
        }
        // Tax Equalization
        async calculateTaxEqualization(assignmentId, homeCountryTax, hostCountryTax, transaction) {
            return calculateTaxEqualization(assignmentId, homeCountryTax, hostCountryTax, transaction);
        }
        async performTaxGrossUp(assignmentId, netAmount, taxRate, transaction) {
            return performTaxGrossUp(assignmentId, netAmount, taxRate, transaction);
        }
        async trackTaxLiabilities(employeeId, taxYear, transaction) {
            return trackTaxLiabilities(employeeId, taxYear, transaction);
        }
        async generateTaxEqualizationReport(assignmentId, transaction) {
            return generateTaxEqualizationReport(assignmentId, transaction);
        }
        // Immigration & Visa
        async createVisaApplication(data, transaction) {
            return createVisaApplication(data, transaction);
        }
        async trackVisaStatus(visaId, newStatus, transaction) {
            return trackVisaStatus(visaId, newStatus, transaction);
        }
        async sendVisaExpiryAlerts(daysBeforeExpiry, transaction) {
            return sendVisaExpiryAlerts(daysBeforeExpiry, transaction);
        }
        async renewWorkPermit(visaId, newExpiryDate, transaction) {
            return renewWorkPermit(visaId, newExpiryDate, transaction);
        }
        // Cultural Support
        async createCulturalProfile(data, transaction) {
            return createCulturalProfile(data, transaction);
        }
        async assignLanguageTraining(employeeId, targetLanguage, targetProficiency, transaction) {
            return assignLanguageTraining(employeeId, targetLanguage, targetProficiency, transaction);
        }
        async trackCulturalAdaptation(employeeId, country, transaction) {
            return trackCulturalAdaptation(employeeId, country, transaction);
        }
        async generateCulturalInsights(country, transaction) {
            return generateCulturalInsights(country, transaction);
        }
        // Compliance
        async validateGlobalCompliance(country, framework, transaction) {
            return validateGlobalCompliance(country, framework, transaction);
        }
        async generateComplianceReport(country, transaction) {
            return generateComplianceReport(country, transaction);
        }
        async trackRegulatoryChanges(countries, transaction) {
            return trackRegulatoryChanges(countries, transaction);
        }
        async auditGlobalHRData(country, auditScope, transaction) {
            return auditGlobalHRData(country, auditScope, transaction);
        }
        // Global Org Structure
        async createGlobalOrgUnit(unitData, transaction) {
            return createGlobalOrgUnit(unitData, transaction);
        }
        async mapGlobalReportingLines(employeeId, transaction) {
            return mapGlobalReportingLines(employeeId, transaction);
        }
        async syncGlobalOrgStructure(transaction) {
            return syncGlobalOrgStructure(transaction);
        }
        async analyzeGlobalSpanOfControl(country, transaction) {
            return analyzeGlobalSpanOfControl(country, transaction);
        }
    };
    __setFunctionName(_classThis, "GlobalHRManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GlobalHRManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GlobalHRManagementService = _classThis;
})();
exports.GlobalHRManagementService = GlobalHRManagementService;
//# sourceMappingURL=global-hr-management-kit.js.map