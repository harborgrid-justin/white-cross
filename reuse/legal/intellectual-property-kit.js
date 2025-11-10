"use strict";
/**
 * LOC: IP_MGMT_KIT_001
 * File: /reuse/legal/intellectual-property-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - axios
 *   - node-cron
 *
 * DOWNSTREAM (imported by):
 *   - Legal management modules
 *   - IP portfolio controllers
 *   - Patent search services
 *   - Trademark monitoring services
 *   - Copyright management services
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPManagementServices = exports.IPManagementModels = exports.IPManagementModule = exports.IPStrategyService = exports.IPInfringementService = exports.IPLicensingService = exports.IPActionService = exports.IPPortfolioService = exports.CopyrightService = exports.TrademarkService = exports.PriorArtSearchService = exports.PatentService = exports.ipManagementConfig = exports.IPAction = exports.IPPortfolio = exports.PriorArtSearch = exports.Copyright = exports.Trademark = exports.Patent = exports.IPPortfolioSchema = exports.PriorArtSearchSchema = exports.CopyrightSchema = exports.TrademarkSchema = exports.PatentSchema = exports.IPActionType = exports.IPJurisdiction = exports.CopyrightStatus = exports.CopyrightType = exports.TrademarkStatus = exports.TrademarkType = exports.PatentStatus = exports.PatentType = exports.IPAssetType = void 0;
/**
 * File: /reuse/legal/intellectual-property-kit.ts
 * Locator: WC-IP-MGMT-KIT-001
 * Purpose: Production-Grade Intellectual Property Management Kit - Enterprise IP lifecycle management toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, Node-Cron, Axios
 * Downstream: ../backend/modules/legal/*, IP portfolio controllers, Patent services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 40 production-ready IP management functions for legal platforms
 *
 * LLM Context: Production-grade intellectual property lifecycle management toolkit for White Cross platform.
 * Provides comprehensive patent search with USPTO/EPO integration, trademark monitoring with conflict detection,
 * copyright management with registration tracking, IP portfolio tracking with valuation analytics, prior art
 * search with AI-powered similarity detection, patent filing workflow management, trademark application
 * processing, copyright registration automation, IP licensing agreement management, IP infringement detection,
 * patent renewal deadline tracking, trademark renewal monitoring, IP assignment and transfer management,
 * IP valuation and analytics, trade secret protection tracking, IP litigation support, IP due diligence
 * reporting, inventor/creator management, IP classification (IPC/NICE), IP family tree tracking, patent
 * citation analysis, trademark image search, copyright fair use assessment, IP portfolio optimization,
 * freedom-to-operate analysis, IP competitive intelligence, patent landscape analysis, trademark watching
 * services, IP financial reporting, IP risk assessment, international IP filing (PCT/Madrid), IP maintenance
 * fee management, IP documentation management, IP strategic planning, IP audit trails, IP collaboration
 * tools, IP document generation, and healthcare/pharma-specific IP management (drug patents, medical device
 * patents, clinical trial IP).
 */
const crypto = __importStar(require("crypto"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * IP asset types
 */
var IPAssetType;
(function (IPAssetType) {
    IPAssetType["PATENT"] = "patent";
    IPAssetType["TRADEMARK"] = "trademark";
    IPAssetType["COPYRIGHT"] = "copyright";
    IPAssetType["TRADE_SECRET"] = "trade_secret";
    IPAssetType["DESIGN"] = "design";
    IPAssetType["DOMAIN_NAME"] = "domain_name";
    IPAssetType["INDUSTRIAL_DESIGN"] = "industrial_design";
    IPAssetType["PLANT_VARIETY"] = "plant_variety";
    IPAssetType["GEOGRAPHICAL_INDICATION"] = "geographical_indication";
})(IPAssetType || (exports.IPAssetType = IPAssetType = {}));
/**
 * Patent types
 */
var PatentType;
(function (PatentType) {
    PatentType["UTILITY"] = "utility";
    PatentType["DESIGN"] = "design";
    PatentType["PLANT"] = "plant";
    PatentType["PROVISIONAL"] = "provisional";
    PatentType["CONTINUATION"] = "continuation";
    PatentType["DIVISIONAL"] = "divisional";
    PatentType["REISSUE"] = "reissue";
    PatentType["PCT"] = "pct";
})(PatentType || (exports.PatentType = PatentType = {}));
/**
 * Patent status lifecycle
 */
var PatentStatus;
(function (PatentStatus) {
    PatentStatus["IDEA"] = "idea";
    PatentStatus["PRIOR_ART_SEARCH"] = "prior_art_search";
    PatentStatus["DRAFTING"] = "drafting";
    PatentStatus["FILED"] = "filed";
    PatentStatus["PENDING"] = "pending";
    PatentStatus["PUBLISHED"] = "published";
    PatentStatus["EXAMINATION"] = "examination";
    PatentStatus["OFFICE_ACTION"] = "office_action";
    PatentStatus["ALLOWED"] = "allowed";
    PatentStatus["GRANTED"] = "granted";
    PatentStatus["ACTIVE"] = "active";
    PatentStatus["EXPIRED"] = "expired";
    PatentStatus["ABANDONED"] = "abandoned";
    PatentStatus["REJECTED"] = "rejected";
    PatentStatus["REVOKED"] = "revoked";
})(PatentStatus || (exports.PatentStatus = PatentStatus = {}));
/**
 * Trademark types
 */
var TrademarkType;
(function (TrademarkType) {
    TrademarkType["WORD_MARK"] = "word_mark";
    TrademarkType["LOGO"] = "logo";
    TrademarkType["COMPOSITE"] = "composite";
    TrademarkType["SOUND_MARK"] = "sound_mark";
    TrademarkType["COLOR_MARK"] = "color_mark";
    TrademarkType["THREE_D_MARK"] = "three_d_mark";
    TrademarkType["MOTION_MARK"] = "motion_mark";
    TrademarkType["HOLOGRAM"] = "hologram";
    TrademarkType["SERVICE_MARK"] = "service_mark";
})(TrademarkType || (exports.TrademarkType = TrademarkType = {}));
/**
 * Trademark status
 */
var TrademarkStatus;
(function (TrademarkStatus) {
    TrademarkStatus["SEARCH"] = "search";
    TrademarkStatus["APPLICATION_PREP"] = "application_prep";
    TrademarkStatus["FILED"] = "filed";
    TrademarkStatus["PENDING"] = "pending";
    TrademarkStatus["PUBLISHED"] = "published";
    TrademarkStatus["OPPOSED"] = "opposed";
    TrademarkStatus["REGISTERED"] = "registered";
    TrademarkStatus["ACTIVE"] = "active";
    TrademarkStatus["RENEWED"] = "renewed";
    TrademarkStatus["EXPIRED"] = "expired";
    TrademarkStatus["CANCELLED"] = "cancelled";
    TrademarkStatus["ABANDONED"] = "abandoned";
})(TrademarkStatus || (exports.TrademarkStatus = TrademarkStatus = {}));
/**
 * Copyright types
 */
var CopyrightType;
(function (CopyrightType) {
    CopyrightType["LITERARY"] = "literary";
    CopyrightType["MUSICAL"] = "musical";
    CopyrightType["DRAMATIC"] = "dramatic";
    CopyrightType["CHOREOGRAPHIC"] = "choreographic";
    CopyrightType["PICTORIAL"] = "pictorial";
    CopyrightType["GRAPHIC"] = "graphic";
    CopyrightType["SCULPTURAL"] = "sculptural";
    CopyrightType["AUDIOVISUAL"] = "audiovisual";
    CopyrightType["SOUND_RECORDING"] = "sound_recording";
    CopyrightType["ARCHITECTURAL"] = "architectural";
    CopyrightType["SOFTWARE"] = "software";
    CopyrightType["DATABASE"] = "database";
})(CopyrightType || (exports.CopyrightType = CopyrightType = {}));
/**
 * Copyright status
 */
var CopyrightStatus;
(function (CopyrightStatus) {
    CopyrightStatus["CREATED"] = "created";
    CopyrightStatus["REGISTRATION_PENDING"] = "registration_pending";
    CopyrightStatus["REGISTERED"] = "registered";
    CopyrightStatus["ACTIVE"] = "active";
    CopyrightStatus["PUBLIC_DOMAIN"] = "public_domain";
    CopyrightStatus["EXPIRED"] = "expired";
    CopyrightStatus["TRANSFERRED"] = "transferred";
})(CopyrightStatus || (exports.CopyrightStatus = CopyrightStatus = {}));
/**
 * IP jurisdiction
 */
var IPJurisdiction;
(function (IPJurisdiction) {
    IPJurisdiction["US"] = "us";
    IPJurisdiction["EP"] = "ep";
    IPJurisdiction["JP"] = "jp";
    IPJurisdiction["CN"] = "cn";
    IPJurisdiction["GB"] = "gb";
    IPJurisdiction["CA"] = "ca";
    IPJurisdiction["AU"] = "au";
    IPJurisdiction["IN"] = "in";
    IPJurisdiction["BR"] = "br";
    IPJurisdiction["KR"] = "kr";
    IPJurisdiction["PCT"] = "pct";
    IPJurisdiction["MADRID"] = "madrid";
    IPJurisdiction["INTERNATIONAL"] = "international";
})(IPJurisdiction || (exports.IPJurisdiction = IPJurisdiction = {}));
/**
 * IP action types for tracking
 */
var IPActionType;
(function (IPActionType) {
    IPActionType["FILING"] = "filing";
    IPActionType["EXAMINATION"] = "examination";
    IPActionType["OFFICE_ACTION"] = "office_action";
    IPActionType["RESPONSE"] = "response";
    IPActionType["AMENDMENT"] = "amendment";
    IPActionType["PAYMENT"] = "payment";
    IPActionType["RENEWAL"] = "renewal";
    IPActionType["ASSIGNMENT"] = "assignment";
    IPActionType["LICENSE"] = "license";
    IPActionType["LITIGATION"] = "litigation";
    IPActionType["OPPOSITION"] = "opposition";
    IPActionType["MAINTENANCE"] = "maintenance";
})(IPActionType || (exports.IPActionType = IPActionType = {}));
// ============================================================================
// ZOD SCHEMAS
// ============================================================================
exports.PatentSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    patentNumber: zod_1.z.string().optional(),
    applicationNumber: zod_1.z.string().optional(),
    title: zod_1.z.string().min(1).max(500),
    patentType: zod_1.z.nativeEnum(PatentType),
    status: zod_1.z.nativeEnum(PatentStatus),
    jurisdiction: zod_1.z.nativeEnum(IPJurisdiction),
    filingDate: zod_1.z.coerce.date().optional(),
    publicationDate: zod_1.z.coerce.date().optional(),
    grantDate: zod_1.z.coerce.date().optional(),
    expirationDate: zod_1.z.coerce.date().optional(),
    abstract: zod_1.z.string().optional(),
    claims: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    inventors: zod_1.z.array(zod_1.z.string()),
    assignee: zod_1.z.string().optional(),
    ipcClassifications: zod_1.z.array(zod_1.z.string()).optional(),
    priorityDate: zod_1.z.coerce.date().optional(),
    familyId: zod_1.z.string().optional(),
    estimatedValue: zod_1.z.number().optional(),
    maintenanceFees: zod_1.z.any().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.TrademarkSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    registrationNumber: zod_1.z.string().optional(),
    applicationNumber: zod_1.z.string().optional(),
    markText: zod_1.z.string().optional(),
    trademarkType: zod_1.z.nativeEnum(TrademarkType),
    status: zod_1.z.nativeEnum(TrademarkStatus),
    jurisdiction: zod_1.z.nativeEnum(IPJurisdiction),
    filingDate: zod_1.z.coerce.date().optional(),
    registrationDate: zod_1.z.coerce.date().optional(),
    renewalDate: zod_1.z.coerce.date().optional(),
    expirationDate: zod_1.z.coerce.date().optional(),
    niceClasses: zod_1.z.array(zod_1.z.number()).optional(),
    goodsServices: zod_1.z.string().optional(),
    owner: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().url().optional(),
    disclaimer: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.CopyrightSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    registrationNumber: zod_1.z.string().optional(),
    title: zod_1.z.string().min(1).max(500),
    copyrightType: zod_1.z.nativeEnum(CopyrightType),
    status: zod_1.z.nativeEnum(CopyrightStatus),
    jurisdiction: zod_1.z.nativeEnum(IPJurisdiction),
    creationDate: zod_1.z.coerce.date().optional(),
    publicationDate: zod_1.z.coerce.date().optional(),
    registrationDate: zod_1.z.coerce.date().optional(),
    authors: zod_1.z.array(zod_1.z.string()),
    owner: zod_1.z.string().optional(),
    workDescription: zod_1.z.string().optional(),
    isWorkForHire: zod_1.z.boolean().default(false),
    derivative: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.PriorArtSearchSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    patentId: zod_1.z.string().uuid().optional(),
    searchQuery: zod_1.z.string().min(1),
    searchDate: zod_1.z.coerce.date(),
    databases: zod_1.z.array(zod_1.z.string()),
    keywords: zod_1.z.array(zod_1.z.string()).optional(),
    classifications: zod_1.z.array(zod_1.z.string()).optional(),
    results: zod_1.z.array(zod_1.z.any()).optional(),
    relevanceScores: zod_1.z.record(zod_1.z.number()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.IPPortfolioSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    name: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().optional(),
    ownerId: zod_1.z.string().uuid(),
    patents: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    trademarks: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    copyrights: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    totalValue: zod_1.z.number().optional(),
    lastValuationDate: zod_1.z.coerce.date().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Patent database model
 */
let Patent = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'patents',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['patentNumber'] },
                { fields: ['applicationNumber'] },
                { fields: ['status'] },
                { fields: ['jurisdiction'] },
                { fields: ['filingDate'] },
                { fields: ['expirationDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _patentNumber_decorators;
    let _patentNumber_initializers = [];
    let _patentNumber_extraInitializers = [];
    let _applicationNumber_decorators;
    let _applicationNumber_initializers = [];
    let _applicationNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _patentType_decorators;
    let _patentType_initializers = [];
    let _patentType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _jurisdiction_decorators;
    let _jurisdiction_initializers = [];
    let _jurisdiction_extraInitializers = [];
    let _filingDate_decorators;
    let _filingDate_initializers = [];
    let _filingDate_extraInitializers = [];
    let _publicationDate_decorators;
    let _publicationDate_initializers = [];
    let _publicationDate_extraInitializers = [];
    let _grantDate_decorators;
    let _grantDate_initializers = [];
    let _grantDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _abstract_decorators;
    let _abstract_initializers = [];
    let _abstract_extraInitializers = [];
    let _claims_decorators;
    let _claims_initializers = [];
    let _claims_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _inventors_decorators;
    let _inventors_initializers = [];
    let _inventors_extraInitializers = [];
    let _assignee_decorators;
    let _assignee_initializers = [];
    let _assignee_extraInitializers = [];
    let _ipcClassifications_decorators;
    let _ipcClassifications_initializers = [];
    let _ipcClassifications_extraInitializers = [];
    let _priorityDate_decorators;
    let _priorityDate_initializers = [];
    let _priorityDate_extraInitializers = [];
    let _familyId_decorators;
    let _familyId_initializers = [];
    let _familyId_extraInitializers = [];
    let _estimatedValue_decorators;
    let _estimatedValue_initializers = [];
    let _estimatedValue_extraInitializers = [];
    let _maintenanceFees_decorators;
    let _maintenanceFees_initializers = [];
    let _maintenanceFees_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _priorArtSearches_decorators;
    let _priorArtSearches_initializers = [];
    let _priorArtSearches_extraInitializers = [];
    let _actions_decorators;
    let _actions_initializers = [];
    let _actions_extraInitializers = [];
    var Patent = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.patentNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _patentNumber_initializers, void 0));
            this.applicationNumber = (__runInitializers(this, _patentNumber_extraInitializers), __runInitializers(this, _applicationNumber_initializers, void 0));
            this.title = (__runInitializers(this, _applicationNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.patentType = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _patentType_initializers, void 0));
            this.status = (__runInitializers(this, _patentType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.jurisdiction = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _jurisdiction_initializers, void 0));
            this.filingDate = (__runInitializers(this, _jurisdiction_extraInitializers), __runInitializers(this, _filingDate_initializers, void 0));
            this.publicationDate = (__runInitializers(this, _filingDate_extraInitializers), __runInitializers(this, _publicationDate_initializers, void 0));
            this.grantDate = (__runInitializers(this, _publicationDate_extraInitializers), __runInitializers(this, _grantDate_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _grantDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.abstract = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _abstract_initializers, void 0));
            this.claims = (__runInitializers(this, _abstract_extraInitializers), __runInitializers(this, _claims_initializers, void 0));
            this.description = (__runInitializers(this, _claims_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.inventors = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _inventors_initializers, void 0));
            this.assignee = (__runInitializers(this, _inventors_extraInitializers), __runInitializers(this, _assignee_initializers, void 0));
            this.ipcClassifications = (__runInitializers(this, _assignee_extraInitializers), __runInitializers(this, _ipcClassifications_initializers, void 0));
            this.priorityDate = (__runInitializers(this, _ipcClassifications_extraInitializers), __runInitializers(this, _priorityDate_initializers, void 0));
            this.familyId = (__runInitializers(this, _priorityDate_extraInitializers), __runInitializers(this, _familyId_initializers, void 0));
            this.estimatedValue = (__runInitializers(this, _familyId_extraInitializers), __runInitializers(this, _estimatedValue_initializers, void 0));
            this.maintenanceFees = (__runInitializers(this, _estimatedValue_extraInitializers), __runInitializers(this, _maintenanceFees_initializers, void 0));
            this.metadata = (__runInitializers(this, _maintenanceFees_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.priorArtSearches = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _priorArtSearches_initializers, void 0));
            this.actions = (__runInitializers(this, _priorArtSearches_extraInitializers), __runInitializers(this, _actions_initializers, void 0));
            __runInitializers(this, _actions_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Patent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Patent unique identifier' }), sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _patentNumber_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Issued patent number' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _applicationNumber_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Patent application number' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Patent title' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500))];
        _patentType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Patent type', enum: PatentType }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(PatentType)))];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Patent status', enum: PatentStatus }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(PatentStatus)))];
        _jurisdiction_decorators = [(0, swagger_1.ApiProperty)({ description: 'Patent jurisdiction', enum: IPJurisdiction }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(IPJurisdiction)))];
        _filingDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filing date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _publicationDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Publication date' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _grantDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Grant date' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _expirationDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Expiration date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _abstract_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Patent abstract' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _claims_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Patent claims' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Patent description' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _inventors_decorators = [(0, swagger_1.ApiProperty)({ description: 'List of inventors', type: [String] }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _assignee_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Assignee/owner' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _ipcClassifications_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'IPC classifications', type: [String] }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _priorityDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Priority date' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _familyId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Patent family ID' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _estimatedValue_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Estimated patent value' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _maintenanceFees_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Maintenance fees data' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _priorArtSearches_decorators = [(0, sequelize_typescript_1.HasMany)(() => PriorArtSearch)];
        _actions_decorators = [(0, sequelize_typescript_1.HasMany)(() => IPAction)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _patentNumber_decorators, { kind: "field", name: "patentNumber", static: false, private: false, access: { has: obj => "patentNumber" in obj, get: obj => obj.patentNumber, set: (obj, value) => { obj.patentNumber = value; } }, metadata: _metadata }, _patentNumber_initializers, _patentNumber_extraInitializers);
        __esDecorate(null, null, _applicationNumber_decorators, { kind: "field", name: "applicationNumber", static: false, private: false, access: { has: obj => "applicationNumber" in obj, get: obj => obj.applicationNumber, set: (obj, value) => { obj.applicationNumber = value; } }, metadata: _metadata }, _applicationNumber_initializers, _applicationNumber_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _patentType_decorators, { kind: "field", name: "patentType", static: false, private: false, access: { has: obj => "patentType" in obj, get: obj => obj.patentType, set: (obj, value) => { obj.patentType = value; } }, metadata: _metadata }, _patentType_initializers, _patentType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _jurisdiction_decorators, { kind: "field", name: "jurisdiction", static: false, private: false, access: { has: obj => "jurisdiction" in obj, get: obj => obj.jurisdiction, set: (obj, value) => { obj.jurisdiction = value; } }, metadata: _metadata }, _jurisdiction_initializers, _jurisdiction_extraInitializers);
        __esDecorate(null, null, _filingDate_decorators, { kind: "field", name: "filingDate", static: false, private: false, access: { has: obj => "filingDate" in obj, get: obj => obj.filingDate, set: (obj, value) => { obj.filingDate = value; } }, metadata: _metadata }, _filingDate_initializers, _filingDate_extraInitializers);
        __esDecorate(null, null, _publicationDate_decorators, { kind: "field", name: "publicationDate", static: false, private: false, access: { has: obj => "publicationDate" in obj, get: obj => obj.publicationDate, set: (obj, value) => { obj.publicationDate = value; } }, metadata: _metadata }, _publicationDate_initializers, _publicationDate_extraInitializers);
        __esDecorate(null, null, _grantDate_decorators, { kind: "field", name: "grantDate", static: false, private: false, access: { has: obj => "grantDate" in obj, get: obj => obj.grantDate, set: (obj, value) => { obj.grantDate = value; } }, metadata: _metadata }, _grantDate_initializers, _grantDate_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _abstract_decorators, { kind: "field", name: "abstract", static: false, private: false, access: { has: obj => "abstract" in obj, get: obj => obj.abstract, set: (obj, value) => { obj.abstract = value; } }, metadata: _metadata }, _abstract_initializers, _abstract_extraInitializers);
        __esDecorate(null, null, _claims_decorators, { kind: "field", name: "claims", static: false, private: false, access: { has: obj => "claims" in obj, get: obj => obj.claims, set: (obj, value) => { obj.claims = value; } }, metadata: _metadata }, _claims_initializers, _claims_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _inventors_decorators, { kind: "field", name: "inventors", static: false, private: false, access: { has: obj => "inventors" in obj, get: obj => obj.inventors, set: (obj, value) => { obj.inventors = value; } }, metadata: _metadata }, _inventors_initializers, _inventors_extraInitializers);
        __esDecorate(null, null, _assignee_decorators, { kind: "field", name: "assignee", static: false, private: false, access: { has: obj => "assignee" in obj, get: obj => obj.assignee, set: (obj, value) => { obj.assignee = value; } }, metadata: _metadata }, _assignee_initializers, _assignee_extraInitializers);
        __esDecorate(null, null, _ipcClassifications_decorators, { kind: "field", name: "ipcClassifications", static: false, private: false, access: { has: obj => "ipcClassifications" in obj, get: obj => obj.ipcClassifications, set: (obj, value) => { obj.ipcClassifications = value; } }, metadata: _metadata }, _ipcClassifications_initializers, _ipcClassifications_extraInitializers);
        __esDecorate(null, null, _priorityDate_decorators, { kind: "field", name: "priorityDate", static: false, private: false, access: { has: obj => "priorityDate" in obj, get: obj => obj.priorityDate, set: (obj, value) => { obj.priorityDate = value; } }, metadata: _metadata }, _priorityDate_initializers, _priorityDate_extraInitializers);
        __esDecorate(null, null, _familyId_decorators, { kind: "field", name: "familyId", static: false, private: false, access: { has: obj => "familyId" in obj, get: obj => obj.familyId, set: (obj, value) => { obj.familyId = value; } }, metadata: _metadata }, _familyId_initializers, _familyId_extraInitializers);
        __esDecorate(null, null, _estimatedValue_decorators, { kind: "field", name: "estimatedValue", static: false, private: false, access: { has: obj => "estimatedValue" in obj, get: obj => obj.estimatedValue, set: (obj, value) => { obj.estimatedValue = value; } }, metadata: _metadata }, _estimatedValue_initializers, _estimatedValue_extraInitializers);
        __esDecorate(null, null, _maintenanceFees_decorators, { kind: "field", name: "maintenanceFees", static: false, private: false, access: { has: obj => "maintenanceFees" in obj, get: obj => obj.maintenanceFees, set: (obj, value) => { obj.maintenanceFees = value; } }, metadata: _metadata }, _maintenanceFees_initializers, _maintenanceFees_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _priorArtSearches_decorators, { kind: "field", name: "priorArtSearches", static: false, private: false, access: { has: obj => "priorArtSearches" in obj, get: obj => obj.priorArtSearches, set: (obj, value) => { obj.priorArtSearches = value; } }, metadata: _metadata }, _priorArtSearches_initializers, _priorArtSearches_extraInitializers);
        __esDecorate(null, null, _actions_decorators, { kind: "field", name: "actions", static: false, private: false, access: { has: obj => "actions" in obj, get: obj => obj.actions, set: (obj, value) => { obj.actions = value; } }, metadata: _metadata }, _actions_initializers, _actions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Patent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Patent = _classThis;
})();
exports.Patent = Patent;
/**
 * Trademark database model
 */
let Trademark = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'trademarks',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['registrationNumber'] },
                { fields: ['applicationNumber'] },
                { fields: ['status'] },
                { fields: ['jurisdiction'] },
                { fields: ['renewalDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _registrationNumber_decorators;
    let _registrationNumber_initializers = [];
    let _registrationNumber_extraInitializers = [];
    let _applicationNumber_decorators;
    let _applicationNumber_initializers = [];
    let _applicationNumber_extraInitializers = [];
    let _markText_decorators;
    let _markText_initializers = [];
    let _markText_extraInitializers = [];
    let _trademarkType_decorators;
    let _trademarkType_initializers = [];
    let _trademarkType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _jurisdiction_decorators;
    let _jurisdiction_initializers = [];
    let _jurisdiction_extraInitializers = [];
    let _filingDate_decorators;
    let _filingDate_initializers = [];
    let _filingDate_extraInitializers = [];
    let _registrationDate_decorators;
    let _registrationDate_initializers = [];
    let _registrationDate_extraInitializers = [];
    let _renewalDate_decorators;
    let _renewalDate_initializers = [];
    let _renewalDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _niceClasses_decorators;
    let _niceClasses_initializers = [];
    let _niceClasses_extraInitializers = [];
    let _goodsServices_decorators;
    let _goodsServices_initializers = [];
    let _goodsServices_extraInitializers = [];
    let _owner_decorators;
    let _owner_initializers = [];
    let _owner_extraInitializers = [];
    let _imageUrl_decorators;
    let _imageUrl_initializers = [];
    let _imageUrl_extraInitializers = [];
    let _disclaimer_decorators;
    let _disclaimer_initializers = [];
    let _disclaimer_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _actions_decorators;
    let _actions_initializers = [];
    let _actions_extraInitializers = [];
    var Trademark = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.registrationNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _registrationNumber_initializers, void 0));
            this.applicationNumber = (__runInitializers(this, _registrationNumber_extraInitializers), __runInitializers(this, _applicationNumber_initializers, void 0));
            this.markText = (__runInitializers(this, _applicationNumber_extraInitializers), __runInitializers(this, _markText_initializers, void 0));
            this.trademarkType = (__runInitializers(this, _markText_extraInitializers), __runInitializers(this, _trademarkType_initializers, void 0));
            this.status = (__runInitializers(this, _trademarkType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.jurisdiction = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _jurisdiction_initializers, void 0));
            this.filingDate = (__runInitializers(this, _jurisdiction_extraInitializers), __runInitializers(this, _filingDate_initializers, void 0));
            this.registrationDate = (__runInitializers(this, _filingDate_extraInitializers), __runInitializers(this, _registrationDate_initializers, void 0));
            this.renewalDate = (__runInitializers(this, _registrationDate_extraInitializers), __runInitializers(this, _renewalDate_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _renewalDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.niceClasses = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _niceClasses_initializers, void 0));
            this.goodsServices = (__runInitializers(this, _niceClasses_extraInitializers), __runInitializers(this, _goodsServices_initializers, void 0));
            this.owner = (__runInitializers(this, _goodsServices_extraInitializers), __runInitializers(this, _owner_initializers, void 0));
            this.imageUrl = (__runInitializers(this, _owner_extraInitializers), __runInitializers(this, _imageUrl_initializers, void 0));
            this.disclaimer = (__runInitializers(this, _imageUrl_extraInitializers), __runInitializers(this, _disclaimer_initializers, void 0));
            this.metadata = (__runInitializers(this, _disclaimer_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.actions = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _actions_initializers, void 0));
            __runInitializers(this, _actions_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Trademark");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Trademark unique identifier' }), sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _registrationNumber_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Registration number' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _applicationNumber_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Application number' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _markText_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Trademark text' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _trademarkType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Trademark type', enum: TrademarkType }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(TrademarkType)))];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Trademark status', enum: TrademarkStatus }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(TrademarkStatus)))];
        _jurisdiction_decorators = [(0, swagger_1.ApiProperty)({ description: 'Jurisdiction', enum: IPJurisdiction }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(IPJurisdiction)))];
        _filingDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Filing date' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _registrationDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Registration date' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _renewalDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Renewal date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _expirationDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Expiration date' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _niceClasses_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Nice classification classes', type: [Number] }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _goodsServices_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Goods and services description' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _owner_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Trademark owner' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _imageUrl_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Trademark image URL' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _disclaimer_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Disclaimer text' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _actions_decorators = [(0, sequelize_typescript_1.HasMany)(() => IPAction)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _registrationNumber_decorators, { kind: "field", name: "registrationNumber", static: false, private: false, access: { has: obj => "registrationNumber" in obj, get: obj => obj.registrationNumber, set: (obj, value) => { obj.registrationNumber = value; } }, metadata: _metadata }, _registrationNumber_initializers, _registrationNumber_extraInitializers);
        __esDecorate(null, null, _applicationNumber_decorators, { kind: "field", name: "applicationNumber", static: false, private: false, access: { has: obj => "applicationNumber" in obj, get: obj => obj.applicationNumber, set: (obj, value) => { obj.applicationNumber = value; } }, metadata: _metadata }, _applicationNumber_initializers, _applicationNumber_extraInitializers);
        __esDecorate(null, null, _markText_decorators, { kind: "field", name: "markText", static: false, private: false, access: { has: obj => "markText" in obj, get: obj => obj.markText, set: (obj, value) => { obj.markText = value; } }, metadata: _metadata }, _markText_initializers, _markText_extraInitializers);
        __esDecorate(null, null, _trademarkType_decorators, { kind: "field", name: "trademarkType", static: false, private: false, access: { has: obj => "trademarkType" in obj, get: obj => obj.trademarkType, set: (obj, value) => { obj.trademarkType = value; } }, metadata: _metadata }, _trademarkType_initializers, _trademarkType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _jurisdiction_decorators, { kind: "field", name: "jurisdiction", static: false, private: false, access: { has: obj => "jurisdiction" in obj, get: obj => obj.jurisdiction, set: (obj, value) => { obj.jurisdiction = value; } }, metadata: _metadata }, _jurisdiction_initializers, _jurisdiction_extraInitializers);
        __esDecorate(null, null, _filingDate_decorators, { kind: "field", name: "filingDate", static: false, private: false, access: { has: obj => "filingDate" in obj, get: obj => obj.filingDate, set: (obj, value) => { obj.filingDate = value; } }, metadata: _metadata }, _filingDate_initializers, _filingDate_extraInitializers);
        __esDecorate(null, null, _registrationDate_decorators, { kind: "field", name: "registrationDate", static: false, private: false, access: { has: obj => "registrationDate" in obj, get: obj => obj.registrationDate, set: (obj, value) => { obj.registrationDate = value; } }, metadata: _metadata }, _registrationDate_initializers, _registrationDate_extraInitializers);
        __esDecorate(null, null, _renewalDate_decorators, { kind: "field", name: "renewalDate", static: false, private: false, access: { has: obj => "renewalDate" in obj, get: obj => obj.renewalDate, set: (obj, value) => { obj.renewalDate = value; } }, metadata: _metadata }, _renewalDate_initializers, _renewalDate_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _niceClasses_decorators, { kind: "field", name: "niceClasses", static: false, private: false, access: { has: obj => "niceClasses" in obj, get: obj => obj.niceClasses, set: (obj, value) => { obj.niceClasses = value; } }, metadata: _metadata }, _niceClasses_initializers, _niceClasses_extraInitializers);
        __esDecorate(null, null, _goodsServices_decorators, { kind: "field", name: "goodsServices", static: false, private: false, access: { has: obj => "goodsServices" in obj, get: obj => obj.goodsServices, set: (obj, value) => { obj.goodsServices = value; } }, metadata: _metadata }, _goodsServices_initializers, _goodsServices_extraInitializers);
        __esDecorate(null, null, _owner_decorators, { kind: "field", name: "owner", static: false, private: false, access: { has: obj => "owner" in obj, get: obj => obj.owner, set: (obj, value) => { obj.owner = value; } }, metadata: _metadata }, _owner_initializers, _owner_extraInitializers);
        __esDecorate(null, null, _imageUrl_decorators, { kind: "field", name: "imageUrl", static: false, private: false, access: { has: obj => "imageUrl" in obj, get: obj => obj.imageUrl, set: (obj, value) => { obj.imageUrl = value; } }, metadata: _metadata }, _imageUrl_initializers, _imageUrl_extraInitializers);
        __esDecorate(null, null, _disclaimer_decorators, { kind: "field", name: "disclaimer", static: false, private: false, access: { has: obj => "disclaimer" in obj, get: obj => obj.disclaimer, set: (obj, value) => { obj.disclaimer = value; } }, metadata: _metadata }, _disclaimer_initializers, _disclaimer_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _actions_decorators, { kind: "field", name: "actions", static: false, private: false, access: { has: obj => "actions" in obj, get: obj => obj.actions, set: (obj, value) => { obj.actions = value; } }, metadata: _metadata }, _actions_initializers, _actions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Trademark = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Trademark = _classThis;
})();
exports.Trademark = Trademark;
/**
 * Copyright database model
 */
let Copyright = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'copyrights',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['registrationNumber'] },
                { fields: ['status'] },
                { fields: ['jurisdiction'] },
                { fields: ['creationDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _registrationNumber_decorators;
    let _registrationNumber_initializers = [];
    let _registrationNumber_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _copyrightType_decorators;
    let _copyrightType_initializers = [];
    let _copyrightType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _jurisdiction_decorators;
    let _jurisdiction_initializers = [];
    let _jurisdiction_extraInitializers = [];
    let _creationDate_decorators;
    let _creationDate_initializers = [];
    let _creationDate_extraInitializers = [];
    let _publicationDate_decorators;
    let _publicationDate_initializers = [];
    let _publicationDate_extraInitializers = [];
    let _registrationDate_decorators;
    let _registrationDate_initializers = [];
    let _registrationDate_extraInitializers = [];
    let _authors_decorators;
    let _authors_initializers = [];
    let _authors_extraInitializers = [];
    let _owner_decorators;
    let _owner_initializers = [];
    let _owner_extraInitializers = [];
    let _workDescription_decorators;
    let _workDescription_initializers = [];
    let _workDescription_extraInitializers = [];
    let _isWorkForHire_decorators;
    let _isWorkForHire_initializers = [];
    let _isWorkForHire_extraInitializers = [];
    let _derivative_decorators;
    let _derivative_initializers = [];
    let _derivative_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _actions_decorators;
    let _actions_initializers = [];
    let _actions_extraInitializers = [];
    var Copyright = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.registrationNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _registrationNumber_initializers, void 0));
            this.title = (__runInitializers(this, _registrationNumber_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.copyrightType = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _copyrightType_initializers, void 0));
            this.status = (__runInitializers(this, _copyrightType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.jurisdiction = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _jurisdiction_initializers, void 0));
            this.creationDate = (__runInitializers(this, _jurisdiction_extraInitializers), __runInitializers(this, _creationDate_initializers, void 0));
            this.publicationDate = (__runInitializers(this, _creationDate_extraInitializers), __runInitializers(this, _publicationDate_initializers, void 0));
            this.registrationDate = (__runInitializers(this, _publicationDate_extraInitializers), __runInitializers(this, _registrationDate_initializers, void 0));
            this.authors = (__runInitializers(this, _registrationDate_extraInitializers), __runInitializers(this, _authors_initializers, void 0));
            this.owner = (__runInitializers(this, _authors_extraInitializers), __runInitializers(this, _owner_initializers, void 0));
            this.workDescription = (__runInitializers(this, _owner_extraInitializers), __runInitializers(this, _workDescription_initializers, void 0));
            this.isWorkForHire = (__runInitializers(this, _workDescription_extraInitializers), __runInitializers(this, _isWorkForHire_initializers, void 0));
            this.derivative = (__runInitializers(this, _isWorkForHire_extraInitializers), __runInitializers(this, _derivative_initializers, void 0));
            this.metadata = (__runInitializers(this, _derivative_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.actions = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _actions_initializers, void 0));
            __runInitializers(this, _actions_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Copyright");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Copyright unique identifier' }), sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _registrationNumber_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Registration number' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Work title' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500))];
        _copyrightType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Copyright type', enum: CopyrightType }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(CopyrightType)))];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Copyright status', enum: CopyrightStatus }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(CopyrightStatus)))];
        _jurisdiction_decorators = [(0, swagger_1.ApiProperty)({ description: 'Jurisdiction', enum: IPJurisdiction }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(IPJurisdiction)))];
        _creationDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Creation date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _publicationDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Publication date' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _registrationDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Registration date' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _authors_decorators = [(0, swagger_1.ApiProperty)({ description: 'List of authors', type: [String] }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _owner_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Copyright owner' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _workDescription_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Work description' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _isWorkForHire_decorators = [(0, swagger_1.ApiProperty)({ description: 'Work for hire flag' }), (0, sequelize_typescript_1.Default)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN)];
        _derivative_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Derivative work info' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _actions_decorators = [(0, sequelize_typescript_1.HasMany)(() => IPAction)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _registrationNumber_decorators, { kind: "field", name: "registrationNumber", static: false, private: false, access: { has: obj => "registrationNumber" in obj, get: obj => obj.registrationNumber, set: (obj, value) => { obj.registrationNumber = value; } }, metadata: _metadata }, _registrationNumber_initializers, _registrationNumber_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _copyrightType_decorators, { kind: "field", name: "copyrightType", static: false, private: false, access: { has: obj => "copyrightType" in obj, get: obj => obj.copyrightType, set: (obj, value) => { obj.copyrightType = value; } }, metadata: _metadata }, _copyrightType_initializers, _copyrightType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _jurisdiction_decorators, { kind: "field", name: "jurisdiction", static: false, private: false, access: { has: obj => "jurisdiction" in obj, get: obj => obj.jurisdiction, set: (obj, value) => { obj.jurisdiction = value; } }, metadata: _metadata }, _jurisdiction_initializers, _jurisdiction_extraInitializers);
        __esDecorate(null, null, _creationDate_decorators, { kind: "field", name: "creationDate", static: false, private: false, access: { has: obj => "creationDate" in obj, get: obj => obj.creationDate, set: (obj, value) => { obj.creationDate = value; } }, metadata: _metadata }, _creationDate_initializers, _creationDate_extraInitializers);
        __esDecorate(null, null, _publicationDate_decorators, { kind: "field", name: "publicationDate", static: false, private: false, access: { has: obj => "publicationDate" in obj, get: obj => obj.publicationDate, set: (obj, value) => { obj.publicationDate = value; } }, metadata: _metadata }, _publicationDate_initializers, _publicationDate_extraInitializers);
        __esDecorate(null, null, _registrationDate_decorators, { kind: "field", name: "registrationDate", static: false, private: false, access: { has: obj => "registrationDate" in obj, get: obj => obj.registrationDate, set: (obj, value) => { obj.registrationDate = value; } }, metadata: _metadata }, _registrationDate_initializers, _registrationDate_extraInitializers);
        __esDecorate(null, null, _authors_decorators, { kind: "field", name: "authors", static: false, private: false, access: { has: obj => "authors" in obj, get: obj => obj.authors, set: (obj, value) => { obj.authors = value; } }, metadata: _metadata }, _authors_initializers, _authors_extraInitializers);
        __esDecorate(null, null, _owner_decorators, { kind: "field", name: "owner", static: false, private: false, access: { has: obj => "owner" in obj, get: obj => obj.owner, set: (obj, value) => { obj.owner = value; } }, metadata: _metadata }, _owner_initializers, _owner_extraInitializers);
        __esDecorate(null, null, _workDescription_decorators, { kind: "field", name: "workDescription", static: false, private: false, access: { has: obj => "workDescription" in obj, get: obj => obj.workDescription, set: (obj, value) => { obj.workDescription = value; } }, metadata: _metadata }, _workDescription_initializers, _workDescription_extraInitializers);
        __esDecorate(null, null, _isWorkForHire_decorators, { kind: "field", name: "isWorkForHire", static: false, private: false, access: { has: obj => "isWorkForHire" in obj, get: obj => obj.isWorkForHire, set: (obj, value) => { obj.isWorkForHire = value; } }, metadata: _metadata }, _isWorkForHire_initializers, _isWorkForHire_extraInitializers);
        __esDecorate(null, null, _derivative_decorators, { kind: "field", name: "derivative", static: false, private: false, access: { has: obj => "derivative" in obj, get: obj => obj.derivative, set: (obj, value) => { obj.derivative = value; } }, metadata: _metadata }, _derivative_initializers, _derivative_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _actions_decorators, { kind: "field", name: "actions", static: false, private: false, access: { has: obj => "actions" in obj, get: obj => obj.actions, set: (obj, value) => { obj.actions = value; } }, metadata: _metadata }, _actions_initializers, _actions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Copyright = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Copyright = _classThis;
})();
exports.Copyright = Copyright;
/**
 * Prior art search database model
 */
let PriorArtSearch = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'prior_art_searches',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['patentId'] },
                { fields: ['searchDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _patentId_decorators;
    let _patentId_initializers = [];
    let _patentId_extraInitializers = [];
    let _searchQuery_decorators;
    let _searchQuery_initializers = [];
    let _searchQuery_extraInitializers = [];
    let _searchDate_decorators;
    let _searchDate_initializers = [];
    let _searchDate_extraInitializers = [];
    let _databases_decorators;
    let _databases_initializers = [];
    let _databases_extraInitializers = [];
    let _keywords_decorators;
    let _keywords_initializers = [];
    let _keywords_extraInitializers = [];
    let _classifications_decorators;
    let _classifications_initializers = [];
    let _classifications_extraInitializers = [];
    let _results_decorators;
    let _results_initializers = [];
    let _results_extraInitializers = [];
    let _relevanceScores_decorators;
    let _relevanceScores_initializers = [];
    let _relevanceScores_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _patent_decorators;
    let _patent_initializers = [];
    let _patent_extraInitializers = [];
    var PriorArtSearch = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.patentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _patentId_initializers, void 0));
            this.searchQuery = (__runInitializers(this, _patentId_extraInitializers), __runInitializers(this, _searchQuery_initializers, void 0));
            this.searchDate = (__runInitializers(this, _searchQuery_extraInitializers), __runInitializers(this, _searchDate_initializers, void 0));
            this.databases = (__runInitializers(this, _searchDate_extraInitializers), __runInitializers(this, _databases_initializers, void 0));
            this.keywords = (__runInitializers(this, _databases_extraInitializers), __runInitializers(this, _keywords_initializers, void 0));
            this.classifications = (__runInitializers(this, _keywords_extraInitializers), __runInitializers(this, _classifications_initializers, void 0));
            this.results = (__runInitializers(this, _classifications_extraInitializers), __runInitializers(this, _results_initializers, void 0));
            this.relevanceScores = (__runInitializers(this, _results_extraInitializers), __runInitializers(this, _relevanceScores_initializers, void 0));
            this.metadata = (__runInitializers(this, _relevanceScores_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.patent = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _patent_initializers, void 0));
            __runInitializers(this, _patent_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PriorArtSearch");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Search unique identifier' }), sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _patentId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Associated patent ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Patent), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _searchQuery_decorators = [(0, swagger_1.ApiProperty)({ description: 'Search query' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _searchDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Search date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _databases_decorators = [(0, swagger_1.ApiProperty)({ description: 'Databases searched', type: [String] }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _keywords_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Search keywords', type: [String] }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _classifications_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Classifications searched', type: [String] }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _results_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Search results' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _relevanceScores_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Relevance scores by result' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _patent_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Patent)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _patentId_decorators, { kind: "field", name: "patentId", static: false, private: false, access: { has: obj => "patentId" in obj, get: obj => obj.patentId, set: (obj, value) => { obj.patentId = value; } }, metadata: _metadata }, _patentId_initializers, _patentId_extraInitializers);
        __esDecorate(null, null, _searchQuery_decorators, { kind: "field", name: "searchQuery", static: false, private: false, access: { has: obj => "searchQuery" in obj, get: obj => obj.searchQuery, set: (obj, value) => { obj.searchQuery = value; } }, metadata: _metadata }, _searchQuery_initializers, _searchQuery_extraInitializers);
        __esDecorate(null, null, _searchDate_decorators, { kind: "field", name: "searchDate", static: false, private: false, access: { has: obj => "searchDate" in obj, get: obj => obj.searchDate, set: (obj, value) => { obj.searchDate = value; } }, metadata: _metadata }, _searchDate_initializers, _searchDate_extraInitializers);
        __esDecorate(null, null, _databases_decorators, { kind: "field", name: "databases", static: false, private: false, access: { has: obj => "databases" in obj, get: obj => obj.databases, set: (obj, value) => { obj.databases = value; } }, metadata: _metadata }, _databases_initializers, _databases_extraInitializers);
        __esDecorate(null, null, _keywords_decorators, { kind: "field", name: "keywords", static: false, private: false, access: { has: obj => "keywords" in obj, get: obj => obj.keywords, set: (obj, value) => { obj.keywords = value; } }, metadata: _metadata }, _keywords_initializers, _keywords_extraInitializers);
        __esDecorate(null, null, _classifications_decorators, { kind: "field", name: "classifications", static: false, private: false, access: { has: obj => "classifications" in obj, get: obj => obj.classifications, set: (obj, value) => { obj.classifications = value; } }, metadata: _metadata }, _classifications_initializers, _classifications_extraInitializers);
        __esDecorate(null, null, _results_decorators, { kind: "field", name: "results", static: false, private: false, access: { has: obj => "results" in obj, get: obj => obj.results, set: (obj, value) => { obj.results = value; } }, metadata: _metadata }, _results_initializers, _results_extraInitializers);
        __esDecorate(null, null, _relevanceScores_decorators, { kind: "field", name: "relevanceScores", static: false, private: false, access: { has: obj => "relevanceScores" in obj, get: obj => obj.relevanceScores, set: (obj, value) => { obj.relevanceScores = value; } }, metadata: _metadata }, _relevanceScores_initializers, _relevanceScores_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _patent_decorators, { kind: "field", name: "patent", static: false, private: false, access: { has: obj => "patent" in obj, get: obj => obj.patent, set: (obj, value) => { obj.patent = value; } }, metadata: _metadata }, _patent_initializers, _patent_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PriorArtSearch = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PriorArtSearch = _classThis;
})();
exports.PriorArtSearch = PriorArtSearch;
/**
 * IP portfolio database model
 */
let IPPortfolio = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'ip_portfolios',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['ownerId'] },
                { fields: ['lastValuationDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _ownerId_decorators;
    let _ownerId_initializers = [];
    let _ownerId_extraInitializers = [];
    let _patents_decorators;
    let _patents_initializers = [];
    let _patents_extraInitializers = [];
    let _trademarks_decorators;
    let _trademarks_initializers = [];
    let _trademarks_extraInitializers = [];
    let _copyrights_decorators;
    let _copyrights_initializers = [];
    let _copyrights_extraInitializers = [];
    let _totalValue_decorators;
    let _totalValue_initializers = [];
    let _totalValue_extraInitializers = [];
    let _lastValuationDate_decorators;
    let _lastValuationDate_initializers = [];
    let _lastValuationDate_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var IPPortfolio = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.ownerId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
            this.patents = (__runInitializers(this, _ownerId_extraInitializers), __runInitializers(this, _patents_initializers, void 0));
            this.trademarks = (__runInitializers(this, _patents_extraInitializers), __runInitializers(this, _trademarks_initializers, void 0));
            this.copyrights = (__runInitializers(this, _trademarks_extraInitializers), __runInitializers(this, _copyrights_initializers, void 0));
            this.totalValue = (__runInitializers(this, _copyrights_extraInitializers), __runInitializers(this, _totalValue_initializers, void 0));
            this.lastValuationDate = (__runInitializers(this, _totalValue_extraInitializers), __runInitializers(this, _lastValuationDate_initializers, void 0));
            this.metadata = (__runInitializers(this, _lastValuationDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "IPPortfolio");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Portfolio unique identifier' }), sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Portfolio name' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Portfolio description' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _ownerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Portfolio owner ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _patents_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Patent IDs in portfolio', type: [String] }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _trademarks_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Trademark IDs in portfolio', type: [String] }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _copyrights_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Copyright IDs in portfolio', type: [String] }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _totalValue_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Total portfolio value' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _lastValuationDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Last valuation date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: obj => "ownerId" in obj, get: obj => obj.ownerId, set: (obj, value) => { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
        __esDecorate(null, null, _patents_decorators, { kind: "field", name: "patents", static: false, private: false, access: { has: obj => "patents" in obj, get: obj => obj.patents, set: (obj, value) => { obj.patents = value; } }, metadata: _metadata }, _patents_initializers, _patents_extraInitializers);
        __esDecorate(null, null, _trademarks_decorators, { kind: "field", name: "trademarks", static: false, private: false, access: { has: obj => "trademarks" in obj, get: obj => obj.trademarks, set: (obj, value) => { obj.trademarks = value; } }, metadata: _metadata }, _trademarks_initializers, _trademarks_extraInitializers);
        __esDecorate(null, null, _copyrights_decorators, { kind: "field", name: "copyrights", static: false, private: false, access: { has: obj => "copyrights" in obj, get: obj => obj.copyrights, set: (obj, value) => { obj.copyrights = value; } }, metadata: _metadata }, _copyrights_initializers, _copyrights_extraInitializers);
        __esDecorate(null, null, _totalValue_decorators, { kind: "field", name: "totalValue", static: false, private: false, access: { has: obj => "totalValue" in obj, get: obj => obj.totalValue, set: (obj, value) => { obj.totalValue = value; } }, metadata: _metadata }, _totalValue_initializers, _totalValue_extraInitializers);
        __esDecorate(null, null, _lastValuationDate_decorators, { kind: "field", name: "lastValuationDate", static: false, private: false, access: { has: obj => "lastValuationDate" in obj, get: obj => obj.lastValuationDate, set: (obj, value) => { obj.lastValuationDate = value; } }, metadata: _metadata }, _lastValuationDate_initializers, _lastValuationDate_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IPPortfolio = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IPPortfolio = _classThis;
})();
exports.IPPortfolio = IPPortfolio;
/**
 * IP action/event tracking model
 */
let IPAction = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'ip_actions',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['actionType'] },
                { fields: ['actionDate'] },
                { fields: ['dueDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _patentId_decorators;
    let _patentId_initializers = [];
    let _patentId_extraInitializers = [];
    let _trademarkId_decorators;
    let _trademarkId_initializers = [];
    let _trademarkId_extraInitializers = [];
    let _copyrightId_decorators;
    let _copyrightId_initializers = [];
    let _copyrightId_extraInitializers = [];
    let _actionType_decorators;
    let _actionType_initializers = [];
    let _actionType_extraInitializers = [];
    let _actionDate_decorators;
    let _actionDate_initializers = [];
    let _actionDate_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _responsibleParty_decorators;
    let _responsibleParty_initializers = [];
    let _responsibleParty_extraInitializers = [];
    let _cost_decorators;
    let _cost_initializers = [];
    let _cost_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _patent_decorators;
    let _patent_initializers = [];
    let _patent_extraInitializers = [];
    let _trademark_decorators;
    let _trademark_initializers = [];
    let _trademark_extraInitializers = [];
    let _copyright_decorators;
    let _copyright_initializers = [];
    let _copyright_extraInitializers = [];
    var IPAction = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.patentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _patentId_initializers, void 0));
            this.trademarkId = (__runInitializers(this, _patentId_extraInitializers), __runInitializers(this, _trademarkId_initializers, void 0));
            this.copyrightId = (__runInitializers(this, _trademarkId_extraInitializers), __runInitializers(this, _copyrightId_initializers, void 0));
            this.actionType = (__runInitializers(this, _copyrightId_extraInitializers), __runInitializers(this, _actionType_initializers, void 0));
            this.actionDate = (__runInitializers(this, _actionType_extraInitializers), __runInitializers(this, _actionDate_initializers, void 0));
            this.dueDate = (__runInitializers(this, _actionDate_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.description = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.responsibleParty = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _responsibleParty_initializers, void 0));
            this.cost = (__runInitializers(this, _responsibleParty_extraInitializers), __runInitializers(this, _cost_initializers, void 0));
            this.metadata = (__runInitializers(this, _cost_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.patent = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _patent_initializers, void 0));
            this.trademark = (__runInitializers(this, _patent_extraInitializers), __runInitializers(this, _trademark_initializers, void 0));
            this.copyright = (__runInitializers(this, _trademark_extraInitializers), __runInitializers(this, _copyright_initializers, void 0));
            __runInitializers(this, _copyright_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "IPAction");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action unique identifier' }), sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _patentId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Patent ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Patent), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _trademarkId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Trademark ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Trademark), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _copyrightId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Copyright ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Copyright), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _actionType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action type', enum: IPActionType }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(IPActionType)))];
        _actionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _dueDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Due date for action' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Action description' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Action status' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _responsibleParty_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Responsible party' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _cost_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Action cost' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(15, 2))];
        _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _patent_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Patent)];
        _trademark_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Trademark)];
        _copyright_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Copyright)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _patentId_decorators, { kind: "field", name: "patentId", static: false, private: false, access: { has: obj => "patentId" in obj, get: obj => obj.patentId, set: (obj, value) => { obj.patentId = value; } }, metadata: _metadata }, _patentId_initializers, _patentId_extraInitializers);
        __esDecorate(null, null, _trademarkId_decorators, { kind: "field", name: "trademarkId", static: false, private: false, access: { has: obj => "trademarkId" in obj, get: obj => obj.trademarkId, set: (obj, value) => { obj.trademarkId = value; } }, metadata: _metadata }, _trademarkId_initializers, _trademarkId_extraInitializers);
        __esDecorate(null, null, _copyrightId_decorators, { kind: "field", name: "copyrightId", static: false, private: false, access: { has: obj => "copyrightId" in obj, get: obj => obj.copyrightId, set: (obj, value) => { obj.copyrightId = value; } }, metadata: _metadata }, _copyrightId_initializers, _copyrightId_extraInitializers);
        __esDecorate(null, null, _actionType_decorators, { kind: "field", name: "actionType", static: false, private: false, access: { has: obj => "actionType" in obj, get: obj => obj.actionType, set: (obj, value) => { obj.actionType = value; } }, metadata: _metadata }, _actionType_initializers, _actionType_extraInitializers);
        __esDecorate(null, null, _actionDate_decorators, { kind: "field", name: "actionDate", static: false, private: false, access: { has: obj => "actionDate" in obj, get: obj => obj.actionDate, set: (obj, value) => { obj.actionDate = value; } }, metadata: _metadata }, _actionDate_initializers, _actionDate_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _responsibleParty_decorators, { kind: "field", name: "responsibleParty", static: false, private: false, access: { has: obj => "responsibleParty" in obj, get: obj => obj.responsibleParty, set: (obj, value) => { obj.responsibleParty = value; } }, metadata: _metadata }, _responsibleParty_initializers, _responsibleParty_extraInitializers);
        __esDecorate(null, null, _cost_decorators, { kind: "field", name: "cost", static: false, private: false, access: { has: obj => "cost" in obj, get: obj => obj.cost, set: (obj, value) => { obj.cost = value; } }, metadata: _metadata }, _cost_initializers, _cost_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _patent_decorators, { kind: "field", name: "patent", static: false, private: false, access: { has: obj => "patent" in obj, get: obj => obj.patent, set: (obj, value) => { obj.patent = value; } }, metadata: _metadata }, _patent_initializers, _patent_extraInitializers);
        __esDecorate(null, null, _trademark_decorators, { kind: "field", name: "trademark", static: false, private: false, access: { has: obj => "trademark" in obj, get: obj => obj.trademark, set: (obj, value) => { obj.trademark = value; } }, metadata: _metadata }, _trademark_initializers, _trademark_extraInitializers);
        __esDecorate(null, null, _copyright_decorators, { kind: "field", name: "copyright", static: false, private: false, access: { has: obj => "copyright" in obj, get: obj => obj.copyright, set: (obj, value) => { obj.copyright = value; } }, metadata: _metadata }, _copyright_initializers, _copyright_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IPAction = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IPAction = _classThis;
})();
exports.IPAction = IPAction;
// ============================================================================
// CONFIGURATION
// ============================================================================
exports.ipManagementConfig = (0, config_1.registerAs)('ipManagement', () => ({
    usptoApiKey: process.env.USPTO_API_KEY,
    usptoApiUrl: process.env.USPTO_API_URL || 'https://developer.uspto.gov/api',
    epoApiKey: process.env.EPO_API_KEY,
    epoApiUrl: process.env.EPO_API_URL || 'https://ops.epo.org/3.2',
    priorArtDatabases: process.env.PRIOR_ART_DATABASES?.split(',') || ['USPTO', 'EPO', 'Google Patents'],
    renewalReminderDays: parseInt(process.env.IP_RENEWAL_REMINDER_DAYS || '90', 10),
    maintenanceFeeSchedule: process.env.IP_MAINTENANCE_FEE_SCHEDULE || '3.5,7.5,11.5', // years
    valuationMethod: process.env.IP_VALUATION_METHOD || 'cost',
    enableTrademarkMonitoring: process.env.ENABLE_TRADEMARK_MONITORING === 'true',
    trademarkWatchingInterval: process.env.TRADEMARK_WATCHING_INTERVAL || '0 0 * * *', // daily
}));
// ============================================================================
// INJECTABLE SERVICES
// ============================================================================
/**
 * Patent search and management service
 */
let PatentService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PatentService = _classThis = class {
        constructor(sequelize, configService) {
            this.sequelize = sequelize;
            this.configService = configService;
            this.logger = new common_1.Logger(PatentService.name);
        }
        /**
         * 1. Create a new patent record
         */
        async createPatent(data) {
            try {
                const validated = exports.PatentSchema.parse(data);
                const patent = await Patent.create(validated);
                this.logger.log(`Created patent: ${patent.id}`);
                return patent;
            }
            catch (error) {
                this.logger.error('Error creating patent', error);
                throw new common_1.BadRequestException('Failed to create patent');
            }
        }
        /**
         * 2. Search patents by criteria
         */
        async searchPatents(criteria) {
            try {
                const where = {};
                if (criteria.status)
                    where['status'] = criteria.status;
                if (criteria.jurisdiction)
                    where['jurisdiction'] = criteria.jurisdiction;
                if (criteria.patentType)
                    where['patentType'] = criteria.patentType;
                if (criteria.assignee)
                    where['assignee'] = { [sequelize_1.Op.iLike]: `%${criteria.assignee}%` };
                if (criteria.query) {
                    where[sequelize_1.Op.or] = [
                        { title: { [sequelize_1.Op.iLike]: `%${criteria.query}%` } },
                        { abstract: { [sequelize_1.Op.iLike]: `%${criteria.query}%` } },
                        { patentNumber: { [sequelize_1.Op.iLike]: `%${criteria.query}%` } },
                    ];
                }
                if (criteria.filingDateFrom || criteria.filingDateTo) {
                    where['filingDate'] = {};
                    if (criteria.filingDateFrom)
                        where['filingDate'][sequelize_1.Op.gte] = criteria.filingDateFrom;
                    if (criteria.filingDateTo)
                        where['filingDate'][sequelize_1.Op.lte] = criteria.filingDateTo;
                }
                const { rows: patents, count: total } = await Patent.findAndCountAll({
                    where,
                    limit: criteria.limit || 50,
                    offset: criteria.offset || 0,
                    order: [['createdAt', 'DESC']],
                });
                return { patents, total };
            }
            catch (error) {
                this.logger.error('Error searching patents', error);
                throw new common_1.InternalServerErrorException('Failed to search patents');
            }
        }
        /**
         * 3. Update patent status
         */
        async updatePatentStatus(patentId, status, metadata) {
            try {
                const patent = await Patent.findByPk(patentId);
                if (!patent)
                    throw new common_1.NotFoundException('Patent not found');
                patent.status = status;
                if (metadata)
                    patent.metadata = { ...patent.metadata, ...metadata };
                if (status === PatentStatus.GRANTED && !patent.grantDate) {
                    patent.grantDate = new Date();
                    // Calculate expiration date (typically 20 years from filing)
                    if (patent.filingDate) {
                        const expirationDate = new Date(patent.filingDate);
                        expirationDate.setFullYear(expirationDate.getFullYear() + 20);
                        patent.expirationDate = expirationDate;
                    }
                }
                await patent.save();
                this.logger.log(`Updated patent ${patentId} status to ${status}`);
                return patent;
            }
            catch (error) {
                this.logger.error('Error updating patent status', error);
                throw error instanceof common_1.NotFoundException ? error : new common_1.InternalServerErrorException('Failed to update patent status');
            }
        }
        /**
         * 4. Get patent by ID with related data
         */
        async getPatentById(patentId) {
            try {
                const patent = await Patent.findByPk(patentId, {
                    include: [
                        { model: PriorArtSearch, as: 'priorArtSearches' },
                        { model: IPAction, as: 'actions' },
                    ],
                });
                if (!patent)
                    throw new common_1.NotFoundException('Patent not found');
                return patent;
            }
            catch (error) {
                this.logger.error('Error getting patent', error);
                throw error instanceof common_1.NotFoundException ? error : new common_1.InternalServerErrorException('Failed to get patent');
            }
        }
        /**
         * 5. Get patents expiring soon
         */
        async getPatentsExpiringSoon(daysAhead = 90) {
            try {
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + daysAhead);
                const patents = await Patent.findAll({
                    where: {
                        expirationDate: {
                            [sequelize_1.Op.between]: [new Date(), futureDate],
                        },
                        status: {
                            [sequelize_1.Op.in]: [PatentStatus.ACTIVE, PatentStatus.GRANTED],
                        },
                    },
                    order: [['expirationDate', 'ASC']],
                });
                return patents;
            }
            catch (error) {
                this.logger.error('Error getting expiring patents', error);
                throw new common_1.InternalServerErrorException('Failed to get expiring patents');
            }
        }
        /**
         * 6. Calculate patent maintenance fees
         */
        async calculateMaintenanceFees(patentId) {
            try {
                const patent = await Patent.findByPk(patentId);
                if (!patent)
                    throw new common_1.NotFoundException('Patent not found');
                if (!patent.grantDate) {
                    return { fees: [], totalCost: 0 };
                }
                const feeSchedule = this.configService.get('ipManagement.maintenanceFeeSchedule', '3.5,7.5,11.5');
                const years = feeSchedule.split(',').map(y => parseFloat(y));
                const fees = [];
                let totalCost = 0;
                // US utility patent fee schedule (example)
                const feeAmounts = {
                    3.5: 1600,
                    7.5: 3600,
                    11.5: 7400,
                };
                for (const year of years) {
                    const dueDate = new Date(patent.grantDate);
                    dueDate.setFullYear(dueDate.getFullYear() + Math.floor(year));
                    dueDate.setMonth(dueDate.getMonth() + Math.round((year % 1) * 12));
                    fees.push({
                        year,
                        dueDate,
                        amount: feeAmounts[year] || 0,
                        isPaid: patent.maintenanceFees?.[`year_${year}`]?.paid || false,
                    });
                    if (!patent.maintenanceFees?.[`year_${year}`]?.paid) {
                        totalCost += feeAmounts[year] || 0;
                    }
                }
                return { fees, totalCost };
            }
            catch (error) {
                this.logger.error('Error calculating maintenance fees', error);
                throw error instanceof common_1.NotFoundException ? error : new common_1.InternalServerErrorException('Failed to calculate maintenance fees');
            }
        }
        /**
         * 7. Get patent family tree
         */
        async getPatentFamily(patentId) {
            try {
                const patent = await Patent.findByPk(patentId);
                if (!patent)
                    throw new common_1.NotFoundException('Patent not found');
                if (!patent.familyId)
                    return [patent];
                const familyMembers = await Patent.findAll({
                    where: { familyId: patent.familyId },
                    order: [['filingDate', 'ASC']],
                });
                return familyMembers;
            }
            catch (error) {
                this.logger.error('Error getting patent family', error);
                throw error instanceof common_1.NotFoundException ? error : new common_1.InternalServerErrorException('Failed to get patent family');
            }
        }
        /**
         * 8. Analyze patent citations
         */
        async analyzePatentCitations(patentId) {
            try {
                const patent = await Patent.findByPk(patentId);
                if (!patent)
                    throw new common_1.NotFoundException('Patent not found');
                // This would integrate with external APIs in production
                const citations = patent.metadata?.citations || {};
                const forwardCitations = citations.forward?.length || 0;
                const backwardCitations = citations.backward?.length || 0;
                // Simple citation score calculation
                const citationScore = (forwardCitations * 2) + backwardCitations;
                return { forwardCitations, backwardCitations, citationScore };
            }
            catch (error) {
                this.logger.error('Error analyzing citations', error);
                throw error instanceof common_1.NotFoundException ? error : new common_1.InternalServerErrorException('Failed to analyze citations');
            }
        }
    };
    __setFunctionName(_classThis, "PatentService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PatentService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PatentService = _classThis;
})();
exports.PatentService = PatentService;
/**
 * Prior art search service
 */
let PriorArtSearchService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PriorArtSearchService = _classThis = class {
        constructor(sequelize, configService) {
            this.sequelize = sequelize;
            this.configService = configService;
            this.logger = new common_1.Logger(PriorArtSearchService.name);
        }
        /**
         * 9. Conduct prior art search
         */
        async conductPriorArtSearch(data) {
            try {
                const validated = exports.PriorArtSearchSchema.parse(data);
                // In production, this would call external patent databases
                const searchResults = await this.searchExternalDatabases(validated.searchQuery, validated.databases);
                const search = await PriorArtSearch.create({
                    ...validated,
                    results: searchResults,
                    relevanceScores: this.calculateRelevanceScores(searchResults, validated.searchQuery),
                });
                this.logger.log(`Conducted prior art search: ${search.id}`);
                return search;
            }
            catch (error) {
                this.logger.error('Error conducting prior art search', error);
                throw new common_1.BadRequestException('Failed to conduct prior art search');
            }
        }
        /**
         * 10. Get prior art search results
         */
        async getPriorArtSearchResults(searchId) {
            try {
                const search = await PriorArtSearch.findByPk(searchId, {
                    include: [{ model: Patent, as: 'patent' }],
                });
                if (!search)
                    throw new common_1.NotFoundException('Prior art search not found');
                return search;
            }
            catch (error) {
                this.logger.error('Error getting prior art search', error);
                throw error instanceof common_1.NotFoundException ? error : new common_1.InternalServerErrorException('Failed to get prior art search');
            }
        }
        /**
         * 11. Search similar patents (AI-powered similarity)
         */
        async searchSimilarPatents(patentId, limit = 10) {
            try {
                const patent = await Patent.findByPk(patentId);
                if (!patent)
                    throw new common_1.NotFoundException('Patent not found');
                // In production, this would use AI/ML similarity detection
                const similarPatents = await Patent.findAll({
                    where: {
                        id: { [sequelize_1.Op.ne]: patentId },
                        status: { [sequelize_1.Op.ne]: PatentStatus.ABANDONED },
                        ipcClassifications: {
                            [sequelize_1.Op.overlap]: patent.ipcClassifications || [],
                        },
                    },
                    limit,
                    order: [['createdAt', 'DESC']],
                });
                return similarPatents.map(p => ({
                    patent: p,
                    similarityScore: this.calculateSimilarityScore(patent, p),
                }));
            }
            catch (error) {
                this.logger.error('Error searching similar patents', error);
                throw error instanceof common_1.NotFoundException ? error : new common_1.InternalServerErrorException('Failed to search similar patents');
            }
        }
        async searchExternalDatabases(query, databases) {
            // Mock implementation - would call real APIs in production
            return databases.map(db => ({
                database: db,
                results: [],
                searchedAt: new Date(),
            }));
        }
        calculateRelevanceScores(results, query) {
            // Mock implementation - would use actual relevance algorithm
            return {};
        }
        calculateSimilarityScore(patent1, patent2) {
            // Mock implementation - would use NLP/ML in production
            let score = 0;
            // IPC classification overlap
            const ipc1 = patent1.ipcClassifications || [];
            const ipc2 = patent2.ipcClassifications || [];
            const ipcOverlap = ipc1.filter(c => ipc2.includes(c)).length;
            score += ipcOverlap * 20;
            // Same jurisdiction
            if (patent1.jurisdiction === patent2.jurisdiction)
                score += 10;
            // Title similarity (simple word overlap)
            const words1 = patent1.title.toLowerCase().split(' ');
            const words2 = patent2.title.toLowerCase().split(' ');
            const wordOverlap = words1.filter(w => words2.includes(w)).length;
            score += wordOverlap * 5;
            return Math.min(score, 100);
        }
    };
    __setFunctionName(_classThis, "PriorArtSearchService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PriorArtSearchService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PriorArtSearchService = _classThis;
})();
exports.PriorArtSearchService = PriorArtSearchService;
/**
 * Trademark monitoring and management service
 */
let TrademarkService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TrademarkService = _classThis = class {
        constructor(sequelize, configService) {
            this.sequelize = sequelize;
            this.configService = configService;
            this.logger = new common_1.Logger(TrademarkService.name);
        }
        /**
         * 12. Create a new trademark record
         */
        async createTrademark(data) {
            try {
                const validated = exports.TrademarkSchema.parse(data);
                const trademark = await Trademark.create(validated);
                this.logger.log(`Created trademark: ${trademark.id}`);
                return trademark;
            }
            catch (error) {
                this.logger.error('Error creating trademark', error);
                throw new common_1.BadRequestException('Failed to create trademark');
            }
        }
        /**
         * 13. Search trademarks by criteria
         */
        async searchTrademarks(criteria) {
            try {
                const where = {};
                if (criteria.status)
                    where['status'] = criteria.status;
                if (criteria.jurisdiction)
                    where['jurisdiction'] = criteria.jurisdiction;
                if (criteria.trademarkType)
                    where['trademarkType'] = criteria.trademarkType;
                if (criteria.owner)
                    where['owner'] = { [sequelize_1.Op.iLike]: `%${criteria.owner}%` };
                if (criteria.query) {
                    where[sequelize_1.Op.or] = [
                        { markText: { [sequelize_1.Op.iLike]: `%${criteria.query}%` } },
                        { registrationNumber: { [sequelize_1.Op.iLike]: `%${criteria.query}%` } },
                        { goodsServices: { [sequelize_1.Op.iLike]: `%${criteria.query}%` } },
                    ];
                }
                if (criteria.niceClass) {
                    where['niceClasses'] = {
                        [sequelize_1.Op.contains]: [criteria.niceClass],
                    };
                }
                const { rows: trademarks, count: total } = await Trademark.findAndCountAll({
                    where,
                    limit: criteria.limit || 50,
                    offset: criteria.offset || 0,
                    order: [['createdAt', 'DESC']],
                });
                return { trademarks, total };
            }
            catch (error) {
                this.logger.error('Error searching trademarks', error);
                throw new common_1.InternalServerErrorException('Failed to search trademarks');
            }
        }
        /**
         * 14. Monitor for conflicting trademarks
         */
        async monitorTrademarkConflicts(trademarkId) {
            try {
                const trademark = await Trademark.findByPk(trademarkId);
                if (!trademark)
                    throw new common_1.NotFoundException('Trademark not found');
                const potentialConflicts = await Trademark.findAll({
                    where: {
                        id: { [sequelize_1.Op.ne]: trademarkId },
                        status: {
                            [sequelize_1.Op.in]: [TrademarkStatus.REGISTERED, TrademarkStatus.ACTIVE, TrademarkStatus.PENDING],
                        },
                        jurisdiction: trademark.jurisdiction,
                        niceClasses: {
                            [sequelize_1.Op.overlap]: trademark.niceClasses || [],
                        },
                    },
                });
                // Filter by similarity
                const conflicts = potentialConflicts.filter(tm => this.calculateTrademarkSimilarity(trademark, tm) > 70);
                return conflicts;
            }
            catch (error) {
                this.logger.error('Error monitoring trademark conflicts', error);
                throw error instanceof common_1.NotFoundException ? error : new common_1.InternalServerErrorException('Failed to monitor conflicts');
            }
        }
        /**
         * 15. Get trademarks requiring renewal
         */
        async getTrademarksRequiringRenewal(daysAhead = 90) {
            try {
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + daysAhead);
                const trademarks = await Trademark.findAll({
                    where: {
                        renewalDate: {
                            [sequelize_1.Op.between]: [new Date(), futureDate],
                        },
                        status: {
                            [sequelize_1.Op.in]: [TrademarkStatus.REGISTERED, TrademarkStatus.ACTIVE],
                        },
                    },
                    order: [['renewalDate', 'ASC']],
                });
                return trademarks;
            }
            catch (error) {
                this.logger.error('Error getting trademarks requiring renewal', error);
                throw new common_1.InternalServerErrorException('Failed to get trademarks requiring renewal');
            }
        }
        /**
         * 16. Update trademark status
         */
        async updateTrademarkStatus(trademarkId, status) {
            try {
                const trademark = await Trademark.findByPk(trademarkId);
                if (!trademark)
                    throw new common_1.NotFoundException('Trademark not found');
                trademark.status = status;
                if (status === TrademarkStatus.REGISTERED && !trademark.registrationDate) {
                    trademark.registrationDate = new Date();
                    // Calculate renewal date (typically 10 years)
                    const renewalDate = new Date(trademark.registrationDate);
                    renewalDate.setFullYear(renewalDate.getFullYear() + 10);
                    trademark.renewalDate = renewalDate;
                }
                await trademark.save();
                this.logger.log(`Updated trademark ${trademarkId} status to ${status}`);
                return trademark;
            }
            catch (error) {
                this.logger.error('Error updating trademark status', error);
                throw error instanceof common_1.NotFoundException ? error : new common_1.InternalServerErrorException('Failed to update trademark status');
            }
        }
        /**
         * 17. Search trademark by image similarity
         */
        async searchTrademarkByImage(imageUrl, jurisdiction) {
            try {
                // In production, this would use image similarity AI/ML
                const where = {
                    imageUrl: { [sequelize_1.Op.ne]: null },
                    status: {
                        [sequelize_1.Op.in]: [TrademarkStatus.REGISTERED, TrademarkStatus.ACTIVE, TrademarkStatus.PENDING],
                    },
                };
                if (jurisdiction)
                    where['jurisdiction'] = jurisdiction;
                const trademarks = await Trademark.findAll({ where, limit: 20 });
                // Mock similarity scoring - would use actual image comparison in production
                return trademarks.map(tm => ({
                    ...tm.toJSON(),
                    similarityScore: Math.random() * 100,
                })).sort((a, b) => b.similarityScore - a.similarityScore);
            }
            catch (error) {
                this.logger.error('Error searching trademark by image', error);
                throw new common_1.InternalServerErrorException('Failed to search trademark by image');
            }
        }
        calculateTrademarkSimilarity(tm1, tm2) {
            // Simple similarity calculation - would use advanced algorithms in production
            let score = 0;
            if (tm1.markText && tm2.markText) {
                const text1 = tm1.markText.toLowerCase();
                const text2 = tm2.markText.toLowerCase();
                if (text1 === text2)
                    score += 100;
                else if (text1.includes(text2) || text2.includes(text1))
                    score += 70;
                else {
                    const words1 = text1.split(' ');
                    const words2 = text2.split(' ');
                    const overlap = words1.filter(w => words2.includes(w)).length;
                    score += (overlap / Math.max(words1.length, words2.length)) * 50;
                }
            }
            return score;
        }
    };
    __setFunctionName(_classThis, "TrademarkService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TrademarkService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TrademarkService = _classThis;
})();
exports.TrademarkService = TrademarkService;
/**
 * Copyright management service
 */
let CopyrightService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CopyrightService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
            this.logger = new common_1.Logger(CopyrightService.name);
        }
        /**
         * 18. Create a new copyright record
         */
        async createCopyright(data) {
            try {
                const validated = exports.CopyrightSchema.parse(data);
                const copyright = await Copyright.create(validated);
                this.logger.log(`Created copyright: ${copyright.id}`);
                return copyright;
            }
            catch (error) {
                this.logger.error('Error creating copyright', error);
                throw new common_1.BadRequestException('Failed to create copyright');
            }
        }
        /**
         * 19. Search copyrights by criteria
         */
        async searchCopyrights(criteria) {
            try {
                const where = {};
                if (criteria.status)
                    where['status'] = criteria.status;
                if (criteria.jurisdiction)
                    where['jurisdiction'] = criteria.jurisdiction;
                if (criteria.copyrightType)
                    where['copyrightType'] = criteria.copyrightType;
                if (criteria.owner)
                    where['owner'] = { [sequelize_1.Op.iLike]: `%${criteria.owner}%` };
                if (criteria.query) {
                    where[sequelize_1.Op.or] = [
                        { title: { [sequelize_1.Op.iLike]: `%${criteria.query}%` } },
                        { registrationNumber: { [sequelize_1.Op.iLike]: `%${criteria.query}%` } },
                        { workDescription: { [sequelize_1.Op.iLike]: `%${criteria.query}%` } },
                    ];
                }
                const { rows: copyrights, count: total } = await Copyright.findAndCountAll({
                    where,
                    limit: criteria.limit || 50,
                    offset: criteria.offset || 0,
                    order: [['createdAt', 'DESC']],
                });
                return { copyrights, total };
            }
            catch (error) {
                this.logger.error('Error searching copyrights', error);
                throw new common_1.InternalServerErrorException('Failed to search copyrights');
            }
        }
        /**
         * 20. Update copyright status
         */
        async updateCopyrightStatus(copyrightId, status) {
            try {
                const copyright = await Copyright.findByPk(copyrightId);
                if (!copyright)
                    throw new common_1.NotFoundException('Copyright not found');
                copyright.status = status;
                if (status === CopyrightStatus.REGISTERED && !copyright.registrationDate) {
                    copyright.registrationDate = new Date();
                }
                await copyright.save();
                this.logger.log(`Updated copyright ${copyrightId} status to ${status}`);
                return copyright;
            }
            catch (error) {
                this.logger.error('Error updating copyright status', error);
                throw error instanceof common_1.NotFoundException ? error : new common_1.InternalServerErrorException('Failed to update copyright status');
            }
        }
        /**
         * 21. Calculate copyright term
         */
        async calculateCopyrightTerm(copyrightId) {
            try {
                const copyright = await Copyright.findByPk(copyrightId);
                if (!copyright)
                    throw new common_1.NotFoundException('Copyright not found');
                const creationDate = copyright.creationDate || copyright.createdAt;
                let termYears = 70; // Default: life of author + 70 years
                if (copyright.isWorkForHire) {
                    termYears = 95; // Work for hire: 95 years from publication or 120 from creation
                }
                const expirationDate = new Date(creationDate);
                expirationDate.setFullYear(expirationDate.getFullYear() + termYears);
                const now = new Date();
                const yearsRemaining = Math.max(0, expirationDate.getFullYear() - now.getFullYear());
                return {
                    creationDate,
                    expirationDate,
                    yearsRemaining,
                    termType: copyright.isWorkForHire ? 'work_for_hire' : 'author_life_plus_70',
                };
            }
            catch (error) {
                this.logger.error('Error calculating copyright term', error);
                throw error instanceof common_1.NotFoundException ? error : new common_1.InternalServerErrorException('Failed to calculate copyright term');
            }
        }
        /**
         * 22. Assess fair use for copyright
         */
        async assessFairUse(copyrightId, useCase) {
            try {
                const copyright = await Copyright.findByPk(copyrightId);
                if (!copyright)
                    throw new common_1.NotFoundException('Copyright not found');
                // Four factors of fair use analysis
                const factors = {
                    purpose: this.scorePurpose(useCase.purpose),
                    nature: this.scoreNature(useCase.nature, copyright.copyrightType),
                    amount: this.scoreAmount(useCase.amount),
                    effect: this.scoreEffect(useCase.effect),
                };
                const fairUseScore = (factors.purpose + factors.nature + factors.amount + factors.effect) / 4;
                let recommendation = 'Unclear';
                if (fairUseScore >= 75)
                    recommendation = 'Likely fair use';
                else if (fairUseScore >= 50)
                    recommendation = 'Possible fair use - consult attorney';
                else
                    recommendation = 'Unlikely fair use';
                return { fairUseScore, factors, recommendation };
            }
            catch (error) {
                this.logger.error('Error assessing fair use', error);
                throw error instanceof common_1.NotFoundException ? error : new common_1.InternalServerErrorException('Failed to assess fair use');
            }
        }
        scorePurpose(purpose) {
            const educational = /education|research|criticism|commentary|news/i.test(purpose);
            const transformative = /transform|parody|commentary/i.test(purpose);
            const commercial = /commercial|profit|sale/i.test(purpose);
            if (transformative)
                return 90;
            if (educational && !commercial)
                return 80;
            if (educational)
                return 60;
            if (commercial)
                return 30;
            return 50;
        }
        scoreNature(nature, type) {
            const factual = /factual|informational|reference/i.test(nature);
            const creative = /creative|fictional|artistic/i.test(nature);
            if (type === CopyrightType.DATABASE || type === CopyrightType.SOFTWARE)
                return 70;
            if (factual)
                return 75;
            if (creative)
                return 40;
            return 50;
        }
        scoreAmount(amount) {
            const minimal = /minimal|small|excerpt|portion/i.test(amount);
            const substantial = /substantial|whole|entire|complete/i.test(amount);
            if (minimal)
                return 80;
            if (substantial)
                return 20;
            return 50;
        }
        scoreEffect(effect) {
            const noEffect = /no.?effect|minimal|different.?market/i.test(effect);
            const harmful = /harm|substitute|replacement|compete/i.test(effect);
            if (noEffect)
                return 85;
            if (harmful)
                return 15;
            return 50;
        }
    };
    __setFunctionName(_classThis, "CopyrightService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CopyrightService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CopyrightService = _classThis;
})();
exports.CopyrightService = CopyrightService;
/**
 * IP portfolio tracking and analytics service
 */
let IPPortfolioService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var IPPortfolioService = _classThis = class {
        constructor(sequelize, configService) {
            this.sequelize = sequelize;
            this.configService = configService;
            this.logger = new common_1.Logger(IPPortfolioService.name);
        }
        /**
         * 23. Create IP portfolio
         */
        async createPortfolio(data) {
            try {
                const validated = exports.IPPortfolioSchema.parse(data);
                const portfolio = await IPPortfolio.create(validated);
                this.logger.log(`Created IP portfolio: ${portfolio.id}`);
                return portfolio;
            }
            catch (error) {
                this.logger.error('Error creating portfolio', error);
                throw new common_1.BadRequestException('Failed to create portfolio');
            }
        }
        /**
         * 24. Add IP asset to portfolio
         */
        async addAssetToPortfolio(portfolioId, assetType, assetId) {
            try {
                const portfolio = await IPPortfolio.findByPk(portfolioId);
                if (!portfolio)
                    throw new common_1.NotFoundException('Portfolio not found');
                const field = assetType === IPAssetType.PATENT ? 'patents'
                    : assetType === IPAssetType.TRADEMARK ? 'trademarks'
                        : 'copyrights';
                const assets = portfolio[field] || [];
                if (!assets.includes(assetId)) {
                    portfolio[field] = [...assets, assetId];
                    await portfolio.save();
                }
                this.logger.log(`Added ${assetType} ${assetId} to portfolio ${portfolioId}`);
                return portfolio;
            }
            catch (error) {
                this.logger.error('Error adding asset to portfolio', error);
                throw error instanceof common_1.NotFoundException ? error : new common_1.InternalServerErrorException('Failed to add asset to portfolio');
            }
        }
        /**
         * 25. Get portfolio summary with all assets
         */
        async getPortfolioSummary(portfolioId) {
            try {
                const portfolio = await IPPortfolio.findByPk(portfolioId);
                if (!portfolio)
                    throw new common_1.NotFoundException('Portfolio not found');
                const patents = await Patent.findAll({
                    where: { id: { [sequelize_1.Op.in]: portfolio.patents || [] } },
                });
                const trademarks = await Trademark.findAll({
                    where: { id: { [sequelize_1.Op.in]: portfolio.trademarks || [] } },
                });
                const copyrights = await Copyright.findAll({
                    where: { id: { [sequelize_1.Op.in]: portfolio.copyrights || [] } },
                });
                const totalValue = patents.reduce((sum, p) => sum + (p.estimatedValue || 0), 0);
                return {
                    portfolio,
                    patents,
                    trademarks,
                    copyrights,
                    totalValue,
                    assetCounts: {
                        patents: patents.length,
                        trademarks: trademarks.length,
                        copyrights: copyrights.length,
                        total: patents.length + trademarks.length + copyrights.length,
                    },
                };
            }
            catch (error) {
                this.logger.error('Error getting portfolio summary', error);
                throw error instanceof common_1.NotFoundException ? error : new common_1.InternalServerErrorException('Failed to get portfolio summary');
            }
        }
        /**
         * 26. Valuate IP portfolio
         */
        async valuatePortfolio(portfolioId, method = 'cost') {
            try {
                const summary = await this.getPortfolioSummary(portfolioId);
                let patentValue = 0;
                let trademarkValue = 0;
                let copyrightValue = 0;
                if (method === 'cost') {
                    // Cost-based valuation
                    patentValue = summary.patents.length * 50000; // Average cost per patent
                    trademarkValue = summary.trademarks.length * 25000; // Average cost per trademark
                    copyrightValue = summary.copyrights.length * 10000; // Average cost per copyright
                }
                else if (method === 'market') {
                    // Market-based valuation (simplified)
                    patentValue = summary.patents.reduce((sum, p) => sum + (p.estimatedValue || 75000), 0);
                    trademarkValue = summary.trademarks.length * 40000;
                    copyrightValue = summary.copyrights.length * 15000;
                }
                else {
                    // Income-based valuation (simplified)
                    patentValue = summary.patents.length * 100000;
                    trademarkValue = summary.trademarks.length * 60000;
                    copyrightValue = summary.copyrights.length * 20000;
                }
                const totalValue = patentValue + trademarkValue + copyrightValue;
                // Update portfolio
                summary.portfolio.totalValue = totalValue;
                summary.portfolio.lastValuationDate = new Date();
                await summary.portfolio.save();
                return {
                    totalValue,
                    breakdown: {
                        patents: patentValue,
                        trademarks: trademarkValue,
                        copyrights: copyrightValue,
                    },
                    method,
                    valuationDate: new Date(),
                };
            }
            catch (error) {
                this.logger.error('Error valuating portfolio', error);
                throw error instanceof common_1.NotFoundException ? error : new common_1.InternalServerErrorException('Failed to valuate portfolio');
            }
        }
        /**
         * 27. Analyze portfolio risk
         */
        async analyzePortfolioRisk(portfolioId) {
            try {
                const summary = await this.getPortfolioSummary(portfolioId);
                const factors = {};
                // Expiring assets risk
                const expiringPatents = summary.patents.filter(p => {
                    if (!p.expirationDate)
                        return false;
                    const daysUntilExpiry = Math.floor((p.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    return daysUntilExpiry < 365;
                });
                factors.expirationRisk = (expiringPatents.length / Math.max(summary.patents.length, 1)) * 100;
                // Jurisdiction concentration risk
                const jurisdictions = new Set([
                    ...summary.patents.map(p => p.jurisdiction),
                    ...summary.trademarks.map(t => t.jurisdiction),
                ]);
                factors.jurisdictionDiversity = Math.min((jurisdictions.size / 5) * 100, 100);
                // Status risk
                const inactivePatents = summary.patents.filter(p => [PatentStatus.ABANDONED, PatentStatus.REJECTED, PatentStatus.EXPIRED].includes(p.status));
                factors.statusRisk = (inactivePatents.length / Math.max(summary.patents.length, 1)) * 100;
                // Calculate overall risk score (0-100, lower is better)
                const riskScore = (factors.expirationRisk * 0.4 +
                    (100 - factors.jurisdictionDiversity) * 0.3 +
                    factors.statusRisk * 0.3);
                let overallRisk = 'Low';
                if (riskScore > 70)
                    overallRisk = 'High';
                else if (riskScore > 40)
                    overallRisk = 'Medium';
                const recommendations = [];
                if (factors.expirationRisk > 30)
                    recommendations.push('Review and renew expiring patents');
                if (factors.jurisdictionDiversity < 50)
                    recommendations.push('Diversify IP across more jurisdictions');
                if (factors.statusRisk > 20)
                    recommendations.push('Address inactive IP assets');
                return { overallRisk, riskScore, factors, recommendations };
            }
            catch (error) {
                this.logger.error('Error analyzing portfolio risk', error);
                throw error instanceof common_1.NotFoundException ? error : new common_1.InternalServerErrorException('Failed to analyze portfolio risk');
            }
        }
        /**
         * 28. Generate portfolio analytics report
         */
        async generatePortfolioReport(portfolioId) {
            try {
                const summary = await this.getPortfolioSummary(portfolioId);
                const valuation = await this.valuatePortfolio(portfolioId);
                const risk = await this.analyzePortfolioRisk(portfolioId);
                // Patent analytics
                const patentsByStatus = this.groupBy(summary.patents, 'status');
                const patentsByJurisdiction = this.groupBy(summary.patents, 'jurisdiction');
                const patentsByType = this.groupBy(summary.patents, 'patentType');
                // Trademark analytics
                const trademarksByStatus = this.groupBy(summary.trademarks, 'status');
                const trademarksByJurisdiction = this.groupBy(summary.trademarks, 'jurisdiction');
                // Copyright analytics
                const copyrightsByType = this.groupBy(summary.copyrights, 'copyrightType');
                const copyrightsByStatus = this.groupBy(summary.copyrights, 'status');
                return {
                    portfolio: summary.portfolio,
                    summary: {
                        totalAssets: summary.assetCounts.total,
                        totalValue: valuation.totalValue,
                        breakdown: summary.assetCounts,
                    },
                    valuation,
                    risk,
                    analytics: {
                        patents: {
                            total: summary.patents.length,
                            byStatus: patentsByStatus,
                            byJurisdiction: patentsByJurisdiction,
                            byType: patentsByType,
                        },
                        trademarks: {
                            total: summary.trademarks.length,
                            byStatus: trademarksByStatus,
                            byJurisdiction: trademarksByJurisdiction,
                        },
                        copyrights: {
                            total: summary.copyrights.length,
                            byType: copyrightsByType,
                            byStatus: copyrightsByStatus,
                        },
                    },
                    generatedAt: new Date(),
                };
            }
            catch (error) {
                this.logger.error('Error generating portfolio report', error);
                throw error instanceof common_1.NotFoundException ? error : new common_1.InternalServerErrorException('Failed to generate portfolio report');
            }
        }
        groupBy(array, key) {
            return array.reduce((acc, item) => {
                const value = String(item[key]);
                acc[value] = (acc[value] || 0) + 1;
                return acc;
            }, {});
        }
    };
    __setFunctionName(_classThis, "IPPortfolioService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IPPortfolioService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IPPortfolioService = _classThis;
})();
exports.IPPortfolioService = IPPortfolioService;
/**
 * IP action and event tracking service
 */
let IPActionService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var IPActionService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
            this.logger = new common_1.Logger(IPActionService.name);
        }
        /**
         * 29. Create IP action/event
         */
        async createIPAction(data) {
            try {
                const action = await IPAction.create(data);
                this.logger.log(`Created IP action: ${action.id}`);
                return action;
            }
            catch (error) {
                this.logger.error('Error creating IP action', error);
                throw new common_1.BadRequestException('Failed to create IP action');
            }
        }
        /**
         * 30. Get upcoming IP actions (deadlines)
         */
        async getUpcomingActions(daysAhead = 30) {
            try {
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + daysAhead);
                const actions = await IPAction.findAll({
                    where: {
                        dueDate: {
                            [sequelize_1.Op.between]: [new Date(), futureDate],
                        },
                        status: { [sequelize_1.Op.ne]: 'completed' },
                    },
                    include: [
                        { model: Patent, as: 'patent' },
                        { model: Trademark, as: 'trademark' },
                        { model: Copyright, as: 'copyright' },
                    ],
                    order: [['dueDate', 'ASC']],
                });
                return actions;
            }
            catch (error) {
                this.logger.error('Error getting upcoming actions', error);
                throw new common_1.InternalServerErrorException('Failed to get upcoming actions');
            }
        }
        /**
         * 31. Get action history for IP asset
         */
        async getActionHistory(assetType, assetId) {
            try {
                const where = {};
                if (assetType === IPAssetType.PATENT)
                    where['patentId'] = assetId;
                else if (assetType === IPAssetType.TRADEMARK)
                    where['trademarkId'] = assetId;
                else if (assetType === IPAssetType.COPYRIGHT)
                    where['copyrightId'] = assetId;
                const actions = await IPAction.findAll({
                    where,
                    order: [['actionDate', 'DESC']],
                });
                return actions;
            }
            catch (error) {
                this.logger.error('Error getting action history', error);
                throw new common_1.InternalServerErrorException('Failed to get action history');
            }
        }
        /**
         * 32. Calculate total IP maintenance costs
         */
        async calculateMaintenanceCosts(portfolioId, yearAhead = 1) {
            try {
                const futureDate = new Date();
                futureDate.setFullYear(futureDate.getFullYear() + yearAhead);
                const actions = await IPAction.findAll({
                    where: {
                        actionType: {
                            [sequelize_1.Op.in]: [IPActionType.RENEWAL, IPActionType.MAINTENANCE, IPActionType.PAYMENT],
                        },
                        dueDate: {
                            [sequelize_1.Op.between]: [new Date(), futureDate],
                        },
                    },
                    include: [
                        { model: Patent, as: 'patent' },
                        { model: Trademark, as: 'trademark' },
                    ],
                });
                const breakdown = actions.map(action => ({
                    id: action.id,
                    type: action.actionType,
                    assetType: action.patentId ? 'patent' : action.trademarkId ? 'trademark' : 'copyright',
                    dueDate: action.dueDate,
                    cost: action.cost || 0,
                    description: action.description,
                }));
                const totalCost = breakdown.reduce((sum, item) => sum + item.cost, 0);
                const byType = breakdown.reduce((acc, item) => {
                    acc[item.assetType] = (acc[item.assetType] || 0) + item.cost;
                    return acc;
                }, {});
                return { totalCost, breakdown, byType };
            }
            catch (error) {
                this.logger.error('Error calculating maintenance costs', error);
                throw new common_1.InternalServerErrorException('Failed to calculate maintenance costs');
            }
        }
    };
    __setFunctionName(_classThis, "IPActionService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IPActionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IPActionService = _classThis;
})();
exports.IPActionService = IPActionService;
/**
 * IP licensing and assignment service
 */
let IPLicensingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var IPLicensingService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
            this.logger = new common_1.Logger(IPLicensingService.name);
        }
        /**
         * 33. Create IP license agreement
         */
        async createLicenseAgreement(data) {
            try {
                // Would integrate with contract management in production
                const license = {
                    id: crypto.randomUUID(),
                    ...data,
                    status: 'active',
                    effectiveDate: new Date(),
                    createdAt: new Date(),
                };
                this.logger.log(`Created license agreement: ${license.id}`);
                return license;
            }
            catch (error) {
                this.logger.error('Error creating license agreement', error);
                throw new common_1.BadRequestException('Failed to create license agreement');
            }
        }
        /**
         * 34. Track IP assignment/transfer
         */
        async trackIPAssignment(data) {
            try {
                const assignment = {
                    id: crypto.randomUUID(),
                    ...data,
                    recordedAt: new Date(),
                };
                // Update asset owner
                if (data.assetType === IPAssetType.PATENT) {
                    await Patent.update({ assignee: data.toOwner }, { where: { id: data.assetId } });
                }
                else if (data.assetType === IPAssetType.TRADEMARK) {
                    await Trademark.update({ owner: data.toOwner }, { where: { id: data.assetId } });
                }
                else if (data.assetType === IPAssetType.COPYRIGHT) {
                    await Copyright.update({ owner: data.toOwner }, { where: { id: data.assetId } });
                }
                this.logger.log(`Tracked IP assignment: ${assignment.id}`);
                return assignment;
            }
            catch (error) {
                this.logger.error('Error tracking IP assignment', error);
                throw new common_1.BadRequestException('Failed to track IP assignment');
            }
        }
        /**
         * 35. Calculate royalty payments
         */
        async calculateRoyaltyPayments(licenseId, salesData) {
            try {
                // Mock license data - would fetch from database in production
                const license = {
                    royaltyRate: 0.05, // 5%
                    minimumRoyalty: 10000,
                };
                const netSales = salesData.grossSales - (salesData.deductions || 0);
                const royaltyAmount = netSales * license.royaltyRate;
                const paymentDue = Math.max(royaltyAmount, license.minimumRoyalty);
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + 30); // 30 days payment term
                return {
                    netSales,
                    royaltyAmount,
                    minimumRoyalty: license.minimumRoyalty,
                    paymentDue,
                    dueDate,
                };
            }
            catch (error) {
                this.logger.error('Error calculating royalty payments', error);
                throw new common_1.InternalServerErrorException('Failed to calculate royalty payments');
            }
        }
    };
    __setFunctionName(_classThis, "IPLicensingService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IPLicensingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IPLicensingService = _classThis;
})();
exports.IPLicensingService = IPLicensingService;
/**
 * IP infringement detection service
 */
let IPInfringementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var IPInfringementService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
            this.logger = new common_1.Logger(IPInfringementService.name);
        }
        /**
         * 36. Monitor for potential infringement
         */
        async monitorInfringement(assetType, assetId) {
            try {
                // In production, this would integrate with monitoring services
                const potentialInfringements = [];
                if (assetType === IPAssetType.PATENT) {
                    const patent = await Patent.findByPk(assetId);
                    if (patent) {
                        // Monitor new patent applications with similar claims
                        const similar = await Patent.findAll({
                            where: {
                                id: { [sequelize_1.Op.ne]: assetId },
                                status: { [sequelize_1.Op.in]: [PatentStatus.PENDING, PatentStatus.PUBLISHED] },
                                ipcClassifications: {
                                    [sequelize_1.Op.overlap]: patent.ipcClassifications || [],
                                },
                            },
                            limit: 10,
                        });
                        potentialInfringements.push(...similar.map(p => ({
                            type: 'patent',
                            suspectedInfringer: p.assignee,
                            patentNumber: p.patentNumber,
                            similarity: 'high',
                            detectedAt: new Date(),
                        })));
                    }
                }
                else if (assetType === IPAssetType.TRADEMARK) {
                    const trademark = await Trademark.findByPk(assetId);
                    if (trademark) {
                        // Monitor similar trademarks
                        const similar = await Trademark.findAll({
                            where: {
                                id: { [sequelize_1.Op.ne]: assetId },
                                jurisdiction: trademark.jurisdiction,
                                niceClasses: {
                                    [sequelize_1.Op.overlap]: trademark.niceClasses || [],
                                },
                            },
                            limit: 10,
                        });
                        potentialInfringements.push(...similar.map(tm => ({
                            type: 'trademark',
                            suspectedInfringer: tm.owner,
                            markText: tm.markText,
                            similarity: 'medium',
                            detectedAt: new Date(),
                        })));
                    }
                }
                return potentialInfringements;
            }
            catch (error) {
                this.logger.error('Error monitoring infringement', error);
                throw new common_1.InternalServerErrorException('Failed to monitor infringement');
            }
        }
        /**
         * 37. Analyze freedom to operate
         */
        async analyzeFreedomToOperate(technology) {
            try {
                const where = {
                    jurisdiction: technology.jurisdiction,
                    status: { [sequelize_1.Op.in]: [PatentStatus.ACTIVE, PatentStatus.GRANTED] },
                };
                if (technology.ipcClassifications?.length) {
                    where['ipcClassifications'] = {
                        [sequelize_1.Op.overlap]: technology.ipcClassifications,
                    };
                }
                const blockingPatents = await Patent.findAll({ where, limit: 50 });
                let riskLevel = 'Low';
                const recommendations = [];
                if (blockingPatents.length > 20) {
                    riskLevel = 'High';
                    recommendations.push('Consider licensing agreements with patent holders');
                    recommendations.push('Explore design-around options');
                }
                else if (blockingPatents.length > 5) {
                    riskLevel = 'Medium';
                    recommendations.push('Review claims of identified patents in detail');
                    recommendations.push('Consider freedom-to-operate opinion from patent attorney');
                }
                else {
                    recommendations.push('Monitor patent landscape regularly');
                }
                return { riskLevel, blockingPatents, recommendations };
            }
            catch (error) {
                this.logger.error('Error analyzing freedom to operate', error);
                throw new common_1.InternalServerErrorException('Failed to analyze freedom to operate');
            }
        }
    };
    __setFunctionName(_classThis, "IPInfringementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IPInfringementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IPInfringementService = _classThis;
})();
exports.IPInfringementService = IPInfringementService;
/**
 * IP strategic planning service
 */
let IPStrategyService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var IPStrategyService = _classThis = class {
        constructor(sequelize, portfolioService) {
            this.sequelize = sequelize;
            this.portfolioService = portfolioService;
            this.logger = new common_1.Logger(IPStrategyService.name);
        }
        /**
         * 38. Generate patent landscape analysis
         */
        async generatePatentLandscape(criteria) {
            try {
                const where = {};
                if (criteria.jurisdiction)
                    where['jurisdiction'] = criteria.jurisdiction;
                if (criteria.ipcClassifications?.length) {
                    where['ipcClassifications'] = { [sequelize_1.Op.overlap]: criteria.ipcClassifications };
                }
                const patents = await Patent.findAll({ where });
                // Top assignees
                const assigneeCounts = patents.reduce((acc, p) => {
                    if (p.assignee)
                        acc[p.assignee] = (acc[p.assignee] || 0) + 1;
                    return acc;
                }, {});
                const topAssignees = Object.entries(assigneeCounts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([assignee, count]) => ({ assignee, count }));
                // Filing trends by year
                const filingTrends = patents.reduce((acc, p) => {
                    if (p.filingDate) {
                        const year = p.filingDate.getFullYear();
                        acc[year] = (acc[year] || 0) + 1;
                    }
                    return acc;
                }, {});
                // Technology clusters (by IPC)
                const ipcCounts = patents.reduce((acc, p) => {
                    (p.ipcClassifications || []).forEach(ipc => {
                        acc[ipc] = (acc[ipc] || 0) + 1;
                    });
                    return acc;
                }, {});
                const technologyClusters = Object.entries(ipcCounts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([ipc, count]) => ({ classification: ipc, count }));
                // Identify white spaces (areas with fewer patents)
                const whiteSpaces = Object.entries(ipcCounts)
                    .filter(([, count]) => count < 5)
                    .map(([ipc]) => ipc);
                return {
                    totalPatents: patents.length,
                    topAssignees,
                    filingTrends: Object.entries(filingTrends).map(([year, count]) => ({ year: parseInt(year), count })),
                    technologyClusters,
                    whiteSpaces,
                };
            }
            catch (error) {
                this.logger.error('Error generating patent landscape', error);
                throw new common_1.InternalServerErrorException('Failed to generate patent landscape');
            }
        }
        /**
         * 39. Generate IP competitive intelligence report
         */
        async generateCompetitiveIntelligence(competitorIds) {
            try {
                const competitors = [];
                for (const competitorId of competitorIds) {
                    const summary = await this.portfolioService.getPortfolioSummary(competitorId);
                    const valuation = await this.portfolioService.valuatePortfolio(competitorId);
                    competitors.push({
                        portfolioId: competitorId,
                        name: summary.portfolio.name,
                        assetCounts: summary.assetCounts,
                        totalValue: valuation.totalValue,
                        patents: summary.patents.map(p => ({
                            id: p.id,
                            title: p.title,
                            status: p.status,
                            jurisdiction: p.jurisdiction,
                        })),
                    });
                }
                // Comparative analysis
                const comparativeAnalysis = {
                    averagePortfolioSize: competitors.reduce((sum, c) => sum + c.assetCounts.total, 0) / competitors.length,
                    averageValue: competitors.reduce((sum, c) => sum + c.totalValue, 0) / competitors.length,
                    topCompetitorBySize: competitors.sort((a, b) => b.assetCounts.total - a.assetCounts.total)[0],
                    topCompetitorByValue: competitors.sort((a, b) => b.totalValue - a.totalValue)[0],
                };
                // Strategic insights
                const strategicInsights = [
                    `Average competitor has ${Math.round(comparativeAnalysis.averagePortfolioSize)} IP assets`,
                    `Largest portfolio belongs to ${comparativeAnalysis.topCompetitorBySize.name} with ${comparativeAnalysis.topCompetitorBySize.assetCounts.total} assets`,
                    `Most valuable portfolio is ${comparativeAnalysis.topCompetitorByValue.name} at $${comparativeAnalysis.topCompetitorByValue.totalValue.toLocaleString()}`,
                ];
                return { competitors, comparativeAnalysis, strategicInsights };
            }
            catch (error) {
                this.logger.error('Error generating competitive intelligence', error);
                throw new common_1.InternalServerErrorException('Failed to generate competitive intelligence');
            }
        }
        /**
         * 40. Recommend IP portfolio optimization
         */
        async recommendPortfolioOptimization(portfolioId) {
            try {
                const summary = await this.portfolioService.getPortfolioSummary(portfolioId);
                const risk = await this.portfolioService.analyzePortfolioRisk(portfolioId);
                const recommendations = [];
                const priorityActions = [];
                let estimatedSavings = 0;
                // Identify abandoned/expired patents to remove
                const inactivePatents = summary.patents.filter(p => [PatentStatus.ABANDONED, PatentStatus.EXPIRED, PatentStatus.REJECTED].includes(p.status));
                if (inactivePatents.length > 0) {
                    recommendations.push({
                        type: 'cleanup',
                        action: 'Remove inactive patents',
                        count: inactivePatents.length,
                        impact: 'Reduce administrative overhead',
                    });
                    priorityActions.push(`Remove ${inactivePatents.length} inactive patents from portfolio`);
                }
                // Identify patents in single jurisdiction that should be expanded
                const singleJurisdictionPatents = summary.patents.filter(p => {
                    const family = summary.patents.filter(fp => fp.familyId === p.familyId);
                    return family.length === 1 && p.status === PatentStatus.GRANTED;
                });
                if (singleJurisdictionPatents.length > 5) {
                    recommendations.push({
                        type: 'expansion',
                        action: 'File international applications',
                        count: singleJurisdictionPatents.slice(0, 5).length,
                        impact: 'Increase global protection',
                    });
                }
                // Identify expiring assets requiring renewal decisions
                const expiringAssets = summary.patents.filter(p => {
                    if (!p.expirationDate)
                        return false;
                    const daysUntilExpiry = Math.floor((p.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    return daysUntilExpiry < 365 && daysUntilExpiry > 0;
                });
                if (expiringAssets.length > 0) {
                    recommendations.push({
                        type: 'renewal',
                        action: 'Review assets for renewal',
                        count: expiringAssets.length,
                        impact: 'Optimize maintenance costs',
                    });
                    priorityActions.push(`Review ${expiringAssets.length} assets expiring within 1 year`);
                    estimatedSavings = expiringAssets.length * 5000; // Average cost savings per non-renewed patent
                }
                // Identify underutilized assets for licensing
                const underutilizedPatents = summary.patents.filter(p => p.status === PatentStatus.GRANTED && !p.metadata?.licensed);
                if (underutilizedPatents.length > 10) {
                    recommendations.push({
                        type: 'monetization',
                        action: 'Explore licensing opportunities',
                        count: Math.min(underutilizedPatents.length, 20),
                        impact: 'Generate revenue from IP',
                    });
                }
                return {
                    currentState: {
                        totalAssets: summary.assetCounts.total,
                        riskScore: risk.riskScore,
                        riskLevel: risk.overallRisk,
                    },
                    recommendations,
                    priorityActions,
                    estimatedSavings,
                };
            }
            catch (error) {
                this.logger.error('Error recommending portfolio optimization', error);
                throw error instanceof common_1.NotFoundException ? error : new common_1.InternalServerErrorException('Failed to recommend portfolio optimization');
            }
        }
    };
    __setFunctionName(_classThis, "IPStrategyService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IPStrategyService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IPStrategyService = _classThis;
})();
exports.IPStrategyService = IPStrategyService;
// ============================================================================
// NESTJS MODULE
// ============================================================================
let IPManagementModule = (() => {
    let _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({})];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var IPManagementModule = _classThis = class {
        static forRoot() {
            return {
                module: IPManagementModule,
                imports: [config_1.ConfigModule.forFeature(exports.ipManagementConfig)],
                providers: [
                    PatentService,
                    PriorArtSearchService,
                    TrademarkService,
                    CopyrightService,
                    IPPortfolioService,
                    IPActionService,
                    IPLicensingService,
                    IPInfringementService,
                    IPStrategyService,
                ],
                exports: [
                    PatentService,
                    PriorArtSearchService,
                    TrademarkService,
                    CopyrightService,
                    IPPortfolioService,
                    IPActionService,
                    IPLicensingService,
                    IPInfringementService,
                    IPStrategyService,
                ],
            };
        }
    };
    __setFunctionName(_classThis, "IPManagementModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IPManagementModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IPManagementModule = _classThis;
})();
exports.IPManagementModule = IPManagementModule;
// ============================================================================
// EXPORTS
// ============================================================================
exports.IPManagementModels = [
    Patent,
    Trademark,
    Copyright,
    PriorArtSearch,
    IPPortfolio,
    IPAction,
];
exports.IPManagementServices = [
    PatentService,
    PriorArtSearchService,
    TrademarkService,
    CopyrightService,
    IPPortfolioService,
    IPActionService,
    IPLicensingService,
    IPInfringementService,
    IPStrategyService,
];
//# sourceMappingURL=intellectual-property-kit.js.map