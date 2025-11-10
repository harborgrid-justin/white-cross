"use strict";
/**
 * LOC: LEGAL-CIT-001
 * File: /reuse/legal/citation-validation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Legal document management modules
 *   - Case management systems
 *   - Citation tracking services
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
exports.CitationService = exports.ResolveParallelCitationDto = exports.ShepardizeCitationDto = exports.ConvertCitationDto = exports.ValidateCitationDto = exports.CreateCitationDto = exports.LegalAuthority = exports.Citation = exports.ShepardsCode = exports.CitationStatus = exports.CourtType = exports.AuthorityType = exports.CitationFormat = void 0;
exports.parseCaseCitation = parseCaseCitation;
exports.parseStatuteCitation = parseStatuteCitation;
exports.parseGenericCitation = parseGenericCitation;
exports.extractVolumeReporterPage = extractVolumeReporterPage;
exports.validateBluebookCitation = validateBluebookCitation;
exports.checkCitationCompleteness = checkCitationCompleteness;
exports.formatBluebookCitation = formatBluebookCitation;
exports.convertCitationFormat = convertCitationFormat;
exports.generateShortFormCitation = generateShortFormCitation;
exports.normalizeCitation = normalizeCitation;
exports.formatParallelCitations = formatParallelCitations;
exports.resolveParallelCitations = resolveParallelCitations;
exports.findOfficialCitation = findOfficialCitation;
exports.mergeDuplicateCitations = mergeDuplicateCitations;
exports.shepardizeCitation = shepardizeCitation;
exports.hasNegativeTreatment = hasNegativeTreatment;
exports.getCitationTreatmentSummary = getCitationTreatmentSummary;
exports.filterCitingCasesByTreatment = filterCitingCasesByTreatment;
exports.getReporterInfo = getReporterInfo;
exports.getCourtAbbreviation = getCourtAbbreviation;
exports.determineCourtType = determineCourtType;
exports.extractCitationsFromText = extractCitationsFromText;
exports.validateCitationsBulk = validateCitationsBulk;
exports.areCitationsEquivalent = areCitationsEquivalent;
exports.sortCitationsByYear = sortCitationsByYear;
exports.generateCitationId = generateCitationId;
exports.isShortFormCitation = isShortFormCitation;
exports.getCitationAge = getCitationAge;
exports.formatPinpointCitation = formatPinpointCitation;
exports.validateUrlCitation = validateUrlCitation;
exports.generateCitationPermalink = generateCitationPermalink;
/**
 * File: /reuse/legal/citation-validation-kit.ts
 * Locator: WC-UTL-LEGALCIT-001
 * Purpose: Comprehensive Legal Citation Validation and Formatting - Bluebook compliance, citation validation, format conversion
 *
 * Upstream: Independent utility module for legal citation processing and validation
 * Downstream: ../backend/*, legal document services, case management, citation tracking
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, class-validator 0.14.x
 * Exports: 44 utility functions for legal citation validation, formatting, Bluebook compliance, shepardizing, parallel citations
 *
 * LLM Context: Comprehensive legal citation utilities for implementing production-ready citation validation and formatting in legal systems.
 * Provides Bluebook citation validators, format converters, completeness checkers, parallel citation resolvers, shepardizing support,
 * Sequelize models for citations and authorities, NestJS services for citation operations, and Swagger API endpoints. Essential for
 * building compliant legal document management and case tracking systems with proper citation handling.
 */
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const sequelize_typescript_1 = require("sequelize-typescript");
// ============================================================================
// TYPE DEFINITIONS - CITATION FORMATS
// ============================================================================
/**
 * Citation format types supported by the system
 */
var CitationFormat;
(function (CitationFormat) {
    CitationFormat["BLUEBOOK"] = "bluebook";
    CitationFormat["ALWD"] = "alwd";
    CitationFormat["APA"] = "apa";
    CitationFormat["MLA"] = "mla";
    CitationFormat["CHICAGO"] = "chicago";
    CitationFormat["OSCOLA"] = "oscola";
    CitationFormat["AGLC"] = "aglc";
})(CitationFormat || (exports.CitationFormat = CitationFormat = {}));
/**
 * Types of legal authorities that can be cited
 */
var AuthorityType;
(function (AuthorityType) {
    AuthorityType["CASE"] = "case";
    AuthorityType["STATUTE"] = "statute";
    AuthorityType["REGULATION"] = "regulation";
    AuthorityType["CONSTITUTION"] = "constitution";
    AuthorityType["TREATISE"] = "treatise";
    AuthorityType["LAW_REVIEW"] = "law_review";
    AuthorityType["ADMINISTRATIVE"] = "administrative";
    AuthorityType["LEGISLATIVE_HISTORY"] = "legislative_history";
    AuthorityType["SECONDARY_SOURCE"] = "secondary_source";
    AuthorityType["FOREIGN_LAW"] = "foreign_law";
    AuthorityType["INTERNATIONAL"] = "international";
})(AuthorityType || (exports.AuthorityType = AuthorityType = {}));
/**
 * Court types for case citations
 */
var CourtType;
(function (CourtType) {
    CourtType["US_SUPREME_COURT"] = "us_supreme_court";
    CourtType["US_COURT_APPEALS"] = "us_court_appeals";
    CourtType["US_DISTRICT_COURT"] = "us_district_court";
    CourtType["STATE_SUPREME_COURT"] = "state_supreme_court";
    CourtType["STATE_APPELLATE_COURT"] = "state_appellate_court";
    CourtType["STATE_TRIAL_COURT"] = "state_trial_court";
    CourtType["SPECIALIZED_COURT"] = "specialized_court";
})(CourtType || (exports.CourtType = CourtType = {}));
/**
 * Citation validity status
 */
var CitationStatus;
(function (CitationStatus) {
    CitationStatus["VALID"] = "valid";
    CitationStatus["INVALID"] = "invalid";
    CitationStatus["INCOMPLETE"] = "incomplete";
    CitationStatus["AMBIGUOUS"] = "ambiguous";
    CitationStatus["NEEDS_UPDATE"] = "needs_update";
    CitationStatus["OVERRULED"] = "overruled";
    CitationStatus["SUPERSEDED"] = "superseded";
})(CitationStatus || (exports.CitationStatus = CitationStatus = {}));
/**
 * Shepard's treatment codes
 */
var ShepardsCode;
(function (ShepardsCode) {
    ShepardsCode["WARNING"] = "warning";
    ShepardsCode["QUESTIONED"] = "questioned";
    ShepardsCode["CAUTION"] = "caution";
    ShepardsCode["POSITIVE"] = "positive";
    ShepardsCode["CITED"] = "cited";
    ShepardsCode["NEUTRAL"] = "neutral";
})(ShepardsCode || (exports.ShepardsCode = ShepardsCode = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Citation model - stores legal citations
 */
let Citation = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'citations',
            timestamps: true,
            indexes: [
                { fields: ['citation_text'] },
                { fields: ['authority_type'] },
                { fields: ['format'] },
                { fields: ['status'] },
                { fields: ['created_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _citationText_decorators;
    let _citationText_initializers = [];
    let _citationText_extraInitializers = [];
    let _authorityType_decorators;
    let _authorityType_initializers = [];
    let _authorityType_extraInitializers = [];
    let _format_decorators;
    let _format_initializers = [];
    let _format_extraInitializers = [];
    let _parsedData_decorators;
    let _parsedData_initializers = [];
    let _parsedData_extraInitializers = [];
    let _normalizedCitation_decorators;
    let _normalizedCitation_initializers = [];
    let _normalizedCitation_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _validationResult_decorators;
    let _validationResult_initializers = [];
    let _validationResult_extraInitializers = [];
    let _parallelCitations_decorators;
    let _parallelCitations_initializers = [];
    let _parallelCitations_extraInitializers = [];
    let _authorityId_decorators;
    let _authorityId_initializers = [];
    let _authorityId_extraInitializers = [];
    let _authority_decorators;
    let _authority_initializers = [];
    let _authority_extraInitializers = [];
    let _volume_decorators;
    let _volume_initializers = [];
    let _volume_extraInitializers = [];
    let _reporter_decorators;
    let _reporter_initializers = [];
    let _reporter_extraInitializers = [];
    let _page_decorators;
    let _page_initializers = [];
    let _page_extraInitializers = [];
    let _year_decorators;
    let _year_initializers = [];
    let _year_extraInitializers = [];
    let _court_decorators;
    let _court_initializers = [];
    let _court_extraInitializers = [];
    let _shepardizingData_decorators;
    let _shepardizingData_initializers = [];
    let _shepardizingData_extraInitializers = [];
    let _lastShepardized_decorators;
    let _lastShepardized_initializers = [];
    let _lastShepardized_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var Citation = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.citationText = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _citationText_initializers, void 0));
            this.authorityType = (__runInitializers(this, _citationText_extraInitializers), __runInitializers(this, _authorityType_initializers, void 0));
            this.format = (__runInitializers(this, _authorityType_extraInitializers), __runInitializers(this, _format_initializers, void 0));
            this.parsedData = (__runInitializers(this, _format_extraInitializers), __runInitializers(this, _parsedData_initializers, void 0));
            this.normalizedCitation = (__runInitializers(this, _parsedData_extraInitializers), __runInitializers(this, _normalizedCitation_initializers, void 0));
            this.status = (__runInitializers(this, _normalizedCitation_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.validationResult = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _validationResult_initializers, void 0));
            this.parallelCitations = (__runInitializers(this, _validationResult_extraInitializers), __runInitializers(this, _parallelCitations_initializers, void 0));
            this.authorityId = (__runInitializers(this, _parallelCitations_extraInitializers), __runInitializers(this, _authorityId_initializers, void 0));
            this.authority = (__runInitializers(this, _authorityId_extraInitializers), __runInitializers(this, _authority_initializers, void 0));
            this.volume = (__runInitializers(this, _authority_extraInitializers), __runInitializers(this, _volume_initializers, void 0));
            this.reporter = (__runInitializers(this, _volume_extraInitializers), __runInitializers(this, _reporter_initializers, void 0));
            this.page = (__runInitializers(this, _reporter_extraInitializers), __runInitializers(this, _page_initializers, void 0));
            this.year = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _year_initializers, void 0));
            this.court = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _court_initializers, void 0));
            this.shepardizingData = (__runInitializers(this, _court_extraInitializers), __runInitializers(this, _shepardizingData_initializers, void 0));
            this.lastShepardized = (__runInitializers(this, _shepardizingData_extraInitializers), __runInitializers(this, _lastShepardized_initializers, void 0));
            this.metadata = (__runInitializers(this, _lastShepardized_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Citation");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, sequelize_typescript_1.AutoIncrement, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _citationText_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _authorityType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(AuthorityType)))];
        _format_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(CitationFormat)))];
        _parsedData_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _normalizedCitation_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _status_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Default)(CitationStatus.VALID), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(CitationStatus)))];
        _validationResult_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _parallelCitations_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _authorityId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => LegalAuthority), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _authority_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => LegalAuthority)];
        _volume_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _reporter_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _page_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _year_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _court_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _shepardizingData_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _lastShepardized_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _citationText_decorators, { kind: "field", name: "citationText", static: false, private: false, access: { has: obj => "citationText" in obj, get: obj => obj.citationText, set: (obj, value) => { obj.citationText = value; } }, metadata: _metadata }, _citationText_initializers, _citationText_extraInitializers);
        __esDecorate(null, null, _authorityType_decorators, { kind: "field", name: "authorityType", static: false, private: false, access: { has: obj => "authorityType" in obj, get: obj => obj.authorityType, set: (obj, value) => { obj.authorityType = value; } }, metadata: _metadata }, _authorityType_initializers, _authorityType_extraInitializers);
        __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
        __esDecorate(null, null, _parsedData_decorators, { kind: "field", name: "parsedData", static: false, private: false, access: { has: obj => "parsedData" in obj, get: obj => obj.parsedData, set: (obj, value) => { obj.parsedData = value; } }, metadata: _metadata }, _parsedData_initializers, _parsedData_extraInitializers);
        __esDecorate(null, null, _normalizedCitation_decorators, { kind: "field", name: "normalizedCitation", static: false, private: false, access: { has: obj => "normalizedCitation" in obj, get: obj => obj.normalizedCitation, set: (obj, value) => { obj.normalizedCitation = value; } }, metadata: _metadata }, _normalizedCitation_initializers, _normalizedCitation_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _validationResult_decorators, { kind: "field", name: "validationResult", static: false, private: false, access: { has: obj => "validationResult" in obj, get: obj => obj.validationResult, set: (obj, value) => { obj.validationResult = value; } }, metadata: _metadata }, _validationResult_initializers, _validationResult_extraInitializers);
        __esDecorate(null, null, _parallelCitations_decorators, { kind: "field", name: "parallelCitations", static: false, private: false, access: { has: obj => "parallelCitations" in obj, get: obj => obj.parallelCitations, set: (obj, value) => { obj.parallelCitations = value; } }, metadata: _metadata }, _parallelCitations_initializers, _parallelCitations_extraInitializers);
        __esDecorate(null, null, _authorityId_decorators, { kind: "field", name: "authorityId", static: false, private: false, access: { has: obj => "authorityId" in obj, get: obj => obj.authorityId, set: (obj, value) => { obj.authorityId = value; } }, metadata: _metadata }, _authorityId_initializers, _authorityId_extraInitializers);
        __esDecorate(null, null, _authority_decorators, { kind: "field", name: "authority", static: false, private: false, access: { has: obj => "authority" in obj, get: obj => obj.authority, set: (obj, value) => { obj.authority = value; } }, metadata: _metadata }, _authority_initializers, _authority_extraInitializers);
        __esDecorate(null, null, _volume_decorators, { kind: "field", name: "volume", static: false, private: false, access: { has: obj => "volume" in obj, get: obj => obj.volume, set: (obj, value) => { obj.volume = value; } }, metadata: _metadata }, _volume_initializers, _volume_extraInitializers);
        __esDecorate(null, null, _reporter_decorators, { kind: "field", name: "reporter", static: false, private: false, access: { has: obj => "reporter" in obj, get: obj => obj.reporter, set: (obj, value) => { obj.reporter = value; } }, metadata: _metadata }, _reporter_initializers, _reporter_extraInitializers);
        __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: obj => "page" in obj, get: obj => obj.page, set: (obj, value) => { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
        __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: obj => "year" in obj, get: obj => obj.year, set: (obj, value) => { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
        __esDecorate(null, null, _court_decorators, { kind: "field", name: "court", static: false, private: false, access: { has: obj => "court" in obj, get: obj => obj.court, set: (obj, value) => { obj.court = value; } }, metadata: _metadata }, _court_initializers, _court_extraInitializers);
        __esDecorate(null, null, _shepardizingData_decorators, { kind: "field", name: "shepardizingData", static: false, private: false, access: { has: obj => "shepardizingData" in obj, get: obj => obj.shepardizingData, set: (obj, value) => { obj.shepardizingData = value; } }, metadata: _metadata }, _shepardizingData_initializers, _shepardizingData_extraInitializers);
        __esDecorate(null, null, _lastShepardized_decorators, { kind: "field", name: "lastShepardized", static: false, private: false, access: { has: obj => "lastShepardized" in obj, get: obj => obj.lastShepardized, set: (obj, value) => { obj.lastShepardized = value; } }, metadata: _metadata }, _lastShepardized_initializers, _lastShepardized_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Citation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Citation = _classThis;
})();
exports.Citation = Citation;
/**
 * Legal Authority model - stores information about legal authorities
 */
let LegalAuthority = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'legal_authorities',
            timestamps: true,
            indexes: [
                { fields: ['authority_type'] },
                { fields: ['court_type'] },
                { fields: ['jurisdiction'] },
                { fields: ['year'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _authorityType_decorators;
    let _authorityType_initializers = [];
    let _authorityType_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _courtType_decorators;
    let _courtType_initializers = [];
    let _courtType_extraInitializers = [];
    let _jurisdiction_decorators;
    let _jurisdiction_initializers = [];
    let _jurisdiction_extraInitializers = [];
    let _year_decorators;
    let _year_initializers = [];
    let _year_extraInitializers = [];
    let _officialCitation_decorators;
    let _officialCitation_initializers = [];
    let _officialCitation_extraInitializers = [];
    let _alternateCitations_decorators;
    let _alternateCitations_initializers = [];
    let _alternateCitations_extraInitializers = [];
    let _westlawCitation_decorators;
    let _westlawCitation_initializers = [];
    let _westlawCitation_extraInitializers = [];
    let _lexisCitation_decorators;
    let _lexisCitation_initializers = [];
    let _lexisCitation_extraInitializers = [];
    let _url_decorators;
    let _url_initializers = [];
    let _url_extraInitializers = [];
    let _summary_decorators;
    let _summary_initializers = [];
    let _summary_extraInitializers = [];
    let _headnotes_decorators;
    let _headnotes_initializers = [];
    let _headnotes_extraInitializers = [];
    let _citations_decorators;
    let _citations_initializers = [];
    let _citations_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var LegalAuthority = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.authorityType = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _authorityType_initializers, void 0));
            this.name = (__runInitializers(this, _authorityType_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.courtType = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _courtType_initializers, void 0));
            this.jurisdiction = (__runInitializers(this, _courtType_extraInitializers), __runInitializers(this, _jurisdiction_initializers, void 0));
            this.year = (__runInitializers(this, _jurisdiction_extraInitializers), __runInitializers(this, _year_initializers, void 0));
            this.officialCitation = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _officialCitation_initializers, void 0));
            this.alternateCitations = (__runInitializers(this, _officialCitation_extraInitializers), __runInitializers(this, _alternateCitations_initializers, void 0));
            this.westlawCitation = (__runInitializers(this, _alternateCitations_extraInitializers), __runInitializers(this, _westlawCitation_initializers, void 0));
            this.lexisCitation = (__runInitializers(this, _westlawCitation_extraInitializers), __runInitializers(this, _lexisCitation_initializers, void 0));
            this.url = (__runInitializers(this, _lexisCitation_extraInitializers), __runInitializers(this, _url_initializers, void 0));
            this.summary = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _summary_initializers, void 0));
            this.headnotes = (__runInitializers(this, _summary_extraInitializers), __runInitializers(this, _headnotes_initializers, void 0));
            this.citations = (__runInitializers(this, _headnotes_extraInitializers), __runInitializers(this, _citations_initializers, void 0));
            this.metadata = (__runInitializers(this, _citations_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "LegalAuthority");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, sequelize_typescript_1.AutoIncrement, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _authorityType_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(AuthorityType)))];
        _name_decorators = [(0, sequelize_typescript_1.AllowNull)(false), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _courtType_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(CourtType)))];
        _jurisdiction_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING)];
        _year_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER)];
        _officialCitation_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _alternateCitations_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _westlawCitation_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _lexisCitation_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _url_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _summary_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT)];
        _headnotes_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _citations_decorators = [(0, sequelize_typescript_1.HasMany)(() => Citation)];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _authorityType_decorators, { kind: "field", name: "authorityType", static: false, private: false, access: { has: obj => "authorityType" in obj, get: obj => obj.authorityType, set: (obj, value) => { obj.authorityType = value; } }, metadata: _metadata }, _authorityType_initializers, _authorityType_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _courtType_decorators, { kind: "field", name: "courtType", static: false, private: false, access: { has: obj => "courtType" in obj, get: obj => obj.courtType, set: (obj, value) => { obj.courtType = value; } }, metadata: _metadata }, _courtType_initializers, _courtType_extraInitializers);
        __esDecorate(null, null, _jurisdiction_decorators, { kind: "field", name: "jurisdiction", static: false, private: false, access: { has: obj => "jurisdiction" in obj, get: obj => obj.jurisdiction, set: (obj, value) => { obj.jurisdiction = value; } }, metadata: _metadata }, _jurisdiction_initializers, _jurisdiction_extraInitializers);
        __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: obj => "year" in obj, get: obj => obj.year, set: (obj, value) => { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
        __esDecorate(null, null, _officialCitation_decorators, { kind: "field", name: "officialCitation", static: false, private: false, access: { has: obj => "officialCitation" in obj, get: obj => obj.officialCitation, set: (obj, value) => { obj.officialCitation = value; } }, metadata: _metadata }, _officialCitation_initializers, _officialCitation_extraInitializers);
        __esDecorate(null, null, _alternateCitations_decorators, { kind: "field", name: "alternateCitations", static: false, private: false, access: { has: obj => "alternateCitations" in obj, get: obj => obj.alternateCitations, set: (obj, value) => { obj.alternateCitations = value; } }, metadata: _metadata }, _alternateCitations_initializers, _alternateCitations_extraInitializers);
        __esDecorate(null, null, _westlawCitation_decorators, { kind: "field", name: "westlawCitation", static: false, private: false, access: { has: obj => "westlawCitation" in obj, get: obj => obj.westlawCitation, set: (obj, value) => { obj.westlawCitation = value; } }, metadata: _metadata }, _westlawCitation_initializers, _westlawCitation_extraInitializers);
        __esDecorate(null, null, _lexisCitation_decorators, { kind: "field", name: "lexisCitation", static: false, private: false, access: { has: obj => "lexisCitation" in obj, get: obj => obj.lexisCitation, set: (obj, value) => { obj.lexisCitation = value; } }, metadata: _metadata }, _lexisCitation_initializers, _lexisCitation_extraInitializers);
        __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: obj => "url" in obj, get: obj => obj.url, set: (obj, value) => { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
        __esDecorate(null, null, _summary_decorators, { kind: "field", name: "summary", static: false, private: false, access: { has: obj => "summary" in obj, get: obj => obj.summary, set: (obj, value) => { obj.summary = value; } }, metadata: _metadata }, _summary_initializers, _summary_extraInitializers);
        __esDecorate(null, null, _headnotes_decorators, { kind: "field", name: "headnotes", static: false, private: false, access: { has: obj => "headnotes" in obj, get: obj => obj.headnotes, set: (obj, value) => { obj.headnotes = value; } }, metadata: _metadata }, _headnotes_initializers, _headnotes_extraInitializers);
        __esDecorate(null, null, _citations_decorators, { kind: "field", name: "citations", static: false, private: false, access: { has: obj => "citations" in obj, get: obj => obj.citations, set: (obj, value) => { obj.citations = value; } }, metadata: _metadata }, _citations_initializers, _citations_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LegalAuthority = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LegalAuthority = _classThis;
})();
exports.LegalAuthority = LegalAuthority;
// ============================================================================
// DTO CLASSES FOR API
// ============================================================================
/**
 * DTO for creating a citation
 */
let CreateCitationDto = (() => {
    var _a;
    let _citationText_decorators;
    let _citationText_initializers = [];
    let _citationText_extraInitializers = [];
    let _authorityType_decorators;
    let _authorityType_initializers = [];
    let _authorityType_extraInitializers = [];
    let _format_decorators;
    let _format_initializers = [];
    let _format_extraInitializers = [];
    let _authorityId_decorators;
    let _authorityId_initializers = [];
    let _authorityId_extraInitializers = [];
    return _a = class CreateCitationDto {
            constructor() {
                this.citationText = __runInitializers(this, _citationText_initializers, void 0);
                this.authorityType = (__runInitializers(this, _citationText_extraInitializers), __runInitializers(this, _authorityType_initializers, void 0));
                this.format = (__runInitializers(this, _authorityType_extraInitializers), __runInitializers(this, _format_initializers, void 0));
                this.authorityId = (__runInitializers(this, _format_extraInitializers), __runInitializers(this, _authorityId_initializers, void 0));
                __runInitializers(this, _authorityId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _citationText_decorators = [(0, swagger_1.ApiProperty)({ description: 'Citation text', example: 'Brown v. Board of Education, 347 U.S. 483 (1954)' }), (0, class_validator_1.IsString)()];
            _authorityType_decorators = [(0, swagger_1.ApiProperty)({ enum: AuthorityType, description: 'Type of legal authority' }), (0, class_validator_1.IsEnum)(AuthorityType)];
            _format_decorators = [(0, swagger_1.ApiProperty)({ enum: CitationFormat, description: 'Citation format' }), (0, class_validator_1.IsEnum)(CitationFormat)];
            _authorityId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Associated authority ID' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _citationText_decorators, { kind: "field", name: "citationText", static: false, private: false, access: { has: obj => "citationText" in obj, get: obj => obj.citationText, set: (obj, value) => { obj.citationText = value; } }, metadata: _metadata }, _citationText_initializers, _citationText_extraInitializers);
            __esDecorate(null, null, _authorityType_decorators, { kind: "field", name: "authorityType", static: false, private: false, access: { has: obj => "authorityType" in obj, get: obj => obj.authorityType, set: (obj, value) => { obj.authorityType = value; } }, metadata: _metadata }, _authorityType_initializers, _authorityType_extraInitializers);
            __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
            __esDecorate(null, null, _authorityId_decorators, { kind: "field", name: "authorityId", static: false, private: false, access: { has: obj => "authorityId" in obj, get: obj => obj.authorityId, set: (obj, value) => { obj.authorityId = value; } }, metadata: _metadata }, _authorityId_initializers, _authorityId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCitationDto = CreateCitationDto;
/**
 * DTO for validating a citation
 */
let ValidateCitationDto = (() => {
    var _a;
    let _citationText_decorators;
    let _citationText_initializers = [];
    let _citationText_extraInitializers = [];
    let _format_decorators;
    let _format_initializers = [];
    let _format_extraInitializers = [];
    let _authorityType_decorators;
    let _authorityType_initializers = [];
    let _authorityType_extraInitializers = [];
    let _strict_decorators;
    let _strict_initializers = [];
    let _strict_extraInitializers = [];
    return _a = class ValidateCitationDto {
            constructor() {
                this.citationText = __runInitializers(this, _citationText_initializers, void 0);
                this.format = (__runInitializers(this, _citationText_extraInitializers), __runInitializers(this, _format_initializers, void 0));
                this.authorityType = (__runInitializers(this, _format_extraInitializers), __runInitializers(this, _authorityType_initializers, void 0));
                this.strict = (__runInitializers(this, _authorityType_extraInitializers), __runInitializers(this, _strict_initializers, void 0));
                __runInitializers(this, _strict_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _citationText_decorators = [(0, swagger_1.ApiProperty)({ description: 'Citation text to validate' }), (0, class_validator_1.IsString)()];
            _format_decorators = [(0, swagger_1.ApiProperty)({ enum: CitationFormat, description: 'Expected citation format' }), (0, class_validator_1.IsEnum)(CitationFormat)];
            _authorityType_decorators = [(0, swagger_1.ApiProperty)({ enum: AuthorityType, description: 'Type of legal authority' }), (0, class_validator_1.IsEnum)(AuthorityType)];
            _strict_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Whether to perform strict validation' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _citationText_decorators, { kind: "field", name: "citationText", static: false, private: false, access: { has: obj => "citationText" in obj, get: obj => obj.citationText, set: (obj, value) => { obj.citationText = value; } }, metadata: _metadata }, _citationText_initializers, _citationText_extraInitializers);
            __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
            __esDecorate(null, null, _authorityType_decorators, { kind: "field", name: "authorityType", static: false, private: false, access: { has: obj => "authorityType" in obj, get: obj => obj.authorityType, set: (obj, value) => { obj.authorityType = value; } }, metadata: _metadata }, _authorityType_initializers, _authorityType_extraInitializers);
            __esDecorate(null, null, _strict_decorators, { kind: "field", name: "strict", static: false, private: false, access: { has: obj => "strict" in obj, get: obj => obj.strict, set: (obj, value) => { obj.strict = value; } }, metadata: _metadata }, _strict_initializers, _strict_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ValidateCitationDto = ValidateCitationDto;
/**
 * DTO for converting citation format
 */
let ConvertCitationDto = (() => {
    var _a;
    let _sourceCitation_decorators;
    let _sourceCitation_initializers = [];
    let _sourceCitation_extraInitializers = [];
    let _sourceFormat_decorators;
    let _sourceFormat_initializers = [];
    let _sourceFormat_extraInitializers = [];
    let _targetFormat_decorators;
    let _targetFormat_initializers = [];
    let _targetFormat_extraInitializers = [];
    let _preserveParallels_decorators;
    let _preserveParallels_initializers = [];
    let _preserveParallels_extraInitializers = [];
    let _includeUrl_decorators;
    let _includeUrl_initializers = [];
    let _includeUrl_extraInitializers = [];
    return _a = class ConvertCitationDto {
            constructor() {
                this.sourceCitation = __runInitializers(this, _sourceCitation_initializers, void 0);
                this.sourceFormat = (__runInitializers(this, _sourceCitation_extraInitializers), __runInitializers(this, _sourceFormat_initializers, void 0));
                this.targetFormat = (__runInitializers(this, _sourceFormat_extraInitializers), __runInitializers(this, _targetFormat_initializers, void 0));
                this.preserveParallels = (__runInitializers(this, _targetFormat_extraInitializers), __runInitializers(this, _preserveParallels_initializers, void 0));
                this.includeUrl = (__runInitializers(this, _preserveParallels_extraInitializers), __runInitializers(this, _includeUrl_initializers, void 0));
                __runInitializers(this, _includeUrl_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _sourceCitation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Source citation text' }), (0, class_validator_1.IsString)()];
            _sourceFormat_decorators = [(0, swagger_1.ApiProperty)({ enum: CitationFormat, description: 'Source format' }), (0, class_validator_1.IsEnum)(CitationFormat)];
            _targetFormat_decorators = [(0, swagger_1.ApiProperty)({ enum: CitationFormat, description: 'Target format' }), (0, class_validator_1.IsEnum)(CitationFormat)];
            _preserveParallels_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Preserve parallel citations' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _includeUrl_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Include URL if available' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _sourceCitation_decorators, { kind: "field", name: "sourceCitation", static: false, private: false, access: { has: obj => "sourceCitation" in obj, get: obj => obj.sourceCitation, set: (obj, value) => { obj.sourceCitation = value; } }, metadata: _metadata }, _sourceCitation_initializers, _sourceCitation_extraInitializers);
            __esDecorate(null, null, _sourceFormat_decorators, { kind: "field", name: "sourceFormat", static: false, private: false, access: { has: obj => "sourceFormat" in obj, get: obj => obj.sourceFormat, set: (obj, value) => { obj.sourceFormat = value; } }, metadata: _metadata }, _sourceFormat_initializers, _sourceFormat_extraInitializers);
            __esDecorate(null, null, _targetFormat_decorators, { kind: "field", name: "targetFormat", static: false, private: false, access: { has: obj => "targetFormat" in obj, get: obj => obj.targetFormat, set: (obj, value) => { obj.targetFormat = value; } }, metadata: _metadata }, _targetFormat_initializers, _targetFormat_extraInitializers);
            __esDecorate(null, null, _preserveParallels_decorators, { kind: "field", name: "preserveParallels", static: false, private: false, access: { has: obj => "preserveParallels" in obj, get: obj => obj.preserveParallels, set: (obj, value) => { obj.preserveParallels = value; } }, metadata: _metadata }, _preserveParallels_initializers, _preserveParallels_extraInitializers);
            __esDecorate(null, null, _includeUrl_decorators, { kind: "field", name: "includeUrl", static: false, private: false, access: { has: obj => "includeUrl" in obj, get: obj => obj.includeUrl, set: (obj, value) => { obj.includeUrl = value; } }, metadata: _metadata }, _includeUrl_initializers, _includeUrl_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ConvertCitationDto = ConvertCitationDto;
/**
 * DTO for shepardizing a citation
 */
let ShepardizeCitationDto = (() => {
    var _a;
    let _citation_decorators;
    let _citation_initializers = [];
    let _citation_extraInitializers = [];
    let _includeHistory_decorators;
    let _includeHistory_initializers = [];
    let _includeHistory_extraInitializers = [];
    let _maxDepth_decorators;
    let _maxDepth_initializers = [];
    let _maxDepth_extraInitializers = [];
    return _a = class ShepardizeCitationDto {
            constructor() {
                this.citation = __runInitializers(this, _citation_initializers, void 0);
                this.includeHistory = (__runInitializers(this, _citation_extraInitializers), __runInitializers(this, _includeHistory_initializers, void 0));
                this.maxDepth = (__runInitializers(this, _includeHistory_extraInitializers), __runInitializers(this, _maxDepth_initializers, void 0));
                __runInitializers(this, _maxDepth_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _citation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Citation to shepardize' }), (0, class_validator_1.IsString)()];
            _includeHistory_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Include full history' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _maxDepth_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Maximum depth of citing cases' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10)];
            __esDecorate(null, null, _citation_decorators, { kind: "field", name: "citation", static: false, private: false, access: { has: obj => "citation" in obj, get: obj => obj.citation, set: (obj, value) => { obj.citation = value; } }, metadata: _metadata }, _citation_initializers, _citation_extraInitializers);
            __esDecorate(null, null, _includeHistory_decorators, { kind: "field", name: "includeHistory", static: false, private: false, access: { has: obj => "includeHistory" in obj, get: obj => obj.includeHistory, set: (obj, value) => { obj.includeHistory = value; } }, metadata: _metadata }, _includeHistory_initializers, _includeHistory_extraInitializers);
            __esDecorate(null, null, _maxDepth_decorators, { kind: "field", name: "maxDepth", static: false, private: false, access: { has: obj => "maxDepth" in obj, get: obj => obj.maxDepth, set: (obj, value) => { obj.maxDepth = value; } }, metadata: _metadata }, _maxDepth_initializers, _maxDepth_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ShepardizeCitationDto = ShepardizeCitationDto;
/**
 * DTO for parallel citation resolution
 */
let ResolveParallelCitationDto = (() => {
    var _a;
    let _primaryCitation_decorators;
    let _primaryCitation_initializers = [];
    let _primaryCitation_extraInitializers = [];
    let _includeUnofficial_decorators;
    let _includeUnofficial_initializers = [];
    let _includeUnofficial_extraInitializers = [];
    let _includeRegional_decorators;
    let _includeRegional_initializers = [];
    let _includeRegional_extraInitializers = [];
    return _a = class ResolveParallelCitationDto {
            constructor() {
                this.primaryCitation = __runInitializers(this, _primaryCitation_initializers, void 0);
                this.includeUnofficial = (__runInitializers(this, _primaryCitation_extraInitializers), __runInitializers(this, _includeUnofficial_initializers, void 0));
                this.includeRegional = (__runInitializers(this, _includeUnofficial_extraInitializers), __runInitializers(this, _includeRegional_initializers, void 0));
                __runInitializers(this, _includeRegional_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _primaryCitation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Primary citation' }), (0, class_validator_1.IsString)()];
            _includeUnofficial_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Include unofficial reporters' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _includeRegional_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Include regional reporters' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _primaryCitation_decorators, { kind: "field", name: "primaryCitation", static: false, private: false, access: { has: obj => "primaryCitation" in obj, get: obj => obj.primaryCitation, set: (obj, value) => { obj.primaryCitation = value; } }, metadata: _metadata }, _primaryCitation_initializers, _primaryCitation_extraInitializers);
            __esDecorate(null, null, _includeUnofficial_decorators, { kind: "field", name: "includeUnofficial", static: false, private: false, access: { has: obj => "includeUnofficial" in obj, get: obj => obj.includeUnofficial, set: (obj, value) => { obj.includeUnofficial = value; } }, metadata: _metadata }, _includeUnofficial_initializers, _includeUnofficial_extraInitializers);
            __esDecorate(null, null, _includeRegional_decorators, { kind: "field", name: "includeRegional", static: false, private: false, access: { has: obj => "includeRegional" in obj, get: obj => obj.includeRegional, set: (obj, value) => { obj.includeRegional = value; } }, metadata: _metadata }, _includeRegional_initializers, _includeRegional_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ResolveParallelCitationDto = ResolveParallelCitationDto;
// ============================================================================
// CITATION PARSING FUNCTIONS
// ============================================================================
/**
 * Parse a case citation into structured components
 */
function parseCaseCitation(citation) {
    try {
        // Bluebook format: Case Name, Volume Reporter Page (Court Year)
        const casePattern = /^(.+?),\s*(\d+)\s+([A-Za-z0-9.]+)\s+(\d+)(?:,\s*(\d+))?\s*\(([^)]*?)\s*(\d{4})\)$/;
        const match = citation.trim().match(casePattern);
        if (!match) {
            return null;
        }
        const [, caseName, volume, reporter, page, pinpoint, court, year] = match;
        return {
            caseName: caseName.trim(),
            volume: volume.trim(),
            reporter: reporter.trim(),
            page: page.trim(),
            pinpoint: pinpoint?.trim(),
            court: court?.trim(),
            year: year.trim(),
        };
    }
    catch (error) {
        return null;
    }
}
/**
 * Parse a statute citation into structured components
 */
function parseStatuteCitation(citation) {
    try {
        // Format: Title Code § Section (Year)
        const statutePattern = /^(\d+)\s+([A-Za-z.]+)\s+§\s*(\d+(?:[A-Za-z])?(?:-\d+)?(?:\([a-z0-9]+\))?)(?:\s*\((\d{4})\))?$/;
        const match = citation.trim().match(statutePattern);
        if (!match) {
            return null;
        }
        const [, title, code, section, year] = match;
        return {
            title: title.trim(),
            code: code.trim(),
            section: section.trim(),
            year: year?.trim(),
        };
    }
    catch (error) {
        return null;
    }
}
/**
 * Parse any citation type and return structured data
 */
function parseGenericCitation(citation, authorityType) {
    switch (authorityType) {
        case AuthorityType.CASE:
            return parseCaseCitation(citation);
        case AuthorityType.STATUTE:
        case AuthorityType.REGULATION:
            return parseStatuteCitation(citation);
        default:
            return null;
    }
}
/**
 * Extract volume, reporter, and page from citation
 */
function extractVolumeReporterPage(citation) {
    const pattern = /(\d+)\s+([A-Za-z0-9.]+)\s+(\d+)/;
    const match = citation.match(pattern);
    if (!match) {
        return null;
    }
    return {
        volume: match[1],
        reporter: match[2],
        page: match[3],
    };
}
// ============================================================================
// BLUEBOOK VALIDATION FUNCTIONS
// ============================================================================
/**
 * Validate citation against Bluebook rules
 */
function validateBluebookCitation(citation, authorityType) {
    const errors = [];
    const warnings = [];
    // Parse the citation
    const parsed = parseGenericCitation(citation, authorityType);
    if (!parsed) {
        errors.push({
            field: 'citation',
            message: 'Unable to parse citation format',
            rule: 'R10/R12',
            severity: 'error',
        });
        return {
            isValid: false,
            errors,
            warnings,
            formattedCitation: citation,
            rule: 'R10',
        };
    }
    // Validate based on authority type
    if (authorityType === AuthorityType.CASE) {
        validateBluebookCase(parsed, errors, warnings);
    }
    else if (authorityType === AuthorityType.STATUTE) {
        validateBluebookStatute(parsed, errors, warnings);
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        formattedCitation: formatBluebookCitation(parsed, authorityType),
        rule: authorityType === AuthorityType.CASE ? 'R10' : 'R12',
    };
}
/**
 * Validate Bluebook case citation rules
 */
function validateBluebookCase(parsed, errors, warnings) {
    // Check case name formatting
    if (!parsed.caseName || parsed.caseName.length === 0) {
        errors.push({
            field: 'caseName',
            message: 'Case name is required',
            rule: 'R10.2',
            severity: 'error',
        });
    }
    // Check for proper italicization hint
    if (parsed.caseName && !parsed.caseName.includes('v.')) {
        warnings.push({
            field: 'caseName',
            message: 'Case name should include "v." between parties',
            suggestion: 'Ensure proper party separation',
        });
    }
    // Validate reporter abbreviation
    if (!isValidReporterAbbreviation(parsed.reporter)) {
        warnings.push({
            field: 'reporter',
            message: `Reporter abbreviation "${parsed.reporter}" may not be standard`,
            suggestion: 'Verify reporter abbreviation in Table T1',
        });
    }
    // Check year format
    if (!/^\d{4}$/.test(parsed.year)) {
        errors.push({
            field: 'year',
            message: 'Year must be four digits',
            rule: 'R10.5',
            severity: 'error',
        });
    }
    // Validate pinpoint citation format
    if (parsed.pinpoint && !/^\d+(-\d+)?$/.test(parsed.pinpoint)) {
        warnings.push({
            field: 'pinpoint',
            message: 'Pinpoint citation format may be incorrect',
            suggestion: 'Use format: 123 or 123-125',
        });
    }
}
/**
 * Validate Bluebook statute citation rules
 */
function validateBluebookStatute(parsed, errors, warnings) {
    // Check title
    if (!parsed.title || !/^\d+$/.test(parsed.title)) {
        errors.push({
            field: 'title',
            message: 'Title must be numeric',
            rule: 'R12',
            severity: 'error',
        });
    }
    // Check code abbreviation
    if (!isValidCodeAbbreviation(parsed.code)) {
        warnings.push({
            field: 'code',
            message: `Code abbreviation "${parsed.code}" may not be standard`,
            suggestion: 'Verify code abbreviation in Table T1',
        });
    }
    // Check section symbol
    if (!parsed.section) {
        errors.push({
            field: 'section',
            message: 'Section number is required',
            rule: 'R12.9',
            severity: 'error',
        });
    }
}
/**
 * Check if reporter abbreviation is valid
 */
function isValidReporterAbbreviation(reporter) {
    const commonReporters = [
        'U.S.', 'S.Ct.', 'L.Ed.', 'L.Ed.2d',
        'F.', 'F.2d', 'F.3d', 'F.4th',
        'F.Supp.', 'F.Supp.2d', 'F.Supp.3d',
        'P.', 'P.2d', 'P.3d',
        'N.E.', 'N.E.2d', 'N.E.3d',
        'S.E.', 'S.E.2d',
        'So.', 'So.2d', 'So.3d',
        'A.', 'A.2d', 'A.3d',
        'N.W.', 'N.W.2d',
        'S.W.', 'S.W.2d', 'S.W.3d',
    ];
    return commonReporters.includes(reporter);
}
/**
 * Check if code abbreviation is valid
 */
function isValidCodeAbbreviation(code) {
    const commonCodes = [
        'U.S.C.', 'U.S.C.A.', 'U.S.C.S.',
        'C.F.R.',
        'Stat.',
        'Pub.L.',
    ];
    return commonCodes.includes(code);
}
/**
 * Validate citation completeness
 */
function checkCitationCompleteness(citation, authorityType) {
    const missingElements = [];
    const warnings = [];
    const suggestions = [];
    const parsed = parseGenericCitation(citation, authorityType);
    if (!parsed) {
        return {
            isComplete: false,
            missingElements: ['Unable to parse citation'],
            warnings: ['Citation format not recognized'],
            suggestions: ['Verify citation follows standard format'],
            confidence: 0,
        };
    }
    if (authorityType === AuthorityType.CASE) {
        const caseParsed = parsed;
        if (!caseParsed.caseName)
            missingElements.push('Case name');
        if (!caseParsed.volume)
            missingElements.push('Volume');
        if (!caseParsed.reporter)
            missingElements.push('Reporter');
        if (!caseParsed.page)
            missingElements.push('Page');
        if (!caseParsed.year)
            missingElements.push('Year');
        if (!caseParsed.court)
            warnings.push('Court information missing - may be required for lower courts');
    }
    else if (authorityType === AuthorityType.STATUTE) {
        const statuteParsed = parsed;
        if (!statuteParsed.title)
            missingElements.push('Title');
        if (!statuteParsed.code)
            missingElements.push('Code');
        if (!statuteParsed.section)
            missingElements.push('Section');
        if (!statuteParsed.year)
            warnings.push('Year missing - recommended for currency');
    }
    const confidence = Math.max(0, 1 - (missingElements.length * 0.2 + warnings.length * 0.1));
    return {
        isComplete: missingElements.length === 0,
        missingElements,
        warnings,
        suggestions,
        confidence,
    };
}
// ============================================================================
// CITATION FORMATTING FUNCTIONS
// ============================================================================
/**
 * Format citation according to Bluebook rules
 */
function formatBluebookCitation(parsed, authorityType) {
    if (authorityType === AuthorityType.CASE) {
        const caseParsed = parsed;
        const pinpoint = caseParsed.pinpoint ? `, ${caseParsed.pinpoint}` : '';
        const court = caseParsed.court ? `${caseParsed.court} ` : '';
        return `${caseParsed.caseName}, ${caseParsed.volume} ${caseParsed.reporter} ${caseParsed.page}${pinpoint} (${court}${caseParsed.year})`;
    }
    else {
        const statuteParsed = parsed;
        const year = statuteParsed.year ? ` (${statuteParsed.year})` : '';
        return `${statuteParsed.title} ${statuteParsed.code} § ${statuteParsed.section}${year}`;
    }
}
/**
 * Convert citation from one format to another
 */
function convertCitationFormat(citation, sourceFormat, targetFormat, authorityType) {
    // Parse the source citation
    const parsed = parseGenericCitation(citation, authorityType);
    if (!parsed) {
        throw new Error('Unable to parse source citation');
    }
    // Convert based on target format
    switch (targetFormat) {
        case CitationFormat.BLUEBOOK:
            return formatBluebookCitation(parsed, authorityType);
        case CitationFormat.ALWD:
            return formatALWDCitation(parsed, authorityType);
        case CitationFormat.APA:
            return formatAPACitation(parsed, authorityType);
        default:
            return citation;
    }
}
/**
 * Format citation according to ALWD rules
 */
function formatALWDCitation(parsed, authorityType) {
    // ALWD is similar to Bluebook with some differences
    return formatBluebookCitation(parsed, authorityType);
}
/**
 * Format citation according to APA rules
 */
function formatAPACitation(parsed, authorityType) {
    if (authorityType === AuthorityType.CASE) {
        const caseParsed = parsed;
        // APA format: Case Name, Volume Reporter Page (Court Year)
        return `${caseParsed.caseName}, ${caseParsed.volume} ${caseParsed.reporter} ${caseParsed.page} (${caseParsed.year})`;
    }
    else {
        const statuteParsed = parsed;
        return `${statuteParsed.title} ${statuteParsed.code} § ${statuteParsed.section} (${statuteParsed.year || 'n.d.'})`;
    }
}
/**
 * Generate short form citation
 */
function generateShortFormCitation(fullCitation, authorityType) {
    const parsed = parseGenericCitation(fullCitation, authorityType);
    if (!parsed) {
        return fullCitation;
    }
    if (authorityType === AuthorityType.CASE) {
        const caseParsed = parsed;
        // Short form: First party name, volume reporter at page
        const firstParty = caseParsed.caseName.split('v.')[0].trim();
        return `${firstParty}, ${caseParsed.volume} ${caseParsed.reporter} at ${caseParsed.page}`;
    }
    else {
        const statuteParsed = parsed;
        // Short form: Title Code § Section
        return `${statuteParsed.title} ${statuteParsed.code} § ${statuteParsed.section}`;
    }
}
/**
 * Normalize citation for comparison
 */
function normalizeCitation(citation) {
    return citation
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[,()]/g, '')
        .trim();
}
/**
 * Format parallel citations
 */
function formatParallelCitations(primary, parallels) {
    const parallelStrings = parallels.map((p) => `${p.volume} ${p.reporter} ${p.page}`);
    return `${primary}, ${parallelStrings.join(', ')}`;
}
// ============================================================================
// PARALLEL CITATION FUNCTIONS
// ============================================================================
/**
 * Resolve parallel citations for a case
 */
function resolveParallelCitations(citation) {
    // This would typically connect to a legal database API (Westlaw, LexisNexis)
    // For now, return mock data structure
    const parallels = [];
    const parsed = parseCaseCitation(citation);
    if (!parsed) {
        return parallels;
    }
    // Example: Add parallel citations based on reporter type
    if (parsed.reporter === 'U.S.') {
        // U.S. cases have S.Ct. and L.Ed. parallels
        parallels.push({
            volume: parsed.volume,
            reporter: 'S.Ct.',
            page: parsed.page,
            isOfficial: false,
        });
    }
    return parallels;
}
/**
 * Find official citation from parallel citations
 */
function findOfficialCitation(citations) {
    const officialReporters = ['U.S.', 'F.', 'F.2d', 'F.3d', 'F.4th'];
    for (const citation of citations) {
        const parsed = parseCaseCitation(citation);
        if (parsed && officialReporters.includes(parsed.reporter)) {
            return citation;
        }
    }
    return citations[0] || null;
}
/**
 * Merge duplicate citations
 */
function mergeDuplicateCitations(citations) {
    const normalized = new Map();
    for (const citation of citations) {
        const key = normalizeCitation(citation);
        if (!normalized.has(key)) {
            normalized.set(key, citation);
        }
    }
    return Array.from(normalized.values());
}
// ============================================================================
// SHEPARDIZING FUNCTIONS
// ============================================================================
/**
 * Shepardize a citation (check treatment by subsequent cases)
 */
async function shepardizeCitation(citation) {
    // This would typically connect to a legal research service (Shepard's, KeyCite)
    // For now, return mock structure
    const parsed = parseCaseCitation(citation);
    if (!parsed) {
        throw new Error('Invalid citation for shepardizing');
    }
    return {
        citationId: `${parsed.volume}-${parsed.reporter}-${parsed.page}`,
        status: ShepardsCode.CITED,
        treatments: [],
        citingCases: [],
        history: [],
        lastChecked: new Date(),
    };
}
/**
 * Check if citation has negative treatment
 */
function hasNegativeTreatment(shepardResult) {
    const negativeCodes = [ShepardsCode.WARNING, ShepardsCode.QUESTIONED, ShepardsCode.CAUTION];
    return negativeCodes.includes(shepardResult.status);
}
/**
 * Get citation treatment summary
 */
function getCitationTreatmentSummary(shepardResult) {
    const statusDescriptions = {
        [ShepardsCode.WARNING]: 'Negative treatment - may not be good law',
        [ShepardsCode.QUESTIONED]: 'Validity questioned by subsequent cases',
        [ShepardsCode.CAUTION]: 'Possible negative treatment exists',
        [ShepardsCode.POSITIVE]: 'Positive treatment by subsequent cases',
        [ShepardsCode.CITED]: 'Cited by subsequent cases',
        [ShepardsCode.NEUTRAL]: 'Neutral analytical treatment',
    };
    return statusDescriptions[shepardResult.status] || 'Unknown treatment';
}
/**
 * Filter citing cases by treatment type
 */
function filterCitingCasesByTreatment(citingCases, treatment) {
    return citingCases.filter((c) => c.treatment.toLowerCase().includes(treatment.toLowerCase()));
}
// ============================================================================
// REPORTER AND JURISDICTION FUNCTIONS
// ============================================================================
/**
 * Get reporter information
 */
function getReporterInfo(abbreviation) {
    const reporters = {
        'U.S.': {
            abbreviation: 'U.S.',
            fullName: 'United States Reports',
            type: 'official',
            jurisdiction: 'federal',
        },
        'S.Ct.': {
            abbreviation: 'S.Ct.',
            fullName: 'Supreme Court Reporter',
            type: 'unofficial',
            jurisdiction: 'federal',
        },
        'F.3d': {
            abbreviation: 'F.3d',
            fullName: 'Federal Reporter, Third Series',
            type: 'official',
            jurisdiction: 'federal',
        },
        'P.3d': {
            abbreviation: 'P.3d',
            fullName: 'Pacific Reporter, Third Series',
            type: 'regional',
            jurisdiction: 'western states',
        },
    };
    return reporters[abbreviation] || null;
}
/**
 * Get court abbreviation for Bluebook
 */
function getCourtAbbreviation(courtType, jurisdiction) {
    const abbreviations = {
        [CourtType.US_SUPREME_COURT]: '',
        [CourtType.US_COURT_APPEALS]: `${jurisdiction || ''} Cir.`,
        [CourtType.US_DISTRICT_COURT]: `${jurisdiction || ''} Dist.`,
        [CourtType.STATE_SUPREME_COURT]: `${jurisdiction || ''}`,
        [CourtType.STATE_APPELLATE_COURT]: `${jurisdiction || ''} App.`,
        [CourtType.STATE_TRIAL_COURT]: `${jurisdiction || ''} Trial`,
        [CourtType.SPECIALIZED_COURT]: `${jurisdiction || ''}`,
    };
    return abbreviations[courtType] || '';
}
/**
 * Determine court type from citation
 */
function determineCourtType(citation) {
    const parsed = parseCaseCitation(citation);
    if (!parsed) {
        return null;
    }
    // Determine by reporter
    if (parsed.reporter === 'U.S.') {
        return CourtType.US_SUPREME_COURT;
    }
    else if (parsed.reporter.match(/^F\.\d*(d|th)?$/)) {
        return CourtType.US_COURT_APPEALS;
    }
    else if (parsed.reporter.match(/^F\.Supp/)) {
        return CourtType.US_DISTRICT_COURT;
    }
    return null;
}
// ============================================================================
// CITATION EXTRACTION AND ANALYSIS
// ============================================================================
/**
 * Extract all citations from text
 */
function extractCitationsFromText(text) {
    const citations = [];
    // Pattern for case citations
    const casePattern = /[A-Z][a-z]+\s+v\.\s+[A-Z][a-z]+,\s*\d+\s+[A-Za-z0-9.]+\s+\d+(?:,\s*\d+)?\s*\([^)]*\d{4}\)/g;
    const caseMatches = text.match(casePattern);
    if (caseMatches) {
        citations.push(...caseMatches);
    }
    // Pattern for statute citations
    const statutePattern = /\d+\s+[A-Z.]+\s+§\s*\d+[A-Za-z0-9()-]*/g;
    const statuteMatches = text.match(statutePattern);
    if (statuteMatches) {
        citations.push(...statuteMatches);
    }
    return citations;
}
/**
 * Validate multiple citations in bulk
 */
function validateCitationsBulk(citations, authorityType) {
    const results = new Map();
    for (const citation of citations) {
        const validation = validateBluebookCitation(citation, authorityType);
        results.set(citation, validation);
    }
    return results;
}
/**
 * Compare two citations for equivalence
 */
function areCitationsEquivalent(citation1, citation2) {
    return normalizeCitation(citation1) === normalizeCitation(citation2);
}
/**
 * Sort citations by year
 */
function sortCitationsByYear(citations, ascending = true) {
    return [...citations].sort((a, b) => {
        const yearA = extractYear(a);
        const yearB = extractYear(b);
        if (!yearA || !yearB)
            return 0;
        return ascending ? yearA - yearB : yearB - yearA;
    });
}
/**
 * Extract year from citation
 */
function extractYear(citation) {
    const yearMatch = citation.match(/\((\d{4})\)/);
    return yearMatch ? parseInt(yearMatch[1], 10) : null;
}
// ============================================================================
// NESTJS SERVICE
// ============================================================================
/**
 * Citation validation and management service
 */
let CitationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CitationService = _classThis = class {
        /**
         * Validate a citation
         */
        async validateCitation(dto) {
            return validateBluebookCitation(dto.citationText, dto.authorityType);
        }
        /**
         * Convert citation format
         */
        async convertCitation(dto) {
            return convertCitationFormat(dto.sourceCitation, dto.sourceFormat, dto.targetFormat, AuthorityType.CASE);
        }
        /**
         * Check citation completeness
         */
        async checkCompleteness(citation, authorityType) {
            return checkCitationCompleteness(citation, authorityType);
        }
        /**
         * Shepardize citation
         */
        async shepardize(dto) {
            return await shepardizeCitation(dto.citation);
        }
        /**
         * Resolve parallel citations
         */
        async resolveParallels(dto) {
            return resolveParallelCitations(dto.primaryCitation);
        }
        /**
         * Create citation record
         */
        async createCitation(dto) {
            const parsed = parseGenericCitation(dto.citationText, dto.authorityType);
            const validation = validateBluebookCitation(dto.citationText, dto.authorityType);
            const citation = await Citation.create({
                citationText: dto.citationText,
                authorityType: dto.authorityType,
                format: dto.format,
                parsedData: parsed || undefined,
                normalizedCitation: normalizeCitation(dto.citationText),
                status: validation.isValid ? CitationStatus.VALID : CitationStatus.INVALID,
                validationResult: validation,
                authorityId: dto.authorityId,
            });
            return citation;
        }
        /**
         * Extract citations from document text
         */
        async extractCitations(text) {
            return extractCitationsFromText(text);
        }
        /**
         * Batch validate citations
         */
        async batchValidate(citations, authorityType) {
            return validateCitationsBulk(citations, authorityType);
        }
    };
    __setFunctionName(_classThis, "CitationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CitationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CitationService = _classThis;
})();
exports.CitationService = CitationService;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Generate citation ID from components
 */
function generateCitationId(volume, reporter, page) {
    return `${volume}-${reporter.replace(/\./g, '')}-${page}`;
}
/**
 * Check if citation is a short form
 */
function isShortFormCitation(citation) {
    // Short forms typically use "at" or "Id."
    return citation.includes(' at ') || citation.startsWith('Id.');
}
/**
 * Get citation age in years
 */
function getCitationAge(citation) {
    const year = extractYear(citation);
    if (!year)
        return null;
    return new Date().getFullYear() - year;
}
/**
 * Format pinpoint citation
 */
function formatPinpointCitation(baseCitation, pages) {
    if (pages.length === 0)
        return baseCitation;
    const pinpoint = pages.length === 1 ? pages[0].toString() : `${pages[0]}-${pages[pages.length - 1]}`;
    // Insert pinpoint after the page number
    const parsed = parseCaseCitation(baseCitation);
    if (!parsed)
        return baseCitation;
    return `${parsed.caseName}, ${parsed.volume} ${parsed.reporter} ${parsed.page}, ${pinpoint} (${parsed.court || ''} ${parsed.year})`;
}
/**
 * Validate URL citation format
 */
function validateUrlCitation(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    }
    catch {
        return false;
    }
}
/**
 * Generate permalink for citation
 */
function generateCitationPermalink(citation, service) {
    const normalized = normalizeCitation(citation);
    const encoded = encodeURIComponent(citation);
    const baseUrls = {
        westlaw: 'https://1.next.westlaw.com/Search/Results.html?query=',
        lexis: 'https://advance.lexis.com/search/?query=',
        google: 'https://scholar.google.com/scholar?q=',
    };
    return `${baseUrls[service]}${encoded}`;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    Citation,
    LegalAuthority,
    // DTOs
    CreateCitationDto,
    ValidateCitationDto,
    ConvertCitationDto,
    ShepardizeCitationDto,
    ResolveParallelCitationDto,
    // Services
    CitationService,
    // Parsing functions
    parseCaseCitation,
    parseStatuteCitation,
    parseGenericCitation,
    extractVolumeReporterPage,
    // Validation functions
    validateBluebookCitation,
    checkCitationCompleteness,
    validateCitationsBulk,
    // Formatting functions
    formatBluebookCitation,
    convertCitationFormat,
    generateShortFormCitation,
    normalizeCitation,
    formatParallelCitations,
    formatPinpointCitation,
    // Parallel citation functions
    resolveParallelCitations,
    findOfficialCitation,
    mergeDuplicateCitations,
    // Shepardizing functions
    shepardizeCitation,
    hasNegativeTreatment,
    getCitationTreatmentSummary,
    filterCitingCasesByTreatment,
    // Reporter functions
    getReporterInfo,
    getCourtAbbreviation,
    determineCourtType,
    // Extraction and analysis
    extractCitationsFromText,
    areCitationsEquivalent,
    sortCitationsByYear,
    // Utility functions
    generateCitationId,
    isShortFormCitation,
    getCitationAge,
    validateUrlCitation,
    generateCitationPermalink,
};
//# sourceMappingURL=citation-validation-kit.js.map